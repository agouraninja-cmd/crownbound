// The miller's introduction: the card shown the first time the player ever
// comes near him (main.js `stepMeeting`; once a save). He says who he is and
// the two ways he pays — a bounty on the granary's rats, a wage for work on
// his strip — and that his coin is only coin. His likeness is drawn in ink
// and wash like the wares and the Map: an SVG string, no image file, in the
// colours his figure wears in the yard (structures.js `buildMiller`). Like
// the Village Charter, every number is read from config.js as it is shown.
import { CONFIG } from '../state/config.js';

const INK = '#2b2014';
const DUSTED = '#bfb5a2'; // wool gone grey-white with flour
const APRON = '#d8cfae';
const SKIN = '#cfa46f';
const CAP = '#6b5a44';
const BEARD = '#8f8676';

const line = (w = 1.3) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

// head and shoulders, arms folded over the apron — as he stands at his post
function portrait() {
  return `<svg class="miller-svg" viewBox="0 0 96 96" role="img" aria-label="The miller">
    <ellipse cx="48" cy="52" rx="42" ry="40" fill="#e9dcb4" opacity="0.55"/>
    <path d="M7 96 Q8 72 27 65 L40 60 L56 60 L69 65 Q88 72 89 96 Z" fill="${DUSTED}" ${line()}/>
    <path d="M36 96 L38 68 L58 68 L60 96 Z" fill="${APRON}" ${line(1.1)}/>
    <path d="M38 68 L42 60 M58 68 L54 60" fill="none" ${line(1.1)}/>
    <path d="M42 56 L42 63 Q48 67 54 63 L54 56 Z" fill="#b88d5c" ${line(1)}/>
    <path d="M14 84 Q30 76 48 80 Q66 76 82 84 Q84 90 78 93 Q62 86 48 90 Q34 86 18 93 Q12 90 14 84 Z" fill="${DUSTED}" ${line()}/>
    <path d="M48 80 L48 90 M30 79.5 Q33 84 30 88.5 M66 79.5 Q63 84 66 88.5" fill="none" stroke="${INK}" stroke-width="0.9" stroke-linecap="round" opacity="0.6"/>
    <path d="M74 82.5 Q80 81 83 85 Q83 89 79 90 Q75 88 74 82.5 Z" fill="${SKIN}" ${line(1)}/>
    <ellipse cx="48" cy="41" rx="15" ry="17" fill="${SKIN}" ${line()}/>
    <path d="M32.8 42 Q32 62 48 65 Q64 62 63.2 42 Q60 50 54 50.5 Q48 48 42 50.5 Q36 50 32.8 42 Z" fill="${BEARD}" ${line(1.1)}/>
    <path d="M40 50 Q48 45.5 56 50 Q52 52.5 48 51 Q44 52.5 40 50 Z" fill="#a39a88" ${line(0.9)}/>
    <path d="M44.5 54.5 Q48 56.5 51.5 54.5" fill="none" ${line(0.9)}/>
    <path d="M48 38 Q45.4 45 47.2 46.6 Q49.4 47.6 51 45.6" fill="none" ${line(1)}/>
    <ellipse cx="42" cy="38.5" rx="1.5" ry="1.7" fill="${INK}"/>
    <ellipse cx="54.4" cy="38.5" rx="1.5" ry="1.7" fill="${INK}"/>
    <path d="M38.2 35 Q42 33 45.4 35.2 M51 35.2 Q54.6 33 58.2 35" fill="none" stroke="${BEARD}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M36.6 42.5 q1.6 1.4 3.4 1.2 M56.2 43.7 q1.9 0.1 3.4 -1.2" fill="none" stroke="${INK}" stroke-width="0.7" stroke-linecap="round" opacity="0.5"/>
    <path d="M30.5 32 Q27 22 38 20.5 Q50 17.5 61 21 Q69 23 65.5 32 Q48 27.5 30.5 32 Z" fill="${CAP}" ${line()}/>
    <path d="M30.5 32 Q48 27.5 65.5 32 L66 34.4 Q48 30.4 30 34.4 Z" fill="#574837" ${line(1)}/>
    <path d="M37 24.5 Q47 21.6 58 24" fill="none" stroke="#8a765c" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M70 72 l5 2.6 M71.5 76 l5 2.6 M18 79 l4 -2.4" fill="none" stroke="${INK}" stroke-width="0.8" stroke-linecap="round" opacity="0.4"/>
    <g fill="#fbf6e6" opacity="0.9">
      <circle cx="20" cy="76" r="1.5"/><circle cx="26" cy="71.5" r="1"/><circle cx="70" cy="70.5" r="1.4"/>
      <circle cx="77" cy="76" r="1"/><circle cx="41" cy="25.5" r="1.1"/><circle cx="56" cy="26.5" r="0.9"/>
      <circle cx="45" cy="74" r="1.2"/><circle cx="53" cy="77" r="0.9"/><circle cx="37" cy="59" r="0.9"/>
      <circle cx="59" cy="57.5" r="1"/><circle cx="24" cy="87" r="1"/><circle cx="64" cy="86" r="1.1"/>
    </g>
  </svg>`;
}

// body: the miller panel's body; done(): closes the panel
export function renderMiller(body, done) {
  const R = CONFIG.rewards;
  const F = CONFIG.farm;
  body.innerHTML = `
    <div class="miller-meet">
      <figure class="miller-face">
        ${portrait()}
        <figcaption>The miller of ${CONFIG.realm.village}</figcaption>
      </figure>
      <div class="miller-says">
        <p>&#8220;Hold there, friend &#8212; I know that face. Thou art the one from the hovel by the fire.
        I am the miller. Every ear of wheat in ${CONFIG.realm.village} comes to my granary in the end.&#8221;</p>
        <h3>The rats</h3>
        <p>&#8220;And where the grain goes, the rats follow. I pay <b>${R.ratCoins} coins a tail</b> for every one
        laid low. They are back by morning, so the offer never grows old.&#8221;</p>
        <h3>The strip</h3>
        <p>&#8220;I have a strip of wheat besides, out along the cart track to the north-east, and too few hands
        for it. One job a day, each in its turn &#8212; till, sow, weed, reap. <b>${F.wage} coins</b> for the
        day&#8217;s work, <b>${F.harvestPay}</b> when the harvest is in.&#8221;</p>
        <p>&#8220;Honest coin, mind, and nothing more. My wage will fill thy purse &#8212; it will not make thee
        a better man. That is thine own work.&#8221;</p>
      </div>
    </div>
    <p class="miller-after">Press <b>E</b> beside him on any day to hear the day&#8217;s tally of tails.
    The Map (<b>M</b>) shows the way to his strip.</p>
    <div class="miller-actions"><button class="primary" data-miller-done>Well met, miller</button></div>`;
  body.querySelector('[data-miller-done]').addEventListener('click', done);
}
