import * as THREE from 'three';
import { CONFIG } from '../state/config.js';
import { RIG, WRIST } from './playerMesh.js';

// The peasant's body in motion. player.js decides what he is doing and where
// he is; this file decides how that looks, and is the only thing that turns
// the rig's joints. Nothing here is keyframed from a file — every pose is
// worked out each step from his speed, his heading and the ground:
//
//   · the legs are solved, not swung: each foot is given a place to be (on
//     the ground under a stride, tucked in a leap) and the knee bends however
//     it must to put it there, so crouching, landing and hills all fold the
//     legs for free;
//   · the pose is the standing/striding body with the leap, the roll, the
//     swing, field work and sleep laid over it by eased weights, so nothing
//     ever snaps;
//   · a few springs give him weight: he leans into a start and back from a
//     stop, banks through a turn, sinks on landing, and his arms and head
//     arrive a beat late.

const P = CONFIG.player;
const TAU = Math.PI * 2;
const L1 = RIG.thigh;
const L2 = RIG.shin;
const LEG = L1 + L2;
const HIP_HEIGHT = RIG.waist + RIG.pelvis; // the hip joints above the ground, standing tall
const REACH2 = (LEG * 0.995) ** 2; // the leg's full stretch, squared, a hair short of locked

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (x, a, b) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const ease = (now, target, rate, dt) => now + (target - now) * (1 - Math.exp(-rate * dt));

// A damped spring chasing a target, advanced by its exact solution — steady
// at any step length (the loop simulates in slices of up to 50ms). zeta 1
// settles without overshoot; under 1 it swings past and comes back.
function chase(s, target, omega, zeta, dt) {
  const d = s.x - target;
  if (zeta >= 1) {
    const c = s.v + omega * d;
    const e = Math.exp(-omega * dt);
    s.x = target + (d + c * dt) * e;
    s.v = (s.v - omega * c * dt) * e;
  } else {
    const a = zeta * omega;
    const b = omega * Math.sqrt(1 - zeta * zeta);
    const c = (s.v + a * d) / b;
    const e = Math.exp(-a * dt);
    const cos = Math.cos(b * dt);
    const sin = Math.sin(b * dt);
    s.x = target + e * (d * cos + c * sin);
    s.v = e * (s.v * cos - (a * c + d * b) * sin);
  }
  return s.x;
}

// lay one pose over another: every channel the layer names moves w of the way
function mix(pose, layer, w) {
  for (const k in layer) pose[k] += (layer[k] - pose[k]) * w;
}

// the same for a pair of feet
function mixFeet(feet, layer, w) {
  for (let i = 0; i < 2; i++) mix(feet[i], layer[i], w);
}

// The upper-body channels that pass through a spring before they reach the
// rig, so arms, chest and head follow through instead of stopping dead.
const SPRUNG = ['chestPitch', 'chestYaw', 'chestRoll', 'headPitch', 'headYaw',
  'swing0', 'spread0', 'elbow0', 'swing1', 'spread1', 'elbow1', 'grip', 'twist'];

// ---------- the swings, each in three held moments ----------
// Arm angles: swing is the shoulder fore-and-aft (negative forward, -π
// straight up), elbow bends the same way, spread lifts the arm out from the
// side (side 0 negative, side 1 positive). With the arm swung level (swing ≈
// -1.5), spread is where it points: out to his side when positive, across his
// body when negative.
//
// The stick lies across the fist (RIG.hold), so it leaves the hand near
// square to the forearm, out of the thumb side. grip is the wrist: 0 straight,
// negative cocked back toward the thumb, positive snapped through toward the
// little finger — always inside WRIST. twist turns the forearm about its own
// length before the wrist acts: 0 thumb forward (up, with the arm raised),
// negative palm down (thumb across the body), positive palm up (thumb out).
// A chop is a hammer's blow, thumb up; a level cut has to turn the hand over.

// 0 — the chop: hauled up over the shoulder and brought straight down
const WINDUP = { // stick hauled up and back over the shoulder, chest wound open
  drop: 0.02, hipYaw: 0.18, chestPitch: -0.14, chestYaw: 0.5, headPitch: 0.05, headYaw: -0.4,
  swing0: -0.55, spread0: -0.2, elbow0: -0.7,
  swing1: -2.9, spread1: 0.25, elbow1: -1.9, grip: 0.45, twist: 0, // the stick hangs down his back
};
const IMPACT = { // the blow lands: arm thrown long, wrist snapped over, chest behind it
  drop: 0.06, hipYaw: -0.12, chestPitch: 0.32, chestYaw: -0.3, headPitch: -0.12, headYaw: 0.2,
  swing0: 0.3, spread0: -0.2, elbow0: -0.7,
  swing1: -1.0, spread1: 0.05, elbow1: -0.25, grip: 0.6, twist: 0,
};
const FOLLOW = { // carried on down across the body
  drop: 0.08, hipYaw: -0.2, chestPitch: 0.4, chestYaw: -0.55, headPitch: -0.18, headYaw: 0.35,
  swing0: 0.4, spread0: -0.22, elbow0: -0.8,
  swing1: -0.2, spread1: -0.35, elbow1: -0.4, grip: 0.6, twist: 0,
};

