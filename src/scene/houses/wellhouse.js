import { WASH, hull } from '../cottage.js';
import { span, cone } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, WOOD_PALE, STONE, STONE_DARK, IRON, ROPE } from '../kit.js';
import * as THREE from 'three';

// The stone house by the well: the one house in the village walled in rubble
// stone, gables and all, under old thatch gone grey and mossy. What sets it
// apart stands before it, toward the lane: the well. A low round kerb of rough
// stones about a dark shaft, and nothing more — no roof, no windlass, no
// posts: the bucket is let down on its rope by hand and stood on the kerb, the
// rope coiled beside it. Half the village comes here, so the ground about it
// is trodden to mud, with stepping stones laid across the wet; a neighbour's
// pail and carrying yoke are left by it now.

const TAU = Math.PI * 2;
const MUD = 0x46392b; // earth trodden wet
const PUDDLE = 0x343a3b; // where the slopped water stands
const LINING = [0x3d3b37, 0x33312e]; // the shaft's own stones, wet and out of the light
const DEPTH = 0x0e0d0c; // down the well
const NETTLE = 0x4c6a34;

// A course of rough stones laid in a ring about g's middle: n of them, each a
// wedge from r0 out to about r1 and from y0 up to about y1, no two cut alike
// (`rough` is how far they differ), with `joint` of dark left between them.
// Returns where each was laid — { a, top } — for whatever is stood on them.
function ringCourse(g, rng, { n, r0, r1, y0, y1, colours, turn = 0, rough = 0, joint = 0 }) {
  // where one stone ends and the next begins: each a little off its even share, till the ring comes round to the first again
  const joints = Array.from({ length: n }, (_, i) => turn + ((i + (i ? (rng() - 0.5) * 0.3 : 0)) / n) * TAU);
  joints.push(joints[0] + TAU);
  const stones = [];
  for (let i = 0; i < n; i++) {
    const a0 = joints[i] + joint;
    const a1 = joints[i + 1] - joint;
    const a = (a0 + a1) / 2;
    const out = r1 + (rng() - 0.5) * 2 * rough;
    const top = y1 + (rng() - 0.5) * 2 * rough;
    // its outer face bulges at the middle, so eight stones make a round kerb and not an eight-sided one
    const pts = [];
    for (const y of [y0, top]) {
      for (const at of [a0, a1]) pts.push([Math.cos(at) * r0, y, Math.sin(at) * r0], [Math.cos(at) * out, y, Math.sin(at) * out]);
      pts.push([Math.cos(a) * (out + 0.035), y, Math.sin(a) * (out + 0.035)]);
    }
    g.add(mesh(hull(pts), tone(colours[i % colours.length], 0.92 + rng() * 0.2)));
    stones.push({ a, top });
  }
  return stones;
}

