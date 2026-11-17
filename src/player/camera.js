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
  let interior = null; // { minX, maxX, minZ, maxZ, ceilY }
  let indoor01 = 0;
  const INDOOR_DIST = 1.8;

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

    const d = smoothDist + (Math.min(smoothDist, INDOOR_DIST) - smoothDist) * indoor01;
    const cp = Math.cos(pitch);
    desired.set(
      pivot.x + Math.sin(yaw) * cp * d,
      pivot.y + 1.4 + Math.sin(pitch) * d,
      pivot.z + Math.cos(yaw) * cp * d
    );
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

    lookTarget.set(pivot.x, pivot.y + 1.25, pivot.z);
    camera.lookAt(lookTarget);
  }

  return {
    update,
    getYaw: () => yaw,
    setInterior(zone) {
      interior = zone;
    },
    setView(newYaw, newPitch, newDist) {
      yaw = newYaw;
      pitch = Math.min(PITCH_MAX, Math.max(PITCH_MIN, newPitch));
      dist = Math.min(14, Math.max(3, newDist));
      smoothDist = dist; // smoke screenshots want the view now, not eased
      taken = true; // stop the showcase orbit
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
