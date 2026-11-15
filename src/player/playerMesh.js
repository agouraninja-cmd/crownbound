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
const IRON = 0x8b9097; // a worked edge, worn bright
const EYE = 0x241a12;

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, seg = 6) => new THREE.CylinderGeometry(rt, rb, h, seg);
const ball = (r) => new THREE.SphereGeometry(r, 6, 4);

// The skeleton's measurements, shared with playerAnim.js: it solves the knees
// from the bone lengths and plants the feet from the heights. Reshape the
// pieces freely, but a joint moved here must move its number too.
export const RIG = {
  waist: 0.6, // the roller pivot above the ground, standing tall
  pelvis: -0.05, // the pelvis below that pivot
  hipX: 0.12, // each hip joint out from the midline
  thigh: 0.265, // hip → knee
  shin: 0.255, // knee → ankle
  ankle: 0.035, // the ankle above the ground with the sole planted
  ball: 0.11, // ankle → ball of the foot, the pivot of a toe-off
  spine: 0.12, // the chest pivot above the pelvis: the belt line
  shoulderX: 0.33,
  shoulderY: 0.38, // above the spine pivot
  upperArm: 0.22, // shoulder → elbow
  forearm: 0.27, // elbow → the fist
  neck: 0.5, // the head pivot above the spine pivot
  stickDrop: 0.29, // the fist → the middle of the stick
};

// a round piece pressed flat front-to-back, the way a body is
function flat(m, z) {
  m.scale.z = z;
  return m;
}

