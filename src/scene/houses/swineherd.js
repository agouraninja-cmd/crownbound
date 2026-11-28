import * as THREE from 'three';
import { WASH, TIMBER, THATCHES, hull } from '../cottage.js';
import { span, cone } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, WOOD_DARK, WOOD_PALE, LEATHER } from '../kit.js';

// The swineherd's house: the pigs and the patchwork. He keeps the village's
// swine and has no time for his own walls, so they are mended a bay at a time
// with whatever clay was nearest — ochre off the bank, grey from the river,
// red earth, pale marl — and one panel has dropped out altogether, down to the
// wattle. The pigs lie penned in stout stakes under the oak at the yard's
// corner, where the acorns fall; his horn hangs by the door and the pole he
// beats the mast down with stands in the tree.

const CLAYS = [WASH.ochre, WASH.clay, 0x8f7150, WASH.limeOld]; // ochre, river clay, red earth, marl
const WITHY = 0x8a6d43;
const WITHY_DARK = 0x76592f;
const STAVE = 0x9a8563; // cleft oak, pale with the clay that clung to it
const STAKE = 0x6e6253; // …and gone grey in the weather
const MUD = 0x46382a;
const ACORN = 0x8f6f3d;
const HORN = 0xd9cfb0;
const NETTLE = 0x4a6a34;

// The mends, wall by wall: [wall, where along it, how high its middle is, wide, tall, which clay].
// On an end wall, anything above the eave is up in the gable.
const MENDS = [
  ['front', 0.62, 0.52, 0.95, 0.6, 0],
  ['front', 1.93, 1.1, 1.0, 0.6, 3],
  ['front', 2.05, 0.48, 0.8, 0.55, 2],
  ['front', 1.6, 0.62, 0.4, 0.5, 1],
  ['right', 1.1, 0.92, 0.9, 0.85, 0],
  ['right', 0.28, 0.55, 0.48, 0.6, 3],
  ['right', -0.28, 1.1, 0.5, 0.6, 1],
  ['right', -1.1, 0.62, 0.95, 0.85, 2],
  ['right', -1.15, 1.28, 0.6, 0.3, 3],
  ['right', 0.6, 2.08, 0.85, 0.62, 1],
  ['right', -0.55, 1.92, 0.75, 0.5, 0],
  ['left', -1.0, 0.85, 1.0, 0.9, 3],
  ['left', 0.3, 0.6, 0.5, 0.7, 2],
  ['left', 1.12, 1.05, 0.85, 0.6, 1],
  ['left', 1.0, 0.4, 0.6, 0.4, 0],
  ['left', -0.45, 2.05, 0.9, 0.62, 0],
  ['left', 0.6, 1.9, 0.6, 0.45, 3],
  ['back', 1.9, 0.8, 1.05, 0.95, 1],
  ['back', 0.64, 1.1, 0.95, 0.55, 0],
  ['back', 0.5, 0.42, 0.7, 0.5, 2],
  ['back', -0.64, 0.7, 1.0, 0.95, 3],
  ['back', -1.9, 1.0, 1.0, 0.7, 2],
  ['back', -2.05, 0.4, 0.7, 0.42, 0],
];

// The pen's bound, corner to corner: from the gate's post before the house,
// along the front, cut across under the oak, down the gable end and in to the wall.
const PEN = [[1.3, 2.84], [3.3, 2.84], [3.8, 2.32], [3.8, -0.9], [2.7, -0.9]];

// a round pole from a to b ([x, y, z] each) in group g: r0 thick at a, r1 at b
function pole(g, a, b, r0, r1, colour) {
  const [dx, dy, dz] = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const len = Math.hypot(dx, dy, dz);
  g.add(mesh(cyl(r1, r0, len, 5), colour, {
    x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2, z: (a[2] + b[2]) / 2, rx: Math.atan2(dz, dy), rz: -Math.asin(dx / len),
  }));
}

// A cleft stake: split from the round, so three-sided, and narrower at the
// head the maul has battered. It stands up from y = 0, h tall.
function stakeGeo(r, h, turn) {
  const pts = [];
  for (let k = 0; k < 3; k++) {
    const a = turn + (k * Math.PI * 2) / 3;
    pts.push([Math.cos(a) * r, 0, Math.sin(a) * r], [Math.cos(a) * r * 0.68, h, Math.sin(a) * r * 0.68]);
  }
  return hull(pts);
}

