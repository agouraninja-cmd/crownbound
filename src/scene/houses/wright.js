import * as THREE from 'three';
import { WASH, TIMBER, hull } from '../cottage.js';
import { span, cone } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, WOOD, WOOD_DARK, WOOD_PALE, IRON } from '../kit.js';

// The wright’s house: he makes the village's carts, ploughs and doors, and
// his yard says so before his house does. A log lies on two trestles half
// hewn into a beam, the axe still in it; a cart wheel waits on its last two
// felloes against the wall; by the lane a log lies cleft in two, wedges
// walking down one half, and the planks of the last one season under his
// lean-to with a stick between each. Pale chips lie wherever he has worked.
// Nothing here is sawn: timber is cleft and hewn.

const HEWN = 0xd8c28e; // oak fresh off the axe
const CHIP = 0xe8d8ac; // ...and what the axe throws off it
const BARK = 0x6a5139;
const ELM = 0x8f6e47; // the nave's wood: it will not split
const ASH = 0xddd0a6; // the felloes' wood: it bends before it breaks

// one chip: a flat shard, stretched and turned where it lies
const FLAKE = hull([[-0.09, 0, -0.03], [0.1, 0, -0.045], [0.02, 0, 0.05], [0, 0.04, 0.005]]);

// Chips thrown about a spot where he works: n of them, thickest at (u, v) and
// thinning out to `reach` each way. None fall under the house, under the
// doorstep before its front door, or out of the yard.
function chips(c, u, v, reach, n) {
  const [u0, v0, u1, v1] = c.plot.yard;
  for (let i = 0; i < n; i++) {
    const cu = u + (c.rng() + c.rng() - 1) * reach[0];
    const cv = v + (c.rng() + c.rng() - 1) * reach[1];
    const indoors = Math.abs(cu) < c.hx + 0.15 && Math.abs(cv) < c.hz + 0.15;
    const onStep = Math.abs(cu - c.plot.door[1]) < 0.62 && cv > 0 && cv < c.hz + 0.78;
    if (indoors || onStep || cu < u0 + 0.25 || cu > u1 - 0.25 || cv < v0 + 0.25 || cv > v1 - 0.25) continue;
    const flake = mesh(FLAKE, tone(CHIP, 0.86 + c.rng() * 0.2), { y: -0.008 });
    flake.scale.set(0.8 + c.rng(), 0.7 + c.rng() * 0.8, 0.7 + c.rng() * 0.8);
    c.at(cu, cv, c.rng() * 6.28).add(flake);
  }
}

