import * as THREE from 'three';
import { mesh } from './meshUtils.js';

const WOOD_DARK = 0x553d24;
const WOOD = 0x755636;
const WOOD_PALE = 0x8f6d42;
const THATCH = 0xa8854a;
const THATCH_DARK = 0x94703c;
const STONE = 0x8d8a82;
const STRAW = 0xc8a35a;
const PARCHMENT = 0xe6d6ae;
const PAGE = 0xefe6c8;
const LEATHER = 0x6b3a26;

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, seg = 7) => new THREE.CylinderGeometry(rt, rb, h, seg);

// Hollow hovel: same 3.4 × 2.9 footprint and silhouette as the old solid box,
// but with real walls, a hinged door on the +x face, and a furnished one-room
// interior. The floor is the terrain itself (a packed-earth dirt patch in
// layout.js paints it). All dimensions are LOCAL; world.js offsets them — the
// hovel must stay unrotated (rotY 0) so its wall colliders stay axis-aligned.
export const HOVEL = {
  halfX: 1.7,
  halfZ: 1.45,
  wallT: 0.12, // walls span x ±[1.58, 1.70], z ±[1.33, 1.45]
  door: { z0: -0.97, z1: -0.07, h: 1.62, openAngle: 1.9 }, // gap in the +x wall
  bed: { x: -1.05, z: 0.55, topY: 0.46 }, // cot centre + mattress top — interactable & lie-down spot
  wake: { x: -0.3, z: -0.6 }, // open floor where you stand after sleep/death
  hearth: { x: 0.3, z: 0.45, r: 0.55 },
  chest: { x0: -1.28, x1: -0.62, z0: -1.21, z1: -0.79 },
  table: { x: 1.0, z: 0.95, r: 0.5 },
  ledger: { x: 0.85, z: -1.1 }, // where you stand to read the sleep ledger
  ceilY: 1.85, // indoor camera stays under this
};

// triangle closing an end wall between wall top (y 2.0) and the roof ridge;
// the extruded slab spans x [xOuter - wallT, xOuter]
function gable(xOuter) {
  const shape = new THREE.Shape();
  shape.moveTo(-HOVEL.halfZ, 2.0);
  shape.lineTo(HOVEL.halfZ, 2.0);
  shape.lineTo(0, 2.98);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: HOVEL.wallT, bevelEnabled: false });
  geo.rotateY(-Math.PI / 2); // shape plane becomes (z,y), extruded toward -x
  return mesh(geo, WOOD, { x: xOuter });
}

