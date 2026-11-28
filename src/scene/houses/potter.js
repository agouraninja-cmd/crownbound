import * as THREE from 'three';
import { WASH, TIMBER, THATCHES, hull } from '../cottage.js';
import { span, cone } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, WOOD, WOOD_DARK, WOOD_PALE, STONE_DARK } from '../kit.js';

// The potter’s cottage: a low grey house under dark heather thatch, out at
// the village's edge where his smoke troubles nobody. What sets it apart is
// the kiln behind it — a long hump of clay with a stoke hole at each end and
// a vent in its crown, and it is burning: both holes glow, and a thread of
// smoke stands over it. Everything else in the yard is the same clay at some
// step of the road there: the pit it is dug from, full of rain; the heap put
// by to weather; boards of new pots drying grey; the red ones that came
// through the fire, on the bench by the door; and the heap of those that did not.

const TAU = Math.PI * 2;

const DRYING = 0xbbb09a; // a pot not yet fired: grey-buff, and paler as it dries
const FIRED = 0x9a5c3e; // ...and one that has been: red
const SCORCHED = 0x5c4a44; // one the fire caught: grey-purple, warped
const GLAZE = 0x6f7a3e; // the green glaze on a jug
const CLAY = 0x8c8372; // clay as it is dug: the pots' own grey, darker for the wet in it
const BAKED = 0xb0977a; // the kiln's skin: clay baked buff by a hundred firings
const REDDENED = 0x9a6b4d; // ...redder toward the fires
const BURNT = 0x80553f; // ...and burnt dark at the stoke holes themselves
const SMOKED = 0x3b312b; // ...and black where the smoke licks it
const SOOT = 0x18130f;
const GLOW = 0xdb5f1c; // the fire, seen down a stoke hole
const ASH = 0x8e897f;
const CHAR = 0x2a2522;

// ---------- the wares ----------

// Every vessel is one outline turned on the wheel: [how far out, how high], foot to rim.
const OUTLINES = {
  pot: [[0.1, 0], [0.175, 0.13], [0.11, 0.25], [0.135, 0.3]], // the cooking pot: round-bellied, its rim turned out
  jug: [[0.085, 0], [0.13, 0.15], [0.07, 0.34], [0.085, 0.44]], // the tall jug
  bowl: [[0.09, 0], [0.2, 0.12], [0.22, 0.17]], // a wide bowl, for milk
};
const SIDES = 6;
const TURNED = {};
for (const [kind, outline] of Object.entries(OUTLINES)) TURNED[kind] = new THREE.LatheGeometry(outline.map(([r, y]) => new THREE.Vector2(r, y)), SIDES);
const girth = (kind) => Math.max(...OUTLINES[kind].map(([r]) => r));

// One vessel in group g, standing at (x, y, z) unless `lie` tips it over.
// colour is its clay — grey while it dries, red once it has been through the fire.
function ware(g, kind, colour, { x = 0, y = 0, z = 0, turn = 0, size = 1, lie = 0 } = {}) {
  const outline = OUTLINES[kind];
  const [rim, tall] = outline[outline.length - 1];
  const pot = new THREE.Group();
  pot.add(mesh(TURNED[kind], colour));
  // the dark of its mouth, cut to the same six sides as its rim
  pot.add(mesh(new THREE.CircleGeometry(rim, SIDES, Math.PI / 6), tone(colour, kind === 'bowl' ? 0.6 : 0.45), { y: tall, rx: -Math.PI / 2, shadow: false }));
  // on its side its foot shows too
  if (lie) pot.add(mesh(new THREE.CircleGeometry(outline[0][0], SIDES, Math.PI / 6), tone(colour, 0.85), { rx: Math.PI / 2 }));
  if (kind === 'jug') pot.add(mesh(box(0.03, 0.2, 0.055), tone(colour, 0.9), { x: 0.122, y: 0.3, rz: 0.25 })); // its strap handle
  pot.position.set(x, y, z);
  pot.rotation.set(0, turn, lie);
  pot.scale.setScalar(size);
  g.add(pot);
}

// A sherd: a flat scrap of a broken pot, three-cornered or four, no two the same size.
const SCRAPS = [cyl(0.1, 0.1, 0.03, 3), box(0.16, 0.03, 0.12)];
function sherd(rng, colour, opts) {
  const m = mesh(SCRAPS[rng() < 0.6 ? 0 : 1], colour, opts);
  m.scale.set(0.7 + rng() * 0.8, 1, 0.7 + rng() * 0.6);
  return m;
}

