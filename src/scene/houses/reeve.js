import { WASH, TIMBER, THATCHES, hull } from '../cottage.js';
import { span, cone } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, WOOD_DARK, WOOD_PALE, ROPE, INK } from '../kit.js';

// The reeve's holding: the best-kept house in the village, as befits the man
// the villagers chose to answer for them — long, limewashed, half-hipped, a
// louvre on the ridge where lesser roofs have only a hole. What no other toft
// has is a barn of its own: it stands behind the house's far end, gable to
// the fold yard, its wide doorway open on the dark; the yard between the two
// is shut in with cleft pales and a pair of slip-poles, and a pony stands
// tethered at the gate. By the door, the tools of his office: sacks, the
// bushel measure and a bundle of tally sticks.
//
// The barn is smaller than a barn should be: the toft is only 2.5 deep behind
// the house and 1.9 wide beyond its end, so it stands end-on, one bay long.

const HAY = 0xc8ab5c;
const GRAIN = 0xd9bd6a;
const DUN = 0xa38a63; // the pony's coat
const SACKING = 0xb5a17a; // hemp sackcloth
// the barn was thatched some winters after the house: its straw is still the paler of the two
const BARN_THATCH = [0xb39248, 0xcaaa59, 0xdabf70];

// a window set between the rail and the wall plate, so the frame runs whole round it
const WINDOW = { h: 0.34, y: 1.5 };

// A full sack of corn: sackcloth bulging over its load, the neck tied and its
// ears standing. lean tips one that rests against its neighbour; lying lays it
// on its side. It starts a little under the ground, so a leaning one still stands on it.
function sack(c, u, v, { r = 0.23, h = 0.5, lean = 0, lying = false, ry = 0, colour = SACKING } = {}) {
  const g = c.at(u, v, ry, lying ? r * 0.86 : 0);
  g.rotation.z = lying ? 1.5 : lean;
  const ring = (y, k) => [0, 1, 2, 3, 4].map((i) => [Math.cos((i * Math.PI * 2) / 5) * r * k, y, Math.sin((i * Math.PI * 2) / 5) * r * k]);
  g.add(mesh(hull([...ring(-0.04, 0.88), ...ring(h * 0.38, 1.1), ...ring(h * 0.7, 0.92), ...ring(h * 0.9, 0.4)]), colour));
  g.add(mesh(cyl(r * 0.42, r * 0.24, h * 0.16, 5), tone(colour, 0.86), { y: h * 0.96 }));
}

// the bushel: a stave measure hooped with hazel, filled and struck level, the strickle left lying across it
function bushel(c, u, v) {
  const g = c.at(u, v, c.rng() * 3);
  g.add(mesh(cyl(0.21, 0.19, 0.26, 8), WOOD_PALE, { y: 0.13 }));
  g.add(mesh(cyl(0.222, 0.215, 0.05, 8), WOOD_DARK, { y: 0.19, shadow: false }));
  g.add(mesh(cone(0.19, 0.03, 8), GRAIN, { y: 0.27, shadow: false }));
  g.add(mesh(box(0.56, 0.028, 0.045), tone(WOOD_PALE, 1.15), { y: 0.29, ry: 0.5 }));
}

// Tally sticks: split hazel, a notch cut for every load and every day's work
// owed, tied in a bundle and hung on a peg. `wall` is a group on the wall's
// face (c.onWall); y is the height of the bundle's middle.
function tallies(wall, y) {
  wall.add(mesh(box(0.035, 0.035, 0.14), WOOD_DARK, { y: y + 0.4, z: 0.06 }));
  wall.add(mesh(box(0.02, 0.16, 0.02), INK, { y: y + 0.32, z: 0.1, shadow: false })); // the thong it hangs by
  for (let i = 0; i < 5; i++) {
    const x = (i - 2) * 0.042;
    const front = i % 2 === 1;
    wall.add(mesh(box(0.036, 0.48, 0.034), tone(WOOD_PALE, 1.0 + (i % 3) * 0.12), { x, y, z: front ? 0.085 : 0.05, rz: (i - 2) * 0.04 }));
    if (!front) continue;
    for (let n = 0; n < 3; n++) wall.add(mesh(box(0.042, 0.014, 0.012), INK, { x, y: y - 0.16 + n * 0.08 + i * 0.012, z: 0.104, shadow: false }));
  }
  wall.add(mesh(box(0.24, 0.04, 0.1), ROPE, { y: y + 0.17, z: 0.07, shadow: false }));
}

