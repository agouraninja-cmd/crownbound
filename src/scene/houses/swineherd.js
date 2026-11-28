// The swineherd’s house — not yet built: a plain cottage holds its plot until it is.
export default {
  id: 'swineherd',
  name: 'The swineherd’s house',
  note: 'The swineherd’s house.',
  build(c) {
    c.shell();
    c.door(...c.plot.door);
    c.smoke('hole', 0);
  },
};
