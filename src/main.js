import * as THREE from 'three';
import './ui/ui.css';
import { buildWorld } from './scene/world.js';
import { LAYOUT } from './scene/layout.js';
import { createPlayer } from './player/player.js';
import { createOrbitCamera } from './player/camera.js';
import { initHud, showPrompt, setHp, setStamina, setCoins, setRank, setStreak } from './ui/hud.js';

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
const player = createPlayer(scene, LAYOUT.playerSpawn);

const isUiOpen = () => false; // panels arrive in M3
const orbitCam = createOrbitCamera(camera, renderer.domElement, isUiOpen);

initHud();
setHp(1, 1);
setStamina(1, 1);
setCoins(0);
setRank('Peasant');
setStreak(0);

// nearest interactable in range drives the E prompt
function nearestInteractable() {
  let best = null;
  let bestD = Infinity;
  for (const it of world.interactables) {
    const d = Math.hypot(player.pos.x - it.x, player.pos.z - it.z);
    if (d < it.radius && d < bestD) {
      bestD = d;
      best = it;
    }
  }
  return best;
}

let onInteract = () => {}; // panels.js takes this over in M3
window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyE' && player.isEnabled()) {
    const it = nearestInteractable();
    if (it) onInteract(it);
  }
});

// headless smoke-test hook, harmless in normal play
if (new URLSearchParams(location.search).has('smoke')) {
  window.__game = { scene, camera, orbitCam, player };
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

  if (!isUiOpen()) {
    player.update(dt, orbitCam.getYaw(), world.colliders);
    const it = nearestInteractable();
    showPrompt(it ? `Press <b>E</b> — ${it.label}` : null);
  }

  world.campfire.update(dt);
  orbitCam.update(dt, player.pos);

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();
