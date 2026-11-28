import { WASH, hull } from '../cottage.js';
import { ball, cone, lump } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, WOOD_PALE, ROPE } from '../kit.js';

// The cottar's cot: the poorest holding in the village and the only one of
// cob — earth walls with rounded corners under a hipped roof of bracken and
// ling. He has no strip in the fields, so the whole toft is his garth: leeks,
// kale on its stalks and a row of beans behind a low wattle fence, the hens
// kept to the other side of the door, and the onion crop strung up to dry
// under the eaves.

const TAU = Math.PI * 2;
const ONION = [0xd9a03a, 0xc8862e]; // gold skins, some nearer russet
const GARLIC = [0xebe4d0, 0xdcd3ba];
const LEEK = 0x6fa08a; // blue-green
const KALE = 0x638556;
const STALK = 0xa3aa84;
const BRACKEN = 0x8a5a33; // cut and dried, fox-red
const MOSS = 0x55663a;
const NETTLE = 0x4a6b32;
const HENS = [0x8a5a34, 0x7a4a2a, 0x9a6a3e, 0x6e4a30]; // brown, every one
const COCK = 0x8a4424;

// A rope of onions or a plait of garlic hanging at x on a wall, from `top`
// down: the bulbs set left and right of a cord plaited from their own dry tops.
function rope(wall, rng, x, top, kind) {
  const garlic = kind === 'garlic';
  const r = garlic ? 0.052 : 0.07;
  const n = garlic ? 6 : 5;
  const drop = r * 1.4;
  const cord = n * drop + 0.16; // a loop above the first bulb, a tail below the last
  const colours = garlic ? GARLIC : ONION;
  wall.add(mesh(box(0.022, cord, 0.022), ROPE, { x, y: top - cord / 2, z: 0.07, shadow: false }));
  for (let i = 0; i < n; i++) {
    // a bulb is a top: broad in the middle, drawn to a point at neck and root
    wall.add(mesh(ball(r, garlic ? 4 : 5, 2), tone(colours[rng() < 0.7 ? 0 : 1], 0.9 + rng() * 0.2), {
      x: x + (i % 2 ? 1 : -1) * r * 0.7, y: top - 0.14 - i * drop, z: 0.09 + (rng() - 0.5) * 0.024, rx: (rng() - 0.5) * 0.9, ry: rng() * TAU, rz: (rng() - 0.5) * 0.9,
    }));
  }
}

// A pole pegged along a wall under the eaves and hung with the crop: `kinds`
// says what each rope is, in order, between `from` and `to` along the wall.
function dryingPole(c, wall, from, to, kinds) {
  const g = c.onWall(wall, 0);
  const y = c.eave - 0.09;
  g.add(mesh(box(to - from, 0.035, 0.035), WOOD_PALE, { x: (from + to) / 2, y, z: 0.035, rz: (c.rng() - 0.5) * 0.03 }));
  const room = (to - from - 0.24) / Math.max(1, kinds.length - 1);
  kinds.forEach((kind, i) => rope(g, c.rng, from + 0.12 + i * room, y - 0.02, kind));
}

// Leeks down a dug bed (which runs along x), a row at each z given: every
// leek a fan of two blue-green flags.
function leeks(bed, rng, length, rows) {
  const n = Math.floor(length / 0.25);
  for (const z of rows) {
    for (let i = 0; i < n; i++) {
      if (rng() < 0.08) continue; // a gap where one failed
      const x = ((i + 0.5) / n - 0.5) * length + (rng() - 0.5) * 0.04;
      const green = tone(LEEK, 0.9 + rng() * 0.2);
      for (const s of [-1, 1]) {
        const tall = 0.4 + rng() * 0.12;
        const flag = mesh(cone(0.06, tall, 3), green, { x: x + s * 0.045, y: 0.13 + tall / 2, z, ry: rng(), rz: -s * (0.22 + rng() * 0.16) });
        flag.scale.z = 0.4;
        bed.add(flag);
      }
    }
  }
}

