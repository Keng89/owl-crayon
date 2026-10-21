// Welcome tour and "What's inside": on a phone and a tablet, forces the first-run tour (tests normally skip it),
// steps through all 6 cards (each rings a real home tile, the card never covers it), checks it shows only once per
// player (also after a reload), skips it for a second new player, replays it from the Grown-ups corner, and opens
// "What's inside" (its counts match the app's data). The tablet run has no speech at all, to prove the tour never
// waits on it. Also checks the tour stays away in plain #selftest runs. Screenshots go to SHOTS (default: current folder).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const URL = `http://localhost:${PORT}/index.html#selftest`;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run(b, vp, noSpeech, errs) {
  const tag = `${vp.width}`;
  const ctx = await b.newContext({ viewport: vp });
  await ctx.addInitScript(ns => {
    window.__owlTourForce = true;
    // a brand-new player called Mia, as if a grown-up had just typed her name
    if (!localStorage.getItem('owlcrayon:profiles')) { localStorage.setItem('owlcrayon:profiles', JSON.stringify([{ id: 'p1', avatar: '🦊' }]));
      localStorage.setItem('owlcrayon:state:p1', JSON.stringify({ v: 2, name: 'Mia', age: 5, stars: 0, streak: { n: 0, last: null }, skills: {}, review: [], owlMisses: [], owlTaught: [], plays: { math: 0, art: 0, owl: 0 }, speak: true, unlockAll: false })); }
    if (ns) { try { delete Window.prototype.speechSynthesis; } catch (e) {} try { delete window.speechSynthesis; } catch (e) {} try { delete window.SpeechSynthesisUtterance; } catch (e) {} }
  }, noSpeech);
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(`${tag}: ${e.message}`));
  p.on('console', m => { if (m.type() === 'error' && !/favicon|manifest|sw\.js|service|fonts/i.test(m.text())) errs.push(`${tag} console: ${m.text()}`); });
  const noScroll = async where => { const w = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]); if (w[0] > w[1] + 1) errs.push(`${tag}: sideways scroll on ${where} (${w[0]} > ${w[1]})`); };
  const shot = async (name, full = false) => { await sleep(400); await p.screenshot({ path: `${SHOTS}/tour-${tag}-${name}.png`, fullPage: full }); };
  const tourGone = async where => { await sleep(500); if (await p.$('.wt')) errs.push(`${tag}: tour showed again ${where}`); };
  const toGrownups = async () => {
    await p.evaluate(() => window.__owl.go(window.__owl.home)); await p.click('#parent');
    const [x, y] = (await p.textContent('.panel .note')).match(/(\d+) × (\d+)/).slice(1).map(Number);
    await p.fill('#ga', String(x * y)); await p.press('#ga', 'Enter'); await p.waitForSelector('#wtInside');
  };

  await p.goto(URL);
  await p.waitForFunction(() => window.__owl && window.__tour);
  if (noSpeech && await p.evaluate(() => 'speechSynthesis' in window)) errs.push(`${tag}: could not remove speech for the test`);

  // 1. first run: the tour starts by itself on the home screen
  await p.waitForSelector('.wt .wt-card', { timeout: 4000 });
  const sels = await p.evaluate(() => window.__tour.steps().map(s => s.sel));
  if (sels.length < 4 || sels.length > 6) errs.push(`${tag}: ${sels.length} tour cards`);
  for (const need of ['#tMath', '#tArt', '#tQuest', '.quest']) if (!sels.includes(need)) errs.push(`${tag}: tour never points at ${need}`);
  // a tap outside the card does nothing (no tile opens behind the shade)
  const mb = await (await p.$('#tMath')).boundingBox();
  await p.mouse.click(mb.x + 10, mb.y + 10); await sleep(200);
  if (!await p.$('#tMath') || !await p.$('.wt')) errs.push(`${tag}: a tap on the shade went through`);
  for (let i = 0; i < sels.length; i++) {
    await p.waitForFunction(i => document.querySelector('.wt') && document.querySelector('.wt').dataset.step === String(i), i);
    await sleep(380); // spotlight slides
    const g = await p.evaluate(sel => {
      const t = document.querySelector('#view ' + sel).getBoundingClientRect(), s = document.querySelector('.wt-spot').getBoundingClientRect(), c = document.querySelector('.wt-card').getBoundingClientRect();
      const over = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      return { ringed: s.left <= t.left + 1 && s.top <= t.top + 1 && s.right >= t.right - 1 && s.bottom >= t.bottom - 1, covered: over(t, c), visible: t.top >= -2 && t.bottom <= innerHeight + 2,
        title: document.querySelector('#wtTitle').textContent, text: document.querySelector('.wt-text').textContent, next: document.querySelector('#wtNext').textContent,
        skipH: document.querySelector('#wtSkip').getBoundingClientRect().height, cardIn: c.left >= 0 && c.right <= innerWidth && c.top >= 0 && c.bottom <= innerHeight };
    }, sels[i]);
    if (!g.ringed) errs.push(`${tag}: card ${i + 1} spotlight misses ${sels[i]}`);
    if (g.covered > 40) errs.push(`${tag}: card ${i + 1} covers ${sels[i]} (${Math.round(g.covered)} px²)`);
    if (!g.visible) errs.push(`${tag}: card ${i + 1} target ${sels[i]} is off screen`);
    if (!g.cardIn) errs.push(`${tag}: card ${i + 1} sticks out of the screen`);
    if (g.skipH < 56) errs.push(`${tag}: Skip button is small (${g.skipH}px)`);
    const words = g.text.split(/[.!?]/).filter(x => x.trim()).map(x => x.trim().split(/\s+/).length);
    if (Math.max(...words) > 9) errs.push(`${tag}: card ${i + 1} has a long sentence: ${g.text}`);
    if (i === 0 && !/Mia/.test(g.title)) errs.push(`${tag}: first card does not greet the child by name`);
    if (i === sels.length - 1 && !/play/i.test(g.next)) errs.push(`${tag}: last button says ${g.next}`);
    await noScroll(`tour card ${i + 1}`); await shot(`card${i + 1}`);
    await p.click('#wtNext');
  }
  await p.waitForSelector('.wt', { state: 'detached' });
  const t1 = await p.evaluate(() => window.__owl.st.tour);
  if (!t1 || t1.how !== 'done') errs.push(`${tag}: finishing did not save the tour ${JSON.stringify(t1)}`);
  if (!await p.$('#tMath')) errs.push(`${tag}: not on the home screen after the tour`);
  // 2. only once per player, also after a reload
  await p.evaluate(() => window.__owl.go(window.__owl.home)); await tourGone('on the next home visit');
  await p.reload(); await p.waitForFunction(() => window.__owl && window.__tour); await tourGone('after a reload');

  // 3. a new player gets their own tour; Skip ends it at once
  await toGrownups();
  await p.fill('#npn', 'Leo'); await p.fill('#npa', '5'); await p.click('#addForm button[type=submit]');
  await p.waitForSelector('[data-switch]'); await p.click('[data-switch]'); await p.waitForSelector('#wtInside');
  await p.click('#homeBtn');
  await p.waitForSelector('.wt .wt-card', { timeout: 4000 });
  if (!/Leo/.test(await p.textContent('#wtTitle'))) errs.push(`${tag}: new player's tour does not say Leo`);
  await shot('skip-before');
  await p.click('#wtSkip'); await p.waitForSelector('.wt', { state: 'detached' });
  const t2 = await p.evaluate(() => [window.__owl.st.name, window.__owl.st.tour && window.__owl.st.tour.how]);
  if (t2[0] !== 'Leo' || t2[1] !== 'skip') errs.push(`${tag}: skip not saved for Leo ${JSON.stringify(t2)}`);
  await p.evaluate(() => window.__owl.go(window.__owl.home)); await tourGone('for Leo after skipping');
  // back to Mia: still no tour
  await p.click('#whoBtn'); await p.waitForSelector('.who-btn');
  await p.click('.who-btn:has-text("Mia")'); await p.waitForSelector('#tMath'); await tourGone('for Mia after switching back');

  // 4. replay from the Grown-ups corner, then Escape closes it
  await toGrownups(); await noScroll('grown-ups corner'); await shot('grownups');
  await p.click('#wtReplay');
  await p.waitForSelector('.wt .wt-card', { timeout: 4000 });
  if (!await p.$('#tMath')) errs.push(`${tag}: replay is not on the home screen`);
  await p.click('#wtNext'); await p.waitForFunction(() => document.querySelector('.wt').dataset.step === '1');
  await p.keyboard.press('Escape'); await p.waitForSelector('.wt', { state: 'detached' });
  if (!await p.evaluate(() => window.__owl.st.tour)) errs.push(`${tag}: replay lost the saved tour`);

  // 5. What's inside
  await p.evaluate(() => window.__owl.go(window.__owl.sceneHome)); await p.waitForFunction(() => window.__scenes); // sets up its test hooks
  await toGrownups(); await p.click('#wtInside');
  await p.waitForSelector('.wt-stats');
  const info = await p.evaluate(() => {
    const o = window.__owl, txt = document.getElementById('view').innerText;
    return { txt, stats: [...document.querySelectorAll('.wt-stat')].map(s => s.innerText.replace(/\s+/g, ' ')),
      topics: Object.keys(o.MATH).length, lessons: o.LESSONS.length, kinds: o.ART_CATS.length, pics: o.PICS.length,
      fixed: window.__tour.FIXED, real: { coloring: window.__color.PAGES.length, places: window.__scenes.BGS.length, chapters: window.__quest.CH.length, stops: [...new Set(window.__quest.CH.map(c => c.stops.length))].join('/') },
     };
  });
  for (const [n, label] of [[info.topics, 'math topics'], [info.lessons, 'art lessons'], [info.kinds, 'kinds of art'], [info.pics, 'pixel pictures'], [info.real.coloring, 'coloring pages'], [info.real.places, 'sticker-scene places']])
    if (!info.stats.some(s => s.startsWith(n + ' ') && s.includes(label))) errs.push(`${tag}: What's inside lacks "${n} ${label}" (${info.stats.join(' | ')})`);
  for (const k in info.real) if (String(info.real[k]) !== String(info.fixed[k])) errs.push(`${tag}: What's inside says ${info.fixed[k]} ${k}, the app has ${info.real[k]}`);
  for (const w of ['Number Garden', 'Art School', "Owl's Quest", 'Levels and age', 'How Owl learns', 'Backup', 'first 15 minutes']) if (!info.txt.includes(w)) errs.push(`${tag}: What's inside has no "${w}"`);
  const gameCount = (await p.textContent('.wt-stats')).match(/(\d+)\s*math games/);
  if (!gameCount || +gameCount[1] < 21) errs.push(`${tag}: game count ${gameCount && gameCount[1]}`);
  await noScroll("What's inside"); await shot('inside', true);
  await p.click('#wtBack'); await p.waitForSelector('#wtInside');

  // 6. without the force flag, #selftest runs never see the tour (so older tests keep working)
  const ctx2 = await b.newContext({ viewport: vp }), p2 = await ctx2.newPage();
  p2.on('pageerror', e => errs.push(`${tag} plain: ${e.message}`));
  await p2.goto(URL); await p2.waitForFunction(() => window.__owl); await sleep(700);
  if (await p2.$('.wt')) errs.push(`${tag}: tour showed in a plain #selftest run`);
  await ctx2.close();

  console.log(`${tag}: ${sels.length} cards, done=${t1 && t1.how}, Leo=${t2[1]}, stats: ${info.stats.join(' | ')}`);
  await ctx.close();
}

(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [vp, ns] of [[{ width: 390, height: 844 }, false], [{ width: 1024, height: 768 }, true]]) {
    try { await run(b, vp, ns, errs); } catch (e) { errs.push(`${vp.width}: ${e.message.split('\n')[0]}`); }
  }
  console.log('errors', errs.length ? errs : 'none');
  await b.close();
})();
