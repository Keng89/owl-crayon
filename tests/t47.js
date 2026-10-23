// Learn to Read (src/english11.js, english11.css): the step-by-step daily reading path in English & Reading, on a phone
// (390x844, speech, age 5) and a tablet (820x1180, no speech at all, age 5). Checks the data: 60+ lessons in units, and
// over every lesson that the blend words and the 2-3 sentences (and grammar choices) can be read with the sounds and
// tricky words taught so far, re-checked here with the test's own list of taught spellings; every lesson has a grown-up
// tip and every sound a check-up picture word. The "📖 Today's reading lesson" button sits at the top of the English
// home (and the 20 section tiles stay); lesson 1 (s a t) and lesson 25 (x) are played end to end through the real
// buttons (review cards, new sound, blend, read, finger-tracing on the Write letters pad, the 3-round game) for exactly
// 5 stars, a replay of lesson 1 for 1; weak sounds come first in the review; a wrong game answer goes to Owl's review;
// the placement check (units 1-2 right, unit 3 wrong) starts the path at lesson 11 with lessons 1-10 marked known (+2);
// a unit 1 check-up with 2 misses gives 1 star and puts both missed sounds in the weak list and their words in Owl's
// review; the grown-ups' report shows "Reading path: lesson N of M · sounds known"; progress survives a reload; no
// sideways scroll, 44px labeled buttons. Prints "errors none" and "fails none" when clean. Takes PORT (default 8766).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errs = [], fails = [];

