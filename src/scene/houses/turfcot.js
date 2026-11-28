import { TIMBER } from '../cottage.js';

// The turf hut: the poorest dwelling in the village.
export default {
  id: 'turfcot',
  name: 'The turf hut',
  note: 'The turf hut — sods for walls, sods for a roof, a hurdle for a door: the poorest hearth in the village.',
  build(c) {
    c.shell({ eave: 1.3, pitch: 40, walls: 'turf', frame: 'none', timber: TIMBER.old, roof: 'hip', thatch: 'turf', ridge: 'none', over: 0.3 });
    c.door(...c.plot.door, { kind: 'hurdle' });
    c.smoke('seep', 0);
  },
};
