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

export function setHp(current, max) {
  hpFill.style.width = `${Math.max(0, (current / max) * 100)}%`;
}

export function setStamina(current, cap) {
  staminaFill.style.width = `${Math.max(0, (current / cap) * 100)}%`;
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
