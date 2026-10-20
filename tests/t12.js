const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8766/index.html?l#selftest'); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  for (const [skill, L] of [['simul', 5], ['lines', 4], ['numbers', 2]]) {
    await p.evaluate(([skill, L]) => { const s = __owl.st; s.unlockAll = true; s.skills[skill].seenLesson = true; s.skills[skill].m = (L - 1) / 5 + 0.01; }, [skill, L]);
    await p.evaluate(() => __owl.go(__owl.home));
    await p.click('#tMath'); await p.click('[data-w="' + (skill === 'numbers' ? 0 : 4) + '"]'); await p.click(`[data-s="${skill}"]`); await p.waitForTimeout(200);
    await p.screenshot({ path: `l-${skill}.png` });
    console.log(skill, 'labels:', await p.$$eval('.choice', bs => bs.map(b => b.getAttribute('aria-label') || b.innerText.replace(/\n/g, ' ')).join(' | ')), 'scrollW', await p.evaluate(() => document.documentElement.scrollWidth));
  }
  console.log('errors', errs.length ? errs : 'none'); await b.close();
})();
