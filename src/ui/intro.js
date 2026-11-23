// The opening: what a newcomer is shown the first time the game is loaded.
//
//   the title    black; the game's name and what it is; "Press Enter to begin"
//                (that key press is also what lets the browser play the bells)
//   the dream    bells, a crown in gold light, "Thou art King." — then it is
//                snatched away: "Not yet."
//   the waking   the dark lifts on him abed in his hovel; two lines of ink
//                over the scene; he gets up off the cot
//   the oath     a parchment asks two things — the year's great work and
//                today's deed. They are the Quest Board's Epic and Daily,
//                written here so the board is not found empty.
//
// Then the keys are his, and the cold fire's pointer takes over (main.js).
// Enter, Space or a click hurries a beat along; Esc skips the whole opening.
//
// This file owns the screen and the order of things. What happens in the
// world — lying him down, getting him up, handing over the keys — is done by
// the handle main.js gives initIntro.
import { CONFIG } from '../state/config.js';
import { getState, setEpicText, postDaily } from '../state/state.js';
import { todayStr } from '../state/dates.js';
import { sfx, wakeAudio } from './audio.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// The crown of the dream, drawn in code like every other picture in the game.
const CROWN = `
  <svg viewBox="0 0 240 170" aria-hidden="true">
    <path d="M34 124 L24 54 L50 94 L73 38 L96 88 L120 22 L144 88 L167 38 L190 94 L216 54 L206 124 Z"
      fill="#e0b437" stroke="#5c4208" stroke-width="4" stroke-linejoin="round" />
    <path d="M44 118 L37 78 L52 102 L73 54 L94 98 L120 42 L146 98 L167 54 L188 102 L203 78 L196 118 Z"
      fill="#f6dc7a" opacity="0.6" />
    <rect x="28" y="120" width="184" height="28" rx="6" fill="#cfa22a" stroke="#5c4208" stroke-width="4" />
    <path d="M36 127 H204" stroke="#f6dc7a" stroke-width="3" stroke-linecap="round" opacity="0.7" />
    <g fill="#f3e2a0" stroke="#5c4208" stroke-width="3">
      <circle cx="24" cy="50" r="7" /><circle cx="73" cy="34" r="8" /><circle cx="120" cy="17" r="9" />
      <circle cx="167" cy="34" r="8" /><circle cx="216" cy="50" r="7" />
    </g>
    <g stroke="#5c4208" stroke-width="2.5">
      <ellipse cx="120" cy="134" rx="10" ry="8" fill="#8a2418" />
      <ellipse cx="72" cy="134" rx="7" ry="6" fill="#2f5d50" /><ellipse cx="168" cy="134" rx="7" ry="6" fill="#2f5d50" />
      <circle cx="44" cy="134" r="4" fill="#f3e2a0" /><circle cx="196" cy="134" r="4" fill="#f3e2a0" />
    </g>
  </svg>`;

let root, stage, game;
let beat = null; // 'title' | 'dream' | 'waking' | 'oath' — null once the opening is over
let hush = () => {}; // stills the dream's bells
const timers = [];

function later(ms, fn) {
  timers.push(setTimeout(fn, ms));
}

function clearTimers() {
  for (const t of timers.splice(0)) clearTimeout(t);
}

function go(next) {
  clearTimers();
  beat = next;
  root.dataset.beat = next;
  BEATS[next]();
}

// the first line he wakes to, by the hour the sky is keeping (its sun is up
// from six to six)
function wakingLine() {
  const h = game.hour();
  const when = h >= 6 && h < 12 ? 'morning' : h >= 12 && h < 18 ? 'day' : 'night';
  return `Another ${when} in ${CONFIG.realm.village}.`;
}

const BEATS = {
  title() {
    stage.innerHTML = `
      <div class="intro-title">
        <h1>Crownbound</h1>
        <p class="intro-premise">Do real deeds in thy own life — and rise here, from peasant to King.</p>
        <p class="intro-begin">Press <b>Enter</b> to begin</p>
      </div>`;
  },

  dream() {
    hush = sfx.bells();
    stage.innerHTML = `
      <div class="intro-dream">
        <div class="dream-light"></div>
        <div class="dream-crown">${CROWN}</div>
        <p class="dream-line">Thou art King.</p>
        <p class="dream-not">Not yet.</p>
      </div>`;
    const dream = stage.firstElementChild;
    later(5600, () => {
      dream.classList.add('gone'); // snatched away, bells and all
      hush();
    });
    later(6400, () => dream.classList.add('not'));
    later(8600, () => go('waking'));
  },

  waking() {
    hush();
    stage.innerHTML = `
      <div class="intro-caption">
        <p>${esc(wakingLine())}</p>
        <p>Nothing changes unless thou dost.</p>
      </div>`;
    const [first, second] = stage.querySelectorAll('p');
    later(1500, () => first.classList.add('on'));
    later(3700, () => second.classList.add('on'));
    later(7200, () => {
      first.classList.remove('on');
      second.classList.remove('on');
    });
    later(7400, () =>
      game.rise(() => {
        if (beat === 'waking') go('oath');
      })
    );
  },

  oath() {
    hush();
    sfx.page();
    oathStep = 'epic';
    drawOath();
  },
};

// ---------- the oath ----------

let oathStep = 'epic'; // 'epic' the year's great work, then 'daily' today's deed