export function buildHovel() {
  const g = new THREE.Group();
  const H = HOVEL;
  const wallX = H.halfX - H.wallT / 2; // 1.64
  const wallZ = H.halfZ - H.wallT / 2; // 1.39

  // walls reach 0.3 below grade so the undulating terrain never shows a gap
  const wallBox = (w, d) => box(w, 2.3, d);
  g.add(mesh(wallBox(H.wallT, 2.9), WOOD, { x: -wallX, y: 0.85 })); // -x
  g.add(mesh(wallBox(3.4, H.wallT), WOOD, { y: 0.85, z: wallZ })); // +z
  g.add(mesh(wallBox(3.4, H.wallT), WOOD, { y: 0.85, z: -wallZ })); // -z
  // +x wall, split around the doorway
  g.add(mesh(wallBox(H.wallT, H.halfZ + H.door.z0), WOOD, { x: wallX, y: 0.85, z: (H.door.z0 - H.halfZ) / 2 }));
  g.add(mesh(wallBox(H.wallT, H.halfZ - H.door.z1), WOOD, { x: wallX, y: 0.85, z: (H.door.z1 + H.halfZ) / 2 }));
  g.add(mesh(box(H.wallT, 2.0 - H.door.h, 1.1), WOOD, { x: wallX, y: (2.0 + H.door.h) / 2, z: (H.door.z0 + H.door.z1) / 2 })); // lintel
  g.add(gable(H.halfX));
  g.add(gable(-H.halfX + H.wallT));

  // patch planks — it should look shabby
  g.add(mesh(box(0.12, 1.1, 0.7), WOOD_DARK, { x: 1.68, y: 0.9, z: 0.6, rx: 0.08 }));
  g.add(mesh(box(0.8, 0.14, 0.12), WOOD_PALE, { x: -0.4, y: 1.5, z: 1.48, rz: -0.1 }));

  // thatched roof: two slabs meeting at a slightly crooked ridge
  g.add(mesh(box(4.0, 0.18, 1.9), THATCH, { y: 2.55, z: -0.78, rx: -0.62 }));
  g.add(mesh(box(4.0, 0.18, 1.9), THATCH_DARK, { y: 2.57, z: 0.78, rx: 0.6, rz: 0.012 }));
  g.add(mesh(box(4.1, 0.16, 0.3), WOOD_DARK, { y: 3.06, rz: 0.01 }));
  // tie beam under the rafters
  g.add(mesh(box(3.16, 0.1, 0.12), WOOD_DARK, { y: 2.0, z: -0.7 }));

  // doorway: jamb posts + the hinged leaf (pivot on the south jamb)
  g.add(mesh(box(0.06, H.door.h, 0.1), WOOD_PALE, { x: 1.66, y: H.door.h / 2, z: H.door.z1 + 0.04 }));
  g.add(mesh(box(0.06, H.door.h, 0.1), WOOD_PALE, { x: 1.66, y: H.door.h / 2, z: H.door.z0 - 0.04 }));
  const doorPivot = new THREE.Group();
  doorPivot.position.set(wallX, 0, H.door.z0);
  const leafLen = H.door.z1 - H.door.z0 - 0.06;
  doorPivot.add(mesh(box(0.07, H.door.h - 0.08, leafLen), WOOD_DARK, { y: (H.door.h - 0.08) / 2 + 0.02, z: leafLen / 2 + 0.02 }));
  doorPivot.add(mesh(box(0.04, 0.12, leafLen), WOOD_PALE, { x: 0.05, y: 1.15, z: leafLen / 2 + 0.02 }));
  doorPivot.add(mesh(box(0.04, 0.12, leafLen), WOOD_PALE, { x: 0.05, y: 0.45, z: leafLen / 2 + 0.02 }));
  g.add(doorPivot);

  // door paint (shop upgrade 'door'): an oxblood panel over the outer face,
  // riding the pivot so it swings with the leaf
  const doorPaint = mesh(box(0.03, H.door.h - 0.14, leafLen - 0.04), 0x7a2a20, { x: 0.055, y: (H.door.h - 0.08) / 2 + 0.02, z: leafLen / 2 + 0.02 });
  doorPaint.visible = false;
  doorPivot.add(doorPaint);

  // tiny dark window
  g.add(mesh(box(0.08, 0.42, 0.42), 0x2c2017, { x: 1.71, y: 1.35, z: 0.74 }));

  // barrel by the wall
  const barrel = mesh(cyl(0.32, 0.36, 0.78, 9), WOOD_PALE, { x: 1.1, y: 0.39, z: 1.75 });
  g.add(barrel);
  g.add(mesh(cyl(0.37, 0.37, 0.07, 9), WOOD_DARK, { x: 1.1, y: 0.2, z: 1.75 }));
  g.add(mesh(cyl(0.37, 0.37, 0.07, 9), WOOD_DARK, { x: 1.1, y: 0.6, z: 1.75 }));

  // ---- exterior shop upgrades, hidden until bought at the chapman's cart ----

  // 'window': a real glass pane with a cross mullion over the dark opening
  const glassWindow = new THREE.Group();
  glassWindow.add(mesh(box(0.03, 0.38, 0.38), 0xaec6cf, { x: 1.76, y: 1.35, z: 0.74, shadow: false }));
  glassWindow.add(mesh(box(0.02, 0.4, 0.035), WOOD_DARK, { x: 1.78, y: 1.35, z: 0.74 }));
  glassWindow.add(mesh(box(0.02, 0.035, 0.4), WOOD_DARK, { x: 1.78, y: 1.35, z: 0.74 }));
  glassWindow.visible = false;
  g.add(glassWindow);

  // 'lantern': iron candle lantern on a bracket beside the door
  const lantern = new THREE.Group();
  lantern.add(mesh(box(0.18, 0.03, 0.03), WOOD_DARK, { x: 1.78, y: 1.9, z: 0.12 }));
  lantern.add(mesh(box(0.02, 0.1, 0.02), 0x3a3a3f, { x: 1.86, y: 1.84, z: 0.12, shadow: false }));
  lantern.add(mesh(box(0.11, 0.15, 0.11), 0x3a3a3f, { x: 1.86, y: 1.71, z: 0.12 }));
  const flame = new THREE.Mesh(
    new THREE.BoxGeometry(0.055, 0.08, 0.055),
    new THREE.MeshBasicMaterial({ color: 0xffd66e })
  );
  flame.position.set(1.86, 1.71, 0.12);
  lantern.add(flame);
  lantern.visible = false;
  g.add(lantern);

  // 'garden': a tilled plot with cabbages along the +z wall
  const garden = new THREE.Group();
  garden.add(mesh(box(1.5, 0.16, 0.85), 0x4a3624, { x: -0.5, y: 0.02, z: 2.05 }));
  for (const [gx, gz] of [[-1.05, 1.85], [-0.55, 1.88], [-0.05, 1.83], [-1.0, 2.28], [-0.5, 2.3], [0.0, 2.26]]) {
    garden.add(mesh(new THREE.SphereGeometry(0.095, 6, 5), 0x6f7a3e, { x: gx, y: 0.14, z: gz }));
  }
  garden.add(mesh(new THREE.ConeGeometry(0.05, 0.16, 5), 0x557f3d, { x: -0.28, y: 0.18, z: 2.07 }));
  garden.add(mesh(new THREE.ConeGeometry(0.05, 0.14, 5), 0x557f3d, { x: -0.75, y: 0.17, z: 2.05 }));
  garden.visible = false;
  g.add(garden);

  const upgrades = { door: doorPaint, window: glassWindow, lantern, garden, ...furnish(g) };

  return { group: g, doorPivot, upgrades };
}

