// Monkey / chaos test over the newest areas: My World, English & Reading, the drawing pad's brushes (and Brush
// Techniques lessons), the Crafts corner, the lazy art and craft builders and the grown-ups' progress report.
// With a fixed random seed (the page's Math.random is seeded too) it taps random visible buttons for thousands of
// steps: fast double taps, Back during animations and speech, drags on the pad and the map, rotating between a phone
// and a tablet, reloads mid-activity, switching players (one of them an old save with no st.english, st.crafts or
// st.world), and a phase where localStorage is full. One run has speech, the other has speechSynthesis removed.
// After every step it checks: no page errors, stars a whole number that never goes down, the My World wallet never
// negative, stars and spending already saved; every so often it goes home and checks that no timer or animation
// frame loop is left running. Then regression checks for each bug the monkey (and code reading) found.
// Prints "errors none" and "fails none" when clean. Takes PORT (default 8766), STEPS (default 1600 per run), SEED.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, STEPS = +process.env.STEPS || 1600, SEED = +process.env.SEED || 40;
const URL = `http://localhost:${PORT}/index.html#selftest`;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errs = [], fails = [];
const fail = m => { if (fails.length < 60) console.log('FAIL', m); fails.push(m); };
const mulberry = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const OLD = { v: 2, name: 'Old', age: 6, stars: 37, streak: { n: 1, last: '2026-10-01' }, skills: {}, review: [], owlMisses: [], owlTaught: [], plays: { math: 2, art: 0, owl: 0 }, speak: true, unlockAll: false };

// Runs in the page before the app: seeded Math.random, a stubbed print, counters for intervals and animation frames,
// a switch that makes localStorage "full", and (for one run) no speech at all.
function init({ seed, noSpeech }) {
  let a = seed + (+sessionStorage.getItem('t40reloads') || 0) * 7919;
  Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  window.print = () => { window.__printed = (window.__printed || 0) + 1; };
  window.__iv = new Map(); const si = window.setInterval, ci = window.clearInterval;
  window.setInterval = function (f, ms, ...r) { const id = si.call(window, f, ms, ...r); window.__iv.set(id, String(f).slice(0, 90)); return id; };
  window.clearInterval = function (id) { window.__iv.delete(id); return ci.call(window, id); };
  window.__rafN = 0; window.__rafSrc = {}; const raf = window.requestAnimationFrame;
  window.requestAnimationFrame = function (f) { window.__rafN++; const k = String(f).slice(0, 60); window.__rafSrc[k] = (window.__rafSrc[k] || 0) + 1; return raf.call(window, f); };
  const set = Storage.prototype.setItem;
  Storage.prototype.setItem = function (k, v) { if (window.__full && /^owlcrayon:/.test(k)) throw new DOMException('The quota has been exceeded.', 'QuotaExceededError'); return set.call(this, k, v); };
  window.__said = [];
  if (noSpeech) { try { delete window.speechSynthesis; } catch (e) {} try { delete Window.prototype.speechSynthesis; } catch (e) {} try { delete window.SpeechSynthesisUtterance; } catch (e) {} }
  else { try { speechSynthesis.speak = u => { window.__said.push(u.text); if (window.__fireStart && u.onstart) setTimeout(() => u.onstart(), 5); }; } catch (e) {} }
}