// A log half hewn into a beam, up on two trestles: the near end already square
// and pale, the far end still in its bark, scored down the side for the next
// stretch. `from` and `to` are where the trestles stand; the whole rest lies
// along the fall of the ground between them.
function beam(c, from, to) {
  const [u0, v0] = from;
  const [u1, v1] = to;
  const apart = Math.hypot(u1 - u0, v1 - v0);
  const rest = c.at((u0 + u1) / 2, (v0 + v1) / 2, -Math.atan2(v1 - v0, u1 - u0));
  rest.position.y = (c.ground(u0, v0) + c.ground(u1, v1)) / 2;
  rest.rotation.z = Math.atan2(c.ground(u1, v1) - c.ground(u0, v0), apart);
  const put = (geo, colour, opts) => rest.add(mesh(geo, colour, opts));

  // the trestles: a bar on four splayed legs
  for (const end of [-1, 1]) {
    const x = (end * apart) / 2;
    put(box(0.13, 0.11, 0.9), tone(WOOD, 0.9 + c.rng() * 0.15), { x, y: 0.56 });
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) put(box(0.07, 0.66, 0.07), WOOD_DARK, { x: x + sx * 0.1, y: 0.26, z: sz * 0.36, rx: -sz * 0.26, rz: sx * 0.16 });
    }
  }

  const x0 = -apart / 2 - 0.5;
  const x1 = apart / 2 + 0.5;
  const shoulder = 0.15; // where the squared length ends and the round begins
  const y = 0.755; // the beam's middle, lying on the bars
  const girth = (x) => 0.19 + (0.02 * (x - shoulder)) / (x1 - shoulder); // the log thickens toward its butt
  put(box(shoulder - x0, 0.28, 0.28), HEWN, { x: (x0 + shoulder) / 2, y });
  put(cyl(girth(shoulder), girth(x1), x1 - shoulder, 8), BARK, { x: (shoulder + x1) / 2, y, rz: Math.PI / 2 });
  put(new THREE.CircleGeometry(0.2, 8), HEWN, { x: x1 + 0.003, y, ry: Math.PI / 2 }); // the butt's pale end
  // scored for hewing: a notch chopped through the bark to the line, every foot or so
  for (let i = 0; i < 3; i++) {
    const x = shoulder + 0.2 + i * 0.3;
    const r = girth(x) + 0.01;
    put(new THREE.CylinderGeometry(r, r, 0.08, 4, 1, true, -0.7, 1.9), tone(HEWN, 0.96), { x, y, rz: Math.PI / 2 });
  }

  // the broad axe, struck into the log where he left off: its blade widens
  // from the eye to the edge, and the haft stands up out of it
  const eye = [shoulder + 0.5, y + 0.3];
  const blade = [];
  for (const [along, half] of [[0, 0.045], [0.19, 0.11]]) {
    for (const s of [-1, 1]) for (const z of [-0.018, 0.018]) blade.push([eye[0] + (along + s * half) * Math.SQRT1_2, eye[1] + (s * half - along) * Math.SQRT1_2, z]);
  }
  put(hull(blade), IRON);
  put(box(0.64, 0.045, 0.045), WOOD, { x: eye[0] + 0.2, y: eye[1] + 0.2, rz: Math.PI / 4 });
  // the adze, hooked over the squared end by its blade, the haft hanging down the near face
  const ax = x0 + 0.42;
  const top = y + 0.143;
  put(box(0.04, 0.62, 0.04), WOOD, { x: ax + 0.03, y: y - 0.15, z: 0.165, rz: 0.1 });
  put(hull([-1, 1].flatMap((s) => [[ax + s * 0.03, top, 0.185], [ax + s * 0.03, top + 0.035, 0.185], [ax + s * 0.075, top, 0.01], [ax + s * 0.075, top + 0.012, 0.01]])), IRON);

  for (const k of [0, 0.5, 1]) c.solid(u0 + (u1 - u0) * k, v0 + (v1 - v0) * k, k === 0.5 ? 0.32 : 0.45);
}

const RIM = 0.62; // the wheel's radius...
const RIM_IN = 0.52; // ...and its felloes' inner edge

// A felloe: a sixth of the rim, from angle a (0 is the top, turning toward
// -x) about a middle cy high. Cut from one piece of ash, and built as one
// piece too: the village's bake lets nothing small throw a shadow, and a
// wheel whose rim threw none would look wrong against the wall.
function felloe(a, cy) {
  const half = 0.035; // half its thickness
  const at = (r, b, z) => [-r * Math.sin(b), cy + r * Math.cos(b), z];
  const soup = [];
  const quad = (p, q, r, s) => soup.push(...p, ...q, ...r, ...p, ...r, ...s);
  for (let j = 0; j < 2; j++) {
    const b0 = a + (j * Math.PI) / 6;
    const b1 = b0 + Math.PI / 6;
    quad(at(RIM_IN, b0, half), at(RIM, b0, half), at(RIM, b1, half), at(RIM_IN, b1, half)); // its face
    quad(at(RIM_IN, b0, -half), at(RIM_IN, b1, -half), at(RIM, b1, -half), at(RIM, b0, -half)); // its back
    quad(at(RIM, b0, half), at(RIM, b0, -half), at(RIM, b1, -half), at(RIM, b1, half)); // the tread
    quad(at(RIM_IN, b0, half), at(RIM_IN, b1, half), at(RIM_IN, b1, -half), at(RIM_IN, b0, -half)); // the inside
  }
  const end = a + Math.PI / 3;
  quad(at(RIM_IN, a, half), at(RIM_IN, a, -half), at(RIM, a, -half), at(RIM, a, half)); // the two cut ends
  quad(at(RIM_IN, end, half), at(RIM, end, half), at(RIM, end, -half), at(RIM_IN, end, -half));
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(soup, 3));
  return geo;
}

