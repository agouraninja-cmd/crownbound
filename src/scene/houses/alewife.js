import { WASH, TIMBER, THATCHES } from '../cottage.js';
import { span, cone, lump } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, WOOD, WOOD_DARK, WOOD_PALE, ROPE } from '../kit.js';

// The alewife’s house: a plain ochre cottage that turns alehouse whenever she
// has brewed. What sets it apart is the ale-stake — a long pole thrust out
// through the thatch over the door with a bush of green boughs tied on its
// end, which tells the village a fresh brew is ready. She serves through a
// hatch beside the door to a board and a bench outside; the mash vat and her
// tubs stand along the wall on the door's other hand.

const LEAVES = [0x35602c, 0x457230, 0x55833a]; // holly and ivy: dark, to stand out against straw and sky
const NETTLE = 0x4c6a34;
const WITHY = 0x76592f; // the split hazel every stave vessel is hooped with
const MASH = 0xc9b383; // malt steeping in hot water
const WORT = 0x7d5527; // what is run off it
const DRAFF = 0xa88b52; // the spent grain, thrown out for the hens
const CLAY = 0x9c5e3c;
const GLAZE = 0x6f7a3e; // the green glaze on the better jugs

// a jug, its handle turned toward `turn`, standing at (x, z) on a board whose top is at y
function jug(g, x, y, z, colour, turn = 0) {
  g.add(mesh(cyl(0.095, 0.065, 0.2, 6), colour, { x, y: y + 0.1, z }));
  g.add(mesh(cyl(0.06, 0.075, 0.12, 6), tone(colour, 0.9), { x, y: y + 0.26, z }));
  g.add(mesh(box(0.06, 0.16, 0.025), tone(colour, 0.8), { x: x + Math.cos(turn) * 0.11, y: y + 0.2, z: z - Math.sin(turn) * 0.11, ry: turn }));
}

// a turned wooden bowl, the dark of its hollow on top
function bowl(g, x, y, z) {
  g.add(mesh(cyl(0.1, 0.06, 0.06, 6), WOOD_PALE, { x, y: y + 0.03, z }));
  g.add(mesh(cyl(0.08, 0.08, 0.008, 6), WORT, { x, y: y + 0.062, z }));
}

