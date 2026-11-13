// The Chronicler: v2's first true arrival. Each completed week he reads the
// ledgers — the deed history and the sleep log — and writes one short entry
// of medieval prose into the chronicle. He serves under the sage's key (no
// key, no chronicler) and lives by the sage's law of failure: any trouble —
// no network, a timeout, an empty answer — writes nothing and is retried on
// a later load. He works quietly after boot; the game never waits on him.
import Anthropic from '@anthropic-ai/sdk';
import { CONFIG } from '../state/config.js';
import { STAT_NAMES, getState, addChronicleEntry } from '../state/state.js';
import { sageKey } from './sage.js';
import { todayStr, weekStartStr } from '../state/dates.js';

// a week with an empty ledger costs no API call — the blank page IS the entry
const SILENT_WEEK = 'The ledger holds no deeds for this week; the chronicler left the page blank.';

const CHRONICLE_CHARGE = `You are the chronicler of a small medieval village in a life-RPG. Each week you write one short journal entry about one villager, whose real-world deeds (training, study, labor, trade, thrift) are recorded in the ledger you are given. Write 60-110 words of period prose: third person, past tense, a single paragraph. Render modern deeds in medieval terms — a gym becomes the training yard, office or computer work a guild labor, savings coin laid in the hoard. Chronicle only what the ledger shows; if it is thin, be brief. No headings, no lists, no quotation marks around the entry, no modern words.`;

function shiftWeek(weekStart, days) {
  const [y, m, d] = weekStart.split('-').map(Number);
  return todayStr(new Date(y, m - 1, d + days));
}

// Completed weeks since the save began that have no entry yet, oldest first.
// Takes (state, now) so the smoke suite can pin the clock.
export function weeksOwed(state, now = new Date()) {
  const currentWeek = weekStartStr(now);
  const written = new Set(state.chronicle.map((e) => e.week));
  const owed = [];
  let w = weekStartStr(new Date(state.createdAt));
  for (let guard = 0; w < currentWeek && guard < 520; guard++) {
    if (!written.has(w)) owed.push(w);
    w = shiftWeek(w, 7);
  }
  return owed;
}

// Everything the chronicler may read about one week. Pure; exported for the
// smoke suite.
export function weekMaterial(state, weekStart) {
  const end = shiftWeek(weekStart, 6);
  const deeds = state.history.filter((h) => h.date >= weekStart && h.date <= end);
  const nights = state.sleep.log.filter((n) => {
    const d = (n.wake ?? n.bed).slice(0, 10);
    return d >= weekStart && d <= end;
  });
  return { weekStart, weekEnd: end, rank: state.rank, deeds, nights };
}

function ledgerText(m) {
  const lines = m.deeds.map((h) => {
    const virtue = h.statTrained ? ` (trained ${STAT_NAMES[h.statTrained]})` : '';
    const pct = h.type === 'epic' ? ` — the great work stands at ${h.progressPct}%` : '';
    return `- ${h.date} [${h.type}] ${h.questText}${virtue}${pct}`;
  });
  const dawns = m.nights.filter((n) => n.verdict === 'dawn').length;
  return [
    `Week of ${m.weekStart} to ${m.weekEnd}. The villager holds the rank of ${m.rank}.`,
    'Deeds in the ledger:',
    ...lines,
    m.nights.length
      ? `Nights recorded: ${m.nights.length}, of which ${dawns} rose with the dawn.`
      : 'No nights were recorded.',
  ].join('\n');
}

async function writeProse(material) {
  try {
    const client = new Anthropic({
      apiKey: sageKey(),
      dangerouslyAllowBrowser: true, // same terms as the sage: a local personal game
      timeout: CONFIG.chronicler.timeoutMs,
      maxRetries: 0, // a later load is the retry
    });
    const response = await client.messages.create({
      model: CONFIG.chronicler.model,
      max_tokens: CONFIG.chronicler.maxTokens,
      system: CHRONICLE_CHARGE,
      messages: [{ role: 'user', content: ledgerText(material) }],
    });
    const block = response.content?.[0];
    const text = block?.type === 'text' ? block.text.trim() : '';
    return text || null;
  } catch (err) {
    console.warn('[chronicler] the pen faltered:', err); // full detail for the console
    return null;
  }
}

// Catch the chronicle up. Silent weeks are marked for free; the oldest week
// with deeds gets ONE written entry per load, then the pen rests — so a long
// absence catches up a week per session, never in a burst of calls. Stops at
// the first failure so entries always land in week order.
export async function keepChronicle(now = new Date()) {
  if (!sageKey()) return { entries: 0, prose: false };
  const state = getState();
  let entries = 0;
  for (const week of weeksOwed(state, now)) {
    const material = weekMaterial(state, week);
    if (material.deeds.length === 0) {
      addChronicleEntry(week, SILENT_WEEK);
      entries += 1;
      continue;
    }
    const text = await writeProse(material);
    if (!text) break;
    addChronicleEntry(week, text);
    return { entries: entries + 1, prose: true };
  }
  return { entries, prose: false };
}
