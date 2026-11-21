// The Treasury — the Exchequer's ledger of the player's REAL savings.
// Honor system, no game value: nothing here pays XP or coins, ever.
//
// The panel is built to be glanced at and used in a minute:
//   - one picture: a coffer that fills with coin as the savings near the goal,
//     the figure beside it in large numerals, and a track with quarter marks;
//   - one thing to do: a day book — money in, money out, into savings — entered
//     the day it happens (or, on a fresh ledger, the three opening questions);
//   - the clerk closes each month himself on the 1st from those entries
//     (state.js closeMonths), so nobody has to remember last month's figures;
//   - everything else (earlier days, months past, goals won, the plan, the
//     how-to) is folded away until asked for.
//
// The rules live in state.js (logMoney, closeMonths, judgeReckoning); this file
// only draws and asks. The pictures are SVG built here, ink and wash like the
// Map and the wares — no ids or gradients inside them.

import {
  getState,
  setTreasury,
  setSummit,
  setPledge,
  logMoney,
  unlogMoney,
  recount,
  monthTally,
} from '../state/state.js';
import { todayStr, monthKey, nextMonthKey } from '../state/dates.js';
import { makeRng } from '../scene/meshUtils.js';
import { CONFIG } from '../state/config.js';
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
  unreckoned: { name: 'unreckoned', short: '—', means: 'nothing was entered' },
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
let openForm = null; // the small form open: 'in' | 'out' | 'save' (an entry) | 'count' | null
const openFolds = new Set(); // which folded sections are open
let shownPct = null; // the fill last drawn, so the track grows from it
let coinDrop = false; // a coin falls into the coffer on the next draw
let focusFirst = false; // put the cursor in the card's first box on the next draw (never on
// opening: the E that opened the panel would be typed into it)

