import * as THREE from 'three';
import { LAYOUT, FIELD, fieldToWorld, worldToField } from './layout.js';
import { terrainHeight } from './terrain.js';
import { makeRng, makeBatch, soup, tintFaces, mesh, bake, tone, hash2 } from './meshUtils.js';
import { createPuffs } from './particles.js';
import { withWind } from './wind.js';
import { box, cyl, sack, WOOD, WOOD_DARK, WOOD_PALE, STRAW, THATCH, THATCH_DARK, THATCH_PALE, ROPE, EYE } from './kit.js';

// The miller's strip: broad ridges of ploughland — ridge and furrow — that
// change with the work done on them, inside a rail fence with a gate, a
// hayrick, a plough and harrow laid by, and a scarecrow. state.js decides how
// each ridge looks (farmRowLooks); this file only knows how to draw the seven
// looks:
//
//   stubble  short cut straw in lines on dry ground, straw lying — fallow, wanting the hoe
//   furrow   a freshly turned ridge: lumpy, dark, strewn with clods and turned sod
//   sown     the ridge harrowed fine and dried pale on top, seed lying on it
//   weedy    green shoots, and weeds come up among them: dock, thistle, charlock
//   tended   the shoots alone, taller and arching, the earth dark with water
//   ripe     standing bearded wheat, a poppy or a cornflower in it, a patch the wind laid flat
//   stook    stubble again, the sheaves stood up in pairs along the ridge to dry
//
// The crop is two meshes — the earth (bed, ridges, sheaves) and what grows
// from it or lies on it (straw, shoots, weeds, wheat, clods, seed; the plants
// leaning with the wind) — put together again whenever a ridge changes, which
// is a few times a day. What one ridge holds under one look is worked out once
// and kept. Everything is built in world coordinates, as the wind shader expects.
//
// Wheat was broadcast by hand, not drilled: what grows is strewn across a
// ridge, thickest on its crown and thinning into the furrows, not set in lines.
// While he works, the hoe throws up earth, the seed flies from the hand and the
// sickle sheds chaff (kick()).

const TAU = Math.PI * 2;
const HL = FIELD.halfLength;
const HW = FIELD.halfWidth;
const SPACING = LAYOUT.field.spacing;
const HALF = SPACING / 2; // a ridge's crown to the furrow either side

// heights above the ground
const LIP = 0.45; // the bed's ragged edge runs out about this far
const SUNK = -0.1; // ...ending this far under the ground
const TROUGH = 0.03; // the furrow between ridges
const CREST = 0.26; // a ridge's crown
const FLAT = 0.085; // unploughed ground

const RIDGED = new Set(['furrow', 'sown', 'weedy', 'tended', 'ripe']);
const EARTH = {
  stubble: 0x8a7350, // dry and pale
  stook: 0x8a7350,
  furrow: 0x4a3524, // fresh-turned, dark
  sown: 0x6a523a, // harrowed, drying pale
  weedy: 0x533d2a,
  tended: 0x3d2c1f, // watered
  ripe: 0x5a4628, // what shows under standing wheat is mostly its own shadowed straw
};
// how lumpy the worked earth is under each look: fresh ploughing is all clods,
// the harrow breaks them, rain and growth settle the rest
const ROUGH = { stubble: 0.03, stook: 0.03, furrow: 0.1, sown: 0.035, weedy: 0.045, tended: 0.04, ripe: 0.04 };
const HEADLAND = 0x6e5940; // the bed's edge: the same trodden earth the ground is painted with

const rgb = (hex, k = 1) => {
  const c = new THREE.Color(hex);
  return [c.r * k, c.g * k, c.b * k];
};
const STRAW_ROOT = rgb(0xa08a52);
const STRAW_TIP = rgb(0xdcc680);
const STRAW_LYING = rgb(0xc9b06c);
const SEED = rgb(0xc2a874);
const SOD = rgb(0x5d6b34); // turned turf, the grass side still showing
const SHOOT_ROOT = rgb(0x3f6e2c);
const SHOOT_TIP = rgb(0xa2cc5e);
const LEAF_ROOT = rgb(0x356428);
const LEAF_TIP = rgb(0x8fbf4e);
const WEED_ROOT = rgb(0x2f4c26);
const WEED_TIP = rgb(0x6c8a3a);
const DOCK = rgb(0x3e5a2a);
const DOCK_TIP = rgb(0x6f7f36);
const THISTLE = rgb(0x5e7a52);
const THISTLE_HEAD = rgb(0x9a5aa8);
const CHARLOCK = rgb(0xe6cb3c);
const POPPY = rgb(0xc8321e);
const POPPY_DARK = rgb(0x8e1f14);
const CORNFLOWER = rgb(0x4a6cc8);
const CORNFLOWER_DARK = rgb(0x2f4a9a);
// no two stalks of wheat quite the same gold: a few shades to draw from,
// each [root, tip, ear, ear's tip]
const WHEAT = [0.86, 0.94, 1, 1.06, 1.12].map((k) => [rgb(0x9a8a3e, k), rgb(0xd9b550, k), rgb(0xe2bf55, k), rgb(0xf3de8e, k)]);
WHEAT.push([rgb(0x7f9040), rgb(0xc9b452), rgb(0xd6c05a), rgb(0xeedc8c)]); // a late one, still a little green

