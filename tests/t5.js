const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
// Every math topic × 5 levels × 300 questions: the answer is one of the choices, no duplicate choices, no NaN/undefined.
// The hands-on topics (math5.js) are also checked: every question has a picture, and a hands-on question's answer can
// really be made with its widget (a clock time on its step, a bar height on the grid, an order of the shown cards,
// an amount the coin tray can pay). Takes PORT (default 8766).
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto(`http://localhost:${process.env.PORT || 8766}/index.html#selftest`); await p.waitForTimeout(300);
  const out = await p.evaluate(() => {
    const errs = {}, add = (k, m) => { errs[k] = errs[k] || []; if (errs[k].length < 3) errs[k].push(m); };
    const M5 = new Set(window.__math5.ids), seen = {};
    for (const [id, s] of Object.entries(window.__owl.MATH)) for (let L = 1; L <= 5; L++) for (let i = 0; i < 300; i++) {
      let q; try { q = s.gen(L); } catch (e) { add(id + L, 'throw ' + e.message); continue; }
      const vals = q.choices.map(c => String(c.val)), all = [q.prompt, q.speak, q.visual, q.explain, q.explainText, ...(q.steps||[]), ...q.choices.map(c => c.html + "|" + c.say)].join(" ~ ");
      if (!vals.includes(String(q.answer))) add(id + L, 'answer missing: ' + q.answer + ' in ' + vals);
      if (new Set(vals).size !== vals.length) add(id + L, 'dup ' + vals);
      if (vals.length < 2) add(id + L, 'few ' + vals);
      if (/NaN|undefined|Infinity|\[object/.test(all)) add(id + L, 'bad text ' + all.match(/.{0,40}(NaN|undefined|Infinity|\[object).{0,30}/)?.[0]);
      if (!M5.has(id)) continue;
      seen[id] = seen[id] || { levels: new Set(), hands: 0 }; seen[id].levels.add(L);
      if (!/<svg/.test(q.visual + q.choices.map(c => c.html).join(''))) add(id + L, 'no picture: ' + q.prompt);
      const it = q.interact; if (!it) continue; seen[id].hands++;
      if (!window.__math5.MX[it.kind]) { add(id + L, 'no widget ' + it.kind); continue; }
      if (JSON.stringify(JSON.parse(JSON.stringify(q))) !== JSON.stringify(q)) add(id + L, 'not saveable');
      const a = String(q.answer);
      if (it.kind === 'clock') { const [h, m] = a.split(':').map(Number); if (!(h >= 1 && h <= 12 && m >= 0 && m < 60 && m % it.step === 0) && it.step !== 60) add(id + L, 'clock off-step ' + a + ' step ' + it.step); if (it.step === 60 && m) add(id + L, 'clock ' + a); if (`${it.h0}:${String(it.m0).padStart(2, '0')}` === a) add(id + L, 'clock starts on answer'); }
      if (it.kind === 'bars') { const v = a.split(',').map(Number); if (v.length !== it.cats.length || v.some(x => x % it.step || x <= 0 || x > it.max)) add(id + L, 'bars ' + a); }
      if (it.kind === 'order') { const v = a.split(' > '); if (v.length !== it.items.length || [...v].sort().join() !== it.items.map(x => x[1]).sort().join()) add(id + L, 'order ' + a); if (it.items.map(x => x[1]).join(' > ') === a) add(id + L, 'order shown already solved'); }
      if (it.kind === 'pay') { if (window.__math5.split(+a, it.tray).reduce((x, y) => x + y, 0) !== +a || +a <= 0) add(id + L, 'pay ' + a); }
      if (it.kind === 'blocks') { if (+a !== it.len || it.len > it.max) add(id + L, 'blocks ' + a); }
    }
    for (const id of M5) { if (!seen[id] || seen[id].levels.size !== 5) add(id, 'not all 5 levels'); }
    const hands = Object.entries(seen).filter(([, v]) => v.hands).map(([k, v]) => k + ':' + v.hands);
    return { errs, topics: Object.keys(window.__owl.MATH).length, newTopics: M5.size, hands };
  });
  console.log('topics', out.topics, 'new', out.newTopics, 'hands-on', out.hands.join(' '));
  console.log(Object.keys(out.errs).length ? JSON.stringify(out.errs, null, 1).slice(0, 6000) : '{}');
  await b.close();
})();
