// Photograph one house on the bench:  node scripts/bench/shot.cjs <id> [out.png] [query…]
//   e.g. node scripts/bench/shot.cjs reeve /tmp/reeve.png hour=21 marks=1
// Needs the bench's dev server running:  npx vite --port 5180 --strictPort
const { chromium } = require('playwright');
(async () => {
  const [, , id, out = `/tmp/bench-${id}.png`, ...extra] = process.argv;
  const port = process.env.BENCH_PORT || 5180;
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e.stack || e.message)));
  await page.goto(`http://localhost:${port}/scripts/bench/house.html?id=${id}${extra.map((e) => '&' + e).join('')}`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__bench, { timeout: 60000 }).catch(() => errors.push('the bench never finished'));
  await page.waitForTimeout(300);
  const report = await page.evaluate(() => window.__bench || null);
  await page.screenshot({ path: out });
  await browser.close();
  console.log(JSON.stringify({ ...report, pageErrors: errors, shot: out }, null, 1));
})();
