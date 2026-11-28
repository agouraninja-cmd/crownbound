import * as THREE from 'three';
import { WASH, TIMBER } from '../cottage.js';
import { span } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, WOOD, WOOD_DARK, WOOD_PALE, ROPE } from '../kit.js';

// The dairy house: a long house, its two doors opposed, the hall above the
// passage and the dairy below it. Two things set it apart. It is being
// limewashed — the walls are new cream but for the last corner of the front,
// where the tub and the long brush still stand — and it is the village's
// dairy: cheeses dry on a slatted rack under the front eave, the churn stands
// by the door, and the red cow waits at her stake with the stool and the pail.

const LIME = 0xf4f1e6; // slaked lime, wet: whiter than any wall it dries on
const OLD_WASH = 0xb2a78e; // the coat it covers, grey after a few winters
const MUD = 0x97866a; // what the rain throws up off the ground
const SPATTER = 0xbfb193; // …and the thinner splashing above it
const MILK = 0xf2eddd;
const LINEN = 0xddd5bf;
const HOOP = 0x76592f; // split hazel
const RED = 0x7e3d27; // the cow
const CHEESES = [0xf0e6bc, 0xead795, 0xe2c878]; // new-made and white · a week dried · a month, and yellowing

const SILL = 0.4; // where the daub begins, above the footing and the sill beam
const JAMB = 0.53; // half a doorway, jambs and all

export default {
  id: 'dairy',
  name: 'The dairy house',
  note: 'The dairy house — new limewash, the brush not yet put away; cheeses drying under the eaves and a red cow at her stake.',
  build(c) {
    c.shell({ eave: 1.7, pitch: 49, walls: 'daub', wash: WASH.lime, frame: 'box', timber: TIMBER.grey, roof: 'hip', thatch: 'straw' });
    const door = c.plot.door[1];
    c.door(...c.plot.door, { open: 0.6, hinge: -1 });
    c.door('back', door); // the passage runs door to door
    c.window('front', 2.0);
    c.window('back', -1.64);
    c.window('right', 0.62, { w: 0.5, bars: 3 }); // the dairy's own: wide and close-barred, for the cool air
    c.smoke('gablet', -1);

    limewash(c, door);
    cheeseRack(c, -1.64);
    dairyWork(c);

    // behind: her winter keep, the cheese-cloths scalded and spread on the hedge, the dung by the back door
    c.haycock(-3.9, -2.8, { r: 0.55, h: 0.8 });
    c.washing(-1.4, -3.05, { len: 1.8, h: 0.85, cloths: [LINEN, LINEN] });
    c.midden(2.75, -2.9, { r: 0.6 });
    c.trough(4.72, 1.6, { len: 1.1, ry: Math.PI / 2 }); // her water, within reach of the tether
  },
};

// A flat patch of colour on a wall's face, lying `out` from it: by default
// just proud of the daub, under the timbers the kit fits over the wall last.
function patch(face, x0, x1, y0, y1, colour, out = 0.012) {
  face.add(mesh(new THREE.PlaneGeometry(x1 - x0, y1 - y0), colour, { x: (x0 + x1) / 2, y: (y0 + y1) / 2, z: out }));
}

// Rain off the eaves throws mud up the foot of a wall: a dark band above the
// sill from x0 to x1, a paler spatter over it, ragged along the top.
function mudBand(face, rng, x0, x1) {
  for (let x = x0; x < x1 - 0.05; ) {
    const w = Math.min(0.4 + rng() * 0.6, x1 - x);
    const mid = SILL + 0.14 + rng() * 0.1;
    patch(face, x, x + w, SILL, mid, tone(MUD, 0.94 + rng() * 0.12));
    patch(face, x, x + w, mid, mid + 0.06 + rng() * 0.12, tone(SPATTER, 0.96 + rng() * 0.08));
    x += w;
  }
}

// Where the lime dripped: white on a wall's sill and down its footing stones,
// each drip as [x, width, top, height]. The stones stand out unevenly, so
// their white hangs just in front of the proudest of them.
function drips(face, onSill, onStones) {
  for (const [x, w, top, tall] of onSill) patch(face, x - w / 2, x + w / 2, top - tall, top, LIME, 0.066);
  for (const [x, w, top, tall] of onStones) patch(face, x - w / 2, x + w / 2, top - tall, top, LIME, 0.168);
}

