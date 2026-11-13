import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// deterministic rng so the world is identical every load
export function makeRng(seed) {
  let s = seed >>> 0;
  return function rng() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function smoothstep(x, a, b) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// ---------- value noise: deterministic, for ground tint and scatter ----------

// a repeatable 0..1 value for an integer lattice point
export function hash2(ix, iz) {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iz, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// smooth 0..1 noise
export function noise2(x, z) {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx);
  const uz = fz * fz * (3 - 2 * fz);
  const a = hash2(ix, iz);
  const b = hash2(ix + 1, iz);
  const c = hash2(ix, iz + 1);
  const d = hash2(ix + 1, iz + 1);
  return a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz;
}

// layered noise, still 0..1
export function fbm2(x, z, octaves = 3) {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += noise2(x, z) * amp;
    norm += amp;
    x = x * 2.03 + 11.7;
    z = z * 2.03 - 4.3;
    amp *= 0.5;
  }
  return sum / norm;
}

// ---------- hand-placed props: mesh() + bake() ----------

const matCache = new Map();
export function mat(color) {
  if (!matCache.has(color)) {
    const m = new THREE.MeshLambertMaterial({ color, flatShading: true });
    m.userData.shared = true; // bake() may fold meshes of this material together
    matCache.set(color, m);
  }
  return matCache.get(color);
}

// keep: true leaves the mesh out of bake() — for meshes the game moves,
// hides, or re-materials on its own (arms, the weapon, shop upgrades)
export function mesh(geo, color, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, shadow = true, keep = false } = {}) {
  const m = new THREE.Mesh(geo, mat(color));
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  if (shadow) {
    m.castShadow = true;
    m.receiveShadow = true;
  }
  if (keep) m.userData.keep = true;
  return m;
}

// The same colour a shade lighter or darker (k around 1). Boards, stones and
// straw each take their own, so nothing built from many pieces looks stamped.
export function tone(hex, k) {
  const r = Math.min(255, Math.round(((hex >> 16) & 255) * k));
  const g = Math.min(255, Math.round(((hex >> 8) & 255) * k));
  const b = Math.min(255, Math.round((hex & 255) * k));
  return (r << 16) | (g << 8) | b;
}

// the one material every baked prop shares: colour rides on the vertices
const BAKED = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });

function bakeable(o) {
  return (
    o.isMesh && o.visible && !o.userData.keep && o.children.length === 0 && o.material.userData.shared === true
  );
}

// Static batching for props built from many little mesh() boxes: each Group's
// own plain meshes are folded into ONE vertex-coloured mesh (two, if some skip
// shadows), so a 60-piece building costs a couple of draw calls instead of 60.
// Child Groups are baked separately and keep their transforms, so animated
// pivots (door leaf, heads, limbs) still move as before.
export function bake(root) {
  const cast = [];
  const plain = [];
  for (const child of [...root.children]) {
    if (bakeable(child)) {
      child.updateMatrix();
      const geo = child.geometry.index ? child.geometry.toNonIndexed() : child.geometry.clone();
      if (!geo.attributes.normal) geo.computeVertexNormals(); // hand-built soups carry none
      geo.applyMatrix4(child.matrix);
      for (const name of Object.keys(geo.attributes)) {
        if (name !== 'position' && name !== 'normal') geo.deleteAttribute(name);
      }
      paint(geo, child.material.color);
      (child.castShadow ? cast : plain).push(geo);
      root.remove(child);
    } else if (child.isGroup) {
      bake(child);
    }
  }
  for (const [geos, shadow] of [[cast, true], [plain, false]]) {
    if (!geos.length) continue;
    const merged = new THREE.Mesh(mergeGeometries(geos, false), BAKED);
    merged.castShadow = shadow;
    merged.receiveShadow = shadow;
    root.add(merged);
  }
  return root;
}

const FLASH_MAT = new THREE.MeshBasicMaterial({ color: 0xff5039 });
const flashing = new WeakMap(); // group -> { timeout, restore }

// Hit feedback: briefly swap every material in the group for hot red.
// Re-entrant: a hit landing while a flash is live only extends the timer —
// capturing materials mid-flash would save the red as the "original" and
// restore it forever (two rats biting within 90ms turned the player
// permanently red).
export function flash(group, ms = 90) {
  const live = flashing.get(group);
  if (live) {
    clearTimeout(live.timeout);
    live.timeout = setTimeout(() => {
      for (const [o, m] of live.restore) o.material = m;
      flashing.delete(group);
    }, ms);
    return;
  }
  const restore = [];
  group.traverse((o) => {
    if (o.isMesh) {
      restore.push([o, o.material]);
      o.material = FLASH_MAT;
    }
  });
  const timeout = setTimeout(() => {
    for (const [o, m] of restore) o.material = m;
    flashing.delete(group);
  }, ms);
  flashing.set(group, { timeout, restore });
}

// ---------- procedural scenery: paint / tint / batch ----------

// paint a solid vertex color onto a geometry (hex or THREE.Color)
export function paint(geo, color) {
  const c = color.isColor ? color : new THREE.Color(color);
  const count = geo.attributes.position.count;
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geo;
}

