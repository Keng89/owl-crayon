// Math games 3: plays every new game to the end (with some wrong taps) at age 5 and 9, on a phone and a tablet,
// then fuzzes each new game's question maker at every level.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, IDS = ['snake', 'bakery', 'park', 'monster', 'bubble', 'sticker', 'sudoku'];
const wait = ms => new Promise(r => setTimeout(r, ms));
const TAPS = '.gopt,.g3bk-done,.g3sn-roll,.g3bb-peek,.g3sk-stk,.g3sd-key';
(async () => {
  const b = await chromium.launch(), errs = [], fails = [];
  const run = async (vp, age) => {
    const tag = `${vp.width}-a${age}`, p = await b.newPage({ viewport: vp }); p.on('pageerror', e => errs.push(tag + ': ' + e.message));
    await p.goto(`http://localhost:${PORT}/index.html?g3${tag}#selftest`); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300);
    await p.evaluate(a => { __owl.st.age = a; __owl.st.speak = false; }, age);
    await p.click('#tMath'); await p.click('#gm'); await p.waitForTimeout(300);
    await p.screenshot({ path: `g3-${tag}-home.png`, fullPage: true });
    const tiles = (await p.$$('.gtile')).length; if (tiles !== 23) fails.push(`${tag}: ${tiles} game tiles, expected 23`);
    const noScroll = async where => { const [sw, w] = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]); if (sw > w) fails.push(`${tag} ${where}: scrollWidth ${sw} > ${w}`); };
    const outside = async where => { const bad = await p.evaluate(sel => { const g = document.querySelector('.game'); if (!g) return []; const r = g.getBoundingClientRect(); return [...g.querySelectorAll(sel)].filter(e => { const q = e.getBoundingClientRect(); return q.width && (q.left < r.left - 1 || q.right > r.right + 1); }).map(e => e.className); }, TAPS); if (bad.length) fails.push(`${tag} ${where}: ${bad.length} buttons outside the game card (${bad[0]})`); };
    const small = async where => { const bad = await p.evaluate(sel => [...document.querySelectorAll('.game ' + sel.split(',').join(',.game '))].filter(e => { const q = e.getBoundingClientRect(); return q.width && (q.width < 38 || q.height < 38); }).map(e => e.className + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)), TAPS); if (bad.length) fails.push(`${tag} ${where}: small tap targets ${bad.slice(0, 2)}`); };
    const state = () => p.evaluate(() => { const g = __games.gm; return g && { lock: g.lock, i: g.i, tries: g.tries }; });
    const checkHint = async (id, misses) => { if (misses === 2 && (await state()).tries >= 2) { await wait(150); if (!(await p.$('.hint'))) fails.push(`${tag} ${id}: no hint after two misses`); } };
    for (const id of IDS) {
      const stars0 = await p.evaluate(() => __owl.st.stars);
      await p.click(`[data-g="${id}"]`); let q = 0, guard = 0, shots = 0;
      while (guard++ < 400) {
        await wait(120);
        if (await p.$('#again')) break;
        const s0 = await state();
        if (!s0 || s0.lock || !(await p.$('.game'))) continue;
        await wait(250);
        if (shots < 2 && (q === 0 || q === 4)) { await p.screenshot({ path: `g3-${tag}-${id}-${q}.png` }); shots++; await noScroll(id); await outside(id); await small(id); }
        const misses = q === 1 ? 1 : q === 3 ? 2 : 0; // a wrong tap on question 2, two on question 4 (the right answer then glows)
        if (id === 'snake') {
          await p.click('#snRoll'); await p.waitForSelector('.g3sn-cell[data-ok]');
          if (q === 2) await p.screenshot({ path: `g3-${tag}-snake-rolled.png` });
          for (let m = 0; m < misses; m++) { const me = await p.evaluate(() => __games.gm.sn.me); const w = await p.$(`.g3sn-cell:not([data-ok]):not([data-k="${me}"])`); await w.click(); await wait(200); }
          await checkHint(id, misses);
          await p.click('.g3sn-cell[data-ok]', { force: true }); q++; continue;
        }
        if (await p.$('.g3bk-box[data-need]')) {
          for (let m = 0; m < misses; m++) { await p.click('#bkDone', { force: true }); await wait(200); }
          await checkHint(id, misses);
          const need = +await p.getAttribute('.g3bk-box', 'data-need');
          for (let k = 0; k < 40 && (await p.$$('.g3bk-slot.on')).length < need; k++) { await p.click('.g3bk-slot:not(.on)'); await wait(40); }
          if ((await p.$$('.g3bk-slot.on')).length !== need) fails.push(`${tag} bakery: tapping spots did not fill the box`);
          await p.click('#bkDone', { force: true }); q++; continue;
        }
        if (await p.$('.g3sk-stk')) {
          if (q === 0) { const two = await p.$$('.g3sk-stk'); await two[0].click(); await two[1].click(); await p.screenshot({ path: `g3-${tag}-sticker-sorting.png` }); }
          while (await p.$('.g3sk-stk')) { await p.click('.g3sk-stk'); await wait(30); }
          await p.waitForSelector('#skq .gopt');
        }
        if (await p.$('.g3sd-key')) {
          for (let m = 0; m < misses; m++) { const w = await p.$('.g3sd-key:not([data-ok]):not(.no)'); await w.click(); await wait(200); }
        } else if (await p.$('.g3bb-tank') && q === 2) {
          await wait(5600); if (!(await p.$('.g3bb-tank.fog'))) fails.push(`${tag} bubble: dots never hid`);
          await p.click('#peek'); await wait(200); if (await p.$('.g3bb-tank.fog')) fails.push(`${tag} bubble: peek did not show the dots`);
        } else {
          for (let m = 0; m < misses; m++) { const w = await p.$('.game .gopt:not([data-ok]):not(.no)'); if (w) { await w.click(); await wait(250); } }
        }
        await checkHint(id, misses);
        // Tap the right answer until the question is done (sudoku takes several right taps).
        for (let k = 0; k < 60; k++) {
          const s = await state(); if (!s || s.lock || s.i !== s0.i) break;
          const ok = await p.$('.game [data-ok]'); if (!ok) { await wait(100); continue; }
          await ok.click({ force: true }); await wait(90);
        }
        if (q === 0 && id !== 'sudoku') { await wait(300); await p.screenshot({ path: `g3-${tag}-${id}-right.png` }); }
        q++;
      }
      await p.waitForTimeout(900);
      if (!(await p.$('#again'))) { fails.push(`${tag} ${id}: never reached the end`); await p.screenshot({ path: `g3-${tag}-${id}-stuck.png` }); }
      const r = await p.evaluate(id => ({ stars: __owl.st.stars, rec: __owl.st.games[id] }), id), got = r.stars - stars0;
      if (got < 1 || got > 3) fails.push(`${tag} ${id}: stars ${got}`);
      if (!r.rec || r.rec.plays !== 1 || !(r.rec.best > 0)) fails.push(`${tag} ${id}: best score not saved`);
      console.log(tag, id, 'questions', q, 'stars +' + got, JSON.stringify(r.rec));
      if (id === 'snake') await p.screenshot({ path: `g3-${tag}-snake-done.png` });
      await noScroll(id + ' done');
      await p.click('#more'); await p.waitForTimeout(200);
    }
    if ((await p.$$('.gbest i.on')).length < 7) fails.push(`${tag}: best stars missing on tiles`);
    await p.close();
  };
  await Promise.all([[{ width: 390, height: 844 }, 5], [{ width: 390, height: 844 }, 9], [{ width: 1024, height: 768 }, 5], [{ width: 1024, height: 768 }, 9]].map(([vp, a]) => run(vp, a)));

  // Every level of every new game makes sensible questions.
  const p = await b.newPage({ viewport: { width: 390, height: 844 } }); p.on('pageerror', e => errs.push('fuzz: ' + e.message));
  await p.goto(`http://localhost:${PORT}/index.html?fz3#selftest`);
  const bad = await p.evaluate(() => {
    const G = __games3, out = [], no = (c, m) => { if (!c && out.length < 40) out.push(m); };
    const chk = (cs, ans, tag) => { const v = cs.map(c => String(c.val ?? c)); no(new Set(v).size === v.length, tag + ' duplicate choices ' + v); no(v.filter(x => x === String(ans)).length === 1, tag + ' answer not in choices ' + ans + ' ' + v); };
    let snTurns = 0, snGames = 0, snLong = 0;
    for (let d = 0; d <= 6; d++) for (let k = 0; k < 300; k++) {
      const t = `L${d}`;
      // Snakes & Ladders: ladders go up, snakes go down, nothing shares a square, and a race finishes.
      const S = G.snakeMake(d), N = S.N, ends = [...Object.entries(S.lad), ...Object.entries(S.sn)].flat().map(Number);
      no(N % 6 === 0 && Object.keys(S.lad).length === (d === 0 ? 1 : 2) && Object.keys(S.sn).length === (d <= 2 ? 1 : 2), t + ' snake counts');
      no(Object.entries(S.lad).every(([a, b]) => +b > +a && Math.floor(b / 6) > Math.floor(a / 6)) && Object.entries(S.sn).every(([a, b]) => +b < +a && Math.floor(b / 6) < Math.floor(a / 6)), t + ' snake directions');
      no(new Set(ends).size === ends.length && ends.every(v => v > 0 && v < N - 1), t + ' snake endpoints ' + ends);
      let me = 0, turns = 0;
      while (me < N - 1 && turns < 40) { const r = G.snakeRoll(S); no(r.length === S.dice && r.every(v => v >= 1 && v <= S.faces), t + ' snake roll'); me = Math.min(N - 1, me + r.reduce((a, c) => a + c, 0)); me = S.lad[me] ?? S.sn[me] ?? me; turns++; }
      snTurns += turns; snGames++; if (turns > 16) snLong++;
      // Bakery Orders.
      const B = G.bakeMake(d);
      if (B.mode === 'fill') { const T = B.rows * B.cols; no(B.need >= 1 && B.need <= T, t + ' bake need ' + JSON.stringify(B)); if (B.den) no(B.n >= 1 && B.n < B.den && B.need === B.n * T / B.den, t + ' bake frac'); if (B.a != null) no(B.need === B.a + B.b && B.need <= T, t + ' bake sum'); if (B.dbl != null) no(B.need === 2 * B.dbl, t + ' bake dbl'); }
      else if (B.mode === 'pick') { no(B.opts.filter(([a, c]) => a === B.rows && c === B.cols).length === 1 && new Set(B.opts.map(String)).size === 3 && !B.opts.some(([a, c]) => a === B.cols && c === B.rows && a !== c), t + ' bake pick ' + JSON.stringify(B)); }
      else { if (B.mode === 'count') no(B.ans === B.rows * B.cols, t + ' bake count'); if (B.mode === 'boxes') no(B.ans === Math.ceil(B.T / B.k) && (B.L > 0 || B.T % B.k === 0), t + ' bake boxes'); if (B.mode === 'of') no(Number.isInteger(B.ans) && B.ans === B.n * B.T / B.den && B.n < B.den, t + ' bake of'); chk(B.choices, B.ans, t + ' bake ' + B.mode); }
      // Parking Garage.
      const P = G.parkMake(d), vs = P.spots.map(x => x.v);
      no(new Set(vs).size === vs.length && vs.filter(v => v === P.ans).length === 1, t + ' park spots ' + vs + ' ans ' + P.ans);
      if (P.mode === 'round') { no(P.n % P.u !== 0 && Math.abs(P.n - P.ans) <= P.u / 2 && P.ans % P.u === 0 && (Math.abs(P.n - P.ans) < P.u / 2 || P.ans > P.n), t + ' park round ' + P.n + ' -> ' + P.ans); no(vs.length >= 3 && vs.every(v => v >= 0), t + ' park round spots'); }
      if (P.mode === 'blocks') no(P.n === 10 * P.t + P.o, t + ' park blocks');
      if (P.mode === 'floor') no(P.ans === Math.floor(P.n / 10) * 10, t + ' park floor');
      if (P.mode === 'match' || P.mode === 'line') no(P.ans === P.n, t + ' park match');
      // Hungry Monster: exactly one food is right, and it really is right.
      const M = G.monMake(d), oks = M.items.filter(x => x.ok);
      no(oks.length === 1 && M.items.length >= 2 && M.items.length <= 4, t + ' monster ok count ' + M.mode + ' ' + M.items.map(x => x.h || x.v));
      no(new Set(M.items.map(x => +x.v.toFixed(6))).size === M.items.length, t + ' monster equal items ' + M.items.map(x => x.h || x.v));
      if (M.mode === 'group') no(oks[0].v === (M.less ? Math.min : Math.max)(...M.items.map(x => x.v)), t + ' monster group');
      if (M.mode === 'num') no(M.check && M.items.filter(x => M.check(x.v)).length === 1 && M.check(oks[0].v) && M.items.every(x => Number.isInteger(x.v) && x.v >= 0), t + ' monster sentence ' + M.q + ' ' + M.items.map(x => x.v));
      if (M.mode === 'eq') no(M.items.filter(x => Math.abs(x.v - M.target.v) < 1e-9).length === 1 && Math.abs(oks[0].v - M.target.v) < 1e-9, t + ' monster eq ' + M.target.h + ' ' + M.items.map(x => x.h));
      // Bubble Count.
      const U = G.bubMake(d);
      no(U.total === U.groups.reduce((a, c) => a + c, 0) && U.groups.every(n => n >= 1), t + ' bubble total');
      if (U.kind === 'die') no(U.groups.every(n => n <= 9), t + ' bubble die too big'); if (U.kind === 'frame') no(U.groups.every(n => n <= 10), t + ' bubble frame too big');
      if (U.est) { const near = U.choices.map(c => c.val).sort((x, y) => Math.abs(x - U.total) - Math.abs(y - U.total)); no(near[0] === U.ans && Math.abs(near[1] - U.total) > Math.abs(near[0] - U.total), t + ' bubble estimate ' + U.total + ' ' + U.ans); no((G.scatterDots(U.total).match(/<i /g) || []).length === U.total, t + ' bubble scatter count ' + U.total); }
      else no(U.ans === U.total, t + ' bubble answer');
      chk(U.choices, U.ans, t + ' bubble');
      // Sticker Sort.
      const K = G.stkMake(d), c = K.counts;
      no(new Set(c).size === c.length && c.every(v => v > 0 && v % (d >= 5 ? 5 : d === 4 ? 2 : 1) === 0), t + ' sticker counts ' + c);
      chk(K.choices, K.ans, t + ' sticker ' + K.kind);
      const iOf = w => K.kinds.findIndex(x => x[1] === w);
      if (K.kind === 'most') no(c[iOf(K.ans)] === Math.max(...c), t + ' sticker most'); if (K.kind === 'fewest') no(c[iOf(K.ans)] === Math.min(...c), t + ' sticker fewest');
      if (K.kind === 'howmany') no(c.includes(K.ans), t + ' sticker howmany'); if (K.kind === 'total') no(K.ans === c.reduce((a, v) => a + v, 0), t + ' sticker total');
      if (K.kind === 'total2') no(c.some((x, i) => c.some((y, j) => i !== j && x + y === K.ans)), t + ' sticker total2');
      if (K.kind === 'more') no(K.ans > 0 && c.some(x => c.includes(x - K.ans)), t + ' sticker more');
      // Number Detective.
      const D = G.sdkMake(d);
      if (D.mode === 'riddle') { const fit = D.choices.filter(ch => D.clues.every(cl => cl.f(ch.val))); no(fit.length === 1 && fit[0].val === D.ans && D.choices.length === 4, t + ' riddle ' + D.clues.map(x => x.s).join(' ') + ' ' + D.choices.map(x => x.val)); chk(D.choices, D.ans, t + ' riddle'); }
      else {
        const n = D.n, sol = D.sol, bw = n / 2, okSet = a => new Set(a).size === n;
        no(D.n === (d <= 4 ? 4 : 6) && D.fruit === d <= 2, t + ' sudoku size');
        no(sol.every(okSet) && sol[0].every((_, x) => okSet(sol.map(r => r[x]))), t + ' sudoku rows/cols');
        for (let by = 0; by < n; by += 2) for (let bx = 0; bx < n; bx += bw) { const box = []; for (let y = by; y < by + 2; y++) for (let x = bx; x < bx + bw; x++) box.push(sol[y][x]); no(okSet(box), t + ' sudoku box'); }
        no(D.blanks.length === [2, 3, 4, 6, 8, 10, 14][d] && new Set(D.blanks).size === D.blanks.length && G.sdkSolvable(n, sol, D.blanks), t + ' sudoku blanks ' + D.blanks.length);
        if (d <= 2) no(new Set(D.blanks.map(i => Math.floor(i / n))).size === D.blanks.length, t + ' sudoku young: one blank per row');
      }
    }
    no(snLong / snGames < .05, `snake races too long: ${snLong} of ${snGames} over 16 turns`);
    out.push('info: snake races average ' + (snTurns / snGames).toFixed(1) + ' turns');
    return out;
  });
  const info = bad.filter(x => x.startsWith('info')), real = bad.filter(x => !x.startsWith('info'));
  console.log(info.join('\n'));
  if (real.length) fails.push('bad questions: ' + real.slice(0, 8).join(' | '));
  console.log('fails', fails.length ? fails : 'none');
  console.log('errors', errs.length || fails.length ? errs : 'none'); await b.close();
})();
