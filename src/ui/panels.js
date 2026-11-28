import {
  weaponHungUp,
  hangUpWeapon,
  getState,
  postDaily,
  completeDaily,
  removeDaily,
  dailyDeeds,
  shareXp,
  deedVirtues,
  postWeekly,
  completeWeekly,
  postMonthly,
  completeMonthly,
  setEpicText,
  setEpicProgress,
  buyItem,
  ownedWeapons,
  wieldedWeapon,
  wieldWeapon,
  eatLoaf,
  xpToNext,
  totalLevels,
  STAT_NAMES,
  exportSave,
  isSaveText,
  importSave,
} from '../state/state.js';
import { CONFIG } from '../state/config.js';
import { mouseFeelId, setMouseFeel } from '../state/prefs.js';
import { PROVING, worldUrl } from '../proving/proving.js';
import { todayStr } from '../state/dates.js';
import { renderGuide } from './guide.js';
import { renderMap } from './map.js';
import { renderTreasury, resetTreasury } from './treasury.js';
import { warePicture, wareLore, hasWareLore } from './wares.js';
import { judgeDeed, sageEnabled, setSageKey } from '../ai/sage.js';
import { toast } from './toasts.js';
import { sfx } from './audio.js';

let overlay, boardPanel, tomePanel, ledgerPanel, treasuryPanel, shopPanel, guidePanel, chestPanel, rackPanel, mapPanel, boardBody, tomeBody, ledgerBody, treasuryBody, shopBody, guideBody, chestBody, rackBody, mapBody;
let open = null;
let onOpenChange = () => {};
let shopActions = { isWounded: () => false, onPurchase: () => {}, onEat: () => {}, onWield: () => {}, mapView: null }; // wired by main.js
// A quest on the board is known by its slot: 'weekly', 'monthly', or one of
// today's deeds — 'daily:0', 'daily:1' …
let pickFor = null; // the slot whose virtues are being chosen
let picked = []; // the virtues ticked for it so far, in the order ticked
let judgingFor = null; // the slot awaiting the sage's verdict
let judgeSeq = 0; // bumped to orphan any in-flight verdict (cancel, close, dismiss)
let editingEpic = false;
let pendingImport = null; // { name, text } awaiting the player's confirmation

const QUEST_TITLES = { daily: 'Daily Quests', weekly: 'Weekly Bounty', monthly: 'Monthly Campaign' };
const QUEST_DONE_LINES = {
  daily: 'The day is won. The fire grows.',
  weekly: 'A bounty well earned.',
  monthly: 'A campaign concluded in glory.',
};
const POST_FNS = { daily: postDaily, weekly: postWeekly, monthly: postMonthly };

const slotKind = (slot) => slot.split(':')[0];
const slotIndex = (slot) => Number(slot.split(':')[1]); // a daily deed's place in today's list
const slotQuest = (slot) => (slotKind(slot) === 'daily' ? dailyDeeds()[slotIndex(slot)] : getState().quests[slot]);

function completeSlot(slot, virtues) {
  if (slotKind(slot) === 'daily') return completeDaily(virtues, slotIndex(slot));
  return (slot === 'weekly' ? completeWeekly : completeMonthly)(virtues);
}

// 'Athleticism', 'Athleticism and Influence', 'Athleticism, Wisdom and Influence'
function virtueNames(keys) {
  const names = keys.map((k) => STAT_NAMES[k]);
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0];
}

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// The road to the crown: the Coronation is earned at King, not scheduled
function crownText() {
  const s = getState();
  if (s.coronationAt) {
    const d = new Date(s.coronationAt);
    return `The realm hath its King — crowned ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}.`;
  }
  const need = CONFIG.ranks.find((r) => r.title === 'King').totalLevels;
  return `The crown is not given — it is earned. ${totalLevels()} of ${need} virtue levels won.`;
}

// ---------- Quest Board ----------

