import * as THREE from 'three';
import { makeRng, makeBatch, soup, roughen, tintFaces, smoothstep } from './meshUtils.js';
import { glowSprite, radialTexture } from './sprites.js';

// A fixed, warm late-afternoon. The sun never moves, so everything that
// depends on it — sky glow, cloud shading, the shadow box — is built once.
const SUN_OFFSET = new THREE.Vector3(38, 30, -22); // light position relative to what it lights
export const SUN_DIR = SUN_OFFSET.clone().normalize();

const ZENITH = new THREE.Color(0x4e83c2);
const SKY_MID = new THREE.Color(0x93bcdc);
const HORIZON = new THREE.Color(0xf1e0bd);
const GLOW = new THREE.Color(0xffcf8a); // the sun's side of the sky
const BELOW = new THREE.Color(0xdcc49c);
export const HAZE = 0xc4d2dc; // fog: distance dissolves into a pale blue haze

const SKY_RADIUS = 400;

// The sky rides with the camera (world.update re-centres it each frame) and
// never writes depth, so however far the land runs it is always behind it.
export function buildSky() {
  const sky = new THREE.Group();

  const geo = new THREE.SphereGeometry(SKY_RADIUS, 48, 28);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  const dir = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    dir.fromBufferAttribute(pos, i).normalize();
    const up = dir.y; // -1..1
    if (up >= 0) {
      // painterly: a pale warm band at the horizon, deepening to clear blue
      c.copy(HORIZON).lerp(SKY_MID, smoothstep(up, 0.0, 0.3)).lerp(ZENITH, smoothstep(up, 0.22, 0.95));
    } else {
      c.copy(HORIZON).lerp(BELOW, Math.min(1, -up * 4));
    }
    // the half of the sky around the sun is washed in gold, most of all low down
    const toSun = Math.max(0, dir.dot(SUN_DIR));
    c.lerp(GLOW, Math.pow(toSun, 3) * 0.6 * (1 - Math.max(0, up) * 0.45));
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const dome = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false, depthTest: false })
  );
  dome.renderOrder = -10; // painted first, everything else lands on top
  dome.frustumCulled = false;
  sky.add(dome);

  // the sun: a broad soft glow with a hot disc at its heart
  const at = SUN_DIR.clone().multiplyScalar(SKY_RADIUS * 0.94);
  const halo = glowSprite(0xffd9a0, 300, 0.5);
  halo.position.copy(at);
  const disc = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTexture([
        [0, 'rgba(255,250,232,1)'],
        [0.42, 'rgba(255,244,214,1)'],
        [0.5, 'rgba(255,226,170,0.55)'],
        [0.75, 'rgba(255,205,130,0.12)'],
        [1, 'rgba(255,200,120,0)'],
      ]),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      fog: false,
    })
  );
  disc.scale.set(64, 64, 1);
  disc.position.copy(at);
  sky.add(halo, disc);

  return sky;
}

const CLOUD_LIT = new THREE.Color(0xfff3dc); // sun-facing: warm white
const CLOUD_TOP = new THREE.Color(0xf3e6d6);
const CLOUD_SHADE = new THREE.Color(0xcdc8dc); // far side and belly: lavender grey

// Low-poly cumulus drifting round the valley: clumps of squashed, roughened
// blobs with flat bellies, shaded by hand toward the fixed sun. One mesh.
// Returns the mesh; world.update turns it slowly about the valley's centre.
export function buildClouds() {
  const rng = makeRng(4242);
  const batch = makeBatch();
  const dir = new THREE.Vector3();
  let made = 0;
  let guard = 0;
  while (made < 17 && guard++ < 80) {
    const ang = rng() * Math.PI * 2;
    const rad = 180 + rng() * 150;
    const y = 58 + rng() * 62;
    const cx = Math.cos(ang) * rad;
    const cz = Math.sin(ang) * rad;
    // keep the sun itself clear
    if (dir.set(cx, y, cz).normalize().dot(SUN_DIR) > 0.95) continue;
    const heading = rng() * Math.PI;
    const span = 26 + rng() * 36;
    const puffs = 4 + Math.floor(rng() * 4);
    for (let k = 0; k < puffs; k++) {
      const u = k / (puffs - 1) - 0.5; // -0.5..0.5 along the cloud
      const r = (9 + rng() * 7) * (1 - Math.abs(u) * 0.95);
      const g = soup(new THREE.IcosahedronGeometry(r, 1));
      roughen(g, r * 0.13, made * 16 + k);
      // a flat belly
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) if (p.getY(i) < -r * 0.3) p.setY(i, -r * 0.3);
      batch.add(g, {
        x: cx + Math.cos(heading) * u * span + (rng() - 0.5) * 4,
        y: y + r * 0.35 + (rng() - 0.5) * 3,
        z: cz + Math.sin(heading) * u * span + (rng() - 0.5) * 4,
        ry: rng() * Math.PI * 2,
        s: 1,
        sy: 0.62,
      });
      // shade each facet by how it faces the sun
      tintFaces(g, (fx, fy, fz, ny, out, nx, nz) => {
        const lit = nx * SUN_DIR.x + ny * SUN_DIR.y + nz * SUN_DIR.z;
        out.copy(CLOUD_SHADE).lerp(CLOUD_TOP, smoothstep(ny, -0.5, 0.6)).lerp(CLOUD_LIT, smoothstep(lit, 0.1, 0.9));
      });
    }
    made++;
  }
  const clouds = batch.build(new THREE.MeshBasicMaterial({ vertexColors: true, fog: false }), {
    cast: false,
    receive: false,
  });
  clouds.name = 'clouds';
  return clouds;
}

// Light: one shadow-casting sun, with a cool sky / warm earth fill so that
// shade reads blue-violet against the gold of the lit side.
export function addLighting(scene) {
  scene.fog = new THREE.Fog(HAZE, 45, 560);

  const hemi = new THREE.HemisphereLight(0xcfe3f6, 0xa98c60, 1.55);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffe0aa, 3.0);
  sun.position.copy(SUN_OFFSET);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const half = 40; // half-width of the shadowed box around the player
  sun.shadow.camera.left = -half;
  sun.shadow.camera.right = half;
  sun.shadow.camera.top = half;
  sun.shadow.camera.bottom = -half;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 150;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.035;
  scene.add(sun);
  scene.add(sun.target);

  // The shadow box follows the player so shadows exist wherever he walks. It
  // moves in whole shadow-texel steps along the light's own axes — otherwise
  // every shadow edge would shimmer as the box slid under it.
  const texel = (half * 2) / sun.shadow.mapSize.x;
  const fwd = SUN_DIR.clone().negate();
  const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
  const upAxis = new THREE.Vector3().crossVectors(right, fwd).normalize();
  const centre = new THREE.Vector3();
  function followShadow(focus) {
    const r = Math.round(focus.dot(right) / texel) * texel;
    const u = Math.round(focus.dot(upAxis) / texel) * texel;
    centre.copy(right).multiplyScalar(r).addScaledVector(upAxis, u).addScaledVector(fwd, focus.dot(fwd));
    sun.target.position.copy(centre);
    sun.position.copy(centre).add(SUN_OFFSET);
  }

  return { sun, hemi, followShadow };
}
