import * as THREE from 'three';
import { CONFIG } from '../state/config.js';
import { terrainHeight } from '../scene/terrain.js';
import { buildPlayerMesh, RIG, WEAPON_LOOKS } from './playerMesh.js';
import { createPlayerAnimator } from './playerAnim.js';
import { flash } from '../scene/meshUtils.js';

const P = CONFIG.player;
const RADIUS = 0.35; // the player's own girth
const WORLD_RADIUS = 78;
const SLOPE_PROBE = 0.25; // how far each way the ground is felt for its tilt

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

// the way round from angle a to angle b, the short way: -π..π
function turnBetween(a, b) {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

function lerpAngle(a, b, t) {
  return a + turnBetween(a, b) * t;
}

export function createPlayer(scene, spawn) {
  const m = buildPlayerMesh();
  const anim = createPlayerAnimator(m); // every joint is his to turn
  m.group.position.set(spawn.x, terrainHeight(spawn.x, spawn.z), spawn.z);
  m.group.rotation.y = Math.PI / 3;
  scene.add(m.group);

  // Sat by the fire, the stick is laid on the ground beside him rather than
  // kept in the fist: the weapon mesh itself moves from his hand into this
  // group and back, so the cudgel or quarterstaff lies there as it is.
  // (Empty-handed — the weapon on the rack at home — there is nothing to lay.)
  const laid = new THREE.Group();
  laid.visible = false;
  scene.add(laid);
  let stickLaid = false;
  function layStick(down) {
    if (down === stickLaid) return;
    stickLaid = down;
    const w = m.weapon;
    if (down) {
      // to his stick-hand side, as he will sit facing the flames
      const h = player.hearth;
      const f = h ? Math.atan2(h.x - player.pos.x, h.z - player.pos.z) : player.facing;
      const x = player.pos.x + Math.cos(f) * 0.42 + Math.sin(f) * 0.08;
      const z = player.pos.z - Math.sin(f) * 0.42 + Math.cos(f) * 0.08;
      laid.position.set(x, terrainHeight(x, z), z);
      laid.rotation.set(0, f + 0.25, 0); // along his side, angled a touch out
      laid.add(w);
      w.position.set(0, 0.036 * w.scale.x, 0); // resting on the ground, not in it
      w.rotation.set(Math.PI / 2, 0, 0);
      laid.visible = true;
    } else {
      m.slot.add(w);
      w.position.set(0, -RIG.stickDrop, 0);
      w.rotation.set(0, 0, 0);
      laid.visible = false;
    }
  }

  const keys = new Set();
  let enabled = true;
  const angleTo = (facing) => turnBetween(player.facing, facing); // how far round he must turn to face it

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
    work: null, // while a ridge is being worked: { kind, ax, az, dx, dz, len, facing, strokes, plough, backing }
    haul: null, // the plough, while his hands are on its handles (field.js plough): it goes where he goes
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
    rising: null, // getting up off the cot in plain sight (the opening): { spot, facing, onUp, t, from }
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
    onWorkStopped: () => {}, // (kind) when a movement key calls him off a ridge before its end
    // the ground underfoot: the land, unless main.js lays something over it
    // (the miller's strip stands its ridges up off the ground)
    groundAt: terrainHeight,
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
      const tier = WEAPON_LOOKS[t] ?? WEAPON_LOOKS[0];
      m.weapon.scale.set(...tier.scale);
      // fresh material — the cached one is shared with other meshes of its color
      m.weapon.material = new THREE.MeshLambertMaterial({ color: tier.color, flatShading: true });
    },
    // the weapon hung on the rack at home: empty hands, and no swing
    unarmed: false,
    onUnarmed: () => {},
    setUnarmed(v) {
      player.unarmed = v;
      m.slot.visible = !v;
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

  // F swings too — for a laptop with no mouse, where a touchpad's click is
  // hard to reach mid-stride (and is often switched off while keys are down)
  window.addEventListener('keydown', (e) => {
    if (!enabled || e.code !== 'KeyF' || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    startAttack();
  });

  function startAttack() {
    if (player.mode === 'sit') {
      standUp(); // a click by the fire only gets him to his feet
      return;
    }
    if (player.mode !== 'normal' || player.sit01 > 0) return; // not while still getting up
    if (player.haul) return; // both hands are on the plough
    if (player.unarmed) {
      player.onUnarmed();
      return;
    }
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
    if (player.mode !== 'normal' || player.airborne || player.jumpIn > 0 || player.sit01 > 0 || player.haul) return;
    player.jumpIn = Math.max(P.jumpWindup, 1e-4); // update() springs the leap once the knees have loaded
  }

  // E on the cot: glide to the bed, lie back on the pillow, breathe.
  // main.js times the fade-out and ends the nap with respawn().
  function startSleep(bed) {
    if (player.mode === 'sleep') return;
    dropHaul();
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
    if (player.rising) {
      updateRise(dt);
      return;
    }
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

  // Up off the cot where it can be seen (the opening's waking — every other
  // rising happens behind a fade): the lying-back played the other way, as
  // he comes off the cot to stand at `spot` turned to `facing`. onUp is
  // called once he is on his feet.
  const RISE_TIME = 1.4;
  function startRise(spot, facing, onUp) {
    if (player.mode !== 'sleep' || player.rising) return;
    player.rising = { spot, facing, onUp, t: 0, from: { x: player.pos.x, z: player.pos.z, facing: player.facing } };
  }

  function updateRise(dt) {
    const r = player.rising;
    r.t += dt;
    const ease = (k) => k * k * (3 - 2 * k);
    const up = ease(clamp(r.t / (RISE_TIME * 0.7), 0, 1)); // sitting up...
    const off = ease(clamp((r.t - RISE_TIME * 0.3) / (RISE_TIME * 0.7), 0, 1)); // ...then off the cot
    player.lie01 = 1 - up;
    player.pos.x = r.from.x + (r.spot.x - r.from.x) * off;
    player.pos.z = r.from.z + (r.spot.z - r.from.z) * off;
    player.pos.y = terrainHeight(player.pos.x, player.pos.z);
    player.vel.set(0, 0);
    player.facing = lerpAngle(r.from.facing, r.facing, off);
    player.turnRate = 0;
    m.group.rotation.y = player.facing;
    m.weapon.visible = player.lie01 < 0.5; // the stick is taken up again
    if (r.t < RISE_TIME) return;
    player.rising = null;
    player.mode = 'normal';
    player.modeT = 0;
    player.invulnerable = false;
    player.lie01 = 0;
    r.onUp?.();
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

  // Field work (the miller's strip): he works his way along a ridge, a blow
  // of the hoe (tilling, weeding), a cast of the sowing hand or a cut of the
  // sickle (reaping), then a step on, and again, to the ridge's end. The tool
  // for the job takes the stick's place in the fist until it is done.
  const TOOL_FOR = { till: 'hoe', tend: 'hoe', reap: 'sickle', sow: 'seedlip' }; // seed is cast by hand, from the basket at his hip
  function takeUp(kind) {
    m.weapon.visible = kind === null; // null: the stick again
    for (const [name, tool] of Object.entries(m.tools)) tool.visible = TOOL_FOR[kind] === name;
  }

  // The plough (field.js): his hands take its handles and it goes before him
  // wherever he walks — slowly, turning like the cart it nearly is — until he
  // lets go. The stick is put away meanwhile; he cannot swing, leap or roll.
  function takeHaul(plough) {
    if (player.mode !== 'normal' || player.airborne || player.haul) return false;
    player.haul = plough;
    plough.take();
    player.vel.set(0, 0);
    takeUp('plough'); // no tool of his own: both hands are on it
    return true;
  }
  function dropHaul() {
    if (!player.haul) return;
    const plough = player.haul;
    player.haul = null;
    plough.rest();
    if (player.mode !== 'work') takeUp(null);
  }

  // Begin working along a line: from (from.x, from.z) to (to.x, to.z), turned
  // to `facing` all the while (toward the crown of the ridge he walks beside).
  // False if he is busy or in the air.
  // With the plough in hand the line is ploughed instead (`plough: true`):
  // no blows — he walks it at CONFIG.farm.ploughPace with the share in the
  // earth, first drawing the plough back to the line's start if he stands
  // further along it.
  function startWork(kind, from, to, facing, { plough = false } = {}) {
    if (player.mode !== 'normal' || player.airborne) return false;
    if (plough && !player.haul) return false;
    const len = Math.hypot(to.x - from.x, to.z - from.z);
    player.route = null;
    player.mode = 'work';
    player.modeT = 0;
    player.jumpIn = 0;
    player.work = { kind, ax: from.x, az: from.z, dx: (to.x - from.x) / (len || 1), dz: (to.z - from.z) / (len || 1), len, facing, strokes: 0, plough, backing: plough };
    takeUp(plough ? 'plough' : kind);
    return true;
  }

  // down tools, finished or not (the plough stays in his hands)
  function stopWork() {
    if (player.mode === 'work') player.mode = 'normal';
    player.work = null;
    if (player.haul) player.haul.working = false;
    takeUp(player.haul ? 'plough' : null);
  }

  function startRoll(dirX, dirZ) {
    if (player.mode !== 'normal' || player.airborne || player.sit01 > 0 || player.haul) return;
    if (!player.trySpend(CONFIG.stamina.dodgeCost)) {
      player.onActionBlocked();
      return;
    }
    player.mode = 'roll';
    player.modeT = 0;
    player.invulnerable = true;
    player.rollDir = { x: dirX, z: dirZ };
  }

  // colliders are circles {x, z, r} (trees, rocks), axis-aligned rects
  // {minX, maxX, minZ, maxZ} (hovel walls, furniture) or rects turned on the
  // map {x, z, halfX, halfZ, cos, sin} (the neighbours' houses — cottage.js
  // turnedRect). Being pushed out of one also takes away the speed that was
  // carrying him into it, so he slides along a wall and stops against it
  // instead of running on the spot. (p, radius: another circle put out of
  // them instead of his own — the plough's, resolveHaul.)
  function resolveCollisions(colliders, p = player.pos, radius = RADIUS) {
    const v = player.vel; // Vector2: y holds z
    for (const c of colliders) {
      if (c.r !== undefined) {
        const dx = p.x - c.x;
        const dz = p.z - c.z;
        const minDist = c.r + radius;
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
      } else if (c.cos !== undefined) {
        // a turned rect: seen in its own frame it is an upright one about the origin
        const dx = p.x - c.x;
        const dz = p.z - c.z;
        const u = dx * c.cos - dz * c.sin;
        const w = dx * c.sin + dz * c.cos;
        const hu = c.halfX + radius;
        const hw = c.halfZ + radius;
        if (u > -hu && u < hu && w > -hw && w < hw) {
          // out through the nearest face; (nu, nw) is that face's outward normal
          let nu = 0;
          let nw = 0;
          if (hu - Math.abs(u) < hw - Math.abs(w)) nu = u < 0 ? -1 : 1;
          else nw = w < 0 ? -1 : 1;
          const pu = nu ? nu * hu : u;
          const pw = nw ? nw * hw : w;
          p.x = c.x + pu * c.cos + pw * c.sin;
          p.z = c.z - pu * c.sin + pw * c.cos;
          const nx = nu * c.cos + nw * c.sin;
          const nz = -nu * c.sin + nw * c.cos;
          const into = v.x * nx + v.y * nz;
          if (into < 0) {
            v.x -= nx * into;
            v.y -= nz * into;
          }
        }
      } else {
        const minX = c.minX - radius;
        const maxX = c.maxX + radius;
        const minZ = c.minZ - radius;
        const maxZ = c.maxZ + radius;
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

  // The plough in his hands bumps what it meets: each of its probes (a circle
  // ahead of him, along his facing) is put out of whatever it has entered, and
  // he is moved by as much — so a fence stops the plough, and turning it into
  // a wall shoves him off instead.
  const probe = { x: 0, z: 0 };
  function resolveHaul(colliders) {
    const sin = Math.sin(player.facing);
    const cos = Math.cos(player.facing);
    for (const { d, r } of player.haul.probes) {
      probe.x = player.pos.x + sin * d;
      probe.z = player.pos.z + cos * d;
      const x0 = probe.x;
      const z0 = probe.z;
      resolveCollisions(colliders, probe, r);
      player.pos.x += probe.x - x0;
      player.pos.z += probe.z - z0;
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
      dropHaul();
      player.onDeath();
    }
  };

  player.respawn = function respawn(x, z) {
    player.pos.set(x, player.groundAt(x, z), z);
    player.vel.set(0, 0);
    player.vy = 0;
    player.airborne = false;
    player.jumpIn = 0;
    player.hp = player.maxHp;
    player.mode = 'normal';
    player.invulnerable = false;
    player.lie01 = 0;
    player.rising = null;
    player.sitK = player.sit01 = player.stillFor = 0;
    player.route = null;
    dropHaul();
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

    player.crouching = keys.has('KeyC') && player.mode === 'normal' && !player.airborne && !player.haul;
    player.crouch01 += ((player.crouching ? 1 : 0) - player.crouch01) * (1 - Math.exp(-dt * 12));

    const fwdX = -Math.sin(camYaw);
    const fwdZ = -Math.cos(camYaw);
    const rightX = -fwdZ;
    const rightZ = fwdX;

    let dirX = fwdX * iz + rightX * ix;
    let dirZ = fwdZ * iz + rightZ * ix;
    // a walk he was only asked to take (to the head of a ridge) gives way to the keys
    if (player.route?.yields && Math.hypot(dirX, dirZ) > 0) player.route = null;
    // walking himself somewhere: the route steers in place of the keys
    if (player.route && player.mode === 'normal') {
      const r = player.route;
      let t = r.points[r.i];
      const last = r.i === r.points.length - 1;
      // a waypoint counts as passed a stride early; the last must be reached
      if (Math.hypot(t.x - player.pos.x, t.z - player.pos.z) < (last ? 0.25 : 0.6)) {
        if (last && r.facing !== undefined && Math.abs(angleTo(r.facing)) > 0.04) {
          r.turning = true; // there: now round to the way he was asked to face
        } else if (last) {
          player.route = null;
          r.onArrive();
        } else {
          r.i += 1;
          t = r.points[r.i];
        }
      }
      // a walk he was only asked to take is given up if something stops him
      // dead for a couple of seconds (the walk home has its own watch, main.js)
      if (player.route?.yields && !player.route.turning) {
        r.stalled = player.vel.lengthSq() < 0.04 ? (r.stalled ?? 0) + dt : 0;
        if (r.stalled > 2) player.route = null;
      }
      if (player.route?.turning) {
        dirX = 0;
        dirZ = 0;
      } else if (player.route) {
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

    // at a ridge: a key to move, leap, crouch or roll calls him off it
    if (player.mode === 'work' && (len > 0 || keys.has('Space') || keys.has('KeyC') || pendingRollKey)) {
      const kind = player.work.kind;
      keys.delete('Space');
      pendingRollKey = null;
      stopWork();
      player.onWorkStopped(kind);
    }

    if (player.mode === 'work') {
      const W = CONFIG.farm;
      const job = player.work;
      // how far along the line he stands, and how far off it
      const ox = player.pos.x - job.ax;
      const oz = player.pos.z - job.az;
      const along = ox * job.dx + oz * job.dz;
      const offX = ox - along * job.dx;
      const offZ = oz - along * job.dz;
      if (job.backing) {
        // the plough drawn back to where the furrow is to begin, his face to the work
        if (along <= 0.03) {
          job.backing = false;
          player.modeT = 0;
          player.vel.set(0, 0);
        } else if (player.modeT > 12) {
          stopWork();
          player.onWorkStopped(job.kind);
        } else {
          const step = Math.min(W.haulBack, along / Math.max(dt, 1e-4));
          // ...and eased onto its line as he goes, no faster than a plough will be dragged aside
          const aside = Math.hypot(offX, offZ);
          const ease = aside > 1e-4 ? Math.min(aside * 3, 1.5) / aside : 0;
          player.vel.set(-job.dx * step - offX * ease, -job.dz * step - offZ * ease);
        }
      } else if (along >= job.len - 0.02) {
        // the ridge's end: the last blow has landed
        player.vel.set(0, 0);
        stopWork();
        player.onWorkDone(job.kind);
      } else if (job.plough) {
        // the share in the earth, and a steady walk behind it: the earth is
        // counted turned every `ploughBeat` of the way
        player.haul.working = true;
        const beats = Math.floor(player.modeT / W.ploughBeat);
        while (job.strokes < beats) {
          job.strokes += 1;
          player.onWorkStroke(job.kind);
        }
        const pace = W.ploughPace * Math.min(1, 0.25 + player.modeT * 2.5); // leaning into it as the share bites
        const step = Math.min(pace, (job.len - along) / Math.max(dt, 1e-4));
        player.vel.set(job.dx * step - offX * 6, job.dz * step - offZ * 6);
        if (player.modeT > job.len / W.ploughPace * 1.6 + 4) {
          stopWork();
          player.onWorkStopped(job.kind);
        }
      } else if (player.modeT > job.len / W.workPace * 1.6 + 4) {
        // held up somewhere along the line (it should never happen): give it up, keeping what is done
        stopWork();
        player.onWorkStopped(job.kind);
      } else {
        // each blow lands 60% of the way through its beat...
        const landed = Math.floor(player.modeT / W.strokeTime + 0.4);
        while (job.strokes < landed) {
          job.strokes += 1;
          player.onWorkStroke(job.kind);
        }
        // ...and between blows he steps on: still while the blow lands, his
        // feet moving most as the tool is drawn back for the next
        const beat = (player.modeT / W.strokeTime) % 1;
        const pace = W.workPace * (1 + Math.cos(Math.PI * 2 * (beat - 0.05)));
        const left = (job.len - along) / Math.max(dt, 1e-4);
        const step = Math.min(pace, left);
        player.vel.set(job.dx * step - offX * 6, job.dz * step - offZ * 6); // and kept to his line
      }
    }

    if (player.mode === 'sit') updateSit(dt);

    // down onto the ground and back up again, at their own paces
    player.sitK = player.mode === 'sit'
      ? Math.min(1, player.sitK + dt / P.sitDown)
      : Math.max(0, player.sitK - dt / P.sitUp);
    player.sit01 = player.sitK * player.sitK * (3 - 2 * player.sitK);

    let haulTurn = 0; // how far the plough lets him turn this step
    if (player.mode === 'normal' && player.haul) {
      // The plough goes only the way it points: he turns it toward where he
      // is steered (no faster than it will come round) and walks on as it
      // lines up. Steered back the way he came, he draws it backward instead.
      const W = CONFIG.farm;
      const sin = Math.sin(player.facing);
      const cos = Math.cos(player.facing);
      let want = 0;
      const turning = player.route?.turning;
      if (len > 0 || turning) {
        let off = turning ? angleTo(player.route.facing) : angleTo(Math.atan2(dirX, dirZ));
        const back = !player.route && Math.abs(off) > 2.2;
        if (back) off -= Math.sign(off) * Math.PI; // his back to where he is going
        haulTurn = clamp(off, -W.haulTurn * dt, W.haulTurn * dt);
        if (turning && Math.abs(off) <= 0.04) {
          const r = player.route;
          player.route = null;
          haulTurn = off;
          r.onArrive();
        } else if (!turning) {
          const lined = clamp((Math.cos(off) - 0.6) / 0.35, 0, 1); // far off the line he only turns
          const gait = player.route ? CONFIG.stamina.homewardPace : 1;
          want = P.walkSpeed * W.haulPace * gait * lined * (back ? -0.6 : 1);
          if (!player.route) {
            player.fatigue += CONFIG.stamina.walkDrain * dt;
            if (player.fatigue >= 1) {
              const whole = Math.floor(player.fatigue);
              player.fatigue -= whole;
              player.tire(whole);
            }
          }
        }
      }
      let pace = player.vel.x * sin + player.vel.y * cos; // what he has along its line; the rest is shed
      const gap = want - pace;
      pace += Math.sign(gap) * Math.min(Math.abs(gap), (len > 0 ? P.accel : P.brake) * 0.6 * dt);
      player.vel.set(sin * pace, cos * pace);
    } else if (player.mode === 'normal' && player.route?.turning) {
      // at the end of a walk he was asked to take: round to the way he was asked to face
      steer(0, 0, P.brake, dt);
      const off = angleTo(player.route.facing);
      if (Math.abs(off) <= 0.04) {
        const r = player.route;
        player.route = null;
        player.facing += off;
        r.onArrive();
      } else {
        haulTurn = clamp(off, -8 * dt, 8 * dt);
      }
    } else if (player.mode === 'normal') {
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
    if (player.haul && player.mode === 'normal') resolveHaul(colliders); // at work its line is clear by the laying-out
    const px = player.pos.x;
    const pz = player.pos.z;
    const groundY = player.groundAt(px, pz);
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
      len === 0 && !player.crouching && !player.haul && !player.route && player.hp > 0 && player.vel.lengthSq() < 0.01;
    player.stillFor = still && hearthDist() < P.sitNear ? player.stillFor + dt : 0;
    if (player.stillFor >= P.sitDelay) startSit();
    // the stick is laid on the ground beside him while he sits, and taken up
    // again as he rises (the field's tools manage their own)
    if (player.mode !== 'work' && !player.haul) layStick(player.sit01 >= 0.5 && !player.unarmed);

    // feel the ground's tilt: it slows a climb and lays the soles to the slope
    player.slope.x = (player.groundAt(px + SLOPE_PROBE, pz) - player.groundAt(px - SLOPE_PROBE, pz)) / (SLOPE_PROBE * 2);
    player.slope.z = (player.groundAt(px, pz + SLOPE_PROBE) - player.groundAt(px, pz - SLOPE_PROBE)) / (SLOPE_PROBE * 2);

    // the body turns toward where it is being steered. A shove steers
    // nothing, so a bitten peasant staggers back still facing his rat.
    const facingWas = player.facing;
    if (player.mode === 'roll') {
      player.facing = lerpAngle(player.facing, Math.atan2(player.rollDir.x, player.rollDir.z), 1 - Math.exp(-dt * P.turnLerp));
    } else if (player.mode === 'normal' && (player.haul || haulTurn !== 0)) {
      player.facing += haulTurn; // the plough's turn, or the turn at a walk's end, worked out above
    } else if (player.mode === 'normal' && len > 0) {
      player.facing = lerpAngle(player.facing, Math.atan2(dirX, dirZ), 1 - Math.exp(-dt * P.turnLerp));
    } else if (player.mode === 'sit') {
      // turned to face the flames
      const h = player.hearth;
      player.facing = lerpAngle(player.facing, Math.atan2(h.x - px, h.z - pz), 1 - Math.exp(-dt * 5));
    } else if (player.mode === 'work') {
      // turned to the ridge he works beside, half toward its crown
      player.facing = lerpAngle(player.facing, player.work.facing, 1 - Math.exp(-dt * P.turnLerp));
    }
    player.turnRate = dt > 1e-4 ? (player.facing - facingWas) / dt : 0;
    m.group.rotation.y = player.facing;
    // the plough goes before him, wherever that has left him
    if (player.haul) player.haul.place(player.pos.x, player.pos.z, player.facing, dt);

    anim.update(dt, player);
  };

  player.attack = startAttack;
  player.startSleep = startSleep;
  player.rise = startRise;
  player.startWork = startWork;
  player.takeHaul = takeHaul;
  player.dropHaul = dropHaul;

  // walk himself through `points` ({x, z} each) in turn; onArrive at the last
  // (yields: true lets a movement key call the walk off — a walk he was asked
  // to take, not one he must)
  player.walkRoute = function walkRoute(points, onArrive, { yields = false, facing } = {}) {
    player.route = points.length ? { points, i: 0, onArrive, yields, facing, turning: false } : null;
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
