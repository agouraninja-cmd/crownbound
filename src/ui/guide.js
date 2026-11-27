// The Village Charter: the rules of the realm, posted by the path.
// Every number here is read from config.js at render time, so re-tuning the
// game can never leave the charter lying. Only the prose is fixed.
import { CONFIG } from '../state/config.js';

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const FIRE_LINES = {
  embers: 'cold embers',
  small: 'a small flame',
  healthy: 'a healthy fire',
  roaring: 'a roaring blaze',
};

// streak ranges recomputed from the tier table
function fireRows() {
  const tiers = [...CONFIG.campfireTiers].sort((a, b) => a.minStreak - b.minStreak);
  return tiers
    .map((t, i) => {
      const next = tiers[i + 1];
      const range = !next
        ? `${t.minStreak}+ days`
        : t.minStreak === next.minStreak - 1
          ? `${t.minStreak} day${t.minStreak === 1 ? '' : 's'}`
          : `${t.minStreak}–${next.minStreak - 1} days`;
      return `<div class="kv"><span>${range}</span><span class="v">${FIRE_LINES[t.name] ?? t.name}</span></div>`;
    })
    .join('');
}

// walk the diminishing-returns curve until it hits zero
function dummyRows() {
  const rows = [];
  let start = 0;
  let xp = CONFIG.dummy.xpForHit(0);
  for (let h = 1; h <= 500 && xp > 0; h++) {
    const v = CONFIG.dummy.xpForHit(h);
    if (v === xp) continue;
    rows.push(`<div class="kv"><span>blows ${start + 1}–${h}</span><span class="v">${xp} Athleticism XP each</span></div>`);
    start = h;
    xp = v;
  }
  rows.push(`<div class="kv"><span>beyond that</span><span class="v">nothing till the morrow</span></div>`);
  return rows.join('');
}

