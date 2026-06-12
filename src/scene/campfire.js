import * as THREE from 'three';
import { mesh } from './meshUtils.js';
import { campfireTier } from '../state/config.js';

// flameScale, light intensity, light distance, ember spawn rate /s
const TIER_PARAMS = {
  embers: { flame: 0, light: 0.9, dist: 4.5, rate: 3 },
  small: { flame: 0.55, light: 4, dist: 8, rate: 8 },
  healthy: { flame: 1.0, light: 8, dist: 11, rate: 14 },
  roaring: { flame: 1.45, light: 14, dist: 15, rate: 24 },
};

const MAX_PARTICLES = 60;

export function createCampfire() {
  const group = new THREE.Group();

  // stone ring
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const s = 0.16 + (i % 3) * 0.04;
    const rock = mesh(new THREE.IcosahedronGeometry(s, 0), 0x7c7a72, {
      x: Math.cos(a) * 0.62, y: 0.1, z: Math.sin(a) * 0.62, ry: a,
    });
    group.add(rock);
  }
  // charred logs
  const log = (ry) =>
    mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.95, 6), 0x4a3527, { y: 0.16, rz: Math.PI / 2.3, ry });
  group.add(log(0.3), log(1.7), log(2.9));

  // flame: two basic-material cones (unlit, they ARE the light source visually)
  const flameOuter = new THREE.Mesh(
    new THREE.ConeGeometry(0.34, 1.0, 7),
    new THREE.MeshBasicMaterial({ color: 0xff7d26, transparent: true, opacity: 0.92, fog: false })
  );
  const flameInner = new THREE.Mesh(
    new THREE.ConeGeometry(0.18, 0.66, 6),
    new THREE.MeshBasicMaterial({ color: 0xffd66e, fog: false })
  );
  flameOuter.position.y = 0.62;
  flameInner.position.y = 0.5;
  group.add(flameOuter, flameInner);

  const light = new THREE.PointLight(0xff9a3d, 4, 8, 2);
  light.position.set(0, 0.9, 0);
  group.add(light);

  // ember particles
  const positions = new Float32Array(MAX_PARTICLES * 3);
  const colors = new Float32Array(MAX_PARTICLES * 3);
  const particles = [];
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push({ alive: false, life: 0, maxLife: 1, vx: 0, vy: 0, vz: 0, x: 0, y: -99, z: 0 });
    positions[i * 3 + 1] = -99;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.09, vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false, fog: false,
  });
  const points = new THREE.Points(pGeo, pMat);
  points.frustumCulled = false;
  group.add(points);

  const EMBER = new THREE.Color(0xffb13d);
  const EMBER_DIM = new THREE.Color(0x99311c);
  const SMOKE = new THREE.Color(0x55504a);

  let params = TIER_PARAMS.embers;
  let spawnAcc = 0;
  let t = 0;

  function setStreak(streak) {
    params = TIER_PARAMS[campfireTier(streak)];
  }

  function spawn() {
    const p = particles.find((q) => !q.alive);
    if (!p) return;
    p.alive = true;
    p.life = 0;
    p.maxLife = 0.9 + Math.random() * 1.3;
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.25;
    p.x = Math.cos(a) * r;
    p.z = Math.sin(a) * r;
    p.y = 0.25 + Math.random() * 0.3;
    p.vx = (Math.random() - 0.5) * 0.25;
    p.vz = (Math.random() - 0.5) * 0.25;
    p.vy = 0.8 + Math.random() * 0.8 + params.flame * 0.5;
  }

  const tmpC = new THREE.Color();

  function update(dt) {
    t += dt;

    const flicker = 1 + Math.sin(t * 12.7) * 0.07 + Math.sin(t * 31.1) * 0.05;
    const fs = params.flame * flicker;
    flameOuter.visible = flameInner.visible = params.flame > 0;
    flameOuter.scale.set(Math.max(fs, 0.001), Math.max(fs, 0.001), Math.max(fs, 0.001));
    flameInner.scale.copy(flameOuter.scale);
    flameOuter.rotation.y = t * 0.9;
    flameInner.rotation.y = -t * 1.3;

    light.intensity = params.light * (1 + Math.sin(t * 9.3) * 0.12 + Math.sin(t * 23.7) * 0.08);
    light.distance = params.dist;

    spawnAcc += dt * params.rate;
    while (spawnAcc >= 1) {
      spawnAcc -= 1;
      spawn();
    }

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = particles[i];
      if (p.alive) {
        p.life += dt;
        if (p.life >= p.maxLife) {
          p.alive = false;
          p.y = -99;
        } else {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.z += p.vz * dt;
          p.vx += (Math.random() - 0.5) * dt * 1.5;
          p.vz += (Math.random() - 0.5) * dt * 1.5;
        }
      }
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
      const k = p.alive ? p.life / p.maxLife : 1;
      tmpC.copy(EMBER).lerp(EMBER_DIM, Math.min(1, k * 1.4));
      if (k > 0.6) tmpC.lerp(SMOKE, (k - 0.6) / 0.4);
      colors[i * 3] = tmpC.r;
      colors[i * 3 + 1] = tmpC.g;
      colors[i * 3 + 2] = tmpC.b;
    }
    pGeo.attributes.position.needsUpdate = true;
    pGeo.attributes.color.needsUpdate = true;
  }

  setStreak(0);
  return { group, setStreak, update };
}
