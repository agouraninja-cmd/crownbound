import * as THREE from 'three';
import { WASH, TIMBER, THATCHES } from '../cottage.js';
import { span, lump } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, WOOD_DARK, WOOD_PALE, LEATHER } from '../kit.js';

// The hayward’s cot: the least sort of house, limewashed some winters back and
// hipped at both ends, shut up by day — he is out round the corn. What sets it
// apart is the pinfold beside it, the village pound: a ring of stout stakes
// and wattle where a beast taken straying waits until its owner pays the
// fine. The horn he blows when cattle get into the corn hangs by his door.

const TAU = Math.PI * 2;
const MUD = 0x6a5740; // earth poached bare by hooves
const MUD_WET = 0x58462f;
const DUNG = 0x3f3122;
const HAY = 0xc8ab5c;

// The pinfold: a ten-sided ring as far toward +u as the yard runs, which
// leaves a man's width between it and the cot's end wall. Corner k stands
// (k + ½) tenths of a turn round from +u, so a flat side faces the cot and
// another the yard's far bound; the side from corner `gate` to the next is
// left open for the slip-poles, and looks out toward the door and the road.
const POUND = { u: 4.97, v: 0.25, r: 1.95, sides: 10, gate: 2 };
const FLOOR = 0.09; // how far its trodden floor lies above the turf it covers
const corner = (k) => {
  const a = ((k + 0.5) / POUND.sides) * TAU;
  return [POUND.u + Math.cos(a) * POUND.r, POUND.v + Math.sin(a) * POUND.r];
};

// flat facets from a list of triangles, each three [x, y, z] — for the two
// shapes here that no box or hull will make
function facets(tris) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(tris.flat(2), 3));
  geo.computeVertexNormals();
  return geo;
}

// The pound's floor: facets laid on the real ground, a little proud of it.
// The outermost of them run corner to corner under the wattle, and from there
// the rim dips away beneath the turf, so no edge shows.
function poachedFloor(c) {
  const N = POUND.sides;
  // [share of the radius, lift, how far round its first corner stands]: each ring
  // is turned half a corner on from the last, the outer two to the fence's own corners
  const rings = [[0.34, FLOOR, 0.5], [0.68, FLOOR, 1], [1, FLOOR, 1.5], [1.09, -0.16, 1.5]];
  const at = (ring, i) => {
    const [share, lift, turn] = rings[ring];
    const a = ((i + turn) / N) * TAU;
    const u = POUND.u + Math.cos(a) * POUND.r * share;
    const v = POUND.v + Math.sin(a) * POUND.r * share;
    return [u, c.ground(u, v) + lift, v];
  };
  // a band of facets between one ring and the next out
  const band = (ring) => {
    const tris = [];
    for (let i = 0; i < N; i++) tris.push([at(ring, i), at(ring, i + 1), at(ring + 1, i)], [at(ring + 1, i), at(ring, i + 1), at(ring + 1, i + 1)]);
    return tris;
  };
  const middle = [];
  const mid = [POUND.u, c.ground(POUND.u, POUND.v) + FLOOR, POUND.v];
  for (let i = 0; i < N; i++) middle.push([mid, at(0, i + 1), at(0, i)]);
  c.g.add(mesh(facets([...middle, ...band(0)]), MUD_WET)); // wettest where she stands
  c.g.add(mesh(facets([...band(1), ...band(2)]), MUD));
}

