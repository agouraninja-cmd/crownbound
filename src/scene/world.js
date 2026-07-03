import * as THREE from 'three';
import { LAYOUT } from './layout.js';
import { buildTerrain, terrainHeight } from './terrain.js';
import { buildSky, addLighting } from './sky.js';
import { buildScatter } from './scatter.js';
import { buildHovel, buildQuestBoard, buildTome, buildGranary, buildDummy, buildExchequer, HOVEL } from './structures.js';
import { createCampfire } from './campfire.js';

export { terrainHeight };

export function buildWorld(scene) {
  scene.add(buildSky());
  addLighting(scene);
  scene.add(buildTerrain());

  const scatter = buildScatter();
  scene.add(scatter.mesh);

  const colliders = [...scatter.colliders];

  function placeAt(group, { x, z, rotY = 0 }, colliderR) {
    group.position.set(x, terrainHeight(x, z), z);
    group.rotation.y = rotY;
    scene.add(group);
    if (colliderR) colliders.push({ x, z, r: colliderR });
    return group;
  }

  const hovel = buildHovel();
  placeAt(hovel.group, LAYOUT.hovel); // walls collide per-rect below, not as one circle

  placeAt(buildQuestBoard(), LAYOUT.questBoard, 0.8);
  placeAt(buildTome(), LAYOUT.tome, 0.55);
  placeAt(buildGranary(), LAYOUT.granary, 2.5);

  const dummy = buildDummy();
  placeAt(dummy.group, LAYOUT.dummy, 0.5);

  const campfire = createCampfire();
  placeAt(campfire.group, LAYOUT.campfire, 0.7);

  // the Exchequer booth; the clerk breathes so he doesn't read as furniture
  const exch = buildExchequer();
  placeAt(exch.group, LAYOUT.exchequer, 1.35);
  let exchT = 0;
  const exchequer = {
    update(dt) {
      exchT += dt;
      exch.sway.rotation.x = Math.sin(exchT * 1.3) * 0.028;
      exch.sway.rotation.z = Math.sin(exchT * 0.7) * 0.02;
    },
  };

  // hovel collision: axis-aligned wall/furniture rects (the hovel is unrotated)
  const H = HOVEL;
  const hx = LAYOUT.hovel.x;
  const hz = LAYOUT.hovel.z;
  const inX = H.halfX - H.wallT; // inner faces
  const inZ = H.halfZ - H.wallT;
  const rect = (x0, x1, z0, z1) => ({ minX: hx + x0, maxX: hx + x1, minZ: hz + z0, maxZ: hz + z1 });
  colliders.push(
    rect(-H.halfX, -inX, -H.halfZ, H.halfZ), // -x wall
    rect(-H.halfX, H.halfX, inZ, H.halfZ), // +z wall
    rect(-H.halfX, H.halfX, -H.halfZ, -inZ), // -z wall
    rect(inX, H.halfX, -H.halfZ, H.door.z0), // +x wall, south of the door
    rect(inX, H.halfX, H.door.z1, H.halfZ), // +x wall, north of the door
    rect(H.bed.x - 0.45, H.bed.x + 0.45, H.bed.z - 0.75, H.bed.z + 0.75), // cot
    rect(H.chest.x0, H.chest.x1, H.chest.z0, H.chest.z1), // chest
    { x: hx + H.hearth.x, z: hz + H.hearth.z, r: H.hearth.r }, // hearth
    { x: hx + H.table.x, z: hz + H.table.z, r: H.table.r } // table
  );

  // the door leaf: closed bars the gap, open swings clear of it
  const doorCollider = rect(inX, H.halfX, H.door.z0, H.door.z1);
  colliders.push(doorCollider);
  let doorOpen = false;
  let doorAnim = 0; // eased 0 closed → 1 open
  const door = {
    x: hx + H.halfX - H.wallT / 2,
    z: hz + (H.door.z0 + H.door.z1) / 2,
    radius: 2.2,
    get isOpen() {
      return doorOpen;
    },
    toggle() {
      doorOpen = !doorOpen;
      if (doorOpen) colliders.splice(colliders.indexOf(doorCollider), 1);
      else colliders.push(doorCollider);
      return doorOpen;
    },
    update(dt) {
      const target = doorOpen ? 1 : 0;
      doorAnim += (target - doorAnim) * (1 - Math.exp(-dt * 7));
      hovel.doorPivot.rotation.y = doorAnim * H.door.openAngle;
    },
  };

  // the indoor camera zone + where you stand up from the cot
  const hovelInterior = {
    minX: hx - inX,
    maxX: hx + inX,
    minZ: hz - inZ,
    maxZ: hz + inZ,
    ceilY: terrainHeight(hx, hz) + H.ceilY,
  };
  const wakeSpot = { x: hx + H.wake.x, z: hz + H.wake.z };
  // where the sleep animation lays the player: cot centre, mattress top,
  // facing +z so the head falls back onto the pillow at the cot's -z end
  const bedRest = {
    x: hx + H.bed.x,
    z: hz + H.bed.z,
    y: terrainHeight(hx, hz) + H.bed.topY,
    facing: 0,
  };

  const interactables = [
    { id: 'board', label: 'the Quest Board', x: LAYOUT.questBoard.x, z: LAYOUT.questBoard.z, radius: 2.7 },
    { id: 'tome', label: 'the Tome', x: LAYOUT.tome.x, z: LAYOUT.tome.z, radius: 2.4 },
    // insideOnly: don't offer these through the walls
    { id: 'bed', label: 'your straw cot', x: hx + H.bed.x, z: hz + H.bed.z, radius: 1.7, insideOnly: true },
    { id: 'ledger', label: 'the sleep ledger', x: hx + H.ledger.x, z: hz + H.ledger.z, radius: 1.5, insideOnly: true },
    {
      id: 'treasury',
      label: 'the Exchequer’s table',
      // the counter front in world coords — the booth is rotated toward the path
      x: LAYOUT.exchequer.x + 0.9 * Math.cos(LAYOUT.exchequer.rotY),
      z: LAYOUT.exchequer.z - 0.9 * Math.sin(LAYOUT.exchequer.rotY),
      radius: 2.2,
    },
  ];

  return { colliders, interactables, campfire, dummy, door, exchequer, hovelInterior, wakeSpot, bedRest };
}
