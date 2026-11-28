// The smithy — not yet built: a plain cottage holds its plot until it is.
export default {
  id: 'smith',
  name: 'The smithy',
  note: 'The smithy.',
  build(c) {
    c.shell();
    c.door(...c.plot.door);
    c.smoke('hole', 0);
  },
};
