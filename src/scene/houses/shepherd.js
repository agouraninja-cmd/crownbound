// The shepherd’s house — not yet built: a plain cottage holds its plot until it is.
export default {
  id: 'shepherd',
  name: 'The shepherd’s house',
  note: 'The shepherd’s house.',
  build(c) {
    c.shell();
    c.door(...c.plot.door);
    c.smoke('hole', 0);
  },
};
