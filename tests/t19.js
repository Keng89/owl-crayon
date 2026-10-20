// Math games 2: plays every new game to the end (with some wrong taps) at age 5 and 9, on a phone and a tablet,
// then fuzzes each new game's question maker at every level.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, IDS = ['fish', 'pizza', 'feed', 'rocket', 'target', 'bee', 'map'];
const wait = ms => new Promise(r => setTimeout(r, ms));
const TAPS = '.gopt,.cbtn,.mcard,.serve,.pile2,.nkey,.bhex,.tcell,.tgt,.fcritter,.fish';
(async () => {
  const b = await chromium.launch(), errs = [], fails = [];
  const run = async (vp, age) => {
    const tag = `${vp.width}-a${age}`, p = await b.newPage({ viewport: vp }); p.on('pageerror', e => errs.push(tag + ': ' + e.message));
    await p.goto(`http://localhost:${PORT}/index.html?g2${tag}#selftest`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
    await p.evaluate(a => { __owl.st.age = a; __owl.st.speak = false; }, age);
    await p.click('#tMath'); await p.click('#gm'); await p.waitForTimeout(300);
    await p.screenshot({ path: `g2-${tag}-home.png`, fullPage: true });
    if ((await p.$$('.gtile')).length < 14) fails.push(`${tag}: only ${(await p.$$('.gtile')).length} game tiles`);
    const noScroll = async where => { const [sw, w] = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]); if (sw > w) fails.push(`${tag} ${where}: scrollWidth ${sw} > ${w}`); };
    const outside = async where => { const bad = await p.evaluate(sel => { const g = document.querySelector('.game'); if (!g) return []; const r = g.getBoundingClientRect(); return [...g.querySelectorAll(sel)].filter(e => { const q = e.getBoundingClientRect(); return q.width && (q.left < r.left - 1 || q.right > r.right + 1); }).map(e => e.className); }, TAPS); if (bad.length) fails.push(`${tag} ${where}: ${bad.length} buttons outside the game card (${bad[0]})`); };
    const small = async where => { const bad = await p.evaluate(sel => [...document.querySelectorAll('.game ' + sel.split(',').join(',.game '))].filter(e => { const q = e.getBoundingClientRect(); return q.width && (q.width < 38 || q.height < 38); }).map(e => e.className + ' ' + Math.round(e.getBoundingClientRect().width)), TAPS); if (bad.length) fails.push(`${tag} ${where}: small tap targets ${bad.slice(0, 2)}`); };
    const state = () => p.evaluate(() => { const g = __games.gm; return g && { lock: g.lock, i: g.i, tries: g.tries }; });
    for (const id of IDS) {
      const stars0 = await p.evaluate(() => __owl.st.stars);
      await p.click(`[data-g="${id}"]`); let q = 0, guard = 0, shots = 0;
      while (guard++ < 300) {
        await wait(120);
        if (await p.$('#again')) break;
        const s0 = await state();
        if (!s0 || s0.lock || !(await p.$('.game'))) continue;
        await wait(250);
        if (shots < 2 && (q === 0 || q === 5)) { await p.screenshot({ path: `g2-${tag}-${id}-${q}.png` }); shots++; await noScroll(id); await outside(id); await small(id); }
        const misses = q === 1 ? 1 : q === 3 ? 2 : 0; // a wrong tap on question 2, two on question 4 (the right answer then glows)
        const kind = await p.evaluate(() => document.querySelector('#serve') ? 'make' : document.querySelector('.bhex') ? 'bee' : document.querySelector('.ffarm.big') && !document.querySelector('.gch') ? 'feed' : 'tap');
        if (kind === 'make') {
          for (let m = 0; m < misses; m++) { await p.click('#serve', { force: true }); await wait(200); }
          const need = +await p.getAttribute('.pzwrap', 'data-need');
          for (let k = 0; k < 40 && (await p.$$('.pz.on')).length < need; k++) { await p.click('.pz:not(.on)', { force: true }); await wait(60); }
          if ((await p.$$('.pz.on')).length !== need) fails.push(`${tag} pizza: tapping slices did not add pepperoni`);
          if (misses === 2 && !(await p.$('.hint'))) fails.push(`${tag} ${id}: no hint after two misses`);
          await p.click('#serve', { force: true }); q++; continue;
        }
        if (kind === 'bee') {
          for (let m = 0; m < misses; m++) { const w = await p.$$('.bhex:not([data-ok])'); await w[0].click(); await w[1].click(); await wait(250); }
          if (misses === 2 && !(await p.$('.hint'))) fails.push(`${tag} ${id}: no hint after two misses`);
          const ok = await p.$$('.bhex[data-ok]'); await ok[0].click({ force: true }); await ok[1].click({ force: true }); q++; continue;
        }
        if (kind === 'feed' && misses) {
          const c = await p.$('.fcritter[data-ok]'); for (let k = 0; k < 6 && await c.getAttribute('data-ok'); k++) await c.click({ force: true });
          for (let m = 0; m < misses; m++) { await c.click({ force: true }); await wait(250); }
        } else {
          if (await p.$('#pzz .pz:not(.gone)') && q === 2) { await p.click('#pzz .pz:not(.gone)', { force: true }); await wait(100); } // slices are a helper too
          if (await p.$('#pile') && q === 2) { await p.click('#pile'); await p.click('#pile'); }
          for (let m = 0; m < misses; m++) { const w = await p.$('.gopt:not([data-ok]):not(.no):not(.start):not(.used)'); if (w) { await w.click({ force: true }); await wait(250); } }
        }
        if (misses === 2 && (await state()).tries >= 2) { await wait(200); if (!(await p.$('.hint'))) fails.push(`${tag} ${id}: no hint after two misses`); }
        // Tap the right answer until the question is done (rockets and feeding take several right taps).
        for (let k = 0; k < 60; k++) {
          const s = await state(); if (!s || s.lock || s.i !== s0.i) break;
          const ok = await p.$('[data-ok]'); if (!ok) { await wait(100); continue; }
          await ok.click({ force: true }); await wait(90);
        }
        q++;
      }
      await p.waitForTimeout(800);
      if (!(await p.$('#again'))) { fails.push(`${tag} ${id}: never reached the end`); await p.screenshot({ path: `g2-${tag}-${id}-stuck.png` }); }
      const r = await p.evaluate(id => ({ stars: __owl.st.stars, rec: __owl.st.games[id] }), id), got = r.stars - stars0;
      if (got < 1 || got > 3) fails.push(`${tag} ${id}: stars ${got}`);
      if (!r.rec || r.rec.plays !== 1 || !(r.rec.best > 0)) fails.push(`${tag} ${id}: best score not saved`);
      console.log(tag, id, 'questions', q, 'stars +' + got, JSON.stringify(r.rec));
      await noScroll(id + ' done');
      await p.click('#more'); await p.waitForTimeout(200);
    }
    if ((await p.$$('.gbest i.on')).length < 7) fails.push(`${tag}: best stars missing on tiles`);
    await p.close();
  };
  await Promise.all([[{ width: 390, height: 844 }, 5], [{ width: 390, height: 844 }, 9], [{ width: 1024, height: 768 }, 5], [{ width: 1024, height: 768 }, 9]].map(([vp, a]) => run(vp, a)));

  // Every level of every new game makes sensible questions.
  const p = await b.newPage({ viewport: { width: 390, height: 844 } }); p.on('pageerror', e => errs.push('fuzz: ' + e.message));
  await p.goto(`http://localhost:${PORT}/index.html?fz#selftest`);
  const bad = await p.evaluate(() => {
    const G = __games2, out = [], no = (c, m) => { if (!c && out.length < 40) out.push(m); };
    const chk = (cs, ans, tag) => { const v = cs.map(c => String(c.val ?? c)); no(new Set(v).size === v.length, tag + ' duplicate choices ' + v); no(v.filter(x => x === String(ans)).length === 1, tag + ' answer not in choices ' + ans + ' ' + v); };
    for (let d = 0; d <= 6; d++) for (let k = 0; k < 300; k++) {
      const t = `L${d}`;
      const f = G.fishMake(d); no(f.nums.length === [3, 4, 5, 5, 5, 5, 5][d] && new Set(f.nums).size === f.nums.length, t + ' fish nums ' + f.nums);
      no(f.nums.filter(f.ok).length === 1 && f.ok(f.ans) && f.nums.includes(f.ans), t + ' fish not exactly one right ' + f.q + ' ' + f.nums);
      no(f.nums.every(v => Number.isInteger(v) && v >= 0), t + ' fish bad number ' + f.nums);
      const z = G.pizzaMake(d);
      if (z.mode === 'share') { no(z.den === z.f * z.e && z.den <= 12 && z.e >= 1, t + ' pizza share ' + JSON.stringify(z)); chk(z.choices, z.ans, t + ' pizza'); }
      else if (z.mode === 'make') no(z.need >= 1 && z.need < z.den && z.den <= 12 && z.need / z.den === z.n / z.dt, t + ' pizza make ' + JSON.stringify(z));
      else if (z.mode === 'of') { no(Number.isInteger(z.ans) && z.den <= 12 && z.ans === z.den / z.dt * z.n, t + ' pizza of'); chk(z.choices, z.ans, t + ' pizza of'); }
      else { chk(z.choices, z.ans, t + ' pizza ' + z.mode); const vs = z.choices.map(c => c.val.split('/')).map(([a, b]) => a / b); no(new Set(vs).size === vs.length && vs.every(v => v > 0 && v <= 1), t + ' pizza fractions equal or >1 ' + z.choices.map(c => c.val)); const [a, b] = z.ans.split('/'); no(z.mode !== 'left' || +a === z.den - z.k, t + ' pizza left'); no(z.mode !== 'add' || +a === z.a + z.b && +b === z.den, t + ' pizza add'); }
      const e = G.feedMake(d);
      if (e.mode === 'rem') no(e.T === e.g * e.e + e.L && e.L > 0 && e.L < e.g, t + ' feed rem'); else no(e.ans === (e.mode === 'div' ? e.T / e.g : e.g * e.e) && Number.isInteger(e.ans) && e.ans > 0, t + ' feed ' + JSON.stringify(e));
      chk(e.choices, e.ans, t + ' feed ' + e.mode);
      for (const i of [0, 1]) {
        const r = G.rocketMake(d, i);
        if (r.mode === 'count') { no(r.seq.every((v, j) => !j || r.seq[j - 1] - v === r.step), t + ' rocket seq'); no(new Set(r.pad).size === r.pad.length && r.seq.slice(r.given ? 1 : 0).every(v => r.pad.includes(v)), t + ' rocket pad ' + r.pad); no(d === 6 || r.seq.every(v => v >= 0), t + ' rocket negative ' + r.seq); no(r.pad.length <= 13, t + ' rocket pad too long'); }
        else { no(r.ans === r.a - r.b && (d === 6 || r.ans >= 0), t + ' rocket sub ' + r.a + '-' + r.b); chk(r.choices, r.ans, t + ' rocket sub'); }
      }
      const g = G.targetMake(d), vs = g.items.map(x => x.v);
      if (g.mode === 'pick') { no(new Set(vs).size === vs.length, t + ' target ties ' + vs); no(vs[g.ans] === (g.small ? Math.min(...vs) : Math.max(...vs)), t + ' target wrong answer'); }
      else no(g.ans === (Math.abs(vs[0] - vs[1]) < 1e-9 ? 'eq' : vs[0] < vs[1] ? 'lt' : 'gt'), t + ' target sign ' + vs + ' ' + g.ans);
      const h = G.beeMake(d), n = h.nums, comb = (x, y) => h.op === '+' ? x + y : x * y; let pairs = 0;
      for (let x = 0; x < n.length; x++) for (let y = x + 1; y < n.length; y++) if (comb(n[x], n[y]) === h.T) pairs++;
      no(pairs === 1 && comb(h.a, h.b) === h.T && new Set(n).size === n.length && n.length === (d === 0 ? 4 : d <= 2 ? 7 : d <= 4 ? 8 : 10), t + ' bee ' + h.T + ' ' + n + ' pairs ' + pairs);
      const m = G.mapMake(d), inG = ([x, y]) => x >= m.lo && x <= m.hi && y >= m.lo && y <= m.hi;
      no(inG(m.ans), t + ' map answer off the grid');
      if (m.path) { no(m.path.every(inG), t + ' map path off the grid'); const [x, y] = m.moves.reduce(([x, y], [dr, k]) => [x + ({ r: k, l: -k }[dr] || 0), y + ({ u: k, d: -k }[dr] || 0)], m.start); no(x === m.ans[0] && y === m.ans[1], t + ' map moves do not end at the answer'); }
      if (m.mode === 'read') { chk(m.choices, m.ans.join(','), t + ' map read'); no(m.choices.length >= 3, t + ' map read few choices'); }
    }
    return out;
  });
  if (bad.length) fails.push('bad questions: ' + bad.slice(0, 8).join(' | '));
  console.log('fails', fails.length ? fails : 'none');
  console.log('errors', errs.length || fails.length ? errs : 'none'); await b.close();
})();
