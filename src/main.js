import * as THREE from 'three';
import './ui/ui.css';
import { buildWorld } from './scene/world.js';
import { LAYOUT } from './scene/layout.js';
import { createPlayer } from './player/player.js';
import { createOrbitCamera } from './player/camera.js';
import { initHud, showPrompt, placePrompt, setHp, setStamina, setCoins, setRank, setStreak } from './ui/hud.js';
import { terrainHeight } from './scene/terrain.js';
import { loadState, getState, onChange, staminaCap, spendStamina, exportSave, importSave, dailyDoneToday, recordBedtime, evaluateSleep, applySleepReward, fileReckoning, judgeReckoning, reckoningDue, setPledge, setSummit, wieldedWeapon, FARM_JOBS, farmJob, farmRowLooks, workFarmRow } from './state/state.js';
import { initPanels, openPanel, closePanel, openPanelId, isPanelOpen } from './ui/panels.js';
import { initMirror } from './state/mirror.js';
import { judgeDeed } from './ai/sage.js';
import { keepChronicle } from './ai/chronicler.js';
import { toast } from './ui/toasts.js';
import { initAudio, sfx } from './ui/audio.js';
import { createDummy } from './combat/dummy.js';
import { createRats } from './combat/rats.js';
import { CONFIG } from './state/config.js';

const { messages: bootMessages } = loadState();
initMirror(); // dev-only: shadow the save to saves/crownbound-save.json (adopts it on an empty boot)

// Market days bring the chapman's cart. Sessions are short, so the flag is
// fixed per load like the rollover; ?market=1|0 overrides it (smoke tests).
const marketParam = new URLSearchParams(location.search).get('market');
const marketToday =
  marketParam !== null
    ? marketParam === '1'
    : CONFIG.shop.marketWeekdays.includes(new Date().getDay());

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping; // keeps the palette's hues as painted
renderer.toneMappingExposure = 1.0;
document.getElementById('app').appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

const world = buildWorld(scene, marketToday);
const player = createPlayer(scene, LAYOUT.playerSpawn);

// the weapon in hand (chosen at the chest) and the home comforts bought from
// the chapman, applied on load, on purchase, and when a weapon is taken up
function applyPurchases() {
  const w = wieldedWeapon(); // the stick carries no damage/reach/tier of its own
  player.attackDamage = w.damage ?? CONFIG.player.attackDamage;
  player.attackReach = CONFIG.player.attackRange + (w.reach ?? 0);
  player.setWeaponTier(w.tier ?? 0);
  world.applyHomeUpgrades(getState().shop.owned);
}
applyPurchases();

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
  rats.tryHit(player.pos.x, player.pos.z, player.facing, player.attackReach, halfArc, player.attackDamage);

  const ddx = dummy.x - player.pos.x;
  const ddz = dummy.z - player.pos.z;
  if (Math.hypot(ddx, ddz) < player.attackReach + dummy.radius) {
    if (angleDiff(Math.atan2(ddx, ddz), player.facing) < halfArc) {
      dummy.hit(player.pos.x, player.pos.z);
    }
  }
};

// feet on the ground: a soft thud per step, a heavier one coming down from a leap
player.onFootstep = (weight) => sfx.step(weight);
player.onLand = (impact) => sfx.land(Math.min(impact / CONFIG.player.jumpSpeed, 1.3));

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
    player.respawn(world.wakeSpot.x, world.wakeSpot.z);
    fadeEl.classList.remove('show');
    toast('You wake on your straw cot, aching. The rats remain.', 'grim');
    if (!isPanelOpen()) player.setEnabled(true);
  }, 1100);
};

// E on the cot: tuck in (glide + lie back, ~1.5s), fade out, mend fully,
// mark the night for the dawn judgment
let sleeping = false;
function sleepAtCot() {
  if (sleeping) return;
  sleeping = true;
  const wounded = player.hp < player.maxHp - 0.01;
  player.setEnabled(false);
  orbitCam.unlock();
  player.startSleep(world.bedRest);
  setTimeout(() => {
    sfx.page();
    fadeEl.classList.add('show');
  }, 1500);
  setTimeout(() => {
    player.respawn(world.wakeSpot.x, world.wakeSpot.z); // full HP, standing by the cot
    recordBedtime();
    fadeEl.classList.remove('show');
    toast(
      wounded
        ? 'Sleep knits your wounds. The night is marked.'
        : 'You rest your eyes a while. The night is marked.',
      ''
    );
    if (!isPanelOpen()) player.setEnabled(true);
    sleeping = false;
  }, 2600);
}

