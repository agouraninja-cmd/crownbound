import * as THREE from 'three';
import { WASH, TIMBER, THATCHES } from '../cottage.js';
import { span, lump, cone } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, WOOD, WOOD_DARK, WOOD_PALE, IRON, LEATHER, ROPE } from '../kit.js';

// The carter's house: an ordinary daub cottage, gable-on to the road, and at
// its road end what no other house in the village has — a cart hovel, as a
// cart's shed was called. Under a pent of boards stands the two-wheeled cart,
// tipped back on its tail with the shafts in the air; a spare wheel leans by
// the door, the collar hangs on its peg, and the pony that draws it all is
// tethered at the wall.

const HAY = 0xc8ab5c;
const DUNG = 0x4b3a26;
const HEMP = 0x6a5d43; // a tarred rope: dark enough to show against daub
const ASH = 0xa98d5c; // the cart's ladders and shafts: ash, kept under cover and still pale
const RADIUS = 0.45; // a cart wheel stands to a man's waist

// the rim of a wheel: a flat-sided ring about the z axis (the lathe turns it about y)
const RIM = new THREE.LatheGeometry(
  [[RADIUS, -0.035], [RADIUS, 0.035], [RADIUS - 0.075, 0.035], [RADIUS - 0.075, -0.035], [RADIUS, -0.035]].map(([x, y]) => new THREE.Vector2(x, y)),
  12
).rotateX(Math.PI / 2);

// A cart wheel standing in its group's x–y plane, the axle along z: felloes,
// six spokes and a heavy nave. Unshod — iron tyres are for richer men.
function wheel(rng) {
  const g = new THREE.Group();
  g.add(mesh(RIM, tone(WOOD, 0.92 + rng() * 0.16)));
  for (let i = 0; i < 3; i++) g.add(mesh(box(RADIUS * 2 - 0.12, 0.05, 0.045), tone(WOOD_PALE, 0.9 + rng() * 0.2), { rz: (i * Math.PI) / 3 + 0.3 }));
  g.add(mesh(cyl(0.08, 0.08, 0.16, 6), WOOD_DARK, { rx: Math.PI / 2 }));
  return g;
}

// The cart, built into a group standing on the ground under its axle: +x is
// the way it is drawn. Unhitched, it is tipped back until the tail of the bed
// rests on the earth and the shafts point at the sky.
function cart(g, rng, tilt) {
  const axle = RADIUS - 0.02; // the wheels have sunk a finger into the ground
  const pale = () => tone(ASH, 0.86 + rng() * 0.2);
  for (const s of [-1, 1]) {
    const w = wheel(rng);
    w.position.set(0, axle, s * 0.32);
    g.add(w);
  }
  g.add(mesh(box(0.07, 0.07, 0.8), WOOD_DARK, { y: axle })); // the axle-tree

  // everything that tips: x along the bed, y up from the axle
  const bed = new THREE.Group();
  bed.position.y = axle;
  bed.rotation.z = tilt;
  g.add(bed);
  const put = (geo, colour, opts) => bed.add(mesh(geo, colour, opts));
  put(box(1.3, 0.035, 0.44), tone(WOOD, 0.95), { y: 0.13 }); // the floor
  for (const s of [-1, 1]) {
    const z = s * 0.235;
    put(box(1.5, 0.065, 0.055), tone(WOOD, 0.8 + rng() * 0.2), { x: -0.06, y: 0.085, z }); // a side of the frame, run out behind as a tail-piece
    span(bed, [0.66, 0.085, z], [1.8, 0.085, s * 0.17], 0.055, 0.05, pale()); // its shaft
    // the ladder side: a top rail on five staves
    put(box(1.46, 0.045, 0.045), pale(), { y: 0.53, z });
    for (let i = 0; i < 5; i++) put(box(0.035, 0.42, 0.035), pale(), { x: -0.6 + i * 0.3, y: 0.31, z });
  }
  // the fore-ladder that keeps the load off the pony's rump, rung to the foremost staves, and the bar across the tail
  for (const y of [0.31, 0.53]) put(box(0.04, 0.04, 0.5), pale(), { x: 0.6, y });
  put(box(0.055, 0.07, 0.52), tone(WOOD, 0.85), { x: -0.66, y: 0.08 });
}

