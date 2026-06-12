import * as THREE from 'three';
import { terrainHeight } from '../scene/terrain.js';

const PITCH_MIN = -0.08;
const PITCH_MAX = 1.2;

export function createOrbitCamera(camera, canvas, isUiOpen) {
  let yaw = Math.PI; // start looking at the player's front
  let pitch = 0.38;
  let dist = 6;
  let everLocked = false;

  const current = new THREE.Vector3(0, 4, 8);
  const desired = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();

  canvas.addEventListener('click', () => {
    if (!isUiOpen() && document.pointerLockElement !== canvas) {
      canvas.requestPointerLock();
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

    const cp = Math.cos(pitch);
    desired.set(
      target.x + Math.sin(yaw) * cp * dist,
      target.y + 1.4 + Math.sin(pitch) * dist,
      target.z + Math.cos(yaw) * cp * dist
    );
    const floor = terrainHeight(desired.x, desired.z) + 0.35;
    if (desired.y < floor) desired.y = floor;

    const k = 1 - Math.exp(-dt * 9);
    current.lerp(desired, k);
    camera.position.copy(current);

    lookTarget.set(target.x, target.y + 1.25, target.z);
    camera.lookAt(lookTarget);
  }

  return {
    update,
    getYaw: () => yaw,
    isLocked: () => document.pointerLockElement === canvas,
    unlock: () => {
      if (document.pointerLockElement === canvas) document.exitPointerLock();
    },
  };
}
