// My World: opens from the home tile, the first-visit and daily welcome gifts (once a day), buying a land with the
// wallet math (and the quick subtraction question from age 7), buying and placing a house, a fruit tree and animals
// by real taps, water and habitat rules blocking wrong spots, feeding, fruit picked once a day (moved clock), a
// milestone bonus given once, dragging an item (mouse and finger), putting one in the backpack and back, saved after a
// reload, a second player with a separate world, and spending never lowering lifetime stars, badges or the owl's
// growth. On a phone and a tablet, with no sideways scroll and big enough buttons. Screenshots go to SHOTS.
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
    const URL = `http://localhost:${PORT}/index.html?r=${Date.now()}#selftest`;
    await p.goto(URL);
    await p.waitForFunction(() => window.__owl && window.__owl.st && window.__world);
    const age = tag === 'phone' ? 5 : 8;
    await p.evaluate(a => { const s = window.__owl.st; s.stars = 200; s.age = a; window.__world.hour = 12; }, age);
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); if (o > 1) fail(`horizontal scroll ${o}px at ${where}`); };
    const bigEnough = async where => {
      const small = await p.evaluate(() => [...document.querySelectorAll('#view button')].filter(b => b.offsetParent).map(b => { const r = b.getBoundingClientRect(); return [b.id || b.className || b.textContent.trim().slice(0, 12), Math.round(r.width), Math.round(r.height), b.textContent.trim() || b.getAttribute('aria-label')]; }).filter(x => x[1] < 44 || x[2] < 44 || !x[3]));
      if (small.length) fail(`${where}: small or unlabeled buttons ${JSON.stringify(small.slice(0, 5))}`);
    };
    const S = () => p.evaluate(() => { const o = window.__owl.st, W = window.__world; return { stars: o.stars, xp: o.pet.xp, badges: Object.keys(o.badges || {}).length, wallet: W.wallet(), spent: W.w.spent, items: W.w.items.map(i => ({ u: i.u, id: i.id, x: i.x, y: i.y, fed: i.fed, pk: i.pk })), lands: W.w.lands.slice(), ms: Object.keys(W.w.ms) }; });
    const item = async id => (await S()).items.filter(i => i.id === id).pop();
    const tapCell = async (x, y, touch) => { const pt = await p.evaluate(([x, y]) => window.__world.cell(x, y), [x, y]); await sleep(60); if (touch) await p.touchscreen.tap(pt.x, pt.y); else await p.mouse.click(pt.x, pt.y); await sleep(150); };
    const shop = async cat => { await p.evaluate(() => window.__world.open()); await p.click('#mwShop'); await p.waitForSelector('.mw-grid'); await p.click(`[data-cat="${cat}"]`); await p.waitForSelector(`.mw-tab.on[data-cat="${cat}"]`); };
    // Age 7+ answers the subtraction (one wrong try first, which must not buy); younger children tap Buy.
    const confirmBuy = async () => {
      await p.waitForSelector('.mw-sheet');
      if (age >= 7) {
        const right = await p.evaluate(() => { const t = document.querySelector('.mw-q b').textContent.match(/(\d+) − (\d+)/); return +t[1] - +t[2]; });
        const wrong = await p.$(`[data-ans]:not([data-ans="${right}"])`); const sp = (await S()).spent;
        await wrong.click(); await sleep(100);
        if (!(await p.$('.mw-sheet')) || (await S()).spent !== sp) fail('a wrong answer bought it');
        await p.click(`[data-ans="${right}"]`);
      } else await p.click('#mwBuy');
      await p.waitForSelector('#mwMap'); await sleep(250);
    };
    const buyItem = async (cat, id) => { await shop(cat); await p.click(`[data-buy="${id}"]`); await confirmBuy(); };

    // 1. The home tile opens My World; the first visit gives 5 stars, a second visit the same day gives none.
    await p.evaluate(() => window.__owl.go(window.__owl.home));
    if (!/to spend/.test(await p.textContent('#tWorld'))) fail('home tile does not show the wallet');
    await noScroll('home');
    await p.screenshot({ path: `${SHOTS}/world-${tag}-hometile.png`, fullPage: true });
    await p.click('#tWorld'); await p.waitForSelector('#mwMap');
    let s = await S();
    if (s.stars !== 205) fail(`first visit gift: stars ${s.stars}, want 205`);
    await p.click('#backBtn'); await p.click('#tWorld'); await p.waitForSelector('#mwMap');
    if ((await S()).stars !== 205) fail('a second visit on the same day gave another gift');
    if (+(await p.textContent('#mwWallet')).match(/\d+/)[0] !== 205) fail('wallet does not show 205');
    await noScroll('empty world'); await bigEnough('empty world');
    await sleep(400); await p.screenshot({ path: `${SHOTS}/world-${tag}-empty.png` });
    const base = await S();

    // 2. Buy a land: the math shows, and the stars move from the wallet only.
    await shop('land'); await noScroll('shop lands'); await bigEnough('shop lands');
    await p.click('[data-land="meadow"]'); await p.waitForSelector('.mw-sheet');
    const mtxt = await p.textContent('.mw-sheet');
    if (age < 7 && !mtxt.includes('205 − 30 = 175')) fail(`land math: ${mtxt}`);
    if (age >= 7 && !mtxt.includes('205 − 30 = ?')) fail(`land question: ${mtxt}`);
    await p.screenshot({ path: `${SHOTS}/world-${tag}-buysheet.png` });
    await confirmBuy();
    s = await S();
    if (!s.lands.includes('meadow') || s.spent !== 30 || s.wallet !== 175 || s.stars !== 205) fail(`after land: ${JSON.stringify({ l: s.lands, sp: s.spent, w: s.wallet, st: s.stars })}`);
    if (s.xp !== base.xp || s.badges < base.badges) fail('buying changed the owl or badges');

    // 3. A house by a real tap (first-home milestone +5, once), a water spot refuses a cow, a fish needs water.
    await buyItem('home', 'cottage');
    if (!(await p.$('.mw-placing')) || !(await p.$('.mw-ok'))) fail('not in place mode after buying');
    await tapCell(6, 7, tag === 'phone'); // water around Hoot's Island
    if ((await item('cottage')).x != null) fail('cottage was placed on water');
    if (!/dry land/i.test(await p.textContent('#mwBan'))) fail('no "dry land" message');
    await tapCell(7, 7, tag === 'phone');
    let c = await item('cottage'); if (c.x !== 7 || c.y !== 7) fail(`cottage at ${c.x},${c.y}`);
    await sleep(1000);
    s = await S();
    if (!s.ms.includes('house1') || s.stars !== 210) fail(`first-home milestone: ms ${s.ms} stars ${s.stars}`);
    await buyItem('plant', 'apple'); await tapCell(10, 7, tag === 'phone');
    await buyItem('animal', 'cow'); await tapCell(14, 8, tag === 'phone'); // the meadow
    if ((await item('cow')).x !== 14) fail('cow not placed on the meadow');
    await buyItem('animal', 'fish');
    await tapCell(10, 10, tag === 'phone');
    if ((await item('fish')).x != null || !/needs water/i.test(await p.textContent('#mwBan'))) fail('fish was allowed on grass');
    await tapCell(6, 9, tag === 'phone');
    if ((await item('fish')).x !== 6) fail('fish not placed in water');
    await sleep(1000);
    s = await S();
    if (s.ms.filter(m => m === 'house1').length !== 1 || s.stars !== 213) fail(`milestones ${s.ms} stars ${s.stars} (want 213: 205 + 5 house + 3 first animal)`);
    if (s.spent !== 30 + 18 + 25 + 30 + 8 || s.wallet !== s.stars - s.spent) fail(`spent ${s.spent} wallet ${s.wallet}`);
    if (+(await p.textContent('#mwWallet')).match(/\d+/)[0] !== s.wallet) fail('wallet on screen is wrong');
    // A penguin needs Snowy Land: the shop says so and will not sell it yet.
    await shop('animal');
    if (!/Needs Snowy Land/.test(await p.textContent('[data-buy="penguin"]'))) fail('penguin card does not say it needs Snowy Land');
    await p.click('[data-buy="penguin"]'); await p.waitForSelector('.mw-sheet');
    if (await p.$('#mwBuy') || await p.$('[data-ans]') || !(await p.$('#mwGoLand'))) fail('penguin could be bought without snow');
    await p.click('#mwNo');
    await p.screenshot({ path: `${SHOTS}/world-${tag}-shop.png`, fullPage: tag === 'tablet' });
    await noScroll('shop'); await bigEnough('shop');

    // 4. Feed the cow: tap it, then Feed.
    await p.evaluate(() => window.__world.open());
    await tapCell(14, 8, tag === 'phone');
    await p.waitForSelector('#mwFeed'); await p.click('#mwFeed'); await sleep(150);
    const today = await p.evaluate(() => window.__world.day());
    if ((await item('cow')).fed !== today) fail('cow not fed');
    if (await p.$('[data-id="cow"] .mw-mood')) fail('fed cow still looks sad');
    await noScroll('item info'); await bigEnough('item info');

    // 5. Fruit: none on the planting day, ready tomorrow (+1 star, once), and again the day after.
    await tapCell(10, 7, tag === 'phone');
    if (await p.$('#mwPick')) fail('fruit ready on the planting day');
    await p.evaluate(() => { window.__world.shift = 1; window.__world.open(); }); await p.waitForSelector('#mwMap');
    let s1 = await S(); if (s1.stars !== s.stars + 3) fail(`next-day gift ${s1.stars - s.stars}, want 3`);
    if ((await item('cow')).fed === await p.evaluate(() => window.__world.day())) fail('cow still fed on a new day');
    await tapCell(10, 7, tag === 'phone');
    await p.waitForSelector('#mwPick'); await p.click('#mwPick'); await sleep(150);
    if ((await S()).stars !== s1.stars + 1) fail('picking fruit did not give 1 star');
    await tapCell(10, 7, tag === 'phone');
    if (await p.$('#mwPick')) fail('fruit could be picked twice in a day');
    await p.evaluate(() => { window.__world.shift = 2; window.__world.open(); }); await p.waitForSelector('#mwMap');
    await tapCell(10, 7, tag === 'phone');
    if (!(await p.$('#mwPick'))) fail('no new fruit the day after');
    await p.evaluate(() => { window.__world.shift = 0; window.__world.open(); });

    // 6. Drag the cottage to a new spot (mouse on the tablet, a finger on the phone); a drag onto water snaps back.
    const drag = async (from, to, touch) => {
      const a = await p.evaluate(([x, y]) => window.__world.cell(x, y), from);
      const r = await p.evaluate(() => { const m = window.__world.ui.map.getBoundingClientRect(); return { x: m.left, y: m.top, cs: m.width / 24 }; });
      const B = { x: r.x + (to[0] + .5) * r.cs, y: r.y + (to[1] + .5) * r.cs }, n = 8;
      if (touch) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: a.x, y: a.y }] });
        for (let i = 1; i <= n; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: a.x + (B.x - a.x) * i / n, y: a.y + (B.y - a.y) * i / n }] });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      } else { await p.mouse.move(a.x, a.y); await p.mouse.down(); await p.mouse.move(B.x, B.y, { steps: n }); await p.mouse.up(); }
      await sleep(450);
    };
    await drag([7, 7], [8, 10], tag === 'phone');
    c = await item('cottage'); if (c.x !== 8 || c.y !== 10) fail(`drag moved the cottage to ${c.x},${c.y}`);
    await drag([8, 10], [8, 11], tag !== 'phone');
    c = await item('cottage'); if (c.x !== 8 || c.y !== 10) fail('a drag onto water moved the cottage');

    // 7. Put it in the backpack, then back on the map from the backpack.
    await tapCell(8, 10, tag === 'phone');
    await p.waitForSelector('#mwAway'); await p.click('#mwAway'); await sleep(100);
    if ((await item('cottage')).x != null || !(await p.$('[data-bag]'))) fail('cottage not in the backpack');
    await p.click('[data-bag]'); await sleep(100);
    await tapCell(9, 7, tag === 'phone');
    c = await item('cottage'); if (c.x !== 9 || c.y !== 7) fail(`cottage from the backpack at ${c.x},${c.y}`);

    // 8. Spending never lowers lifetime stars, badges or the owl: every star added went to the owl too.
    s = await S();
    if (s.xp - base.xp !== s.stars - base.stars) fail(`owl xp grew ${s.xp - base.xp} but stars grew ${s.stars - base.stars}`);
    if (s.badges < base.badges) fail('badges went down');
    await p.evaluate(() => window.__owl.go(window.__owl.home));
    const stickers = await p.$$eval('.stickers span:not(.empty)', x => x.length);
    if (stickers !== Math.floor(s.stars / 10)) fail(`home stickers ${stickers}, want ${Math.floor(s.stars / 10)}`);

    // 9. Earn more stars goes to a learning activity.
    await p.click('#tWorld'); await p.waitForSelector('#mwMap'); await p.click('#mwEarn'); await sleep(200);
    if (await p.$('#mwMap')) fail('"Need more stars?" did not leave My World');

    // 10. Saved after a reload.
    await p.reload(); await p.waitForFunction(() => window.__owl && window.__world);
    await p.evaluate(() => { window.__world.hour = 12; window.__world.open(); }); await p.waitForSelector('#mwMap');
    const s2 = await S();
    if (JSON.stringify(s2.items) !== JSON.stringify(s.items) || s2.spent !== s.spent || !s2.lands.includes('meadow')) fail('world not saved after reload');
    if (await p.$$eval('#mwMap .mw-it', x => x.length) !== 4) fail('not 4 things on the map after reload');

    // 11. A busy world, the sticker book, and night time.
    await p.evaluate(() => { const W = window.__world, w = W.w; w.lands = W.LANDS.map(l => l.id); let r = 7; const R = () => (r = (r * 9301 + 49297) % 233280) / 233280;
      for (const it of W.ITEMS) for (let k = 0; k < 600; k++) { const x = Math.floor(R() * 24), y = Math.floor(R() * 18); if (!W.whyNot(it.id, x, y)) { w.items.push({ u: ++w.n, id: it.id, x, y, t: '2026-01-01', fed: k % 3 ? W.day() : null }); w.got[it.id] = 1; break; } }
      w.spent = 0; window.__world.open(); });
    await sleep(500); await noScroll('busy world'); await bigEnough('busy world');
    await p.screenshot({ path: `${SHOTS}/world-${tag}-busy.png` });
    await p.evaluate(() => { const vp = window.__world.ui.vp; vp.scrollLeft = 0; vp.scrollTop = 0; }); await sleep(300);
    await p.screenshot({ path: `${SHOTS}/world-${tag}-busy-snow.png` });
    await p.evaluate(() => window.__world.book()); await p.waitForSelector('.mw-stk');
    const book = await p.textContent('#view');
    if (!/of 34 animals/.test(book)) fail('sticker book does not count animals');
    await noScroll('book'); await bigEnough('book');
    await p.screenshot({ path: `${SHOTS}/world-${tag}-book.png`, fullPage: true });
    await p.evaluate(() => { window.__world.hour = 22; window.__world.open(); }); await sleep(500);
    if (!(await p.$('.mw-night')) || !(await p.$('.mw-glow'))) fail('no night sky or glowing lamps at 10 pm');
    if (!/sleeping/.test(await p.getAttribute('[data-id="cow"]', 'aria-label'))) fail('cow is not asleep at night');
    await p.screenshot({ path: `${SHOTS}/world-${tag}-night.png` });

    // 12. A second player has a separate world; the first one's is untouched.
    const p1 = await S();
    await p.evaluate(() => { const st = JSON.parse(localStorage.getItem('owlcrayon:state:p1')); delete st.world; st.name = 'Leo'; st.stars = 12; localStorage.setItem('owlcrayon:state:p2', JSON.stringify(st));
      localStorage.setItem('owlcrayon:profiles', JSON.stringify([{ id: 'p1', avatar: '🦊' }, { id: 'p2', avatar: '🐼' }])); localStorage.setItem('owlcrayon:current', '"p2"'); });
    await p.reload(); await p.waitForFunction(() => window.__owl && window.__world);
    await p.evaluate(() => { window.__world.hour = 12; window.__world.open(); }); await p.waitForSelector('#mwMap');
    const q = await S();
    if (q.items.length || q.lands.length !== 1 || q.spent !== 0 || q.stars !== 17) fail(`second player's world: ${JSON.stringify({ n: q.items.length, l: q.lands, sp: q.spent, st: q.stars })}`);
    await p.evaluate(() => localStorage.setItem('owlcrayon:current', '"p1"')); await p.reload(); await p.waitForFunction(() => window.__owl && window.__world);
    if ((await S()).items.length !== p1.items.length) fail('first player lost their world');
    await noScroll('end');
    console.log(`${tag}: ${p1.items.length} things, lands ${p1.lands.length}, stars ${p1.stars}`);
    await ctx.close();
  }
  console.log(errs.length ? errs.join('\n') : 'errors none');
  await b.close();
})();
