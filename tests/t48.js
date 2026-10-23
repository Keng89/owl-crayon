// My Book Studio (src/english12.js, english12.css): the child writes their own little books, on a phone (390x844,
// speech) and a tablet (1024x768, no speech at all). Checks the data (120+ word tiles, 20+ story starters, 3 frames)
// and the grammar engine: he/she/it + verb-s, I am / they are, a/an by the next word's sound (an egg, a big egg,
// a unicorn, an orange cat), plurals (cats, two eggs, sheep, mice, boxes), "yesterday" past tense with irregulars
// (ran, went, saw, ate, was/were), he → him after a doing word, can + base verb. Then through the real buttons: the
// ✍️ My Book Studio tile on the English home (20 tiles now), a cover with a tile-built title, three pages built from
// word tiles (the verb tile already shows "runs" after "she"; Done first asks for the big letter, then the end mark;
// Owl reads the finished sentence), stickers placed on each page's picture, exactly 1 star per page and 3 for the book,
// none for finishing it again; the book survives a reload; read-along lights each word in turn and "Read the whole
// book" turns the pages; print builds a printable copy; a fill-the-frame book ("I see an owl. It is big.") and a
// story starter ("Yesterday I" with past-tense tiles). No sideways scroll, 44px labeled buttons.
// Prints "errors none" and "fails none" when clean. Takes PORT (default 8766).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errs = [], fails = [];

