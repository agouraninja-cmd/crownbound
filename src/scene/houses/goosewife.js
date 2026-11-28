import { WASH, TIMBER, THATCHES, hull } from '../cottage.js';
import { ball, cone } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, STRAW } from '../kit.js';

// The goose-wife's cottage: a small hipped house behind the hovel, its limewash a
// few winters old. What sets it apart is the flock — a long muddy pond between
// the door and the lane, geese on it and about it, the low wattle pen they are
// shut in at night, and her washing spread on the hedge to dry.

const WHITE = 0xe6e1d2; // a goose as the kit breeds them
const GREY = 0xa39d8f; // and the colour of the wild greylag they came from
const BILL = 0xd98a2e;
const MUD = 0x4a3a28; // the kit pond's trodden mud, and its water
const WATER = 0x3d5560;
const RUSH = 0x3f6a30;
const FEATHER = 0xf0ece0;
const WET = 0.015; // how far the water stands above its mud

// How a goose carries itself in each pose. neck: [x, y, turn (rz), length],
// head: [x, y] and bill: [x, y, turn] — x and y from the middle of its body.
const POSES = {
  settled: { neck: [0.19, 0.105, -0.4, 0.19], head: [0.235, 0.2], bill: [0.295, 0.19, 0] }, // sat down, neck drawn in, no legs showing: afloat, or on a nest
  dabbling: { neck: [0.27, -0.055, -2.27, 0.26], head: [0.37, -0.14], bill: [0.42, -0.175, -0.6] }, // neck down to the water
  hissing: { neck: [0.31, 0.06, -1.34, 0.26], head: [0.45, 0.1], bill: [0.52, 0.095, 0] }, // neck out level at a stranger
};

// A goose doing what the kit's bird will not (that one only stands and
// stares), built to the same measure so they are one flock. It faces +x.
function goose(g, colour, pose) {
  const put = (geo, col, o) => g.add(mesh(geo, col, o));
  const { neck, head, bill } = POSES[pose];
  const y = pose === 'settled' ? 0.08 : 0.24; // the body's middle
  const body = mesh(ball(0.15), colour, { y });
  body.scale.set(1.4, 0.95, 0.95);
  g.add(body);
  put(cyl(0.035, 0.045, neck[3], 5), colour, { x: neck[0], y: y + neck[1], rz: neck[2] });
  put(ball(0.055, 5, 4), colour, { x: head[0], y: y + head[1] });
  put(box(0.07, 0.025, 0.035), BILL, { x: bill[0], y: y + bill[1], rz: bill[2], shadow: false });
  if (pose !== 'settled') for (const s of [-1, 1]) put(box(0.02, 0.12, 0.02), BILL, { x: 0.02, y: 0.06, z: s * 0.05, shadow: false });
}

// The pond: the pit this house's daub was dug from, long since filled with rain.
// The kit's round pond will not go between the wall and the lane, so this one
// is the house's own — long and narrow, in the same mud and water.
// Returns mud(u, v): how far the top of its mud lies above the real ground
// there, for standing a bird on it.
function digPond(c, cu, cv) {
  const A = 1.05; // half the water's length and half its width
  const B = 0.33;
  const blunt = (s, e) => Math.sign(s) * Math.abs(s) ** e; // squarer than an oval: a pit, not a boat
  const shore = []; // the water's edge
  const bank = []; // the edge of the trodden mud about it
  const foot = []; // where its banks run in under the ground
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2;
    const cos = Math.cos(t);
    const sin = Math.sin(t);
    const k = 0.9 + c.rng() * 0.14; // no two stretches of shore alike
    shore.push([A * k * blunt(cos, 0.75), B * k * blunt(sin, 0.75)]);
    // trodden widest at the two ends, and most of all at the door end where the flock goes in and out
    const tread = cos > 0 ? 0.36 : 0.22;
    const j = 0.95 + c.rng() * 0.1;
    const ring = (halfX, halfZ) => [halfX * j * blunt(cos, 0.6), halfZ * j * blunt(sin, 0.6)];
    bank.push(ring(A + tread, B + 0.13));
    foot.push(ring(A + tread + 0.17, B + 0.28));
  }
  // It lies with the ground, which falls a hand's breadth from one end of it
  // to the other, and not dead level: level, it stood out of the hollow in its
  // middle like a tray. `top` is its mud at the pond's middle, above the floor line.
  const fall = (c.ground(cu + A + 0.3, cv) - c.ground(cu - A - 0.2, cv)) / (2 * A + 0.5);
  const top = Math.max(...bank.map(([x, z]) => c.ground(cu + x, cv + z) - x * fall)) + 0.02;
  const mud = (u, v) => top + (u - cu) * fall - c.ground(u, v);
  const g = c.at(cu, cv, 0, mud(cu, cv));
  g.rotation.z = Math.atan(fall);
  // the banks run down into the ground all round
  g.add(mesh(hull([...bank.map(([x, z]) => [x, 0, z]), ...foot.map(([x, z]) => [x, -mud(cu + x, cv + z) - 0.05, z])]), MUD));
  g.add(mesh(hull(shore.flatMap(([x, z]) => [[x, WET, z], [x, -0.03, z]])), WATER));
  // rushes along the house side, where the birds have not yet had them
  for (const i of [7, 7, 8, 8, 9]) {
    const h = 0.4 + c.rng() * 0.3;
    const d = 0.3 + c.rng() * 0.6; // how far from the water's edge toward the mud's
    g.add(mesh(cone(0.05, h, 3), tone(RUSH, 0.9 + c.rng() * 0.3), {
      x: shore[i][0] + (bank[i][0] - shore[i][0]) * d + (c.rng() - 0.5) * 0.3, y: h / 2 - 0.02, z: shore[i][1] + (bank[i][1] - shore[i][1]) * d,
    }));
  }
  // and feathers, on the mud and on the water
  for (const [x, z, y] of [[1.25, -0.05, 0.008], [1.3, 0.1, 0.008], [0.95, 0.34, 0.008], [0.1, 0.12, WET + 0.007], [-0.7, -0.14, WET + 0.007]]) {
    g.add(mesh(box(0.09, 0.012, 0.035), FEATHER, { x, y, z, ry: c.rng() * 6, shadow: false }));
  }
  return mud;
}

