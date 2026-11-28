import * as THREE from 'three';
import { mesh, bake, tone, makeRng } from './meshUtils.js';
import { WOOD_DARK, WOOD, WOOD_PALE, STRAW, IRON, ROPE, box, cyl, boards, sack, villagerHead, villagerArm, villagerRobe } from './kit.js';
import { makeAlive } from './alive.js';
import { CONFIG } from '../state/config.js';
import { ROAD_IN, ROAD_OUT, SETTLE, PHASES, cartDay, timetable, secondsOfDay } from './cartday.js';

const CANVAS = 0xd8cfae;
const CLAY = 0x9c5e3c;
const MULE = 0x8a7a68;
const MULE_DARK = 0x5c5045;
const HOOD = 0x6e3b2c; // road-worn madder red
const GOWN = 0x74562e; // russet wool
const APRON = 0xd8cfae; // undyed linen
const LINEN = 0xe9e2cf; // her wimple, fresh this morning
const SKIN = 0xd3a877;
const RUG_RED = 0x8a3a2a;

const WHEEL_R = 0.5;
const STRIDE = 0.62; // ground the mule covers in one full round of his four feet

// Where she stands, in the cart's own frame (+x the mule's way, she on -z):
// at the mule's head with a hand on his cheek-strap while they walk, and
// beside the wares facing the path while the stall is open. `turn` is her
// figure's rotation.y (the figure itself faces its own +x).
const LEAD = { x: 2.4, z: -0.48, turn: 0 };
const STALL = { x: -0.3, z: -1.05, turn: Math.PI / 2 };
const BRIDLE = new THREE.Vector3(2.62, 1.2, -0.08); // the mule's cheek-strap

// a spoked cart wheel facing along z, in a Group of its own so it can turn
function wheel(x, y, z) {
  const w = new THREE.Group();
  w.position.set(x, y, z);
  w.add(mesh(new THREE.TorusGeometry(WHEEL_R, 0.055, 5, 12), WOOD_DARK));
  for (let i = 0; i < 4; i++) w.add(mesh(box(0.05, 0.94, 0.05), tone(WOOD, 0.9), { rz: (i * Math.PI) / 4 }));
  w.add(mesh(cyl(0.11, 0.11, 0.18, 8), WOOD_PALE, { rx: Math.PI / 2 }));
  w.add(mesh(cyl(0.04, 0.04, 0.22, 6), IRON, { rx: Math.PI / 2 }));
  return w;
}

// An arm hung from its shoulder: the pivot is the shoulder, the hand hangs
// straight down at rest, and the pivot's quaternion aims it (see `aim`).
function shoulder(sleeve, x, y, z) {
  const s = new THREE.Group();
  s.position.set(x, y, z);
  s.add(villagerArm({ sleeve, skin: SKIN, y: -0.2, rz: Math.PI }));
  return s;
}
const DOWN = new THREE.Vector3(0, -1, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);
const ARM = 0.42; // shoulder to the heel of the hand
const aim = (x, y, z) => new THREE.Quaternion().setFromUnitVectors(DOWN, new THREE.Vector3(x, y, z).normalize());

