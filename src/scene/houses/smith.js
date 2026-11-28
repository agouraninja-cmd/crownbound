import * as THREE from 'three';
import { WASH, TIMBER, THATCHES, hull } from '../cottage.js';
import { span, cone, lump } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, WOOD, WOOD_DARK, WOOD_PALE, STONE, STONE_DARK, IRON, LEATHER } from '../kit.js';

// The smithy: a smoke-darkened house side-on to the road, and before it, a
// building apart, the forge — roofed and backed with turf, so that no spark
// of it lands in thatch. It stands open to the road and to the morning: the
// fire on its stone hearth shows by day, the bellows lie behind it, and the
// anvil waits on its stump at the open end. Round about lies the litter of
// the trade: bar iron, a ploughshare waiting, slag thrown down by the road,
// the grindstone, and ground burnt black.

const SODS = [0x6f5a3b, 0x594a31, 0x676039]; // cut turf, laid grass side down: earth, darker earth, and a course gone green again
const SOOT = 0x2a211a;
const CLAY = 0x9d8869; // what the hearth is bedded in and capped with
const CHARCOAL = 0x1d1a18;
const SLAG = 0x34353a; // clinker: dark and glassy
const RUST = 0x6a4631;
const BARK = 0x6a5139;
const GRIT = 0xb3a488; // the grindstone's sandstone
const WATER = 0x4f6f78;
const NETTLE = 0x4c6a34;
const SCORCH = [0x43392e, 0x2d2722]; // earth trodden and burnt bare; and blacker, where the work is done
const FIRE = 0xff7a1c; // coals blown bright
const HEART = 0xffd45a; // ...and the white heart of them

// Ground burnt and trodden bare about (u, v): a dark patch draped over the
// real ground, reaching `ru` along the ridge and `rv` across it, its edge
// ragged. `lift` keeps one patch clear of another laid over it.
function scorch(c, u, v, ru, rv, colour, lift) {
  const lie = c.at(u, v, 0, lift);
  const here = c.ground(u, v);
  const spot = (du, dv) => [du, c.ground(u + du, v + dv) - here, dv];
  const n = 13;
  const rim = [];
  const mid = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 0.78 + c.rng() * 0.22;
    rim.push(spot(Math.cos(a) * ru * k, Math.sin(a) * rv * k));
    mid.push(spot(Math.cos(a) * ru * 0.5, Math.sin(a) * rv * 0.5));
  }
  const pos = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    pos.push(0, 0, 0, ...mid[j], ...mid[i], ...mid[i], ...mid[j], ...rim[j], ...mid[i], ...rim[j], ...rim[i]);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  lie.add(mesh(geo, colour));
}

// A wall of the forge in sods, between two corners of its floor (its own
// frame): cut turf in courses, each a shade of its own, the wall thicker at
// its foot than at its head on the -x and -z sides, which are the outer ones.
function sodWall(b, x0, z0, x1, z1) {
  const foot = -0.45; // under the lowest ground it stands on
  const courses = 6;
  const tall = (b.eave - 0.02 - foot) / courses;
  for (let i = 0; i < courses; i++) {
    const spread = (courses - 1 - i) * 0.022 + b.rng() * 0.012;
    b.add(box(x1 - x0 + spread, tall, z1 - z0 + spread), tone(SODS[i % 3], 0.9 + b.rng() * 0.2), { x: (x0 + x1 - spread) / 2, y: foot + (i + 0.5) * tall, z: (z0 + z1 - spread) / 2 });
  }
}

