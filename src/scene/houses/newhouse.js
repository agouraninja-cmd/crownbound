import { TIMBER, THATCHES, hull } from '../cottage.js';
import { mesh, tone } from '../meshUtils.js';
import { box, STONE, STONE_DARK } from '../kit.js';
import * as THREE from 'three';

// The new house: raised this year, on a plot that was grass last spring. It is
// the one house in the village with nothing yet wrong with it — square, plumb,
// its oak still pale and its thatch still gold — and the builders' leavings lie
// about it: the pit the daub was trodden in, the chips where the frame was
// hewn, a hurdle and a bundle of rods that were not wanted, stones over from
// the footing, the ladder still at the eave. Nobody lives in it: the hearth is
// not laid, and it stands dark after nightfall.

const DAUB_NEW = 0xcdb78a; // daub put up this summer, still clean
const DAUB_WET = 0x7e623a; // the same stuff, wet in the pit
const SPOIL = 0xb89c68; // clay thrown out of the pit, drying on the grass
const CHIP = 0xdcc79a; // oak fresh off the axe
const HAZEL = 0x7d6a4c; // rods cut last winter, grey-brown in the bark
const WITHY = 0x5e4a33; // what binds them
const DOOR = 0xbea571; // boards as new as the frame they hang in
const [, STRAW_NEW, STRAW_PALE] = THATCHES.new; // what the thatcher had over went to the daubers
const TAU = Math.PI * 2;