// A wad of straw as it lies on a roof: a low ragged mound, its foot sunk in the thatch.
function wadGeo(rng) {
  const pts = [];
  for (let k = 0; k < 7; k++) {
    const a = (k / 7) * Math.PI * 2;
    const r = 0.85 + rng() * 0.3;
    pts.push([Math.cos(a) * 0.36 * r, -0.03, Math.sin(a) * 0.4 * r], [Math.cos(a) * 0.2 * r, 0.12, Math.sin(a) * 0.24 * r]);
  }
  return hull(pts);
}

// A mend's shape: a rough square of daub smeared flat on the wall, w by h,
// no corner of it true — its four corners and the middles of its top and
// bottom, each pushed about a little, fanned from the centre.
function mendGeo(rng, w, h) {
  const ring = [[-1, -1], [0, -1], [1, -1], [1, 1], [0, 1], [-1, 1]].map(([x, y]) => [
    (x * w) / 2 + (rng() - 0.5) * w * 0.16, (y * h) / 2 + (rng() - 0.5) * h * 0.2,
  ]);
  const pts = [];
  ring.forEach((p, i) => pts.push(0, 0, 0, ...p, 0, ...ring[(i + 1) % ring.length], 0));
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  geo.computeVertexNormals();
  return geo;
}

// The patchwork: every mend its own clay, and none of them matching the wall.
// `proud` lifts a mend off what it lies on (the wall, or an older mend).
function mend(c, [wall, at, y, w, h, clay], proud) {
  c.onWall(wall, at).add(mesh(mendGeo(c.rng, w, h), tone(CLAYS[clay], 0.94 + c.rng() * 0.12), { y, z: proud, shadow: false }));
}

// The bay left of the door, where a panel has fallen out: the daub that is
// left stands ragged round the hole, the wattle shows in it — withies woven
// before and behind the upright staves by turns — and the lumps lie where
// they dropped.
function fallenPanel(c) {
  const { rng } = c;
  const mid = -1.92; // the bay's middle, between its two posts
  const bay = c.onWall('front', mid);
  const put = (x0, x1, y0, y1, proud, colour) => bay.add(mesh(box(x1 - x0, y1 - y0, proud * 2), colour, { x: (x0 + x1) / 2, y: (y0 + y1) / 2 }));
  // what is left of the daub: the bay's edges, and the broken teeth still hanging into the hole
  const daub = tone(WASH.daub, 0.97);
  const proud = 0.06;
  put(-0.6, -0.44, 0.1, 1.46, proud, daub);
  put(0.42, 0.6, 0.1, 1.46, proud, daub);
  put(-0.44, 0.42, 1.1, 1.46, proud, daub);
  put(-0.44, 0.42, 0.1, 0.2, proud, daub);
  put(-0.44, -0.14, 0.94, 1.1, proud, daub);
  put(0.22, 0.42, 0.2, 0.42, proud, daub);
  put(-0.44, -0.3, 0.2, 0.3, proud, daub);
  mend(c, ['front', mid - 0.1, 1.29, 0.72, 0.28, 1], proud + 0.008); // he mended above it, and the foot fell out
  // the wattle behind: a dozen withies woven before and behind three staves by turns, and the dark of the house between them
  put(-0.46, 0.44, 0.18, 1.12, 0.008, 0x2f2418);
  const flat = (w, h, colour, x, y, z, rz = 0) => bay.add(mesh(new THREE.PlaneGeometry(w, h), colour, { x, y, z, rz, shadow: false }));
  const rods = 12;
  const pitch = 0.94 / rods;
  for (let r = 0; r < rods; r++) {
    const y = 0.18 + (r + 0.5) * pitch;
    // two of the withies have snapped off short, and the staves stand bare in the gap
    const x1 = r === 8 ? -0.2 : r === 9 ? -0.08 : 0.44;
    flat(x1 + 0.46, pitch - 0.014, tone(r % 2 ? WITHY : WITHY_DARK, 0.88 + rng() * 0.24), (x1 - 0.46) / 2, y, 0.024, (rng() - 0.5) * 0.02);
    // elsewhere a stave shows only where the withy passes behind it
    [-0.29, -0.01, 0.27].forEach((x, k) => {
      if (x > x1 || (r + k) % 2) flat(0.05, pitch + 0.004, tone(STAVE, 0.92 + rng() * 0.16), x, y, 0.03);
    });
  }
  flat(0.46, 0.05, tone(WITHY, 1.08), 0.2, 0.87, 0.034, -0.28); // one of them hangs by an end across it
  // and the daub round the hole is cracked, ready to follow
  for (const [x, y, len, rz] of [[-0.5, 0.78, 0.5, 0.2], [0.5, 1.22, 0.42, -0.5], [0.52, 0.62, 0.34, 0.35]]) flat(0.016, len, tone(WASH.daub, 0.55), x, y, proud + 0.003, rz);
  // the lumps, lying where they fell
  const heap = c.at(mid, c.hz + 0.34);
  const fallen = () => tone(WASH.daub, 0.8 + rng() * 0.2);
  heap.add(mesh(box(0.4, 0.07, 0.3), fallen(), { x: -0.1, y: 0.11, z: -0.18, rx: -0.75, ry: 0.15 })); // one slab stood on edge against the wall's foot
  for (const [x, z, w, h, d] of [[0.22, 0.02, 0.32, 0.07, 0.24], [-0.32, 0.2, 0.22, 0.06, 0.18], [0.0, 0.14, 0.2, 0.16, 0.18], [0.38, -0.2, 0.16, 0.13, 0.14], [-0.42, -0.08, 0.14, 0.12, 0.13]]) {
    heap.add(mesh(box(w, h, d), fallen(), { x, y: h * 0.4, z, rx: (rng() - 0.5) * 0.5, ry: rng() * 3, rz: (rng() - 0.5) * 0.5 }));
  }
}

