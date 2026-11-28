// Headless render check: builds are not proof a WebGL app runs.
// Serves the built dist, loads it in headless Edge/Chrome, fails on console errors,
// and saves scripts/smoke.png for eyeballing the scene.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const BROWSERS = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];
// SMOKE_BROWSER=<path> picks the browser by hand — headless Edge can quit at
// once (exit code 0) on a machine where Edge is already open
const executablePath = process.env.SMOKE_BROWSER || BROWSERS.find(existsSync);
if (!executablePath) {
  console.error('No Edge/Chrome found for smoke test');
  process.exit(2);
}

// SMOKE_PORT=<n> serves on another port — two sessions sharing this folder
// must not both bind 5199, or one tests the other's build
const PORT = Number(process.env.SMOKE_PORT) || 5199;
// Every load holds the sky at one in the afternoon (main.js ?hour=), so the
// screenshots look the same whatever hour the suite is run — and skips the
// opening a blank save would otherwise begin with (?intro=0). Only the `intro`
// scenario loads without the second.
const NOON = '&hour=13';
const DAY = `${NOON}&intro=0`;
// SMOKE_WAIT=load waits for the page's load event instead of a quiet network.
// Where the software renderer keeps the page busy without a pause (a cloud
// container at ~3fps), the browser never declares the network idle at all.
const WAIT = process.env.SMOKE_WAIT || 'networkidle2';
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  shell: true,
  stdio: 'ignore',
});
const killServer = () =>
  spawn('taskkill', ['/PID', String(server.pid), '/T', '/F'], { stdio: 'ignore' });

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://localhost:${PORT}/`);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 350));
  }
  throw new Error('vite preview never came up');
}