// A posted quest not yet done, in whichever state it stands: before the sage,
// its virtues being chosen, or waiting to be marked. `strike` lets one of
// today's deeds, posted in error, be taken down.
function waitingBody(slot, q, strike = false) {
  const text = `<div class="quest-text">“${esc(q.text)}”</div>`;
  if (judgingFor === slot) {
    return `${text}
      <p class="muted">The sage reads thy deed…</p>
      <div class="row right"><button data-sage-cancel>Choose thyself</button></div>`;
  }
  if (pickFor === slot) {
    const picks = Object.entries(STAT_NAMES)
      .map(([k, name]) => {
        const on = picked.includes(k);
        return `<button data-pick="${k}" class="${on ? 'chosen' : ''}" aria-pressed="${on}">${name}</button>`;
      })
      .join('');
    // how the XP would fall, as it is chosen
    const share = picked.length
      ? shareXp(CONFIG.rewards[slotKind(slot)].xp, picked).map((g) => `${STAT_NAMES[g.stat]} +${g.xp}`).join(' · ')
      : 'Choose at least one.';
    return `${text}
      <p class="muted">Which virtue did this deed train? Choose one — or each it truly trained, and the XP is shared among them.</p>
      <div class="stat-pick">${picks}</div>
      <div class="row">
        <span class="grow muted" data-pick-share>${share}</span>
        <button class="primary" data-pick-done ${picked.length ? '' : 'disabled'}>Claim</button>
      </div>`;
  }
  return `${text}
    <div class="row right">
      ${strike ? '<button class="tr-quiet" data-strike title="Take this deed down">Take down</button>' : ''}
      <button class="primary" data-complete>Mark Complete</button>
    </div>`;
}

// the weekly bounty and the monthly campaign: one quest each
function questSlot({ kind, q, sub, placeholder }) {
  if (!q.text) {
    return `
      <div class="quest-block" data-kind="${kind}">
        <h2>${QUEST_TITLES[kind]} <span class="sub">${sub}</span></h2>
        <p class="muted">${placeholder}</p>
        <div class="row">
          <input type="text" class="grow" data-input maxlength="120"
            placeholder="Write it in your own words..." />
          <button class="primary" data-post>Post</button>
        </div>
      </div>`;
  }
  if (!q.completed) {
    return `
      <div class="quest-block" data-kind="${kind}" data-slot="${kind}">
        <h2>${QUEST_TITLES[kind]} <span class="sub">${sub}</span></h2>
        ${waitingBody(kind, q)}
      </div>`;
  }
  return `
    <div class="quest-block" data-kind="${kind}">
      <div class="stamp">Done</div>
      <h2>${QUEST_TITLES[kind]}</h2>
      <div class="quest-text">“${esc(q.text)}”</div>
      <p class="muted">${QUEST_DONE_LINES[kind]}</p>
    </div>`;
}

// Today's deeds: as many as the board will take in a day, each done and paid
// on its own. The first one done claims the day (the fire, the stamina).
function dailyBlock(sub) {
  const deeds = dailyDeeds();
  const max = CONFIG.quests.dailyMax;
  const rows = deeds
    .map((q, i) =>
      q.completed
        ? `<div class="deed-slot done">
            <div class="quest-text">“${esc(q.text)}”</div>
            <span class="deed-done">Done${q.virtues?.length ? ` · ${q.virtues.map((k) => STAT_NAMES[k]).join(' · ')}` : ''}</span>
          </div>`
        : `<div class="deed-slot" data-slot="daily:${i}">${waitingBody(`daily:${i}`, q, true)}</div>`
    )
    .join('');
  const post =
    deeds.length >= max
      ? `<p class="muted">The board holds ${max} deeds a day, and no more. Tomorrow it is bare again.</p>`
      : `${deeds.length ? '' : '<p class="muted">What real deeds will you do today? Lift, learn, build, reach out...</p>'}
        <div class="row">
          <input type="text" class="grow" data-input maxlength="120"
            placeholder="${deeds.length ? `Another deed for today (${deeds.length} of ${max} posted)...` : 'Write it in your own words...'}" />
          <button class="primary" data-post>Post</button>
        </div>`;
  return `
    <div class="quest-block" data-kind="daily">
      <h2>${QUEST_TITLES.daily} <span class="sub">${sub}</span></h2>
      ${rows}
      ${deeds.some((q) => q.completed) ? `<p class="muted">${QUEST_DONE_LINES.daily}</p>` : ''}
      ${post}
    </div>`;
}

