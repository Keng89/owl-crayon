// Grown-ups' progress report: the report in the Grown-ups corner covers the whole app for each player. A brand-new
// player, an old saved state with none of the newer fields, and a damaged state all render without errors; after
// playing a few things through the test hooks (math answers, letter sounds, a craft, My World, a quest stop, play-time
// minutes) the numbers go up; 3 suggestions appear, picked from the gaps (letter sounds learned but no blending yet
// suggests Blend it); the player chips switch whose report is shown; the print button calls window.print() and the
// print stylesheet shows only the report; no sideways scroll on a phone (390x844) or a tablet (820x1180).
// Prints "errors none" and "fails none" when clean. Tests take PORT (default 8766). Screenshots go to SHOTS.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const URL = `http://localhost:${PORT}/index.html`;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errs = [], fails = [];
const fail = m => { fails.push(m); console.log('FAIL', m); };
const watch = (p, tag) => {
  p.on('pageerror', e => errs.push(`${tag}: ${e.message}`));
  p.on('console', m => { if (m.type() === 'error' && !/favicon|manifest|sw\.js|service|fonts|Failed to load resource/i.test(m.text())) errs.push(`${tag} console: ${m.text()}`); });
};
const OLD = { v: 2, name: 'Mia', age: 5, stars: 40, streak: { n: 2, last: '2026-10-19' }, skills: {}, review: [], owlMisses: [], owlTaught: [], plays: { math: 3, art: 1, owl: 0 }, speak: false, unlockAll: false };
const BROKEN = { v: 2, name: 'Zed', age: 8, stars: 'lots', streak: { n: 0, last: null }, skills: { add10: { m: 2, seen: 'x', hist: null } }, review: [{ skill: 'nope' }], owlMisses: [], owlTaught: [], plays: {}, speak: false,
  english: { heard: null, sight: 'a', rounds: [], wotd: { last: 'bad-date', streak: 3 }, review: { cat: null }, got: { cat: 5 } }, crafts: { done: { notacraft: 1, heart: null } },
  world: { items: [null, { id: 'nothing' }], lands: 'home', spent: -4 }, story: { done: null, got: [1] }, pt: { min: { '2020-01-01': 'z' } }, days: { x: null } };

