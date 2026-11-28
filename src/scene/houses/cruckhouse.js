import { WASH } from '../cottage.js';

// The cruck house: round one — the shell as assigned, to see what the kit draws in the gables.
export default {
  id: 'cruckhouse',
  name: 'The cruck house',
  note: 'The cruck house — great curved oaks meet in each gable end, and a pig roots for windfalls under the fruit trees.',
  build(c) {
    c.shell({ eave: 1.75, pitch: 52, walls: 'daub', wash: WASH.daub, frame: 'cruck', timber: 0x8a8378, roof: 'gable', thatch: 'straw' });
    c.door(...c.plot.door);
    c.door('back', 0.7);
    c.window('front', -1.6, { shutter: 'side', hinge: -1 });
    c.window('back', -1.9);
    c.smoke('hole', -1.2);

    c.tree(-3.0, 3.1, { kind: 'apple', h: 2.7 });
    c.tree(-1.5, 3.2, { kind: 'pear', h: 2.4 });
    c.tree(-0.4, 2.9, { kind: 'plum', h: 2.2 });
  },
};
