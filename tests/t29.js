// Busy-child regressions found by a monkey test: leaving a screen right after a tap (mix colors, sticker counting,
// sticker and coloring saves, a voice question to Owl) must not throw or say the wrong thing; double taps on Done,
// Check and Save count once; and a very long question to Owl does not make the Grown-ups corner scroll sideways.
// On a phone and a tablet. Prints "errors none" when clean.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766;
const URL = `http://localhost:${PORT}/index.html#selftest`;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run(b, vp, errs) {
  const tag = `${vp.width}`, err = m => errs.push(`${tag}: ${m}`);
  const ctx = await b.newContext({ viewport: vp });
  await ctx.addInitScript(() => {
    // Record what Owl says, and a fake microphone the test can answer.
    window.__said = [];
    try { speechSynthesis.speak = u => window.__said.push(u.text); } catch (e) {}
    window.webkitSpeechRecognition = window.SpeechRecognition = class { constructor() { window.__rec = this; } start() {} stop() {} abort() {} };
  });
  const p = await ctx.newPage();
  p.on('pageerror', e => err(`page error: ${e.message}`));
  p.on('console', m => { if (m.type() === 'error' && !/favicon|manifest|fonts|Failed to load resource/i.test(m.text())) err(`console: ${m.text()}`); });
  await p.goto(URL); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForFunction(() => window.__owl);
  const go = fn => p.evaluate(fn => window.__owl.go(window.__owl[fn]), fn);
  const stars = () => p.evaluate(() => window.__owl.st.stars);
  const gal = () => p.evaluate(() => JSON.parse(localStorage.getItem('owlcrayon:gallery:' + JSON.parse(localStorage.getItem('owlcrayon:current'))) || '[]').length);
  const said = () => p.evaluate(() => window.__said.join(' | '));
  const tool = async t => { await go('artHome'); await p.click(`[data-tool="${t}"]`); await sleep(150); };

  // 1. Mix colors: make the goal colour, then leave at once. The next goal must not be set on another screen.
  await tool('mix');
  const R = { orange: ['red', 'yellow'], green: ['blue', 'yellow'], purple: ['blue', 'red'], pink: ['red', 'white'] };
  let goal = (await p.textContent('#goal')).match(/make (.*)\?/)[1];
  for (const c of R[goal]) await p.click(`[data-p="${c}"]`);
  await p.click('#backBtn'); await sleep(3000);
  // ...and staying on the screen still gives a new goal.
  await p.click('[data-tool="mix"]'); goal = (await p.textContent('#goal')).match(/make (.*)\?/)[1];
  for (const c of R[goal]) await p.click(`[data-p="${c}"]`);
  await sleep(2900); const g2 = (await p.textContent('#goal')).match(/make (.*)\?/)[1];
  if (g2 === goal) err('mix colors: no new goal after a match');

  // 2. Sticker scene: tap Check, then leave while the stickers are being counted.
  await tool('scene'); await p.waitForFunction(() => window.__scenes);
  await p.click('[data-tab="animals"]'); const ks = await p.$$('.ss-sk'); for (let i = 0; i < 4; i++) await ks[i].click();
  await p.evaluate(() => window.__scenes.setPrompt(0));
  await p.click('#ssCheck'); await sleep(100); await p.click('#backBtn'); await sleep(2500);
  // Save, then leave before the picture is ready: it is saved and Owl does not say it failed.
  await p.click('[data-tool="scene"]'); await p.waitForSelector('#ssSave');
  let g0 = await gal();
  await p.evaluate(() => { window.__said.length = 0; document.getElementById('ssSave').click(); document.getElementById('backBtn').click(); });
  await sleep(1500);
  if (await gal() !== g0 + 1) err('sticker scene: save then leave did not save the picture');
  if (/did not save/.test(await said())) err(`sticker scene: said "${await said()}" after a good save`);

  // 3. Coloring book: save, then leave at once.
  await p.evaluate(() => window.__owl.go(window.__color.colorPage, 'whale', false)); await sleep(200);
  g0 = await gal();
  await p.evaluate(() => { document.getElementById('cbSave').click(); document.getElementById('backBtn').click(); });
  await sleep(1200);
  if (await gal() !== g0 + 1) err('coloring: save then leave did not save the picture');

  // 4. Ask Owl by voice: the answer arrives after the child went home (ignored), or while still here (answered).
  const hear = t => p.evaluate(t => window.__rec.onresult({ results: [[{ transcript: t }]] }), t).catch(e => err(`ask owl: a voice answer threw: ${e.message.split('\n')[0]}`));
  await p.click('#homeBtn'); await p.click('#tOwl'); await p.click('#mic'); await p.click('#homeBtn');
  await hear('what is 3 plus 4'); await sleep(200);
  if (!await p.$('#tMath')) err('ask owl: a late voice answer left the home screen');
  await p.click('#tOwl'); await p.click('#mic'); await hear('what is 3 plus 4'); await sleep(200);
  if (!/7/.test(await p.textContent('#bub'))) err(`ask owl: voice question not answered: ${await p.textContent('#bub')}`);

  // 5. A very long question (no spaces) shows in the Grown-ups corner without sideways scroll.
  await p.fill('#askq', 'x'.repeat(300)); await p.press('#askq', 'Enter'); await sleep(200);
  await go('home'); await p.click('#parent');
  const [x, y] = (await p.textContent('#view .panel .note')).match(/(\d+) × (\d+)/).slice(1).map(Number);
  await p.fill('#ga', String(x * y)); await p.press('#ga', 'Enter'); await p.waitForSelector('#misses');
  const w = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  if (w[0] > w[1] + 1) err(`grown-ups corner scrolls sideways with a long question (${w[0]} > ${w[1]})`);

  // 6. Write numbers: a good trace, then a double tap on Done gives the stars once.
  await p.evaluate(() => { window.__owl.st.unlockAll = true; });
  await go('mathHome'); await p.click('#wr'); await p.click('[data-n="1"]'); await sleep(300);
  const pts = await p.evaluate(() => { const g = document.querySelector('.write-guide .trk'), svg = g.ownerSVGElement; svg.scrollIntoView({ block: 'center' }); const r = svg.getBoundingClientRect(), k = r.width / svg.viewBox.baseVal.width, L = g.getTotalLength(), out = []; for (let d = 0; d <= L; d += 2) { const q = g.getPointAtLength(d); out.push([r.left + q.x * k, r.top + q.y * k]); } return out; });
  await p.mouse.move(...pts[0]); await p.mouse.down(); for (const pt of pts) await p.mouse.move(pt[0] + 1, pt[1] - 1); await p.mouse.up();
  let s0 = await stars();
  await p.evaluate(() => { const d = document.getElementById('wdone'); d.click(); d.click(); });
  if (!/Beautiful/.test(await p.textContent('#wmsg'))) err(`write: good trace of 1 not accepted: ${await p.textContent('#wmsg')}`);
  if (await stars() - s0 !== 2) err(`write: double tap on Done gave ${await stars() - s0} stars, want 2`);
  await sleep(2500);

  // 7. Pixel art: a finished picture checked again (or double-tapped) gives its stars once; a changed picture counts again.
  await tool('pixel'); await p.click('[data-p="heart"]'); await sleep(150);
  const paint = () => p.evaluate(() => {
    const pg = document.getElementById('pg'); pg.scrollIntoView({ block: 'center' });
    const rows = window.__owl.PICS.find(q => q.id === 'heart').rows;
    pg.querySelectorAll('[data-x]').forEach(el => { if (rows[+el.dataset.y][+el.dataset.x] === '.') return; const r = el.getBoundingClientRect(), o = { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, pointerId: 3, bubbles: true }; pg.dispatchEvent(new PointerEvent('pointerdown', o)); pg.dispatchEvent(new PointerEvent('pointerup', o)); });
  });
  await paint(); s0 = await stars();
  await p.evaluate(() => { const c = document.getElementById('chk'); c.click(); c.click(); c.click(); });
  if (!/Perfect/.test(await p.textContent('#pmsg'))) err(`pixel: heart not perfect: ${await p.textContent('#pmsg')}`);
  if (await stars() - s0 !== 3) err(`pixel: three taps on Check gave ${await stars() - s0} stars, want 3`);
  // rub one square out and put it back: that is a new finished picture
  await p.click('[data-px="."]'); const cell = await p.$('#pg [data-x="1"][data-y="1"]'); await cell.click(); await p.click('[data-px="r"]'); await cell.click();
  s0 = await stars(); await p.click('#chk');
  if (await stars() - s0 !== 1) err(`pixel: re-made picture gave ${await stars() - s0} stars, want 1`);

  // 8. Free draw: Save on a blank pad does nothing, a double tap saves once, drawing more saves again.
  await tool('free'); await sleep(200);
  g0 = await gal(); s0 = await stars();
  await p.click('#sav');
  if (await gal() !== g0 || await stars() !== s0) err('free draw: a blank pad was saved');
  const box = await p.evaluate(() => { const c = document.getElementById('cv'); c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  const scribble = async k => { await p.mouse.move(box.x + 30, box.y + 30 + k * 20); await p.mouse.down(); await p.mouse.move(box.x + box.w - 30, box.y + 60 + k * 20, { steps: 6 }); await p.mouse.up(); };
  await scribble(0);
  await p.evaluate(() => { const s = document.getElementById('sav'); s.click(); s.click(); });
  if (await gal() !== g0 + 1) err(`free draw: double tap on Save saved ${await gal() - g0} pictures, want 1`);
  if (await stars() - s0 !== 1) err(`free draw: double tap on Save gave ${await stars() - s0} stars, want 1`);
  await scribble(3); await p.click('#sav');
  if (await gal() !== g0 + 2) err('free draw: saving after drawing more did not save');

  console.log(`${tag}: stars ${await stars()}, pictures ${await gal()}`);
  await ctx.close();
}

(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const vp of [{ width: 390, height: 844 }, { width: 1024, height: 768 }]) {
    try { await run(b, vp, errs); } catch (e) { errs.push(`${vp.width}: ${e.message.split('\n')[0]}`); }
  }
  console.log('errors', errs.length ? errs : 'none');
  await b.close();
})();
