// Math round 5 (src/math5.js topics, games4.js games, math5.css): hands-on real-life math on a phone (390x844, speech)
// and a tablet (820x1180, no speech). Checks: the 11 new topics are in their worlds; every lesson opens with pictures;
// at each of the 5 levels a question shows a picture and is answered right (2 stars) and, on the first level of each
// topic, wrong first (1 star, a worked explanation, the topic's mastery goes down and the question joins Owl's review);
// hands-on questions are solved with their widgets: clock hands dragged with the mouse/finger (and the buttons), money
// tapped onto the counter (and taken back), bar charts built by tapping squares, pictures tapped in order, blocks
// added; a missed hands-on question comes back in "Practise again" still hands-on; Owl's hint on a hands-on question;
// Owl's worked example on a hands-on topic; a full round to the finish screen; the currency picked in the Grown-ups
// corner changes the money; Toy Shop and Clock Race played to the end with exact stars (3 for a perfect round, 2 with
// one miss) through the normal star path; What's inside counts the new topics and games; no sideways scroll and 44px
// buttons. Prints "errors none" and "fails none" when clean. Takes PORT (default 8766). Screenshots go to SHOTS.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const errs = [], fails = [];
const NEW = { coins5: 0, myday: 0, purse: 1, toyshop: 1, setclock: 1, blocks: 1, thermo: 1, pictogram: 1, buildbar: 1, change5: 2, sorting: 2 };

