// World layout: one shared map of where everything stands.
// The dirt path winds along z; pathX(z) gives its centerline.
import { CONFIG } from '../state/config.js';

export function pathX(z) {
  return Math.sin(z * 0.045) * 5;
}

// Which way north lies: the world's +x axis, turned this far toward +z. The
// Charter puts the miller's strip to the north-east; this turn does that. The
// map is drawn by it, and the sun rises and sets by it.
export const NORTH = 0.45;

export const LAYOUT = {
  playerSpawn: { x: -5, z: 4 },
  hovel: { x: -9, z: 2, rotY: 0 }, // door on local +x faces the path
  hovelFloor: { halfX: 1.9, halfZ: 1.65 }, // the hovel's footprint plus a margin: bare earth, no grass grows
  campfire: { x: -4.6, z: 6.2 },
  questBoard: { x: 4, z: -2, rotY: -Math.PI / 2 },
  tome: { x: -3.2, z: -5.5, rotY: Math.PI / 4 },
  charter: { x: 1.2, z: 0.4, rotY: -0.9 }, // the Village Charter post, parchment toward the westward path
  exchequer: { x: 6.5, z: 3, rotY: Math.PI + 0.15 }, // money-changer's booth, counter toward the path
  cart: { x: 3.2, z: 8.5, rotY: Math.PI / 2 + 0.15 }, // the chapman parks here on market days, mule toward the village
  dummy: { x: -8.5, z: 9.5 },
  granary: { x: 11, z: 11, rotY: -Math.PI / 5 },
  miller: { x: 9.0, z: 9.3, rotY: 2.44 }, // minding his granary, facing the village
  // The miller's strip: out past his granary to the north-east, fenced, its
  // gate toward the village. Its ridges run `length` along the field's own x,
  // side by side `spacing` apart along its z (how many: CONFIG.farm.rows);
  // `margin` is the grassy headland between the ploughland and the fence.
  field: { x: 27, z: 33, rotY: 0.6, length: 18.4, spacing: 1.4, margin: 1.3 },
  fieldTrackEnd: { x: 13.6, z: 14.4 }, // where the cart track from the gate meets the granary yard
  // The neighbours' houses: 24 of them, each built by its own file in
  // src/scene/houses/ and stood here by village.js. `length` runs along the
  // ridge and `width` across it; rotY turns the house on the map (its front,
  // the house's own +z, then looks along (sin rotY, cos rotY)). `door` is the
  // wall and the place along it of the main door — the ground is worn up to
  // it. `yard` is [u0, v0, u1, v1] in the house's own frame (u along the
  // ridge, v out of the front): everything in its toft stands inside that.
  // `row` is the handful of neighbours it is drawn with, in one batch.
  // `seed` is the house's own stream of chance — its weathering, its footing
  // stones, where its hens stand. Each house was built and looked at with the
  // number it has: change one and that house is re-rolled.
  houses: [
    // north of the green, on the knoll, and west along the road
    { id: 'reeve', row: 'north', seed: 7001, x: 16.2, z: -3.4, rotY: -1.449, length: 7.4, width: 3.8, door: ['front', -0.9], yard: [-4.0, -4.4, 5.6, 3.0] },
    { id: 'alewife', row: 'north', seed: 7132, x: 10.8, z: -11.8, rotY: -1.99, length: 5.2, width: 3.4, door: ['front', 0.5], yard: [-3.4, -2.6, 3.2, 3.4] },
    { id: 'smith', row: 'north', seed: 7263, x: 7.6, z: -19.8, rotY: -1.71, length: 5.2, width: 3.4, door: ['front', 0.7], yard: [-4.4, -2.6, 3.2, 4.4] },
    { id: 'potter', row: 'north', seed: 7394, x: 15.5, z: -37.0, rotY: 0.14, length: 4.2, width: 3.0, door: ['front', 0.4], yard: [-3.6, -4.6, 4.0, 3.0] },
    // south-west, about the birches
    { id: 'flaxwife', row: 'west', seed: 7525, x: -15.8, z: -7.8, rotY: 1.466, length: 6.4, width: 3.5, door: ['front', 0.8], yard: [-4.4, -3.0, 4.2, 1.9] },
    { id: 'wright', row: 'west', seed: 7656, x: -14.0, z: -18.5, rotY: 1.658, length: 5.2, width: 3.4, door: ['front', -0.5], yard: [-3.8, -3.4, 4.0, 3.2] },
    { id: 'turfhut', row: 'west', seed: 7787, x: -25.5, z: -18.0, rotY: 0.14, length: 4.2, width: 3.0, door: ['front', 0.3], yard: [-3.2, -3.0, 3.2, 3.0] },
    { id: 'wellhouse', row: 'west', seed: 7918, x: -22.8, z: -10.2, rotY: 3.246, length: 5.2, width: 3.4, door: ['front', -0.4], yard: [-3.6, -3.0, 3.8, 3.6] },
    { id: 'newhouse', row: 'west', seed: 8049, x: -32.0, z: -10.6, rotY: 1.571, length: 5.2, width: 3.4, door: ['front', 0.5], yard: [-3.6, -2.0, 3.6, 3.0] },
    // south, down the oak lane
    { id: 'goosewife', row: 'south', seed: 8180, x: -20.2, z: -0.6, rotY: -0.087, length: 4.6, width: 3.2, door: ['front', 0.6], yard: [-3.4, -2.8, 3.4, 3.0] },
    { id: 'oxhouse', row: 'south', seed: 8311, x: -30.2, z: -0.6, rotY: 0.07, length: 8.6, width: 3.6, door: ['front', -0.6], yard: [-5.4, -3.4, 5.4, 3.6] },
    { id: 'cruckhouse', row: 'south', seed: 8442, x: -22.4, z: 11.4, rotY: 1.71, length: 7.0, width: 3.6, door: ['front', 0.7], yard: [-4.2, -3.0, 4.2, 4.2] },
    { id: 'dairy', row: 'south', seed: 8573, x: -32.6, z: 12.6, rotY: 3.072, length: 8.2, width: 3.6, door: ['front', 0.8], yard: [-5.2, -3.6, 5.2, 3.4] },
    { id: 'cottar', row: 'south', seed: 8704, x: -39.6, z: -9.6, rotY: 0.349, length: 4.4, width: 3.2, door: ['front', -0.3], yard: [-3.4, -3.0, 2.6, 3.2] },
    // east, between the green and the wood
    { id: 'beekeeper', row: 'east', seed: 8835, x: -12.0, z: 18.2, rotY: 1.815, length: 5.2, width: 3.4, door: ['front', -0.7], yard: [-3.0, -3.4, 3.2, 2.2] },
    { id: 'shepherd', row: 'east', seed: 8966, x: -19.5, z: 19.6, rotY: 3.351, length: 5.2, width: 3.4, door: ['front', 0.5], yard: [-3.8, -3.8, 3.8, 2.8] },
    { id: 'carter', row: 'east', seed: 9097, x: -5.3, z: 25.0, rotY: 0.175, length: 5.2, width: 3.4, door: ['front', 0.6], yard: [-3.0, -2.2, 3.8, 3.2] },
    { id: 'widow', row: 'east', seed: 9228, x: -13.5, z: 30.5, rotY: 1.361, length: 4.2, width: 3.0, door: ['front', 0.3], yard: [-3.4, -3.2, 3.4, 3.4] },
    { id: 'ovenwife', row: 'east', seed: 9359, x: -4.8, z: 33.6, rotY: 1.536, length: 5.2, width: 3.4, door: ['front', -0.6], yard: [-3.6, -3.4, 3.6, 3.0] },
    { id: 'swineherd', row: 'east', seed: 9490, x: -5.8, z: 42.0, rotY: 1.484, length: 5.2, width: 3.4, door: ['front', -0.5], yard: [-4.0, -4.2, 4.0, 3.0] },
    // by the field lane and the east road
    { id: 'thatcher', row: 'lane', seed: 9621, x: 14.4, z: 24.6, rotY: 0.611, length: 4.2, width: 3.0, door: ['front', -0.4], yard: [-3.0, -2.4, 2.4, 2.4] },
    { id: 'hayward', row: 'lane', seed: 9752, x: 11.8, z: 39.4, rotY: -1.466, length: 4.2, width: 3.0, door: ['front', 0.4], yard: [-2.8, -2.2, 7.0, 3.0] },
    // up on the hill, at the wood's edge
    { id: 'collier', row: 'hill', seed: 9883, x: 39.0, z: -12.0, rotY: -1.309, length: 4.2, width: 3.0, door: ['front', -0.3], yard: [-5.6, -3.4, 3.0, 3.2] },
    { id: 'woodward', row: 'hill', seed: 10014, x: 38.5, z: -3.5, rotY: -1.71, length: 5.2, width: 3.4, door: ['front', 0.6], yard: [-3.6, -3.4, 4.0, 3.2] },
  ],
  // The lanes between the houses, worn by feet: each a line of [x, z] points.
  // Paint only (terrain.js) — nothing collides, and the grass is thinned off
  // their middles after it is sown (flora.js), as with the cart track.
  lanes: [
    [[-6.8, 6.6], [-12.5, 6], [-17.5, 4.6], [-24.5, 3.7], [-30.5, 3.6], [-35.4, 3.3], [-37.8, 0.4], [-38.8, -4], [-38.9, -6.2]], // the oak lane, south from the green to the wood
    [[-4.6, -14.2], [-8.8, -15], [-13.4, -13.3], [-18.5, -13.9], [-24.5, -14.1], [-29.4, -13]], // the birch lane, from the road past the birches
    [[1, -6.5], [5, -6], [9.6, -5], [12.9, -4.1]], // up the knoll to the reeve’s door
    [[-1.4, -10], [3.4, -11.2], [7.6, -12.3]], // to the alewife’s
    [[-2.6, -18], [2.6, -17.6]], // to the smithy
    [[-10.8, -7.5], [-6.4, -7.7], [-3.4, -9.2]], // from the flax garth to the road
    [[-4.3, 27.6], [0.5, 28], [4.7, 27.6]], // from the carter’s to the road
    [[-5.2, 10.4], [-7.8, 14.6], [-8.9, 20.5], [-9.1, 25.5], [-10.6, 30.4]], // the east lane, behind the dummy
    // a path worn from a door to the nearest lane, road or track
    [[4.9, -19.5], [2.6, -17.6]], // smith
    [[-13.1, -8.3], [-10.8, -7.5]], // flaxwife
    [[-11.4, -18.2], [-10, -14.6]], // wright
    [[-24.9, -15.7], [-24.5, -14.1]], // turfhut
    [[-22.7, -12.8], [-22.6, -14]], // wellhouse
    [[-29.4, -11.1], [-29.4, -13]], // newhouse
    [[-19.8, 1.9], [-20.1, 4.3]], // goosewife
    [[-30.6, 2.1], [-30.7, 3.6]], // oxhouse
    [[-19.8, 10.3], [-19.1, 4.4]], // cruckhouse
    [[-33.2, 9.9], [-32.8, 3.5]], // dairy
    [[-39, -7.1], [-38.9, -6.2]], // cottar
    [[-2.2, 34.3], [-1.7, 27.8]], // ovenwife
    [[-3.3, 42.7], [4.6, 43.4]], // swineherd
    [[15.4, 26.8], [20.2, 23.3]], // thatcher
    [[9.5, 40], [4.9, 39.8]], // hayward
  ],
  // dirt wear circles painted onto the terrain: {x, z, radius}
  dirtPatches: [
    { x: -4.6, z: 6.2, r: 2.6 }, // around campfire
    { x: -7, z: 3, r: 3.2 }, // in front of the hovel
    { x: -9, z: 2, r: 2.6 }, // under the hovel — the packed-earth floor indoors
    { x: -8.5, z: 9.5, r: 2.2 }, // under the dummy
    { x: 6.2, z: 3, r: 2.6 }, // trampled ground at the exchequer's counter
    { x: 2.9, z: 8.6, r: 2.6 }, // wheel ruts — the chapman's spot, worn even when he's away
    { x: 11, z: 11, r: 4.2 }, // granary yard
  ],
};