// The chapwoman: a russet gown and a linen apron, a madder hood over a white
// wimple, a purse at her belt. Mute for now; v2 gives her words. Her figure
// faces its own +x; the robe stands still, the rest breathes; the head is its
// own pivot. `near` is the arm on her +z side, `far` the other.
function buildChapwoman() {
  const figure = new THREE.Group();
  figure.rotation.order = 'YXZ'; // turned, then rolled about her own facing as she walks
  villagerRobe(figure, { robe: GOWN, belt: WOOD_DARK, girth: 1.03 });
  figure.add(mesh(box(0.06, 0.58, 0.26), APRON, { x: 0.2, y: 0.36 }));
  figure.add(mesh(box(0.065, 0.045, 0.34), tone(APRON, 0.85), { x: 0.205, y: 0.645 })); // the apron's tie
  figure.add(mesh(box(0.11, 0.13, 0.06), 0x5a4028, { x: 0.04, y: 0.57, z: -0.21 })); // her purse

  const sway = new THREE.Group();
  sway.position.set(0, 0.78, 0);
  sway.add(mesh(cyl(0.15, 0.175, 0.34, 8), GOWN, { y: 0.12 }));
  sway.add(mesh(box(0.05, 0.24, 0.2), APRON, { x: 0.148, y: 0.08 })); // the bib
  sway.add(mesh(cyl(0.12, 0.2, 0.12, 8), HOOD, { y: 0.27 })); // the hood's shoulder cape
  const head = villagerHead({ skin: SKIN, brow: 0x5a3a24, r: 0.125 });
  head.position.set(0, 0.42, 0);
  // the wimple: linen under the chin and close about the face
  head.add(mesh(box(0.13, 0.05, 0.24), LINEN, { x: 0.035, y: -0.12 }));
  for (const s of [-1, 1]) head.add(mesh(box(0.15, 0.2, 0.03), LINEN, { x: 0.01, y: -0.03, z: s * 0.122 }));
  head.add(mesh(box(0.04, 0.035, 0.22), LINEN, { x: 0.112, y: 0.07, shadow: false })); // the band at her brow
  // and the road hood over it, peaked, its lip shading her eyes
  head.add(mesh(new THREE.ConeGeometry(0.17, 0.28, 7), HOOD, { y: 0.19 }));
  head.add(mesh(box(0.05, 0.04, 0.22), HOOD, { x: 0.135, y: 0.1, shadow: false }));
  head.add(mesh(box(0.12, 0.24, 0.29), HOOD, { x: -0.075, y: -0.02 })); // its drape over ears and nape
  sway.add(head);
  const near = shoulder(GOWN, 0, 0.25, 0.19);
  const far = shoulder(GOWN, 0, 0.25, -0.19);
  sway.add(near, far);
  // the staff she walks with, gripped in the far hand (placed each frame)
  const staff = new THREE.Group();
  staff.add(mesh(box(0.045, 1.5, 0.045), WOOD_DARK, { y: 0.12 }));
  staff.add(mesh(cyl(0.05, 0.05, 0.1, 6), ROPE, { y: 0.0 })); // a grip of cord where her hand goes
  sway.add(staff);
  figure.add(sway);
  return { figure, sway, head, near, far, staff };
}

