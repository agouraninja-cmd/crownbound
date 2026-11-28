// The potter’s cot — not yet built: a plain cottage holds its plot until it is.
export default {
  id: 'potter',
  name: 'The potter’s cot',
  note: 'The potter’s cot.',
  build(c) {
    c.shell();
    c.door(...c.plot.door);
    c.smoke('hole', 0);
  },
};
