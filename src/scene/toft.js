import * as THREE from 'three';
import { mesh, tone, hull } from './meshUtils.js';
import { WOOD_DARK, WOOD, WOOD_PALE, STONE, STONE_DARK, STRAW, IRON, ROPE, THATCH, THATCH_DARK, EYE, box, cyl, sack as kitSack } from './kit.js';

// The toft kit: the common furniture of a peasant's yard — fences and garden
// beds, barrels and woodpiles, haycocks and middens, tools left leaning, and
// the beasts that live there, all at rest. A house's own file (src/scene/
// houses/) sets these out round it through the cottage it is given:
//
//   c.barrel(u, v, { r: 0.3 })          one prop, standing on the real ground at (u, v)
//   c.fence([[u, v], [u, v], …])        a run of fence or hedge along a line
//   c.bed(u0, v0, u1, v1, { crop })     a dug garden bed with something growing in it
//
// Every prop takes ry (which way it is turned) and most take a size. Props
// that would stop a man — a barrel, a rick, a trough — add their own collider;
// pass solid: false to leave one out.
// What is special to one house (the smith's forge, the potter's kiln) is not
// here: it belongs in that house's own file.

const WICKER = 0xa98a55;
const WITHY = 0x8a6d43;
const WITHY_DARK = 0x76592f;
const LINEN = 0xddd5bf;
const EARTH = 0x4a3624;
const EARTH_DARK = 0x3c2b1c;
const LEAF = 0x5f8a3c;
const LEAF_DARK = 0x3f6a30;
const LEAF_PALE = 0x8aa850;
const HAY = 0xc8ab5c;
const DUNG = 0x4b3a26;
const POT = 0x9c5e3c;
const WATER = 0x4f6f78;
const BARK = 0x6e553d;

const TAU = Math.PI * 2;
// shapes for a house's own pieces: a ball, a cone, a rough lump
export const ball = (r, w = 6, h = 5) => new THREE.SphereGeometry(r, w, h);
export const cone = (r, h, seg = 5) => new THREE.ConeGeometry(r, h, seg);
export const lump = (r) => new THREE.IcosahedronGeometry(r, 0);

// a timber from a to b ([x, y, z] each), `w` tall and `d` deep, in group g
export function span(g, a, b, w, d, color, shadow = true) {
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const m = mesh(box(va.distanceTo(vb), w, d), color, { shadow });
  m.position.copy(va).add(vb).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), vb.clone().sub(va).normalize());
  g.add(m);
  return m;
}

// ---------- vessels ----------

// a stave-built barrel or water butt
function barrel(g, rng, { r = 0.3, h = 0.75, lid = true, colour = WOOD_PALE }) {
  g.add(mesh(cyl(r, r * 1.1, h, 9), colour, { y: h / 2 }));
  // hooped with split hazel, as every stave vessel was
  g.add(mesh(cyl(r * 1.13, r * 1.13, 0.06, 9), WITHY_DARK, { y: h * 0.26 }));
  g.add(mesh(cyl(r * 1.06, r * 1.06, 0.06, 9), WITHY_DARK, { y: h * 0.78 }));
  if (lid) g.add(mesh(cyl(r * 0.96, r * 0.96, 0.035, 9), WOOD_DARK, { x: 0.04, y: h + 0.02, z: -0.02, rz: 0.06 }));
  else g.add(mesh(cyl(r * 0.9, r * 0.9, 0.02, 9), WATER, { y: h, shadow: false })); // brim-full: the staves' closed top would hide it any lower
  return { solid: [[0, 0, r * 1.1]] };
}

// a wide, low washing or brewing tub
function tub(g, rng, { r = 0.42, h = 0.36, water = true, colour = WOOD }) {
  g.add(mesh(cyl(r, r * 0.9, h, 10), colour, { y: h / 2 }));
  g.add(mesh(cyl(r * 1.03, r * 1.03, 0.045, 10), tone(WITHY, 0.8), { y: h * 0.7 }));
  if (water) g.add(mesh(cyl(r * 0.92, r * 0.92, 0.02, 10), WATER, { y: h, shadow: false }));
  return { solid: [[0, 0, r]] };
}

// a stave pail with a rope handle
function bucket(g, rng, { r = 0.12, h = 0.22, water = false }) {
  g.add(mesh(cyl(r, r * 0.82, h, 8), WOOD_PALE, { y: h / 2 }));
  g.add(mesh(cyl(r * 1.04, r * 1.04, 0.025, 8), WITHY_DARK, { y: h * 0.72, shadow: false }));
  if (water) g.add(mesh(cyl(r * 0.9, r * 0.9, 0.015, 8), WATER, { y: h, shadow: false }));
  g.add(mesh(box(r * 2.1, 0.015, 0.015), ROPE, { y: h + 0.1, shadow: false }));
  for (const s of [-1, 1]) g.add(mesh(box(0.015, 0.11, 0.015), ROPE, { x: s * r, y: h + 0.05, shadow: false }));
}

// a wicker basket; fill: the colour of what is heaped in it (apples, wool, eggs …)
function basket(g, rng, { r = 0.2, h = 0.2, fill = null }) {
  g.add(mesh(cyl(r, r * 0.76, h, 8), WICKER, { y: h / 2 }));
  g.add(mesh(cyl(r * 1.05, r * 1.05, 0.03, 8), tone(WICKER, 0.8), { y: h }));
  if (fill !== null) {
    const heap = mesh(ball(r * 0.86), fill, { y: h - 0.02 });
    heap.scale.y = 0.45;
    g.add(heap);
  }
}

// a clay pot, jug or crock
function pot(g, rng, { r = 0.11, h = 0.22, colour = POT, neck = true }) {
  g.add(mesh(cyl(r * 0.8, r * 0.6, h * 0.25, 7), colour, { y: h * 0.125 }));
  g.add(mesh(cyl(r * 0.72, r, h * 0.5, 7), colour, { y: h * 0.5 }));
  if (neck) g.add(mesh(cyl(r * 0.62, r * 0.55, h * 0.25, 7), tone(colour, 0.9), { y: h * 0.86 }));
}

function sack(g, rng, { r = 0.26, colour = STRAW, lean = 0 }) {
  kitSack(g, { x: 0, z: 0, r, color: colour, lean });
}

// a hollowed-log trough
function trough(g, rng, { len = 1.2, water = true }) {
  g.add(mesh(box(len, 0.26, 0.4), WOOD, { y: 0.17 }));
  g.add(mesh(box(len - 0.12, 0.02, 0.28), water ? WATER : EARTH_DARK, { y: 0.305, shadow: false }));
  for (const s of [-1, 1]) g.add(mesh(box(0.12, 0.12, 0.46), WOOD_DARK, { x: s * (len / 2 - 0.16), y: 0.05 }));
  return { solid: [[-len / 4, 0, 0.3], [len / 4, 0, 0.3]] };
}

