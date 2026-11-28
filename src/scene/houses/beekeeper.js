import * as THREE from 'three';
import { WASH, TIMBER, THATCHES } from '../cottage.js';
import { cone, lump } from '../toft.js';
import { mesh, tone } from '../meshUtils.js';
import { box, cyl, WOOD_DARK, WOOD_PALE, STRAW } from '../kit.js';

// The beekeeper's house: an ochre-washed house under a half-hipped roof, like
// a few others — what sets it apart stands behind it, on the sunny side. Five
// straw skeps sit in a row on a plank under a low thatch of their own, a
// hurdle at their backs against the north and their mouths to the morning sun;
// a scrap of hedge and an elder in flower keep the wind off one end, and the
// herbs the bees work are in bloom beside them. By the door: the spare skeps,
// straw for the next one, and the honey crocks.

const HOLLOW = 0x1f1812; // the dark inside a skep
const MOSS = 0x66773f;
const LINEN = 0xddd5bf;
const CROCK = 0x8f7f6c; // grey-brown ware
const ELDER = 0x4f7038;
const BLOSSOM = 0xf1ead2;

// A skep: a dome of coiled straw, each coil its own shade, the flight hole cut
// at its foot (toward +z). Stands on y = 0 of the group it is returned as.
const COILS = [[0.215, 0], [0.23, 0.12], [0.205, 0.24], [0.15, 0.34], [0.07, 0.41]]; // [radius, height] up the dome
function skep(g, rng, { x = 0, y = 0, z = 0, ry = 0, colour = STRAW, hole = true } = {}) {
  const s = new THREE.Group();
  s.position.set(x, y, z);
  s.rotation.y = ry;
  const straw = tone(colour, 0.92 + rng() * 0.14);
  for (let i = 0; i < COILS.length - 1; i++) {
    const [r0, y0] = COILS[i];
    const [r1, y1] = COILS[i + 1];
    // open rings, one on the next, turned so that a flat faces the front
    s.add(mesh(new THREE.CylinderGeometry(r1, r0, y1 - y0, 7, 1, true, Math.PI / 7), tone(straw, i % 2 ? 1.07 : 0.95), { y: (y0 + y1) / 2 }));
  }
  s.add(mesh(new THREE.ConeGeometry(0.07, 0.035, 7, 1, true, Math.PI / 7), tone(straw, 1.1), { y: 0.4275 }));
  if (hole) s.add(mesh(box(0.085, 0.05, 0.04), HOLLOW, { y: 0.035, z: 0.185, shadow: false }));
  g.add(s);
  return s;
}

// a honey crock: grey ware, a linen cloth tied over its mouth
function crock(g, x, y, z, r = 0.1) {
  g.add(mesh(cyl(r * 0.92, r, r * 2, 7), CROCK, { x, y: y + r, z }));
  g.add(mesh(cyl(r * 1.02, r * 0.98, 0.035, 7), LINEN, { x, y: y + r * 2 + 0.012, z }));
}

