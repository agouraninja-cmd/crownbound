import * as THREE from 'three';
import { makeRng, makeBatch, soup, roughen, tintFaces, tintVerts, setSway, raggedCone, smoothstep, hash2 } from './meshUtils.js';
import { terrainHeight, distToPath, surfaceHeight } from './terrain.js';
import { withWind } from './wind.js';

// Woodland and stone: pines, oaks and birches ringing the clearing, boulders,
// roadside pebbles, and the forest that climbs the hills beyond the walkable
// world. Two merged meshes — the near one casts shadows and sways, the far
// one is backdrop. Returns { meshes, colliders: [{x, z, r}], trees, rocks }.

const col = (hex) => new THREE.Color(hex);
const BARK = [col(0x7a5d42), col(0x86674a), col(0x6e553d)];
const BIRCH_BARK = col(0xd8d0bd);
const BIRCH_MARK = col(0x3d362e);
// [shade, light] pairs
const PINE = [
  [col(0x29522f), col(0x4f7f3e)],
  [col(0x2f5c36), col(0x5d8c46)],
  [col(0x28503f), col(0x4a7d5c)], // spruce, bluer
  [col(0x44612e), col(0x7d9345)], // olive
];
const LEAF = [
  [col(0x3c6b33), col(0x7da446)],
  [col(0x487636), col(0x93b04f)],
  [col(0x55782f), col(0xa6b556)],
];
const AUTUMN = [
  [col(0x9a6a28), col(0xdcaa44)], // gold
  [col(0x8c4d24), col(0xd0803a)], // rust
];
const BIRCH_LEAF = [col(0x7a933f), col(0xc6c75c)];
const STONE = [col(0x8f8b82), col(0x7e7b74), col(0x99927f)];
const MOSS = col(0x6b7f4a);



// ---------- where things stand ----------

// The original 42 trees and 16 rocks. Their places come from one seeded
// stream, and the village was laid out around them (the miller's rounds are
// cleared of exactly these colliders) — so this must draw from the stream in
// exactly the order it always has, even for values no longer used.
function legacyLayout() {
  const rng = makeRng(1337);
  const trees = [];
  const rocks = [];

  let placed = 0;
  let guard = 0;
  while (placed < 42 && guard++ < 400) {
    const ang = rng() * Math.PI * 2;
    const rad = 21 + rng() * 52;
    const x = Math.cos(ang) * rad;
    const z = Math.sin(ang) * rad;
    if (distToPath(x, z) < 6) continue;
    const s = 0.8 + rng() * 0.9;
    const ry = rng() * Math.PI * 2;
    for (let i = 0; i < 9; i++) rng(); // the old tree's lean, hue and bough offsets
    trees.push({ x, z, s, ry });
    placed++;
  }

  placed = 0;
  guard = 0;
  while (placed < 16 && guard++ < 300) {
    const ang = rng() * Math.PI * 2;
    const rad = 9 + rng() * 48;
    const x = Math.cos(ang) * rad;
    const z = Math.sin(ang) * rad;
    if (distToPath(x, z) < 3.5) continue;
    if (Math.hypot(x + 6, z - 5) < 6) continue; // keep the hovel yard clear
    const s = 0.35 + rng() * 0.75;
    const squash = 0.65 + rng() * 0.3;
    const hue = Math.floor(rng() * STONE.length);
    const ry = rng() * Math.PI * 2;
    rocks.push({ x, z, s, squash, hue, ry });
    placed++;
  }
  return { trees, rocks };
}

// Set by hand: a great oak behind the hovel, and two more to frame the green.
// All stand well clear of the path and of anything the player uses.
const FEATURE_TREES = [
  { x: -15.5, z: 8.5, s: 1.85, ry: 0.6, kind: 'oak' },
  { x: 11.5, z: -17.5, s: 1.45, ry: 2.1, kind: 'oak' },
  { x: -8.2, z: -11.6, s: 1.25, ry: 4.0, kind: 'birch' },
  { x: -9.6, z: -12.9, s: 1.0, ry: 1.2, kind: 'birch' },
];

// ---------- one tree ----------

// bends the whole tree from its foot: the higher, the freer
const swayByHeight = (height) => (x, y) => Math.pow(Math.max(0, y) / height, 1.7);

