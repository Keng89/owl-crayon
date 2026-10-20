// Checks that a new deploy shows the "new version ready" button instead of reloading mid-game.
const fs = require('fs'), path = require('path');
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const SW = path.join(process.argv[2] || '/home/user/owl-crayon', 'sw.js');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8766/'); await p.evaluate(() => navigator.serviceWorker.ready);
  await p.reload(); await p.waitForFunction(() => !!navigator.serviceWorker.controller);
  console.log('controlled, bar before:', await p.locator('#updBar').count());
  const orig = fs.readFileSync(SW, 'utf8');
  fs.writeFileSync(SW, orig.replace(/owl-crayon-(\w+)/, 'owl-crayon-$1x'));
  try {
    await p.evaluate(() => navigator.serviceWorker.getRegistration().then(r => r.update()));
    await p.waitForSelector('#updBar', { timeout: 10000 });
    console.log('bar shown:', await p.textContent('#updBar'));
    await p.click('#updBar'); await p.waitForLoadState('load'); await p.waitForTimeout(300);
    console.log('after tap, bar:', await p.locator('#updBar').count(), 'home:', await p.locator('#tMath').count());
  } finally { fs.writeFileSync(SW, orig); }
  console.log('errors', errs.length ? errs : 'none'); await b.close();
})();
