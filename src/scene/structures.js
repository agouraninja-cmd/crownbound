import * as THREE from 'three';
import { mesh, bake, makeRng, tone, raggedCone } from './meshUtils.js';
import { glowSprite } from './sprites.js';
import {
  WOOD_DARK, WOOD, WOOD_PALE, THATCH, THATCH_DARK, STONE, STONE_DARK, STRAW, PARCHMENT, PAGE, LEATHER, DAUB, IRON, INK, ROPE,
  box, cyl, thatchRoof, gableGeometry, boards, footing, scribble, sack, villagerHead, villagerArm, villagerRobe,
} from './kit.js';

// Every builder here assembles its prop from plain mesh() pieces and ends by
// baking the Group (meshUtils.bake): the static pieces fold into one or two
// draw calls, while child Groups — door leaf, heads, arms, shop upgrades —
// stay separate so the game can still move and toggle them.

// Hollow hovel: a 3.4 × 2.9 timber-framed, daub-walled cottage with real walls,
// a hinged door on the +x face, and a furnished one-room interior. The floor
// is the terrain itself (a packed-earth dirt patch in layout.js paints it).
// All dimensions are LOCAL; world.js offsets them — the hovel must stay
// unrotated (rotY 0) so its wall colliders stay axis-aligned.
export const HOVEL = {
  halfX: 1.7,
  halfZ: 1.45,
  wallT: 0.12, // walls span x ±[1.58, 1.70], z ±[1.33, 1.45]
  door: { z0: -0.97, z1: -0.07, h: 1.62, openAngle: 1.9 }, // gap in the +x wall
  bed: { x: -1.05, z: 0.55, topY: 0.46 }, // cot centre + mattress top — interactable & lie-down spot
  wake: { x: -0.3, z: -0.6 }, // open floor where you stand after sleep/death
  hearth: { x: 0.3, z: 0.45, r: 0.55 },
  chest: { x0: -1.28, x1: -0.62, z0: -1.21, z1: -0.79, lidHinge: 0.23, openAngle: -1.7 }, // lid swings up off its back edge
  table: { x: 1.0, z: 0.95, r: 0.5 },
  ledger: { x: 0.85, z: -1.1 }, // where you stand to read the sleep ledger
  ceilY: 1.85, // indoor camera stays under this
  smoke: { x: 0.3, y: 3.12, z: 0.48 }, // the smoke hole in the thatch, over the hearth
  barrel: { x: 1.1, z: 1.75, r: 0.38 }, // the water butt outside the +z wall
  woodpile: { x0: -1.45, x1: 0.52, z0: -2.02, z1: -1.45 }, // logs stacked along the -z wall
};

const WOOL = 0x6b5a44; // undyed peasant blanket
const CLAY = 0x9c5e3c;
const HERB = 0x6f7a3e;