const WOOL = 0x6b5a44; // undyed peasant blanket
const CLAY = 0x9c5e3c;
const HERB = 0x6f7a3e;

// One-room medieval peasant interior: straw cot, open hearth, trestle table,
// stool, chest, pot shelf, hanging herbs, firewood. Dirt floor is the terrain.
// Returns the interior shop upgrades (hidden until bought).
function furnish(g) {
  const H = HOVEL;

  // straw cot along the -x wall
  const bx = H.bed.x;
  const bz = H.bed.z;
  g.add(mesh(box(0.9, 0.12, 1.5), WOOD_DARK, { x: bx, y: 0.26, z: bz }));
  for (const [lx, lz] of [[-0.38, -0.66], [0.38, -0.66], [-0.38, 0.66], [0.38, 0.66]]) {
    g.add(mesh(box(0.09, 0.26, 0.09), WOOD_DARK, { x: bx + lx, y: 0.13, z: bz + lz }));
  }
  g.add(mesh(box(0.8, 0.14, 1.4), STRAW, { x: bx, y: 0.39, z: bz }));
  g.add(mesh(box(0.82, 0.06, 0.85), WOOL, { x: bx, y: 0.47, z: bz + 0.25 }));
  g.add(mesh(box(0.55, 0.1, 0.3), 0xcbb98e, { x: bx, y: 0.49, z: bz - 0.5 })); // sack pillow

  // open hearth: stone ring, ash, ember glow, charred logs
  const hx = H.hearth.x;
  const hz = H.hearth.z;
  g.add(mesh(cyl(0.34, 0.38, 0.06, 9), 0x4a423a, { x: hx, y: 0.03, z: hz, shadow: false }));
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.4;
    g.add(mesh(box(0.16, 0.14, 0.16), STONE, { x: hx + Math.cos(a) * 0.42, y: 0.07, z: hz + Math.sin(a) * 0.42, ry: a }));
  }
  const embers = new THREE.Mesh(
    cyl(0.18, 0.22, 0.05, 7),
    new THREE.MeshBasicMaterial({ color: 0xd96a2a })
  );
  embers.position.set(hx, 0.06, hz);
  g.add(embers);
  g.add(mesh(box(0.4, 0.09, 0.1), 0x2c241c, { x: hx, y: 0.1, z: hz, ry: 0.5 }));
  g.add(mesh(box(0.36, 0.09, 0.1), 0x2c241c, { x: hx, y: 0.1, z: hz, ry: -0.7 }));
  // a small warm glow — deliberately the scene's only light beyond the sun
  // (no shadows, tight falloff, so the 60fps budget is untouched)
  const glow = new THREE.PointLight(0xff9a55, 2.2, 4.5, 2);
  glow.position.set(hx, 0.8, hz);
  g.add(glow);

  // trestle table against the +z wall, bowl on top
  const tx = H.table.x;
  const tz = H.table.z;
  g.add(mesh(box(0.85, 0.07, 0.55), WOOD, { x: tx, y: 0.62, z: tz }));
  for (const [lx, lz] of [[-0.34, -0.2], [0.34, -0.2], [-0.34, 0.2], [0.34, 0.2]]) {
    g.add(mesh(box(0.07, 0.6, 0.07), WOOD_DARK, { x: tx + lx, y: 0.3, z: tz + lz }));
  }
  g.add(mesh(cyl(0.1, 0.07, 0.08, 7), 0x8a6a3f, { x: tx - 0.15, y: 0.7, z: tz }));

  // stool
  g.add(mesh(cyl(0.16, 0.16, 0.06, 7), WOOD_PALE, { x: 0.45, y: 0.38, z: 1.05 }));
  g.add(mesh(cyl(0.05, 0.07, 0.36, 6), WOOD_DARK, { x: 0.45, y: 0.18, z: 1.05 }));

  // chest in the -z corner
  const cx = (H.chest.x0 + H.chest.x1) / 2;
  const cz = (H.chest.z0 + H.chest.z1) / 2;
  g.add(mesh(box(0.66, 0.34, 0.42), WOOD, { x: cx, y: 0.17, z: cz }));
  g.add(mesh(box(0.7, 0.1, 0.46), WOOD_DARK, { x: cx, y: 0.39, z: cz }));
  g.add(mesh(box(0.08, 0.5, 0.48), 0x3a3a3f, { x: cx, y: 0.2, z: cz })); // iron band

  // the sleep ledger: a plank and parchment by the shelf, tally scratched in ink
  g.add(mesh(box(0.55, 0.62, 0.04), WOOD_DARK, { x: H.ledger.x, y: 1.25, z: -1.31 }));
  g.add(mesh(box(0.42, 0.5, 0.02), PARCHMENT, { x: H.ledger.x, y: 1.24, z: -1.285, shadow: false }));
  for (let i = 0; i < 5; i++) {
    g.add(mesh(box(0.28, 0.018, 0.012), 0x3a2c1c, {
      x: H.ledger.x + (i % 2 ? 0.02 : -0.02),
      y: 1.42 - i * 0.08,
      z: -1.272,
      rz: i % 2 ? -0.05 : 0.04,
      shadow: false,
    }));
  }

  // pot shelf on the -z wall
  g.add(mesh(box(1.1, 0.05, 0.26), WOOD_PALE, { x: -0.2, y: 1.28, z: -1.18 }));
  g.add(mesh(box(0.05, 0.18, 0.2), WOOD_DARK, { x: -0.6, y: 1.18, z: -1.2 }));
  g.add(mesh(box(0.05, 0.18, 0.2), WOOD_DARK, { x: 0.2, y: 1.18, z: -1.2 }));
  g.add(mesh(cyl(0.09, 0.11, 0.2, 7), CLAY, { x: -0.5, y: 1.41, z: -1.18 }));
  g.add(mesh(cyl(0.08, 0.1, 0.18, 7), CLAY, { x: -0.18, y: 1.4, z: -1.18 }));
  g.add(mesh(cyl(0.07, 0.1, 0.24, 7), 0x86715a, { x: 0.1, y: 1.43, z: -1.18 }));

  // herbs drying on the tie beam
  for (const hxp of [0.1, 0.65]) {
    g.add(mesh(box(0.02, 0.22, 0.02), 0x4a3220, { x: hxp, y: 1.86, z: -0.7, shadow: false }));
    g.add(mesh(new THREE.ConeGeometry(0.09, 0.24, 5), HERB, { x: hxp, y: 1.66, z: -0.7, rx: Math.PI }));
  }

  // firewood by the +x wall
  for (const [wy, wz] of [[0.07, 0.22], [0.07, 0.38], [0.18, 0.3]]) {
    g.add(mesh(cyl(0.06, 0.06, 0.5, 5), WOOD_DARK, { x: 1.3, y: wy, z: wz, rz: Math.PI / 2 }));
  }

  // ---- interior shop upgrades, hidden until bought ----

  // 'rug': madder-red wool between cot and hearth
  const rug = new THREE.Group();
  rug.add(mesh(box(1.0, 0.035, 0.7), 0x8a3a2a, { x: -0.45, y: 0.06, z: -0.15 }));
  rug.add(mesh(box(1.04, 0.03, 0.1), 0x6e2c20, { x: -0.45, y: 0.062, z: 0.17 }));
  rug.add(mesh(box(1.04, 0.03, 0.1), 0x6e2c20, { x: -0.45, y: 0.062, z: -0.47 }));
  rug.visible = false;
  g.add(rug);

  // 'trophy': a mounted rat above the pot shelf, stuffed and staring
  const trophy = new THREE.Group();
  trophy.add(mesh(box(0.26, 0.2, 0.03), WOOD_DARK, { x: -0.85, y: 1.68, z: -1.31 }));
  const ratBody = mesh(new THREE.SphereGeometry(0.07, 6, 5), 0x6e665e, { x: -0.87, y: 1.68, z: -1.27 });
  ratBody.scale.set(1.4, 1, 1);
  trophy.add(ratBody);
  trophy.add(mesh(new THREE.SphereGeometry(0.045, 6, 5), 0x6e665e, { x: -0.75, y: 1.7, z: -1.27 }));
  trophy.add(mesh(box(0.14, 0.02, 0.02), 0xb08a8a, { x: -1.02, y: 1.66, z: -1.27, rz: 0.4 })); // tail
  trophy.visible = false;
  g.add(trophy);

  return { rug, trophy };
}

