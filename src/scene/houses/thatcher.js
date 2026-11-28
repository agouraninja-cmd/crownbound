import { WASH, TIMBER, THATCHES, hull } from '../cottage.js';
import { span } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, WOOD_DARK, WOOD_PALE, IRON, ROPE } from '../kit.js';

// The thatcher’s cottage: a small plain house, and the neatest in the village
// — no moss on its thatch, the straw stacked square, the leeks in a straight
// row. What sets it apart is that he has at last got to his own roof: the
// front slope is half new-laid, gold straw from the track end as far as the
// ladder and the old grey-gold beyond it, with the yealms waiting at the wall
// foot and the hazel he pins them down with.

const NEW = THATCHES.new; // this harvest's straw: [eave, middle, ridge] course
const OLD = THATCHES.straw; // what the rest of the roof still wears
const BOND = 0x8f7236; // the twist of straw a yealm is bound with
const HAZEL = 0xd8c8a0; // hazel split this week, white inside
const HAZEL_BARK = 0x7a6040;

// He lays a strake at a time — a lane of roof an arm's reach wide, from the
// eave up — and then shifts the ladder. LAID is how many courses each strake
// has had, counted from the track-end verge: three are done to the ridge, and
// the edge of the work climbs away from the ladder like a stair.
const STRAKE = 0.65;
const LAID = [3, 3, 3, 2, 1];
const PROUD = 0.11; // how far a new course's butt stands off the old straw

// The front slope, measured off the kit's own roof: `run` from ridge to eave,
// at(u, down, up) a point `down` the rafters' line and `up` square off it, and
// thatch(down) how far up the old straw's surface lies there (each course of it
// stands a little prouder than the one below).
function frontSlope(c) {
  const sin = Math.sin(c.pitch);
  const cos = Math.cos(c.pitch);
  return {
    run: (c.peak - c.eave) / sin,
    apex: c.onRoof(1, 0, 0).y, // where the two slopes' straw meets
    verge: c.hx + 0.34, // a finger past the old verge, so the gable shows the new coat's edge
    at: (u, down, up) => [u, c.peak - sin * down + cos * up, cos * down + sin * up],
    thatch: (down) => (c.onRoof(1, 0, down).y - (c.peak - sin * down)) * cos,
  };
}

// The ridge: the straw roll and crossed spars his neighbours have from the
// kit, laid here by hand so as to stop at the verges — the kit's roll runs a
// hand past them, and this yard ends where the verge does.
function layRidge(c, { apex }) {
  const half = c.hx + 0.32;
  c.add(cyl(0.16, 0.16, half * 2, 6), tone(OLD[2], 1.03), { y: apex - 0.01, rz: Math.PI / 2 });
  for (let i = 0; i < 6; i++) {
    for (const side of [-1, 1]) c.add(box(0.035, 0.035, 0.62), WOOD_DARK, { x: -half + (i + 0.5) * (half / 3) + side * 0.03, y: apex + 0.07, rx: side * (c.pitch + 0.3) });
  }
}

// The new coat, strake by strake. Every course in it is a wedge: feathered
// out to nothing where it tucks under the course above, a hand thick at its
// butt, and the eave course cut off square below the old ragged fringe.
function layNewThatch(c, { run, verge, at, thatch }) {
  // eave course first — top: where it tucks under · butt: where it ends · on: a spot on the old course it covers · face: how deep the butt is cut
  const courses = [
    { top: run * 0.565, butt: run + 0.1, on: run * 0.8, face: 0.26 },
    { top: run * 0.25, butt: run * 0.6, on: run * 0.5, face: 0.3 },
    { top: -0.13, butt: run * 0.285, on: run * 0.2, face: 0.3 },
  ];
  LAID.forEach((n, k) => {
    const u1 = verge - k * STRAKE;
    const u0 = u1 - STRAKE;
    courses.slice(0, n).forEach(({ top, butt, on, face }, i) => {
      const skin = thatch(on);
      const end = butt + (c.rng() - 0.5) * 0.05; // no two butts are cut quite level
      const pts = [];
      for (const u of [u0, u1]) {
        const lip = at(u, end, skin + PROUD);
        pts.push(at(u, top, skin), at(u, top, skin - 0.2), lip, [u, lip[1] - face, lip[2]]);
      }
      c.add(hull(pts), tone(NEW[i], 0.99 + k * 0.02 + c.rng() * 0.03)); // the last strake laid is the brightest
    });
    if (n === courses.length) return;
    // the top course so far is held by a hazel sway until the next one covers it
    const { top, butt, on } = courses[n - 1];
    const [, y, z] = at(0, top + (butt - top) * 0.4, thatch(on) + PROUD * 0.4 + 0.02);
    c.add(box(STRAKE - 0.12, 0.03, 0.035), HAZEL_BARK, { x: (u0 + u1) / 2, y, z });
  });
}