(async () => {
  const b = await chromium.launch();
  for (const [w, h, tag, noSpeech] of [[390, 844, 'phone', false], [1024, 768, 'tablet', true]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 500 });
    await ctx.addInitScript(ns => {
      window.__said = []; window.__printed = 0;
      window.print = () => { window.__printed++; };
      if (ns) { try { delete Window.prototype.speechSynthesis; } catch (e) {} try { delete window.speechSynthesis; } catch (e) {} try { delete window.SpeechSynthesisUtterance; } catch (e) {} }
      else { try { speechSynthesis.speak = u => window.__said.push(u.text); } catch (e) {} }
    }, noSpeech);
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(`${tag}: ${e.message}`));
    p.on('console', m => { if (m.type() === 'error' && !/favicon|manifest|sw\.js|service|fonts|Failed to load resource/i.test(m.text())) errs.push(`${tag} console: ${m.text()}`); });
    const fail = m => fails.push(`${tag}: ${m}`);
    const shot = async name => { await sleep(150); await p.screenshot({ path: `${SHOTS}/book-${tag}-${name}.png`, fullPage: true }); };
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (o > 1) fail(`sideways scroll ${o}px at ${where}`); };
    const bigEnough = async where => {
      const small = await p.evaluate(() => [...document.querySelectorAll('#view button')].filter(b => b.offsetParent && !b.disabled).map(b => { const r = b.getBoundingClientRect(); return [b.id || b.className, Math.round(r.width), Math.round(r.height), (b.textContent.trim() || b.getAttribute('aria-label') || '').slice(0, 14)]; }).filter(x => x[1] < 44 || x[2] < 44 || !x[3]));
      if (small.length) fail(`${where}: small or unlabeled buttons ${JSON.stringify(small.slice(0, 4))}`);
    };
    const check = async where => { await noScroll(where); await bigEnough(where); };
    const stars = () => p.evaluate(() => window.__owl.st.stars);
    const said = () => p.evaluate(() => window.__said.join(' | '));
    const strip = () => p.evaluate(() => [...document.querySelectorAll('#ebStrip .eb-w')].map(b => b.textContent).join(' '));
    const tile = async (tab, word) => {
      if (!(await p.$(`.eb-tab.on[data-tab="${tab}"]`))) await p.click(`[data-tab="${tab}"]`);
      const i = await p.evaluate(([tab, word]) => window.__book.TILES[tab].findIndex(t => t.w === word), [tab, word]);
      if (i < 0) { fail(`no ${word} tile in ${tab}`); return; }
      await p.click(`[data-tile="${i}"]`);
    };
    const tileLabel = (tab, word) => p.evaluate(([tab, word]) => { const i = window.__book.TILES[tab].findIndex(t => t.w === word); const b = document.querySelector(`[data-tile="${i}"] b`); return b && b.textContent; }, [tab, word]);
    const msg = () => p.textContent('#ebMsg');
    const place = async (k, fx, fy) => {
      await p.click(`[data-ps="${k}"]`);
      const r = await p.evaluate(() => { const s = document.getElementById('ebScene'); s.scrollIntoView({ block: 'center' }); const r = s.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
      await p.mouse.click(r.x + r.w * fx, r.y + r.h * fy);
    };

    await p.goto(`http://localhost:${PORT}/index.html?r=${Date.now()}#selftest`);
    await p.evaluate(() => localStorage.clear()); await p.reload();
    await p.waitForFunction(() => window.__owl && window.__english && window.__book && document.getElementById('tEnglish'));
    await p.evaluate(() => { const s = window.__owl.st; s.age = 5; s.stars = 0; s.unlockAll = false; s.name = 'Mia'; });

    // 1. The data and the grammar engine.
    const D = await p.evaluate(() => {
      const X = window.__book, bad = [];
      const t = (k, w, d, pl) => k === 'n' ? { k, w, d: d || 'the', pl: pl || 0 } : { k, w };
      const R = (toks, want) => { const got = X.textOf(toks, false, ''); if (got !== want) bad.push(`"${got}" want "${want}"`); };
      R([t('p', 'he'), t('v', 'run')], 'he runs');
      R([t('p', 'she'), t('v', 'go')], 'she goes');
      R([t('nm', 'Sam'), t('v', 'have'), t('n', 'egg', 'a')], 'Sam has an egg');
      R([t('p', 'they'), t('v', 'run')], 'they run');
      R([t('p', 'I'), t('v', 'be'), t('a', 'happy')], 'I am happy');
      R([t('p', 'we'), t('v', 'be'), t('a', 'silly')], 'we are silly');
      R([t('n', 'cat', 'the', 1), t('v', 'eat')], 'the cats eat');
      R([t('n', 'bee'), t('v', 'fly')], 'the bee flies');
      R([t('n', 'fox'), t('v', 'splash')], 'the fox splashes');
      // a / an
      R([t('p', 'I'), t('v', 'see'), t('n', 'egg', 'a')], 'I see an egg');
      R([t('p', 'I'), t('v', 'see'), t('a', 'big'), t('n', 'egg', 'a')], 'I see a big egg');
      R([t('p', 'I'), t('v', 'see'), t('n', 'unicorn', 'a')], 'I see a unicorn');
      R([t('p', 'I'), t('v', 'see'), t('a', 'orange'), t('n', 'cat', 'a')], 'I see an orange cat');
      // plurals
      R([t('p', 'I'), t('v', 'see'), { k: 'num', w: 'two' }, t('n', 'egg', 'a')], 'I see two eggs');
      R([t('p', 'I'), t('v', 'see'), t('n', 'sheep', 'a', 1)], 'I see some sheep');
      R([t('n', 'mouse', 'the', 1), t('v', 'run')], 'the mice run');
      R([t('p', 'I'), t('v', 'have'), { k: 'num', w: 'three' }, t('n', 'box', 'a')], 'I have three boxes');
      R([t('p', 'I'), t('v', 'hug'), t('n', 'teddy', 'my', 1)], 'I hug my teddies');
      // past
      R([t('pp', 'yesterday'), t('p', 'I'), t('v', 'run')], 'yesterday I ran');
      R([t('pp', 'yesterday'), t('p', 'she'), t('v', 'go'), t('pp', 'to the shop')], 'yesterday she went to the shop');
      R([t('pp', 'last night'), t('p', 'we'), t('v', 'see'), t('n', 'owl', 'a')], 'last night we saw an owl');
      R([t('pp', 'yesterday'), t('n', 'dog'), t('v', 'eat'), t('n', 'cake', 'my')], 'yesterday the dog ate my cake');
      R([t('pp', 'yesterday'), t('p', 'he'), t('v', 'jump')], 'yesterday he jumped');
      R([t('pp', 'yesterday'), t('p', 'it'), t('v', 'be'), t('a', 'hot')], 'yesterday it was hot');
      R([t('pp', 'yesterday'), t('p', 'they'), t('v', 'be'), t('a', 'wet')], 'yesterday they were wet');
      // pronouns after a doing word, can, joiners
      R([t('nm', 'Mum'), t('v', 'hug'), t('p', 'he')], 'Mum hugs him');
      R([t('p', 'she'), t('v', 'like'), t('p', 'they')], 'she likes them');
      R([t('n', 'robot'), t('v', 'can'), t('v', 'fly')], 'the robot can fly');
      R([t('n', 'cat'), t('v', 'run'), t('j', 'and'), t('v', 'jump')], 'the cat runs and jumps');
      R([t('pp', 'at the beach'), t('n', 'dog'), t('v', 'swim')], 'at the beach the dog swims');
      // the gentle check
      const c1 = X.check([t('n', 'dog'), t('v', 'run')], false, '.'), c2 = X.check([t('n', 'dog'), t('v', 'run')], true, ''), c3 = X.check([t('n', 'dog'), t('v', 'run')], true, '.');
      const c4 = X.check([t('n', 'dog')], true, '.'), c5 = X.check([t('p', 'I'), t('v', 'run')], false, '!'), c6 = X.check([t('p', 'I'), t('v', 'run'), t('j', 'and')], true, '.');
      if (c1.code !== 'cap' || c2.code !== 'stop' || !c3.ok || c3.text !== 'The dog runs.' || c4.code !== 'verb' || !c5.ok || c5.text !== 'I run!' || c6.code !== 'join') bad.push(`check ${JSON.stringify([c1.code, c2.code, c3.text, c4.code, c5.text, c6.code])}`);
      // the frames, filled
      const T = l => l.map(w => Object.values(X.TILES).flat().find(x => x.w === w));
      const fr = (i, picks) => X.fillFrame(X.FRAMES[i], T(picks)).map((s, j) => X.textOf(s, true, X.FRAMES[i].end[j])).join(' ');
      const f = [fr(0, ['owl', 'big']), fr(1, ['dog', 'run']), fr(2, ['cat', 'soft']), fr(2, ['sheep', 'soft'])];
      if (f[0] !== 'I see an owl. It is big.' || f[1] !== 'My dog can run!' || f[2] !== 'I like cats because they are soft.' || f[3] !== 'I like sheep because they are soft.') bad.push(`frames ${JSON.stringify(f)}`);
      // every story starter renders
      X.PROMPTS.forEach(P => { const r = X.render(P.toks, false); if (!r.words.length) bad.push(`prompt ${P.t}`); });
      return { tiles: X.TILE_COUNT, prompts: X.PROMPTS.length, frames: X.FRAMES.length, stickers: X.STICKERS.length, bad, info: window.__english.info() };
    });
    console.log(tag, `data: ${D.tiles} word tiles, ${D.prompts} story starters, ${D.frames} frames, ${D.stickers} stickers`);
    if (D.tiles < 120 || D.prompts < 20 || D.frames !== 3) fail(`data ${JSON.stringify([D.tiles, D.prompts, D.frames])}`);
    if (D.bad.length) fail('grammar: ' + D.bad.slice(0, 8).join('; '));
    if (D.info.studioTiles !== D.tiles || D.info.studioPrompts !== D.prompts) fail('info lacks the studio counts');

    // 2. The tile on the English home.
    await p.evaluate(() => window.__owl.go(window.__owl.home)); await p.click('#tEnglish'); await p.waitForSelector('.en-secs');
    const secs = await p.$$eval('[data-sec]', x => x.map(b => b.dataset.sec));
    if (!secs.includes('studio') || secs.length !== 20) fail(`sections ${secs.length} ${secs.includes('studio')}`);
    if (!/My Book Studio/.test(await p.textContent('[data-sec="studio"]'))) fail('the studio tile has no name');
    await p.click('[data-sec="studio"]'); await p.waitForSelector('#ebNew');
    if (!(await p.$('.en-ptip'))) fail('no grown-up tip on the studio');
    if ((await p.$$('[data-frame]')).length !== 3) fail('the studio does not show 3 frames');
    await check('studio home'); await shot('home');

    // 3. A new book: the cover.
    let s0 = await stars();
    await p.click('#ebNew'); await p.waitForSelector('#ebStart');
    await p.click('#ebStart'); if (!/title/.test(await msg())) fail('starting with no title was not stopped');
    const tw = await p.evaluate(() => [...document.querySelectorAll('[data-tw]')].map(b => b.textContent));
    for (const word of ['The', 'Silly', 'Cat']) await p.click(`[data-tw="${tw.indexOf(word)}"]`);
    await p.click('[data-cv="🐱"]'); await p.click('[data-col="3"]');
    if ((await p.textContent('.eb-ctitle')) !== 'The Silly Cat') fail(`cover title ${await p.textContent('.eb-ctitle')}`);
    if (!/by Mia/.test(await p.textContent('.eb-cover'))) fail('the cover has no author');
    await check('cover'); await shot('cover');
    await p.click('#ebStart'); await p.waitForSelector('#ebStrip');

    // 4. Page 1, sentence 1: she + run → "runs", the big letter, then the end mark.
    await check('page 1'); await shot('page1');
    await tile('who', 'she');
    if (!(await p.$('.eb-tab.on[data-tab="does"]'))) fail('after a Who word the Does tab did not open');
    const runL = await tileLabel('does', 'run');
    if (runL !== 'runs') fail(`after "she" the run tile says ${runL}`);
    await tile('does', 'run'); await tile('where', 'in the park');
    if ((await strip()) !== 'she runs in the park') fail(`strip "${await strip()}"`);
    if (!/he, she, it: add s → runs/.test(await p.textContent('#ebHelp'))) fail('no agreement tip');
    await p.click('#ebDone');
    if (!/big letter/.test(await msg())) fail(`no big-letter check: ${await msg()}`);
    await p.click('[data-wi="0"]');
    if ((await strip()) !== 'She runs in the park') fail(`capital not given: ${await strip()}`);
    await p.click('#ebDone');
    if (!/end mark|\. ! or \?/.test(await msg())) fail(`no full-stop check: ${await msg()}`);
    if (!(await p.$('.eb-tab.on[data-tab="end"]'))) fail('the end-mark tab did not open');
    await check('end tab');
    await tile('end', '.'); await p.click('#ebDone');
    await p.waitForFunction(() => document.querySelectorAll('.eb-sent').length === 1);
    if ((await p.textContent('.eb-sent span')) !== 'She runs in the park.') fail(`sentence 1: ${await p.textContent('.eb-sent span')}`);
    if (!noSpeech && !(await said()).includes('She runs in the park.')) fail('Owl did not read the sentence');
    // sentence 2: yesterday + we + eat + an apple → "ate", "an apple"
    await p.click('#ebPast');
    await tile('who', 'we');
    if ((await tileLabel('does', 'eat')) !== 'ate') fail(`after yesterday the eat tile says ${await tileLabel('does', 'eat')}`);
    await tile('does', 'eat');
    if (!(await p.$('.eb-dt.on[data-det="a"]'))) fail('the What tab does not default to a/an');
    if ((await tileLabel('what', 'apple')) !== 'an apple') fail(`a/an tile label: ${await tileLabel('what', 'apple')}`);
    await tile('what', 'apple'); await p.click('[data-wi="0"]'); await tile('end', '.');
    if ((await strip()) !== 'Yesterday we ate an apple') fail(`past strip "${await strip()}"`);
    if (!/Yesterday: eat → ate/.test(await p.textContent('#ebHelp'))) fail('no past tense tip');
    await p.click('#ebDone'); await p.waitForFunction(() => document.querySelectorAll('.eb-sent').length === 2);
    const p1 = await p.$$eval('.eb-sent span', x => x.map(e => e.textContent));
    if (p1[1] !== 'Yesterday we ate an apple.') fail(`sentence 2: ${p1[1]}`);
    // page done needs a picture
    await p.click('#ebPageDone');
    if (!/picture/.test(await p.textContent('#ebPMsg'))) fail('a page with no picture was accepted');
    await p.click('[data-bg="grass"]'); await place(0, 0.3, 0.6); await place(5, 0.7, 0.5);
    if ((await p.$$('#ebScene .eb-stk')).length !== 2) fail('stickers were not placed');
    await place(5, 0.5, 0.2); await p.click('#ebScene [data-si="2"]');
    if ((await p.$$('#ebScene .eb-stk')).length !== 2) fail('a tap did not take a sticker off');
    await check('page 1 picture'); await shot('page1-done');
    if (!(await p.$('#ebFinish[disabled]'))) fail('Finish is open with no pages done');
    await p.click('#ebPageDone'); await p.waitForFunction(() => window.__book.PG && window.__book.PG.pi === 1 && document.getElementById('ebStrip'));
    s0 = await stars().then(s => { if (s - s0 !== 1) fail(`page 1 gave ${s - s0} stars`); return s; });

    // 5. Page 2: Sam has two eggs (a name needs no capital tap; number → plural).
    await tile('who', 'Sam'); await tile('does', 'have'); await tile('desc', 'two'); await tile('what', 'egg'); await tile('end', '.');
    if ((await strip()) !== 'Sam has two eggs') fail(`page 2 strip "${await strip()}"`);
    await p.click('#ebDone'); await p.waitForSelector('.eb-sent');
    await place(10, 0.5, 0.5); await p.click('#ebPageDone'); await p.waitForFunction(() => window.__book.PG && window.__book.PG.pi === 2 && document.getElementById('ebStrip'));
    // 6. Page 3: the cats swim (More than one), then Mum hugs him.
    await tile('who', 'cat'); await p.click('#ebMany'); await tile('does', 'swim'); await p.click('[data-wi="0"]'); await tile('end', '.');
    if ((await strip()) !== 'The cats swim') fail(`page 3 strip "${await strip()}"`);
    await p.click('#ebDone'); await p.waitForSelector('.eb-sent');
    await tile('who', 'Mum'); await tile('does', 'hug'); await tile('who', 'he'); await tile('end', '!');
    if ((await strip()) !== 'Mum hugs him') fail(`page 3 strip 2 "${await strip()}"`);
    await p.click('#ebDone'); await p.waitForFunction(() => document.querySelectorAll('.eb-sent').length === 2);
    await place(1, 0.4, 0.6);
    if (await p.$('#ebFinish[disabled]')) fail('Finish is closed with 3 pages written');
    s0 = await stars().then(s => { if (s - s0 !== 1) fail(`page 2 gave ${s - s0} stars`); return s; });
    await p.click('#ebFinish'); await p.waitForSelector('#ebReadIt');
    let s1 = await stars(); if (s1 - s0 !== 4) fail(`page 3 + the book gave ${s1 - s0} stars, want 4`);
    await check('book done'); await shot('done');
    const bk = await p.evaluate(() => { const b = window.__book.M().list[0]; return { done: b.done, n: b.pages.length, title: b.title.join(' '), s: b.pages.map(p => p.s.join(' ')), st: b.pages.map(p => p.st.length) }; });
    const want = ['She runs in the park. Yesterday we ate an apple.', 'Sam has two eggs.', 'The cats swim. Mum hugs him!'];
    if (!bk.done || bk.n !== 3 || JSON.stringify(bk.s) !== JSON.stringify(want) || bk.st.some(n => n < 1)) fail(`saved book ${JSON.stringify(bk)}`);

    // 7. Reload: still there.
    await p.reload(); await p.waitForFunction(() => window.__book && window.__english);
    const bk2 = await p.evaluate(() => { const b = window.__book.M().list[0]; return b && { done: b.done, s: b.pages.map(p => p.s.join(' ')), title: b.title.join(' ') }; });
    if (!bk2 || !bk2.done || JSON.stringify(bk2.s) !== JSON.stringify(want) || bk2.title !== 'The Silly Cat') fail(`after reload ${JSON.stringify(bk2)}`);

    // 8. The bookshelf and read-along.
    await p.evaluate(() => window.__english.go('studio')); await p.waitForSelector('#ebShelf');
    if (!/The Silly Cat/.test(await p.textContent('#ebShelf'))) fail('the book is not on the shelf');
    await check('shelf'); await shot('shelf');
    await p.click('[data-book]'); await p.waitForSelector('#ebRead');
    if (!/The Silly Cat/.test(await p.textContent('.eb-ctitle'))) fail('reading does not start at the cover');
    await p.click('#ebNext'); await p.waitForFunction(() => window.__book.RD && window.__book.RD.pg === 0);
    await p.evaluate(() => { window.__lit = []; const t = document.getElementById('ebText'); new MutationObserver(() => { const l = t.querySelector('.eb-rw.lit'); if (l) { const i = [...t.querySelectorAll('.eb-rw')].indexOf(l); if (window.__lit[window.__lit.length - 1] !== i) window.__lit.push(i); } }).observe(t, { subtree: true, attributes: true }); });
    await p.evaluate(() => { window.__said.length = 0; });
    await p.click('#ebRead');
    await p.waitForFunction(() => window.__book.RD.read >= 1, null, { timeout: 15000 });
    const lit = await p.evaluate(() => window.__lit), nw = await p.$$eval('#ebText .eb-rw', x => x.length);
    if (lit.length !== nw || lit.some((v, i) => v !== i)) fail(`read-along lit ${JSON.stringify(lit)} of ${nw} words`);
    if (!noSpeech && !(await said()).includes('She runs in the park. Yesterday we ate an apple.')) fail(`read-along did not read the page: ${await said()}`);
    await check('read page'); await shot('read');
    await p.click('#ebAll'); await p.waitForFunction(() => window.__book.RD && window.__book.RD.pg === 2 && window.__book.RD.read >= 1, null, { timeout: 40000 });
    if ((await p.evaluate(() => window.__book.M().reads)) !== 1) fail('reading the whole book was not counted');
    // print
    await p.click('#ebPrintBtn');
    const pr = await p.evaluate(() => ({ n: window.__printed, pages: document.querySelectorAll('#ebPrint .eb-pp').length, cls: document.body.classList.contains('eb-printing'), text: document.getElementById('ebPrint').textContent }));
    if (pr.n !== 1 || pr.pages !== 4 || !pr.cls || !pr.text.includes('Sam has two eggs.')) fail(`print ${JSON.stringify(pr)}`);
    await p.evaluate(() => window.dispatchEvent(new Event('afterprint')));
    // finishing the same book again gives nothing
    s0 = await stars();
    await p.click('#ebEdit'); await p.waitForSelector('#ebFinish'); await p.click('#ebFinish'); await p.waitForSelector('#ebReadIt');
    if ((await stars()) !== s0) fail('finishing a book again gave stars');

    // 9. Fill the frame: I see an owl. It is big.
    await p.evaluate(() => window.__english.go('studio')); await p.click('[data-frame="0"]'); await p.waitForSelector('#ebFrame');
    await check('frame'); await shot('frame');
    const fi = await p.evaluate(() => ({ owl: [...document.querySelectorAll('[data-slot]')].findIndex(b => b.textContent.includes('owl')) }));
    await p.click(`[data-slot="${fi.owl}"]`);
    const bi = await p.evaluate(() => [...document.querySelectorAll('[data-slot]')].findIndex(b => b.querySelector('b').textContent === 'big'));
    await p.click(`[data-slot="${bi}"]`); await p.waitForSelector('#ebUse');
    const ft = (await p.$$eval('#ebFrame p', x => x.map(e => e.textContent).join(' '))).replace(/\s+/g, ' ').trim();
    if (ft !== 'I see an owl. It is big.') fail(`frame "${ft}"`);
    await p.click('#ebUse'); await p.waitForSelector('.eb-sent');
    if ((await p.$$('#ebScene .eb-stk')).length !== 1) fail('the frame page got no picture');
    await p.click('#ebPageDone'); await p.waitForFunction(() => window.__book.PG && window.__book.PG.pi === 1 && document.getElementById('ebFrame'));

    // 10. A story starter: Yesterday I … with past-tense tiles.
    await p.evaluate(() => window.__english.go('ideas')); await p.waitForSelector('[data-idea]');
    if ((await p.$$('[data-idea]')).length < 20) fail('fewer than 20 story starters');
    await check('ideas'); await shot('ideas');
    const yi = await p.evaluate(() => window.__book.PROMPTS.findIndex(P => /^Yesterday I/.test(P.t)));
    await p.click(`[data-idea="${yi}"]`); await p.waitForSelector('#ebStrip');
    if ((await strip()) !== 'yesterday I') fail(`starter strip "${await strip()}"`);
    if ((await tileLabel('does', 'go')) !== 'went' || (await tileLabel('does', 'see')) !== 'saw') fail('past tense tiles do not show went/saw');
    await tile('does', 'go'); await tile('where', 'to the shop'); await p.click('[data-wi="0"]'); await tile('end', '.');
    await p.click('#ebDone'); await p.waitForSelector('.eb-sent');
    if ((await p.textContent('.eb-sent span')) !== 'Yesterday I went to the shop.') fail(`starter sentence ${await p.textContent('.eb-sent span')}`);
    await check('starter page');
    // the report mentions the studio
    const rp = await p.evaluate(() => window.__report.panel());
    if (!/My Book Studio/.test(rp) || !/1 book written/.test(rp)) fail('the grown-ups report lacks My Book Studio');
    // a damaged save still renders
    await p.evaluate(() => { window.__english.E().mybooks = { list: [null, 5, { id: 'x', title: 'oops', pages: [null, { s: 3 }] }], stars: 7 }; });
    await p.evaluate(() => window.__english.go('studio')); await p.waitForSelector('#ebNew');
    await p.evaluate(() => window.__english.go('bookRead', 'x', 0));
    await ctx.close();
  }
  await b.close();
  console.log('errors', errs.length ? errs.join('\n') : 'none');
  console.log('fails', fails.length ? fails.join('\n') : 'none');
})();