// ---------- seats and boards ----------

function bench(g, rng, { len = 1.2 }) {
  g.add(mesh(box(len, 0.06, 0.3), WOOD_PALE, { y: 0.42 }));
  for (const s of [-1, 1]) g.add(mesh(box(0.07, 0.4, 0.26), WOOD_DARK, { x: s * (len / 2 - 0.14), y: 0.2 }));
  return { solid: [[-len / 4, 0, 0.2], [len / 4, 0, 0.2]] }; // a man does not walk through a bench
}

function stool(g) {
  g.add(mesh(cyl(0.16, 0.16, 0.05, 7), WOOD_PALE, { y: 0.36 }));
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * TAU;
    g.add(mesh(box(0.04, 0.36, 0.04), WOOD_DARK, { x: Math.cos(a) * 0.1, y: 0.17, z: Math.sin(a) * 0.1 }));
  }
}

// a board on two trestles
function trestle(g, rng, { len = 1.5, wide = 0.6 }) {
  g.add(mesh(box(len, 0.05, wide), WOOD_PALE, { y: 0.72 }));
  for (const s of [-1, 1]) {
    for (const t of [-1, 1]) g.add(mesh(box(0.05, 0.76, 0.05), WOOD_DARK, { x: s * (len / 2 - 0.2), y: 0.35, z: t * 0.16, rx: t * 0.22 }));
    g.add(mesh(box(0.06, 0.05, wide * 0.8), WOOD_DARK, { x: s * (len / 2 - 0.2), y: 0.67 }));
  }
  return { solid: [[0, 0, Math.min(len, 1.2) * 0.4]] };
}

// ---------- fuel and fodder ----------

// logs stacked with their sawn ends out (toward +z)
function woodpile(g, rng, { len = 1.5, rows = 3 }) {
  const per = Math.round(len / 0.19);
  for (let row = 0; row < rows; row++) {
    for (let i = 0; i < per - row; i++) {
      const r = 0.075 + rng() * 0.02;
      const x = -len / 2 + 0.1 + row * 0.095 + i * 0.19;
      const y = 0.08 + row * 0.15;
      g.add(mesh(cyl(r, r, 0.5, 6), tone(WOOD, 0.8 + rng() * 0.3), { x, y, rx: Math.PI / 2 }));
      g.add(mesh(cyl(r * 0.82, r * 0.82, 0.012, 6), tone(WOOD_PALE, 1.12), { x, y, z: 0.252, rx: Math.PI / 2, shadow: false }));
    }
  }
  return { solid: [[-len / 4, 0, 0.32], [len / 4, 0, 0.32]] };
}

// the block logs are split on; axe: true leaves the axe sunk in it
// (not `block`: c.block is the cottage's own rect collider)
function chopBlock(g, rng, { axe = true }) {
  g.add(mesh(cyl(0.2, 0.23, 0.44, 8), tone(WOOD, 0.9), { y: 0.2 }));
  if (axe) {
    g.add(mesh(box(0.035, 0.52, 0.035), WOOD_PALE, { x: 0.09, y: 0.62, rz: -0.55 }));
    g.add(mesh(box(0.15, 0.1, 0.03), IRON, { x: -0.04, y: 0.47, rz: -0.55 }));
  }
  return { solid: [[0, 0, 0.22]] };
}

// bundles of brushwood bound with a withy, stacked
function faggots(g, rng, { n = 5 }) {
  for (let i = 0; i < n; i++) {
    const layer = i < 3 ? 0 : 1;
    const x = layer ? (i - 3.5) * 0.3 : (i - 1) * 0.3;
    const sub = new THREE.Group();
    sub.position.set(x, 0.13 + layer * 0.24, (rng() - 0.5) * 0.08);
    sub.rotation.y = (rng() - 0.5) * 0.2;
    sub.add(mesh(cyl(0.12, 0.14, 0.9, 6), tone(0x5e4a33, 0.85 + rng() * 0.3), { rx: Math.PI / 2 }));
    sub.add(mesh(cyl(0.145, 0.145, 0.04, 6), WITHY, { rx: Math.PI / 2, shadow: false }));
    g.add(sub);
  }
  return { solid: [[0, 0, 0.45]] };
}

// hay heaped up to dry
function haycock(g, rng, { r = 0.7, h = 0.9 }) {
  g.add(mesh(cone(r, h, 8), tone(HAY, 0.95 + rng() * 0.1), { y: h / 2 - 0.03, ry: rng() }));
  g.add(mesh(cone(r * 0.62, h * 0.5, 7), tone(HAY, 1.06), { y: h * 0.78, ry: rng() }));
  for (let i = 0; i < 4; i++) {
    const a = rng() * TAU;
    g.add(mesh(box(0.34, 0.04, 0.14), tone(HAY, 0.85 + rng() * 0.3), { x: Math.cos(a) * r * 1.05, y: 0.03, z: Math.sin(a) * r * 1.05, ry: rng() * TAU, shadow: false }));
  }
  return { solid: [[0, 0, r * 0.8]] };
}

// the dung heap: every toft has one, and it goes on the garden in spring
function midden(g, rng, { r = 0.8 }) {
  const heap = mesh(cone(r, r * 0.6, 7), DUNG, { y: r * 0.26, ry: rng() });
  g.add(heap);
  g.add(mesh(cone(r * 0.6, r * 0.42, 6), tone(DUNG, 1.12), { x: r * 0.25, y: r * 0.2, z: r * 0.2, ry: rng() }));
  for (let i = 0; i < 5; i++) {
    const a = rng() * TAU;
    const d = rng() * r * 0.8;
    g.add(mesh(box(0.26, 0.03, 0.06), tone(STRAW, 0.8 + rng() * 0.3), { x: Math.cos(a) * d, y: r * 0.6 * (1 - d / r) + 0.03, z: Math.sin(a) * d, ry: rng() * TAU, shadow: false }));
  }
  return { solid: [[0, 0, r * 0.7]] };
}

// ---------- tools ----------