// THE CART HOVEL, against the gable that faces the road: two posts, a plate
// and a pent of boards, open to the front. The cart was backed in from the
// lane end, so its shafts stand out there.
function cartHovel(c) {
  const { rng } = c;
  const length = 2.4;
  const depth = 1.0;
  const high = 2.18; // as high up the gable as the verges of the thatch leave room for
  const low = 1.5;
  const sub = c.leanTo('right', 0, { length, depth, high, low, walls: 'open', roof: 'board' });
  const put = (geo, colour, opts) => sub.add(mesh(geo, colour, opts));
  const post = length / 2 - 0.08; // where its posts stand along the wall (this wall's own +x runs toward the back of the house)

  // each end is framed back to the house: a tie at the plate, and under it a
  // rail for the brace to stand on — high enough for the cart to pass beneath
  for (const s of [-1, 1]) {
    put(box(0.06, 0.08, depth - 0.16), tone(WOOD_DARK, 0.95 + rng() * 0.2), { x: s * post, y: low - 0.02, z: (depth - 0.12) / 2 });
    put(box(0.06, 0.07, depth - 0.1), tone(WOOD_DARK, 0.95 + rng() * 0.2), { x: s * post, y: low - 0.47, z: (depth - 0.08) / 2 });
  }

  // the boards of the pent, cleft and weathered grey, under the battens that hold them down
  const slope = (high - low) / depth;
  const fall = Math.atan(slope);
  const boards = 10;
  const wide = (length + 0.44) / boards;
  for (let i = 0; i < boards; i++) {
    const reach = depth + 0.22 - rng() * 0.07; // each ends where it was split to
    const colour = i === 6 ? TIMBER.new : tone(rng() < 0.7 ? TIMBER.grey : TIMBER.old, 0.9 + rng() * 0.25); // one was replaced this year
    put(box(wide - 0.014, 0.02, reach / Math.cos(fall)), colour, {
      x: -length / 2 - 0.22 + (i + 0.5) * wide, y: high - (slope * reach) / 2 + 0.06 + 0.01 / Math.cos(fall), z: reach / 2, rx: fall,
    });
  }

  // the cart-rope, coiled on a peg in the back post
  put(box(0.03, 0.03, 0.14), WOOD_PALE, { x: post, y: 1.2, z: depth - 0.02 });
  const coil = mesh(new THREE.TorusGeometry(0.13, 0.032, 4, 8), ROPE, { x: post, y: 1.07, z: depth + 0.01 });
  coil.scale.set(0.75, 1.15, 1);
  sub.add(coil);

  // The cart stands where its outer wheel does (the ground falls away from the
  // wall), turned so that it is drawn out toward the lane.
  const u = c.hx + 0.55;
  const v = 0.5;
  cart(c.at(u, v, -Math.PI / 2, c.ground(u + 0.32, v) - c.ground(u, v)), rng, 0.68);
  c.solid(u, 1.6, 0.3); // the shafts, where they stand out past the hovel's own footprint
  c.haycock(u - 0.02, -0.82, { r: 0.4, h: 0.5, solid: false }); // fodder kept in the dry
  c.hurdle(c.hx + depth / 2 - 0.04, -post, { len: 0.82, h: 1.07, solid: false }); // a hurdle across the weather end

  // What the pony leaves is heaped behind the hovel till a garden wants it — a
  // barrowful, not the midden of a yard with beasts and room for one.
  const muck = c.at(u + 0.05, -1.82);
  muck.add(mesh(cone(0.34, 0.3, 7), DUNG, { y: 0.11, ry: rng() }));
  muck.add(mesh(cone(0.2, 0.2, 6), tone(DUNG, 1.15), { x: 0.14, y: 0.08, z: 0.12, ry: rng() }));
  c.solid(u + 0.05, -1.82, 0.26);
}

// a spare wheel leaned on the wall by the door
function spareWheel(c) {
  const foot = c.at(1.95, c.hz + 0.33);
  const leaned = new THREE.Group();
  leaned.rotation.x = -0.28;
  const w = wheel(c.rng);
  w.position.y = RADIUS;
  w.rotation.z = 0.2;
  leaned.add(w);
  foot.add(leaned);
  c.solid(1.95, c.hz + 0.2, 0.3);
}

