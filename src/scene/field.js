import * as THREE from 'three';
import { LAYOUT, FIELD, fieldToWorld, worldToField } from './layout.js';
import { terrainHeight } from './terrain.js';
import { makeRng, makeBatch, soup, tintFaces, mesh, bake, tone, hash2 } from './meshUtils.js';
import { withWind } from './wind.js';
import { box, cyl, WOOD, WOOD_DARK, STRAW, THATCH_PALE, ROPE, EYE } from './kit.js';

// The miller's strip: a few ridges of ploughland that change with the work
// done on them. state.js decides how each ridge looks (farmRowLooks); this
// file only knows how to draw the seven looks:
//
//   stubble  cut straw on flat, dry ground — fallow, wanting the hoe
//   furrow   a freshly turned ridge
//   sown     the ridge raked over, seed lying on it
//   weedy    green shoots, and weeds come up among them
//   tended   the shoots alone, taller, the earth dark with water
//   ripe     standing wheat
//   stook    stubble again, the sheaves stood up to dry
//
// The whole field is two meshes — the earth (bed, ridges, sheaves) and what
// grows from it (straw, shoots, weeds, wheat, all leaning with the wind) —
// rebuilt from nothing whenever a ridge changes, which is a few times a day.
// Everything is built in world coordinates, as the wind shader expects.

const TAU = Math.PI * 2;
const HL = FIELD.halfLength;
const HW = FIELD.halfWidth;
const SPACING = LAYOUT.field.spacing;

// heights above the ground
const LIP = 0.3; // the bed's edge slopes into the ground this far out
const SUNK = -0.1; // ...ending this far under it
const TROUGH = 0.06; // between ridges
const CREST = 0.19; // a ridge's top
const FLAT = 0.085; // unploughed ground

const RIDGED = new Set(['furrow', 'sown', 'weedy', 'tended', 'ripe']);
const EARTH = {
  stubble: 0x8a7350, // dry and pale
  stook: 0x8a7350,
  furrow: 0x4a3524, // fresh-turned, dark
  sown: 0x5e4733, // raked
  weedy: 0x533d2a,
  tended: 0x3d2c1f, // watered
  ripe: 0x5d4830,
};
const HEADLAND = 0x6b553b; // the trodden edge

const rgb = (hex) => {
  const c = new THREE.Color(hex);
  return [c.r, c.g, c.b];
};
const STRAW_ROOT = rgb(0xa08a52);
const STRAW_TIP = rgb(0xdcc680);
const SEED = rgb(0xdcc68c);
const SHOOT_ROOT = rgb(0x3f6e2c);
const SHOOT_TIP = rgb(0xa2cc5e);
const WEED_ROOT = rgb(0x2f4c26);
const WEED_TIP = rgb(0x6c8a3a);
const WEED_FLOWER = rgb(0xe6cb3c);
const STALK_ROOT = rgb(0x9a8a3e);
const STALK_TIP = rgb(0xd9b550);
const EAR = rgb(0xe2bf55);
const EAR_TIP = rgb(0xf3de8e);

// ---------- the earth ----------

// How high the worked earth stands above the ground at (u, v), by the look of
// the ridge it falls in. Ridges die away into the headland at both ends.
function earthRise(looks, u, v) {
  if (Math.abs(u) > HL + 1e-3 || Math.abs(v) > HW + 1e-3) return SUNK;
  if (Math.abs(u) > HL - 1e-3) return TROUGH;
  const row = Math.min(FIELD.rows - 1, Math.max(0, Math.floor((v + HW) / SPACING)));
  const t = Math.min(1, Math.abs(v - FIELD.rowV(row)) / (SPACING / 2)); // 0 on the crest … 1 in the trough
  return RIDGED.has(looks[row]) ? TROUGH + (CREST - TROUGH) * (1 - t * t) : FLAT - (FLAT - TROUGH) * t * t;
}

