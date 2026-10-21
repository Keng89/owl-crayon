// Owl's Quest: play all of chapter 1 at age 5 and age 9 on a phone and a tablet, and chapters 2 to 5 on the phone.
// Answers math (one wrong first), draws on the art pad, makes story choices, then checks stars, the prize,
// the storybook, no sideways scroll, and that progress survives a reload. Every math stop must have a story riddle
// with exactly one right answer, and a wrong riddle answer must teach. On the tablet, shrinking the window to a phone
// redraws the map in the phone layout. The quest ending comes after chapter 5, and an old save that finished
// chapters 1-3 (from before chapters 4 and 5 existed) opens chapter 4. Screenshots go to SHOTS (default: current folder).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const URL = `http://localhost:${PORT}/index.html#selftest`;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run(b, age, vp, errs) {
  const tag = `age${age}-${vp.width}`;
  const ctx = await b.newContext({ viewport: vp, hasTouch: false });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(`${tag}: ${e.message}`));
  p.on('console', m => { if (m.type() === 'error' && !/favicon|manifest|sw\.js|service/i.test(m.text())) errs.push(`${tag} console: ${m.text()}`); });
  await p.goto(URL);
  await p.waitForFunction(() => window.__owl && window.__quest);
  await p.evaluate(a => { const s = window.__owl.st; s.age = a; s.speak = false; s.name = 'Mia'; }, age);
  const noScroll = async where => { const w = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]); if (w[0] > w[1] + 1) errs.push(`${tag}: sideways scroll on ${where} (${w[0]} > ${w[1]})`); };
  const shot = async name => { await sleep(350); await p.screenshot({ path: `${SHOTS}/${tag}-${name}.png`, fullPage: true }); };
  const kinds = {};

  // Plays every stop of chapter c from its map to the chapter prize.
  async function playChapter(c) {
    const ch = await p.evaluate(c => window.__quest.CH[c].stops.map(s => [s.kind, !!s.final]), c);
    const out = { wrongShown: false, drew: false, echoOk: false, riddleHelp: false };
    for (let i = 0; i < ch.length; i++) {
      await p.click('#sqGo');
      await p.waitForSelector('.sq-story');
      const story = await p.textContent('.sq-story');
      if (c === 0 && i === 3) out.echoOk = /feet were still wet/.test(story); // stop 2 picked the river path
      if (c === 0 && i === 0) { await noScroll('story'); await shot('story'); }
      await p.click('#sqGo');
      if (ch[i][0] === 'math') {
        let riddles = 0;
        for (let k = 0; k < 3; k++) {
          await p.waitForSelector(`.sq-dots i:nth-child(${k + 1}).now`);
          await p.waitForSelector('.choice[data-ok]');
          const q = await p.evaluate(() => { const el = document.querySelector('.sq-q'); return { story: el.dataset.story || null, ok: el.querySelectorAll('.choice[data-ok]').length, n: el.querySelectorAll('.choice').length, tag: (el.querySelector('.sq-rtag') || {}).textContent || '' }; });
          if (q.ok !== 1) errs.push(`${tag}: ch${c + 1} stop ${i + 1} puzzle ${k + 1} has ${q.ok} right answers`);
          if (q.story) {
            riddles++; kinds[`${c}:${q.story}`] = (kinds[`${c}:${q.story}`] || 0) + 1;
            if (!q.tag) errs.push(`${tag}: riddle without a story tag`);
            if (q.n < 2) errs.push(`${tag}: riddle with ${q.n} choices`);
            await noScroll(`ch${c + 1} riddle`);
            if (!out.riddleHelp) { // a wrong riddle answer shows a short lesson
              await shot(`riddle${c + 1}`);
              await p.click('.choice:not([data-ok])');
              await p.waitForSelector('#exp .explain');
              const help = await p.evaluate(() => { const e = document.querySelector('#exp .explain'); return { text: e.innerText.trim().length, pic: !!e.querySelector('.visual'), steps: e.querySelectorAll('.steps li').length }; });
              if (help.text < 20 || !(help.pic || help.steps)) errs.push(`${tag}: ch${c + 1} riddle help is too thin ${JSON.stringify(help)}`);
              out.riddleHelp = true; await noScroll('riddle help'); await shot(`riddle${c + 1}-help`);
            }
          } else if (c === 0 && i === 0 && k === 0) {
            await p.click('.choice:not([data-ok])');
            await p.waitForSelector('#exp .explain');
            out.wrongShown = true; await noScroll('math help'); await shot('math-help');
          }
          if (c === 0 && i === 6 && k === 0) await shot('math');
          await p.click('.choice[data-ok]');
          await p.waitForSelector('.choice.right');
        }
        if (riddles < (ch[i][1] ? 2 : 1)) errs.push(`${tag}: ch${c + 1} stop ${i + 1} had ${riddles} story riddles`);
      } else if (ch[i][0] === 'art') {
        await p.waitForSelector('#cv');
        if (c >= 3) { // the new chapters' idea pictures, plain and as trace lines on the pad
          const idea = await p.evaluate(() => document.querySelectorAll('.sq-idea svg .old *').length);
          if (idea < 3) errs.push(`${tag}: ch${c + 1} stop ${i + 1} idea picture is empty`);
          await noScroll(`ch${c + 1} art`); await shot(`art${c + 1}-${i + 1}`);
          await p.click('#sqTrace'); await sleep(100);
          if (!await p.$('#tr svg *')) errs.push(`${tag}: ch${c + 1} trace lines missing`);
          if (i === 2) await shot(`art${c + 1}-trace`);
          await p.click('#sqTrace');
        }
        await p.click('#sqDone'); // nothing drawn yet: should stay
        if (await p.$('.sq-win')) errs.push(`${tag}: art accepted an empty pad`);
        const box = await (await p.$('#cv')).boundingBox();
        await p.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.3); await p.mouse.down();
        for (let t = 0; t <= 12; t++) await p.mouse.move(box.x + box.width * (0.3 + t * 0.03), box.y + box.height * (0.3 + Math.sin(t / 2) * 0.15));
        await p.mouse.up(); out.drew = true;
        if (c === 0 && i === 2) { await noScroll('art'); await shot('art'); }
        await p.click('#sqDone');
      } else {
        await p.waitForSelector('.sq-opt');
        if (c === 0 && i === 1) { await noScroll('choice'); await shot('choice'); }
        await p.click(`.sq-opt[data-o="${i === 1 ? 1 : 0}"]`);
      }
      await p.waitForSelector('.sq-win #sqOn', { timeout: 8000 });
      if (c === 0 && i === 0) { await noScroll('win'); await shot('win'); }
      await p.click('#sqOn');
      if (i < ch.length - 1) await p.waitForSelector('.sq-map');
    }
    await p.waitForSelector('.sq-final');
    if (!out.drew) errs.push(`${tag}: ch${c + 1} did not draw`);
    if (!out.riddleHelp) errs.push(`${tag}: ch${c + 1} riddle help not shown`);
    return out;
  }

  await p.evaluate(() => window.__owl.go(window.__owl.storyHome));
  await p.waitForSelector('.sq-map');
  await noScroll('map'); await shot('map');
  const stars0 = await p.evaluate(() => window.__owl.st.stars);
  const r1 = await playChapter(0);
  await noScroll('celebration'); await shot('celebration');
  const stars1 = await p.evaluate(() => window.__owl.st.stars);
  if (stars1 - stars0 !== 20) errs.push(`${tag}: expected 20 stars for chapter 1, got ${stars1 - stars0}`);
  if (!r1.wrongShown) errs.push(`${tag}: wrong answer help not shown`);
  if (!r1.echoOk) errs.push(`${tag}: story choice did not change a later line`);
  // storybook
  await p.click('#sqBook'); await p.waitForSelector('.sq-book');
  const pages = await p.$$eval('.sq-bpage', x => x.length), imgs = await p.$$eval('.sq-bpage img', x => x.length);
  if (pages !== 9) errs.push(`${tag}: storybook has ${pages} pages`);
  if (imgs !== 2) errs.push(`${tag}: storybook has ${imgs} drawings`);
  await noScroll('book'); await shot('book');
  // reload: progress persists, chapter 2 open, gallery got drawings
  await p.reload(); await p.waitForFunction(() => window.__owl && window.__quest);
  const after = await p.evaluate(() => ({ done: Object.keys(window.__quest.state.done).length, got: !!window.__quest.state.got[0], stars: window.__owl.st.stars, age: window.__owl.st.age }));
  if (after.done !== 9 || !after.got) errs.push(`${tag}: progress lost after reload ${JSON.stringify(after)}`);
  if (after.stars !== stars1) errs.push(`${tag}: stars lost after reload`);
  await p.evaluate(() => window.__owl.go(window.__owl.storyHome));
  await p.waitForSelector('.sq-map');
  if (await p.$('.sq-ch[data-ch="1"].locked')) errs.push(`${tag}: chapter 2 still locked`);
  if (!await p.$('#sqNextCh')) errs.push(`${tag}: no next chapter button`);
  await p.click('#sqNextCh'); await p.waitForSelector('.sq-ch[data-ch="1"].on');
  await noScroll('chapter 2 map'); await shot('map2');
  // a locked stop just talks, it does not open
  await p.click('.sq-stop[data-stop="4"]'); await sleep(200);
  if (!await p.$('.sq-map')) errs.push(`${tag}: a locked stop opened`);
  // chapter 3 map look
  await p.evaluate(() => { window.__owl.st.unlockAll = true; window.__owl.go(window.__quest.mapView, 2); });
  await p.waitForSelector('.sq-ch[data-ch="2"].on'); await noScroll('chapter 3 map'); await shot('map3');
  await p.evaluate(() => window.__owl.go(window.__quest.stopView, 2, 4)); await p.waitForSelector('.sq-story'); await shot('story3');
  await p.evaluate(() => { window.__owl.st.unlockAll = false; });
  let more = '';

  if (vp.width >= 1000) {
    // turning a tablet into a phone-sized window redraws the map in the phone layout, and back again
    await p.evaluate(() => window.__owl.go(window.__quest.mapView, 1)); await p.waitForSelector('.sq-map.wide');
    await p.setViewportSize({ width: 390, height: 844 });
    try { await p.waitForSelector('.sq-map:not(.wide)', { timeout: 3000 }); } catch (e) { errs.push(`${tag}: map kept the tablet layout after resize`); }
    await noScroll('map after resize');
    const fit = await p.evaluate(() => { const m = document.querySelector('.sq-map').getBoundingClientRect(); return [...document.querySelectorAll('.sq-stop')].every(s => { const r = s.getBoundingClientRect(); return r.left >= m.left - 8 && r.right <= m.right + 8; }) && m.right <= innerWidth; });
    if (!fit) errs.push(`${tag}: stops fall outside the map after resize`);
    if (!await p.evaluate(() => window.__quest.watching)) errs.push(`${tag}: map stopped watching after redraw`);
    await shot('map-resized');
    await p.setViewportSize(vp);
    try { await p.waitForSelector('.sq-map.wide', { timeout: 3000 }); } catch (e) { errs.push(`${tag}: map did not go back to the tablet layout`); }
    // leaving the map stops the watcher; a later resize does nothing
    await p.click('#sqGo'); await p.waitForSelector('.sq-story'); await sleep(50);
    if (await p.evaluate(() => window.__quest.watching)) errs.push(`${tag}: map watcher still running after leaving the map`);
    await p.setViewportSize({ width: 390, height: 844 }); await sleep(400);
    if (!await p.$('.sq-story') || await p.$('.sq-map')) errs.push(`${tag}: resize after leaving the map changed the screen`);
    await p.setViewportSize(vp);
    more = ', map resize ok';
  } else {
    // chapters 2 and 3 all the way to their prizes
    await p.evaluate(() => window.__owl.go(window.__quest.mapView, 1)); await p.waitForSelector('.sq-ch[data-ch="1"].on');
    const s2 = await p.evaluate(() => window.__owl.st.stars);
    await playChapter(1);
    await noScroll('chapter 2 prize'); await shot('celebration2');
    const s3 = await p.evaluate(() => window.__owl.st.stars);
    if (s3 - s2 !== 20) errs.push(`${tag}: expected 20 stars for chapter 2, got ${s3 - s2}`);
    if (!/Firefly Lantern/.test(await p.textContent('.sq-final'))) errs.push(`${tag}: chapter 2 prize missing`);
    await p.click('#sqNext'); await p.waitForSelector('.sq-ch[data-ch="2"].on');
    if (await p.$('.sq-stop[data-stop="0"].locked')) errs.push(`${tag}: chapter 3 locked after chapter 2`);
    await playChapter(2);
    await noScroll('chapter 3 prize'); await shot('celebration3');
    const s4 = await p.evaluate(() => window.__owl.st.stars);
    if (s4 - s3 !== 20) errs.push(`${tag}: expected 20 stars for chapter 3, got ${s4 - s3}`);
    const fin = await p.textContent('.sq-final');
    if (!/Star Crown/.test(fin) || /whole quest/.test(fin)) errs.push(`${tag}: chapter 3 prize missing, or the quest ended too soon`);
    if (!/Under the Sea/.test(await p.textContent('#sqNext'))) errs.push(`${tag}: chapter 3 does not lead to Under the Sea`);
    // chapters 4 and 5
    const PRIZES = { 3: 'Rainbow Pearl', 4: 'Golden Dino Egg' }; let sPrev = s4;
    for (const c of [3, 4]) {
      await p.click('#sqNext'); await p.waitForSelector(`.sq-ch[data-ch="${c}"].on`);
      if (await p.$('.sq-stop[data-stop="0"].locked')) errs.push(`${tag}: chapter ${c + 1} locked after chapter ${c}`);
      await noScroll(`chapter ${c + 1} map`); await shot(`map${c + 1}`);
      await playChapter(c);
      await noScroll(`chapter ${c + 1} prize`); await shot(`celebration${c + 1}`);
      const sNow = await p.evaluate(() => window.__owl.st.stars);
      if (sNow - sPrev !== 20) errs.push(`${tag}: expected 20 stars for chapter ${c + 1}, got ${sNow - sPrev}`);
      sPrev = sNow;
      const f = await p.textContent('.sq-final');
      if (!f.includes(PRIZES[c])) errs.push(`${tag}: chapter ${c + 1} prize missing`);
      if (!await p.$('.sq-final .sq-prize svg')) errs.push(`${tag}: chapter ${c + 1} prize picture missing`);
      if (c === 3 && (/whole quest/.test(f) || !await p.$('#sqNext'))) errs.push(`${tag}: chapter 4 should lead on to chapter 5`);
      if (c === 4 && (!/whole quest/.test(f) || await p.$('#sqNext'))) errs.push(`${tag}: quest ending missing after chapter 5`);
    }
    const got = await p.evaluate(() => Object.keys(window.__quest.state.got).length);
    if (got !== 5) errs.push(`${tag}: ${got} chapter prizes saved`);
    // the finished worlds: the sea is bright and the volcano is calm
    await p.click('#sqMap'); await p.waitForSelector('.sq-ch[data-ch="4"].on'); await shot('map5-done');
    await p.click('#sqBook'); await p.waitForSelector('.sq-book');
    if (await p.$$eval('.sq-bpage', x => x.length) !== 9 || !await p.$('.sq-bend svg')) errs.push(`${tag}: chapter 5 storybook incomplete`);
    await noScroll('chapter 5 book'); await shot('book5');
    await p.evaluate(() => window.__owl.go(window.__quest.mapView, 3)); await p.waitForSelector('.sq-ch[data-ch="3"].on'); await shot('map4-done');
    for (const c of [1, 2, 3, 4]) if (!Object.keys(kinds).some(k => k.startsWith(c + ':'))) errs.push(`${tag}: no story riddles in chapter ${c + 1}`);
    more = ', chapters 2 to 5 done';
  }
  if (!Object.keys(kinds).some(k => k.startsWith('0:'))) errs.push(`${tag}: no story riddles in chapter 1`);
  // an old save from when the quest had 3 chapters: chapters 1-3 done, so chapter 4 is open and chapter 5 is not
  await p.evaluate(() => { const st = window.__owl.st, done = {}, d = '2026-01-01'; st.unlockAll = false;
    for (let c = 0; c < 3; c++) for (let i = 0; i < 9; i++) done[c + '-' + i] = d;
    st.story = { chapter: 2, stop: 0, done, picks: { '0-1': 1 }, got: { 0: d, 1: d, 2: d } }; window.__owl.go(window.__owl.storyHome); });
  await p.waitForSelector('.sq-ch[data-ch="2"].on');
  if (await p.$('.sq-ch[data-ch="3"].locked') || !await p.$('.sq-ch[data-ch="4"].locked')) errs.push(`${tag}: old save does not open chapter 4 (and only chapter 4)`);
  if (!/Under the Sea/.test((await p.textContent('#sqNextCh').catch(() => '')) || '')) errs.push(`${tag}: old save has no button to chapter 4`);
  else { await p.click('#sqNextCh'); await p.waitForSelector('.sq-ch[data-ch="3"].on');
    if (await p.$('.sq-stop[data-stop="0"].locked') || !await p.$('.sq-stop[data-stop="0"].next')) errs.push(`${tag}: old save: chapter 4 first stop not ready`); }
  await p.click('.sq-ch[data-ch="4"]'); await sleep(150);
  if (!await p.$('.sq-ch[data-ch="3"].on')) errs.push(`${tag}: old save opened the locked chapter 5`);
  await noScroll('old save map'); more += ', old save ok';
  console.log(`${tag}: chapter 1 done, +${stars1 - stars0} stars, ${pages} storybook pages${more}; riddles ${JSON.stringify(kinds)}`);
  await ctx.close();
}

(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const age of [5, 9]) for (const vp of [{ width: 390, height: 844 }, { width: 1024, height: 768 }]) {
    try { await run(b, age, vp, errs); } catch (e) { errs.push(`age ${age} ${vp.width}: ${e.message.split('\n')[0]}`); }
  }
  console.log('errors', errs.length ? errs : 'none');
  await b.close();
})();