// ---------- the field's own frame ----------
// The strip is turned on the map, so everything built or asked about it works
// in field coordinates: u along the ridges, v across them, both from its centre.

const F = LAYOUT.field;
const COS = Math.cos(F.rotY);
const SIN = Math.sin(F.rotY);

export const FIELD = {
  rows: CONFIG.farm.rows,
  halfLength: F.length / 2,
  halfWidth: (CONFIG.farm.rows * F.spacing) / 2,
  rowV: (row) => (row - (CONFIG.farm.rows - 1) / 2) * F.spacing, // where a ridge's crest runs
  margin: F.margin,
  gateHalf: 1.2, // the gate stands in the middle of the village-ward (-v) fence, this wide each way
};

export function fieldToWorld(u, v) {
  return { x: F.x + u * COS + v * SIN, z: F.z - u * SIN + v * COS };
}

export function worldToField(x, z) {
  const dx = x - F.x;
  const dz = z - F.z;
  return { u: dx * COS - dz * SIN, v: dx * SIN + dz * COS };
}

// How far a spot lies from the cart track that runs from the field gate to
// the granary yard (a straight line; the ground paints it, nothing collides).
const GATE = fieldToWorld(0, -(FIELD.halfWidth + FIELD.margin));
const TRACK = LAYOUT.fieldTrackEnd;
const TRACK_LEN2 = (TRACK.x - GATE.x) ** 2 + (TRACK.z - GATE.z) ** 2;
export function trackGap(x, z) {
  const t = Math.min(1, Math.max(0, ((x - GATE.x) * (TRACK.x - GATE.x) + (z - GATE.z) * (TRACK.z - GATE.z)) / TRACK_LEN2));
  return Math.hypot(x - GATE.x - t * (TRACK.x - GATE.x), z - GATE.z - t * (TRACK.z - GATE.z));
}