async function setup(b, tag, noSpeech, vp) {
  const ctx = await b.newContext({ viewport: vp, hasTouch: true });
  await ctx.addInitScript(init, { seed: SEED, noSpeech });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(`${tag}: page error: ${e.message}`));
  p.on('console', m => { if (m.type() === 'error' && !/favicon|manifest|sw\.js|service|fonts|Failed to load resource/i.test(m.text())) errs.push(`${tag} console: ${m.text().slice(0, 300)}`); });
  p.on('dialog', d => d.dismiss().catch(() => {}));
  return { ctx, p };
}
const ready = p => p.waitForFunction(() => window.__owl && window.__world && window.__english && window.__crafts && window.__report && document.querySelector('#view').children.length, null, { timeout: 15000 });
const seedPlayers = p => p.evaluate(old => {
  localStorage.clear(); sessionStorage.clear();
  localStorage.setItem('owlcrayon:profiles', JSON.stringify([{ id: 'p1', avatar: '🦊' }, { id: 'p2', avatar: '🐼' }]));
  // p1 is a bare save (name, age 8 so My World asks the subtraction, stars); p2 an old save from before the newer areas
  localStorage.setItem('owlcrayon:current', '"p1"'); localStorage.setItem('owlcrayon:state:p1', JSON.stringify({ name: 'Kid', age: 8, stars: 30 })); localStorage.setItem('owlcrayon:state:p2', JSON.stringify(old));
}, OLD);
// The state the invariants look at.
const snap = p => p.evaluate(() => {
  const o = window.__owl, s = o.st, w = s.world || {};
  // what is in localStorage for the player now playing (only compared when no write is waiting for space)
  let saved = null; try { if (!o.storeWaiting()) saved = JSON.parse(localStorage.getItem("owlcrayon:state:" + o.pid)); } catch (e) {}
  return { pid: o.pid, name: s.name, stars: s.stars, spent: w.spent || 0, wallet: window.__world.wallet(), xp: (s.english || {}).xp || 0, cr: (s.crafts || {}).stars || 0,
    saved: saved && { stars: saved.stars, spent: (saved.world || {}).spent || 0, xp: (saved.english || {}).xp || 0, cr: (saved.crafts || {}).stars || 0, name: saved.name }, full: !!window.__full, waiting: o.storeWaiting() };
});

// Every visible, enabled thing a child could tap on the current screen (the grown-ups' page only offers the report).
const targets = p => p.evaluate(() => {
  const vw = innerWidth, vh = innerHeight, out = [];
  const gate = document.querySelector('#ga');
  if (gate) { const t = document.querySelector('#view .panel .note').textContent.match(/(\d+) × (\d+)/); return { gate: t ? +t[1] * +t[2] : 0 }; }
  const parent = !!document.querySelector('#report');
  const sel = parent ? '#report button, #backBtn' : '#view button, #view [data-c], #view .mw-it, #view input[type=search], #view canvas, #homeBtn, #whoBtn';
  for (const el of document.querySelectorAll(sel)) {
    if (el.disabled || el.closest('[hidden]') || el.matches('#bk, [data-del], #rs, label[for=rs]')) continue;
    el.scrollIntoView({ block: 'nearest' });
    const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) continue;
    const x = Math.min(vw - 2, Math.max(2, r.left + r.width / 2)), y = Math.min(vh - 2, Math.max(2, r.top + r.height / 2));
    const hit = document.elementFromPoint(x, y); if (!hit || !(el === hit || el.contains(hit) || hit.contains(el))) continue;
    out.push({ x, y, w: r.width, h: r.height, kind: el.tagName === 'CANVAS' ? 'canvas' : el.tagName === 'INPUT' ? 'input' : el.id === 'whoBtn' ? 'who' : el.id === 'homeBtn' ? 'home' : 'btn', id: el.id || el.className.toString().slice(0, 30) });
  }
  const h = document.querySelector('#view .crumbs h1, #view h1');
  return { list: out, home: !!document.querySelector('#tMath'), who: !!document.querySelector('.who'), screen: h ? h.textContent.trim().slice(0, 40) : '?' };
});

