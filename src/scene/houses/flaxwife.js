import { WASH, TIMBER, THATCHES, hull } from '../cottage.js';
import { lump, cone } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, WOOD_PALE, WOOD_DARK, STONE } from '../kit.js';

// The flax garth: the spinner's house, and the one the hovel wakes up looking
// at. Her whole toft is given to fibre, and the work goes round the house:
// hemp taller than a man and flax in blue flower at the gable toward the
// green; the pulled bundles stooked along the lane fence; behind, the retting
// pit and the retted straw spread on the grass; and under the front eave,
// where all the green can see it, the yarn — undyed and in the three colours
// the dyer has. No wheel: she spins from a distaff, on the bench by her door.
// The green runs right up to her front wall, so nothing there stops a man.

const TAU = Math.PI * 2;

// yarn as it comes back from the dye-pot
const CREAM = 0xefe6cb; // undyed
const WOAD = 0x3f66a8;
const MADDER = 0xc2452f;
const WELD = 0xe3c23a;

const FLAX_GREEN = 0x789a5c; // flax standing
const FLAX_BLUE = 0x6f8fd0; // its flower
const FLAX_STRAW = 0xc9b46a; // pulled and dried gold
const RETTED = 0xb5a67c; // after the pit: grey, the gold rotted out of it
const HEMP_STALK = 0x9a9a5c; // hemp dries greyer
const TOW = 0xddd2a8; // dressed flax, ready to spin
const NETTLE = 0x4d6b35;
const MOSS = 0x66773f;

// A hank of yarn looped over the pole (y = 0 there) and hanging doubled: a fat
// rope of it, as wide where it goes over as below. Each ring is turned against
// the next, so the facets wind round it as the twist in a hank does.
const ring = (r, y, turn) => Array.from({ length: 5 }, (_, i) => [Math.cos(turn + (i * TAU) / 5) * r, y, Math.sin(turn + (i * TAU) / 5) * r * 0.85]);
const SKEIN = hull([...ring(0.07, 0.045, 0), ...ring(0.1, -0.42, TAU / 10), ...ring(0.062, -0.57, 0)]);

// The yarn, hung to dry under the front eave: a pole laid on pegs driven into
// the wall's own posts, and the week's spinning on it by batches.
function yarnPole(c) {
  const g = c.onWall('front', -1.6); // its middle peg is in the post there
  const out = 0.16; // the pole stands this far off the wall
  const poleY = 1.435;
  for (const x of [-1.53, 0, 1.6]) g.add(mesh(box(0.05, 0.05, 0.26), tone(TIMBER.grey, 0.9 + c.rng() * 0.2), { x, y: poleY - 0.055, z: 0.11 }));
  g.add(mesh(cyl(0.028, 0.032, 3.32, 5), WOOD_PALE, { x: 0.06, y: poleY, z: out, rz: Math.PI / 2 }));
  // six hanks to each stretch between the pegs
  const batches = [MADDER, MADDER, MADDER, WELD, WELD, WELD, WOAD, WOAD, WOAD, WOAD, CREAM, CREAM];
  batches.forEach((colour, i) => {
    const x = (i < 6 ? -1.32 : 0.2) + (i % 6) * 0.225 + (c.rng() - 0.5) * 0.03;
    const hank = mesh(SKEIN, tone(colour, 0.94 + c.rng() * 0.12), { x, y: poleY, z: out, ry: (c.rng() - 0.5) * 0.6 });
    hank.scale.y = 0.86 + c.rng() * 0.28; // no two wound alike
    g.add(hank);
  });
}