// How far outside the strip a spot lies, 0 anywhere on it. Asked for every
// facet of the ground and every tuft of grass, so it makes no garbage.
export function fieldGap(x, z) {
  const dx = x - F.x;
  const dz = z - F.z;
  const u = Math.abs(dx * COS - dz * SIN) - FIELD.halfLength;
  const v = Math.abs(dx * SIN + dz * COS) - FIELD.halfWidth;
  return Math.hypot(Math.max(u, 0), Math.max(v, 0));
}

// ---------- the neighbours' houses ----------
// Each house is turned on the map like the field, so it too is asked about in
// its own frame: u along the ridge, v out of the front, both from its middle.

const PLOTS = LAYOUT.houses.map((h) => ({
  h,
  cos: Math.cos(h.rotY),
  sin: Math.sin(h.rotY),
  halfX: h.length / 2,
  halfZ: h.width / 2,
  reach: Math.hypot(h.length, h.width) / 2 + 2.5, // nothing of it is felt beyond this
  // its yard, in the same frame: the middle and the half-sizes of [u0, v0, u1, v1]
  yardU: (h.yard[0] + h.yard[2]) / 2,
  yardV: (h.yard[1] + h.yard[3]) / 2,
  yardHalfU: (h.yard[2] - h.yard[0]) / 2,
  yardHalfV: (h.yard[3] - h.yard[1]) / 2,
  yardReach: Math.max(...[[0, 1], [2, 1], [2, 3], [0, 3]].map(([i, j]) => Math.hypot(h.yard[i], h.yard[j]))) + 2.5,
}));

