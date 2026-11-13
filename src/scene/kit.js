import * as THREE from 'three';
import { mesh, tone } from './meshUtils.js';

// The building kit: the shared palette and the parts every structure in the
// village is put together from — thatch, boarding, stone footings, and the
// heads and arms of the villagers. Everything here adds plain mesh() pieces
// to a Group; the builder bakes the Group when it is done (meshUtils.bake).

export const WOOD_DARK = 0x4f3a25;
export const WOOD = 0x755636;
export const WOOD_PALE = 0x94734a;
export const THATCH = 0xb8974f;
export const THATCH_DARK = 0x9a7a3e;
export const THATCH_PALE = 0xcbb065;
export const STONE = 0x8d8a82;
export const STONE_DARK = 0x77746d;
export const STRAW = 0xc8a35a;
export const PARCHMENT = 0xe6d6ae;
export const PAGE = 0xefe6c8;
export const LEATHER = 0x6b3a26;
export const DAUB = 0xbda67c; // earthen plaster
export const IRON = 0x3a3a3f;
export const INK = 0x3a2c1c;
export const ROPE = 0xb8a57a;
export const EYE = 0x241a12;

export const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
export const cyl = (rt, rb, h, seg = 7) => new THREE.CylinderGeometry(rt, rb, h, seg);

// A thatched gable roof whose ridge runs along x.
//   length  ridge length — make it longer than the building so it overhangs the gables
//   halfZ   half the building's width; eaveY is the underside's height there
//   peakY   the underside's height at the ridge
//   over    how far the eaves run past the side walls, measured down the slope
// Each slope is three overlapping courses of straw, shaggier toward the eave,
// ending in a ragged fringe; barge boards close the gable ends and a straw
// roll pinned with crossed spars caps the ridge.
// Returns { pitch, spot(u, lift) } — spot gives { y, z } on the +z slope, u
// down from the ridge and lift above the rafters, for hanging things off it.
export function thatchRoof(g, rng, { length, halfZ, eaveY, peakY, over = 0.33, x = 0, thick = 0.17 }) {
  const pitch = Math.atan2(peakY - eaveY, halfZ);
  const sin = Math.sin(pitch);
  const cos = Math.cos(pitch);
  const run = halfZ / cos + over; // ridge to eave, down the slope
  const spot = (u, lift) => ({ y: peakY - sin * u + cos * lift, z: cos * u + sin * lift });

  for (const side of [-1, 1]) {
    // a slab lying on the slope between u0 and u1, its underside `lift` above the rafters
    const slab = (len, u0, u1, lift, color, h = thick) => {
      const p = spot((u0 + u1) / 2, lift + h / 2);
      g.add(mesh(box(len, h, u1 - u0), color, { x, y: p.y, z: side * p.z, rx: side * pitch }));
    };
    slab(length + 0.1, run * 0.56, run, 0, tone(THATCH_DARK, 0.95 + rng() * 0.1));
    slab(length + 0.04, run * 0.26, run * 0.64, 0.05, tone(THATCH, 0.95 + rng() * 0.1));
    slab(length, -0.03, run * 0.34, 0.1, tone(THATCH_PALE, 0.94 + rng() * 0.08));

    // the ragged fringe at the eave
    const tufts = Math.round(length / 0.3);
    for (let i = 0; i < tufts; i++) {
      const len = 0.14 + rng() * 0.17;
      const p = spot(run + len / 2 - 0.06, thick * 0.42);
      g.add(
        mesh(box(0.22 + rng() * 0.12, thick * 0.8, len), tone(THATCH_DARK, 0.84 + rng() * 0.22), {
          x: x - length / 2 + (i + 0.5) * (length / tufts) + (rng() - 0.5) * 0.08,
          y: p.y,
          z: side * p.z,
          rx: side * (pitch + 0.1 + rng() * 0.16),
        })
      );
    }

    // barge boards down each gable end
    for (const end of [-1, 1]) {
      const p = spot(run / 2 - 0.02, 0.1);
      g.add(mesh(box(0.05, 0.19, run + 0.05), WOOD_DARK, { x: x + end * (length / 2 - 0.03), y: p.y, z: side * p.z, rx: side * pitch }));
    }
  }

  // the ridge: a straw roll, pinned every so often by a pair of crossed spars
  const top = peakY + cos * (0.1 + thick) + 0.02;
  g.add(mesh(cyl(0.16, 0.16, length + 0.08, 6), tone(THATCH_PALE, 1.03), { x, y: top - 0.03, rz: Math.PI / 2 }));
  const spars = Math.max(2, Math.round(length / 0.8));
  for (let i = 0; i < spars; i++) {
    const sx = x - length / 2 + (i + 0.5) * (length / spars);
    for (const side of [-1, 1]) {
      g.add(mesh(box(0.035, 0.035, 0.62), WOOD_DARK, { x: sx + side * 0.03, y: top + 0.05, rx: side * (pitch + 0.3) }));
    }
  }

  return { pitch, spot };
}

