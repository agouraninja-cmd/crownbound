import * as THREE from 'three';
import { WASH, TIMBER, THATCHES, hull } from '../cottage.js';
import { lump } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, WOOD_DARK, WOOD_PALE, IRON } from '../kit.js';

// The woodward’s house: he keeps the lord's wood, and his toft is where the
// wood comes to be sorted. What sets it apart stands at the corner by the
// door: a POLLARD ash — a fat knobbly bole cut off at head height, out of the
// reach of any beast's mouth, with a crown of straight young poles springing
// from it. Round it lies what such trees give: cordwood stacked in long rows
// between stakes, poles stood against the gable and laid by behind, faggots
// under the back eave, oak bark peeled for the tanner, leaf-hay drying on the
// fence — and his winter by-work, a hurdle half woven on its mould.

const TAU = Math.PI * 2;
const UP = new THREE.Vector3(0, 1, 0);
const FORWARD = new THREE.Vector3(0, 0, 1);

const ASH_BARK = 0x766b5b; // an old ash: grey-brown and furrowed
const ASH_POLE = 0x979178; // young ash: smooth and silvery
const ASH_LEAF = 0x86a34c;
const HAZEL = 0xd6c69c; // hazel cleft this week, white inside
const HAZEL_BARK = 0x7a6040;
const CUT = 0xd4c08e; // wood fresh off the axe
const CUT_OLD = 0xa39781; // ...and a cut that has stood a winter
const BILLET = 0x6b5a45; // the bark on cordwood
const RIND = 0x6a5e50; // oak bark, outside
const BAST = 0xb5713b; // ...and inside, rust-red where the air has got at it

const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const toward = (a, b) => new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize();

// A rod from a to b ([x, y, z] each), r0 thick at a and r1 at b. Four-sided
// and open-ended: its ends are too small to see into, and a yard full of rods
// is cheap that way.
function rod(g, a, b, r0, r1, colour) {
  const m = mesh(new THREE.CylinderGeometry(r1, r0, Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), 4, 1, true), colour);
  m.position.set(...mix(a, b, 0.5));
  m.quaternion.setFromUnitVectors(UP, toward(a, b));
  g.add(m);
}

