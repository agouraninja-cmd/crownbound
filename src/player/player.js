import * as THREE from 'three';
import { CONFIG } from '../state/config.js';
import { terrainHeight } from '../scene/terrain.js';
import { buildPlayerMesh } from './playerMesh.js';

const P = CONFIG.player;
const PLAYER_RADIUS = 0.35;
const WORLD_RADIUS = 78;

function lerpAngle(a, b, t) {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

export function createPlayer(scene, spawn) {
  const m = buildPlayerMesh();
  m.group.position.set(spawn.x, terrainHeight(spawn.x, spawn.z), spawn.z);
  m.group.rotation.y = Math.PI / 3;
  scene.add(m.group);

  const keys = new Set();
  let enabled = true;

  window.addEventListener('keydown', (e) => {
    if (enabled) keys.add(e.code);
  });
  window.addEventListener('keyup', (e) => keys.delete(e.code));
  window.addEventListener('blur', () => keys.clear());

  const player = {
    mesh: m,
    pos: m.group.position,
    vel: new THREE.Vector2(0, 0), // xz
    facing: m.group.rotation.y,
    mode: 'normal', // normal | roll | attack
    modeT: 0,
    invulnerable: false,
    walkPhase: 0,
    idleT: 0,
    // wired up by later systems (stamina M5, combat M6)
    trySpend: () => true,
    onAttackSwing: null, // called once at the active frame of a swing
    onActionBlocked: () => {},
    setEnabled(v) {
      enabled = v;
      if (!v) keys.clear();
    },
    isEnabled: () => enabled,
  };

  window.addEventListener('mousedown', (e) => {
    if (!enabled || e.button !== 0) return;
    if (document.pointerLockElement === null) return; // only when controlling the game
    startAttack();
  });

  function startAttack() {
    if (player.mode !== 'normal') return;
    if (!player.trySpend(CONFIG.stamina.attackCost)) {
      player.onActionBlocked();
      return;
    }
    player.mode = 'attack';
    player.modeT = 0;
    player.swungThisAttack = false;
  }

  function startRoll(dirX, dirZ) {
    if (player.mode !== 'normal') return;
    if (!player.trySpend(CONFIG.stamina.dodgeCost)) {
      player.onActionBlocked();
      return;
    }
    player.mode = 'roll';
    player.modeT = 0;
    player.invulnerable = true;
    player.rollDir = { x: dirX, z: dirZ };
  }

  function resolveCollisions(colliders) {
    const p = player.pos;
    for (const c of colliders) {
      const dx = p.x - c.x;
      const dz = p.z - c.z;
      const minDist = c.r + PLAYER_RADIUS;
      const d2 = dx * dx + dz * dz;
      if (d2 < minDist * minDist && d2 > 1e-6) {
        const d = Math.sqrt(d2);
        p.x = c.x + (dx / d) * minDist;
        p.z = c.z + (dz / d) * minDist;
      }
    }
    const r = Math.hypot(p.x, p.z);
    if (r > WORLD_RADIUS) {
      p.x *= WORLD_RADIUS / r;
      p.z *= WORLD_RADIUS / r;
    }
  }

  function animate(dt, speed01, sprinting) {
    const mm = m;
    if (player.mode === 'roll') {
      const t = player.modeT / P.dodgeDuration;
      mm.roller.rotation.x = t * Math.PI * 2;
      mm.leftLeg.rotation.x = -1.4;
      mm.rightLeg.rotation.x = -1.4;
      mm.leftArm.rotation.x = -1.2;
      mm.rightArm.rotation.x = -1.2;
      return;
    }
    mm.roller.rotation.x = 0;

    player.walkPhase += dt * speed01 * (sprinting ? 11 : 8);
    player.idleT += dt;
    const swing = Math.sin(player.walkPhase) * 0.75 * speed01;

    mm.leftLeg.rotation.x = swing;
    mm.rightLeg.rotation.x = -swing;
    mm.leftArm.rotation.x = -swing * 0.6 + Math.sin(player.idleT * 1.4) * 0.04;

    if (player.mode === 'attack') {
      const t = Math.min(player.modeT / P.attackDuration, 1);
      // windup back over the shoulder, then snap down through the arc
      const windup = -2.3;
      const follow = 0.8;
      const k = Math.min(t / 0.35, 1);
      const swingT = Math.max(0, (t - 0.35) / 0.65);
      const ease = 1 - Math.pow(1 - swingT, 3);
      mm.rightArm.rotation.x = windup * k + (follow - windup) * ease;
      mm.body.rotation.y = 0.35 - ease * 0.7;
    } else {
      mm.rightArm.rotation.x = -swing * 0.6 - Math.sin(player.idleT * 1.4) * 0.04;
      mm.body.rotation.y = 0;
    }

    // lean into the run, breathe at rest
    mm.body.rotation.x = speed01 * (sprinting ? 0.18 : 0.1) + Math.sin(player.idleT * 2.1) * 0.012;
    mm.roller.position.y = 0.6 + Math.abs(Math.sin(player.walkPhase)) * 0.06 * speed01;
  }

  player.update = function update(dt, camYaw, colliders) {
    player.modeT += dt;

    // resolve input direction (camera-relative)
    let ix = 0;
    let iz = 0;
    if (keys.has('KeyW')) iz += 1;
    if (keys.has('KeyS')) iz -= 1;
    if (keys.has('KeyA')) ix -= 1;
    if (keys.has('KeyD')) ix += 1;
    const sprinting = keys.has('ShiftLeft') || keys.has('ShiftRight');

    const fwdX = -Math.sin(camYaw);
    const fwdZ = -Math.cos(camYaw);
    const rightX = -fwdZ;
    const rightZ = fwdX;

    let dirX = fwdX * iz + rightX * ix;
    let dirZ = fwdZ * iz + rightZ * ix;
    const len = Math.hypot(dirX, dirZ);
    if (len > 0) {
      dirX /= len;
      dirZ /= len;
    }

    if (keys.has('Space') && enabled) {
      keys.delete('Space');
      const hasDir = len > 0;
      startRoll(
        hasDir ? dirX : Math.sin(player.facing),
        hasDir ? dirZ : Math.cos(player.facing)
      );
    }

    let targetSpeed = 0;
    if (player.mode === 'roll') {
      if (player.modeT >= P.dodgeDuration) {
        player.mode = 'normal';
        player.invulnerable = false;
      } else {
        player.vel.set(player.rollDir.x * P.dodgeSpeed, player.rollDir.z * P.dodgeSpeed);
      }
    }

    if (player.mode === 'attack') {
      if (!player.swungThisAttack && player.modeT >= P.attackDuration * 0.55) {
        player.swungThisAttack = true;
        if (player.onAttackSwing) player.onAttackSwing();
      }
      if (player.modeT >= P.attackDuration) player.mode = 'normal';
      // attacks root the feet — deliberate, weighty
      player.vel.multiplyScalar(Math.max(0, 1 - dt * 14));
    }

    if (player.mode === 'normal') {
      targetSpeed = len > 0 ? P.walkSpeed * (sprinting ? P.sprintMult : 1) : 0;
      const k = 1 - Math.exp(-dt * 10);
      player.vel.x += (dirX * targetSpeed - player.vel.x) * k;
      player.vel.y += (dirZ * targetSpeed - player.vel.y) * k; // Vector2.y holds z
    }

    player.pos.x += player.vel.x * dt;
    player.pos.z += player.vel.y * dt;
    resolveCollisions(colliders);
    player.pos.y = terrainHeight(player.pos.x, player.pos.z);

    const speed = Math.hypot(player.vel.x, player.vel.y);
    if (speed > 0.4 && player.mode !== 'attack') {
      const target = Math.atan2(player.vel.x, player.vel.y);
      player.facing = lerpAngle(player.facing, target, 1 - Math.exp(-dt * P.turnLerp));
    }
    m.group.rotation.y = player.facing;

    animate(dt, Math.min(speed / P.walkSpeed, 1.3), sprinting);
  };

  player.faceToward = function faceToward(x, z) {
    player.facing = Math.atan2(x - player.pos.x, z - player.pos.z);
    m.group.rotation.y = player.facing;
  };

  return player;
}
