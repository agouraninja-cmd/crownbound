import * as THREE from 'three';
import { CONFIG } from '../state/config.js';
import { terrainHeight } from '../scene/terrain.js';
import { buildPlayerMesh } from './playerMesh.js';
import { flash } from '../scene/meshUtils.js';

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

  // double-tapping a movement key dodge-rolls that way; axes are (right, forward)
  const TAP_AXES = { KeyW: [0, 1], KeyS: [0, -1], KeyA: [-1, 0], KeyD: [1, 0] };
  const lastTapAt = {};
  let pendingRollKey = null;

  window.addEventListener('keydown', (e) => {
    if (!enabled) return;
    if (!e.repeat && TAP_AXES[e.code]) {
      const now = performance.now();
      if (now - (lastTapAt[e.code] || -1e9) < P.dodgeTapWindow * 1000) pendingRollKey = e.code;
      lastTapAt[e.code] = now;
    }
    keys.add(e.code);
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
    vy: 0,
    airborne: false,
    landT: Infinity, // time since last touchdown, drives the landing crouch
    crouching: false,
    crouch01: 0, // eased crouch amount, 0 standing → 1 fully crouched
    walkPhase: 0,
    idleT: 0,
    time: 0,
    hp: P.maxHp,
    maxHp: P.maxHp,
    lastHurtAt: -99,
    onHpChange: () => {},
    onDeath: () => {},
    onHurt: () => {},
    // wired up by later systems (stamina M5, combat M6)
    trySpend: () => true,
    onAttackSwing: null, // called once at the active frame of a swing
    onActionBlocked: () => {},
    // gear from the chapman (main.js applies ownership on load + purchase)
    attackDamage: CONFIG.player.attackDamage,
    attackReach: CONFIG.player.attackRange,
    setWeaponTier(t) {
      // 0 the trusty stick · 1 oaken cudgel · 2 ash quarterstaff
      const tiers = [
        { scale: [1, 1, 1], color: 0x7a5a35 },
        { scale: [1.7, 1.08, 1.7], color: 0x5a4028 },
        { scale: [1.3, 1.55, 1.3], color: 0x9a7a48 },
      ];
      const tier = tiers[t] ?? tiers[0];
      m.weapon.scale.set(...tier.scale);
      // fresh material — the cached one is shared with other meshes of its color
      m.weapon.material = new THREE.MeshLambertMaterial({ color: tier.color, flatShading: true });
    },
    setEnabled(v) {
      enabled = v;
      if (!v) {
        keys.clear();
        pendingRollKey = null;
      }
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

  function startJump() {
    if (player.mode !== 'normal' || player.airborne) return;
    player.vy = P.jumpSpeed;
    player.airborne = true;
  }

  // E on the cot: glide to the bed, lie back on the pillow, breathe.
  // main.js times the fade-out and ends the nap with respawn().
  function startSleep(bed) {
    if (player.mode === 'sleep') return;
    player.sleepTarget = bed; // { x, z, y: mattress top (world), facing }
    player.mode = 'sleep';
    player.modeT = 0;
    player.vel.set(0, 0);
    player.vy = 0;
    player.airborne = false;
    player.invulnerable = true; // nothing interrupts a tired peasant
  }

  function updateSleep(dt) {
    const mm = m;
    const b = player.sleepTarget;

    // glide onto the cot
    const k = 1 - Math.exp(-dt * 6);
    player.pos.x += (b.x - player.pos.x) * k;
    player.pos.z += (b.z - player.pos.z) * k;
    player.pos.y = terrainHeight(player.pos.x, player.pos.z);
    player.facing = lerpAngle(player.facing, b.facing, k);
    mm.group.rotation.y = player.facing;

    // then lie back, eased
    const lt = Math.min(Math.max((player.modeT - 0.4) / 0.6, 0), 1);
    const lie = lt * lt * (3 - 2 * lt);
    const breathe = lie >= 1 ? Math.sin(player.time * 1.8) * 0.012 : 0;
    mm.roller.rotation.x = (-Math.PI / 2) * lie;
    // settle the waist pivot onto the mattress
    mm.roller.position.y = 0.6 + (b.y + 0.16 - player.pos.y - 0.6) * lie + breathe;
    mm.weapon.visible = lie < 0.5; // the stick rests for the night too

    // last shuffling steps fade into a flat, resting pose
    const remaining = Math.hypot(b.x - player.pos.x, b.z - player.pos.z);
    const stepK = Math.min(remaining * 3, 1) * (1 - lie);
    player.walkPhase += dt * 7 * stepK;
    const swing = Math.sin(player.walkPhase) * 0.6 * stepK;
    mm.leftLeg.rotation.x = swing - 0.05 * lie;
    mm.rightLeg.rotation.x = -swing - 0.05 * lie;
    mm.leftArm.rotation.x = -swing * 0.5 + (-0.25 + breathe * 2) * lie;
    mm.rightArm.rotation.x = swing * 0.5 + (-0.25 + breathe * 2) * lie;
    mm.body.rotation.x = 0;
    mm.body.rotation.y = 0;
  }

  function startRoll(dirX, dirZ) {
    if (player.mode !== 'normal' || player.airborne) return;
    if (!player.trySpend(CONFIG.stamina.dodgeCost)) {
      player.onActionBlocked();
      return;
    }
    player.mode = 'roll';
    player.modeT = 0;
    player.invulnerable = true;
    player.rollDir = { x: dirX, z: dirZ };
  }

  // colliders are circles {x, z, r} (trees, rocks) or axis-aligned rects
  // {minX, maxX, minZ, maxZ} (hovel walls, furniture)
  function resolveCollisions(colliders) {
    const p = player.pos;
    for (const c of colliders) {
      if (c.r !== undefined) {
        const dx = p.x - c.x;
        const dz = p.z - c.z;
        const minDist = c.r + PLAYER_RADIUS;
        const d2 = dx * dx + dz * dz;
        if (d2 < minDist * minDist && d2 > 1e-6) {
          const d = Math.sqrt(d2);
          p.x = c.x + (dx / d) * minDist;
          p.z = c.z + (dz / d) * minDist;
        }
      } else {
        const minX = c.minX - PLAYER_RADIUS;
        const maxX = c.maxX + PLAYER_RADIUS;
        const minZ = c.minZ - PLAYER_RADIUS;
        const maxZ = c.maxZ + PLAYER_RADIUS;
        if (p.x > minX && p.x < maxX && p.z > minZ && p.z < maxZ) {
          // push out along the axis of least penetration
          const toMinX = p.x - minX;
          const toMaxX = maxX - p.x;
          const toMinZ = p.z - minZ;
          const toMaxZ = maxZ - p.z;
          const m = Math.min(toMinX, toMaxX, toMinZ, toMaxZ);
          if (m === toMinX) p.x = minX;
          else if (m === toMaxX) p.x = maxX;
          else if (m === toMinZ) p.z = minZ;
          else p.z = maxZ;
        }
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

    // crouch: sink at the knees, hunch the shoulders, keep the shuffle
    if (player.crouch01 > 0.001) {
      const c = player.crouch01;
      mm.roller.position.y -= 0.2 * c;
      mm.leftLeg.rotation.x -= 0.9 * c;
      mm.rightLeg.rotation.x -= 0.9 * c;
      mm.body.rotation.x += 0.3 * c;
    }

    // jump: lean into the leap on the way up, knees absorb the landing
    if (player.airborne) {
      const rise = Math.max(player.vy / P.jumpSpeed, 0); // 1 at takeoff → 0 past apex
      mm.body.rotation.x += 0.28 * rise;
      mm.leftLeg.rotation.x = -0.45;
      mm.rightLeg.rotation.x = -0.45;
    } else if (player.landT < P.landCrouchTime) {
      const k = 1 - player.landT / P.landCrouchTime; // 1 at touchdown, easing out
      mm.roller.position.y -= 0.14 * k;
      mm.leftLeg.rotation.x = -0.65 * k;
      mm.rightLeg.rotation.x = -0.65 * k;
      mm.body.rotation.x += 0.18 * k;
    }
  }

  player.takeDamage = function takeDamage(amount, srcX, srcZ) {
    if (player.invulnerable || player.hp <= 0) return;
    player.hp = Math.max(0, player.hp - amount);
    player.lastHurtAt = player.time;
    const dx = player.pos.x - srcX;
    const dz = player.pos.z - srcZ;
    const d = Math.hypot(dx, dz) || 1;
    player.vel.x += (dx / d) * 5;
    player.vel.y += (dz / d) * 5;
    flash(m.group);
    player.onHurt();
    player.onHpChange(player.hp, player.maxHp);
    if (player.hp === 0) player.onDeath();
  };

  player.respawn = function respawn(x, z) {
    player.pos.set(x, terrainHeight(x, z), z);
    player.vel.set(0, 0);
    player.vy = 0;
    player.airborne = false;
    player.hp = player.maxHp;
    player.mode = 'normal';
    player.invulnerable = false;
    m.weapon.visible = true; // back in hand after a nap
    m.roller.rotation.x = 0;
    player.onHpChange(player.hp, player.maxHp);
  };

  player.update = function update(dt, camYaw, colliders) {
    player.modeT += dt;
    player.time += dt;
    player.landT += dt;

    if (player.mode === 'sleep') {
      updateSleep(dt);
      return;
    }

    // a peasant mends: slow regen once out of danger
    if (player.hp > 0 && player.hp < player.maxHp && player.time - player.lastHurtAt > P.regenDelay) {
      player.hp = Math.min(player.maxHp, player.hp + P.regenPerSecond * dt);
      player.onHpChange(player.hp, player.maxHp);
    }

    // resolve input direction (camera-relative)
    let ix = 0;
    let iz = 0;
    if (keys.has('KeyW')) iz += 1;
    if (keys.has('KeyS')) iz -= 1;
    if (keys.has('KeyA')) ix -= 1;
    if (keys.has('KeyD')) ix += 1;
    const sprinting = keys.has('ShiftLeft') || keys.has('ShiftRight');

    player.crouching = keys.has('KeyC') && player.mode === 'normal' && !player.airborne;
    player.crouch01 += ((player.crouching ? 1 : 0) - player.crouch01) * (1 - Math.exp(-dt * 12));

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
      startJump();
    }

    if (pendingRollKey) {
      const [tx, tz] = TAP_AXES[pendingRollKey];
      pendingRollKey = null;
      startRoll(fwdX * tz + rightX * tx, fwdZ * tz + rightZ * tx);
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
      const mult = player.crouching ? P.crouchMult : sprinting ? P.sprintMult : 1;
      targetSpeed = len > 0 ? P.walkSpeed * mult : 0;
      const k = 1 - Math.exp(-dt * 10);
      player.vel.x += (dirX * targetSpeed - player.vel.x) * k;
      player.vel.y += (dirZ * targetSpeed - player.vel.y) * k; // Vector2.y holds z
    }

    player.pos.x += player.vel.x * dt;
    player.pos.z += player.vel.y * dt;
    resolveCollisions(colliders);
    const groundY = terrainHeight(player.pos.x, player.pos.z);
    if (player.airborne) {
      player.vy -= P.gravity * dt;
      player.pos.y += player.vy * dt;
      if (player.vy <= 0 && player.pos.y <= groundY) {
        player.pos.y = groundY;
        player.vy = 0;
        player.airborne = false;
        player.landT = 0;
      }
    } else {
      player.pos.y = groundY;
    }

    const speed = Math.hypot(player.vel.x, player.vel.y);
    if (speed > 0.4 && player.mode !== 'attack') {
      const target = Math.atan2(player.vel.x, player.vel.y);
      player.facing = lerpAngle(player.facing, target, 1 - Math.exp(-dt * P.turnLerp));
    }
    m.group.rotation.y = player.facing;

    animate(dt, Math.min(speed / P.walkSpeed, 1.3), sprinting);
  };

  player.attack = startAttack;
  player.startSleep = startSleep;

  player.faceToward = function faceToward(x, z) {
    player.facing = Math.atan2(x - player.pos.x, z - player.pos.z);
    m.group.rotation.y = player.facing;
  };

  return player;
}