export function houseToWorld(h, u, v) {
  const c = Math.cos(h.rotY);
  const s = Math.sin(h.rotY);
  return { x: h.x + u * c + v * s, z: h.z - u * s + v * c };
}

export function worldToHouse(h, x, z) {
  const c = Math.cos(h.rotY);
  const s = Math.sin(h.rotY);
  const dx = x - h.x;
  const dz = z - h.z;
  return { u: dx * c - dz * s, v: dx * s + dz * c };
}

// where a house's main door opens: the middle of its threshold, `out` beyond the wall
export function doorstep(h, out = 0) {
  const [wall, at] = h.door;
  const u = wall === 'right' ? h.length / 2 + out : wall === 'left' ? -h.length / 2 - out : at;
  const v = wall === 'front' ? h.width / 2 + out : wall === 'back' ? -h.width / 2 - out : at;
  return houseToWorld(h, u, v);
}

// How far outside the nearest house's walls a spot lies — 0 under a house, and
// a large number well away from all of them. Asked for every facet of the
// ground and every tuft of grass, so it makes no garbage.
export function houseGap(x, z) {
  let best = 99;
  for (const p of PLOTS) {
    const dx = x - p.h.x;
    const dz = z - p.h.z;
    if (dx * dx + dz * dz > p.reach * p.reach) continue;
    const u = Math.abs(dx * p.cos - dz * p.sin) - p.halfX;
    const v = Math.abs(dx * p.sin + dz * p.cos) - p.halfZ;
    const gap = Math.hypot(Math.max(u, 0), Math.max(v, 0));
    if (gap < best) best = gap;
  }
  return best;
}