// A ware-board: a plank on blocks, and along it a row of new pots set out to
// dry — the last set down still the wettest and darkest. It runs `len` along
// the group's x.
function wareBoard(c, u, v, ry, len, kinds) {
  const { rng } = c;
  const g = c.at(u, v, ry);
  const top = 0.3;
  g.add(mesh(box(len, 0.05, 0.38), tone(WOOD_PALE, 0.92 + rng() * 0.14), { y: top - 0.025 }));
  // the blocks stand deep in the ground, so no fall of it shows under one
  for (const x of [-len / 2 + 0.25, 0, len / 2 - 0.25]) g.add(mesh(box(0.2, 0.62, 0.3), tone(WOOD_DARK, 0.9 + rng() * 0.25), { x, y: top - 0.36, ry: (rng() - 0.5) * 0.3 }));
  let x = -len / 2 + 0.05;
  kinds.forEach((kind, i) => {
    const size = 0.92 + rng() * 0.16;
    const r = girth(kind) * size;
    x += r;
    ware(g, kind, tone(DRYING, 0.8 + (i / (kinds.length - 1)) * 0.24 + rng() * 0.04), { x, y: top, z: (rng() - 0.5) * 0.05, turn: rng() * TAU, size });
    x += r + 0.03 + rng() * 0.04;
  });
  // he walks round it, not through it
  const stops = Math.round(len / 0.55);
  for (let i = 0; i < stops; i++) {
    const d = ((i + 0.5) / stops - 0.5) * len;
    c.solid(u + d * Math.cos(ry), v - d * Math.sin(ry), 0.3);
  }
}

// ---------- heaps ----------

// Anything tipped out on the ground: r across its foot and h high, never
// quite round, its foot run down under the turf.
function mound(rng, r, h) {
  const pts = [[(rng() - 0.5) * r * 0.3, h, (rng() - 0.5) * r * 0.3]];
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * TAU;
    const k = 0.84 + rng() * 0.32;
    pts.push([Math.cos(a) * r * k, -0.12, Math.sin(a) * r * k]);
    pts.push([Math.cos(a + 0.45) * r * 0.52 * k, h * (0.5 + rng() * 0.3), Math.sin(a + 0.45) * r * 0.52 * k]);
  }
  return hull(pts);
}

// The waster heap: every pot the fire cracked, warped or burst, thrown out
// at the kiln's back — a few still whole enough to know, the rest sherds.
function wasters(c, u, v, r) {
  const { rng } = c;
  const g = c.at(u, v);
  const h = r * 0.5;
  g.add(mesh(mound(rng, r, h), 0x6b5145));
  const clays = [FIRED, FIRED, tone(FIRED, 1.1), SCORCHED, tone(SCORCHED, 1.3), GLAZE];
  for (let i = 0; i < 12; i++) {
    const a = rng() * TAU;
    const out = 0.3 + rng() * 0.9; // how far down its flank, or out past its foot
    const y = out < 1 ? h * (1 - out) * 0.85 + 0.035 : 0.02;
    g.add(sherd(rng, tone(clays[Math.floor(rng() * clays.length)], 0.82 + rng() * 0.26), {
      x: Math.cos(a) * r * out, y, z: Math.sin(a) * r * out, ry: rng() * TAU, rx: (rng() - 0.5) * 0.8, rz: (rng() - 0.5) * 0.8,
    }));
  }
  // each lies where it was thrown, its mouth outward: [what, its clay, where round the heap, how far out, how high, how far tipped]
  for (const [kind, colour, round, out, y, lie] of [
    ['pot', SCORCHED, 5.2, 0.2, h * 0.75, 0.9],
    ['pot', FIRED, 3.9, 0.55, h * 0.4, 1.3],
    ['jug', tone(FIRED, 0.9), 0.9, 0.5, h * 0.42, 1.2],
    ['bowl', tone(SCORCHED, 1.25), 2.3, 0.85, 0.09, 1.45],
  ]) ware(g, kind, colour, { x: Math.cos(round) * r * out, y, z: Math.sin(round) * r * out, turn: Math.PI - round, lie });
  c.solid(u, v, r * 0.7);
}

// ---------- the kiln ----------

// Where it stands and how it is turned; half its length and half its width;
// and its outline from under the turf to the vent, as [share of that girth,
// how high].
const KILN = { u: -1.3, v: -3.7, ry: -0.06, long: 1.02, wide: 0.77, sides: 12, shape: [[1.05, -0.35], [1.0, 0.52], [0.86, 0.86], [0.57, 1.07], [0.26, 1.16]] };

// two flat facets between four corners (given round the way that faces them out)
function facet(g, a, b, c, d, colour) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...d, ...b, ...c, ...d], 3));
  geo.computeVertexNormals();
  g.add(mesh(geo, colour));
}

