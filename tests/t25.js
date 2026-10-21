// Sticker scenes: every place, stickers from many groups, drag by mouse and touch, the edit buttons, counting games
// (right and wrong), crayon, telling the story, and saving to My pictures, on a phone and a tablet.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const PORT = process.env.PORT || 8766;
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h, tag] of [[390, 844, 'phone'], [1024, 768, 'tablet']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 500, deviceScaleFactor: 2 });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(`${tag}: ${e.message}`));
    const fail = m => errs.push(`${tag}: ${m}`);
    await p.goto(`http://localhost:${PORT}/index.html?r=${Date.now()}#selftest`);
    await p.waitForFunction(() => window.__owl);
    // Get there the way a child does: Art School, then the Sticker scenes tile.
    await p.evaluate(() => window.__owl.go(window.__owl.artHome));
    await p.click('[data-tool="scene"]');
    await p.waitForFunction(() => window.__scenes);
    const S = () => p.evaluate(() => JSON.parse(JSON.stringify(window.__scenes.S)));
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); if (o > 1) fail(`horizontal scroll ${o}px at ${where}`); };
    await noScroll('start');

    // Every place.
    await p.click('[data-tab="bg"]');
    const bgs = await p.evaluate(() => window.__scenes.BGS.map(x => x.id));
    if (bgs.length < 12) fail(`only ${bgs.length} places`);
    for (const id of bgs) { await p.click(`[data-bg="${id}"]`); if ((await S()).bg !== id) fail(`place ${id} not picked`); if (!(await p.$('#ssBg svg'))) fail(`no picture for ${id}`); }
    const n = await p.evaluate(() => window.__scenes.GROUPS.reduce((a, g) => a + g.items.length, 0));
    if (n < 100) fail(`only ${n} stickers`);
    await p.click('[data-bg="farm"]');

    // Stickers from several groups.
    for (const g of ['animals', 'vehicles', 'food', 'nature', 'sky', 'fantasy', 'people', 'toys']) {
      await p.click(`[data-tab="${g}"]`);
      const ks = await p.$$('.ss-sk'); await ks[0].click(); await ks[3].click();
    }
    let s = await S(); if (s.items.length !== 16) fail(`want 16 stickers, have ${s.items.length}`);
    if ((await p.$$('.ss-st')).length !== 16) fail('stickers not drawn');
    await noScroll('stickers');

    // Drag with a mouse.
    const centre = async id => { const r = await p.locator(`.ss-st[data-id="${id}"]`).boundingBox(); return [r.x + r.width / 2, r.y + r.height / 2]; };
    const stage = await p.locator('#ssStage').boundingBox();
    // Stickers overlap, so pick ones whose middle is not covered by another sticker.
    const free = () => p.evaluate(() => window.__scenes.S.items.filter(q => { const el = document.querySelector(`.ss-st[data-id="${q.id}"]`), r = el.getBoundingClientRect(); return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === el; }));
    await p.waitForTimeout(400);
    let it = (await free())[0]; let [x, y] = await centre(it.id);
    await p.mouse.move(x, y); await p.mouse.down(); await p.mouse.move(stage.x + stage.width * 0.2, stage.y + stage.height * 0.25, { steps: 8 }); await p.mouse.up();
    let after = (await S()).items.find(q => q.id === it.id);
    if (Math.abs(after.x - 80) > 25 || Math.abs(after.y - 75) > 25) fail(`mouse drag went to ${after.x},${after.y}`);
    // Drag with a finger (real touch events through the browser).
    const cdp = await ctx.newCDPSession(p);
    it = (await free()).slice(-1)[0]; [x, y] = await centre(it.id);
    const tx = stage.x + stage.width * 0.75, ty = stage.y + stage.height * 0.7;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let k = 1; k <= 8; k++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + (tx - x) * k / 8, y: y + (ty - y) * k / 8 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    after = (await S()).items.find(q => q.id === it.id);
    if (Math.abs(after.x - 300) > 25 || Math.abs(after.y - 210) > 25) fail(`touch drag went to ${after.x},${after.y}`);
    // Touch-like pointer events sent straight to a sticker.
    it = (await free())[1];
    const moved = await p.evaluate(id => {
      const el = document.querySelector(`.ss-st[data-id="${id}"]`), r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, o = { pointerId: 9, pointerType: 'touch', isPrimary: true, bubbles: true, button: 0 };
      el.dispatchEvent(new PointerEvent('pointerdown', { ...o, clientX: cx, clientY: cy }));
      for (let k = 1; k <= 5; k++) window.dispatchEvent(new PointerEvent('pointermove', { ...o, clientX: cx - k * 6, clientY: cy + k * 4 }));
      window.dispatchEvent(new PointerEvent('pointerup', { ...o, clientX: cx - 30, clientY: cy + 20 }));
      return window.__scenes.S.items.find(q => q.id === id);
    }, it.id);
    if (!(moved.x < it.x - 5 && moved.y > it.y + 3)) fail('pointer-event drag did not move');

    // Edit buttons on the picked sticker.
    it = (await free())[0]; [x, y] = await centre(it.id); await p.mouse.click(x, y);
    if (await p.evaluate(() => window.__scenes.sel) !== it.id) fail('tap did not pick the sticker');
    const cur = async () => (await S()).items.find(q => q.id === it.id);
    await p.click('[data-ed="big"]'); await p.click('[data-ed="big"]'); if ((await cur()).s <= it.s) fail('bigger did nothing');
    await p.click('[data-ed="small"]'); if ((await cur()).s >= 81) fail('smaller did nothing');
    await p.click('[data-ed="flip"]'); if (!(await cur()).f) fail('flip did nothing');
    await p.click('[data-ed="turn"]'); if ((await cur()).r !== 30) fail('turn did nothing');
    await p.click('[data-ed="front"]'); s = await S(); if (s.items[s.items.length - 1].id !== it.id) fail('front did nothing');
    await p.click('[data-ed="copy"]'); if ((await S()).items.length !== 17) fail('copy did nothing');
    await p.click('[data-ed="del"]'); await p.click('#ssUndo'); if ((await S()).items.length !== 17) fail('undo after delete did not bring it back');
    await p.locator('.ss-st').last().click({ force: true }); await p.click('[data-ed="del"]'); if ((await S()).items.length !== 16) fail('delete did nothing');
    await p.screenshot({ path: `scene-${tag}-1.png`, fullPage: true });

    // Crayon.
    await p.click('[data-mode="crayon"]'); await p.click('#ssCrayon [data-c="#6D55D1"]'); await p.click('#ssCrayon [data-z="9"]');
    await p.locator('#ssStage').scrollIntoViewIfNeeded(); const sb = await p.locator('#ssStage').boundingBox();
    await p.mouse.move(sb.x + 30, sb.y + 40); await p.mouse.down();
    for (let k = 1; k <= 20; k++) await p.mouse.move(sb.x + 30 + k * sb.width / 25, sb.y + 40 + Math.sin(k / 2) * 20);
    await p.mouse.up();
    if (!(await S()).doodle) fail('crayon did not draw');
    await p.click('[data-mode="move"]');

    // Tell the story and describe the picture.
    await p.click('#ssTellBtn'); await p.fill('#ssText', 'The farm animals went on a trip to the moon in a rocket.'); await p.click('#ssRead'); await p.click('#ssTellDone');
    if ((await S()).story.indexOf('moon') < 0) fail('story not kept');
    await p.click('#ssLook'); const d = await p.textContent('#ssIdea'); if (!/In my picture on the farm, there are .*16 stickers/.test(d)) fail(`describe said: ${d}`);
    await p.click('#ssStory'); if ((await p.textContent('#ssIdea')).length < 10) fail('no story idea');

    // Save to My pictures.
    const g0 = await p.evaluate(() => window.__scenes.galleryCount()), st0 = await p.evaluate(() => window.__owl.st.stars);
    await p.click('#ssSave'); await p.waitForSelector('#ssSaved:not([hidden])', { timeout: 6000 });
    const g1 = await p.evaluate(() => window.__scenes.galleryCount()), st1 = await p.evaluate(() => window.__owl.st.stars);
    if (g1 !== g0 + 1) fail(`gallery ${g0} -> ${g1}`);
    if (st1 !== st0 + 2) fail(`first save of the day gave ${st1 - st0} stars`);
    await p.click('#ssSave'); await p.waitForTimeout(800);
    if (await p.evaluate(() => window.__owl.st.stars) !== st1) fail('second save gave stars again');
    const img = await p.evaluate(() => JSON.parse(localStorage.getItem('owlcrayon:gallery:' + (JSON.parse(localStorage.getItem('owlcrayon:current')) || 'p1')))[0]);
    if (!/^data:image\/jpeg;base64,/.test(img)) fail('saved picture is not a jpeg like the others');
    fs.writeFileSync(`saved-${tag}.jpg`, Buffer.from(img.split(',')[1], 'base64'));

    // A new picture needs two taps.
    await p.click('#ssNew'); if (!(await S()).items.length) fail('one tap on New cleared the picture');
    await p.click('#ssNew'); if ((await S()).items.length) fail('two taps on New did not clear');

    // Counting games: wrong, then right.
    const stars = () => p.evaluate(() => window.__owl.st.stars);
    const check = async () => { await p.click('#ssCheck'); await p.waitForTimeout(3600); return p.textContent('#ssIdea'); };
    await p.click('#ssCount'); if (await p.isHidden('#ssCheck')) fail('counting game has no Check button');
    await p.evaluate(() => window.__scenes.setPrompt(0)); // Put 5 fish in the sea.
    await p.click('[data-tab="sea"]');
    for (let k = 0; k < 3; k++) await p.click('[data-e="🐟"]');
    let s0 = await stars(); let msg = await check();
    if (!/You have 3 fish\. We need 5\. Add 2 more/.test(msg)) fail(`wrong count said: ${msg}`);
    if (await stars() !== s0) fail('star for a wrong count');
    await p.click('[data-e="🐠"]'); await p.click('[data-e="🐡"]');
    await p.click('#ssCheck'); await p.waitForTimeout(500);
    if ((await p.$$('.ss-nums b')).length < 2) fail('counting numbers not shown');
    await p.screenshot({ path: `scene-${tag}-count.png` });
    await p.waitForTimeout(3000); msg = await p.textContent('#ssIdea');
    if (!/Yes! 5 fish/.test(msg) || await stars() !== s0 + 1) fail(`right count said: ${msg}`);
    for (let k = 0; k < 2; k++) await p.click('[data-e="🐟"]');
    await p.evaluate(() => window.__scenes.setPrompt(0)); msg = await check();
    if (!/Take away 2/.test(msg)) fail(`too many said: ${msg}`);
    // Groups: 6 trees in one heap, then 2 groups of 3.
    await p.click('#ssNew'); await p.click('#ssNew');
    await p.evaluate(() => window.__scenes.setPrompt(6)); await p.click('[data-tab="nature"]');
    for (let k = 0; k < 6; k++) await p.click('[data-e="🌳"]');
    await p.evaluate(() => window.__scenes.S.items.forEach((q, i) => { q.x = 180 + i * 8; q.y = 150; }));
    msg = await check(); if (!/drag them into 2 groups of 3/.test(msg)) fail(`one heap said: ${msg}`);
    await p.evaluate(() => window.__scenes.S.items.forEach((q, i) => { q.x = (i < 3 ? 80 : 300) + (i % 3) * 30; q.y = 160 + (i % 2) * 20; }));
    s0 = await stars(); msg = await check(); if (!/Yes! 2 groups of 3 trees/.test(msg) || await stars() !== s0 + 1) fail(`groups said: ${msg}`);
    // Pattern and "more than".
    for (const [i, adds, ok] of [[11, ['🔴', '🔵', '🔴', '🔵', '🔴', '🔵'], true], [11, ['🔴', '🔴', '🔵', '🔵', '🔴', '🔵'], false], [12, ['🐶', '🐶', '🐱'], false], [12, ['🐶', '🐱', '🐱'], true]]) {
      await p.click('#ssNew'); await p.click('#ssNew'); await p.evaluate(k => window.__scenes.setPrompt(k), i);
      await p.evaluate(es => es.forEach((e, k) => { window.__scenes.add(e); const q = window.__scenes.S.items[k]; q.x = 40 + k * 55; q.y = 150; }), adds);
      const r = await p.evaluate(() => window.__scenes.judge());
      if (r.ok !== ok) fail(`prompt ${i} with ${adds.join('')} judged ${r.ok}: ${r.msg}`);
    }
    // Every counting game can be finished with the stickers in the tray.
    const bad = await p.evaluate(() => { const all = new Set(window.__scenes.GROUPS.flatMap(g => g.items.map(i => i.e))); return window.__scenes.MATHP.filter(m => { const ks = m.need ? Object.keys(m.need) : m.groups ? [m.groups[0]] : m.more || []; return ks.some(k => !window.__scenes.KINDS[k].list.some(e => all.has(e))) || (m.pattern && m.pattern.some(e => !all.has(e))); }).map(m => m.t); });
    if (bad.length) fail('games without stickers: ' + bad.join(' / '));

    // A finished scene for a look, then My pictures.
    await p.click('#ssNew'); await p.click('#ssNew'); await p.click('[data-tab="bg"]'); await p.click('[data-bg="sea"]');
    await p.evaluate(() => { const A = window.__scenes; [['🐳', 300, 90, 110, 0, true], ['🐙', 90, 220, 70], ['🐠', 180, 120, 44], ['🐟', 230, 160, 40, 0, true], ['🐡', 120, 90, 40], ['🦀', 300, 262, 46], ['🐚', 210, 272, 30], ['🧜', 60, 120, 80, 0]].forEach(([e, x, y, s, r = 0, f = false]) => { A.add(e); const q = A.S.items[A.S.items.length - 1]; Object.assign(q, { x, y, s, r, f }); }); A.S.story = 'The mermaid found a whale who wanted to play hide and seek.'; });
    await p.click('[data-tab="sea"]'); await p.click('[data-tab="bg"]'); // redraw
    await p.evaluate(() => window.__owl.go(window.__owl.sceneHome)); await p.waitForTimeout(300);
    await noScroll('finished scene');
    await p.screenshot({ path: `scene-${tag}-sea.png`, fullPage: true });
    await p.click('#ssSave'); await p.waitForSelector('#ssSaved:not([hidden])');
    const img2 = await p.evaluate(() => JSON.parse(localStorage.getItem('owlcrayon:gallery:p1'))[0]);
    fs.writeFileSync(`saved-${tag}-sea.jpg`, Buffer.from(img2.split(',')[1], 'base64'));
    const gn = await p.evaluate(() => window.__scenes.galleryCount());
    await p.click('#ssGal'); const imgs = await p.$$('.gallery img'); if (imgs.length !== gn) fail(`My pictures shows ${imgs.length}, want ${gn}`);
    await noScroll('gallery');
    await p.screenshot({ path: `gallery-${tag}.png` });
    // The scene is kept when you come back.
    await p.evaluate(() => window.__owl.go(window.__owl.sceneHome));
    if ((await S()).items.length !== 8) fail('scene not kept after leaving');
    await ctx.close();
  }
  console.log('errors', errs.length ? errs : 'none'); await b.close();
})();
