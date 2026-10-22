// English & Reading, round 3 (src/english6.js, english7.js data; english8.js screens): the five new sections (Write
// letters, Sound games, Talk time, Chapter books, Grammar islands) and the daily English mission. Checks the data
// (52 letter shapes, 12+ chapter books with 5 kinds of questions and tap-for-meaning words, 30+ phrase cards, 10 chats
// with exactly one good reply per turn, sound and island question makers at every stage); every new section renders
// with a grown-up tip, no sideways scroll and big labeled buttons; a careful finger trace of "a" is accepted (2 stars,
// then 1 on a repeat) and of the word "cat" (3 stars), while a scribble over "A" is refused with no star; full rounds
// with exact stars of count the sounds (12), first/middle/last with one miss (11), change a sound (12), clap the beats
// with one miss (9), a Talk time chat with one miss (7) and its meaning cards, the phrase quiz (12), a chapter book
// (3 chapter stars + 10 = 13) with a vocabulary pop-up, grammar islands in order (badge round 13, the next island
// opens; a 2-of-5 round gives 7 and no badge); the mission prize (+3) and the quest's English job; the grown-ups'
// report counts; everything kept after a reload. Phone with speech, tablet without.
// Prints "errors none" and "fails none" when clean. Takes PORT (default 8766). Screenshots go to SHOTS.
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
    const shot = async name => { await sleep(250); await p.screenshot({ path: `${SHOTS}/english3-${tag}-${name}.png`, fullPage: true }); };
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (o > 1) fail(`sideways scroll ${o}px at ${where}`); };
    const bigEnough = async where => {
      const small = await p.evaluate(() => [...document.querySelectorAll('#view button')].filter(b => b.offsetParent && !b.disabled).map(b => { const r = b.getBoundingClientRect(); return [b.id || b.className, Math.round(r.width), Math.round(r.height), (b.textContent.trim() || b.getAttribute('aria-label') || '').slice(0, 14)]; }).filter(x => x[1] < 44 || x[2] < 44 || !x[3]));
      if (small.length) fail(`${where}: small or unlabeled buttons ${JSON.stringify(small.slice(0, 4))}`);
    };
    const check = async where => { await noScroll(where); await bigEnough(where); };
    const stars = () => p.evaluate(() => window.__owl.st.stars);
    const en = (v, ...a) => p.evaluate(([v, a]) => window.__english.go(v, ...a), [v, a]);
    const answer = async (right = true) => {
      const i = await p.evaluate(r => { const q = window.__english.q; return q.choices.findIndex(c => (String(c.val) === String(q.answer)) === r); }, right);
      await p.click(`.en-q .choice[data-i="${i}"]`);
    };
    const nextQ = n => p.waitForFunction(n => window.__english.Q && window.__english.Q.i === n && document.querySelector('.en-q .choice:not([disabled])'), n, { timeout: 6000 });
    // Answer a whole quiz round; "miss" lists the questions to get wrong once first.
    const round = async (n, miss = [], endSel = '.en-reward') => {
      for (let i = 0; i < n; i++) { await nextQ(i); if (miss.includes(i)) { await answer(false); await sleep(60); } await answer(true); }
      await p.waitForSelector(endSel, { timeout: 6000 });
    };
    const gained = async (label, s0, want) => { const s1 = await stars(); if (s1 - s0 !== want) fail(`${label}: ${s1 - s0} stars, want ${want}`); return s1; };

    await p.goto(`http://localhost:${PORT}/index.html?r=${Date.now()}#selftest`);
    await p.evaluate(() => localStorage.clear()); await p.reload();
    await p.waitForFunction(() => window.__owl && window.__english && window.__english.R3);
    await p.evaluate(() => { const s = window.__owl.st; s.age = 5; s.stars = 0; s.unlockAll = false; });

    // 1. Data.
    const data = await p.evaluate(() => {
      const E = window.__english, D = E.data, out = [], info = E.info();
      if (Object.keys(D.EN_ABC).length !== 52) out.push(`${Object.keys(D.EN_ABC).length} letter shapes`);
      for (const k of Object.keys(D.EN_ABC)) { const L = E.layout(k, 'L'); if (!L.strokes.length || L.strokes.some(s => !/^M[\d. LC-]+$/.test(s.d))) out.push(`bad letter ${k}`); }
      for (const [w] of D.EN_TRACE_WORDS) if (w.split('').some(c => !D.EN_ABC[c])) out.push(`word ${w} has a letter with no shape`);
      if (D.EN_BOOKS.length < 12) out.push(`${D.EN_BOOKS.length} books`);
      for (const s of [3, 4, 5]) if (D.EN_BOOKS.filter(b => b.stage === s).length < 4) out.push(`stage ${s} has few books`);
      for (const B of D.EN_BOOKS) {
        if (B.chapters.length < 3 || B.chapters.some(c => c[1].length < 3)) out.push(`short book ${B.id}`);
        const kinds = B.qs.map(q => q[0]).sort().join(); if (kinds !== 'feel,what,where,who,why') out.push(`book ${B.id} question kinds ${kinds}`);
        if (B.qs.some(q => new Set(q.slice(2)).size !== 3)) out.push(`book ${B.id} has a repeated answer`);
        const text = B.chapters.flatMap(c => c[1].map(p => p[1])).join(' ').toLowerCase().replace(/[^\w\s'-]/g, ' ').split(/\s+/);
        for (const w of Object.keys(B.words)) if (!text.includes(w)) out.push(`book ${B.id}: "${w}" is not in the text`);
        if (Object.keys(B.words).length < 8) out.push(`book ${B.id} has few words`);
      }
      if (D.EN_PHRASES.length < 30 || D.EN_PHRASES.filter(p => p[5] === 'slang').length < 12) out.push('few phrases or slang');
      if (D.EN_TALK.length < 10) out.push(`${D.EN_TALK.length} chats`);
      const ph = new Set(D.EN_PHRASES.map(p => p[0]));
      for (const S of D.EN_TALK) for (const t of S.turns) { if (t[1].length !== 3 || t[1].filter(r => r[1]).length !== 1) out.push(`${S.id}: a turn without exactly one good reply`); if (t[3] && !ph.has(t[3])) out.push(`${S.id}: unknown card ${t[3]}`); }
      if (E.PAIRS.length < 60) out.push(`${E.PAIRS.length} change pairs`);
      if (E.ISLANDS.length !== 9) out.push(`${E.ISLANDS.length} islands`);
      if (info.books !== D.EN_BOOKS.length || info.letters !== 52 || info.islands !== 9) out.push(`info ${JSON.stringify(info)}`);
      const xp = { 1: 0, 2: 25, 3: 70, 4: 140, 5: 240 }, ok = q => { const v = q.choices.map(c => String(c.val)); return v.includes(String(q.answer)) && new Set(v).size === v.length && v.length >= 2 && !/undefined|NaN/.test(q.prompt + q.explain + v.join()); };
      for (let s = 1; s <= 5; s++) {
        E.E().xp = xp[s];
        const specs = [['count', E.countSpec()], ['change', E.changeSpec()], ['where', E.whereSpec()], ['phrase', E.phraseSpec()], ...E.ISLANDS.map((I, i) => [I.id, E.islandSpec(i)])];
        for (const [name, spec] of specs) for (let k = 0; k < 200; k++) {
          const q = spec.gen(); if (!ok(q)) { out.push(`${name}@${s}: ${q.prompt} [${q.choices.map(c => c.val)}] = ${q.answer}`); break; }
          if (name === 'change' && new Set(q.choices.map(c => c.html)).size !== q.choices.length) { out.push(`change@${s}: same picture twice`); break; }
          if (name === 'count' && s === 1 && q.answer > 4) { out.push('count@1 asked a 5-sound word'); break; }
        }
      }
      E.E().xp = 0;
      return out;
    });
    if (data.length) fail(`data: ${data.slice(0, 6).join(' | ')}`);
    // Make today's quest carry the English job so we can watch it fill.
    await p.evaluate(() => { const q = window.__owl.quest(); q.tasks[2] = { k: 'english', need: 2, t: 'Do 2 English mission jobs', ico: '📚', have: 0 }; });

    // 2. Home: the new sections and the mission strip.
    await p.evaluate(() => window.__owl.go(window.__owl.home)); await p.waitForSelector('#tEnglish');
    await p.click('#tEnglish'); await p.waitForSelector('.en-secs');
    const secs = await p.$$eval('[data-sec]', x => x.map(b => b.dataset.sec));
    for (const id of ['write', 'sounds', 'talk', 'books', 'islands']) if (!secs.includes(id)) fail(`no ${id} section`);
    if (secs.includes('mission') || secs.length < 16) fail /* round 4 (t43) adds 3 more */(`sections ${secs}`);
    if (!(await p.$('#enMission'))) fail('no mission strip on the English home');
    await check('english home'); await shot('home');
    const expect = { write: ['.e6-lt', 26], sounds: ['.e6-sg', 4], talk: ['.e6-tk', 10], books: ['.e6-book', 12], islands: ['.e6-isl', 9] };
    for (const [id, [sel, n]] of Object.entries(expect)) {
      await en('home'); await p.waitForSelector('.en-secs'); await p.click(`[data-sec="${id}"]`);
      try { await p.waitForSelector(sel, { timeout: 4000 }); } catch (e) { fail(`section ${id} did not render`); continue; }
      const got = (await p.$$(sel)).length; if (got < n) fail(`section ${id}: ${got} × ${sel}`);
      if (!(await p.$('.en-ptip'))) fail(`no grown-up tip on ${id}`);
      await check(`section ${id}`); await shot(`sec-${id}`);
    }

    // 3. Writing: a careful trace passes, a repeat gives 1, a scribble fails, a word gives 3.
    const traceIt = async () => {
      await p.evaluate(() => document.getElementById('tPad').scrollIntoView({ block: 'center' })); await sleep(150);
      const strokes = await p.evaluate(() => { const svg = document.getElementById('tPad'), m = svg.getScreenCTM();
        return window.__english.TR.strokes.map(s => s.pts.map(([x, y]) => { const q = svg.createSVGPoint(); q.x = x; q.y = y; const r = q.matrixTransform(m); return [r.x, r.y]; })); });
      for (const pts of strokes) { await p.mouse.move(pts[0][0], pts[0][1]); await p.mouse.down(); for (const q of pts.slice(1)) await p.mouse.move(q[0], q[1]); await p.mouse.up(); await sleep(40); }
    };
    let s0 = await stars();
    await en('trace', 'L', 'a'); await p.waitForSelector('#tPad'); await sleep(200);
    await check('trace a'); await shot('trace-a');
    await traceIt(); await sleep(200);
    if (!(await p.evaluate(() => window.__english.TR.done))) fail('a careful trace of "a" was not accepted');
    if (!(await p.$('.e6-pad.e6-win'))) fail('no celebration on the pad');
    s0 = await gained('trace a', s0, 2); await shot('trace-a-done');
    await p.click('#tGo'); await p.waitForFunction(() => window.__english.TR && window.__english.TR.key === 'b');
    await en('trace', 'L', 'a'); await p.waitForSelector('#tPad'); await traceIt(); await sleep(200);
    s0 = await gained('trace a again', s0, 1);
    await en('trace', 'L', 'A'); await p.waitForSelector('#tPad'); await sleep(200);
    await p.evaluate(() => document.getElementById('tPad').scrollIntoView({ block: 'center' })); await sleep(100);
    const r = await p.evaluate(() => { const b = document.getElementById('tPad').getBoundingClientRect(); return [b.left, b.top, b.width, b.height]; });
    await p.mouse.move(r[0] + 4, r[1] + 4); await p.mouse.down();
    for (let k = 0; k <= 12; k++) { await p.mouse.move(r[0] + (k % 2 ? r[2] - 4 : 4), r[1] + 4 + k * (r[3] - 8) / 12, { steps: 6 }); }
    await p.mouse.up(); await sleep(150);
    if (await p.$('#tCheck:not([style*="none"])')) { const vis = await p.evaluate(() => document.getElementById('tBtns').style.display !== 'none'); if (vis) await p.click('#tCheck'); }
    await sleep(900);
    if (await p.evaluate(() => window.__english.TR.done || !!window.__english.R3().trace.L.A)) fail('a scribble over A was accepted');
    s0 = await gained('scribble', s0, 0); await shot('scribble');
    await en('trace', 'W', 'cat'); await p.waitForSelector('#tPad'); await traceIt(); await sleep(200);
    if (!(await p.evaluate(() => window.__english.TR.done))) fail('a careful trace of "cat" was not accepted');
    s0 = await gained('trace cat', s0, 3); await check('trace cat'); await shot('trace-cat');
    await en('write', 'lower'); await p.waitForSelector('.e6-lt.done');

    // 4. Sound games.
    await en('count'); s0 = await stars(); await shot('count'); await round(6); s0 = await gained('count the sounds', s0, 12);
    if (!(await p.evaluate(() => window.__english.E().rounds['snd-count'] === 1))) fail('count round not saved');
    await en('where'); await round(6, [0]); s0 = await gained('first middle last', s0, 11);
    await en('change'); await nextQ(0); await check('change'); await shot('change'); await round(6); s0 = await gained('change a sound', s0, 12);
    await en('clap'); await p.waitForSelector('#cTap'); await check('clap');
    for (let i = 0; i < 5; i++) {
      await p.waitForFunction(i => window.__english.CL.i === i && !window.__english.CL.done && document.getElementById('cTap'), i);
      const n = await p.evaluate(() => window.__english.CL.list[window.__english.CL.i].parts.length);
      if (i === 0) { for (let k = 0; k < n + 1; k++) await p.click('#cTap'); await p.click('#cDone'); await p.waitForSelector('.e6-syl'); }
      for (let k = 0; k < n; k++) await p.click('#cTap');
      await p.click('#cDone');
    }
    await p.waitForSelector('.en-reward', { timeout: 8000 }); s0 = await gained('clap the beats', s0, 9);

    // 5. Talk time: one chat (a miss on the first turn), meaning cards, phrase quiz.
    await en('chat', 'park'); await p.waitForSelector('.e6-reply'); await check('chat'); await shot('chat');
    for (let t = 0; t < 4; t++) {
      await p.waitForFunction(t => window.__english.TK.i === t && !window.__english.TK.wait && document.querySelector('.e6-reply:not([disabled])'), t);
      const good = await p.evaluate(() => { const T = window.__english.TK; return T.S.turns[T.i][1].findIndex(r => r[1]); });
      if (t === 0) { const bad = await p.evaluate(g => [0, 1, 2].find(j => j !== g), good); await p.click(`[data-rp="${bad}"]`); await p.waitForSelector('.e6-b.tip'); }
      await p.click(`[data-rp="${good}"]`); await p.waitForSelector('#tkNext');
      if (!(await p.$('.e6-card'))) fail(`no meaning card after turn ${t + 1}`);
      if (t === 0) { await check('chat card'); await shot('chat-card'); }
      await p.click('#tkNext');
    }
    await p.waitForSelector('.en-reward'); s0 = await gained('talk time chat', s0, 7);
    if (!(await p.evaluate(() => window.__english.R3().talk.park === 1 && window.__english.R3().cards.noworries === 1))) fail('chat or card not saved');
    await en('cards'); await p.waitForSelector('.e6-flip'); await p.click('.e6-flip'); if (!(await p.$('.e6-flip.on'))) fail('phrase card does not flip'); await check('cards'); await shot('cards');
    await en('phrases'); await round(6); s0 = await gained('phrase quiz', s0, 12);

    // 6. Chapter books: locked for a 5-year-old at stage 1, then read one at stage 3.
    await en('books'); await p.click('[data-bk="kite"]'); await sleep(200);
    if (await p.$('#bkText')) fail('a stage-3 book opened at stage 1');
    await p.evaluate(() => { window.__english.E().xp = 70; });
    await en('books'); await p.click('[data-bk="kite"]'); await p.waitForSelector('#bkText');
    for (let c = 0; c < 3; c++) {
      for (let pg = 0; pg < 3; pg++) {
        await p.waitForSelector('#bkNext');
        if (c === 0 && pg === 1) { await p.click('#bkText .e6-vw'); await p.waitForSelector('.e6-vcard'); await sleep(500); await check('book page with word card'); await shot('book'); }
        await p.click('#bkNext');
      }
      if (c < 2) { await p.waitForSelector('#bkGo'); await p.click('#bkGo'); }
    }
    await round(5); s0 = await gained('chapter book', s0, 13);
    if (!(await p.evaluate(() => window.__english.R3().books.kite === 6 && window.__english.R3().bookCh.kite === 3))) fail('book progress not saved');
    await p.evaluate(() => { window.__english.E().xp = 0; });

    // 7. Grammar islands in order.
    await en('islands'); await p.waitForSelector('.e6-isl'); await check('islands'); await shot('islands');
    await p.click('[data-is="1"]'); await sleep(200);
    if (await p.$('#iGo')) fail('island 2 opened before island 1 was won');
    await p.click('[data-is="0"]'); await p.waitForSelector('#iGo'); await check('island lesson'); await p.click('#iGo');
    await round(5, [], '.e6-iend'); s0 = await gained('noun island', s0, 13);
    if (!(await p.$('.e6-medal.new'))) fail('no badge medal'); await check('island end'); await shot('island-badge');
    await p.click('#iNext'); await p.waitForSelector('#iGo'); await p.click('#iGo');
    await round(5, [0, 1, 2], '.e6-iend'); s0 = await gained('verb island, 2 of 5', s0, 7);
    if (await p.evaluate(() => !!(window.__english.R3().isl.verbs || {}).badge)) fail('badge given for 2 of 5');
    await p.click('#iMap'); await p.waitForSelector('.e6-isl.won');

    // 8. Mission prize and the daily quest.
    await p.evaluate(() => { const e = window.__english.E(); e.wotd = e.wotd || {}; e.wotd.last = (d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'))(new Date()); });
    await en('home'); await p.waitForSelector('#enMission'); await p.click('#enMission'); await p.waitForSelector('.e6-mjob');
    await check('mission'); await shot('mission');
    if (!(await p.evaluate(() => window.__english.mDone()))) fail(`mission not done: ${await p.evaluate(() => JSON.stringify(window.__english.mission()))}`);
    s0 = await stars(); await p.click('#mChest'); await sleep(200); s0 = await gained('mission prize', s0, 3);
    const qe = await p.evaluate(() => window.__owl.quest().tasks.find(t => t.k === 'english'));
    if (!qe || qe.have !== 2) fail(`quest English job ${JSON.stringify(qe)}`);

    // 9. Report and reload.
    const R = await p.evaluate(() => { const html = window.__report.panel(); return { r3: window.__report.stats(window.__report.shown).E.r3, html }; });
    const r3 = R.r3;
    if (r3.traced !== 1 || r3.words !== 1 || r3.chats !== 1 || r3.books !== 1 || r3.islands !== 1 || r3.sound !== 4 || r3.missions !== 1) fail(`report ${JSON.stringify(r3)}`);
    if (!R.html.includes('Letters traced') || !R.html.includes('Talk time chats')) fail('report panel lacks the round-3 rows');
    const before = await p.evaluate(() => JSON.stringify([window.__owl.st.stars, window.__english.R3().trace, window.__english.R3().isl, window.__english.R3().talk, window.__english.R3().books]));
    await p.reload(); await p.waitForFunction(() => window.__owl && window.__english && window.__english.R3);
    const after = await p.evaluate(() => JSON.stringify([window.__owl.st.stars, window.__english.R3().trace, window.__english.R3().isl, window.__english.R3().talk, window.__english.R3().books]));
    if (before !== after) fail(`progress changed after reload ${before} ${after}`);
    console.log(`${tag}: ${secs.length} sections, stars ${await stars()}, report ${JSON.stringify(r3)}`);
    await ctx.close();
  }
  await b.close();
  console.log('errors', errs.length ? errs.join('\n') : 'none');
  console.log('fails', fails.length ? fails.join('\n') : 'none');
})();
