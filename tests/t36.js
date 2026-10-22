// Crafts corner: the home tile opens it; 40+ crafts in 15 categories at 4 levels, each with materials, a time, 3-8
// steps and a safety note whenever scissors, glue, needles or hot things are used; every step's mini-movie draws at
// every point of its loop without errors; the level filter and each category list render; a craft page plays its
// movie (frames really change over time), pauses, replays, goes to the next and back, jumps by step dot, and "Watch
// all" moves through the steps on its own; "I made it!" with a sticker gives the level's stars once (1 star on a
// repeat), a blank drawing is refused and a real one is saved to My pictures; done crafts live in st.crafts and survive
// a reload. Phone with speech (Owl reads each step), tablet without speech (nothing waits on it). No sideways scroll,
// buttons at least 44px. Prints "errors none" and "fails none" when clean. Screenshots go to SHOTS.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errs = [], fails = [];

(async () => {
  const b = await chromium.launch();
  for (const [w, h, tag, noSpeech] of [[390, 844, 'phone', false], [1024, 768, 'tablet', true]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 500 });
    await ctx.addInitScript(ns => {
      window.__said = [];
      if (ns) { try { delete Window.prototype.speechSynthesis; } catch (e) {} try { delete window.speechSynthesis; } catch (e) {} try { delete window.SpeechSynthesisUtterance; } catch (e) {} }
      else { try { speechSynthesis.speak = u => window.__said.push(u.text); } catch (e) {} }
    }, noSpeech);
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(`${tag}: ${e.message}`));
    p.on('console', m => { if (m.type() === 'error' && !/favicon|manifest|sw\.js|service|fonts|Failed to load resource/i.test(m.text())) errs.push(`${tag} console: ${m.text()}`); });
    const fail = m => fails.push(`${tag}: ${m}`);
    const shot = async (name, full = true) => { await sleep(300); await p.screenshot({ path: `${SHOTS}/crafts-${tag}-${name}.png`, fullPage: full }); };
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (o > 1) fail(`sideways scroll ${o}px at ${where}`); };
    const bigEnough = async where => {
      const small = await p.evaluate(() => [...document.querySelectorAll('#view button')].filter(b => b.offsetParent && !b.disabled).map(b => { const r = b.getBoundingClientRect(); return [b.id || b.className, Math.round(r.width), Math.round(r.height), (b.textContent.trim() || b.getAttribute('aria-label') || '').slice(0, 14)]; }).filter(x => x[1] < 44 || x[2] < 44 || !x[3]));
      if (small.length) fail(`${where}: small or unlabeled buttons ${JSON.stringify(small.slice(0, 4))}`);
    };
    const check = async where => { await noScroll(where); await bigEnough(where); };
    const st = () => p.evaluate(() => { const o = window.__owl.st; return { stars: o.stars, done: JSON.parse(JSON.stringify((o.crafts || {}).done || {})), gal: (window.__galLen = null, 0) }; });
    const mv = () => p.evaluate(() => { const m = window.__crafts.movie; return m && { i: m.i, frames: m.frames, playing: m.playing, all: m.all, u: m.u, id: m.c.id }; });

    await p.goto(`http://localhost:${PORT}/index.html#selftest`);
    await p.waitForFunction(() => window.__owl && window.__crafts);

    // 1. The home tile opens the Crafts corner.
    await p.evaluate(() => window.__owl.go(window.__owl.home));
    await p.waitForSelector('#tCrafts'); await noScroll('home');
    await p.click('#tCrafts'); await p.waitForSelector('.cr-cats');
    await check('crafts home'); await shot('home');

    // 2. The data: 40+ crafts, every category and level used, materials, time, 3-8 steps, safety notes.
    const D = await p.evaluate(() => {
      const X = window.__crafts, out = { n: X.CRAFTS.length, cats: X.CATS.length, info: X.info(), probs: [] };
      const ids = new Set();
      for (const c of X.CRAFTS) {
        if (ids.has(c.id)) out.probs.push(`duplicate id ${c.id}`); ids.add(c.id);
        if (!X.CATS.some(k => k.id === c.cat)) out.probs.push(`${c.id}: unknown category`);
        if (!(c.lv >= 1 && c.lv <= 4)) out.probs.push(`${c.id}: level ${c.lv}`);
        if (!(c.min > 0) || !c.mat.length || c.mat.some(m => !m[0] || !m[1])) out.probs.push(`${c.id}: time or materials`);
        if (c.steps.length < 3 || c.steps.length > 8) out.probs.push(`${c.id}: ${c.steps.length} steps`);
        const tools = c.mat.map(m => m[1]).join(' ') + ' ' + c.steps.map(s => s.a).join(' ');
        const safe = X.safety(c).map(x => x[1]).join(' ');
        if (/scissor|cut\b|glue|needle|pin/i.test(tools) && !/grown-up/i.test(safe)) out.probs.push(`${c.id}: no "ask a grown-up" safety note`);
        c.steps.forEach((s, i) => {
          if (!s.t || s.t.split(/\s+/).length > 26) out.probs.push(`${c.id} step ${i + 1}: text`);
          const d = X.stepDur(s); if (d < 3000 || d > 6000) out.probs.push(`${c.id} step ${i + 1}: ${d}ms`);
          const fr = [0.25, 0.5, 0.75, 1].map(e => { try { return X.raw(s, e, 900); } catch (er) { return 'ERR ' + er.message; } });
          if (fr.some(h => /ERR|NaN|undefined/.test(h))) out.probs.push(`${c.id} step ${i + 1}: bad frame ${fr.find(h => /ERR|NaN|undefined/.test(h)).slice(0, 80)}`);
          if (s.a !== 'show' && fr[0] === fr[3]) out.probs.push(`${c.id} step ${i + 1}: the movie does not move`);
        });
      }
      out.perCat = X.CATS.map(k => X.CRAFTS.filter(c => c.cat === k.id).length);
      return out;
    });
    if (D.n < 40) fail(`only ${D.n} crafts`);
    if (D.cats < 12 || D.perCat.some(n => n < 2)) fail(`categories ${JSON.stringify(D.perCat)}`);
    if (D.info.levels.some(n => n < 3)) fail(`levels ${JSON.stringify(D.info.levels)}`);
    if (D.probs.length) fail(`data: ${D.probs.slice(0, 8).join(' | ')} (${D.probs.length})`);

    // 3. Each category renders its cards (easy first), and the level filter shows only that level.
    const cats = await p.evaluate(() => window.__crafts.CATS.map(k => k.id));
    for (const id of cats) {
      await p.evaluate(id => window.__crafts.cat(id), id); await p.waitForSelector('.cr-card');
      const r = await p.evaluate(id => ({ n: document.querySelectorAll('.cr-card').length, want: window.__crafts.CRAFTS.filter(c => c.cat === id).length, lv: [...document.querySelectorAll('.cr-card')].map(b => window.__crafts.BY[b.dataset.c].lv) }), id);
      if (r.n !== r.want) fail(`category ${id} shows ${r.n} of ${r.want}`);
      if (r.lv.some((l, i) => i && l < r.lv[i - 1])) fail(`category ${id} not easy first`);
      if (id === 'fold' || id === 'string') { await check(`category ${id}`); await shot(`cat-${id}`); }
    }
    await p.evaluate(() => window.__crafts.home()); await p.waitForSelector('.cr-lvb');
    for (const lv of [1, 4]) {
      await p.click(`.cr-lvb[data-lv="${lv}"]`); await p.waitForSelector(`.cr-lvb[data-lv="${lv}"][aria-pressed="true"]`);
      const lvs = await p.evaluate(() => [...document.querySelectorAll('.cr-card')].map(b => window.__crafts.BY[b.dataset.c].lv));
      if (!lvs.length || lvs.some(l => l !== lv)) fail(`level ${lv} filter shows ${JSON.stringify(lvs)}`);
    }
    await check('level filter');

    // 4. Open a craft by tapping its card: materials, safety note, the movie.
    await p.evaluate(() => window.__crafts.cat('cut')); await p.click('.cr-card[data-c="heart"]');
    await p.waitForSelector('#crSvg');
    const page = await p.evaluate(() => ({ mat: document.querySelectorAll('.cr-mat li').length, safe: (document.querySelector('.cr-safe') || {}).textContent || '', text: document.getElementById('crText').textContent }));
    if (page.mat < 2) fail('materials list missing');
    if (!/ask a grown-up/i.test(page.safe) || !/scissors/i.test(page.safe)) fail(`heart safety note: ${page.safe}`);
    if (!/Step 1/.test(page.text)) fail(`step text: ${page.text}`);
    await check('craft page'); await shot('craft');

    // 5. The movie really moves: different frames over time, a growing frame count.
    let m0 = await mv(), f0 = await p.$eval('#crSvg', s => s.innerHTML);
    await sleep(1400);
    let m1 = await mv(), f1 = await p.$eval('#crSvg', s => s.innerHTML);
    if (m1.frames - m0.frames < 10) fail(`only ${m1.frames - m0.frames} frames in 1.4s`);
    if (f0 === f1) fail('the movie did not change');
    // pause holds the picture still; play goes on
    await p.click('#crPlay'); await sleep(150);
    const pa = await p.$eval('#crSvg', s => s.innerHTML), pf = (await mv()).frames; await sleep(600);
    if ((await p.$eval('#crSvg', s => s.innerHTML)) !== pa || (await mv()).frames !== pf || (await mv()).playing) fail('pause did not stop the movie');
    if ((await p.getAttribute('#crPlay', 'aria-label')) !== 'Play') fail('play button label');
    await p.click('#crPlay'); await sleep(400);
    if ((await mv()).frames === pf) fail('play did not restart the movie');

    // 6. Next, back, step dots, replay.
    await p.click('#crNext'); await sleep(200);
    if ((await mv()).i !== 1) fail('next did not go to step 2');
    if (!/Step 2/.test(await p.textContent('#crText'))) fail('step 2 text not shown');
    await sleep(1500); const before = (await mv()).u;
    await p.click('#crReplay'); await sleep(120);
    const after = await mv();
    if (!(after.u < before) || after.u > 0.2 || after.i !== 1) fail(`replay did not restart (u ${before} -> ${after.u})`);
    await p.click('#crPrev'); await sleep(100);
    if ((await mv()).i !== 0) fail('back did not go to step 1');
    const nSteps = await p.$$eval('.cr-dot', d => d.length);
    await p.click(`.cr-dot[data-s="${nSteps - 1}"]`); await sleep(100);
    if ((await mv()).i !== nSteps - 1) fail('step dot did not jump');
    if (!/I made it/.test(await p.textContent('#crNext'))) fail('last step button is not "I made it!"');
    if (!noSpeech) {
      const said = await p.evaluate(() => window.__said.join(' | '));
      if (!/Step 1\. Fold the paper in half/.test(said) || !/Step 2\./.test(said)) fail(`Owl did not read the steps: ${said.slice(0, 160)}`);
    }

    // 7. Watch all: plays step 1, then moves on by itself, with the movie badge showing.
    await p.click('#crAll'); await sleep(150);
    let a = await mv();
    if (!a.all || a.i !== 0 || await p.$eval('#crMode', e => e.hidden)) fail('watch all did not start at step 1');
    await p.waitForFunction(() => window.__crafts.movie.i >= 1, null, { timeout: 16000 }).catch(() => fail('watch all did not move to step 2'));
    await p.click('#crAll'); await sleep(100);
    if ((await mv()).all) fail('stop movie did not stop');

    // 8. I made it! A sticker gives 3 stars the first time (Easy), 1 star the next time.
    let s0 = await st();
    await p.click(`.cr-dot[data-s="${nSteps - 1}"]`); await p.click('#crNext');
    await p.waitForSelector('#crStk'); await check('made it'); await shot('made');
    await p.click('#crStk'); await p.waitForSelector('.cr-sb');
    await p.click('.cr-sb[data-k="🦄"]'); await p.waitForSelector('.cr-win');
    // a second tap does nothing
    await p.evaluate(() => { const b = document.querySelector('.cr-sb'); if (b) b.click(); });
    let s1 = await st();
    if (s1.stars !== s0.stars + 3) fail(`first heart gave ${s1.stars - s0.stars} stars`);
    if (!s1.done.heart || s1.done.heart.n !== 1 || s1.done.heart.sticker !== '🦄') fail(`heart not recorded ${JSON.stringify(s1.done.heart)}`);
    await check('reward'); await shot('reward');
    await p.evaluate(() => window.__crafts.made('heart')); await p.waitForSelector('#crStk');
    await p.click('#crStk'); await p.click('.cr-sb[data-k="🌟"]'); await p.waitForSelector('.cr-win');
    let s2 = await st();
    if (s2.stars !== s1.stars + 1 || s2.done.heart.n !== 2) fail(`repeat heart gave ${s2.stars - s1.stars} stars, n ${s2.done.heart.n}`);

    // 9. Draw it: a blank drawing is refused, a real one is saved to My pictures and earns the Expert stars.
    const g0 = await p.evaluate(() => JSON.parse(localStorage.getItem('owlcrayon:gallery:' + (JSON.parse(localStorage.getItem('owlcrayon:current')))) || '[]').length);
    await p.evaluate(() => window.__crafts.made('crane')); await p.waitForSelector('#crDraw');
    await p.click('#crDraw'); await p.waitForSelector('#crCv');
    const sd = await st();
    await p.click('#crSave'); await sleep(150);
    if ((await st()).stars !== sd.stars || await p.$('.cr-win')) fail('a blank drawing earned stars');
    const box = await (await p.$('#crCv')).boundingBox();
    await p.mouse.move(box.x + 30, box.y + 30); await p.mouse.down();
    for (let i = 1; i <= 12; i++) await p.mouse.move(box.x + 30 + i * 12, box.y + 30 + Math.sin(i) * 20);
    await p.mouse.up();
    await p.click('.sw[data-pc="#F2604F"]');
    await p.mouse.move(box.x + 60, box.y + 80); await p.mouse.down(); await p.mouse.move(box.x + 160, box.y + 90); await p.mouse.up();
    await check('draw it'); await shot('draw');
    await p.click('#crSave'); await p.waitForSelector('.cr-win');
    const s3 = await st(), g1 = await p.evaluate(() => JSON.parse(localStorage.getItem('owlcrayon:gallery:' + (JSON.parse(localStorage.getItem('owlcrayon:current')))) || '[]').length);
    if (s3.stars !== sd.stars + 6) fail(`expert crane gave ${s3.stars - sd.stars} stars`);
    if (g1 !== g0 + 1) fail(`drawing not saved to My pictures (${g0} -> ${g1})`);
    if (!s3.done.crane || s3.done.crane.how !== 'drawing') fail('crane not recorded as a drawing');

    // 10. The wall on the Crafts home, the next suggestion, and a reload keeps it all.
    await p.click('#crNx'); await p.waitForSelector('#crSvg');
    await p.evaluate(() => window.__crafts.home()); await p.waitForSelector('.cr-wall');
    if (!/2 made/.test(await p.textContent('.cr-wall h2'))) fail(`wall says ${await p.textContent('.cr-wall h2')}`);
    await p.reload(); await p.waitForFunction(() => window.__owl && window.__crafts);
    const s4 = await st();
    if (s4.stars !== s3.stars || !s4.done.heart || !s4.done.crane) fail('crafts progress lost after reload');
    await p.evaluate(() => window.__crafts.cat('cut')); await p.waitForSelector('.cr-card[data-c="heart"] .cr-done');

    // 11. A tricky craft with no scissors or glue shows no scary safety note; every craft page opens cleanly.
    await p.evaluate(() => window.__crafts.open('dog')); await p.waitForSelector('#crSvg');
    if (await p.$('.cr-safe')) fail('dog face shows a safety note it does not need');
    for (const id of await p.evaluate(() => window.__crafts.CRAFTS.map(c => c.id))) {
      await p.evaluate(id => window.__crafts.open(id), id); await p.waitForSelector('#crSvg');
      await sleep(60);
      if (!(await p.$eval('#crSvg', s => s.innerHTML.length > 200))) fail(`${id}: empty movie`);
      await noScroll(`craft ${id}`);
    }
    await p.evaluate(() => window.__crafts.open('frog')); await p.waitForSelector('#crSvg'); await sleep(1500); await shot('frog', false);
    console.log(`${tag}: ${D.n} crafts in ${D.cats} categories ${JSON.stringify(D.perCat)}, levels ${JSON.stringify(D.info.levels)}, ${D.info.steps} steps; stars ${s4.stars}`);
    await ctx.close();
  }
  console.log('errors', errs.length ? errs : 'none');
  console.log('fails', fails.length ? fails : 'none');
  await b.close();
})().catch(e => { console.log('crash', e.message.split('\n').slice(0, 6).join(' | '), (e.stack.match(/t36\.js:\d+/g) || []).join(' ')); console.log('errors', errs); console.log('fails', fails); process.exit(1); });