async function monkey(p, tag, steps, rng) {
  const R = n => Math.floor(rng() * n), chance = x => rng() < x;
  const AREAS = ['#tWorld', '#tEnglish', '#tCrafts', '#tDraw', '#parent', '#tArt'];
  const DEEP = [ // deep paths straight into an area, as the test hooks and "next up" cards do
    () => window.__owl.go(window.__owl.drawLesson, 'bt-wash'), () => window.__owl.go(window.__owl.drawLesson, 'bt-chalk'), () => window.__crafts.open('crane'), () => window.__crafts.made('heart'),
    () => window.__english.go('blend'), () => window.__english.go('phonics', 'letters'), () => window.__english.go('spell'), () => window.__english.go('hunt'), () => window.__english.go('build'),
    () => window.__english.go('twister', 0), () => window.__english.go('wotd'), () => window.__world.open(), () => window.__world.shop('animal'), () => window.__world.book()];
  const sizes = [{ width: 390, height: 844 }, { width: 820, height: 1180 }];
  let vp = 0, last = await snap(p), maxGain = 0, counts = { tap: 0, dbl: 0, back: 0, drag: 0, rotate: 0, reload: 0, who: 0, deep: 0, full: 0, leak: 0 };
  const best = {}, screens = new Set(); // highest star count seen per player; screen titles visited
  for (let i = 0; i < steps; i++) {
    let what = 'tap';
    try {
      const r = rng();
      if (r < 0.012) { what = 'reload'; counts.reload++; await p.evaluate(() => sessionStorage.setItem('t40reloads', (+sessionStorage.getItem('t40reloads') || 0) + 1)); await p.reload(); await ready(p); }
      else if (r < 0.03) { what = 'rotate'; counts.rotate++; vp = 1 - vp; await p.setViewportSize(sizes[vp]); await sleep(60); }
      else if (r < 0.05) { what = 'deep'; counts.deep++; await p.evaluate(`(${DEEP[R(DEEP.length)]})()`); }
      else if (r < 0.06) { what = 'who'; counts.who++; await p.click('#whoBtn'); await p.click(`.who [data-p="${chance(0.5) ? 'p1' : 'p2'}"]`); }
      else if (r < 0.067 && !last.full && i > steps * 0.4 && i < steps * 0.8) { what = 'full on'; counts.full++; await p.evaluate(() => { window.__full = true; }); }
      else if (r < 0.075 && last.full) { what = 'full off'; await p.evaluate(() => { window.__full = false; }); }
      else {
        const T = await targets(p); if (T.screen) screens.add(T.screen);
        if (T.gate != null) { what = 'gate'; await p.fill('#ga', String(T.gate)); await p.press('#ga', 'Enter'); }
        else if (T.who) { what = 'who pick'; await p.click(`.who [data-p="${chance(0.5) ? 'p1' : 'p2'}"]`); }
        else if (T.home || !T.list.length || chance(0.03)) { what = 'area'; await p.click('#homeBtn'); await p.click(AREAS[R(AREAS.length)]); }
        else {
          let pool = T.list.filter(t => t.kind !== 'who' && t.kind !== 'home');
          if (!pool.length) pool = T.list;
          const drags = pool.filter(t => t.kind === 'canvas' || /mw-it/.test(t.id));
          const t = drags.length && chance(0.2) ? drags[R(drags.length)] : pool[R(pool.length)];
          if (t.kind === 'canvas' || (/mw-it/.test(t.id) && chance(0.5))) { // a scribble or a drag
            what = 'drag ' + t.id; counts.drag++;
            await p.mouse.move(t.x, t.y); await p.mouse.down();
            for (let k = 1; k <= 6; k++) await p.mouse.move(t.x + (rng() - 0.5) * Math.min(t.w, 300), t.y + (rng() - 0.5) * Math.min(t.h, 300), { steps: 2 });
            if (chance(0.15)) { await p.click('#backBtn').catch(() => {}); what += ' +back mid-stroke'; }
            await p.mouse.up();
          } else if (t.kind === 'input') { what = 'type'; await p.mouse.click(t.x, t.y); await p.keyboard.type(['owl', 'box', 'star', 'paper', 'zz'][R(5)]); }
          else {
            const k = rng();
            if (k < 0.12) { what = 'double ' + t.id; counts.dbl++; await p.mouse.click(t.x, t.y); await sleep(25); await p.mouse.click(t.x, t.y); }
            else if (k < 0.2) { what = 'tap+back ' + t.id; counts.back++; await p.mouse.click(t.x, t.y); await sleep(R(3) * 120); const bb = await p.$('#backBtn'); if (bb) await bb.click({ timeout: 500 }).catch(() => {}); }
            else { what = 'tap ' + t.id; counts.tap++; await p.mouse.click(t.x, t.y); }
          }
        }
      }
      await sleep(chance(0.1) ? 700 : 40);
      const s = await snap(p);
      if (!Number.isInteger(s.stars) || s.stars < 0) fail(`${tag} step ${i} (${what}): stars ${s.stars}`);
      if (!(s.wallet >= 0) || s.spent > s.stars) fail(`${tag} step ${i} (${what}): wallet ${s.wallet}, spent ${s.spent} of ${s.stars}`);
      if (best[s.pid] != null && s.stars < best[s.pid] && !last.full && !s.full) fail(`${tag} step ${i} (${what}): stars went down for ${s.pid} ${best[s.pid]} -> ${s.stars} (before: ${JSON.stringify(last)})`);
      if (!s.full && !last.full) best[s.pid] = Math.max(best[s.pid] || 0, s.stars);
      if (s.pid === last.pid && !/reload|who/.test(what)) maxGain = Math.max(maxGain, s.stars - last.stars);
      if (s.pid === last.pid && s.stars - last.stars > 60) fail(`${tag} step ${i} (${what}): +${s.stars - last.stars} stars in one step`);
      if (!s.full && s.saved && (s.saved.stars !== s.stars || s.saved.spent !== s.spent || s.saved.xp !== s.xp || s.saved.cr !== s.cr))
        fail(`${tag} step ${i} (${what}): not saved: ${JSON.stringify(s.saved)} vs ${JSON.stringify([s.stars, s.spent, s.xp, s.cr])}`);
      if (s.full && !last.full) await p.evaluate(() => { window.__fullAt = window.__owl.st.stars; });
      last = s;
      if (i % 200 === 199) { counts.leak++; await leakCheck(p, `${tag} step ${i}`); }
      if (errs.length > 40) break;
    } catch (e) { if (!/Target closed|detached|timeout|Timeout/i.test(e.message)) errs.push(`${tag} step ${i} (${what}): ${e.message.split('\n')[0]}`); }
  }
  await p.evaluate(() => { window.__full = false; });
  console.log(`${tag}: ${JSON.stringify(counts)}, max stars from one step ${maxGain}, stars ${JSON.stringify(best)}, ${screens.size} screens`);
  if (process.env.SCREENS) console.log([...screens].join(' | '));
}