// a flat n-cornered face looking along +z, its first corner at `turn`: a cut end, a hollow
function polygon(r, n, turn) {
  const pts = [];
  for (let i = 1; i < n - 1; i++) {
    for (const k of [0, i, i + 1]) pts.push(Math.cos(turn + (k / n) * TAU) * r, Math.sin(turn + (k / n) * TAU) * r, 0);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  return geo;
}

// ---------- the pollard ----------

const GIRTH = [1.0, 0.86, 1.08, 0.93, 1.1, 0.88, 1.02]; // the bole's seven corners: no two the same distance out
const HOLLOW = 2; // the face of the bole the hollow has opened in: the one turned toward the door
const LOPPED = [4, 5]; // the poles he has taken so far, on that same side
// leaves: two rough clumps, one unit across, to be turned and stretched where they hang
const LEAVES = [
  hull([[0, -0.5, 0.05], [0.52, -0.08, 0.1], [-0.1, 0.04, 0.5], [-0.48, -0.12, -0.08], [0.06, 0.1, -0.46], [0.05, 0.5, -0.05]]),
  hull([[0.1, -0.45, -0.05], [0.42, 0.08, 0.3], [-0.3, -0.05, 0.42], [-0.5, 0.12, -0.15], [0.2, -0.1, -0.5], [-0.05, 0.52, 0.08], [0.44, 0.26, -0.22]]),
];

// The pollard ash at (u, v). Its poles are cut every few years and it grows
// them again out of the reach of cattle: so the bole is old, fat and
// hollowing, its head swollen and burred, and everything above the head is
// young. `corner` is the bearing of the yard's corner it stands in: the crown
// may not hang over that, and spreads the other way.
function pollard(c, u, v, corner) {
  const g = c.at(u, v);
  const { rng } = c;
  const bark = (k = 1) => tone(ASH_BARK, k * (0.93 + rng() * 0.14));
  const at = (a, r, y) => [Math.cos(a) * r, y, Math.sin(a) * r];

  // the bole, in two lengths with a crook between them; ring(…) is its seven corners at one height
  const ring = (y, r, off) => GIRTH.map((k, i) => [Math.cos((i / 7) * TAU) * r * k + off, y, Math.sin((i / 7) * TAU) * r * k]);
  const foot = ring(-0.3, 0.44, 0);
  const waist = ring(0.78, 0.33, 0.05);
  const neck = ring(1.46, 0.31, -0.02);
  g.add(mesh(hull([...foot, ...waist]), bark(0.94)));
  g.add(mesh(hull([...waist, ...neck]), bark()));
  // its roots, spreading: a ridge from knee height down to each toe
  for (const a of [0.85, 2.45, 3.95, 5.5]) {
    g.add(mesh(hull([at(a, 0.3, 0.62), at(a, 0.56, 0.05), at(a - 0.42, 0.36, -0.3), at(a + 0.42, 0.36, -0.3), at(a - 0.12, 0.7, -0.3), at(a + 0.12, 0.7, -0.3)]), bark(0.9)));
  }
  // the hollow: a dark slot lying on one face of the upper bole
  const [low, high] = [waist, neck].map((r) => [new THREE.Vector3(...r[HOLLOW]), new THREE.Vector3(...r[HOLLOW + 1])]);
  const across = low[0].clone().sub(low[1]).normalize();
  const out = across.clone().cross(high[0].clone().add(high[1]).sub(low[0]).sub(low[1])).normalize();
  const hollow = mesh(polygon(1, 6, Math.PI / 2), 0x241b14, { shadow: false });
  hollow.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(across, out.clone().cross(across), out));
  hollow.position.copy(low[0]).add(low[1]).add(high[0]).add(high[1]).multiplyScalar(0.25).addScaledVector(out, 0.008);
  hollow.position.y -= 0.04;
  hollow.scale.set(0.075, 0.25, 1);
  g.add(hollow);

  // the boll: the knuckle that every cutting has added to
  const knuckle = (y, r, n) => Array.from({ length: n }, (_, i) => at((i / n) * TAU + rng() * 0.5, r * (0.86 + rng() * 0.28), y + (rng() - 0.5) * 0.1));
  g.add(mesh(hull([...neck.map(([x, , z]) => [x, 1.4, z]), ...knuckle(1.72, 0.5, 7), ...knuckle(1.97, 0.4, 6), [0, 2.08, 0]]), bark(1.05)));
  // ...and its burrs: [bearing, height, size]
  for (const [a, height, r] of [[0.7, 1.72, 0.17], [2.9, 1.86, 0.14], [4.3, 1.66, 0.18], [0.3, 0.98, 0.13]]) {
    const [x, y, z] = at(a, height > 1.4 ? 0.43 : 0.3, height);
    g.add(mesh(lump(r), bark(0.96), { x, y, z, ry: rng() * TAU }));
  }

  // the poles: those on the rim spring out from the boll and then stand
  // straight up for the light; those on its crown go straight up
  const POLES = 12;
  for (let i = 0; i < POLES; i++) {
    const a = (i / POLES) * TAU + (rng() - 0.5) * 0.24;
    const inner = i % 3 === 0;
    const free = (1 - Math.cos(a - corner)) / 2; // 0 toward the yard's corner … 1 away from it
    const r0 = inner ? 0.08 + rng() * 0.08 : 0.3 + rng() * 0.06;
    const butt = at(a, r0, inner ? 1.9 : 1.8);
    const knee = at(a, r0 + (inner ? 0.04 : 0.1 + free * 0.08), 2.28 + rng() * 0.16);
    const tip = at(a, (inner ? 0.16 : 0.42) + free * (inner ? 0.1 : 0.3), knee[1] + 1.25 + rng() * 0.55 + free * 0.25);
    const colour = tone(ASH_POLE, 0.9 + rng() * 0.2);
    if (LOPPED.includes(i)) {
      // cut a hand above the boll, and white at the cut
      const stub = mix(butt, knee, 0.42);
      rod(g, butt, stub, 0.062, 0.056, colour);
      const cut = mesh(polygon(0.056, 5, 0), CUT, { shadow: false });
      cut.position.set(...stub);
      cut.quaternion.setFromUnitVectors(FORWARD, toward(butt, stub));
      g.add(cut);
      continue;
    }
    if (inner) {
      rod(g, butt, tip, 0.058, 0.02, colour);
    } else {
      rod(g, butt, knee, 0.062, 0.046, colour);
      rod(g, knee, tip, 0.046, 0.02, colour);
    }
    // in leaf at the top, and here and there lower down
    const leaves = (t, wide) => {
      const m = mesh(LEAVES[Math.floor(rng() * 2)], tone(ASH_LEAF, 0.84 + rng() * 0.3), { rx: (rng() - 0.5) * 0.9, ry: rng() * TAU, rz: (rng() - 0.5) * 0.9 });
      const [x, y, z] = mix(knee, tip, t);
      m.position.set(x + (rng() - 0.5) * 0.12, y, z + (rng() - 0.5) * 0.12);
      m.scale.set(wide, wide * (1 + rng() * 0.4), wide);
      g.add(m);
    };
    leaves(0.97, 0.34 + rng() * 0.1 + free * 0.08);
    leaves(0.68 + rng() * 0.12, 0.26 + rng() * 0.08);
    if (i % 2) leaves(0.42 + rng() * 0.14, 0.2 + rng() * 0.06);
  }
  c.solid(u, v, 0.46);
  return g;
}