// The limewash: new on every wall but the front's last corner, and muddied
// along the foot already.
function limewash(c, door) {
  const { hx, hz, rng } = c;
  const front = c.onWall('front');
  const back = c.onWall('back'); // its own x runs against u
  const left = c.onWall('left'); // its own x runs toward the front
  const edge = 0.12; // the corner posts cover this much of a wall's ends
  const reached = -2.6; // the new coat has come this far along the front
  mudBand(front, rng, reached, door - JAMB);
  mudBand(front, rng, door + JAMB, hx - edge);
  mudBand(back, rng, -hx + edge, -door - JAMB);
  mudBand(back, rng, -door + JAMB, hx - edge);
  mudBand(left, rng, -hz + edge, hz - edge);
  mudBand(c.onWall('right'), rng, -hz + edge, hz - edge);

  // The corner still to do wears the old coat: untouched for its first four
  // strips, then less of it with each stroke of the new one, which was brushed
  // on from the top and hangs ragged where it stopped.
  const strips = 7;
  const wide = (reached + hx - edge) / strips;
  for (let i = 0; i < strips; i++) {
    const x = -hx + edge + i * wide;
    const top = i < 4 ? 1.62 : 1.3 - (i - 4) * 0.22 - rng() * 0.12;
    patch(front, x, x + wide, 0.62, top, tone(OLD_WASH, 0.95 + rng() * 0.1));
    patch(front, x, x + wide, SILL, 0.62, tone(OLD_WASH, 0.74 + rng() * 0.06)); // old mud on the old coat
  }

  // The tub of slaked lime, brim-full and slopped over, and what was spilt
  // round it. (The kit's stave vessels are closed solids: what fills one is a
  // disc laid on its top — the lime here, the milk in the pails.)
  const tub = c.tub(-4.0, 2.5, { r: 0.3, h: 0.34, water: false });
  tub.add(mesh(new THREE.CircleGeometry(0.26, 10), LIME, { y: 0.346, rx: -Math.PI / 2 }));
  for (const a of [0.5, 2.3]) tub.add(mesh(box(0.1, 0.2, 0.05), LIME, { x: Math.cos(a) * 0.295, y: 0.27, z: Math.sin(a) * 0.295, ry: Math.PI / 2 - a }));
  for (const [u, v, r] of [[-3.5, 2.75, 0.13], [-4.35, 2.15, 0.09], [-3.45, 2.2, 0.1]]) {
    const spill = mesh(cyl(r, r * 1.15, 0.05, 5), LIME, { ry: rng() * 3 });
    spill.scale.x = 1.5;
    c.at(u, v).add(spill);
  }

  // the brush on its pole, leaned on the wall plate where she left off
  const brush = c.at(-3.45, 2.55);
  brush.rotation.x = -0.34;
  brush.add(mesh(box(0.04, 1.75, 0.04), WOOD_PALE, { y: 0.875 }));
  brush.add(mesh(box(0.05, 0.36, 0.05), LIME, { y: 1.5 })); // lime run down the pole
  brush.add(mesh(box(0.26, 0.05, 0.1), WOOD_DARK, { y: 1.73 })); // the binding
  brush.add(mesh(box(0.24, 0.2, 0.08), tone(LIME, 0.97), { y: 1.85 })); // the bristles

  drips(
    front,
    [[-3.7, 0.12, 0.43, 0.08], [-2.9, 0.07, 0.4, 0.11], [-2.05, 0.1, 0.43, 0.06], [-0.34, 0.06, 0.43, 0.1], [2.45, 0.09, 0.42, 0.07]],
    [
      [-3.86, 0.07, 0.19, 0.3], [-3.6, 0.2, 0.19, 0.09], [-3.3, 0.05, 0.19, 0.2], [-3.12, 0.12, 0.06, 0.07], [-2.84, 0.16, 0.19, 0.11], [-2.8, 0.05, 0.08, 0.16],
      [-2.1, 0.06, 0.19, 0.27], [-1.5, 0.15, 0.13, 0.07], [-1.1, 0.05, 0.19, 0.16], [-0.3, 0.1, 0.17, 0.06], [1.9, 0.05, 0.19, 0.2], [2.5, 0.13, 0.1, 0.07], [3.5, 0.06, 0.19, 0.24],
    ]
  );
  drips(left, [[1.2, 0.1, 0.43, 0.07], [-0.5, 0.06, 0.41, 0.1]], [[1.4, 0.06, 0.19, 0.26], [0.85, 0.15, 0.15, 0.07], [0.1, 0.05, 0.19, 0.18], [-1.0, 0.11, 0.1, 0.06]]);
}