// A cart wheel half made, its rim standing at (u, v) and leaned back on the
// front wall: the nave, all twelve spokes, and four of its six felloes fitted
// — the last four spokes stand bare. No tyre yet.
function wheel(c, u, v) {
  const g = c.at(u, v);
  g.rotation.x = -0.22; // far enough over that the nave's back clears the wall
  const put = (geo, colour, opts) => g.add(mesh(geo, colour, opts));
  // the nave, narrower toward the linchpin end, and the axle's hole through it
  put(cyl(0.1, 0.14, 0.28, 8), ELM, { y: RIM, z: 0.04, rx: Math.PI / 2 });
  put(new THREE.CircleGeometry(0.05, 6), 0x2a1f16, { y: RIM, z: 0.183, shadow: false });
  // the spokes, two to a felloe, driven well into the nave
  for (let i = 0; i < 12; i++) {
    const a = ((i + 0.5) / 12) * Math.PI * 2;
    put(box(0.05, 0.5, 0.04), tone(HEWN, 0.88 + c.rng() * 0.14), { x: -Math.sin(a) * 0.31, y: RIM + Math.cos(a) * 0.31, rz: a });
  }
  for (let k = 0; k < 4; k++) put(felloe((k * Math.PI) / 3, RIM), tone(ASH, 0.88 + c.rng() * 0.14));
  for (const s of [-1, 1]) c.solid(u + s * 0.3, v - 0.12, 0.24);
}

// The two felloes still to be fitted, lying where he will want them: one flat
// on the ground at (u, v), the other across it with one end in the grass.
function looseFelloes(c, u, v, ry) {
  const lay = (spot) => {
    const flat = new THREE.Group();
    flat.rotation.x = -Math.PI / 2; // the wheel's own plane, laid on the ground
    flat.add(mesh(felloe(-Math.PI / 6, -(RIM + RIM_IN) / 2), tone(ASH, 0.9 + c.rng() * 0.12)));
    spot.add(flat);
  };
  lay(c.at(u, v, ry, 0.035));
  const across = ry + 1.2;
  const upper = c.at(u - 0.26 * Math.cos(across), v + 0.26 * Math.sin(across), across, 0.071);
  upper.rotation.z = 0.12; // tipped: its far end rests on the first
  lay(upper);
}

const RIND = 0.03; // how thick the bark is

// half a log lying along x, its cleft face up at height r
function halfLog(r, len) {
  const pts = [];
  for (const x of [-len / 2, len / 2]) for (const t of [-1, -0.5, 0, 0.5, 1]) pts.push([x, r - r * Math.cos((t * Math.PI) / 2), r * Math.sin((t * Math.PI) / 2)]);
  return hull(pts);
}

// A log being riven. It has been halved already and the halves lie cleft face
// up, along the group's x; one is being quartered, wedges walked down the
// split, and the beetle that drives them rests on the other.
function rivenLog(c, u, v, ry) {
  const g = c.at(u, v, ry);
  const r = 0.2;
  const len = 2;
  const face = r + RIND + 0.006; // the pale wood stands a hair proud of its bark
  const halves = [-1, 1].map((s) => {
    const half = new THREE.Group();
    half.position.set(s * 0.12, 0, s * 0.235);
    half.add(mesh(halfLog(r, len), tone(HEWN, s > 0 ? 1 : 0.93), { y: face - r }));
    half.add(mesh(halfLog(r + RIND, len - 0.05), BARK));
    g.add(half);
    return half;
  });
  // the split, opening toward the end the wedges began at: two of iron and a wooden glut
  halves[1].add(mesh(hull([[-0.5, 0, 0], [1, 0, -0.04], [1, 0, 0.04], [-0.5, 0.012, 0], [1, 0.012, -0.04], [1, 0.012, 0.04]]), 0x33261a, { x: 0.003, y: face - 0.004 }));
  [[0.72, IRON], [0.28, WOOD_PALE], [-0.16, IRON]].forEach(([x, colour]) => halves[1].add(mesh(cone(0.06, 0.24, 4), colour, { x, y: face + 0.08, rx: Math.PI })));
  // the beetle
  halves[0].add(mesh(cyl(0.1, 0.1, 0.27, 6), tone(WOOD, 0.9), { x: -0.2, y: face + 0.1, rx: Math.PI / 2 }));
  span(halves[0], [-0.24, face + 0.1, 0], [0.52, face + 0.03, 0.05], 0.04, 0.04, WOOD_PALE);
  const cos = Math.cos(ry);
  const sin = Math.sin(ry);
  for (const x of [-0.7, 0, 0.7]) c.solid(u + x * cos, v - x * sin, 0.48);
}

