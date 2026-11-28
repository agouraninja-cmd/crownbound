import * as THREE from 'three';
import { mesh, tone, makeRng, hull, hash2 } from './meshUtils.js';
import { WOOD_DARK, WOOD, WOOD_PALE, THATCH, THATCH_DARK, THATCH_PALE, STONE, STONE_DARK, DAUB, IRON, box, cyl, boards } from './kit.js';
import { toftKit } from './toft.js';
import { LAYOUT, houseToWorld } from './layout.js';

// The cottage kit: what every neighbour's house in the village is raised from.
// A house is put together by its own file in src/scene/houses/ — it calls
// shell() for walls and thatch, door() and window() for its openings, smoke()
// for where the hearth's smoke leaves, then sets out its yard with the toft
// kit (toft.js) and whatever is its own. village.js stands the finished house
// on its plot and bakes it into the row it belongs to.
//
// The house's own frame: +x runs along the ridge, +z is the front, y is up
// from the floor line. The four walls are 'front' (+z), 'back' (-z), 'right'
// (the +x end) and 'left' (the -x end); a place along a wall is `at`, measured
// from the wall's middle (along x for front and back, along z for the ends).
//
// Everything here is a closed solid seen from outside only: the walls are one
// block, the thatch three nested ones. A camera that ends up inside a house
// therefore sees straight out through it (back faces are not drawn) instead of
// being walled in — there are 24 of these, and the eye is often behind him.

const DEEP = 0.9; // walls and plinths run this far below the floor, so no slope shows daylight under them

// wall washes: what a peasant had to hand — raw daub, lime, ochre from the bank, plain clay
export const WASH = {
  daub: DAUB,
  lime: 0xe0d8c2, // fresh limewash
  limeOld: 0xcdc3a9, // limewash a few winters old
  ochre: 0xc59a5a,
  clay: 0xa99d85, // grey river clay
  earth: 0x9b8160, // cob left unwashed
  soot: 0x8a7a64, // old daub, smoke-stained
};

// thatch, as [eave course, middle course, ridge course] — the lowest is the oldest and darkest
export const THATCHES = {
  straw: [THATCH_DARK, THATCH, THATCH_PALE], // a few years old: the village's common roof
  new: [0xcdab52, 0xdcbd63, 0xe9cf7c], // laid this autumn, still gold
  old: [0x7d6b48, 0x8b7953, 0x9a8860], // grey-brown, sagging, due for the thatcher
  reed: [0xa08d60, 0xb09d70, 0xc0ae82], // water reed: neater, greyer
  heather: [0x5a493b, 0x695645, 0x786451], // ling off the moor: dark and shaggy
  turf: [0x56723a, 0x648241, 0x73914c], // sods, grass side up
};

// Oak was left bare, and bare oak weathers to silver-grey: only a few frames
// in the village are dark, and only new work is pale.
export const TIMBER = {
  grey: 0x7c7466, // weathered a generation: the common look
  old: 0x655b4c, // older and darker, soot in the grain
  dark: WOOD_DARK, // tarred or smoke-black: a few only
  new: 0xb59c6c, // hewn this year
};

const MOSS = 0x66773f;
const SOOT = 0x2a211a;

// the walls, by name: which way each faces (x, z) and which way `at` runs along it
const WALLS = {
  front: { nx: 0, nz: 1, ry: 0 },
  back: { nx: 0, nz: -1, ry: Math.PI },
  right: { nx: 1, nz: 0, ry: Math.PI / 2 },
  left: { nx: -1, nz: 0, ry: -Math.PI / 2 },
};

// hull(points): a closed solid round a handful of points [x, y, z] — the way to
// make any shape of your own that boxes and cylinders will not. It lives in
// meshUtils; a house's file takes it from here with the rest of the kit.
export { hull };

