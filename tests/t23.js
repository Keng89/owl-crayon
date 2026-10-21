// Owl's Quest: play all of chapter 1 at age 5 and age 9 on a phone and a tablet.
// Answers math (one wrong first), draws on the art pad, makes story choices, then checks stars, the prize,
// the storybook, no sideways scroll, and that progress survives a reload. Screenshots go to SHOTS (default: current folder).
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
  await p.evaluate(() => window.__owl.go(window.__owl.storyHome));
  await p.waitForSelector('.sq-map');
  await noScroll('map'); await shot('map');
  const stars0 = await p.evaluate(() => window.__owl.st.stars);
  const ch = await p.evaluate(() => window.__quest.CH[0].stops.map(s => s.kind));
  let wrongShown = false, drew = false, echoOk = false;
  for (let i = 0; i < ch.length; i++) {
    await p.click('#sqGo');
    await p.waitForSelector('.sq-story');
    const story = await p.textContent('.sq-story');
    if (i === 3) echoOk = /feet were still wet/.test(story); // stop 2 picked the river path
    if (i === 0) { await noScroll('story'); await shot('story'); }
    await p.click('#sqGo');
    if (ch[i] === 'math') {
      for (let k = 0; k < 3; k++) {
        await p.waitForSelector(`.sq-dots i:nth-child(${k + 1}).now`);
        await p.waitForSelector('.choice[data-ok]');
        if (i === 0 && k === 0) {
          await p.click('.choice:not([data-ok])');
          await p.waitForSelector('#exp .explain');
          wrongShown = true; await noScroll('math help'); await shot('math-help');
        }
        if (i === 6 && k === 0) await shot('math');
        await p.click('.choice[data-ok]');
        await p.waitForSelector('.choice.right');
      }
    } else if (ch[i] === 'art') {
      await p.waitForSelector('#cv');
      await p.click('#sqDone'); // nothing drawn yet: should stay
      if (await p.$('.sq-win')) errs.push(`${tag}: art accepted an empty pad`);
      const box = await (await p.$('#cv')).boundingBox();
      await p.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.3); await p.mouse.down();
      for (let t = 0; t <= 12; t++) await p.mouse.move(box.x + box.width * (0.3 + t * 0.03), box.y + box.height * (0.3 + Math.sin(t / 2) * 0.15));
      await p.mouse.up(); drew = true;
      if (i === 2) { await noScroll('art'); await shot('art'); }
      await p.click('#sqDone');
    } else {
      await p.waitForSelector('.sq-opt');
      if (i === 1) { await noScroll('choice'); await shot('choice'); }
      await p.click(`.sq-opt[data-o="${i === 1 ? 1 : 0}"]`);
    }
    await p.waitForSelector('.sq-win #sqOn', { timeout: 8000 });
    if (i === 0) { await noScroll('win'); await shot('win'); }
    await p.click('#sqOn');
    if (i < ch.length - 1) await p.waitForSelector('.sq-map');
  }
  await p.waitForSelector('.sq-final');
  await noScroll('celebration'); await shot('celebration');
  const stars1 = await p.evaluate(() => window.__owl.st.stars);
  if (stars1 - stars0 !== 20) errs.push(`${tag}: expected 20 stars for chapter 1, got ${stars1 - stars0}`);
  if (!wrongShown) errs.push(`${tag}: wrong answer help not shown`);
  if (!drew) errs.push(`${tag}: did not draw`);
  if (!echoOk) errs.push(`${tag}: story choice did not change a later line`);
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
  console.log(`${tag}: chapter 1 done, +${stars1 - stars0} stars, ${pages} storybook pages`);
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
