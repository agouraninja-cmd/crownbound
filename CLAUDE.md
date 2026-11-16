# CROWNBOUND — Medieval Productivity RPG

## Vision
A third-person, low-poly 3D medieval life RPG — set in **England, around 1250** — that is also the owner's personal goal tracker.
The player lives in **Brackenley**, a village in a clearing of the Brackenwood, in the **Kingdom of Aldermere**
(both fictional; names in `CONFIG.realm`, shown on the Map of the Kingdom).
**Real life levels you up; the game is where you feel it.** The player completes real-world goals
(lifting, tennis, business, learning, saving), logs them as quests at the in-game Quest Board, and
the character grows. Sessions are short (10–15 min daily). Honor system — no verification.
The Epic Quest is the year's great work, and **the Coronation is earned, not scheduled: it
happens the moment the character reaches King** (70 total virtue levels).

## Tech
- Vite + vanilla JS + Three.js (^0.169). No frameworks. ES modules.
- @anthropic-ai/sdk (browser-direct, `dangerouslyAllowBrowser`) — the Sage only, so far;
  v2's villagers will reuse this plumbing. Model + tuning in CONFIG.sage.
- All art is procedural low-poly geometry, flat-shaded, warm earth tones under a painterly sky.
  No model files and no image files — the few textures are drawn on a canvas at load: a soft
  round dot (sprites.js), the sun's disc and the moon's face (sky.js). Pictures in the UI
  (the Map, the shop's wares) are SVG built in code.
- UI is DOM overlay (HTML/CSS), parchment-and-ink styling, font: IM Fell English (Google Fonts, serif fallback).
- Persistence: localStorage key `crownbound_save`, `saveVersion: 12`, migration hook in `state.js`
  (v1→v2 adds the monthly campaign; v2→v3 adds sleep tracking; v3→v4 the sleep ledger log;
  v4→v5 the chapman's shop; v5→v6 the earned Coronation — drops the epic deadline;
  v6→v7 the monthly reckoning — grows the treasury; v7→v8 the Chronicler's weekly chronicle;
  v8→v9 the chest — weapon in hand + loaf larder; v9→v10 the virtues renamed —
  str→ath, agi→int; v10→v11 Intelligence reset to level 1, rank recounted; v11→v12 the
  miller's strip — the field begins fallow). The test world (`?test=1`, The Proving Ground)
  keeps a save of its own under `crownbound_test_save` and never writes the true one.
- Target 60fps on mid-range laptop: merged static geometry (props are baked — meshUtils.bake),
  one shadow-casting directional light, cheap particles, no post-processing.

## File structure
```
index.html            DOM skeleton: canvas mount, HUD, panels
src/main.js           boot: state load, world build, systems, game loop
src/state/config.js   all tuning constants (XP curve, ranks, rewards, stamina, combat, campfire tiers)
src/state/dates.js    local-date helpers (YYYY-MM-DD, Monday week start)
src/state/state.js    save/load/migrate, rollover, XP/coins/streak/stamina mutations, pub/sub events
src/state/prefs.js    device preferences (mouse feel), own localStorage slot outside the save
src/state/mirror.js   dev-only save mirror: pushes each change to /__save; an empty boot adopts the file
vite.config.js        dev server config + save-mirror plugin (/__save ⇄ saves/crownbound-save.json)
src/scene/layout.js   where everything stands: LAYOUT positions, NORTH (the compass), the path's centreline, dirt patches, the field's own frame (fieldToWorld / worldToField / fieldGap / trackGap)
src/scene/meshUtils.js  shared geometry tools: seeded rng, value noise, mesh() + bake() static batching, tint/sway/batch helpers, hit flash
src/scene/kit.js      the building kit: palette, thatch roofs, boarding, stone footings, villager heads/arms/robes
src/scene/terrain.js  analytic terrain height fn (gameplay) + the drawn land: faceted vertex-colored ground, dirt path, outer hills, far mountains
src/scene/daylight.js the hour of the real day: skyAt(date) — where sun and moon stand by the player's own clock (pure), + `daylight`, what unlit things read of it
src/scene/sky.js      the sky that keeps the hour: dome, sun, moon in her phase, stars, low-poly clouds, fog, the key + fill light, the shadow box that follows the player
src/scene/scatter.js  merged woodland: pines/oaks/birches, boulders, pebbles, and the backdrop forest beyond the walkable world
src/scene/flora.js    grass tufts, meadow grass, wildflowers, ferns, bushes — no colliders, all wind-swayed
src/scene/wind.js     the shared wind clock + the vertex-shader patch that sways foliage and grass
src/scene/ambient.js  ambient life: hovel smoke, motes in the light, birds, butterflies
src/scene/particles.js  soft-puff particle pool (one Points draw call per pool): smoke
src/scene/sprites.js  the canvas-drawn soft dot texture + additive glow billboards
src/scene/structures.js  hovel (+interior, sleep ledger board, shop upgrades), quest board, tome pedestal, charter post, exchequer booth (+clerk), granary, miller, dummy mesh
src/scene/cart.js     the chapman's cart: cart + mule + chapman, parked only on market days
src/scene/field.js    the miller's strip: the ploughed bed, the seven looks a ridge can wear, fence + gate + hayrick + scarecrow; draw(looks) rebuilds the crop
src/scene/alive.js    villager aliveness driver: breathing, head-tracking, fidgets, greet nod, waypoint stroll
src/scene/campfire.js campfire mesh, tongues of flame, sparks, smoke; scales with streak tier
src/scene/world.js    assembles scene, exposes interactables + terrainHeight; update() drives the ambient scenery
src/player/playerMesh.js  procedural peasant figure: a jointed rig (knees, ankles, elbows, spine) + RIG, its measurements; the hoe and sickle, hidden in the stick hand
src/player/playerAnim.js  the body in motion: solved legs, the stride, pose layers (leap/roll/swing/field work/sleep), springs — the only thing that turns the rig
src/player/player.js  movement physics (momentum, braking, air, walls, hills) + sprint/jump/crouch/dodge/attack/work state machine, HP, stamina spend
src/player/camera.js  pointer-lock third-person orbit camera
src/player/pathfind.js  the walk home: grid A* around the colliders, path pulled taut
src/combat/dummy.js   training dummy wobble + diminishing Athleticism XP
src/combat/rats.js    granary rats: wander/chase/bite AI, bounty, daily respawn
src/proving/proving.js   the Proving Ground (?test=1): which world this is, its save slot, the moved clock — must stay main.js's FIRST import
src/proving/commands.js  the test world's commands, one table entry each (add a command = add an entry)
src/proving/console.js   the test world's command line (/), the owner's own commands (make / forget), the banner
src/ai/sage.js        the Sage: Anthropic API names a completed deed's virtue; key kept outside the save
src/ai/chronicler.js  the Chronicler: weekly prose entries from history + sleep log, under the sage's key; run once after boot
src/ui/ui.css         parchment styling
src/ui/hud.js         HP/stamina bars, coins, rank, streak flame, interact prompt
src/ui/toasts.js      flavor message queue
src/ui/panels.js      Quest Board, Character Sheet, Sleep Ledger, Shop, Chest panel UIs; opens/closes every panel
src/ui/treasury.js    the Treasury panel: the coffer that fills, the track to the goal, the opening questions, lay in coin, the monthly reckoning, the seals and the climb chart (all SVG built here)
src/ui/guide.js       the Village Charter: in-game rule sheet, numbers rendered live from config.js
src/ui/rest.js        the rest card shown abed once stamina is spent: his line, "come back tomorrow", ledger buttons
src/ui/map.js         the Map of the Kingdom (M): the realm drawn once as SVG + the village plan drawn live from LAYOUT
src/ui/wares.js       the wares pictured and explained: an ink-and-wash SVG per shop item + the stick, and each one's "read more" (shop + chest)
src/ui/audio.js       WebAudio synth blips (hit, ding, squeak, page, footfall, landing, hoe/seed/sickle)
scripts/smoke.mjs     the headless regression suite (see Session notes)
scripts/build-guide.py  builds CROWNBOUND-Guide.docx (`npm run guide`): the prose, with every number read from config.js via scripts/guide-config.mjs, laid over scripts/guide-template.docx
```

## Data model (localStorage `crownbound_save`)
```
{
  saveVersion: 12,
  createdAt, lastPlayedAt, lastQuestDate,        // lastQuestDate = last day a DAILY was completed
  rank: "Peasant",
  stats: { ath|int|wis|inf: { level, xp } },     // Athleticism, Intelligence, Wisdom, Influence;
                                                 //   next level costs 100 × current level XP
  coins,
  treasury: {                                    // real savings, manual, never converts with coins
    name, current, goal,                         // the named cumulative summit (goal 0 = none raised)
    pledge,                                      // standing monthly laid-in commitment (verdict yardstick)
    laid: { "YYYY-MM": n },                      // coin laid in between reckonings, by the month it was laid
                                                 //   in; a month's sum is cleared when that month is filed
                                                 //   (absent on old saves = {} — no version bump)
    rolls: [ { month: "YYYY-MM", earned, spent, saved, counted,   // one reckoning per month, append-only;
               verdict: fat|held|bled|unreckoned } ],             //   earned+spent are optional (a roll filed on
                                                                  //   two figures has neither); unreckoned rolls
                                                                  //   carry month+verdict only
    conquered: [ { name, goal, conqueredAt } ]   // summits taken; conquests also land in history as "treasury"
  },
  streak: { current, best },
  quests: {
    daily:  { text, completed, date },           // resets each local day
    weekly: { text, completed, weekStart },      // resets each Monday (local)
    monthly:{ text, completed, monthStart },     // resets the 1st of each month (local)
    epic:   { text, progressPct }                // no deadline — the crown is earned, not dated
  },
  history: [ { date, questText, statTrained, type } ],  // append-only; the Chronicler reads this
  chronicle: [ { week, text, writtenAt } ],      // the Chronicler's weekly entries, append-only, oldest first
  // v1 additions beyond original spec (documented deviations):
  daysPlayed,                                    // incremented on first login of each local day
  stamina: { current, date, spent },             // daily pool, persisted within the day; spent: true once
                                                 //   it hit 0 today (abed till the morrow; absent = false)
  counters: { date, dummyXp, ratsKilled },       // per-day scratch: dummy diminishing returns, rat respawn
  sleep: { retiredAt, lastRewardDate, wellRestedDate,   // cot bedtime + Well-Rested boon bookkeeping
           log: [ { bed, wake, verdict } ] },           // every judged night, append-only (kept in full
                                                        //   for the v2 Chronicler; ledger shows last 7)
  shop: { owned: [] },                                  // ids of one-time chapman purchases; purchases
                                                        //   also land in history as type "purchase"
  chest: { wielded, loaves },                           // weapon in hand ('stick' or an owned hand item;
                                                        //   the rest lie in the chest) + loaves in the larder
  farm: { stage, done, workedOn },                      // the miller's strip: the job owed (0 till · 1 sow ·
                                                        //   2 tend · 3 reap), the ridges done of it, the local
                                                        //   day the last job was finished (one job a day);
                                                        //   a harvest also lands in history as type "harvest"
  coronationAt                                          // ISO timestamp, set once at rank King (else null)
}
```

## Core rules (tuned in config.js)
- The four virtues (keys in `STAT_NAMES`, state.js): Athleticism `ath` (lifting, sport,
  labour), Intelligence `int` (planning, strategy, discipline, judgment, money), Wisdom `wis`
  (learning, study, coursework, reading, coding — and the sleep boon), Influence `inf`
  (business, people).
- Stats start level 1. Next level = 100 × level XP. Rank by total stat levels:
  Peasant (4+) → Squire (12) → Knight (25) → Lord (45) → King (70). v1 renders only Peasant visuals.
- The Coronation fires in `addXp()` the moment rank first reaches King: `coronationAt` is set,
  a history entry (type "coronation") is appended, and `emit('coronation')` rings the bells
  (toasts in main.js). Once only — the timestamp guards re-triggering. Board and Tome show the
  road to the crown ("N of 70 virtue levels won"), then the crowning date ever after. The full
  Coronation ceremony (visuals, the event itself) remains v5 scope.
- Daily quest: +25 XP to chosen stat, +10 coins, refills stamina and raises its cap for the day
  (even from bed, spent — it gets him up; see below), feeds streak.
- Weekly bounty: +100 XP to chosen stat, +50 coins. Monthly campaign: +300 XP, +150 coins.
  Epic: manual progress %, logged to history.
- Streak: daily completion counts the day. Missing a full day resets to 0 → "The fire died in the night."
- Campfire tiers by streak: 0 embers / 1–6 small flame / 7–29 healthy fire / 30+ roaring blaze.
  Until today's daily is done the fire gutters (45% size/light, unsteady flicker) as a living
  reminder; it swells to full tier the moment the deed is logged.
- Stamina: base cap 240 (attack 5, dodge 8). Daily completion → refill + cap 480 for that day.
  The legs draw on it too: 0.25/s walking (crouched included), 1/s sprinting, on the ground
  only — a leap and standing still are free (`walkDrain`/`sprintDrain`). Too little for a
  swing/roll: "Your arms are spent. Earn your strength — the board awaits." At exactly 0 the
  day is over ("Spent for the day", below).
- Spent for the day: the moment stamina hits 0, `stamina.spent` is set and he walks himself
  home — the keys let go, a path is found round everything (out through the field gate if need
  be), the door opens, he lies down on the cot — and the rest card says play resumes tomorrow,
  with a motivational line he says to himself. E hurries the walk (fade, abed). The Quest Board,
  Tome and Exchequer open from the card; today's daily posted from bed refills the pool (480),
  clears `spent` and gets him up beside the cot (`wakeFromRest`, main.js) — once the daily is
  done, a second emptying is final till tomorrow. "Retire for the night" marks the real bedtime
  (the walk home never does). Opening the game again that day finds him abed; the next day's
  rollover clears it.
- Dummy: tiny Athleticism XP, hard daily cap (diminishing: 2 XP/hit → 1 → 0, capped in config).
- Rats: 3 at the granary, chase + bite chip damage, 3 HP, +2 coins each ("the miller pays a bounty per tail"),
  dead rats respawn next day. Player death (0 HP): wake on the cot inside the hovel, full HP, flavor text, no penalty.
- The miller's strip (the farming job): a fenced wheat field of 10 ridges (`CONFIG.farm.rows`),
  each 12.8 long, out past the granary to the north-east at (27, 33), reached by a cart track
  from the granary yard. One job per real local day, each in its
  turn — till, sow, tend (weed), reap — and a job is every ridge: E at a ridge → ~1.5s of work
  (hoe, sowing hand or sickle in place of the stick) → that ridge changes its look. The last
  ridge finishes the job and the miller pays: +4 coins for a day's tilling, sowing or weeding,
  +20 for the harvest (`wage` / `harvestPay`). The crop grows only across the days worked
  (shoots the night after sowing, ripe wheat the night after weeding). Nothing spoils: a missed
  day costs only the day, and a half-done job keeps its ridges. COINS ONLY — field work pays no
  XP, costs no stamina and feeds no streak; virtue is still earned only by real deeds.
- The shop (the chapman's cart): parked by the path on market days only — Sun/Wed/Fri local
  (`CONFIG.shop.marketWeekdays`; `?market=1|0` URL param forces it for testing). E at the cart
  opens the shop panel. THE SACRED RULE: coins buy comfort and swagger, never virtue — no XP,
  no streak repair, no stamina is ever for sale. Catalogue (config `shop.items`): gear
  (cudgel 300c → damage 2; quarterstaff 1000c → damage 3 + reach, Squire-gated), home upgrades
  (rug 250c, door paint 300c, glass window 400c, garden 600c — pre-built hidden meshes in the
  hovel, shown when owned), comforts (loaf 10c → the chest's larder; rat trophy 60c;
  lantern 120c). One-time items live in shop.owned; the loaf repeats.
- The chest by the cot (E inside the hovel → lid up + Chest panel; closing the panel lowers it):
  the hand holds ONE weapon — the stick, cudgel or quarterstaff — and the chest keeps the rest;
  "Take up" swaps (`chest.wielded`, applied by main.js `applyPurchases`). A newly bought weapon
  goes straight to hand. Loaves bought at the cart land in the larder (cap
  `CONFIG.chest.larderCap` = 6; the cart refuses bread when it's full) and are eaten from the
  chest for a full heal, wounded only. Bread mends HP and nothing else — the sacred rule holds.
- The hovel is enterable: E opens/closes the hinged door (closed = solid collider), furnished
  one-room peasant interior, indoor camera pulls in close. E on the cot sleeps: fade out, full heal,
  and the bedtime is recorded. On the next load, if ≥7h passed (≤13h, so it was last night) and it is
  8:00 AM local or earlier → Well-Rested boon: +10 WIS XP, +10 coins, +40 stamina cap for the day,
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
  Ctrl+W closes the browser tab); M opens the Map of the Kingdom; E is the one interact key — quest board, tome, cot, and the hovel
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
  CONFIG.shop exists. (Companion out-of-game doc: CROWNBOUND-Guide.docx, built by
  `npm run guide` from the same config — see "The Guide Caught Up" in Build status.)
- The chapman's cart was pulled forward from v3 at the owner's request (2026-07-03), in mute
  form: the chapman and mule are scenery (breath/nod/tail sways via world.cart.update) until v2
  gives them dialogue. Stock rotation from the original pitch is deferred until the catalogue
  outgrows one cart-load — all nine items show every market day. Market-day status is fixed per
  load, like rollover. On non-market days the cart, its colliders, and its prompt don't exist;
  only the wheel-rut dirt patch remains.
- The wares have pictures (2026-11-16, the owner: "Add pictures of each item in the chapman's
  cart"). Each shop row shows a 60px ink-and-wash drawing beside its name — the Map's style, an
  SVG string from `warePicture(id)` in src/ui/wares.js, no image file. The washes are the
  colours the item wears in the 3D world (the cudgel's dark oak, the rug's madder and gold, the
  oxblood door), so the picture matches what turns up in the hand or the hovel. A ware above
  the player's rank is shown faded. The pictures carry no ids or gradients (nine share one
  page). A new item in `shop.items` still sells without a picture (warePicture returns '');
  give it one by adding a drawing to `PICTURES` under its id. The Chest panel shows them too
  (asked for the same day): each weapon row (the stick has its own drawing, as it is never
  sold) and the larder's loaf, faded when the larder is empty.
- Each ware reads more (2026-11-16, the owner: "a description of the item and how they can use
  it in the game and how it benefits them … something they can click and read more of").
  Clicking a ware's picture, or the "Read more ▾" after its flavor line, unfolds a box under
  its row: a large picture, a line of what it is, "How to use it" and "What it does for thee".
  Same in the Chest, where the cart's talk of buying (the Squire gate, "goes straight to thy
  hand") is left out. The prose is `LORE` in wares.js; like the Charter, every number in it
  (damage, reach, blows to fell a rat, stamina per swing, larder cap, max HP, the rank gate)
  is read from config.js as it is shown. Every comfort says plainly it earns no XP, streak or
  stamina — the sacred rule, told at the point of sale. Unfolded boxes stay open across a
  purchase or a swap (panels.js `openWares`) and all fold when the panel closes. A new item
  without a `LORE` entry still sells — its picture is just not a button.
- The miller lives in his granary yard, home post (9.0, 9.3) — the rat bounty's flavor text made
  flesh. Third mute villager, v2 NPC candidate alongside the clerk and chapman. E opens no panel:
  it toasts a one-line tally of today's ratsKilled (`millerGreeting()` in main.js).
- The miller walks his rounds (makeStroll in alive.js): post → yard's west corner → south corner,
  fixed waypoints pre-cleared of colliders (scatter is seeded RNG, so cleared once = cleared
  forever), pausing 6–14s to work at each. He stops walking while the player is within notice
  range (company on the rounds), his collision circle and E-prompt follow him (mutated live via
  onMove), and his sack + fork stay planted at the post (separate `props` group). Smoke tests
  that need him must stand relative to `miller.at()`, not his layout spot.
- The Sage (2026-07-04): AI names the virtue of a completed deed, replacing the manual
  four-button pick when appointed. His verdict is FINAL (auto-completes the quest with a toast);
  the manual picker is every failure's fallback — no key, network trouble, a timeout
  (CONFIG.sage.timeoutMs), refusal, or an off-list answer all resolve to the picker, so the game
  never blocks on the network. A "Choose thyself" button cancels a pending judgment (stale verdicts are orphaned
  by a sequence guard, incl. on panel close). The key is granted/dismissed in the Tome, stored in
  its own localStorage slot OUTSIDE the save — a Scribe export can never leak it. First Anthropic
  API integration (v2 groundwork pulled forward); browser-direct SDK, no server. The sage smoke
  scenario stubs window.fetch with canned Claude responses — wiring tested without tokens.
- The Breath of Life (2026-07-04): all three villagers run on `makeAlive()` (src/scene/alive.js) —
  layered breathing (amplitude ~3× the old sway, phase/tempo seeded from position so the village
  never breathes in unison), a head that turns to watch the player within 4 units (clamped ±0.7 rad,
  eased, drifts back to the work), random arm fidgets every 6–14s (gesture `apply(k)` fns with
  `apply(0)` = exact rest pose), and a once-per-load greet: head nod + a toast wired in main.js
  (`onGreet` — the clerk's line changes when a reckoning is owed). Each head is its own pivot
  group and gained a nose (plus cap brim / hood lip) because a bare sphere-and-cylinder head
  turns invisibly. update(dt, playerPos) — main.js passes player.pos. All group rotations on
  existing meshes; gesture sfx deliberately omitted (reusing reward chimes would read as income).
- The Reckoning (2026-07-03): the Treasury is a monthly statement of the player's real money — a
  virtual summarized spreadsheet with NO game value (no XP, no coins, ever; quests reward the
  deed of saving, the roll only records the fact). Two figures are needed per month (laid in
  the hoard, hoard counted true — the last reconciles `current`); earned and spent are optional
  since The Coffer (below), and kept and keep-rate are derived when they are given. The verdict
  judges laid-in against the standing `pledge` (fat ≥ pledge; else held / bled by earned − spent
  when given, by whether the savings fell since the last reckoning when not), thresholds
  pledge-relative, not config numbers. Goals are cumulative
  summits: named, climbed by month, archived to `conquered` on conquest — which fires ONLY at a
  filing (`fileReckoning`), never from goal edits, so a typo can't take a summit. Skipped months
  are backfilled as `unreckoned` rolls at the next filing, sleep-ledger style. One roll per
  month, ever (`reckoningDue` guards). Pure fns `judgeReckoning`/`reckoningDue` exported for the
  smoke suite. Panel shows the last 12 rolls; the full log is kept for the v2 Chronicler.
- The Coffer (2026-11-16): the Treasury rebuilt to be used, at the owner's word ("it seems
  confusing and overwhelming… more fun to use and more pleasant to look at while keeping the
  idea in mind to have a positive impact on the user's actual life" — the changes were left to
  Claude). What a future session must know:
  - The panel is its own file, src/ui/treasury.js (panels.js calls `renderTreasury(body)` and
    `resetTreasury()` on close). One screen, one job: a coffer drawn in code that heaps with
    coin by % of the goal, the savings in large numerals, a track with wax-dotted quarter
    marks and the pace ("about N months at the pledge — around Mon ’YY"), this month's pledge
    meter — then ONE clerk's card (the three opening questions, or the reckoning owed, or the
    next goal to name, or last month's seal and what to do next). Months past, goals won, the
    plan and the how-to are `<details>` folds, shut until asked for.
  - Lay in coin (`layIn(amount)`, state.js): the between-months action. The player moves real
    money into savings and says so — `current` grows at once and `laid[thisMonth]` remembers
    it. That is what makes the Treasury answer the deed on the day it is done instead of once
    a month. It never wins a goal (only a filed reckoning does — the typo rule stands) and
    pays nothing. "Recount" is the correction (`setTreasury`): it moves `current`, not `laid`.
  - The reckoning asks two figures: put into savings (pre-filled from `laid[dueMonth]`) and
    savings now (pre-filled; it follows what is typed beyond the coin already laid in, until
    typed over — so nothing is counted twice). Income and spending sit in a fold, given
    together or not at all. This was the friction that kept the ledger unused: a balance can
    be read off a bank app, a month's spending has to be added up.
  - Verdicts are wax seals with a mark each — risen (fat), level (held), fallen (bled), an
    empty ring (unreckoned) — so the verdict never rests on colour alone. Plain meanings
    everywhere: pledge kept / no ground lost / ground lost. A bled month is answered with a
    next step (cut one cost, post it as a quest), never a scolding.
  - An untouched ledger (no rolls, no conquests, nothing saved, no pledge, no name) opens on
    three questions, one at a time; sealing them names an unnamed goal "The Hoard", because
    the name is what marks a ledger as opened.
  - Inputs are never focused when the panel opens (the E that opened it would be typed into
    the box) — only after a click inside it. Esc closes the panel from inside a box.
  - The `data-*` hooks the smoke suite drives (`data-w-*` the questions, `data-lay-*`,
    `data-count-*`, `data-r-*` the reckoning, `data-s-*` the next goal, `data-t-*` the plan)
    are the panel's contract with scripts/smoke.mjs.
- The Renovation (2026-11-13): the whole 3D look rebuilt inside the same art rules. What a
  future session must know:
  - Static batching. Every prop is still assembled from mesh() pieces; the builder then calls
    `bake(group)` (meshUtils), which folds each Group's plain meshes into ONE vertex-coloured
    mesh (two if some skip shadows). Child Groups bake separately and keep their transforms —
    so anything the game moves, hides or re-materials must be its own Group or be made with
    `keep: true` (the weapon, the door paint). Invisible meshes and non-Lambert materials are
    left alone. Village views fell from ~285 draw calls to ~100 while showing far more.
  - The legacy scatter stream. The original 42 trees + 16 rocks come from `legacyLayout()` in
    scatter.js, which draws from rng(1337) in exactly the old order (it even burns the values
    the old trees used). Their 57 colliders were checked identical to before the renovation.
    New trees (4 hand-set, 46 in the outer ring) use their own streams and are appended after.
    Never reorder or add a draw inside legacyLayout — the miller's rounds depend on it.
  - Flora never collides. Grass, flowers, ferns and bushes are collider-less by design;
    keepClear() in flora.js lists the ground they must leave bare — add new structures there.
    Two colliders did arrive, for new props that would otherwise be walked through: the
    hovel's water butt and woodpile (HOVEL.barrel / HOVEL.woodpile).
  - The drawn land vs the walked land. terrainHeight() is unchanged and still the only height
    gameplay uses. landHeight() adds hills and far mountains beyond radius 92 (the player is
    held to 78); surfaceHeight() reads the actual coarse facet out there, so far trees sit on
    the ground. The mesh is jittered one-unit cells to ±86, then growing cells out to ~±476.
  - Grass is MERGED per 36-unit ground square, not instanced: InstancedMesh was the slowest
    thing in SwiftShader (the headless tests) and no faster on a real GPU. Blades are lit with
    a constant up-normal on both faces (wind.js `upNormals`), so they shade like the ground.
  - The sky rides the camera with depth off, so camera.far (1000) only has to reach the
    mountains. Fog runs 45→560 (a pale blue haze by day); the far hills are just fogged
    terrain. Clouds are a hand-shaded unlit mesh turning slowly about the valley. (Colours
    and light now follow the hour — see The Turning Sky.)
  - Tone mapping is Neutral (was ACES): the palette's hues survive as painted. Light is a cool
    sky / warm ground hemisphere plus the one shadow-casting sun; the shadow box (±40) follows
    the player in whole-texel steps (`followShadow`), so shadows exist wherever he walks and
    don't shimmer.
  - The game loop sub-steps: a slow frame is simulated as several ≤50ms slices (cap 0.5s), so
    the sim keeps real time at any frame rate. That is what keeps the smoke suite's fixed
    waits honest now that software-rendered headless Chrome runs ~9fps (it was ~24).
  - Pixel governor (main.js `governPixels`): under ~45fps for two straight seconds → the pixel
    ratio steps down, never below 1 and never back up. A safety net for weak hi-DPI machines.
  - Glow without post-processing: additive billboards (sprites.glowSprite) at the fire, hearth,
    lantern and sun, and a CSS #vignette over the canvas. No EffectComposer — it would cost
    MSAA and frame time for little.
  - Measured on this machine's Intel integrated GPU (headless hardware-accelerated Chrome,
    whole frame, each frame forced to finish): old 7.6ms → new 8.6ms at 1080p, 10.8 → 12.0ms
    at 2880×1620 — 60fps needs under 16.6. ~250–280k triangles, 40–106 draw calls.

- The Living Body (2026-11-14): the player got weight and a body that shows it. Asked for by
  the owner ("realistic animations and physics"). No rule, reward or save changed, and the
  numbers the game is balanced on are where they were: walk/sprint/crouch speeds, the leap's
  height (~0.8), the roll's reach (~4.05), the swing's length and the moment it lands (55%).
  What a future session must know:
  - Who owns what. player.js decides what he is doing and where he is; playerAnim.js decides
    how that looks and is the ONLY thing that turns the rig's joints (sleep included — player.js
    just sets `lie01`/`restY`). playerMesh.js exports `RIG`, the bone lengths and joint heights
    both files measure from: move a joint, move its number.
  - The rig. roller (waist) → hips (pelvis) → legs [thigh → shin → foot] and chest (spine at
    the belt) → arms [upper → fore] and head; the stick hangs from a `grip` pivot in the fist
    of arm 1. Sides are 0 (-x) and 1 (+x, the stick hand). ~6 more draw calls than the old
    one-piece limbs. `mesh.roller.rotation.x` is still the lie-down angle the house smoke reads.
  - The stick lies across the fist (2026-11-16, the owner: "hold the stick more realistically").
    It used to run on down the line of the forearm, its butt buried in the wrist. Now a fixed
    `hold` Group turns it `RIG.hold` (1.3 rad, a little short of square) out of the thumb
    side, held near its butt in a leather wrap, with knuckles and a thumb on the stick fist.
    `pose.grip` is the WRIST — 0 straight, cocked back / snapped through within `WRIST`
    (playerMesh.js) — and `pose.twist` turns the forearm about its length first (grip pivot
    order YXZ): 0 thumb forward/up for the chop's hammer blow, about -1.4 palm down for the
    backhand, +1.4 palm up for the sweep, so the level cuts lay the stick flat and whip it
    through tip-last. Walking it is carried pointing down ahead, coming up level in a run.
    Looks only — reach, arc, damage and hit timing are unchanged. The sickle still runs
    down the forearm's line (it hangs on `grip`, not `hold`, with no wrist clamp).
  - The hoe is worked two-handed (2026-11-16, the owner: "make the hoe use the same realistic
    grip"). It hangs on `hold` like the stick, gripped a quarter of the way down the shaft
    (`RIG.hoeDrop`), and the off hand takes the shaft above it (`RIG.hoeOffHand`, negative =
    up toward the end). That hand is SOLVED, not posed: playerAnim.js `graspShaft()` finds
    the spot on the shaft in the chest's frame each step and turns arm 0 onto it — elbow
    from the distance, shoulder as a whole rotation (quaternion, the upper arm's own twist
    included, which no pose channel has) with the elbow hanging toward `ELBOW_POLE`. It is
    blended in by `wGrasp` while working with the hoe out (till and tend), so the hand
    reaches for the shaft and lets go. The arms are short for the shoulders' width, so both
    hands only meet near his middle: HOE_UP/HOE_DOWN bring the hoe hand across (spread1
    -1.1/-0.8) — found by a search for blade-in-the-earth-ahead with the shaft in reach —
    and the off arm's channels in those poses are only the blend's far end.
  - Legs are solved, not swung. Each foot is given a place to be and a two-bone solve bends
    the knee to put it there — on the ground (targets in the figure's ground frame, carried
    into the pelvis's frame each step) or off it (targets from the hip, for the leap, the roll
    and the cot), blended by how far the feet have left the ground. So crouching, landing and
    hills fold the legs with no pose of their own. Feet tilt to the slope under them
    (`player.slope`, felt once per step).
  - The stride is built so planted feet don't skate: a foot on the ground is carried back at
    the body's own pace, as far as the leg can reach. The legs are short for his speeds, so
    cadence is quick and a run is mostly flight; what reach can't cover is the ~10% of skate
    the `body` smoke scenario allows for (it was ~50% before).
  - Layers and springs. The standing/striding pose has the leap, roll, swing and sleep laid
    over it by eased weights; arms, chest and head then pass through springs (follow-through),
    stiffened during a swing. The swing's pose lands at 50% so that, a few hundredths late
    through the springs, the blow arrives as the hit is counted. Separate springs carry the
    lean from speeding up/slowing, the bank of a turn, the landing's sink and the reel from
    a bite. All springs use an exact step — steady at the loop's 50ms slices.
  - Physics (CONFIG.player): speed is gathered at `accel` and shed at `brake` (a stop slides
    a step, a hard turn is carved); mid-leap the keys only nudge (`airAccel`); a wall takes
    away the speed that ran into it (he slides along it, stands against it); a climb costs
    pace and a descent lends a little (`climbDrag`/`descentGain`); Space loads the knees for
    `jumpWindup` before the feet leave; a touchdown keeps `landKeep` of the pace; the roll
    dives in fast and tumbles out slow around the same average `dodgeSpeed`.
  - He faces where he is steered, not where he is moving: a rat's bite shoves him back still
    facing the rat (velocity-facing used to spin him away from it).
  - Three swings (2026-11-15, the owner: "make the stick hit more than just one animation"):
    the chop, a backhand whipped out level to the stick side, and a sweep scythed back across.
    A swing begun within `CONFIG.player.comboWindow` (0.9s) of the last chains to the next
    kind (`player.swing`: 0 → 1 → 2 → 0); a pause starts over with the chop. Looks only —
    cost, reach, arc, damage and the 55% hit moment are the same for all three. Each is three
    held poses in playerAnim.js (`SWINGS`); a fourth is one more row there and a bigger modulus
    in player.js `startAttack`.
  - Footfalls and landings are heard (2026-11-15, asked for by the owner). The animator knows
    when a foot comes down (the stride's phase crossing 0 or ½) and calls `player.onFootstep(weight)`
    — never while standing, airborne, rolling or abed; a touchdown calls `player.onLand(speed)`.
    main.js wires both to `sfx.step` / `sfx.land` (audio.js): synthesized like every other
    sound, pitched a little differently each step, quieter crouched and louder sprinting.

- The Virtues Renamed (2026-11-15), at the owner's request: Strength became Athleticism and
  Agility made way for Intelligence. The save keys changed with the names (`str`→`ath`,
  `agi`→`int`) so the code never says one thing and shows another. Athleticism takes Strength's level;
  old history deeds tagged `str` OR `agi` both become `ath` (lifting and tennis are athletic
  under the new names), so the Tome and the Chronicler never call an old tennis match
  Intelligence. The smoke suite's old-version seeds still carry `str`/`agi` on purpose — they
  are what exercises the migration. Two things the owner corrected the same day (do not undo):
  - Intelligence begins at level 1. v10 first seated it at Agility's old level to spare the
    rank; the owner wanted a new virtue to start like any other, so v10→v11 resets it to
    level 1 / 0 XP and recounts `rank`. Agility's levels are gone for good.
  - Wisdom is LEARNING, Intelligence is CONDUCT. The Sage's prompt gives Wisdom the study,
    coursework, reading, writing and coding (what Wisdom always held), and Intelligence the
    planning, strategy, discipline, judgment and personal finance. The first draft had these
    the other way round (the tabletop-RPG convention) and the owner reversed it.

- The Miller's Strip (2026-11-15): the farming job, asked for by the owner ("Add a Farming
  Job"), who chose a crop that grows across real days over flat daily chores, and coins only
  over coins plus Athleticism. What a future session must know:
  - The rules are three functions in state.js, all taking `now` so the smoke suite can pin
    the clock: `farmJob()` (today's job, or null once it is done), `farmRowLooks()` (what each
    ridge looks like) and `workFarmRow(row)` (work one ridge; pays when the last one lands).
    The `FARM_LOOKS` table there is the whole crop: per job, how a ridge looks once it has had
    that job, while it waits after a night, and while it waits on the day the last job ended.
  - field.js only draws. It knows seven looks (stubble, furrow, sown, weedy, tended, ripe,
    stook) and `draw(looks)` rebuilds the whole strip as two meshes — the earth (a faceted
    heightfield bed with ridges, plus the sheaves) and what grows (blades under the wind
    shader). main.js redraws on the save's 'farm' change. Each ridge-and-look has its own
    seeded stream, so working one ridge never reshuffles its neighbours.
  - The strip is turned on the map (rotY 0.6) and built in world coordinates, as the wind
    shader needs. Anything that asks about it works in field coordinates (u along the ridges,
    v across) through layout.js: `fieldToWorld`, `worldToField`, `fieldGap`, `FIELD`.
  - The meadow was NOT re-rolled. Flora draws its random numbers exactly as before and the
    strip is weeded out afterwards (`ploughed()` in flora.js); the bare earth under it is
    painted in terrain.js `groundColor`, deliberately not in `dirtAmount` (flora reads that
    mid-draw). Adding the field to keepClear() or dirtAmount would move every tuft and flower.
  - One interactable, `field.spot`, re-aimed every step by main.js `aimFieldSpot` at the
    nearest ridge that still wants today's job (any ridge once the job is done — E then only
    says what the strip is waiting on). No prompt shows while he is working.
  - Player mode `work`: rooted and turned to the ridge for `CONFIG.farm.strokes` ×
    `strokeTime` seconds; `onWorkStroke` (sounds) and `onWorkDone` (main.js works the ridge)
    fire from player.js. The hoe and sickle are hidden Groups in the stick hand
    (`mesh.tools`); `takeUp()` swaps them for the stick, `stopWork()` puts it back — also on
    death and respawn. Poses are [drawn, struck] pairs in playerAnim.js (`WORK`): a fifth job
    is one more row there, one in `FARM_JOBS`/`FARM_LOOKS`, and a look if it needs one.
  - The miller himself is unchanged — still mute, his E still tallies rats. "The miller
    pays" is flavor, as with the bounty. No panel, no HUD element: toasts only.
  - Bigger, farther, more of a farm (same day, at the owner's word: "4 times the size, look
    more realistic and farther away from the village"). It began as 5 ridges × 6.4 at (11, -9)
    by the Quest Board; it is now 10 ridges × 12.8 at (27, 33), 43 units out and 27 from the
    granary (the rats roam to ~11, though the walk there passes their yard), on ground that
    rises ~1.5 across it, 11.8 from the nearest tree or boulder. A day's job is therefore ten
    ridges; the pay was left as it was.
  - The yard (field.js): a split-rail fence round a 1.3 headland with the gate standing open
    in the middle of the village-ward side, seed sacks inside it, a hayrick outside, the
    scarecrow on the far headland. The field is turned, so rails cannot be box colliders:
    each run of fence is a string of small circles (r 0.22 every 0.4) too close to pass —
    about 135 colliders, with the gate leaf, the rick and the scarecrow's stake. The only way
    in is the gate.
  - The cart track from the gate to the granary yard is paint only (`trackGap` in
    layout.js, drawn in terrain.js `groundColor`; flora thins its middle after the draw).
    It is not a dirtPatch, for the same reason the field is not.
  - The bed's edge is ragged on purpose (its outer ring of points is pushed out unevenly and
    sunk); ripe wheat is sown six lines to a ridge so the ridges close into one crop, in a
    handful of golds; a stook is four sheaves leaned together. What grows on a ridge under a
    look is built once and cached, so a redraw is ~4ms after the first (~19ms).
    About 4 draw calls; ~20k triangles when the whole field stands in wheat.
- The Setting (2026-11-15), the owner's choice: Crownbound takes place in **England, around
  1250** — the High Middle Ages. Everything new should fit that year: watermills and windmills,
  smiths, longbows and crossbows, chainmail, timber-and-thatch, silver pennies, hand-copied
  books are in; guns, printing, mechanical clocks, full plate armour, potatoes, coffee, tea
  and forks are not. Glass windows exist but are a luxury (hence the shop's price). The
  setting is a design guide ONLY — the owner does not want the period mentioned in the game
  (corrected the same day): no year, century or country in any in-game text or AI prompt.
  The Chronicler is told to name no year, century or country and to avoid those
  anachronisms; the Sage's prompt just says "medieval". The thee/thy voice and the
  IM Fell font are later (1600s) but stay — the style, not the history.
- The Map of the Kingdom (2026-11-15), asked for by the owner ("Create a Kingdom map and add our
  village in it, keep the game boundaries the same for now"; the village's name was left to
  Claude). M opens and closes it (nothing while asleep, dead or under another panel; Esc also
  closes). No save change, no world change — the walkable world is exactly as it was. What a
  future session must know:
  - Names. The village is **Brackenley** ("the clearing among the bracken" — the flora has
    ferns), the kingdom **Aldermere**, the great lake at its heart **Lake Laney** (named by the
    owner, 2026-11-16; it was first "the Alder Mere"). All three live in `CONFIG.realm`; the
    Charter's key list reads the first two. Every other place name on the map
    (Kingsholt the royal seat, Hollin Cross, Saltmouth, Edricminster, Wendham, Coldbrook,
    Whitwold Abbey, Fellgate; the Grimfells, the Brackenwood, Blackmoor, the King's Chase, the
    Marches, the Whale's Road) is fixed art in map.js, with a hover note each. All fictional —
    the setting rule holds: no real country, year or century appears.
  - Two sheets. The realm (1000×700 SVG) is drawn once per load from seeded rng(1250) and
    cached; it is a picture only, no place on it can be visited. The village plan beside it is
    redrawn every time the map opens, from the game's own data: LAYOUT positions and turns, the
    path (`pathX`), the strip (`fieldToWorld`, each ridge coloured by today's `farmRowLooks`),
    the real trees and boulders (`world.mapMarks`, scatter's own arrays), the cart only on a
    market day, the bounds (radius 78) — and the player as a red arrow along `player.facing`.
    Two zooms: The Green (the village's heart) and The Bounds (all the walkable land); the
    first open picks by where he stands, then the choice holds for the session.
  - North. The plan is drawn north-up with the world turned by `NORTH` (0.45 rad, layout.js
    since The Turning Sky — the sun rises and sets by it too): that puts the miller's strip
    to the north-east, as the Charter says. The realm's roads agree: the village path leaves east-north-east for
    Hollin Cross and west-south-west for the Marches.
  - Wiring: panels.js `openPanel('map')` calls `renderMap(body, mapView())`; `mapView` is a hook
    main.js passes to initPanels. panels.js now exports `closePanel` and `openPanelId`.
  - The Chronicler knows the village (2026-11-16, the owner's ask): his charge names Brackenley
    and the kingdom from `CONFIG.realm` and tells him to name the village in every entry. The
    `chronicle` smoke scenario checks the charge it was sent (the stub can't judge real prose).

- The Turning Sky (2026-11-16), asked for by the owner ("make the game know what time zone
  you are in so it can have a daylight cycle based on what time it is you are playing").
  Looks only: no rule, reward or save changed. What a future session must know:
  - The clock is the browser's. `new Date()` is already in the player's time zone, so nothing
    is asked of him and nothing is stored. daylight.js `skyAt(date, latitude)` is the whole
    reckoning and is pure: the sun from the hour and the day of the year (so days are long in
    June and dark by five in December), the moon from her true age (a new moon in 2000 counted
    forward — her phase in the game is tonight's real phase), summer time taken back off
    (`solarHour`: the clocks go forward, the sun does not). What it cannot know is WHERE the
    player is: `CONFIG.sky.latitude` (45°N) sets the length of the days, and his place inside
    his time zone is unknown, so dawn and dusk can run ~20–30 minutes off the window. Asking
    the browser for his location would fix that and was deliberately not done (a permission
    prompt for a few minutes of sunset).
  - sky.js paints it. `LOOKS` is the whole palette: six rows keyed by the sun's height
    (night −14°, late dusk −8°, dusk −4°, sunset 0°, golden 6°, day 20°+), every colour and
    light strength blended between rows; dawn wears dusk's rows. The day row IS the old fixed
    look. To re-tune a time of day, edit its row.
  - Repainted on a slow beat, not per frame: `CONFIG.sky.refresh` (5s) → dome vertex colours,
    cloud facets (~22k vertices relit by hand), sprites, lights, fog. Per frame only the dome
    riding the camera, the cloud drift and the shadow box.
  - One key light still (the perf rule holds): the sun by day, the moon by night. Its power
    is zero between the two dusk rows, and that is when it changes hands (at −6°), so the
    beam never swings while lit. By night it falls from the moon when she is up, else from a
    fixed `STARLIGHT` quarter, and a fuller moon lights the night better. The beam never lies
    flatter than 18° (`LOWEST_BEAM` — raking light speckles the shadow map); the SEEN sun
    still sinks to the hills. `followShadow`'s axes are re-laid at each re-aim.
  - Sun, moon and stars are drawn straight after the dome and before any land: additive,
    no depth, renderOrder −9, and deliberately `transparent: false` (a transparent flag would
    send them to the late pass, on top of the mountains). So land and clouds cover them for
    free. Stars are one Points call, hidden by day; the moon's face is a canvas texture drawn
    at load for the night's phase.
  - Unlit things read `daylight` (daylight.js): smoke is tinted by `daylight.veil`
    (particles.js `uVeil`), butterflies too; birds and butterflies are hidden once the sun is
    4° down; motes dim. The hovel's window shows the sky's colour from within and firelight
    from without after dark (world.js `sky.onLook`). Fires, the hearth and the lantern were
    already lights — night is simply when they show.
  - Night is tuned to be played in (most sessions will be evening ones): about a quarter of
    day's brightness, blue, with the campfire the brightest thing in the village. If it reads
    too dark on the owner's screen, raise `hemi` / `keyPower` in the night row.
  - `?hour=17.5` holds the sky at that hour of today (any hour, for a look); the smoke suite
    opens every page with `?hour=13` so screenshots do not depend on when it is run.
    `__game.sky.setClock(date)` pins any moment; `sky.state` is what was last painted.

- The Proving Ground (2026-11-16), asked for by the owner ("Create a Seperate Crown Bound world
  for Testing where I can create my own commands such as reset my stamina to full, Level me up
  to sage, etc"). A second world on the same page: `?test=1`. The Tome's last section is the
  door both ways; the banner's Leave and the `leave` command go back. What a future session
  must know:
  - The separation is one constant. `SAVE_KEY` (proving.js) is `crownbound_save`, or in the
    test world `crownbound_test_save`, and state.js reads and writes nothing else. In the test
    world the true save is read by one function (`copyTrueSave()`, the `copy` command) and
    written by none; the dev save mirror is inert there. `commit()`, `wipeSave()` and
    `copyTrueSave()` (state.js) return at once outside the test world, so nothing in the true
    world can hand-edit the save. The `proving` smoke scenario ends by checking that the true
    save's text is the same to the letter after every command has run.
  - Shared by both worlds, being the device's and not the save's: the Sage's key (so the
    Sage and the Chronicler work — and spend — in the test world too) and the mouse feel.
  - The moved clock. The test world swaps `globalThis.Date` for `MovedDate`, which runs
    `shift` ms ahead for "now" only (`new Date()`, `Date.now()`); dates built from a value are
    untouched. So `nextday` is a stored count of days plus a reload, and the ordinary load
    path — rollover, market day, the dawn verdict, the sky, the Chronicler's weeks — finds a
    new day with no test-only branch anywhere in the game. This is why
    `import './proving/proving.js'` must stay the first line of main.js. `time 7:30` moves the
    hour at once (same day, nothing to roll over). Stored in `crownbound_test_clock`
    `{ days, ms }`; cleared by `time real`, `reset world` and `copy`.
  - Commands are a table: commands.js `COMMANDS`, each `{ name, also, group, usage, about,
    run(args, game) }` — `help` is drawn from it. Where the game has a function the command
    calls it, so it tests the real rule: `rank king` holds the real Coronation (addXp),
    `stamina 0` the real walk home (drainStamina), `daily` the real completion. Only what no
    rule does (set a level, a streak, a purse) is edited on `getState()` and then
    `commit('coins' | 'stats' | …)`-ed. `game` is the handle main.js gives `initConsole`:
    player, world, rouse, moveTo, applyPurchases, abed, typing, busy.
  - The built-ins: stamina, heal, hp · rank, level, xp · coins, streak · daily, weekly,
    monthly · nextday, time · tp, market, give, take, farm · reset, copy, leave. "Sage" is
    not a rank — `rank sage` answers with the ladder (Peasant … King) and changes nothing.
    Setting levels below King takes the crown back, so the Coronation can be tried again.
  - The owner's own commands: `make fresh = stamina full; heal` then `fresh`; `forget fresh`.
    `$1`, `$2` are filled from the words typed after the name; `;` chains commands, stopping
    at the first refused. Kept in `crownbound_test_commands`, outside the save, so
    `reset world` keeps them. They cannot take a built-in's name.
  - The command line is not a panel: the sim runs on under it, so a command's effect is seen
    at once. Its input stops key events reaching the game, and `typing(true)` lets go of the
    player and frees the mouse (so the first Esc closes the line instead of being spent on
    the pointer lock). `/` or the backquote opens it — not under a panel or mid-nap, but it
    does abed.
    Commands that only take hold on a load (nextday, market, copy, reset world, reset rats)
    reload the page and leave their line in sessionStorage to be shown on return.
  - `rouse()` (main.js) is for the console alone: stamina handed back gets him up from any
    stage of going to bed spent. `restTimer` holds the tuck-in's and the hurry's timeouts so
    it can call them off.
  - `importSave` now seals the session (`sealed`, state.js): once the stored save has been
    replaced — a Scribe restore in either world, a wipe, a copy — nothing more is written
    before the reload, so a stray step cannot put the old save back.
  - Not told in the game: the Charter has no section for it (it is a tool, not a rule).
    CROWNBOUND-Guide.docx has one (in scripts/build-guide.py, after Saving).

## Roadmap (do NOT build before its phase)
- **v2 — The Living Village**: 2–3 NPC villagers with AI-driven dialogue via the Anthropic API;
  The Chronicler writes weekly journal entries in medieval prose from the history log.
  (The API plumbing — SDK, key management, fallback pattern — arrived early with the Sage, 2026-07-04.)
- **v3 — Coin & Commerce**: festival mini-games, rotating cart stock, more gear tiers and home
  upgrades. (The chapman's cart itself arrived early, 2026-07-03 — coins already have their sink.)
- **v4 — Bonds & Bloodline**: relationships, courtship, marriage, family — gated by sustained streaks.
- **v5 — The Ascension Arc**: Squire/Knight/Lord chapters, real enemies (wolves, boar, bandits),
  Wisdom-based alternate solutions, militia, the Coronation ceremony (the trigger already
  fires at King; v5 builds the event around it).

Ideas not yet on this roadmap live in `IDEAS.md`, each under its own name (The Finer Virtues —
substats; Kingdoms — multiplayer, in two rival shapes, The Homelands and The Four Crowns).
They are the owner's notes, not plans — never build from that file unasked, and add new loose
ideas there, named, rather than here.

## Working agreement
- Ask before adding any feature not in the spec. Scope discipline is a feature.
- Readable code over clever code — this will be iterated on for a year.
- Commit after each milestone. Keep the Build status below current so any session can resume instantly.
- Publish without asking (the owner, 2026-11-15: "commit, push, merge and deploy whatever I tell
  you to do to save time"). When requested work is done and the smoke suite passes: commit,
  push `main` (merge `origin/main` first if the push is refused — never force-push `main`),
  and deploy to Pages by the recipe in Session notes. Say plainly if a step failed.

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
- [x] Post-v1 — "The Miller" (2026-07-03): the bounty-payer made flesh — flour-dusted figure
  in the granary yard, breathing sway, E toasts today's rat tally. No save change.
- [x] Post-v1 — "The Reckoning" (2026-07-03): the Treasury becomes a monthly financial
  statement — pledge, four-line monthly rolls with verdicts, cumulative named summits with a
  conquered-goals list, all in the Treasury panel (no world changes). saveVersion 7.
- [x] Post-v1 — "The Breath of Life" (2026-07-04): the three villagers stop being statues —
  visible layered breathing, head-tracking of the player, idle arm fidgets, and a first-approach
  nod + greeting toast (clerk's line is reckoning-aware). No save change.
- [x] Post-v1 — "The Miller's Rounds" (2026-07-04): the first villager who walks — a slow
  three-point amble around the granary yard with a waddle-and-bob gait, pausing to work at each
  corner and stopping when the player comes near; prompt and collider follow him. No save change.
- [x] Post-v1 — "The Sage" (2026-07-04): AI names the virtue of each completed deed (Anthropic
  API, browser-direct; key appointed in the Tome, kept outside the save). Verdict is final;
  the manual picker is every failure's fallback. First API integration — v2 groundwork.
  No save change. (2026-07-06: model retuned to claude-haiku-4-5-20251001 — a one-word verdict
  needs no Opus, and Haiku stays well inside the 8s timeout. 2026-11-16, the owner: both AI
  uses — the Sage and the Chronicler — moved to claude-haiku-5-5, in CONFIG.sage / CONFIG.chronicler.)
- [x] Post-v1 — "The Scribe's Mirror" (2026-07-06): dev-only auto-backup to one file. Every
  state change is pushed (debounced 1s + pagehide beacon) to a vite dev-server endpoint
  (/__save, vite.config.js plugin) that keeps saves/crownbound-save.json current; a browser
  that boots with NO save adopts the file and reloads through the normal vet path (Scribe
  pattern). Inert in builds, so the smoke suite never sees it. Dev script pinned to
  --port 5173 --strictPort — the owner lost progress to Vite silently bumping to 5174
  (localStorage is per-origin, so a new port is a blank save). saves/ is gitignored.
  No save change.

- [x] Post-v1 — "The Steady Hand" (2026-07-06): the "swimmy" camera fixed — pointer lock asks
  for raw input (unadjustedMovement, plain-lock fallback) and the orbit answers the mouse
  rigidly: a smoothed pivot chases the player (wheel zoom eases via its own smoothDist), but
  yaw/pitch place the camera directly each frame. setView snaps the zoom for smoke shots.
  No save change.
- [x] Post-v1 — "The Reins" (2026-07-06): mouse sensitivity became three feels
  (gentle/steady/swift, CONFIG.mouse) picked in the Tome; the choice lives in
  src/state/prefs.js — a device preference in its own localStorage slot OUTSIDE the save
  (sage-key pattern), read live so a Tome change takes hold at once. No save change.

- [x] Post-v1 — "The Laid Parchment" (2026-07-06): panels ease in — a 160ms fade + settle
  (scale 0.98, 8px rise) on the panel and a dim-in on the overlay, CSS-only, replaying on each
  unhide; close stays instant; prefers-reduced-motion disables both. No save change.

- [x] Post-v1 — "The Willing Reins" (2026-07-06): the mouse connects itself — any movement key
  (WASD/arrows/Space/C/Shift, deliberately not E or Esc, which drive panels) requests pointer
  lock exactly like a canvas click, so play never demands a deliberate click: W after boot or
  after closing a panel takes the reins at once. A page can never seize the mouse with no
  gesture at all — browser rule, no way around it. Lock-denied rejections are swallowed
  (automated contexts). No save change.

- [x] Post-v1 — "The Hanging Tag" (2026-07-06): the E-prompt anchors to its object — main.js
  projects a point 2.0 above the target's terrain through the camera each frame (after the
  orbit settles, so no one-frame trail) and hud.placePrompt sets the transform; the tag grew a
  little down-pointing tail. Behind-the-camera hides it; near-edge positions clamp into view,
  so an off-screen target pins the tag at the viewport edge toward it. The miller's tag follows
  him for free (his interactable spot is mutated live). No save change.

- [x] Post-v1 — "The Quill" (2026-07-06): the OS arrow replaced by an ink quill cursor —
  a data-URI SVG in ui.css (--cursor-quill; ink fill, parchment outline so it reads on the
  dark scene, nib-tip hotspot) on body and buttons alike; text inputs keep their I-beam
  (UA default outranks inheritance) and pointer lock hides the cursor as ever. No save change.

- [x] Post-v1 — "The Vital Signs" (2026-07-06): HUD hierarchy — the HP bar throbs (border
  glow pulse) at ≤30% and not at 0 (respawn refills); the stamina bar's gold grays out when
  too spent to swing (< attackCost, config-read); the streak flame row pops (scale + gold
  flash) when the streak grows, never on a load's first paint. All three sit in the existing
  prefers-reduced-motion block. No save change.

- [x] Post-v1 — "The Loose Reins" (2026-11-13): mouse-look where pointer lock is refused.
  Embedded browser panes (the Claude desktop app's pane) reject requestPointerLock with
  WrongDocumentError, so the view never turned there. camera.js now falls back to hold-and-drag:
  left button held on the scene turns the view, and — only once a lock request has actually
  been denied (`lockDenied`, cleared if a lock is ever granted) — a press that travelled under
  5px is handed to `setOnTap` (main.js wires it to player.attack, gated on player.isEnabled).
  Browsers that grant the lock behave as before. Verified by hand in the pane (drag turns,
  click swings); the full smoke suite passed afterwards (run in Chrome).
  Also added .claude/launch.json (dev server on 5173). No save change.

- [x] v2 — "The Chronicler" (2026-11-13): the first true v2 arrival. Each finished week gets
  one short entry of medieval prose written from the deed history + sleep log, under the sage's
  key (`sageKey()` exported from sage.js; no key, no chronicler). main.js calls
  `keepChronicle()` once after boot, off the critical path; a written entry raises one toast
  and is read in the Tome's "Weekly Chronicle" section (newest first). His laws
  (src/ai/chronicler.js): weeks with no deeds are marked blank for free (no API call); at most
  ONE written entry per load, so a long absence catches up a week per session; any failure
  writes nothing and the next load is the retry; entries always land in week order.
  `state.chronicle` + `addChronicleEntry` (emits 'chronicle'), CONFIG.chronicler, saveVersion 8.
  Tested with a stubbed API only — no entry has yet been written by the real model.

- [x] Post-v1 — "The Open Road" (2026-11-13): deployed. Public repo
  github.com/agouraninja-cmd/crownbound; the game is served by GitHub Pages at
  https://agouraninja-cmd.github.io/crownbound/ from the `gh-pages` branch (built files only).
  vite `base: './'` so the build runs under the /crownbound/ sub-path. The hosted origin has
  its OWN blank save (localStorage is per-origin) and no save mirror — carry progress across
  with the Tome's Scribe export/restore. No save change.

- [x] Post-v1 — "The Renovation" (2026-11-13): the graphics rebuilt top to bottom under the same
  art rules (procedural, low-poly, flat-shaded, no model files). Sky: gradient dome with a sun,
  drifting low-poly clouds, distance fading into blue haze. Land: jittered faceted ground with
  noise-driven colour, rising into wooded hills and far mountains. Woodland: pines, oaks and
  birches (some autumn-turned) that sway in the wind, mossy boulders, a backdrop forest; grass
  tufts, meadow grass, wildflowers, ferns, bushes. Buildings: a timber-framed daub hovel under
  layered thatch, a boarded granary, detailed booth / boards / lectern / cart, each baked to a
  few draw calls. Characters: a new jointed hero (hair, face, woad cowl, belt, boots),
  villagers with faces and hands, rounder rats. Life: tongues of flame, sparks, woodsmoke,
  hearth smoke from the roof, motes, birds, butterflies. No gameplay, rule or save change;
  the original 57 scatter colliders are unchanged (+50 new tree colliders: 46 in the outer ring,
  4 hand-set at the village edge; +2 beside the hovel). All 18 smoke scenarios pass. Details:
  "The Renovation" under Noted decisions.

- [x] Post-v1 — "The Lid" (2026-11-13): the chest beside the cot opens. E (inside only)
  swings its lid up off the back edge on its own pivot Group (`hovel.chestLid`, eased like the
  door) to show a peasant's goods — a folded tunic, a coin pouch, a whetstone — with a flavor
  toast; E again lowers it. Pure scenery: it holds no items, touches no state, and the lid
  isn't saved (each load starts shut). The cot crowds its front, so you stand at its corner,
  against the -z wall. No save change.

- [x] Post-v1 — "The Larder" (2026-11-14): the chest stores things. One weapon in hand, the
  rest in the chest, swapped in the Chest panel; loaves from the cart go to its larder (cap 6)
  instead of being eaten on the spot, and are eaten there when wounded. The lid now opens with
  the panel and lowers when it closes. v8→v9 migration puts the best owned weapon in hand (the
  old behaviour). The Charter's Chapman section mentions the larder. Stored items aren't drawn
  in the chest — the quarterstaff alone would be twice its length. saveVersion 9.

- [x] Post-v1 — "The Living Body" (2026-11-14): realistic movement and animation for the
  player. A new jointed rig (knees, ankles, elbows, a spine) driven by a procedural animator:
  a real stride with planted feet, a run with flight and arm pump, leaning into starts and
  back from stops, banking through turns, a leap that loads, floats and lands on folding
  knees, a tucked shoulder roll, a full-body overhead swing, a reel when bitten, breathing
  and wandering weight at rest, feet laid to the slope. Movement has momentum: wind-up,
  sliding stops, carved turns, little air control, walls that stop him, hills that slow him.
  Speeds, leap height, roll reach and hit timing unchanged; no save change. New smoke
  scenario `body`. The suite was run on Linux in a cloud container, not on the owner's
  machine: all 19 scenarios passed there, `house` and `combat` each only on a re-run (a
  stalled frame outran a fixed wait — see Session notes). Details: "The Living Body" under
  Noted decisions.

- [x] Post-v1 — "The Three Blows" (2026-11-15): the stick has three swings instead of one —
  chop, backhand, sweep — chained when swung in quick succession. Animation only: every swing
  costs, reaches and hits as before. `body` smoke scenario extended; `body` and `combat` pass
  (cloud container). No save change.

- [x] Post-v1 — "The Tread" (2026-11-15): footsteps and landings have sound — a soft scuff
  per footfall in time with the stride, a thump coming down from a leap. `body` smoke scenario
  checks the events fire (it cannot hear them); the sounds themselves are untested by ear.
  No save change.

- [x] Post-v1 — "The Virtues Renamed" (2026-11-15): Strength → Athleticism (`ath`), Agility →
  Intelligence (`int`); Wisdom and Influence unchanged. Stat keys renamed throughout (state,
  dummy, Sage prompt, Charter, CROWNBOUND-Guide.docx); v9→v10 migration moves Strength's level to
  Athleticism and re-tags old str/agi deeds as athletic; v10→v11 starts Intelligence at
  level 1 (Agility's levels dropped, rank recounted). The Sage reads Wisdom as learning and
  Intelligence as planning/discipline/judgment/money. saveVersion 11. Details: "The Virtues
  Renamed" under Noted decisions.

- [x] Post-v1 — "The Miller's Strip" (2026-11-15): the farming job. A fenced ten-ridge wheat
  field out past the granary (gate, hayrick, cart track, scarecrow), worked one job per real day — till, sow, weed, reap — with a
  hoe, a sowing hand and a sickle, so the crop grows across the days you turn up: stubble,
  furrows, seed, shoots and weeds, clean shoots, standing wheat, sheaves. The miller pays 4
  coins a working day and 20 at harvest; coins only, never XP. A scarecrow marks it; the
  Charter gained a section. saveVersion 12. New smoke scenario `farm`; all 20 scenarios pass
  (run on the owner's machine, headless Edge). Looked at in the Browser pane on the real GPU;
  the three work sounds are untested by ear. CROWNBOUND-Guide.docx was NOT updated — it has
  fallen well behind the game (it still speaks of a dated Coronation and no shop). Details:
  "The Miller's Strip" under Noted decisions.

- [x] Post-v1 — "The Long Road" (2026-11-15), at the owner's request ("4 times more stamina but
  make walking and running drain stamina"): caps ×4 (240 base, 480 after the daily, Well-Rested
  +40), attack/dodge costs unchanged. Walking costs 0.25/s and sprinting 1/s on the ground,
  gathered in `player.fatigue` and paid in whole points through `player.tire` →
  `drainStamina()` (state.js; takes down to 0, never refuses) so a save happens at most once a
  second. A dry pool refuses the sprint (`player.canSprint`) and combat, never the walk. The
  Charter's Stamina section lists both drains. `body` smoke scenario checks the toll; seeds
  and expected numbers in other scenarios were moved to the new caps. No save change.

- [x] Post-v1 — "The Map of the Kingdom" (2026-11-15): M unrolls a hand-drawn map of the
  Kingdom of Aldermere — coast and sea, the Grimfells, the lake, rivers, woods, roads,
  the royal seat of Kingsholt and seven more places, Lake Laney at its heart, each read aloud on hover — with the home
  village, Brackenley, ringed in wax. Beside it, a plan of Brackenley drawn live from the game's
  layout (buildings, real trees, today's crop on the strip, the bounds, the player's arrow), in
  two zooms. The walkable world is unchanged. No save change. New smoke scenario `map`; all
  21 scenarios pass (cloud container, headless Chromium, run on top of The Long Road). Not yet seen on the owner's machine.
  Since then (2026-11-16): the lake renamed Lake Laney, and the Chronicler names Brackenley in
  every entry. `map` and `chronicle` pass.
  Details: "The Map of the Kingdom" under Noted decisions.

- [x] Fix — "The Cot Within Reach" (2026-11-16), the owner: "I can't sleep in the bed". E
  never offered the cot: its prompt was measured from the cot's middle, which no one can
  stand near (the cot and the hearth hem it in), so from every spot the player could reach,
  the chest, the ledger or the door was nearer and won. The cot is now measured from its
  open corner (`HOVEL.bedReach`, radius 1.2): stand on the floor at the cot's foot-corner
  and E sleeps; the chest is opened from its corner against the -z wall. The sleep pose
  still lies on the cot's centre (`bedRest`). The `house` smoke scenario now walks up and
  presses E instead of calling `sleepAtCot()` directly (which is how this slipped by);
  `house` and `market` stand at the chest's new spot. No save change.

- [x] Post-v1 — "The Hearthside" (2026-11-16), asked for by the owner ("after 2 seconds of
  standing near the fire pit the player sits down to warm up"): stood still within
  `CONFIG.player.sitNear` (2.0) of the campfire for `sitDelay` (2s), he turns to the flames and
  sits on the ground — knees drawn up, palms held out, now and then rubbing his hands, the
  stick laid aside. Too close to the ring, he shuffles back to `sitSeat` (1.45). Any movement
  key, Space, C, a roll, a click or a bite stands him up; the click swings nothing, and his
  pace is held back while he finds his feet (`sit01`). Looks only — no rule, reward or save
  change. The spawn (2.2 from the fire) is deliberately just outside the range, so a load
  doesn't sit him down. Player mode `sit` (player.js), the `SEAT` layer (playerAnim.js, feet in
  the ground frame so the knees solve themselves), a line in the Charter's fire section. New
  smoke scenario `hearth`; all 22 scenarios pass (cloud container, headless Chromium —
  `exchequer` only on a re-run: its fixed 400ms wait read the prompt before a frame drew it);
  after merging The Cot Within Reach, `hearth`, `house`, `market` and `body` pass again on
  the merge. Not yet seen on the owner's machine.

- [x] Post-v1 — "The Honest Grip" (2026-11-16): the player holds the stick like a real fist
  does — across the palm near its butt, in a leather wrap, wrist cocking and snapping it,
  forearm turning the hand over for the level cuts — instead of the stick continuing the
  line of his arm. Carried pointing down ahead of him at rest, up level in a run. All three
  swings re-posed (the chop is a hammer's blow; the backhand and sweep whip flat). Animation
  only; no rule or save change. All 21 smoke scenarios pass (cloud container, headless Chromium), `guide` only on a re-run (its 400ms prompt wait read a stalled frame — see Session notes). Seen only in a pose bench, not yet on the owner's machine. After merging The Hearthside (its SEAT pose's wrist is in range; the stick is laid aside seated) `hearth`, `body` and `combat` pass on the merge; `house` passes all but its first check (the closed door pushing him out), which failed the same way on plain `main` — no frame drew inside its 300ms wait. Details: under "The Living Body" in
  Noted decisions.

- [x] Post-v1 — "To Bed, Spent" (2026-11-16), at the owner's request ("when stamina hits 0 make
  the user automatically walk to his bed and go to sleep... tell the player he can start playing
  again tomorrow... something motivational... talking to himself"). At 0 stamina: control lets
  go, he walks home on a route from src/player/pathfind.js (grid A*, 0.5 cells, colliders grown
  by 0.45, string-pulled; static colliders only — main.js hurries him home if he stalls 3s or
  no route exists), opens the door, crosses to the wake spot, tucks in, and src/ui/rest.js
  shows his line (one per day, from a done/owed list) + "Come back tomorrow". `player.route`
  steers in place of the keys at `homewardPace` 0.8; `player.lieDownAt` puts him abed at once
  for a load on a spent day. State: `stamina.spent` (set at 0 by spend/drain, cleared by the
  new day's pool; also set on a same-day load at 0), `staminaSpent()`; completeDaily and the
  Well-Rested grant don't refill a spent pool. The earlier "a dry pool can still walk, not
  sprint" rule (`canSprint`) is gone. Decisions taken without asking (owner may revisit): the
  ledgers stay usable from bed, a daily from bed doesn't wake him, the walk home records no
  bedtime ("Retire for the night" does). New smoke scenario `spent`; `fire` now spends to 1.
  No saveVersion bump (absent `spent` = false).
  Same day, the owner revisited one of those: "make doing the daily from bed refill stamina".
  completeDaily refills unconditionally again (the fresh pool drops `spent`), and main.js
  `wakeFromRest` stands him up by the cot with a toast and hands back the keys once the board
  closes. The card's owed-deed line now promises that. `spent` checks the refill, the rise,
  and a second emptying (daily done) putting him back abed for good.

- [x] Post-v1 — "The Chapman's Pictures" (2026-11-16): every ware on the cart has a picture —
  an ink-and-wash drawing beside its row in the shop (the cudgel, the quarterstaff, the rug,
  the door paint, the glass pane, the garden plot, the loaf, the mounted rat, the candle
  lantern), drawn in code like the Map; wares above the player's rank are faded. The Chest
  panel shows them too — each weapon (the stick drawn for it) and the larder's loaf. Click a
  picture (or "Read more") to unfold what the ware is, how to use it and what it does for
  thee, numbers live from config. No save change. `market` smoke scenario checks each ware
  has its picture and its read-more in the shop and the chest, and screenshots the shop. All
  21 scenarios pass (cloud container, headless Chromium; `house` and `exchequer` each only on
  a re-run alone — the fixed-wait stalls described in Session notes); after merging The Cot
  Within Reach, The Hearthside and The Honest Grip (the read-mores now send the player to
  stand at the chest, where the cot fix moved its E), all 22 pass on the merge, first time.
  After merging To Bed, Spent: `market`, `spent`, `fire`, render and `house` pass on the merge
  (`house`'s closed-door check failed twice straight after a busy run, then passed three
  times alone — plain `main` behaved the same). Not yet seen on the owner's machine.
  Details: "The wares have pictures" under Noted decisions.

- [x] Post-v1 — "The Turning Sky" (2026-11-16): the sky keeps the hour of the player's own
  clock. The sun rises in the east, crosses the south and sets in the west at the real time
  of day (long days in summer, early dark in winter); dawn and dusk colour the sky, the
  clouds and the light; night brings stars, the moon in her true phase, moonlight, a lit
  window in the hovel and the campfire as the village's light. Birds and butterflies keep
  the sun's hours. Looks only — no rule or save change. New smoke scenario `sky`. After merging
  The Hearthside, The Honest Grip and To Bed, Spent, all 24 scenarios pass first time (cloud
  container, headless Chromium; `exchequer` and `market` now wait for their prompt instead
  of a blind 400ms — see Session notes). After merging The Chapman's Pictures as well (UI only),
  `''`, `sky`, `market` and `house` pass on the merge.
  Seen only in a cloud container's software renderer, not yet on the owner's screen — the
  night's brightness in particular wants his eye. Details: "The Turning Sky" under Noted
  decisions.

- [x] Post-v1 — "Two Hands on the Hoe" (2026-11-16): the hoe gets the stick's grip — across
  the fist, not along the arm — and both hands: the stick hand a quarter of the way down the
  shaft, the off hand above it, solved onto the shaft every step. The stroke re-posed: both
  fists raised before his chest with the shaft standing tall, then dropped to his belt with
  the wrist snapped so the blade bites the earth ahead. Tilling and weeding only; sowing and
  reaping as before. Looks only; no rule or save change. `farm`, `body`, `combat` (on a
  re-run — the second dummy swing's fixed wait) and `''` pass (cloud container, headless
  Chromium); seen only in a pose bench, not yet on the owner's machine. Details: under
  "The Living Body" in Noted decisions.

- [x] Post-v1 — "The Plain Ledger" (2026-11-16): the Treasury made to make sense, at the
  owner's word ("make the treasury make more sense" — the save showed it never used). Same
  rules and data; the panel rewritten. Every figure is a labelled field with a line of help
  in plain words (savings, goal, monthly pledge, income, spending, put into savings, savings
  now), the medieval names kept for headings only. A "How the Exchequer works" list (open
  on an untouched ledger, which also shows The Terms before the reckoning). The goal shows
  % and amount to go, and months left at the pledge. The reckoning judges live as you type
  (left over, savings change, the verdict and why); "Savings now" follows savings + "put
  into savings" until typed over; a blank figure is refused (it used to file as 0 and could
  zero the savings). The goal can be renamed under The Terms. The rolls show a verdict
  legend and each month's closing savings. The Charter's Two Purses paragraph rewritten to
  match. No save change.

- [x] Post-v1 — "The Coffer" (2026-11-16): the Treasury rebuilt to be glanced at and used in a
  minute. A coffer that fills with coin, the savings in large numerals, a track to the goal
  with quarter marks and the date the pledge reaches it, and this month's pledge filling as
  coin is laid in. One thing asked at a time: three opening questions on a fresh ledger; a
  reckoning of two figures (income and spending optional); wax seals for the verdicts with a
  line of what to do next; "Lay in coin" any day real money goes into savings; months past
  (a bar chart of the climb and the rolls), goals won, the plan and the how-to folded away.
  New: `treasury.laid`, `layIn()`, rolls without earned/spent, the two-figure verdict — no
  saveVersion bump (absent `laid` = {}). The Charter's Two Purses paragraph rewritten.
  `exchequer` and `reckoning` smoke scenarios rewritten for it. All 24 scenarios pass, first
  time (cloud container, headless Chromium). Seen only there, not yet on the owner's screen; the coin sound on laying in is untested by ear.
  Details: "The Coffer" under Noted decisions.

- [x] Docs — "The Guide Caught Up" (2026-11-16), the owner: "update the CROWNBOUND-Guide.docx
  to match the game". The out-of-game guide had stopped at v1 (a dated Coronation, no shop,
  stamina 60/120). It now covers the game as it stands: the earned crown, the hosted address
  and per-address saves, M and the three blows, the Charter, the miller and his strip, the
  new stamina and "spent for the day", the Treasury as rebuilt, the chapman's cart and the
  chest, the Sage and the Chronicler, the map and the turning sky.
  Same day, the owner ("fix those things you mentioned" — the hand-copied numbers and the
  unnamed setting): the guide is now BUILT, not kept by hand. `npm run guide` runs
  scripts/build-guide.py (prose + layout; needs Python with python-docx), which reads every
  number from config.js through scripts/guide-config.mjs and writes CROWNBOUND-Guide.docx
  over scripts/guide-template.docx (the v1 guide, kept only for its styles). Never edit the
  .docx by hand — edit build-guide.py and rebuild; rebuild after re-tuning config.js or
  changing a rule the guide tells. The guide names the setting (England, around 1250): it
  is out-of-game, so the no-year-or-country rule — which covers in-game text and AI
  prompts — does not reach it, and it says the game itself never names them.

- [x] Post-v1 — "The Proving Ground" (2026-11-16): a separate world for testing. `?test=1`
  (or the Tome's last section) opens the game on a save of its own; the true save is never
  written there, and a dark banner says always which world this is. `/` opens a command line:
  `stamina full`, `rank king`, `level wis 10`, `xp`, `coins`, `streak`, `heal`, `hp`, `daily` /
  `weekly` / `monthly`, `tp <place>`, `market on`, `give` / `take` a ware, `farm …`, `reset …`,
  `copy` (the true save copied in to experiment on), `leave` — and a clock that moves:
  `nextday` lets a night pass, `time 7:30` sets the hour. The owner makes commands of his own
  with `make fresh = stamina full; heal`. No rule, reward or save shape changed; the true
  world gains only the Tome's door. CROWNBOUND-Guide.docx has a section (build-guide.py).
  New smoke scenario `proving`, which passes (cloud container, headless Chromium).
  Details: "The Proving Ground" under Noted decisions.

### Session notes
- Headless Chrome renders in software (SwiftShader) at ~9fps since the Renovation; the loop's
  sub-stepping keeps sim time real, so the suite's waits still hold. `render info` is captured
  at frame 12 as well as frame 90. For a real-GPU look, build and open the `crownbound-preview`
  launch config in the Browser pane (it is its own origin: a blank save, no mirror, so it
  cannot touch the real save) — but timings from a hidden pane are worthless.
- Deploying (manual — the gh token has no `workflow` scope, so there is no Actions workflow):
  `npm run build`, copy dist/ to a temp folder, add an empty `.nojekyll`, `git init -b gh-pages`
  there, commit, and force-push that folder to the repo's `gh-pages` branch. Pages rebuilds in
  about a minute. Pushing `main` alone does NOT update the live site.
- Headless verification: `npm run smoke` (or `node scripts/smoke.mjs <scenario>` after a build) serves dist,
  loads it in headless Edge via puppeteer-core (devDependency only), fails on console errors, writes
  scripts/smoke.png. `?smoke=` URL param exposes window.__game (camera setView etc.) for screenshots.
- The suite opens every page with `&hour=13` (the sky held at one in the afternoon), so its
  screenshots are daylit whenever it is run. For a look at another hour: `?hour=21`.
- Regression scenarios (run all after meaningful changes):
  `''` render · `quests` daily+weekly+monthly complete flow · `rollover` stale-save day handling ·
  `fire` streak-35 blaze + stamina drain (to 1 — nought would send him to bed) · `combat` dummy/rats/miller-tally greeting/death
  (respawn at the cot) ·
  `walk` movement · `body` the player's weight and limbs, stepped by hand at a fixed rate:
  sprint wind-up and sliding stop, knees straight standing / folded crouched with the sole
  planted, the leap's wind-up + height + landing fold, a wall taking his speed, the roll's
  reach and upright finish, planted feet skating under 25%, no NaN joint, the three swings
  chaining 0→1→2→0 and starting over after a pause, footfalls reported while running (none
  standing) and one landing per leap (mid-stride screenshot →
  scripts/smoke-body.png) ·
  `hearth` by the fire: not sat at 1.5s, sat by 2.2s (waist low, knees up, facing the
  fire, stick laid aside), W stands him up slowly then walks on, the spawn is not near enough,
  too close he shuffles back, a click (no swing, no stamina) and a bite both get him up
  (screenshot → scripts/smoke-hearth.png) ·
  `tome` save export/import round-trip + chronicle deed list + screenshot ·
  `house` door collider open/close + chest E opens lid + panel, Esc lowers it + cot sleep/heal (mid-nap pose screenshot → scripts/smoke-sleep.png)
  + dawn-verdict clock rules + Well-Rested boon + sleep-ledger log append & panel render +
  interior screenshot · `exchequer` counter prompt + E-open + an untouched ledger's three questions (chip fills the name, a goal with no sum refused, the pace line, sealed) + coffer/figure/track shown + coin laid in (savings, the month's tally, pledge kept) + a recount leaves the tally + booth screenshot ·
  `market` cart presence/absence via ?market=1|0 + prompt + every ware's picture and read-more
  (the cudgel's unfolds with its config damage and folds again; the chest's three pictures and
  a chest read-more without the buying talk checked later; shop panel →
  scripts/smoke-shop.png) + buy flow (coins, ownership, hovel
  mesh shown, rank gate, cudgel damage, loaves fill the larder to its cap) + the chest (stick ⇄ cudgel
  damage, loaf from the larder heals, panel → scripts/smoke-chest.png) + cart screenshot ·
  `crown` v5→current migration (incl. best owned weapon → chest.wielded, str's level
  landing on ath, and int reset to level 1 with the rank recounted)
  + last-level daily completion → King + coronation once-only · `farm` v10→current migration
  (a fallow strip) + ridge prompt + E takes up the hoe, the ridge is redrawn, no pay before the
  last ridge + the wage paid once + one job a day + the field kept across a reload + the rest
  of the crop on a pinned clock (sow/weed/reap, half-done looks, nothing spoils, harvest pay
  and its history deed, back to stubble) + no XP earned + the Charter's section (screenshot →
  scripts/smoke-farm.png) · `guide` charter prompt + E-open
  + config-drawn numbers (panel screenshot → scripts/smoke-guide.png) + post screenshot ·
  `reckoning` v6→v7 migration + verdict rules (with and without income/spending) + panel filing (pledge/fat, typed: blank figures refused, savings-now follows, live verdict) + conquest & next
  summit + double-file guard + the month owed opening already tallied with coin laid in + unreckoned backfill + two-figure months on a pinned clock (held, then bled; laid cleared) + the climb's bars and the seals (months past unfolded → scripts/smoke-reckoning.png) ·
  `alive` villager breathing spread + head-track/greet for all three (off-axis stand, or the
  turn is ~0) + head returns at distance + fidget fires + miller walks his rounds & his prompt
  follows (screenshot → scripts/smoke-alive.png) ·
  `sage` fetch-stubbed verdict auto-completes the daily + nonsense verdict falls back to the
  picker + Tome dismissal clears the key & restores manual (screenshot → scripts/smoke-sage.png) ·
  `chronicle` v7→current migration (old str/agi deeds re-tagged ath) + fetch-stubbed weekly entries: a failing call writes nothing,
  the next load retries, one written entry per load, the empty week left blank for free, week
  order kept, Tome journal newest-first (screenshot → scripts/smoke-chronicle.png) ·
  `spent` stamina to 0 inside the field fence → he walks home through the gate (not hurried),
  door opened, abed, keys dead, rest card says tomorrow + the owed deed; daily posted from bed
  counts, refills to 480 and gets him up; emptied again (daily done) he goes back abed and the
  card offers no refill; retire marks the bedtime; reload finds him abed; a new day
  frees him with a full pool; E hurries a second walk (screenshot → scripts/smoke-spent.png) ·
  `map` M opens the map, both sheets draw, kingdom + village named, home ringed, hover caption,
  plan opens on The Green at the spawn, The Bounds button, M closes and frees the player, the
  arrow moves north-east when he stands by the strip, the zoom kept for the session, Esc
  closes, M does nothing under the Charter, the Charter lists the key (screenshots →
  scripts/smoke-map.png, scripts/smoke-map-bounds.png) ·
  `sky` the pinned ?hour=, the sun east in the morning / due south at noon / west in the
  evening, noon's light and haze, sunset at the right clock time for November, no key light
  at dusk, stars + moonlight + dark haze at midnight, the beam never flatter than 18°, June
  against December, a known full moon and new moon, summer time under an emulated New York
  clock (screenshots → scripts/smoke-sky-noon.png, -sunset.png, -dusk.png, -night.png) ·
  `proving` the test world: the true world has no command line, the Tome's door leads to
  `?test=1`, a save of its own and the banner, `/` opens the line and typing there moves no
  one, then by command: stamina, rank (and `rank sage` refused), level, xp, the Coronation
  held and taken back, coins, streak, daily + reset, give/take, farm, tp (the board's prompt
  offered), stamina handed back on the road home and abed, own commands made / run with a
  word passed on / forgotten / kept through a reload and a wipe, built-in names refused,
  `time`, `nextday` (the game's day moves, the streak holds; two missed nights kill it),
  `time real`, `market on`, `copy`, `reset world` — and at the end THE TRUE SAVE UNCHANGED to
  the letter, then `leave` back onto it (screenshot → scripts/smoke-proving.png) ·
  `aerial`/`front` screenshots.
- If headless Edge quits at once ("Failed to launch the browser process: Code: 0" — seen
  2026-11-13 with Edge already open), point the suite at Chrome:
  `SMOKE_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe" node scripts/smoke.mjs <scenario>`.
- The suite is written for Windows (Edge/Chrome paths, `taskkill` to stop the preview server).
  On Linux (a cloud session) it runs unchanged with `SMOKE_BROWSER=<path to chromium>` and a
  tiny `taskkill` stand-in script on PATH that kills the given PID's process tree; without the
  stand-in the run ends in an unhandled spawn error and leaves `vite preview` holding port 5199.
- In a cloud container the software renderer manages ~3fps (measured 2026-11-14: median frame
  ~350ms, worst ~900ms, for the build before The Living Body and after it alike), so a check
  that waits a fixed 300–600ms for the next frame can read too early. `house` (the closed door
  pushing him out), `combat` (the second dummy swing landing), `guide` (the charter prompt,
  read 400ms after he is placed) and `exchequer` (the counter's prompt read as empty,
  2026-11-16) each failed once that way and passed re-run; stepped by hand, both behave. A failure there with otherwise sane numbers is
  the wait, not the game — re-run that scenario alone with nothing else busy on the machine.
  (2026-11-16: median frame ~400ms there, before The Turning Sky and after it alike.
  `exchequer` and `market` failed the same way — a prompt read 400ms after the player was
  moved — and now wait for the prompt to appear, `promptOffered()` in smoke.mjs.)
- Terrain is colored per-FACE (non-indexed, centroid-sampled) for the faceted low-poly look — keep it that way.
- Git identity is passed per-commit via `-c` flags (no global git config on this machine).
