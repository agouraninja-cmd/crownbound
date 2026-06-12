import * as THREE from 'three';

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

const matCache = new Map();
export function mat(color) {
  if (!matCache.has(color)) {
    matCache.set(color, new THREE.MeshLambertMaterial({ color, flatShading: true }));
  }
  return matCache.get(color);
}

export function mesh(geo, color, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, shadow = true } = {}) {
  const m = new THREE.Mesh(geo, mat(color));
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  if (shadow) {
    m.castShadow = true;
    m.receiveShadow = true;
  }
  return m;
}

const FLASH_MAT = new THREE.MeshBasicMaterial({ color: 0xff5039 });

// hit feedback: briefly swap every material in the group for hot red
export function flash(group, ms = 90) {
  const restore = [];
  group.traverse((o) => {
    if (o.isMesh) {
      restore.push([o, o.material]);
      o.material = FLASH_MAT;
    }
  });
  setTimeout(() => {
    for (const [o, m] of restore) o.material = m;
  }, ms);
}

// paint a solid vertex color onto a geometry (for merged static scenery)
export function paint(geo, colorHex) {
  const c = new THREE.Color(colorHex);
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