export function buildHovel() {
  const g = new THREE.Group();
  const H = HOVEL;
  const rng = makeRng(101);
  const add = (geo, color, opts) => {
    const m = mesh(geo, color, opts);
    g.add(m);
    return m;
  };
  // a framing timber — each its own shade of weathered oak
  const beam = (w, h, d, x, y, z, rot) => add(box(w, h, d), tone(WOOD_DARK, 0.9 + rng() * 0.22), { x, y, z, ...rot });

  const wallX = H.halfX - H.wallT / 2; // 1.64
  const wallZ = H.halfZ - H.wallT / 2; // 1.39

  // daubed walls; they reach 0.3 below grade so the undulating terrain never shows a gap
  const wallBox = (w, d) => box(w, 2.3, d);
  add(wallBox(H.wallT, 2.9), DAUB, { x: -wallX, y: 0.85 }); // -x
  add(wallBox(3.4, H.wallT), tone(DAUB, 0.97), { y: 0.85, z: wallZ }); // +z
  add(wallBox(3.4, H.wallT), tone(DAUB, 1.03), { y: 0.85, z: -wallZ }); // -z
  // +x wall, split around the doorway
  add(wallBox(H.wallT, H.halfZ + H.door.z0), DAUB, { x: wallX, y: 0.85, z: (H.door.z0 - H.halfZ) / 2 });
  add(wallBox(H.wallT, H.halfZ - H.door.z1), DAUB, { x: wallX, y: 0.85, z: (H.door.z1 + H.halfZ) / 2 });
  add(box(H.wallT, 2.0 - H.door.h, 1.1), DAUB, { x: wallX, y: (2.0 + H.door.h) / 2, z: (H.door.z0 + H.door.z1) / 2 }); // lintel
  // gables, their peaks tucked up into the thatch
  add(gableGeometry(H.halfZ, 2.0, 3.12, H.wallT), tone(DAUB, 0.98), { x: H.halfX });
  add(gableGeometry(H.halfZ, 2.0, 3.12, H.wallT), tone(DAUB, 0.98), { x: -H.halfX + H.wallT });

  // ---- the timber frame, standing a little proud of the daub ----

  for (const sx of [-1, 1]) for (const sz of [-1, 1]) beam(0.17, 2.36, 0.17, sx * 1.665, 0.85, sz * 1.415); // corner posts

  // the long walls (facing ±z): sill, plate, two studs, a rail, foot braces
  for (const s of [-1, 1]) {
    const z = s * 1.475;
    beam(3.2, 0.14, 0.07, 0, 0.38, z);
    beam(3.2, 0.12, 0.07, 0, 1.93, z);
    beam(0.13, 1.44, 0.07, -0.57, 1.15, z);
    beam(0.13, 1.44, 0.07, 0.57, 1.15, z);
    beam(1.0, 0.09, 0.06, 0, 1.2, z);
    beam(0.09, 0.95, 0.06, -1.33, 0.86, z, { rz: 0.58 }); // braces lean into the corner posts
    beam(0.09, 0.95, 0.06, 1.33, 0.86, z, { rz: -0.58 });
    footing(g, rng, { axis: 'z', at: s * 1.52, from: -1.78, to: 1.78 });
  }

  // the back wall (-x)
  beam(0.07, 0.14, 2.7, -1.725, 0.38, 0);
  beam(0.07, 0.12, 2.7, -1.725, 1.93, 0);
  beam(0.07, 1.44, 0.13, -1.725, 1.15, -0.45);
  beam(0.07, 1.44, 0.13, -1.725, 1.15, 0.45);
  beam(0.06, 0.09, 0.78, -1.725, 1.2, 0);
  beam(0.06, 0.9, 0.09, -1.725, 0.86, -1.02, { rx: -0.55 });
  beam(0.06, 0.9, 0.09, -1.725, 0.86, 1.02, { rx: 0.55 });
  beam(0.07, 1.08, 0.12, -1.725, 2.5, 0); // king post in the gable
  footing(g, rng, { axis: 'x', at: -1.77, from: -1.52, to: 1.52 });

  // the front wall (+x): door frame, window frame, a stone doorstep
  const doorMid = (H.door.z0 + H.door.z1) / 2;
  beam(0.07, 0.12, 2.7, 1.725, 1.93, 0);
  beam(0.08, 1.74, 0.11, 1.725, 0.85, H.door.z0 - 0.055);
  beam(0.08, 1.74, 0.11, 1.725, 0.85, H.door.z1 + 0.055);
  beam(0.08, 0.13, 1.14, 1.725, 1.7, doorMid);
  beam(0.07, 0.14, 1.25, 1.725, 0.38, 0.7);
  beam(0.07, 1.08, 0.12, 1.725, 2.5, 0);
  footing(g, rng, { axis: 'x', at: 1.77, from: 0.06, to: 1.52 });
  footing(g, rng, { axis: 'x', at: 1.77, from: -1.52, to: -1.08 });
  add(box(0.42, 0.3, 1.0), tone(STONE, 1.05), { x: 1.93, y: -0.135, z: doorMid });

  // it should still look shabby: a board nailed over cracked daub, a crooked
  // patch plank, and a place where the daub has fallen from the wattle
  add(box(0.05, 0.5, 0.36), WOOD_PALE, { x: 1.735, y: 0.78, z: 0.78, rx: 0.07 });
  add(box(0.8, 0.14, 0.05), WOOD_PALE, { x: -0.4, y: 1.56, z: 1.492, rz: -0.1 });
  add(box(0.5, 0.42, 0.03), 0x5d4630, { x: 1.05, y: 1.57, z: -1.462 });
  for (const wy of [1.44, 1.57, 1.7]) add(box(0.5, 0.035, 0.02), 0x8a6b45, { x: 1.05, y: wy, z: -1.482, shadow: false });
  for (const wx of [0.9, 1.05, 1.2]) add(box(0.03, 0.42, 0.016), 0x7a5d3b, { x: wx, y: 1.57, z: -1.474, shadow: false });

  // ---- the thatch ----

  const roof = thatchRoof(g, rng, { length: 4.1, halfZ: H.halfZ, eaveY: 2.0, peakY: 2.98 });
  // the smoke hole over the hearth, with a board propped above it against the rain
  const hole = roof.spot(0.32, 0.28);
  add(box(0.36, 0.03, 0.26), 0x231a12, { x: H.smoke.x, y: hole.y, z: hole.z, rx: roof.pitch, shadow: false });
  const cowl = roof.spot(0.32, 0.5);
  add(box(0.52, 0.04, 0.4), tone(THATCH_DARK, 0.9), { x: H.smoke.x, y: cowl.y, z: cowl.z, rx: roof.pitch });
  for (const sx of [-0.22, 0.22]) add(box(0.03, 0.24, 0.03), WOOD_DARK, { x: H.smoke.x + sx, y: (hole.y + cowl.y) / 2, z: (hole.z + cowl.z) / 2 });

  // what holds it up, seen from indoors: tie beams, rafters, a ridge pole
  beam(3.16, 0.1, 0.12, 0, 2.0, -0.7);
  beam(3.16, 0.1, 0.12, 0, 2.0, 0.7);
  beam(3.2, 0.1, 0.1, 0, 2.9, 0);
  const rafter = roof.spot(0.9, -0.05);
  for (const rx of [-1.15, -0.38, 0.38, 1.15]) {
    for (const side of [-1, 1]) beam(0.07, 0.09, 1.74, rx, rafter.y, side * rafter.z, { rx: side * roof.pitch });
  }

  // ---- doorway: jambs, and the hinged leaf (pivot on the south jamb) ----

  add(box(0.06, H.door.h, 0.1), WOOD_DARK, { x: 1.66, y: H.door.h / 2, z: H.door.z1 + 0.04 });
  add(box(0.06, H.door.h, 0.1), WOOD_DARK, { x: 1.66, y: H.door.h / 2, z: H.door.z0 - 0.04 });
  const doorPivot = new THREE.Group();
  doorPivot.position.set(wallX, 0, H.door.z0);
  const leafLen = H.door.z1 - H.door.z0 - 0.06;
  const leafH = H.door.h - 0.08;
  const leafMid = leafLen / 2 + 0.02;
  // four upright boards, ledged and braced on the outer face
  for (let i = 0; i < 4; i++) {
    const bw = leafLen / 4;
    doorPivot.add(mesh(box(0.06, leafH, bw - 0.012), tone(WOOD, 0.82 + rng() * 0.28), { y: leafH / 2 + 0.02, z: 0.02 + bw * (i + 0.5) }));
  }
  doorPivot.add(mesh(box(0.035, 0.11, leafLen - 0.04), WOOD_DARK, { x: 0.045, y: 1.2, z: leafMid }));
  doorPivot.add(mesh(box(0.035, 0.11, leafLen - 0.04), WOOD_DARK, { x: 0.045, y: 0.42, z: leafMid }));
  doorPivot.add(mesh(box(0.03, 0.09, 1.0), WOOD_DARK, { x: 0.044, y: 0.81, z: leafMid, rx: -0.76 }));
  // iron strap hinges at the hung edge, a pull at the free one
  doorPivot.add(mesh(box(0.02, 0.05, 0.3), IRON, { x: 0.066, y: 1.2, z: 0.17, shadow: false }));
  doorPivot.add(mesh(box(0.02, 0.05, 0.3), IRON, { x: 0.066, y: 0.42, z: 0.17, shadow: false }));
  doorPivot.add(mesh(box(0.04, 0.1, 0.035), IRON, { x: 0.07, y: 0.86, z: leafLen - 0.08 }));
  g.add(doorPivot);

  // door paint (shop upgrade 'door'): oxblood over the boards, under the
  // ledges, riding the pivot so it swings with the leaf
  const doorPaint = mesh(box(0.012, leafH - 0.04, leafLen - 0.03), 0x7a2a20, { x: 0.036, y: leafH / 2 + 0.02, z: leafMid, keep: true });
  doorPaint.visible = false;
  doorPivot.add(doorPaint);

  // the little window: a dark opening with a hint of firelight, framed, with
  // one shutter hung open
  const opening = new THREE.Mesh(box(0.08, 0.42, 0.42), new THREE.MeshBasicMaterial({ color: 0x4a2c16 }));
  opening.position.set(1.71, 1.35, 0.74);
  g.add(opening);
  beam(0.06, 0.07, 0.58, 1.742, 1.595, 0.74);
  beam(0.06, 0.44, 0.07, 1.742, 1.35, 0.485);
  beam(0.06, 0.44, 0.07, 1.742, 1.35, 0.995);
  add(box(0.14, 0.05, 0.62), WOOD_PALE, { x: 1.77, y: 1.115, z: 0.74 });
  add(box(0.03, 0.44, 0.14), tone(WOOD, 1.08), { x: 1.745, y: 1.35, z: 1.1 });
  add(box(0.03, 0.44, 0.14), tone(WOOD, 0.94), { x: 1.745, y: 1.35, z: 1.245 });
  for (const sy of [1.23, 1.47]) add(box(0.035, 0.05, 0.3), WOOD_DARK, { x: 1.762, y: sy, z: 1.172, shadow: false });

  // the water butt by the wall: staves, hoops, a lid left askew
  add(cyl(0.32, 0.36, 0.78, 9), WOOD_PALE, { x: H.barrel.x, y: 0.39, z: H.barrel.z });
  add(cyl(0.37, 0.37, 0.07, 9), IRON, { x: H.barrel.x, y: 0.2, z: H.barrel.z });
  add(cyl(0.345, 0.345, 0.07, 9), IRON, { x: H.barrel.x, y: 0.6, z: H.barrel.z });
  add(cyl(0.31, 0.31, 0.035, 9), WOOD_DARK, { x: H.barrel.x + 0.05, y: 0.8, z: H.barrel.z - 0.03, rz: 0.06 });

  // the woodpile under the south eave, sawn ends out, and the block it was split on
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i < 6 - row; i++) {
      const r = 0.075 + rng() * 0.02;
      const lx = -1.3 + row * 0.095 + i * 0.19;
      const ly = 0.08 + row * 0.15;
      add(cyl(r, r, 0.5, 6), tone(WOOD, 0.8 + rng() * 0.3), { x: lx, y: ly, z: -1.74, rx: Math.PI / 2 });
      add(cyl(r * 0.82, r * 0.82, 0.012, 6), tone(WOOD_PALE, 1.12), { x: lx, y: ly, z: -1.992, rx: Math.PI / 2, shadow: false });
    }
  }
  add(cyl(0.2, 0.23, 0.44, 8), tone(WOOD, 0.9), { x: 0.24, y: 0.2, z: -1.76 });
  add(box(0.035, 0.52, 0.035), WOOD_PALE, { x: 0.33, y: 0.62, z: -1.76, rz: -0.55 });
  add(box(0.15, 0.1, 0.03), IRON, { x: 0.2, y: 0.47, z: -1.76, rz: -0.55 });

  // ---- exterior shop upgrades, hidden until bought at the chapman's cart ----

  // 'window': a real glass pane with a cross mullion over the dark opening
  const glassWindow = new THREE.Group();
  glassWindow.add(mesh(box(0.03, 0.38, 0.38), 0xaec6cf, { x: 1.76, y: 1.35, z: 0.74, shadow: false }));
  glassWindow.add(mesh(box(0.02, 0.4, 0.035), WOOD_DARK, { x: 1.78, y: 1.35, z: 0.74 }));
  glassWindow.add(mesh(box(0.02, 0.035, 0.4), WOOD_DARK, { x: 1.78, y: 1.35, z: 0.74 }));
  glassWindow.visible = false;
  g.add(glassWindow);

  // 'lantern': iron candle lantern on a bracket beside the door
  const lantern = new THREE.Group();
  lantern.add(mesh(box(0.18, 0.03, 0.03), WOOD_DARK, { x: 1.78, y: 1.9, z: 0.12 }));
  lantern.add(mesh(box(0.02, 0.1, 0.02), IRON, { x: 1.86, y: 1.84, z: 0.12, shadow: false }));
  lantern.add(mesh(box(0.11, 0.15, 0.11), IRON, { x: 1.86, y: 1.71, z: 0.12 }));
  const flame = new THREE.Mesh(box(0.055, 0.08, 0.055), new THREE.MeshBasicMaterial({ color: 0xffd66e }));
  flame.position.set(1.86, 1.71, 0.12);
  lantern.add(flame);
  const lanternGlow = glowSprite(0xffc866, 0.7, 0.55);
  lanternGlow.position.set(1.9, 1.71, 0.12);
  lantern.add(lanternGlow);
  lantern.visible = false;
  g.add(lantern);

  // 'garden': a tilled plot with cabbages along the +z wall
  const garden = new THREE.Group();
  garden.add(mesh(box(1.5, 0.16, 0.85), 0x4a3624, { x: -0.5, y: 0.02, z: 2.05 }));
  for (const rowZ of [1.78, 2.06, 2.34]) garden.add(mesh(box(1.4, 0.05, 0.12), 0x3c2b1c, { x: -0.5, y: 0.1, z: rowZ, shadow: false }));
  for (const [gx, gz] of [[-1.05, 1.85], [-0.55, 1.88], [-0.05, 1.83], [-1.0, 2.28], [-0.5, 2.3], [0.0, 2.26]]) {
    garden.add(mesh(new THREE.SphereGeometry(0.095, 6, 5), 0x6f7a3e, { x: gx, y: 0.14, z: gz }));
    garden.add(mesh(new THREE.SphereGeometry(0.06, 5, 4), 0x8a9a52, { x: gx, y: 0.19, z: gz, shadow: false }));
  }
  garden.add(mesh(new THREE.ConeGeometry(0.05, 0.16, 5), 0x557f3d, { x: -0.28, y: 0.18, z: 2.07 }));
  garden.add(mesh(new THREE.ConeGeometry(0.05, 0.14, 5), 0x557f3d, { x: -0.75, y: 0.17, z: 2.05 }));
  garden.visible = false;
  g.add(garden);

  const inside = furnish(g, rng);
  const upgrades = { door: doorPaint, window: glassWindow, lantern, garden, ...inside.upgrades };

  bake(g);
  return { group: g, doorPivot, chestLid: inside.chestLid, upgrades, hearth: inside.hearth };
}