function addTrunk(batch, place, { height, top, base, lean, bark, sway }) {
  const g = soup(new THREE.CylinderGeometry(top, base, height, 6, 2));
  g.translate(0, height / 2, 0);
  tintFaces(g, (x, y, z, ny, out) => out.copy(bark).multiplyScalar(0.86 + hash2(Math.round(x * 90 + y * 37), Math.round(z * 90)) * 0.28));
  g.rotateZ(lean);
  setSway(g, sway);
  batch.add(g, place);
}

function addPine(batch, rng, t, y, { boughs = 5, spokes = 7, trunk = true } = {}) {
  const [shade, light] = PINE[Math.floor(rng() * PINE.length)];
  const height = 5.0 + rng() * 1.3;
  const reach = 1.25 + rng() * 0.4;
  const clear = 1.3 + rng() * 0.6; // bare trunk under the lowest bough
  const place = { x: t.x, y, z: t.z, ry: t.ry, s: t.s };
  const sway = swayByHeight(height);
  const lean = (rng() - 0.5) * 0.07;
  if (trunk) addTrunk(batch, place, { height: height * 0.7, top: 0.06, base: 0.2, lean, bark: BARK[Math.floor(rng() * BARK.length)], sway });

  const boughH = ((height - clear) / boughs) * 1.8;
  let at = clear;
  for (let k = 0; k < boughs; k++) {
    const f = k / (boughs - 1); // 0 lowest … 1 crown
    const r = reach * (1 - f * 0.8);
    const h = boughH * (1 - f * 0.12);
    const g = raggedCone(r, h, spokes, rng);
    // each bough is dark where it tucks under the one above and light at its tips
    const tone = 0.92 + rng() * 0.16;
    tintVerts(g, (x, vy, z, out) => {
      out.copy(shade).multiplyScalar(0.8).lerp(light, smoothstep(Math.hypot(x, z) / r, 0.2, 1) * (0.55 + f * 0.35));
      out.multiplyScalar(tone);
    });
    g.rotateX((rng() - 0.5) * 0.14);
    g.rotateZ((rng() - 0.5) * 0.14 + lean);
    g.translate((rng() - 0.5) * 0.14, at, (rng() - 0.5) * 0.14);
    setSway(g, sway);
    batch.add(g, place);
    at += h * 0.5;
  }
}

function addCrownBlob(batch, rng, place, { x, y, z, r, shade, light, sway, detail = 1, seed }) {
  const g = soup(new THREE.IcosahedronGeometry(r, detail));
  roughen(g, r * 0.14, seed);
  g.scale(1, 0.84, 1);
  g.translate(x, y, z);
  // tops catch the sun, bellies hold the shade; a little per-leaf-mass jitter
  tintFaces(g, (fx, fy, fz, ny, out) => {
    const jit = hash2(Math.round(fx * 53 + seed), Math.round(fz * 53 + fy * 29)) * 0.22;
    out.copy(shade).lerp(light, Math.min(1, smoothstep(ny, -0.35, 0.85) * 0.85 + jit));
  });
  setSway(g, sway);
  batch.add(g, place);
}

function addOak(batch, rng, t, y, { detail = 1, blobs = 0, trunk = true } = {}) {
  const [shade, light] = rng() < 0.2 ? AUTUMN[Math.floor(rng() * AUTUMN.length)] : LEAF[Math.floor(rng() * LEAF.length)];
  const bole = 1.9 + rng() * 0.7;
  const height = bole + 2.9;
  const place = { x: t.x, y, z: t.z, ry: t.ry, s: t.s };
  const sway = swayByHeight(height);
  const bark = BARK[Math.floor(rng() * BARK.length)];
  const lean = (rng() - 0.5) * 0.1;
  if (trunk) addTrunk(batch, place, { height: bole + 0.9, top: 0.14, base: 0.28, lean, bark, sway });

  const n = blobs || 4 + Math.floor(rng() * 3);
  const seed = Math.round(t.x * 7 + t.z * 13);
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2 + rng() * 0.6;
    const out = 0.75 + rng() * 0.45;
    // a limb reaching for each mass of leaves
    if (detail && k % 2 === 0) {
      const limb = soup(new THREE.CylinderGeometry(0.05, 0.1, 1.5, 5));
      limb.translate(0, 0.75, 0);
      limb.rotateZ(-0.75);
      limb.rotateY(-a);
      limb.translate(0, bole + 0.2, 0);
      tintFaces(limb, (fx, fy, fz, ny, c) => c.copy(bark).multiplyScalar(0.95));
      setSway(limb, sway);
      batch.add(limb, place);
    }
    addCrownBlob(batch, rng, place, {
      x: Math.cos(a) * out, y: bole + 1.15 + rng() * 0.5, z: Math.sin(a) * out,
      r: 1.0 + rng() * 0.4, shade, light, sway, detail, seed: seed + k,
    });
  }
  addCrownBlob(batch, rng, place, { x: 0, y: bole + 2.0, z: 0, r: 1.15 + rng() * 0.3, shade, light, sway, detail, seed: seed + 9 });
}