// The triangle that closes a gable end: base at y0 across ±halfZ, apex at y1.
// The slab is `thick` deep and hangs back from x = 0 toward -x.
export function gableGeometry(halfZ, y0, y1, thick) {
  const shape = new THREE.Shape();
  shape.moveTo(-halfZ, y0);
  shape.lineTo(halfZ, y0);
  shape.lineTo(0, y1);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: false });
  geo.rotateY(-Math.PI / 2); // shape plane becomes (z, y), extruded toward -x
  return geo;
}

// Upright boarding over one flat wall face, each board its own width and
// tone, with a dark seam between. axis says which way the face looks: 'z' is
// a wall in the x–y plane standing at z = at, 'x' one in the z–y plane at
// x = at. from..to run along the wall, y0..y1 up it.
export function boards(g, rng, { axis, at, from, to, y0, y1, color, thick = 0.04, width = 0.27 }) {
  let u = from;
  while (u < to - 0.03) {
    let w = width * (0.8 + rng() * 0.4);
    if (to - u - w < 0.1) w = to - u; // no sliver at the end
    const c = tone(color, 0.86 + rng() * 0.26);
    const mid = u + w / 2;
    const y = (y0 + y1) / 2;
    g.add(
      axis === 'z'
        ? mesh(box(w - 0.014, y1 - y0, thick), c, { x: mid, y, z: at })
        : mesh(box(thick, y1 - y0, w - 0.014), c, { x: at, y, z: mid })
    );
    u += w;
  }
}

// A course of rough stones along the foot of a wall (same axis convention).
// They run down below grade, so the wavering ground never shows a gap.
export function footing(g, rng, { axis, at, from, to, top = 0.24, depth = 0.14 }) {
  let u = from;
  while (u < to - 0.05) {
    let len = 0.28 + rng() * 0.3;
    if (to - u - len < 0.14) len = to - u;
    const peak = top + (rng() - 0.5) * 0.1;
    const c = tone(rng() < 0.5 ? STONE : STONE_DARK, 0.9 + rng() * 0.2);
    const d = depth * (0.85 + rng() * 0.35);
    const mid = u + len / 2;
    const opts = { y: peak - 0.25, ry: (rng() - 0.5) * 0.07 };
    g.add(
      axis === 'z'
        ? mesh(box(len - 0.03, 0.5, d), c, { x: mid, z: at, ...opts })
        : mesh(box(d, 0.5, len - 0.03), c, { x: at, z: mid, ...opts })
    );
    u += len;
  }
}

// A few lines of writing: thin ink strokes down a page that faces +z.
export function scribble(g, { x, y, z, width, rows, gap = 0.08 }) {
  for (let i = 0; i < rows; i++) {
    g.add(
      mesh(box(width * (i === rows - 1 ? 0.6 : 1), 0.018, 0.012), INK, {
        x: x + (i % 2 ? 0.02 : -0.02),
        y: y - i * gap,
        z,
        rz: i % 2 ? -0.04 : 0.03,
        shadow: false,
      })
    );
  }
}