(async () => {
  const b = await chromium.launch();
  for (const [w, h, tag] of [[390, 844, 'phone'], [820, 1180, 'tablet']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 500 });
    await ctx.addInitScript(() => { try { speechSynthesis.speak = () => {}; } catch (e) {} });
    const p = await ctx.newPage(); watch(p, tag);
    const shot = name => p.screenshot({ path: `${SHOTS}/t39-${tag}-${name}.png`, fullPage: true }).catch(() => {});
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (o > 1) fail(`${tag}: sideways scroll ${o}px at ${where}`); };
    const load = async () => { await p.goto(`${URL}?r=${Date.now()}#selftest`); await p.waitForFunction(() => window.__owl && window.__report && window.__crafts && window.__world && window.__english && document.querySelector('#tMath, .who')); };
    const corner = async () => {
      await p.evaluate(() => window.__owl.go(window.__owl.home)); await p.click('#parent');
      const [x, y] = (await p.textContent('.panel .note')).match(/(\d+) × (\d+)/).slice(1).map(Number);
      await p.fill('#ga', String(x * y)); await p.press('#ga', 'Enter'); await p.waitForSelector('#report');
    };
    const read = () => p.evaluate(() => {
      const r = document.getElementById('report'), rows = {};
      r.querySelectorAll('.rp-row').forEach(x => { rows[x.querySelector('.rp-l').textContent.trim()] = x.querySelector('.rp-v').textContent.replace(/\s/g, ''); });
      r.querySelectorAll('.rp-f').forEach(x => { rows[x.querySelector('span').textContent.trim()] = x.querySelector('b').textContent.trim(); });
      return { rows, sugg: [...r.querySelectorAll('.rp-sugg li')].map(li => li.textContent.trim()), who: r.querySelector('.rp-for b').textContent, sum: r.querySelector('.rp-sum').textContent,
        tiles: [...r.querySelectorAll('.rp-tile')].map(t => t.textContent.replace(/\s+/g, ' ').trim()), cards: [...r.querySelectorAll('.rp-card h3')].map(h => h.textContent.trim()),
        print: !!r.querySelector('#rpPrint'), suggFont: parseFloat(getComputedStyle(r.querySelector('.rp-sugg li') || r).fontSize), rowFont: parseFloat(getComputedStyle(r.querySelector('.rp-row')).fontSize),
        printBtn: (() => { const b = r.querySelector('#rpPrint').getBoundingClientRect(); return [Math.round(b.width), Math.round(b.height)]; })() };
    });

    // 1. A brand-new player: everything zero, still 3 suggestions and a print button.
    await load(); await p.evaluate(() => localStorage.clear()); await load();
    await corner(); await noScroll('new player report'); await shot('new');
    let R = await read();
    console.log(tag, 'new player:', JSON.stringify({ cards: R.cards, tiles: R.tiles, sugg: R.sugg }));
    for (const c of ['Math', 'English & Reading', 'Art', 'Crafts', 'My World', "Owl's Quest"]) if (!R.cards.some(x => x.endsWith(c))) fail(`${tag}: no ${c} card`);
    if (R.rows['Topics tried'] !== '0/' + R.rows['Topics tried'].split('/')[1] || R.rows['Letter sounds (A–Z)'] !== '0/26' || !/^0\//.test(R.rows['Crafts made'])) fail(`${tag}: new player not zero ${JSON.stringify(R.rows)}`);
    if (R.sugg.length !== 3) fail(`${tag}: new player has ${R.sugg.length} suggestions`);
    if (!R.print) fail(`${tag}: no print button`);
    if (R.printBtn[0] < 44 || R.printBtn[1] < 44) fail(`${tag}: print button small ${R.printBtn}`);
    if (R.suggFont < 16 || R.rowFont < 16) fail(`${tag}: report text small (${R.suggFont}px, ${R.rowFont}px)`);
    if (!/^#?$|#selftest/.test(await p.evaluate(() => location.hash))) fail('hash changed');
    // The report sits inside the grown-up gate: it is not on the home screen and the gate comes first.
    await p.evaluate(() => window.__owl.go(window.__owl.home)); await p.click('#parent');
    if (await p.$('#report')) fail(`${tag}: report shown before the grown-up gate`);

    // 2. Old saved states: one from an early version (no english, crafts, world, story, pt, days...) and a damaged one.
    await p.evaluate(([o, x]) => {
      localStorage.clear();
      localStorage.setItem('owlcrayon:profiles', JSON.stringify([{ id: 'p1', avatar: '🦊' }, { id: 'p2', avatar: '🐼' }]));
      localStorage.setItem('owlcrayon:current', '"p1"'); localStorage.setItem('owlcrayon:state:p1', JSON.stringify(o)); localStorage.setItem('owlcrayon:state:p2', JSON.stringify(x));
      localStorage.setItem('owlcrayon:gallery:p1', '["data:x"]');
    }, [OLD, BROKEN]);
    await load(); await p.evaluate(() => window.__owl.go(window.__owl.home)); // skip "who's playing"
    await corner(); await noScroll('old state'); R = await read();
    if (R.who !== 'Mia' || R.rows['Pictures saved'] !== '1' || !R.tiles.some(t => /⭐ 40/.test(t))) fail(`${tag}: old state report ${JSON.stringify([R.who, R.rows['Pictures saved'], R.tiles])}`);
    const chips = await p.$$eval('#report [data-rp]', a => a.map(x => x.textContent.trim()));
    if (chips.length !== 2) fail(`${tag}: player chips ${chips}`);
    await p.click('#report [data-rp="p2"]'); await p.waitForFunction(() => document.querySelector('#report .rp-for b').textContent === 'Zed');
    await noScroll('damaged state'); R = await read();
    if (R.sugg.length !== 3) fail(`${tag}: damaged state suggestions ${R.sugg.length}`);
    if (await p.evaluate(() => window.__owl.st.name) !== 'Mia') fail(`${tag}: viewing another player's report switched the player`);
    if (await p.evaluate(() => JSON.parse(localStorage.getItem('owlcrayon:state:p2')).stars) !== 'lots') fail(`${tag}: the report changed another player's saved state`);
    await shot('damaged');
    await p.click('#report [data-rp="p1"]'); await p.waitForFunction(() => document.querySelector('#report .rp-for b').textContent === 'Mia');

    // 3. Play a few things through the test hooks, then the numbers go up.
    await p.evaluate(() => localStorage.clear()); await load();
    await corner(); const R0 = await read();
    // math: 4 questions, tapping choices until the right one
    await p.evaluate(() => window.__owl.go(window.__owl.play, 'mix', 0));
    for (let i = 0; i < 4; i++) {
      await p.waitForSelector('.choice:not(:disabled)');
      const n = await p.locator('.choice').count();
      for (let j = 0; j < n; j++) { const c = p.locator('.choice').nth(j); if (await c.isDisabled()) continue; await c.click(); await sleep(80); if (await p.locator('.choice.right').count()) break; }
      await p.waitForFunction(() => !document.querySelector('.choice.right'), null, { timeout: 6000 }).catch(() => {});
    }
    // English: hear 12 letter sounds
    await p.evaluate(() => window.__english.go('phonics', 'letters')); await p.waitForSelector('.en-pt');
    for (let i = 0; i < 12; i++) await p.click(`.en-pt[data-ph="${i}"]`);
    // a craft with a sticker
    await p.evaluate(() => window.__crafts.made('heart')); await p.waitForSelector('#crStk'); await p.click('#crStk'); await p.click('.cr-sb[data-k="🌟"]'); await p.waitForSelector('.cr-win');
    // My World: spend 5 stars on a thing; a quest stop; 12 minutes of play today
    await p.evaluate(() => {
      const w = window.__world.w, it = window.__world.ITEMS.find(i => i.c === 'animal') || window.__world.ITEMS[0];
      w.items.push({ id: it.id, t: window.__world.day() }); w.spent += 5;
      const q = window.__quest.state; q.done['0-0'] = 1;
      const st = window.__owl.st, d = new Date(), k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      st.pt = Object.assign({}, st.pt || {}, { min: { [k]: 720 } });
    });
    await corner(); await noScroll('after playing'); await shot('played');
    const R1 = await read();
    console.log(tag, 'after playing:', JSON.stringify({ rows: R1.rows, sum: R1.sum, sugg: R1.sugg }));
    const n = s => parseInt(String(s), 10) || 0;
    if (n(R1.rows['Questions answered']) < 4) fail(`${tag}: math answered ${R1.rows['Questions answered']}`);
    if (n(R1.rows['Topics tried']) < 1) fail(`${tag}: topics tried ${R1.rows['Topics tried']}`);
    if (R1.rows['Letter sounds (A–Z)'] !== '12/26') fail(`${tag}: letter sounds ${R1.rows['Letter sounds (A–Z)']}`);
    if (n(R1.rows['Crafts made']) !== 1 || n(R1.rows['🟢 Easy']) !== 1) fail(`${tag}: crafts ${R1.rows['Crafts made']} / easy ${R1.rows['🟢 Easy']}`);
    if (!/^1 \(1 animal\)$/.test(R1.rows['Things owned'])) fail(`${tag}: world things ${R1.rows['Things owned']}`);
    if (n(R1.rows['Stars spent']) !== 5) fail(`${tag}: stars spent ${R1.rows['Stars spent']}`);
    if (n(R1.rows['Story stops done']) !== 1) fail(`${tag}: quest stops ${R1.rows['Story stops done']}`);
    if (!/12 minutes/.test(R1.sum)) fail(`${tag}: week summary minutes: ${R1.sum}`);
    if (!/4 math questions|[5-9] math questions/.test(R1.sum) || !/craft/.test(R1.sum)) fail(`${tag}: week summary: ${R1.sum}`);
    if (R1.sum === R0.sum) fail(`${tag}: week summary did not change`);
    if (R1.sugg.length !== 3) fail(`${tag}: ${R1.sugg.length} suggestions after playing`);
    if (!R1.sugg.some(s => /Blend it/.test(s) && /12 letter sounds learned/.test(s))) fail(`${tag}: no Blend it suggestion: ${R1.sugg}`);
    if (new Set(await p.$$eval('#report .rp-sugg li', a => a.map(x => x.dataset.area))).size < 3) fail(`${tag}: suggestions are not from 3 areas`);
    const tiles = R1.tiles.join(' | ');
    if (!/⭐ [1-9]/.test(tiles)) fail(`${tag}: stars tile ${tiles}`);

    // 4. Print: the button calls window.print(); in print, only the report shows.
    await p.evaluate(() => { window.__printed = 0; window.print = () => { window.__printed++; }; });
    await p.click('#rpPrint');
    if (await p.evaluate(() => window.__printed) !== 1) fail(`${tag}: print button did not call window.print()`);
    if (!(await p.evaluate(() => document.body.classList.contains('rp-printing')))) fail(`${tag}: print mode class not set`);
    await p.emulateMedia({ media: 'print' });
    const pr = await p.evaluate(() => ({ report: getComputedStyle(document.getElementById('report')).display, others: [...document.querySelectorAll('#view > :not(#report)')].filter(x => getComputedStyle(x).display !== 'none').length,
      top: getComputedStyle(document.querySelector('.top')).display, btn: getComputedStyle(document.getElementById('rpPrint')).display }));
    if (pr.report === 'none' || pr.others || pr.top !== 'none' || pr.btn !== 'none') fail(`${tag}: print view ${JSON.stringify(pr)}`);
    if (tag === 'tablet') { const pdf = await p.pdf({ format: 'A4' }).catch(() => null); if (pdf === null) console.log('pdf: skipped (headed or unsupported)'); else console.log('pdf bytes', pdf.length); }
    await p.emulateMedia({ media: 'screen' });
    await p.evaluate(() => window.dispatchEvent(new Event('afterprint')));
    if (await p.evaluate(() => document.body.classList.contains('rp-printing'))) fail(`${tag}: print mode class left on after printing`);
    await ctx.close();
  }
  await b.close();
  console.log('errors', errs.length ? errs.join('\n') : 'none');
  console.log('fails', fails.length ? fails.join('\n') : 'none');
  process.exit(errs.length || fails.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
