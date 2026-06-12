import {
  getState,
  postDaily,
  completeDaily,
  postWeekly,
  completeWeekly,
  setEpicText,
  setEpicProgress,
  setTreasury,
  xpToNext,
  STAT_NAMES,
} from '../state/state.js';
import { CONFIG } from '../state/config.js';
import { countdownTo } from '../state/dates.js';
import { toast } from './toasts.js';
import { sfx } from './audio.js';

let overlay, boardPanel, tomePanel, boardBody, tomeBody;
let open = null;
let onOpenChange = () => {};
let timer = null;
let statPickFor = null; // 'daily' | 'weekly'
let editingEpic = false;

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
        <h2>${kind === 'daily' ? 'Daily Quest' : 'Weekly Bounty'} <span class="sub">${sub}</span></h2>
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
        <h2>${kind === 'daily' ? 'Daily Quest' : 'Weekly Bounty'} <span class="sub">${sub}</span></h2>
        <div class="quest-text">“${esc(q.text)}”</div>
        <p class="muted">Which virtue did this deed train?</p>
        <div class="stat-pick">${picks}</div>
      </div>`;
  }
  if (!q.completed) {
    return `
      <div class="quest-block" data-kind="${kind}">
        <h2>${kind === 'daily' ? 'Daily Quest' : 'Weekly Bounty'} <span class="sub">${sub}</span></h2>
        <div class="quest-text">“${esc(q.text)}”</div>
        <div class="row right"><button class="primary" data-complete>Mark Complete</button></div>
      </div>`;
  }
  return `
    <div class="quest-block" data-kind="${kind}">
      <div class="stamp">Done</div>
      <h2>${kind === 'daily' ? 'Daily Quest' : 'Weekly Bounty'}</h2>
      <div class="quest-text">“${esc(q.text)}”</div>
      <p class="muted">${kind === 'daily' ? 'The day is won. The fire grows.' : 'A bounty well earned.'}</p>
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
        (kind === 'daily' ? postDaily : postWeekly)(input.value);
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
        const res = kind === 'daily' ? completeDaily(stat) : completeWeekly(stat);
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

  const t = s.treasury;
  const tPct = Math.min(100, (t.current / t.goal) * 100);

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
      <div class="kv"><span>Treasury (true savings)</span>
        <span class="v">${t.current.toLocaleString()} / ${t.goal.toLocaleString()}</span></div>
      <div class="xpbar treasury" style="margin:6px 0"><div style="width:${tPct}%"></div></div>
      <div class="row">
        <input type="number" data-t-current min="0" value="${t.current}" title="Current savings" />
        <input type="number" data-t-goal min="1" value="${t.goal}" title="Savings goal" />
        <button data-t-set>Set</button>
      </div>
      <p class="muted">The Treasury is thy true hoard — coins of the realm buy nothing here. Yet.</p>
    </div>
    <div class="sheet-section">
      <h2>The Chronicle</h2>
      <div class="kv"><span>Streak</span><span class="v">${s.streak.current} days (best ${s.streak.best})</span></div>
      <div class="kv"><span>Days walked this land</span><span class="v">${s.daysPlayed}</span></div>
      <div class="kv"><span>Deeds recorded</span><span class="v">${s.history.length}</span></div>
    </div>`;

  tomeBody.querySelector('[data-t-set]').addEventListener('click', () => {
    const cur = Number(tomeBody.querySelector('[data-t-current]').value);
    const goal = Number(tomeBody.querySelector('[data-t-goal]').value);
    if (Number.isFinite(cur) && Number.isFinite(goal)) {
      setTreasury(cur, goal);
      toast('The Treasury ledger is updated.', 'gold');
      renderTome();
    }
  });
  for (const inp of tomeBody.querySelectorAll('input')) {
    inp.addEventListener('keydown', (e) => e.stopPropagation());
  }
}

// ---------- open/close ----------

function close() {
  if (!open) return;
  open = null;
  statPickFor = null;
  editingEpic = false;
  overlay.classList.add('hidden');
  boardPanel.classList.add('hidden');
  tomePanel.classList.add('hidden');
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
  if (id === 'board') renderBoard();
  else renderTome();
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    const el = (id === 'board' ? boardBody : tomeBody).querySelector('[data-countdown]');
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
  boardBody = document.getElementById('quest-body');
  tomeBody = document.getElementById('tome-body');

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) close();
  });
  overlay.addEventListener('mousedown', (e) => {
    if (e.target === overlay) close();
  });
}
