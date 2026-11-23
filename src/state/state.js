import { CONFIG, rankForTotalLevels } from './config.js';
import { PROVING, SAVE_KEY } from '../proving/proving.js';
import { todayStr, yesterdayStr, weekStartStr, monthStartStr, monthKey, prevMonthKey, nextMonthKey } from './dates.js';

export const STAT_NAMES = {
  ath: 'Athleticism',
  int: 'Intelligence',
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

// Once the stored save has been replaced under this session (a restored
// copy, a wiped test world), the page is about to reload onto it: nothing
// more is written, or a stray step taken meanwhile would put the old save back.
let sealed = false;

// SAVE_KEY is the true save's slot — or the test world's own (proving.js)
export function save() {
  if (sealed) return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
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
  const current = localStorage.getItem(SAVE_KEY);
  if (current) localStorage.setItem(SAVE_KEY + '_prev', current);
  localStorage.setItem(SAVE_KEY, JSON.stringify(parsed));
  sealed = true;
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
      ath: { level: 1, xp: 0 },
      int: { level: 1, xp: 0 },
      wis: { level: 1, xp: 0 },
      inf: { level: 1, xp: 0 },
    },
    coins: 0,
    // real savings: a named cumulative summit, the day book of money in / out / saved,
    // and the monthly rolls the clerk closes from it
    treasury: { name: '', current: 0, goal: 10000, pledge: 0, log: [], rolls: [], conquered: [] },
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
    chest: { wielded: 'stick', loaves: 0 }, // the weapon in hand (the rest lie in the chest) + the larder
    farm: { stage: 0, done: [], workedOn: null }, // the miller's strip: the job owed, the ridges done of it, the day the last job was finished
    coronationAt: null, // set the moment the rank reaches King — the Coronation
    // a save begun from nothing owes its player the opening (never in the test world)
    ...(PROVING ? {} : { introOwed: true }),
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
  if (s.saveVersion === 8) {
    s.saveVersion = 9; // v9: the chest — keep wielding the best weapon owned, as before
  }
  if (s.saveVersion === 9) {
    s.saveVersion = 10; // v10: Strength became Athleticism; Agility made way for Intelligence
    // Strength's standing is Athleticism's; Agility's seat passes to Intelligence
    // (and is emptied by v11, below).
    s.stats = { ath: s.stats.str, int: s.stats.agi, wis: s.stats.wis, inf: s.stats.inf };
    // Old deeds of either bodily virtue (lifting, tennis) were athletic ones.
    for (const h of s.history ?? []) {
      if (h.statTrained === 'str' || h.statTrained === 'agi') h.statTrained = 'ath';
    }
  }
  if (s.saveVersion === 10) {
    s.saveVersion = 11; // v11: Intelligence is a new virtue — it begins at level 1 like any other
    // v10 had seated it at Agility's old level; those levels were never won by
    // the mind, so they are dropped and the rank is counted afresh.
    s.stats.int = { level: 1, xp: 0 };
    s.rank = rankForTotalLevels(Object.values(s.stats).reduce((a, st) => a + st.level, 0));
  }
  if (s.saveVersion === 11) {
    s.saveVersion = 12; // v12: the miller's strip — the field begins fallow
  }
  if (s.saveVersion === 12) {
    s.saveVersion = 13; // v13: the daily money book — coin laid in becomes the month's first entry
    const t = s.treasury ?? {};
    t.log = Object.entries(t.laid ?? {})
      .filter(([, n]) => n > 0)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([month, amount]) => ({ date: `${month}-01`, kind: 'save', amount, note: 'laid in' }));
    delete t.laid;
  }
  // hand-edited or restored saves may miss fields regardless of version
  if (!s.farm) s.farm = { stage: 0, done: [], workedOn: null };
  if (!s.sleep) s.sleep = { retiredAt: null, lastRewardDate: null, wellRestedDate: null };
  if (!s.sleep.log) s.sleep.log = [];
  if (!s.chronicle) s.chronicle = [];
  if (!s.shop) s.shop = { owned: [] };
  if (!s.chest) s.chest = { wielded: bestOwnedWeapon(s.shop.owned), loaves: 0 };
  if (!('coronationAt' in s)) s.coronationAt = null;
  if (!('name' in s.treasury)) s.treasury.name = '';
  if (!('pledge' in s.treasury)) s.treasury.pledge = 0;
  if (!s.treasury.rolls) s.treasury.rolls = [];
  if (!s.treasury.conquered) s.treasury.conquered = [];
  if (!s.treasury.log) s.treasury.log = []; // the day book: entries of months not yet closed
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
  // a body spent for the day stays abed — the boon raises the cap, not the pool
  if (!state.stamina.spent) state.stamina.current = Math.min(state.stamina.current + S.staminaBonus, staminaCap());
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
    state.stamina = { current: staminaCap(), date: today }; // a new day: up from the cot, strength back
  } else if (state.stamina.current <= 0) {
    state.stamina.spent = true; // emptied today before the walk home existed — abed all the same
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
  // the clerk closes every finished month from the day book — nothing to remember, nothing to file
  for (const res of closeMonths()) {
    const v = { fat: 'the hoard grew fat', held: 'held the line', bled: 'the purse bled' }[res.roll.verdict];
    if (v) messages.push({ text: `The clerk has closed ${monthLabel(res.roll.month)} — ${v}.`, style: res.roll.verdict === 'fat' ? 'gold' : '' });
    if (res.conquered) {
      messages.push({ text: `${res.conquered.name} — conquered! +${res.xp} Intelligence XP.`, style: 'gold' });
      for (const lvl of res.levelUps) messages.push({ text: `Intelligence rises to level ${lvl}!`, style: 'gold' });
    }
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

// the keys, in one line: a newcomer's first toast
export const KEYS_LINE = 'WASD walk · Arrows look · Shift run · Space jump · C crouch · Double-tap WASD roll · Click or F swing · E interact';

export function loadState() {
  const raw = localStorage.getItem(SAVE_KEY);
  let messages = [];
  if (!raw) {
    state = defaultState();
    // a newcomer's greeting — the opening says both in its own way, so main.js
    // leaves these out when it plays
    messages.push({ text: 'You wake in a humble clearing. The board awaits.', style: '', greeting: true });
    messages.push({ text: KEYS_LINE, style: '', greeting: true });
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

// ---------- the opening ----------

// A save begun from nothing owes its player the opening (src/ui/intro.js: the
// dream, the waking, the oath). The flag is dropped once that has been played
// through or skipped. A save without it — every older one — owes nothing.
export function introOwed() {
  return state.introOwed === true;
}

export function introDone() {
  if (!state.introOwed) return;
  delete state.introOwed;
  save();
}

// No daily deed has ever been logged: the fire has never once been lit.
export function noDeedYet() {
  return state.streak.best === 0 && !state.history.some((h) => h.type === 'daily');
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

// Spent for the day: the pool ran dry, he walked home to his cot, and play
// resumes on the morrow. Set the moment the pool hits nought; a new day's
// stamina (rollover) clears it — and so does the daily, posted from his bed.
// Nothing else refills a spent pool.
export function staminaSpent() {
  return state.stamina.spent === true;
}

function markIfSpent() {
  if (state.stamina.current <= 0) state.stamina.spent = true;
}

// the legs' toll: takes what it can, down to nought, and never refuses
export function drainStamina(n) {
  const take = Math.min(n, state.stamina.current);
  if (take <= 0) return;
  state.stamina.current -= take;
  markIfSpent();
  save();
  emit('stamina');
}

export function spendStamina(cost) {
  if (state.stamina.current < cost) return false;
  state.stamina.current -= cost;
  markIfSpent();
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
  // the refill (with any Well-Rested bonus) — even from the cot, spent: the
  // deed gets him up again (a fresh pool carries no `spent` flag)
  state.stamina = { current: staminaCap(), date: today };
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

const handItems = () => CONFIG.shop.items.filter((i) => i.category === 'hand');

// before the chest, the best weapon owned was always in hand
function bestOwnedWeapon(owned) {
  let best = { id: 'stick', tier: 0 };
  for (const item of handItems()) if (owned.includes(item.id) && item.tier > best.tier) best = item;
  return best.id;
}

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
  if (id === 'loaf' && state.chest.loaves >= CONFIG.chest.larderCap) return { ok: false, why: 'larder' };
  if (state.coins < item.price) return { ok: false, why: 'coins' };
  state.coins -= item.price;
  if (item.once) state.shop.owned.push(id);
  if (item.category === 'hand') state.chest.wielded = id; // new gear goes straight to hand
  if (id === 'loaf') state.chest.loaves += 1; // bread keeps in the chest's larder
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

// ---------- the chest by the cot ----------

// every weapon the player can take up: the stick, plus whatever gear is owned
export function ownedWeapons() {
  return [CONFIG.chest.stick, ...handItems().filter((i) => ownsItem(i.id))];
}

export function wieldedWeapon() {
  return ownedWeapons().find((w) => w.id === state.chest.wielded) ?? CONFIG.chest.stick;
}

// take up a weapon from the chest; the one in hand goes back in
export function wieldWeapon(id) {
  if (!ownedWeapons().some((w) => w.id === id)) return false;
  state.chest.wielded = id;
  save();
  emit('chest');
  return true;
}

// one loaf out of the larder; the caller heals (state knows nothing of HP)
export function eatLoaf() {
  if (state.chest.loaves <= 0) return false;
  state.chest.loaves -= 1;
  save();
  emit('chest');
  return true;
}

// ---------- the farm (the miller's strip) ----------
// One job per real day, each in its turn: till, sow, tend, reap. A job is
// every ridge in the strip; one left half-done keeps its ridges and is
// finished another day. Nothing spoils — a missed day costs only the day.
// Field work pays coins and nothing else: no virtue is earned in the field.

export const FARM_JOBS = ['till', 'sow', 'tend', 'reap'];

// How a ridge looks at each stage: once this job has been done to it, while
// it waits after a night's growth, and while it waits on the day the last
// job was finished.
const FARM_LOOKS = [
  { done: 'furrow', grown: 'stubble', fresh: 'stook' }, // to be tilled
  { done: 'sown', grown: 'furrow', fresh: 'furrow' }, // to be sown
  { done: 'tended', grown: 'weedy', fresh: 'sown' }, // to be weeded
  { done: 'stook', grown: 'ripe', fresh: 'tended' }, // to be reaped
];

// The job waiting to be worked today, or null once today's is finished (the
// field needs the night). Takes `now` so the smoke suite can pin the clock.
export function farmJob(now = new Date()) {
  return state.farm.workedOn === todayStr(now) ? null : FARM_JOBS[state.farm.stage];
}

// What each ridge looks like, first to last — the field draws itself from this.
export function farmRowLooks(now = new Date()) {
  const f = state.farm;
  const look = FARM_LOOKS[f.stage];
  const waiting = f.workedOn === todayStr(now) ? look.fresh : look.grown;
  return Array.from({ length: CONFIG.farm.rows }, (_, i) => (f.done.includes(i) ? look.done : waiting));
}

// Work one ridge of today's job. Returns null if there is nothing to do
// (no job today, or that ridge is already done), else { job, done, coins }:
// `done` once the last ridge finishes the job, `coins` what the miller pays
// for it. A harvest also lands in history (type 'harvest').
export function workFarmRow(row, now = new Date()) {
  const job = farmJob(now);
  const f = state.farm;
  if (!job || row < 0 || row >= CONFIG.farm.rows || f.done.includes(row)) return null;
  f.done.push(row);

  let coins = 0;
  const done = f.done.length >= CONFIG.farm.rows;
  if (done) {
    coins = job === 'reap' ? CONFIG.farm.harvestPay : CONFIG.farm.wage;
    f.done = [];
    f.stage = (f.stage + 1) % FARM_JOBS.length;
    f.workedOn = todayStr(now);
    state.coins += coins;
    if (job === 'reap') {
      state.history.push({
        date: todayStr(now),
        questText: 'Brought in the wheat from the miller’s strip',
        statTrained: null,
        type: 'harvest',
      });
    }
  }
  save();
  if (done) emit('coins');
  emit('farm');
  return { job, done, coins };
}

// ---------- treasury (the day book and the monthly rolls) ----------
// Real savings, honor system, no game value: the Exchequer is a virtual
// summarized financial statement. Coins and the hoard never mix in either
// direction; its one reward is Intelligence XP for a goal won.
//
// The player keeps a DAY BOOK (`log`): money in, money out and money put into
// savings, entered on the day it happens. When a month is over the clerk
// closes it himself on the next load (closeMonths): the month's entries are
// summed onto one roll and judged, so nobody has to remember last month.

const MONTH_LABELS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthLabel = (key) => MONTH_LABELS[Number(key.split('-')[1]) - 1];

// the kinds of entry: money that came in, money spent, money moved into
// savings — and 'fix', a recount's correction to the savings (a signed delta)
export const LOG_KINDS = ['in', 'out', 'save'];

// raw setter for the opening questions (savings today) and the goal line.
// Deliberately NO conquest check here — a summit falls only when a month is
// closed (see closeMonths), never to a typo in the goal box.
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

// Enter money in the day book. 'save' grows the savings at once, so the coffer
// answers the deed on the day it is done. Returns the entry, or null.
export function logMoney(kind, amount, note = '', now = new Date()) {
  if (!LOG_KINDS.includes(kind) || !(amount > 0)) return null;
  const t = state.treasury;
  const entry = { date: todayStr(now), kind, amount };
  if (note && note.trim()) entry.note = note.trim().slice(0, 60);
  t.log.push(entry);
  if (kind === 'save') t.current += amount;
  save();
  emit('treasury');
  return entry;
}

// the old name for putting money into savings (kept for the smoke suite's hooks)
export const layIn = (amount, now = new Date()) => logMoney('save', amount, '', now);

// Strike out an entry made by mistake (by its place in the log); what it did to
// the savings is undone with it. Only open months are in the log at all.
export function unlogMoney(index) {
  const t = state.treasury;
  const entry = t.log[index];
  if (!entry) return null;
  t.log.splice(index, 1);
  if (entry.kind === 'save' || entry.kind === 'fix') t.current = Math.max(0, t.current - entry.amount);
  save();
  emit('treasury');
  return entry;
}

// "My account really shows N": set the savings, and note the difference in the
// day book so the month it happened in carries it when it is closed.
export function recount(n, now = new Date()) {
  const t = state.treasury;
  const delta = Math.max(0, n) - t.current;
  if (delta === 0) return 0;
  t.log.push({ date: todayStr(now), kind: 'fix', amount: delta });
  t.current += delta;
  save();
  emit('treasury');
  return delta;
}

// A month's sums from the day book (`YYYY-MM`). hasIn / hasOut say whether any
// income or spending was entered at all — the verdict uses them only when both were.
export function monthTally(month, log = state.treasury.log) {
  const tally = { earned: 0, spent: 0, saved: 0, fixed: 0, hasIn: false, hasOut: false, entries: 0 };
  for (const e of log) {
    if (e.date.slice(0, 7) !== month) continue;
    tally.entries++;
    if (e.kind === 'in') (tally.earned += e.amount), (tally.hasIn = true);
    else if (e.kind === 'out') (tally.spent += e.amount), (tally.hasOut = true);
    else if (e.kind === 'save') tally.saved += e.amount;
    else if (e.kind === 'fix') tally.fixed += e.amount;
  }
  return tally;
}

// was anything entered in the day book today?
export function loggedToday(now = new Date()) {
  const today = todayStr(now);
  return state.treasury.log.some((e) => e.date === today && e.kind !== 'fix');
}

// What the savings stood at when a month was last closed (null if never) —
// the mark a month with no income and spending entered is judged against.
export function lastCounted() {
  const rolls = state.treasury.rolls;
  for (let i = rolls.length - 1; i >= 0; i--) {
    if (Number.isFinite(rolls[i].counted)) return rolls[i].counted;
  }
  return null;
}

// Pure verdict on a month's numbers, judged against the pledge (exported for
// the smoke suite):
//   'fat'   put at least the pledged amount into savings (needs a pledge set)
//   'held'  lost no ground — spent no more than came in
//   'bled'  lost ground — spent more than came in
// Without both income and spending the month is judged on the savings alone:
// bled if they stand lower than at the last close (`before`), held otherwise.
export function judgeReckoning({ earned, spent, saved, counted, before }, pledge) {
  if (pledge > 0 && saved >= pledge) return 'fat';
  if (Number.isFinite(earned) && Number.isFinite(spent)) return earned - spent >= 0 ? 'held' : 'bled';
  return Number.isFinite(before) && counted < before ? 'bled' : 'held';
}

// The months owed a close: every finished month after the last roll (or, on a
// ledger with no rolls yet, from the first month with an entry), oldest first.
export function monthsToClose(now = new Date()) {
  const t = state.treasury;
  const thisMonth = monthKey(now);
  const last = t.rolls[t.rolls.length - 1];
  let m = last ? nextMonthKey(last.month) : t.log.map((e) => e.date.slice(0, 7)).sort()[0];
  const owed = [];
  for (let guard = 0; m && m < thisMonth && guard < 240; guard++) {
    owed.push(m);
    m = nextMonthKey(m);
  }
  return owed;
}

// Close every finished month from the day book. A month with entries becomes a
// roll of its sums and is judged; one with none lands as 'unreckoned' (like an
// unwitnessed night). Its entries leave the log — the roll keeps the sums.
// A goal falls only here: when a closed month finds the savings at it.
// Returns [{ roll, conquered, xp, levelUps }] for the months closed.
export function closeMonths(now = new Date()) {
  const t = state.treasury;
  const results = [];
  for (const month of monthsToClose(now)) {
    const tally = monthTally(month);
    // the savings as the month ended: today's, less what later months moved
    const later = t.log
      .filter((e) => e.date.slice(0, 7) > month && (e.kind === 'save' || e.kind === 'fix'))
      .reduce((a, e) => a + e.amount, 0);
    const counted = Math.max(0, t.current - later);
    let roll;
    if (!tally.entries) {
      roll = { month, verdict: 'unreckoned' };
    } else {
      const full = tally.hasIn && tally.hasOut;
      roll = {
        month,
        ...(full ? { earned: tally.earned, spent: tally.spent } : {}),
        saved: tally.saved,
        counted,
      };
      roll.verdict = judgeReckoning({ ...roll, before: lastCounted() }, t.pledge);
    }
    t.rolls.push(roll);
    t.log = t.log.filter((e) => e.date.slice(0, 7) !== month);

    let conquered = null;
    if (t.goal > 0 && Number.isFinite(roll.counted) && roll.counted >= t.goal) {
      conquered = { name: t.name || 'the unnamed hoard', goal: t.goal, conqueredAt: new Date().toISOString() };
      t.conquered.push(conquered);
      t.goal = 0;
      t.name = '';
      state.history.push({
        date: todayStr(),
        questText: `${conquered.name} — the hoard reached ${conquered.goal.toLocaleString()}`,
        statTrained: 'int',
        type: 'treasury',
      });
    }
    save();
    // the one thing the Treasury ever pays: a goal won is a great deed of judgment, and earns
    // Intelligence XP (never coins). At most one goal a month — one close, one goal.
    const xp = conquered ? CONFIG.rewards.goalXp : 0;
    const levelUps = conquered ? addXp('int', xp) : [];
    results.push({ roll, conquered, xp, levelUps });
  }
  if (results.length) {
    save();
    emit('treasury');
  }
  return results;
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

// ---------- the Proving Ground (the test world, ?test=1) ----------
// Its console sets things no rule of the game does — a level, a streak, a
// full purse. A command edits getState() by hand, then calls commit() to save
// and to tell the listeners which parts moved. All three are dead in the
// true world: no code path can hand-edit the real save.

export function commit(...reasons) {
  if (!PROVING) return;
  save();
  for (const reason of reasons) emit(reason);
}

// the test world begun again: its save is thrown away (the caller reloads)
export function wipeSave() {
  if (!PROVING) return;
  localStorage.removeItem(SAVE_KEY);
  sealed = true;
}

// the true save copied over the test world's (the caller reloads). The true
// save is only read. Returns false if there is none to copy.
export function copyTrueSave() {
  if (!PROVING) return false;
  return importSave(localStorage.getItem(CONFIG.saveKey) ?? '');
}
