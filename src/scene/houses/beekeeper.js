// The beekeeper’s house — not yet built: a plain cottage holds its plot until it is.
export default {
  id: 'beekeeper',
  name: 'The beekeeper’s house',
  note: 'The beekeeper’s house.',
  build(c) {
    c.shell();
    c.door(...c.plot.door);
    c.smoke('hole', 0);
  },
};
