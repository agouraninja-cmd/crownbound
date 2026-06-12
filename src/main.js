import * as THREE from 'three';
import './ui/ui.css';
import { buildWorld } from './scene/world.js';
import { terrainHeight } from './scene/terrain.js';
import { LAYOUT } from './scene/layout.js';
import { buildPlayerMesh } from './player/playerMesh.js';
import { createOrbitCamera } from './player/camera.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
document.getElementById('app').appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);

const world = buildWorld(scene);

const playerMesh = buildPlayerMesh();
playerMesh.group.position.set(
  LAYOUT.playerSpawn.x,
  terrainHeight(LAYOUT.playerSpawn.x, LAYOUT.playerSpawn.z),
  LAYOUT.playerSpawn.z
);
playerMesh.group.rotation.y = Math.PI / 3;
scene.add(playerMesh.group);

const isUiOpen = () => false; // panels arrive in M3
const orbitCam = createOrbitCamera(camera, renderer.domElement, isUiOpen);

// headless smoke-test hook, harmless in normal play
if (new URLSearchParams(location.search).has('smoke')) {
  window.__game = { scene, camera, orbitCam, playerMesh };
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
let frames = 0;

function tick() {
  frames++;
  if (frames === 90) {
    window.__smoke = {
      calls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
    };
  }
  const dt = Math.min(clock.getDelta(), 0.05);

  world.campfire.update(dt);
  orbitCam.update(dt, playerMesh.group.position);

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();
