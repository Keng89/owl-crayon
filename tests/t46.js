// Science & Nature (src/science.js, science2.js, science.css) on a phone (390x844, speech, age 5) and a tablet
// (820x1180, no speech at all, age 10). Checks: the data is not built at startup; the home tile sits in the Learn group
// and opens the area; the data (10+ topics with 4-6 picture cards each, a fact, more for 7+, a "Did you know?" and a
// picture; 5-question quizzes mixing tap the picture, true/false, sort and order; 5+ mini-labs; 10+ try-at-home cards
// with what you need, steps and "ask a grown-up" notes); every card of every topic renders a picture with no NaN and
// no sideways scroll, and reading all the cards of a topic gives exactly 1 star; every quiz is played to the end
// through the real buttons, drags and taps with exact stars (5 of 5 first time: 10 with the badge; the life cycles quiz
// with a wrong order first: the cards go back to the tray, then the drag order is right, 7 with the badge; a repeat 1);
// every mini-lab is played to success (float or sink, magnet with a real drag of the magnet, grow a plant, dress for the
// weather with a wrong outfit first, shadow puppets with the moving sun, planet order by drag: 3 stars, a repeat 1);
// every try-at-home card (2 stars once); the grown-ups' report and What's inside count it all; st.science survives a
// reload; 44px labeled buttons. Prints "errors none" and "fails none" when clean. Takes PORT (default 8766). SHOTS for screenshots.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errs = [], fails = [];