// plot: { id, length, width } (layout.js) · ground(u, v): how far the real
// ground at local (u, v) lies above (+) or below (-) the floor line · seed:
// this house's own stream, so no two weather alike.
export function raiseCottage(plot, { ground = () => 0, seed = 1 } = {}) {
  const g = new THREE.Group();
  const body = new THREE.Group(); // the house itself, apart from its yard: it can lean (c.lean)
  g.add(body);
  const rng = makeRng(seed);
  const hx = plot.length / 2;
  const hz = plot.width / 2;
  const holes = []; // { wall, s0, s1, y0, y1 } — where the frame must leave a door or window alone
  let S = null; // the shell's measurements, once shell() has run
  let framed = false;

  const c = {
    g,
    rng,
    plot,
    L: plot.length,
    W: plot.width,
    hx,
    hz,
    ground,
    openings: [], // unlit planes: the dark of a doorway or window, lit from within after dark
    embers: [], // unlit meshes that glow at any hour: a forge, an oven's mouth
    colliders: [], // extra solid things in the yard, in the house's frame: { u, v, r } circles, { u0, v0, u1, v1 } rects, { u, v, halfU, halfV, ry } turned ones
    smokes: [], // { u, y, v } where smoke leaves a lit hearth
  };

  // ---------- placing things ----------

  // a plain piece of the house, in its own frame (on a wall, on the roof);
  // opts as mesh(): x, y, z, rx, ry, rz, shadow. Things that stand in the
  // yard belong on the ground instead: c.at(), or the toft kit's props.
  c.add = (geo, color, opts) => {
    const m = mesh(geo, color, opts);
    body.add(m);
    return m;
  };

  // An old house out of plumb: the whole building (not its yard) tipped a few
  // degrees — forward (toward its front) and sideways (toward its +x end), in
  // radians. 0.05 is plain to see; shore it with a raking pole or two.
  c.lean = (forward = 0, sideways = 0) => {
    body.rotation.set(forward, 0, -sideways);
    return c;
  };

  // a group standing on the real ground at (u, v), turned ry — build a yard
  // prop into it in its own coordinates and it sits right on any slope
  c.at = (u, v, ry = 0, lift = 0) => {
    const sub = new THREE.Group();
    sub.position.set(u, ground(u, v) + lift, v);
    sub.rotation.y = ry;
    g.add(sub);
    return sub;
  };

  // a group on a wall's outer face: its +x runs along the wall, +z points out
  // of it, y is up from the floor. `at` is where along the wall it sits.
  c.onWall = (wall, at = 0, out = 0) => {
    const w = WALLS[wall];
    const sub = new THREE.Group();
    const d = (w.nx ? hx : hz) + (S ? S.skin : 0) + out;
    sub.position.set(w.nx ? w.nx * d : at, 0, w.nz ? w.nz * d : at);
    sub.rotation.y = w.ry;
    body.add(sub);
    return sub;
  };

  // something solid in the yard that he must walk round: a circle, or a rect
  c.solid = (u, v, r) => c.colliders.push({ u, v, r });
  c.block = (u0, v0, u1, v1) => {
    // four corners or nothing: a rect with a NaN side would stop no one, and say nothing
    if (![u0, v0, u1, v1].every(Number.isFinite)) throw new Error('c.block(u0, v0, u1, v1) is the rect collider (the chopping block is c.chopBlock)');
    c.colliders.push({ u0: Math.min(u0, u1), v0: Math.min(v0, v1), u1: Math.max(u0, u1), v1: Math.max(v0, v1) });
  };

  // smoke rising from a spot in the house's own frame, y above the floor line
  // (a kiln, a charcoal mound, an oven): a thin thread, as from a hearth
  c.smokeAt = (u, y, v) => c.smokes.push({ u, y, v });

  // an unlit thing that glows at every hour (keep these few and small)
  c.ember = (geo, color, opts = {}) => {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color }));
    m.position.set(opts.x ?? 0, opts.y ?? 0, opts.z ?? 0);
    m.rotation.set(opts.rx ?? 0, opts.ry ?? 0, opts.rz ?? 0);
    (opts.in ?? body).add(m);
    c.embers.push(m);
    return m;
  };

  // the dark inside, seen through a hole in a wall: a plane facing out of
  // group `sub` (an onWall group). lit 0…1 is how brightly the hearth shows
  // through it after dark (0: the house sleeps dark).
  function opening(sub, w, h, x, y, lit) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: 0x2a1c12 }));
    m.position.set(x, y, 0.012);
    m.userData.lit = lit;
    sub.add(m);
    c.openings.push(m);
    return m;
  }

  // ---------- walls and thatch ----------

  // Raise the walls and the roof. The proportions are the period's: low walls
  // under a great steep roof, the house's width hardly varying and its wealth
  // told by its length.
  //   eave    how high the walls stand (1.3 the poorest hut … 1.9 the best house); the thatch starts there
  //   pitch   the roof's slope in degrees: 45–55 for straw, about 40 for turf
  //   walls   'daub' (wattle and daub in a frame) · 'cob' (thick earth, rounded corners, no frame)
  //           'stone' (rubble) · 'turf' (stacked sods) · 'plank' (upright boards — sheds, not houses)
  //           'wattle' (bare woven panels: a byre, a sty) · 'open' (posts only: a shelter)
  //   wash    the wall's colour (WASH.*, or any hex)
  //   frame   'box' (posts, rails and braces on a stone footing — the new way)
  //           'cruck' (great curved blades at the gables) · 'post' (posts set in the ground, the old way) · 'none'
  //   timber  the frame's colour (TIMBER.*)
  //   roof    'gable' · 'hip' (sloped at both ends too) · 'halfhip' (the gable's top clipped back)
  //   thatch  a THATCHES name, or [eave, middle, ridge] colours
  //   ridge   'roll' (straw wrapped over and pinned with crossed spars) · 'turf' (capped with sods) · 'none'
  //   over    how far the eaves overhang, down the slope · hip: the share of the slope a half-hip covers
  //   barge   true boards the gable verges (the better houses); otherwise the straw is swept over them
  //   moss    patches of moss on the slopes · bay: about how far apart the frame's posts stand
  c.shell = ({
    eave = 1.65, pitch: degrees = 50, walls = 'daub', wash = WASH.daub, frame = walls === 'daub' ? 'box' : 'none', timber = TIMBER.grey,
    roof = 'gable', thatch = 'straw', ridge = 'roll', over = 0.36, hip = 0.42, barge = false, moss = 0, bay = 1.7, thick,
  } = {}) => {
    const palette = Array.isArray(thatch) ? thatch : THATCHES[thatch];
    const turfRoof = thatch === 'turf';
    const pitch = (degrees * Math.PI) / 180;
    const sin = Math.sin(pitch);
    const cos = Math.cos(pitch);
    const run = hz / cos + over; // ridge to eave, down the slope
    const peak = eave + sin * run; // the rafters' line meets the wall top at the eave's tip
    const rise = peak - eave;
    const deep = thick ?? (turfRoof ? 0.24 : thatch === 'old' || thatch === 'heather' ? 0.2 : 0.17);
    const gableOver = 0.32;
    // how far down the slope the end hips reach: nothing on a gable, all the way on a hip
    const uh = roof === 'hip' ? run : roof === 'halfhip' ? run * hip : 0;
    const ridgeHalf = Math.max(0.25, roof === 'hip' ? hx - hz : hx + gableOver - cos * uh);
    const skin = walls === 'stone' ? 0.04 : walls === 'turf' ? 0.03 : walls === 'plank' ? 0.045 : walls === 'wattle' ? 0.05 : 0;
    S = { eave, rise, peak, pitch, sin, cos, run, over, deep, uh, ridgeHalf, skin, walls, wash, frame, timber, roof, bay, palette };
    Object.assign(c, { eave, peak, pitch, open: walls === 'open' });

    // --- the body: one closed block (see the note at the top) ---
    const bodyH = eave + DEEP;
    if (walls === 'open') {
      // no walls at all: a post at each corner and along the sides, a plate on their heads
      const n = Math.max(1, Math.round(plot.length / 2.2));
      for (let i = 0; i <= n; i++) {
        for (const sz of [-1, 1]) c.add(cyl(0.065, 0.085, eave + DEEP * 0.6, 6), tone(timber, 0.9 + rng() * 0.22), { x: -hx + 0.1 + (i * (plot.length - 0.2)) / n, y: (eave - DEEP * 0.6) / 2, z: sz * (hz - 0.1), rz: (rng() - 0.5) * 0.04 });
      }
      for (const sz of [-1, 1]) c.add(box(plot.length, 0.1, 0.1), tone(timber, 1.05), { y: eave - 0.05, z: sz * (hz - 0.1) });
      for (const sx of [-1, 1]) c.add(box(0.1, 0.1, plot.width - 0.2), tone(timber, 1.0), { x: sx * (hx - 0.1), y: eave - 0.05 });
    } else if (walls === 'wattle') {
      // bare wattle, never daubed: a dark core with the weave standing on it
      c.add(box(plot.length, bodyH, plot.width), 0x5f4a2e, { y: (eave - DEEP) / 2 });
      for (const wall of ['front', 'back', 'right', 'left']) {
        const sub = c.onWall(wall, 0, -skin);
        wattle(sub, (wall === 'front' || wall === 'back' ? plot.length : plot.width) - 0.04, eave - 0.04, 0, 0, 0.02);
      }
    } else if (walls === 'cob') {
      // rounded corners, as cob is raised: a chamfered block
      const ch = 0.3;
      const ring = (y) => [[hx - ch, y, hz], [hx, y, hz - ch], [hx, y, -hz + ch], [hx - ch, y, -hz], [-hx + ch, y, -hz], [-hx, y, -hz + ch], [-hx, y, hz - ch], [-hx + ch, y, hz]];
      c.add(hull([...ring(-DEEP), ...ring(eave)]), wash);
      // the rubble underpin cob stands on, and the damp it wicks up from it
      const foot = (y, grow) => ring(y).map(([x, yy, z]) => [x + Math.sign(x) * grow, yy, z + Math.sign(z) * grow]);
      c.add(hull([...foot(-DEEP, 0.07), ...foot(0.3, 0.07)]), tone(STONE_DARK, 0.92));
      c.add(hull([...foot(0.3, 0.012), ...foot(0.52, 0.012)]), tone(wash, 0.8), { shadow: false });
    } else if (walls === 'turf') {
      // sods laid in courses, grass side down: brown bands with a green seam between
      c.add(box(plot.length, bodyH, plot.width), 0x6a5638, { y: (eave - DEEP) / 2 });
      const courses = Math.round(eave / 0.3);
      for (let i = 0; i < courses; i++) {
        const y = (i + 0.5) * (eave / courses);
        const grow = 0.012 + rng() * 0.014;
        c.add(box(plot.length + grow * 2, eave / courses - 0.03, plot.width + grow * 2), tone(i % 2 ? 0x6f5a3b : 0x5f4c33, 0.92 + rng() * 0.16), { y });
      }
      c.add(box(plot.length + 0.24, 0.5, plot.width + 0.24), 0x5a6b36, { y: -0.16 }); // the bank it grew out of
    } else {
      const stone = walls === 'stone';
      c.add(box(plot.length, bodyH, plot.width), stone ? STONE_DARK : wash, { y: (eave - DEEP) / 2 });
      if (stone) rubble();
      if (walls === 'plank') {
        for (const s of [-1, 1]) {
          boards(body, rng, { axis: 'z', at: s * (hz + 0.02), from: -hx, to: hx, y0: -0.3, y1: eave, color: wash });
          boards(body, rng, { axis: 'x', at: s * (hx + 0.02), from: -hz, to: hz, y0: -0.3, y1: eave, color: wash });
        }
      }
    }

    // --- the gable walls, where the roof leaves them showing: up the
    //     rafters' line from the wall top, clipped where a half-hip comes down ---
    if (roof !== 'hip' && walls !== 'open') {
      const yCut = roof === 'halfhip' ? peak - sin * uh - 0.02 : peak - 0.02;
      const zCut = roof === 'halfhip' ? cos * uh - 0.02 : 0;
      const colour = walls === 'stone' ? tone(STONE, 0.96) : walls === 'turf' ? 0x6a5638 : walls === 'wattle' ? 0x6f5733 : wash;
      const pts = [];
      for (const ex of [-1, 1]) {
        for (const sz of [-1, 1]) pts.push([ex * hx, eave - 0.02, sz * hz], [ex * hx, eave + sin * over - 0.02, sz * hz], [ex * hx, yCut, sz * zCut]);
      }
      c.add(hull(pts), colour);
    }

    // --- the thatch: three courses, each run up to the ridge, the upper ones
    //     standing a little prouder and stopping shorter. Over the house each
    //     course is a closed solid; where a gable shows, the solid stops just
    //     inside the wall and the straw runs on past it as a verge of its own,
    //     so the gable wall is seen under the thatch and not a wall of straw. ---
    const yAt = (u, lift) => peak - sin * u + lift;
    const inside = hx - 0.02; // a gabled course ends here, behind the gable wall's face
    const course = (u1, lift, shrink, colour) => {
      const top = lift + deep;
      // the hipped part: from the ridge down as far as the end hips reach
      const uc = Math.min(u1, uh);
      if (uc > 1e-6) {
        const xr = ridgeHalf - shrink;
        const xe = xr + cos * uc;
        const ze = cos * uc;
        c.add(hull([
          [xr, yAt(0, top), 0], [-xr, yAt(0, top), 0],
          [xe, yAt(uc, top), ze], [-xe, yAt(uc, top), ze], [xe, yAt(uc, top), -ze], [-xe, yAt(uc, top), -ze],
          [xe, yAt(uc, lift), ze], [-xe, yAt(uc, lift), ze], [xe, yAt(uc, lift), -ze], [-xe, yAt(uc, lift), -ze],
        ]), colour);
      }
      if (u1 <= uh + 1e-6) return;
      // the gabled part below it (all of it, on a plain gable)
      const z0 = cos * uh;
      const z1 = cos * u1;
      const pts = [];
      for (const ex of [-1, 1]) {
        for (const sz of uh > 1e-6 ? [-1, 1] : [1]) pts.push([ex * inside, yAt(uh, top), sz * z0]);
        for (const sz of [-1, 1]) pts.push([ex * inside, yAt(u1, top), sz * z1], [ex * inside, yAt(u1, lift), sz * z1]);
      }
      c.add(hull(pts), colour);
      // ...and the verges: the straw swept out over each gable
      const out = hx + gableOver - shrink;
      for (const ex of [-1, 1]) {
        for (const sz of [-1, 1]) {
          const slab = [];
          for (const x of [ex * inside, ex * out]) {
            slab.push([x, yAt(uh, top), sz * z0], [x, yAt(uh, lift), sz * z0], [x, yAt(u1, top), sz * z1], [x, yAt(u1, lift), sz * z1]);
          }
          c.add(hull(slab), colour);
        }
      }
    };
    course(run, 0, 0, tone(palette[0], 0.95 + rng() * 0.1));
    course(run * 0.64, 0.05, 0.03, tone(palette[1], 0.95 + rng() * 0.1));
    course(run * 0.34, 0.1, 0.06, tone(palette[2], 0.94 + rng() * 0.08));

    // the ragged fringe along every eave
    const fringeTone = () => tone(palette[0], 0.84 + rng() * 0.22);
    const gap = turfRoof || thatch === 'reed' ? 0.5 : 0.34;
    const eaveX = ridgeHalf + cos * Math.min(run, uh); // half the eave's length
    for (const side of [-1, 1]) {
      const n = Math.round((eaveX * 2) / gap);
      for (let i = 0; i < n; i++) {
        const len = 0.14 + rng() * 0.17;
        const u = run + len / 2 - 0.06;
        c.add(box(0.22 + rng() * 0.12, deep * 0.8, len), fringeTone(), {
          x: -eaveX + (i + 0.5) * ((eaveX * 2) / n) + (rng() - 0.5) * 0.08,
          y: peak - sin * u + deep * 0.45, z: side * cos * u, rx: side * (pitch + 0.1 + rng() * 0.16),
        });
      }
    }
    if (uh > 1e-6) {
      // ...and along the ends, where a hip comes down
      const halfZ = cos * uh;
      for (const end of [-1, 1]) {
        const n = Math.max(2, Math.round((halfZ * 2) / gap));
        for (let i = 0; i < n; i++) {
          const len = 0.14 + rng() * 0.17;
          const u = uh + len / 2 - 0.06;
          c.add(box(len, deep * 0.8, 0.22 + rng() * 0.12), fringeTone(), {
            x: end * (ridgeHalf + cos * u), y: peak - sin * u + deep * 0.45,
            z: -halfZ + (i + 0.5) * ((halfZ * 2) / n) + (rng() - 0.5) * 0.08, rz: -end * (pitch + 0.1 + rng() * 0.16),
          });
        }
      }
    }
    // barge boards down each gable verge, as far up as the gable goes
    if (barge && roof !== 'hip') {
      const u0 = uh;
      const len = run - u0 + 0.05;
      const mid = (u0 + run) / 2 - 0.02;
      for (const end of [-1, 1]) {
        for (const side of [-1, 1]) {
          c.add(box(0.05, 0.19, len), tone(timber, 0.95), { x: end * (hx + gableOver - 0.03), y: peak - sin * mid + deep * 0.5, z: side * cos * mid, rx: side * pitch });
        }
      }
    }

    // the ridge
    const top = peak + deep + 0.12;
    if (ridge === 'roll') {
      c.add(cyl(0.16, 0.16, ridgeHalf * 2 + 0.08, 6), tone(palette[2], 1.03), { y: top - 0.03, rz: Math.PI / 2 });
      const spars = Math.max(1, Math.round((ridgeHalf * 2) / 0.8));
      for (let i = 0; i < spars; i++) {
        const sx = -ridgeHalf + (i + 0.5) * ((ridgeHalf * 2) / spars);
        for (const side of [-1, 1]) c.add(box(0.035, 0.035, 0.62), WOOD_DARK, { x: sx + side * 0.03, y: top + 0.05, rx: side * (pitch + 0.3) });
      }
    } else if (ridge === 'turf') {
      // sods laid along the ridge to hold the thatch down
      const n = Math.max(2, Math.round((ridgeHalf * 2) / 0.55));
      for (let i = 0; i < n; i++) {
        c.add(box((ridgeHalf * 2) / n - 0.03, 0.13 + rng() * 0.04, 0.5 + rng() * 0.1), tone(0x5f7a3a, 0.9 + rng() * 0.2), {
          x: -ridgeHalf + (i + 0.5) * ((ridgeHalf * 2) / n), y: top - 0.06, ry: (rng() - 0.5) * 0.1,
        });
      }
    }

    // a turf roof grows: tufts of grass standing on it
    if (turfRoof) {
      for (let i = 0; i < 12; i++) {
        const side = rng() < 0.5 ? -1 : 1;
        const p = c.onRoof(side, (rng() - 0.5) * 2 * (ridgeHalf + cos * Math.min(run * 0.5, uh)) * 0.8, run * (0.15 + rng() * 0.75));
        c.add(new THREE.ConeGeometry(0.07, 0.2 + rng() * 0.14, 4), tone(0x7fa048, 0.85 + rng() * 0.3), { x: p.x, y: p.y + 0.08, z: p.z });
      }
    }
    // moss on old thatch, thickest low down where the wet lingers
    for (let i = 0; i < moss; i++) {
      const side = rng() < 0.65 ? -1 : 1;
      const down = run * (0.4 + rng() * 0.5);
      const where = (rng() - 0.5) * 2; // along the slope, end to end
      const long = 0.4 + rng() * 0.6;
      const deep = 0.3 + rng() * 0.45;
      // the whole patch on the slope: a hipped roof narrows toward its ridge, and no patch may hang off the hip
      const room = ridgeHalf + cos * Math.min(Math.max(down - deep / 2, 0), uh) - long / 2 - 0.12;
      const reach = Math.max(0, Math.min(room, (ridgeHalf + cos * Math.min(down, uh)) * 0.75));
      // a ragged pad, not a rectangle (its edge is cut by where it lies, drawing nothing more from chance)
      const pad = [];
      for (let k = 0; k < 7; k++) {
        const a = (k / 7) * Math.PI * 2;
        const r = 0.72 + 0.28 * hash2(k + i * 7, Math.round(long * 1000));
        for (const y of [-0.015, 0.015]) pad.push([Math.cos(a) * r * long / 2, y, Math.sin(a) * r * deep / 2]);
      }
      c.add(hull(pad), tone(MOSS, 0.85 + rng() * 0.3), { ...c.onRoof(side, where * reach, down, 0.012), shadow: false });
    }
    return c;
  };

  // A spot on the thatch: side +1 is the front slope, -1 the back; `along`
  // runs down the ridge's length, `down` the slope from the ridge; `above`
  // lifts off the surface. Returns { x, y, z, rx } — spread it into add()'s
  // opts and a flat piece lies on the roof.
  c.onRoof = (side, along, down, above = 0) => {
    const lift = S.deep + (down < S.run * 0.34 ? 0.1 : down < S.run * 0.64 ? 0.05 : 0);
    return { x: along, y: S.peak - S.sin * down + lift + S.cos * above, z: side * (S.cos * down + S.sin * above), rx: side * S.pitch };
  };

  // rubble walling: courses of rough stones over every face, bigger at the corners
  function rubble() {
    const face = (axis, at, from, to) => {
      const tall = S.eave;
      const rows = Math.max(3, Math.round(tall / 0.42));
      for (let r = 0; r < rows; r++) {
        const h = tall / rows;
        let u = from - (r % 2 ? 0.2 : 0);
        while (u < to - 0.05) {
          let len = 0.42 + rng() * 0.42;
          if (to - u - len < 0.2) len = to - u;
          const a = Math.max(u, from);
          const b = Math.min(u + len, to);
          const colour = tone(rng() < 0.6 ? STONE : STONE_DARK, 0.94 + rng() * 0.22);
          const d = 0.04 + rng() * 0.02; // never proud of a doorway's dark
          const m = axis === 'z'
            ? mesh(box(b - a - 0.025, h - 0.025, d), colour, { x: (a + b) / 2, y: (r + 0.5) * h, z: at })
            : mesh(box(d, h - 0.025, b - a - 0.025), colour, { x: at, y: (r + 0.5) * h, z: (a + b) / 2 });
          body.add(m);
          u += len;
        }
      }
    };
    for (const s of [-1, 1]) {
      face('z', s * (hz + 0.012), -hx - 0.03, hx + 0.03);
      face('x', s * (hx + 0.012), -hz - 0.03, hz + 0.03);
    }
  }

  // ---------- doors and windows ----------

  // A doorway. open: 0 shut … 1 standing open on the dark inside (in between,
  // ajar). kind 'plank' is a ledged door; 'hurdle' a wattle hurdle across the
  // foot of an open doorway (a byre's). hinge ±1: which jamb it hangs on.
  // lit: how the hearth shows through it after dark (an open door only).
  c.door = (wall, at = 0, { w = 0.86, h = Math.min(1.55, S.eave - 0.18), open = 0, hinge = 1, kind = 'plank', colour = WOOD, lit = 0.7, step = true } = {}) => {
    const sub = c.onWall(wall, at);
    const put = (geo, col, opts) => sub.add(mesh(geo, col, opts));
    holes.push({ wall, s0: at - w / 2 - 0.1, s1: at + w / 2 + 0.1, y0: -1, y1: h + 0.14 });
    const wide = kind === 'hurdle' ? 1 : open;
    if (wide > 0) opening(sub, w, h, 0, h / 2, lit);
    // the frame: two jambs and a lintel, standing proud
    for (const s of [-1, 1]) put(box(0.1, h + 0.1, 0.09), tone(S.timber, 0.9 + rng() * 0.2), { x: s * (w / 2 + 0.05), y: h / 2 - 0.02, z: 0.03 });
    put(box(w + 0.34, 0.13, 0.1), tone(S.timber, 0.9 + rng() * 0.2), { y: h + 0.065, z: 0.035 });
    if (kind === 'hurdle') {
      wattle(sub, w - 0.06, h * 0.52, 0, 0.02, 0.05);
    } else if (wide < 1) {
      // the leaf: upright boards, ledged and braced; ajar, it covers less of
      // the doorway and stands in the house's shade
      const lw = w * (1 - wide * 0.72) - 0.03;
      const x0 = hinge > 0 ? w / 2 - lw - 0.015 : -w / 2 + 0.015;
      const shade = 1 - wide * 0.3;
      const n = Math.max(2, Math.round(lw / 0.21));
      for (let i = 0; i < n; i++) put(box(lw / n - 0.012, h - 0.06, 0.05), tone(colour, (0.82 + rng() * 0.28) * shade), { x: x0 + (i + 0.5) * (lw / n), y: h / 2, z: 0.03 });
      for (const y of [h * 0.26, h * 0.74]) put(box(lw - 0.04, 0.11, 0.03), tone(WOOD_DARK, shade), { x: x0 + lw / 2, y, z: 0.066 });
      for (const y of [h * 0.26, h * 0.74]) put(box(0.26, 0.05, 0.02), IRON, { x: x0 + (hinge > 0 ? lw - 0.13 : 0.13), y, z: 0.084, shadow: false });
      if (!wide) put(box(0.035, 0.1, 0.04), IRON, { x: x0 + (hinge > 0 ? 0.08 : lw - 0.08), y: h * 0.53, z: 0.075 });
    }
    // the doorstep: a flat stone on the ground, two where the ground falls away
    if (step) {
      const wn = WALLS[wall];
      const drop = ground((wn.nx ? wn.nx * (hx + 0.3) : at), (wn.nz ? wn.nz * (hz + 0.3) : at));
      put(box(w + 0.16, 0.34, 0.42), tone(STONE, 0.98 + rng() * 0.1), { y: -0.15, z: 0.2 });
      if (drop < -0.2) put(box(w + 0.3, 0.4, 0.44), tone(STONE_DARK, 0.98 + rng() * 0.1), { y: -0.38, z: 0.52 });
    }
    return sub;
  };

  // A window: a small unglazed hole high under the eaves, barred with wood
  // (a house has none to three). shutter: 'none' (they shut from within),
  // 'side' (hung open against the wall), 'propped' (hinged at the top and held
  // out on a stick) or 'shut'. bars: how many uprights. lit as door().
  c.window = (wall, at = 0, { h = 0.36, w = 0.4, y = S.eave - 0.2 - h / 2, shutter = 'none', hinge = 1, bars = 2, lit = 0.85 } = {}) => {
    const sub = c.onWall(wall, at);
    const put = (geo, col, opts) => sub.add(mesh(geo, col, opts));
    // the frame keeps clear of the window and its own lintel and sill — and no further, or a window at the usual height would cut the wall plate above it
    holes.push({ wall, s0: at - w / 2 - 0.08, s1: at + w / 2 + 0.08, y0: y - h / 2 - 0.1, y1: y + h / 2 + 0.075 });
    if (shutter !== 'shut') opening(sub, w, h, 0, y, lit);
    const timber = () => tone(S.timber, 0.9 + rng() * 0.2);
    put(box(w + 0.16, 0.07, 0.07), timber(), { y: y + h / 2 + 0.035, z: 0.03 });
    for (const s of [-1, 1]) put(box(0.07, h + 0.02, 0.07), timber(), { x: s * (w / 2 + 0.035), y, z: 0.03 });
    put(box(w + 0.22, 0.05, 0.15), WOOD_PALE, { y: y - h / 2 - 0.025, z: 0.06 }); // the sill board
    for (let i = 0; i < bars; i++) put(box(0.035, h, 0.035), tone(S.timber, 1.1), { x: -w / 2 + ((i + 1) * w) / (bars + 1), y, z: 0.03, shadow: false });
    const leaf = (target, x, yy, z, wide, tall) => {
      for (const s of [-1, 1]) target.add(mesh(box(wide / 2 - 0.008, tall, 0.03), tone(WOOD, 0.9 + rng() * 0.22), { x: x + s * (wide / 4), y: yy, z }));
      for (const dy of [-0.3, 0.3]) target.add(mesh(box(wide - 0.03, 0.045, 0.015), WOOD_DARK, { x, y: yy + dy * tall, z: z + 0.02, shadow: false }));
    };
    if (shutter === 'shut') {
      leaf(sub, 0, y, 0.03, w, h);
    } else if (shutter === 'side') {
      leaf(sub, hinge * (w + 0.11), y, 0.03, w * 0.9, h + 0.02);
    } else if (shutter === 'propped') {
      const flap = new THREE.Group();
      flap.position.set(0, y + h / 2 + 0.02, 0.07);
      flap.rotation.x = -0.95; // swung up and out from its top edge
      leaf(flap, 0, -h / 2, 0, w + 0.04, h);
      sub.add(flap);
      put(box(0.022, h * 0.86, 0.022), WOOD_PALE, { x: w * 0.3, y: y - h * 0.26, z: 0.1 + h * 0.37, rx: 0.98, shadow: false }); // the stick it rests on
    }
    return sub;
  };

  // a woven panel in a wall group: upright stakes with withies wound between them
  function wattle(sub, w, h, x, y0, z) {
    const bands = Math.max(3, Math.round(h / 0.16));
    for (let i = 0; i < bands; i++) {
      sub.add(mesh(box(w, h / bands - 0.012, 0.035), tone(i % 2 ? 0x8a6d43 : 0x76592f, 0.9 + rng() * 0.2), { x, y: y0 + (i + 0.5) * (h / bands), z: z + (i % 2 ? 0.012 : -0.012) }));
    }
    const stakes = Math.max(2, Math.round(w / 0.3));
    for (let i = 0; i <= stakes; i++) sub.add(mesh(box(0.035, h + 0.1, 0.035), WOOD_DARK, { x: x - w / 2 + (i * w) / stakes, y: y0 + h / 2 + 0.03, z }));
  }

  // ---------- smoke ----------

  // Where the hearth's smoke leaves — there are no chimneys.
  //   'hole'    a hole in the thatch with a board propped over it against the rain
  //   'louvre'  a little capped turret astride the ridge (the better houses)
  //   'gablet'  a small opening under the ridge's end (hipped and half-hipped roofs)
  //   'seep'    nothing built: it soaks out through the thatch and stains it
  // at: where along the ridge. lit: true sends smoke up from it (village.js);
  // false leaves the hearth cold.
  c.smoke = (kind = 'hole', at = 0, { lit = true, side = 1 } = {}) => {
    const top = S.peak + S.deep + 0.12;
    let out = { u: at, y: top + 0.1, v: 0 };
    if (kind === 'hole') {
      const hole = c.onRoof(side, at, 0.34, 0.01);
      c.add(box(0.36, 0.03, 0.26), SOOT, { ...hole, shadow: false });
      const cowl = c.onRoof(side, at, 0.34, 0.24);
      c.add(box(0.52, 0.04, 0.4), tone(S.palette[0], 0.86), cowl);
      for (const sx of [-0.22, 0.22]) c.add(box(0.03, 0.26, 0.03), WOOD_DARK, { x: at + sx, y: (hole.y + cowl.y) / 2, z: (hole.z + cowl.z) / 2 });
      out = { u: at, y: cowl.y + 0.1, v: cowl.z };
    } else if (kind === 'louvre') {
      for (const sx of [-0.2, 0.2]) for (const sz of [-0.16, 0.16]) c.add(box(0.05, 0.34, 0.05), WOOD_DARK, { x: at + sx, y: top + 0.14, z: sz });
      c.add(box(0.4, 0.26, 0.3), SOOT, { x: at, y: top + 0.12, shadow: false }); // the dark between the posts
      for (const s of [-1, 1]) c.add(box(0.62, 0.05, 0.32), tone(S.palette[1], 0.92), { x: at, y: top + 0.36, z: s * 0.12, rx: s * 0.6 });
      c.add(box(0.66, 0.05, 0.06), WOOD_DARK, { x: at, y: top + 0.44 });
      out = { u: at, y: top + 0.4, v: 0 };
    } else if (kind === 'gablet') {
      // at -1 or +1: which end of the ridge. The ridge runs on a little past
      // the hip's top and ends in a gable of its own, open to let the smoke out.
      const end = at < 0 ? -1 : 1;
      const x0 = end * (S.ridgeHalf - 0.3);
      const x1 = end * (S.ridgeHalf + 0.36);
      const apex = S.peak + S.deep + 0.17;
      const base = apex - 0.4;
      const half = 0.36;
      c.add(hull([[x0, apex, 0], [x1, apex, 0], [x0, base, half], [x1, base, half], [x0, base, -half], [x1, base, -half]]), tone(S.palette[2], 1.0));
      const tri = new THREE.BufferGeometry();
      const xf = x1 + end * 0.012;
      const pts = end > 0 ? [xf, base + 0.07, half - 0.11, xf, base + 0.07, -half + 0.11, xf, apex - 0.08, 0] : [xf, base + 0.07, -half + 0.11, xf, base + 0.07, half - 0.11, xf, apex - 0.08, 0];
      tri.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      c.add(tri, SOOT, { shadow: false });
      out = { u: x1 + end * 0.1, y: apex, v: 0 };
    } else {
      // no hole at all: the smoke soaks out through the straw and blackens it
      c.add(box(1.1 + rng() * 0.4, 0.02, 0.62), tone(S.palette[1], 0.62), { ...c.onRoof(side, at, 0.36, 0.01), shadow: false });
      c.add(box(0.6 + rng() * 0.2, 0.02, 0.4), tone(S.palette[1], 0.45), { ...c.onRoof(side, at + 0.08, 0.3, 0.016), shadow: false });
      out = { u: at, y: top + 0.05, v: 0 };
    }
    if (lit) c.smokes.push(out);
    return c;
  };

  // ---------- lean-tos ----------

  // A lower building against one wall: an outshut, a byre, an open shelter.
  //   at       where along the wall its middle is · length: along the wall · depth: out from it
  //   high     the roof's height at the wall · low: at its outer edge
  //   walls    'wattle' | 'plank' | 'daub' | 'open' (posts only: a cart shed, a forge)
  //   roof     a THATCHES name, or 'board'
  //   solid    false leaves it walkable (an open pentice over a door)
  // Returns the onWall group it was built in (its +z points out from the wall).
  c.leanTo = (wall, at = 0, { length = 2.4, depth = 1.6, high, low = 1.25, walls = 'wattle', wash = S.wash, roof = 'straw', solid = true } = {}) => {
    const sub = c.onWall(wall, at);
    const put = (geo, col, opts) => sub.add(mesh(geo, col, opts));
    const y1 = high ?? Math.min(S.eave - 0.1, low + depth * 0.62);
    const hl = length / 2;
    if (walls === 'open') {
      for (const s of [-1, 1]) {
        put(cyl(0.06, 0.075, low + DEEP, 6), tone(WOOD_DARK, 0.9 + rng() * 0.2), { x: s * (hl - 0.08), y: (low - DEEP) / 2, z: depth - 0.1 });
        put(box(0.06, 0.07, 0.7), WOOD_DARK, { x: s * (hl - 0.08), y: low - 0.2, z: depth - 0.38, rx: -0.75 });
      }
      put(box(length, 0.09, 0.09), tone(WOOD_DARK, 1.05), { y: low - 0.02, z: depth - 0.1 });
    } else {
      // a closed solid: front wall `low` high, climbing to the house wall
      const colour = walls === 'wattle' ? 0x7d6238 : wash;
      sub.add(mesh(hull([[-hl, -DEEP, 0], [hl, -DEEP, 0], [-hl, -DEEP, depth], [hl, -DEEP, depth], [-hl, y1 - 0.06, 0], [hl, y1 - 0.06, 0], [-hl, low - 0.04, depth], [hl, low - 0.04, depth]]), colour));
      if (walls === 'wattle') {
        wattle(sub, length - 0.04, low - 0.06, 0, 0, depth + 0.02);
      } else if (walls === 'plank') {
        let u = -hl;
        while (u < hl - 0.03) {
          let w = 0.27 * (0.8 + rng() * 0.4);
          if (hl - u - w < 0.1) w = hl - u;
          put(box(w - 0.014, low + 0.2, 0.04), tone(WOOD, 0.86 + rng() * 0.26), { x: u + w / 2, y: low / 2 - 0.13, z: depth + 0.015 });
          u += w;
        }
      }
    }
    // the pent roof: one slab from the wall down to its own eave
    const palette = roof === 'board' ? [WOOD, WOOD, WOOD_PALE] : THATCHES[roof];
    const t = roof === 'board' ? 0.06 : 0.15;
    const o = 0.22; // overhang
    const slope = (y1 - low) / depth;
    const yAt = (z) => y1 - slope * z;
    sub.add(mesh(hull([
      [-hl - o, yAt(0) + t, 0], [hl + o, yAt(0) + t, 0], [-hl - o, yAt(depth + o) + t, depth + o], [hl + o, yAt(depth + o) + t, depth + o],
      [-hl - o, yAt(0), 0], [hl + o, yAt(0), 0], [-hl - o, yAt(depth + o), depth + o], [hl + o, yAt(depth + o), depth + o],
    ]), tone(palette[0], 0.98)));
    if (roof !== 'board') {
      const z1 = depth * 0.55;
      sub.add(mesh(hull([
        [-hl - o + 0.03, yAt(0) + t + 0.05, 0], [hl + o - 0.03, yAt(0) + t + 0.05, 0], [-hl - o + 0.03, yAt(z1) + t + 0.05, z1], [hl + o - 0.03, yAt(z1) + t + 0.05, z1],
        [-hl - o + 0.03, yAt(0), 0], [hl + o - 0.03, yAt(0), 0], [-hl - o + 0.03, yAt(z1), z1], [hl + o - 0.03, yAt(z1), z1],
      ]), tone(palette[1], 0.98)));
      const n = Math.round((length + o * 2) / 0.36);
      for (let i = 0; i < n; i++) {
        const len = 0.12 + rng() * 0.14;
        put(box(0.22 + rng() * 0.1, t * 0.8, len), tone(palette[0], 0.84 + rng() * 0.22), {
          x: -hl - o + (i + 0.5) * ((length + o * 2) / n), y: yAt(depth + o + len / 2) + t * 0.5, z: depth + o + len / 2 - 0.05, rx: Math.atan(slope) + 0.1 + rng() * 0.14,
        });
      }
    } else {
      for (let i = 0; i < 3; i++) put(box(length + o * 2, 0.035, 0.05), WOOD_DARK, { y: yAt((i + 0.5) * (depth / 3)) + t + 0.02, z: (i + 0.5) * (depth / 3), shadow: false });
    }
    if (solid) {
      // its footprint, in the house's own frame, for the collider
      const wn = WALLS[wall];
      if (wn.nz) c.block(at - hl, wn.nz * hz, at + hl, wn.nz * (hz + depth));
      else c.block(wn.nx * hx, at - hl, wn.nx * (hx + depth), at + hl);
    }
    return sub;
  };

  // ---------- outbuildings ----------

  // A building of its own in the yard — a barn, a byre, a smithy, a sty, a
  // shelter on posts — raised exactly as a house is: build(b) is given a
  // cottage `b` of the size asked, to call shell(), door() and the rest on.
  //   u, v     where its middle stands, in this house's frame · ry: how it is turned
  //   length, width   its size (length along its own ridge)
  // Its walls stop a man like a house's (an 'open' one stops him at its posts).
  // Returns b. Things inside it are placed in ITS frame, through b.
  c.outbuilding = (u, v, ry, { length, width }, build) => {
    const cos = Math.cos(ry);
    const sin = Math.sin(ry);
    const out = (uu, vv) => [u + uu * cos + vv * sin, v - uu * sin + vv * cos]; // its frame → this house's
    let top = -Infinity;
    for (const a of [-0.5, 0, 0.5]) for (const b2 of [-0.5, 0, 0.5]) top = Math.max(top, ground(...out(a * length, b2 * width)));
    const floor = top - 0.04; // its own floor line, by the same rule as a house's
    const b = raiseCottage({ id: `${plot.id}-outbuilding`, length, width, door: ['front', 0] }, { ground: (uu, vv) => ground(...out(uu, vv)) - floor, seed: Math.floor(rng() * 1e6) + 17 });
    build(b);
    b.finish();
    b.g.position.set(u, floor, v);
    b.g.rotation.y = ry;
    g.add(b.g);
    c.openings.push(...b.openings);
    c.embers.push(...b.embers);
    for (const s of b.smokes) {
      const [su, sv] = out(s.u, s.v);
      c.smokes.push({ u: su, y: s.y + floor, v: sv });
    }
    if (b.open) {
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) c.solid(...out(sx * (length / 2 - 0.1), sz * (width / 2 - 0.1)), 0.14);
    } else {
      c.colliders.push({ u, v, halfU: length / 2, halfV: width / 2, ry });
    }
    for (const k of b.colliders) {
      if (k.r !== undefined) c.solid(...out(k.u, k.v), k.r);
      else if (k.ry !== undefined) c.colliders.push({ u: out(k.u, k.v)[0], v: out(k.u, k.v)[1], halfU: k.halfU, halfV: k.halfV, ry: ry + k.ry });
      else c.colliders.push({ u: out((k.u0 + k.u1) / 2, (k.v0 + k.v1) / 2)[0], v: out((k.u0 + k.u1) / 2, (k.v0 + k.v1) / 2)[1], halfU: (k.u1 - k.u0) / 2, halfV: (k.v1 - k.v0) / 2, ry });
    }
    return b;
  };

  // ---------- the frame, last ----------

  // Called by village.js once the house's own file has had its say: the
  // timber frame and the footing are fitted round whatever doors and windows
  // were cut. Safe to call twice.
  c.finish = () => {
    if (framed || !S) return c;
    framed = true;
    const timber = () => tone(S.timber, 0.9 + rng() * 0.22);
    const top = S.eave; // the walls show up to where the thatch starts
    // every wall in turn: a group on its face, x along it, z out of it
    const each = (fn) => {
      for (const wall of ['front', 'back', 'right', 'left']) {
        const sub = c.onWall(wall, 0, -S.skin);
        const end = wall === 'right' || wall === 'left';
        // a wall group's own x runs against the house's on the back wall and the right end
        const flip = wall === 'back' || wall === 'right';
        const cut = holes.filter((o) => o.wall === wall).map((o) => (flip ? { ...o, s0: -o.s1, s1: -o.s0 } : o));
        fn(sub, wall, end ? hz : hx, end, cut);
      }
    };
    const hit = (cut, s0, s1, y0, y1) => cut.some((o) => s1 > o.s0 && s0 < o.s1 && y1 > o.y0 && y0 < o.y1);
    // a level timber from -span to span at height y, left out wherever a hole crosses it
    const level = (sub, cut, span, y, h, d = 0.07, z = 0.025) => {
      let from = -span;
      const stops = cut.filter((o) => y + h / 2 > o.y0 && y - h / 2 < o.y1).sort((a, b) => a.s0 - b.s0);
      for (const o of [...stops, { s0: span, s1: span }]) {
        const to = Math.min(o.s0, span);
        if (to - from > 0.16) sub.add(mesh(box(to - from, h, d), timber(), { x: (from + to) / 2, y, z }));
        from = Math.max(from, o.s1);
      }
    };

    if (S.frame === 'box' || S.frame === 'cruck') {
      const heavy = S.frame === 'cruck';
      // corner posts, proud of both faces
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) c.add(box(0.17, top + 0.3, 0.17), timber(), { x: sx * (hx - 0.035), y: (top - 0.3) / 2, z: sz * (hz - 0.035) });
      each((sub, wall, span, end, cut) => {
        level(sub, cut, span - 0.05, 0.36, 0.14); // sill
        level(sub, cut, span - 0.05, top - 0.06, 0.12); // plate, or the tie across an end
        // posts at the bay lines, a rail between them, and foot braces leaning into the corners
        const bays = Math.max(1, Math.round((span * 2) / (heavy ? S.bay * 1.25 : S.bay)));
        for (let i = 1; i < bays; i++) {
          const s = -span + (i * span * 2) / bays;
          if (!hit(cut, s - 0.1, s + 0.1, 0.4, top)) sub.add(mesh(box(heavy ? 0.16 : 0.13, top - 0.42, 0.07), timber(), { x: s, y: (top + 0.42) / 2, z: 0.025 }));
        }
        if (!heavy) {
          level(sub, cut, span - 0.1, Math.min(1.2, top * 0.62), 0.09, 0.06);
          for (const s of [-1, 1]) {
            const x = s * (span - 0.4);
            if (span > 1.2 && !hit(cut, x - 0.36, x + 0.36, 0.42, 1.3)) sub.add(mesh(box(0.09, 0.95, 0.06), timber(), { x, y: 0.86, z: 0.025, rz: -s * 0.58 }));
          }
        }
        // in the gable above an end wall
        if (end && S.roof !== 'hip') {
          const apex = S.roof === 'halfhip' ? S.peak - S.sin * S.uh - 0.1 : S.peak - 0.12;
          if (heavy) {
            // the cruck: a pair of curved blades from the ground to the apex,
            // each drawn as three straight lengths, with a collar across them
            const knee = [span - 0.2, top * 0.72];
            const shoulder = [span * 0.56, S.eave + S.rise * 0.44];
            for (const s of [-1, 1]) {
              const pts = [[s * (span - 0.14), 0.1], [s * knee[0], knee[1]], [s * shoulder[0], shoulder[1]], [0, S.peak - 0.12]].filter(([, y]) => y <= apex + 0.3);
              for (let i = 0; i < pts.length - 1; i++) {
                const [x0, y0] = pts[i];
                const [x1, y1] = pts[i + 1];
                sub.add(mesh(box(0.2, Math.hypot(x1 - x0, y1 - y0) + 0.06, 0.08), timber(), { x: (x0 + x1) / 2, y: (y0 + y1) / 2, z: 0.035, rz: -Math.atan2(x1 - x0, y1 - y0) }));
              }
            }
            sub.add(mesh(box(span * 1.18, 0.14, 0.08), timber(), { y: S.eave + S.rise * 0.42, z: 0.04 }));
          } else {
            sub.add(mesh(box(0.12, apex - top, 0.07), timber(), { y: (apex + top) / 2, z: 0.025 })); // king post
            const cy = S.eave + S.rise * 0.5;
            if (cy < apex - 0.15) sub.add(mesh(box(span * 0.86, 0.09, 0.06), timber(), { y: cy, z: 0.025 })); // collar
          }
        }
      });
    } else if (S.frame === 'post') {
      // earthfast posts: round timbers set in the ground, a pole plate on their heads
      each((sub, wall, span, end, cut) => {
        const n = Math.max(2, Math.round((span * 2) / 1.35));
        for (let i = 0; i <= n; i++) {
          const s = -span + (i * span * 2) / n;
          if (i > 0 && i < n && hit(cut, s - 0.1, s + 0.1, 0, top)) continue;
          sub.add(mesh(cyl(0.07, 0.09, top + DEEP * 0.5, 6), timber(), { x: s * 0.985, y: (top - DEEP * 0.5) / 2, z: 0.03, rz: (rng() - 0.5) * 0.05 }));
        }
        sub.add(mesh(cyl(0.06, 0.06, span * 2 + 0.2, 6), timber(), { y: top - 0.05, z: 0.05, rz: Math.PI / 2 }));
        if (end && S.roof !== 'hip') sub.add(mesh(cyl(0.07, 0.09, S.peak - 0.3, 6), timber(), { y: (S.peak - 0.3) / 2, z: 0.03 })); // the ridge post
      });
    }

    // the footing: a stone plinth under framed walls, rough stones along its top
    if (S.walls === 'daub' || S.walls === 'plank') {
      const earthfast = S.frame === 'post';
      c.add(box(plot.length + 0.1, DEEP + 0.16, plot.width + 0.1), earthfast ? tone(S.wash, 0.74) : tone(STONE_DARK, 0.86), { y: (0.16 - DEEP) / 2 });
      if (!earthfast) {
        each((sub, wall, span, end, cut) => {
          let u = -span - 0.06;
          while (u < span + 0.02) {
            let len = 0.28 + rng() * 0.3;
            if (span + 0.06 - u - len < 0.14) len = span + 0.06 - u;
            if (!hit(cut, u, u + len, -0.5, 0.2)) {
              const peak = 0.24 + (rng() - 0.5) * 0.1;
              sub.add(mesh(box(len - 0.03, 0.5, 0.14 * (0.85 + rng() * 0.35)), tone(rng() < 0.5 ? STONE : STONE_DARK, 0.9 + rng() * 0.2), { x: u + len / 2, y: peak - 0.25, z: 0.07, ry: (rng() - 0.5) * 0.07 }));
            }
            u += len;
          }
        });
      }
    }
    return c;
  };

  // the yard's props join the cottage's own calls — and may never take the name of one
  const yard = toftKit(c);
  for (const name of Object.keys(yard)) if (name in c) throw new Error(`the yard kit's ${name} would replace the cottage's own c.${name}`);
  Object.assign(c, yard);
  return c;
}

