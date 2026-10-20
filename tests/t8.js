const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true }); const p = await ctx.newPage();
  p.on('pageerror', e => errs.push('PAGE ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  // old-version data migrates into player 1
  await p.goto('http://localhost:8766/index.html');
  await p.evaluate(() => { localStorage.clear(); localStorage.setItem('owlcrayon:state', JSON.stringify({ v: 2, name: 'Mia', age: 5, stars: 40, streak: { n: 2, last: '2026-10-19' }, skills: {}, review: [], owlMisses: [], owlTaught: [], plays: { math: 3, art: 1, owl: 0 }, speak: false, unlockAll: false })); localStorage.setItem('owlcrayon:gallery', '["data:x"]'); });
  await p.goto('http://localhost:8766/index.html?r='+Math.random()+'#selftest'); await p.waitForTimeout(300);
  const s1 = await p.evaluate(() => ({ name: __owl.st.name, stars: __owl.st.stars, xp: __owl.st.pet.xp, prof: __owl.profiles.length, h1: document.querySelector('h1').textContent, quest: document.querySelectorAll('.qtask').length }));
  console.log('migrated', JSON.stringify(s1));
  await p.screenshot({ path: 'f-home.png', fullPage: true });
  // answer math until quest math done
  await p.click('.qtask >> nth=0'); await p.click('[data-w="0"]'); await p.click('[data-s="mix"]');
  for (let i = 0; i < 6; i++) {
    const ans = await p.evaluate(() => 0); // brute force: click choices in order until right
    const n = await p.locator('.choice').count();
    for (let j = 0; j < n; j++) { const c = p.locator('.choice').nth(j); if (await c.isDisabled()) continue; await c.click(); await p.waitForTimeout(80); if (await p.locator('.choice.right').count()) break; }
    await p.waitForTimeout(2400);
  }
  const q = await p.evaluate(() => __owl.quest().tasks.map(t => t.k + ':' + t.have + '/' + t.need));
  console.log('quest after math', q.join(' '), 'xp', await p.evaluate(() => __owl.st.pet.xp));
  // complete the rest via hooks, open chest
  await p.evaluate(() => { __owl.quest().tasks.forEach(t => __owl.questTick(t.k, t.need)); __owl.go(__owl.home); });
  await p.click('#chest', { force: true }); await p.waitForTimeout(300);
  console.log('after chest stars', await p.evaluate(() => [__owl.st.stars, __owl.st.questsDone, __owl.quest().claimed]));
  await p.screenshot({ path: 'f-home2.png', fullPage: true });
  // pet view
  await p.click('#petBtn'); await p.waitForTimeout(200); await p.screenshot({ path: 'f-pet.png', fullPage: true });
  const unlocked = await p.locator('.wear:not(.locked)').count(); console.log('wears open', unlocked);
  if (unlocked > 1) { await p.locator('.wear:not(.locked)').nth(1).click(); }
  await p.click('[data-name="Luna"]');
  console.log('pet', JSON.stringify(await p.evaluate(() => __owl.st.pet)));
  // parent: add player
  await p.click('#homeBtn'); await p.click('#parent');
  const prob = await p.locator('.panel .note').first().textContent(); const [a, bb] = prob.match(/(\d+) × (\d+)/).slice(1).map(Number);
  await p.fill('#ga', String(a * bb)); await p.press('#ga', 'Enter');
  await p.fill('#npn', 'Leo'); await p.fill('#npa', '8'); await p.locator('[data-av="🐯"]').click(); await p.click('#addForm button[type=submit]');
  console.log('profiles', await p.evaluate(() => __owl.profiles.length));
  // backup
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#bk')]);
  const path = await dl.path(); const data = JSON.parse(require('fs').readFileSync(path, 'utf8'));
  console.log('backup', data.profiles.length, Object.keys(data.states).length, data.states[data.profiles[0].id].name);
  // reload -> who's playing
  await p.goto('http://localhost:8766/index.html?r='+Math.random()+'#selftest'); await p.waitForTimeout(300);
  console.log('start screen', await p.locator('h1').first().textContent());
  await p.screenshot({ path: 'f-who.png' });
  await p.locator('.who-btn', { hasText: 'Leo' }).click();
  console.log('now', await p.evaluate(() => [__owl.st.name, __owl.st.age, __owl.st.stars]), await p.textContent('#whoBtn'));
  // restore backup wipes Leo's later changes
  await p.click('#parent'); const prob2 = await p.locator('.panel .note').first().textContent(); const [a2, b2] = prob2.match(/(\d+) × (\d+)/).slice(1).map(Number);
  await p.fill('#ga', String(a2 * b2)); await p.press('#ga', 'Enter');
  await p.setInputFiles('#rs', path); await p.waitForTimeout(400);
  console.log('restored', await p.evaluate(() => [__owl.profiles.length, __owl.st.name]));
  await p.screenshot({ path: 'f-parent.png', fullPage: true });
  // owl tick + mic absence ok
  await p.click('#homeBtn'); await p.click('#tOwl'); await p.click('[data-q] >> nth=0');
  // phone overflow
  console.log('scrollW', await p.evaluate(() => document.documentElement.scrollWidth));
  console.log('errors', errs.length ? errs.join('\n') : 'none');
  await b.close();
})();
