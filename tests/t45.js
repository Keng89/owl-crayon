// Painting Studio (src/art12.js lessons, src/paint.js and paint.css) on a phone (390x844, speech) and a tablet
// (820x1180, no speech). Checks: 40+ new painting lessons in 7 techniques at 4 levels (Easy to Expert), with the asked-for
// subjects; every lesson keeps one paper and every step names a real brush, a colour and that paper; the lessons are
// still built lazily (not at startup); the studio opens from Art School (tile and the Painting Studio group) with
// technique and level filters; every new lesson opens with the right brush and paper and every step renders (no NaN,
// the pad's brush, paper and colour follow each step, a mixed colour gets its own swatch); finishing one gives 3 stars
// and "Hang it in my gallery" hangs the painting; the colour model (red + yellow = orange, blue + yellow = green,
// red + blue = purple, tints with white are lighter, shades with black darker, warm and cool); mixing by dragging
// blobs together with real pointer moves, and by dragging a pot onto a blob (a new colour gives 1 star once); the colour
// wheel (6 colours with one miss gives 2, 12 colours with none gives 5); "Match the color" (5 colours with one miss
// gives exactly 9); warm or cool sorting (2); the gallery wall (hang with a frame, change the frame, take down, a
// slideshow that moves on by itself, pauses, steps and closes, and stops when leaving); progress kept in st.paint after a
// reload; What's inside counts the lessons; no sideways scroll and 44px labeled buttons. Prints "errors none" and
// "fails none" when clean. Takes PORT (default 8766). Screenshots go to SHOTS.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errs = [], fails = [];
const MUST = ['ps-wetsky', 'ps-sunset', 'ps-rfish', 'ps-misty', 'ps-flowers', 'ps-sunflowers', 'ps-waves', 'ps-seasons', 'ps-city', 'ps-space', 'ps-fireworks', 'ps-cat', 'ps-bamboo', 'ps-portrait',
  'ps-sgalaxy', 'ps-graffiti', 'ps-starry', 'ps-lilies', 'ps-kandinsky', 'ps-matisse', 'ps-seurat'];

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
    const shot = async name => { await sleep(250); await p.screenshot({ path: `${SHOTS}/paint-${tag}-${name}.png`, fullPage: true }); };
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (o > 1) fail(`sideways scroll ${o}px at ${where}`); };
    const bigEnough = async where => {
      const small = await p.evaluate(() => [...document.querySelectorAll('#view button, #view [role=button]')].filter(b => b.offsetParent !== null && !b.disabled && b.tagName !== 'path').map(b => { const r = b.getBoundingClientRect(); return [b.id || b.className, Math.round(r.width), Math.round(r.height), (b.textContent.trim() || b.getAttribute('aria-label') || '').slice(0, 14)]; }).filter(x => x[1] < 44 || x[2] < 44 || !x[3]));
      if (small.length) fail(`${where}: small or unlabeled buttons ${JSON.stringify(small.slice(0, 4))}`);
    };
    const check = async where => { await noScroll(where); await bigEnough(where); };
    const stars = () => p.evaluate(() => window.__owl.st.stars);
    const P = (fn, ...a) => p.evaluate(([fn, a]) => window.__paint[fn](...a), [fn, a]);
    const center = async sel => { const bx = await p.locator(sel).first().boundingBox(); return [bx.x + bx.width / 2, bx.y + bx.height / 2]; };
    const drag = async (from, to, steps = 10) => { await p.mouse.move(...from); await p.mouse.down(); for (let i = 1; i <= steps; i++) await p.mouse.move(from[0] + (to[0] - from[0]) * i / steps, from[1] + (to[1] - from[1]) * i / steps); await p.mouse.up(); };

    await p.goto(`http://localhost:${PORT}/index.html?r=${Date.now()}#selftest`);
    await p.evaluate(() => localStorage.clear()); await p.reload();
    await p.waitForFunction(() => window.__owl && window.__paint);
    // 1. Still lazy: the lesson builders wait at startup.
    const pend = await p.evaluate(() => window.__owl.artPending);
    if (!(pend >= 10)) fail(`art lessons were built at startup (${pend} waiting)`);
    await p.evaluate(a => { const s = window.__owl.st; s.age = a; s.stars = 0; s.unlockAll = true; }, age);

    // 2. The data.
    const D = await p.evaluate(() => {
      const L = window.__owl.LESSONS.filter(l => l.studio), B = window.__owl.BRUSHES, papers = B.PAPERS.map(x => x.id), brushes = B.LIST.map(x => x.id);
      const bad = [];
      for (const l of L) {
        if (!papers.includes(l.paper)) bad.push(`${l.id} paper ${l.paper}`);
        if (!(l.plevel >= 1 && l.plevel <= 4) || ![1, 2, 3].includes(l.level)) bad.push(`${l.id} level ${l.plevel}/${l.level}`);
        if (!l.need || !l.tip || l.steps.length < 5) bad.push(`${l.id} need/tip/steps`);
        if (l.brush !== l.steps[0][2].brush) bad.push(`${l.id} first brush`);
        l.steps.forEach((s, i) => { const o = s[2] || {}; if (!brushes.includes(o.brush) || o.paper !== l.paper || !/^#[0-9A-F]{6}$/i.test(o.color || '') || !s[0] || /NaN|undefined/.test(s[1])) bad.push(`${l.id} step ${i + 1} ${JSON.stringify(o)}`); });
      }
      const ids = L.map(l => l.id);
      return { n: L.length, uniq: new Set(window.__owl.LESSONS.map(l => l.id)).size === window.__owl.LESSONS.length, ids, cats: [...new Set(L.map(l => l.cat))], lv: [1, 2, 3, 4].map(n => L.filter(l => l.plevel === n).length),
        perCat: Object.fromEntries([...new Set(L.map(l => l.cat))].map(c => [c, [L.filter(l => l.cat === c).length, new Set(L.filter(l => l.cat === c).map(l => l.plevel)).size]])), bad,
        catsKnown: [...new Set(L.map(l => l.cat))].every(c => window.__owl.ART_CATS.some(x => x.id === c)), info: window.__paint.info() };
    });
    console.log(tag, 'painting lessons', D.n, 'levels', D.lv.join('/'), 'kinds', D.cats.length);
    if (D.n < 40) fail(`only ${D.n} painting lessons`);
    if (!D.uniq) fail('lesson ids are not unique');
    if (D.cats.length !== 7 || !D.catsKnown) fail(`painting kinds ${D.cats}`);
    if (D.lv.some(n => n < 4)) fail(`levels ${D.lv}`);
    for (const [c, [n, lv]] of Object.entries(D.perCat)) if (n < 5 || lv < 3) fail(`${c}: ${n} lessons at ${lv} levels`);
    for (const id of MUST) if (!D.ids.includes(id)) fail(`missing lesson ${id}`);
    if (D.bad.length) fail(`bad lesson data ${D.bad.slice(0, 5)}`);
    if (D.info.lessons !== D.n) fail('info() lesson count');

    // 3. Art School shows the studio tile and the Painting Studio kinds; the studio home filters.
    await p.evaluate(() => window.__owl.go(window.__owl.home)); await p.click('#tArt');
    if (!(await p.$('[data-tool="studio"]'))) fail('no Painting Studio tile in Art School');
    const grp = await p.evaluate(() => [...document.querySelectorAll('.section-title.sub')].map(x => x.textContent));
    if (!grp.some(t => /Painting Studio/.test(t))) fail(`no Painting Studio group in Art School: ${grp}`);
    for (const c of D.cats) if (!(await p.$(`[data-cat="${c}"]`))) fail(`Art School has no ${c}`);
    await p.click('[data-tool="studio"]'); await p.waitForSelector('.ps-lessons');
    await check('studio home'); await shot('studio');
    const cards = () => p.$$eval('.ps-lessons [data-l]', x => x.length);
    if (await cards() !== D.n) fail(`studio home shows ${await cards()} lessons`);
    await p.click('[data-tab="ps-chalk"]'); const chalkN = await cards();
    if (chalkN !== D.perCat['ps-chalk'][0]) fail(`chalk tab shows ${chalkN}`);
    await p.click('[data-lv="4"]'); const ex = await p.$$eval('.ps-lessons [data-l]', x => x.map(e => e.querySelector('.lvl-tag').textContent));
    if (!ex.length || ex.some(t => t !== 'Expert')) fail(`expert filter ${ex}`);
    await p.click('[data-lv="0"]'); await p.click('[data-tab="all"]');
    // open one from a real tap
    await p.click('[data-tab="ps-water"]'); await p.click('[data-l="ps-wetsky"]'); await p.waitForSelector('#cv');
    let sel = await p.evaluate(() => [window.__owl.livePad.brush(), window.__owl.livePad.paper()]);
    if (sel.join() !== 'watercolor,wc') fail(`wet-on-wet sky opened with ${sel}`);
    await check('studio lesson'); await shot('lesson');
    await p.click('#backBtn'); if (!(await p.$('.ps-lessons'))) fail('Back from a studio lesson did not go to the studio');

    // 4. Every new lesson opens with its brush and paper, and every step renders and sets the pad up.
    const list = tag === 'phone' ? D.ids : D.ids.filter((_, i) => i % 3 === 0);
    let steps = 0;
    for (const id of list) {
      await p.evaluate(id => window.__owl.go(window.__owl.drawLesson, id), id);
      const L = await p.evaluate(id => { const l = window.__owl.LESSONS.find(x => x.id === id); return { n: l.steps.length, o: l.steps.map(s => s[2]), brush: l.brush, paper: l.paper }; }, id);
      sel = await p.evaluate(() => [window.__owl.livePad.brush(), window.__owl.livePad.paper()]);
      if (sel.join() !== `${L.brush},${L.paper}`) fail(`${id} opened with ${sel}, want ${L.brush},${L.paper}`);
      for (let i = 0; i < L.n; i++) {
        const r = await p.evaluate(() => { const s = document.querySelector('#gsvg svg'), pad = window.__owl.livePad, sw = document.querySelector('.sw[aria-pressed=true]');
          return { html: s ? s.innerHTML : '', step: document.querySelector('#sn').textContent, b: pad.brush(), pa: pad.paper(), c: pad.color(), z: pad.size(), sw: sw ? sw.dataset.c : null }; });
        const o = L.o[i];
        if (r.html.length < 60 || /NaN|undefined/.test(r.html)) fail(`${id} step ${i + 1} did not render`);
        if (r.step !== `Step ${i + 1} of ${L.n}`) fail(`${id} step label ${r.step}`);
        if (r.b !== o.brush || r.pa !== o.paper || r.c !== o.color.toUpperCase() || (o.size && r.z !== o.size)) fail(`${id} step ${i + 1}: pad ${r.b}/${r.pa}/${r.c}/${r.z}, step wants ${o.brush}/${o.paper}/${o.color}/${o.size}`);
        if (r.sw !== o.color.toUpperCase()) fail(`${id} step ${i + 1}: swatch ${r.sw} not pressed for ${o.color}`);
        steps++;
        if (i < L.n - 1) await p.click('#next');
      }
      if (id === 'ps-portrait') await check('lesson last step');
    }
    console.log(tag, 'lessons walked', list.length, 'steps', steps);
    // A mixed colour shows its own swatch.
    await p.evaluate(() => window.__owl.go(window.__owl.drawLesson, 'ps-misty'));
    if (await p.$eval('.sw-mix', e => e.hidden || e.dataset.c !== '#8EC5F5')) fail('the lesson colour light blue has no swatch');

    // 5. Finish a painting: 3 stars, and hang it in the gallery.
    await p.evaluate(() => window.__owl.go(window.__owl.drawLesson, 'ps-space'));
    await p.locator('#cv').scrollIntoViewIfNeeded(); const cv = await p.locator('#cv').boundingBox();
    await drag([cv.x + cv.width * 0.3, cv.y + cv.height * 0.3], [cv.x + cv.width * 0.6, cv.y + cv.height * 0.5]);
    await sleep(300);
    const nSteps = await p.evaluate(() => window.__owl.LESSONS.find(l => l.id === 'ps-space').steps.length);
    for (let i = 0; i < nSteps - 1; i++) await p.click('#next');
    let s0 = await stars(); await p.click('#next'); await p.waitForSelector('#psHangIt');
    if (await stars() - s0 !== 3) fail(`finishing a painting gave ${await stars() - s0} stars`);
    await check('painting done'); await shot('done');
    await p.click('#psHangIt'); await sleep(200);
    if ((await P('hung')).length !== 1) fail('Hang it in my gallery did not hang the painting');
    if (!/See my gallery/.test(await p.textContent('#psHangIt'))) fail('hang button did not change');
    await p.click('#psHangIt'); await p.waitForSelector('.ps-wall .ps-frame.f-gold');

    // 6. The colour model.
    const cm = await p.evaluate(() => { const T = window.__paint; const c = o => [T.mixHex(o), T.colorName(o), T.kindOf(o), T.tempOf(o)];
      const lum = o => T.mixRGB(o).reduce((a, b) => a + b, 0);
      return { ry: c({ r: 1, y: 1 }), yb: c({ y: 1, b: 1 }), rb: c({ r: 1, b: 1 }), r: c({ r: 1 }), rw: c({ r: 1, w: 1 }), bk: c({ b: 1, k: 1 }), ryb: c({ r: 1, y: 1, b: 1 }), wk: c({ w: 1, k: 1 }), r2y: c({ r: 2, y: 1 }), yw: c({ y: 1, w: 3 }),
        tint: lum({ b: 1, w: 1 }) > lum({ b: 1 }), shade: lum({ b: 1, k: 1 }) < lum({ b: 1 }), same: T.mixHex({ r: 2, y: 2 }) === T.mixHex({ r: 1, y: 1 }), ex: T.explain({ r: 1, y: 1 }) }; });
    const want = { ry: ['#FF8A2B', 'orange', 'secondary', 'warm'], yb: ['#2FA36B', 'green', 'secondary', 'cool'], rb: ['#6D55D1', 'purple', 'secondary', 'cool'], r: ['#F2604F', 'red', 'primary', 'warm'],
      rw: [null, 'pink', 'tint', 'warm'], bk: [null, 'navy blue', 'shade', 'cool'], ryb: ['#8B5A2B', 'brown', 'neutral', 'warm'], wk: [null, 'grey', 'neutral', 'neutral'], r2y: [null, 'red-orange', 'tertiary', 'warm'], yw: [null, 'very light yellow', 'tint', 'warm'] };
    for (const [k, v] of Object.entries(want)) v.forEach((x, i) => { if (x != null && cm[k][i] !== x) fail(`colour ${k}: ${cm[k]} want ${v}`); });
    if (!cm.tint || !cm.shade || !cm.same) fail(`tint ${cm.tint} shade ${cm.shade} same ratio ${cm.same}`);
    if (!/secondary/.test(cm.ex) || !/warm/.test(cm.ex)) fail(`explain: ${cm.ex}`);

    // 7. Mixing by dragging blobs together (real pointer moves), and a pot dragged onto a blob.
    await P('lab'); await check('color lab'); await shot('lab');
    await p.click('[data-go="mix"]'); await p.waitForSelector('#psTray');
    await p.locator('#psTray').scrollIntoViewIfNeeded();
    s0 = await stars();
    await p.click('[data-pot="r"]'); await p.click('[data-pot="y"]');
    if (await p.$$eval('.ps-blob', x => x.length) !== 2) fail('tapping two pots did not make two blobs');
    let bl = await p.$$eval('.ps-blob', x => x.map(e => { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2, e.dataset.name]; }));
    await drag([bl[0][0], bl[0][1]], [bl[1][0] + 3, bl[1][1] + 2], 12); await sleep(700);
    bl = await p.$$eval('.ps-blob', x => x.map(e => [e.dataset.name, e.dataset.hex, getComputedStyle(e).backgroundColor]));
    if (bl.length !== 1 || bl[0][0] !== 'orange' || bl[0][1] !== '#FF8A2B' || bl[0][2] !== 'rgb(255, 138, 43)') fail(`red onto yellow made ${JSON.stringify(bl)}`);
    if (await stars() - s0 !== 1) fail(`a new colour gave ${await stars() - s0} stars`);
    if (!/secondary/.test(await p.textContent('#psSay'))) fail('mixing did not explain secondary colours');
    // the same colour again: no star
    s0 = await stars(); await p.click('#psClear');
    await p.click('[data-pot="r"]'); await p.click('[data-pot="y"]');
    bl = await p.$$eval('.ps-blob', x => x.map(e => { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }));
    await drag(bl[1], [bl[0][0] - 2, bl[0][1] + 2]); await sleep(200);
    if (await stars() !== s0) fail('the same colour gave another star');
    // drag the white pot straight onto the orange blob: a tint
    const ob = await p.$eval('.ps-blob', e => { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    await drag(await center('[data-pot="w"]'), ob, 14); await sleep(300);
    bl = await p.$$eval('.ps-blob', x => x.map(e => e.dataset.name));
    if (bl.length !== 1 || bl[0] !== 'light orange') fail(`white pot onto orange made ${bl}`);
    if (!/tint/.test(await p.textContent('#psSay'))) fail('white did not explain tints');
    // black: a shade
    await p.click('#psClear'); await p.click('[data-pot="b"]'); await p.click('[data-pot="k"]');
    bl = await p.$$eval('.ps-blob', x => x.map(e => { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }));
    await drag(bl[1], bl[0]); await sleep(200);
    if (await p.$eval('.ps-blob', e => e.dataset.name) !== 'navy blue' || !/shade/.test(await p.textContent('#psSay'))) fail('blue and black did not make a navy shade');
    if (!(await P('ps')).lab.found.includes('navy blue')) fail('navy blue not saved as found');
    await check('mixing'); await shot('mix');

    // 8. Colour wheel: 6 colours with one miss = 2 stars; 12 colours with none = 5.
    const playWheel = async (big, miss) => {
      await P('wheel', big); await p.waitForSelector('.ps-wheel');
      const S = await p.evaluate(() => { const s = window.__paint.wheelState; return { W: s.W.map(x => x[0]), placed: [...s.placed] }; });
      const st0 = await stars(); let missed = !miss;
      for (const nm of S.W.filter(n => !S.placed.includes(n))) {
        await p.click(`[data-chip="${nm}"]`);
        if (!missed) { const wrong = S.W.findIndex(n => !S.placed.includes(n) && n !== nm); await p.click(`[data-slot="${wrong}"]`); missed = true; }
        await p.click(`[data-slot="${S.W.indexOf(nm)}"]`);
      }
      await sleep(200);
      return [await stars() - st0, await p.evaluate(() => window.__paint.wheelState.done)];
    };
    let [ws, wd] = await playWheel(false, true);
    if (ws !== 2 || !wd) fail(`small wheel with a miss gave ${ws} stars (done ${wd})`);
    await check('wheel'); await shot('wheel');
    [ws, wd] = await playWheel(true, false);
    if (ws !== 5 || !wd) fail(`big wheel gave ${ws} stars (done ${wd})`);
    // a chip dragged onto its place works too
    await P('wheel', false); await p.waitForSelector('.ps-wheel');
    await drag(await center('[data-chip="green"]'), await center('[data-slot="3"]'), 8); await sleep(200);
    if (!(await p.evaluate(() => window.__paint.wheelState.placed.has('green')))) fail('dragging the green chip onto the wheel did not place it');

    // 9. Match the color: 5 colours, one miss on the first = 9 stars, shown on the end panel and kept as best.
    await P('match', 0); await p.waitForSelector('#psCheck');
    s0 = await stars();
    for (let i = 0; i < 5; i++) {
      const t = await p.evaluate(() => window.__paint.M.targets[window.__paint.M.i]);
      if (i === 0) { const wrongK = ['r', 'y', 'b', 'w', 'k'].find(k => !t[k]); await p.click(`[data-drop="${wrongK}"]`); await p.click('#psCheck'); if (!/Not quite/.test(await p.textContent('#psSay'))) fail('a wrong colour was not refused'); await p.click('#psEmpty'); }
      for (const [k, n] of Object.entries(t)) for (let j = 0; j < n; j++) await p.click(`[data-drop="${k}"]`);
      if (await p.$eval('#psDr', e => e.textContent) !== String(t.r || 0)) fail('drop counter');
      await p.click('#psCheck');
      if (!/Perfect match/.test(await p.textContent('#psSay'))) fail(`colour ${i + 1} not matched: ${await p.textContent('#psSay')}`);
      await sleep(1600);
    }
    await p.waitForSelector('#psEnd');
    const got = await stars() - s0;
    if (got !== 9) fail(`match the color gave ${got} stars, want 9`);
    if (!/9 ⭐/.test(await p.textContent('#psEnd'))) fail(`end panel: ${await p.textContent('#psEnd')}`);
    if ((await P('ps')).lab.matchBest !== 9) fail('best match not kept');
    await check('match end'); await shot('match');

    // 10. Warm or cool: all right = 2 stars.
    await P('sort'); s0 = await stars();
    const chips = await p.$$eval('[data-c]', x => x.map(e => [e.dataset.c, e.dataset.t]));
    for (const [c, t] of chips) { await p.click(`[data-c="${c}"]`); await p.click(`[data-bin="${t}"]`); }
    if (await stars() - s0 !== 2) fail(`warm or cool gave ${await stars() - s0}`);
    await check('sort');

    // 11. The gallery wall: hang with a frame, change it, take it down, and a slideshow.
    for (let k = 0; k < 2; k++) {
      await p.evaluate(() => window.__owl.go(window.__owl.drawLesson, 'ps-mondrian'));
      await p.locator('#cv').scrollIntoViewIfNeeded(); const c2 = await p.locator('#cv').boundingBox();
      await drag([c2.x + 20 + k * 30, c2.y + 30], [c2.x + c2.width - 30, c2.y + c2.height - 40 - k * 20]); await sleep(300);
      await p.click('#sav'); await sleep(200);
    }
    await P('wall'); await check('wall'); await p.click('#psHang'); await p.waitForSelector('.ps-pick');
    await p.click('[data-fr="rainbow"]');
    const free = await p.$$eval('.ps-pbtn:not(.on)', x => x.map(e => e.dataset.g));
    await p.click(`[data-g="${free[0]}"]`); await p.waitForSelector('.ps-wall');
    let H = await P('hung');
    if (H.length !== 2 || H[0].f !== 'rainbow') fail(`hanging with a rainbow frame: ${JSON.stringify(H.map(x => x.f))}`);
    if (!(await p.$('.ps-wall .ps-frame.f-rainbow'))) fail('rainbow frame not shown');
    await p.click('#psHang'); await p.click(`[data-g="${free[1]}"]`); await p.waitForSelector('.ps-wall');
    await p.click('[data-hung="0"]'); await p.click('[data-fr="wood"]'); await p.waitForSelector('.ps-wall');
    H = await P('hung'); if (H[0].f !== 'wood') fail(`frame change: ${H[0].f}`);
    await check('wall full'); await shot('wall');
    await p.click('[data-hung="1"]'); await p.click('#psDown'); await p.waitForSelector('.ps-wall');
    if ((await P('hung')).length !== 2) fail('take it down');
    // slideshow
    await p.click('#psShow'); await p.waitForSelector('.ps-show');
    const cap = () => p.textContent('#psCap');
    if (await cap() !== '1 of 2') fail(`slideshow starts at ${await cap()}`);
    await sleep(3300); if (await cap() !== '2 of 2') fail(`slideshow did not move on: ${await cap()}`);
    await shot('slideshow');
    await p.click('#psPlay'); await sleep(3300); if (await cap() !== '2 of 2') fail('pause did not stop the slideshow');
    await p.click('#psNext'); if (await cap() !== '1 of 2') fail('next in the slideshow');
    await p.click('#psPrev'); if (await cap() !== '2 of 2') fail('back in the slideshow');
    await bigEnough('slideshow'); await noScroll('slideshow');
    await p.click('#psClose'); if (await p.$('.ps-show')) fail('close did not close the slideshow');
    await p.click('#psShow'); await p.waitForSelector('.ps-show'); await p.evaluate(() => window.__owl.go(window.__owl.home)); await sleep(300); // e.g. the play-time limit
    if (await p.$('.ps-show') || await p.evaluate(() => !!window.__paint.show)) fail('the slideshow kept running after Home');
    // My pictures links to the wall
    await p.evaluate(() => window.__owl.go(window.__owl.galTab));
    if (!/My gallery wall \(2\)/.test(await p.textContent('#psToWall'))) fail('My pictures has no gallery wall button');

    if (tag === 'phone') { const said = await p.evaluate(() => window.__said.join(' | ')); if (!/makes orange/.test(said) || !/Painting Studio/.test(said)) fail('studio and mixing were not read aloud'); }

    // 12. Saved in the player's state, and kept after a reload.
    const saved = await p.evaluate(() => { const id = JSON.parse(localStorage.getItem('owlcrayon:current') || '"p1"'); const s = JSON.parse(localStorage.getItem('owlcrayon:state:' + id)); return s && s.paint; });
    if (!saved || saved.wall.length !== 2 || saved.lab.matchBest !== 9 || saved.lab.wheel < 1 || saved.lab.bigWheel < 1 || !saved.lab.found.includes('orange')) fail(`saved state ${JSON.stringify(saved && { w: saved.wall.length, l: saved.lab })}`);
    const before = await stars();
    await p.reload(); await p.waitForFunction(() => window.__owl && window.__paint);
    if ((await P('hung')).length !== 2 || await stars() !== before) fail('the wall or stars were lost after a reload');
    if (!(await p.evaluate(() => window.__owl.st.art.done['ps-space']))) fail('finished painting not kept');

    // 13. What's inside counts the painting lessons.
    const inside = await p.evaluate(() => { window.__tour.inside(); return document.getElementById('view').innerText.replace(/\s+/g, ' '); });
    if (!inside.includes(`${D.n} painting lessons`)) fail('What\'s inside does not count the painting lessons');
    const all = await p.evaluate(() => window.__owl.LESSONS.length);
    if (!inside.includes(`${all} step-by-step art lessons`)) fail(`What's inside art lesson count`);
    await noScroll("What's inside");
    await ctx.close();
  }
  await b.close();
  console.log(errs.length ? 'errors ' + JSON.stringify(errs.slice(0, 10), null, 1) : 'errors none');
  console.log(fails.length ? 'fails ' + JSON.stringify(fails.slice(0, 40), null, 1) : 'fails none');
})();
