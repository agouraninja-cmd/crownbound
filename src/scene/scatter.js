import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { makeRng, paint } from './meshUtils.js';
import { terrainHeight, distToPath } from './terrain.js';

const FOLIAGE = [0x3f6b35, 0x4a7a3a, 0x557f3d, 0x647a36];
const TRUNK = 0x6b4a2f;
const ROCKS = [0x8d8a82, 0x7c7a72, 0x96907f];

// Trees + rocks merged into ONE mesh (vertex-colored) to keep draw calls low.
// Returns { mesh, colliders: [{x, z, r}] }
export function buildScatter() {
  const rng = makeRng(1337);
  const geos = [];
  const colliders = [];
  const m4 = new THREE.Matrix4();

  function place(geo, colorHex, x, y, z, ry, s) {
    paint(geo, colorHex);
    m4.makeRotationY(ry);
    m4.scale(new THREE.Vector3(s, s, s));
    m4.setPosition(x, y, z);
    geo.applyMatrix4(m4);
    geos.push(geo.toNonIndexed ? geo.toNonIndexed() : geo);
  }

  // pine trees in a ring around the clearing
  let placed = 0;
  let guard = 0;
  while (placed < 42 && guard++ < 400) {
    const ang = rng() * Math.PI * 2;
    const rad = 21 + rng() * 52;
    const x = Math.cos(ang) * rad;
    const z = Math.sin(ang) * rad;
    if (distToPath(x, z) < 6) continue;
    const y = terrainHeight(x, z);
    const s = 0.8 + rng() * 0.9;
    const ry = rng() * Math.PI * 2;
    const lean = (rng() - 0.5) * 0.06;

    const trunk = new THREE.CylinderGeometry(0.14, 0.22, 1.2, 5);
    trunk.translate(0, 0.6, 0);
    trunk.rotateZ(lean);
    place(trunk, TRUNK, x, y, z, ry, s);

    const foliage = FOLIAGE[Math.floor(rng() * FOLIAGE.length)];
    let coneY = 1.0;
    let coneR = 1.5 + rng() * 0.4;
    for (let tier = 0; tier < 3; tier++) {
      const h = 1.5 - tier * 0.25;
      const cone = new THREE.ConeGeometry(coneR, h, 6);
      cone.translate((rng() - 0.5) * 0.1, coneY + h / 2, (rng() - 0.5) * 0.1);
      place(cone, foliage, x, y, z, ry, s);
      coneY += h * 0.62;
      coneR *= 0.72;
    }

    colliders.push({ x, z, r: 0.45 * s });
    placed++;
  }

  // rocks, a few drifting into the clearing
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
    const rock = new THREE.IcosahedronGeometry(s, 0);
    rock.scale(1, 0.65 + rng() * 0.3, 1);
    const y = terrainHeight(x, z) + s * 0.18;
    place(rock, ROCKS[Math.floor(rng() * ROCKS.length)], x, y, z, rng() * Math.PI * 2, 1);
    if (s > 0.55) colliders.push({ x, z, r: s * 0.85 });
    placed++;
  }

  const merged = mergeGeometries(geos, false);
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
  const mesh = new THREE.Mesh(merged, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.name = 'scatter';
  return { mesh, colliders };
}