// The hearth: fieldstone bedded in clay and capped with it, waist-high, its
// back to the sods. The bellows lie on a bench of their own behind a wall of
// clay that keeps their leather from the fire, and blow through it turn
// about. It stands on the ground at (x, z) of the forge's floor.
function hearth(b, x, z) {
  const g = b.at(x, z);
  const { rng } = b;
  const put = (geo, colour, opts) => g.add(mesh(geo, colour, opts));
  const stone = () => tone(rng() < 0.5 ? STONE : STONE_DARK, 0.86 + rng() * 0.2);
  const top = 0.82; // how high the fire is laid

  // two courses of stones, the lower sunk in the floor; the clay shows at the joints
  put(box(0.86, 1.0, 0.66), CLAY, { y: top - 0.6 });
  [[0.34, 0.26, 0.3], [0.24, 0.36, 0.3]].forEach((widths, course) => {
    let from = -0.45;
    for (const w of widths) {
      put(box(w - 0.025, course ? 0.31 : 0.7, 0.7 + rng() * 0.04), stone(), { x: from + w / 2, y: course ? top - 0.235 : top - 0.76 });
      from += w;
    }
  });
  put(box(0.94, 0.08, 0.76), tone(CLAY, 0.82), { y: top - 0.04 });
  // stones stood up behind the fire, to spare the turf
  put(box(0.42, 0.4, 0.12), tone(STONE_DARK, 0.62), { x: -0.18, y: top + 0.2, z: -0.31 });
  put(box(0.36, 0.3, 0.12), tone(STONE_DARK, 0.7), { x: 0.23, y: top + 0.15, z: -0.31 });
  // the fire: a bed of charcoal against the clay the bellows blow through
  put(box(0.13, 0.34, 0.6), tone(CLAY, 0.92), { x: -0.42, y: top + 0.17 });
  put(cone(0.27, 0.12, 7), CHARCOAL, { x: -0.1, y: top + 0.05 });
  b.ember(lump(0.12), FIRE, { x: -0.14, y: top + 0.11, in: g }).scale.set(1.2, 0.55, 1);
  b.ember(lump(0.055), HEART, { x: -0.16, y: top + 0.17, in: g });
  // the tongs, laid down on the cold end
  span(g, [0.1, top + 0.015, 0.26], [0.42, top + 0.015, -0.04], 0.022, 0.022, IRON, false);
  span(g, [0.1, top + 0.02, 0.2], [0.42, top + 0.02, 0.03], 0.022, 0.022, IRON, false);

  // The bellows: each a leather bag between two boards hinged at the nozzle,
  // which lies level with the coals. The one that is up is filling.
  const hinge = -0.6;
  const len = 0.62;
  const rest = top + 0.07; // the bench's top, that they lie on
  put(box(len + 0.08, 0.05, 0.7), WOOD, { x: hinge - len / 2, y: rest - 0.025 });
  for (const lx of [hinge - 0.06, hinge - len + 0.08]) put(box(0.06, 1.2, 0.6), WOOD_DARK, { x: lx, y: rest - 0.65 });
  [[-0.17, 0.4], [0.17, 0.1]].forEach(([bz, gape]) => {
    put(cyl(0.022, 0.04, 0.3, 5), IRON, { x: hinge + 0.13, y: rest + 0.045, z: bz, rz: -Math.PI / 2 });
    put(box(len, 0.025, 0.28), WOOD_PALE, { x: hinge - len / 2, y: rest + 0.0125, z: bz });
    const lid = new THREE.Group(); // the upper board, swung up about the hinge
    lid.position.set(hinge, rest + 0.06, bz);
    lid.rotation.z = -gape;
    lid.add(mesh(box(len, 0.025, 0.28), WOOD_PALE, { x: -len / 2 }));
    g.add(lid);
    const far = [hinge - Math.cos(gape) * len, rest + 0.045 + Math.sin(gape) * len]; // the lid's free end
    put(hull([
      [hinge, rest + 0.025, bz - 0.09], [hinge, rest + 0.025, bz + 0.09], [hinge, rest + 0.055, bz - 0.09], [hinge, rest + 0.055, bz + 0.09],
      [hinge - len, rest + 0.025, bz - 0.125], [hinge - len, rest + 0.025, bz + 0.125], [far[0], far[1], bz - 0.125], [far[0], far[1], bz + 0.125],
    ]), LEATHER);
  });
}

// a ploughshare, point up: a flat blade of iron and the socket it is wedged on by
const SHARE = hull([
  [0, 0.48, 0], [-0.13, 0.15, 0.014], [0.13, 0.15, 0.014], [-0.13, 0.15, -0.014], [0.13, 0.15, -0.014],
  [-0.05, -0.04, 0.035], [0.05, -0.04, 0.035], [-0.05, -0.04, -0.035], [0.05, -0.04, -0.035],
]);