// A ladder leaning on something: the group stands at its foot, and it leans
// toward -z (turn the group so -z faces the wall). len: its length; lean:
// radians off upright.
function ladder(g, rng, { len = 2.6, lean = 0.3 }) {
  const sub = new THREE.Group();
  sub.rotation.x = -lean;
  for (const s of [-1, 1]) sub.add(mesh(box(0.055, len, 0.055), tone(WOOD_PALE, 0.92 + rng() * 0.12), { x: s * 0.2, y: len / 2 }));
  const rungs = Math.round(len / 0.34);
  for (let i = 1; i < rungs; i++) sub.add(mesh(box(0.42, 0.04, 0.04), WOOD, { y: (i * len) / rungs }));
  g.add(sub);
}

// A hand tool leaned against a wall or stuck in the ground: the group stands
// at its foot and it leans toward -z. kind: 'spade' | 'fork' | 'rake' | 'hoe'
// | 'scythe' | 'flail' | 'axe' | 'pitchfork' | 'crook' | 'besom'.
function tool(g, rng, { kind = 'spade', lean = 0.22, len }) {
  const sub = new THREE.Group();
  sub.rotation.x = -lean;
  const L = len ?? (kind === 'scythe' ? 1.5 : kind === 'axe' ? 0.75 : kind === 'crook' ? 1.6 : 1.3);
  const shaft = (colour = WOOD_PALE) => sub.add(mesh(box(0.035, L, 0.035), colour, { y: L / 2 }));
  if (kind === 'spade') {
    shaft();
    sub.add(mesh(box(0.17, 0.26, 0.025), WOOD, { y: 0.13 })); // a wooden blade…
    sub.add(mesh(box(0.18, 0.07, 0.03), IRON, { y: 0.03 })); // …shod with iron
    sub.add(mesh(box(0.14, 0.035, 0.035), WOOD_PALE, { y: L }));
  } else if (kind === 'fork' || kind === 'pitchfork') {
    shaft();
    const tines = kind === 'fork' ? 3 : 2;
    sub.add(mesh(box(0.2, 0.035, 0.035), WOOD_DARK, { y: L - 0.02 }));
    for (let i = 0; i < tines; i++) sub.add(mesh(box(0.025, 0.3, 0.025), WOOD_DARK, { x: -0.085 + (i * 0.17) / (tines - 1), y: L + 0.13 }));
  } else if (kind === 'rake') {
    shaft();
    sub.add(mesh(box(0.5, 0.04, 0.04), WOOD, { y: L }));
    for (let i = 0; i < 6; i++) sub.add(mesh(box(0.02, 0.02, 0.1), WOOD_DARK, { x: -0.22 + i * 0.088, y: L, z: 0.06, shadow: false }));
  } else if (kind === 'hoe') {
    shaft();
    sub.add(mesh(box(0.16, 0.03, 0.14), IRON, { y: L - 0.02, z: 0.07 }));
  } else if (kind === 'scythe') {
    shaft();
    sub.add(mesh(box(0.03, 0.03, 0.12), WOOD_PALE, { y: L * 0.6, z: 0.07 }));
    sub.add(mesh(box(0.75, 0.05, 0.015), IRON, { x: 0.34, y: L - 0.02, rz: 0.2 }));
  } else if (kind === 'flail') {
    shaft();
    sub.add(mesh(box(0.035, 0.5, 0.035), WOOD, { x: 0.1, y: L - 0.2, rz: 0.5 })); // the swingle, hanging by its thong
  } else if (kind === 'axe') {
    shaft();
    sub.add(mesh(box(0.17, 0.11, 0.03), IRON, { x: 0.07, y: L - 0.06 }));
  } else if (kind === 'crook') {
    shaft();
    sub.add(mesh(box(0.12, 0.03, 0.03), WOOD_PALE, { x: 0.05, y: L + 0.01 }));
    sub.add(mesh(box(0.03, 0.1, 0.03), WOOD_PALE, { x: 0.1, y: L - 0.04 }));
  } else if (kind === 'besom') {
    shaft();
    sub.add(mesh(cone(0.11, 0.36, 6), 0x7a6238, { y: 0.16, rx: Math.PI }));
    sub.add(mesh(cyl(0.05, 0.05, 0.04, 6), WITHY, { y: 0.33, shadow: false }));
  }
  g.add(sub);
}

// a hand-barrow: a slatted bed between two poles, carried by two (the
// one-wheeled barrow is a new and rare thing; this is the everyday tool)
function barrow(g, rng, { load = null }) {
  for (const s of [-1, 1]) g.add(mesh(box(1.9, 0.05, 0.05), WOOD_PALE, { y: 0.3, z: s * 0.28 }));
  for (let i = 0; i < 5; i++) g.add(mesh(box(0.14, 0.03, 0.6), tone(WOOD, 0.88 + rng() * 0.2), { x: -0.4 + i * 0.2, y: 0.33 }));
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(mesh(box(0.05, 0.3, 0.05), WOOD_DARK, { x: sx * 0.45, y: 0.15, z: sz * 0.28 }));
  if (load !== null) {
    const heap = mesh(ball(0.3), load, { y: 0.4 });
    heap.scale.set(1.3, 0.55, 0.8);
    g.add(heap);
  }
  return { solid: [[0, 0, 0.45]] };
}

// a wattle hurdle standing on its own (prop it, or stake it)
function hurdle(g, rng, { len = 1.6, h = 0.95, lean = 0 }) {
  const sub = new THREE.Group();
  sub.rotation.x = -lean;
  const bands = Math.max(3, Math.round(h / 0.17));
  for (let i = 0; i < bands; i++) sub.add(mesh(box(len, h / bands - 0.012, 0.035), tone(i % 2 ? WITHY : WITHY_DARK, 0.9 + rng() * 0.2), { y: 0.08 + (i + 0.5) * (h / bands), z: i % 2 ? 0.012 : -0.012 }));
  const stakes = Math.max(2, Math.round(len / 0.4));
  for (let i = 0; i <= stakes; i++) sub.add(mesh(box(0.035, h + 0.22, 0.035), WOOD_DARK, { x: -len / 2 + (i * len) / stakes, y: (h + 0.16) / 2 }));
  g.add(sub);
  return lean ? null : { solid: Array.from({ length: Math.ceil(len / 0.4) + 1 }, (_, i) => [-len / 2 + (i * len) / Math.ceil(len / 0.4), 0, 0.27]) };
}