export default {
  id: 'beekeeper',
  name: 'The beekeeper’s house',
  note: 'The beekeeper’s house — straw skeps in a row under a little thatch of their own, their mouths to the sun, and herbs in flower beside them.',
  build(c) {
    const { rng } = c;
    c.shell({ eave: 1.65, pitch: 50, walls: 'daub', wash: WASH.ochre, frame: 'box', timber: TIMBER.grey, roof: 'halfhip', thatch: 'straw' });
    c.door(...c.plot.door, { open: 0.45 });
    c.window('front', 1.5, { shutter: 'side' });
    c.window('right', 0.55, { shutter: 'propped', bars: 0 });
    c.smoke('gablet', 1);
    // the front slope looks north: moss has taken it, and a patch of this year's straw is let in above the door
    for (const [along, down] of [[-1.9, 2.3], [0.9, 2.7], [1.7, 2.1]]) {
      c.add(box(0.5 + rng() * 0.4, 0.03, 0.34 + rng() * 0.3), tone(MOSS, 0.88 + rng() * 0.24), { ...c.onRoof(1, along, down, 0.012), shadow: false });
    }
    c.add(box(0.8, 0.03, 0.6), tone(THATCHES.new[0], 0.98), { ...c.onRoof(1, -0.5, 2.5, 0.014), shadow: false });

    // ---------- the bees: behind the house, in its lee, facing the sun ----------
    // the shelter is turned about, so its own front (+v) looks out of the yard to the south-east
    c.outbuilding(1.56, -2.68, Math.PI, { length: 2.6, width: 0.9 }, (b) => {
      b.shell({ eave: 1.05, pitch: 47, walls: 'open', timber: TIMBER.old, roof: 'gable', thatch: 'old', over: 0.12, thick: 0.13 });
      b.hurdle(0, -0.35, { len: 2.3, h: 0.78 }); // a hurdle across the back keeps the north wind out
      // the plank the skeps stand on, a little forward of the middle so the sun finds them
      const bench = b.at(0, 0.06);
      bench.add(mesh(box(2.46, 0.055, 0.5), tone(TIMBER.grey, 1.08), { y: 0.36 }));
      for (const x of [-0.9, 0.9]) {
        bench.add(mesh(box(0.07, 0.07, 0.5), WOOD_DARK, { x, y: 0.3 }));
        for (const z of [-0.2, 0.2]) bench.add(mesh(box(0.07, 0.62, 0.07), WOOD_DARK, { x, y: 0.02, z }));
      }
      for (let i = 0; i < 5; i++) {
        // one is this summer's swarm, hived in a skep still gold
        skep(bench, rng, { x: (i - 2) * 0.49, y: 0.3875, ry: (rng() - 0.5) * 0.3, colour: i === 3 ? THATCHES.new[1] : tone(STRAW, 0.86 + rng() * 0.12) });
      }
      b.block(-1.25, -0.2, 1.25, 0.34);
    });

    // a scrap of quick hedge from the wall out to an elder in flower: the lee the skeps stand in
    c.fence([[-0.55, -2.1], [-0.55, -2.6]], { kind: 'quick', h: 1.1 });
    {
      const elder = c.at(-0.62, -2.98, rng() * 6);
      for (const [x, y, z, r] of [[0, 0.5, 0, 0.42], [0.16, 0.95, 0.1, 0.36], [-0.14, 1.05, -0.08, 0.3]]) {
        const blob = mesh(lump(r), tone(ELDER, 0.9 + rng() * 0.22), { x, y, z, ry: rng() * 6 });
        blob.scale.y = 1.15;
        elder.add(blob);
        // its flat heads of blossom, laid on the leaves
        for (let k = 0; k < 4; k++) {
          const a = rng() * 6.283;
          const up = 0.35 + rng() * 0.6; // how high on the blob, 0 its middle … 1 its top
          const out = Math.sqrt(1 - up * up) * r * 0.96;
          elder.add(mesh(box(0.17, 0.045, 0.17), tone(BLOSSOM, 0.94 + rng() * 0.08), { x: x + Math.cos(a) * out, y: y + up * r * 1.12, z: z + Math.sin(a) * out, ry: rng() * 3, shadow: false }));
        }
      }
      c.solid(-0.62, -2.98, 0.3);
    }

    // the bee garth: borage, hyssop and marigolds in rows, all in flower
    {
      const bed = c.bed(-2.8, -3.3, -1.2, -2.4, { crop: 'bare' });
      const rows = [
        [-0.3, 0x6f9a5a, 0.2, 0xe2a22c, 0.085], // marigold, nearest the bound
        [0, 0x5f8a5a, 0.3, 0x5f86d6, 0.075], // borage
        [0.3, 0x6b8f4e, 0.42, 0x8a74c8, 0.07], // hyssop, tallest, under the wall
      ];
      for (const [z, leaf, tall, flower, size] of rows) {
        for (let i = 0; i < 6; i++) {
          const x = -0.66 + i * 0.264 + (rng() - 0.5) * 0.06;
          const h = tall * (0.85 + rng() * 0.3);
          bed.add(mesh(cone(0.085, h, 4), tone(leaf, 0.9 + rng() * 0.2), { x, y: 0.14 + h / 2, z, ry: rng() * 3 }));
          bed.add(mesh(box(size, size * (tall > 0.4 ? 1.8 : 0.8), size), tone(flower, 0.94 + rng() * 0.1), { x: x + (rng() - 0.5) * 0.03, y: 0.14 + h * 0.96, z, ry: rng() * 3, shadow: false }));
        }
      }
    }

    // ---------- by the door ----------
    // the bench, and the honey crocks set out on it
    c.bench(0.62, 2.0, { len: 1.0 });
    {
      const top = c.at(0.62, 2.0);
      crock(top, -0.24, 0.45, 0, 0.1);
      crock(top, 0.06, 0.45, 0.02, 0.085);
    }
    // spare skeps: two stacked one in the other, a third on its side showing its hollow
    {
      const spare = c.at(1.78, 2.0);
      skep(spare, rng, { hole: false, colour: tone(STRAW, 0.88) });
      skep(spare, rng, { y: 0.2, ry: 1, hole: false }).rotation.z = 0.1;
      const lying = skep(spare, rng, { x: 0.38, y: 0.215, z: 0.01, hole: false, colour: tone(STRAW, 0.95) });
      lying.rotation.set(0, 0.25, -Math.PI / 2);
      lying.add(mesh(new THREE.CircleGeometry(0.2, 7), HOLLOW, { y: 0.012, rx: Math.PI / 2, shadow: false }));
      c.solid(1.78, 2.0, 0.24);
    }
    // long straw for the next skep, bound in a sheaf and stood against the wall
    {
      const sheaf = c.at(-1.8, 1.98);
      sheaf.rotation.x = -0.16;
      sheaf.add(mesh(cyl(0.07, 0.13, 1.0, 6), tone(STRAW, 1.04), { y: 0.5 }));
      sheaf.add(mesh(cyl(0.11, 0.115, 0.05, 6), WOOD_PALE, { y: 0.42, shadow: false }));
    }
    c.bucket(-2.25, 2.0);
  },
};