function addBirch(batch, rng, t, y) {
  const [shade, light] = rng() < 0.3 ? AUTUMN[0] : BIRCH_LEAF;
  const bole = 3.0 + rng() * 0.8;
  const height = bole + 1.9;
  const place = { x: t.x, y, z: t.z, ry: t.ry, s: t.s };
  const sway = swayByHeight(height);

  // white bark, flecked dark
  const trunk = soup(new THREE.CylinderGeometry(0.06, 0.12, bole + 0.6, 6, 5));
  trunk.translate(0, (bole + 0.6) / 2, 0);
  tintFaces(trunk, (x, fy, z, ny, out) => {
    const fleck = hash2(Math.round(x * 71 + fy * 43), Math.round(z * 71 + t.x * 3));
    out.copy(fleck > 0.8 ? BIRCH_MARK : BIRCH_BARK).multiplyScalar(0.92 + fleck * 0.1);
  });
  trunk.rotateZ((rng() - 0.5) * 0.12);
  setSway(trunk, sway);
  batch.add(trunk, place);

  const seed = Math.round(t.x * 11 + t.z * 5);
  for (let k = 0; k < 4; k++) {
    const a = rng() * Math.PI * 2;
    const out = k === 3 ? 0 : 0.35 + rng() * 0.35;
    addCrownBlob(batch, rng, place, {
      x: Math.cos(a) * out, y: bole + 0.2 + k * 0.5, z: Math.sin(a) * out,
      r: 0.62 + rng() * 0.28, shade, light, sway, seed: seed + k,
    });
  }
}

function addRock(batch, rng, r) {
  const g = soup(new THREE.IcosahedronGeometry(r.s, 1));
  roughen(g, r.s * 0.17, Math.round(r.x * 9 + r.z * 5));
  g.scale(1, r.squash, 1);
  const stone = STONE[r.hue];
  const mossy = rng() < 0.6;
  tintFaces(g, (x, y, z, ny, out) => {
    out.copy(stone).multiplyScalar(0.84 + hash2(Math.round(x * 61), Math.round(z * 61 + y * 23)) * 0.3);
    if (mossy && ny > 0.5) out.lerp(MOSS, smoothstep(ny, 0.5, 0.9) * 0.6);
  });
  batch.add(g, { x: r.x, y: terrainHeight(r.x, r.z) + r.s * 0.12, z: r.z, ry: r.ry });
}

function addPebble(batch, rng, x, z, size) {
  const g = soup(new THREE.IcosahedronGeometry(size, 0));
  roughen(g, size * 0.2, Math.round(x * 17 + z * 29));
  g.scale(1, 0.6, 1);
  const stone = STONE[Math.floor(rng() * STONE.length)];
  const tone = 0.8 + rng() * 0.3;
  tintFaces(g, (fx, fy, fz, ny, out) => out.copy(stone).multiplyScalar(tone * (0.9 + ny * 0.12)));
  batch.add(g, { x, y: terrainHeight(x, z) + size * 0.15, z, ry: rng() * Math.PI * 2 });
}

// ---------- the whole scatter ----------

