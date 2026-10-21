// Play time: on a phone and a tablet, sets a daily limit and wiggle breaks per player in the Grown-ups corner, then
// drives the timer's fast clock (window.__timer.tick) to check: minutes count only after a recent tap and only while
// the page is visible; the break card counts down and "I'm back!" closes it; a break waits for the question to be
// answered (or at most 60 s); Owl's heads-up 2 minutes before the limit; the "All done for today" screen saves a
// drawing in progress, blocks the app, survives a reload, and only the grown-up question gives +10 minutes or turns
// it off; two players keep separate minutes and settings; the 7-day chart; and that plain #selftest runs never
// see the timer. Screenshots go to SHOTS (default: current folder).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const URL = `http://localhost:${PORT}/index.html#selftest`;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const T = 15000;
let stage = '', page = null;

async function run(b, vp, errs) {
  const tag = `${vp.width}`;
  const ctx = await b.newContext({ viewport: vp });
  await ctx.addInitScript(() => {
    window.__owlTimerForce = true; window.__owlTimerManual = true;
    if (!localStorage.getItem('owlcrayon:profiles')) {
      const day = n => { const t = new Date(); t.setDate(t.getDate() - n); return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); };
      const kid = (name, pt) => ({ v: 2, name, age: 5, stars: 0, streak: { n: 0, last: null }, skills: {}, review: [], owlMisses: [], owlTaught: [], plays: { math: 0, art: 0, owl: 0 }, speak: true, unlockAll: false, tour: { at: day(0), how: 'skip' }, pt });
      localStorage.setItem('owlcrayon:profiles', JSON.stringify([{ id: 'p1', avatar: '🦊' }, { id: 'p2', avatar: '🐼' }]));
      localStorage.setItem('owlcrayon:current', JSON.stringify('p1'));
      // Mia played on earlier days (the old minutes must show in her chart); Leo is new.
      localStorage.setItem('owlcrayon:state:p1', JSON.stringify(kid('Mia', { min: { [day(5)]: 12 * 60, [day(1)]: 30 * 60 + 20 } })));
      localStorage.setItem('owlcrayon:state:p2', JSON.stringify(kid('Leo')));
    }
  });
  const p = page = await ctx.newPage();
  p.on('pageerror', e => errs.push(`${tag}: ${e.message}`));
  p.on('console', m => { if (m.type() === 'error' && !/favicon|manifest|sw\.js|service|fonts/i.test(m.text())) errs.push(`${tag} console: ${m.text()}`); });
  const S = () => p.evaluate(() => window.__timer.status);
  const tick = (ms, active = false) => p.evaluate(([ms, a]) => window.__timer.tick(ms, a), [ms, active]);
  const up = n => Math.ceil(Math.max(0, n) / 15) * T; // seconds → whole ticks in ms
  const noScroll = async where => { const w = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]); if (w[0] > w[1] + 1) errs.push(`${tag}: sideways scroll on ${where} (${w[0]} > ${w[1]})`); };
  const shot = async (name, full = false) => { await sleep(450); await p.screenshot({ path: `${SHOTS}/timer-${tag}-${name}.png`, fullPage: full }); };
  const taps = async (sel, where) => {
    const small = await p.evaluate(sel => [...document.querySelectorAll(sel)].filter(e => e.offsetParent !== null || getComputedStyle(e).position === 'fixed').map(e => { const r = e.getBoundingClientRect(); return [e.id || e.className || e.tagName, Math.round(r.width), Math.round(r.height)]; }).filter(([, w, h]) => w < 44 || h < 44), sel);
    if (small.length) errs.push(`${tag}: small tap targets on ${where}: ${JSON.stringify(small)}`);
  };
  const home = () => p.evaluate(() => window.__owl.go(window.__owl.home));
  const tapHome = () => p.click('.hello h1'); // a harmless tap = the child is here
  const answerGate = async scope => {
    const [x, y] = (await p.textContent(`${scope} .panel .note`)).match(/(\d+) × (\d+)/).slice(1).map(Number);
    await p.fill(`${scope} #ga`, String(x * y + 1)); await p.press(`${scope} #ga`, 'Enter');
    if (!/Not quite/.test(await p.textContent(`${scope} #gm`))) errs.push(`${tag}: wrong gate answer let a grown-up in (${scope})`);
    await p.fill(`${scope} #ga`, String(x * y)); await p.press(`${scope} #ga`, 'Enter');
  };
  const toGrownups = async () => { await home(); await p.click('#parent'); await answerGate('#view'); await p.waitForSelector('#ptPanel'); };

  await p.goto(URL);
  await p.waitForFunction(() => window.__owl && window.__timer);
  if (!await p.evaluate(() => window.__timer.on)) errs.push(`${tag}: timer is not on with __owlTimerForce`);

  stage = '1';
  // 1. off by default, and the Grown-ups panel with both players
  let s = await S();
  if (s.limit || s.brk || s.allowed != null) errs.push(`${tag}: timer not off by default ${JSON.stringify(s)}`);
  await toGrownups();
  const pan = await p.evaluate(() => ({ rows: [...document.querySelectorAll('.pt-player')].map(r => r.querySelector('.pt-ph b').textContent),
    lim: [...document.querySelectorAll('[data-lim]')].map(x => x.value), brk: [...document.querySelectorAll('[data-brk]')].map(x => x.value),
    limOpts: [...document.querySelector('[data-lim]').options].map(o => o.textContent), brkOpts: [...document.querySelector('[data-brk]').options].map(o => o.textContent),
    cols: document.querySelectorAll('.pt-player')[0].querySelectorAll('.pt-col').length, label: document.querySelector('.pt-chart').getAttribute('aria-label'),
    days: [...document.querySelectorAll('.pt-player')[0].querySelectorAll('.pt-days span')].map(x => x.textContent), hs: [...document.querySelectorAll('.pt-player')[0].querySelectorAll('.pt-col i')].map(i => i.offsetHeight) }));
  if (pan.rows.join() !== 'Mia,Leo') errs.push(`${tag}: panel players ${pan.rows}`);
  if (pan.lim.join() !== '0,0' || pan.brk.join() !== '0,0') errs.push(`${tag}: panel defaults ${pan.lim} ${pan.brk}`);
  if (pan.limOpts.join() !== 'Off,15 min,20 min,30 min,45 min,60 min') errs.push(`${tag}: limit options ${pan.limOpts}`);
  if (pan.brkOpts.join() !== 'Off,Every 10 min,Every 15 min,Every 20 min') errs.push(`${tag}: break options ${pan.brkOpts}`);
  if (pan.cols !== 7 || pan.days.length !== 7 || pan.days[6] !== 'Today') errs.push(`${tag}: chart has ${pan.cols} bars, days ${pan.days}`);
  if (!/Minutes played, last 7 days: .*\b30\b.*today/.test(pan.label)) errs.push(`${tag}: chart label ${pan.label}`);
  if (!(pan.hs[5] > pan.hs[1] && pan.hs[1] > 0)) errs.push(`${tag}: chart bars ${pan.hs}`);
  await noScroll('grown-ups corner'); await taps('#ptPanel select', 'play-time panel');
  await (await p.$('#ptPanel')).scrollIntoViewIfNeeded(); await (await p.$('#ptPanel')).screenshot({ path: `${SHOTS}/timer-${tag}-panel-before.png` });

  stage = '2';
  // 2. counting: only after a recent tap, only while visible
  await home(); await tapHome();
  let s0 = (await S()).secs; await tick(60000); let s1 = (await S()).secs;
  if (Math.abs(s1 - s0 - 60) > 1) errs.push(`${tag}: 60 s of play counted as ${s1 - s0}`);
  await tick(5 * 60000); let s2 = (await S()).secs; // no taps: stops about 2 minutes after the last one
  if (s2 - s0 < 105 || s2 - s0 > 135) errs.push(`${tag}: idle time counted (${s2 - s0} s after 6 min with one tap)`);
  await tapHome();
  await p.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
  await tick(60000, true); const s3 = (await S()).secs;
  if (s3 !== s2) errs.push(`${tag}: hidden page counted ${s3 - s2} s`);
  await p.evaluate(() => { delete document.visibilityState; document.dispatchEvent(new Event('visibilitychange')); });
  await tapHome(); await tick(30000); const s4 = (await S()).secs;
  if (Math.abs(s4 - s3 - 30) > 2) errs.push(`${tag}: visible again counted ${s4 - s3}`);
  // a second tab adds to the same minutes without counting the same seconds twice
  const p2 = await ctx.newPage(); p2.on('pageerror', e => errs.push(`${tag} tab2: ${e.message}`));
  await p2.goto(URL); await p2.waitForFunction(() => window.__timer); await p2.evaluate(() => window.__owl.go(window.__owl.home));
  await p2.evaluate(k => { window.__timer.skew = k; }, await p.evaluate(() => window.__timer.skew)); // same fast clock in both tabs
  await p2.click('.hello h1'); await tapHome();
  await tick(T, true); // tab 1 counts 15 s...
  await p2.evaluate(() => { window.__timer.skew += 15000; window.__timer.step(); }); // ...and tab 2 ticks for the same 15 s
  const s5 = (await S()).secs, s5b = await p2.evaluate(() => window.__timer.status.secs);
  if (s5 - s4 < 14 || s5 - s4 > 20 || s5b !== s5) errs.push(`${tag}: two tabs counted ${s5 - s4} s for 15 s (tab2 sees ${s5b}, tab1 ${s5})`);
  await p2.close();

  stage = '3';
  // 3. grown-up picks: Mia a break every 10 min (no limit), Leo a 15 min limit
  await toGrownups();
  await p.selectOption('[data-brk="p1"]', '10');
  if (!/Mia.*every 10 minutes/.test(await p.textContent('#ptMsg'))) errs.push(`${tag}: no saved message: ${await p.textContent('#ptMsg')}`);
  await p.selectOption('[data-lim="p2"]', '15');
  s = await S(); if (s.brk !== 10 || s.limit !== 0) errs.push(`${tag}: Mia settings ${JSON.stringify(s)}`);
  if (await p.evaluate(() => JSON.parse(localStorage.getItem('owlcrayon:state:p2')).pt.limit) !== 15) errs.push(`${tag}: Leo's limit not saved`);
  // time in the Grown-ups corner is not play time
  const g0 = (await S()).secs; await p.click('#ptPanel h2'); await tick(60000, true);
  if ((await S()).secs !== g0) errs.push(`${tag}: Grown-ups corner time counted`);

  stage = '4';
  // 4. wiggle break on the home screen
  await home(); await tapHome();
  s = await S(); await tick(up(s.breakIn - 15), true);
  if (await p.$('.pt-ov')) errs.push(`${tag}: break came early`);
  await tick(T, true);
  await p.waitForSelector('.pt-break', { timeout: 3000 });
  const br = await p.evaluate(() => ({ t: document.querySelector('.pt-card').innerText, n: document.querySelector('#ptN').textContent, back: document.querySelector('#ptBack').hidden, inert: document.getElementById('app').inert, role: document.querySelector('.pt-ov').getAttribute('role') }));
  if (!/Time for a wiggle break!/.test(br.t) || !/stretch like an owl/.test(br.t)) errs.push(`${tag}: break text ${br.t}`);
  if (br.n !== '20' || !br.back || !br.inert || br.role !== 'dialog') errs.push(`${tag}: break card state ${JSON.stringify(br)}`);
  await noScroll('break card'); await shot('break');
  await tick(8000); const mid = await p.evaluate(() => [document.querySelector('#ptN').textContent, document.querySelector('#ptIdea').textContent]);
  if (mid[0] !== '12' || !mid[1]) errs.push(`${tag}: countdown at 8 s: ${mid}`);
  const bs = (await S()).secs; await tick(12000, true);
  if ((await S()).secs !== bs) errs.push(`${tag}: break time counted as play`);
  await p.waitForSelector('#ptBack:not([hidden])');
  await taps('.pt-ov button:not([hidden])', 'break card'); await shot('break-done');
  await p.click('#ptBack'); await p.waitForSelector('.pt-ov', { state: 'detached' });
  if (await p.evaluate(() => document.getElementById('app').inert)) errs.push(`${tag}: app still inert after the break`);
  if ((await S()).breakIn < 590) errs.push(`${tag}: next break not reset (${(await S()).breakIn})`);

  stage = '5';
  // 5. a break that falls mid-question waits until it is answered
  const skill = await p.evaluate(() => Object.keys(window.__owl.MATH).find(k => window.__owl.MATH[k].world === 0));
  await p.evaluate(k => window.__owl.go(window.__owl.play, k), skill); await p.waitForSelector('.qcard .choice');
  s = await S(); await tick(up(s.breakIn), true);
  s = await S();
  if (!s.pending || s.overlay) errs.push(`${tag}: break did not wait for the question ${JSON.stringify(s)}`);
  await tick(30000, true); if (await p.$('.pt-ov')) errs.push(`${tag}: break interrupted the question`);
  for (const c of await p.$$('.qcard .choice')) { if (await p.$('.choice.right')) break; if (!await c.isDisabled()) await c.click(); }
  if (!await p.$('.choice.right')) errs.push(`${tag}: could not answer the question`);
  await tick(1000); if (await p.$('.pt-ov')) errs.push(`${tag}: break came before the cheer`);
  await tick(3000); await p.waitForSelector('.pt-break', { timeout: 3000 });
  await tick(20000); await p.click('#ptBack');
  await sleep(2600); // let the round move on to its next question (a real-time step of the quiz)
  // ...but never more than 60 s
  await p.evaluate(k => window.__owl.go(window.__owl.play, k), skill); await p.waitForSelector('.qcard .choice');
  s = await S(); await tick(up(s.breakIn), true);
  await tick(45000, true); if (await p.$('.pt-ov')) errs.push(`${tag}: break did not wait at all`);
  await tick(15000, true); await p.waitForSelector('.pt-break', { timeout: 3000 });
  if (!await p.$('.qcard')) errs.push(`${tag}: the question went away under the break card`);
  await tick(20000); await p.click('#ptBack');
  if (!await p.$('.qcard .choice')) errs.push(`${tag}: question lost after the break`);

  stage = '6';
  // 6. daily limit for Mia: heads-up, then "All done" over a drawing in progress
  await toGrownups();
  await p.selectOption('[data-brk="p1"]', '0');
  s = await S(); const lim = Math.ceil((s.secs / 60 + 5) / 15) * 15; // a limit a few minutes ahead
  if (![15, 20, 30, 45, 60].includes(lim)) errs.push(`${tag}: test limit ${lim}`);
  await p.selectOption('[data-lim="p1"]', String(lim));
  await home(); await p.click('#tArt'); await p.click('[data-tool="free"]'); await p.waitForSelector('#cv');
  const cv = await (await p.$('#cv')).boundingBox();
  await p.mouse.move(cv.x + 40, cv.y + 40); await p.mouse.down(); await p.mouse.move(cv.x + 160, cv.y + 120, { steps: 6 }); await p.mouse.up();
  const gal0 = await p.evaluate(() => JSON.parse(localStorage.getItem('owlcrayon:gallery:p1') || '[]').length);
  s = await S(); await tick(up(s.limitIn - 120), true);
  await sleep(150);
  const toastT = await p.evaluate(() => { const t = document.getElementById('toast'); return t && t.classList.contains('show') ? t.textContent : ''; });
  if (!/more minute/.test(toastT)) errs.push(`${tag}: no heads-up toast (${toastT})`);
  if (await p.$('.pt-ov')) errs.push(`${tag}: limit screen came with the heads-up`);
  await shot('headsup');
  s = await S(); await tick(up(s.limitIn), true);
  await p.waitForSelector('.pt-limit', { timeout: 3000 });
  const lm = await p.evaluate(() => ({ t: document.querySelector('.pt-card').innerText, pet: !!document.querySelector('.pt-card .pet'), gal: JSON.parse(localStorage.getItem('owlcrayon:gallery:p1') || '[]').length,
    blocked: (() => { const h = document.getElementById('homeBtn').getBoundingClientRect(); const e = document.elementFromPoint(h.left + h.width / 2, h.top + h.height / 2); return !!(e && e.closest('.pt-ov')); })(), inert: document.getElementById('app').inert, cv: !!document.getElementById('cv') }));
  if (!/All done for today!/.test(lm.t) || !/See you tomorrow/.test(lm.t) || !lm.pet) errs.push(`${tag}: limit screen ${JSON.stringify(lm)}`);
  if (lm.gal !== gal0 + 1 || !/drawing is saved/.test(lm.t)) errs.push(`${tag}: drawing not saved at the limit (${gal0} → ${lm.gal})`);
  if (!lm.blocked || !lm.inert || !lm.cv) errs.push(`${tag}: limit screen does not block, or the pad went away ${JSON.stringify(lm)}`);
  await noScroll('limit screen'); await taps('.pt-ov button', 'limit screen'); await shot('limit');
  const ls = (await S()).secs; await tick(60000, true);
  if ((await S()).secs !== ls) errs.push(`${tag}: time counted on the limit screen`);

  stage = '7';
  // 7. still there after a reload; the grown-up gate gives +10 minutes
  await p.reload(); await p.waitForFunction(() => window.__timer);
  // two players: the app starts on "Who's playing?" (no limit card there); Mia's card is back once she is picked
  if (!await p.$('.who') || await p.$('.pt-ov')) errs.push(`${tag}: reload did not start on Who's playing`);
  await p.click('.who-btn:has-text("Mia")');
  await p.waitForSelector('.pt-limit', { timeout: 3000 });
  if (/drawing is saved/.test(await p.textContent('.pt-card'))) errs.push(`${tag}: claims a drawing was saved after reload`);
  await p.click('#ptGrown'); await p.waitForSelector('.pt-ov #ga');
  await noScroll('limit gate'); await taps('.pt-ov button', 'limit gate'); await shot('limit-gate');
  await answerGate('.pt-ov'); await p.waitForSelector('#ptMore');
  await taps('.pt-ov button', 'grown-up choices'); await shot('limit-choices');
  await p.click('#ptMore'); await p.waitForSelector('.pt-ov', { state: 'detached' });
  s = await S();
  if (s.limitIn < 590 || s.limitIn > 615) errs.push(`${tag}: +10 minutes gave ${s.limitIn} s`);
  await home(); await tapHome(); await tick(up(s.limitIn), true);
  await p.waitForSelector('.pt-limit', { timeout: 3000 });
  await p.click('#ptGrown'); await answerGate('.pt-ov'); await p.click('#ptOff'); await p.waitForSelector('.pt-ov', { state: 'detached' });
  await tick(5 * 60000, true);
  s = await S(); if (s.overlay || s.allowed != null) errs.push(`${tag}: turn off for today did not stick ${JSON.stringify(s)}`);
  const miaSecs = s.secs;

  stage = '8';
  // 8. Leo has his own minutes and his own 15 minute limit
  await p.click('#whoBtn'); await p.click('.who-btn:has-text("Leo")'); await p.waitForSelector('#tMath');
  s = await S();
  if (s.pid !== 'p2' || s.limit !== 15 || s.brk !== 0 || s.secs !== 0) errs.push(`${tag}: Leo status ${JSON.stringify(s)}`);
  await tapHome(); await tick(up(s.limitIn), true);
  await p.waitForSelector('.pt-limit', { timeout: 3000 });
  if (!/Leo|sleepy/.test(await p.textContent('.pt-card'))) errs.push(`${tag}: Leo's limit card`);
  if (await p.evaluate(() => window.__timer.daySecs('p1', new Date().toLocaleDateString('sv'))) !== miaSecs) errs.push(`${tag}: Leo's play went to Mia`);
  await p.click('#ptGrown'); await answerGate('.pt-ov'); await p.click('#ptStay');
  if (!await p.$('.pt-limit #ptGrown')) errs.push(`${tag}: Keep resting did not go back`);
  await p.click('#ptGrown'); await answerGate('.pt-ov'); await p.click('#ptOff'); await p.waitForSelector('.pt-ov', { state: 'detached' });

  stage = '9';
  // 9. the panel after a reload: settings and today's minutes for each player
  await p.reload(); await p.waitForFunction(() => window.__timer);
  await toGrownups();
  const after = await p.evaluate(() => [...document.querySelectorAll('.pt-player')].map(r => ({ today: r.querySelector('.pt-today').textContent, lim: r.querySelector('[data-lim]').value, brk: r.querySelector('[data-brk]').value, last: r.querySelectorAll('.pt-col b')[6].textContent, lab: r.querySelector('.pt-chart').getAttribute('aria-label') })));
  const miaMin = Math.floor(miaSecs / 60);
  if (after[0].lim !== String(lim) || after[0].brk !== '0' || after[1].lim !== '15') errs.push(`${tag}: settings after reload ${JSON.stringify(after)}`);
  if (!after[0].today.includes(`Played today: ${miaMin} min`) || !/limit off today/.test(after[0].today)) errs.push(`${tag}: Mia today ${after[0].today} (want ${miaMin})`);
  if (!after[1].today.includes('Played today: 15 min') || after[1].last !== '15' || !/today 15/.test(after[1].lab)) errs.push(`${tag}: Leo today ${JSON.stringify(after[1])}`);
  await noScroll('grown-ups corner after'); await taps('#ptPanel select', 'play-time panel');
  await (await p.$('#ptPanel')).scrollIntoViewIfNeeded(); await (await p.$('#ptPanel')).screenshot({ path: `${SHOTS}/timer-${tag}-panel.png` });
  await p.click('#wtInside'); await p.waitForSelector('.wt-stats');
  if (!/Play time/.test(await p.textContent('#view'))) errs.push(`${tag}: What's inside does not mention Play time`);

  stage = '10';
  // 10. plain #selftest runs (no force flag) never see the timer, even with a limit long passed
  const ctx2 = await b.newContext({ viewport: vp });
  await ctx2.addInitScript(() => {
    const d = new Date().toLocaleDateString('sv');
    if (!localStorage.getItem('owlcrayon:profiles')) { localStorage.setItem('owlcrayon:profiles', JSON.stringify([{ id: 'p1', avatar: '🦊' }]));
      localStorage.setItem('owlcrayon:state:p1', JSON.stringify({ v: 2, name: 'Zoe', age: 5, stars: 0, streak: { n: 0, last: null }, skills: {}, review: [], owlMisses: [], owlTaught: [], plays: { math: 0, art: 0, owl: 0 }, speak: true, unlockAll: false, pt: { limit: 15, brk: 10, min: { [d]: 3600 } } })); }
  });
  const q = await ctx2.newPage(); q.on('pageerror', e => errs.push(`${tag} plain: ${e.message}`));
  await q.goto(URL); await q.waitForFunction(() => window.__timer); await q.click('.hello h1');
  const plain = await q.evaluate(() => { const a = window.__timer.status.secs; window.__timer.tick(5 * 60000, true); return { on: window.__timer.on, ov: !!document.querySelector('.pt-ov'), added: window.__timer.status.secs - a }; });
  await sleep(1200);
  if (plain.on || plain.ov || plain.added || await q.$('.pt-ov')) errs.push(`${tag}: timer active in a plain #selftest run ${JSON.stringify(plain)}`);
  await ctx2.close();

  console.log(`${tag}: Mia ${miaMin} min (limit ${lim}, off today), Leo 15 min; heads-up "${toastT}"`);
  await ctx.close();
}

(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const vp of [{ width: 390, height: 844 }, { width: 1024, height: 768 }]) {
    try { await run(b, vp, errs); } catch (e) { try { await page.screenshot({ path: `${SHOTS}/timer-${vp.width}-failed.png` }); } catch (x) {} errs.push(`${vp.width} (part ${stage}): ${e.message.split('\n')[0]}`); }
  }
  console.log('errors', errs.length ? errs : 'none');
  await b.close();
})();
