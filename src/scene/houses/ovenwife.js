import { WASH, TIMBER, THATCHES, hull } from '../cottage.js';
import { cone, lump } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, STONE, STONE_DARK, WOOD, WOOD_DARK, WOOD_PALE } from '../kit.js';

// The oven house: a plain clay-washed house, and behind its downhill end the
// village's bread oven — a beehive of clay on a stone base, its mouth smoked
// black and never quite cold, under a small thatch of its own on four posts.
// The peel leans at the corner of the house, the faggots are stacked behind,
// the batch cools on a board under the gable window, and by the door stands
// the quern her own corn is ground on.
//
// The oven is smaller, and nearer the house, than an oven should be. The toft
// is only 1.7 deep behind the wall: the shelter is no wider than the oven it
// keeps dry, and its eaves stop where the house's own begin. (The kit's open
// outbuilding will not go in there: its verges overhang too far, and its
// posts would stand in the dome.) It is in the one back corner the oak does
// not overhang, its mouth toward the lanes.

const CLAY = 0xb18763; // the dome: raw clay, baked hard from within
const SOOT = 0x231a14;
const SMOKED = 0x3b332b; // timber the oven's smoke has blackened
const FIRE = 0xe8782c; // embers, seen in the mouth
const FLAME = 0xf7b24a;
const ASH = 0xbdb8ab;
const CRUST = 0xc2a06c; // a loaf
const MEAL = 0xe6dcc2;

// a window set between the rail and the wall plate, so the frame runs whole round it
const WINDOW = { h: 0.25, y: 1.3 };

// The oven and its shelter are built in a frame of their own — a group
// standing on the ground where she stands to work it: x the way the mouth
// looks (the house's +u), z across, y up from her feet.
const STAND = { u: 3.05, v: -2.775 };
const HEARTH = 0.55; // the oven's floor: the top of its stone base
const BASE = { back: -1.97, front: -0.3, half: 0.57 };
// the dome: longer than it is wide, as a beehive oven is
const DOME = { x: -1.25, long: 0.64, wide: 0.53, high: 0.78 };
const RINGS = [[-0.04, 1], [0.3, 0.98], [0.58, 0.88], [0.82, 0.66], [0.96, 0.36]]; // [height, girth] of each ring of it, as shares of the whole
const AROUND = 9; // facets round the dome
const THROAT = -0.41; // the face of the mouth, which stands out from the dome

const POSTS = { back: -1.85, front: 0.45, half: 0.46 };
const PLATE = 1.6; // the top of the two plates the rafters sit on
const PITCH = (52 * Math.PI) / 180;
const SIN = Math.sin(PITCH);
const COS = Math.cos(PITCH);
const APEX = PLATE + (SIN / COS) * (POSTS.half + 0.045); // the rafters' line at the ridge
// eave: how far out each slope runs before its fringe — with that, 0.66 either
// side of the ridge, which is all there is between the house's eaves and the toft's bound
const ROOF = { from: -2.02, to: 0.55, eave: 0.52, deep: 0.15 };

// A point on the dome: `turn` counts facets round from the mouth, `ring` up
// from the hearth; proud > 1 stands it off the clay (soot, a patch).
function onDome(turn, ring, proud = 1) {
  const a = (turn / AROUND) * Math.PI * 2;
  const [high, girth] = RINGS[ring];
  return [DOME.x + Math.cos(a) * DOME.long * girth * proud, HEARTH + DOME.high * high * proud, Math.sin(a) * DOME.wide * girth * proud];
}

