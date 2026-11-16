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
  field: { x: 27, z: 33, rotY: 0.6, length: 12.8, spacing: 1.0, margin: 1.3 },
  fieldTrackEnd: { x: 13.6, z: 14.4 }, // where the cart track from the gate meets the granary yard
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
