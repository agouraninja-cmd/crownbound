import { WASH, THATCHES, hull } from '../cottage.js';
import { span, ball } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, STONE } from '../kit.js';

// The cruck house: built the old way, and the best of that way left in the
// village. Two things set it apart. Its frame is crucks — pairs of great
// curved oaks, each pair the two halves of one bent tree, standing on
// padstones and leaning together at the ridge — and they show in both gable
// ends, which are kept bare so that the one toward the oak lane is seen from
// it. And before the front wall is its orchard corner: an apple, a pear and a
// young plum in fruit, a pole ladder left in the apple, a basket of apples at
// its foot, and the pig let in under the boughs for the windfalls.

const OAK = 0x8a8378; // the frame, weathered silver
const ASH = 0xbba77f; // the ladder's pole, split and left out in all weathers
const HIDE = 0x6b5040; // a dark, bristled pig
const APPLE = 0xb5372a; // the fruit, in the colours the kit's trees bear it
const PEAR = 0xb7b04a;
const PLUM = 0x5a3a6a;
const FRUIT = 0.1; // an apple's width — well over life size, or it is lost at any distance

// One cruck blade as it shows in a gable 3.6 wide under this roof: its back
// (the side toward the thatch) and its belly, as [back x, back y, belly x,
// belly y] from the padstone to the ridge, the butt of the tree at the foot.
// It is broader everywhere than the pair the kit frames a cruck gable with.
const BLADE = [
  [1.78, 0.3, 1.4, 0.3],
  [1.74, 1.2, 1.39, 1.2],
  [1.62, 1.75, 1.27, 1.75], // the elbow, where the trunk turned into the bough
  [1.13, 2.92, 0.86, 2.8], // from here up its back lies under the thatch
  [0, 4.36, 0, 3.95],
];
const PROUD = 0.15; // how far the blades stand out of the daub

// The crucks in both gables. The kit's cruck frame draws a slighter pair, with
// the tie and the collar across them; these are the great blades themselves,
// laid over that pair and hiding it, each one timber from padstone to ridge.
function crucks(c) {
  for (const wall of ['right', 'left']) {
    const gable = c.onWall(wall);
    for (const side of [-1, 1]) {
      const oak = tone(OAK, 0.84 + c.rng() * 0.08);
      for (let i = 0; i < BLADE.length - 1; i++) {
        const pts = [];
        for (const [bx, by, ix, iy] of [BLADE[i], BLADE[i + 1]]) {
          for (const z of [-0.02, PROUD]) pts.push([side * bx, by, z], [side * ix, iy, z]);
        }
        gable.add(mesh(hull(pts), oak));
      }
      // the padstone it stands on: a cruck is never set in the ground
      gable.add(mesh(box(0.6, 0.8, 0.26), tone(STONE, 0.92 + c.rng() * 0.14), { x: side * 1.58, y: -0.07, z: 0.12 }));
    }
  }
}

// Fruit of a size to be seen from the lane, hung on one of the kit's trees
// (grown with fruit: false — the kit's own is a scatter of specks): two to a
// bough, toward the outside of the crown and mostly up in the light, and none
// on the side turned to the house wall, where nobody would see it.
function hangFruit(tree, rng, colour, size) {
  const boughs = tree.children.filter((m) => m.geometry?.type === 'IcosahedronGeometry');
  for (const { position: p, scale, geometry } of boughs) {
    const r = geometry.parameters.radius;
    const outward = Math.hypot(p.x, p.z) > 0.01 ? Math.atan2(p.z, p.x) : rng() * Math.PI * 2; // which way this bough hangs out from the trunk
    for (let i = 0; i < 2; i++) {
      const a = outward + (rng() - 0.5) * 2.2;
      const up = (rng() - 0.25) * r;
      if (Math.sin(a - tree.rotation.y) < -0.4) continue; // that way lies the wall (the trees stand before the front)
      const out = Math.sqrt(r * r - up * up) * 0.96; // on the bough's skin, sunk a little into the leaves
      tree.add(mesh(box(size, size, size), colour, { x: p.x + Math.cos(a) * out, y: p.y + up * scale.y * 0.96, z: p.z + Math.sin(a) * out, ry: rng() * 3, shadow: false }));
    }
  }
}

// A pole ladder: one ash pole split down its length, the halves spread at the
// foot and pinned together at the top, so that the point goes in among the
// boughs. The group stands at its foot, and it leans toward -z.
function poleLadder(g, len, lean) {
  const up = Math.cos(lean) * len;
  const back = -Math.sin(lean) * len;
  const half = (k) => 0.27 - 0.23 * k; // half the spread of the stiles, k of the way up
  for (const s of [-1, 1]) span(g, [s * half(0), 0, 0], [s * half(1), up, back], 0.055, 0.055, ASH);
  // six rungs, the last well short of the point
  for (let i = 1; i <= 6; i++) {
    const k = i / 7.4;
    g.add(mesh(box(half(k) * 2 + 0.06, 0.035, 0.035), tone(ASH, 0.86), { y: up * k, z: back * k }));
  }
}