// The oven: a base of rough stone, the clay dome on it, and the mouth.
function oven(c, g) {
  const { rng } = c;
  const put = (geo, colour, opts) => g.add(mesh(geo, colour, opts));
  const long = BASE.front - BASE.back;
  const mid = (BASE.front + BASE.back) / 2;
  const rough = () => tone(rng() < 0.5 ? STONE : STONE_DARK, 0.9 + rng() * 0.2);

  // the base: a dark core run well into the slope, a course of stones round it, the hearth slab on top
  put(box(long, 1.2, BASE.half * 2), tone(STONE_DARK, 0.8), { x: mid, y: HEARTH - 0.67 });
  for (const s of [-1, 1]) {
    let x = BASE.back;
    while (x < BASE.front - 0.05) {
      let len = 0.3 + rng() * 0.3;
      if (BASE.front - x - len < 0.2) len = BASE.front - x;
      put(box(len - 0.025, 0.36, 0.06 + rng() * 0.03), rough(), { x: x + len / 2, y: HEARTH - 0.25, z: s * (BASE.half + 0.015) });
      x += len;
    }
  }
  for (const [z, wide] of [[-0.39, 0.36], [-0.02, 0.34], [0.37, 0.4]]) {
    put(box(0.06 + rng() * 0.03, 0.36, wide - 0.025), rough(), { x: BASE.front + 0.015, y: HEARTH - 0.25, z });
  }
  put(box(long + 0.1, 0.07, BASE.half * 2 + 0.1), tone(STONE, 1.04), { x: mid, y: HEARTH - 0.035 });

  // the dome, and what the years have done to it
  const dome = [[DOME.x, HEARTH + DOME.high * 1.02, 0]];
  for (let ring = 0; ring < RINGS.length; ring++) for (let i = 0; i < AROUND; i++) dome.push(onDome(i + 0.5, ring));
  put(hull(dome), CLAY);
  // a skin lying on part of it: [ring, first turn, last turn] for each ring it covers
  const skin = (spans, colour) => {
    const points = [];
    for (const [ring, from, to] of spans) for (let turn = from; turn <= to; turn++) points.push(onDome(turn, ring, 1.02));
    put(hull(points), colour);
  };
  skin([[1, -1.5, 1.5], [2, -1.5, 1.5], [3, -0.5, 0.5], [4, -0.5, 0.5]], tone(CLAY, 0.42)); // soot, fanned up the clay above the mouth
  skin([[0, 5.5, 6.5], [1, 5.5, 6.5], [2, 5.5, 6.5]], tone(CLAY, 1.16)); // a crack on its weather side, made good with new clay

  // The mouth: a porch of clay built out from the dome, smoked dark — two cheeks and the arch over them. Each
  // is a solid from its outline at the mouth's face to a wider one lost inside the dome; an outline is
  // [height above the hearth, how far to the side] round its corners.
  const porch = (face, within) => {
    const at = (x, outline) => outline.map(([y, z]) => [x, HEARTH + y, z]);
    put(hull([...at(THROAT, face), ...at(THROAT - 0.45, within)]), tone(CLAY, 0.6));
  };
  for (const s of [-1, 1]) porch([[0, s * 0.17], [0, s * 0.27], [0.26, s * 0.17], [0.26, s * 0.27]], [[0, s * 0.17], [0, s * 0.36], [0.26, s * 0.17], [0.26, s * 0.36]]);
  porch([-1, 1].flatMap((s) => [[0.26, s * 0.27], [0.33, s * 0.27], [0.44, s * 0.13]]), [-1, 1].flatMap((s) => [[0.26, s * 0.36], [0.42, s * 0.3], [0.5, s * 0.16]]));
  // the dark of the oven, a hand's breadth in — its back just proud of the dome's own face — and on its floor the fire
  put(box(0.02, 0.26, 0.34), SOOT, { x: THROAT - 0.22, y: HEARTH + 0.13, shadow: false });
  put(box(0.21, 0.012, 0.34), SOOT, { x: THROAT - 0.105, y: HEARTH + 0.006, shadow: false });
  c.ember(box(0.05, 0.07, 0.28), FIRE, { x: THROAT - 0.18, y: HEARTH + 0.047, in: g });
  c.ember(box(0.03, 0.045, 0.14), FLAME, { x: THROAT - 0.165, y: HEARTH + 0.1, z: 0.03, in: g });

  // the door of it, set down by the mouth: a scorched board with a peg to lift it by; and the ash raked out
  put(box(0.035, 0.38, 0.36), tone(WOOD, 0.62), { x: BASE.front + 0.1, y: 0.17, z: 0.34, rz: 0.2 });
  put(box(0.07, 0.05, 0.05), WOOD_PALE, { x: BASE.front + 0.13, y: 0.24, z: 0.34, rz: 0.2 });
  put(cone(0.3, 0.1, 7), ASH, { x: BASE.front + 0.22, y: 0.03, z: -0.26, shadow: false });
  put(cone(0.15, 0.1, 5), tone(ASH, 0.86), { x: BASE.front + 0.12, y: 0.07, z: -0.2, shadow: false });
}

