// The Proving Ground's commands — what the test world's command line can do.
//
// Each entry in COMMANDS is one command:
//   name     the word that is typed
//   also     other words that mean the same (optional)
//   group    the heading it is listed under by `help`
//   usage    how it is typed, shown by `help`
//   about    one line of what it does, shown by `help`
//   run(args, game)   does it. `args` are the words typed after the name.
//            Return the line to show, or call fail('…') to refuse.
//
// TO ADD A COMMAND, add an entry. Two things are to hand:
//   getState()  the save itself. Edit it, then commit('coins') (or 'stats',
//               'stamina', 'quests', 'farm', 'shop', 'chest', 'streak') so it
//               is stored and the HUD and the world follow.
//   game        main.js's handle on the running game: player, world, rouse(),
//               moveTo(x, z), applyPurchases(), abed().
// Prefer the game's own functions (addXp, completeDaily, drainStamina …) to
// editing by hand where one exists — then the command tests the real rule.
import { CONFIG, rankForTotalLevels } from '../state/config.js';
import { LAYOUT } from '../scene/layout.js';
import { todayStr, yesterdayStr, weekStartStr, monthStartStr } from '../state/dates.js';
import {
  getState, commit, wipeSave, copyTrueSave, STAT_NAMES, addXp, totalLevels,
  staminaCap, drainStamina, dailyDoneToday, dailyDeeds,
  postDaily, completeDaily, postWeekly, completeWeekly, postMonthly, completeMonthly,
  FARM_JOBS, farmJob, workFarmRow,
} from '../state/state.js';
import { passDays, setHour, realClock, clockMoved, reloadWith, worldUrl } from './proving.js';

// a command refused: the line is shown to the player, nothing else happens
export class Refusal extends Error {}
export function fail(line) {
  throw new Refusal(line);
}

// ---------- reading what was typed ----------

// "wis", "wisdom", "Wisd" → 'wis'
function virtueKey(word) {
  const w = (word ?? '').toLowerCase();
  const hit = Object.entries(STAT_NAMES).find(([key, name]) => w === key || (w.length >= 3 && name.toLowerCase().startsWith(w)));
  if (!hit) fail(`Which virtue? ${Object.entries(STAT_NAMES).map(([k, n]) => `${k} (${n})`).join(', ')}.`);
  return hit[0];
}

function wholeNumber(word, what, min, max) {
  const n = Number(word);
  if (!Number.isInteger(n) || n < min || n > max) fail(`${what} must be a whole number from ${min} to ${max}.`);
  return n;
}

// "7", "7:30", "19:45", "7pm", "7:30pm" → { h, m }, or null if it is no time
function clockTime(word) {
  const t = /^(\d{1,2})(?::(\d{2}))?(am|pm)?$/i.exec(word ?? '');
  if (!t) return null;
  let h = Number(t[1]);
  const m = Number(t[2] ?? 0);
  const half = t[3]?.toLowerCase();
  if (half && (h < 1 || h > 12)) return null;
  if (half === 'pm' && h < 12) h += 12;
  if (half === 'am' && h === 12) h = 0;
  return h <= 23 && m <= 59 ? { h, m } : null;
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

// the test world's day and hour, as words
export function clockText() {
  const now = new Date();
  const day = now.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });
  const hour = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return `${day}, ${hour}`;
}

// ---------- shared pieces ----------

// The rank follows the levels. addXp(…, 0) is the game's own recount: it sets
// the rank and, the first time it reaches King, holds the Coronation. Brought
// below King again, the crown is taken back so it can be won a second time.
function recountRank() {
  const s = getState();
  if (rankForTotalLevels(totalLevels()) !== 'King') s.coronationAt = null;
  addXp('ath', 0);
  return `${s.rank}, ${totalLevels()} virtue levels in all`;
}

const POST = { daily: postDaily, weekly: postWeekly, monthly: postMonthly };
const COMPLETE = { daily: completeDaily, weekly: completeWeekly, monthly: completeMonthly };