// The felling axe, stood head down in group g with its haft leaned from
// `foot` up to `rest`: a long ash haft and a narrow head flared to its edge.
function fellingAxe(g, foot, rest) {
  const axe = new THREE.Group();
  axe.position.set(...foot);
  axe.quaternion.setFromUnitVectors(UP, toward(foot, rest));
  axe.add(mesh(box(0.035, 0.98, 0.045), tone(WOOD_PALE, 1.2), { y: 0.49 }));
  axe.add(mesh(hull([[0.04, 0.01, -0.02], [0.04, 0.01, 0.02], [0.04, 0.1, -0.02], [0.04, 0.1, 0.02], [-0.21, -0.03, 0], [-0.21, 0.15, 0]]), IRON));
  g.add(axe);
}

// ---------- cordwood ----------

const DEPTH = 0.74; // a billet's length: the stack is as deep as that
const PITCH = 0.3; // billet to billet along a row
const RISE = 0.26; // ...and row to row
const ROWS = 3;

// One billet lying across the stack at (x, y): a round, or a three-cornered
// one cleft from a bigger round. Its two cut ends are always drawn; its
// length only if it is `whole` — one that lies where it can be seen.
function billet(g, rng, x, y, whole) {
  const cleft = rng() < 0.45;
  const n = cleft ? 3 : 5;
  const r = (cleft ? 0.165 : 0.13) * (0.9 + rng() * 0.2);
  const flip = cleft && rng() < 0.5 ? Math.PI : 0; // a cleft billet lies either way up
  const long = DEPTH + (rng() - 0.5) * 0.07; // no two ends quite level
  if (whole) g.add(mesh(new THREE.CylinderGeometry(r, r, long, n, 1, true, flip), tone(BILLET, 0.84 + rng() * 0.3), { x, y, rx: Math.PI / 2 }));
  const face = polygon(r, n, flip - Math.PI / 2);
  const cut = tone(rng() < 0.22 ? CUT_OLD : CUT, 0.86 + rng() * 0.22);
  for (const s of [1, -1]) g.add(mesh(face, cut, { x, y, z: (s * long) / 2, ry: s > 0 ? 0 : Math.PI }));
}

