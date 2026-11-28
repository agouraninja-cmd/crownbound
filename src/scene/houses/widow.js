import { WASH, TIMBER, THATCHES } from '../cottage.js';
import { cone, lump } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, STONE, WOOD_DARK } from '../kit.js';

// The widow's cot: the oldest roof in the village and the poorest. Its posts
// stand in the ground, the old way, and they have rotted there: the whole cot
// has gone over downhill and is held by three poles raked against its low
// gable. Nothing else is kept up but the herb plot by the door.

const LEAN = 0.07; // how far out of plumb, in radians, toward the downhill (+u) end
const SIN = Math.sin(LEAN);
const COS = Math.cos(LEAN);
// where a point of the leaning house stands in the yard, which does not lean
const leaned = (x, y, z) => [x * COS + y * SIN, y * COS - x * SIN, z];

const MOSS = 0x6d8040;
const EARTH = 0x4a3624;
const BARK = 0x5e4a33;
const NETTLE = 0x4a6a34;

// The herb plot's two beds, each with its rows from the lane back to the
// wall: [colour, height, flower, form]. A 'mound' is a low cushion, a 'spike'
// a tuft of stems with a head of flower, an 'umbel' taller stems under a
// flat one.
const BEDS = [
  {
    u: -2.52,
    rows: [
      [0x6f7a4e, 0.2, 0xc9a2c8, 'mound'], // thyme
      [0x6b8f4e, 0.42, 0x6f7fc8, 'spike'], // hyssop
      [0x5f8a5a, 0.24, null, 'mound'], // parsley
      [0x86a45c, 0.78, 0xd9cf6a, 'umbel'], // fennel
    ],
  },
  {
    u: -1.27,
    rows: [
      [0x8d9b78, 0.26, 0xa184cc, 'mound'], // sage
      [0x7a9a4a, 0.36, 0xb48fb0, 'spike'], // betony
      [0x6f9a5a, 0.28, null, 'mound'], // mint
      [0x5d7f3c, 0.6, 0xe9c93a, 'umbel'], // tansy
    ],
  },
];
// bunches hung to dry, gone dull: sage, tansy, hyssop, mint, wormwood
const DRIED = [0x8f9a6a, 0xa89c5c, 0x857f96, 0x7d8a5c, 0x9a9278];

// a round pole from its foot a to its head b ([u, y, v] each), thinner at the head
function pole(g, a, b, r, colour) {
  const [dx, dy, dz] = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const len = Math.hypot(dx, dy, dz);
  g.add(mesh(cyl(r * 0.72, r, len, 6), colour, {
    x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2, z: (a[2] + b[2]) / 2, rx: Math.atan2(dz, dy), rz: -Math.asin(dx / len),
  }));
}

// Three stems splayed from one root at (x, y, z) in group g: a herb, or a
// weed. Returns the tip of the tallest, for a flower to sit on.
function tuft(g, rng, x, y, z, tall, colour) {
  let top = [x, y, z];
  for (let k = 0; k < 3; k++) {
    const a = k * 2.1 + rng();
    const h = tall * (0.75 + rng() * 0.3);
    const [ax, az] = [Math.cos(a), Math.sin(a)]; // the way this one tips
    g.add(mesh(cone(0.065, h, 3), colour, { x: x + ax * 0.07, y: y + h / 2, z: z + az * 0.07, rz: -ax * 0.28, rx: az * 0.28 }));
    const reach = 0.07 + 0.138 * h; // how far out its tip ends up
    if (y + 0.98 * h > top[1]) top = [x + ax * reach, y + 0.98 * h, z + az * reach];
  }
  return top;
}

// Shored up: three poles raked against the gable the cot leans toward, each
// bearing on a pad of board and footed on a flat stone with a chock behind it.
function shores(c) {
  const { hx, rng } = c;
  // v: where its foot stands · high: where its head bears · proud: how far that spot stands off the wall
  const shore = (v, high, proud) => {
    const u = 3.05;
    const bears = v * 0.82; // the heads bear a little closer together than the feet stand
    const foot = c.at(u, v);
    const slab = mesh(lump(0.25), tone(STONE, 0.9 + rng() * 0.2), { y: 0.03, ry: rng() * 6 });
    slab.scale.y = 0.5;
    foot.add(slab);
    foot.add(mesh(lump(0.11), tone(STONE, 0.8 + rng() * 0.2), { x: 0.15, y: 0.1, z: (rng() - 0.5) * 0.2 }));
    c.add(box(0.06, 0.18, 0.34), tone(TIMBER.grey, 0.9 + rng() * 0.2), { x: hx + proud + 0.025, y: high, z: bears });
    // the pole stands in the yard, which is plumb, and meets a wall that is not
    pole(c.g, [u, c.ground(u, v) + 0.1, v], leaned(hx + proud + 0.07, high, bears), 0.08, tone(BARK, 0.9 + rng() * 0.25));
    c.solid(2.72, bears, 0.55); // nobody walks in among them
  };
  shore(1.2, 1.2, 0);
  shore(0.08, 2.0, 0.12); // the long one, on the face of the ridge post
  shore(-1.22, 1.18, 0);
  // nettles have the ground under them to themselves
  for (const v of [-0.7, 0.5, 0.85]) {
    tuft(c.at(2.4 + rng() * 0.3, v), rng, 0, -0.03, 0, 0.45 + rng() * 0.3, tone(NETTLE, 0.85 + rng() * 0.3));
  }
  // the gable they hold has been made good twice over, with whatever clay was to hand
  c.add(box(0.02, 0.5, 0.56), tone(WASH.daub, 0.96), { x: hx + 0.002, y: 0.62, z: 0.58 });
  c.add(box(0.024, 0.3, 0.34), tone(WASH.daub, 0.9), { x: hx + 0.002, y: 0.98, z: 0.44 });
  c.add(box(0.02, 0.42, 0.5), tone(WASH.clay, 0.94), { x: hx + 0.002, y: 0.5, z: -0.52 });
}