const errors = [];
try {
  await waitForServer();
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--no-sandbox',
      '--window-size=1280,800',
    ],
    defaultViewport: { width: 1280, height: 800 },
  });
  const page = await browser.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));

  // What the E-prompt says once it says anything (up to 4s). A fixed wait can
  // fall between two frames where the software renderer manages ~3fps.
  const promptOffered = async () => {
    const el = () => document.getElementById('interact-prompt').textContent;
    await page.waitForFunction(() => document.getElementById('interact-prompt').textContent.length > 0, { timeout: 4000 }).catch(() => {});
    return page.evaluate(el);
  };

  // optional scenario hook, e.g. node scripts/smoke.mjs aerial
  const scenario = process.argv[2] || '';

  const dstr = (offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  if (scenario === 'fire') {
    // a 35-day streak, daily already done today: roaring blaze + full 480 stamina
    const hot = {
      saveVersion: 1,
      createdAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString(),
      lastQuestDate: dstr(0),
      rank: 'Peasant',
      stats: {
        str: { level: 1, xp: 0 },
        agi: { level: 1, xp: 0 },
        wis: { level: 1, xp: 0 },
        inf: { level: 1, xp: 0 },
      },
      coins: 0,
      treasury: { current: 0, goal: 10000 },
      streak: { current: 35, best: 35 },
      quests: {
        daily: { text: 'today deed', completed: true, date: dstr(0) },
        weekly: { text: '', completed: false, weekStart: '2020-01-06' },
        epic: { text: '', progressPct: 0, deadline: '2027-06-08T05:00:00' },
      },
      history: [],
      daysPlayed: 36,
      stamina: { current: 480, date: dstr(0) },
      counters: { date: dstr(0), dummyHits: 0, ratsKilled: 0 },
    };
    await page.evaluateOnNewDocument((save) => {
      if (!sessionStorage.getItem('smoke-injected')) {
        sessionStorage.setItem('smoke-injected', '1');
        localStorage.setItem('crownbound_save', JSON.stringify(save));
      }
    }, hot);
  }

  if (scenario === 'rollover') {
    const stale = {
      saveVersion: 2,
      createdAt: new Date(Date.now() - 3 * 864e5).toISOString(),
      lastPlayedAt: new Date(Date.now() - 2 * 864e5).toISOString(),
      lastQuestDate: dstr(-2),
      rank: 'Peasant',
      stats: {
        str: { level: 2, xp: 10 },
        agi: { level: 1, xp: 0 },
        wis: { level: 1, xp: 0 },
        inf: { level: 1, xp: 0 },
      },
      coins: 42,
      treasury: { current: 500, goal: 10000 },
      streak: { current: 5, best: 9 },
      quests: {
        daily: { text: 'old deed', completed: true, date: dstr(-2) },
        weekly: { text: 'old bounty', completed: true, weekStart: '2020-01-06' },
        monthly: { text: 'old campaign', completed: true, monthStart: '2020-01-01' },
        epic: { text: 'Become Crowned', progressPct: 10, deadline: '2027-06-08T05:00:00' },
      },
      history: [{ date: dstr(-2), questText: 'old deed', statTrained: 'str', type: 'daily' }],
      daysPlayed: 3,
      stamina: { current: 480, date: dstr(-2) },
      counters: { date: dstr(-2), dummyHits: 25, ratsKilled: 3 },
    };
    // inject once; sessionStorage flag stops re-injection on reload
    await page.evaluateOnNewDocument((save) => {
      if (!sessionStorage.getItem('smoke-injected')) {
        sessionStorage.setItem('smoke-injected', '1');
        localStorage.setItem('crownbound_save', JSON.stringify(save));
      }
    }, stale);
  }

  if (scenario === 'crown') {
    // a Lord one daily quest from the throne: 69 total levels once migrated
    // (24 + Intelligence's fresh 1 + 22 + 22), str 25 XP
    // short of its next level (v5 save — the migration must also delete the
    // old epic deadline)
    const eve = {
      saveVersion: 5,
      createdAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString(),
      lastQuestDate: dstr(-1),
      rank: 'Lord',
      stats: {
        str: { level: 24, xp: 2375 },
        agi: { level: 15, xp: 40 }, // dropped by v11: Intelligence begins at level 1
        wis: { level: 22, xp: 0 },
        inf: { level: 22, xp: 0 },
      },
      coins: 5000,
      treasury: { current: 0, goal: 10000 },
      streak: { current: 300, best: 300 },
      quests: {
        daily: { text: '', completed: false, date: dstr(0) },
        weekly: { text: '', completed: false, weekStart: '2020-01-06' },
        monthly: { text: '', completed: false, monthStart: '2020-01-01' },
        epic: { text: 'Become Crowned', progressPct: 95, deadline: '2027-06-08T05:00:00' },
      },
      history: [],
      daysPlayed: 340,
      stamina: { current: 240, date: dstr(0) },
      counters: { date: dstr(0), dummyHits: 0, ratsKilled: 0 },
      sleep: { retiredAt: null, lastRewardDate: null, wellRestedDate: null, log: [] },
      shop: { owned: ['cudgel', 'quarterstaff'] }, // pre-chest: the best weapon was always in hand
    };
    await page.evaluateOnNewDocument((save) => {
      if (!sessionStorage.getItem('smoke-injected')) {
        sessionStorage.setItem('smoke-injected', '1');
        localStorage.setItem('crownbound_save', JSON.stringify(save));
      }
    }, eve);
  }

  if (scenario === 'reckoning') {
    // a v6 save with the old flat treasury — migration must grow the
    // name/pledge/log/rolls/conquered fields; 800 of 1000 so one month's saving conquers
    const ledger = {
      saveVersion: 6,
      createdAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString(),
      lastQuestDate: null,
      rank: 'Peasant',
      stats: {
        str: { level: 1, xp: 0 },
        agi: { level: 1, xp: 0 },
        wis: { level: 1, xp: 0 },
        inf: { level: 1, xp: 0 },
      },
      coins: 0,
      treasury: { current: 800, goal: 1000 },
      streak: { current: 0, best: 0 },
      quests: {
        daily: { text: '', completed: false, date: dstr(0) },
        weekly: { text: '', completed: false, weekStart: '2020-01-06' },
        monthly: { text: '', completed: false, monthStart: '2020-01-01' },
        epic: { text: '', progressPct: 0 },
      },
      history: [],
      daysPlayed: 1,
      stamina: { current: 240, date: dstr(0) },
      counters: { date: dstr(0), dummyHits: 0, ratsKilled: 0 },
      sleep: { retiredAt: null, lastRewardDate: null, wellRestedDate: null, log: [] },
      shop: { owned: [] },
      coronationAt: null,
    };
    await page.evaluateOnNewDocument((save) => {
      if (!sessionStorage.getItem('smoke-injected')) {
        sessionStorage.setItem('smoke-injected', '1');
        localStorage.setItem('crownbound_save', JSON.stringify(save));
      }
    }, ledger);
  }

  if (scenario === 'farm') {
    // a v10 save from before there was a field: the migration must lay the
    // strip out fallow; 30 coins in the purse for the wages to add to
    const landless = {
      saveVersion: 10,
      createdAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString(),
      lastQuestDate: null,
      rank: 'Peasant',
      stats: {
        ath: { level: 1, xp: 0 },
        int: { level: 1, xp: 0 },
        wis: { level: 1, xp: 0 },
        inf: { level: 1, xp: 0 },
      },
      coins: 30,
      treasury: { name: '', current: 0, goal: 10000, pledge: 0, rolls: [], conquered: [] },
      streak: { current: 0, best: 0 },
      quests: {
        daily: { text: '', completed: false, date: dstr(0) },
        weekly: { text: '', completed: false, weekStart: '2020-01-06' },
        monthly: { text: '', completed: false, monthStart: '2020-01-01' },
        epic: { text: '', progressPct: 0 },
      },
      history: [],
      chronicle: [],
      daysPlayed: 1,
      stamina: { current: 240, date: dstr(0) },
      counters: { date: dstr(0), dummyHits: 0, ratsKilled: 0 },
      sleep: { retiredAt: null, lastRewardDate: null, wellRestedDate: null, log: [] },
      shop: { owned: [] },
      chest: { wielded: 'stick', loaves: 0 },
      coronationAt: null,
    };
    await page.evaluateOnNewDocument((save) => {
      if (!sessionStorage.getItem('smoke-injected')) {
        sessionStorage.setItem('smoke-injected', '1');
        localStorage.setItem('crownbound_save', JSON.stringify(save));
      }
    }, landless);
  }

  if (scenario === 'sage') {
    // appoint the sage and stub the Anthropic API at the fetch layer: the
    // verdict comes from the quest text, so the wiring is tested end-to-end
    // without network or tokens ('tennis' → ath; 'garble' → nonsense)
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('crownbound_sage_key', 'sk-ant-smoke-test');
      const realFetch = window.fetch.bind(window);
      window.fetch = async (input, init) => {
        const url = typeof input === 'string' ? input : input.url;
        if (!url.includes('api.anthropic.com')) return realFetch(input, init);
        const bodyText = init?.body ?? (typeof input !== 'string' ? await input.clone().text() : '');
        const req = JSON.parse(bodyText);
        const deed = String(req.messages?.[0]?.content ?? '');
        let verdict = 'wis';
        if (deed.includes('tennis')) verdict = 'ath';
        if (deed.includes('client')) verdict = 'ath inf';
        if (deed.includes('garble')) verdict = 'the moon knows no virtue';
        return new Response(
          JSON.stringify({
            id: 'msg_smoke',
            type: 'message',
            role: 'assistant',
            model: req.model,
            content: [{ type: 'text', text: verdict }],
            stop_reason: 'end_turn',
            stop_sequence: null,
            usage: { input_tokens: 1, output_tokens: 1 },
          }),
          { status: 200, headers: { 'content-type': 'application/json' } }
        );
      };
    });
  }

  if (scenario === 'chronicle') {
    // a v7 save begun three weeks back: deeds in the first and last finished
    // weeks, nothing in the middle one. The Anthropic API is stubbed at the
    // fetch layer and FAILS on the first load, so the scenario covers the
    // failure law, one-written-entry-per-load, and the free silent week.
    const old = {
      saveVersion: 7,
      createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
      lastPlayedAt: new Date().toISOString(),
      lastQuestDate: null,
      rank: 'Peasant',
      stats: {
        str: { level: 1, xp: 0 },
        agi: { level: 1, xp: 0 },
        wis: { level: 1, xp: 0 },
        inf: { level: 1, xp: 0 },
      },
      coins: 0,
      treasury: { name: '', current: 0, goal: 0, pledge: 0, rolls: [], conquered: [] },
      streak: { current: 0, best: 0 },
      quests: {
        daily: { text: '', completed: false, date: dstr(0) },
        weekly: { text: '', completed: false, weekStart: '2020-01-06' },
        monthly: { text: '', completed: false, monthStart: '2020-01-01' },
        epic: { text: '', progressPct: 0 },
      },
      history: [
        { date: dstr(-21), questText: 'Lifted at the yard', statTrained: 'str', type: 'daily' },
        { date: dstr(-7), questText: 'Played tennis', statTrained: 'agi', type: 'daily' },
      ],
      daysPlayed: 3,
      stamina: { current: 240, date: dstr(0) },
      counters: { date: dstr(0), dummyHits: 0, ratsKilled: 0 },
      sleep: { retiredAt: null, lastRewardDate: null, wellRestedDate: null, log: [] },
      shop: { owned: [] },
      coronationAt: null,
    };
    await page.evaluateOnNewDocument((save) => {
      if (!sessionStorage.getItem('smoke-injected')) {
        sessionStorage.setItem('smoke-injected', '1');
        localStorage.setItem('crownbound_save', JSON.stringify(save));
      }
      localStorage.setItem('crownbound_sage_key', 'sk-ant-smoke-test');
      const load = Number(sessionStorage.getItem('smoke-loads') || 0) + 1;
      sessionStorage.setItem('smoke-loads', String(load));
      const realFetch = window.fetch.bind(window);
      window.fetch = async (input, init) => {
        const url = typeof input === 'string' ? input : input.url;
        if (!url.includes('api.anthropic.com')) return realFetch(input, init);
        sessionStorage.setItem('smoke-calls', String(Number(sessionStorage.getItem('smoke-calls') || 0) + 1));
        const headers = { 'content-type': 'application/json' };
        if (load === 1) {
          return new Response(
            JSON.stringify({ type: 'error', error: { type: 'api_error', message: 'smoke' } }),
            { status: 500, headers }
          );
        }
        const bodyText = init?.body ?? (typeof input !== 'string' ? await input.clone().text() : '');
        const req = JSON.parse(bodyText);
        sessionStorage.setItem('smoke-charge', String(req.system ?? ''));
        const ledger = String(req.messages?.[0]?.content ?? '');
        const prose = ledger.includes('tennis') ? 'He strove at the ball court.' : 'He laboured in the yard.';
        return new Response(
          JSON.stringify({
            id: 'msg_smoke',
            type: 'message',
            role: 'assistant',
            model: req.model,
            content: [{ type: 'text', text: prose }],
            stop_reason: 'end_turn',
            stop_sequence: null,
            usage: { input_tokens: 1, output_tokens: 1 },
          }),
          { status: 200, headers }
        );
      };
    }, old);
  }

  await page.goto(`http://localhost:${PORT}/?smoke=${scenario}${scenario === 'intro' ? NOON : DAY}`, {
    waitUntil: WAIT,
    timeout: 40000,
  });
  await new Promise((r) => setTimeout(r, 2500));

  if (scenario === 'rollover') {
    const s1 = await page.evaluate(() => {
      const st = window.__game.getState();
      return {
        dailyText: (st.quests.daily.deeds[0]?.text ?? ''),
        dailyDone: st.quests.daily.deeds.some((d) => d.completed),
        weeklyText: st.quests.weekly.text,
        monthlyText: st.quests.monthly.text,
        monthlyDone: st.quests.monthly.completed,
        streak: st.streak.current,
        best: st.streak.best,
        stamina: st.stamina.current,
        dummyHits: st.counters.dummyHits,
        daysPlayed: st.daysPlayed,
        coins: st.coins,
        athLevel: st.stats.ath.level,
        epicText: st.quests.epic.text,
        gutter: window.__game.campfire.getGutter(),
      };
    });
    console.log('after rollover:', JSON.stringify(s1));
    if (s1.gutter >= 1) errors.push('rollover: campfire not guttering on the new day');
    if (s1.dailyText !== '') errors.push('rollover: daily quest not reset');
    if (s1.dailyDone) errors.push('rollover: daily still completed');
    if (s1.weeklyText !== '') errors.push('rollover: weekly not reset');
    if (s1.monthlyText !== '' || s1.monthlyDone) errors.push('rollover: monthly not reset');
    if (s1.streak !== 0) errors.push(`rollover: streak ${s1.streak} != 0 (fire should die)`);
    if (s1.best !== 9) errors.push(`rollover: best streak ${s1.best} != 9`);
    if (s1.stamina !== 240) errors.push(`rollover: stamina ${s1.stamina} != 240`);
    if (s1.dummyHits !== 0) errors.push('rollover: day counters not reset');
    if (s1.daysPlayed !== 4) errors.push(`rollover: daysPlayed ${s1.daysPlayed} != 4`);
    if (s1.coins !== 42) errors.push('rollover: coins not preserved');
    if (s1.athLevel !== 2) errors.push('rollover: stat levels not preserved');
    if (s1.epicText !== 'Become Crowned') errors.push('rollover: epic quest not preserved');

    // round trip: post a quest, reload, expect it back
    await page.evaluate(() => window.__game.openPanel('board'));
    await page.type('[data-input]', 'Morning run');
    await page.click('[data-post]');
    await page.reload({ waitUntil: WAIT });
    await new Promise((r) => setTimeout(r, 2000));
    const s2 = await page.evaluate(() => {
      const st = window.__game.getState();
      return { text: (st.quests.daily.deeds[0]?.text ?? ''), done: st.quests.daily.deeds.some((d) => d.completed), coins: st.coins };
    });
    console.log('after reload:', JSON.stringify(s2));
    if (s2.text !== 'Morning run') errors.push(`roundtrip: daily text "${s2.text}"`);
    if (s2.done) errors.push('roundtrip: daily wrongly completed');
    if (s2.coins !== 42) errors.push('roundtrip: coins lost');
  }

  if (scenario === 'fire') {
    await page.evaluate(() => window.__game.orbitCam.setView(Math.PI * 0.98, 0.12, 5));
    const drain = await page.evaluate(() => {
      const g = window.__game;
      const spends = [];
      for (let i = 0; i < 6; i++) spends.push(g.spendStamina(5)); // 480 -> 450
      const mid = g.getState().stamina.current;
      const big = g.spendStamina(449); // -> 1 (nought would send him home to bed)
      const empty = g.spendStamina(5); // must refuse
      return { spends, mid, big, empty, end: g.getState().stamina.current };
    });
    console.log('stamina drain:', JSON.stringify(drain));
    const tended = await page.evaluate(() => window.__game.campfire.getGutter());
    if (tended !== 1) errors.push(`fire: blaze guttering (${tended}) though daily is done`);
    if (drain.spends.some((v) => !v)) errors.push('fire: early spends refused');
    if (drain.mid !== 450) errors.push(`fire: mid stamina ${drain.mid} != 450`);
    if (!drain.big) errors.push('fire: spend-to-one refused');
    if (drain.empty) errors.push('fire: spend of 5 allowed at 1 stamina');
    if (drain.end !== 1) errors.push(`fire: end stamina ${drain.end} != 1`);
  } else if (scenario === 'aerial') {
    await page.evaluate(() => window.__game?.orbitCam?.setView(2.4, 1.1, 14));
  } else if (scenario === 'front') {
    await page.evaluate(() => window.__game?.orbitCam?.setView(-2.6, 0.25, 7));
  } else if (scenario === 'quests') {
    const gutterBefore = await page.evaluate(() => window.__game.campfire.getGutter());
    await page.evaluate(() => window.__game.openPanel('board'));
    await page.type('[data-input]', 'Bench press session');
    await page.click('[data-post]');
    await page.click('[data-complete]');
    await page.click('[data-pick="ath"]');
    await page.click('[data-pick-done]');
    const s = await page.evaluate(() => {
      const st = window.__game.getState();
      return {
        coins: st.coins,
        athXp: st.stats.ath.xp,
        streak: st.streak.current,
        done: st.quests.daily.deeds.some((d) => d.completed),
        stamina: st.stamina.current,
        history: st.history.length,
        gutter: window.__game.campfire.getGutter(),
      };
    });
    console.log('quest state:', JSON.stringify(s), `gutterBefore=${gutterBefore}`);
    if (gutterBefore >= 1) errors.push('fire-warn: campfire not guttering before the daily');
    if (s.gutter !== 1) errors.push(`fire-warn: campfire still guttering (${s.gutter}) after the daily`);
    if (s.coins !== 10) errors.push(`quests: coins ${s.coins} != 10`);
    if (s.athXp !== 25) errors.push(`quests: athXp ${s.athXp} != 25`);
    if (s.streak !== 1) errors.push(`quests: streak ${s.streak} != 1`);
    if (!s.done) errors.push('quests: daily not completed');
    if (s.stamina !== 480) errors.push(`quests: stamina ${s.stamina} != 480`);
    if (s.history !== 1) errors.push(`quests: history ${s.history} != 1`);

    // weekly bounty: post, complete, train Wisdom (+100 XP -> level 2 with 0 spare)
    await page.type('.quest-block[data-kind="weekly"] [data-input]', 'Ship the Felmark proposal');
    await page.click('.quest-block[data-kind="weekly"] [data-post]');
    await page.click('.quest-block[data-kind="weekly"] [data-complete]');
    await page.click('[data-pick="wis"]');
    await page.click('[data-pick-done]');
    const w = await page.evaluate(() => {
      const st = window.__game.getState();
      return {
        coins: st.coins,
        wis: st.stats.wis,
        done: st.quests.weekly.completed,
        history: st.history.length,
        rank: st.rank,
      };
    });
    console.log('weekly state:', JSON.stringify(w));
    if (w.coins !== 60) errors.push(`weekly: coins ${w.coins} != 60`);
    if (w.wis.level !== 2 || w.wis.xp !== 0)
      errors.push(`weekly: wis L${w.wis.level}/${w.wis.xp} != L2/0`);
    if (!w.done) errors.push('weekly: not completed');
    if (w.history !== 2) errors.push(`weekly: history ${w.history} != 2`);

    // monthly campaign: post, complete, train Influence (+300 XP -> level 3 with 0 spare)
    await page.type('.quest-block[data-kind="monthly"] [data-input]', 'Land the first paying client');
    await page.click('.quest-block[data-kind="monthly"] [data-post]');
    await page.click('.quest-block[data-kind="monthly"] [data-complete]');
    await page.click('[data-pick="inf"]');
    await page.click('[data-pick-done]');
    const m = await page.evaluate(() => {
      const st = window.__game.getState();
      return {
        coins: st.coins,
        inf: st.stats.inf,
        done: st.quests.monthly.completed,
        history: st.history.length,
        type: st.history[st.history.length - 1].type,
      };
    });
    console.log('monthly state:', JSON.stringify(m));
    if (m.coins !== 210) errors.push(`monthly: coins ${m.coins} != 210`);
    if (m.inf.level !== 3 || m.inf.xp !== 0)
      errors.push(`monthly: inf L${m.inf.level}/${m.inf.xp} != L3/0`);
    if (!m.done) errors.push('monthly: not completed');
    if (m.history !== 3) errors.push(`monthly: history ${m.history} != 3`);
    if (m.type !== 'monthly') errors.push(`monthly: history type ${m.type} != monthly`);

    // a second deed the same day, of two virtues: the XP is shared (13 + 12), the
    // coins paid in full, and the day — streak, stamina — is not claimed twice
    const board = () =>
      page.evaluate(() => {
        const st = window.__game.getState();
        const daily = document.querySelector('.quest-block[data-kind="daily"]');
        return {
          deeds: st.quests.daily.deeds,
          coins: st.coins,
          ath: st.stats.ath.xp,
          inf: st.stats.inf.xp,
          wis: st.stats.wis.xp,
          streak: st.streak.current,
          stamina: st.stamina.current,
          last: st.history.at(-1),
          history: st.history.length,
          input: !!daily.querySelector('[data-input]'),
          claim: daily.querySelector('[data-pick-done]')?.disabled,
          share: daily.querySelector('[data-pick-share]')?.textContent,
          text: daily.textContent,
        };
      });
    await page.evaluate(() => window.__game.spendStamina(30)); // 480 -> 450
    await page.type('.quest-block[data-kind="daily"] [data-input]', 'Tennis with a client');
    await page.click('.quest-block[data-kind="daily"] [data-post]');
    await page.click('[data-slot="daily:1"] [data-complete]');
    let d = await board();
    if (d.claim !== true) errors.push('deeds: the reward could be claimed with no virtue chosen');
    await page.click('[data-pick="ath"]');
    await page.click('[data-pick="inf"]');
    d = await board();
    console.log('two virtues chosen:', JSON.stringify({ claim: d.claim, share: d.share }));
    if (d.claim !== false || d.share !== 'Athleticism +13 · Influence +12') errors.push(`deeds: the share shown is "${d.share}"`);
    await page.click('[data-pick-done]');
    d = await board();
    console.log('second deed:', JSON.stringify({ ...d, text: undefined }));
    if (d.ath !== 38 || d.inf !== 12) errors.push(`deeds: the XP was not shared 13 + 12 (ath ${d.ath}, inf ${d.inf})`);
    if (d.coins !== 220) errors.push(`deeds: coins ${d.coins} != 220`);
    if (d.streak !== 1) errors.push(`deeds: the second deed moved the streak to ${d.streak}`);
    if (d.stamina !== 450) errors.push(`deeds: the second deed refilled stamina (${d.stamina})`);
    if (d.last.statTrained !== 'ath' || d.last.virtues?.join() !== 'ath,inf' || d.last.type !== 'daily')
      errors.push(`deeds: the history deed ${JSON.stringify(d.last)}`);
    if (d.deeds.length !== 2 || !d.deeds[1].completed || d.deeds[1].virtues?.join() !== 'ath,inf')
      errors.push(`deeds: today's list ${JSON.stringify(d.deeds)}`);
    if (!d.text.includes('Done · Athleticism · Influence')) errors.push('deeds: the done deed does not name its virtues');

    // a virtue ticked twice is unticked; a deed posted in error is taken down
    await page.type('.quest-block[data-kind="daily"] [data-input]', 'A slip of the quill');
    await page.click('.quest-block[data-kind="daily"] [data-post]');
    await page.click('[data-slot="daily:2"] [data-complete]');
    await page.click('[data-pick="wis"]');
    await page.click('[data-pick="wis"]');
    d = await board();
    if (d.claim !== true) errors.push('deeds: a virtue unticked still left the reward to claim');
    await page.keyboard.press('Escape'); // closing the board forgets the half-made choice
    await new Promise((r) => setTimeout(r, 200));
    await page.evaluate(() => window.__game.openPanel('board'));
    await page.click('[data-slot="daily:2"] [data-strike]');
    d = await board();
    if (d.deeds.length !== 2 || d.history !== 4 || d.text.includes('A slip of the quill')) errors.push(`deeds: the deed was not taken down (${JSON.stringify(d.deeds)})`);

    // the board takes five deeds a day and no more; three virtues share 9 + 8 + 8
    for (const text of ['Read a chapter', 'Call home', 'Plan the week']) {
      await page.type('.quest-block[data-kind="daily"] [data-input]', text);
      await page.click('.quest-block[data-kind="daily"] [data-post]');
    }
    d = await board();
    if (d.deeds.length !== 5 || d.input) errors.push(`deeds: the board took ${d.deeds.length} deeds, box ${d.input ? 'still there' : 'gone'}`);
    await page.click('[data-slot="daily:4"] [data-complete]');
    for (const k of ['int', 'wis', 'inf']) await page.click(`[data-pick="${k}"]`);
    await page.click('[data-pick-done]');
    d = await board();
    console.log('three virtues:', JSON.stringify({ wis: d.wis, inf: d.inf, coins: d.coins, last: d.last }));
    if (d.wis !== 8 || d.inf !== 20 || d.coins !== 230) errors.push(`deeds: three virtues did not share 9 + 8 + 8 (wis ${d.wis}, inf ${d.inf}, coins ${d.coins})`);
    await page.screenshot({ path: 'scripts/smoke-quests.png' });

    // tomorrow the list is bare again, and yesterday's deed keeps the streak
    await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('crownbound_save'));
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const ymd = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
      s.quests.daily.date = s.lastQuestDate = s.stamina.date = s.counters.date = ymd;
      localStorage.setItem('crownbound_save', JSON.stringify(s));
    });
    await page.reload({ waitUntil: WAIT });
    await new Promise((r) => setTimeout(r, 2000));
    const morrow = await page.evaluate(() => {
      const st = window.__game.getState();
      return { deeds: st.quests.daily.deeds, streak: st.streak.current, stamina: st.stamina.current };
    });
    console.log('the morrow:', JSON.stringify(morrow));
    if (morrow.deeds.length !== 0 || morrow.streak !== 1 || morrow.stamina !== 240) errors.push(`deeds: the morrow ${JSON.stringify(morrow)}`);
  } else if (scenario === 'tome') {
    // the Scribe: export a copy, doctor it, restore it, expect it back after reload
    const trip = await page.evaluate(() => {
      const g = window.__game;
      const bad = g.importSave('{"coins":7}'); // no saveVersion/stats/quests
      const copy = JSON.parse(g.exportSave());
      copy.coins = 777;
      copy.history = [
        { date: '2026-06-10', questText: 'Bench press session', statTrained: 'ath', type: 'daily' },
        { date: '2026-06-11', questText: 'Ship the proposal', statTrained: 'wis', type: 'weekly' },
        { date: '2026-06-12', questText: 'Become Crowned', statTrained: null, type: 'epic', progressPct: 40 },
      ];
      return { bad, ok: g.importSave(JSON.stringify(copy)) };
    });
    await page.reload({ waitUntil: WAIT });
    await new Promise((r) => setTimeout(r, 2000));
    const coins = await page.evaluate(() => window.__game.getState().coins);
    console.log(`scribe round-trip: badRefused=${!trip.bad} ok=${trip.ok} coins=${coins}`);
    if (trip.bad) errors.push('scribe: importSave accepted an invalid scroll');
    if (!trip.ok) errors.push('scribe: importSave refused a valid copy');
    if (coins !== 777) errors.push(`scribe: coins ${coins} != 777 after restore`);
    await page.evaluate(() => window.__game.openPanel('tome'));
    const deeds = await page.evaluate(() => ({
      count: document.querySelectorAll('.deed').length,
      firstTag: document.querySelector('.deed .deed-tag')?.textContent ?? '',
      lastTag: [...document.querySelectorAll('.deed .deed-tag')].pop()?.textContent ?? '',
    }));
    console.log(`chronicle: ${deeds.count} deeds, newest tagged "${deeds.firstTag}"`);
    if (deeds.count !== 3) errors.push(`chronicle: ${deeds.count} deed rows != 3`);
    if (!deeds.lastTag.includes('Athleticism')) errors.push(`chronicle: oldest deed tagged "${deeds.lastTag}", no virtue named`);
    if (!deeds.firstTag.includes('40%')) errors.push('chronicle: newest deed not first');
  } else if (scenario === 'combat') {
    // 1) dummy: teleport beside it, two swings -> 4 Athleticism XP, wobble
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = g.dummy.x + 1.1;
      g.player.pos.z = g.dummy.z;
      g.player.faceToward(g.dummy.x, g.dummy.z);
    });
    let dmgShown = null;
    for (let i = 0; i < 2; i++) {
      await page.evaluate(() => window.__game.player.attack());
      if (i === 0) {
        // the blow's damage number thrown up over the dummy (the stick: 1)
        // once placed: its screen spot against the dummy's head projected the same way
        const placed = await page
          .waitForFunction(() => {
            const g = window.__game;
            const el = document.querySelector('.dmg');
            if (!el || !el.style.transform || el.style.visibility === 'hidden') return null;
            const r = el.getBoundingClientRect();
            const v = g.camera.position.clone().set(g.dummy.x, 0, g.dummy.z);
            v.y = g.player.pos.y + 2.0; // about the dummy's crown (ground there ~ his feet)
            v.project(g.camera);
            return {
              shown: g.damageShown(),
              at: [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)],
              head: [Math.round((v.x * 0.5 + 0.5) * innerWidth), Math.round((-v.y * 0.5 + 0.5) * innerHeight)],
              size: Math.round(r.height),
            };
          }, { timeout: 4000, polling: 'raf' })
          .then((h) => h.jsonValue())
          .catch(() => null);
        // the page's clock held while the (slow, software) screenshot is taken,
        // or the number has faded before it is captured; let go after
        await page.evaluate(() => {
          window.__realNow = performance.now.bind(performance);
          const t = window.__realNow();
          performance.now = () => t;
        });
        await page.screenshot({ path: 'scripts/smoke-damage.png' });
        await page.evaluate(() => { performance.now = window.__realNow; });
        console.log('dummy damage number:', JSON.stringify(placed));
        dmgShown = placed?.shown ?? [];
        if (placed) {
          const off = Math.hypot(placed.at[0] - placed.head[0], placed.at[1] - placed.head[1]);
          if (off > 160) errors.push(`combat: damage number ${Math.round(off)}px from the dummy's head`);
          if (placed.size < 20) errors.push(`combat: damage number only ${placed.size}px tall`);
        }
      }
      await new Promise((r) => setTimeout(r, 600));
    }
    if (!dmgShown.length || dmgShown[0] !== 1) errors.push(`combat: no damage number of 1 over the dummy (${JSON.stringify(dmgShown)})`);
    const afterDummy = await page.evaluate(() => {
      const st = window.__game.getState();
      return {
        athXp: st.stats.ath.xp,
        hits: st.counters.dummyHits,
        stamina: st.stamina.current,
        wobble: Math.abs(window.__game.dummy ? 1 : 0),
      };
    });
    console.log('dummy:', JSON.stringify(afterDummy));
    if (afterDummy.athXp !== 4) errors.push(`combat: dummy athXp ${afterDummy.athXp} != 4`);
    if (afterDummy.hits !== 2) errors.push(`combat: dummyHits ${afterDummy.hits} != 2`);
    if (afterDummy.stamina !== 230) errors.push(`combat: stamina ${afterDummy.stamina} != 230`);

    // 2) rats: walk into the granary yard, get bitten, then slay one
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = 10;
      g.player.pos.z = 9.5;
    });
    await new Promise((r) => setTimeout(r, 3000)); // let them aggro and bite
    const bitten = await page.evaluate(() => window.__game.player.hp);
    console.log('hp after rat ambush:', bitten);
    if (bitten >= 20) errors.push(`combat: rats never bit (hp ${bitten})`);

    for (let i = 0; i < 4; i++) {
      await page.evaluate(() => {
        const g = window.__game;
        const rat = g.rats.list.find((r) => r.alive);
        if (rat) {
          g.player.pos.x = rat.x + 0.9;
          g.player.pos.z = rat.z;
          g.player.faceToward(rat.x, rat.z);
          g.player.attack();
        }
      });
      await new Promise((r) => setTimeout(r, 550));
    }
    const afterRats = await page.evaluate(() => {
      const g = window.__game;
      const st = g.getState();
      return {
        killed: st.counters.ratsKilled,
        coins: st.coins,
        aliveRats: g.rats.list.filter((r) => r.alive).length,
      };
    });
    console.log('rats:', JSON.stringify(afterRats));
    if (afterRats.killed < 1) errors.push('combat: no rat slain');
    if (afterRats.coins < 2) errors.push(`combat: no bounty paid (coins ${afterRats.coins})`);
    if (afterRats.aliveRats !== 3 - afterRats.killed)
      errors.push(`combat: alive ${afterRats.aliveRats} + killed ${afterRats.killed} != 3`);

    // 3) the miller acknowledges the day's tally (wording varies with kills).
    // He walks his rounds now, so stand next to wherever he actually is.
    await page.evaluate(() => {
      const g = window.__game;
      const at = g.miller.at();
      g.player.pos.x = at.x - 0.8;
      g.player.pos.z = at.z - 0.6;
    });
    await new Promise((r) => setTimeout(r, 400));
    const millerPrompt = await page.evaluate(
      () => document.getElementById('interact-prompt').textContent
    );
    console.log('miller prompt:', JSON.stringify(millerPrompt));
    if (!millerPrompt.includes('miller'))
      errors.push(`combat: prompt "${millerPrompt}" does not offer the miller`);
    await page.keyboard.press('KeyE');
    await new Promise((r) => setTimeout(r, 300));
    const greeting = await page.evaluate(() => document.getElementById('toasts').textContent);
    console.log('miller greeting:', JSON.stringify(greeting));
    if (!/grain breathes easier|quiet at last/.test(greeting))
      errors.push('combat: the miller did not acknowledge the tally');
    await page.evaluate(() => window.__game.orbitCam.setView(-0.8, 0.28, 4));
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: 'scripts/smoke-miller.png' });

    // 4) overlapping hit-flashes must not stick — two bites inside the 90ms
    // window once turned the player permanently red (the second flash saved
    // the red material as the "original")
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = -5; // out of the rats' leash so nothing re-flashes
      g.player.pos.z = 4;
      g.player.takeDamage(1, -4, 4);
      setTimeout(() => g.player.takeDamage(1, -6, 4), 40);
    });
    // The second bite and the flash's end are two timers, each of which waits
    // out a frame on a slow renderer (~400ms a frame in a cloud container), so
    // a fixed 600ms could read him still red. Wait for the red to go — up to
    // 5s; a flash that has truly stuck never goes.
    const countRed = () => {
      let red = 0;
      window.__game.player.mesh.group.traverse((o) => {
        if (o.isMesh && o.material.color && o.material.color.getHex() === 0xff5039) red++;
      });
      return red;
    };
    await new Promise((r) => setTimeout(r, 600));
    await page.waitForFunction(`(${countRed})() === 0`, { timeout: 5000, polling: 100 }).catch(() => {});
    const redBits = await page.evaluate(countRed);
    console.log('red meshes after overlapping hits:', redBits);
    if (redBits > 0) errors.push(`combat: player stuck red (${redBits} meshes) after overlapping hits`);

    // 5) death: take a mortal blow, wake at the hovel with full hp
    await page.evaluate(() => window.__game.player.takeDamage(99, 11, 11));
    await new Promise((r) => setTimeout(r, 1800));
    const wake = await page.evaluate(() => ({
      hp: window.__game.player.hp,
      x: window.__game.player.pos.x,
      z: window.__game.player.pos.z,
    }));
    console.log('after death:', JSON.stringify(wake));
    if (wake.hp !== 20) errors.push(`death: hp ${wake.hp} != 20 after respawn`);
    if (Math.hypot(wake.x + 9.3, wake.z - 1.4) > 1.2)
      errors.push(`death: respawned at ${wake.x.toFixed(1)},${wake.z.toFixed(1)} not at the cot`);
  } else if (scenario === 'walk') {
    const before = await page.evaluate(() => ({ x: window.__game.player.pos.x, z: window.__game.player.pos.z }));
    await page.keyboard.down('KeyW');
    await new Promise((r) => setTimeout(r, 2000));
    await page.keyboard.up('KeyW');
    const after = await page.evaluate(() => ({ x: window.__game.player.pos.x, z: window.__game.player.pos.z }));
    const moved = Math.hypot(after.x - before.x, after.z - before.z);
    console.log(`walk check: moved ${moved.toFixed(2)} units`);
    if (moved < 2) errors.push(`walk: player barely moved (${moved.toFixed(2)} units)`);
  } else if (scenario === 'keys') {
    // No mouse: a laptop plays on the keys alone. The arrows turn and tilt the
    // eye, − and = draw it back and near, F swings, and the first key stops
    // the showcase orbit. Each check presses its keys and steps the camera
    // (and, walking, the player) by hand at the loop's 50ms slice inside ONE
    // evaluate — a held key timed in real milliseconds is at the mercy of the
    // software renderer, whose stalled frames deliver the key-up late.
    await page.evaluate(() => {
      const g = window.__game;
      const send = (type, code) => window.dispatchEvent(new KeyboardEvent(type, { code, bubbles: true, cancelable: true }));
      window.__keys = {
        down: (code) => send('keydown', code),
        up: (code) => send('keyup', code),
        run(seconds, walk) {
          for (let t = 0; t < seconds - 1e-9; t += 0.05) {
            if (walk) g.player.update(0.05, g.orbitCam.getYaw(), g.colliders);
            g.orbitCam.update(0.05, g.player.pos);
          }
          return g.orbitCam.getView();
        },
        // held for `seconds`, then let go and given 0.6s to ease to a dead stop
        hold(code, seconds) {
          this.down(code);
          this.run(seconds);
          this.up(code);
          return this.run(0.6);
        },
      };
    });
    const v0 = await page.evaluate(() => window.__game.orbitCam.getView());
    if (v0.taken) errors.push('keys: the showcase orbit was already stopped at load');

    // F swings — before any walking, so no stride's toll muddies the stamina
    const swing = await page.evaluate(() => {
      const g = window.__game;
      const before = g.getState().stamina.current;
      window.__keys.down('KeyF');
      const r = { mode: g.player.mode, spent: before - g.getState().stamina.current };
      window.__keys.up('KeyF');
      return r;
    });
    console.log('F:', JSON.stringify(swing));
    if (swing.mode !== 'attack') errors.push(`keys: F gave mode ${swing.mode}, not a swing`);
    if (swing.spent !== 5) errors.push(`keys: F spent ${swing.spent} stamina, not the swing's 5`);
    await new Promise((r) => setTimeout(r, 600)); // the swing ends

    const look = await page.evaluate(() => {
      const k = window.__keys;
      const g = window.__game;
      g.orbitCam.setView(1, 0.38, 6);
      const r = { a: g.orbitCam.getView() };
      // ← turns the view left (yaw grows, as the mouse moved left does) and stops on letting go
      r.left = k.hold('ArrowLeft', 1.0);
      r.still = k.run(0.6);
      r.right = k.hold('ArrowRight', 0.5);
      // a tap nudges: one slice down, then let go
      k.down('ArrowLeft');
      k.run(0.05);
      k.up('ArrowLeft');
      r.tap = k.run(0.6);
      // ...even let go before any step has seen it (a quick tap between slow frames)
      k.down('ArrowLeft');
      k.up('ArrowLeft');
      r.blink = k.run(0.6);
      // − known by its character alone (no key code — another layout, a synthetic key)
      const char = (type) => window.dispatchEvent(new KeyboardEvent(type, { key: '-', bubbles: true, cancelable: true }));
      char('keydown');
      k.run(0.3);
      char('keyup');
      r.byChar = k.run(0.6);
      g.orbitCam.setView(r.byChar.yaw, 0.38, 6);
      // ↑ looks up (the eye drops), ↓ looks down, both held in bounds
      r.up = k.hold('ArrowUp', 1.5);
      r.down = k.hold('ArrowDown', 2.5);
      // − draws the eye back to its farthest, = near to its nearest
      r.far = k.hold('Minus', 1.2);
      r.near = k.hold('Equal', 1.5);
      return r;
    });
    const turned = look.left.yaw - look.a.yaw;
    const tapped = look.tap.yaw - look.right.yaw;
    console.log(
      `← 1s turned ${turned.toFixed(3)} rad, then ${(look.still.yaw - look.left.yaw).toFixed(4)}; → 0.5s ${(look.right.yaw - look.still.yaw).toFixed(3)};`,
      `a tap ${tapped.toFixed(3)}, a blink ${(look.blink.yaw - look.tap.yaw).toFixed(3)}, − by character ${look.byChar.dist.toFixed(2)}; pitch ↑ ${look.up.pitch.toFixed(2)} ↓ ${look.down.pitch.toFixed(2)}; zoom − ${look.far.dist} = ${look.near.dist}`
    );
    if (!look.left.taken) errors.push('keys: an arrow did not stop the showcase orbit');
    if (Math.abs(turned - 2.2) > 0.1) errors.push(`keys: ← held 1s turned ${turned.toFixed(2)} rad (want 2.2 at the Steady feel)`);
    if (look.still.yaw !== look.left.yaw) errors.push('keys: the view kept turning after ← was let go');
    if (!(look.right.yaw < look.still.yaw - 0.9)) errors.push('keys: → held 0.5s did not turn the view back ~1.1 rad');
    if (!(tapped > 0.01 && tapped < 0.2)) errors.push(`keys: a tap of ← turned ${tapped.toFixed(3)} rad, not a small nudge`);
    const blinked = look.blink.yaw - look.tap.yaw;
    if (!(blinked > 0.01 && blinked < 0.2)) errors.push(`keys: a tap let go before any frame turned ${blinked.toFixed(3)} rad, not a small nudge`);
    if (!(look.byChar.dist > 7)) errors.push(`keys: a − with no key code left the eye at ${look.byChar.dist.toFixed(2)}, not drawn back`);
    if (Math.abs(look.up.pitch - -0.08) > 1e-6) errors.push(`keys: ↑ held left pitch at ${look.up.pitch.toFixed(2)}, not its floor -0.08`);
    if (Math.abs(look.down.pitch - 1.2) > 1e-6) errors.push(`keys: ↓ held left pitch at ${look.down.pitch.toFixed(2)}, not its ceiling 1.2`);
    if (look.far.dist !== 10) errors.push(`keys: − held left the eye at ${look.far.dist.toFixed(2)}, not 10`);
    if (look.near.dist !== 3) errors.push(`keys: = held left the eye at ${look.near.dist.toFixed(2)}, not 3`);

    // a touchpad's glide is many small wheel turns: it zooms by how far, not
    // a full step per turn; its pinch (a wheel with Ctrl) zooms the eye, not the page
    const wheel = await page.evaluate(() => {
      const g = window.__game;
      g.orbitCam.setView(g.orbitCam.getView().yaw, 0.38, 6);
      const canvas = g.renderer.domElement;
      for (let i = 0; i < 10; i++) canvas.dispatchEvent(new WheelEvent('wheel', { deltaY: 4, bubbles: true, cancelable: true }));
      const glide = g.orbitCam.getView().dist;
      const notch = new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true });
      canvas.dispatchEvent(notch);
      const afterNotch = g.orbitCam.getView().dist;
      const pinch = new WheelEvent('wheel', { deltaY: -20, ctrlKey: true, bubbles: true, cancelable: true });
      canvas.dispatchEvent(pinch);
      return { glide, afterNotch, pinched: g.orbitCam.getView().dist, pagePrevented: pinch.defaultPrevented, notchPrevented: notch.defaultPrevented };
    });
    console.log('wheel:', JSON.stringify(wheel));
    if (Math.abs(wheel.glide - 6.28) > 0.01) errors.push(`keys: ten small wheel turns zoomed to ${wheel.glide.toFixed(2)} (want 6.28)`);
    if (Math.abs(wheel.afterNotch - wheel.glide - 0.7) > 0.01) errors.push('keys: a mouse notch no longer zooms one 0.7 step');
    if (!(wheel.pinched < wheel.afterNotch - 0.3)) errors.push('keys: a pinch did not draw the eye near');
    if (!wheel.pagePrevented) errors.push('keys: a pinch was left to zoom the page');
    if (wheel.notchPrevented) errors.push('keys: a plain wheel turn was swallowed');

    // W with → held walks a curve: the walk follows the turning eye. From the
    // spawn, looking -z (away from the fire), a straight start, then → as well
    const curve = await page.evaluate(() => {
      const g = window.__game;
      const k = window.__keys;
      g.player.respawn(-5, 4);
      g.orbitCam.setView(0, 0.38, 6);
      const where = () => ({ f: g.player.facing, x: g.player.pos.x, z: g.player.pos.z });
      k.down('KeyW');
      k.run(0.5, true);
      const from = where();
      k.down('ArrowRight');
      k.run(0.9, true);
      k.up('ArrowRight');
      const to = where();
      k.up('KeyW');
      k.run(0.6, true);
      return { from, to };
    });
    let swung = (curve.to.f - curve.from.f) % (Math.PI * 2);
    if (swung > Math.PI) swung -= Math.PI * 2;
    if (swung < -Math.PI) swung += Math.PI * 2;
    const walked = Math.hypot(curve.to.x - curve.from.x, curve.to.z - curve.from.z);
    console.log(`W + →: walked ${walked.toFixed(2)}, facing turned ${swung.toFixed(2)} rad`);
    if (walked < 2) errors.push(`keys: W + → walked only ${walked.toFixed(2)}`);
    if (swung > -1.2 || swung < -2.4) errors.push(`keys: W + → turned him ${swung.toFixed(2)} rad — the walk did not follow the eye round to the right`);

    // a panel opened mid-turn stops the eye dead, and under it the arrows are the panel's
    const panel = await page.evaluate(() => {
      const g = window.__game;
      const k = window.__keys;
      k.down('ArrowLeft');
      k.run(0.3);
      g.openPanel('guide');
      const opened = g.orbitCam.getView().yaw;
      k.run(0.6); // held on under the parchment
      k.up('ArrowLeft');
      k.down('ArrowLeft'); // pressed afresh under it
      const after = k.run(0.6).yaw;
      k.up('ArrowLeft');
      return { opened, after };
    });
    if (panel.after !== panel.opened) errors.push(`keys: the view turned ${(panel.after - panel.opened).toFixed(3)} rad under an open panel`);
    const charter = await page.evaluate(() => document.body.innerText);
    if (!/left click or F/.test(charter) || !/arrows turn the eye/.test(charter)) errors.push('keys: the Charter does not list F and the arrows');
    await page.keyboard.press('Escape');
  } else if (scenario === 'body') {
    // The Living Body: weight, knees and feet. Each check drives player.update
    // by hand at a fixed step inside one evaluate, so its numbers don't hang on
    // the software renderer's frame rate. Checks pause 350ms apart: two presses
    // of a movement key within 250ms are read as a dodge-roll.
    const pause = () => new Promise((r) => setTimeout(r, 350));
    await page.evaluate(() => {
      const g = window.__game;
      const p = g.player;
      const DT = 1 / 60;
      window.__body = {
        key: (code, down) => window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { code })),
        // yaw 0 heads toward -z; (-2, -9) opens onto clear meadow that way
        run: (seconds, yaw = 0) => {
          for (let i = 0; i < Math.round(seconds / DT); i++) p.update(DT, yaw, g.colliders);
        },
        speed: () => Math.hypot(p.vel.x, p.vel.y),
        stand: (x, z) => {
          p.respawn(x, z);
          p.update(DT, 0, g.colliders);
        },
        knee: () => p.mesh.legs[0].shin.rotation.x,
      };
    });

    // 1) weight: speed is gathered and shed, not handed over
    const weight = await page.evaluate(() => {
      const b = window.__body;
      b.stand(-2, -9);
      b.key('KeyW', true);
      b.key('ShiftLeft', true);
      b.run(0.1);
      const early = b.speed();
      b.run(1.0);
      const top = b.speed();
      b.key('KeyW', false);
      b.key('ShiftLeft', false);
      b.run(0.1);
      const sliding = b.speed();
      b.run(0.4);
      return { early, top, sliding, stopped: b.speed() };
    });
    console.log('weight:', JSON.stringify(weight));
    if (!(weight.early > 1 && weight.early < 4)) errors.push(`body: 0.1s into a sprint he does ${weight.early.toFixed(2)}, expected a wind-up`);
    if (weight.top < 6) errors.push(`body: sprint topped out at ${weight.top.toFixed(2)}`);
    if (!(weight.sliding > 1.5 && weight.sliding < weight.top)) errors.push(`body: 0.1s after letting go he does ${weight.sliding.toFixed(2)}, expected a slide`);
    if (weight.stopped > 0.05) errors.push(`body: still sliding (${weight.stopped.toFixed(2)}) half a second after letting go`);
    await pause();

    // 1b) the legs' toll: walking wears on the stamina pool, a sprint the more
    const toll = await page.evaluate(() => {
      const b = window.__body;
      const g = window.__game;
      const p = g.player;
      const st = () => g.getState().stamina;
      const ST = g.CONFIG.stamina;
      b.stand(-2, -9);
      p.fatigue = 0;
      st().current = 100;
      b.run(1.0); // standing costs nothing
      const idle = st().current;
      b.key('KeyW', true);
      b.run(8);
      const walked = idle - st().current;
      b.key('ShiftLeft', true);
      p.fatigue = 0;
      const before = st().current;
      b.run(4);
      const sprinted = before - st().current;
      b.key('ShiftLeft', false);
      b.key('KeyW', false);
      b.run(0.6);
      st().current = 240;
      return { idle, walked, sprinted, end: st().current, walkDrain: ST.walkDrain, sprintDrain: ST.sprintDrain };
    });
    console.log('toll:', JSON.stringify(toll));
    if (toll.idle !== 100) errors.push(`body: standing still drained stamina (${toll.idle})`);
    if (Math.abs(toll.walked - toll.walkDrain * 8) > 1) errors.push(`body: 8s of walking drained ${toll.walked}, expected ~${toll.walkDrain * 8}`);
    if (Math.abs(toll.sprinted - toll.sprintDrain * 4) > 1) errors.push(`body: 4s of sprinting drained ${toll.sprinted}, expected ~${toll.sprintDrain * 4}`);
    await pause();

    // 2) knees: nearly straight standing, folded in a crouch — with the sole still planted
    const knees = await page.evaluate(() => {
      const b = window.__body;
      const p = window.__game.player;
      b.stand(-2, -9);
      b.run(0.5);
      const standing = b.knee();
      b.key('KeyC', true);
      b.run(0.6);
      const crouched = b.knee();
      const ankle = p.mesh.legs[0].foot.getWorldPosition(p.pos.clone()).y - p.pos.y;
      b.key('KeyC', false);
      b.run(0.5);
      return { standing, crouched, ankle };
    });
    console.log('knees:', JSON.stringify(knees));
    if (knees.standing > 0.6) errors.push(`body: standing knee bent ${knees.standing.toFixed(2)} rad`);
    if (knees.crouched < 1.2) errors.push(`body: crouched knee only bent ${knees.crouched.toFixed(2)} rad`);
    if (Math.abs(knees.ankle - 0.035) > 0.05) errors.push(`body: crouching lifted the foot (ankle at ${knees.ankle.toFixed(3)})`);

    // 3) the leap: the knees load, the arc is the old arc, the landing folds the knees
    const leap = await page.evaluate(() => {
      const b = window.__body;
      const g = window.__game;
      const p = g.player;
      b.stand(-2, -9);
      b.run(0.3);
      const y0 = p.pos.y;
      b.key('Space', true);
      let t = 0;
      let left = -1;
      let peak = 0;
      while (t < 2) {
        p.update(1 / 60, 0, g.colliders);
        t += 1 / 60;
        if (p.airborne) {
          if (left < 0) left = t;
          peak = Math.max(peak, p.pos.y - y0);
        } else if (left >= 0) break;
      }
      b.key('Space', false);
      b.run(0.07);
      const landing = b.knee();
      b.run(0.8);
      return { left, peak, air: t - left, landing, after: b.knee() };
    });
    console.log('leap:', JSON.stringify(leap));
    if (!(leap.left > 0.05 && leap.left < 0.2)) errors.push(`body: the leap left the ground after ${leap.left.toFixed(3)}s, expected a short wind-up`);
    if (!(leap.peak > 0.7 && leap.peak < 0.95)) errors.push(`body: leap peaked at ${leap.peak.toFixed(2)}, expected ~0.8`);
    if (leap.landing < leap.after + 0.3) errors.push(`body: landing did not fold the knees (${leap.landing.toFixed(2)} vs ${leap.after.toFixed(2)} at rest)`);
    await pause();

    // 4) a wall takes the speed: run at the hovel's shut door and stand against it
    const wall = await page.evaluate(() => {
      const b = window.__body;
      const p = window.__game.player;
      b.stand(-5.5, 1.48);
      b.key('KeyW', true);
      b.run(1.0, Math.PI / 2); // yaw π/2 heads toward -x
      const out = { speed: b.speed(), x: p.pos.x };
      b.key('KeyW', false);
      return out;
    });
    console.log('wall:', JSON.stringify(wall));
    if (wall.speed > 0.6) errors.push(`body: still doing ${wall.speed.toFixed(2)} against a wall`);
    if (Math.abs(wall.x + 6.95) > 0.06) errors.push(`body: the wall left him at x ${wall.x.toFixed(2)}`);
    await pause();

    // 5) the roll: same reach as ever, safe throughout, and he ends upright
    const roll = await page.evaluate(() => {
      const b = window.__body;
      const g = window.__game;
      const p = g.player;
      b.stand(-2, -9);
      b.run(0.2);
      const z0 = p.pos.z;
      for (const down of [true, false, true, false]) b.key('KeyW', down); // the double-tap
      p.update(1 / 60, 0, g.colliders);
      const out = { mode: p.mode, safe: p.invulnerable };
      let t = 0;
      while (p.mode === 'roll' && t < 2) {
        p.update(1 / 60, 0, g.colliders);
        t += 1 / 60;
      }
      out.reach = Math.abs(p.pos.z - z0);
      b.run(0.8);
      out.tilt = Math.abs(Math.sin(p.mesh.roller.rotation.x / 2)); // 0 when upright, whole turns ignored
      out.safeAfter = p.invulnerable;
      return out;
    });
    console.log('roll:', JSON.stringify(roll));
    if (roll.mode !== 'roll' || !roll.safe) errors.push(`body: double-tap gave mode ${roll.mode}, invulnerable ${roll.safe}`);
    if (!(roll.reach > 3.6 && roll.reach < 4.6)) errors.push(`body: roll carried ${roll.reach.toFixed(2)}, expected ~4.05`);
    if (roll.tilt > 0.15) errors.push(`body: he did not come back upright out of the roll (${roll.tilt.toFixed(2)})`);
    if (roll.safeAfter) errors.push('body: still invulnerable after the roll');
    await pause();

    // 6) feet: at a run, the ground must not slide away under a planted foot.
    // The ball of each foot is followed; "planted" is within a hair of the
    // ground's plane under him (0.055 is the sole below the ankle, 0.11 the
    // ball ahead of it — RIG.ball in playerMesh.js).
    const feet = await page.evaluate(() => {
      const b = window.__body;
      const g = window.__game;
      const p = g.player;
      b.stand(-2, -9);
      b.key('KeyW', true);
      b.run(0.8);
      const ballOf = (i) => {
        const f = p.mesh.legs[i].foot;
        f.updateWorldMatrix(true, false);
        return p.pos.clone().set(0, -0.055, 0.11).applyMatrix4(f.matrixWorld);
      };
      const lifted = (at) => at.y - (p.pos.y + p.slope.x * (at.x - p.pos.x) + p.slope.z * (at.z - p.pos.z));
      let slid = 0;
      let covered = 0;
      const was = [ballOf(0), ballOf(1)];
      const wasLifted = was.map(lifted);
      for (let i = 0; i < 240; i++) {
        const px = p.pos.x;
        const pz = p.pos.z;
        p.update(1 / 240, 0, g.colliders);
        const moved = Math.hypot(p.pos.x - px, p.pos.z - pz);
        for (let f = 0; f < 2; f++) {
          const now = ballOf(f);
          const up = lifted(now);
          if (up < 0.012 && wasLifted[f] < 0.012) {
            slid += Math.hypot(now.x - was[f].x, now.z - was[f].z);
            covered += moved;
          }
          was[f] = now;
          wasLifted[f] = up;
        }
      }
      b.key('KeyW', false);
      // and nothing in the rig has gone to NaN after all of the above
      let sound = true;
      p.mesh.group.traverse((o) => {
        if (![o.rotation.x, o.rotation.y, o.rotation.z, o.position.x, o.position.y, o.position.z].every(Number.isFinite)) sound = false;
      });
      return { skate: slid / Math.max(covered, 1e-6), covered, sound };
    });
    console.log('feet:', JSON.stringify(feet));
    if (feet.covered < 0.5) errors.push('body: no foot was ever planted during the run');
    if (feet.skate > 0.25) errors.push(`body: planted feet skate ${(feet.skate * 100).toFixed(0)}% of the ground covered`);
    if (!feet.sound) errors.push('body: a joint went non-finite');

    // 7) feet are heard: a run reports each footfall, standing reports none, a leap reports one landing
    const heard = await page.evaluate(() => {
      const b = window.__body;
      const p = window.__game.player;
      const stepWas = p.onFootstep;
      const landWas = p.onLand;
      const steps = [];
      const lands = [];
      p.onFootstep = (w) => steps.push(w);
      p.onLand = (v) => lands.push(v);
      b.stand(-2, -9);
      b.run(1.0);
      const standing = steps.length;
      b.key('KeyA', true);
      b.run(0.5);
      steps.length = 0;
      b.run(2.0);
      const running = steps.length;
      const weights = [Math.min(...steps), Math.max(...steps)];
      b.key('KeyA', false);
      b.run(0.6);
      steps.length = 0;
      b.key('Space', true);
      b.run(1.0);
      b.key('Space', false);
      p.onFootstep = stepWas;
      p.onLand = landWas;
      return { standing, running, weights, inAir: steps.length, lands };
    });
    console.log('heard:', JSON.stringify(heard));
    if (heard.standing !== 0) errors.push(`body: ${heard.standing} footfalls while standing still`);
    if (!(heard.running >= 6 && heard.running <= 10)) errors.push(`body: ${heard.running} footfalls in 2s of running, expected ~8`);
    if (!(heard.weights[0] > 0 && heard.weights[1] <= 1)) errors.push(`body: footfall weights ${heard.weights} out of range`);
    if (heard.lands.length !== 1 || !(heard.lands[0] > 3)) errors.push(`body: landings heard ${JSON.stringify(heard.lands)}, expected one hard one`);
    await pause();

    // 8) the swings chain: chop, backhand, sweep, round again — and a pause starts over.
    // Each one still counts its hit (the dummy is out of reach here, so stamina tells).
    const chain = await page.evaluate(() => {
      const b = window.__body;
      const g = window.__game;
      const p = g.player;
      b.stand(-2, -9);
      const before = g.getState().stamina.current;
      const kinds = [];
      for (let i = 0; i < 4; i++) {
        p.attack();
        kinds.push(p.swing);
        b.run(0.45);
      }
      b.run(1.2); // the chain goes cold
      p.attack();
      kinds.push(p.swing);
      b.run(0.6);
      return { kinds, spent: before - g.getState().stamina.current, mode: p.mode };
    });
    console.log('chain:', JSON.stringify(chain));
    if (chain.kinds.join() !== '0,1,2,0,0') errors.push(`body: swings ran ${chain.kinds.join()}, expected 0,1,2,0 then 0 after a pause`);
    if (chain.spent !== 25) errors.push(`body: five swings spent ${chain.spent} stamina, expected 25`);
    if (chain.mode !== 'normal') errors.push(`body: left in mode ${chain.mode} after the swings`);

    // mid-stride, side-on, for eyeballing
    await page.evaluate(() => {
      window.__body.stand(-2, -9);
      window.__game.orbitCam.setView(Math.PI / 2, 0.12, 3.4);
    });
    await pause();
    await page.keyboard.down('KeyW');
    await new Promise((r) => setTimeout(r, 900));
    await page.screenshot({ path: 'scripts/smoke-body.png' });
    await page.keyboard.up('KeyW');
  } else if (scenario === 'hearth') {
    // By the fire: stood still near it for sitDelay he sits to warm himself;
    // any key, a click or a bite gets him up. Stepped by hand at a fixed rate,
    // like `body`, so the numbers don't hang on the renderer's frame rate.
    await page.evaluate(() => {
      const g = window.__game;
      const p = g.player;
      const DT = 1 / 60;
      const fire = { x: -4.6, z: 6.2 }; // LAYOUT.campfire
      window.__hearth = {
        key: (code, down) => window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { code })),
        run: (seconds) => {
          for (let i = 0; i < Math.round(seconds / DT); i++) p.update(DT, 0, g.colliders);
        },
        stand: (x, z) => {
          p.respawn(x, z);
          p.update(DT, 0, g.colliders);
        },
        fireDist: () => Math.hypot(p.pos.x - fire.x, p.pos.z - fire.z),
        // how far he faces from the fire, radians
        offFire: () => {
          let d = Math.abs(Math.atan2(fire.x - p.pos.x, fire.z - p.pos.z) - p.facing) % (Math.PI * 2);
          return d > Math.PI ? Math.PI * 2 - d : d;
        },
        speed: () => Math.hypot(p.vel.x, p.vel.y),
      };
    });
    const pause = () => new Promise((r) => setTimeout(r, 350));

    // 1) stood still near the fire: nothing at first, sat after the delay
    const sat = await page.evaluate(() => {
      const h = window.__hearth;
      const p = window.__game.player;
      h.stand(-3.0, 6.9); // ~1.75 from the fire's middle, his back half to it
      h.run(1.5);
      const early = p.mode;
      h.run(0.7);
      const after = p.mode;
      h.run(1.2);
      return {
        early, after, sit01: p.sit01,
        waist: p.mesh.roller.position.y,
        knee: p.mesh.legs[0].shin.rotation.x,
        offFire: h.offFire(), dist: h.fireDist(),
        stick: p.mesh.weapon.parent === p.mesh.slot, // still in the fist?
        laid: (() => {
          // laid down: shown, on the ground at his side, lying flat
          const w = p.mesh.weapon;
          const at = w.getWorldPosition(new w.position.constructor());
          const up = new w.position.constructor(0, 1, 0).transformDirection(w.matrixWorld);
          return {
            shown: w.visible && w.parent.visible,
            off: Math.hypot(at.x - p.pos.x, at.z - p.pos.z),
            height: at.y - p.pos.y, // the ground by the fire is near level
            tilt: Math.abs(up.y),
          };
        })(),
      };
    });
    console.log('sat:', JSON.stringify(sat));
    if (sat.early !== 'normal') errors.push(`hearth: sat down after only 1.5s (${sat.early})`);
    if (sat.after !== 'sit') errors.push(`hearth: still ${sat.after} after 2.2s by the fire`);
    if (sat.sit01 < 0.99) errors.push(`hearth: only ${sat.sit01.toFixed(2)} of the way down`);
    if (sat.waist > 0.3) errors.push(`hearth: waist ${sat.waist.toFixed(2)} high — not sat on the ground`);
    if (sat.knee < 1.4) errors.push(`hearth: knee bent ${sat.knee.toFixed(2)}, expected knees drawn up`);
    if (sat.offFire > 0.15) errors.push(`hearth: facing ${sat.offFire.toFixed(2)} rad off the fire`);
    if (sat.stick) errors.push('hearth: still holding the stick while sat');
    if (!sat.laid.shown) errors.push('hearth: the stick vanished instead of being laid down');
    if (sat.laid.off > 0.8) errors.push(`hearth: stick laid ${sat.laid.off.toFixed(2)} away, not beside him`);
    if (sat.laid.height < -0.1 || sat.laid.height > 0.2) errors.push(`hearth: stick ${sat.laid.height.toFixed(2)} above the ground`);
    if (sat.laid.tilt > 0.1) errors.push(`hearth: stick not lying flat (tilt ${sat.laid.tilt.toFixed(2)})`);

    // 2) eyeball him sat there, side-on, the fire in shot
    await page.evaluate(() => window.__game.orbitCam.setView(-0.5, 0.18, 3.6));
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: 'scripts/smoke-hearth.png' });

    // 3) W gets him up — slowly at first, then he walks on
    const rose = await page.evaluate(() => {
      const h = window.__hearth;
      const p = window.__game.player;
      h.key('KeyW', true);
      h.run(0.1);
      const mode = p.mode;
      const rising = h.speed();
      h.run(0.6);
      const walking = h.speed();
      h.key('KeyW', false);
      h.run(0.5);
      return { mode, rising, walking, sit01: p.sit01, stick: p.mesh.weapon.visible && p.mesh.weapon.parent === p.mesh.slot };
    });
    console.log('rose:', JSON.stringify(rose));
    if (rose.mode !== 'normal') errors.push(`hearth: W left him ${rose.mode}`);
    if (rose.rising > 1) errors.push(`hearth: ${rose.rising.toFixed(2)} pace while still getting up`);
    if (rose.walking < 3) errors.push(`hearth: only ${rose.walking.toFixed(2)} pace once up`);
    if (rose.sit01 !== 0) errors.push(`hearth: sit01 ${rose.sit01} once up and walking`);
    if (!rose.stick) errors.push('hearth: stick not back in hand');
    await pause();

    // 4) the spawn (2.2 away) is not near enough; too close he shuffles back;
    // a click and a bite both get him up, the click without a swing
    const rest = await page.evaluate(() => {
      const h = window.__hearth;
      const g = window.__game;
      const p = g.player;
      h.stand(-5, 4);
      h.run(3);
      const atSpawn = p.mode;
      h.stand(-4.6, 7.3); // 1.1 out, at the ring's edge
      h.run(3.2);
      const closeMode = p.mode;
      const closeDist = h.fireDist();
      const stamina = g.getState().stamina.current;
      p.attack();
      const clicked = p.mode;
      const spent = stamina - g.getState().stamina.current;
      h.run(3.2);
      const again = p.mode;
      p.takeDamage(1, p.pos.x + 1, p.pos.z);
      return { atSpawn, closeMode, closeDist, clicked, spent, again, bitten: p.mode };
    });
    console.log('rest:', JSON.stringify(rest));
    if (rest.atSpawn !== 'normal') errors.push(`hearth: sat down at the spawn (${rest.atSpawn})`);
    if (rest.closeMode !== 'sit') errors.push(`hearth: did not sit at the ring's edge (${rest.closeMode})`);
    if (rest.closeDist < 1.4) errors.push(`hearth: sat ${rest.closeDist.toFixed(2)} from the flames, expected a shuffle back`);
    if (rest.clicked !== 'normal' || rest.spent !== 0) errors.push(`hearth: click left him ${rest.clicked}, spent ${rest.spent}`);
    if (rest.again !== 'sit') errors.push('hearth: did not sit again after standing');
    if (rest.bitten !== 'normal') errors.push(`hearth: a bite left him ${rest.bitten}`);
  } else if (scenario === 'house') {
    // 1) closed door bars the gap: stand in the doorway, get pushed back out
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = -7.33; // doorway gap (door collider spans x -7.42..-7.3)
      g.player.pos.z = 1.48;
    });
    await new Promise((r) => setTimeout(r, 300));
    const barred = await page.evaluate(() => window.__game.player.pos.x);
    console.log(`closed door: pushed to x=${barred.toFixed(2)}`);
    if (barred < -6.96) errors.push(`house: closed door let the player stand in the gap (x ${barred.toFixed(2)})`);

    // 2) open it with the real interact key, then stand in the gap freely
    await page.keyboard.press('KeyE'); // pushed-out spot is still within door radius
    await new Promise((r) => setTimeout(r, 200));
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = -7.33;
      g.player.pos.z = 1.48;
    });
    await new Promise((r) => setTimeout(r, 300));
    const open = await page.evaluate(() => ({ x: window.__game.player.pos.x, open: window.__game.door.isOpen }));
    console.log(`open door: ${JSON.stringify(open)}`);
    if (!open.open) errors.push('house: E near the door did not open it');
    if (Math.abs(open.x + 7.33) > 0.05) errors.push(`house: open doorway still pushed the player (x ${open.x.toFixed(2)})`);

    // 2b) the peg rack by the door holds every weapon not in hand: E opens
    //     it; with the cudgel and quarterstaff owned, all three are listed;
    //     "Hang up" empties the hands (no swing, no stamina) and puts the stick
    //     on its pegs beside the others, saved; "Take up" puts one in hand
    await page.evaluate(() => {
      const g = window.__game;
      g.getState().shop.owned.push('cudgel', 'quarterstaff'); // so the rack has all three to hold
      g.player.pos.x = -7.95; // local (1.05, 0.3): the floor before the rack
      g.player.pos.z = 2.3;
    });
    await page.waitForFunction(() => document.getElementById('interact-prompt').textContent.includes('weapon rack'), { timeout: 4000 }).catch(() => {});
    const rackPrompt = await page.evaluate(() => document.getElementById('interact-prompt').textContent);
    console.log(`rack prompt: ${rackPrompt}`);
    if (!rackPrompt.includes('the weapon rack')) errors.push(`house: the rack was not offered ("${rackPrompt}")`);
    await page.keyboard.press('KeyE');
    await new Promise((r) => setTimeout(r, 300));
    const rackPanel = await page.evaluate(() => ({
      open: !document.getElementById('rack-panel').classList.contains('hidden'),
      rows: document.querySelectorAll('#rack-body .deed').length,
      takeUp: document.querySelectorAll('#rack-body [data-wield]').length,
    }));
    console.log(`rack panel: ${JSON.stringify(rackPanel)}`);
    if (!rackPanel.open || rackPanel.rows !== 3 || rackPanel.takeUp !== 2) errors.push(`house: the rack panel -> ${JSON.stringify(rackPanel)}`);
    await page.click('#rack-body [data-hang]');
    await new Promise((r) => setTimeout(r, 200));
    const allUp = await page.evaluate(() => document.querySelectorAll('#rack-body [data-wield]').length);
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));
    const before = await page.evaluate(() => window.__game.getState().stamina.current);
    await page.keyboard.press('KeyF');
    await new Promise((r) => setTimeout(r, 300));
    const hung = await page.evaluate(() => {
      const g = window.__game;
      const saved = JSON.parse(localStorage.getItem('crownbound_save'));
      return { unarmed: g.player.unarmed, saved: !!saved.chest.hungUp, mode: g.player.mode, stamina: g.getState().stamina.current };
    });
    console.log(`hung up: ${JSON.stringify({ allUp, ...hung })}`);
    if (allUp !== 3) errors.push(`house: with all hung up, ${allUp} of 3 offered to take up`);
    if (!hung.unarmed || !hung.saved) errors.push(`house: "Hang up" did not empty his hands (${JSON.stringify(hung)})`);
    if (hung.mode === 'attack' || hung.stamina !== before) errors.push(`house: empty hands still swung (${JSON.stringify(hung)})`);
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = -8.4; // stood off to the side, so the rack is in view past him
      g.player.pos.z = 1.75;
      g.player.facing = 0.6;
      g.orbitCam.setView(Math.PI + 0.75, 0.25, 3);
    });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: 'scripts/smoke-rack.png' });
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = -7.95;
      g.player.pos.z = 2.3;
    });
    await page.waitForFunction(() => document.getElementById('interact-prompt').textContent.includes('weapon rack'), { timeout: 4000 }).catch(() => {});
    await page.keyboard.press('KeyE');
    await new Promise((r) => setTimeout(r, 300));
    await page.click('#rack-body [data-wield="cudgel"]');
    await new Promise((r) => setTimeout(r, 200));
    const down = await page.evaluate(() => ({
      unarmed: window.__game.player.unarmed,
      saved: !!JSON.parse(localStorage.getItem('crownbound_save')).chest.hungUp,
      wielded: window.__game.getState().chest.wielded,
      damage: window.__game.player.attackDamage,
    }));
    console.log(`taken down: ${JSON.stringify(down)}`);
    if (down.unarmed || down.saved || down.wielded !== 'cudgel' || down.damage !== 2) errors.push(`house: "Take up" the cudgel -> ${JSON.stringify(down)}`);
    await page.click('#rack-body [data-wield="stick"]'); // the stick back in hand for what follows
    await new Promise((r) => setTimeout(r, 200));
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));


    //    middle can't be reached, so this once never offered sleep at all);
    //    tuck-in animation plays, wounds mend, the night is marked, you stand
    //    up by the cot
    await page.evaluate(() => {
      const g = window.__game;
      g.player.takeDamage(9, 0, 0);
      g.player.pos.x = -9.2; // local (-0.2, -0.4): the open floor at the cot's corner
      g.player.pos.z = 1.6;
    });
    let cotPrompt = '';
    for (let i = 0; i < 30 && !cotPrompt.includes('straw cot'); i++) {
      await new Promise((r) => setTimeout(r, 100));
      cotPrompt = await page.evaluate(() => document.getElementById('interact-prompt').textContent);
    }
    console.log('cot prompt:', JSON.stringify(cotPrompt));
    if (!cotPrompt.includes('straw cot')) errors.push(`house: cot prompt "${cotPrompt}"`);
    await page.keyboard.press('KeyE');
    // mid-nap: poll until he lies flat — the eased pose runs on frame dt, which
    // lags wall-clock under the software renderer, so a fixed delay is flaky
    let nap = { mode: '?', lying: 0 };
    for (let i = 0; i < 22 && nap.lying > -1.4; i++) {
      await new Promise((r) => setTimeout(r, 100));
      nap = await page.evaluate(() => ({
        mode: window.__game.player.mode,
        lying: window.__game.player.mesh.roller.rotation.x,
      }));
      if (nap.mode !== 'sleep') break; // respawned without ever lying down
    }
    await page.screenshot({ path: 'scripts/smoke-sleep.png' });
    console.log('mid-nap:', JSON.stringify(nap));
    if (nap.mode !== 'sleep') errors.push(`house: mid-nap mode ${nap.mode} != sleep`);
    if (nap.lying > -1.4) errors.push(`house: never lay down (roller.x ${nap.lying.toFixed(2)})`);
    await new Promise((r) => setTimeout(r, 2300));
    const slept = await page.evaluate(() => ({
      hp: window.__game.player.hp,
      retired: window.__game.getState().sleep.retiredAt,
      x: window.__game.player.pos.x,
      z: window.__game.player.pos.z,
    }));
    console.log('after sleep:', JSON.stringify(slept));
    if (slept.hp !== 20) errors.push(`house: sleep left hp at ${slept.hp}`);
    if (!slept.retired) errors.push('house: bedtime not recorded');
    if (Math.hypot(slept.x + 9.3, slept.z - 1.4) > 1.0)
      errors.push(`house: woke at ${slept.x.toFixed(1)},${slept.z.toFixed(1)} not by the cot`);

    // 4) the dawn rules, judged against fixed clocks (pure function)
    const verdicts = await page.evaluate(() => {
      const ev = window.__game.evaluateSleep;
      const bed = new Date(2026, 5, 11, 23, 0).toISOString(); // 11pm
      return {
        goodDawn: ev(bed, new Date(2026, 5, 12, 7, 30)), // 8.5h, up at 7:30
        lateRise: ev(bed, new Date(2026, 5, 12, 9, 0)), // 10h, but 9:00
        shortNight: ev(bed, new Date(2026, 5, 12, 3, 0)), // only 4h so far
        forgotten: ev(bed, new Date(2026, 5, 13, 7, 0)), // 32h ago
        noBed: ev(null, new Date()),
      };
    });
    console.log('verdicts:', JSON.stringify(verdicts));
    if (verdicts.goodDawn !== 'reward') errors.push(`house: good dawn -> ${verdicts.goodDawn}`);
    if (verdicts.lateRise !== 'late') errors.push(`house: late rise -> ${verdicts.lateRise}`);
    if (verdicts.shortNight !== 'pending') errors.push(`house: short night -> ${verdicts.shortNight}`);
    if (verdicts.forgotten !== 'stale') errors.push(`house: forgotten bedtime -> ${verdicts.forgotten}`);
    if (verdicts.noBed !== 'none') errors.push(`house: no bedtime -> ${verdicts.noBed}`);

    // 5) the Well-Rested boon: once per day, +coins +wis xp +stamina headroom
    const boon = await page.evaluate(() => {
      const g = window.__game;
      const before = g.getState();
      const b = { coins: before.coins, wisXp: before.stats.wis.xp, stamina: before.stamina.current };
      const granted = g.applySleepReward();
      const again = g.applySleepReward();
      const st = g.getState();
      return {
        granted,
        again,
        dCoins: st.coins - b.coins,
        dWis: st.stats.wis.xp - b.wisXp,
        stamina: st.stamina.current,
        histType: st.history[st.history.length - 1].type,
        rested: st.sleep.wellRestedDate,
      };
    });
    console.log('boon:', JSON.stringify(boon));
    if (!boon.granted) errors.push('house: boon refused on first grant');
    if (boon.again) errors.push('house: boon granted twice in one day');
    if (boon.dCoins !== 10) errors.push(`house: boon coins ${boon.dCoins} != 10`);
    if (boon.dWis !== 10) errors.push(`house: boon wis xp ${boon.dWis} != 10`);
    if (boon.stamina !== 280) errors.push(`house: stamina ${boon.stamina} != 280 (240 + rested cap)`);
    if (boon.histType !== 'sleep') errors.push(`house: history type ${boon.histType} != sleep`);
    if (!boon.rested) errors.push('house: wellRestedDate not set');

    // 6) the ledger: a bedtime from 8h ago gets judged on load and lands in
    //    the log (verdict depends on the wall clock, but it always lands)
    const imported = await page.evaluate(() => {
      const g = window.__game;
      const copy = JSON.parse(g.exportSave());
      copy.sleep.retiredAt = new Date(Date.now() - 8 * 3600e3).toISOString();
      copy.sleep.lastRewardDate = null;
      copy.sleep.log = [];
      return g.importSave(JSON.stringify(copy));
    });
    if (!imported) errors.push('house: ledger save import refused');
    await page.reload({ waitUntil: WAIT });
    await new Promise((r) => setTimeout(r, 2000));
    const log = await page.evaluate(() => window.__game.getState().sleep.log);
    console.log('ledger log:', JSON.stringify(log));
    if (log.length !== 1) errors.push(`house: ledger log ${log.length} entries != 1`);
    else {
      if (!log[0].bed || !log[0].wake) errors.push('house: ledger entry missing times');
      if (!['dawn', 'late'].includes(log[0].verdict))
        errors.push(`house: ledger verdict "${log[0].verdict}" not dawn/late`);
    }
    await page.evaluate(() => window.__game.openPanel('ledger'));
    const ledgerRows = await page.evaluate(() => ({
      rows: document.querySelectorAll('#ledger-body .deed').length,
      summary: document.querySelector('#ledger-body .kv .v')?.textContent ?? '',
    }));
    console.log('ledger panel:', JSON.stringify(ledgerRows));
    if (ledgerRows.rows !== 1) errors.push(`house: ledger panel rows ${ledgerRows.rows} != 1`);
    if (!ledgerRows.summary.includes('of 1 night')) errors.push(`house: ledger summary "${ledgerRows.summary}"`);
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));

    // 6b) the chest by the cot: stand at its open corner, E lifts the lid and
    //     opens the Chest panel; Esc closes both (the market scenario
    //     covers what the chest holds)
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = -9.2; // local (-0.2, -0.95): the chest's corner, against the -z wall
      g.player.pos.z = 1.05;
      g.orbitCam.setView(0, 0.6, 2); // looking past him at the chest
    });
    // poll: the software renderer can stall past a fixed wait on a fresh view
    let chestPrompt = '';
    for (let i = 0; i < 30 && !chestPrompt.includes('open the chest'); i++) {
      await new Promise((r) => setTimeout(r, 100));
      chestPrompt = await page.evaluate(() => document.getElementById('interact-prompt').textContent);
    }
    console.log('chest prompt:', JSON.stringify(chestPrompt));
    if (!chestPrompt.includes('open the chest')) errors.push(`house: chest prompt "${chestPrompt}"`);
    await page.keyboard.press('KeyE');
    await new Promise((r) => setTimeout(r, 400));
    const lidUp = await page.evaluate(() => ({
      lid: window.__game.chest.isOpen,
      panel: !document.getElementById('chest-panel').classList.contains('hidden'),
    }));
    if (!lidUp.lid || !lidUp.panel) errors.push(`house: E at the chest -> ${JSON.stringify(lidUp)}`);
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 200));
    if (await page.evaluate(() => window.__game.chest.isOpen)) errors.push('house: closing the panel left the lid up');

    // 7) interior screenshot: indoors camera should pull in under the rafters
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = -8.6;
      g.player.pos.z = 1.1;
      g.orbitCam.setView(2.4, 0.3, 6); // far view; the indoor clamp must pull it in
    });
  } else if (scenario === 'exchequer') {
    // walk up to the counter: the prompt offers the table, E opens the
    // Treasury, Set writes state; screenshot frames the booth and clerk
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = 4.8; // on the path side of the counter
      g.player.pos.z = 3.1;
    });
    const prompt = await promptOffered();
    console.log('prompt:', JSON.stringify(prompt));
    if (!prompt.includes('Exchequer')) errors.push(`exchequer: prompt "${prompt}" does not offer the table`);
    await page.keyboard.press('KeyE');
    await new Promise((r) => setTimeout(r, 300));
    const bank = await page.evaluate(() => {
      const opened = !document.getElementById('treasury-panel').classList.contains('hidden');
      const q = (sel) => document.querySelector(`#treasury-body ${sel}`);
      // an untouched ledger asks three questions, one at a time
      const asked = !!q('[data-w-goal]') && !q('[data-w-current]') && !q('[data-log-open]');
      let pace = '';
      if (asked) {
        // no buttons to pick from: what he saves for is typed, and is required
        const typed = !document.querySelector('#treasury-body [data-chip]') && q('[data-w-name]').type === 'text';
        q('[data-w-goal]').value = '20000';
        q('[data-w-next]').click(); // no name: refused, still on the first question
        const unnamed = !!q('[data-w-goal]');
        q('[data-w-goal]').value = '';
        q('[data-w-name]').value = 'The War Chest';
        q('[data-w-next]').click(); // no sum yet: refused, still on the first question
        const held = unnamed && !!q('[data-w-goal]');
        q('[data-w-name]').value = 'The War Chest';
        q('[data-w-goal]').value = '20000';
        q('[data-w-next]').click();
        q('[data-w-current]').value = '2500';
        q('[data-w-next]').click();
        q('[data-w-pledge]').value = '300';
        q('[data-w-pledge]').dispatchEvent(new Event('input'));
        pace = q('[data-w-pace]').textContent;
        q('[data-w-next]').click();
        const sealed = { ...window.__game.getState().treasury };
        // the ledger: the coffer, the figure, the track — and money put into savings today
        const shown = { coffer: !!q('.tr-coffer svg'), amount: q('.tr-amount')?.textContent, track: !!q('.tr-track') };
        q('[data-log-open="save"]').click();
        q('[data-log-amount]').value = '500';
        q('[data-log-note]').value = 'to the hoard';
        q('[data-log-set]').click();
        const d = new Date();
        const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const t = window.__game.getState().treasury;
        const laid = {
          current: t.current, month: window.__game.monthTally(month).saved, amount: q('.tr-amount')?.textContent,
          meter: q('.tr-month')?.textContent ?? '', todayRows: document.querySelectorAll('#treasury-body .tr-day .tr-entry').length,
        };
        // a recount is a correction: it moves the savings, not the month's saving
        q('[data-count-open]').click();
        q('[data-count-amount]').value = '3100';
        q('[data-count-set]').click();
        const t2 = window.__game.getState().treasury;
        return {
          opened, asked, typed, held, pace, sealed, shown,
          laidCurrent: laid.current, laid: laid.month, amountAfter: laid.amount,
          monthMeter: laid.meter.replace(/\s+/g, ' ').trim(), todayRows: laid.todayRows,
          recounted: t2.current, laidAfterRecount: window.__game.monthTally(month).saved,
        };
      }
      return { opened, asked };
    });
    console.log('exchequer:', JSON.stringify(bank));
    if (!bank.opened) errors.push('exchequer: E at the counter did not open the Treasury');
    if (!bank.asked) errors.push('exchequer: an untouched ledger did not open on its first question');
    else {
      if (!bank.typed) errors.push('exchequer: the goal is not typed into a text box (or preset buttons remain)');
      if (!bank.held) errors.push('exchequer: a goal with no name or no sum was let past the first question');
      if (!bank.pace.includes('59 months')) errors.push(`exchequer: pace "${bank.pace}" does not reckon 17,500 at 300 a month`);
      const s0 = bank.sealed;
      if (s0.current !== 2500 || s0.goal !== 20000 || s0.pledge !== 300 || s0.name !== 'The War Chest')
        errors.push(`exchequer: ledger sealed as ${s0.name}/${s0.current}/${s0.goal}/${s0.pledge} != The War Chest/2500/20000/300`);
      if (!bank.shown.coffer || !bank.shown.track || bank.shown.amount !== '2,500')
        errors.push(`exchequer: the ledger does not show coffer, track and 2,500 (${JSON.stringify(bank.shown)})`);
      if (bank.laidCurrent !== 3000 || bank.laid !== 500 || bank.amountAfter !== '3,000')
        errors.push(`exchequer: 500 laid in -> savings ${bank.laidCurrent}, month ${bank.laid}, shown ${bank.amountAfter}`);
      if (!bank.monthMeter.includes('kept')) errors.push(`exchequer: 500 laid against 300 pledged, yet the month reads "${bank.monthMeter}"`);
      if (bank.todayRows !== 1) errors.push(`exchequer: today's day book shows ${bank.todayRows} entries, not the one made`);
      if (bank.recounted !== 3100 || bank.laidAfterRecount !== 500)
        errors.push(`exchequer: recount -> savings ${bank.recounted}, month ${bank.laidAfterRecount} != 3100, 500`);
    }
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));
    // step back so the screenshot frames the whole booth and its clerk
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = 5.9;
      g.player.pos.z = 1.3;
      g.orbitCam.setView(-0.4, 0.25, 3.5);
    });
  } else if (scenario === 'guide') {
    // the Village Charter: prompt at the post, E opens the guide panel, and
    // the rules on it are drawn live from config — not hardcoded prose
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = 1.2;
      g.player.pos.z = 1.4; // by the charter post, out of the quest board's reach
    });
    // the prompt is set on the next sim step — at ~3fps in a cloud container
    // that can be well past a fixed wait, so wait for it (up to 3s)
    await page
      .waitForFunction(() => document.getElementById('interact-prompt').textContent !== '', { timeout: 3000 })
      .catch(() => {});
    const prompt = await page.evaluate(
      () => document.getElementById('interact-prompt').textContent
    );
    console.log('prompt:', JSON.stringify(prompt));
    if (!prompt.includes('Charter')) errors.push(`guide: prompt "${prompt}" does not offer the charter`);
    await page.keyboard.press('KeyE');
    await new Promise((r) => setTimeout(r, 300));
    const charter = await page.evaluate(() => {
      const C = window.__game.CONFIG;
      const text = document.getElementById('guide-body').textContent;
      return {
        opened: !document.getElementById('guide-panel').classList.contains('hidden'),
        sections: document.querySelectorAll('#guide-body .sheet-section').length,
        daily: text.includes(`+${C.rewards.daily.xp} XP`),
        caps: text.includes(`${C.stamina.baseCap}`) && text.includes(`${C.stamina.questCap}`),
        king: text.includes(`${C.ranks[C.ranks.length - 1].totalLevels}`),
        market: !C.shop || text.includes('Chapman'),
      };
    });
    console.log('charter:', JSON.stringify(charter));
    await page.screenshot({ path: 'scripts/smoke-guide.png' });
    if (!charter.opened) errors.push('guide: E at the post did not open the charter');
    if (charter.sections < 8) errors.push(`guide: only ${charter.sections} sections render`);
    if (!charter.daily) errors.push('guide: daily reward not drawn from config');
    if (!charter.caps) errors.push('guide: stamina caps not drawn from config');
    if (!charter.king) errors.push('guide: rank ladder not drawn from config');
    if (!charter.market) errors.push('guide: shop is configured but the charter is silent on market days');
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));
    // frame the post from the northwest so the parchment faces the camera
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = 1.9;
      g.player.pos.z = -0.3;
      g.orbitCam.setView(-0.85, 0.18, 4.1);
    });
  } else if (scenario === 'sky') {
    // the sky keeps the hour: the pinned clock, the sun's road east → south →
    // west, the looks of noon, dusk and night, the seasons, the moon's phase,
    // summer time, and the beam that never lies flat
    const at = (y, mo, d, h, mi = 0) =>
      page.evaluate(
        ([y, mo, d, h, mi]) => {
          const g = window.__game;
          g.sky.setClock(new Date(y, mo, d, h, mi));
          const s = g.sky.state;
          const key = g.scene.children.find((o) => o.isDirectionalLight);
          const fog = g.scene.fog.color;
          const east = g.compass(1, 0, 0);
          const south = g.compass(0, -1, 0);
          return {
            hour: s.hour,
            sunAlt: s.sunAlt,
            moonAlt: s.moonAlt,
            moonLit: s.moonLit,
            night: s.night,
            moonlit: s.moonlit,
            starShow: s.starShow,
            stars: g.scene.getObjectByName('stars').visible,
            keyPower: key.intensity,
            beamUp: s.beamUp, // how steeply the key light falls: the sine of its height
            fog: (fog.r + fog.g + fog.b) / 3,
            sunEast: s.sun.dot(east),
            sunSouth: s.sun.dot(south),
          };
        },
        [y, mo, d, h, mi]
      );
    const shot = async (name, body) => {
      // look toward the sun (or the moon), from the open path south of the green
      await page.evaluate((body) => {
        const g = window.__game;
        g.player.pos.x = -2.9;
        g.player.pos.z = -14;
        const b = g.sky.state[body];
        g.orbitCam.setView(Math.atan2(-b.x, -b.z) + 0.5, -0.08, 9);
      }, body);
      await new Promise((r) => setTimeout(r, 2500));
      await page.screenshot({ path: `scripts/smoke-sky-${name}.png` });
    };

    // the page was opened with ?hour=13: the sky stands at one o'clock
    const pinnedHour = await page.evaluate(() => ({ hour: window.__game.sky.state.hour, want: 13 }));
    console.log('pinned:', JSON.stringify(pinnedHour));
    if (Math.abs(pinnedHour.hour - pinnedHour.want) > 0.02) errors.push(`sky: ?hour=13 shows hour ${pinnedHour.hour}, want ${pinnedHour.want}`);

    // an autumn day (no summer time anywhere in the north): morning, noon, evening, midnight
    const morning = await at(2026, 10, 16, 9);
    const noon = await at(2026, 10, 16, 12);
    await shot('noon', 'sun');
    const evening = await at(2026, 10, 16, 15);
    const sunset = await at(2026, 10, 16, 17, 55);
    await shot('sunset', 'sun');
    const dusk = await at(2026, 10, 16, 18, 35);
    const midnight = await at(2026, 10, 17, 0, 30);
    console.log('morning:', JSON.stringify(morning));
    console.log('noon:', JSON.stringify(noon));
    console.log('evening:', JSON.stringify(evening));
    console.log('sunset:', JSON.stringify(sunset));
    console.log('dusk:', JSON.stringify(dusk));
    console.log('midnight:', JSON.stringify(midnight));
    if (!(morning.sunEast > 0.3)) errors.push(`sky: the morning sun is not in the east (${morning.sunEast})`);
    if (!(evening.sunEast < -0.3)) errors.push(`sky: the evening sun is not in the west (${evening.sunEast})`);
    if (!(noon.sunSouth > 0.5 && Math.abs(noon.sunEast) < 0.05)) errors.push('sky: the noon sun is not due south');
    if (!(noon.sunAlt > 20 && noon.sunAlt > morning.sunAlt && noon.sunAlt > evening.sunAlt)) errors.push('sky: the sun is not highest at noon');
    if (noon.keyPower < 2.5 || noon.night !== 0 || noon.stars) errors.push(`sky: noon is not full day (key ${noon.keyPower}, night ${noon.night}, stars ${noon.stars})`);
    if (noon.fog < 0.5) errors.push(`sky: the noon haze is dark (${noon.fog})`);
    if (Math.abs(sunset.sunAlt) > 3) errors.push(`sky: 17:55 is not sunset (sun at ${sunset.sunAlt})`);
    if (!(sunset.keyPower > 0.5 && sunset.keyPower < noon.keyPower)) errors.push(`sky: the setting sun's light (${sunset.keyPower}) is not weaker than noon's`);
    if (sunset.beamUp < Math.sin((17.5 * Math.PI) / 180)) errors.push(`sky: the beam lies flat at sunset (${sunset.beamUp})`);
    if (dusk.keyPower > 0.3) errors.push(`sky: the key light still burns at dusk (${dusk.keyPower})`);
    if (!(midnight.sunAlt < -14 && midnight.night === 1 && midnight.moonlit)) errors.push('sky: midnight is not night');
    if (!(midnight.stars && midnight.starShow === 1)) errors.push('sky: no stars at midnight');
    if (!(midnight.keyPower > 0.4 && midnight.keyPower < 1.5)) errors.push(`sky: night's light is ${midnight.keyPower}`);
    if (midnight.fog > 0.2) errors.push(`sky: the night haze is bright (${midnight.fog})`);
    if (midnight.beamUp < Math.sin((17.5 * Math.PI) / 180)) errors.push('sky: the beam lies flat at night');

    // the seasons: a high sun in June, a low one in December — but the sun is
    // up at 17:45 and down at 18:15 by the clock in both, summer time or not
    const june = await at(2026, 5, 21, 12);
    const juneEve = await at(2026, 5, 21, 17, 45);
    const juneDark = await at(2026, 5, 21, 18, 15);
    const december = await at(2026, 11, 21, 12);
    const decemberEve = await at(2026, 11, 21, 17, 45);
    const decemberDark = await at(2026, 11, 21, 18, 15);
    const decemberDawn = await at(2026, 11, 21, 6, 15);
    console.log('seasons:', JSON.stringify({ june: june.sunAlt, juneEve: juneEve.sunAlt, juneDark: juneDark.sunAlt, december: december.sunAlt, decemberEve: decemberEve.sunAlt, decemberDark: decemberDark.sunAlt, decemberDawn: decemberDawn.sunAlt }));
    if (!(june.sunAlt > december.sunAlt + 40)) errors.push('sky: midsummer noon is no higher than midwinter noon');
    if (!(juneEve.sunAlt > 0 && decemberEve.sunAlt > 0)) errors.push('sky: the sun is down before six in the evening');
    if (!(juneDark.sunAlt < 0 && decemberDark.sunAlt < 0)) errors.push('sky: the sun is still up after six in the evening');
    if (!(decemberDawn.sunAlt > 0)) errors.push('sky: the sun is not up by a quarter past six in the morning');

    // the moon: full and high at a winter midnight, dark when new
    const full = await at(2026, 10, 24, 23, 30);
    await shot('night', 'moon');
    const newMoon = await page.evaluate(() => window.__game.skyAt(new Date(Date.UTC(2024, 0, 11, 12)), 45).moonLit);
    console.log('moon:', JSON.stringify({ fullLit: full.moonLit, fullAlt: full.moonAlt, fullKey: full.keyPower, moonless: midnight.keyPower, newLit: newMoon }));
    if (!(full.moonLit > 0.95 && full.moonAlt > 30)) errors.push(`sky: the full moon of 24 Nov 2026 is not full and high (${full.moonLit}, ${full.moonAlt})`);
    if (!(full.keyPower > midnight.keyPower)) errors.push('sky: a full moon lights the night no better than none');
    if (newMoon > 0.05) errors.push(`sky: the new moon of 11 Jan 2024 is lit (${newMoon})`);

    // summer time: the sky keeps the wall clock's hour, so six is sunset in July too
    await page.emulateTimezone('America/New_York');
    const clocks = await page.evaluate(() => {
      const g = window.__game;
      const C = g.CONFIG.sky;
      return {
        july: g.clockHour(new Date(2026, 6, 1, 13, 0)),
        january: g.clockHour(new Date(2026, 0, 15, 13, 0)),
        julySet: g.skyAt(new Date(2026, 6, 1, 18, 0), C.latitude, C.sunrise, C.sunset).sunAlt,
      };
    });
    await page.emulateTimezone(null);
    console.log('summer time:', JSON.stringify(clocks));
    if (clocks.july !== 13 || clocks.january !== 13) errors.push(`sky: the clock misread (${JSON.stringify(clocks)})`);
    if (Math.abs(clocks.julySet) > 0.5) errors.push(`sky: six in the evening in a New York July is not sunset (${clocks.julySet})`);

    // leave the dusk up for the last screenshot
    await at(2026, 10, 16, 18, 15);
    await shot('dusk', 'sun');
  } else if (scenario === 'map') {
    // the Map of the Kingdom: M unrolls it, the realm and the village plan
    // both draw, hovering reads a place aloud, the plan's arrow stands where
    // the player does with north up (the strip to the north-east), M rolls it up
    const mapState = () =>
      page.evaluate(() => {
        const C = window.__game.CONFIG;
        const body = document.getElementById('map-body');
        const you = body.querySelector('.m-you');
        return {
          opened: !document.getElementById('map-panel').classList.contains('hidden'),
          which: window.__game.openPanelId(),
          realm: !!body.querySelector('svg.m-realm'),
          plan: !!body.querySelector('svg.m-plan'),
          kingdom: body.textContent.includes(C.realm.kingdom),
          village: body.textContent.includes(C.realm.village),
          lake: body.textContent.includes(C.realm.lake),
          home: !!body.querySelector('.m-place[data-place="home"] .m-home-ring'),
          places: body.querySelectorAll('.m-place').length,
          view: body.querySelector('.map-views button.on')?.dataset.view,
          you: you ? { x: Number(you.dataset.px), y: Number(you.dataset.py) } : null,
          enabled: window.__game.player.isEnabled(),
        };
      });
    await page.keyboard.press('KeyM');
    await new Promise((r) => setTimeout(r, 400));
    const m1 = await mapState();
    console.log('map opened:', JSON.stringify(m1));
    if (!m1.opened || m1.which !== 'map') errors.push('map: M did not open the map');
    if (!m1.realm || !m1.plan) errors.push('map: realm or village plan missing');
    if (!m1.kingdom || !m1.village) errors.push('map: the kingdom or village is not named');
    if (!m1.lake) errors.push('map: the lake is not named');
    if (!m1.home) errors.push('map: the home village is not ringed');
    if (m1.places < 8) errors.push(`map: only ${m1.places} places on the realm`);
    if (m1.view !== 'green') errors.push(`map: plan opened on "${m1.view}" though he stands on the green`);
    if (!m1.you) errors.push('map: no arrow for the player');
    if (m1.enabled) errors.push('map: player still free to move under the map');
    const hover = await page.evaluate(() => {
      const el = document.querySelector('#map-body [data-place="kingsholt"]');
      el.dispatchEvent(new MouseEvent('mouseenter'));
      const on = document.getElementById('map-caption').textContent;
      el.dispatchEvent(new MouseEvent('mouseleave'));
      return { on, off: document.getElementById('map-caption').textContent };
    });
    console.log('hover:', JSON.stringify(hover));
    if (!hover.on.includes('Kingsholt')) errors.push('map: hovering Kingsholt reads nothing of it');
    if (hover.off.includes('Kingsholt')) errors.push('map: the caption kept Kingsholt after the hover');
    await page.screenshot({ path: 'scripts/smoke-map.png' });

    await page.click('#map-body [data-view="bounds"]');
    await new Promise((r) => setTimeout(r, 200));
    const m2 = await mapState();
    if (m2.view !== 'bounds') errors.push('map: The Bounds button did not change the plan');
    await page.screenshot({ path: 'scripts/smoke-map-bounds.png' });

    await page.keyboard.press('KeyM');
    await new Promise((r) => setTimeout(r, 300));
    const m3 = await mapState();
    if (m3.which !== null || m3.opened) errors.push('map: M did not roll the map up');
    if (!m3.enabled) errors.push('map: player not freed when the map closed');

    // out by the strip: the arrow must move up (north) and right (east) of where it was
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = 21;
      g.player.pos.z = 25;
    });
    await new Promise((r) => setTimeout(r, 300));
    await page.keyboard.press('KeyM');
    await new Promise((r) => setTimeout(r, 400));
    const m4 = await mapState();
    console.log('by the strip:', JSON.stringify({ view: m4.view, was: m2.you, now: m4.you }));
    if (m4.view !== 'bounds') errors.push('map: the chosen plan view was not kept for the session');
    if (!(m4.you && m2.you && m4.you.y < m2.you.y - 20 && m4.you.x > m2.you.x)) {
      errors.push('map: walking to the north-east strip did not move the arrow north-east');
    }
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));
    if ((await mapState()).opened) errors.push('map: Esc did not close the map');

    // M does nothing under another panel; the Charter lists the key
    await page.evaluate(() => window.__game.openPanel('guide'));
    await page.keyboard.press('KeyM');
    await new Promise((r) => setTimeout(r, 300));
    const under = await page.evaluate(() => ({
      which: window.__game.openPanelId(),
      charter: document.getElementById('guide-body').textContent.includes(window.__game.CONFIG.realm.village),
    }));
    if (under.which !== 'guide') errors.push(`map: M under the Charter opened "${under.which}"`);
    if (!under.charter) errors.push('map: the Charter does not list the map key');
    await page.keyboard.press('Escape');
  } else if (scenario === 'reckoning') {
    // month keys computed the same way dates.js does, offset in months
    const mk = (offset) => {
      const d = new Date();
      const m = new Date(d.getFullYear(), d.getMonth() + offset, 1);
      return `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`;
    };

    // 1) the v6 → v7 migration grew the new fields
    const migrated = await page.evaluate(() => {
      const t = window.__game.getState().treasury;
      return {
        version: window.__game.getState().saveVersion,
        latest: window.__game.CONFIG.saveVersion,
        name: t.name,
        pledge: t.pledge,
        rolls: Array.isArray(t.rolls) && t.rolls.length === 0 && Array.isArray(t.log),
        conquered: Array.isArray(t.conquered) && t.conquered.length === 0,
      };
    });
    console.log('migrated:', JSON.stringify(migrated));
    if (migrated.version !== migrated.latest)
      errors.push(`reckoning: saveVersion ${migrated.version} != current ${migrated.latest}`);
    if (migrated.name !== '' || migrated.pledge !== 0 || !migrated.rolls || !migrated.conquered)
      errors.push('reckoning: migration did not grow the v7 treasury fields');

    // 2) the pure verdict rules, judged against fixed figures
    const verdicts = await page.evaluate(() => {
      const j = window.__game.judgeReckoning;
      return {
        fat: j({ earned: 100, spent: 80, saved: 30 }, 20),
        underPledge: j({ earned: 100, spent: 80, saved: 10 }, 20),
        noPledge: j({ earned: 100, spent: 80, saved: 30 }, 0),
        bled: j({ earned: 100, spent: 120, saved: 0 }, 0),
        // no income or spending given: judged on the savings alone
        quickFat: j({ saved: 30, counted: 500, before: 600 }, 20),
        quickHeld: j({ saved: 10, counted: 600, before: 600 }, 20),
        quickBled: j({ saved: 0, counted: 500, before: 600 }, 20),
        quickFirst: j({ saved: 0, counted: 500, before: null }, 20),
      };
    });
    console.log('verdicts:', JSON.stringify(verdicts));
    if (verdicts.fat !== 'fat') errors.push(`reckoning: pledge met -> ${verdicts.fat}`);
    if (verdicts.underPledge !== 'held') errors.push(`reckoning: under pledge -> ${verdicts.underPledge}`);
    if (verdicts.noPledge !== 'held') errors.push(`reckoning: no pledge -> ${verdicts.noPledge}`);
    if (verdicts.bled !== 'bled') errors.push(`reckoning: overspent -> ${verdicts.bled}`);
    if (verdicts.quickFat !== 'fat' || verdicts.quickHeld !== 'held' || verdicts.quickBled !== 'bled' || verdicts.quickFirst !== 'held')
      errors.push(`reckoning: verdicts on savings alone ${JSON.stringify(verdicts)}`);

    const nothingClosed = await page.evaluate(() => window.__game.getState().treasury.rolls.length === 0);
    if (!nothingClosed) errors.push('reckoning: a ledger with no entries closed a month on load');

    // 3) a day's money through the panel: pledge 200, then in / out / into savings;
    //    a mistaken entry is struck out
    await page.evaluate(() => window.__game.openPanel('treasury'));
    const book = await page.evaluate(() => {
      const q = (sel) => document.querySelector(`#treasury-body ${sel}`);
      q('[data-t-pledge]').value = '200';
      q('[data-t-set]').click(); // rerenders the panel
      const enter = (kind, amount, note = '') => {
        q(`[data-log-open="${kind}"]`).click();
        q('[data-log-amount]').value = amount;
        q('[data-log-note]').value = note;
        q('[data-log-set]').click();
      };
      // a blank amount is refused
      q('[data-log-open="in"]').click();
      q('[data-log-set]').click();
      const blankRefused = window.__game.getState().treasury.log.length === 0;
      q('[data-form-close]').click();
      enter('in', '5000', 'wages');
      enter('out', '3800', 'rent and bread');
      enter('out', '50', 'a mistake');
      enter('save', '300');
      const before = window.__game.getState().treasury.log.length;
      const rows = document.querySelectorAll('#treasury-body .tr-day .tr-entry');
      rows[2].querySelector('[data-unlog]').click(); // strike out the 50
      const t = window.__game.getState().treasury;
      const d = new Date();
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return {
        blankRefused, before, after: t.log.length, current: t.current,
        tally: window.__game.monthTally(month),
        sums: q('[data-sums]').textContent.replace(/\s+/g, ' ').trim(),
        note: q('.tr-day .tr-entry .deed-text')?.textContent,
      };
    });
    console.log('book:', JSON.stringify(book));
    if (!book.blankRefused) errors.push('reckoning: a blank amount was entered');
    if (book.before !== 4 || book.after !== 3) errors.push(`reckoning: day book ${book.before} -> ${book.after} entries, expected 4 -> 3 after striking one`);
    if (book.current !== 1100) errors.push(`reckoning: 300 into savings on 800 -> ${book.current}`);
    if (book.tally.earned !== 5000 || book.tally.spent !== 3800 || book.tally.saved !== 300)
      errors.push(`reckoning: month tally ${JSON.stringify(book.tally)}`);
    if (!book.sums.includes('5,000') || !book.sums.includes('3,800') || !book.sums.includes('1,200'))
      errors.push(`reckoning: the month so far reads "${book.sums}"`);
    if (book.note !== 'wages') errors.push(`reckoning: the entry's note reads "${book.note}"`);

    // 4) the month closes itself (on a pinned clock, the 5th of next month):
    //    1100 tops the 1000 summit — the conquest must fire
    const closed = await page.evaluate(() => {
      const g = window.__game;
      const d = new Date();
      const next = new Date(d.getFullYear(), d.getMonth() + 1, 5);
      const res = g.closeMonths(next);
      const again = g.closeMonths(next);
      const st = g.getState();
      const t = st.treasury;
      g.openPanel('treasury');
      return {
        closed: res.length, again: again.length,
        roll: t.rolls[0], logLeft: t.log.length, current: t.current, goal: t.goal,
        conquered: t.conquered.length, conqueredGoal: t.conquered[0]?.goal,
        histType: st.history[st.history.length - 1]?.type,
        histStat: st.history[st.history.length - 1]?.statTrained,
        intLevel: st.stats.int.level, intXp: st.stats.int.xp, coins: st.coins,
        summitForm: !!document.querySelector('#treasury-body [data-s-name]'),
      };
    });
    console.log('closed:', JSON.stringify(closed));
    if (closed.closed !== 1 || closed.again !== 0) errors.push(`reckoning: closed ${closed.closed} months, then ${closed.again} more`);
    const r0 = closed.roll ?? {};
    if (r0.verdict !== 'fat' || r0.earned !== 5000 || r0.spent !== 3800 || r0.saved !== 300 || r0.counted !== 1100)
      errors.push(`reckoning: the closed month reads ${JSON.stringify(r0)}`);
    if (closed.logLeft !== 0) errors.push(`reckoning: ${closed.logLeft} entries left in the day book after its month closed`);
    if (closed.current !== 1100) errors.push(`reckoning: savings ${closed.current} != 1100 after the close`);
    if (closed.goal !== 0) errors.push(`reckoning: goal ${closed.goal} != 0 after conquest`);
    if (closed.conquered !== 1 || closed.conqueredGoal !== 1000) errors.push('reckoning: the 1000 summit was not conquered');
    if (closed.histType !== 'treasury') errors.push(`reckoning: history type ${closed.histType} != treasury`);
    if (!closed.summitForm) errors.push('reckoning: no next-summit form after conquest');
    // a goal won pays 300 Intelligence XP (level 1 → 3 exactly) and never a coin
    if (closed.intLevel !== 3 || closed.intXp !== 0)
      errors.push(`reckoning: Intelligence at level ${closed.intLevel} / ${closed.intXp} XP, expected 3 / 0 after a goal won`);
    if (closed.histStat !== 'int') errors.push('reckoning: the goal won is not recorded as an Intelligence deed');
    if (closed.coins !== 0) errors.push(`reckoning: a goal won paid ${closed.coins} coins — the purses must not mix`);

    const raised = await page.evaluate(() => {
      const q = (sel) => document.querySelector(`#treasury-body ${sel}`);
      q('[data-s-name]').value = 'The War Chest';
      q('[data-s-goal]').value = '5000';
      q('[data-s-set]').click();
      const t = window.__game.getState().treasury;
      return { name: t.name, goal: t.goal };
    });
    if (raised.name !== 'The War Chest' || raised.goal !== 5000)
      errors.push(`reckoning: summit "${raised.name}"/${raised.goal} != "The War Chest"/5000`);
    await page.keyboard.press('Escape');

    // 5) a v12 save (coin laid in, by month) whose last roll is four months back:
    //    the load migrates `laid` into the day book and closes the three months
    //    owed by itself — two empty ones unreckoned, the laid-in one judged
    const seeded = await page.evaluate(([old, owed]) => {
      const g = window.__game;
      const copy = JSON.parse(g.exportSave());
      copy.saveVersion = 12;
      copy.treasury.rolls = [{ month: old, earned: 1000, spent: 900, saved: 100, counted: 100, verdict: 'held' }];
      copy.treasury.laid = { [owed]: 120 };
      copy.treasury.current = 1220;
      delete copy.treasury.log;
      return g.importSave(JSON.stringify(copy));
    }, [mk(-4), mk(-1)]);
    if (!seeded) errors.push('reckoning: seed save import refused');
    await page.reload({ waitUntil: WAIT });
    await new Promise((r) => setTimeout(r, 2000));
    const gap = await page.evaluate(() => {
      const st = window.__game.getState();
      return { version: st.saveVersion, laid: 'laid' in st.treasury, log: st.treasury.log.length, rolls: st.treasury.rolls };
    });
    console.log('gap:', JSON.stringify(gap));
    const gv = gap.rolls.map((r) => r.verdict);
    if (gap.version !== 14 || gap.laid) errors.push(`reckoning: v12 save migrated to ${gap.version}, laid kept: ${gap.laid}`);
    if (gv.length !== 4 || gv[1] !== 'unreckoned' || gv[2] !== 'unreckoned' || gv[3] !== 'held')
      errors.push(`reckoning: the months owed closed as ${JSON.stringify(gv)}`);
    if (gap.rolls[3]?.saved !== 120 || gap.rolls[3]?.counted !== 1220 || 'earned' in (gap.rolls[3] ?? {}))
      errors.push(`reckoning: the laid-in month closed as ${JSON.stringify(gap.rolls[3])}`);
    if (gap.log !== 0) errors.push(`reckoning: ${gap.log} day-book entries left after the close`);

    // 5b) on a pinned clock: savings put in, a recount down, and an entry in the
    //     month after — each month's closing savings counted apart; no income or
    //     spending entered, so judged on the savings alone
    const quick = await page.evaluate(() => {
      const g = window.__game;
      const d = new Date();
      const at = (months) => new Date(d.getFullYear(), d.getMonth() + months, 5);
      const refused = g.layIn(0);
      g.logMoney('save', 150);
      g.recount(1000); // the account truly shows less
      g.logMoney('save', 50, '', at(1));
      const res = g.closeMonths(at(2));
      const t = g.getState().treasury;
      return { refused, rolls: res.map((r) => r.roll), current: t.current, logLeft: t.log.length };
    });
    console.log('quick:', JSON.stringify(quick));
    if (quick.refused !== null) errors.push('reckoning: nothing put into savings was accepted');
    const [m0, m1] = quick.rolls;
    if (quick.rolls.length !== 2 || m0?.saved !== 150 || m0?.counted !== 1000 || m0?.verdict !== 'bled')
      errors.push(`reckoning: savings fell 1220 -> 1000, closed as ${JSON.stringify(m0)}`);
    if (m1?.saved !== 50 || m1?.counted !== 1050 || m1?.verdict !== 'held')
      errors.push(`reckoning: the month after closed as ${JSON.stringify(m1)}`);
    if (quick.current !== 1050 || quick.logLeft !== 0)
      errors.push(`reckoning: after the two months, savings ${quick.current} / ${quick.logLeft} entries left`);

    // 6) the panel shows the rolls; screenshot for eyeballing
    await page.evaluate(() => window.__game.openPanel('treasury'));
    const panel = await page.evaluate(() => ({
      rows: document.querySelectorAll('#treasury-body .deed').length,
      conqueredHeader: document.querySelector('#treasury-body').textContent.includes('Goals won'),
      chart: document.querySelectorAll('#treasury-body .tr-chart .tr-bar').length,
      seals: document.querySelectorAll('#treasury-body .tr-seal').length,
    }));
    console.log('panel:', JSON.stringify(panel));
    if (panel.rows < 5) errors.push(`reckoning: panel shows ${panel.rows} rows, expected rolls + conquest`);
    if (!panel.conqueredHeader) errors.push('reckoning: conquered summit not shown');
    if (panel.chart < 4) errors.push(`reckoning: the climb draws ${panel.chart} bars, expected the four counted months`);
    if (panel.seals < 6) errors.push(`reckoning: ${panel.seals} seals drawn, expected one a month`);
    // unfold the months past for the picture
    await page.evaluate(() => {
      document.querySelector('#treasury-body [data-fold="rolls"]').open = true;
      document.querySelector('#treasury-panel').scrollTop = 1e4;
    });
    await new Promise((r) => setTimeout(r, 300));
    await page.screenshot({ path: 'scripts/smoke-reckoning.png' });
    await page.keyboard.press('Escape');
  } else if (scenario === 'alive') {
    // the villagers breathe, watch, nod, and fidget — force a market day so
    // the chapman is present too
    await page.goto(`http://localhost:${PORT}/?smoke=alive&market=1${DAY}`, { waitUntil: WAIT });
    await new Promise((r) => setTimeout(r, 2000));

    // 1) breathing is visible: the clerk's sway lean actually moves
    // sampled across ~2s: a 0.8s window that lands on the crest of a breath
    // sees under 0.008 of travel and fails a villager who is breathing fine
    const sways = [];
    for (let i = 0; i < 6; i++) {
      sways.push(await page.evaluate(() => window.__game.exchequer.swayX()));
      await new Promise((r) => setTimeout(r, 400));
    }
    const spread = Math.max(...sways) - Math.min(...sways);
    console.log('sway samples:', JSON.stringify(sways.map((v) => v.toFixed(3))));
    if (spread < 0.008) errors.push(`alive: clerk barely breathes (spread ${spread.toFixed(4)})`);

    // helper: teleport near a villager and poll until he notices
    const approach = async (x, z, who) => {
      await page.evaluate(({ x, z }) => {
        window.__game.player.pos.x = x;
        window.__game.player.pos.z = z;
      }, { x, z });
      for (let i = 0; i < 30; i++) {
        const greeted = await page.evaluate((w) => {
          const g = window.__game;
          const npc = w === 'chapman' ? g.cart?.chapman : g[w];
          return npc ? npc.greetedYet() : null;
        }, who);
        if (greeted) return true;
        await new Promise((r) => setTimeout(r, 150));
      }
      return false;
    };

    // 2) the clerk notices you: head turns, greet fires once, a word appears.
    // Stand off to his side — at the counter you are dead ahead and the
    // correct turn is nearly zero.
    if (!(await approach(5.5, 5.0, 'exchequer'))) errors.push('alive: clerk never greeted');
    await new Promise((r) => setTimeout(r, 900)); // let the head-turn ease in
    const clerk = await page.evaluate(() => ({
      headYaw: window.__game.exchequer.headYaw(),
      toast: document.getElementById('toasts').textContent,
    }));
    console.log('clerk:', JSON.stringify({ headYaw: clerk.headYaw.toFixed(3), toast: clerk.toast }));
    if (Math.abs(clerk.headYaw) < 0.25) errors.push(`alive: clerk head never turned (${clerk.headYaw.toFixed(3)})`);
    if (!clerk.toast.includes('clerk')) errors.push(`alive: no clerk greeting toast ("${clerk.toast}")`);
    // hold the pose for the screenshot — camera off to the side so the
    // player doesn't hide the clerk
    await page.evaluate(() => window.__game.orbitCam.setView(-1.35, 0.22, 3.6));
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: 'scripts/smoke-alive.png' });

    // 3) the miller and the chapman notice you too
    if (!(await approach(7.6, 8.6, 'miller'))) errors.push('alive: miller never greeted');
    if (!(await approach(2.2, 7.6, 'chapman'))) errors.push('alive: chapman never greeted');

    // 4) walk away: the clerk's head drifts back to his work
    await page.evaluate(() => {
      window.__game.player.pos.x = -5;
      window.__game.player.pos.z = 4;
    });
    await new Promise((r) => setTimeout(r, 3000));
    const rested = await page.evaluate(() => window.__game.exchequer.headYaw());
    console.log('head at rest:', rested.toFixed(3));
    if (Math.abs(rested) > 0.1) errors.push(`alive: clerk head stuck turned (${rested.toFixed(3)})`);

    // 5) fidgets happen on their own
    let fidgets = 0;
    for (let i = 0; i < 40 && fidgets < 1; i++) {
      fidgets = await page.evaluate(() => window.__game.exchequer.gesturesPlayed());
      await new Promise((r) => setTimeout(r, 350));
    }
    console.log('clerk fidgets:', fidgets);
    if (fidgets < 1) errors.push('alive: the clerk never fidgeted');

    // 6) left alone, the miller walks his rounds — and his E-prompt follows
    const start = await page.evaluate(() => window.__game.miller.at());
    let moved = 0;
    for (let i = 0; i < 100 && moved < 0.8; i++) {
      await new Promise((r) => setTimeout(r, 400));
      moved = await page.evaluate(
        (s) => {
          const at = window.__game.miller.at();
          return Math.hypot(at.x - s.x, at.z - s.z);
        },
        start
      );
    }
    console.log('miller moved:', moved.toFixed(2));
    if (moved < 0.8) errors.push('alive: the miller never walked his rounds');
    await page.evaluate(() => {
      const g = window.__game;
      const at = g.miller.at();
      g.player.pos.x = at.x - 0.8;
      g.player.pos.z = at.z - 0.6;
    });
    await new Promise((r) => setTimeout(r, 500));
    const followPrompt = await page.evaluate(
      () => document.getElementById('interact-prompt').textContent
    );
    console.log('follow prompt:', JSON.stringify(followPrompt));
    if (!followPrompt.includes('miller'))
      errors.push(`alive: prompt "${followPrompt}" did not follow the walking miller`);
  } else if (scenario === 'sage') {
    // 1) the sage judges the daily: no picker, the reward lands on his verdict
    await page.evaluate(() => window.__game.openPanel('board'));
    await page.type('[data-input]', 'Play tennis for an hour');
    await page.click('[data-post]');
    await page.click('[data-complete]');
    let daily = null;
    for (let i = 0; i < 20 && !daily?.done; i++) {
      await new Promise((r) => setTimeout(r, 200));
      daily = await page.evaluate(() => {
        const st = window.__game.getState();
        return {
          done: st.quests.daily.deeds.some((d) => d.completed),
          athXp: st.stats.ath.xp,
          picker: !!document.querySelector('[data-pick]'),
          toast: document.getElementById('toasts').textContent,
        };
      });
    }
    console.log('sage daily:', JSON.stringify(daily));
    if (!daily.done) errors.push('sage: daily never completed');
    if (daily.athXp !== 25) errors.push(`sage: ath xp ${daily.athXp} != 25 (verdict not honored)`);
    if (daily.picker) errors.push('sage: picker shown despite a verdict');
    if (!daily.toast.includes('sage')) errors.push(`sage: no verdict toast ("${daily.toast}")`);

    // 1b) a deed of two virtues: he names both, and the XP is shared between them
    await page.type('.quest-block[data-kind="daily"] [data-input]', 'A hard set with a client');
    await page.click('.quest-block[data-kind="daily"] [data-post]');
    await page.click('[data-slot="daily:1"] [data-complete]');
    let two = null;
    for (let i = 0; i < 20 && !two?.done; i++) {
      await new Promise((r) => setTimeout(r, 200));
      two = await page.evaluate(() => {
        const st = window.__game.getState();
        return {
          done: !!st.quests.daily.deeds[1]?.completed,
          ath: st.stats.ath.xp,
          inf: st.stats.inf.xp,
          virtues: st.history.at(-1).virtues,
          toast: document.getElementById('toasts').textContent,
        };
      });
    }
    console.log('sage, two virtues:', JSON.stringify(two));
    if (!two.done || two.ath !== 38 || two.inf !== 12 || two.virtues?.join() !== 'ath,inf')
      errors.push(`sage: two virtues not shared 13 + 12 (${JSON.stringify(two)})`);
    if (!two.toast.includes('Athleticism and Influence')) errors.push('sage: the verdict toast does not name both virtues');

    // 2) an off-list answer falls back to the manual picker
    await page.type('.quest-block[data-kind="weekly"] [data-input]', 'A deed of pure garble');
    await page.click('.quest-block[data-kind="weekly"] [data-post]');
    await page.click('.quest-block[data-kind="weekly"] [data-complete]');
    let fallback = null;
    for (let i = 0; i < 20 && !fallback?.picker; i++) {
      await new Promise((r) => setTimeout(r, 200));
      fallback = await page.evaluate(() => ({
        picker: !!document.querySelector('[data-pick]'),
        toast: document.getElementById('toasts').textContent,
      }));
    }
    console.log('sage fallback:', JSON.stringify(fallback));
    if (!fallback.picker) errors.push('sage: no picker after a nonsense verdict');
    await page.click('[data-pick="ath"]');
    await page.click('[data-pick-done]');
    const weeklyDone = await page.evaluate(() => window.__game.getState().quests.weekly.completed);
    if (!weeklyDone) errors.push('sage: manual fallback did not complete the weekly');
    await page.screenshot({ path: 'scripts/smoke-sage.png' });

    // 3) dismissed at the Tome, the key is gone and the picker returns at once
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 200));
    await page.evaluate(() => window.__game.openPanel('tome'));
    await page.click('[data-sage-clear]');
    const keyGone = await page.evaluate(() => localStorage.getItem('crownbound_sage_key'));
    if (keyGone !== null) errors.push('sage: key survived dismissal');
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 200));
    await page.evaluate(() => window.__game.openPanel('board'));
    await page.type('[data-input]', 'March a mile in the rain');
    await page.click('[data-post]');
    await page.click('[data-complete]');
    await new Promise((r) => setTimeout(r, 300));
    const manual = await page.evaluate(() => !!document.querySelector('[data-pick]'));
    if (!manual) errors.push('sage: picker absent after dismissal');
  } else if (scenario === 'chronicle') {
    const read = () =>
      page.evaluate(() => {
        const st = window.__game.getState();
        return {
          version: st.saveVersion,
          latest: window.__game.CONFIG.saveVersion,
          texts: st.chronicle.map((e) => e.text),
          weeks: st.chronicle.map((e) => e.week),
          trained: st.history.map((h) => h.statTrained).filter(Boolean),
          calls: Number(sessionStorage.getItem('smoke-calls') || 0),
        };
      });
    const reload = async () => {
      await page.reload({ waitUntil: WAIT });
      await new Promise((r) => setTimeout(r, 2000));
    };

    // 1) migration lands on the current version; a failed call writes nothing
    const first = await read();
    console.log('chronicle load 1 (API fails):', JSON.stringify(first));
    if (first.version !== first.latest) errors.push(`chronicle: saveVersion ${first.version} != current ${first.latest}`);
    if (first.trained.some((v) => v === 'str' || v === 'agi') || !first.trained.includes('ath'))
      errors.push(`chronicle: old deeds not re-read as athletic (${first.trained.join()})`);
    if (first.calls !== 1) errors.push(`chronicle: ${first.calls} API calls on a failing load != 1`);
    if (first.texts.length !== 0) errors.push('chronicle: an entry was written despite the failure');

    // 2) the next load is the retry: exactly one written entry, the oldest week
    await reload();
    const second = await read();
    console.log('chronicle load 2:', JSON.stringify(second));
    if (second.texts.length !== 1 || !second.texts[0].includes('yard'))
      errors.push(`chronicle: load 2 wrote ${JSON.stringify(second.texts)}, wanted the oldest week only`);
    if (second.calls !== 2) errors.push(`chronicle: ${second.calls} API calls by load 2 != 2`);
    const charge = await page.evaluate(() => ({
      text: sessionStorage.getItem('smoke-charge') || '',
      village: window.__game.CONFIG.realm.village,
    }));
    if (!charge.text.includes(`Name the village, ${charge.village}`))
      errors.push('chronicle: the chronicler is not told to name the village');

    // 3) then the silent week for free and the last week in prose, in order
    await reload();
    const third = await read();
    console.log('chronicle load 3:', JSON.stringify(third));
    if (third.texts.length !== 3) errors.push(`chronicle: ${third.texts.length} entries after load 3 != 3`);
    else {
      if (!third.texts[1].includes('blank')) errors.push('chronicle: the empty week was not left blank');
      if (!third.texts[2].includes('ball court')) errors.push('chronicle: the last week is not the tennis entry');
      if ([...third.weeks].sort().join() !== third.weeks.join()) errors.push('chronicle: entries out of week order');
    }
    if (third.calls !== 3) errors.push(`chronicle: ${third.calls} API calls by load 3 != 3 (silent week must be free)`);

    // 4) nothing more is owed: a further load neither calls nor writes
    await reload();
    const fourth = await read();
    if (fourth.texts.length !== 3 || fourth.calls !== 3)
      errors.push(`chronicle: a caught-up load still wrote or called (${fourth.texts.length} entries, ${fourth.calls} calls)`);

    // 5) the Tome shows the journal, newest week first
    await page.evaluate(() => window.__game.openPanel('tome'));
    const shown = await page.evaluate(() =>
      [...document.querySelectorAll('.journal-entry .journal-prose')].map((p) => p.textContent)
    );
    console.log('chronicle in the Tome:', JSON.stringify(shown));
    if (shown.length !== 3) errors.push(`chronicle: Tome shows ${shown.length} journal entries != 3`);
    else if (!shown[0].includes('ball court')) errors.push('chronicle: Tome journal is not newest-first');
    await page.screenshot({ path: 'scripts/smoke-chronicle.png' });
  } else if (scenario === 'market') {
    // 1) force a market day (any real weekday) and seed a fat purse
    await page.goto(`http://localhost:${PORT}/?smoke=market&market=1${DAY}`, { waitUntil: WAIT });
    await new Promise((r) => setTimeout(r, 2000));
    if (!(await page.evaluate(() => !!window.__game.cart)))
      errors.push('market: cart absent though market=1');
    await page.evaluate(() => {
      const g = window.__game;
      const copy = JSON.parse(g.exportSave());
      copy.coins = 2000;
      return g.importSave(JSON.stringify(copy));
    });
    await page.reload({ waitUntil: WAIT });
    await new Promise((r) => setTimeout(r, 2000));

    // 2) the prompt offers the cart; E opens the shop
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = 1.5; // on the path, the chapman's side
      g.player.pos.z = 9.0;
    });
    const prompt = await promptOffered();
    console.log('prompt:', JSON.stringify(prompt));
    if (!prompt.includes('chapman')) errors.push(`market: prompt "${prompt}" does not offer the cart`);
    await page.keyboard.press('KeyE');
    await new Promise((r) => setTimeout(r, 300));
    if (await page.evaluate(() => document.getElementById('shop-panel').classList.contains('hidden')))
      errors.push('market: E by the cart did not open the shop');

    // 2b) every ware in the catalogue has its picture drawn beside it
    const pictures = await page.evaluate(() =>
      window.__game.CONFIG.shop.items.map((item) => {
        const svg = document.querySelector(`#shop-body .ware-pic[data-more="${item.id}"] svg`);
        return {
          id: item.id,
          drawn: svg ? svg.querySelectorAll('path, rect, circle, ellipse').length : 0,
          readMore: !!document.querySelector(`#shop-body .ware-more-link[data-more="${item.id}"]`),
        };
      })
    );
    console.log('pictures:', JSON.stringify(pictures));
    for (const p of pictures) if (p.drawn < 5) errors.push(`market: ${p.id} has no picture in the shop`);
    for (const p of pictures) if (!p.readMore) errors.push(`market: ${p.id} has no "read more" in the shop`);

    // 2c) clicking a picture unfolds its "read more" (numbers from config), the link folds it
    await page.click('#shop-body .ware-pic[data-more="cudgel"]');
    await new Promise((r) => setTimeout(r, 150));
    const lore = await page.evaluate(() => {
      const box = document.querySelector('#shop-body .ware-more');
      const cudgel = window.__game.CONFIG.shop.items.find((i) => i.id === 'cudgel');
      return {
        open: document.querySelectorAll('#shop-body .ware-more').length,
        uses: !!box && box.textContent.includes('How to use it') && box.textContent.includes('What it does for thee'),
        damage: !!box && box.textContent.includes(`${cudgel.damage} damage a blow`),
        bigPicture: !!box && !!box.querySelector('.ware-big svg'),
      };
    });
    console.log('read more:', JSON.stringify(lore));
    if (lore.open !== 1 || !lore.uses) errors.push(`market: the cudgel's picture did not unfold its read-more -> ${JSON.stringify(lore)}`);
    if (!lore.damage) errors.push('market: the cudgel read-more does not give its damage from config');
    if (!lore.bigPicture) errors.push('market: the read-more has no large picture');
    await page.click('#shop-body .ware-more-link[data-more="cudgel"]');
    await new Promise((r) => setTimeout(r, 150));
    if (await page.evaluate(() => document.querySelectorAll('#shop-body .ware-more').length))
      errors.push('market: "Read less" did not fold the read-more');

    // 3) buy the rug: coins drop, ownership sticks, the hovel shows it
    await page.click('[data-buy="rug"]');
    await new Promise((r) => setTimeout(r, 200));
    const afterRug = await page.evaluate(() => ({
      coins: window.__game.getState().coins,
      owned: window.__game.getState().shop.owned,
      visible: window.__game.homeUpgrades.rug.visible,
      buyAgain: !!document.querySelector('[data-buy="rug"]'),
      histType: window.__game.getState().history.at(-1).type,
    }));
    console.log('rug:', JSON.stringify(afterRug));
    if (afterRug.coins !== 1750) errors.push(`market: coins ${afterRug.coins} != 1750 after the rug`);
    if (!afterRug.owned.includes('rug')) errors.push('market: rug not owned after purchase');
    if (!afterRug.visible) errors.push('market: rug bought but not shown in the hovel');
    if (afterRug.buyAgain) errors.push('market: rug still for sale after purchase');
    if (afterRug.histType !== 'purchase') errors.push(`market: history type ${afterRug.histType} != purchase`);

    // 4) rank gate: the quarterstaff is not sold to a Peasant
    const staff = await page.evaluate(() => ({
      buyable: !!document.querySelector('[data-buy="quarterstaff"]'),
      gated: document.getElementById('shop-body').textContent.includes('for a Squire'),
    }));
    console.log('staff gate:', JSON.stringify(staff));
    if (staff.buyable) errors.push('market: quarterstaff sold to a Peasant');
    if (!staff.gated) errors.push('market: quarterstaff gate not shown');
    // the shop with its pictures: the rug owned, the quarterstaff faded behind its gate
    await (await page.$('#shop-panel')).screenshot({ path: 'scripts/smoke-shop.png' });

    // 5) the cudgel arms the player
    await page.click('[data-buy="cudgel"]');
    await new Promise((r) => setTimeout(r, 200));
    const armed = await page.evaluate(() => ({
      coins: window.__game.getState().coins,
      damage: window.__game.player.attackDamage,
    }));
    console.log('cudgel:', JSON.stringify(armed));
    if (armed.coins !== 1450) errors.push(`market: coins ${armed.coins} != 1450 after the cudgel`);
    if (armed.damage !== 2) errors.push(`market: attackDamage ${armed.damage} != 2 with the cudgel`);

    // 6) loaves: sold at full health now — they go to the chest's larder, not
    //    the mouth — until the larder is full
    const cap = await page.evaluate(() => window.__game.CONFIG.chest.larderCap);
    for (let i = 0; i < cap; i++) {
      await page.click('[data-buy="loaf"]');
      await new Promise((r) => setTimeout(r, 120));
    }
    const stocked = await page.evaluate(() => ({
      hp: window.__game.player.hp,
      coins: window.__game.getState().coins,
      loaves: window.__game.getState().chest.loaves,
      full: document.querySelector('[data-buy="loaf"]')?.disabled,
    }));
    console.log('larder:', JSON.stringify(stocked));
    if (stocked.loaves !== cap) errors.push(`market: larder holds ${stocked.loaves} != ${cap} loaves`);
    if (stocked.coins !== 1450 - 10 * cap) errors.push(`market: coins ${stocked.coins} != ${1450 - 10 * cap} after the loaves`);
    if (stocked.hp !== 20) errors.push(`market: hp ${stocked.hp} changed by buying bread`);
    if (!stocked.full) errors.push('market: loaf still sold with the larder full');
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));

    // 6b) home: at the rack by the door the stick and the cudgel trade places
    //     in hand (each pictured, each with its read-more, without the cart's
    //     talk of buying); then the chest: E lifts the lid, the panel holds
    //     the larder, and a loaf mends the wounded
    await page.evaluate(() => {
      const g = window.__game;
      g.door.isOpen || g.door.toggle(); // the rack is reached from inside
      g.player.pos.x = -7.95; // inside the hovel, before the rack
      g.player.pos.z = 2.3;
    });
    await page.waitForFunction(() => document.getElementById('interact-prompt').textContent.includes('weapon rack'), { timeout: 4000 }).catch(() => {});
    await page.keyboard.press('KeyE');
    await new Promise((r) => setTimeout(r, 400));
    const rackOpen = await page.evaluate(() => ({
      panel: !document.getElementById('rack-panel').classList.contains('hidden'),
      hand: document.getElementById('rack-body').textContent.includes('oaken cudgel'),
      pictures: [...document.querySelectorAll('#rack-body .ware-pic svg')].filter(
        (svg) => svg.querySelectorAll('path, rect, circle, ellipse').length >= 5
      ).length,
    }));
    console.log('rack:', JSON.stringify(rackOpen));
    if (!rackOpen.panel) errors.push('market: E at the rack did not open its panel');
    if (rackOpen.pictures !== 2) errors.push(`market: rack shows ${rackOpen.pictures} pictures, not 2 (stick, cudgel)`);
    await page.click('#rack-body .ware-pic[data-more="cudgel"]');
    await new Promise((r) => setTimeout(r, 150));
    const rackLore = await page.evaluate(() => document.querySelector('#rack-body .ware-more')?.textContent ?? '');
    if (!rackLore.includes('How to use it')) errors.push('market: the rack\'s cudgel did not unfold its read-more');
    if (rackLore.includes('Once bought')) errors.push('market: the rack\'s read-more still talks of buying');
    await page.click('#rack-body .ware-more-link[data-more="cudgel"]');
    await new Promise((r) => setTimeout(r, 150));
    await page.click('[data-wield="stick"]');
    await new Promise((r) => setTimeout(r, 150));
    const stickDamage = await page.evaluate(() => window.__game.player.attackDamage);
    await page.click('[data-wield="cudgel"]');
    await new Promise((r) => setTimeout(r, 150));
    const swapped = await page.evaluate(() => ({
      damage: window.__game.player.attackDamage,
      wielded: window.__game.getState().chest.wielded,
    }));
    console.log('swap:', JSON.stringify({ stickDamage, ...swapped }));
    if (stickDamage !== 1) errors.push(`market: stick in hand but attackDamage ${stickDamage} != 1`);
    if (swapped.damage !== 2 || swapped.wielded !== 'cudgel') errors.push(`market: cudgel back in hand -> ${JSON.stringify(swapped)}`);
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));

    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = -9.2; // inside the hovel, at the chest's corner against the -z wall
      g.player.pos.z = 1.05;
      g.player.takeDamage(6, 0, 0);
    });
    await page.waitForFunction(() => document.getElementById('interact-prompt').textContent.includes('open the chest'), { timeout: 4000 }).catch(() => {});
    await page.keyboard.press('KeyE');
    await new Promise((r) => setTimeout(r, 400));
    const chestOpen = await page.evaluate(() => ({
      panel: !document.getElementById('chest-panel').classList.contains('hidden'),
      lid: window.__game.chest.isOpen,
      // the larder's loaf, with its picture
      pictures: [...document.querySelectorAll('#chest-body .ware-pic svg')].filter(
        (svg) => svg.querySelectorAll('path, rect, circle, ellipse').length >= 5
      ).length,
    }));
    console.log('chest:', JSON.stringify(chestOpen));
    if (!chestOpen.panel || !chestOpen.lid) errors.push('market: E at the chest did not open lid + panel');
    if (chestOpen.pictures !== 1) errors.push(`market: chest shows ${chestOpen.pictures} pictures, not 1 (the loaf)`);
    await page.click('[data-eat]');
    await new Promise((r) => setTimeout(r, 150));
    const fed = await page.evaluate(() => ({
      hp: window.__game.player.hp,
      loaves: window.__game.getState().chest.loaves,
      haleNow: document.querySelector('[data-eat]').disabled,
    }));
    console.log('loaf:', JSON.stringify(fed));
    if (fed.hp !== 20) errors.push(`market: loaf left hp at ${fed.hp}`);
    if (fed.loaves !== cap - 1) errors.push(`market: larder ${fed.loaves} != ${cap - 1} after eating`);
    if (!fed.haleNow) errors.push('market: eating still offered at full health');
    await page.screenshot({ path: 'scripts/smoke-chest.png' });
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));
    if (await page.evaluate(() => window.__game.chest.isOpen)) errors.push('market: closing the chest panel left the lid up');
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = 1.5; // back to the cart for its portrait
      g.player.pos.z = 9.0;
    });

    // 7) cart portrait, then the empty spot on a non-market day
    await page.evaluate(() => window.__game.orbitCam.setView(-1.1, 0.3, 5.5));
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: 'scripts/smoke-market.png' });
    await page.goto(`http://localhost:${PORT}/?smoke=market&market=0${DAY}`, { waitUntil: WAIT });
    await new Promise((r) => setTimeout(r, 2000));
    const offDay = await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = 1.5;
      g.player.pos.z = 9.0;
      return { cart: g.cart };
    });
    await new Promise((r) => setTimeout(r, 400));
    const offPrompt = await page.evaluate(() =>
      document.getElementById('interact-prompt').classList.contains('hidden')
    );
    console.log('off-day:', JSON.stringify({ cart: offDay.cart, promptHidden: offPrompt }));
    if (offDay.cart !== null) errors.push('market: cart present though market=0');
    if (!offPrompt) errors.push('market: something still prompts at the empty spot');
  } else if (scenario === 'farm') {
    // The miller's strip. A v10 save gains a fallow field; E at a ridge works
    // it (tool in hand, the ridge redrawn, no pay yet); the last ridge
    // finishes the job and pays the wage once; one job a day; the save
    // carries it across a reload. Then the rest of the crop on a pinned clock
    // — sow, weed, reap — to the harvest and back to stubble.
    const read = () =>
      page.evaluate(() => {
        const g = window.__game;
        const st = g.getState();
        const prompt = document.getElementById('interact-prompt');
        return {
          version: st.saveVersion,
          latest: g.CONFIG.saveVersion,
          farm: st.farm,
          coins: st.coins,
          looks: g.field.looks(),
          job: g.farmJob(),
          mode: g.player.mode,
          stick: g.player.mesh.weapon.visible,
          hoe: g.player.mesh.tools.hoe.visible,
          prompt: prompt.classList.contains('hidden') ? '' : prompt.textContent,
          promptRow: g.field.spot.row,
          toasts: document.getElementById('toasts').textContent,
        };
      });
    // stand beside a ridge's middle, a step off its crest
    const standAt = (row) =>
      page.evaluate((r) => {
        const g = window.__game;
        const p = g.field.nearestOnRow(r, g.field.at.x, g.field.at.z);
        g.player.pos.x = p.x + 0.35;
        g.player.pos.z = p.z + 0.3;
      }, row);
    const until = (fn, arg, ms = 15000) => page.waitForFunction(fn, { timeout: ms, polling: 100 }, arg).then(() => true, () => false);
    const rows = await page.evaluate(() => window.__game.CONFIG.farm.rows);
    const all = (looks, name) => looks.length === rows && looks.every((l) => l === name);
    const wage = await page.evaluate(() => window.__game.CONFIG.farm.wage);
    const harvestPay = await page.evaluate(() => window.__game.CONFIG.farm.harvestPay);

    // 1) the migration: current version, a fallow strip, stubble drawn
    const fallow = await read();
    console.log('migrated:', JSON.stringify({ version: fallow.version, farm: fallow.farm, looks: fallow.looks, job: fallow.job }));
    if (fallow.version !== fallow.latest) errors.push(`farm: saveVersion ${fallow.version} != current ${fallow.latest}`);
    if (fallow.farm?.stage !== 0 || fallow.farm?.done?.length !== 0 || fallow.farm?.workedOn !== null)
      errors.push(`farm: migrated field ${JSON.stringify(fallow.farm)} is not fallow`);
    if (!all(fallow.looks, 'stubble')) errors.push(`farm: fallow strip drawn as ${fallow.looks}`);
    if (fallow.job !== 'till') errors.push(`farm: first job ${fallow.job} != till`);

    // 2) at a ridge the prompt offers the day's job; E sends him to the head
    // of the ridge and he takes up the hoe there
    await standAt(2);
    if (!(await until(() => document.getElementById('interact-prompt').textContent.includes('till this ridge'))))
      errors.push(`farm: prompt "${(await read()).prompt}" does not offer the tilling`);
    await page.keyboard.press('KeyE');
    const walking = await page.evaluate(() => ({ route: !!window.__game.player.route, mode: window.__game.player.mode }));
    if (!walking.route && walking.mode !== 'work') errors.push('farm: E at the ridge sent him nowhere');
    // Looked at every frame: a frame at work with the prompt gone (it goes with
    // the next frame, not the keypress) is the snapshot.
    const midWork = await page
      .waitForFunction(
        () => {
          const g = window.__game;
          const prompt = document.getElementById('interact-prompt');
          if (g.player.mode !== 'work') return false;
          window.__farmSeen = { mode: 'work', hoe: g.player.mesh.tools.hoe.visible, stick: g.player.mesh.weapon.visible, prompt: prompt.classList.contains('hidden') ? '' : prompt.textContent };
          return window.__farmSeen.prompt === '' && window.__farmSeen;
        },
        { polling: 'raf', timeout: 15000 }
      )
      .then((h) => h.jsonValue(), () => null);
    // never caught mid-work with the prompt gone: report the last work frame seen, if any
    const working = midWork ?? (await page.evaluate(() => window.__farmSeen ?? null));
    console.log('working:', JSON.stringify(working));
    if (!working) errors.push('farm: E at the ridge did not start the work');
    else {
      if (!working.hoe || working.stick) errors.push(`farm: tilling with hoe ${working.hoe} / stick ${working.stick} — the hoe should be in hand`);
      if (working.prompt) errors.push(`farm: prompt "${working.prompt}" still showing while he works`);
    }

    // 2b) the ridge changes only as far as the hoe has gone: partway along,
    // a stretch is furrow from the end he began at and the rest still stubble
    if (!(await until(() => (window.__game.getState().farm.part[2]?.k ?? 0) >= 0.3, undefined, 20000)))
      errors.push(`farm: no stretch of ridge 2 worked (${JSON.stringify((await read()).farm)})`);
    const partway = await page.evaluate(() => {
      const g = window.__game;
      const p = g.getState().farm.part[2];
      const HL = g.field.halfLength;
      const at = (u) => { const w = g.field.ridgePoint(2, u); return g.field.riseAt(w.x, w.z); };
      const doneU = p.end * (HL - 1); // a step in from the end he began at
      const leftU = -p.end * (HL - 1); // ...and a step in from the other
      return { part: p, parts: g.farmRowParts(), done: g.getState().farm.done, crownWorked: at(doneU), crownLeft: at(leftU), mode: g.player.mode,
        // he stands on the earth, not in it
        feet: g.player.pos.y, ground: g.player.groundAt(g.player.pos.x, g.player.pos.z), rise: g.field.riseAt(g.player.pos.x, g.player.pos.z) };
    });
    console.log('partway:', JSON.stringify(partway));
    if (partway.done.length) errors.push(`farm: ridge done ${partway.done} partway along it`);
    if (partway.parts[2]?.look !== 'furrow') errors.push(`farm: the worked stretch wears ${partway.parts[2]?.look}, not furrow`);
    if (!(partway.crownWorked > 0.2 && partway.crownLeft < 0.12))
      errors.push(`farm: the crown stands ${partway.crownWorked} where worked and ${partway.crownLeft} where not — the whole ridge changed at once`);
    if (Math.abs(partway.feet - partway.ground) > 0.02 || !(partway.rise > 0.03))
      errors.push(`farm: his feet at ${partway.feet} and the earth at ${partway.ground} (rise ${partway.rise}) — he is not walking on it`);

    // 2c) a movement key calls him off; what is worked stays worked, and is saved
    await page.keyboard.down('KeyS');
    await new Promise((r) => setTimeout(r, 450));
    await page.keyboard.up('KeyS');
    await new Promise((r) => setTimeout(r, 900));
    const left = await page.evaluate(() => ({
      mode: window.__game.player.mode,
      stick: window.__game.player.mesh.weapon.visible,
      part: window.__game.getState().farm.part[2],
      saved: JSON.parse(localStorage.getItem('crownbound_save')).farm.part[2],
    }));
    console.log('called off:', JSON.stringify(left));
    if (left.mode !== 'normal' || !left.stick) errors.push(`farm: a movement key left him at ${left.mode} (stick ${left.stick})`);
    if (!left.part || left.part.k < partway.part.k) errors.push(`farm: the stretch worked was lost on leaving the ridge (${JSON.stringify(left.part)})`);
    if (!left.saved || left.saved.k !== left.part?.k) errors.push(`farm: the stretch worked was not saved (${JSON.stringify(left.saved)})`);

    // 2d) E again takes up where he left off, from the same end
    await standAt(2);
    await until(() => window.__game.field.spot.row === 2, undefined, 5000);
    await page.keyboard.press('KeyE');
    // where he stands the first frame he is back at work (read in that frame: they are slow here)
    const resumed = await page
      .waitForFunction(
        () => {
          const g = window.__game;
          if (g.player.mode !== 'work') return false;
          const HL = g.field.halfLength;
          const u = g.field.toField(g.player.pos.x, g.player.pos.z).u;
          return { k: (HL - g.getState().farm.part[2].end * u) / (HL * 2) };
        },
        { polling: 'raf', timeout: 15000 }
      )
      .then((h) => h.jsonValue(), () => null);
    console.log('resumed:', JSON.stringify(resumed));
    if (!resumed) errors.push('farm: E did not take him back to the ridge');
    else if (Math.abs(resumed.k - left.part.k) > 0.12) errors.push(`farm: resumed at ${resumed.k.toFixed(2)} of the ridge, not where he left off (${left.part.k})`);

    // 3) the ridge is done: redrawn as a furrow, the stick back, no pay yet,
    // and the prompt has moved on to a ridge that still wants the hoe
    if (!(await until(() => window.__game.getState().farm.done.length === 1, undefined, 30000))) errors.push('farm: the ridge was never finished');
    await new Promise((r) => setTimeout(r, 300));
    const one = await read();
    console.log('one ridge:', JSON.stringify({ farm: one.farm, looks: one.looks, coins: one.coins, prompt: one.prompt, promptRow: one.promptRow }));
    if (one.farm.done[0] !== 2) errors.push(`farm: worked ridge ${one.farm.done[0]} != 2, the one he stood at`);
    if (Object.keys(one.farm.part).length) errors.push(`farm: a finished ridge still counted as begun (${JSON.stringify(one.farm.part)})`);
    if (one.looks[2] !== 'furrow' || one.looks.filter((l) => l === 'stubble').length !== rows - 1)
      errors.push(`farm: after one ridge the strip is drawn ${one.looks}`);
    if (one.mode !== 'normal' || !one.stick || one.hoe) errors.push(`farm: after the ridge mode ${one.mode}, stick ${one.stick}, hoe ${one.hoe}`);
    if (one.coins !== 30) errors.push(`farm: paid ${one.coins - 30}c before the job was done`);
    if (!one.prompt.includes('till this ridge') || one.promptRow === 2)
      errors.push(`farm: prompt "${one.prompt}" on ridge ${one.promptRow} — should offer a ridge still untilled`);

    // the tilled ridge stands up off the ground: on its crown he is higher than in the furrow beside it
    const heights = await page.evaluate(() => {
      const g = window.__game;
      const at = (side) => {
        const w = g.field.ridgePoint(2, 0, side);
        return g.player.groundAt(w.x, w.z);
      };
      return { crown: at(0), furrow: at(g.field.ridgeHalf) };
    });
    if (!(heights.crown - heights.furrow > 0.15)) errors.push(`farm: the tilled crown ${heights.crown} is not above its furrow ${heights.furrow} underfoot`);

    // 4) the other ridges (worked briskly — the pace is a tuning number): the
    // last one finishes the job and the miller pays, once
    const pace = await page.evaluate(() => window.__game.CONFIG.farm.workPace);
    await page.evaluate(() => { window.__game.CONFIG.farm.workPace = 9; });
    for (const row of Array.from({ length: rows }, (_, r) => r).filter((r) => r !== 2)) {
      await standAt(row);
      await until((r) => window.__game.field.spot.row === r, row, 5000);
      await page.keyboard.press('KeyE');
      const worked = await until((r) => {
        const f = window.__game.getState().farm;
        return f.done.includes(r) || f.stage === 1;
      }, row, 30000);
      if (!worked) errors.push(`farm: ridge ${row} was never finished`);
    }
    await page.evaluate((p) => { window.__game.CONFIG.farm.workPace = p; }, pace);
    await new Promise((r) => setTimeout(r, 300));
    const tilled = await read();
    console.log('tilled:', JSON.stringify({ farm: tilled.farm, looks: tilled.looks, coins: tilled.coins, job: tilled.job, prompt: tilled.prompt, toasts: tilled.toasts }));
    if (tilled.farm.stage !== 1 || tilled.farm.done.length !== 0 || tilled.farm.workedOn !== dstr(0))
      errors.push(`farm: after tilling the field is ${JSON.stringify(tilled.farm)}`);
    if (tilled.coins !== 30 + wage) errors.push(`farm: coins ${tilled.coins} != ${30 + wage} after the day's wage`);
    if (!all(tilled.looks, 'furrow')) errors.push(`farm: tilled strip drawn as ${tilled.looks}`);
    if (!tilled.toasts.includes('The strip is tilled')) errors.push(`farm: no wage toast ("${tilled.toasts}")`);

    // 5) one job a day: nothing more to do, E only looks the strip over
    if (tilled.job !== null) errors.push(`farm: a second job (${tilled.job}) offered the same day`);
    if (!(await until(() => document.getElementById('interact-prompt').textContent.includes('look over the strip'), undefined, 5000)))
      errors.push(`farm: prompt "${(await read()).prompt}" after the day's job`);
    await page.keyboard.press('KeyE');
    await new Promise((r) => setTimeout(r, 500));
    const idle = await page.evaluate(() => ({
      mode: window.__game.player.mode,
      refused: window.__game.workFarmRow(0),
      toasts: document.getElementById('toasts').textContent,
      coins: window.__game.getState().coins,
    }));
    console.log('same day:', JSON.stringify(idle));
    if (idle.mode === 'work' || idle.refused !== null || idle.coins !== 30 + wage) errors.push('farm: more work was had the same day');
    if (!idle.toasts.includes('on the morrow')) errors.push(`farm: no word on what the strip waits for ("${idle.toasts}")`);

    // 6) the save carries the field across a reload
    await page.reload({ waitUntil: WAIT });
    await new Promise((r) => setTimeout(r, 2000));
    const kept = await read();
    console.log('after reload:', JSON.stringify({ farm: kept.farm, looks: kept.looks, coins: kept.coins, job: kept.job }));
    if (kept.farm.stage !== 1 || !all(kept.looks, 'furrow') || kept.coins !== 30 + wage || kept.job !== null)
      errors.push(`farm: the field did not survive a reload: ${JSON.stringify(kept.farm)} drawn ${kept.looks}`);

    // 7) the rest of the crop, a day at a time on a pinned clock
    const crop = await page.evaluate((n) => {
      const g = window.__game;
      const day = (offset) => {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        return d;
      };
      const workAll = (d) => {
        const results = [];
        for (let r = 0; r < n; r++) results.push(g.workFarmRow(r, d));
        return results;
      };
      const out = {};
      // day 1: sowing
      out.sowJob = g.farmJob(day(1));
      out.beforeSow = g.farmRowLooks(day(1));
      out.firstSown = g.workFarmRow(3, day(1));
      out.twice = g.workFarmRow(3, day(1)); // the same ridge again
      out.partSown = g.farmRowLooks(day(1));
      // a stretch of ridge 5 sown from its +u end: begun, not done, and not
      // to be begun again from the other end
      out.stretch = g.workFarmStretch(5, 1, 0.4, day(1));
      out.shorter = g.workFarmStretch(5, 1, 0.2, day(1)); // no ground lost
      out.otherEnd = g.workFarmStretch(5, -1, 0.5, day(1));
      out.parts = g.farmRowParts(day(1));
      out.stretchLooks = g.farmRowLooks(day(1));
      out.sowing = workAll(day(1)); // ridge 3 refuses, the rest finish it
      out.partsAfter = g.farmRowParts(day(1));
      out.partLeft = g.getState().farm.part;
      out.sown = g.farmRowLooks(day(1));
      out.sameDay = g.farmJob(day(1));
      out.coinsSown = g.getState().coins;
      // a night later the shoots are up, weeds among them — and wait as long as he likes
      out.weedy = g.farmRowLooks(day(2));
      out.muchLater = g.farmRowLooks(day(12));
      out.tendJob = g.farmJob(day(2));
      workAll(day(2));
      out.tended = g.farmRowLooks(day(2));
      // day 3: the wheat stands ripe; reaping
      out.ripe = g.farmRowLooks(day(3));
      out.reapJob = g.farmJob(day(3));
      out.firstCut = g.workFarmRow(0, day(3));
      out.partCut = g.farmRowLooks(day(3));
      const before = g.getState().history.length;
      out.reaping = workAll(day(3));
      out.stooks = g.farmRowLooks(day(3));
      out.harvestDeeds = g.getState().history.slice(before).map((h) => h.type);
      out.coinsEnd = g.getState().coins;
      out.farmEnd = g.getState().farm;
      // day 4: the sheaves are gone, the strip wants the hoe again
      out.stubble = g.farmRowLooks(day(4));
      out.nextJob = g.farmJob(day(4));
      return out;
    }, rows);
    console.log('crop:', JSON.stringify(crop));
    if (crop.sowJob !== 'sow' || !all(crop.beforeSow, 'furrow')) errors.push(`farm: day 1 offers ${crop.sowJob} on ${crop.beforeSow}`);
    if (crop.firstSown?.job !== 'sow' || crop.firstSown?.done || crop.firstSown?.coins !== 0)
      errors.push(`farm: first sown ridge returned ${JSON.stringify(crop.firstSown)}`);
    if (crop.twice !== null) errors.push('farm: the same ridge was sown twice');
    if (crop.partSown[3] !== 'sown' || crop.partSown.filter((l) => l === 'furrow').length !== rows - 1)
      errors.push(`farm: half-sown strip drawn ${crop.partSown}`);
    if (crop.stretch?.done !== false || crop.shorter?.done !== false || crop.otherEnd !== null)
      errors.push(`farm: stretches of ridge 5 returned ${JSON.stringify([crop.stretch, crop.shorter, crop.otherEnd])}`);
    if (JSON.stringify(crop.parts) !== JSON.stringify({ 5: { end: 1, k: 0.4, look: 'sown' } }))
      errors.push(`farm: ridge 5 half sown is ${JSON.stringify(crop.parts)}`);
    if (crop.stretchLooks[5] !== 'furrow') errors.push(`farm: a ridge half sown counted as sown (${crop.stretchLooks[5]})`);
    if (Object.keys(crop.partsAfter).length || Object.keys(crop.partLeft).length)
      errors.push(`farm: begun ridges ${JSON.stringify(crop.partLeft)} outlived the finished job`);
    const last = crop.sowing.at(-1);
    if (!last?.done || last.coins !== wage) errors.push(`farm: the last sown ridge returned ${JSON.stringify(last)}`);
    if (!all(crop.sown, 'sown') || crop.sameDay !== null) errors.push(`farm: sown strip drawn ${crop.sown}, job ${crop.sameDay}`);
    if (crop.coinsSown !== 30 + wage * 2) errors.push(`farm: coins ${crop.coinsSown} != ${30 + wage * 2} after sowing`);
    if (!all(crop.weedy, 'weedy') || !all(crop.muchLater, 'weedy')) errors.push(`farm: the night after sowing ${crop.weedy}; twelve days on ${crop.muchLater}`);
    if (crop.tendJob !== 'tend' || !all(crop.tended, 'tended')) errors.push(`farm: weeding ${crop.tendJob} left ${crop.tended}`);
    if (!all(crop.ripe, 'ripe') || crop.reapJob !== 'reap') errors.push(`farm: day 3 ${crop.reapJob} on ${crop.ripe}`);
    if (crop.partCut[0] !== 'stook' || crop.partCut.filter((l) => l === 'ripe').length !== rows - 1)
      errors.push(`farm: half-reaped strip drawn ${crop.partCut}`);
    if (crop.reaping.at(-1)?.coins !== harvestPay) errors.push(`farm: harvest paid ${crop.reaping.at(-1)?.coins} != ${harvestPay}`);
    if (crop.harvestDeeds.join() !== 'harvest') errors.push(`farm: harvest wrote history [${crop.harvestDeeds}] != one harvest deed`);
    if (crop.coinsEnd !== 30 + wage * 3 + harvestPay) errors.push(`farm: coins ${crop.coinsEnd} != ${30 + wage * 3 + harvestPay} after the whole crop`);
    if (crop.farmEnd.stage !== 0 || crop.farmEnd.done.length !== 0) errors.push(`farm: after the harvest the field is ${JSON.stringify(crop.farmEnd)}`);
    if (!all(crop.stooks, 'stook') || !all(crop.stubble, 'stubble') || crop.nextJob !== 'till')
      errors.push(`farm: harvest day ${crop.stooks}; the day after ${crop.stubble}, job ${crop.nextJob}`);
    const xp = await page.evaluate(() => Object.values(window.__game.getState().stats).map((s) => `${s.level}:${s.xp}`).join());
    if (xp !== '1:0,1:0,1:0,1:0') errors.push(`farm: field work trained a virtue (${xp})`);

    // 8) the Charter knows the strip and its pay
    await page.evaluate(() => window.__game.openPanel('guide'));
    const charter = await page.evaluate(() => {
      const C = window.__game.CONFIG;
      const text = document.getElementById('guide-body').textContent;
      return text.includes('Miller’s Strip') && text.includes(`${C.farm.wage} coins`) && text.includes(`${C.farm.harvestPay} coins`);
    });
    if (!charter) errors.push('farm: the Charter is silent on the strip or its pay');
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));

    // for the eye: a strip part brought in, the sickle mid-cut on a ridge half
    // reaped, seen from the gate side
    await page.evaluate(() => {
      const g = window.__game;
      const HL = g.field.halfLength;
      g.field.draw(g.field.looks().map((_, r) => (r < 3 ? 'stook' : 'ripe')), { 3: { end: -1, k: 0.45, look: 'stook' } });
      const u = -HL + 0.45 * HL * 2 + 0.6; // just short of the standing wheat
      const from = g.field.ridgePoint(3, u, -0.5);
      const to = g.field.ridgePoint(3, HL - 0.6, -0.5);
      const ahead = g.field.ridgePoint(3, u + 0.6, 0);
      g.player.pos.x = from.x;
      g.player.pos.z = from.z;
      g.orbitCam.setView(-2.75, 0.36, 6.5);
      g.CONFIG.farm.strokeTime = 4; // hold the pose for the camera
      g.CONFIG.farm.workPace = 0.01; // ...and the man
      g.player.startWork('reap', from, to, Math.atan2(ahead.x - from.x, ahead.z - from.z));
    });
    await new Promise((r) => setTimeout(r, 2600));
    await page.screenshot({ path: 'scripts/smoke-farm.png' });
  } else if (scenario === 'crown') {
    // the migration must have stripped the old scheduled deadline
    const migrated = await page.evaluate(() => {
      const st = window.__game.getState();
      // migration must land on the CURRENT version, whatever it is by now
      return { version: st.saveVersion, latest: window.__game.CONFIG.saveVersion, hasDeadline: 'deadline' in st.quests.epic, at: st.coronationAt, chest: st.chest, damage: window.__game.player.attackDamage, stats: st.stats, rank: st.rank };
    });
    console.log('migrated:', JSON.stringify(migrated));
    if (migrated.version !== migrated.latest)
      errors.push(`crown: saveVersion ${migrated.version} != current ${migrated.latest}`);
    if (migrated.hasDeadline) errors.push('crown: epic deadline survived the migration');
    if (migrated.at !== null) errors.push('crown: coronationAt set before the crowning');
    if (migrated.chest?.wielded !== 'quarterstaff' || migrated.chest?.loaves !== 0)
      errors.push(`crown: migrated chest ${JSON.stringify(migrated.chest)} != quarterstaff in hand, empty larder`);
    if (migrated.damage !== 3) errors.push(`crown: migrated attackDamage ${migrated.damage} != 3 (the staff)`);
    // v9→v10: Strength's seat is Athleticism's, Agility's is Intelligence's
    if (Object.keys(migrated.stats).join() !== 'ath,int,wis,inf')
      errors.push(`crown: migrated virtues ${Object.keys(migrated.stats).join()} != ath,int,wis,inf`);
    // v10→v11: Agility's old levels are dropped — Intelligence begins at level 1
    if (migrated.stats.ath?.level !== 24 || migrated.stats.int?.level !== 1 || migrated.stats.int?.xp !== 0)
      errors.push(`crown: migrated ath L${migrated.stats.ath?.level} / int L${migrated.stats.int?.level} +${migrated.stats.int?.xp}xp != L24 / L1 +0xp`);
    if (migrated.rank !== 'Lord') errors.push(`crown: migrated rank ${migrated.rank} != Lord (69 levels)`);

    // complete the last daily: ath 24 -> 25, total levels 70 -> the Coronation
    await page.evaluate(() => window.__game.openPanel('board'));
    await page.type('[data-input]', 'The final deed');
    await page.click('[data-post]');
    await page.click('[data-complete]');
    await page.click('[data-pick="ath"]');
    await page.click('[data-pick-done]');
    await new Promise((r) => setTimeout(r, 400));
    const crowned = await page.evaluate(() => {
      const st = window.__game.getState();
      return {
        rank: st.rank,
        at: st.coronationAt,
        histType: st.history.at(-1).type,
        hudRank: document.getElementById('hud-rank').textContent,
        boardLine: document.getElementById('quest-body').textContent.includes('hath its King'),
        toasts: document.getElementById('toasts').textContent,
      };
    });
    console.log('crowned:', JSON.stringify(crowned));
    if (crowned.rank !== 'King') errors.push(`crown: rank ${crowned.rank} != King`);
    if (!crowned.at) errors.push('crown: coronationAt not recorded');
    if (crowned.histType !== 'coronation') errors.push(`crown: history type ${crowned.histType} != coronation`);
    if (crowned.hudRank !== 'King') errors.push(`crown: HUD rank "${crowned.hudRank}"`);
    if (!crowned.boardLine) errors.push('crown: board does not proclaim the King');
    if (!crowned.toasts.includes('CORONATION')) errors.push('crown: no coronation toast rang out');

    // once and only once: another quest must not crown him again
    const again = await page.evaluate(() => {
      const before = window.__game.getState().coronationAt;
      window.__game.openPanel('board');
      return before;
    });
    await page.type('.quest-block[data-kind="weekly"] [data-input]', 'One more labor');
    await page.click('.quest-block[data-kind="weekly"] [data-post]');
    await page.click('.quest-block[data-kind="weekly"] [data-complete]');
    await page.click('.quest-block[data-kind="weekly"] [data-pick="wis"]');
    await page.click('[data-pick-done]');
    await new Promise((r) => setTimeout(r, 300));
    const still = await page.evaluate(() => ({
      at: window.__game.getState().coronationAt,
      histType: window.__game.getState().history.at(-1).type,
    }));
    console.log('after weekly:', JSON.stringify(still));
    if (still.at !== again) errors.push('crown: coronationAt changed on a later quest');
    if (still.histType !== 'weekly') errors.push(`crown: second coronation appended (${still.histType})`);
  }
  if (scenario === 'spent') {
    // Spent for the day: at nought stamina he walks himself home, lies down on
    // his cot, and the rest card says play resumes tomorrow.
    const until = (fn, arg, ms = 15000) => page.waitForFunction(fn, { timeout: ms, polling: 200 }, arg).then(() => true, () => false);
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const restCard = () => page.evaluate(() => {
      const c = document.getElementById('rest-card');
      return { shown: !c.classList.contains('hidden'), text: c.textContent };
    });

    // 1) out in the miller's strip, inside its fence: the last of the pool goes
    const set = await page.evaluate(() => {
      const g = window.__game;
      g.player.respawn(27, 33);
      g.drainStamina(g.getState().stamina.current);
      return { flag: g.getState().stamina.spent, stamina: g.getState().stamina.current };
    });
    await wait(800);
    const going = await page.evaluate(() => ({ ...window.__game.spent(), enabled: window.__game.player.isEnabled(), route: !!window.__game.player.route }));
    console.log('spent:', JSON.stringify(set), JSON.stringify(going));
    if (!set.flag || set.stamina !== 0) errors.push(`spent: pool at ${set.stamina}, spent flag ${set.flag}`);
    if (!going.homeward || !going.route) errors.push('spent: he did not set off for home');
    if (going.enabled) errors.push('spent: the keys still steer him on the way home');

    // 2) he walks home — out through the field gate — and lies down abed
    const home = await until(() => window.__game.spent().resting, null, 90000);
    const abed = await page.evaluate(() => {
      const g = window.__game;
      const p = g.player;
      return { ...g.spent(), mode: p.mode, lie: p.lie01, enabled: p.isEnabled(), door: g.door.isOpen, x: p.pos.x, z: p.pos.z };
    });
    const card = await restCard();
    console.log('abed:', JSON.stringify(abed), JSON.stringify(card.text.slice(0, 120)));
    if (!home) errors.push('spent: never reached his cot');
    if (abed.last !== 'walked') errors.push(`spent: the walk home was ${abed.last}, not walked`);
    if (abed.mode !== 'sleep' || abed.lie < 0.9) errors.push(`spent: not lying on the cot (mode ${abed.mode}, lie ${abed.lie})`);
    if (abed.enabled) errors.push('spent: he can be steered abed');
    if (!abed.door) errors.push('spent: he walked through a shut door');
    if (!card.shown) errors.push('spent: no rest card');
    if (!card.text.includes('tomorrow')) errors.push('spent: the card does not say play resumes tomorrow');
    if (!card.text.includes('thy strength returns at once')) errors.push('spent: the card forgets the deed still owed');
    await page.screenshot({ path: 'scripts/smoke-spent.png' });

    // 3) the keys have no say abed
    const before = abed;
    await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' })));
    await wait(1000);
    await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyW' })));
    const still = await page.evaluate(() => ({ x: window.__game.player.pos.x, z: window.__game.player.pos.z, mode: window.__game.player.mode }));
    if (Math.hypot(still.x - before.x, still.z - before.z) > 0.05 || still.mode !== 'sleep') errors.push('spent: W moved him out of bed');

    // 4) the Quest Board from bed: the deed counts, refills the pool, and gets him up
    await page.click('[data-rest="board"]');
    await page.type('[data-input]', 'Evening lift');
    await page.click('[data-post]');
    await page.click('[data-complete]');
    await page.click('[data-pick="ath"]');
    await page.click('[data-pick-done]');
    await page.keyboard.press('Escape');
    await wait(600);
    const deed = await page.evaluate(() => {
      const g = window.__game;
      const st = g.getState();
      return { done: st.quests.daily.deeds.some((d) => d.completed), streak: st.streak.current, xp: st.stats.ath.xp, stamina: st.stamina.current, flag: !!st.stamina.spent, ...g.spent(), mode: g.player.mode, enabled: g.player.isEnabled(), abedClass: document.body.classList.contains('abed') };
    });
    const card2 = await restCard();
    console.log('deed from bed:', JSON.stringify(deed));
    if (!deed.done || deed.streak !== 1 || deed.xp !== 25) errors.push('spent: the daily from bed did not count');
    if (deed.stamina !== 480 || deed.flag) errors.push(`spent: the daily from bed did not refill the pool (${deed.stamina}, spent ${deed.flag})`);
    if (deed.resting || deed.mode !== 'normal' || !deed.enabled) errors.push(`spent: the daily from bed did not get him up (${JSON.stringify(deed)})`);
    if (card2.shown || deed.abedClass) errors.push('spent: the rest card stayed up after he rose');

    // 4b) spent again, the daily already done: home from inside the hovel, and abed for good
    await page.evaluate(() => window.__game.drainStamina(window.__game.getState().stamina.current));
    const again = await until(() => window.__game.spent().resting, null, 30000);
    const card2b = await restCard();
    if (!again || !card2b.shown) errors.push('spent: a second emptying did not put him back to bed');
    if (card2b.text.includes('thy strength returns at once')) errors.push('spent: the card offers a refill with the daily already done');

    // 5) retire for the night marks a real bedtime
    await page.click('[data-rest="retire"]');
    const retired = await page.evaluate(() => Date.now() - new Date(window.__game.getState().sleep.retiredAt).getTime());
    if (!(retired >= 0 && retired < 60000)) errors.push(`spent: retiring did not mark the bedtime (${retired}ms ago)`);

    // 6) opened again the same day: found abed at once
    await page.reload({ waitUntil: WAIT });
    await until(() => window.__game && window.__game.spent);
    await wait(1500);
    const reload = await page.evaluate(() => ({ ...window.__game.spent(), mode: window.__game.player.mode, enabled: window.__game.player.isEnabled() }));
    const card3 = await restCard();
    console.log('after reload:', JSON.stringify(reload));
    if (!reload.resting || reload.mode !== 'sleep' || reload.enabled || !card3.shown) errors.push('spent: a reload got him out of bed');

    // 7) a new day: up and about, strength back
    await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('crownbound_save'));
      s.stamina.date = '2000-01-01';
      localStorage.setItem('crownbound_save', JSON.stringify(s));
    });
    await page.reload({ waitUntil: WAIT });
    await until(() => window.__game && window.__game.spent);
    await wait(1000);
    const morning = await page.evaluate(() => ({ ...window.__game.spent(), enabled: window.__game.player.isEnabled(), stamina: window.__game.getState().stamina }));
    const card4 = await restCard();
    console.log('next day:', JSON.stringify(morning));
    if (morning.resting || !morning.enabled || card4.shown) errors.push('spent: still abed on a new day');
    if (morning.stamina.spent || morning.stamina.current !== 480) errors.push(`spent: the new day's pool is ${JSON.stringify(morning.stamina)}`);

    // 8) E hurries the walk home
    await page.evaluate(() => {
      const g = window.__game;
      g.player.respawn(4, -0.5); // by the Quest Board
      g.drainStamina(g.getState().stamina.current);
    });
    await wait(700);
    await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE' })));
    await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyE' })));
    const hurried = await until(() => window.__game.spent().resting, null, 10000);
    const h = await page.evaluate(() => ({ ...window.__game.spent(), mode: window.__game.player.mode }));
    console.log('hurried:', JSON.stringify(h));
    if (!hurried || h.last !== 'hurried' || h.mode !== 'sleep') errors.push(`spent: E did not hurry him home (${JSON.stringify(h)})`);
  }

  if (scenario === 'intro') {
    // The opening: a blank save begins on the title, the dream, the waking and
    // the oath; then the cold fire's waymark leads to the door and the board.
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const until = (fn, arg, ms = 20000) => page.waitForFunction(fn, { timeout: ms, polling: 100 }, arg).then(() => true, () => false);
    const want = (ok, what) => {
      if (!ok) errors.push(`intro: ${what}`);
    };
    const BASE = `http://localhost:${PORT}/?smoke=intro${NOON}`;
    const booted = async () => {
      await until(() => window.__game);
      await wait(1500);
    };
    const load = async (extra = '') => {
      await page.goto(BASE + extra, { waitUntil: WAIT, timeout: 40000 });
      await booted();
    };
    // what the opening and the game around it are doing
    const look = () =>
      page.evaluate(() => {
        const g = window.__game;
        const p = g.player;
        const s = g.getState();
        const wm = document.getElementById('waymark');
        const cap = document.getElementById('caption');
        return {
          beat: g.intro.beat(),
          shown: !document.getElementById('intro').classList.contains('hidden'),
          hudHidden: document.body.classList.contains('opening'),
          owed: s.introOwed === true,
          enabled: p.isEnabled(),
          mode: p.mode,
          lie: p.lie01,
          x: p.pos.x,
          z: p.pos.z,
          panel: g.openPanelId(),
          waymark: g.intro.waymark(),
          mark: wm.classList.contains('hidden') ? '' : wm.textContent,
          edge: wm.dataset.edge,
          caption: cap.classList.contains('hidden') ? '' : cap.textContent,
          toasts: document.getElementById('toasts').textContent,
          epic: s.quests.epic.text,
          daily: (s.quests.daily.deeds[0]?.text ?? ''),
          dailyDone: s.quests.daily.deeds.some((d) => d.completed),
          coins: s.coins,
          fireCold: g.intro.fireCold(),
          url: location.href,
        };
      });
    const inHovel = (v) => v.x > -10.6 && v.x < -7.4 && v.z > 0.6 && v.z < 3.4;

    // 1) a blank save: the title, him abed in his hovel, nothing else on
    let v = await look();
    console.log('title:', JSON.stringify(v));
    want(v.beat === 'title' && v.shown && v.hudHidden, `a blank save did not open on the title (${v.beat})`);
    want(v.owed, 'a blank save does not owe the opening');
    want(!v.enabled && v.mode === 'sleep' && v.lie > 0.9 && inHovel(v), `he is not abed in his hovel (${v.mode}, lie ${v.lie})`);
    want(v.toasts === '' && v.mark === '', 'toasts or a waymark showed under the title');
    const title = await page.evaluate(() => document.querySelector('.intro-title')?.textContent ?? '');
    want(title.includes('Crownbound') && title.includes('Enter'), `the title reads "${title}"`);
    // the game's own keys do nothing under it
    await page.keyboard.press('KeyE');
    await page.keyboard.press('KeyM');
    await page.keyboard.down('KeyW');
    await wait(600);
    await page.keyboard.up('KeyW');
    const still = await look();
    want(still.panel === null && still.mode === 'sleep' && still.beat === 'title', `a game key reached the game under the title (${JSON.stringify({ panel: still.panel, mode: still.mode })})`);

    // 2) left unfinished, it is owed again on the next load
    await page.reload({ waitUntil: WAIT });
    await booted();
    v = await look();
    want(v.beat === 'title' && v.owed, 'an unfinished opening was not played again on the next load');

    // 3) Enter begins: the dream — a crown, and the line
    await page.keyboard.press('Enter');
    v = await look();
    want(v.beat === 'dream', `Enter did not begin the dream (${v.beat})`);
    const dream = await page.evaluate(() => ({ crown: !!document.querySelector('.dream-crown svg path'), line: document.querySelector('.dream-line')?.textContent }));
    want(dream.crown && dream.line === 'Thou art King.', `the dream shows ${JSON.stringify(dream)}`);
    await wait(4300);
    await page.screenshot({ path: 'scripts/smoke-intro-dream.png' });
    // ...snatched away, and "Not yet."
    const snatched = await until(() => document.querySelector('.intro-dream.not'), null, 8000);
    want(snatched, 'the dream was never snatched away');

    // 4) the waking: the dark lifts on him abed; the village is named, the hour kept
    await until(() => window.__game.intro.beat() === 'waking', null, 8000);
    await until(() => document.querySelectorAll('.intro-caption p.on').length === 2, null, 10000);
    const lines = await page.evaluate(() => [...document.querySelectorAll('.intro-caption p')].map((p) => p.textContent));
    console.log('waking:', JSON.stringify(lines));
    want(lines[0] === 'Another day in Brackenley.' && lines[1] === 'Nothing changes unless thou dost.', `the waking's lines read ${JSON.stringify(lines)}`);
    await wait(1400);
    await page.screenshot({ path: 'scripts/smoke-intro-waking.png' });

    // 5) he gets up by himself, and the oath is laid before him
    const sworn = await until(() => window.__game.intro.beat() === 'oath', null, 20000);
    v = await look();
    console.log('oath:', JSON.stringify({ beat: v.beat, mode: v.mode, lie: v.lie, x: v.x, z: v.z, enabled: v.enabled }));
    want(sworn, 'the oath never came');
    want(v.mode === 'normal' && v.lie === 0 && !v.enabled && inHovel(v), `he is not on his feet by the cot (${v.mode}, lie ${v.lie})`);
    const wake = await page.evaluate(() => window.__game.wakeSpot);
    want(Math.hypot(v.x - wake.x, v.z - wake.z) < 0.1, `he rose to (${v.x.toFixed(2)}, ${v.z.toFixed(2)}), not the wake spot`);
    await wait(700); // the quill is put in his hand
    const oath1 = await page.evaluate(() => ({ step: document.querySelector('.intro-oath').dataset.oath, text: document.querySelector('.intro-oath').textContent, focused: document.activeElement?.matches('[data-oath-input]') }));
    want(oath1.step === 'epic' && oath1.text.includes('What great work wilt thou do this year?') && oath1.text.includes('70 levels of virtue'), `the first question reads "${oath1.text.slice(0, 160)}"`);
    want(oath1.focused, 'the oath did not put the quill in his hand');
    await page.screenshot({ path: 'scripts/smoke-intro-oath.png' });
    // nothing written: the question stands
    await page.keyboard.press('Enter');
    want((await page.evaluate(() => document.querySelector('.intro-oath').dataset.oath)) === 'epic' && (await look()).epic === '', 'an empty oath was sworn');
    // typing in it moves no one and opens nothing
    await page.type('[data-oath-input]', 'Earn the degree, mew');
    await page.keyboard.press('Enter');
    v = await look();
    want(v.epic === 'Earn the degree, mew' && v.panel === null, `the great work was not inscribed ("${v.epic}", panel ${v.panel})`);
    await wait(600);
    const oath2 = await page.evaluate(() => ({ step: document.querySelector('.intro-oath').dataset.oath, text: document.querySelector('.intro-oath').textContent }));
    want(oath2.step === 'daily' && oath2.text.includes('what wilt thou do this day?') && oath2.text.includes('+25 XP, +10 coins'), `the second question reads "${oath2.text.slice(0, 200)}"`);
    await page.type('[data-oath-input]', 'Lift for forty minutes');
    await page.click('[data-oath-swear]');

    // 6) the keys are his: the opening is over and owed no more, the keys told, the way out shown
    await wait(1200);
    v = await look();
    console.log('handed over:', JSON.stringify(v));
    want(v.beat === null && !v.shown && !v.hudHidden, 'the opening did not end with the oath');
    want(v.daily === 'Lift for forty minutes' && !v.dailyDone, `today's deed was not posted ("${v.daily}")`);
    want(!v.owed, 'the opening is still owed after it was played');
    want(v.enabled && v.mode === 'normal', 'the keys were not handed over');
    want(v.toasts.includes('WASD walk') && !v.toasts.includes('humble clearing'), `the first words were "${v.toasts}"`);
    want(v.waymark === 'door' && v.fireCold, `the waymark is on ${v.waymark}`);
    // his door is the first E, though the cot is nearer
    const first = await promptOffered();
    want(first.includes('open the door'), `the first prompt offers "${first}"`);
    want((await look()).mark === '', 'the waymark hangs over the door while its own prompt is there');
    await page.screenshot({ path: 'scripts/smoke-intro-door.png' });
    await page.keyboard.press('KeyE');
    await wait(600);
    want(await page.evaluate(() => window.__game.door.isOpen), 'E did not open his door');

    // 7) out under the sky: the line is said, and the waymark moves to the Quest Board
    await page.evaluate(() => {
      const g = window.__game;
      g.player.respawn(-6.3, 1.6);
      g.orbitCam.setView(-2.2, 0.3, 7); // the board ahead
    });
    await until(() => window.__game.intro.waymark() === 'board', null, 6000);
    await until(() => !document.getElementById('waymark').classList.contains('hidden') && document.getElementById('waymark').dataset.edge === '', null, 6000);
    v = await look();
    console.log('outside:', JSON.stringify({ waymark: v.waymark, mark: v.mark, edge: v.edge, caption: v.caption }));
    want(v.waymark === 'board' && v.mark.includes('The Quest Board') && v.mark.includes('paces') && v.edge === '', `outside, the waymark reads "${v.mark}" (edge "${v.edge}")`);
    want(v.caption === 'The fire is cold. Only a deed done will light it.', `the line said was "${v.caption}"`);
    await wait(1200);
    await page.screenshot({ path: 'scripts/smoke-intro-fire.png' });
    // the board behind him: the waymark waits at the side to turn toward
    await page.evaluate(() => window.__game.orbitCam.setView(-2.2 + Math.PI, 0.3, 7));
    await until(() => ['left', 'right'].includes(document.getElementById('waymark').dataset.edge), null, 6000);
    want(['left', 'right'].includes((await look()).edge), 'with the board behind him the waymark is not at the side of the screen');

    // 8) the board, read: the waymark is put away, and the oath's words are on it
    await page.evaluate(() => window.__game.openPanel('board'));
    await wait(700);
    v = await look();
    const board = await page.evaluate(() => document.getElementById('quest-body').textContent);
    want(v.waymark === null && v.mark === '', `the waymark stayed up over the board (${v.waymark})`);
    want(board.includes('Lift for forty minutes') && board.includes('Earn the degree, mew'), 'the board does not hold what was sworn');

    // 9) the first deed lights the fire
    await page.click('[data-complete]');
    await page.click('[data-pick="ath"]');
    await page.click('[data-pick-done]');
    await until(() => document.getElementById('toasts').textContent.includes('The fire catches'), null, 5000);
    v = await look();
    const lit = await page.evaluate(() => ({ gutter: window.__game.campfire.getGutter(), streak: window.__game.getState().streak.current }));
    console.log('first deed:', JSON.stringify(lit), JSON.stringify(v.toasts));
    want(v.dailyDone && lit.streak === 1 && lit.gutter === 1, `the first deed did not light the fire (${JSON.stringify(lit)})`);
    want(v.toasts.includes('The fire catches') && !v.fireCold, `no word that the fire caught ("${v.toasts}")`);

    // 10) the next load: no opening, no waymark — an ordinary morning by the fire
    await load();
    v = await look();
    want(v.beat === null && !v.shown && v.enabled && !inHovel(v) && v.waymark === null && !v.toasts.includes('WASD'), `the load after is not an ordinary one (${JSON.stringify({ beat: v.beat, waymark: v.waymark, toasts: v.toasts })})`);

    // 11) ?intro=1 plays it again over that save, once; Esc skips it and nothing is lost
    await load('&intro=1');
    v = await look();
    want(v.beat === 'title' && !v.url.includes('intro='), `?intro=1 did not play the opening once (${v.beat}, ${v.url})`);
    await page.keyboard.press('Escape');
    await wait(900);
    v = await look();
    console.log('skipped:', JSON.stringify({ beat: v.beat, enabled: v.enabled, mode: v.mode, epic: v.epic, waymark: v.waymark }));
    want(v.beat === null && !v.shown && v.enabled && v.mode === 'normal' && inHovel(v), 'Esc did not skip the opening onto his feet by the cot');
    want(v.epic === 'Earn the degree, mew' && v.dailyDone && v.waymark === null, 'the opening played again changed the save, or brought the waymark back');
    // ...and played through again, the oath shows what is already sworn and posted
    await load('&intro=1');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter'); // title → dream → waking → the oath, hurried
    await wait(800);
    v = await look();
    const again = await page.evaluate(() => ({ epic: document.querySelector('[data-oath-input]')?.value, mode: window.__game.player.mode }));
    want(v.beat === 'oath' && again.epic === 'Earn the degree, mew' && again.mode === 'normal', `hurried to the oath: ${v.beat}, "${again.epic}", ${again.mode}`);
    await page.click('[data-oath-later]');
    await wait(500);
    const posted = await page.evaluate(() => document.querySelector('.intro-oath').textContent);
    want(posted.includes('Lift for forty minutes') && posted.includes('done already'), `the second question does not show today's deed ("${posted.slice(0, 200)}")`);
    await page.click('[data-oath-later]');
    await wait(600);
    v = await look();
    want(v.beat === null && v.enabled && v.epic === 'Earn the degree, mew' && v.daily === 'Lift for forty minutes', 'leaving both questions for later changed something');

    // 12) a newcomer back again with no deed yet: no opening, but the fire is still cold
    await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('crownbound_save'));
      s.history = [];
      s.streak = { current: 0, best: 0 };
      s.quests.daily.deeds.forEach((d) => (d.completed = false));
      s.lastQuestDate = null;
      localStorage.setItem('crownbound_save', JSON.stringify(s));
    });
    await load();
    await until(() => !document.getElementById('caption').classList.contains('hidden'), null, 6000);
    v = await look();
    console.log('back again:', JSON.stringify({ beat: v.beat, waymark: v.waymark, caption: v.caption, enabled: v.enabled }));
    want(v.beat === null && v.enabled && !inHovel(v), 'a returning newcomer was shown the opening again');
    want(v.waymark === 'board' && v.caption.includes('The fire is cold'), `a returning newcomer is not shown the way (${v.waymark}, "${v.caption}")`);

    // 13) skipped at the title on a blank save: on his feet, owed no more, the door shown
    await page.evaluate(() => localStorage.clear());
    await load();
    want((await look()).beat === 'title', 'a blank save did not open on the title the second time');
    await page.click('[data-intro-skip]');
    await wait(900);
    v = await look();
    want(v.beat === null && v.enabled && inHovel(v) && !v.owed && v.waymark === 'door' && v.toasts.includes('WASD walk'), `skipped at the title: ${JSON.stringify({ beat: v.beat, enabled: v.enabled, owed: v.owed, waymark: v.waymark })}`);
    want(v.epic === '' && v.daily === '', 'a skipped opening wrote a quest');

    // 14) ?intro=0 (every other scenario): a blank save as it ever was — by the fire, both greetings, no waymark
    await page.evaluate(() => localStorage.clear());
    await load('&intro=0');
    v = await look();
    console.log('intro=0:', JSON.stringify({ beat: v.beat, owed: v.owed, waymark: v.waymark, toasts: v.toasts.slice(0, 60) }));
    want(v.beat === null && !v.shown && v.enabled && !inHovel(v) && !v.owed, '?intro=0 still played the opening, or left it owed');
    want(v.waymark === null && v.caption === '' && v.toasts.includes('humble clearing') && v.toasts.includes('WASD walk'), `?intro=0 is not the old first load (${v.waymark}, "${v.toasts}")`);

    // 15) the test world owes no opening; its `intro` command plays it once
    await load('&test=1');
    v = await look();
    want(v.beat === null && v.enabled && !v.owed, 'a blank test world opened on the opening');
    await page.keyboard.press('/');
    await Promise.all([
      page.waitForNavigation({ waitUntil: WAIT, timeout: 40000 }),
      page.evaluate(() => {
        const input = document.querySelector('#proving-console input');
        input.value = 'intro';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      }),
    ]);
    await booted();
    v = await look();
    want(v.beat === 'title' && v.url.includes('test=1') && !v.url.includes('intro='), `the intro command: ${v.beat}, ${v.url}`);
    await page.keyboard.press('/'); // no command line over the opening
    want(await page.evaluate(() => document.getElementById('proving-console').classList.contains('hidden')), 'the command line opened over the opening');
    await page.keyboard.press('Escape');
    await wait(700);
    want((await look()).beat === null, 'Esc did not skip the opening in the test world');

    // 16) `newgame` starts the test world over from nothing, opening and all
    await page.evaluate(() => {
      const raw = localStorage.getItem('crownbound_test_save');
      const s = JSON.parse(raw);
      s.coins = 777;
      localStorage.setItem('crownbound_test_save', JSON.stringify(s));
    });
    await load('&test=1');
    await page.keyboard.press('/');
    await Promise.all([
      page.waitForNavigation({ waitUntil: WAIT, timeout: 40000 }),
      page.evaluate(() => {
        const input = document.querySelector('#proving-console input');
        input.value = 'newgame';
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      }),
    ]);
    await booted();
    v = await look();
    const coins = await page.evaluate(() => JSON.parse(localStorage.getItem('crownbound_test_save') || '{}').coins);
    want(v.beat === 'title' && v.url.includes('test=1') && !v.url.includes('intro='), `the newgame command: ${v.beat}, ${v.url}`);
    want(coins !== 777, `newgame kept the old test save (coins ${coins})`);
    await page.keyboard.press('Escape');
    await wait(700);
    await page.evaluate(() => window.__game.orbitCam.setView(Math.PI * 0.75, 0.2, 5));
  }

  if (scenario === 'proving') {
    // The Proving Ground: a test world on its own save, with a command line.
    // The one thing that matters most: the true save is never written there.
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const until = (fn, arg, ms = 15000) => page.waitForFunction(fn, { timeout: ms, polling: 200 }, arg).then(() => true, () => false);
    const booted = async () => {
      await until(() => window.__game && document.getElementById('proving-console'));
      await wait(1200);
    };
    const consoleOpen = () => page.evaluate(() => !document.getElementById('proving-console').classList.contains('hidden'));
    // a line put to the command line and entered; returns the last line it showed
    const cmd = (line) =>
      page.evaluate((text) => {
        const input = document.querySelector('#proving-console input');
        input.value = text;
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        const last = document.querySelector('#proving-console .pc-log').lastElementChild;
        return { text: last.textContent, bad: last.className === 'pc-bad' };
      }, line);
    // ...and one that reloads the page
    const cmdReload = async (line) => {
      await Promise.all([page.waitForNavigation({ waitUntil: WAIT, timeout: 40000 }), cmd(line).catch(() => {})]);
      await booted();
    };
    const st = () => page.evaluate(() => window.__game.getState());
    const want = (ok, what) => {
      if (!ok) errors.push(`proving: ${what}`);
    };

    // 1) the true world: no banner, no command line, `/` opens nothing
    await page.keyboard.press('/');
    const plain = await page.evaluate(() => ({
      box: !!document.getElementById('proving-console'),
      banner: !!document.getElementById('proving-banner'),
    }));
    want(!plain.box && !plain.banner, 'the true world has a command line or a banner');

    // 2) the Tome's door leads to the test world, keeping the rest of the address
    await page.evaluate(() => window.__game.openPanel('tome'));
    await Promise.all([page.waitForNavigation({ waitUntil: WAIT, timeout: 40000 }), page.click('[data-world="test"]')]);
    await booted();
    const url = page.url();
    want(url.includes('test=1') && url.includes('smoke=proving') && url.includes('hour=13'), `the Tome's door led to ${url}`);

    // mark the true save, so it is known again at the end: from here on it must not change by a letter
    const TRUE = await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('crownbound_save'));
      s.coins = 77;
      s.stats.wis.level = 3;
      const text = JSON.stringify(s);
      localStorage.setItem('crownbound_save', text);
      return text;
    });
    const first = await page.evaluate(() => ({
      banner: document.getElementById('proving-banner')?.textContent ?? '',
      coins: window.__game.getState().coins,
      slot: !!localStorage.getItem('crownbound_test_save'),
    }));
    console.log('test world:', JSON.stringify(first));
    want(first.banner.includes('Proving Ground'), 'no banner in the test world');
    want(first.coins === 0 && first.slot, `the test world did not begin on a save of its own (${JSON.stringify(first)})`);

    // 3) `/` opens the line; what is typed there is letters, not steps
    const before = await page.evaluate(() => ({ x: window.__game.player.pos.x, z: window.__game.player.pos.z }));
    await page.keyboard.press('/');
    await page.keyboard.type('wwe');
    await wait(900);
    const typed = await page.evaluate(() => {
      const p = window.__game.player;
      const input = document.querySelector('#proving-console input');
      return { x: p.pos.x, z: p.pos.z, enabled: p.isEnabled(), value: input.value, focused: document.activeElement === input, panel: window.__game.openPanelId() };
    });
    console.log('typed:', JSON.stringify(typed));
    want(await consoleOpen(), '/ did not open the command line');
    want(typed.value === 'wwe' && typed.focused, `the line holds "${typed.value}", not what was typed`);
    want(Math.hypot(typed.x - before.x, typed.z - before.z) < 0.05 && !typed.enabled && !typed.panel, 'typing in the command line moved him or opened a panel');
    // the real keys: backspace it away, type a command, Enter
    for (let i = 0; i < 3; i++) await page.keyboard.press('Backspace');
    await page.evaluate(() => { window.__game.player.hp = 5; });
    await page.keyboard.type('heal');
    await page.keyboard.press('Enter');
    want((await page.evaluate(() => window.__game.player.hp)) === 20, 'heal, typed and entered, did not heal');

    // 4) stamina
    await cmd('stamina 10');
    want((await st()).stamina.current === 10, 'stamina 10 did not set the pool');
    await cmd('stamina full');
    want((await st()).stamina.current === 240, 'stamina full did not fill the pool');
    await cmd('stamina 3');
    await cmd('reset stamina');
    want((await st()).stamina.current === 240, 'reset stamina did not fill the pool');

    // 5) rank and virtues — "level me up to sage" is answered, not obeyed
    const squire = await cmd('rank squire');
    let s = await st();
    const hudRank = await page.evaluate(() => document.getElementById('hud-rank').textContent);
    console.log('rank squire:', JSON.stringify(squire), s.rank, JSON.stringify(s.stats));
    want(s.rank === 'Squire' && Object.values(s.stats).every((v) => v.level === 3) && hudRank === 'Squire', `rank squire gave ${s.rank} / HUD ${hudRank}`);
    const sage = await cmd('rank sage');
    want(sage.bad && sage.text.includes('not a rank') && sage.text.includes('King') && (await st()).rank === 'Squire', `rank sage answered "${sage.text}"`);
    await cmd('level wis 10');
    await cmd('xp ath 250');
    s = await st();
    want(s.stats.wis.level === 10 && s.stats.ath.level === 3 && s.stats.ath.xp === 250 && s.rank === 'Squire', `level/xp gave ${JSON.stringify(s.stats)} ${s.rank}`);
    await cmd('rank king');
    s = await st();
    const bells = await page.evaluate(() => document.getElementById('toasts').textContent);
    want(s.rank === 'King' && !!s.coronationAt && bells.includes('CORONATION'), `rank king: ${s.rank}, crowned ${s.coronationAt}`);
    await cmd('rank peasant');
    s = await st();
    want(s.rank === 'Peasant' && s.coronationAt === null && Object.values(s.stats).every((v) => v.level === 1), `rank peasant left ${s.rank}, crowned ${s.coronationAt}`);

    // 6) the purse and the fire
    await cmd('coins 500');
    await cmd('coins +25');
    want((await st()).coins === 525, 'coins 500, +25 did not make 525');
    await cmd('coins -1000');
    want((await st()).coins === 0, 'coins -1000 went below nought');
    await cmd('streak 8');
    want((await st()).streak.current === 8 && (await page.evaluate(() => document.getElementById('streak-count').textContent)) === '8', 'streak 8 did not set the streak');

    // 7) quests, by the game's own rule
    const daily = await cmd('daily wis');
    s = await st();
    console.log('daily:', JSON.stringify(daily));
    want(s.quests.daily.deeds.some((d) => d.completed) && s.stats.wis.xp === 25 && s.streak.current === 9 && s.stamina.current === 480, `daily wis: ${JSON.stringify({ q: s.quests.daily, wis: s.stats.wis, streak: s.streak, st: s.stamina })}`);
    // a second deed the same day: two virtues share the XP, and the day is not claimed twice
    await cmd('daily ath inf');
    s = await st();
    want(s.quests.daily.deeds.length === 2 && s.stats.ath.xp === 13 && s.stats.inf.xp === 12 && s.streak.current === 9, `daily ath inf: ${JSON.stringify({ q: s.quests.daily, ath: s.stats.ath, inf: s.stats.inf, streak: s.streak })}`);
    for (let i = 0; i < 3; i++) await cmd('daily');
    want((await cmd('daily')).bad, 'a sixth daily deed was not refused');
    await cmd('reset daily');
    s = await st();
    want(s.quests.daily.deeds.length === 0 && s.stamina.current === 240, 'reset daily did not clear the board');

    // 8) wares
    await cmd('give cudgel');
    let gear = await page.evaluate(() => ({ owned: window.__game.getState().shop.owned, wielded: window.__game.getState().chest.wielded, dmg: window.__game.player.attackDamage }));
    want(gear.owned.includes('cudgel') && gear.wielded === 'cudgel' && gear.dmg === 2, `give cudgel: ${JSON.stringify(gear)}`);
    await cmd('take cudgel');
    gear = await page.evaluate(() => ({ owned: window.__game.getState().shop.owned, wielded: window.__game.getState().chest.wielded, dmg: window.__game.player.attackDamage }));
    want(!gear.owned.includes('cudgel') && gear.wielded === 'stick' && gear.dmg === 1, `take cudgel: ${JSON.stringify(gear)}`);
    want((await cmd('give crown')).bad, 'a ware that does not exist was given');

    // 9) the strip
    await cmd('farm finish');
    s = await st();
    want(s.farm.stage === 1 && s.coins === 54, `farm finish: stage ${s.farm.stage}, coins ${s.coins}`); // 50 from the five daily deeds + the wage
    want((await cmd('farm finish')).bad, 'a second job in one day was not refused');
    await cmd('farm grow');
    want((await page.evaluate(() => window.__game.farmJob())) === 'sow', 'farm grow did not bring the next job');
    await cmd('farm reap');
    want((await st()).farm.stage === 3, 'farm reap did not set the job');

    // 10) tp sets him down where E offers the thing
    await cmd('tp board');
    want((await cmd('tp moon')).bad, 'tp to nowhere was not refused');
    await page.keyboard.press('Escape');
    want(!(await consoleOpen()), 'Esc did not close the command line');
    const offered = await promptOffered();
    want(offered.includes('Quest Board') && (await page.evaluate(() => window.__game.player.isEnabled())), `tp board: prompt "${offered}"`);

    // 11) spent, then stamina handed back: stopped on the road home...
    await page.keyboard.press('/');
    await cmd('stamina 0');
    want(await until(() => window.__game.spent().homeward), 'stamina 0 did not send him home');
    await cmd('stamina full');
    let up = await page.evaluate(() => ({ ...window.__game.spent(), flag: !!window.__game.getState().stamina.spent, route: !!window.__game.player.route }));
    want(!up.homeward && !up.resting && !up.pending && !up.flag && !up.route, `stamina full on the road home: ${JSON.stringify(up)}`);
    // ...and got up from his bed, the rest card gone
    await cmd('stamina 0');
    await until(() => window.__game.spent().homeward);
    await page.keyboard.press('Escape');
    await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE' }))); // hurry home
    want(await until(() => window.__game.spent().resting), 'he never reached his bed');
    await page.keyboard.press('/'); // the line opens abed
    want(await consoleOpen(), 'the command line did not open abed');
    want((await cmd('tp board')).bad, 'tp moved a man abed');
    await cmd('stamina full');
    await page.keyboard.press('Escape');
    up = await page.evaluate(() => ({
      ...window.__game.spent(),
      mode: window.__game.player.mode,
      enabled: window.__game.player.isEnabled(),
      abed: document.body.classList.contains('abed'),
      card: !document.getElementById('rest-card').classList.contains('hidden'),
    }));
    console.log('roused:', JSON.stringify(up));
    want(!up.resting && up.mode === 'normal' && up.enabled && !up.abed && !up.card, `stamina full abed: ${JSON.stringify(up)}`);

    // 12) commands of his own
    await page.keyboard.press('/');
    const made = await cmd('make fresh = stamina 100; coins 1000');
    await cmd('fresh');
    s = await st();
    want(!made.bad && s.stamina.current === 100 && s.coins === 1000, `make fresh / fresh: ${made.text} → ${s.stamina.current}, ${s.coins}`);
    await cmd('make boost = level $1 20');
    await cmd('boost wis');
    want((await st()).stats.wis.level === 20, 'an own command did not pass its word on');
    want((await cmd('make rank = heal')).bad && (await cmd('make help = heal')).bad, 'an own command took a built-in name');
    await cmd('forget boost');
    want((await cmd('boost wis')).bad, 'a forgotten command still ran');
    await cmd('coins 5; coins 6');
    want((await st()).coins === 6, 'two commands on one line did not both run');
    want((await cmd('abracadabra')).bad, 'an unknown command was not refused');
    want((await cmd('constructor')).bad, 'a word every object answers to was taken for an own command');
    await cmd('help');
    await page.screenshot({ path: 'scripts/smoke-proving.png' });
    const helped = await page.evaluate(() => document.querySelector('#proving-console .pc-log').textContent);
    want(helped.includes('stamina full') && helped.includes('fresh  stamina 100; coins 1000') && helped.includes('make <name>'), 'help does not list the commands');

    // 13) the clock: the hour, then a night
    await cmd('time 21:30');
    const hour = await page.evaluate(() => ({ h: new Date().getHours(), m: new Date().getMinutes(), banner: document.getElementById('proving-clock').textContent }));
    want(hour.h === 21 && hour.m === 30 && hour.banner.includes('moved'), `time 21:30: ${JSON.stringify(hour)}`);
    await cmd('rank peasant');
    await cmd('streak 4');
    await cmd('daily');
    await cmdReload('nextday');
    s = await st();
    const night = await page.evaluate(() => ({ h: new Date().getHours(), log: document.querySelector('#proving-console .pc-log').textContent }));
    console.log('next day:', JSON.stringify({ date: s.counters.date, days: s.daysPlayed, streak: s.streak, daily: s.quests.daily, stamina: s.stamina, h: night.h }));
    want(s.counters.date === dstr(1), `nextday: the game's day is ${s.counters.date}, not ${dstr(1)}`);
    want(!s.quests.daily.deeds.some((d) => d.completed) && s.streak.current === 5 && s.stamina.current === 240, 'nextday: no new day (daily, streak or stamina)');
    want(night.h === 21 && night.log.includes('A night passes'), 'nextday: the hour moved, or nothing was said');
    await cmd('fresh');
    want((await st()).coins === 1000, 'an own command did not outlast a reload');
    // two nights with no deed, waking at seven: the fire dies
    await cmdReload('nextday 2 7:00');
    s = await st();
    const dawn = await page.evaluate(() => new Date().getHours());
    want(s.counters.date === dstr(3) && dawn === 7 && s.streak.current === 0, `nextday 2 7:00: ${s.counters.date}, ${dawn} o'clock, streak ${s.streak.current}`);
    await cmdReload('time real');
    want((await st()).counters.date === dstr(0) && (await page.evaluate(() => document.getElementById('proving-clock').classList.contains('hidden'))), 'time real did not return to today');

    // 14) the chapman called
    await cmdReload('market on');
    want((await page.evaluate(() => !!window.__game.cart)) && page.url().includes('test=1'), 'market on brought no cart (or left the test world)');

    // 15) a copy of the true save — which stays as it was
    await cmdReload('copy');
    s = await st();
    want(s.coins === 77 && s.stats.wis.level === 3, `copy: coins ${s.coins}, wis ${s.stats.wis.level}`);
    await cmd('coins 9');

    // 16) the world begun again; his own commands are kept
    await cmdReload('reset world');
    s = await st();
    want(s.coins === 0 && s.rank === 'Peasant' && s.history.length === 0, 'reset world did not begin again');
    await cmd('fresh');
    want((await st()).coins === 1000, 'reset world lost his own commands');

    // 17) through all of it the true save has not changed by a letter
    const after = await page.evaluate(() => localStorage.getItem('crownbound_save'));
    want(after === TRUE, 'THE TRUE SAVE CHANGED in the test world');

    // 18) and back: the true world, on the true save
    await Promise.all([page.waitForNavigation({ waitUntil: WAIT, timeout: 40000 }), cmd('leave').catch(() => {})]);
    await until(() => window.__game);
    const home = await page.evaluate(() => ({ coins: window.__game.getState().coins, banner: !!document.getElementById('proving-banner'), url: location.href }));
    console.log('back:', JSON.stringify(home));
    want(home.coins === 77 && !home.banner && !home.url.includes('test=') && !home.url.includes('market='), `leave: ${JSON.stringify(home)}`);
  } else if (scenario === 'village') {
    // The neighbours' houses: 24 stand where the layout says, each one solid;
    // none on another, on anything that was here before, on the road, the
    // strip or its track; a man can stand on every doorstep and walk home from
    // it; the windows light after dark and the hearths smoke; the whole
    // village is a handful of draw calls; and the map shows each house with
    // a line of its own.
    const v = await page.evaluate(() => {
      const g = window.__game;
      const { LAYOUT: L, pathX, fieldGap, trackGap, doorstep } = g.layout;
      const p = g.player;
      const problems = [];
      const world = (h, u, w) => {
        const c = Math.cos(h.rotY);
        const s = Math.sin(h.rotY);
        return [h.x + u * c + w * s, h.z - u * s + w * c];
      };
      // how far outside a house's walls a spot lies (0 within them)
      const gap = (h, x, z) => {
        const c = Math.cos(h.rotY);
        const s = Math.sin(h.rotY);
        const dx = x - h.x;
        const dz = z - h.z;
        return Math.hypot(Math.max(Math.abs(dx * c - dz * s) - h.length / 2, 0), Math.max(Math.abs(dx * s + dz * c) - h.width / 2, 0));
      };
      const edge = (h) => {
        const pts = [];
        for (let t = -1; t <= 1.001; t += 0.125) {
          pts.push(world(h, (t * h.length) / 2, h.width / 2), world(h, (t * h.length) / 2, -h.width / 2), world(h, h.length / 2, (t * h.width) / 2), world(h, -h.length / 2, (t * h.width) / 2));
        }
        return pts;
      };
      const settle = (x, z, colliders = g.colliders) => {
        p.respawn(x, z);
        for (let i = 0; i < 4; i++) p.update(1 / 60, 0, colliders);
        return { x: p.pos.x, z: p.pos.z };
      };

      // 1) solid: each house has its own turned rect among the colliders, and a man set just
      //    inside each wall, or in the middle, is put out of doors by it (by it alone: what
      //    stands against a wall in the yard would only push him back at it)
      for (const h of L.houses) {
        // (its collider is its walls and a little more: it stops him under the eaves, where the thatch hangs to his chest)
        const walls = g.colliders.find((c) => c.cos !== undefined && Math.abs(c.x - h.x) < 0.01 && Math.abs(c.z - h.z) < 0.01 && c.halfX - h.length / 2 > -0.01 && c.halfX - h.length / 2 < 0.4 && c.halfZ - h.width / 2 > -0.01 && c.halfZ - h.width / 2 < 0.4);
        if (!walls) {
          problems.push(`${h.id}: its walls stop no one (no collider of its size on its plot)`);
          continue;
        }
        for (const [u, w] of [[0, h.width / 2 - 0.25], [0, -h.width / 2 + 0.25], [h.length / 2 - 0.25, 0], [-h.length / 2 + 0.25, 0], [0, 0]]) {
          const at = settle(...world(h, u, w), [walls]);
          if (gap(h, at.x, at.z) < 0.3) problems.push(`${h.id}: a man set inside it at (${u.toFixed(1)}, ${w.toFixed(1)}) was left inside`);
        }
      }

      // 2) each on ground of its own
      const things = [
        ['thy hovel', L.hovel, 2.3], ['the granary', L.granary, 2.6], ['the Exchequer', L.exchequer, 1.9], ['the Quest Board', L.questBoard, 1.2],
        ['the Tome', L.tome, 0.6], ['the Charter', L.charter, 0.4], ['the campfire', L.campfire, 0.7], ['the dummy', L.dummy, 0.5],
        ['the chapman’s pitch', L.cart, 2.6], ['the spawn', L.playerSpawn, 0.5],
      ];
      for (const h of L.houses) {
        for (const [name, at, r] of things) {
          const d = gap(h, at.x, at.z) - r;
          if (d < 2.5) problems.push(`${h.id} stands ${d.toFixed(1)} from ${name}`);
        }
        for (const t of g.mapMarks.trees) if (gap(h, t.x, t.z) < 0.45 * t.s + 0.6) problems.push(`${h.id} stands on the tree at (${t.x.toFixed(1)}, ${t.z.toFixed(1)})`);
        for (const r of g.mapMarks.rocks) if (gap(h, r.x, r.z) < r.s * 0.85 + 0.5) problems.push(`${h.id} stands on the boulder at (${r.x.toFixed(1)}, ${r.z.toFixed(1)})`);
        const pts = edge(h);
        if (pts.some(([x, z]) => Math.abs(x - pathX(z)) < 4)) problems.push(`${h.id} stands in the road`);
        if (pts.some(([x, z]) => fieldGap(x, z) < 3.3)) problems.push(`${h.id} stands against the strip's fence`);
        if (pts.some(([x, z]) => trackGap(x, z) < 2)) problems.push(`${h.id} stands on the cart track`);
        if (pts.some(([x, z]) => Math.hypot(x, z) > 74)) problems.push(`${h.id} stands at the world's edge`);
        if (pts.some(([x, z]) => Math.hypot(x - L.granary.x, z - L.granary.z) < 6.5)) problems.push(`${h.id} stands where the rats run`);
        for (const o of L.houses) {
          if (o.id <= h.id) continue;
          const d = Math.min(...pts.map(([x, z]) => gap(o, x, z)), ...edge(o).map(([x, z]) => gap(h, x, z)));
          if (d < 2.2) problems.push(`${h.id} and ${o.id} stand only ${d.toFixed(1)} apart`);
        }
      }

      // 3) every doorstep can be stood on, and there is a way home from it
      const home = { x: g.door.x + 1.3, z: g.door.z };
      let longest = { id: '', ratio: 0 };
      for (const h of L.houses) {
        const d = doorstep(h, 0.9);
        const at = settle(d.x, d.z);
        const shoved = Math.hypot(at.x - d.x, at.z - d.z);
        if (shoved > 0.25) problems.push(`${h.id}: its doorstep is blocked (a man set on it is shoved ${shoved.toFixed(2)})`);
        const route = g.planPath(g.colliders, d, home);
        if (!route) {
          problems.push(`${h.id}: no way home from its door`);
          continue;
        }
        let len = 0;
        let from = d;
        for (const q of route) {
          len += Math.hypot(q.x - from.x, q.z - from.z);
          from = q;
        }
        const straight = Math.hypot(d.x - home.x, d.z - home.z);
        if (len / straight > longest.ratio) longest = { id: h.id, ratio: len / straight };
        if (len > straight * 1.5 + 8) problems.push(`${h.id}: the way home from its door is ${len.toFixed(0)} long for ${straight.toFixed(0)} as the crow flies`);
      }
      // ...and from the strip, and from places a spent man is often found
      for (const [name, x, z] of [['the strip', 27, 33], ['the Quest Board', 4, -0.5], ['the far lane', -36, 2], ['the east road', 4, 44], ['the hill', 36, -8]]) {
        if (!g.planPath(g.colliders, { x, z }, home)) problems.push(`no way home from ${name}`);
      }
      p.respawn(L.playerSpawn.x, L.playerSpawn.z);

      // 4) after dark the windows are lit from within; the hearths smoke
      const win = g.scene.getObjectByName('village-windows');
      const col = win.geometry.attributes.color;
      const brightest = () => {
        let m = 0;
        for (let i = 0; i < col.count; i++) m = Math.max(m, col.getX(i));
        return m;
      };
      const noon = new Date(2026, 5, 21, 13, 0);
      g.sky.setClock(noon);
      const day = brightest();
      g.sky.setClock(new Date(2026, 5, 21, 23, 30));
      const night = brightest();
      g.sky.setClock(noon);

      // 5) the cost: a couple of meshes a row, however much stands in the yards
      let meshes = 0;
      let triangles = 0;
      g.scene.getObjectByName('village').traverse((o) => {
        if (!o.isMesh) return;
        meshes++;
        triangles += o.geometry.attributes.position.count / 3;
      });

      return {
        count: L.houses.length, stood: g.village.houses.length, ids: new Set(L.houses.map((h) => h.id)).size,
        colliders: g.colliders.length, smokes: g.village.smokes.length, windows: col.count / 6, day, night, meshes, triangles: Math.round(triangles), longest, problems,
      };
    });
    console.log('village:', JSON.stringify({ ...v, problems: v.problems.length }));
    for (const problem of v.problems) errors.push(`village: ${problem}`);
    if (v.count !== 24 || v.stood !== 24 || v.ids !== 24) errors.push(`village: ${v.count} plots, ${v.stood} houses stood, ${v.ids} names — wanted 24 of each`);
    if (v.smokes < 12) errors.push(`village: only ${v.smokes} hearths smoke`);
    if (v.windows < 30) errors.push(`village: only ${v.windows} doorways and windows`);
    if (!(v.day < 0.25)) errors.push(`village: the windows glow by day (${v.day.toFixed(2)})`);
    if (!(v.night > 0.6)) errors.push(`village: the windows stay dark at night (${v.night.toFixed(2)})`);
    if (v.meshes > 14) errors.push(`village: ${v.meshes} meshes — the rows are not being baked`); // two a row at most, the windows, the embers
    if (v.triangles > 24 * 6000) errors.push(`village: ${v.triangles} triangles for 24 houses`);

    // the map: The Village shows all 24, each with a line of its own
    await page.evaluate(() => window.__game.openPanel('map'));
    await new Promise((r) => setTimeout(r, 400));
    await page.click('#map-body [data-view="village"]');
    await new Promise((r) => setTimeout(r, 300));
    const onMap = await page.evaluate(() => {
      const caption = document.getElementById('map-caption');
      const lines = [];
      for (const el of document.querySelectorAll('#map-body .m-site[data-place^="house-"]')) {
        el.dispatchEvent(new MouseEvent('mouseenter'));
        lines.push({ id: el.dataset.place.slice(6), note: caption.textContent });
        el.dispatchEvent(new MouseEvent('mouseleave'));
      }
      return { view: document.querySelector('.map-views button.on')?.dataset.view, lines, idle: caption.textContent };
    });
    console.log('on the map:', onMap.lines.length, 'houses;', JSON.stringify(onMap.lines.slice(0, 2)));
    if (onMap.view !== 'village') errors.push('village: The Village button did not change the plan');
    if (onMap.lines.length !== 24) errors.push(`village: the map shows ${onMap.lines.length} houses`);
    if (new Set(onMap.lines.map((l) => l.note)).size !== onMap.lines.length) errors.push('village: two houses read the same line on the map');
    for (const l of onMap.lines) {
      if (l.note === onMap.idle || !/^The .+ — ./.test(l.note)) errors.push(`village: ${l.id} reads "${l.note}" on the map`);
      if (l.note.length > 150) errors.push(`village: ${l.id}'s line is ${l.note.length} characters`);
      if (/\d\d|centur|england|english/i.test(l.note)) errors.push(`village: ${l.id}'s line names a year, a century or a country`);
    }
    await page.screenshot({ path: 'scripts/smoke-village-map.png' });
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));

    // pictures: the green, the lanes, the village from the strip, and by night
    const look = async (file, x, z, yaw, pitch, dist, hour = 13) => {
      await page.evaluate(
        (x, z, yaw, pitch, dist, hour) => {
          const g = window.__game;
          g.sky.setClock(new Date(2026, 5, 21, Math.floor(hour), (hour % 1) * 60));
          g.player.respawn(x, z);
          g.orbitCam.setView(yaw, pitch, dist);
        },
        x, z, yaw, pitch, dist, hour
      );
      await new Promise((r) => setTimeout(r, 1500));
      await page.screenshot({ path: `scripts/smoke-village-${file}.png` });
    };
    await look('green-north', 2.5, 2, -Math.PI / 2 - 0.3, 0.16, 6); // from the green, up to the knoll (nearer in: the hovel's roof is behind him)
    await look('green-south', -2, 0, Math.PI / 2 + 0.2, 0.2, 10); // ...and south, past the hovel
    await look('oak-lane', -13, 5.4, Math.PI / 2, 0.2, 8); // down the oak lane
    await look('birch-lane', -11, -13.6, Math.PI / 2 - 0.1, 0.2, 8); // down the birch lane
    await look('east', -7, 15, Math.PI + 0.2, 0.22, 9); // the east lane
    await look('from-strip', 20, 24, Math.PI / 4, 0.3, 12); // the village from the field gate
    await look('hill', 32, -8, -Math.PI / 2, 0.2, 9); // up to the two houses on the hill
    await look('air', -6, 4, 0.6, 1.0, 14); // from above
    await look('dusk', 2.5, 2, -Math.PI / 2 - 0.3, 0.16, 6, 18.6);
    await look('night', -12, 5.4, Math.PI / 2 - 0.5, 0.2, 9, 22);
    await page.evaluate(() => window.__game.sky.setClock(new Date(2026, 5, 21, 13, 0)));
  }

  await new Promise((r) => setTimeout(r, 1500));

  const info = await page.evaluate(() => window.__smoke || null);
  console.log('render info:', JSON.stringify(info));

  await page.screenshot({ path: 'scripts/smoke.png' });
  await browser.close();
} catch (e) {
  errors.push(`harness: ${e.message}`);
} finally {
  killServer();
}

if (errors.length) {
  console.error('SMOKE FAIL');
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
console.log('SMOKE OK — screenshot at scripts/smoke.png');
