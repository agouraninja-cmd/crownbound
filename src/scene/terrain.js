import * as THREE from 'three';
import { pathX, LAYOUT } from './layout.js';

const SIZE = 170;
const SEGMENTS = 128;

function smoothstep(x, a, b) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

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

const GRASS_A = new THREE.Color(0x76a04e);
const GRASS_B = new THREE.Color(0x5d8a40);
const GRASS_DRY = new THREE.Color(0x9aa050);
const DIRT = new THREE.Color(0x96703f);
const DIRT_DARK = new THREE.Color(0x7d5c34);

export function buildTerrain() {
  const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, terrainHeight(x, z));

    // grass with gentle patchy variation
    const n = Math.sin(x * 0.21 + 3.1) * Math.cos(z * 0.17 + 1.4) * 0.5 + 0.5;
    c.copy(GRASS_A).lerp(GRASS_B, n);
    const dry = Math.sin(x * 0.09 - 2.0) * Math.cos(z * 0.11 + 0.8) * 0.5 + 0.5;
    c.lerp(GRASS_DRY, dry * 0.35);

    // dirt path with soft edges
    const d = distToPath(x, z);
    let dirtAmt = 1 - smoothstep(d, 1.8, 3.8);

    // worn circles around hearth, hovel, dummy, granary
    for (const p of LAYOUT.dirtPatches) {
      const dd = Math.hypot(x - p.x, z - p.z);
      dirtAmt = Math.max(dirtAmt, 1 - smoothstep(dd, p.r * 0.6, p.r * 1.5));
    }

    if (dirtAmt > 0) {
      const dn = Math.sin(x * 0.9 + 1.2) * Math.cos(z * 0.8) * 0.5 + 0.5;
      const dirt = DIRT.clone().lerp(DIRT_DARK, dn * 0.6);
      c.lerp(dirt, dirtAmt);
    }

    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const mat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  mesh.name = 'terrain';
  return mesh;
}
