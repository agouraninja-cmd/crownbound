// The cruck house — not yet built: a plain cottage holds its plot until it is.
export default {
  id: 'cruckhouse',
  name: 'The cruck house',
  note: 'The cruck house.',
  build(c) {
    c.shell();
    c.door(...c.plot.door);
    c.smoke('hole', 0);
  },
};
