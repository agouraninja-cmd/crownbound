import * as THREE from 'three';
import { WASH, TIMBER, hull } from '../cottage.js';
import { span, cone, lump } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, WOOD, WOOD_DARK, WOOD_PALE, STONE, STRAW, IRON } from '../kit.js';

// The ox house: a long house, man and beast under one thatch. The hall with
// its hearth is the upper end; a passage runs through between two opposed
// doors; below it, where the ground falls and the wet runs away from the
// hearth, is the byre — a wide doorway closed by a hurdle, no window, a drain
// through the foot of the end wall and the dung heap outside it. The village's
// plough-team lives here: a red ox and a black in the hurdle fold before the
// byre door, their yoke hung by the house door, the goad stood beside it and
// the plough laid over on its side in the yard.

const RED = 0x8a4427; // the near ox
const BLACK = 0x2f2a27; // the off ox
const DUNG = 0x4b3a26;
const WET = 0x33291f; // stone and earth soaked by what runs out of a byre
const HAY = 0xc8ab5c;
const ASH = 0xc7b388; // ash wood handled smooth: the yoke's bows, the goad
const NEW_DAUB = 0xb89f74; // not yet weathered down to the colour of the wall

const BYRE = 2.75; // the byre doorway, along the front wall
const POST = -2.15; // the wall post the yoke hangs on
const DRAIN = 1.0; // the drain, along the end wall (toward the front)

export default {
  id: 'oxhouse',
  name: 'The ox house',
  note: 'The ox house — one long roof over man and beast: a red ox and a black in the hurdle yard, their yoke on the wall, the plough laid on its side.',
  build(c) {
    c.shell({ eave: 1.7, pitch: 50, walls: 'daub', wash: WASH.earth, frame: 'cruck', timber: TIMBER.grey, roof: 'gable', thatch: 'straw', moss: 3 });
    c.door(...c.plot.door, { open: 0.4 });
    c.door('back', c.plot.door[1]); // the passage runs door to door, between hall and byre
    c.door('front', BYRE, { w: 1.3, kind: 'hurdle', lit: 0 }); // the beasts' own way in: wide, and shut by nothing but a hurdle
    c.window('front', -3.5, { shutter: 'side', hinge: -1 });
    c.window('back', -2.9);
    c.smoke('hole', -2.4); // the hearth is in the hall: no smoke rises over the beasts

    yoke(c);
    goad(c);
    plough(c);
    fold(c);
    byreEnd(c);

    // a horn went through the byre wall: daubed up again, and the patch still pale
    c.onWall('front', 1.2).add(mesh(new THREE.PlaneGeometry(0.66, 0.52), NEW_DAUB, { y: 0.92, z: 0.012, rz: 0.06 }));

    // behind: their winter hay, and the nettles nobody cuts
    c.haycock(2.2, -2.75, { r: 0.52, h: 0.8 });
    c.bush(-4.85, -2.9, { r: 0.42 });
  },
};

// The yoke, hung by the house door on a peg in the wall post: a long beam
// hollowed to sit on two necks, and under each seat the bent ash bow that
// goes round the neck. One colour throughout — its lengths overlap at the joints.
function yoke(c) {
  const wall = c.onWall('front', POST);
  const out = 0.13; // it hangs clear of the post's face
  const oak = tone(WOOD, 0.9);
  wall.add(mesh(box(0.05, 0.05, 0.3), WOOD_DARK, { y: 1.36, z: 0.16, rx: -0.12 }));
  const beam = [[-0.74, 1.42], [-0.48, 1.5], [-0.2, 1.45], [0.2, 1.45], [0.48, 1.5], [0.74, 1.42]];
  for (let i = 0; i < beam.length - 1; i++) span(wall, [...beam[i], out], [...beam[i + 1], out], 0.13, 0.11, oak);
  const bow = [[-0.14, 1.6], [-0.14, 1.16], [-0.08, 1.04], [0.08, 1.04], [0.14, 1.16], [0.14, 1.6]];
  for (const seat of [-0.48, 0.48]) {
    for (let i = 0; i < bow.length - 1; i++) span(wall, [seat + bow[i][0], bow[i][1], out], [seat + bow[i + 1][0], bow[i + 1][1], out], 0.035, 0.035, ASH);
  }
}

