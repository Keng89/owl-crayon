/* ---------- art10: furniture & rooms, houses & homes, landscape drawing & painting ---------- */
// Uses the helpers from art.js (ac, ae, al, ap, ar, apg, apl, guide, paint, stroke).
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

  /* ---- little helpers for this batch ---- */
  const Vs = (arr, hide, keep) => arr.map(s => V(s, hide, keep)).join('');
  const Fs = arr => arr.map(F).join('');
  const PR = 'Paper, a pencil, an eraser and crayons';
  const PRR = 'Paper, a pencil, a ruler, an eraser and crayons';
  const WOOD = '#D9A86C', WOODD = '#9C6B43', CREAM = '#FFF3C4', RED = '#F2604F', BLUE = '#6DB3F2', LBLUE = '#9CCBF5', PINK = '#F78FB3';
  const TEAL = '#3FB6A8', PURPLE = '#A98BE8', WALL = '#FBE3C8', FLOOR = '#E8C27A', GRAY = '#C9D3E0', ORANGE = '#F5A623', DKGREEN = '#2F8F5B';
  // Where the line a→b crosses the line c→d.
  const cross = (a, b, c, d) => {
    const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]], den = r[0] * s[1] - r[1] * s[0];
    const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den;
    return [f1(a[0] + t * r[0]), f1(a[1] + t * r[1])];
  };
  const lerp = (a, b, t) => [f1(a[0] + (b[0] - a[0]) * t), f1(a[1] + (b[1] - a[1]) * t)];
  const L2 = (a, b) => al(a[0], a[1], b[0], b[1]);
  const pts = arr => arr.map(p => p.join(',')).join(' ');
  // A row of short parallel strokes (hatching) inside a shape.
  const hatch = (x0, x1, y0, y1, gap, slant, keep, hide = []) => { let s = ''; for (let x = x0; x <= x1; x += gap) s += V(seg(f1(x), y0, f1(x + slant), y1), hide, keep); return s; };
  // A little flower: a centre and 5 round petals.
  const bloom = (x, y, r = 4) => around(5, r * 1.5, x, y, (px, py) => ac(px, py, r)) + ac(x, y, r * 0.8);
  // Grass tufts.
  const tuft = (x, y, s = 1) => ap(`M${x - 5 * s} ${y} Q${x - 4 * s} ${y - 6 * s} ${x - 6 * s} ${y - 10 * s} M${x} ${y} Q${x} ${y - 8 * s} ${x + 1 * s} ${y - 13 * s} M${x + 5 * s} ${y} Q${x + 5 * s} ${y - 6 * s} ${x + 8 * s} ${y - 9 * s}`);
  // A fluffy tree top on a trunk.
  const ptree = (x, y, s = 1) => ({ top: cloud(x, y - 26 * s, 20 * s, 18 * s, 7, 0.22), trunk: rect(x - 4 * s, y - 14 * s, 8 * s, 14 * s) });
  // A pointy pine tree: three stacked triangles and a trunk.
  const pineD = (x, y, h) => { const w = h * 0.42; return `M${x} ${f1(y - h)} L${f1(x + w * 0.55)} ${f1(y - h * 0.62)} L${f1(x + w * 0.3)} ${f1(y - h * 0.62)} L${f1(x + w * 0.8)} ${f1(y - h * 0.3)} L${f1(x + w * 0.5)} ${f1(y - h * 0.3)} L${f1(x + w)} ${f1(y - h * 0.08)} L${f1(x - w)} ${f1(y - h * 0.08)} L${f1(x - w * 0.5)} ${f1(y - h * 0.3)} L${f1(x - w * 0.8)} ${f1(y - h * 0.3)} L${f1(x - w * 0.3)} ${f1(y - h * 0.62)} L${f1(x - w * 0.55)} ${f1(y - h * 0.62)} Z`; };
  const pine = (x, y, h) => pth(pineD(x, y, h));
  const twinkle = (x, y, r) => al(x - r, y, x + r, y) + al(x, y - r, x, y + r);
  const flake = (x, y, r) => around(3, r, x, y, (px, py) => al(px, py, f1(2 * x - px), f1(2 * y - py)), -90);

  ART_CATS.push(
    { id: 'rooms', name: 'Furniture & Rooms', ico: '🛋️', blurb: 'Chairs, beds, sofas, kitchens and whole rooms' },
    { id: 'homes', name: 'Houses & Homes', ico: '🏡', blurb: 'Cottages, barns, igloos, treehouses and streets' },
    { id: 'landscapes', name: 'Landscape Drawing & Painting', ico: '🏞️', blurb: 'Hills, mountains, lakes, skies and seasons' }
  );

  /* ================= Furniture & Rooms ================= */
  {
    const seat = rect(52, 104, 96, 14), pL = rect(58, 34, 10, 70), pR = rect(132, 34, 10, 70), r1 = rect(68, 42, 64, 14), r2 = rect(68, 72, 64, 8);
    const fl = [rect(56, 118, 10, 62), rect(134, 118, 10, 62)], bl = [rect(76, 118, 7, 46), rect(117, 118, 7, 46)];
    const rug = ell(100, 182, 84, 10), heart = 'M100 54 Q91 47 95 44 Q98 42 100 46 Q102 42 105 44 Q109 47 100 54 Z';
    LESSONS.push({ id: 'a10-chair', cat: 'rooms', level: 1, title: 'A wooden chair', ico: '🪑', need: P, tip: 'Look at a real chair. Can you find the seat, the back and the legs?', steps: [
      ['Draw a long, flat box in the middle. This is the seat.', V(seat)],
      ['Draw two tall posts going up from the seat.', V(pL) + V(pR)],
      ['Draw two bars across, between the posts. Now the chair has a back!', V(r1) + V(r2)],
      ['Draw two long legs at the front. Draw two short legs peeking out behind.', Vs(fl) + Vs(bl)],
      ['Draw a heart on the top bar, and a round rug under the chair.', ap(heart) + V(rug, fl.concat(bl))],
      ['Color your chair like wood, with a bright rug. Take a seat!', M(paint(PINK, F(rug)) + paint(WOODD, Fs(bl)) + paint(WOOD, F(seat) + F(pL) + F(pR) + F(r1) + F(r2) + Fs(fl)) + paint(RED, ap(heart)))]] });
  }
  {
    const top = rect(20, 100, 160, 12), legs = [rect(32, 112, 12, 72), rect(156, 112, 12, 72)], bar = rect(44, 152, 112, 7);
    const vase = pth('M88 100 Q76 86 90 74 L92 64 L108 64 L110 74 Q124 86 112 100 Z');
    const stems = ap('M96 64 Q90 50 78 38 M100 64 V30 M104 64 Q112 50 122 40');
    const apple = circ(46, 90, 10), orange = circ(152, 91, 9);
    LESSONS.push({ id: 'a10-table', cat: 'rooms', level: 1, title: 'A table with flowers', ico: '💐', need: P, tip: 'Put a real vase or cup on a table and draw what you see!', steps: [
      ['Draw a long, flat rectangle. This is the table top.', V(top)],
      ['Draw a straight leg going down from each end.', Vs(legs)],
      ['Draw a bar between the legs, low down. It keeps the table strong.', V(bar)],
      ['Draw a vase in the middle of the table. It is round at the bottom with a thin neck.', V(vase)],
      ['Draw three stems coming out of the vase, with a flower on each one.', stems + bloom(76, 35) + bloom(100, 26) + bloom(124, 37)],
      ['Draw an apple and an orange on the table.', V(apple) + V(orange) + ap('M46 80 Q47 75 50 73') + ap('M48 79 Q54 74 58 78 Q53 82 48 79 Z')],
      ['Color it in! A wooden table, a blue vase and bright flowers.', M(paint(WOOD, F(top) + Fs(legs) + F(bar)) + paint(BLUE, F(vase)) + paint(RED, F(apple) + bloom(100, 26)) + paint(ORANGE, F(orange)) + paint(PINK, bloom(76, 35) + bloom(124, 37)) + paint(SUN, ac(76, 35, 3.2) + ac(100, 26, 3.2) + ac(124, 37, 3.2)) + fat('#2FA36B', 'M96 64 Q90 50 78 38 M100 64 V30 M104 64 Q112 50 122 40', 3))]] });
  }
  {
    const head = rrect(14, 62, 22, 120, 9), foot = rrect(164, 100, 22, 82, 9);
    const pillow = ell(58, 102, 20, 9);
    const blanketD = 'M80 104 Q120 96 168 104 L168 140 Q156 147 144 140 Q132 147 120 140 Q108 147 96 140 Q88 145 80 140 Z';
    const blanket = pth(blanketD), matt = rect(32, 110, 136, 22), base = rect(32, 132, 136, 16);
    const dots = [[98, 116], [118, 112], [140, 116], [158, 112], [108, 128], [130, 128], [152, 128]];
    LESSONS.push({ id: 'a10-bed', cat: 'rooms', level: 1, title: 'A comfy bed', ico: '🛏️', need: P, tip: 'Draw the things in front first. Then the things behind them stop when they touch.', steps: [
      ['Draw a tall board with round corners on the left. This is the headboard.', V(head)],
      ['Draw a shorter board on the right. This is the footboard.', V(foot)],
      ['Draw a soft oval pillow next to the headboard.', V(pillow, [head])],
      ['Draw a big blanket with a wavy edge. It hangs down over the side.', V(blanket, [foot])],
      ['Draw the mattress and bed under them. Stop at the pillow and blanket.', V(matt, [head, foot, pillow, blanket]) + V(base, [head, foot, blanket])],
      ['Draw happy dots and stars on the blanket. Sweet dreams!', dots.map(([x, y], i) => i % 2 ? star(x, y, 5) : ac(x, y, 3)).join('')],
      ['Color your bed. What color is your own blanket?', M(paint(WOOD, F(head) + F(foot)) + paint(WOODD, F(base)) + paint('#fff', F(matt)) + paint(CREAM, F(pillow)) + paint(LBLUE, F(blanket)) + paint(SUN, dots.map(([x, y], i) => i % 2 ? star(x, y, 5) : ac(x, y, 3)).join('')))]] });
  }
  {
    const shade = poly('70,40 130,40 152,96 48,96'), stem = rect(96, 96, 8, 46), base = pth('M70 156 Q70 140 100 140 Q130 140 130 156 Z');
    const table = rect(26, 156, 148, 10), legs = [rect(36, 166, 10, 30), rect(154, 166, 10, 30)];
    const rays = al(42, 100, 22, 110) + al(158, 100, 178, 110) + al(56, 108, 44, 124) + al(144, 108, 156, 124);
    LESSONS.push({ id: 'a10-lamp', cat: 'rooms', level: 1, title: 'A glowing lamp', ico: '💡', need: P, tip: 'Use yellow next to the lamp to make it glow. Light colors look bright!', steps: [
      ['Draw a shape like a bucket upside down: small on top, wide at the bottom. This is the lampshade.', V(shade)],
      ['Draw a thin stick under the shade, and a round base like a hill.', V(stem) + V(base, [stem])],
      ['Draw a table under the lamp, with two legs.', V(table) + Vs(legs)],
      ['Draw stripes on the shade, and a pull string with a bead.', V(seg(88, 40, 82, 96)) + V(seg(100, 40, 100, 96)) + V(seg(112, 40, 118, 96)) + al(126, 96, 126, 118) + ac(126, 122, 3.5)],
      ['Draw short lines shining out from under the shade. The lamp is on!', rays],
      ['Color a soft yellow glow, then color the lamp. Click!', M(paint(CREAM, apg('48,96 152,96 180,156 20,156')) + paint(SUN, F(shade)) + paint(TEAL, F(stem) + F(base)) + paint(WOOD, F(table) + Fs(legs)) + paint(RED, ac(126, 122, 3.5)))]] });
  }
  {
    const c1 = rrect(44, 108, 56, 26, 6), c2 = rrect(100, 108, 56, 26, 6), armL = rrect(14, 84, 30, 80, 12), armR = rrect(156, 84, 30, 80, 12);
    const back = rrect(30, 58, 140, 54, 12), base = rect(40, 134, 120, 26), legs = [rect(22, 164, 8, 12), rect(170, 164, 8, 12)];
    const pl = pth('M48 70 Q64 64 80 72 Q76 88 80 104 Q64 98 48 104 Q52 88 48 70 Z'), pr = pth('M152 70 Q136 64 120 72 Q124 88 120 104 Q136 98 152 104 Q148 88 152 70 Z');
    const rug = ell(100, 182, 92, 11);
    LESSONS.push({ id: 'a10-sofa', cat: 'rooms', level: 2, title: 'A cozy sofa', ico: '🛋️', need: PR, tip: 'Round corners make furniture look soft and squishy. Sharp corners look hard.', steps: [
      ['Draw two soft seat cushions side by side. Give them round corners.', V(c1) + V(c2, [c1])],
      ['Draw a fat round arm on each side.', V(armL, [c1]) + V(armR, [c2])],
      ['Draw the back of the sofa behind. Stop when you touch the arms and cushions.', V(back, [armL, armR, c1, c2])],
      ['Draw the bottom of the sofa under the cushions. Add two little legs.', V(base, [armL, armR]) + Vs(legs)],
      ['Draw two puffy pillows leaning on the back.', V(pl) + V(pr)],
      ['Draw stripes on the pillows and buttons on the back.', al(56, 82, 74, 82) + al(56, 92, 74, 92) + al(126, 82, 144, 82) + al(126, 92, 144, 92) + ac(100, 72, 2.5) + ac(100, 92, 2.5)],
      ['Draw a fluffy rug under the sofa. Stop at the legs.', V(rug, legs.concat([armL, armR, base]))],
      ['Color your sofa. Try a cool color for the sofa and warm colors for the pillows!', M(paint(PURPLE, F(rug)) + paint(TEAL, F(back) + F(armL) + F(armR) + F(base)) + paint('#7FD1C7', F(c1) + F(c2)) + paint(ORANGE, F(pl)) + paint(PINK, F(pr)) + paint(WOODD, Fs(legs)))]] });
  }
  {
    const outer = rect(40, 30, 120, 160), inner = rect(48, 38, 104, 144), sh = [rect(48, 82, 104, 6), rect(48, 130, 104, 6)];
    const row = (y, list) => list.map(([x, w, h]) => rect(x, y - h, w, h));
    const b1 = row(82, [[50, 10, 36], [60, 9, 40], [69, 12, 31], [81, 9, 38]]), lean = poly('92,82 101,82 121,52 112,48');
    const b2 = row(130, [[50, 12, 34], [62, 10, 38], [72, 9, 30], [81, 14, 36], [95, 8, 40], [103, 10, 33]]), flat = [rect(118, 122, 30, 8), rect(121, 114, 25, 8), rect(119, 106, 28, 8)];
    const b3 = row(182, [[50, 14, 40], [64, 10, 36], [74, 12, 42]]), basket = rect(98, 152, 48, 30);
    const pot = poly('130,82 146,82 148,68 128,68'), cact = pth('M134 68 V52 Q138 44 142 52 V68 Z');
    const tpot = poly('86,30 104,30 106,16 84,16'), lv = [leaf(95, 16, 80, 2, 4), leaf(95, 16, 96, -6, 4), leaf(95, 16, 111, 2, 4)];
    const COLS = [RED, BLUE, SUN, TEAL, PINK, PURPLE, ORANGE];
    const books = b1.concat([lean], b2, flat, b3);
    LESSONS.push({ id: 'a10-bookshelf', cat: 'rooms', level: 2, title: 'A bookshelf full of books', ico: '📚', need: PR, tip: 'Make every book a little different: tall, short, thin, fat. That looks real!', steps: [
      ['Draw a tall box. Draw a smaller box inside it. This is the bookcase.', V(outer) + V(inner)],
      ['Draw two thick shelves across, to make three rows.', Vs(sh)],
      ['Fill the top shelf with tall and short books. Make one book lean over!', Vs(b1) + V(lean)],
      ['Draw a little cactus in a pot next to the books.', V(pot) + V(cact, [pot])],
      ['Fill the middle shelf. Lay some books flat in a pile.', Vs(b2) + Vs(flat)],
      ['On the bottom shelf, draw three big books and a toy basket.', Vs(b3) + V(basket) + apl('98,160 106,154 114,160 122,154 130,160 138,154 146,160')],
      ['Draw lines on the book spines, and a plant on top of the bookcase.', [[50, 10, 82], [69, 12, 82], [62, 10, 130], [81, 14, 130], [50, 14, 182], [74, 12, 182]].map(([x, w, y]) => al(x + 2, y - 8, x + w - 2, y - 8)).join('') + V(tpot) + Vs(lv, [tpot])],
      ['Color the books in a rainbow of colors!', M(paint('#F3E2C4', F(inner)) + paint(WOOD, F(outer) + Fs(sh)) + books.map((b, i) => paint(COLS[i % COLS.length], F(b))).join('') + paint('#E8C27A', F(basket)) + paint(RED, F(pot) + F(tpot)) + paint('#6CC08B', F(cact) + Fs(lv)))]] });
  }
  {
    const counter = rect(10, 110, 180, 8), lower = rect(10, 118, 180, 62), oven = rect(70, 124, 60, 50), ovw = rect(80, 140, 40, 26);
    const doors = [rect(16, 124, 24, 50), rect(40, 124, 24, 50), rect(136, 124, 24, 50), rect(160, 124, 24, 50)];
    const pot = rect(82, 90, 36, 20), lid = pth('M80 90 Q100 78 120 90 Z'), tap = pth('M156 110 V94 Q156 88 162 88 H170 V93 H162 V110 Z');
    const ups = [rect(10, 18, 54, 46), rect(136, 18, 54, 46)], win = rect(76, 22, 48, 40);
    const tiles = []; for (let x = 0; x < 200; x += 20) for (let r = 0; r < 1; r++) tiles.push(rect(x, 180, 20, 20));
    LESSONS.push({ id: 'a10-kitchen', cat: 'rooms', level: 2, title: 'A little kitchen', ico: '🍳', need: PR, tip: 'Look around your own kitchen. What would you add: a fridge, a cat, a cake?', steps: [
      ['Draw a long, thin box across the middle. This is the counter top.', V(counter)],
      ['Draw a big box under it for the cupboards. Draw the floor line under that.', V(lower) + al(0, 180, 200, 180)],
      ['Draw an oven door in the middle, with a window and a handle.', V(oven) + V(ovw) + al(80, 131, 120, 131)],
      ['Draw cupboard doors on each side, with round knobs.', Vs(doors) + [34, 46, 154, 166].map(x => ac(x, 149, 2.5)).join('')],
      ['Draw a pot on the counter with a lid and steam. Draw a tap on the right.', V(pot) + V(lid) + ac(100, 81, 2.5) + ap('M90 74 Q86 68 90 62 Q94 56 90 50 M110 74 Q106 68 110 62 Q114 56 110 50') + V(tap)],
      ['Draw two cupboards up high, and a window in the middle.', Vs(ups) + ac(56, 56, 2.5) + ac(144, 56, 2.5) + V(win) + al(100, 22, 100, 62) + al(76, 42, 124, 42)],
      ['Draw square tiles on the floor, and a tea towel on the oven.', tiles.map(t => V(t)).join('') + V(pth('M92 131 H108 V150 Q100 154 92 150 Z'))],
      ['Color your kitchen! Use a checker pattern on the floor.', M(paint(WALL, ar(0, 0, 200, 110)) + paint(LBLUE, F(win)) + paint('#7FD1C7', Fs(ups) + F(lower)) + paint('#EEF1F5', F(counter)) + paint(GRAY, F(oven)) + paint(NAVY, F(ovw)) + paint(RED, F(pot) + F(lid)) + paint('#9AA1AB', F(tap)) + paint(SUN, ap('M92 131 H108 V150 Q100 154 92 150 Z')) + tiles.map((t, i) => i % 2 ? '' : paint('#22305A', F(t))).join(''))]] });
  }
  {
    const board = rect(36, 18, 128, 74), inner = rect(42, 24, 116, 62);
    const abc = ap('M54 64 L62 38 L70 64 M57 55 H67') + ap('M78 38 V64 M78 38 H85 Q91 38 91 44 Q91 50 85 51 H78 M85 51 Q93 51 93 57.5 Q93 64 85 64 H78') + ap('M114 42 Q108 36 102 41 Q97 51 102 60 Q108 66 114 60');
    const sun = circ(138, 50, 8) + around(8, 13, 138, 50, (x, y, a) => al(x, y, f1(138 + 17 * Math.cos(a)), f1(50 + 17 * Math.sin(a))));
    const clock = circ(182, 34, 12), poster = rect(6, 32, 24, 32);
    const tdTop = rect(124, 104, 64, 8), tdPanel = rect(128, 112, 56, 26), tapple = circ(140, 97, 7);
    const desk = x => [rect(x, 140, 66, 8), rect(x + 4, 148, 6, 44), rect(x + 56, 148, 6, 44)];
    const chair = x => [rrect(x + 18, 158, 30, 18, 4), rect(x + 21, 176, 5, 22), rect(x + 40, 176, 5, 22)];
    const dA = desk(12), dB = desk(118), cA = chair(12), cB = chair(118);
    LESSONS.push({ id: 'a10-classroom', cat: 'rooms', level: 2, title: 'A classroom', ico: '🏫', need: PR, tip: 'Things close to you look bigger and lower on the page. Far things look smaller and higher.', steps: [
      ['Draw a big board on the wall, with a frame around it.', V(board) + V(inner)],
      ['Write A B C on the board, and draw a little sun.', abc + sun],
      ['Draw a round clock and an alphabet poster on the wall.', V(clock) + al(182, 34, 182, 26) + al(182, 34, 188, 36) + V(poster) + ap('M12 46 L18 36 L24 46 M14 42 H22') + ac(18, 55, 4)],
      ["Draw the teacher's desk at the back, with a red apple on it.", V(tdTop) + V(tdPanel) + V(tapple) + al(140, 90, 141, 86)],
      ['Draw a line for the floor. Stop at the desk.', V(seg(0, 126, 200, 126), [tdPanel, tdTop])],
      ['Draw two school desks at the front. They are close, so they are big and low.', Vs(dA) + Vs(dB)],
      ['Draw the back of a chair at each desk.', Vs(cA) + Vs(cB)],
      ['Color your classroom. Is the board green or black?', M(paint(WALL, ar(0, 0, 200, 126)) + paint(FLOOR, ar(0, 126, 200, 74)) + paint(WOODD, F(board)) + paint('#2F6B4F', F(inner)) + paint('#fff', F(clock)) + paint(SUN, F(poster)) + paint(WOOD, F(tdTop) + F(tdPanel) + Fs(dA) + Fs(dB)) + paint(RED, F(tapple)) + paint(BLUE, Fs(cA) + Fs(cB))) + stroke('#fff', abc) + stroke(SUN, sun)]] });
  }
  {
    const head = rrect(14, 64, 18, 90, 6), matt = rect(30, 104, 116, 18), base = rect(30, 122, 116, 16), foot = rrect(144, 92, 12, 62, 5);
    const pillow = ell(52, 98, 18, 8), blanket = pth('M76 100 Q110 94 146 100 L146 132 Q131 138 118 132 Q104 138 90 132 Q83 136 76 132 Z');
    const stand = rect(162, 108, 32, 46), shade = poly('168,72 188,72 194,92 162,92'), lstem = rect(176, 92, 4, 16);
    const bed = [head, matt, base, foot, pillow, blanket];
    const win = rect(96, 24, 60, 52), curL = pth('M92 22 Q100 50 94 80 L106 80 Q108 50 104 22 Z'), curR = pth('M160 22 Q152 50 158 80 L146 80 Q144 50 148 22 Z');
    const pic = rect(30, 26, 40, 28), rug = ell(92, 174, 74, 14), rug2 = ell(92, 174, 58, 9);
    const light = 'M96 154 L156 154 L176 200 L60 200 Z';
    LESSONS.push({ id: 'a10-bedroom', cat: 'rooms', level: 3, title: 'A cozy bedroom', ico: '🛌', need: PR, tip: 'Pick where the light comes from first. Shadows always fall on the other side.', steps: [
      ['Start with what is in front: a bed with a pillow and a wavy blanket.', V(head) + V(foot) + V(pillow, [head]) + V(blanket, [foot]) + V(matt, [head, foot, pillow, blanket]) + V(base, [head, foot, blanket])],
      ['Draw a little table next to the bed, with a drawer. Put a lamp on top.', V(stand) + al(162, 126, 194, 126) + ac(178, 117, 2) + V(shade) + V(lstem)],
      ['Draw the line where the wall meets the floor. It goes behind things, so stop at the bed and table.', V(seg(0, 130, 200, 130), bed.concat([stand]))],
      ['Draw a window on the wall. Add curtains on each side and a rod on top.', V(win, [curL, curR, shade]) + V(seg(126, 24, 126, 76)) + V(seg(106, 50, 146, 50)) + V(curL) + V(curR) + al(86, 22, 166, 22)],
      ['Draw a picture over the bed, and an oval rug on the floor.', V(pic) + apl('34,50 44,38 52,46 58,40 66,50') + ac(60, 33, 3) + V(rug) + V(rug2)],
      ['The light comes in the window. The space under the bed is dark, so fill it with lines.', hatch(36, 140, 139, 153, 8, -6, [rect(30, 138, 116, 16)])],
      ['Draw a shadow next to the table, on the side away from the window.', hatch(152, 160, 140, 156, 4, -4, [poly('150,140 162,140 162,156 146,156')])],
      ['Erase anything messy. Draw stars on the blanket and a slipper by the rug.', star(100, 114, 5) + star(124, 108, 5) + star(136, 122, 4) + ae(150, 180, 9, 4) + ae(166, 186, 9, 4)],
      ['Color it with warm colors. Make a pale patch of window light on the floor.', M(paint(WALL, ar(0, 0, 200, 130)) + paint(FLOOR, ar(0, 130, 200, 70)) + paint(CREAM, ap(light)) + paint(LBLUE, F(win)) + paint(PINK, F(curL) + F(curR)) + paint('#9CCB7A', F(pic)) + paint(TEAL, F(rug)) + paint('#7FD1C7', F(rug2)) + paint(WOOD, F(head) + F(foot) + F(stand)) + paint(WOODD, F(base)) + paint('#fff', F(matt)) + paint(CREAM, F(pillow)) + paint(PURPLE, F(blanket)) + paint(SUN, F(shade)) + paint('#6B5A4A', ar(30, 138, 116, 16)))]] });
  }
  {
    const VP = [120, 90];
    const win = poly('20,40 50,55 50,97 20,100'), door = rect(150, 72, 16, 48), pic = rect(84, 62, 34, 24);
    const rugP = '82,135 144,135 170,185 40,185', rug = poly(rugP);
    const ft = [88, 146], ftR = [132, 146], tb = lerp(ft, VP, 0.11), tbR = lerp(ftR, VP, 0.11);
    const tableTop = poly(pts([ft, ftR, tbR, tb])), tableFront = rect(88, 146, 44, 16);
    const lampShade = poly('108,28 132,28 138,40 102,40');
    LESSONS.push({ id: 'a10-room1pt', cat: 'rooms', level: 3, title: 'A living room in one-point perspective', ico: '🖼️', need: PRR, tip: 'All the lines that go away from you point at one dot. Your ruler is your best friend!', steps: [
      ['Lightly draw a line across: the horizon, at your eye level. Put a dot on it a bit right of the middle.', guide(al(0, 90, 200, 90) + ac(120, 90, 2.5))],
      ['Draw a rectangle around the dot. This is the back wall of the room.', ar(70, 50, 100, 70)],
      ['With a ruler, draw a line out from each corner of the back wall. Point them away from the dot.', al(70, 50, 7.5, 0) + al(170, 50, 200, 26) + al(70, 120, 0, 162) + al(170, 120, 200, 138)],
      ['Draw a window on the left wall. Its top and bottom lines point at the dot.', V(win) + al(35, 47.5, 35, 98.5)],
      ['Draw a door and a picture on the back wall. They face you, so they are flat.', V(door) + ac(154, 98, 1.6) + V(pic) + apl('88,82 98,70 106,78 112,72 116,82')],
      ['Draw a rug on the floor. The front is wide, and its sides point at the dot.', V(rug) + guide(al(82, 135, 120, 90) + al(144, 135, 120, 90))],
      ['Draw a box table on the rug. Its back corners slide toward the dot too.', V(tableTop) + V(tableFront) + guide(L2(tb, VP) + L2(tbR, VP))],
      ['Erase the guide lines. Hang a lamp from the ceiling.', al(120, 4, 120, 28) + V(lampShade), { clear: true }],
      ['Color the walls. Make the side walls darker than the back wall, so the room looks deep.', M(paint('#FFF7E8', apg('7.5,0 200,0 200,26 170,50 70,50')) + paint('#F3C99C', apg('0,0 7.5,0 70,50 70,120 0,162') + apg('200,26 170,50 170,120 200,138')) + paint(WALL, ar(70, 50, 100, 70)) + paint(FLOOR, apg('0,162 70,120 170,120 200,138 200,200 0,200')) + paint(LBLUE, F(win)) + paint(WOODD, F(door)) + paint('#9CCB7A', F(pic)) + paint(RED, F(rug)) + paint('#F0C890', F(tableTop)) + paint(WOOD, F(tableFront)) + paint(SUN, F(lampShade)))]] });
  }
  {
    const house = rect(30, 70, 140, 120), roof = poly('20,72 100,14 180,72'), slab = rect(30, 128, 140, 5);
    const bedH = rrect(36, 98, 6, 30, 2), bedM = rect(42, 110, 42, 10), bedB = rect(42, 120, 42, 8), bedP = ell(50, 106, 7, 4);
    const tub = pth('M108 108 H162 V114 Q162 126 150 126 H120 Q108 126 108 114 Z'), tap = pth('M156 108 V100 H146');
    const sofaB = rrect(42, 152, 52, 20, 5), sofaS = rect(44, 168, 48, 12), armL = rrect(36, 162, 10, 22, 4), armR = rrect(90, 162, 10, 22, 4);
    const lampS = poly('100,158 116,158 112,146 104,146'), fridge = rrect(150, 138, 18, 52, 3), stove = rect(122, 162, 26, 28), stw = rect(126, 172, 18, 12), spot = rect(128, 152, 14, 10);
    const boxes = [rect(56, 58, 18, 14), rect(60, 48, 12, 10)], cat = ell(138, 64, 14, 8), catH = circ(124, 61, 6);
    const chim = rect(140, 22, 14, 40);
    const rooms = [poly('30,74 100,74 100,128 30,128'), poly('100,74 170,74 170,128 100,128'), poly('30,133 118,133 118,190 30,190'), poly('118,133 170,133 170,190 118,190')];
    LESSONS.push({ id: 'a10-cutaway', cat: 'rooms', level: 3, title: 'Peek inside: a house cut open', ico: '🏘️', need: PRR, tip: 'Builders and architects draw houses cut open like this. It is called a cut-away drawing.', steps: [
      ['Draw a big box for the house and a triangle roof on top.', V(house) + V(roof, [house])],
      ['Draw a thick floor across the middle. Then draw walls to make rooms.', V(slab) + al(100, 70, 100, 128) + al(118, 133, 118, 190)],
      ['Upstairs: draw a bed in one room and a bubbly bathtub in the other.', V(bedH) + V(bedM, [bedH, bedP]) + V(bedB, [bedH]) + V(bedP) + V(tub) + V(tap) + ac(124, 104, 4) + ac(133, 100, 5) + ac(142, 104, 3)],
      ['Downstairs: draw a sofa and lamp, and a kitchen with a fridge and stove.', V(sofaB, [armL, armR, sofaS]) + V(sofaS, [armL, armR]) + V(armL) + V(armR) + al(108, 190, 108, 158) + V(lampS) + V(fridge) + al(150, 156, 168, 156) + al(164, 144, 164, 152) + al(164, 160, 164, 170) + V(stove) + V(stw) + V(spot)],
      ['In the attic, draw a round window, some boxes and a sleeping cat.', ac(100, 40, 8) + al(92, 40, 108, 40) + al(100, 32, 100, 48) + Vs(boxes) + V(cat, [catH]) + V(catH) + apl('119,58 120,51 124,55') + apl('125,55 128,50 129,57') + ap('M152 66 Q160 70 156 60')],
      ['Draw a ladder up to the attic. Hang little pictures on the walls.', al(88, 128, 88, 70) + al(96, 128, 96, 70) + [80, 92, 104, 116].map(y => al(88, y, 96, y)).join('') + ar(56, 84, 16, 12) + ar(52, 138, 22, 10) + ar(126, 140, 16, 12)],
      ['Draw a chimney with smoke, and grass along the ground.', V(chim, [roof]) + ap('M147 18 Q141 10 147 4 M156 16 Q162 10 158 2') + al(0, 190, 200, 190) + tuft(12, 190) + tuft(186, 190)],
      ['Color every room a different color. Which room would you sleep in?', M(paint(RED, F(roof)) + paint(PINK, F(rooms[0])) + paint(LBLUE, F(rooms[1])) + paint(CREAM, F(rooms[2])) + paint('#C9EBC0', F(rooms[3])) + paint(WOODD, F(slab) + F(chim)) + paint(PURPLE, F(sofaB) + F(sofaS) + F(armL) + F(armR)) + paint('#fff', F(tub) + F(fridge)) + paint(GRAY, F(stove)) + paint(SUN, F(lampS) + ac(100, 40, 8)) + paint(ORANGE, F(cat) + F(catH)) + paint(WOOD, Fs(boxes) + F(bedH) + F(bedB)) + paint(BLUE, F(bedM)) + paint(GRASS, ar(0, 190, 200, 10)))]] });
  }
  {
    const VL = [4, 40], VR = [196, 40], F0 = [100, 112], d = 10, legH = 62, backH = 74;
    const Lc = lerp(F0, VL, 0.42), Rc = lerp(F0, VR, 0.3), Bc = cross(Lc, VR, Rc, VL);
    const dn = (p, k) => [p[0], f1(p[1] + k)];
    const F1 = dn(F0, d), L1 = dn(Lc, d), R1 = dn(Rc, d);
    const Fb = dn(F0, d + legH), Lb = cross(Fb, VL, L1, dn(Lc, 400)), Rb = cross(Fb, VR, R1, dn(Rc, 400));
    const Lt = dn(Lc, -backH), Bt = cross(Lt, VR, Bc, dn(Bc, -400)), Lm = dn(Lc, -backH * 0.45), Bm = cross(Lm, VR, Bc, dn(Bc, -400));
    const Lt2 = dn(Lc, -backH + 8), Bt2 = cross(Lt2, VR, Bc, dn(Bc, -400)), Lm2 = dn(Lm, 8), Bm2 = cross(Lm2, VR, Bc, dn(Bc, -400));
    const top = poly(pts([F0, Rc, Bc, Lc])), sideL = poly(pts([F0, Lc, L1, F1])), sideR = poly(pts([F0, Rc, R1, F1]));
    const leg = (a, b) => poly(pts([a, [a[0] + 6, a[1]], [b[0] + 6, b[1]], b]));
    const Bb = cross(Lb, VR, Rb, VL), legs = [leg([F1[0] - 3, F1[1]], [Fb[0] - 3, Fb[1]]), leg(L1, Lb), leg([R1[0] - 6, R1[1]], [Rb[0] - 6, Rb[1]])], backLeg = leg([Bc[0] - 6, Bc[1]], [Bb[0] - 6, Bb[1]]);
    const post = (a, b) => poly(pts([a, [a[0] + 6, a[1]], [b[0] + 6, b[1]], b]));
    const posts = [post(Lt, Lc), post([Bt[0] - 6, Bt[1]], [Bc[0] - 6, Bc[1]])];
    const rail1 = poly(pts([Lt, Bt, Bt2, Lt2])), rail2 = poly(pts([Lm, Bm, Bm2, Lm2]));
    const shadow = poly(pts([dn(Fb, 0), [Rb[0] + 30, Rb[1] + 4], [Lb[0] + 34, Lb[1] - 4], Lb]));
    LESSONS.push({ id: 'a10-chair2pt', cat: 'rooms', level: 3, title: 'A chair in two-point perspective', ico: '📐', need: PRR, tip: 'Up-and-down lines stay straight up and down. All other lines run to one of the two dots.', steps: [
      ['Lightly draw a horizon line near the top. Put a dot at each end. These are two vanishing points.', guide(al(0, 40, 200, 40) + ac(4, 40, 3) + ac(196, 40, 3))],
      ['Draw a short line straight down, a bit below the middle. This is the front corner of the seat.', L2(F0, F1)],
      ['With a ruler, draw light lines from the top and bottom of it to both dots.', guide(L2(F0, VL) + L2(F1, VL) + L2(F0, VR) + L2(F1, VR))],
      ['Draw the left and right corners as short up-and-down lines, on the guide lines. Join them to the front.', L2(Lc, L1) + L2(Rc, R1) + L2(F0, Lc) + L2(F1, L1) + L2(F0, Rc) + L2(F1, R1)],
      ['From each side corner, draw a line to the opposite dot. Where they cross is the back corner.', guide(L2(Lc, VR) + L2(Rc, VL)) + L2(Lc, Bc) + L2(Rc, Bc)],
      ['Draw the legs straight down. The far legs end higher up, along lines to the dots.', Vs(legs, [sideL, sideR]) + V(backLeg, legs.concat([sideL, sideR, top])) + guide(L2(Fb, VL) + L2(Fb, VR))],
      ['Draw two tall posts up from the left and back corners.', Vs(posts, [top])],
      ['Join the posts with two bars. Their lines point to the right dot.', V(rail1, posts) + V(rail2, posts)],
      ['Erase the guide lines. The light is on the left, so shade the right side with little lines.', hatch(F0[0] - 2, Rc[0] + 2, 60, 140, 5, 0, [sideR]), { clear: true }],
      ['Color it like wood. Light on top, darker on the shaded side.', M(paint('#E3E6EA', F(shadow)) + paint('#F0C890', F(top)) + paint(WOOD, F(sideL) + Fs(posts) + F(rail1) + F(rail2) + F(legs[0]) + F(legs[1])) + paint(WOODD, F(sideR) + F(legs[2]) + F(backLeg)))]] });
  }

  /* ================= Houses & Homes ================= */
  {
    const house = rect(64, 80, 72, 60), roof = poly('54,82 100,40 146,82'), door = pth('M91 140 V118 Q100 108 109 118 V140');
    const wins = [rect(72, 94, 16, 16), rect(112, 94, 16, 16)], hillD = 'M0 160 Q100 110 200 160', hill = pth(hillD + ' L200 200 L0 200 Z');
    const pathD = 'M94 140 Q84 160 98 174 Q112 188 100 200 L128 200 Q138 184 118 172 Q104 160 106 140 Z';
    LESSONS.push({ id: 'a10-hillhouse', cat: 'homes', level: 1, title: 'A little house on a hill', ico: '🏠', need: P, tip: 'Every house starts as a square and a triangle. Then you make it yours!', steps: [
      ['Draw a big square for the house.', V(house)],
      ['Draw a triangle roof on top. Let it poke out a little on each side.', V(roof, [house])],
      ['Draw a door with a round top, and a round window in the roof.', V(door) + ac(100, 66, 7) + al(93, 66, 107, 66)],
      ['Draw a square window on each side of the door. Add a cross in each one.', Vs(wins) + al(80, 94, 80, 110) + al(72, 102, 88, 102) + al(120, 94, 120, 110) + al(112, 102, 128, 102)],
      ['Draw a round hill under the house. Stop at the house.', V(pth(hillD), [house])],
      ['Draw a curvy path from the door, a sun and two birds.', V(pth(pathD), [house]) + ac(166, 34, 14) + ap('M24 40 q6 -6 12 0 q6 -6 12 0 M50 24 q4 -4 8 0 q4 -4 8 0')],
      ['Color your house. Who lives inside?', M(paint(SKY, ar(0, 0, 200, 160)) + paint(GRASS, F(hill)) + paint('#E8C27A', ap(pathD)) + paint(SUN, F(house) + ac(166, 34, 14)) + paint(RED, F(roof)) + paint(BLUE, F(door)) + paint(LBLUE, Fs(wins) + ac(100, 66, 7)))]] });
  }
  {
    const walls = rect(40, 100, 120, 70), roof = pth('M28 106 Q30 62 70 56 H130 Q170 62 172 106 Z'), chim = rect(128, 34, 16, 40);
    const door = pth('M88 170 V138 Q100 124 112 138 V170'), wins = [rect(52, 116, 24, 22), rect(124, 116, 24, 22)], boxes = [rect(50, 140, 28, 7), rect(122, 140, 28, 7)];
    const thatch = ap('M42 98 Q46 80 60 70 M62 100 Q64 82 76 70 M84 100 Q86 84 94 70 M106 100 Q106 84 110 70 M128 100 Q126 82 120 70 M150 98 Q146 80 136 70');
    const fls = [56, 64, 72, 128, 136, 144].map(x => ac(x, 137, 3)).join('');
    LESSONS.push({ id: 'a10-cottage', cat: 'homes', level: 1, title: 'A cottage with a chimney', ico: '🏡', need: P, tip: 'A cottage roof can be round and fluffy, like a hat made of straw.', steps: [
      ['Draw a long box for the walls of the cottage.', V(walls)],
      ['Draw a big round roof on top, like a fluffy hat.', V(roof)],
      ['Draw a chimney poking up from the roof. Stop at the roof.', V(chim, [roof])],
      ['Draw curly smoke coming out of the chimney, and lines on the roof for straw.', ap('M136 30 Q128 22 136 16 Q144 10 136 2') + thatch],
      ['Draw a round-top door and two windows with flower boxes.', V(door) + Vs(wins) + al(64, 116, 64, 138) + al(136, 116, 136, 138) + Vs(boxes) + fls],
      ['Draw the ground line, and grass and flowers by the door.', V(seg(0, 170, 200, 170)) + tuft(24, 170) + tuft(176, 170) + bloom(28, 186) + bloom(170, 186) + al(28, 190, 28, 200) + al(170, 190, 170, 200)],
      ['Color it in! A straw roof, a red brick chimney and pink flowers.', M(paint(SKY, ar(0, 0, 200, 170)) + paint(GRASS, ar(0, 170, 200, 30)) + paint(RED, F(chim)) + paint(CREAM, F(walls)) + paint('#E8C27A', F(roof)) + paint(TEAL, ap('M88 170 V138 Q100 124 112 138 V170 Z')) + paint(LBLUE, Fs(wins)) + paint(WOODD, Fs(boxes)) + paint(PINK, fls + bloom(28, 186) + bloom(170, 186)))]] });
  }
  {
    const domeA = arcE(100, 150, 72, 82, 180, 360), dome = poly(domeA.pts), arch = poly(arcE(100, 150, 24, 30, 180, 360).pts), hole = poly(arcE(100, 150, 15, 21, 180, 360).pts);
    const rows = [128, 106, 86].map(y => V(seg(0, y, 200, y), [arch], [dome])).join('');
    const joints = [[150, 128, [52, 84, 140]], [128, 106, [44, 70, 112, 136, 158]], [106, 86, [60, 90, 120, 146]], [86, 68, [78, 102, 126]]].map(([a, b, xs]) => xs.map(x => V(seg(x, a, x, b), [arch], [dome])).join('')).join('');
    const archBlocks = [200, 230, 260, 290, 320].map(a => { const c = Math.cos(a * DEG), s = Math.sin(a * DEG); return al(f1(100 + 15 * c), f1(150 + 21 * s), f1(100 + 24 * c), f1(150 + 30 * s)); }).join('');
    LESSONS.push({ id: 'a10-igloo', cat: 'homes', level: 1, title: 'An igloo', ico: '🧊', need: P, tip: 'Igloos are made of snow blocks. Blocks take turns, just like bricks!', steps: [
      ['Draw a big round dome, like half a ball. Draw a flat line under it.', V(domeA) + al(10, 150, 190, 150)],
      ['Draw a little round door at the front.', V(arch)],
      ['Draw a smaller round shape inside the door. This is the dark way in.', V(hole) + archBlocks],
      ['Draw lines across the igloo, for rows of snow blocks.', rows],
      ['Draw short lines between the rows. Make them take turns, like bricks.', joints],
      ['Draw bumpy snow on the ground, and snowflakes in the sky.', ap('M0 158 Q20 152 40 160 Q70 166 100 158 Q140 152 170 162 Q186 166 200 160') + flake(30, 40, 7) + flake(166, 34, 8) + flake(178, 92, 5) + flake(20, 96, 5)],
      ['Color the sky blue and the igloo white with pale blue lines. Brrr!', M(paint('#B9DDF7', ar(0, 0, 200, 150)) + paint('#F4FAFF', F(dome)) + paint(LBLUE, F(poly(arcE(100, 150, 72, 82, 300, 360).pts.concat([[100, 150]])))) + paint(NAVY, F(hole)) + paint('#EAF4FD', ar(0, 150, 200, 50)))]] });
  }
  {
    const walls = rect(40, 100, 120, 80), roof = poly('34,102 58,66 100,44 142,66 166,102'), doors = rect(70, 128, 60, 52), loft = rect(88, 70, 24, 22);
    const xs = al(70, 128, 100, 180) + al(100, 128, 70, 180) + al(100, 128, 130, 180) + al(130, 128, 100, 180);
    const posts = [6, 20, 34].map(x => rect(x - 2, 156, 5, 26)), bale = rrect(166, 162, 28, 20, 6);
    LESSONS.push({ id: 'a10-barn', cat: 'homes', level: 1, title: 'A big red barn', ico: '🐄', need: P, tip: 'A barn roof bends in the middle, like a tall hat. That leaves room for hay!', steps: [
      ['Draw a big box for the barn walls.', V(walls)],
      ['Draw a roof that bends in the middle, like a tall hat.', V(roof, [walls])],
      ['Draw two big doors. Draw an X on each one.', V(doors) + al(100, 128, 100, 180) + xs],
      ['Draw a little hay door up high, with hay poking out.', V(loft) + apl('92,92 94,86 98,92 101,85 104,92 107,86 109,92')],
      ['Draw a fence, a round hay bale and the ground.', Vs(posts) + al(0, 164, 38, 164) + al(0, 174, 38, 174) + V(bale) + ap('M172 168 Q180 164 188 168 M172 176 Q180 172 188 176') + V(seg(0, 182, 200, 182), [bale])],
      ['Draw a weather vane on top: a pole with an arrow.', al(100, 44, 100, 22) + apl('92,28 110,28 106,24') + al(92, 28, 90, 24) + al(92, 28, 90, 32)],
      ['Color your barn red with white X doors. Moo!', M(paint(SKY, ar(0, 0, 200, 182)) + paint(GRASS, ar(0, 182, 200, 18)) + paint(RED, F(walls)) + paint('#9E2F25', F(roof)) + paint('#C0392B', F(doors)) + paint(SUN, F(loft) + F(bale)) + paint(WOOD, Fs(posts))) + stroke('#fff', xs)]] });
  }
  {
    const trunk = pth('M82 200 Q92 150 90 108 L110 108 Q108 150 118 200 Z'), plat = rect(44, 100, 112, 8), house = rect(64, 62, 72, 38), roof = poly('56,64 100,32 144,64');
    const canopy = cloud(100, 70, 88, 56, 9, 0.16);
    const ladder = al(64, 108, 64, 196) + al(76, 108, 76, 196) + [124, 140, 156, 172, 188].map(y => al(64, y, 76, y)).join('');
    const ladderR = rect(62, 108, 16, 90);
    LESSONS.push({ id: 'a10-treehouse', cat: 'homes', level: 2, title: 'A treehouse', ico: '🌳', need: PR, tip: 'Draw the house first, then the leaves behind it. Stop the leaves when you touch the house.', steps: [
      ['Draw a thick tree trunk. Make it wider at the bottom, like roots.', V(pth('M82 200 Q92 150 90 108 M118 200 Q108 150 110 108')) + ap('M82 200 Q76 196 70 200 M118 200 Q124 196 130 200')],
      ['Draw a flat wooden floor across the top of the trunk.', V(plat)],
      ['Draw a little house on the floor: a box with a triangle roof.', V(house) + V(roof, [house])],
      ['Draw a round window, a door and a flag on the roof.', ac(80, 80, 7) + al(73, 80, 87, 80) + ar(104, 72, 16, 28) + al(100, 32, 100, 16) + apg('100,16 114,20 100,24')],
      ['Draw a ladder going down the side of the trunk.', ladder],
      ['Draw a big bumpy cloud of leaves behind. Stop at the house and trunk.', V(canopy, [house, roof, plat, trunk, ladderR, poly('99,16 115,16 115,32 99,32')])],
      ['Draw a rope swing, grass, and leaves falling down.', al(140, 108, 140, 160) + al(152, 108, 152, 160) + ar(134, 160, 24, 5, 2) + tuft(20, 200) + tuft(180, 200) + V(leaf(30, 150, 40, 142, 4)) + V(leaf(170, 136, 180, 128, 4))],
      ['Color it in! Green leaves, a brown trunk and a bright little house.', M(paint(SKY, ar(0, 0, 200, 200)) + paint(GRASS, F(canopy)) + paint(WOODD, F(trunk)) + paint(WOOD, F(plat) + F(house) + ladder.replace(/<line/g, '<line style="stroke:#9C6B43"')) + paint(RED, F(roof)) + paint(SUN, apg('100,16 114,20 100,24') + ac(80, 80, 7)) + paint(BLUE, ar(104, 72, 16, 28)))]] });
  }
  {
    const bld = rect(50, 32, 100, 158), ledge = rect(46, 24, 108, 8);
    const cols = [60, 91, 122], rowsY = [42, 66, 90, 114, 138];
    const wins = []; rowsY.forEach(y => cols.forEach(x => wins.push(rect(x, y, 18, 16))));
    const balc = [[60, 66], [122, 66], [91, 114]].map(([x, y]) => al(x - 3, y + 9, x + 21, y + 9) + ar(x - 3, y + 16, 24, 3) + [x + 1, x + 6, x + 12, x + 17].map(px => al(px, y + 9, px, y + 16)).join('')).join('');
    const door = rect(88, 162, 24, 28), awn = poly('80,162 120,162 124,152 76,152');
    const nb = rect(150, 92, 42, 98), nbw = [[156, 102], [174, 102], [156, 126], [174, 126], [156, 150], [174, 150]].map(([x, y]) => ar(x, y, 12, 14)).join('');
    const tr = ptree(24, 190, 1.1);
    LESSONS.push({ id: 'a10-apartments', cat: 'homes', level: 2, title: 'An apartment building', ico: '🏢', need: PRR, tip: 'Use a ruler to keep windows in straight rows. Then make each window a bit different!', steps: [
      ['Draw a tall rectangle for the building. Add a flat roof edge on top.', V(bld) + V(ledge)],
      ['Draw rows of windows: 3 across and 5 floors up. Keep them in neat lines.', Vs(wins.slice(0, 15).filter((w, i) => i !== 13), [awn])],
      ['Draw a door at the bottom, with a little roof over it.', V(door) + V(awn) + ac(108, 176, 1.8) + al(86, 152, 84, 162) + al(94, 152, 93, 162) + al(102, 152, 102, 162) + al(110, 152, 111, 162)],
      ['Give some windows a balcony: a little shelf with railings.', balc],
      ['Draw curtains, a plant and a peeking cat in some windows. Who lives here?', ap('M60 42 L66 58 M78 42 L72 58') + ap('M122 90 L128 106 M140 90 L134 106') + ac(100, 52, 4) + apl('96.5,49 97,44 99.5,48') + apl('100.5,48 103,44 103.5,49') + ar(64, 72, 8, 6) + ap('M68 72 Q64 64 66 60 M68 72 Q72 64 72 62') + ap('M125 120 Q131 114 137 120')],
      ['Draw a smaller building next door, and a tree.', V(nb) + nbw + V(tr.top) + V(tr.trunk, [tr.top])],
      ['Draw the sidewalk line, and a sun in the sky.', al(0, 190, 200, 190) + ac(176, 40, 13) + around(8, 19, 176, 40, (x, y, a) => al(x, y, f1(176 + 24 * Math.cos(a)), f1(40 + 24 * Math.sin(a))))],
      ['Color it! Warm bricks, blue windows and a striped door roof.', M(paint(SKY, ar(0, 0, 200, 190)) + paint('#C9CED6', ar(0, 190, 200, 10)) + paint('#F3A27A', F(bld)) + paint('#B5583A', F(ledge)) + paint(LBLUE, Fs(wins.slice(0, 15).filter((w, i) => i !== 13))) + paint('#B8C6E6', F(nb)) + paint(CREAM, nbw) + paint(WOODD, F(door)) + paint(RED, F(awn)) + paint(GRASS, F(tr.top)) + paint(WOODD, F(tr.trunk)) + paint(SUN, ac(176, 40, 13)))]] });
  }
  {
    const roof = pth('M22 94 Q40 90 54 66 L62 48 H138 L146 66 Q160 90 178 94 Q100 86 22 94 Z'), ridge = rect(58, 40, 84, 8);
    const walls = rect(40, 92, 120, 56), porch = rect(30, 148, 140, 8), step = rect(86, 156, 28, 6);
    const tiles = [62, 72, 82, 92, 102, 112, 122, 132, 142].map(x => V(seg(x, 48, x + (x - 100) * 0.9, 100), [], [roof])).join('');
    const shoji = [[40, 70], [70, 100], [100, 130], [130, 160]].map(([a, b]) => { let s = ''; for (let x = a + 7.5; x < b - 1; x += 7.5) s += al(x, 98, x, 148); for (let y = 108; y < 148; y += 10) s += al(a, y, b, y); return s; }).join('');
    const lant = [poly('168,128 198,128 183,116'), rect(174, 128, 18, 14), rect(180, 142, 6, 18), rect(175, 160, 16, 10)];
    const padD = [[14, 120, 14, 6], [24, 104, 12, 5.5], [10, 90, 10, 5]];
    LESSONS.push({ id: 'a10-japanhouse', cat: 'homes', level: 2, title: 'A Japanese house', ico: '⛩️', need: PR, tip: 'Old Japanese houses have paper sliding doors called shoji. Light glows softly through them.', steps: [
      ['Draw a wide roof. The bottom corners sweep up, like a smile.', V(roof)],
      ['Draw a long ridge on top, with little curls at each end.', V(ridge) + ap('M58 44 Q50 40 52 32 M142 44 Q150 40 148 32')],
      ['Draw lines down the roof for rows of tiles.', tiles],
      ['Draw the walls under the roof. Draw posts to make 4 sections.', V(walls, [roof]) + [70, 100, 130].map(x => al(x, 94, x, 148)).join('')],
      ['Fill each section with a grid of thin lines. These are paper doors called shoji.', shoji],
      ['Draw a wooden porch along the front, a step, and short legs under it.', V(porch) + V(step) + al(36, 156, 36, 170) + al(164, 156, 164, 170) + al(0, 170, 200, 170)],
      ['Draw a stone lantern on the right, and a little pine tree on the left.', Vs(lant) + ar(178, 131, 10, 7) + ap('M14 170 Q8 150 16 136 Q22 124 14 104') + padD.map(([x, y, a, b]) => V(cloud(x, y, a, b, 6, 0.25))).join('')],
      ['Color your house. A blue-gray roof, cream doors and dark wood.', M(paint(SKY, ar(0, 0, 200, 170)) + paint('#9CCB7A', ar(0, 170, 200, 30)) + paint('#5B6B8C', F(roof) + F(ridge)) + paint(CREAM, F(walls)) + paint(WOODD, F(porch) + F(step)) + paint(GRAY, Fs(lant)) + paint(SUN, ar(178, 131, 10, 7)) + paint(DKGREEN, padD.map(([x, y, a, b]) => F(cloud(x, y, a, b, 6, 0.25))).join('')))]] });
  }
  {
    const xsL = [4, 18, 32, 46, 60], xsR = [130, 144, 158, 172, 186];
    const picket = x => poly(`${x},140 ${x + 5},133 ${x + 10},140 ${x + 10},178 ${x},178`);
    const pickets = xsL.concat(xsR).map(picket), rails = [rect(0, 148, 72, 5), rect(0, 164, 72, 5), rect(128, 148, 72, 5), rect(128, 164, 72, 5)];
    const house = rect(50, 80, 100, 70), roof = poly('40,82 100,36 160,82'), door = rect(88, 116, 24, 34), wins = [rect(60, 94, 20, 18), rect(120, 94, 20, 18)];
    const tr = ptree(178, 140, 1.1), hillD = 'M0 116 Q50 96 100 108 Q150 120 200 100';
    const fence = pickets.concat(rails);
    const stones = [[100, 160, 8, 3], [98, 172, 10, 4], [102, 186, 12, 5]];
    const fl = [[14, 188], [40, 192], [160, 190], [186, 186]];
    LESSONS.push({ id: 'a10-gardenhouse', cat: 'homes', level: 2, title: 'A house with a garden and fence', ico: '🌷', need: PR, tip: 'Things in front hide things behind. The fence is in front, so the house hides behind it.', steps: [
      ['Draw a fence near the bottom: pointy posts with a gap in the middle for a path.', Vs(pickets)],
      ['Draw two rails across the posts on each side.', Vs(rails, pickets)],
      ['Draw a house behind the fence. Stop where the fence is in front.', V(house, fence) + V(roof, [house])],
      ['Draw a door in the gap, and two windows with crosses.', V(door) + ac(107, 134, 1.8) + Vs(wins) + al(70, 94, 70, 112) + al(60, 103, 80, 103) + al(130, 94, 130, 112) + al(120, 103, 140, 103)],
      ['Draw a stepping-stone path from the door to you. The stones get bigger as they come closer.', stones.map(([x, y, a, b]) => V(ell(x, y, a, b))).join('')],
      ['Draw a tree and a hill behind the house. Stop at things in front.', V(tr.top, fence.concat([house, roof])) + V(tr.trunk, fence.concat([tr.top])) + V(pth(hillD), fence.concat([house, roof, tr.top]))],
      ['Draw flowers in front of the fence, and a cloud.', fl.map(([x, y]) => bloom(x, y - 8, 3.2) + al(x, y - 4, x, 200)).join('') + V(cloud(40, 34, 24, 11, 5, 0.3))],
      ['Color your garden! A white fence, green grass and bright flowers.', M(paint(SKY, ar(0, 0, 200, 120)) + paint(GRASS, ap(hillD + ' L200 200 L0 200 Z')) + paint('#9CCB7A', F(tr.top)) + paint(WOODD, F(tr.trunk)) + paint(PINK, F(house)) + paint(PURPLE, F(roof)) + paint(BLUE, F(door)) + paint(LBLUE, Fs(wins)) + paint('#fff', Fs(fence)) + paint(GRAY, stones.map(([x, y, a, b]) => F(ell(x, y, a, b))).join('')) + paint(RED, fl.slice(0, 2).map(([x, y]) => bloom(x, y - 8, 3.2)).join('')) + paint(SUN, fl.slice(2).map(([x, y]) => bloom(x, y - 8, 3.2)).join('')) + paint('#fff', F(cloud(40, 34, 24, 11, 5, 0.3))))]] });
  }
  {
    const VL = [2, 118], VR = [198, 118], Ft = [96, 80], Fb = [96, 160];
    const Lt = lerp(Ft, VL, 0.5), Lb = lerp(Fb, VL, 0.5), Rt = lerp(Ft, VR, 0.52), Rb = lerp(Fb, VR, 0.52);
    const mid = cross(Ft, Lb, Fb, Lt), A = [mid[0], 38];
    const Bt = cross(Lt, VR, Rt, VL), Bb = cross(Lb, VR, Rb, VL), bc = cross(Rt, Bb, Rb, Bt), A2 = cross(A, VR, [bc[0], 0], [bc[0], 200]);
    const left = poly(pts([Ft, Lt, Lb, Fb])), right = poly(pts([Ft, Rt, Rb, Fb])), gable = poly(pts([Lt, A, Ft])), roofP = poly(pts([A, A2, Rt, Ft]));
    // a shape on a wall: u across (0..1) and v down (0..1) between two corners, so its edges point to the right vanishing point.
    const onWall = (P, Q, Pb, Qb, VP, u0, u1, v0, v1) => {
      const at = (u, v) => { const top = cross(P, Q, [P[0] + (Q[0] - P[0]) * u, 0], [P[0] + (Q[0] - P[0]) * u, 200]), bot = cross(Pb, Qb, [top[0], 0], [top[0], 200]); return [top[0], f1(top[1] + (bot[1] - top[1]) * v)]; };
      return poly(pts([at(u0, v0), at(u1, v0), at(u1, v1), at(u0, v1)]));
    };
    const door = onWall(Lt, Ft, Lb, Fb, VL, 0.4, 0.62, 0.35, 1), w1 = onWall(Ft, Rt, Fb, Rb, VR, 0.14, 0.38, 0.22, 0.6), w2 = onWall(Ft, Rt, Fb, Rb, VR, 0.58, 0.82, 0.22, 0.6);
    LESSONS.push({ id: 'a10-house2pt', cat: 'homes', level: 3, title: 'A house in two-point perspective', ico: '📐', need: PRR, tip: 'Up-and-down lines stay straight. Every other line runs to the left dot or the right dot.', steps: [
      ['Lightly draw a low horizon line. Put a dot at each end. These are your two vanishing points.', guide(al(0, 118, 200, 118) + ac(2, 118, 3) + ac(198, 118, 3))],
      ['Draw a tall straight line a bit left of the middle. This is the front corner of the house.', L2(Ft, Fb)],
      ['With a ruler, draw light lines from the top and bottom of the corner to both dots.', guide(L2(Ft, VL) + L2(Fb, VL) + L2(Ft, VR) + L2(Fb, VR))],
      ['Draw the two side corners as straight lines between the guides. Now you have two walls.', L2(Lt, Lb) + L2(Rt, Rb) + L2(Ft, Lt) + L2(Fb, Lb) + L2(Ft, Rt) + L2(Fb, Rb)],
      ['Find the middle of the left wall: draw an X from corner to corner. Go straight up from it to the roof peak.', guide(L2(Ft, Lb) + L2(Fb, Lt) + L2(mid, A)) + L2(Lt, A) + L2(A, Ft)],
      ['Draw the top of the roof from the peak toward the right dot. Then come down to the right corner.', guide(L2(A2, VR)) + L2(A, A2) + L2(A2, Rt)],
      ['Draw a door on the left wall. Its top line points to the left dot.', V(door) + guide(L2(door.pts[0], VL))],
      ['Draw two windows on the right wall. Their top and bottom lines point to the right dot.', V(w1) + V(w2) + guide(L2(lerp(Ft, Rt, 0.14), VR))],
      ['Erase the guide lines. The sun is on the left, so shade the right wall with lines.', hatch(Ft[0] + 3, Rt[0], 60, 170, 7, 0, [right], [w1, w2]), { clear: true }],
      ['Color it. Use a light color on the sunny wall and a darker one on the shady wall.', M(paint(SKY, ar(0, 0, 200, 118)) + paint(GRASS, ar(0, 118, 200, 82)) + paint(CREAM, F(left) + F(gable)) + paint('#F0C890', F(right)) + paint(RED, F(roofP)) + paint(BLUE, F(door)) + paint(LBLUE, F(w1) + F(w2)))]] });
  }
  {
    const VP = [100, 86];
    const topY = x => 44 + 0.42 * x, botY = x => 170 - 0.84 * x;
    const at = (xa, xb, u, v) => { const x = xa + (xb - xa) * u; return [f1(x), f1(topY(x) + (botY(x) - topY(x)) * v)]; };
    const face = (xa, xb, u0, u1, v0, v1, side) => { const q = [at(xa, xb, u0, v0), at(xa, xb, u1, v0), at(xa, xb, u1, v1), at(xa, xb, u0, v1)]; return poly(pts(side ? q.map(([x, y]) => [f1(200 - x), y]) : q)); };
    const spans = [[0, 34], [38, 60], [63, 77], [79, 88]];
    const house = (xa, xb, side) => { const xm = (xa + xb) / 2, h = botY(xm) - topY(xm), pk = [f1(xm), f1(topY(xm) - 0.32 * h)], q = [[xa, f1(topY(xa))], pk, [xb, f1(topY(xb))], [xb, f1(botY(xb))], [xa, f1(botY(xa))]]; return poly(pts(side ? q.map(([x, y]) => [f1(200 - x), y]) : q)); };
    const L = spans.map(([a, b]) => house(a, b, 0)), R = spans.map(([a, b]) => house(a, b, 1));
    const doors = spans.map(([a, b], i) => [face(a, b, 0.6, 0.85, 0.55, 1, 0), face(a, b, 0.15, 0.4, 0.55, 1, 1)]).flat();
    const wins = spans.slice(0, 3).map(([a, b]) => [face(a, b, 0.15, 0.45, 0.15, 0.4, 0), face(a, b, 0.55, 0.85, 0.15, 0.4, 1)]).flat();
    const stripes = [[200, 182], [166, 152], [140, 132], [124, 119], [113, 110], [104, 102]].map(([a, b]) => al(100, a, 100, b)).join('');
    const lamp = (t, side) => { const x = 46 + (100 - 46) * t, y = 200 + (86 - 200) * t, h = (y - 86) * 0.42, X = side ? 200 - x : x, d = side ? -1 : 1; return al(f1(X), f1(y), f1(X), f1(y - h)) + al(f1(X), f1(y - h), f1(X + d * h * 0.2), f1(y - h)) + ac(f1(X + d * h * 0.2), f1(y - h + h * 0.06), f1(Math.max(1, h * 0.06))); };
    const lamps = [0.12, 0.45, 0.7].map(t => lamp(t, 0) + lamp(t, 1)).join('');
    const COLS = [['#F3A27A', '#9CCBF5'], ['#FFD966', '#F78FB3'], ['#A98BE8', '#7FD1C7'], ['#F2604F', '#6CC08B']];
    LESSONS.push({ id: 'a10-street', cat: 'homes', level: 3, title: 'A street of houses to the vanishing point', ico: '🏘️', need: PRR, tip: 'Houses far away shrink toward the dot. Far things also look paler, so use softer colors there.', steps: [
      ['Lightly draw the horizon across the middle. Put a dot in the middle: the vanishing point.', guide(al(0, 86, 200, 86) + ac(100, 86, 2.5))],
      ['With a ruler, draw the road: two lines from the bottom of the page to the dot.', al(46, 200, 100, 86) + al(154, 200, 100, 86)],
      ['Draw light guide lines from the dot to the left and right edges: two high, two low.', guide(al(0, 44, 100, 86) + al(0, 170, 100, 86) + al(200, 44, 100, 86) + al(200, 170, 100, 86))],
      ['Draw houses on the left between the guides, each with a pointy roof. Each one is smaller than the last.', Vs(L)],
      ['Do the same on the right side. The houses get smaller near the dot.', Vs(R)],
      ['Draw doors and windows. Their tops and bottoms point to the dot too.', Vs(doors) + Vs(wins)],
      ['Draw stripes down the road. Make them shorter and closer near the dot. Add street lamps.', stripes + lamps],
      ['Erase the guide lines. Draw a cloud and some birds.', V(cloud(150, 30, 22, 9, 5, 0.3)) + ap('M30 24 q5 -5 10 0 q5 -5 10 0 M56 14 q4 -4 8 0 q4 -4 8 0'), { clear: true }],
      ['Color it. Bright colors in front, softer, paler colors far away.', M(paint(SKY, ar(0, 0, 200, 86)) + paint('#D9DDE3', apg('0,170 100,86 46,200 0,200') + apg('200,170 100,86 154,200 200,200')) + paint('#8E96A3', apg('46,200 100,86 154,200')) + L.map((h, i) => `<g style="opacity:${1 - i * 0.18}">${paint(COLS[i][0], F(h)) + paint(COLS[i][0], F(R[i]))}</g>`).join('') + paint('#fff', F(cloud(150, 30, 22, 9, 5, 0.3))) + paint(WOODD, Fs(doors)) + paint(CREAM, Fs(wins))) + stroke('#fff', stripes)]] });
  }
  {
    const opening = pth('M70 180 V64 Q70 34 100 34 Q130 34 130 64 V180 Z'), door = rect(77, 66, 46, 114), fan = pth('M77 64 Q77 41 100 41 Q123 41 123 64 Z');
    const spokes = [150, 120, 90, 60, 30].map(a => al(100, 64, f1(100 + 20 * Math.cos(-a * DEG)), f1(64 + 20 * Math.sin(-a * DEG)))).join('');
    const panels = [rect(83, 74, 15, 34), rect(102, 74, 15, 34), rect(83, 122, 15, 50), rect(102, 122, 15, 50)];
    const steps2 = [rect(62, 180, 76, 8), rect(54, 188, 92, 8)];
    const win = x => rect(x, 70, 36, 48), wins = [win(18), win(146)], sills = [rect(14, 118, 44, 6), rect(142, 118, 44, 6)];
    const shut = [rect(6, 70, 10, 48), rect(56, 70, 10, 48), rect(134, 70, 10, 48), rect(184, 70, 10, 48)], boxes = [rect(18, 124, 36, 12), rect(146, 124, 36, 12)];
    const slats = shut.map(s => { const x = s.pts[0][0]; let o = ''; for (let y = 76; y < 118; y += 6) o += al(x + 2, y, x + 8, y); return o; }).join('');
    const fl = [[24, 122], [33, 120], [42, 122], [50, 120], [152, 122], [161, 120], [170, 122], [178, 120]];
    const solid = [opening, wins[0], wins[1], ...sills, ...shut, ...boxes, ...steps2];
    let bricks = ''; for (let y = 10, k = 0; y < 180; y += 10, k++) { bricks += V(seg(0, y, 200, y), solid); for (let x = (k % 2) * 12 + 6; x < 200; x += 24) bricks += V(seg(x, y - 10, x, y), solid); }
    LESSONS.push({ id: 'a10-frontdoor', cat: 'homes', level: 3, title: 'A front door and windows, up close', ico: '🚪', need: PR, tip: 'Texture marks, like bricks and wood lines, make a drawing feel real enough to touch.', steps: [
      ['Draw a tall doorway with a round top, like an arch.', V(opening)],
      ['Draw the door inside. Above it, draw a half-circle window with lines like sun rays.', V(door) + V(fan) + spokes],
      ['Draw 4 panels on the door. Add a round knob and a mail slot.', Vs(panels) + ac(119, 116, 3) + ar(90, 112, 20, 5, 1)],
      ['Draw two wide stone steps under the door.', Vs(steps2)],
      ['Draw a window on each side, with 4 panes. Add a sill under each one.', Vs(wins) + al(36, 70, 36, 118) + al(18, 94, 54, 94) + al(164, 70, 164, 118) + al(146, 94, 182, 94) + Vs(sills)],
      ['Draw shutters with slats, and flower boxes full of flowers.', Vs(shut) + slats + Vs(boxes) + fl.map(([x, y]) => ac(x, y, 3.5)).join('')],
      ['Draw bricks: long rows across, then short lines that take turns. Stop at the door and windows.', bricks],
      ['The light comes from the top left. Shade under the boxes, and inside the right side of the doorway.', hatch(123, 128, 60, 180, 2.5, 0, [rect(123, 60, 6, 120)]) + hatch(18, 56, 136, 146, 4, -4, [rect(18, 136, 36, 8)]) + hatch(146, 184, 136, 146, 4, -4, [rect(146, 136, 36, 8)])],
      ['Color it in. Warm red bricks, a bright door, and green shutters.', M(paint('#E68A6A', ar(0, 0, 200, 180)) + paint(GRAY, Fs(steps2)) + paint('#2E6FB7', F(door)) + paint('#5B9BE0', Fs(panels)) + paint(SUN, F(fan) + ac(119, 116, 3)) + paint(LBLUE, Fs(wins)) + paint(TEAL, Fs(shut)) + paint('#fff', Fs(sills)) + paint(WOODD, Fs(boxes)) + paint(PINK, fl.map(([x, y]) => ac(x, y, 3.5)).join('')))]] });
  }
  {
    const towerS = pth('M30 72 V180 Q52 192 74 180 V72 Z'), cone = pth('M24 72 L52 14 L80 72 Q52 86 24 72 Z');
    const house = rect(74, 98, 100, 82), roofS = poly('66,100 124,52 182,100');
    const tw = pth('M45 112 V96 Q52 86 59 96 V112 Z'), tw2 = pth('M45 150 V134 Q52 124 59 134 V150 Z');
    const door = pth('M110 180 V148 Q124 132 138 148 V180 Z'), hw = [pth('M84 140 V122 Q92 112 100 122 V140 Z'), pth('M148 140 V122 Q156 112 164 122 V140 Z')];
    const chim = rect(150, 54, 13, 40), rw = circ(124, 82, 7);
    const front = [towerS, cone, tw, tw2, door, ...hw, rw];
    const stoneXY = [[38, 80], [64, 88], [40, 124], [66, 118], [36, 162], [62, 164], [50, 172], [84, 108], [108, 106], [140, 110], [164, 108], [80, 156], [100, 168], [150, 156], [166, 170], [112, 124], [132, 128], [146, 172], [92, 176]];
    const stones = stoneXY.map(([x, y], i) => V(ell(x, y, 5 + (i % 3), 3 + (i % 2)), front.concat(i < 7 ? [] : [towerS]), i < 7 ? [towerS] : [house])).join('');
    const tShade = hatch(64, 74, 72, 190, 3.5, 0, [towerS], [tw, tw2]) + hatch(56, 62, 72, 190, 6, 0, [towerS], [tw, tw2]);
    const cShade = hatch(56, 80, 14, 84, 5, 0, [poly('52,14 80,72 66,80 52,79')]);
    LESSONS.push({ id: 'a10-castlehouse', cat: 'homes', level: 3, title: 'A fairy-tale castle house', ico: '🏰', need: PR, tip: 'A round tower is darkest at the edge away from the light. That makes it look round, not flat.', steps: [
      ['Draw a tall tower on the left: two straight sides and a curved bottom.', V(towerS)],
      ['Put a pointy cone roof on top, with a curved bottom edge.', V(cone)],
      ['Draw the house next to the tower, with a big triangle roof. Stop at the tower.', V(house, [towerS]) + V(roofS, [towerS, cone, house])],
      ['Draw an arched door with planks, and arched windows on the house and tower.', V(door) + al(119, 140, 119, 180) + al(129, 140, 129, 180) + ac(132, 162, 2) + Vs(hw) + V(tw) + V(tw2)],
      ['Draw a chimney, a round window in the roof, and a flag on the tower.', V(chim, [roofS]) + V(rw) + al(52, 14, 52, 0) + apg('52,1 68,5 52,9')],
      ['Draw stones on the walls. Make them different sizes, like a puzzle.', stones],
      ['The light is on the left. Shade the right side of the tower: darkest at the edge.', tShade],
      ['Shade the right side of the cone roof the same way.', cShade],
      ['Draw a curvy path and round bushes by the door.', ap('M110 180 Q100 190 86 200 M138 180 Q150 190 168 200') + V(cloud(186, 172, 14, 10, 5, 0.25)) + V(cloud(88, 176, 12, 8, 5, 0.25), [towerS]) + al(0, 180, 30, 180)],
      ['Color your castle house with soft stone colors and a bright roof.', M(paint(SKY, ar(0, 0, 200, 180)) + paint(GRASS, ar(0, 180, 200, 20)) + paint('#E8C27A', apg('110,180 138,180 168,200 86,200')) + paint('#E4DCCB', F(towerS) + F(house)) + paint(PURPLE, F(cone)) + paint(RED, F(roofS)) + paint(WOODD, F(door) + F(chim)) + paint(LBLUE, Fs(hw) + F(tw) + F(tw2) + F(rw)) + paint(SUN, apg('52,1 68,5 52,9')) + paint(DKGREEN, F(cloud(186, 172, 14, 10, 5, 0.25)) + F(cloud(88, 176, 12, 8, 5, 0.25))))]] });
  }

  /* ================= Landscape Drawing & Painting ================= */
  const PW = 'Paper, a pencil, and watercolors or crayons';
  const wave = (y, a = 5) => `M0 ${y} Q25 ${y - a} 50 ${y} Q75 ${y + a} 100 ${y} Q125 ${y - a} 150 ${y} Q175 ${y + a} 200 ${y}`;
  const waveBack = (y, a = 5) => `L200 ${y} Q175 ${y + a} 150 ${y} Q125 ${y - a} 100 ${y} Q75 ${y + a} 50 ${y} Q25 ${y - a} 0 ${y} Z`;
  const bz = (p0, c, p1, t) => { const m = 1 - t; return [f1(m * m * p0[0] + 2 * m * t * c[0] + t * t * p1[0]), f1(m * m * p0[1] + 2 * m * t * c[1] + t * t * p1[1])]; };
  const pineT = (x, y, h) => { const t = rect(x - h * 0.04, y - h * 0.1, h * 0.08, h * 0.1); return { top: pine(x, y - h * 0.02, h), trunk: t }; };
  {
    const sunA = arcE(100, 130, 26, 26, 180, 360), sun = poly(sunA.pts), ys = [34, 62, 88, 110];
    const bands = ['M0 0 H200 V34 ' + waveBack(34).replace(/^L200 \S+ /, '')];
    for (let i = 0; i < ys.length - 1; i++) bands.push(wave(ys[i]) + ' ' + waveBack(ys[i + 1]));
    bands.push(wave(110) + ' L200 130 L0 130 Z');
    const COLS = ['#8E6CC0', '#E66A9A', '#F2885A', '#F7B24F', '#FFD97A'];
    const refl = al(78, 140, 122, 140) + al(84, 150, 116, 150) + al(90, 160, 110, 160) + al(95, 170, 105, 170) + al(98, 180, 102, 180);
    LESSONS.push({ id: 'a10-sunsetsky', cat: 'landscapes', level: 1, title: 'Sunset sky in color bands', ico: '🌅', brush: 'watercolor', need: PW, tip: 'Paint the light colors first, then the dark ones. Let them touch so they blend!', steps: [
      ['Draw a straight line low on the page. This is where the sea meets the sky.', al(0, 130, 200, 130)],
      ['Draw half a sun sitting on the line, like it is going to sleep.', V(sunA)],
      ['Draw wavy lines across the sky, like long ribbons. Stop at the sun.', ys.map(y => V(pth(wave(y)), [sun])).join('')],
      ['Draw short lines on the water under the sun. That is its shiny reflection. Add two birds.', refl + ap('M30 74 q5 -5 10 0 q5 -5 10 0 M150 50 q4 -4 8 0 q4 -4 8 0')],
      ['Paint the bands: yellow near the sun, then orange, pink and purple at the top.', M(bands.map((d, i) => paint(COLS[i], ap(d))).join('') + paint('#FFF1A8', F(sun)) + paint('#4A5FA8', ar(0, 130, 200, 70)) + fat(SUN, 'M78 140 H122 M84 150 H116 M90 160 H110 M95 170 H105 M98 180 H102', 4))]] });
  }
  {
    const moon = circ(130, 58, 30), craters = [[120, 48, 6], [143, 64, 5], [124, 72, 3.5], [144, 44, 3]];
    const house = rect(28, 128, 24, 20), roof = poly('24,129 40,114 56,129'), pn = pineT(170, 158, 46);
    const hillD = 'M0 160 Q50 136 100 152 Q150 168 200 144', stars = [[26, 30, 6], [70, 56, 4], [186, 100, 4], [60, 102, 3.5], [100, 22, 3]];
    LESSONS.push({ id: 'a10-nightsky', cat: 'landscapes', level: 1, title: 'Night sky with a big moon', ico: '🌕', need: P, tip: 'At night, colors get dark and blue. The moon and the windows are the brightest things!', steps: [
      ['Draw a big circle for the full moon.', V(moon)],
      ['Draw round craters on the moon. They are giant holes on the real moon!', craters.map(([x, y, r]) => ac(x, y, r)).join('')],
      ['Draw a little house with a pointy roof and a window.', V(house) + V(roof, [house]) + ar(36, 134, 8, 8)],
      ['Draw a pine tree on the right.', V(pn.top) + V(pn.trunk, [pn.top])],
      ['Draw hills at the bottom. Stop at the house and the tree.', V(pth(hillD), [house, pn.top, pn.trunk])],
      ['Draw twinkly stars and a shooting star.', stars.map(([x, y, r]) => star(x, y, r)).join('') + twinkle(160, 18, 4) + twinkle(14, 70, 3) + al(150, 120, 176, 108) + star(180, 106, 4)],
      ['Color the sky dark blue. Make the moon and window glow yellow!', M(paint(NAVY, ar(0, 0, 200, 200)) + paint('#3B4C80', ac(130, 58, 40)) + paint('#FFF3C4', F(moon)) + paint('#F3DFA0', craters.map(([x, y, r]) => ac(x, y, r)).join('')) + paint('#1E3B2F', ap(hillD + ' L200 200 L0 200 Z')) + paint('#4A3B5C', F(house) + F(roof)) + paint(SUN, ar(36, 134, 8, 8) + stars.map(([x, y, r]) => star(x, y, r)).join('') + star(180, 106, 4)) + paint('#16301F', F(pn.top) + F(pn.trunk)))]] });
  }
  {
    const nearD = 'M0 170 Q60 130 120 160 Q160 178 200 150', midD = 'M0 122 Q50 94 100 116 Q150 138 200 106', farD = 'M0 92 Q30 74 60 86 Q100 66 140 82 Q170 72 200 88';
    const tr = ptree(40, 154, 1.3), mt = ptree(150, 126, 0.55);
    const tiny = [[80, 79], [92, 76], [150, 80], [160, 78]].map(([x, y]) => al(x, y, x, y - 4) + ac(x, y - 7, 3.5)).join('');
    const fls = [[90, 186], [118, 192], [150, 182], [176, 190]];
    LESSONS.push({ id: 'a10-hills', cat: 'landscapes', level: 1, title: 'Rolling hills, near and far', ico: '⛰️', brush: 'watercolor', need: PW, tip: 'Near things are big, bright and low. Far things are small, pale and high up.', steps: [
      ['Draw a big curvy hill at the bottom. It is the closest to you.', V(pth(nearD))],
      ['Draw a big tree on that hill. Close things look big!', V(tr.top) + V(tr.trunk, [tr.top])],
      ['Draw a smaller hill behind it. Stop at the tree. Put a middle-size tree on it.', V(pth(midD), [tr.top, tr.trunk]) + V(mt.top) + V(mt.trunk, [mt.top])],
      ['Draw the far hills, high and small. Add tiny trees, like lollipops.', V(pth(farD), [tr.top]) + tiny],
      ['Draw flowers close to you, and a sun and a cloud in the sky.', fls.map(([x, y]) => bloom(x, y, 3)).join('') + ac(170, 30, 13) + V(cloud(60, 34, 24, 10, 5, 0.3))],
      ['Paint far hills pale blue-green, and near hills dark green. Now they look far away!', M(paint(SKY, ar(0, 0, 200, 200)) + paint('#C3E0CF', ap(farD + ' L200 200 L0 200 Z')) + paint('#8FCB9B', ap(midD + ' L200 200 L0 200 Z')) + paint('#4FA36B', ap(nearD + ' L200 200 L0 200 Z')) + paint('#2F8F5B', F(tr.top)) + paint('#6DB98A', F(mt.top)) + paint(WOODD, F(tr.trunk) + F(mt.trunk)) + paint(SUN, ac(170, 30, 13)) + paint('#fff', F(cloud(60, 34, 24, 10, 5, 0.3))) + paint(PINK, fls.map(([x, y]) => bloom(x, y, 3)).join('')))]] });
  }
  {
    const shoreD = 'M0 140 Q30 128 60 138 Q90 148 120 134 Q150 122 200 132', foamD = 'M0 133 Q30 121 60 131 Q90 141 120 127 Q150 115 200 125';
    const curl = (x, y, s) => ap(`M${x} ${y} q${f1(6 * s)} ${f1(-8 * s)} ${f1(12 * s)} 0 q${f1(-4 * s)} ${f1(-1 * s)} ${f1(-5 * s)} ${f1(3 * s)}`);
    const waves = [10, 44, 78, 112, 146, 176].map(x => curl(x, 100, 0.6)).join('') + [0, 36, 72, 108, 144, 180].map(x => curl(x, 116, 0.9)).join('');
    const canopy = poly(arcE(140, 148, 32, 18, 180, 360).pts), bucket = poly('34,170 54,170 51,190 37,190');
    const sea = 'M0 86 H200 V132 Q150 122 120 134 Q90 148 60 138 Q30 128 0 140 Z';
    LESSONS.push({ id: 'a10-beach', cat: 'landscapes', level: 1, title: 'A sunny beach with waves', ico: '🏖️', need: P, tip: 'The sea looks darker far away and lighter near the sand. Try two blues!', steps: [
      ['Draw a straight line across the page. This is where the sea meets the sky.', al(0, 86, 200, 86)],
      ['Draw a wavy line lower down. This is the edge of the sand.', ap(shoreD)],
      ['Draw little curly waves on the sea, and a foamy line by the sand.', waves + ap(foamD)],
      ['Draw a big sun, and a tiny sailboat far away. Far things are small!', ac(40, 40, 15) + around(8, 20, 40, 40, (x, y, a) => al(x, y, f1(40 + 26 * Math.cos(a)), f1(40 + 26 * Math.sin(a)))) + ap('M146 84 H168 L164 88 H150 Z') + apg('158,83 158,68 168,82')],
      ['Draw a beach umbrella and a bucket on the sand.', V(canopy) + al(140, 132, 124, 148) + al(140, 132, 156, 148) + al(140, 148, 140, 196) + V(bucket) + ap('M34 170 Q44 158 54 170') + ap('M80 186 l6 -10 l6 10 z M86 186 v-10')],
      ['Color the sea two blues, the sand yellow and the umbrella red and white.', M(paint(SKY, ar(0, 0, 200, 86)) + paint('#6DB3F2', ap(sea)) + paint('#3A7CC4', ar(0, 86, 200, 14)) + paint('#F5D99A', ap(shoreD + ' L200 200 L0 200 Z')) + paint('#fff', ap(foamD + ' L200 140 L0 140 Z').replace('d="', 'style="opacity:.6" d="')) + paint(RED, apg('140,132 124,148 108,148 112,140 124,133') + apg('140,132 156,148 172,148 168,140 156,133')) + paint(SUN, ac(40, 40, 15) + F(bucket)) + paint('#fff', apg('158,83 158,68 168,82')))]] });
  }
  {
    const trunk = pth('M88 182 V96 Q88 84 100 84 Q112 84 112 96 V182 Z');
    const armL = pth('M88 150 H72 Q58 150 58 136 V116 Q58 108 65 108 Q72 108 72 116 V136 H88 Z'), armR = pth('M112 132 H126 Q132 132 132 124 V102 Q132 94 139 94 Q146 94 146 102 V126 Q146 146 126 146 H112 Z');
    const cac = [trunk, armL, armR], nearD = 'M0 156 Q60 112 120 146 Q160 168 200 150', near = pth(nearD + ' L200 200 L0 200 Z');
    const farD = 'M0 104 Q40 86 80 98 Q130 80 200 102', crestD = 'M54 134 Q72 160 64 200';
    const shadowS = pth('M54 134 Q88 136 120 146 Q160 168 200 150 L200 200 L64 200 Q72 160 54 134 Z');
    const spines = [[92, 104], [108, 116], [92, 132], [108, 150], [92, 166], [62, 122], [142, 108]].map(([x, y]) => al(x - 2, y - 2, x + 2, y + 2) + al(x - 2, y + 2, x + 2, y - 2)).join('');
    LESSONS.push({ id: 'a10-dunes', cat: 'landscapes', level: 2, title: 'Desert dunes and a cactus', ico: '🌵', need: PR, tip: 'Sand dunes have a sunny side and a shady side. The shady side makes them look 3D.', steps: [
      ['Draw a tall cactus with round ends. Give it two arms that bend up.', V(trunk, [armL, armR]) + V(armL, [trunk]) + V(armR, [trunk])],
      ['Draw a big sand dune behind it. Stop at the cactus.', V(pth(nearD), cac)],
      ['Draw low dunes far away. They are smaller and higher up.', V(pth(farD), cac.concat([near]))],
      ['Draw a crest line down the big dune. This is the sharp top of the dune.', V(pth(crestD), cac)],
      ['Draw lines down the cactus, little spines, and wavy ripples in the sand.', V(seg(100, 88, 100, 180)) + V(seg(65, 112, 65, 146)) + V(seg(139, 98, 139, 140)) + spines + ap('M8 172 Q18 168 28 172 Q38 176 48 172 M4 188 Q16 184 28 188 Q40 192 52 188')],
      ['The sun is on the left. The right side of the dune is in shadow, so fill it with lines.', hatch(60, 210, 130, 200, 9, -10, [shadowS], cac)],
      ['Draw the hot sun with wiggly heat lines. Add a tiny cactus far away.', ac(34, 34, 14) + ap('M24 62 Q28 58 24 54 Q20 50 24 46 M44 62 Q48 58 44 54 Q40 50 44 46') + ap('M166 98 V86 M166 92 H162 V88 M166 90 H170 V86')],
      ['Color warm: orange sand, a darker shady side and a green cactus.', M(paint('#FFE7B0', ar(0, 0, 200, 200)) + paint('#F2C58C', ap(farD + ' L200 200 L0 200 Z')) + paint('#F5B860', F(near)) + paint('#D98A4A', F(shadowS)) + paint('#4FA36B', Fs(cac)) + paint(SUN, ac(34, 34, 14)))]] });
  }
  {
    const VP = [100, 90], xbs = [-100, -50, 0, 50, 100, 150, 200, 250, 300];
    const toVP = xb => { let p = [xb, 200]; if (xb < 0) { const t = -xb / (100 - xb); p = [0, f1(200 - 110 * t)]; } if (xb > 200) { const t = (xb - 200) / (xb - 100); p = [200, f1(200 - 110 * t)]; } return al(p[0], p[1], 100, 90); };
    const rows = xbs.map(toVP).join('');
    const tulip = (x, y, s) => { const k = v => f1(v); return { cup: pth(`M${k(x - 5 * s)} ${k(y - 16 * s)} L${k(x - 5 * s)} ${k(y - 21 * s)} L${k(x - 2.5 * s)} ${k(y - 18 * s)} L${k(x)} ${k(y - 22 * s)} L${k(x + 2.5 * s)} ${k(y - 18 * s)} L${k(x + 5 * s)} ${k(y - 21 * s)} L${k(x + 5 * s)} ${k(y - 16 * s)} Q${k(x + 5 * s)} ${k(y - 10 * s)} ${k(x)} ${k(y - 10 * s)} Q${k(x - 5 * s)} ${k(y - 10 * s)} ${k(x - 5 * s)} ${k(y - 16 * s)} Z`), stem: `M${k(x)} ${k(y)} V${k(y - 10 * s)} M${k(x)} ${k(y - 3 * s)} Q${k(x + 4 * s)} ${k(y - 6 * s)} ${k(x + 5 * s)} ${k(y - 11 * s)}` }; };
    const COLS = [RED, SUN, PURPLE, PINK, ORANGE, RED, SUN, PURPLE];
    const at = (i, y) => { const xc = xbs[i] + 25, x = xc + (100 - xc) * (200 - y) / 110; return x; };
    const flowers = ys => { const out = []; ys.forEach(y => { for (let i = 0; i < 8; i++) { const x = at(i, y), s = (y - 90) / 110 * 1.5; if (x > 6 && x < 194) out.push([i, tulip(f1(x), y, s)]); } }); return out; };
    const big = flowers([188]), midF = flowers([150, 126]), far = [];
    [110, 101].forEach(y => { for (let i = 0; i < 8; i++) { const x = at(i, y); if (x > 3 && x < 197) far.push([i, f1(x), y]); } });
    const drawT = list => list.map(([i, t]) => V(t.cup) + ap(t.stem)).join('');
    const hillD = 'M0 90 Q40 80 80 88 Q130 78 200 90', mill = poly('150,90 162,90 159,70 153,70');
    LESSONS.push({ id: 'a10-flowerfield', cat: 'landscapes', level: 2, title: 'A field of flowers in perspective', ico: '🌷', need: PRR, tip: 'Flowers close to you are big and clear. Far away they shrink into tiny dots of color.', steps: [
      ['Lightly draw a horizon line above the middle. Put a dot in the middle of it.', guide(al(0, 90, 200, 90) + ac(100, 90, 2.5))],
      ['With a ruler, draw lines from the bottom of the page to the dot, like a fan. These are flower rows.', rows],
      ['Draw big tulips at the bottom, one in each row. They are close to you.', drawT(big)],
      ['Draw smaller tulips further up each row. They are further away.', drawT(midF)],
      ['Near the horizon, just draw tiny dots. Far flowers look like specks of color!', far.map(([i, x, y]) => ac(x, y, y > 105 ? 1.8 : 1.2)).join('')],
      ['Erase the guide line. Draw far hills, a windmill and a sun.', V(pth(hillD), [mill]) + V(mill) + al(144, 60, 168, 80) + al(144, 80, 168, 60) + ac(156, 70, 2) + ac(40, 40, 12), { clear: true }],
      ['Color each row a different color, like a rainbow carpet.', M(paint(SKY, ar(0, 0, 200, 90)) + paint('#C3E0CF', ap(hillD + ' L200 90 L0 90 Z')) + xbs.slice(0, 8).map((xb, i) => paint(COLS[i], apg(`${xb},200 ${xbs[i + 1]},200 100,90`)).replace('style="fill:', 'style="opacity:.45;fill:')).join('') + big.concat(midF).map(([i, t]) => paint(COLS[i], F(t.cup)) + fat('#2FA36B', t.stem, 2.5)).join('') + far.map(([i, x, y]) => paint(COLS[i], ac(x, y, y > 105 ? 1.8 : 1.2))).join('') + paint(WOOD, F(mill)) + paint(SUN, ac(40, 40, 12)))]] });
  }
  {
    const near = [pineT(32, 198, 132), pineT(170, 200, 140)], nearS = near.map(p => p.top).concat(near.map(p => p.trunk));
    const mid = [12, 66, 96, 128, 194].map((x, i) => pineT(x, 162, 60 + (i % 2) * 8)), midS = mid.map(p => p.top);
    const far = []; for (let x = 4; x < 200; x += 13) far.push(pine(x, 126, 24 + (x % 3) * 2));
    const ridgeD = 'M0 124 Q100 110 200 126', mist = 'M0 150 Q25 146 50 150 Q75 154 100 150 Q125 146 150 150 Q175 154 200 150';
    const mush = (x, y) => ({ cap: pth(`M${x - 8} ${y - 6} Q${x - 8} ${y - 16} ${x} ${y - 16} Q${x + 8} ${y - 16} ${x + 8} ${y - 6} Z`), stem: rect(x - 2.5, y - 6, 5, 6) });
    const m1 = mush(84, 196), m2 = mush(120, 198);
    LESSONS.push({ id: 'a10-forest', cat: 'landscapes', level: 2, title: 'A forest in layers', ico: '🌲', brush: 'watercolor', need: PW, tip: 'Paint the far trees first, pale and blue. Each layer closer gets darker and greener.', steps: [
      ['Draw two big pine trees at the front. They are close, so make them tall.', near.map(p => V(p.top) + V(p.trunk, [p.top])).join('')],
      ['Draw a row of middle trees behind them. Stop when you touch a front tree.', mid.map(p => V(p.top, nearS) + V(p.trunk, nearS.concat([p.top]))).join('')],
      ['Draw tiny far trees at the back, small and close together. Stop at the trees in front.', far.map(f => V(f, nearS.concat(midS))).join('')],
      ['Draw the line of the far hill under them, and a soft wavy line of mist.', V(pth(ridgeD), nearS.concat(midS, far)) + V(pth(mist), nearS)],
      ['Draw a little path into the forest, and mushrooms near the front.', V(pth('M84 200 Q96 180 98 162 M116 200 Q106 180 104 162'), nearS.concat([m1.cap, m1.stem, m2.cap, m2.stem])) + V(m1.cap) + V(m1.stem, [m1.cap]) + V(m2.cap) + V(m2.stem, [m2.cap]) + ac(81, 186, 1.5) + ac(87, 184, 1.5) + ac(122, 188, 1.5)],
      ['Paint pale blue far trees, mid-green middle trees and dark green front trees.', M(paint('#E3F1F7', ar(0, 0, 200, 200)) + paint('#C8E0D4', ap(ridgeD + ' L200 200 L0 200 Z')) + paint('#A9CDBE', Fs(far)) + paint('#8DBE7A', ar(0, 160, 200, 40)) + paint('#5FAF7E', Fs(midS)) + paint('#2F7D4F', Fs(near.map(p => p.top))) + paint(WOODD, Fs(near.map(p => p.trunk)) + Fs(mid.map(p => p.trunk))) + paint('#E8C27A', apg('84,200 98,162 104,162 116,200')) + paint(RED, F(m1.cap) + F(m2.cap)))]] });
  }
  {
    const hillsD = 'M0 110 Q30 86 70 98 Q110 76 150 94 Q176 86 200 96', hillR = pth(hillsD + ' L200 110 L0 110 Z'), sunC = circ(120, 92, 16);
    const p1 = pineT(22, 112, 50), p2 = pineT(42, 112, 36), p3 = pineT(8, 112, 30), pines = [p2, p1, p3];
    const pineSVG = V(p2.top) + V(p2.trunk, [p2.top]) + V(p1.top, [p2.top]) + V(p1.trunk, [p2.top, p1.top]) + V(p3.top, [p1.top]) + V(p3.trunk, [p1.top, p3.top]);
    const pS = pines.map(p => p.top).concat(pines.map(p => p.trunk));
    const hillSVG = V(pth(hillsD), pS) + V(sunC, [hillR].concat(pS));
    const mir = s => `<g transform="matrix(1 0 0 -1 0 220)">${s}</g>`;
    const dockL = y => f1(150 - (y - 140) / 6), dockR = y => f1(166 + (y - 140) * 0.3);
    const dock = poly(`150,140 166,140 ${dockR(200)},200 ${dockL(200)},200`), planks = [150, 162, 176, 190].map(y => al(dockL(y), y, dockR(y), y)).join('');
    const duck = ell(60, 152, 10, 5), dh = circ(68, 145, 4);
    const sunRef = 'M106 124 H134 M110 132 H130 M114 140 H126 M117 148 H123';
    LESSONS.push({ id: 'a10-sunsetlake', cat: 'landscapes', level: 2, title: 'A calm lake at sunset', ico: '🌇', brush: 'watercolor', need: PW, tip: 'A reflection is the same picture flipped upside down, a little darker, with wobbly breaks.', steps: [
      ['Draw a straight line across the middle. This is the edge of the lake.', al(0, 110, 200, 110)],
      ['Draw three pine trees on the left shore, standing on the line.', pineSVG],
      ['Draw low hills behind, and a sun sinking behind them.', hillSVG],
      ['Under the line, draw the trees and hills again, upside down. That is the reflection!', fold(mir(pineSVG + V(pth(hillsD), pS)))],
      ['Draw the sun’s reflection as short shiny lines, and some ripples.', ap(sunRef) + al(20, 160, 40, 160) + al(70, 176, 96, 176) + al(150, 120, 176, 120)],
      ['Draw a wooden dock coming toward you, and a little duck.', V(dock) + planks + V(duck, [dh]) + V(dh) + apg('72,144 77,146 72,147') + ac(69, 144, 0.8)],
      ['Paint warm sunset colors in the sky. Paint the water the same colors, but darker.', M(paint('#F29BB0', ar(0, 0, 200, 60)) + paint('#F7B26A', ar(0, 60, 200, 50)) + paint('#FFE08A', F(sunC)) + paint('#8A5A86', F(hillR)) + paint('#2E4A3A', Fs(pS)) + paint('#B5728A', ar(0, 110, 200, 90)) + mir(paint('#6E4570', F(hillR)) + paint('#22362B', Fs(pS))) + fat('#FFE08A', sunRef, 4) + paint(WOODD, F(dock)) + paint(SUN, F(duck) + F(dh)))]] });
  }
  {
    const main = poly('40,150 92,40 104,52 112,44 170,150'), front = poly('0,160 46,90 60,100 100,160'), farD = 'M0 116 L20 96 L34 106 L52 88 L66 100 L130 84 L150 96 L172 80 L200 98';
    const farR = pth(farD + ' L200 150 L0 150 Z');
    const mainSnow = poly('92,40 104,52 112,44 127.3,72 118,80 110,70 102,82 94,68 86,80 77.8,70'), frontSnow = poly('46,90 60,100 64,106 57,110 50,102 44,112 36.8,104');
    const mainShade = poly('92,40 104,52 112,44 170,150 96,150 102,96'), frontShade = poly('46,90 60,100 100,160 52,160 56,124');
    const pines = [[12, 198, 34], [26, 200, 42], [176, 198, 38], [192, 200, 30], [160, 200, 26]].map(([x, y, h]) => pine(x, y, h));
    LESSONS.push({ id: 'a10-mountains', cat: 'landscapes', level: 3, title: 'A snowy mountain range', ico: '🏔️', brush: 'watercolor', need: PW, tip: 'Far mountains look pale and blue because of the air in between. Near ones look darker and clearer.', steps: [
      ['Start with the closest mountain: a smaller pointy one on the left.', V(pth('M0 160 L46 90 L60 100 L100 160'))],
      ['Draw the tallest mountain behind it, with a bumpy top. Stop where the small one is in front.', V(pth('M40 150 L92 40 L104 52 L112 44 L170 150'), [front])],
      ['Draw a far, low mountain range behind. Stop at the near mountains.', V(pth(farD), [main, front])],
      ['Draw the snow caps: a zig-zag line across each top.', apl('77.8,70 86,80 94,68 102,82 110,70 118,80 127.3,72') + apl('36.8,104 44,112 50,102 57,110 64,106')],
      ['The sun is on the left. Draw a ridge line down the middle of each mountain.', V(pth('M92 40 Q104 96 96 150'), [mainSnow, front]) + V(pth('M46 90 Q58 126 52 160'), [frontSnow])],
      ['Shade the right side of each mountain with lines. Keep the left side light.', hatch(80, 200, 40, 150, 9, -12, [mainShade], [mainSnow, front]) + hatch(40, 120, 90, 160, 9, -12, [frontShade], [frontSnow])],
      ['Draw dark pine trees at the bottom. Near things are big, dark and clear.', Vs(pines)],
      ['Add birds and a soft cloud in the sky.', ap('M140 26 q5 -5 10 0 q5 -5 10 0 M164 40 q4 -4 8 0 q4 -4 8 0') + V(cloud(40, 34, 22, 9, 5, 0.3))],
      ['Paint the far range pale blue, and the near mountains darker. Leave the snow white.', M(paint(SKY, ar(0, 0, 200, 200)) + paint('#C5CEEA', F(farR)) + paint('#9AA8C8', F(main)) + paint('#6E7BA6', F(mainShade)) + paint('#7C8B6E', F(front)) + paint('#5C6B50', F(frontShade)) + paint('#fff', F(mainSnow) + F(frontSnow)) + paint('#9CCB7A', ar(0, 160, 200, 40)) + paint(DKGREEN, Fs(pines)) + paint('#fff', F(cloud(40, 34, 22, 9, 5, 0.3))))]] });
  }
  {
    const cliffL = pth('M0 44 H78 Q84 90 76 138 L0 148 Z'), cliffR = pth('M200 38 H122 Q116 90 126 138 L200 144 Z');
    const riverR = pth('M78 44 Q88 34 92 22 L108 22 Q112 30 122 38 Z'), fall = pth('M78 44 Q84 90 76 138 L126 138 Q116 90 122 38 Z');
    const hillsD = 'M0 30 Q40 16 80 26 Q120 12 160 24 Q180 18 200 26';
    const trees = [[14, 46, 30], [32, 46, 22], [180, 40, 30], [162, 40, 22]].map(([x, y, h]) => pine(x, y, h));
    const mist = cloud(100, 140, 40, 13, 7, 0.3);
    const water = [82, 88, 94, 100, 106, 112, 118].map(x => V(pth(`M${x} 30 Q${x + 3} 90 ${x - 1} 150`), [mist], [fall])).join('');
    const rocks = [ell(30, 186, 24, 12), ell(176, 186, 26, 13), ell(58, 194, 14, 7)];
    const ripples = V(arcE(100, 158, 56, 8, 0, 180), [mist].concat(rocks)) + V(arcE(100, 166, 76, 10, 10, 170), [mist].concat(rocks));
    const cracks = ap('M20 60 L30 72 L26 86 M52 54 L60 66 M40 100 L52 106 L56 120 M14 118 L24 126 M150 60 L142 74 L148 88 M178 92 L168 104 M160 120 L172 128 M186 60 L192 72');
    LESSONS.push({ id: 'a10-waterfall', cat: 'landscapes', level: 3, title: 'A waterfall into a pool', ico: '💦', brush: 'watercolor', need: PW, tip: 'Leave white paper for foam and splashes. White is a color too!', steps: [
      ['Draw a rocky cliff on each side. Leave a gap in the middle for the water.', V(cliffL) + V(cliffR)],
      ['Draw the river coming to the edge, and far hills behind it.', ap('M78 44 Q88 34 92 22 M122 38 Q112 30 108 22') + V(pth(hillsD), [riverR])],
      ['Draw pine trees on top of the cliffs.', trees.map((t, i) => V(t, trees.slice(0, i))).join('')],
      ['Draw a puffy splash cloud at the bottom of the falls.', V(mist)],
      ['Draw falling water: long wavy lines from the top down to the splash.', water],
      ['Draw ripple rings on the pool, and round rocks at the front.', ripples + Vs(rocks.slice(0, 2)) + V(rocks[2], [rocks[0]])],
      ['Draw cracks on the cliffs. These texture marks make the rock look hard and bumpy.', cracks],
      ['Shade the cliffs next to the water with lines. Wet rock looks darker.', hatch(56, 84, 44, 140, 7, -6, [cliffL]) + hatch(118, 144, 38, 140, 7, 6, [cliffR])],
      ['Paint the water light blue, but leave white streaks and the splash white.', M(paint(SKY, ar(0, 0, 200, 60)) + paint('#B7CFE8', ap(hillsD + ' L200 60 L0 60 Z')) + paint('#6DB3F2', ar(0, 130, 200, 70)) + paint(LBLUE, F(fall) + F(riverR)) + paint('#A08C7A', F(cliffL) + F(cliffR)) + paint('#fff', F(mist)) + paint('#8A7B6C', Fs(rocks)) + paint(DKGREEN, Fs(trees))) + stroke('#fff', '<path d="M91 50 Q94 90 90 126" style="stroke-width:3"/><path d="M109 46 Q112 90 108 126" style="stroke-width:3"/>')]] });
  }
  {
    const OX = [2, 102, 2, 102], OY = [2, 2, 102, 102];
    const T = (i, s) => `<g transform="translate(${OX[i]} ${OY[i]})">${s}</g>`;
    const trunkS = pth('M42 80 Q45 64 44 50 L52 50 Q51 64 54 80 Z'), branchD = 'M46 52 Q38 40 28 32 M50 52 Q58 40 68 30 M48 50 Q48 36 48 24 M42 44 Q36 42 28 44 M54 42 Q62 42 70 44';
    const canopy = cloud(48, 34, 32, 25, 8, 0.18);
    const tips = [[28, 32], [34, 37], [68, 30], [62, 35], [48, 24], [48, 33], [28, 44], [70, 44], [38, 42], [60, 42]];
    const sprg = [[28, 32], [68, 30], [48, 24], [28, 44], [70, 44], [38, 38], [58, 37]].map(([x, y]) => ac(x, y, 4.2)).join('');
    const aut = tips.map(([x, y], i) => V(leaf(x, y, x + (i % 2 ? 7 : -7), y + 4, 3))).join('') + [[16, 56], [76, 60], [64, 70], [26, 70]].map(([x, y], i) => V(leaf(x, y, x + 7, y + (i % 2 ? 4 : -3), 3))).join('');
    const snow = tips.slice(0, 8).map(([x, y]) => ap(`M${x - 4} ${y} Q${x} ${y - 4} ${x + 4} ${y}`)).join('');
    const drift = 'M0 78 Q24 70 48 76 Q72 82 96 74', flakes = flake(14, 14, 4) + flake(80, 22, 4) + flake(20, 60, 3) + flake(84, 52, 3);
    const tree = (i, br) => T(i, V(trunkS, i === 1 ? [canopy] : []) + (br ? ap(branchD) : ''));
    const frames = [0, 1, 2, 3].map(i => T(i, ar(0, 0, 96, 96) + al(0, 80, 96, 80))).join('');
    const skyC = ['#E3F4FF', '#9CCBF5', '#FFE2B0', '#C9D6E8'], grC = ['#B8E6A8', GRASS, '#D9A86C', '#fff'];
    LESSONS.push({ id: 'a10-seasons', cat: 'landscapes', level: 3, title: 'One tree, four seasons', ico: '🍂', need: PR, tip: 'Spring and summer use fresh, warm colors. Winter uses cool blues and grays. Same tree, new mood!', steps: [
      ['Draw 4 boxes on your paper. Draw a ground line near the bottom of each.', frames],
      ['Draw the same trunk in every box. Give 3 of them Y-shaped branches. Summer gets a short trunk: leaves will hide the top!', tree(0, 1) + tree(1, 0) + tree(2, 1) + tree(3, 1)],
      ['Spring (top left): draw little blossoms on the branches.', T(0, sprg)],
      ['Summer (top right): draw a big round cloud of leaves on top of the trunk.', T(1, V(canopy))],
      ['Autumn (bottom left): draw leaves on the branches, and leaves falling down.', T(2, aut + ap('M54 82 Q62 78 70 82 M20 84 Q26 80 32 84'))],
      ['Winter (bottom right): no leaves! Put snow on the branches and the ground, and snowflakes.', T(3, snow + ap(drift) + flakes)],
      ['Add the weather: a spring bird, a summer sun, autumn wind and a winter snowman.', T(0, ap('M10 16 q4 -4 8 0 q4 -4 8 0')) + T(1, ac(84, 12, 7)) + T(2, ap('M4 20 Q18 14 28 20 Q34 24 28 28 M60 14 Q72 10 82 14')) + T(3, ac(80, 70, 6) + ac(80, 60, 4) + ac(80, 70, 0.8))],
      ['Color each season: pinks and greens, bright summer, orange autumn and cool blue winter.', M([0, 1, 2, 3].map(i => T(i, paint(skyC[i], ar(0, 0, 96, 80)) + paint(grC[i], ar(0, 80, 96, 16)) + paint(WOODD, F(trunkS)))).join('') + T(0, paint(PINK, sprg)) + T(1, paint('#3E9A62', F(canopy)) + paint(SUN, ac(84, 12, 7))) + T(2, paint(ORANGE, aut)) + T(3, paint('#fff', ap(drift + ' L96 80 L0 80 Z'))))]] });
  }
  {
    const roadR = pth('M20 200 Q90 150 70 120 Q55 98 96 82 L102 82 Q88 100 110 120 Q150 150 120 200 Z');
    const hillsD = 'M0 80 Q30 64 60 74 Q100 58 140 72 Q170 62 200 76';
    const trs = [ptree(170, 180, 1.5), ptree(134, 118, 0.7), ptree(114, 96, 0.35)], trS = trs.map(t => t.top).concat(trs.map(t => t.trunk));
    const fieldD = ['M0 120 Q30 104 64 100 L80 99', 'M0 96 Q30 88 80 89', 'M200 112 Q160 96 104 96', 'M200 92 Q160 86 100 86', 'M0 160 Q30 138 70 130'];
    const house = rect(30, 84, 12, 8), hroof = poly('28,84 36,78 44,84');
    const posts = [0.1, 0.32, 0.52, 0.7, 0.86].map(t => { const p = bz([20, 200], [90, 150], [70, 120], t), h = (p[1] - 80) * 0.26; return [f1(p[0] - 10), p[1], f1(h)]; });
    const fenceSVG = posts.map(([x, y, h]) => al(x, y, x, f1(y - h))).join('') + apl(posts.map(([x, y, h]) => `${x},${f1(y - h * 0.85)}`).join(' ')) + apl(posts.map(([x, y, h]) => `${x},${f1(y - h * 0.45)}`).join(' '));
    const crops = [[190, 6], [176, 5], [164, 4]].map(([y, g]) => { let s = ''; for (let x = 132 + (200 - y) * 0.6; x < 198; x += g * 2.4) if (Math.abs(x - 170) > 8 || y < 178) s += al(f1(x), y, f1(x + 1), y - g); return s; }).join('');
    const nearR = pth('M0 120 Q30 104 64 100 L104 96 Q160 96 200 112 L200 200 L0 200 Z'), midR = pth('M0 96 Q30 88 80 89 L100 86 Q160 86 200 92 L200 200 L0 200 Z');
    LESSONS.push({ id: 'a10-countryroad', cat: 'landscapes', level: 3, title: 'A country road to the horizon', ico: '🛤️', need: PR, tip: 'Warm colors seem to come closer. Cool colors seem to go far away. Use both to show distance!', steps: [
      ['Draw the horizon line high up. Draw soft, low hills on it.', al(0, 80, 200, 80) + ap(hillsD)],
      ['Draw a road that starts wide at the bottom and winds back to a point on the horizon.', ap('M20 200 Q90 150 70 120 Q55 98 96 82 M120 200 Q150 150 110 120 Q88 100 102 82')],
      ['Draw trees along the road. Big trees close to you, smaller ones further back.', trs.map(t => V(t.top) + V(t.trunk, [t.top])).join('')],
      ['Draw curved lines for the fields. They get closer together near the horizon. Stop at the road and trees.', fieldD.map(d => V(pth(d), [roadR].concat(trS))).join('')],
      ['Draw a fence along the road. The posts get shorter and closer as they go back.', fenceSVG],
      ['Draw texture marks close to you: rows of crops and tufts of grass. Far away, leave it smooth.', crops + tuft(8, 196) + tuft(40, 194, 0.8) + tuft(140, 196)],
      ['Draw a tiny farmhouse in a far field, a sun and some birds.', V(house) + V(hroof) + ac(166, 30, 12) + ap('M50 30 q5 -5 10 0 q5 -5 10 0 M76 44 q4 -4 8 0 q4 -4 8 0')],
      ['Color warm yellows and greens close up, and cool blues far away.', M(paint(SKY, ar(0, 0, 200, 80)) + paint('#AFC0E6', ap(hillsD + ' L200 80 L0 80 Z')) + paint('#BCD8C4', ar(0, 80, 200, 120)) + paint('#A8D07A', F(midR)) + paint('#E9C860', F(nearR)) + paint('#9CCB5A', ap('M0 160 Q30 138 70 130 L60 200 L0 200 Z')) + paint('#D9C3A0', F(roadR)) + paint('#3E9A62', F(trs[0].top)) + paint('#6DB98A', F(trs[1].top)) + paint('#9CC9B0', F(trs[2].top)) + paint(WOODD, Fs(trs.map(t => t.trunk))) + paint(RED, F(house) + F(hroof)) + paint(SUN, ac(166, 30, 12)))]] });
  }
}/*}lazy*/);
