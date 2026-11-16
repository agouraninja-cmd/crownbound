import * as THREE from 'three';
import { makeRng, makeBatch, soup, roughen, smoothstep } from './meshUtils.js';
import { radialTexture, softDotTexture } from './sprites.js';
import { skyAt, skyPole, compass, daylight } from './daylight.js';
import { CONFIG } from '../state/config.js';

// The sky keeps the hour of the real day. daylight.js says where the sun and
// moon stand by the player's own clock; this file paints it: the dome, the
// sun, the moon in her true phase, the stars, the clouds, the fog, and the
// light everything else is seen by. The sun moves a hair in a few seconds, so
// the whole look is repainted on a slow beat (CONFIG.sky.refresh), not per frame.

// ---------- the looks of the day ----------
// One row per height of the sun (degrees over the horizon), from black night
// to full day; between two rows every colour and number is blended. Dawn and
// dusk wear the same rows.
//   zenith/mid/horizon/below  the dome, top to bottom
//   glow, wash   the colour laid over the sun's side of the sky, and how much
//   haze         the fog the distance dissolves into
//   hemiSky/hemiGround, hemi  the fill light and its strength
//   key, keyPower             the one shadow-casting light: the sun — or, by
//                             night, the moon
//   cloudLit/cloudTop/cloudShade  a cloud's facets: toward the light, upward, away
//   veil         the tint for unlit things (smoke, butterflies): daylight.veil
const LOOKS = [
  {
    alt: -14, // night
    zenith: 0x070d26, mid: 0x0e1836, horizon: 0x1a2648, below: 0x10162c, glow: 0x1a2648, wash: 0,
    haze: 0x162040, hemiSky: 0x5a74b8, hemiGround: 0x262a44, hemi: 0.78, key: 0xa8bcf0, keyPower: 1.2,
    cloudLit: 0x55689c, cloudTop: 0x2e3a64, cloudShade: 0x141c3a, veil: 0x3c4668,
  },
  {
    alt: -8, // the last of the dusk: the light is gone, the stars are coming
    zenith: 0x14224e, mid: 0x283868, horizon: 0x55588a, below: 0x2a2c48, glow: 0x8a5a70, wash: 0.4,
    haze: 0x363f66, hemiSky: 0x6274b0, hemiGround: 0x33324c, hemi: 0.92, key: 0xa8bcf0, keyPower: 0,
    cloudLit: 0x5c608e, cloudTop: 0x3c4672, cloudShade: 0x202a50, veil: 0x5a6088,
  },
  {
    alt: -4, // dusk: the sun is down, its afterglow stands where it sank
    zenith: 0x24386e, mid: 0x5a5c92, horizon: 0xc47f78, below: 0x5c4c5c, glow: 0xf0703c, wash: 0.65,
    haze: 0x7b6f8a, hemiSky: 0x8088bc, hemiGround: 0x54465a, hemi: 1.1, key: 0xff8f52, keyPower: 0,
    cloudLit: 0xc07a80, cloudTop: 0x7a6a96, cloudShade: 0x3c4270, veil: 0x8c88a8,
  },
  {
    alt: 0, // sunset
    zenith: 0x3b5b96, mid: 0x9d92b6, horizon: 0xf4a56c, below: 0xa9805e, glow: 0xff7436, wash: 0.9,
    haze: 0xc8a493, hemiSky: 0xb9acd0, hemiGround: 0x8a6650, hemi: 1.1, key: 0xff8f52, keyPower: 1.5,
    cloudLit: 0xff9c68, cloudTop: 0xd992a0, cloudShade: 0x75709e, veil: 0xe0b8a8,
  },
  {
    alt: 6, // the golden hour
    zenith: 0x4878b4, mid: 0x9fb4cf, horizon: 0xf7d29a, below: 0xd8b488, glow: 0xffa64d, wash: 0.8,
    haze: 0xd6c4ac, hemiSky: 0xd4d3e6, hemiGround: 0xa58258, hemi: 1.35, key: 0xffbe78, keyPower: 2.7,
    cloudLit: 0xffd49a, cloudTop: 0xf0cdb8, cloudShade: 0xb0a6c4, veil: 0xffe8d0,
  },
  {
    alt: 20, // day, and everything above it
    zenith: 0x4e83c2, mid: 0x93bcdc, horizon: 0xf1e0bd, below: 0xdcc49c, glow: 0xffcf8a, wash: 0.6,
    haze: 0xc4d2dc, hemiSky: 0xcfe3f6, hemiGround: 0xa98c60, hemi: 1.55, key: 0xffe0aa, keyPower: 3.0,
    cloudLit: 0xfff3dc, cloudTop: 0xf3e6d6, cloudShade: 0xcdc8dc, veil: 0xffffff,
  },
];
const COLOURS = ['zenith', 'mid', 'horizon', 'below', 'glow', 'haze', 'hemiSky', 'hemiGround', 'key', 'cloudLit', 'cloudTop', 'cloudShade', 'veil'];
const NUMBERS = ['wash', 'hemi', 'keyPower'];
for (const row of LOOKS) for (const name of COLOURS) row[name] = new THREE.Color(row[name]);

