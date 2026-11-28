// The collier’s cot — not yet built: a plain cottage holds its plot until it is.
export default {
  id: 'collier',
  name: 'The collier’s cot',
  note: 'The collier’s cot.',
  build(c) {
    c.shell();
    c.door(...c.plot.door);
    c.smoke('hole', 0);
  },
};