// Washing spread to dry over a length of hedge (along x) — there are no
// clothes-lines yet. cloths: their colours (undyed cream, russet, dull blue,
// madder red are the period's).
function washing(g, rng, { len = 2.4, h = 0.9, cloths = [LINEN, 0x9a6a4a, LINEN] }) {
  const n = Math.max(2, Math.round(len / 0.55));
  for (let i = 0; i < n; i++) {
    const r = 0.3 + rng() * 0.12;
    const m = mesh(lump(r), tone(rng() < 0.3 ? 0x56603a : 0x4c6a34, 0.85 + rng() * 0.3), { x: -len / 2 + (i + 0.5) * (len / n), y: h * 0.45, z: (rng() - 0.5) * 0.1, ry: rng() * TAU });
    m.scale.y = (h / r) * 0.6;
    g.add(m);
  }
  const room = len / cloths.length;
  cloths.forEach((colour, i) => {
    const w = room * (0.55 + rng() * 0.3);
    const x = -len / 2 + (i + 0.5) * room;
    const c = tone(colour, 0.94 + rng() * 0.1);
    // laid over the top, hanging a little down each side
    g.add(mesh(box(w, 0.025, 0.5), c, { x, y: h + 0.03, rz: (rng() - 0.5) * 0.08 }));
    for (const s of [-1, 1]) g.add(mesh(box(w, 0.3 + rng() * 0.2, 0.025), c, { x, y: h - 0.12, z: s * 0.26, rx: s * 0.2 }));
  });
  return { solid: Array.from({ length: n }, (_, i) => [-len / 2 + (i + 0.5) * (len / n), 0, 0.32]) };
}

// a round hayrick on a bed of brushwood, capped with thatch against the rain
function rick(g, rng, { r = 1.0, h = 1.9 }) {
  g.add(mesh(cyl(r * 1.08, r, 0.14, 9), 0x5a4a36, { y: 0.05 })); // the brushwood it stands on
  g.add(mesh(cyl(r * 1.1, r * 0.95, h * 0.55, 9), tone(HAY, 0.96), { y: 0.12 + h * 0.275, ry: rng() }));
  g.add(mesh(cyl(r * 1.22, r * 1.16, 0.13, 9), tone(THATCH_DARK, 0.95), { y: 0.12 + h * 0.56 }));
  g.add(mesh(cone(r * 1.2, h * 0.5, 9), THATCH, { y: 0.14 + h * 0.56 + h * 0.25, ry: 0.2 }));
  g.add(mesh(cyl(0.025, 0.03, 0.4, 5), WOOD_DARK, { y: 0.14 + h * 1.08 }));
  return { solid: [[0, 0, r * 1.02]] };
}

// a gap in a fence, closed the peasant's way: two posts and two slip-poles
// across (along x). open: true leaves the poles drawn and leaned on one post.
function slipPoles(g, rng, { w = 1.4, open = false }) {
  for (const s of [-1, 1]) g.add(mesh(cyl(0.06, 0.075, 1.5, 6), tone(WOOD_DARK, 0.9 + rng() * 0.2), { x: s * (w / 2), y: 0.55 }));
  if (open) {
    for (const k of [0, 1]) span(g, [-w / 2 + 0.06, 0.05, 0.1 + k * 0.1], [-w / 2 + 0.3 + k * 0.1, 1.5, 0.16 + k * 0.1], 0.055, 0.055, tone(WOOD_PALE, 0.9 + rng() * 0.2));
    return { solid: [[-w / 2, 0, 0.12], [w / 2, 0, 0.12]] };
  }
  for (const y of [0.45, 0.85]) span(g, [-w / 2 - 0.1, y, 0.05], [w / 2 + 0.1, y + (rng() - 0.5) * 0.06, 0.05], 0.055, 0.055, tone(WOOD_PALE, 0.9 + rng() * 0.2));
  return { solid: Array.from({ length: Math.ceil(w / 0.4) + 1 }, (_, i) => [-w / 2 + i * (w / Math.ceil(w / 0.4)), 0, 0.27]) };
}

// ---------- small buildings ----------

// a hen-house on legs, with a ramp up to its pop-hole
function coop(g, rng) {
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(mesh(box(0.06, 0.4, 0.06), WOOD_DARK, { x: sx * 0.4, y: 0.2, z: sz * 0.3 }));
  g.add(mesh(box(0.95, 0.55, 0.75), tone(WOOD, 0.95), { y: 0.67 }));
  for (const s of [-1, 1]) g.add(mesh(box(1.1, 0.07, 0.56), tone(THATCH_DARK, s > 0 ? 1 : 0.9), { y: 1.06, z: s * 0.2, rx: s * 0.6 }));
  g.add(mesh(box(0.2, 0.24, 0.02), 0x1f1812, { y: 0.56, z: 0.385, shadow: false }));
  g.add(mesh(box(0.2, 0.03, 0.62), WOOD_PALE, { y: 0.24, z: 0.62, rx: 0.62 }));
  return { solid: [[0, 0, 0.55]] };
}

// a straw bee skep on its stand
function skep(g, rng, { stand = true }) {
  const y0 = stand ? 0.34 : 0;
  if (stand) {
    g.add(mesh(box(0.5, 0.05, 0.5), WOOD_PALE, { y: 0.32 }));
    g.add(mesh(cyl(0.07, 0.09, 0.32, 6), WOOD_DARK, { y: 0.15 }));
  }
  g.add(mesh(cyl(0.2, 0.22, 0.14, 8), tone(STRAW, 0.95), { y: y0 + 0.07 }));
  g.add(mesh(cyl(0.15, 0.2, 0.13, 8), STRAW, { y: y0 + 0.2 }));
  g.add(mesh(cyl(0.06, 0.15, 0.11, 8), tone(STRAW, 1.06), { y: y0 + 0.32 }));
  g.add(mesh(box(0.07, 0.035, 0.02), 0x1f1812, { y: y0 + 0.04, z: 0.215, shadow: false }));
}

// ---------- growing things ----------

// a small fruit tree. kind: 'apple' | 'pear' | 'cherry' | 'plum'. fruit: hang some on it.
function tree(g, rng, { kind = 'apple', h = 2.6, fruit = true }) {
  const lean = (rng() - 0.5) * 0.16;
  g.add(mesh(cyl(0.07, 0.12, h * 0.55, 6), BARK, { y: h * 0.26, rz: lean }));
  const dot = { apple: 0xb5372a, pear: 0xb7b04a, cherry: 0x8e1f2a, plum: 0x5a3a6a }[kind];
  const crown = [[0, h * 0.74, 0, h * 0.3], [h * 0.2, h * 0.6, h * 0.08, h * 0.22], [-h * 0.17, h * 0.63, -h * 0.1, h * 0.23], [h * 0.02, h * 0.62, h * 0.2, h * 0.2]];
  for (const [x, y, z, r] of crown) {
    const blob = mesh(new THREE.IcosahedronGeometry(r, 1), tone(rng() < 0.5 ? LEAF : LEAF_DARK, 0.9 + rng() * 0.25), { x, y, z, ry: rng() * TAU });
    blob.scale.y = 0.84;
    g.add(blob);
    if (fruit) {
      for (let i = 0; i < 4; i++) {
        const a = rng() * TAU;
        const up = (rng() - 0.6) * r;
        const out = Math.sqrt(Math.max(0.01, r * r - up * up)) * 0.98;
        g.add(mesh(box(0.07, 0.07, 0.07), dot, { x: x + Math.cos(a) * out, y: y + up * 0.84, z: z + Math.sin(a) * out, shadow: false }));
      }
    }
  }
  return { solid: [[0, 0, 0.16]] };
}

