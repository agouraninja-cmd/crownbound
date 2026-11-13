import * as THREE from 'three';
import { mesh, bake, tone, makeRng, tintVerts } from './meshUtils.js';
import { campfireTier } from '../state/config.js';
import { softDotTexture, glowSprite } from './sprites.js';
import { createPuffs } from './particles.js';

// flameScale, light intensity, light distance, ember spawn rate /s
const TIER_PARAMS = {
  embers: { flame: 0, light: 0.9, dist: 4.5, rate: 3 },
  small: { flame: 0.55, light: 4, dist: 8, rate: 8 },
  healthy: { flame: 1.0, light: 8, dist: 11, rate: 14 },
  roaring: { flame: 1.45, light: 14, dist: 15, rate: 24 },
};

// an untended fire (today's daily not yet done) burns at this fraction of its tier
const GUTTER = 0.45;

const MAX_PARTICLES = 60;

const FLAME_ROOT = new THREE.Color(0xe2481a);
const FLAME_MID = new THREE.Color(0xff8c1f);
const FLAME_TIP = new THREE.Color(0xffd45e);
const HEART_TIP = new THREE.Color(0xfff0a8);

// One tongue of flame: a slim cone standing on its base, red at the root and
// yellow at the tip. `heart` is the hotter, paler tongue at the fire's centre.
function tongue(radius, height, heart) {
  const geo = new THREE.ConeGeometry(radius, height, 5);
  geo.translate(0, height / 2, 0); // scale from the root, not the middle
  tintVerts(geo, (x, y, z, out) => {
    const k = y / height;
    if (heart) out.copy(FLAME_MID).lerp(HEART_TIP, Math.min(1, k * 1.3));
    else out.copy(FLAME_ROOT).lerp(FLAME_MID, Math.min(1, k * 2)).lerp(FLAME_TIP, Math.max(0, k * 2 - 1));
  });
  return geo;
}