// The swineherd's horn, hung by its thong from a peg in the post beside the door.
function horn(c) {
  const g = c.onWall('front', -1.28);
  const z = 0.19; // clear of the post's face
  g.add(mesh(box(0.035, 0.035, 0.16), WOOD_DARK, { y: 1.3, z: 0.14 }));
  // a cow's horn: wide at the bell, dark at the tip he blows through
  const curve = [[-0.24, 0.97], [-0.09, 0.87], [0.09, 0.88], [0.25, 1.0]];
  const thick = [0.06, 0.047, 0.032, 0.012];
  for (let i = 0; i < 3; i++) {
    pole(g, [...curve[i], z], [...curve[i + 1], z], thick[i], thick[i + 1], i === 2 ? 0x4a4038 : tone(HORN, 1 - i * 0.06));
  }
  span(g, [0, 1.3, z], [-0.2, 0.97, z], 0.018, 0.012, LEATHER, false);
  span(g, [0, 1.3, z], [0.2, 0.97, z], 0.018, 0.012, LEATHER, false);
}

// The pen: stout cleft stakes driven close, no two alike, a round post at
// each corner, bound with a split pole lashed along the outside high and low;
// the gate is a hurdle tied across the near end. Low enough to see the pigs over.
function pen(c) {
  const { rng } = c;
  for (let i = 0; i < PEN.length - 1; i++) {
    const [u0, v0] = PEN[i];
    const [u1, v1] = PEN[i + 1];
    const len = Math.hypot(u1 - u0, v1 - v0);
    const [du, dv] = [(u1 - u0) / len, (v1 - v0) / len];
    const n = Math.round(len / 0.28);
    for (let k = i ? 1 : 0; k <= n; k++) {
      const [u, v] = [u0 + (du * len * k) / n, v0 + (dv * len * k) / n];
      const lean = { rx: (rng() - 0.5) * 0.14, rz: (rng() - 0.5) * 0.14 };
      if (k === 0 || k === n) {
        c.g.add(mesh(cyl(0.065, 0.085, 1.4, 5), tone(TIMBER.old, 0.9 + rng() * 0.2), { x: u, y: c.ground(u, v) + 0.35, z: v, ...lean }));
        continue;
      }
      // here and there a new one, still pale, where an old one rotted off at the ground
      const colour = rng() < 0.14 ? tone(TIMBER.new, 0.95 + rng() * 0.1) : tone(rng() < 0.3 ? TIMBER.old : STAKE, 0.85 + rng() * 0.3);
      c.g.add(mesh(stakeGeo(0.08 + rng() * 0.03, 0.98 + rng() * 0.26, rng() * 2), colour, { x: u, y: c.ground(u, v) - 0.3, z: v, ...lean }));
    }
    // the binders, on the outside
    const end = (u, v, y, along) => [u - dv * 0.09 + du * along, c.ground(u, v) + y, v + du * 0.09 + dv * along];
    for (const y of [0.24, 0.58]) span(c.g, end(u0, v0, y, -0.09), end(u1, v1, y + (rng() - 0.5) * 0.06, 0.09), 0.06, 0.045, tone(0x8a7a62, 0.9 + rng() * 0.2));
    for (let d = 0; d <= len; d += 0.4) c.solid(u0 + du * d, v0 + dv * d, 0.27);
  }
  c.hurdle(1.3, 2.33, { len: 0.94, h: 0.72, ry: Math.PI / 2 });

  // where they wallow, under the oak
  c.at(3.15, 2.2).add(mesh(cyl(0.55, 0.6, 0.1, 7), MUD, { ry: 0.4, shadow: false }));

  // the trough: half a log, flat side up and hollowed, inside the front stakes where it can be filled from the lane
  const trough = c.at(2.06, 2.52);
  const ring = [];
  for (const x of [-0.58, 0.58]) {
    for (let k = 0; k <= 6; k++) {
      const a = Math.PI - 0.45 + (k * (Math.PI + 0.9)) / 6;
      ring.push([x, 0.16 + Math.sin(a) * 0.2, Math.cos(a) * 0.2]);
    }
  }
  trough.add(mesh(hull(ring), tone(WOOD_PALE, 0.95)));
  trough.add(mesh(box(1.0, 0.02, 0.24), 0x2e2419, { y: 0.24, shadow: false }));

  // the pigs: lean, dark and bristled; one at the trough, the rest taking their ease
  c.beast(2.0, 2.14, { kind: 'pig', colour: 0x5e4a3c, ry: -0.45, solid: false });
  c.beast(3.3, 2.26, { kind: 'pig', colour: 0x4a3d35, ry: Math.PI + 0.1, lying: true, solid: false });
  c.beast(3.22, 1.4, { kind: 'pig', colour: 0x6b5242, ry: Math.PI / 2, solid: false });
  c.beast(3.25, -0.05, { kind: 'pig', colour: 0x3d332d, ry: -Math.PI / 2, lying: true, solid: false });
}