// A skin laid over the ground about (u, v) and following its every rise and
// fall: mud, standing water. The ground is never flat, and a flat thing this
// wide would float off it on one side and sink into it on the other.
// `reaches` is how far out it runs along each spoke in turn; it lies `lift`
// above the earth and is tucked into it at the edge.
function drape(c, u, v, reaches, lift, colour) {
  const n = reaches.length;
  const floor = c.ground(u, v);
  const ring = (k, up) => reaches.map((reach, i) => {
    const du = Math.cos((i / n) * TAU) * reach * k;
    const dv = Math.sin((i / n) * TAU) * reach * k;
    return [du, c.ground(u + du, v + dv) - floor + up, dv];
  });
  const rings = [ring(0.5, lift), ring(0.88, lift), ring(1, -0.06)];
  const pos = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    pos.push(0, lift, 0, ...rings[0][j], ...rings[0][i]);
    for (let r = 0; r < rings.length - 1; r++) {
      const inner = rings[r];
      const outer = rings[r + 1];
      pos.push(...inner[i], ...inner[j], ...outer[i], ...outer[i], ...inner[j], ...outer[j]);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  c.at(u, v).add(mesh(geo, colour, { shadow: false }));
}

// a flat-topped stone to step on, `long` by `wide`, bedded in the ground
function steppingStone(rng, long, wide) {
  const pts = [];
  const turn = rng() * TAU;
  for (let k = 0; k < 7; k++) {
    const a = turn + (k / 7) * TAU;
    const r = 0.8 + rng() * 0.2;
    pts.push([(Math.cos(a) * r * long) / 2, -0.1, (Math.sin(a) * r * wide) / 2], [Math.cos(a) * r * long * 0.44, 0.09, Math.sin(a) * r * wide * 0.44]);
  }
  return hull(pts);
}

// The kit lays its rubble as high as the eaves. The gables above are stone
// too: the same courses carried on up each end, shorter and shorter, to the ridge.
function gableStones(c) {
  const { rng } = c;
  const tall = 0.4; // the kit's own course
  for (const wall of ['left', 'right']) {
    const g = c.onWall(wall);
    for (let y = c.eave; ; y += tall) {
      const half = (c.peak - 0.08 - (y + tall)) / Math.tan(c.pitch); // what fits under the rafters at the course's top
      if (half < 0.15) break;
      let x = -half;
      while (x < half - 0.05) {
        let len = 0.55 + rng() * 0.5;
        if (half - x - len < 0.3) len = half - x;
        g.add(mesh(box(len - 0.025, tall - 0.025, 0.04 + rng() * 0.03), tone(rng() < 0.6 ? STONE : STONE_DARK, 0.94 + rng() * 0.22), { x: x + len / 2, y: y + tall / 2, z: -0.02 }));
        x += len;
      }
    }
  }
}

// The ground about the well at (u, v), trodden to mud by everyone who comes
// for water: all the strip between the house and the lane, from the door's
// path to the toft's end. The slopped water stands in it, and stepping
// stones are laid across it from the door's path.
function troddenGround(c, u, v) {
  const { rng } = c;
  // a blunt-ended oblong, ragged all round (a plain oval would leave the corners of the strip green)
  const mud = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * TAU;
    return (0.88 + rng() * 0.12) / Math.cbrt(Math.abs(Math.cos(a) / 1.58) ** 3 + Math.abs(Math.sin(a) / 0.9) ** 3);
  });
  drape(c, u - 0.15, v + 0.02, mud, 0.05, MUD);
  // the water lies a finger above the mud, so the two never fight for one depth: where
  // the bucket is emptied into the pails, and where the neighbour's was set down
  drape(c, u - 0.8, v + 0.3, [0.34, 0.24, 0.2, 0.3, 0.22, 0.26], 0.068, PUDDLE);
  drape(c, u + 0.95, v - 0.2, [0.24, 0.3, 0.2, 0.26, 0.18, 0.22], 0.068, PUDDLE);
  for (const [du, dv, long, wide] of [[-1.68, 0.38, 0.56, 0.44], [-1.17, 0.16, 0.5, 0.42], [-0.88, 0.6, 0.42, 0.36]]) {
    c.at(u + du, v + dv, rng() * TAU).add(mesh(steppingStone(rng, long, wide), tone(STONE, 1.02 + rng() * 0.14)));
  }
}

// The well itself, at (u, v): a kerb of field stones about the shaft's
// mouth. Returns what is needed to set things on it and by it — every spot
// an [x, y, z] in the well's own frame, measured from its middle at the ground.
function well(c, u, v) {
  const { rng } = c;
  const g = c.at(u, v);
  const floor = c.ground(u, v);
  const R = 0.6; // the kerb, out to its face
  const bore = 0.36; // and in to the shaft

  // two courses, the lower run well into the ground
  ringCourse(g, rng, { n: 6, r0: bore, r1: R + 0.02, y0: -0.3, y1: 0.27, colours: [STONE, STONE_DARK], turn: 0.4, rough: 0.025, joint: 0.012 });
  const kerb = ringCourse(g, rng, { n: 8, r0: bore, r1: R, y0: 0.22, y1: 0.5, colours: [STONE, tone(STONE, 1.12), STONE_DARK], rough: 0.03, joint: 0.014 });
  // the shaft: its lining going down wet and dark, and then nothing to see at all
  ringCourse(g, rng, { n: 5, r0: 0.28, r1: bore + 0.05, y0: 0, y1: 0.43, colours: LINING });
  g.add(mesh(cyl(0.32, 0.32, 0.02, 8), DEPTH, { y: 0.2, shadow: false }));
  c.solid(u, v, R + 0.04);

  return {
    g,
    R,
    kerb, // its upper stones: which way each lies from the middle (a), and how high it stands (top)
    // a spot on top of kerb stone k, `r` out from the middle
    on: (k, r = (bore + R) / 2, up = 0) => [Math.cos(kerb[k].a) * r, kerb[k].top + up, Math.sin(kerb[k].a) * r],
    // a spot on the ground, `r` out from the middle toward `a`
    out: (a, r, up = 0) => [Math.cos(a) * r, c.ground(u + Math.cos(a) * r, v + Math.sin(a) * r) - floor + up, Math.sin(a) * r],
    // one of the kit's props stood at such a spot (the kit stands a prop on the ground: `lift` carries it up onto the kerb)
    stand: (prop, [x, y, z], opts) => c[prop](u + x, v + z, { ...opts, lift: floor + y - c.ground(u + x, v + z) }),
    solid: ([x, , z], r) => c.solid(u + x, v + z, r),
  };
}