// How far outside the nearest house's yard a spot lies — 0 anywhere in a toft.
// A yard is trodden ground: the meadow is weeded out of it and its turf is
// painted worn (terrain.js, flora.js).
export function yardGap(x, z) {
  let best = 99;
  for (const p of PLOTS) {
    const dx = x - p.h.x;
    const dz = z - p.h.z;
    if (dx * dx + dz * dz > p.yardReach * p.yardReach) continue;
    const u = Math.abs(dx * p.cos - dz * p.sin - p.yardU) - p.yardHalfU;
    const v = Math.abs(dx * p.sin + dz * p.cos - p.yardV) - p.yardHalfV;
    const gap = Math.hypot(Math.max(u, 0), Math.max(v, 0));
    if (gap < best) best = gap;
  }
  return best;
}

// How far a spot lies from the nearest doorstep's worn patch (its middle
// stands a pace out from each main door).
const STEPS = LAYOUT.houses.map((h) => doorstep(h, 0.9));
export function doorGap(x, z) {
  let best = 99;
  for (const s of STEPS) {
    const dx = x - s.x;
    const dz = z - s.z;
    if (dx > 3 || dx < -3 || dz > 3 || dz < -3) continue;
    const gap = Math.hypot(dx, dz);
    if (gap < best) best = gap;
  }
  return best;
}

// How far a spot lies from the middle of the nearest lane.
const LANE_SEGS = [];
for (const lane of LAYOUT.lanes) {
  for (let i = 0; i < lane.length - 1; i++) {
    const [ax, az] = lane[i];
    const [bx, bz] = lane[i + 1];
    LANE_SEGS.push({ ax, az, dx: bx - ax, dz: bz - az, len2: (bx - ax) ** 2 + (bz - az) ** 2 });
  }
}
export function laneGap(x, z) {
  let best = 99;
  for (const s of LANE_SEGS) {
    const t = Math.min(1, Math.max(0, ((x - s.ax) * s.dx + (z - s.az) * s.dz) / s.len2));
    const gap = Math.hypot(x - s.ax - t * s.dx, z - s.az - t * s.dz);
    if (gap < best) best = gap;
  }
  return best;
}
