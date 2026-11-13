import * as THREE from 'three';
import { makeRng } from './meshUtils.js';
import { terrainHeight } from './terrain.js';
import { softDotTexture } from './sprites.js';
import { createPuffs } from './particles.js';

// Ambient life — nothing here touches the game, it only keeps the valley from
// standing still: smoke from the hovel's roof, motes adrift in the sunlight,
// birds wheeling high over the wood, butterflies at the flower patches.
// buildAmbient returns { group, update(dt, camera) }; five draw calls in all.

const SMOKE_NEW = new THREE.Color(0x6a635b);
const SMOKE_OLD = new THREE.Color(0xb5afa6);

// A flock of tiny two-triangle fliers in one dynamic mesh. Each flier is a
// body edge (nose → tail) with a wing tip to either side; place() writes one.
function makeFliers(count, material) {
  const positions = new Float32Array(count * 18);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mesh = new THREE.Mesh(geo, material);
  mesh.frustumCulled = false; // they roam; the mesh is a few dozen triangles
  return {
    mesh,
    geo,
    // x, y, z: the body's middle · (fx, fz): unit heading · body, span: sizes · lift: wing-tip height
    place(i, x, y, z, fx, fz, body, span, lift) {
      const o = i * 18;
      const nx = x + fx * body;
      const nz = z + fz * body;
      const tx = x - fx * body;
      const tz = z - fz * body;
      const rx = -fz * span; // to the flier's right
      const rz = fx * span;
      const bx = x - fx * body * 0.3; // the wings sit a little behind the middle
      const bz = z - fz * body * 0.3;
      // left wing: nose, tail, left tip — right wing: tail, nose, right tip
      // (written out value by value: this runs for every flier, every frame)
      positions[o] = nx; positions[o + 1] = y; positions[o + 2] = nz;
      positions[o + 3] = tx; positions[o + 4] = y; positions[o + 5] = tz;
      positions[o + 6] = bx - rx; positions[o + 7] = y + lift; positions[o + 8] = bz - rz;
      positions[o + 9] = tx; positions[o + 10] = y; positions[o + 11] = tz;
      positions[o + 12] = nx; positions[o + 13] = y; positions[o + 14] = nz;
      positions[o + 15] = bx + rx; positions[o + 16] = y + lift; positions[o + 17] = bz + rz;
    },
  };
}

