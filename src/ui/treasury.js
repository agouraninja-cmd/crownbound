// The Treasury — the Exchequer's ledger of the player's REAL savings.
// Honor system, no game value: nothing here pays XP or coins, ever.
//
// The panel is built to be glanced at and used in a minute:
//   - one picture: a coffer that fills with coin as the savings near the goal,
//     the figure beside it in large numerals, and a track with quarter marks;
//   - one thing to do: the clerk's card shows only what is wanted now — the
//     three opening questions, last month's reckoning, or the next goal;
//   - everything else (months past, goals won, the plan, the how-to) is folded
//     away until asked for.
// Between reckonings the player can "lay in coin" whenever real money is moved
// into savings, so the coffer answers the deed on the day it is done.
//
// The rules live in state.js (layIn, fileReckoning, judgeReckoning); this file
// only draws and asks. The pictures are SVG built here, ink and wash like the
// Map and the wares — no ids or gradients inside them.

import {
  getState,
  setTreasury,
  setSummit,
  setPledge,
  layIn,
  lastCounted,
  fileReckoning,
  reckoningDue,
  judgeReckoning,
} from '../state/state.js';
import { monthKey, prevMonthKey, nextMonthKey } from '../state/dates.js';
import { makeRng } from '../scene/meshUtils.js';
import { toast } from './toasts.js';
import { sfx } from './audio.js';

const INK = '#2b2014';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const QUARTERS = [25, 50, 75];
const QUARTER_WORDS = { 25: 'A quarter', 50: 'Half', 75: 'Three quarters' };

// each verdict: its name on the rolls, what it means in plain words, its seal
const VERDICTS = {
  fat: { name: 'the hoard grew fat', short: 'Fat', means: 'pledge kept', fill: '#d0a52e', edge: '#6e5410', mark: INK },
  held: { name: 'held the line', short: 'Held', means: 'no ground lost', fill: '#a98a5c', edge: '#4f3d24', mark: INK },
  bled: { name: 'the purse bled', short: 'Bled', means: 'ground lost', fill: '#8a2418', edge: '#4a120a', mark: '#f3e6c4' },
  unreckoned: { name: 'unreckoned', short: '—', means: 'no reckoning was filed' },
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const money = (n) => Math.round(n).toLocaleString();
const monthName = (key) => MONTH_NAMES[Number(key.split('-')[1]) - 1];
const shortMonth = (key) => MONTHS[Number(key.split('-')[1]) - 1];
const rollMonth = (key) => `${shortMonth(key)} ’${key.slice(2, 4)}`;
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

// ---------- what the panel remembers while it is open ----------

let body = null;
let setup = null; // the opening questions: { step, name, goal, current, pledge }
let openForm = null; // the small form under the figure: 'lay' | 'count' | null
const openFolds = new Set(); // which folded sections are open
let shownPct = null; // the fill last drawn, so the track grows from it
let coinDrop = false; // a coin falls into the coffer on the next draw
let stampMonth = null; // the roll whose seal is stamped in on the next draw
let focusFirst = false; // put the cursor in the card's first box on the next draw (never on
// opening: the E that opened the panel would be typed into it)

// called when the panel closes: every visit opens tidy
export function resetTreasury() {
  setup = null;
  openForm = null;
  openFolds.clear();
  shownPct = null;
  coinDrop = false;
  stampMonth = null;
  focusFirst = false;
}

// ---------- pictures ----------

// The coffer, lid thrown back, heaped with coin by how far the savings stand
// toward the goal (0–100). Empty of coin only when there are no savings.
function coffer(pct, hasCoin) {
  const fill = Math.max(0, Math.min(1, pct / 100));
  const rnd = makeRng(1250);
  const coins = [];
  const count = hasCoin ? 5 + Math.round(fill * 60) : 0;
  for (let i = 0; i < count; i++) {
    const x = rnd() * 2 - 1; // across the opening
    const depth = rnd(); // back to front
    const heap = (5 + fill * 36) * (1 - x * x * 0.85); // how high the heap stands here
    coins.push({ x: 80 + x * 43, y: 57.5 - depth * 6 - rnd() * heap, tilt: (rnd() - 0.5) * 18 });
  }
  coins.sort((a, b) => b.y - a.y); // the heap is laid from the bottom up
  const coin = (c) => `<g transform="rotate(${c.tilt.toFixed(1)} ${c.x.toFixed(1)} ${c.y.toFixed(1)})">
      <ellipse cx="${c.x.toFixed(1)}" cy="${(c.y + 1.7).toFixed(1)}" rx="7" ry="2.9" fill="#a17d24" stroke="${INK}" stroke-width="0.8"/>
      <ellipse cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" rx="7" ry="2.9" fill="#e8c658" stroke="${INK}" stroke-width="0.8"/>
      <path d="M${(c.x - 3.6).toFixed(1)} ${(c.y - 0.6).toFixed(1)} q3.4 -1.6 7 0" fill="none" stroke="#fff3c4" stroke-width="0.8" stroke-linecap="round" opacity="0.8"/>
    </g>`;
  const star = (x, y, r) =>
    `<path d="M${x} ${y - r} L${x + r * 0.28} ${y - r * 0.28} L${x + r} ${y} L${x + r * 0.28} ${y + r * 0.28} L${x} ${y + r} L${x - r * 0.28} ${y + r * 0.28} L${x - r} ${y} L${x - r * 0.28} ${y - r * 0.28} Z" fill="#fff3c4" stroke="${INK}" stroke-width="0.6"/>`;
  const band = (d) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="7.4" stroke-linecap="butt"/>
    <path d="${d}" fill="none" stroke="#5d5a55" stroke-width="5.4" stroke-linecap="butt"/>`;
  const rivets = (pts) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1" fill="#2e2c2a"/>`).join('');
  const full = fill >= 1;
  return `<svg viewBox="0 0 160 132" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A coffer, ${hasCoin ? `${Math.floor(pct)} parts in a hundred full` : 'empty'}">
    <ellipse cx="80" cy="117" rx="64" ry="6" fill="${INK}" opacity="0.16"/>
    <path d="M34 49 L37 21 Q80 3 123 21 L126 49 Z" fill="#5d4630" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M40 44 Q80 30 120 44" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.4"/>
    ${band('M55 49 L57 13.5')}${band('M105 49 L103 13.5')}
    <path d="M24 61 L34 49 L126 49 L136 61 Z" fill="#2a1e14" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>
    ${coins.map(coin).join('')}
    ${full ? star(50, 22, 6) + star(112, 30, 4.5) + star(84, 9, 5) : ''}
    <path d="M24 61 L136 61 L132 114 L28 114 Z" fill="#8a6238" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M24 61 L136 61 L135.4 68 L24.6 68 Z" fill="#6f4f2c" stroke="${INK}" stroke-width="1"/>
    <path d="M26 83 H134 M27.4 99 H132.6" stroke="${INK}" stroke-width="0.8" opacity="0.45"/>
    <path d="M118 72 l12 0 M119 76 l11 0 M119 88 l10 0 M119 92 l9 0 M120 104 l8 0 M120 108 l7 0" stroke="${INK}" stroke-width="0.8" stroke-linecap="round" opacity="0.4"/>
    ${band('M49 61 L50.4 114')}${band('M111 61 L109.6 114')}
    ${rivets([[49.4, 72], [49.8, 90], [50.2, 106], [110.6, 72], [110.2, 90], [109.8, 106]])}
    <path d="M72 61 H88 V77 Q80 83 72 77 Z" fill="#5d5a55" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/>
    <circle cx="80" cy="69.5" r="2.1" fill="${INK}"/><path d="M80 70 L80 76" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>
    ${
      full
        ? coin({ x: 44, y: 118, tilt: -6 }) + coin({ x: 118, y: 120, tilt: 8 }) + coin({ x: 96, y: 123, tilt: -3 })
        : ''
    }
  </svg>`;
}

