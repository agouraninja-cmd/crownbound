# Builds CROWNBOUND-Guide.docx, the out-of-game player's guide.
#
#   npm run guide        (needs Python with python-docx: pip install python-docx)
#
# The prose lives here; every number in it is read from the game's config
# (scripts/guide-config.mjs prints it as JSON), so after re-tuning config.js a
# rebuild brings the guide back in step — like the in-game Charter, which reads
# the same numbers live. scripts/guide-template.docx supplies the look: its
# paragraphs and tables are reused as patterns so every style is kept. Its own
# text is the v1 guide and is all rewritten or kept below, paragraph by number.
import copy, json, re, subprocess, sys
from pathlib import Path
from docx import Document
from docx.text.paragraph import Paragraph
from docx.table import Table

root = Path(__file__).resolve().parent.parent
C = json.loads(subprocess.run(['node', str(root / 'scripts' / 'guide-config.mjs')], capture_output=True, text=True, check=True).stdout)
out = sys.argv[1] if len(sys.argv) > 1 else str(root / 'CROWNBOUND-Guide.docx')
d = Document(str(root / 'scripts' / 'guide-template.docx'))

# ---- the game's numbers, by short names ----
R, ST, SL, PL, FM = C['rewards'], C['stamina'], C['sleep'], C['player'], C['farm']
KING = C['ranks'][-1]['totalLevels']
ITEM = {i['id']: i for i in C['shop']['items']}
DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
market = [DAYS[n] for n in C['shop']['marketWeekdays']]
MARKET = ', '.join(market[:-1]) + ' and ' + market[-1]
WORDS = {1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five'}
num = lambda n: f'{n:,}'
plain = lambda n: f'{n:g}'  # 2.0 -> 2, 0.25 -> 0.25
coins = lambda n: f'{n:,} coins'
P = list(d.paragraphs)
T = list(d.tables)

def set_text(p, text):
    """Write text into p; **x** is bold. The first plain run is the pattern."""
    runs = list(p.runs)
    plain = next((r for r in runs if not r.bold), runs[0])
    pattern = copy.deepcopy(plain._r)
    for r in runs:
        r._r.getparent().remove(r._r)
    for i, part in enumerate(re.split(r'\*\*', text)):
        if not part:
            continue
        r = copy.deepcopy(pattern)
        p._p.append(r)
        from docx.text.run import Run
        run = Run(r, p)
        run.text = part
        run.bold = True if i % 2 else None
    return p

def para_after(anchor, template, text):
    """A new paragraph styled like template, placed after anchor (a paragraph or table)."""
    el = copy.deepcopy(template._p)
    (anchor._p if isinstance(anchor, Paragraph) else anchor._tbl).addnext(el)
    return set_text(Paragraph(el, template._parent), text)

def table_after(anchor, template, rows):
    """A new table shaped like template (header row + body rows), after anchor."""
    el = copy.deepcopy(template._tbl)
    (anchor._p if isinstance(anchor, Paragraph) else anchor._tbl).addnext(el)
    t = Table(el, template._parent)
    fill(t, rows)
    return t

def fill(t, rows):
    """Rewrite a table: rows[0] is the header; body rows are cloned from the first body row."""
    body = t.rows[1]._tr
    for r in list(t.rows)[2:]:
        r._tr.getparent().remove(r._tr)
    for _ in rows[2:]:
        body.addnext(copy.deepcopy(body))
    for row, texts in zip(t.rows, rows):
        for cell, text in zip(row.cells, texts):
            for extra in cell.paragraphs[1:]:
                extra._p.getparent().remove(extra._p)
            if cell.paragraphs[0].runs:
                set_text(cell.paragraphs[0], text)
            elif text:
                cell.paragraphs[0].add_run(text)

H2, H3, BODY, BULLET = P[2], P[8], P[29], P[33]
(controls, tour, quests, ranks, fire, purses, road) = T

# ---- what Crownbound is ----
set_text(P[3], f"Crownbound is a third-person, low-poly medieval life RPG that doubles as your personal goal tracker. It is set in **England, around 1250** — the High Middle Ages, a world of timber and thatch, watermills, silver pennies and hand-copied books — though the game itself never names the year or the country. You play a peasant of **{C['realm']['village']}**, a village in a clearing of the Brackenwood in the **Kingdom of {C['realm']['kingdom']}** (both invented), with one great ambition: to be crowned. The character does not grow by grinding in the game — he grows when **you** do real things in the real world. Lift weights, play tennis, build the business, learn something, save money: log the deed at the Quest Board and the XP, coins, and streak follow. Sessions are meant to be short — ten to fifteen minutes a day.")
set_text(P[5], f"**The crown is earned, not scheduled.** There is no date and no countdown: the Coronation happens the moment your four virtues total {KING} levels and your rank reaches King. The Quest Board and the Tome show the road — “N of {KING} virtue levels won” — and, ever after, the day you were crowned.")

# ---- getting started ----
set_text(P[7], "Open **https://agouraninja-cmd.github.io/crownbound/** in a browser — or, in the project folder, start the dev server (**npm run dev**) and open **http://localhost:5173**. Press any movement key or click the scene to take control of the camera; **Esc** releases it. Where a browser will not lock the mouse, hold the left button and drag to look around. Your progress saves automatically in the browser after every action — but each address keeps its **own** save, so carry your chronicle between them with the Scribe (see Saving Your Chronicle).")
fill(controls, [
    ["Input", "Action"],
    ["W A S D", f"Move — walking costs a little stamina ({plain(ST['walkDrain'])} a second)"],
    ["Shift (hold)", f"Sprint — costs {plain(ST['sprintDrain'])} stamina a second"],
    ["Space", "Jump (free)"],
    ["C (hold)", "Crouch — a careful, low shuffle"],
    ["Double-tap W/A/S/D", f"Dodge-roll in that direction (costs {ST['dodgeCost']} stamina)"],
    ["Left click", f"Attack (costs {ST['attackCost']} stamina). Swing again quickly and the blows chain: chop, backhand, sweep"],
    ["Mouse / wheel", "Orbit and zoom the camera. The mouse’s feel — gentle, steady or swift — is chosen in the Tome"],
    ["E", "Interact — one key for everything; the nearest thing in range wins"],
    ["M", "Unroll the Map of the Kingdom (M or Esc rolls it up)"],
    ["Esc", "Close an open panel / release the mouse"],
])

# ---- the tour ----
fill(tour, [
    ["Landmark", "What it is"],
    ["The Quest Board", "Where deeds are posted and marked complete — the heart of the game. Press E to open it."],
    ["The Tome", "A stone pedestal bearing your Character Sheet: rank ladder, virtues, coins, the Weekly Chronicle, the list of every deed recorded, the Sage, the mouse’s feel, and the Scribe (save backup)."],
    ["The Village Charter", "A parchment on a post by the path: the rules of the realm in one sheet, with every number read live from the game."],
    ["Your hovel", "Home. E opens the hinged door (closed, it is solid). Inside: your straw cot (stand at its open corner, E to sleep), the chest beside it (weapons and bread) and the Sleep Ledger board. You wake here after death or a night’s rest."],
    ["The campfire", f"The living face of your streak. It swells and shrinks with your discipline — see The Streak below. Stand still beside it for {WORDS.get(PL['sitDelay'], PL['sitDelay'])} seconds and he sits down to warm his hands."],
    ["The training dummy", "Whack it for a trickle of Athleticism XP, with sharply diminishing returns each day."],
    ["The granary and the miller", f"{WORDS[C['rats']['count']].capitalize()} rats prowl the yard, and the miller walks his rounds there. He pays a bounty per tail; E beside him tells the day’s tally."],
    ["The miller’s strip", "A fenced wheat field out past the granary to the north-east, at the end of a cart track. One job a day — see The Miller’s Strip."],
    ["The Exchequer", "A money-changer’s booth by the path — checkered counting cloth, scales, and a clerk. E at the counter opens the Treasury, where your real savings are tracked."],
    ["The chapman’s cart", f"A mule cart parked by the path on market days only — {MARKET}. E opens the shop."],
])

# ---- quests ----
set_text(P[11], "Quests are written in your own words — the game never invents tasks for you. Post a quest, do the real thing, then return and mark it complete. On completion you choose which virtue the deed trained, and the reward lands there — or, if you have appointed the Sage (see The Sage & the Chronicler), he names the virtue for you.")
fill(quests, [
    ["Quest", "Reward", "Resets"],
    ["Daily Quest", f"+{R['daily']['xp']} XP, +{R['daily']['coins']} coins, refills stamina and raises its cap for the day, feeds the streak", "Every day (local midnight, on next load)"],
    ["Weekly Bounty", f"+{R['weekly']['xp']} XP, +{R['weekly']['coins']} coins", "Every Monday"],
    ["Monthly Campaign", f"+{R['monthly']['xp']} XP, +{R['monthly']['coins']} coins", "The 1st of each month"],
    ["The Epic Quest", "Progress is a percentage you update by hand; every update is written into the Chronicle", "Never — it has no deadline"],
])

# ---- the virtues ----
virtues = para_after(P[13], BODY, "What each virtue is for:")
b = virtues
for line in [
    "**Athleticism** — lifting, sport, hard labour.",
    "**Intelligence** — conduct: planning, strategy, discipline, judgment, and looking after your money.",
    "**Wisdom** — learning: study, coursework, reading, writing, coding. A good night’s sleep feeds it too.",
    "**Influence** — business and people.",
]:
    b = para_after(b, BULLET, line)

set_text(P[13], f"Your character has four stats, called virtues: **Athleticism**, **Intelligence**, **Wisdom**, and **Influence**. Each starts at level 1. The next level always costs **{C['xpPerLevel']} × current level** XP (level 1→2 costs {C['xpPerLevel']}, level 2→3 costs {2 * C['xpPerLevel']}, and so on).")
fill(ranks, [["Rank", "Total virtue levels"]] + [
    [r['title'], f"{r['totalLevels']} (the beginning)" if i == 0 else str(r['totalLevels'])] for i, r in enumerate(C['ranks'])
])
FIRE = {'embers': 'Cold embers', 'small': 'A small flame', 'healthy': 'A healthy fire', 'roaring': 'A roaring blaze'}
tiers = sorted(C['campfireTiers'], key=lambda t: t['minStreak'])
fire_rows = [["Streak", "The fire"]]
for i, t in enumerate(tiers):
    last = tiers[i + 1]['minStreak'] - 1 if i + 1 < len(tiers) else None
    span = f"{t['minStreak']}+ days" if last is None else f"{t['minStreak']} days" if last == t['minStreak'] else f"{t['minStreak']}–{last} days"
    fire_rows.append([span, FIRE.get(t['name'], t['name'])])
fill(fire, fire_rows)

# ---- stamina ----
set_text(P[19], f"Stamina is a daily pool. Fighting draws on it — **{ST['attackCost']} per attack, {ST['dodgeCost']} per dodge-roll** — and so do the legs: **{plain(ST['walkDrain'])} a second walking** (crouched included) and **{plain(ST['sprintDrain'])} a second sprinting**. Jumping and standing still are free. The base cap is **{ST['baseCap']}**; completing the daily quest refills the pool and raises the cap to **{ST['questCap']}** for the rest of the day. Rising well-rested (see Sleep) adds another +{SL['staminaBonus']}. With too little left for a swing or a roll, combat is refused — “Your arms are spent. Earn your strength — the board awaits.”")
h = para_after(P[19], H3, "Spent for the day")
s1 = para_after(h, BODY, "The moment stamina reaches zero, the day’s play is over. He lets go of the keys and walks himself home — round every obstacle, through the door, onto the cot — and a card tells you play resumes tomorrow, with a line he says to himself. Press E to hurry the walk.")
s2 = para_after(s1, BODY, "From bed you can still open the Quest Board, the Tome and the Exchequer. If today’s daily is not yet done, completing it from bed **refills the pool and gets him up**. Once the daily is done, a second emptying is final until tomorrow. “Retire for the night” on the card marks your real bedtime; the walk home does not.")

# ---- combat ----
c0 = para_after(P[20], BODY, f"Left click swings what is in your hand. Three blows chain when you swing in quick succession — a chop, a backhand, a sweep — and all three cost, reach and hit the same. You begin with a stick (damage {PL['attackDamage']}); the chapman sells a cudgel (damage {ITEM['cudgel']['damage']}) and, to a {ITEM['quarterstaff']['minRank']}, a quarterstaff (damage {ITEM['quarterstaff']['damage']} and a longer reach).")

steps = C['dummy']
curve = f"**{steps[0]['xp']} XP** per hit for the first {steps[0]['upTo']} hits" + ''.join(f", **{s_['xp']} XP** until {s_['upTo']} hits" for s_ in steps[1:])
set_text(P[22], f"Each hit grants a little Athleticism XP with hard daily diminishing returns: {curve}, then nothing until tomorrow.")
set_text(P[24], f"{WORDS[C['rats']['count']].capitalize()} rats haunt the granary yard. They wander, chase, and bite for chip damage. Each has {C['rats']['hp']} HP and pays **+{R['ratCoins']} coins** — the miller’s bounty per tail. Slain rats respawn the next day.")

# ---- the miller's strip (after Death) ----
fh = para_after(P[26], H2, "The Miller’s Strip")
f1 = para_after(fh, BODY, f"The farming job. The strip is a fenced field of **{FM['rows']} ridges**, entered by its gate. There is **one job per real day**, each in its turn: **till, sow, weed, reap**. A job is every ridge — press E at a ridge and he works it for a second or two with the hoe, the sowing hand or the sickle. Finish the last ridge and the miller pays: **+{FM['wage']} coins** for a day’s tilling, sowing or weeding, **+{FM['harvestPay']} coins** for the harvest.")
f2 = para_after(f1, BODY, "The crop grows only across the days you turn up: shoots the night after sowing, ripe wheat the night after weeding. Nothing spoils — a missed day costs only the day, and a half-done job keeps its ridges. Field work pays **coins only**: no XP, no stamina cost, no streak. Virtue is still earned only by real deeds.")

# ---- wealth ----
fill(purses, [
    ["", "What it is", "Where"],
    ["Coins", "Quest spoils, rat bounties and field wages. Spent at the chapman’s cart on gear, home comforts and bread.", "Shown on the HUD and in the Tome"],
    ["The Treasury", "Your real-world savings, tracked by hand against a goal. Game coins never convert into it, and it pays no XP or coins.", "The Exchequer’s counting table"],
])
set_text(P[29], "The Treasury is real money, on your honor. A coffer fills with coin as your savings near the goal, beside your savings in large numerals and a track to the goal that shows how far you are and when your monthly pledge gets you there.")
w = P[29]
for kind, line in [
    (BULLET, "**Opening the ledger.** The first time, the clerk asks three questions, one at a time: what you are saving for and how much it needs, what you have saved already, and what you will set aside each month (your pledge)."),
    (BULLET, "**Lay in coin.** Whenever you move real money into savings, tell the clerk. The coffer and this month’s pledge meter fill at once. “Recount” corrects the figure to what your account truly shows."),
    (BULLET, "**The monthly reckoning.** When a month ends the clerk asks two figures: what you put into savings that month (already tallied from the coin you laid in) and what your savings stand at now. Income and spending are optional. One reckoning per month, and it cannot be undone."),
    (BULLET, "**The verdict.** Each month is sealed in wax: **fat** (pledge kept), **held** (no ground lost) or **bled** (ground lost). A skipped month is marked unreckoned."),
    (BULLET, "**Goals.** A goal is won when a filed reckoning finds your savings at it; then you name the next. Months past, goals won and the plan are folded away at the bottom of the panel."),
]:
    w = para_after(w, kind, line)

# ---- the chapman's cart ----
ch = para_after(w, H2, "The Chapman’s Cart")
c1 = para_after(ch, BODY, f"The chapman parks by the path on **market days only — {MARKET}**. Each ware has a picture; click it (or “Read more”) for what it is, how to use it and what it does for you. **The sacred rule:** coins buy comfort and swagger, never virtue — no XP, no streak repair and no stamina is ever for sale.")
wares = table_after(c1, quests, [
    ["Ware", "Price", "What it does"],
    ["An oaken cudgel", coins(ITEM['cudgel']['price']), f"A weapon: damage {ITEM['cudgel']['damage']}"],
    ["A quarterstaff", coins(ITEM['quarterstaff']['price']), f"A weapon: damage {ITEM['quarterstaff']['damage']} and a longer reach. {ITEM['quarterstaff']['minRank']}s and above only"],
    ["A wool rug", coins(ITEM['rug']['price']), "Laid on the hovel floor"],
    ["Door paint", coins(ITEM['door']['price']), "An oxblood door for the hovel"],
    ["A glass pane", coins(ITEM['window']['price']), "A real window for the hovel"],
    ["A garden plot", coins(ITEM['garden']['price']), "A garden beside the hovel"],
    ["A hearty loaf", coins(ITEM['loaf']['price']), "Goes to the chest’s larder; eaten there for a full heal"],
    ["A mounted rat", coins(ITEM['trophy']['price']), "A trophy for the wall"],
    ["A candle lantern", coins(ITEM['lantern']['price']), "A light for the doorpost"],
])
c2h = para_after(wares, H3, "The chest")
c2 = para_after(c2h, BODY, f"The chest beside your cot (E, inside the hovel) keeps what the hand does not. You hold **one weapon** — the stick, the cudgel or the quarterstaff — and “Take up” swaps it; a newly bought weapon goes straight to your hand. Loaves wait in the larder (**{C['chest']['larderCap']} at most**) and are eaten there, when wounded, for a full heal. Bread mends HP and nothing else.")

# ---- sleep ----
set_text(P[32], f"You earn the **Well-Rested boon** (+{SL['wisXp']} Wisdom XP, +{SL['coins']} coins, +{SL['staminaBonus']} stamina cap for the day, once per day) when:")
set_text(P[33], f"at least **{SL['minHours']} hours** have passed since the recorded bedtime (and no more than {SL['maxHours']}, so it was last night), and")
set_text(P[34], f"you open the game by **{SL['wakeByHour']}:00 AM** local time.")

# ---- new sections before Saving ----
sh = para_after(P[37], H2, "The Sage & the Chronicler")
g1 = para_after(sh, BODY, "Two helpers run on the Anthropic API and need an API key, which you grant in the Tome. The key is kept in this browser, outside your save, so a Scribe copy never carries it. Without a key the game plays exactly as before.")
g2 = para_after(g1, BULLET, "**The Sage** names the virtue of each completed deed, in place of the four-button pick. His verdict is final. If he cannot be reached, is slow, or answers nonsense, the manual pick appears instead; “Choose thyself” cancels him.")
g3 = para_after(g2, BULLET, "**The Chronicler** writes one short entry of medieval prose for each finished week, from your deeds and your sleep. He writes at most one entry each time you open the game, and they are read in the Tome under Weekly Chronicle.")
mh = para_after(g3, H2, "The Map & the Sky")
m1 = para_after(mh, BODY, f"**M** unrolls the Map of the Kingdom of {C['realm']['kingdom']} — coast, mountains, {C['realm']['lake']}, roads and towns, each named when you hover — with {C['realm']['village']} ringed in wax. Beside it is a plan of the village drawn from the game itself: the buildings, the trees, today’s crop on the strip, and an arrow for where you stand. Only the village can be walked; the kingdom is a picture.")
m2 = para_after(m1, BODY, "The sky keeps the hour of your own clock. The sun rises, crosses and sets at the real time of day, with long days in summer and early dark in winter; night brings stars, the moon in her true phase, a lit window in the hovel and the campfire as the village’s light.")

# ---- saving ----
set_text(P[39], "Your save lives only in this browser, and separately for each address the game is opened at — the hosted game and the dev server do not share one. The **Scribe**, at the bottom of the Tome, guards against misfortune and carries your progress between them: **Download a copy** writes your whole chronicle to a JSON file; **Restore from a copy** validates the file, keeps your replaced save as a fallback, and reloads the realm from the copy. Take a copy now and then — a browser cleanup would otherwise take the year with it.")

# ---- the road ahead ----
fill(road, [
    ["Version", "What comes"],
    ["v2 — The Living Village", "Villagers with AI-driven dialogue. Already here: the Sage, and the Chronicler’s weekly entries"],
    ["v3 — Coin & Commerce", "Festival mini-games, rotating cart stock, more gear and home upgrades. Already here: the chapman’s cart"],
    ["v4 — Bonds & Bloodline", "Relationships, courtship, marriage, family — gated by sustained streaks"],
    ["v5 — The Ascension Arc", "Squire, Knight, and Lord chapters, real enemies, the militia, and the Coronation ceremony (the crowning itself already happens at King)"],
])

# ---- a day in the life ----
set_text(P[44], "**Morning, before eight:** open the game — if you slept in the cot last night, the dawn pays out.")
set_text(P[45], "Post the daily at the Quest Board in your own words, and watch the fire gutter until it is done.")
set_text(P[46], "Go live your life. The deed happens out there, not in here.")
set_text(P[47], "**Evening:** mark it complete and collect the refill. Work today’s job on the miller’s strip, whack the dummy, collect a rat tail or two — and if money moved into savings, lay in coin at the Exchequer.")
set_text(P[48], "**Last thing:** walk home, shut the door, and press E at the cot. The night is marked.")

d.save(out)
