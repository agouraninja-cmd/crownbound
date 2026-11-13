import { CONFIG, rankForTotalLevels } from './config.js';
import { todayStr, yesterdayStr, weekStartStr, monthStartStr, prevMonthKey, nextMonthKey } from './dates.js';

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

// ---------- backup (the Scribe) ----------

export function exportSave() {
  return JSON.stringify(state, null, 2);
}

function parseSave(text) {
  try {
    const s = JSON.parse(text);
    if (s && typeof s === 'object' && typeof s.saveVersion === 'number' && s.stats && s.quests) {
      return s;
    }
  } catch {}
  return null;
}

export function isSaveText(text) {
  return parseSave(text) !== null;
}

// Writes the copy and returns true; the caller reloads the page so the normal
// load path (migrate + rollover) vets it like any stored save. The replaced
// save is kept under `<saveKey>_prev` as a last resort against a bad copy.
export function importSave(text) {
  const parsed = parseSave(text);
  if (!parsed) return false;
  const current = localStorage.getItem(CONFIG.saveKey);
  if (current) localStorage.setItem(CONFIG.saveKey + '_prev', current);
  localStorage.setItem(CONFIG.saveKey, JSON.stringify(parsed));
  return true;
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
    // real savings: a named cumulative summit plus the monthly reckoning rolls
    treasury: { name: '', current: 0, goal: 10000, pledge: 0, rolls: [], conquered: [] },
    streak: { current: 0, best: 0 },
    quests: {
      daily: { text: '', completed: false, date: today },
      weekly: { text: '', completed: false, weekStart: weekStartStr(now) },
      monthly: { text: '', completed: false, monthStart: monthStartStr(now) },
      epic: { text: '', progressPct: 0 },
    },
    history: [],
    chronicle: [], // the Chronicler's weekly entries { week, text, writtenAt }, append-only
    daysPlayed: 1,
    stamina: { current: CONFIG.stamina.baseCap, date: today },
    counters: { date: today, dummyHits: 0, ratsKilled: 0 },
    sleep: { retiredAt: null, lastRewardDate: null, wellRestedDate: null, log: [] },
    shop: { owned: [] }, // ids of one-time purchases from the chapman
    coronationAt: null, // set the moment the rank reaches King — the Coronation
  };
}

// future save versions translate old shapes here
function migrate(s) {
  if (s.saveVersion === 1) {
    s.quests.monthly = { text: '', completed: false, monthStart: monthStartStr() };
    s.saveVersion = 2;
  }
  if (s.saveVersion === 2) {
    s.saveVersion = 3;
  }
  if (s.saveVersion === 3) {
    s.saveVersion = 4; // v4: the sleep ledger log
  }
  if (s.saveVersion === 4) {
    s.saveVersion = 5; // v5: the chapman's shop
  }
  if (s.saveVersion === 5) {
    s.saveVersion = 6; // v6: the Coronation is earned at King, not scheduled
    delete s.quests.epic.deadline;
  }
  if (s.saveVersion === 6) {
    s.saveVersion = 7; // v7: the monthly reckoning at the Exchequer
  }
  if (s.saveVersion === 7) {
    s.saveVersion = 8; // v8: the Chronicler's weekly chronicle
  }
  // hand-edited or restored saves may miss fields regardless of version
  if (!s.sleep) s.sleep = { retiredAt: null, lastRewardDate: null, wellRestedDate: null };
  if (!s.sleep.log) s.sleep.log = [];
  if (!s.chronicle) s.chronicle = [];
  if (!s.shop) s.shop = { owned: [] };
  if (!('coronationAt' in s)) s.coronationAt = null;
  if (!('name' in s.treasury)) s.treasury.name = '';
  if (!('pledge' in s.treasury)) s.treasury.pledge = 0;
  if (!s.treasury.rolls) s.treasury.rolls = [];
  if (!s.treasury.conquered) s.treasury.conquered = [];
  return s;
}

// ---------- sleep (the cot) ----------

// Pure verdict on a recorded bedtime, exported so the smoke suite can test the
// clock rules against fixed dates instead of the real wall clock:
//   'reward'  slept ≥ minHours and back by wakeByHour — grant Well-Rested
//   'late'    slept enough but the morning is gone — clear it, no reward
//   'pending' not enough hours yet (an evening session) — keep it
//   'stale'   too old to be last night — clear it silently
//   'none'    no bedtime recorded
export function evaluateSleep(retiredAtIso, now = new Date()) {
  if (!retiredAtIso) return 'none';
  const S = CONFIG.sleep;
  const hours = (now.getTime() - new Date(retiredAtIso).getTime()) / 3600e3;
  if (hours < S.minHours) return 'pending';
  if (hours > S.maxHours) return 'stale';
  const byTheBell =
    now.getHours() < S.wakeByHour || (now.getHours() === S.wakeByHour && now.getMinutes() === 0);
  return byTheBell ? 'reward' : 'late';
}