// One-room medieval peasant interior: straw cot, open hearth with a pot over
// it, trestle table, stool, chest, pot shelf, hanging herbs, firewood. Dirt
// floor is the terrain. Returns { upgrades, hearth } — the interior shop
// upgrades (hidden until bought) and the hearth's fire for world.js to flicker.
function furnish(g, rng) {
  const H = HOVEL;
  const add = (geo, color, opts) => g.add(mesh(geo, color, opts));

  // straw cot along the -x wall
  const bx = H.bed.x;
  const bz = H.bed.z;
  add(box(0.9, 0.12, 1.5), WOOD_DARK, { x: bx, y: 0.26, z: bz });
  for (const [lx, lz] of [[-0.38, -0.66], [0.38, -0.66], [-0.38, 0.66], [0.38, 0.66]]) {
    add(box(0.09, 0.26, 0.09), WOOD_DARK, { x: bx + lx, y: 0.13, z: bz + lz });
  }
  add(box(0.8, 0.14, 1.4), STRAW, { x: bx, y: 0.39, z: bz });
  add(box(0.82, 0.06, 0.85), WOOL, { x: bx, y: 0.47, z: bz + 0.25 });
  add(box(0.82, 0.062, 0.1), tone(WOOL, 1.25), { x: bx, y: 0.471, z: bz - 0.13, shadow: false }); // the blanket's turned-back edge
  add(box(0.55, 0.1, 0.3), 0xcbb98e, { x: bx, y: 0.49, z: bz - 0.5 }); // sack pillow
  for (const [sx, sz] of [[0.42, -0.3], [-0.44, 0.1], [0.43, 0.5]]) {
    add(box(0.06, 0.03, 0.2), tone(STRAW, 1.1), { x: bx + sx, y: 0.35, z: bz + sz, ry: 0.4, shadow: false }); // straw working loose
  }

  // open hearth: stone ring, ash, ember glow, charred logs
  const hx = H.hearth.x;
  const hz = H.hearth.z;
  add(cyl(0.34, 0.38, 0.06, 9), 0x4a423a, { x: hx, y: 0.03, z: hz, shadow: false });
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.4;
    add(box(0.16, 0.14, 0.16), tone(STONE, 0.9 + (i % 3) * 0.08), { x: hx + Math.cos(a) * 0.42, y: 0.07, z: hz + Math.sin(a) * 0.42, ry: a });
  }
  const embers = new THREE.Mesh(cyl(0.18, 0.22, 0.05, 7), new THREE.MeshBasicMaterial({ color: 0xd96a2a }));
  embers.position.set(hx, 0.06, hz);
  g.add(embers);
  add(box(0.4, 0.09, 0.1), 0x2c241c, { x: hx, y: 0.1, z: hz, ry: 0.5 });
  add(box(0.36, 0.09, 0.1), 0x2c241c, { x: hx, y: 0.1, z: hz, ry: -0.7 });
  // a small fire licking at the logs (world.js makes it flicker)
  const flames = new THREE.Group();
  flames.position.set(hx, 0.1, hz);
  const outer = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.32, 6), new THREE.MeshBasicMaterial({ color: 0xff7d26 }));
  outer.position.y = 0.16;
  const inner = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.2, 5), new THREE.MeshBasicMaterial({ color: 0xffd66e }));
  inner.position.y = 0.12;
  flames.add(outer, inner);
  g.add(flames);
  const halo = glowSprite(0xff8a3a, 1.5, 0.4);
  halo.position.set(hx, 0.35, hz);
  g.add(halo);
  // a small warm glow — deliberately the scene's only light beyond the sun
  // and the campfire (no shadows, tight falloff, so the 60fps budget is untouched)
  const glow = new THREE.PointLight(0xff9a55, 2.2, 4.5, 2);
  glow.position.set(hx, 0.8, hz);
  g.add(glow);
  // the cooking pot, hung from a tripod of poles
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.9;
    const leg = mesh(box(0.035, 1.02, 0.035), WOOD_DARK, { x: hx + Math.cos(a) * 0.19, y: 0.5, z: hz + Math.sin(a) * 0.19 });
    leg.rotation.set(-Math.sin(a) * 0.36, 0, Math.cos(a) * 0.36); // each leans in to meet the others
    g.add(leg);
  }
  add(box(0.015, 0.3, 0.015), IRON, { x: hx, y: 0.78, z: hz, shadow: false });
  add(cyl(0.13, 0.1, 0.15, 7), 0x2f2f33, { x: hx, y: 0.57, z: hz });
  add(cyl(0.14, 0.14, 0.025, 7), 0x3d3d42, { x: hx, y: 0.65, z: hz });

  // trestle table against the +z wall: bowl, loaf, a wooden cup
  const tx = H.table.x;
  const tz = H.table.z;
  add(box(0.85, 0.07, 0.55), WOOD, { x: tx, y: 0.62, z: tz });
  for (const [lx, lz] of [[-0.34, -0.2], [0.34, -0.2], [-0.34, 0.2], [0.34, 0.2]]) {
    add(box(0.07, 0.6, 0.07), WOOD_DARK, { x: tx + lx, y: 0.3, z: tz + lz });
  }
  add(cyl(0.1, 0.07, 0.08, 7), 0x8a6a3f, { x: tx - 0.15, y: 0.7, z: tz });
  const loaf = mesh(new THREE.SphereGeometry(0.09, 6, 5), 0xa9763e, { x: tx + 0.16, y: 0.69, z: tz + 0.08 });
  loaf.scale.set(1.25, 0.6, 0.9);
  g.add(loaf);
  add(cyl(0.035, 0.03, 0.09, 6), WOOD_PALE, { x: tx + 0.05, y: 0.7, z: tz - 0.14 });

  // stool
  add(cyl(0.16, 0.16, 0.06, 7), WOOD_PALE, { x: 0.45, y: 0.38, z: 1.05 });
  add(cyl(0.05, 0.07, 0.36, 6), WOOD_DARK, { x: 0.45, y: 0.18, z: 1.05 });

  // chest in the -z corner, front (hasp) facing +z. The body is open-topped
  // in look: a dark well with a peasant's few goods in it, hidden until the
  // lid — its own pivot Group, hinged along the back edge — swings up.
  const cx = (H.chest.x0 + H.chest.x1) / 2;
  const cz = (H.chest.z0 + H.chest.z1) / 2;
  add(box(0.66, 0.34, 0.42), WOOD, { x: cx, y: 0.17, z: cz });
  add(box(0.58, 0.01, 0.34), 0x2a2018, { x: cx, y: 0.345, z: cz, shadow: false }); // the dark inside
  add(box(0.08, 0.36, 0.48), IRON, { x: cx - 0.2, y: 0.15, z: cz }); // iron bands
  add(box(0.08, 0.36, 0.48), IRON, { x: cx + 0.2, y: 0.15, z: cz });
  add(box(0.3, 0.05, 0.22), 0x7a6a50, { x: cx - 0.1, y: 0.36, z: cz, ry: 0.08, shadow: false }); // a folded spare tunic
  add(box(0.28, 0.03, 0.2), tone(0x7a6a50, 1.15), { x: cx - 0.11, y: 0.395, z: cz + 0.01, ry: 0.05, shadow: false });
  add(new THREE.SphereGeometry(0.06, 6, 5), LEATHER, { x: cx + 0.16, y: 0.38, z: cz - 0.05, shadow: false }); // a coin pouch
  add(box(0.12, 0.025, 0.04), STONE_DARK, { x: cx + 0.15, y: 0.36, z: cz + 0.1, ry: -0.5, shadow: false }); // a whetstone
  const chestLid = new THREE.Group();
  chestLid.position.set(cx, 0.34, cz - H.chest.lidHinge);
  chestLid.add(mesh(box(0.7, 0.1, 0.46), WOOD_DARK, { y: 0.05, z: 0.23 }));
  chestLid.add(mesh(box(0.08, 0.12, 0.48), IRON, { x: -0.2, y: 0.05, z: 0.23 })); // the bands over the lid
  chestLid.add(mesh(box(0.08, 0.12, 0.48), IRON, { x: 0.2, y: 0.05, z: 0.23 }));
  chestLid.add(mesh(box(0.07, 0.09, 0.03), 0xb08d4f, { y: -0.03, z: 0.465, shadow: false })); // hasp
  g.add(chestLid);

  // the sleep ledger: a plank and parchment by the shelf, tally scratched in ink
  add(box(0.55, 0.62, 0.04), WOOD_DARK, { x: H.ledger.x, y: 1.25, z: -1.31 });
  add(box(0.42, 0.5, 0.02), PARCHMENT, { x: H.ledger.x, y: 1.24, z: -1.285, shadow: false });
  for (let i = 0; i < 5; i++) {
    add(box(0.28, 0.018, 0.012), INK, {
      x: H.ledger.x + (i % 2 ? 0.02 : -0.02),
      y: 1.42 - i * 0.08,
      z: -1.272,
      rz: i % 2 ? -0.05 : 0.04,
      shadow: false,
    });
  }

  // pot shelf on the -z wall
  add(box(1.1, 0.05, 0.26), WOOD_PALE, { x: -0.2, y: 1.28, z: -1.18 });
  add(box(0.05, 0.18, 0.2), WOOD_DARK, { x: -0.6, y: 1.18, z: -1.2 });
  add(box(0.05, 0.18, 0.2), WOOD_DARK, { x: 0.2, y: 1.18, z: -1.2 });
  add(cyl(0.09, 0.11, 0.2, 7), CLAY, { x: -0.5, y: 1.41, z: -1.18 });
  add(cyl(0.08, 0.1, 0.18, 7), CLAY, { x: -0.18, y: 1.4, z: -1.18 });
  add(cyl(0.07, 0.1, 0.24, 7), 0x86715a, { x: 0.1, y: 1.43, z: -1.18 });

  // herbs drying on the tie beam
  for (const hxp of [0.1, 0.65]) {
    add(box(0.015, 0.14, 0.015), 0x4a3220, { x: hxp, y: 1.89, z: -0.7, shadow: false });
    add(cyl(0.03, 0.03, 0.03, 5), ROPE, { x: hxp, y: 1.81, z: -0.7, shadow: false });
    // a bunch of stems hung head-down, splaying as they dry
    for (const [ox, oz, lean] of [[0, 0, 0], [0.03, 0.01, 0.35], [-0.03, 0.015, -0.35], [0.005, -0.03, 0.15]]) {
      add(new THREE.ConeGeometry(0.035, 0.2, 4), tone(HERB, 0.85 + Math.abs(lean) * 0.6), { x: hxp + ox, y: 1.7, z: -0.7 + oz, rx: Math.PI, rz: lean });
    }
  }

  // firewood by the +x wall, and a cloak on a peg above it
  for (const [wy, wz] of [[0.07, 0.22], [0.07, 0.38], [0.18, 0.3]]) {
    add(cyl(0.06, 0.06, 0.5, 5), WOOD_DARK, { x: 1.3, y: wy, z: wz, rz: Math.PI / 2 });
  }
  add(box(0.06, 0.04, 0.04), WOOD_DARK, { x: 1.55, y: 1.55, z: 0.3 });
  add(box(0.05, 0.62, 0.34), 0x5a4a3a, { x: 1.535, y: 1.22, z: 0.3, rx: 0.04 });
  add(box(0.06, 0.16, 0.26), 0x4d3f31, { x: 1.53, y: 1.47, z: 0.3 });

  // daylight at the window, seen from within
  const daylight = new THREE.Mesh(box(0.02, 0.38, 0.38), new THREE.MeshBasicMaterial({ color: 0xf7ecd0 }));
  daylight.position.set(1.572, 1.35, 0.74);
  g.add(daylight);
  add(box(0.03, 0.05, 0.5), WOOD_DARK, { x: 1.565, y: 1.565, z: 0.74, shadow: false });
  add(box(0.03, 0.05, 0.5), WOOD_DARK, { x: 1.565, y: 1.135, z: 0.74, shadow: false });
  add(box(0.03, 0.4, 0.05), WOOD_DARK, { x: 1.565, y: 1.35, z: 0.525, shadow: false });
  add(box(0.03, 0.4, 0.05), WOOD_DARK, { x: 1.565, y: 1.35, z: 0.955, shadow: false });

  // a pail in the corner by the door
  add(cyl(0.11, 0.09, 0.2, 8), WOOD_PALE, { x: 1.38, y: 0.1, z: -1.16 });
  add(cyl(0.115, 0.115, 0.025, 8), IRON, { x: 1.38, y: 0.17, z: -1.16, shadow: false });

  // ---- interior shop upgrades, hidden until bought ----

  // 'rug': madder-red wool between cot and hearth
  const rug = new THREE.Group();
  rug.add(mesh(box(1.0, 0.035, 0.7), 0x8a3a2a, { x: -0.45, y: 0.06, z: -0.15 }));
  rug.add(mesh(box(1.04, 0.03, 0.1), 0x6e2c20, { x: -0.45, y: 0.062, z: 0.17 }));
  rug.add(mesh(box(1.04, 0.03, 0.1), 0x6e2c20, { x: -0.45, y: 0.062, z: -0.47 }));
  rug.add(mesh(box(0.5, 0.037, 0.3), 0xc9a25a, { x: -0.45, y: 0.062, z: -0.15, ry: Math.PI / 4, shadow: false })); // a gold lozenge at its heart
  rug.visible = false;
  g.add(rug);

  // 'trophy': a mounted rat above the pot shelf, stuffed and staring
  const trophy = new THREE.Group();
  trophy.add(mesh(box(0.26, 0.2, 0.03), WOOD_DARK, { x: -0.85, y: 1.68, z: -1.31 }));
  const ratBody = mesh(new THREE.SphereGeometry(0.07, 6, 5), 0x6e665e, { x: -0.87, y: 1.68, z: -1.27 });
  ratBody.scale.set(1.4, 1, 1);
  trophy.add(ratBody);
  trophy.add(mesh(new THREE.SphereGeometry(0.045, 6, 5), 0x6e665e, { x: -0.75, y: 1.7, z: -1.27 }));
  trophy.add(mesh(box(0.14, 0.02, 0.02), 0xb08a8a, { x: -1.02, y: 1.66, z: -1.27, rz: 0.4 })); // tail
  trophy.visible = false;
  g.add(trophy);

  return { upgrades: { rug, trophy }, hearth: { flames, glow, halo }, chestLid };
}