// A skin stretched over rings of points [x, y, z], each ring lying inside the
// one before it as seen from above — the only way to draw a hollow, which no
// box, ball or hull can be.
function skin(rings) {
  const at = [];
  for (let r = 0; r < rings.length - 1; r++) {
    const a = rings[r];
    const b = rings[r + 1];
    for (let i = 0; i < a.length; i++) {
      const j = (i + 1) % a.length;
      at.push(...a[i], ...b[i], ...a[j], ...a[j], ...b[i], ...b[j]);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(at, 3));
  return geo;
}

// Loose bits lying where they fell — chips, wisps of straw: n of them on the
// ground about (u, v), from `near` to `far` out, each [long, thick, wide] or
// so. `squeeze` narrows the scatter along u, where the toft is only a strip.
function strew(c, u, v, n, colour, { near, far, bit: [long, thick, wide], squeeze = 1 }) {
  const { rng } = c;
  for (let i = 0; i < n; i++) {
    const a = rng() * TAU;
    const d = near + rng() * (far - near);
    const piece = mesh(box(long * (0.7 + rng() * 0.6), thick, wide * (0.7 + rng() * 0.6)), tone(colour, 0.9 + rng() * 0.16), { y: thick * 0.3 + 0.012 });
    c.at(u + Math.cos(a) * d * squeeze, v + Math.sin(a) * d, rng() * TAU).add(piece); // each on its own patch of ground
  }
}

// A slumped heap of something loose, r out to its foot and h high, `long`
// times longer along its own x than across, with n loose bits [long, thick,
// wide] of it lying anyhow on top.
function heap(c, u, v, { r, h, colour, long = 1, ry = 0, n = 0, bit }) {
  const { rng } = c;
  const ring = (count, k, y) => {
    const turn = rng() * TAU; // each ring turned from the last, so the facets do not line up
    return Array.from({ length: count }, (_, i) => {
      const d = r * k * (0.88 + rng() * 0.24);
      return [Math.cos(turn + (i / count) * TAU) * d * long, y, Math.sin(turn + (i / count) * TAU) * d];
    });
  };
  const g = c.at(u, v, ry);
  g.add(mesh(hull([...ring(9, 1, -0.06), ...ring(7, 0.72, h * 0.55), ...ring(4, 0.3, h)]), colour));
  for (let i = 0; i < n; i++) {
    const a = rng() * TAU;
    const d = Math.sqrt(rng()) * 0.8; // how far out from the middle: 0 the top … 1 the foot
    g.add(mesh(box(bit[0] * (0.7 + rng() * 0.6), bit[1], bit[2] * (0.7 + rng() * 0.6)), tone(colour, 0.94 + rng() * 0.2), {
      x: Math.cos(a) * d * r * long, y: h * (1 - d * d) + 0.035, z: Math.sin(a) * d * r, rx: (rng() - 0.5) * 0.8, ry: rng() * TAU, rz: (rng() - 0.5) * 0.8,
    }));
  }
}

// The daub pit: where clay, dung and chopped straw were trodden together with
// water, a long shallow hollow hard by the wall it went onto. The ground
// itself cannot be dug, so the hollow is a ring of thrown-out spoil with the
// wet daub lying low inside it.
function daubPit(c, u, v) {
  const { rng } = c;
  const g = c.at(u, v);
  const long = 0.9; // half its length, along the wall
  const wide = 0.46; // half its width: all the room there is between the eaves' drip and the toft's edge
  // eleven spokes, each its own reach and height: the spoil was thrown toward
  // the wall (-z), out from under the treaders' feet, and is banked highest there
  const spokes = Array.from({ length: 11 }, (_, i) => {
    const a = (i / 11) * TAU;
    return { a, k: 0.9 + rng() * 0.2, h: 0.1 + rng() * 0.07 + 0.15 * Math.max(0, -Math.sin(a)) };
  });
  const ring = (r, y) => spokes.map((s) => [Math.cos(s.a) * long * r * s.k, y ?? s.h, Math.sin(s.a) * wide * r * s.k]);
  const lip = ring(0.66, 0.05);
  g.add(mesh(skin([ring(1, -0.1), ring(0.8), lip]), SPOIL)); // foot, crest, and down again to the daub
  g.add(mesh(hull([...lip, ...ring(0.66, -0.1)]), DAUB_WET));
  // chopped straw thrown on it, not yet trodden in
  for (let i = 0; i < 12; i++) {
    const a = rng() * TAU;
    const d = Math.sqrt(rng()) * 0.5;
    g.add(mesh(box(0.14 + rng() * 0.1, 0.014, 0.035), tone(STRAW_PALE, 0.9 + rng() * 0.15), { x: Math.cos(a) * long * d, y: 0.06, z: Math.sin(a) * wide * d, ry: rng() * TAU }));
  }
  for (const s of [-0.5, 0.5]) c.solid(u + s * long, v, wide);
}

// Where the frame was hewn: a swept-up heap of pale chips, more of them flown
// wide of it, and the ends cut off posts and rails thrown down on it.
function chipHeap(c, u, v) {
  const { rng } = c;
  heap(c, u, v, { r: 0.42, h: 0.24, colour: CHIP, long: 1.35, ry: Math.PI / 2, n: 9, bit: [0.15, 0.03, 0.08] });
  strew(c, u, v, 9, CHIP, { near: 0.5, far: 0.8, bit: [0.14, 0.035, 0.07], squeeze: 0.55 });
  // offcuts, of the same scantling as the house's own posts and rails: two up
  // on the heap, one rolled off it
  const offcuts = [
    // du, dv, how high it lies, thick, long, turned, tipped
    [-0.04, 0.12, 0.17, 0.17, 0.5, 0.5, 0.14],
    [0.1, -0.42, 0.1, 0.12, 0.42, -0.7, -0.2],
    [-0.12, 0.8, 0, 0.17, 0.36, 1.3, 0],
  ];
  for (const [du, dv, lift, thick, long, ry, rz] of offcuts) {
    c.at(u + du, v + dv, ry, lift).add(mesh(box(long, thick, thick), tone(TIMBER.new, 0.92 + rng() * 0.16), { y: thick / 2, rz }));
  }
  c.solid(u, v, 0.42);
}

// a bundle of hazel rods over from the wattling, bound with two withies and
// stood against a wall: the group stands at its foot and leans toward -z
function rodBundle(c, u, v, ry) {
  const { rng } = c;
  const sub = new THREE.Group();
  sub.rotation.x = -0.2;
  for (let i = 0; i < 7; i++) {
    const len = 2.0 + rng() * 0.4;
    sub.add(mesh(box(0.035, len, 0.035), tone(HAZEL, 0.82 + rng() * 0.36), { x: (i - 3) * 0.036, y: len / 2, z: (i % 2) * 0.04, rz: (rng() - 0.5) * 0.05 }));
  }
  for (const y of [0.5, 1.45]) sub.add(mesh(box(0.3, 0.05, 0.12), WITHY, { y, z: 0.02 }));
  c.at(u, v, ry).add(sub);
}

// rails cut and never wanted, stacked off the wet on two bearers (along u)
function spareRails(c, u, v) {
  const { rng } = c;
  const g = c.at(u, v);
  const oak = () => tone(TIMBER.new, 0.92 + rng() * 0.16);
  for (const s of [-1, 1]) g.add(mesh(box(0.1, 0.3, 0.36), oak(), { x: s * 0.42, y: -0.06 }));
  g.add(mesh(box(1.4, 0.13, 0.13), oak(), { x: 0.02, y: 0.155, z: -0.08 }));
  g.add(mesh(box(1.2, 0.13, 0.13), oak(), { x: -0.08, y: 0.155, z: 0.08, ry: 0.03 }));
  g.add(mesh(box(0.95, 0.11, 0.11), oak(), { x: 0.1, y: 0.275, z: -0.02, ry: -0.05 }));
  for (const s of [-0.45, 0, 0.45]) c.solid(u + s, v, 0.24);
}

export default {
  id: 'newhouse',
  name: 'The new house',
  note: 'The new house — raised since the spring: oak still pale, thatch still gold, and the daub pit and the builders’ ladder not yet cleared away.',
  build(c) {
    // the thatch is cut close and square at the eaves: it has not had a winter to grow shaggy in
    // (and the toft ends hard behind the back wall, with no room for more)
    c.shell({ eave: 1.75, pitch: 51, walls: 'daub', wash: DAUB_NEW, frame: 'box', timber: TIMBER.new, roof: 'gable', thatch: 'new', over: 0.22 });
    c.door(...c.plot.door, { colour: DOOR });
    // two small windows, each set square between the rail and the plate, and shuttered: the house is shut up till it is wanted
    c.window('front', -1.4, { h: 0.28, y: 1.38, shutter: 'shut', bars: 0 });
    c.window('back', 1.4, { h: 0.28, y: 1.38, shutter: 'shut', bars: 0 });
    c.smoke('hole', -1.3, { lit: false }); // the hole is cut; the hearth under it is not laid

    // --- the front, left of the door: the daubers' and the thatcher's end ---
    daubPit(c, -1.25, 2.45);
    c.tool(-0.95, 2.5, { kind: 'spade', lean: 0.16, ry: 2.2, lift: -0.06 }); // left standing in the daub
    c.bucket(-0.42, 2.06, { r: 0.15, h: 0.27, water: true });
    c.ladder(-2.52, 2.54, { len: 3.0, lean: 0.3 });
    c.solid(-2.52, 2.25, 0.3); // nobody walks through a ladder
    heap(c, -3.18, 2.56, { r: 0.4, h: 0.32, colour: STRAW_NEW, n: 8, bit: [0.24, 0.02, 0.04] }); // straw chopped for the mix
    strew(c, -2.9, 2.5, 9, STRAW_PALE, { near: 0.2, far: 0.6, bit: [0.2, 0.014, 0.035] });
    c.solid(-3.18, 2.56, 0.32);

    // --- right of the door, and the gable toward the lane: the carpenters' and the wattlers' ---
    spareRails(c, 1.87, 2.04);
    chipHeap(c, 3.12, 1.2);
    rodBundle(c, 3.14, 0.42, Math.PI / 2);
    c.hurdle(3.04, -0.85, { len: 1.5, lean: 0.3, ry: Math.PI / 2 });
    for (const v of [-1.35, -0.85, -0.35, 0.3]) c.solid(2.92, v, 0.3); // the hurdle and the rods stop a man too

    // --- the far gable: stones over from the footing, the last of them still on the hand-barrow ---
    c.barrow(-3.12, 0.85, { ry: 1.48, lift: -0.03, load: tone(STONE, 0.96) }); // its legs let into the slope a little
    c.rock(-3.2, -0.95, { r: 0.3, squash: 0.75, solid: false });
    c.rock(-3.0, -0.5, { r: 0.26, squash: 0.7, colour: STONE_DARK });
    c.rock(-3.3, -0.45, { r: 0.22, squash: 0.8 });
    c.rock(-3.12, -0.7, { r: 0.2, squash: 0.75, colour: STONE_DARK, lift: 0.3 });
    c.solid(-3.15, -0.7, 0.42); // the pile, as one
  },
};