// Where she spins: a plank laid on the stone footing with two legs under its
// front edge, a basket of fleece on it and the spindle put down beside; the
// distaff stands in the earth at the door end, a cloud of dressed flax bound
// to its head. Flat to the wall, and nothing a man cannot walk past.
function spinnersBench(c, at) {
  const g = c.onWall('front', at);
  const earth = (x) => c.ground(at + x, c.hz + 0.26); // the ground out here lies below the floor line
  const top = 0.365; // the plank just clears the footing stones
  g.add(mesh(box(1.2, 0.06, 0.24), WOOD_PALE, { y: top - 0.03, z: 0.185 }));
  for (const x of [-0.48, 0.48]) {
    const foot = earth(x) - 0.1;
    g.add(mesh(box(0.07, top - 0.06 - foot, 0.08), WOOD_DARK, { x, y: (top - 0.06 + foot) / 2, z: 0.26 }));
  }
  // the basket of fleece
  g.add(mesh(cyl(0.14, 0.1, 0.15, 7), 0xa98a55, { x: 0.37, y: top + 0.075, z: 0.2 }));
  const fleece = mesh(lump(0.125), 0xe8e1cf, { x: 0.37, y: top + 0.15, z: 0.2, ry: 0.7 });
  fleece.scale.y = 0.6;
  g.add(fleece);
  // the spindle, lying on its whorl and the cop of thread wound on it
  g.add(mesh(box(0.26, 0.016, 0.016), WOOD_DARK, { x: -0.22, y: top + 0.032, z: 0.17 }));
  g.add(mesh(box(0.02, 0.07, 0.07), STONE, { x: -0.3, y: top + 0.035, z: 0.17 }));
  g.add(mesh(cyl(0.028, 0.02, 0.1, 5), CREAM, { x: -0.2, y: top + 0.03, z: 0.17, rz: Math.PI / 2 }));
  // the distaff
  const foot = earth(-0.77) - 0.08;
  g.add(mesh(box(0.03, 1.42 - foot, 0.03), WOOD_PALE, { x: -0.77, y: (1.42 + foot) / 2, z: 0.2, rz: 0.03 }));
  const tow = mesh(lump(0.13), TOW, { x: -0.775, y: 1.13, z: 0.2, ry: 0.4 });
  tow.scale.y = 1.6;
  g.add(tow);
  g.add(mesh(cyl(0.125, 0.13, 0.035, 6), MADDER, { x: -0.775, y: 1.05, z: 0.2 })); // the ribbon that binds it
}

// one tied bundle of pulled stalks, in group g: its butt on the ground `x` out
// along g's own x, leaned back over toward -x
function bundle(g, tall, lean, colour, x = 0) {
  g.add(mesh(cyl(0.04, 0.085, tall, 4), colour, { x: x - (Math.sin(lean) * tall) / 2, y: (Math.cos(lean) * tall) / 2 - 0.03, rz: lean }));
}

// Pulled flax, stood to dry with the bundles' heads leaned together.
function stook(c, u, v, tall = 0.95) {
  const turn = c.rng() * TAU;
  const spread = tall * 0.18; // slim: the strip between her gable and the fence is narrow
  const lean = Math.asin(spread / (tall * 0.84)); // the bundles cross just under their heads
  for (let i = 0; i < 4; i++) bundle(c.at(u, v, turn + (i / 4) * TAU), tall, lean, tone(FLAX_STRAW, 0.88 + c.rng() * 0.22), spread);
  // the seed heads, splayed above the tie
  c.at(u, v, turn).add(mesh(cone(tall * 0.11, tall * 0.2, 5), tone(FLAX_STRAW, 0.78), { y: tall * 0.9, rx: Math.PI }));
  c.solid(u, v, spread + 0.08);
}

// The retting pit: bundles sunk in standing water under stones for a
// fortnight, till the stalk rots off the fibre. It is smelt before it is
// seen. Dug where the toft lies lowest, under the drip of her own eave.
function rettingPit(c, u, v) {
  const g = c.at(u, v);
  const rim = (hx, hz, y) => [[-hx, y, -hz], [hx, y, -hz], [-hx, y, hz], [hx, y, hz]];
  g.add(mesh(hull([...rim(0.6, 0.44, -0.14), ...rim(0.53, 0.37, 0.07)]), 0x56442f)); // the upcast, trodden to a rim
  g.add(mesh(box(0.92, 0.03, 0.6), 0x3b4d4a, { y: 0.07, shadow: false })); // the water, brown-green and still
  for (let i = 0; i < 3; i++) {
    g.add(mesh(cyl(0.06, 0.06, 0.7, 5), tone(0x8f8f4c, 0.88 + c.rng() * 0.2), { x: (c.rng() - 0.5) * 0.08, y: 0.09, z: -0.17 + i * 0.17, rz: Math.PI / 2 }));
  }
  for (const [x, z, r] of [[-0.17, -0.1, 0.11], [0.06, 0.12, 0.09], [0.22, -0.05, 0.08]]) {
    const stone = mesh(lump(r), tone(STONE, 0.9 + c.rng() * 0.2), { x, y: 0.16, z, ry: c.rng() * TAU });
    stone.scale.y = 0.7;
    g.add(stone);
  }
  c.block(u - 0.6, v - 0.44, u + 0.6, v + 0.44);
}

// a pad of moss to lie on the thatch, ragged at its edge as the kit's own are
function mossPad(c, long, deep) {
  const edge = [];
  for (let k = 0; k < 7; k++) {
    const a = (k / 7) * TAU;
    const r = 0.72 + 0.28 * c.rng();
    for (const y of [-0.015, 0.015]) edge.push([(Math.cos(a) * r * long) / 2, y, (Math.sin(a) * r * deep) / 2]);
  }
  return hull(edge);
}