export function buildQuestBoard() {
  const g = new THREE.Group();
  const rng = makeRng(303);
  const add = (geo, color, opts) => g.add(mesh(geo, color, opts));

  // two posts, each steadied by a pair of struts
  for (const px of [-0.95, 0.95]) {
    add(cyl(0.07, 0.09, 2.4, 6), WOOD_DARK, { x: px, y: 1.1, rz: px > 0 ? 0.02 : 0 });
    for (const s of [-1, 1]) add(box(0.05, 0.75, 0.05), tone(WOOD_DARK, 1.1), { x: px, y: 0.3, z: s * 0.2, rx: s * -0.5 });
  }
  // the board itself: five weathered planks
  for (let i = 0; i < 5; i++) {
    add(box(2.1 - rng() * 0.04, 0.222, 0.08), tone(WOOD, 0.86 + rng() * 0.26), { y: 0.99 + i * 0.23 });
  }
  add(box(2.3, 0.1, 0.16), WOOD_DARK, { y: 2.12 });
  add(box(2.16, 0.07, 0.11), WOOD_DARK, { y: 0.85 });
  // a little shingled cap against the rain
  for (const s of [-1, 1]) add(box(2.5, 0.05, 0.36), tone(THATCH_DARK, s > 0 ? 1 : 0.9), { y: 2.27, z: s * 0.14, rx: s * 0.5 });
  add(box(2.54, 0.06, 0.07), WOOD_DARK, { y: 2.36 });

  // pinned parchments, each with a few lines of somebody's trouble
  const notes = [
    { x: -0.58, y: 1.6, s: 0.42, r: 0.06 },
    { x: 0.08, y: 1.42, s: 0.5, r: -0.04 },
    { x: 0.68, y: 1.62, s: 0.36, r: 0.1 },
    { x: -0.62, y: 1.1, s: 0.3, r: -0.08 },
    { x: 0.66, y: 1.13, s: 0.34, r: 0.05 },
  ];
  for (const n of notes) {
    add(box(n.s, n.s * 1.25, 0.02), tone(PARCHMENT, 0.94 + rng() * 0.1), { x: n.x, y: n.y, z: 0.055, rz: n.r, shadow: false });
    scribble(g, { x: n.x, y: n.y + n.s * 0.36, z: 0.07, width: n.s * 0.66, rows: 4, gap: n.s * 0.2 });
    add(box(0.03, 0.03, 0.03), IRON, { x: n.x, y: n.y + n.s * 0.56, z: 0.075, shadow: false }); // the nail
  }
  add(cyl(0.035, 0.035, 0.03, 6), 0x8a2418, { x: 0.2, y: 1.2, z: 0.08, rx: Math.PI / 2, shadow: false }); // a wax seal

  return bake(g);
}

