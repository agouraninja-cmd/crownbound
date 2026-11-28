// The chapwoman's day, worked out from the clock alone. Pure: no THREE, no
// DOM, so the smoke suite can ask it about any hour.
//
// She comes up the east road (the +z end of the village path, from Hollin
// Cross) with her mule a little before CONFIG.shop.opens, timed to be set up
// on the hour; keeps her stall by the path till CONFIG.shop.closes; then packs
// up and leads the mule on down the west road (the -z end), out of the village
// the other way. Her two roads are curves through hand-set points, measured
// once so a distance along them is a place on the map.
import { CONFIG } from '../state/config.js';
import { LAYOUT, pathX } from './layout.js';

// how long she takes, standing at the stall, to step from the mule's head to
// her place beside the wares (and, at closing, back again)
export const SETTLE = 4;

// the cart stands with its mule facing along (cos rotY, -sin rotY)
const PARK = LAYOUT.cart;
const AHEAD = { x: Math.cos(PARK.rotY), z: -Math.sin(PARK.rotY) };
const parkAt = (s) => [PARK.x + AHEAD.x * s, PARK.z + AHEAD.z * s]; // s along her heading from the stall

// The road in: down the middle of the path from beyond the world's edge, then
// a gentle pull to the right onto her pitch, square to it for the last steps.
const IN = [];
for (let z = 88; z >= 16; z -= 4) IN.push([pathX(z), z]);
IN.push(parkAt(-4), parkAt(-2.4), parkAt(-1.2), parkAt(0));

// The road on: off the pitch, past the Charter post on its far side (it
// stands a stride east of the path's middle), back across past the Tome (a
// stride west of it), and away down the middle to the world's edge.
const OUT = [parkAt(0), parkAt(0.8), parkAt(1.6)]; // straight off the pitch first, as she stood
for (const [z, off] of [[4, 0.3], [1.5, -0.9], [-1, -0.95], [-3.5, -0.2], [-6, 0.6], [-9, 0.5], [-13, 0.2]]) {
  OUT.push([pathX(z) + off, z]);
}
for (let z = -17; z >= -89; z -= 4) OUT.push([pathX(z), z]);

// A Catmull-Rom curve through the points, sampled finely and measured, so
// at(d) gives the place d units along it and the way the cart faces there.
function road(points) {
  const P = [points[0], ...points, points[points.length - 1]]; // the ends repeated as their own guides
  const pts = [];
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    for (let k = 0; k < 12; k++) {
      const t = k / 12;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      pts.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  pts.push(points[points.length - 1]);
  const dist = [0];
  for (let i = 1; i < pts.length; i++) dist.push(dist[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const length = dist[dist.length - 1];

  // the sample index whose stretch holds distance d (binary search)
  function seg(d) {
    let lo = 0;
    let hi = pts.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (dist[mid] <= d) lo = mid;
      else hi = mid;
    }
    return lo;
  }
  function point(d) {
    d = Math.min(Math.max(d, 0), length);
    const i = Math.min(seg(d), pts.length - 2);
    const k = (d - dist[i]) / Math.max(dist[i + 1] - dist[i], 1e-9);
    return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
  }
  return {
    length,
    // { x, z, rotY } — rotY turns the cart's own +x (the mule's way) along the road
    at(d) {
      const [x, z] = point(d);
      const [ax, az] = point(d - 0.6);
      const [bx, bz] = point(d + 0.6);
      return { x, z, rotY: Math.atan2(-(bz - az), bx - ax) };
    },
  };
}

export const ROAD_IN = road(IN);
export const ROAD_OUT = road(OUT);

// her timetable, in seconds after midnight
export function timetable(shop = CONFIG.shop) {
  const opens = shop.opens * 3600;
  const closes = shop.closes * 3600;
  const comeIn = ROAD_IN.length / shop.pace;
  const goOut = ROAD_OUT.length / shop.pace;
  return {
    sets: opens - SETTLE - comeIn, // she comes over the world's edge, up the east road
    pitched: opens - SETTLE, // the cart stands on its pitch; she steps to her place
    opens,
    closes, // she packs up and steps to the mule's head
    leaves: closes + SETTLE, // and leads it on
    gone: closes + SETTLE + goOut, // over the edge, down the west road
  };
}

// Her day in order. A phase's index rises through the day; `t` is the
// seconds already spent in it.
export const PHASES = ['before', 'coming', 'settling', 'stall', 'packing', 'going', 'after'];

// where she should be at `seconds` after midnight: { phase, idx, t, ends }
// (`ends` is when that phase is due to end, in the same seconds)
export function cartDay(seconds, shop = CONFIG.shop) {
  const T = timetable(shop);
  const marks = [T.sets, T.pitched, T.opens, T.closes, T.leaves, T.gone];
  let idx = 0;
  while (idx < marks.length && seconds >= marks[idx]) idx++;
  const began = idx === 0 ? 0 : marks[idx - 1];
  return { phase: PHASES[idx], idx, t: seconds - began, ends: idx < marks.length ? marks[idx] : 86400 };
}

// seconds after local midnight of a Date
export function secondsOfDay(date) {
  return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds() + date.getMilliseconds() / 1000;
}

// "8 AM", "5 PM", "8:30 AM" — for the toasts, the Charter and the map
export function hourWords(h) {
  const whole = Math.floor(h);
  const mins = Math.round((h - whole) * 60);
  const h12 = ((whole + 11) % 12) + 1;
  return `${h12}${mins ? `:${String(mins).padStart(2, '0')}` : ''} ${whole < 12 ? 'AM' : 'PM'}`;
}