// One new post, let in plumb beside the old one that rotted: the old wall
// leans onto it.
function newPost(c) {
  const old = -0.69; // the front wall's own post, left of the door, where the frame sets it
  const z = c.hz + 0.03; // …and how far it stands out of the wall
  const post = c.at(old + 0.27, z + 0.04);
  const head = leaned(old + 0.19, 1.29, 0)[1] - post.position.y; // up to the underside of the plate, which leans with the rest
  post.add(mesh(cyl(0.08, 0.09, head + 0.35, 6), tone(TIMBER.new, 1.2), { y: (head - 0.35) / 2 }));
  c.add(cyl(0.098, 0.125, 0.5, 6), 0x3a3329, { x: old, y: 0.1, z }); // the rot at the old one's foot…
  for (const [y, w] of [[0.5, 0.15], [0.72, 0.1]]) c.add(box(w, 0.035, 0.1), 0xd9c79a, { x: old, y, z: z + 0.12 }); // …and what grows on it
}

// Herbs hung head-down to dry on a rod under the eave. They hang plumb,
// though the wall behind them does not.
function dryingHerbs(c) {
  const { hz, rng } = c;
  const rodY = 1.24;
  const out = hz + 0.15;
  c.add(cyl(0.018, 0.018, 1.06, 5), WOOD_DARK, { x: 1.43, y: rodY, z: out, rz: Math.PI / 2 });
  for (const x of [0.94, 1.92]) c.add(box(0.03, 0.03, 0.2), WOOD_DARK, { x, y: rodY - 0.03, z: hz + 0.08 }); // the pegs it rests on
  DRIED.forEach((herb, i) => {
    const [u, y, v] = leaned(1.02 + i * 0.205, rodY, out);
    const long = 0.2 + rng() * 0.1;
    const colour = tone(herb, 0.92 + rng() * 0.16);
    c.g.add(mesh(cone(0.075, long, 5), colour, { x: u, y: y - 0.02 - long / 2, z: v, ry: rng() * 3 })); // stalks tied at the top…
    const leaves = mesh(lump(0.085), colour, { x: u, y: y - 0.02 - long, z: v, ry: rng() * 6 }); // …the leaf hanging below
    leaves.scale.y = 0.75;
    c.g.add(leaves);
  });
}

// The herb plot: two small beds stepped down the slope and set close, low
// wattle on the lane's side to keep the hens off, the tools left where she
// stopped.
function herbPlot(c) {
  const { hz, rng } = c;
  for (const { u, rows } of BEDS) {
    const bed = c.at(u, 2.6);
    const put = (geo, colour, opts) => bed.add(mesh(geo, colour, opts));
    put(box(1.14, 0.3, 1.06), EARTH, { y: -0.03 });
    rows.forEach(([colour, tall, flower, form], j) => {
      for (let i = 0; i < 4; i++) {
        const x = (i - 1.5) * 0.27 + (rng() - 0.5) * 0.06;
        const z = (1.5 - j) * 0.25 + (rng() - 0.5) * 0.05;
        const green = tone(colour, 0.9 + rng() * 0.22);
        if (form === 'mound') {
          const mound = mesh(lump(0.13 + rng() * 0.03), green, { x, y: 0.1 + tall / 2, z, ry: rng() * 6 });
          mound.scale.y = tall / 0.28;
          bed.add(mound);
          if (flower !== null && rng() < 0.6) put(cone(0.045, 0.06, 3), flower, { x: x + (rng() - 0.5) * 0.1, y: 0.12 + tall, z: z + (rng() - 0.5) * 0.1, shadow: false });
          continue;
        }
        const [tx, ty, tz] = tuft(bed, rng, x, 0.1, z, tall, green);
        if (rng() < 0.65) {
          const head = form === 'umbel' ? box(0.09 + rng() * 0.04, 0.03, 0.09 + rng() * 0.04) : box(0.06, 0.07, 0.06);
          put(head, flower, { x: tx, y: ty, z: tz, ry: rng() * 3, rz: (rng() - 0.5) * 0.4, shadow: false });
        }
      }
    });
  }
  c.tool(-1.9, 2.5, { kind: 'spade', lean: 0.1, lift: -0.2, ry: 0.4 }); // stuck in where the beds meet
  c.tool(-0.86, hz + 0.3, { kind: 'hoe', lean: 0.22 });
  c.fence([[-3.28, 3.28], [-0.68, 3.28], [-0.68, 2.5]], { kind: 'wattle', h: 0.48 }); // short of the way to the door
}

