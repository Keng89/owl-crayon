// Crafts corner round 3: 155+ crafts (more easy ones, a few expert showpieces, kitchen, music and toys); every step of
// every new craft draws without errors and animates, in the data and live on the craft page (phone: all, tablet: one
// craft per new movie kind); the new kinds are all used; tools glow; safety notes for the new materials; the craft page
// opens on the finished-craft preview movie (it plays, "Let's start!" closes it, 👀 opens it again); slow motion halves
// the speed and is remembered; "I did this step ✓" ticks the step, cheers, says the next step and moves on, and after
// the last step opens "I made it!"; a craft journey shows its trail, finishes with a badge (once, +5 stars), and the
// badge shows on the journey, the crafts wall and the progress report; "Print template" calls window.print() and the
// print stylesheet shows only the real-size outline. No console errors, no sideways scroll, big labeled buttons.
// Prints "errors none" and "fails none" when clean. Takes PORT (default 8766). Screenshots go to SHOTS.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errs = [], fails = [];
const NEW = ['fruitface', 'fruitkebab', 'cookieface', 'yogurtpaint', 'pastaart', 'snackcar', 'pizzafaces', 'kazoo', 'platetamb', 'drumtub', 'bottlexylo', 'guitarbox', 'panflute',
  'magnetfish', 'cupball', 'stonettt', 'bowling', 'spinner', 'hopfrog', 'jumpbunny', 'popflower', 'popcake', 'popdragon', 'rockpet', 'storystones', 'mandala', 'leafanimals',
  'dreamcatcher', 'kite', 'machebowl', 'eggcaterpillar', 'castle', 'suncatcher', 'cottonsheep', 'platefish', 'owlmask', 'icepaint', 'stickpuppet', 'spoondoll', 'shadowpuppets',
  'shadowtheatre', 'marionette', 'loomweave'];