// The anvil: a plain block of iron, no horn to it, let into an oak stump —
// the hammer left lying across its face. Against the stump, on the side that
// looks `toward` (radians round from the floor's +x), leans a ploughshare
// brought in to be laid with new iron, waiting its turn.
function anvil(b, x, z, ry, toward) {
  const g = b.at(x, z, ry);
  const put = (geo, colour, opts) => g.add(mesh(geo, colour, opts));
  put(cyl(0.2, 0.25, 0.9, 8), BARK, { y: 0.1 });
  put(cyl(0.185, 0.185, 0.014, 8), tone(WOOD_PALE, 1.12), { y: 0.556, shadow: false });
  const block = [];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) block.push([sx * 0.1, 0.5, sz * 0.08], [sx * 0.16, 0.76, sz * 0.105], [sx * 0.16, 0.85, sz * 0.105]);
  put(hull(block), IRON);
  put(box(0.3, 0.012, 0.19), 0x7b7b84, { y: 0.853, shadow: false }); // its face, worn bright
  const hammer = new THREE.Group();
  hammer.position.set(-0.03, 0.895, 0.01);
  hammer.rotation.y = 0.5;
  hammer.add(mesh(box(0.075, 0.07, 0.16), IRON));
  hammer.add(mesh(box(0.36, 0.03, 0.03), WOOD_PALE, { x: 0.19 }));
  g.add(hammer);
  b.at(x + Math.cos(toward) * 0.36, z + Math.sin(toward) * 0.36, Math.PI / 2 - toward).add(mesh(SHARE, tone(IRON, 1.5), { rx: -0.32 }));
  b.solid(x, z, 0.3);
}

// charcoal, tipped from the collier's sacks where the smith can reach it, and the shovel that feeds the fire
function coal(b, x, z) {
  const g = b.at(x, z);
  g.add(mesh(cone(0.34, 0.36, 7), CHARCOAL, { y: 0.14, ry: b.rng() * 6 }));
  for (let i = 0; i < 4; i++) {
    const a = 0.4 + i * 0.9 + b.rng() * 0.5;
    const d = 0.3 + b.rng() * 0.14;
    g.add(mesh(lump(0.05 + b.rng() * 0.03), tone(CHARCOAL, 1 + b.rng() * 0.5), { x: Math.cos(a) * d, y: 0.03, z: Math.sin(a) * d, ry: b.rng() * 6 }));
  }
  span(g, [-0.04, 0.2, -0.06], [0.16, 0.95, -0.3], 0.035, 0.035, WOOD_PALE);
}

const SHOE = new THREE.TorusGeometry(0.075, 0.02, 3, 5, 4.3); // most of a ring: a horseshoe, its heels a little apart

// shoes forged ahead of the need, hung on nails along a board
function shoes(b, x, y, z) {
  b.add(box(0.88, 0.28, 0.03), tone(WOOD_PALE, 0.96), { x, y, z });
  for (let i = 0; i < 5; i++) {
    b.add(SHOE, tone(i === 3 ? RUST : IRON, 1.1 + b.rng() * 0.4), { x: x - 0.34 + i * 0.17, y: y + (b.rng() - 0.5) * 0.04, z: z + 0.03, rz: -0.58 + (b.rng() - 0.5) * 0.3, shadow: false });
  }
}

// bar iron as it comes from the bloomery, stood on end against the sods till it is wanted
function bars(b, x, z) {
  const g = b.at(x, z);
  for (let i = 0; i < 4; i++) {
    span(g, [0.16 + i * 0.03, -0.05, -0.1 + i * 0.07], [0.03, 1.15 + b.rng() * 0.35, -0.09 + i * 0.06], 0.035, 0.035, tone(i === 1 ? RUST : IRON, 1 + b.rng() * 0.3));
  }
  b.solid(x + 0.1, z, 0.18);
}