function renderBoard() {
  const s = getState();
  const epic = s.quests.epic;
  const r = CONFIG.rewards;

  const epicBody =
    !epic.text || editingEpic
      ? `<div class="row">
          <input type="text" class="grow" data-epic-input maxlength="160"
            value="${esc(epic.text)}" placeholder="The one great deed of this year..." />
          <button class="primary" data-epic-save>Inscribe</button>
        </div>`
      : `<div class="quest-text">“${esc(epic.text)}”</div>
        <div class="row">
          <div class="xpbar grow" title="${epic.progressPct}%"><div style="width:${epic.progressPct}%"></div></div>
          <span>${epic.progressPct}%</span>
        </div>
        <div class="row">
          <input type="number" data-epic-pct min="0" max="100" value="${epic.progressPct}" style="width:90px" />
          <button data-epic-update>Update Progress</button>
          <span class="grow"></span>
          <button data-epic-edit>Rewrite</button>
        </div>`;

  boardBody.innerHTML = `
    ${dailyBlock(`+${r.daily.xp} XP · +${r.daily.coins} coins each · the first refills stamina`)}
    ${questSlot({
      kind: 'weekly',
      q: s.quests.weekly,
      sub: `+${r.weekly.xp} XP · +${r.weekly.coins} coins · resets Monday`,
      placeholder: 'One greater labor for this week.',
    })}
    ${questSlot({
      kind: 'monthly',
      q: s.quests.monthly,
      sub: `+${r.monthly.xp} XP · +${r.monthly.coins} coins · resets the 1st`,
      placeholder: 'One mighty campaign for this moon.',
    })}
    <div class="quest-block">
      <h2>The Epic Quest <span class="sub">the year&#8217;s great work</span></h2>
      ${epicBody}
      <p class="countdown" style="margin-top:10px">${crownText()}</p>
    </div>`;

  bindBoard();
}

function rewardToast(res) {
  const xp = res.gains.map((g) => `+${g.xp} ${STAT_NAMES[g.stat]} XP`).join(' · ');
  toast(`${xp} · +${res.coins} coins`, 'gold');
  sfx.questDone();
  for (const g of res.gains) {
    for (const lvl of g.levelUps) {
      toast(`${STAT_NAMES[g.stat]} rises to level ${lvl}!`, 'gold');
      sfx.levelUp();
    }
  }
}

// the manual picker, begun afresh for a slot
function openPicker(slot) {
  pickFor = slot;
  picked = [];
}

function bindBoard() {
  // posting: one box per kind (the daily's adds another deed to today's list)
  for (const block of boardBody.querySelectorAll('.quest-block[data-kind]')) {
    const kind = block.dataset.kind;
    const input = block.querySelector('[data-input]');
    const postBtn = block.querySelector('[data-post]');
    if (!postBtn) continue;
    const post = () => {
      if (!input.value.trim()) return;
      POST_FNS[kind](input.value);
      renderBoard();
    };
    postBtn.addEventListener('click', post);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') post();
      e.stopPropagation(); // typing must not move the player
    });
  }

  // a posted quest's own buttons
  for (const el of boardBody.querySelectorAll('[data-slot]')) {
    const slot = el.dataset.slot;
    el.querySelector('[data-complete]')?.addEventListener('click', () => {
      if (!sageEnabled()) {
        openPicker(slot);
        renderBoard();
        return;
      }
      // the sage's verdict is final; the picker is every failure's fallback
      judgingFor = slot;
      pickFor = null;
      const seq = ++judgeSeq;
      renderBoard();
      judgeDeed(slotQuest(slot).text).then(({ virtues, keyTrouble }) => {
        if (seq !== judgeSeq || judgingFor !== slot) return; // cancelled, closed, or superseded
        judgingFor = null;
        if (virtues) {
          const res = completeSlot(slot, virtues);
          if (res) {
            toast(`The sage judges this deed ${virtueNames(virtues)}.`, '');
            rewardToast(res);
          }
        } else {
          toast(
            keyTrouble
              ? 'The sage rejects thy key — see him in the Tome.'
              : 'The sage is silent. Choose thyself.',
            'grim'
          );
          openPicker(slot);
        }
        renderBoard();
      });
    });
    el.querySelector('[data-sage-cancel]')?.addEventListener('click', () => {
      judgeSeq += 1; // orphan the in-flight verdict
      judgingFor = null;
      openPicker(slot);
      renderBoard();
    });
    for (const btn of el.querySelectorAll('[data-pick]')) {
      btn.addEventListener('click', () => {
        const stat = btn.dataset.pick;
        picked = picked.includes(stat) ? picked.filter((k) => k !== stat) : [...picked, stat];
        renderBoard();
      });
    }
    el.querySelector('[data-pick-done]')?.addEventListener('click', () => {
      if (!picked.length) return;
      const res = completeSlot(slot, picked);
      pickFor = null;
      picked = [];
      if (res) rewardToast(res);
      renderBoard();
    });
    el.querySelector('[data-strike]')?.addEventListener('click', () => {
      // the deeds below it move up a place: nothing may be left pointing at the old one
      judgeSeq += 1;
      judgingFor = pickFor = null;
      removeDaily(slotIndex(slot));
      renderBoard();
    });
  }

  const epicInput = boardBody.querySelector('[data-epic-input]');
  if (epicInput) {
    epicInput.addEventListener('keydown', (e) => e.stopPropagation());
    boardBody.querySelector('[data-epic-save]').addEventListener('click', () => {
      if (!epicInput.value.trim()) return;
      setEpicText(epicInput.value);
      editingEpic = false;
      toast('The Epic Quest is inscribed.', 'gold');
      renderBoard();
    });
  }
  boardBody.querySelector('[data-epic-edit]')?.addEventListener('click', () => {
    editingEpic = true;
    renderBoard();
  });
  boardBody.querySelector('[data-epic-update]')?.addEventListener('click', () => {
    const v = Number(boardBody.querySelector('[data-epic-pct]').value);
    setEpicProgress(v);
    toast(`The great work stands at ${getState().quests.epic.progressPct}%.`, 'gold');
    renderBoard();
  });
  boardBody.querySelector('[data-epic-pct]')?.addEventListener('keydown', (e) => e.stopPropagation());
}

