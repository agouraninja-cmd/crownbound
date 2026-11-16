import * as THREE from 'three';
import { CONFIG } from '../state/config.js';
import { terrainHeight } from '../scene/terrain.js';
import { buildPlayerMesh } from './playerMesh.js';
import { createPlayerAnimator } from './playerAnim.js';
import { flash } from '../scene/meshUtils.js';

const P = CONFIG.player;
const PLAYER_RADIUS = 0.35;
const WORLD_RADIUS = 78;
const SLOPE_PROBE = 0.25; // how far each way the ground is felt for its tilt

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

function lerpAngle(a, b, t) {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

export function createPlayer(scene, spawn) {
  const m = buildPlayerMesh();
  const anim = createPlayerAnimator(m); // every joint is his to turn
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
    mode: 'normal', // normal | roll | attack | sleep | work | sit
    work: null, // while a ridge is being worked: { kind, x, z, strokes }
    modeT: 0,
    invulnerable: false,
    vy: 0,
    airborne: false,
    jumpIn: 0, // seconds until a called-for leap leaves the ground (the knees load first)
    slope: { x: 0, z: 0 }, // the ground's rise per unit along world x and z, under the feet
    turnRate: 0, // radians per second the body is turning
    crouching: false,
    crouch01: 0, // eased crouch amount, 0 standing → 1 fully crouched
    lie01: 0, // eased lying-down amount on the cot, 0 upright → 1 flat
    restY: 0, // where the waist settles on the mattress, above the ground
    hearth: null, // { x, z } of the campfire he sits down by (main.js sets it)
    stillFor: 0, // seconds stood still near the hearth
    sitK: 0, // how far down onto the ground, 0..1, linear in time
    sit01: 0, // ...eased: 0 standing → 1 sat by the fire
    time: 0,
    hp: P.maxHp,
    maxHp: P.maxHp,
    lastHurtAt: -99,
    swing: 0, // which swing the last attack was: 0 chop, 1 backhand, 2 sweep
    lastSwingAt: -99,
    onHpChange: () => {},
    onDeath: () => {},
    onHurt: () => {},
    onFootstep: () => {}, // (weight 0..1) each time a foot comes down in a stride
    onLand: () => {}, // (downward speed) at a touchdown
    onWorkStroke: () => {}, // (kind) each time the hoe bites, the seed flies, the sickle cuts
    onWorkDone: () => {}, // (kind) when the ridge is finished
    // wired up by later systems (stamina M5, combat M6)
    trySpend: () => true,
    tire: () => {}, // (whole points) the legs' toll on the stamina pool
    fatigue: 0, // the toll gathered so far, paid in whole points
    // a walk he takes on his own (spent for the day, the way home):
    // { points: [{x, z}...], i, onArrive } — the keys have no say meanwhile
    route: null,
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
    if (player.mode === 'sit') {
      standUp(); // a click by the fire only gets him to his feet
      return;
    }
    if (player.mode !== 'normal' || player.sit01 > 0) return; // not while still getting up
    if (!player.trySpend(CONFIG.stamina.attackCost)) {
      player.onActionBlocked();
      return;
    }
    // swings thrown in quick succession chain: chop, backhand, sweep, and
    // round again; a pause starts over with the chop. Looks only — every
    // swing costs, reaches and hits the same.
    player.swing = player.time - player.lastSwingAt < P.comboWindow ? (player.swing + 1) % 3 : 0;
    player.lastSwingAt = player.time;
    player.mode = 'attack';
    player.modeT = 0;
    player.swungThisAttack = false;
  }

  function startJump() {
    if (player.mode !== 'normal' || player.airborne || player.jumpIn > 0 || player.sit01 > 0) return;
    player.jumpIn = Math.max(P.jumpWindup, 1e-4); // update() springs the leap once the knees have loaded
  }

  // E on the cot: glide to the bed, lie back on the pillow, breathe.
  // main.js times the fade-out and ends the nap with respawn().
  function startSleep(bed) {
    if (player.mode === 'sleep') return;
    player.route = null;
    player.sleepTarget = bed; // { x, z, y: mattress top (world), facing }
    player.mode = 'sleep';
    player.modeT = 0;
    player.vel.set(0, 0);
    player.vy = 0;
    player.airborne = false;
    player.jumpIn = 0;
    player.invulnerable = true; // nothing interrupts a tired peasant
  }

  function updateSleep(dt) {
    const b = player.sleepTarget;

    // glide onto the cot; the animator is told a walking pace so the last
    // steps shuffle rather than sprint
    const k = 1 - Math.exp(-dt * 6);
    const dx = (b.x - player.pos.x) * k;
    const dz = (b.z - player.pos.z) * k;
    player.pos.x += dx;
    player.pos.z += dz;
    player.pos.y = terrainHeight(player.pos.x, player.pos.z);
    if (dt > 1e-4) player.vel.set(dx / dt, dz / dt).clampLength(0, 1.8);
    player.facing = lerpAngle(player.facing, b.facing, k);
    player.turnRate = 0;
    m.group.rotation.y = player.facing;

    // then lie back, eased, and settle the waist onto the mattress
    const lt = clamp((player.modeT - 0.4) / 0.6, 0, 1);
    player.lie01 = lt * lt * (3 - 2 * lt);
    player.restY = b.y + 0.16 - player.pos.y;
    m.weapon.visible = player.lie01 < 0.5; // the stick rests for the night too
  }

  // Warming by the fire: stood still near it for CONFIG.player.sitDelay, he
  // sits down on the ground facing the flames (playerAnim.js draws the pose).
  // Any movement key, Space, C, a roll or a click stands him up again.
  function hearthDist() {
    const h = player.hearth;
    return h ? Math.hypot(player.pos.x - h.x, player.pos.z - h.z) : Infinity;
  }

  function startSit() {
    player.mode = 'sit';
    player.modeT = 0;
    player.vel.set(0, 0);
    player.jumpIn = 0;
    player.stillFor = 0;
  }

  function standUp() {
    if (player.mode === 'sit') player.mode = 'normal';
    player.stillFor = 0;
  }

  // sat down: settle a comfortable way back from the flames
  function updateSit(dt) {
    player.vel.set(0, 0);
    const h = player.hearth;
    const dx = player.pos.x - h.x;
    const dz = player.pos.z - h.z;
    const d = Math.hypot(dx, dz);
    if (d < P.sitSeat && d > 1e-3) {
      const to = d + (P.sitSeat - d) * (1 - Math.exp(-dt * 4)); // a shuffle back, not a slide
      player.pos.x = h.x + (dx / d) * to;
      player.pos.z = h.z + (dz / d) * to;
    }
  }

  // Field work (the miller's strip): rooted at a ridge for a few strokes —
  // of the hoe (tilling, weeding), the sowing hand, or the sickle (reaping).
  // The tool for the job takes the stick's place in the fist until it is done.
  const TOOL_FOR = { till: 'hoe', tend: 'hoe', reap: 'sickle' }; // seed is cast by hand
  function takeUp(kind) {
    m.weapon.visible = kind === null; // null: the stick again
    for (const [name, tool] of Object.entries(m.tools)) tool.visible = TOOL_FOR[kind] === name;
  }

  // Begin working the ridge at (x, z). False if he is busy or in the air.
  function startWork(kind, x, z) {
    if (player.mode !== 'normal' || player.airborne) return false;
    player.mode = 'work';
    player.modeT = 0;
    player.jumpIn = 0;
    player.work = { kind, x, z, strokes: 0 };
    takeUp(kind);
    return true;
  }

  // down tools, finished or not
  function stopWork() {
    if (player.mode === 'work') player.mode = 'normal';
    player.work = null;
    takeUp(null);
  }

  function startRoll(dirX, dirZ) {
    if (player.mode !== 'normal' || player.airborne || player.sit01 > 0) return;
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
  // {minX, maxX, minZ, maxZ} (hovel walls, furniture). Being pushed out of one
  // also takes away the speed that was carrying him into it, so he slides
  // along a wall and stops against it instead of running on the spot.
  function resolveCollisions(colliders) {
    const p = player.pos;
    const v = player.vel; // Vector2: y holds z
    for (const c of colliders) {
      if (c.r !== undefined) {
        const dx = p.x - c.x;
        const dz = p.z - c.z;
        const minDist = c.r + PLAYER_RADIUS;
        const d2 = dx * dx + dz * dz;
        if (d2 < minDist * minDist && d2 > 1e-6) {
          const d = Math.sqrt(d2);
          const nx = dx / d;
          const nz = dz / d;
          p.x = c.x + nx * minDist;
          p.z = c.z + nz * minDist;
          const into = v.x * nx + v.y * nz;
          if (into < 0) {
            v.x -= nx * into;
            v.y -= nz * into;
          }
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
          const least = Math.min(toMinX, toMaxX, toMinZ, toMaxZ);
          if (least === toMinX) {
            p.x = minX;
            v.x = Math.min(v.x, 0);
          } else if (least === toMaxX) {
            p.x = maxX;
            v.x = Math.max(v.x, 0);
          } else if (least === toMinZ) {
            p.z = minZ;
            v.y = Math.min(v.y, 0);
          } else {
            p.z = maxZ;
            v.y = Math.max(v.y, 0);
          }
        }
      }
    }
    const r = Math.hypot(p.x, p.z);
    if (r > WORLD_RADIUS) {
      p.x *= WORLD_RADIUS / r;
      p.z *= WORLD_RADIUS / r;
      const out = (v.x * p.x + v.y * p.z) / WORLD_RADIUS;
      if (out > 0) {
        v.x -= (p.x / WORLD_RADIUS) * out;
        v.y -= (p.z / WORLD_RADIUS) * out;
      }
    }
  }

  // Finite push, finite grip: velocity moves toward what is wanted at `rate`
  // units/s² and no faster. A sprint takes a moment to wind up, a stop slides
  // a step, and a hard turn is carved rather than snapped.
  function steer(wantX, wantZ, rate, dt) {
    const dx = wantX - player.vel.x;
    const dz = wantZ - player.vel.y; // Vector2.y holds z
    const gap = Math.hypot(dx, dz);
    const reach = rate * dt;
    if (gap <= reach) {
      player.vel.set(wantX, wantZ);
    } else {
      player.vel.x += (dx / gap) * reach;
      player.vel.y += (dz / gap) * reach;
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
    anim.reel(dx / d, dz / d, player.facing, player.vel);
    flash(m.group);
    player.onHurt();
    player.onHpChange(player.hp, player.maxHp);
    standUp(); // a bite gets him off the ground
    if (player.hp === 0) {
      stopWork(); // a dead man finishes no ridge
      player.onDeath();
    }
  };

  player.respawn = function respawn(x, z) {
    player.pos.set(x, terrainHeight(x, z), z);
    player.vel.set(0, 0);
    player.vy = 0;
    player.airborne = false;
    player.jumpIn = 0;
    player.hp = player.maxHp;
    player.mode = 'normal';
    player.invulnerable = false;
    player.lie01 = 0;
    player.sitK = player.sit01 = player.stillFor = 0;
    player.route = null;
    stopWork(); // the stick back in hand — after a nap, or a death in the field
    anim.reset(); // on his feet, no leftover lean or half-finished pose
    player.onHpChange(player.hp, player.maxHp);
  };

  player.update = function update(dt, camYaw, colliders) {
    player.modeT += dt;
    player.time += dt;

    if (player.mode === 'sleep') {
      updateSleep(dt);
      anim.update(dt, player);
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
    // walking himself somewhere: the route steers in place of the keys
    if (player.route && player.mode === 'normal') {
      const r = player.route;
      let t = r.points[r.i];
      const last = r.i === r.points.length - 1;
      // a waypoint counts as passed a stride early; the last must be reached
      if (Math.hypot(t.x - player.pos.x, t.z - player.pos.z) < (last ? 0.25 : 0.6)) {
        if (last) {
          player.route = null;
          r.onArrive();
        } else {
          r.i += 1;
          t = r.points[r.i];
        }
      }
      if (player.route) {
        dirX = t.x - player.pos.x;
        dirZ = t.z - player.pos.z;
      } else {
        dirX = 0;
        dirZ = 0;
      }
    }
    const len = Math.hypot(dirX, dirZ);
    if (len > 0) {
      dirX /= len;
      dirZ /= len;
    }

    // sat by the fire: a key to move, leap, crouch or roll only gets him up
    if (player.mode === 'sit' && (len > 0 || keys.has('Space') || keys.has('KeyC') || pendingRollKey)) {
      keys.delete('Space');
      pendingRollKey = null;
      standUp();
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

    // the leap leaves the ground once the knees have loaded; a roll or a
    // swing begun in that moment forgets it
    if (player.jumpIn > 0) {
      if (player.mode !== 'normal' || player.airborne) {
        player.jumpIn = 0;
      } else if ((player.jumpIn -= dt) <= 0) {
        player.jumpIn = 0;
        player.vy = P.jumpSpeed;
        player.airborne = true;
      }
    }

    if (player.mode === 'roll') {
      const t = player.modeT / P.dodgeDuration;
      if (t >= 1) {
        player.mode = 'normal';
        player.invulnerable = false;
      } else {
        // dive in fast, bleed speed through the tumble; dodgeSpeed is the average
        const pace = P.dodgeSpeed * (1.35 - 0.7 * t);
        player.vel.set(player.rollDir.x * pace, player.rollDir.z * pace);
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

    if (player.mode === 'work') {
      const W = CONFIG.farm;
      const job = player.work;
      // each stroke lands 60% of the way through its beat
      const landed = Math.min(W.strokes, Math.floor(player.modeT / W.strokeTime + 0.4));
      while (job.strokes < landed) {
        job.strokes += 1;
        player.onWorkStroke(job.kind);
      }
      player.vel.multiplyScalar(Math.max(0, 1 - dt * 14)); // feet planted at the ridge
      if (player.modeT >= W.strokes * W.strokeTime) {
        stopWork();
        player.onWorkDone(job.kind);
      }
    }

    if (player.mode === 'sit') updateSit(dt);

    // down onto the ground and back up again, at their own paces
    player.sitK = player.mode === 'sit'
      ? Math.min(1, player.sitK + dt / P.sitDown)
      : Math.max(0, player.sitK - dt / P.sitUp);
    player.sit01 = player.sitK * player.sitK * (3 - 2 * player.sitK);

    if (player.mode === 'normal') {
      // getting up from the fire, he finds his feet before he finds his pace;
      // the walk home (spent for the day) is a weary walk, never a run
      const gait = player.route ? CONFIG.stamina.homewardPace : player.crouching ? P.crouchMult : sprinting ? P.sprintMult : 1;
      const pace = P.walkSpeed * gait * (1 - player.sit01);
      if (player.airborne) {
        // nothing to push against: momentum carries the leap, the keys only nudge it
        if (len > 0) steer(dirX * pace, dirZ * pace, P.airAccel, dt);
      } else {
        // a climb costs speed, a descent lends a little
        const grade = len > 0 ? clamp(player.slope.x * dirX + player.slope.z * dirZ, -0.6, 0.6) : 0;
        const want = len > 0 ? pace * (1 - grade * (grade > 0 ? P.climbDrag : P.descentGain)) : 0;
        // pushing off toward the wanted pace, or braking: easing off, or turning back on himself
        const turnedBack = player.vel.x * dirX + player.vel.y * dirZ < 0;
        steer(dirX * want, dirZ * want, len > 0 && !turnedBack ? P.accel : P.brake, dt);
        // walking and running wear on the stamina pool (the walk home is free)
        if (len > 0 && !player.route) {
          const ST = CONFIG.stamina;
          player.fatigue += (sprinting && !player.crouching ? ST.sprintDrain : ST.walkDrain) * dt;
          if (player.fatigue >= 1) {
            const whole = Math.floor(player.fatigue);
            player.fatigue -= whole;
            player.tire(whole);
          }
        }
      }
    }

    player.pos.x += player.vel.x * dt;
    player.pos.z += player.vel.y * dt;
    resolveCollisions(colliders);
    const px = player.pos.x;
    const pz = player.pos.z;
    const groundY = terrainHeight(px, pz);
    if (player.airborne) {
      player.vy -= P.gravity * dt;
      player.pos.y += player.vy * dt;
      // down onto the ground — or the ground, on a climb, up into the feet
      if (player.pos.y < groundY || (player.vy <= 0 && player.pos.y <= groundY)) {
        anim.land(Math.max(-player.vy, 0)); // the knees take the fall...
        player.onLand(Math.max(-player.vy, 0));
        player.vel.multiplyScalar(P.landKeep); // ...and some of the pace goes with it
        player.pos.y = groundY;
        player.vy = 0;
        player.airborne = false;
      }
    } else {
      player.pos.y = groundY;
    }

    // stood still by the fire long enough, he sits down to warm himself
    const still = enabled && player.mode === 'normal' && !player.airborne && player.jumpIn === 0 &&
      len === 0 && !player.crouching && player.hp > 0 && player.vel.lengthSq() < 0.01;
    player.stillFor = still && hearthDist() < P.sitNear ? player.stillFor + dt : 0;
    if (player.stillFor >= P.sitDelay) startSit();
    // the stick is laid down beside him while he sits (the field's tools manage their own)
    if (player.mode !== 'work') m.weapon.visible = player.sit01 < 0.5;

    // feel the ground's tilt: it slows a climb and lays the soles to the slope
    player.slope.x = (terrainHeight(px + SLOPE_PROBE, pz) - terrainHeight(px - SLOPE_PROBE, pz)) / (SLOPE_PROBE * 2);
    player.slope.z = (terrainHeight(px, pz + SLOPE_PROBE) - terrainHeight(px, pz - SLOPE_PROBE)) / (SLOPE_PROBE * 2);

    // the body turns toward where it is being steered. A shove steers
    // nothing, so a bitten peasant staggers back still facing his rat.
    const facingWas = player.facing;
    if (player.mode === 'roll') {
      player.facing = lerpAngle(player.facing, Math.atan2(player.rollDir.x, player.rollDir.z), 1 - Math.exp(-dt * P.turnLerp));
    } else if (player.mode === 'normal' && len > 0) {
      player.facing = lerpAngle(player.facing, Math.atan2(dirX, dirZ), 1 - Math.exp(-dt * P.turnLerp));
    } else if (player.mode === 'sit') {
      // turned to face the flames
      const h = player.hearth;
      player.facing = lerpAngle(player.facing, Math.atan2(h.x - px, h.z - pz), 1 - Math.exp(-dt * 5));
    } else if (player.mode === 'work') {
      // turned to the spot he is working — unless he is standing on it
      const wx = player.work.x - px;
      const wz = player.work.z - pz;
      if (wx * wx + wz * wz > 0.04) {
        player.facing = lerpAngle(player.facing, Math.atan2(wx, wz), 1 - Math.exp(-dt * P.turnLerp));
      }
    }
    player.turnRate = dt > 1e-4 ? (player.facing - facingWas) / dt : 0;
    m.group.rotation.y = player.facing;

    anim.update(dt, player);
  };

  player.attack = startAttack;
  player.startSleep = startSleep;
  player.startWork = startWork;

  // walk himself through `points` ({x, z} each) in turn; onArrive at the last
  player.walkRoute = function walkRoute(points, onArrive) {
    player.route = points.length ? { points, i: 0, onArrive } : null;
    if (!points.length) onArrive();
  };

  // already lying on the cot, with no tuck-in to watch (a load while spent)
  player.lieDownAt = function lieDownAt(bed) {
    player.respawn(bed.x, bed.z);
    player.facing = bed.facing;
    m.group.rotation.y = bed.facing;
    startSleep(bed);
    player.modeT = 5; // past the glide and the lying back
  };

  player.faceToward = function faceToward(x, z) {
    player.facing = Math.atan2(x - player.pos.x, z - player.pos.z);
    m.group.rotation.y = player.facing;
  };

  return player;
}
