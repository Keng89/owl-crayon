// Easy to find, fast to open: a cold load on a phone with the CPU slowed 4x (a mid-range phone) paints the home
// screen within a budget (median of 3 loads; it was about 3.4 s before the art lessons and crafts were built lazily,
// about 2 s after); the art lessons and crafts are not built at startup, then get built while the app is idle;
// on a phone (390x844) and a tablet (820x1180) the home screen shows all 10 areas in three groups (Learn, Make, Play)
// on the first screen, each with a big picture and a name, and each tile opens its area and Home comes back; no
// sideways scroll; the app still works offline after the first visit. Prints "errors none" and "fails none" when clean.
// Tests take PORT (default 8766) and BUDGET (ms, default 2800). Screenshots go to SHOTS.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.', BUDGET = +process.env.BUDGET || 2800;
const URL = `http://localhost:${PORT}/index.html`;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errs = [], fails = [];
const watch = (p, tag) => {
  p.on('pageerror', e => errs.push(`${tag}: ${e.message}`));
  p.on('console', m => { if (m.type() === 'error' && !/favicon|manifest|sw\.js|service|fonts|Failed to load resource/i.test(m.text())) errs.push(`${tag} console: ${m.text()}`); });
};
const GROUPS = { Learn: ['tMath', 'tEnglish', 'tScience', 'tOwl'], Make: ['tArt', 'tCrafts', 'tDraw'], Play: ['tGames', 'tQuest', 'tWorld'] };