// A jointed figure, facing +z. Every joint is a Group pivoted where the bone
// turns, with its geometry hanging below:
//
//   group ─ roller (the waist: leans, somersaults, lies down)
//            └ hips (the pelvis: twists and tilts with the stride)
//               ├ leg ×2: thigh ─ shin ─ foot
//               └ chest (the spine, at the belt)
//                  ├ arm ×2: upper ─ fore ( ─ grip ─ weapon / field tools, on arm 1)
//                  └ head
//
// Side 0 is the figure's -x, side 1 its +x (the weapon hand). The animator
// (playerAnim.js) is the only thing that turns these joints.
export function buildPlayerMesh() {
  const group = new THREE.Group();
  const roller = new THREE.Group();
  roller.position.y = RIG.waist;
  group.add(roller);

  const hips = new THREE.Group();
  hips.position.y = RIG.pelvis;
  roller.add(hips);

  // the tunic's skirt flaring below the belt
  hips.add(flat(mesh(cyl(0.255, 0.305, 0.25, 8), tone(TUNIC, 0.96), { y: 0.0 }), 0.74));
  hips.add(flat(mesh(cyl(0.26, 0.26, 0.065, 8), LEATHER, { y: 0.12 }), 0.74)); // belt
  hips.add(mesh(box(0.06, 0.07, 0.03), 0xb08d4f, { y: 0.12, z: 0.19 })); // buckle
  hips.add(mesh(box(0.1, 0.13, 0.07), tone(LEATHER, 0.85), { x: 0.2, y: 0.03, z: 0.09, rz: -0.1 })); // belt pouch

  // legs: woollen hose into turned-down boots, bending at knee and ankle
  const makeLeg = (side) => {
    const thigh = new THREE.Group();
    thigh.position.set(side * RIG.hipX, 0, 0);
    thigh.rotation.order = 'ZXY'; // swing fore-and-aft first, then out to the side
    thigh.add(mesh(cyl(0.097, 0.088, RIG.thigh), HOSE, { y: -RIG.thigh / 2 }));
    thigh.add(mesh(ball(0.09), tone(HOSE, 0.94), { y: -RIG.thigh })); // the knee

    const shin = new THREE.Group();
    shin.position.y = -RIG.thigh;
    shin.add(mesh(cyl(0.086, 0.078, 0.15), HOSE, { y: -0.075 }));
    shin.add(mesh(cyl(0.086, 0.082, 0.14), BOOT, { y: -0.19 }));
    shin.add(mesh(cyl(0.096, 0.09, 0.045), LEATHER, { y: -0.125 })); // the boot's cuff
    thigh.add(shin);

    const foot = new THREE.Group();
    foot.position.y = -RIG.shin;
    foot.rotation.y = side * 0.12; // toes turned a little out
    foot.add(mesh(box(0.16, 0.09, 0.26), BOOT, { y: -0.01, z: 0.035 }));
    foot.add(mesh(box(0.14, 0.05, 0.08), tone(BOOT, 1.25), { y: 0.02, z: 0.15, rx: 0.3 })); // toe cap
    shin.add(foot);

    hips.add(thigh);
    return { thigh, shin, foot };
  };
  const legs = [makeLeg(-1), makeLeg(1)];

  const chest = new THREE.Group();
  chest.position.y = RIG.spine;
  hips.add(chest);

  // tunic: the chest and one honest patch
  chest.add(flat(mesh(cyl(0.225, 0.25, 0.46, 8), TUNIC, { y: 0.21 }), 0.72));
  chest.add(mesh(box(0.15, 0.13, 0.03), TUNIC_DARK, { x: 0.09, y: 0.24, z: 0.158, rz: 0.2 })); // patch
  // the hood, down: a cape over the shoulders and its cowl bunched at the nape
  chest.add(flat(mesh(cyl(0.19, 0.31, 0.17, 8), COWL, { y: 0.385 }), 0.8));
  chest.add(flat(mesh(cyl(0.12, 0.19, 0.08, 8), tone(COWL, 0.86), { y: 0.5 }), 0.86));
  chest.add(mesh(box(0.22, 0.13, 0.12), tone(COWL, 0.9), { y: 0.48, z: -0.15, rx: -0.25 }));

  // arms: a sleeve bending at the elbow, a cuff, a hand
  const makeArm = (side) => {
    const upper = new THREE.Group();
    upper.position.set(side * RIG.shoulderX, RIG.shoulderY, 0);
    upper.add(mesh(cyl(0.078, 0.07, RIG.upperArm), TUNIC, { y: -RIG.upperArm / 2 }));
    upper.add(mesh(ball(0.071), tone(TUNIC, 0.95), { y: -RIG.upperArm })); // the elbow

    const fore = new THREE.Group();
    fore.position.y = -RIG.upperArm;
    fore.add(mesh(cyl(0.069, 0.062, 0.2), TUNIC, { y: -0.1 }));
    fore.add(mesh(cyl(0.068, 0.068, 0.04), TUNIC_DARK, { y: -0.19 }));
    fore.add(mesh(box(0.1, 0.11, 0.1), SKIN, { y: -RIG.forearm }));
    upper.add(fore);

    chest.add(upper);
    return { upper, fore };
  };
  const arms = [makeArm(-1), makeArm(1)];

  // trusty stick (a sword, someday), turning in the fist at the grip. Kept out
  // of the bake: the chapman's gear re-materials and re-scales it (player.js
  // setWeaponTier).
  const grip = new THREE.Group();
  grip.position.y = -RIG.forearm;
  arms[1].fore.add(grip);
  const weapon = mesh(cyl(0.028, 0.036, 0.75), STICK, { y: -RIG.stickDrop, keep: true });
  weapon.add(mesh(box(0.14, 0.05, 0.08), TUNIC_DARK, { y: 0.31 }));
  grip.add(weapon);

  // Tools for the miller's strip, held in the same fist: hidden until he
  // works a ridge, when player.js swaps one in for the stick. Each is its own
  // Group, so it bakes apart and can be shown and hidden. Like the stick they
  // run on down the line of the forearm, past the fist.
  const hoe = new THREE.Group();
  hoe.add(mesh(cyl(0.022, 0.026, 0.92), tone(STICK, 1.15), { y: -0.33 })); // the shaft
  hoe.add(mesh(box(0.16, 0.035, 0.13), IRON, { y: -0.78, z: 0.05, rx: 0.45 })); // the blade, set across its end
  const sickle = new THREE.Group();
  sickle.add(mesh(cyl(0.025, 0.022, 0.2), STICK, { y: -0.04 })); // the handle
  // the blade: a crescent of short flats hooking forward from the handle's end
  const HOOK = 0.14; // the crescent's radius
  for (let k = 0; k < 6; k++) {
    const a = 0.25 + k * 0.62; // round the crescent, from the handle
    sickle.add(
      mesh(box(0.012, 0.035 - k * 0.004, HOOK * 0.7), IRON, {
        y: -0.16 - HOOK * Math.sin(a),
        z: HOOK - HOOK * Math.cos(a),
        rx: Math.PI / 2 - a, // each flat lies along the curve
      })
    );
  }
  hoe.visible = false;
  sickle.visible = false;
  grip.add(hoe, sickle);

  // head: a faceted skull under a thatch of dark hair
  const head = new THREE.Group();
  head.position.y = RIG.neck;
  chest.add(head);
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
  return { group, roller, hips, chest, head, legs, arms, grip, weapon, tools: { hoe, sickle } };
}
