// The Sage: the game's first Anthropic API thread — v2's talking villagers
// will reuse this plumbing. Given a completed quest's text, he names the
// virtue it trained — or the two, seldom more, when a deed truly trained
// several. His key lives OUTSIDE the save (a Scribe export can
// never leak it), and every failure path — no key, network trouble, timeout,
// refusal, an answer off the list — resolves to null so the manual picker
// takes over. The game never blocks on the network.
import Anthropic from '@anthropic-ai/sdk';
import { CONFIG } from '../state/config.js';

const KEY_STORAGE = 'crownbound_sage_key';
const VIRTUES = ['ath', 'int', 'wis', 'inf'];

const JUDGMENT = `A player in a medieval life-RPG completed a real-world deed and logged it as a quest. Name the virtue the deed trained, out of four:
ath — Athleticism: lifting, gym work, sport (tennis, running, climbing), physical labor, endurance, mobility
int — Intelligence: planning, strategy, discipline and good habits, sound judgment, personal finance
wis — Wisdom: learning, studying, coursework, reading, writing, coding
inf — Influence: business, clients, outreach, networking, leadership, family and social bonds
Most deeds train one virtue. Name a second (seldom a third) only when the deed plainly trained it too — a tennis match played with a client is ath and inf — the most-trained first.
Reply with only the keys, separated by spaces: for example "wis", or "ath inf".`;

export function sageEnabled() {
  return !!localStorage.getItem(KEY_STORAGE);
}

// the chronicler writes under the same key (see src/ai/chronicler.js)
export function sageKey() {
  return localStorage.getItem(KEY_STORAGE);
}

export function setSageKey(key) {
  if (key) localStorage.setItem(KEY_STORAGE, key);
  else localStorage.removeItem(KEY_STORAGE);
}

// { virtues: ['ath', …] | null, keyTrouble: boolean } — the virtues named,
// most-trained first, each once.
// virtues null = the picker takes over; keyTrouble true = the key itself was
// refused (invalid, or an API account without credits) so the player should
// be told to fix the key, not blame the weather.
export async function judgeDeed(text) {
  const key = localStorage.getItem(KEY_STORAGE);
  if (!key) return { virtues: null, keyTrouble: false };
  try {
    const client = new Anthropic({
      apiKey: key,
      dangerouslyAllowBrowser: true, // a local personal game; the key is the player's own
      timeout: CONFIG.sage.timeoutMs,
      maxRetries: 0, // one shot — the manual picker is the retry
    });
    const response = await client.messages.create({
      model: CONFIG.sage.model,
      max_tokens: CONFIG.sage.maxTokens,
      system: JUDGMENT,
      messages: [{ role: 'user', content: text }],
    });
    const block = response.content?.[0];
    const verdict = block?.type === 'text' ? block.text.trim().toLowerCase() : '';
    const named = [...new Set(verdict.split(/[\s,]+/).filter(Boolean))];
    // one word off the list and the whole answer is not trusted
    const sound = named.length > 0 && named.every((k) => VIRTUES.includes(k));
    return { virtues: sound ? named : null, keyTrouble: false };
  } catch (err) {
    console.warn('[sage] judgment failed:', err); // full detail for the console
    const keyTrouble =
      err instanceof Anthropic.AuthenticationError ||
      err instanceof Anthropic.PermissionDeniedError ||
      (err instanceof Anthropic.BadRequestError && /credit|billing/i.test(err.message));
    return { virtues: null, keyTrouble };
  }
}
