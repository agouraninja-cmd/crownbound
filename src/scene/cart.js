import * as THREE from 'three';
import { mesh, bake, tone, makeRng } from './meshUtils.js';
import { WOOD_DARK, WOOD, WOOD_PALE, STRAW, IRON, ROPE, box, cyl, boards, sack, villagerHead, villagerArm, villagerRobe } from './kit.js';

const CANVAS = 0xd8cfae;
const CLAY = 0x9c5e3c;
const MULE = 0x8a7a68;
const MULE_DARK = 0x5c5045;
const HOOD = 0x6e3b2c; // road-worn madder red
const TUNIC = 0x74562e;
const SKIN = 0xcfa46f;
const RUG_RED = 0x8a3a2a;

// a spoked cart wheel, facing along z
function wheel(g, x, y, z) {
  g.add(mesh(new THREE.TorusGeometry(0.5, 0.055, 5, 12), WOOD_DARK, { x, y, z }));
  for (let i = 0; i < 4; i++) g.add(mesh(box(0.05, 0.94, 0.05), tone(WOOD, 0.9), { x, y, z, rz: (i * Math.PI) / 4 }));
  g.add(mesh(cyl(0.11, 0.11, 0.18, 8), WOOD_PALE, { x, y, z, rx: Math.PI / 2 }));
  g.add(mesh(cyl(0.04, 0.04, 0.22, 6), IRON, { x, y, z, rx: Math.PI / 2 }));
}

// The chapman's cart: a two-wheeled peddler's cart under a striped awning,
// mule in the shafts, the chapman himself on the path side. Only parked in
// the world on market days (world.js decides). Local +x is where the mule
// points; the chapman stands on the local -z side.
// Returns { group, sway, head, armStaff, armCart, muleHead, muleTail } — the animated parts.
export function buildCart() {
  const g = new THREE.Group();
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

  // one axle, two tall spoked wheels
  add(cyl(0.05, 0.05, 1.7, 6), WOOD_DARK, { x: -0.1, y: 0.55, rx: Math.PI / 2 });
  wheel(g, -0.1, 0.55, 0.82);
  wheel(g, -0.1, 0.55, -0.82);
  add(box(0.07, 0.42, 0.07), WOOD_DARK, { x: -0.85, y: 0.5, rz: 0.12 }); // the prop that holds the bed level

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
  // a candle lantern swinging from the awning post
  add(box(0.015, 0.16, 0.015), IRON, { x: 0.5, y: 1.56, z: -0.66, shadow: false });
  add(box(0.09, 0.13, 0.09), IRON, { x: 0.5, y: 1.42, z: -0.66 });
  const candle = new THREE.Mesh(box(0.045, 0.07, 0.045), new THREE.MeshBasicMaterial({ color: 0xffd66e }));
  candle.position.set(0.5, 1.42, -0.66);
  g.add(candle);

  // the mule, dozing in the shafts: barrel body, pack cloth, harness
  add(cyl(0.2, 0.22, 0.86, 8), MULE, { x: 1.9, y: 0.86, rz: Math.PI / 2 });
  add(box(0.4, 0.05, 0.46), RUG_RED, { x: 1.85, y: 1.07 });
  add(box(0.05, 0.47, 0.47), MULE_DARK, { x: 2.14, y: 0.86, shadow: false }); // collar strap
  for (const [lx, lz] of [[1.6, -0.13], [1.6, 0.13], [2.2, -0.13], [2.2, 0.13]]) {
    add(cyl(0.05, 0.036, 0.58, 5), MULE, { x: lx, y: 0.3, z: lz });
    add(box(0.09, 0.07, 0.1), MULE_DARK, { x: lx, y: 0.03, z: lz }); // hoof
  }
  add(box(0.18, 0.44, 0.17), MULE, { x: 2.38, y: 1.12, rz: -0.5 });
  add(box(0.04, 0.4, 0.05), MULE_DARK, { x: 2.3, y: 1.2, rz: -0.5 }); // mane
  const muleHead = new THREE.Group();
  muleHead.position.set(2.52, 1.28, 0);
  muleHead.add(mesh(box(0.36, 0.17, 0.15), MULE, { x: 0.12, y: -0.04 }));
  muleHead.add(mesh(box(0.12, 0.14, 0.13), MULE_DARK, { x: 0.3, y: -0.06 })); // muzzle
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

  // the chapman on the path side — hood up, staff leaned on the sideboard.
  // Mute for now; v2 gives him words. Robe stands still, the rest breathes;
  // the head is its own pivot, with the face inside it turned to the path.
  const cx = -0.3;
  const cz = -1.05;
  villagerRobe(g, { robe: TUNIC, belt: WOOD_DARK, x: cx, z: cz, front: [0, -1] });
  add(box(0.09, 0.12, 0.06), 0x5a4028, { x: cx + 0.17, y: 0.58, z: cz - 0.08 }); // the purse at his belt
  const sway = new THREE.Group();
  sway.position.set(cx, 0.78, cz);
  sway.add(mesh(cyl(0.15, 0.175, 0.34, 8), TUNIC, { y: 0.12 }));
  sway.add(mesh(cyl(0.12, 0.2, 0.12, 8), HOOD, { y: 0.27 })); // the hood's shoulder cape
  const head = new THREE.Group();
  head.position.set(0, 0.42, 0);
  const face = villagerHead({ skin: SKIN, brow: 0x3a2a1c });
  face.rotation.y = Math.PI / 2; // the kit builds a head looking +x; he looks -z
  face.add(mesh(new THREE.ConeGeometry(0.175, 0.3, 7), HOOD, { y: 0.2 })); // road hood, peaked
  face.add(mesh(box(0.05, 0.04, 0.2), HOOD, { x: 0.14, y: 0.065, shadow: false })); // its lip over the brow
  face.add(mesh(box(0.12, 0.22, 0.28), HOOD, { x: -0.07, y: -0.02 })); // and its drape over ears and nape
  face.add(mesh(box(0.05, 0.08, 0.16), 0x3a2a1c, { x: 0.1, y: -0.09 })); // a short dark beard
  head.add(face);
  sway.add(head);
  const armStaff = villagerArm({ sleeve: TUNIC, skin: SKIN, x: -0.05, y: 0.1, z: -0.16, rz: 0.5 });
  const armCart = villagerArm({ sleeve: TUNIC, skin: SKIN, x: 0.05, y: 0.1, z: 0.14, rz: -1.0 }); // arm on the cart
  sway.add(armStaff, armCart);
  g.add(sway);
  add(box(0.05, 1.5, 0.05), WOOD_DARK, { x: cx - 0.45, y: 0.72, z: cz + 0.1, rz: 0.18 }); // staff
  add(cyl(0.05, 0.05, 0.1, 6), ROPE, { x: cx - 0.56, y: 1.3, z: cz + 0.1, rz: 0.18 }); // a grip of cord near its head

  bake(g);
  return { group: g, sway, head, armStaff, armCart, muleHead, muleTail };
}
