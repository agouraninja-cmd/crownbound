// The breath of life for the mute villagers: layered breathing, a head that
// turns to watch the player, occasional fidgets, and a nod the first time you
// come near each visit. Pure rotations on existing meshes — no new draw calls.
//
// makeAlive() returns a controller with update(dt, playerPos); world.js builds
// one per villager, main.js drives them each frame and wires onGreet to toasts.

function wrapAngle(a) {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

const HEAD_TURN_MAX = 0.7; // ~40° — interested, never owl-necked

// A slow scripted amble between fixed waypoints — no pathfinding, so the
// waypoints must be pre-cleared of colliders. He stops while the player is
// near (company on the rounds) and, while idling, settles into each
// waypoint's own working stance.
//
// group     the villager's whole THREE.Group (moved and turned bodily)
// forward   the figure's facing inside its group (atan2(x,z) convention)
// terrainY  terrainHeight fn — his feet follow the ground
// waypoints [{ x, z, face }] — face = world bodyYaw to settle into while idle
// onMove    called with (x, z) each frame so collider/prompt can follow him
export function makeStroll({ group, forward, terrainY, waypoints, speed = 0.55, notice = 4, onMove }) {
  let wi = 0;
  const pos = { x: waypoints[0].x, z: waypoints[0].z };
  let bodyYaw = waypoints[0].face;
  let idle = true;
  let wait = 4 + Math.random() * 6;
  let walkT = 0;
  let waddle = 0; // eases in while the feet move, out while they don't

  function easeYaw(target, dt, rate) {
    bodyYaw += wrapAngle(target - bodyYaw) * (1 - Math.exp(-dt * rate));
  }

  return {
    pose: () => ({ x: pos.x, z: pos.z, bodyYaw }),
    idle: () => idle,
    update(dt, p) {
      const playerNear = p && Math.hypot(p.x - pos.x, p.z - pos.z) < notice;
      let stepping = false;
      if (idle) {
        easeYaw(waypoints[wi].face, dt, 3);
        if (!playerNear) {
          wait -= dt;
          if (wait <= 0) {
            wi = (wi + 1) % waypoints.length;
            idle = false;
          }
        }
      } else {
        const w = waypoints[wi];
        const dx = w.x - pos.x;
        const dz = w.z - pos.z;
        const d = Math.hypot(dx, dz);
        easeYaw(Math.atan2(dx, dz), dt, 4);
        if (d < 0.08) {
          idle = true;
          wait = 6 + Math.random() * 8;
        } else if (!playerNear) {
          const step = Math.min(d, speed * dt);
          pos.x += (dx / d) * step;
          pos.z += (dz / d) * step;
          walkT += dt;
          stepping = true;
        }
      }
      // plant him: feet on the terrain, body turned to the walk, and a
      // small waddle-and-bob while the feet are (notionally) moving
      waddle += ((stepping ? 1 : 0) - waddle) * (1 - Math.exp(-dt * 6));
      group.position.set(
        pos.x,
        terrainY(pos.x, pos.z) + Math.abs(Math.sin(walkT * 5.5)) * 0.03 * waddle,
        pos.z
      );
      group.rotation.y = bodyYaw - forward;
      group.rotation.z = Math.sin(walkT * 5.5) * 0.045 * waddle;
      onMove?.(pos.x, pos.z);
    },
  };
}

// x, z      the villager's world position (his seed and his home if strolling)
// yaw       the parent group's world rotation.y
// forward   the figure's facing inside that group (atan2(x,z) convention)
// sway      chest/head/arms group — breathes
// head      head group inside sway — turns and nods (needs a nose to read!)
// gestures  [{ dur, apply(k) }] with apply(0) = rest pose; picked at random
// notice    how near the player must be to be watched and greeted
// stroll    optional makeStroll controller — drives his position and body yaw
export function makeAlive({ x, z, yaw, forward, sway, head, gestures = [], notice = 4, stroll = null }) {
  const staticPose = { x, z, bodyYaw: yaw + forward };
  const pose = () => (stroll ? stroll.pose() : staticPose);
  // the nod tips the head along its facing, whatever way the figure points
  const nodX = Math.cos(forward);
  const nodZ = -Math.sin(forward);
  const baseSwayY = sway.position.y;
  // seed phase and tempo from position so the village never breathes in unison
  let t = (Math.abs(x * 7.3 + z * 3.1) % Math.PI) * 2;
  const tempo = 0.9 + (Math.abs(x * 13.7 + z * 5.3) % 0.5);

  let headYaw = 0;
  let nodT = -1; // <0 = no nod playing
  let greeted = false;
  let played = 0;
  let gest = null;
  let nextGest = 2 + Math.random() * 3; // first fidget comes early

  const api = {
    onGreet: null, // assigned by main.js (toasts live in the UI layer)

    update(dt, p) {
      t += dt;
      stroll?.update(dt, p);
      const at = pose();

      // breathing: lean, sideways drift, and a small rise-and-fall — layered
      // frequencies so it reads as a body, not a metronome
      sway.rotation.x = Math.sin(t * tempo) * 0.045;
      sway.rotation.z = Math.sin(t * tempo * 0.53 + 1.3) * 0.03;
      sway.position.y = baseSwayY + Math.sin(t * tempo) * 0.012;

      // the head: watch the player when near, drift back to the work when not
      const dist = p ? Math.hypot(p.x - at.x, p.z - at.z) : Infinity;
      let target = 0;
      if (dist < notice) {
        target = wrapAngle(Math.atan2(p.x - at.x, p.z - at.z) - at.bodyYaw);
        target = Math.max(-HEAD_TURN_MAX, Math.min(HEAD_TURN_MAX, target));
        if (!greeted) {
          greeted = true;
          nodT = 0;
          api.onGreet?.();
        }
      }
      headYaw += (target - headYaw) * (1 - Math.exp(-dt * 5));
      head.rotation.y = headYaw;

      // the greeting nod: one smooth dip toward whoever just arrived
      let nod = 0;
      if (nodT >= 0) {
        nodT += dt;
        const k = Math.min(1, nodT / 0.9);
        nod = Math.sin(k * Math.PI) * 0.28;
        if (k === 1) nodT = -1;
      }
      head.rotation.x = nodX * nod;
      head.rotation.z = nodZ * nod;

      // fidgets: episodic, not constant — statues loop, people occasionally do things
      if (gest) {
        gest.t += dt;
        const k = Math.min(1, gest.t / gest.g.dur);
        gest.g.apply(k);
        if (k === 1) {
          gest.g.apply(0); // land exactly back on the rest pose
          gest = null;
          nextGest = 6 + Math.random() * 8;
        }
      } else if (gestures.length && (!stroll || stroll.idle())) {
        // no fidgeting mid-stride — hands are for walking
        nextGest -= dt;
        if (nextGest <= 0) {
          gest = { g: gestures[Math.floor(Math.random() * gestures.length)], t: 0 };
          played += 1;
        }
      }
    },

    // windows for the smoke suite
    at: () => ({ x: pose().x, z: pose().z }),
    headYaw: () => head.rotation.y,
    greetedYet: () => greeted,
    gesturesPlayed: () => played,
    swayX: () => sway.rotation.x,
  };
  return api;
}