// A stack of cordwood from `from` to `to` ([u, v], the middle of each end;
// along u or along v): billets of one length stacked between stakes, their cut
// ends making the stack's two long faces. Only what shows is drawn — every
// end, and the billets along the top and up the stack's two ends — round a
// dark core. It lies along the fall of the ground.
function cordwood(c, from, to) {
  const [u0, v0] = from;
  const [u1, v1] = to;
  const len = Math.hypot(u1 - u0, v1 - v0);
  const g = c.at((u0 + u1) / 2, (v0 + v1) / 2, -Math.atan2(v1 - v0, u1 - u0));
  g.position.y = (c.ground(u0, v0) + c.ground(u1, v1)) / 2;
  g.rotation.z = Math.atan2(c.ground(u1, v1) - c.ground(u0, v0), len);
  const { rng } = c;
  const r = PITCH / 2;
  for (let row = 0; row < ROWS; row++) {
    const n = Math.floor(len / PITCH) - (row % 2);
    for (let i = 0; i < n; i++) billet(g, rng, (i - (n - 1) / 2) * PITCH, r + row * RISE, row === ROWS - 1 || i === 0 || i === n - 1);
  }
  g.add(mesh(box(len - PITCH * 1.4, r + (ROWS - 2) * RISE + 0.3, DEPTH - 0.14), 0x4a3c2e, { y: (r + (ROWS - 2) * RISE) / 2 - 0.1 }));
  // the stakes that hold its ends, pushed a little out by the weight
  for (const end of [-1, 1]) {
    for (const side of [-1, 1]) rod(g, [end * (len / 2 + 0.02), -0.3, side * 0.22], [end * (len / 2 + 0.09), 1.0 + rng() * 0.12, side * 0.22], 0.04, 0.032, tone(WOOD_DARK, 1.0 + rng() * 0.3));
  }
  const du = (Math.abs(v1 - v0) / len) * (DEPTH / 2);
  const dv = (Math.abs(u1 - u0) / len) * (DEPTH / 2);
  c.block(Math.min(u0, u1) - du, Math.min(v0, v1) - dv, Math.max(u0, u1) + du, Math.max(v0, v1) + dv);
}

// ---------- the hurdle on its mould ----------

const BEND = 0.11; // how far each half of the mould is turned: a hurdle is woven with a belly in it, and pulls flat as it dries
const LOWEST = 0.24; // the first course of the weave, above the mould
const COURSE = 0.076; // ...and each course above it

// The winter by-work, at (u, v) and along ry: the mould — a bent log lying on
// the ground, bored to stand the uprights in — with a hurdle half woven on
// it, the rods to finish it lying to hand behind.
function hurdleOnMould(c, u, v, ry) {
  const g = c.at(u, v, ry);
  const { rng } = c;
  const half = 1.05;
  const line = (x) => Math.abs(x) * Math.tan(BEND); // where the mould lies, x along it
  for (const s of [-1, 1]) {
    g.add(mesh(cyl(0.11, 0.12, half + 0.04, 6), tone(0x6f6454, s > 0 ? 1 : 0.93), { x: (s * half * Math.cos(BEND)) / 2, y: 0.06, z: (half * Math.sin(BEND)) / 2, ry: -s * BEND, rz: Math.PI / 2 }));
  }
  // the uprights: nine, the two at the ends stouter and left round
  const reach = 0.92;
  for (let i = 0; i < 9; i++) {
    const x = -reach + (i * reach) / 4;
    const end = i === 0 || i === 8;
    const top = [x + (rng() - 0.5) * 0.05, 1.2 + rng() * 0.16, line(x) + (rng() - 0.5) * 0.05];
    rod(g, [x, 0.1, line(x)], top, end ? 0.03 : 0.022, end ? 0.022 : 0.016, tone(end ? HAZEL_BARK : HAZEL, 0.9 + rng() * 0.16));
  }
  // woven half way up: six courses of cleft hazel — one showing its white
  // inside, the next its bark — and a seventh begun from one end
  const course = (j, s, from, to) => {
    const mid = (from + to) / 2;
    const odd = (j + (s > 0 ? 1 : 0)) % 2;
    g.add(mesh(box(to - from, 0.07, 0.04), tone(j % 2 ? HAZEL : 0xa38655, 0.92 + rng() * 0.14), {
      x: s * mid * Math.cos(BEND), y: LOWEST + j * COURSE, z: mid * Math.sin(BEND) + (odd ? 0.016 : -0.016), ry: -s * BEND,
    }));
  };
  for (let j = 0; j < 6; j++) for (const s of [-1, 1]) course(j, s, 0, reach + 0.05);
  course(6, -1, 0.3, reach + 0.05);
  // the weavers' ends, not yet twisted back round the end uprights
  for (const [s, j, past] of [[1, 1, 0.3], [1, 3, 0.22], [1, 5, 0.36], [-1, 2, 0.26], [-1, 6, 0.42]]) {
    const y = LOWEST + j * COURSE;
    rod(g, [s * reach, y, line(reach)], [s * (reach + past), y + 0.04 + rng() * 0.1, line(reach) + 0.05 + rng() * 0.12], 0.016, 0.01, HAZEL_BARK);
  }
  // rods from the coppice, laid ready behind him
  for (let i = 0; i < 4; i++) {
    const z = -0.5 + (i % 2) * 0.09;
    const y = i > 1 ? 0.08 : 0.03;
    rod(g, [-1.15 + rng() * 0.2, y, z], [1.05 + rng() * 0.3, y, z + (rng() - 0.5) * 0.14], 0.026, 0.012, tone(HAZEL_BARK, 0.86 + rng() * 0.3));
  }
  const cos = Math.cos(ry);
  const sin = Math.sin(ry);
  for (const x of [-0.84, -0.42, 0, 0.42, 0.84]) c.solid(u + x * cos + line(x) * sin, v - x * sin + line(x) * cos, 0.27);
}

