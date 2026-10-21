// Polish pass on the newest areas, on a phone (390x844) and a tablet (820x1180): Free draw's idea box (every idea,
// including "Draw an underwater city.", fits without clipping), the brush and stamp rows and paper button, the art
// lessons from art10/art11 (Furniture & Rooms, Houses & Homes, Landscapes, Real Animals, People & Bodies, Portraits),
// My World (home, every shop tab, the buy sheets, the sticker book), and English & Reading (home, every section,
// Word play games, a wrong and a right answer, a finished round, a made-up story, the spelling bee). Every screen:
// no sideways scroll, no text wider than its box or cut off, no element off the side of the screen (outside sideways
// scrollers like the brush row), buttons at least 44px and labeled. Also: price pills keep the star visible (not on
// solid yellow), story maker titles read as nouns ("... and the boring day"), and Back goes where it should.
// Prints "errors none" and "fails none" when clean. Tests take PORT (default 8766); screenshots go to SHOTS.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errs = [], fails = [];

(async () => {
  const b = await chromium.launch();
  for (const [w, h, tag] of [[390, 844, 'phone'], [820, 1180, 'tablet']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 500 });
    await ctx.addInitScript(() => { try { speechSynthesis.speak = () => {}; } catch (e) {} });
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(`${tag}: ${e.message}`));
    p.on('console', m => { if (m.type() === 'error' && !/favicon|manifest|sw\.js|service|fonts|Failed to load resource/i.test(m.text())) errs.push(`${tag} console: ${m.text()}`); });
    const fail = m => fails.push(`${tag}: ${m}`);
    await p.goto(`http://localhost:${PORT}/index.html?r=${Date.now()}#selftest`);
    await p.evaluate(() => localStorage.clear()); await p.reload();
    await p.waitForFunction(() => window.__owl && window.__english && window.__english.W && window.__world);
    await p.evaluate(() => { const s = window.__owl.st; s.age = 8; s.stars = 500; s.unlockAll = true; window.__english.E().xp = 300; window.__world.hour = 12; });

    const check = async name => {
      await sleep(300);
      const r = await p.evaluate(() => {
        const out = [], iw = innerWidth;
        const ov = document.documentElement.scrollWidth - iw; if (ov > 1) out.push(`sideways scroll ${ov}px`);
        const inScroller = el => { for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) if (/auto|scroll/.test(getComputedStyle(a).overflowX)) return true; return false; };
        for (const el of document.querySelectorAll('#app *')) {
          if (!el.getClientRects().length) continue;
          const cs = getComputedStyle(el); if (cs.visibility === 'hidden') continue;
          if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
          const lbl = `${el.id || el.className || el.tagName} "${el.textContent.trim().slice(0, 30)}"`;
          if (el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1 && !/auto|scroll/.test(cs.overflowX)) out.push(`text wider than its box ${el.scrollWidth}>${el.clientWidth}: ${lbl}`);
          if (el.clientHeight > 0 && el.scrollHeight > el.clientHeight + 2 && /hidden|clip/.test(cs.overflowY)) out.push(`text cut off ${el.scrollHeight}>${el.clientHeight}: ${lbl}`);
          const rr = el.getBoundingClientRect();
          if ((rr.right > iw + 1 || rr.left < -1) && !inScroller(el)) out.push(`off screen ${Math.round(rr.left)}..${Math.round(rr.right)}: ${lbl}`);
        }
        const small = [...document.querySelectorAll('#app button')].filter(b => b.offsetParent && !b.disabled).map(b => { const r = b.getBoundingClientRect(); return [b.id || b.className, Math.round(r.width), Math.round(r.height), (b.textContent.trim() || b.getAttribute('aria-label') || '').slice(0, 14)]; }).filter(x => x[1] < 44 || x[2] < 44 || !x[3]);
        if (small.length) out.push('small or unlabeled buttons ' + JSON.stringify(small.slice(0, 5)));
        return out;
      });
      for (const x of r) fail(`${name}: ${x}`);
      await p.screenshot({ path: `${SHOTS}/polish-${tag}-${name}.png`, fullPage: true });
    };
    const en = (v, ...a) => p.evaluate(([v, a]) => window.__english.go(v, ...a), [v, a]);
    const tap = re => p.evaluate(s => { const b = [...document.querySelectorAll('#view button')].find(x => new RegExp(s).test(x.textContent)); if (!b) throw new Error('no button ' + s); b.click(); }, re);
    const h1 = () => p.evaluate(() => (document.querySelector('#view h1') || {}).textContent || '');
    const back = async (want, where) => { await p.click('#backBtn'); await sleep(250); const t = await h1(); if (!t.includes(want)) fail(`Back from ${where} went to "${t}", not "${want}"`); };
    const steps = [];
    const S = (name, fn) => steps.push([name, fn]);

    // Free draw: every idea fits its box (the underwater city clipped on phones).
    S('freedraw', async () => {
      await p.evaluate(() => window.__owl.artHome()); await tap('Free draw'); await p.waitForSelector('#idea');
      const seen = new Set();
      for (let k = 0; k < 40 && seen.size < 10; k++) {
        const r = await p.evaluate(() => { const e = document.querySelector('#idea'), box = document.querySelector('.idea').getBoundingClientRect(), r = e.getBoundingClientRect(); return { t: e.textContent, sw: e.scrollWidth, cw: e.clientWidth, out: r.right > box.right + 1 }; });
        seen.add(r.t);
        if (r.sw > r.cw + 1 || r.out) fail(`idea "${r.t}" clipped (${r.sw}>${r.cw})`);
        await p.click('#inew'); await sleep(30);
      }
      if (seen.size < 10) fail(`only saw ${seen.size} ideas`);
      await p.evaluate(() => { document.querySelector('#idea').textContent = 'Draw an underwater city.'; });
    });
    S('freedraw-stamps', async () => {
      const id = await p.evaluate(() => (window.__owl.BRUSHES.LIST.find(b => /stamp/i.test(b.id + b.name)) || {}).id);
      if (!id) fail('no stamp brush'); else { await p.click(`[data-b="${id}"]`); if (await p.$eval('.stamp-row', e => e.hidden)) fail('stamp row did not show'); }
      for (let k = 0; k < 3; k++) await p.click('#ppr');
    });
    S('mandala', async () => { await back('Art School', 'free draw'); await tap('Mandala mode'); });
    for (const c of ['rooms', 'homes', 'landscapes', 'realanimals', 'figures', 'portraits']) {
      S('cat-' + c, async () => { await p.evaluate(c => window.__owl.go(window.__owl.catView, c), c); });
      S('lesson-' + c, async () => {
        const [id, cat] = await p.evaluate(c => { const L = window.__owl.LESSONS.filter(l => l.cat === c); return [L[L.length - 1].id, window.__owl.ART_CATS.find(x => x.id === c).name]; }, c);
        await p.evaluate(id => window.__owl.go(window.__owl.drawLesson, id), id);
        await check('lesson-' + c);
        await back(cat, 'lesson ' + id);
      });
    }

    // My World.
    S('world', async () => { await p.evaluate(() => window.__world.open()); await sleep(400); });
    for (const c of ['plant', 'home', 'animal', 'deco', 'sky', 'land']) S('shop-' + c, async () => { await p.evaluate(c => window.__world.shop(c), c); });
    S('shop-sheet', async () => {
      await p.evaluate(() => window.__world.shop('animal')); await p.click('[data-buy]'); await p.waitForSelector('.mw-sheet');
      const bg = await p.evaluate(() => [...document.querySelectorAll('.mw-price, .mw-sale i')].map(e => getComputedStyle(e).backgroundColor).filter(c => c === 'rgb(255, 194, 61)').length);
      if (bg) fail(`${bg} price pills put the star on solid yellow`);
    });
    S('shop-land-sheet', async () => { await p.evaluate(() => window.__world.shop('land')); await p.click('[data-land]:not([aria-disabled])'); await p.waitForSelector('.mw-sheet'); });
    S('worldbook', async () => { await p.click('#mwNo'); if (await p.$('.mw-sheet')) fail('Not now left the sheet open'); await back('My World', 'shop'); await p.evaluate(() => window.__world.book()); });

    // English & Reading.
    for (const v of ['home', 'phonics', 'blend', 'sight', 'read', 'build', 'grammar', 'vocab', 'say', 'fun', 'hunt', 'bubbles', 'monster', 'readword', 'readsent',
      'wordplay', 'mywords', 'wotd', 'maker', 'rhyme', 'describe', 'safari', 'twisters', 'listen']) S('en-' + v, async () => { await en(v); });
    S('en-story', async () => { const id = await p.evaluate(() => window.__english.data.EN_STORIES.slice(-1)[0].id); await en('story', id, 0); });
    S('en-twister', async () => { await en('twister', 0); });
    S('en-wrong', async () => {
      await back('Tongue twisters', 'a tongue twister');
      await en('describe'); await p.waitForSelector('.en-q .choice');
      const i = await p.evaluate(() => { const q = window.__english.q; return q.choices.findIndex(c => String(c.val) !== String(q.answer)); });
      await p.click(`.en-q .choice[data-i="${i}"]`);
    });
    S('en-right', async () => { const i = await p.evaluate(() => { const q = window.__english.q; return q.choices.findIndex(c => String(c.val) === String(q.answer)); }); await p.click(`.en-q .choice[data-i="${i}"]`); });
    S('en-reward', async () => {
      await en('readsent');
      for (let k = 0; k < 40 && await p.$('.en-q'); k++) {
        await sleep(150);
        await p.evaluate(() => { const c = document.querySelector('.en-q .choice:not([disabled])'); if (!c) return; const q = window.__english.q; const i = q.choices.findIndex(c => String(c.val) === String(q.answer)); document.querySelector(`.en-q .choice[data-i="${i}"]`).click(); });
        await sleep(900);
      }
      if (await p.$('.en-q')) fail('quiz round did not finish');
      await sleep(500);
    });
    S('en-tale', async () => {
      await en('maker');
      await p.click('[data-mk^="hero:"]'); await p.click('[data-mk^="place:"]');
      const n = await p.evaluate(() => [...document.querySelectorAll('[data-mk^="prob:"]')].findIndex(b => /bored/i.test(b.getAttribute('aria-label'))));
      await p.click(n >= 0 ? `[data-mk^="prob:"] >> nth=${n}` : '[data-mk^="prob:"]');
      await tap('Make my story'); await p.waitForSelector('.en-ttl');
      const t = await p.textContent('.en-ttl');
      if (/ the (bored|hungry|stuck|dark|rain|sneeze|monster|balloon)$/.test(t)) fail(`story title "${t}" ends with a bare adjective`);
    });
    S('en-spell', async () => { await back('Story maker', 'a story'); await en('spell'); await p.evaluate(() => [...document.querySelectorAll('#view button')].filter(b => /^[a-z]$/.test(b.textContent.trim()))[0].click()); });
    S('en-mywords-back', async () => { await back('Word play', 'spelling bee'); await en('wotd'); await back('My words', 'word of the day'); });

    for (const [name, fn] of steps) {
      try { await fn(); await check(name); } catch (e) { fail(`${name}: ${e.message.split('\n')[0]}`); }
    }
    await ctx.close();
  }
  await b.close();
  console.log('errors', errs.length ? '\n' + errs.join('\n') : 'none');
  console.log('fails', fails.length ? '\n' + fails.join('\n') : 'none');
})();
