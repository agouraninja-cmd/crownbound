import { LAYOUT } from '../scene/layout.js';
import { dummyHitXp, addXp } from '../state/state.js';
import { toast } from '../ui/toasts.js';
import { sfx } from '../ui/audio.js';

// The straw dummy: comical wobble spring + heavily diminishing daily STR XP.
export function createDummy(worldDummy) {
  const pivot = worldDummy.pivot;
  let velX = 0;
  let velZ = 0;
  let taughtToastShown = false;

  return {
    x: LAYOUT.dummy.x,
    z: LAYOUT.dummy.z,
    radius: 0.55,
    alive: true, // never dies — it's a dummy

    hit(fromX, fromZ) {
      // shove the spring so the top tips away from the striker
      const dx = this.x - fromX;
      const dz = this.z - fromZ;
      const d = Math.hypot(dx, dz) || 1;
      velX += (dz / d) * 7; // rotX tips the top along +z
      velZ += -(dx / d) * 7; // rotZ tips the top along -x
      sfx.thud();

      const xp = dummyHitXp();
      if (xp > 0) {
        const ups = addXp('str', xp);
        for (const lvl of ups) {
          toast(`Strength rises to level ${lvl}!`, 'gold');
          sfx.levelUp();
        }
      } else if (!taughtToastShown) {
        taughtToastShown = true;
        toast('The dummy has taught you all it can today.');
      }
    },

    update(dt) {
      // damped angular spring back to upright
      const k = 26;
      const damp = 4.2;
      velX += (-pivot.rotation.x * k - velX * damp) * dt;
      velZ += (-pivot.rotation.z * k - velZ * damp) * dt;
      pivot.rotation.x += velX * dt;
      pivot.rotation.z += velZ * dt;
    },
  };
}
