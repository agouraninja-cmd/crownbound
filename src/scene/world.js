import * as THREE from 'three';
import { LAYOUT } from './layout.js';
import { buildTerrain, terrainHeight } from './terrain.js';
import { buildSky, addLighting } from './sky.js';
import { buildScatter } from './scatter.js';
import { buildHovel, buildQuestBoard, buildTome, buildGranary, buildDummy } from './structures.js';
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

  placeAt(buildHovel(), LAYOUT.hovel, 2.4);
  placeAt(buildQuestBoard(), LAYOUT.questBoard, 0.8);
  placeAt(buildTome(), LAYOUT.tome, 0.55);
  placeAt(buildGranary(), LAYOUT.granary, 2.5);

  const dummy = buildDummy();
  placeAt(dummy.group, LAYOUT.dummy, 0.5);

  const campfire = createCampfire();
  placeAt(campfire.group, LAYOUT.campfire, 0.7);

  const interactables = [
    { id: 'board', label: 'the Quest Board', x: LAYOUT.questBoard.x, z: LAYOUT.questBoard.z, radius: 2.7 },
    { id: 'tome', label: 'the Tome', x: LAYOUT.tome.x, z: LAYOUT.tome.z, radius: 2.4 },
  ];

  return { colliders, interactables, campfire, dummy };
}