// A quest posted (if none is waiting) and completed by the game's own rule.
// Several virtues may be named — the XP is shared among them. The daily takes
// the first of today's deeds still waiting, and posts another if none is.
function completeQuest(kind, args) {
  const keys = args.length ? args.map(virtueKey) : ['ath'];
  if (kind === 'daily') {
    if (!dailyDeeds().some((d) => !d.completed) && !postDaily('A test deed')) {
      fail(`All ${CONFIG.quests.dailyMax} of today’s deeds are done. “reset daily” clears the board.`);
    }
  } else {
    const quest = getState().quests[kind];
    if (quest.completed) fail(`The ${kind} is already done. “reset ${kind}” makes it new again.`);
    if (!quest.text) POST[kind]('A test deed');
  }
  const won = COMPLETE[kind](keys);
  const xp = won.gains.map((g) => `+${g.xp} ${STAT_NAMES[g.stat]} XP`).join(', ');
  const ups = won.gains
    .filter((g) => g.levelUps.length)
    .map((g) => ` ${STAT_NAMES[g.stat]} is now level ${g.levelUps.at(-1)}.`)
    .join('');
  const which = kind === 'daily' ? `A daily deed is done (${dailyDeeds().filter((d) => d.completed).length} today)` : `The ${kind} is done`;
  return `${which}: ${xp}, +${won.coins} coins.${ups}`;
}

const freshQuest = {
  daily: () => ({ date: todayStr(), deeds: [] }),
  weekly: () => ({ text: '', completed: false, weekStart: weekStartStr() }),
  monthly: () => ({ text: '', completed: false, monthStart: monthStartStr() }),
};

function resetQuests(kinds) {
  const s = getState();
  for (const kind of kinds) s.quests[kind] = freshQuest[kind]();
  // with the daily undone, the day's cap is the lower one again
  s.stamina.current = Math.min(s.stamina.current, staminaCap());
  commit('quests', 'stamina');
}

// where `tp` sets him down: a clear spot in front of each thing
function places(world) {
  const door = world.door;
  return {
    spawn: LAYOUT.playerSpawn,
    fire: { x: -4.6, z: 4.5 }, // near enough that he sits down if left standing
    home: { x: door.x + 1.3, z: door.z }, // the doorstep
    bed: world.wakeSpot, // indoors, beside the cot
    board: { x: 4, z: -0.5 },
    tome: { x: -2.2, z: -4.3 },
    charter: { x: 0.2, z: 1.5 },
    exchequer: { x: 4.4, z: 3.3 },
    cart: { x: 1.3, z: 9.1 },
    dummy: { x: -7.2, z: 8.5 },
    granary: { x: 7.5, z: 7.5 }, // the rats' yard, close enough to be noticed
    field: { x: LAYOUT.field.x, z: LAYOUT.field.z }, // the middle of the miller's strip
  };
}

const item = (id) => CONFIG.shop.items.find((i) => i.id === id);
const itemIds = () => CONFIG.shop.items.map((i) => i.id);

function giveItem(id) {
  const s = getState();
  const it = item(id);
  if (it.once && !s.shop.owned.includes(id)) s.shop.owned.push(id);
  if (it.category === 'hand') s.chest.wielded = id; // like a purchase: straight to hand
  if (id === 'loaf') s.chest.loaves = Math.min(CONFIG.chest.larderCap, s.chest.loaves + 1);
}

function takeItem(id) {
  const s = getState();
  s.shop.owned = s.shop.owned.filter((owned) => owned !== id);
  if (s.chest.wielded === id) s.chest.wielded = 'stick';
  if (id === 'loaf') s.chest.loaves = Math.max(0, s.chest.loaves - 1);
}

// ---------- the commands ----------

