// World layout: one shared map of where everything stands.
// The dirt path winds along z; pathX(z) gives its centerline.

export function pathX(z) {
  return Math.sin(z * 0.045) * 5;
}

export const LAYOUT = {
  playerSpawn: { x: -5, z: 4 },
  hovel: { x: -9, z: 2, rotY: 0 }, // door on local +x faces the path
  campfire: { x: -4.6, z: 6.2 },
  questBoard: { x: 4, z: -2, rotY: -Math.PI / 2 },
  tome: { x: -3.2, z: -5.5, rotY: Math.PI / 4 },
  dummy: { x: -8.5, z: 9.5 },
  granary: { x: 11, z: 11, rotY: -Math.PI / 5 },
  // dirt wear circles painted onto the terrain: {x, z, radius}
  dirtPatches: [
    { x: -4.6, z: 6.2, r: 2.6 }, // around campfire
    { x: -7, z: 3, r: 3.2 }, // in front of the hovel
    { x: -9, z: 2, r: 2.6 }, // under the hovel — the packed-earth floor indoors
    { x: -8.5, z: 9.5, r: 2.2 }, // under the dummy
    { x: 11, z: 11, r: 4.2 }, // granary yard
  ],
};