// smokeAt      world { x, y, z } of the hovel's smoke hole
// flowerSpots  world [{ x, z }] of flower patches the butterflies may keep to
export function buildAmbient({ smokeAt, flowerSpots }) {
  const group = new THREE.Group();
  group.name = 'ambient';
  const rng = makeRng(8128);
  let t = 0;

  // ---- hearth smoke from the roof ----
  const smoke = createPuffs({ max: 30 });
  group.add(smoke.points);
  let smokeAcc = 0;

  // ---- motes: pollen and dust, catching the light around the camera ----
  const MOTES = 110;
  const SPAN = 18; // the box they live in, re-wrapped around the camera
  const TALL = 6;
  const motePos = new Float32Array(MOTES * 3);
  const moteCol = new Float32Array(MOTES * 3);
  const motes = [];
  for (let i = 0; i < MOTES; i++) {
    motePos[i * 3] = (rng() - 0.5) * SPAN;
    motePos[i * 3 + 1] = rng() * TALL;
    motePos[i * 3 + 2] = (rng() - 0.5) * SPAN;
    motes.push({ phase: rng() * 6.28, speed: 0.6 + rng() * 1.2, drift: 0.5 + rng() });
  }
  const moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
  moteGeo.setAttribute('color', new THREE.BufferAttribute(moteCol, 3));
  const moteMesh = new THREE.Points(
    moteGeo,
    new THREE.PointsMaterial({
      size: 0.055, map: softDotTexture(), vertexColors: true, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
    })
  );
  moteMesh.frustumCulled = false;
  group.add(moteMesh);

  // ---- birds, wheeling high over the wood ----
  const birds = [];
  for (let i = 0; i < 6; i++) {
    birds.push({
      cx: (rng() - 0.5) * 70,
      cz: (rng() - 0.5) * 70,
      r: 22 + rng() * 42,
      h: 24 + rng() * 18,
      w: (0.05 + rng() * 0.05) * (rng() < 0.5 ? -1 : 1), // radians per second round the circle
      phase: rng() * 6.28,
    });
  }
  const birdFlock = makeFliers(birds.length, new THREE.MeshBasicMaterial({ color: 0x2f2d36, side: THREE.DoubleSide }));
  group.add(birdFlock.mesh);

  // ---- butterflies, each keeping to a flower patch near the village ----
  const WINGS = [0xf4efe2, 0xf0c93a, 0xe8923a, 0xa9c2e8];
  const homes = flowerSpots.filter((p) => Math.hypot(p.x, p.z) < 30).slice(0, 9);
  const flies = homes.map((p) => ({ x: p.x, z: p.z, phase: rng() * 6.28, speed: 0.7 + rng() * 0.5, reach: 1.1 + rng() * 0.9 }));
  const flutter = makeFliers(Math.max(1, flies.length), new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }));
  const wingCol = new Float32Array(Math.max(1, flies.length) * 18);
  flies.forEach((f, i) => {
    const c = new THREE.Color(WINGS[i % WINGS.length]);
    for (let v = 0; v < 6; v++) wingCol.set([c.r, c.g, c.b], i * 18 + v * 3);
  });
  flutter.geo.setAttribute('color', new THREE.BufferAttribute(wingCol, 3));
  group.add(flutter.mesh);

  function update(dt, camera) {
    t += dt;

    // smoke: a slow column, leaning with the wind
    smokeAcc += dt * 3;
    while (smokeAcc >= 1) {
      smokeAcc -= 1;
      smoke.spawn({
        x: smokeAt.x + (Math.random() - 0.5) * 0.2,
        y: smokeAt.y,
        z: smokeAt.z + (Math.random() - 0.5) * 0.15,
        vx: 0.2 + Math.random() * 0.2,
        vy: 0.5 + Math.random() * 0.25,
        vz: 0.08 + Math.random() * 0.12,
        life: 4.5 + Math.random() * 2,
        size0: 0.3,
        size1: 1.7,
        alpha: 0.24,
        from: SMOKE_NEW,
        to: SMOKE_OLD,
      });
    }
    smoke.update(dt);

    // motes: drift downwind, bob, twinkle; wrap so the box always surrounds the camera
    const cx = camera.position.x;
    const cy = camera.position.y;
    const cz = camera.position.z;
    for (let i = 0; i < MOTES; i++) {
      const m = motes[i];
      const o = i * 3;
      let x = motePos[o] + (0.22 * m.drift + Math.sin(t * 0.5 + m.phase) * 0.08) * dt;
      let y = motePos[o + 1] + Math.sin(t * m.speed + m.phase) * 0.12 * dt;
      let z = motePos[o + 2] + (0.1 * m.drift + Math.cos(t * 0.4 + m.phase) * 0.08) * dt;
      if (x - cx > SPAN / 2) x -= SPAN;
      else if (x - cx < -SPAN / 2) x += SPAN;
      if (z - cz > SPAN / 2) z -= SPAN;
      else if (z - cz < -SPAN / 2) z += SPAN;
      if (y - cy > TALL / 2) y -= TALL;
      else if (y - cy < -TALL / 2) y += TALL;
      motePos[o] = x;
      motePos[o + 1] = y;
      motePos[o + 2] = z;
      const glint = 0.12 + 0.34 * Math.max(0, Math.sin(t * m.speed * 1.7 + m.phase));
      moteCol[o] = glint;
      moteCol[o + 1] = glint * 0.93;
      moteCol[o + 2] = glint * 0.74;
    }
    moteGeo.attributes.position.needsUpdate = true;
    moteGeo.attributes.color.needsUpdate = true;

    // birds: wide slow circles, a lazy wingbeat
    birds.forEach((b, i) => {
      const a = b.phase + b.w * t;
      const dir = Math.sign(b.w);
      birdFlock.place(
        i,
        b.cx + Math.cos(a) * b.r,
        b.h + Math.sin(t * 0.3 + b.phase) * 1.5,
        b.cz + Math.sin(a) * b.r,
        -Math.sin(a) * dir,
        Math.cos(a) * dir,
        0.34,
        1.0,
        Math.sin(t * 3.2 + b.phase) * 0.36 + 0.1
      );
    });
    birdFlock.geo.attributes.position.needsUpdate = true;

    // butterflies: a wandering loop over the patch, wings beating fast
    flies.forEach((f, i) => {
      const p = f.phase + t * f.speed;
      const x = f.x + Math.sin(p) * f.reach + Math.sin(p * 2.3) * 0.4;
      const z = f.z + Math.cos(p * 0.8) * f.reach + Math.cos(p * 1.9) * 0.4;
      // heading from the loop's own derivative
      const vx = Math.cos(p) * f.reach + Math.cos(p * 2.3) * 0.92;
      const vz = -Math.sin(p * 0.8) * f.reach * 0.8 - Math.sin(p * 1.9) * 0.76;
      const v = Math.hypot(vx, vz) || 1;
      const y = terrainHeight(x, z) + 0.55 + Math.sin(p * 3.1) * 0.22;
      flutter.place(i, x, y, z, vx / v, vz / v, 0.035, 0.085, Math.abs(Math.sin(t * 13 + f.phase)) * 0.085);
    });
    flutter.geo.attributes.position.needsUpdate = true;
  }

  return { group, update };
}