(async () => {
  const b = await chromium.launch();
  for (const [w, h, tag, noSpeech] of [[390, 844, 'phone', false], [820, 1180, 'tablet', true]]) {
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
    const shot = async name => { await sleep(200); await p.screenshot({ path: `${SHOTS}/path-${tag}-${name}.png`, fullPage: true }); };
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (o > 1) fail(`sideways scroll ${o}px at ${where}`); };
    const bigEnough = async where => {
      const small = await p.evaluate(() => [...document.querySelectorAll('#view button')].filter(b => b.offsetParent && !b.disabled).map(b => { const r = b.getBoundingClientRect(); return [b.id || b.className, Math.round(r.width), Math.round(r.height), (b.textContent.trim() || b.getAttribute('aria-label') || '').slice(0, 14)]; }).filter(x => x[1] < 44 || x[2] < 44 || !x[3]));
      if (small.length) fail(`${where}: small or unlabeled buttons ${JSON.stringify(small.slice(0, 4))}`);
    };
    const check = async where => { await noScroll(where); await bigEnough(where); };
    const stars = () => p.evaluate(() => window.__owl.st.stars);
    const en = (v, ...a) => p.evaluate(([v, a]) => window.__english.go(v, ...a), [v, a]);
    const gained = async (label, s0, want) => { const s1 = await stars(); if (s1 - s0 !== want) fail(`${label}: ${s1 - s0} stars, want ${want}`); return s1; };
    const traceIt = async () => {
      await p.evaluate(() => document.getElementById('tPad').scrollIntoView({ block: 'center' })); await sleep(150);
      const strokes = await p.evaluate(() => { const svg = document.getElementById('tPad'), m = svg.getScreenCTM();
        return window.__english.TR.strokes.map(s => s.pts.map(([x, y]) => { const q = svg.createSVGPoint(); q.x = x; q.y = y; const r = q.matrixTransform(m); return [r.x, r.y]; })); });
      for (const pts of strokes) { await p.mouse.move(pts[0][0], pts[0][1]); await p.mouse.down(); for (const q of pts.slice(1)) await p.mouse.move(q[0], q[1]); await p.mouse.up(); await sleep(40); }
    };
    const setPath = path => p.evaluate(path => { window.__english.E().path = path; }, path);

    await p.goto(`http://localhost:${PORT}/index.html?r=${Date.now()}#selftest`);
    await p.evaluate(() => localStorage.clear()); await p.reload();
    await p.waitForFunction(() => window.__owl && window.__english && window.__english.PATH && document.getElementById('tEnglish'));
    await p.evaluate(() => { const s = window.__owl.st; s.age = 5; s.stars = 0; s.unlockAll = false; });

    // 1. The data, over every lesson.
    const D = await p.evaluate(() => {
      const X = window.__english.PATH, bad = [], { G, LESSONS, UNITS } = X;
      // The test's own taught set: the spellings of every sound up to the lesson, doubled consonants after their letter.
      const taught = new Set(), tricky = new Set();
      const ok = (w, li) => { const lw = w.toLowerCase(); if (tricky.has(lw)) return true; if (X.IRREG.has(lw)) return false; const seg = X.segment(lw); return !!seg && seg.every(s => taught.has(s)); };
      LESSONS.forEach((L, li) => {
        L.g.forEach(k => { taught.add(G[k].sp); if (G[k].sp.length === 1) ['bb', 'dd', 'gg', 'mm', 'nn', 'pp', 'rr', 'tt'].filter(d => d[0] === k).forEach(d => taught.add(d)); });
        L.tw.forEach(t => tricky.add(t.toLowerCase()));
        if (L.words.length < 3) bad.push(`${L.id}: ${L.words.length} blend words`);
        for (const x of L.words) { if (!ok(x.w, li)) bad.push(`${L.id}: blend word ${x.w}`); if (!X.decodable(x.w, li)) bad.push(`${L.id}: app says ${x.w} is not decodable`); if (!L.g.some(k => X.segment(x.w).includes(G[k].sp))) bad.push(`${L.id}: ${x.w} lacks the new sound`); }
        if (L.sents.length < 2 || L.sents.length > 3) bad.push(`${L.id}: ${L.sents.length} sentences`);
        for (const s of L.sents.concat(L.gp ? [L.gp.a, L.gp.b] : [])) for (const w of X.wordsOf(s)) if (!ok(w, li)) bad.push(`${L.id}: "${w}" in "${s}"`);
        const t = window.__english.tipFor(L); if (!t.say || !t.how || !t.blend || !t.home) bad.push(`${L.id}: tip incomplete`);
        if (!window.__english.games(L).length) bad.push(`${L.id}: no game`);
      });
      for (const U of UNITS) for (const k of U.g) if (!X.picFor(k, U.last)) bad.push(`${U.id}: no check-up word for ${k}`);
      // A spot check of the checker itself: "ship" is not readable before sh, "the" only as a tricky word.
      if (X.decodable('ship', 20) || !X.decodable('ship', 31) || X.decodable('cake', 40) || !X.decodable('cake', 49) || X.soundOK('the', 60)) bad.push('the decoder is wrong on ship/cake/the');
      return { lessons: LESSONS.length, units: UNITS.length, sounds: Object.keys(G).length, words: LESSONS.reduce((a, L) => a + L.words.length, 0), sents: LESSONS.reduce((a, L) => a + L.sents.length, 0), audit: X.audit(), bad,
        info: window.__english.info(), first: LESSONS[0].g.join(' '), l25: LESSONS[24].g.join(' ') };
    });
    console.log(tag, `data: ${D.lessons} lessons in ${D.units} units, ${D.sounds} sounds, ${D.words} blend words, ${D.sents} sentences; lesson 1 = ${D.first}, lesson 25 = ${D.l25}`);
    if (D.lessons < 60) fail(`${D.lessons} lessons`);
    if (D.units < 8) fail(`${D.units} units`);
    if (D.bad.length) fail('data: ' + D.bad.slice(0, 8).join('; '));
    if (D.audit.length) fail('audit: ' + D.audit.slice(0, 8).join('; '));
    if (D.info.pathLessons !== D.lessons || !D.info.pathSounds) fail(`info ${JSON.stringify([D.info.pathLessons, D.info.pathSounds])}`);
    if (D.first !== 's a t' || D.l25 !== 'x') fail(`lesson order ${D.first} / ${D.l25}`);

    // 2. The English home: the big button at the top, the tiles unchanged.
    await p.evaluate(() => window.__owl.go(window.__owl.home)); await p.click('#tEnglish'); await p.waitForSelector('.en-secs');
    const homeB = await p.evaluate(() => { const b = document.getElementById('enPath'), l = document.querySelector('.en-ladder'); return b && { txt: b.textContent, above: b.getBoundingClientRect().top < l.getBoundingClientRect().top, secs: document.querySelectorAll('[data-sec]').length, h: b.getBoundingClientRect().height }; });
    if (!homeB) fail('no Today\'s reading lesson button'); else {
      if (!/Today's reading lesson/.test(homeB.txt) || !/Lesson 1 of/.test(homeB.txt)) fail(`button text ${homeB.txt}`);
      if (!homeB.above) fail('the reading lesson button is not at the top');
      if (homeB.secs !== 20) fail(`${homeB.secs} section tiles`);
      if (homeB.h < 64) fail(`button height ${homeB.h}`);
    }
    await check('english home'); await shot('home');

    // 3. Lesson 1 end to end.
    const playLesson = async (label, opts = {}) => {
      const s0 = await stars(), n = await p.evaluate(() => window.__english.LS.L.n);
      // review
      await p.waitForSelector('#rvYes, #lsNext');
      const reviews = await p.evaluate(() => window.__english.LS.review.slice());
      if (opts.firstReview && reviews[0] !== opts.firstReview) fail(`${label}: review starts with ${reviews[0]}, want the weak ${opts.firstReview}`);
      if (!reviews.length) { await check(`${label} hello`); await p.click('#lsNext'); }
      for (let i = 0; i < reviews.length; i++) {
        await p.waitForFunction(i => document.querySelectorAll('.progress i')[i] && document.querySelectorAll('.progress i')[i].classList.contains('now') && document.getElementById('rvYes'), i);
        if (i === 0) { await p.click('#rvCard'); if (!(await p.$('.e11-flash.flip'))) fail(`${label}: card did not flip`); await check(`${label} review`); await shot(`L${n}-review`); }
        await p.click('#rvYes');
      }
      // new sound(s)
      const gs = await p.evaluate(() => window.__english.LS.L.g.map(k => window.__english.PATH.G[k]));
      for (let i = 0; i < gs.length; i++) {
        await p.waitForFunction(sp => document.querySelector('.e11-gr') && document.querySelector('.e11-gr').textContent === sp, gs[i].show);
        const says = await p.textContent('.e11-says'); if (!says.includes(gs[i].snd)) fail(`${label}: the sound text "${gs[i].snd}" is not shown (${says})`);
        if (!(await p.textContent('.e11-howto')).includes(gs[i].chant)) fail(`${label}: no chant text`);
        if (i === 0) { await p.click('#snHear'); await p.click('#snChant'); await check(`${label} sound`); await shot(`L${n}-sound`); }
        await p.click('#lsNext');
      }
      // blend
      const words = await p.evaluate(() => window.__english.LS.L.words.map(x => x.w));
      for (let i = 0; i < words.length; i++) {
        await p.waitForFunction(w => document.getElementById('blWord') && document.getElementById('blWord').textContent === w, words[i]);
        if (i === 0) { for (const sb of await p.$$('[data-sb]')) await sb.click(); await check(`${label} blend`); }
        await p.click('#blGo'); await p.waitForFunction(w => document.getElementById('blShow').textContent.includes(w), words[i]);
        if (i === 0) await shot(`L${n}-blend`);
        await p.click('#blGo');
      }
      // read
      const sents = await p.evaluate(() => window.__english.LS.L.sents);
      for (let i = 0; i < sents.length; i++) {
        await p.waitForFunction(s => document.getElementById('rdS') && document.getElementById('rdS').textContent.replace(/\s+/g, ' ').trim() === s, sents[i]);
        if (i === 0) { await p.click('#rdHear'); await check(`${label} read`); await shot(`L${n}-read`); }
        await p.click('#rdDone'); await p.waitForFunction(() => document.getElementById('rdDone').dataset.done); await p.click('#rdDone');
      }
      // write: trace on the Write letters pad (no stars from the pad itself)
      await p.waitForSelector('#tPad'); await sleep(150);
      if (!(await p.$('.e11-steps'))) fail(`${label}: no step strip on the write step`);
      await check(`${label} write`);
      const sw = await stars(); await traceIt(); await sleep(250);
      if (!(await p.evaluate(() => window.__english.TR.done))) fail(`${label}: a careful trace was not accepted`);
      if ((await stars()) !== sw) fail(`${label}: the tracing pad gave stars inside a lesson`);
      await shot(`L${n}-write`);
      await p.waitForSelector('#lsNext'); await p.click('#lsNext');
      // game: 3 rounds
      let missed = null;
      for (let r = 0; r < 3; r++) {
        await p.waitForFunction(r => window.__english.LS.gi === r && (document.querySelector('.e11-tile:not([disabled])') || document.querySelector('[data-ch]:not([disabled])')), r, { timeout: 8000 });
        const R = await p.evaluate(() => { const R = window.__english.LS.cur; return { t: R.t, sp: R.g && R.g.sp, tiles: R.tiles, answer: R.answer, vals: R.choices && R.choices.map(c => c.val) }; });
        if (r === 0) { await check(`${label} game`); await shot(`L${n}-game`); }
        if (R.t === 'spot') {
          const wrong = R.tiles.findIndex(t => t !== R.sp); if (wrong >= 0) await p.click(`[data-sp="${wrong}"]`);
          for (let j = 0; j < R.tiles.length; j++) if (R.tiles[j] === R.sp) await p.click(`[data-sp="${j}"]`);
        } else {
          if (opts.missPic && R.t === 'pic' && !missed) { const j = R.vals.findIndex(v => v !== R.answer); missed = R.answer; await p.click(`[data-ch="${j}"]`); await sleep(80); }
          await p.click(`[data-ch="${R.vals.indexOf(R.answer)}"]`);
        }
      }
      await p.waitForSelector('.e11-done', { timeout: 8000 });
      await check(`${label} done`); await shot(`L${n}-done`);
      await gained(label, s0, opts.stars);
      return missed;
    };
    await p.click('#enPath'); await p.waitForSelector('#lsStart');
    if (!(await p.$('.e11-tip'))) fail('lesson 1 has no grown-up tip card');
    await check('lesson 1 intro'); await shot('L1-intro');
    await p.click('#lsStart');
    await playLesson('lesson 1', { stars: 5 });
    if (!(await p.evaluate(() => !!window.__english.P().done.L1))) fail('lesson 1 not saved as done');
    if (!/Lesson 2/.test(await p.textContent('#dnNext'))) fail('no next lesson button');
    // the replay gives 1 (phone only, to keep the run short)
    if (tag === 'phone') { await en('lesson', 0); await p.waitForSelector('#lsStart'); await p.click('#lsStart'); await playLesson('lesson 1 again', { stars: 1 }); }

    // 4. The path map after lesson 1.
    await en('path'); await p.waitForSelector('.e11-stone');
    const map = await p.evaluate(() => ({ stones: document.querySelectorAll('.e11-stone').length, done: document.querySelectorAll('.e11-stone.done').length, now: document.querySelector('.e11-stone.now').getAttribute('aria-label'), locked: document.querySelectorAll('.e11-stone.locked').length, head: document.querySelector('.e11-head').textContent }));
    if (map.stones !== D.lessons + D.units || map.done !== 1 || !/Lesson 2/.test(map.now)) fail(`path map ${JSON.stringify(map)}`);
    if (!/Lesson 2 of/.test(map.head) || !/3 of \d+ sounds known/.test(map.head)) fail(`path head ${map.head}`);
    await check('path'); await shot('path');
    await p.click('.e11-stone.locked'); await sleep(100);
    if (await p.$('#lsStart')) fail('a locked stone opened a lesson');

    // 5. Lesson 25 end to end, with a weak sound and a missed picture.
    await p.evaluate(() => { const P = window.__english.P(), today = new Date().toISOString().slice(0, 10);
      window.__english.PATH.LESSONS.slice(0, 24).forEach(L => { P.done[L.id] = { d: today, n: 1 }; }); ['U1', 'U2', 'U3'].forEach(u => { P.checks[u] = { d: today, best: 6, of: 6, pass: true, n: 1 }; }); P.weak = { h: 2 }; });
    await en('home'); await p.waitForSelector('#enPath');
    if (!/Lesson 25/.test(await p.textContent('#enPath'))) fail(`home button does not point at lesson 25: ${await p.textContent('#enPath')}`);
    await p.click('#enPath'); await p.waitForSelector('#lsStart'); await p.click('#lsStart');
    const missed = await playLesson('lesson 25', { stars: 5, firstReview: 'h', missPic: true });
    const rv = await p.evaluate(m => m && window.__english.E().review[m.toLowerCase()], missed);
    if (missed && !rv) fail(`the missed picture word ${missed} is not in Owl's review`);
    if (!missed) fail('lesson 25 had no picture round');

    // 6. Placement check: units 1 and 2 right, unit 3 wrong → start at lesson 11.
    await setPath({}); let s0 = await stars();
    await en('path'); await p.waitForSelector('#pPlace'); await p.click('#pPlace'); await p.waitForSelector('#plGo'); await check('placement intro'); await p.click('#plGo');
    let asked = 0;
    for (let guard = 0; guard < 40; guard++) {
      await p.waitForFunction(() => document.querySelector('.e11-done') || document.querySelector('[data-ck]:not([disabled])'), null, { timeout: 8000 });
      if (await p.$('.e11-done')) break;
      const Q = await p.evaluate(() => { const PL = window.__english.PL, Q = PL.qs[PL.i]; return { u: PL.u, i: PL.i, j: Q.choices.findIndex(c => c.w === Q.w) }; });
      if (asked === 0) { await check('placement question'); await shot('placement'); }
      const j = Q.u < 2 ? Q.j : (Q.j + 1) % 3;
      await p.click(`[data-ck="${j}"]`); asked++;
      await p.waitForFunction(([u, i]) => { const PL = window.__english.PL; return document.querySelector('.e11-done') || PL.u !== u || PL.i !== i; }, [Q.u, Q.i], { timeout: 8000 });
    }
    const pl = await p.evaluate(() => { const P = window.__english.P(), N = window.__english.curNode(); return { cur: N && N.t === 'L' ? N.L.n : null, done: Object.keys(P.done).length, checks: Object.keys(P.checks), placed: P.placed }; });
    if (pl.cur !== 11 || pl.done !== 10 || pl.checks.join() !== 'U1,U2' || pl.placed !== 2) fail(`placement ${JSON.stringify(pl)} after ${asked} words`);
    if (asked !== 12) fail(`placement asked ${asked} words, want 12`);
    s0 = await gained('placement', s0, 2);
    if (!/lesson 11/i.test(await p.textContent('.e11-done'))) fail('placement result does not name lesson 11');
    await check('placement result'); await shot('placement-done');

    // 7. Unit 1 check-up with 2 misses: 1 star, missed sounds go to the weak list and Owl's review.
    await setPath({ done: { L1: { n: 1 }, L2: { n: 1 }, L3: { n: 1 }, L4: { n: 1 } } }); await p.evaluate(() => { window.__english.E().review = {}; });
    await en('path'); await p.waitForSelector('#pTodayBtn');
    if (!/check-up/i.test(await p.textContent('#pTodayBtn'))) fail('the unit 1 check-up is not today\'s stone');
    await p.click('#pTodayBtn'); await p.waitForSelector('#ckGo'); await check('check-up intro'); await p.click('#ckGo');
    s0 = await stars(); const missK = [];
    for (let guard = 0; guard < 20; guard++) {
      await p.waitForFunction(() => document.querySelector('.e11-done') || document.querySelector('[data-ck]:not([disabled])'), null, { timeout: 8000 });
      if (await p.$('.e11-done')) break;
      const Q = await p.evaluate(() => { const C = window.__english.CK, Q = C.qs[C.i]; return { i: C.i, k: Q.k, w: Q.w, j: Q.choices.findIndex(c => c.w === Q.w) }; });
      const miss = Q.i < 2; if (miss) missK.push(Q);
      await p.click(`[data-ck="${miss ? (Q.j + 1) % 3 : Q.j}"]`);
      await p.waitForFunction(i => document.querySelector('.e11-done') || window.__english.CK.i !== i, Q.i, { timeout: 8000 });
    }
    s0 = await gained('check-up with 2 misses', s0, 1);
    const ck = await p.evaluate(() => { const P = window.__english.P(), E = window.__english.E(); return { weak: P.weak, review: Object.keys(E.review), check: P.checks.U1, cur: window.__english.curNode().L.n }; });
    for (const Q of missK) { if (!(ck.weak[Q.k] >= 1)) fail(`missed sound ${Q.k} not in the weak list`); if (!ck.review.includes(Q.w.toLowerCase())) fail(`missed word ${Q.w} not in Owl's review`); }
    if (!ck.check || ck.check.pass || ck.check.of !== 6 || ck.check.last !== 4) fail(`check-up record ${JSON.stringify(ck.check)}`);
    if (ck.cur !== 5) fail(`after the check-up the path is at lesson ${ck.cur}`);
    if (!(await p.textContent('.e11-miss')).includes(missK[0].k)) fail('the result does not list the sounds to practise');
    await check('check-up result'); await shot('checkup-done');
    await en('mywords'); await p.waitForSelector('#mwRev');
    if (!/to practice now/.test(await p.textContent('#mwRev'))) fail('Owl\'s review has nothing due after the check-up');
    // the next lesson's review starts with the missed sounds
    await en('lesson', 4); await p.waitForSelector('#lsStart'); await p.click('#lsStart'); await p.waitForSelector('#rvYes');
    const rv5 = await p.evaluate(() => window.__english.LS.review.slice(0, 2));
    if (!missK.every(Q => rv5.includes(Q.k))) fail(`lesson 5 review ${rv5} does not start with the missed sounds ${missK.map(q => q.k)}`);

    // 8. The grown-ups' report and a reload.
    const R = await p.evaluate(() => { const html = window.__report.panel(); return { path: window.__report.stats(window.__report.shown).E.path, html }; });
    if (R.path.done !== 4 || R.path.now !== 5 || R.path.all !== D.lessons || R.path.sounds !== 6 || !R.path.soundsAll) fail(`report path ${JSON.stringify(R.path)}`);
    if (!/Reading path/.test(R.html) || !new RegExp(`lesson 5 of ${D.lessons} · 6 of \\d+ sounds known`).test(R.html)) fail('report lacks "Reading path: lesson 5 of M · sounds known"');
    const before = await p.evaluate(() => JSON.stringify(window.__english.P()));
    await p.reload(); await p.waitForFunction(() => window.__owl && window.__english && window.__english.P);
    const after = await p.evaluate(() => JSON.stringify(window.__english.P()));
    if (before !== after) fail('reading path progress changed after a reload');
    // a damaged save still renders
    await setPath('oops'); await en('path'); await p.waitForSelector('.e11-stone'); await setPath({ done: 7, checks: [1], weak: 'x', days: 3 }); await en('home'); await p.waitForSelector('#enPath');
    await p.evaluate(() => window.__report.panel());
  }
  await b.close();
  console.log('errors', errs.length ? errs.join('\n') : 'none');
  console.log('fails', fails.length ? fails.join('\n') : 'none');
})();
