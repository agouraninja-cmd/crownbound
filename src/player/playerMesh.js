import * as THREE from 'three';
import { mesh, bake, tone } from '../scene/meshUtils.js';

const TUNIC = 0x9a8164; // humble, patched wool
const TUNIC_DARK = 0x7a6650;
const COWL = 0x4a6072; // woad-blue hood, worn down about the shoulders
const SKIN = 0xd9a877;
const HAIR = 0x4a3220;
const HOSE = 0x5d4f3d;
const BOOT = 0x3d3127;
const LEATHER = 0x6b3a26;
const STICK = 0x7a5a35;
const EYE = 0x241a12;

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, seg = 6) => new THREE.CylinderGeometry(rt, rb, h, seg);

// a round piece pressed flat front-to-back, the way a body is
function flat(m, z) {
  m.scale.z = z;
  return m;
}

// A jointed figure. Limbs are Groups pivoted at the joint so the controller
// can swing them; geometry hangs below/inside each pivot. `roller` wraps
// everything at waist height so dodge-rolls can somersault. The pivots and
// overall size are fixed points of the animation code in player.js — reshape
// freely, but keep them where they are. Faces +z.
export function buildPlayerMesh() {
  const group = new THREE.Group();
  const roller = new THREE.Group();
  roller.position.y = 0.6;
  group.add(roller);

  // legs: woollen hose into turned-down boots
  const makeLeg = (x) => {
    const leg = new THREE.Group();
    leg.position.set(x, -0.05, 0);
    leg.add(mesh(cyl(0.097, 0.076, 0.5), HOSE, { y: -0.25 }));
    leg.add(mesh(cyl(0.086, 0.082, 0.16), BOOT, { y: -0.46 }));
    leg.add(mesh(cyl(0.096, 0.09, 0.045), LEATHER, { y: -0.385 })); // the boot's cuff
    leg.add(mesh(box(0.16, 0.09, 0.26), BOOT, { y: -0.53, z: 0.035 }));
    leg.add(mesh(box(0.14, 0.05, 0.08), tone(BOOT, 1.25), { y: -0.5, z: 0.15, rx: 0.3 })); // toe cap
    roller.add(leg);
    return leg;
  };
  const leftLeg = makeLeg(-0.12);
  const rightLeg = makeLeg(0.12);

  const body = new THREE.Group();
  body.position.y = -0.05;
  roller.add(body);

  // tunic: chest, a skirt flaring below the belt, one honest patch
  body.add(flat(mesh(cyl(0.225, 0.25, 0.46, 8), TUNIC, { y: 0.33 }), 0.72));
  body.add(flat(mesh(cyl(0.255, 0.305, 0.25, 8), tone(TUNIC, 0.96), { y: 0.0 }), 0.74));
  body.add(flat(mesh(cyl(0.26, 0.26, 0.065, 8), LEATHER, { y: 0.12 }), 0.74)); // belt
  body.add(mesh(box(0.06, 0.07, 0.03), 0xb08d4f, { y: 0.12, z: 0.19 })); // buckle
  body.add(mesh(box(0.1, 0.13, 0.07), tone(LEATHER, 0.85), { x: 0.2, y: 0.03, z: 0.09, rz: -0.1 })); // belt pouch
  body.add(mesh(box(0.15, 0.13, 0.03), TUNIC_DARK, { x: 0.09, y: 0.36, z: 0.158, rz: 0.2 })); // patch
  // the hood, down: a cape over the shoulders and its cowl bunched at the nape
  body.add(flat(mesh(cyl(0.19, 0.31, 0.17, 8), COWL, { y: 0.505 }), 0.8));
  body.add(flat(mesh(cyl(0.12, 0.19, 0.08, 8), tone(COWL, 0.86), { y: 0.62 }), 0.86));
  body.add(mesh(box(0.22, 0.13, 0.12), tone(COWL, 0.9), { y: 0.6, z: -0.15, rx: -0.25 }));

  // arms: a tapering sleeve, a cuff, a hand
  const makeArm = (x) => {
    const arm = new THREE.Group();
    arm.position.set(x, 0.5, 0);
    arm.add(mesh(cyl(0.078, 0.062, 0.44), TUNIC, { y: -0.2 }));
    arm.add(mesh(cyl(0.068, 0.068, 0.04), TUNIC_DARK, { y: -0.41 }));
    arm.add(mesh(box(0.1, 0.11, 0.1), SKIN, { y: -0.49 }));
    body.add(arm);
    return arm;
  };
  const leftArm = makeArm(-0.33);
  const rightArm = makeArm(0.33);

  // trusty stick (a sword, someday). Kept out of the bake: the chapman's gear
  // re-materials and re-scales it (player.js setWeaponTier).
  const weapon = mesh(cyl(0.028, 0.036, 0.75), STICK, { y: -0.78, keep: true });
  weapon.add(mesh(box(0.14, 0.05, 0.08), TUNIC_DARK, { y: 0.31 }));
  rightArm.add(weapon);

  // head: a faceted skull under a thatch of dark hair
  const head = new THREE.Group();
  head.position.y = 0.62;
  body.add(head);
  head.add(mesh(cyl(0.07, 0.085, 0.1), tone(SKIN, 0.92), { y: 0.0 })); // neck
  const skull = mesh(new THREE.SphereGeometry(0.17, 8, 6), SKIN, { y: 0.17 });
  skull.scale.set(1, 1.02, 0.96);
  head.add(skull);
  // hair: a cap tipped back off the brow, a ragged fringe, tufts by the ears
  head.add(mesh(new THREE.SphereGeometry(0.183, 8, 5, 0, Math.PI * 2, 0, 1.72), HAIR, { y: 0.18, rx: -0.5 }));
  head.add(mesh(box(0.25, 0.055, 0.06), HAIR, { y: 0.275, z: 0.125, rx: 0.35 }));
  head.add(mesh(box(0.09, 0.05, 0.06), tone(HAIR, 1.15), { x: -0.05, y: 0.262, z: 0.14, rx: 0.3, rz: 0.25 }));
  for (const s of [-1, 1]) {
    head.add(mesh(box(0.03, 0.1, 0.08), HAIR, { x: s * 0.162, y: 0.19, z: 0.02 }));
    head.add(mesh(box(0.028, 0.06, 0.045), tone(SKIN, 0.9), { x: s * 0.17, y: 0.15, z: 0.0 })); // ear
    // the face: an eye and a brow to each side of the nose
    head.add(mesh(box(0.036, 0.046, 0.02), EYE, { x: s * 0.066, y: 0.187, z: 0.15, shadow: false }));
    head.add(mesh(box(0.058, 0.014, 0.02), HAIR, { x: s * 0.066, y: 0.228, z: 0.152, rz: s * -0.14, shadow: false }));
  }
  head.add(mesh(box(0.042, 0.058, 0.05), tone(SKIN, 0.93), { y: 0.155, z: 0.17 })); // nose
  head.add(mesh(box(0.062, 0.012, 0.02), 0x8a5a44, { y: 0.1, z: 0.153, shadow: false })); // mouth

  bake(group);
  return { group, roller, body, head, leftLeg, rightLeg, leftArm, rightArm, weapon };
}