// a bush: gooseberry, a rose, a clump of elder
function bush(g, rng, { r = 0.4, colour = LEAF_DARK, flowers = null }) {
  for (let i = 0; i < 3; i++) {
    const rr = r * (0.6 + rng() * 0.4);
    const a = rng() * TAU;
    const x = Math.cos(a) * r * 0.4;
    const z = Math.sin(a) * r * 0.4;
    const blob = mesh(lump(rr), tone(colour, 0.88 + rng() * 0.26), { x, y: rr * 0.6, z, ry: rng() * TAU });
    blob.scale.y = 0.8;
    g.add(blob);
    if (flowers !== null) for (let k = 0; k < 3; k++) g.add(mesh(box(0.06, 0.06, 0.06), flowers, { x: x + (rng() - 0.5) * rr * 1.3, y: rr * (0.9 + rng() * 0.5), z: z + (rng() - 0.5) * rr * 1.3, shadow: false }));
  }
}

// a small pond: the pit the daub was dug from, filled with rain. Lay it on
// level ground — it is flat, and the ground under it may not be.
function pond(g, rng, { r = 1.3 }) {
  const rim = mesh(cyl(r * 1.18, r * 1.25, 0.1, 11), 0x4a3a28, { y: 0.0, ry: rng() }); // trodden mud
  rim.scale.z = 0.8;
  g.add(rim);
  const water = mesh(cyl(r, r, 0.04, 11), 0x3d5560, { y: 0.045, ry: rng(), shadow: false });
  water.scale.z = 0.78;
  g.add(water);
  for (let i = 0; i < 4; i++) {
    const a = rng() * TAU;
    g.add(mesh(cone(0.05, 0.4 + rng() * 0.25, 3), tone(LEAF_DARK, 0.9 + rng() * 0.3), { x: Math.cos(a) * r * 1.02, y: 0.22, z: Math.sin(a) * r * 0.8, shadow: false })); // rushes at its edge
  }
}

// a sawn or felled stump
function stump(g, rng, { r = 0.24, h = 0.3 }) {
  g.add(mesh(cyl(r * 0.9, r * 1.15, h, 7), BARK, { y: h / 2 }));
  g.add(mesh(cyl(r * 0.84, r * 0.84, 0.015, 7), tone(WOOD_PALE, 1.08), { y: h, shadow: false }));
  return { solid: [[0, 0, r]] };
}

// a rough block of stone: a mounting block, a seat, a boundary stone
function rock(g, rng, { r = 0.3, squash = 0.7, colour = STONE }) {
  const m = mesh(lump(r), tone(colour, 0.9 + rng() * 0.2), { y: r * squash * 0.55, ry: rng() * TAU });
  m.scale.y = squash;
  g.add(m);
  return r > 0.28 ? { solid: [[0, 0, r * 0.85]] } : null;
}

// ---------- beasts, all at rest ----------