// ---------- Character Sheet (the Tome) ----------

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function deedDate(ymd) {
  const [y, m, d] = ymd.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ’${String(y).slice(2)}`;
}

function deedRows(history) {
  if (!history.length) return `<p class="muted">No deeds yet writ. The board awaits.</p>`;
  return [...history]
    .reverse()
    .map((h) => {
      const tag =
        h.type === 'epic'
          ? `the great work · ${h.progressPct}%`
          : `${deedVirtues(h).map((k) => STAT_NAMES[k]).join(' + ') || '—'} · ${h.type}`;
      return `<div class="deed">
        <span class="deed-date">${deedDate(h.date)}</span>
        <span class="deed-text">“${esc(h.questText)}”</span>
        <span class="deed-tag">${tag}</span>
      </div>`;
    })
    .join('');
}

function journalEntries(chronicle) {
  return [...chronicle]
    .reverse()
    .map(
      (e) => `<div class="journal-entry">
        <div class="journal-week">Week of ${deedDate(e.week)}</div>
        <p class="journal-prose">${esc(e.text)}</p>
      </div>`
    )
    .join('');
}

function renderTome() {
  const s = getState();

  const ladder = CONFIG.ranks
    .map(
      (r) => `<span class="rank-chip${r.title === s.rank ? ' current' : ''}">${r.title}</span>`
    )
    .join('');

  const statRows = Object.entries(STAT_NAMES)
    .map(([k, name]) => {
      const st = s.stats[k];
      const next = xpToNext(k);
      return `
        <div class="stat-row">
          <span>${name}</span><span class="lvl">Lv ${st.level}</span>
          <div class="xpbar" title="${st.xp} / ${next} XP"><div style="width:${(st.xp / next) * 100}%"></div></div>
        </div>`;
    })
    .join('');

  tomeBody.innerHTML = `
    <div class="sheet-section">
      <div class="rank-ladder">${ladder}</div>
    </div>
    <div class="sheet-section">
      <p class="countdown"><span class="big">${crownText()}</span></p>
    </div>
    <div class="sheet-section">
      <h2>Virtues</h2>
      ${statRows}
    </div>
    <div class="sheet-section">
      <h2>Wealth</h2>
      <div class="kv"><span>Coins (quest spoils)</span><span class="v">${s.coins}</span></div>
      <p class="muted">Thy true hoard is counted at the Exchequer&#8217;s table.</p>
    </div>
    <div class="sheet-section">
      <h2>The Chronicle</h2>
      <div class="kv"><span>Streak</span><span class="v">${s.streak.current} days (best ${s.streak.best})</span></div>
      <div class="kv"><span>Days walked this land</span><span class="v">${s.daysPlayed}</span></div>
      <div class="kv"><span>Deeds recorded</span><span class="v">${s.history.length}</span></div>
      <div class="deed-list">${deedRows(s.history)}</div>
    </div>
    <div class="sheet-section">
      <h2>The Weekly Chronicle</h2>
      ${
        s.chronicle.length
          ? `<div class="deed-list journal">${journalEntries(s.chronicle)}</div>`
          : `<p class="muted">${
              sageEnabled()
                ? 'The chronicler has yet to take up his pen. He writes of each week once it has ended.'
                : 'Appoint the sage (below) and the chronicler will write of thy weeks in his own hand.'
            }</p>`
      }
    </div>
    <div class="sheet-section">
      <h2>The Scribe</h2>
      <p class="muted">Thy chronicle lives only in this browser. Keep a copy against misfortune.</p>
      ${
        pendingImport
          ? `<p>Replace thy current chronicle with “${esc(pendingImport.name)}”? All present progress yields to the copy.</p>
            <div class="row">
              <button class="primary" data-import-confirm>Restore the copy</button>
              <button data-import-cancel>Keep mine</button>
            </div>`
          : `<div class="row">
              <button data-export>Download a copy</button>
              <button data-import-pick>Restore from a copy</button>
              <input type="file" accept=".json,application/json" data-import-file class="hidden" />
            </div>`
      }
    </div>
    <div class="sheet-section">
      <h2>The Reins</h2>
      <p class="muted">How sharply the camera answers thy mouse, touchpad and arrow keys. Kept to this browser, outside thy save.</p>
      <div class="stat-pick">
        ${CONFIG.mouse.feels
          .map(
            (f) =>
              `<button data-feel="${f.id}"${f.id === mouseFeelId() ? ' class="chosen"' : ''}>${f.name}</button>`
          )
          .join('')}
      </div>
    </div>
    <div class="sheet-section">
      <h2>The Sage</h2>
      ${
        sageEnabled()
          ? `<p class="muted">The sage is in thy service — he names the virtue of each completed
              deed himself. The manual choice returns whenever he falters.</p>
            <div class="row right"><button data-sage-clear>Dismiss the sage</button></div>`
          : `<p class="muted">Grant the sage a key (console.anthropic.com) and he will name the
              virtue of each completed deed. The key stays in this browser, outside thy save.</p>
            <div class="row">
              <input type="password" class="grow" data-sage-key placeholder="sk-ant-..." />
              <button data-sage-set>Appoint</button>
            </div>`
      }
    </div>
    <div class="sheet-section">
      <h2>The Proving Ground</h2>
      ${
        PROVING
          ? `<p class="muted">Thou standest in the test world. Nothing done here touches thy true
              chronicle. Press / for its commands.</p>
            <div class="row right"><button data-world="true">Return to the true realm</button></div>`
          : `<p class="muted">A second world for trying things out: its own save, commands to set
              anything, and days that pass when told to. Nothing done there touches this chronicle.</p>
            <div class="row right"><button data-world="test">Enter the test world</button></div>`
      }
    </div>`;

  tomeBody.querySelector('[data-export]')?.addEventListener('click', () => {
    const blob = new Blob([exportSave()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `crownbound-save-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('The scribe copies thy chronicle.', 'gold');
  });

  const fileInput = tomeBody.querySelector('[data-import-file]');
  tomeBody.querySelector('[data-import-pick]')?.addEventListener('click', () => fileInput.click());
  fileInput?.addEventListener('change', async () => {
    const f = fileInput.files[0];
    if (!f) return;
    const text = await f.text();
    if (!isSaveText(text)) {
      toast('That scroll is no chronicle of this realm.', 'grim');
      fileInput.value = '';
      return;
    }
    pendingImport = { name: f.name, text };
    renderTome();
  });
  tomeBody.querySelector('[data-import-confirm]')?.addEventListener('click', () => {
    if (importSave(pendingImport.text)) {
      toast('The chronicle is restored. The realm awakens anew.', 'gold');
      setTimeout(() => location.reload(), 900);
    } else {
      toast('That scroll is no chronicle of this realm.', 'grim');
      pendingImport = null;
      renderTome();
    }
  });
  tomeBody.querySelector('[data-import-cancel]')?.addEventListener('click', () => {
    pendingImport = null;
    renderTome();
  });

  for (const btn of tomeBody.querySelectorAll('[data-feel]')) {
    btn.addEventListener('click', () => {
      if (btn.dataset.feel === mouseFeelId()) return;
      setMouseFeel(btn.dataset.feel);
      toast(`The reins are set ${btn.textContent.toLowerCase()}.`, '');
      renderTome();
    });
  }

  tomeBody.querySelector('[data-sage-set]')?.addEventListener('click', () => {
    const k = tomeBody.querySelector('[data-sage-key]').value.trim();
    if (!k) return;
    setSageKey(k);
    toast('The sage enters thy service.', 'gold');
    renderTome();
  });
  tomeBody.querySelector('[data-sage-clear]')?.addEventListener('click', () => {
    setSageKey(null);
    toast('The sage departs the village.', '');
    renderTome();
  });

  // the other world is this same page with ?test=1 on its address (or off it)
  tomeBody.querySelector('[data-world]').addEventListener('click', (e) => {
    location.href = worldUrl(e.target.dataset.world === 'test');
  });

  for (const inp of tomeBody.querySelectorAll('input')) {
    inp.addEventListener('keydown', (e) => e.stopPropagation());
  }
}

