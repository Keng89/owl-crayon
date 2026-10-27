// Crafts corner round 4 (src/crafts7.js): 52 more crafts weighted to the harder levels (sewing, weaving, knitting, clay,
// papier-mache, origami, cardboard engineering, a paper circuit, printmaking, recycled crafts and celebrations from
// around the world). Checks: the total and the level spread (the two top levels have 35+ each); every new craft has
// materials, a time, 3-8 short steps that end on the finished craft, a known kind, and every step's movie draws without
// errors at several points and changes as it plays; the 3 new movie kinds (knit, light, roll) are used; safety notes
// for the battery, needles, ovens and blenders; the builder is lazy (its code waits as text at startup and is not in
// the app script); live on a phone (390x844: every step of every new craft) and a tablet (1024x1366: one craft per kind
// and the new journeys), each step dot animates; search finds new crafts (accents ignored: "pinata", "mache"); the
// "I have" chips find crafts with the new materials; the new category and the 3 new journeys open; no sideways scroll.
// Prints "errors none" and "fails none" when clean. Takes PORT (default 8766). Screenshots go to SHOTS.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errs = [], fails = [];
const NEW = ['sewplate', 'rangoli', 'redenvelope', 'rollstamp',
  'buttonsnake', 'plateweave', 'doughstar', 'diya', 'eidcard', 'foamprint', 'penguin', 'eggflowers', 'papelpicado', 'koinobori',
  'fingerknit', 'godseye', 'feltornament', 'crossstitch', 'macheplanet', 'stickcatapult', 'kabuto', 'coilpot', 'stringprint', 'fanous', 'mkeka', 'rakhi', 'windchime', 'chainreaction', 'cupphone', 'twigweave',
  'bandcar', 'papercircuit', 'tiltmaze', 'grabber', 'spoolknit', 'feltpouch', 'feltfish', 'pinata', 'foilclay', 'dragonpuppet', 'parol', 'heartbasket', 'waterbomb', 'flapbird', 'masubox', 'stencil', 'machemask',
  'windmill', 'wallhanging', 'papermaking', 'periscope', 'notebook'];
const KINDS = ['knit', 'light', 'roll'];

