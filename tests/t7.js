const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 1024, height: 768 } }); const p = await ctx.newPage();
  p.on('pageerror', e => errs.push('PAGE ' + e.message));
  await p.goto(`http://localhost:${process.env.PORT || 8766}/index.html#selftest`); await p.waitForTimeout(300);
  const ids = await p.evaluate(() => window.__owl.LESSONS.map(l => l.id));
  console.log('lessons', ids.length);
  // unlock all
  await p.evaluate(() => { const s = JSON.parse(localStorage.getItem('owlcrayon:state') || 'null'); });
  await p.click('#parent'); const prob = await p.locator('.panel .note').first().textContent(); const [a,bb] = prob.match(/(\d+) × (\d+)/).slice(1).map(Number);
  await p.fill('#ga', String(a*bb)); await p.press('#ga','Enter'); await p.check('#ua'); await p.click('#saveS');
  await p.click('#homeBtn'); await p.click('#tArt'); await p.screenshot({ path: 'a-home.png', fullPage: true });
  const shots = ['house', 'elephant', 'faceprop', 'road', 'butterfly', 'wheel', 'plane', 'letters3d', 'sphere', 'lion', 'mandala', 'bean'];
  for (const id of ids) {
    const cat = await p.evaluate(id => window.__owl.LESSONS.find(l => l.id === id).cat, id);
    await p.click('#homeBtn'); await p.click('#tArt'); await p.click(`[data-cat="${cat}"]`); await p.click(`[data-l="${id}"]`);
    const n = await p.evaluate(id => window.__owl.LESSONS.find(l => l.id === id).steps.length, id);
    const box = await p.locator('#cv').boundingBox();
    await p.mouse.move(box.x + 50, box.y + 50); await p.mouse.down(); await p.mouse.move(box.x + 150, box.y + 120, { steps: 5 }); await p.mouse.up();
    for (let i = 0; i < n - 1; i++) { if (i === 1) await p.click('#trace'); await p.click('#next'); }
    const empty = await p.evaluate(() => document.querySelector('#gsvg svg').innerHTML.length);
    if (shots.includes(id)) await p.screenshot({ path: `a-${id}.png` });
    await p.click('#next'); await p.waitForTimeout(100);
    if (!(await p.locator('#more').count())) errs.push('no finish ' + id);
  }
  // pixel heart
  await p.click('#homeBtn'); await p.click('#tArt'); await p.click('[data-tool="pixel"]'); await p.click('[data-p="heart"]');
  const rows = ['.rr.rr.', 'rrrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'];
  for (let y = 0; y < rows.length; y++) for (let x = 0; x < 7; x++) if (rows[y][x] === 'r') await p.click(`[data-x="${x}"][data-y="${y}"]`);
  await p.click('#chk'); console.log('pixel:', await p.locator('#pmsg').textContent()); await p.screenshot({ path: 'a-pixel.png' });
  await p.click('#backBtn'); await p.click('[data-p="xmush"]'); await p.screenshot({ path: 'a-pixel-coord.png' });
  // mandala
  await p.click('#homeBtn'); await p.click('#tArt'); await p.click('[data-tool="mandala"]');
  const bx = await p.locator('#cv').boundingBox(); await p.click('[data-c="#F2604F"]');
  await p.mouse.move(bx.x + bx.width/2 + 30, bx.y + bx.height/2 - 20); await p.mouse.down(); await p.mouse.move(bx.x + bx.width/2 + 120, bx.y + bx.height/2 - 90, { steps: 8 }); await p.mouse.up();
  await p.screenshot({ path: 'a-mandala.png' });
  // phone
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage(); m.on('pageerror', e => errs.push('PH ' + e.message));
  await m.goto(`http://localhost:${process.env.PORT || 8766}/index.html`); await m.click('#tArt'); await m.click('[data-cat="animals"]'); await m.click('[data-l="cat"]'); await m.screenshot({ path: 'a-phone-lesson.png', fullPage: true });
  console.log('phone scrollW', await m.evaluate(() => document.documentElement.scrollWidth));
  await m.click('#homeBtn'); await m.click('#tMath'); await m.click('[data-w="0"]'); await m.click('[data-s="count"]'); await m.screenshot({ path: 'a-phone-mlesson.png', fullPage: true });
  console.log('errors', errs.length ? errs : 'none'); await b.close();
})();