// The ladder: a pole split down its length, rungs let into the halves,
// narrower at the head. A long ladder would stand in the yard and lie on the
// roof, but this yard is too shallow before the door for any foot to reach the
// ground at the roof's pitch: so it lies on the old straw with its foot at the
// eave, hung on a rope thrown over the ridge and pegged down behind the house.
function layLadder(c, { run, apex, verge, at, thatch }) {
  const u = verge - LAID.length * STRAKE - 0.42; // on the old straw, where the next strake goes
  const up = thatch(run * 0.2) + 0.04; // it bears on the ridge course's edge and on the eave
  const foot = run - 0.02;
  const head = 0.22;
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const rails = [-1, 1].map((side) => [at(u + side * 0.23, foot, up), at(u + side * 0.17, head, up)]);
  for (const [a, b] of rails) span(c.g, a, b, 0.05, 0.05, tone(WOOD_PALE, 1.1 + c.rng() * 0.1));
  const rung = (t) => [mix(...rails[0], t), mix(...rails[1], t)];
  for (let i = 0; i < 8; i++) span(c.g, ...rung((i + 0.5) / 8), 0.035, 0.035, WOOD_PALE);

  const tie = mix(...rung(15 / 16), 0.5); // the top rung's middle
  const over = [u, apex + 0.17, 0]; // the ridge roll's back
  const [, ey, ez] = at(u, run + 0.19, thatch(run * 0.8) - 0.015);
  const eave = [u, ey, -ez]; // the lip of the back eave
  const pegV = -2.2;
  const peg = [u, c.ground(u, pegV) + 0.28, pegV - 0.09];
  for (const [p, q] of [[tie, over], [over, eave], [eave, peg]]) span(c.g, p, q, 0.03, 0.03, ROPE);
  c.at(u, pegV).add(mesh(cyl(0.03, 0.045, 0.62, 5), WOOD_DARK, { y: 0.06, z: -0.03, rx: -0.3 })); // driven in leaning from the pull
}

// A yealm: a double armful of wetted straw drawn straight and bound with a
// twist of its own — what the thatcher lays, as a mason lays stone. At (x, y,
// z) in g: lying, that is its middle and ry turns it on the ground; with a
// `lean` it stands, that is its butt, and it leans so far toward -z.
function yealm(g, rng, { x = 0, y = 0, z = 0, ry = 0, lean = null, len = 0.95 }) {
  const lying = lean === null;
  const turn = lying ? { ry, rz: Math.PI / 2 } : { rx: -lean };
  const axis = lying ? [-Math.cos(ry), 0, Math.sin(ry)] : [0, Math.cos(lean), -Math.sin(lean)];
  const from = lying ? len / 2 : 0; // how far from its butt (x, y, z) is
  const bond = len * (lying ? 0.5 : 0.58); // a standing one is bound nearer its head
  // a piece of it, `s` along from the butt
  const put = (geo, colour, s) => g.add(mesh(geo, colour, { x: x + axis[0] * (s - from), y: y + axis[1] * (s - from), z: z + axis[2] * (s - from), ...turn }));
  const straw = tone(NEW[1], 0.9 + rng() * 0.16);
  // pinched at the bond, splayed at both ends
  put(cyl(0.085, 0.155, bond, 6), straw, bond / 2);
  put(cyl(0.14, 0.085, len - bond, 6), straw, (bond + len) / 2);
  put(cyl(0.098, 0.098, 0.07, 6), BOND, bond);
}

// A burden of yealms carried up and hung on two spars, to hand beside the
// ladder for the middle course of the strake he is on.
function hangBurden(c, { run, verge, at, thatch }) {
  const u = verge - (LAID.length - 0.5) * STRAKE;
  const rest = thatch(run * 0.5);
  for (const [down, shift] of [[1.02, -0.03], [1.3, 0.04]]) {
    const [x, y, z] = at(u + shift, down, rest + 0.13);
    yealm(c.g, c.rng, { x, y, z, len: 0.7 });
  }
  for (const side of [-1, 1]) {
    const [x, y, z] = at(u + side * 0.2, 1.47, rest + 0.08);
    c.add(box(0.03, 0.3, 0.03), HAZEL, { x, y, z, rx: c.pitch });
  }
}

// Spars: hazel rods split and pointed, thrown down along x as they come off
// the hook. Twisted double, each is the staple that pins a yealm to the roof.
function sparHeap(g, rng, n = 14) {
  for (let i = 0; i < n; i++) {
    const across = rng() < 0.2; // a few lie over the rest
    g.add(mesh(box(0.36 + rng() * 0.12, 0.024, 0.032), tone(rng() < 0.72 ? HAZEL : HAZEL_BARK, 0.9 + rng() * 0.18), {
      x: (rng() - 0.5) * 0.22, y: 0.02 + (i / n) * 0.16, z: (rng() - 0.5) * 0.16, ry: (across ? 1.1 : 0) + (rng() - 0.5) * 0.5, rz: (rng() - 0.5) * 0.2,
    }));
  }
}

