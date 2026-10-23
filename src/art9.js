/* ---------- art9: music, toys, weather, castles, gardens, silly creatures ---------- */
// Uses the helpers from art.js (ac, ae, al, ap, ar, apg, apl, guide, paint, atext).
// Wrapped in a function so the little helpers below never clash with other files.
ART_LATER.push(/*lazy{*/() => {
  const f1 = n => +n.toFixed(1);
  const DEG = Math.PI / 180, STEP = 3;

  /* Shapes are kept as lists of points, so a shape at the back can stop exactly where a front shape begins. */
  const ell = (cx, cy, rx, ry, rot = 0) => {
    const n = Math.max(24, Math.round(Math.PI * (rx + ry) / STEP)), c = Math.cos(rot * DEG), s = Math.sin(rot * DEG), pts = [];
    for (let i = 0; i < n; i++) { const t = i / n * 2 * Math.PI, x = rx * Math.cos(t), y = ry * Math.sin(t); pts.push([cx + x * c - y * s, cy + x * s + y * c]); }
    return { pts, closed: true };
  };
  const circ = (cx, cy, r) => ell(cx, cy, r, r);
  // Part of an ellipse, from angle a0 to a1 (degrees, measured before turning by rot).
  const arcE = (cx, cy, rx, ry, a0, a1, rot = 0) => {
    const n = Math.max(6, Math.round(Math.abs(a1 - a0) * DEG * (rx + ry) / 2 / STEP)), c = Math.cos(rot * DEG), s = Math.sin(rot * DEG), pts = [];
    for (let i = 0; i <= n; i++) { const t = (a0 + (a1 - a0) * i / n) * DEG, x = rx * Math.cos(t), y = ry * Math.sin(t); pts.push([cx + x * c - y * s, cy + x * s + y * c]); }
    return { pts, closed: false };
  };
  const dens = (pts, closed) => {
    const out = [], m = closed ? pts.length : pts.length - 1;
    for (let i = 0; i < m; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length], k = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / STEP));
      for (let j = 0; j < k; j++) out.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]);
    }
    if (!closed) out.push(pts[pts.length - 1]);
    return out;
  };
  const poly = (p, closed = true) => {
    const pts = typeof p === 'string' ? p.trim().split(/\s+/).map(q => q.split(',').map(Number)) : p;
    return { pts: dens(pts, closed), closed };
  };
  const rect = (x, y, w, h) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
  const seg = (x1, y1, x2, y2) => poly([[x1, y1], [x2, y2]], false);
  // A fat strip from one point to another, w wide (arms, legs, posts).
  const bar = (x1, y1, x2, y2, w) => {
    const L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L * w / 2, ny = (x2 - x1) / L * w / 2;
    return poly([[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]]);
  };
  const rrect = (x, y, w, h, r) => {
    const pts = [], q = (cx, cy, a0) => { for (let i = 0; i <= 6; i++) { const a = (a0 + i * 15) * DEG; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } };
    q(x + w - r, y + r, -90); q(x + w - r, y + h - r, 0); q(x + r, y + h - r, 90); q(x + r, y + r, 180);
    return poly(pts);
  };
  // Read a simple path (absolute M L H V Q C Z) into points.
  const pth = d => {
    const tk = d.match(/[MLHVQCZ]|-?\d*\.?\d+/g), pts = [];
    let i = 0, cmd = '', x = 0, y = 0, closed = false;
    const num = () => +tk[i++];
    const add = (fn, L) => { const k = Math.max(2, Math.ceil(L / STEP)); for (let j = 1; j <= k; j++) pts.push(fn(j / k)); };
    while (i < tk.length) {
      if (/[A-Z]/.test(tk[i])) cmd = tk[i++];
      const x0 = x, y0 = y;
      if (cmd === 'Z') { closed = true; continue; }
      if (cmd === 'M') { x = num(); y = num(); pts.push([x, y]); cmd = 'L'; continue; }
      if (cmd === 'L' || cmd === 'H' || cmd === 'V') {
        if (cmd === 'H') x = num(); else if (cmd === 'V') y = num(); else { x = num(); y = num(); }
        const X = x, Y = y; add(t => [x0 + (X - x0) * t, y0 + (Y - y0) * t], Math.hypot(X - x0, Y - y0));
      } else if (cmd === 'Q') {
        const qx = num(), qy = num(); x = num(); y = num(); const X = x, Y = y;
        add(t => { const m = 1 - t; return [m * m * x0 + 2 * m * t * qx + t * t * X, m * m * y0 + 2 * m * t * qy + t * t * Y]; }, Math.hypot(qx - x0, qy - y0) + Math.hypot(X - qx, Y - qy));
      } else if (cmd === 'C') {
        const ax = num(), ay = num(), bx = num(), by = num(); x = num(); y = num(); const X = x, Y = y;
        add(t => { const m = 1 - t; return [m * m * m * x0 + 3 * m * m * t * ax + 3 * m * t * t * bx + t * t * t * X, m * m * m * y0 + 3 * m * m * t * ay + 3 * m * t * t * by + t * t * t * Y]; },
          Math.hypot(ax - x0, ay - y0) + Math.hypot(bx - ax, by - ay) + Math.hypot(X - bx, Y - by));
      } else i++;
    }
    if (closed) { const a = pts[0], b = pts[pts.length - 1]; if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.01) pts.pop(); }
    return { pts: closed ? dens(pts, true) : pts, closed };
  };
  // A bumpy cloud, bush or woolly shape: k bumps around an oval.
  const cloud = (cx, cy, rx, ry, k, a = 0.2, ph = 0) => {
    const n = Math.round(Math.PI * (rx + ry) * 1.4 / STEP), pts = [];
    for (let i = 0; i < n; i++) { const t = i / n * 2 * Math.PI, f = 1 - a + a * Math.sqrt(Math.abs(Math.sin(k * t / 2 + ph))); pts.push([cx + rx * f * Math.cos(t), cy + ry * f * Math.sin(t)]); }
    return { pts, closed: true };
  };
  // A leaf from its base to its tip, w wide.
  const leaf = (bx, by, tx, ty, w) => {
    const mx = (bx + tx) / 2, my = (by + ty) / 2, L = Math.hypot(tx - bx, ty - by), nx = -(ty - by) / L * w, ny = (tx - bx) / L * w;
    return pth(`M${bx} ${by} Q${f1(mx + nx)} ${f1(my + ny)} ${tx} ${ty} Q${f1(mx - nx)} ${f1(my - ny)} ${bx} ${by} Z`);
  };
  const inside = (sh, x, y) => {
    const p = sh.pts; let c = false;
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      const xi = p[i][0], yi = p[i][1], xj = p[j][0], yj = p[j][1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  // The parts of a shape you can see: not hidden by any front shape, and (if given) inside every keep shape.
  const visD = (sh, hide = [], keep = []) => {
    const ok = p => !hide.some(h => inside(h, p[0], p[1])) && keep.every(k => inside(k, p[0], p[1]));
    const P = sh.closed ? sh.pts.concat([sh.pts[0]]) : sh.pts, runs = [];
    let prev = ok(P[0]), cur = prev ? [P[0]] : null, all = prev;
    for (let i = 1; i < P.length; i++) {
      const a = P[i - 1], b = P[i], now = ok(b);
      if (now !== prev) {
        let lo = 0, hi = 1;
        for (let k = 0; k < 16; k++) { const m = (lo + hi) / 2; if (ok([a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m]) === prev) lo = m; else hi = m; }
        const m = (lo + hi) / 2, q = [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m];
        if (prev) { cur.push(q); runs.push(cur); cur = null; } else cur = [q];
        all = false;
      }
      if (now) cur.push(b);
      prev = now;
    }
    if (cur) runs.push(cur);
    const str = r => 'M' + r.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' ');
    if (sh.closed && all) return str(P.slice(0, -1)) + 'Z';
    if (sh.closed && runs.length > 1 && ok(P[0])) { const last = runs.pop(); runs[0] = last.concat(runs[0].slice(1)); }
    return runs.filter(r => r.length > 1).map(str).join('');
  };
  const V = (sh, hide, keep) => { const d = visD(sh, hide, keep); return d ? ap(d) : ''; };
  const D = sh => 'M' + sh.pts.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' ') + 'Z';
  const F = sh => ap(D(sh));
  // Colour that soaks in like a marker: front colours cover back ones, and the lines stay visible.
  const M = s => `<g style="mix-blend-mode:multiply">${s}</g>`;
  const fat = (c, d, w) => d ? `<g class="sk" style="--sk:${c}"><path d="${d}" style="stroke-width:${w}"/></g>` : '';
  const starPts = (cx, cy, R, r, n = 5) => Array.from({ length: n * 2 }, (_, i) => {
    const a = (i * 180 / n - 90) * DEG, d = i % 2 ? r : R;
    return `${f1(cx + d * Math.cos(a))},${f1(cy + d * Math.sin(a))}`;
  }).join(' ');
  const star = (x, y, R) => apg(starPts(x, y, R, R * 0.45));
  const around = (n, R, cx, cy, f, a0 = -90) => Array.from({ length: n }, (_, i) => { const a = (a0 + i * 360 / n) * DEG; return f(f1(cx + R * Math.cos(a)), f1(cy + R * Math.sin(a)), a); }).join('');
  const SKY = '#D6EAFC', GRASS = '#6CC08B', NAVY = '#22305A', SUN = '#FFD966';
  const P = 'Paper, a pencil and crayons';

  /* ---- extra little helpers for this batch ---- */
  // The front strip of a can or drum: the front curve at y1 and the front curve at y2.
  const band = (cx, y1, y2, rx, ry) => poly(arcE(cx, y1, rx, ry, 0, 180).pts.concat(arcE(cx, y2, rx, ry, 180, 0).pts));
  // A rain drop: pointy on top, round at the bottom.
  const dropD = (x, y, s = 1) => `M${x} ${y} Q${f1(x + 8 * s)} ${f1(y + 11 * s)} ${f1(x + 7 * s)} ${f1(y + 15 * s)} Q${x} ${f1(y + 22 * s)} ${f1(x - 7 * s)} ${f1(y + 15 * s)} Q${f1(x - 8 * s)} ${f1(y + 11 * s)} ${x} ${y} Z`;
  // A music note: an oval head, a stem and a flag.
  const note = (x, y) => ae(x, y, 5, 4) + al(x + 5, y, x + 5, y - 18) + ap(`M${x + 5} ${y - 18} q8 4 6 12`);
  const noteHead = (x, y) => ae(x, y, 5, 4);
  const twinkle = (x, y, r) => al(x - r, y, x + r, y) + al(x, y - r, x, y + r);
  const flake = (x, y, r) => around(3, r, x, y, (px, py) => al(px, py, f1(2 * x - px), f1(2 * y - py)), -90);
  // A furry shape: a pointy zig-zag edge all the way around an oval.
  const fur = (cx, cy, rx, ry, n, d) => poly(Array.from({ length: n * 2 }, (_, i) => {
    const a = i * Math.PI / n - Math.PI / 2, k = i % 2 ? 1 : 0;
    return [cx + (rx - d * k) * Math.cos(a), cy + (ry - d * k) * Math.sin(a)];
  }));
  const quadY = (x, y0, sag) => { const t = (x - 10) / 180; return y0 - sag * 4 * t * (1 - t); };

  ART_CATS.push(
    { id: 'music', name: 'Music & Instruments', ico: '🎸', blurb: 'Drums, guitars, pianos, trumpets and a band' },
    { id: 'toys', name: 'Toys & Games', ico: '🧸', blurb: 'Yo-yos, rubber ducks, blocks and a doll house' },
    { id: 'weather', name: 'Weather & Sky', ico: '🌦️', blurb: 'Rain, snow, wind and thunderstorms' },
    { id: 'castles', name: 'Castles & Knights', ico: '🏰', blurb: 'Crowns, shields, knights and tall towers' },
    { id: 'garden', name: 'Gardens & Plants', ico: '🌻', blurb: 'Sunflowers, mushrooms, veggies and pot plants' },
    { id: 'creatures', name: 'Silly Creatures', ico: '👹', blurb: 'Fluffy monsters, alien pets and mixed-up animals' }
  );

  /* ================= Music ================= */
  {
    const top = ell(100, 78, 60, 18);
    const zigPts = Array.from({ length: 9 }, (_, i) => { const x = 40 + i * 15, s = Math.sqrt(Math.max(0, 1 - ((x - 100) / 60) ** 2)); return `${x},${f1((i % 2 ? 136 : 92) + 18 * s)}`; }).join(' ');
    const tipL = circ(91.6, 51.4, 5), tipR = circ(108.4, 51.4, 5);
    const stickL = bar(56, 18, 88, 48, 5), stickR = bar(144, 18, 112, 48, 5);
    LESSONS.push({ id: 'a9-drum', cat: 'music', level: 1, title: 'A big drum', ico: '🥁', need: P, tip: 'Tap a beat on the table while you draw. Boom, boom, tap!', steps: [
      ['Draw a wide, flat oval. This is the top of the drum.', V(top)],
      ['Draw two straight lines down from the ends of the oval.', al(40, 78, 40, 150) + al(160, 78, 160, 150)],
      ['Join them at the bottom with a curve, like a big smile.', V(arcE(100, 150, 60, 18, 0, 180))],
      ['Draw two more smile curves: one near the top and one near the bottom.', V(arcE(100, 92, 60, 18, 0, 180)) + V(arcE(100, 136, 60, 18, 0, 180))],
      ['Draw a zig-zag between the two curves.', apl(zigPts)],
      ['Draw two drumsticks with round tips, ready to bang!', V(stickL, [tipL]) + V(stickR, [tipR]) + V(tipL) + V(tipR)],
      ['Color your drum: red sides, a cream top and a yellow zig-zag. Boom!', M(paint('#F2604F', F(band(100, 78, 150, 60, 18))) + paint('#FFF3C4', F(band(100, 78, 92, 60, 18)) + F(band(100, 136, 150, 60, 18))) + paint('#FBF6EC', F(top)) + fat(SUN, 'M' + zigPts.replace(/ /g, ' L').replace(/,/g, ' '), 5) + paint('#E8C27A', F(stickL) + F(stickR) + F(tipL) + F(tipR)))]] });
  }
  {
    const lower = circ(100, 145, 38), upper = circ(100, 98, 28);
    const neck = rect(93, 22, 14, 52), head = rrect(88, 4, 24, 20, 5);
    const hole = circ(100, 117, 10), strip = rect(95.5, 0, 9, 200);
    const pegs = [10, 19].map(y => ac(82, y, 3.5) + al(85.5, y, 88, y) + ac(118, y, 3.5) + al(112, y, 114.5, y)).join('');
    const strings = [97, 100, 103].map(x => al(x, 24, x, 148)).join('');
    LESSONS.push({ id: 'a9-guitar', cat: 'music', level: 1, title: 'A guitar', ico: '🎸', need: P, tip: 'A guitar body looks like a snowman with only two balls!', steps: [
      ['Draw a big round shape like a U for the bottom of the guitar.', V(lower, [upper])],
      ['Draw a smaller round top on it. Leave a little gap at the very top.', V(upper, [lower, neck])],
      ['Draw a long, thin rectangle going up from the gap. This is the neck.', V(neck, [upper, head])],
      ['Draw a box on top of the neck, with round tuning pegs on the sides.', V(head) + pegs],
      ['Draw a little bridge box near the bottom, and three strings up to the top.', ar(86, 148, 28, 7, 2) + strings],
      ['Draw a round sound hole behind the strings.', V(hole, [strip])],
      ['Color it like wood: orange and brown. Strum, strum!', M(paint('#E8A86B', F(lower) + F(upper)) + paint('#B97A50', F(neck) + F(head) + ar(86, 148, 28, 7, 2)) + paint(NAVY, F(hole)) + paint('#F5C04A', [10, 19].map(y => ac(82, y, 3.5) + ac(118, y, 3.5)).join('')))]] });
  }
  {
    const blacks = [40, 60, 100, 120, 140].map(x => ar(x - 6, 80, 12, 50));
    const whiteLines = [40, 60, 100, 120, 140].map(x => al(x, 130, x, 160)).join('') + al(80, 80, 80, 160) + al(160, 80, 160, 160);
    const notes = note(58, 30) + note(140, 26) + note(166, 34);
    LESSONS.push({ id: 'a9-piano', cat: 'music', level: 2, title: 'A toy piano', ico: '🎹', need: P, tip: 'Black keys come in groups of 2 and 3. Look at a real piano to check!', steps: [
      ['Draw a long box with round corners.', ar(10, 40, 180, 130, 10)],
      ['Draw a long rectangle inside it for the keys.', ar(20, 80, 160, 80)],
      ['Draw 5 black keys at the top: 2 together, a gap, then 3 together.', blacks.join('')],
      ['Draw lines to split the white keys. Under the black keys, start below them.', whiteLines],
      ['Draw a round speaker with holes, and two round buttons.', ac(42, 60, 12) + ac(38, 56, 2) + ac(46, 56, 2) + ac(38, 64, 2) + ac(46, 64, 2) + ac(148, 60, 6) + ac(168, 60, 6)],
      ['Draw two short legs, and music notes floating up.', ar(26, 170, 10, 20) + ar(164, 170, 10, 20) + notes],
      ['Color the piano red, and the black keys dark. Plink, plonk!', M(paint('#F2604F', ar(10, 40, 180, 130, 10) + ar(26, 170, 10, 20) + ar(164, 170, 10, 20)) + paint('#fff', ar(20, 80, 160, 80)) + paint(NAVY, blacks.join('') + noteHead(58, 30) + noteHead(140, 26) + noteHead(166, 34)) + paint('#9AA1AB', ac(42, 60, 12)) + paint(SUN, ac(148, 60, 6)) + paint('#6CC08B', ac(168, 60, 6)))]] });
  }
  {
    const bellD = 'M128 93 Q160 90 176 66 L176 134 Q160 110 128 107 Z';
    const loopD = 'M58 107 Q58 140 82 140 L106 140 Q124 140 124 107 L114 107 Q114 130 104 130 L84 130 Q68 130 68 107 Z';
    const valves = [66, 82, 98].map(x => ar(x, 62, 10, 31) + ac(x + 5, 57, 5)).join('');
    LESSONS.push({ id: 'a9-trumpet', cat: 'music', level: 2, title: 'A shiny trumpet', ico: '🎺', need: P, tip: 'Trumpets are made of a long tube, bent around so it fits in your hands.', steps: [
      ['Draw a tall, thin oval on the right. This is the bell, where the sound comes out.', ae(176, 100, 8, 34)],
      ['Draw two curvy lines from the bell, getting closer together, like a funnel.', ap('M128 93 Q160 90 176 66') + ap('M128 107 Q160 110 176 134')],
      ['Draw a long, straight tube going to the left. Close the end.', al(36, 93, 128, 93) + al(36, 107, 128, 107) + al(36, 93, 36, 96) + al(36, 104, 36, 107)],
      ['Draw a small cup on the left end. You blow in here!', al(36, 96, 23.9, 98) + al(36, 104, 23.9, 102) + ae(20, 100, 4, 9)],
      ['Draw three valves on top: three little boxes with round buttons.', valves],
      ['Draw a long U-shaped loop under the tube, and music notes floating out.', ap('M58 107 Q58 140 82 140 L106 140 Q124 140 124 107') + ap('M68 107 Q68 130 84 130 L104 130 Q114 130 114 107') + note(140, 40) + note(166, 30)],
      ['Color it shiny gold. Toot, toot!', M(paint('#F5C04A', ap(bellD) + ap(loopD) + ar(36, 93, 92, 14) + ar(66, 62, 10, 31) + ar(82, 62, 10, 31) + ar(98, 62, 10, 31) + ap('M36 96 L23.9 98 L23.9 102 L36 104 Z') + ae(20, 100, 4, 9)) + paint('#E8A23A', ae(176, 100, 8, 34) + ac(71, 57, 5) + ac(87, 57, 5) + ac(103, 57, 5)) + paint(NAVY, noteHead(140, 40) + noteHead(166, 30)))]] });
  }
  {
    // A little band on a stage: a drummer, a singer and a guitar player.
    const drumTop = ell(46, 142, 24, 7), drumSide = band(46, 142, 166, 24, 7);
    const g1 = circ(146, 138, 11), g2 = circ(157, 128, 8), gNeck = bar(161, 124, 184, 102, 5);
    const heads = [circ(46, 98, 14), circ(100, 84, 15), circ(154, 94, 14)];
    const bodies = [rrect(32, 112, 28, 40, 12), rrect(86, 99, 28, 46, 12), rrect(140, 108, 28, 42, 12)];
    const curtL = 'M0 0 L34 0 Q20 40 30 86 Q12 78 0 92', curtR = 'M200 0 L166 0 Q180 40 170 86 Q188 78 200 92';
    const faces = ac(41, 96, 2) + ac(51, 96, 2) + ap('M41 103 Q46 107 51 103') + ac(95, 81, 2) + ac(105, 81, 2) + ae(100, 91, 3.5, 4.5) + ac(149, 92, 2) + ac(159, 92, 2) + ap('M149 99 Q154 103 159 99');
    const mic = ell(128, 98, 4, 6);
    LESSONS.push({ id: 'a9-band', cat: 'music', level: 3, title: 'A little band', ico: '🎶', need: P, tip: 'Draw the drum and guitar first, then the players behind them.', steps: [
      ['Draw the stage floor and two curtains, one on each side.', al(0, 176, 200, 176) + ap(curtL) + ap(curtR)],
      ['On the left, draw a drum: an oval top, two sides and a curvy bottom.', V(drumTop) + al(22, 142, 22, 166) + al(70, 142, 70, 166) + V(arcE(46, 166, 24, 7, 0, 180))],
      ['On the right, draw a little guitar: two circles and a long neck.', V(g1, [g2]) + V(g2, [g1, gNeck]) + V(gNeck, [g2]) + ac(148, 136, 3)],
      ['In the middle, draw a microphone on a tall stand.', V(mic) + al(128, 104, 128, 168) + apl('120,176 128,168 136,176')],
      ['Draw three round heads with happy faces. The singer has an open mouth!', heads.map(h => V(h)).join('') + faces],
      ['Draw three bean bodies. Stop where they touch the drum and the guitar.', bodies.map((b, i) => V(b, [heads[i], drumTop, drumSide, g1, g2, gNeck])).join('')],
      ['Add arms, legs, drumsticks and music notes.', al(32, 124, 26, 130) + al(60, 124, 66, 130) + al(26, 130, 40, 136) + al(66, 130, 52, 136) + al(114, 114, 125, 104) + al(86, 114, 74, 100) + al(94, 145, 94, 176) + al(106, 145, 106, 176) + al(148, 150, 148, 176) + al(160, 150, 160, 176) + al(168, 116, 174, 112) + al(140, 118, 140, 130) + note(70, 40) + note(112, 30) + note(150, 52)],
      ['Color the band. Who else could join in?', M(paint('#C99A6E', ar(0, 176, 200, 24)) + paint('#E85C68', ap(curtL + 'Z') + ap(curtR + 'Z')) + paint('#6D9BD1', F(bodies[0])) + paint('#F78FB3', F(bodies[1])) + paint('#6CC08B', F(bodies[2])) + paint('#F7D9B5', heads.map(F).join('')) + paint('#F2604F', F(drumSide)) + paint('#FBF6EC', F(drumTop)) + paint('#E8A86B', F(g1) + F(g2) + F(gNeck)) + paint('#9AA1AB', F(mic)) + paint(NAVY, noteHead(70, 40) + noteHead(112, 30) + noteHead(150, 52)))]] });
  }

  /* ================= Toys ================= */
  {
    const beak = pth('M56 84 Q36 80 30 90 Q36 100 56 98 Z'), head = circ(78, 92, 26);
    const body = ell(114, 134, 58, 30), tail = pth('M150 112 Q168 108 186 100 Q180 120 168 136 Z');
    const wing = pth('M104 132 Q124 114 146 126 Q136 146 112 144 Q100 140 104 132 Z');
    const wave = pth('M0 160 Q12 152 24 160 Q36 168 48 160 Q60 152 72 160 Q84 168 96 160 Q108 152 120 160 Q132 168 144 160 Q156 152 168 160 Q180 168 192 160 Q198 156 200 158');
    const bubbles = ac(160, 46, 8) + ac(180, 70, 5) + ac(140, 66, 4);
    LESSONS.push({ id: 'a9-duck', cat: 'toys', level: 1, title: 'A rubber duck', ico: '🦆', need: P, tip: 'Squeak! Start with the beak, then the head, then the body behind.', steps: [
      ['Draw a small pointy oval for the beak.', V(beak)],
      ['Draw a round head next to the beak. Stop where it touches.', V(head, [beak])],
      ['Draw an eye with a shiny dot, and a line across the beak.', ac(84, 84, 4.5) + ac(85.5, 82.5, 1.5) + ap('M31 91 Q42 92 54 91')],
      ['Draw a big oval body under the head. Stop where it touches.', V(body, [head])],
      ['Draw a pointy tail at the back. Stop at the body.', V(tail, [body])],
      ['Draw a wing on the body.', V(wing)],
      ['Draw wavy bath water and some bubbles.', V(wave, [body]) + bubbles],
      ['Color your duck yellow with an orange beak. Squeak, squeak!', M(paint('#9CCBF5', ap(D(poly(wave.pts.concat([[200, 200], [0, 200]]))))) + paint('#FFD43B', F(tail) + F(body) + F(head)) + paint('#F5C04A', F(wing)) + paint('#FF9F43', F(beak)) + paint(NAVY, ac(84, 84, 4.5)) + paint('#EAF4FD', bubbles))]] });
  }
  {
    const dots = around(6, 41, 100, 104, (x, y) => ac(x, y, 5));
    LESSONS.push({ id: 'a9-yoyo', cat: 'toys', level: 1, title: 'A yo-yo', ico: '🪀', need: P, tip: 'Circles inside circles! Start big, then go smaller and smaller.', steps: [
      ['Draw a big circle.', ac(100, 104, 52)],
      ['Draw a smaller circle inside it.', ac(100, 104, 30)],
      ['Draw a tiny circle in the very middle.', ac(100, 104, 8)],
      ['Draw a star around the tiny circle.', star(100, 104, 21)],
      ['Draw six little dots around the ring.', dots],
      ['Draw the string going up, with a loop for your finger.', al(100, 52, 100, 24) + ac(100, 18, 6)],
      ['Draw curvy lines on the sides to show it spinning.', ap('M38 72 Q28 104 38 136') + ap('M26 82 Q18 104 26 126') + ap('M162 72 Q172 104 162 136') + ap('M174 82 Q182 104 174 126')],
      ['Color it bright! Up and down, up and down.', M(paint('#F2604F', ac(100, 104, 52)) + paint('#FFD43B', ac(100, 104, 30)) + paint('#fff', star(100, 104, 21)) + paint('#6D9BD1', ac(100, 104, 8) + dots))]] });
  }
  {
    const d = 14;
    const front = (x, y, s) => rect(x, y, s, s);
    const topF = (x, y, s) => poly([[x, y], [x + d, y - d], [x + s + d, y - d], [x + s, y]]);
    const sideF = (x, y, s) => poly([[x + s, y], [x + s + d, y - d], [x + s + d, y + s - d], [x + s, y + s]]);
    const A = front(30, 132, 48), B = front(78, 132, 48), C = front(54, 84, 48), roof = poly('54,84 78,50 102,84');
    const Dd = front(150, 150, 30);
    const fronts = [A, B, C, roof];
    const roofSide = poly('78,50 92,36 116,70 102,84');
    const backs = [topF(30, 132, 48), topF(78, 132, 48), sideF(78, 132, 48), sideF(54, 84, 48), roofSide];
    LESSONS.push({ id: 'a9-blocks', cat: 'toys', level: 2, title: 'A tower of blocks', ico: '🧱', need: P, tip: 'Every block has the same slanted lines. Keep them all pointing the same way!', steps: [
      ['Draw two squares side by side at the bottom.', V(A) + V(B)],
      ['Draw one more square on top, in the middle.', V(C)],
      ['Draw a triangle on the very top, like a roof.', V(roof)],
      ['Make them 3D! Draw slanted tops and sides. Stop at the squares in front.', backs.map(s => V(s, fronts)).join('')],
      ['Write A, B and C on the blocks. Draw a star on the roof.', atext(54, 167, 'A', 28) + atext(102, 167, 'B', 28) + atext(78, 119, 'C', 28) + star(78, 72, 8)],
      ['Draw a little block that fell on the floor, and the floor line.', V(Dd) + V(topF(150, 150, 30)) + V(sideF(150, 150, 30)) + ac(165, 165, 6) + al(4, 180, 30, 180) + al(126, 180, 150, 180) + al(180, 180, 196, 180)],
      ['Color each block a different color. Can you build a taller tower?', M(paint('#F2604F', F(A) + F(Dd)) + paint('#6D9BD1', F(B)) + paint('#FFD43B', F(C)) + paint('#6CC08B', F(roof)) + paint('#F7A39A', F(topF(30, 132, 48))) + paint('#9CCBF5', F(topF(78, 132, 48)) + F(topF(150, 150, 30))) + paint('#3F6FB0', F(sideF(78, 132, 48))) + paint('#E8B830', F(sideF(54, 84, 48))) + paint('#3E9A62', F(roofSide)) + paint('#C0392B', F(sideF(150, 150, 30))))]] });
  }
  {
    const collar = cloud(108, 72, 24, 8, 8, 0.3), head = circ(108, 46, 20), hat = poly('93.7,32 108,8 122.3,32'), pom = circ(108, 5, 3);
    const sp = rect(98, 78, 20, 32);
    const boxF = rect(60, 118, 80, 62), boxT = poly('60,118 80,102 160,102 140,118'), boxS = poly('140,118 160,102 160,164 140,180');
    const lid = poly([[80, 102], [70, 62], [150, 62], [160, 102]], false), lidF = poly('80,102 70,62 150,62 160,102');
    const boxStar = star(100, 149, 16);
    LESSONS.push({ id: 'a9-jackbox', cat: 'toys', level: 2, title: 'A jack-in-the-box', ico: '🤡', need: P, tip: 'Pop! Draw the clown first, then the box he jumps out of.', steps: [
      ['Draw a bumpy ruffle collar, like a little cloud.', V(collar)],
      ['Draw a round head on top, and a pointy hat with a pom-pom.', V(head, [collar, hat]) + V(hat, [pom]) + V(pom)],
      ['Give the clown two eyes, a big round nose and a smile.', ac(100, 42, 3) + ac(116, 42, 3) + ac(108, 50, 4.5) + ap('M98 56 Q108 63 118 56')],
      ['Draw a zig-zag spring under the collar.', apl('98,79 118,84 98,89 118,94 98,99 118,104 98,109')],
      ['Draw a box under the spring: a square front, a slanted top and a side.', V(boxF) + V(boxT, [boxF, sp]) + V(boxS, [boxF])],
      ['Draw the lid flipped open at the back. Stop at the clown.', V(lid, [head, collar, sp])],
      ['Draw a big star on the front of the box.', boxStar],
      ['Color it in! Pop goes the clown!', M(paint('#9CCBF5', F(lidF)) + paint(NAVY, F(boxT)) + paint('#6D9BD1', F(boxF)) + paint('#3F6FB0', F(boxS)) + paint(SUN, boxStar) + paint('#F7D9B5', F(head)) + paint('#F78FB3', F(hat)) + paint('#fff', F(collar) + F(pom)) + paint('#F2604F', ac(108, 50, 4.5)))]] });
  }
  {
    const roof = poly('30,80 100,24 170,80'), chim = rect(132, 30, 14, 34);
    const plant = leaf(147, 120, 142, 106, 5), plant2 = leaf(147, 120, 154, 104, 5);
    LESSONS.push({ id: 'a9-dollhouse', cat: 'toys', level: 3, title: 'A doll house', ico: '🏠', need: P, tip: 'A doll house has no front wall, so you can see into every room!', steps: [
      ['Draw a big rectangle for the house.', ar(40, 80, 120, 100)],
      ['Put a big triangle roof on top, with a round window. Add a chimney behind.', V(roof) + V(chim, [roof]) + ac(100, 58, 10) + al(90, 58, 110, 58) + al(100, 48, 100, 68)],
      ['Draw a line across and a line down the middle. Now you have 4 rooms!', al(40, 130, 160, 130) + al(100, 80, 100, 180)],
      ['Top left is the bedroom: draw a bed with a pillow. Zzz!', ar(46, 104, 6, 26) + ar(52, 116, 40, 8) + al(56, 124, 56, 130) + al(88, 124, 88, 130) + ae(60, 112, 6, 4) + ap('M70 96 h6 l-6 6 h6 M80 88 h5 l-5 5 h5')],
      ['Top right: draw a window with 4 panes and a little plant in a pot.', ar(108, 90, 26, 22) + al(121, 90, 121, 112) + al(108, 101, 134, 101) + apg('142,130 140,120 154,120 152,130') + V(plant, [plant2]) + V(plant2)],
      ['Bottom left is the kitchen: draw a table with a cup, and a chair.', ar(54, 150, 36, 5) + al(58, 155, 58, 180) + al(86, 155, 86, 180) + ar(64, 142, 8, 8) + al(46, 140, 46, 180) + al(46, 162, 52, 162) + al(52, 162, 52, 180)],
      ['Bottom right: draw stairs, like a zig-zag going up.', apl('104,180 104,170 116,170 116,160 128,160 128,150 140,150 140,140 152,140 152,130')],
      ['Color every room a different color, like wallpaper. Who lives here?', M(paint('#B97A50', F(chim)) + paint('#F2604F', F(roof)) + paint(SKY, ac(100, 58, 10)) + paint('#F7C6D9', ar(40, 80, 60, 50)) + paint('#FFF3C4', ar(100, 80, 60, 50)) + paint('#CDEBD3', ar(40, 130, 60, 50)) + paint('#D6E4F7', ar(100, 130, 60, 50)) + paint('#6D9BD1', ar(52, 116, 40, 8)) + paint('#9CCBF5', ar(108, 90, 26, 22)) + paint('#C99A6E', apg('104,180 104,170 116,170 116,160 128,160 128,150 140,150 140,140 152,140 152,130 160,130 160,180') + ar(54, 150, 36, 5)) + paint('#E8A86B', apg('142,130 140,120 154,120 152,130')) + paint(GRASS, F(plant) + F(plant2)))]] });
  }

  /* ================= Weather ================= */
  {
    const cl = cloud(100, 64, 62, 34, 7, 0.22);
    const row1 = [60, 90, 120, 150].map(x => dropD(x, 106, 0.8)), row2 = [45, 75, 105, 135, 165].map(x => dropD(x, 130, 0.8));
    LESSONS.push({ id: 'a9-raincloud', cat: 'weather', level: 1, title: 'A rain cloud', ico: '🌧️', need: P, tip: 'Rain drops are pointy on top and round at the bottom.', steps: [
      ['Draw a big bumpy cloud.', V(cl)],
      ['Give your cloud sleepy eyes and a little smile.', ap('M80 62 Q86 68 92 62') + ap('M108 62 Q114 68 120 62') + ap('M94 76 Q100 81 106 76')],
      ['Draw rain drops under the cloud. Pointy on top, round at the bottom.', row1.map(ap).join('')],
      ['Draw another row of drops, in between the first ones.', row2.map(ap).join('')],
      ['Draw a flat oval puddle at the bottom.', ae(100, 178, 60, 12)],
      ['Draw little rings in the puddle where the rain lands.', ae(78, 178, 12, 4) + ae(124, 180, 9, 3) + ae(124, 180, 4, 1.5)],
      ['Color the cloud gray and the rain blue. Pitter, patter!', M(paint('#B9C3D6', F(cl)) + paint('#6DB3F2', row1.concat(row2).map(ap).join('')) + paint('#9CCBF5', ae(100, 178, 60, 12)))]] });
  }
  {
    const t1 = poly('40,160 100,100 160,160'), t2 = poly('55,122 100,72 145,122'), t3 = poly('70,88 100,42 130,88');
    const trunk = rect(90, 158, 20, 20);
    const hillD = 'M0 184 Q100 156 200 184', hillR = pth(hillD + ' L200 200 L0 200 Z');
    const s3 = 'M86 64 Q90 72 95 66 Q100 73 105 66 Q110 72 114 64', s2 = 'M77 98 Q83 106 89 100 Q95 108 101 100 Q107 108 113 100 Q119 106 123 98', s1 = 'M68 132 Q75 141 82 134 Q89 142 96 134 Q103 142 110 134 Q117 142 124 134 Q129 140 132 132';
    const snow = [[20, 30], [50, 18], [30, 70], [160, 22], [182, 56], [148, 52], [18, 120], [178, 124], [60, 92], [142, 94], [28, 154], [176, 156], [72, 36], [130, 30], [12, 92], [190, 92]].map(([x, y]) => ac(x, y, 2.5)).join('');
    LESSONS.push({ id: 'a9-snowyday', cat: 'weather', level: 1, title: 'A snowy pine tree', ico: '🌲', need: P, tip: 'Leave the snow white! Just color around it.', steps: [
      ['Draw a big triangle at the bottom.', V(t1)],
      ['Draw a middle triangle on top. Stop where it touches.', V(t2, [t1])],
      ['Draw a small triangle at the very top.', V(t3, [t2])],
      ['Draw a short trunk under the tree.', V(trunk, [t1, hillR])],
      ['Draw a big snowy hill.', ap(hillD)],
      ['Draw wavy snow lines on the branches.', ap(s3) + ap(s2) + ap(s1)],
      ['Draw snow falling all around, and two snowflakes.', snow + flake(26, 44, 8) + flake(172, 86, 7)],
      ['Color the tree green and the sky blue. Leave the snow white!', M(paint('#B7D7F5', ar(0, 0, 200, 200)) + paint('#fff', F(hillR)) + paint('#B97A50', F(trunk)) + paint('#3E9A62', F(t1)) + paint('#fff', ap(s1 + ' L100 100 Z')) + paint('#3E9A62', F(t2)) + paint('#fff', ap(s2 + ' L100 72 Z')) + paint('#3E9A62', F(t3)) + paint('#fff', ap(s3 + ' L100 42 Z') + snow))]] });
  }
  {
    const cf = cloud(88, 66, 62, 30, 7, 0.22), cb = cloud(140, 46, 46, 26, 6, 0.22);
    const bolt = poly('92,86 74,128 90,128 78,172 120,114 102,114 114,86');
    const rain = [[40, 108], [56, 120], [32, 134], [50, 148], [40, 166], [136, 104], [154, 100], [128, 132], [148, 126], [140, 152], [162, 146], [120, 160], [60, 164]].map(([x, y]) => al(x, y, x - 6, y + 14)).join('');
    LESSONS.push({ id: 'a9-storm', cat: 'weather', level: 2, title: 'A thunderstorm', ico: '⛈️', need: P, tip: 'Count after the flash: 1, 2, 3... BOOM! That is the thunder.', steps: [
      ['Draw a big bumpy cloud.', V(cf)],
      ['Draw a second cloud peeking out behind it. Stop where they touch.', V(cb, [cf])],
      ['Give the front cloud a grumpy face.', ac(72, 64, 3) + ac(100, 64, 3) + al(64, 55, 78, 59) + al(108, 55, 94, 59) + ap('M76 80 Q86 74 96 80')],
      ['Draw a zig-zag lightning bolt coming out of the bottom.', V(bolt, [cf])],
      ['Draw slanted lines for heavy rain.', rain],
      ['Draw zap lines where the lightning hits the ground.', al(70, 176, 62, 182) + al(78, 178, 78, 188) + al(86, 176, 94, 182) + al(0, 192, 200, 192)],
      ['Color the clouds dark gray and the lightning bright yellow. Crash!', M(paint('#AEB8D0', ar(0, 0, 200, 200)) + paint('#FFD43B', F(bolt)) + paint('#7A8299', F(cb)) + paint('#8F98AE', F(cf)) + paint('#6CC08B', ar(0, 192, 200, 8)))]] });
  }
  {
    const crown = cloud(132, 74, 54, 38, 8, 0.18);
    const trunk = pth('M70 184 Q72 140 104 96 L118 104 Q90 146 90 184 Z');
    const leaves = [leaf(146, 140, 160, 130, 5), leaf(172, 152, 186, 146, 5), leaf(124, 164, 138, 158, 5), leaf(160, 172, 174, 170, 5)];
    const grass = ap('M8 184 Q12 176 22 172 M30 184 Q34 176 44 172 M100 184 Q104 176 114 172 M130 184 Q134 176 144 172 M178 184 Q182 176 192 172');
    LESSONS.push({ id: 'a9-windy', cat: 'weather', level: 2, title: 'A windy day', ico: '🌬️', need: P, tip: 'You cannot see wind, but you can see what it pushes!', steps: [
      ['Draw a bendy tree trunk: two curvy lines leaning over.', V(pth('M70 184 Q72 140 104 96'), [crown]) + V(pth('M90 184 Q90 146 118 104'), [crown])],
      ['Draw a big bumpy bunch of leaves, pushed over by the wind.', V(crown)],
      ['Draw the ground, with grass bending over.', al(0, 184, 200, 184) + grass],
      ['Draw swirly wind lines blowing.', ap('M6 56 Q34 46 54 56 Q66 64 58 72 Q50 76 48 68') + ap('M4 98 Q30 90 60 98') + ap('M8 134 Q34 124 56 136 Q66 144 58 150 Q50 152 50 144')],
      ['Draw leaves flying away in the wind.', leaves.map(l => V(l)).join('')],
      ['Color it in! Which way is the wind blowing?', M(paint(SKY, ar(0, 0, 200, 184)) + paint(GRASS, ar(0, 184, 200, 16)) + paint('#B97A50', F(trunk)) + paint('#6CC08B', F(crown)) + paint('#F5A623', leaves.map(F).join('')))]] });
  }
  {
    const sunRays = around(8, 0, 60, 60, (x, y, a) => al(f1(60 + 19 * Math.cos(a)), f1(60 + 19 * Math.sin(a)), f1(60 + 28 * Math.cos(a)), f1(60 + 28 * Math.sin(a))));
    const rc = cloud(140, 48, 26, 14, 5, 0.25);
    const drops = [[124, 70], [140, 72], [156, 70], [132, 84], [148, 86]].map(([x, y]) => al(x, y, x - 3, y + 8)).join('');
    const arcs = [32, 25, 18].map(r => V(arcE(140, 176, r, r, 180, 360)));
    LESSONS.push({ id: 'a9-weatherwin', cat: 'weather', level: 3, title: 'The weather window', ico: '🪟', need: P, tip: 'Look out of your window. What weather do you see today?', steps: [
      ['Draw a big square for the window.', ar(14, 14, 172, 172)],
      ['Draw four smaller squares inside. Now you have four panes!', ar(24, 24, 72, 72) + ar(104, 24, 72, 72) + ar(24, 104, 72, 72) + ar(104, 104, 72, 72)],
      ['Top left is a sunny day. Draw a sun with rays.', ac(60, 60, 13) + sunRays],
      ['Top right is a rainy day. Draw a cloud and rain.', V(rc) + drops],
      ['Bottom left is a snowy day. Draw a snowy hill and snowflakes.', ap('M24 160 Q60 144 96 158') + flake(44, 124, 6) + flake(76, 120, 5) + flake(60, 138, 4)],
      ['Bottom right is a rainbow day. Draw three curved rainbow lines.', arcs.join('') + twinkle(118, 120, 4) + twinkle(164, 116, 3)],
      ['Draw a windowsill at the bottom.', ar(6, 186, 188, 8, 2)],
      ['Color each pane. What is the weather outside your window today?', M(paint('#B97A50', ar(14, 14, 172, 172) + ar(6, 186, 188, 8, 2)) + paint('#CFE7FF', ar(24, 24, 72, 72)) + paint('#B9C3D6', ar(104, 24, 72, 72)) + paint('#E3EEF8', ar(24, 104, 72, 72)) + paint('#CFE7FF', ar(104, 104, 72, 72)) + paint('#fff', ap('M24 160 Q60 144 96 158 L96 176 L24 176 Z') + F(rc)) + paint(SUN, ac(60, 60, 13)) + fat('#F2604F', visD(arcE(140, 176, 28.5, 28.5, 180, 360)), 6) + fat('#FFD43B', visD(arcE(140, 176, 21.5, 21.5, 180, 360)), 6))]] });
  }

  /* ================= Castles ================= */
  {
    const body = 'M40 150 L40 62 L70 96 L100 48 L130 96 L160 62 L160 150 Z';
    LESSONS.push({ id: 'a9-crown', cat: 'castles', level: 1, title: 'A royal crown', ico: '👑', need: P, tip: 'Kings and queens wear crowns. Make one for yourself out of paper!', steps: [
      ['Draw a long rectangle for the band.', ar(40, 120, 120, 30)],
      ['Draw three pointy peaks on top, going up and down.', apl('40,120 40,62 70,96 100,48 130,96 160,62 160,120')],
      ['Put a round ball on the tip of each peak.', ac(40, 56, 6) + ac(100, 42, 6) + ac(160, 56, 6)],
      ['Draw jewels on the band: a circle, a diamond and a circle.', ac(66, 135, 7) + apg('100,125 110,135 100,145 90,135') + ac(134, 135, 7)],
      ['Draw a star in the middle, and sparkles all around.', star(100, 82, 9) + twinkle(20, 40, 6) + twinkle(180, 40, 6) + twinkle(22, 110, 5) + twinkle(178, 110, 5)],
      ['Color it gold, with red and blue jewels. Fit for a king or queen!', M(paint('#F5C04A', ap(body)) + paint('#E8A23A', ar(40, 120, 120, 30)) + paint('#fff', ac(40, 56, 6) + ac(100, 42, 6) + ac(160, 56, 6) + star(100, 82, 9)) + paint('#F2604F', ac(66, 135, 7) + ac(134, 135, 7)) + paint('#6D9BD1', apg('100,125 110,135 100,145 90,135')))]] });
  }
  {
    const outer = 'M50 34 L150 34 L150 96 Q150 148 100 178 Q50 148 50 96 Z', inner = 'M60 44 L140 44 L140 96 Q140 140 100 166 Q60 140 60 96 Z';
    const heart = 'M120 134 C106 124 106 112 114 112 C117 112 120 115 120 118 C120 115 123 112 126 112 C134 112 134 124 120 134 Z';
    const rivets = [[55, 39], [100, 39], [145, 39], [55, 78], [145, 78], [100, 172]].map(([x, y]) => ac(x, y, 2.5)).join('');
    LESSONS.push({ id: 'a9-shield', cat: 'castles', level: 1, title: "A knight's shield", ico: '🛡️', need: P, tip: 'Knights put pictures on their shields so friends could spot them.', steps: [
      ['Draw a shield shape: flat on top, pointy at the bottom.', ap(outer)],
      ['Draw a smaller shield inside it.', ap(inner)],
      ['Draw a line down the middle and a line across. Now there are 4 parts.', al(100, 44, 100, 166) + al(60, 96, 140, 96)],
      ['Draw a star in the top left part.', star(80, 70, 13)],
      ['Draw a heart in the bottom right part.', ap(heart)],
      ['Draw little round dots on the border.', rivets],
      ['Color two parts blue and two parts red, like a checkerboard. Gold border!', M(paint('#F5C04A', ap(outer)) + paint('#F2604F', ap(inner)) + paint('#6D9BD1', ar(60, 44, 40, 52) + ap('M100 96 L140 96 Q140 140 100 166 Z')) + paint(SUN, star(80, 70, 13)) + paint('#F78FB3', ap(heart)))]] });
  }
  {
    const gate = 'M80 160 V124 A20 20 0 0 1 120 124 V160';
    const bridge = poly('80,160 120,160 140,194 60,194');
    const chain = (x1, y1, x2, y2) => Array.from({ length: 12 }, (_, i) => { const t = i / 11; return ac(f1(x1 + (x2 - x1) * t), f1(y1 + (y2 - y1) * t), 2); }).join('');
    const wavesL = 'M4 172 Q12 166 20 172 Q28 178 36 172 Q44 166 52 172 M4 186 Q12 180 20 186 Q28 192 36 186 Q44 180 52 186';
    const wavesR = 'M148 172 Q156 166 164 172 Q172 178 180 172 Q188 166 196 172 M148 186 Q156 180 164 186 Q172 192 180 186 Q188 180 196 186';
    const merlons = [64, 84, 104, 124].map(x => ar(x, 74, 12, 10)).join('');
    LESSONS.push({ id: 'a9-gate', cat: 'castles', level: 2, title: 'A castle drawbridge', ico: '🏰', need: P, tip: 'A moat is a ring of water around a castle. The bridge goes up to keep it safe!', steps: [
      ['Draw a wide rectangle wall with four bumps on top.', ar(60, 84, 80, 76) + merlons],
      ['Draw a tall tower on each side, with a little window.', apl('60,84 60,60 20,60 20,160 60,160') + apl('140,84 140,60 180,60 180,160 140,160') + ap('M36 100 V90 A4 4 0 0 1 44 90 V100 Z') + ap('M156 100 V90 A4 4 0 0 1 164 90 V100 Z')],
      ['Put a pointy cone roof and a flag on each tower.', apg('14,60 40,22 66,60') + apg('134,60 160,22 186,60') + al(40, 22, 40, 6) + apg('40,6 54,10 40,14') + al(160, 22, 160, 6) + apg('160,6 174,10 160,14')],
      ['Draw an arch door. Add the spiky gate, pulled up inside.', ap(gate) + al(82.7, 114, 117.3, 114) + apl('86,114 89,121 92,114 95,121 98,114 101,121 104,114 107,121 110,114 113,121 116,114') + al(90, 106.7, 90, 114) + al(100, 104, 100, 114) + al(110, 106.7, 110, 114)],
      ['Draw the drawbridge coming down toward you, with plank lines.', V(bridge) + al(74.1, 170, 125.9, 170) + al(67, 182, 133, 182)],
      ['Draw two chains from the wall down to the bridge.', chain(72, 104, 61, 192) + chain(128, 104, 139, 192)],
      ['Draw wavy water in the moat on both sides.', ap(wavesL) + ap(wavesR)],
      ['Color it in! Gray stones, blue water and a brown wooden bridge.', M(paint('#7CC0F0', ar(0, 160, 200, 40)) + paint('#B5BCC8', ar(60, 84, 80, 76) + merlons) + paint('#9AA1AB', ar(20, 60, 40, 100) + ar(140, 60, 40, 100)) + paint('#3B3B48', ap(gate + ' Z')) + paint('#6D9BD1', apg('14,60 40,22 66,60') + apg('134,60 160,22 186,60')) + paint('#F2604F', apg('40,6 54,10 40,14') + apg('160,6 174,10 160,14')) + paint('#B97A50', F(bridge)))]] });
  }
  {
    const helmet = circ(96, 52, 13), plume = pth('M96 39 Q86 22 70 26 Q80 30 88 40');
    const torso = rrect(84, 64, 24, 34, 8), hand = circ(110, 88, 4.5);
    const leg = bar(96, 92, 98, 130, 9), boot = ell(102, 132, 8, 4.5);
    const lance = bar(110, 88, 132, 12, 5), flag = poly([[130.3, 18.5], [128.1, 26.2], [151, 25]]);
    const head = ell(160, 82, 22, 11, 40), neck = pth('M116 104 L136 66 L152 72 L136 112 Z'), ear = poly('146,68 150,54 154,70');
    const body = ell(96, 120, 46, 24);
    const tail = pth('M52 112 Q28 118 32 150 Q40 136 54 126 Z');
    const legXs = [[70, 138, 64, 178], [84, 140, 84, 178], [110, 140, 110, 178], [124, 138, 128, 178]];
    const legs = legXs.map(([a, b, c, d]) => bar(a, b, c, d, 9));
    const hooves = legXs.map(([a, b, c, d]) => { const x = a + (c - a) * (172 - b) / (d - b); return al(f1(x - 4.5), 172, f1(x + 4.5), 172); }).join('');
    const manePts = Array.from({ length: 7 }, (_, i) => { const t = 0.3 + i * 0.1, x = 116 + 20 * t, y = 104 - 38 * t, k = i % 2 ? 7 : 0; return [x - 0.884 * k, y - 0.465 * k]; });
    const mane = poly(manePts, false);
    LESSONS.push({ id: 'a9-knight', cat: 'castles', level: 2, title: 'A knight on a horse', ico: '🐴', need: P, tip: 'Draw the knight first, then the horse around him. Front things come first!', steps: [
      ['Draw a round helmet with a slit for the eyes, and a feather on top.', V(helmet) + V(plume, [helmet]) + ar(88, 48, 16, 5, 2)],
      ['Draw a box body under the helmet, a round hand, and a leg with a boot.', V(torso, [helmet, hand]) + V(hand) + V(leg, [torso, boot]) + V(boot)],
      ['Draw a long lance with a little flag at the end.', V(lance, [hand]) + V(flag, [lance])],
      ['Draw the horse head: a long oval. Add the neck going down.', V(head) + V(neck, [head, body])],
      ['Add a pointy ear, an eye, a nose dot and a spiky mane.', V(ear, [head]) + ac(162, 78, 2.5) + ac(174, 94, 1.5) + V(mane, [head])],
      ['Draw a big oval body. Stop at the knight and the neck.', V(body, [torso, leg, boot, neck])],
      ['Draw four legs with hooves, and a swishy tail.', legs.map(l => V(l, [body])).join('') + hooves + V(tail, [body]) + al(20, 182, 190, 182)],
      ['Color your knight silver and the horse brown. Giddy-up!', M(paint(GRASS, ar(0, 182, 200, 18)) + paint('#C98A55', legs.map(F).join('') + F(body) + F(neck) + F(head) + F(ear)) + paint('#6B4A2B', F(tail)) + fat('#6B4A2B', 'M' + manePts.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' L'), 4) + paint('#C9D3E0', F(torso) + F(helmet) + F(leg) + F(hand)) + paint('#3B3B48', F(boot) + legXs.map(([a, b, c, d]) => { const x = a + (c - a) * (172 - b) / (d - b); return ar(f1(x - 4.5), 172, 9, 6); }).join('')) + paint('#F2604F', F(plume) + F(flag)) + paint('#E8C27A', F(lance)))]] });
  }
  {
    const roof = pth('M72 62 L100 14 L128 62 Q100 70 72 62 Z');
    const tower = pth('M80 60 L80 150 Q100 158 120 150 L120 60 Z');
    const hillD = 'M0 168 Q100 132 200 168', hillR = pth(hillD + ' L200 200 L0 200 Z');
    const braidL = 'M96 96 Q93 101 96 106 Q99 111 96 116 Q93 121 96 126', braidR = 'M104 96 Q101 101 104 106 Q107 111 104 116 Q101 121 104 126';
    const braidX = [100, 106, 112, 118, 124].map(y => al(96.5, y - 2, 103.5, y + 2)).join('');
    const tuft = 'M96 126 L92 134 L100 131 L108 134 L104 126';
    const bricks = ar(84, 110, 9, 5) + ar(108, 120, 9, 5) + ar(84, 72, 9, 5) + ar(110, 70, 8, 5) + ar(84, 138, 8, 5);
    const c1 = cloud(36, 36, 24, 12, 5, 0.25), c2 = cloud(162, 34, 24, 12, 5, 0.25);
    LESSONS.push({ id: 'a9-tower', cat: 'castles', level: 3, title: 'A tall tower on a hill', ico: '👸', need: P, tip: 'Who lives at the top of your tower? Draw their face in the window!', steps: [
      ['Draw a pointy cone roof with a curvy bottom, and a flag on top.', V(roof) + al(100, 14, 100, 2) + apg('100,2 114,6 100,10')],
      ['Draw the tall tower under the roof: two long lines and a curve at the bottom.', V(tower, [roof])],
      ['Draw a big hill. Stop at the tower.', V(pth(hillD), [tower])],
      ['Draw an arched window with a little face peeking out.', ap('M92 96 V84 A8 8 0 0 1 108 84 V96 L104 96 M96 96 L92 96') + ac(100, 88, 5) + ac(98, 87, 0.8) + ac(102, 87, 0.8) + ap('M95 85 Q100 79 105 85')],
      ['Draw a long braid hanging out of the window, like Rapunzel!', ap(braidL) + ap(braidR) + braidX + ap(tuft)],
      ['Draw a little door, some bricks and a path down the hill.', ap('M93 153 V144 A7 7 0 0 1 107 144 V153') + bricks + V(pth('M94 154 Q74 172 82 200'), [tower]) + V(pth('M106 154 Q104 176 124 200'), [tower])],
      ['Draw fluffy clouds and birds in the sky.', V(c1) + V(c2) + ap('M28 80 q5 -5 10 0 q5 -5 10 0 M150 70 q4 -4 8 0 q4 -4 8 0')],
      ['Color the tower and the hill. Let down your hair!', M(paint(SKY, ar(0, 0, 200, 200)) + paint(GRASS, F(hillR)) + paint('#E8DCC8', ap('M94 154 Q74 172 82 200 L124 200 Q104 176 106 154 Z')) + paint('#fff', F(c1) + F(c2)) + paint('#C9C1D9', F(tower)) + paint('#8E6CC9', F(roof)) + paint('#F78FB3', apg('100,2 114,6 100,10')) + paint('#3B3B48', ap('M92 96 V84 A8 8 0 0 1 108 84 V96 Z')) + paint('#F7D9B5', ac(100, 88, 5)) + paint('#FFD43B', ap(braidL + ' L104 126 Q101 121 104 116 Q107 111 104 106 Q101 101 104 96 Z') + ap(tuft + 'Z')) + paint('#B97A50', ap('M93 153 V144 A7 7 0 0 1 107 144 V153 Z')))]] });
  }

  /* ================= Garden ================= */
  {
    const mid = circ(100, 72, 22);
    const petals = Array.from({ length: 12 }, (_, i) => { const a = (i * 30 + 15) * DEG; return leaf(f1(100 + 18 * Math.cos(a)), f1(72 + 18 * Math.sin(a)), f1(100 + 50 * Math.cos(a)), f1(72 + 50 * Math.sin(a)), 11); });
    const seeds = []; for (let x = 86; x <= 114; x += 7) for (let y = 58; y <= 86; y += 7) if (Math.hypot(x - 100, y - 72) < 16) seeds.push(ac(x, y, 1.6));
    const lf1 = leaf(103, 146, 142, 124, 16), lf2 = leaf(97, 162, 58, 142, 16);
    const stemHide = petals.concat([mid]);
    LESSONS.push({ id: 'a9-sunflower', cat: 'garden', level: 1, title: 'A sunflower', ico: '🌻', need: P, tip: 'Sunflowers can grow taller than a grown-up!', steps: [
      ['Draw a circle for the middle.', V(mid)],
      ['Draw pointy petals all the way around. Count them: 12!', petals.map(p => V(p, [mid])).join('')],
      ['Fill the middle with tiny dots. These are the seeds.', seeds.join('')],
      ['Draw a tall stem going down: two straight lines.', V(seg(97, 100, 97, 186), stemHide.concat([lf2])) + V(seg(103, 100, 103, 186), stemHide.concat([lf1]))],
      ['Draw two big leaves on the stem.', V(lf1) + V(lf2)],
      ['Draw grass at the bottom.', ap([14, 24, 34, 56, 66, 132, 142, 152, 174, 184].map((x, i) => `M${x} 194 Q${x + 1} 184 ${x + (i % 2 ? 6 : -5)} 174`).join(' '))],
      ['Color the petals yellow and the middle brown. Sunflowers love the sun!', M(paint('#FFD43B', petals.map(F).join('')) + paint('#8B5A2B', F(mid)) + paint('#3E9A62', ar(97, 100, 6, 86) + F(lf1) + F(lf2)))]] });
  }
  {
    const cap = pth('M36 100 Q36 36 100 36 Q164 36 164 100 Q100 114 36 100 Z');
    const stem = pth('M74 102 Q70 150 64 178 L136 178 Q130 150 126 102 Z');
    const spots = [[70, 64, 9], [104, 52, 10], [136, 70, 8], [98, 84, 7], [54, 88, 5]].map(([x, y, r]) => ac(x, y, r)).join('');
    const cap2 = pth('M140 162 Q140 138 160 138 Q180 138 180 162 Q160 167 140 162 Z'), stem2 = pth('M152 162 L150 178 L170 178 L168 162 Z');
    LESSONS.push({ id: 'a9-mushroom', cat: 'garden', level: 1, title: 'A mushroom house', ico: '🍄', need: P, tip: 'Only pretend to eat mushrooms you find outside. Draw them instead!', steps: [
      ['Draw a big round dome for the mushroom cap, with a curvy bottom.', V(cap)],
      ['Draw a fat stem under it. Stop where it touches the cap.', V(stem, [cap])],
      ['Draw round spots on the cap.', spots],
      ['Draw a little arch door with a knob, and a round window.', ap('M88 178 V152 A12 12 0 0 1 112 152 V178') + ac(106, 166, 2) + ac(100, 124, 7) + al(93, 124, 107, 124) + al(100, 117, 100, 131)],
      ['Draw a baby mushroom next to it.', V(cap2) + V(stem2, [cap2])],
      ['Draw the ground and some grass.', al(8, 178, 64, 178) + al(136, 178, 150, 178) + al(170, 178, 192, 178) + ap('M20 178 l4 -10 l4 10 l4 -10 l4 10 M180 178 l3 -9 l3 9 l3 -9 l3 9')],
      ['Color the cap red with white spots. Who lives inside?', M(paint(GRASS, ar(0, 178, 200, 22)) + paint('#FBF0DC', F(stem) + F(stem2)) + paint('#F2604F', F(cap)) + paint('#F5A623', F(cap2)) + paint('#fff', spots) + paint('#B97A50', ap('M88 178 V152 A12 12 0 0 1 112 152 V178 Z')) + paint(SKY, ac(100, 124, 7)))]] });
  }
  {
    const rim = rect(60, 130, 80, 14);
    const lvs = [leaf(100, 104, 100, 36, 22), leaf(84, 110, 40, 74, 16), leaf(116, 110, 160, 74, 16), leaf(86, 124, 40, 118, 12), leaf(114, 124, 160, 118, 12)];
    const stems = [[100, 104], [84, 110], [116, 110], [86, 124], [114, 124]].map(([x, y], i) => al([100, 96, 104, 94, 106][i], 130, x, y)).join('');
    const ribs = [[100, 104, 100, 44], [84, 110, 47, 79], [116, 110, 153, 79], [86, 124, 48, 119], [114, 124, 152, 119]].map(([a, b, c, d]) => al(a, b, c, d)).join('');
    const zz = apl('72,164 80,158 88,164 96,158 104,164 112,158 120,164 128,158');
    LESSONS.push({ id: 'a9-potplant', cat: 'garden', level: 2, title: 'A leafy pot plant', ico: '🪴', need: P, tip: 'Plants need water and sunlight to grow, just like you need food!', steps: [
      ['Draw a long, thin box for the top of the pot.', V(rim)],
      ['Draw the pot under it. It gets narrower at the bottom. Add a little plate.', apl('66,144 74,188 126,188 134,144') + ar(66, 188, 68, 6, 3)],
      ['Draw five thin stems coming up out of the pot.', stems],
      ['Draw a big pointy leaf on the middle stem.', V(lvs[0])],
      ['Draw a leaf on each of the other stems.', lvs.slice(1).map(l => V(l)).join('')],
      ['Draw a line down the middle of each leaf, and a zig-zag on the pot.', ribs + zz],
      ['Color the pot orange and the leaves green.', M(paint('#E07B53', apg('66,144 74,188 126,188 134,144') + F(rim) + ar(66, 188, 68, 6, 3)) + paint('#3E9A62', lvs.map(F).join('')) + fat('#FFF3C4', 'M72 164 L80 158 L88 164 L96 158 L104 164 L112 158 L120 164 L128 158', 4))]] });
  }
  {
    const r1 = pth(`M10 100 Q100 86 190 100`), r2 = pth(`M10 152 Q100 138 190 152`);
    const carX = [50, 100, 150], cy1 = carX.map(x => f1(quadY(x, 100, 7)));
    const shoulders = carX.map((x, i) => ell(x, cy1[i], 10, 8));
    const fronds = carX.map((x, i) => { const y = cy1[i] - 8; return ap(`M${x} ${y} Q${x - 4} ${y - 12} ${x - 12} ${y - 20} M${x} ${y} Q${x} ${y - 14} ${x + 2} ${y - 24} M${x} ${y} Q${x + 4} ${y - 12} ${x + 12} ${y - 20}`); }).join('');
    const cab = [56, 144].map(x => circ(x, f1(quadY(x, 152, 7) - 12), 15)), rad = ell(100, 145, 9, 9);
    const cabLines = [56, 144].map(x => { const y = f1(quadY(x, 152, 7) - 12); return ap(`M${x - 10} ${y + 2} Q${x} ${y - 12} ${x + 10} ${y + 2} M${x - 5} ${y + 8} Q${x} ${y} ${x + 5} ${y + 8}`); }).join('');
    const pulled = pth('M58 174 Q50 182 58 190 L150 184 Z');
    const sun = ac(176, 26, 12) + around(8, 0, 176, 26, (x, y, a) => al(f1(176 + 16 * Math.cos(a)), f1(26 + 16 * Math.sin(a)), f1(176 + 22 * Math.cos(a)), f1(26 + 22 * Math.sin(a))));
    LESSONS.push({ id: 'a9-vegpatch', cat: 'garden', level: 2, title: 'A vegetable patch', ico: '🥕', need: P, tip: 'Carrots grow under the ground. You only see their green tops!', steps: [
      ['Draw three orange humps for the carrot tops, with leafy lines.', carX.map((x, i) => V(arcE(x, cy1[i], 10, 8, 180, 360))).join('') + fronds],
      ['Draw a long bumpy line of soil. Stop at the carrots.', V(r1, shoulders)],
      ['Draw two round cabbages and a little radish on the next row.', cab.map(c => V(c)).join('') + V(arcE(100, 145, 9, 9, 180, 360)) + ap('M100 136 Q96 126 90 122 M100 136 Q104 126 110 122')],
      ['Draw another soil line under them. Stop at the veggies.', V(r2, cab.concat([rad]))],
      ['Draw curvy leaf lines on the cabbages.', cabLines],
      ['Draw a carrot that was pulled out, lying on the ground.', V(pulled) + ap('M80 177 l4 3 M100 182 l-4 3 M118 181 l4 2 M134 184 l-3 -2') + ap('M54 180 Q42 170 30 172 M54 182 Q40 182 28 186 M55 186 Q44 192 36 196') + sun],
      ['Color the soil brown, the carrots orange and the cabbages green. Yum!', M(paint(SKY, ar(0, 0, 200, 100)) + paint('#B5895F', ap('M10 100 Q100 86 190 100 L200 100 L200 200 L0 200 L0 100 Z')) + paint('#9C7048', ap('M10 152 Q100 138 190 152 L200 152 L200 200 L0 200 L0 152 Z')) + paint('#FF9F43', carX.map((x, i) => F(poly(arcE(x, cy1[i], 10, 8, 180, 360).pts))).join('') + F(pulled)) + paint('#6CC08B', cab.map(F).join('')) + paint('#F06A8A', F(poly(arcE(100, 145, 9, 9, 180, 360).pts))) + paint(SUN, ac(176, 26, 12)) + fat('#3E9A62', 'M54 180 Q42 170 30 172 M54 182 Q40 182 28 186 M55 186 Q44 192 36 196', 4))]] });
  }
  {
    const can = pth('M120 118 L172 118 L168 170 L124 170 Z');
    const handleR = pth('M164 124 Q194 124 190 150 Q188 164 168 162 L169 155 Q178 156 180 148 Q182 134 170 132 Z');
    const rose = ell(86, 116, 5, 10, 45), spout = bar(126, 156, 90, 120, 9);
    const drops = [[72, 122], [62, 128], [78, 134], [68, 140]].map(([x, y]) => pth(dropD(x, y, 0.4)));
    const flowers = [[24, 152], [52, 146], [84, 160]];
    const fl = flowers.map(([cx, cy]) => {
      const c = circ(cx, cy, 5), ps = Array.from({ length: 6 }, (_, i) => { const a = i * 60 * DEG; return ell(f1(cx + 10 * Math.cos(a)), f1(cy + 10 * Math.sin(a)), 6, 3.5, i * 60); });
      return { c, ps, stem: seg(cx, cy, cx, 184), lf: leaf(cx, 176, cx + 12, 166, 7) };
    });
    const flowerShapes = fl.flatMap(f => [f.c, f.lf].concat(f.ps)), stemBars = fl.map(f => bar(f.stem.pts[0][0], f.stem.pts[0][1], f.stem.pts[0][0], 184, 4));
    const pickets = Array.from({ length: 9 }, (_, i) => { const x = 4 + i * 22; return poly([[x, 184], [x, 98], [x + 7, 90], [x + 14, 98], [x + 14, 184]], false); });
    const picketF = Array.from({ length: 9 }, (_, i) => { const x = 4 + i * 22; return poly([[x, 184], [x, 98], [x + 7, 90], [x + 14, 98], [x + 14, 184]]); });
    const front = flowerShapes.concat(stemBars, [can, handleR, rose, spout], drops);
    const rails = [112, 160].map(y => V(seg(0, y, 200, y), picketF.concat(front))).join('');
    LESSONS.push({ id: 'a9-garden', cat: 'garden', level: 3, title: 'Watering the garden', ico: '🚿', need: P, tip: 'Draw the things in front first. The fence goes behind everything!', steps: [
      ['Draw the watering can: a box that is a bit narrower at the bottom.', V(can)],
      ['Draw a curved handle on the back.', V(handleR, [can])],
      ['Draw a long spout and a sprinkler head on the end.', V(spout, [can, rose]) + V(rose)],
      ['Draw water drops sprinkling out.', drops.map(d => V(d)).join('')],
      ['Draw three daisies: a dot middle, petals all around, and a stem with a leaf.', fl.map(f => V(f.c) + f.ps.map(p => V(p, [f.c])).join('') + V(f.stem, [f.c].concat(f.ps)) + V(f.lf)).join('')],
      ['Draw a picket fence behind. Stop at the flowers and the can.', pickets.map(p => V(p, front)).join('') + rails],
      ['Draw a sun in the sky and the ground.', ac(30, 30, 12) + around(8, 0, 30, 30, (x, y, a) => al(f1(30 + 16 * Math.cos(a)), f1(30 + 16 * Math.sin(a)), f1(30 + 22 * Math.cos(a)), f1(30 + 22 * Math.sin(a)))) + al(0, 184, 200, 184)],
      ['Color your garden. Splish, splash, the flowers drink it up!', M(paint(SKY, ar(0, 0, 200, 184)) + paint(GRASS, ar(0, 184, 200, 16)) + paint('#FBF6EC', picketF.map(F).join('')) + paint(SUN, ac(30, 30, 12)) + paint('#6D9BD1', F(can) + F(handleR) + F(spout) + F(rose)) + paint('#9CCBF5', drops.map(F).join('')) + paint('#3E9A62', fl.map(f => F(f.lf) + F(bar(f.stem.pts[0][0], f.stem.pts[0][1], f.stem.pts[0][0], 184, 3))).join('')) + paint('#fff', fl.flatMap(f => f.ps).map(F).join('')) + paint('#FFD43B', fl.map(f => F(f.c)).join('')))]] });
  }

  /* ================= Silly creatures ================= */
  {
    const body = fur(100, 112, 62, 58, 26, 8);
    const hornL = poly('74,72 62,30 90,66'), hornR = poly('126,72 138,30 110,66');
    const eyes = ac(80, 98, 15) + ac(122, 94, 11), pupils = ac(83, 100, 6) + ac(124, 96, 4.5);
    const mouth = pth('M70 128 Q100 158 132 128 Z'), fangs = apg('80,128 86,138 92,128') + apg('110,128 116,138 122,128');
    const feet = [ell(76, 172, 16, 8), ell(124, 172, 16, 8)], arms = [ell(34, 118, 10, 18, -30), ell(166, 118, 10, 18, 30)];
    LESSONS.push({ id: 'a9-fluffy', cat: 'creatures', level: 1, title: 'A fluffy monster', ico: '👹', need: P, tip: 'Spiky edges make things look furry. Try it on a cat or a bear too!', steps: [
      ['Draw a big fuzzy shape with little spikes all around. That is the fur!', V(body)],
      ['Draw two pointy horns on top. Stop at the fur.', V(hornL, [body]) + V(hornR, [body])],
      ['Draw two big eyes, one bigger than the other, with dark middles.', eyes + pupils],
      ['Draw a big smile with two little fangs.', V(mouth) + fangs],
      ['Draw two arms and two feet poking out of the fur.', arms.concat(feet).map(s => V(s, [body])).join('')],
      ['Color your monster! Purple fur and yellow horns? Your monster, your colors!', M(paint('#B39DDB', F(body) + arms.map(F).join('') + feet.map(F).join('')) + paint('#FFD43B', F(hornL) + F(hornR)) + paint('#fff', eyes) + paint(NAVY, pupils) + paint('#E85C68', F(mouth)) + paint('#fff', fangs))]] });
  }
  {
    const body = pth('M100 46 C138 46 150 104 150 138 C150 168 50 168 50 138 C50 104 62 46 100 46 Z');
    const eye = circ(100, 92, 24), iris = circ(100, 95, 11);
    const feet = [ell(70, 162, 10, 6), ell(100, 165, 10, 6), ell(130, 162, 10, 6)];
    const tail = pth('M148 130 Q176 132 178 112 Q178 100 168 102 Q162 106 168 110');
    const spots = ac(66, 118, 5) + ac(136, 116, 6) + ac(72, 144, 4) + ac(128, 142, 4);
    const bowl = pth('M152 170 L194 170 Q192 190 173 190 Q154 190 152 170 Z');
    LESSONS.push({ id: 'a9-alienpet', cat: 'creatures', level: 1, title: 'A one-eyed alien pet', ico: '👽', need: P, tip: 'Give your alien pet a name. What would it eat for dinner?', steps: [
      ['Draw a tall bean shape for the body, round at the bottom.', V(body)],
      ['Draw ONE giant eye in the middle, with a big dark middle and a shine.', V(eye) + V(iris) + ac(104, 90, 3.5)],
      ['Draw two bendy antennae with balls on the ends.', V(pth('M88 50 Q80 32 70 24'), [body]) + ac(66, 21, 5) + V(pth('M112 50 Q120 32 130 24'), [body]) + ac(134, 21, 5)],
      ['Draw a happy smile with one little tooth.', ap('M84 132 Q100 144 116 132') + apg('97,137.5 100,142 103,137.5')],
      ['Draw three little feet and a curly tail.', feet.map(f => V(f, [body])).join('') + V(tail, [body])],
      ['Draw spots on its body, and a food bowl next to it.', spots + V(bowl) + ap('M156 170 Q160 162 166 168 Q172 160 178 168 Q184 162 190 170') + star(173, 180, 5)],
      ['Color your alien pet. Green with purple spots? Zorp zorp!', M(paint('#8ED16F', F(body) + feet.map(F).join('')) + fat('#8ED16F', visD(tail), 6) + paint('#fff', F(eye)) + paint('#8E6CC9', F(iris) + spots + ac(66, 21, 5) + ac(134, 21, 5)) + paint('#F2604F', F(bowl)) + paint('#C99A6E', ap('M156 170 Q160 162 166 168 Q172 160 178 168 Q184 162 190 170 Z')))]] });
  }
  {
    const snout = rrect(158, 66, 30, 22, 6), head = rrect(116, 46, 50, 44, 8), ear = rrect(108, 52, 14, 28, 5);
    const body = rrect(40, 100, 110, 44, 10);
    const legXs = [52, 72, 112, 130], legs = legXs.map(x => rect(x, 144, 14, 28)), feet = legXs.map(x => rrect(x - 4, 170, 22, 8, 3));
    const heart = 'M95 132 C83 124 83 114 89 114 C92 114 95 117 95 120 C95 117 98 114 101 114 C107 114 107 124 95 132 Z';
    LESSONS.push({ id: 'a9-robodog', cat: 'creatures', level: 2, title: 'A robot dog', ico: '🐕', need: P, tip: 'Robots are made of boxes. Rounded corners make them look friendly!', steps: [
      ['Draw a small box with round corners for the nose.', V(snout)],
      ['Draw a bigger box behind it for the head. Stop at the nose.', V(head, [snout])],
      ['Draw a dot nose, a mouth, square eyes, a floppy ear and an antenna.', ac(182, 72, 3.5) + al(166, 80, 184, 80) + al(172, 80, 172, 84) + al(178, 80, 178, 84) + ar(126, 58, 10, 10, 2) + ar(144, 58, 10, 10, 2) + V(ear, [head]) + al(140, 46, 140, 32) + ac(140, 28, 4)],
      ['Draw a short neck and a long body box.', ar(130, 90, 16, 10) + V(body)],
      ['Draw four legs with flat feet.', legs.map(l => V(l, feet)).join('') + feet.map(f => V(f)).join('')],
      ['Draw a springy tail, a heart on the body and some bolts.', apl('40,112 36,104 32,110 28,100 24,106 20,96') + ac(17, 92, 5) + ap(heart) + ac(48, 108, 2) + ac(142, 108, 2) + ac(48, 136, 2) + ac(142, 136, 2)],
      ['Color it shiny silver and blue. Beep-boop, woof!', M(paint('#C9D3E0', F(body) + F(head) + ar(130, 90, 16, 10) + legs.map(F).join('')) + paint('#6D9BD1', F(snout) + F(ear) + feet.map(F).join('')) + paint('#F2604F', ap(heart) + ac(140, 28, 4) + ac(17, 92, 5)) + paint(SUN, ar(126, 58, 10, 10, 2) + ar(144, 58, 10, 10, 2)) + paint(NAVY, ac(182, 72, 3.5)))]] });
  }
  {
    const head = circ(64, 92, 30), earL = poly('40,76 38,46 62,64'), earR = poly('88,76 90,46 66,64');
    const body = ell(122, 96, 46, 28), tail = poly('160,96 192,66 184,96 192,126');
    const finT = pth('M104 71 Q120 46 140 71 Z'), finB = pth('M110 121 Q118 142 132 121 Z');
    const paws = [ell(54, 124, 9, 6), ell(76, 124, 9, 6)];
    const scales = [[112, 90], [128, 82], [128, 104], [144, 94]].map(([x, y]) => ap(`M${x} ${y - 8} q8 8 0 16`)).join('');
    LESSONS.push({ id: 'a9-catfish', cat: 'creatures', level: 2, title: 'A cat-fish mix-up', ico: '🐱', need: P, tip: 'Mix any two animals! A dog-bird? A pig-butterfly? You choose!', steps: [
      ['Draw a circle for the cat head.', V(head)],
      ['Add two pointy cat ears. Stop where they touch the head.', V(earL, [head]) + V(earR, [head])],
      ['Draw cat eyes, a little nose, a mouth and whiskers.', ae(52, 90, 5, 7) + ae(76, 90, 5, 7) + ae(52, 90, 1.5, 5) + ae(76, 90, 1.5, 5) + apg('60,102 68,102 64,107') + ap('M64 107 Q60 113 55 110 M64 107 Q68 113 73 110') + al(26, 100, 46, 104) + al(24, 110, 46, 108) + al(80, 104, 90, 102) + al(80, 108, 89, 110)],
      ['Now the silly part! Draw a fish body behind the head. Stop where it touches.', V(body, [head])],
      ['Draw a fish tail at the end, and two fins.', V(tail, [body]) + V(finT, [body]) + V(finB, [body])],
      ['Draw scales on the fish part, two little paws and some bubbles.', scales + paws.map(p => V(p, [head, body])).join('') + ac(22, 40, 6) + ac(36, 22, 4) + ac(14, 64, 3)],
      ['Color it in! A cat-fish says meow-blub!', M(paint('#9CCBF5', ar(0, 0, 200, 200)) + paint('#3FB6A8', F(tail) + F(finT) + F(finB)) + paint('#7FD1C7', F(body)) + paint('#F5A623', paws.map(F).join('') + F(earL) + F(earR) + F(head)) + paint('#F78FB3', apg('60,102 68,102 64,107')) + paint('#EAF4FD', ac(22, 40, 6) + ac(36, 22, 4) + ac(14, 64, 3)))]] });
  }
  {
    const head = ell(66, 50, 26, 16), hornA = poly('52,38 48,24 60,36'), hornB = poly('62,36 64,22 72,36');
    const neckB = pth('M48 60 Q30 100 40 140'), neckF = pth('M78 62 Q62 104 76 140');
    const neckR = pth('M48 60 Q30 100 40 140 L40 150 L76 150 L76 140 Q62 104 78 62 Z');
    const h1 = ell(112, 140, 20, 26), h2 = ell(156, 140, 16, 18);
    const tailD = 'M176 140 Q180 116 196 106 Q194 124 190 140', tailR = pth(tailD + ' L190 150 L176 150 Z');
    let wd = 'M0 140'; for (let x = 0; x < 200; x += 20) wd += ` Q${x + 5} 136 ${x + 10} 140 Q${x + 15} 144 ${x + 20} 140`;
    const water = pth(wd);
    const spike = (cx, cy, r, a) => { const p = d => [cx + r * Math.cos(d * DEG), cy + r * Math.sin(d * DEG)], b1 = p(a - 8), b2 = p(a + 8), t = [cx + (r + 9) * Math.cos(a * DEG), cy + (r + 9) * Math.sin(a * DEG)]; return apl([b1, t, b2].map(q => f1(q[0]) + ',' + f1(q[1])).join(' ')); };
    const spikes = [235, 270, 305].map(a => spike(112, 140, 20, a)).join('');
    const spots = ac(46, 96, 3) + ac(52, 116, 4) + ac(58, 84, 2.5) + ac(104, 134, 3) + ac(120, 134, 3) + ac(156, 132, 3);
    const lowWaves = ap('M10 162 Q20 156 30 162 Q40 168 50 162 M90 170 Q100 164 110 170 Q120 176 130 170 M150 160 Q160 154 170 160 Q180 166 190 160 M30 186 Q40 180 50 186 Q60 192 70 186 M130 188 Q140 182 150 188 Q160 194 170 188');
    LESSONS.push({ id: 'a9-seamonster', cat: 'creatures', level: 3, title: 'A friendly sea monster', ico: '🐉', need: P, tip: 'We only see the humps above the water. The rest is hiding under the waves!', steps: [
      ['Draw an oval head with two little horns. Stop the horns at the head.', V(head) + V(hornA, [head]) + V(hornB, [head])],
      ['Draw an eye, a nose dot and a big friendly smile.', ac(72, 44, 4) + ac(73, 44, 1.5) + ac(86, 46, 1.5) + ap('M72 56 Q82 60 90 52')],
      ['Draw a long curvy neck going down into the water.', V(neckB, [head]) + V(neckF, [head])],
      ['Draw two round humps: a big one and a small one.', V(arcE(112, 140, 20, 26, 180, 360)) + V(arcE(156, 140, 16, 18, 180, 360))],
      ['Draw the tip of the tail poking out at the end.', ap(tailD)],
      ['Draw a wavy water line. Stop at the monster, so it looks like it is swimming!', V(water, [neckR, h1, h2, tailR])],
      ['Draw spikes on the big hump, spots, and more waves.', spikes + spots + lowWaves],
      ['Color your sea monster. Is it green, purple or rainbow?', M(paint(SKY, ar(0, 0, 200, 140)) + paint('#6DB3F2', ap(wd + ' L200 200 L0 200 Z')) + paint('#6CC08B', F(head) + ap('M48 60 Q30 100 40 140 L76 140 Q62 104 78 62 Z') + F(poly(arcE(112, 140, 20, 26, 180, 360).pts)) + F(poly(arcE(156, 140, 16, 18, 180, 360).pts)) + ap(tailD + ' Z')) + paint('#FFD43B', F(hornA) + F(hornB)) + paint('#3E9A62', spots))]] });
  }
}/*}lazy*/);
