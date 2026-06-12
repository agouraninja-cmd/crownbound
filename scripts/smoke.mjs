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
  await page.goto(`http://localhost:${PORT}/?smoke=${scenario}`, {
    waitUntil: 'networkidle2',
    timeout: 40000,
  });
  await new Promise((r) => setTimeout(r, 2500));

  if (scenario === 'aerial') {
    await page.evaluate(() => window.__game?.orbitCam?.setView(2.4, 1.1, 14));
  } else if (scenario === 'front') {
    await page.evaluate(() => window.__game?.orbitCam?.setView(-2.6, 0.25, 7));
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