export function buildQuestBoard() {
  const g = new THREE.Group();
  g.add(mesh(cyl(0.07, 0.09, 2.2, 6), WOOD_DARK, { x: -0.95, y: 1.1 }));
  g.add(mesh(cyl(0.07, 0.09, 2.2, 6), WOOD_DARK, { x: 0.95, y: 1.1, rz: 0.02 }));
  g.add(mesh(box(2.1, 1.15, 0.09), WOOD, { y: 1.45 }));
  g.add(mesh(box(2.3, 0.1, 0.3), WOOD_DARK, { y: 2.12 }));
  // little rain cap
  g.add(mesh(box(2.4, 0.06, 0.45), THATCH_DARK, { y: 2.22, rx: 0.12 }));

  // pinned parchments
  const notes = [
    { x: -0.55, y: 1.55, s: 0.42, r: 0.06 },
    { x: 0.1, y: 1.4, s: 0.5, r: -0.04 },
    { x: 0.68, y: 1.58, s: 0.36, r: 0.1 },
  ];
  for (const n of notes) {
    g.add(mesh(box(n.s, n.s * 1.25, 0.02), PARCHMENT, { x: n.x, y: n.y, z: 0.06, rz: n.r, shadow: false }));
  }
  g.add(mesh(cyl(0.03, 0.03, 0.03, 6), 0x8a2418, { x: 0.1, y: 1.18, z: 0.08, rx: Math.PI / 2, shadow: false }));

  return g;
}