// slag and clinker raked out of the fire and thrown down by the road: a dark, glassy heap
function slag(c, u, v, r) {
  const g = c.at(u, v, c.rng() * 6);
  g.add(mesh(cone(r, r * 0.62, 7), tone(SLAG, 0.8), { y: r * 0.25 }));
  for (let i = 0; i < 6; i++) {
    const a = i * 1.1 + c.rng();
    const d = r * (0.25 + c.rng() * 0.6);
    g.add(mesh(lump(0.06 + c.rng() * 0.06), tone(i % 3 ? SLAG : RUST, 0.85 + c.rng() * 0.4), { x: Math.cos(a) * d, y: r * 0.56 * (1 - d / r) + 0.03, z: Math.sin(a) * d, ry: c.rng() * 6 }));
  }
  c.solid(u, v, r * 0.75);
}

// The grindstone: a wheel of gritstone on a crank, turning through a log
// trough of water — every sickle in the village comes to it before harvest.
// The trough lies along the group's x; the crank is on its +z side.
function grindstone(c, u, v, ry) {
  const g = c.at(u, v, ry);
  const put = (geo, colour, opts) => g.add(mesh(geo, colour, opts));
  put(box(0.85, 0.24, 0.3), WOOD, { y: 0.14 });
  put(box(0.7, 0.02, 0.18), WATER, { y: 0.262, shadow: false });
  for (const s of [-1, 1]) put(box(0.07, 0.95, 0.07), WOOD_DARK, { y: 0.2, z: s * 0.2 });
  put(cyl(0.3, 0.3, 0.1, 10), GRIT, { y: 0.56, rx: Math.PI / 2 });
  put(box(0.035, 0.035, 0.62), IRON, { y: 0.56 });
  put(box(0.03, 0.2, 0.03), IRON, { y: 0.47, z: 0.31 });
  put(box(0.03, 0.03, 0.14), WOOD_PALE, { y: 0.38, z: 0.37 });
  const cos = Math.cos(ry);
  const sin = Math.sin(ry);
  for (const s of [-1, 1]) c.solid(u + s * 0.25 * cos, v - s * 0.25 * sin, 0.3);
}

// nettles, where nobody treads: n of them about (u, v), strewn `wu` wide along the ridge and `wv` across it
function nettles(c, u, v, n, wu, wv) {
  const g = c.at(u, v);
  for (let i = 0; i < n; i++) {
    const tall = 0.26 + c.rng() * 0.3;
    g.add(mesh(cone(0.08 + c.rng() * 0.03, tall, 4), tone(NETTLE, 0.85 + c.rng() * 0.35), { x: (c.rng() - 0.5) * wu, y: tall / 2 - 0.03, z: (c.rng() - 0.5) * wv, ry: c.rng() * 1.5 }));
  }
}

