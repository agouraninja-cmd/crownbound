import * as THREE from 'three';
import './ui/ui.css';
import { buildWorld } from './scene/world.js';
import { LAYOUT } from './scene/layout.js';
import { createPlayer } from './player/player.js';
import { createOrbitCamera } from './player/camera.js';
import { initHud, showPrompt, setHp, setStamina, setCoins, setRank, setStreak } from './ui/hud.js';
import { loadState, getState, onChange, staminaCap } from './state/state.js';
import { initPanels, openPanel, isPanelOpen } from './ui/panels.js';
import { toast } from './ui/toasts.js';

const { messages: bootMessages } = loadState();

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

const isUiOpen = isPanelOpen;
const orbitCam = createOrbitCamera(camera, renderer.domElement, isUiOpen);

initHud();
initPanels((opened) => {
  player.setEnabled(!opened);
  if (opened) {
    orbitCam.unlock();
    showPrompt(null);
  }
});

function syncHud() {
  const s = getState();
  setCoins(s.coins);
  setRank(s.rank);
  setStreak(s.streak.current);
  setStamina(s.stamina.current, staminaCap());
  setHp(1, 1); // real HP arrives with combat (M6)
  world.campfire.setStreak(s.streak.current);
}
onChange(syncHud);
syncHud();

setTimeout(() => {
  for (const m of bootMessages) toast(m.text, m.style);
}, 700);

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

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyE' && player.isEnabled() && !isPanelOpen()) {
    const it = nearestInteractable();
    if (it) {
      orbitCam.unlock();
      openPanel(it.id);
    }
  }
});

// headless smoke-test hook, harmless in normal play
if (new URLSearchParams(location.search).has('smoke')) {
  window.__game = { scene, camera, orbitCam, player, openPanel, getState };
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
