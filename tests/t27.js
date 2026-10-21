// Shape puzzles: opens from the Art School tile and the Number Garden button, checks every puzzle's pieces are real
// shapes that tile the silhouette exactly (no overlaps, tangrams fill their outline), then on a phone and a tablet
// finishes every Easy puzzle with real pointer drags (mouse, and finger for some), 3 Medium and 3 Tricky puzzles
// with the Turn and Flip buttons, a wrong drop that goes back to the tray, tap-to-name, Hint, Name the shapes,
// stars only the first time, progress kept after a reload, no sideways scroll and big enough buttons.
// Screenshots go to SHOTS (default: current folder).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h, tag] of [[390, 844, 'phone'], [1024, 768, 'tablet']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 500, deviceScaleFactor: 1 });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(`${tag}: ${e.message}`));
    p.on('console', m => { if (m.type() === 'error' && !/favicon|manifest|sw\.js|service|fonts/i.test(m.text())) errs.push(`${tag} console: ${m.text()}`); });
    const fail = m => errs.push(`${tag}: ${m}`);
    const cdp = await ctx.newCDPSession(p);
    await p.goto(`http://localhost:${PORT}/index.html?r=${Date.now()}#selftest`);
    await p.waitForFunction(() => window.__owl && window.__owl.st);
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); if (o > 1) fail(`horizontal scroll ${o}px at ${where}`); };
    const stars = () => p.evaluate(() => window.__owl.st.stars);
    const bigEnough = async where => {
      const small = await p.evaluate(() => [...document.querySelectorAll('#view button')].filter(b => b.offsetParent).map(b => { const r = b.getBoundingClientRect(); return [b.id || b.className || b.textContent.trim().slice(0, 12), Math.round(r.width), Math.round(r.height), b.textContent.trim() || b.getAttribute('aria-label')]; }).filter(x => x[1] < 44 || x[2] < 44 || !x[3]));
      if (small.length) fail(`${where}: small or unlabeled buttons ${JSON.stringify(small)}`);
    };

    // The pieces really tile every silhouette.
    if (tag === 'phone') {
      const v = await p.evaluate(() => window.__shapes.verify());
      if (v.length) fail('geometry: ' + v.join(' | '));
      const n = await p.evaluate(() => { const P = window.__shapes.PUZZLES; return [P.length, ...['easy', 'medium', 'tricky'].map(l => P.filter(x => x.lvl === l).length)]; });
      if (n[0] < 24 || n.slice(1).some(k => k < 8)) fail(`puzzle counts ${n}`);
    }

    // Open from Art School, and back again.
    await p.evaluate(() => window.__owl.go(window.__owl.artHome));
    await p.click('[data-tool="shapes"]'); await p.waitForSelector('.sp-grid');
    if (await p.getAttribute('[data-lvl="easy"]', 'aria-pressed') !== 'true') fail('age 5 does not start on Easy');
    await noScroll('grid'); await bigEnough('grid');
    await p.screenshot({ path: `${SHOTS}/shapes-${tag}-grid.png`, fullPage: true });
    await p.click('#backBtn'); if (!(await p.$('[data-tool="shapes"]'))) fail('Back from the grid did not return to Art School');
    // Open from Number Garden, and back again.
    await p.evaluate(() => window.__owl.go(window.__owl.mathHome));
    await p.click('#sp'); await p.waitForSelector('.sp-grid');
    await p.click('#backBtn'); if (!(await p.$('#gm'))) fail('Back from the grid did not return to Number Garden');
    await p.click('#sp'); await p.waitForSelector('.sp-grid');

    const cur = () => p.evaluate(() => { const c = window.__shapes.cur; return { id: c.pz.id, fin: c.finished, pieces: c.pieces.map(q => ({ i: q.i, t: q.t, x: q.x, y: q.y, rot: q.rot, flip: q.flip, placed: q.placed, slot: q.slot })) }; });
    const scr = pt => p.evaluate(pt => window.__shapes.cur.toScreen(pt), pt);
    async function drag(from, to, touch) {
      if (touch) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x, y: from.y }] });
        for (let k = 1; k <= 8; k++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from.x + (to.x - from.x) * k / 8, y: from.y + (to.y - from.y) * k / 8 }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      } else { await p.mouse.move(from.x, from.y); await p.mouse.down(); await p.mouse.move(to.x, to.y, { steps: 8 }); await p.mouse.up(); }
      await sleep(380);
    }
    // Put every piece where it belongs, turning and flipping it with the buttons first.
    async function solve(touchEvery = 0) {
      let guard = 0;
      while (guard++ < 12) {
        const c = await cur(), q = c.pieces.find(x => !x.placed); if (!q) break;
        const g = await p.evaluate(i => { const c = window.__shapes.cur; return c.goal(c.pieces[i]); }, q.i);
        if (!g) { fail(`${c.id}: no place for piece ${q.i}`); return false; }
        const at = await scr([q.x, q.y]); await p.mouse.click(at.x, at.y); await sleep(60); // a tap picks it
        if (g.flip !== q.flip) await p.click('#spFlip');
        for (let k = 0; k < 8 && (await cur()).pieces[q.i].rot !== g.rot; k++) await p.click('#spRot');
        const now = (await cur()).pieces[q.i];
        if (now.rot !== g.rot || now.flip !== g.flip) { fail(`${c.id}: could not turn piece ${q.i} to ${g.rot}/${g.flip}`); return false; }
        await sleep(350);
        await drag(await scr([now.x, now.y]), await scr(g.c), touchEvery && guard % touchEvery === 0);
        if (!(await cur()).pieces[q.i].placed) { fail(`${c.id}: piece ${q.i} (${q.t}) did not snap`); return false; }
      }
      const fin = (await cur()).fin; if (!fin) fail(`${(await cur()).id} not finished`);
      return fin;
    }
    async function openCard(lvl, id) {
      await p.evaluate(l => window.__shapes.home(l), lvl); await p.click(`[data-pz="${id}"]`); await p.waitForSelector('#spSvg'); await sleep(150);
    }

    const ids = lvl => p.evaluate(l => window.__shapes.PUZZLES.filter(x => x.lvl === l).map(x => x.id), lvl);
    const easy = await ids('easy');
    // First Easy puzzle: tap to hear the name, a wrong drop, a hint, then finish it.
    await openCard('easy', easy[0]);
    await noScroll('puzzle'); await bigEnough('puzzle');
    let c = await cur(); const a = c.pieces[0], other = c.pieces.find(x => x.t !== a.t);
    const at0 = await scr([a.x, a.y]); await p.mouse.click(at0.x, at0.y); await sleep(80);
    const said = await p.textContent('#spMsg'); if (!/\d+ sides|corners|round/.test(said)) fail(`tap said: ${said}`);
    const wrongGoal = await p.evaluate(i => { const c = window.__shapes.cur; return c.goal(c.pieces[i]).c; }, other.i);
    await drag(at0, await scr(wrongGoal)); await sleep(900);
    c = await cur(); const back = c.pieces[0];
    if (back.placed || Math.hypot(back.x - back.slot[0], back.y - back.slot[1]) > 1e-6) fail('a wrong drop did not go back to the tray');
    if (!/somewhere else|turn/i.test(await p.textContent('#spMsg'))) fail('no message for a wrong drop');
    const domBack = await p.evaluate(() => { const g = document.querySelector('.sp-pc[data-i="0"]'), r = g.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    const slotScr = await scr(back.slot); if (Math.hypot(domBack.x - slotScr.x, domBack.y - slotScr.y) > 30) fail('the piece is not drawn back in the tray');
    await p.click('#spHint'); if (!(await p.$('#spHintL .sp-flash'))) fail('Hint did not flash a spot');
    let s0 = await stars();
    await solve(2);
    if (await stars() !== s0 + 2) fail(`first finish gave ${(await stars()) - s0} stars`);
    const sum = await p.textContent('.sp-owl'); if (!/You used \d+ \w+/.test(sum)) fail(`summary: ${sum}`);
    if (!(await p.$$('.sp-chip')).length) fail('no tally');
    const day = await p.evaluate(() => { const d = new Date(), k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); return (window.__owl.st.days[k] || {}).math; });
    if (day !== 1) fail(`dayLog math is ${day}`);
    // Name the shapes: one wrong tap, then the right one.
    await p.click('#spAsk'); const want = (await p.textContent('.sp-qt')).match(/the (\w+)\?/)[1];
    const opts = await p.$$eval('.sp-qb', bs => bs.map(b => b.dataset.t));
    if (opts.length !== 3 || opts.filter(t => t === want).length !== 1) fail(`name-the-shape choices ${opts} for ${want}`);
    await p.click(`.sp-qb:not([data-t="${want}"])`); if (!/Try again/.test(await p.textContent('#spQm'))) fail('wrong shape tap not explained');
    await p.click(`.sp-qb[data-t="${want}"]`); if (!(await p.$('.sp-qb.right'))) fail('right shape not marked');
    await noScroll('finished'); await bigEnough('finished');
    await p.screenshot({ path: `${SHOTS}/shapes-${tag}-${easy[0]}-done.png`, fullPage: true });
    // Again: no more stars.
    s0 = await stars(); await openCard('easy', easy[0]); await solve(); if (await stars() !== s0) fail('stars given twice for the same puzzle');

    // Every other Easy puzzle.
    for (const id of easy.slice(1)) {
      await openCard('easy', id); s0 = await stars();
      if (await solve(tag === 'phone' ? 3 : 0) && await stars() !== s0 + 2) fail(`${id} gave ${(await stars()) - s0} stars`);
      if (['e-car', 'e-snowman', 'e-owl'].includes(id)) await p.screenshot({ path: `${SHOTS}/shapes-${tag}-${id}-done.png` });
    }
    // Medium and Tricky: three each, with turning (and flipping for the tangram).
    const med = (await ids('medium')), tri = (await ids('tricky'));
    const pickM = tag === 'phone' ? [med[1], med[3], med[7]] : [med[0], med[2], med[5]];
    const pickT = tag === 'phone' ? [tri[0], tri[3], tri[5]] : [tri[1], tri[2], tri[7]];
    for (const id of pickM) {
      await openCard('medium', id);
      if (!(await cur()).pieces.some(x => x.rot)) fail(`${id}: no piece needs a turn`);
      if (id === pickM[0]) await p.screenshot({ path: `${SHOTS}/shapes-${tag}-${id}.png` });
      await solve(tag === 'tablet' ? 2 : 0);
    }
    let flipped = 0;
    for (const id of pickT) {
      await openCard('tricky', id);
      if (id === pickT[0]) { await p.screenshot({ path: `${SHOTS}/shapes-${tag}-${id}.png` }); await noScroll('tangram'); await bigEnough('tangram'); }
      // Make sure the flip button is used at least once: flip the parallelogram before solving.
      const par = (await cur()).pieces.find(x => x.t === 'parallelogram'); const pa = await scr([par.x, par.y]); await p.mouse.click(pa.x, pa.y); await p.click('#spFlip'); flipped++;
      // A piece turned 45° does not fit anywhere.
      const q = (await cur()).pieces.find(x => x.rot % 90 !== 0);
      if (q) { const g = await p.evaluate(i => { const c = window.__shapes.cur; return c.goal(c.pieces[i]); }, q.i); await drag(await scr([q.x, q.y]), await scr(g.c)); if ((await cur()).pieces[q.i].placed) fail(`${id}: a piece at 45° snapped`); await sleep(700); }
      await solve(tag === 'phone' ? 2 : 0);
      if (id === pickT[0]) await p.screenshot({ path: `${SHOTS}/shapes-${tag}-${id}-done.png` });
    }
    if (!flipped) fail('flip never used');

    // Progress is kept after a reload, and shown with ticks on the grid.
    const doneBefore = await p.evaluate(() => Object.keys(window.__shapes.state.done).sort().join());
    const want3 = easy.length + 6;
    if (doneBefore.split(',').length !== want3) fail(`${doneBefore.split(',').length} puzzles done, want ${want3}`);
    await p.reload(); await p.waitForFunction(() => window.__shapes);
    const doneAfter = await p.evaluate(() => Object.keys(window.__shapes.state.done).sort().join());
    if (doneAfter !== doneBefore) fail('progress lost after reload');
    await p.evaluate(() => window.__owl.go(window.__owl.artHome)); await p.click('[data-tool="shapes"]'); await p.click('[data-lvl="easy"]');
    const ticks = await p.$$eval('.sp-card.done .sp-tick', x => x.length); if (ticks !== easy.length) fail(`${ticks} ticks on Easy after reload`);
    await p.click('[data-lvl="tricky"]'); const tt = await p.$$eval('.sp-card.done', x => x.length); if (tt !== 3) fail(`${tt} Tricky done after reload`);
    await noScroll('grid after reload');
    await p.screenshot({ path: `${SHOTS}/shapes-${tag}-grid-tricky.png`, fullPage: true });
    await ctx.close();
  }
  console.log('errors', errs.length ? errs : 'none'); await b.close();
})();