// Go home and wait: nothing from the screen just left may keep an interval or an animation frame loop running.
let baseIv = null;
async function leakCheck(p, where) {
  await p.evaluate(() => { window.__full = false; });
  await p.evaluate(() => window.__owl.go(window.__owl.home)); await sleep(2700);
  const r = await p.evaluate(async () => { const n0 = window.__rafN; window.__rafSrc = {}; await new Promise(r => setTimeout(r, 1000)); return { raf: window.__rafN - n0, src: window.__rafSrc, iv: [...window.__iv.values()] }; });
  if (baseIv == null) baseIv = r.iv.length;
  if (r.raf > 3) fail(`${where}: ${r.raf} animation frames a second on the home screen after leaving: ${JSON.stringify(r.src).slice(0, 300)}`);
  if (r.iv.length > baseIv) fail(`${where}: ${r.iv.length - baseIv} intervals left running: ${r.iv.slice(baseIv).join(' | ').slice(0, 300)}`);
}

(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  // ---------- 1. the monkey: phone with speech, then tablet with no speechSynthesis ----------
  for (const [tag, noSpeech, vp, seed] of [['speech', false, { width: 390, height: 844 }, SEED], ['nospeech', true, { width: 820, height: 1180 }, SEED + 1]]) {
    const { ctx, p } = await setup(b, tag, noSpeech, vp);
    await p.goto(URL); await seedPlayers(p); await p.reload(); await ready(p);
    if (noSpeech && await p.evaluate(() => 'speechSynthesis' in window)) fail('nospeech: speechSynthesis still there');
    await p.click('.who [data-p="p1"]').catch(() => {});
    await leakCheck(p, `${tag} start`);
    await monkey(p, tag, STEPS, mulberry(seed));
    await leakCheck(p, `${tag} end`);
    // the old save picked up the newer fields only where they were used, and still loads
    await p.click('#whoBtn'); await p.click('.who [data-p="p2"]');
    const o = await p.evaluate(() => ({ name: window.__owl.st.name, ok: !!document.querySelector('#tMath') }));
    if (o.name !== 'Old' || !o.ok) fail(`${tag}: old save did not load after the monkey: ${JSON.stringify(o)}`);
    await ctx.close();
  }

  // ---------- 2. regression checks ----------
  await regressions(b);
  await b.close();
  console.log('errors', errs.length ? '\n' + [...new Set(errs)].slice(0, 40).join('\n') : 'none');
  console.log('fails', fails.length ? fails.length : 'none');
})();

