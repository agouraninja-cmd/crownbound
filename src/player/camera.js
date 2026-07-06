import * as THREE from 'three';
import { terrainHeight } from '../scene/terrain.js';

const PITCH_MIN = -0.08;
const PITCH_MAX = 1.2;

export function createOrbitCamera(camera, canvas, isUiOpen) {
  let yaw = Math.PI; // start looking at the player's front
  let pitch = 0.38;
  let dist = 6;
  let everLocked = false;

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

  canvas.addEventListener('click', () => {
    if (!isUiOpen() && document.pointerLockElement !== canvas) {
      // raw 1:1 mouse input — the OS acceleration curve makes aiming swimmy
      const p = canvas.requestPointerLock({ unadjustedMovement: true });
      if (p && p.catch) p.catch(() => canvas.requestPointerLock());
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement !== canvas) return;
    everLocked = true;
    yaw -= e.movementX * 0.0024;
    pitch += e.movementY * 0.0024;
    pitch = Math.min(PITCH_MAX, Math.max(PITCH_MIN, pitch));
  });

  window.addEventListener('wheel', (e) => {
    if (isUiOpen()) return;
    dist = Math.min(10, Math.max(3, dist + Math.sign(e.deltaY) * 0.7));
  });

  function update(dt, target) {
    // gentle showcase orbit until the player first takes the mouse
    if (!everLocked) yaw += dt * 0.12;

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
      everLocked = true; // stop the showcase orbit
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