// the fixed light the hand-shaded clods are coloured by (they sit in the
// growth mesh, which is lit as if every face lay flat like the ground)
const SHADE_LIGHT = new THREE.Vector3(0.45, 0.8, 0.4).normalize();

// ---------- the earth ----------

// which ridge a spot across the strip falls in
const rowAt = (v) => Math.min(FIELD.rows - 1, Math.max(0, Math.floor((v + HW) / SPACING)));

// How high the worked earth stands above the ground at (u, v), by the look of
// the ridge it falls in. Ridges die away into the headland at both ends.
function earthRise(looks, u, v) {
  if (Math.abs(u) > HL + 1e-3 || Math.abs(v) > HW + 1e-3) return SUNK;
  if (Math.abs(u) > HL - 1e-3) return TROUGH;
  const row = rowAt(v);
  const t = Math.min(1, Math.abs(v - FIELD.rowV(row)) / HALF); // 0 on the crown … 1 in the furrow
  return RIDGED.has(looks[row]) ? TROUGH + (CREST - TROUGH) * (1 - t * t) : FLAT - (FLAT - TROUGH) * t * t;
}

// The bed as a faceted heightfield laid over the ground, one colour a facet.
// Its outermost ring of points is pushed out by uneven amounts and sunk into
// the ground, so the ploughland ends in a ragged edge, not a ruled line.
function earthGeometry(looks) {
  const us = [-HL - LIP];
  for (let u = -HL; u < HL + 1e-3; u += 0.35) us.push(u);
  us.push(HL + LIP);
  const vs = [-HW - LIP];
  for (let v = -HW; v < HW + 1e-3; v += SPACING / 6) vs.push(v);
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
      const edge = Math.abs(u) > HL - 0.2 ? 0.5 : 1; // the plough turned at the headland: less lumpy there
      const rough = onBed ? (hash2(i * 7 + 3, j * 11 + 5) - 0.5) * ROUGH[looks[rowAt(v)]] * edge : 0; // worked by hand, not by rule
      return [w.x, terrainHeight(w.x, w.z) + earthRise(looks, u, v) + rough, w.z];
    })
  );

  const position = [];
  const color = [];
  const c = new THREE.Color();
  const facet = (a, b, d, uc, vc, key, i) => {
    const offBed = Math.abs(uc) > HL || Math.abs(vc) > HW;
    let grain = 0.28; // how much one facet differs from the next
    if (offBed) {
      c.set(HEADLAND);
    } else {
      const row = rowAt(vc);
      const look = looks[row];
      const t = Math.abs(vc - FIELD.rowV(row)) / HALF;
      c.set(EARTH[look]);
      if (RIDGED.has(look)) c.multiplyScalar(t > 0.66 ? 0.74 : t > 0.33 ? 0.92 : 1.1); // dark in the furrow, lit on the crown
      if (look === 'furrow') {
        // the plough lays the earth over in slices: one lit, the next in shade
        c.multiplyScalar((i + row) % 2 ? 0.86 : 1.08);
        grain = 0.36;
      } else if (look === 'sown' && t < 0.5) {
        c.lerp(new THREE.Color(0x8a7458), 0.2); // the harrowed crown dries first
        grain = 0.34;
      } else if (look === 'ripe' && t > 0.6) {
        c.multiplyScalar(0.8); // deep shade down among the stalks
      }
    }
    c.multiplyScalar(1 - grain / 2 + hash2(key, key * 3 + 1) * grain);
    for (const p of [a, b, d]) {
      position.push(p[0], p[1], p[2]);
      color.push(c.r, c.g, c.b);
    }
  };
  for (let i = 0; i < lastI; i++) {
    for (let j = 0; j < lastJ; j++) {
      const uc = (us[i] + us[i + 1]) / 2;
      const vc = (vs[j] + vs[j + 1]) / 2;
      const key = i * 97 + j;
      // wound to face the sky: (here, +v, +u)
      facet(pts[i][j], pts[i][j + 1], pts[i + 1][j], uc, vc, key * 2, i);
      facet(pts[i + 1][j], pts[i][j + 1], pts[i + 1][j + 1], uc, vc, key * 2 + 1, i);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
  return geo;
}

// One sheaf, standing on its butt at the origin: a bundle of straw bound with
// a twist of itself a little above the middle, the ears fanning out on top.
function sheafGeometry(rng) {
  const shade = 0.88 + rng() * 0.22;
  const parts = [];
  const add = (geo, hex, k = 1) => {
    tintFaces(geo, (fx, fy, fz, ny, out) => out.set(hex).multiplyScalar(shade * k * (0.86 + hash2(Math.round(fx * 90 + fy * 40), Math.round(fz * 90)) * 0.26)));
    parts.push(geo);
  };
  const butt = soup(new THREE.CylinderGeometry(0.075, 0.12, 0.5, 7, 1, true)); // the cut ends splay on the ground
  butt.translate(0, 0.25, 0);
  add(butt, STRAW);
  const band = soup(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 7, 1, true)); // the bond
  band.translate(0, 0.47, 0);
  add(band, ROPE, 0.9);
  const head = soup(new THREE.CylinderGeometry(0.17, 0.075, 0.24, 7, 1, true)); // the stalks above the bond, spreading
  head.translate(0, 0.61, 0);
  add(head, STRAW, 1.05);
  for (let k = 0; k < 7; k++) {
    // the ears: little spires nodding out of the top every way
    const ear = soup(new THREE.ConeGeometry(0.05, 0.2, 4, 1, true));
    const a = (k / 7) * TAU + rng() * 0.5;
    const out = k === 6 ? 0 : 0.11;
    ear.rotateZ(-(0.5 + rng() * 0.35) * (out ? 1 : 0.2));
    ear.rotateY(a);
    ear.translate(Math.cos(a) * out, 0.8, -Math.sin(a) * out);
    add(ear, THATCH_PALE, 1.08);
  }
  const top = soup(new THREE.ConeGeometry(0.17, 0.1, 7, 1, true)); // ...and the crowded heads between them
  top.translate(0, 0.78, 0);
  add(top, THATCH_PALE, 0.95);
  return parts;
}