// ---------- what dries ----------

// a bundle of leafy boughs hung by its butts: narrow where it is tied, full below
const BUNDLE = hull([...[0, 1, 2, 3].map((i) => [Math.cos((i * TAU) / 4) * 0.06, 0, Math.sin((i * TAU) / 4) * 0.06]), ...[0, 1, 2, 3].map((i) => [Math.cos((i * TAU) / 4) * 0.19, -0.4, Math.sin((i * TAU) / 4) * 0.19]), [0, -0.64, 0]]);

// Leaf-hay: summer boughs of ash and elm bound in pairs by their butts and
// slung over the fence's top (at height h) to dry — the beasts' winter fodder.
// ry turns the pair to sit across the fence.
function leafHay(c, u, v, ry, h) {
  const g = c.at(u, v, ry, h);
  const { rng } = c;
  g.add(mesh(box(0.34, 0.06, 0.08), HAZEL_BARK, { y: 0.03 })); // the butts, tied across the top
  for (const s of [-1, 1]) {
    const bundle = mesh(BUNDLE, tone([0x7f8a3e, 0x949048, 0xa39a55][Math.floor(rng() * 3)], 0.9 + rng() * 0.2), { x: s * 0.11, y: 0.03, rz: s * (0.1 + rng() * 0.08), ry: rng() * TAU });
    bundle.scale.setScalar(0.9 + rng() * 0.2);
    g.add(bundle);
  }
}

// Oak bark, peeled in the spring for the tanner and stood against the wall to
// dry: n strips between u0 and u1 along the front wall, some bark side out
// and some showing the rust-red inside.
function barkStrips(c, u0, u1, n) {
  const { rng } = c;
  for (let i = 0; i < n; i++) {
    const len = 1.0 + rng() * 0.45;
    const lean = 0.2 + rng() * 0.07;
    const w = 0.15 + rng() * 0.09;
    const strip = new THREE.Group();
    strip.rotation.set(-lean, 0, (rng() - 0.5) * 0.1);
    if (rng() < 0.6) {
      // curled as it dries, the hollow side out
      for (const s of [-1, 1]) strip.add(mesh(box(w / 2 + 0.01, len, 0.018), tone(BAST, 0.9 + rng() * 0.2), { x: (s * w * Math.cos(0.5)) / 4, y: len / 2, z: (w * Math.sin(0.5)) / 4, ry: -s * 0.5 }));
    } else {
      strip.add(mesh(hull([[-w / 2, 0, 0], [w / 2, 0, 0], [0, 0, w * 0.3], [-w / 2, len, 0], [w / 2, len, 0], [0, len, w * 0.3]]), tone(RIND, 0.9 + rng() * 0.2)));
    }
    c.at(u0 + (i * (u1 - u0)) / (n - 1), c.hz + 0.06 + len * Math.sin(lean)).add(strip);
  }
  c.block(u0 - 0.12, c.hz, u1 + 0.12, c.hz + 0.38);
}

// ---------- poles ----------

