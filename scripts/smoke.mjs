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

const PORT = 5199;
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

  // optional scenario hook, e.g. node scripts/smoke.mjs aerial
  const scenario = process.argv[2] || '';

  const dstr = (offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  if (scenario === 'fire') {
    // a 35-day streak, daily already done today: roaring blaze + full 120 stamina
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
      stamina: { current: 120, date: dstr(0) },
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
      stamina: { current: 120, date: dstr(-2) },
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
    // a Lord one daily quest from the throne: 69 total levels, str 25 XP
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
        agi: { level: 15, xp: 0 },
        wis: { level: 15, xp: 0 },
        inf: { level: 15, xp: 0 },
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
      stamina: { current: 60, date: dstr(0) },
      counters: { date: dstr(0), dummyHits: 0, ratsKilled: 0 },
      sleep: { retiredAt: null, lastRewardDate: null, wellRestedDate: null, log: [] },
      shop: { owned: [] },
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
    // name/pledge/rolls/conquered fields; 800 of 1000 so one filing conquers
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
      stamina: { current: 60, date: dstr(0) },
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

  if (scenario === 'sage') {
    // appoint the sage and stub the Anthropic API at the fetch layer: the
    // verdict comes from the quest text, so the wiring is tested end-to-end
    // without network or tokens ('tennis' → agi; 'garble' → nonsense)
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
        if (deed.includes('tennis')) verdict = 'agi';
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
      stamina: { current: 60, date: dstr(0) },
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

  await page.goto(`http://localhost:${PORT}/?smoke=${scenario}`, {
    waitUntil: 'networkidle2',
    timeout: 40000,
  });
  await new Promise((r) => setTimeout(r, 2500));

  if (scenario === 'rollover') {
    const s1 = await page.evaluate(() => {
      const st = window.__game.getState();
      return {
        dailyText: st.quests.daily.text,
        dailyDone: st.quests.daily.completed,
        weeklyText: st.quests.weekly.text,
        monthlyText: st.quests.monthly.text,
        monthlyDone: st.quests.monthly.completed,
        streak: st.streak.current,
        best: st.streak.best,
        stamina: st.stamina.current,
        dummyHits: st.counters.dummyHits,
        daysPlayed: st.daysPlayed,
        coins: st.coins,
        strLevel: st.stats.str.level,
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
    if (s1.stamina !== 60) errors.push(`rollover: stamina ${s1.stamina} != 60`);
    if (s1.dummyHits !== 0) errors.push('rollover: day counters not reset');
    if (s1.daysPlayed !== 4) errors.push(`rollover: daysPlayed ${s1.daysPlayed} != 4`);
    if (s1.coins !== 42) errors.push('rollover: coins not preserved');
    if (s1.strLevel !== 2) errors.push('rollover: stat levels not preserved');
    if (s1.epicText !== 'Become Crowned') errors.push('rollover: epic quest not preserved');

    // round trip: post a quest, reload, expect it back
    await page.evaluate(() => window.__game.openPanel('board'));
    await page.type('[data-input]', 'Morning run');
    await page.click('[data-post]');
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));
    const s2 = await page.evaluate(() => {
      const st = window.__game.getState();
      return { text: st.quests.daily.text, done: st.quests.daily.completed, coins: st.coins };
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
      for (let i = 0; i < 6; i++) spends.push(g.spendStamina(5)); // 120 -> 90
      const mid = g.getState().stamina.current;
      const big = g.spendStamina(90); // -> 0
      const empty = g.spendStamina(5); // must refuse
      return { spends, mid, big, empty, end: g.getState().stamina.current };
    });
    console.log('stamina drain:', JSON.stringify(drain));
    const tended = await page.evaluate(() => window.__game.campfire.getGutter());
    if (tended !== 1) errors.push(`fire: blaze guttering (${tended}) though daily is done`);
    if (drain.spends.some((v) => !v)) errors.push('fire: early spends refused');
    if (drain.mid !== 90) errors.push(`fire: mid stamina ${drain.mid} != 90`);
    if (!drain.big) errors.push('fire: spend-to-zero refused');
    if (drain.empty) errors.push('fire: spend allowed at 0 stamina');
    if (drain.end !== 0) errors.push(`fire: end stamina ${drain.end} != 0`);
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
    await page.click('[data-pick="str"]');
    const s = await page.evaluate(() => {
      const st = window.__game.getState();
      return {
        coins: st.coins,
        strXp: st.stats.str.xp,
        streak: st.streak.current,
        done: st.quests.daily.completed,
        stamina: st.stamina.current,
        history: st.history.length,
        gutter: window.__game.campfire.getGutter(),
      };
    });
    console.log('quest state:', JSON.stringify(s), `gutterBefore=${gutterBefore}`);
    if (gutterBefore >= 1) errors.push('fire-warn: campfire not guttering before the daily');
    if (s.gutter !== 1) errors.push(`fire-warn: campfire still guttering (${s.gutter}) after the daily`);
    if (s.coins !== 10) errors.push(`quests: coins ${s.coins} != 10`);
    if (s.strXp !== 25) errors.push(`quests: strXp ${s.strXp} != 25`);
    if (s.streak !== 1) errors.push(`quests: streak ${s.streak} != 1`);
    if (!s.done) errors.push('quests: daily not completed');
    if (s.stamina !== 120) errors.push(`quests: stamina ${s.stamina} != 120`);
    if (s.history !== 1) errors.push(`quests: history ${s.history} != 1`);

    // weekly bounty: post, complete, train Wisdom (+100 XP -> level 2 with 0 spare)
    await page.type('[data-input]', 'Ship the Felmark proposal');
    await page.click('[data-post]');
    await page.click('[data-complete]');
    await page.click('[data-pick="wis"]');
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
    await page.type('[data-input]', 'Land the first paying client');
    await page.click('[data-post]');
    await page.click('[data-complete]');
    await page.click('[data-pick="inf"]');
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
  } else if (scenario === 'tome') {
    // the Scribe: export a copy, doctor it, restore it, expect it back after reload
    const trip = await page.evaluate(() => {
      const g = window.__game;
      const bad = g.importSave('{"coins":7}'); // no saveVersion/stats/quests
      const copy = JSON.parse(g.exportSave());
      copy.coins = 777;
      copy.history = [
        { date: '2026-06-10', questText: 'Bench press session', statTrained: 'str', type: 'daily' },
        { date: '2026-06-11', questText: 'Ship the proposal', statTrained: 'wis', type: 'weekly' },
        { date: '2026-06-12', questText: 'Become Crowned', statTrained: null, type: 'epic', progressPct: 40 },
      ];
      return { bad, ok: g.importSave(JSON.stringify(copy)) };
    });
    await page.reload({ waitUntil: 'networkidle2' });
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
    }));
    console.log(`chronicle: ${deeds.count} deeds, newest tagged "${deeds.firstTag}"`);
    if (deeds.count !== 3) errors.push(`chronicle: ${deeds.count} deed rows != 3`);
    if (!deeds.firstTag.includes('40%')) errors.push('chronicle: newest deed not first');
  } else if (scenario === 'combat') {
    // 1) dummy: teleport beside it, two swings -> 4 STR XP, wobble
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = g.dummy.x + 1.1;
      g.player.pos.z = g.dummy.z;
      g.player.faceToward(g.dummy.x, g.dummy.z);
    });
    for (let i = 0; i < 2; i++) {
      await page.evaluate(() => window.__game.player.attack());
      await new Promise((r) => setTimeout(r, 600));
    }
    const afterDummy = await page.evaluate(() => {
      const st = window.__game.getState();
      return {
        strXp: st.stats.str.xp,
        hits: st.counters.dummyHits,
        stamina: st.stamina.current,
        wobble: Math.abs(window.__game.dummy ? 1 : 0),
      };
    });
    console.log('dummy:', JSON.stringify(afterDummy));
    if (afterDummy.strXp !== 4) errors.push(`combat: dummy strXp ${afterDummy.strXp} != 4`);
    if (afterDummy.hits !== 2) errors.push(`combat: dummyHits ${afterDummy.hits} != 2`);
    if (afterDummy.stamina !== 50) errors.push(`combat: stamina ${afterDummy.stamina} != 50`);

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
    await new Promise((r) => setTimeout(r, 600));
    const redBits = await page.evaluate(() => {
      let red = 0;
      window.__game.player.mesh.group.traverse((o) => {
        if (o.isMesh && o.material.color && o.material.color.getHex() === 0xff5039) red++;
      });
      return red;
    });
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

    // 3) sleep: tuck-in animation plays, wounds mend, the night is marked,
    //    you stand up by the cot
    await page.evaluate(() => {
      const g = window.__game;
      g.player.takeDamage(9, 0, 0);
      g.sleepAtCot();
    });
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
    if (boon.stamina !== 70) errors.push(`house: stamina ${boon.stamina} != 70 (60 + rested cap)`);
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
    await page.reload({ waitUntil: 'networkidle2' });
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
    await new Promise((r) => setTimeout(r, 400));
    const prompt = await page.evaluate(
      () => document.getElementById('interact-prompt').textContent
    );
    console.log('prompt:', JSON.stringify(prompt));
    if (!prompt.includes('Exchequer')) errors.push(`exchequer: prompt "${prompt}" does not offer the table`);
    await page.keyboard.press('KeyE');
    await new Promise((r) => setTimeout(r, 300));
    const bank = await page.evaluate(() => {
      const opened = !document.getElementById('treasury-panel').classList.contains('hidden');
      const cur = document.querySelector('#treasury-body [data-t-current]');
      const goal = document.querySelector('#treasury-body [data-t-goal]');
      if (cur && goal) {
        cur.value = '2500';
        goal.value = '20000';
        document.querySelector('#treasury-body [data-t-set]').click();
      }
      return { opened, ...window.__game.getState().treasury };
    });
    console.log('exchequer:', JSON.stringify(bank));
    if (!bank.opened) errors.push('exchequer: E at the counter did not open the Treasury');
    if (bank.current !== 2500 || bank.goal !== 20000)
      errors.push(`exchequer: treasury set ${bank.current}/${bank.goal} != 2500/20000`);
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
    await new Promise((r) => setTimeout(r, 400));
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
        rolls: Array.isArray(t.rolls) && t.rolls.length === 0,
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
      };
    });
    console.log('verdicts:', JSON.stringify(verdicts));
    if (verdicts.fat !== 'fat') errors.push(`reckoning: pledge met -> ${verdicts.fat}`);
    if (verdicts.underPledge !== 'held') errors.push(`reckoning: under pledge -> ${verdicts.underPledge}`);
    if (verdicts.noPledge !== 'held') errors.push(`reckoning: no pledge -> ${verdicts.noPledge}`);
    if (verdicts.bled !== 'bled') errors.push(`reckoning: overspent -> ${verdicts.bled}`);

    const due = await page.evaluate(() => window.__game.reckoningDue());
    if (due !== mk(-1)) errors.push(`reckoning: due "${due}" != "${mk(-1)}"`);

    // 3) file the month through the panel: pledge 200, then the four lines;
    //    counted 1100 tops the 1000 summit — the conquest must fire
    await page.evaluate(() => window.__game.openPanel('treasury'));
    const filed = await page.evaluate(() => {
      const q = (sel) => document.querySelector(`#treasury-body ${sel}`);
      q('[data-t-pledge]').value = '200';
      q('[data-t-set]').click(); // rerenders the panel
      const r = (sel, v) => (document.querySelector(`#treasury-body ${sel}`).value = v);
      r('[data-r-earned]', '5000');
      r('[data-r-spent]', '3800');
      r('[data-r-saved]', '300');
      r('[data-r-counted]', '1100');
      document.querySelector('#treasury-body [data-r-file]').click();
      const st = window.__game.getState();
      const t = st.treasury;
      return {
        rolls: t.rolls.length,
        verdict: t.rolls[0]?.verdict,
        current: t.current,
        goal: t.goal,
        conquered: t.conquered.length,
        conqueredGoal: t.conquered[0]?.goal,
        histType: st.history[st.history.length - 1]?.type,
        summitForm: !!document.querySelector('#treasury-body [data-s-name]'),
      };
    });
    console.log('filed:', JSON.stringify(filed));
    if (filed.rolls !== 1) errors.push(`reckoning: ${filed.rolls} rolls != 1`);
    if (filed.verdict !== 'fat') errors.push(`reckoning: verdict ${filed.verdict} != fat (300 >= 200 pledged)`);
    if (filed.current !== 1100) errors.push(`reckoning: counted-true ${filed.current} != 1100`);
    if (filed.goal !== 0) errors.push(`reckoning: goal ${filed.goal} != 0 after conquest`);
    if (filed.conquered !== 1 || filed.conqueredGoal !== 1000)
      errors.push('reckoning: the 1000 summit was not conquered');
    if (filed.histType !== 'treasury') errors.push(`reckoning: history type ${filed.histType} != treasury`);
    if (!filed.summitForm) errors.push('reckoning: no next-summit form after conquest');

    // 4) raise the next summit; the month refuses a second filing
    const raised = await page.evaluate(() => {
      const q = (sel) => document.querySelector(`#treasury-body ${sel}`);
      q('[data-s-name]').value = 'The War Chest';
      q('[data-s-goal]').value = '5000';
      q('[data-s-set]').click();
      const t = window.__game.getState().treasury;
      return {
        name: t.name,
        goal: t.goal,
        dueAgain: window.__game.reckoningDue(),
        refiled: window.__game.fileReckoning({ earned: 1, spent: 1, saved: 1, counted: 1 }),
      };
    });
    console.log('raised:', JSON.stringify(raised));
    if (raised.name !== 'The War Chest' || raised.goal !== 5000)
      errors.push(`reckoning: summit "${raised.name}"/${raised.goal} != "The War Chest"/5000`);
    if (raised.dueAgain !== null) errors.push('reckoning: month still due after filing');
    if (raised.refiled !== null) errors.push('reckoning: a second filing was accepted');

    // 5) skipped months land as unreckoned: seed one roll four months back,
    //    reload, file — the gap must be marked, not hidden
    const seeded = await page.evaluate((old) => {
      const g = window.__game;
      const copy = JSON.parse(g.exportSave());
      copy.treasury.rolls = [{ month: old, earned: 1000, spent: 900, saved: 100, counted: 100, verdict: 'held' }];
      return g.importSave(JSON.stringify(copy));
    }, mk(-4));
    if (!seeded) errors.push('reckoning: seed save import refused');
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));
    const gap = await page.evaluate(() => {
      const g = window.__game;
      g.fileReckoning({ earned: 100, spent: 50, saved: 0, counted: 1200 });
      return g.getState().treasury.rolls.map((r) => r.verdict);
    });
    console.log('gap verdicts:', JSON.stringify(gap));
    if (gap.length !== 4 || gap[1] !== 'unreckoned' || gap[2] !== 'unreckoned')
      errors.push(`reckoning: gap months not marked unreckoned (${JSON.stringify(gap)})`);

    // 6) the panel shows the rolls; screenshot for eyeballing
    await page.evaluate(() => window.__game.openPanel('treasury'));
    const panel = await page.evaluate(() => ({
      rows: document.querySelectorAll('#treasury-body .deed').length,
      conqueredHeader: document.querySelector('#treasury-body').textContent.includes('Summits Conquered'),
    }));
    console.log('panel:', JSON.stringify(panel));
    if (panel.rows < 5) errors.push(`reckoning: panel shows ${panel.rows} rows, expected rolls + conquest`);
    if (!panel.conqueredHeader) errors.push('reckoning: conquered summit not shown');
    await page.screenshot({ path: 'scripts/smoke-reckoning.png' });
    await page.keyboard.press('Escape');
  } else if (scenario === 'alive') {
    // the villagers breathe, watch, nod, and fidget — force a market day so
    // the chapman is present too
    await page.goto(`http://localhost:${PORT}/?smoke=alive&market=1`, { waitUntil: 'networkidle2' });
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
          done: st.quests.daily.completed,
          agiXp: st.stats.agi.xp,
          picker: !!document.querySelector('[data-pick]'),
          toast: document.getElementById('toasts').textContent,
        };
      });
    }
    console.log('sage daily:', JSON.stringify(daily));
    if (!daily.done) errors.push('sage: daily never completed');
    if (daily.agiXp !== 25) errors.push(`sage: agi xp ${daily.agiXp} != 25 (verdict not honored)`);
    if (daily.picker) errors.push('sage: picker shown despite a verdict');
    if (!daily.toast.includes('sage')) errors.push(`sage: no verdict toast ("${daily.toast}")`);

    // 2) an off-list answer falls back to the manual picker
    await page.type('[data-input]', 'A deed of pure garble');
    await page.click('[data-post]');
    await page.click('[data-complete]');
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
    await page.click('[data-pick="str"]');
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
          calls: Number(sessionStorage.getItem('smoke-calls') || 0),
        };
      });
    const reload = async () => {
      await page.reload({ waitUntil: 'networkidle2' });
      await new Promise((r) => setTimeout(r, 2000));
    };

    // 1) migration lands on the current version; a failed call writes nothing
    const first = await read();
    console.log('chronicle load 1 (API fails):', JSON.stringify(first));
    if (first.version !== first.latest) errors.push(`chronicle: saveVersion ${first.version} != current ${first.latest}`);
    if (first.calls !== 1) errors.push(`chronicle: ${first.calls} API calls on a failing load != 1`);
    if (first.texts.length !== 0) errors.push('chronicle: an entry was written despite the failure');

    // 2) the next load is the retry: exactly one written entry, the oldest week
    await reload();
    const second = await read();
    console.log('chronicle load 2:', JSON.stringify(second));
    if (second.texts.length !== 1 || !second.texts[0].includes('yard'))
      errors.push(`chronicle: load 2 wrote ${JSON.stringify(second.texts)}, wanted the oldest week only`);
    if (second.calls !== 2) errors.push(`chronicle: ${second.calls} API calls by load 2 != 2`);

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
    await page.goto(`http://localhost:${PORT}/?smoke=market&market=1`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));
    if (!(await page.evaluate(() => !!window.__game.cart)))
      errors.push('market: cart absent though market=1');
    await page.evaluate(() => {
      const g = window.__game;
      const copy = JSON.parse(g.exportSave());
      copy.coins = 2000;
      return g.importSave(JSON.stringify(copy));
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));

    // 2) the prompt offers the cart; E opens the shop
    await page.evaluate(() => {
      const g = window.__game;
      g.player.pos.x = 1.5; // on the path, the chapman's side
      g.player.pos.z = 9.0;
    });
    await new Promise((r) => setTimeout(r, 400));
    const prompt = await page.evaluate(
      () => document.getElementById('interact-prompt').textContent
    );
    console.log('prompt:', JSON.stringify(prompt));
    if (!prompt.includes('chapman')) errors.push(`market: prompt "${prompt}" does not offer the cart`);
    await page.keyboard.press('KeyE');
    await new Promise((r) => setTimeout(r, 300));
    if (await page.evaluate(() => document.getElementById('shop-panel').classList.contains('hidden')))
      errors.push('market: E by the cart did not open the shop');

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

    // 6) the loaf: refused while hale, mends when wounded
    const hale = await page.evaluate(() => document.querySelector('[data-buy="loaf"]')?.disabled);
    if (!hale) errors.push('market: loaf sold at full health');
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));
    await page.evaluate(() => window.__game.player.takeDamage(6, 0, 0));
    await page.keyboard.press('KeyE');
    await new Promise((r) => setTimeout(r, 300));
    await page.click('[data-buy="loaf"]');
    await new Promise((r) => setTimeout(r, 200));
    const fed = await page.evaluate(() => ({
      hp: window.__game.player.hp,
      coins: window.__game.getState().coins,
    }));
    console.log('loaf:', JSON.stringify(fed));
    if (fed.hp !== 20) errors.push(`market: loaf left hp at ${fed.hp}`);
    if (fed.coins !== 1440) errors.push(`market: coins ${fed.coins} != 1440 after the loaf`);
    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));

    // 7) cart portrait, then the empty spot on a non-market day
    await page.evaluate(() => window.__game.orbitCam.setView(-1.1, 0.3, 5.5));
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: 'scripts/smoke-market.png' });
    await page.goto(`http://localhost:${PORT}/?smoke=market&market=0`, { waitUntil: 'networkidle2' });
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
  } else if (scenario === 'crown') {
    // the migration must have stripped the old scheduled deadline
    const migrated = await page.evaluate(() => {
      const st = window.__game.getState();
      // migration must land on the CURRENT version, whatever it is by now
      return { version: st.saveVersion, latest: window.__game.CONFIG.saveVersion, hasDeadline: 'deadline' in st.quests.epic, at: st.coronationAt };
    });
    console.log('migrated:', JSON.stringify(migrated));
    if (migrated.version !== migrated.latest)
      errors.push(`crown: saveVersion ${migrated.version} != current ${migrated.latest}`);
    if (migrated.hasDeadline) errors.push('crown: epic deadline survived the migration');
    if (migrated.at !== null) errors.push('crown: coronationAt set before the crowning');

    // complete the last daily: str 24 -> 25, total levels 70 -> the Coronation
    await page.evaluate(() => window.__game.openPanel('board'));
    await page.type('[data-input]', 'The final deed');
    await page.click('[data-post]');
    await page.click('[data-complete]');
    await page.click('[data-pick="str"]');
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
    await new Promise((r) => setTimeout(r, 300));
    const still = await page.evaluate(() => ({
      at: window.__game.getState().coronationAt,
      histType: window.__game.getState().history.at(-1).type,
    }));
    console.log('after weekly:', JSON.stringify(still));
    if (still.at !== again) errors.push('crown: coronationAt changed on a later quest');
    if (still.histType !== 'weekly') errors.push(`crown: second coronation appended (${still.histType})`);
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
