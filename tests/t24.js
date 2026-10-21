// Coloring book: every page opens and every shape can be tapped and filled (real taps), undo, colour-by-number
// (once with a wrong colour, then right), save to My pictures, colours kept after reload, no sideways scroll.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766;
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h] of [[390, 844], [1024, 768]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } }); const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(w + ' ' + e.message));
    const url = `http://localhost:${PORT}/index.html?r=${Date.now()}#selftest`;
    await p.goto(url); await p.waitForTimeout(300);
    const noScroll = async what => { const sw = await p.evaluate(() => document.documentElement.scrollWidth); if (sw > w) errs.push(`${w} ${what}: horizontal scroll ${sw}`); };
    const stars = () => p.evaluate(() => window.__owl.st.stars);
    const rec = id => p.evaluate(id => (window.__color.state || {})[id] || {}, id);
    const galLen = () => p.evaluate(() => (JSON.parse(localStorage.getItem('owlcrayon:gallery:' + JSON.parse(localStorage.getItem('owlcrayon:current') || '"p1"'))) || []).length);

    // Studio tile opens the coloring book.
    await p.evaluate(() => window.__owl.go(window.__owl.artHome));
    await p.click('[data-tool="color"]'); await p.waitForTimeout(100);
    const cards = await p.evaluate(() => document.querySelectorAll('.cb-card').length);
    if (cards < 10) errs.push(`${w} only ${cards} cards on the easy tab`);
    await noScroll('home');
    for (const t of ['detail', 'num']) { await p.click(`[data-tab="${t}"]`); await p.waitForTimeout(80); await noScroll('tab ' + t); }
    if (w === 390) await p.screenshot({ path: 't24-home.png', fullPage: true });

    // Tap every visible shape for real, picking a colour first.
    async function tapAll(id, colorFor) {
      const pts = await p.evaluate(id => {
        const C = window.__color, pg = C.PAGES.find(x => x.id === id), svg = document.querySelector('.cb-svg');
        svg.scrollIntoView({ block: 'center' }); const sp = C.spots(id);
        return pg.R.map((r, i) => ({ id: r.id, hint: r.hint, cells: sp[i].cells, at: sp[i].at[0] }));
      }, id);
      const m = await p.evaluate(() => { const s = document.querySelector('.cb-svg').getScreenCTM(); return [s.a, s.b, s.c, s.d, s.e, s.f]; });
      for (const r of pts) {
        if (!r.cells) { errs.push(`${w} ${id} ${r.id} has no visible area to tap`); continue; }
        const c = colorFor(r); await p.click(`.cb-sw[data-c="${c}"]`);
        await p.evaluate(() => document.querySelector('.cb-svg').scrollIntoView({ block: 'center' }));
        const mm = await p.evaluate(() => { const s = document.querySelector('.cb-svg').getScreenCTM(); return [s.a, s.b, s.c, s.d, s.e, s.f]; });
        const x = mm[0] * r.at.x + mm[2] * r.at.y + mm[4], y = mm[1] * r.at.x + mm[3] * r.at.y + mm[5];
        await p.mouse.click(x, y);
        const got = await p.evaluate(rid => document.querySelector(`.cb-svg [data-r="${rid}"]`).getAttribute('fill'), r.id);
        if (got !== c) errs.push(`${w} ${id} ${r.id}: tap filled ${got} not ${c}`);
      }
      void m; return pts;
    }

    // Colour-by-number: one wrong colour first, then fix it.
    const nid = 'whale';
    await p.evaluate(id => window.__owl.go(window.__color.colorPage, id, true), nid); await p.waitForTimeout(150);
    const labs = await p.evaluate(() => document.querySelectorAll('.cb-lab text').length);
    if (labs < 8) errs.push(`${w} number labels: ${labs}`);
    let s0 = await stars();
    const pts = await tapAll(nid, r => r.id === 'r4' ? '#F2604F' : r.hint);
    let msg = await p.textContent('#cbMsg');
    if (!/Almost/.test(msg)) errs.push(`${w} wrong colour not flagged: ${msg}`);
    if ((await rec(nid)).done) errs.push(`${w} page counted done with a wrong colour`);
    if (await stars() !== s0) errs.push(`${w} stars given for a wrong page`);
    await p.click(`.cb-sw[data-c="${pts[4].hint}"]`);
    await p.evaluate(() => document.querySelector('.cb-svg [data-r="r4"]').dispatchEvent(new MouseEvent('click', { bubbles: true })));
    msg = await p.textContent('#cbMsg');
    const rn = await rec(nid);
    if (!rn.done || !rn.nd) errs.push(`${w} number page not completed: ${msg}`);
    if (await stars() !== s0 + 3) errs.push(`${w} number page stars ${s0} -> ${await stars()}`);
    const shown = await p.evaluate(() => [...document.querySelectorAll('.cb-lab text')].filter(t => t.style.display !== 'none').length);
    if (shown) errs.push(`${w} ${shown} number labels still showing after correct fill`);
    // Sum mode labels.
    await p.click('#cbMode'); await p.waitForTimeout(50);
    const sum = await p.evaluate(() => [...document.querySelectorAll('.cb-lab text')].map(t => t.textContent));
    if (!sum.every(t => /^\d+[+−]\d+$/.test(t))) errs.push(`${w} sum labels ${sum.slice(0, 4)}`);
    if (w === 390) { await p.click('#cbMode'); await p.click('#cbClr'); await p.waitForTimeout(50); await p.screenshot({ path: 't24-number.png', fullPage: true }); await p.click('#cbUn'); }
    await noScroll('number page');

    // Every page: open, fill every shape, undo, save one.
    const ids = await p.evaluate(() => window.__color.PAGES.map(x => x.id));
    if (ids.length < 24) errs.push(`only ${ids.length} pages`);
    const PAL = await p.evaluate(() => Object.values(window.__color.HEX));
    for (const id of (w === 390 ? ids : ids.slice(0, 6))) {
      if (id === nid) continue;
      await p.evaluate(id => window.__owl.go(window.__color.colorPage, id), id); await p.waitForTimeout(60);
      s0 = await stars();
      let k = 0; await tapAll(id, () => PAL[(k++ * 5) % PAL.length]);
      const r = await rec(id), n = await p.evaluate(id => window.__color.PAGES.find(x => x.id === id).R.length, id);
      if (Object.keys(r.f || {}).length !== n) errs.push(`${w} ${id} filled ${Object.keys(r.f || {}).length} of ${n}`);
      if (!r.done) errs.push(`${w} ${id} not done`);
      if (await stars() !== s0 + 2) errs.push(`${w} ${id} stars ${s0} -> ${await stars()}`);
      // Undo the last fill, then put it back.
      const before = await p.evaluate(() => document.querySelector('.cb-svg [data-r="r0"]').getAttribute('fill'));
      await p.click('.cb-sw[data-c="#6D55D1"]');
      await p.evaluate(() => document.querySelector('.cb-svg [data-r="r0"]').dispatchEvent(new MouseEvent('click', { bubbles: true })));
      await p.click('#cbUn');
      const after = await p.evaluate(() => document.querySelector('.cb-svg [data-r="r0"]').getAttribute('fill'));
      if (before !== after) errs.push(`${w} ${id} undo gave ${after} not ${before}`);
      if (id === 'owl' || id === 'mandala') {
        if (w === 390) await p.screenshot({ path: `t24-${id}.png`, fullPage: true });
        const g0 = await galLen(); await p.click('#cbSave'); await p.waitForTimeout(700);
        const g1 = await galLen(); if (g1 !== g0 + 1) errs.push(`${w} ${id} gallery ${g0} -> ${g1}`);
        await noScroll(id);
      }
    }
    // Magic: Owl's idea shows, and tapping it picks that colour.
    await p.evaluate(() => window.__owl.go(window.__color.colorPage, 'cat')); await p.click('#cbMagic');
    if (await p.isHidden('#cbIdea')) errs.push(`${w} magic idea hidden`);
    await p.evaluate(() => document.querySelector('#cbIdeaPic [data-r="r6"]').dispatchEvent(new MouseEvent('click', { bubbles: true })));
    const pressed = await p.evaluate(() => (document.querySelector('.cb-sw[aria-pressed="true"]') || {}).dataset.c);
    if (pressed !== '#F49AC1') errs.push(`${w} magic pick gave ${pressed}`);
    await p.click('#cbOne'); await noScroll('magic');

    // Colours stay after reload.
    const saved = await p.evaluate(() => JSON.stringify(window.__color.state));
    await p.goto(url + ''); await p.reload(); await p.waitForTimeout(300);
    const again = await p.evaluate(() => JSON.stringify(window.__color.state));
    if (saved !== again) errs.push(`${w} colours not kept after reload`);
    await p.evaluate(() => window.__owl.go(window.__color.colorPage, 'owl'));
    const owlFill = await p.evaluate(() => document.querySelector('.cb-svg [data-r="r2"]').getAttribute('fill'));
    if (owlFill === '#FFFFFF' && w === 390) errs.push(`${w} owl page lost its colours`);
    await ctx.close();
  }
  console.log('errors', errs.length ? errs : 'none'); await b.close();
})();
