// Teaching helpers: art steps draw themselves (and replay), Owl's worked example on a math lesson, and the Owl hint.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766;
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h] of [[390, 844], [1024, 768]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } }); p.on('pageerror', e => errs.push(w + ' ' + e.message));
    await p.goto(`http://localhost:${PORT}/index.html?r=${Date.now()}#selftest`); await p.waitForTimeout(300);
    // Art: the newest step animates, and the pencil button replays it.
    await p.evaluate(() => window.__owl.go(window.__owl.drawLesson, 'house'));
    await p.click('#next'); await p.waitForTimeout(100);
    let a = await p.evaluate(() => { const els = [...document.querySelectorAll('#gsvg g.new *')]; return { n: els.length, anim: els.filter(e => /drawIn/.test(e.style.animation)).length }; });
    if (!a.anim) errs.push(w + ' art step did not animate ' + JSON.stringify(a));
    await p.waitForTimeout(2500);
    const off = await p.evaluate(() => [...document.querySelectorAll('#gsvg g.new *')].map(e => getComputedStyle(e).strokeDashoffset).filter(v => parseFloat(v) > 0.5).length);
    if (off) errs.push(w + ' lines still hidden after animation: ' + off);
    await p.click('#gplay'); await p.waitForTimeout(50);
    a = await p.evaluate(() => [...document.querySelectorAll('#gsvg g.new *')].filter(e => /drawIn/.test(e.style.animation)).length);
    if (!a) errs.push(w + ' replay did not animate');
    if (w === 390) await p.screenshot({ path: 't21-art.png' });
    // Math: worked example shows the answer and the method.
    for (const id of ['add10', 'fractions', 'algebra', 'kitchen']) {
      if (!(await p.evaluate(id => !!window.__owl.MATH[id], id))) continue;
      await p.evaluate(id => window.__owl.go(window.__owl.lessonView, id, true), id);
      await p.click('#demo'); await p.waitForTimeout(3900);
      const r = await p.evaluate(() => ({ right: document.querySelectorAll('#demoBox .choice.right').length, exp: (document.querySelector('#demoBox .explain') || {}).textContent || '', tryNow: !!document.querySelector('#tryNow') }));
      if (r.right !== 1 || !r.tryNow) errs.push(`${w} worked example ${id} ${JSON.stringify(r)}`);
      if (w === 390 && id === 'add10') await p.screenshot({ path: 't21-demo.png', fullPage: true });
    }
    // Math: hint removes exactly one wrong choice, once.
    await p.evaluate(() => window.__owl.go(window.__owl.play, 'add10'));
    await p.waitForTimeout(200);
    const before = await p.evaluate(() => document.querySelectorAll('.choice:not([disabled])').length);
    await p.click('#hint'); await p.waitForTimeout(100);
    const after = await p.evaluate(() => ({ live: document.querySelectorAll('.choice:not([disabled])').length, gone: document.querySelectorAll('.choice.gone').length }));
    if (before >= 3 && (after.live !== before - 1 || after.gone !== 1)) errs.push(`${w} hint ${before} -> ${JSON.stringify(after)}`);
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    if (sw > w) errs.push(`${w} horizontal scroll ${sw}`);
  }
  console.log('errors', errs.length ? errs : 'none'); await b.close();
})();
