import { PROVING } from './proving/proving.js'; // must stay first: the test world's clock is set before anything asks the time
import * as THREE from 'three';
import './ui/ui.css';
import { buildWorld } from './scene/world.js';
import { skyAt, clockHour, compass } from './scene/daylight.js';
import { LAYOUT, pathX, fieldGap, trackGap, doorstep } from './scene/layout.js';
import { createPlayer } from './player/player.js';
import { WEAPON_LOOKS } from './player/playerMesh.js';
import { createOrbitCamera } from './player/camera.js';
import { initHud, showPrompt, placePrompt, showWaymark, placeWaymark, setHp, setStamina, setCoins, setRank, setStreak } from './ui/hud.js';
import { terrainHeight } from './scene/terrain.js';
import { loadState, getState, onChange, introOwed, introDone, noDeedYet, KEYS_LINE, staminaCap, spendStamina, drainStamina, staminaSpent, exportSave, importSave, dailyDoneToday, recordBedtime, evaluateSleep, applySleepReward, judgeReckoning, closeMonths, monthTally, loggedToday, logMoney, unlogMoney, recount, layIn, setPledge, setSummit, wieldedWeapon, ownedWeapons, weaponHungUp, FARM_JOBS, farmJob, farmRowLooks, farmRowParts, workFarmRow, workFarmStretch } from './state/state.js';
import { initPanels, openPanel, closePanel, openPanelId, isPanelOpen } from './ui/panels.js';
import { initMirror } from './state/mirror.js';
import { judgeDeed } from './ai/sage.js';
import { keepChronicle } from './ai/chronicler.js';
import { toast } from './ui/toasts.js';
import { initRest, showRest, setRestVisible } from './ui/rest.js';
import { initIntro, playIntro, introPlaying, introBeat, hurryIntro, caption } from './ui/intro.js';
import { planPath } from './player/pathfind.js';
import { initAudio, sfx } from './ui/audio.js';
import { createDummy } from './combat/dummy.js';
import { createRats } from './combat/rats.js';
import { CONFIG } from './state/config.js';
import { initConsole } from './proving/console.js';

const { messages: bootMessages } = loadState();
initMirror(); // dev-only: shadow the save to saves/crownbound-save.json (adopts it on an empty boot; never in the test world)

// Market days bring the chapman's cart. Sessions are short, so the flag is
// fixed per load like the rollover; ?market=1|0 overrides it (smoke tests).
const marketParam = new URLSearchParams(location.search).get('market');
const marketToday =
  marketParam !== null
    ? marketParam === '1'
    : CONFIG.shop.marketWeekdays.includes(new Date().getDay());

// The sky shows the hour of the player's own clock. ?hour=17.5 holds it at
// that hour of today instead (smoke tests, and a look at any time of day).
const hourParam = parseFloat(new URLSearchParams(location.search).get('hour'));
function skyClock() {
  const now = new Date();
  if (Number.isFinite(hourParam)) now.setHours(0, 0, hourParam * 3600, 0);
  return now;
}

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

const world = buildWorld(scene, marketToday, skyClock);
const player = createPlayer(scene, LAYOUT.playerSpawn);
player.hearth = LAYOUT.campfire; // stand still by it and he sits to warm himself

// the weapon in hand (chosen at the chest) and the home comforts bought from
// the chapman, applied on load, on purchase, and when a weapon is taken up
function applyPurchases() {
  const w = wieldedWeapon(); // the stick carries no damage/reach/tier of its own
  player.attackDamage = w.damage ?? CONFIG.player.attackDamage;
  player.attackReach = CONFIG.player.attackRange + (w.reach ?? 0);
  player.setWeaponTier(w.tier ?? 0);
  // the rack by the door holds every weapon not in hand (all of them, hands empty)
  player.setUnarmed(weaponHungUp());
  const looks = [];
  for (const o of ownedWeapons()) {
    if (o.id !== w.id || weaponHungUp()) looks[o.tier ?? 0] = WEAPON_LOOKS[o.tier ?? 0];
  }
  world.setRackWeapons(looks);
  world.applyHomeUpgrades(getState().shop.owned);
}
applyPurchases();