// The Village Charter: a post by the path bearing the rules of the realm —
// E opens the guide panel. The parchment faces local +z; world.js turns it
// toward the walker coming up the path.
export function buildCharter() {
  const g = new THREE.Group();
  const add = (geo, color, opts) => g.add(mesh(geo, color, opts));
  // post sunk below grade, wedged with stones
  add(cyl(0.07, 0.09, 2.3, 6), WOOD_DARK, { y: 0.75 });
  add(box(0.2, 0.16, 0.16), STONE, { x: 0.12, y: 0.03, z: 0.05, ry: 0.4 });
  add(box(0.16, 0.13, 0.18), STONE_DARK, { x: -0.11, y: 0.02, z: -0.06, ry: -0.3 });
  // notice board, framed, with a little rain cap
  add(box(0.92, 1.02, 0.07), WOOD, { y: 1.42 });
  add(box(1.0, 0.07, 0.1), WOOD_DARK, { y: 1.95 });
  add(box(1.0, 0.07, 0.1), WOOD_DARK, { y: 0.89 });
  add(box(0.07, 1.0, 0.1), WOOD_DARK, { x: -0.47, y: 1.42 });
  add(box(0.07, 1.0, 0.1), WOOD_DARK, { x: 0.47, y: 1.42 });
  add(box(1.1, 0.05, 0.28), THATCH_DARK, { y: 2.02, rx: 0.1 });
  // the charter itself, slightly askew, ink lines scratched down the page
  add(box(0.68, 0.82, 0.02), PARCHMENT, { y: 1.42, z: 0.045, rz: 0.03, shadow: false });
  add(box(0.4, 0.05, 0.012), INK, { y: 1.76, z: 0.062, rz: 0.03, shadow: false }); // the heading, writ large
  scribble(g, { x: 0, y: 1.64, z: 0.062, width: 0.46, rows: 5, gap: 0.1 });
  // the reeve's wax seal beneath the text, on its ribbon
  add(box(0.05, 0.14, 0.012), 0x7a2a20, { x: 0.17, y: 1.14, z: 0.06, shadow: false });
  add(cyl(0.05, 0.05, 0.02, 7), 0x8a2418, { x: 0.17, y: 1.08, z: 0.066, rx: Math.PI / 2, shadow: false });
  return bake(g);
}

