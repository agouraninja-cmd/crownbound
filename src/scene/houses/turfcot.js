import * as THREE from 'three';
import { TIMBER, hull } from '../cottage.js';
import { span } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { cyl, WOOD_DARK, ROPE } from '../kit.js';

// The turf hut: the poorest dwelling in the village, cut out of the ground it
// stands on. Sods stacked barely shoulder high, more sods for a roof, and
// both long since grown together: the earth banked against the weather sides
// has taken the grass, so from behind it is a green hummock, and only the
// front shows a wall and a hole to creep in by. A hurdle is the door, and the
// doorway is the window. Outside, all one man owns: a spade, a flail, three
// hens, a goat on her tether and a row of beans.

const TAU = Math.PI * 2;
const OVER = 0.3; // how far the eaves overhang, down the slope
const SWARD = 0x5c7a3a; // the grass that has taken the banks
const GRASS = 0x9ab85a; // long grass, standing in the light
const SEEDED = 0xc4b86a; // …and bleached, where it has gone to seed
const NEW_SOD = 0x6a9440; // cut from the meadow this year
const TRODDEN = 0x7d6549;
const HENS = [0xb08a5a, 0x4a3a30, 0x8a5a34]; // buff, sooty, brown
// turf the smoke soaks out through: dulled at the edge of the stain, dead within, black at the ridge
const SMOKED = [0x66703a, 0x4d4a2c, 0x322d1c];

// a tussock rooted at (x, y, z) in the house's frame: long blades leaning out of one crown
function tussock(c, x, y, z, tall) {
  const { rng } = c;
  const blades = 4 + Math.floor(rng() * 3);
  for (let i = 0; i < blades; i++) {
    const a = rng() * TAU;
    const lean = 0.1 + rng() * 0.5;
    const h = tall * (0.6 + rng() * 0.6);
    // open underneath: nobody sees a blade's foot
    c.add(new THREE.ConeGeometry(0.05, h, 3, 1, true), tone(rng() < 0.25 ? SEEDED : GRASS, 0.86 + rng() * 0.26), {
      x: x + Math.sin(lean) * Math.cos(a) * (h / 2), y: y + Math.cos(lean) * (h / 2), z: z + Math.sin(lean) * Math.sin(a) * (h / 2),
      rx: lean * Math.sin(a), rz: -lean * Math.cos(a),
    });
  }
}

// Earth and sods banked against the walls and long since grown over: it is
// this that makes a hummock of the hut. `ring` goes round the house from one
// door jamb to the other, each stop [u, v, the way out (two numbers), how
// high the bank stands against the wall there, how far out its toe lies].
function bank(c, ring) {
  const { rng } = c;
  const section = ([u, v, nu, nv, top, out]) => {
    const toe = [u + nu * out, v + nv * out];
    const foot = c.ground(...toe);
    const at = (k, up) => [u + nu * out * k, foot + (top - foot) * up, v + nv * out * k];
    // from deep inside the wall, out under the eave to a shoulder the roof's own sods rest on,
    // then steeply down to a toe sunk in the ground — no two stretches slumped quite alike
    return [
      [u - nu * 0.06, -0.7, v - nv * 0.06], [u - nu * 0.06, top, v - nv * 0.06],
      at(0.38 + rng() * 0.08, 0.92 + rng() * 0.04), at(0.72 + rng() * 0.08, 0.46 + rng() * 0.12), [toe[0], foot - 0.05, toe[1]],
    ];
  };
  const sections = ring.map(section);
  // one sward: each stretch barely its own green (as the ground's facets are), or the bank would read as staves
  for (let i = 0; i < sections.length - 1; i++) c.add(hull([...sections[i], ...sections[i + 1]]), tone(SWARD, 0.96 + rng() * 0.08));
  // long grass on it and about its foot — but none leaning out over the yard's edge
  const [u0, v0, u1, v1] = c.plot.yard;
  const room = ([u, , v]) => u > u0 + 0.35 && u < u1 - 0.35 && v > v0 + 0.35 && v < v1 - 0.35;
  for (const [, , shoulder, flank, toe] of sections) {
    if (rng() < 0.45) tussock(c, shoulder[0], shoulder[1] - 0.04, shoulder[2], 0.28 + rng() * 0.16);
    if (rng() < 0.3) tussock(c, flank[0], flank[1] - 0.04, flank[2], 0.26 + rng() * 0.14);
    if (rng() < 0.6 && room(toe)) tussock(c, ...toe, 0.3 + rng() * 0.2);
  }
}

