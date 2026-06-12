import * as THREE from 'three';
import { CONFIG } from '../state/config.js';
import { LAYOUT } from '../scene/layout.js';
import { terrainHeight } from '../scene/terrain.js';
import { mesh, flash } from '../scene/meshUtils.js';
import { getState, recordRatKill } from '../state/state.js';
import { toast } from '../ui/toasts.js';
import { sfx } from '../ui/audio.js';

const R = CONFIG.rats;
const FUR = 0x6e655c;
const FUR_DARK = 0x57504a;

function buildRatMesh() {
  const g = new THREE.Group();
  const body = mesh(new THREE.BoxGeometry(0.3, 0.2, 0.48), FUR, { y: 0.13 });
  const head = mesh(new THREE.BoxGeometry(0.2, 0.16, 0.2), FUR, { y: 0.16, z: 0.3 });
  const nose = mesh(new THREE.ConeGeometry(0.07, 0.16, 5), 0xb98a78, {
    y: 0.14, z: 0.45, rx: Math.PI / 2,
  });
  const earL = mesh(new THREE.BoxGeometry(0.07, 0.09, 0.03), FUR_DARK, { x: -0.07, y: 0.27, z: 0.28 });
  const earR = mesh(new THREE.BoxGeometry(0.07, 0.09, 0.03), FUR_DARK, { x: 0.07, y: 0.27, z: 0.28 });
  const tail = mesh(new THREE.BoxGeometry(0.04, 0.04, 0.42), 0xb98a78, { y: 0.12, z: -0.42 });
  tail.rotation.x = -0.25;
  g.add(body, head, nose, earL, earR, tail);
  return g;
}

export function createRats(scene) {
  const home = { x: LAYOUT.granary.x, z: LAYOUT.granary.z };
  const rats = [];

  // dead rats stay dead for the day; the pack returns at dawn
  const alreadyKilled = getState().counters.ratsKilled;
  const count = Math.max(0, R.count - alreadyKilled);

  for (let i = 0; i < count; i++) {
    const a = (i / R.count) * Math.PI * 2 + 0.7;
    const rat = {
      group: buildRatMesh(),
      x: home.x + Math.cos(a) * 2.2,
      z: home.z + Math.sin(a) * 2.2,
      hp: R.hp,
      alive: true,
      dying: 0,
      state: 'wander', // wander | chase | return
      targetX: home.x,
      targetZ: home.z,
      wanderTimer: Math.random() * 2,
      biteTimer: 0,
      stun: 0,
      kbX: 0,
      kbZ: 0,
      facing: a,
      hopPhase: Math.random() * 6,
      radius: 0.32,
    };
    rat.group.position.set(rat.x, terrainHeight(rat.x, rat.z), rat.z);
    scene.add(rat.group);
    rats.push(rat);
  }

  function killRat(rat) {
    rat.alive = false;
    rat.dying = 0.001;
    const coins = recordRatKill();
    toast(`The miller pays a bounty per tail. (+${coins}c)`, 'gold');
    sfx.ratDie();
    sfx.coin();
  }

  return {
    list: rats,

    update(dt, player, onPlayerHit) {
      for (const rat of rats) {
        if (!rat.alive) {
          if (rat.dying > 0) {
            rat.dying += dt;
            const t = Math.min(rat.dying / 0.35, 1);
            rat.group.scale.set(1 + t * 0.6, Math.max(1 - t * 1.1, 0.02), 1 + t * 0.6);
            if (t >= 1) {
              scene.remove(rat.group);
              rat.dying = 0;
            }
          }
          continue;
        }

        rat.biteTimer = Math.max(0, rat.biteTimer - dt);
        rat.stun = Math.max(0, rat.stun - dt);

        const pdx = player.pos.x - rat.x;
        const pdz = player.pos.z - rat.z;
        const playerDist = Math.hypot(pdx, pdz);
        const homeDist = Math.hypot(rat.x - home.x, rat.z - home.z);

        // state choices
        if (homeDist > R.leashRange) rat.state = 'return';
        else if (playerDist < R.aggroRange && player.hp > 0) rat.state = 'chase';
        else if (rat.state === 'chase' || rat.state === 'return') {
          if (homeDist < 2) rat.state = 'wander';
        }

        let speed = 0;
        let dirX = 0;
        let dirZ = 0;

        if (rat.stun > 0) {
          // staggering — knockback only
        } else if (rat.state === 'chase') {
          if (playerDist > R.biteRange * 0.8) {
            dirX = pdx / playerDist;
            dirZ = pdz / playerDist;
            speed = R.speed;
          }
          if (playerDist < R.biteRange && rat.biteTimer === 0) {
            rat.biteTimer = R.biteCooldown;
            rat.hopPhase = 0;
            onPlayerHit(R.biteDamage, rat.x, rat.z);
          }
        } else {
          // wander / return
          if (rat.state === 'return') {
            rat.targetX = home.x;
            rat.targetZ = home.z;
          } else {
            rat.wanderTimer -= dt;
            if (rat.wanderTimer <= 0) {
              rat.wanderTimer = 1.5 + Math.random() * 2.5;
              const wa = Math.random() * Math.PI * 2;
              rat.targetX = home.x + Math.cos(wa) * R.wanderRadius;
              rat.targetZ = home.z + Math.sin(wa) * R.wanderRadius;
            }
          }
          const tdx = rat.targetX - rat.x;
          const tdz = rat.targetZ - rat.z;
          const td = Math.hypot(tdx, tdz);
          if (td > 0.4) {
            dirX = tdx / td;
            dirZ = tdz / td;
            speed = R.speed * 0.45;
          }
        }

        rat.x += (dirX * speed + rat.kbX) * dt;
        rat.z += (dirZ * speed + rat.kbZ) * dt;
        rat.kbX *= Math.max(0, 1 - dt * 8);
        rat.kbZ *= Math.max(0, 1 - dt * 8);

        if (speed > 0) {
          rat.facing = Math.atan2(dirX, dirZ);
          rat.hopPhase += dt * 13;
        }

        const hop = Math.abs(Math.sin(rat.hopPhase)) * 0.07 * (speed > 0 ? 1 : 0);
        rat.group.position.set(rat.x, terrainHeight(rat.x, rat.z) + hop, rat.z);
        rat.group.rotation.y = rat.facing;
      }
    },

    // returns true if something was struck
    tryHit(fromX, fromZ, dirAngle, range, arcRad, damage) {
      let struck = false;
      for (const rat of rats) {
        if (!rat.alive) continue;
        const dx = rat.x - fromX;
        const dz = rat.z - fromZ;
        const d = Math.hypot(dx, dz);
        if (d > range + rat.radius) continue;
        const ang = Math.atan2(dx, dz);
        let diff = Math.abs(ang - dirAngle) % (Math.PI * 2);
        if (diff > Math.PI) diff = Math.PI * 2 - diff;
        if (diff > arcRad) continue;

        rat.hp -= damage;
        rat.stun = 0.3;
        const kb = 5.5;
        rat.kbX = (dx / (d || 1)) * kb;
        rat.kbZ = (dz / (d || 1)) * kb;
        flash(rat.group);
        sfx.squeak();
        struck = true;
        if (rat.hp <= 0) killRat(rat);
      }
      return struck;
    },
  };
}