async function regressions(b) {
  const { ctx, p } = await setup(b, 'reg', false, { width: 390, height: 844 });
  const fresh = async (state, extra) => {
    await p.goto(URL); await p.evaluate(([s, x]) => {
      localStorage.clear(); sessionStorage.clear(); window.__full = false;
      if (s) { localStorage.setItem('owlcrayon:profiles', JSON.stringify([{ id: 'p1', avatar: '🦊' }, { id: 'p2', avatar: '🐼' }])); localStorage.setItem('owlcrayon:current', '"p1"');
        localStorage.setItem('owlcrayon:state:p1', JSON.stringify(s)); localStorage.setItem('owlcrayon:state:p2', JSON.stringify(x || s)); }
    }, [state, extra]); await p.reload(); await ready(p);
    if (await p.$('.who')) await p.click('.who [data-p="p1"]');
  };
  const n0 = errs.length;

  try {
  // 1. Storage full: progress made while nothing can be saved survives switching players and back (it used to read
  //    the older copy back from localStorage), and is written out as soon as there is space again.
  await fresh({ ...OLD, name: 'Ana', stars: 10 }, { ...OLD, name: 'Ben', stars: 20 });
  await p.evaluate(() => { window.__full = true; window.__owl.addStars(4); });
  await p.click('#whoBtn'); await p.click('.who [data-p="p2"]'); await p.click('#whoBtn'); await p.click('.who [data-p="p1"]');
  let r = await p.evaluate(() => ({ name: window.__owl.st.name, stars: window.__owl.st.stars, home: !!document.querySelector('#tMath') }));
  if (r.name !== 'Ana' || r.stars !== 14 || !r.home) fail(`storage full: switching players and back lost progress ${JSON.stringify(r)} (want Ana, 14 stars)`);
  await p.evaluate(() => { window.__full = false; window.__owl.addStars(1); });
  r = await p.evaluate(() => ({ cur: JSON.parse(localStorage.getItem('owlcrayon:current')), stars: JSON.parse(localStorage.getItem('owlcrayon:state:p1')).stars, waiting: window.__owl.storeWaiting() }));
  if (r.cur !== 'p1' || r.stars !== 15 || r.waiting) fail(`storage full: not written out once there was space ${JSON.stringify(r)}`);
  // space comes back, then the app is closed before anything else is saved: it is written out on the way out
  await p.evaluate(() => { window.__full = true; window.__owl.addStars(2); window.__full = false; });
  await p.reload(); await ready(p); if (await p.$('.who')) await p.click('.who [data-p="p1"]');
  r = await p.evaluate(() => window.__owl.st.stars);
  if (r !== 17) fail(`storage full: stars earned while full were lost when the app closed after space came back (${r}, want 17)`);
  // a full storage while drawing, buying, crafting and reading never throws
  await p.evaluate(() => { window.__full = true; });
  await p.evaluate(() => window.__crafts.made('heart')); await p.click('#crStk'); await p.click('[data-k]');
  await p.evaluate(() => window.__world.open()); await p.evaluate(() => window.__english.go('phonics', 'letters')); await p.click('[data-ph="3"]');
  await p.evaluate(() => { window.__full = false; });
  await p.reload(); await ready(p);
  } catch (e) { fail(`regression 1 stopped: ${e.message.split('\n')[0]}`); await p.goto(URL).catch(() => {}); }

  try {
  // 2. Old and bare saves: a save with only a name, an age and stars (no skills, streak, plays, art...) loads, and every
  //    new area and the report open; st.english, st.crafts and st.world fill in when first used.
  await fresh({ name: 'Bare', age: 7, stars: 12 }, { ...OLD, art: { done: { house: 1 } }, streak: null, plays: null, skills: { add10: { m: 0.5, seen: 3, hist: [1] } } });
  r = await p.evaluate(() => ({ name: window.__owl.st.name, stars: window.__owl.st.stars, home: !!document.querySelector('#tMath'), streak: window.__owl.st.streak.n, plays: window.__owl.st.plays.math }));
  if (r.name !== 'Bare' || r.stars !== 12 || !r.home || r.streak !== 0 || r.plays !== 0) fail(`bare save did not load ${JSON.stringify(r)}`);
  for (const id of ['p1', 'p2']) {
    await p.click('#whoBtn'); await p.click(`.who [data-p="${id}"]`);
    for (const t of ['#tEnglish', '#tWorld', '#tCrafts', '#tArt', '#tDraw']) { await p.click('#homeBtn'); await p.click(t); if (!await p.$('#backBtn')) fail(`${id}: ${t} did not open on an old save`); }
    await p.click('#homeBtn'); await p.click('#parent');
    const [x, y] = (await p.textContent('#view .panel .note')).match(/(\d+) × (\d+)/).slice(1).map(Number);
    await p.fill('#ga', String(x * y)); await p.press('#ga', 'Enter'); await p.waitForSelector('#report');
  }
  r = await p.evaluate(() => ({ art: window.__owl.st.art.done.house, add: window.__owl.st.skills.add10.seen, en: typeof window.__owl.st.english, w: typeof window.__owl.st.world }));
  if (r.art !== 1 || r.add !== 3 || r.en !== 'object' || r.w !== 'object') fail(`old save lost its progress or did not fill in new areas ${JSON.stringify(r)}`);
  } catch (e) { fail(`regression 2 stopped: ${e.message.split('\n')[0]}`); await p.goto(URL).catch(() => {}); }

  try {
  // 3. My World with a damaged world (an unknown thing, negative spending): opens, and the wallet is not inflated.
  await fresh({ ...OLD, name: 'Dee', stars: 30, world: { items: [null, { u: 1, id: 'nothing', x: 7, y: 7 }, { u: 2, id: 'cat', x: 8, y: 8, t: '2026-10-01' }], lands: ['home'], spent: -40, n: 2, z: 9 } });
  await p.evaluate(() => window.__world.open()); await sleep(200);
  r = await p.evaluate(() => ({ wallet: window.__world.wallet(), stars: window.__owl.st.stars, items: window.__world.w.items.length, map: !!document.querySelector('#mwMap .mw-it') }));
  if (r.wallet !== r.stars || r.items !== 1 || !r.map) fail(`damaged world ${JSON.stringify(r)}`);
  } catch (e) { fail(`regression 3 stopped: ${e.message.split('\n')[0]}`); await p.goto(URL).catch(() => {}); }

  try {
  // 4. The sound song marks each letter as heard and saves it (it used to save before the song, so it was lost).
  await fresh(null);
  await p.evaluate(() => { window.__fireStart = true; window.__english.go('phonics', 'letters'); }); await p.click('#enSong'); await sleep(600);
  r = await p.evaluate(() => Object.keys((JSON.parse(localStorage.getItem("owlcrayon:state:" + window.__owl.pid)).english || {}).heard || {}).length);
  if (r < 26) fail(`sound song: ${r} of 26 letters saved as heard`);
  await p.evaluate(() => { window.__fireStart = false; });
  } catch (e) { fail(`regression 4 stopped: ${e.message.split('\n')[0]}`); await p.goto(URL).catch(() => {}); }

  try {
  // 5. Crafts "Draw my craft": after turning a phone into a tablet the line still lands under the finger.
  await p.evaluate(() => window.__crafts.made('heart')); await p.click('#crDraw');
  await p.setViewportSize({ width: 820, height: 1180 }); await sleep(300);
  const box = await p.evaluate(() => { const c = document.getElementById('crCv'); c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  await p.mouse.move(box.x + box.w * 0.8, box.y + box.h * 0.5); await p.mouse.down(); await p.mouse.move(box.x + box.w * 0.9, box.y + box.h * 0.6, { steps: 8 }); await p.mouse.up();
  r = await p.evaluate(() => { const c = document.getElementById('crCv'), d = c.getContext('2d').getImageData(Math.round(c.width * 0.85) - 6, Math.round(c.height * 0.55) - 6, 12, 12).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 200) n++; return n; });
  if (r < 10) fail(`crafts drawing: after rotating, the line was not under the finger (${r} inked pixels there)`);
  await p.setViewportSize({ width: 390, height: 844 });
  } catch (e) { fail(`regression 5 stopped: ${e.message.split('\n')[0]}`); await p.goto(URL).catch(() => {}); }

  try {
  // 6. Print: leaving the report clears the print-only mode, so printing anything later is not blank.
  await p.click('#homeBtn'); await p.click('#parent');
  { const [x, y] = (await p.textContent('#view .panel .note')).match(/(\d+) × (\d+)/).slice(1).map(Number); await p.fill('#ga', String(x * y)); await p.press('#ga', 'Enter'); }
  await p.waitForSelector('#rpPrint'); await p.click('#rpPrint'); await p.click('#homeBtn');
  if (await p.evaluate(() => document.body.classList.contains('rp-printing'))) fail('print: the print-only mode stayed on after leaving the report');
  } catch (e) { fail(`regression 6 stopped: ${e.message.split('\n')[0]}`); await p.goto(URL).catch(() => {}); }

  try {
  // 7. Deep links before the lazy builders ran: a Brush Techniques lesson (built last, in brushes.js) and a craft from the
  //    last crafts file open with their brush and paper, and the idle builders that come later add nothing twice.
  await p.goto(URL); await p.evaluate(() => { localStorage.clear(); sessionStorage.clear(); }); await p.reload();
  await p.waitForFunction(() => window.__owl && window.__crafts);
  r = await p.evaluate(() => { const before = window.__owl.artPending, cb = window.__crafts.pending(); window.__owl.go(window.__owl.drawLesson, 'bt-cloud'); const pad = window.__owl.livePad;
    window.__crafts.open('starbox'); return { before, cb, brush: pad.brush(), paper: pad.paper(), title: document.querySelector('.crumbs h1').textContent }; });
  if (!(r.before > 0) || !(r.cb > 0)) fail(`deep link: the builders had already run (${JSON.stringify(r)}), so this checks nothing`);
  if (r.brush !== 'watercolor' || r.paper !== 'wc') fail(`deep link: Brush Techniques lesson opened with ${r.brush} on ${r.paper}`);
  if (!/star box/i.test(r.title)) fail(`deep link: craft page shows "${r.title}"`);
  const counts = () => p.evaluate(() => { const L = window.__owl.LESSONS, ids = L.map(l => l.id), C = window.__crafts.CRAFTS.map(c => c.id); return { l: ids.length, lu: new Set(ids).size, c: C.length, cu: new Set(C).size, cats: window.__owl.ART_CATS.length, catsU: new Set(window.__owl.ART_CATS.map(c => c.id)).size }; });
  const c1 = await counts(); await sleep(6000); const c2 = await counts();
  if (JSON.stringify(c1) !== JSON.stringify(c2) || c1.l !== c1.lu || c1.c !== c1.cu || c1.cats !== c1.catsU) fail(`deep link: lists changed or doubled after the idle builders ${JSON.stringify([c1, c2])}`);
  } catch (e) { fail(`regression 7 stopped: ${e.message.split('\n')[0]}`); }

  try {
  // 8. Leaving mid-activity leaves nothing running: Back in the middle of a spray-paint stroke (finger still down), a
  //    craft movie playing, My World's animal timer.
  baseIv = null; await leakCheck(p, 'before leaving mid-activity');
  await p.evaluate(() => window.__owl.go(window.__owl.home)); await p.click('#tDraw'); await sleep(200);
  await p.evaluate(() => window.__owl.livePad.setBrush('spray'));
  const cv = await p.evaluate(() => { const c = document.getElementById('cv'); c.scrollIntoView({ block: 'center' }); const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  await p.mouse.move(cv.x, cv.y); await p.mouse.down(); await p.mouse.move(cv.x + 30, cv.y + 10, { steps: 4 });
  await p.evaluate(() => document.getElementById('backBtn').click()); await p.mouse.up();
  await p.evaluate(() => window.__crafts.open('crane')); await sleep(300); await p.evaluate(() => document.getElementById('backBtn').click());
  await p.evaluate(() => window.__world.open()); await sleep(300); await p.evaluate(() => document.getElementById('backBtn').click());
  await leakCheck(p, 'leave mid-activity');
  } catch (e) { fail(`regression 8 stopped: ${e.message.split('\n')[0]}`); }

  console.log(`regressions done${errs.length > n0 ? ' (with errors)' : ''}`);
  await ctx.close();
}
