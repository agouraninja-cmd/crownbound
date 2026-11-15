import * as THREE from 'three';
import { LAYOUT, FIELD, fieldToWorld, worldToField } from './layout.js';
import { terrainHeight } from './terrain.js';
import { makeRng, makeBatch, soup, tintFaces, mesh, bake, tone, hash2 } from './meshUtils.js';
import { withWind } from './wind.js';
import { box, cyl, sack, WOOD, WOOD_DARK, WOOD_PALE, STRAW, THATCH, THATCH_DARK, THATCH_PALE, ROPE, EYE } from './kit.js';

// The miller's strip: ridges of ploughland that change with the work done on
// them, inside a rail fence with a gate, a hayrick and a scarecrow. state.js
// decides how each ridge looks (farmRowLooks); this file only knows how to
// draw the seven looks:
//
//   stubble  cut straw on flat, dry ground — fallow, wanting the hoe
//   furrow   a freshly turned ridge
//   sown     the ridge raked over, seed lying on it
//   weedy    green shoots, and weeds come up among them
//   tended   the shoots alone, taller, the earth dark with water
//   ripe     standing wheat
//   stook    stubble again, the sheaves stood up together to dry
//
// The crop is two meshes — the earth (bed, ridges, sheaves) and what grows
// from it (straw, shoots, weeds, wheat, all leaning with the wind) — put
// together again whenever a ridge changes, which is a few times a day. What
// grows on one ridge under one look is worked out once and kept. Everything
// is built in world coordinates, as the wind shader expects.

const TAU = Math.PI * 2;
const HL = FIELD.halfLength;
const HW = FIELD.halfWidth;
const SPACING = LAYOUT.field.spacing;

// heights above the ground
const LIP = 0.45; // the bed's ragged edge runs out about this far
const SUNK = -0.1; // ...ending this far under the ground
const TROUGH = 0.06; // between ridges
const CREST = 0.19; // a ridge's top
const FLAT = 0.085; // unploughed ground

const RIDGED = new Set(['furrow', 'sown', 'weedy', 'tended', 'ripe']);
const EARTH = {
  stubble: 0x8a7350, // dry and pale
  stook: 0x8a7350,
  furrow: 0x4a3524, // fresh-turned, dark
  sown: 0x5e4733, // raked
  weedy: 0x533d2a,
  tended: 0x3d2c1f, // watered
  ripe: 0x5d4830,
};
const HEADLAND = 0x6e5940; // the bed's edge: the same trodden earth the ground is painted with

const rgb = (hex, k = 1) => {
  const c = new THREE.Color(hex);
  return [c.r * k, c.g * k, c.b * k];
};
const STRAW_ROOT = rgb(0xa08a52);
const STRAW_TIP = rgb(0xdcc680);
const SEED = rgb(0xdcc68c);
const SHOOT_ROOT = rgb(0x3f6e2c);
const SHOOT_TIP = rgb(0xa2cc5e);
const WEED_ROOT = rgb(0x2f4c26);
const WEED_TIP = rgb(0x6c8a3a);
const WEED_FLOWER = rgb(0xe6cb3c);
// no two stalks of wheat quite the same gold: a few shades to draw from,
// each [root, tip, ear, ear's tip]
const WHEAT = [0.86, 0.94, 1, 1.06, 1.12].map((k) => [rgb(0x9a8a3e, k), rgb(0xd9b550, k), rgb(0xe2bf55, k), rgb(0xf3de8e, k)]);
WHEAT.push([rgb(0x7f9040), rgb(0xc9b452), rgb(0xd6c05a), rgb(0xeedc8c)]); // a late one, still a little green

// ---------- the earth ----------

// How high the worked earth stands above the ground at (u, v), by the look of
// the ridge it falls in. Ridges die away into the headland at both ends.
function earthRise(looks, u, v) {
  if (Math.abs(u) > HL + 1e-3 || Math.abs(v) > HW + 1e-3) return SUNK;
  if (Math.abs(u) > HL - 1e-3) return TROUGH;
  const row = Math.min(FIELD.rows - 1, Math.max(0, Math.floor((v + HW) / SPACING)));
  const t = Math.min(1, Math.abs(v - FIELD.rowV(row)) / (SPACING / 2)); // 0 on the crest … 1 in the trough
  return RIDGED.has(looks[row]) ? TROUGH + (CREST - TROUGH) * (1 - t * t) : FLAT - (FLAT - TROUGH) * t * t;
}

