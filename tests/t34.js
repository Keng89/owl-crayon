// English & Reading, round 2: the word book has 800+ words in age tiers (big words carry meanings); 12 more stories;
// two new sections (Word play, My words) with parent tips on every section; Word play's 7 games (spelling bee with
// letter tiles, story maker, rhyme time with its song, describe it, sound safari, tongue twisters, listen & tap);
// the word of the day with its daily streak; missed words going into Owl's review and coming back on days 0, 1 and 3
// until they are learned; the word album collecting words; stars landing in st.stars; everything saved after a reload.
// Phone with speech, tablet without (to prove nothing waits on it), with no sideways scroll and big enough buttons.
// Prints "errors none" and "fails none" when clean. Screenshots go to SHOTS (default: current folder).
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
    const shot = async name => { await sleep(300); await p.screenshot({ path: `${SHOTS}/english2-${tag}-${name}.png`, fullPage: true }); };
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (o > 1) fail(`sideways scroll ${o}px at ${where}`); };
    const bigEnough = async where => {
      const small = await p.evaluate(() => [...document.querySelectorAll('#view button')].filter(b => b.offsetParent && !b.disabled).map(b => { const r = b.getBoundingClientRect(); return [b.id || b.className, Math.round(r.width), Math.round(r.height), (b.textContent.trim() || b.getAttribute('aria-label') || '').slice(0, 14)]; }).filter(x => x[1] < 44 || x[2] < 44 || !x[3]));
      if (small.length) fail(`${where}: small or unlabeled buttons ${JSON.stringify(small.slice(0, 4))}`);
    };
    const check = async where => { await noScroll(where); await bigEnough(where); };
    const S = () => p.evaluate(() => { const o = window.__owl.st, E = window.__english, e = E.W(); return { stars: o.stars, xp: e.xp, got: E.collected().length, review: JSON.parse(JSON.stringify(e.review)), wotd: { ...e.wotd }, tw: { ...e.tw }, tales: Object.keys(e.tales).length, pals: Object.keys(e.pals || {}).length, stage: E.stage() }; });
    const en = (v, ...a) => p.evaluate(([v, a]) => window.__english.go(v, ...a), [v, a]);
    const answer = async (right = true) => {
      const i = await p.evaluate(r => { const q = window.__english.q; return q.choices.findIndex(c => (String(c.val) === String(q.answer)) === r); }, right);
      await p.click(`.en-q .choice[data-i="${i}"]`);
    };
    const nextQ = async n => p.waitForFunction(n => window.__english.Q && window.__english.Q.i === n && document.querySelector('.en-q .choice:not([disabled])'), n, { timeout: 5000 });
    const dn = () => p.evaluate(() => Math.round(new Date(new Date().toISOString().slice(0, 10) + 'T12:00:00').getTime() / 864e5));

    await p.goto(`http://localhost:${PORT}/index.html?r=${Date.now()}#selftest`);
    await p.evaluate(() => localStorage.clear()); await p.reload();
    await p.waitForFunction(() => window.__owl && window.__english && window.__english.W);
    await p.evaluate(() => { const s = window.__owl.st; s.age = 5; s.stars = 0; s.unlockAll = false; });

    // 1. Counts and data checks.
    const info = await p.evaluate(() => window.__english.info());
    if (info.words < 800) fail(`only ${info.words} vocabulary words`);
    if (info.topics < 30) fail(`only ${info.topics} topics`);
    if (info.stories < 24) fail(`only ${info.stories} stories`);
    if (info.wordplay !== 7) fail(`${info.wordplay} word play games`);
    if (info.bigwords < 100) fail(`only ${info.bigwords} big words`);
    const data = await p.evaluate(() => {
      const E = window.__english, D = E.data, out = [], seen = new Set();
      for (const t of D.EN_VOCAB) for (const x of t.words) {
        const k = x.w.toLowerCase(); if (seen.has(k) && !['orange', 'wave'].includes(k)) out.push(`duplicate word ${x.w}`); seen.add(k); // orange (fruit, color) and wave (sea, hand) are in two topics
        if (!x.e || !x.w || ![1, 2, 3].includes(x.t)) out.push(`bad word ${JSON.stringify(x)}`);
        if (x.t === 3 && (!x.m || x.m.length < 5)) out.push(`big word without meaning ${x.w}`);
      }
      const tiers = [1, 2, 3].map(t => D.EN_ALLWORDS.filter(x => x.t === t).length);
      if (tiers.some(n => n < 100)) out.push(`thin tiers ${tiers}`);
      for (const s of D.EN_STORIES) { if (s.pages.length < 5 || s.qs.length < 3 || s.qs.some(q => q.length !== 4 || new Set(q.slice(1)).size !== 3)) out.push(`bad story ${s.id}`); }
      for (const st of [1, 2, 3, 4, 5]) if (D.EN_STORIES.filter(s => s.stage === st).length < 4) out.push(`stage ${st} has few stories`);
      // Question makers at every stage.
      const xp = { 1: 0, 2: 25, 3: 70, 4: 140, 5: 240 }, ok = q => { const v = q.choices.map(c => String(c.val)); return v.includes(String(q.answer)) && new Set(v).size === v.length && v.length >= 2 && !/undefined|NaN/.test(q.prompt + q.explain + v.join()); };
      for (let s = 1; s <= 5; s++) {
        E.E().xp = xp[s];
        if (E.stage() !== s) out.push(`xp ${xp[s]} is stage ${E.stage()}`);
        for (const [name, spec] of [['describe', E.describeSpec()], ['listen', E.listenSpec()]]) for (let k = 0; k < 300; k++) {
          const q = spec.gen(); if (!ok(q)) { out.push(`${name}@${s}: ${q.prompt} [${q.choices.map(c => c.val)}] = ${q.answer}`); break; }
          if (name === 'listen' && new Set(q.choices.map(c => c.html)).size !== q.choices.length) { out.push(`listen@${s}: same picture twice ${q.choices.map(c => c.html)}`); break; }
          if (name === 'listen' && s <= 2 && D.EN_ALLWORDS.find(x => x.w === q.answer).t !== 1) { out.push(`listen@${s}: ${q.answer} is not a first word`); break; }
        }
        for (let k = 0; k < 50; k++) { const r = E.rhymeSpec(); if (r.list.length !== 4 || r.list.some(q => !ok(q))) { out.push(`rhyme@${s} bad`); break; } }
        const sp = E.spellPool(); if (sp.length < 20 || sp.some(x => !/^[a-z]+$/.test(x.w) || !x.e)) out.push(`spell pool @${s}: ${sp.length}`);
        const w = E.wotdWord(); if (!w || !w.w || !w.e) out.push(`no word of the day at stage ${s}`);
        if (s <= 2 && w.t !== 1) out.push(`word of the day for stage ${s} is tier ${w.t}`);
      }
      E.E().xp = 0;
      const sf = E.safariPool(); if (Object.keys(sf).filter(l => new Set(sf[l].map(x => x.e)).size >= 3).length < 6) out.push('few safari letters');
      for (const h of E.heroes()) for (const pl of D.EN_TALE.places) for (const pr of D.EN_TALE.problems) for (const big of [false, true]) {
        const t = E.makeTale(h, pl, pr, big); if (t.pages.length !== 6 || /undefined|NaN|\$\{/.test(JSON.stringify(t))) { out.push(`bad tale ${t.key}`); break; }
      }
      const syl = { cat: 1, elephant: 3, butterfly: 3, banana: 3, cake: 1, table: 2, 'ice cream': 2 };
      for (const [k, v] of Object.entries(syl)) if (E.syllables(k) !== v) out.push(`syllables(${k}) = ${E.syllables(k)}, want ${v}`);
      return out;
    });
    if (data.length) fail(`data: ${data.slice(0, 6).join(' | ')}`);

    // 2. Home: 11 sections, the word-of-the-day strip, no review strip yet, and a parent tip on every section screen.
    await p.evaluate(() => window.__owl.go(window.__owl.home)); await p.waitForSelector('#tEnglish');
    await p.click('#tEnglish'); await p.waitForSelector('.en-secs');
    const secs = await p.$$eval('[data-sec]', x => x.map(b => b.dataset.sec));
    if (secs.length !== 11 || !secs.includes('play') || !secs.includes('mywords')) fail(`sections ${secs}`);
    if (!(await p.$('#enWotd'))) fail('no word of the day strip on the English home');
    if (await p.$('#enRev')) fail('review strip shown with nothing to review');
    await check('english home'); await shot('home');
    for (const id of secs) {
      await en('home'); await p.waitForSelector('.en-secs'); await p.click(`[data-sec="${id}"]`); await sleep(250);
      if (!['blend', 'build'].includes(id) && !(await p.$('.en-ptip'))) fail(`no grown-up tip on ${id}`);
      if (id === 'blend' && !(await p.$('.en-ptip'))) fail('no grown-up tip on blend it');
      await noScroll(`section ${id}`);
    }
    await en('wordplay'); await p.waitForSelector('[data-wp]');
    if ((await p.$$('[data-wp]')).length !== 7) fail('word play does not list 7 games');
    await check('word play'); await shot('play');

    // 3. Word book tiers: big words show meanings; a stage-1 quiz uses first words only.
    await en('vocab', 'describe', 3); await p.waitForSelector('.en-vc');
    const t3 = await p.$$eval('.en-vc', x => x.map(b => [b.classList.contains('t3'), !!b.querySelector('small')]));
    if (!t3.length || t3.some(([a, m]) => !a || !m)) fail('big-word filter shows other words or no meanings');
    await check('word book big words'); await shot('bigwords');
    const qt = await p.evaluate(() => { const E = window.__english, out = new Set(); for (const t of E.data.EN_VOCAB) { E.go('vocabQuiz', t.id); for (let k = 0; k < 30; k++) { const q = E.Q.gen(); out.add(E.data.EN_ALLWORDS.find(x => x.w === q.answer).t); } } return [...out]; });
    if (qt.some(t => t !== 1)) fail(`stage-1 word book quiz asked tiers ${qt}`);

    // 4. Review: a missed word goes into the queue (due today), comes back on day 1 and day 3, then is collected.
    await en('listen'); await p.waitForSelector('.en-q');
    const lw = await p.evaluate(() => window.__english.q.answer);
    await answer(false); await sleep(100);
    let s = await S(), k = lw.toLowerCase();
    if (!s.review[k] || s.review[k].box !== 0 || s.review[k].due !== await dn()) fail(`missed word not queued for today: ${JSON.stringify(s.review)}`);
    await answer(true); await sleep(100);
    if ((await S()).review[k].box !== 0) fail('a right answer after a miss moved the word on');
    await shot('listen');
    await en('home'); await p.waitForSelector('#enRev');
    await check('home with review'); await p.click('#enRev'); await p.waitForSelector('.en-q');
    const today = await dn();
    for (const [box, gap] of [[1, 1], [2, 3]]) {
      const q = await p.evaluate(() => [window.__english.Q.id, window.__english.Q.review, window.__english.Q.n, window.__english.q.answer]);
      if (q[0] !== 'review' || !q[1] || q[3].toLowerCase() !== k) fail(`review round ${JSON.stringify(q)}`);
      s = await S(); await answer(true); await sleep(150);
      const s2 = await S();
      if (!s2.review[k] || s2.review[k].box !== box || s2.review[k].due !== today + gap) fail(`after review ${box}: ${JSON.stringify(s2.review[k])}`);
      if (s2.stars !== s.stars + 2) fail('a review answer did not give 2 stars');
      await p.waitForSelector('.en-reward', { timeout: 5000 });
      await p.evaluate(k => { window.__english.W().review[k].due = window.__english.W().review[k].due - (k ? 99 : 0); }, k); // pretend the days went by
      await en('review'); await p.waitForSelector('.en-q');
    }
    s = await S(); await answer(true); await sleep(150);
    let s2 = await S();
    if (s2.review[k]) fail('a word answered right 3 times is still in review');
    if (!(await p.evaluate(k => window.__english.collected().includes(k), k))) fail(`learned review word ${k} not in the album`);
    await en('mywords'); await p.waitForSelector('.en-album');
    await check('my words'); await shot('mywords');
    const topicOf = await p.evaluate(k => window.__english.data.EN_ALLWORDS.find(x => x.w.toLowerCase() === k).topic, k);
    await en('mywords', topicOf); await p.waitForSelector('.en-stk.got');
    await p.click('.en-stk.got');

    // 5. Word of the day: find it for 3 stars and a streak; a second time the same day gives nothing; a streak grows day by day.
    await en('wotd'); await p.waitForSelector('#wGo');
    await p.click('#wClap'); await p.waitForSelector('.en-clap', { timeout: 3000 }).catch(() => fail('clapping shows no claps'));
    await check('word of the day'); await shot('wotd');
    s = await S(); await p.click('#wGo'); await p.waitForSelector('[data-wi]');
    const wd = await p.evaluate(() => window.__english.wotdWord().w);
    const wi = await p.$$eval('[data-wi]', (x, wd) => x.findIndex(b => b.getAttribute('aria-label') === wd), wd);
    const wrongI = wi === 0 ? 1 : 0;
    await p.click(`[data-wi="${wrongI}"]`); await p.click(`[data-wi="${wi}"]`); await sleep(150);
    s2 = await S();
    if (s2.stars !== s.stars + 3 || s2.wotd.streak !== 1 || !s2.wotd.last) fail(`word of the day: stars ${s.stars}→${s2.stars}, ${JSON.stringify(s2.wotd)}`);
    await p.waitForSelector('.en-wdone', { timeout: 4000 });
    await en('wotd'); await p.waitForSelector('.en-wotd');
    if (await p.$('#wGo')) fail('word of the day can be played twice in one day');
    await p.evaluate(() => { const o = window.__english.W().wotd, d = new Date(); d.setDate(d.getDate() - 1); o.last = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); o.streak = 4; });
    await en('wotd'); await p.click('#wGo'); await p.waitForSelector('[data-wi]');
    await p.click(`[data-wi="${await p.$$eval('[data-wi]', (x, wd) => x.findIndex(b => b.getAttribute('aria-label') === wd), wd)}"]`); await sleep(150);
    if ((await S()).wotd.streak !== 5) fail('streak did not grow after yesterday');
    await p.evaluate(() => { const o = window.__english.W().wotd; o.last = '2020-01-01'; o.streak = 9; });
    if (await p.evaluate(() => window.__english.streakNow()) !== 0) fail('an old streak still counts');
    await p.evaluate(() => { const o = window.__english.W().wotd, d = new Date(); o.last = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); o.streak = 5; });

    // 6. Spelling bee: a wrong tile shakes and costs a star; then a perfect word gives 2; 5 words end in the reward.
    await en('spell'); await p.waitForSelector('.en-tile');
    if (await p.evaluate(() => window.__english.SP.cur.w.length) && !(await p.$('.en-slot i'))) fail('stage 1 spelling shows no ghost letters');
    await check('spelling bee'); await shot('spell');
    const spellWord = async (wrongFirst) => {
      const w = await p.evaluate(() => window.__english.SP.cur.w); const before = await S();
      if (wrongFirst) {
        const bad = await p.evaluate(() => { const S = window.__english.SP; return S.tiles.findIndex(t => !t.used && t.c !== S.cur.w[S.got]); });
        if (bad >= 0) { await p.click(`[data-tl="${bad}"]`); if ((await p.evaluate(() => window.__english.SP.miss)) !== 1) fail('wrong tile not counted'); }
        else wrongFirst = false;
      }
      for (let i = 0; i < w.length; i++) {
        const t = await p.evaluate(() => { const S = window.__english.SP; return S.tiles.findIndex(t => !t.used && t.c === S.cur.w[S.got]); });
        await p.click(`[data-tl="${t}"]`);
      }
      await sleep(150);
      const after = await S();
      if (after.stars !== before.stars + (wrongFirst ? 1 : 2)) fail(`spelling ${w}: stars ${before.stars}→${after.stars}`);
      if (wrongFirst && !after.review[w]) fail(`misspelled ${w} not in review`);
      return w;
    };
    await spellWord(true);
    for (let i = 1; i < 5; i++) { await p.waitForFunction(i => window.__english.SP.i === i && !window.__english.SP.done, i, { timeout: 5000 }); await spellWord(false); }
    await p.waitForSelector('.en-reward', { timeout: 5000 });

    // 7. Story maker: pick by taps, read 6 pages, 2 stars for a new story, none for the same one again.
    await en('maker'); await p.waitForSelector('.en-mko');
    if (!(await p.$('#tmGo[disabled]'))) fail('make story enabled before picking');
    await p.click('[data-mk="hero:2"]'); await p.click('[data-mk="place:0"]'); await p.click('[data-mk="prob:4"]');
    await check('story maker'); await shot('maker');
    const makeOne = async () => {
      await p.click('#tmGo'); await p.waitForSelector('.en-tale');
      for (let i = 0; i < 5; i++) await p.click('#enNextP');
      if (!/The end/.test(await p.textContent('#enNextP'))) fail('last tale page has no end button');
      const before = await S(); await p.click('#enNextP'); await p.waitForSelector('.en-reward');
      return (await S()).stars - before.stars;
    };
    let got = await makeOne();
    if (got !== 2) fail(`a new story gave ${got} stars`);
    await en('maker'); await p.click('[data-mk="hero:2"]'); await p.click('[data-mk="place:0"]'); await p.click('[data-mk="prob:4"]');
    got = await makeOne();
    if (got !== 0) fail(`the same story again gave ${got} stars`);
    await en('maker'); await p.click('#tmDice'); await p.waitForSelector('#tmGo:not([disabled])');
    await p.click('#tmGo'); await p.waitForSelector('.en-tale'); await check('tale'); await shot('tale');

    // 8. Rhyme time: 4 rhymes, then the song, then the reward.
    await en('rhyme'); await p.waitForSelector('.en-q');
    await check('rhyme'); await shot('rhyme');
    for (let i = 0; i < 4; i++) { await nextQ(i); await answer(i ? true : false); if (!i) await answer(true); }
    await p.waitForSelector('.en-songl', { timeout: 5000 });
    if ((await p.$$('.en-songl p')).length !== 8) fail('rhyme song does not have 8 lines');
    await sleep(noSpeech ? 1000 : 200);
    if (!(await p.$('.en-songl p.lit'))) fail('song lights no line');
    await check('song'); await shot('song');
    await p.click('#enDone'); await p.waitForSelector('.en-reward');

    // 9. Describe it and listen & tap: 2 stars for a right first answer.
    for (const g of ['describe', 'listen']) {
      await en(g); await p.waitForSelector('.en-q'); s = await S(); await answer(true); await sleep(150);
      if ((await S()).stars !== s.stars + 2) fail(`${g}: right answer did not give 2 stars`);
      await check(g); await shot(g);
    }

    // 10. Sound safari: a wrong tap shakes; finding 3 gives a star (2 when clean); 3 letters end in the reward.
    await en('safari'); await p.waitForSelector('.en-hid');
    await check('safari'); await shot('safari');
    for (let r = 0; r < 3; r++) {
      await p.waitForFunction(r => window.__english.SF.i === r && !window.__english.SF.lock, r, { timeout: 5000 });
      const g = await p.evaluate(() => { const F = window.__english.SF; return { right: F.grid.map((x, i) => x.w[0] === F.l ? i : -1).filter(i => i >= 0), wrong: F.grid.findIndex(x => x.w[0] !== F.l) }; });
      if (g.right.length !== 3) fail(`safari grid has ${g.right.length} targets`);
      s = await S();
      if (!r) await p.click(`[data-sf="${g.wrong}"]`, { force: true }); // the hidden animals bob, so they never hold still
      for (const i of g.right) await p.click(`[data-sf="${i}"]`, { force: true });
      await sleep(120);
      if ((await S()).stars !== s.stars + (r ? 2 : 1)) fail(`safari letter ${r}: stars ${s.stars}→${(await S()).stars}`);
      if ((await p.$$('.en-hid.snap')).length !== 3) fail('found animals not snapped');
    }
    await p.waitForSelector('.en-reward', { timeout: 5000 });

    // 11. Tongue twisters: say it 3 times for 2 stars once; a stage-5 twister is locked at stage 1.
    await en('twisters'); await p.waitForSelector('[data-tt]');
    await p.click('[data-tt="19"]'); await sleep(100);
    if (await p.$('#twSaid')) fail('a locked twister opened');
    await en('twister', 0); await p.waitForSelector('#twSaid');
    await p.click('[data-sp="1.4"]'); await sleep(500);
    if (!(await p.$('#twText .en-tw.lit'))) fail('twister words do not light up');
    s = await S();
    for (let i = 0; i < 3; i++) await p.click('#twSaid');
    if ((await S()).stars !== s.stars + 2) fail('3 tries of a twister did not give 2 stars');
    await p.waitForSelector('#twGo'); await check('twister'); await shot('twister');
    await en('twister', 0); s = await S(); for (let i = 0; i < 3; i++) await p.click('#twSaid');
    if ((await S()).stars !== s.stars) fail('a twister gave stars twice');

    // 12. Stars are real stars and everything survives a reload.
    s = await S();
    if (s.stars < 40 || s.xp !== s.stars) fail(`stars ${s.stars}, reading xp ${s.xp}`);
    await p.evaluate(() => window.__owl.go(window.__owl.home)); await sleep(300);
    await p.reload(); await p.waitForFunction(() => window.__owl && window.__english && window.__english.W);
    s2 = await S();
    if (s2.stars !== s.stars || s2.got !== s.got || s2.wotd.streak !== s.wotd.streak || JSON.stringify(s2.tw) !== JSON.stringify(s.tw) || s2.tales !== s.tales || JSON.stringify(s2.review) !== JSON.stringify(s.review)) fail(`progress lost after reload ${JSON.stringify([s, s2])}`);
    await en('home'); await p.waitForSelector('#enWotd.done');
    console.log(`${tag}: stars ${s2.stars}, album ${s2.got}, review ${Object.keys(s2.review).length}, streak ${s2.wotd.streak}, tales ${s2.tales}; ${JSON.stringify(info)}`);
    await ctx.close();
  }
  console.log('errors', errs.length ? errs : 'none');
  console.log('fails', fails.length ? fails : 'none');
  await b.close();
})().catch(e => { console.log("crash", e.message.split("\n").slice(0, 6).join(" | "), (e.stack.match(/t34\.js:\d+/g) || []).join(" ")); console.log("errors", errs); console.log("fails", fails); process.exit(1); });
