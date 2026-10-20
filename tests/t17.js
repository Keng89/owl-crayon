const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const vp of [{ width: 390, height: 844 }, { width: 1024, height: 700 }]) {
    const p = await b.newPage({ viewport: vp }); p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8766/index.html?wr#selftest'); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(300); await p.evaluate(() => { __owl.st.unlockAll = true; });
    await p.click('#tMath'); await p.click('#wr'); await p.waitForTimeout(200);
    if (vp.width === 390) await p.screenshot({ path: 'wr-home.png' });
    const trace = async (n, good) => {
      await p.evaluate(() => __owl.go(() => {})); // reset view
      await p.click('#homeBtn'); await p.click('#tMath'); await p.click('#wr'); await p.click(`[data-n="${n}"]`); await p.waitForTimeout(300);
      const pts = await p.evaluate(() => { const g = document.querySelector('.write-guide .trk'), svg = g.ownerSVGElement, r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal, k = r.width / vb.width, L = g.getTotalLength(), out = []; for (let d = 0; d <= L; d += 2) { const q = g.getPointAtLength(d); out.push([r.left + q.x * k, r.top + q.y * k]); } return out; });
      if (good) { let prev = pts[0]; await p.mouse.move(...pts[0]); await p.mouse.down(); for (const pt of pts) { if (Math.hypot(pt[0] - prev[0], pt[1] - prev[1]) > 20) { await p.mouse.up(); await p.mouse.move(pt[0], pt[1]); await p.mouse.down(); } await p.mouse.move(pt[0] + 2, pt[1] - 2); prev = pt; } await p.mouse.up(); }
      else { const box = await p.locator('#wc').boundingBox(); await p.mouse.move(box.x + 10, box.y + 10); await p.mouse.down(); await p.mouse.move(box.x + box.width - 10, box.y + 20, { steps: 10 }); await p.mouse.up(); }
      await p.click('#wdone'); await p.waitForTimeout(200);
      return await p.textContent('#wmsg');
    };
    for (const n of [0, 4, 8, 13]) console.log(vp.width, 'good', n, '->', await trace(n, true));
    if (vp.width === 390) await p.screenshot({ path: 'wr-13.png' });
    console.log(vp.width, 'scribble 5 ->', await trace(5, false));
    console.log(vp.width, 'done', JSON.stringify(await p.evaluate(() => __owl.st.write.done)), 'scrollW', await p.evaluate(() => document.documentElement.scrollWidth));
    await p.close();
  }
  console.log('errors', errs.length ? errs : 'none'); await b.close();
})();
