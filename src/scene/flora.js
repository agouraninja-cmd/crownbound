import * as THREE from 'three';
import { makeRng, makeBatch, soup, roughen, tintFaces, tintVerts, setSway, raggedCone, smoothstep, fbm2, hash2 } from './meshUtils.js';
import { terrainHeight, dirtAmount, grassTint } from './terrain.js';
import { LAYOUT } from './layout.js';
import { withWind } from './wind.js';

// Everything that grows low: grass tufts, tall meadow grass, wildflowers,
// ferns and bushes. None of it collides — it is all ankle-to-waist high —
// and all of it leans with the wind. buildFlora(scatter) returns one Group.

const col = (hex) => new THREE.Color(hex);

// ---------- where nothing may grow ----------

// Bare ground under and around the things people use. Circles {x, z, r}.
function keepClear(scatter) {
  const L = LAYOUT;
  const th = L.cart.rotY;
  const zones = [
    { x: L.campfire.x, z: L.campfire.z, r: 1.3 },
    { x: L.questBoard.x, z: L.questBoard.z, r: 1.2 },
    { x: L.tome.x, z: L.tome.z, r: 0.85 },
    { x: L.charter.x, z: L.charter.z, r: 0.5 },
    { x: L.exchequer.x, z: L.exchequer.z, r: 2.0 },
    { x: L.dummy.x, z: L.dummy.z, r: 0.75 },
    { x: L.miller.x, z: L.miller.z, r: 0.8 },
    { x: L.cart.x, z: L.cart.z, r: 2.0 },
    { x: L.cart.x + 1.9 * Math.cos(th), z: L.cart.z - 1.9 * Math.sin(th), r: 1.0 }, // the mule
  ];
  for (const t of scatter.trees) zones.push({ x: t.x, z: t.z, r: 0.45 * t.s + 0.12 });
  for (const r of scatter.rocks) zones.push({ x: r.x, z: r.z, r: r.s * 0.95 });
  const f = L.hovelFloor;
  return (x, z, pad = 0) => {
    if (Math.abs(x - L.hovel.x) < f.halfX + pad && Math.abs(z - L.hovel.z) < f.halfZ + pad) return true;
    for (const c of zones) {
      const dx = x - c.x;
      const dz = z - c.z;
      const r = c.r + pad;
      if (dx * dx + dz * dz < r * r) return true;
    }
    return false;
  };
}

// ---------- blades ----------

// One tuft: a splayed fan of blades, each a single triangle — dark at the
// root, light at the tip (each planted copy is then tinted by its ground).
// bend > 0 gives each blade a knee and a seed-head for tall meadow grass.
// Returns the pattern's raw { position, color, sway } arrays.
function tuftGeometry(rng, { blades, height, width, splay, bend = 0 }) {
  const p = [];
  const c = [];
  const sway = [];
  const ROOT = [0.6, 0.64, 0.56];
  const MID = [0.9, 0.95, 0.78];
  const TIP = bend ? [1.32, 1.22, 0.82] : [1.2, 1.26, 0.92];
  for (let b = 0; b < blades; b++) {
    const a = (b / blades) * Math.PI * 2 + rng() * 0.9;
    const h = height * (0.6 + rng() * 0.6);
    const w = width * (0.8 + rng() * 0.5);
    const dx = Math.cos(a);
    const dz = Math.sin(a);
    const px = -dz; // across the blade
    const pz = dx;
    const root = 0.02 + rng() * 0.05;
    const reach = root + h * splay * (0.5 + rng());
    const free = h / height; // taller blades move more
    if (!bend) {
      p.push(dx * root - px * w, -0.03, dz * root - pz * w, dx * root + px * w, -0.03, dz * root + pz * w, dx * reach, h, dz * reach);
      c.push(...ROOT, ...ROOT, ...TIP);
      sway.push(0, 0, free);
    } else {
      // root pair → knee pair → tip that nods over
      const kh = h * 0.55;
      const kr = root + (reach - root) * 0.3;
      const kw = w * 0.6;
      const l0 = [dx * root - px * w, -0.03, dz * root - pz * w];
      const r0 = [dx * root + px * w, -0.03, dz * root + pz * w];
      const l1 = [dx * kr - px * kw, kh, dz * kr - pz * kw];
      const r1 = [dx * kr + px * kw, kh, dz * kr + pz * kw];
      const tip = [dx * reach * (1 + bend), h, dz * reach * (1 + bend)];
      p.push(...l0, ...r0, ...r1, ...l0, ...r1, ...l1, ...l1, ...r1, ...tip);
      c.push(...ROOT, ...ROOT, ...MID, ...ROOT, ...MID, ...MID, ...MID, ...MID, ...TIP);
      sway.push(0, 0, free * 0.4, 0, free * 0.4, free * 0.4, free * 0.4, free * 0.4, free);
    }
  }
  return { position: p, color: c, sway };
}