// the bucket the water is drawn in, stood full on the kerb, and the rope it is let down by, coiled beside it
function bucketAndRope(w) {
  const tall = 0.23;
  const bucket = w.on(3);
  w.stand('bucket', bucket, { r: 0.115, h: tall, water: true, ry: 0.6 });
  const [x, y, z] = w.on(2);
  w.g.add(mesh(new THREE.TorusGeometry(0.1, 0.028, 3, 8), ROPE, { x, y: y + 0.028, z, rx: Math.PI / 2 }));
  w.g.add(mesh(new THREE.TorusGeometry(0.09, 0.028, 3, 8), tone(ROPE, 0.9), { x: x + 0.01, y: y + 0.075, z: z - 0.01, rx: Math.PI / 2, rz: 0.4 }));
  span(w.g, [x - 0.08, y + 0.1, z], [bucket[0], bucket[1] + tall + 0.1, bucket[2]], 0.02, 0.02, ROPE, false);
}

// A neighbour's carrying yoke, leaned on the kerb: a board hollowed for the
// neck between its two shoulders, an arm each way, and a rope and a hook at
// each arm's end. One hook still holds the pail it carried, set down full;
// the other hangs down the kerb's face.
function yoke(w) {
  const { g, R } = w;
  const a = w.kerb[0].a; // the stone it leans on lies this way from the well's middle, and so does the yoke
  const foot = w.out(a, 1.45, 0.045);
  const head = w.on(0, R - 0.04, 0.035);
  const long = Math.hypot(head[0] - foot[0], head[1] - foot[1], head[2] - foot[2]);
  // a spot on it: `d` along from its middle toward the kerb, `across` it toward the lane, `up` off it
  const at = (d, across = 0, up = 0) => {
    const t = 0.5 + d / long;
    return [foot[0] + (head[0] - foot[0]) * t - Math.sin(a) * across, foot[1] + (head[1] - foot[1]) * t + up, foot[2] + (head[2] - foot[2]) * t + Math.cos(a) * across];
  };
  const shoulder = [[0, 0.03], [0.11, 0.1], [0.25, 0.028], [0.25, -0.028], [0.11, -0.1], [0, -0.1]]; // half the board's outline, from the hollow out
  for (const s of [-1, 1]) {
    g.add(mesh(hull(shoulder.flatMap(([d, across]) => [at(s * d, across, -0.02), at(s * d, across, 0.02)])), tone(WOOD_PALE, 1.1)));
    span(g, at(s * 0.23), at((s * long) / 2), 0.045, 0.05, WOOD_PALE);
  }
  w.solid(at(0), 0.28);

  // the upper rope, over the kerb's edge and down its face
  const brim = [Math.cos(a) * (R + 0.085), head[1] - 0.055, Math.sin(a) * (R + 0.085)];
  span(g, at(long / 2 - 0.03, 0, 0.03), brim, 0.018, 0.018, ROPE, false);
  span(g, brim, [brim[0], 0.2, brim[2]], 0.018, 0.018, ROPE, false);
  g.add(mesh(box(0.03, 0.09, 0.05), IRON, { x: brim[0], y: 0.16, z: brim[2] }));
  // the lower, slack along the ground to the pail's handle
  const pail = { a: a - 0.3, r: 1.25, h: 0.26 }; // where it stands, and how tall
  w.stand('bucket', w.out(pail.a, pail.r), { r: 0.14, h: pail.h, water: true, ry: a });
  const handle = w.out(pail.a, pail.r, pail.h + 0.1);
  const slack = w.out(a - 0.16, 1.36, 0.07);
  span(g, at(0.03 - long / 2, 0, 0.03), slack, 0.018, 0.018, ROPE, false);
  span(g, slack, handle, 0.018, 0.018, ROPE, false);
  g.add(mesh(box(0.03, 0.07, 0.05), IRON, { x: handle[0], y: handle[1] + 0.02, z: handle[2] }));
}