export default {
  id: 'smith',
  name: 'The smithy',
  note: 'The smithy — the forge stands apart under turf, for fear of the thatch; its fire is the one in the village that shows by day.',
  build(c) {
    const [, doorAt] = c.plot.door;
    c.shell({ eave: 1.65, pitch: 48, walls: 'daub', wash: WASH.soot, frame: 'post', timber: TIMBER.dark, roof: 'gable', thatch: 'old', moss: 2, ridge: 'turf' });
    c.door(...c.plot.door, { open: 0.3 });
    c.door('back', doorAt); // the passage runs straight through
    c.window('front', 2.0, { shutter: 'side', hinge: -1 });
    c.window('right', -1.1);
    c.smoke('seep', -0.8); // the house hearth's smoke finds its own way out through the straw
    // kept up, after a fashion: a panel daubed afresh under the window, a patch of newer straw over it
    c.onWall('front', 2.0).add(mesh(box(0.78, 0.56, 0.016), tone(WASH.daub, 0.86), { y: 0.6, z: 0.004 }));
    c.add(box(0.9, 0.02, 0.62), tone(THATCHES.straw[0], 0.95), { ...c.onRoof(1, 1.5, 2.3, 0.012), shadow: false });

    // The forge, in the front yard toward the road and clear of the house's
    // eaves: posts under a roof of turf, sods at its back and at the end the
    // weather comes from, open to the road and at the end by the door.
    const forge = { u: -2.47, v: 3.37, length: 3.2, width: 1.4 };
    c.outbuilding(forge.u, forge.v, 0, forge, (b) => {
      b.shell({ eave: 1.52, pitch: 40, walls: 'open', timber: TIMBER.old, roof: 'gable', thatch: 'turf', ridge: 'turf', over: 0.1 });
      const thick = 0.28;
      const back = -b.hz - 0.07; // the sods stand a little outside the posts, under the eave
      sodWall(b, -b.hx, back, -b.hx + thick, b.hz - 0.01);
      sodWall(b, -b.hx + thick, back, b.hx, back + thick);
      const inside = back + thick; // the back wall's inner face

      // under the turf the roof is black with smoke, and open at the end by the door
      const run = (b.peak - b.eave) / Math.sin(b.pitch); // down the slope, ridge to eave
      const reach = run * Math.cos(b.pitch); // ...and level, out to the eave's tip
      b.add(box(b.L - 0.04, 0.02, reach * 2), SOOT, { y: b.eave - 0.01, shadow: false });
      const gx = b.hx - 0.015;
      b.add(hull([[gx, b.eave, -reach], [gx, b.eave, reach], [gx, b.peak, 0], [gx + 0.012, b.eave, -reach], [gx + 0.012, b.eave, reach], [gx + 0.012, b.peak, 0]]), SOOT);

      // The smoke goes out by a hole over the fire, a sod propped above it
      // against the rain, and the turf round it is singed. (Set lower than the
      // kit's own hole: on so small a roof that one lies under the ridge sods.)
      const down = run * 0.49;
      const hole = b.onRoof(1, -0.15, down, 0.02);
      const flap = b.onRoof(1, -0.15, down, 0.22);
      b.add(box(0.74, 0.016, 0.28), tone(THATCHES.turf[1], 0.55), { ...b.onRoof(1, -0.15, down, 0.012), shadow: false });
      b.add(box(0.36, 0.02, 0.2), SOOT, { ...hole, shadow: false });
      b.add(box(0.5, 0.06, 0.36), tone(THATCHES.turf[0], 0.9), flap);
      for (const sx of [-0.2, 0.2]) b.add(box(0.03, 0.24, 0.03), WOOD_DARK, { x: hole.x + sx, y: (hole.y + flap.y) / 2, z: (hole.z + flap.z) / 2 });
      b.smokeAt(flap.x, flap.y + 0.1, flap.z);

      hearth(b, -0.05, inside + 0.38);
      // the quench trough at the hearth's foot, under the eave's drip, which keeps it filled
      b.trough(0.1, inside + 0.99, { len: 0.64, solid: false });
      coal(b, 0.98, 0.24);
      shoes(b, 1.0, 1.0, inside + 0.015);
      anvil(b, b.hx + 0.25, 0, 0.35, 0.7);
      bars(b, b.hx, back + 0.14);
      // nobody walks in under so low a roof: the whole of it stops him, out to the eaves
      b.block(-b.hx - 0.25, -reach, b.hx, reach + 0.03);
    });
    // nettles have the weather side of it to themselves
    nettles(c, forge.u - forge.length / 2 - 0.16, forge.v, 7, 0.06, 1.1);

    // the ground about it burnt and trodden bare
    scorch(c, -2.3, 3.5, 2.0, 0.88, SCORCH[0], 0.035);
    scorch(c, -0.55, 3.45, 0.72, 0.9, SCORCH[0], 0.041);
    scorch(c, -1.5, 3.55, 1.2, 0.6, SCORCH[1], 0.048);
    slag(c, -0.36, 4.0, 0.32);
    // the grindstone, set across the gap between house and forge
    grindstone(c, -0.69, 2.19, Math.PI / 2);

    // the rain butt at the house corner, in case; the block the house's own wood is split on
    c.barrel(-2.97, 2.02, { lid: false, r: 0.26, h: 0.72 });
    c.chopBlock(-3.6, -0.3, { ry: 0.8 });
    // out the back: the dung heap by the door, nettles in the corner
    c.midden(2.05, -2.14, { r: 0.4 });
    nettles(c, -3.7, -2.15, 7, 0.6, 0.4);
  },
};