function drawOath() {
  const s = getState();
  const r = CONFIG.rewards.daily;
  const crown = CONFIG.ranks.find((k) => k.title === 'King').totalLevels;
  const daily = s.quests.daily;
  const posted = daily.text && daily.date === todayStr(); // the opening played again on a day already begun

  const asked =
    oathStep === 'epic'
      ? `<h2>What great work wilt thou do this year?</h2>
         <p class="muted">Thy Epic Quest — the one thing this year is for. It can be rewritten at the Quest Board.</p>
         <div class="row">
           <input type="text" class="grow" data-oath-input maxlength="160" value="${esc(s.quests.epic.text)}"
             placeholder="The one great deed of this year..." />
           <button class="primary" data-oath-swear>Swear it</button>
         </div>`
      : posted
        ? `<h2>And what wilt thou do this day?</h2>
           <div class="quest-text">“${esc(daily.text)}”</div>
           <p class="muted">${daily.completed ? 'Today’s deed is done already.' : 'Today’s deed is posted already. Do it, then mark it done at the Quest Board.'}</p>
           <div class="row right"><button class="primary" data-oath-later>Onward</button></div>`
        : `<h2>And what wilt thou do this day?</h2>
           <p class="muted">Thy Daily Quest — one real deed, small enough to finish today. Do it out in the world,
             then mark it done at the Quest Board: +${r.xp} XP, +${r.coins} coins, and thy fire is lit.</p>
           <div class="row">
             <input type="text" class="grow" data-oath-input maxlength="120"
               placeholder="Lift, learn, build, reach out..." />
             <button class="primary" data-oath-swear>Post it</button>
           </div>`;

  stage.innerHTML = `
    <div class="panel intro-oath" data-oath="${oathStep}">
      <h1>The Oath</h1>
      <p class="oath-lead">This is no idle game. Every real deed thou dost in thy own life makes this peasant
        stronger — and ${crown} levels of virtue make him King.</p>
      <div class="quest-block">
        ${asked}
        ${oathStep === 'daily' && posted ? '' : '<div class="row right"><button class="tr-quiet" data-oath-later>Later</button></div>'}
      </div>
      <div class="panel-hint">${oathStep === 'epic' ? 'The first of two' : 'The second of two'} · Enter to swear · Esc to leave the oath for later</div>
    </div>`;

  const input = stage.querySelector('[data-oath-input]');
  const swear = () => {
    const text = input.value.trim();
    if (!text) {
      input.focus(); // nothing written: the question stands
      return;
    }
    if (oathStep === 'epic') {
      if (text !== s.quests.epic.text) setEpicText(text);
    } else {
      postDaily(text);
    }
    sfx.page();
    nextOath();
  };
  stage.querySelector('[data-oath-swear]')?.addEventListener('click', swear);
  stage.querySelector('[data-oath-later]').addEventListener('click', nextOath);
  if (input) {
    input.addEventListener('keydown', (e) => {
      e.stopPropagation(); // typing must reach nothing else in the game
      if (e.key === 'Enter') swear();
      else if (e.key === 'Escape') finish();
    });
    input.addEventListener('keyup', (e) => e.stopPropagation());
    // the quill is put in his hand — a moment late, so the key that brought
    // the parchment up is not written into it
    later(350, () => input.focus());
  }
}

function nextOath() {
  if (oathStep === 'epic') {
    oathStep = 'daily';
    drawOath();
  } else {
    finish();
  }
}

// ---------- hurrying, skipping, ending ----------

// Enter, Space or a click: on with it. The oath is hurried by nothing — its
// own buttons move it along.
function advance() {
  if (beat === 'title') {
    wakeAudio(); // this key press is the gesture a browser wants before it plays a sound
    go('dream');
  } else if (beat === 'dream') {
    go('waking');
  } else if (beat === 'waking') {
    game.stand(); // on his feet at once
    go('oath');
  }
}

// The opening is over — played through, or skipped from wherever it stood.
function finish() {
  if (!beat) return;
  clearTimers();
  hush();
  if (beat !== 'oath') game.stand();
  beat = null;
  delete root.dataset.beat;
  stage.innerHTML = '';
  root.classList.add('hidden');
  document.body.classList.remove('opening');
  game.end();
}

function onKey(e) {
  if (!beat || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    finish();
  } else if (e.key === 'Enter' || e.code === 'Space') {
    if (beat === 'oath') return; // its buttons take Enter and Space themselves
    e.preventDefault();
    advance();
  }
}

// `handle` is main.js's hold on the world:
//   hour()       the hour the sky is keeping (0–23)
//   lieDown()    put him abed in his hovel, the eye on the cot
//   rise(onUp)   he gets up off the cot; onUp once he stands
//   stand()      on his feet by the cot at once (a beat hurried or skipped)
//   end()        the opening is over: the keys are his
export function initIntro(handle) {
  game = handle;
  root = document.getElementById('intro');
  stage = root.querySelector('.intro-stage');
  window.addEventListener('keydown', onKey);
  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-intro-skip]')) finish();
    else if (beat !== 'oath') advance();
  });
}

export function playIntro() {
  game.lieDown();
  document.body.classList.add('opening');
  root.classList.remove('hidden');
  go('title');
}

// still playing? (main.js keeps the keys, the panels and the mouse from him meanwhile)
export function introPlaying() {
  return beat !== null;
}

// which beat it stands on, and a hurry along — for the smoke suite
export const introBeat = () => beat;
export { advance as hurryIntro };

// ---------- a line of ink over the scene ----------

// One line said over the world itself, in the opening's own hand: it fades in,
// stays `seconds`, fades out. Nothing is blocked while it shows.
let captionTimer = null;
export function caption(text, seconds = 6) {
  const el = document.getElementById('caption');
  clearTimeout(captionTimer);
  el.textContent = text;
  el.classList.remove('hidden', 'on');
  void el.offsetWidth; // so the fade-in runs from the start again
  el.classList.add('on');
  captionTimer = setTimeout(() => {
    el.classList.remove('on');
    captionTimer = setTimeout(() => el.classList.add('hidden'), 900);
  }, seconds * 1000);
}
