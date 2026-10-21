// Read-aloud text: signs, money, remainders and ratios are spoken as words.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(`http://localhost:${process.env.PORT || 8766}/index.html?r=${Date.now()}#selftest`);
  const r = await p.evaluate(() => ['3 &lt; 5', '7 &gt; 2', '4 ≤ 6', 'x ≥ 3', '≈ 40', '75¢', '$3.50', '$20', '17 r 2', '2 : 3', 'It is 3:00', '1 ≠ 2', '? + 2 = 5'].map(t => window.__owl.speakable(t).trim()));
  const want = ['3 is less than 5', '7 is greater than 2', '4 is less than or equal to 6', 'x is greater than or equal to 3', 'about 40', '75 cents', '3 dollars and 50 cents', '20 dollars', '17 remainder 2', '2 to 3', 'It is 3:00', '1 is not equal to 2', 'what + 2 = 5'];
  r.forEach((v, i) => { if (v !== want[i]) errs.push(`spoke "${v}" not "${want[i]}"`); }); console.log('errors', errs.length ? errs : 'none'); await b.close(); })();
