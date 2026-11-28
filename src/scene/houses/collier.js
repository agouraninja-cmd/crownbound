import * as THREE from 'three';
import { WASH, TIMBER, THATCHES, hull } from '../cottage.js';
import { span } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, WOOD_DARK, ROPE } from '../kit.js';

// The collier’s cottage: sooty and low, up at the wood's edge where his trade
// keeps him. What sets it apart is the charcoal. At the far end of the yard,
// as far from any thatch as the toft allows, a clamp is burning — billets
// stood on end under a coat of turf and earth, lit down the middle and left
// to smoulder for days, a thread of smoke at its crown. The ground about it
// is trodden black; cordwood for the next burn is ranked behind it, toward
// the wood, and the coals of the last lie heaped before it, toward the
// village, with two panniers already filled for the smith.

const TAU = Math.PI * 2;
const COAL = 0x1c1a18; // charcoal
const DUST = 0x1e1b19; // ...and the ground it has blackened
const COAT = 0x4e4034; // the clamp's skin: earth, and the dust of every burn before this one
const CROWN = 0x1f1c1a; // ...burnt black about the flue
const SODS = [0x6b583d, 0x5c4b35, 0x77643f, 0x59622f]; // turves, laid earth side out for the most part: three browns and a green
const GLOW = 0xc4521c; // the fire, seen down a vent
const WICKER = 0xa98a55;
const BARKS = [0x5e4a36, 0x6b5239, 0x57493b, 0x7a6a55]; // oak, ash, hazel, birch: whatever the coppice gave
const CUT = 0xc9ac76; // a billet's cut end

// flat facets from a list of triangles, each three [x, y, z] — for the
// shapes here that no box or hull will make
function facets(tris) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(tris.flat(2), 3));
  geo.computeVertexNormals();
  return geo;
}

// ---------- the black ground ----------

const PROUD = 0.06; // how far the black lies above the turf it covers: no facet of the ground shows through
const SUNK = 0.14; // ...and how far under the turf its edges run

// Charcoal dust trodden in for years: one sheet of facets laid on the real
// ground wherever one of `spreads` reaches — each [u, v, u, v, reach], a line
// he works along and how far the black lies from it. Its edges run down under
// the turf, so none shows. `covered(u, v)` is true where something stands
// over the ground anyway.
function blackGround(c, spreads, covered) {
  const { rng } = c;
  const [u0, v0, u1, v1] = c.plot.yard;
  const nu = Math.round((u1 - u0) / 0.55);
  const nv = Math.round((v1 - v0) / 0.55);
  // every corner of a grid laid over the yard, and how far above (or under) the turf the sheet lies there
  const grid = [];
  for (let j = 0; j <= nv; j++) {
    for (let i = 0; i <= nu; i++) {
      const u = u0 + (i / nu) * (u1 - u0);
      const v = v0 + (j / nv) * (v1 - v0);
      const fray = (rng() - 0.5) * 0.36; // no edge of it is a clean one
      let lift = -SUNK;
      // along the yard's own bound it is always under
      if (i > 0 && i < nu && j > 0 && j < nv) {
        for (const [au, av, bu, bv, reach] of spreads) {
          const along = Math.min(1, Math.max(0, ((u - au) * (bu - au) + (v - av) * (bv - av)) / ((bu - au) ** 2 + (bv - av) ** 2 || 1)));
          const gap = Math.hypot(u - au - along * (bu - au), v - av - along * (bv - av));
          lift = Math.max(lift, Math.min(PROUD, (reach + fray - gap) * 0.3));
        }
      }
      grid.push({ u, v, lift, at: [u, c.ground(u, v) + lift, v] });
    }
  }
  const deep = []; // black right across
  const edge = []; // where it thins out into the turf
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const a = grid[j * (nu + 1) + i];
      const b = grid[j * (nu + 1) + i + 1];
      const d = grid[(j + 1) * (nu + 1) + i];
      const e = grid[(j + 1) * (nu + 1) + i + 1];
      const four = [a, b, d, e];
      if (four.every((p) => p.lift < -0.03) || four.every((p) => covered(p.u, p.v))) continue;
      const into = four.every((p) => p.lift === PROUD) ? deep : edge;
      // cut each square the other way from its neighbours, so no grain shows
      if ((i + j) % 2) into.push([a.at, d.at, b.at], [b.at, d.at, e.at]);
      else into.push([a.at, d.at, e.at], [a.at, e.at, b.at]);
    }
  }
  c.g.add(mesh(facets(deep), DUST));
  c.g.add(mesh(facets(edge), tone(DUST, 1.25)));
}

