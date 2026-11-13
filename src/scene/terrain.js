import * as THREE from 'three';
import { pathX, LAYOUT } from './layout.js';
import { smoothstep, fbm2, hash2 } from './meshUtils.js';

// Analytic height so gameplay code can sample the ground anywhere without raycasts.
export function terrainHeight(x, z) {
  const hills =
    Math.sin(x * 0.055) * Math.cos(z * 0.047) * 1.7 +
    Math.sin(x * 0.021 + 1.7) * 1.3 +
    Math.cos(z * 0.018 + 0.6) * 1.1;

  const distCenter = Math.hypot(x, z);
  const clearing = 0.08 + 0.92 * smoothstep(distCenter, 16, 44);
  const path = 0.3 + 0.7 * smoothstep(Math.abs(x - pathX(z)), 2.2, 7.5);

  const fine = Math.sin(x * 0.6) * Math.cos(z * 0.55) * 0.06 + Math.sin(x * 1.3 + z * 0.7) * 0.045;

  return hills * clearing * path + fine;
}

export function distToPath(x, z) {
  return Math.abs(x - pathX(z));
}

// The land as it is DRAWN. Inside the walkable world it is exactly
// terrainHeight; beyond it (the player is held to radius 78) the ground swells
// into wooded hills and, at the rim, a ring of far mountains.
export function landHeight(x, z) {
  const h = terrainHeight(x, z);
  const d = Math.hypot(x, z);
  if (d < 92) return h;
  const hills = smoothstep(d, 92, 250) * (9 + 17 * fbm2(x * 0.011 + 40.3, z * 0.011 - 7.1, 3));
  const peaks = smoothstep(d, 300, 430) * (26 + 105 * Math.pow(fbm2(x * 0.0065 - 13.2, z * 0.0065 + 29.6, 3), 1.4));
  return h + hills + peaks;
}

// ---------- ground colour ----------

const LUSH = new THREE.Color(0x5b8c3e);
const MEADOW = new THREE.Color(0x80a54c);
const DRY = new THREE.Color(0xb0a95e);
const MOSS = new THREE.Color(0x4b7538);
const WOODS = new THREE.Color(0x47683a); // forest floor beyond the clearing
const ROCK = new THREE.Color(0x85808c); // the far mountains
const DIRT = new THREE.Color(0x8c7253);
const DIRT_DARK = new THREE.Color(0x6e5940);
const DUST = new THREE.Color(0xa8916c); // the trodden middle of the road

// Grass colour at a spot: meadow-scale patches of lush and sunny green, with
// finer clumps gone dry or mossy. The flora grows its tufts from this too.
export function grassTint(x, z, out) {
  const broad = fbm2(x * 0.045 + 3.7, z * 0.045 - 1.9, 3);
  const clump = fbm2(x * 0.21 + 31.4, z * 0.21 + 7.7, 2);
  out.copy(LUSH).lerp(MEADOW, smoothstep(broad, 0.32, 0.68));
  out.lerp(DRY, smoothstep(clump, 0.56, 0.86) * 0.55);
  out.lerp(MOSS, smoothstep(clump, 0.44, 0.16) * 0.5);
  return out;
}

// How bare the ground is here, 0 grass … 1 dirt: the path, and the worn
// circles around the hearth, hovel, dummy, granary. Noise frays every edge.
export function dirtAmount(x, z) {
  const f = LAYOUT.hovelFloor; // indoors is packed earth, wall to wall
  if (Math.abs(x - LAYOUT.hovel.x) < f.halfX && Math.abs(z - LAYOUT.hovel.z) < f.halfZ) return 1;
  const fray = (fbm2(x * 0.55 + 9.1, z * 0.55 + 4.3, 2) - 0.5) * 0.9;
  let amt = 1 - smoothstep(distToPath(x, z) + fray, 1.8, 3.3);
  for (const p of LAYOUT.dirtPatches) {
    const dd = Math.hypot(x - p.x, z - p.z) + fray * 0.6;
    amt = Math.max(amt, 1 - smoothstep(dd, p.r * 0.6, p.r * 1.4));
  }
  return amt;
}

const _dirt = new THREE.Color();

function groundColor(x, z, out) {
  const d = Math.hypot(x, z);
  grassTint(x, z, out);
  // under the trees beyond the clearing, grass gives way to forest floor
  out.lerp(WOODS, smoothstep(d, 74, 104) * 0.8);
  if (d > 280) out.lerp(ROCK, smoothstep(d, 300, 400));

  // the road fades out as it winds off into the hills
  const dirt = dirtAmount(x, z) * (1 - smoothstep(d, 110, 160));
  if (dirt > 0) {
    const grit = fbm2(x * 0.7, z * 0.7 + 50, 2);
    _dirt.copy(DIRT).lerp(DIRT_DARK, grit * 0.8);
    _dirt.lerp(DUST, (1 - smoothstep(distToPath(x, z), 0.2, 1.5)) * 0.55);
    out.lerp(_dirt, dirt);
  }
  return out;
}

