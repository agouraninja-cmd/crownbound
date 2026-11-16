// The walk home: a way across the village from wherever he stands to a spot
// he names, around trees, rocks, walls and fences. A coarse grid over the
// walkable world has every collider drawn onto it (grown by the body's
// width), A* finds a chain of cells across it, and the chain is then pulled
// taut so he walks straight lines, not a staircase of grid steps.
// Static colliders only — a villager who wanders into the way is simply
// pushed around by the ordinary collision step (main.js watches for a stall).

const CELL = 0.5; // grid step, world units
const HALF = 80; // the grid spans ±HALF; the player is held to radius 78
const N = (HALF * 2) / CELL;
const RIM = 77; // keep the route a step inside the world's edge
const CLEARANCE = 0.45; // the body's radius (0.35) and a hand's breadth

const toCell = (v) => Math.min(N - 1, Math.max(0, Math.floor((v + HALF) / CELL)));
const centre = (i) => (i + 0.5) * CELL - HALF;

function blockedGrid(colliders) {
  const blocked = new Uint8Array(N * N);
  for (let gz = 0; gz < N; gz++) {
    for (let gx = 0; gx < N; gx++) {
      if (Math.hypot(centre(gx), centre(gz)) > RIM) blocked[gz * N + gx] = 1;
    }
  }
  for (const c of colliders) {
    if (c.r !== undefined) {
      const R = c.r + CLEARANCE;
      for (let gz = toCell(c.z - R); gz <= toCell(c.z + R); gz++) {
        for (let gx = toCell(c.x - R); gx <= toCell(c.x + R); gx++) {
          if (Math.hypot(centre(gx) - c.x, centre(gz) - c.z) < R) blocked[gz * N + gx] = 1;
        }
      }
    } else {
      const x0 = c.minX - CLEARANCE;
      const x1 = c.maxX + CLEARANCE;
      const z0 = c.minZ - CLEARANCE;
      const z1 = c.maxZ + CLEARANCE;
      for (let gz = toCell(z0); gz <= toCell(z1); gz++) {
        for (let gx = toCell(x0); gx <= toCell(x1); gx++) {
          const cx = centre(gx);
          const cz = centre(gz);
          if (cx > x0 && cx < x1 && cz > z0 && cz < z1) blocked[gz * N + gx] = 1;
        }
      }
    }
  }
  return blocked;
}

// the nearest open cell to (x, z) — he may be standing hard against a tree
function nearestOpen(blocked, x, z) {
  const cx = toCell(x);
  const cz = toCell(z);
  for (let ring = 0; ring <= 8; ring++) {
    let best = -1;
    let bestD = Infinity;
    for (let gz = cz - ring; gz <= cz + ring; gz++) {
      for (let gx = cx - ring; gx <= cx + ring; gx++) {
        if (gx < 0 || gz < 0 || gx >= N || gz >= N) continue;
        if (Math.max(Math.abs(gx - cx), Math.abs(gz - cz)) !== ring) continue;
        if (blocked[gz * N + gx]) continue;
        const d = Math.hypot(centre(gx) - x, centre(gz) - z);
        if (d < bestD) {
          bestD = d;
          best = gz * N + gx;
        }
      }
    }
    if (best >= 0) return best;
  }
  return -1;
}

// a small binary heap of cell indices, ordered by f
function makeHeap(f) {
  const items = [];
  return {
    get size() {
      return items.length;
    },
    push(i) {
      items.push(i);
      let k = items.length - 1;
      while (k > 0) {
        const up = (k - 1) >> 1;
        if (f[items[up]] <= f[items[k]]) break;
        [items[up], items[k]] = [items[k], items[up]];
        k = up;
      }
    },
    pop() {
      const top = items[0];
      const last = items.pop();
      if (items.length) {
        items[0] = last;
        let k = 0;
        for (;;) {
          const l = k * 2 + 1;
          const r = l + 1;
          let m = k;
          if (l < items.length && f[items[l]] < f[items[m]]) m = l;
          if (r < items.length && f[items[r]] < f[items[m]]) m = r;
          if (m === k) break;
          [items[m], items[k]] = [items[k], items[m]];
          k = m;
        }
      }
      return top;
    },
  };
}

// a straight walk from a to b crosses no blocked cell
function clearLine(blocked, ax, az, bx, bz) {
  const steps = Math.ceil(Math.hypot(bx - ax, bz - az) / (CELL * 0.4));
  for (let s = 1; s < steps; s++) {
    const t = s / steps;
    if (blocked[toCell(az + (bz - az) * t) * N + toCell(ax + (bx - ax) * t)]) return false;
  }
  return true;
}

const SQRT2 = Math.SQRT2;
const NEIGHBOURS = [
  [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1],
  [1, 1, SQRT2], [1, -1, SQRT2], [-1, 1, SQRT2], [-1, -1, SQRT2],
];

// A route from `from` to `to` ({x, z} each) as a list of {x, z} points to walk
// through in turn, ending exactly at `to`; null if there is no way.
export function planPath(colliders, from, to) {
  const blocked = blockedGrid(colliders);
  const start = nearestOpen(blocked, from.x, from.z);
  const goal = nearestOpen(blocked, to.x, to.z);
  if (start < 0 || goal < 0) return null;

  const gx1 = goal % N;
  const gz1 = (goal / N) | 0;
  const g = new Float32Array(N * N).fill(Infinity);
  const f = new Float32Array(N * N).fill(Infinity);
  const parent = new Int32Array(N * N).fill(-1);
  const closed = new Uint8Array(N * N);
  const octile = (i) => {
    const dx = Math.abs((i % N) - gx1);
    const dz = Math.abs(((i / N) | 0) - gz1);
    return Math.max(dx, dz) + (SQRT2 - 1) * Math.min(dx, dz);
  };
  const open = makeHeap(f);
  g[start] = 0;
  f[start] = octile(start);
  open.push(start);

  while (open.size) {
    const cur = open.pop();
    if (cur === goal) break;
    if (closed[cur]) continue;
    closed[cur] = 1;
    const cx = cur % N;
    const cz = (cur / N) | 0;
    for (const [dx, dz, cost] of NEIGHBOURS) {
      const nx = cx + dx;
      const nz = cz + dz;
      if (nx < 0 || nz < 0 || nx >= N || nz >= N) continue;
      const ni = nz * N + nx;
      if (blocked[ni] || closed[ni]) continue;
      // no squeezing diagonally between two blocked cells
      if (dx && dz && (blocked[cz * N + nx] || blocked[nz * N + cx])) continue;
      const ng = g[cur] + cost;
      if (ng < g[ni]) {
        g[ni] = ng;
        f[ni] = ng + octile(ni);
        parent[ni] = cur;
        open.push(ni);
      }
    }
  }
  if (parent[goal] < 0 && goal !== start) return null;

  // the chain of cells, start to goal, as world points
  const cells = [];
  for (let i = goal; i >= 0; i = parent[i]) cells.push({ x: centre(i % N), z: centre((i / N) | 0) });
  cells.reverse();
  cells[cells.length - 1] = { x: to.x, z: to.z };

  // pull the string taut: from each point, jump to the farthest one in plain sight
  const route = [];
  let ax = from.x;
  let az = from.z;
  let i = 0;
  while (i < cells.length - 1) {
    let j = cells.length - 1;
    while (j > i + 1 && !clearLine(blocked, ax, az, cells[j].x, cells[j].z)) j--;
    route.push(cells[j]);
    ax = cells[j].x;
    az = cells[j].z;
    i = j;
  }
  if (!route.length) route.push({ x: to.x, z: to.z });
  return route;
}
