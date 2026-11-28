// The stone house by the well — not yet built: a plain cottage holds its plot until it is.
export default {
  id: 'wellhouse',
  name: 'The stone house by the well',
  note: 'The stone house by the well.',
  build(c) {
    c.shell();
    c.door(...c.plot.door);
    c.smoke('hole', 0);
  },
};
