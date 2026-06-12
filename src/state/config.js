export const CONFIG = {
  saveKey: 'crownbound_save',
  saveVersion: 1,

  coronation: '2027-06-08T05:00:00',

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
    ratCoins: 2,
  },

  stamina: {
    baseCap: 30,
    questCap: 60, // cap for the rest of the day once the daily quest is done
    attackCost: 5,
    dodgeCost: 8,
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