// The straw bed: loose straw heaped along x under the eave, wetted from the
// tub and drawn out by the handful to make yealms.
function strawBed(g, rng) {
  const ring = (y, rx, rz, n) => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + rng() * 0.5;
    const r = 0.82 + rng() * 0.3;
    return [Math.cos(a) * rx * r, y, Math.sin(a) * rz * r];
  });
  g.add(mesh(hull([...ring(-0.25, 0.7, 0.3, 7), ...ring(0.12, 0.56, 0.24, 6), ...ring(0.3, 0.26, 0.1, 4)]), tone(NEW[1], 0.95)));
  for (let i = 0; i < 6; i++) {
    const a = rng() * Math.PI * 2;
    g.add(mesh(box(0.36, 0.025, 0.05), tone(NEW[2], 0.9 + rng() * 0.14), { x: Math.cos(a) * 0.6, y: 0.03 + rng() * 0.2, z: Math.sin(a) * 0.22, ry: rng() * Math.PI, rz: (rng() - 0.5) * 0.5, shadow: false }));
  }
}

export default {
  id: 'thatcher',
  name: 'The thatcher’s cottage',
  note: 'The thatcher’s cottage — he has got to his own roof at last: half of it new gold straw, the ladder lying where he left off.',
  build(c) {
    c.shell({ eave: 1.55, pitch: 52, walls: 'daub', wash: WASH.daub, frame: 'box', timber: TIMBER.grey, roof: 'gable', thatch: 'straw', ridge: 'none' });
    c.door(...c.plot.door, { open: 0.5 });
    c.window('front', 1.3, { shutter: 'propped' });
    c.window('right', 0.45); // the gable looks on the field track
    c.smoke('hole', 0.4, { lit: true, side: -1 });

    const roof = frontSlope(c);
    layRidge(c, roof);
    layNewThatch(c, roof);
    layLadder(c, roof);
    hangBurden(c, roof);

    // ----- before the door: what goes up the ladder -----
    // The lane to the door comes along the front from the track end, so that
    // side keeps to the wall; the yealms are stacked on the other, under the ladder's foot.
    const stack = c.at(-1.6, 1.98);
    for (const [z, y, ry] of [[-0.15, 0.12, 0.02], [0.15, 0.12, -0.03], [0.01, 0.35, 0.05]]) yealm(stack, c.rng, { y, z, ry });
    c.solid(-1.84, 1.98, 0.3);
    c.solid(-1.4, 1.98, 0.3);
    c.beast(-1.46, 1.99, { kind: 'cat', lift: 0.48, ry: 0.4 }); // asleep on the warm straw
    // the rake he combs the new coat down with, the spars, and two yealms stood out of the way
    c.tool(0.5, c.hz + 0.37, { kind: 'rake', lean: 0.22 });
    sparHeap(c.at(1.0, c.hz + 0.38), c.rng);
    for (const [u, lean] of [[1.74, 0.17], [2.02, 0.2]]) {
      yealm(c.at(u, c.hz + 0.32), c.rng, { lean });
      c.solid(u, c.hz + 0.3, 0.2);
    }
    // what has dropped from today's work, not yet swept up
    for (const [u, v] of [[-0.72, 2.04], [-0.3, 2.2], [0.08, 1.97], [0.42, 2.16], [-1.0, 2.2]]) {
      c.at(u, v, c.rng() * Math.PI).add(mesh(box(0.2 + c.rng() * 0.16, 0.02, 0.035), tone(NEW[2], 0.92 + c.rng() * 0.12), { y: 0.012, shadow: false }));
    }
    // his short ladder, put by against the gable
    c.ladder(c.hx + 0.28, -0.55, { len: 2.1, lean: 0.11, ry: Math.PI / 2 });

    // ----- behind: where the spars are made and the straw is wetted -----
    const gads = c.at(-1.85, -c.hz - 0.42, Math.PI); // hazel rods from the coppice, leaned up to wait for the hook
    for (let i = 0; i < 6; i++) {
      const len = 1.3 + c.rng() * 0.25;
      gads.add(mesh(box(0.035, len, 0.035), tone(HAZEL_BARK, 0.85 + c.rng() * 0.3), { x: (i - 2.5) * 0.06, y: (len / 2) * 0.97, z: -len * 0.125 + (i % 2) * 0.04, rx: -0.25, rz: (c.rng() - 0.5) * 0.12 }));
    }
    // the block he splits them on, the hook left in it
    const block = c.stump(-0.55, -2.0, { r: 0.2, h: 0.42 });
    block.add(mesh(box(0.03, 0.2, 0.03), WOOD_PALE, { x: 0.08, y: 0.6, rz: -0.5 }));
    block.add(mesh(box(0.06, 0.24, 0.014), IRON, { x: -0.03, y: 0.47, rz: -0.5 }));
    block.add(mesh(box(0.1, 0.05, 0.014), IRON, { x: -0.06, y: 0.38, rz: -0.5 }));
    c.tub(0.45, -2.02, { r: 0.34 });
    c.bucket(-0.02, -1.88);
    strawBed(c.at(1.45, -1.97), c.rng);
    c.solid(1.1, -1.97, 0.32);
    c.solid(1.8, -1.97, 0.32);
    c.midden(-2.55, -2.0, { r: 0.36 });
    c.bed(-2.95, -1.5, -2.42, 0.1, { crop: 'leeks' });
  },
};