// combat actions draw from the daily stamina pool
player.trySpend = (cost) => spendStamina(cost);
// walking and running draw on it too; emptied, he is done for the day (see "spent")
player.tire = (n) => drainStamina(n);
player.onUnarmed = () =>
  toast(`Thy hands are empty — ${wieldedWeapon().name} hangs on the rack at home.`, 'grim');
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
    if (!isPanelOpen() && !keysWithheld()) player.setEnabled(true);
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
    if (!isPanelOpen() && !keysWithheld()) player.setEnabled(true);
    sleeping = false;
  }, 2600);
}

// ---------- spent for the day ----------
// The moment the stamina pool hits nought he is done: the keys let go, he
// walks himself home (a path around everything, through the field gate if
// need be), opens his door, lies down on his cot, and the rest card says
// so — play resumes tomorrow. The flag lives in the save (staminaSpent), so
// opening the game again today finds him already abed.
let resting = false; // abed, the rest card up
let homeward = false; // on the walk home
let spentPending = false; // spent, waiting for a swing or a leap to finish first
let bedtimeIso = null; // a bedtime marked from the rest card since he lay down
let restTimer = null; // the last moments before the rest card: the tuck-in, or the hurry's fade
const abed = () => resting || homeward || spentPending;
// the keys are not his: abed for the day, or the opening is still playing
const keysWithheld = () => abed() || introPlaying();
let lastHomeward = null; // how the last walk home ended: 'walked' | 'hurried' (smoke tests)
const watch = { t: 0, x: 0, z: 0 }; // a stall on the way home: hurried there instead

function beginHomeward() {
  spentPending = false;
  homeward = true;
  player.setEnabled(false);
  player.invulnerable = true; // no rat spoils the walk home
  showPrompt(null);
  watch.t = 0;
  watch.x = player.pos.x;
  watch.z = player.pos.z;
  toast('Your strength is spent. Home to your cot. (E — hurry home)', 'grim');
  const D = world.door;
  const inDoor = { x: D.x - 0.7, z: D.z }; // just over the threshold
  const toBed = [inDoor, world.wakeSpot];
  if (insideHovel()) {
    player.walkRoute([world.wakeSpot], tuckIn);
    return;
  }
  const route = planPath(world.colliders, player.pos, { x: D.x + 1.3, z: D.z }); // the doorstep
  if (!route) {
    hurryHome();
    return;
  }
  player.walkRoute(route, () => {
    if (!D.isOpen) {
      D.toggle();
      sfx.creak();
    }
    setTimeout(() => {
      if (homeward) player.walkRoute(toBed, tuckIn);
    }, 450);
  });
}

// over the threshold to the cot: he lies down, and the day is done
function tuckIn() {
  if (!homeward) return;
  homeward = false;
  lastHomeward = 'walked';
  player.startSleep(world.bedRest);
  restTimer = setTimeout(goToRest, 1700);
}

// skipped, stuck, or no way through: a fade, and he wakes abed
function hurryHome() {
  if (!homeward) return;
  homeward = false;
  lastHomeward = 'hurried';
  player.route = null;
  fadeEl.classList.add('show');
  restTimer = setTimeout(() => {
    player.lieDownAt(world.bedRest);
    fadeEl.classList.remove('show');
    goToRest();
  }, 800);
}

function drawRest() {
  showRest({ dailyDone: dailyDoneToday(), bedtimeIso });
}

function goToRest() {
  restTimer = null;
  resting = true;
  player.setEnabled(false);
  orbitCam.unlock(); // the mouse is wanted for the card's buttons
  document.body.classList.add('abed');
  if (isPanelOpen()) setRestVisible(false);
  else drawRest();
}

function retireForTheNight() {
  recordBedtime();
  bedtimeIso = getState().sleep.retiredAt;
  sfx.page();
  toast('The night is marked. Sleep well.', '');
  drawRest();
}

// up from the cot: today's deed, posted from bed, refills the pool
function wakeFromRest() {
  resting = false;
  document.body.classList.remove('abed');
  setRestVisible(false);
  player.respawn(world.wakeSpot.x, world.wakeSpot.z); // on his feet beside the cot
  toast('The deed is done — strength floods back. Up, and onward!', 'gold');
  if (!isPanelOpen()) player.setEnabled(true); // else when the board closes
}

