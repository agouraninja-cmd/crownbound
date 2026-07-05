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

// x, z      the villager's world position
// yaw       the parent group's world rotation.y
// forward   the figure's facing inside that group (atan2(x,z) convention)
// sway      chest/head/arms group — breathes
// head      head group inside sway — turns and nods (needs a nose to read!)
// gestures  [{ dur, apply(k) }] with apply(0) = rest pose; picked at random
// notice    how near the player must be to be watched and greeted
export function makeAlive({ x, z, yaw, forward, sway, head, gestures = [], notice = 4 }) {
  const bodyYaw = yaw + forward;
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

      // breathing: lean, sideways drift, and a small rise-and-fall — layered
      // frequencies so it reads as a body, not a metronome
      sway.rotation.x = Math.sin(t * tempo) * 0.045;
      sway.rotation.z = Math.sin(t * tempo * 0.53 + 1.3) * 0.03;
      sway.position.y = baseSwayY + Math.sin(t * tempo) * 0.012;

      // the head: watch the player when near, drift back to the work when not
      const dist = p ? Math.hypot(p.x - x, p.z - z) : Infinity;
      let target = 0;
      if (dist < notice) {
        target = wrapAngle(Math.atan2(p.x - x, p.z - z) - bodyYaw);
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
      } else if (gestures.length) {
        nextGest -= dt;
        if (nextGest <= 0) {
          gest = { g: gestures[Math.floor(Math.random() * gestures.length)], t: 0 };
          played += 1;
        }
      }
    },

    // windows for the smoke suite
    headYaw: () => head.rotation.y,
    greetedYet: () => greeted,
    gesturesPlayed: () => played,
    swayX: () => sway.rotation.x,
  };
  return api;
}
