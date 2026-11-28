// The woodward’s house — not yet built: a plain cottage holds its plot until it is.
export default {
  id: 'woodward',
  name: 'The woodward’s house',
  note: 'The woodward’s house.',
  build(c) {
    c.shell();
    c.door(...c.plot.door);
    c.smoke('hole', 0);
  },
};
