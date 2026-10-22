// English & Reading, round 4 (src/english9.js data, english10.js screens, english10.css): Sound lab, Word power,
// Read-along and 10 more Talk time chats. Checks the data (20+ word families with real and silly words, 30+ listening
// pairs, all 44 sounds on the sound wall with 3 words and a rhyme each, tricky sounds, 30+ new sayings that are not
// already in the app, 20 chats with exactly one good reply per turn and known phrase cards) and 200 questions per new
// question maker at every stage; the 3 new sections and their screens render with a grown-up tip, no sideways scroll
// and big labeled buttons; the word family house accepts real words (1 star each), refuses silly ones (no star, shown
// as silly), ignores a repeat and gives +2 when full (6), and the spin wheel lands on a letter; exact stars for
// "Which did Owl say?" with a miss (11), tricky sounds (locked at stage 1, then 12), the sound wall (+5 once when all 44
// are heard), sound hunt (12), opposites match with a miss (9), sort it (16), odd one out (12), compound words (12),
// word ladders with a miss (7), sound-alikes (locked, then 12), sayings cards and quiz (12); Read-along: highlights
// advance word by word as Owl reads and in My turn (a tap on the next word moves on), 2 + 2 stars for a first read with
// 2 of my turns, 1 on a repeat read by Owl, and a Read-along button on story and chapter pages; a new Talk time chat
// with a miss (7) and its phrase cards; the grown-ups' report counts; everything kept after a reload.
// Phone with speech, tablet without. Prints "errors none" and "fails none" when clean. Takes PORT (default 8766).
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
    const shot = async name => { await sleep(250); await p.screenshot({ path: `${SHOTS}/english4-${tag}-${name}.png`, fullPage: true }); };
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
    const round = async (n, miss = [], endSel = '.en-reward') => {
      for (let i = 0; i < n; i++) { await nextQ(i); if (miss.includes(i)) { await answer(false); await sleep(60); } await answer(true); }
      await p.waitForSelector(endSel, { timeout: 6000 });
    };
    const gained = async (label, s0, want) => { const s1 = await stars(); if (s1 - s0 !== want) fail(`${label}: ${s1 - s0} stars, want ${want}`); return s1; };
    const setUnlock = v => p.evaluate(v => { window.__owl.st.unlockAll = v; }, v);

    await p.goto(`http://localhost:${PORT}/index.html?r=${Date.now()}#selftest`);
    await p.evaluate(() => localStorage.clear()); await p.reload();
    await p.waitForFunction(() => window.__owl && window.__english && window.__english.R4);
    await p.evaluate(() => { const s = window.__owl.st; s.age = 5; s.stars = 0; s.unlockAll = false; });

    // 1. Data and question makers.
    const data = await p.evaluate(() => {
      const E = window.__english, D = E.data, out = [], info = E.info(), norm = s => String(s).toLowerCase().replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim();
      if (D.EN_FAMILIES.length < 20) out.push(`${D.EN_FAMILIES.length} families`);
      for (const F of D.EN_FAMILIES) {
        if (F.real.length < 5 || F.silly.length < 3) out.push(`family ${F.end} is small`);
        const r = F.real.map(x => x.w), s = F.silly.map(x => x.w);
        if (new Set(r).size !== r.length || new Set(s).size !== s.length || r.some(x => s.includes(x))) out.push(`family ${F.end} repeats a word`);
        if (F.real.some(x => !x.e) || [...r, ...s].some(x => !x.endsWith(F.end))) out.push(`family ${F.end} has a bad entry`);
      }
      if (D.EN_MINPAIRS.length < 30 || D.EN_MINPAIRS.some(x => x[0] === x[2] || !x[1] || !x[3])) out.push('minimal pairs');
      if (D.EN_WALL.length !== 44 || new Set(D.EN_WALL.map(T => T.k)).size !== 44) out.push(`${D.EN_WALL.length} wall sounds`);
      const groups = {}; D.EN_WALL.forEach(T => { groups[T.g] = (groups[T.g] || 0) + 1; if (T.ex.length !== 3 || T.ex.some(x => !x[1]) || !T.rhyme) out.push(`wall ${T.k} examples or rhyme`); });
      if (groups.cons !== 24 || groups.short + groups.long + groups.more !== 20) out.push(`wall groups ${JSON.stringify(groups)}`);
      for (const id of ['kn', 'wr', 'mb', 'tion', 'softc', 'softg', 'ph']) if (!D.EN_TRICKY.some(T => T.id === id)) out.push(`no tricky ${id}`);
      const old = new Set([...D.EN_SAYINGS.flatMap(g => g.items.map(i => norm(i[0]))), ...D.EN_PHRASES.map(p => norm(p[1]))]);
      const idi = D.EN_IDIOMS; if (idi.length < 30) out.push(`${idi.length} idioms`);
      if (new Set(idi.map(i => i[0])).size !== idi.length || new Set(idi.map(i => norm(i[1]))).size !== idi.length) out.push('idioms repeat');
      for (const I of idi) { if (old.has(norm(I[1]))) out.push(`idiom already in the app: ${I[1]}`); if (!I[2] || !I[3] || !I[4] || !['idiom', 'simile', 'slang', 'wise'].includes(I[5])) out.push(`idiom ${I[0]} incomplete`); }
      if (new Set(D.EN_PHRASES.map(p => p[0])).size !== D.EN_PHRASES.length) out.push('phrase ids repeat');
      const ph = new Set(D.EN_PHRASES.map(p => p[0])), NEW = ['zoo', 'beach', 'bus', 'cooking', 'gamenight', 'sleepover', 'sports', 'losttoy', 'sorry', 'newfriend'];
      if (D.EN_TALK.length < 20 || NEW.some(id => !D.EN_TALK.some(S => S.id === id)) || new Set(D.EN_TALK.map(S => S.id)).size !== D.EN_TALK.length) out.push(`chats ${D.EN_TALK.map(S => S.id)}`);
      for (const S of D.EN_TALK) for (const t of S.turns) { if (t[1].length !== 3 || t[1].filter(r => r[1]).length !== 1) out.push(`${S.id}: a turn without exactly one good reply`); if (t[3] && !ph.has(t[3])) out.push(`${S.id}: unknown card ${t[3]}`); }
      for (const s of [0, 240]) { E.E().xp = s; const L = E.oppList(); if (L.length < (s ? 40 : 20) || L.some(o => [o.a, o.b, o.ea, o.eb].some(v => !v || v === 'undefined'))) out.push(`opposites at xp ${s}: ${JSON.stringify(L.slice(0, 2))}`); } E.E().xp = 0;
      if (D.EN_LADDERS.some(L => L.length < 3) || D.EN_COMPOUND.length < 25 || D.EN_HOMO2.length < 20 || D.EN_CATS.length < 8) out.push('word power data');
      const items = E.ITEMS(); if (items.length < 26 + 36 + 20 || items.some(x => !E.unitsOf(x.pages).length)) out.push(`${items.length} read-along items`);
      if (info.families !== D.EN_FAMILIES.length || info.wallSounds !== 44 || info.idioms !== idi.length || info.talks !== D.EN_TALK.length || info.readAlong !== items.length) out.push(`info ${JSON.stringify(info)}`);
      const xp = { 1: 0, 2: 25, 3: 70, 4: 140, 5: 240 }, comps = new Set(D.EN_COMPOUND.map(c => c[0] + c[1]));
      const ok = q => { const v = q.choices.map(c => String(c.val)); return v.includes(String(q.answer)) && new Set(v).size === v.length && v.length >= 2 && !/undefined|NaN|null/.test(q.prompt + q.explain + v.join() + q.choices.map(c => c.html).join()); };
      for (let s = 1; s <= 5; s++) {
        E.E().xp = xp[s];
        for (const [name, mk] of [['pairs', E.pairSpec], ['tricky', E.trickySpec], ['wall', E.wallSpec], ['sort', E.sortSpec], ['odd', E.oddSpec], ['comp', E.compSpec], ['homo', E.homoSpec], ['idiom', E.idiomSpec]]) {
          const spec = mk();
          for (let k = 0; k < 200; k++) {
            const q = spec.gen(); if (!ok(q)) { out.push(`${name}@${s}: ${q.prompt} [${q.choices.map(c => c.val)}] = ${q.answer}`); break; }
            if (name === 'comp' && q.choices.some(c => c.val !== q.answer && comps.has(q.x[0] + c.val))) { out.push(`comp: a wrong answer makes a real word ${q.x[0]}`); break; }
            if (name === 'wall') { const word = q.prompt.replace(/<[^>]+>/g, '').match(/in (\S+)\?/)[1]; if (q.choices.some(c => c.val !== q.answer && E.spells(D.EN_WALL.find(T => T.k === c.val)).some(f => f(word)))) { out.push(`wall: a wrong sound is spelled in ${word}`); break; } }
            if (name === 'pairs' && s === 1 && D.EN_MINPAIRS.some(m => m[4] && (m[0] === q.answer || m[2] === q.answer) && !D.EN_MINPAIRS.some(n => !n[4] && (n[0] === q.answer || n[2] === q.answer)))) { out.push('pairs@1 used a hard pair'); break; }
          }
        }
      }
      E.E().xp = 0;
      return out;
    });
    if (data.length) fail(`data: ${data.slice(0, 6).join(' | ')}`);

    // 2. Home and the three new sections.
    await p.evaluate(() => window.__owl.go(window.__owl.home)); await p.waitForSelector('#tEnglish');
    await p.click('#tEnglish'); await p.waitForSelector('.en-secs');
    const secs = await p.$$eval('[data-sec]', x => x.map(b => b.dataset.sec));
    for (const id of ['soundlab', 'wordpower', 'karaoke', 'talk']) if (!secs.includes(id)) fail(`no ${id} section`);
    if (secs.length !== 19) fail(`${secs.length} sections`);
    await check('english home'); await shot('home');
    const expect = { soundlab: ['[data-lab]', 5], wordpower: ['[data-wp]', 8], karaoke: ['[data-kk]', 26], talk: ['.e6-tk', 20] };
    for (const [id, [sel, n]] of Object.entries(expect)) {
      await p.evaluate(() => window.__english.go('home')); await p.waitForSelector('.en-secs'); await p.click(`[data-sec="${id}"]`);
      try { await p.waitForSelector(sel, { timeout: 4000 }); } catch (e) { fail(`section ${id} did not render`); continue; }
      const got = (await p.$$(sel)).length; if (got < n) fail(`section ${id}: ${got} × ${sel}`);
      if (!(await p.$('.en-ptip'))) fail(`no grown-up tip on ${id}`);
      await check(`section ${id}`); await shot(`sec-${id}`);
    }

    // 3. Word family house: real words count, silly words do not, a repeat does not, a full house gives +2.
    let s0 = await stars();
    await en('famHome'); await p.waitForSelector('[data-fam]');
    if ((await p.$$('[data-fam]')).length < 20) fail('few word family houses'); await check('family street'); await shot('street');
    await p.click('[data-fam="at"]'); await p.waitForSelector('.e10-seg'); await sleep(500); await check('family house'); await shot('house');
    const segOf = real => p.evaluate(real => { const H = window.__english.H4; return H.reel.findIndex(r => H.F.real.some(x => x.w === r.w) === real && !H.found.some(f => f.w === r.w)); }, real);
    const pickSeg = async k => { await p.click(`.e10-seg[data-k="${k}"]`); await sleep(550); };
    let k = await segOf(false); await pickSeg(k); await p.click('#wfCheck'); await sleep(150);
    const sil = await p.evaluate(() => ({ silly: window.__english.H4.silly.length, found: window.__english.H4.found.length, txt: document.getElementById('cheer').textContent, shown: document.getElementById('wfSilly').textContent }));
    if (sil.silly !== 1 || sil.found !== 0 || !/silly/i.test(sil.txt) || !/silly/i.test(sil.shown)) fail(`silly word not refused ${JSON.stringify(sil)}`);
    s0 = await gained('silly word', s0, 0);
    k = await segOf(true); const firstReal = await p.evaluate(k => window.__english.H4.reel[k].w, k); await pickSeg(k); await p.click('#wfCheck'); await sleep(150);
    if (!(await p.evaluate(w => window.__english.H4.found.some(f => f.w === w) && document.querySelector('.e10-win.lit') && window.__english.R4().fam.at[w] === 1, firstReal))) fail(`real word ${firstReal} not accepted`);
    s0 = await gained('real word', s0, 1);
    await pickSeg(await p.evaluate(w => window.__english.H4.reel.findIndex(r => r.w === w), firstReal)); await p.click('#wfCheck'); await sleep(150);
    if (!/already/.test(await p.textContent('#cheer'))) fail('a repeated word was not noticed');
    s0 = await gained('repeat word', s0, 0);
    // The spin wheel lands on a letter and shows it.
    const i0 = await p.evaluate(() => window.__english.H4.i); await p.click('#wfSpin'); await sleep(200);
    if (!(await p.evaluate(() => window.__english.H4.busy))) fail('spin did not start');
    await p.waitForFunction(() => !window.__english.H4.busy, null, { timeout: 4000 });
    const sp = await p.evaluate(() => { const H = window.__english.H4; return { i: H.i, on: document.getElementById('wfOn').textContent, want: H.reel[H.i].on }; });
    if (sp.i === i0 || sp.on !== sp.want) fail(`spin landed badly ${JSON.stringify(sp)} from ${i0}`);
    while (await p.evaluate(() => !window.__english.H4.done)) { await pickSeg(await segOf(true)); await p.click('#wfCheck'); await sleep(150); }
    await p.waitForSelector('.en-reward', { timeout: 5000 }); s0 = await gained('full house', s0, 5); // 3 more words + 2 for the full house
    if (!(await p.evaluate(() => window.__english.E().rounds.fam === 1))) fail('house round not saved');

    // 4. Listening: which did Owl say? (one miss), tricky sounds locked then played, sound wall and sound hunt.
    await en('pairs'); await nextQ(0); await check('pairs'); await shot('pairs');
    if (noSpeech && !(await p.evaluate(() => /Owl says/.test(document.querySelector('.ptext').textContent)))) fail('without speech the word Owl says is not shown');
    await round(6, [1]); s0 = await gained('which did Owl say', s0, 11);
    await en('lab'); await p.waitForSelector('[data-lab]'); await p.click('[data-lab="tricky"]'); await sleep(200);
    if (await p.$('.en-q')) fail('tricky sounds opened at stage 1');
    await setUnlock(true); await en('lab'); await p.click('[data-lab="tricky"]'); await nextQ(0); await check('tricky'); await shot('tricky');
    await round(6); s0 = await gained('tricky sounds', s0, 12); await setUnlock(false);
    await en('wall'); await p.waitForSelector('.e10-brick'); await check('sound wall'); await shot('wall');
    if ((await p.$$('.e10-brick')).length !== 44) fail('the wall does not show 44 bricks');
    for (const k of ['b', 'sh', 'ee']) await p.click(`[data-ws="${k}"]`);
    if (!(await p.$('.e10-dex .e10-dw')) || !(await p.$('.e10-rhyme'))) fail('a brick shows no words or rhyme');
    if ((await p.evaluate(() => Object.keys(window.__english.R4().wall).length)) !== 3) fail('wall bricks not saved'); await sleep(700); await check('wall detail'); await shot('wall-detail');
    s0 = await gained('wall taps', s0, 0);
    await p.evaluate(() => { const e = window.__english.R4(); window.__english.data.EN_WALL.forEach(T => { if (T.k !== 'oi') e.wall[T.k] = 1; }); });
    await en('wall'); await p.waitForSelector('.e10-brick'); await p.click('[data-ws="oi"]'); await sleep(150); await p.click('[data-ws="oi"]'); await p.click('[data-ws="b"]');
    s0 = await gained('whole sound wall', s0, 5);
    if (!(await p.evaluate(() => !!window.__english.R4().wallDone))) fail('wall not marked complete');
    await en('wallQuiz'); await round(6); s0 = await gained('sound hunt', s0, 12);

    // 5. Word power.
    await en('opp'); await p.waitForSelector('.e10-omc'); await check('opposites'); await shot('opposites');
    for (let n = 0; n < 5; n++) {
      const i = await p.evaluate(() => window.__english.OM.pairs.findIndex(x => !x.done));
      await p.click(`[data-om="L${i}"]`);
      if (n === 1) { const j = await p.evaluate(i => window.__english.OM.pairs.findIndex((x, k) => !x.done && k !== i), i); await p.click(`[data-om="R${j}"]`); await sleep(80); }
      await p.click(`[data-om="R${i}"]`); await sleep(80);
    }
    await p.waitForSelector('.en-reward', { timeout: 5000 }); s0 = await gained('opposites match', s0, 9);
    await en('sort'); await nextQ(0); await check('sort'); await shot('sort'); await round(8); s0 = await gained('sort it', s0, 16);
    await en('odd'); await nextQ(0); await check('odd'); await round(6); s0 = await gained('odd one out', s0, 12);
    await en('comp'); await nextQ(0); await check('compound'); await answer(true); await p.waitForSelector('.e10-joined'); await shot('compound');
    for (let i = 1; i < 6; i++) { await nextQ(i); await answer(true); } await p.waitForSelector('.en-reward'); s0 = await gained('compound words', s0, 12);
    await en('ladder'); await p.waitForSelector('.e10-lw'); await check('ladder'); await shot('ladder');
    for (let L = 0; L < 4; L++) {
      await p.waitForFunction(L => window.__english.LD.i === L && !window.__english.LD.done && document.querySelector('.e10-lw:not([disabled])'), L, { timeout: 5000 });
      const words = await p.evaluate(() => window.__english.LD.list[window.__english.LD.i].slice(1));
      if (L === 0) { await p.click(`[data-lw="${words[words.length - 1]}"]`); await sleep(60); }
      for (const w of words) { await p.click(`[data-lw="${w}"]`); await sleep(40); }
    }
    await p.waitForSelector('.en-reward', { timeout: 5000 }); s0 = await gained('word ladders', s0, 7);
    await p.evaluate(() => { window.__english.E().xp = 0; }); // the stars so far have opened stage 2; go back to stage 1
    await en('wp'); await p.waitForSelector('[data-wp]'); await p.click('[data-wp="homo"]'); await sleep(200);
    if (await p.$('.en-q')) fail('sound-alikes opened at stage 1');
    await setUnlock(true); await en('homo'); await nextQ(0); await check('homophones'); await shot('homophones'); await round(6); s0 = await gained('sound-alikes', s0, 12); await setUnlock(false);
    await en('idioms'); await p.waitForSelector('.e10-idc'); await check('idioms'); await p.click('.e10-idc');
    if (!(await p.$('.e10-idc.on'))) fail('a saying card does not flip'); await shot('idioms');
    for (const g of ['simile', 'slang', 'wise']) { await p.click(`[data-ig="${g}"]`); await p.waitForSelector('.e10-idc'); await p.click('.e10-idc'); }
    if ((await p.evaluate(() => Object.keys(window.__english.R4().idi).length)) !== 4) fail('sayings explored not saved');
    await p.click('#idQuiz'); await round(6); s0 = await gained('saying quiz', s0, 12);

    // 6. Read-along: words light up in turn, My turn, stars, and a button on story pages.
    await en('kara'); await p.waitForSelector('[data-kk]'); await check('read-along home'); await shot('kara-home');
    await p.click('[data-kk="s:cathat"]'); await p.waitForSelector('.e10-kw'); await check('read-along'); await shot('kara');
    await p.click('#kSpeed'); // normal → fast
    const order = ['owl', 'mine', 'owl', 'mine', 'owl'];
    for (let u = 0; u < order.length; u++) {
      await p.waitForFunction(u => { const K = window.__english.K; return K && K.u === u && !K.playing && document.querySelector('#kOwl:not([disabled])'); }, u, { timeout: 8000 });
      await p.click(order[u] === 'owl' ? '#kOwl' : '#kMine');
      const seen = [];
      for (let t = 0; t < 40; t++) {
        const st = await p.evaluate(() => { const K = window.__english.K; return { w: K.w, on: [...document.querySelectorAll('.e10-kw')].findIndex(e => e.classList.contains('on')), playing: K.playing, n: document.querySelectorAll('.e10-kw').length }; });
        if (!st.playing) break;
        if (st.on >= 0) seen.push(st.on);
        if (order[u] === 'mine' && t % 2 === 1 && st.w >= 0) await p.click(`.e10-kw[data-kw="${st.w + 1}"]`).catch(() => {});
        await sleep(order[u] === 'owl' ? 110 : 160);
      }
      const ups = seen.filter((v, i) => i && v > seen[i - 1]).length, downs = seen.filter((v, i) => i && v < seen[i - 1]).length;
      if (ups < 2 || downs) fail(`read-along ${order[u]} unit ${u}: highlight did not move on in order ${seen.join(',')}`);
      if (u === 0) await shot('kara-owl');
    }
    await p.waitForSelector('.en-reward', { timeout: 8000 }); s0 = await gained('read-along first time', s0, 4);
    if (!(await p.evaluate(() => window.__english.R4().kara['s:cathat'] === 1))) fail('read-along not saved');
    await p.click('#enAgain'); await p.waitForSelector('.e10-kw');
    for (let u = 0; u < 5; u++) { await p.waitForFunction(u => { const K = window.__english.K; return K.u === u && !K.playing && document.querySelector('#kOwl:not([disabled])'); }, u, { timeout: 8000 }); await p.click('#kOwl'); }
    await p.waitForSelector('.en-reward', { timeout: 8000 }); s0 = await gained('read-along again by Owl', s0, 1);
    await en('story', 'cathat', 2); await p.waitForSelector('#kAlong'); await check('story page with read-along'); await p.click('#kAlong'); await p.waitForSelector('.e10-kw');
    const ku = await p.evaluate(() => [window.__english.K.key, window.__english.K.u]); if (ku[0] !== 's:cathat' || ku[1] !== 2) fail(`read-along from a story page opened ${ku}`);
    await en('book', 'kite', 1, 0); await p.waitForSelector('#kAlong'); await p.click('#kAlong'); await p.waitForSelector('.e10-kw');
    if ((await p.evaluate(() => window.__english.K.key)) !== 'b:kite:1') fail('read-along from a chapter page opened the wrong chapter');
    await en('kara', 'twisters'); await p.waitForSelector('[data-kk="t:0"]'); await check('twisters');

    // 7. A new Talk time chat (a miss on the first turn) and its phrase cards.
    await en('chat', 'zoo'); await p.waitForSelector('.e6-reply'); await check('zoo chat'); await shot('zoo');
    for (let t = 0; t < 4; t++) {
      await p.waitForFunction(t => window.__english.TK.i === t && !window.__english.TK.wait && document.querySelector('.e6-reply:not([disabled])'), t);
      const good = await p.evaluate(() => { const T = window.__english.TK; return T.S.turns[T.i][1].findIndex(r => r[1]); });
      if (t === 0) { const bad = [0, 1, 2].find(j => j !== good); await p.click(`[data-rp="${bad}"]`); await p.waitForSelector('.e6-b.tip'); }
      await p.click(`[data-rp="${good}"]`); await p.waitForSelector('#tkNext'); await p.click('#tkNext');
    }
    await p.waitForSelector('.en-reward'); s0 = await gained('zoo chat', s0, 7);
    if (!(await p.evaluate(() => window.__english.R3().talk.zoo === 1 && window.__english.R3().cards.mayi === 1))) fail('zoo chat or its card not saved');
    await en('cards', 'slang'); await p.waitForSelector('[data-pc="nobiggie"]'); await p.click('[data-pc="nobiggie"]');
    if (!(await p.$('[data-pc="nobiggie"].on'))) fail('a new phrase card does not flip');

    // 8. Report and reload.
    const R = await p.evaluate(() => { const html = window.__report.panel(); return { r4: window.__report.stats(window.__report.shown).E.r4, html }; });
    const r4 = R.r4;
    if (r4.famWords !== 4 || r4.houses !== 1 || r4.wall !== 44 || r4.readAlong !== 1 || r4.idioms < 4 || r4.wordPower !== 7 || r4.listening !== 3) fail(`report ${JSON.stringify(r4)}`);
    if (!R.html.includes('Word family words') || !R.html.includes('Read-along stories')) fail('report panel lacks the round-4 rows');
    const snap = () => p.evaluate(() => { const e = window.__english.R4(); return JSON.stringify([window.__owl.st.stars, e.fam, e.wall, e.kara, e.idi, e.rounds]); });
    const before = await snap();
    await p.reload(); await p.waitForFunction(() => window.__owl && window.__english && window.__english.R4);
    const after = await snap();
    if (before !== after) fail(`progress changed after reload ${before} ${after}`);
    console.log(`${tag}: ${secs.length} sections, stars ${await stars()}, report ${JSON.stringify(r4)}`);
    await ctx.close();
  }
  await b.close();
  console.log('errors', errs.length ? errs.join('\n') : 'none');
  console.log('fails', fails.length ? fails.join('\n') : 'none');
})();