// ---------- a house on its plot ----------

// The floor line: just under the highest ground the walls stand on, so a house
// on a slope sits on its plinth and never sinks its door into the hill.
export function floorOf(plot, terrainHeight) {
  let top = -Infinity;
  for (let i = 0; i <= 6; i++) {
    for (let j = 0; j <= 4; j++) {
      const p = houseToWorld(plot, (i / 6 - 0.5) * plot.length, (j / 4 - 0.5) * plot.width);
      top = Math.max(top, terrainHeight(p.x, p.z));
    }
  }
  return top - 0.04;
}

// One house, built by its own file (`house`: { build(c) }) and standing on
// its plot, not yet baked: { c, floor }. c is the cottage it was raised as;
// c.g is placed in the world.
export function raiseHouse(plot, house, terrainHeight) {
  const floor = floorOf(plot, terrainHeight);
  const ground = (u, v) => {
    const p = houseToWorld(plot, u, v);
    return terrainHeight(p.x, p.z) - floor;
  };
  const index = LAYOUT.houses.indexOf(plot);
  const c = raiseCottage(plot, { ground, seed: 7001 + index * 131 });
  house.build(c);
  c.finish();
  c.g.position.set(plot.x, floor, plot.z);
  c.g.rotation.y = plot.rotY;
  c.g.name = plot.id;
  return { c, floor };
}

// a rect turned on the map, as the collision step and the path-finder know it
export function turnedRect(x, z, halfX, halfZ, rotY) {
  return { x, z, halfX, halfZ, cos: Math.cos(rotY), sin: Math.sin(rotY) };
}

// a cottage's colliders, carried out of its own frame into the world
export function houseColliders(plot, c) {
  const out = [turnedRect(plot.x, plot.z, plot.length / 2, plot.width / 2, plot.rotY)];
  for (const k of c.colliders) {
    if (k.r !== undefined) {
      const p = houseToWorld(plot, k.u, k.v);
      out.push({ x: p.x, z: p.z, r: k.r });
    } else if (k.ry !== undefined) {
      // an outbuilding, turned within the yard
      const p = houseToWorld(plot, k.u, k.v);
      out.push(turnedRect(p.x, p.z, k.halfU, k.halfV, plot.rotY + k.ry));
    } else {
      const p = houseToWorld(plot, (k.u0 + k.u1) / 2, (k.v0 + k.v1) / 2);
      out.push(turnedRect(p.x, p.z, (k.u1 - k.u0) / 2, (k.v1 - k.v0) / 2, plot.rotY));
    }
  }
  return out;
}
