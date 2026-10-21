// Brushes: in free draw, a stroke with every brush (real pointer moves) changes the pixels the way the real medium
// would (pencil thin and grainy, crayon with paper gaps, marker see-through and darker where it crosses, watercolor
// see-through and spreading after the stroke, thick paint opaque and picking up the color under it, chalk broken,
// spray building up while held, ink thick one way and thin the other, glitter many colors, smudge moving paint,
// rainbow changing color, stamps placing a shape), and Undo takes each stroke back (watercolor even while it spreads).
// Mirror with watercolor, the eraser over watercolor, papers, Save, a busy mandala stroke settling quickly, and a
// Brush Techniques lesson preselecting its brush and paper. On a phone and a tablet, no sideways scroll, big buttons.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const PORT = process.env.PORT || 8766, SHOTS = process.env.SHOTS || '.';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h, tag] of [[390, 844, 'phone'], [1024, 768, 'tablet']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 500, deviceScaleFactor: 1 });
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(`${tag}: ${e.message}`));
    p.on('console', m => { if (m.type() === 'error' && !/favicon|manifest|sw\.js|service|fonts/i.test(m.text())) errs.push(`${tag} console: ${m.text()}`); });
    const fail = m => errs.push(`${tag}: ${m}`);
    await p.goto(`http://localhost:${PORT}/index.html?r=${Date.now()}#selftest`);
    await p.waitForFunction(() => window.__owl && window.__owl.st);
    const noScroll = async where => { const o = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); if (o > 1) fail(`horizontal scroll ${o}px at ${where}`); };
    const bigEnough = async where => {
      const small = await p.evaluate(() => [...document.querySelectorAll('#view .brush-row button')].filter(b => b.offsetParent).map(b => { const r = b.getBoundingClientRect(); return [b.dataset.b || b.dataset.st || b.id, Math.round(r.width), Math.round(r.height), b.getAttribute('aria-label')]; }).filter(x => x[1] < 44 || x[2] < 44 || !x[3]));
      if (small.length) fail(`${where}: small or unlabeled brush buttons ${JSON.stringify(small)}`);
    };
    const gal = () => p.evaluate(() => JSON.parse(localStorage.getItem('owlcrayon:gallery:' + (localStorage.getItem('owlcrayon:current') || '"p1"').replace(/"/g, '')) || '[]').length);
    const settle = () => p.waitForFunction(() => !window.__owl.livePad.busy(), null, { timeout: 4000 });
    const box = () => p.evaluate(() => { const b = document.getElementById('cv').getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; });
    // A stroke on the pad; points are fractions of the canvas. hold = ms to wait before lifting.
    async function draw(pts, { steps = 4, hold = 0 } = {}) {
      await p.evaluate(() => document.getElementById('cv').scrollIntoView({ block: 'center' }));
      const r = await box();
      await p.mouse.move(r.x + pts[0][0] * r.w, r.y + pts[0][1] * r.h); await p.mouse.down();
      for (const q of pts.slice(1)) await p.mouse.move(r.x + q[0] * r.w, r.y + q[1] * r.h, { steps });
      if (hold) await sleep(hold);
      await p.mouse.up();
    }
    // Pixel stats of a box on a canvas (fractions): painted pixels, mean alpha, mean color, colors, hue.
    const stat = (x0, y0, x1, y1, id = 'cv') => p.evaluate(([x0, y0, x1, y1, id]) => {
      const c = document.getElementById(id), X = Math.floor(x0 * c.width), Y = Math.floor(y0 * c.height), W = Math.max(1, Math.floor((x1 - x0) * c.width)), H = Math.max(1, Math.floor((y1 - y0) * c.height));
      const d = c.getContext('2d').getImageData(X, Y, W, H).data; let n = 0, sa = 0, r = 0, g = 0, b = 0, mx = 0, hi = 0; const cols = new Set();
      for (let i = 0; i < d.length; i += 4) { const a = d[i + 3]; if (!a) continue; n++; sa += a; r += d[i]; g += d[i + 1]; b += d[i + 2]; if (a > mx) mx = a; if (a > 240) hi++; cols.add((d[i] >> 5) + ',' + (d[i + 1] >> 5) + ',' + (d[i + 2] >> 5)); }
      return { n, frac: n / (W * H), a: n ? sa / n : 0, r: n ? r / n : 0, g: n ? g / n : 0, b: n ? b / n : 0, mx, hi, cols: cols.size };
    }, [x0, y0, x1, y1, id]);
    const all = id => stat(0, 0, 1, 1, id);
    const brush = async id => { await p.click(`[data-b="${id}"]`); if (await p.evaluate(() => window.__owl.livePad.brush()) !== id) fail(`brush button ${id} did not pick it`); if (await p.getAttribute(`[data-b="${id}"]`, 'aria-pressed') !== 'true') fail(`${id} not shown as picked`); };
    const color = c => p.click(`[data-c="${c}"]`), size = z => p.click(`[data-z="${z}"]`);
    const clear = async () => { await p.click('#clr'); await sleep(30); };
    const undo1 = async () => { await p.click('#und'); await sleep(250); };
    const undoBlank = async id => { await p.click('#und'); await sleep(250); const s = await all('cv'); if (s.n) fail(`Undo after ${id} left ${s.n} pixels`); };
    const line = (y = 0.5, x0 = 0.15, x1 = 0.85) => [[x0, y], [(x0 + x1) / 2, y + 0.04], [x1, y]];
    const block = async (c, x0, x1, y0, y1) => { await brush('round'); await color(c); await size(28); for (let y = y0; y <= y1; y += 0.03) await draw([[x0, y], [x1, y]], { steps: 2 }); await settle(); };

    await p.evaluate(() => window.__owl.go(window.__owl.artHome));
    await p.click('[data-tool="free"]'); await p.waitForSelector('#cv');
    await noScroll('free draw'); await bigEnough('free draw');
    if (await p.evaluate(() => window.__owl.livePad.brush()) !== 'round') fail('default brush is not the smooth pen');
    const nBr = await p.$$eval('[data-b]', x => x.length); if (nBr !== 13) fail(`${nBr} brushes`);
    // The brush row scrolls on its own; the page does not.
    const row = await p.evaluate(() => { const r = document.querySelector('.brush-row'); return { sw: r.scrollWidth, cw: r.clientWidth }; });
    if (tag === 'phone' && row.sw <= row.cw) fail('brush row does not scroll on a phone');
    await p.screenshot({ path: `${SHOTS}/brush-${tag}-pad.png`, fullPage: true });

    // Smooth pen: the old behaviour, an opaque line.
    await brush('round'); await color('#22305A'); await size(12);
    await draw(line()); await settle(); let s = await all('cv'); const roundN = s.n;
    if (!s.n || s.mx < 250) fail(`smooth pen ${JSON.stringify(s)}`);
    await undoBlank('round');

    // Pencil: thinner than the pen, grainy (not solid).
    await brush('pencil'); await draw(line(), { steps: 10 }); await settle(); s = await all('cv');
    if (!s.n || s.n > roundN * 0.75 || s.hi > s.n * 0.6) fail(`pencil not thin and grainy ${JSON.stringify(s)} vs pen ${roundN}`);
    await undoBlank('pencil');

    // Crayon: paper gaps inside the stroke.
    await brush('crayon'); await size(28); await draw(line(0.5)); await settle(); s = await stat(0.3, 0.49, 0.7, 0.53);
    if (s.frac > 0.95 || s.frac < 0.3) fail(`crayon has no paper gaps ${JSON.stringify(s)}`);
    await undoBlank('crayon');

    // Marker: see-through, and darker where two strokes cross.
    await brush('marker'); await color('#2E8BE6'); await size(12);
    await draw(line(0.5)); await settle(); const one = await stat(0.3, 0.49, 0.35, 0.51);
    if (one.mx > 240 || one.a < 90) fail(`marker not see-through ${JSON.stringify(one)}`);
    await draw([[0.5, 0.3], [0.5, 0.7]]); await settle(); const both = await stat(0.495, 0.505, 0.505, 0.515);
    const cross = await p.evaluate(() => { const c = document.getElementById('cv'), d = c.getContext('2d').getImageData(Math.round(c.width * 0.5), Math.round(c.height * 0.5 + 0.02 * c.height), 1, 1).data; return [...d]; });
    if (both.a <= one.a + 10) fail(`marker did not darken where it crosses: one ${one.a.toFixed(0)}, crossing ${both.a.toFixed(0)} ${cross}`);
    await undo1(); await undoBlank('marker');

    // Watercolor: see-through, spreads a little after the stroke, then dries; undo right away cancels the spreading.
    await brush('watercolor'); await color('#2E8BE6'); await size(12);
    await draw(line(0.5)); const wetNow = await all('wet'); await settle();
    s = await all('cv'); const dry = await all('wet');
    if (!wetNow.n) fail('watercolor did not paint on the wet layer while drawing');
    if (dry.n) fail('watercolor wet layer did not dry');
    if (s.mx > 235 || s.a > 200) fail(`watercolor not see-through ${JSON.stringify(s)}`);
    if (s.n < wetNow.n * 1.03) fail(`watercolor did not spread after the stroke: wet ${wetNow.n}, dry ${s.n}`);
    await p.screenshot({ path: `${SHOTS}/brush-${tag}-watercolor.png` });
    // wet-on-wet: a second stroke next to the first runs into it
    await color('#F2604F'); await draw(line(0.56)); await settle();
    await undo1(); // takes back the second stroke only
    s = await all('cv'); if (!s.n) fail('undo took back two watercolor strokes');
    await undoBlank('watercolor');
    await draw(line(0.5)); await p.click('#und'); await sleep(700); s = await all('cv'); const wl = await all('wet');
    if (s.n || wl.n) fail(`undo during the watercolor spread left paint ${s.n} ${wl.n}`);

    // Thick paint: opaque, and it drags along the color it passes through.
    await block('#2E8BE6', 0.1, 0.4, 0.4, 0.6);
    await brush('oil'); await color('#FFC23D'); await size(28); await draw([[0.2, 0.5], [0.45, 0.5], [0.6, 0.5]], { steps: 6 }); await settle();
    s = await stat(0.44, 0.48, 0.52, 0.52);
    if (s.hi < s.n * 0.5) fail(`thick paint not opaque ${JSON.stringify(s)}`);
    if (s.b < 75) fail(`thick paint did not pick up the blue under it ${JSON.stringify(s)}`);
    await p.click('#und'); await sleep(200); s = await stat(0.5, 0.45, 0.6, 0.55); if (s.n) fail('undo after thick paint');
    await clear();

    // Chalk: broken, powdery.
    await brush('chalk'); await color('#22305A'); await size(28); await draw(line(0.5)); await settle(); s = await stat(0.3, 0.48, 0.7, 0.52);
    if (s.frac > 0.95 || s.frac < 0.2 || s.a > 240) fail(`chalk not broken and powdery ${JSON.stringify(s)}`);
    await undoBlank('chalk');

    // Spray: dots; holding still builds up more paint.
    await brush('spray'); await size(12); await draw([[0.3, 0.5], [0.3, 0.5]]); await settle(); const tap = await stat(0.2, 0.4, 0.4, 0.6);
    await draw([[0.7, 0.5], [0.7, 0.5]], { hold: 600 }); await settle(); const held = await stat(0.6, 0.4, 0.8, 0.6);
    if (!tap.n || tap.frac > 0.5) fail(`spray tap ${JSON.stringify(tap)}`);
    if (held.n < tap.n * 1.5) fail(`holding the spray did not build up: tap ${tap.n}, held ${held.n}`);
    await undo1(); await undoBlank('spray');

    // Ink: thick going down-right, thin going up-right.
    await brush('ink'); await size(12);
    await draw([[0.2, 0.3], [0.4, 0.3 + 0.2 * (await box()).w / (await box()).h]], { steps: 8 }); await settle(); const down = (await all('cv')).n;
    await clear(); await draw([[0.2, 0.7], [0.4, 0.7 - 0.2 * (await box()).w / (await box()).h]], { steps: 8 }); await settle(); const up = (await all('cv')).n;
    if (down < up * 2.5) fail(`ink width does not follow direction: down-right ${down}, up-right ${up}`);
    await undoBlank('ink');

    // Glitter: speckles in many colors.
    await brush('glitter'); await color('#6D55D1'); await draw(line(0.5)); await settle(); s = await all('cv');
    if (s.cols < 5 || s.frac > 0.2) fail(`glitter ${JSON.stringify(s)}`);
    await undoBlank('glitter');

    // Smudge: moves paint into the empty paper next to it.
    await block('#2E8BE6', 0.1, 0.4, 0.4, 0.6);
    const before = await stat(0.45, 0.45, 0.6, 0.55);
    await brush('smudge'); await draw([[0.3, 0.5], [0.4, 0.5], [0.55, 0.5]], { steps: 8 }); await settle();
    const after = await stat(0.45, 0.45, 0.6, 0.55);
    if (before.n || after.n < 50 || after.b < 150) fail(`smudge did not move the blue: before ${before.n}, after ${JSON.stringify(after)}`);
    await p.click('#und'); await sleep(200); if ((await stat(0.45, 0.45, 0.6, 0.55)).n) fail('undo after smudge');
    await clear();

    // Rainbow: the color changes along the stroke.
    await brush('rainbow'); await draw([[0.1, 0.5], [0.5, 0.5], [0.9, 0.5]], { steps: 10 }); await settle();
    const a = await stat(0.1, 0.45, 0.15, 0.55), z = await stat(0.85, 0.45, 0.9, 0.55);
    if (Math.abs(a.r - z.r) + Math.abs(a.g - z.g) + Math.abs(a.b - z.b) < 60) fail(`rainbow did not change color ${JSON.stringify([a, z])}`);
    await undoBlank('rainbow');

    // Stamps: a tap places one shape; the shape buttons show; the size buttons change its size.
    await brush('stamps');
    if (await p.$eval('.stamp-row', e => e.hidden)) fail('stamp shapes did not show');
    await bigEnough('stamps');
    await color('#F2604F'); await size(12); await p.click('[data-st="heart"]');
    await draw([[0.3, 0.5], [0.3, 0.5]]); await settle(); const st1 = await stat(0.15, 0.3, 0.45, 0.7);
    await size(28); await draw([[0.7, 0.5], [0.7, 0.5]]); await settle(); const st2 = await stat(0.5, 0.2, 0.95, 0.8);
    if (st1.n < 200 || st1.mx < 250) fail(`stamp ${JSON.stringify(st1)}`);
    if (st2.n < st1.n * 1.8) fail(`big stamp is not bigger ${st1.n} ${st2.n}`);
    await p.screenshot({ path: `${SHOTS}/brush-${tag}-stamps.png` });
    await undo1(); await undoBlank('stamp');
    await brush('pencil'); if (!(await p.$eval('.stamp-row', e => e.hidden))) fail('stamp shapes still showing for the pencil');

    // Mirror with watercolor: the copy on the other side is watercolor too.
    await p.click('[data-sym="2"]'); await brush('watercolor'); await color('#2FA36B'); await size(28);
    await draw([[0.1, 0.3], [0.25, 0.5], [0.15, 0.7]]); await settle();
    const L = await stat(0, 0.2, 0.4, 0.8), R = await stat(0.6, 0.2, 1, 0.8);
    if (!L.n || Math.abs(L.n - R.n) > L.n * 0.25 || R.mx > 235) fail(`mirror watercolor ${JSON.stringify([L, R])}`);
    await p.screenshot({ path: `${SHOTS}/brush-${tag}-mirror.png` });
    await p.click('[data-sym="0"]');
    // The eraser works over watercolor, with the watercolor brush still picked.
    await p.click('#er'); await draw([[0.05, 0.5], [0.45, 0.5]], { steps: 8 }); await settle();
    if ((await stat(0.18, 0.49, 0.22, 0.51)).n) fail('eraser did not erase the watercolor');
    if (!(await stat(0.6, 0.2, 1, 0.8)).n) fail('eraser took away the other side');
    await p.click('#und'); await sleep(200); if (!(await stat(0.18, 0.47, 0.25, 0.53)).n) fail('undo after the eraser');
    if (await p.getAttribute('#er', 'aria-pressed') !== 'true') fail('eraser button not shown as on');
    await brush('crayon'); if (await p.getAttribute('#er', 'aria-pressed') !== 'false') fail('picking a brush did not turn the eraser off');

    // A busy stroke: 8-way mandala with thick paint, a long fast scribble, settles soon after lifting.
    await p.click('[data-sym="8"]'); await brush('oil'); await size(28);
    const zz = Array.from({ length: 30 }, (_, k) => [0.2 + (k % 2) * 0.25, 0.1 + k * 0.025]);
    const t0 = Date.now(); await draw(zz, { steps: 3 }); await settle(); const took = Date.now() - t0;
    if (took > 6000) fail(`mandala thick-paint stroke took ${took}ms`);
    await p.click('[data-sym="0"]');

    // Papers: tap through them; black paper turns dark blue into white; Save adds a picture on that paper.
    const papers = [];
    for (let k = 0; k < 4; k++) { await p.click('#ppr'); papers.push(await p.evaluate(() => window.__owl.livePad.paper())); }
    if (papers.join() !== 'wc,canvas,black,plain') fail(`papers ${papers}`);
    await p.click('#ppr'); await p.click('#ppr'); await p.click('#ppr');
    if (await p.evaluate(() => window.__owl.livePad.paper()) !== 'black') fail('not black paper');
    await color('#22305A'); await p.click('#ppr'); await p.click('#ppr'); await p.click('#ppr'); await p.click('#ppr');
    if (await p.getAttribute('[data-c="#FFFFFF"]', 'aria-pressed') !== 'true') fail('black paper did not switch dark blue to white');
    await brush('chalk'); await draw(line(0.85));  await settle();
    await p.screenshot({ path: `${SHOTS}/brush-${tag}-black.png` });
    const g0 = await gal(); await p.click('#sav'); await sleep(200);
    if (await gal() !== g0 + 1) fail('Save did not add a picture');
    const dark = await p.evaluate(() => new Promise(res => { const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = 4; c.height = 4; const x = c.getContext('2d'); x.drawImage(im, 0, 0, 4, 4); const d = x.getImageData(0, 0, 1, 1).data; res(d[0] + d[1] + d[2]); }; im.src = JSON.parse(localStorage.getItem('owlcrayon:gallery:' + (localStorage.getItem('owlcrayon:current') || '"p1"').replace(/"/g, '')))[0]; }));
    if (dark > 200) fail(`saved picture is not on black paper (${dark})`);
    await noScroll('after drawing');

    // A Brush Techniques lesson preselects its brush and paper, and a step can switch the brush.
    await p.evaluate(() => window.__owl.go(window.__owl.artHome));
    const cat = await p.$('[data-cat="brushes"]'); if (!cat) fail('no Brush Techniques kind in Art School');
    const n = await p.evaluate(() => window.__owl.LESSONS.filter(l => l.cat === 'brushes').length); if (n < 6 || n > 8) fail(`${n} brush lessons`);
    await p.click('[data-cat="brushes"]'); await p.click('[data-l="bt-chalk"]'); await p.waitForSelector('#cv');
    const sel = await p.evaluate(() => [window.__owl.livePad.brush(), window.__owl.livePad.paper(), document.querySelector('[data-b="chalk"]').getAttribute('aria-pressed')]);
    if (sel.join() !== 'chalk,black,true') fail(`lesson did not preselect chalk on black paper: ${sel}`);
    await noScroll('lesson'); await bigEnough('lesson');
    await p.screenshot({ path: `${SHOTS}/brush-${tag}-lesson.png`, fullPage: true });
    for (let k = 0; k < 4; k++) await p.click('#next');
    if (await p.evaluate(() => window.__owl.livePad.brush()) !== 'smudge') fail('lesson step 5 did not pick the smudge finger');
    await p.click('[data-cat]').catch(() => {});
    await p.evaluate(() => window.__owl.go(window.__owl.drawLesson, 'bt-wash'));
    if ((await p.evaluate(() => [window.__owl.livePad.brush(), window.__owl.livePad.paper()])).join() !== 'watercolor,wc') fail('watercolor lesson preselect');
    await p.click('#homeBtn'); await sleep(200);
    await ctx.close();
  }
  console.log('errors', errs.length ? errs : 'none'); await b.close();
})();