export function createCampfire() {
  const group = new THREE.Group();
  const rng = makeRng(606);

  // stone ring, a bed of ash, charred logs
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + rng() * 0.25;
    const s = 0.14 + rng() * 0.09;
    const rock = mesh(new THREE.IcosahedronGeometry(s, 0), tone(i % 2 ? 0x7c7a72 : 0x8d8a82, 0.9 + rng() * 0.2), {
      x: Math.cos(a) * 0.64, y: s * 0.45, z: Math.sin(a) * 0.64, ry: rng() * 6, rx: rng() * 2,
    });
    rock.scale.y = 0.75;
    group.add(rock);
  }
  group.add(mesh(new THREE.CylinderGeometry(0.5, 0.56, 0.06, 9), 0x3a332c, { y: 0.02, shadow: false }));
  const log = (ry, lift = 0.16, tilt = Math.PI / 2.3) =>
    mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.95, 6), tone(0x4a3527, 0.85 + rng() * 0.3), { y: lift, rz: tilt, ry });
  group.add(log(0.3), log(1.7), log(2.9), log(4.3, 0.3, 0.95), log(5.6, 0.3, 0.95));

  // the coals at its heart: they glow even when no flame stands
  const coals = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.3, 0.07, 7),
    new THREE.MeshBasicMaterial({ color: 0xd96a2a, fog: false })
  );
  coals.position.y = 0.07;
  group.add(coals);

  // the flame: a hot pale heart with a ring of redder tongues about it, each
  // dancing to its own time (unlit — they ARE the light source visually)
  const flameMat = new THREE.MeshBasicMaterial({ vertexColors: true, fog: false });
  const tongues = [];
  const addTongue = (radius, height, x, z, heart = false) => {
    const m = new THREE.Mesh(tongue(radius, height, heart), flameMat);
    m.position.set(x, 0.1, z);
    group.add(m);
    tongues.push({ mesh: m, phase: rng() * 6.28, speed: 7 + rng() * 6 });
  };
  addTongue(0.2, 1.0, 0, 0, true);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.5;
    addTongue(0.15 + rng() * 0.05, 0.55 + rng() * 0.3, Math.cos(a) * 0.17, Math.sin(a) * 0.17);
  }

  // a soft halo of firelight around it
  const halo = glowSprite(0xff9a3d, 3, 0.4);
  halo.position.y = 0.6;
  group.add(halo);

  const light = new THREE.PointLight(0xff9a3d, 4, 8, 2);
  light.position.set(0, 0.9, 0);
  group.add(light);

  // sparks
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
    size: 0.13, map: softDotTexture(), vertexColors: true, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
  });
  const points = new THREE.Points(pGeo, pMat);
  points.frustumCulled = false;
  group.add(points);

  // woodsmoke, thin and pale, climbing off the fire
  const smoke = createPuffs({ max: 26 });
  group.add(smoke.points);
  const SMOKE_NEW = new THREE.Color(0x5a534c);
  const SMOKE_OLD = new THREE.Color(0xa39d95);

  const EMBER = new THREE.Color(0xffb13d);
  const EMBER_DIM = new THREE.Color(0x99311c);
  const BLACK = new THREE.Color(0x000000);

  let params = TIER_PARAMS.embers;
  let spawnAcc = 0;
  let smokeAcc = 0;
  let t = 0;
  let gutter = 1; // eases toward gutterTarget so the fire swells, not pops
  let gutterTarget = 1;

  function setStreak(streak, tendedToday = true) {
    params = TIER_PARAMS[campfireTier(streak)];
    gutterTarget = tendedToday ? 1 : GUTTER;
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
    gutter += (gutterTarget - gutter) * (1 - Math.exp(-dt * 2.5));

    // a guttering fire flickers harder — unsteady, starved of its deed
    const unsteady = 1 + (1 - gutter) * 1.5;
    const flicker = 1 + (Math.sin(t * 12.7) * 0.07 + Math.sin(t * 31.1) * 0.05) * unsteady;
    const fs = Math.max(params.flame * gutter * flicker, 0.001);
    for (const tg of tongues) {
      tg.mesh.visible = params.flame > 0;
      const w = Math.sin(t * tg.speed + tg.phase);
      const lick = 1 + w * 0.2 + Math.sin(t * tg.speed * 2.3 + tg.phase) * 0.08 * unsteady;
      tg.mesh.scale.set(fs * (1 - w * 0.1), fs * lick, fs * (1 + w * 0.1));
      tg.mesh.rotation.z = Math.sin(t * tg.speed * 0.6 + tg.phase) * 0.14;
      tg.mesh.rotation.x = Math.cos(t * tg.speed * 0.45 + tg.phase) * 0.12;
    }

    const glow = (1 + (Math.sin(t * 9.3) * 0.12 + Math.sin(t * 23.7) * 0.08) * unsteady) * gutter;
    light.intensity = params.light * glow;
    light.distance = params.dist * (0.7 + 0.3 * gutter);
    const haloSize = 1.4 + params.flame * 2.2 * gutter;
    halo.scale.set(haloSize * (0.94 + glow * 0.06), haloSize * (0.94 + glow * 0.06), 1);
    halo.material.opacity = 0.22 + 0.2 * Math.min(1, glow);
    coals.material.color.setRGB(0.72 + 0.14 * glow, 0.36 + 0.07 * glow, 0.14);

    spawnAcc += dt * params.rate * gutter;
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
      // sparks glow gold, redden, and wink out (they add light, so black = gone)
      const k = p.alive ? p.life / p.maxLife : 1;
      tmpC.copy(EMBER).lerp(EMBER_DIM, Math.min(1, k * 1.4));
      if (k > 0.6) tmpC.lerp(BLACK, (k - 0.6) / 0.4);
      colors[i * 3] = tmpC.r;
      colors[i * 3 + 1] = tmpC.g;
      colors[i * 3 + 2] = tmpC.b;
    }
    pGeo.attributes.position.needsUpdate = true;
    pGeo.attributes.color.needsUpdate = true;

    // smoke: a wisp off the coals, a steady column off a real fire
    smokeAcc += dt * (1.2 + params.flame * 3.2) * (0.5 + 0.5 * gutter);
    while (smokeAcc >= 1) {
      smokeAcc -= 1;
      smoke.spawn({
        x: (Math.random() - 0.5) * 0.25,
        y: 0.5 + params.flame * gutter * 0.6,
        z: (Math.random() - 0.5) * 0.25,
        vx: 0.12 + Math.random() * 0.16, // the wind carries it off
        vy: 0.55 + Math.random() * 0.3,
        vz: 0.05 + Math.random() * 0.1,
        life: 3.2 + Math.random() * 1.6,
        size0: 0.3,
        size1: 1.3 + params.flame * 0.5,
        alpha: 0.2,
        from: SMOKE_NEW,
        to: SMOKE_OLD,
      });
    }
    smoke.update(dt);
  }

  bake(group);
  setStreak(0);
  return { group, setStreak, update, getGutter: () => gutterTarget };
}
