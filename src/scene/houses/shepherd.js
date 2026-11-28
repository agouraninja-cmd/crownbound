import { WASH, TIMBER, THATCHES, hull } from '../cottage.js';
import { span, cone } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box } from '../kit.js';

// The shepherd's house: old and earthfast, low under dark heather thatch.
// What sets it apart is the fold behind it — a pen of wattle hurdles under the
// back eaves, his few ewes in it — and the gear of his trade about the door:
// spare hurdles leaned together, a sheepskin pegged out to dry, his crook and
// his dog.

const FLEECE = 0xe0dac8;
const LITTER = 0x6a5536; // straw trodden into dung
const HAY = 0xc8ab5c;
const DOOR = 0x7b6a52; // old boards, gone grey-brown

// The fold, in the house's own frame: it runs along the back wall and a
// hurdle's length on past the -u corner. Its way in (`gate`: from where to
// where along the back) is shut with slip-poles, the one side the flock is
// seen through, and looks on the open ground the way round from the lane
// comes in by.
const FOLD = { u0: -3.6, u1: -0.35, v0: -3.5, v1: -1.8, gate: [-3.5, -2.1] };
const HURDLE = 0.75; // how high a hurdle stands: low enough to see the flock over
const BED = 0.05; // how deep the litter lies in the fold

// A slab of trodden litter over [u0, u1] × [v0, v1], tipped to lie on the
// ground under it (the yard is not level, and a flat slab would bury a corner).
function litter(c, u0, v0, u1, v1) {
  const [a, b, d, e] = [c.ground(u0, v0), c.ground(u1, v0), c.ground(u0, v1), c.ground(u1, v1)];
  c.g.add(mesh(box(u1 - u0, 0.3, v1 - v0), LITTER, {
    x: (u0 + u1) / 2, y: (a + b + d + e) / 4 + BED - 0.15, z: (v0 + v1) / 2,
    rz: Math.atan((b - a + e - d) / 2 / (u1 - u0)), rx: -Math.atan((d - a + e - b) / 2 / (v1 - v0)),
  }));
}

// A hay crib on the back wall: a rack of rods the ewes pull the hay down through.
function crib(c, at) {
  const wall = c.onWall('back', at);
  const half = 0.52;
  const [y0, y1, out] = [0.42, 0.98, 0.36]; // the foot rail on the wall, the top rail held out from it
  const wood = () => tone(TIMBER.grey, 0.9 + c.rng() * 0.2);
  span(wall, [-half, y0, 0.05], [half, y0, 0.05], 0.05, 0.05, wood());
  span(wall, [-half, y1, out], [half, y1, out], 0.05, 0.05, wood());
  for (const s of [-1, 1]) span(wall, [s * half, y1, 0], [s * half, y1, out], 0.05, 0.05, wood());
  for (let i = 0; i < 6; i++) {
    const x = -half + 0.05 + (i * (half * 2 - 0.1)) / 5;
    span(wall, [x, y0, 0.05], [x, y1, out], 0.03, 0.03, wood());
  }
  // the hay: packed behind the rods, heaped over the top rail
  const hay = [];
  for (const x of [-half + 0.06, half - 0.06]) {
    hay.push([x, 0.5, 0.02], [x, 0.5, 0.07], [x, 0.97, 0.02], [x, 0.97, 0.32], [x * 0.9, 1.12, 0.05], [x * 0.9, 1.13, 0.22]);
  }
  wall.add(mesh(hull(hay), HAY));
}

// The fold: hurdles stood end to end, the house's own wall for its fourth
// side, slip-poles across the way in. The ewes cannot be walked in among, so
// one collider stands for hurdles and flock together.
function fold(c) {
  const { hx, hz, rng } = c;
  const { u0, u1, v0, v1, gate } = FOLD;
  const wall = -hz - 0.1; // as near the house as a hurdle's end stake comes: clear of the footing
  // one hurdle from a to b ([u, v] each), a little out of true, as a man sets them
  const hurdle = ([ua, va], [ub, vb]) => c.hurdle((ua + ub) / 2, (va + vb) / 2, {
    len: Math.hypot(ub - ua, vb - va) - 0.04, h: HURDLE, ry: Math.atan2(va - vb, ub - ua) + (rng() - 0.5) * 0.06, lift: -0.04, solid: false,
  });
  // round it from the house's corner: out, down the end, the way in, along the back, home to the wall
  hurdle([-hx, v1], [u0, v1]);
  hurdle([u0, v1], [u0, v0]);
  c.slipPoles((gate[0] + gate[1]) / 2, v0, { w: gate[1] - gate[0], solid: false });
  hurdle([gate[1] + 0.1, v0], [u1, v0]);
  hurdle([u1, v0], [u1, wall]);
  c.block(u0 - 0.1, v0 - 0.1, u1 + 0.1, -hz);

  // the litter in two slabs, for the ground twists along the wall
  litter(c, u0 + 0.02, v0 + 0.02, -2, -hz - 0.07);
  litter(c, -2, v0 + 0.02, u1 - 0.02, -hz - 0.07);
  crib(c, -1.92);
  c.trough(u1 - 0.27, -2.7, { len: 1.0, ry: Math.PI / 2, lift: -0.03, solid: false }); // along the far hurdle

  // the flock, standing or lying in the litter, their feet a little way into it
  const sheep = (u, v, ry, opts) => c.beast(u, v, { kind: 'sheep', ry, lift: BED - 0.02, solid: false, ...opts });
  sheep(-1.92, -2.42, -Math.PI / 2); // at the crib
  sheep(-2.75, -2.88, Math.PI / 2, { colour: 0xcfc6ac }); // looking out through the poles
  sheep(-3.2, -2.95, 1.2, { kind: 'lamb', colour: 0xe2dcc8 }); // and her lamb beside her
  sheep(-1.75, -3.12, 0.15, { lying: true, colour: 0x8f8170 }); // the brown one
  sheep(-1.35, -2.55, 0, { lying: true }); // by the trough
}