// The bed as a faceted heightfield laid over the ground, one colour a facet.
// Its outermost ring of points is pushed out by uneven amounts and sunk into
// the ground, so the ploughland ends in a ragged edge, not a ruled line.
function earthGeometry(looks) {
  const us = [-HL - LIP];
  for (let u = -HL; u < HL + 1e-3; u += 0.4) us.push(u);
  us.push(HL + LIP);
  const vs = [-HW - LIP];
  for (let v = -HW; v < HW + 1e-3; v += SPACING / 4) vs.push(v);
  vs.push(HW + LIP);
  const lastI = us.length - 1;
  const lastJ = vs.length - 1;

  // every grid point once, in the world
  const pts = us.map((u, i) =>
    vs.map((v, j) => {
      const onBed = i > 0 && i < lastI && j > 0 && j < lastJ;
      const ragged = LIP * (hash2(i * 5 + 1, j * 3 + 7) * 1.5 - 0.6); // further out here, tucked in there
      const pu = i === 0 ? u - ragged : i === lastI ? u + ragged : u;
      const pv = j === 0 ? v - ragged : j === lastJ ? v + ragged : v;
      const w = fieldToWorld(pu, pv);
      const rough = onBed ? (hash2(i * 7 + 3, j * 11 + 5) - 0.5) * 0.04 : 0; // worked by hand, not by rule
      return [w.x, terrainHeight(w.x, w.z) + earthRise(looks, u, v) + rough, w.z];
    })
  );

  const position = [];
  const color = [];
  const c = new THREE.Color();
  const facet = (a, b, d, uc, vc, key) => {
    const offBed = Math.abs(uc) > HL || Math.abs(vc) > HW;
    if (offBed) {
      c.set(HEADLAND);
    } else {
      const row = Math.min(FIELD.rows - 1, Math.max(0, Math.floor((vc + HW) / SPACING)));
      const t = Math.abs(vc - FIELD.rowV(row)) / (SPACING / 2);
      c.set(EARTH[looks[row]]);
      if (RIDGED.has(looks[row])) c.multiplyScalar(t > 0.5 ? 0.8 : 1.08); // dark in the trough, lit on the crest
    }
    c.multiplyScalar(0.86 + hash2(key, key * 3 + 1) * 0.28);
    for (const p of [a, b, d]) {
      position.push(p[0], p[1], p[2]);
      color.push(c.r, c.g, c.b);
    }
  };
  for (let i = 0; i < lastI; i++) {
    for (let j = 0; j < lastJ; j++) {
      const uc = (us[i] + us[i + 1]) / 2;
      const vc = (vs[j] + vs[j + 1]) / 2;
      const key = i * 53 + j;
      // wound to face the sky: (here, +v, +u)
      facet(pts[i][j], pts[i][j + 1], pts[i + 1][j], uc, vc, key * 2);
      facet(pts[i + 1][j], pts[i][j + 1], pts[i + 1][j + 1], uc, vc, key * 2 + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
  return geo;
}

// A stook: four bound sheaves leaned head to head, the way they were stood to dry.
function addStook(batch, rng, u, v) {
  const w = fieldToWorld(u, v);
  const y = terrainHeight(w.x, w.z) + FLAT - 0.03;
  const turn = rng() * TAU;
  for (let k = 0; k < 4; k++) {
    const lean = 0.3 + rng() * 0.08;
    const shade = 0.88 + rng() * 0.24;
    const skirt = soup(new THREE.CylinderGeometry(0.06, 0.15, 0.62, 5, 1, true)); // butt on the ground, bound near the top
    skirt.translate(0, 0.31, 0);
    const ears = soup(new THREE.CylinderGeometry(0.15, 0.06, 0.26, 5)); // the heads, flaring above the tie
    ears.translate(0, 0.74, 0);
    for (const [geo, hex] of [[skirt, STRAW], [ears, THATCH_PALE]]) {
      geo.rotateZ(lean); // tipped in toward the others...
      geo.translate(0.24, 0, 0); // ...from where its butt stands
      tintFaces(geo, (fx, fy, fz, ny, out) => out.set(hex).multiplyScalar(shade * (0.86 + hash2(Math.round(fx * 90 + fy * 40), Math.round(fz * 90)) * 0.26)));
      batch.add(geo, { x: w.x, y, z: w.z, ry: turn + k * (TAU / 4) });
    }
  }
}

// ---------- what grows ----------

// Collects blades: plain triangles carrying a colour and a wind weight.
function makeGrowth() {
  const position = [];
  const color = [];
  const sway = [];
  const vert = (x, y, z, col, s) => {
    position.push(x, y, z);
    color.push(col[0], col[1], col[2]);
    sway.push(s);
  };
  return {
    position,
    color,
    sway,
    // one blade rooted at (x, y, z): `h` tall, `w` to each side of its root,
    // its tip leaning `lean` off the upright. ang turns it about the upright.
    blade(x, y, z, ang, w, h, lean, root, tip, free) {
      const ax = Math.cos(ang) * w;
      const az = Math.sin(ang) * w;
      const tx = x - Math.sin(ang) * lean;
      const tz = z + Math.cos(ang) * lean;
      vert(x - ax, y, z - az, root, 0);
      vert(x + ax, y, z + az, root, 0);
      vert(tx, y + h, tz, tip, free);
      return [tx, y + h, tz];
    },
    // a slim kite standing on a blade's tip: an ear of wheat, a weed's flower
    kite(tip, ang, w, h, nod, from, to, free) {
      const [x, y, z] = tip;
      const ax = Math.cos(ang) * w;
      const az = Math.sin(ang) * w;
      const ex = x - Math.sin(ang) * nod;
      const ez = z + Math.cos(ang) * nod;
      const mx = (x + ex) / 2;
      const mz = (z + ez) / 2;
      const my = y + h * 0.45;
      vert(x, y - h * 0.1, z, from, free * 0.9);
      vert(mx + ax, my, mz + az, from, free * 0.95);
      vert(ex, y + h, ez, to, free);
      vert(x, y - h * 0.1, z, from, free * 0.9);
      vert(ex, y + h, ez, to, free);
      vert(mx - ax, my, mz - az, from, free * 0.95);
    },
  };
}

// Calls plant(x, y, z) at spots strung along a ridge: on lines `offsets` off
// its crest, every `step`, each jostled a little out of true.
function alongRidge(rng, looks, row, offsets, step, jostle, plant) {
  for (const dv of offsets) {
    for (let u = -HL + 0.3; u < HL - 0.3; u += step) {
      const uu = u + (rng() - 0.5) * jostle * 2;
      const vv = FIELD.rowV(row) + dv + (rng() - 0.5) * jostle;
      const w = fieldToWorld(uu, vv);
      plant(w.x, terrainHeight(w.x, w.z) + earthRise(looks, uu, vv) - 0.015, w.z);
    }
  }
}

// ...and at spots strewn anywhere across it, `perUnit` of them to each unit of its length.
function acrossRidge(rng, looks, row, perUnit, reach, plant) {
  const count = Math.round(perUnit * HL * 2);
  for (let n = 0; n < count; n++) {
    const uu = (rng() * 2 - 1) * (HL - 0.3);
    const vv = FIELD.rowV(row) + (rng() * 2 - 1) * reach;
    const w = fieldToWorld(uu, vv);
    plant(w.x, terrainHeight(w.x, w.z) + earthRise(looks, uu, vv) - 0.015, w.z);
  }
}

const stubs = (g, rng, looks, row) =>
  alongRidge(rng, looks, row, [-0.34, -0.12, 0.1, 0.32], 0.16, 0.06, (x, y, z) => {
    g.blade(x, y, z, rng() * TAU, 0.017, 0.07 + rng() * 0.08, (rng() - 0.5) * 0.05, STRAW_ROOT, STRAW_TIP, 0.15);
  });

const shoots = (g, rng, looks, row, height, blades) =>
  alongRidge(rng, looks, row, [-0.24, -0.08, 0.08, 0.24], 0.1, 0.04, (x, y, z) => {
    const turn = rng() * TAU;
    for (let b = 0; b < blades; b++) {
      g.blade(x, y, z, turn + (b / blades) * Math.PI, 0.022, height * (0.75 + rng() * 0.5), (rng() - 0.5) * 0.1, SHOOT_ROOT, SHOOT_TIP, 0.55);
    }
  });

// what each look grows on its ridge
const GROWS = {
  stubble(g, rng, looks, row) {
    stubs(g, rng, looks, row);
    // a fallow strip does not stay clean
    acrossRidge(rng, looks, row, 0.9, 0.45, (x, y, z) => {
      const turn = rng() * TAU;
      for (let b = 0; b < 4; b++) g.blade(x, y, z, turn + b * 0.9, 0.03, 0.1 + rng() * 0.1, (rng() - 0.5) * 0.16, WEED_ROOT, WEED_TIP, 0.5);
    });
  },
  furrow() {},
  sown(g, rng, looks, row) {
    // seed lying where it fell: flecks too small to stand
    acrossRidge(rng, looks, row, 10, 0.34, (x, y, z) => {
      g.blade(x, y + 0.04, z, rng() * TAU, 0.022, 0.004, 0.045, SEED, SEED, 0);
    });
  },
  weedy(g, rng, looks, row) {
    shoots(g, rng, looks, row, 0.17, 2);
    acrossRidge(rng, looks, row, 2.6, 0.47, (x, y, z) => {
      const turn = rng() * TAU;
      let tip = null;
      for (let b = 0; b < 5; b++) tip = g.blade(x, y, z, turn + b * 1.3, 0.04, 0.17 + rng() * 0.15, (rng() - 0.5) * 0.24, WEED_ROOT, WEED_TIP, 0.6);
      if (rng() < 0.4) g.kite(tip, turn, 0.03, 0.07, 0, WEED_FLOWER, WEED_FLOWER, 0.6);
    });
  },
  tended(g, rng, looks, row) {
    shoots(g, rng, looks, row, 0.3, 3);
  },
  ripe(g, rng, looks, row) {
    // sown thick enough that the ridges close over into one standing crop
    alongRidge(rng, looks, row, [-0.4, -0.24, -0.08, 0.08, 0.24, 0.4], 0.13, 0.06, (x, y, z) => {
      const [root, tip, ear, earTip] = WHEAT[Math.floor(rng() * WHEAT.length)];
      const ang = rng() * TAU;
      const lean = (rng() - 0.5) * 0.24;
      const top = g.blade(x, y, z, ang, 0.027, 0.7 + rng() * 0.28, lean, root, tip, 0.85);
      g.kite(top, ang, 0.034, 0.17, lean * 0.5, ear, earTip, 1);
    });
  },
  stook(g, rng, looks, row) {
    stubs(g, rng, looks, row);
  },
};
const LOOKS = Object.keys(GROWS);

// ---------- the yard: fence, gate, hayrick ----------

// A timber from a to b (Vector3s in the world), `w` wide and `d` deep.
function timber(g, a, b, w, d, color) {
  const m = mesh(box(a.distanceTo(b), w, d), color);
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), b.clone().sub(a).normalize());
  g.add(m);
}

// a point in the yard, by field coordinates, `up` above the ground there
function yardPoint(u, v, up = 0) {
  const w = fieldToWorld(u, v);
  return new THREE.Vector3(w.x, terrainHeight(w.x, w.z) + up, w.z);
}

// The rail fence round the headland, with a gap for the gate in the middle
// of its village-ward side. Returns the circles that keep the player out:
// rails cannot collide as boxes (the field is turned on the map), so each
// run is a string of small circles too close together to pass between.
function buildFence(g, rng) {
  const X = HL + FIELD.margin;
  const Y = HW + FIELD.margin;
  const G = FIELD.gateHalf;
  const colliders = [];
  const posted = new Set();

  const post = (u, v) => {
    const key = `${u.toFixed(2)},${v.toFixed(2)}`;
    if (posted.has(key)) return;
    posted.add(key);
    const p = yardPoint(u, v, 0.4);
    g.add(mesh(cyl(0.045, 0.062, 1.1, 5), tone(WOOD_DARK, 0.9 + rng() * 0.3), { x: p.x, y: p.y, z: p.z, rx: (rng() - 0.5) * 0.08, rz: (rng() - 0.5) * 0.08 }));
  };

  // one straight run of fence: posts a couple of strides apart, two rails between
  const run = (u0, v0, u1, v1) => {
    const len = Math.hypot(u1 - u0, v1 - v0);
    const bays = Math.max(1, Math.round(len / 1.7));
    for (let k = 0; k <= bays; k++) {
      const t = k / bays;
      post(u0 + (u1 - u0) * t, v0 + (v1 - v0) * t);
      if (k === bays) break;
      const t1 = (k + 1) / bays;
      for (const h of [0.36, 0.74]) {
        // split rails: none quite level, none quite the same wood
        const a = yardPoint(u0 + (u1 - u0) * t, v0 + (v1 - v0) * t, h + (rng() - 0.5) * 0.07);
        const b = yardPoint(u0 + (u1 - u0) * t1, v0 + (v1 - v0) * t1, h + (rng() - 0.5) * 0.07);
        timber(g, a, b, 0.07, 0.045, tone(rng() < 0.5 ? WOOD : WOOD_PALE, 0.85 + rng() * 0.3));
      }
    }
    for (let d = 0; d <= len; d += 0.4) {
      const w = fieldToWorld(u0 + ((u1 - u0) * d) / len, v0 + ((v1 - v0) * d) / len);
      colliders.push({ x: w.x, z: w.z, r: 0.22 });
    }
  };

  run(-X, -Y, -G, -Y); // the village-ward side, either hand of the gate
  run(G, -Y, X, -Y);
  run(X, -Y, X, Y);
  run(X, Y, -X, Y);
  run(-X, Y, -X, -Y);

  // the gate: a hurdle hung on the left-hand post, standing open into the yard
  const swing = 1.25; // how far it stands open
  const far = [-G + Math.cos(swing) * (G * 2 - 0.15), -Y + Math.sin(swing) * (G * 2 - 0.15)];
  const hinge = (up) => yardPoint(-G, -Y, up);
  const latch = (up) => yardPoint(far[0], far[1], up);
  const GATE_WOOD = tone(WOOD_PALE, 0.95);
  timber(g, latch(0.12), latch(0.95), 0.06, 0.06, GATE_WOOD); // the far stile
  for (const h of [0.22, 0.5, 0.82]) timber(g, hinge(h), latch(h), 0.06, 0.035, tone(GATE_WOOD, 0.9 + rng() * 0.2));
  timber(g, hinge(0.22), latch(0.82), 0.05, 0.03, tone(GATE_WOOD, 0.85)); // the brace
  for (let d = 0.5; d < G * 2; d += 0.45) {
    const w = fieldToWorld(-G + Math.cos(swing) * d, -Y + Math.sin(swing) * d);
    colliders.push({ x: w.x, z: w.z, r: 0.2 });
  }

  // a couple of seed sacks set down inside the gate
  const s1 = yardPoint(G + 0.55, -Y + 0.5);
  sack(g, { x: s1.x, y: s1.y, z: s1.z, r: 0.26 });
  const s2 = yardPoint(G + 1.1, -Y + 0.42);
  sack(g, { x: s2.x, y: s2.y, z: s2.z, r: 0.22, color: tone(STRAW, 0.88), lean: 0.3 });
  return colliders;
}

// Last year's straw, ricked outside the fence by the gate: a round stack
// under a thatched cap, a pole through the top to hold it against the wind.
function buildHayrick(g, rng) {
  const at = yardPoint(4.6, -(HW + FIELD.margin) - 2.1);
  const body = mesh(cyl(1.05, 0.95, 1.15, 9), tone(STRAW, 0.95), { x: at.x, y: at.y + 0.5, z: at.z, ry: rng() });
  const eave = mesh(cyl(1.22, 1.12, 0.14, 9), tone(THATCH_DARK, 0.95), { x: at.x, y: at.y + 1.12, z: at.z });
  const cap = mesh(new THREE.ConeGeometry(1.2, 1.05, 9), THATCH, { x: at.x, y: at.y + 1.7, z: at.z, ry: 0.2 });
  g.add(body, eave, cap);
  g.add(mesh(cyl(0.025, 0.03, 0.5, 5), WOOD_DARK, { x: at.x, y: at.y + 2.35, z: at.z }));
  // straw pulled from its foot and left lying
  for (let k = 0; k < 5; k++) {
    const a = rng() * TAU;
    g.add(mesh(box(0.5 + rng() * 0.3, 0.06, 0.2), tone(STRAW, 0.85 + rng() * 0.3), { x: at.x + Math.cos(a) * 1.15, y: at.y + 0.04, z: at.z + Math.sin(a) * 1.15, ry: rng() * TAU }));
  }
  return { x: at.x, z: at.z, r: 1.08 };
}

// ---------- the scarecrow ----------

// An old tunic on a stake at the far headland, stuffed with last year's
// straw, facing local +z. He marks the strip from across the green.
function buildScarecrow() {
  const g = new THREE.Group();
  const TUNIC = 0x7d5a4a; // madder, faded by a few summers
  g.add(mesh(cyl(0.035, 0.045, 1.8, 5), WOOD_DARK, { y: 0.75 })); // the stake
  g.add(mesh(box(1.2, 0.055, 0.055), WOOD, { y: 1.2, rz: 0.04 })); // ...and its crosspiece
  g.add(mesh(box(0.46, 0.58, 0.15), TUNIC, { y: 0.97 }));
  g.add(mesh(box(0.92, 0.17, 0.13), tone(TUNIC, 0.92), { y: 1.2, rz: 0.04 })); // sleeves along the pole
  g.add(mesh(box(0.14, 0.12, 0.02), tone(TUNIC, 0.7), { x: -0.08, y: 0.9, z: 0.08, rz: 0.2 })); // a patch
  g.add(mesh(cyl(0.2, 0.2, 0.05, 6), ROPE, { y: 0.84 })); // belted with cord
  for (const s of [-1, 1]) {
    // straw bursting from each cuff
    g.add(mesh(new THREE.ConeGeometry(0.075, 0.24, 5), STRAW, { x: s * 0.57, y: 1.2 + s * 0.02, rz: s * (Math.PI / 2) }));
  }
  g.add(mesh(new THREE.ConeGeometry(0.21, 0.3, 6), tone(STRAW, 0.92), { y: 0.56 })); // ...and from the hem
  // a sack for a head, tied at the neck, under a hat nobody wanted
  const head = mesh(new THREE.SphereGeometry(0.15, 7, 5), 0xc9b78a, { y: 1.5 });
  head.scale.set(1, 1.1, 0.95);
  g.add(head);
  g.add(mesh(cyl(0.08, 0.08, 0.035, 6), ROPE, { y: 1.36 }));
  g.add(mesh(cyl(0.27, 0.27, 0.025, 8), 0x5b4a36, { y: 1.61, rz: 0.1 }));
  g.add(mesh(new THREE.ConeGeometry(0.14, 0.2, 7), 0x52432f, { x: -0.01, y: 1.71, rz: 0.1 }));
  for (const s of [-1, 1]) g.add(mesh(box(0.03, 0.035, 0.02), EYE, { x: s * 0.055, y: 1.52, z: 0.14, shadow: false }));
  g.add(mesh(box(0.1, 0.012, 0.02), EYE, { y: 1.44, z: 0.142, rz: -0.08, shadow: false })); // a stitched mouth
  return bake(g);
}

// ---------- the whole field ----------

export function buildField() {
  const group = new THREE.Group();
  group.name = 'field';

  const earthMat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  // thin blades are lit as if they lay flat like the ground (see wind.js)
  const growthMat = withWind(new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }), 0.11, { upNormals: true });

  let earth = null;
  const growth = new THREE.Mesh(new THREE.BufferGeometry(), growthMat);
  growth.receiveShadow = true;
  growth.visible = false; // nothing to show until the first draw()
  group.add(growth);

  // fence, gate, sacks and hayrick: placed piece by piece in the world, then baked to a couple of draw calls
  const yard = new THREE.Group();
  const yardRng = makeRng(8128);
  const colliders = buildFence(yard, yardRng);
  colliders.push(buildHayrick(yard, yardRng));
  group.add(bake(yard));

  // the scarecrow stands on the far headland, looking back down the ridges toward the village
  const scarecrow = buildScarecrow();
  const at = fieldToWorld(HL + 0.7, 1.5);
  scarecrow.position.set(at.x, terrainHeight(at.x, at.z), at.z);
  scarecrow.rotation.y = LAYOUT.field.rotY - Math.PI / 2;
  group.add(scarecrow);
  colliders.push({ x: at.x, z: at.z, r: 0.2 }); // his stake

  // what grows on ridge `row` under `look`: worked out once, then kept. Each
  // ridge-and-look has its own stream, so working one never reshuffles another.
  const grown = new Map();
  function growthOf(look, row) {
    const key = row * LOOKS.length + LOOKS.indexOf(look);
    if (!grown.has(key)) {
      const g = makeGrowth();
      const one = Array.from({ length: FIELD.rows }, () => look); // only this ridge's own look matters to it
      GROWS[look](g, makeRng(4100 + row * 97 + LOOKS.indexOf(look) * 13), one, row);
      grown.set(key, { position: new Float32Array(g.position), color: new Float32Array(g.color), sway: new Float32Array(g.sway) });
    }
    return grown.get(key);
  }

  let drawn = [];

  return {
    group,
    rows: FIELD.rows,
    at: { x: LAYOUT.field.x, z: LAYOUT.field.z }, // the strip's middle
    colliders,

    // Redraw the strip: one look name per ridge, first to last.
    draw(looks) {
      drawn = [...looks];

      const solid = makeBatch();
      solid.add(earthGeometry(looks));
      looks.forEach((look, row) => {
        if (look !== 'stook') return;
        const rng = makeRng(5200 + row * 31);
        for (let u = -HL + 1.6 + rng() * 0.8; u < HL - 0.8; u += 3 + rng() * 0.8) addStook(solid, rng, u, FIELD.rowV(row) + (rng() - 0.5) * 0.2);
      });
      if (earth) {
        group.remove(earth);
        earth.geometry.dispose();
      }
      earth = solid.build(earthMat);
      group.add(earth);

      // the ridges' growth, laid end to end in one geometry
      const parts = looks.map((look, row) => growthOf(look, row));
      const total = parts.reduce((n, p) => n + p.sway.length, 0);
      const position = new Float32Array(total * 3);
      const color = new Float32Array(total * 3);
      const sway = new Float32Array(total);
      let o = 0;
      for (const p of parts) {
        position.set(p.position, o * 3);
        color.set(p.color, o * 3);
        sway.set(p.sway, o);
        o += p.sway.length;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(position, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(color, 3));
      geo.setAttribute('sway', new THREE.BufferAttribute(sway, 1));
      growth.geometry.dispose();
      growth.geometry = geo;
      growth.visible = total > 0;
    },

    // what is drawn now (the smoke suite reads this)
    looks: () => drawn,

    // the spot on ridge `row` nearest to (x, z), and how far off it is
    nearestOnRow(row, x, z) {
      const u = Math.min(HL, Math.max(-HL, worldToField(x, z).u));
      const w = fieldToWorld(u, FIELD.rowV(row));
      return { x: w.x, z: w.z, dist: Math.hypot(w.x - x, w.z - z) };
    },
  };
}
