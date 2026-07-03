import * as THREE from 'three';
import { mesh } from './meshUtils.js';

const WOOD_DARK = 0x553d24;
const WOOD = 0x755636;
const WOOD_PALE = 0x8f6d42;
const CANVAS = 0xd8cfae;
const STRAW = 0xc8a35a;
const CLAY = 0x9c5e3c;
const MULE = 0x8a7a68;
const MULE_DARK = 0x5c5045;
const HOOD = 0x6e3b2c; // road-worn madder red
const TUNIC = 0x74562e;
const SKIN = 0xcfa46f;
const RUG_RED = 0x8a3a2a;

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, seg = 7) => new THREE.CylinderGeometry(rt, rb, h, seg);

// The chapman's cart: a two-wheeled peddler's cart under a canvas awning,
// mule in the shafts, the chapman himself on the path side. Only parked in
// the world on market days (world.js decides). Local +x is where the mule
// points; the chapman stands on the local -z side.
// Returns { group, sway, muleHead, muleTail } — the animated parts.
export function buildCart() {
  const g = new THREE.Group();

  // bed, sideboards, head/tail boards
  g.add(mesh(box(2.0, 0.12, 1.25), WOOD, { y: 0.82 }));
  g.add(mesh(box(2.0, 0.3, 0.08), WOOD_PALE, { y: 1.03, z: 0.62 }));
  g.add(mesh(box(2.0, 0.3, 0.08), WOOD_PALE, { y: 1.03, z: -0.62 }));
  g.add(mesh(box(0.08, 0.34, 1.25), WOOD_PALE, { x: 0.98, y: 1.05 }));
  g.add(mesh(box(0.08, 0.34, 1.25), WOOD_PALE, { x: -0.98, y: 1.05 }));

  // one axle, two tall wheels
  g.add(mesh(cyl(0.05, 0.05, 1.7, 6), WOOD_DARK, { x: -0.1, y: 0.55, rx: Math.PI / 2 }));
  for (const s of [-1, 1]) {
    g.add(mesh(cyl(0.55, 0.55, 0.09, 10), WOOD_DARK, { x: -0.1, y: 0.55, z: s * 0.82, rx: Math.PI / 2 }));
    g.add(mesh(cyl(0.12, 0.12, 0.12, 7), WOOD_PALE, { x: -0.1, y: 0.55, z: s * 0.82, rx: Math.PI / 2 }));
  }

  // shafts reaching forward to the mule
  g.add(mesh(box(1.5, 0.06, 0.06), WOOD_DARK, { x: 1.6, y: 0.72, z: 0.4, rz: -0.05 }));
  g.add(mesh(box(1.5, 0.06, 0.06), WOOD_DARK, { x: 1.6, y: 0.72, z: -0.4, rz: -0.05 }));

  // canvas awning on four posts over the rear of the bed
  for (const [px, pz] of [[-0.95, -0.58], [-0.95, 0.58], [0.5, -0.58], [0.5, 0.58]]) {
    g.add(mesh(box(0.05, 0.75, 0.05), WOOD_DARK, { x: px, y: 1.32, z: pz }));
  }
  g.add(mesh(box(1.75, 0.05, 1.5), CANVAS, { x: -0.22, y: 1.74, rz: 0.05 }));

  // wares: crates, a grain sack, a rolled rug, hanging pots
  g.add(mesh(box(0.4, 0.34, 0.4), WOOD_PALE, { x: -0.55, y: 1.05, z: 0.25 }));
  g.add(mesh(box(0.32, 0.26, 0.32), WOOD_PALE, { x: -0.5, y: 1.01, z: -0.32, ry: 0.4 }));
  const sack = mesh(new THREE.SphereGeometry(0.26, 7, 5), STRAW, { x: 0.15, y: 1.02, z: 0.3 });
  sack.scale.set(1, 0.75, 0.9);
  g.add(sack);
  g.add(mesh(cyl(0.12, 0.12, 0.7, 7), RUG_RED, { x: 0.2, y: 1.0, z: -0.25, rx: Math.PI / 2, ry: 0.2 }));
  g.add(mesh(cyl(0.08, 0.1, 0.16, 7), CLAY, { x: -1.06, y: 1.12, z: 0.2 }));
  g.add(mesh(cyl(0.07, 0.09, 0.14, 7), CLAY, { x: -1.06, y: 1.1, z: -0.15 }));

  // the mule, dozing in the shafts
  g.add(mesh(box(0.85, 0.42, 0.36), MULE, { x: 1.9, y: 0.85 }));
  for (const [lx, lz] of [[1.6, -0.13], [1.6, 0.13], [2.2, -0.13], [2.2, 0.13]]) {
    g.add(mesh(box(0.09, 0.55, 0.09), MULE_DARK, { x: lx, y: 0.28, z: lz }));
  }
  g.add(mesh(box(0.18, 0.42, 0.16), MULE, { x: 2.38, y: 1.12, rz: -0.5 }));
  const muleHead = new THREE.Group();
  muleHead.position.set(2.52, 1.28, 0);
  muleHead.add(mesh(box(0.36, 0.17, 0.15), MULE, { x: 0.12, y: -0.04 }));
  muleHead.add(mesh(box(0.12, 0.14, 0.13), MULE_DARK, { x: 0.3, y: -0.06 })); // muzzle
  muleHead.add(mesh(new THREE.ConeGeometry(0.045, 0.18, 5), MULE_DARK, { y: 0.14, z: -0.06 }));
  muleHead.add(mesh(new THREE.ConeGeometry(0.045, 0.18, 5), MULE_DARK, { y: 0.14, z: 0.06 }));
  g.add(muleHead);
  const muleTail = new THREE.Group();
  muleTail.position.set(1.48, 1.0, 0);
  muleTail.add(mesh(box(0.04, 0.42, 0.04), MULE_DARK, { y: -0.2 }));
  g.add(muleTail);

  // the chapman on the path side — hood up, staff leaned on the sideboard.
  // Mute for now; v2 gives him words. Robe stands still, the rest breathes.
  const cx = -0.3;
  const cz = -1.05;
  g.add(mesh(cyl(0.17, 0.24, 0.95, 7), TUNIC, { x: cx, y: 0.32, z: cz }));
  g.add(mesh(cyl(0.185, 0.185, 0.06, 7), WOOD_DARK, { x: cx, y: 0.66, z: cz })); // belt
  const sway = new THREE.Group();
  sway.position.set(cx, 0.78, cz);
  sway.add(mesh(cyl(0.15, 0.175, 0.34, 7), TUNIC, { y: 0.12 }));
  sway.add(mesh(new THREE.SphereGeometry(0.13, 7, 6), SKIN, { y: 0.42 }));
  sway.add(mesh(new THREE.ConeGeometry(0.17, 0.3, 7), HOOD, { y: 0.52 })); // road hood
  sway.add(mesh(box(0.06, 0.36, 0.06), TUNIC, { x: -0.05, y: 0.1, z: -0.16, rz: 0.5 }));
  sway.add(mesh(box(0.06, 0.36, 0.06), TUNIC, { x: 0.05, y: 0.1, z: 0.14, rz: -1.0 })); // arm on the cart
  g.add(sway);
  g.add(mesh(box(0.05, 1.5, 0.05), WOOD_DARK, { x: cx - 0.45, y: 0.72, z: cz + 0.1, rz: 0.18 })); // staff

  return { group: g, sway, muleHead, muleTail };
}