// Kale on its stalk, n of them down the middle of a dug bed: the low leaves
// are picked for the pot week by week, so each plant ends as a bare stem with
// its tuft at the top.
function kale(bed, rng, from, pace, n) {
  for (let i = 0; i < n; i++) {
    const x = from + i * pace + (rng() - 0.5) * 0.05;
    const z = (rng() - 0.5) * 0.06;
    const tall = 0.3 + rng() * 0.2;
    const green = tone(KALE, 0.9 + rng() * 0.24);
    bed.add(mesh(cone(0.03, tall + 0.06, 3), STALK, { x, y: 0.15 + tall / 2, z }));
    const turn = rng() * TAU;
    for (let k = 0; k < 4; k++) {
      const a = turn + (k / 4) * TAU;
      // each leaf's stem end at the stalk, its broad end out: some lifted, some hanging
      bed.add(mesh(cone(0.085, 0.27, 3), k % 2 ? green : tone(green, 0.84), {
        x: x + Math.cos(a) * 0.11, y: 0.18 + tall, z: z + Math.sin(a) * 0.11, ry: -a, rz: 1.75 + rng() * 0.5,
      }));
    }
  }
}

// the pot-herbs by the door: low mounds of sage, hyssop and tansy, two of them in flower
function herbs(bed, rng, x) {
  const greens = [0x7f9a7a, 0x6f7a3e, 0x5f8a5a];
  const flowers = [0xa184cc, 0xe9c93a];
  for (let i = 0; i < 3; i++) {
    const r = 0.1 + rng() * 0.06;
    const px = x + (i - 1) * 0.17 + (rng() - 0.5) * 0.04;
    const pz = i % 2 ? 0.07 : -0.05;
    const mound = mesh(lump(r), tone(greens[i], 0.9 + rng() * 0.2), { x: px, y: 0.15 + r * 0.5, z: pz, ry: rng() * TAU });
    mound.scale.y = 0.8;
    bed.add(mound);
    if (i < 2) bed.add(mesh(box(0.045, 0.045, 0.045), flowers[i], { x: px + (rng() - 0.5) * 0.08, y: 0.15 + r * 1.25, z: pz + (rng() - 0.5) * 0.08, shadow: false }));
  }
}

// nettles, where the ground is rich and nobody digs
function nettles(c, u, v) {
  const g = c.at(u, v);
  for (let i = 0; i < 5; i++) {
    const tall = 0.35 + c.rng() * 0.3;
    g.add(mesh(cone(0.07, tall, 3), tone(NETTLE, 0.85 + c.rng() * 0.3), {
      x: (c.rng() - 0.5) * 0.7, y: tall / 2 - 0.03, z: (c.rng() - 0.5) * 0.5, ry: c.rng() * TAU, rz: (c.rng() - 0.5) * 0.3,
    }));
  }
}

// A heap of cut bracken, for his bed, his hens' litter and the next hole in
// the roof: a low mound scaled over with the broad three-cornered fronds, a
// ring of them on its crown and another down its flanks.
function bracken(c, u, v, ry) {
  const { rng } = c;
  const g = c.at(u, v, ry);
  const pts = [[0.04, 0.44, 0]];
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * TAU;
    const r = 0.85 + rng() * 0.3;
    pts.push([Math.cos(a) * 0.56 * r, -0.1, Math.sin(a) * 0.38 * r], [Math.cos(a) * 0.38 * r, 0.24 + rng() * 0.1, Math.sin(a) * 0.25 * r]);
  }
  g.add(mesh(hull(pts), tone(BRACKEN, 0.84)));
  // [how many, how far out, how high, how steeply they lie]
  for (const [n, out, y, lie] of [[4, 0.2, 0.39, 1.95], [4, 0.47, 0.13, 2.65]]) {
    for (let i = 0; i < n; i++) {
      const a = ((i + rng() * 0.6) / n) * TAU;
      const frond = mesh(cone(0.19, 0.42, 3), tone(rng() < 0.2 ? 0x74783c : BRACKEN, 0.88 + rng() * 0.4), {
        x: Math.cos(a) * out, y: y + rng() * 0.03, z: Math.sin(a) * out * 0.68, ry: -a, rz: -lie - (rng() - 0.5) * 0.2,
      });
      frond.scale.x = 0.16; // a frond is flat
      g.add(frond);
    }
  }
  c.solid(u, v, 0.4);
}

