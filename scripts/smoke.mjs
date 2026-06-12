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
const executablePath = BROWSERS.find(existsSync);
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
    // a 35-day streak, daily already done today: roaring blaze + full 60 stamina
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
      stamina: { current: 60, date: dstr(0) },
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
      saveVersion: 1,
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
        epic: { text: 'Become Crowned', progressPct: 10, deadline: '2027-06-08T05:00:00' },
      },
      history: [{ date: dstr(-2), questText: 'old deed', statTrained: 'str', type: 'daily' }],
      daysPlayed: 3,
      stamina: { current: 60, date: dstr(-2) },
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
        streak: st.streak.current,
        best: st.streak.best,
        stamina: st.stamina.current,
        dummyHits: st.counters.dummyHits,
        daysPlayed: st.daysPlayed,
        coins: st.coins,
        strLevel: st.stats.str.level,
        epicText: st.quests.epic.text,
      };
    });
    console.log('after rollover:', JSON.stringify(s1));
    if (s1.dailyText !== '') errors.push('rollover: daily quest not reset');
    if (s1.dailyDone) errors.push('rollover: daily still completed');
    if (s1.weeklyText !== '') errors.push('rollover: weekly not reset');
    if (s1.streak !== 0) errors.push(`rollover: streak ${s1.streak} != 0 (fire should die)`);
    if (s1.best !== 9) errors.push(`rollover: best streak ${s1.best} != 9`);
    if (s1.stamina !== 30) errors.push(`rollover: stamina ${s1.stamina} != 30`);
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
      for (let i = 0; i < 6; i++) spends.push(g.spendStamina(5)); // 60 -> 30
      const mid = g.getState().stamina.current;
      const big = g.spendStamina(30); // -> 0
      const empty = g.spendStamina(5); // must refuse
      return { spends, mid, big, empty, end: g.getState().stamina.current };
    });
    console.log('stamina drain:', JSON.stringify(drain));
    if (drain.spends.some((v) => !v)) errors.push('fire: early spends refused');
    if (drain.mid !== 30) errors.push(`fire: mid stamina ${drain.mid} != 30`);
    if (!drain.big) errors.push('fire: spend-to-zero refused');
    if (drain.empty) errors.push('fire: spend allowed at 0 stamina');
    if (drain.end !== 0) errors.push(`fire: end stamina ${drain.end} != 0`);
  } else if (scenario === 'aerial') {
    await page.evaluate(() => window.__game?.orbitCam?.setView(2.4, 1.1, 14));
  } else if (scenario === 'front') {
    await page.evaluate(() => window.__game?.orbitCam?.setView(-2.6, 0.25, 7));
  } else if (scenario === 'quests') {
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
      };
    });
    console.log('quest state:', JSON.stringify(s));
    if (s.coins !== 10) errors.push(`quests: coins ${s.coins} != 10`);
    if (s.strXp !== 25) errors.push(`quests: strXp ${s.strXp} != 25`);
    if (s.streak !== 1) errors.push(`quests: streak ${s.streak} != 1`);
    if (!s.done) errors.push('quests: daily not completed');
    if (s.stamina !== 60) errors.push(`quests: stamina ${s.stamina} != 60`);
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
  } else if (scenario === 'tome') {
    await page.evaluate(() => window.__game.openPanel('tome'));
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
    if (afterDummy.stamina !== 20) errors.push(`combat: stamina ${afterDummy.stamina} != 20`);

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

    // 3) death: take a mortal blow, wake at the hovel with full hp
    await page.evaluate(() => window.__game.player.takeDamage(99, 11, 11));
    await new Promise((r) => setTimeout(r, 1800));
    const wake = await page.evaluate(() => ({
      hp: window.__game.player.hp,
      x: window.__game.player.pos.x,
      z: window.__game.player.pos.z,
    }));
    console.log('after death:', JSON.stringify(wake));
    if (wake.hp !== 20) errors.push(`death: hp ${wake.hp} != 20 after respawn`);
    if (Math.hypot(wake.x + 5, wake.z - 4) > 1.5)
      errors.push(`death: respawned at ${wake.x.toFixed(1)},${wake.z.toFixed(1)} not the hovel`);
  } else if (scenario === 'walk') {
    const before = await page.evaluate(() => ({ x: window.__game.player.pos.x, z: window.__game.player.pos.z }));
    await page.keyboard.down('KeyW');
    await new Promise((r) => setTimeout(r, 2000));
    await page.keyboard.up('KeyW');
    const after = await page.evaluate(() => ({ x: window.__game.player.pos.x, z: window.__game.player.pos.z }));
    const moved = Math.hypot(after.x - before.x, after.z - before.z);
    console.log(`walk check: moved ${moved.toFixed(2)} units`);
    if (moved < 2) errors.push(`walk: player barely moved (${moved.toFixed(2)} units)`);
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