// kind: 'hen' | 'cock' | 'goose' | 'pig' | 'sheep' | 'lamb' | 'dog' | 'cat' | 'goat' | 'ox' | 'cow' | 'pony'
// Each faces its group's +x. lying: true for a beast lying down (pig, sheep, dog, ox, cow).
function beast(g, rng, { kind = 'hen', colour, lying = false }) {
  const put = (geo, col, o) => g.add(mesh(geo, col, o));
  const blob = (r, col, x, y, z, sx, sy, sz) => {
    const m = mesh(ball(r), col, { x, y, z });
    m.scale.set(sx, sy, sz);
    g.add(m);
  };
  if (kind === 'hen' || kind === 'cock') {
    const body = colour ?? [0x8a5a34, 0xb08a5a, 0x4a3a30, 0xd8ccb0][Math.floor(rng() * 4)];
    blob(0.1, body, 0, 0.17, 0, 1.25, 1, 0.9);
    put(cone(0.07, 0.16, 4), tone(body, 0.8), { x: -0.13, y: 0.22, rz: 0.9 });
    put(ball(0.05, 5, 4), body, { x: 0.11, y: 0.27 });
    put(box(0.03, kind === 'cock' ? 0.06 : 0.035, 0.015), 0xb5372a, { x: 0.11, y: 0.32, shadow: false });
    put(box(0.04, 0.015, 0.02), 0xc9a23a, { x: 0.16, y: 0.265, shadow: false });
    for (const s of [-1, 1]) put(box(0.012, 0.1, 0.012), 0xc9a23a, { x: 0.01, y: 0.05, z: s * 0.035, shadow: false });
  } else if (kind === 'goose') {
    const body = colour ?? 0xe6e1d2;
    blob(0.15, body, 0, 0.24, 0, 1.4, 0.95, 0.95);
    put(cyl(0.035, 0.045, 0.26, 5), body, { x: 0.2, y: 0.42, rz: -0.35 });
    put(ball(0.055, 5, 4), body, { x: 0.25, y: 0.55 });
    put(box(0.07, 0.025, 0.035), 0xd98a2e, { x: 0.31, y: 0.54, shadow: false });
    for (const s of [-1, 1]) put(box(0.02, 0.12, 0.02), 0xd98a2e, { x: 0.02, y: 0.06, z: s * 0.05, shadow: false });
  } else if (kind === 'pig') {
    // a medieval pig: lean, dark and bristled, long in the snout
    const hide = colour ?? 0x7a5c48;
    const y = lying ? 0.2 : 0.36;
    blob(0.24, hide, 0, y, 0, 1.55, lying ? 0.78 : 0.9, lying ? 1.1 : 0.9);
    put(box(0.5, 0.05, 0.05), tone(hide, 0.62), { y: y + (lying ? 0.17 : 0.2), shadow: false }); // the bristle ridge
    blob(0.14, hide, 0.42, y - 0.02, 0, 1.2, 0.95, 0.9);
    put(cyl(0.06, 0.075, 0.14, 6), tone(hide, 1.15), { x: 0.6, y: y - 0.05, rz: Math.PI / 2 });
    for (const s of [-1, 1]) put(box(0.07, 0.09, 0.02), tone(hide, 0.8), { x: 0.4, y: y + 0.12, z: s * 0.09, rz: -0.5 });
    if (!lying) for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(box(0.06, 0.22, 0.06), tone(hide, 0.85), { x: sx * 0.24, y: 0.11, z: sz * 0.11 });
  } else if (kind === 'sheep' || kind === 'lamb' || kind === 'goat') {
    const k = kind === 'lamb' ? 0.6 : 1;
    const goat = kind === 'goat';
    const fleece = colour ?? (goat ? 0x8a7a66 : 0xd6cfba);
    const face = goat ? tone(fleece, 0.8) : 0x3a332c;
    const y = (lying ? 0.2 : 0.42) * k;
    const body = mesh(new THREE.IcosahedronGeometry(0.24 * k, goat ? 0 : 1), fleece, { y });
    body.scale.set(1.45, goat ? 0.8 : 0.92, goat ? 0.8 : 1);
    g.add(body);
    blob(0.1 * k, face, 0.38 * k, y + 0.1 * k, 0, 1.3, 1, 0.9);
    for (const s of [-1, 1]) put(box(0.03, 0.03, 0.09 * k), face, { x: 0.34 * k, y: y + 0.17 * k, z: s * 0.1 * k, shadow: false });
    if (goat) {
      for (const s of [-1, 1]) put(box(0.03, 0.16, 0.03), 0x4a4038, { x: 0.33, y: y + 0.26, z: s * 0.05, rz: 0.5 });
      put(box(0.03, 0.09, 0.03), tone(fleece, 0.7), { x: 0.44, y: y - 0.02 });
    }
    if (!lying) for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(box(0.05 * k, 0.26 * k, 0.05 * k), face, { x: sx * 0.2 * k, y: 0.13 * k, z: sz * 0.1 * k });
  } else if (kind === 'dog') {
    const coat = colour ?? 0x7a5a3a;
    blob(0.17, coat, 0, lying ? 0.13 : 0.34, 0, 1.6, lying ? 0.75 : 0.9, 0.9);
    blob(0.1, coat, 0.3, lying ? 0.12 : 0.44, lying ? 0.06 : 0, 1.25, 0.9, 0.9);
    put(box(0.1, 0.05, 0.07), tone(coat, 0.75), { x: 0.42, y: lying ? 0.1 : 0.42, z: lying ? 0.06 : 0 });
    for (const s of [-1, 1]) put(box(0.04, 0.07, 0.03), tone(coat, 0.7), { x: 0.27, y: lying ? 0.2 : 0.53, z: (lying ? 0.06 : 0) + s * 0.07, shadow: false });
    put(box(0.26, 0.04, 0.04), coat, { x: -0.36, y: lying ? 0.06 : 0.4, z: lying ? 0.08 : 0, ry: lying ? 0.6 : 0, rz: lying ? 0 : 0.5 });
    if (!lying) for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(box(0.05, 0.24, 0.05), tone(coat, 0.85), { x: sx * 0.17, y: 0.12, z: sz * 0.08 });
  } else if (kind === 'cat') {
    const coat = colour ?? [0x6a6258, 0xb07a44, 0x2e2a28][Math.floor(rng() * 3)];
    blob(0.1, coat, 0, 0.08, 0, 1.4, 0.8, 1.1); // curled up asleep
    put(ball(0.06, 5, 4), coat, { x: 0.1, y: 0.1, z: 0.06 });
    for (const s of [-1, 1]) put(cone(0.02, 0.04, 3), coat, { x: 0.1 + s * 0.03, y: 0.17, z: 0.06, shadow: false });
    put(box(0.16, 0.025, 0.03), tone(coat, 0.85), { x: -0.02, y: 0.03, z: 0.12, ry: 0.3, shadow: false });
  } else if (kind === 'pony') {
    // a small shaggy horse: the carter's, or a well-off husbandman's
    const coat = colour ?? 0x6a5340;
    const y = 0.8;
    // the barrel: round quarters, a dipped back, a deep girth behind the elbow
    g.add(mesh(hull([
      [-0.56, 0.2, 0.17], [-0.56, 0.2, -0.17], [-0.6, -0.1, 0.15], [-0.6, -0.1, -0.15], [-0.5, 0.26, 0],
      [-0.3, 0.02, 0.24], [-0.3, 0.02, -0.24], [-0.05, -0.24, 0.16], [-0.05, -0.24, -0.16],
      [0.36, 0.26, 0], [0.34, 0.02, 0.22], [0.34, 0.02, -0.22], [0.36, -0.25, 0.12], [0.36, -0.25, -0.12],
      [0.56, 0.14, 0.11], [0.56, 0.14, -0.11], [0.58, -0.12, 0.1], [0.58, -0.12, -0.1],
    ]), coat, { y }));
    g.add(mesh(box(0.2, 0.52, 0.24), coat, { x: 0.6, y: y + 0.28, rz: -0.6 })); // the neck
    g.add(mesh(box(0.36, 0.2, 0.2), tone(coat, 0.94), { x: 0.86, y: y + 0.44, rz: -0.5 }));
    g.add(mesh(box(0.1, 0.5, 0.06), tone(coat, 0.55), { x: 0.52, y: y + 0.36, rz: -0.6, shadow: false })); // the mane
    for (const s of [-1, 1]) put(box(0.04, 0.09, 0.04), tone(coat, 0.8), { x: 0.74, y: y + 0.6, z: s * 0.07, shadow: false });
    put(box(0.08, 0.6, 0.08), tone(coat, 0.55), { x: -0.62, y: y - 0.12, rz: 0.14 }); // the tail
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(box(0.09, 0.62, 0.09), tone(coat, 0.85), { x: sx * 0.38, y: 0.3, z: sz * 0.13 });
    return { solid: [[-0.3, 0, 0.36], [0.4, 0, 0.36]] };
  } else if (kind === 'ox' || kind === 'cow') {
    const hide = colour ?? (kind === 'ox' ? 0x7a4a30 : 0x8a6a4a);
    const y = lying ? 0.38 : 0.82;
    // the barrel, shaped as cattle are: square hip bones, a sharp spine over
    // sprung ribs, the belly hanging low, a deep brisket between the forelegs
    g.add(mesh(hull([
      [-0.64, 0.22, 0.21], [-0.64, 0.22, -0.21], [-0.68, -0.14, 0.17], [-0.68, -0.14, -0.17], [-0.6, 0.29, 0],
      [-0.1, 0.04, 0.32], [-0.1, 0.04, -0.32], [-0.08, -0.33, 0.17], [-0.08, -0.33, -0.17],
      [0.5, 0.34, 0], [0.5, 0.06, 0.27], [0.5, 0.06, -0.27], [0.48, -0.31, 0.13], [0.48, -0.31, -0.13],
      [0.7, 0.2, 0.12], [0.7, 0.2, -0.12], [0.72, -0.14, 0.11], [0.72, -0.14, -0.11],
    ]), hide, { y }));
    // the neck, thick where it leaves the shoulder
    g.add(mesh(hull([
      [0.58, 0.3, 0.1], [0.58, 0.3, -0.1], [0.6, -0.16, 0.1], [0.6, -0.16, -0.1],
      [0.92, 0.22, 0.09], [0.92, 0.22, -0.09], [0.9, -0.06, 0.08], [0.9, -0.06, -0.08],
    ]), tone(hide, 0.96), { y }));
    g.add(mesh(box(0.42, 0.3, 0.3), tone(hide, 0.92), { x: 0.9, y: y + 0.08, rz: -0.35 }));
    g.add(mesh(box(0.16, 0.18, 0.24), tone(hide, 1.25), { x: 1.1, y: y - 0.04, rz: -0.35 }));
    for (const s of [-1, 1]) {
      put(box(0.04, 0.04, 0.22), 0xd8ccb0, { x: 0.82, y: y + 0.27, z: s * 0.2, rx: s * -0.5 });
      put(box(0.05, 0.03, 0.12), tone(hide, 0.8), { x: 0.8, y: y + 0.17, z: s * 0.2, shadow: false });
    }
    put(box(0.05, 0.5, 0.05), tone(hide, 0.8), { x: -0.68, y: y - 0.05, rz: 0.12 }); // the tail
    if (kind === 'cow' && !lying) put(ball(0.12, 5, 4), 0xd9a8a0, { x: -0.3, y: y - 0.32 });
    if (!lying) for (const sx of [-1, 1]) for (const sz of [-1, 1]) put(box(0.12, 0.6, 0.12), tone(hide, 0.85), { x: sx * 0.46, y: 0.28, z: sz * 0.17 });
    return { solid: [[-0.35, 0, 0.42], [0.45, 0, 0.42]] };
  }
  return kind === 'pig' || kind === 'sheep' || kind === 'goat' ? { solid: [[0, 0, 0.32]] } : null;
}

