const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await ctx.newPage(); const errs = [], spoken = [];
  await ctx.addInitScript(() => { const orig = window.speechSynthesis && speechSynthesis.speak.bind(speechSynthesis); if (window.speechSynthesis) speechSynthesis.speak = u => { (window.__said = window.__said || []).push(u.text); }; });
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8766/index.html?b#selftest'); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  console.log('home badge link:', await p.textContent('#badgesBtn'));
  await p.click('#tMath'); await p.click('[data-w="0"]'); await p.click('[data-s="mix"]');
  for (let i = 0; i < 6; i++) { const n = await p.locator('.choice').count(); for (let j = 0; j < n; j++) { const c = p.locator('.choice').nth(j); if (await c.isDisabled()) continue; await c.click(); await p.waitForTimeout(80); if (await p.locator('.choice.right').count()) break; } await p.waitForTimeout(2400); }
  await p.waitForTimeout(1800);
  console.log('toast:', await p.textContent('#toast'));
  console.log('badges:', JSON.stringify(await p.evaluate(() => __owl.st.badges)));
  // read-aloud of word answers: odd/even question for age 5
  await p.evaluate(() => { const s = __owl.st; s.unlockAll = true; s.skills.oddeven.seenLesson = true; window.__said = []; __owl.go(__owl.home); });
  await p.click('#tMath'); await p.click('[data-w="1"]'); await p.click('[data-s="oddeven"]'); await p.waitForTimeout(300);
  console.log('said:', await p.evaluate(() => (window.__said || []).slice(-1)[0]));
  await p.click('#homeBtn'); await p.click('#badgesBtn'); await p.waitForTimeout(200); await p.screenshot({ path: 'b-badges.png', fullPage: true });
  console.log('scrollW', await p.evaluate(() => document.documentElement.scrollWidth));
  console.log('errors', errs.length ? errs : 'none'); await b.close();
})();