export default {
  id: 'wellhouse',
  name: 'The stone house by the well',
  note: 'The stone house by the well — rubble walls under mossy thatch; before it a bare kerb, a rope and a bucket, and the mud of every pail ever filled.',
  build(c) {
    const { rng } = c;
    const front = c.hz;
    const back = -c.hz;

    c.shell({ eave: 1.6, pitch: 50, walls: 'stone', roof: 'gable', thatch: 'old', moss: 6 });
    gableStones(c);
    // The footing the walls stand on. The kit's courses stop at the floor line, and the ground lies a hand or
    // two below that behind the house and at its far gable: without this the wall would hang over the grass.
    c.add(box(c.L + 0.14, 0.92, c.W + 0.14), tone(STONE_DARK, 0.9), { y: -0.45 });
    c.door(...c.plot.door, { open: 0.35 }); // left ajar: somebody is always coming in with water
    c.window('front', -1.85, { w: 0.3, h: 0.28, bars: 1 }); // the one window: a hand's breadth of light
    c.smoke('hole', 0.8);
    // kept up, if not kept new: where the back wall began to shed its stones, the gap was packed with clay and smeared over
    const daubed = [[-0.5, 0.5], [0.42, 0.44], [0.55, 0.86], [0.2, 1.14], [-0.38, 1.06]];
    c.onWall('back', -1.3).add(mesh(hull(daubed.flatMap(([x, y]) => [[x, y, -0.02], [x, y, 0.02]])), tone(WASH.clay, 0.9)));

    // ---------- the well, toward the lane ----------
    const at = [2.3, 2.62];
    troddenGround(c, ...at);
    const w = well(c, ...at);
    bucketAndRope(w);
    yoke(w);

    // ---------- about the house ----------
    // a stone seat under the window: a slab on two blocks
    const seat = c.at(-1.85, front + 0.25);
    for (const s of [-1, 1]) seat.add(mesh(box(0.3, 0.6, 0.3), tone(STONE_DARK, 0.95 + rng() * 0.1), { x: s * 0.42, y: 0.08 }));
    seat.add(mesh(box(1.25, 0.09, 0.38), tone(STONE, 1.08), { y: 0.42, ry: 0.02 }));
    c.block(-2.5, front, -1.2, front + 0.46);
    // a log trough at the gable toward the other lane, filled from the well for whatever beast is led by
    c.trough(3.2, 0.5, { ry: Math.PI / 2 });
    // behind, a bed of leeks; and in the corner farthest from the well and downhill of it, the
    // midden, with the nettles and the elder that grow fat on it
    c.bed(0.3, back - 1.2, 2.4, back - 0.45, { crop: 'leeks' });
    c.midden(-2.75, back - 0.7, { r: 0.45 });
    c.bush(-3.1, -0.4, { r: 0.36 });
    const nettles = c.at(-3.3, back + 0.15);
    for (let i = 0; i < 6; i++) {
      const tall = 0.28 + rng() * 0.28;
      nettles.add(mesh(cone(0.06, tall, 3), tone(NETTLE, 0.85 + rng() * 0.35), { x: (rng() - 0.5) * 0.36, y: tall / 2 - 0.03, z: (rng() - 0.5) * 0.4, ry: rng() * TAU }));
    }
  },
};
