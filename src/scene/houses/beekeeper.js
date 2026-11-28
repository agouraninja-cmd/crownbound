import * as THREE from 'three';
import { WASH, TIMBER, THATCHES } from '../cottage.js';
import { cone, lump } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, WOOD_DARK, WOOD_PALE, STRAW, THATCH_PALE } from '../kit.js';

// The beekeeper's house: an ochre-washed house under a half-hipped roof, much
// as others are — what sets it apart stands behind it, where the sun is. Five
// straw skeps sit in a row on a plank under a low thatch of their own, a
// hurdle at their backs against the north and their mouths to the morning sun.
// The toft is too shallow for a hedge behind them, so the hedge is at their
// end: a corner of quickthorn with an elder grown up through it, in flower,
// and the herbs the bees work in bloom beyond. By the door: the spare skeps,
// the honey crocks, and long straw for the next skep with its crown begun.

const HOLLOW = 0x1f1812; // the dark inside a skep
const NEW_STRAW = 0xf0d98a; // a skep coiled this year, not yet weathered
const MOSS = 0x66773f;
const LINEN = 0xddd5bf;
const CROCK = 0x8f7f6c; // grey-brown ware
const ELDER = 0x4f7038;
const BLOSSOM = 0xf1ead2;

// a window set under the wall plate and clear of it, so the plate runs whole over it
const WINDOW = { h: 0.34, y: 1.255 };

// A skep: a dome of coiled straw, each coil its own shade, the flight hole cut
// at its foot (toward +z). It stands on y = 0 of the group it is returned as.
// from: the coil it starts at — a skep is coiled from the crown down, so one
// only begun is its top coils and nothing under them.
const COILS = [[0.215, 0], [0.23, 0.12], [0.205, 0.24], [0.15, 0.34], [0.07, 0.41]]; // [radius, height] up the dome
function skep(g, rng, { x = 0, y = 0, z = 0, ry = 0, colour = STRAW, hole = true, from = 0 } = {}) {
  const s = new THREE.Group();
  s.position.set(x, y - COILS[from][1], z);
  s.rotation.y = ry;
  const straw = tone(colour, 0.94 + rng() * 0.12);
  for (let i = from; i < COILS.length - 1; i++) {
    const [r0, y0] = COILS[i];
    const [r1, y1] = COILS[i + 1];
    // open rings, one on the next, turned so that a flat faces the front
    s.add(mesh(new THREE.CylinderGeometry(r1, r0, y1 - y0, 7, 1, true, Math.PI / 7), tone(straw, i % 2 ? 1.07 : 0.95), { y: (y0 + y1) / 2 }));
  }
  s.add(mesh(new THREE.ConeGeometry(0.07, 0.035, 7, 1, true, Math.PI / 7), tone(straw, 1.1), { y: 0.4275 }));
  if (hole) s.add(mesh(box(0.085, 0.05, 0.04), HOLLOW, { y: 0.035, z: 0.185, shadow: false }));
  g.add(s);
  return s;
}

// a honey crock: grey ware, a linen cloth tied over its mouth
function crock(g, x, y, z, r) {
  g.add(mesh(cyl(r * 0.92, r, r * 2, 6), CROCK, { x, y: y + r, z }));
  g.add(mesh(cyl(r * 1.02, r * 0.98, 0.035, 6), LINEN, { x, y: y + r * 2 + 0.012, z }));
}

