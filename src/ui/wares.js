// The chapwoman's wares, pictured and explained. Two things live here, both
// shown in the shop and again in the Chest (its weapons and its larder):
//
// - Pictures, drawn in ink and wash like the Map — one small SVG per item in
//   CONFIG.shop.items, plus the trusty stick. No image files: each picture is
//   a string of SVG built here. The washes are the colours the same things
//   wear in the 3D world (structures.js, playerMesh.js, player.js
//   setWeaponTier), so what the panel shows is what turns up in the hand or
//   the hovel. Every picture is drawn on a 64×64 sheet, with no ids or
//   gradients inside — the shop shows nine at once and SVG ids are shared
//   across the whole page.
// - The "read more" for each ware: what it is, how to use it, and what it
//   does for the player. Like the Village Charter, every number in it is read
//   from config.js when it is shown, so re-tuning can never leave it stale;
//   only the prose is fixed.

import { CONFIG } from '../state/config.js';

const INK = '#2b2014';
const WOOD_DARK = '#4f3a25'; // kit.js WOOD_DARK

// the ink line every outline is drawn with
const line = (w = 1.4) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
// a soft ink shadow for things that stand on the ground
const shadow = (cx, cy, rx, ry = 3) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${INK}" opacity="0.16"/>`;
// short parallel strokes of shading, like the hatching on the Map's hills
function hatch(x, y, n, dx, dy, len, angle = 0, opacity = 0.45) {
  const a = (angle * Math.PI) / 180;
  const ex = Math.cos(a) * len;
  const ey = Math.sin(a) * len;
  let d = '';
  for (let i = 0; i < n; i++) {
    const sx = x + dx * i;
    const sy = y + dy * i;
    d += `M${sx.toFixed(1)} ${sy.toFixed(1)}l${ex.toFixed(1)} ${ey.toFixed(1)}`;
  }
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="0.8" stroke-linecap="round" opacity="${opacity}"/>`;
}

const PICTURES = {
  // the trusty stick (not sold — it is the hand's first weapon, kept on the rack
  // when another is taken up): a crooked branch, a twig stub, a rag round the grip
  stick: () => `
    ${shadow(32, 57, 21)}
    <g transform="rotate(40 32 32)">
      <path d="M30.2 60 L33.8 60 L34.6 44 Q33.6 36 35 28 Q36.4 18 34.4 6 L30.6 6 Q31.6 18 30.4 27 Q29 36 29.6 44 Z"
        fill="#7a5a35" ${line()}/>
      <path d="M34.3 21 Q38 17.5 40.5 12.5" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>
      <path d="M34.3 21 Q38 17.5 40.5 12.5" stroke="#7a5a35" stroke-width="2" stroke-linecap="round"/>
      <path d="M31.4 10 Q32.4 20 31.2 28 Q30.4 36 31 42" fill="none" stroke="#a07c50" stroke-width="1.2" stroke-linecap="round"/>
      <ellipse cx="32.6" cy="33" rx="1.4" ry="1" fill="#4f3a25" ${line(0.7)}/>
      <path d="M33.4 14 l0 5 M30.8 47 l0 6" stroke="${INK}" stroke-width="0.6" opacity="0.45"/>
      <ellipse cx="32.5" cy="6" rx="2" ry="0.9" fill="#a07c50" ${line(0.9)}/>
      <path d="M29.4 49 L34.6 50.2 L34.4 56.2 L29.6 55 Z" fill="#5a4a3a" ${line(1)}/>
      <path d="M29.5 52 L34.5 53.2" stroke="#8a7660" stroke-width="0.8"/>
      <path d="M34.4 50.5 q2.6 0.8 3.6 3.4" fill="none" stroke="#5a4a3a" stroke-width="1.4" stroke-linecap="round"/>
    </g>`,

  // an oaken cudgel: dark oak, a knotted head, a leather-bound grip
  cudgel: () => `
    ${shadow(32, 57, 21)}
    <g transform="rotate(38 32 32)">
      <path d="M29.6 60 L34.4 60 L35.6 42 Q39.5 31 40.5 20 Q41.5 8 32 6.5 Q22.5 8 23.5 20 Q24.5 31 28.4 42 Z"
        fill="#5a4028" ${line()}/>
      <path d="M30.6 44 Q28 30 27.5 18 Q27.6 11 31 9" fill="none" stroke="#86643f" stroke-width="1.6" stroke-linecap="round"/>
      <ellipse cx="36.5" cy="20" rx="2.2" ry="1.5" fill="#3d2b1a" ${line(0.9)}/>
      <ellipse cx="29" cy="27" rx="1.8" ry="1.3" fill="#3d2b1a" ${line(0.9)}/>
      <ellipse cx="34" cy="12.5" rx="1.5" ry="1.1" fill="#3d2b1a" ${line(0.8)}/>
      <path d="M33 22 q1 6 0.4 12 M30.5 32 q0.6 4 0.3 8" fill="none" stroke="${INK}" stroke-width="0.7" opacity="0.5"/>
      <rect x="29.2" y="47" width="5.6" height="10" rx="1" fill="#3a2a1c" ${line(1.1)}/>
      <path d="M29.2 49.5 L34.8 50.5 M29.2 52.5 L34.8 53.5 M29.2 55.5 L34.8 56.5" stroke="#a07a4c" stroke-width="0.8"/>
      <ellipse cx="32" cy="60" rx="3.4" ry="1.8" fill="#5a4028" ${line(1.1)}/>
    </g>`,

  // a quarterstaff: six feet of pale ash, iron-shod at both ends, a leather grip
  quarterstaff: () => `
    ${shadow(32, 58, 24)}
    <g transform="rotate(42 32 32)">
      <rect x="29.4" y="1" width="5.2" height="62" rx="2.6" fill="#9a7a48" ${line()}/>
      <path d="M31 5 L31 59" stroke="#c4a571" stroke-width="1.3" stroke-linecap="round"/>
      <path d="M33.3 11 l0 9 M33.3 40 l0 12" stroke="${INK}" stroke-width="0.6" opacity="0.45"/>
      <rect x="29" y="1" width="6" height="5" rx="1.5" fill="#8b9097" ${line(1.1)}/>
      <rect x="29" y="58" width="6" height="5" rx="1.5" fill="#8b9097" ${line(1.1)}/>
      <rect x="29.1" y="26" width="5.8" height="12" rx="0.8" fill="#4a3220" ${line(1.1)}/>
      <path d="M29.1 29 L34.9 30 M29.1 32 L34.9 33 M29.1 35 L34.9 36" stroke="#a07a4c" stroke-width="0.8"/>
    </g>`,

  // a wool rug, dyed madder red, laid on the floor: dark bands, a gold lozenge, fringed ends
  rug: () => `
    ${shadow(32, 49, 26, 2.5)}
    <path d="M14 19 L50 19 L57 47 L7 47 Z" fill="#8a3a2a" ${line()}/>
    <path d="M14 19 L50 19 L51.2 24 L12.8 24 Z" fill="#6e2c20" ${line(1)}/>
    <path d="M8.2 42 L55.8 42 L57 47 L7 47 Z" fill="#6e2c20" ${line(1)}/>
    <path d="M32 26.5 L44 33 L32 39.5 L20 33 Z" fill="#c9a25a" ${line(1.1)}/>
    <path d="M32 30 L37.5 33 L32 36 L26.5 33 Z" fill="#8a3a2a" ${line(0.8)}/>
    <path d="M16 26.5 L48 26.5 M14.4 39.5 L49.6 39.5" stroke="#c9a25a" stroke-width="0.9" opacity="0.8"/>
    <path d="M13.6 21 l-3 0 M12.9 24 l-3 0.2 M12.2 27 l-3 0.3 M11.5 30 l-3.2 0.3 M10.7 33 l-3.2 0.4 M10 36 l-3.3 0.4 M9.2 39 l-3.4 0.5 M8.5 42 l-3.4 0.5 M7.7 45 l-3.5 0.5"
      stroke="#b88a6a" stroke-width="1" stroke-linecap="round"/>
    <path d="M50.4 21 l3 0 M51.1 24 l3 0.2 M51.8 27 l3 0.3 M52.5 30 l3.2 0.3 M53.3 33 l3.2 0.4 M54 36 l3.3 0.4 M54.8 39 l3.4 0.5 M55.5 42 l3.4 0.5 M56.3 45 l3.5 0.5"
      stroke="#b88a6a" stroke-width="1" stroke-linecap="round"/>
    ${hatch(40, 43, 5, 3, 0, 3, 0, 0.3)}`,

  // door paint: a planked door half-painted oxblood, the pot and brush before it
  door: () => `
    ${shadow(34, 57, 26)}
    <path d="M6 56 L6 20 Q6 7 18.5 7 Q31 7 31 20 L31 56 Z" fill="#8a6a42" ${line()}/>
    <path d="M6 56 L6 31 Q14 29 18 33 Q23 37 31 33 L31 56 Z" fill="#7a2a20"/>
    <path d="M6 31 Q14 29 18 33 Q23 37 31 33" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.6"/>
    <path d="M12.3 8.5 L12.3 56 M18.5 7 L18.5 56 M24.7 8.5 L24.7 56" stroke="${INK}" stroke-width="0.8" opacity="0.55"/>
    <path d="M6 16 L31 16 M6 46 L31 46" stroke="#3a3a3f" stroke-width="2.2"/>
    <circle cx="27" cy="38" r="1.6" fill="none" stroke="#3a3a3f" stroke-width="1.2"/>
    <path d="M6 56 L6 20 Q6 7 18.5 7 Q31 7 31 20 L31 56 Z" fill="none" ${line()}/>
    <path d="M42 34 L56 13" stroke="${INK}" stroke-width="4.6" stroke-linecap="round"/>
    <path d="M42 34 L56 13" stroke="#8a6a42" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M44.2 30.7 L46.2 27.7" stroke="#d8c28e" stroke-width="2.6"/>
    <path d="M27 38 Q25.5 50 31 55.5 L50 55.5 Q55.5 50 54 38 Z" fill="#a8693c" ${line()}/>
    <path d="M27.5 46 Q40.5 49 53.5 46" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.55"/>
    ${hatch(47, 41, 4, 1.3, 3.2, 3.6, 100, 0.4)}
    <ellipse cx="40.5" cy="38" rx="13.5" ry="3.8" fill="#7a2a20" ${line()}/>
    <path d="M28.5 39.6 Q28.2 43.5 29.1 46.5 Q30.2 47.4 30.7 45.6 Q30.8 43 31.8 40.8" fill="#7a2a20" ${line(0.8)}/>
    <ellipse cx="36" cy="37.3" rx="3.6" ry="1" fill="#b0503e" opacity="0.7"/>`,

  // a glass pane: real glass in an oak frame, a cross mullion, the light catching it
  window: () => `
    ${shadow(32, 57, 19, 2.5)}
    <rect x="14" y="9" width="36" height="44" rx="1.5" fill="${WOOD_DARK}" ${line()}/>
    <rect x="18.5" y="13.5" width="27" height="35" fill="#aec6cf" ${line(1)}/>
    <path d="M20 47 L44 47 L44 34 Z" fill="#8fb0bc" opacity="0.6"/>
    <path d="M22 26 L28 17 M22 31 L31 18" stroke="#f4f8f6" stroke-width="1.6" stroke-linecap="round" opacity="0.85"/>
    <path d="M36 44 L42 36" stroke="#f4f8f6" stroke-width="1.3" stroke-linecap="round" opacity="0.75"/>
    <rect x="30.4" y="13.5" width="3.2" height="35" fill="#5f4730" ${line(0.9)}/>
    <rect x="18.5" y="29.4" width="27" height="3.2" fill="#5f4730" ${line(0.9)}/>
    <path d="M12 53 L52 53 L50 57 L14 57 Z" fill="#6a5034" ${line(1.1)}/>
    ${hatch(15.5, 12, 6, 0, 7, 1.6, 0, 0.35)}`,

  // a garden plot: dug earth in rows, cabbages, seedlings, a string line on its pegs
  garden: () => `
    ${shadow(32, 53, 27, 2.5)}
    <path d="M14 26 L50 26 L58 51 L6 51 Z" fill="#4a3624" ${line()}/>
    <path d="M12.3 32 L51.7 32 M10.4 38 L53.6 38 M8.4 44.5 L55.6 44.5" stroke="#2f2216" stroke-width="2.2"/>
    <path d="M12.3 31 L51.7 31 M10.4 37 L53.6 37 M8.4 43.5 L55.6 43.5" stroke="#6b5038" stroke-width="0.9"/>
    <path d="M10 15 L10 33 M54 15 L54 33" stroke="#7a5a35" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M10 15 L10 33 M54 15 L54 33" fill="none" ${line(0.6)} opacity="0.6"/>
    <path d="M10 17 Q32 21 54 17" fill="none" stroke="#e6dcc0" stroke-width="0.9"/>
    ${[[18, 42.5, 5.2], [32, 42.5, 5.4], [46, 42.5, 5.2], [24, 35.8, 4.4], [40, 35.8, 4.4]]
      .map(
        ([x, y, r]) => `
      <circle cx="${x}" cy="${y}" r="${r}" fill="#6f7a3e" ${line(1)}/>
      <circle cx="${x + 0.4}" cy="${y - 0.8}" r="${r * 0.5}" fill="#8a9a52" ${line(0.7)}/>
      <path d="M${x - r * 0.75} ${y - r * 0.2} q${r * 0.4} ${r * 0.5} ${r * 0.75} ${r * 0.6} M${x + r * 0.75} ${y - r * 0.1} q${-r * 0.35} ${r * 0.5} ${-r * 0.7} ${r * 0.65}"
        fill="none" stroke="${INK}" stroke-width="0.6" opacity="0.55"/>`
      )
      .join('')}
    ${[[17, 29.4], [32, 29.4], [47, 29.4]]
      .map(
        ([x, y]) => `<path d="M${x} ${y + 0.6} L${x} ${y - 3.5} M${x} ${y - 1.6} q-2.2 -0.6 -2.6 -2.8 M${x} ${y - 2.2} q2.2 -0.6 2.6 -2.8"
        fill="none" stroke="#557f3d" stroke-width="1.3" stroke-linecap="round"/>`
      )
      .join('')}`,

  // a hearty loaf: a round of brown crust, scored and dusted with flour
  loaf: () => `
    ${shadow(32, 50, 24, 3.2)}
    <path d="M9 43 Q8 22 32 21 Q56 22 55 43 Q55 49 32 49.5 Q9 49 9 43 Z" fill="#a9763e" ${line()}/>
    <path d="M12.5 42 Q32 47 51.5 42" fill="none" stroke="${INK}" stroke-width="0.8" opacity="0.4"/>
    <path d="M15 33 Q18 25 30 23.5" fill="none" stroke="#d6a868" stroke-width="2.4" stroke-linecap="round" opacity="0.8"/>
    ${[[19, 36, 27, 27], [28, 37, 36, 26.5], [37, 37.5, 45, 28]]
      .map(
        ([x1, y1, x2, y2]) => `
      <path d="M${x1} ${y1} Q${(x1 + x2) / 2 + 1.5} ${(y1 + y2) / 2 + 1.5} ${x2} ${y2}" fill="none" stroke="#e8c58e" stroke-width="3" stroke-linecap="round"/>
      <path d="M${x1} ${y1} Q${(x1 + x2) / 2 + 1.5} ${(y1 + y2) / 2 + 1.5} ${x2} ${y2}" fill="none" stroke="${INK}" stroke-width="0.8" stroke-linecap="round" opacity="0.7"/>`
      )
      .join('')}
    ${hatch(45, 39, 4, 1.8, -1.4, 4, 115, 0.4)}
    ${[[22, 29], [33, 27.5], [41, 30], [26, 39.5], [47, 35], [16.5, 38]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.8" fill="#f6ead0" opacity="0.9"/>`)
      .join('')}`,

  // a mounted rat: stuffed and staring from a wooden shield, hung on a nail
  trophy: () => `
    <path d="M32 3.5 L21 12.5 M32 3.5 L43 12.5" stroke="${INK}" stroke-width="0.9" opacity="0.8"/>
    <circle cx="32" cy="3.5" r="1.6" fill="#8b9097" ${line(0.8)}/>
    <path d="M13 12 L51 12 L51 33 Q51 50 32 58 Q13 50 13 33 Z" fill="#6b4e30" ${line()}/>
    <path d="M16.5 15.5 L47.5 15.5 L47.5 33 Q47.5 47 32 54 Q16.5 47 16.5 33 Z" fill="none" stroke="#3d2b1a" stroke-width="1" opacity="0.8"/>
    ${hatch(40, 41, 5, 1.6, 1.8, 5, 125, 0.35)}
    <path d="M42 35 Q50 38 47 45 Q44.5 50 39 47" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M42 35 Q50 38 47 45 Q44.5 50 39 47" fill="none" stroke="#b08a8a" stroke-width="1.5" stroke-linecap="round"/>
    <ellipse cx="34" cy="31" rx="10.5" ry="7" fill="#6e665e" ${line()}/>
    <path d="M27 25.5 Q20 27.5 14.5 31.5 Q20 36 27 36.5 Z" fill="#7a726a" ${line()}/>
    <circle cx="15" cy="31.6" r="1.2" fill="#b08a8a" ${line(0.6)}/>
    <circle cx="25.5" cy="25" r="3.4" fill="#b08a8a" ${line(1)}/>
    <circle cx="20.5" cy="30" r="1.5" fill="${INK}"/>
    <circle cx="20.1" cy="29.5" r="0.5" fill="#f4ecd8"/>
    <path d="M16 33 l-4 1.5 M16.3 32.4 l-4.4 -0.4 M16.5 33.6 l-3.4 2.8" stroke="${INK}" stroke-width="0.5" opacity="0.8"/>
    <path d="M37 26 q3 1 6 4 M33 27 q2.5 1 4.5 3.5" fill="none" stroke="${INK}" stroke-width="0.6" opacity="0.45"/>
    <path d="M27 37 l-1 3 M38 37.5 l1 2.8" stroke="${INK}" stroke-width="1.3" stroke-linecap="round"/>`,

  // a candle lantern: an iron frame, horn panes glowing amber, a candle burning within
  lantern: () => `
    <circle cx="32" cy="37" r="24" fill="#ffc866" opacity="0.13"/>
    <circle cx="32" cy="37" r="16" fill="#ffc866" opacity="0.16"/>
    ${shadow(32, 57, 15, 2.5)}
    <circle cx="32" cy="7.5" r="3.2" fill="none" ${line(1.5)}/>
    <path d="M19.5 22 L32 11 L44.5 22 Z" fill="#3a3a3f" ${line()}/>
    <circle cx="28" cy="18" r="0.8" fill="#ffd27a"/><circle cx="32" cy="16" r="0.8" fill="#ffd27a"/><circle cx="36" cy="18" r="0.8" fill="#ffd27a"/>
    <rect x="21.5" y="22" width="21" height="26" fill="#e9c67c" opacity="0.92" ${line(1)}/>
    <ellipse cx="32" cy="34" rx="7" ry="9" fill="#fff0c4" opacity="0.55"/>
    <rect x="29.3" y="37" width="5.4" height="10" fill="#efe6cc" ${line(0.9)}/>
    <path d="M32 26.5 Q35.2 31.5 32 36 Q28.8 31.5 32 26.5 Z" fill="#ffb347" ${line(0.7)}/>
    <path d="M32 30.5 Q33.3 33 32 35 Q30.7 33 32 30.5 Z" fill="#fff3c0"/>
    <path d="M21.5 22 L21.5 48 M42.5 22 L42.5 48 M32 22 L32 26 M32 47 L32 48" stroke="#3a3a3f" stroke-width="2.4"/>
    <path d="M21.5 22 L21.5 48 M42.5 22 L42.5 48" fill="none" ${line(0.6)}/>
    <path d="M21.5 35 L42.5 35" stroke="#3a3a3f" stroke-width="1.2" opacity="0.6"/>
    <rect x="19.5" y="48" width="25" height="5" rx="1" fill="#3a3a3f" ${line()}/>`,
};

// The picture of one ware as an SVG string ('' for an id with no picture yet,
// so a new item in config.js still sells, picture or no).
export function warePicture(id, label = '') {
  const draw = PICTURES[id];
  if (!draw) return '';
  const name = label.replace(/"/g, '&quot;');
  return `<svg class="ware-svg" viewBox="0 0 64 64" role="img" aria-label="${name}">${draw()}</svg>`;
}

// ---------- read more: what each ware is, how it is used, what it gives ----------

// the comforts' law, said once: home goods and trinkets are for looking at
const COMFORT_ONLY =
  'Comfort, not virtue: like everything at the cart it earns no XP, no streak and no stamina. ' +
  'What it gives is a home that looks lived in, and the purchase is written among thy deeds in the Tome.';

// a weapon's numbers, as the swing actually uses them (main.js applyPurchases)
function weaponFacts(w) {
  const P = CONFIG.player;
  const damage = w.damage ?? P.attackDamage;
  const reach = P.attackRange + (w.reach ?? 0);
  const blows = Math.ceil(CONFIG.rats.hp / damage);
  return { damage, reach: Math.round(reach * 100) / 100, blows };
}

function ratLine(blows) {
  return blows === 1
    ? `A granary rat (${CONFIG.rats.hp} HP) falls in a single blow`
    : `A granary rat (${CONFIG.rats.hp} HP) falls in ${blows} blows`;
}

// how to carry a weapon again once another is in hand
const RACK_SWAP =
  'When thou carriest another weapon it hangs on the rack by thy door: go into thy hovel, stand ' +
  'at the rack, press E, and choose &#8220;Take up&#8221;.';

// how a weapon reaches the hand — said at the cart, needless at home (rack or chest)
const BOUGHT = (inChest) => (inChest ? '' : 'Once bought it goes straight to thy hand. ');

const SWING =
  'Swing with the left mouse button or the F key (or a plain click where the mouse cannot be captured). ' +
  'Swings in quick succession chain chop, backhand and sweep.';

const LORE = {
  stick: {
    about:
      'A crooked length of hazel with a rag wound round the grip. Every villager starts with one.',
    use: () => `It is thy first weapon and is never lost. ${SWING} ${RACK_SWAP}`,
    boon: () => {
      const f = weaponFacts(CONFIG.chest.stick);
      return `${f.damage} damage a blow, at a reach of ${f.reach}. ${ratLine(f.blows)}. It costs nothing and asks nothing.`;
    },
  },

  cudgel: {
    about:
      'A club of seasoned oak, knotted at the head and bound in leather at the grip. ' +
      'Heavier than a stick, and it lands like it.',
    use: (item, inChest) => `${BOUGHT(inChest)}${SWING} ${RACK_SWAP}`,
    boon: (item) => {
      const f = weaponFacts(item);
      const stick = weaponFacts(CONFIG.chest.stick);
      return (
        `${f.damage} damage a blow (the stick does ${stick.damage}). ${ratLine(f.blows)} instead of ` +
        `${stick.blows}, so fewer bites are taken and the bounty (+${CONFIG.rewards.ratCoins} coins a ` +
        `tail) comes quicker. A swing still costs ${CONFIG.stamina.attackCost} stamina, and the dummy ` +
        'counts Athleticism by blows, not by weight, so its XP is the same with any weapon.'
      );
    },
  },

  quarterstaff: {
    about:
      'Six feet of pale ash, shod with iron at both ends and wrapped for the hands at the middle. ' +
      'A weapon for one who has trained for it.',
    use: (item, inChest) => {
      const rank = CONFIG.ranks.find((r) => r.title === item.minRank);
      const gate =
        rank && !inChest
          ? `The chapwoman sells it only to a ${rank.title} or better: ${rank.totalLevels} virtue levels in all, won by real deeds at the Quest Board. `
          : '';
      return `${gate}${BOUGHT(inChest)}${SWING} ${RACK_SWAP}`;
    },
    boon: (item) => {
      const f = weaponFacts(item);
      const stick = weaponFacts(CONFIG.chest.stick);
      return (
        `${f.damage} damage a blow and a longer reach (${f.reach}, the stick's is ${stick.reach}), ` +
        `so thou canst strike from a little farther off. ${ratLine(f.blows)}. A swing still costs ` +
        `${CONFIG.stamina.attackCost} stamina.`
      );
    },
  },

  rug: {
    about: 'Wool dyed madder red, bordered dark at both ends, with a gold lozenge at its heart.',
    use: () =>
      'Nothing to do but buy it: it is laid at once on the floor of thy hovel, between the cot and the hearth. Step inside to see it.',
    boon: () => COMFORT_ONLY,
  },

  door: {
    about: 'A pot of oxblood paint and a good brush, for a door that has only ever been bare boards.',
    use: () => 'Bought, it goes on at once: thy hovel&#8217;s door turns oxblood red.',
    boon: () => COMFORT_ONLY,
  },

  window: {
    about:
      'A real pane of glass in an oak frame with a cross mullion, hauled from the city unbroken. ' +
      'Glass is a luxury few peasants ever own.',
    use: () => 'Bought, it is glazed at once into the little window beside thy hovel&#8217;s door.',
    boon: () => COMFORT_ONLY,
  },

  garden: {
    about: 'Seed, string and a spade&#8217;s worth of work: a little kitchen plot of cabbages and seedlings.',
    use: () =>
      'Bought, it is dug at once along the side wall of thy hovel. It is there to look on: it is not ' +
      'worked like the miller&#8217;s strip and yields no crop. (For a wage, the miller&#8217;s strip pays.)',
    boon: () => COMFORT_ONLY,
  },

  loaf: {
    about: 'A round of brown bread from the chapwoman&#8217;s basket, scored and dusted with flour. Bread keeps.',
    use: () =>
      `Each loaf goes to the larder of the chest by thy cot, which holds ${CONFIG.chest.larderCap}; ` +
      'the chapwoman will not sell bread to a full larder. When thou art hurt, go into thy hovel, ' +
      'stand at the chest, press E to open it, and choose &#8220;Eat a loaf&#8221;.',
    boon: () =>
      `A loaf mends every wound at once, back to the full ${CONFIG.player.maxHp} HP. It mends health ` +
      'and nothing more (no XP, no stamina) and cannot be eaten while thou art hale. Unlike the rest ' +
      'of the cart, loaves may be bought again and again.',
  },

  trophy: {
    about: 'A granary rat, stuffed and mounted on a wooden shield. It stares.',
    use: () => 'Bought, it hangs at once on the wall of thy hovel, above the pot shelf.',
    boon: () => COMFORT_ONLY,
  },

  lantern: {
    about: 'A candle burning in an iron lantern with horn panes, hung from a bracket.',
    use: () => 'Bought, it hangs at once beside thy hovel&#8217;s door, lit and glowing warm.',
    boon: () => COMFORT_ONLY,
  },
};

// does this ware have a "read more"? (a new item in config.js simply has none yet)
export const hasWareLore = (id) => id in LORE;

// The "read more" for one ware (a shop item, or the chest's stick): a larger
// picture, what it is, how to use it, what it does for the player. In the
// chest the ware is already owned, so what only matters at the cart is left out.
export function wareLore(item, inChest = false) {
  const lore = LORE[item.id];
  if (!lore) return '';
  return `
    <div class="ware-more">
      <span class="ware-big">${warePicture(item.id, item.name)}</span>
      <div class="ware-more-text">
        <p class="ware-about">${lore.about}</p>
        <h3>How to use it</h3>
        <p>${lore.use(item, inChest)}</p>
        <h3>What it does for thee</h3>
        <p>${lore.boon(item)}</p>
      </div>
    </div>`;
}