// the goad they are driven with: an ash rod with an iron prick, stood by the door
function goad(c) {
  const at = 0.3;
  const wall = c.onWall('front', at);
  const foot = [0, c.ground(at, c.hz + 0.45), 0.45];
  const tip = [0.14, 1.5, 0.09];
  span(wall, foot, tip, 0.04, 0.04, ASH);
  span(wall, tip, tip.map((t, i) => t + (t - foot[i]) * 0.05), 0.02, 0.02, IRON);
}

// The plough, laid over on its land side by the house door, as it is left
// between seasons: a heavy beam, the coulter's knife through it, the iron
// share on the sole, a mouldboard to turn the slice and two stilts to hold it
// by. It is built as it stands in the furrow — x forward, y up, z toward the
// furrow — and then tipped.
function plough(c) {
  const [u, v, ry] = [-3.25, 3.2, 0.1];
  const tip = 1.33; // how far over it lies: the land-side stilt has come to rest on the ground
  const p = new THREE.Group();
  p.rotation.x = -tip; // its top falls toward the house wall, so the lane sees its upper side
  p.position.y = 0.07;
  c.at(u, v, ry).add(p);
  const oak = () => tone(TIMBER.grey, 0.92 + c.rng() * 0.2);
  span(p, [-0.8, 0.06, 0], [0.2, 0.06, 0], 0.12, 0.1, oak()); // the sole
  span(p, [0, 0.06, 0], [0, 0.56, 0], 0.1, 0.08, oak()); // the sheath, up to the beam
  span(p, [-1.15, 0.5, -0.02], [1.6, 0.62, 0], 0.13, 0.11, oak()); // the beam
  span(p, [-0.72, 0.06, -0.03], [-1.6, 0.98, -0.3], 0.065, 0.065, oak()); // the stilts…
  span(p, [-0.6, 0.1, 0.12], [-1.6, 0.98, 0.3], 0.065, 0.065, oak());
  span(p, [-1.3, 0.67, -0.21], [-1.3, 0.69, 0.23], 0.045, 0.045, oak()); // …and the rung between them
  span(p, [0.62, 0.76, 0], [0.8, 0.1, 0], 0.07, 0.025, IRON); // the coulter
  p.add(mesh(box(0.05, 0.16, 0.04), IRON, { x: 1.55, y: 0.64 })); // the hake the team is hitched to
  // the share: an iron wedge on the sole's nose
  p.add(mesh(hull([[0.15, 0, -0.05], [0.15, 0.12, -0.05], [0.15, 0, 0.16], [0.15, 0.1, 0.16], [0.62, 0.01, -0.03], [0.62, 0.04, -0.03]]), IRON));
  // the mouldboard: a board slewed off behind the share
  const board = [[0.18, 0.02, 0.05], [0.18, 0.3, 0.05], [-0.75, 0.02, 0.3], [-0.75, 0.4, 0.38]];
  p.add(mesh(hull([...board, ...board.map(([x, y, z]) => [x + 0.01, y, z + 0.045])]), tone(WOOD_PALE, 1.08)));
  // he walks round it
  const cos = Math.cos(ry);
  const sin = Math.sin(ry);
  for (const [x, z] of [[-1.1, -0.5], [0, -0.4], [1.1, -0.45]]) c.solid(u + x * cos + z * sin, v - x * sin + z * cos, 0.42);
}

// The fold before the byre door: wattle hurdles staked end to end, and the gap
// toward the lane closed with slip-poles. The two oxen stand in it nose to
// nose over an armful of hay, looking out at whoever goes by. (They cannot be
// reached, so they need stop nobody.)
function fold(c) {
  const lane = c.hz + 1.65; // the hurdles along the lane
  c.hurdle(1.275, lane, { len: 1.55 });
  c.slipPoles(BYRE, lane, { w: 1.4 });
  c.hurdle(4.285, lane, { len: 1.67, ry: 0.02 });
  c.hurdle(0.5, 2.72, { len: 1.47, ry: Math.PI / 2 });
  c.hurdle(5.12, 2.66, { len: 1.58, ry: Math.PI / 2 - 0.03 });
  c.hurdle(4.77, 1.87, { len: 0.7 }); // …and back to the corner of the house
  c.beast(1.36, 2.8, { kind: 'ox', colour: RED, ry: -0.25, solid: false });
  c.beast(4.24, 2.8, { kind: 'ox', colour: BLACK, ry: Math.PI + 0.25, solid: false });
  const hay = mesh(lump(0.22), HAY, { y: 0.06, ry: 0.4 });
  hay.scale.set(1.5, 0.5, 1);
  c.at(BYRE + 0.05, 3.22).add(hay);
}