// A stook: sheaves stood in pairs along the ridge, each pair leaned head to
// head, so the rain runs off and the wind blows through.
function addStook(batch, rng, u, v) {
  const w = fieldToWorld(u, v);
  const y = terrainHeight(w.x, w.z) + FLAT - 0.04;
  const turn = LAYOUT.field.rotY + (rng() - 0.5) * 0.3; // along the ridge, give or take
  const pairs = 3 + (rng() < 0.5 ? 1 : 0);
  for (let k = 0; k < pairs; k++) {
    const along = (k - (pairs - 1) / 2) * 0.24;
    for (const side of [-1, 1]) {
      const lean = 0.24 + rng() * 0.08;
      for (const geo of sheafGeometry(rng)) {
        geo.rotateX(-side * lean); // tipped in toward its partner...
        geo.translate(along + (rng() - 0.5) * 0.04, 0, side * 0.2); // ...from where its butt stands
        batch.add(geo, { x: w.x, y, z: w.z, ry: turn });
      }
    }
  }
}

// ---------- what grows ----------

// Collects triangles carrying a colour and a wind weight: blades, ears and
// flowers that sway, and clods, seed and straw that lie still.
function makeGrowth() {
  const position = [];
  const color = [];
  const sway = [];
  const vert = (x, y, z, col, s) => {
    position.push(x, y, z);
    color.push(col[0], col[1], col[2]);
    sway.push(s);
  };
  const _a = new THREE.Vector3();
  const _b = new THREE.Vector3();
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
    // a leaf that rises and arches over: broad at the root, bending out
    // `arch` from the upright by its tip, which droops back down a little
    leaf(x, y, z, ang, w, h, arch, root, tip, free) {
      const ax = Math.cos(ang) * w;
      const az = Math.sin(ang) * w;
      const ox = -Math.sin(ang);
      const oz = Math.cos(ang);
      const mid = [(root[0] + tip[0]) / 2, (root[1] + tip[1]) / 2, (root[2] + tip[2]) / 2];
      const mx = x + ox * arch * 0.35;
      const mz = z + oz * arch * 0.35;
      const my = y + h * 0.7;
      const tx = x + ox * arch;
      const tz = z + oz * arch;
      const ty = y + h * 0.8;
      vert(x - ax, y, z - az, root, 0);
      vert(x + ax, y, z + az, root, 0);
      vert(mx + ax * 0.7, my, mz + az * 0.7, mid, free * 0.6);
      vert(x - ax, y, z - az, root, 0);
      vert(mx + ax * 0.7, my, mz + az * 0.7, mid, free * 0.6);
      vert(mx - ax * 0.7, my, mz - az * 0.7, mid, free * 0.6);
      vert(mx - ax * 0.7, my, mz - az * 0.7, mid, free * 0.6);
      vert(mx + ax * 0.7, my, mz + az * 0.7, mid, free * 0.6);
      vert(tx, ty, tz, tip, free);
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
      return [ex, y + h, ez];
    },
    // a flower's face held up to the sun: a little flat star of petals
    bloom(tip, r, petal, heart, free) {
      const [x, y, z] = tip;
      const n = 5;
      for (let k = 0; k < n; k++) {
        const a0 = (k / n) * TAU;
        const a1 = ((k + 1) / n) * TAU;
        vert(x, y, z, heart, free);
        vert(x + Math.cos(a0) * r, y + r * 0.7, z + Math.sin(a0) * r, petal, free); // the petals cupped up
        vert(x + Math.cos(a1) * r, y + r * 0.7, z + Math.sin(a1) * r, petal, free);
      }
    },
    // a clod of turned earth, half sunk where it lies: a low lumpy pyramid,
    // each face shaded by hand against a fixed light (see SHADE_LIGHT)
    clod(x, y, z, r, h, col, rng, top = col) {
      const n = 5;
      const turn = rng() * TAU;
      const ring = [];
      for (let k = 0; k < n; k++) {
        const a = turn + (k / n) * TAU;
        const rr = r * (0.7 + rng() * 0.5);
        ring.push([x + Math.cos(a) * rr, y - h * 0.15, z + Math.sin(a) * rr]);
      }
      const peak = [x + (rng() - 0.5) * r * 0.5, y + h, z + (rng() - 0.5) * r * 0.5];
      for (let k = 0; k < n; k++) {
        const p = ring[k];
        const q = ring[(k + 1) % n];
        _a.set(q[0] - p[0], q[1] - p[1], q[2] - p[2]);
        _b.set(peak[0] - p[0], peak[1] - p[1], peak[2] - p[2]);
        const nrm = _a.cross(_b).normalize();
        if (nrm.y < 0) nrm.negate();
        const lit = 0.6 + 0.75 * Math.max(0, nrm.dot(SHADE_LIGHT));
        const face = nrm.y > 0.75 ? top : col; // the face turned up shows what was on top
        const c = [face[0] * lit, face[1] * lit, face[2] * lit];
        vert(p[0], p[1], p[2], c, 0);
        vert(peak[0], peak[1], peak[2], c, 0);
        vert(q[0], q[1], q[2], c, 0);
      }
    },
    // something lying flat on the earth: a straw, a seed
    lying(x, y, z, ang, len, w, col) {
      const dx = Math.cos(ang) * len * 0.5;
      const dz = Math.sin(ang) * len * 0.5;
      const sx = -Math.sin(ang) * w;
      const sz = Math.cos(ang) * w;
      vert(x - dx - sx, y, z - dz - sz, col, 0);
      vert(x + dx, y + 0.004, z + dz, col, 0);
      vert(x - dx + sx, y, z - dz + sz, col, 0);
    },
  };
}

