// Crafts corner round 2: 110+ crafts in 22 kinds (painting, beads, costumes, sensory play, building, gifts, seasons, more
// origami); every step of every craft draws without errors and really animates (its frames change over the loop, by
// progress or by time for the finale), live on the craft page too; the new movie kinds (dab, pour, stir, stack, knot,
// measure, launch, oven) are all used; safety notes for paint, hot water and ovens, glue guns and small pieces; the
// "I have..." material chips and the search box filter the crafts (and combine with the level); the craft of the day
// stays the same all day (and after a reload), suits the child's age, varies across days and opens its craft. Big tap
// targets, no sideways scroll. Prints "errors none" and "fails none" when clean. Screenshots go to SHOTS.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errs = [], fails = [];

(async () => {
  const b = await chromium.launch();
  for (const [w, h, tag, full] of [[390, 844, 'phone', true], [1024, 768, 'tablet', false]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 500 });
    await ctx.addInitScript(() => { try { speechSynthesis.speak = () => {}; } catch (e) {} });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(`${tag}: ${e.message}`));
    p.on('console', m => { if (m.type() === 'error' && !/favicon|manifest|sw\.js|service|fonts|Failed to load resource/i.test(m.text())) errs.push(`${tag} console: ${m.text()}`); });
    const fail = m => fails.push(`${tag}: ${m}`);
    const shot = async (name, fullPage = true) => { await sleep(250); await p.screenshot({ path: `${SHOTS}/crafts2-${tag}-${name}.png`, fullPage }); };
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (o > 1) fail(`sideways scroll ${o}px at ${where}`); };
    const bigEnough = async where => {
      const small = await p.evaluate(() => [...document.querySelectorAll('#view button, #view input')].filter(b => b.offsetParent && !b.disabled).map(b => { const r = b.getBoundingClientRect(); return [b.id || b.className, Math.round(r.width), Math.round(r.height), (b.textContent.trim() || b.getAttribute('aria-label') || '').slice(0, 14)]; }).filter(x => x[1] < 44 || x[2] < 44 || !x[3]));
      if (small.length) fail(`${where}: small or unlabeled controls ${JSON.stringify(small.slice(0, 4))}`);
    };

    await p.goto(`http://localhost:${PORT}/index.html#selftest`);
    await p.waitForFunction(() => window.__owl && window.__crafts);

    // 1. The data: 110+ crafts, the new kinds well filled, levels spread with more easy ones and enough hard ones.
    const D = await p.evaluate(() => {
      const X = window.__crafts, out = { n: X.CRAFTS.length, info: X.info(), probs: [], kinds: {} };
      out.perCat = Object.fromEntries(X.CATS.map(k => [k.id, X.CRAFTS.filter(c => c.cat === k.id).length]));
      for (const c of X.CRAFTS) {
        if (c.steps.length < 3 || c.steps.length > 8) out.probs.push(`${c.id}: ${c.steps.length} steps`);
        c.steps.forEach((s, i) => {
          out.kinds[s.a] = (out.kinds[s.a] || 0) + 1;
          const fr = [[0, 0], [0.2, 250], [0.45, 700], [0.7, 1300], [0.9, 1900], [1, 2500]].map(([e, t]) => { try { return X.raw(s, e, t); } catch (er) { return 'ERR ' + er.message; } });
          const bad = fr.find(x => /ERR|NaN|undefined/.test(x));
          if (bad) out.probs.push(`${c.id} step ${i + 1}: bad frame ${bad.slice(0, 80)}`);
          const distinct = new Set(fr).size;
          if (distinct < 3) out.probs.push(`${c.id} step ${i + 1} (${s.a}): only ${distinct} different frames`);
          const whole = X.frame(s, 0, 0);
          if (whole.length < 200) out.probs.push(`${c.id} step ${i + 1}: empty first frame`);
          if (!s.t || s.t.split(/\s+/).length > 26) out.probs.push(`${c.id} step ${i + 1}: text`);
        });
      }
      return out;
    });
    if (D.n < 110) fail(`only ${D.n} crafts`);
    for (const k of ['paint', 'beads', 'costume', 'sensory', 'build', 'gifts', 'season']) if (!(D.perCat[k] >= 5)) fail(`category ${k} has ${D.perCat[k]}`);
    if (!(D.perCat.fold >= 12)) fail(`origami has ${D.perCat.fold}`);
    const lv = D.info.levels;
    if (lv[0] < 40 || lv[1] < 30 || lv[2] + lv[3] < 24 || lv[3] < 8) fail(`levels ${JSON.stringify(lv)}`);
    for (const k of ['dab', 'pour', 'stir', 'stack', 'knot', 'measure', 'launch', 'oven']) if (!D.kinds[k]) fail(`movie kind ${k} unused`);
    if (D.probs.length) fail(`data: ${D.probs.slice(0, 8).join(' | ')} (${D.probs.length})`);
    for (const id of ['fox', 'orifly', 'oriheart', 'starbox', 'tulip', 'fortune', 'playdough', 'catapult', 'cape', 'eyemask', 'ribbonwand', 'platecrown', 'rainstick', 'shaker', 'bridge', 'cuptower', 'spongeflowers', 'bubblewrap', 'saltpaint', 'marblepaint'])
      if (!(await p.evaluate(id => !!window.__crafts.BY[id], id))) fail(`missing craft ${id}`);

    // 2. Safety notes follow the materials: paint, hot water and the oven, glue guns, small pieces; none for a plain fold.
    const safe = await p.evaluate(() => {
      const X = window.__crafts, txt = id => X.safety(X.BY[id]).map(x => x[0] + ' ' + x[1]).join(' | ');
      return { playdough: txt('playdough'), handprint: txt('handprint'), sponge: txt('spongeflowers'), balloon: txt('ballooncar'), fox: txt('fox'), cuptower: txt('cuptower'),
        gun: X.safety({ mat: [['🔫', 'a glue gun (hot glue)']], steps: [] }).map(x => x[1]).join(' '), oven: X.safety({ mat: [['🍪', 'cookie dough']], steps: [{ a: 'oven' }] }).map(x => x[1]).join(' ') };
    });
    if (!/🔥.*grown-up/.test(safe.playdough) || !/salty|dogs/.test(safe.playdough)) fail(`playdough safety: ${safe.playdough}`);
    if (!/🔥.*Oven/i.test(safe.handprint)) fail(`handprint oven safety: ${safe.handprint}`);
    if (!/🎨.*paint/i.test(safe.sponge)) fail(`sponge paint safety: ${safe.sponge}`);
    if (!/choke/.test(safe.balloon) || !/needles|grown-up/.test(safe.balloon)) fail(`balloon car safety: ${safe.balloon}`);
    if (!/glue gun.*grown-up/i.test(safe.gun)) fail(`glue gun safety: ${safe.gun}`);
    if (!/oven/i.test(safe.oven)) fail(`oven step safety: ${safe.oven}`);
    if (safe.fox || safe.cuptower) fail(`fox or cup tower has a safety note: ${safe.fox} ${safe.cuptower}`);

    // 3. Craft of the day: the same all day (also after a reload), suits the age, varies over a week, and opens its craft.
    await p.evaluate(() => { window.__owl.st.age = 5; });
    await p.evaluate(() => window.__crafts.home()); await p.waitForSelector('#crDay');
    const cd = await p.evaluate(() => { const X = window.__crafts, a = X.cotd(), b2 = X.cotd(), week = ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07'].map(d => X.cotd(d).id);
      return { a: a.id, b: b2.id, lv: a.lv, label: document.getElementById('crDay').getAttribute('aria-label'), name: a.name, week, svg: document.querySelector('#crDay svg').innerHTML.length }; });
    if (cd.a !== cd.b) fail('craft of the day changed within the day');
    if (cd.lv !== 1) fail(`craft of the day for a 5-year-old is level ${cd.lv}`);
    if (!cd.label.includes(cd.name)) fail(`craft of the day button says ${cd.label}, expected ${cd.name}`);
    if (new Set(cd.week).size < 4) fail(`craft of the day hardly varies: ${cd.week}`);
    if (cd.svg < 300) fail('craft of the day has no picture');
    await bigEnough('crafts home'); await noScroll('crafts home'); await shot('home');
    await p.reload(); await p.waitForFunction(() => window.__owl && window.__crafts);
    await p.evaluate(() => { window.__owl.st.age = 5; window.__crafts.home(); }); await p.waitForSelector('#crDay');
    if ((await p.evaluate(() => window.__crafts.cotd().id)) !== cd.a) fail('craft of the day changed after a reload');
    await p.click('#crDay'); await p.waitForSelector('#crSvg');
    if ((await p.evaluate(() => window.__crafts.movie.c.id)) !== cd.a) fail('craft of the day button opened another craft');
    await p.evaluate(() => { window.__owl.st.age = 11; window.__crafts.home(); }); await p.waitForSelector('#crDay');
    const old = await p.evaluate(() => { const X = window.__crafts; return ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08', '2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12'].map(d => X.cotd(d).lv); });
    if (!old.some(l => l > 1)) fail(`older child's craft of the day is always easy: ${old}`);
    await p.evaluate(() => { window.__owl.st.age = 5; });

    // 4. "I have..." chips: each shows exactly the crafts that use it; tap again to go back; chips combine with the level.
    await p.evaluate(() => window.__crafts.home()); await p.waitForSelector('.cr-hv');
    const haves = await p.evaluate(() => window.__crafts.HAVE.map(h => h.id));
    const need = { paper: 30, plates: 5, rolls: 4, string: 12, clay: 5, paint: 20, boxes: 8, nature: 4 };
    for (const id of haves) {
      await p.click(`.cr-hv[data-have="${id}"]`); await p.waitForSelector(`.cr-hv[data-have="${id}"][aria-pressed="true"]`);
      const r = await p.evaluate(id => { const X = window.__crafts, h = X.HAVE.find(x => x.id === id), shown = [...document.querySelectorAll('#crList .cr-card')].map(b => b.dataset.c);
        return { shown, want: X.CRAFTS.filter(c => h.re.test(c.mat.map(m => m[1].toLowerCase()).join(' | '))).map(c => c.id), cats: !!document.querySelector('#crList .cr-cat'), head: document.querySelector('#crList h2').textContent }; }, id);
      if (r.shown.length !== r.want.length || r.shown.some(x => !r.want.includes(x))) fail(`chip ${id} shows ${r.shown.length}, want ${r.want.length}`);
      if (r.shown.length < (need[id] || 3)) fail(`chip ${id} finds only ${r.shown.length} crafts`);
      if (r.cats) fail(`chip ${id} still shows the categories`);
      if (!new RegExp(`^${r.shown.length} craft`).test(r.head)) fail(`chip ${id} heading: ${r.head}`);
      if (id === 'clay') { await bigEnough('chip filter'); await noScroll('chip filter'); await shot('chip-clay'); }
    }
    await p.click('.cr-hv[aria-pressed="true"]'); await sleep(100);
    if (!(await p.$('#crList .cr-cat')) || await p.$('.cr-hv[aria-pressed="true"]')) fail('tapping the chip again did not clear the filter');
    await p.click('.cr-hv[data-have="string"]'); await p.click('.cr-lvb[data-lv="1"]'); await p.waitForSelector('.cr-lvb[data-lv="1"][aria-pressed="true"]');
    const combo = await p.evaluate(() => ({ chip: document.querySelector('.cr-hv[aria-pressed="true"]')?.dataset.have, lvs: [...document.querySelectorAll('#crList .cr-card')].map(b => window.__crafts.BY[b.dataset.c].lv), n: window.__crafts.filter(1, 'string').length }));
    if (combo.chip !== 'string' || !combo.lvs.length || combo.lvs.some(l => l !== 1) || combo.lvs.length !== combo.n) fail(`string + easy shows ${JSON.stringify(combo)}`);
    // a filtered card opens its craft, and back returns to the same filtered list
    const first = await p.getAttribute('#crList .cr-card', 'data-c');
    await p.click('#crList .cr-card'); await p.waitForSelector('#crSvg');
    if ((await p.evaluate(() => window.__crafts.movie.c.id)) !== first) fail('filtered card opened the wrong craft');
    await p.evaluate(() => document.querySelector('#view .crumbs button, #view [data-back], #view .back')?.click()); await sleep(200);

    // 5. The search box: words match names, materials and kinds; nothing found says so; the clear button resets.
    await p.evaluate(() => window.__crafts.home()); await p.waitForSelector('#crQ');
    const search = async q => { await p.fill('#crQ', q); await sleep(80); return p.evaluate(() => [...document.querySelectorAll('#crList .cr-card')].map(b => b.dataset.c)); };
    let r = await search('owl');
    if (!r.includes('tubeowl') || !r.includes('coneowl')) fail(`search owl: ${r}`);
    r = await search('origami fox');
    if (!r.includes('fox') || r.length > 3) fail(`search origami fox: ${r}`);
    r = await search('Buttons');
    if (!r.includes('buttonbrace') || !r.includes('button')) fail(`search buttons: ${r}`);
    r = await search('painting');
    if (r.length < 8) fail(`search painting finds ${r.length}`);
    await shot('search'); await noScroll('search');
    r = await search('zzqx');
    if (r.length || !/No crafts match/.test(await p.textContent('#crList'))) fail('search for nonsense did not say no match');
    await p.click('#crQx'); await sleep(80);
    if ((await p.inputValue('#crQ')) !== '' || !(await p.$('#crList .cr-cat'))) fail('clear search did not reset');
    await p.click('.cr-hv[data-have="plates"]'); r = await search('lion');
    if (r.length !== 1 || r[0] !== 'lion') fail(`plates + lion: ${r}`);

    // 6. Every new category page lists its crafts, easy first.
    for (const id of ['paint', 'beads', 'costume', 'sensory', 'build', 'gifts', 'season', 'fold']) {
      await p.evaluate(id => window.__crafts.cat(id), id); await p.waitForSelector('.cr-card');
      const x = await p.evaluate(id => ({ n: document.querySelectorAll('.cr-card').length, want: window.__crafts.CRAFTS.filter(c => c.cat === id).length, lv: [...document.querySelectorAll('.cr-card')].map(b => window.__crafts.BY[b.dataset.c].lv) }), id);
      if (x.n !== x.want) fail(`category ${id} shows ${x.n} of ${x.want}`);
      if (x.lv.some((l, i) => i && l < x.lv[i - 1])) fail(`category ${id} not easy first`);
    }
    await noScroll('category'); await shot('cat-season');

    // 7. Live: every step of every craft (phone) or the new kinds (tablet) animates on the craft page itself.
    const ids = await p.evaluate(full => { const X = window.__crafts; if (full) return X.CRAFTS.map(c => c.id);
      const kinds = ['dab', 'pour', 'stir', 'stack', 'knot', 'measure', 'launch', 'oven']; return kinds.map(k => X.CRAFTS.find(c => c.steps.some(s => s.a === k)).id); }, full);
    let checked = 0;
    for (const id of ids) {
      await p.evaluate(id => window.__crafts.open(id), id); await p.waitForSelector('#crSvg');
      const n = await p.$$eval('.cr-dot', d => d.length);
      for (let i = 0; i < n; i++) {
        await p.evaluate(i => document.querySelector(`.cr-dot[data-s="${i}"]`).click(), i);
        if (i === 0) { const first = await p.$eval('#crSvg', s => s.innerHTML.length); if (first < 200) fail(`${id}: empty first frame`); }
        // each loop holds still for a moment at its start and end, so jump the live movie to the middle of its loop
        await p.evaluate(() => { const m = window.__crafts.movie; m.start = performance.now() - 0.3 * window.__crafts.stepDur(m.c.steps[m.i]); });
        await sleep(60);
        const a = await p.evaluate(() => [document.getElementById('crSvg').innerHTML, window.__crafts.movie.frames]);
        await sleep(420);
        const z = await p.evaluate(() => [document.getElementById('crSvg').innerHTML, window.__crafts.movie.frames, window.__crafts.movie.i]);
        if (z[2] !== i) fail(`${id}: step dot ${i + 1} went to ${z[2] + 1}`);
        if (a[0] === z[0]) { await sleep(700); const z2 = await p.$eval('#crSvg', s => s.innerHTML); if (z2 === a[0]) fail(`${id} step ${i + 1}: the movie does not change`); }
        if (z[1] - a[1] < 4) fail(`${id} step ${i + 1}: only ${z[1] - a[1]} frames`);
        if (a[0].length < 200) fail(`${id} step ${i + 1}: empty movie`);
        checked++;
      }
      await noScroll(`craft ${id}`);
    }
    for (const id of ['fox', 'catapult', 'playdough']) { await p.evaluate(id => window.__crafts.open(id), id); await p.waitForSelector('#crSvg'); await p.click('.cr-dot[data-s="2"]'); await sleep(1600); await shot(`movie-${id}`, false); }
    console.log(`${tag}: ${D.n} crafts, levels ${JSON.stringify(lv)}, kinds ${JSON.stringify(D.perCat)}; craft of the day ${cd.a}; ${checked} steps animated live`);
    await ctx.close();
  }
  console.log('errors', errs.length ? errs : 'none');
  console.log('fails', fails.length ? fails : 'none');
  await b.close();
})().catch(e => { console.log('crash', e.message.split('\n').slice(0, 6).join(' | '), (e.stack.match(/t37\.js:\d+/g) || []).join(' ')); console.log('errors', errs); console.log('fails', fails); process.exit(1); });
