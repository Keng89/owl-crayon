/* ---------- art12: the Painting Studio — real painting lessons with the real brushes and papers ---------- */
// Uses the helpers from art.js (ac, ae, al, ap, ar, apg, guide, stroke, paint, atext).
// Every lesson keeps one paper, and every step names its brush, colour (and sometimes size), so the pad is set up
// for the child as each step opens (core.js drawLesson). `plevel` is the studio level 1–4 (Easy, Medium, Tricky,
// Expert); `level` is the Art School level it sits in for locking (Easy and Medium are Beginner).
ART_LATER.push(/*lazy{*/() => {
  const BK = '#22252B', DB = '#22305A', RD = '#F2604F', OR = '#FF8A2B', YE = '#FFC23D', GR = '#2FA36B', BL = '#2E8BE6', PU = '#6D55D1', PK = '#F49AC1', BR = '#8B5A2B', WH = '#FFFFFF',
    LB = '#8EC5F5', NV = '#123E6E', GY = '#9AA0A8', LY = '#FFE79A', DG = '#1F6B45', TE = '#1D9A8F', MG = '#C2367A', PE = '#F6C9A8', DR = '#8E2A20', LG = '#9BD67A';
  const THIN = 5, MED = 12, THICK = 28;
  const f1 = n => +(+n).toFixed(1);
  const og = (o, s) => `<g opacity="${o}">${s}</g>`;
  const fill = (c, s, o = 1) => paint(c, o < 1 ? og(o, s) : s);
  const FR = ar(15, 15, 170, 170, 8);
  const DARK = paint('#1F2027', ar(15, 15, 170, 170, 8)); // black paper, in the picture
  const rnd = seed => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const E = (x, y, rx, ry, a = 0) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}"${a ? ` transform="rotate(${f1(a)} ${f1(x)} ${f1(y)})"` : ''}/>`;
  const C = (x, y, r) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
  const wash = (c, y0 = 15, y1 = 185, o = 0.55) => fill(c, ap(`M15 ${y0}H185V${y1}H15Z`), o);
  const bandD = (y, h) => `M15 ${y}Q57 ${y - 6} 100 ${y}T185 ${y}V${y + h}Q143 ${y + h + 6} 100 ${y + h}T15 ${y + h}Z`;
  const band = (c, y, h, o = 0.7) => fill(c, ap(bandD(y, h)), o);
  const dabs = (c, pts, rx = 8, ry = 4) => paint(c, pts.map(p => E(p[0], p[1], p[3] || rx, p[4] || ry, p[2] != null ? p[2] : p.a || 0)).join(''));
  const dots = (c, pts, r = 2.2) => paint(c, pts.map(p => C(p[0], p[1], p[2] || r)).join(''));
  // Points scattered in a box (seeded, so the picture is the same every time), optionally only where keep(x, y) is true.
  // Each point also carries a random tilt in .a, used by dabs.
  const scatter = (seed, n, x0, y0, x1, y1, keep) => { const r = rnd(seed), out = []; let g = 0; while (out.length < n && g++ < n * 30) { const x = x0 + r() * (x1 - x0), y = y0 + r() * (y1 - y0); if (!keep || keep(x, y)) { const q = [f1(x), f1(y)]; q.a = f1(r() * 180 - 90); out.push(q); } } return out; };
  const star = (x, y, r) => apg(Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5 - Math.PI / 2, q = i % 2 ? r * 0.45 : r; return `${f1(x + q * Math.cos(a))},${f1(y + q * Math.sin(a))}`; }).join(' '));
  const petals = (cx, cy, n, d, rx, ry, a0 = 0) => Array.from({ length: n }, (_, i) => { const a = a0 + i * 360 / n, t = a * Math.PI / 180; return E(cx + d * Math.cos(t), cy + d * Math.sin(t), rx, ry, a); }).join('');
  const rays = (cx, cy, n, r0, r1, a0 = 0) => ap(Array.from({ length: n }, (_, i) => { const t = (a0 + i * 360 / n) * Math.PI / 180; return `M${f1(cx + r0 * Math.cos(t))} ${f1(cy + r0 * Math.sin(t))}L${f1(cx + r1 * Math.cos(t))} ${f1(cy + r1 * Math.sin(t))}`; }).join(''));
  const spiral = (cx, cy, r, turns = 1.6, a0 = 0) => { let d = ''; const n = Math.round(turns * 24); for (let i = 0; i <= n; i++) { const t = i / n, a = a0 + t * turns * 2 * Math.PI, q = r * (1 - t * 0.85); d += (i ? 'L' : 'M') + f1(cx + q * Math.cos(a)) + ' ' + f1(cy + q * Math.sin(a)); } return ap(d); };
  const wavy = (x0, y, x1, amp = 4, n = 4) => { const w = (x1 - x0) / n; let d = `M${x0} ${y}`; for (let i = 0; i < n; i++) d += `q${f1(w / 2)} ${i % 2 ? amp : -amp} ${f1(w)} 0`; return ap(d); };
  const heart = (x, y, s) => ap(`M${x} ${f1(y + 30 * s)}C${f1(x - 46 * s)} ${f1(y)} ${f1(x - 30 * s)} ${f1(y - 34 * s)} ${x} ${f1(y - 14 * s)}C${f1(x + 30 * s)} ${f1(y - 34 * s)} ${f1(x + 46 * s)} ${y} ${x} ${f1(y + 30 * s)}Z`);
  const pine = (x, y, h) => apg(`${x},${y - h} ${f1(x - h * 0.28)},${f1(y - h * 0.45)} ${f1(x - h * 0.14)},${f1(y - h * 0.45)} ${f1(x - h * 0.36)},${y} ${f1(x + h * 0.36)},${y} ${f1(x + h * 0.14)},${f1(y - h * 0.45)} ${f1(x + h * 0.28)},${f1(y - h * 0.45)}`);
  const leaf = (x, y, l, a) => { const t = a * Math.PI / 180, ex = x + l * Math.cos(t), ey = y + l * Math.sin(t), nx = -Math.sin(t) * l * 0.32, ny = Math.cos(t) * l * 0.32, mx = (x + ex) / 2, my = (y + ey) / 2; return ap(`M${f1(x)} ${f1(y)}Q${f1(mx + nx)} ${f1(my + ny)} ${f1(ex)} ${f1(ey)}Q${f1(mx - nx)} ${f1(my - ny)} ${f1(x)} ${f1(y)}Z`); };
  const leafC = (cx, cy, l, a) => { const t = a * Math.PI / 180; return [cx - l / 2 * Math.cos(t), cy - l / 2 * Math.sin(t), l, a]; }; // a leaf by its middle
  const inPoly = (pts, x, y) => { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) if ((pts[i][1] > y) !== (pts[j][1] > y) && x < (pts[j][0] - pts[i][0]) * (y - pts[i][1]) / (pts[j][1] - pts[i][1]) + pts[i][0]) c = !c; return c; };
  // The classic heart curve, as points (for dabbing inside it) and a path.
  const heartPts = (cx, cy, s) => Array.from({ length: 48 }, (_, i) => { const t = i / 48 * 2 * Math.PI; return [f1(cx + s * 16 * Math.sin(t) ** 3), f1(cy - s * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)))]; });
  const polyD = pts => ap(pts.map((q, i) => (i ? 'L' : 'M') + q[0] + ' ' + q[1]).join('') + 'Z');
  const vein = (x, y, l, a) => { const t = a * Math.PI / 180; return al(f1(x), f1(y), f1(x + l * 0.9 * Math.cos(t)), f1(y + l * 0.9 * Math.sin(t))); };
  const skyline = (base, parts) => ap(parts.map(([x, w, h]) => `M${x} ${base}V${base - h}H${x + w}V${base}`).join(''));
  // Window squares in buildings; keep(i) picks which are lit.
  const windows = (parts, base, keep = () => true) => { const o = []; parts.forEach(([x, w, h]) => { for (let yy = base - h + 8; yy < base - 8; yy += 12) for (let xx = x + 4; xx < x + w - 6; xx += 9) o.push(ar(xx, yy, 4, 5)); }); return o.filter((s, i) => keep(i)).join(''); };
  const S = (t, svg, brush, color, o) => [t, svg, Object.assign({ brush, color }, o || {})];
  const LV = [0, 1, 1, 2, 3];
  const L = (id, cat, pl, title, ico, paper, need, tip, steps) => ({ id, cat, level: LV[pl], plevel: pl, studio: true, title, ico, paper, brush: steps[0][2].brush, color: steps[0][2].color, need, tip,
    steps: steps.map(s => [s[0], s[1], Object.assign({ paper }, s[2])]) });
  const WC = 'Watercolor paints, a soft round brush, two cups of water, a paper towel and thick paper';
  const OIL = 'Thick paint (poster paint or acrylic), a stiff brush, a palette or paper plate, and card or canvas';
  const CHK = 'Black paper and chalk or soft pastels, and a tissue for smudging';
  const INK = 'Black ink or a black felt pen, watercolor paints, a brush and thick paper';
  const SPR = 'Paint and an old toothbrush to flick (real spray paint is only for grown-ups, outside!), card for stencils and paper';
  const MIX = 'Watercolors, crayons, felt pens, chalk and glitter glue: whatever you have';

  const P = [];
  ART_CATS.push(
    { id: 'ps-water', name: 'Watercolor', ico: '💧', blurb: 'Wet-on-wet skies, soft washes and glowing layers' },
    { id: 'ps-thick', name: 'Thick paint', ico: '🖌️', blurb: 'Bumpy brush marks you can see, like Van Gogh' },
    { id: 'ps-chalk', name: 'Chalk on black', ico: '🌌', blurb: 'Light colors that glow on black paper' },
    { id: 'ps-ink', name: 'Ink and wash', ico: '✒️', blurb: 'Bold ink lines with soft watercolor' },
    { id: 'ps-spray', name: 'Spray and stencil', ico: '💨', blurb: 'Misty spray, stencils and bubble letters' },
    { id: 'ps-famous', name: 'Famous art', ico: '🖼️', blurb: 'Paint like Monet, Van Gogh, Matisse and more' },
    { id: 'ps-mixed', name: 'Mixed media', ico: '🧩', blurb: 'Crayon, paint, ink, chalk and glitter together' }
  );

  /* ================= 💧 Watercolor (watercolor paper) ================= */
  {
    const clouds = ap('M40 70q4 -12 16 -8q6 -10 18 -2q12 -2 12 10q-24 4 -46 0z') + ap('M112 92q4 -10 14 -6q6 -8 16 0q10 0 10 8q-20 4 -40 -2z');
    P.push(L('ps-wetsky', 'ps-water', 1, 'Wet-on-wet sky', '💧', 'wc', WC, 'Wet paper makes paint spread by itself. Painters call it wet-on-wet!', [
      S('Watercolor starts with water! Pick the Watercolor brush, white and the thick size. Brush clean water over the top of the page.', FR + wash('#EAF5FC', 15, 125, 0.9), 'watercolor', WH, { size: THICK }),
      S('While the paper is still wet, drop blue along the top. Watch it spread into the water by itself!', band(BL, 15, 40, 0.65), 'watercolor', BL, { size: THICK }),
      S('Touch a little purple into the very top. Let it run into the blue. Do not stir it!', band(PU, 15, 16, 0.5), 'watercolor', PU, { size: THICK }),
      S('Leave white paper for clouds. Paint soft blue around them, never on top.', guide(clouds) + band(BL, 55, 40, 0.35), 'watercolor', LB, { size: MED }),
      S('Pick the Smudge finger. Softly rub the bottom edge of each cloud so it melts into the sky.', guide(al(40, 72, 86, 72) + al(112, 94, 152, 94)), 'smudge', LB),
      S('Paint a green hill along the bottom. Drop darker green in at one side while it is wet.', fill(GR, ap('M15 185V150Q70 122 120 142Q160 132 185 140V185Z'), 0.75) + fill(DG, ap('M120 142Q160 132 185 140V185H130Z'), 0.5), 'watercolor', GR, { size: THICK })
    ]));
  }
  {
    const sea = ap('M15 140H185');
    P.push(L('ps-sunset', 'ps-water', 1, 'Watercolor sunset', '🌅', 'wc', WC, 'Start with the lightest color and work toward the darkest. Watercolor can not cover dark with light!', [
      S('Draw a light pencil line across the page for the sea. Pick the Watercolor brush and yellow.', FR + guide(sea), 'watercolor', YE, { size: THICK }),
      S('Paint yellow just above the line. It is the brightest part of the sky.', band(YE, 108, 32, 0.8), 'watercolor', YE, { size: THICK }),
      S('While it is wet, paint orange above the yellow. Let the edges touch so they blend.', band(OR, 80, 30, 0.75), 'watercolor', OR, { size: THICK }),
      S('Now pink above the orange, then purple at the very top.', band(PK, 50, 32, 0.75) + band(PU, 15, 38, 0.7), 'watercolor', PK, { size: THICK }),
      S('Paint a half sun sitting on the sea line in light yellow.', fill(LY, ap('M78 140A22 22 0 0 1 122 140Z'), 0.95) + ap('M78 140A22 22 0 0 1 122 140'), 'watercolor', LY, { size: MED }),
      S('Paint the sea in purple and blue with sideways strokes. Leave thin gaps for the sun’s sparkles.', fill(PU, ap('M15 140H185V185H15Z'), 0.55) + stroke(LY, ap('M80 150h40M86 160h28M92 170h16')), 'watercolor', PU, { size: THICK }),
      S('Pick the Smooth pen and dark blue. Paint a little sailboat and two birds as dark shapes.', paint(DB, apg('140,138 140,104 160,134') + ap('M128 140h40l-6 8h-28z')) + ap('M40 60q6 -6 12 0q6 -6 12 0M64 74q5 -5 10 0q5 -5 10 0'), 'round', DB, { size: MED })
    ]));
  }
  {
    const body = 'M36 100Q86 44 140 100Q86 156 36 100Z', tail = 'M138 100L174 70L166 100L174 130Z';
    const rows = [[56, 70, RD], [74, 64, OR], [92, 60, YE], [110, 60, GR], [128, 62, BL]];
    const scales = rows.map(([x, h]) => { let d = ''; for (let y = 100 - h / 2 + 8; y < 100 + h / 2 - 4; y += 13) d += `M${x} ${y}q9 6 0 13`; return d; }).join('');
    P.push(L('ps-rfish', 'ps-water', 2, 'Rainbow fish', '🐠', 'wc', WC, 'Let each color dry a little before you paint the one next to it, or let them bleed on purpose for a soft rainbow.', [
      S('Pick the Pencil. Draw a big lemon shape for the body and a triangle tail.', FR + ap(body) + ap(tail), 'pencil', DB, { size: THIN }),
      S('Add an eye, a smile and curved scales in rows, like little rainbows.', C(62, 94, 6) + ap('M48 108q8 6 14 0') + ap(scales), 'pencil', DB, { size: THIN }),
      S('Pick the Watercolor brush. Paint each row of scales a different color: red, orange, yellow, green, blue.', rows.map(([x, h, c]) => fill(c, ar(x - 9, 100 - h / 2 + 4, 18, h - 8, 8), 0.6)).join(''), 'watercolor', RD, { size: MED }),
      S('Paint the tail purple. Let a drop of pink fall into it while it is wet.', fill(PU, ap(tail), 0.65) + dots(PK, [[160, 92, 4], [162, 110, 3]]), 'watercolor', PU, { size: MED }),
      S('Paint the sea around the fish with light blue. Leave little round bubbles white!', wash(LB, 15, 185, 0.35) + paint(WH, C(150, 50, 6) + C(160, 34, 4) + C(30, 60, 5)) + C(150, 50, 6) + C(160, 34, 4) + C(30, 60, 5), 'watercolor', LB, { size: THICK }),
      S('Pick Glitter and yellow. Give the fish one shiny scale, like the story!', paint(YE, star(92, 100, 8)), 'glitter', YE, { size: MED }),
      S('Pick the Ink pen. Go over the eye and the smile with ink when the paint is dry.', stroke(DB, C(62, 94, 6) + ap('M48 108q8 6 14 0')) + paint(DB, C(62, 94, 2.5)), 'ink', DB, { size: THIN })
    ]));
  }
  {
    const fl = [[60, 70, RD], [130, 60, PK], [100, 110, OR]];
    P.push(L('ps-flowers', 'ps-water', 2, 'Loose watercolor flowers', '🌸', 'wc', WC, 'Loose painting means you do not draw outlines first. Let the brush make the shapes!', [
      S('No pencil today! Pick the Watercolor brush and red. Press the brush down and lift it to make 5 round petals.', FR + paint(RD, og(0.6, petals(60, 70, 5, 12, 11, 8))), 'watercolor', RD, { size: THICK }),
      S('Make two more flowers in pink and orange the same way. Let some petals touch so they bleed.', paint(PK, og(0.6, petals(130, 60, 6, 12, 11, 7, 15))) + paint(OR, og(0.6, petals(100, 110, 5, 13, 12, 8, 30))), 'watercolor', PK, { size: THICK }),
      S('While they are wet, drop a darker red into the middle of each flower.', dots(DR, fl.map(([x, y]) => [x, y, 6])), 'watercolor', DR, { size: MED }),
      S('Paint thin green stems that wiggle down to the bottom.', stroke(GR, ap('M60 82Q56 130 66 182M130 72Q138 130 120 182M100 124Q96 150 100 182')), 'watercolor', GR, { size: THIN }),
      S('Press the side of the brush down to make leaves.', paint(GR, og(0.7, E(48, 140, 12, 5, -30) + E(138, 130, 12, 5, 30) + E(110, 156, 11, 5, -40))), 'watercolor', GR, { size: MED }),
      S('Pick the Spray can and yellow, thin size. Tap a few dots in the middle of each flower.', dots(YE, fl.map(([x, y]) => [x, y, 4])), 'spray', YE, { size: THIN })
    ]));
  }
  {
    const far = 'M15 112L45 80L70 98L100 66L132 94L160 74L185 92V185H15Z', mid = 'M15 132L50 104L84 126L118 100L150 124L185 108V185H15Z', near = 'M15 158L44 136L76 152L112 130L148 154L185 140V185H15Z';
    P.push(L('ps-misty', 'ps-water', 3, 'Misty mountains', '🏔️', 'wc', WC, 'Far away things look paler and bluer. That is how painters make distance!', [
      S('Pick Watercolor and light blue. Paint a pale sky. Leave the bottom white.', FR + band(LB, 15, 70, 0.4), 'watercolor', LB, { size: THICK }),
      S('Paint the farthest mountains very pale: lots of water, a little blue.', fill(LB, ap(far), 0.4) + ap('M15 112L45 80L70 98L100 66L132 94L160 74L185 92'), 'watercolor', LB, { size: THICK }),
      S('Pick the Smudge finger. Rub along the bottom of the far mountains to make mist.', guide(al(20, 112, 180, 112)), 'smudge', LB),
      S('Paint the middle mountains in blue, a little darker. Leave a white gap of mist above them.', fill(BL, ap(mid), 0.55) + ap('M15 132L50 104L84 126L118 100L150 124L185 108'), 'watercolor', BL, { size: THICK }),
      S('Paint the nearest mountains darkest, in navy blue.', fill(NV, ap(near), 0.8) + ap('M15 158L44 136L76 152L112 130L148 154L185 140'), 'watercolor', NV, { size: THICK }),
      S('Pick the Ink pen and dark blue. Draw little pine trees on the nearest hill.', paint(DB, pine(40, 150, 22) + pine(56, 146, 16) + pine(150, 156, 22) + pine(166, 150, 16)), 'ink', DB, { size: THIN }),
      S('Add two tiny birds far away. Tiny things look far!', ap('M120 50q4 -4 8 0q4 -4 8 0M140 40q3 -3 6 0q3 -3 6 0'), 'ink', DB, { size: THIN })
    ]));
  }
  {
    const shore = 'M15 110H185';
    const tree = ap('M48 110V70') + paint(GR, og(0.8, E(48, 64, 16, 20)));
    const rtree = ap('M48 110V150') + paint(GR, og(0.4, E(48, 156, 16, 20)));
    P.push(L('ps-lake', 'ps-water', 3, 'Reflections in a lake', '🏞️', 'wc', WC, 'A reflection is upside down, a bit paler, and broken by little ripples.', [
      S('Draw a pencil line across the middle for the far shore.', FR + guide(ap(shore)), 'pencil', DB, { size: THIN }),
      S('Pick Watercolor. Paint the sky light blue with a yellow glow near the shore.', band(LB, 15, 60, 0.5) + band(LY, 75, 35, 0.6), 'watercolor', LB, { size: THICK }),
      S('Paint a purple mountain and a green tree on the shore.', fill(PU, ap('M90 110L130 62L172 110Z'), 0.55) + tree, 'watercolor', PU, { size: MED }),
      S('Now paint them again, upside down, under the line. Make them paler with more water.', fill(PU, ap('M90 110L130 158L172 110Z'), 0.3) + rtree, 'watercolor', PU, { size: MED }),
      S('Paint the water with sideways strokes of light blue over the reflections.', band(LB, 110, 75, 0.3), 'watercolor', LB, { size: THICK }),
      S('Pick the Smudge finger. Rub straight sideways lines through the reflection to make ripples.', guide(al(30, 126, 170, 126) + al(30, 140, 170, 140) + al(30, 156, 170, 156)), 'smudge', LB),
      S('Pick white and the Watercolor brush, thin. Add a few sparkly lines on the water.', stroke(WH, ap('M60 132h20M110 146h26M70 168h18')) + guide(ap('M60 132h20M110 146h26M70 168h18')), 'watercolor', WH, { size: THIN })
    ]));
  }
  {
    const lv = [leafC(64, 64, 84, -45), leafC(140, 76, 76, -135), leafC(100, 140, 80, -80)];
    const tip = ([x, y, l, a], f = 0.85) => [x + l * f * Math.cos(a * Math.PI / 180), y + l * f * Math.sin(a * Math.PI / 180)];
    P.push(L('ps-leaves', 'ps-water', 2, 'Autumn leaves', '🍂', 'wc', WC, 'Wet-on-wet inside a shape: the colors mix inside the leaf, but stay in the lines.', [
      S('Pick the Pencil. Draw three big leaf shapes, pointing different ways.', FR + lv.map(q => leaf(...q)).join(''), 'pencil', DB, { size: THIN }),
      S('Pick Watercolor. Wet the first leaf with yellow, then drop red into its tip. Watch them mix!', fill(YE, leaf(...lv[0]), 0.6) + dots(RD, [[...tip(lv[0]), 8]]), 'watercolor', YE, { size: MED }),
      S('Do the next leaf with yellow and green.', fill(YE, leaf(...lv[1]), 0.6) + dots(GR, [[...tip(lv[1]), 8]]), 'watercolor', GR, { size: MED }),
      S('Do the last leaf with orange and a little brown at the stem.', fill(OR, leaf(...lv[2]), 0.6) + dots(BR, [[...tip(lv[2], 0.15), 7]]), 'watercolor', OR, { size: MED }),
      S('When the leaves are dry, pick the Ink pen and draw a stem and veins in each leaf.', lv.map(q => vein(...q) + (() => { const [x, y, l, a] = q, t = a * Math.PI / 180; return [0.35, 0.6].map(f => { const px = x + l * f * Math.cos(t), py = y + l * f * Math.sin(t); return ap(`M${f1(px)} ${f1(py)}l${f1(9 * Math.cos(t + 0.9))} ${f1(9 * Math.sin(t + 0.9))}M${f1(px)} ${f1(py)}l${f1(9 * Math.cos(t - 0.9))} ${f1(9 * Math.sin(t - 0.9))}`); }).join(''); })()).join('') + stroke(BR, lv.map(([x, y, l, a]) => al(f1(x), f1(y), f1(x - 10 * Math.cos(a * Math.PI / 180)), f1(y - 10 * Math.sin(a * Math.PI / 180)))).join('')), 'ink', BR, { size: THIN }),
      S('Pick the Spray can, thin size. Flick little orange dots around, like falling bits of autumn.', dots(OR, scatter(31, 14, 20, 20, 180, 180), 1.6), 'spray', OR, { size: THIN })
    ]));
  }
  {
    const tul = 'M100 50Q74 56 76 92Q80 112 100 114Q120 112 124 92Q126 56 100 50Z', mid = 'M100 50Q92 78 100 114';
    P.push(L('ps-tulip', 'ps-water', 4, 'Glazing layers: a tulip', '🌷', 'wc', WC, 'Glazing means painting a see-through layer on a dry layer. Each layer makes it deeper, like colored glass.', [
      S('Pick the Pencil. Draw a tulip cup, a line down the middle petal, a long stem and two leaves.', FR + ap(tul) + ap(mid) + ap('M100 114V184') + leaf(100, 180, 60, -110) + leaf(100, 176, 56, -60), 'pencil', DB, { size: THIN }),
      S('First layer: pick Watercolor and pink. Paint the whole flower very pale. Let it dry.', fill(PK, ap(tul), 0.45), 'watercolor', PK, { size: MED }),
      S('Second layer: red, only on the right side, away from the light. The pink still shows on the left.', fill(RD, ap('M100 50Q126 56 124 92Q120 112 100 114Q92 78 100 50Z'), 0.5), 'watercolor', RD, { size: MED }),
      S('Third layer: dark red just at the bottom of the cup, the darkest shadow.', fill(DR, ap('M86 104Q100 116 116 104Q112 112 100 114Q90 112 86 104Z'), 0.7), 'watercolor', DR, { size: THIN }),
      S('Paint the stem and leaves green. Add a second, darker green layer on one side of each leaf.', fill(GR, leaf(100, 180, 60, -110) + leaf(100, 176, 56, -60), 0.55) + stroke(GR, ap('M100 114V184')) + fill(DG, ap('M100 180Q90 150 80 124Q96 148 100 180Z'), 0.5), 'watercolor', GR, { size: MED }),
      S('Glaze a soft background: light blue around the flower, without touching it.', band(LB, 15, 40, 0.3), 'watercolor', LB, { size: THICK }),
      S('Pick the Pencil. Draw a few fine lines in the petals. Sign your painting in the corner!', ap('M90 70q-4 18 0 34M112 66q4 20 0 36') + ap('M150 176q4 -6 8 0q4 -6 8 0'), 'pencil', DB, { size: THIN })
    ]));
  }

  /* ================= 🖌️ Thick paint (canvas) ================= */
  {
    const hp = heartPts(100, 98, 4.4), big = heartPts(100, 98, 5.2), hs = polyD(hp);
    const inH = (x, y) => inPoly(hp, x, y);
    P.push(L('ps-heart', 'ps-thick', 1, 'Thick paint heart', '❤️', 'canvas', OIL, 'Short dabs leave bumpy marks you can see. That is called texture!', [
      S('Pick the Pencil. Draw a big heart in the middle.', FR + hs, 'pencil', DB, { size: THIN }),
      S('Pick Thick paint and red. Fill the heart with short dabs, all going the same way.', dabs(RD, scatter(5, 30, 34, 40, 166, 160, (x, y) => inPoly(heartPts(100, 98, 3.9), x, y)).map(p => [p[0], p[1], -30])), 'oil', RD, { size: MED }),
      S('Add pink dabs on the top left of the heart, where the light hits it.', dabs(PK, [[66, 64, -30], [80, 58, -30], [60, 78, -30], [76, 74, -30]]), 'oil', PK, { size: MED }),
      S('Pick white. One thick dab makes a shiny spot!', dabs(WH, [[68, 66, -30, 6, 3]]) + E(68, 66, 6, 3, -30), 'oil', WH, { size: MED }),
      S('Pick yellow. Dab all around the heart, going a different way, to fill the background.', dabs(YE, scatter(9, 34, 26, 24, 174, 176, (x, y) => !inPoly(big, x, y)).map(p => [p[0], p[1], 40])), 'oil', YE, { size: THICK }),
      S('Pick orange. Add a few dabs into the wet yellow. The thick paint mixes on the canvas!', dabs(OR, [[32, 30, 40], [168, 36, 40], [30, 168, 40], [166, 170, 40], [100, 176, 40]]), 'oil', OR, { size: MED })
    ]));
  }
  {
    const heads = [[70, 70, 13], [118, 62, 14], [94, 96, 12], [140, 98, 11]];
    P.push(L('ps-sunflowers', 'ps-thick', 2, 'Sunflowers like Van Gogh', '🌻', 'canvas', OIL, 'Van Gogh painted sunflowers again and again, with thick yellow paint you can still see the brush marks in.', [
      S('Pick the Pencil. Draw a vase at the bottom and four circles for flower middles.', FR + ap('M72 140H128L122 184H78Z') + al(64, 140, 136, 140) + heads.map(([x, y, r]) => C(x, y, r)).join(''), 'pencil', DB, { size: THIN }),
      S('Pick Thick paint and yellow. Make petals with short dabs pulled out from each middle.', paint(YE, heads.map(([x, y, r]) => petals(x, y, 12, r + 8, 8, 3.5)).join('')), 'oil', YE, { size: MED }),
      S('Add orange dabs between the petals. Do not mix them, let the colors sit side by side.', paint(OR, heads.map(([x, y, r]) => petals(x, y, 6, r + 6, 6, 3, 15)).join('')), 'oil', OR, { size: THIN }),
      S('Pick brown. Dab the middles with lots of little dots. Bumpy is good!', dots(BR, heads.map(([x, y, r]) => [x, y, r])) + dots(DR, scatter(11, 20, 56, 50, 152, 108, (x, y) => heads.some(([a, b, r]) => Math.hypot(x - a, y - b) < r - 3)), 2), 'oil', BR, { size: MED }),
      S('Pick green. Paint stems into the vase and a few leaves.', stroke(GR, ap('M70 83Q76 120 88 140M118 76Q112 110 104 140M94 108V140M140 109Q130 126 116 140')) + dabs(GR, [[80, 120, -40, 9, 4], [128, 122, 40, 9, 4]]), 'oil', GR, { size: MED }),
      S('Paint the vase blue with downward strokes.', fill(BL, ap('M72 140H128L122 184H78Z'), 0.85), 'oil', BL, { size: THICK }),
      S('Fill the background with light yellow dabs, all around the flowers. It glows!', dabs(LY, scatter(13, 30, 18, 18, 182, 140, (x, y) => !heads.some(([a, b, r]) => Math.hypot(x - a, y - b) < r + 16)).map(p => [p[0], p[1], 0])), 'oil', LY, { size: THICK })
    ]));
  }
  {
    P.push(L('ps-fruit', 'ps-thick', 2, 'Fruit bowl still life', '🍎', 'canvas', OIL, 'A still life is a painting of things that keep still. Real fruit on a table is the best model!', [
      S('Pick the Pencil. Draw a table line, a wide bowl, and round fruit sitting in it.', FR + al(15, 150, 185, 150) + ap('M48 120Q100 176 152 120Z') + C(78, 108, 18) + C(120, 106, 18) + ap('M88 92Q100 70 130 82Q114 92 96 96'), 'pencil', DB, { size: THIN }),
      S('Pick Thick paint and red. Dab the apple with curved strokes that follow its roundness.', dabs(RD, [[72, 104, -40], [84, 110, 40], [76, 118, 0], [70, 96, -60]]) + paint(RD, og(0.6, C(78, 108, 16))), 'oil', RD, { size: MED }),
      S('Paint the orange the same way, in orange, and the banana in yellow.', paint(OR, og(0.75, C(120, 106, 16))) + fill(YE, ap('M88 92Q100 70 130 82Q114 92 96 96Z'), 0.9), 'oil', OR, { size: MED }),
      S('Paint the bowl blue. Make the bottom a darker blue, in the shadow.', fill(BL, ap('M48 120Q100 176 152 120Z'), 0.8) + fill(NV, ap('M64 140Q100 168 136 140Q100 156 64 140Z'), 0.7), 'oil', BL, { size: THICK }),
      S('Pick white. One small dab on each fruit, on the side the light comes from.', dabs(WH, [[70, 100, -30, 4, 2.5], [112, 98, -30, 4, 2.5], [100, 80, -20, 4, 2]]), 'oil', WH, { size: THIN }),
      S('Pick brown. Paint the table with long sideways strokes, and a grey shadow under the bowl.', fill(BR, ap('M15 150H185V185H15Z'), 0.75) + fill(GY, E(100, 154, 46, 5), 0.8), 'oil', BR, { size: THICK }),
      S('Pick light blue. Fill the wall behind with dabs. Done: a real still life!', fill(LB, ap('M15 15H185V150H152Q140 120 130 100Q100 60 70 100Q56 120 48 150H15Z'), 0.5), 'oil', LB, { size: THICK })
    ]));
  }
  {
    const curl = 'M15 185V150Q20 90 70 64Q110 44 140 60Q160 72 152 92Q146 104 132 98Q140 84 126 80Q100 76 90 110Q84 140 110 185Z';
    const sea = 'M110 185Q130 160 185 156V185Z';
    P.push(L('ps-waves', 'ps-thick', 3, 'Crashing ocean wave', '🌊', 'canvas', OIL, 'Paint follows the water: let your strokes curve the way the wave moves.', [
      S('Pick the Pencil. Draw a big wave rising from the left, curling over at the top like a hook.', FR + ap(curl) + ap('M110 185Q130 160 185 156'), 'pencil', DB, { size: THIN }),
      S('Pick Thick paint and navy blue. Paint the wave with curved strokes that follow its shape.', fill(NV, ap(curl), 0.85) + stroke(BL, ap('M30 170Q34 110 76 80M50 176Q56 130 88 100')), 'oil', NV, { size: THICK }),
      S('Pick teal. Paint the thin top of the wave, where light shines through the water.', fill(TE, ap('M70 64Q110 44 140 60Q120 60 100 70Q80 82 66 100Q60 80 70 64Z'), 0.85), 'oil', TE, { size: MED }),
      S('Pick blue. Paint the flatter sea on the right, with sideways strokes.', fill(BL, ap(sea), 0.85), 'oil', BL, { size: THICK }),
      S('Pick light blue. Paint the sky around the wave with soft sideways strokes.', fill(LB, ap('M15 15H185V156Q130 160 110 185H110Q84 140 90 110Q100 76 126 80Q140 84 132 98Q146 104 152 92Q160 72 140 60Q110 44 70 64Q20 90 15 150Z'), 0.5), 'oil', LB, { size: THICK }),
      S('Pick white. Dab thick foam along the top of the curl and where it crashes. Pile it on!', dabs(WH, [[76, 62, -20], [96, 52, -10], [118, 50, 10], [140, 60, 50], [150, 80, 80], [140, 96, 20], [118, 176, 0], [140, 168, -10]], 9, 5), 'oil', WH, { size: MED }),
      S('Pick the Spray can and white. Spray a mist of sea spray flying off the top.', dots(WH, scatter(41, 16, 120, 24, 182, 80), 1.5) + guide(ac(160, 50, 22)), 'spray', WH, { size: MED })
    ]));
  }
  {
    const q = [[15, 15], [100, 15], [15, 100], [100, 100]];
    const trunk = (x, y) => ap(`M${x + 38} ${y + 82}V${y + 52}M${x + 42} ${y + 82}V${y + 52}M${x + 40} ${y + 56}L${x + 26} ${y + 38}M${x + 40} ${y + 52}L${x + 56} ${y + 36}`);
    const crown = (x, y, c, o = 0.9, seed = 3) => dabs(c, scatter(seed, 16, x + 14, y + 14, x + 70, y + 52, (a, b) => Math.hypot(a - x - 42, (b - y - 34) * 1.3) < 26), 6, 3.5);
    P.push(L('ps-seasons', 'ps-thick', 3, 'A tree in four seasons', '🌳', 'canvas', OIL, 'The same tree changes all year. Painters like Monet painted one place again and again in different seasons!', [
      S('Pick the Pencil. Split the page into 4 boxes with a cross. Draw the same tree trunk in each box.', FR + guide(al(100, 15, 100, 185) + al(15, 100, 185, 100)) + q.map(([x, y]) => trunk(x, y)).join(''), 'pencil', DB, { size: THIN }),
      S('Pick Thick paint and brown. Paint the four trunks and their branches.', stroke(BR, q.map(([x, y]) => trunk(x, y)).join('')), 'oil', BR, { size: MED }),
      S('Spring, top left: light green sky and pink blossom dabs on the branches.', crown(15, 15, PK, 0.9, 3) + dabs(LG, [[50, 32, 0, 4, 2.5], [40, 48, 0, 4, 2.5]]), 'oil', PK, { size: MED }),
      S('Summer, top right: lots of green dabs for a full, leafy tree.', crown(100, 15, GR, 0.9, 5) + crown(100, 15, DG, 0.9, 6), 'oil', GR, { size: MED }),
      S('Autumn, bottom left: orange, red and yellow dabs, and a few leaves falling on the ground.', crown(15, 100, OR, 0.9, 7) + crown(15, 100, RD, 0.9, 8) + dabs(YE, [[30, 176, 20, 4, 2], [70, 178, -20, 4, 2]]), 'oil', OR, { size: MED }),
      S('Winter, bottom right: bare branches with white snow on top, and snow on the ground.', stroke(WH, ap('M126 138q10 -4 14 -4M152 136q6 -2 10 -2')) + fill(WH, ap('M100 172H185V185H100Z'), 0.95) + dots(WH, scatter(17, 12, 104, 104, 182, 168), 1.8), 'oil', WH, { size: THIN }),
      S('Paint each sky: spring light blue, summer blue, autumn yellow, winter grey.', fill(LB, ar(15, 15, 85, 85), 0.3) + fill(BL, ar(100, 15, 85, 85), 0.3) + fill(YE, ar(15, 100, 85, 85), 0.3) + fill(GY, ar(100, 100, 85, 85), 0.35), 'oil', LB, { size: THICK })
    ]));
  }
  {
    P.push(L('ps-lighthouse', 'ps-thick', 4, 'Stormy lighthouse', '🗼', 'canvas', OIL, 'Contrast makes drama: the bright beam looks brightest next to the darkest storm clouds.', [
      S('Pick the Pencil. Draw rocks at the bottom right and a tall lighthouse on them, narrower at the top.', FR + ap('M110 170L118 70H142L150 170Z') + ap('M114 70H146V58H114Z') + ap('M120 58L130 44L140 58') + ap('M90 185Q100 160 130 166Q170 160 185 170V185Z'), 'pencil', DB, { size: THIN }),
      S('Pick Thick paint and navy blue. Paint a stormy sky with big swirly strokes.', fill(NV, ap('M15 15H185V150H15Z'), 0.75) + stroke(DB, spiral(50, 50, 26, 1.2) + spiral(70, 110, 20, 1)), 'oil', NV, { size: THICK }),
      S('Pick purple and grey. Swirl lighter clouds into the wet blue. Let them mix on the canvas.', dabs(PU, [[40, 40, 20, 14, 6], [80, 30, -10, 14, 6], [160, 30, 10, 14, 6]]) + dabs(GY, [[60, 70, 10, 12, 5], [170, 70, -20, 12, 5]]), 'oil', PU, { size: THICK }),
      S('Pick yellow. Paint two beams of light shining out from the top of the lighthouse.', fill(LY, ap('M130 52L15 20V60Z') + ap('M130 52L185 30V64Z'), 0.75), 'oil', YE, { size: THICK }),
      S('Pick red and white. Paint stripes on the lighthouse, thick and bumpy.', fill(RD, ap('M112 150H148L146 128H114Z') + ap('M116 108H144L142 90H118Z')) + fill(WH, ap('M114 128H146L144 108H116Z') + ap('M118 90H142L142 70H118Z')), 'oil', RD, { size: MED }),
      S('Pick brown. Paint the rocks with chunky strokes. Add black on their shady side.', fill(BR, ap('M90 185Q100 160 130 166Q170 160 185 170V185Z'), 0.9) + fill(BK, ap('M150 166Q170 160 185 170V185H160Z'), 0.6), 'oil', BR, { size: THICK }),
      S('Pick white. Smash big dabs of foam where the waves hit the rocks. Pile it high!', dabs(WH, [[96, 164, -30, 9, 5], [84, 172, 20, 9, 5], [70, 176, 0, 10, 4], [108, 158, -50, 7, 4], [40, 178, 0, 12, 4]]) + fill(TE, ap('M15 170Q50 160 90 176V185H15Z'), 0.7), 'oil', WH, { size: MED })
    ]));
  }

  /* ================= 🌌 Chalk on black paper ================= */
  {
    P.push(L('ps-space', 'ps-chalk', 1, 'Planets in space', '🪐', 'black', CHK, 'Chalk glows on black paper. Smudge it a little and it looks like the planet is glowing!', [
      S('Black paper is space! Pick Chalk and orange. Draw a big circle and color it in.', DARK + FR + fill(OR, C(70, 80, 32), 0.85) + C(70, 80, 32), 'chalk', OR, { size: THICK }),
      S('Draw stripes across it in red and yellow, curving like the planet.', stroke(RD, ap('M42 70q28 8 56 0M40 86q30 8 60 0')) + stroke(YE, ap('M44 100q26 6 52 0')), 'chalk', RD, { size: MED }),
      S('Draw a long flat ring around it in white.', stroke(WH, E(70, 82, 52, 10, -12)), 'chalk', WH, { size: MED }),
      S('Pick the Smudge finger. Rub around the edge of the planet to make it glow.', guide(C(70, 80, 38)), 'smudge', OR),
      S('Pick Chalk again. Draw a small blue planet and a tiny pink moon.', fill(BL, C(146, 132, 18), 0.9) + C(146, 132, 18) + fill(PK, C(160, 50, 8), 0.9) + C(160, 50, 8), 'chalk', BL, { size: MED }),
      S('Tap lots of tiny white stars all over the sky.', dots(WH, scatter(23, 24, 18, 18, 182, 182, (x, y) => Math.hypot(x - 70, y - 80) > 40 && Math.hypot(x - 146, y - 132) > 24), 1.4), 'chalk', WH, { size: THIN })
    ]));
  }
  {
    const bursts = [[60, 60, PK], [136, 52, YE], [104, 104, LB]];
    P.push(L('ps-fireworks', 'ps-chalk', 1, 'Fireworks night', '🎆', 'black', CHK, 'Bright lines on black paper look like light in the dark. Start every line in the middle and flick out!', [
      S('Pick Chalk and pink. Draw lines shooting out from one point, like a star burst.', DARK + FR + stroke(PK, rays(60, 60, 12, 6, 30)), 'chalk', PK, { size: MED }),
      S('Pick yellow. Make a bigger burst. Add a dot at the end of each line.', stroke(YE, rays(136, 52, 14, 6, 34)) + dots(YE, Array.from({ length: 14 }, (_, i) => [136 + 38 * Math.cos(i * Math.PI / 7), 52 + 38 * Math.sin(i * Math.PI / 7)]), 2.4), 'chalk', YE, { size: MED }),
      S('Pick light blue. Make a round burst of short dashes.', stroke(LB, rays(104, 104, 16, 16, 30, 10)), 'chalk', LB, { size: THIN }),
      S('Pick the Smudge finger. Rub the middle of each burst so it glows.', guide(bursts.map(([x, y]) => C(x, y, 10)).join('')), 'smudge', PK),
      S('Pick Glitter. Sprinkle sparkles on the ends of the bursts!', dots(YE, [[150, 30], [98, 72], [130, 120], [44, 40]], 2), 'glitter', YE, { size: MED }),
      S('Pick Chalk and white. Draw a row of rooftops along the bottom, with a few lit windows.', stroke(WH, ap('M15 170H40V150L52 140L64 150V170H90V146H120V170H140V156L156 144L172 156V185')) + paint(YE, ar(100, 154, 6, 6) + ar(46, 154, 6, 6) + ar(152, 160, 6, 6)), 'chalk', WH, { size: THIN })
    ]));
  }
  {
    const city = [[20, 26, 70], [48, 20, 96], [70, 30, 60], [102, 22, 110], [126, 28, 76], [156, 26, 90]];
    P.push(L('ps-city', 'ps-chalk', 2, 'Night city', '🌃', 'black', CHK, 'At night you only see the lights. Use just a few colors and let the black paper do the rest.', [
      S('Pick Chalk and white. Draw a row of tall and short buildings along the bottom.', DARK + FR + stroke(WH, skyline(170, city)), 'chalk', WH, { size: THIN }),
      S('Pick yellow. Fill in lots of little window squares. Leave some dark: people are asleep!', paint(YE, windows(city, 170, i => i % 3 !== 1)), 'chalk', YE, { size: THIN }),
      S('Draw a big round moon and color it light yellow.', fill(LY, C(150, 44, 16)) + C(150, 44, 16), 'chalk', LY, { size: MED }),
      S('Pick the Smudge finger. Rub around the moon to make a glow.', guide(C(150, 44, 24)), 'smudge', LY),
      S('Pick Chalk and light blue. Draw wavy water under the city with broken reflection lines.', stroke(LB, wavy(15, 176, 185, 2, 8)) + stroke(YE, ap('M58 178v6M110 178v6M134 178v6')), 'chalk', LB, { size: THIN }),
      S('Tap tiny white stars in the sky, and one red light on top of the tallest building.', dots(WH, scatter(29, 14, 18, 18, 130, 60), 1.3) + dots(RD, [[113, 56, 2.5]]), 'chalk', WH, { size: THIN })
    ]));
  }
  {
    const bell = 'M60 90Q60 40 100 40Q140 40 140 90Q130 84 120 90Q110 84 100 90Q90 84 80 90Q70 84 60 90Z';
    P.push(L('ps-jelly', 'ps-chalk', 2, 'Glowing jellyfish', '🪼', 'black', CHK, 'Deep sea animals make their own light. Smudged chalk on black is perfect for glowing things.', [
      S('Pick Chalk and pink. Draw a round dome shape with a wavy bottom edge.', DARK + FR + stroke(PK, ap(bell)), 'chalk', PK, { size: MED }),
      S('Color the dome softly, pressing lightly. Add lines from the top to the bottom.', fill(PK, ap(bell), 0.55) + stroke(MG, ap('M80 50Q76 70 80 88M100 42V88M120 50Q124 70 120 88')), 'chalk', PK, { size: MED }),
      S('Pick purple. Draw long wavy tentacles hanging down.', stroke(PU, ap('M70 90q-8 20 0 40t0 40M88 90q8 20 0 40t0 40M112 90q-8 20 0 40t0 40M130 90q8 20 0 40t0 40')), 'chalk', PU, { size: THIN }),
      S('Pick the Smudge finger. Rub the dome so it glows, and rub a soft halo around it.', guide(C(100, 66, 50)), 'smudge', PK),
      S('Pick Chalk and light blue. Draw bubbles floating up.', stroke(LB, C(40, 60, 6) + C(30, 40, 4) + C(156, 120, 7) + C(166, 100, 4)), 'chalk', LB, { size: THIN }),
      S('Pick Glitter and white. Add sparkles inside the dome and along the tentacles.', dots(WH, [[90, 60], [110, 70], [96, 76], [70, 140], [130, 150], [88, 160]], 1.8), 'glitter', WH, { size: THIN })
    ]));
  }
  {
    P.push(L('ps-aurora', 'ps-chalk', 3, 'Northern lights', '🌠', 'black', CHK, 'The northern lights move like curtains in the sky. Smudge upward to make them shimmer.', [
      S('Pick Chalk and green. Draw a long wavy ribbon across the sky.', DARK + FR + stroke(GR, ap('M15 90Q50 50 90 80T185 60')), 'chalk', GR, { size: THICK }),
      S('Draw short lines going up from the ribbon, like a curtain.', stroke(LG, ap(Array.from({ length: 16 }, (_, i) => { const x = 20 + i * 10.5, y = 80 - 14 * Math.sin(i * 0.7); return `M${f1(x)} ${f1(y)}v-${18 + (i % 3) * 8}`; }).join(''))), 'chalk', LG, { size: THIN }),
      S('Pick purple and light blue. Add a second ribbon higher up.', stroke(PU, ap('M15 50Q60 30 100 50T185 34')) + stroke(LB, ap('M30 44Q70 26 110 44')), 'chalk', PU, { size: MED }),
      S('Pick the Smudge finger. Rub upward from each ribbon so the light fades into the sky.', guide(ap('M40 84v-30M80 80v-30M120 72v-30M160 64v-30')), 'smudge', GR),
      S('Pick Chalk and white. Draw snowy hills along the bottom and color them in.', fill(WH, ap('M15 185V160Q60 140 100 158Q140 146 185 156V185Z'), 0.9) + ap('M15 160Q60 140 100 158Q140 146 185 156'), 'chalk', WH, { size: THICK }),
      S('Draw dark pine trees with green chalk outlines, and tap tiny stars.', stroke(DG, pine(50, 166, 30) + pine(150, 162, 34)) + dots(WH, scatter(37, 12, 18, 18, 182, 120), 1.2), 'chalk', DG, { size: THIN })
    ]));
  }
  {
    const owl = 'M84 150Q70 120 80 96Q84 84 92 82L88 70L98 78Q100 77 102 78L112 70L108 82Q116 84 120 96Q130 120 116 150Z';
    P.push(L('ps-owlmoon', 'ps-chalk', 4, 'Owl in the moonlight', '🦉', 'black', CHK, 'A silhouette is a dark shape against light. The owl stays black paper, and the moon makes it stand out.', [
      S('Pick Chalk and light yellow. Draw a huge moon in the middle and color it, pressing hard.', DARK + FR + fill(LY, C(100, 100, 58), 0.9) + C(100, 100, 58), 'chalk', LY, { size: THICK }),
      S('Pick white. Add a lighter center and a few grey crater circles.', fill(WH, C(92, 92, 30), 0.6) + stroke(GY, C(120, 80, 8) + C(76, 120, 6) + C(124, 124, 5)), 'chalk', WH, { size: MED }),
      S('Pick the Smudge finger. Rub around the edge of the moon for a big soft glow.', guide(C(100, 100, 70)), 'smudge', LY),
      S('Pick Chalk and brown. Draw a branch across the bottom of the moon.', stroke(BR, ap('M15 156Q80 144 185 150M140 150l20 -14')), 'chalk', BR, { size: THICK }),
      S('Pick black chalk. Draw the owl shape sitting on the branch and fill it in dark, so it looks like a shadow against the moon.', fill('#1F2027', ap(owl)) + stroke(BK, ap(owl)), 'chalk', BK, { size: MED }),
      S('Pick yellow. Two round glowing eyes and a tiny beak. Then white feather lines on the owl’s edge.', paint(YE, C(93, 96, 5) + C(107, 96, 5)) + paint(OR, apg('100,100 97,106 103,106')) + stroke(GY, ap('M84 120q4 4 0 8M116 120q-4 4 0 8M88 136q4 4 0 8M112 136q-4 4 0 8')), 'chalk', YE, { size: THIN }),
      S('Tap tiny stars around the moon. Sign your name in white chalk!', dots(WH, scatter(43, 14, 18, 18, 182, 60, (x, y) => Math.hypot(x - 100, y - 100) > 66), 1.3), 'chalk', WH, { size: THIN })
    ]));
  }

  /* ================= ✒️ Ink and wash (watercolor paper) ================= */
  {
    P.push(L('ps-blot', 'ps-ink', 1, 'Ink blot monsters', '👾', 'wc', INK, 'Artists used to look at ink blots and imagine what they could be. Every blob can be a monster!', [
      S('Pick Watercolor and purple, thick size. Make a big wobbly blob. Any shape!', FR + fill(PU, ap('M40 70Q50 40 80 50Q100 30 110 60Q120 90 90 100Q50 110 40 70Z'), 0.6), 'watercolor', PU, { size: THICK }),
      S('Make a green blob and an orange blob somewhere else.', fill(GR, ap('M120 110Q150 96 168 120Q176 150 150 160Q120 166 116 140Q110 122 120 110Z'), 0.6) + fill(OR, ap('M40 140Q60 120 80 140Q90 166 64 172Q36 170 40 140Z'), 0.6), 'watercolor', GR, { size: THICK }),
      S('Look at your blobs while they dry. What could they be? Pick the Ink pen.', guide(C(75, 72, 40) + C(145, 136, 32) + C(62, 154, 26)), 'ink', DB, { size: THIN }),
      S('Give each blob eyes! One eye, two eyes, or five eyes. It is your monster.', paint(WH, C(70, 66, 8) + C(92, 62, 6) + C(140, 126, 7) + C(156, 128, 7) + C(62, 148, 7)) + C(70, 66, 8) + C(92, 62, 6) + C(140, 126, 7) + C(156, 128, 7) + C(62, 148, 7) + dots(DB, [[70, 66, 3], [92, 62, 2.5], [140, 126, 3], [156, 128, 3], [62, 148, 3]]), 'ink', DB, { size: THIN }),
      S('Draw mouths with teeth, and legs, arms or horns with the ink pen.', ap('M62 86q14 8 26 0M66 86l3 5l3 -5l3 5l3 -5M136 144q10 6 20 0M56 164q8 -4 14 0') + ap('M56 100l-6 16M90 102l4 16M126 160l-4 12M160 156l4 12M50 50l-8 -12M104 44l6 -12'), 'ink', DB, { size: THIN }),
      S('Pick Glitter. Give your favourite monster something sparkly!', paint(YE, star(104, 40, 7)), 'glitter', YE, { size: MED })
    ]));
  }
  {
    const seg = (x, y0, y1) => { let s = ''; for (let y = y0; y > y1; y -= 30) s += ap(`M${x} ${y}V${y - 26}`) + al(x - 4, y - 28, x + 4, y - 28); return s; };
    P.push(L('ps-bamboo', 'ps-ink', 2, 'Bamboo in the wind', '🎋', 'wc', INK, 'In Chinese brush painting each stalk is painted in sections, with a little gap at each joint. Paint with your whole arm!', [
      S('Pick the Ink pen and dark blue, thick size. Paint a stalk from the bottom up, in sections with a small gap.', FR + stroke(DB, seg(80, 184, 30)), 'ink', DB, { size: THICK }),
      S('Paint a little line across each gap. That is the bamboo joint.', ap('M74 152h12M74 122h12M74 92h12M74 62h12'), 'ink', DB, { size: THIN }),
      S('Paint a thinner stalk next to it, leaning a little.', stroke(DB, ap('M120 184L124 150M125 146L129 112M130 108L134 74')), 'ink', DB, { size: MED }),
      S('Leaves: press down, then lift as you pull, so each leaf ends in a point. Make groups of 3.', paint(DB, leaf(84, 90, 40, -20) + leaf(84, 92, 36, 10) + leaf(84, 94, 30, 35) + leaf(130, 110, 36, -150) + leaf(130, 112, 30, 170) + leaf(80, 60, 34, -160)), 'ink', DB, { size: MED }),
      S('Pick Watercolor and grey. Paint a pale stalk behind, far away, for depth.', fill(GY, ap('M40 184V40H46V184Z'), 0.45) + fill(GY, leaf(46, 70, 30, -20), 0.4), 'watercolor', GY, { size: MED }),
      S('Pick red, thin size. Paint a small square stamp in the corner, like a real artist’s seal.', fill(RD, ar(158, 158, 16, 16, 2)) + ar(158, 158, 16, 16, 2), 'round', RD, { size: THIN })
    ]));
  }
  {
    const cat = 'M70 170Q60 130 72 106Q66 86 72 66L64 44L84 58Q100 52 116 58L136 44L128 66Q134 86 128 106Q140 130 130 170Z';
    P.push(L('ps-cat', 'ps-ink', 2, 'Ink and wash cat', '🐱', 'wc', INK, 'Ink first, then wash. The ink line stays crisp and the wash makes it soft. Watercolor does not need to stay in the lines!', [
      S('Pick the Pencil. Draw a sitting cat: a round head with pointy ears on a pear-shaped body.', FR + ap(cat), 'pencil', DB, { size: THIN }),
      S('Pick the Ink pen. Go over your lines in ink, with one smooth stroke if you can.', stroke(DB, ap(cat)) + ap('M130 160q30 0 26 -30q-2 -16 10 -18'), 'ink', DB, { size: MED }),
      S('Draw the face: eyes, a little nose, a mouth and whiskers.', ap('M84 80q6 -4 10 0M106 80q6 -4 10 0M98 90h4l-2 3zM100 93q-4 6 -8 2M100 93q4 6 8 2M70 90h18M70 96h18M112 90h18M112 96h18'), 'ink', DB, { size: THIN }),
      S('Pick Watercolor and orange. Wash color over the cat. Going outside the line is fine!', fill(OR, ap(cat), 0.45) + fill(OR, ap('M60 120Q100 100 140 130V170H64Z'), 0.2), 'watercolor', OR, { size: THICK }),
      S('While it is wet, drop darker brown stripes on the back and tail.', stroke(BR, ap('M76 120q8 -4 14 2M110 120q8 -4 14 2M76 140q10 -4 16 2M108 140q10 -4 16 2M146 136l8 -4M150 120l8 -2')), 'watercolor', BR, { size: MED }),
      S('Pick light blue. Wash a soft shadow on the ground beside the cat.', fill(LB, E(100, 172, 54, 8), 0.5), 'watercolor', LB, { size: THICK })
    ]));
  }
  {
    P.push(L('ps-inktree', 'ps-ink', 3, 'Ink tree in the wind', '🌳', 'wc', INK, 'A branch gets thinner every time it splits. Let the wind bend every branch the same way!', [
      S('Pick the Ink pen and brown, thick size. Paint a trunk leaning a little, wide at the bottom.', FR + stroke(BR, ap('M86 184Q90 140 100 110')), 'ink', BR, { size: THICK }),
      S('Medium size: split it into two big branches, bending to the right like the wind.', stroke(BR, ap('M100 110Q110 80 140 64M100 112Q86 84 92 56')), 'ink', BR, { size: MED }),
      S('Thin size: split each branch again and again into twigs.', ap('M140 64l20 -6M140 64l10 -18M122 76l14 -20M92 56l-4 -20M92 56l20 -14M94 70l-18 -10M150 60l16 4'), 'ink', BR, { size: THIN }),
      S('Pick Watercolor and green. Dab soft round clouds of leaves around the twigs.', paint(GR, og(0.5, C(140, 52, 22) + C(100, 44, 22) + C(76, 64, 16) + C(160, 74, 14))), 'watercolor', GR, { size: THICK }),
      S('Drop yellow-green into the top of each leaf cloud while it is wet, where the sun hits.', paint(LG, og(0.5, C(134, 42, 10) + C(96, 34, 10))), 'watercolor', LG, { size: MED }),
      S('Paint the ground with a pale brown wash, and some leaves blowing away with the ink pen.', fill(BR, ap('M15 185V176Q80 168 185 178V185Z'), 0.35) + paint(GR, leaf(166, 110, 10, 20) + leaf(150, 130, 10, -20) + leaf(172, 140, 9, 40)), 'watercolor', BR, { size: MED })
    ]));
  }
  {
    const head = E(100, 86, 40, 52);
    P.push(L('ps-portrait', 'ps-ink', 3, 'Simple ink portrait', '🙂', 'wc', INK, 'Eyes sit halfway down the head. Most people draw them too high: check with the guide line!', [
      S('Pick the Pencil. Draw an egg-shaped head and a line halfway down for the eyes, and one down the middle.', FR + head + guide(al(60, 86, 140, 86) + al(100, 34, 100, 138) + al(70, 108, 130, 108) + al(78, 122, 122, 122)), 'pencil', DB, { size: THIN }),
      S('Pick the Ink pen. Draw almond eyes on the eye line, with round pupils.', ap('M74 86q10 -8 20 0q-10 6 -20 0M106 86q10 -8 20 0q-10 6 -20 0') + dots(DB, [[84, 85, 3], [116, 85, 3]]), 'ink', DB, { size: THIN }),
      S('Draw the nose on the next line and the mouth on the lowest line. Add eyebrows.', ap('M100 96q-6 10 -2 12q4 2 8 0M86 122q14 8 28 0M72 76q10 -6 22 -2M106 74q12 -4 22 2'), 'ink', DB, { size: THIN }),
      S('Draw ears between the eye and nose lines, a neck, and shoulders.', ap('M60 84q-8 10 2 22M140 84q8 10 -2 22M86 134V154M114 134V154M86 154Q50 158 40 185M114 154Q150 158 160 185'), 'ink', DB, { size: MED }),
      S('Draw the hair with lots of flowing ink lines, starting at the parting.', stroke(BR, ap('M100 34Q60 34 58 84M100 34Q140 34 142 84M100 34Q76 44 66 70M100 34Q124 44 134 70')), 'ink', BR, { size: MED }),
      S('Erase the guides. Pick Watercolor. Wash the skin with a light peach color.', fill(PE, head, 0.6) + fill(PE, ar(86, 134, 28, 20), 0.6), 'watercolor', PE, { size: THICK, clear: true }),
      S('Add pink on the cheeks while it is wet, and wash the shirt any color you like.', paint(PK, og(0.5, C(76, 108, 8) + C(124, 108, 8))) + fill(BL, ap('M86 154Q50 158 40 185H160Q150 158 114 154Q100 164 86 154Z'), 0.5), 'watercolor', PK, { size: MED })
    ]));
  }
  {
    P.push(L('ps-street', 'ps-ink', 4, 'Ink and wash street sketch', '🏘️', 'wc', INK, 'Urban sketchers draw outside, fast. The wash is loose and does not have to fill the lines: that is the style!', [
      S('Pick the Pencil. Draw a light line across for the eyes level, and a dot on it. Everything points to that dot!', FR + guide(al(15, 90, 185, 90)) + C(120, 90, 2), 'pencil', DB, { size: THIN }),
      S('Pick the Ink pen. Draw the fronts of two houses on the left, with roofs.', ap('M20 160V80L44 60L68 80V160M68 160V92L90 76L110 92V160') + al(20, 80, 68, 80) + al(68, 92, 110, 92), 'ink', DB, { size: THIN }),
      S('Draw the road edges going to the dot, and a lamp post on the right.', ap('M15 172L120 90M185 176L120 90M150 170V100M144 100h12') + guide(al(110, 92, 120, 90) + al(68, 80, 120, 90)), 'ink', DB, { size: THIN }),
      S('Add windows, doors and a few quick lines for bricks. Do not draw every brick!', ar(28, 96, 12, 14) + ar(48, 96, 12, 14) + ar(38, 132, 14, 28) + ar(78, 104, 10, 12) + ar(94, 104, 10, 12) + ar(84, 134, 12, 26) + ap('M24 120h10M56 124h8M74 128h8'), 'ink', DB, { size: THIN }),
      S('Pick Watercolor. Wash the houses red and yellow, loosely. Leave white gaps!', fill(RD, ap('M20 160V80L44 60L68 80V160Z'), 0.35) + fill(YE, ap('M68 160V92L90 76L110 92V160Z'), 0.45), 'watercolor', RD, { size: THICK }),
      S('Wash the sky light blue and the road grey, with quick strokes.', band(LB, 15, 50, 0.35) + fill(GY, ap('M15 172L120 90L185 176V185H15Z'), 0.35), 'watercolor', LB, { size: THICK }),
      S('Pick the Ink pen. Add a few people and a bird. Little dashes are enough!', ap('M126 130v12M126 128a2 2 0 1 0 0.1 0M134 136v10M134 134a2 2 0 1 0 0.1 0M160 40q4 -4 8 0q4 -4 8 0'), 'ink', DB, { size: THIN })
    ]));
  }

  /* ================= 💨 Spray and stencil ================= */
  {
    P.push(L('ps-sgalaxy', 'ps-spray', 1, 'Spray galaxy', '🌌', 'black', SPR, 'Holding the spray still makes a bright spot. Moving fast makes a soft mist.', [
      S('Pick the Spray can and purple, thick size. Hold still in a few places to make glowing clouds.', DARK + FR + paint(PU, og(0.6, E(80, 90, 50, 26, -20))), 'spray', PU, { size: THICK }),
      S('Pick blue. Spray a long swirl through the purple.', paint(BL, og(0.5, E(110, 110, 60, 18, -20))) + guide(spiral(100, 100, 60, 0.9)), 'spray', BL, { size: THICK }),
      S('Pick pink. Spray a brighter middle.', paint(PK, og(0.6, C(96, 100, 14))), 'spray', PK, { size: MED }),
      S('Pick white, thin size. Tap many tiny dots for far away stars.', dots(WH, scatter(53, 30, 18, 18, 182, 182), 1.2), 'spray', WH, { size: THIN }),
      S('Pick Stamps and white. Stamp a few big stars.', paint(WH, star(40, 40, 8) + star(160, 150, 10) + star(150, 40, 6)), 'stamps', WH, { size: MED }),
      S('Pick Glitter and yellow. Draw a shooting star zooming across.', '<path d="M30 160 L110 120" style="stroke:#FFE07A;stroke-dasharray:3 5"/>' + paint(YE, star(114, 118, 8)), 'glitter', YE, { size: MED })
    ]));
  }
  {
    const spots = [[58, 58, -40], [142, 60, -140], [58, 142, 40], [142, 142, 140]];
    P.push(L('ps-stencil', 'ps-spray', 1, 'Leaf stencil prints', '🍃', 'plain', SPR, 'A stencil blocks the paint. Lay a real leaf on paper, flick paint around it, lift it off: a white leaf appears!', [
      S('Pick Stamps and the leaf, thick size, green. Stamp a leaf in each corner.', FR + paint(GR, spots.map(([x, y, a]) => leaf(...leafC(x, y, 58, a))).join('')), 'stamps', GR, { size: THICK }),
      S('Pick the Spray can and orange. Spray around each leaf, like you are spraying around a real leaf.', paint(OR, og(0.4, spots.map(([x, y]) => C(x, y, 30)).join(''))), 'spray', OR, { size: THICK }),
      S('Pick yellow. Spray some yellow in the gaps between.', paint(YE, og(0.4, C(100, 100, 30) + C(100, 30, 16) + C(100, 170, 16))), 'spray', YE, { size: THICK }),
      S('Pick red, thin size. Spray a soft edge around the whole picture.', stroke(RD, ar(20, 20, 160, 160, 10)), 'spray', RD, { size: THIN }),
      S('Pick the Ink pen. Draw veins in each leaf.', spots.map(([x, y, a]) => vein(...leafC(x, y, 58, a))).join(''), 'ink', DG, { size: THIN })
    ]));
  }
  {
    const city = [[15, 26, 40], [41, 18, 64], [59, 30, 50], [89, 16, 86], [105, 28, 56], [133, 20, 72], [153, 32, 46]];
    P.push(L('ps-skyline', 'ps-spray', 2, 'Sunset skyline', '🌆', 'plain', SPR, 'Spray colors blend into each other by themselves. Overlap them a little!', [
      S('Pick the Spray can and yellow, thick size. Spray a band across the bottom half.', FR + band(YE, 110, 50, 0.6), 'spray', YE, { size: THICK }),
      S('Pick orange. Spray above the yellow, overlapping a little.', band(OR, 76, 40, 0.6), 'spray', OR, { size: THICK }),
      S('Pick pink, then purple, going up to the top.', band(PK, 44, 36, 0.6) + band(PU, 15, 34, 0.6), 'spray', PK, { size: THICK }),
      S('Pick the Smooth pen and dark blue. Paint the city as one dark shape along the bottom.', paint(DB, ap(city.map(([x, w, h]) => `M${x} 185V${185 - h}H${x + w}V185Z`).join(''))), 'round', DB, { size: THICK }),
      S('Pick yellow, thin size. Tap a few lit windows in the dark buildings.', paint(YE, ar(48, 136, 4, 5) + ar(96, 116, 4, 5) + ar(96, 140, 4, 5) + ar(140, 128, 4, 5) + ar(66, 150, 4, 5)), 'round', YE, { size: THIN }),
      S('Pick the Spray can and white, thin. Mist a few stars in the purple.', dots(WH, scatter(59, 8, 20, 18, 180, 44), 1.2), 'spray', WH, { size: THIN })
    ]));
  }
  {
    const word = 'ART';
    P.push(L('ps-graffiti', 'ps-spray', 2, 'Bubble-letter name', '🔤', 'plain', SPR, 'Street artists plan their letters on paper first. Only paint on paper, or walls you are allowed to, like a school mural!', [
      S('Pick the Pencil. Write your name in big fat bubble letters, like ART here. Make the letters touch.', FR + atext(100, 120, word, 64, 'class="tx" letter-spacing="-4"'), 'pencil', DB, { size: THIN }),
      S('Pick the Spray can and blue. Spray a cloud shape behind the letters.', paint(LB, og(0.6, ap('M24 120Q20 70 60 66Q80 40 110 56Q150 44 166 76Q186 100 170 128Q150 150 100 144Q40 150 24 120Z'))), 'spray', LB, { size: THICK }),
      S('Pick pink. Spray inside the letters. Fade to yellow at the bottom of each letter.', paint(PK, atext(100, 120, word, 64, 'letter-spacing="-4"')) + paint(YE, og(0.6, ar(30, 108, 140, 14))), 'spray', PK, { size: MED }),
      S('Pick the Marker and dark blue, thick. Go round the outside of every letter.', stroke(DB, atext(100, 120, word, 64, 'class="tx" letter-spacing="-4"')), 'marker', DB, { size: MED }),
      S('Add a 3D shadow: a purple edge on the bottom right of each letter.', stroke(PU, atext(103, 123, word, 64, 'class="tx" letter-spacing="-4"')), 'marker', PU, { size: THIN }),
      S('Pick the Smooth pen and white. Add shine lines on the top left of each letter, and some stars.', stroke(WH, ap('M50 86q4 -6 10 -6M96 86q4 -6 10 -6M140 86q4 -6 10 -6')) + paint(YE, star(30, 40, 8) + star(170, 150, 8)), 'round', WH, { size: THIN })
    ]));
  }
  {
    const rk = 'M100 34Q124 60 122 110H78Q76 60 100 34Z';
    P.push(L('ps-rocket', 'ps-spray', 3, 'Stencil rocket', '🚀', 'black', SPR, 'This is a reverse stencil: you spray around the shape, and the shape stays dark and sharp.', [
      S('Pick the Pencil and white. Draw a rocket in the middle: a pointy body, two fins and a round window.', DARK + FR + stroke(WH, ap(rk) + ap('M78 96L60 124L80 112M122 96L140 124L120 112') + C(100, 70, 9)), 'pencil', WH, { size: THIN }),
      S('Pick the Spray can and light blue. Spray all around the rocket, close to its edge. Keep the rocket dark!', paint(LB, og(0.4, ap('M100 20Q150 60 140 130H60Q50 60 100 20Z'))) + guide(ap(rk)), 'spray', LB, { size: THICK }),
      S('Pick Thick paint and red. Paint the fins and the nose.', fill(RD, ap('M78 96L60 124L80 112Z') + ap('M122 96L140 124L120 112Z') + ap('M100 34Q110 44 114 56H86Q90 44 100 34Z')), 'oil', RD, { size: MED }),
      S('Paint the body white and the window light blue.', fill(WH, ap('M86 56H114Q124 80 122 110H78Q76 80 86 56Z'), 0.9) + fill(LB, C(100, 70, 9)), 'oil', WH, { size: MED }),
      S('Pick the Spray can, orange then yellow. Spray a fiery flame under the rocket.', paint(OR, og(0.7, ap('M80 112Q100 180 120 112Z'))) + paint(YE, og(0.8, ap('M90 112Q100 150 110 112Z'))), 'spray', OR, { size: THICK }),
      S('Pick white, thin size. Spray tiny stars. Then Glitter on the flame!', dots(WH, scatter(61, 18, 18, 18, 182, 182, (x, y) => Math.abs(x - 100) > 44), 1.2) + dots(YE, [[100, 130], [94, 140], [106, 146]], 2), 'spray', WH, { size: THIN })
    ]));
  }
  {
    P.push(L('ps-mural', 'ps-spray', 4, 'Spray mural: under the sea', '🐙', 'plain', SPR, 'A mural is a giant painting on a wall. Big shapes first, details last, so it reads from far away.', [
      S('Pick the Spray can and light blue, thick. Spray the whole top half. Then blue below it, and navy at the bottom.', FR + band(LB, 15, 60, 0.5) + band(BL, 75, 60, 0.5) + band(NV, 135, 50, 0.6), 'spray', LB, { size: THICK }),
      S('Pick green. Spray tall wavy seaweed from the bottom up.', stroke(GR, ap('M30 185q-10 -30 0 -60t0 -50M46 185q10 -30 0 -50M160 185q-10 -30 0 -60t0 -40M172 185q10 -24 0 -44')), 'spray', GR, { size: MED }),
      S('Pick the Smooth pen and orange, thick. Paint a round octopus head and 6 curly arms.', fill(OR, E(100, 90, 26, 24)) + stroke(OR, ap('M80 106q-10 30 -30 30M88 112q-6 34 -20 46M98 114q0 40 -10 52M104 114q4 40 14 52M112 112q10 34 22 44M120 106q14 26 34 26')), 'round', OR, { size: THICK }),
      S('Pick the Marker and dark blue. Outline the octopus, and add big eyes and a smile.', stroke(DB, E(100, 90, 26, 24)) + paint(WH, C(90, 88, 7) + C(110, 88, 7)) + dots(DB, [[90, 89, 3], [110, 89, 3]]) + ap('M92 100q8 6 16 0'), 'marker', DB, { size: THIN }),
      S('Pick Stamps and the star. Stamp yellow starfish on the sea floor.', paint(YE, star(60, 172, 9) + star(140, 170, 8)), 'stamps', YE, { size: MED }),
      S('Pick the Spray can and white, thin. Spray bubbles rising, and add Glitter on the bubbles.', stroke(WH, C(130, 60, 5) + C(136, 44, 4) + C(132, 30, 3) + C(64, 70, 4) + C(60, 56, 3)), 'spray', WH, { size: THIN }),
      S('Sign your mural with a tag: your initials in bubble letters in the corner!', atext(160, 40, 'ME', 18, 'class="tx"'), 'marker', PU, { size: THIN })
    ]));
  }

  /* ================= 🖼️ Famous art ================= */
  {
    const cells = [[20, 20], [74, 20], [128, 20], [20, 74], [74, 74], [128, 74], [20, 128], [74, 128], [128, 128]];
    const pal = [[YE, RD, BL], [PU, OR, YE], [GR, PK, DB], [RD, LB, YE], [OR, PU, GR], [BL, YE, RD], [PK, GR, OR], [LB, RD, PU], [YE, BL, PK]];
    P.push(L('ps-kandinsky', 'ps-famous', 1, 'Circles like Kandinsky', '⭕', 'canvas', OIL + '. Kandinsky painted "Squares with Concentric Circles" in 1913.', 'Wassily Kandinsky said colors are like music. Which colors look loud? Which look quiet?', [
      S('Pick the Pencil. Draw a grid of 9 squares, 3 across and 3 down.', FR + cells.map(([x, y]) => ar(x, y, 52, 52)).join(''), 'pencil', DB, { size: THIN }),
      S('Pick Thick paint. Fill each square with a different background color.', cells.map(([x, y], i) => fill(pal[i][0], ar(x, y, 52, 52), 0.85)).join(''), 'oil', YE, { size: THICK }),
      S('In each square paint a big circle in a new color.', cells.map(([x, y], i) => fill(pal[i][1], C(x + 26, y + 26, 19))).join(''), 'oil', RD, { size: THICK }),
      S('Inside each circle paint a smaller circle, then a smaller one. Like rings in a tree!', cells.map(([x, y], i) => fill(pal[i][2], C(x + 26, y + 26, 12)) + fill(pal[(i + 4) % 9][0], C(x + 26, y + 26, 5))).join(''), 'oil', BL, { size: MED }),
      S('Pick the Crayon. Draw wobbly rings around the circles: these make them buzz like music!', stroke(DB, cells.map(([x, y]) => C(x + 26, y + 26, 22)).join('')), 'crayon', DB, { size: THIN })
    ]));
  }
  {
    const sw = (x, y, s, a) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})">${ap('M0 0Q-10 -20 0 -40Q10 -30 4 -20Q16 -14 8 -4Q14 4 0 0Z')}</g>`;
    P.push(L('ps-matisse', 'ps-famous', 1, 'Cut-out shapes like Matisse', '✂️', 'plain', 'Colored paper, safety scissors and a glue stick. Or the pad!', 'When Henri Matisse could not stand to paint, he "drew with scissors", cutting bright paper shapes like seaweed and stars.', [
      S('Pick the Smooth pen and blue, thick. Paint a big blue background block in the middle.', FR + fill(BL, ar(30, 30, 140, 140, 4)), 'round', BL, { size: THICK }),
      S('Pick white. Paint a wiggly seaweed shape, like you cut it from paper.', fill(WH, `<g transform="translate(70 150) scale(2)">${ap('M0 0Q-10 -20 0 -40Q10 -30 4 -20Q16 -14 8 -4Q14 4 0 0Z')}</g>`) + sw(70, 150, 2, 0), 'round', WH, { size: MED }),
      S('Pick pink. Paint a curly coral shape on the other side.', fill(PK, ap('M130 160Q120 130 134 116Q126 100 140 88Q152 100 146 116Q160 128 150 160Z')), 'round', PK, { size: MED }),
      S('Pick yellow. Paint some star shapes and a little spiral.', paint(YE, star(140, 56, 12) + star(60, 60, 9)) + stroke(YE, spiral(100, 90, 12, 1.5)), 'round', YE, { size: MED }),
      S('Pick orange. Paint small dots and leaf shapes around the edge, outside the blue.', paint(OR, leaf(18, 40, 18, 80) + leaf(178, 120, 18, 100) + C(24, 160, 5) + C(176, 30, 5) + C(100, 178, 5)), 'round', OR, { size: THIN })
    ]));
  }
  {
    P.push(L('ps-mondrian', 'ps-famous', 1, 'Lines and boxes like Mondrian', '🟥', 'plain', 'A ruler, a black marker and red, yellow and blue paint', 'Piet Mondrian used only straight lines, the three primary colors, white and black. Simple can be beautiful!', [
      S('Pick the Smooth pen and black, medium. Paint two straight lines across the page.', FR + stroke(BK, al(15, 70, 185, 70) + al(15, 140, 185, 140)), 'round', BK, { size: MED }),
      S('Paint three straight lines up and down. Some can stop at a line instead of going all the way.', stroke(BK, al(60, 15, 60, 185) + al(130, 15, 130, 140) + al(160, 70, 160, 185)), 'round', BK, { size: MED }),
      S('Add one more short line to make a small box.', stroke(BK, al(130, 40, 185, 40)), 'round', BK, { size: MED }),
      S('Pick red. Fill one big box.', fill(RD, ar(60, 15, 70, 55)), 'round', RD, { size: THICK }),
      S('Pick yellow and fill a small box. Pick blue and fill one more.', fill(YE, ar(130, 15, 55, 25)) + fill(BL, ar(15, 140, 45, 45)), 'round', YE, { size: THICK }),
      S('Leave the other boxes white. Go over the lines once more so they are bold and black.', stroke(BK, al(15, 70, 185, 70) + al(15, 140, 185, 140) + al(60, 15, 60, 185) + al(130, 15, 130, 140) + al(160, 70, 160, 185) + al(130, 40, 185, 40)), 'round', BK, { size: MED })
    ]));
  }
  {
    P.push(L('ps-pollock', 'ps-famous', 1, 'Drip and splash like Pollock', '💦', 'canvas', 'Runny paint, a stick or old brush, and a big sheet of paper on the floor (outside is best!)', 'Jackson Pollock laid his canvas on the floor and dripped paint from above, dancing around it. It is all about movement!', [
      S('Pick the Smooth pen and black, thin size. Make long looping lines all over, without lifting.', FR + stroke(BK, ap('M20 40Q80 10 120 60T180 90Q120 130 60 100T30 170Q90 190 170 160')), 'round', BK, { size: THIN }),
      S('Pick white. Make more loops crossing the black ones.', stroke(WH, ap('M30 120Q70 60 110 120T170 60Q140 20 90 40T20 80')), 'round', WH, { size: THIN }),
      S('Pick the Spray can and yellow. Splatter here and there.', dots(YE, scatter(67, 22, 20, 20, 180, 180), 2), 'spray', YE, { size: MED }),
      S('Pick the Ink pen and red. Flick quick zigzags and drips.', stroke(RD, ap('M40 60l10 10l-6 8l12 6M140 120l8 12l-10 4l12 10M100 160l6 -10l6 10')), 'ink', RD, { size: MED }),
      S('Pick light blue, thin. One last set of loops. Stand back: it is full of energy!', stroke(LB, ap('M20 150Q60 120 100 150T180 130M50 30Q90 60 130 30')), 'round', LB, { size: THIN })
    ]));
  }
  {
    const vil = 'M15 185V160L30 150L45 160V156L60 146L75 156V160L92 148L108 160V156L122 148L136 156V185Z';
    const cyp = 'M40 185Q30 120 50 50Q60 100 64 140Q66 170 60 185Z';
    P.push(L('ps-starry', 'ps-famous', 2, 'Swirly starry sky like Van Gogh', '🌀', 'canvas', OIL + '. Vincent van Gogh painted "The Starry Night" in 1889.', 'Van Gogh made the sky move with swirling brush strokes. Every dab follows the swirl!', [
      S('Pick the Pencil. Draw a big swirl in the sky, a moon in the top right, and a little village at the bottom.', FR + spiral(96, 76, 28, 1.6) + C(156, 40, 14) + ap(vil), 'pencil', DB, { size: THIN }),
      S('Pick Thick paint and blue. Paint the sky with short dabs that follow the swirl.', fill(BL, ap('M15 15H185V150H15Z'), 0.5) + dabs(NV, Array.from({ length: 18 }, (_, i) => { const a = i * 0.7, r = 10 + i * 1.6; return [96 + r * Math.cos(a), 76 + r * Math.sin(a), a * 57 + 90]; }), 6, 3), 'oil', BL, { size: MED }),
      S('Pick light blue and white. Dab along the swirl lines, making them glow.', dabs(LB, Array.from({ length: 14 }, (_, i) => { const a = i * 0.8 + 0.4, r = 8 + i * 1.8; return [96 + r * Math.cos(a), 76 + r * Math.sin(a), a * 57 + 90]; }), 6, 3) + stroke(WH, spiral(96, 76, 28, 1.6)), 'oil', LB, { size: MED }),
      S('Pick yellow. Paint the moon and some big stars with rings of dabs around them.', fill(YE, C(156, 40, 12)) + paint(YE, petals(156, 40, 12, 18, 4, 2) + C(40, 40, 6) + petals(40, 40, 8, 11, 3, 1.5) + C(130, 110, 5) + petals(130, 110, 8, 10, 3, 1.5)), 'oil', YE, { size: MED }),
      S('Pick navy blue. Paint the village roofs, and yellow dots for windows.', fill(NV, ap(vil)) + dots(YE, [[30, 166], [60, 162], [92, 164], [122, 166]], 2.5), 'oil', NV, { size: MED }),
      S('Pick dark green. Paint a tall flame-shaped cypress tree on the left, with strokes going up.', fill(DG, ap(cyp)) + stroke(GR, ap('M46 170Q44 120 50 70M54 170Q56 130 54 100')), 'oil', DG, { size: THICK })
    ]));
  }
  {
    const pads = [[50, 70, 18], [130, 56, 14], [104, 120, 22], [40, 150, 16], [160, 140, 15]];
    const pad = ([x, y, r]) => { const c = Math.cos(0.3), sn = Math.sin(0.3); return ap(`M${x} ${y}L${f1(x + r * c)} ${f1(y - r * 0.5 * sn)}A${r} ${f1(r * 0.5)} 0 1 0 ${f1(x + r * c)} ${f1(y + r * 0.5 * sn)}Z`); };
    P.push(L('ps-lilies', 'ps-famous', 2, 'Water lilies like Monet', '🪷', 'canvas', OIL + '. Claude Monet painted his water lily pond about 250 times!', 'Monet painted light, not things. Up close it is just dabs; from far away it is a pond. Step back and look!', [
      S('Pick Thick paint and blue. Paint the whole pond with sideways dabs.', FR + fill(BL, ap('M15 15H185V185H15Z'), 0.45) + dabs(BL, scatter(71, 20, 20, 20, 180, 180).map(p => [p[0], p[1], 0]), 9, 3), 'oil', BL, { size: THICK }),
      S('Pick purple and light blue. Dab in the reflections of the sky and trees.', dabs(PU, scatter(73, 12, 20, 20, 180, 180).map(p => [p[0], p[1], 0]), 9, 3) + dabs(LB, scatter(79, 12, 20, 20, 180, 180).map(p => [p[0], p[1], 0]), 9, 3), 'oil', PU, { size: MED }),
      S('Pick green. Paint round lily pads, each with a little notch. Make far ones flatter.', paint(GR, pads.map(pad).join('')) + pads.map(pad).join(''), 'oil', GR, { size: MED }),
      S('Pick yellow-green. Dab light on the top of each pad.', dabs(LG, pads.map(([x, y, r]) => [x - r * 0.3, y - r * 0.2, 0, r * 0.4, 2.5])), 'oil', LG, { size: THIN }),
      S('Pick pink and white. Dab little flowers on some pads: a few petals pointing up.', paint(PK, [[50, 64], [104, 112], [160, 134]].map(([x, y]) => E(x - 4, y, 3, 6, -20) + E(x + 4, y, 3, 6, 20) + E(x, y - 2, 3, 7)).join('')) + dots(WH, [[50, 60, 1.5], [104, 108, 1.5]]), 'oil', PK, { size: THIN }),
      S('Pick the Smudge finger. Soften a few edges in the water so it looks shimmery.', guide(al(20, 100, 80, 100) + al(120, 90, 180, 90) + al(60, 170, 140, 170)), 'smudge', BL)
    ]));
  }
  {
    const pts = [];
    const r = rnd(83);
    for (let y = 20; y < 182; y += 7) for (let x = 20; x < 182; x += 7) { const jx = x + r() * 3, jy = y + r() * 3; pts.push([f1(jx), f1(jy)]); }
    const sky = pts.filter(([x, y]) => y < 110 && Math.hypot(x - 140, y - 50) > 18), sun = pts.filter(([x, y]) => Math.hypot(x - 140, y - 50) <= 18), hill = pts.filter(([x, y]) => y >= 110 && !(Math.abs(x - 60) < 6 && y < 150));
    P.push(L('ps-seurat', 'ps-famous', 3, 'Pointillism dots like Seurat', '🔵', 'plain', 'Felt pens or cotton buds and paint', 'Georges Seurat painted with tiny dots of pure color. Blue and yellow dots side by side look green from far away: your eyes mix them!', [
      S('Pick the Pencil. Draw a hill line, a sun circle and a lollipop tree.', FR + ap('M15 112Q100 92 185 116') + C(140, 50, 18) + al(60, 150, 60, 112) + C(60, 98, 16), 'pencil', DB, { size: THIN }),
      S('Pick the Smooth pen and yellow, thin size. Tap dots all over the sun. Tap, do not drag!', dots(YE, sun, 2.4), 'round', YE, { size: THIN }),
      S('Pick blue. Tap dots over the sky. Leave little gaps between the dots.', dots(BL, sky.filter((p, i) => i % 2 === 0), 2.2), 'round', BL, { size: THIN }),
      S('Pick light blue. Tap more dots between the blue ones. See it shimmer?', dots(LB, sky.filter((p, i) => i % 2 === 1), 2.2), 'round', LB, { size: THIN }),
      S('Hill: tap blue dots and yellow dots mixed together. From far away it looks green!', dots(BL, hill.filter((p, i) => i % 2 === 0), 2.2) + dots(YE, hill.filter((p, i) => i % 2 === 1), 2.2), 'round', BL, { size: THIN }),
      S('Tree: brown dots for the trunk, and green and red dots for leaves and apples.', dots(BR, [[60, 116], [60, 124], [60, 132], [60, 140], [60, 148]], 2.2) + dots(GR, scatter(89, 16, 46, 84, 74, 112, (x, y) => Math.hypot(x - 60, y - 98) < 14), 2.2) + dots(RD, [[54, 94], [66, 102], [58, 106]], 2.4), 'round', GR, { size: THIN }),
      S('Hold your painting far away, or walk back from the screen. The dots melt together!', '', 'round', GR, { size: THIN })
    ]));
  }
  {
    const pet = (a, len, w) => { const t = a * Math.PI / 180, ex = 100 + len * Math.cos(t), ey = 100 + len * Math.sin(t), nx = -Math.sin(t) * w, ny = Math.cos(t) * w;
      return ap(`M100 100C${f1(100 + nx * 0.4 + (ex - 100) * 0.2)} ${f1(100 + ny * 0.4 + (ey - 100) * 0.2)} ${f1(ex + nx)} ${f1(ey + ny)} ${f1(ex)} ${f1(ey)}C${f1(ex - nx)} ${f1(ey - ny)} ${f1(100 - nx * 0.4 + (ex - 100) * 0.2)} ${f1(100 - ny * 0.4 + (ey - 100) * 0.2)} 100 100Z`); };
    const petals6 = [0, 60, 120, 180, 240, 300].map(a => pet(a - 75, 92, 40)).join(''), inner = [30, 90, 150, 210, 270, 330].map(a => pet(a - 75, 52, 22)).join('');
    P.push(L('ps-okeeffe', 'ps-famous', 3, 'A giant flower like O’Keeffe', '🌺', 'wc', WC, 'Georgia O’Keeffe painted flowers so close-up and huge that you have to look at them. Fill the whole page!', [
      S('Pick the Pencil. Draw six huge petals from the middle, so big they nearly touch the edges!', FR + petals6 + C(100, 100, 10), 'pencil', DB, { size: THIN }),
      S('Draw six smaller petals in between, closer to the middle.', inner, 'pencil', DB, { size: THIN }),
      S('Pick Watercolor and pink. Paint the big petals, pale at the tips.', fill(PK, petals6, 0.45), 'watercolor', PK, { size: THICK }),
      S('Pick magenta. Paint the small petals darker, so the flower seems to fold in to the middle.', fill(MG, inner, 0.45), 'watercolor', MG, { size: MED }),
      S('Pick purple, thin size. Paint thin dark lines where the petals overlap.', stroke(PU, inner), 'watercolor', PU, { size: THIN }),
      S('Pick yellow. Paint the center, and tap tiny dots around it.', fill(YE, C(100, 100, 10)) + dots(YE, Array.from({ length: 10 }, (_, i) => [100 + 16 * Math.cos(i * 0.63), 100 + 16 * Math.sin(i * 0.63)]), 1.8), 'watercolor', YE, { size: MED }),
      S('Pick the Smudge finger. Soften the color from dark to light along each petal.', guide(ap('M90 90L40 70M110 90L150 50M110 110L160 150M90 110L60 160')), 'smudge', PK)
    ]));
  }
  {
    const wave = 'M15 150Q30 80 80 60Q120 46 140 70Q150 86 134 92Q126 80 116 86Q130 100 110 110Q90 120 80 150Q78 170 100 185H15Z';
    P.push(L('ps-hokusai', 'ps-famous', 4, 'The Great Wave like Hokusai', '🌊', 'wc', INK + '. Katsushika Hokusai made "The Great Wave" as a woodblock print around 1831.', 'Hokusai made the giant wave tower over tiny Mount Fuji. Big things close, small things far!', [
      S('Pick the Pencil. Draw a giant wave rising up on the left and curling over. Draw a tiny pointy mountain under it.', FR + ap(wave) + ap('M120 150L140 124L160 150Z'), 'pencil', DB, { size: THIN }),
      S('Pick the Ink pen and navy blue. Go over the wave line with bold ink.', stroke(NV, ap(wave)), 'ink', NV, { size: MED }),
      S('Draw claw-like fingers of foam along the top of the curl.', ap('M80 60q-4 -10 4 -12q-2 8 6 6M96 54q-2 -10 6 -10q-2 8 6 6M112 52q0 -10 8 -8q-4 6 4 8M126 58q4 -8 10 -4q-6 4 0 8M138 70q6 -4 10 2q-6 0 -4 6'), 'ink', NV, { size: THIN }),
      S('Pick Watercolor and blue. Wash the wave, darker inside the curl.', fill(BL, ap(wave), 0.55) + fill(NV, ap('M80 150Q90 120 110 110Q130 100 116 86Q100 96 92 120Q84 140 80 150Z'), 0.5), 'watercolor', BL, { size: THICK }),
      S('Wash the sky pale yellow-grey and the mountain light blue, with a white snowy tip.', fill(LY, ap('M15 15H185V150H160L140 124L120 150H90Q100 110 140 70Q120 46 80 60Q30 80 15 150Z'), 0.4) + fill(LB, ap('M120 150L140 124L160 150Z'), 0.6), 'watercolor', LY, { size: THICK }),
      S('Pick white. Tap foam dots falling like snow from the wave.', dots(WH, scatter(97, 20, 70, 40, 170, 120), 2) + stroke(GY, C(140, 60, 1)), 'watercolor', WH, { size: THIN }),
      S('Pick the Ink pen. Add little boats with tiny rowers in the trough of the wave.', ap('M40 168q30 10 60 0M48 164v-4M58 166v-4M68 166v-4M78 164v-4'), 'ink', NV, { size: THIN })
    ]));
  }

  /* ================= 🧩 Mixed media ================= */
  {
    P.push(L('ps-resist', 'ps-mixed', 1, 'Crayon resist rain', '☔', 'wc', 'White and colored crayons, watercolor paints and thick paper', 'Wax pushes watery paint away. Draw with crayon first, paint over it, and the crayon pops through!', [
      S('Pick the Crayon and white, thin size. Draw lots of raindrops and slanted rain lines. Press hard!', FR + stroke(WH, ap(Array.from({ length: 12 }, (_, i) => `M${20 + (i * 37) % 160} ${20 + (i * 53) % 140}l-6 14`).join(''))) + guide(ap(Array.from({ length: 12 }, (_, i) => `M${20 + (i * 37) % 160} ${20 + (i * 53) % 140}l-6 14`).join(''))), 'crayon', WH, { size: THIN }),
      S('Pick the Crayon and red. Draw an umbrella: a half circle with a scalloped bottom, and a hooked handle.', ap('M50 100A50 40 0 0 1 150 100Q137 90 125 100Q112 90 100 100Q87 90 75 100Q62 90 50 100M100 100V150q0 10 -10 10') + fill(RD, ap('M50 100A50 40 0 0 1 150 100Q137 90 125 100Q112 90 100 100Q87 90 75 100Q62 90 50 100Z')), 'crayon', RD, { size: MED }),
      S('Draw a yellow crayon puddle at the bottom.', fill(YE, E(100, 172, 40, 7), 0.8) + E(100, 172, 40, 7), 'crayon', YE, { size: MED }),
      S('Pick Watercolor and blue, thick. Paint over EVERYTHING. The crayon shows through!', wash(BL, 15, 185, 0.45), 'watercolor', BL, { size: THICK }),
      S('Drop purple into the top while it is wet, for a stormy sky.', band(PU, 15, 40, 0.45), 'watercolor', PU, { size: THICK })
    ]));
  }
  {
    const wingL = 'M98 100Q60 40 34 64Q24 90 62 100Q30 120 46 146Q70 150 98 110Z';
    const wingR = 'M102 100Q140 40 166 64Q176 90 138 100Q170 120 154 146Q130 150 102 110Z';
    P.push(L('ps-butterfly', 'ps-mixed', 2, 'Marker and watercolor butterfly', '🦋', 'wc', 'A black felt pen, watercolors, glitter glue', 'Tap 🦋 Mirror on the pad, and both wings paint themselves the same. Butterflies are symmetrical!', [
      S('Tap the 🦋 Mirror button. Pick the Marker and dark blue. Draw one wing: the other side copies it!', FR + ap(wingL) + ap(wingR) + guide(al(100, 20, 100, 180)), 'marker', DB, { size: THIN }),
      S('Draw a long body down the middle, a round head and two curly feelers.', E(100, 106, 4, 30) + C(100, 72, 6) + ap('M98 68q-6 -16 -16 -16M102 68q6 -16 16 -16'), 'marker', DB, { size: MED }),
      S('Draw circles and spots inside the wings.', C(62, 74, 10) + C(138, 74, 10) + C(66, 126, 8) + C(134, 126, 8), 'marker', DB, { size: THIN }),
      S('Pick Watercolor and orange. Wash the wings. The marker lines stay!', fill(OR, ap(wingL) + ap(wingR), 0.55), 'watercolor', OR, { size: THICK }),
      S('Drop yellow into the circles and purple at the wing tips while it is wet.', paint(YE, og(0.7, C(62, 74, 9) + C(138, 74, 9) + C(66, 126, 7) + C(134, 126, 7))) + paint(PU, og(0.5, C(36, 66, 8) + C(164, 66, 8))), 'watercolor', YE, { size: MED }),
      S('Pick Glitter. Add sparkle dots to the wing edges. Turn the mirror off when you finish!', dots(WH, [[40, 90], [160, 90], [50, 140], [150, 140], [80, 60], [120, 60]], 2), 'glitter', WH, { size: THIN })
    ]));
  }
  {
    P.push(L('ps-sea', 'ps-mixed', 2, 'Under the sea, mixed media', '🐟', 'wc', MIX, 'Mixed media means using more than one kind of art stuff in one picture. Each one does what it is best at!', [
      S('Pick Watercolor and blue, thick. Wash the whole page: light at the top, darker at the bottom.', FR + band(LB, 15, 70, 0.45) + band(BL, 85, 100, 0.5), 'watercolor', BL, { size: THICK }),
      S('Pick the Crayon and green. Draw wavy seaweed. Crayon gives it a bumpy texture.', stroke(GR, ap('M30 185q-8 -24 0 -48t0 -40M44 185q8 -20 0 -40M150 185q-8 -24 0 -48M166 185q8 -30 0 -60')), 'crayon', GR, { size: MED }),
      S('Pick the Marker and orange. Draw two fish, and color them in.', fill(OR, ap('M60 80Q80 64 100 80Q80 96 60 80Z') + ap('M100 80L112 70V90Z')) + ap('M60 80Q80 64 100 80Q80 96 60 80Z') + fill(YE, ap('M110 130Q126 118 142 130Q126 142 110 130Z') + ap('M110 130L98 122V138Z')), 'marker', OR, { size: MED }),
      S('Pick Stamps and the star. Stamp pink starfish on the sea floor.', paint(PK, star(80, 172, 9) + star(120, 176, 7)), 'stamps', PK, { size: MED }),
      S('Pick Chalk and white. Draw sand along the bottom and light rays from the top.', fill(LY, ap('M15 185V176Q100 166 185 178V185Z'), 0.8) + stroke(WH, ap('M60 15L80 80M110 15L120 70M150 15L150 60')), 'chalk', WH, { size: THIN }),
      S('Pick Glitter and white. Draw bubbles coming from the fish.', stroke(WH, C(56, 70, 3) + C(52, 58, 4) + C(108, 120, 3) + C(104, 106, 4)), 'glitter', WH, { size: THIN })
    ]));
  }
  {
    P.push(L('ps-dream', 'ps-mixed', 3, 'Dreamy rainbow sky', '🌈', 'plain', MIX, 'Soft and sharp together: smudge the background soft, then put sharp details on top.', [
      S('Pick the Rainbow brush, thick. Draw big arches across the page, one inside the other.', FR + ['#F2604F', '#FF8A2B', '#FFC23D', '#2FA36B', '#2E8BE6', '#6D55D1'].map((c, i) => `<path d="M${30 + i * 10} 170 A${70 - i * 10} ${70 - i * 10} 0 0 1 ${170 - i * 10} 170" style="fill:none;stroke:${c};stroke-width:9"/>`).join(''), 'rainbow', RD, { size: THICK }),
      S('Pick the Smudge finger. Rub along the arches so the colors melt softly together.', guide(ap('M40 170A60 60 0 0 1 160 170')), 'smudge', RD),
      S('Pick Chalk and white. Draw fluffy clouds at both ends of the rainbow.', fill(WH, C(30, 166, 14) + C(46, 156, 14) + C(170, 166, 14) + C(154, 156, 14)) + C(30, 166, 14) + C(46, 156, 14) + C(170, 166, 14) + C(154, 156, 14), 'chalk', WH, { size: THICK }),
      S('Pick Watercolor and light blue. Wash the sky above the rainbow.', band(LB, 15, 60, 0.4), 'watercolor', LB, { size: THICK }),
      S('Pick the Smooth pen and dark blue, thin. Draw little birds flying over the rainbow, sharp and crisp.', ap('M70 50q6 -6 12 0q6 -6 12 0M110 40q5 -5 10 0q5 -5 10 0M130 60q4 -4 8 0q4 -4 8 0'), 'round', DB, { size: THIN }),
      S('Pick Glitter and yellow. Sprinkle magic dust along the top of the rainbow.', dots(YE, Array.from({ length: 9 }, (_, i) => [100 + 72 * Math.cos(Math.PI + i * Math.PI / 8), 170 + 72 * Math.sin(Math.PI + i * Math.PI / 8)]), 2), 'glitter', YE, { size: MED })
    ]));
  }
  {
    P.push(L('ps-collage', 'ps-mixed', 3, 'Painted paper garden', '🌼', 'canvas', 'Paint, crayons, paper scraps to cut, and glue', 'Eric Carle painted papers first, then cut them out to make his pictures. Painted paper has the best texture!', [
      S('Pick Thick paint and light blue, thick. Paint the sky with criss-cross strokes, like painted paper.', FR + fill(LB, ap('M15 15H185V130H15Z'), 0.6) + stroke(BL, ap('M20 30l30 20M60 24l30 20M110 30l30 20M30 80l30 20M120 84l30 20')), 'oil', LB, { size: THICK }),
      S('Pick green. Paint grass with up-and-down strokes.', fill(GR, ap('M15 130H185V185H15Z'), 0.8) + stroke(DG, ap('M24 185v-16M40 185v-12M70 185v-16M100 185v-12M130 185v-16M160 185v-12')), 'oil', GR, { size: THICK }),
      S('Pick the Smooth pen. Paint flower shapes as flat "cut paper" shapes in red, yellow and purple.', paint(RD, petals(50, 110, 5, 10, 9, 6)) + paint(YE, petals(100, 96, 6, 11, 10, 6)) + paint(PU, petals(150, 112, 5, 10, 9, 6)), 'round', RD, { size: THICK }),
      S('Pick the Crayon. Draw stems and leaves, and scribble texture on the petals.', stroke(DG, ap('M50 120V160M100 108V160M150 122V160') + leaf(50, 146, 16, -30) + leaf(100, 140, 16, 210)) + stroke(DR, ap('M44 104l8 4M96 90l10 4M146 106l8 4')), 'crayon', DG, { size: THIN }),
      S('Pick Stamps and the flower. Stamp little flowers in the grass.', paint(PK, petals(30, 170, 5, 4, 3, 2) + petals(80, 176, 5, 4, 3, 2) + petals(130, 172, 5, 4, 3, 2) + petals(176, 168, 5, 4, 3, 2)), 'stamps', PK, { size: THIN }),
      S('Pick the Marker and yellow. Draw a sun with a bee buzzing by. Its trail is a dotted line!', fill(YE, C(160, 40, 14)) + '<path d="M40 40 q20 -16 40 0 t40 0" style="stroke-dasharray:3 5"/>' + fill(YE, E(124, 40, 6, 4)) + stroke(DB, ap('M122 37v6M126 37v6')), 'marker', YE, { size: MED })
    ]));
  }
  {
    const city = [[20, 22, 60], [46, 18, 88], [68, 28, 54], [100, 20, 100], [124, 26, 70], [154, 26, 82]];
    P.push(L('ps-citydusk', 'ps-mixed', 4, 'City at sunset: every tool', '🏙️', 'wc', MIX, 'Plan which tool does each job: watercolor for soft sky, spray for glow, ink for lines, marker for windows, glitter for lights.', [
      S('Pick Watercolor. Wash the sky: yellow near the bottom, orange, then pink and purple at the top.', FR + band(YE, 110, 50, 0.6) + band(OR, 80, 34, 0.6) + band(PK, 46, 36, 0.6) + band(PU, 15, 34, 0.6), 'watercolor', YE, { size: THICK }),
      S('Pick the Spray can and yellow. Spray a soft glowing sun low in the sky.', paint(LY, og(0.8, C(100, 120, 20))) + paint(YE, og(0.4, C(100, 120, 34))), 'spray', YE, { size: THICK }),
      S('Pick the Ink pen and dark blue. Draw the buildings with crisp lines.', stroke(DB, skyline(176, city)), 'ink', DB, { size: THIN }),
      S('Pick Watercolor and purple. Wash the buildings, see-through, so the sky glows behind.', fill(PU, ap(city.map(([x, w, h]) => `M${x} 176V${176 - h}H${x + w}V176Z`).join('')), 0.5), 'watercolor', PU, { size: MED }),
      S('Pick the Marker and yellow. Dot lit windows.', paint(YE, windows(city, 176, i => i % 2 === 0)), 'marker', YE, { size: THIN }),
      S('Pick the Smudge finger. Rub a soft haze along the bottom of the buildings.', guide(al(20, 172, 180, 172)), 'smudge', PU),
      S('Pick Glitter. Add twinkling street lights along the bottom. Sign it!', dots(YE, [[30, 180], [60, 180], [90, 180], [120, 180], [150, 180], [176, 180]], 2.2), 'glitter', YE, { size: THIN })
    ]));
  }

  P.forEach(l => LESSONS.push(l));
}/*}lazy*/);