// a clump of nettles in a corner nobody weeds
function nettles(c, u, v) {
  const g = c.at(u, v);
  for (let k = 0; k < 3; k++) {
    const a = k * 2.1 + c.rng();
    const h = 0.4 + c.rng() * 0.3;
    g.add(mesh(cone(0.07, h, 3), tone(NETTLE, 0.85 + c.rng() * 0.3), { x: Math.cos(a) * 0.08, y: h / 2 - 0.03, z: Math.sin(a) * 0.08, rz: -Math.cos(a) * 0.25, rx: Math.sin(a) * 0.25 }));
  }
}

export default {
  id: 'swineherd',
  name: 'The swineherd’s house',
  note: 'The swineherd’s house — daub mended in four clays, one panel fallen to the wattle, and lean dark pigs penned under the oak.',
  build(c) {
    const { hz, rng } = c;
    c.shell({ eave: 1.55, pitch: 49, walls: 'daub', wash: WASH.daub, frame: 'post', timber: TIMBER.old, roof: 'halfhip', thatch: 'old', moss: 4 });
    c.door(...c.plot.door, { open: 0.3, colour: 0x6f6252 });
    c.window('front', 0.78, { shutter: 'side', hinge: -1 });
    c.smoke('hole', 0.5, { lit: true });
    // a wad of straw stuffed in at the head of each hip, where the ridge post comes up under the thatch and the
    // rain gets in (this year's is still yellow)
    for (const end of [-1, 1]) {
      c.add(wadGeo(rng), tone(end > 0 ? THATCHES.straw[0] : THATCHES.old[2], 0.95), { x: end * 2.637, y: 3.398, rz: -end * c.pitch });
    }

    MENDS.forEach((m, i) => mend(c, m, 0.012 + (i % 3) * 0.005));
    fallenPanel(c);
    horn(c);
    pen(c);
    // one sow is out, and has her snout in the daub that fell
    c.beast(-3.05, 2.42, { kind: 'pig', colour: 0x57453a, ry: 0.2 });

    // the pole he knocks the acorns down with, stood in the oak, and what he gathered this morning
    pole(c.g, [3.6, c.ground(3.6, 2.93) - 0.05, 2.93], [3.96, 3.2, 2.97], 0.045, 0.03, tone(WOOD_PALE, 1.1));
    c.basket(0.62, hz + 0.34, { r: 0.24, h: 0.24, fill: ACORN });

    // behind: the muck forked out of the pen, new stakes waiting their turn, and a bed of leeks
    c.midden(3.1, -1.9, { r: 0.6 });
    c.tool(2.62, -1.75, { kind: 'fork', lean: 0.2, ry: -1.2 });
    for (let i = 0; i < 3; i++) {
      c.at(1.85 + i * 0.17, -2.02 - (i % 2) * 0.04).add(mesh(stakeGeo(0.06, 1.25 + i * 0.05, i), tone(TIMBER.new, 0.92 + rng() * 0.16), { y: -0.03, rx: 0.22 + i * 0.012, rz: (i - 1) * 0.06 }));
    }
    c.bed(-3.3, -3.9, -1.7, -3.1, { crop: 'leeks', rows: 2 });
    c.bush(3.25, -3.5, { r: 0.5, colour: 0x5a7a3a }).scale.y = 1.7; // elder
    nettles(c, 2.55, -3.75);
    nettles(c, -3.3, 1.4);
  },
};