// ---------- charcoal ----------

// one coal: the burnt end of a billet, long and angular
const COAL_SHAPE = hull([[-0.11, 0, -0.035], [0.1, 0, -0.03], [0.07, 0, 0.04], [-0.08, 0, 0.03], [-0.02, 0.075, 0], [0.05, 0.06, 0.01]]);

// Black shows no shape of its own, so a coal in three takes the light a
// little: the grey bloom charcoal has where it has rubbed.
function coal(g, rng, x, y, z, size = 1) {
  const m = mesh(COAL_SHAPE, tone(COAL, rng() < 0.35 ? 1.5 + rng() * 0.7 : 0.8 + rng() * 0.5), { x, y, z, ry: rng() * TAU, rz: (rng() - 0.5) * 0.6 });
  m.scale.setScalar(size * (0.8 + rng() * 0.6));
  g.add(m);
}

// a heap r across and h high: a rough cone, its foot under the ground
function heapShape(rng, r, h) {
  const pts = [[0, h, 0]];
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * TAU;
    const k = 0.85 + rng() * 0.3;
    pts.push([Math.cos(a) * r * k, -0.1, Math.sin(a) * r * k], [Math.cos(a + 0.4) * r * 0.5 * k, h * (0.5 + rng() * 0.25), Math.sin(a + 0.4) * r * 0.5 * k]);
  }
  return hull(pts);
}

// A heap of charcoal as it was raked off the last burn: loose coals on its
// flanks and about its foot.
function coalHeap(c, u, v, r, h) {
  const { rng } = c;
  const [u0, v0, u1, v1] = c.plot.yard;
  const g = c.at(u, v);
  g.add(mesh(heapShape(rng, r, h), COAL));
  const n = Math.round(r * 20);
  for (let i = 0; i < n; i++) {
    const a = rng() * TAU;
    const out = 0.3 + rng() * 0.95; // how far down its flank, or out past its foot
    const x = Math.cos(a) * r * out;
    const z = Math.sin(a) * r * out;
    if (u + x < u0 + 0.25 || u + x > u1 - 0.25 || v + z < v0 + 0.25 || v + z > v1 - 0.25) continue; // none rolls out of the yard
    coal(g, rng, x, out < 1 ? h * (1 - out) * 0.9 : 0.05, z);
  }
  c.solid(u, v, r * 0.75);
}

// A pair of panniers set down off the pony, full: deep wicker baskets, each
// flat on the side that lies against her, and the two ropes that go over the
// pack-saddle lying slack between them. They stand either side of (u, v).
function panniers(c, u, v, ry) {
  const { rng } = c;
  const g = c.at(u, v, ry);
  const apart = 0.17; // half the gap between their backs
  const tall = 0.52;
  for (const s of [-1, 1]) {
    // one pannier's outline at height y, widening to its mouth; grow: how far a band stands off its side
    const plan = (y, grow = 0) => {
      const half = 0.24 + (y / tall) * 0.07 + grow; // its length each way
      const deep = 0.3 + (y / tall) * 0.12 + grow; // how far it stands out from its flat back
      return [[-grow, -half * 0.94], [deep * 0.55, -half], [deep, -half * 0.5], [deep, half * 0.5], [deep * 0.55, half], [-grow, half * 0.94]].map(([x, z]) => [s * (apart + x), y, z]);
    };
    const hoop = (y0, y1, grow, colour) => g.add(mesh(hull([...plan(y0, grow), ...plan(y1, grow)]), colour));
    hoop(0, tall, 0, tone(WICKER, 0.92 + rng() * 0.14));
    hoop(0.14, 0.2, 0.01, tone(WICKER, 0.72)); // two bands of darker withies woven round it
    hoop(0.31, 0.37, 0.01, tone(WICKER, 0.72));
    hoop(tall - 0.03, tall + 0.04, 0.022, tone(WICKER, 0.8)); // the rim
    // heaped above the rim
    const heap = plan(tall, -0.03);
    for (let i = 0; i < 4; i++) heap.push([s * (apart + 0.1 + rng() * 0.22), tall + 0.1 + rng() * 0.09, (rng() - 0.5) * 0.3]);
    g.add(mesh(hull(heap), COAL));
    for (let i = 0; i < 4; i++) coal(g, rng, s * (apart + 0.08 + rng() * 0.26), tall + 0.1 + rng() * 0.04, (rng() - 0.5) * 0.36, 0.9);
  }
  for (const z of [-0.14, 0.14]) {
    for (const s of [-1, 1]) span(g, [s * apart, 0.54, z], [s * 0.02, 0.03, z * 0.8], 0.03, 0.03, ROPE, false);
  }
  c.solid(u, v, 0.52);
}

