const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } }); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(`http://localhost:${process.env.PORT || 8766}/index.html?w#selftest`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
  await p.click('#tMath'); await p.click('[data-w="0"]'); await p.click('[data-s="mix"]');
  for (let i = 0; i < 6; i++) { const n = await p.locator('.choice').count(); for (let j = 0; j < n; j++) { const c = p.locator('.choice').nth(j); if (await c.isDisabled()) continue; await c.click(); await p.waitForTimeout(80); if (await p.locator('.choice.right').count()) break; } await p.waitForTimeout(2400); }
  console.log('days', JSON.stringify(await p.evaluate(() => __owl.st.days)));
  await p.click('#homeBtn'); await p.click('#tOwl');
  for (const q of ['how do I count coins', 'what is a kilogram', 'how many minutes in an hour', 'what is a bar chart']) { await p.fill('#askq', q); await p.press('#askq', 'Enter'); await p.waitForTimeout(150); console.log(q, '->', (await p.textContent('#bub')).slice(0, 60)); }
  await p.click('#homeBtn'); await p.click('#parent'); const prob = await p.locator('.panel .note').first().textContent(); const [x, y] = prob.match(/(\d+) × (\d+)/).slice(1).map(Number);
  await p.fill('#ga', String(x * y)); await p.press('#ga', 'Enter'); await p.waitForTimeout(200);
  await p.locator('.panel').nth(0).screenshot({ path: 'w-week.png' });
  console.log(await p.locator('.panel').nth(0).innerText());
  console.log('errors', errs.length ? errs : 'none'); await b.close();
})();
