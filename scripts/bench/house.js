// The house bench (a dev tool, not part of the game): one neighbour's house on
// its real plot, lit by the game's own sky, seen from four sides at once.
//   house.html?id=reeve            the default four views
//   &hour=21                       the hour the sky keeps (default 13)
//   &views=30,12,11;200,14,11      views as bearing,elevation,distance — bearing in degrees from the house's front
//   &marks=1                       draw the yard's bounds and every collider on the ground
//   &all=1                         stand the other houses round it too
import * as THREE from 'three';
import { createSky } from '../../src/scene/sky.js';
import { terrainHeight, grassTint } from '../../src/scene/terrain.js';
import { LAYOUT, houseToWorld } from '../../src/scene/layout.js';
import { raiseHouse, houseColliders } from '../../src/scene/cottage.js';
import { openingColour } from '../../src/scene/village.js';
import { daylight } from '../../src/scene/daylight.js';
import { bakeDeep, hash2 } from '../../src/scene/meshUtils.js';
import { buildPlayerMesh } from '../../src/player/playerMesh.js';

const q = new URLSearchParams(location.search);
const id = q.get('id') || LAYOUT.houses[0].id;
const hour = parseFloat(q.get('hour') ?? '13');
const plot = LAYOUT.houses.find((h) => h.id === id);
const W = 1600;
const H = 1200;

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H);
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const clock = () => {
  const d = new Date(2026, 5, 1);
  d.setHours(0, 0, hour * 3600, 0);
  return d;
};
const sky = createSky(scene, clock);

// the ground about the plot: the real heights, a plain faceted green
{
  const R = 34;
  const pos = [];
  const col = [];
  const c = new THREE.Color();
  const vert = (x, z) => [x, terrainHeight(x, z), z];
  for (let i = -R; i < R; i++) {
    for (let j = -R; j < R; j++) {
      const x = Math.round(plot.x) + i;
      const z = Math.round(plot.z) + j;
      for (const tri of [[[0, 0], [0, 1], [1, 0]], [[1, 0], [0, 1], [1, 1]]]) {
        grassTint(x + 0.5, z + 0.5, c).multiplyScalar(0.96 + hash2(x * 31 + tri[0][0], z * 17) * 0.08);
        for (const [a, b] of tri) {
          pos.push(...vert(x + a, z + b));
          col.push(c.r, c.g, c.b);
        }
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.computeVertexNormals();
  const ground = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
  ground.receiveShadow = true;
  scene.add(ground);
}

const report = { id, errors: [] };
let colliders = [];
let floor = 0;
try {
  // only this house's own file is loaded, so a neighbour's half-written one cannot break the bench
  const house = (await import(/* @vite-ignore */ `../../src/scene/houses/${id}.js`)).default;
  report.name = house.name;
  report.note = house.note;
  const built = raiseHouse(plot, house, terrainHeight);
  floor = built.floor;
  const c = built.c;
  colliders = houseColliders(plot, c);
  report.smokes = c.smokes.length;
  report.openings = c.openings.length;
  report.embers = c.embers.length;
  // how far the house and its yard reach, in the house's own frame
  c.g.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(c.g.matrixWorld).invert();
  const box = new THREE.Box3();
  const v = new THREE.Vector3();
  c.g.traverse((o) => {
    if (!o.isMesh) return;
    const p = o.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) box.expandByPoint(v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld).applyMatrix4(inv));
  });
  report.reach = { u: [+box.min.x.toFixed(2), +box.max.x.toFixed(2)], v: [+box.min.z.toFixed(2), +box.max.z.toFixed(2)], top: +box.max.y.toFixed(2) };
  // everything must stand inside the yard — but the house's own eaves may overhang it where the yard is tight to a wall
  const EAVES = 0.5;
  const u0 = Math.min(plot.yard[0], -plot.length / 2 - EAVES);
  const v0 = Math.min(plot.yard[1], -plot.width / 2 - EAVES);
  const u1 = Math.max(plot.yard[2], plot.length / 2 + EAVES);
  const v1 = Math.max(plot.yard[3], plot.width / 2 + EAVES);
  report.outsideYard = box.min.x < u0 - 0.05 || box.max.x > u1 + 0.05 || box.min.z < v0 - 0.05 || box.max.z > v1 + 0.05;
  scene.add(c.g);
  bakeDeep(c.g, { smallBelow: 0.36 });
  // doorways and windows as the village shows them at this hour: dark by day, the hearth's light after dark
  const within = new THREE.Color();
  for (const m of c.openings) m.material.color.copy(openingColour(m.userData.lit ?? 0, daylight.night, within));
  report.casting = Math.round(c.g.children.filter((o) => o.isMesh && o.castShadow).reduce((n, o) => n + o.geometry.attributes.position.count / 3, 0));
  let tris = 0;
  c.g.traverse((o) => {
    if (o.isMesh) tris += o.geometry.attributes.position.count / 3;
  });
  report.triangles = Math.round(tris);
  report.colliders = colliders.length;
} catch (err) {
  report.errors.push(String(err.stack || err));
}

if (q.get('all')) {
  for (const other of LAYOUT.houses) {
    if (other === plot) continue;
    try {
      const o = raiseHouse(other, (await import(/* @vite-ignore */ `../../src/scene/houses/${other.id}.js`)).default, terrainHeight);
      scene.add(o.c.g);
      bakeDeep(o.c.g);
    } catch {}
  }
}

// a man by the door, for scale
{
  const man = buildPlayerMesh();
  const [wall, at] = plot.door;
  const out = 1.5;
  const u = wall === 'right' ? plot.length / 2 + out : wall === 'left' ? -plot.length / 2 - out : at + 0.9;
  const vv = wall === 'front' ? plot.width / 2 + out : wall === 'back' ? -plot.width / 2 - out : at + 0.9;
  const p = houseToWorld(plot, u, vv);
  man.group.position.set(p.x, terrainHeight(p.x, p.z), p.z);
  man.group.rotation.y = plot.rotY + 2.6;
  scene.add(man.group);
}

if (q.get('marks')) {
  const lineMat = new THREE.LineBasicMaterial({ color: 0xff3df0 });
  const loop = (pts) => {
    const g = new THREE.BufferGeometry().setFromPoints(pts.map(([x, z]) => new THREE.Vector3(x, terrainHeight(x, z) + 0.06, z)));
    scene.add(new THREE.LineLoop(g, lineMat));
  };
  for (const k of colliders) {
    if (k.r !== undefined) {
      loop(Array.from({ length: 20 }, (_, i) => [k.x + Math.cos((i / 20) * 6.283) * k.r, k.z + Math.sin((i / 20) * 6.283) * k.r]));
    } else {
      loop([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [k.x + a * k.halfX * k.cos + b * k.halfZ * k.sin, k.z - a * k.halfX * k.sin + b * k.halfZ * k.cos]));
    }
  }
  const [u0, v0, u1, v1] = plot.yard;
  const yardMat = new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.3, gapSize: 0.2 });
  const pts = [[u0, v0], [u1, v0], [u1, v1], [u0, v1], [u0, v0]].map(([u, v]) => {
    const p = houseToWorld(plot, u, v);
    return new THREE.Vector3(p.x, terrainHeight(p.x, p.z) + 0.08, p.z);
  });
  const yard = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), yardMat);
  yard.computeLineDistances();
  scene.add(yard);
}