// The Village Charter: a post by the path bearing the rules of the realm —
// E opens the guide panel. The parchment faces local +z; world.js turns it
// toward the walker coming up the path.
export function buildCharter() {
  const g = new THREE.Group();
  // post sunk below grade
  g.add(mesh(cyl(0.07, 0.09, 2.3, 6), WOOD_DARK, { y: 0.75 }));
  // notice board with a little rain cap
  g.add(mesh(box(0.92, 1.02, 0.07), WOOD, { y: 1.42 }));
  g.add(mesh(box(1.04, 0.05, 0.24), THATCH_DARK, { y: 1.98, rx: 0.1 }));
  // the charter itself, slightly askew, ink lines scratched down the page
  g.add(mesh(box(0.68, 0.82, 0.02), PARCHMENT, { y: 1.42, z: 0.045, rz: 0.03, shadow: false }));
  for (let i = 0; i < 6; i++) {
    g.add(mesh(box(0.46, 0.02, 0.012), 0x3a2c1c, {
      x: i % 2 ? 0.03 : -0.02,
      y: 1.72 - i * 0.1,
      z: 0.062,
      rz: i % 2 ? -0.04 : 0.03,
      shadow: false,
    }));
  }
  // the reeve's wax seal beneath the text
  g.add(mesh(cyl(0.05, 0.05, 0.02, 7), 0x8a2418, { x: 0.17, y: 1.08, z: 0.062, rx: Math.PI / 2, shadow: false }));
  return g;
}

export function buildTome() {
  const g = new THREE.Group();
  g.add(mesh(cyl(0.3, 0.46, 1.05, 8), STONE, { y: 0.52 }));
  g.add(mesh(cyl(0.42, 0.42, 0.08, 8), STONE, { y: 1.08 }));

  // open book: two leaves meeting in a shallow V
  const leafL = mesh(box(0.46, 0.05, 0.62), PAGE, { x: -0.22, y: 1.2, rz: 0.2 });
  const leafR = mesh(box(0.46, 0.05, 0.62), PAGE, { x: 0.22, y: 1.2, rz: -0.2 });
  const coverL = mesh(box(0.5, 0.04, 0.68), LEATHER, { x: -0.24, y: 1.155, rz: 0.2 });
  const coverR = mesh(box(0.5, 0.04, 0.68), LEATHER, { x: 0.24, y: 1.155, rz: -0.2 });
  g.add(leafL, leafR, coverL, coverR);
  g.add(mesh(box(0.05, 0.045, 0.3), 0x8a2418, { y: 1.23, z: 0.18, shadow: false }));
  return g;
}

