// Prints the numbers the player's guide quotes, read from the game's own
// config, as JSON — scripts/build-guide.py writes them into the document.
import { CONFIG } from '../src/state/config.js';

// walk the dummy's diminishing-returns curve: [{ upTo, xp }], ending where it pays nothing
const dummy = [];
let xp = CONFIG.dummy.xpForHit(0);
for (let h = 1; h <= 500 && xp > 0; h++) {
  const next = CONFIG.dummy.xpForHit(h);
  if (next !== xp) {
    dummy.push({ upTo: h, xp });
    xp = next;
  }
}

const { realm, xpPerLevel, ranks, rewards, stamina, sleep, shop, chest, player, rats, farm, campfireTiers } = CONFIG;
console.log(JSON.stringify({ realm, xpPerLevel, ranks, rewards, stamina, sleep, shop, chest, player, rats, farm, campfireTiers, dummy }));
