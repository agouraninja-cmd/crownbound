// The Map of the Kingdom (M). Two sheets side by side:
//  - the realm, drawn once as a cartographer would — coast, fells, woods, the
//    mere, rivers, roads, towns — with the home village ringed in wax;
//  - a plan of the village itself, drawn from the game's own layout every time
//    the map is opened, so it can never disagree with the ground: the path,
//    every building, the real trees, the miller's strip as it stands today,
//    the bounds of the walkable world, and the player as a red arrow.
// The realm is a picture only — the walkable world is the village, as ever.
// Names live in CONFIG.realm; everything else here is fixed art.
import { CONFIG } from '../state/config.js';
import { LAYOUT, NORTH, pathX, fieldToWorld, FIELD } from '../scene/layout.js';
import { makeRng } from '../scene/meshUtils.js';

const INK = '#2b2014';
const FADED = '#5a4a33';
const WAX = '#8a2418';
const PAPER = '#ead9b0';
const WOOD = '#6f7a3e';
const WATER = '#3f6470';

const f1 = (n) => Math.round(n * 10) / 10; // keep the markup short

// ---------- drawing helpers ----------

// Catmull-Rom through the points, as cubic Béziers: a hand's smooth line
function smooth(pts, closed = false) {
  const n = pts.length;
  const p = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)},${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)},${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])},${f1(p2[1])}`;
  }
  return closed ? d + 'Z' : d;
}

// midpoint displacement: a ruler line made to wander like a real shore
function wander(pts, rng, amp = 1, depth = 2) {
  let out = pts;
  for (let k = 0; k < depth; k++) {
    const next = [];
    for (let i = 0; i < out.length - 1; i++) {
      const [a, b] = [out[i], out[i + 1]];
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const off = (rng() - 0.5) * 0.45 * amp;
      next.push(a, [(a[0] + b[0]) / 2 - dy * off, (a[1] + b[1]) / 2 + dx * off]);
    }
    next.push(out[out.length - 1]);
    out = next;
  }
  return out;
}

// a closed, lumpy ellipse
function blobPts(cx, cy, rx, ry, rng, n = 14, jag = 0.18) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 - jag + rng() * jag * 2;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return pts;
}

const inEllipse = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1;

function tree(x, y, s, pointed) {
  if (pointed) {
    return `<path d="M${f1(x)},${f1(y)}v${f1(-s * 0.5)}M${f1(x - s * 0.9)},${f1(y - s * 0.5)}L${f1(x)},${f1(y - s * 2.6)}L${f1(x + s * 0.9)},${f1(y - s * 0.5)}Z" class="m-tree"/>`;
  }
  return `<path d="M${f1(x)},${f1(y)}v${f1(-s * 0.9)}"class="m-trunk"/><circle cx="${f1(x)}" cy="${f1(y - s * 1.75)}" r="${f1(s * 1.05)}" class="m-tree"/>`;
}

function mountain(x, y, w, h) {
  const peak = x - w * 0.12;
  let shade = '';
  for (let i = 1; i <= 3; i++) {
    const t = i / 4;
    shade += `M${f1(peak + (x + w - peak) * t * 0.9)},${f1(y - h + h * t * 0.9)}l${f1(-w * 0.12)},${f1(h * (0.5 - t * 0.35))}`;
  }
  return `<path d="M${f1(x - w)},${f1(y)}L${f1(peak)},${f1(y - h)}L${f1(x + w)},${f1(y)}" class="m-peak"/><path d="${shade}" class="m-hatch"/>`;
}

const hill = (x, y, w) =>
  `<path d="M${f1(x - w)},${f1(y)}Q${f1(x)},${f1(y - w * 1.15)} ${f1(x + w)},${f1(y)}" class="m-hill"/>`;

const tuft = (x, y) =>
  `<path d="M${f1(x - 3)},${f1(y)}l1.4,-4.5M${f1(x)},${f1(y)}v-6M${f1(x + 3)},${f1(y)}l-1.4,-4.5" class="m-hatch"/>`;

function house(x, y, s) {
  return `<path d="M${f1(x - s / 2)},${f1(y)}v${f1(-s * 0.6)}l${f1(s / 2)},${f1(-s * 0.5)}l${f1(s / 2)},${f1(s * 0.5)}v${f1(s * 0.6)}Z" class="m-bldg"/>`;
}

function church(x, y, s) {
  // nave, then a tower with its spire (and a cross, for an abbey)
  return (
    `<path d="M${f1(x - s)},${f1(y)}v${f1(-s * 0.7)}h${f1(s * 1.2)}v${f1(s * 0.7)}Z" class="m-bldg"/>` +
    `<path d="M${f1(x + s * 0.2)},${f1(y)}v${f1(-s * 1.3)}h${f1(s * 0.6)}v${f1(s * 1.3)}Z" class="m-bldg"/>` +
    `<path d="M${f1(x + s * 0.15)},${f1(y - s * 1.3)}l${f1(s * 0.35)},${f1(-s * 0.9)}l${f1(s * 0.35)},${f1(s * 0.9)}Z" class="m-bldg"/>`
  );
}

const GLYPHS = {
  village: (x, y) => house(x - 4, y, 7) + house(x + 4, y + 1.5, 6),
  town: (x, y) => house(x - 9, y + 1, 7) + church(x, y, 6) + house(x + 10, y + 1.5, 7),
  abbey: (x, y) =>
    church(x, y, 8) +
    `<path d="M${f1(x + 4.8)},${f1(y - 22)}v-6M${f1(x + 2.6)},${f1(y - 25.5)}h4.4" class="m-line"/>`,
  city: (x, y) => {
    // a walled city: curtain wall, four towers, the keep with the royal pennant
    let s = `<path d="M${x - 20},${y}v-10h40v10Z" class="m-bldg"/>`;
    for (const tx of [-20, -7, 7, 20]) {
      s += `<path d="M${x + tx - 3.5},${y}v-15h2v2h1.5v-2h2v2h1.5v-2h2v15Z" class="m-bldg"/>`;
    }
    s += `<path d="M${x - 6},${y - 10}v-14h3v3h2v-3h2v3h2v-3h3v14Z" class="m-bldg"/>`;
    s += `<path d="M${x},${y - 24}v-10" class="m-line"/><path d="M${x},${y - 34}l9,2.5l-9,2.5Z" fill="${WAX}"/>`;
    return s;
  },
};
GLYPHS.port = GLYPHS.town;

// ---------- the realm ----------

// Places on the realm sheet, in its 1000 × 700 frame. `home` marks the village
// the game is played in. Notes are what hovering a place reads aloud.
function realmPlaces() {
  const R = CONFIG.realm;
  return [
    { id: 'home', name: R.village, kind: 'village', x: 330, y: 442, lx: 0, ly: 22, home: true,
      note: `${R.village} — thy village, a clearing in the Brackenwood: a hovel, a granary, the miller’s strip. Thy feet are bound here, for now.` },
    { id: 'kingsholt', name: 'Kingsholt', kind: 'city', x: 662, y: 292, lx: 0, ly: 20, big: true,
      note: 'Kingsholt — the royal seat, walled and towered. Somewhere within it a crown waits for one who earns it.' },
    { id: 'hollin', name: 'Hollin Cross', kind: 'town', x: 470, y: 402, lx: 0, ly: 19,
      note: 'Hollin Cross — the market town nearest home, where the chapman fills his cart.' },
    { id: 'saltmouth', name: 'Saltmouth', kind: 'port', x: 818, y: 455, lx: -6, ly: 19,
      note: 'Saltmouth — a port at the mouth of the Wend: salt fish, wool bales, ships bound for far shores.' },
    { id: 'edricminster', name: 'Edricminster', kind: 'town', x: 582, y: 598, lx: 0, ly: 19,
      note: 'Edricminster — a cathedral town, its great church a hundred years in the building and not done yet.' },
    { id: 'wendham', name: 'Wendham', kind: 'village', x: 748, y: 398, lx: -2, ly: 18,
      note: 'Wendham — a village on the Wend, where a watermill grinds the valley’s grain.' },
    { id: 'coldbrook', name: 'Coldbrook', kind: 'village', x: 410, y: 545, lx: 0, ly: 18,
      note: 'Coldbrook — a hamlet of shepherds, where the Brack runs cold off the moor.' },
    { id: 'whitwold', name: 'Whitwold Abbey', kind: 'abbey', x: 228, y: 330, lx: 0, ly: 18,
      note: 'Whitwold Abbey — white monks keep sheep on the wold and copy books by hand.' },
    { id: 'fellgate', name: 'Fellgate', kind: 'village', x: 420, y: 172, lx: 0, ly: 18,
      note: 'Fellgate — the last village before the fells: miners, charcoal-burners, hard folk.' },
  ];
}

const REGION_NOTES = {
  fells: 'The Grimfells — bare fells where wolves are said to run in the hard winters.',
  mere: '{L} — the great lake at the heart of {K}, fed by the Wend off the fells.',
  brackenwood: 'The Brackenwood — oak, pine and birch over a sea of bracken. The village lies in its clearing.',
  moor: 'Blackmoor — heather and bog. Travellers keep to the road.',
  chase: 'The King’s Chase — the royal hunting forest. Its deer are the King’s, and poachers pay dearly.',
  marches: 'The Marches — the kingdom’s ragged western edge. Beyond lie lands uncharted.',
  sea: 'The Whale’s Road — the grey sea, as the old songs name it.',
  wilds: 'The Northern Wilds — no road goes there that anyone cares to take.',
  holm: 'Gull Holm — a rock of birds and nothing else.',
};

// the east coast, north to south; the sea lies east of it and fills the south-east corner
const COAST = [
  [818, -5], [800, 50], [826, 105], [808, 160], [842, 205], [872, 250], [858, 300], [884, 350],
  [874, 405], [846, 452], [866, 500], [842, 548], [800, 585], [752, 612], [706, 646], [676, 705],
];

function coastX(y) {
  for (let i = 0; i < COAST.length - 1; i++) {
    const [a, b] = [COAST[i], COAST[i + 1]];
    if (y >= a[1] && y <= b[1]) return a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]);
  }
  return COAST[COAST.length - 1][0];
}

// forests: [cx, cy, rx, ry, region id or null]
const WOODS = [
  [322, 432, 118, 70, 'brackenwood'],
  [742, 228, 62, 44, 'chase'],
  [488, 300, 34, 22, null],
  [622, 478, 40, 26, null],
  [258, 214, 34, 26, null],
  [520, 520, 28, 18, null],
];
const MERE = [540, 215, 58, 27];

const ROADS = [
  [[330, 442], [400, 428], [470, 402]],
  [[470, 402], [560, 352], [662, 292]],
  [[662, 292], [712, 352], [748, 398], [818, 455]],
  [[470, 402], [528, 500], [582, 598]],
  [[330, 442], [372, 500], [410, 545], [500, 585], [582, 598]],
  [[582, 598], [700, 555], [818, 455]],
  [[662, 292], [640, 210], [600, 172], [500, 168], [420, 172]],
  [[330, 442], [262, 456], [160, 470], [66, 484]],
  [[262, 456], [240, 400], [228, 330]],
  [[228, 330], [300, 252], [360, 200], [420, 172]],
];

const RIVERS = [
  // the Wend: off the fells, through the lake, past Kingsholt to the sea
  { pts: [[500, 108], [512, 150], [530, 190]], w: 1.6 },
  { pts: [[594, 222], [636, 258], [672, 300], [705, 345], [740, 388], [790, 430], [846, 452]], w: 2.4 },
  // the Brack: out of the Brackenwood, past Coldbrook and Edricminster to the south shore
  { pts: [[300, 400], [352, 470], [400, 532], [470, 575], [560, 612], [640, 632], [700, 650]], w: 1.8 },
];

let realmCache = null;

function drawRealm() {
  const R = CONFIG.realm;
  const rng = makeRng(1250);
  const out = [];

  // the sea: everything east of the coast
  const shore = wander(COAST, rng, 0.55, 3);
  const seaPts = [...shore, [1005, 705], [1005, -5]];
  const shoreD = smooth(shore);
  out.push(`<defs>
    <clipPath id="m-sea-clip"><path d="${smooth(seaPts, true)}"/></clipPath>
    <pattern id="m-unknown" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <path d="M0,0v8" stroke="${FADED}" stroke-width="0.7" opacity="0.5"/></pattern>
    <path id="m-fells-arc" d="M300,151 Q480,143 660,149"/>
    <path id="m-sea-arc" d="M770,628 Q870,600 985,604"/>
  </defs>`);
  out.push(`<rect width="1000" height="700" fill="#fff8dc" opacity="0.22"/>`); // the sheet, a shade paler than the panel
  out.push(`<path d="${smooth(seaPts, true)}" fill="${WATER}" opacity="0.13" data-place="sea"/>`);
  // engraved shore lines, fading out to sea
  out.push(`<g clip-path="url(#m-sea-clip)" fill="none" stroke="${WATER}">`);
  [5, 10, 16, 24].forEach((k, i) =>
    out.push(`<path d="${shoreD}" transform="translate(${k * 0.8},${k * 0.6})" stroke-width="0.8" opacity="${0.55 - i * 0.12}"/>`)
  );
  out.push('</g>');
  out.push(`<path d="${shoreD}" fill="none" stroke="${INK}" stroke-width="1.6"/>`);
  // ripples
  let rp = '';
  for (let i = 0; i < 40; i++) {
    const y = 20 + rng() * 670;
    const x = coastX(y) + 34 + rng() * (1000 - coastX(y) - 40);
    if (x > 990 || (x > 880 && y < 170) || (x > 898 && y > 520 && y < 575)) continue; // not over the compass or the holm
    rp += `M${f1(x)},${f1(y)}q3,-3 6,0t6,0`;
  }
  out.push(`<path d="${rp}" fill="none" stroke="${WATER}" stroke-width="0.9" opacity="0.55"/>`);
  // Gull Holm
  const holm = smooth(blobPts(952, 545, 15, 9, rng, 9, 0.3), true);
  out.push(`<path d="${holm}" fill="${PAPER}" stroke="${INK}" stroke-width="1.2" data-place="holm"/>`);

  // the Marches: a ragged frontier to the west, lands uncharted beyond it
  const march = wander([[74, 112], [62, 260], [80, 420], [64, 560], [76, 705]], rng, 0.8, 3);
  out.push(`<path d="${smooth([...march, [-5, 705], [-5, 112]], true)}" fill="url(#m-unknown)" data-place="marches"/>`);
  out.push(`<path d="${smooth(march)}" fill="none" stroke="${FADED}" stroke-width="1.4" stroke-dasharray="7 4 2 4"/>`);

  // the great lake, with its own engraved rings
  const mereD = smooth(blobPts(...MERE, rng, 16, 0.14), true);
  out.push(`<path d="${mereD}" fill="${WATER}" fill-opacity="0.16" stroke="${INK}" stroke-width="1.3" data-place="mere"/>`);
  for (const k of [0.8, 0.6]) {
    out.push(`<path d="${mereD}" fill="none" stroke="${WATER}" stroke-width="0.7" opacity="0.5" transform="translate(${f1(MERE[0] * (1 - k))},${f1(MERE[1] * (1 - k))}) scale(${k})"/>`);
  }

  // rivers
  for (const r of RIVERS) {
    out.push(`<path d="${smooth(wander(r.pts, rng, 0.5, 2))}" fill="none" stroke="${WATER}" stroke-width="${r.w}" stroke-linecap="round"/>`);
  }

  // high ground and low, sorted north to south so nearer glyphs overlap farther ones
  const relief = [];
  for (let i = 0; i < 58; i++) {
    const t = rng();
    const x = 300 + t * 370 + (rng() - 0.5) * 20;
    const y = 112 - Math.sin(t * Math.PI) * 26 + (rng() - 0.5) * 50;
    const w = 9 + rng() * 9;
    relief.push({ y, s: mountain(x, y, w, w * (1.1 + rng() * 0.5)) });
  }
  // the wold round the abbey, and the low hills that ring the home vale
  for (let i = 0; i < 16; i++) relief.push(((x, y) => ({ y, s: hill(x, y, 8 + rng() * 5) }))(160 + rng() * 150, 270 + rng() * 90));
  for (let i = 0; i < 14; i++) {
    const a = rng() * Math.PI * 2;
    const x = 330 + Math.cos(a) * (138 + rng() * 26);
    const y = 442 + Math.sin(a) * (86 + rng() * 18);
    if (Math.abs(y - 442) < 30 && x > 400) continue; // the road east stays open
    relief.push({ y, s: hill(x, y, 6 + rng() * 4) });
  }
  relief.sort((a, b) => a.y - b.y);
  out.push(`<g>${relief.map((r) => r.s).join('')}</g>`);

  // Blackmoor: tufts of heather
  for (let i = 0; i < 46; i++) {
    const x = 120 + rng() * 210;
    const y = 545 + rng() * 120;
    if (inEllipse(x, y, 225, 605, 115, 62)) out.push(tuft(x, y));
  }

  // the woods: trees on a jittered grid, the home clearing kept open
  const trees = [];
  for (const [cx, cy, rx, ry] of WOODS) {
    for (let gy = cy - ry; gy < cy + ry; gy += 9) {
      for (let gx = cx - rx; gx < cx + rx; gx += 9.5) {
        const x = gx + (rng() - 0.5) * 6;
        const y = gy + (rng() - 0.5) * 6;
        const edge = 0.82 + rng() * 0.3;
        if (!inEllipse(x, y, cx, cy, rx * edge, ry * edge)) continue;
        if (inEllipse(x, y, 330, 452, 52, 31)) continue; // the clearing, room for the name
        trees.push({ x, y, s: 3 + rng() * 1.4, pointed: rng() < 0.38 });
      }
    }
  }
  trees.sort((a, b) => a.y - b.y);
  out.push(`<g>${trees.map((t) => tree(t.x, t.y, t.s, t.pointed)).join('')}</g>`);

  // roads, over a pale verge so they read through the woods
  const roadD = ROADS.map((r) => smooth(wander(r, rng, 0.35, 2))).join('');
  out.push(`<path d="${roadD}" fill="none" stroke="${PAPER}" stroke-width="4.5" opacity="0.85"/>`);
  out.push(`<path d="${roadD}" fill="none" stroke="#7a4f2a" stroke-width="1.5" stroke-dasharray="5 3.5"/>`);

  // settlements
  for (const p of realmPlaces()) {
    let g = `<g class="m-place" data-place="${p.id}">`;
    g += `<circle cx="${p.x}" cy="${p.y - 6}" r="22" fill="transparent"/>`; // a generous hover target
    if (p.home) {
      g += `<circle cx="${p.x}" cy="${p.y - 4}" r="17" fill="none" stroke="${WAX}" stroke-width="2.2" class="m-home-ring"/>`;
      g += `<circle cx="${p.x}" cy="${p.y - 4}" r="21.5" fill="none" stroke="${WAX}" stroke-width="0.8"/>`;
    }
    g += GLYPHS[p.kind](p.x, p.y);
    g += `<text x="${p.x + p.lx}" y="${p.y + p.ly}" class="m-name${p.big ? ' m-big' : ''}${p.home ? ' m-home' : ''}">${p.name}</text>`;
    if (p.home) g += `<text x="${p.x}" y="${p.y + p.ly + 15}" class="m-here">thou art here</text>`;
    out.push(g + '</g>');
  }

  // region names
  const region = (id, x, y, text, cls = 'm-region', extra = '') =>
    `<text x="${x}" y="${y}" class="${cls}" data-place="${id}" ${extra}>${text}</text>`;
  out.push(`<text class="m-region m-fells" data-place="fells"><textPath href="#m-fells-arc" startOffset="50%">The Grimfells</textPath></text>`);
  out.push(region('mere', 540, 219, CONFIG.realm.lake, 'm-region m-water'));
  out.push(region('brackenwood', 292, 520, 'the Brackenwood'));
  out.push(region('moor', 226, 610, 'Blackmoor'));
  out.push(region('chase', 744, 176, 'the King’s Chase'));
  out.push(region('marches', 38, 420, 'The Marches', 'm-region', 'transform="rotate(-90 38 420)"'));
  out.push(region('wilds', 480, 34, 'The Northern Wilds', 'm-region m-faint'));
  out.push(`<text class="m-region m-water m-sea" data-place="sea"><textPath href="#m-sea-arc" startOffset="50%">The Whale’s Road</textPath></text>`);
  out.push(region('holm', 952, 572, 'Gull Holm', 'm-name m-small'));

  // a ship standing out from Saltmouth, and something that is not a ship
  out.push(`<g transform="translate(932 338)" class="m-sketch">
    <path d="M-15,0Q0,9 15,0L11,-4H-11Z" class="m-bldg"/><path d="M0,-4V-30" class="m-line"/>
    <path d="M-9,-27H9L8,-9H-8Z" class="m-bldg"/><path d="M0,-25v14M-6,-18h12" stroke="${WAX}" stroke-width="1.4"/></g>`);
  out.push(`<g transform="translate(880 668)" class="m-sketch">
    <path d="M-34,0q6,-12 12,0M-14,0q6,-14 12,0M6,0q6,-12 12,0" class="m-line" fill="none"/>
    <path d="M18,0q8,-16 18,-12q4,2 -2,5q-6,1 -8,7" class="m-line" fill="none"/>
    <path d="M-40,2q-6,-8 -12,-2" class="m-line" fill="none"/></g>`);

  // compass rose
  out.push(compassRose(934, 104, 44));

  // cartouche
  out.push(`<g class="m-cartouche">
    <rect x="18" y="16" width="262" height="86" rx="3" fill="${PAPER}" stroke="${INK}" stroke-width="1.6"/>
    <rect x="23" y="21" width="252" height="76" rx="2" fill="none" stroke="${INK}" stroke-width="0.7"/>
    <text x="149" y="46" class="m-cart-small">The Kingdom of</text>
    <text x="149" y="83" class="m-cart-big">${R.kingdom}</text></g>`);

  // a scale of leagues
  let bar = `<g transform="translate(424 662)"><rect x="-8" y="-16" width="138" height="34" fill="${PAPER}" opacity="0.8"/>`;
  for (let i = 0; i < 5; i++) bar += `<rect x="${i * 24}" y="0" width="24" height="5" fill="${i % 2 ? PAPER : INK}" stroke="${INK}" stroke-width="0.8"/>`;
  bar += `<text x="60" y="-4" class="m-name m-small">a scale of leagues</text><text x="0" y="16" class="m-name m-small">0</text><text x="120" y="16" class="m-name m-small">10</text></g>`;
  out.push(bar);

  // the sheet's border
  out.push(`<rect x="3" y="3" width="994" height="694" fill="none" stroke="${INK}" stroke-width="2"/>
    <rect x="8" y="8" width="984" height="684" fill="none" stroke="${INK}" stroke-width="0.7"/>`);

  return `<svg viewBox="0 0 1000 700" class="m-realm" role="img" aria-label="Map of the Kingdom of ${R.kingdom}">${out.join('')}</svg>`;
}

function compassRose(cx, cy, r) {
  let s = `<g transform="translate(${cx} ${cy})" class="m-compass">`;
  s += `<circle r="${r * 0.72}" fill="none" stroke="${INK}" stroke-width="0.8"/><circle r="${r * 0.62}" fill="none" stroke="${INK}" stroke-width="0.5"/>`;
  for (let i = 0; i < 8; i++) {
    const long = i % 2 === 0;
    const len = long ? r : r * 0.55;
    const w = long ? r * 0.16 : r * 0.12;
    const a = (i * Math.PI) / 4;
    const tip = [Math.sin(a) * len, -Math.cos(a) * len];
    const L = [Math.sin(a - Math.PI / 2) * w, -Math.cos(a - Math.PI / 2) * w];
    const Rr = [-L[0], -L[1]];
    s += `<path d="M0,0L${f1(L[0])},${f1(L[1])}L${f1(tip[0])},${f1(tip[1])}Z" fill="${INK}"/>`;
    s += `<path d="M0,0L${f1(Rr[0])},${f1(Rr[1])}L${f1(tip[0])},${f1(tip[1])}Z" fill="${PAPER}" stroke="${INK}" stroke-width="0.7"/>`;
  }
  s += `<text y="${-r - 6}" class="m-compass-n">N</text></g>`;
  return s;
}

// ---------- the village plan ----------

// The plan is drawn north-up: the world is turned by NORTH (layout.js), which
// puts the miller's strip at a bearing of ~25°, north-east as the Charter says.
const SIN_N = Math.sin(NORTH);
const COS_N = Math.cos(NORTH);

const PLAN = 400; // the plan's frame, in its own units
const VIEWS = {
  green: { cx: 1, cz: 3, r: 16, title: 'The Green' }, // the village's heart
  bounds: { cx: 0, cz: 0, r: 100, title: 'The Bounds' }, // all the walkable land and the wood's edge
};
const WORLD_RADIUS = 78; // where the player is held (player.js)

let planView = null; // chosen per session; first open picks by where the player stands

function siteNotes() {
  return {
    hovel: 'Thy hovel — cot, hearth, chest, and the sleep ledger on the wall.',
    campfire: 'The campfire — it burns as long as thy streak does.',
    board: 'The Quest Board — where deeds are posted and claimed.',
    tome: 'The Tome — thy chronicle and thy virtues, the Scribe and the Sage.',
    charter: 'The Village Charter — the rules of the realm, posted by the path.',
    exchequer: 'The Exchequer — the clerk keeps the Treasury and hears the monthly Reckoning.',
    granary: 'The granary — the miller’s store, and the rats that plague it.',
    dummy: 'The training dummy — honest sweat for a trickle of Athleticism.',
    cart: 'The chapman’s spot — his cart stands here on market days.',
    field: `The miller’s strip — ${CONFIG.farm.rows} ridges of wheat, one job a day, paid in coin.`,
    bounds: 'The bounds of thy wandering. The wood beyond is thick, and the roads out are not yet open to thee.',
    you: 'Thou — and the way thou facest.',
    road: 'The road east, to Hollin Cross and on to Kingsholt.',
    roadWest: 'The road west, over Blackmoor toward the Marches.',
  };
}

// the colours a ridge wears on the plan, by its look in the field
const RIDGE = {
  stubble: '#b59a5c', furrow: '#6b4a2a', sown: '#5a3e22', weedy: '#7d8a3c',
  tended: '#6f8f3a', ripe: '#d1a63a', stook: '#c99a3a',
};

function drawPlan(view, info) {
  const V = VIEWS[view];
  const k = PLAN / 2 / V.r;
  // world (x, z) → plan, north up
  const P = (x, z) => {
    const dx = x - V.cx;
    const dz = z - V.cz;
    return [PLAN / 2 + k * (-SIN_N * dx + COS_N * dz), PLAN / 2 + k * (-COS_N * dx - SIN_N * dz)];
  };
  const pt = (x, z) => P(x, z).map(f1).join(',');
  const poly = (corners) => `M${corners.map(([x, z]) => pt(x, z)).join('L')}Z`;
  // a rectangle turned like a three.js group (rotation.y = rotY)
  const rect = (x, z, hx, hz, rotY = 0) => {
    const c = Math.cos(rotY);
    const s = Math.sin(rotY);
    return poly([[-hx, -hz], [hx, -hz], [hx, hz], [-hx, hz]].map(([u, v]) => [x + u * c + v * s, z - u * s + v * c]));
  };
  const L = LAYOUT;
  const close = view === 'green';
  const out = [];

  out.push(`<defs><clipPath id="m-plan-clip"><rect width="${PLAN}" height="${PLAN}"/></clipPath>
    <path id="m-bounds-arc" d="M${f1(PLAN / 2 - (WORLD_RADIUS + 4) * k)},${PLAN / 2}A${f1((WORLD_RADIUS + 4) * k)},${f1((WORLD_RADIUS + 4) * k)} 0 0,1 ${f1(PLAN / 2 + (WORLD_RADIUS + 4) * k)},${PLAN / 2}"/></defs>`);
  out.push(`<g clip-path="url(#m-plan-clip)">`);

  // the wood beyond the bounds
  if (!close) {
    const R = WORLD_RADIUS * k;
    out.push(`<path d="M0,0H${PLAN}V${PLAN}H0ZM${PLAN / 2 - R},${PLAN / 2}a${R},${R} 0 1,0 ${2 * R},0a${R},${R} 0 1,0 ${-2 * R},0Z" fill-rule="evenodd" fill="${WOOD}" opacity="0.16" data-place="bounds"/>`);
    const rng = makeRng(78);
    const wood = [];
    for (let i = 0; i < 260; i++) {
      const a = rng() * Math.PI * 2;
      const d = WORLD_RADIUS + 3 + rng() * 70;
      const x = Math.cos(a) * d;
      const z = Math.sin(a) * d;
      if (Math.abs(x - pathX(z)) < 7) continue; // the road's corridor
      const [px, py] = P(x, z);
      if (px < -8 || py < -8 || px > PLAN + 8 || py > PLAN + 8) continue;
      wood.push({ px, py, s: 2.2 + rng() * 1.2, pointed: rng() < 0.55 });
    }
    wood.sort((a, b) => a.py - b.py);
    out.push(`<g opacity="0.75">${wood.map((t) => tree(t.px, t.py, t.s, t.pointed)).join('')}</g>`);
  }

  // worn earth: the yards and the green round the fire
  for (const d of L.dirtPatches) {
    const [x, y] = P(d.x, d.z);
    out.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(d.r * k)}" fill="#8a6a3e" opacity="0.13"/>`);
  }

  // the road, and the cart track to the strip
  const road = [];
  for (let z = -130; z <= 130; z += 2) road.push(P(pathX(z), z));
  out.push(`<path d="${smooth(road)}" fill="none" stroke="#8a6a3e" stroke-width="${f1(Math.max(2.6 * k, 4))}" stroke-linecap="round" opacity="0.5" data-place="road"/>`);
  out.push(`<path d="${smooth(road)}" fill="none" stroke="#6b4a2a" stroke-width="0.8" stroke-dasharray="5 4" opacity="0.7"/>`);
  const gate = fieldToWorld(0, -(FIELD.halfWidth + FIELD.margin));
  out.push(`<path d="M${pt(gate.x, gate.z)}L${pt(L.fieldTrackEnd.x, L.fieldTrackEnd.z)}" stroke="#8a6a3e" stroke-width="${f1(Math.max(1.6 * k, 2.5))}" opacity="0.4" stroke-linecap="round"/>`);

  // the miller's strip, each ridge in the colour of what stands on it today
  const fu = FIELD.halfLength;
  const fv = FIELD.halfWidth;
  const fm = fu + FIELD.margin;
  const fw = fv + FIELD.margin;
  const F = (u, v) => fieldToWorld(u, v);
  let field = `<g class="m-site" data-place="field">`;
  field += `<path d="${poly([F(-fu, -fv), F(fu, -fv), F(fu, fv), F(-fu, fv)].map((p) => [p.x, p.z]))}" fill="#7a5a34" opacity="0.35"/>`;
  (info.looks ?? []).forEach((look, row) => {
    const v = FIELD.rowV(row);
    const a = F(-fu, v);
    const b = F(fu, v);
    field += `<path d="M${pt(a.x, a.z)}L${pt(b.x, b.z)}" stroke="${RIDGE[look] ?? RIDGE.stubble}" stroke-width="${f1(Math.max(0.55 * k, 1.4))}" stroke-linecap="butt"/>`;
  });
  // the fence, open at the gate in the middle of the village-ward side
  const g = FIELD.gateHalf;
  const fence = [F(g, -fw), F(fm, -fw), F(fm, fw), F(-fm, fw), F(-fm, -fw), F(-g, -fw)];
  field += `<path d="M${fence.map((p) => pt(p.x, p.z)).join('L')}" fill="none" stroke="${INK}" stroke-width="${close ? 1.4 : 1}" stroke-dasharray="${close ? '' : '3 1.5'}"/>`;
  out.push(field + '</g>');

  // the real trees and boulders of the village wood
  const pieces = [];
  for (const t of info.trees ?? []) {
    const [px, py] = P(t.x, t.z);
    if (px < -20 || py < -20 || px > PLAN + 20 || py > PLAN + 20) continue;
    pieces.push({ py, s: tree(px, py + Math.max(1.2 * t.s * k, 2.5), Math.max(0.9 * t.s * k, 2.2), t.kind === 'pine') });
  }
  for (const r of info.rocks ?? []) {
    const [px, py] = P(r.x, r.z);
    pieces.push({ py, s: `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(Math.max(r.s * k, 1.5))}" ry="${f1(Math.max(r.s * k * 0.7, 1.1))}" fill="#9a958a" stroke="${INK}" stroke-width="0.6"/>` });
  }
  pieces.sort((a, b) => a.py - b.py);
  out.push(`<g>${pieces.map((p) => p.s).join('')}</g>`);

  // the buildings and the things one goes to
  const site = (id, body) => `<g class="m-site" data-place="${id}">${body}</g>`;
  const dot = (x, z, r, fill) => {
    const [px, py] = P(x, z);
    return `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(r)}" fill="${fill}" stroke="${INK}" stroke-width="0.8"/>`;
  };
  const marks = [
    site('hovel', `<path d="${rect(L.hovel.x, L.hovel.z, 1.7, 1.45, L.hovel.rotY)}" class="m-roof"/>`),
    site('granary', `<path d="${rect(L.granary.x, L.granary.z, 1.7, 1.3, L.granary.rotY)}" class="m-roof"/>`),
    site('exchequer', `<path d="${rect(L.exchequer.x, L.exchequer.z, 0.95, 1.3, L.exchequer.rotY)}" class="m-roof"/>`),
    site('board', `<path d="${rect(L.questBoard.x, L.questBoard.z, 0.9, 0.18, L.questBoard.rotY)}" fill="#7a5a34" stroke="${INK}" stroke-width="0.8"/>`),
    site('tome', dot(L.tome.x, L.tome.z, Math.max(0.5 * k, 2.2), '#7a5a34')),
    site('charter', dot(L.charter.x, L.charter.z, Math.max(0.35 * k, 1.8), PAPER)),
    site('campfire', dot(L.campfire.x, L.campfire.z, Math.max(0.6 * k, 2.4), '#d9822b')),
    site('dummy', (() => {
      const [px, py] = P(L.dummy.x, L.dummy.z);
      const s = Math.max(0.6 * k, 3);
      return `<path d="M${f1(px - s)},${f1(py - s)}l${f1(2 * s)},${f1(2 * s)}M${f1(px + s)},${f1(py - s)}l${f1(-2 * s)},${f1(2 * s)}" stroke="${INK}" stroke-width="1.6"/>`;
    })()),
  ];
  if (info.market) marks.push(site('cart', `<path d="${rect(L.cart.x, L.cart.z, 1.1, 0.7, L.cart.rotY)}" fill="#a0703c" stroke="${INK}" stroke-width="0.8"/>`));
  out.push(marks.join(''));

  // names
  const label = (id, x, z, text, dx, dy, cls = 'm-name m-small') => {
    const [px, py] = P(x, z);
    return `<text x="${f1(px + dx)}" y="${f1(py + dy)}" class="${cls}" data-place="${id}">${text}</text>`;
  };
  const fc = F(0, 0);
  if (close) {
    out.push(
      label('hovel', L.hovel.x, L.hovel.z, 'Thy hovel', 0, 34) +
      label('campfire', L.campfire.x, L.campfire.z, 'Campfire', 0, 20) +
      label('board', L.questBoard.x, L.questBoard.z, 'Quest Board', -6, -12) +
      label('tome', L.tome.x, L.tome.z, 'The Tome', 0, 20) +
      label('charter', L.charter.x, L.charter.z, 'Charter', 30, 14) +
      label('exchequer', L.exchequer.x, L.exchequer.z, 'Exchequer', -40, 4) +
      label('granary', L.granary.x, L.granary.z, 'Granary', 44, 30) +
      label('dummy', L.dummy.x, L.dummy.z, 'Dummy', 0, 22) +
      label('cart', L.cart.x, L.cart.z, info.market ? 'Chapman' : 'chapman’s spot', 10, info.market ? -14 : -4, info.market ? 'm-name m-small' : 'm-name m-small m-faint')
    );
  } else {
    const home = P(1, 3);
    out.push(`<text x="${f1(home[0])}" y="${f1(home[1] + 28)}" class="m-name m-home" data-place="home">${CONFIG.realm.village}</text>`);
    out.push(label('field', fc.x, fc.z, 'the miller’s strip', 0, 4 + fw * k + 10));
    out.push(`<text class="m-name m-small m-faint" data-place="bounds"><textPath href="#m-bounds-arc" startOffset="50%">the bounds of thy wandering</textPath></text>`);
    out.push(`<circle cx="${PLAN / 2}" cy="${PLAN / 2}" r="${f1(WORLD_RADIUS * k)}" fill="none" stroke="${WAX}" stroke-width="1" stroke-dasharray="6 4" data-place="bounds"/>`);
    // where the road leaves: east toward Hollin Cross, west toward the Marches
    const east = P(pathX(92), 92);
    const west = P(pathX(-92), -92);
    out.push(`<text x="${f1(Math.min(east[0], PLAN - 50))}" y="${f1(east[1] - 8)}" class="m-name m-small" data-place="road">to Hollin Cross →</text>`);
    out.push(`<text x="${f1(Math.max(west[0], 52))}" y="${f1(west[1] + 18)}" class="m-name m-small" data-place="roadWest">← to the Marches</text>`);
  }

  // thou: a red arrow pointing the way thou facest (held to the frame's edge if off it)
  let [yx, yy] = P(info.x, info.z);
  const off = yx < 10 || yy < 10 || yx > PLAN - 10 || yy > PLAN - 10;
  yx = Math.min(Math.max(yx, 10), PLAN - 10);
  yy = Math.min(Math.max(yy, 10), PLAN - 10);
  // facing f looks along world (sin f, cos f); turned onto the plan:
  const fx = Math.sin(info.facing);
  const fz = Math.cos(info.facing);
  const ang = Math.atan2(-COS_N * fx - SIN_N * fz, -SIN_N * fx + COS_N * fz);
  out.push(`<g class="m-you${off ? ' m-off' : ''}" data-place="you" data-px="${f1(yx)}" data-py="${f1(yy)}" transform="translate(${f1(yx)} ${f1(yy)}) rotate(${f1((ang * 180) / Math.PI)})">
    <circle r="9" fill="${WAX}" opacity="0.18"/><path d="M8,0L-5,-5.5L-2,0L-5,5.5Z" fill="${WAX}" stroke="${PAPER}" stroke-width="1"/></g>`);

  out.push('</g>');
  // a small north arrow, and the frame
  out.push(`<g transform="translate(${PLAN - 22} 30)"><path d="M0,-14L5,4L0,0L-5,4Z" fill="${INK}"/><text y="-18" class="m-compass-n m-small">N</text></g>`);
  out.push(`<rect x="1" y="1" width="${PLAN - 2}" height="${PLAN - 2}" fill="none" stroke="${INK}" stroke-width="1.5"/>`);

  return `<svg viewBox="0 0 ${PLAN} ${PLAN}" class="m-plan" role="img" aria-label="Plan of ${CONFIG.realm.village}">${out.join('')}</svg>`;
}