// The Exchequer: an open-fronted money-changer's booth — four posts, a pent
// thatch roof, and a counting table across the front (the "banca" that named
// banks; the checkered counting cloth is what named the royal Exchequer).
// The clerk behind it is scenery until v2 gives him words; E at the counter
// opens the Treasury panel. Front faces local +x; world.js turns it to the
// path. Returns { group, sway } — sway is the clerk's breathing upper body.
export function buildExchequer() {
  const g = new THREE.Group();
  const BRASS = 0xb08d4f;
  const COIN = 0xc9a227;
  const CLOTH_PALE = 0xd8cfae;
  const CLOTH_DARK = 0x50603a;
  const ROBE = 0x4c5a36;
  const SKIN = 0xcfa46f;
  const IRON = 0x3a3a3f;

  // posts sunk below grade; pent roof, high edge over the counter
  for (const [px, pz] of [[0.85, -1.25], [0.85, 1.25], [-0.85, -1.25], [-0.85, 1.25]]) {
    g.add(mesh(cyl(0.09, 0.11, 2.5, 6), WOOD_DARK, { x: px, y: 0.8, z: pz }));
  }
  g.add(mesh(box(2.7, 0.14, 3.1), THATCH, { y: 2.2, rz: 0.16 }));
  g.add(mesh(box(0.16, 0.07, 3.12), THATCH_DARK, { x: 1.3, y: 2.41, rz: 0.16 })); // front eave
  g.add(mesh(box(0.12, 0.1, 2.9), WOOD_DARK, { x: 0.85, y: 2.28 })); // front beam

  // half-height back wall + side rails
  g.add(mesh(box(0.1, 1.2, 2.6), WOOD, { x: -0.9, y: 0.45 }));
  g.add(mesh(box(1.6, 0.08, 0.08), WOOD_PALE, { y: 0.95, z: 1.25 }));
  g.add(mesh(box(1.6, 0.08, 0.08), WOOD_PALE, { y: 0.95, z: -1.25 }));

  // the counting table
  g.add(mesh(box(0.55, 1.0, 2.3), WOOD, { x: 0.7, y: 0.4 }));
  g.add(mesh(box(0.66, 0.07, 2.44), WOOD_PALE, { x: 0.7, y: 0.94 }));

  // the checkered counting cloth
  g.add(mesh(box(0.5, 0.02, 1.46), CLOTH_PALE, { x: 0.7, y: 0.985, shadow: false }));
  for (let col = 0; col < 2; col++) {
    for (let row = 0; row < 6; row++) {
      if ((col + row) % 2) continue;
      g.add(mesh(box(0.24, 0.015, 0.24), CLOTH_DARK, {
        x: 0.7 + (col ? 0.12 : -0.12),
        y: 0.992,
        z: -0.6 + row * 0.24,
        shadow: false,
      }));
    }
  }

  // balance scales
  g.add(mesh(cyl(0.02, 0.028, 0.32, 5), BRASS, { x: 0.7, y: 1.16, z: -0.5 }));
  g.add(mesh(box(0.02, 0.02, 0.46), BRASS, { x: 0.7, y: 1.33, z: -0.5 }));
  for (const s of [-1, 1]) {
    g.add(mesh(box(0.012, 0.1, 0.012), IRON, { x: 0.7, y: 1.27, z: -0.5 + s * 0.22, shadow: false }));
    g.add(mesh(cyl(0.07, 0.05, 0.025, 7), BRASS, { x: 0.7, y: 1.21, z: -0.5 + s * 0.22 }));
  }

  // counted coin and the day's ledger
  g.add(mesh(cyl(0.05, 0.05, 0.1, 7), COIN, { x: 0.74, y: 1.04, z: 0.28 }));
  g.add(mesh(cyl(0.05, 0.05, 0.06, 7), COIN, { x: 0.62, y: 1.02, z: 0.38 }));
  g.add(mesh(cyl(0.045, 0.045, 0.014, 7), COIN, { x: 0.7, y: 1.0, z: 0.14, shadow: false }));
  g.add(mesh(box(0.22, 0.02, 0.3), PAGE, { x: 0.66, y: 1.0, z: 0.82, rz: 0.09 }));
  g.add(mesh(box(0.22, 0.02, 0.3), PAGE, { x: 0.84, y: 1.0, z: 0.82, rz: -0.09 }));

  // the clerk: robe and belt stand still; chest, head, coif and arms breathe.
  // The head is its own pivot so alive.js can turn it — the nose is what
  // makes the turn readable on a low-poly sphere.
  g.add(mesh(cyl(0.17, 0.24, 0.95, 7), ROBE, { x: 0.05, y: 0.32 }));
  g.add(mesh(cyl(0.185, 0.185, 0.06, 7), LEATHER, { x: 0.05, y: 0.66 }));
  const sway = new THREE.Group();
  sway.position.set(0.05, 0.78, 0);
  sway.add(mesh(cyl(0.15, 0.175, 0.34, 7), ROBE, { y: 0.12 }));
  const head = new THREE.Group();
  head.position.set(0, 0.42, 0);
  head.add(mesh(new THREE.SphereGeometry(0.13, 7, 6), SKIN, {}));
  head.add(mesh(cyl(0.14, 0.15, 0.11, 7), CLOTH_PALE, { y: 0.07 })); // linen coif
  head.add(mesh(box(0.05, 0.04, 0.05), SKIN, { x: 0.125, shadow: false })); // nose, toward the counter
  sway.add(head);
  const armR = mesh(box(0.06, 0.36, 0.06), ROBE, { x: 0.2, y: 0.1, z: -0.13, rz: -1.15 });
  const armL = mesh(box(0.06, 0.36, 0.06), ROBE, { x: 0.2, y: 0.1, z: 0.13, rz: -1.15 });
  sway.add(armR, armL);
  g.add(sway);

  // iron-banded coffer at his heel
  g.add(mesh(box(0.52, 0.3, 0.36), WOOD, { x: -0.5, y: 0.15, z: 0.7 }));
  g.add(mesh(box(0.56, 0.09, 0.4), WOOD_DARK, { x: -0.5, y: 0.34, z: 0.7 }));
  g.add(mesh(box(0.07, 0.44, 0.42), IRON, { x: -0.5, y: 0.17, z: 0.7 }));
  g.add(mesh(box(0.09, 0.11, 0.04), BRASS, { x: -0.22, y: 0.2, z: 0.7, shadow: false })); // padlock

  // hanging sign: a gold coin on a board, read from the path
  g.add(mesh(box(0.015, 0.34, 0.015), IRON, { x: 1.02, y: 2.05, z: -0.95, shadow: false }));
  g.add(mesh(box(0.04, 0.36, 0.5), WOOD_DARK, { x: 1.02, y: 1.72, z: -0.95 }));
  g.add(mesh(cyl(0.11, 0.11, 0.05, 9), COIN, { x: 1.05, y: 1.72, z: -0.95, rz: Math.PI / 2, shadow: false }));

  return { group: g, sway, head, armR, armL };
}

