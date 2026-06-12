import * as THREE from 'three';
import './ui/ui.css';
import { buildWorld } from './scene/world.js';
import { LAYOUT } from './scene/layout.js';
import { createPlayer } from './player/player.js';
import { createOrbitCamera } from './player/camera.js';
import { initHud, showPrompt, setHp, setStamina, setCoins, setRank, setStreak } from './ui/hud.js';
import { loadState, getState, onChange, staminaCap, spendStamina, exportSave, importSave, dailyDoneToday } from './state/state.js';
import { initPanels, openPanel, isPanelOpen } from './ui/panels.js';
import { toast } from './ui/toasts.js';
import { initAudio, sfx } from './ui/audio.js';
import { createDummy } from './combat/dummy.js';
import { createRats } from './combat/rats.js';
import { CONFIG } from './state/config.js';

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

// combat actions draw from the daily stamina pool
player.trySpend = (cost) => spendStamina(cost);
player.onActionBlocked = () =>
  toast('Your arms are spent. Earn your strength — the board awaits.', 'grim');

initAudio();
const dummy = createDummy(world.dummy);
const rats = createRats(scene);

function angleDiff(a, b) {
  let d = Math.abs(a - b) % (Math.PI * 2);
  return d > Math.PI ? Math.PI * 2 - d : d;
}

player.onAttackSwing = () => {
  sfx.swing();
  const P = CONFIG.player;
  const halfArc = (P.attackArcDeg * Math.PI) / 360;
  rats.tryHit(player.pos.x, player.pos.z, player.facing, P.attackRange, halfArc, P.attackDamage);

  const ddx = dummy.x - player.pos.x;
  const ddz = dummy.z - player.pos.z;
  if (Math.hypot(ddx, ddz) < P.attackRange + dummy.radius) {
    if (angleDiff(Math.atan2(ddx, ddz), player.facing) < halfArc) {
      dummy.hit(player.pos.x, player.pos.z);
    }
  }
};

player.onHurt = () => {
  sfx.hurt();
  orbitCam.shake(0.24);
};
player.onHpChange = (hp, max) => setHp(hp, max);

const fadeEl = document.getElementById('fade');
player.onDeath = () => {
  player.setEnabled(false);
  fadeEl.classList.add('show');
  setTimeout(() => {
    player.respawn(LAYOUT.playerSpawn.x, LAYOUT.playerSpawn.z);
    fadeEl.classList.remove('show');
    toast('You wake on your straw cot, aching. The rats remain.', 'grim');
    if (!isPanelOpen()) player.setEnabled(true);
  }, 1100);
};

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
  setHp(player.hp, player.maxHp);
  world.campfire.setStreak(s.streak.current, dailyDoneToday());
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
  window.__game = { scene, camera, orbitCam, player, openPanel, getState, spendStamina, exportSave, importSave, rats, dummy, campfire: world.campfire };
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
    rats.update(dt, player, (dmg, x, z) => player.takeDamage(dmg, x, z));
    dummy.update(dt);
    const it = nearestInteractable();
    showPrompt(it ? `Press <b>E</b> — ${it.label}` : null);
  }

  world.campfire.update(dt);
  orbitCam.update(dt, player.pos);

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();
