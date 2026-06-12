import { CONFIG, rankForTotalLevels } from './config.js';
import { todayStr, yesterdayStr, weekStartStr } from './dates.js';

export const STAT_NAMES = {
  str: 'Strength',
  agi: 'Agility',
  wis: 'Wisdom',
  inf: 'Influence',
};

let state = null;
const listeners = new Set();

export function getState() {
  return state;
}

export function onChange(fn) {
  listeners.add(fn);
}

function emit(reason) {
  for (const fn of listeners) fn(reason, state);
}

export function save() {
  localStorage.setItem(CONFIG.saveKey, JSON.stringify(state));
}

function defaultState(now = new Date()) {
  const today = todayStr(now);
  return {
    saveVersion: CONFIG.saveVersion,
    createdAt: now.toISOString(),
    lastPlayedAt: now.toISOString(),
    lastQuestDate: null,
    rank: 'Peasant',
    stats: {
      str: { level: 1, xp: 0 },
      agi: { level: 1, xp: 0 },
      wis: { level: 1, xp: 0 },
      inf: { level: 1, xp: 0 },
    },
    coins: 0,
    treasury: { current: 0, goal: 10000 },
    streak: { current: 0, best: 0 },
    quests: {
      daily: { text: '', completed: false, date: today },
      weekly: { text: '', completed: false, weekStart: weekStartStr(now) },
      epic: { text: '', progressPct: 0, deadline: CONFIG.coronation },
    },
    history: [],
    daysPlayed: 1,
    stamina: { current: CONFIG.stamina.baseCap, date: today },
    counters: { date: today, dummyHits: 0, ratsKilled: 0 },
  };
}

// future save versions translate old shapes here
function migrate(s) {
  return s;
}

// Detect date changes since last play. Returns flavor messages for the player.
function rollover() {
  const today = todayStr();
  const messages = [];

  if (state.counters.date !== today) {
    state.daysPlayed += 1;
    state.counters = { date: today, dummyHits: 0, ratsKilled: 0 };
  }

  if (state.quests.daily.date !== today) {
    state.quests.daily = { text: '', completed: false, date: today };
  }

  const ws = weekStartStr();
  if (state.quests.weekly.weekStart !== ws) {
    state.quests.weekly = { text: '', completed: false, weekStart: ws };
  }

  if (
    state.streak.current > 0 &&
    state.lastQuestDate !== today &&
    state.lastQuestDate !== yesterdayStr()
  ) {
    state.streak.current = 0;
    messages.push({ text: 'The fire died in the night.', style: 'grim' });
  }

  if (state.stamina.date !== today) {
    state.stamina = { current: staminaCap(), date: today };
  }

  return messages;
}

export function loadState() {
  const raw = localStorage.getItem(CONFIG.saveKey);
  let messages = [];
  if (!raw) {
    state = defaultState();
    messages.push({ text: 'You wake in a humble clearing. The board awaits.', style: '' });
    messages.push({ text: 'WASD walk · Shift run · Space jump · C crouch · Double-tap WASD roll · Click swing · E interact', style: '' });
  } else {
    try {
      state = migrate(JSON.parse(raw));
      messages = rollover();
    } catch {
      // a corrupt save should never brick the game
      state = defaultState();
      messages.push({ text: 'Your chronicle was illegible; a fresh page begins.', style: 'grim' });
    }
  }
  state.lastPlayedAt = new Date().toISOString();
  save();
  return { messages };
}

// ---------- stats, coins ----------

export function xpToNext(statKey) {
  return CONFIG.xpPerLevel * state.stats[statKey].level;
}

export function totalLevels() {
  return Object.values(state.stats).reduce((a, s) => a + s.level, 0);
}

export function addXp(statKey, amount) {
  const st = state.stats[statKey];
  st.xp += amount;
  const levelUps = [];
  while (st.xp >= CONFIG.xpPerLevel * st.level) {
    st.xp -= CONFIG.xpPerLevel * st.level;
    st.level += 1;
    levelUps.push(st.level);
  }
  state.rank = rankForTotalLevels(totalLevels());
  save();
  emit('stats');
  return levelUps;
}

export function addCoins(n) {
  state.coins += n;
  save();
  emit('coins');
}

// ---------- stamina ----------

export function staminaCap() {
  const q = state.quests.daily;
  return q.completed && q.date === todayStr() ? CONFIG.stamina.questCap : CONFIG.stamina.baseCap;
}

export function spendStamina(cost) {
  if (state.stamina.current < cost) return false;
  state.stamina.current -= cost;
  save();
  emit('stamina');
  return true;
}

// ---------- quests ----------

export function postDaily(text) {
  const t = text.trim();
  if (!t) return;
  state.quests.daily = { text: t, completed: false, date: todayStr() };
  save();
  emit('quests');
}

export function completeDaily(statKey) {
  const q = state.quests.daily;
  if (!q.text || q.completed) return null;
  const today = todayStr();
  q.completed = true;

  if (state.lastQuestDate === yesterdayStr()) state.streak.current += 1;
  else if (state.lastQuestDate !== today) state.streak.current = 1;
  state.streak.best = Math.max(state.streak.best, state.streak.current);
  state.lastQuestDate = today;

  state.coins += CONFIG.rewards.daily.coins;
  state.stamina = { current: CONFIG.stamina.questCap, date: today };
  state.history.push({ date: today, questText: q.text, statTrained: statKey, type: 'daily' });
  const levelUps = addXp(statKey, CONFIG.rewards.daily.xp); // addXp saves + emits
  emit('quests');
  return { levelUps, xp: CONFIG.rewards.daily.xp, coins: CONFIG.rewards.daily.coins };
}

export function postWeekly(text) {
  const t = text.trim();
  if (!t) return;
  state.quests.weekly = { text: t, completed: false, weekStart: weekStartStr() };
  save();
  emit('quests');
}

export function completeWeekly(statKey) {
  const q = state.quests.weekly;
  if (!q.text || q.completed) return null;
  q.completed = true;
  state.coins += CONFIG.rewards.weekly.coins;
  state.history.push({
    date: todayStr(),
    questText: q.text,
    statTrained: statKey,
    type: 'weekly',
  });
  const levelUps = addXp(statKey, CONFIG.rewards.weekly.xp);
  emit('quests');
  return { levelUps, xp: CONFIG.rewards.weekly.xp, coins: CONFIG.rewards.weekly.coins };
}

export function setEpicText(text) {
  state.quests.epic.text = text.trim();
  save();
  emit('quests');
}

export function setEpicProgress(pct) {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  if (clamped === state.quests.epic.progressPct) return;
  state.quests.epic.progressPct = clamped;
  state.history.push({
    date: todayStr(),
    questText: state.quests.epic.text,
    statTrained: null,
    type: 'epic',
    progressPct: clamped,
  });
  save();
  emit('quests');
}

// ---------- treasury ----------

export function setTreasury(current, goal) {
  state.treasury.current = Math.max(0, current);
  state.treasury.goal = Math.max(1, goal);
  save();
  emit('treasury');
}

// ---------- combat-day counters (dummy XP cap, rat respawns) ----------

export function dummyHitXp() {
  const xp = CONFIG.dummy.xpForHit(state.counters.dummyHits);
  state.counters.dummyHits += 1;
  save();
  return xp;
}

export function recordRatKill() {
  state.counters.ratsKilled += 1;
  state.coins += CONFIG.rewards.ratCoins;
  save();
  emit('coins');
  return CONFIG.rewards.ratCoins;
}