// Spare hurdles leaned together like a tent, to hand for when the fold is
// moved or a ewe must be penned apart. Each: how far along the stack it
// stands, how far out from the middle, which way it faces, how far it leans.
function spareHurdles(c, u, v) {
  for (const [du, dv, ry, lean] of [[-0.14, 0.36, 0, 0.4], [0.2, 0.48, 0, 0.43], [0.04, -0.36, Math.PI, 0.4]]) {
    c.hurdle(u + du, v + dv, { len: 1.6, h: HURDLE, lean, ry: ry + (c.rng() - 0.5) * 0.06 });
  }
  c.block(u - 0.96, v - 0.4, u + 1.02, v + 0.5);
}

// A sheepskin pegged out on the wall to dry: the fleece thick down the back,
// the legs and the neck drawn out to their pegs.
function sheepskin(c, at) {
  const wall = c.onWall('front', at);
  const y = 0.8; // its middle, up the wall
  const shank = tone(FLEECE, 0.95);
  // a flat piece of it: an outline of [x, up] from the skin's middle, lying on the wall
  const flap = (outline) => wall.add(mesh(hull(outline.flatMap(([x, up]) => [[x, y + up, 0.008], [x, y + up, 0.022]])), shank));
  const peg = (x, up) => wall.add(mesh(cone(0.03, 0.12, 4), TIMBER.dark, { x, y: y + up, z: 0.06, rx: Math.PI / 2 }));
  const back = [[0, y + 0.4, 0.05], [0, y - 0.47, 0.05]]; // the spine stands proud; the sides lie thin
  for (const s of [-1, 1]) {
    for (const [x, up] of [[0.25, 0.4], [0.27, -0.26], [0.15, -0.46]]) back.push([s * x, y + up, 0.008], [s * x, y + up, 0.024]); // shoulder, haunch, rump
    flap([[s * 0.17, 0.42], [s * 0.17, 0.08], [s * 0.5, 0.45], [s * 0.54, 0.35]]); // a foreleg
    flap([[s * 0.17, -0.08], [s * 0.14, -0.44], [s * 0.54, -0.36], [s * 0.5, -0.47]]); // a hind leg
    peg(s * 0.5, 0.4);
    peg(s * 0.5, -0.41);
  }
  wall.add(mesh(hull(back), FLEECE));
  flap([[-0.15, 0.36], [0.15, 0.36], [-0.09, 0.53], [0.09, 0.53]]); // the neck
  peg(0, 0.49);
}

export default {
  id: 'shepherd',
  name: 'The shepherd’s house',
  note: 'The shepherd’s house — ewes folded in hurdles under the back eaves, a sheepskin pegged to the wall, and a dog that sleeps with one ear up.',
  build(c) {
    const { hx, hz } = c;
    c.shell({ eave: 1.5, pitch: 48, walls: 'daub', wash: WASH.clay, frame: 'post', timber: TIMBER.old, roof: 'hip', thatch: 'heather', ridge: 'turf', moss: 5 });
    c.door(...c.plot.door, { open: 0.3, colour: DOOR });
    c.door('back', c.plot.door[1], { open: 0.5, hinge: -1, colour: DOOR }); // straight through the house to the fold
    c.window('front', -1.92, { shutter: 'propped' });
    c.smoke('seep', 0, { lit: true });
    // mended with what there was: straw in the heather, daub of another clay
    c.add(box(0.9, 0.05, 0.56), tone(THATCHES.straw[0], 0.84), { ...c.onRoof(1, 1.05, 1.5, 0.02), ry: 0.05 });
    c.add(box(0.02, 0.5, 0.74), tone(WASH.daub, 0.93), { x: -hx - 0.002, y: 0.8, z: -0.02 });
    c.add(box(0.62, 0.44, 0.02), tone(WASH.daub, 0.9), { x: 2.0, y: 0.74, z: hz + 0.002 });

    fold(c);
    spareHurdles(c, -2.75, 2.24);
    sheepskin(c, -0.61);

    // by the door: the dog, his crook, a basket of wool
    c.beast(-0.95, hz + 0.55, { kind: 'dog', lying: true, ry: -0.3 }).scale.setScalar(1.15);
    c.tool(1.5, hz + 0.3, { kind: 'crook', len: 1.45, lean: 0.12 }).scale.set(1.5, 1, 1.5); // made stouter: the kit's is lost against the wall from the lane
    c.basket(2.1, hz + 0.45, { r: 0.22, h: 0.22, fill: FLEECE });

    // behind: the dung thrown out of the fold, and the winter's hay
    c.midden(0.75, -3.25, { r: 0.5 });
    c.rick(2.95, -2.9, { r: 0.7, h: 1.6 });
    c.tool(2.26, -1.98, { kind: 'pitchfork', lean: 0.25, ry: -0.64 }); // leaned on the rick, for filling the crib
  },
};