// a clump of nettles, where nobody digs
function nettles(c, u, v) {
  const g = c.at(u, v);
  for (let i = 0; i < 5; i++) {
    const tall = 0.45 + c.rng() * 0.3;
    g.add(mesh(cone(0.06, tall, 4), tone(NETTLE, 0.85 + c.rng() * 0.3), { x: (c.rng() - 0.5) * 0.5, y: tall / 2 - 0.04, z: (c.rng() - 0.5) * 0.4 }));
  }
}

export default {
  id: 'flaxwife',
  name: 'The flax garth',
  note: 'The flax garth — hemp taller than a man, flax in blue flower, dyed yarn drying under the eaves; the retting pit behind is smelt before it is seen.',
  build(c) {
    c.shell({ eave: 1.7, pitch: 51, walls: 'daub', wash: WASH.daub, frame: 'box', timber: TIMBER.grey, roof: 'gable', thatch: 'straw' });
    c.door(...c.plot.door, { open: 0.55 });
    // three small windows, each set a hand low so the wall plate runs whole above it
    c.window('front', 2.1, { shutter: 'propped', y: 1.27 });
    c.window('left', 0.6, { y: 1.27 });
    c.window('back', -0.8, { y: 1.27 });
    c.smoke('hole', -1.3);

    // kept up, not kept new: a strip of the eave laid afresh last autumn, moss
    // gathering further along, a panel of the gable newly daubed
    c.add(box(1.05, 0.03, 1.0), THATCHES.new[1], c.onRoof(1, -1.2, 2.62, 0.02));
    c.add(mossPad(c, 1.25, 0.62), MOSS, c.onRoof(1, 2.0, 2.68, 0.012));
    c.onWall('left', -0.45).add(mesh(box(0.6, 0.5, 0.02), tone(WASH.daub, 1.13), { y: 2.25, z: 0.011 }));

    // under the front eave: the yarn, and where it is spun
    yarnPole(c);
    spinnersBench(c, 2.35);

    // the garth, at the gable toward the green: the hemp behind, the flax before it
    c.bed(-4.35, -2.95, -3.58, -0.3, { crop: 'hemp', rows: 3 }).scale.y = 1.15; // well dunged: it stands a head over any man
    c.block(-4.35, -2.95, -3.58, -0.3); // too thick a stand to push through
    // flax is sown thick: each of the bed's rows stands in a close green drift of it, flowering blue
    const flax = c.bed(-4.35, -0.12, -3.45, 1.85, { crop: 'flax', rows: 2 });
    const crop = 0.46; // how high the drift stands
    for (const x of [-0.225, 0.225]) {
      const end = 0.9 + c.rng() * 0.05;
      flax.add(mesh(hull([
        [x - 0.2, 0.08, -end], [x + 0.2, 0.08, -end], [x - 0.2, 0.08, end], [x + 0.2, 0.08, end],
        [x - 0.09, crop, -end + 0.07], [x + 0.09, crop, -end + 0.07], [x - 0.09, crop, end - 0.07], [x + 0.09, crop, end - 0.07],
      ]), tone(FLAX_GREEN, 0.95 + c.rng() * 0.1)));
    }
    for (let i = 0; i < 9; i++) {
      const wide = 0.055 + c.rng() * 0.03;
      flax.add(mesh(box(wide, 0.03, wide), FLAX_BLUE, { x: (i % 2 ? 0.225 : -0.225) + (c.rng() - 0.5) * 0.08, y: crop + 0.015, z: -0.7 + i * 0.17 + (c.rng() - 0.5) * 0.08, ry: c.rng() }));
    }

    // on the lane side: the pulled flax stooked along the fence, and the long
    // hemp, too tall to stook, leaned on the gable
    c.fence([[3.95, 1.4], [3.95, -0.9]], { h: 0.85 });
    stook(c, 3.64, 0.95);
    stook(c, 3.64, 0.3, 1.0);
    stook(c, 3.64, -0.35);
    for (const v of [-1.0, -1.22, -1.43]) bundle(c.at(3.86, v, (c.rng() - 0.5) * 0.3), 1.55, 0.37 + (c.rng() - 0.5) * 0.06, tone(HEMP_STALK, 0.9 + c.rng() * 0.2));
    c.solid(3.6, -1.2, 0.3);

    // behind: the pit, and what has come out of it spread on the grass to dry
    rettingPit(c, -2.7, -2.52);
    for (let i = 0; i < 10; i++) {
      // laid out thin, a handful at a time, so the dew and the sun reach every stalk
      c.at(-1.5 + i * 0.18, -2.5 + (c.rng() - 0.5) * 0.14, (c.rng() - 0.5) * 0.5).add(mesh(box(0.07, 0.035, 0.52 + c.rng() * 0.2), tone(RETTED, 0.88 + c.rng() * 0.24), { y: 0.01 + (i % 3) * 0.004 }));
    }
    nettles(c, 3.7, -2.55);
  },
};