export function buildTome() {
  const g = new THREE.Group();
  const add = (geo, color, opts) => g.add(mesh(geo, color, opts));
  // a carved stone lectern: stepped foot, tapered shaft, a capital and slab
  add(cyl(0.5, 0.56, 0.16, 8), STONE_DARK, { y: 0.05 });
  add(cyl(0.4, 0.46, 0.12, 8), STONE, { y: 0.18 });
  add(cyl(0.27, 0.36, 0.72, 8), STONE, { y: 0.6 });
  add(cyl(0.4, 0.28, 0.12, 8), tone(STONE, 1.06), { y: 1.02 });
  add(cyl(0.44, 0.44, 0.07, 8), STONE_DARK, { y: 1.1 });

  // open book: two leaves meeting in a shallow V, a page lifting in the air
  add(box(0.46, 0.05, 0.62), PAGE, { x: -0.22, y: 1.2, rz: 0.2 });
  add(box(0.46, 0.05, 0.62), PAGE, { x: 0.22, y: 1.2, rz: -0.2 });
  add(box(0.5, 0.04, 0.68), LEATHER, { x: -0.24, y: 1.155, rz: 0.2 });
  add(box(0.5, 0.04, 0.68), LEATHER, { x: 0.24, y: 1.155, rz: -0.2 });
  add(box(0.3, 0.012, 0.56), tone(PAGE, 1.04), { x: 0.13, y: 1.27, rz: -0.55, shadow: false });
  for (const s of [-1, 1]) scribbleFlat(g, s * 0.22, 1.226, s * -0.2);
  add(box(0.05, 0.045, 0.3), 0x8a2418, { y: 1.23, z: 0.18, shadow: false }); // ribbon
  // inkpot and quill at the slab's corner
  add(cyl(0.045, 0.055, 0.07, 6), 0x2a2622, { x: 0.36, y: 1.17, z: -0.2 });
  add(box(0.012, 0.3, 0.05), 0xe9e2d0, { x: 0.37, y: 1.33, z: -0.2, rz: -0.35, rx: 0.2, shadow: false });
  return bake(g);
}

// lines of writing across one tilted leaf of the tome
function scribbleFlat(g, x, y, tilt) {
  for (let i = 0; i < 5; i++) {
    g.add(mesh(box(0.3, 0.006, 0.016), INK, { x, y: y + 0.004, z: -0.2 + i * 0.09, rz: tilt, shadow: false }));
  }
}

// The Exchequer: an open-fronted money-changer's booth — four posts, a pent
// thatch roof, and a counting table across the front (the "banca" that named
// banks; the checkered counting cloth is what named the royal Exchequer).
// The clerk behind it is scenery until v2 gives him words; E at the counter
// opens the Treasury panel. Front faces local +x; world.js turns it to the
// path. Returns { group, sway, head, armR, armL } — the clerk's moving parts.
export function buildExchequer() {
  const g = new THREE.Group();
  const rng = makeRng(404);
  const add = (geo, color, opts) => g.add(mesh(geo, color, opts));
  const BRASS = 0xb08d4f;
  const COIN = 0xc9a227;
  const CLOTH_PALE = 0xd8cfae;
  const CLOTH_DARK = 0x50603a;
  const ROBE = 0x4c5a36;
  const SKIN = 0xcfa46f;

  // posts sunk below grade, braced to the front beam; pent roof, high edge over the counter
  for (const [px, pz] of [[0.85, -1.25], [0.85, 1.25], [-0.85, -1.25], [-0.85, 1.25]]) {
    add(cyl(0.09, 0.11, 2.5, 6), WOOD_DARK, { x: px, y: 0.8, z: pz });
  }
  for (const s of [-1, 1]) add(box(0.06, 0.55, 0.06), WOOD_DARK, { x: 0.85, y: 2.02, z: s * 1.02, rx: s * 0.75 });
  // the thatch: a bed and two courses laid over it, ragged at the low edge
  add(box(2.7, 0.14, 3.1), THATCH_DARK, { y: 2.2, rz: 0.16 });
  add(box(1.5, 0.1, 3.16), tone(THATCH, 1.02), { x: 0.52, y: 2.39, rz: 0.16 });
  add(box(0.8, 0.09, 3.2), 0xcbb065, { x: 0.95, y: 2.53, rz: 0.16 });
  for (let i = 0; i < 10; i++) {
    add(box(0.2 + rng() * 0.14, 0.1, 0.26 + rng() * 0.1), tone(THATCH_DARK, 0.84 + rng() * 0.2), {
      x: -1.4, y: 1.96, z: -1.4 + i * 0.31 + (rng() - 0.5) * 0.06, rz: 0.3 + rng() * 0.2,
    });
  }
  add(box(0.16, 0.07, 3.12), WOOD_DARK, { x: 1.3, y: 2.41, rz: 0.16 }); // front eave
  add(box(0.12, 0.1, 2.9), WOOD_DARK, { x: 0.85, y: 2.28 }); // front beam
  // a striped valance under the front beam, the colours of the counting cloth
  for (let i = 0; i < 9; i++) {
    add(box(0.02, 0.2 + (i % 2) * 0.04, 0.27), i % 2 ? CLOTH_PALE : CLOTH_DARK, { x: 0.9, y: 2.13 - (i % 2) * 0.02, z: -1.1 + i * 0.275, shadow: false });
  }

  // half-height boarded back wall + side rails
  add(box(0.06, 1.2, 2.6), tone(WOOD_DARK, 0.85), { x: -0.93, y: 0.45 });
  boards(g, rng, { axis: 'x', at: -0.89, from: -1.3, to: 1.3, y0: -0.15, y1: 1.05, color: WOOD });
  boards(g, rng, { axis: 'x', at: -0.97, from: -1.3, to: 1.3, y0: -0.15, y1: 1.05, color: WOOD });
  add(box(1.6, 0.08, 0.08), WOOD_PALE, { y: 0.95, z: 1.25 });
  add(box(1.6, 0.08, 0.08), WOOD_PALE, { y: 0.95, z: -1.25 });

  // the counting table, its front boarded
  add(box(0.5, 1.0, 2.26), tone(WOOD_DARK, 0.9), { x: 0.7, y: 0.4 });
  boards(g, rng, { axis: 'x', at: 0.965, from: -1.15, to: 1.15, y0: -0.1, y1: 0.9, color: WOOD, width: 0.24 });
  add(box(0.66, 0.07, 2.44), WOOD_PALE, { x: 0.7, y: 0.94 });

  // the checkered counting cloth
  add(box(0.5, 0.02, 1.46), CLOTH_PALE, { x: 0.7, y: 0.985, shadow: false });
  for (let col = 0; col < 2; col++) {
    for (let row = 0; row < 6; row++) {
      if ((col + row) % 2) continue;
      add(box(0.24, 0.015, 0.24), CLOTH_DARK, { x: 0.7 + (col ? 0.12 : -0.12), y: 0.992, z: -0.6 + row * 0.24, shadow: false });
    }
  }

  // balance scales
  add(cyl(0.02, 0.028, 0.32, 5), BRASS, { x: 0.7, y: 1.16, z: -0.5 });
  add(cyl(0.05, 0.06, 0.03, 6), BRASS, { x: 0.7, y: 1.01, z: -0.5 });
  add(box(0.02, 0.02, 0.46), BRASS, { x: 0.7, y: 1.33, z: -0.5 });
  for (const s of [-1, 1]) {
    add(box(0.012, 0.1, 0.012), IRON, { x: 0.7, y: 1.27, z: -0.5 + s * 0.22, shadow: false });
    add(cyl(0.07, 0.05, 0.025, 7), BRASS, { x: 0.7, y: 1.21, z: -0.5 + s * 0.22 });
  }

  // counted coin and the day's ledger
  add(cyl(0.05, 0.05, 0.1, 7), COIN, { x: 0.74, y: 1.04, z: 0.28 });
  add(cyl(0.05, 0.05, 0.06, 7), COIN, { x: 0.62, y: 1.02, z: 0.38 });
  add(cyl(0.045, 0.045, 0.014, 7), COIN, { x: 0.7, y: 1.0, z: 0.14, shadow: false });
  add(cyl(0.045, 0.045, 0.014, 7), COIN, { x: 0.81, y: 1.0, z: 0.44, shadow: false });
  add(box(0.22, 0.02, 0.3), PAGE, { x: 0.66, y: 1.0, z: 0.82, rz: 0.09 });
  add(box(0.22, 0.02, 0.3), PAGE, { x: 0.84, y: 1.0, z: 0.82, rz: -0.09 });
  add(cyl(0.03, 0.035, 0.05, 6), 0x2a2622, { x: 0.56, y: 1.0, z: 1.02 }); // inkpot
  add(box(0.01, 0.22, 0.035), 0xe9e2d0, { x: 0.57, y: 1.12, z: 1.02, rz: -0.3, shadow: false }); // quill

  // the clerk: robe and belt stand still; chest, head, coif and arms breathe.
  // The head is its own pivot so alive.js can turn it.
  villagerRobe(g, { robe: ROBE, x: 0.05 });
  const sway = new THREE.Group();
  sway.position.set(0.05, 0.78, 0);
  sway.add(mesh(cyl(0.15, 0.175, 0.34, 8), ROBE, { y: 0.12 }));
  sway.add(mesh(cyl(0.1, 0.155, 0.06, 8), tone(ROBE, 0.8), { y: 0.3 })); // collar
  const head = villagerHead({ skin: SKIN, brow: 0x5a4632 });
  head.position.set(0, 0.42, 0);
  head.add(mesh(cyl(0.14, 0.15, 0.11, 8), CLOTH_PALE, { y: 0.07 })); // linen coif
  head.add(mesh(box(0.06, 0.12, 0.27), CLOTH_PALE, { x: -0.07, y: 0.0 })); // its flaps, over the ears and nape
  sway.add(head);
  const armR = villagerArm({ sleeve: ROBE, skin: SKIN, x: 0.2, y: 0.1, z: -0.13, rz: -1.15 });
  const armL = villagerArm({ sleeve: ROBE, skin: SKIN, x: 0.2, y: 0.1, z: 0.13, rz: -1.15 });
  sway.add(armR, armL);
  g.add(sway);

  // iron-banded coffer at his heel
  add(box(0.52, 0.3, 0.36), WOOD, { x: -0.5, y: 0.15, z: 0.7 });
  add(box(0.56, 0.09, 0.4), WOOD_DARK, { x: -0.5, y: 0.34, z: 0.7 });
  add(box(0.07, 0.44, 0.42), IRON, { x: -0.62, y: 0.17, z: 0.7 });
  add(box(0.07, 0.44, 0.42), IRON, { x: -0.38, y: 0.17, z: 0.7 });
  add(box(0.09, 0.11, 0.04), BRASS, { x: -0.22, y: 0.2, z: 0.7, shadow: false }); // padlock

  // hanging sign: a gold coin on a board, read from the path
  add(box(0.015, 0.34, 0.015), IRON, { x: 1.02, y: 2.05, z: -0.95, shadow: false });
  add(box(0.04, 0.36, 0.5), WOOD_DARK, { x: 1.02, y: 1.72, z: -0.95 });
  add(cyl(0.11, 0.11, 0.05, 9), COIN, { x: 1.05, y: 1.72, z: -0.95, rz: Math.PI / 2, shadow: false });
  add(cyl(0.11, 0.11, 0.05, 9), COIN, { x: 0.99, y: 1.72, z: -0.95, rz: Math.PI / 2, shadow: false });

  bake(g);
  return { group: g, sway, head, armR, armL };
}

