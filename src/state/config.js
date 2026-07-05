export const CONFIG = {
  saveKey: 'crownbound_save',
  saveVersion: 7, // v2 monthly; v3 sleep; v4 sleep ledger; v5 shop; v6 the earned Coronation; v7 the reckoning

  xpPerLevel: 100, // next level costs 100 × current level

  ranks: [
    { title: 'Peasant', totalLevels: 4 },
    { title: 'Squire', totalLevels: 12 },
    { title: 'Knight', totalLevels: 25 },
    { title: 'Lord', totalLevels: 45 },
    { title: 'King', totalLevels: 70 },
  ],

  rewards: {
    daily: { xp: 25, coins: 10 },
    weekly: { xp: 100, coins: 50 },
    monthly: { xp: 300, coins: 150 },
    ratCoins: 2,
  },

  stamina: {
    baseCap: 60,
    questCap: 120, // cap for the rest of the day once the daily quest is done
    attackCost: 5,
    dodgeCost: 8,
  },

  // The cot marks a bedtime; the next game load judges it against the dawn.
  sleep: {
    minHours: 7, // a real night's rest
    maxHours: 13, // the bedtime must be from last night, not days ago
    wakeByHour: 8, // back at the game by 08:00 local to count as rising with the dawn
    wisXp: 10,
    coins: 10,
    staminaBonus: 10, // extra cap (and pool) for the rest of the day
  },

  // The Chapman's Cart. The sacred rule: coins buy comfort and swagger,
  // never virtue — no XP, no streak repair, no stamina is ever for sale.
  shop: {
    marketWeekdays: [0, 3, 5], // Sun, Wed, Fri — the chapman's route through the village
    items: [
      // wares for the hand (gear; damage/reach read by main.js)
      { id: 'cudgel', name: 'an oaken cudgel', flavor: 'Twice the argument of a stick.',
        price: 300, category: 'hand', once: true, damage: 2, tier: 1 },
      { id: 'quarterstaff', name: 'a quarterstaff', flavor: 'Six feet of persuasion, squire-trained.',
        price: 1000, category: 'hand', once: true, damage: 3, reach: 0.25, tier: 2, minRank: 'Squire' },
      // wares for the home (visible hovel upgrades)
      { id: 'rug', name: 'a wool rug', flavor: 'Dyed madder red. The floor forgives.',
        price: 250, category: 'home', once: true },
      { id: 'door', name: 'door paint', flavor: 'A door the color of oxblood says someone lives here on purpose.',
        price: 300, category: 'home', once: true },
      { id: 'window', name: 'a glass pane', flavor: 'Real glass, hauled from the city unbroken. Mostly.',
        price: 400, category: 'home', once: true },
      { id: 'garden', name: 'a garden plot', flavor: 'Seed, string, and somewhere for the mornings to go.',
        price: 600, category: 'home', once: true },
      // small comforts
      { id: 'loaf', name: 'a hearty loaf', flavor: 'Warm bread mends what the road takes.',
        price: 10, category: 'comforts', once: false },
      { id: 'trophy', name: 'a mounted rat', flavor: 'Proof of bounties past, stuffed and staring.',
        price: 60, category: 'comforts', once: true },
      { id: 'lantern', name: 'a candle lantern', flavor: 'A little light for the doorpost.',
        price: 120, category: 'comforts', once: true },
    ],
  },

  // The Sage: AI judgment of which virtue a completed deed trained (the
  // Anthropic API — his key is granted in the Tome and lives OUTSIDE the save).
  // Every failure path falls back to the manual virtue picker.
  sage: {
    model: 'claude-opus-4-8', // any Claude model id works; claude-haiku-4-5 is the thrifty choice
    maxTokens: 16,
    timeoutMs: 8000, // past this the manual picker takes over
  },

  player: {
    maxHp: 20,
    regenPerSecond: 0.35, // out-of-combat trickle
    regenDelay: 5, // seconds after taking damage
    walkSpeed: 4.2,
    sprintMult: 1.65,
    crouchMult: 0.45, // hold C — a careful, low shuffle
    turnLerp: 12,
    jumpSpeed: 6.8, // peak ≈ 0.8 units — a strong human leap, not a superhero
    gravity: 28,
    landCrouchTime: 0.18, // knees absorb the landing for this long
    dodgeSpeed: 9,
    dodgeDuration: 0.45,
    dodgeTapWindow: 0.25, // double-tap a movement key within this to roll
    attackDamage: 1,
    attackRange: 1.9,
    attackArcDeg: 110,
    attackDuration: 0.34,
  },

  dummy: {
    // STR XP per hit by hits-so-far-today: heavily diminishing, hard cap
    xpForHit(hitsToday) {
      if (hitsToday < 10) return 2;
      if (hitsToday < 25) return 1;
      return 0;
    },
  },

  rats: {
    count: 3,
    hp: 3,
    speed: 2.6,
    aggroRange: 6,
    leashRange: 14,
    biteRange: 0.9,
    biteDamage: 1,
    biteCooldown: 1.3,
    wanderRadius: 5,
  },

  campfireTiers: [
    { minStreak: 30, name: 'roaring' },
    { minStreak: 7, name: 'healthy' },
    { minStreak: 1, name: 'small' },
    { minStreak: 0, name: 'embers' },
  ],
};

export function campfireTier(streak) {
  return CONFIG.campfireTiers.find((t) => streak >= t.minStreak).name;
}

export function rankForTotalLevels(total) {
  let current = CONFIG.ranks[0].title;
  for (const r of CONFIG.ranks) if (total >= r.totalLevels) current = r.title;
  return current;
}