export default {
  id: 'cottar',
  name: 'The cottar’s cot',
  note: 'The cottar’s cot — walls of earth under a bracken roof, onions strung beneath the eaves, and every foot of the yard dug for leeks and kale.',
  build(c) {
    const { rng } = c;
    // eaves 0.37 deep and no deeper: the yard is only 0.4 wide at the +u end, and the hip's fringe must stay inside it
    c.shell({ eave: 1.45, pitch: 50, walls: 'cob', wash: WASH.earth, roof: 'hip', thatch: 'heather', ridge: 'turf', over: 0.37 });
    c.door(...c.plot.door, { open: 0.4 });
    c.window('right', 0.1);
    c.smoke('seep', 0.1);
    // a hole in the thatch mended with this year's bracken, not yet weathered dark
    c.add(box(0.8, 0.05, 0.55), tone(BRACKEN, 1.05), { ...c.onRoof(1, 0.75, 1.5, 0.012), ry: 0.1 });
    c.add(box(0.42, 0.05, 0.32), tone(BRACKEN, 0.92), { ...c.onRoof(1, 0.42, 1.62, 0.02), ry: -0.2 });
    // moss low on the slope the sun leaves early
    c.add(box(0.5, 0.03, 0.3), tone(MOSS, 0.95), { ...c.onRoof(1, -1.2, 2.4, 0.012), ry: 0.25, shadow: false });
    c.add(box(0.3, 0.03, 0.26), tone(MOSS, 1.1), { ...c.onRoof(1, -0.9, 2.3, 0.02), ry: -0.3, shadow: false });
    // where the cob washed out one winter, made good with fresh earth
    const mend = c.onWall('back', 0.9);
    mend.add(mesh(box(0.6, 0.4, 0.02), tone(WASH.earth, 1.13), { y: 0.84, rz: 0.06 }));
    mend.add(mesh(box(0.34, 0.3, 0.04), tone(WASH.earth, 1.06), { x: 0.26, y: 0.74, rz: -0.12 }));

    // the onion crop, drying where the rain cannot reach it
    dryingPole(c, 'front', -1.9, -1.04, ['onion', 'garlic', 'onion']);
    dryingPole(c, 'front', 0.38, 1.5, ['onion', 'garlic', 'onion', 'onion']);

    // ---------- the garth: three sides of the house, and no hen let into it ----------
    c.fence([[-1.3, 3.1], [-3.27, 3.1], [-3.27, -2.88], [-1.05, -2.88], [-1.05, -1.72]], { h: 0.5 });
    c.hurdle(-1.32, 2.4, { len: 1.38, h: 0.46, ry: Math.PI / 2 + 0.06 }); // the way in: a hurdle from the corner stake to the wall
    // before the door: kale along the wall with the pot-herbs at its near end, then the leeks
    const front = c.bed(-3.15, 1.98, -1.45, 2.3, { crop: 'bare', rows: 1 });
    kale(front, rng, -0.66, 0.3, 4);
    herbs(front, rng, 0.56);
    leeks(c.bed(-3.15, 2.4, -1.45, 3.0, { crop: 'bare', rows: 2 }), rng, 1.5, [-0.15, 0.15]);
    // beans up the morning side, in two beds so each lies to the slope
    c.bed(-3.17, -1.8, -2.72, -0.1, { crop: 'beans' });
    c.bed(-3.17, 0.02, -2.72, 1.88, { crop: 'beans' });
    // behind, in the sun: more kale, and the onion bed lifted and dug over
    kale(c.bed(-3.15, -2.74, -1.2, -2.4, { crop: 'bare', rows: 1 }), rng, -0.76, 0.31, 6);
    c.bed(-3.15, -2.3, -1.2, -1.98, { crop: 'bare', rows: 1 });
    c.tool(-1.5, -2.14, { kind: 'spade', lean: 0.1, ry: 0.6 });

    // ---------- the hens' side of the door ----------
    c.coop(1.95, 2.55, { ry: -Math.PI / 2 + 0.12, lift: -0.04 }); // sunk a little, so no leg hangs over the fall of the ground
    c.beast(0.8, 2.45, { kind: 'hen', colour: HENS[0], ry: 2.6 });
    c.beast(1.15, 3.0, { kind: 'hen', colour: HENS[1], ry: -0.5 });
    c.beast(1.33, 2.62, { kind: 'hen', colour: HENS[2], ry: 0.1, lift: 0.17 }); // on her way up the ramp
    c.beast(1.42, 1.95, { kind: 'hen', colour: HENS[3], ry: 1.9 });
    c.beast(-1.292, 2.859, { kind: 'cock', colour: COCK, ry: 0.06, lift: 0.53 }); // up on the hurdle, watching them
    c.basket(0.78, 2.02, { fill: ONION[0] });

    // ---------- behind: the dung for the garth, and what he gathers off the waste ----------
    c.midden(1.3, -2.35, { r: 0.55 });
    c.beast(1.2, -2.4, { kind: 'hen', colour: HENS[0], ry: -2.2, lift: 0.24 });
    bracken(c, -0.2, -2.12, 0.1);
    nettles(c, 2.12, -2.5);
  },
};
