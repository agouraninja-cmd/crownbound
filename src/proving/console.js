// The Proving Ground's command line — in the test world only (?test=1).
//
//   /            opens it (so does `). Enter runs the line; Esc, or Enter on
//                an empty line, closes it. ↑ and ↓ walk back through what was
//                typed, Tab finishes a command's name.
//   help         lists every command (they live in commands.js)
//   a; b; c      runs several, in order
//
// And the player's own commands, made here and kept in this browser:
//   make fresh = stamina full; heal; coins 1000     then `fresh` runs all three
//   make boost = level $1 20                        `boost wis` → level wis 20
//   forget fresh
//
// Also drawn here: the banner that says, always, that this is the test world.
import { COMMANDS, Refusal, clockText } from './commands.js';
import { clockMoved, takeNote, worldUrl } from './proving.js';
import { toast } from '../ui/toasts.js';

const OWN_KEY = 'crownbound_test_commands'; // { name: 'command; command' } — outside the save, so a wiped world keeps them
const RECALL_KEY = 'crownbound_test_recall'; // lines typed this sitting (kept through the reloads some commands make)
const MAX_LOG = 80;
const MAX_DEPTH = 6; // how deep an own command may call other own commands

let game; // main.js's handle on the running game
let box, logEl, input, clockEl;
let isOpen = false;
let recall = [];
let recallAt = 0;

const builtIn = (word) => COMMANDS.find((c) => c.name === word || c.also?.includes(word));
const RESERVED = ['help', 'make', 'forget']; // commands about the commands, answered in this file

// a line to show: a reply, or (bad) a refusal
const ok = (text) => ({ text, bad: false });
const bad = (text) => ({ text, bad: true });

// ---------- the player's own commands ----------

function ownCommands() {
  try {
    const own = JSON.parse(localStorage.getItem(OWN_KEY));
    if (own && typeof own === 'object') return own;
  } catch {}
  return {};
}

// "make fresh = stamina full; heal"
function make(line) {
  const m = /^make\s+(\S+)\s*=\s*(.+)$/i.exec(line);
  if (!m) return bad('Like this: make fresh = stamina full; heal; coins 1000');
  const name = m[1].toLowerCase();
  const body = m[2].trim();
  if (!/^[a-z][a-z0-9_-]*$/.test(name)) return bad('A command’s name is letters and digits, starting with a letter.');
  if (builtIn(name) || RESERVED.includes(name)) return bad(`“${name}” is already a command. Pick another name.`);
  const own = ownCommands();
  const had = Object.hasOwn(own, name);
  own[name] = body;
  localStorage.setItem(OWN_KEY, JSON.stringify(own));
  return ok(`${had ? 'Changed' : 'Made'} “${name}”. Type ${name} to run: ${body}`);
}

function forget(name) {
  const own = ownCommands();
  if (!Object.hasOwn(own, name)) return bad(name ? `Thou hast made no command called “${name}”.` : 'Forget which? forget <name>');
  delete own[name];
  localStorage.setItem(OWN_KEY, JSON.stringify(own));
  return ok(`“${name}” is forgotten.`);
}

// the words typed after an own command fill its $1, $2 …
function fillIn(body, args) {
  return body.replace(/\$(\d)/g, (_, n) => args[Number(n) - 1] ?? '');
}

// ---------- running a line ----------

function help() {
  const lines = [];
  let group = null;
  for (const c of COMMANDS) {
    if (c.group !== group) {
      group = c.group;
      lines.push({ text: group, head: true });
    }
    lines.push({ text: c.usage, note: c.about });
  }
  lines.push({ text: 'Thy own commands', head: true });
  const own = Object.entries(ownCommands());
  for (const [name, body] of own) lines.push({ text: name, note: body });
  if (!own.length) lines.push({ text: '', note: 'None yet.' });
  lines.push({ text: 'make <name> = <command>; <command>', note: 'Make one. $1, $2 stand for the words typed after it.' });
  lines.push({ text: 'forget <name>', note: 'Unmake it.' });
  return lines;
}

function runOne(words, depth) {
  const name = words[0].toLowerCase();
  const args = words.slice(1);
  if (name === 'help') return help();
  if (name === 'forget') return [forget((args[0] ?? '').toLowerCase())];

  const command = builtIn(name);
  if (command) {
    try {
      return [ok(command.run(args, game) ?? 'Done.')];
    } catch (err) {
      if (err instanceof Refusal) return [bad(err.message)];
      console.error(err); // a real fault in a command: shown, and in the browser console in full
      return [bad(`“${name}” broke: ${err.message}`)];
    }
  }

  const own = ownCommands();
  if (Object.hasOwn(own, name)) {
    if (depth >= MAX_DEPTH) return [bad(`“${name}” goes round in circles.`)];
    return runLine(fillIn(own[name], args), depth + 1);
  }
  return [bad(`No such command: “${name}”. Type help to see them all.`)];
}

