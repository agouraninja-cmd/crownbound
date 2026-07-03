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
      return { version: st.saveVersion, hasDeadline: 'deadline' in st.quests.epic, at: st.coronationAt };
    });
    console.log('migrated:', JSON.stringify(migrated));
    if (migrated.version !== 6) errors.push(`crown: saveVersion ${migrated.version} != 6`);
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