export function buildGranary() {
  const g = new THREE.Group();

  // staddle stones keep the rats from the grain — mostly
  const legs = [
    [-1.3, -1.0], [1.3, -1.0], [-1.3, 1.0], [1.3, 1.0],
  ];
  for (const [lx, lz] of legs) {
    g.add(mesh(cyl(0.16, 0.22, 0.8, 6), STONE, { x: lx, y: 0.4, z: lz }));
    g.add(mesh(cyl(0.34, 0.3, 0.14, 7), STONE, { x: lx, y: 0.85, z: lz }));
  }

  g.add(mesh(box(3.4, 1.9, 2.6), WOOD_PALE, { y: 1.95 }));
  // plank lines
  g.add(mesh(box(3.45, 0.1, 2.65), WOOD_DARK, { y: 1.55 }));
  g.add(mesh(box(3.45, 0.1, 2.65), WOOD_DARK, { y: 2.35 }));
  g.add(mesh(box(0.5, 0.7, 0.06), WOOD_DARK, { y: 1.9, z: 1.31 }));

  g.add(mesh(box(3.9, 0.16, 1.75), THATCH, { y: 3.3, z: -0.72, rx: -0.58 }));
  g.add(mesh(box(3.9, 0.16, 1.75), THATCH_DARK, { y: 3.3, z: 0.72, rx: 0.58 }));
  g.add(mesh(box(4.0, 0.14, 0.26), WOOD_DARK, { y: 3.76 }));

  // ladder up to the door
  g.add(mesh(box(0.07, 1.6, 0.07), WOOD_DARK, { x: -0.2, y: 0.8, z: 1.62, rx: -0.22 }));
  g.add(mesh(box(0.07, 1.6, 0.07), WOOD_DARK, { x: 0.2, y: 0.8, z: 1.62, rx: -0.22 }));
  for (let i = 0; i < 4; i++) {
    g.add(mesh(box(0.42, 0.05, 0.05), WOOD_PALE, { y: 0.25 + i * 0.36, z: 1.74 - i * 0.082 }));
  }

  // spilled grain sacks — what the rats are here for
  const sack1 = mesh(new THREE.SphereGeometry(0.4, 7, 5), STRAW, { x: 1.9, y: 0.3, z: 1.2 });
  sack1.scale.set(1, 0.75, 0.9);
  const sack2 = mesh(new THREE.SphereGeometry(0.34, 7, 5), 0xb5924e, { x: 2.4, y: 0.24, z: 0.7 });
  sack2.scale.set(1, 0.7, 1);
  g.add(sack1, sack2);

  return g;
}

