// The turf cot — not yet built: a plain cottage holds its plot until it is.
export default {
  id: 'turfcot',
  name: 'The turf cot',
  note: 'The turf cot.',
  build(c) {
    c.shell();
    c.door(...c.plot.door);
    c.smoke('hole', 0);
  },
};
