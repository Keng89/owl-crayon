const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 900, height: 700 } });
  await p.goto('http://localhost:8766/index.html?p#selftest'); await p.waitForTimeout(300);
  await p.evaluate(() => { const v = document.getElementById('view'); const ids = ['wash', 'dots', 'sponge', 'collage', 'resist', 'swirls'];
    v.innerHTML = `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${ids.map(id => { const l = __owl.LESSONS.find(x => x.id === id); return `<div><b>${l.title}</b>${__owl.lessonSVG(l, l.steps.length - 1, 'art-svg')}</div>`; }).join('')}</div>`; });
  await p.screenshot({ path: 'p-paint.png', fullPage: true }); await b.close();
})();