// The Proving Ground's console only (stamina handed back by a command): on
// his feet again, from whatever stage of going to bed spent he had reached.
function rouse() {
  if (!abed() && !restTimer) return;
  clearTimeout(restTimer);
  restTimer = null;
  const lying = resting || player.mode === 'sleep';
  resting = homeward = spentPending = false;
  fadeEl.classList.remove('show');
  document.body.classList.remove('abed');
  setRestVisible(false);
  if (lying) {
    player.respawn(world.wakeSpot.x, world.wakeSpot.z); // up beside the cot
  } else {
    player.route = null; // stopped where he stood on the road home
    player.invulnerable = false;
  }
  if (!isPanelOpen()) player.setEnabled(true);
}

onChange((reason) => {
  if (reason === 'stamina' && staminaSpent() && !abed()) spentPending = true;
  if (reason === 'quests' && resting && !staminaSpent()) wakeFromRest();
});

// E hurries the walk home
window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyE' && homeward && !e.repeat) hurryHome();
});

// on the way home: steps along (begun once a swing or leap is over), and a
// walk that has stalled for a few seconds is hurried instead
function stepSpent(dt) {
  if (spentPending && player.mode === 'normal' && !player.airborne && player.hp > 0 && !sleeping) beginHomeward();
  if (!homeward || !player.route) return;
  watch.t += dt;
  if (watch.t < 3) return;
  if (Math.hypot(player.pos.x - watch.x, player.pos.z - watch.z) < 0.6) hurryHome();
  watch.t = 0;
  watch.x = player.pos.x;
  watch.z = player.pos.z;
}

// the card's buttons — the panels stay usable abed; Esc and the map do not wake him
const isUiOpen = isPanelOpen;
const orbitCam = createOrbitCamera(camera, renderer.domElement, () => isPanelOpen() || resting || introPlaying());
orbitCam.setInterior(world.hovelInterior);
orbitCam.setGuard(world.village.sight); // the eye stops at a neighbour's wall rather than pass behind it
// where pointer lock is refused, a plain click on the scene is the swing
orbitCam.setOnTap(() => {
  if (player.isEnabled()) player.attack();
});