// The bee shelter: a thatch on four posts in the lee of the house, turned
// about so that its own front (+v) looks out of the yard to the south-east.
function beeShelter(c) {
  c.outbuilding(1.56, -2.68, Math.PI, { length: 2.6, width: 0.9 }, (b) => {
    const { rng } = b;
    b.shell({ eave: 1.1, pitch: 47, walls: 'open', timber: TIMBER.old, roof: 'gable', thatch: 'old', over: 0.12, thick: 0.13 });
    b.hurdle(0, -0.35, { len: 2.3, h: 0.7 }); // across the back, to keep the north wind out
    // the plank the skeps stand on: weathered oak on two pairs of stakes, between the posts
    const bench = b.at(0, 0.03);
    bench.add(mesh(box(2.46, 0.055, 0.46), tone(TIMBER.grey, 1.08), { y: 0.28 }));
    for (const x of [-0.9, 0.9]) for (const z of [-0.17, 0.17]) bench.add(mesh(box(0.08, 0.56, 0.08), WOOD_DARK, { x, y: -0.02, z }));
    for (let i = 0; i < 5; i++) {
      // one is this summer's swarm, hived in a skep still gold
      skep(bench, rng, { x: (i - 2) * 0.49, y: 0.3075, ry: (rng() - 0.5) * 0.3, colour: i === 3 ? NEW_STRAW : tone(THATCH_PALE, 1.04 + rng() * 0.1) });
    }
    b.block(-1.25, -0.2, 1.25, 0.28); // the bench stops a man; the posts and the hurdle stop him of themselves
  });
}

// The hedge the skeps stand against: a corner of it, from the wall out to the
// bound and along it, with an elder grown up through it and in flower.
function hedgeCorner(c) {
  const { rng } = c;
  c.fence([[-0.22, -2.15], [-0.22, -2.65]], { kind: 'quick' });
  c.fence([[-0.28, -2.95], [-1.44, -2.95]], { kind: 'quick' });
  const elder = c.at(-0.82, -2.42);
  // [x, y, z, radius, heads of blossom] for each bough
  for (const [x, y, z, r, heads] of [[0, 0.52, 0, 0.42, 4], [0.13, 1.0, 0.07, 0.35, 3], [-0.12, 1.12, -0.08, 0.29, 3]]) {
    const bough = mesh(lump(r), tone(ELDER, 0.9 + rng() * 0.22), { x, y, z, ry: rng() * 6 });
    bough.scale.y = 1.15;
    elder.add(bough);
    // the flat heads laid on its leaves, on the sides that are seen (not the wall's)
    for (let k = 0; k < heads; k++) {
      const a = (0.6 + rng() * 1.5) * Math.PI;
      const up = 0.35 + rng() * 0.6; // how high on the bough: 0 its middle … 1 its top
      const out = Math.sqrt(1 - up * up) * r * 0.88; // a little inside the bough's roundness: its faces are flat
      elder.add(mesh(box(0.18, 0.045, 0.18), tone(BLOSSOM, 0.94 + rng() * 0.08), { x: x + Math.cos(a) * out, y: y + up * r, z: z + Math.sin(a) * out, ry: rng() * 3, shadow: false }));
    }
  }
  // the elder stops a man as the hedge does, and so does the hedge's last bush (the fence's own circles end short of it)
  c.solid(-0.82, -2.42, 0.38);
  c.solid(-1.44, -2.95, 0.3);
}

// The bee plot beyond the hedge: marigolds, borage and hyssop, a row of each, all in flower.
function herbPlot(c) {
  const { rng } = c;
  const bed = c.bed(-2.97, -3.3, -1.95, -2.4, { crop: 'bare' }); // dug in three ridges, which the rows below stand on
  // [the row's place across the bed, leaf, height, flower, the flower's size]
  const rows = [
    [-0.3, 0x6f9a5a, 0.2, 0xe2a22c, 0.07], // marigold, nearest the bound
    [0, 0x5f8a5a, 0.3, 0x5f86d6, 0.06], // borage
    [0.3, 0x6b8f4e, 0.42, 0x8a74c8, 0.055], // hyssop, tallest, under the wall
  ];
  for (const [z, leaf, tall, flower, size] of rows) {
    for (let i = 0; i < 4; i++) {
      const x = -0.375 + i * 0.25 + (rng() - 0.5) * 0.06;
      const h = tall * (0.85 + rng() * 0.3);
      bed.add(mesh(cone(0.085, h, 4), tone(leaf, 0.9 + rng() * 0.2), { x, y: 0.14 + h / 2, z, ry: rng() * 3 }));
      const head = mesh(new THREE.OctahedronGeometry(size), tone(flower, 0.94 + rng() * 0.1), { x: x + (rng() - 0.5) * 0.03, y: 0.14 + h * 0.97, z, ry: rng() * 3, shadow: false });
      if (tall > 0.4) head.scale.y = 1.9; // a spike of flower, not a daisy
      bed.add(head);
    }
  }
}