// 1 — the backhand: from low across the body, whipped out level to the stick side
const BACK_WINDUP = { // coiled: fist by the far hip, shoulders turned away
  drop: 0.05, hipYaw: -0.2, chestPitch: 0.15, chestYaw: -0.75, headPitch: -0.05, headYaw: 0.55,
  swing0: 0.3, spread0: -0.25, elbow0: -0.9,
  swing1: -1.15, spread1: -0.95, elbow1: -1.3, grip: -0.2, twist: -1.3,
};
const BACK_IMPACT = { // uncoiled: arm long and level out in front
  drop: 0.05, hipYaw: 0.1, chestPitch: 0.12, chestYaw: 0.25, headPitch: -0.05, headYaw: -0.15,
  swing0: -0.3, spread0: -0.3, elbow0: -0.8,
  swing1: -1.45, spread1: 0.35, elbow1: -0.2, grip: 0.5, twist: -1.4,
};
const BACK_FOLLOW = { // flung wide, chest thrown open
  drop: 0.03, hipYaw: 0.2, chestPitch: 0.02, chestYaw: 0.7, headPitch: 0, headYaw: -0.5,
  swing0: -0.5, spread0: -0.35, elbow0: -0.9,
  swing1: -1.4, spread1: 1.3, elbow1: -0.45, grip: 0.6, twist: -1.4,
};

// 2 — the sweep: from wide on the stick side, scythed level back across
const SWEEP_WINDUP = { // arm drawn out and back, chest wound open
  drop: 0.04, hipYaw: 0.25, chestPitch: 0.04, chestYaw: 0.8, headPitch: 0, headYaw: -0.6,
  swing0: -0.6, spread0: -0.3, elbow0: -0.8,
  swing1: -1.4, spread1: 1.5, elbow1: -0.9, grip: -0.3, twist: 1.4,
};
const SWEEP_IMPACT = { // through the front, arm long, hips driving
  drop: 0.07, hipYaw: -0.15, chestPitch: 0.16, chestYaw: -0.3, headPitch: -0.06, headYaw: 0.2,
  swing0: 0.35, spread0: -0.25, elbow0: -0.7,
  swing1: -1.45, spread1: 0.1, elbow1: -0.25, grip: 0.5, twist: 1.4,
};
const SWEEP_FOLLOW = { // wrapped across the body
  drop: 0.07, hipYaw: -0.25, chestPitch: 0.22, chestYaw: -0.75, headPitch: -0.08, headYaw: 0.5,
  swing0: 0.5, spread0: -0.3, elbow0: -0.8,
  swing1: -1.3, spread1: -0.85, elbow1: -0.7, grip: 0.6, twist: 1.3,
};

// player.js names the swing (pl.swing); a chain runs chop → backhand → sweep,
// each ending where the next winds up
const SWINGS = [[WINDUP, IMPACT, FOLLOW], [BACK_WINDUP, BACK_IMPACT, BACK_FOLLOW], [SWEEP_WINDUP, SWEEP_IMPACT, SWEEP_FOLLOW]];

// ---------- field work: two held moments, gone between over and over ----------
// Same channels as the swings. Each job is [drawn back, struck]: the hoe
// hauled up and brought down into the earth, seed taken from the lap and cast
// wide, the sickle drawn out and swept through the stalks. He bends to it —
// and with the chest pitched forward the arms must swing further to reach.
// The hoe is worked two-handed: the off arm's channels here are only where
// it would be, for the moment the hoe is taken up or put down — the animator
// lays that hand on the shaft (graspShaft).
const HOE_UP = {
  drop: 0.05, hipYaw: 0.2, chestPitch: 0.28, chestYaw: 0.45, headPitch: 0, headYaw: -0.1,
  swing0: -1.25, spread0: 0.3, elbow0: -1.0,
  swing1: -1.5, spread1: -1.1, elbow1: -0.6, grip: -0.15, // both fists up before his chest: the shaft stands tall
};
const HOE_DOWN = {
  drop: 0.13, hipYaw: 0.15, chestPitch: 0.62, chestYaw: 0.35, headPitch: 0.1, headYaw: 0.05,
  swing0: -0.95, spread0: 0.3, elbow0: -0.5,
  swing1: -0.2, spread1: -0.8, elbow1: -0.4, grip: 0.6, // fists dropped to his belt, wrist snapped: the blade bites ahead
};
const SEED_DRAW = { // the casting hand dips into the seed gathered at his belt
  drop: 0.02, hipYaw: -0.1, chestPitch: 0.12, chestYaw: -0.3, headPitch: 0.05, headYaw: 0.15,
  swing0: -0.5, spread0: 0.3, elbow0: -1.5,
  swing1: -0.45, spread1: -0.5, elbow1: -1.7, grip: 0,
};
const SEED_CAST = { // ...and is flung out wide across the ridge
  drop: 0.04, hipYaw: 0.15, chestPitch: 0.1, chestYaw: 0.5, headPitch: 0, headYaw: -0.25,
  swing0: -0.5, spread0: 0.3, elbow0: -1.5,
  swing1: -1.35, spread1: 0.9, elbow1: -0.2, grip: 0,
};
const SICKLE_BACK = { // bent low, the off hand gathering stalks, the blade drawn out to the side
  drop: 0.2, hipYaw: 0.15, chestPitch: 0.72, chestYaw: 0.35, headPitch: 0.1, headYaw: -0.2,
  swing0: -1.5, spread0: 0.25, elbow0: -0.3,
  swing1: -0.95, spread1: 0.8, elbow1: -0.9, grip: 0.3,
};
const SICKLE_CUT = { // swept across, low, through what the off hand holds
  drop: 0.22, hipYaw: -0.15, chestPitch: 0.76, chestYaw: -0.4, headPitch: 0.1, headYaw: 0.25,
  swing0: -1.2, spread0: 0.3, elbow0: -0.9,
  swing1: -1.3, spread1: -0.7, elbow1: -0.5, grip: 0.3,
};
// player.js names the job (pl.work.kind); weeding is hoe-work too
const WORK = { till: [HOE_UP, HOE_DOWN], tend: [HOE_UP, HOE_DOWN], sow: [SEED_DRAW, SEED_CAST], reap: [SICKLE_BACK, SICKLE_CUT] };