// called when the panel closes: every visit opens tidy
export function resetTreasury() {
  setup = null;
  openForm = null;
  openFolds.clear();
  shownPct = null;
  coinDrop = false;
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
      marks += `<path d="M${x.toFixed(1)} ${base - 5} H${(x + barW).toFixed(1)}" stroke="${INK}" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.45"><title>${rollMonth(r.month)} — nothing was entered</title></path>`;
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
    return `Thy pledge was kept — ${money(roll.saved)} put into savings.${fatRun >= 2 ? ` That is ${fatRun} fat months running.` : ''} Do the same again and the goal comes on schedule.`;
  }
  if (roll.verdict === 'held') {
    return t.pledge > 0
      ? `No ground lost, though the pledge of ${money(t.pledge)} was not met (${money(roll.saved)} saved). Put money into savings the day it comes to thee, before it can be spent.`
      : 'No ground lost. Set a monthly pledge under “Change the plan” and a month can grow fat.';
  }
  if (roll.verdict === 'bled') {
    return 'A hard month, honestly told — and that telling is the half of it. Choose one cost to cut this month and post it at the Quest Board: that deed earns virtue.';
  }
  return 'Nothing was entered that month. A few seconds a day keeps the clerk&#8217;s count true.';
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
        <p class="muted">This is thy real money, kept on thy honor: a goal to save toward, and a day book
        of money in and out that the clerk adds up for thee. Three questions and it is begun.</p>
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
    <p class="muted tr-foot">Win the goal and thou earnest <b>${CONFIG.rewards.goalXp} Intelligence XP</b>. Game coins never enter here, and nothing else is paid.</p>`;

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
          ? 'Thy savings already stand at the goal, so the first month to close will win it. If that was not thy meaning, go Back twice and set the goal higher — it is the full total, not a monthly sum.'
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

// the three kinds of entry, as the day book shows them
const KINDS = {
  in: { button: '+ Money in', label: 'Money in', hint: 'wages, gifts, anything that came to thee today', sign: '+', word: 'in' },
  out: { button: '− Money out', label: 'Money out', hint: 'anything thou didst spend today (money put into savings is not spending)', sign: '−', word: 'out' },
  save: { button: 'Into savings', label: 'Into savings', hint: 'real money thou hast just moved into thy savings — the coffer fills', sign: '→', word: 'saved' },
  fix: { label: 'Recount', sign: '±', word: 'recount' },
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayLabel = (date) => {
  const d = new Date(`${date}T12:00:00`);
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

// one line of the day book, with its × to strike it out
function entryRow(e, index) {
  const k = KINDS[e.kind];
  const amount = e.kind === 'fix' ? `${e.amount < 0 ? '−' : '+'}${money(Math.abs(e.amount))}` : `${k.sign} ${money(e.amount)}`;
  return `<div class="deed tr-entry tr-${e.kind}">
      <span class="deed-date">${k.label}</span>
      <span class="deed-text">${e.note ? esc(e.note) : e.kind === 'fix' ? 'savings recounted' : ''}</span>
      <span class="deed-tag">${amount}</span>
      <button type="button" class="tr-strike" data-unlog="${index}" title="Strike this entry out" aria-label="Strike this entry out">×</button>
    </div>`;
}

function renderLedger(t) {
  const now = new Date();
  const today = todayStr(now);
  const thisMonth = monthKey(now);
  const hasGoal = t.goal > 0;
  const pct = hasGoal ? Math.min(100, (t.current / t.goal) * 100) : 0;
  const left = hasGoal ? Math.max(0, t.goal - t.current) : 0;
  const from = shownPct ?? pct;
  const tally = monthTally(thisMonth, t.log);

  // ---- the hoard at a glance ----
  const recountForm =
    openForm === 'count'
      ? `<div class="tr-inline" data-card>
          ${field('data-count-amount', 'Recount', 'what thy savings account truly shows — a correction, it never wins a goal', t.current)}
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
            ? `<b>The goal is reached!</b> The clerk declares it won when ${monthName(thisMonth)} closes.`
            : `<b>${Math.floor(pct)}%</b> of the way · <b>${money(left)}</b> to go`
        }</span>
        <span>${left > 0 ? paceLine(left, t.pledge, now) || 'set a monthly pledge to see how long the road is' : ''}</span>
      </div>
      <div class="tr-prize" data-prize>Winning this goal earns <b>${CONFIG.rewards.goalXp} Intelligence XP</b>.
      </div>`
    : '';

  const monthMeter =
    t.pledge > 0
      ? `<div class="tr-month${tally.saved >= t.pledge ? ' kept' : ''}">
          <div class="tr-month-head">
            <span>${monthName(thisMonth)}&#8217;s pledge</span>
            <span>${
              tally.saved >= t.pledge
                ? `kept — ${money(tally.saved)} saved`
                : tally.saved > 0
                  ? `${money(tally.saved)} of ${money(t.pledge)} saved`
                  : `${money(t.pledge)} to save — nothing yet`
            }</span>
          </div>
          <div class="xpbar treasury"><div style="width:${Math.min(100, (tally.saved / t.pledge) * 100)}%"></div></div>
        </div>`
      : '';

  const reckonedRun = running(t.rolls, (r) => r.verdict !== 'unreckoned');
  const fatRun = running(t.rolls, (r) => r.verdict === 'fat');
  const badges = [
    reckonedRun >= 2 ? `${reckonedRun} months kept running` : '',
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
          <button type="button" class="tr-quiet" data-count-open>Recount</button>
        </div>
      </div>
    </div>
    ${recountForm}
    ${track}
    ${monthMeter}
    ${badges.length ? `<div class="tr-badges">${badges.map((b) => `<span>${b}</span>`).join('')}</div>` : ''}`;

  // ---- the next goal, once one is won ----
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

  // ---- today: the day book ----
  const indexed = t.log.map((e, i) => [e, i]);
  const todays = indexed.filter(([e]) => e.date === today);
  const logForm = KINDS[openForm] && openForm !== 'fix'
    ? `<div class="tr-inline" data-card>
        ${field('data-log-amount', KINDS[openForm].label, KINDS[openForm].hint, '', 'number', '20')}
        ${field('data-log-note', 'What for', 'as thou wilt — a word to remember it by', '', 'text', openForm === 'in' ? 'e.g. wages' : openForm === 'out' ? 'e.g. lunch' : 'e.g. to the hoard')}
        <div class="row right"><button type="button" data-form-close>Never mind</button>
        <button type="button" class="primary" data-log-set="${openForm}">Enter it</button></div>
      </div>`
    : '';
  const leftOver = tally.earned - tally.spent;
  const day = `<div class="tr-card tr-day">
      <h2>Today &#8212; ${dayLabel(today)}</h2>
      <p class="muted">Enter money the day it comes or goes. The clerk adds up the month for thee.</p>
      <div class="tr-logbtns">
        ${['in', 'out', 'save'].map((k) => `<button type="button" class="${openForm === k ? 'on' : ''}" data-log-open="${k}">${KINDS[k].button}</button>`).join('')}
      </div>
      ${logForm}
      ${
        todays.length
          ? `<div class="deed-list tr-entries">${todays.map(([e, i]) => entryRow(e, i)).join('')}</div>`
          : '<p class="muted tr-none">Nothing entered today yet.</p>'
      }
      <div class="tr-sums" data-sums>
        <span><i>${monthName(thisMonth)} so far</i></span>
        <span>in <b>${money(tally.earned)}</b></span>
        <span>out <b>${money(tally.spent)}</b></span>
        <span>saved <b>${money(tally.saved)}</b></span>
        ${tally.hasIn || tally.hasOut ? `<span>left over <b class="${leftOver < 0 ? 'neg' : ''}">${leftOver < 0 ? '−' : ''}${money(Math.abs(leftOver))}</b></span>` : ''}
      </div>
    </div>`;

  // ---- last month, as the clerk closed it ----
  const last = t.rolls[t.rolls.length - 1];
  const status = `<div class="tr-card tr-status">
      ${
        last
          ? `<div class="tr-outcome">
              ${seal(last.verdict, 62)}
              <div>
                <h2>${monthName(last.month)} — ${VERDICTS[last.verdict].name}</h2>
                <p>${outcome(last, t)}</p>
              </div>
            </div>`
          : ''
      }
      <p class="muted">On the 1st of ${monthName(nextMonthKey(thisMonth))} the clerk closes ${monthName(thisMonth)} by himself,
      from what thou hast entered — nothing to remember, nothing to file.</p>
    </div>`;

  // ---- folded away: this month's earlier days, months past, goals won, the plan, the how-to ----
  const earlier = indexed.filter(([e]) => e.date !== today && e.date.slice(0, 7) === thisMonth).reverse();
  const byDay = [];
  for (const [e, i] of earlier) {
    if (!byDay.length || byDay[byDay.length - 1].date !== e.date) byDay.push({ date: e.date, rows: [] });
    byDay[byDay.length - 1].rows.push(entryRow(e, i));
  }
  const monthBook = earlier.length
    ? fold(
        'book',
        `Earlier in ${monthName(thisMonth)} <i>(${earlier.length} ${earlier.length === 1 ? 'entry' : 'entries'})</i>`,
        byDay.map((d) => `<div class="tr-dayhead">${dayLabel(d.date)}</div><div class="deed-list tr-entries">${d.rows.join('')}</div>`).join('')
      )
    : '';

  const rollRows = [...t.rolls]
    .slice(-12)
    .reverse()
    .map((r) => {
      const v = VERDICTS[r.verdict] ?? VERDICTS.unreckoned;
      const figures =
        r.verdict === 'unreckoned'
          ? 'nothing was entered'
          : [
              Number.isFinite(r.earned) ? `in ${money(r.earned)} · out ${money(r.spent)}` : '',
              `saved ${money(r.saved)}`,
              `savings ${money(r.counted)}`,
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
       <li><b>A goal and a pledge.</b> Name what thou art saving for, and what thou wilt put into savings each month.</li>
       <li><b>Enter money the day it moves.</b> Money in, money out, or money put into savings — a few seconds a day. Putting money into savings fills the coffer at once.</li>
       <li><b>The clerk closes each month himself.</b> On the 1st he adds up the month just ended and seals it:
         <b>fat</b> (${VERDICTS.fat.means}), <b>held</b> (${VERDICTS.held.means}) or <b>bled</b> (${VERDICTS.bled.means}). A month with nothing entered is left unreckoned.</li>
       <li><b>Goals are won when a month closes</b> with thy savings at the goal. A goal won earns <b>${CONFIG.rewards.goalXp} Intelligence XP</b>. Then thou namest the next.</li>
     </ol>
     <p class="muted">Enter both money in and money out and the clerk judges the month by them; enter neither and he judges by whether thy savings grew.
     A mistaken entry is struck out with its ×. If thy account says otherwise, Recount.</p>
     <p class="muted">Real money, on thy honor. Game coins never enter here, and the Treasury pays no coins. Its one reward is the
     ${CONFIG.rewards.goalXp} Intelligence XP for a goal won — and a saving deed posted at the Quest Board earns virtue like any other.</p>`
  );

  body.innerHTML = `${hero}${nextGoal}${day}${status}${monthBook}${months}${won}${plan}${how}`;
  coinDrop = false;

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

  // ---- the little forms: an entry, or a recount ----
  const toggleForm = (which) => {
    openForm = openForm === which ? null : which;
    focusFirst = true;
    renderTreasury();
  };
  for (const b of body.querySelectorAll('[data-log-open]')) b.addEventListener('click', () => toggleForm(b.dataset.logOpen));
  q('[data-count-open]').addEventListener('click', () => toggleForm('count'));
  q('[data-form-close]')?.addEventListener('click', () => toggleForm(openForm));
  if (focusFirst) q('.tr-inline input')?.focus();
  focusFirst = false;

  q('[data-log-set]')?.addEventListener('click', (ev) => {
    const kind = ev.currentTarget.dataset.logSet;
    const amount = Number(q('[data-log-amount]').value);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast('The clerk waits — how much?', 'grim');
      return;
    }
    logMoney(kind, amount, q('[data-log-note]').value);
    openForm = null;
    sfx.coin();
    if (kind !== 'save') {
      toast(kind === 'in' ? `${money(amount)} in — entered.` : `${money(amount)} out — entered.`, '');
      renderTreasury();
      return;
    }
    const after = getState().treasury;
    const afterPct = after.goal > 0 ? (after.current / after.goal) * 100 : 0;
    coinDrop = true;
    const toGo = after.goal - after.current;
    toast(
      after.goal > 0
        ? toGo > 0
          ? `${money(amount)} into savings — ${money(toGo)} to go.`
          : `${money(amount)} into savings — the goal is reached!`
        : `${money(amount)} into savings.`,
      'gold'
    );
    const passed = QUARTERS.filter((n) => pct < n && afterPct >= n).pop();
    if (passed && afterPct < 100) {
      toast(`${QUARTER_WORDS[passed]} of the way to ${esc(after.name || 'the goal')}!`, 'gold');
    }
    const savedNow = monthTally(thisMonth, after.log).saved;
    if (after.pledge > 0 && tally.saved < after.pledge && savedNow >= after.pledge) {
      toast(`${monthName(thisMonth)}’s pledge is kept.`, 'gold');
    }
    renderTreasury();
  });

  for (const b of body.querySelectorAll('[data-unlog]')) {
    b.addEventListener('click', () => {
      const gone = unlogMoney(Number(b.dataset.unlog));
      if (gone) toast(`Struck out: ${KINDS[gone.kind].label.toLowerCase()} ${money(Math.abs(gone.amount))}.`, '');
      renderTreasury();
    });
  }

  q('[data-count-set]')?.addEventListener('click', () => {
    const raw = q('[data-count-amount]').value.trim();
    const count = Number(raw);
    if (raw === '' || !Number.isFinite(count) || count < 0) {
      toast('The clerk squints — that is no figure.', 'grim');
      return;
    }
    recount(count);
    openForm = null;
    toast(`Thy savings are set at ${money(count)}.`, 'gold');
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