// Riven planks stacked to season, a stick between each course so the air can
// get at them. They lie along the group's x, on two bearers off the wet
// ground. Returns how high the top course stands.
function plankStack(c, u, v, ry) {
  const g = c.at(u, v, ry);
  const { rng } = c;
  const thick = 0.05;
  for (const x of [-0.62, 0.62]) g.add(mesh(box(0.13, 0.26, 0.82), WOOD_DARK, { x, y: 0 }));
  let y = 0.13;
  [3, 3, 3, 2].forEach((planks, course) => {
    for (let k = 0; k < planks; k++) {
      // cleft, not sawn: no two the same width or length
      const len = 1.85 + rng() * 0.3;
      g.add(mesh(box(len, thick, 0.19 + rng() * 0.03), tone(HEWN, 0.84 + rng() * 0.2), { x: (rng() - 0.5) * 0.16, y: y + thick / 2, z: (k - 1) * 0.26, ry: (rng() - 0.5) * 0.02 }));
    }
    y += thick;
    if (course < 3) {
      for (const x of [-0.62, 0.62]) g.add(mesh(box(0.05, 0.045, 0.8), WOOD, { x: x + (rng() - 0.5) * 0.08, y: y + 0.0225 }));
      y += 0.045;
    }
  });
  return y;
}

// timber waiting: three trunks as they came from the wood, lopped and topped,
// butts toward +z and tapering away from them
function logPile(c, u, v, ry) {
  const g = c.at(u, v, ry);
  for (const [x, y, r, len] of [[-0.24, 0.22, 0.23, 2.5], [0.22, 0.19, 0.2, 2.3], [0.02, 0.55, 0.18, 1.9]]) {
    const log = new THREE.Group();
    log.position.set(x, y, (c.rng() - 0.5) * 0.3);
    log.rotation.y = (c.rng() - 0.5) * 0.12;
    const bark = tone(BARK, 0.88 + c.rng() * 0.24);
    log.add(mesh(cyl(r * 0.7, r, len, 8), bark, { rx: Math.PI / 2 }));
    log.add(mesh(new THREE.CircleGeometry(r * 0.9, 8), tone(HEWN, 0.9), { z: len / 2 + 0.003 }));
    // the stubs of its lopped branches, up toward the top
    for (const z of [-0.36, -0.08]) {
      const a = (c.rng() - 0.5) * 2;
      log.add(mesh(cyl(0.035, 0.05, 0.2, 5), bark, { x: Math.sin(a) * r * 0.8, y: Math.cos(a) * r * 0.8, z: z * len, rz: -a }));
    }
    g.add(log);
  }
  const cos = Math.cos(ry);
  const sin = Math.sin(ry);
  for (const z of [-0.8, 0, 0.8]) c.solid(u + z * sin, v + z * cos, 0.45);
}