// ---------- The Sleep Ledger ----------

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function nightDate(iso) {
  const d = new Date(iso);
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function nightTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

const NIGHT_TAGS = {
  dawn: ['rose with the dawn', 'tag-gold'],
  late: ['past the bell', 'tag-grim'],
  unwitnessed: ['unwitnessed', ''],
};

function renderLedger() {
  const log = getState().sleep.log;
  const week = log.slice(-7).reverse(); // newest morning first
  const wellRested = week.filter((n) => n.verdict === 'dawn').length;

  const rows = week
    .map((n) => {
      const [tagText, tagClass] = NIGHT_TAGS[n.verdict] ?? ['—', ''];
      let times = `abed ${nightTime(n.bed)}`;
      if (n.wake) {
        const mins = Math.max(0, Math.round((new Date(n.wake) - new Date(n.bed)) / 60000));
        times += ` · rose ${nightTime(n.wake)} · ${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`;
      } else {
        times += ' · the morning went unmarked';
      }
      return `<div class="deed">
        <span class="deed-date">${nightDate(n.wake ?? n.bed)}</span>
        <span class="deed-text">${times}</span>
        <span class="deed-tag ${tagClass}">${tagText}</span>
      </div>`;
    })
    .join('');

  ledgerBody.innerHTML = `
    <div class="sheet-section">
      <p class="muted">Sleep in thy cot to mark the night; return with the dawn to mark the morning.
      Seven hours abed and back by ${CONFIG.sleep.wakeByHour} o&#8217;clock earns the Well-Rested boon.</p>
      ${
        week.length
          ? `<div class="kv"><span>This week</span>
              <span class="v">${wellRested} of ${week.length} night${week.length === 1 ? '' : 's'} well-rested</span></div>
            <div class="deed-list">${rows}</div>`
          : `<p class="muted" style="text-align:center; margin-top:14px">No nights yet recorded.
              The cot awaits, and the dawn keeps its own tally.</p>`
      }
    </div>`;
}

// ---------- the wares' pictures and their "read more" (shop + chest) ----------

// The wares whose "read more" is unfolded, by id. Kept while the panel is
// open, so a purchase or a weapon swap re-renders without folding them;
// emptied on close, so every visit opens tidy.
const openWares = new Set();

// a ware's picture — a button that unfolds its "read more", where it has one
function warePic(item) {
  const pic = warePicture(item.id, item.name);
  if (!hasWareLore(item.id)) return `<span class="ware-pic">${pic}</span>`;
  const open = openWares.has(item.id);
  return `<button class="ware-pic" data-more="${item.id}" aria-expanded="${open}"
    title="Read more of ${item.name}">${pic}</button>`;
}

// the words that unfold (or fold) a ware's "read more", after its flavor line
function wareMoreLink(item) {
  if (!hasWareLore(item.id)) return '';
  const open = openWares.has(item.id);
  return `<button class="ware-more-link" data-more="${item.id}" aria-expanded="${open}">${
    open ? 'Read less &#9652;' : 'Read more &#9662;'
  }</button>`;
}

// the unfolded "read more" itself, when open — it takes a whole line of the row
const wareMore = (item, inChest = false) => (openWares.has(item.id) ? wareLore(item, inChest) : '');

function bindWareToggles(body, rerender) {
  for (const btn of body.querySelectorAll('[data-more]')) {
    btn.addEventListener('click', () => {
      const id = btn.dataset.more;
      if (openWares.has(id)) openWares.delete(id);
      else openWares.add(id);
      sfx.page();
      rerender();
    });
  }
}

// ---------- The Chapman's Cart (market days only) ----------

const SHOP_SECTIONS = [
  ['hand', 'Wares for the Hand'],
  ['home', 'Wares for the Home'],
  ['comforts', 'Small Comforts'],
];

function renderShop() {
  const s = getState();
  const rankIdx = (title) => CONFIG.ranks.findIndex((r) => r.title === title);

  const sections = SHOP_SECTIONS.map(([cat, title]) => {
    const rows = CONFIG.shop.items
      .filter((i) => i.category === cat)
      .map((item) => {
        const owned = item.once && s.shop.owned.includes(item.id);
        const locked = item.minRank && rankIdx(s.rank) < rankIdx(item.minRank);
        const larderFull = item.id === 'loaf' && s.chest.loaves >= CONFIG.chest.larderCap;
        let action;
        if (owned) action = `<span class="deed-tag tag-gold">owned</span>`;
        else if (locked) action = `<span class="deed-tag tag-grim">for a ${item.minRank}</span>`;
        else
          action = `<button data-buy="${item.id}" ${s.coins < item.price || larderFull ? 'disabled' : ''}
            title="${larderFull ? 'Thy chest&#8217;s larder is full.' : ''}">${item.price}c</button>`;
        return `<div class="deed ware${locked ? ' locked' : ''}">
          ${warePic(item)}
          <span class="deed-text"><b>${item.name}</b> — <span class="muted">${item.flavor}</span>
            ${wareMoreLink(item)}</span>
          ${action}
          ${wareMore(item)}
        </div>`;
      })
      .join('');
    return `<div class="sheet-section"><h2>${title}</h2>${rows}</div>`;
  }).join('');

  shopBody.innerHTML = `
    <div class="sheet-section">
      <div class="kv"><span>Thy purse</span><span class="v">${s.coins} coins</span></div>
      <p class="muted">The chapman deals in comfort and swagger. Virtue is not for sale, at any price.
        Click a ware&#8217;s picture to read more of it.</p>
    </div>
    ${sections}`;

  bindWareToggles(shopBody, renderShop);

  for (const btn of shopBody.querySelectorAll('[data-buy]')) {
    btn.addEventListener('click', () => {
      const res = buyItem(btn.dataset.buy);
      if (res.ok) {
        const where = res.item.id === 'loaf' ? ' It waits in thy chest at home.' : '';
        toast(`${res.item.name} — bought and paid for.${where}`, 'gold');
        sfx.questDone();
        shopActions.onPurchase(res.item);
      } else if (res.why === 'coins') {
        toast('Thy purse is too light for that.', 'grim');
      }
      renderShop();
    });
  }
}

// ---------- The Weapon Rack (by the door) ----------
// Every weapon not in hand hangs here, the stick among them; the hand holds
// one, or none while all of them are on their pegs.

function renderRack() {
  const inHand = wieldedWeapon();
  const hung = weaponHungUp(); // every weapon on the pegs, hands empty
  const damageOf = (w) => w.damage ?? CONFIG.player.attackDamage;

  const weapons = ownedWeapons()
    .map((w) => {
      const held = w.id === inHand.id && !hung;
      const action = held
        ? `<span class="deed-tag tag-gold">in hand</span> <button data-hang>Hang up</button>`
        : `<button data-wield="${w.id}">Take up</button>`;
      return `<div class="deed ware">
        ${warePic(w)}
        <span class="deed-text"><b>${w.name}</b> — <span class="muted">${w.flavor}</span>
          <span class="muted">(${damageOf(w)} damage)</span> ${wareMoreLink(w)}</span>
        ${action}
        ${wareMore(w, true)}
      </div>`;
    })
    .join('');

  rackBody.innerHTML = `
    <div class="sheet-section">
      <div class="kv"><span>In thy hand</span><span class="v">${hung ? 'nothing' : inHand.name}</span></div>
      <p class="muted">Thou carriest one weapon; the rest hang here on their pegs. Hang up the one
        in hand to walk about empty-handed &#8212; but empty hands cannot swing.</p>
    </div>
    <div class="sheet-section">
      <h2>Weapons</h2>
      ${weapons}
    </div>`;

  for (const btn of rackBody.querySelectorAll('[data-wield]')) {
    btn.addEventListener('click', () => {
      if (wieldWeapon(btn.dataset.wield)) {
        toast(`Thou takest down ${wieldedWeapon().name}.`, '');
        shopActions.onWield();
      }
      renderRack();
    });
  }
  rackBody.querySelector('[data-hang]')?.addEventListener('click', () => {
    hangUpWeapon(true);
    toast(`Thou hangest ${inHand.name} on its pegs.`, '');
    shopActions.onWield();
    renderRack();
  });
  bindWareToggles(rackBody, renderRack);
}

// ---------- The Chest (beside the cot) ----------

function renderChest() {
  const s = getState();
  const loaves = s.chest.loaves;
  const hale = !shopActions.isWounded();
  const loaf = CONFIG.shop.items.find((i) => i.id === 'loaf');
  chestBody.innerHTML = `
    <div class="sheet-section">
      <p class="muted">Thy weapons hang on the rack by the door.</p>
    </div>
    <div class="sheet-section">
      <h2>The Larder</h2>
      <div class="deed ware${loaves ? '' : ' locked'}">
        ${warePic(loaf)}
        <div class="deed-text">
          <div class="kv"><span>Loaves</span><span class="v">${loaves} of ${CONFIG.chest.larderCap}</span></div>
          <span class="muted">${
            loaves
              ? 'A loaf mends every wound at once. Bread keeps; eat it when thou art hurt.'
              : 'Empty. The chapman sells loaves on market days.'
          }</span>
          ${wareMoreLink(loaf)}
        </div>
        ${wareMore(loaf, true)}
      </div>
      <div class="row right">
        <button class="primary" data-eat ${!loaves || hale ? 'disabled' : ''}
          title="${loaves && hale ? 'Thou art hale — bread keeps.' : ''}">Eat a loaf</button>
      </div>
    </div>`;

  bindWareToggles(chestBody, renderChest);
  chestBody.querySelector('[data-eat]').addEventListener('click', () => {
    if (shopActions.isWounded() && eatLoaf()) {
      toast('Warm bread. The aches ease.', 'gold');
      shopActions.onEat();
    }
    renderChest();
  });
}

// ---------- open/close ----------

function close() {
  if (!open) return;
  open = null;
  pickFor = null;
  picked = [];
  judgeSeq += 1; // a verdict landing after close is discarded, not applied unseen
  judgingFor = null;
  editingEpic = false;
  pendingImport = null;
  openWares.clear();
  resetTreasury();
  overlay.classList.add('hidden');
  boardPanel.classList.add('hidden');
  tomePanel.classList.add('hidden');
  ledgerPanel.classList.add('hidden');
  treasuryPanel.classList.add('hidden');
  shopPanel.classList.add('hidden');
  guidePanel.classList.add('hidden');
  chestPanel.classList.add('hidden');
  rackPanel.classList.add('hidden');
  mapPanel.classList.add('hidden');
  onOpenChange(false);
}

export { close as closePanel };

// which panel is open ('board', 'map', …), or null
export function openPanelId() {
  return open;
}

export function openPanel(id) {
  open = id;
  sfx.page();
  overlay.classList.remove('hidden');
  boardPanel.classList.toggle('hidden', id !== 'board');
  tomePanel.classList.toggle('hidden', id !== 'tome');
  ledgerPanel.classList.toggle('hidden', id !== 'ledger');
  treasuryPanel.classList.toggle('hidden', id !== 'treasury');
  shopPanel.classList.toggle('hidden', id !== 'shop');
  guidePanel.classList.toggle('hidden', id !== 'guide');
  chestPanel.classList.toggle('hidden', id !== 'chest');
  rackPanel.classList.toggle('hidden', id !== 'rack');
  mapPanel.classList.toggle('hidden', id !== 'map');
  if (id === 'board') renderBoard();
  else if (id === 'ledger') renderLedger();
  else if (id === 'treasury') renderTreasury(treasuryBody);
  else if (id === 'shop') renderShop();
  else if (id === 'guide') renderGuide(guideBody);
  else if (id === 'chest') renderChest();
  else if (id === 'rack') renderRack();
  else if (id === 'map') renderMap(mapBody, shopActions.mapView());
  else renderTome();
  onOpenChange(true);
}

export function isPanelOpen() {
  return open !== null;
}

export function initPanels(openChangeCallback, shopHooks) {
  onOpenChange = openChangeCallback;
  if (shopHooks) shopActions = { ...shopActions, ...shopHooks };
  overlay = document.getElementById('panel-overlay');
  boardPanel = document.getElementById('quest-panel');
  tomePanel = document.getElementById('tome-panel');
  ledgerPanel = document.getElementById('ledger-panel');
  treasuryPanel = document.getElementById('treasury-panel');
  shopPanel = document.getElementById('shop-panel');
  guidePanel = document.getElementById('guide-panel');
  chestPanel = document.getElementById('chest-panel');
  rackPanel = document.getElementById('rack-panel');
  mapPanel = document.getElementById('map-panel');
  boardBody = document.getElementById('quest-body');
  tomeBody = document.getElementById('tome-body');
  ledgerBody = document.getElementById('ledger-body');
  treasuryBody = document.getElementById('treasury-body');
  shopBody = document.getElementById('shop-body');
  guideBody = document.getElementById('guide-body');
  chestBody = document.getElementById('chest-body');
  rackBody = document.getElementById('rack-body');
  mapBody = document.getElementById('map-body');

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) close();
  });
  overlay.addEventListener('mousedown', (e) => {
    if (e.target === overlay) close();
  });
}