export function buildGranary() {
  const g = new THREE.Group();
  const rng = makeRng(202);
  const add = (geo, color, opts) => g.add(mesh(geo, color, opts));

  // staddle stones keep the rats from the grain — mostly
  for (const [lx, lz] of [[-1.3, -1.0], [1.3, -1.0], [-1.3, 1.0], [1.3, 1.0]]) {
    add(cyl(0.15, 0.24, 0.84, 6), tone(STONE, 0.94 + rng() * 0.12), { x: lx, y: 0.4, z: lz });
    add(cyl(0.4, 0.3, 0.13, 8), tone(STONE_DARK, 0.95 + rng() * 0.12), { x: lx, y: 0.86, z: lz });
  }
  // the floor frame resting on them
  for (const lz of [-1.0, 1.0]) add(box(3.6, 0.16, 0.2), WOOD_DARK, { y: 1.02, z: lz });
  for (const lx of [-1.6, -0.8, 0, 0.8, 1.6]) add(box(0.14, 0.12, 2.76), tone(WOOD_DARK, 1.1), { x: lx, y: 1.1 });

  // the bin: a dark core boarded all round, posts at the corners, rails top and bottom
  add(box(3.3, 1.76, 2.5), tone(WOOD_DARK, 0.75), { y: 2.03 });
  boards(g, rng, { axis: 'z', at: 1.27, from: -1.66, to: 1.66, y0: 1.16, y1: 2.9, color: WOOD_PALE });
  boards(g, rng, { axis: 'z', at: -1.27, from: -1.66, to: 1.66, y0: 1.16, y1: 2.9, color: WOOD_PALE });
  boards(g, rng, { axis: 'x', at: 1.67, from: -1.26, to: 1.26, y0: 1.16, y1: 2.9, color: WOOD_PALE });
  boards(g, rng, { axis: 'x', at: -1.67, from: -1.26, to: 1.26, y0: 1.16, y1: 2.9, color: WOOD_PALE });
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) add(box(0.15, 1.8, 0.15), WOOD_DARK, { x: sx * 1.67, y: 2.03, z: sz * 1.27 });
  for (const ry of [1.22, 2.85]) {
    for (const s of [-1, 1]) {
      add(box(3.36, 0.1, 0.05), WOOD_DARK, { y: ry, z: s * 1.305 });
      add(box(0.05, 0.1, 2.56), WOOD_DARK, { x: s * 1.705, y: ry });
    }
  }
  // the hatch the ladder climbs to: ledged boards on a dark frame, an iron latch
  add(box(0.7, 0.96, 0.05), WOOD_DARK, { y: 1.72, z: 1.31 });
  for (const dx of [-0.2, 0, 0.2]) add(box(0.19, 0.84, 0.04), tone(WOOD, 0.9 + rng() * 0.2), { x: dx, y: 1.72, z: 1.335 });
  for (const dy of [1.45, 1.98]) add(box(0.58, 0.07, 0.03), WOOD_DARK, { y: dy, z: 1.362, shadow: false });
  add(box(0.12, 0.04, 0.03), IRON, { x: 0.22, y: 1.72, z: 1.365, shadow: false });

  // thatch, boarded gables, and a hoist beam out over the yard
  thatchRoof(g, rng, { length: 3.95, halfZ: 1.3, eaveY: 2.9, peakY: 3.72 });
  add(gableGeometry(1.3, 2.9, 3.86, 0.06), WOOD, { x: 1.7 });
  add(gableGeometry(1.3, 2.9, 3.86, 0.06), WOOD, { x: -1.64 });
  add(box(0.04, 0.3, 0.3), 0x2a2018, { x: 1.71, y: 3.22, shadow: false }); // loft opening
  add(box(0.95, 0.09, 0.09), WOOD_DARK, { x: 2.05, y: 3.5 });
  add(box(0.02, 0.85, 0.02), ROPE, { x: 2.42, y: 3.06, shadow: false });
  sack(g, { x: 2.42, y: 2.35, z: 0, r: 0.22, color: 0xb5924e });

  // ladder up to the hatch
  add(box(0.07, 1.6, 0.07), WOOD_DARK, { x: -0.2, y: 0.8, z: 1.62, rx: -0.22 });
  add(box(0.07, 1.6, 0.07), WOOD_DARK, { x: 0.2, y: 0.8, z: 1.62, rx: -0.22 });
  for (let i = 0; i < 4; i++) add(box(0.42, 0.05, 0.05), WOOD_PALE, { y: 0.25 + i * 0.36, z: 1.74 - i * 0.082 });

  // grain sacks and a spilled basket — what the rats are here for — and a heap of straw
  sack(g, { x: 1.9, z: 1.2, r: 0.38, color: STRAW, lean: 0.25 });
  sack(g, { x: 2.38, z: 0.72, r: 0.33, color: 0xb5924e });
  sack(g, { x: 1.55, z: 1.75, r: 0.3, color: 0xcdb070, lean: -0.3 });
  add(cyl(0.2, 0.15, 0.2, 8), 0x9a7a44, { x: 2.2, y: 0.1, z: 1.55 });
  add(cyl(0.18, 0.18, 0.03, 8), 0xd9b556, { x: 2.2, y: 0.2, z: 1.55, shadow: false });
  g.add(mesh(raggedCone(0.75, 0.6, 8, rng, 0.2), tone(STRAW, 1.05), { x: -2.05, y: -0.05, z: -0.7 }));
  g.add(mesh(raggedCone(0.45, 0.36, 7, rng, 0.2), tone(STRAW, 0.95), { x: -1.75, y: -0.04, z: -1.45 }));

  return bake(g);
}

