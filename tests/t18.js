// Math games: plays every game to the end (with some wrong taps) at age 5 and 9, on a phone and a tablet.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, IDS = ['balloon', 'frog', 'shop', 'memory', 'tower', 'train', 'race'];
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(), errs = [], fails = [];
  const run = async (vp, age) => {
    const tag = `${vp.width}-a${age}`, p = await b.newPage({ viewport: vp }); p.on('pageerror', e => errs.push(tag + ': ' + e.message));
    await p.goto(`http://localhost:${PORT}/index.html?g${tag}#selftest`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
    await p.evaluate(a => { __owl.st.age = a; __owl.st.speak = false; __games.secs = 15; }, age);
    await p.click('#tMath'); await p.click('#gm'); await p.waitForTimeout(300);
    await p.screenshot({ path: `${tag}-home.png`, fullPage: true });
    const noScroll = async where => { const [sw, w] = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]); if (sw > w) fails.push(`${tag} ${where}: scrollWidth ${sw} > ${w}`); };
    const outside = async where => { const bad = await p.evaluate(() => { const g = document.querySelector('.game'); if (!g) return 0; const r = g.getBoundingClientRect(); return [...g.querySelectorAll('.gopt,.cbtn,.mcard')].filter(e => { const q = e.getBoundingClientRect(); return q.left < r.left - 1 || q.right > r.right + 1; }).length; }); if (bad) fails.push(`${tag} ${where}: ${bad} buttons outside the game card`); };
    for (const id of IDS) {
      const stars0 = await p.evaluate(() => __owl.st.stars), [ticks0, need] = await p.evaluate(() => [__owl.quest().tasks[0].have, __owl.quest().tasks[0].need]);
      await p.click(`[data-g="${id}"]`); let q = 0, shot = false, guard = 0;
      while (guard++ < 400) {
        await wait(120);
        if (await p.$('#again')) break;
        const st = await p.evaluate(() => { const g = __games.gm; return g && { lock: g.lock, i: g.i }; });
        if (!st || st.lock || !(await p.$('.game'))) continue;
        if (!shot) { await wait(id === 'balloon' || id === 'train' ? 1300 : 400); await p.screenshot({ path: `${tag}-${id}.png` }); shot = true; await noScroll(id); await outside(id); }
        const misses = q === 1 ? 1 : q === 3 ? 2 : 0; // a wrong tap on question 2, two on question 4 (the right answer then glows)
        if (id === 'memory') {
          const ks = await p.$$eval('.mcard:not(.got)', cs => cs.map(c => [c.dataset.j, c.dataset.k]));
          if (q === 0) { const a = ks[0], c = ks.find(x => x[1] !== a[1]); await p.click(`[data-j="${a[0]}"]`); await p.click(`[data-j="${c[0]}"]`); await wait(1300); }
          const keys = [...new Set(ks.map(x => x[1]))];
          for (const [n, k] of keys.entries()) {
            for (const [j] of ks.filter(x => x[1] === k)) await p.click(`[data-j="${j}"]`);
            await wait(250);
            if (n === 1 && keys[2]) { await p.click(`[data-j="${ks.find(x => x[1] === keys[2])[0]}"]`); await wait(350); await p.screenshot({ path: `${tag}-memory-mid.png` }); }
          }
          q++; continue;
        }
        if (id === 'shop' && await p.$('.cbtn')) {
          const price = +await p.getAttribute('.shop', 'data-price'), kinds = (await p.$$eval('.cbtn', bs => bs.map(x => +x.dataset.c))).sort((x, y) => y - x);
          const c = kinds.find(v => price % v);
          if (misses && c) { for (let k = 0; k <= Math.floor(price / c); k++) await p.click(`.cbtn[data-c="${c}"]`); if (q === 1) await p.screenshot({ path: `${tag}-shop-over.png` }); while (await p.$('.pc')) await p.click('.pc'); }
          let rem = price; for (const v of kinds) while (rem >= v) { await p.click(`.cbtn[data-c="${v}"]`); rem -= v; }
          q++; continue;
        }
        for (let m = 0; m < misses; m++) { const w = await p.$('.gopt:not([data-ok]):not(.no):not(.start)'); if (w) { await w.click({ force: true }); await wait(250); } }
        if (q === 3 && id !== 'race') { await wait(300); if (await p.$('.hint') == null) fails.push(`${tag} ${id}: no hint after two misses`); }
        await p.click('[data-ok]', { force: true }); q++;
      }
      await p.waitForTimeout(700);
      if (!(await p.$('#again'))) { fails.push(`${tag} ${id}: never reached the end`); await p.screenshot({ path: `${tag}-${id}-stuck.png` }); }
      const r = await p.evaluate(id => ({ stars: __owl.st.stars, rec: __owl.st.games[id], have: __owl.quest().tasks[0].have }), id);
      const got = r.stars - stars0;
      if (got < 1 || got > 3) fails.push(`${tag} ${id}: stars ${got}`);
      if (!r.rec || r.rec.plays !== 1) fails.push(`${tag} ${id}: best score not saved`);
      if (r.have <= ticks0 && ticks0 < need) fails.push(`${tag} ${id}: quest not ticked`);
      console.log(tag, id, 'questions', q, 'stars +' + got, JSON.stringify(r.rec));
      if (id === 'race' || id === 'frog') await p.screenshot({ path: `${tag}-${id}-done.png` });
      await noScroll(id + ' done');
      await p.click('#more'); await p.waitForTimeout(200);
    }
    // Play again starts a fresh round; the home tiles show best stars.
    await p.click('[data-g="tower"]'); await p.waitForTimeout(300); await p.evaluate(() => __games.gm.i = __games.gm.n - 1); await p.click('[data-ok]'); await p.waitForSelector('#again'); await p.click('#again'); await p.waitForTimeout(300);
    if (!(await p.$('.g-tower'))) fails.push(`${tag}: play again failed`);
    await p.click('#backBtn'); await p.waitForTimeout(200);
    if ((await p.$$('.gbest i.on')).length < 7) fails.push(`${tag}: best stars missing on tiles`);
    await p.screenshot({ path: `${tag}-home-after.png`, fullPage: true }); await noScroll('home');
    await p.close();
  };
  await Promise.all([[{ width: 390, height: 844 }, 5], [{ width: 390, height: 844 }, 9], [{ width: 1024, height: 768 }, 5], [{ width: 1024, height: 768 }, 9]].map(([vp, a]) => run(vp, a)));
  // Every level makes sensible questions: whole-number answers, never negative.
  const p = await b.newPage(); await p.goto(`http://localhost:${PORT}/index.html#selftest`);
  const bad = await p.evaluate(() => { const out = []; for (let d = 0; d <= 6; d++) for (let k = 0; k < 500; k++) { const a = __games.gArith(d); if (!Number.isInteger(a.ans) || a.ans < 0) out.push(d + ':' + a.q + '=' + a.ans); } return out; });
  if (bad.length) fails.push('bad questions ' + bad.slice(0, 5).join(', '));
  console.log('fails', fails.length ? fails : 'none');
  console.log('errors', errs.length || fails.length ? errs : 'none'); await b.close();
})();