// The thatch: moss in pads, thickest low on the north slope where the sun
// never dries it, and grass seeded along the turf of the ridge.
function mossyRoof(c) {
  const { hx, rng } = c;
  const run = (c.peak - c.eave) / Math.sin(c.pitch);
  // along: -1…1 from verge to verge · low: 0 at the ridge … 1 at the eave
  const pad = (side, along, low) => {
    const r = 0.22 + rng() * 0.28;
    const m = c.add(lump(r), tone(MOSS, 0.8 + rng() * 0.32), { ...c.onRoof(side, along * (hx + 0.3 - r), Math.min(low * run, run - r * 0.7), 0.01), ry: rng() * 6 });
    m.scale.y = 0.1;
  };
  for (let i = 0; i < 11; i++) pad(1, ((i + rng()) / 11) * 2 - 1, 0.45 + 0.55 * Math.sqrt(rng()));
  for (let i = 0; i < 2; i++) pad(-1, rng() * 1.6 - 0.8, 0.7 + rng() * 0.3);
  for (let i = 0; i < 5; i++) c.add(cone(0.05, 0.22, 4), tone(0x86a34c, 0.9 + rng() * 0.2), { x: -2 + i * 0.95 + rng() * 0.3, y: c.peak + 0.5, z: (rng() - 0.5) * 0.3 });
  // one patch of newer straw on the south slope, where the rain got in
  c.add(box(1.05, 0.05, 0.62), THATCHES.straw[0], { ...c.onRoof(-1, -1.25, run * 0.49, 0.03), ry: 0.05 });
}

export default {
  id: 'widow',
  name: 'The widow’s cot',
  note: 'The widow’s cot — three poles hold it up and the moss holds it together; herbs dry under the eaves and the cat keeps the bench.',
  build(c) {
    const { hx, hz } = c;
    // low smoke-brown walls under thatch laid coat upon coat, thicker than any roof in the village
    c.shell({ eave: 1.4, pitch: 47, walls: 'daub', wash: WASH.soot, frame: 'post', timber: TIMBER.old, roof: 'gable', thatch: 'old', moss: 8, ridge: 'turf', thick: 0.27 });
    c.lean(0, LEAN);
    c.door(...c.plot.door, { w: 0.8, open: 0.35, colour: 0x7a6b58 }); // ajar: it no longer shuts true in its frame
    c.window('front', -1.3, { w: 0.36, h: 0.3, shutter: 'side', hinge: -1 });
    c.smoke('seep', -0.6, { lit: true });

    shores(c);
    newPost(c);
    dryingHerbs(c);
    herbPlot(c);
    mossyRoof(c);

    // by the door: a bench, the cat asleep on it beside the morning's cutting
    const seat = 0.41; // the bench's top: it is sunk a little, so both legs stand on the slope
    c.bench(1.5, hz + 0.34, { len: 1.0, lift: seat - 0.45 });
    c.beast(1.27, hz + 0.34, { kind: 'cat', colour: 0xb07a44, ry: 0.4, lift: seat }).scale.setScalar(1.3); // a big ginger tom
    const basket = c.basket(1.79, hz + 0.34, { r: 0.14, h: 0.14, lift: seat });
    basket.add(mesh(lump(0.12), 0x6f9a5a, { y: 0.15, ry: 1 }));

    // round the sides and behind: firing, a patch on the back wall, the midden, linen on the hedge
    c.faggots(-hx - 0.58, 0.3, { n: 3, lift: -0.03 });
    c.add(box(0.7, 0.46, 0.02), tone(WASH.daub, 0.93), { x: 1.4, y: 0.72, z: -hz - 0.002 });
    c.add(box(0.4, 0.3, 0.024), tone(WASH.daub, 0.88), { x: 1.14, y: 1.0, z: -hz - 0.002 });
    c.midden(2.45, -2.5, { r: 0.55, lift: -0.04 });
    c.beast(1.7, -2.3, { kind: 'hen', colour: 0x8a5a34, ry: 0.5 });
    c.beast(-0.1, -2.5, { kind: 'hen', colour: 0xb08a5a, ry: 2.6 });
    c.washing(-1.9, -2.72, { len: 2.0, h: 0.95, cloths: [0xddd5bf, 0x9a6a4a] });
    c.bush(-2.2, -1.9, { r: 0.5, colour: 0x5a7a3a }).scale.y = 1.9; // elder, come up in the corner and over the hedge
  },
};
