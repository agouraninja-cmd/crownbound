# CROWNBOUND — Ideas

Loose ideas from the owner, written down so they aren't lost. **Nothing here is planned,
scheduled or agreed — do not build from this file.** An idea becomes work only when the owner
asks for it and it moves to the Roadmap in `CLAUDE.md`.

Each entry has a name, the idea as the owner gave it, then the questions it leaves open.

| Name | What it is |
| --- | --- |
| **The Finer Virtues** | Substats under the four main virtues |
| **Kingdoms** | Multiplayer as a whole — the throne, won by vote or duel |
| **The Homelands** | Kingdoms shape A: kingdoms are real-life places |
| **The Four Crowns** | Kingdoms shape B: four kingdoms you choose between, for good |
| **The Four Realms** | Each kingdom has its own map — and its own kind, era or species |
| **The Trials** | Challenges set by the Crownbound devs, with groups anyone can join |
| **The Schoolhouse** | Tutoring centres and schools where players work on schoolwork, taught by AI now, real people later |
| **The Witnesses** | Other people verify that you really did your goals — and competitions run on it |
| **The Sage Walks With Thee** | Claude woven further into the game and the real life behind it |
| **The Pocket Realm** | Wearable — a piece of your world that moves with you |
| **The Other Roads** | Research: games and apps already like Crownbound |
| **The Wider World** | Real-world services plugged into the game |
| **The Craft** | The game teaches real-world experience, not only schoolwork |
| **The Market Square** | Players trade micro-transactions with one another |
| **The Heralds** | In-game marketing |
| **The Fuller Board** | More choices and stats on the Quest Board |
| **The Vices** | Track addictions and drug use against a limit — going past it weakens your guy |

The Homelands and The Four Crowns are two different answers to the same question — what a
kingdom *is*. They are alternatives; the owner has not picked one.

---

## The Finer Virtues — substats under the four virtues

*Noted 2026-11-15; grown 2026-11-27.*

Each main virtue (Athleticism, Intelligence, Wisdom, Influence) gets substats beneath it.
Substats affect what the player can do in the game: they change his ability to do certain
things, or unlock certain abilities later on.

### What you do is what you become (the owner, 2026-11-27)

**The kind of deed decides which substat grows** — so the character comes to move and play
like the person behind him. Two people at the same Athleticism level can be different
athletes: a runner is fast, a tennis player is nimble.

**Athleticism has three substats:**

| Substat | Grows from (real life) | Changes in the game |
| --- | --- | --- |
| **Speed** | Running, above all | He moves faster |
| **Agility** | Tennis and the like — quick, changing play | He changes direction quickly |
| **Strength** | Lifting (the owner named the substat, not yet what it does) | — |

- One deed can feed more than one substat, unevenly: **running is mostly Speed; tennis gives
  less Speed XP and more Agility.**
- **As Athleticism itself levels up, the whole body gets better too** — his vert (how high he
  leaps) and his flexibility rise with the main virtue, whichever substats were trained.