export default {
  id: 'wright',
  name: 'The wright’s house',
  note: 'The wright’s house — a beam half hewn on its trestles, a cart wheel short of two felloes, and pale chips trodden into every path.',
  build(c) {
    c.shell({ eave: 1.75, pitch: 50, walls: 'daub', wash: WASH.daub, frame: 'box', timber: TIMBER.new, roof: 'halfhip', thatch: 'reed', barge: true });
    c.door(...c.plot.door, { open: 0.35, colour: 0xa98f62 }); // a new door of his own making
    // set a hand lower than most, so the plate runs whole above them
    c.window('front', 1.5, { y: 1.33, shutter: 'side' });
    c.window('left', 0.6, { y: 1.33 });
    // a gablet at each end of the ridge; the hearth is under the far one
    c.smoke('gablet', 1);
    c.smoke('gablet', -1, { lit: false });

    // the hewing, out in front where the light is
    beam(c, [1.5, 2.6], [3.35, 2.5]);
    chips(c, 2.3, 2.6, [2.0, 0.75], 70);
    // the slabs knocked off between the notches lie where they fell, bark up or bark down
    [[2.62, 2.88], [2.9, 2.97], [3.08, 2.8], [3.7, 2.84], [3.66, 2.6]].forEach(([u, v], i) => {
      c.at(u, v, c.rng() * 3).add(mesh(box(0.3, 0.05, 0.12), i % 2 ? BARK : tone(HEWN, 0.94), { y: 0.02, rz: (c.rng() - 0.5) * 0.2 }));
    });
    c.beast(2.0, 2.92, { kind: 'hen', colour: 0x8a5a34, ry: 2.5 }); // after the grubs the axe turns out
    chips(c, -0.5, 2.8, [1.5, 0.45], 12); // trodden toward the door

    wheel(c, -1.95, 2.06);
    looseFelloes(c, -3.05, 2.05, 0.5);
    chips(c, -2.2, 2.4, [1.0, 0.45], 12);

    // the riving, at the gable by the lane, where the logs are dragged in...
    rivenLog(c, -3.22, 0.45, -Math.PI / 2);
    chips(c, -3.2, 0.3, [0.5, 1.9], 18);
    // ...and the newest clefts stood against the wall to dry before they are stacked
    for (let i = 0; i < 3; i++) {
      const len = 1.7 + c.rng() * 0.25;
      const lean = 0.2 + c.rng() * 0.05;
      const foot = -c.hx - 0.08 - len * Math.sin(lean);
      c.at(foot, -1.5 + i * 0.25, -Math.PI / 2).add(mesh(box(0.2, len, 0.04), tone(HEWN, 0.84 + c.rng() * 0.2), { y: (len / 2) * Math.cos(lean), z: (-len / 2) * Math.sin(lean), rx: -lean, rz: (c.rng() - 0.5) * 0.04 }));
    }
    c.solid(-2.86, -1.25, 0.4); // no way through them

    // his lean-to along the back, where the planks season: open to the yard
    // and the lane, boarded at the far end and half way along from it
    const size = { length: 2.8, depth: 1.35, high: 1.65, low: 1.25 };
    const shed = c.leanTo('back', -1.1, { ...size, walls: 'open', roof: 'board' });
    const board = () => tone(WOOD, 0.86 + c.rng() * 0.26);
    for (let i = 0; i < 5; i++) {
      const z = 0.04 + (i + 0.5) * 0.26;
      const top = size.high - ((size.high - size.low) / size.depth) * z - 0.02; // up to the pent roof
      shed.add(mesh(box(0.04, top + 0.6, 0.245), board(), { x: -size.length / 2, y: (top - 0.6) / 2, z }));
    }
    for (let i = 0; i < 4; i++) shed.add(mesh(box(0.25, size.low + 0.58, 0.04), board(), { x: -size.length / 2 + 0.02 + (i + 0.5) * 0.265, y: (size.low - 0.62) / 2, z: size.depth }));
    const stackTop = plankStack(c, -1.4, -2.38, 0);
    c.beast(-1.1, -2.5, { kind: 'cat', lift: stackTop, ry: 2.4 }); // asleep on the top course
    chips(c, -1.2, -3.0, [1.6, 0.3], 10);

    // timber waiting at the far gable, and the leeks behind the house
    logPile(c, 3.3, -0.7, 0);
    c.bed(0.9, -3.2, 2.5, -2.3, { crop: 'leeks', rows: 2 });
  },
};