// ---------- the leap: pushed off, afloat, reaching for the ground ----------
// Feet here are in the body's own frame, measured from each hip joint.
const LAUNCH = {
  pose: { drop: -0.02, pitch: 0.16, bank: 0, shift: 0, hipYaw: 0, hipRoll: 0, chestPitch: 0.1, chestYaw: 0, chestRoll: 0,
    headPitch: -0.2, headYaw: 0, swing0: -1.7, spread0: -0.25, elbow0: -0.5, swing1: -1.3, spread1: 0.3, elbow1: -0.6, grip: 0.4 },
  feet: [{ x: 0.02, y: -0.51, z: -0.05, pitch: 0.9 }, { x: -0.02, y: -0.51, z: -0.07, pitch: 0.9 }],
};
const AFLOAT = {
  pose: { drop: 0, pitch: 0.06, bank: 0, shift: 0, hipYaw: 0.1, hipRoll: 0, chestPitch: 0.12, chestYaw: -0.12, chestRoll: 0,
    headPitch: -0.1, headYaw: 0, swing0: -0.4, spread0: -0.5, elbow0: -1.0, swing1: -0.9, spread1: 0.45, elbow1: -0.9, grip: 0.6 },
  feet: [{ x: 0.02, y: -0.3, z: 0.17, pitch: 0.3 }, { x: -0.02, y: -0.45, z: -0.16, pitch: 0.7 }],
};
const REACH = {
  pose: { drop: 0, pitch: -0.08, bank: 0, shift: 0, hipYaw: 0, hipRoll: 0, chestPitch: 0.02, chestYaw: 0, chestRoll: 0,
    headPitch: 0.12, headYaw: 0, swing0: -0.2, spread0: -0.8, elbow0: -0.45, swing1: -0.3, spread1: 0.7, elbow1: -0.5, grip: 0.5 },
  feet: [{ x: 0, y: -0.47, z: 0.13, pitch: -0.12 }, { x: 0, y: -0.49, z: 0.03, pitch: 0 }],
};

// ---------- the roll: a tight tuck turning about the waist ----------
const TUCK = {
  pose: { pitch: 0, bank: 0, shift: 0, hipYaw: 0, hipRoll: 0, chestPitch: 0.55, chestYaw: 0, chestRoll: 0,
    headPitch: 0.5, headYaw: 0, swing0: -1.15, spread0: 0.1, elbow0: -1.6, swing1: -1.0, spread1: -0.05, elbow1: -1.5, grip: 0.6 },
  feet: [{ x: 0.02, y: -0.22, z: 0.2, pitch: 0.3 }, { x: -0.02, y: -0.22, z: 0.2, pitch: 0.3 }],
};

// ---------- asleep: flat on the back, arms at the sides ----------
const ABED = {
  pose: { bank: 0, shift: 0, hipYaw: 0, hipRoll: 0, chestPitch: 0, chestYaw: 0, chestRoll: 0,
    headPitch: -0.08, headYaw: 0, swing0: -0.25, spread0: -0.12, elbow0: -0.25, swing1: -0.25, spread1: 0.12, elbow1: -0.25, grip: 0.6 },
  feet: [{ x: 0, y: -0.515, z: 0, pitch: 0.5 }, { x: 0, y: -0.515, z: 0, pitch: 0.5 }],
};

// ---------- by the fire: sat on the ground, knees up, palms to the flames ----------
// The feet here are in the ground frame, like the stride's (x aside, z ahead
// of the root), so the knees fold to whatever height the pelvis has sunk to —
// he lowers himself down onto the ground and the legs work it out. drop sinks
// the waist to just above the earth; the pelvis rocks back onto the seat and
// the chest leans in toward the warmth.
const SEAT = {
  pose: { drop: 0.42, pitch: -0.12, bank: 0, shift: 0, hipYaw: 0, hipRoll: 0, chestPitch: 0.42, chestYaw: 0, chestRoll: 0,
    headPitch: -0.12, headYaw: 0, swing0: -0.95, spread0: 0.3, elbow0: -0.9, swing1: -0.95, spread1: -0.3, elbow1: -0.9, grip: 0 },
  feet: [{ x: -0.085, z: 0.36, pitch: -0.2 }, { x: 0.085, z: 0.36, pitch: -0.2 }],
};

// where the off elbow hangs when that hand takes the hoe: down, out and a little back
const ELBOW_POLE = new THREE.Vector3(-0.6, -1, -0.25).normalize();

const foot = () => ({ x: 0, y: 0, z: 0, pitch: 0 });