// A wax seal for a month's verdict. The mark inside says it without colour:
// risen (fat), level (held), fallen (bled); an unreckoned month is an empty ring.
function sealMarks(verdict) {
  const v = VERDICTS[verdict];
  if (!v || verdict === 'unreckoned') {
    return `<circle cx="20" cy="20" r="14" fill="none" stroke="${INK}" stroke-width="1.4" stroke-dasharray="3 3.4" opacity="0.55"/>
      <path d="M14 20 H26" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity="0.55"/>`;
  }
  let d = '';
  for (let i = 0; i <= 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const r = 17.3 + 1.5 * Math.cos(a * 12);
    d += `${i ? 'L' : 'M'}${(20 + Math.cos(a) * r).toFixed(2)} ${(20 + Math.sin(a) * r).toFixed(2)}`;
  }
  const mark = {
    fat: 'M12.5 23.5 L20 14.5 L27.5 23.5',
    held: 'M13 16.8 H27 M13 23.6 H27',
    bled: 'M12.5 16.5 L20 25.5 L27.5 16.5',
  }[verdict];
  return `<path d="${d}Z" fill="${v.fill}" stroke="${v.edge}" stroke-width="1.2" stroke-linejoin="round"/>
    <circle cx="20" cy="20" r="12.6" fill="none" stroke="${v.edge}" stroke-width="0.9" opacity="0.6"/>
    <path d="M9 14 Q13 8.5 20 7.6" fill="none" stroke="#fff3c4" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
    <path d="${mark}" fill="none" stroke="${v.mark}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function seal(verdict, size = 40, cls = '') {
  const v = VERDICTS[verdict] ?? VERDICTS.unreckoned;
  return `<svg class="tr-seal ${cls}" width="${size}" height="${size}" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${v.short === '—' ? 'unreckoned' : v.short}">${sealMarks(verdict)}</svg>`;
}

