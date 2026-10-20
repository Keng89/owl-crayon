const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://localhost:8766/index.html#selftest'); await p.waitForTimeout(300);
  const out = await p.evaluate(() => {
    const errs = {}, add = (k, m) => { errs[k] = errs[k] || []; if (errs[k].length < 3) errs[k].push(m); };
    for (const [id, s] of Object.entries(window.__owl.MATH)) for (let L = 1; L <= 5; L++) for (let i = 0; i < 300; i++) {
      let q; try { q = s.gen(L); } catch (e) { add(id + L, 'throw ' + e.message); continue; }
      const vals = q.choices.map(c => String(c.val)), all = [q.prompt, q.speak, q.visual, q.explain, q.explainText, ...(q.steps||[]), ...q.choices.map(c => c.html + "|" + c.say)].join(" ~ ");
      if (!vals.includes(String(q.answer))) add(id + L, 'answer missing: ' + q.answer + ' in ' + vals);
      if (new Set(vals).size !== vals.length) add(id + L, 'dup ' + vals);
      if (vals.length < 2) add(id + L, 'few ' + vals);
      if (/NaN|undefined|Infinity/.test(all)) add(id + L, 'bad text ' + all.match(/.{0,40}(NaN|undefined|Infinity).{0,30}/)?.[0]);
    }
    return errs;
  });
  console.log(JSON.stringify(out, null, 1).slice(0, 6000));
  await b.close();
})();
