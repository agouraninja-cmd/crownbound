import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { LAYOUT, houseToWorld } from './layout.js';
import { bakeDeep } from './meshUtils.js';
import { raiseHouse, houseColliders, turnedRect } from './cottage.js';
import { HOUSES } from './houses/index.js';

// The neighbours' houses, assembled: each of the 24 plots in LAYOUT.houses is
// built by its own file (src/scene/houses/<id>.js) out of the cottage and toft
// kits, stood on its plot, and baked into the row it belongs to — a couple of
// draw calls a row, however much stands in the yards. Returns
//   group      everything, to add to the scene
//   colliders  one turned rect a house, and whatever in its yard stops a man
//   smokes     [{ x, y, z }] where a lit hearth's smoke leaves a roof
//   setNight   (0 day … 1 night) lights the doorways and windows from within
//   sight      (x, y, z, dx, dy, dz, length) how far a line is clear of the houses — the camera's guard
//   houses     [{ id, x, z, floor }] as stood (the smoke suite reads it)

const SMALL = 0.36; // nothing shorter than this on every side throws a shadow worth drawing
const EAVE = 0.3; // how far the thatch overhangs the walls, near enough
const STEEP = 1.15; // a line climbing faster than this (the thatch's own slope) clears a roof it meets above the eaves

// a doorway by day, and with the hearth showing through it after dark
const DARK_WITHIN = new THREE.Color(0x2a1c12);
const FIRE_WITHIN = new THREE.Color(0xe08a34);

// What a doorway or window shows (written into `into`): the dark within by
// day; after dark the hearth's light, by how well `lit` the house is (0–1).
// A cold house's openings sink with the night — they are unlit pieces, and a
// brown that is dark at noon would glow against a wall at midnight.
export function openingColour(lit, night, into) {
  return into.copy(DARK_WITHIN).multiplyScalar(1 - 0.8 * night).lerp(FIRE_WITHIN, night * lit);
}

// Lift the unlit pieces (doorways, windows; embers) out of a built house as
// geometry in the world, each carrying what `tint` says of its mesh.
function gather(list, into, tint) {
  for (const m of list) {
    m.updateWorldMatrix(true, false);
    const geo = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
    geo.applyMatrix4(m.matrixWorld);
    for (const name of Object.keys(geo.attributes)) if (name !== 'position') geo.deleteAttribute(name);
    into.push({ geo, value: tint(m) });
    m.parent.remove(m);
  }
}

export function buildVillage(terrainHeight) {
  const group = new THREE.Group();
  group.name = 'village';
  const rows = new Map();
  const colliders = [];
  const smokes = [];
  const houses = [];
  const blocks = []; // each house as the camera's guard knows it: its footprint out to the eaves, and how high it stands
  const windows = []; // { geo, value: how brightly it is lit after dark }
  const embers = []; // { geo, value: its colour }

  for (const plot of LAYOUT.houses) {
    const { c, floor } = raiseHouse(plot, HOUSES[plot.id], terrainHeight);
    if (!rows.has(plot.row)) {
      const row = new THREE.Group();
      row.name = `row-${plot.row}`;
      rows.set(plot.row, row);
      group.add(row);
    }
    rows.get(plot.row).add(c.g);
    c.g.updateMatrixWorld(true);
    gather(c.openings, windows, (m) => m.userData.lit ?? 0);
    gather(c.embers, embers, (m) => m.material.color.clone());
    colliders.push(...houseColliders(plot, c));
    // what the eye may not pass: the house itself (its yard is low enough to see over)
    blocks.push({ ...turnedRect(plot.x, plot.z, plot.length / 2 + EAVE, plot.width / 2 + EAVE, plot.rotY), eave: floor + c.eave + 0.5, top: floor + c.peak + 0.45 });
    for (const s of c.smokes) {
      const p = houseToWorld(plot, s.u, s.v);
      smokes.push({ x: p.x, y: floor + s.y, z: p.z });
    }
    houses.push({ id: plot.id, x: plot.x, z: plot.z, floor });
  }
  // each row one batch; its small pieces are shaded but throw no shadow (the sun draws far less)
  for (const row of rows.values()) bakeDeep(row, { smallBelow: SMALL });

  // every doorway and window in the village is one unlit mesh; night relights it
  let lit = null;
  if (windows.length) {
    const merged = mergeGeometries(windows.map((w) => w.geo), false);
    const colours = new Float32Array(merged.attributes.position.count * 3);
    merged.setAttribute('color', new THREE.BufferAttribute(colours, 3));
    const glow = new THREE.Mesh(merged, new THREE.MeshBasicMaterial({ vertexColors: true }));
    glow.name = 'village-windows';
    group.add(glow);
    const c = new THREE.Color();
    lit = (night) => {
      let o = 0;
      for (const w of windows) {
        openingColour(w.value, night, c);
        for (let i = 0; i < w.geo.attributes.position.count; i++, o += 3) {
          colours[o] = c.r;
          colours[o + 1] = c.g;
          colours[o + 2] = c.b;
        }
      }
      merged.attributes.color.needsUpdate = true;
    };
    lit(0);
  }
  if (embers.length) {
    for (const e of embers) {
      const colours = new Float32Array(e.geo.attributes.position.count * 3);
      for (let i = 0; i < colours.length; i += 3) colours.set([e.value.r, e.value.g, e.value.b], i);
      e.geo.setAttribute('color', new THREE.BufferAttribute(colours, 3));
    }
    const fire = new THREE.Mesh(mergeGeometries(embers.map((e) => e.geo), false), new THREE.MeshBasicMaterial({ vertexColors: true }));
    fire.name = 'village-embers';
    group.add(fire);
  }

  // How much of the line from (x, y, z) along the unit way (dx, dy, dz), `length`
  // long, runs clear before it meets a house. A line that reaches a house above
  // its ridge, or above its eaves and climbing more steeply than its thatch,
  // passes over it.
  function sight(x, y, z, dx, dy, dz, length) {
    let clear = length;
    const climb = dy / (Math.hypot(dx, dz) || 1e-6);
    for (const b of blocks) {
      const ox = x - b.x;
      const oz = z - b.z;
      if (ox * ox + oz * oz > (length + 8) * (length + 8)) continue;
      // the line in the house's own frame, where its footprint is an upright rect
      const pu = ox * b.cos - oz * b.sin;
      const pw = ox * b.sin + oz * b.cos;
      const du = dx * b.cos - dz * b.sin;
      const dw = dx * b.sin + dz * b.cos;
      let enter = 0;
      let leave = clear;
      for (const [p, d, half] of [[pu, du, b.halfX], [pw, dw, b.halfZ]]) {
        if (Math.abs(d) < 1e-6) {
          if (Math.abs(p) > half) enter = Infinity;
          continue;
        }
        const t0 = (-half - p) / d;
        const t1 = (half - p) / d;
        enter = Math.max(enter, Math.min(t0, t1));
        leave = Math.min(leave, Math.max(t0, t1));
      }
      if (enter >= leave) continue; // it misses this house
      const at = y + dy * enter; // how high the line is where it meets the eaves' line
      if (at > b.top || (at > b.eave && climb > STEEP)) continue;
      clear = enter;
    }
    return clear;
  }

  return { group, colliders, smokes, houses, sight, setNight: (night) => lit?.(night) };
}