// By the door: what the bees give, and what they are housed in.
function byTheDoor(c) {
  const { rng } = c;
  // the bench, and the honey crocks set out on its board (0.45 up)
  const seat = c.bench(0.62, 2.0, { len: 1.0 });
  crock(seat, -0.24, 0.45, 0, 0.1);
  crock(seat, 0.06, 0.45, 0.02, 0.085);
  // spare skeps: two stacked one in the other, the upper askew, and a third on its side showing its hollow
  const spare = c.at(1.78, 2.0);
  skep(spare, rng, { hole: false });
  skep(spare, rng, { x: 0.03, y: 0.25, ry: 1, hole: false, colour: THATCH_PALE }).rotation.z = 0.17;
  const lying = skep(spare, rng, { x: 0.37, y: 0.215, z: 0.06, hole: false, colour: NEW_STRAW });
  lying.rotation.set(0, 0.55, -Math.PI / 2);
  lying.add(mesh(new THREE.CircleGeometry(0.2, 7), HOLLOW, { y: 0.012, rx: Math.PI / 2, shadow: false }));
  c.solid(1.78, 2.0, 0.24);
  // long straw for the next skep, bound in a sheaf and stood against the wall — and its crown, begun
  const sheaf = c.at(-1.8, 2.0);
  sheaf.rotation.x = -0.2;
  sheaf.add(mesh(cyl(0.085, 0.13, 0.5, 6), THATCHES.new[1], { y: 0.25 }));
  sheaf.add(mesh(cyl(0.15, 0.085, 0.5, 6), tone(THATCHES.new[1], 1.05), { y: 0.75 }));
  sheaf.add(mesh(cyl(0.095, 0.095, 0.05, 6), WOOD_PALE, { y: 0.5, shadow: false }));
  skep(c.at(-2.24, 2.02), rng, { from: 2, hole: false, colour: THATCHES.new[1] });
}

export default {
  id: 'beekeeper',
  name: 'The beekeeper’s house',
  note: 'The beekeeper’s house — behind it, straw skeps in a row under a thatch of their own, mouths to the sun: honey for the village, wax for the church.',
  build(c) {
    const { rng } = c;
    c.shell({ eave: 1.65, pitch: 50, walls: 'daub', wash: WASH.ochre, frame: 'box', timber: TIMBER.grey, roof: 'halfhip', thatch: 'straw' });
    c.door(...c.plot.door, { open: 0.45 });
    // the hall and its hearth are at the far end from the door: both windows are there, and the smoke leaves by that end's gablet
    c.window('front', 1.5, { ...WINDOW, shutter: 'side' });
    c.window('right', 0.55, { ...WINDOW, shutter: 'propped', bars: 0 });
    c.smoke('gablet', 1);
    // the front slope looks north: moss has taken it, and this year's straw is let in where the rain came through
    for (const [along, down, w] of [[-1.6, 2.4, 0.8], [1.55, 2.6, 0.6]]) {
      c.add(box(w, 0.03, 0.36), tone(MOSS, 0.88 + rng() * 0.24), { ...c.onRoof(1, along, down, 0.012), shadow: false });
    }
    c.add(box(0.75, 0.03, 0.5), tone(THATCHES.new[0], 0.98), { ...c.onRoof(1, 0.3, 2.3, 0.014), shadow: false });
    // and the end wall by the lane was mended with raw daub, not yet washed
    const mend = c.onWall('left', 0.5);
    mend.add(mesh(box(0.62, 0.34, 0.02), tone(WASH.daub, 1.02), { y: 0.68, z: 0.011, shadow: false }));
    mend.add(mesh(box(0.34, 0.11, 0.02), tone(WASH.daub, 1.02), { x: -0.1, y: 0.905, z: 0.011, shadow: false }));

    beeShelter(c);
    hedgeCorner(c);
    herbPlot(c);
    byTheDoor(c);
  },
};