// the pony's collar, with its hames, and the reins: on pegs by the door
function harness(c) {
  const sub = c.onWall('front', -0.42);
  const put = (geo, colour, opts) => sub.add(mesh(geo, colour, opts));
  put(box(0.74, 0.08, 0.035), tone(TIMBER.grey, 1.05), { y: 1.38, z: 0.03 }); // the peg board
  for (const x of [-0.17, 0.2]) put(box(0.035, 0.035, 0.16), WOOD_DARK, { x, y: 1.39, z: 0.11, rx: -0.2 });
  const collar = mesh(new THREE.TorusGeometry(0.15, 0.055, 5, 10), LEATHER, { x: -0.17, y: 1.25, z: 0.13 });
  collar.scale.y = 1.3; // a collar is longer than it is wide, like the neck it sits on
  sub.add(collar);
  for (const s of [-1, 1]) put(box(0.035, 0.5, 0.04), WOOD_PALE, { x: -0.17 + s * 0.17, y: 1.27, z: 0.17, rz: s * 0.1 }); // the hames
  for (const s of [-1, 1]) put(box(0.025, 0.55, 0.02), tone(LEATHER, 0.8), { x: 0.2 + s * 0.05, y: 1.1, z: 0.14, rz: s * 0.05 }); // the reins, looped over their peg
  put(box(0.14, 0.03, 0.03), IRON, { x: 0.2, y: 0.82, z: 0.14 }); // ...and the bit at the bottom of the loop
}

// the pony, haltered and tied to a ring in the wall post, with hay in a log trough under its nose
function pony(c) {
  const [u, v] = [-1.75, 2.55];
  const sub = c.beast(u, v, { kind: 'pony' });
  const ring = [0.88, 1.0 - c.ground(u, v), c.hz + 0.07 - v]; // on the house, so measured from its floor
  sub.add(mesh(box(0.045, 0.23, 0.23), HEMP, { x: 0.93, y: 1.2, rz: -0.5 })); // the halter's noseband
  // the tether, hanging slack between its chin and the ring
  span(sub, [0.92, 1.08, 0], [0.9, 0.74, -0.42], 0.025, 0.025, HEMP);
  span(sub, [0.9, 0.74, -0.42], ring, 0.025, 0.025, HEMP);
  sub.add(mesh(box(0.06, 0.06, 0.04), IRON, { x: ring[0], y: ring[1], z: ring[2] }));
  const manger = c.trough(-0.5, 2.62, { len: 0.8, ry: Math.PI / 2, water: false });
  const hay = mesh(lump(0.2), HAY, { y: 0.33 });
  hay.scale.set(1.85, 0.5, 0.85);
  manger.add(hay);
}

export default {
  id: 'carter',
  name: 'The carter’s house',
  note: 'The carter’s house — a two-wheeled cart tipped back under its lean-to, shafts in the air; a spare wheel by the door, the pony tethered at the wall.',
  build(c) {
    const { rng } = c;
    c.shell({ eave: 1.7, pitch: 50, walls: 'daub', wash: WASH.daub, frame: 'box', timber: TIMBER.grey, roof: 'gable', thatch: 'straw', moss: 3 });
    c.door(...c.plot.door, { open: 0.35 });
    c.window('front', -1.55, { shutter: 'propped' });
    c.window('back', -0.9);
    c.smoke('hole', -0.4, { lit: true });

    // the thatcher has been: one patch of new straw, low on the front slope
    for (let i = 0; i < 3; i++) {
      const len = 0.65 + rng() * 0.25;
      c.add(box(0.42, 0.045, len), tone(THATCHES.new[1], 0.94 + rng() * 0.1), c.onRoof(1, -1.95 + i * 0.42, 2.0 + len / 2, 0.02));
    }

    // ...and the daubers: a panel of the far gable made good with clay from another pit
    c.onWall('left', 0.55).add(mesh(box(0.62, 0.46, 0.014), tone(WASH.clay, 0.95), { y: 0.72, z: 0.007, rz: 0.03 }));

    cartHovel(c);
    spareWheel(c);
    harness(c);
    pony(c);

    // spare shaft-poles of ash, seasoning under the back eave
    const poles = c.onWall('back', 1.3);
    for (let i = 0; i < 3; i++) span(poles, [-0.3 + i * 0.25, -0.45, 0.34], [-0.2 + i * 0.2, 1.52, 0.09], 0.05, 0.05, tone(WOOD_PALE, 0.85 + rng() * 0.25));
    c.solid(1.35, -c.hz - 0.22, 0.22); // he walks round them
    // nettles, where nobody treads
    c.bush(-1.9, -c.hz - 0.23, { r: 0.2 });
    c.bush(0.25, -c.hz - 0.22, { r: 0.17 });
  },
};
