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

export function buildHovel() {
  const g = new THREE.Group();

  g.add(mesh(box(3.4, 2.0, 2.9), WOOD, { y: 1.0, rz: 0.015 }));
  // patch planks — it should look shabby
  g.add(mesh(box(0.12, 1.1, 0.7), WOOD_DARK, { x: 1.68, y: 0.9, z: 0.6, rx: 0.08 }));
  g.add(mesh(box(0.8, 0.14, 0.12), WOOD_PALE, { x: -0.4, y: 1.5, z: 1.48, rz: -0.1 }));

  // thatched roof: two slabs meeting at a slightly crooked ridge
  g.add(mesh(box(4.0, 0.18, 1.9), THATCH, { y: 2.55, z: -0.78, rx: -0.62 }));
  g.add(mesh(box(4.0, 0.18, 1.9), THATCH_DARK, { y: 2.57, z: 0.78, rx: 0.6, rz: 0.012 }));
  g.add(mesh(box(4.1, 0.16, 0.3), WOOD_DARK, { y: 3.06, rz: 0.01 }));

  // door on the +x face
  g.add(mesh(box(0.1, 1.3, 0.74), WOOD_DARK, { x: 1.72, y: 0.66, z: -0.5 }));
  g.add(mesh(box(0.06, 1.42, 0.1), WOOD_PALE, { x: 1.73, y: 0.72, z: -0.12 }));
  g.add(mesh(box(0.06, 1.42, 0.1), WOOD_PALE, { x: 1.73, y: 0.72, z: -0.88 }));
  // tiny dark window
  g.add(mesh(box(0.08, 0.42, 0.42), 0x2c2017, { x: 1.71, y: 1.35, z: 0.74 }));

  // barrel by the wall
  const barrel = mesh(cyl(0.32, 0.36, 0.78, 9), WOOD_PALE, { x: 1.1, y: 0.39, z: 1.75 });
  g.add(barrel);
  g.add(mesh(cyl(0.37, 0.37, 0.07, 9), WOOD_DARK, { x: 1.1, y: 0.2, z: 1.75 }));
  g.add(mesh(cyl(0.37, 0.37, 0.07, 9), WOOD_DARK, { x: 1.1, y: 0.6, z: 1.75 }));

  return g;
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