(async () => {
  const b = await chromium.launch();
  for (const [w, h, tag, full] of [[390, 844, 'phone', true], [820, 1180, 'tablet', false]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 500 });
    await ctx.addInitScript(() => { window.__said = []; window.__printed = 0; try { speechSynthesis.speak = u => window.__said.push(u.text); } catch (e) {} });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(`${tag}: ${e.message}`));
    p.on('console', m => { if ((m.type() === 'error' || m.type() === 'warning') && !/favicon|manifest|sw\.js|service|fonts|Failed to load resource/i.test(m.text())) errs.push(`${tag} console: ${m.text()}`); });
    const fail = m => fails.push(`${tag}: ${m}`);
    const shot = async (name, fullPage = true) => { await sleep(250); await p.screenshot({ path: `${SHOTS}/crafts3-${tag}-${name}.png`, fullPage }); };
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (o > 1) fail(`sideways scroll ${o}px at ${where}`); };
    const bigEnough = async where => {
      const small = await p.evaluate(() => [...document.querySelectorAll('#view button, #view input')].filter(b => b.offsetParent && !b.disabled).map(b => { const r = b.getBoundingClientRect(); return [b.id || b.className, Math.round(r.width), Math.round(r.height), (b.textContent.trim() || b.getAttribute('aria-label') || '').slice(0, 14)]; }).filter(x => x[1] < 44 || x[2] < 44 || !x[3]));
      if (small.length) fail(`${where}: small or unlabeled controls ${JSON.stringify(small.slice(0, 4))}`);
    };
    const mv = () => p.evaluate(() => { const m = window.__crafts.movie; return m && { i: m.i, frames: m.frames, playing: m.playing, u: m.u, rate: m.rate, preview: m.preview, pvFrames: m.pvFrames, id: m.c.id, did: [...(m.did || [])] }; });
    const said = () => p.evaluate(() => window.__said.splice(0).join(' | '));

    await p.goto(`http://localhost:${PORT}/index.html#selftest`);
    await p.waitForFunction(() => window.__owl && window.__crafts);
    await p.evaluate(() => { window.__owl.st.age = 5; window.__owl.st.speak = true; window.print = () => { window.__printed++; }; });

    // 1. The data: 155+ crafts, the new ones present with 3-8 steps, more easy ones, a few experts, new kinds all used.
    const D = await p.evaluate(NEW => {
      const X = window.__crafts, out = { n: X.CRAFTS.length, info: X.info(), probs: [], kinds: {}, missing: NEW.filter(id => !X.BY[id]), cats: X.CATS.map(k => k.id) };
      const nw = NEW.map(id => X.BY[id]).filter(Boolean);
      out.newLv = [1, 2, 3, 4].map(l => nw.filter(c => c.lv === l).length);
      for (const c of nw) {
        if (c.steps.length < 3 || c.steps.length > 8) out.probs.push(`${c.id}: ${c.steps.length} steps`);
        if (!X.CATS.some(k => k.id === c.cat)) out.probs.push(`${c.id}: unknown kind ${c.cat}`);
        c.steps.forEach((s, i) => {
          out.kinds[s.a] = (out.kinds[s.a] || 0) + 1;
          const fr = [[0, 0], [0.2, 250], [0.45, 700], [0.7, 1300], [0.9, 1900], [1, 2500]].map(([e, t]) => { try { return X.raw(s, e, t); } catch (er) { return 'ERR ' + er.message; } });
          const bad = fr.find(x => /ERR|NaN|undefined|Infinity/.test(x));
          if (bad) out.probs.push(`${c.id} step ${i + 1}: bad frame ${bad.slice(0, 80)}`);
          if (new Set(fr).size < 3) out.probs.push(`${c.id} step ${i + 1} (${s.a}): only ${new Set(fr).size} different frames`);
          if (X.frame(s, 0, 0).length < 200) out.probs.push(`${c.id} step ${i + 1}: empty first frame`);
          if (!s.t || s.t.split(/\s+/).length > 26) out.probs.push(`${c.id} step ${i + 1}: text`);
        });
        if (c.steps[c.steps.length - 1].a !== 'show') out.probs.push(`${c.id}: does not end with a finished-craft movie`);
      }
      // every tool glows
      const sc = X.raw({ a: 'cut', pts: [[20, 20], [180, 20]] }, 0.4, 0), sl = X.raw({ a: 'slice', pts: [[100, 20], [100, 120]] }, 0.4, 0);
      out.glow = /class="cr-glow"/.test(sc) && /class="cr-glow"/.test(sl);
      return out;
    }, NEW);
    if (D.n < 155) fail(`only ${D.n} crafts`);
    if (D.missing.length) fail(`missing crafts ${D.missing}`);
    if (NEW.length < 40) fail(`only ${NEW.length} new crafts`);
    if (D.newLv[0] < 18 || D.newLv[3] < 3) fail(`new crafts by level ${D.newLv}`);
    for (const k of ['kitchen', 'music', 'toys']) if (!D.cats.includes(k)) fail(`no ${k} category`);
    for (const k of ['slice', 'spread', 'inflate', 'layer', 'peel', 'popup', 'spring', 'shadow', 'loom', 'fish', 'music', 'ring', 'rise']) if (!D.kinds[k]) fail(`new movie kind ${k} unused`);
    if (!D.glow) fail('tools do not glow');
    if (D.probs.length) fail(`data: ${D.probs.slice(0, 8).join(' | ')} (${D.probs.length})`);

    // 2. Safety notes for the new materials.
    const safe = await p.evaluate(() => { const X = window.__crafts, t = id => X.safety(X.BY[id]).map(x => x[0] + ' ' + x[1]).join(' | '); return { fruit: t('fruitface'), fish: t('magnetfish'), kite: t('kite'), mache: t('machebowl'), pizza: t('pizzafaces'), yog: t('yogurtpaint'), mandala: t('mandala') }; });
    if (!/Scissors|knife/i.test(safe.fruit) || !/allerg/i.test(safe.fruit)) fail(`fruit face safety: ${safe.fruit}`);
    if (!/choke/.test(safe.fish) || !/[Mm]agnet/.test(safe.fish)) fail(`magnet fishing safety: ${safe.fish}`);
    if (!/power lines/.test(safe.kite)) fail(`kite safety: ${safe.kite}`);
    if (!/Pins and needles|choke|[Gg]lue/.test(safe.mache)) fail(`paper mache safety: ${safe.mache}`);
    if (!/🔥/.test(safe.pizza)) fail(`pizza oven safety: ${safe.pizza}`);
    if (!/🎨/.test(safe.yog)) fail(`food coloring safety: ${safe.yog}`);
    if (safe.mandala) fail(`nature mandala has a safety note: ${safe.mandala}`);

    // 3. Live: every step of every new craft (phone) or one craft per new kind (tablet) animates on the craft page.
    const ids = await p.evaluate(([NEW, full]) => { const X = window.__crafts; if (full) return NEW;
      return [...new Set(['slice', 'spread', 'inflate', 'layer', 'peel', 'popup', 'spring', 'shadow', 'loom', 'fish', 'music', 'ring', 'rise'].map(k => NEW.find(id => X.BY[id].steps.some(s => s.a === k))))]; }, [NEW, full]);
    let checked = 0;
    for (const id of ids) {
      await p.evaluate(id => window.__crafts.open(id), id); await p.waitForSelector('#crSvg');
      await p.click('#crPvGo');
      const n = await p.$$eval('.cr-dot', d => d.length);
      for (let i = 0; i < n; i++) {
        await p.evaluate(i => document.querySelector(`.cr-dot[data-s="${i}"]`).click(), i);
        await p.evaluate(() => { const m = window.__crafts.movie; m.start = performance.now() - 0.3 * window.__crafts.stepDur(m.c.steps[m.i]) / (m.rate || 1); });
        await sleep(60);
        const a = await p.evaluate(() => [document.getElementById('crSvg').innerHTML, window.__crafts.movie.frames]);
        await sleep(380);
        const z = await p.evaluate(() => [document.getElementById('crSvg').innerHTML, window.__crafts.movie.frames, window.__crafts.movie.i]);
        if (z[2] !== i) fail(`${id}: step dot ${i + 1} went to ${z[2] + 1}`);
        if (a[0] === z[0]) { await sleep(700); if ((await p.$eval('#crSvg', s => s.innerHTML)) === a[0]) fail(`${id} step ${i + 1}: the movie does not change`); }
        if (z[1] - a[1] < 4) fail(`${id} step ${i + 1}: only ${z[1] - a[1]} frames`);
        if (a[0].length < 200 || /NaN/.test(a[0])) fail(`${id} step ${i + 1}: empty or broken movie`);
        checked++;
      }
      if (['castle', 'shadowtheatre', 'popdragon', 'loomweave'].includes(id)) { await p.click('.cr-dot[data-s="2"]'); await sleep(1500); await shot(`movie-${id}`, false); }
    }
    await noScroll('craft pages');

    // 4. The preview movie: the craft opens on the finished craft, playing; Let's start closes it; 👀 opens it again.
    await p.evaluate(() => window.__crafts.open('rockpet')); await p.waitForSelector('#crPv'); await said();
    let m0 = await mv(); const pv0 = await p.$eval('#crPvSvg', s => s.innerHTML); await sleep(900); let m1 = await mv(); const pv1 = await p.$eval('#crPvSvg', s => s.innerHTML);
    if (!m1.preview || await p.$eval('#crPv', e => e.hidden)) fail('preview not shown when the craft opens');
    if (m1.pvFrames - m0.pvFrames < 10 || pv0 === pv1) fail(`preview movie does not play (${m1.pvFrames - m0.pvFrames} frames)`);
    const lastItem = await p.evaluate(() => { const c = window.__crafts.BY.rockpet; const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.innerHTML = c.steps[c.steps.length - 1].item; return g.innerHTML.slice(0, 160); });
    if (!pv1.includes(lastItem)) fail('preview does not show the finished craft');
    if (!/this is what you will make/i.test(await p.textContent('#crPv'))) fail('preview caption');
    await bigEnough('preview'); await noScroll('preview'); await shot('preview', false);
    await p.click('#crPvGo'); await sleep(150);
    if ((await mv()).preview || !(await p.$eval('#crPv', e => e.hidden))) fail("Let's start did not close the preview");
    if ((await mv()).i !== 0 || !/Step 1/.test(await said())) fail("Let's start did not start step 1");
    await p.click('#crPvBtn'); await sleep(300);
    if (!(await mv()).preview || await p.$eval('#crPv', e => e.hidden)) fail('👀 did not show the finished craft again');
    await p.click('#crPvBtn'); await sleep(100);
    if ((await mv()).preview) fail('👀 did not close the preview');

    // 5. Slow motion: half speed, the button shows it, it is remembered for the next craft, and it turns off again.
    const speed = async () => { await p.evaluate(() => { const m = window.__crafts.movie; m.start = performance.now(); m.at = 0; }); await sleep(60); const a = (await mv()).u; await sleep(1000); const z = await mv(); return z.u - a; };
    const fast = await speed();
    await p.click('#crSlow'); await sleep(50);
    const slow = await speed();
    if ((await mv()).rate !== 0.5 || (await p.getAttribute('#crSlow', 'aria-pressed')) !== 'true') fail('slow motion did not turn on');
    if (!(slow > 0 && fast > 0 && slow / fast > 0.35 && slow / fast < 0.65)) fail(`slow motion speed ${slow.toFixed(3)} vs ${fast.toFixed(3)}`);
    if (!/[Ss]low motion/.test(await said())) fail('slow motion not said');
    await p.evaluate(() => window.__crafts.open('kazoo')); await p.waitForSelector('#crSlow');
    if ((await mv()).rate !== 0.5 || !(await p.evaluate(() => window.__owl.st.crafts.slow))) fail('slow motion not remembered');
    await shot('slowmo', false);
    await p.click('#crSlow'); await sleep(50);
    if ((await mv()).rate !== 1 || await p.evaluate(() => window.__owl.st.crafts.slow)) fail('slow motion did not turn off');

    // 6. "I did this step ✓": ticks the step, cheers, says the next step, moves on; the last one opens "I made it!".
    await p.evaluate(() => window.__crafts.open('cupball')); await p.waitForSelector('#crDid'); await p.click('#crPvGo'); await said();
    const nSteps = await p.$$eval('.cr-dot', d => d.length);
    await bigEnough('craft page'); await noScroll('craft page');
    for (let i = 0; i < nSteps - 1; i++) {
      await p.click('#crDid'); await sleep(120);
      const x = await mv(), sp = await said(), dot = await p.$eval(`.cr-dot[data-s="${i}"]`, d => d.classList.contains('did'));
      if (x.i !== i + 1) fail(`step check ${i + 1} went to step ${x.i + 1}`);
      if (!x.did.includes(i) || !dot) fail(`step ${i + 1} not ticked`);
      if (!new RegExp(`Step ${i + 2}\\.`, 'i').test(sp) || !/(Great job|Well done|Super|You did it|Brilliant|nice work|Fantastic|Keep going)/.test(sp)) fail(`step check ${i + 1} said: ${sp}`);
      if (i === 0) { if (await p.$eval('#crCheer', e => e.hidden)) fail('no cheer after a step check'); await shot('stepcheck', false); }
      if (!/Step \d+/.test(await p.textContent('#crText'))) fail('step text missing');
    }
    if (!/last step/.test(await p.textContent('#crDid'))) fail(`last step button says ${await p.textContent('#crDid')}`);
    await p.click('#crDid'); await p.waitForSelector('#crStk', { timeout: 3000 }).catch(() => fail('the last step check did not open "I made it!"'));

    // 7. A craft journey: the trail lists 6 crafts easy to expert; finishing the last one gives the badge once (+5 stars).
    await p.evaluate(() => window.__crafts.home()); await p.waitForSelector('.cr-jb');
    const J = await p.evaluate(() => ({ n: document.querySelectorAll('.cr-jb').length, ids: window.__crafts.JOURNEYS.map(j => j.id), sizes: window.__crafts.JOURNEYS.map(j => j.crafts.filter(id => window.__crafts.BY[id]).length),
      order: window.__crafts.JOURNEYS.map(j => j.crafts.map(id => window.__crafts.BY[id].lv)) }));
    if (J.n < 4 || J.n !== J.ids.length) fail(`journeys on home: ${J.n}`);
    for (const k of ['paper', 'builder', 'nature', 'gift']) if (!J.ids.includes(k)) fail(`journey ${k} missing`);
    J.sizes.forEach((s, i) => { if (s !== 6) fail(`journey ${J.ids[i]} has ${s} crafts`); });
    J.order.forEach((o, i) => { if (o.some((l, k) => k && l < o[k - 1]) || o[0] !== 1 || o[5] < 2 || (J.ids[i] === 'paper' && o[5] !== 4)) fail(`journey ${J.ids[i]} levels ${o}`); });
    await bigEnough('crafts home'); await noScroll('crafts home'); await shot('home');
    await p.click('.cr-jb[data-j="paper"]'); await p.waitForSelector('.cr-trail');
    const tr = await p.evaluate(() => ({ stops: document.querySelectorAll('.cr-trail [data-c]').length, next: document.querySelector('.cr-trail .next [data-c]')?.dataset.c, goal: document.querySelector('#crGoal').textContent }));
    if (tr.stops !== 6 || !tr.next || !/badge/.test(tr.goal)) fail(`paper trail ${JSON.stringify(tr)}`);
    await bigEnough('journey'); await noScroll('journey'); await shot('journey');
    // make the first five (as if done before), then finish the sixth through the real flow
    const list = await p.evaluate(() => window.__crafts.JOURNEYS.find(j => j.id === 'paper').crafts);
    await p.evaluate(ids => { const D = window.__crafts.CS(); ids.slice(0, 5).forEach(id => { D.done[id] = { n: 1, first: '2026-10-01', last: '2026-10-01', sticker: '🌟', how: 'sticker' }; }); delete (window.__owl.st.crafts.jbadges || {}).paper; }, list);
    await p.evaluate(() => window.__crafts.journey('paper')); await p.waitForSelector('.cr-trail');
    if ((await p.getAttribute('.cr-trail .next [data-c]', 'data-c')) !== list[5]) fail('trail next is not the last craft');
    await p.click('.cr-trail .next [data-c]'); await p.waitForSelector('#crSvg');
    if ((await mv()).id !== list[5]) fail('trail stop opened the wrong craft');
    const s0 = await p.evaluate(() => window.__owl.st.stars);
    await p.evaluate(() => window.__crafts.made(window.__crafts.movie.c.id)); await p.waitForSelector('#crStk');
    await p.click('#crStk'); await p.click('.cr-sb[data-k="🦄"]'); await p.waitForSelector('.cr-win'); await sleep(200);
    const got = await p.evaluate(() => ({ badge: (window.__owl.st.crafts.jbadges || {}).paper, banner: document.querySelector('.cr-jdone')?.textContent || '', stars: window.__owl.st.stars }));
    const lvStars = await p.evaluate(id => window.__crafts.LEVELS[window.__crafts.BY[id].lv - 1].stars, list[5]);
    if (!got.badge || !/Paper Master/.test(got.banner)) fail(`journey badge not given: ${JSON.stringify(got)}`);
    if (got.stars - s0 !== lvStars + 5) fail(`journey stars ${got.stars - s0}, want ${lvStars + 5}`);
    if (!/journey/i.test(await said())) fail('journey badge not said');
    await shot('badge');
    await p.evaluate(() => window.__crafts.made(window.__crafts.movie ? window.__crafts.movie.c.id : 'crane')); await p.waitForSelector('#crStk');
    const s1 = await p.evaluate(() => window.__owl.st.stars);
    await p.click('#crStk'); await p.click('.cr-sb[data-k="🌟"]'); await p.waitForSelector('.cr-win'); await sleep(100);
    if (await p.$('.cr-jdone') || (await p.evaluate(() => window.__owl.st.stars)) - s1 !== 1) fail('the badge was given twice');
    await p.evaluate(() => window.__crafts.journey('paper')); await p.waitForSelector('.cr-trail');
    if (!/Won on/.test(await p.textContent('#crGoal')) || (await p.$$('.cr-trail li.done')).length !== 7) fail('journey trail does not show it finished');
    await p.evaluate(() => window.__crafts.home()); await p.waitForSelector('.cr-jwon');
    if (!/Paper Master/.test(await p.textContent('.cr-wall'))) fail('crafts wall has no journey badge');
    // a journey in progress shows on the made screen
    await p.evaluate(() => window.__crafts.made('kazoo')); await p.waitForSelector('#crStk'); await p.click('#crStk'); await p.click('.cr-sb[data-k="🌟"]'); await p.waitForSelector('.cr-win'); await sleep(100);
    if (!/Music Maker: \d of 6/.test((await p.textContent('.cr-win')) || '')) fail('made screen does not show journey progress');
    await p.click('[data-jgo="music"]'); await p.waitForSelector('.cr-trail');
    // the progress report counts journeys and badges
    const rp = await p.evaluate(() => { const S = window.__report.stats(window.__owl.profiles.find(x => x.name === window.__owl.st.name)?.id || undefined); return S && S.C && S.C.J; }).catch(() => null);
    const rpHtml = await p.evaluate(() => window.__report.panel()).catch(() => '');
    if (!/Craft journeys finished/.test(rpHtml) || !/Paper Master/.test(rpHtml)) fail(`report has no journeys ${JSON.stringify(rp)}`);

    // 8. Print template: only crafts with a shape have it; it calls print; the print view shows only the outline.
    await p.evaluate(() => window.__crafts.open('fruitface')); await p.waitForSelector('#crSvg');
    if (await p.$('#crTpl')) fail('fruit face has a template button');
    const withTpl = await p.evaluate(() => ['eyemask', 'mask', 'owlmask', 'crown', 'popup', 'popcake', 'popflower', 'popdragon', 'fingerpuppet', 'stickpuppet', 'shadowpuppets', 'marionette', 'kite', 'magnetfish'].filter(id => !window.__crafts.tplOf(window.__crafts.BY[id])));
    if (withTpl.length) fail(`no template for ${withTpl}`);
    await p.evaluate(() => window.__crafts.open('owlmask')); await p.waitForSelector('#crTpl');
    await bigEnough('template button');
    await p.click('#crTpl'); await sleep(100);
    if ((await p.evaluate(() => window.__printed)) !== 1) fail('print template did not call print');
    await p.emulateMedia({ media: 'print' });
    const pr = await p.evaluate(() => {
      const vis = el => { const r = el.getBoundingClientRect(); return getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden' && r.width > 0 && r.height > 0; };
      const tp = document.getElementById('crTplPrint'), svg = tp && tp.querySelector('svg');
      const others = [...document.body.children].filter(el => el !== tp && vis(el)).map(el => el.id || el.className || el.tagName);
      const shapes = svg ? [...svg.querySelectorAll('path,rect,circle,ellipse,polygon,line,polyline')] : [];
      const filled = shapes.filter(s => getComputedStyle(s).fill !== 'none').length, stroked = shapes.filter(s => getComputedStyle(s).stroke !== 'none').length;
      return { tpVis: tp && vis(tp), others, shapes: shapes.length, filled, stroked, w: svg && svg.getAttribute('width'), images: tp ? tp.querySelectorAll('img,text,image,foreignObject').length : -1, app: getComputedStyle(document.getElementById('app')).display };
    });
    if (!pr.tpVis || pr.others.length || pr.app !== 'none') fail(`print view shows more than the template: ${JSON.stringify(pr)}`);
    if (!pr.shapes || pr.filled || pr.stroked !== pr.shapes || pr.images) fail(`template is not outline only: ${JSON.stringify(pr)}`);
    if (!/mm$/.test(pr.w || '')) fail(`template is not real size: ${pr.w}`);
    await shot('print-template');
    await p.emulateMedia({ media: 'screen' });
    await p.evaluate(() => window.dispatchEvent(new Event('afterprint')));
    if (await p.evaluate(() => document.body.classList.contains('cr-printing'))) fail('printing class left on after print');
    if (await p.evaluate(() => getComputedStyle(document.getElementById('crTplPrint')).display) !== 'none') fail('template shows on screen');
    // the screen print stylesheet still prints the progress report, not the template
    await noScroll('after print');

    console.log(`${tag}: ${D.n} crafts, levels ${JSON.stringify(D.info.levels)}, new ${NEW.length} (levels ${D.newLv}), kinds ${Object.keys(D.kinds).length}; ${checked} new steps animated live; journeys ${J.ids.join(',')}`);
    await ctx.close();
  }
  await b.close();
  console.log('errors', errs.length ? errs.join('\n') : 'none');
  console.log('fails', fails.length ? fails.join('\n') : 'none');
})();
