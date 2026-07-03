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
  charter: { x: 1.2, z: 0.4, rotY: -0.9 }, // the Village Charter post, parchment toward the westward path
  exchequer: { x: 6.5, z: 3, rotY: Math.PI + 0.15 }, // money-changer's booth, counter toward the path
  cart: { x: 3.2, z: 8.5, rotY: Math.PI / 2 + 0.15 }, // the chapman parks here on market days, mule toward the village
  dummy: { x: -8.5, z: 9.5 },
  granary: { x: 11, z: 11, rotY: -Math.PI / 5 },
  miller: { x: 9.0, z: 9.3, rotY: 2.44 }, // minding his granary, facing the village
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
