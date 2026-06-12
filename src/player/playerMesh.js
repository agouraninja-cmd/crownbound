import * as THREE from 'three';
import { mesh } from '../scene/meshUtils.js';

const TUNIC = 0x8a7355; // humble, patched wool
const TUNIC_DARK = 0x6e5a42;
const SKIN = 0xd9a877;
const HAIR = 0x4a3220;
const PANTS = 0x5d4f3d;
const STICK = 0x7a5a35;

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

// A simple jointed figure. Limbs are Groups pivoted at the joint so the
// controller can swing them; geometry hangs below/inside each pivot.
export function buildPlayerMesh() {
  const group = new THREE.Group();

  const makeLeg = (x) => {
    const leg = new THREE.Group();
    leg.position.set(x, 0.55, 0);
    const geo = mesh(box(0.17, 0.55, 0.2), PANTS, { y: -0.275 });
    leg.add(geo);
    leg.add(mesh(box(0.19, 0.1, 0.26), 0x3d3127, { y: -0.53, z: 0.02 })); // worn shoe
    group.add(leg);
    return leg;
  };
  const leftLeg = makeLeg(-0.12);
  const rightLeg = makeLeg(0.12);

  const body = new THREE.Group();
  body.position.y = 0.55;
  group.add(body);

  body.add(mesh(box(0.5, 0.58, 0.3), TUNIC, { y: 0.29 }));
  body.add(mesh(box(0.52, 0.07, 0.32), TUNIC_DARK, { y: 0.12 })); // rope belt
  body.add(mesh(box(0.2, 0.16, 0.05), TUNIC_DARK, { x: 0.12, y: 0.34, z: 0.16, rz: 0.2 })); // patch

  const makeArm = (x) => {
    const arm = new THREE.Group();
    arm.position.set(x, 0.5, 0);
    arm.add(mesh(box(0.13, 0.5, 0.16), TUNIC, { y: -0.22 }));
    arm.add(mesh(box(0.12, 0.12, 0.14), SKIN, { y: -0.5 }));
    body.add(arm);
    return arm;
  };
  const leftArm = makeArm(-0.33);
  const rightArm = makeArm(0.33);

  // trusty stick (a sword, someday)
  const weapon = mesh(box(0.055, 0.75, 0.055), STICK, { y: -0.78 });
  weapon.add(mesh(box(0.14, 0.05, 0.08), TUNIC_DARK, { y: 0.31 }));
  rightArm.add(weapon);

  const head = new THREE.Group();
  head.position.y = 1.13;
  body.add(head);
  head.add(mesh(box(0.32, 0.3, 0.3), SKIN, { y: 0.15 }));
  head.add(mesh(box(0.34, 0.1, 0.32), HAIR, { y: 0.31 }));
  head.add(mesh(box(0.34, 0.06, 0.06), HAIR, { y: 0.25, z: 0.14 })); // ragged fringe
  // two ink-dot eyes
  head.add(mesh(box(0.04, 0.05, 0.02), 0x241a12, { x: -0.08, y: 0.14, z: 0.16, shadow: false }));
  head.add(mesh(box(0.04, 0.05, 0.02), 0x241a12, { x: 0.08, y: 0.14, z: 0.16, shadow: false }));

  return { group, body, head, leftLeg, rightLeg, leftArm, rightArm, weapon };
}