export default {
  id: 'turfcot',
  name: 'The turf hut',
  note: 'The turf hut — sods for walls, sods for a roof and a hurdle for a door: a green hummock with a goat tethered before it.',
  build(c) {
    const { rng, hx, hz } = c;
    // the only timber in it is the doorposts, and they are old
    c.shell({ eave: 1.3, pitch: 40, walls: 'turf', frame: 'none', timber: TIMBER.old, roof: 'hip', thatch: 'turf', ridge: 'none', over: OVER });
    const [, door] = c.plot.door;
    // no window: by day the hurdle keeps the hens out and the doorway lets the light in; after dark a turf fire glows more than it burns
    c.door(...c.plot.door, { kind: 'hurdle', step: false, lit: 0.5 });
    c.smoke('seep', 0);

    // ---------- the hummock ----------
    // the bank swung round a corner of the walls: `quarter` 0 turns from the +u end to the front, 1 from the front to the -u end, and so on round
    const round = (u, v, quarter, tops, out) => tops.map((top, i) => {
      const a = (quarter + (i + 1) / (tops.length + 1)) * (Math.PI / 2);
      return [u, v, Math.cos(a), Math.sin(a), top, out];
    });
    const eaves = c.eave + 0.08; // banked right up into the thatch: the roof's own sods bed down on it, and no wall shows
    bank(c, [
      // low along the front, where the wall must show, and climbing to the eaves as it nears the corner
      [door - 0.62, hz, 0, 1, 0.2, 0.26], [-1.2, hz, 0, 1, 0.32, 0.34], [-1.68, hz, 0, 1, 0.78, 0.6],
      ...round(-hx, hz, 1, [1.06, eaves, eaves], 0.9),
      // kept narrow at the ends: a boulder lies off one and a pine stands off the other, and a man must pass between
      [-hx, 0.6, -1, 0, eaves, 0.8], [-hx, -0.5, -1, 0, eaves, 0.86],
      ...round(-hx, -hz, 2, [eaves, eaves, eaves], 0.98),
      // behind, where the yard gives it room, it has spread — and one stretch has slumped and shows the sods of the wall above it
      [-1.4, -hz, 0, -1, eaves, 1.1], [-0.5, -hz, 0, -1, eaves, 1.22], [0.45, -hz, 0, -1, 1.02, 1.26], [1.3, -hz, 0, -1, 0.97, 1.16],
      ...round(hx, -hz, 3, [1.04, eaves, eaves], 0.98),
      [hx, -0.55, 1, 0, eaves, 0.86], [hx, 0.6, 1, 0, eaves, 0.8],
      ...round(hx, hz, 0, [eaves, eaves, 1.06], 0.9),
      [1.7, hz, 0, 1, 0.78, 0.6], [1.3, hz, 0, 1, 0.32, 0.34], [door + 0.62, hz, 0, 1, 0.2, 0.26],
    ]);
    // a man would wade into the banks otherwise
    c.block(-hx - 0.45, -hz - 0.8, hx + 0.45, -hz);
    c.block(-hx - 0.45, -hz, -hx, hz);
    c.block(hx, -hz, hx + 0.45, hz);
    c.block(-hx - 0.45, hz, -1.6, hz + 0.35);
    c.block(1.6, hz, hx + 0.45, hz + 0.35);

    // the way in: no doorstep, only the earth trodden up to the sill
    const sill = (du, dv) => [door + du, 0.12, hz + dv];
    const apron = (du, dv) => [door + du, c.ground(door + du, hz + dv) - 0.04, hz + dv];
    c.add(hull([
      [door - 0.62, -0.7, hz - 0.05], [door + 0.62, -0.7, hz - 0.05],
      sill(-0.62, -0.05), sill(0.62, -0.05), sill(-0.62, 0.17), sill(0.62, 0.17),
      apron(-0.8, 0.7), apron(-0.3, 0.95), apron(0.45, 0.9), apron(0.85, 0.65),
    ]), TRODDEN);
    // grass still growing from the seams between the sods of the wall
    for (const [u, y] of [[-0.55, 0.68], [-1.5, 1.0], [1.2, 0.66], [1.05, 0.98], [-0.95, 0.34]]) tussock(c, u, y, hz + 0.04, 0.2);

    // ---------- the roof, growing ----------
    const cos = Math.cos(c.pitch);
    const ridgeHalf = hx - hz; // a hipped roof's ridge: the house's length less its width
    const run = hz / cos + OVER; // ridge to eave, down the slope
    // the turf's surface above a spot on the plan: a hipped roof falls alike on all four sides
    const roofY = (x, z) => c.onRoof(1, 0, Math.max(Math.abs(z), Math.abs(x) - ridgeHalf, 0) / cos).y;
    // A ragged flat piece of another colour lying `above` a slope (1 the
    // front, -1 the back): `outline` is its edge as [along, down] points, and
    // must bulge all the way round — it is a hull.
    const patch = (side, outline, colour, above) => {
      const mid = outline.reduce((sum, [, down]) => sum + down, 0) / outline.length;
      const pts = outline.flatMap(([along, down]) => [-0.012, 0.012].map((y) => [along, y, side * (down - mid)]));
      c.add(hull(pts), tone(colour, 0.95 + rng() * 0.1), c.onRoof(side, 0, mid, above));
    };

    // the crown, where the smoke soaks out: the stain is no neat square but a ragged blot, laid over it in three depths of dying
    patch(1, [[-0.56, -0.03], [0.56, -0.03], [0.8, 0.33], [0.7, 0.7], [0.12, 0.76], [-0.6, 0.73], [-0.8, 0.38]], SMOKED[0], 0.04);
    patch(1, [[-0.38, -0.03], [0.42, -0.03], [0.58, 0.3], [0.4, 0.56], [-0.1, 0.6], [-0.5, 0.42]], SMOKED[1], 0.065);
    patch(1, [[-0.2, -0.03], [0.26, -0.03], [0.3, 0.2], [0.08, 0.34], [-0.22, 0.24]], SMOKED[2], 0.09);
    patch(-1, [[-0.5, -0.03], [0.5, -0.03], [0.66, 0.26], [0.3, 0.5], [-0.3, 0.46], [-0.62, 0.2]], SMOKED[0], 0.04);
    patch(-1, [[-0.3, -0.03], [0.34, -0.03], [0.36, 0.2], [0, 0.3], [-0.3, 0.16]], SMOKED[1], 0.065);
    // where sods slid off last winter, three new ones cut from the meadow
    patch(1, [[-1.6, 1.56], [-1.06, 1.52], [-1.02, 1.94], [-1.58, 1.98]], NEW_SOD, 0.03);
    patch(1, [[-1.0, 1.5], [-0.42, 1.56], [-0.46, 1.98], [-1.0, 1.95]], NEW_SOD, 0.03);
    patch(1, [[-1.36, 1.99], [-0.72, 1.97], [-0.7, 2.21], [-1.34, 2.23]], NEW_SOD, 0.03);

    // long grass all over it, but not where the smoke comes through
    for (let i = 0; i < 36; i++) {
      const x = (rng() - 0.5) * 2 * (ridgeHalf + cos * run - 0.12);
      const z = (rng() - 0.5) * 2 * (cos * run - 0.12);
      if (Math.abs(x) < 0.85 && Math.abs(z) < 0.62) continue;
      tussock(c, x, roofY(x, z) - 0.06, z, 0.3 + rng() * 0.2); // rooted well in: the upper courses stand a little short at the hips
    }

    // ---------- all he owns ----------
    c.tool(-0.72, hz + 0.34, { kind: 'spade', ry: 0.1 });
    c.tool(-1.12, hz + 0.36, { kind: 'flail', ry: -0.12, lean: 0.24 });
    c.bed(-3.1, 2.44, -1.2, 2.88, { crop: 'beans', rows: 1 });
    // the goat, at the end of her tether, with her nose to the grass of the bank
    const peg = [1.45, 2.84];
    const goat = [2.36, 2.62];
    c.beast(...goat, { kind: 'goat', ry: Math.PI / 2 });
    c.at(...peg).add(mesh(cyl(0.03, 0.04, 0.46, 5), WOOD_DARK, { y: 0.12, rz: 0.2 }));
    span(c.g, [peg[0] - 0.04, c.ground(...peg) + 0.28, peg[1]], [goat[0] - 0.08, c.ground(...goat) + 0.47, goat[1] - 0.24], 0.02, 0.02, ROPE, false);
    c.beast(-0.75, 2.5, { kind: 'hen', colour: HENS[0], ry: 2.4 });
    c.beast(0.95, -2.78, { kind: 'hen', colour: HENS[1], ry: 1.1 }); // scratching where the bank has slumped
    c.beast(1.3, 1.22, { kind: 'hen', colour: HENS[2], ry: 0.2, lift: roofY(1.3, 1.22) - c.ground(1.3, 1.22) - 0.02 }); // the roof is low enough to hop up on
  },
};