// ---------- the panel ----------

function defaultCaption() {
  return `Only ${CONFIG.realm.village} lies within thy reach — the roads beyond await. Hover a place to read of it.`;
}

function notesById() {
  const notes = { ...siteNotes() };
  for (const p of realmPlaces()) notes[p.id] = p.note;
  for (const [id, n] of Object.entries(REGION_NOTES)) notes[id] = n.replace('{K}', CONFIG.realm.kingdom).replace('{L}', CONFIG.realm.lake);
  return notes;
}

// info: { x, z, facing, trees, rocks, market, looks } — from main.js
export function renderMap(body, info) {
  if (!realmCache) realmCache = drawRealm();
  if (!planView) planView = Math.hypot(info.x - VIEWS.green.cx, info.z - VIEWS.green.cz) < VIEWS.green.r * 0.9 ? 'green' : 'bounds';

  const notes = notesById();
  const paint = () => {
    body.innerHTML = `
      <div class="map-wrap">
        <div class="map-realm">${realmCache}</div>
        <div class="map-side">
          <h2>${CONFIG.realm.village}</h2>
          <div class="map-views">${Object.entries(VIEWS)
            .map(([id, v]) => `<button data-view="${id}" class="${id === planView ? 'on' : ''}">${v.title}</button>`)
            .join('')}</div>
          ${drawPlan(planView, info)}
        </div>
      </div>
      <div class="map-caption" id="map-caption">${defaultCaption()}</div>`;
    const caption = body.querySelector('#map-caption');
    body.querySelectorAll('[data-place]').forEach((el) => {
      const id = el.closest('[data-place]').dataset.place;
      el.addEventListener('mouseenter', () => {
        if (notes[id]) caption.textContent = notes[id];
      });
      el.addEventListener('mouseleave', () => {
        caption.textContent = defaultCaption();
      });
    });
    body.querySelectorAll('[data-view]').forEach((b) =>
      b.addEventListener('click', () => {
        planView = b.dataset.view;
        paint();
      })
    );
  };
  paint();
}