// The climb: the savings as each reckoning found them, one bar a month (the
// last twelve), each month's seal beneath it. The rows under the chart are the
// same figures as a table.
function climbChart(rolls, goal) {
  const shown = rolls.slice(-12);
  const counted = shown.filter((r) => Number.isFinite(r.counted)).map((r) => r.counted);
  if (!counted.length) return '';
  const W = 560;
  const top = 26;
  const base = 112;
  const slot = Math.min(64, (W - 16) / shown.length);
  const x0 = (W - slot * shown.length) / 2;
  const barW = Math.min(34, slot - 8);
  const highest = Math.max(...counted);
  // the goal's line is drawn once the climb is far enough along to share a scale with it
  const withGoal = goal > 0 && highest >= goal * 0.35;
  const max = Math.max(withGoal ? goal : 0, highest, 1);
  const yOf = (v) => base - (v / max) * (base - top);
  const lastReckoned = shown.map((r) => Number.isFinite(r.counted)).lastIndexOf(true);

  let marks = '';
  shown.forEach((r, i) => {
    const cx = x0 + slot * i + slot / 2;
    const x = cx - barW / 2;
    const v = VERDICTS[r.verdict] ?? VERDICTS.unreckoned;
    if (Number.isFinite(r.counted)) {
      const y = Math.min(yOf(r.counted), base - 2);
      const rad = Math.min(3.5, (base - y) / 2);
      marks += `<path class="tr-bar" d="M${x.toFixed(1)} ${base} V${(y + rad).toFixed(1)} Q${x.toFixed(1)} ${y.toFixed(1)} ${(x + rad).toFixed(1)} ${y.toFixed(1)} H${(x + barW - rad).toFixed(1)} Q${(x + barW).toFixed(1)} ${y.toFixed(1)} ${(x + barW).toFixed(1)} ${(y + rad).toFixed(1)} V${base} Z"
          fill="#b8932f" stroke="${INK}" stroke-width="1" stroke-linejoin="round"><title>${rollMonth(r.month)} — savings ${money(r.counted)} · ${v.name}</title></path>`;
      if (i === lastReckoned) {
        marks += `<text x="${cx.toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle" class="tr-chart-val">${money(r.counted)}</text>`;
      }
    } else {
      marks += `<path d="M${x.toFixed(1)} ${base - 5} H${(x + barW).toFixed(1)}" stroke="${INK}" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.45"><title>${rollMonth(r.month)} — no reckoning was filed</title></path>`;
    }
    marks += `<g transform="translate(${(cx - 7).toFixed(1)} 116) scale(0.35)">${sealMarks(r.verdict)}</g>
      <text x="${cx.toFixed(1)}" y="144" text-anchor="middle" class="tr-chart-lab">${shortMonth(r.month)}</text>`;
  });
  const goalLine = withGoal
    ? `<path d="M8 ${yOf(goal).toFixed(1)} H${W - 8}" stroke="${INK}" stroke-width="1" stroke-dasharray="6 5" opacity="0.6"/>
       <text x="10" y="${(yOf(goal) - 5).toFixed(1)}" class="tr-chart-lab">the goal — ${money(goal)}</text>`
    : '';
  return `<svg class="tr-chart" viewBox="0 0 ${W} 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Thy savings, month by month">
    ${goalLine}
    <path d="M8 ${base} H${W - 8}" stroke="${INK}" stroke-width="1.2" opacity="0.7"/>
    ${marks}
  </svg>`;
}

// ---------- small pieces ----------

// one labelled figure: what it is on the left (with a line of help), the box on the right
function field(attr, label, hint, value = '', type = 'number', placeholder = '') {
  const extra = type === 'number' ? 'min="0" step="any" inputmode="decimal"' : 'maxlength="60"';
  return `<label class="ledger-field">
      <span class="lf-text"><span class="lf-label">${label}</span><span class="lf-hint">${hint}</span></span>
      <input type="${type}" ${attr} ${extra} value="${value}" placeholder="${placeholder}" />
    </label>`;
}

function fold(key, title, inner) {
  return `<details class="tr-fold" data-fold="${key}"${openFolds.has(key) ? ' open' : ''}>
      <summary>${title}</summary>
      <div class="tr-fold-body">${inner}</div>
    </details>`;
}

// how long the road is at the pledged pace: "about 26 months — around Jan ’29"
function paceLine(left, pledge, now = new Date()) {
  if (!(pledge > 0) || !(left > 0)) return '';
  const months = Math.ceil(left / pledge);
  if (months > 600) return 'a long road at this pace — a larger pledge shortens it';
  const when = new Date(now.getFullYear(), now.getMonth() + months, 1);
  return `about ${plural(months, 'month')} at ${money(pledge)} a month — around ${MONTHS[when.getMonth()]} ’${String(when.getFullYear()).slice(2)}`;
}

// how many rolls, counted back from the newest, pass the test
function running(rolls, test) {
  let n = 0;
  for (let i = rolls.length - 1; i >= 0 && test(rolls[i]); i--) n++;
  return n;
}

// what the clerk says of a month once it is on the rolls — and what to do next
function outcome(roll, t) {
  const fatRun = running(t.rolls, (r) => r.verdict === 'fat');
  if (roll.verdict === 'fat') {
    return `Thy pledge was kept — ${money(roll.saved)} laid in.${fatRun >= 2 ? ` That is ${fatRun} fat months running.` : ''} Do the same again and the goal comes on schedule.`;
  }
  if (roll.verdict === 'held') {
    return t.pledge > 0
      ? `No ground lost, though the pledge of ${money(t.pledge)} was not met (${money(roll.saved)} laid in). Lay in coin the day it comes to thee, before it can be spent.`
      : 'No ground lost. Set a monthly pledge under “Change the plan” and a month can grow fat.';
  }
  if (roll.verdict === 'bled') {
    return 'A hard month, honestly told — and that telling is the half of it. Choose one cost to cut this month and post it at the Quest Board: that deed earns virtue.';
  }
  return 'No reckoning was filed for this month.';
}