(async () => {
  const b = await chromium.launch();
  for (const [w, h, tag, noSpeech, age] of [[390, 844, 'phone', false, 5], [820, 1180, 'tablet', true, 10]]) {
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
    const shot = async name => { await sleep(150); await p.screenshot({ path: `${SHOTS}/sci-${tag}-${name}.png`, fullPage: true }); };
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (o > 1) fail(`sideways scroll ${o}px at ${where}`); };
    const bigEnough = async where => {
      const small = await p.evaluate(() => [...document.querySelectorAll('#view button, #view [role=button]')].filter(b => b.offsetParent !== null && !b.disabled).map(b => { const r = b.getBoundingClientRect(); return [b.id || b.className, Math.round(r.width), Math.round(r.height), (b.textContent.trim() || b.getAttribute('aria-label') || '').slice(0, 14)]; }).filter(x => x[1] < 44 || x[2] < 44 || !x[3]));
      if (small.length) fail(`${where}: small or unlabeled buttons ${JSON.stringify(small.slice(0, 4))}`);
    };
    const check = async where => { await noScroll(where); await bigEnough(where); };
    const stars = () => p.evaluate(() => window.__owl.st.stars);
    const S = (fn, ...a) => p.evaluate(([fn, a]) => window.__science[fn](...a), [fn, a]);
    const center = async sel => { const bx = await p.locator(sel).first().boundingBox(); if (!bx) throw new Error('no ' + sel); return [bx.x + bx.width / 2, bx.y + bx.height / 2]; };
    const drag = async (fromSel, toSel) => {
      await p.locator(fromSel).first().scrollIntoViewIfNeeded();
      const from = await center(fromSel); const to = await center(toSel);
      await p.mouse.move(...from); await p.mouse.down();
      for (let i = 1; i <= 8; i++) await p.mouse.move(from[0] + (to[0] - from[0]) * i / 8, from[1] + (to[1] - from[1]) * i / 8);
      await p.mouse.up(); await sleep(30);
    };
    const expectStars = async (before, add, what) => { const now = await stars(); if (now - before !== add) fail(`${what}: ${now - before} stars, expected ${add}`); return now; };

    await p.goto(`http://localhost:${PORT}/index.html?r=${Date.now()}#selftest`);
    await p.evaluate(() => localStorage.clear()); await p.reload();
    await p.waitForFunction(() => window.__owl && window.__science && document.getElementById('tMath'));
    // 1. Not built at startup; the home tile in Learn.
    if (await S('built')) fail('science data was built at startup');
    await p.evaluate(a => { const s = window.__owl.st; s.age = a; s.stars = 0; }, age);
    await p.evaluate(() => { window.__science.fast = true; });
    const tile = await p.evaluate(() => { const t = document.getElementById('tScience'), g = t && t.closest('.hgroup'); const r = t && t.getBoundingClientRect(); return t && { group: g && g.querySelector('.hg-title').textContent.trim(), bottom: r.bottom, w: r.width, h: r.height, name: t.querySelector('h2').textContent }; });
    if (!tile) fail('no Science tile'); else {
      if (!/Learn/.test(tile.group)) fail(`Science tile in ${tile.group}`);
      if (tile.bottom > h) fail(`Science tile below the first screen (${tile.bottom})`);
      if (tile.w < 96 || tile.h < 96) fail(`Science tile small ${tile.w}x${tile.h}`);
    }
    await p.click('#tScience'); await sleep(200);
    const home = await p.evaluate(() => ({ topics: document.querySelectorAll('[data-topic]').length, labs: document.querySelectorAll('[data-lab]').length, homes: document.querySelectorAll('[data-home]').length, h1: document.querySelector('#view h1').textContent }));
    if (!/Science/.test(home.h1)) fail(`Science home title ${home.h1}`);
    await check('science home'); await shot('home');

    // 2. The data.
    const D = await p.evaluate(() => {
      const { TOPICS, LABS, HOME } = window.__science.D(), bad = [];
      const kinds = new Set();
      for (const T of TOPICS) {
        if (T.cards.length < 4 || T.cards.length > 6) bad.push(`${T.id}: ${T.cards.length} cards`);
        for (const c of T.cards) if (!c.h || !c.pic || !c.t || !c.m || !c.dyk) bad.push(`${T.id}: card ${c.h} incomplete`);
        if (T.quiz.length !== 5) bad.push(`${T.id}: ${T.quiz.length} questions`);
        const ks = new Set(T.quiz.map(q => q.k)); if (ks.size < 3) bad.push(`${T.id}: only ${[...ks]} question kinds`);
        for (const q of T.quiz.concat(T.quiz.filter(q => q.h).map(q => q.h))) {
          kinds.add(q.k);
          if (q.k === 'pic' && !(q.o && q.o[q.a])) bad.push(`${T.id}: pic answer`);
          if (q.k === 'tf' && typeof q.a !== 'boolean') bad.push(`${T.id}: tf answer`);
          if (q.k === 'sort' && !(q.g.length === 2 && q.items.length >= 4 && q.items.every(i => i[2] === 0 || i[2] === 1) && q.items.some(i => i[2] === 0) && q.items.some(i => i[2] === 1))) bad.push(`${T.id}: sort`);
          if (q.k === 'order' && !(q.items.length >= 3 && q.items.length <= 5)) bad.push(`${T.id}: order`);
        }
      }
      for (const x of HOME) if (!x.need.length || x.steps.length < 3 || !x.why || !x.pic) bad.push(`home ${x.id} incomplete`);
      return { topics: TOPICS.map(T => T.id), cards: TOPICS.reduce((a, T) => a + T.cards.length, 0), labs: LABS.map(L => L.id), home: HOME.map(x => x.id), safety: HOME.filter(x => x.safety).length, kinds: [...kinds], bad,
        cycles: TOPICS.flatMap(T => T.quiz).filter(q => q.k === 'order' && q.cycle).length };
    });
    console.log(tag, `data: ${D.topics.length} topics, ${D.cards} cards, ${D.labs.length} labs, ${D.home.length} home experiments (${D.safety} with a grown-up), kinds ${D.kinds}, ${D.cycles} cycle orders`);
    if (D.topics.length < 10) fail(`${D.topics.length} topics`);
    for (const t of ['body', 'animals', 'cycles', 'plants', 'weather', 'space', 'water', 'materials', 'forces', 'light', 'sound', 'dinos', 'ocean', 'earth']) if (!D.topics.includes(t)) fail(`no topic ${t}`);
    if (D.labs.length < 5) fail(`${D.labs.length} labs`);
    if (D.home.length < 10 || D.safety < 4) fail(`${D.home.length} home experiments, ${D.safety} with safety notes`);
    for (const k of ['pic', 'tf', 'sort', 'order']) if (!D.kinds.includes(k)) fail(`no ${k} questions`);
    if (D.bad.length) fail('data: ' + D.bad.slice(0, 6).join('; '));
    if (home.topics !== D.topics.length || home.labs !== D.labs.length || home.homes !== D.home.length) fail(`home lists ${JSON.stringify(home)}`);

    // 3. Every card of every topic, and 1 star for reading them all.
    let st0 = await stars();
    for (const id of D.topics) {
      const n = await p.evaluate(id => window.__science.D().TOPICS.find(T => T.id === id).cards.length, id);
      for (let i = 0; i < n; i++) {
        await S('topic', id, i); await sleep(20);
        const c = await p.evaluate(() => ({ svg: !!document.querySelector('.sc-pic svg.sc-scene'), html: document.getElementById('view').innerHTML, fact: (document.querySelector('.sc-fact') || {}).textContent || '', h: (document.querySelector('.sc-ct h2') || {}).textContent || '' }));
        if (!c.svg || /NaN|undefined/.test(c.html) || !c.fact || !c.h) fail(`${id} card ${i} did not render (${c.h})`);
        if (i === 0 || id === 'space') await noScroll(`${id} card ${i}`);
        if (i === 1) { await p.click('#scDyk'); if (await p.$eval('#scDykT', e => e.hidden)) fail(`${id}: Did you know did not open`); }
      }
      if (id === 'body') { await check('topic card'); await shot('card'); }
      st0 = await expectStars(st0, 1, `${id} cards read`);
    }
    // Age scaling: the age-5 phone sees only the short fact, the age-10 tablet the extra and the science word.
    const txt = await p.evaluate(() => { const T = window.__science.D().TOPICS[0]; return { shown: window.__science.cardText(T.cards[0]), c: T.cards[0] }; });
    if (age <= 6 ? txt.shown !== txt.c.t : !(txt.shown.includes(txt.c.m) && txt.shown.includes(txt.c.b))) fail(`card text not scaled for age ${age}: ${txt.shown}`);

    // 4. Every quiz, played through the real screen.
    const answer = async (opts = {}) => {
      const q = await p.evaluate(() => { const c = window.__science.cur; return c && { i: c.i, k: c.q.k, a: c.q.a, items: c.q.items && c.q.items.map(x => x[2]), n: c.q.o ? c.q.o.length : 0 }; });
      if (!q) return null;
      if (q.k === 'pic') {
        if (opts.miss) { const wrong = (q.a + 1) % q.n; await p.click(`[data-o="${wrong}"]`); }
        await p.click(`[data-o="${q.a}"]`);
      } else if (q.k === 'tf') {
        if (opts.miss) await p.click(`[data-tf="${!q.a}"]`);
        await p.click(`[data-tf="${q.a}"]`);
      } else if (q.k === 'sort') {
        for (let i = 0; i < q.items.length; i++) {
          if (opts.miss && i === 0) { await drag(`.sc-tray [data-it="${i}"]`, `[data-bin="${1 - q.items[i]}"]`); if (!await p.$(`.sc-tray [data-it="${i}"]`)) fail('a wrongly sorted card left the tray'); }
          if (i % 2 && opts.tap) { await p.click(`.sc-tray [data-it="${i}"]`); await p.click(`[data-bin="${q.items[i]}"]`); }
          else await drag(`.sc-tray [data-it="${i}"]`, `[data-bin="${q.items[i]}"]`);
        }
      } else if (q.k === 'order') {
        const n = q.items.length;
        if (opts.miss) {
          // Wrong order first: swap the first two, check, the two come back to the tray.
          await drag(`.sc-tray [data-it="1"]`, `[data-slot="0"]`); await drag(`.sc-tray [data-it="0"]`, `[data-slot="1"]`);
          for (let k = 2; k < n; k++) await drag(`.sc-tray [data-it="${k}"]`, `[data-slot="${k}"]`);
          await p.click('#scChk'); await sleep(30);
          const back = await p.$$eval('.sc-tray .sc-chip', a => a.map(x => +x.dataset.it).sort());
          if (JSON.stringify(back) !== '[0,1]') fail(`wrong order: tray has ${back}`);
          // Moving a card between slots: put 0 in slot 1, then drag it from slot 1 to slot 0.
          await drag(`.sc-tray [data-it="0"]`, `[data-slot="1"]`); await drag(`[data-slot="1"] [data-it="0"]`, `[data-slot="0"]`);
          const s0 = await p.$eval('[data-slot="0"]', e => e.querySelector('[data-it]') && e.querySelector('[data-it]').dataset.it);
          if (s0 !== '0') fail(`drag between slots did not move the card (${s0})`);
          await drag(`.sc-tray [data-it="1"]`, `[data-slot="1"]`);
        } else for (let k = 0; k < n; k++) {
          if (opts.tap && k === n - 1) { await p.click(`.sc-tray [data-it="${k}"]`); await p.click(`[data-slot="${k}"]`); }
          else await drag(`.sc-tray [data-it="${k}"]`, `[data-slot="${k}"]`);
        }
        await p.click('#scChk');
      }
      await p.waitForFunction(i => { const c = window.__science.cur; return !c || c.i !== i; }, q.i, { timeout: 8000 }).catch(() => fail(`question ${q.i} (${q.k}) did not move on`));
      return q.k;
    };
    const playQuiz = async (id, opts = {}) => {
      await S('quiz', id); await sleep(30); const kinds = [];
      for (let i = 0; i < 5; i++) {
        if (i === 0 && opts.shotAt == null) { await noScroll(`${id} quiz`); }
        if (opts.shotAt != null && i === opts.shotAt) { await check(`${id} quiz q${i}`); await shot(`quiz-${id}`); }
        const k = await answer({ miss: opts.missAt === i, tap: opts.tap }); if (!k) break; kinds.push(k);
      }
      await p.waitForSelector('.sc-result', { timeout: 5000 }).catch(() => fail(`${id}: no result screen`));
      return kinds;
    };
    st0 = await stars();
    for (const id of D.topics) {
      const miss = id === 'cycles';
      const kinds = await playQuiz(id, { missAt: miss ? 0 : null, tap: tag === 'tablet', shotAt: id === 'materials' ? 0 : null });
      if (kinds.length !== 5) fail(`${id}: ${kinds.length} questions answered`);
      st0 = await expectStars(st0, miss ? 7 : 10, `${id} quiz${miss ? ' with a wrong order first' : ''}`);
      if (id === 'cycles') { const r = await p.textContent('.sc-result'); if (!/4 of 5/.test(r)) fail(`cycles result: ${r}`); await shot('result'); }
    }
    // a repeat gives 1
    await playQuiz('weather', {}); st0 = await expectStars(st0, 1, 'repeat quiz');
    // a missed pic question on another quiz: the wrong button is marked and an explanation shows
    const sci = await p.evaluate(() => window.__science.sc());
    if (Object.keys(sci.badges).length !== D.topics.length) fail(`${Object.keys(sci.badges).length} badges`);

    // 5. The mini-labs, each to success.
    const labDone = async (id, add) => { await p.waitForSelector('.sc-win', { timeout: 8000 }).catch(() => fail(`${id}: lab did not finish`)); st0 = await expectStars(st0, add, `${id} lab`); };
    // float or sink
    await S('labView', 'float'); await sleep(50); await check('float lab');
    const fItems = await p.evaluate(() => window.__science.lab.items.map(x => x[2]));
    if (fItems.length !== (age >= 7 ? 8 : 6)) fail(`float lab has ${fItems.length} things`);
    for (let k = 0; k < fItems.length; k++) {
      await p.click(`.sc-thing[data-k="${k}"]`); await p.click(`[data-g="${k === 0 ? 1 - fItems[k] : fItems[k]}"]`);
      if (k === 1) { await sleep(1300); const top = await p.$$eval('.sc-drop', a => a.map(x => x.classList.contains('floats') ? 'f' : 's')); if (top.join('') !== fItems.slice(0, 2).map(v => v ? 'f' : 's').join('')) fail(`float drops ${top}`); await shot('float'); }
    }
    await labDone('float', 3);
    if (!/guesses right/.test(await p.textContent('.sc-win'))) fail('float lab win text');
    // magnet: drag the magnet onto the first thing, tap the rest
    await S('labView', 'magnet'); await sleep(50); await check('magnet lab');
    const mItems = await p.evaluate(() => window.__science.lab.items.map(x => x[2]));
    await drag('#scMag', '.sc-mt[data-k="0"]');
    if (!(await p.$eval('.sc-mt[data-k="0"]', e => e.disabled))) fail('dragging the magnet did not test the thing');
    for (let k = 1; k < mItems.length; k++) await p.click(`.sc-mt[data-k="${k}"]`);
    const res = await p.evaluate(() => [document.querySelectorAll('#scYes i').length, document.querySelectorAll('#scNo i').length]);
    if (res[0] !== mItems.filter(Boolean).length || res[1] !== mItems.filter(x => !x).length) fail(`magnet results ${res}`);
    await shot('magnet'); await labDone('magnet', 3);
    // plant: an extra water first (no growth), then water and sun 5 times
    await S('labView', 'plant'); await sleep(50); await check('plant lab');
    await p.click('#scW'); await p.click('#scW');
    if (await p.evaluate(() => window.__science.lab.stage) !== 0) fail('plant grew with water only');
    await p.click('#scS');
    for (let i = 1; i < 5; i++) { await p.click('#scW'); await p.click('#scS'); }
    if (await p.evaluate(() => window.__science.lab.stage) !== 5) fail('plant did not reach the flower');
    await shot('plant'); await labDone('plant', 3);
    // weather: shorts on a snowy-style mistake first (a coat on the sunny day), then the right clothes each day
    await S('labView', 'weather'); await sleep(50); await check('weather lab');
    const days = await p.evaluate(() => window.__science.D().LABS.find(L => L.id === 'weather').days.map(d => d.need));
    await p.click('[data-c="4"]'); await p.click('#scWChk');
    if (await p.evaluate(() => window.__science.lab.round) !== 0) fail('a coat on a sunny day was accepted');
    await p.click('[data-c="4"]');
    for (const need of days) { for (const k of need) await p.click(`[data-c="${k}"]`); await p.click('#scWChk'); }
    await labDone('weather', 3);
    // shadow: move the sun with the buttons and by dragging it
    await S('labView', 'shadow'); await sleep(50); await check('shadow lab');
    const L = () => p.evaluate(() => ({ ch: window.__science.lab.challenge, dx: window.__science.lab.dx, p: window.__science.lab.p }));
    const before = await L();
    for (let i = 0; i < 3; i++) await p.click('#scSR');
    let s1 = await L(); if (s1.ch !== 1) fail(`shadow challenge 1 not done ${JSON.stringify(s1)}`);
    if (!(before.dx > 75 && Math.abs(s1.dx) < 30)) fail(`shadow did not shorten as the sun rose ${before.dx} → ${s1.dx}`);
    // drag the sun to the right
    const svgBox = await p.locator('#scSh').boundingBox();
    const sunAt = async pp => { const sx = 30 + 240 * pp, sy = 76 - 62 * Math.sin(Math.PI * pp); return [svgBox.x + sx / 300 * svgBox.width, svgBox.y + sy / 180 * svgBox.height]; };
    const a0 = await sunAt(0.5), a1 = await sunAt(0.85);
    await p.mouse.move(...a0); await p.mouse.down(); for (let i = 1; i <= 8; i++) await p.mouse.move(a0[0] + (a1[0] - a0[0]) * i / 8, a0[1] + (a1[1] - a0[1]) * i / 8); await p.mouse.up(); await sleep(50);
    s1 = await L(); if (s1.ch !== 2 || !(s1.dx < -75)) fail(`dragging the sun right did not make a long left shadow ${JSON.stringify(s1)}`);
    await shot('shadow');
    for (let i = 0; i < 6; i++) await p.click('#scSL');
    await labDone('shadow', 3);
    await p.click('#scSP'); await sleep(500);
    if ((await L()).p !== 1) fail('Play the day did not move the sun across');
    // planets: drag into order
    await S('labView', 'planets'); await sleep(50); await check('planet lab');
    const np = await p.evaluate(() => window.__science.lab.n);
    if (np !== (age >= 7 ? 8 : 4)) fail(`${np} planets for age ${age}`);
    for (let k = 0; k < np; k++) await drag(`.sc-tray [data-it="${k}"]`, `[data-slot="${k}"]`);
    await shot('planets'); await p.click('#scChk');
    await labDone('planets', 3);
    // a repeat lab gives 1
    await p.click('#scLabAgain'); await sleep(50);
    for (let k = 0; k < np; k++) await drag(`.sc-tray [data-it="${k}"]`, `[data-slot="${k}"]`);
    await p.click('#scChk'); await labDone('planets again', 1);
    if (await p.evaluate(() => Object.keys(window.__science.sc().labs).length) !== D.labs.length) fail('not every lab recorded');

    // 6. Try at home.
    for (const id of D.home) {
      await S('exp', id); await sleep(20);
      const e = await p.evaluate(id => { const x = window.__science.D().HOME.find(h => h.id === id); return { safety: !!x.safety, box: !!document.querySelector('.sc-safe'), need: document.querySelectorAll('.sc-need span').length, steps: document.querySelectorAll('.sc-steps li').length, svg: !!document.querySelector('.sc-pic svg') }; }, id);
      if (e.safety !== e.box || !e.need || e.steps < 3 || !e.svg) fail(`try at home ${id}: ${JSON.stringify(e)}`);
      if (id === 'volcano') { await check('try at home'); await shot('volcano'); }
      await noScroll(id);
      await p.click('#scTried'); st0 = await expectStars(st0, 2, `${id} tried`);
      await p.click('#scTried'); st0 = await expectStars(st0, 0, `${id} tried again`);
    }

    // 7. The grown-ups' report and What's inside.
    const R = await p.evaluate(() => window.__report.stats(window.__owl.pid).Sc);
    if (R.read !== D.topics.length || R.badges !== D.topics.length || R.labs !== D.labs.length || R.home !== D.home.length || R.quizzes !== D.topics.length + 1) fail(`report ${JSON.stringify(R)}`);
    await p.evaluate(() => { window.__owl.go(() => { document.getElementById('view').innerHTML = window.__report.panel(); window.__report.wire(); }); });
    const card = await p.evaluate(() => { const c = document.querySelector('.rp-sci'); return c && c.textContent.replace(/\s+/g, ' '); });
    if (!card || !/Topic badges won/.test(card)) fail(`no science card in the report: ${card}`);
    await noScroll('report');
    await p.evaluate(() => window.__tour.inside()); await sleep(50);
    const ins = (await p.evaluate(() => document.getElementById('view').innerText)).replace(/\s+/g, ' ');
    if (!ins.includes(`${D.topics.length} science topics`) || !/Science & Nature/.test(ins) || !ins.includes(`${D.home.length} experiments to try at home`)) fail("What's inside has no science");
    await noScroll("What's inside");

    // 8. Saved after a reload.
    const keep = await stars();
    await p.reload(); await p.waitForFunction(() => window.__owl && window.__science);
    const after = await p.evaluate(() => ({ stars: window.__owl.st.stars, b: Object.keys((window.__owl.st.science || {}).badges || {}).length, h: Object.keys((window.__owl.st.science || {}).home || {}).length }));
    if (after.stars !== keep || after.b !== D.topics.length || after.h !== D.home.length) fail(`after reload ${JSON.stringify(after)}`);
    await p.click('#tScience'); await sleep(100);
    if ((await p.$$('.sc-bdg.on')).length !== D.topics.length) fail('badge shelf after reload');
    await shot('home-after');
    console.log(tag, `stars ${keep}, badges ${after.b}, home experiments ${after.h}, said ${await p.evaluate(() => window.__said.length)}`);
    await ctx.close();
  }
  await b.close();
  console.log('errors', errs.length ? errs.join('\n') : 'none');
  console.log('fails', fails.length ? fails.join('\n') : 'none');
})();