// ---------- the props, by name ----------

const PROPS = { barrel, tub, bucket, basket, pot, sack, trough, bench, stool, trestle, woodpile, chopBlock, faggots, haycock, rick, midden, ladder, tool, barrow, hurdle, slipPoles, washing, coop, skep, tree, bush, pond, stump, rock, beast };

// what a garden bed can grow, each plant a few flat-shaded faces
const CROPS = {
  // leeks and onions: the peasant's own vegetables, grown in rows
  leeks: (put, rng, x, z) => put(cone(0.045, 0.34 + rng() * 0.1, 4), tone(0x6f9a66, 0.9 + rng() * 0.2), { x, y: 0.3, z }),
  onions: (put, rng, x, z) => put(cone(0.04, 0.2 + rng() * 0.08, 4), tone(0x7fa85a, 0.9 + rng() * 0.2), { x, y: 0.22, z }),
  garlic: (put, rng, x, z) => put(cone(0.03, 0.18 + rng() * 0.06, 3), tone(0x8aa870, 0.9 + rng() * 0.2), { x, y: 0.2, z }),
  // worts: colewort and kale, the pottage pot's greens — loose leaves on a
  // stalk (the round-headed cabbage has not been bred yet)
  worts: (put, rng, x, z) => {
    const green = tone(0x5f7a52, 0.9 + rng() * 0.2);
    put(box(0.03, 0.2, 0.03), 0x7a8a5a, { x, y: 0.22, z, shadow: false });
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * TAU + rng();
      put(cone(0.07, 0.2, 3), green, { x: x + Math.cos(a) * 0.06, y: 0.34, z: z + Math.sin(a) * 0.06, rz: Math.cos(a) * 0.7, rx: -Math.sin(a) * 0.7 });
    }
  },
  // beans and peas, trained up brushwood sticks
  beans: (put, rng, x, z) => {
    put(box(0.02, 1.0, 0.02), WOOD_PALE, { x, y: 0.6, z, rz: (rng() - 0.5) * 0.16, rx: (rng() - 0.5) * 0.16 });
    put(cone(0.1, 0.62, 4), tone(LEAF, 0.9 + rng() * 0.25), { x, y: 0.5, z });
  },
  peas: (put, rng, x, z) => {
    put(box(0.02, 0.55, 0.02), WITHY_DARK, { x, y: 0.38, z, rz: (rng() - 0.5) * 0.5 });
    put(cone(0.09, 0.32, 4), tone(LEAF_PALE, 0.9 + rng() * 0.2), { x, y: 0.32, z });
  },
  // the herb patch: low mounds, a flower here and there
  herbs: (put, rng, x, z) => {
    const m = put(lump(0.09 + rng() * 0.05), tone([0x6f7a3e, 0x7f9a6a, 0x5f8a5a, 0x8a9a6a][Math.floor(rng() * 4)], 0.9 + rng() * 0.2), { x, y: 0.19, z, ry: rng() * TAU });
    m.scale.y = 0.7;
    if (rng() < 0.4) put(box(0.04, 0.04, 0.04), [0xa184cc, 0xe9c93a, 0xf2ecdc][Math.floor(rng() * 3)], { x: x + (rng() - 0.5) * 0.1, y: 0.3, z: z + (rng() - 0.5) * 0.1, shadow: false });
  },
  // hemp, for rope and sacking: a dense dark stand taller than a man
  hemp: (put, rng, x, z) => put(cone(0.09, 1.5 + rng() * 0.5, 4), tone(0x3f5a2e, 0.88 + rng() * 0.26), { x, y: 0.95, z }),
  // flax, for linen: thin and tall, blue in flower
  flax: (put, rng, x, z) => {
    put(cone(0.035, 0.5 + rng() * 0.12, 3), tone(0x7fa060, 0.9 + rng() * 0.2), { x, y: 0.38, z });
    put(box(0.04, 0.04, 0.04), 0x6f8fd0, { x, y: 0.64 + rng() * 0.08, z, shadow: false });
  },
};