export default {
  id: 'goosewife',
  name: 'The goose-wife’s cottage',
  note: 'The goose-wife’s cottage — a muddy pond, a gaggle that hisses at every stranger, and her washing spread on the hedge.',
  build(c) {
    c.shell({ eave: 1.5, pitch: 50, walls: 'daub', wash: WASH.limeOld, frame: 'post', timber: TIMBER.old, roof: 'hip', thatch: 'straw' });
    c.door(...c.plot.door, { open: 0.55 });
    c.window('front', -1.35, { shutter: 'side', hinge: -1 });
    c.window('right', 0.6, { w: 0.32, h: 0.3 });
    c.smoke('gablet', 1);

    // mending: this year's straw let into the front slope, and raw daub by
    // the door where the rain off the eave has had the lime
    c.add(box(0.8, 0.05, 0.5), tone(THATCHES.new[1], 0.96), c.onRoof(1, -0.85, 1.5, 0.012));
    c.add(box(0.46, 0.05, 0.32), tone(THATCHES.new[1], 1.03), c.onRoof(1, -0.6, 1.17, 0.012));
    const patch = [[-0.34, 0.14], [0.3, 0.14], [0.34, 0.4], [0.12, 0.64], [-0.2, 0.56], [-0.37, 0.36]];
    c.onWall('front', -0.35).add(mesh(hull(patch.flatMap(([x, y]) => [[x, y, 0.004], [x, y, 0.02]])), tone(WASH.daub, 0.94)));

    // --- the pond, and the flock about it ---
    const mud = digPond(c, -1.87, 2.37);
    const onMud = (u, v, ry, above = 0) => c.at(u, v, ry, mud(u, v) + above);
    goose(onMud(-2.25, 2.44, 0.4, WET), WHITE, 'settled'); // two afloat
    goose(onMud(-1.57, 2.29, 2.9, WET), GREY, 'settled');
    goose(onMud(-3.0, 2.39, 0.1), WHITE, 'dabbling'); // one drinking at the far end
    goose(onMud(-0.77, 2.66, -0.3), WHITE, 'hissing'); // one that has seen a stranger in the lane
    c.beast(-0.75, 2.1, { kind: 'goose', colour: GREY, ry: 3.0, lift: mud(-0.75, 2.1) }); // and one of the kit's, on the trodden end
    c.beast(-2.95, 1.3, { kind: 'goose', ry: -1.75 }); // a straggler, coming round the end of the house

    // by the door: her crook for driving them, and a basket of their eggs
    c.tool(1.38, 1.96, { kind: 'crook', len: 1.45 });
    c.basket(-0.3, 1.98, { fill: 0xe8e2d0 });

    // washing on the hedge between the door and the lane
    c.washing(2.33, 2.55, { len: 1.9, h: 0.85, cloths: [0xddd5bf, 0x6b7f9a, 0xddd5bf] });

    // --- the night pen, under the eave at the end toward the green: wattle
    //     on three sides, the house's own wall the fourth ---
    c.fence([[2.44, -1.25], [3.26, -1.25], [3.26, 0.85], [2.98, 0.85]], { kind: 'wattle', h: 0.5 });
    c.hurdle(2.54, 1.17, { len: 0.6, h: 0.5, lean: 0.28, ry: Math.PI / 2 }); // what shuts it at dusk, leaned on the wall by day
    const pen = c.at(2.8, -0.2);
    pen.add(mesh(box(0.88, 0.16, 2.02), tone(STRAW, 0.9), { y: -0.04 })); // straw underfoot, wall to wattle
    pen.add(mesh(cyl(0.26, 0.33, 0.1, 7), tone(STRAW, 1.02), { x: 0.05, y: 0.08, z: -0.72 })); // a nest, and one bird sitting tight on it
    goose(c.at(2.85, -0.92, -Math.PI / 2, 0.12), WHITE, 'settled');
    c.beast(2.98, 0.05, { kind: 'goose', ry: 0.25, lift: 0.04 }); // one keeping watch over the wattle
    c.beast(2.84, 1.24, { kind: 'goose', ry: -1.0 }); // and one let out, on its way round the hedge to the pond
    c.midden(2.92, -2.25, { r: 0.42 }); // the pen's muck, thrown no further than it need be

    // --- the rest of a poor toft: brushwood for the fire, a strip of leeks and worts ---
    c.faggots(-2.9, -0.35, { n: 5 });
    c.bush(-2.82, -2.22, { r: 0.38 }); // elder, in the corner nobody digs
    c.bed(-2.2, -2.74, -0.5, -2.12, { crop: 'leeks' });
    c.bed(-0.1, -2.74, 1.3, -2.12, { crop: 'worts' });
    c.tool(-1.9, -1.94, { kind: 'spade', ry: Math.PI });
  },
};