// One typed line → the lines to show. Commands separated by `;` run in
// order, stopping at the first that is refused.
function runLine(line, depth = 0) {
  const text = line.trim().replace(/^\//, '');
  if (/^make\b/i.test(text)) return [make(text)]; // takes the whole rest of the line, `;` and all
  const shown = [];
  for (const part of text.split(';')) {
    const words = part.trim().split(/\s+/).filter(Boolean);
    if (!words.length) continue;
    shown.push(...runOne(words, depth));
    if (shown.at(-1).bad) break;
  }
  return shown;
}

// ---------- the command line itself ----------

// A line is { text } plus one of: bad (a refusal), echo (what was typed),
// head (a heading), or note (dimmer words after the text — help's "what it does").
function show(lines) {
  let first = null;
  for (const line of lines) {
    const div = document.createElement('div');
    div.className = line.head ? 'pc-head' : line.echo ? 'pc-echo' : line.bad ? 'pc-bad' : 'pc-ok';
    div.textContent = line.text;
    if (line.note) {
      const note = document.createElement('span');
      note.className = 'pc-note';
      note.textContent = `${line.text ? '  ' : ''}${line.note}`;
      div.appendChild(note);
    }
    logEl.appendChild(div);
    first ??= div;
  }
  while (logEl.children.length > MAX_LOG) logEl.removeChild(logEl.firstChild);
  logEl.scrollTop = logEl.scrollHeight;
  return first;
}

function enter() {
  const line = input.value.trim();
  if (!line) {
    close();
    return;
  }
  if (recall.at(-1) !== line) recall.push(line);
  recall = recall.slice(-40);
  recallAt = recall.length;
  sessionStorage.setItem(RECALL_KEY, JSON.stringify(recall));
  input.value = '';
  const echo = show([{ text: `/ ${line}`, echo: true }]);
  const shown = runLine(line);
  show(shown);
  // a long answer (help) is read from its top, not its tail
  if (shown.length > 6) logEl.scrollTop = echo.offsetTop - logEl.offsetTop;
  drawClock();
}

// Tab finishes the first word, if only one command begins that way
function finishName() {
  if (/\s/.test(input.value) || !input.value) return;
  const start = input.value.toLowerCase().replace(/^\//, '');
  const names = [...COMMANDS.map((c) => c.name), ...RESERVED, ...Object.keys(ownCommands())];
  const fits = names.filter((n) => n.startsWith(start));
  if (fits.length === 1) input.value = `${fits[0]} `;
  else if (fits.length > 1) show([ok(fits.join('   '))]);
}

function onKey(e) {
  e.stopPropagation(); // the game hears nothing typed here: W is a letter, not a step
  if (e.key === 'Enter') enter();
  else if (e.key === 'Escape') close();
  else if (e.key === 'Tab') {
    e.preventDefault();
    finishName();
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
    recallAt = Math.max(0, Math.min(recall.length, recallAt + (e.key === 'ArrowUp' ? -1 : 1)));
    input.value = recall[recallAt] ?? '';
  }
}

function open() {
  if (isOpen) return;
  isOpen = true;
  game.typing(true); // the keys let go of him while the line is typed
  box.classList.remove('hidden');
  recallAt = recall.length;
  input.value = '';
  input.focus();
  logEl.scrollTop = logEl.scrollHeight;
}

function close() {
  if (!isOpen) return;
  isOpen = false;
  box.classList.add('hidden');
  input.blur();
  game.typing(false);
}

// the banner tells the test world's hour once the clock has been moved
function drawClock() {
  const { days, ms } = clockMoved();
  const moved = days !== 0 || Math.abs(ms) > 60000;
  clockEl.textContent = moved ? `The clock is moved: ${clockText()}` : '';
  clockEl.classList.toggle('hidden', !moved);
}

export function initConsole(handle) {
  game = handle;
  try {
    recall = JSON.parse(sessionStorage.getItem(RECALL_KEY)) ?? [];
  } catch {
    recall = [];
  }

  const banner = document.createElement('div');
  banner.id = 'proving-banner';
  banner.innerHTML = `
    <b>The Proving Ground</b>
    <span>A test world. Thy true save is untouched.</span>
    <span>Press <kbd>/</kbd> for commands</span>
    <span id="proving-clock" class="hidden"></span>
    <button data-leave>Leave</button>`;
  banner.querySelector('[data-leave]').addEventListener('click', () => {
    location.href = worldUrl(false);
  });

  box = document.createElement('div');
  box.id = 'proving-console';
  box.className = 'hidden';
  box.innerHTML = `
    <div class="pc-log"></div>
    <div class="pc-line"><span>/</span><input type="text" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Command" /></div>
    <div class="pc-hint">Enter runs · Esc closes · ↑ the last line · Tab finishes a name · “help” lists every command</div>`;
  document.body.append(banner, box);
  document.title = 'Crownbound — the Proving Ground'; // the tab says which world it holds
  logEl = box.querySelector('.pc-log');
  input = box.querySelector('input');
  clockEl = banner.querySelector('#proving-clock');

  input.addEventListener('keydown', onKey);
  input.addEventListener('keyup', (e) => e.stopPropagation());
  input.addEventListener('blur', close); // clicked away: back to the game

  // `/` (or `) opens the line — not while writing in a panel's box, nor under a panel
  window.addEventListener('keydown', (e) => {
    if (e.key !== '/' && e.code !== 'Backquote') return;
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || isOpen || game.busy()) return;
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    e.preventDefault(); // or the slash itself would be typed into the line
    open();
  });

  drawClock();
  setInterval(drawClock, 15000);

  show([ok('The Proving Ground. Type help to see every command.')]);
  // what the last command said it would do, once the reload it asked for is over
  const note = takeNote();
  if (note) {
    show([ok(note)]);
    setTimeout(() => toast(note, 'gold'), 900);
  }
}