// The byre's end: the drain through the footing, the wet that runs from it,
// the dung heap it soaks into with the fork left standing, and the hand-barrow.
function byreEnd(c) {
  const { rng } = c;

  // the drain: a hole left in the footing under the sill, a stone either side
  // and one over it, and a hollowed log to throw the wet clear of the wall
  const wall = c.onWall('right', DRAIN);
  wall.add(mesh(box(0.3, 0.2, 0.05), 0x1f1812, { y: 0.13, z: 0.16, shadow: false }));
  for (const s of [-1, 1]) wall.add(mesh(box(0.15, 0.36, 0.24), tone(STONE, 0.95 + rng() * 0.1), { x: s * 0.225, y: 0.1, z: 0.12 }));
  wall.add(mesh(box(0.62, 0.09, 0.26), tone(STONE, 0.9 + rng() * 0.1), { y: 0.275, z: 0.13 }));
  wall.add(mesh(box(0.16, 0.07, 0.3), tone(WOOD_DARK, 0.8), { y: 0.0, z: 0.32, rx: 0.2 }));
  wall.add(mesh(box(0.4, 0.5, 0.03), WET, { y: -0.2, z: 0.2 })); // the stain down the stones under it
  // …and across the ground to the heap
  for (const [u, v, ry, len] of [[4.74, 0.98, 0.2, 0.5], [5.0, 0.76, 1.0, 0.46]]) c.at(u, v, ry).add(mesh(box(len, 0.04, 0.26), WET));

  // the dung heap: forked out of the byre all winter, carted to the fields in spring
  const [hu, hv] = [4.9, -0.35];
  const heap = c.at(hu, hv);
  const pile = (r, h, x, z, wide, long, k) => {
    const m = mesh(cone(r, h, 7), tone(DUNG, k), { x, y: h / 2 - 0.05, z });
    m.scale.set(wide, 1, long);
    heap.add(m);
  };
  pile(0.5, 0.75, 0, 0, 0.95, 1.7, 1);
  pile(0.34, 0.5, 0.05, 0.52, 1, 1.2, 1.14);
  pile(0.3, 0.36, -0.03, -0.62, 1.1, 1.3, 0.9);
  for (let i = 0; i < 5; i++) {
    // straw from their bedding, on the big pile's slopes
    const t = 0.3 + rng() * 0.5;
    const a = rng() * Math.PI * 2;
    heap.add(mesh(box(0.26, 0.03, 0.06), tone(STRAW, 0.8 + rng() * 0.3), { x: Math.cos(a) * t * 0.475, y: 0.72 - t * 0.75, z: Math.sin(a) * t * 0.85, ry: rng() * 3, shadow: false }));
  }
  for (const dv of [-0.75, 0, 0.6]) c.solid(hu, hv + dv, 0.45);

  // the fork, stuck in it where the last load was thrown up
  const fork = new THREE.Group();
  fork.position.set(0.05, 0.42, 0.25);
  fork.rotation.set(-0.3, 0, 0.22);
  fork.add(mesh(box(0.035, 1.2, 0.035), WOOD_PALE, { y: 0.62 }));
  fork.add(mesh(box(0.2, 0.035, 0.035), WOOD_DARK, { y: 0.04 }));
  for (const s of [-1, 1]) fork.add(mesh(box(0.025, 0.3, 0.025), WOOD_DARK, { x: s * 0.085, y: -0.1 }));
  heap.add(fork);

  // the hand-barrow the next load waits on
  c.barrow(4.95, -2.42, { ry: Math.PI / 2 + 0.05, load: DUNG });
}