export function toftKit(c) {
  const kit = {};

  // one prop standing on the ground at (u, v): c.barrel(u, v, { r: 0.3, ry: 1 })
  for (const [name, build] of Object.entries(PROPS)) {
    kit[name] = (u, v, opts = {}) => {
      const sub = c.at(u, v, opts.ry ?? 0, opts.lift ?? 0);
      const made = build(sub, c.rng, opts);
      if (made?.solid && opts.solid !== false) {
        // its collider, carried out of the prop's own turned frame into the house's
        const cos = Math.cos(sub.rotation.y);
        const sin = Math.sin(sub.rotation.y);
        for (const [x, z, r] of made.solid) c.solid(u + x * cos + z * sin, v - x * sin + z * cos, r);
      }
      return sub;
    };
  }

  // A toft's bound along a line of points [[u, v], …], following the ground.
  //   kind   'wattle' (hazel rods wound on stakes — the common fence)
  //          'pale'   (cleft-oak pales set close: the best holdings only)
  //          'dead'   (a dead hedge of cut thorn staked upright, grey-brown)
  //          'quick'  (a live hedge: hawthorn and hazel, green)
  //   h      its height · solid: false lets him walk through it (don't)
  // Leave a gap between two calls for a way in (close it with c.slipPoles or
  // a c.hurdle — nobody has a carpentered gate). Fences were forever being
  // mended: a stretch left out, or one of another kind, is the truer picture.
  kit.fence = (points, { kind = 'wattle', h = 0.95, solid = true } = {}) => {
    const { rng, g } = c;
    const at = (u, v, up = 0) => [u, c.ground(u, v) + up, v];
    const hedge = kind === 'dead' || kind === 'quick';
    for (let i = 0; i < points.length - 1; i++) {
      const [u0, v0] = points[i];
      const [u1, v1] = points[i + 1];
      const len = Math.hypot(u1 - u0, v1 - v0);
      const pace = hedge ? 0.55 : kind === 'pale' ? 0.2 : 0.72;
      const bays = Math.max(1, Math.round(len / pace));
      const p = (k) => [u0 + ((u1 - u0) * k) / bays, v0 + ((v1 - v0) * k) / bays];
      for (let k = 0; k <= bays; k++) {
        const [u, v] = p(k);
        if (hedge) {
          const r = 0.3 + rng() * 0.14;
          const colour = kind === 'dead' ? tone(rng() < 0.5 ? 0x6a5f4a : 0x5a5040, 0.85 + rng() * 0.3) : tone(rng() < 0.3 ? 0x56603a : 0x4c6a34, 0.85 + rng() * 0.3);
          const m = mesh(lump(r), colour, { x: u + (rng() - 0.5) * 0.12, y: c.ground(u, v) + h * 0.42, z: v + (rng() - 0.5) * 0.12, ry: rng() * TAU });
          m.scale.y = (h / r) * 0.62;
          g.add(m);
          continue;
        }
        if (kind === 'pale') {
          // each pale its own height and lean, split not sawn
          const tall = h + (rng() - 0.5) * 0.16;
          g.add(mesh(box(0.035, tall + 0.3, 0.15), tone(rng() < 0.5 ? 0x7c7466 : 0x8a8072, 0.88 + rng() * 0.24), {
            x: u, y: c.ground(u, v) + (tall - 0.3) / 2, z: v, ry: Math.atan2(u1 - u0, v1 - v0), rz: (rng() - 0.5) * 0.06,
          }));
          continue;
        }
        if (k < bays || i === points.length - 2) {
          const tall = h + 0.12 + rng() * 0.12;
          g.add(mesh(box(0.04, tall + 0.3, 0.04), tone(WOOD_DARK, 0.9 + rng() * 0.3), { x: u, y: c.ground(u, v) + (tall - 0.3) / 2, z: v, rx: (rng() - 0.5) * 0.08, rz: (rng() - 0.5) * 0.08 }));
        }
        if (k === bays) break;
        const [un, vn] = p(k + 1);
        // withies wound in and out of the stakes: three bands a bay
        const bands = 3;
        for (let b = 0; b < bands; b++) {
          const y = 0.1 + ((b + 0.5) * (h - 0.1)) / bands;
          span(g, at(u, v, y), at(un, vn, y), (h - 0.1) / bands - 0.015, 0.045, tone((b + k) % 2 ? WITHY : WITHY_DARK, 0.9 + rng() * 0.2));
        }
      }
      if (kind === 'pale') {
        // the rail the pales are pegged to
        span(g, at(u0, v0, h * 0.7), at(u1, v1, h * 0.7), 0.06, 0.05, 0x655b4c);
      }
      // a string of circles too close to pass between, each fat enough that a roll cannot carry him through one
      if (solid) for (let d = 0; d <= len; d += 0.4) c.solid(u0 + ((u1 - u0) * d) / len, v0 + ((v1 - v0) * d) / len, hedge ? 0.32 : 0.27);
    }
  };

  // A dug bed between two corners, on the ground, with rows of one crop:
  // 'leeks' | 'onions' | 'garlic' | 'worts' | 'beans' | 'peas' | 'herbs' | 'hemp' | 'flax' | 'bare'.
  kit.bed = (u0, v0, u1, v1, { crop = 'worts', rows } = {}) => {
    const { rng } = c;
    const w = Math.abs(u1 - u0);
    const d = Math.abs(v1 - v0);
    const cu = (u0 + u1) / 2;
    const cv = (v0 + v1) / 2;
    const sub = c.at(cu, cv);
    const put = (geo, col, o) => {
      const m = mesh(geo, col, o);
      sub.add(m);
      return m;
    };
    put(box(w, 0.3, d), EARTH, { y: -0.03 });
    const alongU = w >= d;
    const n = rows ?? Math.max(1, Math.round((alongU ? d : w) / 0.34));
    const pace = crop === 'beans' ? 0.36 : crop === 'worts' ? 0.32 : crop === 'herbs' ? 0.28 : 0.22;
    for (let r = 0; r < n; r++) {
      const across = ((r + 0.5) / n - 0.5) * (alongU ? d : w);
      put(alongU ? box(w - 0.08, 0.06, 0.14) : box(0.14, 0.06, d - 0.08), EARTH_DARK, { x: alongU ? 0 : across, y: 0.13, z: alongU ? across : 0, shadow: false });
      if (crop === 'bare') continue;
      const reach = (alongU ? w : d) - 0.24;
      const count = Math.max(1, Math.floor(reach / pace));
      for (let i = 0; i < count; i++) {
        const along = ((i + 0.5) / count - 0.5) * reach + (rng() - 0.5) * 0.05;
        if (rng() < 0.08) continue; // a gap where one failed
        CROPS[crop](put, rng, alongU ? along : across, alongU ? across : along);
      }
    }
    return sub;
  };

  return kit;
}