// A grain sack: a slumped body and a tied neck.
export function sack(g, { x, y = 0, z, r = 0.3, color = STRAW, lean = 0 }) {
  const body = mesh(new THREE.SphereGeometry(r, 7, 5), color, { x, y: y + r * 0.72, z, rz: lean });
  body.scale.set(1, 0.85, 0.88);
  g.add(body);
  g.add(mesh(cyl(r * 0.22, r * 0.34, r * 0.34, 6), tone(color, 0.9), { x: x - Math.sin(lean) * r * 0.9, y: y + r * 1.5, z, rz: lean }));
  g.add(mesh(cyl(r * 0.26, r * 0.26, r * 0.07, 6), ROPE, { x: x - Math.sin(lean) * r * 0.8, y: y + r * 1.38, z, rz: lean }));
}

// ---------- villagers ----------

// A villager's head, built looking along +x on its own pivot Group (alive.js
// turns and nods it). Hats, hoods and beards are added to the returned Group.
export function villagerHead({ skin, brow = 0x4a3220, r = 0.13 }) {
  const head = new THREE.Group();
  head.add(mesh(new THREE.SphereGeometry(r, 8, 6), skin, {}));
  head.add(mesh(box(0.055, 0.045, 0.045), tone(skin, 0.93), { x: r * 0.97, y: -0.012, shadow: false })); // nose
  for (const s of [-1, 1]) {
    head.add(mesh(box(0.02, 0.03, 0.028), EYE, { x: r * 0.9, y: 0.03, z: s * 0.05, shadow: false }));
    head.add(mesh(box(0.02, 0.012, 0.05), brow, { x: r * 0.92, y: 0.058, z: s * 0.05, rx: s * 0.18, shadow: false }));
    head.add(mesh(box(0.03, 0.045, 0.02), tone(skin, 0.9), { y: -0.005, z: s * r * 0.97, shadow: false })); // ear
  }
  return head;
}

// A sleeve with a hand at its +y end, on a pivot placed and turned exactly as
// asked — gestures rotate the returned Group.
export function villagerArm({ sleeve, skin, w = 0.06, len = 0.36, x = 0, y = 0, z = 0, rx = 0, rz = 0 }) {
  const arm = new THREE.Group();
  arm.position.set(x, y, z);
  arm.rotation.set(rx, 0, rz);
  arm.add(mesh(box(w, len, w), sleeve, {}));
  arm.add(mesh(box(w * 1.15, 0.035, w * 1.15), tone(sleeve, 0.78), { y: len / 2 - 0.02 })); // cuff
  arm.add(mesh(box(w * 0.95, 0.07, w * 0.95), skin, { y: len / 2 + 0.03 })); // hand
  return arm;
}

// The standing part of a robed villager: a belled robe run into the ground, a
// belt, a hem band and two shoe-toes peeking out in front. front is the unit
// direction he faces: [1, 0] for +x, [0, -1] for -z.
export function villagerRobe(g, { robe, belt = LEATHER, x = 0, z = 0, girth = 1, front = [1, 0] }) {
  const [fx, fz] = front;
  g.add(mesh(cyl(0.17 * girth, 0.245 * girth, 0.95, 8), robe, { x, y: 0.32, z }));
  g.add(mesh(cyl(0.232 * girth, 0.238 * girth, 0.07, 8), tone(robe, 0.78), { x, y: 0.06, z })); // hem
  g.add(mesh(cyl(0.188 * girth, 0.188 * girth, 0.06, 8), belt, { x, y: 0.66, z }));
  for (const s of [-1, 1]) {
    g.add(
      mesh(fx ? box(0.13, 0.07, 0.08) : box(0.08, 0.07, 0.13), 0x3d3127, {
        x: x + fx * 0.21 * girth - fz * s * 0.08,
        y: 0.025,
        z: z + fz * 0.21 * girth + fx * s * 0.08,
      })
    );
  }
}
