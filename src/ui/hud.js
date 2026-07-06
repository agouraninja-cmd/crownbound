import { CONFIG } from '../state/config.js';

const el = (id) => document.getElementById(id);

let hpFill, staminaFill, coinCount, rankEl, streakCount, flameIcon, prompt;
let lastPrompt = null;

export function initHud() {
  hpFill = el('hp-fill');
  staminaFill = el('stamina-fill');
  coinCount = el('coin-count');
  rankEl = el('hud-rank');
  streakCount = el('streak-count');
  flameIcon = el('flame-icon');
  prompt = el('interact-prompt');
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