// strip a geometry down to bare, unshared triangles (position only) — the
// common footing every batched piece starts from
export function soup(geo) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  for (const name of Object.keys(g.attributes)) {
    if (name !== 'position') g.deleteAttribute(name);
  }
  return g;
}

const _c = new THREE.Color();

// Colour a triangle soup one FACE at a time (the faceted look): fn receives the
// face centroid (x, y, z), the face's upward-ness ny (-1..1), a Color to fill,
// and the rest of the unit face normal (nx, nz) for anything light-facing.
export function tintFaces(geo, fn) {
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i += 3) {
    const ax = pos.getX(i), ay = pos.getY(i), az = pos.getZ(i);
    const bx = pos.getX(i + 1), by = pos.getY(i + 1), bz = pos.getZ(i + 1);
    const cx = pos.getX(i + 2), cy = pos.getY(i + 2), cz = pos.getZ(i + 2);
    // face normal's y, from the cross product of two edges
    const ux = bx - ax, uy = by - ay, uz = bz - az;
    const vx = cx - ax, vy = cy - ay, vz = cz - az;
    const nx = uy * vz - uz * vy;
    const nyRaw = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, nyRaw, nz) || 1;
    fn((ax + bx + cx) / 3, (ay + by + cy) / 3, (az + bz + cz) / 3, nyRaw / len, _c, nx / len, nz / len);
    for (let k = 0; k < 3; k++) {
      colors[(i + k) * 3] = _c.r;
      colors[(i + k) * 3 + 1] = _c.g;
      colors[(i + k) * 3 + 2] = _c.b;
    }
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geo;
}

// Colour a geometry one VERTEX at a time — gradients across a facet (a bough
// dark at the stem and light at the tip). fn receives (x, y, z, Color to fill).
export function tintVerts(geo, fn) {
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) {
    fn(pos.getX(i), pos.getY(i), pos.getZ(i), _c);
    colors[i * 3] = _c.r;
    colors[i * 3 + 1] = _c.g;
    colors[i * 3 + 2] = _c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geo;
}

// Per-vertex wind weight (0 rooted … 1 free) from each vertex's position.
export function setSway(geo, fn) {
  const pos = geo.attributes.position;
  const sway = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i++) sway[i] = fn(pos.getX(i), pos.getY(i), pos.getZ(i));
  geo.setAttribute('sway', new THREE.BufferAttribute(sway, 1));
  return geo;
}

// Nudge every vertex by a repeatable amount keyed on its position, so the
// copies of a shared corner all move together and no cracks open.
export function roughen(geo, amount, seed = 0) {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const kx = Math.round(x * 1000) + seed * 7919;
    const ky = Math.round(y * 1000);
    const kz = Math.round(z * 1000);
    pos.setXYZ(
      i,
      x + (hash2(kx + ky * 31, kz) - 0.5) * 2 * amount,
      y + (hash2(ky + kz * 17, kx + 5) - 0.5) * 2 * amount,
      z + (hash2(kz + kx * 13, ky + 9) - 0.5) * 2 * amount
    );
  }
  return geo;
}

// A ragged low-poly cone — a pine bough, a thatch tuft. Each rim spoke gets its
// own reach and droop; the underside is a shallow dome so it reads from below.
export function raggedCone(r, h, seg, rng, jitter = 0.16) {
  const rim = [];
  const turn = rng() * Math.PI * 2;
  for (let i = 0; i < seg; i++) {
    const a = turn + (i / seg) * Math.PI * 2;
    const rr = r * (1 + (rng() - 0.5) * 2 * jitter);
    rim.push([Math.cos(a) * rr, (rng() - 0.5) * h * 0.14, Math.sin(a) * rr]);
  }
  const p = [];
  for (let i = 0; i < seg; i++) {
    const a = rim[i];
    const b = rim[(i + 1) % seg];
    p.push(0, h, 0, b[0], b[1], b[2], a[0], a[1], a[2]); // outer slope
    p.push(0, h * 0.16, 0, a[0], a[1], a[2], b[0], b[1], b[2]); // underside
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
  return geo;
}

// Collects placed pieces of procedural scenery and merges them into one mesh.
// Every piece must be a triangle soup carrying `color` (and `sway` if the batch
// is built with sway: true — pieces without it are treated as rooted).
export function makeBatch({ sway = false } = {}) {
  const geos = [];
  const m4 = new THREE.Matrix4();
  const quat = new THREE.Quaternion();
  const euler = new THREE.Euler();
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();
  return {
    add(geo, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1, sy = s } = {}) {
      euler.set(rx, ry, rz, 'YXZ'); // turn to face first, then lean
      quat.setFromEuler(euler);
      m4.compose(pos.set(x, y, z), quat, scl.set(s, sy, s));
      geo.applyMatrix4(m4);
      if (sway && !geo.attributes.sway) setSway(geo, () => 0);
      geos.push(geo);
    },
    get count() {
      return geos.length;
    },
    build(material, { cast = true, receive = true } = {}) {
      const merged = mergeGeometries(geos, false);
      merged.computeVertexNormals(); // unshared triangles → true face normals
      const m = new THREE.Mesh(merged, material);
      m.castShadow = cast;
      m.receiveShadow = receive;
      return m;
    },
  };
}
