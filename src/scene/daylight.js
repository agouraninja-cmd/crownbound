import * as THREE from 'three';
import { NORTH } from './layout.js';

// The hour of the real day. The player's own clock — the browser already keeps
// it in his time zone — says where the sun and moon stand over the village:
// skyAt() is the whole of the reckoning, and it is pure, so the smoke suite
// can ask it about any date it likes. sky.js paints what it answers.

// What the unlit things of the scene (smoke, butterflies, motes) need to know
// of the hour. sky.js keeps it current; they only read it.
export const daylight = {
  veil: new THREE.Color(1, 1, 1), // the tint the hour lays over anything that makes no light of its own
  sunAlt: 45, // the sun's height, degrees above the horizon (negative: below it)
  night: 0, // 0 by day … 1 in full night
};

const RAD = Math.PI / 180;
const TILT = 23.44; // the lean of the earth, degrees: what makes the seasons
const MOON_MONTH = 29.530588; // days from one new moon to the next
const A_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14); // one to count from
const DAY_MS = 86400000;

const SIN_N = Math.sin(NORTH);
const COS_N = Math.cos(NORTH);

// A direction given as (east, north, up) → the world's own axes.
export function compass(east, north, up, out = new THREE.Vector3()) {
  return out.set(-SIN_N * east + COS_N * north, up, COS_N * east + SIN_N * north).normalize();
}

// The hour by the sun, 0..24, from the hour by the clock: summer time puts the
// clocks forward, and the sun does not follow. (Where the player stands inside
// his time zone is not known, so this can still run some minutes out.)
export function solarHour(date) {
  const year = date.getFullYear();
  const winter = Math.max(new Date(year, 0, 1).getTimezoneOffset(), new Date(year, 6, 1).getTimezoneOffset());
  const putForward = winter - date.getTimezoneOffset(); // minutes of summer time
  return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600 - putForward / 60;
}

function dayOfYear(date) {
  return (date - new Date(date.getFullYear(), 0, 1)) / DAY_MS;
}

// Where a body stands for a watcher at `lat`, given how far north of the
// sky's equator it rides (decl) and how long since it crossed the south
// (hourAngle) — all in degrees. Fills `out` with the world direction to it
// and returns its height above the horizon, in degrees.
function place(lat, decl, hourAngle, out) {
  const sinL = Math.sin(lat * RAD);
  const cosL = Math.cos(lat * RAD);
  const sinD = Math.sin(decl * RAD);
  const cosD = Math.cos(decl * RAD);
  const sinH = Math.sin(hourAngle * RAD);
  const cosH = Math.cos(hourAngle * RAD);
  const up = sinL * sinD + cosL * cosD * cosH;
  compass(-cosD * sinH, cosL * sinD - sinL * cosD * cosH, up, out);
  return Math.asin(Math.max(-1, Math.min(1, up))) / RAD;
}

// The sky at a moment, for a watcher `latitude` degrees north.
//   hour      the hour by the sun, 0..24
//   sun/moon  unit vectors toward each, in world axes
//   sunAlt/moonAlt  their heights in degrees (negative: under the horizon)
//   phase     the moon's age, 0 new → 0.5 full → 1 new again
//   moonLit   how much of her face is bright, 0..1
//   turn      how far the stars have wheeled about the pole, radians
export function skyAt(date, latitude) {
  const hour = solarHour(date);
  const day = dayOfYear(date);

  // the sun: high in summer, low in winter, due south at noon
  const sunDecl = -TILT * Math.cos(((day + 10) / 365) * Math.PI * 2);
  const sunAngle = (hour - 12) * 15;
  const sun = new THREE.Vector3();
  const sunAlt = place(latitude, sunDecl, sunAngle, sun);

  // the moon trails the sun by her age: new, she keeps his company; full, she
  // stands opposite him — up all night, and high in winter when he is low
  const age = ((((date - A_NEW_MOON) / DAY_MS) % MOON_MONTH) + MOON_MONTH) % MOON_MONTH;
  const phase = age / MOON_MONTH;
  const moon = new THREE.Vector3();
  const moonAlt = place(latitude, sunDecl * Math.cos(phase * Math.PI * 2), sunAngle - phase * 360, moon);

  return {
    hour,
    sun,
    sunAlt,
    moon,
    moonAlt,
    phase,
    moonLit: (1 - Math.cos(phase * Math.PI * 2)) / 2,
    turn: ((hour / 24 + day / 365) % 1) * Math.PI * 2,
  };
}

// The point the stars wheel about, for a watcher at `latitude`: due north, as
// high as he is far from the equator.
export function skyPole(latitude) {
  return compass(0, Math.cos(latitude * RAD), Math.sin(latitude * RAD));
}