(async () => {
  const b = await chromium.launch();
  for (const [w, h, tag, full] of [[390, 844, 'phone', true], [1024, 1366, 'tablet', false]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 500 });
    await ctx.addInitScript(() => { window.__said = []; try { speechSynthesis.speak = u => window.__said.push(u.text); } catch (e) {} });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(`${tag}: ${e.message}`));
    p.on('console', m => { if ((m.type() === 'error' || m.type() === 'warning') && !/favicon|manifest|sw\.js|service|fonts|Failed to load resource/i.test(m.text())) errs.push(`${tag} console: ${m.text()}`); });
    const fail = m => fails.push(`${tag}: ${m}`);
    const shot = async (name, fullPage = true) => { await sleep(250); await p.screenshot({ path: `${SHOTS}/crafts4-${tag}-${name}.png`, fullPage }); };
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (o > 1) fail(`sideways scroll ${o}px at ${where}`); };

    await p.goto(`http://localhost:${PORT}/index.html#selftest`);
    await p.waitForFunction(() => window.__owl && window.__crafts);

    // 0. The builder is lazy: still waiting at startup, kept as text, not in the app's own script.
    const lz = await p.evaluate(() => {
      const plain = [...document.querySelectorAll('script[type="text/plain"]')].filter(s => s.textContent.includes("id: 'papercircuit'")).length;
      const app = [...document.querySelectorAll('script:not([type])')].some(s => s.textContent.includes("id: 'papercircuit'"));
      return { pending: window.__crafts.pending(), plain, app };
    });
    if (lz.pending < 5 || lz.plain !== 1 || lz.app) fail(`crafts7 is not lazy ${JSON.stringify(lz)}`);
    await p.evaluate(() => { window.__owl.st.age = 5; window.__owl.st.speak = true; });

    // 1. The data.
    const D = await p.evaluate(([NEW, KINDS]) => {
      const X = window.__crafts, out = { n: X.CRAFTS.length, levels: X.info().levels, probs: [], kinds: {}, missing: NEW.filter(id => !X.BY[id]), dup: X.CRAFTS.length - new Set(X.CRAFTS.map(c => c.id)).size };
      const nw = NEW.map(id => X.BY[id]).filter(Boolean);
      out.newLv = [1, 2, 3, 4].map(l => nw.filter(c => c.lv === l).length);
      out.cats = [...new Set(nw.map(c => c.cat))].length;
      for (const c of nw) {
        if (c.steps.length < 3 || c.steps.length > 8) out.probs.push(`${c.id}: ${c.steps.length} steps`);
        if (!X.CATS.some(k => k.id === c.cat)) out.probs.push(`${c.id}: unknown kind ${c.cat}`);
        if (!c.mat.length || c.mat.some(m => !m[0] || !m[1]) || !(c.min > 0) || !c.name || !c.ico) out.probs.push(`${c.id}: materials, time, name or icon`);
        if (c.lv >= 3 && c.steps.length < 6) out.probs.push(`${c.id}: a hard craft with only ${c.steps.length} steps`);
        c.steps.forEach((s, i) => {
          out.kinds[s.a] = (out.kinds[s.a] || 0) + 1;
          const fr = [[0, 0], [0.2, 250], [0.45, 700], [0.7, 1300], [0.9, 1900], [1, 2500]].map(([e, t]) => { try { return X.raw(s, e, t); } catch (er) { return 'ERR ' + er.message; } });
          const bad = fr.find(x => /ERR|NaN|undefined|Infinity|\[object/.test(x));
          if (bad) out.probs.push(`${c.id} step ${i + 1}: bad frame ${bad.slice(0, 80)}`);
          if (new Set(fr).size < 3) out.probs.push(`${c.id} step ${i + 1} (${s.a}): only ${new Set(fr).size} different frames`);
          if (X.frame(s, 0, 0).length < 200) out.probs.push(`${c.id} step ${i + 1}: empty first frame`);
          const words = (s.t || '').split(/\s+/);
          if (!s.t || words.length > 18 || words.some(w => w.length > 14)) out.probs.push(`${c.id} step ${i + 1}: text too long "${s.t}"`);
        });
        if (c.steps[c.steps.length - 1].a !== 'show') out.probs.push(`${c.id}: does not end with a finished-craft movie`);
      }
      // the new tool glows
      out.glow = /class="cr-glow"/.test(X.raw({ a: 'roll', box: [40, 40, 100, 60], area: '<rect/>' }, 0.4, 0));
      out.safe = Object.fromEntries(['papercircuit', 'feltornament', 'doughstar', 'papermaking', 'diya', 'bandcar', 'rangoli'].map(id => [id, X.safety(X.BY[id]).map(x => x[0] + ' ' + x[1]).join(' | ')]));
      out.world = X.CRAFTS.filter(c => c.cat === 'world').length;
      return out;
    }, [NEW, KINDS]);
    if (D.n !== 210) fail(`${D.n} crafts, want 210`);
    if (D.dup) fail(`${D.dup} duplicate craft ids`);
    if (D.missing.length) fail(`missing crafts ${D.missing}`);
    if (NEW.length !== 52) fail(`${NEW.length} new crafts listed`);
    if (D.levels[2] < 35 || D.levels[3] < 35) fail(`levels ${D.levels}: the top two need 35+ each`);
    if (D.newLv[2] + D.newLv[3] < 30 || D.newLv[0] < 2) fail(`new crafts by level ${D.newLv}`);
    if (D.cats < 12) fail(`new crafts span only ${D.cats} kinds`);
    if (D.world < 12) fail(`only ${D.world} celebration crafts`);
    for (const k of KINDS) if (!D.kinds[k]) fail(`new movie kind ${k} unused`);
    if (!D.glow) fail('the roller does not glow');
    if (D.probs.length) fail(`data: ${D.probs.slice(0, 8).join(' | ')} (${D.probs.length})`);
    if (!/batter/i.test(D.safe.papercircuit) || !/swallow/.test(D.safe.papercircuit)) fail(`circuit safety: ${D.safe.papercircuit}`);
    if (!/needle/i.test(D.safe.feltornament)) fail(`sewing safety: ${D.safe.feltornament}`);
    if (!/🔥/.test(D.safe.doughstar)) fail(`oven safety: ${D.safe.doughstar}`);
    if (!/blender/.test(D.safe.papermaking)) fail(`blender safety: ${D.safe.papermaking}`);
    if (!/candle|flame/i.test(D.safe.diya)) fail(`diya safety: ${D.safe.diya}`);
    if (!/skewer|holes/i.test(D.safe.bandcar)) fail(`car safety: ${D.safe.bandcar}`);
    if (!/Glue/.test(D.safe.rangoli)) fail(`rangoli safety: ${D.safe.rangoli}`);

    // 2. Live: every step of every new craft (phone), one craft per new kind and a few others (tablet).
    const ids = full ? NEW : [...new Set([...KINDS.map(k => p.evaluate(([k, NEW]) => NEW.find(id => window.__crafts.BY[id].steps.some(s => s.a === k)), [k, NEW]))])];
    const list = full ? NEW : [...new Set([...(await Promise.all(ids)), 'pinata', 'kabuto', 'windmill', 'stencil', 'rangoli'])];
    let checked = 0;
    for (const id of list) {
      await p.evaluate(id => window.__crafts.open(id), id); await p.waitForSelector('#crSvg');
      await p.click('#crPvGo');
      const n = await p.$$eval('.cr-dot', d => d.length);
      for (let i = 0; i < n; i++) {
        await p.evaluate(i => document.querySelector(`.cr-dot[data-s="${i}"]`).click(), i);
        await p.evaluate(() => { const m = window.__crafts.movie; m.start = performance.now() - 0.3 * window.__crafts.stepDur(m.c.steps[m.i]) / (m.rate || 1); });
        await sleep(50);
        const a = await p.evaluate(() => [document.getElementById('crSvg').innerHTML, window.__crafts.movie.frames]);
        await sleep(320);
        const z = await p.evaluate(() => [document.getElementById('crSvg').innerHTML, window.__crafts.movie.frames, window.__crafts.movie.i]);
        if (z[2] !== i) fail(`${id}: step dot ${i + 1} went to ${z[2] + 1}`);
        if (a[0] === z[0]) { await sleep(700); if ((await p.$eval('#crSvg', s => s.innerHTML)) === a[0]) fail(`${id} step ${i + 1}: the movie does not change`); }
        if (z[1] - a[1] < 4) fail(`${id} step ${i + 1}: only ${z[1] - a[1]} frames`);
        if (a[0].length < 200 || /NaN|undefined/.test(a[0])) fail(`${id} step ${i + 1}: empty or broken movie`);
        checked++;
      }
      if (['papercircuit', 'fingerknit', 'pinata', 'kabuto', 'windmill'].includes(id)) { await p.click('.cr-dot[data-s="' + (n - 2) + '"]'); await sleep(1700); await shot(`movie-${id}`, false); }
    }
    await noScroll('craft pages');
    // the step text a child hears is the step text shown
    await p.evaluate(() => window.__crafts.open('fingerknit')); await p.waitForSelector('#crPvGo'); await p.click('#crPvGo'); await sleep(100);
    if (!/Step 1\./.test(await p.textContent('#crText'))) fail('step text missing on a new craft');
    await p.click('#crDid'); await sleep(100);
    if ((await p.evaluate(() => window.__crafts.movie.i)) !== 1) fail('"I did this step" does not move on in a new craft');

    // 3. Search (accents ignored) and the level filter.
    await p.evaluate(() => window.__crafts.home()); await p.waitForSelector('#crQ');
    for (const [q, want] of [['diya', 'diya'], ['pinata', 'pinata'], ['mache', 'macheplanet'], ['circuit', 'papercircuit'], ['knitting', 'spoolknit'], ['lunar new year', 'redenvelope']]) {
      await p.fill('#crQ', q); await sleep(120);
      const got = await p.$$eval('#crList [data-c]', bs => bs.map(b => b.dataset.c));
      if (!got.includes(want)) fail(`search "${q}" does not find ${want} (${got.slice(0, 6)})`);
    }
    await p.fill('#crQ', ''); await sleep(80);
    await p.click('.cr-lvb[data-lv="4"]'); await p.waitForSelector('#crList [data-c]');
    const l4 = await p.$$eval('#crList [data-c]', bs => bs.map(b => b.dataset.c));
    if (l4.length < 35 || !l4.includes('bandcar') || !l4.includes('masubox')) fail(`expert list has ${l4.length}`);
    await noScroll('expert list'); await shot('expert');

    // 4. "I have..." chips with the new materials.
    await p.evaluate(() => window.__crafts.home()); await p.waitForSelector('[data-have]');
    for (const [chip, want] of [['clay', ['diya', 'coilpot', 'foilclay']], ['string', ['fingerknit', 'godseye', 'wallhanging']], ['boxes', ['bandcar', 'tiltmaze', 'windmill']], ['paper', ['redenvelope', 'heartbasket']], ['paint', ['foamprint', 'stencil']]]) {
      await p.click(`[data-have="${chip}"]`); await sleep(120);
      const got = await p.$$eval('#crList [data-c]', bs => bs.map(b => b.dataset.c));
      const miss = want.filter(id => !got.includes(id));
      if (miss.length) fail(`chip ${chip} misses ${miss}`);
      await p.click(`[data-have="${chip}"]`); await sleep(60);
    }
    await noScroll('crafts home');

    // 5. The new category and the new journeys.
    await p.evaluate(() => window.__crafts.cat('world')); await p.waitForSelector('.cr-cards');
    const wc = await p.$$eval('.cr-cards [data-c]', bs => bs.length);
    if (wc < 12) fail(`world category shows ${wc}`);
    await noScroll('world category'); await shot('world');
    const J = await p.evaluate(() => window.__crafts.JOURNEYS.filter(j => ['world', 'engineer', 'stitch'].includes(j.id)).map(j => ({ id: j.id, lv: j.crafts.map(id => window.__crafts.BY[id] && window.__crafts.BY[id].lv) })));
    if (J.length !== 3) fail(`new journeys ${JSON.stringify(J)}`);
    J.forEach(j => { if (j.lv.length !== 6 || j.lv.some(l => !l) || j.lv[0] !== 1 || j.lv.some((l, k) => k && l < j.lv[k - 1]) || j.lv[5] !== 4) fail(`journey ${j.id} levels ${j.lv}`); });
    await p.evaluate(() => window.__crafts.home()); await p.waitForSelector('.cr-jb[data-j="engineer"]');
    await p.click('.cr-jb[data-j="world"]'); await p.waitForSelector('.cr-trail');
    const tr = await p.$$eval('.cr-trail [data-c]', bs => bs.map(b => b.dataset.c));
    if (tr.length !== 6 || tr[0] !== 'rangoli') fail(`world trail ${tr}`);
    await noScroll('journey'); await shot('journey-world');
    await p.click('.cr-trail [data-c="rangoli"]'); await p.waitForSelector('#crSvg');
    if ((await p.evaluate(() => window.__crafts.movie.c.id)) !== 'rangoli') fail('journey stop opened the wrong craft');

    // 6. The craft of the day can now pick hard new crafts for older children.
    const cd = await p.evaluate(NEW => { window.__owl.st.age = 11; const ds = Array.from({ length: 120 }, (_, i) => `2027-01-${String(i % 28 + 1).padStart(2, '0')}-${i}`); return ds.map(d => window.__crafts.cotd(d).id).filter(id => NEW.includes(id)).length; }, NEW);
    if (!cd) fail('craft of the day never picks a new craft');

    console.log(`${tag}: ${D.n} crafts, levels ${JSON.stringify(D.levels)}, new ${NEW.length} (levels ${D.newLv}) in ${D.cats} kinds; ${checked} steps animated live`);
    await ctx.close();
  }
  await b.close();
  console.log('errors', errs.length ? errs.join('\n') : 'none');
  console.log('fails', fails.length ? fails.join('\n') : 'none');
})();