// The cheeses: a slatted rack hung on two posts of the frame (they stand 1.64
// apart) under the front eave — in the air, and out of the dogs' reach.
function cheeseRack(c, at) {
  const { rng } = c;
  const rack = c.onWall('front', at);
  const put = (geo, colour, opts) => rack.add(mesh(geo, colour, opts));
  const oak = () => tone(TIMBER.grey, 0.9 + rng() * 0.2);
  const long = 2.4; // the laths run on past both uprights
  const shelves = [[0.91, 0.62], [1.33, 0.48]]; // [its top, how far it stands out]: the lower stands further, so both rows show
  for (const x of [-0.82, 0.82]) {
    put(box(0.07, 1.16, 0.06), oak(), { x, y: 1.02, z: 0.095 }); // an upright on each post
    for (const [top, reach] of shelves) put(box(0.06, 0.06, reach - 0.06), oak(), { x, y: top - 0.06, z: reach / 2 + 0.03 }); // an arm under each shelf
    span(rack, [x, 0.5, 0.12], [x, 0.83, 0.56], 0.05, 0.05, oak()); // and a strut under the lower arm
  }
  for (const [top, reach] of shelves) {
    // a shelf is laths with the air between them; the rail behind keeps the cheeses off the wet wall
    for (let z = 0.13; z < reach; z += 0.14) put(box(long, 0.03, 0.08), tone(WOOD_PALE, 0.9 + rng() * 0.2), { y: top - 0.015, z });
    put(box(long - 0.14, 0.13, 0.03), tone(WOOD, 0.9), { y: top + 0.08, z: 0.08 });
  }
  // small flat rounds, the newest palest, as [x, shelf, out from the wall, radius, age]
  const cheeses = [[-0.8, 0, 0.36, 0.19, 1], [-0.03, 0, 0.37, 0.2, 2], [0.74, 0, 0.35, 0.18, 1], [-0.42, 1, 0.28, 0.18, 0], [0.38, 1, 0.29, 0.19, 0]];
  for (const [x, shelf, z, r, age] of cheeses) put(cyl(r, r * 1.05, 0.13, 8), tone(CHEESES[age], 0.97 + rng() * 0.06), { x, y: shelves[shelf][0] + 0.065, z, ry: rng() });
  // chest-high and two feet out from the wall: he walks round it
  for (let x = -0.9; x < 1; x += 0.6) c.solid(at + x, c.hz + 0.32, 0.32);
}

// The dairy's work, out in front where the light is.
function dairyWork(c) {
  // the plunge churn by the door: a tall stave tub narrowing to its lid, the dasher's staff standing out of it
  const [cu, cv] = [-0.12, 2.34];
  const churn = c.at(cu, cv);
  churn.add(mesh(cyl(0.13, 0.2, 0.78, 7), WOOD_PALE, { y: 0.39 }));
  for (const [y, r] of [[0.14, 0.195], [0.58, 0.156]]) churn.add(mesh(cyl(r, r + 0.008, 0.05, 7), HOOP, { y }));
  churn.add(mesh(cyl(0.15, 0.15, 0.04, 7), WOOD_DARK, { y: 0.8 }));
  churn.add(mesh(box(0.035, 0.62, 0.035), WOOD, { x: 0.01, y: 1.12, rz: -0.05 }));
  c.solid(cu, cv, 0.22);

  // the red cow at her stake by the dairy end, a rope round her horns
  const [u, v] = [3.05, 2.55];
  const [ahead, aside] = [1.72, 0.42]; // the stake, from her middle (she faces +u)
  const cow = c.beast(u, v, { kind: 'cow', colour: RED });
  cow.add(mesh(box(0.05, 0.34, 0.34), ROPE, { x: 0.78, y: 0.93, rz: -0.35 }));
  cow.add(mesh(cyl(0.035, 0.045, 0.8, 5), WOOD_DARK, { x: ahead, y: 0.12, z: aside }));
  span(cow, [0.82, 0.78, 0.04], [ahead, 0.46, aside], 0.03, 0.03, ROPE);
  c.solid(u + ahead, v + aside, 0.1);

  // The milking stool at her flank, and the milk: one pail under her, one
  // carried to the churn. A milk pail is stave-built like any other, with one
  // stave left long for a handle.
  c.stool(u - 0.33, v + 0.61);
  for (const [pu, pv, ry] of [[u - 0.2, v + 0.07, 0.6], [cu - 0.54, cv + 0.18, 2.4]]) {
    const pail = c.at(pu, pv, ry);
    pail.add(mesh(cyl(0.13, 0.11, 0.22, 7), WOOD_PALE, { y: 0.11 }));
    pail.add(mesh(box(0.02, 0.36, 0.05), WOOD, { x: 0.125, y: 0.18 }));
    pail.add(mesh(new THREE.CircleGeometry(0.105, 7), MILK, { y: 0.226, rx: -Math.PI / 2 }));
  }
}
