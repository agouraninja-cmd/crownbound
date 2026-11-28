// The ox house — not yet built: a plain cottage holds its plot until it is.
export default {
  id: 'oxhouse',
  name: 'The ox house',
  note: 'The ox house.',
  build(c) {
    c.shell();
    c.door(...c.plot.door);
    c.smoke('hole', 0);
  },
};