const STRAW = col(0xb5a763);

// Tufts are planted in squares of ground, one merged mesh per square, so the
// squares behind the camera are culled whole instead of being drawn. (Merged
// rather than instanced: every tuft is written out as its own triangles —
// a few megabytes, and much the cheaper to draw.)
const SECTOR = 36;
function plantTufts(geo, material, spots) {
  const squares = new Map();
  for (const s of spots) {
    const key = Math.floor(s.x / SECTOR) + ',' + Math.floor(s.z / SECTOR);
    if (!squares.has(key)) squares.set(key, []);
    squares.get(key).push(s);
  }
  const group = new THREE.Group();
  for (const list of squares.values()) group.add(plantSquare(geo, material, list));
  return group;
}

function plantSquare(tuft, material, spots) {
  const n = tuft.sway.length; // vertices in one tuft
  const position = new Float32Array(spots.length * n * 3);
  const color = new Float32Array(spots.length * n * 3);
  const sway = new Float32Array(spots.length * n);
  const c = new THREE.Color();
  spots.forEach((s, i) => {
    const cos = Math.cos(s.ry);
    const sin = Math.sin(s.ry);
    const y0 = terrainHeight(s.x, s.z);
    grassTint(s.x, s.z, c).lerp(STRAW, s.dry).multiplyScalar(s.tone);
    for (let v = 0; v < n; v++) {
      const bx = tuft.position[v * 3] * s.size;
      const by = tuft.position[v * 3 + 1] * s.size * s.tall;
      const bz = tuft.position[v * 3 + 2] * s.size;
      const o = (i * n + v) * 3;
      position[o] = s.x + bx * cos + bz * sin; // turned about the upright
      position[o + 1] = y0 + by;
      position[o + 2] = s.z - bx * sin + bz * cos;
      color[o] = tuft.color[v * 3] * c.r;
      color[o + 1] = tuft.color[v * 3 + 1] * c.g;
      color[o + 2] = tuft.color[v * 3 + 2] * c.b;
      sway[i * n + v] = tuft.sway[v];
    }
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(position, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(color, 3));
  geo.setAttribute('sway', new THREE.BufferAttribute(sway, 1));
  const mesh = new THREE.Mesh(geo, material);
  mesh.receiveShadow = true;
  return mesh;
}

// ---------- flowers ----------

// [petal, heart]
const FLOWERS = [
  [col(0xf6f1e4), col(0xe9b93a)], // daisy
  [col(0xf2cc3c), col(0xd28f24)], // buttercup
  [col(0xcf4a32), col(0x3a241c)], // poppy
  [col(0x7484d6), col(0x3f4c8e)], // cornflower
  [col(0xdc8fab), col(0xf2d58a)], // campion
  [col(0xa184cc), col(0xe8d9a0)], // meadow cranesbill
];
const STEM = col(0x5f8a3c);

// one flower, standing at the origin: a stem and a five-petal blossom tipped
// toward the sky. Returns raw triangles for the batch.
function flowerGeometry(rng, [petal, heart]) {
  const p = [];
  const c = [];
  const sway = [];
  const h = 0.2 + rng() * 0.2;
  const lean = (rng() - 0.5) * 0.12;
  const tx = lean;
  const tz = (rng() - 0.5) * 0.12;
  // stem
  p.push(-0.012, 0, 0, 0.012, 0, 0, tx, h, tz);
  c.push(STEM.r * 0.7, STEM.g * 0.7, STEM.b * 0.7, STEM.r * 0.7, STEM.g * 0.7, STEM.b * 0.7, STEM.r, STEM.g, STEM.b);
  sway.push(0, 0, 0.8);
  // blossom: a shallow fan round a raised heart
  const r = 0.05 + rng() * 0.035;
  const turn = rng() * Math.PI * 2;
  for (let k = 0; k < 5; k++) {
    const a0 = turn + (k / 5) * Math.PI * 2;
    const a1 = turn + ((k + 0.72) / 5) * Math.PI * 2;
    p.push(tx, h + 0.012, tz, tx + Math.cos(a0) * r, h - 0.006, tz + Math.sin(a0) * r, tx + Math.cos(a1) * r, h - 0.006, tz + Math.sin(a1) * r);
    c.push(heart.r, heart.g, heart.b, petal.r, petal.g, petal.b, petal.r, petal.g, petal.b);
    sway.push(0.8, 0.8, 0.8);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(c, 3));
  geo.setAttribute('sway', new THREE.Float32BufferAttribute(sway, 1));
  return geo;
}

// ---------- undergrowth ----------

const BUSH = [
  [col(0x35602f), col(0x6f9a41)],
  [col(0x3f6a34), col(0x86a84a)],
  [col(0x4d6a2c), col(0x99a851)],
];
const FERN = [col(0x3d6b33), col(0x7fa648)];

function addBush(batch, rng, x, z, size) {
  const [shade, light] = BUSH[Math.floor(rng() * BUSH.length)];
  const y = terrainHeight(x, z);
  const n = 2 + Math.floor(rng() * 2);
  for (let k = 0; k < n; k++) {
    const r = size * (0.55 + rng() * 0.45);
    const g = soup(new THREE.IcosahedronGeometry(r, 1));
    roughen(g, r * 0.16, Math.round(x * 13 + z * 7 + k));
    g.scale(1, 0.78, 1);
    const ox = (rng() - 0.5) * size * 1.1;
    const oz = (rng() - 0.5) * size * 1.1;
    g.translate(ox, r * 0.5, oz);
    tintFaces(g, (fx, fy, fz, ny, out) => {
      const jit = hash2(Math.round(fx * 67 + x), Math.round(fz * 67 + fy * 31)) * 0.25;
      out.copy(shade).lerp(light, Math.min(1, smoothstep(ny, -0.3, 0.85) * 0.8 + jit));
    });
    setSway(g, (vx, vy) => Math.min(1, Math.max(0, vy) / (size * 1.4)) * 0.5);
    batch.add(g, { x, y, z, ry: rng() * Math.PI * 2 });
  }
}

function addFern(batch, rng, x, z, size) {
  const g = raggedCone(size, size * 0.42, 7, rng, 0.22);
  g.rotateX(Math.PI); // fronds arch up and out from the heart
  g.translate(0, size * 0.42, 0);
  const tone = 0.9 + rng() * 0.2;
  tintVerts(g, (vx, vy, vz, out) => {
    out.copy(FERN[0]).lerp(FERN[1], smoothstep(Math.hypot(vx, vz) / size, 0.2, 1)).multiplyScalar(tone);
  });
  setSway(g, (vx, vy, vz) => (Math.hypot(vx, vz) / size) * 0.45);
  batch.add(g, { x, y: terrainHeight(x, z) - 0.02, z, ry: rng() * Math.PI * 2 });
}

// ---------- the whole flora ----------

export function buildFlora(scatter) {
  const group = new THREE.Group();
  group.name = 'flora';
  const blocked = keepClear(scatter);
  const rng = makeRng(2718);

  // thin blades are lit as if they lay flat like the ground (see wind.js)
  const bladeMat = withWind(new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }), 0.11, { upNormals: true });
  const leafMat = withWind(new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }), 0.07);

  // grass tufts: thick about the village, thinning toward the wood, giving
  // way wherever the ground is worn bare
  const tufts = [];
  for (let tries = 0; tries < 90000 && tufts.length < 9500; tries++) {
    const ang = rng() * Math.PI * 2;
    const rad = Math.sqrt(rng()) * 72;
    const x = Math.cos(ang) * rad;
    const z = Math.sin(ang) * rad;
    if (rng() > 1 - smoothstep(rad, 20, 70) * 0.84) continue;
    const dirt = dirtAmount(x, z);
    if (rng() < dirt * 1.3 || blocked(x, z)) continue;
    tufts.push({
      x, z,
      ry: rng() * Math.PI * 2,
      size: 0.8 + rng() * 0.6,
      tall: 0.75 + rng() * 0.6,
      dry: Math.min(1, dirt * 1.6) * 0.7, // trampled at the path's edge
      tone: 0.9 + rng() * 0.2,
    });
  }
  group.add(plantTufts(tuftGeometry(rng, { blades: 5, height: 0.34, width: 0.05, splay: 0.42 }), bladeMat, tufts));

  // tall meadow grass, gone to seed: drifts of it out beyond the village
  const meadow = [];
  for (let tries = 0; tries < 40000 && meadow.length < 1700; tries++) {
    const ang = rng() * Math.PI * 2;
    const rad = 19 + Math.sqrt(rng()) * 55;
    const x = Math.cos(ang) * rad;
    const z = Math.sin(ang) * rad;
    const drift = fbm2(x * 0.07 + 100.5, z * 0.07 - 60.2, 2);
    if (rng() > smoothstep(drift, 0.5, 0.72)) continue;
    if (dirtAmount(x, z) > 0.04 || blocked(x, z, 0.25)) continue;
    meadow.push({ x, z, ry: rng() * Math.PI * 2, size: 0.85 + rng() * 0.5, tall: 0.8 + rng() * 0.5, dry: 0.25 + rng() * 0.3, tone: 0.95 + rng() * 0.15 });
  }
  group.add(plantTufts(tuftGeometry(rng, { blades: 5, height: 0.78, width: 0.045, splay: 0.3, bend: 0.5 }), bladeMat, meadow));

  // wildflowers: patches of one kind, the way they seed
  const blooms = makeBatch({ sway: true });
  const patch = (cx, cz, kind, count, spread) => {
    for (let i = 0; i < count; i++) {
      const a = rng() * Math.PI * 2;
      const d = Math.sqrt(rng()) * spread;
      const x = cx + Math.cos(a) * d;
      const z = cz + Math.sin(a) * d;
      if (dirtAmount(x, z) > 0.25 || blocked(x, z)) continue;
      const s = 0.85 + rng() * 0.6;
      blooms.add(flowerGeometry(rng, FLOWERS[kind]), { x, y: terrainHeight(x, z), z, ry: rng() * Math.PI * 2, s });
    }
  };
  const patches = []; // where the flowers stand thick — the butterflies keep to these
  for (let n = 0; n < 62; n++) {
    const ang = rng() * Math.PI * 2;
    const rad = 7 + Math.sqrt(rng()) * 55;
    const px = Math.cos(ang) * rad;
    const pz = Math.sin(ang) * rad;
    patch(px, pz, Math.floor(rng() * FLOWERS.length), 7 + Math.floor(rng() * 12), 1.0 + rng() * 1.8);
    if (dirtAmount(px, pz) < 0.1 && !blocked(px, pz, 1)) patches.push({ x: px, z: pz });
  }
  group.userData.patches = patches;
  // a scatter of daisies and buttercups through the village green itself
  for (let n = 0; n < 70; n++) {
    const ang = rng() * Math.PI * 2;
    const rad = Math.sqrt(rng()) * 22;
    patch(Math.cos(ang) * rad, Math.sin(ang) * rad, n % 2, 2, 0.5);
  }
  group.add(blooms.build(bladeMat, { cast: false })); // thin fans, lit flat like the grass

  // undergrowth: bushes and ferns gathered at the feet of trees and boulders
  const under = makeBatch({ sway: true });
  for (const t of scatter.trees) {
    const reach = 0.45 * t.s + 0.5;
    if (rng() < 0.5) {
      const a = rng() * Math.PI * 2;
      const d = reach + rng() * 0.9;
      const x = t.x + Math.cos(a) * d;
      const z = t.z + Math.sin(a) * d;
      if (dirtAmount(x, z) < 0.2) addBush(under, rng, x, z, 0.42 + rng() * 0.3);
    }
    const ferns = Math.floor(rng() * 4);
    for (let i = 0; i < ferns; i++) {
      const a = rng() * Math.PI * 2;
      const d = reach + rng() * 1.6;
      const x = t.x + Math.cos(a) * d;
      const z = t.z + Math.sin(a) * d;
      if (dirtAmount(x, z) < 0.2 && !blocked(x, z)) addFern(under, rng, x, z, 0.32 + rng() * 0.25);
    }
  }
  for (const r of scatter.rocks) {
    if (rng() < 0.55) {
      const a = rng() * Math.PI * 2;
      const d = r.s * 1.05 + 0.2;
      addFern(under, rng, r.x + Math.cos(a) * d, r.z + Math.sin(a) * d, 0.3 + rng() * 0.2);
    }
  }
  const undergrowth = under.build(leafMat);
  undergrowth.name = 'undergrowth';
  group.add(undergrowth);

  return group;
}