export function createPlayerAnimator(m) {
  const pose = {
    // the pelvis: sunk below standing height, leaned, banked, shifted aside, twisted, tilted
    drop: 0, pitch: 0, bank: 0, shift: 0, hipYaw: 0, hipRoll: 0,
    // the spine and the head
    chestPitch: 0, chestYaw: 0, chestRoll: 0, headPitch: 0, headYaw: 0,
    // the arms and the stick
    swing0: 0, spread0: 0, elbow0: 0, swing1: 0, spread1: 0, elbow1: 0, grip: 0, twist: 0,
  };
  const ground = [foot(), foot()]; // where the ankles belong on the ground (x aside, y up, z ahead of the root)
  const body = [foot(), foot()]; // where they belong off it (from each hip joint, in the pelvis's frame)
  const air = { pose: { ...AFLOAT.pose }, feet: [foot(), foot()] }; // scratch: the leap, blended
  const blow = { ...WINDUP }; // scratch: the swing, blended
  const toil = { ...HOE_UP }; // scratch: field work, blended
  const step = { along: 0, up: 0, pitch: 0 }; // scratch: one foot's place in the stride
  const seat = [foot(), foot()]; // scratch: the seated feet, laid to the ground's tilt

  let clock = 0;
  let phase = 0; // the stride, 0..1: foot 0 lands at 0, foot 1 at 0.5
  let wAir = 0; // eased weights of the layers
  let wRoll = 0;
  let wBlow = 0;
  let load = 0; // knees loading before a leap
  let blowT = 1; // how far through the swing, held at the end while it fades
  let blowKind = 0; // which swing: 0 chop, 1 backhand, 2 sweep
  let wWork = 0; // eased weight of the field-work layer
  let wGrasp = 0; // eased weight of the off hand on the hoe's shaft
  let workBeat = 0; // how far through the current stroke, 0..1, held while the layer fades
  let workKind = 'till';
  let lastVx = 0;
  let lastVz = 0;

  const bounce = { x: 0, v: 0 }; // the pelvis riding its knees: landings sink it
  const leanF = { x: 0, v: 0 }; // lean from speeding up and slowing down
  const leanS = { x: 0, v: 0 }; // bank from turning
  const reelF = { x: 0, v: 0 }; // reeling from a blow, fore-and-aft
  const reelS = { x: 0, v: 0 }; // ...and sideways
  const sprung = {};
  for (const k of SPRUNG) sprung[k] = { x: 0, v: 0 };

  const toPelvis = new THREE.Matrix4();
  const v3 = new THREE.Vector3();
  const toShaft = new THREE.Matrix4();
  const armFrame = new THREE.Matrix4();
  const turn4 = new THREE.Matrix4();
  const graspQ = new THREE.Quaternion();
  const target = new THREE.Vector3();
  const reachA = new THREE.Vector3();
  const reachB = new THREE.Vector3();
  const reachC = new THREE.Vector3();
  const pole = new THREE.Vector3();
  const poleC = new THREE.Vector3();

  // One foot's place in the stride at cycle position ph. While planted
  // (ph < duty) the ground carries it back under the body at the body's own
  // pace — that is what keeps a foot from skating — landing `lead` of its
  // travel ahead of the hip, and the heel peels up into the toe-off. Swinging
  // through, it leaves at that pace, reaches ahead, and is drawn back to
  // ground speed by the moment it lands.
  function footInStride(ph, duty, travel, lead, lift, toeOff, heelStrike) {
    if (ph < duty) {
      const u = ph / duty;
      const peel = toeOff * smooth(u, 0.5, 1);
      step.along = travel * (lead - u) + RIG.ball * (1 - Math.cos(peel));
      step.up = RIG.ball * Math.sin(peel);
      step.pitch = peel - heelStrike * (1 - smooth(u, 0, 0.3));
    } else {
      const w = (ph - duty) / (1 - duty);
      const w2 = w * w;
      const w3 = w2 * w;
      const from = travel * (lead - 1);
      const to = travel * lead;
      const pace = (-travel * (1 - duty)) / duty; // the ground's pace, in swing time
      // the sole levels out of the toe-off and cocks up for the landing; the
      // ankle rides the swing's arc plus whatever the toes still point down
      step.pitch = lerp(toeOff, -heelStrike, smooth(w, 0.1, 0.85));
      const peel = Math.max(step.pitch, 0);
      step.along =
        (2 * w3 - 3 * w2 + 1) * from + (w3 - 2 * w2 + w) * pace * 0.5 +
        (3 * w2 - 2 * w3) * to + (w3 - w2) * pace * 0.8 +
        RIG.ball * (1 - Math.cos(peel));
      step.up = lift * Math.sin(Math.PI * Math.pow(w, 0.75)) + RIG.ball * Math.sin(peel);
    }
  }

  // Two bones and a target: aim the thigh and bend the knee so the ankle
  // lands on (tx, ty, tz), measured from the hip joint in the pelvis's frame;
  // then turn the foot so its sole lies at solePitch whatever the leg did.
  function solveLeg(leg, tx, ty, tz, solePitch) {
    ty = Math.min(ty, -0.05);
    const down = Math.hypot(tx, ty);
    const d = clamp(Math.hypot(down, tz), 0.16, LEG * 0.998); // never quite locked straight
    const knee = Math.PI - Math.acos(clamp((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2), -1, 1));
    const fold = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
    const hip = -(Math.atan2(tz, down) + fold); // the knee leads: thigh ahead of the hip→ankle line
    leg.thigh.rotation.set(hip, 0, Math.atan2(tx, -ty));
    leg.shin.rotation.x = knee;
    leg.foot.rotation.x = solePitch - hip - knee;
  }

  // The off hand takes the hoe's shaft: find the spot RIG.hoeOffHand along
  // the shaft from the stick fist (up it, toward the end), in the chest's
  // frame, and turn arm 0 so its fist lands there. The elbow bends by the
  // distance; the shoulder turns the bent arm onto the spot with the elbow
  // hanging down and out, as an elbow does — a whole turn, the upper arm's
  // own twist included, which no pose channel has. w blends it over the
  // pose, so the hand reaches for the shaft and lets go.
  function graspShaft(w) {
    const a1 = m.arms[1];
    for (const o of [a1.upper, a1.fore, m.grip, m.hold]) o.updateMatrix();
    toShaft.multiplyMatrices(a1.upper.matrix, a1.fore.matrix).multiply(m.grip.matrix).multiply(m.hold.matrix);
    v3.set(0, -RIG.hoeOffHand, 0).applyMatrix4(toShaft);
    target.set(v3.x + RIG.shoulderX, v3.y - RIG.shoulderY, v3.z); // from the off shoulder
    const U = RIG.upperArm;
    const F = RIG.forearm;
    const d = clamp(target.length(), Math.abs(U - F) + 0.01, U + F - 0.001); // out of reach: reach straight for it
    const elbow = -Math.acos(clamp((d * d - U * U - F * F) / (2 * U * F), -1, 1)); // bent forward
    // the fist and the elbow in the unturned arm's frame...
    reachA.set(0, -U - F * Math.cos(elbow), -F * Math.sin(elbow)).normalize();
    reachB.set(0, -1, 0).addScaledVector(reachA, reachA.y).normalize(); // toward the elbow, square to the reach
    reachC.crossVectors(reachA, reachB);
    armFrame.makeBasis(reachA, reachB, reachC).transpose();
    // ...and where they belong: the fist on the spot, the elbow toward the pole
    target.normalize();
    pole.copy(ELBOW_POLE).addScaledVector(target, -ELBOW_POLE.dot(target)).normalize();
    poleC.crossVectors(target, pole);
    turn4.makeBasis(target, pole, poleC).multiply(armFrame);
    graspQ.setFromRotationMatrix(turn4);
    const arm = m.arms[0];
    arm.upper.quaternion.slerp(graspQ, w);
    arm.fore.rotation.x = lerp(arm.fore.rotation.x, elbow, w);
  }

  function update(dt, pl) {
    if (!(dt > 0)) return; // a zero-length step moves nothing
    clock += dt;

    // ---- what the body is doing, in its own frame (z ahead, x to side 1) ----
    const sin = Math.sin(pl.facing);
    const cos = Math.cos(pl.facing);
    const vF = pl.vel.x * sin + pl.vel.y * cos; // Vector2.y holds z
    const vS = pl.vel.x * cos - pl.vel.y * sin;
    const speed = Math.hypot(vF, vS);
    const dirF = speed > 0.05 ? vF / speed : 1;
    const dirS = speed > 0.05 ? vS / speed : 0;
    const slopeF = pl.airborne ? 0 : pl.slope.x * sin + pl.slope.z * cos; // the ground's rise per unit ahead
    const slopeS = pl.airborne ? 0 : pl.slope.x * cos - pl.slope.z * sin;
    const lie = pl.lie01;
    const crouch = pl.crouch01;

    // the push he feels: speeding up, slowing, and the pull of a turn
    const ax = clamp((pl.vel.x - lastVx) / dt, -45, 45);
    const az = clamp((pl.vel.y - lastVz) / dt, -45, 45);
    const aF = ax * sin + az * cos;
    const aS = ax * cos - az * sin;
    lastVx = pl.vel.x;
    lastVz = pl.vel.y;
    const onFeet = pl.airborne || pl.mode === 'roll' ? 0 : 1;
    chase(leanF, clamp(aF * 0.011, -0.3, 0.3) * onFeet, 11, 0.7, dt);
    chase(leanS, clamp(-aS * 0.009, -0.28, 0.28) * onFeet, 11, 0.7, dt);
    chase(bounce, 0, 15, 0.7, dt);
    if (bounce.x < -0.26) bounce.x = -0.26; // the knees only fold so far
    chase(reelF, 0, 14, 0.45, dt);
    chase(reelS, 0, 14, 0.45, dt);

    // ---- the layers' weights ----
    wAir = ease(wAir, pl.airborne ? 1 : 0, pl.airborne ? 16 : 26, dt);
    wRoll = ease(wRoll, pl.mode === 'roll' ? 1 : 0, pl.mode === 'roll' ? 30 : 11, dt);
    wBlow = ease(wBlow, pl.mode === 'attack' ? 1 : 0, pl.mode === 'attack' ? 45 : 9, dt);
    load = ease(load, pl.jumpIn > 0 ? 1 : 0, pl.jumpIn > 0 ? 35 : 20, dt);
    if (pl.mode === 'attack') {
      blowT = Math.min(pl.modeT / P.attackDuration, 1);
      blowKind = pl.swing % SWINGS.length;
    }
    wWork = ease(wWork, pl.mode === 'work' ? 1 : 0, pl.mode === 'work' ? 16 : 9, dt);
    const hoeing = pl.mode === 'work' && m.tools.hoe.visible;
    wGrasp = ease(wGrasp, hoeing ? 1 : 0, hoeing ? 14 : 18, dt);
    if (pl.mode === 'work') {
      workBeat = (pl.modeT / CONFIG.farm.strokeTime) % 1;
      workKind = pl.work.kind;
    }

    // ---- the stride ----
    const g = smooth(speed, 0.15, 1.1); // 0 standing … 1 in stride
    const run = smooth(speed, 1.8, 4.4) * g; // 0 walking … 1 running, both feet off the ground between steps
    const sprint = smooth(speed, P.walkSpeed * 1.05, P.walkSpeed * P.sprintMult);
    const cycle = 2 / (2.8 + 0.3 * speed); // seconds for both feet to step: short legs, quick steps
    const duty = 0.62 - 0.36 * run - 0.06 * sprint; // share of the cycle each foot is planted
    const lead = lerp(0.5, 0.36, run); // a runner lands nearly under himself and pushes off far behind
    const stepWas = Math.floor(phase * 2); // foot 0 lands as the phase comes round, foot 1 at the half
    phase = (phase + dt / cycle) % 1;
    // a foot has just come down: tell whoever is listening how hard (0 a creep … 1 a sprint)
    if (Math.floor(phase * 2) !== stepWas && g > 0.6 && !pl.airborne && pl.mode !== 'roll' && lie < 0.01) {
      pl.onFootstep(clamp(0.35 + 0.35 * run + 0.3 * sprint - 0.2 * crouch, 0.1, 1));
    }

    const ahead = Math.max(dirF, 0); // toes only roll when the stride goes forward
    const toeOff = g * ahead * lerp(0.5, 0.85, run);
    const heelStrike = g * ahead * lerp(0.3, 0.08, run);
    const lift = g * (lerp(0.07, 0.2, run) + 0.05 * sprint - 0.02 * crouch);
    const width = lerp(0.125, 0.075, run) + 0.03 * crouch; // a runner's feet fall nearly in one line

    const slopeDrop = Math.min(0.1, Math.abs(slopeF) * 0.22 + Math.abs(slopeS) * 0.15); // knees soften on a hill
    const stance = 0.2 * crouch + 0.03 * g + slopeDrop + 0.13 * load; // the pelvis below standing height
    // how far a planted foot travels under the body: the ground covered while
    // it is down, held to what the leg can reach from this height — ahead with
    // the sole flat, behind with the heel peeled up
    const hipUp = HIP_HEIGHT - stance - RIG.ankle;
    const reachAhead = Math.sqrt(Math.max(0.0004, REACH2 - hipUp * hipUp));
    const reachBehind = Math.sqrt(Math.max(0.0004, REACH2 - (hipUp - RIG.ball * Math.sin(toeOff)) ** 2));
    const travel = Math.min(speed * duty * cycle, reachAhead / lead, reachBehind / (1 - lead));

    for (let i = 0; i < 2; i++) {
      const side = i ? 1 : -1;
      footInStride((phase + i * 0.5) % 1, duty, travel, lead, lift, toeOff, heelStrike);
      const f = ground[i];
      f.x = side * width + dirS * step.along;
      f.z = dirF * step.along - side * 0.035 * (1 - g); // at rest, one foot a little ahead
      f.y = RIG.ankle + step.up + slopeF * f.z + slopeS * f.x;
      f.pitch = step.pitch - Math.atan(slopeF);
    }

    // the pelvis rides the stride: a run sinks onto each planted leg and
    // floats between them, a walk vaults over the leg instead
    const midStance = phase - duty * 0.5;
    const beat = Math.cos(2 * TAU * midStance); // +1 over each planted foot, −1 between
    const sway = Math.cos(TAU * midStance); // +1 over foot 0, −1 over foot 1
    const idle = 1 - g;
    const breath = Math.sin(clock * 1.7);
    const shiftIdle = Math.sin(clock * 0.47) * 0.014 * idle; // weight wandering from foot to foot

    pose.drop = stance - g * beat * lerp(0.016, -0.016, run) - breath * 0.003 * idle;
    pose.pitch = 0.1 * run + 0.09 * sprint * g + 0.12 * crouch + 0.1 * load +
      clamp(slopeF, -0.4, 0.4) * 0.3 + leanF.x;
    pose.bank = leanS.x;
    pose.shift = -g * sway * lerp(0.02, 0.008, run) + shiftIdle;
    pose.hipYaw = g * dirF * lerp(0.07, 0.14, run) * Math.cos(TAU * phase); // the striding hip leads
    pose.hipRoll = -g * sway * 0.045 + shiftIdle * 1.2; // the swinging side hangs
    pose.chestPitch = 0.05 * run + 0.3 * crouch + 0.2 * load + breath * 0.014 * idle;
    pose.chestYaw = -1.6 * pose.hipYaw; // shoulders turn against the hips
    pose.chestRoll = -0.8 * pose.hipRoll + pose.bank * 0.3;
    // the head stays level over a leaning body and looks into a turn; at rest it wanders
    pose.headPitch = -0.7 * (pose.pitch + pose.chestPitch) + 0.1 * crouch;
    pose.headYaw = -0.8 * (pose.hipYaw + pose.chestYaw) + clamp(pl.turnRate * 0.05, -0.45, 0.45) +
      idle * (Math.sin(clock * 0.23) * 0.16 + Math.sin(clock * 0.71 + 2) * 0.06);

    // arms swing against the legs, a touch early (the springs delay them),
    // and fold at the elbow as the pace rises
    const pump = Math.cos(TAU * (phase + 0.07)); // +1 as foot 0 reaches forward
    const reachArm = g * lerp(0.4, 0.85, run);
    const bend = lerp(0.2, 1.3, run) + 0.45 * crouch;
    pose.swing0 = reachArm * pump - 0.1 * run - 0.2 * crouch + breath * 0.02 * idle;
    pose.elbow0 = -Math.max(0.08, bend - 0.25 * g * pump);
    pose.spread0 = -(0.08 + 0.08 * run + 0.05 * crouch + breath * 0.008 * idle);
    // the stick arm carries more than it pumps: a shorter swing, a lower hand
    pose.swing1 = -0.55 * reachArm * pump - 0.2 * crouch - breath * 0.02 * idle;
    pose.elbow1 = -Math.max(0.08, 0.6 * bend + 0.15 + 0.3 * crouch + 0.15 * g * pump); // the elbow keeps the stick's tip off the ground
    pose.spread1 = 0.1 + 0.08 * run + 0.05 * crouch + breath * 0.008 * idle;
    // the stick keeps its own line as far as the wrist allows: carried at his
    // side pointing down ahead of him, coming up level as he runs. Its line
    // is the forearm's plus the wrist's, less the hold across the fist.
    const stickLine = lerp(-1.0, -1.5, run);
    pose.grip = clamp(stickLine - (pose.swing1 + pose.elbow1) + RIG.hold, WRIST.back, WRIST.snap);
    pose.twist = 0;

    // ---- the swing: wound up, landed, carried through ----
    if (wBlow > 0.001) {
      // the springs carry the arm a few hundredths late, so the pose lands at
      // 50% for the blow to arrive as player.js counts the hit, at 55%
      const strike = (blowT - 0.26) / 0.24;
      const [windup, impact, follow] = SWINGS[blowKind];
      if (strike <= 0) {
        mix(blow, windup, 1);
      } else if (strike < 1) {
        mix(blow, windup, 1);
        mix(blow, impact, strike * strike); // gathering pace into the blow
      } else {
        const through = (blowT - 0.5) / 0.5;
        mix(blow, impact, 1);
        mix(blow, follow, 1 - (1 - through) * (1 - through));
      }
      const dropWas = pose.drop;
      mix(pose, blow, wBlow);
      pose.drop = dropWas + blow.drop * wBlow; // he sinks into it from wherever he stood
      ground[0].z += 0.1 * wBlow * smooth(blowT, 0.2, 0.6); // the off foot steps into the blow
    }

    // ---- field work: drawn back, struck, drawn back again ----
    if (wWork > 0.001) {
      // the pose is struck by 55% of each beat so that, a few hundredths late
      // through the springs, it lands as player.js counts the stroke at 60%;
      // held a moment in the earth, then drawn back for the next
      const [drawn, struck] = WORK[workKind];
      const strike = smooth(workBeat, 0.3, 0.55) * (1 - smooth(workBeat, 0.72, 1));
      mix(toil, drawn, 1);
      mix(toil, struck, strike);
      const dropWas = pose.drop;
      mix(pose, toil, wWork);
      pose.drop = dropWas + toil.drop * wWork; // he sinks into it from wherever he stood
    }

    // ---- sat by the fire: breathing slow, and now and then rubbing his hands ----
    const sit = pl.sit01;
    if (sit > 0.001) {
      mix(pose, SEAT.pose, sit);
      const rub = smooth(Math.sin(clock * 0.55), 0.6, 0.9); // a few seconds' rub, every eleven or so
      const scrub = Math.sin(clock * 11) * 0.07 * rub;
      pose.chestPitch += breath * 0.02 * sit;
      pose.headYaw += Math.sin(clock * 0.3) * 0.12 * sit; // gazing about the flames
      pose.swing0 += (scrub + breath * 0.02) * sit;
      pose.swing1 += (-scrub + breath * 0.02) * sit;
      pose.spread0 += 0.14 * rub * sit; // the hands come together to rub
      pose.spread1 -= 0.14 * rub * sit;
      for (let i = 0; i < 2; i++) {
        const f = SEAT.feet[i];
        const s0 = seat[i];
        s0.x = f.x;
        s0.z = f.z;
        s0.y = RIG.ankle + slopeF * f.z + slopeS * f.x;
        s0.pitch = f.pitch - Math.atan(slopeF);
      }
      mixFeet(ground, seat, sit);
    }

    // ---- the leap ----
    let bodyFeet = 0; // how far the feet have left the ground's keeping
    for (let i = 0; i < 2; i++) mix(body[i], REACH.feet[i], 1);
    if (wAir > 0.001) {
      const rise = clamp(pl.vy / P.jumpSpeed, -1.2, 1); // 1 leaving the ground, 0 at the top, −1 coming down
      const launch = smooth(rise, 0.35, 0.95);
      const reachDown = smooth(-rise, 0, 0.8);
      mix(air.pose, AFLOAT.pose, 1);
      mixFeet(air.feet, AFLOAT.feet, 1);
      mix(air.pose, LAUNCH.pose, launch);
      mixFeet(air.feet, LAUNCH.feet, launch);
      mix(air.pose, REACH.pose, reachDown);
      mixFeet(air.feet, REACH.feet, reachDown);
      mix(pose, air.pose, wAir);
      mixFeet(body, air.feet, 1);
      bodyFeet = wAir;
    }

    // ---- the roll ----
    let turn = 0; // the somersault, laid straight onto the waist
    if (wRoll > 0.001) {
      if (pl.mode === 'roll') {
        // one whole turn, a little quicker through the middle; once the roll
        // is over he is upright again and only the tuck is left to fade
        const u = Math.min(pl.modeT / P.dodgeDuration, 1);
        turn = TAU * (0.5 * u + 0.5 * u * u * (3 - 2 * u));
      }
      mix(pose, TUCK.pose, wRoll);
      // the waist rides low, and a little higher as the shoulders go under
      pose.drop += (0.26 - 0.1 * (1 - Math.cos(turn)) - pose.drop) * wRoll;
      mixFeet(body, TUCK.feet, wRoll / Math.max(wRoll + bodyFeet, 1e-3));
      bodyFeet = 1 - (1 - bodyFeet) * (1 - wRoll);
    }

    // ---- asleep ----
    if (lie > 0.001) {
      mix(pose, ABED.pose, lie);
      pose.swing0 += breath * 0.024 * lie;
      pose.swing1 += breath * 0.024 * lie;
      mixFeet(body, ABED.feet, lie / Math.max(lie + bodyFeet, 1e-3));
      bodyFeet = 1 - (1 - bodyFeet) * (1 - lie);
    }

    // reeling from a blow, on top of whatever he was doing
    pose.chestPitch += reelF.x;
    pose.chestRoll += reelS.x;
    pose.headPitch += reelF.x * 0.6;

    // ---- arms, chest and head arrive a beat late; a swing is crisp, work firm ----
    const stiff = lerp(40, 90, Math.max(wBlow, wWork * 0.5));
    for (const k of SPRUNG) pose[k] = chase(sprung[k], pose[k], stiff, 0.75, dt);

    // ---- lay the pose on the rig ----
    const standY = RIG.waist - pose.drop + bounce.x;
    const leanX = pose.pitch * (1 - lie) - (Math.PI / 2) * lie; // lying back onto the pillow
    m.roller.position.set(pose.shift, lerp(standY, pl.restY + breath * 0.012, lie), 0);
    m.roller.rotation.set(leanX + turn, 0, pose.bank);
    m.hips.rotation.set(0, pose.hipYaw, pose.hipRoll);
    m.chest.rotation.set(pose.chestPitch, pose.chestYaw, pose.chestRoll);
    m.head.rotation.set(pose.headPitch, pose.headYaw, 0);
    m.arms[0].upper.rotation.set(pose.swing0, 0, pose.spread0);
    m.arms[0].fore.rotation.x = pose.elbow0;
    m.arms[1].upper.rotation.set(pose.swing1, 0, pose.spread1);
    m.arms[1].fore.rotation.x = pose.elbow1;
    // the springs can carry the wrist a hair past its reach; the stick and
    // the hoe never go there (the sickle keeps its own line down the arm)
    const held = (m.weapon.visible && m.slot.visible) || m.tools.hoe.visible;
    m.grip.rotation.set(held ? clamp(pose.grip, WRIST.back, WRIST.snap) : pose.grip, pose.twist, 0);
    if (wGrasp > 0.001) graspShaft(wGrasp);

    // feet: the ground's targets carried into the pelvis's frame, the body's
    // own targets already there — and the knees solved to reach the blend
    m.roller.updateMatrix();
    m.hips.updateMatrix();
    toPelvis.multiplyMatrices(m.roller.matrix, m.hips.matrix).invert();
    for (let i = 0; i < 2; i++) {
      const g0 = ground[i];
      const b0 = body[i];
      v3.set(g0.x, g0.y, g0.z).applyMatrix4(toPelvis);
      solveLeg(
        m.legs[i],
        lerp(v3.x - (i ? RIG.hipX : -RIG.hipX), b0.x, bodyFeet),
        lerp(v3.y, b0.y, bodyFeet),
        lerp(v3.z, b0.z, bodyFeet),
        lerp(g0.pitch - leanX, b0.pitch, bodyFeet)
      );
    }
  }

  return {
    update,
    // touchdown at this downward speed: the knees take it, the chest nods
    land(impact) {
      bounce.v -= impact * 0.75;
      reelF.v += impact * 0.2;
    },
    // shoved along (dx, dz) in the world: the body goes, the shoulders lag
    reel(dx, dz, facing, vel) {
      const sin = Math.sin(facing);
      const cos = Math.cos(facing);
      reelF.v -= (dx * sin + dz * cos) * 6;
      reelS.v += (dx * cos - dz * sin) * 6;
      lastVx = vel.x; // the shove itself is not his own push — keep it out of the lean
      lastVz = vel.y;
    },
    // stand him up fresh (respawn): no leftover lean, sink or half-blended layer
    reset() {
      wAir = wRoll = wBlow = wWork = wGrasp = load = 0;
      blowT = 1;
      lastVx = lastVz = 0;
      for (const s of [bounce, leanF, leanS, reelF, reelS]) s.x = s.v = 0;
      for (const k of SPRUNG) sprung[k].x = sprung[k].v = 0;
    },
  };
}