export default {
  id: 'reeve',
  name: 'The reeve’s house',
  note: 'The reeve’s house — the best-kept in the village, with a barn of its own; by the door hang the tally sticks, lest any forget what is owed.',
  build(c) {
    c.shell({ eave: 1.9, pitch: 49, walls: 'daub', wash: WASH.lime, frame: 'box', timber: TIMBER.grey, roof: 'halfhip', thatch: 'straw', barge: true });
    // opposed doors, a passage between them; the hall and its hearth lie to the right of it
    c.door(...c.plot.door, { open: 0.5 });
    c.door('back', -0.9);
    c.window('front', 2.6, { ...WINDOW, shutter: 'side' });
    c.window('front', -2.6, { ...WINDOW, shutter: 'side', hinge: -1 });
    c.window('right', 0.6, WINDOW);
    c.smoke('louvre', 0.9);
    // a roof looked after: a patch of this autumn's straw let into the front slope
    c.add(box(0.8, 0.02, 0.62), tone(THATCHES.new[0], 0.98), { ...c.onRoof(1, 2.0, 2.75, 0.012), shadow: false });
    c.add(box(0.5, 0.02, 0.4), tone(THATCHES.new[1], 0.96), { ...c.onRoof(1, 2.25, 2.62, 0.02), shadow: false });

    // by the door: the bench he hears the tally from, the tally sticks on their peg, corn in the sack and the measure it is told by
    c.bench(0.85, 2.22, { len: 1.3 });
    tallies(c.onWall('front', 0.85), 1.1);
    sack(c, 1.9, 2.34, { r: 0.24, h: 0.52, lean: 0.05 });
    sack(c, 2.4, 2.33, { r: 0.22, h: 0.48, lean: -0.2, ry: 0.6, colour: tone(SACKING, 0.92) });
    sack(c, 2.0, 2.72, { r: 0.2, h: 0.46, lying: true, ry: 3.3, colour: tone(SACKING, 1.07) });
    c.solid(2.15, 2.45, 0.4); // the heap is knee-high: he walks round it
    bushel(c, 1.45, 2.68);

    // The barn: raw daub in an old dark frame, its thatch newer than the house's. Its front verge stops just short of
    // the house's back eave and its back one at the toft's bound — that is all the length there is.
    c.outbuilding(4.05, -3.375, -Math.PI / 2, { length: 1.4, width: 2.5 }, (b) => {
      b.shell({ eave: 1.65, pitch: 49, walls: 'daub', wash: WASH.daub, frame: 'box', timber: TIMBER.old, roof: 'gable', thatch: BARN_THATCH, over: 0.2 });
      // the doorway stops under the tie beam, so the gable keeps its truss whole above it
      b.door('right', -0.42, { w: 1.4, h: 1.38, open: 1, lit: 0 });
    });

    // the fold yard between house and barn: cleft pales down its open side and across the gap behind, slip-poles across its mouth
    const gate = { u: 4.63, v: 2.15, w: 1.46 };
    c.fence([[5.46, gate.v], [5.46, -2.62]], { kind: 'pale', h: 1.0 });
    c.fence([[3.6, -2.1], [3.6, -2.5]], { kind: 'pale', h: 1.0 });
    c.slipPoles(gate.u, gate.v, { w: gate.w });
    c.trough(5.05, -1.2, { len: 1.1, ry: Math.PI / 2 });
    c.rock(3.3, 2.5, { r: 0.3, squash: 0.65 }); // the stone he mounts from

    // The pony stands at the gate, looking out over the poles toward the door: haltered, and tied short to the
    // near gatepost, which in the pony's own frame stands at (1.55, -0.1). A little hay is thrown down for it.
    const pony = c.beast(gate.u - gate.w / 2 + 0.85, gate.v - 1.3, { kind: 'pony', ry: -2.214, colour: DUN });
    pony.add(mesh(box(0.06, 0.235, 0.235), ROPE, { x: 0.95, y: 1.19, rz: -0.5, shadow: false }));
    pony.add(mesh(box(0.16, 0.05, 0.14), tone(DUN, 0.55), { x: 0.82, y: 1.4, rz: -0.5, shadow: false })); // its forelock, in its eyes
    span(pony, [0.97, 1.08, 0], [1.5, 1.0, -0.1], 0.025, 0.025, ROPE, false);
    pony.add(mesh(cyl(0.09, 0.09, 0.07, 6), ROPE, { x: 1.55, y: 1.0, z: -0.1, shadow: false }));
    pony.add(mesh(cone(0.3, 0.2, 6), HAY, { x: 0.6, y: 0.08, z: -0.55 }));

    // behind the house: the hayrick by the barn, the dung heap at the far end, the back door clear between them
    c.rick(1.0, -3.3, { r: 0.7, h: 1.7 });
    c.midden(-3.0, -3.65, { r: 0.6 });
  },
};
