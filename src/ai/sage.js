// The Sage: the game's first Anthropic API thread — v2's talking villagers
// will reuse this plumbing. Given a completed quest's text, he names the
// virtue it trained. His key lives OUTSIDE the save (a Scribe export can
// never leak it), and every failure path — no key, network trouble, timeout,
// refusal, an answer off the list — resolves to null so the manual picker
// takes over. The game never blocks on the network.
import Anthropic from '@anthropic-ai/sdk';
import { CONFIG } from '../state/config.js';

const KEY_STORAGE = 'crownbound_sage_key';
const VIRTUES = ['str', 'agi', 'wis', 'inf'];

const JUDGMENT = `A player in a medieval life-RPG completed a real-world deed and logged it as a quest. Classify the deed into exactly one of four virtues:
str — Strength: lifting, gym work, physical labor, endurance
agi — Agility: sport played for speed and coordination (tennis, running, climbing), mobility
wis — Wisdom: learning, reading, studying, writing, planning, personal finance
inf — Influence: business, clients, outreach, networking, leadership, family and social bonds
Reply with exactly one word: str, agi, wis, or inf.`;

export function sageEnabled() {
  return !!localStorage.getItem(KEY_STORAGE);
}

export function setSageKey(key) {
  if (key) localStorage.setItem(KEY_STORAGE, key);
  else localStorage.removeItem(KEY_STORAGE);
}

// { virtue: 'str'|'agi'|'wis'|'inf'|null, keyTrouble: boolean }.
// virtue null = the picker takes over; keyTrouble true = the key itself was
// refused (invalid, or an API account without credits) so the player should
// be told to fix the key, not blame the weather.
export async function judgeDeed(text) {
  const key = localStorage.getItem(KEY_STORAGE);
  if (!key) return { virtue: null, keyTrouble: false };
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
    return { virtue: VIRTUES.includes(verdict) ? verdict : null, keyTrouble: false };
  } catch (err) {
    console.warn('[sage] judgment failed:', err); // full detail for the console
    const keyTrouble =
      err instanceof Anthropic.AuthenticationError ||
      err instanceof Anthropic.PermissionDeniedError ||
      (err instanceof Anthropic.BadRequestError && /credit|billing/i.test(err.message));
    return { virtue: null, keyTrouble };
  }
}