// The cart: a two-wheeled peddler's cart under a striped awning, the mule in
// the shafts, the chapwoman beside it. Local +x is where the mule points.
// Every part that moves on the road is a Group of its own (bake keeps them).
function buildCart() {
  const g = new THREE.Group();
  g.rotation.order = 'YZX'; // turn, then pitch nose-up, then roll — the road's own slope
  const rng = makeRng(505);
  const add = (geo, color, opts) => g.add(mesh(geo, color, opts));

  // bed, boarded sides, head/tail boards
  add(box(2.0, 0.12, 1.25), WOOD, { y: 0.82 });
  for (const s of [-1, 1]) {
    add(box(2.0, 0.3, 0.05), tone(WOOD_DARK, 0.9), { y: 1.03, z: s * 0.6 });
    boards(g, rng, { axis: 'z', at: s * 0.635, from: -1.0, to: 1.0, y0: 0.88, y1: 1.18, color: WOOD_PALE, thick: 0.03, width: 0.33 });
    add(box(2.06, 0.05, 0.09), WOOD_DARK, { y: 1.2, z: s * 0.62 }); // top rail
  }
  add(box(0.08, 0.34, 1.25), WOOD_PALE, { x: 0.98, y: 1.05 });
  add(box(0.08, 0.34, 1.25), WOOD_PALE, { x: -0.98, y: 1.05 });

  // one axle, two tall spoked wheels that turn as she walks
  add(cyl(0.05, 0.05, 1.7, 6), WOOD_DARK, { x: -0.1, y: 0.55, rx: Math.PI / 2 });
  const wheels = [wheel(-0.1, 0.55, 0.82), wheel(-0.1, 0.55, -0.82)];
  g.add(...wheels);
  // the prop that holds the bed level while she trades (stowed on the road)
  const prop = new THREE.Group();
  prop.add(mesh(box(0.07, 0.42, 0.07), WOOD_DARK, { x: -0.85, y: 0.5, rz: 0.12 }));
  g.add(prop);

  // shafts reaching forward to the mule
  add(box(1.5, 0.06, 0.06), WOOD_DARK, { x: 1.6, y: 0.72, z: 0.4, rz: -0.05 });
  add(box(1.5, 0.06, 0.06), WOOD_DARK, { x: 1.6, y: 0.72, z: -0.4, rz: -0.05 });

  // striped awning on four posts over the rear of the bed
  for (const [px, pz] of [[-0.95, -0.58], [-0.95, 0.58], [0.5, -0.58], [0.5, 0.58]]) {
    add(box(0.05, 0.75, 0.05), WOOD_DARK, { x: px, y: 1.32, z: pz });
  }
  for (let i = 0; i < 6; i++) {
    const sx = -1.095 + 0.292 * (i + 0.5);
    const stripe = i % 2 ? HOOD : CANVAS;
    add(box(0.292, 0.05, 1.5), stripe, { x: sx, y: 1.74 + (sx + 0.22) * 0.05, rz: 0.05 });
    for (const s of [-1, 1]) add(box(0.292, 0.11, 0.025), tone(stripe, 0.9), { x: sx, y: 1.68 + (sx + 0.22) * 0.05, z: s * 0.75, rz: 0.05, shadow: false }); // valance
  }

  // wares: crates, a grain sack, a rolled rug, bolts of cloth, pots, bread
  add(box(0.4, 0.34, 0.4), WOOD_PALE, { x: -0.55, y: 1.05, z: 0.25 });
  add(box(0.42, 0.04, 0.42), WOOD_DARK, { x: -0.55, y: 1.14, z: 0.25, shadow: false });
  add(box(0.32, 0.26, 0.32), WOOD_PALE, { x: -0.5, y: 1.01, z: -0.32, ry: 0.4 });
  sack(g, { x: 0.15, y: 0.86, z: 0.3, r: 0.24, color: STRAW, lean: 0.2 });
  add(cyl(0.12, 0.12, 0.7, 7), RUG_RED, { x: 0.2, y: 1.0, z: -0.25, rx: Math.PI / 2, ry: 0.2 });
  add(cyl(0.08, 0.08, 0.55, 6), 0x4c5a36, { x: 0.45, y: 0.97, z: -0.2, rx: Math.PI / 2, ry: -0.15 });
  add(cyl(0.07, 0.07, 0.5, 6), 0xb99a4a, { x: 0.36, y: 1.1, z: -0.24, rx: Math.PI / 2, ry: 0.05 });
  add(cyl(0.08, 0.1, 0.16, 7), CLAY, { x: -1.06, y: 1.12, z: 0.2 });
  add(cyl(0.07, 0.09, 0.14, 7), CLAY, { x: -1.06, y: 1.1, z: -0.15 });
  add(cyl(0.17, 0.13, 0.1, 8), 0x9a7a44, { x: 0.68, y: 0.93, z: 0.28 }); // a basket of loaves
  for (const [lx, lz] of [[0.63, 0.24], [0.74, 0.3], [0.68, 0.34]]) {
    const loaf = mesh(new THREE.SphereGeometry(0.07, 6, 5), 0xa9763e, { x: lx, y: 1.0, z: lz });
    loaf.scale.set(1.2, 0.6, 0.9);
    g.add(loaf);
  }
  // a candle lantern hung from the awning post
  add(box(0.015, 0.16, 0.015), IRON, { x: 0.5, y: 1.56, z: -0.66, shadow: false });
  add(box(0.09, 0.13, 0.09), IRON, { x: 0.5, y: 1.42, z: -0.66 });
  const candle = new THREE.Mesh(box(0.045, 0.07, 0.045), new THREE.MeshBasicMaterial({ color: 0xffd66e }));
  candle.position.set(0.5, 1.42, -0.66);
  g.add(candle);

  // the mule in the shafts: barrel body, pack cloth, harness
  add(cyl(0.2, 0.22, 0.86, 8), MULE, { x: 1.9, y: 0.86, rz: Math.PI / 2 });
  add(box(0.4, 0.05, 0.46), RUG_RED, { x: 1.85, y: 1.07 });
  add(box(0.05, 0.47, 0.47), MULE_DARK, { x: 2.14, y: 0.86, shadow: false }); // collar strap
  // four legs, each hung from its hip so it can swing as he walks
  const legs = [];
  for (const [lx, lz, phase] of [[1.6, -0.13, 0], [2.2, -0.13, 0.25], [1.6, 0.13, 0.5], [2.2, 0.13, 0.75]]) {
    const leg = new THREE.Group();
    leg.position.set(lx, 0.59, lz);
    leg.add(mesh(cyl(0.05, 0.036, 0.58, 5), MULE, { y: -0.29 }));
    leg.add(mesh(box(0.09, 0.07, 0.1), MULE_DARK, { y: -0.56 })); // hoof
    leg.userData.phase = phase; // a walk: hind, fore, other hind, other fore
    legs.push(leg);
  }
  g.add(...legs);
  add(box(0.18, 0.44, 0.17), MULE, { x: 2.38, y: 1.12, rz: -0.5 });
  add(box(0.04, 0.4, 0.05), MULE_DARK, { x: 2.3, y: 1.2, rz: -0.5 }); // mane
  const muleHead = new THREE.Group();
  muleHead.position.set(2.52, 1.28, 0);
  muleHead.add(mesh(box(0.36, 0.17, 0.15), MULE, { x: 0.12, y: -0.04 }));
  muleHead.add(mesh(box(0.12, 0.14, 0.13), MULE_DARK, { x: 0.3, y: -0.06 })); // muzzle
  muleHead.add(mesh(box(0.025, 0.03, 0.16), ROPE, { x: 0.1, y: -0.08, shadow: false })); // the cheek-strap she holds
  for (const s of [-1, 1]) {
    muleHead.add(mesh(new THREE.ConeGeometry(0.04, 0.24, 5), MULE_DARK, { x: -0.02, y: 0.16, z: s * 0.06, rz: 0.25, rx: s * 0.25 })); // long ears
    muleHead.add(mesh(box(0.03, 0.03, 0.012), 0x1c1612, { x: 0.14, y: 0.0, z: s * 0.078, shadow: false })); // eye
  }
  g.add(muleHead);
  const muleTail = new THREE.Group();
  muleTail.position.set(1.48, 1.0, 0);
  muleTail.add(mesh(box(0.04, 0.34, 0.04), MULE, { y: -0.17 }));
  muleTail.add(mesh(box(0.07, 0.16, 0.07), MULE_DARK, { y: -0.4 })); // the tuft he swats flies with
  g.add(muleTail);

  // her staff, leaned against the cart while she trades
  const staffLeant = new THREE.Group();
  staffLeant.add(mesh(box(0.05, 1.5, 0.05), WOOD_DARK, { x: -0.75, y: 0.72, z: -0.95, rz: 0.18 }));
  staffLeant.add(mesh(cyl(0.05, 0.05, 0.1, 6), ROPE, { x: -0.86, y: 1.3, z: -0.95, rz: 0.18 }));
  g.add(staffLeant);

  const her = buildChapwoman();
  g.add(her.figure);

  bake(g);
  return { group: g, wheels, prop, legs, muleHead, muleTail, staffLeant, her };
}

