import {
  getState,
  postDaily,
  completeDaily,
  postWeekly,
  completeWeekly,
  postMonthly,
  completeMonthly,
  setEpicText,
  setEpicProgress,
  setTreasury,
  xpToNext,
  STAT_NAMES,
  exportSave,
  isSaveText,
  importSave,
} from '../state/state.js';
import { CONFIG } from '../state/config.js';
import { countdownTo, todayStr } from '../state/dates.js';
import { toast } from './toasts.js';
import { sfx } from './audio.js';

let overlay, boardPanel, tomePanel, ledgerPanel, treasuryPanel, boardBody, tomeBody, ledgerBody, treasuryBody;
let open = null;
let onOpenChange = () => {};
let timer = null;
let statPickFor = null; // 'daily' | 'weekly' | 'monthly'
let editingEpic = false;
let pendingImport = null; // { name, text } awaiting the player's confirmation

const QUEST_TITLES = { daily: 'Daily Quest', weekly: 'Weekly Bounty', monthly: 'Monthly Campaign' };
const QUEST_DONE_LINES = {
  daily: 'The day is won. The fire grows.',
  weekly: 'A bounty well earned.',
  monthly: 'A campaign concluded in glory.',
};
const POST_FNS = { daily: postDaily, weekly: postWeekly, monthly: postMonthly };
const COMPLETE_FNS = { daily: completeDaily, weekly: completeWeekly, monthly: completeMonthly };

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function countdownText() {
  const c = countdownTo(getState().quests.epic.deadline);
  if (c.past) return 'The hour of Coronation has come.';
  return `${c.days} days, ${c.hours} hours, ${c.minutes} minutes until the Coronation`;
}

// ---------- Quest Board ----------

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
  if (!q.completed && statPickFor === kind) {
    const picks = Object.entries(STAT_NAMES)
      .map(([k, name]) => `<button data-pick="${k}">${name}</button>`)
      .join('');
    return `
      <div class="quest-block" data-kind="${kind}">
        <h2>${QUEST_TITLES[kind]} <span class="sub">${sub}</span></h2>
        <div class="quest-text">“${esc(q.text)}”</div>
        <p class="muted">Which virtue did this deed train?</p>
        <div class="stat-pick">${picks}</div>
      </div>`;
  }
  if (!q.completed) {
    return `
      <div class="quest-block" data-kind="${kind}">
        <h2>${QUEST_TITLES[kind]} <span class="sub">${sub}</span></h2>
        <div class="quest-text">“${esc(q.text)}”</div>
        <div class="row right"><button class="primary" data-complete>Mark Complete</button></div>
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
    ${questSlot({
      kind: 'daily',
      q: s.quests.daily,
      sub: `+${r.daily.xp} XP · +${r.daily.coins} coins · refills stamina`,
      placeholder: 'What real deed will you do today? Lift, learn, build, reach out...',
    })}
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
      <p class="countdown" style="margin-top:10px"><span data-countdown>${countdownText()}</span></p>
    </div>`;

  bindBoard();
}

function rewardToast(name, res) {
  toast(`+${res.xp} ${name} XP · +${res.coins} coins`, 'gold');
  sfx.questDone();
  for (const lvl of res.levelUps) {
    toast(`${name} rises to level ${lvl}!`, 'gold');
    sfx.levelUp();
  }
}

