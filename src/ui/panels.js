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
  setSummit,
  setPledge,
  fileReckoning,
  reckoningDue,
  buyItem,
  xpToNext,
  totalLevels,
  STAT_NAMES,
  exportSave,
  isSaveText,
  importSave,
} from '../state/state.js';
import { CONFIG } from '../state/config.js';
import { mouseFeelId, setMouseFeel } from '../state/prefs.js';
import { todayStr } from '../state/dates.js';
import { renderGuide } from './guide.js';
import { judgeDeed, sageEnabled, setSageKey } from '../ai/sage.js';
import { toast } from './toasts.js';
import { sfx } from './audio.js';

let overlay, boardPanel, tomePanel, ledgerPanel, treasuryPanel, shopPanel, guidePanel, boardBody, tomeBody, ledgerBody, treasuryBody, shopBody, guideBody;
let open = null;
let onOpenChange = () => {};
let shopActions = { isWounded: () => false, onPurchase: () => {} }; // wired by main.js
let statPickFor = null; // 'daily' | 'weekly' | 'monthly'
let judgingFor = null; // quest kind awaiting the sage's verdict
let judgeSeq = 0; // bumped to orphan any in-flight verdict (cancel, close, dismiss)
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
  if (!q.completed && judgingFor === kind) {
    return `
      <div class="quest-block" data-kind="${kind}">
        <h2>${QUEST_TITLES[kind]} <span class="sub">${sub}</span></h2>
        <div class="quest-text">“${esc(q.text)}”</div>
        <p class="muted">The sage reads thy deed…</p>
        <div class="row right"><button data-sage-cancel>Choose thyself</button></div>
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
      <p class="countdown" style="margin-top:10px">${crownText()}</p>
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
      if (!sageEnabled()) {
        statPickFor = kind;
        renderBoard();
        return;
      }
      // the sage's verdict is final; the picker is every failure's fallback
      judgingFor = kind;
      const seq = ++judgeSeq;
      renderBoard();
      judgeDeed(getState().quests[kind].text).then(({ virtue, keyTrouble }) => {
        if (seq !== judgeSeq || judgingFor !== kind) return; // cancelled, closed, or superseded
        judgingFor = null;
        if (virtue) {
          const res = COMPLETE_FNS[kind](virtue);
          if (res) {
            toast(`The sage judges this deed ${STAT_NAMES[virtue]}.`, '');
            rewardToast(STAT_NAMES[virtue], res);
          }
        } else {
          toast(
            keyTrouble
              ? 'The sage rejects thy key — see him in the Tome.'
              : 'The sage is silent. Choose thyself.',
            'grim'
          );
          statPickFor = kind;
        }
        renderBoard();
      });
    });
    block.querySelector('[data-sage-cancel]')?.addEventListener('click', () => {
      judgeSeq += 1; // orphan the in-flight verdict
      judgingFor = null;
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
      <p class="muted">How sharply the camera answers thy mouse. Kept to this browser, outside thy save.</p>
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

// ---------- The Treasury (the Exchequer's monthly reckoning) ----------

const ROLL_TAGS = {
  fat: ['the hoard grew fat', 'tag-gold'],
  held: ['held the line', ''],
  bled: ['the purse bled', 'tag-grim'],
  unreckoned: ['unreckoned', ''],
};

function rollMonth(key) {
  const [y, m] = key.split('-').map(Number);
  return `${MONTHS[m - 1]} ’${String(y).slice(2)}`;
}

function renderTreasury() {
  const t = getState().treasury;
  const due = reckoningDue();

  // the summit: a named cumulative goal — or, after a conquest, the raising of the next
  const summit =
    t.goal > 0
      ? `<div class="sheet-section">
          <h2>${t.name ? esc(t.name) : 'The Hoard'}</h2>
          <div class="kv"><span>True savings</span>
            <span class="v">${t.current.toLocaleString()} / ${t.goal.toLocaleString()}</span></div>
          <div class="xpbar treasury" style="margin:6px 0"><div style="width:${Math.min(100, (t.current / t.goal) * 100)}%"></div></div>
        </div>`
      : `<div class="sheet-section">
          <h2>The Next Summit</h2>
          <p class="muted">The hoard stands at ${t.current.toLocaleString()} and no summit is raised.
          Name the next hoard and its height.</p>
          <div class="row">
            <input type="text" class="grow" data-s-name maxlength="60" placeholder="Name the hoard..." />
            <input type="number" data-s-goal min="1" placeholder="Goal" style="width:110px" />
            <button class="primary" data-s-set>Raise it</button>
          </div>
        </div>`;

  // the reckoning: the month just ended awaits its statement
  const reckoning = due
    ? `<div class="sheet-section">
        <h2>The Reckoning — ${rollMonth(due)}</h2>
        <p class="muted">The clerk awaits the month&#8217;s statement.${
          t.pledge > 0
            ? ` The pledge stands at ${t.pledge.toLocaleString()} laid in.`
            : ' No pledge stands — set one under Revisions and the months will be judged by it.'
        }</p>
        <div class="row">
          <input type="number" data-r-earned min="0" placeholder="Coin earned" title="All income this month" />
          <input type="number" data-r-spent min="0" placeholder="Coin spent" title="All spending this month" />
        </div>
        <div class="row">
          <input type="number" data-r-saved min="0" placeholder="Laid in the hoard" title="Moved into savings this month" />
          <input type="number" data-r-counted min="0" placeholder="Hoard, counted true" title="What the accounts truly say the total now is" />
          <button class="primary" data-r-file>File</button>
        </div>
      </div>`
    : `<div class="sheet-section">
        <p class="muted">The month&#8217;s reckoning is filed. The clerk hears the next when the month turns.</p>
      </div>`;

  // the rolls: last six months, newest first, sleep-ledger style
  const rollRows = [...t.rolls]
    .slice(-6)
    .reverse()
    .map((r) => {
      const [tagText, tagClass] = ROLL_TAGS[r.verdict] ?? ['—', ''];
      const line =
        r.verdict === 'unreckoned'
          ? 'no statement was heard'
          : `earned ${r.earned.toLocaleString()} · spent ${r.spent.toLocaleString()} · kept ${(r.earned - r.spent).toLocaleString()} · laid in ${r.saved.toLocaleString()}`;
      return `<div class="deed">
        <span class="deed-date">${rollMonth(r.month)}</span>
        <span class="deed-text">${line}</span>
        <span class="deed-tag ${tagClass}">${tagText}</span>
      </div>`;
    })
    .join('');
  const rolls = t.rolls.length
    ? `<div class="sheet-section"><h2>The Rolls</h2><div class="deed-list">${rollRows}</div></div>`
    : '';

  // summits already taken
  const conquered = t.conquered.length
    ? `<div class="sheet-section"><h2>Summits Conquered</h2><div class="deed-list">${[...t.conquered]
        .reverse()
        .map(
          (c) => `<div class="deed">
            <span class="deed-date">${deedDate(c.conqueredAt.slice(0, 10))}</span>
            <span class="deed-text">“${esc(c.name)}”</span>
            <span class="deed-tag tag-gold">${c.goal.toLocaleString()}</span>
          </div>`
        )
        .join('')}</div></div>`
    : '';

  treasuryBody.innerHTML = `
    ${summit}
    ${reckoning}
    ${rolls}
    ${conquered}
    <div class="sheet-section">
      <h2>Revisions</h2>
      <div class="row"><span class="muted grow">The hoard, corrected</span>
        <input type="number" data-t-current min="0" value="${t.current}" style="width:130px" /></div>
      ${
        t.goal > 0
          ? `<div class="row"><span class="muted grow">The summit</span>
              <input type="number" data-t-goal min="1" value="${t.goal}" style="width:130px" /></div>`
          : ''
      }
      <div class="row"><span class="muted grow">The monthly pledge</span>
        <input type="number" data-t-pledge min="0" value="${t.pledge}" style="width:130px" /></div>
      <div class="row right"><button data-t-set>Set</button></div>
      <p class="muted">The Exchequer keeps thy true hoard — coins of the realm buy nothing here.
      Corrections move no summit; only a filed reckoning conquers one.</p>
    </div>`;

  treasuryBody.querySelector('[data-r-file]')?.addEventListener('click', () => {
    const num = (sel) => Number(treasuryBody.querySelector(sel).value);
    const entry = {
      earned: num('[data-r-earned]'),
      spent: num('[data-r-spent]'),
      saved: num('[data-r-saved]'),
      counted: num('[data-r-counted]'),
    };
    if (!Object.values(entry).every((v) => Number.isFinite(v) && v >= 0)) {
      toast('The clerk squints — those figures are no figures.', 'grim');
      return;
    }
    const res = fileReckoning(entry);
    if (!res) return;
    sfx.page();
    const kept = res.roll.earned - res.roll.spent;
    const [verdictText] = ROLL_TAGS[res.roll.verdict];
    toast(
      res.roll.earned > 0
        ? `The roll is entered — ${verdictText}. Of every hundred earned, ${Math.max(0, Math.round((kept / res.roll.earned) * 100))} were kept.`
        : `The roll is entered — ${verdictText}.`,
      res.roll.verdict === 'fat' ? 'gold' : res.roll.verdict === 'bled' ? 'grim' : ''
    );
    if (res.conquered) {
      sfx.levelUp();
      toast(`${esc(res.conquered.name)} — conquered! The hoard stands at ${getState().treasury.current.toLocaleString()}.`, 'gold');
    }
    renderTreasury();
  });

  treasuryBody.querySelector('[data-s-set]')?.addEventListener('click', () => {
    const name = treasuryBody.querySelector('[data-s-name]').value;
    const goal = Number(treasuryBody.querySelector('[data-s-goal]').value);
    if (!Number.isFinite(goal) || goal < 1) return;
    setSummit(name, goal);
    toast('A new summit is raised. The climb resumes.', 'gold');
    renderTreasury();
  });

  treasuryBody.querySelector('[data-t-set]').addEventListener('click', () => {
    const cur = Number(treasuryBody.querySelector('[data-t-current]').value);
    const goalEl = treasuryBody.querySelector('[data-t-goal]');
    const goal = goalEl ? Number(goalEl.value) : NaN;
    const pledge = Number(treasuryBody.querySelector('[data-t-pledge]').value);
    if (Number.isFinite(pledge)) setPledge(pledge);
    if (Number.isFinite(cur)) {
      setTreasury(cur, goalEl && Number.isFinite(goal) && goal >= 1 ? goal : t.goal);
    }
    toast('The Treasury ledger is updated.', 'gold');
    renderTreasury();
  });

  for (const inp of treasuryBody.querySelectorAll('input')) {
    inp.addEventListener('keydown', (e) => e.stopPropagation());
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
        const hale = item.id === 'loaf' && !shopActions.isWounded();
        let action;
        if (owned) action = `<span class="deed-tag tag-gold">owned</span>`;
        else if (locked) action = `<span class="deed-tag tag-grim">for a ${item.minRank}</span>`;
        else
          action = `<button data-buy="${item.id}" ${s.coins < item.price || hale ? 'disabled' : ''}
            title="${hale ? 'Thou art hale — bread keeps.' : ''}">${item.price}c</button>`;
        return `<div class="deed">
          <span class="deed-text"><b>${item.name}</b> — <span class="muted">${item.flavor}</span></span>
          ${action}
        </div>`;
      })
      .join('');
    return `<div class="sheet-section"><h2>${title}</h2>${rows}</div>`;
  }).join('');

  shopBody.innerHTML = `
    <div class="sheet-section">
      <div class="kv"><span>Thy purse</span><span class="v">${s.coins} coins</span></div>
      <p class="muted">The chapman deals in comfort and swagger. Virtue is not for sale, at any price.</p>
    </div>
    ${sections}`;

  for (const btn of shopBody.querySelectorAll('[data-buy]')) {
    btn.addEventListener('click', () => {
      const res = buyItem(btn.dataset.buy);
      if (res.ok) {
        toast(`${res.item.name} — bought and paid for.`, 'gold');
        sfx.questDone();
        shopActions.onPurchase(res.item);
      } else if (res.why === 'coins') {
        toast('Thy purse is too light for that.', 'grim');
      }
      renderShop();
    });
  }
}

// ---------- open/close ----------

function close() {
  if (!open) return;
  open = null;
  statPickFor = null;
  judgeSeq += 1; // a verdict landing after close is discarded, not applied unseen
  judgingFor = null;
  editingEpic = false;
  pendingImport = null;
  overlay.classList.add('hidden');
  boardPanel.classList.add('hidden');
  tomePanel.classList.add('hidden');
  ledgerPanel.classList.add('hidden');
  treasuryPanel.classList.add('hidden');
  shopPanel.classList.add('hidden');
  guidePanel.classList.add('hidden');
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
  shopPanel.classList.toggle('hidden', id !== 'shop');
  guidePanel.classList.toggle('hidden', id !== 'guide');
  if (id === 'board') renderBoard();
  else if (id === 'ledger') renderLedger();
  else if (id === 'treasury') renderTreasury();
  else if (id === 'shop') renderShop();
  else if (id === 'guide') renderGuide(guideBody);
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
  boardBody = document.getElementById('quest-body');
  tomeBody = document.getElementById('tome-body');
  ledgerBody = document.getElementById('ledger-body');
  treasuryBody = document.getElementById('treasury-body');
  shopBody = document.getElementById('shop-body');
  guideBody = document.getElementById('guide-body');

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) close();
  });
  overlay.addEventListener('mousedown', (e) => {
    if (e.target === overlay) close();
  });
}