// The hayward’s horn on its peg, in a wall's own group: the mouth to the left,
// the strap looped over the peg above it. (x, y) is the middle of the curve it
// grew to — the horn hangs below that, and the peg is driven in above.
function hangHorn(wall, x, y) {
  const curve = 0.3; // the radius it grew to
  const sweep = 2.3; // how far round, mouth to tip
  const wide = [0.088, 0.075, 0.061, 0.046, 0.03, 0.012];
  const colours = [0x9c8257, 0x846a47, 0x69523a, 0x4c3b2c, 0x2e241d]; // brown at the mouth, black at the tip
  const z = 0.16; // clear of the rail it hangs across
  const at = (i) => {
    const a = -sweep / 2 + (i / 5) * sweep;
    return [x + Math.sin(a) * curve, y - Math.cos(a) * curve];
  };
  for (let i = 0; i < 5; i++) {
    const [x0, y0] = at(i);
    const [x1, y1] = at(i + 1);
    // each length a little over-long, so the bend shows no notch on its outer side
    wall.add(mesh(cyl(wide[i + 1], wide[i], Math.hypot(x1 - x0, y1 - y0) + 0.04, 6), colours[i], {
      x: (x0 + x1) / 2, y: (y0 + y1) / 2, z, rz: Math.atan2(x0 - x1, y1 - y0),
    }));
  }
  // the mouth's bound rim
  const [mx, my] = at(0);
  const [nx, ny] = at(1);
  wall.add(mesh(cyl(0.1, 0.1, 0.04, 6), 0x2a2019, { x: mx, y: my, z, rz: Math.atan2(mx - nx, ny - my) }));
  // the strap, from mouth and tip up over the peg
  const peg = [x + 0.03, y + 0.24, 0.14];
  const [sx, sy] = at(0.5);
  const [tx, ty] = at(4.3);
  span(wall, [sx, sy + 0.06, z], peg, 0.028, 0.016, LEATHER, false);
  span(wall, [tx, ty + 0.03, z], peg, 0.028, 0.016, LEATHER, false);
  wall.add(mesh(cyl(0.022, 0.028, 0.22, 5), WOOD_DARK, { x: peg[0], y: peg[1] - 0.012, z: 0.1, rx: Math.PI / 2 - 0.18 }));
}