// The bed as a faceted heightfield laid over the ground, one colour a facet.
function earthGeometry(looks) {
  const us = [-HL - LIP];
  for (let u = -HL; u < HL + 1e-3; u += 0.4) us.push(u);
  us.push(HL + LIP);
  const vs = [-HW - LIP];
  for (let v = -HW; v < HW + 1e-3; v += SPACING / 4) vs.push(v);
  vs.push(HW + LIP);

  // every grid point once, in the world
  const pts = us.map((u, i) =>
    vs.map((v, j) => {
      const w = fieldToWorld(u, v);
      const onBed = i > 0 && i < us.length - 1 && j > 0 && j < vs.length - 1;
      const rough = onBed ? (hash2(i * 7 + 3, j * 11 + 5) - 0.5) * 0.035 : 0; // worked by hand, not by rule
      return [w.x, terrainHeight(w.x, w.z) + earthRise(looks, u, v) + rough, w.z];
    })
  );

  const position = [];
  const color = [];
  const c = new THREE.Color();
  const facet = (a, b, d, uc, vc, key) => {
    const offBed = Math.abs(uc) > HL || Math.abs(vc) > HW;
    if (offBed) {
      c.set(HEADLAND);
    } else {
      const row = Math.min(FIELD.rows - 1, Math.max(0, Math.floor((vc + HW) / SPACING)));
      const t = Math.abs(vc - FIELD.rowV(row)) / (SPACING / 2);
      c.set(EARTH[looks[row]]);
      if (RIDGED.has(looks[row])) c.multiplyScalar(t > 0.5 ? 0.8 : 1.08); // dark in the trough, lit on the crest
    }
    c.multiplyScalar(0.88 + hash2(key, key * 3 + 1) * 0.24);
    for (const p of [a, b, d]) {
      position.push(p[0], p[1], p[2]);
      color.push(c.r, c.g, c.b);
    }
  };
  for (let i = 0; i < us.length - 1; i++) {
    for (let j = 0; j < vs.length - 1; j++) {
      const uc = (us[i] + us[i + 1]) / 2;
      const vc = (vs[j] + vs[j + 1]) / 2;
      const key = i * 53 + j;
      // wound to face the sky: (here, +v, +u)
      facet(pts[i][j], pts[i][j + 1], pts[i + 1][j], uc, vc, key * 2);
      facet(pts[i + 1][j], pts[i][j + 1], pts[i + 1][j + 1], uc, vc, key * 2 + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
  return geo;
}

// A bound sheaf stood on end: a straw skirt, and a head of ears flaring above the tie.
function addStook(batch, rng, u, v) {
  const w = fieldToWorld(u, v);
  const place = { x: w.x, y: terrainHeight(w.x, w.z) + FLAT - 0.02, z: w.z, ry: rng() * TAU, rz: (rng() - 0.5) * 0.16, s: 1.25 };
  const skirt = soup(new THREE.CylinderGeometry(0.075, 0.2, 0.44, 6));
  skirt.translate(0, 0.22, 0);
  const head = soup(new THREE.CylinderGeometry(0.19, 0.075, 0.24, 6));
  head.translate(0, 0.56, 0);
  const shade = 0.9 + rng() * 0.2;
  for (const [geo, hex] of [[skirt, STRAW], [head, THATCH_PALE]]) {
    tintFaces(geo, (x, y, z, ny, out) => out.set(hex).multiplyScalar(shade * (0.86 + hash2(Math.round(x * 90 + y * 40), Math.round(z * 90)) * 0.26)));
    batch.add(geo, place);
  }
}

// ---------- what grows ----------

// Collects blades for one mesh: plain triangles carrying a colour and a wind weight.
function makeGrowth() {
  const position = [];
  const color = [];
  const sway = [];
  const vert = (x, y, z, col, s) => {
    position.push(x, y, z);
    color.push(col[0], col[1], col[2]);
    sway.push(s);
  };
  return {
    // one blade rooted at (x, y, z): `h` tall, `w` to each side of its root,
    // its tip leaning `lean` off the upright. ang turns it about the upright.
    blade(x, y, z, ang, w, h, lean, root, tip, free) {
      const ax = Math.cos(ang) * w;
      const az = Math.sin(ang) * w;
      const tx = x - Math.sin(ang) * lean;
      const tz = z + Math.cos(ang) * lean;
      vert(x - ax, y, z - az, root, 0);
      vert(x + ax, y, z + az, root, 0);
      vert(tx, y + h, tz, tip, free);
      return [tx, y + h, tz];
    },
    // a slim kite standing on a blade's tip: an ear of wheat, a weed's flower
    kite(tip, ang, w, h, nod, from, to, free) {
      const [x, y, z] = tip;
      const ax = Math.cos(ang) * w;
      const az = Math.sin(ang) * w;
      const ex = x - Math.sin(ang) * nod;
      const ez = z + Math.cos(ang) * nod;
      const mx = (x + ex) / 2;
      const mz = (z + ez) / 2;
      const my = y + h * 0.45;
      vert(x, y - h * 0.1, z, from, free * 0.9);
      vert(mx + ax, my, mz + az, from, free * 0.95);
      vert(ex, y + h, ez, to, free);
      vert(x, y - h * 0.1, z, from, free * 0.9);
      vert(ex, y + h, ez, to, free);
      vert(mx - ax, my, mz - az, from, free * 0.95);
    },
    build() {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
      geo.setAttribute('sway', new THREE.Float32BufferAttribute(sway, 1));
      return geo;
    },
    get count() {
      return sway.length;
    },
  };
}

// Calls plant(x, y, z) at spots strung along a ridge: on lines `offsets` off
// its crest, every `step`, each jostled a little out of true.
function alongRidge(rng, looks, row, offsets, step, jostle, plant) {
  for (const dv of offsets) {
    for (let u = -HL + 0.3; u < HL - 0.3; u += step) {
      const uu = u + (rng() - 0.5) * jostle * 2;
      const vv = FIELD.rowV(row) + dv + (rng() - 0.5) * jostle;
      const w = fieldToWorld(uu, vv);
      plant(w.x, terrainHeight(w.x, w.z) + earthRise(looks, uu, vv) - 0.015, w.z);
    }
  }
}

// ...and at `count` spots strewn anywhere across it.
function acrossRidge(rng, looks, row, count, reach, plant) {
  for (let n = 0; n < count; n++) {
    const uu = (rng() * 2 - 1) * (HL - 0.3);
    const vv = FIELD.rowV(row) + (rng() * 2 - 1) * reach;
    const w = fieldToWorld(uu, vv);
    plant(w.x, terrainHeight(w.x, w.z) + earthRise(looks, uu, vv) - 0.015, w.z);
  }
}

const stubs = (g, rng, looks, row) =>
  alongRidge(rng, looks, row, [-0.26, 0, 0.26], 0.17, 0.05, (x, y, z) => {
    g.blade(x, y, z, rng() * TAU, 0.017, 0.07 + rng() * 0.08, (rng() - 0.5) * 0.05, STRAW_ROOT, STRAW_TIP, 0.15);
  });

const shoots = (g, rng, looks, row, height, blades) =>
  alongRidge(rng, looks, row, [-0.1, 0.1], 0.1, 0.035, (x, y, z) => {
    const turn = rng() * TAU;
    for (let b = 0; b < blades; b++) {
      g.blade(x, y, z, turn + (b / blades) * Math.PI, 0.022, height * (0.75 + rng() * 0.5), (rng() - 0.5) * 0.1, SHOOT_ROOT, SHOOT_TIP, 0.55);
    }
  });

// what each look grows on its ridge
const GROWS = {
  stubble(g, rng, looks, row) {
    stubs(g, rng, looks, row);
    // a fallow strip does not stay clean
    acrossRidge(rng, looks, row, 5, 0.42, (x, y, z) => {
      const turn = rng() * TAU;
      for (let b = 0; b < 4; b++) g.blade(x, y, z, turn + b * 0.9, 0.03, 0.1 + rng() * 0.1, (rng() - 0.5) * 0.16, WEED_ROOT, WEED_TIP, 0.5);
    });
  },
  furrow() {},
  sown(g, rng, looks, row) {
    // seed lying where it fell: flecks too small to stand
    acrossRidge(rng, looks, row, 60, 0.3, (x, y, z) => {
      g.blade(x, y + 0.04, z, rng() * TAU, 0.022, 0.004, 0.045, SEED, SEED, 0);
    });
  },
  weedy(g, rng, looks, row) {
    shoots(g, rng, looks, row, 0.17, 2);
    acrossRidge(rng, looks, row, 15, 0.45, (x, y, z) => {
      const turn = rng() * TAU;
      let tip = null;
      for (let b = 0; b < 5; b++) tip = g.blade(x, y, z, turn + b * 1.3, 0.04, 0.17 + rng() * 0.15, (rng() - 0.5) * 0.24, WEED_ROOT, WEED_TIP, 0.6);
      if (rng() < 0.4) g.kite(tip, turn, 0.03, 0.07, 0, WEED_FLOWER, WEED_FLOWER, 0.6);
    });
  },
  tended(g, rng, looks, row) {
    shoots(g, rng, looks, row, 0.3, 3);
  },
  ripe(g, rng, looks, row) {
    alongRidge(rng, looks, row, [-0.27, -0.09, 0.09, 0.27], 0.12, 0.045, (x, y, z) => {
      const ang = rng() * TAU;
      const lean = (rng() - 0.5) * 0.22;
      const tip = g.blade(x, y, z, ang, 0.026, 0.72 + rng() * 0.24, lean, STALK_ROOT, STALK_TIP, 0.85);
      g.kite(tip, ang, 0.034, 0.17, lean * 0.5, EAR, EAR_TIP, 1);
    });
  },
  stook(g, rng, looks, row) {
    stubs(g, rng, looks, row);
  },
};

// ---------- the scarecrow ----------

// An old tunic on a stake at the far headland, stuffed with last year's
// straw, facing local +z. He marks the strip from across the green.
function buildScarecrow() {
  const g = new THREE.Group();
  const TUNIC = 0x7d5a4a; // madder, faded by a few summers
  g.add(mesh(cyl(0.035, 0.045, 1.8, 5), WOOD_DARK, { y: 0.75 })); // the stake
  g.add(mesh(box(1.2, 0.055, 0.055), WOOD, { y: 1.2, rz: 0.04 })); // ...and its crosspiece
  g.add(mesh(box(0.46, 0.58, 0.15), TUNIC, { y: 0.97 }));
  g.add(mesh(box(0.92, 0.17, 0.13), tone(TUNIC, 0.92), { y: 1.2, rz: 0.04 })); // sleeves along the pole
  g.add(mesh(box(0.14, 0.12, 0.02), tone(TUNIC, 0.7), { x: -0.08, y: 0.9, z: 0.08, rz: 0.2 })); // a patch
  g.add(mesh(cyl(0.2, 0.2, 0.05, 6), ROPE, { y: 0.84 })); // belted with cord
  for (const s of [-1, 1]) {
    // straw bursting from each cuff
    g.add(mesh(new THREE.ConeGeometry(0.075, 0.24, 5), STRAW, { x: s * 0.57, y: 1.2 + s * 0.02, rz: s * (Math.PI / 2) }));
  }
  g.add(mesh(new THREE.ConeGeometry(0.21, 0.3, 6), tone(STRAW, 0.92), { y: 0.56 })); // ...and from the hem
  // a sack for a head, tied at the neck, under a hat nobody wanted
  const head = mesh(new THREE.SphereGeometry(0.15, 7, 5), 0xc9b78a, { y: 1.5 });
  head.scale.set(1, 1.1, 0.95);
  g.add(head);
  g.add(mesh(cyl(0.08, 0.08, 0.035, 6), ROPE, { y: 1.36 }));
  g.add(mesh(cyl(0.27, 0.27, 0.025, 8), 0x5b4a36, { y: 1.61, rz: 0.1 }));
  g.add(mesh(new THREE.ConeGeometry(0.14, 0.2, 7), 0x52432f, { x: -0.01, y: 1.71, rz: 0.1 }));
  for (const s of [-1, 1]) g.add(mesh(box(0.03, 0.035, 0.02), EYE, { x: s * 0.055, y: 1.52, z: 0.14, shadow: false }));
  g.add(mesh(box(0.1, 0.012, 0.02), EYE, { y: 1.44, z: 0.142, rz: -0.08, shadow: false })); // a stitched mouth
  return bake(g);
}

// ---------- the whole field ----------

export function buildField() {
  const group = new THREE.Group();
  group.name = 'field';

  const earthMat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  // thin blades are lit as if they lay flat like the ground (see wind.js)
  const growthMat = withWind(new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }), 0.11, { upNormals: true });

  let earth = null;
  const growth = new THREE.Mesh(new THREE.BufferGeometry(), growthMat);
  growth.receiveShadow = true;
  growth.visible = false; // nothing to show until the first draw()
  group.add(growth);

  // the scarecrow stands past the far end of the ridges, looking back at the village
  const scarecrow = buildScarecrow();
  const at = fieldToWorld(HL + 0.95, 0.8);
  scarecrow.position.set(at.x, terrainHeight(at.x, at.z), at.z);
  scarecrow.rotation.y = LAYOUT.field.rotY - Math.PI / 2;
  group.add(scarecrow);

  let drawn = [];

  return {
    group,
    rows: FIELD.rows,
    collider: { x: at.x, z: at.z, r: 0.2 }, // the scarecrow's stake

    // Redraw the strip: one look name per ridge, first to last.
    draw(looks) {
      drawn = [...looks];

      const solid = makeBatch();
      solid.add(earthGeometry(looks));
      const sprouting = makeGrowth();
      looks.forEach((look, row) => {
        // each ridge and look has its own stream, so working one ridge never reshuffles another
        const rng = makeRng(4100 + row * 97 + Object.keys(GROWS).indexOf(look) * 13);
        GROWS[look](sprouting, rng, looks, row);
        if (look === 'stook') for (const u of [-HL * 0.5, HL * 0.42]) addStook(solid, rng, u + (rng() - 0.5) * 0.5, FIELD.rowV(row));
      });

      if (earth) {
        group.remove(earth);
        earth.geometry.dispose();
      }
      earth = solid.build(earthMat);
      group.add(earth);

      growth.geometry.dispose();
      growth.geometry = sprouting.build();
      growth.visible = sprouting.count > 0;
    },

    // what is drawn now (the smoke suite reads this)
    looks: () => drawn,

    // the spot on ridge `row` nearest to (x, z), and how far off it is
    nearestOnRow(row, x, z) {
      const u = Math.min(HL, Math.max(-HL, worldToField(x, z).u));
      const w = fieldToWorld(u, FIELD.rowV(row));
      return { x: w.x, z: w.z, dist: Math.hypot(w.x - x, w.z - z) };
    },
  };
}