// Calls plant(x, y, z, t) at `perUnit` spots to each unit of a ridge's length,
// strewn across it within `reach` of its crown — thicker toward the crown when
// `crown` is above 1, as broadcast seed settles and grows. t is 0 on the crown
// … 1 at `reach`.
function strew(rng, looks, row, perUnit, reach, crown, plant) {
  const count = Math.round(perUnit * HL * 2);
  for (let n = 0; n < count; n++) {
    const uu = (rng() * 2 - 1) * (HL - 0.25);
    const t = Math.pow(rng(), crown);
    const vv = FIELD.rowV(row) + (rng() < 0.5 ? -1 : 1) * t * reach;
    const w = fieldToWorld(uu, vv);
    plant(w.x, terrainHeight(w.x, w.z) + earthRise(looks, uu, vv) - 0.015, w.z, t, uu);
  }
}

// Calls plant(x, y, z) at spots strung along a ridge: on lines `offsets` off
// its crown (as a fraction of half its width), every `step`, each jostled a
// little out of true — the way the sickle leaves stubble, row on row.
function alongRidge(rng, looks, row, offsets, step, jostle, plant) {
  for (const dv of offsets) {
    for (let u = -HL + 0.3; u < HL - 0.3; u += step) {
      const uu = u + (rng() - 0.5) * jostle * 2;
      const vv = FIELD.rowV(row) + dv * HALF + (rng() - 0.5) * jostle;
      const w = fieldToWorld(uu, vv);
      plant(w.x, terrainHeight(w.x, w.z) + earthRise(looks, uu, vv) - 0.015, w.z);
    }
  }
}

