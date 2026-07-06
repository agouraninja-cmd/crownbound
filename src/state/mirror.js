// The Scribe's Mirror: a dev-only shadow of the save on disk. Every state
// change is pushed (debounced) to the dev server's /__save endpoint, which
// keeps saves/crownbound-save.json current; a browser that boots with NO
// save (cleared data, new port, new browser) adopts the file and reloads so
// the standard load/migrate/rollover path vets it — the same pattern as the
// Scribe's restore. Inert in production builds and headless smoke runs
// (import.meta.env.DEV is false there). localStorage stays the live save;
// the file is backup and recovery, never a second source of truth mid-play.
import { CONFIG } from './config.js';
import { onChange, exportSave } from './state.js';

const ENDPOINT = '/__save';

// Captured at import time — before main.js calls loadState(), which writes a
// fresh default save into localStorage and would hide that we started empty.
const hadSave = !!localStorage.getItem(CONFIG.saveKey);

function startPushing() {
  // Changes come in bursts (one quest completion touches xp, coins, streak,
  // stamina); let the dust settle, then write once.
  let timer = null;
  onChange(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fetch(ENDPOINT, { method: 'POST', body: exportSave() }).catch(() => {});
    }, 1000);
  });
  // Closing the tab must not lose the last second of play: sendBeacon
  // survives page teardown where fetch does not.
  addEventListener('pagehide', () => {
    clearTimeout(timer);
    navigator.sendBeacon(ENDPOINT, exportSave());
  });
  // Push once now so the file exists from the very first session.
  fetch(ENDPOINT, { method: 'POST', body: exportSave() }).catch(() => {});
}

export async function initMirror() {
  if (!import.meta.env.DEV) return;
  if (!hadSave) {
    // Fresh browser. If the mirror file exists, adopt it instead of the
    // blank save loadState() just minted — then reload so it's loaded
    // through the normal vet path. Pushing must NOT start on this pass, or
    // the blank save could overwrite the file before the fetch resolves.
    try {
      const res = await fetch(ENDPOINT);
      if (res.ok) {
        const text = await res.text();
        const s = JSON.parse(text);
        if (s && typeof s.saveVersion === 'number' && s.stats && s.quests) {
          localStorage.setItem(CONFIG.saveKey, JSON.stringify(s));
          location.reload();
          return;
        }
      }
    } catch {
      // no dev server endpoint (or no file) — a genuinely new game
    }
  }
  startPushing();
}
