# CROWNBOUND — Medieval Productivity RPG

## Vision
A third-person, low-poly 3D medieval life RPG that is also the owner's personal goal tracker.
**Real life levels you up; the game is where you feel it.** The player completes real-world goals
(lifting, tennis, business, learning, saving), logs them as quests at the in-game Quest Board, and
the character grows. Sessions are short (10–15 min daily). Honor system — no verification.
The Epic Quest is the year's great work, and **the Coronation is earned, not scheduled: it
happens the moment the character reaches King** (70 total virtue levels).

## Tech
- Vite + vanilla JS + Three.js (^0.169). No frameworks. ES modules.
- All art is procedural low-poly primitives, flat-shaded, warm earth tones, painterly sky. No model files.
- UI is DOM overlay (HTML/CSS), parchment-and-ink styling, font: IM Fell English (Google Fonts, serif fallback).
- Persistence: localStorage key `crownbound_save`, `saveVersion: 6`, migration hook in `state.js`
  (v1→v2 adds the monthly campaign; v2→v3 adds sleep tracking; v3→v4 the sleep ledger log;
  v4→v5 the chapman's shop; v5→v6 the earned Coronation — drops the epic deadline).
- Target 60fps on mid-range laptop: merged static geometry, one shadow-casting directional light, cheap particles.

## File structure
```
index.html            DOM skeleton: canvas mount, HUD, panels
src/main.js           boot: state load, world build, systems, game loop
src/state/config.js   all tuning constants (XP curve, ranks, rewards, stamina, combat, campfire tiers)
src/state/dates.js    local-date helpers (YYYY-MM-DD, Monday week start)
src/state/state.js    save/load/migrate, rollover, XP/coins/streak/stamina mutations, pub/sub events
src/scene/terrain.js  analytic terrain height fn, vertex-colored ground + dirt path
src/scene/sky.js      gradient sky dome + fog + lighting
src/scene/scatter.js  merged pine trees + rocks
src/scene/structures.js  hovel (+interior, sleep ledger board, shop upgrades), quest board, tome pedestal, charter post, exchequer booth (+clerk), granary, dummy mesh
src/scene/cart.js     the chapman's cart: cart + mule + chapman, parked only on market days
src/scene/campfire.js campfire mesh + flame/particles, scales with streak tier
src/scene/world.js    assembles scene, exposes interactables + terrainHeight
src/player/playerMesh.js  procedural peasant figure + pose animation
src/player/player.js  movement/sprint/jump/crouch/dodge/attack state machine, HP, stamina spend
src/player/camera.js  pointer-lock third-person orbit camera
src/combat/dummy.js   training dummy wobble + diminishing STR XP
src/combat/rats.js    granary rats: wander/chase/bite AI, bounty, daily respawn
src/ui/ui.css         parchment styling
src/ui/hud.js         HP/stamina bars, coins, rank, streak flame, interact prompt
src/ui/toasts.js      flavor message queue
src/ui/panels.js      Quest Board, Character Sheet, Sleep Ledger, Treasury panel UIs
src/ui/guide.js       the Village Charter: in-game rule sheet, numbers rendered live from config.js
src/ui/audio.js       WebAudio synth blips (hit, ding, squeak, page)
```

## Data model (localStorage `crownbound_save`)
```
{
  saveVersion: 4,
  createdAt, lastPlayedAt, lastQuestDate,        // lastQuestDate = last day a DAILY was completed
  rank: "Peasant",
  stats: { str|agi|wis|inf: { level, xp } },     // next level costs 100 × current level XP
  coins,
  treasury: { current, goal },                   // real savings, manual, never converts with coins
  streak: { current, best },
  quests: {
    daily:  { text, completed, date },           // resets each local day
    weekly: { text, completed, weekStart },      // resets each Monday (local)
    monthly:{ text, completed, monthStart },     // resets the 1st of each month (local)
    epic:   { text, progressPct }                // no deadline — the crown is earned, not dated
  },
  history: [ { date, questText, statTrained, type } ],  // append-only; future Chronicler reads this
  // v1 additions beyond original spec (documented deviations):
  daysPlayed,                                    // incremented on first login of each local day
  stamina: { current, date },                    // daily pool, persisted within the day
  counters: { date, dummyXp, ratsKilled },       // per-day scratch: dummy diminishing returns, rat respawn
  sleep: { retiredAt, lastRewardDate, wellRestedDate,   // cot bedtime + Well-Rested boon bookkeeping
           log: [ { bed, wake, verdict } ] },           // every judged night, append-only (kept in full
                                                        //   for the v2 Chronicler; ledger shows last 7)
  shop: { owned: [] },                                  // ids of one-time chapman purchases; purchases
                                                        //   also land in history as type "purchase"
  coronationAt                                          // ISO timestamp, set once at rank King (else null)
}
```

## Core rules (tuned in config.js)
- Stats start level 1. Next level = 100 × level XP. Rank by total stat levels:
  Peasant (4+) → Squire (12) → Knight (25) → Lord (45) → King (70). v1 renders only Peasant visuals.
- The Coronation fires in `addXp()` the moment rank first reaches King: `coronationAt` is set,
  a history entry (type "coronation") is appended, and `emit('coronation')` rings the bells
  (toasts in main.js). Once only — the timestamp guards re-triggering. Board and Tome show the
  road to the crown ("N of 70 virtue levels won"), then the crowning date ever after. The full
  Coronation ceremony (visuals, the event itself) remains v5 scope.
- Daily quest: +25 XP to chosen stat, +10 coins, refills stamina and raises its cap for the day, feeds streak.
- Weekly bounty: +100 XP to chosen stat, +50 coins. Monthly campaign: +300 XP, +150 coins.
  Epic: manual progress %, logged to history.
- Streak: daily completion counts the day. Missing a full day resets to 0 → "The fire died in the night."
- Campfire tiers by streak: 0 embers / 1–6 small flame / 7–29 healthy fire / 30+ roaring blaze.
  Until today's daily is done the fire gutters (45% size/light, unsteady flicker) as a living
  reminder; it swells to full tier the moment the deed is logged.
- Stamina: base cap 60 (attack 5, dodge 8). Daily completion → refill + cap 120 for that day.
  Empty stamina blocks combat only: "Your arms are spent. Earn your strength — the board awaits."
- Dummy: tiny STR XP, hard daily cap (diminishing: 2 XP/hit → 1 → 0, capped in config).
- Rats: 3 at the granary, chase + bite chip damage, 3 HP, +2 coins each ("the miller pays a bounty per tail"),
  dead rats respawn next day. Player death (0 HP): wake on the cot inside the hovel, full HP, flavor text, no penalty.
- The shop (the chapman's cart): parked by the path on market days only — Sun/Wed/Fri local
  (`CONFIG.shop.marketWeekdays`; `?market=1|0` URL param forces it for testing). E at the cart
  opens the shop panel. THE SACRED RULE: coins buy comfort and swagger, never virtue — no XP,
  no streak repair, no stamina is ever for sale. Catalogue (config `shop.items`): gear
  (cudgel 300c → damage 2; quarterstaff 1000c → damage 3 + reach, Squire-gated), home upgrades
  (rug 250c, door paint 300c, glass window 400c, garden 600c — pre-built hidden meshes in the
  hovel, shown when owned), comforts (loaf 10c full heal, wounded only; rat trophy 60c;
  lantern 120c). One-time items live in shop.owned; the loaf repeats.
- The hovel is enterable: E opens/closes the hinged door (closed = solid collider), furnished
  one-room peasant interior, indoor camera pulls in close. E on the cot sleeps: fade out, full heal,
  and the bedtime is recorded. On the next load, if ≥7h passed (≤13h, so it was last night) and it is
  8:00 AM local or earlier → Well-Rested boon: +10 WIS XP, +10 coins, +10 stamina cap for the day,
  history entry type "sleep". Once per day; after 8:00 a grim flavor line and no boon. Honor system —
  "wake time" is when the game is next opened, which doubles as the morning check-in habit.
- The Sleep Ledger (plank board on the hovel's -z interior wall, E to read): every judged night is
  appended to sleep.log (bed/wake/verdict: dawn|late|unwitnessed); the panel shows the last 7 nights
  with times, hours slept, and a weekly well-rested count. Log is kept in full — storage is
  negligible (~20 KB/year) and the v2 Chronicler will narrate from it.

## Noted decisions (simplest reasonable choices where spec was ambiguous)
- Daily/weekly rollover is detected on page load (sessions are short; no mid-session midnight handling).
- Dates use the player's local timezone; weeks start Monday local.
- Weekly bounty also asks which stat to train on completion (spec implied stat-selection for completions generally).
- Epic progress updates are appended to history (type "epic") so the future Chronicler can see the arc.
- Player position is not persisted; each session starts at the hovel.
- While a UI panel is open, the whole sim pauses except ambient visuals (campfire), not just input.
- Slow passive HP regen out of combat (no items exist in v1, so this is the "way back").
- Added /src/combat directory beyond the five spec'd folders to keep enemy logic out of /scene.
- The Tome's Chronicle section lists every recorded deed from history (newest first, scrollable) —
  a plain-prose preview of what the v2 Chronicler will narrate.
- Tome offers save backup ("The Scribe"): download the save as JSON; restore validates the file,
  stashes the replaced save at `crownbound_save_prev`, writes the copy, and reloads the page so the
  standard load/migrate/rollover path vets it like any stored save.
- Controls: Space jumps (grounded gravity arc, no double-jump, free — stamina blocks combat only);
  dodge-roll is double-tap of a movement key, rolling in that key's camera-relative direction;
  hold C to crouch (visual stance + slower walk, no stealth effect — Ctrl was rejected because
  Ctrl+W closes the browser tab); E is the one interact key — quest board, tome, cot, and the hovel
  door all use it, nearest target wins (a separate F-for-doors binding was tried and consolidated
  away). None work while a UI panel is open.
- Hovel interior (post-v1 "Hearth & Home"): same footprint, walls became hollow shell + furniture;
  the hovel must stay unrotated (rotY 0) — its colliders are axis-aligned rects (collision system
  supports circles + AABBs only). Interior floor is the terrain itself with a packed-earth dirt
  patch painted under the footprint. The hearth adds the scene's one extra light (PointLight,
  no shadows, tight falloff) — still within the perf budget. Indoor camera: orbit distance clamps
  to ~1.8 and stays under ceilY while the player is inside the room bounds.
- Sleep reward clock rules live in `evaluateSleep()` (pure, exported) so the smoke suite can test
  fixed dates; `applySleepReward()` is likewise exported for the suite. Sleeping always heals fully
  and re-records the bedtime (last bed-use of the night wins).
- Sleeping plays a tuck-in animation (player mode 'sleep': glide to the cot, lie back on the
  pillow, breathe; the stick is hidden while lying) before the 0.7s fade — full timeline ~2.6s,
  timed in main.js `sleepAtCot()`. `respawn()` is the universal way out of the sleep pose.
- The Treasury lives at the Exchequer — an open-fronted money-changer's booth by the path at
  (6.5, 3), counter toward the road (E at the counting table opens the Treasury panel). Checkered
  counting cloth, scales, coffer; the clerk behind it is mute scenery with a breathing sway
  (world.exchequer.update) and is a natural v2 NPC candidate. The Tome's Wealth section shows
  coins only. Data model unchanged. (Lived briefly at the hovel's chest before getting its own
  building the same week.)
- The Village Charter (post by the path at (1.2, 0.4), E → guide panel) is the in-game rule
  sheet. All numbers on it — rewards, stamina costs, streak tiers, rank ladder, dummy curve,
  sleep clock — are read from config.js at render time so re-tuning can never leave it stale;
  only the prose in src/ui/guide.js is fixed. The Chapman section renders only while
  CONFIG.shop exists. (Companion out-of-game doc: CROWNBOUND-Guide.docx, kept by hand.)
- The chapman's cart was pulled forward from v3 at the owner's request (2026-07-03), in mute
  form: the chapman and mule are scenery (breath/nod/tail sways via world.cart.update) until v2
  gives them dialogue. Stock rotation from the original pitch is deferred until the catalogue
  outgrows one cart-load — all nine items show every market day. Market-day status is fixed per
  load, like rollover. On non-market days the cart, its colliders, and its prompt don't exist;
  only the wheel-rut dirt patch remains.

## Roadmap (do NOT build before its phase)
- **v2 — The Living Village**: 2–3 NPC villagers with AI-driven dialogue via the Anthropic API;
  The Chronicler writes weekly journal entries in medieval prose from the history log.
- **v3 — Coin & Commerce**: festival mini-games, rotating cart stock, more gear tiers and home
  upgrades. (The chapman's cart itself arrived early, 2026-07-03 — coins already have their sink.)
- **v4 — Bonds & Bloodline**: relationships, courtship, marriage, family — gated by sustained streaks.
- **v5 — The Ascension Arc**: Squire/Knight/Lord chapters, real enemies (wolves, boar, bandits),
  Wisdom-based alternate solutions, militia, the Coronation ceremony (the trigger already
  fires at King; v5 builds the event around it).

## Working agreement
- Ask before adding any feature not in the spec. Scope discipline is a feature.
- Readable code over clever code — this will be iterated on for a year.
- Commit after each milestone. Keep the Build status below current so any session can resume instantly.

## Build status
- [x] M1 — Scaffold + world scene (terrain, lighting, trees, structures), camera orbiting idle character
- [x] M2 — Third-person controller: movement, sprint, dodge, camera follow, E-interaction prompts
- [x] M3 — Quest Board + Character Sheet UI: quest write/complete flow, stats, XP, coins, Treasury
- [x] M4 — Persistence: save/load, streak logic, daily/weekly rollover on load
- [x] M5 — Campfire streak visuals + stamina system
- [x] M6 — Combat: training dummy + granary rats, HP, hit feedback, rat bounty
- [x] M7 — Polish: HUD, flavor messages, parchment styling, performance check

**v1 COMPLETE** (2026-06-11). Verified headlessly: ~63–92 draw calls, ~37k triangles — comfortable
60fps territory for a mid-range GPU. Pointer-lock mouse camera and audio could not be exercised
headlessly; everything else covered by the regression suite below.

- [x] Post-v1 — "Hearth & Home" (2026-06-12): enterable hovel (hollow shell, hinged E-door, furnished
  peasant interior, indoor camera), cot sleep = full heal + death respawn point, Well-Rested
  dawn reward (7+ h, up by 8:00), saveVersion 3.
- [x] Post-v1 — "The Sleep Ledger" (2026-06-12): wall board in the hovel logging every judged night
  (bed/wake/verdict), panel shows the last 7 with hours slept + weekly tally, saveVersion 4.
- [x] Post-v1 — "The Strongbox" (2026-07-03): Treasury moved out of the Tome to the hovel's
  chest (E → Treasury panel); Tome's Wealth section shows coins only.
- [x] Post-v1 — "The Exchequer" (2026-07-03): the Treasury gets its own building — a
  money-changer's booth by the path (counting table, checkered cloth, scales, breathing clerk,
  coffer, hanging coin sign) replaces the hovel-chest interactable; chest is furniture again.
- [x] Post-v1 — "The Chapman's Cart" (2026-07-03, v3 pulled forward): the shop. Mule cart by
  the path on market days (Sun/Wed/Fri), nine-item catalogue (gear/home/comforts), coins get
  their sink, saveVersion 5. Chapman is mute scenery until v2.
- [x] Post-v1 — "The Earned Crown" (2026-07-03): the Coronation date and countdown removed;
  the Coronation now fires the moment rank reaches King (70 total levels), recorded in
  `coronationAt` + history, celebrated with bells. saveVersion 6.
- [x] Post-v1 — "The Village Charter" (2026-07-03): in-game rule sheet — a parchment-on-post
  by the path (E → scrollable guide panel); numbers render live from config.js. No save change.

### Session notes
- Headless verification: `npm run smoke` (or `node scripts/smoke.mjs <scenario>` after a build) serves dist,
  loads it in headless Edge via puppeteer-core (devDependency only), fails on console errors, writes
  scripts/smoke.png. `?smoke=` URL param exposes window.__game (camera setView etc.) for screenshots.
- Regression scenarios (run all after meaningful changes):
  `''` render · `quests` daily+weekly+monthly complete flow · `rollover` stale-save day handling ·
  `fire` streak-35 blaze + stamina drain · `combat` dummy/rats/death (respawn at the cot) ·
  `walk` movement · `tome` save export/import round-trip + chronicle deed list + screenshot ·
  `house` door collider open/close + cot sleep/heal (mid-nap pose screenshot → scripts/smoke-sleep.png)
  + dawn-verdict clock rules + Well-Rested boon + sleep-ledger log append & panel render +
  interior screenshot · `exchequer` counter prompt + E-open + Treasury set + booth screenshot ·
  `market` cart presence/absence via ?market=1|0 + prompt + buy flow (coins, ownership, hovel
  mesh shown, rank gate, cudgel damage, loaf heal) + cart screenshot · `crown` v5→v6 migration
  + last-level daily completion → King + coronation once-only · `guide` charter prompt + E-open
  + config-drawn numbers (panel screenshot → scripts/smoke-guide.png) + post screenshot ·
  `aerial`/`front` screenshots.
- Terrain is colored per-FACE (non-indexed, centroid-sampled) for the faceted low-poly look — keep it that way.
- Git identity is passed per-commit via `-c` flags (no global git config on this machine).
