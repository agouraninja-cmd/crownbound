import * as THREE from 'three';
import { terrainHeight } from '../scene/terrain.js';
import { mouseSens, lookScale } from '../state/prefs.js';
import { CONFIG } from '../state/config.js';

const PITCH_MIN = -0.08;
const PITCH_MAX = 1.2;
const DIST_MIN = 3;
const DIST_MAX = 10;

// The eye on the keys (a laptop with no mouse): each key, the way it moves the
// view — [turn, tilt, zoom], each -1..1. ← turns the view left as the mouse
// moved left does; ↑ looks up; − draws the eye back.
const LOOK_KEYS = {
  ArrowLeft: [1, 0, 0],
  ArrowRight: [-1, 0, 0],
  ArrowUp: [0, -1, 0],
  ArrowDown: [0, 1, 0],
  Minus: [0, 0, 1],
  NumpadSubtract: [0, 0, 1],
  Equal: [0, 0, -1],
  NumpadAdd: [0, 0, -1],
};
// − and = by the character too, wherever a keyboard's layout puts them
const LOOK_CHARS = { '-': [0, 0, 1], _: [0, 0, 1], '=': [0, 0, -1], '+': [0, 0, -1] };
const lookFor = (e) => LOOK_KEYS[e.code] ?? LOOK_CHARS[e.key];
const keyId = (e) => e.code || e.key;

const typingIn = (el) => el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;