// A pig with its snout in the grass (the kit's pig only stands and stares),
// built to the same measure. It faces +x.
function rootingPig(g, hide) {
  const put = (geo, colour, o) => g.add(mesh(geo, colour, o));
  const body = mesh(ball(0.24, 6, 4), hide, { y: 0.35, rz: -0.14 });
  body.scale.set(1.55, 0.9, 0.9);
  g.add(body);
  put(box(0.5, 0.05, 0.05), tone(hide, 0.62), { x: -0.02, y: 0.55, rz: -0.14, shadow: false }); // the bristle ridge
  const head = mesh(ball(0.14, 5, 4), hide, { x: 0.42, y: 0.24, rz: -0.6 });
  head.scale.set(1.2, 0.95, 0.9);
  g.add(head);
  put(cyl(0.06, 0.075, 0.16, 6), tone(hide, 1.15), { x: 0.526, y: 0.107, rz: 0.67 }); // the snout, down among the windfalls
  for (const s of [-1, 1]) {
    put(box(0.07, 0.1, 0.02), tone(hide, 0.8), { x: 0.47, y: 0.33, z: s * 0.085, rz: -1.1 }); // ears, fallen forward
    put(box(0.06, 0.3, 0.06), tone(hide, 0.85), { x: -0.25, y: 0.15, z: s * 0.11 });
    put(box(0.06, 0.24, 0.06), tone(hide, 0.85), { x: 0.22, y: 0.12, z: s * 0.11, rz: -0.12 });
  }
}

export default {
  id: 'cruckhouse',
  name: 'The cruck house',
  note: 'The cruck house — great curved oaks meet in each gable end, and a pig roots for windfalls under the fruit trees.',
  build(c) {
    c.shell({ eave: 1.75, pitch: 52, walls: 'daub', wash: WASH.daub, frame: 'cruck', timber: OAK, roof: 'gable', thatch: 'straw', moss: 4 });
    const door = c.plot.door[1];
    c.door(...c.plot.door, { open: 0.45 });
    c.door('back', door); // the passage runs door to door, below the hall
    c.window('front', 2.25, { shutter: 'side', lit: 0.5 }); // the chamber: a rushlight, no more
    c.window('back', -1.75); // the hall's own
    c.smoke('hole', -1.2); // the hearth is in the hall's middle
    crucks(c);

    // mending: one strake of the front slope laid new this year, as far up as the old straw had gone
    c.add(box(0.92, 0.05, 1.2), tone(THATCHES.new[0], 0.93), c.onRoof(1, 2.55, 2.7, 0.012));
    c.add(box(0.84, 0.05, 0.98), tone(THATCHES.new[1], 0.93), c.onRoof(1, 2.6, 1.61, 0.012));

    // --- the orchard corner: three trees, no two of an age and not in a row ---
    hangFruit(c.tree(-3.3, 2.98, { kind: 'pear', h: 2.1, fruit: false }), c.rng, PEAR, FRUIT);
    hangFruit(c.tree(-2.1, 3.16, { kind: 'apple', h: 2.4, fruit: false, ry: -Math.PI / 2 }), c.rng, APPLE, FRUIT); // turned so its boughs leave the ladder a way in
    hangFruit(c.tree(-0.8, 2.9, { kind: 'plum', h: 1.8, fruit: false }), c.rng, PLUM, FRUIT * 0.85);
    // the ladder stands out in the open and leans in to the apple; nobody walks through it
    const [lu, lv, turn] = [-1.15, 3.95, 0.9];
    poleLadder(c.at(lu, lv, turn), 2.2, 0.44);
    for (const under of [0, 0.32, 0.64]) c.solid(lu - Math.sin(turn) * under, lv - Math.cos(turn) * under, 0.24);
    c.basket(-0.55, 3.85, { r: 0.24, h: 0.22, fill: APPLE });
    rootingPig(c.at(-2.8, 3.9, 0.1), HIDE);
    c.solid(-2.8, 3.9, 0.32);
    const windfalls = [[-2.15, 3.95], [-1.95, 3.7], [-2.4, 3.55], [-1.6, 3.5], [-1.75, 4.05], [-2.55, 3.0]];
    for (const [u, v] of windfalls) c.at(u, v, c.rng() * 3).add(mesh(box(FRUIT, FRUIT, FRUIT), APPLE, { y: FRUIT * 0.45, shadow: false }));

    // by the door, on the side the lane comes in
    c.bench(2.2, 2.14, { len: 1.2 });

    // behind, on the side away from the lane: the dung by the back door, and the block the logs are split on
    c.midden(-0.8, -2.45, { r: 0.45 });
    c.chopBlock(-2.6, -2.4);
  },
};