function bindBoard() {
  for (const block of boardBody.querySelectorAll('.quest-block[data-kind]')) {
    const kind = block.dataset.kind;
    const input = block.querySelector('[data-input]');
    const postBtn = block.querySelector('[data-post]');
    if (postBtn) {
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
    block.querySelector('[data-complete]')?.addEventListener('click', () => {
      statPickFor = kind;
      renderBoard();
    });
    for (const btn of block.querySelectorAll('[data-pick]')) {
      btn.addEventListener('click', () => {
        const stat = btn.dataset.pick;
        const res = COMPLETE_FNS[kind](stat);
        statPickFor = null;
        if (res) rewardToast(STAT_NAMES[stat], res);
        renderBoard();
      });
    }
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
          : `${STAT_NAMES[h.statTrained] ?? '—'} · ${h.type}`;
      return `<div class="deed">
        <span class="deed-date">${deedDate(h.date)}</span>
        <span class="deed-text">“${esc(h.questText)}”</span>
        <span class="deed-tag">${tag}</span>
      </div>`;
    })
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
      <p class="countdown"><span class="big" data-countdown>${countdownText()}</span></p>
    </div>
    <div class="sheet-section">
      <h2>Virtues</h2>
      ${statRows}
    </div>
    <div class="sheet-section">
      <h2>Wealth</h2>
      <div class="kv"><span>Coins (quest spoils)</span><span class="v">${s.coins}</span></div>
      <p class="muted">Thy true hoard lies in the strongbox at home.</p>
    </div>
    <div class="sheet-section">
      <h2>The Chronicle</h2>
      <div class="kv"><span>Streak</span><span class="v">${s.streak.current} days (best ${s.streak.best})</span></div>
      <div class="kv"><span>Days walked this land</span><span class="v">${s.daysPlayed}</span></div>
      <div class="kv"><span>Deeds recorded</span><span class="v">${s.history.length}</span></div>
      <div class="deed-list">${deedRows(s.history)}</div>
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

// ---------- The Treasury (the strongbox in the hovel) ----------

function renderTreasury() {
  const t = getState().treasury;
  const tPct = Math.min(100, (t.current / t.goal) * 100);

  treasuryBody.innerHTML = `
    <div class="sheet-section">
      <div class="kv"><span>True savings</span>
        <span class="v">${t.current.toLocaleString()} / ${t.goal.toLocaleString()}</span></div>
      <div class="xpbar treasury" style="margin:6px 0"><div style="width:${tPct}%"></div></div>
      <div class="row">
        <input type="number" data-t-current min="0" value="${t.current}" title="Current savings" />
        <input type="number" data-t-goal min="1" value="${t.goal}" title="Savings goal" />
        <button data-t-set>Set</button>
      </div>
      <p class="muted">The strongbox keeps thy true hoard — coins of the realm buy nothing here. Yet.</p>
    </div>`;

  treasuryBody.querySelector('[data-t-set]').addEventListener('click', () => {
    const cur = Number(treasuryBody.querySelector('[data-t-current]').value);
    const goal = Number(treasuryBody.querySelector('[data-t-goal]').value);
    if (Number.isFinite(cur) && Number.isFinite(goal)) {
      setTreasury(cur, goal);
      toast('The Treasury ledger is updated.', 'gold');
      renderTreasury();
    }
  });
  for (const inp of treasuryBody.querySelectorAll('input')) {
    inp.addEventListener('keydown', (e) => e.stopPropagation());
  }
}

// ---------- open/close ----------

function close() {
  if (!open) return;
  open = null;
  statPickFor = null;
  editingEpic = false;
  pendingImport = null;
  overlay.classList.add('hidden');
  boardPanel.classList.add('hidden');
  tomePanel.classList.add('hidden');
  ledgerPanel.classList.add('hidden');
  treasuryPanel.classList.add('hidden');
  if (timer) clearInterval(timer);
  timer = null;
  onOpenChange(false);
}

export function openPanel(id) {
  open = id;
  sfx.page();
  overlay.classList.remove('hidden');
  boardPanel.classList.toggle('hidden', id !== 'board');
  tomePanel.classList.toggle('hidden', id !== 'tome');
  ledgerPanel.classList.toggle('hidden', id !== 'ledger');
  treasuryPanel.classList.toggle('hidden', id !== 'treasury');
  const bodies = { board: boardBody, tome: tomeBody, ledger: ledgerBody, treasury: treasuryBody };
  if (id === 'board') renderBoard();
  else if (id === 'ledger') renderLedger();
  else if (id === 'treasury') renderTreasury();
  else renderTome();
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    const el = bodies[id].querySelector('[data-countdown]');
    if (el) el.textContent = countdownText();
  }, 1000);
  onOpenChange(true);
}

export function isPanelOpen() {
  return open !== null;
}

export function initPanels(openChangeCallback) {
  onOpenChange = openChangeCallback;
  overlay = document.getElementById('panel-overlay');
  boardPanel = document.getElementById('quest-panel');
  tomePanel = document.getElementById('tome-panel');
  ledgerPanel = document.getElementById('ledger-panel');
  treasuryPanel = document.getElementById('treasury-panel');
  boardBody = document.getElementById('quest-body');
  tomeBody = document.getElementById('tome-body');
  ledgerBody = document.getElementById('ledger-body');
  treasuryBody = document.getElementById('treasury-body');

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) close();
  });
  overlay.addEventListener('mousedown', (e) => {
    if (e.target === overlay) close();
  });
}
