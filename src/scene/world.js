import * as THREE from 'three';
import { LAYOUT } from './layout.js';
import { buildTerrain, terrainHeight } from './terrain.js';
import { buildSky, buildClouds, addLighting } from './sky.js';
import { buildScatter } from './scatter.js';
import { buildFlora } from './flora.js';
import { windTime } from './wind.js';
import { buildAmbient } from './ambient.js';
import { buildHovel, buildQuestBoard, buildTome, buildGranary, buildDummy, buildExchequer, buildCharter, buildMiller, HOVEL } from './structures.js';
import { buildCart } from './cart.js';
import { makeAlive, makeStroll } from './alive.js';
import { createCampfire } from './campfire.js';

export { terrainHeight };

export function buildWorld(scene, marketToday = false) {
  const sky = buildSky();
  const clouds = buildClouds();
  scene.add(sky, clouds);
  const light = addLighting(scene);
  scene.add(buildTerrain());

  const scatter = buildScatter();
  scene.add(...scatter.meshes);
  const flora = buildFlora(scatter);
  scene.add(flora);

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

  // home upgrades bought from the chapman: meshes pre-built, shown when owned
  const homeUpgrades = hovel.upgrades;
  function applyHomeUpgrades(ownedIds) {
    for (const [id, obj] of Object.entries(homeUpgrades)) {
      obj.visible = ownedIds.includes(id);
    }
  }

  placeAt(buildQuestBoard(), LAYOUT.questBoard, 0.8);
  placeAt(buildTome(), LAYOUT.tome, 0.55);
  placeAt(buildCharter(), LAYOUT.charter, 0.35);
  placeAt(buildGranary(), LAYOUT.granary, 2.5);

  const dummy = buildDummy();
  placeAt(dummy.group, LAYOUT.dummy, 0.5);

  const campfire = createCampfire();
  placeAt(campfire.group, LAYOUT.campfire, 0.7);

  // the Exchequer booth; the clerk breathes, watches the path, and fidgets
  // (alive.js drives it — update(dt, playerPos) from main.js)
  const exch = buildExchequer();
  placeAt(exch.group, LAYOUT.exchequer, 1.35);
  const exchequer = makeAlive({
    x: LAYOUT.exchequer.x,
    z: LAYOUT.exchequer.z,
    yaw: LAYOUT.exchequer.rotY,
    forward: Math.PI / 2, // he faces the counter on local +x
    sway: exch.sway,
    head: exch.head,
    gestures: [
      // counting the cloth: the right hand pats out coins in little rows
      { dur: 1.8, apply: (k) => { exch.armR.rotation.z = -1.15 + Math.sin(k * Math.PI * 4) * 0.12 * Math.sin(k * Math.PI); } },
      // reaching across to square the ledger
      { dur: 1.5, apply: (k) => { exch.armL.rotation.z = -1.15 + Math.sin(k * Math.PI) * 0.4; } },
    ],
  });

  // the miller minds his granary — the rat bounty finally has a face, and
  // rounds to walk: post → west corner → south corner, pausing to work at
  // each. His collider and his E-prompt follow him (see millerSpot below);
  // the sack and fork stay planted at his post.
  const mill = buildMiller();
  placeAt(mill.group, LAYOUT.miller); // the stroll drives position from here on
  placeAt(mill.props, LAYOUT.miller);
  const millerCollider = { x: LAYOUT.miller.x, z: LAYOUT.miller.z, r: 0.4 };
  colliders.push(millerCollider);
  const millerSpot = { id: 'miller', label: 'the miller', x: LAYOUT.miller.x, z: LAYOUT.miller.z, radius: 2.0 };
  const rounds = makeStroll({
    group: mill.group,
    forward: Math.PI / 2, // he faces local +x
    terrainY: terrainHeight,
    // all three points sit in the yard's dirt, clear of the granary's circle
    waypoints: [
      { x: LAYOUT.miller.x, z: LAYOUT.miller.z, face: LAYOUT.miller.rotY + Math.PI / 2 }, // his post, eyeing the village
      { x: 8.0, z: 11.0, face: Math.PI / 2 }, // west corner, facing his grain
      { x: 10.2, z: 8.4, face: 0.3 }, // south corner, likewise
    ],
    onMove: (x, z) => {
      millerCollider.x = x;
      millerCollider.z = z;
      millerSpot.x = x;
      millerSpot.z = z;
    },
  });
  const miller = makeAlive({
    x: LAYOUT.miller.x,
    z: LAYOUT.miller.z,
    yaw: LAYOUT.miller.rotY,
    forward: Math.PI / 2,
    stroll: rounds,
    sway: mill.sway,
    head: mill.head,
    gestures: [
      // wiping the flour from his brow
      { dur: 1.6, apply: (k) => { mill.armR.rotation.z = -0.35 - Math.sin(k * Math.PI) * 0.85; } },
      // unfolding an arm to rest on his hip
      { dur: 1.9, apply: (k) => { mill.armL.rotation.x = -1.25 + Math.sin(k * Math.PI) * 0.75; } },
    ],
  });

  // the chapman's cart parks by the path on market days only — no cart, no
  // collider, no prompt on other days (his wheel ruts stay painted year-round)
  let cart = null;
  if (marketToday) {
    const c = buildCart();
    placeAt(c.group, LAYOUT.cart, 1.5);
    const th = LAYOUT.cart.rotY;
    // the mule stands ahead of the bed; his own collision circle
    colliders.push({ x: LAYOUT.cart.x + 1.9 * Math.cos(th), z: LAYOUT.cart.z - 1.9 * Math.sin(th), r: 0.9 });
    // the chapman's own world position (he stands off the cart's centre)
    const chapman = makeAlive({
      x: LAYOUT.cart.x + -0.3 * Math.cos(th) + -1.05 * Math.sin(th),
      z: LAYOUT.cart.z - -0.3 * Math.sin(th) + -1.05 * Math.cos(th),
      yaw: th,
      forward: Math.PI, // he faces the path on local -z
      sway: c.sway,
      head: c.head,
      gestures: [
        // nudging a ware straight on the cart bed
        { dur: 1.5, apply: (k) => { c.armCart.rotation.z = -1.0 + Math.sin(k * Math.PI) * 0.45; } },
        // resettling his weight on the staff
        { dur: 1.7, apply: (k) => { c.armStaff.rotation.z = 0.5 + Math.sin(k * Math.PI) * 0.35; } },
      ],
    });
    let cartT = (LAYOUT.cart.x * 5.1) % Math.PI;
    cart = {
      chapman,
      update(dt, playerPos) {
        cartT += dt;
        c.muleHead.rotation.z = -0.1 + Math.sin(cartT * 0.5) * 0.09; // dozy nod
        c.muleTail.rotation.x = Math.sin(cartT * 2.1) * 0.3; // fly-swatting
        chapman.update(dt, playerPos);
      },
    };
  }

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
    { x: hx + H.table.x, z: hz + H.table.z, r: H.table.r }, // table
    { x: hx + H.barrel.x, z: hz + H.barrel.z, r: H.barrel.r }, // the water butt outside
    rect(H.woodpile.x0, H.woodpile.x1, H.woodpile.z0, H.woodpile.z1) // the woodpile outside
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

  // the chest by the cot: E lifts the lid and opens the Chest panel; closing
  // the panel lowers it (main.js). The lid's angle is never saved.
  let chestOpen = false;
  let chestAnim = 0; // eased 0 shut → 1 open
  const chest = {
    get isOpen() {
      return chestOpen;
    },
    setOpen(v) {
      chestOpen = v;
    },
    update(dt) {
      const target = chestOpen ? 1 : 0;
      chestAnim += (target - chestAnim) * (1 - Math.exp(-dt * 6));
      hovel.chestLid.rotation.x = chestAnim * H.chest.openAngle;
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
    { id: 'guide', label: 'the Village Charter', x: LAYOUT.charter.x, z: LAYOUT.charter.z, radius: 2.2 },
    { id: 'miller', label: 'the miller', x: LAYOUT.miller.x, z: LAYOUT.miller.z, radius: 2.0 },
    // insideOnly: don't offer these through the walls
    { id: 'bed', label: 'your straw cot', x: hx + H.bed.x, z: hz + H.bed.z, radius: 1.7, insideOnly: true },
    { id: 'ledger', label: 'the sleep ledger', x: hx + H.ledger.x, z: hz + H.ledger.z, radius: 1.5, insideOnly: true },
    {
      id: 'chest',
      label: 'open the chest',
      x: hx + (H.chest.x0 + H.chest.x1) / 2,
      z: hz + (H.chest.z0 + H.chest.z1) / 2,
      // the cot crowds the chest's front, so you stand at its corner (~0.75
      // off centre) — which is also where you wake, so waking offers the lid
      radius: 1.1,
      insideOnly: true,
    },
    {
      id: 'treasury',
      label: 'the Exchequer’s table',
      // the counter front in world coords — the booth is rotated toward the path
      x: LAYOUT.exchequer.x + 0.9 * Math.cos(LAYOUT.exchequer.rotY),
      z: LAYOUT.exchequer.z - 0.9 * Math.sin(LAYOUT.exchequer.rotY),
      radius: 2.2,
    },
  ];

  if (cart) {
    // the chapman's side of the cart, in world coords (the cart is rotated)
    const th = LAYOUT.cart.rotY;
    const lx = -0.3;
    const lz = -1.05;
    interactables.push({
      id: 'shop',
      label: 'the chapman’s cart',
      x: LAYOUT.cart.x + lx * Math.cos(th) + lz * Math.sin(th),
      z: LAYOUT.cart.z - lx * Math.sin(th) + lz * Math.cos(th),
      radius: 2.4,
    });
  }

  // ambient life: smoke from the hovel's roof, motes, birds, butterflies
  const ambient = buildAmbient({
    smokeAt: { x: hx + H.smoke.x, y: terrainHeight(hx, hz) + H.smoke.y, z: hz + H.smoke.z },
    flowerSpots: flora.userData.patches,
  });
  scene.add(ambient.group);

  // Scenery that keeps moving whether or not a panel is open (main.js calls
  // this every slice of the loop): the hearth, the wind, the drifting clouds,
  // the sky riding with the camera, the shadow box centred on the player.
  let hearthT = 0;
  function update(dt, playerPos, camera) {
    // the hearth indoors: a small unsteady flame and the glow it throws
    hearthT += dt;
    const flick = 1 + Math.sin(hearthT * 11.3) * 0.08 + Math.sin(hearthT * 27.1) * 0.05;
    const fire = hovel.hearth;
    fire.flames.scale.set(flick, 1 + (flick - 1) * 2.5, flick);
    fire.flames.rotation.y += dt * 1.1;
    fire.glow.intensity = 2.2 * (1 + (flick - 1) * 1.4);
    fire.halo.material.opacity = 0.4 * flick;

    windTime.value += dt;
    clouds.rotation.y += dt * 0.0035;
    sky.position.copy(camera.position);
    light.followShadow(playerPos);
    ambient.update(dt, camera);
  }

  return { colliders, interactables, campfire, dummy, door, chest, exchequer, cart, miller, homeUpgrades, applyHomeUpgrades, hovelInterior, wakeSpot, bedRest, update };
}