// Its shelter: four posts, two plates, a pair of rafters at each end, and
// straw laid as the house's is — three courses, a ragged eave, a roll along
// the ridge.
function shelter(c, g) {
  const { rng } = c;
  const put = (geo, colour, opts) => g.add(mesh(geo, colour, opts));
  const timber = () => tone(TIMBER.grey, 0.9 + rng() * 0.2);
  const ground = (x, z) => c.ground(STAND.u + x, STAND.v + z) - g.position.y;
  const long = ROOF.to - ROOF.from;
  const mid = (ROOF.to + ROOF.from) / 2;

  for (const s of [-1, 1]) {
    const z = s * POSTS.half;
    // the back pair stand on the corners of the stone base, out of the wet; the front pair in the ground
    put(cyl(0.06, 0.07, PLATE - HEARTH, 6), timber(), { x: POSTS.back, y: (PLATE + HEARTH) / 2, z });
    const foot = ground(POSTS.front, z) - 0.5;
    put(cyl(0.06, 0.08, PLATE - foot, 6), timber(), { x: POSTS.front, y: (PLATE + foot) / 2, z, rz: (rng() - 0.5) * 0.04 });
    put(box(long - 0.24, 0.09, 0.09), timber(), { x: mid, y: PLATE - 0.045, z });
    const rafter = (POSTS.half + 0.045) / COS;
    for (const x of [POSTS.back, POSTS.front]) {
      // the pair over the mouth are smoked black, like the collar between them
      put(box(0.06, 0.06, rafter), x === POSTS.front ? SMOKED : timber(), { x, y: APEX - (SIN * rafter) / 2 - 0.05, z: (s * COS * rafter) / 2, rx: s * PITCH });
    }
  }
  put(box(long - 0.2, 0.07, 0.07), timber(), { x: mid, y: APEX - 0.07 }); // the ridge pole
  put(box(0.08, 0.09, POSTS.half * 2), timber(), { x: POSTS.back, y: PLATE - 0.045 }); // a tie behind the dome…
  put(box(0.05, 0.06, 0.52), SMOKED, { x: POSTS.front, y: APEX - 0.36 }); // …and only a collar over the mouth, so she can stand up under it

  // the straw: each course a slab from the ridge down, the upper ones prouder and shorter
  const straw = THATCHES.straw.map((colour) => tone(colour, 0.84)); // the house's straw, browned by the smoke
  [[1, 0, 0], [0.64, 0.05, 0.03], [0.34, 0.1, 0.06]].forEach(([share, lift, shrink], i) => {
    const colour = tone(straw[i], 0.95 + rng() * 0.1);
    for (const s of [-1, 1]) {
      const z = s * ROOF.eave * share;
      const y = APEX - (SIN / COS) * ROOF.eave * share + lift;
      const slab = [];
      for (const x of [ROOF.from + shrink, ROOF.to - shrink]) slab.push([x, APEX + lift, 0], [x, APEX + lift + ROOF.deep, 0], [x, y, z], [x, y + ROOF.deep, z]);
      put(hull(slab), colour);
    }
  });
  const tufts = Math.round(long / 0.36);
  for (const s of [-1, 1]) {
    for (let i = 0; i < tufts; i++) {
      const len = 0.12 + rng() * 0.1;
      const down = ROOF.eave / COS + len / 2 - 0.05;
      put(box(0.22 + rng() * 0.12, ROOF.deep * 0.8, len), tone(straw[0], 0.84 + rng() * 0.22), {
        x: ROOF.from + (i + 0.5) * (long / tufts) + (rng() - 0.5) * 0.06, y: APEX - SIN * down + ROOF.deep * 0.45, z: s * COS * down, rx: s * (PITCH + 0.1 + rng() * 0.14),
      });
    }
  }
  const top = APEX + 0.1 + ROOF.deep + 0.03;
  put(cyl(0.12, 0.12, long + 0.04, 6), tone(straw[2], 1.03), { x: mid, y: top, rz: Math.PI / 2 });
  for (const x of [ROOF.from + 0.45, mid, ROOF.to - 0.45]) {
    for (const s of [-1, 1]) put(box(0.03, 0.03, 0.5), WOOD_DARK, { x: x + s * 0.025, y: top + 0.07, rx: s * (PITCH + 0.3) });
  }
}

