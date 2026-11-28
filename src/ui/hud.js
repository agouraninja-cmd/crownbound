import { CONFIG } from '../state/config.js';

const el = (id) => document.getElementById(id);

let hpFill, staminaFill, coinCount, rankEl, streakCount, flameIcon, prompt, waymark;
let lastPrompt = null;
let lastWaymark = null;

export function initHud() {
  hpFill = el('hp-fill');
  staminaFill = el('stamina-fill');
  coinCount = el('coin-count');
  rankEl = el('hud-rank');
  streakCount = el('streak-count');
  flameIcon = el('flame-icon');
  prompt = el('interact-prompt');
  waymark = el('waymark');
  waymark.innerHTML = '<i>◂</i><span></span><i>▸</i>'; // an arrow either side; the stylesheet shows the one that leads
}

let lastHpPct = -1;
let lastStPct = -1;
let lastStamina = -1;
let lastStreak = null;

export function setHp(current, max) {
  const pct = Math.round(Math.max(0, (current / max) * 100));
  if (pct === lastHpPct) return;
  lastHpPct = pct;
  hpFill.style.width = `${pct}%`;
  // a wound worth worrying about throbs; the dead don't (respawn refills)
  hpFill.parentElement.classList.toggle('low', pct > 0 && pct <= 30);
}

export function setStamina(current, cap) {
  if (current !== lastStamina) {
    lastStamina = current;
    // too spent to swing: the bar grays out until strength returns
    staminaFill.parentElement.classList.toggle('spent', current < CONFIG.stamina.attackCost);
  }
  const pct = Math.round(Math.max(0, (current / cap) * 100));
  if (pct === lastStPct) return;
  lastStPct = pct;
  staminaFill.style.width = `${pct}%`;
}

export function setCoins(n) {
  coinCount.textContent = String(n);
}

export function setRank(title) {
  rankEl.textContent = title;
}

export function setStreak(days) {
  streakCount.textContent = String(days);
  flameIcon.classList.toggle('dead', days === 0);
  // a grown streak pops — but not the first paint of a loaded save
  if (lastStreak !== null && days > lastStreak) {
    const row = streakCount.parentElement;
    row.classList.remove('grew');
    void row.offsetWidth; // restart the animation
    row.classList.add('grew');
  }
  lastStreak = days;
}

export function showPrompt(html) {
  if (html === lastPrompt) return;
  lastPrompt = html;
  if (html) {
    prompt.innerHTML = html;
    prompt.classList.remove('hidden');
  } else {
    prompt.classList.add('hidden');
  }
}

// screen placement, set every frame while visible; null = anchor is behind
// the camera, so the tag ducks out of sight without losing its content
export function placePrompt(pos) {
  if (!pos) {
    prompt.style.visibility = 'hidden';
    return;
  }
  prompt.style.visibility = '';
  prompt.style.transform = `translate(-50%, -100%) translate(${Math.round(pos[0])}px, ${Math.round(pos[1])}px)`;
}

// The waymark: a tag that shows a newcomer where to go next (main.js, the cold
// fire). null puts it away.
export function showWaymark(text) {
  if (text === lastWaymark) return;
  lastWaymark = text;
  if (text) waymark.querySelector('span').textContent = text;
  waymark.classList.toggle('hidden', !text);
}

// Placed every frame while shown: over its target when that is in view
// (pos = [x, y] in screen px), else pinned to the side of the screen to turn
// toward (edge = 'left' | 'right'), where an arrow leads the words.
export function placeWaymark(pos, edge) {
  waymark.dataset.edge = edge ?? '';
  if (pos) {
    waymark.style.transform = `translate(-50%, -100%) translate(${Math.round(pos[0])}px, ${Math.round(pos[1])}px)`;
  } else {
    const y = Math.round(window.innerHeight * 0.42);
    waymark.style.transform =
      edge === 'left'
        ? `translate(18px, ${y}px)`
        : `translate(-100%, 0) translate(${window.innerWidth - 18}px, ${y}px)`;
  }
}