(async () => {
  const b = await chromium.launch();
  for (const [w, h, tag, noSpeech, age] of [[390, 844, 'phone', false, 5], [820, 1180, 'tablet', true, 9]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 500 });
    await ctx.addInitScript(ns => {
      window.__said = [];
      if (ns) { try { delete Window.prototype.speechSynthesis; } catch (e) {} try { delete window.speechSynthesis; } catch (e) {} try { delete window.SpeechSynthesisUtterance; } catch (e) {} }
      else { try { speechSynthesis.speak = u => window.__said.push(u.text); } catch (e) {} }
    }, noSpeech);
    const p = await ctx.newPage();
    p.on('pageerror', e => errs.push(`${tag}: ${e.message}`));
    p.on('console', m => { if (m.type() === 'error' && !/favicon|manifest|sw\.js|service|fonts|Failed to load resource/i.test(m.text())) errs.push(`${tag} console: ${m.text()}`); });
    const fail = m => fails.push(`${tag}: ${m}`);
    const shot = async name => { await sleep(200); await p.screenshot({ path: `${SHOTS}/math5-${tag}-${name}.png`, fullPage: true }); };
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (o > 1) fail(`sideways scroll ${o}px at ${where}`); };
    const bigEnough = async where => {
      const small = await p.evaluate(() => [...document.querySelectorAll('#view button')].filter(b => b.offsetParent && !b.disabled && !b.closest('.m5bars .m5col')).map(b => { const r = b.getBoundingClientRect(); return [b.id || b.className, Math.round(r.width), Math.round(r.height), (b.textContent.trim() || b.getAttribute('aria-label') || '').slice(0, 14)]; }).filter(x => x[1] < 44 || x[2] < 44 || !x[3]));
      if (small.length) fail(`${where}: small or unlabeled buttons ${JSON.stringify(small.slice(0, 4))}`);
      const cells = await p.evaluate(() => [...document.querySelectorAll('.m5cell')].filter(c => { const r = c.getBoundingClientRect(); return r.width < 44 || !c.getAttribute('aria-label'); }).length);
      if (cells) fail(`${where}: ${cells} bar squares narrower than 44px or unlabeled`);
    };
    const check = async where => { await noScroll(where); await bigEnough(where); };
    const stars = () => p.evaluate(() => window.__owl.st.stars);
    const Q = () => p.evaluate(() => { const q = window.__owlQ; return q && { answer: String(q.answer), interact: q.interact || null, vals: q.choices.map(c => String(c.val)), visual: q.visual, prompt: q.prompt }; });
    const go = (fn, ...a) => p.evaluate(([fn, a]) => window.__owl.go(window.__owl[fn], ...a), [fn, a]);

    await p.goto(`http://localhost:${PORT}/index.html?r=${Date.now()}#selftest`);
    await p.evaluate(() => localStorage.clear()); await p.reload();
    await p.waitForFunction(() => window.__owl && window.__math5 && window.__games4);
    await p.evaluate(a => { const s = window.__owl.st; s.age = a; s.stars = 0; s.unlockAll = true; }, age);

    // 1. The topics are where they belong.
    const where = await p.evaluate(() => Object.fromEntries(window.__math5.ids.map(id => [id, window.__owl.MATH[id] ? window.__owl.MATH[id].world : -1])));
    for (const [id, wd] of Object.entries(NEW)) if (where[id] !== wd) fail(`${id} in world ${where[id]}, want ${wd}`);

    // --- widget drivers ---
    const clockAngle = async (hand, deg) => { // drag a hand's knob to an angle, with real pointer moves
      const box = await p.locator('.m5set').boundingBox(), cx = box.x + box.width / 2, cy = box.y + box.height / 2;
      const k = await p.locator(`.m5set [data-hand="${hand}"]`).boundingBox(), r = box.width / 200 * (hand === 'm' ? 70 : 46);
      await p.mouse.move(k.x + k.width / 2, k.y + k.height / 2); await p.mouse.down();
      const cur = Math.atan2(k.x + k.width / 2 - cx, -(k.y + k.height / 2 - cy)) * 180 / Math.PI;
      let d = ((deg - cur) % 360 + 540) % 360 - 180; // shortest way round
      for (let i = 1; i <= 8; i++) { const a = (cur + d * i / 8) * Math.PI / 180; await p.mouse.move(cx + r * Math.sin(a), cy - r * Math.cos(a)); }
      await p.mouse.up();
    };
    const setClock = async ans => { const [hh, mm] = ans.split(':').map(Number); await clockAngle('m', mm * 6); await clockAngle('h', ((hh % 12) + mm / 60) * 30); };
    const clockNow = () => p.evaluate(() => { const ls = [...document.querySelectorAll('.m5set .m5h line')]; const ang = l => (Math.atan2(+l.getAttribute('x2') - 100, -(+l.getAttribute('y2') - 100)) * 180 / Math.PI + 360) % 360; const m = Math.round(ang(ls[1]) / 6) % 60, h = Math.round((ang(ls[0]) - m * 0.5) / 30) % 12; return `${h || 12}:${String(m).padStart(2, '0')}`; });
    const tapPay = async (target, tray, scope = '') => { let left = +target; for (const v of [...tray].sort((a, b) => b - a)) while (left >= v) { await p.click(`${scope} .m5tray [data-c="${v}"]`); left -= v; } };
    const clearPay = async (scope = '') => { while (await p.locator(`${scope} .m5back`).count()) await p.locator(`${scope} .m5back`).first().click(); };
    const buildBars = async (ans, it) => { const want = ans.split(',').map(Number);
      for (let j = 0; j < want.length; j++) { const have = await p.locator(`.m5col[data-j="${j}"] .m5cell.on`).count(); if (have * it.step !== want[j]) await p.click(`.m5cell[data-j="${j}"][data-k="${want[j] / it.step}"]`); } };
    const tapOrder = async ans => { for (const lab of ans.split(' > ')) await p.click(`.m5card[aria-label="${lab}"]`); };
    const addBlocks = async n => { const have = +(await p.evaluate(() => (document.querySelector('.m5blocks .m5tot').textContent.match(/\d+/) || [0])[0])); for (let i = have; i < n; i++) await p.click('[data-a="b+"]'); for (let i = have; i > n; i--) await p.click('[data-a="b-"]'); };
    const solve = async q => {
      const it = q.interact;
      if (!it) { const i = q.vals.indexOf(q.answer); await p.click(`.choice[data-i="${i}"]`); return; }
      if (it.kind === 'clock') { await setClock(q.answer); const now = await clockNow(); if (now !== q.answer) fail(`clock drag gave ${now}, want ${q.answer}`); }
      if (it.kind === 'pay') { await clearPay(); await tapPay(q.answer, it.tray); }
      if (it.kind === 'bars') await buildBars(q.answer, it);
      if (it.kind === 'order') await tapOrder(q.answer);
      if (it.kind === 'blocks') await addBlocks(+q.answer);
      await p.click('#mxok');
    };
    const miss = async q => {
      const it = q.interact;
      if (!it) { const i = q.vals.findIndex(v => v !== q.answer); await p.click(`.choice[data-i="${i}"]`); return; }
      if (it.kind === 'clock') { await p.click('.m5b[data-a="h+"]'); if (await clockNow() === q.answer) await p.click('.m5b[data-a="h+"]'); }
      if (it.kind === 'pay') await p.click(`.m5tray [data-c="${Math.min(...it.tray)}"]`);
      if (it.kind === 'bars') { const v = +q.answer.split(',')[0]; await p.click(`.m5cell[data-j="0"][data-k="${v / it.step === 1 ? 2 : 1}"]`); }
      if (it.kind === 'order') for (const [, lab] of it.items) await p.click(`.m5card[aria-label="${lab}"]`);
      if (it.kind === 'blocks') await p.click('[data-a="b+"]');
      await p.click('#mxok');
    };
    // The play screen keeps the question on window.__owlQ in #selftest; the test clears it to wait for the next one.
    const waitQ = async () => { await p.waitForFunction(() => window.__owlQ && document.querySelector('.qcard'), null, { timeout: 6000 }).catch(() => fail('no question')); };

    // 2. Every topic: lesson, then one question per level (the first one missed once).
    const kinds = new Set(); let handsSeen = 0;
    for (const id of Object.keys(NEW)) {
      await go('lessonView', id, true); await sleep(80);
      const lv = await p.evaluate(() => ({ steps: document.querySelectorAll('.lstep').length, pics: document.querySelectorAll('.lstep svg').length }));
      if (lv.steps < 3 || lv.pics < 2) fail(`${id} lesson: ${lv.steps} steps, ${lv.pics} pictures`);
      await check(`${id} lesson`); if (id === 'setclock' || id === 'buildbar') await shot(`${id}-lesson`);
      for (let L = 1; L <= 5; L++) {
        let q, tries = 0;
        do { await p.evaluate(([id, L]) => { window.__owlQ = null; const s = window.__owl.st.skills[id]; s.m = (L - 1) / 5 + 0.02; }, [id, L]); await go('play', id); await waitQ(); q = await Q(); tries++; }
        while (q && !q.interact && L >= 3 && ['toyshop', 'setclock', 'buildbar'].includes(id) && tries < 3); // the hands-on ones at most levels
        if (!q) { fail(`${id} L${L}: no question`); continue; }
        if (!/<svg/.test(q.visual + (await p.evaluate(() => document.querySelector('.qcard').innerHTML)))) fail(`${id} L${L}: no picture`);
        if (q.interact) { handsSeen++; kinds.add(q.interact.kind); if (!(await p.locator('#mx .m5clock, #mx .m5pay, #mx .m5bars, #mx .m5order, #mx .m5blocks').count())) fail(`${id} L${L}: hands-on widget missing`); }
        await check(`${id} L${L}`);
        if (L === 1 || (L === 3 && q.interact)) await shot(`${id}-L${L}`);
        const s0 = await stars(), m0 = await p.evaluate(id => window.__owl.st.skills[id].m, id), missFirst = L === 1;
        if (missFirst) {
          await miss(q); await sleep(120);
          const ex = await p.evaluate(() => !!document.querySelector('#exp .explain'));
          if (!ex) fail(`${id} L${L}: no explanation after a wrong answer`);
          const r = await p.evaluate(([id, a]) => { const s = window.__owl.st; return { m: s.skills[id].m, rev: s.review.find(x => x.skill === id && String(x.q.answer) === a) }; }, [id, q.answer]);
          if (!(r.m < m0)) fail(`${id}: mastery did not go down after a miss`);
          if (!r.rev) fail(`${id}: missed question not in review`); else if (q.interact && !r.rev.q.interact) fail(`${id}: review lost the hands-on part`);
          if (L === 1 && id === 'setclock') await shot('setclock-wrong');
        }
        await solve(q);
        await p.waitForFunction(() => /⭐/.test(document.querySelector('#cheer').textContent), null, { timeout: 3000 }).catch(() => fail(`${id} L${L}: not accepted (${q.answer})`));
        const got = (await stars()) - s0; if (got !== (missFirst ? 1 : 2)) fail(`${id} L${L}: ${got} stars, want ${missFirst ? 1 : 2}`);
        if (!missFirst) { const m1 = await p.evaluate(id => window.__owl.st.skills[id].m, id); if (!(m1 > m0)) fail(`${id} L${L}: mastery did not go up`); }
        if (q.interact && await p.locator('#mx.m5locked').count() === 0) fail(`${id} L${L}: widget still open after a right answer`);
      }
    }
    for (const k of ['clock', 'pay', 'bars', 'order', 'blocks']) if (!kinds.has(k)) fail(`hands-on kind ${k} never seen`);

    // 2b. Layout sweep: 6 questions per topic and level, drawn without answering: nothing pokes out of its button or
    // off the screen, and no sideways scroll.
    for (const id of Object.keys(NEW)) for (let L = 1; L <= 5; L++) for (let k = 0; k < 6; k++) {
      await p.evaluate(([id, L]) => { window.__owlQ = null; window.__owl.st.skills[id].m = (L - 1) / 5 + 0.02; }, [id, L]); await go('play', id); await waitQ();
      const bad = await p.evaluate(() => {
        const out = [], vw = innerWidth;
        for (const b of document.querySelectorAll('.qcard .choice')) { const r = b.getBoundingClientRect(); for (const c of b.querySelectorAll('svg')) { const s = c.getBoundingClientRect(); if (s.left < r.left - 2 || s.right > r.right + 2 || s.top < r.top - 2 || s.bottom > r.bottom + 2) out.push('choice picture pokes out'); } }
        for (const e of document.querySelectorAll('.qcard svg, .qcard button')) { const s = e.getBoundingClientRect(); if (s.width && (s.left < -1 || s.right > vw + 1)) out.push(`${e.tagName} off screen`); }
        if (document.documentElement.scrollWidth - vw > 1) out.push('sideways scroll');
        return [...new Set(out)];
      });
      if (bad.length) { fail(`${id} L${L}: ${bad.join(', ')} (${(await Q()).prompt.slice(0, 50)})`); await shot(`bad-${id}-L${L}`); break; }
    }

    // 3. Hint on a hands-on question; worked example on a hands-on topic.
    await p.evaluate(() => { window.__owlQ = null; window.__owl.st.skills.setclock.m = 0.62; }); await go('play', 'setclock'); await waitQ();
    let q = await Q();
    if (q.interact) {
      await p.click('#hint'); await sleep(80);
      const after = await clockNow(), [, mm] = q.answer.split(':');
      if (after.split(':')[1] !== mm) fail(`hint did not set the long hand (${after} vs ${q.answer})`);
      const s0 = await stars(); await solve(q); await sleep(150); if ((await stars()) - s0 !== 1) fail('a hinted hands-on answer should give 1 star');
    }
    await p.evaluate(() => { window.__owl.st.skills.toyshop.seenLesson = true; }); await go('lessonView', 'toyshop', false); await p.click('#demo'); await sleep(3900);
    const demo = await p.evaluate(() => ({ note: /hands-on/.test(document.querySelector('#demoBox').textContent), explain: !!document.querySelector('#demoBox .explain svg'), tryNow: !!document.querySelector('#tryNow') }));
    if (!demo.note || !demo.explain || !demo.tryNow) fail(`worked example on a hands-on topic: ${JSON.stringify(demo)}`);
    await check('worked example');

    // 4. Practise again: a missed hands-on question comes back hands-on.
    await p.evaluate(() => { const s = window.__owl.st; s.review.forEach(r => { r.due = 0; }); s.review.sort((a, b) => (b.q.interact ? 1 : 0) - (a.q.interact ? 1 : 0)); window.__owlQ = null; });
    await go('play', 'review'); await waitQ(); q = await Q();
    if (!q.interact) fail('review question lost its hands-on widget');
    else { const s0 = await stars(); await solve(q); await sleep(150); if ((await stars()) - s0 !== 2) fail('review hands-on answer should give 2'); const box = await p.evaluate(a => (window.__owl.st.review.find(r => String(r.q.answer) === a) || {}).box, q.answer); if (box !== 1) fail(`review box ${box}, want 1`); }

    // 5. A whole round to the finish screen (buildbar, every answer right).
    await p.evaluate(() => { window.__owl.st.skills.buildbar.m = 0.5; window.__owlQ = null; });
    const r0 = await stars(); await go('play', 'buildbar');
    for (let n = 0; n < 6; n++) { await waitQ(); q = await Q(); await p.evaluate(() => { window.__owlQ = null; }); await solve(q); }
    await p.waitForSelector('.view.done', { timeout: 6000 }).catch(() => fail('round did not finish'));
    if ((await stars()) - r0 !== 12) fail(`full round gave ${(await stars()) - r0}, want 12`);
    await check('round finished'); await shot('round-done');

    // 6. Currency from the Grown-ups corner.
    for (const [c, re] of [['gbp', /£|\dp\b/], ['eur', /€|\dc\b/], ['usd', /\$|¢/]]) {
      await p.evaluate(c => window.__owl.store.set('currency', c), c);
      const txt = await p.evaluate(() => { const g = window.__owl.MATH.toyshop.gen; let s = ''; for (let L = 1; L <= 5; L++) s += g(L).prompt + ' '; return s; });
      if (!re.test(txt)) fail(`currency ${c}: ${txt.slice(0, 80)}`);
    }
    await p.evaluate(() => window.__owl.go(() => window.__owl.go(window.__owl.home))); await sleep(50);

    // 7. The games: a perfect round (3 stars) and a round with one miss (2 stars).
    const playGame = async (gid, wantMiss) => { // with wantMiss, one wrong try on the first round it can be made
      await go('gamesHome'); await p.click(`[data-g="${gid}"]`); const s0 = await stars(); let missed = false;
      for (let i = 0; i < 8; i++) {
        await p.waitForFunction(i => { const g = window.__games.gm; return g && g.i === i && g.cur && !g.lock && document.querySelector('.game'); }, i, { timeout: 6000 }).catch(() => fail(`${gid}: round ${i} did not start`));
        const cur = await p.evaluate(() => window.__games.gm.cur);
        await noScroll(`${gid} ${cur.kind}`); if (i < 3) await shot(`${gid}-${i}-${cur.kind}`);
        const tray0 = await p.$$eval('.m5tray [data-c]', bs => bs.map(b => +b.dataset.c));
        const canMiss = !['pay', 'change'].includes(cur.kind) || (await p.evaluate(([a, t]) => { const g = window.__math5.split(a, t); return t.some(v => v > g[g.length - 1]); }, [+cur.ans, tray0]));
        if (wantMiss && !missed && canMiss) { // one wrong try
          missed = true;
          if (cur.kind === 'pay' || cur.kind === 'change') { // pay all but the smallest piece, then a bigger one: too much
            const tray = await p.$$eval('.m5tray [data-c]', bs => bs.map(b => +b.dataset.c)), gl = await p.evaluate(([a, t]) => window.__math5.split(a, t), [+cur.ans, tray]), sm = gl.pop();
            for (const v of gl) await p.click(`.m5tray [data-c="${v}"]`);
            await p.click(`.m5tray [data-c="${[...tray].sort((a, b) => a - b).find(v => v > sm)}"]`); await sleep(60);
            while (await p.locator('.m5back').count() && !(await p.evaluate(() => window.__games.gm.lock))) await p.locator('.m5back').first().click();
          }
          else if (cur.kind === 'set') { await p.click('#g4ok'); if (await p.evaluate(() => window.__games.gm.tries) === 0) { await p.click('.m5b[data-a="h+"]'); await p.click('#g4ok'); } }
          else await p.locator('.gch .gopt:not([data-ok])').first().click();
          await sleep(80);
          if (await p.evaluate(() => window.__games.gm.tries) < 1) fail(`${gid}: the miss was not counted (${cur.kind})`);
        }
        if ((cur.kind === 'pay' || cur.kind === 'change') && !(await p.evaluate(() => window.__games.gm.lock))) { const tray = await p.$$eval('.m5tray [data-c]', bs => bs.map(b => +b.dataset.c)); await tapPay(cur.ans, tray); }
        else if (cur.kind === 'set') { await setClock(cur.ans); if (await clockNow() !== cur.ans) fail(`${gid}: clock drag gave ${await clockNow()}, want ${cur.ans}`); await p.click('#g4ok'); }
        else await p.click('.gch .gopt[data-ok]');
      }
      await p.waitForSelector('.gdone', { timeout: 6000 }).catch(() => fail(`${gid}: no end screen`));
      if (wantMiss && !missed) fail(`${gid}: no round to miss`);
      const got = (await stars()) - s0, want = wantMiss ? 2 : 3;
      if (got !== want) fail(`${gid}: ${got} stars, want ${want}`);
      const shown = await p.$$eval('.gstars .on', x => x.length); if (shown !== want) fail(`${gid}: shows ${shown} stars`);
      await check(`${gid} end`);
    };
    for (const gid of ['toys', 'clockrace']) { await playGame(gid, false); await playGame(gid, true); }
    const best = await p.evaluate(() => [window.__owl.st.games.toys, window.__owl.st.games.clockrace].map(r => r && r.stars));
    if (best.join() !== '3,3') fail(`best game stars ${best}`);
    await go('gamesHome'); await check('games home'); await shot('games-home');

    // 8. What's inside counts them; the Grown-ups corner has the money setting.
    const inside = await p.evaluate(() => { window.__owl.go(window.__owl.home); return { topics: Object.keys(window.__owl.MATH).length }; });
    if (inside.topics < 121) fail(`only ${inside.topics} math topics`);
    if (tag === 'phone') { const said = await p.evaluate(() => window.__said.join(' | ')); if (!/Set the clock to/.test(said) || !/Tap the money to pay/.test(said)) fail('hands-on prompts were not read aloud'); }
    console.log(tag, 'hands-on questions', handsSeen, 'kinds', [...kinds].join(','));
    await ctx.close();
  }
  await b.close();
  console.log(errs.length ? 'errors ' + JSON.stringify(errs.slice(0, 10), null, 1) : 'errors none');
  console.log(fails.length ? 'fails ' + JSON.stringify(fails.slice(0, 40), null, 1) : 'fails none');
})();