const smooth = (k) => {
  const t = Math.min(1, Math.max(0, k));
  return t * t * (3 - 2 * t);
};
function lerpAngle(a, b, k) {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * k;
}

// Her few steps between the mule's head and her place by the wares, k 0→1:
// she turns to go, walks, and turns to face what she came for.
function steps(from, to, k) {
  const go = Math.atan2(-(to.z - from.z), to.x - from.x);
  if (k < 0.2) return { x: from.x, z: from.z, turn: lerpAngle(from.turn, go, smooth(k / 0.2)), walking: false };
  if (k < 0.8) {
    const u = smooth((k - 0.2) / 0.6);
    return { x: from.x + (to.x - from.x) * u, z: from.z + (to.z - from.z) * u, turn: go, walking: true };
  }
  return { x: to.x, z: to.z, turn: lerpAngle(go, to.turn, smooth((k - 0.8) / 0.2)), walking: false };
}

// how far behind her timetable she may fall (held up by him standing in the
// road, or the clock moved under her) before she is simply put where it says
const LATE = 1800;
// and how far ahead of it: the frame clock and the wall clock drift a hair
// apart over her walk, so she may step onto her pitch a moment early
const EARLY = 180;

// The chapwoman's cart, driven by the clock: where her day says she should be
// (cartday.js), walked there smoothly — up the east road and onto her pitch in
// the morning, off it and down the west road at closing.
//
// terrainHeight  the ground's height
// clock          () => Date — the moment her day is read from
// always         true: she keeps her stall at every hour (?market=1, tests)
// Returns { group, colliders, spot, chapman, update(dt, playerPos, hold),
//           phase(), present(), open(), walking(), onEvent }
export function createCart({ terrainHeight, clock, always = false }) {
  const c = buildCart();
  const her = c.her;
  const shop = { ...CONFIG.shop }; // her hours and pace, as they stood when the world was built
  const T = timetable(shop);
  const ENDS = [T.sets, T.pitched, T.opens, T.closes, T.leaves, T.gone, 86400];

  // her two colliders follow the cart: the bed, and the mule ahead of it
  const bed = { x: 1e4, z: 1e4, r: 1.5 };
  const mule = { x: 1e4, z: 1e4, r: 0.9 };
  // the shop's E: at her side of the stall, offered only while it is open
  const park = ROAD_IN.at(ROAD_IN.length);
  const spot = {
    id: 'shop',
    label: 'the chapwoman’s cart',
    x: park.x + STALL.x * Math.cos(park.rotY) + STALL.z * Math.sin(park.rotY),
    z: park.z - STALL.x * Math.sin(park.rotY) + STALL.z * Math.cos(park.rotY),
    radius: 2.4,
    off: true,
  };

  // where she is in her day: the phase's index (PHASES), seconds into it (for
  // her few steps at the pitch) and how far along the road (coming / going)
  const st = { idx: 0, t: 0, d: 0 };
  let readClock = clock;
  let hurry = 1; // tests may quicken (or still) her feet; her timetable does not change
  const api = { onEvent: null };
  const emit = (name) => api.onEvent?.(name);

  function snap(want) {
    st.idx = want.idx;
    st.t = want.t;
    st.d = PHASES[want.idx] === 'coming' ? Math.min(want.t * shop.pace, ROAD_IN.length)
      : PHASES[want.idx] === 'going' ? Math.min(want.t * shop.pace, ROAD_OUT.length) : 0;
  }

  // Bring her day into line with the clock. A little behind it she is left to
  // catch up by herself (she walks on, or starts out late), and a little ahead
  // of it she waits for it; far behind or far ahead (the clock moved), she is
  // put where it says.
  function reconcile(now, hold) {
    if (always) {
      st.idx = 3;
      return;
    }
    const want = cartDay(now, shop);
    if (want.idx === st.idx) return;
    if (st.idx === 3 && hold) return; // closing time, but he is still at her wares: she waits
    if (want.idx < st.idx && ENDS[want.idx] - now < EARLY) return; // a step ahead of the clock: let it catch her up
    if (want.idx > st.idx && now - ENDS[st.idx] < LATE) {
      if (st.idx === 0) {
        // over the world's edge she comes — late, if need be, further along
        st.idx = 1;
        st.d = Math.min((now - T.sets) * shop.pace, ROAD_IN.length);
        emit('coming');
      } else if (st.idx === 3) {
        st.idx = 4; // closing time: she packs up
        st.t = 0;
        emit('packing');
      }
      return; // coming, settling, packing and going finish by themselves
    }
    snap(want);
  }

  // what she was doing last step, for the walk's gait to ease in and out
  let gait = 0; // 0 standing … 1 walking (the mule's legs and wheels)
  let legPhase = 0;
  let wheelTurn = 0;
  let walkT = 0;
  let herStride = 0; // 0 … 1 her own bob
  let cartT = (park.x * 5.1) % Math.PI;
  const offer = { k: 0 }; // her gestures' weights at the stall
  const smoothApron = { k: 0 };

  // ahead of the mule's nose: him standing there holds her up
  function blockedBy(p, pose) {
    if (!p) return false;
    const ax = pose.x + 3.3 * Math.cos(pose.rotY) + -0.2 * Math.sin(pose.rotY);
    const az = pose.z - 3.3 * Math.sin(pose.rotY) + -0.2 * Math.cos(pose.rotY);
    return Math.hypot(p.x - ax, p.z - az) < 1.6;
  }

  function advance(dt, p) {
    let moved = 0;
    const phase = PHASES[st.idx];
    if (phase === 'coming' || phase === 'going') {
      const road = phase === 'coming' ? ROAD_IN : ROAD_OUT;
      if (!blockedBy(p, road.at(st.d))) {
        moved = Math.min(shop.pace * hurry * dt, road.length - st.d);
        st.d += moved;
      }
      if (st.d >= road.length - 1e-6) {
        if (phase === 'coming') {
          st.idx = 2; // on her pitch: she steps round to her place
          st.t = 0;
        } else {
          st.idx = 6; // gone down the west road
          emit('gone');
        }
      }
    } else if (phase === 'settling' || phase === 'packing') {
      st.t += dt * hurry;
      if (st.t >= SETTLE) {
        if (phase === 'settling') {
          st.idx = 3;
          emit('opened');
        } else {
          st.idx = 5;
          st.d = 0;
        }
      }
    }
    return moved;
  }

  const qa = new THREE.Quaternion();
  const qb = new THREE.Quaternion();
  const Q = {
    hangNear: aim(0.18, -1, 0.1),
    hangFar: aim(0.18, -1, -0.1),
    lead: null, // toward the cheek-strap, from where she walks (below)
    stallNear: aim(0.42, -0.88, -0.2), // hands together before the apron
    stallFar: aim(0.42, -0.88, 0.2),
    offer: aim(0.9, -0.2, 0.25), // holding out a ware to the path
    apron: aim(0.5, -0.8, 0.05),
  };
  {
    // from her near shoulder, standing at LEAD and facing the mule's way
    const sh = new THREE.Vector3(LEAD.x, 0.78 + 0.25, LEAD.z + 0.19);
    const to = BRIDLE.clone().sub(sh);
    Q.lead = aim(to.x, to.y, to.z);
  }
  const carry = new THREE.Vector3();
  const qSwing = new THREE.Quaternion();

  // place everything for this step
  function place(dt, moved) {
    const phase = PHASES[st.idx];
    const away = phase === 'before' || phase === 'after';
    c.group.visible = !away;
    spot.off = phase !== 'stall';
    if (away) {
      bed.x = mule.x = 1e4;
      bed.z = mule.z = 1e4;
      return;
    }
    const pose = phase === 'coming' ? ROAD_IN.at(st.d) : phase === 'going' ? ROAD_OUT.at(st.d) : park;
    const cos = Math.cos(pose.rotY);
    const sin = Math.sin(pose.rotY);
    const at = (lx, lz) => [pose.x + lx * cos + lz * sin, pose.z - lx * sin + lz * cos];
    const h = (lx, lz) => terrainHeight(...at(lx, lz));
    const back = h(-0.1, 0);
    c.group.position.set(pose.x, back, pose.z);
    c.group.rotation.set(-Math.atan((h(-0.1, 0.82) - h(-0.1, -0.82)) / 1.64), pose.rotY, Math.atan((h(1.9, 0) - back) / 2.0));
    [bed.x, bed.z] = at(0, 0);
    [mule.x, mule.z] = at(1.9, 0);

    // the road: wheels roll and the mule walks as far as the cart moved
    const rolling = moved > 1e-5;
    gait += ((rolling ? 1 : 0) - gait) * (1 - Math.exp(-dt * 8));
    legPhase = (legPhase + moved / STRIDE) % 1;
    wheelTurn -= moved / WHEEL_R;
    for (const w of c.wheels) w.rotation.z = wheelTurn;
    for (const leg of c.legs) leg.rotation.z = Math.sin((legPhase + leg.userData.phase) * Math.PI * 2) * 0.36 * gait;
    cartT += dt;
    c.muleHead.rotation.z = -0.1 * (1 - gait) + Math.sin(cartT * 0.5) * 0.09 * (1 - gait) + Math.sin(legPhase * Math.PI * 4) * 0.05 * gait;
    c.muleTail.rotation.x = Math.sin(cartT * (2.1 - gait)) * (0.3 - 0.15 * gait);

    // her: where she stands, which way she faces, how far she is from the stall
    let spotNow;
    let leadW;
    let stallW;
    if (phase === 'settling') {
      const k = st.t / SETTLE;
      spotNow = steps(LEAD, STALL, k);
      leadW = 1 - smooth(k / 0.2);
      stallW = smooth((k - 0.8) / 0.2);
    } else if (phase === 'packing') {
      const k = st.t / SETTLE;
      spotNow = steps(STALL, LEAD, k);
      stallW = 1 - smooth(k / 0.2);
      leadW = smooth((k - 0.8) / 0.2);
    } else if (phase === 'stall') {
      spotNow = { ...STALL, walking: false };
      leadW = 0;
      stallW = 1;
    } else {
      spotNow = { ...LEAD, walking: rolling };
      leadW = 1;
      stallW = 0;
    }
    c.prop.visible = stallW > 0.5;
    c.staffLeant.visible = stallW > 0.5;
    her.staff.visible = !c.staffLeant.visible;

    herStride += ((spotNow.walking ? 1 : 0) - herStride) * (1 - Math.exp(-dt * 8));
    if (spotNow.walking) walkT += dt;
    her.figure.position.set(spotNow.x, Math.abs(Math.sin(walkT * 6)) * 0.035 * herStride, spotNow.z);
    her.figure.rotation.set(Math.sin(walkT * 6) * 0.04 * herStride, spotNow.turn, 0); // a little roll from foot to foot
    herPose.turn = spotNow.turn;
    [herPose.x, herPose.z] = at(spotNow.x, spotNow.z);
    herPose.bodyYaw = Math.PI / 2 + spotNow.turn + pose.rotY;

    // her arms: a hand on the mule's cheek-strap and the staff in the other
    // while they walk; swinging as she steps; folded before her at the stall
    const swing = Math.sin(walkT * 6) * 0.3 * herStride;
    qa.slerpQuaternions(Q.hangNear, Q.lead, leadW);
    if (stallW > 0) {
      qb.copy(Q.stallNear).slerp(Q.offer, offer.k);
      qa.slerp(qb, stallW);
    } else if (leadW < 1) {
      qa.premultiply(qSwing.setFromAxisAngle(Z_AXIS, -swing * (1 - leadW))); // the free hand swings against the staff
    }
    her.near.quaternion.copy(qa);
    carry.set(0.3, -0.95, -0.06).applyAxisAngle(Z_AXIS, swing).normalize();
    qa.setFromUnitVectors(DOWN, carry);
    if (stallW > 0) {
      qb.copy(Q.stallFar).slerp(Q.apron, smoothApron.k);
      qa.slerp(qb, stallW);
    }
    her.far.quaternion.copy(qa);
    // the staff stands in her far hand, upright, leaning a little with the swing
    her.staff.position.set(carry.x * ARM, 0.25 + carry.y * ARM, -0.19 + carry.z * ARM);
    her.staff.rotation.set(0, 0, swing * 0.4);
  }

  // what makeAlive needs to know of her, kept current by place()
  const herPose = { x: spot.x, z: spot.z, bodyYaw: 0, turn: 0 };
  const chapman = makeAlive({
    x: spot.x,
    z: spot.z,
    yaw: 0,
    forward: Math.PI / 2, // her figure faces its own +x
    sway: her.sway,
    head: her.head,
    stroll: { update() {}, pose: () => herPose, idle: () => PHASES[st.idx] === 'stall' }, // no fidgets on the road
    gestures: [
      // holding a ware out to whoever passes on the path
      { dur: 1.8, apply: (k) => { offer.k = PHASES[st.idx] === 'stall' ? Math.sin(k * Math.PI) : 0; } },
      // smoothing her apron
      { dur: 1.4, apply: (k) => { smoothApron.k = PHASES[st.idx] === 'stall' ? Math.sin(k * Math.PI) : 0; } },
    ],
  });

  // set her where the clock says before the first frame, with nothing said
  if (always) st.idx = 3;
  else snap(cartDay(secondsOfDay(clock()), shop));
  place(0, 0);

  return Object.assign(api, {
    group: c.group,
    colliders: [bed, mule],
    spot,
    chapman,
    // hold: true while the shop panel is open — she will not pack up on him
    update(dt, playerPos, hold = false) {
      reconcile(secondsOfDay(readClock()), hold);
      const moved = advance(dt, playerPos);
      place(dt, moved);
      chapman.update(dt, playerPos);
    },
    phase: () => PHASES[st.idx],
    distance: () => st.d,
    present: () => ['settling', 'stall', 'packing'].includes(PHASES[st.idx]), // standing on her pitch
    open: () => PHASES[st.idx] === 'stall',
    walking: () => ['coming', 'going'].includes(PHASES[st.idx]),
    her: () => ({ ...herPose }),
    // pin her day to another clock (tests); null puts back the one she was given
    setClock: (fn) => { readClock = fn || clock; },
    // quicken her feet k times (or near still them) — tests only; 1 puts them back
    hurry: (k) => { hurry = k; },
  });
}