// bearing, elevation (degrees), distance, and the height looked at
const VIEWS = (q.get('views') || '32,10,11.5,1.5;212,12,11.5,1.5;-55,38,15,1;0,6,6.5,1.3')
  .split(';')
  .map((s) => s.split(',').map(Number));
const camera = new THREE.PerspectiveCamera(55, W / 2 / (H / 2), 0.1, 1000);
const focus = new THREE.Vector3(plot.x, floor, plot.z);
const cols = VIEWS.length > 1 ? 2 : 1;
const rowsN = Math.ceil(VIEWS.length / cols);
renderer.setScissorTest(true);
renderer.info.autoReset = false;
VIEWS.forEach(([bearing, elev, dist, lookY = 1.4], i) => {
  const a = plot.rotY + (bearing * Math.PI) / 180; // bearing 0 looks at the front
  const e = (elev * Math.PI) / 180;
  camera.position.set(plot.x + Math.sin(a) * Math.cos(e) * dist, floor + lookY + Math.sin(e) * dist, plot.z + Math.cos(a) * Math.cos(e) * dist);
  const low = terrainHeight(camera.position.x, camera.position.z) + 0.4;
  if (camera.position.y < low) camera.position.y = low;
  camera.lookAt(plot.x, floor + lookY, plot.z);
  camera.aspect = W / cols / (H / rowsN);
  camera.updateProjectionMatrix();
  sky.update(0.016, focus, camera);
  const vw = W / cols;
  const vh = H / rowsN;
  const vx = (i % cols) * vw;
  const vy = H - (Math.floor(i / cols) + 1) * vh;
  renderer.setViewport(vx, vy, vw, vh);
  renderer.setScissor(vx, vy, vw, vh);
  renderer.render(scene, camera);
});
report.calls = Math.round(renderer.info.render.calls / VIEWS.length);

document.getElementById('tag').textContent = `${id}  ${plot.length}×${plot.width}  ${report.triangles ?? '?'} tris  ${report.colliders ?? '?'} colliders${report.outsideYard ? '  OUTSIDE YARD' : ''}${report.errors.length ? '\n' + report.errors[0] : ''}`;
window.__bench = report;