// ---------- the opening questions (an untouched ledger) ----------

// what each opening question is about — the labels under the three bars
const STEPS = ['The goal', 'Saved so far', 'Each month'];

const CHIPS = ['A rainy-day fund', 'A great purchase', 'A lord’s fortune'];

function renderSetup() {
  if (!setup) setup = { step: 1, name: '', goal: '', current: '', pledge: '' };
  const s = setup;
  // the three bars, each named for what its question is about, so the road ahead is
  // seen before it is walked: done ones in wax, the one in hand in ink, the rest faint
  const pips = STEPS.map((label, i) => {
    const n = i + 1;
    const state = n < s.step ? 'done' : n === s.step ? 'now' : '';
    return `<div class="tr-pip ${state}"><i></i><span>${label}</span></div>`;
  }).join('');
  let question;
  if (s.step === 1) {
    question = `<h2>What art thou saving for?</h2>
      <p class="muted">A goal with a name is a goal half won. Pick one, or write thy own.</p>
      <div class="tr-chips">${CHIPS.map((c) => `<button type="button" data-chip="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      ${field('data-w-name', 'Its name', 'what the money is for', esc(s.name), 'text', 'e.g. The War Chest')}
      ${field('data-w-goal', 'The full sum to reach', 'the whole total thy savings must grow to — not a monthly amount (that is asked last)', s.goal, 'number', '10000')}`;
  } else if (s.step === 2) {
    question = `<h2>How much is in thy savings today?</h2>
      <p class="muted">All of it, as thy account shows — every coin already saved counts toward the
      ${money(s.goal)} thou hast named. Nothing yet is an honest start.</p>
      ${field('data-w-current', 'Savings today', 'the whole of it, on thy honor', s.current, 'number', '0')}
      <p class="tr-pace" data-w-have></p>`;
  } else {
    question = `<h2>What wilt thou set aside each month?</h2>
      <p class="muted">Thy monthly pledge — small and kept beats grand and broken. The clerk judges each month by it.</p>
      ${field('data-w-pledge', 'Monthly pledge', 'what thou meanest to put into savings', s.pledge, 'number', '50')}
      <p class="tr-pace" data-w-pace></p>`;
  }
  body.innerHTML = `
    <div class="tr-hero">
      <div class="tr-coffer">${coffer(0, false)}</div>
      <div class="tr-figure">
        <div class="tr-lead">The clerk opens a fresh ledger.</div>
        <p class="muted">This is thy real money, kept on thy honor: a goal to save toward, and a look at it
        once a month. Three questions and it is begun.</p>
      </div>
    </div>
    <div class="tr-card" data-card>
      <div class="tr-pips">${pips}</div>
      ${question}
      <div class="row right">
        ${s.step > 1 ? '<button type="button" data-w-back>Back</button>' : ''}
        <button type="button" class="primary" data-w-next>${s.step < 3 ? 'Next' : 'Seal the ledger'}</button>
      </div>
    </div>
    <p class="muted tr-foot">Game coins never enter here, and the Treasury pays no XP or coins.</p>`;

  const q = (sel) => body.querySelector(sel);
  for (const chip of body.querySelectorAll('[data-chip]')) {
    chip.addEventListener('click', () => {
      q('[data-w-name]').value = chip.dataset.chip;
      q('[data-w-goal]').focus();
    });
  }
  // the second question answers as it is typed: how far along the goal that puts him —
  // and, if it is already past the goal, that the goal was likely meant as a monthly sum
  const have = q('[data-w-have]');
  if (have) {
    const showHave = () => {
      const current = Number(q('[data-w-current]').value) || 0;
      const over = current >= s.goal;
      have.classList.toggle('warn', over);
      have.textContent = over
        ? `That is already at or past thy goal of ${money(s.goal)}. The goal is the full total thy savings must reach, not a monthly sum — go Back and set it higher than what thou hast.`
        : `${money(current)} of ${money(s.goal)} — ${money(s.goal - current)} still to save.`;
    };
    q('[data-w-current]').addEventListener('input', showHave);
    showHave();
  }
  const pace = q('[data-w-pace]');
  if (pace) {
    const left = Math.max(0, Number(s.goal) - (Number(s.current) || 0));
    const showPace = () => {
      const pledge = Number(q('[data-w-pledge]').value);
      pace.textContent =
        left <= 0
          ? 'Thy savings already stand at the goal, so the first reckoning will win it. If that was not thy meaning, go Back twice and set the goal higher — it is the full total, not a monthly sum.'
          : pledge > 0
            ? `${money(left)} to go: ${paceLine(left, pledge)}.`
            : `${money(left)} to go. Name a sum and the clerk reckons how long the road is.`;
    };
    q('[data-w-pledge]').addEventListener('input', showPace);
    showPace();
  }
  q('[data-w-back]')?.addEventListener('click', () => {
    s.step -= 1;
    focusFirst = true;
    renderTreasury();
  });
  q('[data-w-next]').addEventListener('click', () => {
    if (s.step === 1) {
      const goal = Number(q('[data-w-goal]').value);
      if (!Number.isFinite(goal) || goal < 1) {
        toast('A goal needs a sum to reach.', 'grim');
        return;
      }
      s.name = q('[data-w-name]').value.trim();
      s.goal = goal;
    } else if (s.step === 2) {
      const current = q('[data-w-current]').value.trim() === '' ? 0 : Number(q('[data-w-current]').value);
      if (!Number.isFinite(current) || current < 0) {
        toast('The clerk squints — that is no figure.', 'grim');
        return;
      }
      s.current = current;
    } else {
      const pledge = q('[data-w-pledge]').value.trim() === '' ? 0 : Number(q('[data-w-pledge]').value);
      if (!Number.isFinite(pledge) || pledge < 0) {
        toast('The clerk squints — that is no figure.', 'grim');
        return;
      }
      // a ledger is "opened" by its name, so an unnamed goal is given a plain one
      setSummit(s.name || 'The Hoard', s.goal);
      setTreasury(s.current, getState().treasury.goal);
      setPledge(pledge);
      setup = null;
      shownPct = 0; // the track grows from nought on its first showing
      sfx.coin();
      toast('The ledger is sealed. The climb begins.', 'gold');
      renderTreasury();
      return;
    }
    s.step += 1;
    focusFirst = true;
    renderTreasury();
  });
  if (focusFirst) q('.tr-card input')?.focus();
  focusFirst = false;
}

// ---------- the ledger ----------

function renderLedger(t) {
  const now = new Date();
  const thisMonth = monthKey(now);
  const due = reckoningDue(now);
  const hasGoal = t.goal > 0;
  const pct = hasGoal ? Math.min(100, (t.current / t.goal) * 100) : 0;
  const left = hasGoal ? Math.max(0, t.goal - t.current) : 0;
  const from = shownPct ?? pct;

  // ---- the hoard at a glance ----
  const inline =
    openForm === 'lay'
      ? `<div class="tr-inline" data-card>
          ${field('data-lay-amount', 'Lay in coin', 'real money thou hast just moved into savings', '', 'number', '50')}
          <div class="row right"><button type="button" data-form-close>Never mind</button>
          <button type="button" class="primary" data-lay-set>Lay it in</button></div>
        </div>`
      : openForm === 'count'
        ? `<div class="tr-inline" data-card>
            ${field('data-count-amount', 'Recount', 'what thy account truly shows — a correction, it never wins a goal', t.current)}
            <div class="row right"><button type="button" data-form-close>Never mind</button>
            <button type="button" class="primary" data-count-set>Set it</button></div>
          </div>`
        : '';

  const track = hasGoal
    ? `<div class="tr-track" role="img" aria-label="${Math.floor(pct)} parts in a hundred of the goal">
        <div class="tr-track-fill" data-fill style="width:${from}%"></div>
        ${QUARTERS.map((n) => `<i class="tr-notch${pct >= n ? ' won' : ''}" style="left:${n}%"></i>`).join('')}
      </div>
      <div class="tr-trackline">
        <span>${
          left === 0
            ? '<b>The goal is reached!</b> The clerk declares it won at the next reckoning.'
            : `<b>${Math.floor(pct)}%</b> of the way · <b>${money(left)}</b> to go`
        }</span>
        <span>${left > 0 ? paceLine(left, t.pledge, now) || 'set a monthly pledge to see how long the road is' : ''}</span>
      </div>`
    : '';

  const laidNow = t.laid[thisMonth] ?? 0;
  const monthMeter =
    t.pledge > 0
      ? `<div class="tr-month${laidNow >= t.pledge ? ' kept' : ''}">
          <div class="tr-month-head">
            <span>${monthName(thisMonth)}&#8217;s pledge</span>
            <span>${
              laidNow >= t.pledge
                ? `kept — ${money(laidNow)} laid in`
                : laidNow > 0
                  ? `${money(laidNow)} of ${money(t.pledge)} laid in`
                  : `${money(t.pledge)} to lay in — nothing yet`
            }</span>
          </div>
          <div class="xpbar treasury"><div style="width:${Math.min(100, (laidNow / t.pledge) * 100)}%"></div></div>
        </div>`
      : '';

  const reckonedRun = running(t.rolls, (r) => r.verdict !== 'unreckoned');
  const fatRun = running(t.rolls, (r) => r.verdict === 'fat');
  const badges = [
    reckonedRun >= 2 ? `${reckonedRun} months reckoned running` : '',
    fatRun >= 2 ? `${fatRun} fat months running` : '',
    t.conquered.length ? `${plural(t.conquered.length, 'goal')} won` : '',
  ].filter(Boolean);

  const hero = `
    <div class="tr-hero">
      <div class="tr-coffer${coinDrop ? ' drop' : ''}">${coffer(hasGoal ? pct : t.current > 0 ? 45 : 0, t.current > 0)}</div>
      <div class="tr-figure">
        <div class="tr-label">Thy savings</div>
        <div class="tr-amount">${money(t.current)}</div>
        <div class="tr-goal">${
          hasGoal
            ? `toward <b>${t.name ? esc(t.name) : 'an unnamed goal'}</b> — ${money(t.goal)}`
            : 'No goal is raised.'
        }</div>
        <div class="tr-acts">
          <button type="button" data-lay-open>Lay in coin</button>
          <button type="button" class="tr-quiet" data-count-open>Recount</button>
        </div>
      </div>
    </div>
    ${inline}
    ${track}
    ${monthMeter}
    ${badges.length ? `<div class="tr-badges">${badges.map((b) => `<span>${b}</span>`).join('')}</div>` : ''}`;

  // ---- the clerk's card: only what is wanted now ----
  const nextGoal = hasGoal
    ? ''
    : `<div class="tr-card" data-card>
        <h2>Name the next goal</h2>
        <p class="muted">${
          t.conquered.length ? 'A goal is won. What is the next thing worth saving for?' : 'What art thou saving for, and how much does it need?'
        }</p>
        ${field('data-s-name', 'Its name', 'what the money is for', '', 'text', 'e.g. The War Chest')}
        ${field('data-s-goal', 'The full sum to reach', 'the whole total thy savings must grow to — not a monthly amount')}
        <div class="row right"><button type="button" class="primary" data-s-set>Raise the goal</button></div>
      </div>`;

  let clerk;
  if (due) {
    const laidDue = t.laid[due] ?? 0;
    // no data-card here: a filing cannot be undone, so Enter must not press its button
    clerk = `<div class="tr-card tr-reckon">
        <h2>${monthName(due)}&#8217;s reckoning</h2>
        <p class="muted">Two figures and ${monthName(due)} is entered on the rolls.</p>
        ${field(
          'data-r-saved',
          `Put into savings in ${monthName(due)}`,
          laidDue > 0 ? `the coin thou didst lay in comes to ${money(laidDue)} — mend it if that is not all` : 'what thou didst move into savings that month',
          laidDue > 0 ? laidDue : ''
        )}
        ${field('data-r-counted', 'Savings now', 'what thy account shows today — this becomes thy savings', t.current)}
        <details class="tr-more">
          <summary>Add income and spending <i>(as thou wilt)</i></summary>
          <p class="muted">With these the clerk can tell how much of every hundred earned thou didst keep.
          Money moved into savings is not spending.</p>
          ${field('data-r-earned', 'Income', `everything that came in during ${monthName(due)}`)}
          ${field('data-r-spent', 'Spending', 'everything that went out, savings aside')}
        </details>
        <div class="tr-verdict" data-r-preview></div>
        <div class="row right"><button type="button" class="primary" data-r-file>File the reckoning</button></div>
      </div>`;
  } else {
    const last = t.rolls[t.rolls.length - 1];
    const stamped = last && last.month === stampMonth;
    clerk = `<div class="tr-card tr-status">
        ${
          last
            ? `<div class="tr-outcome">
                ${seal(last.verdict, 62, stamped ? 'stamp' : '')}
                <div>
                  <h2>${monthName(last.month)} — ${VERDICTS[last.verdict].name}</h2>
                  <p>${outcome(last, t)}</p>
                </div>
              </div>`
            : ''
        }
        <p class="muted">${monthName(prevMonthKey(now))} is reckoned. The clerk asks after ${monthName(thisMonth)}
        from the 1st of ${monthName(nextMonthKey(thisMonth))} — until then, lay in coin whenever thou movest money into savings.</p>
      </div>`;
  }

  // ---- folded away: months past, goals won, the plan, the how-to ----
  const rollRows = [...t.rolls]
    .slice(-12)
    .reverse()
    .map((r) => {
      const v = VERDICTS[r.verdict] ?? VERDICTS.unreckoned;
      const figures =
        r.verdict === 'unreckoned'
          ? 'no reckoning was filed'
          : [
              `laid in ${money(r.saved)}`,
              `savings ${money(r.counted)}`,
              Number.isFinite(r.earned) ? `in ${money(r.earned)} · out ${money(r.spent)}` : '',
            ]
              .filter(Boolean)
              .join(' · ');
      return `<div class="deed tr-roll">
          ${seal(r.verdict, 20)}
          <span class="deed-date">${rollMonth(r.month)}</span>
          <span class="deed-text">${figures}</span>
          <span class="deed-tag">${v.name}</span>
        </div>`;
    })
    .join('');
  const legend = ['fat', 'held', 'bled']
    .map((k) => `<span>${seal(k, 18)} <b>${VERDICTS[k].short}</b> — ${VERDICTS[k].means}</span>`)
    .join('');
  const months = t.rolls.length
    ? fold(
        'rolls',
        'Months past',
        `${climbChart(t.rolls, t.goal)}
         <div class="tr-legend">${legend}</div>
         <div class="deed-list">${rollRows}</div>`
      )
    : '';

  const won = t.conquered.length
    ? fold(
        'won',
        `Goals won <i>(${t.conquered.length})</i>`,
        `<div class="deed-list">${[...t.conquered]
          .reverse()
          .map(
            (c) => `<div class="deed tr-roll">
              ${seal('fat', 20)}
              <span class="deed-date">${Number(c.conqueredAt.slice(8, 10))} ${rollMonth(c.conqueredAt.slice(0, 7))}</span>
              <span class="deed-text">“${esc(c.name)}”</span>
              <span class="deed-tag tag-gold">${money(c.goal)}</span>
            </div>`
          )
          .join('')}</div>`
      )
    : '';

  const plan = fold(
    'plan',
    'Change the plan',
    `${
      hasGoal
        ? field('data-t-name', 'Goal name', 'what thou art saving for', esc(t.name), 'text') +
          field('data-t-goal', 'Goal amount', 'the sum thy savings must reach', t.goal)
        : ''
    }
     ${field('data-t-pledge', 'Monthly pledge', 'what thou meanest to put into savings each month', t.pledge)}
     <div class="row right"><button type="button" data-t-set>Keep this plan</button></div>`
  );

  const how = fold(
    'how',
    'How the Treasury works',
    `<ol>
       <li><b>A goal and a pledge.</b> Name what thou art saving for, and what thou wilt set aside each month.</li>
       <li><b>Lay in coin.</b> Whenever thou movest real money into savings, say so here. The coffer fills, and the month&#8217;s pledge with it.</li>
       <li><b>The monthly reckoning.</b> When a month ends the clerk asks two figures and seals it:
         <b>fat</b> (${VERDICTS.fat.means}), <b>held</b> (${VERDICTS.held.means}) or <b>bled</b> (${VERDICTS.bled.means}).</li>
       <li><b>Goals are won at a reckoning</b> that finds thy savings at the goal. Then thou namest the next.</li>
     </ol>
     <p class="muted">Real money, on thy honor. Game coins never enter here and the Treasury pays no XP or coins —
     but a saving deed posted at the Quest Board earns virtue like any other.</p>`
  );

  body.innerHTML = `${hero}${nextGoal}${clerk}${months}${won}${plan}${how}`;
  coinDrop = false;
  stampMonth = null;

  // the track grows from where it last stood
  shownPct = pct;
  const fillEl = body.querySelector('[data-fill]');
  if (fillEl && from !== pct) {
    requestAnimationFrame(() => requestAnimationFrame(() => (fillEl.style.width = `${pct}%`)));
  }

  const q = (sel) => body.querySelector(sel);
  for (const d of body.querySelectorAll('[data-fold]')) {
    d.addEventListener('toggle', () => (d.open ? openFolds.add(d.dataset.fold) : openFolds.delete(d.dataset.fold)));
  }

  // ---- lay in coin / recount ----
  const toggleForm = (which) => {
    openForm = openForm === which ? null : which;
    focusFirst = true;
    renderTreasury();
  };
  q('[data-lay-open]').addEventListener('click', () => toggleForm('lay'));
  q('[data-count-open]').addEventListener('click', () => toggleForm('count'));
  q('[data-form-close]')?.addEventListener('click', () => toggleForm(openForm));
  if (focusFirst) q('.tr-inline input')?.focus();
  focusFirst = false;

  q('[data-lay-set]')?.addEventListener('click', () => {
    const amount = Number(q('[data-lay-amount]').value);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast('The clerk waits — how much was laid in?', 'grim');
      return;
    }
    layIn(amount);
    const after = getState().treasury;
    const afterPct = after.goal > 0 ? (after.current / after.goal) * 100 : 0;
    openForm = null;
    coinDrop = true;
    sfx.coin();
    const toGo = after.goal - after.current;
    toast(
      after.goal > 0
        ? toGo > 0
          ? `${money(amount)} laid in — ${money(toGo)} to go.`
          : `${money(amount)} laid in — the goal is reached!`
        : `${money(amount)} laid in.`,
      'gold'
    );
    const passed = QUARTERS.filter((n) => pct < n && afterPct >= n).pop();
    if (passed && afterPct < 100) {
      toast(`${QUARTER_WORDS[passed]} of the way to ${esc(after.name || 'the goal')}!`, 'gold');
    }
    if (after.pledge > 0 && laidNow < after.pledge && (after.laid[thisMonth] ?? 0) >= after.pledge) {
      toast(`${monthName(thisMonth)}’s pledge is kept.`, 'gold');
    }
    renderTreasury();
  });

  q('[data-count-set]')?.addEventListener('click', () => {
    const raw = q('[data-count-amount]').value.trim();
    const count = Number(raw);
    if (raw === '' || !Number.isFinite(count) || count < 0) {
      toast('The clerk squints — that is no figure.', 'grim');
      return;
    }
    setTreasury(count, getState().treasury.goal);
    openForm = null;
    toast(`Thy savings are set at ${money(count)}.`, 'gold');
    renderTreasury();
  });

  // ---- the reckoning: judged live as the figures are typed ----
  const preview = q('[data-r-preview]');
  if (preview) {
    const laidDue = t.laid[due] ?? 0;
    const before = lastCounted();
    const counted = q('[data-r-counted]');
    let countedTouched = false;
    counted.addEventListener('input', () => (countedTouched = true));
    const read = (sel) => (q(sel).value.trim() === '' ? null : Number(q(sel).value));
    const update = () => {
      const saved = read('[data-r-saved]');
      // "savings now" follows what was put in beyond the coin already laid in,
      // until the player types the true count themself
      if (!countedTouched) counted.value = Math.max(0, t.current + (saved ?? laidDue) - laidDue);
      const count = read('[data-r-counted]');
      if (saved === null || count === null) {
        preview.innerHTML = `<p class="muted">Fill in the two figures and the clerk shows his seal before thou filest.</p>`;
        return;
      }
      const earned = read('[data-r-earned]');
      const spent = read('[data-r-spent]');
      const full = earned !== null && spent !== null;
      const verdict = judgeReckoning({ earned, spent, saved, counted: count, before }, t.pledge);
      const why = {
        fat: `thy pledge is kept: ${money(saved)} laid in against ${money(t.pledge)} pledged.`,
        held:
          (full ? 'thou spent no more than came in' : 'thy savings lost no ground') +
          (t.pledge > 0 ? `, though ${money(t.pledge - saved)} short of thy pledge.` : '. With no pledge set, held is the best a month can do.'),
        bled: full ? 'more went out than came in.' : 'thy savings stand lower than at the last reckoning.',
      }[verdict];
      const kept = full
        ? `<br>Left over after spending: <b>${money(earned - spent)}</b>${
            earned > 0 ? ` — ${Math.max(0, Math.round(((earned - spent) / earned) * 100))} of every hundred earned.` : '.'
          }`
        : '';
      const stands =
        t.goal > 0
          ? count >= t.goal
            ? `<br>Thy savings will stand at <b>${money(count)}</b> — <b>the goal is won!</b>`
            : `<br>Thy savings will stand at <b>${money(count)}</b>, ${Math.floor((count / t.goal) * 100)}% of the way.`
          : `<br>Thy savings will stand at <b>${money(count)}</b>.`;
      preview.innerHTML = `${seal(verdict, 54)}<p>Verdict: <b>${VERDICTS[verdict].name}</b> — ${why}${kept}${stands}</p>`;
    };
    for (const sel of ['[data-r-earned]', '[data-r-spent]', '[data-r-saved]', '[data-r-counted]']) {
      q(sel).addEventListener('input', update);
    }
    update();
  }

  q('[data-r-file]')?.addEventListener('click', () => {
    const blank = (sel) => q(sel).value.trim() === '';
    if (blank('[data-r-saved]') || blank('[data-r-counted]')) {
      toast('The clerk taps the blank lines — both figures, if thou please.', 'grim');
      return;
    }
    if (blank('[data-r-earned]') !== blank('[data-r-spent]')) {
      toast('Income and spending go together — give both, or neither.', 'grim');
      return;
    }
    const num = (sel) => (blank(sel) ? null : Number(q(sel).value));
    const entry = {
      earned: num('[data-r-earned]'),
      spent: num('[data-r-spent]'),
      saved: num('[data-r-saved]'),
      counted: num('[data-r-counted]'),
    };
    if (!Object.values(entry).every((v) => v === null || (Number.isFinite(v) && v >= 0))) {
      toast('The clerk squints — those figures are no figures.', 'grim');
      return;
    }
    const res = fileReckoning(entry);
    if (!res) return;
    sfx.page();
    stampMonth = res.roll.month;
    const name = VERDICTS[res.roll.verdict].name;
    const keptOf =
      res.roll.earned > 0
        ? ` Of every hundred earned, ${Math.max(0, Math.round(((res.roll.earned - res.roll.spent) / res.roll.earned) * 100))} were kept.`
        : '';
    toast(`The roll is entered — ${name}.${keptOf}`, res.roll.verdict === 'fat' ? 'gold' : res.roll.verdict === 'bled' ? 'grim' : '');
    if (res.conquered) {
      sfx.levelUp();
      toast(`${esc(res.conquered.name)} — conquered! Thy savings stand at ${money(getState().treasury.current)}.`, 'gold');
    }
    renderTreasury();
  });

  // ---- the next goal, the plan ----
  q('[data-s-set]')?.addEventListener('click', () => {
    const goal = Number(q('[data-s-goal]').value);
    if (!Number.isFinite(goal) || goal < 1) {
      toast('A goal needs a sum to reach.', 'grim');
      return;
    }
    setSummit(q('[data-s-name]').value || 'The Hoard', goal);
    shownPct = 0;
    toast('A new goal is raised. The climb resumes.', 'gold');
    renderTreasury();
  });

  q('[data-t-set]').addEventListener('click', () => {
    const pledge = Number(q('[data-t-pledge]').value);
    if (Number.isFinite(pledge)) setPledge(pledge);
    const goalEl = q('[data-t-goal]');
    if (goalEl) {
      const goal = Number(goalEl.value);
      // a name rubbed out keeps the old one — the name is what marks the ledger as opened
      setSummit(q('[data-t-name]').value.trim() || t.name, Number.isFinite(goal) && goal >= 1 ? goal : t.goal);
    }
    toast('The plan is entered in the ledger.', 'gold');
    renderTreasury();
  });
}

// ---------- the panel ----------

export function renderTreasury(el = body) {
  body = el;
  const t = getState().treasury;
  // a ledger nobody has touched yet is opened with three questions
  const untouched = !t.rolls.length && !t.conquered.length && t.current === 0 && t.pledge === 0 && !t.name;
  if (untouched) renderSetup();
  else renderLedger(t);

  for (const inp of body.querySelectorAll('input')) {
    inp.addEventListener('keydown', (e) => {
      // Enter presses the card's own button; no key typed here reaches the game
      if (e.key === 'Enter') inp.closest('[data-card]')?.querySelector('button.primary')?.click();
      if (e.key !== 'Escape') e.stopPropagation(); // Esc still closes the panel
    });
  }
}