// Cut poles stood against the -u gable, butts on the ground and fanned a
// little — kept upright, they dry straight.
function polesStood(c, n) {
  const { rng } = c;
  const wall = -c.hx - 0.08;
  for (let i = 0; i < n; i++) {
    const footU = wall - 0.38 - rng() * 0.14;
    const footV = (i / (n - 1) - 0.5) * 1.9 + (rng() - 0.5) * 0.1;
    const len = 2.5 + rng() * 0.5;
    const topV = footV * 0.55;
    const rise = Math.sqrt(len * len - (wall - footU) ** 2 - (topV - footV) ** 2);
    rod(c.at(footU, footV), [0, -0.05, 0], [wall - footU, rise, topV - footV], 0.034, 0.02, tone(i % 3 ? ASH_POLE : HAZEL_BARK, 0.88 + rng() * 0.24));
  }
  c.block(wall - 0.6, -1.05, -c.hx, 1.05);
}

// The heavier poles, laid by along the yard's bound from u0 to u1 at v: butts
// all one way, on two bearers to keep them off the wet — four, and three in
// the hollows between them.
function polesLaid(c, u0, u1, v) {
  const { rng } = c;
  for (const u of [u0 + 0.5, u1 - 0.6]) c.at(u, v).add(mesh(box(0.1, 0.12, 0.6), WOOD_DARK, { y: 0.02 }));
  for (let i = 0; i < 7; i++) {
    const upper = i > 3;
    const dv = (upper ? i - 5 : i - 1.5) * 0.14;
    const lift = upper ? 0.21 : 0.125;
    const tip = u1 - rng() * 0.45;
    rod(c.g, [u0 + rng() * 0.08, c.ground(u0, v) + lift, v + dv], [tip, c.ground(tip, v) + lift, v + dv + (rng() - 0.5) * 0.06], 0.05, 0.028, tone(i % 3 ? ASH_POLE : HAZEL_BARK, 0.86 + rng() * 0.24));
  }
  c.block(u0, v - 0.3, u1, v + 0.3);
}

export default {
  id: 'woodward',
  name: 'The woodward’s house',
  note: 'The woodward’s house — a pollard ash crowned with young poles, cordwood stacked in long rows, and a hurdle half woven on its mould.',
  build(c) {
    c.shell({ eave: 1.65, pitch: 50, walls: 'daub', wash: WASH.daub, frame: 'box', timber: TIMBER.grey, roof: 'gable', thatch: 'straw', moss: 2 });
    c.door(...c.plot.door, { open: 0.3 });
    // set a hand low, so the plate runs whole above them
    c.window('front', -1.5, { y: 1.22, shutter: 'side', hinge: -1 });
    c.window('right', -0.3, { y: 1.22 });
    c.smoke('hole', -0.7);
    // where the thatch was let go too long, a patch of this year's straw
    c.add(box(0.8, 0.03, 0.56), tone(THATCHES.new[1], 0.97), c.onRoof(1, 1.6, 1.48, 0.03));

    // ----- the corner by the door: the pollard, and the axe that lops it -----
    const ash = pollard(c, 3.3, 2.5, Math.PI / 4);
    fellingAxe(ash, [-0.68, 0, -0.08], [-0.33, 0.93, -0.02]);

    // ----- before the door: bark for the tanner, and the winter's work -----
    barkStrips(c, 1.5, 2.42, 6);
    hurdleOnMould(c, -1.65, 2.52, 0.05);
    c.fence([[-3.25, 1.2], [-3.25, 2.88], [-2.55, 2.88]], { kind: 'wattle', h: 0.9 });
    leafHay(c, -3.25, 1.62, 0, 0.9);
    leafHay(c, -3.25, 2.2, 0, 0.9);
    leafHay(c, -3.25, 2.7, 0, 0.9);
    leafHay(c, -2.88, 2.88, Math.PI / 2, 0.9);

    // ----- the gables: poles at one, cordwood down the other -----
    polesStood(c, 9);
    cordwood(c, [3.6, -2.15], [3.6, 1.25]);

    // ----- behind: more cordwood, built round the boulder that lies in the
    //       corner; the heavier poles; and the faggots under the eave -----
    cordwood(c, [0, -3], [2.85, -3]);
    polesLaid(c, -3.4, -1.0, -3.1);
    c.faggots(-2.0, -2.28, { n: 5, ry: Math.PI / 2 });
  },
};