// The miller: the man who has been paying the rat bounty since M6 finally
// gets to stand in his own yard. Flour-dusted, arms folded, watching the
// grain. Mute until v2; E gets you a word about the day's tally (main.js).
// Faces local +x; world.js turns him toward the village and walks him on
// his rounds (alive.js makeStroll). Returns { group, props, sway, head,
// armR, armL } — props (sack + fork) stay planted at his home spot.
export function buildMiller() {
  const g = new THREE.Group();
  const DUSTED = 0xbfb5a2; // wool gone grey-white with flour
  const APRON = 0xd8cfae;
  const SKIN = 0xcfa46f;
  const CAP = 0x6b5a44;

  // stocky tunic, rope belt, floured apron down the front
  g.add(mesh(cyl(0.19, 0.25, 0.95, 7), DUSTED, { y: 0.32 }));
  g.add(mesh(cyl(0.2, 0.2, 0.06, 7), LEATHER, { y: 0.6 }));
  g.add(mesh(box(0.06, 0.52, 0.3), APRON, { x: 0.18, y: 0.38 }));

  // chest, head, flat cap — the breathing part; the head is its own pivot
  // (nose + cap brim make the turn readable)
  const sway = new THREE.Group();
  sway.position.set(0, 0.78, 0);
  sway.add(mesh(cyl(0.17, 0.19, 0.34, 7), DUSTED, { y: 0.12 }));
  const head = new THREE.Group();
  head.position.set(0, 0.43, 0);
  head.add(mesh(new THREE.SphereGeometry(0.135, 7, 6), SKIN, {}));
  head.add(mesh(cyl(0.15, 0.165, 0.08, 7), CAP, { y: 0.1 }));
  head.add(mesh(box(0.14, 0.03, 0.12), CAP, { x: 0.13, y: 0.07, shadow: false })); // cap brim over the eyes
  head.add(mesh(box(0.05, 0.04, 0.05), SKIN, { x: 0.13, shadow: false })); // nose
  sway.add(head);
  // arms folded across the apron — a man supervising his grain
  const armR = mesh(box(0.07, 0.36, 0.07), DUSTED, { x: 0.16, y: 0.14, z: -0.08, rx: 1.25, rz: -0.35 });
  const armL = mesh(box(0.07, 0.36, 0.07), DUSTED, { x: 0.16, y: 0.1, z: 0.08, rx: -1.25, rz: -0.35 });
  sway.add(armR, armL);
  g.add(sway);

  // a full flour sack and a hay-fork planted at his home spot — in their own
  // group so they stay put while he walks his rounds
  const props = new THREE.Group();
  const sack = mesh(new THREE.SphereGeometry(0.24, 7, 5), 0xd5c9a8, { x: 0.38, y: 0.2, z: -0.38 });
  sack.scale.set(1, 1.1, 1);
  props.add(sack);
  props.add(mesh(box(0.04, 1.55, 0.04), WOOD_DARK, { x: -0.28, y: 0.74, z: 0.32, rz: 0.12 }));
  for (const tine of [-0.06, 0, 0.06]) {
    props.add(mesh(box(0.025, 0.22, 0.025), WOOD_DARK, { x: -0.46 + tine * 0.3, y: 1.55, z: 0.32 + tine, rz: 0.12 }));
  }

  return { group: g, props, sway, head, armR, armL };
}

// Returns { group, pivot } — pivot is the part that wobbles when struck.
export function buildDummy() {
  const g = new THREE.Group();
  g.add(mesh(cyl(0.09, 0.12, 0.9, 6), WOOD_DARK, { y: 0.45 }));

  const pivot = new THREE.Group();
  pivot.position.y = 0.9;
  const body = mesh(cyl(0.3, 0.36, 0.85, 8), STRAW, { y: 0.42 });
  const head = mesh(new THREE.SphereGeometry(0.22, 7, 6), 0xd2af66, { y: 1.05 });
  const arms = mesh(box(1.15, 0.09, 0.09), WOOD, { y: 0.62 });
  const beltA = mesh(cyl(0.32, 0.32, 0.05, 8), 0x9c7b42, { y: 0.25 });
  const beltB = mesh(cyl(0.34, 0.34, 0.05, 8), 0x9c7b42, { y: 0.6 });
  pivot.add(body, head, arms, beltA, beltB);
  g.add(pivot);

  return { group: g, pivot };
}
