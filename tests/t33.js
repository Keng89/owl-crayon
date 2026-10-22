// English & Reading: the home tile opens the area; all 11 sections render (letter sounds, blend it, sight words,
// read, sentence builder, grammar games, word book, say it, fun games, word play, my words); a letter-sound tap and the sound song; a blend
// round answered by a real tap; a sentence built block by block (with a wrong check first) awarding stars; grammar
// answers (wrong then right); a whole round ending in the word-pal reward; a story read and its questions answered;
// sight-word find, Feed Munch, bubble pop and the word treasure hunt; stage locks and the reading ladder; reading
// stars landing in st.stars and the My World wallet; saved after a reload. On a phone (with speech) and a tablet
// (speech removed, to prove nothing waits on it), with no sideways scroll and big enough buttons.
// Prints "errors none" and "fails none" when clean. Screenshots go to SHOTS (default: current folder).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const b = await chromium.launch(); const errs = [], fails = [];
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
    const shot = async name => { await sleep(300); await p.screenshot({ path: `${SHOTS}/english-${tag}-${name}.png`, fullPage: true }); };
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (o > 1) fail(`sideways scroll ${o}px at ${where}`); };
    const bigEnough = async where => {
      const small = await p.evaluate(() => [...document.querySelectorAll('#view button')].filter(b => b.offsetParent && !b.disabled).map(b => { const r = b.getBoundingClientRect(); return [b.id || b.className, Math.round(r.width), Math.round(r.height), (b.textContent.trim() || b.getAttribute('aria-label') || '').slice(0, 14)]; }).filter(x => x[1] < 44 || x[2] < 44 || !x[3]));
      if (small.length) fail(`${where}: small or unlabeled buttons ${JSON.stringify(small.slice(0, 4))}`);
    };
    const S = () => p.evaluate(() => { const o = window.__owl.st, e = window.__english.E(); return { stars: o.stars, xp: e.xp, heard: Object.keys(e.heard).length, sight: Object.keys(e.sight).length, stories: { ...e.stories }, pals: Object.keys(e.pals || {}).length, stage: window.__english.stage(), wallet: window.__world.wallet() }; });
    const en = (v, ...a) => p.evaluate(([v, a]) => window.__english.go(v, ...a), [v, a]);
    // Tap the right (or a wrong) answer of the question on screen.
    const answer = async (right = true) => {
      const i = await p.evaluate(r => { const q = window.__english.q; const idx = q.choices.map((c, i) => [c, i]).filter(([c]) => (String(c.val) === String(q.answer)) === r).map(x => x[1]); return idx[0]; }, right);
      await p.click(`.en-q .choice[data-i="${i}"]`, { force: await p.evaluate(() => !!document.querySelector(".en-bubbles")) }); // bubbles sway, so they never hold still
    };
    const nextQ = async n => p.waitForFunction(n => window.__english.Q && window.__english.Q.i === n && document.querySelector('.en-q .choice:not([disabled])'), n, { timeout: 5000 });

    await p.goto(`http://localhost:${PORT}/index.html?r=${Date.now()}#selftest`);
    await p.evaluate(() => localStorage.clear()); await p.reload();
    await p.waitForFunction(() => window.__owl && window.__english && window.__world);
    await p.evaluate(() => { const s = window.__owl.st; s.age = 5; s.stars = 0; s.unlockAll = false; });
    const info = await p.evaluate(() => window.__english.info());
    if (info.words < 300) fail(`only ${info.words} vocabulary words`);
    if (info.stories < 10) fail(`only ${info.stories} stories`);
    if (info.sight < 200) fail(`only ${info.sight} sight words`);
    if (info.grammar < 15) fail(`only ${info.grammar} grammar games`);
    // Every grammar game at every stage: the answer is one of the choices, no repeats, no blanks.
    const bad = await p.evaluate(() => {
      const out = [];
      for (const g of window.__english.data.EN_GAMES) for (let s = 1; s <= 5; s++) for (let k = 0; k < 200; k++) {
        const q = g.gen(s), vals = q.choices.map(c => String(c.val));
        if (!vals.includes(String(q.answer)) || new Set(vals).size !== vals.length || vals.length < 2 || vals.some(v => !v || v === 'undefined') || !q.prompt || /undefined|NaN/.test(q.prompt + q.explain)) { out.push(`${g.id}@${s}: ${q.prompt} [${vals}] = ${q.answer}`); break; }
      }
      return out;
    });
    if (bad.length) fail(`bad grammar questions: ${bad.slice(0, 5).join(' | ')}`);

    // 1. The home tile opens the area.
    await p.evaluate(() => window.__owl.go(window.__owl.home));
    await p.waitForSelector('#tEnglish'); await noScroll('home');
    await p.click('#tEnglish'); await p.waitForSelector('.en-secs');
    if ((await S()).stage !== 1) fail('a 5-year-old does not start at stage 1');
    const secs = await p.$$eval('[data-sec]', x => x.map(b => b.dataset.sec));
    if (secs.length < 11) fail(`${secs.length} sections`); // 11 from rounds 1-2; round 3 (t41) adds 5 more
    await noScroll('english home'); await bigEnough('english home'); await shot('home');

    // 2. Every section renders.
    const expect = { phonics: ['.en-pt', 26], blend: ['#enBlend', 1], sight: ['.en-row', 5], read: ['.en-story', 10], build: ['.en-tray .en-blk', 3], grammar: ['.en-gt', 15], vocab: ['.en-vc', 10], say: ['.en-say', 10], fun: ['.en-fun', 4], play: ['.en-wp', 7], mywords: ['.en-stk', 10] };
    for (const id of secs.filter(x => expect[x])) {
      await p.evaluate(() => window.__english.go('home')); await p.waitForSelector('.en-secs');
      await p.click(`[data-sec="${id}"]`);
      const [sel, n] = expect[id];
      try { await p.waitForSelector(sel, { timeout: 4000 }); } catch (e) { fail(`section ${id} did not render ${sel}`); continue; }
      const got = (await p.$$(sel)).length; if (got < n) fail(`section ${id}: ${got} × ${sel}, want ${n}+`);
      await sleep(id === 'blend' ? 900 : 150);
      await noScroll(`section ${id}`); await bigEnough(`section ${id}`); await shot(`sec-${id}`);
    }

    // 3. Letter sounds: a tap lights the card, remembers it, and says the sound; the song runs.
    await en('phonics', 'letters'); await p.waitForSelector('.en-pt');
    await p.click('[data-ph="1"]');
    let s = await S();
    if (s.heard !== 1 || !(await p.$('[data-ph="1"].lit'))) fail('tapping B did not light or remember it');
    if (!noSpeech && !(await p.evaluate(() => window.__said.join(' '))).includes('buh')) fail(`B did not say buh: ${await p.evaluate(() => window.__said.join(' | '))}`);
    await p.click('#enSong'); await sleep(noSpeech ? 1600 : 300);
    if (!(await p.$('.en-pt.sing'))) fail('sound song lights no card');
    for (const t of ['pairs', 'magic', 'teams']) { await p.click(`[data-tab="${t}"]`); await p.waitForSelector(`.en-tab.on[data-tab="${t}"]`); await noScroll(`phonics ${t}`); }

    // 4. Blend it: sounds light up one by one, then join; the right picture gives 2 stars.
    await en('blend'); await p.waitForSelector('#enBlend');
    await p.waitForSelector('.en-snd.lit', { timeout: 3000 }).catch(() => fail('blend sounds never light up'));
    await p.waitForSelector('#enBlend.joined', { timeout: 6000 }).catch(() => fail('blend sounds never join into the word'));
    s = await S(); await answer(true); await sleep(200);
    let s2 = await S();
    if (s2.stars !== s.stars + 2 || s2.xp !== s.xp + 2) fail(`blend right answer: stars ${s.stars}→${s2.stars}, xp ${s.xp}→${s2.xp}`);
    if (!/⭐/.test(await p.textContent('#cheer'))) fail('no cheer after a right blend');
    await shot('blend');

    // 5. Sentence builder: a wrong check gives no stars; building it right (order, capital, mark) gives 2.
    await en('build'); await p.waitForSelector('.en-tray');
    const build = async (wrongFirst) => {
      const t = await p.evaluate(() => { const B = window.__english.B; return { n: B.cur.toks.length, mark: B.cur.mark, proper: B.cur.toks[0].proper, s: B.cur.s }; });
      const before = await S();
      if (wrongFirst) { await p.click('#enCheck'); if ((await S()).stars !== before.stars) fail('an empty sentence gave stars'); if (!/all the words/.test(await p.textContent('#cheer'))) fail('no hint for an unfinished sentence'); }
      for (let i = 0; i < t.n; i++) await p.click(`.en-tray [data-t="${i}"]`);
      if (!t.proper) await p.click('#enCap');
      await p.click(`[data-m="${t.mark}"]`);
      const line = (await p.$$eval('#enLine .en-blk', x => x.map(b => b.textContent.trim()).join(' ')));
      if (line.replace(/ ([.?!])$/, '$1') !== t.s) fail(`built line "${line}" is not "${t.s}"`);
      await p.click('#enCheck'); await sleep(150);
      const after = await S();
      if (after.stars !== before.stars + (wrongFirst ? 1 : 2)) fail(`sentence "${t.s}": stars ${before.stars}→${after.stars}`);
      if (!(await p.$('#enLine.ok'))) fail('built sentence not marked right');
      return t.s;
    };
    const s1 = await build(false); await shot('build');
    await p.waitForFunction(() => window.__english.B.i === 1 && !window.__english.B.done, null, { timeout: 5000 });
    await build(true);
    console.log(`${tag}: built "${s1}"`);

    // 6. Grammar: a wrong answer explains and costs a star; then the right one gives 1. Prepositions draw a picture.
    await en('play', 'plural'); await p.waitForSelector('.en-q');
    s = await S(); await answer(false); await p.waitForSelector('.explain');
    if ((await S()).stars !== s.stars) fail('a wrong grammar answer changed stars');
    await answer(true); await sleep(150);
    if ((await S()).stars !== s.stars + 1) fail('right after wrong did not give 1 star');
    await en('play', 'prep'); await p.waitForSelector('.en-pp'); await shot('prep');
    // 6b. A whole round of 6 ends with the reward and a word pal.
    await en('play', 'aan'); await p.waitForSelector('.en-q');
    const sr = await S();
    for (let i = 0; i < 6; i++) { await nextQ(i); await answer(true); }
    await p.waitForSelector('.en-reward', { timeout: 5000 });
    s = await S();
    if (s.pals !== sr.pals + 1) fail('no word pal after a finished round');
    if (s.stars !== sr.stars + 12) fail(`a perfect round gave ${s.stars - sr.stars} stars, want 12`);
    await noScroll('reward'); await bigEnough('reward'); await shot('reward');
    await p.click('#enBack'); await p.waitForSelector('.en-gt');

    // 7. A story: pages with tappable words, then 3 questions.
    await en('story', 'cathat', 0); await p.waitForSelector('.en-page');
    await p.click('.en-tw'); await noScroll('story'); await bigEnough('story'); await shot('story');
    for (let i = 0; i < 4; i++) await p.click('#enNextP');
    if (!/Questions/.test(await p.textContent('#enNextP'))) fail('last story page has no Questions button');
    await p.click('#enNextP'); await p.waitForSelector('.en-q');
    for (let i = 0; i < 3; i++) { await nextQ(i); await answer(true); }
    await p.waitForSelector('.en-reward');
    if (!(await S()).stories.cathat) fail('finished story not marked read');

    // 8. Sight words, Feed Munch, bubble pop, treasure hunt, silly sentences.
    await en('sightFind', 'pre'); await p.waitForSelector('.en-q');
    const sw = await p.evaluate(() => window.__english.q.answer);
    await answer(true); await sleep(100);
    if (!(await p.evaluate(w => window.__english.E().sight[w], sw))) fail('found sight word not remembered');
    for (const g of ['monster', 'bubbles', 'silly']) {
      await en(g); await p.waitForSelector('.en-q'); s = await S(); await answer(true); await sleep(150);
      if ((await S()).stars !== s.stars + 2) fail(`${g}: right answer did not give 2 stars`);
      await noScroll(g); await bigEnough(g); await shot(g);
    }
    await en('hunt'); await p.waitForSelector('.en-dig');
    s = await S();
    const hunt = await p.evaluate(() => { const H = window.__english.H; return { right: H.words.indexOf(H.calls[0]), wrong: H.words.findIndex(w => w !== H.calls[0]) }; });
    await p.click(`[data-h="${hunt.wrong}"]`); await sleep(100);
    await p.evaluate(() => { window.__english.H.miss = 0; }); // the test checks a clean first find below
    await p.click(`[data-h="${hunt.right}"]`); await sleep(150);
    if ((await S()).stars !== s.stars + 1 || !(await p.$('.en-dig.found'))) fail('treasure hunt find did not give a star and a gem');
    await noScroll('hunt'); await bigEnough('hunt'); await shot('hunt');

    // 9. Locks and the ladder: a stage-3 game is locked at stage 1; enough reading stars open it.
    await p.evaluate(() => { window.__english.E().xp = 0; });
    await en('grammar'); await p.waitForSelector('.en-gt');
    if (!(await p.$('[data-g="pron"].locked'))) fail('pronouns not locked at stage 1');
    await p.click('[data-g="pron"]'); await sleep(100);
    if (await p.$('#enPlay')) fail('a locked game opened');
    await p.evaluate(() => { window.__english.E().xp = 70; });
    if ((await S()).stage !== 3) fail('70 reading stars do not open stage 3');
    await en('grammar'); await p.click('[data-g="pron"]'); await p.waitForSelector('#enPlay');
    await p.click('#enPlay'); await p.waitForSelector('.en-q'); await answer(true);

    // 10. Reading stars are real stars: the My World wallet grows; progress survives a reload.
    s = await S();
    if (s.wallet !== s.stars || s.stars < 30) fail(`wallet ${s.wallet}, stars ${s.stars}`);
    await p.evaluate(() => window.__owl.go(window.__owl.home)); await sleep(300);
    await p.reload(); await p.waitForFunction(() => window.__owl && window.__english);
    s2 = await S();
    if (s2.stars !== s.stars || s2.xp !== s.xp || !s2.stories.cathat || !s2.pals) fail(`progress lost after reload ${JSON.stringify([s, s2])}`);
    await en('home'); await p.waitForSelector('.en-club');
    console.log(`${tag}: stars ${s2.stars}, reading xp ${s2.xp}, stage ${s2.stage}, pals ${s2.pals}; ${JSON.stringify(info)}`);
    await ctx.close();
  }
  console.log('errors', errs.length ? errs : 'none');
  console.log('fails', fails.length ? fails : 'none');
  await b.close();
})();