function kiln(c) {
  const { rng } = c;
  const { u, v, ry, long, wide, sides, shape } = KILN;
  const g = c.at(u, v, ry);
  const put = (geo, colour, opts) => g.add(mesh(geo, colour, opts));
  const top = shape[shape.length - 1][1];

  // Twelve-sided, no side quite like the next, with a flat side square to
  // each end for a stoke hole to be built against.
  const swell = Array.from({ length: sides }, () => 0.94 + rng() * 0.12);
  const at = (j, ring) => {
    const a = ((j - 0.5) / sides) * TAU;
    const [share, y] = shape[ring];
    const k = share * swell[j % sides];
    return [Math.cos(a) * long * k, y, Math.sin(a) * wide * k];
  };
  // Its skin, facet by facet: buff where it only bakes, red toward the
  // fires, black over each stoke hole and all round the vent — and pale
  // where a crack was stopped with new clay after the last firing.
  const stopped = ['2 2', '8 1', '9 1', '9 2'];
  for (let band = 0; band < shape.length - 1; band++) {
    for (let j = 0; j < sides; j++) {
      const fromFire = Math.min(j % (sides / 2), sides / 2 - (j % (sides / 2))); // 0 at either end, 3 midway down a side
      let colour = stopped.includes(`${j} ${band}`) ? tone(CLAY, 1 + rng() * 0.08) : tone(BAKED, 0.9 + rng() * 0.2);
      if (band === 3) colour = tone(SMOKED, 0.9 + rng() * 0.5);
      else if (fromFire === 0) colour = band === 0 ? BURNT : tone(SMOKED, band === 1 ? 1 : 1.6);
      else if (fromFire === 1 && band < 2) colour = tone(REDDENED, 0.94 + rng() * 0.14);
      facet(g, at(j, band), at(j, band + 1), at(j + 1, band + 1), at(j + 1, band), colour);
    }
  }
  // the vent in its crown
  const crown = new THREE.BufferGeometry();
  crown.setAttribute('position', new THREE.Float32BufferAttribute(Array.from({ length: sides }, (_, j) => [0, top, 0, ...at(j + 1, 4), ...at(j, 4)]).flat(), 3));
  crown.computeVertexNormals();
  put(crown, SOOT);
  c.smokeAt(u, c.ground(u, v) + top + 0.12, v);

  for (const end of [-1, 1]) {
    // a stoke hole: a snout of clay built out from the end, a stone at each cheek and one laid across
    put(hull([-1, 1].flatMap((s) => [[end * 0.85, -0.35, s * 0.33], [end * 0.85, 0.66, s * 0.3], [end * 1.3, -0.35, s * 0.3], [end * 1.3, 0.52, s * 0.27]])), BURNT);
    put(box(0.02, 0.36, 0.36), SOOT, { x: end * 1.305, y: 0.16 });
    for (const s of [-1, 1]) put(box(0.13, 0.62, 0.13), tone(STONE_DARK, 0.6 + rng() * 0.12), { x: end * 1.335, y: 0.07, z: s * 0.245 });
    put(box(0.14, 0.12, 0.68), tone(STONE_DARK, 0.58), { x: end * 1.335, y: 0.44 });
    put(box(0.4, 0.02, 0.34), SMOKED, { x: end * 1.1, y: 0.6, rz: -end * 0.3 }); // the soot the flames have laid up its back
    c.ember(box(0.02, 0.15, 0.32), GLOW, { x: end * 1.32, y: 0.075, in: g });
    // ...and before it, the ash and cinders raked out
    const out = end * 1.7;
    const rakings = c.at(u + out * Math.cos(ry), v - out * Math.sin(ry), rng() * TAU);
    rakings.add(mesh(mound(rng, 0.45, 0.05), ASH, { shadow: false }));
    rakings.add(mesh(mound(rng, 0.26, 0.075), CHAR, { x: -end * 0.1, shadow: false }));
  }
  // the pole he stirs the fire with, left lying in the stoke hole that looks to the road
  span(g, [-2.1, 0.07, 0.26], [-1.5, 0.13, 0.05], 0.045, 0.045, WOOD);
  span(g, [-1.5, 0.13, 0.05], [-1.22, 0.15, -0.03], 0.05, 0.05, CHAR);

  for (const along of [-0.62, 0, 0.62]) c.solid(u + along * Math.cos(ry), v - along * Math.sin(ry), 0.8);
}