// the look for a sun `alt` degrees up, blended into `out`
function lookFor(alt, out) {
  let i = 0;
  while (i < LOOKS.length - 2 && alt > LOOKS[i + 1].alt) i++;
  const a = LOOKS[i];
  const b = LOOKS[i + 1];
  const t = Math.min(1, Math.max(0, (alt - a.alt) / (b.alt - a.alt)));
  for (const name of COLOURS) out[name].lerpColors(a[name], b[name], t);
  for (const name of NUMBERS) out[name] = a[name] + (b[name] - a[name]) * t;
  return out;
}

const SKY_RADIUS = 400;

// The sun, moon and stars are painted straight after the dome and before any
// land (renderOrder, no depth, and NOT flagged transparent — that would send
// them to the late pass, on top of the hills). So the land and the clouds
// simply cover them: the sun sinks behind the mountains for free.
const HEAVENLY = { blending: THREE.AdditiveBlending, transparent: false, depthTest: false, depthWrite: false, fog: false };
function heavenly(obj) {
  obj.renderOrder = -9;
  obj.frustumCulled = false;
  return obj;
}
function heavenlySprite(map, size) {
  const sprite = heavenly(new THREE.Sprite(new THREE.SpriteMaterial({ map, ...HEAVENLY })));
  sprite.scale.set(size, size, 1);
  return sprite;
}

// ---------- the dome ----------
function buildDome() {
  const geo = new THREE.SphereGeometry(SKY_RADIUS, 48, 28);
  const pos = geo.attributes.position;
  const dirs = new Float32Array(pos.count * 3); // each vertex's direction from the eye
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    dirs.set([v.x, v.y, v.z], i * 3);
  }
  const colors = new Float32Array(pos.count * 3);
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false, depthTest: false })
  );
  mesh.renderOrder = -10; // painted first, everything else lands on top
  mesh.frustumCulled = false;

  const c = new THREE.Color();
  function paint(look, sun) {
    for (let i = 0; i < pos.count; i++) {
      const dx = dirs[i * 3];
      const up = dirs[i * 3 + 1]; // -1..1
      const dz = dirs[i * 3 + 2];
      if (up >= 0) {
        // painterly: a pale band at the horizon, deepening overhead
        c.copy(look.horizon).lerp(look.mid, smoothstep(up, 0.0, 0.3)).lerp(look.zenith, smoothstep(up, 0.22, 0.95));
      } else {
        c.copy(look.horizon).lerp(look.below, Math.min(1, -up * 4));
      }
      // the half of the sky around the sun is washed in its colour, most of all low down
      const toSun = Math.max(0, dx * sun.x + up * sun.y + dz * sun.z);
      c.lerp(look.glow, toSun * toSun * toSun * look.wash * (1 - Math.max(0, up) * 0.45));
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geo.attributes.color.needsUpdate = true;
  }
  return { mesh, paint };
}