// The miller: the man who has been paying the rat bounty since M6 finally
// gets to stand in his own yard. Flour-dusted, arms folded, watching the
// grain. Mute until v2; E gets you a word about the day's tally (main.js).
// Faces local +x; world.js turns him toward the village and walks him on
// his rounds (alive.js makeStroll). Returns { group, props, sway, head,
// armR, armL } — props (sack + fork) stay planted at his home spot.
export function buildMiller() {
  const g = new THREE.Group();
  const DUSTED = 0xbfb5a2; // wool gone grey-white with flour
  const APRON = 0xd8cfae;
  const SKIN = 0xcfa46f;
  const CAP = 0x6b5a44;
  const BEARD = 0x8f8676;

  // stocky tunic, rope belt, floured apron down the front
  villagerRobe(g, { robe: DUSTED, girth: 1.06 });
  g.add(mesh(box(0.06, 0.56, 0.32), APRON, { x: 0.19, y: 0.36 }));
  g.add(mesh(box(0.065, 0.05, 0.34), tone(APRON, 0.85), { x: 0.2, y: 0.64 })); // the apron's tie

  // chest, head, flat cap — the breathing part; the head is its own pivot
  const sway = new THREE.Group();
  sway.position.set(0, 0.78, 0);
  sway.add(mesh(cyl(0.17, 0.19, 0.34, 8), DUSTED, { y: 0.12 }));
  sway.add(mesh(box(0.05, 0.3, 0.3), APRON, { x: 0.165, y: 0.1 })); // the bib
  const head = villagerHead({ skin: SKIN, brow: BEARD, r: 0.135 });
  head.position.set(0, 0.43, 0);
  head.add(mesh(cyl(0.15, 0.165, 0.08, 8), CAP, { y: 0.1 }));
  head.add(mesh(box(0.14, 0.03, 0.14), CAP, { x: 0.13, y: 0.075, shadow: false })); // cap brim over the eyes
  head.add(mesh(box(0.07, 0.09, 0.2), BEARD, { x: 0.1, y: -0.085 })); // a miller's beard, floured like the rest of him
  head.add(mesh(box(0.05, 0.025, 0.13), BEARD, { x: 0.125, y: -0.04, shadow: false }));
  sway.add(head);
  // arms folded across the apron — a man supervising his grain
  const armR = villagerArm({ sleeve: DUSTED, skin: SKIN, w: 0.07, x: 0.16, y: 0.14, z: -0.08, rx: 1.25, rz: -0.35 });
  const armL = villagerArm({ sleeve: DUSTED, skin: SKIN, w: 0.07, x: 0.16, y: 0.1, z: 0.08, rx: -1.25, rz: -0.35 });
  sway.add(armR, armL);
  g.add(sway);

  // a full flour sack and a hay-fork planted at his home spot — in their own
  // group so they stay put while he walks his rounds
  const props = new THREE.Group();
  sack(props, { x: 0.38, z: -0.38, r: 0.25, color: 0xd5c9a8 });
  props.add(mesh(box(0.04, 1.55, 0.04), WOOD_DARK, { x: -0.28, y: 0.74, z: 0.32, rz: 0.12 }));
  props.add(mesh(box(0.035, 0.035, 0.2), WOOD_DARK, { x: -0.455, y: 1.46, z: 0.32, rz: 0.12 }));
  for (const tine of [-0.08, 0, 0.08]) {
    props.add(mesh(box(0.025, 0.24, 0.025), WOOD_DARK, { x: -0.47, y: 1.58, z: 0.32 + tine, rz: 0.12 }));
  }

  bake(g);
  bake(props);
  return { group: g, props, sway, head, armR, armL };
}

// Returns { group, pivot } — pivot is the part that wobbles when struck.
export function buildDummy() {
  const g = new THREE.Group();
  g.add(mesh(cyl(0.09, 0.12, 0.9, 6), WOOD_DARK, { y: 0.45 }));
  // a crossed foot, staked down
  g.add(mesh(box(0.9, 0.07, 0.1), WOOD_DARK, { y: 0.02, ry: 0.5 }));
  g.add(mesh(box(0.9, 0.07, 0.1), WOOD_DARK, { y: 0.03, ry: -1.07 }));

  // the spring tips `pivot` about the world's x and z, so it must stay
  // unturned; the figure inside it is what faces the village
  const pivot = new THREE.Group();
  pivot.position.y = 0.9;
  const figure = new THREE.Group();
  figure.rotation.y = 0.75;
  pivot.add(figure);
  const SACK = 0xcdaa5e;
  const add = (geo, color, opts) => figure.add(mesh(geo, color, opts));
  add(cyl(0.3, 0.36, 0.85, 8), STRAW, { y: 0.42 }); // body
  add(new THREE.SphereGeometry(0.22, 7, 6), 0xd2af66, { y: 1.05 }); // head
  add(box(0.09, 0.09, 1.15), WOOD, { y: 0.62 }); // arms, out to either side
  add(cyl(0.32, 0.32, 0.05, 8), ROPE, { y: 0.25 });
  add(cyl(0.34, 0.34, 0.05, 8), ROPE, { y: 0.6 });
  add(cyl(0.16, 0.2, 0.08, 7), ROPE, { y: 0.87 }); // the neck, tied off
  // a face somebody inked on: crossed eyes and a stitched mouth, looking +x
  for (const s of [-1, 1]) {
    add(box(0.012, 0.07, 0.02), INK, { x: 0.215, y: 1.09, z: s * 0.08, rx: 0.78, shadow: false });
    add(box(0.012, 0.07, 0.02), INK, { x: 0.215, y: 1.09, z: s * 0.08, rx: -0.78, shadow: false });
  }
  add(box(0.012, 0.018, 0.14), INK, { x: 0.2, y: 0.98, shadow: false });
  for (const mz of [-0.045, 0, 0.045]) add(box(0.012, 0.04, 0.012), INK, { x: 0.202, y: 0.98, z: mz, shadow: false });
  // a patch on the belly, and straw bursting from the cuffs
  add(box(0.02, 0.2, 0.22), tone(SACK, 0.8), { x: 0.335, y: 0.42, z: 0.05, rx: 0.2 });
  for (const s of [-1, 1]) {
    const tuft = mesh(new THREE.ConeGeometry(0.09, 0.2, 5), tone(STRAW, 1.08), { y: 0.62, z: s * 0.64 });
    tuft.rotation.x = s * -Math.PI / 2; // splayed out past the end of the arm
    figure.add(tuft);
  }
  // an old round shield strapped to one arm, its paint long faded
  add(cyl(0.26, 0.26, 0.04, 9), tone(WOOD, 1.05), { x: 0.07, y: 0.6, z: -0.5, rz: Math.PI / 2 });
  add(cyl(0.07, 0.07, 0.06, 7), IRON, { x: 0.09, y: 0.6, z: -0.5, rz: Math.PI / 2 });
  add(box(0.012, 0.08, 0.46), 0x8a3a2a, { x: 0.092, y: 0.6, z: -0.5, shadow: false });
  add(box(0.012, 0.46, 0.08), 0x8a3a2a, { x: 0.092, y: 0.6, z: -0.5, shadow: false });
  g.add(pivot);

  bake(g);
  return { group: g, pivot };
}
