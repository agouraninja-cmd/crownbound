// Photograph one neighbour's house on the bench (scripts/bench/house.html):
//   node scripts/bench/shot.mjs <id> [out.png] [query…]
//   e.g. node scripts/bench/shot.mjs smith scripts/bench/smith.png hour=21 marks=1
//        node scripts/bench/shot.mjs smith out.png "views=20,8,6,1.2;200,25,9,1"
// The bench is served by the dev server, on a port of its own so `npm run dev`
// can stay up beside it:  npx vite --port 5180 --strictPort
// Prints the bench's report as JSON: errors, triangles, colliders, how far the
// house reaches and whether anything stands outside its yard.
// The browser is found as the smoke suite finds it (SMOKE_BROWSER overrides).
import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const BROWSERS = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];
const executablePath = process.env.SMOKE_BROWSER || BROWSERS.find(existsSync);
if (!executablePath) {
  console.error('No Edge/Chrome found for the bench (set SMOKE_BROWSER)');
  process.exit(2);
}

const [, , id, out = `scripts/bench/${id}.png`, ...extra] = process.argv;
if (!id) {
  console.error('usage: node scripts/bench/shot.mjs <house id> [out.png] [hour=21] [marks=1] [views=…]');
  process.exit(2);
}
const port = process.env.BENCH_PORT || 5180;

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox', '--window-size=1600,1200'],
  defaultViewport: { width: 1600, height: 1200 },
});
const page = await browser.newPage();
const pageErrors = [];
page.on('console', (m) => m.type() === 'error' && pageErrors.push(m.text()));
page.on('pageerror', (e) => pageErrors.push(String(e.stack || e.message)));
try {
  await page.goto(`http://localhost:${port}/scripts/bench/house.html?id=${id}${extra.map((e) => '&' + e).join('')}`, { waitUntil: 'load', timeout: 40000 });
  await page.waitForFunction(() => window.__bench, { timeout: 60000 });
  await new Promise((r) => setTimeout(r, 300));
  const report = await page.evaluate(() => window.__bench);
  await page.screenshot({ path: out });
  console.log(JSON.stringify({ ...report, pageErrors, shot: out }, null, 1));
} catch (e) {
  console.error(`the bench did not answer on port ${port} (is the dev server up?): ${e.message}`);
  process.exitCode = 1;
} finally {
  await browser.close();
}