// ---------- cordwood ----------

// A billet lying along z: a length of coppice pole, or (three sides) a
// quarter cleft from a thicker one. Returns its bark and its two cut ends.
function billet(rng, r, long, sides) {
  const turn = rng() * TAU;
  const rim = Array.from({ length: sides }, (_, i) => {
    const a = turn + (i / sides) * TAU;
    const k = 0.86 + rng() * 0.28;
    return [Math.cos(a) * r * k, Math.sin(a) * r * k];
  });
  const h = long / 2;
  const bark = [];
  const ends = [];
  rim.forEach(([x0, y0], i) => {
    const [x1, y1] = rim[(i + 1) % sides];
    bark.push([[x0, y0, -h], [x1, y1, -h], [x1, y1, h]], [[x0, y0, -h], [x1, y1, h], [x0, y0, h]]);
    if (i > 0 && i < sides - 1) ends.push([[...rim[0], h], [x0, y0, h], [x1, y1, h]], [[...rim[0], -h], [x1, y1, -h], [x0, y0, -h]]);
  });
  return { bark: facets(bark), ends: facets(ends) };
}

// one billet laid in group g: r thick, `long` from end to end
function layBillet(g, rng, r, long, opts) {
  const cleft = rng() < 0.3;
  const { bark, ends } = billet(rng, cleft ? r * 1.25 : r, long, cleft ? 3 : 5);
  g.add(mesh(bark, tone(BARKS[Math.floor(rng() * BARKS.length)], 0.85 + rng() * 0.3), opts));
  g.add(mesh(ends, tone(CUT, 0.84 + rng() * 0.26), opts));
}

// Cordwood ranked for the next burn: billets laid across the stack (their
// cut ends to its two faces), course on course between a pair of stakes at
// each end. It runs `len` along the group's x. (The kit's woodpile is the
// hearth's: at two capped cylinders a log, a rank this long would cost more
// than the house.)
function cord(c, u, v, ry, len) {
  const { rng } = c;
  const g = c.at(u, v, ry, -0.035); // bedded a little into the ground, which is not level under its whole length
  const long = 0.74;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) g.add(mesh(cyl(0.035, 0.045, 1.35, 5), tone(WOOD_DARK, 0.9 + rng() * 0.3), { x: sx * (len / 2 + 0.05), y: 0.42, z: sz * 0.2, rz: -sx * 0.04 }));
  }
  for (let course = 0; course < 4; course++) {
    let x = -len / 2 + (course % 2 ? 0.07 : 0);
    while (x < len / 2 - 0.2) {
      const r = 0.095 + rng() * 0.03;
      // the top course is not made up yet
      if (course < 3 || rng() < 0.55) layBillet(g, rng, r, long * (0.9 + rng() * 0.16), { x: x + r, y: course * 0.2 + r * 0.92, z: (rng() - 0.5) * 0.07 });
      x += r * 1.96;
    }
  }
  const cos = Math.cos(ry);
  const sin = Math.sin(ry);
  for (const x of [-len / 3, 0, len / 3]) c.solid(u + x * cos, v - x * sin, 0.42);
}