// ---------- the mesh ----------

// One-unit cells across the walkable world, then cells that grow as they run
// out to the mountains — fine where the player stands, cheap where he cannot.
const FINE_HALF = 86;
const AXIS = (() => {
  const outer = [];
  let v = FINE_HALF;
  let step = 1.3;
  while (v < 450) {
    v += step;
    outer.push(v);
    step *= 1.28;
  }
  const fine = [];
  for (let u = -FINE_HALF; u <= FINE_HALF; u++) fine.push(u);
  return [...outer.map((o) => -o).reverse(), ...fine, ...outer];
})();
const N = AXIS.length;

// which way each cell is cut in two — mixed, so no diagonal grain shows
const cutFlipped = (i, j) => hash2(i * 7 + 3, j * 13 + 1) > 0.5;

// grid vertex positions, built once: the fine cells are jittered sideways for
// a hand-cut look; the outer ones stay square so surfaceHeight can find them
let grid = null;
function ensureGrid() {
  if (grid) return grid;
  const xs = new Float32Array(N * N);
  const ys = new Float32Array(N * N);
  const zs = new Float32Array(N * N);
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      let x = AXIS[i];
      let z = AXIS[j];
      if (Math.abs(x) < FINE_HALF && Math.abs(z) < FINE_HALF) {
        x += (hash2(i * 3 + 11, j * 5 + 2) - 0.5) * 0.62;
        z += (hash2(i * 9 + 4, j * 2 + 17) - 0.5) * 0.62;
      }
      const k = j * N + i;
      xs[k] = x;
      zs[k] = z;
      ys[k] = landHeight(x, z);
    }
  }
  grid = { xs, ys, zs };
  return grid;
}

function cellOf(v) {
  let lo = 0;
  let hi = N - 2;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (AXIS[mid] <= v) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

// Height of the drawn ground, for planting scenery. In the fine cells that is
// the analytic land (the mesh hugs it within centimetres); in the big outer
// cells it is read off the actual facet, or far trees would float and sink.
export function surfaceHeight(x, z) {
  if (Math.max(Math.abs(x), Math.abs(z)) <= FINE_HALF) return landHeight(x, z);
  const { ys } = ensureGrid();
  const i = cellOf(x);
  const j = cellOf(z);
  const u = Math.min(1, Math.max(0, (x - AXIS[i]) / (AXIS[i + 1] - AXIS[i])));
  const v = Math.min(1, Math.max(0, (z - AXIS[j]) / (AXIS[j + 1] - AXIS[j])));
  const a = ys[j * N + i];
  const b = ys[j * N + i + 1];
  const c = ys[(j + 1) * N + i];
  const d = ys[(j + 1) * N + i + 1];
  if (cutFlipped(i, j)) {
    // cut a–d
    return v >= u ? a + v * (c - a) + u * (d - c) : a + u * (b - a) + v * (d - b);
  }
  // cut b–c
  return u + v <= 1 ? a + u * (b - a) + v * (c - a) : d + (1 - u) * (c - d) + (1 - v) * (b - d);
}

export function buildTerrain() {
  const { xs, ys, zs } = ensureGrid();
  const cells = (N - 1) * (N - 1);
  const positions = new Float32Array(cells * 18);
  const colors = new Float32Array(cells * 18);
  const c = new THREE.Color();
  let o = 0;

  // one flat colour per triangle — the faceted low-poly look
  function tri(p, q, r) {
    const cx = (xs[p] + xs[q] + xs[r]) / 3;
    const cz = (zs[p] + zs[q] + zs[r]) / 3;
    groundColor(cx, cz, c);
    // faint per-face tonal jitter sells the facets
    const tone = 1 + (hash2(Math.round(cx * 31), Math.round(cz * 31)) - 0.5) * 0.085;
    for (const k of [p, q, r]) {
      positions[o] = xs[k];
      positions[o + 1] = ys[k];
      positions[o + 2] = zs[k];
      colors[o] = c.r * tone;
      colors[o + 1] = c.g * tone;
      colors[o + 2] = c.b * tone;
      o += 3;
    }
  }

  for (let j = 0; j < N - 1; j++) {
    for (let i = 0; i < N - 1; i++) {
      const a = j * N + i;
      const b = a + 1;
      const cc = a + N;
      const d = cc + 1;
      if (cutFlipped(i, j)) {
        tri(a, cc, d);
        tri(a, d, b);
      } else {
        tri(a, cc, b);
        tri(b, cc, d);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const mat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.name = 'terrain';
  return mesh;
}
