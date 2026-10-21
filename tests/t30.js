// Flipbook: opens from the Art School tile, draws on 3 frames with real pointer strokes (mouse and finger), onion skin
// shows the frame before, Play shows the frames changing over time and Stop stops, leaving while it plays is clean,
// two guided lessons are finished (a frame left empty does not move on, stars only the first time), Save adds one
// picture and 2 stars once a day (a second save does not), the saved flipbook plays in My pictures, it reopens from
// My flipbooks with its frames after a reload, a frame is copied and deleted (tap twice), and the play-time limit's
// auto-save works on the flipbook pad. On a phone and a tablet, with no sideways scroll and big enough buttons.
// Screenshots go to SHOTS (default: current folder).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h, tag] of [[390, 844, 'phone'], [1024, 768, 'tablet']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 500, deviceScaleFactor: 1 });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(`${tag}: ${e.message}`));
    p.on('console', m => { if (m.type() === 'error' && !/favicon|manifest|sw\.js|service|fonts/i.test(m.text())) errs.push(`${tag} console: ${m.text()}`); });
    const fail = m => errs.push(`${tag}: ${m}`);
    const cdp = await ctx.newCDPSession(p);
    await p.goto(`http://localhost:${PORT}/index.html?r=${Date.now()}#selftest`);
    await p.waitForFunction(() => window.__owl && window.__owl.st && window.__flip);
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); if (o > 1) fail(`horizontal scroll ${o}px at ${where}`); };
    const stars = () => p.evaluate(() => window.__owl.st.stars);
    const gal = () => p.evaluate(() => JSON.parse(localStorage.getItem('owlcrayon:gallery:' + (localStorage.getItem('owlcrayon:current') || '"p1"').replace(/"/g, '')) || '[]').length);
    const ed = () => p.evaluate(() => { const e = window.__flip.ed; return e && { n: e.frames.length, cur: e.cur, playing: !!e.play, done: e.done, unsaved: e.unsaved, onionAt: e.onionAt, sigs: e.frames.map(f => window.__flip.sig(f.c)) }; });
    const bigEnough = async where => {
      const small = await p.evaluate(() => [...document.querySelectorAll('#view button')].filter(b => b.offsetParent).map(b => { const r = b.getBoundingClientRect(); return [b.id || b.className || b.textContent.trim().slice(0, 12), Math.round(r.width), Math.round(r.height), b.textContent.trim() || b.getAttribute('aria-label')]; }).filter(x => x[1] < 44 || x[2] < 44 || !x[3]));
      if (small.length) fail(`${where}: small or unlabeled buttons ${JSON.stringify(small)}`);
    };
    // A stroke on the flipbook canvas; points are fractions of the canvas.
    async function draw(pts, touch) {
      await p.evaluate(() => document.getElementById('fbCv').scrollIntoView({ block: 'center' }));
      const r = await p.evaluate(() => { const b = document.getElementById('fbCv').getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; });
      const P = pts.map(([fx, fy]) => ({ x: r.x + fx * r.w, y: r.y + fy * r.h }));
      if (touch) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [P[0]] });
        for (const q of P.slice(1)) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [q] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      } else { await p.mouse.move(P[0].x, P[0].y); await p.mouse.down(); for (const q of P.slice(1)) await p.mouse.move(q.x, q.y, { steps: 3 }); await p.mouse.up(); }
      await sleep(60);
    }
    const ring = (cx, cy, r, n = 16) => Array.from({ length: n + 1 }, (_, k) => [cx + r * Math.cos(k * 2 * Math.PI / n), cy + r * 1.33 * Math.sin(k * 2 * Math.PI / n)]);
    const pickFrame = async i => { await p.click(`[data-f="${i}"]`); await sleep(50); };

    // Open from Art School.
    await p.evaluate(() => window.__owl.go(window.__owl.artHome));
    await p.click('[data-tool="flip"]'); await p.waitForSelector('.fb-les');
    if (await p.$$eval('.fb-lcard', x => x.length) !== 8) fail('not 8 lessons');
    await noScroll('home'); await bigEnough('home');
    await p.screenshot({ path: `${SHOTS}/flip-${tag}-home.png`, fullPage: true });
    await p.click('#backBtn'); if (!(await p.$('[data-tool="flip"]'))) fail('Back from flipbook home did not return to Art School');
    await p.click('[data-tool="flip"]'); await p.waitForSelector('#fbNew');

    // A new flipbook: three frames, a ball moving right, drawn with the mouse and a finger.
    await p.click('#fbNew'); await p.waitForSelector('#fbCv');
    let e = await ed(); if (e.n !== 3 || e.sigs.some(s => s !== '0')) fail(`new flipbook ${JSON.stringify(e)}`);
    await noScroll('editor'); await bigEnough('editor');
    if (!(await p.evaluate(() => { const l = window.__flip.livePad; return l && l.cv === document.getElementById('fbCv'); }))) fail('livePad is not the flipbook canvas');
    await draw(ring(0.2, 0.5, 0.08));
    await p.click('[data-c="#F2604F"]'); await p.click('[data-z="22"]');
    await draw([[0.05, 0.85], [0.95, 0.85]], tag === 'phone');
    // Undo takes back only the last stroke of this frame.
    const before = (await ed()).sigs[0]; await draw([[0.1, 0.1], [0.3, 0.2]]); await p.click('#fbUndo');
    if ((await ed()).sigs[0] !== before) fail('Undo did not take back the last stroke');
    await pickFrame(1);
    e = await ed(); if (e.cur !== 1) fail('tapping frame 2 did not pick it');
    // Onion skin: the frame before shows faintly, and the toggle hides it.
    if (e.onionAt !== 0 || await p.evaluate(() => window.__flip.onionSig()) === '0') fail('onion skin does not show frame 1 on frame 2');
    await p.screenshot({ path: `${SHOTS}/flip-${tag}-onion.png` });
    await p.click('#fbOnT'); if (await p.evaluate(() => window.__flip.onionSig()) !== '0') fail('onion toggle off still shows frame 1');
    await p.click('#fbOnT'); if (await p.evaluate(() => window.__flip.onionSig()) === '0') fail('onion toggle on does not show frame 1');
    await p.click('[data-c="#22305A"]'); await p.click('[data-z="10"]');
    await draw(ring(0.5, 0.45, 0.08), tag === 'tablet');
    await p.click('[data-c="#F2604F"]'); await p.click('[data-z="22"]'); await draw([[0.05, 0.85], [0.95, 0.85]]);
    await pickFrame(2);
    await p.click('[data-c="#22305A"]'); await p.click('[data-z="10"]');
    await draw(ring(0.8, 0.5, 0.08));
    await p.click('[data-c="#F2604F"]'); await p.click('[data-z="22"]'); await draw([[0.05, 0.85], [0.95, 0.85]], true);
    e = await ed();
    if (e.sigs.some(s => s === '0') || new Set(e.sigs).size !== 3) fail(`frames not all drawn and different: ${e.sigs}`);
    if (await p.evaluate(() => window.__flip.onionSig()) === '0' || e.onionAt !== 1) fail('onion skin does not show frame 2 on frame 3');

    // Play at fast speed: the picture on screen changes over time, through every frame. Then stop.
    await p.click('[data-sp="2"]'); await p.click('#fbPlay');
    const seen = new Set(), shots = new Set();
    for (let k = 0; k < 14; k++) { seen.add(await p.evaluate(() => window.__flip.shown)); shots.add(await p.evaluate(() => window.__flip.screenSig())); await sleep(70); }
    if (!(await ed()).playing || seen.size < 3 || shots.size < 3) fail(`play showed frames ${[...seen]} with ${shots.size} different pictures`);
    if (await p.evaluate(() => document.getElementById('fbOn').checkVisibility({ visibilityProperty: true }))) fail('onion skin shows while playing');
    await p.screenshot({ path: `${SHOTS}/flip-${tag}-playing.png` });
    await p.click('#fbPlay'); await sleep(150);
    const s1 = await p.evaluate(() => window.__flip.screenSig()); await sleep(400);
    if ((await ed()).playing || await p.evaluate(() => window.__flip.shown) !== -1 || s1 !== await p.evaluate(() => window.__flip.screenSig())) fail('Stop did not stop');
    // Bounce plays there and back.
    await p.click('#fbBo'); await p.click('#fbPlay'); const order = [];
    for (let k = 0; k < 16; k++) { const s = await p.evaluate(() => window.__flip.shown); if (order[order.length - 1] !== s) order.push(s); await sleep(40); }
    await p.click('#fbPlay'); await p.click('#fbBo');
    if (!/2,1,0|0,1,2,1|1,2,1|2,1/.test(order.join())) fail(`bounce order ${order}`);

    // Save: one more picture, 2 stars, once a day; a second save with no change does nothing.
    let s0 = await stars(), g0 = await gal();
    await p.click('#fbSave'); await sleep(200);
    if (await gal() !== g0 + 1) fail(`gallery ${g0} -> ${await gal()} after save`);
    if (await stars() !== s0 + 2) fail(`save gave ${(await stars()) - s0} stars`);
    const list1 = await p.evaluate(() => window.__flip.load());
    if (list1.length !== 1 || list1[0].fr.length !== 3 || !list1[0].fr.every(u => /^data:image\/jpeg/.test(u))) fail('flipbook frames not stored');
    const bytes = await p.evaluate(() => (localStorage.getItem('owlcrayon:flip:p1') || '').length); if (bytes > 200000) fail(`3 frames take ${bytes} bytes`);
    await p.click('#fbSave'); await sleep(100);
    if (await gal() !== g0 + 1 || await stars() !== s0 + 2) fail('saving again with no change added a picture or stars');
    await pickFrame(0); await draw([[0.1, 0.15], [0.3, 0.12]]); await p.click('#fbSave'); await sleep(150);
    if (await gal() !== g0 + 1) fail('saving an edited flipbook added a second picture instead of replacing it');
    if (await stars() !== s0 + 2) fail('a second save on the same day gave stars');
    if ((await p.evaluate(() => window.__flip.load())).length !== 1) fail('saving an edited flipbook made a second flipbook');
    const qd = await p.evaluate(() => { const d = new Date(), k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); return (window.__owl.st.days[k] || {}).art; });
    if (qd !== 2) fail(`dayLog art is ${qd}, want 2`);
    await noScroll('editor saved');
    await p.screenshot({ path: `${SHOTS}/flip-${tag}-editor.png`, fullPage: true });

    // Leave while playing: Back, and the Home button; no errors and nothing keeps running.
    await p.click('#fbPlay'); await sleep(300); await p.click('#backBtn'); await p.waitForSelector('.fb-les'); await sleep(700);
    if (await p.$('#fbCv')) fail('Back while playing did not leave');
    await p.click('[data-edit="0"]'); await p.waitForSelector('#fbCv'); await p.click('#fbPlay'); await sleep(200);
    await p.click('#homeBtn'); await sleep(800);
    if (await p.$('#fbCv')) fail('Home while playing did not leave');
    // Back with changes not saved asks once.
    await p.evaluate(() => window.__flip.open()); await p.waitForSelector('#fbCv'); await draw(ring(0.5, 0.5, 0.1));
    await p.click('#backBtn'); if (!(await p.$('#fbCv')) || !/again/i.test(await p.textContent('#backBtn'))) fail('Back with an unsaved flipbook did not ask');
    await p.click('#backBtn'); await p.waitForSelector('.fb-les');

    // Guided lessons: an empty frame does not move on; each frame is traced, then it plays with a cheer.
    const lessons = tag === 'phone' ? ['ball', 'blink'] : ['rocket', 'cater'];
    for (const id of lessons) {
      await p.evaluate(() => window.__flip.home()); await p.click(`[data-les="${id}"]`); await p.waitForSelector('#fbStep');
      const n = (await ed()).n; s0 = await stars();
      if (!(await p.$('#fbG svg.fb-guide'))) fail(`${id}: no guide on frame 1`);
      if (!(await p.textContent('#fbSt')).length) fail(`${id}: no instruction`);
      await p.click('#fbNext'); if ((await ed()).cur !== 0) fail(`${id}: moved on from an empty frame`);
      if (id === lessons[0]) { await noScroll('lesson'); await bigEnough('lesson'); await p.screenshot({ path: `${SHOTS}/flip-${tag}-lesson-${id}-1.png`, fullPage: true }); }
      for (let i = 0; i < n; i++) {
        const t = await p.textContent('#fbSt'); if (!t || t.length < 10) fail(`${id}: frame ${i + 1} says "${t}"`);
        if (!(await p.$('#fbG svg.fb-guide'))) fail(`${id}: no guide on frame ${i + 1}`);
        if (i > 0 && (await ed()).onionAt !== i - 1) fail(`${id}: no onion skin on frame ${i + 1}`);
        await draw(ring(0.5, 0.2 + 0.6 * i / n, 0.1), (i % 2) === 1);
        if (i === 1 && id === lessons[0]) await p.screenshot({ path: `${SHOTS}/flip-${tag}-lesson-${id}-2.png` });
        await p.click('#fbNext'); await sleep(60);
      }
      e = await ed();
      if (!e.done || !e.playing) fail(`${id}: not finished and playing (${JSON.stringify(e)})`);
      if (await stars() !== s0 + 2) fail(`${id}: finishing gave ${(await stars()) - s0} stars`);
      if (!(await p.$('.fb-done')) || !(await p.$('#fbFrt:not([hidden])'))) fail(`${id}: no done panel or frame tools`);
      if (await p.$('#fbG svg')) fail(`${id}: guide still shows after finishing`);
      await sleep(300); await noScroll('lesson done');
      await p.screenshot({ path: `${SHOTS}/flip-${tag}-lesson-${id}-done.png`, fullPage: true });
      await p.click('#fbPlay'); // stop
    }
    // The same lesson again: no stars.
    await p.evaluate(() => window.__flip.home());
    if (await p.$$eval('.fb-lcard.done', x => x.length) !== 2) fail('lesson cards not ticked');
    await p.click(`[data-les="${lessons[0]}"]`); await p.waitForSelector('#fbStep'); s0 = await stars();
    for (let i = 0, n = (await ed()).n; i < n; i++) { await draw(ring(0.25 + 0.5 * i / n, 0.5, 0.12)); await p.click('#fbNext'); }
    if (!(await ed()).done || await stars() !== s0) fail('repeating a lesson gave stars or did not finish');

    // The play-time limit saves the flipbook on screen (quietly, no stars).
    g0 = await gal(); s0 = await stars();
    const auto = await p.evaluate(() => { const l = window.__flip.livePad; if (!l.drawn()) return 'not drawn'; l.save(false); return 'ok'; });
    if (auto !== 'ok' || await gal() !== g0 + 1 || await stars() !== s0) fail(`auto-save: ${auto}, gallery ${g0} -> ${await gal()}, stars ${s0} -> ${await stars()}`);

    // My pictures: a flipbook picture plays when tapped.
    await p.evaluate(() => window.__owl.go(window.__owl.galTab));
    const gb = await p.$$('.fb-gbtn'); if (gb.length !== 2) fail(`${gb.length} flipbooks marked in My pictures`);
    const src0 = await p.$eval('.fb-gbtn img', i => i.src.length);
    await p.click('.fb-gbtn'); const srcs = new Set();
    for (let k = 0; k < 10; k++) { srcs.add(await p.$eval('.fb-gbtn img', i => i.src.length + i.src.substr(i.src.length >> 1, 60))); await sleep(120); }
    if (srcs.size < 2) fail('the gallery flipbook did not play');
    await noScroll('gallery'); await bigEnough('gallery');
    await p.screenshot({ path: `${SHOTS}/flip-${tag}-gallery.png`, fullPage: true });
    await p.click('.fb-gbtn'); await sleep(100); if (await p.$eval('.fb-gbtn img', i => i.src.length) !== src0) fail('stopping the gallery flipbook did not show its picture again');
    await p.click('.fb-gbtn'); await p.click('#backBtn'); await sleep(500);

    // After a reload: My flipbooks still has it, it plays, and it opens with every frame.
    await p.reload(); await p.waitForFunction(() => window.__flip && window.__owl.st);
    await p.evaluate(() => window.__owl.go(window.__owl.artHome)); await p.click('[data-tool="flip"]'); await p.waitForSelector('.fb-les');
    const cards = await p.$$eval('.fb-card', x => x.length); if (cards !== 2) fail(`${cards} flipbooks after reload`);
    if (await p.$$eval('.fb-lcard.done', x => x.length) !== 2) fail('lesson ticks lost after reload');
    const last = cards - 1; // the free flipbook was saved first, so it is last
    await p.click(`[data-play="${last}"]`); const hs = new Set();
    for (let k = 0; k < 8; k++) { hs.add(await p.$eval(`.fb-card[data-i="${last}"] img`, i => i.src.length + i.src.substr(i.src.length >> 1, 60))); await sleep(150); }
    if (hs.size < 2) fail('My flipbooks Play did not play');
    await noScroll('home with flipbooks'); await bigEnough('home with flipbooks');
    await p.screenshot({ path: `${SHOTS}/flip-${tag}-mine.png`, fullPage: true });
    await p.click(`[data-edit="${last}"]`); await p.waitForSelector('#fbCv'); await sleep(150);
    e = await ed();
    if (e.n !== 3 || e.sigs.some(s => s === '0') || new Set(e.sigs).size !== 3) fail(`reopened flipbook ${JSON.stringify(e)}`);
    // Onion skin works through a reopened (JPEG) frame.
    await pickFrame(1); if (await p.evaluate(() => window.__flip.onionSig()) === '0') fail('no onion skin on a reopened flipbook');
    // Copy a frame, then delete it: the first tap only asks.
    await p.click('#fbDup'); e = await ed(); if (e.n !== 4 || e.cur !== 2 || e.sigs[2] !== e.sigs[1]) fail(`copy frame: ${JSON.stringify(e)}`);
    await p.click('#fbR'); e = await ed(); if (e.cur !== 3 || e.sigs[3] !== e.sigs[1]) fail('Move ▶ did not move the frame');
    await p.click('#fbDel'); if ((await ed()).n !== 4) fail('one tap deleted a frame');
    await p.click('#fbDel'); e = await ed(); if (e.n !== 3) fail(`delete: ${e.n} frames`);
    for (let k = 0; k < 4; k++) await p.click('#fbDel', { force: true }); // the last taps are on a greyed-out button
    if ((await ed()).n !== 2) fail('could delete below 2 frames');
    for (let k = 0; k < 11; k++) await p.click('#fbAdd', { force: true });
    if ((await ed()).n !== 12) fail(`${(await ed()).n} frames, max is 12`);
    await noScroll('12 frames');
    await p.screenshot({ path: `${SHOTS}/flip-${tag}-12.png`, fullPage: true });
    await p.click('#homeBtn'); await p.click('#homeBtn'); await sleep(300);
    await ctx.close();
  }
  console.log('errors', errs.length ? errs : 'none'); await b.close();
})();