// ---------- the clamp ----------

// Where it stands, and its outline from the ground to the crown as [how far
// out, how high]: steep at the foot, rounding over to a broad top.
const CLAMP = { u: -4.25, v: 1.2, sides: 9, top: 1.15, shape: [[1.2, 0], [1.06, 0.44], [0.8, 0.78], [0.46, 1.02], [0.17, 1.12]] };

function clamp(c) {
  const { rng } = c;
  const { u, v, sides, top, shape } = CLAMP;
  const g = c.at(u, v);
  const put = (geo, colour, opts) => g.add(mesh(geo, colour, opts));
  // nine-sided, and no side quite like the next; side 2 looks out of the front
  const spokes = Array.from({ length: sides }, (_, j) => ({ a: Math.PI / 2 + ((j - 2.5) / sides) * TAU, k: 0.93 + rng() * 0.12 }));
  const point = (j, ring) => {
    const { a, k } = spokes[j % sides];
    const [r, y] = shape[ring];
    return new THREE.Vector3(Math.cos(a) * r * k, y, Math.sin(a) * r * k);
  };
  const ring = (n) => spokes.map((_, j) => point(j, n).toArray());
  const skirt = spokes.map(({ a, k }) => [Math.cos(a) * 1.24 * k, -0.3, Math.sin(a) * 1.24 * k]); // its foot, under the turf
  put(hull([skirt, ring(0), ring(1), ring(2), ring(3)].flat()), COAT);
  put(hull([...ring(3), ...ring(4), [0, top, 0]]), CROWN);

  // One face of it: side j, band `band` of the outline (0 the foot). low and
  // high are the middles of its lower and upper edges, `out` the way it faces.
  const face = (j, band) => {
    const low = point(j, band).lerp(point(j + 1, band), 0.5);
    const high = point(j, band + 1).lerp(point(j + 1, band + 1), 0.5);
    const out = high.clone().sub(low).cross(point(j + 1, band).sub(point(j, band))).normalize();
    return { low, high, out };
  };
  // where a flat piece lies on that face, `up` of the way from its lower edge
  // to its upper and `proud` of it: box(thick, up the slope, round the clamp)
  const lie = (j, band, up, proud = 0) => {
    const { low, high, out } = face(j, band);
    const at = low.lerp(high, up).addScaledVector(out, proud);
    return { x: at.x, y: at.y, z: at.z, ry: -Math.atan2(out.z, out.x), rz: Math.asin(out.y) };
  };
  // a turf cut to that face and laid on it, from `from` to `to` of the way up
  const turf = (j, band, from, to) => {
    const { out } = face(j, band);
    const corners = [[j, from], [j + 1, from], [j, to], [j + 1, to]].map(([side, up]) => point(side, band).lerp(point(side, band + 1), up));
    const mid = corners.reduce((sum, p) => sum.add(p), new THREE.Vector3()).multiplyScalar(0.25);
    const fit = 0.88 + rng() * 0.1; // a seam between it and the next
    const thick = 0.035 + rng() * 0.04; // cut by eye, no two alike
    const slab = corners.flatMap((p) => {
      const q = mid.clone().lerp(p, fit);
      return [q.clone().addScaledVector(out, -0.02).toArray(), q.addScaledVector(out, thick).toArray()];
    });
    // nearer the crown the heat has had them
    put(hull(slab), tone(SODS[Math.floor(rng() * SODS.length)], (band ? 0.78 : 0.92) + rng() * 0.2));
  };

  // Turves laid like tiles from the ground up: two courses round the foot,
  // but for a gap left at each vent, and one on the shoulder wherever the
  // coat wanted patching.
  const vents = [1, 3, 5, 7];
  for (let j = 0; j < sides; j++) {
    const course = 0.42 + rng() * 0.16; // where the lower course ends and the upper begins
    if (!vents.includes(j)) turf(j, 0, 0.04, course);
    turf(j, 0, course, 1);
  }
  for (const j of [0, 3, 5, 6, 8]) turf(j, 1, 0.04, 0.55 + rng() * 0.45);
  // The vents, poked through the foot to draw the fire round; down the two
  // toward the village the fire shows.
  for (const j of vents) {
    put(box(0.04, 0.12, 0.16), 0x0d0b0a, lie(j, 0, 0.25, 0.004));
    if (j < 4) c.ember(box(0.02, 0.07, 0.1), GLOW, { ...lie(j, 0, 0.25, 0.02), in: g });
  }
  // the flue at the crown, stopped with a sod: the smoke finds its way out on either side of it
  put(box(0.24, 0.07, 0.2), tone(SODS[1], 0.8), { y: top + 0.02, ry: 0.5 });
  for (const s of [-1, 1]) c.smokeAt(u + s * 0.13, c.ground(u, v) + top + 0.08, v);

  // The ladder he goes up to tend the flue, laid on side 2: its foot stands
  // out on the ground and it bears on the clamp's shoulder.
  const lean = 0.72;
  const { out } = face(2, 0);
  const away = new THREE.Vector3(out.x, 0, out.z).normalize();
  const foot = Math.max(...shape.map(([, y], n) => point(2, n).dot(away) + y * Math.tan(lean))) + 0.04 / Math.cos(lean);
  const fu = u + away.x * foot;
  const fv = v + away.z * foot;
  c.ladder(fu, fv, { len: 1.6, lean, ry: Math.atan2(away.x, away.z), lift: c.ground(u, v) - c.ground(fu, fv) });

  c.solid(u, v, 1.2);
  c.solid(fu, fv, 0.2);
}