export default {
  id: 'potter',
  name: 'The potter’s cottage',
  note: 'The potter’s cottage — a clay kiln smoking behind it, boards of grey pots set out to dry, and a heap of all the fire cracked.',
  build(c) {
    const { hz, rng } = c;
    c.shell({ eave: 1.45, pitch: 50, walls: 'daub', wash: WASH.clay, frame: 'post', timber: TIMBER.old, roof: 'hip', thatch: 'heather', ridge: 'turf', moss: 2 });
    c.door(...c.plot.door, { open: 0.4 });
    c.window('front', -1.4, { shutter: 'propped', bars: 1 }); // light for the wheel, which stands within
    c.window('left', 0.72, { w: 0.36, h: 0.32 });
    c.smoke('gablet', 1);
    // mending: new heather worked in where the wind got under the old, and the back wall daubed afresh with his own clay
    const ragged = Array.from({ length: 7 }, (_, i) => [Math.cos((i / 7) * TAU) * (0.4 + rng() * 0.16), Math.sin((i / 7) * TAU) * (0.18 + rng() * 0.08)]);
    c.add(hull(ragged.flatMap(([x, z]) => [[x, -0.02, z], [x, 0.02, z]])), tone(THATCHES.heather[2], 1.16), c.onRoof(1, 1.05, 2.12, 0.02));
    c.add(box(0.95, 0.62, 0.016), tone(WASH.clay, 1.14), { x: 0, y: 0.72, z: -hz - 0.002 });

    kiln(c);
    wasters(c, 1.9, -3.75, 0.6);
    // faggots for the firing: the stack at the yard's end, and a few thrown down by the stoke hole
    c.faggots(3.25, -4.05, { ry: 0.08 });
    c.faggots(3.3, -3.0, { ry: 1.45 });
    c.faggots(1.2, -2.65, { n: 3, ry: 0.5 });
    // a spare hurdle against the back wall, to stand by a stoke hole when the wind gets up; nettles in the corner past it
    c.hurdle(1.4, -hz - 0.42, { len: 1.3, h: 0.9, lean: 0.3, ry: Math.PI });
    c.block(0.75, -hz - 0.45, 2.05, -hz);
    const nettles = c.at(2.4, -hz - 0.3);
    for (let i = 0; i < 6; i++) {
      const tall = 0.4 + rng() * 0.35;
      nettles.add(mesh(cone(0.07, tall, 4), tone(0x4c6a34, 0.85 + rng() * 0.3), { x: (rng() - 0.5) * 0.5, y: tall / 2 - 0.03, z: (rng() - 0.5) * 0.4 }));
    }

    // new pots, set out to dry: two boards in the sun at the house's end, one by the door
    wareBoard(c, -2.85, 0.1, Math.PI / 2, 2.4, ['pot', 'pot', 'pot', 'pot', 'pot', 'pot']);
    wareBoard(c, -3.3, 0.15, Math.PI / 2 + 0.04, 2.4, ['jug', 'pot', 'bowl', 'pot', 'jug', 'pot']);
    wareBoard(c, -1.75, 2.38, 0.03, 2.3, ['jug', 'jug', 'pot', 'bowl', 'pot', 'jug']);

    // ...and those that came through the fire, on the bench by the door
    const bench = c.bench(1.8, hz + 0.24, { len: 1.25 });
    ware(bench, 'jug', GLAZE, { x: -0.4, y: 0.45, turn: 2.2, size: 0.9 });
    ware(bench, 'pot', FIRED, { x: 0, y: 0.45, turn: 1, size: 0.84 });
    ware(bench, 'pot', tone(FIRED, 0.88), { x: 0.36, y: 0.45, turn: 4, size: 0.84 });

    // the way to his door, mended with what the waster heap gives: sherds trodden into the mud
    for (let i = 0; i < 9; i++) {
      const spot = c.at(0.4 + (rng() - 0.5), hz + 0.55 + rng() * 0.75, rng() * TAU);
      spot.add(sherd(rng, tone(FIRED, 0.6 + rng() * 0.4), { y: 0.02, shadow: false }));
    }

    // the clay: the pit it comes out of, standing full of rain, and what has been dug thrown up beside it to weather
    c.pond(3.15, 0.1, { r: 0.6, ry: Math.PI / 2 });
    c.solid(3.15, 0.1, 0.5);
    const clay = c.at(3.1, 1.3, rng() * TAU);
    clay.add(mesh(cone(0.7, 0.46, 9), CLAY, { y: 0.15 }));
    clay.add(mesh(cone(0.44, 0.34, 7), tone(CLAY, 0.82), { x: 0.36, y: 0.1, z: 0.2 })); // the last load out of the pit, still wet
    clay.add(mesh(cone(0.3, 0.22, 6), tone(CLAY, 1.1), { x: -0.38, y: 0.05, z: -0.3 }));
    c.solid(3.1, 1.3, 0.5);
    c.tool(2.95, 1.55, { kind: 'spade', lean: 0.12, ry: 2.4 });
  },
};