// the cot marks the night; the next load judges it (see evaluateSleep)
export function recordBedtime() {
  state.sleep.retiredAt = new Date().toISOString();
  save();
}

// Grants the Well-Rested boon, once per day. Called by the load path; exported
// so the smoke suite can exercise the grant without faking the wall clock.
export function applySleepReward() {
  const today = todayStr();
  if (state.sleep.lastRewardDate === today) return false;
  const S = CONFIG.sleep;
  state.sleep.lastRewardDate = today;
  state.sleep.wellRestedDate = today; // staminaCap() reads this for the rest of the day
  state.coins += S.coins;
  state.stamina.current = Math.min(state.stamina.current + S.staminaBonus, staminaCap());
  state.history.push({
    date: today,
    questText: 'Rose with the dawn, well-rested',
    statTrained: 'wis',
    type: 'sleep',
  });
  addXp('wis', S.wisXp); // saves + emits
  emit('sleep');
  return true;
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

  const ms = monthStartStr();
  if (state.quests.monthly.monthStart !== ms) {
    state.quests.monthly = { text: '', completed: false, monthStart: ms };
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

  // judge last night's bedtime against the dawn (after the stamina reset,
  // so the Well-Rested bonus lands in today's pool)
  const verdict = evaluateSleep(state.sleep.retiredAt);
  if (verdict !== 'none' && verdict !== 'pending') {
    // every judged night lands in the ledger — the full log is kept (a year
    // is ~20 KB; the v2 Chronicler will want it), the board shows the last 7
    state.sleep.log.push({
      bed: state.sleep.retiredAt,
      wake: verdict === 'stale' ? null : new Date().toISOString(),
      verdict: verdict === 'reward' ? 'dawn' : verdict === 'late' ? 'late' : 'unwitnessed',
    });
    state.sleep.retiredAt = null;
  }
  if (verdict === 'reward' && applySleepReward()) {
    const S = CONFIG.sleep;
    messages.push({
      text: `Well-Rested — a full night, up with the dawn. (+${S.wisXp} Wisdom XP, +${S.coins}c, +${S.staminaBonus} stamina)`,
      style: 'gold',
    });
  } else if (verdict === 'late') {
    messages.push({ text: 'You slept long past the dawn bell. No boon today.', style: 'grim' });
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
  // the crown is earned, not scheduled: reaching King IS the Coronation
  const crowned = state.rank === 'King' && !state.coronationAt;
  if (crowned) {
    state.coronationAt = new Date().toISOString();
    state.history.push({
      date: todayStr(),
      questText: 'The Coronation — crowned sovereign of the realm',
      statTrained: null,
      type: 'coronation',
    });
  }
  save();
  emit('stats');
  if (crowned) emit('coronation');
  return levelUps;
}

export function addCoins(n) {
  state.coins += n;
  save();
  emit('coins');
}

// ---------- stamina ----------

export function dailyDoneToday() {
  const q = state.quests.daily;
  return q.completed && q.date === todayStr();
}

export function staminaCap() {
  const base = dailyDoneToday() ? CONFIG.stamina.questCap : CONFIG.stamina.baseCap;
  const rested = state.sleep.wellRestedDate === todayStr() ? CONFIG.sleep.staminaBonus : 0;
  return base + rested;
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
  state.stamina = { current: staminaCap(), date: today }; // includes Well-Rested bonus if earned
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

export function postMonthly(text) {
  const t = text.trim();
  if (!t) return;
  state.quests.monthly = { text: t, completed: false, monthStart: monthStartStr() };
  save();
  emit('quests');
}

export function completeMonthly(statKey) {
  const q = state.quests.monthly;
  if (!q.text || q.completed) return null;
  q.completed = true;
  state.coins += CONFIG.rewards.monthly.coins;
  state.history.push({
    date: todayStr(),
    questText: q.text,
    statTrained: statKey,
    type: 'monthly',
  });
  const levelUps = addXp(statKey, CONFIG.rewards.monthly.xp);
  emit('quests');
  return { levelUps, xp: CONFIG.rewards.monthly.xp, coins: CONFIG.rewards.monthly.coins };
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

// ---------- the shop (the chapman's cart) ----------

function rankIndex(title) {
  return CONFIG.ranks.findIndex((r) => r.title === title);
}

export function ownsItem(id) {
  return state.shop.owned.includes(id);
}

// Why a purchase was refused, or { ok: true, item } on success. Purchases land
// in history (type 'purchase') so the future Chronicler can gossip about them.
export function buyItem(id) {
  const item = CONFIG.shop.items.find((i) => i.id === id);
  if (!item) return { ok: false, why: 'unknown' };
  if (item.once && ownsItem(id)) return { ok: false, why: 'owned' };
  if (item.minRank && rankIndex(state.rank) < rankIndex(item.minRank)) return { ok: false, why: 'rank' };
  if (state.coins < item.price) return { ok: false, why: 'coins' };
  state.coins -= item.price;
  if (item.once) state.shop.owned.push(id);
  state.history.push({
    date: todayStr(),
    questText: `Bought ${item.name} from the chapman`,
    statTrained: null,
    type: 'purchase',
  });
  save();
  emit('coins');
  emit('shop');
  return { ok: true, item };
}

// ---------- treasury (the monthly reckoning) ----------
// Real savings, honor system, no game value: the Exchequer is a virtual
// summarized financial statement. Filing a reckoning pays no XP and no coins —
// coins and the hoard never mix in either direction.

// corrections outside the ritual: fix the count or move the summit line.
// Deliberately NO conquest check here — a summit falls only to a filed
// reckoning (see fileReckoning), never to a typo in the goal box.
export function setTreasury(current, goal) {
  state.treasury.current = Math.max(0, current);
  state.treasury.goal = Math.max(0, goal); // 0 = no summit raised (post-conquest)
  save();
  emit('treasury');
}

// the standing commitment the monthly verdict is judged against
export function setPledge(n) {
  state.treasury.pledge = Math.max(0, Math.round(n));
  save();
  emit('treasury');
}

// Pure verdict on a month's numbers, judged against the pledge (exported for
// the smoke suite):
//   'fat'   laid in the hoard at least the pledged amount (needs a pledge set)
//   'held'  kept ≥ 0 — spent no more than was earned
//   'bled'  spent more than was earned
export function judgeReckoning({ earned, spent, saved }, pledge) {
  if (pledge > 0 && saved >= pledge) return 'fat';
  return earned - spent >= 0 ? 'held' : 'bled';
}

// The month a reckoning is owed for — the one that just ended — or null once
// it has been filed. One roll per month, ever.
export function reckoningDue(now = new Date()) {
  const due = prevMonthKey(now);
  return state.treasury.rolls.some((r) => r.month === due) ? null : due;
}

// File the month's statement. Skipped months between the last roll and this
// one land as 'unreckoned' (like unwitnessed nights) rather than vanishing.
// `counted` is the reconciliation: what the accounts truly say, and it becomes
// the new hoard total. Returns { roll, conquered } or null if nothing is due.
export function fileReckoning({ earned, spent, saved, counted }, now = new Date()) {
  const due = reckoningDue(now);
  if (!due) return null;
  const t = state.treasury;

  const last = t.rolls[t.rolls.length - 1];
  if (last) {
    let m = nextMonthKey(last.month);
    for (let guard = 0; m < due && guard < 240; guard++) {
      t.rolls.push({ month: m, verdict: 'unreckoned' });
      m = nextMonthKey(m);
    }
  }

  const roll = {
    month: due,
    earned: Math.max(0, earned),
    spent: Math.max(0, spent),
    saved: Math.max(0, saved),
    counted: Math.max(0, counted),
    verdict: judgeReckoning({ earned, spent, saved }, t.pledge),
  };
  t.rolls.push(roll);
  t.current = roll.counted;

  // conquest: the clerk declares a summit taken only at a filing. The fallen
  // summit is archived and the goal cleared until the next one is raised.
  let conquered = null;
  if (t.goal > 0 && t.current >= t.goal) {
    conquered = { name: t.name || 'the unnamed hoard', goal: t.goal, conqueredAt: new Date().toISOString() };
    t.conquered.push(conquered);
    t.goal = 0;
    t.name = '';
    state.history.push({
      date: todayStr(),
      questText: `${conquered.name} — the hoard reached ${conquered.goal.toLocaleString()}`,
      statTrained: null,
      type: 'treasury',
    });
  }

  save();
  emit('treasury');
  return { roll, conquered };
}

// raise the next summit after a conquest (or rename/re-aim the current one)
export function setSummit(name, goal) {
  state.treasury.name = name.trim();
  state.treasury.goal = Math.max(1, Math.round(goal));
  save();
  emit('treasury');
}

// ---------- the chronicle (the Chronicler's weekly entries) ----------

// Entries arrive oldest-first (chronicler.js works through owed weeks in
// order), so a plain push keeps the journal chronological.
export function addChronicleEntry(week, text) {
  state.chronicle.push({ week, text, writtenAt: new Date().toISOString() });
  save();
  emit('chronicle');
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