// The coat for the next burn: a heap of sifted earth and old dust, and a
// stack of fresh-cut turves beside it, grass to grass.
function coatHeap(c, u, v) {
  const { rng } = c;
  c.at(u, v).add(mesh(heapShape(rng, 0.55, 0.24), tone(COAT, 0.92)));
  c.solid(u, v, 0.4);
  const stack = c.at(u + 0.85, v - 0.1, 0.3);
  for (let i = 0; i < 4; i++) {
    stack.add(mesh(box(0.42, 0.075, 0.3), tone(i % 2 ? SODS[3] : SODS[1], 0.9 + rng() * 0.2), { x: (rng() - 0.5) * 0.05, y: 0.02 + i * 0.076, z: (rng() - 0.5) * 0.05, ry: (rng() - 0.5) * 0.2 }));
  }
}

export default {
  id: 'collier',
  name: 'The collier’s cottage',
  note: 'The collier’s cottage — a mound of earth and turf smoking at the yard’s end, the ground trodden black, and two panniers heaped with charcoal.',
  build(c) {
    const { rng, hx, hz } = c;
    c.shell({ eave: 1.4, pitch: 46, walls: 'daub', wash: WASH.soot, frame: 'post', timber: TIMBER.dark, roof: 'hip', thatch: 'heather', ridge: 'turf' });
    c.door(...c.plot.door, { open: 0.3, colour: 0x5c4a38 });
    c.window('front', 1.25, { w: 0.34, h: 0.3, bars: 1, shutter: 'side' });
    // No hole in this roof: the smoke soaks out through the ling all round the
    // ridge, and has blackened the head of both slopes and of both hips.
    c.smoke('seep', 0);
    c.smoke('seep', 0, { lit: false, side: -1 });
    const stain = tone(THATCHES.heather[1], 0.58);
    const head = c.onRoof(1, 0, 0).y; // the thatch's top, at the ridge
    const fall = Math.tan(c.pitch);
    for (const end of [-1, 1]) {
      // from the ridge's end: how far out along it, how far above the thatch's top, how far to one side
      const at = (out, up, z) => [end * (hx - hz - 0.06 + out), head + up, z];
      // The ridge's end, matted thick with soot. (It also takes in the corners
      // of the stain, which the kit lays square across a roof that narrows.)
      c.add(hull([at(-0.06, 0.04, 0), at(0.13, 0.04, 0), ...[-1, 1].flatMap((s) => [at(-0.06, 0.04 - fall * 0.29, s * 0.29), at(0.25, 0.04 - fall * 0.29, s * 0.29)])]), stain);
      // ...and a ragged tongue of it down the hip below, kept within the hip's own two edges
      const tongue = [[0.2, 0.12], [0.5, 0.3], [0.64, 0.05], [0.6, -0.12], [0.46, -0.28], [0.2, -0.12]];
      const on = (down, z, above) => at(Math.cos(c.pitch) * down + Math.sin(c.pitch) * above, Math.cos(c.pitch) * above - Math.sin(c.pitch) * down, z);
      c.add(hull(tongue.flatMap(([down, z]) => [on(down, z, 0.002), on(down, z, 0.02)])), stain, { shadow: false });
    }

    // ---------- the charcoal: before the house, toward the village ----------
    blackGround(
      c,
      [
        [CLAMP.u, CLAMP.v, CLAMP.u, CLAMP.v, 1.9], // the hearth the clamp stands on
        [-5.0, 2.7, -2.75, 2.6, 0.75], // where the coals are raked out and sorted
        [-2.75, 2.6, 1.75, 2.6, 0.5], // ...the way they are carried, past his own door
        [1.75, 2.6, 1.75, 2.6, 0.8], // ...and where they are loaded
      ],
      (u, v) => Math.hypot(u - CLAMP.u, v - CLAMP.v) < 1 || (Math.abs(u) < hx - 0.1 && Math.abs(v) < hz - 0.1),
    );
    clamp(c);
    coalHeap(c, -2.75, 2.5, 0.55, 0.42);
    coalHeap(c, -5.0, 2.72, 0.34, 0.24);
    c.tool(-2.62, 2.42, { kind: 'spade', lean: 0.12, ry: 2.2 });
    panniers(c, 1.75, 2.6, 0.12);
    // what fell on the way
    for (const [u, v] of [[-1.7, 2.75], [-1.2, 2.5], [0.55, 2.8], [0.9, 2.45]]) coal(c.at(u, v), rng, 0, 0.05, 0);
    c.bench(-1.5, hz + 0.42, { len: 0.95 });
    // his riddle left on the bench, the last siftings still in it: the coals are parted from the dust before they are sold
    const riddle = c.at(-1.38, hz + 0.43, 0, 0.45);
    riddle.add(mesh(cyl(0.2, 0.19, 0.08, 9), 0x8f7a55, { y: 0.04 }));
    riddle.add(mesh(cyl(0.17, 0.17, 0.02, 9), tone(DUST, 1.5), { y: 0.075, shadow: false }));

    // ---------- the wood: behind, toward where it grew ----------
    cord(c, -4.3, -2.85, 0, 2.0);
    c.chopBlock(-2.9, -2.2, { ry: 0.6 });
    const strewn = c.at(-3.45, -1.65);
    for (let i = 0; i < 5; i++) layBillet(strewn, rng, 0.1, 0.7, { x: (rng() - 0.5) * 0.9, y: 0.065, z: (rng() - 0.5) * 0.7, ry: rng() * TAU });
    coatHeap(c, -4.85, -0.8);
    // water, to quench the coals as they are drawn
    c.barrel(-2.5, -1.85, { lid: false });
    c.bucket(-2.95, -1.5, { water: true });
    c.tool(-1.2, -hz - 0.5, { kind: 'rake', len: 1.45, lean: 0.35, ry: Math.PI });

    // ---------- and the little there is besides ----------
    // one panel of the back wall daubed afresh, not yet smoked to the colour of the rest
    const mend = [[-0.5, 0.25], [0.45, 0.2], [0.55, 0.7], [0.35, 1.2], [-0.3, 1.27], [-0.55, 0.85]];
    c.onWall('back').add(mesh(hull(mend.flatMap(([x, y]) => [[x, y, 0.004], [x, y, 0.016]])), tone(WASH.daub, 0.9)));
    c.bed(-0.4, -3.15, 1.5, -2.45, { crop: 'worts' });
    c.midden(2.2, -2.55, { r: 0.45 });
    c.bush(-1.9, -2.85, { r: 0.34 }); // elder, where nobody digs
  },
};