const STUBBLE_LINES = [-0.8, -0.56, -0.32, -0.08, 0.16, 0.4, 0.64, 0.86];
const stubble = (g, rng, looks, row) => {
  alongRidge(rng, looks, row, STUBBLE_LINES, 0.11, 0.05, (x, y, z) => {
    g.blade(x, y, z, rng() * TAU, 0.016, 0.06 + rng() * 0.07, (rng() - 0.5) * 0.05, STRAW_ROOT, STRAW_TIP, 0.12);
  });
  // straw the binders dropped, lying every which way
  strew(rng, looks, row, 9, HALF * 0.95, 1, (x, y, z) => {
    const k = 0.85 + rng() * 0.3;
    g.lying(x, y + 0.012, z, rng() * TAU, 0.16 + rng() * 0.2, 0.011, [STRAW_LYING[0] * k, STRAW_LYING[1] * k, STRAW_LYING[2] * k]);
  });
};

// young wheat: a tuft of fine straight blades
const shoots = (g, rng, looks, row, perUnit, height, blades) =>
  strew(rng, looks, row, perUnit, HALF * 0.82, 1.4, (x, y, z, t) => {
    const turn = rng() * TAU;
    const h = height * (1 - t * 0.35);
    for (let b = 0; b < blades; b++) {
      g.blade(x, y, z, turn + (b / blades) * Math.PI, 0.02, h * (0.75 + rng() * 0.5), (rng() - 0.5) * 0.12, SHOOT_ROOT, SHOOT_TIP, 0.55);
    }
  });