export const COMMANDS = [
  // ----- body -----
  {
    name: 'stamina',
    group: 'Body',
    usage: 'stamina full | <number>',
    about: 'Fill the stamina pool, or set it. 0 empties it: he walks home to bed.',
    run([word = 'full'], game) {
      const s = getState();
      const n = word === 'full' ? staminaCap() : wholeNumber(word, 'Stamina', 0, 999999);
      if (n === 0) {
        drainStamina(s.stamina.current); // the game's own emptying — spent for the day
        return 'Stamina is spent. He walks himself home.';
      }
      s.stamina = { current: n, date: todayStr() }; // a fresh pool carries no `spent` mark
      commit('stamina');
      game.rouse(); // up again, if he had gone to bed spent
      return `Stamina is ${n} (today's cap is ${staminaCap()}).`;
    },
  },
  {
    name: 'heal',
    group: 'Body',
    usage: 'heal',
    about: 'Full health.',
    run(_, game) {
      const p = game.player;
      p.hp = p.maxHp;
      p.onHpChange(p.hp, p.maxHp);
      return `Health is full (${p.maxHp}).`;
    },
  },
  {
    name: 'hp',
    group: 'Body',
    usage: 'hp <number>',
    about: 'Set health. 0 kills him (he wakes on his cot).',
    run([word], game) {
      const p = game.player;
      const n = wholeNumber(word, 'Health', 0, p.maxHp);
      if (n === 0) {
        p.takeDamage(p.hp, p.pos.x, p.pos.z);
        return 'He falls.';
      }
      p.hp = n;
      p.onHpChange(p.hp, p.maxHp);
      return `Health is ${n} of ${p.maxHp}.`;
    },
  },

  // ----- virtues and rank -----
  {
    name: 'rank',
    group: 'Virtues and rank',
    usage: `rank ${CONFIG.ranks.map((r) => r.title.toLowerCase()).join(' | ')}`,
    about: 'Set the four virtues level so they add up to that rank. King holds the Coronation.',
    run([word]) {
      const title = (word ?? '').toLowerCase();
      const rank = CONFIG.ranks.find((r) => r.title.toLowerCase() === title);
      const ladder = CONFIG.ranks.map((r) => r.title).join(', ');
      if (title === 'sage') fail(`The Sage is the village's adviser, not a rank. The ranks are: ${ladder}.`);
      if (!rank) fail(`No such rank. The ranks are: ${ladder}.`);
      const s = getState();
      const keys = Object.keys(STAT_NAMES);
      keys.forEach((key, i) => {
        const level = Math.floor(rank.totalLevels / keys.length) + (i < rank.totalLevels % keys.length ? 1 : 0);
        s.stats[key] = { level, xp: 0 };
      });
      return `Thou art ${recountRank()}.`;
    },
  },
  {
    name: 'level',
    group: 'Virtues and rank',
    usage: 'level <virtue> <number>',
    about: 'Set one virtue’s level (ath, int, wis, inf). The rank follows.',
    run([virtue, word]) {
      const key = virtueKey(virtue);
      const level = wholeNumber(word, 'A level', 1, 99);
      getState().stats[key] = { level, xp: 0 };
      return `${STAT_NAMES[key]} is level ${level}. Rank: ${recountRank()}.`;
    },
  },
  {
    name: 'xp',
    group: 'Virtues and rank',
    usage: 'xp <virtue> <number>',
    about: 'Award XP to a virtue, as a deed would.',
    run([virtue, word]) {
      const key = virtueKey(virtue);
      const n = wholeNumber(word, 'XP', 1, 100000);
      addXp(key, n);
      const st = getState().stats[key];
      return `+${n} ${STAT_NAMES[key]} XP: level ${st.level}, ${st.xp} XP toward the next.`;
    },
  },

  // ----- purse and fire -----
  {
    name: 'coins',
    group: 'Purse and fire',
    usage: 'coins <number> | +<number> | -<number>',
    about: 'Set the purse, or add to it / take from it.',
    run([word]) {
      const s = getState();
      const signed = /^[+-]\d+$/.test(word ?? '');
      const n = wholeNumber(signed ? word.slice(1) : word, 'Coins', 0, 9999999);
      s.coins = Math.max(0, signed ? s.coins + (word[0] === '-' ? -n : n) : n);
      commit('coins');
      return `The purse holds ${s.coins} coins.`;
    },
  },
  {
    name: 'streak',
    group: 'Purse and fire',
    usage: 'streak <days>',
    about: 'Set the daily streak — the campfire burns to match.',
    run([word]) {
      const s = getState();
      const n = wholeNumber(word, 'A streak', 0, 9999);
      s.streak.current = n;
      s.streak.best = Math.max(s.streak.best, n);
      // as if the last deed were yesterday's: today's daily makes it n + 1,
      // and the streak outlives a reload
      if (n > 0 && !dailyDoneToday()) s.lastQuestDate = yesterdayStr();
      commit('streak');
      return `The streak stands at ${plural(n, 'day')}.`;
    },
  },

  // ----- quests -----
  {
    name: 'daily',
    group: 'Quests',
    usage: 'daily [virtue …]',
    about: 'Complete one of today’s daily deeds (posting a test deed if none is waiting). Name two virtues to share the XP.',
    run: (args) => completeQuest('daily', args),
  },
  {
    name: 'weekly',
    group: 'Quests',
    usage: 'weekly [virtue]',
    about: 'Complete the weekly bounty.',
    run: (args) => completeQuest('weekly', args),
  },
  {
    name: 'monthly',
    group: 'Quests',
    usage: 'monthly [virtue]',
    about: 'Complete the monthly campaign.',
    run: (args) => completeQuest('monthly', args),
  },

  // ----- the clock -----
  {
    name: 'nextday',
    also: ['tomorrow'],
    group: 'The clock',
    usage: 'nextday [nights] [hour]',
    about: 'A night passes (or several) and the game reloads on the new day. “nextday 7:00” wakes at seven.',
    run(args) {
      let nights = 1;
      let hour = null;
      for (const word of args) {
        const t = word.includes(':') || /[ap]m$/i.test(word) ? clockTime(word) : null;
        if (t) hour = t;
        else nights = wholeNumber(word, 'Nights', 1, 3650);
      }
      passDays(nights);
      if (hour) setHour(hour.h, hour.m);
      reloadWith(`${nights === 1 ? 'A night passes' : `${nights} nights pass`}. It is ${clockText()}.`);
      return 'The night passes…';
    },
  },
  {
    name: 'time',
    group: 'The clock',
    usage: 'time [hour] | real',
    about: 'Set the hour (7, 7:30, 9pm) — sky and clock both. “time real” returns to the real day and hour.',
    run([word], game) {
      if (word === undefined) {
        const { days, ms } = clockMoved();
        const moved = days !== 0 || Math.abs(ms) > 60000;
        return `It is ${clockText()}${moved ? ` — the clock has been moved (${plural(days, 'day')} on).` : ' — the real clock.'}`;
      }
      if (word === 'real') {
        realClock();
        reloadWith('The clock is the real one again.');
        return 'Back to the real day and hour…';
      }
      const t = clockTime(word);
      if (!t) fail('What hour? Try 7, 7:30, 19:45 or 9pm — or “time real”.');
      setHour(t.h, t.m);
      game.world.sky.refresh();
      return `It is ${clockText()}.`;
    },
  },

  {
    name: 'day',
    also: ['daytime'],
    group: 'The clock',
    usage: 'day',
    about: 'Make it day: the hour moves to noon, sky and clock both. (“time real” returns to the real hour.)',
    run(_args, game) {
      setHour(12, 0);
      game.world.sky.refresh();
      return `The sun stands high. It is ${clockText()}.`;
    },
  },

  // ----- the village -----
  {
    name: 'tp',
    also: ['goto'],
    group: 'The village',
    usage: 'tp <place>',
    about: 'Stand somewhere else: spawn, fire, home, bed, board, tome, charter, exchequer, cart, dummy, granary, field.',
    run([word], game) {
      const all = places(game.world);
      const spot = all[(word ?? '').toLowerCase()];
      if (!spot) fail(`Where? ${Object.keys(all).join(', ')}.`);
      if (game.abed()) fail('He is abed, spent. “stamina full” gets him up first.');
      game.moveTo(spot.x, spot.z);
      return `He stands at the ${word.toLowerCase()}.`;
    },
  },
  {
    name: 'market',
    group: 'The village',
    usage: 'market on | off | auto',
    about: 'Bring the chapman’s cart, send it away, or leave it to the weekday. Reloads.',
    run([word]) {
      if (!['on', 'off', 'auto'].includes(word)) fail('market on, market off, or market auto.');
      const url = new URL(location.href);
      if (word === 'auto') url.searchParams.delete('market');
      else url.searchParams.set('market', word === 'on' ? '1' : '0');
      reloadWith({ on: 'The chapman is called to the village.', off: 'The chapman is sent on his way.', auto: 'The chapman keeps his own days again.' }[word], url.toString());
      return 'Word is sent to the chapman…';
    },
  },
  {
    name: 'give',
    group: 'The village',
    usage: `give <ware> | all`,
    about: `Own one of the chapman’s wares without paying: ${itemIds().join(', ')}.`,
    run([word], game) {
      const ids = word === 'all' ? itemIds() : [word];
      if (!ids.every(item)) fail(`No such ware. The wares are: ${itemIds().join(', ')}.`);
      ids.forEach(giveItem);
      commit('shop', 'chest');
      game.applyPurchases();
      return word === 'all' ? 'Every ware on the cart is thine.' : `Thou hast ${item(word).name}.`;
    },
  },
  {
    name: 'take',
    group: 'The village',
    usage: 'take <ware> | all',
    about: 'Un-own a ware, so it can be bought again.',
    run([word], game) {
      const ids = word === 'all' ? itemIds() : [word];
      if (!ids.every(item)) fail(`No such ware. The wares are: ${itemIds().join(', ')}.`);
      ids.forEach(takeItem);
      if (word === 'all') getState().chest.loaves = 0;
      commit('shop', 'chest');
      game.applyPurchases();
      return word === 'all' ? 'The wares are back on the cart.' : `${item(word).name} is back on the cart.`;
    },
  },
  {
    name: 'farm',
    group: 'The village',
    usage: `farm ${FARM_JOBS.join(' | ')} | grow | finish`,
    about: 'Set the job the miller’s strip is owed; “grow” lets a night pass on it; “finish” works every ridge left today.',
    run([word]) {
      const s = getState();
      if (word === 'grow') {
        s.farm.workedOn = null;
        commit('farm');
        return `A night passes on the strip. The job owed: ${farmJob()}.`;
      }
      if (word === 'finish') {
        if (!farmJob()) fail('Today’s job is done. “farm grow” lets the night pass on the strip.');
        let paid = null;
        for (let row = 0; row < CONFIG.farm.rows; row++) paid = workFarmRow(row) ?? paid;
        return `The strip is worked: ${paid.job} done, +${paid.coins} coins.`;
      }
      const stage = FARM_JOBS.indexOf(word);
      if (stage < 0) fail(`farm ${FARM_JOBS.join(', ')}, grow or finish.`);
      s.farm = { stage, done: [], workedOn: null, part: {} };
      commit('farm');
      return `The strip waits to be worked: ${word}.`;
    },
  },

  // ----- starting over -----
  {
    name: 'reset',
    group: 'Starting over',
    usage: 'reset stamina | hp | daily | weekly | monthly | quests | dummy | rats | farm | world',
    about: 'Put one thing back as it began. “reset world” starts the whole test world over.',
    run([word], game) {
      const s = getState();
      switch (word) {
        case 'stamina':
          return COMMANDS.find((c) => c.name === 'stamina').run(['full'], game);
        case 'hp':
          return COMMANDS.find((c) => c.name === 'heal').run([], game);
        case 'daily':
        case 'weekly':
        case 'monthly':
          resetQuests([word]);
          return word === 'daily' ? 'Today’s deeds are taken down — the board is bare.' : `The ${word} slot is empty again.`;
        case 'quests':
          resetQuests(['daily', 'weekly', 'monthly']);
          return 'The daily, weekly and monthly slots are empty again.';
        case 'dummy':
          s.counters.dummyHits = 0;
          commit();
          return 'The training dummy pays its XP afresh.';
        case 'rats':
          s.counters.ratsKilled = 0;
          commit();
          reloadWith('The rats are back in the granary.');
          return 'The rats return…';
        case 'farm':
          s.farm = { stage: 0, done: [], workedOn: null, part: {} };
          commit('farm');
          return 'The strip lies in stubble, waiting to be tilled.';
        case 'world':
          wipeSave();
          realClock();
          reloadWith('The test world begins anew. (Thy own commands are kept.)');
          return 'The test world is begun again…';
        default:
          return fail('Reset what? stamina, hp, daily, weekly, monthly, quests, dummy, rats, farm or world.');
      }
    },
  },
  {
    name: 'copy',
    group: 'Starting over',
    usage: 'copy',
    about: 'Replace this test world with a copy of thy true save. The true save itself is not touched.',
    run() {
      if (!copyTrueSave()) fail('There is no true save in this browser to copy.');
      realClock(); // a copy of real days belongs on the real clock
      reloadWith('A copy of thy true save. The original is untouched.');
      return 'Copying the true save…';
    },
  },
  {
    name: 'newgame',
    also: ['beginning', 'start'],
    group: 'Starting over',
    usage: 'newgame',
    about: 'Begin the game from nothing, as a newcomer does: a blank test save, the real clock, and the opening from its title. Thy own commands are kept.',
    run() {
      wipeSave();
      realClock();
      const url = new URL(location.href);
      url.searchParams.set('intro', '1'); // the opening, which the test world never owes by itself
      reloadWith('A new game, begun from nothing.', url.toString());
      return 'Back to the very beginning…';
    },
  },
  {
    name: 'intro',
    also: ['opening'],
    group: 'Starting over',
    usage: 'intro',
    about: 'Play the opening a newcomer is shown — the dream, the waking, the oath. Reloads; nothing is lost.',
    run(args, game) {
      if (game.abed()) fail('He is abed, spent. “stamina full” gets him up first.');
      const url = new URL(location.href);
      url.searchParams.set('intro', '1'); // main.js plays it once and takes the word off the address
      reloadWith('The opening has been played.', url.toString());
      return 'Back to the very beginning…';
    },
  },
  {
    name: 'leave',
    group: 'Starting over',
    usage: 'leave',
    about: 'Return to the true realm.',
    run() {
      location.href = worldUrl(false);
      return 'Returning to the true realm…';
    },
  },
];