export default {
  id: 'hayward',
  name: 'The hayward’s cot',
  note: 'The hayward’s cot — his horn hangs by the door, and a stray cow waits in the pinfold until her owner pays the fine.',
  build(c) {
    c.shell({ eave: 1.6, pitch: 50, walls: 'daub', wash: WASH.limeOld, frame: 'box', timber: TIMBER.grey, roof: 'hip', thatch: 'straw' });
    c.door(...c.plot.door);
    c.window('front', -1.4, { shutter: 'shut' });
    c.window('back', 0.5, { bars: 1, lit: 0 }); // it looks on the miller's strip: he can watch the corn from his bed
    c.smoke('gablet', -1, { lit: false });
    // where the thatcher was last up: a patch of this year's straw
    c.add(box(0.85, 0.03, 0.46), tone(THATCHES.new[1], 0.97), c.onRoof(1, -0.5, 1.42, 0.015));
    // ...and at the back, one panel daubed afresh and never limewashed: its
    // edges lie under the sill, the rail, the middle post and the corner brace
    const panel = [[0.02, 0.38, 0.012], [1.39, 0.38, 0.012], [1.78, 0.98, 0.012], [0.02, 0.98, 0.012]];
    c.onWall('back').add(mesh(facets([[panel[0], panel[1], panel[2]], [panel[0], panel[2], panel[3]]]), tone(WASH.daub, 0.95)));

    hangHorn(c.onWall('front', -0.62), 0, 1.2);
    c.tool(1.3, c.hz + 0.38, { kind: 'scythe', lean: 0.2 }); // the mowing is his to oversee, and to lead
    c.bench(-1.3, c.hz + 0.44, { len: 1.1, lift: -0.04 });

    // ----- the pinfold -----
    poachedFloor(c);
    // every stake's place, from one gatepost round to the other: each corner, and one between each pair
    const stakes = [];
    for (let i = 1; i <= POUND.sides; i++) {
      const [u, v] = corner(POUND.gate + i);
      if (i > 1) {
        const [pu, pv] = stakes[stakes.length - 1];
        stakes.push([(pu + u) / 2, (pv + v) / 2]);
      }
      stakes.push([u, v]);
    }
    c.fence(stakes, { h: 1.05 });
    // A pound must hold an ox that wants to go home: stout oak where a garden
    // fence has hazel rods. Each stands round the fence's own thin stake.
    stakes.forEach(([u, v], i) => {
      const gatepost = i === 0 || i === stakes.length - 1;
      const tall = gatepost ? 1.62 : 1.3 + c.rng() * 0.24;
      const lean = gatepost ? 0 : 0.03;
      const colour = i === 16 ? tone(TIMBER.new, 0.76) : TIMBER.old; // one was renewed this year
      c.at(u, v).add(mesh(cyl(gatepost ? 0.1 : 0.09, gatepost ? 0.125 : 0.115, tall + 0.4, 6), tone(colour, 0.88 + c.rng() * 0.24), {
        y: (tall - 0.4) / 2, ry: c.rng() * TAU, rx: (c.rng() - 0.5) * 2 * lean, rz: (c.rng() - 0.5) * 2 * lean,
      }));
    });
    // the slip-poles, between the two gateposts (the kit's own posts stand inside them)
    const [au, av] = stakes[stakes.length - 1];
    const [bu, bv] = stakes[0];
    const w = Math.hypot(bu - au, bv - av);
    const out = Math.atan2((av + bv) / 2 - POUND.v, (au + bu) / 2 - POUND.u); // which way the gate looks
    const gate = c.slipPoles((au + bu) / 2, (av + bv) / 2, { w, ry: Math.PI / 2 - out });
    span(gate, [-w / 2 - 0.1, 1.22, 0.05], [w / 2 + 0.1, 1.25, 0.05], 0.055, 0.055, tone(WOOD_PALE, 0.96)); // a third pole, for cattle

    // The stray: a small red cow, stood at the poles looking out for whoever
    // will come for her. Nothing within the ring is solid: he cannot get in.
    c.beast(POUND.u + 0.16, POUND.v + 0.6, { kind: 'cow', colour: 0x80442a, ry: -2.18, lift: FLOOR - 0.02, solid: false });
    c.trough(POUND.u + 0.45, POUND.v - 1.3, { len: 1.1, ry: 0.12, lift: FLOOR - 0.02, solid: false });
    // an armful of hay thrown down for her
    const fodder = c.at(POUND.u - 0.8, POUND.v - 0.95, 0.4, FLOOR - 0.01);
    for (const [x, z, r, squash] of [[0, 0, 0.3, 0.42], [0.2, 0.12, 0.2, 0.5], [-0.22, -0.1, 0.17, 0.4]]) {
      const heap = mesh(lump(r), tone(HAY, 0.92 + c.rng() * 0.14), { x, y: r * squash * 0.4, z, ry: c.rng() * TAU });
      heap.scale.y = squash;
      fodder.add(heap);
    }
    for (const [u, v] of [[0.95, 0.35], [1.2, -0.45], [0.2, -0.55]]) {
      c.at(POUND.u + u, POUND.v + v, c.rng() * TAU, FLOOR).add(mesh(cyl(0.12, 0.17, 0.05, 5), DUNG, { y: 0.012, shadow: false }));
    }
    // what is forked out of it is heaped by the gate, and goes on somebody's garden
    c.midden(6.3, 2.45, { r: 0.45, lift: -0.05 });
    c.tool(5.94, 2.26, { kind: 'fork', lean: 0.24, ry: 0.314 }); // the fork, leaned on the wattle between two stakes

    // ----- the fences are his charge too: a spare hurdle and new stakes at the end wall -----
    c.hurdle(-c.hx - 0.42, -0.45, { len: 1.5, h: 0.9, lean: 0.32, ry: -Math.PI / 2 });
    const bundle = new THREE.Group();
    bundle.rotation.x = -0.22; // leaned on the wall, as the kit leans a tool
    c.at(-c.hx - 0.45, 0.95, -Math.PI / 2).add(bundle);
    for (let i = 0; i < 5; i++) {
      const len = 1.35 + c.rng() * 0.25;
      bundle.add(mesh(box(0.05, len, 0.05), tone(TIMBER.new, 0.9 + c.rng() * 0.2), {
        x: (i - 2) * 0.07, y: len / 2 - 0.02, z: (i % 2) * 0.04, rz: (c.rng() - 0.5) * 0.1,
      }));
    }
    c.bush(2.75, -1.72, { r: 0.28, colour: 0x4a6a34 }); // nettles, where nobody treads
  },
};