export function createOrbitCamera(camera, canvas, isUiOpen) {
  let yaw = Math.PI; // start looking at the player's front
  let pitch = 0.38;
  let dist = 6;
  let taken = false; // the player has taken the reins (mouse or keys) — the showcase orbit stops
  let lockDenied = false; // the host refused pointer lock — drag-to-look instead
  let dragging = false;
  let dragDist = 0;
  let onTap = null;
  const TAP_SLOP = 5; // px of travel under which a press counts as a click

  // The camera orbits a smoothed pivot, not the player directly: walking
  // stays soft, but yaw/pitch place the camera rigidly each frame — easing
  // mouse rotation after the fact is exactly what reads as "swimmy."
  const pivot = new THREE.Vector3();
  let pivotSnapped = false;
  let smoothDist = dist;
  const desired = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();
  let shakeAmt = 0;

  // when the player is inside this room, the orbit pulls in close and stays
  // under the rafters instead of clipping through the walls
  // the height above his feet the eye looks at: his head — or lower, for a
  // look at him lying on his cot (setGaze). Eased, so the view follows him up.
  const GAZE = 1.25;
  let gaze = GAZE;
  let gazeNow = GAZE;

  // one move the eye makes by itself (glideTo): round to a new yaw and pitch
  let glide = null; // { yaw0, pitch0, turn, tilt, t, seconds }

  let interior = null; // { minX, maxX, minZ, maxZ, ceilY }
  let indoor01 = 0;
  const INDOOR_DIST = 1.8;

  // A neighbour's house between the eye and the man would hide him behind a
  // wall of thatch, so the orbit is shortened to stop the eye at the wall
  // (setGuard: how far a line from his head is clear). It draws in at once
  // and lets out again slowly, so passing a house's corner does not pump it.
  // With his back to a wall there is no room behind him at all: the eye then
  // comes right up behind his head sooner than pass through into the house,
  // and main.js leaves him undrawn while it is that close (crowded()).
  let guard = null; // (x, y, z, dx, dy, dz, length) => the clear length of that line
  let guarded = Infinity; // how long the orbit is allowed to be while a house is in the way, eased (Infinity: nothing is)
  let crowded = false; // the eye is so near his head that he would fill the view
  const GUARD_GAP = 0.3; // the eye stops this far short of the wall
  const GUARD_MIN = 0.9; // ...and no nearer his head than this, unless the wall itself is nearer
  const GUARD_SKIN = 0.06; // ...when it is: this far short of the wall, and no more
  const CROWDED = 0.6; // an orbit shorter than this has the eye in the back of his head

  function tryLock() {
    if (isUiOpen() || document.pointerLockElement === canvas) return;
    // raw 1:1 mouse input — the OS acceleration curve makes aiming swimmy
    const p = canvas.requestPointerLock({ unadjustedMovement: true });
    if (p && p.catch) {
      p.catch(() => {
        // no raw input here; take the ordinary lock. If even that is denied
        // (no user gesture yet, some automated contexts), stay quiet — an
        // unhandled rejection reads as a console error.
        const q = canvas.requestPointerLock();
        if (q && q.catch) q.catch(() => { lockDenied = true; });
      });
    }
  }

  canvas.addEventListener('click', tryLock);
  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === canvas) lockDenied = false;
  });

  // Some hosts refuse pointer lock outright (embedded browser panes). There the
  // mouse falls back to hold-and-drag: left button held on the scene turns the
  // view, and a click that never dragged is handed to onTap (the attack).
  canvas.addEventListener('mousedown', (e) => {
    if (e.button !== 0 || isUiOpen() || document.pointerLockElement === canvas) return;
    dragging = true;
    dragDist = 0;
  });
  window.addEventListener('mouseup', (e) => {
    if (e.button !== 0 || !dragging) return;
    dragging = false;
    if (lockDenied && dragDist < TAP_SLOP && !isUiOpen() && onTap) onTap();
  });

  // the mouse connects itself: any movement key counts as taking the reins,
  // so play never demands a deliberate click — not E or Esc, which drive
  // panels and must not race the lock. The first of them also stops the
  // showcase orbit, or a player who never touches a mouse would watch the
  // view drift round as he walks.
  const LOCK_KEYS = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyC', 'ShiftLeft', 'ShiftRight', 'KeyF'];
  // look keys down: id → { move, seen, up }. A press let go before any frame
  // has seen it is kept for one step, so a quick tap always nudges the view
  // however slow the frames are.
  const held = new Map();
  window.addEventListener('keydown', (e) => {
    if (typingIn(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (LOCK_KEYS.includes(e.code)) {
      taken = true;
      tryLock();
    }
    const move = lookFor(e);
    if (move && !isUiOpen()) {
      taken = true;
      glide = null; // ...and so do the look keys
      const h = held.get(keyId(e));
      if (h) h.up = false;
      else held.set(keyId(e), { move, seen: false, up: false });
      e.preventDefault(); // the arrows must never scroll anything
    }
  });
  window.addEventListener('keyup', (e) => {
    const h = held.get(keyId(e));
    if (!h) return;
    if (h.seen) held.delete(keyId(e));
    else h.up = true;
  });
  window.addEventListener('blur', () => held.clear());

  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement !== canvas) {
      if (!dragging) return;
      dragDist += Math.abs(e.movementX) + Math.abs(e.movementY);
    }
    taken = true;
    glide = null; // the hand on the mouse outranks a move the eye was making by itself
    const sens = mouseSens(); // live — a Tome change takes hold mid-stride
    yaw -= e.movementX * sens;
    pitch += e.movementY * sens;
    pitch = Math.min(PITCH_MAX, Math.max(PITCH_MIN, pitch));
  });

  // The wheel draws the eye near or back by how far it turned: a mouse's notch
  // (100px) is one 0.7 step, and a touchpad's two-finger glide — dozens of
  // tiny turns — zooms smoothly instead of leaping end to end. A touchpad's
  // pinch arrives as a wheel with Ctrl held: here it zooms the eye, not the page.
  window.addEventListener(
    'wheel',
    (e) => {
      if (isUiOpen()) return;
      if (e.ctrlKey) e.preventDefault();
      const px = e.deltaY * (e.deltaMode === 1 ? 33 : e.deltaMode === 2 ? 800 : 1); // lines / pages → px
      const step = Math.max(-0.7, Math.min(0.7, px * (e.ctrlKey ? 0.03 : 0.007)));
      dist = Math.min(DIST_MAX, Math.max(DIST_MIN, dist + step));
    },
    { passive: false }
  );

  // the look keys: each axis comes up to speed and stops again over a few
  // hundredths, so a tap nudges the view and a hold sweeps it round
  const keyVel = [0, 0, 0]; // turn, tilt, zoom — each -1..1
  function steerByKeys(dt) {
    // a panel or a text box took the keys: whatever was held is let go, and
    // the eye stops dead rather than coasting on under the parchment
    if (isUiOpen() || typingIn(document.activeElement)) {
      held.clear();
      keyVel.fill(0);
      return;
    }
    const want = [0, 0, 0];
    for (const [id, h] of held) {
      h.move.forEach((v, i) => (want[i] += v));
      h.seen = true;
      if (h.up) held.delete(id); // a tap: this one step was its due
    }
    const K = CONFIG.keyLook;
    const k = 1 - Math.exp(-dt * K.ease);
    for (let i = 0; i < 3; i++) {
      keyVel[i] += (Math.max(-1, Math.min(1, want[i])) - keyVel[i]) * k;
      if (!want[i] && Math.abs(keyVel[i]) < 1e-3) keyVel[i] = 0;
    }
    if (!keyVel[0] && !keyVel[1] && !keyVel[2]) return;
    const feel = lookScale(); // live, like the mouse
    yaw += keyVel[0] * K.turn * feel * dt;
    pitch = Math.min(PITCH_MAX, Math.max(PITCH_MIN, pitch + keyVel[1] * K.tilt * feel * dt));
    dist = Math.min(DIST_MAX, Math.max(DIST_MIN, dist + keyVel[2] * K.zoom * dt));
  }

  function update(dt, target) {
    // gentle showcase orbit until the player first takes the reins
    if (!taken) yaw += dt * 0.12;
    steerByKeys(dt);
    if (glide) {
      glide.t += dt;
      const k = Math.min(1, glide.t / glide.seconds);
      const e = k * k * (3 - 2 * k);
      yaw = glide.yaw0 + glide.turn * e;
      pitch = glide.pitch0 + glide.tilt * e;
      if (k >= 1) glide = null;
    }

    const inside =
      interior &&
      target.x > interior.minX &&
      target.x < interior.maxX &&
      target.z > interior.minZ &&
      target.z < interior.maxZ;
    indoor01 += ((inside ? 1 : 0) - indoor01) * (1 - Math.exp(-dt * 6));

    if (!pivotSnapped) {
      pivot.copy(target);
      pivotSnapped = true;
    } else {
      pivot.lerp(target, 1 - Math.exp(-dt * 9));
    }
    smoothDist += (dist - smoothDist) * (1 - Math.exp(-dt * 9)); // wheel zoom eases, rotation doesn't

    let d = smoothDist + (Math.min(smoothDist, INDOOR_DIST) - smoothDist) * indoor01;
    const cp = Math.cos(pitch);
    const ox = Math.sin(yaw) * cp; // the way from his head to the eye
    const oy = Math.sin(pitch);
    const oz = Math.cos(yaw) * cp;
    if (guard) {
      const free = guard(pivot.x, pivot.y + 1.4, pivot.z, ox, oy, oz, d);
      // the orbit this line of sight allows — never past the wall, however near that is
      const want = free >= d ? d : Math.max(free - GUARD_GAP, Math.min(GUARD_MIN, free - GUARD_SKIN), 0.05);
      if (guarded > d) guarded = d; // not drawn in — or the orbit itself has been shortened
      guarded += (want - guarded) * (1 - Math.exp(-dt * (want < guarded ? 20 : 3.5)));
      const letGo = want >= d && d - guarded < 0.02; // let out all the way: the guard lets go of the zoom
      d = guarded;
      if (letGo) guarded = Infinity;
    }
    crowded = d < CROWDED;
    desired.set(pivot.x + ox * d, pivot.y + 1.4 + oy * d, pivot.z + oz * d);
    const floor = terrainHeight(desired.x, desired.z) + 0.35;
    if (desired.y < floor) desired.y = floor;
    if (indoor01 > 0.001) {
      // box the camera inside the room: a short orbit alone still pokes
      // through a wall whenever the player stands right next to it
      const capped = Math.min(desired.y, interior.ceilY);
      const cx = Math.min(Math.max(desired.x, interior.minX + 0.25), interior.maxX - 0.25);
      const cz = Math.min(Math.max(desired.z, interior.minZ + 0.25), interior.maxZ - 0.25);
      desired.y += (capped - desired.y) * indoor01;
      desired.x += (cx - desired.x) * indoor01;
      desired.z += (cz - desired.z) * indoor01;
    }

    camera.position.copy(desired);

    if (shakeAmt > 0.002) {
      camera.position.x += (Math.random() - 0.5) * shakeAmt;
      camera.position.y += (Math.random() - 0.5) * shakeAmt;
      shakeAmt *= Math.exp(-dt * 7);
    }

    gazeNow += (gaze - gazeNow) * (1 - Math.exp(-dt * 3));
    // drawn in hard behind his head, the eye looks out along its own line — at the
    // orbit's middle, not down at the small of his back, which so close would be the ground
    const near = 1 - Math.min(1, Math.max(0, (d - 0.5) / 0.7));
    lookTarget.set(pivot.x, pivot.y + gazeNow + (1.4 - gazeNow) * near, pivot.z);
    camera.lookAt(lookTarget);
  }

  return {
    update,
    getYaw: () => yaw,
    // the guard has the eye hard up behind his head: he is better left undrawn
    crowded: () => crowded,
    setInterior(zone) {
      interior = zone;
    },
    // fn(x, y, z, dx, dy, dz, length): how much of the line from (x, y, z)
    // along the unit way (dx, dy, dz) is clear of what the eye must not pass
    setGuard(fn) {
      guard = fn;
    },
    setView(newYaw, newPitch, newDist) {
      glide = null;
      yaw = newYaw;
      pitch = Math.min(PITCH_MAX, Math.max(PITCH_MIN, newPitch));
      dist = Math.min(14, Math.max(3, newDist));
      smoothDist = dist; // smoke screenshots want the view now, not eased
      guarded = Infinity; // ...and the guard measured afresh from there
      taken = true; // stop the showcase orbit
    },
    // Swing the eye round to a new yaw and pitch over `seconds`, the short
    // way about — the opening's camera move, made while the mouse and the
    // keys are not yet his, and the turn to watch him at a ridge. The mouse
    // or a look key calls it off.
    glideTo(newYaw, newPitch, seconds) {
      const turn = Math.atan2(Math.sin(newYaw - yaw), Math.cos(newYaw - yaw));
      const tilt = Math.min(PITCH_MAX, Math.max(PITCH_MIN, newPitch)) - pitch;
      glide = { yaw0: yaw, pitch0: pitch, turn, tilt, t: 0, seconds };
      taken = true;
    },
    // look at a spot this high above his feet instead of at his head (null:
    // his head again). The first call takes hold at once; after that it eases.
    setGaze(height) {
      gaze = height ?? GAZE;
      if (!pivotSnapped) gazeNow = gaze;
    },
    // where the eye is, for the smoke suite
    getView: () => ({ yaw, pitch, dist, taken }),
    setOnTap(fn) {
      onTap = fn;
    },
    isLocked: () => document.pointerLockElement === canvas,
    unlock: () => {
      if (document.pointerLockElement === canvas) document.exitPointerLock();
    },
    shake: (amount) => {
      shakeAmt = Math.min(shakeAmt + amount, 0.5);
    },
  };
}