export default {
  id: 'alewife',
  name: 'The alewife’s house',
  note: 'The alewife’s house — a green bush on a pole over the door says a fresh brew is ready; jugs and bowls wait on the board outside.',
  build(c) {
    const front = c.hz; // the front wall's face, and the back's: the yard is set out from them
    const back = -c.hz;
    const [, doorAt] = c.plot.door;

    c.shell({ eave: 1.7, pitch: 50, walls: 'daub', wash: WASH.ochre, frame: 'box', timber: TIMBER.old, roof: 'gable', thatch: 'straw' });
    c.door(...c.plot.door, { open: 1 }); // it stands open while there is ale to sell
    c.door('back', doorAt);
    c.window('right', 0, { shutter: 'side' });
    c.smoke('hole', -1.1, { side: -1 }); // the hearth's smoke leaves by the back slope, clear of the bush
    // a panel of the gable daubed afresh and not yet washed to match
    c.add(box(0.016, 0.52, 0.62), WASH.daub, { x: c.hx + 0.002, y: 0.72, z: -0.95 });

    // The ale-stake: a long pole lashed to a rafter within and thrust out
    // through the thatch over the door, slanting up over the lane.
    const slant = 0.55; // radians above level
    const reach = 2.04; // from the thatch to its tip, which stops short of the yard's edge
    const hole = c.onRoof(1, doorAt, 2.15); // where it comes out, low on the front slope
    const along = (d) => ({ x: doorAt, y: hole.y + Math.sin(slant) * d, z: hole.z + Math.cos(slant) * d });
    c.add(cyl(0.035, 0.06, reach + 0.5, 6), WOOD, { ...along(reach / 2 - 0.25), rx: Math.PI / 2 - slant });
    // new straw stuffed in round it where it pierces the roof, a short course over a longer
    const fresh = THATCHES.new[0];
    c.add(box(0.5, 0.04, 0.3), fresh, c.onRoof(1, doorAt, 2.1, 0.03));
    c.add(box(0.74, 0.04, 0.3), fresh, c.onRoof(1, doorAt + 0.06, 2.38, 0.015));
    // the bush: green boughs bound by their butts to the pole, a little short
    // of its end, and hanging from it in a shaggy bunch
    const knot = along(reach - 0.22);
    c.add(cyl(0.065, 0.065, 0.16, 6), ROPE, { ...knot, rx: Math.PI / 2 - slant });
    c.add(cyl(0.05, 0.09, 0.24, 5), WOOD_DARK, { x: knot.x, y: knot.y - 0.14, z: knot.z }); // the bound butts
    c.add(lump(0.34), LEAVES[0], { x: knot.x, y: knot.y - 0.52, z: knot.z });
    for (let i = 0; i < 6; i++) {
      const a = i * 2.4; // round and down the bunch, no two alike
      c.add(lump(0.21 + c.rng() * 0.06), tone(LEAVES[i % 3], 0.92 + c.rng() * 0.16), {
        x: knot.x + Math.cos(a) * 0.2, y: knot.y - 0.3 - i * 0.1, z: knot.z + Math.sin(a) * 0.2, ry: c.rng() * 6.28,
      });
    }
    // ...their leafy ends straggling down below it
    for (let i = 0; i < 4; i++) {
      const a = i * 1.57 + 0.5;
      c.add(cone(0.12, 0.36 + c.rng() * 0.1, 5), tone(LEAVES[2], 0.95 + c.rng() * 0.2), {
        x: knot.x + Math.cos(a) * 0.14, y: knot.y - 1.0, z: knot.z + Math.sin(a) * 0.14, ry: -a, rz: Math.PI + 0.45,
      });
    }

    // the serving hatch beside the door: lower than a window, its shutter
    // propped open and a shelf under it to set the jugs on
    const sill = 1.0;
    const hatch = c.window('front', -0.75, { w: 0.6, h: 0.48, y: sill + 0.24, shutter: 'propped', bars: 0 });
    hatch.add(mesh(box(0.8, 0.04, 0.32), WOOD_PALE, { y: sill - 0.07, z: 0.17 }));
    for (const s of [-1, 1]) span(hatch, [s * 0.3, sill - 0.42, 0.03], [s * 0.3, sill - 0.1, 0.28], 0.04, 0.04, WOOD_DARK);
    jug(hatch, -0.16, sill - 0.05, 0.22, GLAZE, 2.4);
    c.block(-1.15, front, -0.35, front + 0.33); // shelf and shutter stand out at a man's chest and brow

    // the drinking side, toward the green: a bench against the wall, a board
    // on trestles laid with jugs and bowls, a stool at its end
    c.bench(2.0, front + 0.33, { len: 1.2 });
    c.block(1.4, front, 2.6, front + 0.48); // he walks round the bench, not through it
    const board = c.trestle(2.15, front + 1.1, { len: 1.3, wide: 0.6, ry: 0.06 });
    const top = 0.745; // the board's upper face, in the trestle's own frame
    jug(board, -0.38, top, 0.06, CLAY, 0.6);
    jug(board, 0.2, top, -0.13, GLAZE, -2.2);
    bowl(board, -0.1, top, 0.17);
    bowl(board, -0.5, top, -0.16);
    bowl(board, 0.48, top, 0.12);
    bowl(board, 0.4, top, -0.18);
    c.stool(2.98, front + 1.0);

    // the brewing side: the mash vat on two baulks that keep its foot dry, the
    // paddle standing in the mash
    const vat = c.at(-2.55, front + 0.78, 0.2);
    const put = (geo, colour, opts) => vat.add(mesh(geo, colour, opts));
    for (const s of [-1, 1]) put(box(1.2, 0.14, 0.14), WOOD_DARK, { y: 0.02, z: s * 0.28 });
    put(cyl(0.62, 0.5, 0.74, 10), tone(WOOD, 0.95), { y: 0.46 });
    for (const [y, r] of [[0.24, 0.545], [0.5, 0.59], [0.74, 0.625]]) put(cyl(r, r, 0.06, 10), WITHY, { y });
    put(cyl(0.585, 0.585, 0.012, 10), WOOD_DARK, { y: 0.836 }); // the shade inside the staves
    put(cyl(0.52, 0.52, 0.012, 10), MASH, { y: 0.846 });
    span(vat, [0.1, 0.5, 0.05], [0.34, 1.6, -0.08], 0.06, 0.06, WOOD_PALE);
    put(box(0.26, 0.05, 0.05), WOOD_PALE, { x: 0.34, y: 1.6, z: -0.08 });
    c.solid(-2.55, front + 0.78, 0.64);
    // her tubs: one of water, one of wort set to cool (laid on a dry tub,
    // brim-full as the kit lays its water); and the pail she fills them with
    c.tub(-1.5, front + 0.62, { r: 0.38 });
    const cooler = c.tub(-1.95, front + 1.36, { r: 0.3, h: 0.3, water: false });
    cooler.add(mesh(cyl(0.276, 0.276, 0.02, 10), WORT, { y: 0.3 }));
    c.bucket(-3.15, front + 0.35);
    // the draff, and the hens that live on it
    c.at(-3.1, front + 1.4).add(mesh(cone(0.25, 0.18, 6), DRAFF, { y: 0.07 }));
    c.beast(-2.7, front + 1.42, { kind: 'hen', colour: 0x8a5a34, ry: 3.1 });
    c.beast(-3.1, front + 0.98, { kind: 'hen', colour: 0x7a4e2c, ry: -1.4 });
    c.beast(1.75, front + 1.57, { kind: 'hen', colour: 0xb08a5a, ry: 0.2 });

    // out the back: the midden, the besom by the door, a spare hurdle, nettles in the corner
    c.midden(2.2, back - 0.45, { r: 0.4 });
    c.tool(1.25, back - 0.33, { kind: 'besom', ry: Math.PI });
    c.hurdle(-1.2, back - 0.42, { len: 1.3, h: 0.9, lean: 0.3, ry: Math.PI });
    const nettles = c.at(-2.95, back - 0.4);
    for (let i = 0; i < 7; i++) {
      const tall = 0.4 + c.rng() * 0.35;
      nettles.add(mesh(cone(0.07, tall, 4), tone(NETTLE, 0.85 + c.rng() * 0.3), { x: (c.rng() - 0.5) * 0.5, y: tall / 2 - 0.03, z: (c.rng() - 0.5) * 0.5 }));
    }
  },
};