initHud();
initPanels(
  (opened) => {
    player.setEnabled(!opened && !keysWithheld());
    if (resting) {
      if (opened) setRestVisible(false);
      else drawRest(); // a deed posted from bed changes his line
    }
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

initRest({
  board: () => openPanel('board'),
  tome: () => openPanel('tome'),
  treasury: () => openPanel('treasury'),
  retire: retireForTheNight,
});
// opened again on a day already spent: he is found abed
if (staminaSpent()) {
  player.lieDownAt(world.bedRest);
  goToRest();
}

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

// ---------- the opening, and the cold fire ----------
// A save begun from nothing opens on the opening (src/ui/intro.js): a dream
// of the crown, the waking in the hovel, the oath. ?intro=1 plays it over any
// save (it changes nothing but what is written on the oath); ?intro=0 never
// plays it, nor the cold fire's pointer after it (the smoke suite).
const introParam = new URLSearchParams(location.search).get('intro');
if (introParam === '1') {
  // asked for once: a reload should not play it again
  const url = new URL(location.href);
  url.searchParams.delete('intro');
  history.replaceState(null, '', url);
}
if (introParam === '0') introDone();
// not on a day already spent — he is abed under the rest card
const opening = !staminaSpent() && (introParam === '1' || (introParam !== '0' && introOwed()));

// the first words of a session; a newcomer's two greetings are left out when
// the opening has said them in its own way
function greet() {
  for (const m of bootMessages) if (!(opening && m.greeting)) toast(m.text, m.style);
  if (opening) toast(KEYS_LINE, '');
  if (marketToday) toast('The chapman has come — his cart stands by the path.', 'gold');
}

// The cold fire: until a first daily deed has ever been logged the fire has
// never been lit, and a newcomer is shown the way — a waymark hangs on the
// Quest Board (and, straight out of the opening, on his own door first), and
// the one line is said as he comes out under the sky. Looking at the board
// puts the waymark away for the sitting; the first deed logged ends it for good.
const COLD_FIRE = 'The fire is cold. Only a deed done will light it.';
const WAYMARKS = {
  door: { label: 'Thy door', at: () => world.door, raise: 2.25 },
  board: { label: 'The Quest Board', at: () => LAYOUT.questBoard, raise: 3.1 },
};
let fireCold = introParam !== '0' && noDeedYet(); // still waiting on its first deed
let waymark = null; // 'door' | 'board' | null — what the waymark hangs on

function stepColdFire() {
  if (waymark === 'door' && !insideHovel()) {
    waymark = 'board';
    caption(COLD_FIRE);
  }
  if (waymark === 'board' && openPanelId() === 'board') waymark = null;
}

onChange((reason) => {
  if (reason !== 'quests' || !fireCold || noDeedYet()) return;
  fireCold = false;
  waymark = null;
  // a breath after the deed's own reward is told
  setTimeout(() => toast('The fire catches. Thy first deed feeds it — tend it daily, and it grows.', 'gold'), 900);
});

// Where the eye sits for the waking — side on to the cot: the orbit's yaw and
// pitch, and the height above the floor it looks at (he is lying down, not
// standing). As he gets up it swings round behind him, so the keys are handed
// over with his door straight ahead.
const WAKING_VIEW = { yaw: 1.75, pitch: 0.16, gaze: 0.7 };
const doorwards = () => Math.atan2(world.door.x - world.wakeSpot.x, world.door.z - world.wakeSpot.z);
const BEHIND_HIM = { pitch: 0.3, dist: 6 }; // the eye's yaw is his facing turned about

initIntro({
  hour: () => skyClock().getHours(),
  // abed in his hovel for the dark to lift on, seen side on
  lieDown() {
    player.lieDownAt(world.bedRest);
    player.setEnabled(false);
    orbitCam.setView(WAKING_VIEW.yaw, WAKING_VIEW.pitch, BEHIND_HIM.dist);
    orbitCam.setGaze(WAKING_VIEW.gaze);
  },
  // up off the cot, turned to his door, the eye coming round behind him
  rise(onUp) {
    orbitCam.setGaze(null);
    orbitCam.glideTo(doorwards() + Math.PI, BEHIND_HIM.pitch, 2.4);
    player.rise(world.wakeSpot, doorwards(), onUp);
  },
  stand() {
    orbitCam.setGaze(null);
    orbitCam.setView(doorwards() + Math.PI, BEHIND_HIM.pitch, BEHIND_HIM.dist);
    player.respawn(world.wakeSpot.x, world.wakeSpot.z);
    player.faceToward(world.door.x, world.door.z);
  },
  // the opening is over: the keys are his, and the way out is shown
  end() {
    introDone();
    player.setEnabled(!isPanelOpen());
    greet();
    if (fireCold) waymark = insideHovel() ? 'door' : 'board';
  },
});
if (opening) {
  playIntro();
} else {
  setTimeout(greet, 700);
  // a newcomer back again with no deed yet logged: the fire is as cold as he left it
  if (fireCold && !staminaSpent()) {
    waymark = 'board';
    setTimeout(() => caption(COLD_FIRE), 1800);
  }
}

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
  // A newcomer's first E is his own door: straight out of the opening, while
  // it stands shut, it is offered from anywhere in reach — the cot and the
  // chest, nearer though they are, would only send him back to bed.
  if (waymark === 'door' && !world.door.isOpen && dDoor < world.door.radius) return { id: 'door', x: world.door.x, z: world.door.z };
  const itD = it ? Math.hypot(player.pos.x - it.x, player.pos.z - it.z) : Infinity;
  if (dDoor < world.door.radius && dDoor < itD) return { id: 'door', x: world.door.x, z: world.door.z };
  return it;
}

function promptText(a) {
  const label =
    a.id === 'door' ? (world.door.isOpen ? 'close the door' : 'open the door')
    : a.label;
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

// Where the waymark hangs: over its target while the camera has that in
// view, else at the side of the screen to turn toward. It is put away while
// the E prompt is on the very same thing, under a panel, and whenever the
// keys are not his.
function waymarkPlace() {
  const w = WAYMARKS[waymark];
  if (!w || !player.isEnabled() || promptFor?.id === waymark) return null;
  const at = w.at();
  const y = terrainHeight(at.x, at.z) + w.raise;
  camera.updateMatrixWorld();
  promptV.set(at.x, y, at.z).project(camera);
  const paces = Math.round(Math.hypot(at.x - player.pos.x, at.z - player.pos.z));
  const text = paces > 3 ? `${w.label} · ${paces} paces` : w.label;
  if (promptV.z < 1 && Math.abs(promptV.x) < 0.88 && Math.abs(promptV.y) < 0.88) {
    const px = (promptV.x * 0.5 + 0.5) * window.innerWidth;
    const py = (-promptV.y * 0.5 + 0.5) * window.innerHeight;
    return { text, pos: [px, Math.max(py, 56)], edge: null };
  }
  // out of view: in the camera's own frame, +x is to the right
  promptV.set(at.x, y, at.z).applyMatrix4(camera.matrixWorldInverse);
  return { text, pos: null, edge: promptV.x > 0 ? 'right' : 'left' };
}

// the villagers mark your coming — once per visit, a nod and a quiet word
world.exchequer.onGreet = () =>
  toast(
    loggedToday()
      ? 'The clerk inclines his head.'
      : 'The clerk looks up. Any coin come or gone today?',
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
// E at a ridge works it: he goes to its head and works his way along it with
// the tool for the day's job, the ridge changing under each blow. When every
// ridge has had it, the miller pays. One job a day.
const field = world.field;
field.draw(farmRowLooks(), farmRowParts());
onChange((reason) => {
  if (reason === 'farm') field.draw(farmRowLooks(), farmRowParts());
});
// he walks on the strip's ridges and furrows, not on the ground under them
player.groundAt = (x, z) => terrainHeight(x, z) + field.riseAt(x, z);

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

// The ridge under the hoe, and the end of it the work began from (-1 or +1
// along the ridge): each blow works it from there to where the blow lands.
let workingRow = -1;
let workingEnd = 1;
const FURROW_SIDE = 0.5; // he walks this far off the crown, in the furrow beside it

// E at a ridge: he goes to its head — the end the work on it began from, or
// the nearer end of a ridge not yet begun — and works his way along it to the
// other end. He walks the furrow on the side he stood, turned in toward the
// crown, so each blow lands on it a little ahead (and the tool shows).
function workTheField() {
  const job = farmJob();
  if (!job) {
    toast(FIELD_WAITS[FARM_JOBS[getState().farm.stage]], '');
    return;
  }
  if (player.mode !== 'normal') return;
  const row = field.spot.row;
  const HL = field.halfLength;
  const R = CONFIG.farm.workReach;
  const me = field.toField(player.pos.x, player.pos.z);
  const cp = field.ridgePoint(row, 0);
  const crown = field.toField(cp.x, cp.z);
  const part = getState().farm.part[row];
  const end = part ? part.end : me.u >= 0 ? 1 : -1;
  const side = me.v >= crown.v ? 1 : -1;
  const turn = Math.asin(Math.min(1, FURROW_SIDE / R)); // turned in just enough that the blow finds the crown
  const ahead = R * Math.cos(turn);
  const worked = part ? part.k * HL * 2 : 0;
  const from = field.ridgePoint(row, end * (HL - worked + ahead), side * FURROW_SIDE);
  const to = field.ridgePoint(row, -end * (HL - ahead), side * FURROW_SIDE);
  // the way along the ridge, and across it toward the crown, in the world
  const o = field.ridgePoint(row, 0, 0);
  const a = field.ridgePoint(row, -end, 0);
  const c = field.ridgePoint(row, 0, -side);
  const fx = (a.x - o.x) * Math.cos(turn) + (c.x - o.x) * Math.sin(turn);
  const fz = (a.z - o.z) * Math.cos(turn) + (c.z - o.z) * Math.sin(turn);
  const facing = Math.atan2(fx, fz);
  const begin = () => {
    if (farmJob() !== job || !player.startWork(job, from, to, facing)) return;
    workingRow = row;
    workingEnd = end;
    // the eye swings round to his side: from straight behind, his body hides
    // the tool. A touch of the mouse or a look key calls the swing off.
    orbitCam.glideTo(facing + Math.PI - 1.0, Math.max(orbitCam.getView().pitch, 0.32), 0.9);
  };
  if (Math.hypot(from.x - player.pos.x, from.z - player.pos.z) < 0.3) begin();
  else player.walkRoute([from], begin, { yields: true }); // a movement key calls the walk off
}
// where a blow lands: a little ahead of him, the way he faces
const blowAt = () => {
  const R = CONFIG.farm.workReach;
  return { x: player.pos.x + Math.sin(player.facing) * R, z: player.pos.z + Math.cos(player.facing) * R };
};
player.onWorkStroke = (kind) => {
  if (kind === 'sow') sfx.sow();
  else if (kind === 'reap') sfx.reap();
  else sfx.dig();
  // earth, seed or chaff flies where it lands — and the ridge is worked up to there
  const at = blowAt();
  field.kick(kind, at.x, at.z, player.facing);
  const HL = field.halfLength;
  const k = (HL - workingEnd * field.toField(at.x, at.z).u) / (HL * 2);
  workFarmStretch(workingRow, workingEnd, Math.min(0.999, Math.max(0, k))); // the strip redraws itself on the change
};
player.onWorkDone = () => {
  const worked = workFarmStretch(workingRow, workingEnd, 1); // the whole length: the ridge is done
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
  } else if (a.id === 'rack') {
    sfx.creak();
    orbitCam.unlock();
    openPanel('rack');
  } else if (a.id === 'miller') {
    millerGreeting();
  } else if (a.id === 'field') {
    workTheField();
  } else {
    orbitCam.unlock();
    openPanel(a.id);
  }
});

// The Proving Ground (?test=1): the test world's command line, and what its
// commands may lay hands on. Nothing here exists in the true world.
if (PROVING) {
  initConsole({
    player,
    world,
    rouse,
    applyPurchases,
    abed,
    // set him down somewhere else, on his feet and no healthier than he was
    moveTo(x, z) {
      const hp = player.hp;
      player.respawn(x, z);
      player.hp = hp;
      player.onHpChange(hp, player.maxHp);
    },
    // while the line is typed the keys let go of him (they come back with it
    // shut), and the mouse is freed — or the first Esc would be spent on that
    typing(on) {
      player.setEnabled(!on && !isPanelOpen() && !keysWithheld());
      if (on) orbitCam.unlock();
    },
    busy: () => isPanelOpen() || sleeping || introPlaying(), // no command line under a panel, mid-nap or over the opening
  });
}

// headless smoke-test hook, harmless in normal play
if (new URLSearchParams(location.search).has('smoke')) {
  window.__game = { scene, camera, renderer, sky: world.sky, skyAt, clockHour, compass, colliders: world.colliders, village: world.village, mapMarks: world.mapMarks, planPath, layout: { LAYOUT, pathX, fieldGap, trackGap, doorstep }, orbitCam, player, openPanel, openPanelId, getState, spendStamina, drainStamina, spent: () => ({ resting, homeward, pending: spentPending, last: lastHomeward }), intro: { beat: introBeat, hurry: hurryIntro, playing: introPlaying, waymark: () => waymark, fireCold: () => fireCold }, exportSave, importSave, rats, dummy, campfire: world.campfire, door: world.door, chest: world.chest, cart: world.cart, exchequer: world.exchequer, miller: world.miller, field, farmJob, farmRowLooks, farmRowParts, workFarmRow, workFarmStretch, homeUpgrades: world.homeUpgrades, sleepAtCot, evaluateSleep, applySleepReward, judgeReckoning, closeMonths, monthTally, loggedToday, logMoney, unlogMoney, recount, layIn, setPledge, setSummit, judgeDeed, wakeSpot: world.wakeSpot, CONFIG };
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
    stepSpent(dt);
    player.update(dt, orbitCam.getYaw(), world.colliders);
    rats.update(dt, player, (dmg, x, z) => player.takeDamage(dmg, x, z));
    dummy.update(dt);
    aimFieldSpot();
    promptFor = player.isEnabled() && player.mode !== 'work' ? nearestAction() : null; // none while asleep, dead or busy at a ridge
    showPrompt(promptFor ? promptText(promptFor) : null);
  }

  stepColdFire(); // not paused by a panel: opening the board is what it waits for
  world.campfire.update(dt);
  world.door.update(dt);
  world.chest.update(dt);
  world.exchequer.update(dt, player.pos);
  world.miller.update(dt, player.pos);
  world.cart?.update(dt, player.pos);
  orbitCam.update(dt, player.pos);
  // his back to a neighbour's wall, the eye has nowhere to stand but in the back of his head: he is not drawn then
  player.mesh.group.visible = !orbitCam.crowded();
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
  const mark = isPanelOpen() ? null : waymarkPlace();
  showWaymark(mark?.text ?? null);
  if (mark) placeWaymark(mark.pos, mark.edge);

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();