export function renderGuide(guideBody) {
  const R = CONFIG.rewards;
  const ST = CONFIG.stamina;
  const SL = CONFIG.sleep;
  const king = CONFIG.ranks[CONFIG.ranks.length - 1];

  const rankRows = CONFIG.ranks
    .map(
      (r, i) =>
        `<div class="kv"><span>${r.title}</span><span class="v">${
          i === 0 ? 'where all begin' : `${r.totalLevels} virtue levels`
        }</span></div>`
    )
    .join('');

  const controls = [
    ['W A S D', 'walk'],
    ['Shift', 'sprint'],
    ['Space', 'jump — the road is ever free'],
    ['C (held)', 'crouch'],
    ['double-tap a direction', `dodge-roll (${ST.dodgeCost} stamina)`],
    ['left click or F', `swing thy stick (${ST.attackCost} stamina)`],
    ['mouse &amp; wheel', 'turn the eye, draw it near — a touchpad glides and pinches the same'],
    ['← → ↑ ↓', 'no mouse? the arrows turn the eye and tilt it'],
    ['− and =', 'draw the eye back, and near'],
    ['E', 'the one key — the nearest thing in reach answers'],
    ['M', `the map of ${CONFIG.realm.kingdom}, with ${CONFIG.realm.village} upon it`],
    ['Esc', 'close a panel, free the mouse'],
  ]
    .map(([k, v]) => `<div class="kv"><span><b>${k}</b></span><span class="v">${v}</span></div>`)
    .join('');

  // the chapman's section draws itself only while a shop exists in the config
  const marketSection = CONFIG.shop
    ? `<div class="sheet-section">
        <h2>The Chapman&#8217;s Cart</h2>
        <p class="muted">A peddler parks by the path on ${CONFIG.shop.marketWeekdays
          .map((d) => WEEKDAY_NAMES[d])
          .join(', ')}. He deals in comfort and swagger for coin — but virtue is not for sale,
        at any price. No XP, no streak, no stamina changes hands at his cart.</p>
        ${
          CONFIG.chest
            ? `<p class="muted">His bread keeps in the larder of the chest by thy cot — up to
              ${CONFIG.chest.larderCap} loaves — and a loaf eaten there mends every wound. The chest
              also keeps thy spare weapons: thou carriest one, and choosest which. The peg rack by
              thy door (E) takes the one in hand, to walk about empty-handed; E again takes it down.</p>`
            : ''
        }
      </div>`
    : '';

  // likewise the field: drawn only while there is a farm in the config
  const FM = CONFIG.farm;
  const farmSection = FM
    ? `<div class="sheet-section">
        <h2>The Miller&#8217;s Strip</h2>
        <p class="muted">Out past the granary to the north-east, at the end of a cart track and
        behind a rail fence, lies the miller&#8217;s wheat strip, and honest work on it is paid in coin. One job a day, each in
        its turn — till, sow, weed, reap — and a job is all ${FM.rows} ridges, E at each. The crop
        grows only across the days thou turnest up; a day missed costs nothing but the day.</p>
        <div class="kv"><span>a day&#8217;s tilling, sowing or weeding</span><span class="v">${FM.wage} coins</span></div>
        <div class="kv"><span>the wheat brought in</span><span class="v">${FM.harvestPay} coins</span></div>
        <p class="muted" style="margin-top:8px">The field fills the purse and never a virtue:
        those are won only out in the world.</p>
      </div>`
    : '';

  guideBody.innerHTML = `
    <div class="sheet-section">
      <p class="quest-text" style="text-align:center">Real life levels thee up;
      the game is where thou feelest it.</p>
      <p class="muted">Deeds are done out in the world — lifting, learning, building, saving —
      and logged at the Quest Board in thine own words. Nothing is verified. The realm trusts
      thy word, and is worth exactly what thy word is worth.</p>
    </div>
    <div class="sheet-section">
      <h2>The Law of the Land</h2>
      <p class="muted">Post a quest at the board in thine own words. Do the real deed under the
      real sky. Return, mark it complete, and name the virtue it trained — the reward lands there.
      The game never invents tasks for thee.</p>
    </div>
    <div class="sheet-section">
      <h2>Rewards of the Realm</h2>
      <div class="kv"><span>Daily Quest</span><span class="v">+${R.daily.xp} XP · +${R.daily.coins} coins · refills stamina (even abed, spent) · feeds the fire</span></div>
      <div class="kv"><span>Weekly Bounty</span><span class="v">+${R.weekly.xp} XP · +${R.weekly.coins} coins · resets Monday</span></div>
      <div class="kv"><span>Monthly Campaign</span><span class="v">+${R.monthly.xp} XP · +${R.monthly.coins} coins · resets the 1st</span></div>
      <div class="kv"><span>The Epic Quest</span><span class="v">the year&#8217;s great work, reckoned by thy hand</span></div>
    </div>
    <div class="sheet-section">
      <h2>The Four Virtues</h2>
      <p class="muted">Athleticism, Intelligence, Wisdom, Influence — each begins at level 1, and the next
      level always costs ${CONFIG.xpPerLevel} × thy current level in XP. Thy rank is the sum of
      all four, and the Coronation comes the moment the crown is earned:</p>
      ${rankRows}
      <p class="muted">${king.title} at ${king.totalLevels} levels is the Coronation itself —
      not given, not scheduled. Earned.</p>
    </div>
    <div class="sheet-section">
      <h2>The Streak &amp; the Fire</h2>
      <p class="muted">Completing the daily quest claims the day. Miss a full day and the fire
      dies in the night — the streak returns to nought. Until today&#8217;s deed is done the flame
      gutters low, a living reminder; it swells the moment the deed is logged.
      Stand still beside it ${CONFIG.player.sitDelay} heartbeats and thou sittest down to warm thy
      hands; any step raises thee again.</p>
      ${fireRows()}
    </div>
    <div class="sheet-section">
      <h2>Stamina</h2>
      <p class="muted">A daily pool spent by arms and legs alike — every step wears on it, a sprint
      the more; only a leap is free. The cap stands at ${ST.baseCap}; complete the daily quest and the
      pool refills, the cap rising to ${ST.questCap} till nightfall. Spend it to the last and thy day
      is done: thy legs carry thee home to thy cot, and thou mayst play again on the morrow. From thy
      bed the Quest Board, the Tome and the Exchequer stay open — and if today&#8217;s deed is yet
      undone, post it there: the pool refills and thou art up again.</p>
      <div class="kv"><span>a swing of the stick</span><span class="v">${ST.attackCost} stamina</span></div>
      <div class="kv"><span>a dodge-roll</span><span class="v">${ST.dodgeCost} stamina</span></div>
      <div class="kv"><span>walking</span><span class="v">${ST.walkDrain} stamina a breath (each second)</span></div>
      <div class="kv"><span>sprinting</span><span class="v">${ST.sprintDrain} stamina a breath (each second)</span></div>
    </div>
    <div class="sheet-section">
      <h2>Arms &amp; the Yard</h2>
      <p class="muted">The training dummy pays a trickle of Athleticism for honest sweat,
      less with every blow:</p>
      ${dummyRows()}
      <p class="muted" style="margin-top:8px">${CONFIG.rats.count} rats haunt the granary yard;
      the miller pays ${R.ratCoins} coins a tail, and the slain return on the morrow. Shouldst thou
      fall, thou wakest on thy cot at home, whole, having lost nothing but pride.</p>
    </div>
    <div class="sheet-section">
      <h2>Sleep &amp; the Dawn</h2>
      <p class="muted">E at thy cot mends thee whole and marks the night; next opening the game
      marks the morning. ${SL.minHours} hours abed and back by ${SL.wakeByHour} o&#8217;clock earns
      the Well-Rested boon — +${SL.wisXp} Wisdom XP, +${SL.coins} coins, +${SL.staminaBonus} stamina
      cap for the day, once each day. The Sleep Ledger on the hovel wall remembers every judged night.</p>
    </div>
    <div class="sheet-section">
      <h2>The Two Purses</h2>
      <div class="kv"><span>Coins</span><span class="v">${FM ? 'quest spoils, rat bounties, field wages' : 'quest spoils and rat bounties'}</span></div>
      <div class="kv"><span>The Treasury</span><span class="v">thy true savings, kept at the Exchequer</span></div>
      <p class="muted">They never mix. Coins of the realm will never buy back a virtue,
      and thy true hoard answers to no game — the Treasury is real money, kept on thy honor, and
      pays no coins. One reward only: a savings goal won earns ${CONFIG.rewards.goalXp} Intelligence XP.</p>
      <p class="muted">At the Exchequer the clerk asks three things to open thy ledger: what thou art
      saving for, what thou hast saved, and a monthly pledge (what thou meanest to set aside). After
      that, keep his day book: enter money in, money out and money put into savings on the day it
      happens — putting money into savings fills the coffer at once. On the 1st of each month the
      clerk closes the month just ended by himself, from those entries, and seals it — fat if the
      pledge was kept, held if no ground was lost, bled if it was. A goal is won when a month closes
      with thy savings at it.</p>
    </div>
    ${farmSection}
    ${marketSection}
    <div class="sheet-section">
      <h2>The Keys</h2>
      ${controls}
    </div>
    <div class="sheet-section">
      <h2>A Day Well Lived</h2>
      <p class="muted">Rise before ${SL.wakeByHour} and collect the dawn. Post the daily. Go live —
      the deed happens out there, not in here. At evening, mark it done and name its virtue.
      Then shut the door, press E at the cot, and let the night be marked. The crown is not given;
      it is accumulated, one honest day at a time.</p>
    </div>`;
}