// ---------- the stars ----------
// A few hundred points on a sphere that wheels about the pole. One draw call,
// and none at all by day (hidden).
function buildStars() {
  const rng = makeRng(1250);
  const COUNT = 700;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const c = new THREE.Color();
  for (let i = 0; i < COUNT; i++) {
    // evenly over the whole sphere: the turning brings every part round
    const y = rng() * 2 - 1;
    const a = rng() * Math.PI * 2;
    const r = Math.sqrt(1 - y * y);
    positions.set([Math.cos(a) * r * SKY_RADIUS * 0.9, y * SKY_RADIUS * 0.9, Math.sin(a) * r * SKY_RADIUS * 0.9], i * 3);
    // most are faint, a few are bright; some burn a little warm, some a little cold
    const bright = 0.22 + 0.78 * Math.pow(rng(), 3);
    c.setRGB(1, 0.9 + rng() * 0.1, 0.78 + rng() * 0.22).multiplyScalar(bright);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const stars = heavenly(
    new THREE.Points(geo, new THREE.PointsMaterial({ size: 2, sizeAttenuation: false, vertexColors: true, ...HEAVENLY }))
  );
  stars.name = 'stars';
  stars.visible = false;
  return stars;
}

// ---------- the moon ----------
const MOON_BRIGHT = '#eef0f6';
const MOON_DARK = '#080a10'; // her unlit side: all but nothing (it is added to the sky)

// The moon's face at `phase` (0 new → 0.5 full → 1 new), drawn once at load:
// waxing she is bright on the right, waning on the left.
function moonTexture(phase) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, size, size);
  const r = size / 2 - 6;
  ctx.translate(size / 2, size / 2);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = MOON_DARK;
  ctx.fillRect(-r, -r, r * 2, r * 2);
  // the bright half…
  const waxing = phase < 0.5;
  ctx.fillStyle = MOON_BRIGHT;
  ctx.beginPath();
  ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, !waxing);
  ctx.fill();
  // …and the edge of her shadow: an ellipse that eats into the bright half
  // (a crescent) or adds to it (past the half moon)
  const k = Math.cos(phase * Math.PI * 2); // 1 new … -1 full
  ctx.fillStyle = k > 0 ? MOON_DARK : MOON_BRIGHT;
  ctx.beginPath();
  ctx.ellipse(0, 0, r * Math.abs(k), r, 0, 0, Math.PI * 2);
  ctx.fill();
  // her seas: a few flat grey patches, which darken only what is bright
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = '#c3c8d6';
  for (const [x, y, rad] of [[-0.3, -0.32, 0.26], [0.2, -0.12, 0.2], [-0.12, 0.28, 0.3], [0.42, 0.34, 0.14], [0.36, -0.5, 0.12]]) {
    ctx.beginPath();
    ctx.arc(x * r, y * r, rad * r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---------- the clouds ----------
// Low-poly cumulus drifting round the valley: clumps of squashed, roughened
// blobs with flat bellies, in one mesh. Every facet is shaded by hand by how
// it faces the light — relit as the day turns.
function buildClouds() {
  const rng = makeRng(4242);
  const batch = makeBatch();
  for (let made = 0; made < 17; made++) {
    const ang = rng() * Math.PI * 2;
    const rad = 180 + rng() * 150;
    const y = 58 + rng() * 62;
    const cx = Math.cos(ang) * rad;
    const cz = Math.sin(ang) * rad;
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
    }
  }
  const mesh = batch.build(new THREE.MeshBasicMaterial({ vertexColors: true, fog: false }), { cast: false, receive: false });
  mesh.name = 'clouds';

  // the built mesh carries true face normals: three vertices to a facet
  const normals = mesh.geometry.attributes.normal.array;
  const colors = new Float32Array(normals.length);
  mesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const c = new THREE.Color();
  const local = new THREE.Vector3();
  const UP = new THREE.Vector3(0, 1, 0);

  // light: unit vector toward the light, in world axes
  function relight(look, light) {
    local.copy(light).applyAxisAngle(UP, -mesh.rotation.y); // the clouds have drifted round
    for (let i = 0; i < normals.length; i += 9) {
      const ny = normals[i + 1];
      const facing = normals[i] * local.x + ny * local.y + normals[i + 2] * local.z;
      c.copy(look.cloudShade).lerp(look.cloudTop, smoothstep(ny, -0.5, 0.6)).lerp(look.cloudLit, smoothstep(facing, 0.1, 0.9));
      for (let k = 0; k < 9; k += 3) {
        colors[i + k] = c.r;
        colors[i + k + 1] = c.g;
        colors[i + k + 2] = c.b;
      }
    }
    mesh.geometry.attributes.color.needsUpdate = true;
  }
  return { mesh, relight };
}

// ---------- the light ----------
const LIGHT_REACH = 53; // how far up its own beam the light stands from what it lights
const LOWEST_BEAM = 18; // degrees: the beam never lies flatter than this — a raking light
//                         smears and speckles its shadows; the SEEN sun still sinks to the hills
const STARLIGHT = compass(-0.25, -0.5, 0.83); // where night's light falls from when no moon is up

// `dir` lifted so it stands at least `minDeg` over the horizon
function raise(dir, minDeg, out) {
  const minUp = Math.sin((minDeg * Math.PI) / 180);
  out.copy(dir);
  if (out.y >= minUp) return out;
  const flat = Math.hypot(out.x, out.z) || 1;
  const reach = Math.cos((minDeg * Math.PI) / 180) / flat;
  return out.set(out.x * reach, minUp, out.z * reach);
}

// Builds the whole sky into `scene`. `clock()` returns the Date to show.
// Returns:
//   update(dt, playerPos, camera)  every slice: the slow repaint, the drifting
//                                  clouds, the dome riding the camera, the
//                                  shadow box following the player
//   setClock(date | null)          pin the sky to a moment (null: the real clock)
//   refresh()                      repaint now
//   state                          what was last painted (the smoke suite reads it)
//   onLook(look, state)            called after each repaint, for scenery that
//                                  follows the hour (world.js: the hovel's window)
export function createSky(scene, clock = () => new Date()) {
  const group = new THREE.Group(); // rides with the camera
  const dome = buildDome();
  const stars = buildStars();
  group.add(dome.mesh, stars);

  // the sun: a broad soft glow with a hot disc at its heart
  const sunHalo = heavenlySprite(softDotTexture(), 300);
  const sunDisc = heavenlySprite(
    radialTexture([
      [0, 'rgba(255,250,232,1)'],
      [0.42, 'rgba(255,244,214,1)'],
      [0.5, 'rgba(255,226,170,0.55)'],
      [0.75, 'rgba(255,205,130,0.12)'],
      [1, 'rgba(255,200,120,0)'],
    ]),
    64
  );
  group.add(sunHalo, sunDisc);

  // the moon, in the phase she truly wears tonight, and the pale ring about her
  const moonHalo = heavenlySprite(softDotTexture(), 170);
  moonHalo.material.color.set(0x8fa6e0);
  let moonDrawn = skyAt(clock(), CONFIG.sky.latitude).phase; // the phase her face was last drawn at
  const moonDisc = heavenlySprite(moonTexture(moonDrawn), 30);
  group.add(moonHalo, moonDisc);

  const clouds = buildClouds();
  scene.add(group, clouds.mesh);

  // Light: one shadow-casting key — the sun by day, the moon by night — with a
  // sky / earth fill, so shade reads cool against the lit side.
  scene.fog = new THREE.Fog(0xc4d2dc, 45, 560);
  const hemi = new THREE.HemisphereLight(0xcfe3f6, 0xa98c60, 1.55);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffe0aa, 3.0);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const half = 40; // half-width of the shadowed box around the player
  key.shadow.camera.left = -half;
  key.shadow.camera.right = half;
  key.shadow.camera.top = half;
  key.shadow.camera.bottom = -half;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 150;
  key.shadow.bias = -0.0005;
  key.shadow.normalBias = 0.035;
  scene.add(key);
  scene.add(key.target);

  // The shadow box follows the player so shadows exist wherever he walks. It
  // moves in whole shadow-texel steps along the light's own axes — otherwise
  // every shadow edge would shimmer as the box slid under it. The axes are
  // re-laid whenever the light is re-aimed.
  const texel = (half * 2) / key.shadow.mapSize.x;
  const beam = new THREE.Vector3(); // unit vector toward the light
  const fwd = new THREE.Vector3();
  const right = new THREE.Vector3();
  const upAxis = new THREE.Vector3();
  const centre = new THREE.Vector3();
  const UP = new THREE.Vector3(0, 1, 0);
  function aimKey(dir) {
    beam.copy(dir);
    fwd.copy(dir).negate();
    right.crossVectors(fwd, UP).normalize();
    upAxis.crossVectors(right, fwd).normalize();
  }
  function followShadow(focus) {
    const r = Math.round(focus.dot(right) / texel) * texel;
    const u = Math.round(focus.dot(upAxis) / texel) * texel;
    centre.copy(right).multiplyScalar(r).addScaledVector(upAxis, u).addScaledVector(fwd, focus.dot(fwd));
    key.target.position.copy(centre);
    key.position.copy(centre).addScaledVector(beam, LIGHT_REACH);
  }

  const pole = skyPole(CONFIG.sky.latitude);
  const look = lookFor(0, Object.fromEntries(COLOURS.map((name) => [name, new THREE.Color()])));
  const dir = new THREE.Vector3();
  const state = {};
  let pinned = null;
  let sinceRefresh = 0;
  const api = { update, setClock, refresh, state, onLook: null };

  // Repaint everything for the present moment.
  function refresh() {
    sinceRefresh = 0;
    const now = skyAt(pinned ?? clock(), CONFIG.sky.latitude);
    lookFor(now.sunAlt, look);
    const night = 1 - smoothstep(now.sunAlt, -14, -4);
    // how much the moon gives: her bright share, once she has cleared the hills
    const moonShine = now.moonLit * smoothstep(now.moonAlt, 0, 15);

    dome.paint(look, now.sun);

    // the sun: redder and broader as it sinks, gone a little under the horizon
    const sunShow = smoothstep(now.sunAlt, -3, 0);
    const low = 1 - smoothstep(now.sunAlt, 0, 20);
    sunDisc.visible = sunHalo.visible = sunShow > 0;
    sunDisc.position.copy(now.sun).multiplyScalar(SKY_RADIUS * 0.94);
    sunHalo.position.copy(sunDisc.position);
    sunDisc.material.color.setRGB(1, 1, 1).lerp(look.key, low * 0.6);
    sunDisc.material.opacity = sunShow;
    sunHalo.material.color.copy(look.glow);
    sunHalo.material.opacity = 0.5 * sunShow;
    sunHalo.scale.setScalar(300 + 140 * low);

    // the moon: pale in a day sky, bright at night; unseen when new or down
    const moonShow = smoothstep(now.moonAlt, -4, 0) * smoothstep(now.moonLit, 0.02, 0.08);
    moonDisc.visible = moonHalo.visible = moonShow > 0;
    if (Math.abs(now.phase - moonDrawn) > 0.01) {
      // she has aged since her face was drawn (hours of play, or a pinned clock)
      moonDisc.material.map.dispose();
      moonDisc.material.map = moonTexture(now.phase);
      moonDrawn = now.phase;
    }
    moonDisc.position.copy(now.moon).multiplyScalar(SKY_RADIUS * 0.92);
    moonHalo.position.copy(moonDisc.position);
    moonDisc.material.opacity = moonShow * (0.22 + 0.78 * night);
    moonDisc.material.rotation = now.phase < 0.5 ? -0.45 : 0.45; // her bright limb dips toward where the sun went
    moonHalo.material.opacity = 0.3 * moonShow * night * now.moonLit;

    // the stars come out as the dusk goes, and wheel about the pole
    const starShow = smoothstep(-now.sunAlt, 3, 11);
    stars.visible = starShow > 0;
    stars.material.opacity = starShow;
    stars.quaternion.setFromAxisAngle(pole, -now.turn);

    // The key light. Its power passes through nothing between the dusk rows
    // of LOOKS, and that is when it changes hands: sun above, moon below.
    const moonlit = now.sunAlt < -6;
    if (moonlit) {
      // from the moon when she is up, else from the stars' quarter
      raise(now.moon, LOWEST_BEAM, dir).lerp(STARLIGHT, 1 - smoothstep(now.moonAlt, 0, 15)).normalize();
    } else {
      raise(now.sun, LOWEST_BEAM, dir);
    }
    aimKey(dir);
    key.color.copy(look.key);
    key.intensity = look.keyPower * (moonlit ? 0.6 + 0.4 * moonShine : 1);
    hemi.color.copy(look.hemiSky);
    hemi.groundColor.copy(look.hemiGround);
    hemi.intensity = look.hemi * (1 + 0.12 * night * moonShine);
    scene.fog.color.copy(look.haze);

    // clouds take the true sun even when it is low (lit from beneath at dusk)
    clouds.relight(look, moonlit ? dir : now.sun);

    daylight.veil.copy(look.veil);
    daylight.sunAlt = now.sunAlt;
    daylight.night = night;

    Object.assign(state, now, { night, moonlit, moonShine, starShow, keyPower: key.intensity, hemiPower: hemi.intensity, beamUp: dir.y });
    api.onLook?.(look, state);
  }

  function setClock(date) {
    pinned = date;
    refresh();
  }

  function update(dt, playerPos, camera) {
    sinceRefresh += dt;
    if (sinceRefresh >= CONFIG.sky.refresh) refresh();
    clouds.mesh.rotation.y += dt * 0.0035;
    group.position.copy(camera.position);
    followShadow(playerPos);
  }

  refresh();
  return api;
}