const isUiOpen = isPanelOpen;
const orbitCam = createOrbitCamera(camera, renderer.domElement, isUiOpen);
orbitCam.setInterior(world.hovelInterior);
// where pointer lock is refused, a plain click on the scene is the swing
orbitCam.setOnTap(() => {
  if (player.isEnabled()) player.attack();
});

initHud();
initPanels(
  (opened) => {
    player.setEnabled(!opened);
    if (opened) {
      orbitCam.unlock();
      showPrompt(null);
    } else if (world.chest.isOpen) {
      world.chest.setOpen(false); // closing the Chest panel lowers the lid
      sfx.creak();
    }
  },
  {
    isWounded: () => player.hp < player.maxHp - 0.01,
    onPurchase: applyPurchases,
    onWield: applyPurchases,
    onEat: () => {
      player.hp = player.maxHp;
      player.onHpChange(player.hp, player.maxHp);
    },
    // what the village plan on the map needs to know, read as it opens
    mapView: () => ({
      x: player.pos.x,
      z: player.pos.z,
      facing: player.facing,
      trees: world.mapMarks.trees,
      rocks: world.mapMarks.rocks,
      market: !!world.cart,
      looks: farmRowLooks(),
    }),
  }
);

// M unrolls the map of the kingdom, and rolls it up again. Like E, it does
// nothing while asleep, dead or under another panel.
window.addEventListener('keydown', (e) => {
  if (e.code !== 'KeyM' || e.repeat) return;
  if (openPanelId() === 'map') closePanel();
  else if (!isPanelOpen() && player.isEnabled()) openPanel('map');
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

// the moment the last virtue level lands: bells, gold, the crown
onChange((reason) => {
  if (reason !== 'coronation') return;
  sfx.levelUp();
  toast('The bells ring out across the realm.', 'gold');
  toast('THE CORONATION — thou art King.', 'gold');
});

setTimeout(() => {
  for (const m of bootMessages) toast(m.text, m.style);
  if (marketToday) toast('The chapman has come — his cart stands by the path.', 'gold');
}, 700);

// the chronicler catches up on finished weeks, quietly and off the critical
// path — he swallows his own failures, and a later load is the retry
keepChronicle().then((wrote) => {
  if (wrote.prose) toast('The chronicler has set down the week past — read it in the Tome.');
});

function insideHovel() {
  const z = world.hovelInterior;
  return player.pos.x > z.minX && player.pos.x < z.maxX && player.pos.z > z.minZ && player.pos.z < z.maxZ;
}

// nearest interactable in range drives the E prompt
function nearestInteractable() {
  let best = null;
  let bestD = Infinity;
  const inside = insideHovel();
  for (const it of world.interactables) {
    if (it.insideOnly && !inside) continue;
    const d = Math.hypot(player.pos.x - it.x, player.pos.z - it.z);
    if (d < it.radius && d < bestD) {
      bestD = d;
      best = it;
    }
  }
  return best;
}

function doorDist() {
  return Math.hypot(player.pos.x - world.door.x, player.pos.z - world.door.z);
}

// the door and the panel-interactables all share the E key; nearest wins
function nearestAction() {
  const it = nearestInteractable();
  const dDoor = doorDist();
  const itD = it ? Math.hypot(player.pos.x - it.x, player.pos.z - it.z) : Infinity;
  if (dDoor < world.door.radius && dDoor < itD) return { id: 'door', x: world.door.x, z: world.door.z };
  return it;
}

function promptText(a) {
  const label = a.id === 'door' ? (world.door.isOpen ? 'close the door' : 'open the door') : a.label;
  return `Press <b>E</b> — ${label}`;
}

// where the prompt tag hangs on screen: a spot above the object, projected
// through the camera each frame; behind-the-camera projections hide the tag
const PROMPT_RAISE = 2.0;
const promptV = new THREE.Vector3();
function promptScreenPos(a) {
  // the render hasn't refreshed the camera's matrices yet this frame;
  // projecting through last frame's leaves the tag swimming while the
  // camera moves (updateMatrixWorld also refreshes matrixWorldInverse)
  camera.updateMatrixWorld();
  promptV.set(a.x, terrainHeight(a.x, a.z) + PROMPT_RAISE, a.z).project(camera);
  if (promptV.z > 1) return null;
  const px = (promptV.x * 0.5 + 0.5) * window.innerWidth;
  const py = (-promptV.y * 0.5 + 0.5) * window.innerHeight;
  // clamped so a close approach can't shove the tag out of the viewport
  return [
    Math.min(Math.max(px, 90), window.innerWidth - 90),
    Math.min(Math.max(py, 50), window.innerHeight - 130),
  ];
}

// the villagers mark your coming — once per visit, a nod and a quiet word
world.exchequer.onGreet = () =>
  toast(
    reckoningDue()
      ? 'The clerk looks up. The month’s reckoning is owed.'
      : 'The clerk inclines his head.',
    ''
  );
world.miller.onGreet = () => toast('The miller raises a floury hand.', '');
if (world.cart) world.cart.chapman.onGreet = () => toast('The chapman looks up from his wares.', '');

// the miller has no panel — just a word on the day's tally for the rat-catcher
function millerGreeting() {
  const n = getState().counters.ratsKilled;
  if (n === 0) {
    toast('Rats in my grain again, friend. Two coins a tail — the offer stands.', '');
  } else if (n < CONFIG.rats.count) {
    toast(`${n === 1 ? 'One tail' : `${n} tails`} this day. The grain breathes easier.`, 'gold');
  } else {
    toast('The granary is quiet at last. Till the morrow, anyway.', 'gold');
  }
}

// ---------- the miller's strip ----------
// E at a ridge works it: a few strokes of the tool for the day's job, and the
// ridge changes. When every ridge has had it, the miller pays. One job a day.
const field = world.field;
field.draw(farmRowLooks());
onChange((reason) => {
  if (reason === 'farm') field.draw(farmRowLooks());
});

const FIELD_PROMPTS = { till: 'till this ridge', sow: 'sow this ridge', tend: 'weed this ridge', reap: 'reap this ridge' };
const FIELD_PAID = {
  till: (c) => `The strip is tilled. The miller pays a day’s wage. (+${c}c)`,
  sow: (c) => `The seed is in the ground. The miller pays a day’s wage. (+${c}c)`,
  tend: (c) => `The shoots stand clean of weeds. The miller pays a day’s wage. (+${c}c)`,
  reap: (c) => `The wheat is in. The miller pays for the harvest. (+${c}c)`,
};
// once today's job is done: what the strip is waiting on, by the job that comes next
const FIELD_WAITS = {
  till: 'The sheaves stand drying. The strip rests till the morrow.',
  sow: 'The turned earth must settle. Sow it on the morrow.',
  tend: 'The seed lies sleeping. Come back on the morrow.',
  reap: 'The shoots stand clean. Wheat will not be hurried — come back on the morrow.',
};

// The strip's prompt hangs on the nearest ridge that still wants today's job
// (any ridge, once the job is done). Called every step; beyond FIELD_REACH of
// the strip's middle (its far corner, and a little) no ridge is in reach, so
// the spot is left where it lies.
const FIELD_REACH = Math.hypot(LAYOUT.field.length / 2, (CONFIG.farm.rows * LAYOUT.field.spacing) / 2) + 3;
function aimFieldSpot() {
  const px = player.pos.x;
  const pz = player.pos.z;
  if (Math.hypot(px - LAYOUT.field.x, pz - LAYOUT.field.z) > FIELD_REACH) return;
  const job = farmJob();
  const done = getState().farm.done;
  let best = null;
  for (let row = 0; row < field.rows; row++) {
    if (job && done.includes(row)) continue; // worked already
    const p = field.nearestOnRow(row, px, pz);
    if (!best || p.dist < best.dist) best = { ...p, row };
  }
  if (!best) return;
  const spot = field.spot;
  spot.x = best.x;
  spot.z = best.z;
  spot.row = best.row;
  spot.label = job ? FIELD_PROMPTS[job] : 'look over the strip';
}

let workingRow = -1; // the ridge under the hoe
function workTheField() {
  const job = farmJob();
  if (!job) {
    toast(FIELD_WAITS[FARM_JOBS[getState().farm.stage]], '');
    return;
  }
  if (player.startWork(job, field.spot.x, field.spot.z)) workingRow = field.spot.row;
}
player.onWorkStroke = (kind) => (kind === 'sow' ? sfx.sow() : kind === 'reap' ? sfx.reap() : sfx.dig());
player.onWorkDone = () => {
  const worked = workFarmRow(workingRow); // the strip redraws itself on the change
  if (worked?.done) {
    toast(FIELD_PAID[worked.job](worked.coins), 'gold');
    sfx.coin();
  }
};

window.addEventListener('keydown', (e) => {
  if (e.code !== 'KeyE' || !player.isEnabled() || isPanelOpen()) return;
  const a = nearestAction();
  if (!a) return;
  if (a.id === 'door') {
    world.door.toggle();
    sfx.creak();
  } else if (a.id === 'bed') {
    sleepAtCot();
  } else if (a.id === 'chest') {
    world.chest.setOpen(true);
    sfx.creak();
    orbitCam.unlock();
    openPanel('chest');
  } else if (a.id === 'miller') {
    millerGreeting();
  } else if (a.id === 'field') {
    workTheField();
  } else {
    orbitCam.unlock();
    openPanel(a.id);
  }
});

// headless smoke-test hook, harmless in normal play
if (new URLSearchParams(location.search).has('smoke')) {
  window.__game = { scene, camera, renderer, colliders: world.colliders, orbitCam, player, openPanel, openPanelId, getState, spendStamina, exportSave, importSave, rats, dummy, campfire: world.campfire, door: world.door, chest: world.chest, cart: world.cart, exchequer: world.exchequer, miller: world.miller, field, farmJob, farmRowLooks, workFarmRow, homeUpgrades: world.homeUpgrades, sleepAtCot, evaluateSleep, applySleepReward, fileReckoning, judgeReckoning, reckoningDue, setPledge, setSummit, judgeDeed, wakeSpot: world.wakeSpot, CONFIG };
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
let frames = 0;
let promptFor = null; // the action the visible prompt is anchored to

const STEP = 0.05; // the longest slice any system is asked to simulate at once
const MAX_CATCHUP = 0.5; // a tab stalled longer than this simply loses the time

// One slice of the world's clock: the sim (paused under a panel), then the
// ambient scenery and the camera, which never pause.
function step(dt) {
  if (!isUiOpen()) {
    player.update(dt, orbitCam.getYaw(), world.colliders);
    rats.update(dt, player, (dmg, x, z) => player.takeDamage(dmg, x, z));
    dummy.update(dt);
    aimFieldSpot();
    promptFor = player.isEnabled() && player.mode !== 'work' ? nearestAction() : null; // none while asleep, dead or busy at a ridge
    showPrompt(promptFor ? promptText(promptFor) : null);
  }

  world.campfire.update(dt);
  world.door.update(dt);
  world.chest.update(dt);
  world.exchequer.update(dt, player.pos);
  world.miller.update(dt, player.pos);
  world.cart?.update(dt, player.pos);
  orbitCam.update(dt, player.pos);
  world.update(dt, player.pos, camera);
}

// Shed pixels before frames: a machine that holds under ~45fps for two
// straight seconds is asked to draw at a lower pixel ratio (never below 1).
// Stalls, a hidden tab and the first seconds of shader warm-up don't count.
let pixelRatio = Math.min(window.devicePixelRatio, 2);
let slowFor = 0;
function governPixels(frameDt) {
  if (document.hidden || frameDt > 0.25 || clock.elapsedTime < 4) {
    slowFor = 0;
    return;
  }
  slowFor = frameDt > 1 / 45 ? slowFor + frameDt : Math.max(0, slowFor - frameDt * 2);
  if (slowFor > 2 && pixelRatio > 1) {
    pixelRatio = Math.max(1, pixelRatio - 0.25);
    renderer.setPixelRatio(pixelRatio);
    slowFor = 0;
  }
}

function tick() {
  frames++;
  if (frames === 12 || frames === 90) {
    window.__smoke = {
      calls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
    };
  }
  const frameDt = clock.getDelta();
  governPixels(frameDt);

  // A slow frame is simulated as several short slices, not one clamped one —
  // the world keeps real time instead of sinking into slow motion.
  let left = Math.min(frameDt, MAX_CATCHUP);
  do {
    const dt = Math.min(left, STEP);
    step(dt);
    left -= dt;
  } while (left > 1e-4);

  // placed after the camera settles so the tag never trails a frame behind
  if (promptFor) placePrompt(promptScreenPos(promptFor));

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();
