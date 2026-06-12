# CROWNBOUND — Medieval Productivity RPG

## Vision
A third-person, low-poly 3D medieval life RPG that is also the owner's personal goal tracker.
**Real life levels you up; the game is where you feel it.** The player completes real-world goals
(lifting, tennis, business, learning, saving), logs them as quests at the in-game Quest Board, and
the character grows. Sessions are short (10–15 min daily). Honor system — no verification.
The year-long Epic Quest counts down to the **Coronation: June 8, 2027, 5:00 AM**.

## Tech
- Vite + vanilla JS + Three.js (^0.169). No frameworks. ES modules.
- All art is procedural low-poly primitives, flat-shaded, warm earth tones, painterly sky. No model files.
- UI is DOM overlay (HTML/CSS), parchment-and-ink styling, font: IM Fell English (Google Fonts, serif fallback).
- Persistence: localStorage key `crownbound_save`, `saveVersion: 3`, migration hook in `state.js`
  (v1→v2 adds the monthly campaign; v2→v3 adds sleep tracking).
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
src/scene/structures.js  hovel, quest board, tome pedestal, granary, training dummy mesh
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
src/ui/panels.js      Quest Board UI + Character Sheet UI
src/ui/audio.js       WebAudio synth blips (hit, ding, squeak, page)
```

## Data model (localStorage `crownbound_save`)
```
{
  saveVersion: 3,
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
    epic:   { text, progressPct, deadline: "2027-06-08T05:00:00" }
  },
  history: [ { date, questText, statTrained, type } ],  // append-only; future Chronicler reads this
  // v1 additions beyond original spec (documented deviations):
  daysPlayed,                                    // incremented on first login of each local day
  stamina: { current, date },                    // daily pool, persisted within the day
  counters: { date, dummyXp, ratsKilled },       // per-day scratch: dummy diminishing returns, rat respawn
  sleep: { retiredAt, lastRewardDate, wellRestedDate }  // cot bedtime + Well-Rested boon bookkeeping
}
```

## Core rules (tuned in config.js)
- Stats start level 1. Next level = 100 × level XP. Rank by total stat levels:
  Peasant (4+) → Squire (12) → Knight (25) → Lord (45) → King (70). v1 renders only Peasant visuals.
- Daily quest: +25 XP to chosen stat, +10 coins, refills stamina and raises its cap for the day, feeds streak.
- Weekly bounty: +100 XP to chosen stat, +50 coins. Monthly campaign: +300 XP, +150 coins.
  Epic: manual progress %, logged to history.
- Streak: daily completion counts the day. Missing a full day resets to 0 → "The fire died in the night."
- Campfire tiers by streak: 0 embers / 1–6 small flame / 7–29 healthy fire / 30+ roaring blaze.
  Until today's daily is done the fire gutters (45% size/light, unsteady flicker) as a living
  reminder; it swells to full tier the moment the deed is logged.
- Stamina: base cap 30 (attack 5, dodge 8). Daily completion → refill + cap 60 for that day.
  Empty stamina blocks combat only: "Your arms are spent. Earn your strength — the board awaits."
- Dummy: tiny STR XP, hard daily cap (diminishing: 2 XP/hit → 1 → 0, capped in config).
- Rats: 3 at the granary, chase + bite chip damage, 3 HP, +2 coins each ("the miller pays a bounty per tail"),
  dead rats respawn next day. Player death (0 HP): wake on the cot inside the hovel, full HP, flavor text, no penalty.
- The hovel is enterable: E opens/closes the hinged door (closed = solid collider), furnished
  one-room peasant interior, indoor camera pulls in close. E on the cot sleeps: fade out, full heal,
  and the bedtime is recorded. On the next load, if ≥7h passed (≤13h, so it was last night) and it is
  8:00 AM local or earlier → Well-Rested boon: +10 WIS XP, +10 coins, +10 stamina cap for the day,
  history entry type "sleep". Once per day; after 8:00 a grim flavor line and no boon. Honor system —
  "wake time" is when the game is next opened, which doubles as the morning check-in habit.

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

## Roadmap (do NOT build before its phase)
- **v2 — The Living Village**: 2–3 NPC villagers with AI-driven dialogue via the Anthropic API;
  The Chronicler writes weekly journal entries in medieval prose from the history log.
- **v3 — Coin & Commerce**: shops, gear, home upgrades, festival mini-games. (Coins finally get a sink.)
- **v4 — Bonds & Bloodline**: relationships, courtship, marriage, family — gated by sustained streaks.
- **v5 — The Ascension Arc**: Squire/Knight/Lord chapters, real enemies (wolves, boar, bandits),
  Wisdom-based alternate solutions, militia, the Coronation event.

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

### Session notes
- Headless verification: `npm run smoke` (or `node scripts/smoke.mjs <scenario>` after a build) serves dist,
  loads it in headless Edge via puppeteer-core (devDependency only), fails on console errors, writes
  scripts/smoke.png. `?smoke=` URL param exposes window.__game (camera setView etc.) for screenshots.
- Regression scenarios (run all after meaningful changes):
  `''` render · `quests` daily+weekly+monthly complete flow · `rollover` stale-save day handling ·
  `fire` streak-35 blaze + stamina drain · `combat` dummy/rats/death (respawn at the cot) ·
  `walk` movement · `tome` save export/import round-trip + chronicle deed list + screenshot ·
  `house` door collider open/close + cot sleep/heal (mid-nap pose screenshot → scripts/smoke-sleep.png)
  + dawn-verdict clock rules + Well-Rested boon + interior screenshot · `aerial`/`front` screenshots.
- Terrain is colored per-FACE (non-indexed, centroid-sampled) for the faceted low-poly look — keep it that way.
- Git identity is passed per-commit via `-c` flags (no global git config on this machine).