export function buildScatter() {
  const { trees, rocks } = legacyLayout();
  const colliders = [];
  for (const t of trees) colliders.push({ x: t.x, z: t.z, r: 0.45 * t.s });
  for (const r of rocks) if (r.s > 0.55) colliders.push({ x: r.x, z: r.z, r: r.s * 0.85 });

  // which tree is which: its own stream, so the legacy one above is untouched
  const kindRng = makeRng(7331);
  for (const t of trees) {
    const k = kindRng();
    t.kind = k < 0.55 ? 'pine' : k < 0.86 ? 'oak' : 'birch';
  }

  const clearOf = (x, z, gap) => {
    for (const t of trees) if (Math.hypot(x - t.x, z - t.z) < gap) return false;
    for (const r of rocks) if (Math.hypot(x - r.x, z - r.z) < gap) return false;
    return true;
  };

  // the hand-set trees
  for (const f of FEATURE_TREES) {
    trees.push({ ...f });
    colliders.push({ x: f.x, z: f.z, r: 0.45 * f.s });
  }

  // thicken the outer ring of the wood — nothing near the village or the road
  const ringRng = makeRng(9001);
  let added = 0;
  let guard = 0;
  while (added < 46 && guard++ < 3000) {
    const ang = ringRng() * Math.PI * 2;
    const rad = 40 + ringRng() * 37;
    const x = Math.cos(ang) * rad;
    const z = Math.sin(ang) * rad;
    if (distToPath(x, z) < 6.5 || !clearOf(x, z, 3.4)) continue;
    const k = ringRng();
    const t = { x, z, s: 0.85 + ringRng() * 0.95, ry: ringRng() * Math.PI * 2, kind: k < 0.6 ? 'pine' : k < 0.88 ? 'oak' : 'birch' };
    trees.push(t);
    colliders.push({ x, z, r: 0.45 * t.s });
    added++;
  }

  const near = makeBatch({ sway: true });
  const far = makeBatch({ sway: true });
  const shapeRng = makeRng(555);

  for (const t of trees) {
    const y = terrainHeight(t.x, t.z) - 0.08; // sunk a touch so no root floats on a slope
    if (t.kind === 'oak') addOak(near, shapeRng, t, y);
    else if (t.kind === 'birch') addBirch(near, shapeRng, t, y);
    else addPine(near, shapeRng, t, y);
  }

  for (const r of rocks) {
    addRock(near, shapeRng, r);
    // a couple of small stones keeping each boulder company
    const n = 1 + Math.floor(shapeRng() * 3);
    for (let i = 0; i < n; i++) {
      const a = shapeRng() * Math.PI * 2;
      const d = r.s * (0.95 + shapeRng() * 0.5);
      addPebble(near, shapeRng, r.x + Math.cos(a) * d, r.z + Math.sin(a) * d, r.s * (0.14 + shapeRng() * 0.16));
    }
  }

  // pebbles kicked to the verges of the road
  for (let i = 0; i < 150; i++) {
    const z = -72 + shapeRng() * 144;
    const side = shapeRng() < 0.5 ? -1 : 1;
    const x = 5 * Math.sin(z * 0.045) + side * (1.5 + shapeRng() * 2.2);
    addPebble(near, shapeRng, x, z, 0.05 + shapeRng() * 0.1);
  }

  // The forest beyond the walkable world (the player is held to radius 78).
  // Thick at its edge, thinning as it climbs into the haze; the road keeps a
  // corridor through it. Simpler trees the farther they stand.
  const woodRng = makeRng(31337);
  const plant = (count, rMin, rMax, batch, opts) => {
    let n = 0;
    let tries = 0;
    while (n < count && tries++ < count * 8) {
      const ang = woodRng() * Math.PI * 2;
      // sqrt keeps the trees evenly spread over the ring's area
      const rad = Math.sqrt(rMin * rMin + woodRng() * (rMax * rMax - rMin * rMin));
      const x = Math.cos(ang) * rad;
      const z = Math.sin(ang) * rad;
      if (distToPath(x, z) < 7) continue;
      const t = { x, z, s: opts.s0 + woodRng() * opts.s1, ry: woodRng() * Math.PI * 2 };
      const y = surfaceHeight(x, z) - 0.1;
      if (woodRng() < opts.oaks) addOak(batch, woodRng, t, y, opts.oak);
      else addPine(batch, woodRng, t, y, opts.pine);
      n++;
    }
  };
  plant(330, 80.5, 106, near, { s0: 1.0, s1: 1.0, oaks: 0.3, oak: { detail: 0, blobs: 3 }, pine: { boughs: 4, spokes: 6 } });
  plant(950, 106, 255, far, { s0: 1.6, s1: 1.5, oaks: 0.25, oak: { detail: 0, blobs: 2, trunk: false }, pine: { boughs: 3, spokes: 5, trunk: false } });

  const material = withWind(new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }), 0.085);
  const nearMesh = near.build(material);
  nearMesh.name = 'scatter';
  const farMesh = far.build(material, { cast: false, receive: false });
  farMesh.name = 'forest';

  return { meshes: [nearMesh, farMesh], colliders, trees, rocks };
}