(async () => {
  const b = await chromium.launch();

  // 1. Cold load speed with 4x CPU throttle: time until the home tiles are in the page and a frame has been painted.
  const times = [];
  for (let i = 0; i < 4; i++) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    await ctx.addInitScript(() => {
      new MutationObserver((_, o) => { if (document.getElementById('tWorld')) { o.disconnect(); requestAnimationFrame(() => setTimeout(() => { window.__homePaint = performance.now(); }, 0)); } })
        .observe(document, { childList: true, subtree: true });
    });
    const p = await ctx.newPage(); watch(p, 'speed');
    const cdp = await ctx.newCDPSession(p);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await p.goto(URL);
    await p.waitForFunction(() => window.__homePaint, null, { timeout: 30000 });
    const r = await p.evaluate(() => ({ home: Math.round(window.__homePaint), fcp: Math.round((performance.getEntriesByType('paint').find(e => e.name === 'first-contentful-paint') || {}).startTime || 0) }));
    if (i > 0) times.push(r); // the first load warms up the browser
    await ctx.close();
  }
  const med = times.map(t => t.home).sort((x, y) => x - y)[1];
  console.log('home paint ms (4x CPU):', times.map(t => t.home).join(', '), '| median', med, '| budget', BUDGET, '| first paint', times.map(t => t.fcp).join(', '));
  if (med > BUDGET) fail(`home screen painted in ${med} ms, over the ${BUDGET} ms budget`);

  // 2. The home screen on a phone and a tablet.
  for (const [w, h, tag] of [[390, 844, 'phone'], [820, 1180, 'tablet']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 500 });
    await ctx.addInitScript(() => { try { speechSynthesis.speak = () => {}; } catch (e) {} });
    const p = await ctx.newPage(); watch(p, tag);
    await p.goto(URL + '#selftest');
    await p.waitForFunction(() => window.__owl && window.__crafts && document.getElementById('tMath'));
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (o > 1) fail(`${tag}: sideways scroll ${o}px at ${where}`); };

    // Lazy data: the art lesson and craft builders are still waiting at startup (built when their area opens).
    const pend = await p.evaluate(() => ({ art: window.__owl.artPending, crafts: window.__crafts.pending() }));
    if (!(pend.art >= 10) || !(pend.crafts >= 3)) fail(`${tag}: lesson or craft data was built at startup ${JSON.stringify(pend)}`);
    const H = await p.evaluate(G => {
      const out = { groups: [], tiles: [], H: innerHeight };
      document.querySelectorAll('#view .hgroup').forEach(g => out.groups.push([g.querySelector('.hg-title').textContent.trim(), [...g.querySelectorAll('.tile')].map(t => t.id)]));
      for (const id of Object.values(G).flat()) {
        const t = document.getElementById(id); if (!t) { out.tiles.push({ id, missing: true }); continue; }
        const r = t.getBoundingClientRect(), big = t.querySelector('.big'), name = (t.querySelector('h2') || {}).textContent || '';
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        out.tiles.push({ id, top: Math.round(r.top), bottom: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height), name, pic: big ? big.textContent.trim() : '', picSize: big ? parseFloat(getComputedStyle(big).fontSize) : 0, nameSize: parseFloat(getComputedStyle(t.querySelector('h2')).fontSize), onTop: !!hit && t.contains(hit) });
      }
      return out;
    }, GROUPS);
    for (const [name, ids] of Object.entries(GROUPS)) {
      const g = H.groups.find(x => x[0].endsWith(name));
      if (!g) fail(`${tag}: no ${name} group`); else if (JSON.stringify(g[1]) !== JSON.stringify(ids)) fail(`${tag}: ${name} group has ${g[1]}`);
    }
    for (const t of H.tiles) {
      if (t.missing) { fail(`${tag}: no tile ${t.id}`); continue; }
      if (t.bottom > H.H) fail(`${tag}: ${t.id} is below the first screen (${t.bottom} > ${H.H})`);
      if (t.w < 96 || t.h < 96) fail(`${tag}: ${t.id} is small ${t.w}x${t.h}`);
      if (!t.pic || t.picSize < 40) fail(`${tag}: ${t.id} picture missing or small (${t.pic} ${t.picSize}px)`);
      if (!t.name.trim() || t.nameSize < 15) fail(`${tag}: ${t.id} label missing or small (${t.name} ${t.nameSize}px)`);
      if (!t.onTop) fail(`${tag}: ${t.id} is covered by something`);
    }
    const docH = await p.evaluate(() => document.documentElement.scrollHeight);
    if (docH > h * 2.2) fail(`${tag}: home screen is ${docH}px tall (endless scroll)`);
    await noScroll('home');
    await sleep(200); await p.screenshot({ path: `${SHOTS}/home38-${tag}.png` });

    // Without opening anything, the lessons and crafts get built a little later while the app is idle.
    await p.waitForFunction(() => !window.__owl.artPending && !window.__crafts.pending(), null, { timeout: 30000 }).catch(() => fail(`${tag}: idle building never finished`));
    const lz = await p.evaluate(() => ({ lessons: window.__owl.LESSONS.length, crafts: window.__crafts.CRAFTS.length, cats: window.__crafts.info().cats }));
    if (lz.lessons < 300) fail(`${tag}: only ${lz.lessons} art lessons after building`);
    if (lz.crafts < 110) fail(`${tag}: only ${lz.crafts} crafts after building`);

    // Every area opens from its tile, and Home comes back.
    const opened = [];
    for (const id of Object.values(GROUPS).flat()) {
      await p.click('#' + id);
      await sleep(350);
      const r = await p.evaluate(() => ({ home: !!document.getElementById('tMath'), h1: (document.querySelector('#view h1, #view h2') || {}).textContent || '', n: document.querySelectorAll('#view button').length }));
      if (r.home || r.n < 2) fail(`${tag}: ${id} did not open its area ${JSON.stringify(r)}`);
      opened.push(`${id}→${r.h1.trim().slice(0, 24)}`);
      await noScroll(id);
      // Close any pop-up the area put up, then go Home.
      await p.evaluate(() => document.querySelectorAll('.wt, .modal, .sheet').forEach(x => x.remove()));
      await p.click('#homeBtn'); await sleep(200);
      if (!await p.$('#tMath')) fail(`${tag}: Home did not come back from ${id}`);
    }
    console.log(tag, 'opened', opened.join(' | '));
    await ctx.close();
  }

  // 3. Still works offline after the first visit (service worker cache).
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage(); watch(p, 'offline');
    await p.goto(URL);
    await p.waitForSelector('#tMath');
    const ok = await p.evaluate(async () => { const r = await navigator.serviceWorker.ready; for (let i = 0; i < 50 && !navigator.serviceWorker.controller; i++) await new Promise(x => setTimeout(x, 100)); return !!r.active; });
    if (!ok) fail('offline: no service worker');
    await ctx.setOffline(true);
    await p.reload(); await p.waitForSelector('#tArt', { timeout: 15000 }).catch(() => fail('offline: home did not load'));
    await p.click('#tArt').catch(() => {}); await sleep(500);
    if (!await p.evaluate(() => /Art/i.test(document.getElementById('view').textContent))) fail('offline: Art School did not open');
    await ctx.close();
  }

  await b.close();
  console.log('errors', errs.length ? errs.join('\n') : 'none');
  console.log('fails', fails.length ? fails.join('\n') : 'none');
})();
function fail(m) { fails.push(m); }
