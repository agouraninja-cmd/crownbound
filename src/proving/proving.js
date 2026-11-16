// The Proving Ground: a second world for trying things out. Open the game
// with ?test=1 and it runs on its own save slot — the true save is never
// written there, and read only when the `copy` command is asked to. The test
// world has a command line (console.js) and a clock that can be moved, so a
// night can pass when told to: streaks, the crop, market days and the dawn
// can all be tried in one sitting.
//
// This module must stay the FIRST import of main.js — the moved clock has to
// be in place before any other module asks the time.
import { CONFIG } from '../state/config.js';

const param = new URLSearchParams(location.search).get('test');
export const PROVING = param !== null && param !== '0';

// where this world's save lives (the Scribe's `_prev` stash follows it)
export const SAVE_KEY = PROVING ? 'crownbound_test_save' : CONFIG.saveKey;

// the address of the other world: this page with ?test=1 put on or taken off
export function worldUrl(test) {
  const url = new URL(location.href);
  if (test) {
    url.searchParams.set('test', '1');
  } else {
    url.searchParams.delete('test');
    url.searchParams.delete('market'); // a chapman called by command stays behind in the test world
  }
  return url.toString();
}

// ---------- the moved clock ----------
// The game reads the hour and the day with `new Date()` in dozens of places
// (rollover, the sky, market days, the dawn). Rather than thread a clock
// through all of them, the test world swaps in a Date that runs `shift`
// milliseconds ahead of the real one. Dates built from a value (a save's
// timestamp, a year-month-day) are untouched; only "now" moves.
const CLOCK_KEY = 'crownbound_test_clock'; // { days, ms }: whole days forward, plus a shift of the hour
const RealDate = Date;
let shift = 0;

function storedClock() {
  try {
    const c = JSON.parse(localStorage.getItem(CLOCK_KEY));
    if (c && Number.isFinite(c.days) && Number.isFinite(c.ms)) return c;
  } catch {}
  return { days: 0, ms: 0 };
}

// days are counted on the calendar, so the hour holds when the clocks change
function shiftFor({ days, ms }) {
  const real = new RealDate();
  const moved = new RealDate(real);
  moved.setDate(moved.getDate() + days);
  return moved.getTime() - real.getTime() + ms;
}

function MovedDate(...args) {
  if (!new.target) return new MovedDate().toString(); // Date() called plainly gives the time as text
  const d = args.length ? new RealDate(...args) : new RealDate(RealDate.now() + shift);
  Object.setPrototypeOf(d, new.target.prototype);
  return d;
}
MovedDate.prototype = RealDate.prototype; // every date, old or new, is still `instanceof Date`
MovedDate.now = () => RealDate.now() + shift;
MovedDate.parse = RealDate.parse;
MovedDate.UTC = RealDate.UTC;

if (PROVING) {
  shift = shiftFor(storedClock());
  globalThis.Date = MovedDate;
}

// how far the test world's clock stands from the real one
export function clockMoved() {
  return storedClock();
}

// `n` nights pass. The clock moves at once, but a new day only begins on a
// load (the game finds it there, as on a real morning) — so the caller reloads.
export function passDays(n) {
  const c = { days: storedClock().days + n, ms: storedClock().ms };
  localStorage.setItem(CLOCK_KEY, JSON.stringify(c));
  shift = shiftFor(c);
}

// Set the hour of the test world's day. Takes hold at once, no reload: the
// day itself does not change, so nothing needs to roll over.
export function setHour(hours, minutes) {
  const now = new Date();
  const then = new Date(now);
  then.setHours(hours, minutes, 0, 0);
  const moved = then.getTime() - now.getTime();
  shift += moved;
  const c = storedClock();
  localStorage.setItem(CLOCK_KEY, JSON.stringify({ days: c.days, ms: c.ms + moved }));
}

// back to the real day and hour (the caller reloads)
export function realClock() {
  localStorage.removeItem(CLOCK_KEY);
}

// ---------- reloading ----------
// Some commands only take hold on a load (a new day, a fresh world, the
// chapman called). The page reloads — to another address if one is given —
// and the line left here is shown once it is back.
const NOTE_KEY = 'crownbound_test_note';

export function reloadWith(note, url) {
  sessionStorage.setItem(NOTE_KEY, note);
  if (url) location.href = url;
  else location.reload();
}

export function takeNote() {
  const note = sessionStorage.getItem(NOTE_KEY);
  sessionStorage.removeItem(NOTE_KEY);
  return note;
}