// A quern on its block: the bedstone, the runner turned on it by an upright
// peg, and the meal that creeps out between them.
function quern(c, u, v) {
  const g = c.at(u, v, c.rng() * 3);
  const put = (geo, colour, opts) => g.add(mesh(geo, colour, opts));
  put(cyl(0.3, 0.33, 0.4, 8), tone(WOOD, 0.85), { y: 0.12 });
  put(cyl(0.275, 0.285, 0.02, 9), MEAL, { y: 0.33, shadow: false });
  put(cyl(0.225, 0.235, 0.09, 9), STONE_DARK, { y: 0.375 });
  put(cyl(0.215, 0.225, 0.09, 9), tone(STONE, 1.06), { y: 0.47, ry: 0.3 });
  put(cyl(0.045, 0.045, 0.012, 6), SOOT, { y: 0.52, shadow: false }); // the eye the corn is fed through
  put(box(0.03, 0.2, 0.03), WOOD_PALE, { x: 0.16, y: 0.61 });
  c.solid(u, v, 0.32);
}

export default {
  id: 'ovenwife',
  name: 'The oven house',
  note: 'The oven house — a clay oven out back under a thatch of its own, never quite cold; the batch cools on a board, and the hens know it.',
  build(c) {
    const { hx, hz, rng } = c;
    c.shell({ eave: 1.65, pitch: 50, walls: 'daub', wash: WASH.clay, frame: 'box', timber: TIMBER.grey, roof: 'gable', thatch: 'straw', moss: 4 });
    c.door(...c.plot.door, { open: 0.6 });
    c.window('front', 1.45, { ...WINDOW, shutter: 'propped' });
    c.window('right', 0.55, { ...WINDOW, shutter: 'side', hinge: -1 });
    c.smoke('hole', 0.9, { lit: true });
    // kept up: a patch of this year's straw on the back slope, a patch of plain daub by the corner the oven warms
    c.add(box(0.9, 0.02, 0.6), tone(THATCHES.new[0], 0.98), { ...c.onRoof(-1, -0.6, 2.2, 0.012), shadow: false });
    c.add(box(0.02, 0.44, 0.6), tone(WASH.daub, 0.95), { x: hx + 0.002, y: 0.7, z: -0.95 });

    // behind the downhill end: the oven under its shelter, the smoke of it rolling out at the gable
    const stand = c.at(STAND.u, STAND.v);
    oven(c, stand);
    shelter(c, stand);
    c.block(STAND.u + BASE.back, STAND.v - BASE.half, STAND.u + BASE.front, STAND.v + BASE.half);
    for (const s of [-1, 1]) c.solid(STAND.u + POSTS.front, STAND.v + s * POSTS.half, 0.09); // slim, and wide enough apart to walk in between
    c.smokeAt(STAND.u + ROOF.to + 0.05, stand.position.y + APEX + 0.15, STAND.v);

    // the peel, leaned at the corner of the house: a long pole with a thin blade to slide under the loaves
    const peel = c.at(2.95, -1.3);
    peel.rotation.z = 0.14;
    peel.add(mesh(box(0.035, 1.75, 0.035), WOOD_PALE, { y: 0.875 }));
    peel.add(mesh(hull([-1, 1].flatMap((s) => [-0.011, 0.011].flatMap((x) => [[x, 1.7, s * 0.03], [x, 1.84, s * 0.14], [x, 2.14, s * 0.14]]))), tone(WOOD_PALE, 0.88)));
    c.faggots(0.3, -2.85, { n: 5 });

    // the batch, cooling on a board under the gable window
    const board = c.trestle(3.1, 0.65, { len: 1.1, wide: 0.5, ry: Math.PI / 2 });
    for (let i = 0; i < 6; i++) {
      const r = 0.13 + rng() * 0.025;
      const loaf = mesh(lump(r), tone(CRUST, 0.86 + rng() * 0.22), { x: ((i % 3) - 1) * 0.33 + (rng() - 0.5) * 0.05, y: 0.745 + r * 0.42, z: (i < 3 ? -1 : 1) * 0.12, ry: rng() * 3 });
      loaf.scale.y = 0.6;
      board.add(loaf);
    }

    // by the door: the quern, a sack of corn waiting for it, and on the lane's side a bench
    quern(c, -1.7, hz + 0.5);
    c.sack(-2.38, hz + 0.32, { r: 0.24, lean: -0.1 });
    c.bench(0.85, hz + 0.34, { len: 1.1 });

    // hens go where the crumbs fall; the dung heap and an elder keep the far corner
    c.beast(3.3, -0.3, { kind: 'hen', ry: -1.2 });
    c.beast(-1.3, -2.5, { kind: 'hen', colour: 0x4a3a30, ry: 0.6 });
    c.midden(-2.75, -2.7, { r: 0.6 });
    c.bush(-3.05, -1.25, { r: 0.38, colour: 0x5a7a3a }).scale.y = 1.8;
  },
};