(Agility was once a main virtue; it made way for Intelligence on 2026-11-15. Here it comes
back as a substat of Athleticism — the save's `int` key and Intelligence are untouched.)

### Intelligence — suggestions, nothing chosen

*The owner asked for ideas (2026-11-27). These are Claude's, not the owner's — strike or
change freely.* In this game Intelligence is conduct, not learning (learning is Wisdom): the
planning, strategy, discipline, judgment and money. Three substats to match Athleticism's
three:

| Substat | Grows from (real life) | Could change in the game |
| --- | --- | --- |
| **Strategy** | Planning the week, chess, a business decision thought through, a hard problem solved | He reads a fight: a rat's lunge is given away a beat early, a foe's health is shown, a blow struck from behind or straight out of a roll lands harder. Later: traps set at the granary, the militia commanded (v5), the duel in Kingdoms |
| **Discipline** | Keeping to the routine — up on time, the diet held, the hard task done first, the phone left alone | His strength goes further: walking and sprinting drain less stamina, the three blows chain over a longer pause, a bite staggers him less, a ridge of the field is worked faster |
| **Thrift** | Budgeting, tracking spending, saving, a purchase weighed and declined | A sharper bargain: the chapman's prices come down a little, the miller pays a little more a tail and a day, the larder holds more, tomorrow's stock is known ahead (once stock rotates) |

- **As Intelligence itself levels up, he knows more of the world** (its answer to vert and
  flexibility): the Map fills in and shows more — market days ahead, what the strip wants
  tomorrow, where the rats are; waymarks to things not yet found; more told on the HUD.
- Unevenly shared, as with tennis: *a weekly budget written* is mostly Thrift with some
  Strategy; *a month without sweets* is all Discipline; *a business plan* is mostly Strategy.
- Other names and powers that were weighed: **Foresight** (planning on its own — seeing ahead:
  the weather, the market, a foe's next move), **Judgment** (reading people — would sit close
  to Influence), **Focus** (aim, once there are bows).
- Two cautions. Thrift must never touch the Treasury — real money and game coins stay two
  purses; it only bends the game's own prices. And Discipline stretches stamina, which is
  what ends a day's play — so its ceiling decides how long a session can run.

Open questions:
- What Strength changes in play — the weight of a blow, what he can carry, how fast he works
  the field?
- Which substats sit under Wisdom and Influence?
- How a substat grows — the deed's XP split among the substats it trained (a new, *uneven*
  share: today's `shareXp` splits evenly between whole virtues), or XP of its own on top?
- Who decides the split for a deed — the Sage (naming "tennis: agility 70, speed 30"), or the
  player with the picker?
- How far a substat may bend the numbers the game is balanced on (walk and sprint speed, turn
  rate, leap height, stamina drain, prices) — a few percent, or a visible difference?
- Does a substat only change numbers, or unlock abilities at certain levels as first noted?
- Do unused substats ever fade, as a real body does? (The owner has said streaks are not
  healthy — fading may be the same kind of pressure.)

---

## Kingdoms — multiplayer

*Noted 2026-11-15.*

Multiplayer is called **Kingdoms**. What holds in either shape below:

- Players play **against each other**.
- Each kingdom has **only one ruler** — a King or a Queen.
- To take the throne, a challenger must either **win a vote** or **challenge the ruler to a
  duel and win**. (Given with the first version of the idea; not restated for The Four Crowns.)

Open questions:
- How this sits with the solo game's Coronation, which today is earned at 70 total virtue
  levels with no rival — is the solo crown separate from a kingdom's throne?
- Who may call a vote or a duel, and how often? What does the vote need to pass?
- What decides a duel — the in-game fight alone, or do real-life virtues and substats weigh in?
- Everything technical: the game is browser-only today, with the save in the player's own
  browser and deeds on the honor system. Kingdoms would need a server, accounts, and some
  answer to honesty between rivals.

### The Homelands — kingdoms are real places

*Noted 2026-11-15.*

- A kingdom is a **real-life place**: a city, county, state or country. Players belong to the
  place they are from. (This replaced the very first version, a flat cap of 50 people per
  server.)
- Kingdoms **compete against each other** — country against country, and so on — ranked by
  their **overall stats**: the combined virtues of the people in them.
- A kingdom can **invade** other areas.
- An overthrown area can **always fight back**: its people keep the place they are from, so a
  conquered kingdom is never erased and can rise again.

Open questions:
- How the levels of place nest: is a city inside its county, state and country all at once,
  and which level does a player fight for?
- How a player's place is set — chosen once, or checked somehow — and whether it can change
  when he moves.
- "Overall stats" as a total favours big places; as an average it favours small ones. Which,
  or something in between?
- What an invasion is in play, what the winner gains, and what being overthrown costs the
  area until it fights back.
- A place could hold a handful of players or millions — what one ruler, one vote and one duel
  mean at each size.

### The Four Crowns — four kingdoms, chosen for good

*Noted 2026-11-15.*

- **Not based on location.**
- There are **four kingdoms** (or empires). Like picking a team in Pokémon Go, each player
  **decides which one to join** — and once joined, **cannot switch**.
- **No limit** on how many people a kingdom can hold.
- **Every year there is a war.** One kingdom wins, and **every player who took part gets a
  huge prize**.
- Players can really become **Kings and Queens**, but only one per kingdom — **four rulers in
  all**.

Open questions:
- The four kingdoms themselves: their names, and what sets one apart from another.
- "Kingdom" or "empire" — which word.
- With no cap and a free choice, players will pile into whichever kingdom is winning. What
  keeps the four in balance?
- What the yearly war is: how long it runs, how it is fought and scored, and what counts as
  having taken part.
- What the huge prize is — and how it keeps the sacred rule, that virtue is earned by real
  deeds and never handed out.
- Is the prize for the winning kingdom's players only, or for everyone who fought?

### The Four Realms — a map for every kingdom

*Noted 2026-11-15. Builds on The Four Crowns.*

- There is a **map of the kingdom**, and **each kingdom has its own map**.
- The kingdoms need not all be alike. The other three could each be **another type of
  kingdom**, **another time period**, or **another species**.

Open questions:
- Which of the three it is — a different kind of kingdom, a different era, or a different
  species — or a mix, one per kingdom.
- What the map is: the 3D land a player walks (today's village, grown), an overview map to
  look at, or both.
- Whether a player can visit the other kingdoms' maps, and when — only in the yearly war?
- Whether the differences are looks only, or change how a kingdom plays.
- The art cost: today everything is one hand-built low-poly medieval village. Four distinct
  realms is four times the world, and another era or species means new buildings and figures.

---

## The Trials — challenges set by the devs, with groups to join

*Noted 2026-11-15.*

- **Challenges created by the Crownbound devs** — for example, a set number of hours playing
  or practising tennis.
- Completing a challenge **gives rewards**.
- Players can **join the groups** that take on a challenge, so it is done alongside others.

Open questions:
- What the rewards are — coins, gear, a title or trophy, a look for the hovel — and how they
  keep the sacred rule: coins buy comfort, never virtue. Does the deed itself still earn its
  XP through the Quest Board as usual, with the challenge reward on top?
- How a challenge is measured: hours logged by hand (honor system), a count of deeds, or the
  Sage reading the quest text? Today a quest records a deed, not how long it took.
- Is a group just people on the same challenge, or something more — a shared tally, a group
  goal everyone fills, a leaderboard, chat?
- How often new challenges appear (weekly, monthly, seasonal) and how long each runs.
- Can players make their own challenges too, or only the devs?
- How this relates to Kingdoms — could a kingdom field a group, or a challenge feed the
  yearly war in The Four Crowns?
- Everything technical, as with Kingdoms: the devs publishing challenges to every player and
  players joining groups both need a server and accounts; today the game lives only in the
  player's own browser.

---

## The Schoolhouse — tutoring centres and schools

*Noted 2026-11-16.*

- A **tutoring centre or school** in Crowbound where players who want to work on their
  schoolwork can go to study.
- Taught **by AI at first**, and **eventually by real people** in the future.

Open questions:
- Where it sits in the village — a building of its own, or a room in an existing one.
- What "working on schoolwork" counts as in the game: a quest logged on the Quest Board, a
  lesson with the teacher, or both. Which virtue it trains (likely Wisdom, which is learning).
- How the AI teacher works: a chat like the Sage's, a set lesson, or a course. Which subjects.
- What the real-person teachers would be in the future, and how they would be found, paid and
  checked. The sacred rule still applies: coins buy comfort, never virtue.
- Everything technical: a teacher AI is another use of the Anthropic API (the browser-direct
  plumbing the Sage already uses), but real teachers would need a server and accounts.

---

## The Witnesses — other people verify the deed

*Noted 2026-11-18. Comes with competitions.*

- **Competitions** between players, where **other people verify** whether a player really did
  his goals.
- Today deeds are on the honor system; here, witnesses stand in for honor.

Open questions:
- Who the witness is: a friend, a rival, a random player, a coach — and can he be bribed or
  can friends simply vouch for each other?
- What a witness sees: a photo or video, a screenshot of a fitness app, or only a yes/no.
- Does verification gate XP, or only the competition's prize? The solo game stays honor-system
  either way — only a contest would need proof.
- What a false claim costs, and what a wrongly rejected one is owed (an appeal).
- Privacy: a witness seeing a player's photos, location or money.
- Everything technical: accounts, a server, and storage for proof. Today the game is
  browser-only with the save on the player's own device.
- Ties to The Trials (challenges set by the devs) and Kingdoms (rivals, the yearly war).

---

## The Sage Walks With Thee — Claude woven into Crownbound

*Noted 2026-11-18.*

- **Get Claude integrated with Crownbound** — further than today. Claude already does two
  jobs (the Sage names a deed's virtue; the Chronicler writes the week).

Open questions (the owner left the shape open; these are guesses at what it could mean):
- Villagers who talk, as v2 already plans (the clerk, the miller, the chapman on the same API
  plumbing).
- A coach that reads the history and suggests the next quest, or notices a slipping streak.
- Claude as the teacher in The Schoolhouse, or as a witness in The Witnesses.
- Claude *using* Crownbound from outside: reading and logging quests from a Claude chat (an
  MCP server over the save). Which of these did the owner mean?
- Cost and keys: every use spends the player's own API key today.

---

## The Pocket Realm — a wearable piece of your world

*Noted 2026-11-18.*

- A **wearable** — a piece of your world that **moves with you**, on the body.

Open questions (the idea was one line; these are guesses):
- A real watch or band that shows the campfire and the daily quest, and logs workouts so the
  deed arrives on its own (and is harder to fake)?
- Or merchandise — a ring, a pendant, a banner — that you wear to show your rank?
- If a watch: which platform, and does its health data replace the honor system for athletic
  deeds? Sensors would feed The Witnesses too.
- What moves with you: the fire, the streak, the Sage's voice, the stamina bar?
- Technical: a native or companion app, beyond the browser-only game.

---

## The Other Roads — games and apps like Crownbound

*Noted 2026-11-18. A research task. The list below is from memory, not a live search — check
before relying on any of it.*

The owner asked whether ideas like Crownbound already exist. Close relatives I know of:
- **Habitica** — habits and to-dos as an RPG with party quests; the nearest cousin.
- **Beeminder / StickK** — money on the line for your goals; StickK also uses a referee, which
  is The Witnesses' shape.
- **Zombies, Run!** and **Ring Fit Adventure** — real exercise as the game's engine.
- **Finch** (a pet that grows as you do self-care), **Forest** (a tree grown by not touching
  the phone), **SuperBetter** (recovery as a quest).
- **Strava** challenges and clubs — competition with other people's logged workouts.

Open questions:
- What none of them do that Crownbound could: a 3D world you walk, a real-savings ledger that
  never mixes with game coins, a hand-made look.
- To do properly: a real web search and a short write-up of each — price, players, what
  worked, what died.

---

## The Wider World — real-world services plugged in

*Noted 2026-11-18.*

- **Integrate real-world services** into the game.

Open questions (guesses, since the owner named none):
- Fitness: Strava, Apple Health, Google Fit — deeds logged by the data.
- Money: a bank or savings link for the Treasury, instead of typing figures in.
- Calendar, school (course sites), or a business tool for the Influence deeds.
- Each is an account, a permission and a risk to the player's data — which are worth it?
- Does a service ever pay in coins or XP? The sacred rule says coins buy comfort and deeds
  earn virtue; the two purses (game coins, real money) never mix.

---

## The Craft — teaching real-world experience

*Noted 2026-11-18. Sits beside The Schoolhouse.*

- The game **teaches real-world experience** — practical know-how, not only schoolwork.

Open questions:
- Which experience: running a business (the owner's own path), money, trades, job skills,
  tennis technique?
- Taught by the AI, as in The Schoolhouse, or through in-game work that mirrors real work
  (the miller's strip is a small seed of this)?
- How it is told apart from The Schoolhouse, and which virtue it trains (Influence for
  business, Intelligence for money).

---

## The Market Square — micro-transactions between players

*Noted 2026-11-18.*

- Players make **micro-transactions with each other**.

Open questions:
- Is the money game coins, real money, or both? **The sacred rule and the two-purses rule
  both bear on this:** game coins never convert to real money, and coins buy comfort, never
  virtue. Real money between players is a different, much heavier thing (payments, law, fraud).
- What is traded: wares, home goods, services, tutoring from The Schoolhouse?
- Can a trade be used to buy virtue in disguise (paying a friend to "do" a deed)? Needs The
  Witnesses, or limits on what can be sold.
- Technical: accounts and a server; today there is no player-to-player anything.

---

## The Heralds — marketing inside the game

*Noted 2026-11-18.*

- **In-game marketing.**

Open questions (it could mean either of two things):
- Crownbound's own marketing done in-world (a herald crying the news, banners for The
  Trials), or players' businesses advertised in-game — fitting the owner's Influence and
  business path, perhaps a stall in The Market Square.
- Or third-party ads for money. That would sit badly with a personal, calm, no-dark-patterns
  goal tracker; worth deciding early.
- If players advertise: honesty rules, and keeping adverts to the setting (heralds, signboards,
  hand-bills — no logos in a medieval village).

---

## The Fuller Board — more choices and stats on the Quest Board

*Noted 2026-11-27.*

- **More choices and more stats** on the task board (the Quest Board).
- Today it holds up to five daily deeds, a weekly bounty, a monthly campaign and the Epic.
  Each deed is typed by hand and trains one or more of the four virtues, its XP shared evenly.

Open questions (the idea was one line; the examples are guesses, not the owner's):
- Which choices: more virtues to tick, kinds of deed to pick from (run, lift, tennis, study,
  budget), saved deeds to post again with one click, a size or difficulty, a time spent?
- Which stats: the substats of The Finer Virtues on each deed's picker, or numbers about the
  deeds themselves — how many done this week and month, XP by virtue, the most trained and the
  most neglected?
- Where the new stats show: on the board, or in the Tome with the rest of the character?
- Does any choice change what a deed pays? Today every daily pays the same, and naming more
  virtues never pays more. A difficulty setting on the honor system would tempt everyone to
  pick "hard".
- How to keep logging quick: sessions are meant to be 10–15 minutes a day.

---

## The Vices — addictions and drug use, with a limit

*Noted 2026-11-27.*

- The game **tracks addictions and drug use**.
- There is **a certain limit**; going past it **weakens your guy**.

Open questions (guesses and cautions are Claude's, not the owner's):
- What can be tracked: alcohol, nicotine, cannabis, other drugs — and habits that are not
  drugs, such as gambling, the phone, caffeine or sugar? A set list, or typed by the player?
- Who sets the limit, over what span (a day, a week, a month), and can it be raised on the
  spot? A limit of none must be possible.
- What "weakens" means: less stamina, a slower walk, softer blows, a tired look? For how long,
  and how does he recover — time, days within the limit, good deeds?
- Does it ever take away virtue XP or levels already earned, or only dim him for a while?
- Does staying within the limit give anything back?
- Honor system: if logging costs him strength, the temptation is not to log. How is telling
  the truth kept from feeling like punishing yourself?
- Tone: no shaming, and one bad day should not feel like ruin (the owner has said streaks are
  not healthy). Should a day over the limit offer a next step, as a bled month does in the
  Treasury?
- Safety: the game gives no medical advice and should never call any amount safe. Stopping
  some things suddenly (heavy drinking, some pills) can be dangerous, so it should not push
  quitting all at once, and should say where real help is found.
- Privacy: this is far more sensitive than a deed. Today the history goes to the Chronicler
  (the Anthropic API), and the save goes into the Scribe's export and the dev mirror file.
  Should this record be kept out of any of them?
- How it sits with The Finer Virtues: keeping within a limit could feed Discipline.
