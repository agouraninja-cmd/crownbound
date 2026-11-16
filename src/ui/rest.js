// Abed for the day: the card shown once his stamina is spent and he has walked
// himself home to his cot. He speaks a line to himself — meant for the player
// as much as for him — and the game says plainly that play resumes tomorrow.
// The real-life ledgers stay open from the bed (the Quest Board, the Tome, the
// Exchequer), and "Retire for the night" marks a real bedtime for the dawn
// judgment, since the cot itself can't be reached with E while he lies on it.
import { CONFIG } from '../state/config.js';
import { todayStr } from '../state/dates.js';

// what he says to himself, by whether today's deed is already on the board
const LINES_DONE = [
  'Today has been productive. I shall go to sleep.',
  'A good day, honestly spent. I shall sleep now, and rise the stronger for it.',
  'Every step today was a step toward the crown. Rest now — more tomorrow.',
  'I gave this day all I had. That is how kings are made. Now, sleep.',
];
const LINES_OWED = [
  'My legs are spent, but the day is not lost. Today’s deed goes on the board, and then I sleep.',
  'Tired to the bone. Still — one honest deed before I sleep, and the fire lives another day.',
];

// the same line all day: a reload shouldn't make him change his mind
function lineFor(list) {
  const seed = [...todayStr()].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
  return list[seed % list.length];
}

function clock(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

let card;
let actions = {};

export function initRest(handlers) {
  actions = handlers;
  card = document.getElementById('rest-card');
  card.addEventListener('click', (e) => {
    const act = e.target.closest('[data-rest]')?.dataset.rest;
    if (act && actions[act]) actions[act]();
  });
}

// draw (or redraw) the card: dailyDone picks his line; bedtimeIso is tonight's
// marked bedtime, if one has been marked since he lay down
export function showRest({ dailyDone, bedtimeIso }) {
  const line = lineFor(dailyDone ? LINES_DONE : LINES_OWED);
  card.innerHTML = `
    <p class="rest-thought">“${line}”</p>
    <h2>Rest till the morrow</h2>
    <p class="rest-note">Thy stamina is spent for today. Come back tomorrow — thy strength returns
    with the dawn, and thou mayst play again.</p>
    ${dailyDone ? '' : '<p class="rest-note">Today’s deed can still be posted at the board from thy bed — the fire need not die.</p>'}
    <div class="rest-actions">
      <button data-rest="board">The Quest Board</button>
      <button data-rest="tome">The Tome</button>
      <button data-rest="treasury">The Exchequer</button>
      <button data-rest="retire">Retire for the night</button>
    </div>
    <p class="rest-small">${
      bedtimeIso
        ? `Bedtime marked at ${clock(bedtimeIso)}. Rise by ${CONFIG.sleep.wakeByHour} o’clock for the Well-Rested boon.`
        : 'When thou goest to bed in earnest, retire for the night — it marks thy bedtime for the dawn.'
    }</p>`;
  card.classList.remove('hidden');
}

export function setRestVisible(v) {
  card?.classList.toggle('hidden', !v);
}