// what each look grows (or leaves lying) on its ridge
const GROWS = {
  stubble(g, rng, looks, row) {
    stubble(g, rng, looks, row);
    // a fallow strip does not stay clean
    strew(rng, looks, row, 1.1, HALF * 0.9, 1, (x, y, z) => {
      const turn = rng() * TAU;
      for (let b = 0; b < 4; b++) g.blade(x, y, z, turn + b * 0.9, 0.03, 0.1 + rng() * 0.1, (rng() - 0.5) * 0.16, WEED_ROOT, WEED_TIP, 0.5);
    });
  },
  furrow(g, rng, looks, row) {
    // the plough turns the earth up in clods, and the old turf with it
    const dark = EARTH.furrow;
    strew(rng, looks, row, 10, HALF * 0.85, 1, (x, y, z) => {
      const k = 0.95 + rng() * 0.55;
      const col = rgb(dark, k);
      const sod = rng() < 0.12;
      g.clod(x, y - 0.01, z, 0.06 + rng() * 0.08, 0.05 + rng() * 0.05, col, rng, sod ? [SOD[0] * k, SOD[1] * k, SOD[2] * k] : col);
    });
  },
  sown(g, rng, looks, row) {
    // the harrow has broken the clods small
    strew(rng, looks, row, 6, HALF * 0.85, 1, (x, y, z) => {
      const col = rgb(EARTH.sown, 0.8 + rng() * 0.5);
      g.clod(x, y - 0.01, z, 0.035 + rng() * 0.035, 0.025 + rng() * 0.025, col, rng);
    });
    // seed lying where it fell, the most of it buried by the harrow
    strew(rng, looks, row, 7, HALF * 0.85, 1.2, (x, y, z) => {
      const k = 0.85 + rng() * 0.3;
      g.lying(x, y + 0.02, z, rng() * TAU, 0.035, 0.012, [SEED[0] * k, SEED[1] * k, SEED[2] * k]);
    });
  },
  weedy(g, rng, looks, row) {
    shoots(g, rng, looks, row, 36, 0.17, 2);
    // and the weeds that come up with them, of several kinds
    strew(rng, looks, row, 2.4, HALF * 0.95, 1, (x, y, z) => {
      const turn = rng() * TAU;
      const kind = rng();
      if (kind < 0.35) {
        // dock: a few broad leaves lying out from the root
        for (let b = 0; b < 4; b++) g.leaf(x, y, z, turn + b * 1.6, 0.045, 0.16 + rng() * 0.08, 0.14 + rng() * 0.06, DOCK, DOCK_TIP, 0.4);
      } else if (kind < 0.6) {
        // thistle: spiny narrow leaves round a stem with a purple head
        for (let b = 0; b < 5; b++) g.blade(x, y, z, turn + b * 1.25, 0.03, 0.12 + rng() * 0.06, 0.12, THISTLE, THISTLE, 0.4);
        const stem = g.blade(x, y, z, turn, 0.012, 0.32 + rng() * 0.1, (rng() - 0.5) * 0.05, THISTLE, THISTLE, 0.7);
        g.kite(stem, turn, 0.035, 0.06, 0, THISTLE, THISTLE_HEAD, 0.75);
      } else {
        // charlock and its like: rank green with a spray of yellow
        let tip = null;
        for (let b = 0; b < 5; b++) tip = g.blade(x, y, z, turn + b * 1.3, 0.04, 0.17 + rng() * 0.15, (rng() - 0.5) * 0.24, WEED_ROOT, WEED_TIP, 0.6);
        if (rng() < 0.6) g.bloom(tip, 0.045, CHARLOCK, CHARLOCK, 0.6);
      }
    });
  },
  tended(g, rng, looks, row) {
    // the corn alone now, a hand high, its leaves beginning to arch over
    strew(rng, looks, row, 28, HALF * 0.82, 1.4, (x, y, z, t) => {
      const turn = rng() * TAU;
      const h = 0.3 * (1 - t * 0.3) * (0.8 + rng() * 0.4);
      g.blade(x, y, z, turn, 0.018, h, (rng() - 0.5) * 0.06, SHOOT_ROOT, SHOOT_TIP, 0.55);
      g.leaf(x, y, z, turn + 1.6 + rng() * 0.8, 0.022, h * 0.9, 0.1 + rng() * 0.08, LEAF_ROOT, LEAF_TIP, 0.5);
      if (rng() < 0.5) g.leaf(x, y, z, turn - 1.6 - rng() * 0.8, 0.02, h * 0.8, 0.08 + rng() * 0.08, LEAF_ROOT, LEAF_TIP, 0.5);
    });
  },
  ripe(g, rng, looks, row) {
    // bearded wheat, sown thick enough that the ridges close over into one
    // standing crop; shorter where it thins into the furrows
    const lodged = new Set(); // stretches the wind has laid flat
    if (rng() < 0.35) lodged.add(Math.floor(rng() * 4));
    const layAng = LAYOUT.field.rotY + 0.8; // the way the last storm blew
    strew(rng, looks, row, 56, HALF * 1.0, 1.15, (x, y, z, t, u) => {
      const [root, tip, ear, earTip] = WHEAT[Math.floor(rng() * WHEAT.length)];
      const flat = lodged.has(Math.floor(((u + HL) / (HL * 2)) * 4)) && t < 0.8 && Math.abs(((u + HL) % (HL / 2)) - HL / 4) < HL / 9;
      const ang = flat ? layAng + (rng() - 0.5) * 0.5 : rng() * TAU;
      const h = (0.78 + rng() * 0.3) * (1 - t * 0.2) * (flat ? 0.55 : 1);
      const lean = flat ? 0.45 + rng() * 0.15 : (rng() - 0.5) * 0.24;
      const top = g.blade(x, y, z, ang, 0.024, h, lean, root, tip, 0.85);
      // the ear nods under its own weight, its beard bristling past it
      const nod = lean * 0.5 + (rng() - 0.3) * 0.06;
      const earTop = g.kite(top, ang, 0.032, 0.16, nod, ear, earTip, 1);
      g.blade(earTop[0], earTop[1] - 0.03, earTop[2], ang + 0.4, 0.008, 0.08, nod * 0.6, earTip, earTip, 1);
      if (rng() < 0.15) g.leaf(x, y + h * 0.3, z, ang + 1.4, 0.016, h * 0.3, 0.12, root, tip, 0.6); // a dry leaf off the stalk
    });
    // the weeds of the corn: a poppy here, a cornflower there
    strew(rng, looks, row, 0.55, HALF * 0.9, 1, (x, y, z) => {
      const ang = rng() * TAU;
      const poppy = rng() < 0.6;
      const stem = g.blade(x, y, z, ang, 0.01, 0.72 + rng() * 0.25, (rng() - 0.5) * 0.12, WEED_ROOT, WEED_TIP, 0.8);
      g.bloom(stem, poppy ? 0.075 : 0.055, poppy ? POPPY : CORNFLOWER, poppy ? POPPY_DARK : CORNFLOWER_DARK, 0.85);
    });
  },
  stook(g, rng, looks, row) {
    stubble(g, rng, looks, row);
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

// The tools of the strip laid by outside the fence on the gate's other hand:
// the heavy plough — a long beam on a wheeled fore-carriage, the coulter's
// knife and the share under it, a mouldboard to lay the earth over, two
// handles behind for the ploughman — and a harrow, a wooden frame bristling
// with pegs, leaned on the fence. The oxen are out at grass. Returns their colliders.
function buildTools(g, rng) {
  const Y = HW + FIELD.margin;
  const IRON = 0x4a4744;
  const colliders = [];

  // the plough, its beam along the fence, resting on its wheels and its share
  const pu = -5.2;
  const pv = -Y - 1.6;
  const along = (d, side = 0, up = 0) => yardPoint(pu + d, pv + side, up);
  const beamA = along(-1.1, 0, 0.36);
  const beamB = along(1.0, 0, 0.42);
  timber(g, beamA, beamB, 0.1, 0.09, tone(WOOD, 0.9)); // the beam
  // the fore-carriage: an axle and two spoked wheels under the beam's front
  const axle = along(0.95, 0, 0.26);
  timber(g, along(0.95, -0.38, 0.26), along(0.95, 0.38, 0.26), 0.06, 0.06, WOOD_DARK);
  for (const side of [-0.4, 0.4]) {
    const c = along(0.95, side, 0.26);
    const wheel = mesh(cyl(0.26, 0.26, 0.06, 10), tone(WOOD_DARK, 1.05), { x: c.x, y: c.y, z: c.z });
    wheel.rotation.order = 'YXZ';
    wheel.rotation.y = LAYOUT.field.rotY;
    wheel.rotation.x = Math.PI / 2;
    g.add(wheel);
  }
  timber(g, axle, along(0.95, 0, 0.42), 0.06, 0.06, WOOD_DARK); // the pillow the beam rides on
  // the coulter, a knife hung down through the beam, and the share at its foot
  timber(g, along(0.1, 0, 0.4), along(-0.05, 0, 0.03), 0.04, 0.02, IRON);
  timber(g, along(-0.75, 0, 0.36), along(-0.75, 0, 0.06), 0.07, 0.07, tone(WOOD, 0.85)); // the sheath down to the sole
  timber(g, along(-0.95, 0, 0.05), along(-0.2, 0, 0.03), 0.07, 0.09, tone(WOOD, 0.8)); // the sole on the ground
  timber(g, along(-0.25, 0, 0.04), along(-0.02, 0.04, 0.02), 0.03, 0.12, IRON); // the share's point
  // the mouldboard: a board slewed off the share to turn the slice
  const mb = mesh(box(0.6, 0.24, 0.04), tone(WOOD_PALE, 0.9));
  const mc = along(-0.5, 0.13, 0.15);
  mb.position.set(mc.x, mc.y, mc.z);
  mb.rotation.order = 'YXZ';
  mb.rotation.y = LAYOUT.field.rotY + 0.35;
  mb.rotation.x = -0.3;
  g.add(mb);
  // the handles, rising back and out from the sole
  for (const side of [-0.22, 0.22]) {
    timber(g, along(-0.85, side * 0.3, 0.08), along(-1.75, side, 0.82), 0.05, 0.05, tone(WOOD_PALE, 0.85 + rng() * 0.1));
  }
  timber(g, along(-1.45, -0.18, 0.6), along(-1.45, 0.18, 0.6), 0.035, 0.035, WOOD_PALE); // the rung between them
  for (const d of [-1.3, 0, 0.9]) {
    const w = fieldToWorld(pu + d, pv);
    colliders.push({ x: w.x, z: w.z, r: 0.45 });
  }

  // the harrow, leaned against the fence by its top bar
  const hu = -2.8;
  const hv = -Y - 0.45;
  const lean = 0.95; // how far it stands back from upright
  const corner = (a, b) => {
    // a: across the frame, b: up it — tipped back off the fence
    const w = fieldToWorld(hu + a, hv - Math.cos(lean) * b * 0.4);
    return new THREE.Vector3(w.x, terrainHeight(w.x, w.z) + Math.sin(lean) * b * 0.95 + 0.04, w.z);
  };
  const HW_ = 0.55;
  for (const b of [0, 0.5, 1]) timber(g, corner(-HW_, b), corner(HW_, b), 0.06, 0.05, tone(WOOD, 0.9 + rng() * 0.15));
  for (const a of [-HW_, 0, HW_]) timber(g, corner(a, 0), corner(a, 1), 0.06, 0.05, tone(WOOD, 0.85 + rng() * 0.15));
  // its pegs, bristling out of the frame toward the field
  for (const b of [0, 0.5, 1]) {
    for (const a of [-0.45, -0.18, 0.1, 0.38]) {
      const p0 = corner(a + b * 0.05, b);
      const w = fieldToWorld(hu + a + b * 0.05, hv - Math.cos(lean) * b * 0.4 + 0.16);
      const p1 = new THREE.Vector3(w.x, p0.y - 0.06, w.z);
      timber(g, p0, p1, 0.025, 0.025, WOOD_DARK);
    }
  }
  const hc = fieldToWorld(hu, hv - 0.2);
  colliders.push({ x: hc.x, z: hc.z, r: 0.35 });
  return colliders;
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
  colliders.push(...buildTools(yard, yardRng));
  group.add(bake(yard));

  // what flies up while he works: earth off the hoe, seed from the hand, chaff off the sickle
  const puffs = createPuffs({ max: 64 });
  group.add(puffs.points);

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

  // the stooks stood on ridge `row`, as one geometry: built once, then kept
  const stooks = new Map();
  function stooksOf(row) {
    if (!stooks.has(row)) {
      const rng = makeRng(5200 + row * 31);
      const batch = makeBatch();
      for (let u = -HL + 1.4 + rng() * 0.8; u < HL - 0.9; u += 3.2 + rng() * 0.9) addStook(batch, rng, u, FIELD.rowV(row) + (rng() - 0.5) * 0.25);
      const geo = batch.build(null).geometry;
      geo.deleteAttribute('normal'); // merged with the earth, which carries none
      stooks.set(row, geo);
    }
    return stooks.get(row);
  }

  const DUST = new THREE.Color(0x9a8264);
  const EARTH_FLY = new THREE.Color(0x4f3a28);
  const SEED_FLY = new THREE.Color(0xd8c690);
  const CHAFF = new THREE.Color(0xe0c878);
  const CHAFF_PALE = new THREE.Color(0xf0e2b0);

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
        if (look === 'stook') solid.add(stooksOf(row).clone());
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

    // One stroke of the work, struck at (x, z) by a man facing `facing`:
    // the hoe throws earth up and a little dust off it, the seed flies out in
    // a fan from the hand, the sickle sends chaff drifting off on the air.
    kick(kind, x, z, facing) {
      const fx = Math.sin(facing);
      const fz = Math.cos(facing);
      const y = terrainHeight(x, z) + 0.15;
      const r = Math.random;
      if (kind === 'sow') {
        for (let k = 0; k < 9; k++) {
          const a = facing + (r() - 0.5) * 1.6; // flung in a fan before him
          const v = 1.6 + r() * 1.4;
          puffs.spawn({ x: x - fx * 0.3, y: y + 0.65, z: z - fz * 0.3, vx: Math.sin(a) * v, vy: 0.9 + r() * 0.8, vz: Math.cos(a) * v, rise: -7, drag: 0.6, life: 0.45 + r() * 0.15, size0: 0.045, size1: 0.04, alpha: 0.95, from: SEED_FLY, to: SEED_FLY });
        }
      } else if (kind === 'reap') {
        for (let k = 0; k < 7; k++) {
          puffs.spawn({ x: x + (r() - 0.5) * 0.3, y: y + 0.35 + r() * 0.3, z: z + (r() - 0.5) * 0.3, vx: (r() - 0.5) * 0.6 + 0.25, vy: 0.25 + r() * 0.4, vz: (r() - 0.5) * 0.6 + 0.15, rise: -0.4, drag: 1.2, life: 1.1 + r() * 0.6, size0: 0.05, size1: 0.08, alpha: 0.85, from: CHAFF_PALE, to: CHAFF });
        }
      } else {
        for (let k = 0; k < 6; k++) {
          // clods thrown up, falling back
          const a = facing + Math.PI + (r() - 0.5) * 2.2;
          const v = 0.5 + r() * 0.8;
          puffs.spawn({ x, y, z, vx: Math.sin(a) * v, vy: 1.1 + r() * 0.9, vz: Math.cos(a) * v, rise: -8, drag: 0.4, life: 0.4 + r() * 0.15, size0: 0.07, size1: 0.06, alpha: 1, from: EARTH_FLY, to: EARTH_FLY });
        }
        for (let k = 0; k < 2; k++) {
          // ...and the dust off them, hanging a moment
          puffs.spawn({ x: x + (r() - 0.5) * 0.2, y, z: z + (r() - 0.5) * 0.2, vx: (r() - 0.5) * 0.4, vy: 0.3 + r() * 0.2, vz: (r() - 0.5) * 0.4, rise: -0.1, drag: 1.5, life: 0.9 + r() * 0.4, size0: 0.15, size1: 0.45, alpha: 0.4, from: DUST, to: DUST });
        }
      }
    },

    update(dt) {
      puffs.update(dt);
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
