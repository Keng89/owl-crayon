/* ---------- coloring book: tap a shape to fill it, with colour-by-number and colour-by-sum ---------- */
// Every page is drawn from closed paths (one per fillable shape) with bold outlines, so a fill can never leak.
// Pairs that belong together (two eyes, two wings) are one shape made of two pieces, so a young child fills both at once.
const colorHome = (function () {
  const CB = [['k', '#22305A', 'dark blue'], ['r', '#F2604F', 'red'], ['o', '#FF8A2B', 'orange'], ['y', '#FFC23D', 'yellow'], ['g', '#2FA36B', 'green'], ['b', '#2E8BE6', 'blue'],
    ['u', '#6D55D1', 'purple'], ['p', '#F49AC1', 'pink'], ['n', '#8B5A2B', 'brown'], ['w', '#FFFFFF', 'white'], ['lb', '#8EC5F5', 'light blue'], ['lg', '#A8E06A', 'light green'],
    ['ly', '#FFE79A', 'cream'], ['gy', '#9AA0A8', 'grey'], ['sk', '#F6C9A0', 'peach'], ['t', '#2EC4B6', 'teal']];
  const HEX = {}, NAME = {};
  CB.forEach(([k, h, n]) => { HEX[k] = h; NAME[h] = n; });
  const INK = '#22305A';

  /* --- shape helpers: every shape is an absolute path in a 200 × 200 box --- */
  const f = v => +(+v).toFixed(2);
  const ep = (x, y, rx, ry) => `M${f(x - rx)},${f(y)} A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)},${f(y)} A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)},${f(y)} Z`;
  const cp = (x, y, r) => ep(x, y, r, r);
  const rp = (x, y, w, h) => `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
  const rrp = (x, y, w, h, r) => `M${x + r},${y} L${x + w - r},${y} A${r} ${r} 0 0 1 ${x + w},${y + r} L${x + w},${y + h - r} A${r} ${r} 0 0 1 ${x + w - r},${y + h} L${x + r},${y + h} A${r} ${r} 0 0 1 ${x},${y + h - r} L${x},${y + r} A${r} ${r} 0 0 1 ${x + r},${y} Z`;
  const pp = pts => 'M' + pts.trim().split(/\s+/).join(' L') + ' Z';
  // A leaf, petal or flame from (x1,y1) to (x2,y2), w wide.
  function leaf(x1, y1, x2, y2, w) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L * w, ny = dx / L * w, mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    return `M${f(x1)},${f(y1)} Q${f(mx + nx)},${f(my + ny)} ${f(x2)},${f(y2)} Q${f(mx - nx)},${f(my - ny)} ${f(x1)},${f(y1)} Z`;
  }
  // A bumpy oval: clouds, bushes, tree tops, flower heads.
  function scallop(cx, cy, rx, ry, n, k = 0.62) {
    const P = []; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / n; P.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
    let d = `M${f(P[0][0])},${f(P[0][1])}`;
    for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % n], r = Math.hypot(b[0] - a[0], b[1] - a[1]) * k; d += ` A${f(r)} ${f(r)} 0 0 1 ${f(b[0])},${f(b[1])}`; }
    return d + ' Z';
  }
  function star(cx, cy, R, r, n = 5, rot = 0) {
    const P = []; for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + rot + i * Math.PI / n, q = i % 2 ? r : R; P.push(f(cx + q * Math.cos(a)) + ',' + f(cy + q * Math.sin(a))); }
    return pp(P.join(' '));
  }
  // A vertical stripe across an oval, following its outline.
  function vband(cx, cy, rx, ry, x1, x2) {
    const h = x => ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));
    return `M${x1},${f(cy - h(x1))} A${rx} ${ry} 0 0 1 ${x2},${f(cy - h(x2))} L${x2},${f(cy + h(x2))} A${rx} ${ry} 0 0 1 ${x1},${f(cy + h(x1))} Z`;
  }
  // Half-ring (rainbow band) centred on (cx,cy).
  const arcBand = (cx, cy, R, r) => `M${cx - R},${cy} A${R} ${R} 0 0 1 ${cx + R},${cy} L${cx + r},${cy} A${r} ${r} 0 0 0 ${cx - r},${cy} Z`;
  const heart = (cx, cy, s) => `M${cx},${f(cy + s * 0.9)} C${f(cx - s * 1.6)},${f(cy - s * 0.1)} ${f(cx - s * 0.6)},${f(cy - s * 1.2)} ${cx},${f(cy - s * 0.35)} C${f(cx + s * 0.6)},${f(cy - s * 1.2)} ${f(cx + s * 1.6)},${f(cy - s * 0.1)} ${cx},${f(cy + s * 0.9)} Z`;
  const arch = (x, y, w, h) => `M${x},${y + h} L${x},${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w},${y + w / 2} L${x + w},${y + h} Z`;
  // Move, scale or mirror a path (absolute commands only).
  const NARG = { M: 2, L: 2, Q: 4, C: 6, T: 2, S: 4, A: 7, Z: 0 };
  function xf(d, map, s = 1, flip = false) {
    const tk = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g); let out = '', i = 0, cmd = '';
    while (i < tk.length) {
      if (/[A-Za-z]/.test(tk[i])) { cmd = tk[i++]; out += ' ' + cmd; if (cmd === 'Z') continue; }
      const n = NARG[cmd], a = tk.slice(i, i + n).map(Number); i += n;
      if (cmd === 'A') { const [x, y] = map(a[5], a[6]); out += ` ${f(a[0] * s)} ${f(a[1] * s)} ${flip ? -a[2] : a[2]} ${a[3]} ${flip ? 1 - a[4] : a[4]} ${f(x)},${f(y)}`; }
      else for (let j = 0; j < n; j += 2) { const [x, y] = map(a[j], a[j + 1]); out += ` ${f(x)},${f(y)}`; }
    }
    return out.trim();
  }
  const mir = d => xf(d, (x, y) => [200 - x, y], 1, true);
  const pair = d => d + ' ' + mir(d);
  const sc = (d, k, cx, cy) => xf(d, (x, y) => [cx + (x - cx) * k, cy + (y - cy) * k], k);
  const mv = (d, dx, dy) => xf(d, (x, y) => [x + dx, y + dy]);
  const pol = (r, deg, c = 100) => [c + r * Math.cos((deg - 90) * Math.PI / 180), c + r * Math.sin((deg - 90) * Math.PI / 180)];
  // Decoration (not fillable), drawn on top: lines, dots and eyes.
  const ln = (d, w) => `<path d="${d}"${w ? ` stroke-width="${w}"` : ''}/>`;
  const dot = (x, y, r, c = INK) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="none"/>`;
  const eye = (x, y, r) => dot(x, y, r) + dot(x + r * 0.35, y - r * 0.35, r * 0.35, '#fff');
  const SKY = rp(0, 0, 200, 200);

  /* --- the pages: lvl 1 = simple (5–10 big shapes), lvl 2 = detailed (20–50 shapes) --- */
  const PAGES = [
    { id: 'owl', name: 'Owl', ico: '🦉', lvl: 1, make: () => ({
      r: [[SKY, 'lb'], [rrp(10, 176, 180, 14, 7), 'n'],
        ['M55,112 Q55,62 70,54 L66,32 L86,50 Q100,46 114,50 L134,32 L130,54 Q145,62 145,112 Q145,176 100,178 Q55,176 55,112 Z', 'u'],
        [pair('M58,100 Q26,134 62,170 Q76,138 58,100 Z'), 'p'], [ep(100, 138, 30, 34), 'ly'], [cp(80, 88, 19) + ' ' + cp(120, 88, 19), 'y'],
        [pp('92,104 108,104 100,121'), 'o'], [ep(86, 178, 10, 6) + ' ' + ep(114, 178, 10, 6), 'o']],
      d: eye(82, 90, 8) + eye(122, 90, 8) + ln('M88,128 Q93,133 98,128 M102,128 Q107,133 112,128 M94,142 Q99,147 104,142 M84,152 Q89,157 94,152 M106,152 Q111,157 116,152') }) },
    { id: 'cat', name: 'Cat', ico: '🐱', lvl: 1, make: () => ({
      r: [[SKY, 'ly'], [ep(100, 182, 88, 14), 'r'], ['M136,166 Q186,160 180,112 Q176,98 164,104 Q170,148 130,150 Z', 'o'], [ep(100, 148, 46, 34), 'o'],
        [pp('60,76 64,30 96,52') + ' ' + pp('140,76 136,30 104,52'), 'o'], [cp(100, 90, 42), 'o'], [pp('93,96 107,96 100,105'), 'p'], [ep(82, 180, 13, 8) + ' ' + ep(118, 180, 13, 8), 'w']],
      d: ln('M67,66 L67,42 L86,53 M133,66 L133,42 L114,53', 2) + dot(84, 84, 5) + dot(116, 84, 5) + ln('M100,105 Q96,114 88,111 M100,105 Q104,114 112,111 M56,96 L84,100 M56,106 L84,104 M144,96 L116,100 M144,106 L116,104')
        + ln('M92,52 L94,62 M100,50 L100,61 M108,52 L106,62') }) },
    { id: 'fish', name: 'Fish', ico: '🐠', lvl: 1, make: () => ({
      r: [[SKY, 'lb'], ['M0,172 Q50,160 100,172 Q150,184 200,170 L200,200 L0,200 Z', 'ly'], ['M28,176 Q16,150 30,128 Q42,108 30,86 Q48,102 45,128 Q38,152 44,176 Z', 'g'],
        [pp('140,100 186,64 176,100 186,136'), 'o'], ['M72,68 Q92,36 124,66 Z M84,132 Q96,158 114,133 Z', 'o'], [ep(95, 100, 52, 38), 'y'], [vband(95, 100, 52, 38, 104, 120), 'o'],
        [cp(46, 60, 6) + ' ' + cp(60, 42, 8) + ' ' + cp(44, 24, 5), 'w']],
      d: dot(66, 92, 8, '#fff').replace('stroke="none"', 'stroke="' + INK + '" stroke-width="2.5"') + eye(67, 92, 4.5) + ln('M50,110 Q58,116 66,112 M84,82 Q92,100 84,118') }) },
    { id: 'tree', name: 'Apple tree', ico: '🍎', lvl: 1, make: () => ({
      r: [[SKY, 'lb'], [cp(170, 30, 17), 'y'], ['M0,168 Q100,148 200,168 L200,200 L0,200 Z', 'lg'], ['M88,182 Q93,150 90,112 L110,112 Q107,150 112,182 Z', 'n'],
        [scallop(100, 78, 64, 48, 11), 'g'], ['M140,160 L178,160 L172,186 L146,186 Z', 'o'],
        [[cp(74, 68, 9), cp(116, 56, 9), cp(130, 94, 9), cp(84, 100, 9), cp(52, 182, 8), cp(152, 154, 8), cp(166, 154, 8)].join(' '), 'r']],
      d: ln('M74,59 L76,54 M116,47 L118,42 M130,85 L132,80 M84,91 L86,86 M52,174 L54,169') + ln('M143,170 L175,170 M150,160 L152,186 M159,160 L159,186 M168,160 L166,186', 2) }) },
    { id: 'house', name: 'House', ico: '🏠', lvl: 1, make: () => ({
      r: [[SKY, 'lb'], [cp(30, 30, 16), 'y'], [scallop(166, 30, 24, 11, 8), 'w'], [rp(0, 168, 200, 32), 'lg'], [rp(124, 46, 18, 40), 'n'], [pp('30,102 100,44 170,102'), 'r'],
        [rp(44, 100, 112, 72), 'p'], ['M86,172 L86,142 Q100,126 114,142 L114,172 Z', 'u'], [rp(56, 112, 24, 24) + ' ' + rp(120, 112, 24, 24), 'ly']],
      d: ln('M68,112 L68,136 M56,124 L80,124 M132,112 L132,136 M120,124 L144,124') + dot(108, 158, 2.5) + ln('M133,40 Q127,32 134,26 Q141,20 135,12', 2.5) }) },
    { id: 'icecream', name: 'Ice cream', ico: '🍦', lvl: 1, make: () => ({
      r: [[SKY, 'lb'], [rp(0, 168, 200, 32), 'ly'], [pp('68,104 132,104 100,186'), 'o'], [cp(100, 56, 28), 'n'],
        ['M62,110 Q58,70 100,68 Q142,70 138,110 Q132,120 126,110 Q118,122 110,110 Q100,122 92,110 Q82,122 74,110 Q68,120 62,110 Z', 'p'], [cp(104, 24, 9), 'r']],
      d: ln('M104,15 Q108,6 118,4', 2.5) + ln('M71,112 L120,133 M80,112 L113,148 M124,112 L82,133 M114,112 L90,152 M76,124 L94,124 M104,124 L124,124', 2) + ln('M80,86 L86,84 M104,80 L110,84 M120,92 L126,90 M92,96 L96,100 M84,62 L90,64 M106,44 L110,40', 3) }) },
    { id: 'sun', name: 'Sun & clouds', ico: '☀️', lvl: 1, make: () => ({
      r: [[SKY, 'lb'], ['M0,170 Q50,118 110,162 Q150,128 200,148 L200,200 L0,200 Z', 'g'], ['M0,186 Q80,150 200,178 L200,200 L0,200 Z', 'lg'],
        [star(66, 66, 56, 38, 12), 'o'], [cp(66, 66, 30), 'y'], [scallop(146, 52, 36, 16, 9), 'w'], [scallop(150, 116, 30, 13, 8), 'w']],
      d: dot(56, 60, 3.5) + dot(76, 60, 3.5) + ln('M54,74 Q66,84 78,74') }) },
    { id: 'rainbow', name: 'Rainbow', ico: '🌈', lvl: 1, make: () => ({
      r: [[SKY, 'lb'], [rp(0, 150, 200, 50), 'lg'], ...[['r', 92], ['o', 80], ['y', 68], ['g', 56], ['b', 44]].map(([c, R]) => [arcBand(100, 150, R, R - 12), c]),
        [scallop(26, 150, 30, 15, 9), 'w'], [scallop(174, 150, 30, 15, 9), 'w']],
      d: '' }) },
    { id: 'car', name: 'Car', ico: '🚗', lvl: 1, make: () => ({
      r: [[SKY, 'lb'], [rp(0, 164, 200, 36), 'gy'], ['M48,110 L70,72 L134,72 L158,110 Z', 'r'], ['M16,152 L16,124 Q18,110 34,110 L166,110 Q182,112 184,128 L184,152 Z', 'r'],
        [pp('62,107 76,80 98,80 98,107') + ' ' + pp('106,80 128,80 144,107 106,107'), 'lb'], [cp(56, 152, 19) + ' ' + cp(146, 152, 19), 'k'], [cp(56, 152, 8) + ' ' + cp(146, 152, 8), 'y'],
        [rp(8, 182, 26, 5) + ' ' + rp(66, 182, 26, 5) + ' ' + rp(124, 182, 26, 5) + ' ' + rp(182, 182, 18, 5), 'w']],
      d: ln('M102,112 L102,148 M108,122 L118,122', 2.5) + dot(178, 124, 4, '#FFE79A') }) },
    { id: 'flower', name: 'Flower', ico: '🌷', lvl: 1, make: () => ({
      r: [[SKY, 'lb'], ['M95,150 Q91,120 96,96 L104,96 Q100,120 105,150 Z', 'g'], [leaf(99, 132, 60, 112, 16) + ' ' + leaf(101, 122, 140, 102, 16), 'lg'],
        ['M72,152 L128,152 L120,192 L80,192 Z', 'o'], [rrp(64, 142, 72, 14, 4), 'n'],
        [[1, 3, 5, 7].map(i => leaf(...pol(8, i * 45, 0).map((v, j) => v + (j ? 66 : 100)), ...pol(46, i * 45, 0).map((v, j) => v + (j ? 66 : 100)), 30)).join(' '), 'p'],
        [[0, 2, 4, 6].map(i => leaf(...pol(8, i * 45, 0).map((v, j) => v + (j ? 66 : 100)), ...pol(48, i * 45, 0).map((v, j) => v + (j ? 66 : 100)), 32)).join(' '), 'r'], [cp(100, 66, 15), 'y']],
      d: dot(94, 62, 2.5) + dot(106, 62, 2.5) + ln('M94,71 Q100,76 106,71', 2) }) },
    { id: 'snowman', name: 'Snowman', ico: '⛄', lvl: 1, make: () => ({
      r: [[SKY, 'lb'], ['M0,166 Q100,146 200,168 L200,200 L0,200 Z', 'w'], [cp(100, 152, 36), 'w'], [cp(100, 102, 27), 'w'], [cp(100, 62, 21), 'w'],
        ['M78,80 Q100,92 122,80 L124,90 Q100,102 76,90 Z M106,90 L118,88 L124,118 L110,120 Z', 'r'], [rp(84, 14, 32, 30), 'k'], [rp(84, 34, 32, 7), 'r'], [rrp(72, 41, 56, 8, 3), 'k'],
        [pp('100,60 124,66 100,68'), 'o']],
      d: dot(92, 56, 3) + dot(108, 56, 3) + dot(90, 72, 1.8) + dot(96, 75, 1.8) + dot(104, 75, 1.8) + dot(110, 72, 1.8) + dot(100, 104, 3) + dot(100, 118, 3) + dot(100, 142, 3.5)
        + ln('M74,100 L40,82 M48,86 L44,74 M126,100 L160,82 M152,86 L158,74', 3) + dot(30, 30, 3, '#fff') + dot(170, 50, 3, '#fff') + dot(150, 20, 2, '#fff') + dot(40, 120, 2.5, '#fff') }) },
    { id: 'turtle', name: 'Turtle', ico: '🐢', lvl: 1, make: () => ({
      r: [[SKY, 'lb'], [cp(30, 30, 16), 'y'], ['M0,160 Q100,148 200,160 L200,200 L0,200 Z', 'ly'],
        [ep(64, 150, 13, 16) + ' ' + ep(136, 150, 13, 16) + ' ' + pp('44,128 20,142 46,142'), 'lg'], [cp(166, 118, 18), 'lg'],
        ['M38,136 Q42,70 100,68 Q158,70 162,136 Z', 'g'], ['M32,136 L168,136 Q170,148 158,148 L42,148 Q30,148 32,136 Z', 'o'],
        [star(100, 104, 20, 17.5, 6, Math.PI / 6) + ' ' + cp(66, 118, 11) + ' ' + cp(134, 118, 11) + ' ' + cp(78, 86, 8) + ' ' + cp(122, 86, 8), 'lg']],
      d: eye(172, 112, 3.5) + ln('M170,126 Q178,128 182,122', 2) }) },
    { id: 'whale', name: 'Whale', ico: '🐳', lvl: 1, make: () => ({
      r: [[SKY, 'lb'], ['M0,128 Q25,118 50,128 Q75,138 100,128 Q125,118 150,128 Q175,138 200,128 L200,200 L0,200 Z', 'b'],
        ['M70,64 Q66,40 50,34 Q60,30 72,42 Q72,24 76,18 Q81,24 81,42 Q92,30 102,34 Q86,40 82,64 Z', 'w'],
        [sc('M146,112 Q168,104 166,78 Q156,68 152,58 Q168,62 176,72 Q184,58 198,58 Q188,72 182,86 Q178,118 150,132 Z', 0.85, 146, 120), 'u'],
        ['M26,118 Q26,70 84,66 Q132,64 150,100 Q156,116 150,128 Q140,150 100,150 L52,150 Q26,148 26,118 Z', 'u'],
        ['M30,132 Q60,146 100,142 Q132,140 148,128 Q140,150 100,150 L52,150 Q34,148 30,132 Z', 'lb'], [leaf(82, 126, 104, 150, 10), 'u'],
        ['M0,168 Q25,158 50,168 Q75,178 100,168 Q125,158 150,168 Q175,178 200,168 L200,200 L0,200 Z', 't']],
      d: eye(50, 102, 5) + ln('M34,118 Q46,126 60,120') }) },

    /* --- detailed pages --- */
    { id: 'butterfly', name: 'Butterfly', ico: '🦋', lvl: 2, make: () => {
      const uw = 'M102,92 Q126,22 172,26 Q198,38 186,74 Q174,102 104,102 Z', lw = 'M104,106 Q160,100 168,138 Q166,168 138,166 Q112,158 102,118 Z';
      return { r: [[SKY, 'lb'], ['M0,178 Q100,164 200,178 L200,200 L0,200 Z', 'lg'], [scallop(28, 176, 14, 14, 6), 'p'], [cp(28, 176, 5), 'y'], [scallop(174, 180, 12, 12, 6), 'u'], [cp(174, 180, 4), 'y'],
        [uw, 'o'], [mir(uw), 'o'], [lw, 'y'], [mir(lw), 'y'], [sc(uw, 0.58, 152, 60), 'r'], [mir(sc(uw, 0.58, 152, 60)), 'r'], [sc(lw, 0.55, 140, 134), 'r'], [mir(sc(lw, 0.55, 140, 134)), 'r'],
        [cp(170, 46, 7), 'y'], [mir(cp(170, 46, 7)), 'y'], [cp(140, 54, 6), 'y'], [mir(cp(140, 54, 6)), 'y'], [cp(148, 144, 6), 'y'], [mir(cp(148, 144, 6)), 'y'],
        [ep(100, 112, 7, 36), 'k'], [cp(100, 70, 9), 'k']],
        d: ln('M96,63 Q88,44 80,38 M104,63 Q112,44 120,38', 2.5) + dot(80, 38, 3.5) + dot(120, 38, 3.5) + dot(96, 68, 1.8, '#fff') + dot(104, 68, 1.8, '#fff') }; } },
    { id: 'rocket', name: 'Rocket', ico: '🚀', lvl: 2, make: () => ({
      r: [[SKY, 'k'], ...[[30, 30], [168, 26], [150, 80], [40, 96], [24, 186], [176, 196 - 14], [62, 52]].map(([x, y], i) => [star(x, y, i % 2 ? 9 : 7, i % 2 ? 4 : 3.2), 'y']),
        ['M34,148 A22 22 0 1 0 60,180 A17 17 0 1 1 34,148 Z', 'ly'], [cp(160, 146, 22), 'u'], [cp(152, 138, 5), 'p'], [cp(168, 156, 4), 'p'],
        ['M86,150 Q84,178 100,198 Q116,178 114,150 Z', 'o'], ['M92,150 Q92,172 100,186 Q108,172 108,150 Z', 'y'],
        ['M82,110 L58,148 L62,158 L86,146 Z', 'r'], [mir('M82,110 L58,148 L62,158 L86,146 Z'), 'r'], [rp(88, 150, 24, 7), 'gy'],
        ['M80,66 L120,66 L120,146 Q120,152 114,152 L86,152 Q80,152 80,146 Z', 'w'], [rp(80, 122, 40, 10), 'b'], ['M80,66 Q80,40 100,20 Q120,40 120,66 Z', 'r'],
        [cp(100, 92, 15), 'y'], [cp(100, 92, 10), 'lb']],
      d: ln('M86,140 L86,142 M114,140 L114,142', 3) + dot(96, 88, 2.5, '#fff') }) },
    { id: 'dino', name: 'Dinosaur', ico: '🦕', lvl: 2, make: () => {
      const plates = [[60, 120], [74, 104], [92, 95], [111, 95], [128, 102]].map(([x, y]) => pp(`${x - 10},${y + 7} ${x},${y - 18} ${x + 10},${y + 7}`));
      return { r: [[SKY, 'lb'], [cp(30, 28, 15), 'y'], [scallop(42, 40, 12, 9, 7), 'gy'], ['M0,122 L28,60 L54,60 L86,122 Z', 'n'], ['M28,60 Q36,72 33,86 Q41,78 41,92 Q46,76 54,60 Z', 'r'],
        ['M0,148 Q100,136 200,148 L200,200 L0,200 Z', 'lg'], ['M118,146 Q114,110 122,74 L128,74 Q122,110 128,146 Z', 'n'],
        [leaf(125, 74, 98, 90, 13), 'g'], [leaf(125, 74, 104, 52, 13), 'g'], [leaf(125, 74, 148, 54, 13), 'g'], [leaf(125, 74, 154, 90, 13), 'g'],
        [rrp(72, 138, 14, 36, 6), 'g'], [rrp(122, 138, 14, 36, 6), 'g'], ...plates.map(d => [d, 'o']),
        ['M12,150 Q40,148 54,132 Q62,94 100,90 Q132,90 140,110 Q146,90 150,72 Q154,58 168,58 Q184,58 186,72 Q186,84 172,86 Q164,88 162,98 Q158,124 152,140 Q142,154 120,154 L64,154 Q40,158 12,150 Z', 'g'],
        ['M60,152 Q92,134 130,140 Q148,138 154,128 Q148,150 124,154 L66,154 Z', 'lg'], [rrp(86, 140, 16, 38, 7), 'g'], [rrp(136, 136, 16, 40, 7), 'g'],
        [ep(30, 172, 10, 13), 'w'], [ep(50, 178, 8, 10), 'ly']],
        d: eye(170, 68, 3.5) + ln('M176,78 Q181,80 184,76', 2) + ln('M88,176 L88,172 M94,176 L94,172 M138,174 L138,170 M144,174 L144,170', 2) }; } },
    { id: 'unicorn', name: 'Unicorn', ico: '🦄', lvl: 2, make: () => {
      const H = d => xf(d, (x, y) => [x * 0.85 + 4, y * 0.85 + 30], 0.85);
      return { r: [[SKY, 'lb'], ...[['r', 76], ['y', 66], ['g', 56], ['b', 46]].map(([c, R]) => [arcBand(40, 112, R, R - 10), c]), [scallop(28, 116, 30, 13, 8), 'w'],
        [star(160, 22, 9, 4), 'y'], [star(186, 50, 7, 3), 'y'], [star(18, 20, 7, 3), 'y'],
        ...[[146, 56, 196, 40], [158, 80, 210, 80], [166, 106, 214, 122], [172, 134, 212, 162], [176, 162, 206, 198]].map(([a, b, c, e], i) => [H(leaf(a, b, c, e, 24)), ['u', 'p', 'b', 'u', 'p'][i]]),
        [H('M150,200 L146,152 Q118,140 100,128 L64,120 Q44,118 42,104 Q42,90 58,84 L94,62 Q112,44 140,48 Q176,56 184,100 Q190,150 196,200 Z'), 'w'],
        [H('M64,120 Q44,118 42,104 Q42,90 58,84 Q76,88 80,104 Q80,118 64,120 Z'), 'p'], [H(cp(118, 104, 8)), 'p'],
        [H(pp('134,54 150,16 160,58')), 'w'], [H(pp('143,48 150,32 153,50')), 'p'],
        [H(pp('110,58 126,52 121,40 107,45')), 'y'], [H(pp('107,45 121,40 116,28 104,32')), 'y'], [H(pp('104,32 116,28 98,6')), 'y'],
        [H(leaf(136, 50, 112, 72, 12)), 'p'], [H(scallop(164, 70, 9, 9, 6)), 'r'], [H(cp(164, 70, 3.5)), 'y']],
        d: '<g transform="matrix(.85 0 0 .85 4 30)">' + eye(102, 80, 4.5) + ln('M94,74 Q100,70 106,72', 2) + dot(54, 100, 2.5) + ln('M48,112 Q56,116 64,113', 2) + '</g>' }; } },
    { id: 'mandala', name: 'Mandala', ico: '🏵️', lvl: 2, make: () => {
      const R = [[SKY, 'lb']];
      for (let i = 0; i < 16; i++) R.push([leaf(...pol(60, i * 22.5), ...pol(96, i * 22.5), 13), i % 2 ? 'o' : 'r']);
      R.push([cp(100, 100, 64), 'y']);
      for (let i = 0; i < 8; i++) R.push([leaf(...pol(26, i * 45), ...pol(63, i * 45), 18), 'b']);
      for (let i = 0; i < 8; i++) R.push([cp(...pol(50, i * 45 + 22.5), 7), 'p']);
      R.push([cp(100, 100, 28), 'g']);
      for (let i = 0; i < 8; i++) R.push([leaf(...pol(9, i * 45 + 22.5), ...pol(28, i * 45 + 22.5), 9), 'y']);
      R.push([cp(100, 100, 10), 'u']);
      return { r: R, d: '' }; } },
    { id: 'robot', name: 'Robot', ico: '🤖', lvl: 2, make: () => ({
      r: [[SKY, 'lb'], [rp(0, 176, 200, 24), 'gy'], [rp(95, 14, 10, 22), 'gy'], [cp(100, 13, 7), 'r'], [rrp(52, 46, 12, 22, 3), 'r'], [rrp(136, 46, 12, 22, 3), 'r'],
        [rrp(62, 32, 76, 50, 10), 'gy'], [cp(84, 54, 9), 'w'], [cp(116, 54, 9), 'w'], ...[0, 1, 2, 3].map(i => [rp(78 + i * 11, 66, 11, 9), i % 2 ? 'y' : 'w']),
        [rp(90, 82, 20, 9), 'gy'], [rrp(34, 92, 20, 52, 8), 'gy'], [rrp(146, 92, 20, 52, 8), 'gy'], [cp(44, 150, 10), 'r'], [cp(156, 150, 10), 'r'],
        [rp(76, 150, 18, 22), 'gy'], [rp(106, 150, 18, 22), 'gy'], [rrp(66, 168, 34, 12, 5), 'o'], [rrp(100, 168, 34, 12, 5), 'o'],
        [rrp(56, 90, 88, 64, 10), 'b'], [rrp(70, 100, 60, 42, 6), 'ly'], [cp(84, 113, 6), 'r'], [cp(100, 113, 6), 'y'], [cp(116, 113, 6), 'g'], [heart(100, 131, 8), 'p']],
      d: eye(84, 54, 4) + eye(116, 54, 4) + ln('M40,96 L48,96 M152,96 L160,96', 2) }) },
    { id: 'castle', name: 'Castle', ico: '🏰', lvl: 2, make: () => ({
      r: [[SKY, 'lb'], [cp(178, 24, 13), 'y'], [scallop(44, 30, 24, 11, 8), 'w'], [scallop(130, 20, 20, 9, 7), 'w'], ['M0,152 Q100,130 200,152 L200,200 L0,200 Z', 'lg'],
        [rp(80, 56, 40, 94), 'gy'], [pp('74,58 100,18 126,58'), 'u'], [pp('100,4 116,8 100,13'), 'r'], [arch(92, 66, 16, 24), 'ly'],
        ['M40,156 L40,96 L48,96 L48,104 L57,104 L57,96 L66,96 L66,104 L75,104 L75,96 L84,96 L84,104 L93,104 L93,96 L107,96 L107,104 L116,104 L116,96 L125,96 L125,104 L134,104 L134,96 L143,96 L143,104 L152,104 L152,96 L160,96 L160,156 Z', 'gy'],
        [arch(64, 114, 12, 18), 'ly'], [arch(124, 114, 12, 18), 'ly'], ['M84,158 L84,130 Q100,110 116,130 L116,158 Z', 'n'],
        [rp(22, 80, 36, 80), 'gy'], [rp(142, 80, 36, 80), 'gy'], [pp('16,82 40,38 64,82'), 'b'], [pp('136,82 160,38 184,82'), 'b'],
        [pp('40,22 56,26 40,31'), 'r'], [pp('160,22 176,26 160,31'), 'r'], [arch(34, 100, 12, 18), 'ly'], [arch(154, 100, 12, 18), 'ly'],
        ['M0,174 Q100,164 200,174 L200,190 Q100,182 0,190 Z', 'b'], ['M84,158 L116,158 L122,194 L78,194 Z', 'n']],
      d: ln('M100,18 L100,4 M40,38 L40,22 M160,38 L160,22', 2.5) + ln('M80,166 L120,166 M79,176 L121,176 M78,186 L122,186', 2) }) },
    { id: 'train', name: 'Train', ico: '🚂', lvl: 2, make: () => ({
      r: [[SKY, 'lb'], [cp(150, 54, 7), 'w'], [cp(158, 38, 9), 'w'], [cp(172, 21, 11), 'w'], [rp(0, 170, 200, 30), 'lg'], [rp(0, 166, 200, 6), 'n'],
        [rrp(96, 68, 48, 10, 3), 'u'], [rp(100, 78, 40, 72), 'r'], [rp(108, 88, 24, 22), 'ly'],
        ['M140,104 L180,104 Q188,104 188,114 L188,140 Q188,150 180,150 L140,150 Z', 'b'], [rp(151, 104, 9, 46) + ' ' + rp(169, 104, 9, 46), 'y'],
        ['M146,104 L144,76 L160,76 L158,104 Z', 'gy'], [rrp(140, 66, 24, 10, 3), 'k'], [cp(190, 118, 5), 'y'],
        [rp(96, 148, 92, 10), 'k'], [cp(116, 158, 15), 'r'], [cp(150, 160, 12), 'r'], [cp(176, 160, 12), 'r'], [cp(116, 158, 5), 'y'], [cp(150, 160, 4), 'y'], [cp(176, 160, 4), 'y'], ['M186,142 L199,166 L182,166 Z', 'y'],
        [rrp(8, 72, 84, 10, 4), 'u'], [rp(14, 82, 72, 66), 'g'], [rp(22, 94, 24, 22), 'ly'], [rp(54, 94, 24, 22), 'ly'], [rp(84, 144, 16, 6), 'gy'],
        [cp(30, 158, 12), 'k'], [cp(70, 158, 12), 'k'], [cp(30, 158, 4), 'y'], [cp(70, 158, 4), 'y']],
      d: ln('M10,176 L10,184 M30,176 L30,184 M50,176 L50,184 M70,176 L70,184 M90,176 L90,184 M110,176 L110,184 M130,176 L130,184 M150,176 L150,184 M170,176 L170,184 M190,176 L190,184', 2) }) },
    { id: 'cake', name: 'Birthday cake', ico: '🎂', lvl: 2, make: () => {
      const flags = [0, 1, 2, 3, 4, 5].map(i => { const t = (i + 0.5) / 6, x = 200 * t, y = (1 - t) * (1 - t) * 10 + 2 * (1 - t) * t * 44 + t * t * 10; return pp(`${f(x - 12)},${f(y - 3)} ${f(x + 12)},${f(y + 3)} ${f(x - 2)},${f(y + 24)}`); });
      const drip = (x, y, w, n, dep) => { let d = `M${x},${y} L${x + w},${y} L${x + w},${y + 6}`; const s = w / n; for (let i = 0; i < n; i++) { const xr = x + w - i * s; d += ` Q${f(xr - s / 2)},${y + 6 + (i % 2 ? dep : dep * 2)} ${f(xr - s)},${y + 6}`; } return d + ' Z'; };
      return { r: [[SKY, 'lb'], ...flags.map((d, i) => [d, ['r', 'y', 'b', 'g', 'u', 'o'][i]]), [ep(30, 74, 14, 18), 'r'], [ep(172, 70, 14, 18), 'b'], [rp(0, 168, 200, 32), 'n'], [ep(100, 166, 74, 8), 'w'],
        [rrp(40, 120, 120, 46, 6), 'p'], [drip(40, 120, 120, 6, 6), 'w'], [rrp(60, 82, 80, 38, 6), 'u'], [drip(60, 82, 80, 4, 5), 'ly'],
        [rp(72, 56, 8, 26), 'b'], [rp(96, 50, 8, 32), 'y'], [rp(120, 56, 8, 26), 'g'], [leaf(76, 56, 76, 38, 6), 'o'], [leaf(100, 50, 100, 32, 6), 'o'], [leaf(124, 56, 124, 38, 6), 'o'],
        ...[[56, 150], [84, 154], [116, 154], [144, 150]].map(([x, y]) => [cp(x, y, 5), 'r']), ...[[76, 108], [100, 110], [124, 108]].map(([x, y]) => [cp(x, y, 4.5), 'y'])],
        d: ln('M0,10 Q100,78 200,10', 2) + ln('M30,92 Q24,120 34,160 M172,88 Q178,120 168,160', 1.5) + ln('M24,66 Q26,60 30,59', 2) }; } },
    { id: 'monster', name: 'Monster', ico: '👾', lvl: 2, make: () => ({
      r: [[SKY, 'lb'], ['M0,170 Q100,156 200,170 L200,200 L0,200 Z', 'lg'], [leaf(72, 62, 56, 22, 10), 'y'], [leaf(128, 62, 144, 22, 10), 'y'],
        [leaf(56, 112, 16, 82, 13), 'u'], [leaf(144, 112, 184, 82, 13), 'u'], [ep(78, 178, 18, 9), 'o'], [ep(122, 178, 18, 9), 'o'],
        ['M50,120 Q46,60 100,52 Q154,60 150,120 Q152,176 100,178 Q48,176 50,120 Z', 'u'], [ep(100, 150, 30, 22), 'p'],
        [cp(62, 104, 6), 'p'], [cp(140, 100, 5), 'p'], [cp(60, 146, 5), 'p'], [cp(140, 148, 6), 'p'],
        [cp(76, 84, 12), 'w'], [cp(100, 72, 14), 'w'], [cp(124, 84, 12), 'w'], [cp(77, 86, 6), 'g'], [cp(100, 74, 7), 'g'], [cp(123, 86, 6), 'g'],
        ['M70,106 Q100,148 130,106 Q100,116 70,106 Z', 'k'], [pp('80,109 87,110 83,119'), 'w'], [pp('113,110 120,109 117,119'), 'w'], [ep(100, 126, 10, 5), 'r']],
      d: dot(77, 86, 2.5) + dot(100, 74, 3) + dot(123, 86, 2.5) }) },
    { id: 'garden', name: 'Garden', ico: '🌻', lvl: 2, make: () => {
      const pick = x => pp(`${x},84 ${x + 11},72 ${x + 22},84 ${x + 22},150 ${x},150`);
      const fl = [[34, 112, 'p'], [100, 104, 'u'], [166, 114, 'r']];
      return { r: [[SKY, 'lb'], [cp(24, 24, 14), 'y'], [scallop(150, 26, 28, 11, 8), 'w'], [rp(0, 96, 200, 8) + ' ' + rp(0, 126, 200, 8), 'n'],
        ...[6, 38, 70, 102, 134, 166].map(x => [pick(x), 'w']), ['M0,146 Q50,138 100,146 Q150,154 200,144 L200,200 L0,200 Z', 'g'],
        [fl.map(([x, y]) => rp(x - 2, y + 10, 4, 160 - y)).join(' '), 'lg'], ...fl.map(([x, y, c]) => [scallop(x, y, 14, 14, 6), c]), ...fl.map(([x, y]) => [cp(x, y, 5.5), 'y']),
        ['M126,188 Q128,178 138,180 L166,180 Q176,170 182,176 Q186,188 176,188 Z', 'ly'], [cp(152, 174, 13), 'o'],
        [rrp(64, 170, 14, 20, 4), 'w'], ['M50,172 Q71,138 92,172 Z', 'r'], [cp(64, 162, 3) + ' ' + cp(77, 158, 3) + ' ' + cp(72, 167, 2.5), 'w'],
        [ep(104, 40, 7, 10) + ' ' + ep(116, 40, 7, 10), 'w'], [ep(110, 54, 13, 9), 'y'], [vband(110, 54, 13, 9, 107, 113), 'k']],
        d: ln('M152,166 Q160,170 156,176 Q150,180 148,172', 2) + ln('M178,176 L180,166 M182,177 L186,168', 2) + dot(180, 166, 2) + dot(186, 168, 2) + dot(99, 52, 1.8) + ln('M123,54 L128,54', 2) }; } },
    { id: 'balloon', name: 'Hot air balloon', ico: '🎈', lvl: 2, make: () => {
      const mer = k => [100 + 22 * k, 100 + 7 * k];
      const gore = k => `M100,16 C${100 + 22 * k},16 ${100 + 22 * k},100 ${mer(k)[1]},136 L${mer(k + 1)[1]},136 C${100 + 22 * (k + 1)},100 ${100 + 22 * (k + 1)},16 100,16 Z`;
      const G = [-3, -2, -1, 0, 1, 2].map(gore), small = d => xf(d, (x, y) => [28 + (x - 100) * 0.3, 40 + (y - 16) * 0.3], 0.3);
      return { r: [[SKY, 'lb'], [cp(178, 26, 13), 'y'], [scallop(30, 120, 24, 10, 8), 'w'], [scallop(172, 96, 22, 9, 7), 'w'], [scallop(176, 62, 16, 7, 7), 'w'],
        ['M0,172 L50,110 L100,172 Z', 'gy'], ['M104,172 L168,104 L232,172 Z', 'u'], [pp('50,110 40,122 46,119 51,125 56,119 60,122'), 'w'], [pp('168,104 154.8,118 161,115 168,121 175,115 181.2,118'), 'w'],
        [rp(0, 168, 200, 32), 'lg'], [scallop(20, 166, 14, 10, 7), 'g'], [scallop(184, 164, 14, 10, 7), 'g'],
        ...G.map((d, i) => [d, ['r', 'y', 'o', 'r', 'y', 'o'][i]]), [rrp(88, 150, 24, 18, 3), 'n'],
        [small(G[0]) + ' ' + small(G[2]) + ' ' + small(G[4]), 'b'], [small(G[1]) + ' ' + small(G[3]) + ' ' + small(G[5]), 'w'], [rrp(25, 81, 6, 6, 1), 'n']],
        d: ln('M79,136 L89,150 M121,136 L111,150 M93,136 L95,150 M107,136 L105,150', 1.5) + ln('M22,76 L25.5,81 M34,76 L30.5,81', 1) + ln('M150,46 Q155,41 160,46 Q165,41 170,46 M60,30 Q64,26 68,30 Q72,26 76,30', 2) }; } },
    { id: 'boat', name: 'Sailboat', ico: '⛵', lvl: 2, make: () => ({
      r: [[SKY, 'lb'], [cp(36, 36, 18), 'y'], [scallop(150, 30, 28, 11, 8), 'w'], [scallop(32, 92, 22, 9, 7), 'w'], ['M150,120 Q170,92 196,120 Z', 'lg'], [leaf(172, 108, 172, 80, 6), 'g'],
        ['M0,120 Q25,112 50,120 Q75,128 100,120 Q125,112 150,120 Q175,128 200,120 L200,200 L0,200 Z', 'b'],
        [pp('102,24 102,112 152,112'), 'w'], [pp('102,72 129.3,72 137.2,86 102,86'), 'b'], [pp('96,30 96,112 52,112'), 'y'], [pp('96,70 96,84 67,84 74.5,70'), 'o'], [pp('100,10 118,15 100,20'), 'r'], [rp(97, 10, 5, 108), 'n'],
        ['M40,116 L164,116 L148,146 L56,146 Z', 'r'], [rp(48, 122, 108, 7), 'w'], [cp(74, 136, 4), 'lb'], [cp(100, 136, 4), 'lb'], [cp(126, 136, 4), 'lb'],
        ['M0,150 Q25,142 50,150 Q75,158 100,150 Q125,142 150,150 Q175,158 200,150 L200,170 L0,170 Z', 't'],
        ['M0,170 Q25,162 50,170 Q75,178 100,170 Q125,162 150,170 Q175,178 200,170 L200,200 L0,200 Z', 'b'],
        [ep(30, 186, 10, 5) + ' ' + pp('38,186 46,180 46,192'), 'o'], [ep(170, 160, 8, 4) + ' ' + pp('163,160 156,155 156,165'), 'p']],
      d: ln('M60,70 Q65,65 70,70 Q75,65 80,70 M130,60 Q134,56 138,60 Q142,56 146,60', 2) + dot(26, 185, 1.5) + dot(174, 159, 1.2) }) }
  ];
  // Build each page's shapes once.
  PAGES.forEach(pg => { const m = pg.make(); pg.R = m.r.map(([d, c], i) => ({ id: 'r' + i, d, hint: HEX[c] })); pg.deco = m.d; });
  // A page can be coloured by number when it uses 8 or fewer colours.
  PAGES.forEach(pg => { pg.key = [...new Set(pg.R.map(r => r.hint))]; pg.num = pg.key.length <= 8; });
  const byId = id => PAGES.find(p => p.id === id);
  const rec = id => { st.coloring = st.coloring || {}; return st.coloring[id] = st.coloring[id] || { f: {} }; };
  const filledCount = pg => pg.R.filter(r => (rec(pg.id).f || {})[r.id]).length;

  function svgFor(pg, fills, { cls = '', labels = '', w = 0 } = {}) {
    const sw = pg.lvl === 1 ? 3 : 2.2;
    return `<svg ${w ? `xmlns="http://www.w3.org/2000/svg" width="${w}" height="${w}" ` : ''}viewBox="0 0 200 200" class="${cls}" role="img" aria-label="${pg.name} coloring page">`
      + `<g stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round">${pg.R.map(r => `<path data-r="${r.id}" d="${r.d}" fill="${fills[r.id] || '#FFFFFF'}"/>`).join('')}</g>`
      + `<g pointer-events="none" fill="none" stroke="${INK}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${pg.deco}</g>${labels}</svg>`;
  }

  /* --- where to write the numbers: the most open visible spot of every shape (and of every big piece of a shape) --- */
  const spotCache = {};
  function spots(pg, svg) {
    if (spotCache[pg.id]) return spotCache[pg.id];
    const N = 64, step = 200 / N, els = [...svg.querySelectorAll('[data-r]')], bb = els.map(e => e.getBBox()), lab = new Int16Array(N * N).fill(-1), pt = svg.createSVGPoint();
    for (let gy = 0; gy < N; gy++) for (let gx = 0; gx < N; gx++) {
      pt.x = (gx + 0.5) * step; pt.y = (gy + 0.5) * step;
      for (let j = els.length - 1; j >= 0; j--) { const b = bb[j]; if (pt.x < b.x || pt.y < b.y || pt.x > b.x + b.width || pt.y > b.y + b.height) continue; if (els[j].isPointInFill(pt)) { lab[gy * N + gx] = j; break; } }
    }
    // Distance (in cells) from each cell to the nearest cell of another shape.
    const dist = new Float32Array(N * N).fill(1e9), q = [];
    const nb = i => { const x = i % N, y = (i / N) | 0, o = []; if (x > 0) o.push(i - 1); if (x < N - 1) o.push(i + 1); if (y > 0) o.push(i - N); if (y < N - 1) o.push(i + N); return o; };
    for (let i = 0; i < N * N; i++) { const x = i % N, y = (i / N) | 0; if (x === 0 || y === 0 || x === N - 1 || y === N - 1 || nb(i).some(k => lab[k] !== lab[i])) { dist[i] = 1; q.push(i); } }
    for (let h = 0; h < q.length; h++) { const i = q[h]; for (const k of nb(i)) if (lab[k] === lab[i] && dist[k] > dist[i] + 1) { dist[k] = dist[i] + 1; q.push(k); } }
    // Connected pieces of each shape; label every piece at least a third the size of its biggest.
    const seen = new Uint8Array(N * N), pieces = els.map(() => []);
    for (let i = 0; i < N * N; i++) {
      if (seen[i] || lab[i] < 0) continue;
      const L = lab[i], st2 = [i]; let n = 0, best = i; seen[i] = 1;
      while (st2.length) { const c = st2.pop(); n++; if (dist[c] > dist[best]) best = c; for (const k of nb(c)) if (!seen[k] && lab[k] === L) { seen[k] = 1; st2.push(k); } }
      pieces[L].push({ n, x: (best % N + 0.5) * step, y: (((best / N) | 0) + 0.5) * step, r: dist[best] * step });
    }
    const out = pg.R.map((r, j) => {
      const ps = pieces[j].sort((a, b) => b.n - a.n);
      if (!ps.length) { const b = bb[j]; return { cells: 0, at: [{ x: b.x + b.width / 2, y: b.y + b.height / 2, r: 4 }] }; }
      return { cells: ps.reduce((a, p) => a + p.n, 0), at: ps.filter(p => p.n >= Math.max(3, ps[0].n / 3)) };
    });
    return spotCache[pg.id] = out;
  }

  /* --- colour-by-number, colour-by-sum (age 7+) and colour-by-take-away (age 9+) --- */
  const MODES = [['n', '1 2 3'], ['sum', '2+3'], ['sub', '5−2']];
  function clue(n, mode, seed) {
    if (mode === 'sum') { if (n === 1) return ['1+0', '1 plus 0']; const a = 1 + seed % (n - 1); return [`${a}+${n - a}`, `${a} plus ${n - a}`]; }
    if (mode === 'sub') { const b = 1 + seed % 5; return [`${n + b}−${b}`, `${n + b} take away ${b}`]; }
    return [String(n), String(n)];
  }

  function colorHomeView(tab) {
    tab = tab || colorHomeView.tab || 'easy'; colorHomeView.tab = tab;
    const list = PAGES.filter(p => tab === 'easy' ? p.lvl === 1 : tab === 'detail' ? p.lvl === 2 : p.num);
    const done = PAGES.filter(p => rec(p.id).done).length;
    view.innerHTML = `${crumbs('🖌️ Coloring book')}
      <p class="cb-lead">Pick a picture. Tap a colour, then tap a shape to fill it. <b>${done} of ${PAGES.length}</b> finished.</p>
      <div class="tabs cb-tabs" role="group" aria-label="Kind of page">${[['easy', '🖍️ Easy'], ['detail', '🔍 Detailed'], ['num', '🔢 Color by number']].map(([k, t]) => `<button data-tab="${k}" aria-pressed="${k === tab}">${t}</button>`).join('')}</div>
      <div class="cb-grid">${list.map(p => { const R = rec(p.id), n = filledCount(p);
        return `<button class="cb-card${R.done ? ' done' : ''}" data-pg="${p.id}" aria-label="${p.name}${R.done ? ', finished' : ''}">${svgFor(p, R.f || {}, { cls: 'cb-thumb' })}<b>${p.ico} ${p.name}</b><span>${R.done ? '✅ Done' : n ? `${n} of ${p.R.length} shapes` : `${p.R.length} shapes`}</span></button>`; }).join('')}</div>`;
    wireBack(artHome);
    sayScreen(tab === 'num' ? 'Color by number! Every number has its own colour. Pick a picture.' : 'Coloring book! Pick a picture to color.');
    view.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => go(colorHomeView, b.dataset.tab));
    view.querySelectorAll('[data-pg]').forEach(b => b.onclick = () => go(colorPage, b.dataset.pg, tab === 'num'));
  }

  function colorPage(id, numMode) {
    const pg = byId(id), R = rec(id), fills = R.f = R.f || {}, undo = [];
    numMode = !!numMode && pg.num;
    let brush = HEX.r, mode = st.age >= 9 ? 'sub' : st.age >= 7 ? 'sum' : 'n', cheered = false;
    const numOf = r => pg.key.indexOf(r.hint) + 1;
    view.innerHTML = `${crumbs(`${pg.ico} ${pg.name}`)}
      <div class="cb-wrap">
        <div class="cb-stage" id="cbStage">${svgFor(pg, fills, { cls: 'cb-svg' })}
          <div class="cb-idea" id="cbIdea" hidden><b>✨ Owl's idea</b><div id="cbIdeaPic"></div><button class="tool" id="cbOne">✨ Fill one for me</button></div></div>
        <div class="cb-side">
          <div class="cb-key" id="cbKey" hidden></div>
          <div class="cb-pal" role="group" aria-label="Colours">${CB.map(([k, h, n]) => `<button class="cb-sw" data-c="${h}" style="background:${h}" aria-label="${n}" aria-pressed="${h === brush}"></button>`).join('')}</div>
          <div class="cb-tools">
            <button class="tool" id="cbEr" aria-pressed="false">🧽 Eraser</button>
            <button class="tool" id="cbUn">↩️ Undo</button>
            <button class="tool" id="cbMagic" aria-pressed="false">✨ Magic</button>
            ${pg.num ? `<button class="tool" id="cbNum" aria-pressed="${numMode}">🔢 Numbers</button><button class="tool" id="cbMode" ${numMode ? '' : 'hidden'}></button>` : ''}
            <button class="tool" id="cbClr">🗑️ Start over</button>
            <button class="tool cb-save" id="cbSave">💾 Save</button>
          </div>
          <p class="cb-msg" id="cbMsg" aria-live="polite"></p>
        </div>
      </div>`;
    wireBack(colorHomeView);
    const svg = $('.cb-svg'), msg = t => { $('#cbMsg').textContent = t; };
    const el = rid => svg.querySelector(`[data-r="${rid}"]`);
    const anim = (e, cls) => { e.classList.remove('cb-pop', 'cb-flash', 'cb-wig'); void e.getBBox(); e.classList.add(cls); setTimeout(() => e.classList.remove(cls), 1100); };
    function paint(rid, c) { const e = el(rid); if (c) fills[rid] = c; else delete fills[rid]; e.setAttribute('fill', c || '#FFFFFF'); updLabel(rid); return e; }
    function updLabel(rid) { const r = pg.R.find(x => x.id === rid); svg.querySelectorAll(`[data-l="${rid}"]`).forEach(t => t.style.display = fills[rid] === r.hint ? 'none' : ''); }

    function drawLabels() {
      svg.querySelectorAll('.cb-lab').forEach(g => g.remove());
      $('#cbKey').hidden = !numMode; const mb = $('#cbMode'); if (mb) { mb.hidden = !numMode; mb.textContent = MODES.find(m => m[0] === mode)[1]; }
      if (!numMode) return;
      const sp = spots(pg, svg);
      let out = '<g class="cb-lab" pointer-events="none" font-family="Baloo 2,Arial Rounded MT Bold,ui-rounded,sans-serif" font-weight="800" fill="' + INK + '" stroke="#fff" stroke-width="2.4" paint-order="stroke" text-anchor="middle" dominant-baseline="central">';
      pg.R.forEach((r, i) => { const [txt] = clue(numOf(r), mode, i * 7 + id.length); sp[i].at.forEach(a => {
        const fs = Math.max(5, Math.min(14, a.r * 1.3, a.r * 2.6 / Math.max(1, txt.length * 0.62)));
        out += `<text data-l="${r.id}" x="${f(a.x)}" y="${f(a.y)}" font-size="${f(fs)}">${txt}</text>`; }); });
      svg.insertAdjacentHTML('beforeend', out + '</g>');
      pg.R.forEach(r => updLabel(r.id));
      $('#cbKey').innerHTML = pg.key.map((h, i) => `<button class="cb-chip" data-c="${h}" aria-label="${i + 1} is ${NAME[h]}"><i style="background:${h}"></i>${i + 1}</button>`).join('');
      $('#cbKey').querySelectorAll('[data-c]').forEach(b => b.onclick = () => setBrush(b.dataset.c, true));
    }
    function setBrush(c, speak) {
      brush = c; $('#cbEr').setAttribute('aria-pressed', String(c === null));
      view.querySelectorAll('.cb-sw').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.c === c)));
      if (speak && c) { const n = pg.key.indexOf(c) + 1; say(numMode && n ? `${NAME[c]}. That is number ${n}.` : NAME[c]); }
    }
    function tap(rid) {
      const r = pg.R.find(x => x.id === rid), prev = fills[rid] || null;
      if (prev === brush) { anim(el(rid), 'cb-pop'); return; }
      undo.push([[rid, prev]]); if (undo.length > 200) undo.shift();
      const e = paint(rid, brush), b = e.getBBox();
      anim(e, b.width * b.height > 9000 ? 'cb-flash' : 'cb-pop');
      tone([brush ? 392 + (CB.findIndex(x => x[1] === brush) % 8) * 49 : 300], 0.07);
      if (numMode && brush && brush !== r.hint) {
        const n = numOf(r), [, spoken] = clue(n, mode, pg.R.indexOf(r) * 7 + id.length);
        setTimeout(() => anim(e, 'cb-wig'), 380);
        msg(`That shape is number ${n}. ${n} is ${NAME[r.hint]}.`); say(`${mode === 'n' ? '' : spoken + ' is ' + n + '. '}Number ${n} is ${NAME[r.hint]}.`);
      } else if (numMode && brush && mode !== 'n' && Math.random() < 0.5) { const n = numOf(r), [, spoken] = clue(n, mode, pg.R.indexOf(r) * 7 + id.length); say(`${spoken} is ${n}!`); }
      save(); check();
    }
    function check() {
      const left = pg.R.filter(r => !fills[r.id]);
      if (left.length) { if (!numMode) msg(left.length <= 3 ? `Only ${left.length} more shape${left.length > 1 ? 's' : ''} to fill!` : ''); return; }
      if (numMode) {
        const wrong = pg.R.filter(r => fills[r.id] !== r.hint);
        if (wrong.length) { wrong.forEach(r => anim(el(r.id), 'cb-wig')); msg(`Almost! ${wrong.length} shape${wrong.length > 1 ? 's do' : ' does'} not match ${wrong.length > 1 ? 'their numbers' : 'its number'}. Look for the wiggly ones!`); say(`Almost! Look for the wiggly shape${wrong.length > 1 ? 's' : ''}. Check ${wrong.length > 1 ? 'their numbers' : 'its number'}.`); return; }
      }
      if (cheered) return; cheered = true;
      const first = !R.done, firstNum = numMode && !R.nd;
      R.done = R.done || today(); if (numMode) R.nd = R.nd || today();
      questTick('art'); dayLog('art');
      if (first || firstNum) addStars((first ? 2 : 0) + (firstNum ? 1 : 0)); else save();
      confetti(); yay();
      const t = numMode ? `You matched every number! What a beautiful ${pg.name.toLowerCase()}!` : `You colored the whole ${pg.name.toLowerCase()}! Beautiful!`;
      msg(t + (first || firstNum ? ' ⭐ You earned stars!' : '') + ' Tap Save to keep it.'); say(t + (first || firstNum ? ' You earned stars!' : ''));
    }
    svg.addEventListener('click', e => { const t = e.target.closest && e.target.closest('[data-r]'); if (t) tap(t.dataset.r); });
    view.querySelectorAll('.cb-sw').forEach(b => b.onclick = () => setBrush(b.dataset.c, true));
    $('#cbEr').onclick = () => { setBrush(brush === null ? HEX.r : null); if (brush === null) say('Eraser. Tap a shape to make it white again.'); };
    $('#cbUn').onclick = () => { const u = undo.pop(); if (!u) { say('Nothing to undo.'); return; } u.forEach(([rid, c]) => anim(paint(rid, c), 'cb-flash')); cheered = false; save(); msg(''); };
    $('#cbClr').onclick = () => { const all = Object.keys(fills).map(rid => [rid, fills[rid]]); if (!all.length) return; undo.push(all); all.forEach(([rid]) => paint(rid, null)); cheered = false; save(); msg('A fresh page! Undo brings your colours back.'); say('A fresh page!'); };
    // Magic: Owl shows a coloured-in idea. Tap a shape in it to borrow that colour, or let Owl fill one shape.
    $('#cbMagic').onclick = () => {
      const box = $('#cbIdea'), show = box.hidden; box.hidden = !show; $('#cbMagic').setAttribute('aria-pressed', String(show));
      if (show) { const hint = {}; pg.R.forEach(r => hint[r.id] = r.hint); $('#cbIdeaPic').innerHTML = svgFor(pg, hint); say("Here is Owl's idea! Tap a shape in the little picture to use its colour, or use your own colours."); }
    };
    $('#cbIdeaPic').addEventListener('click', e => { const t = e.target.closest && e.target.closest('[data-r]'); if (t) { const r = pg.R.find(x => x.id === t.dataset.r); setBrush(r.hint, true); } });
    $('#cbOne').onclick = () => {
      const left = pg.R.filter(r => fills[r.id] !== r.hint && !(fills[r.id] && !numMode)); if (!left.length) { say('Every shape is colored!'); return; }
      const r = pick(left), keep = brush; brush = r.hint; tap(r.id); brush = keep; tone([784, 988], 0.08);
    };
    if (pg.num) {
      $('#cbNum').onclick = () => { numMode = !numMode; $('#cbNum').setAttribute('aria-pressed', String(numMode)); cheered = false; drawLabels(); say(numMode ? 'Color by number! Find the number, then use its colour from the key.' : 'Free coloring. Use any colours you like!'); };
      $('#cbMode').onclick = () => { mode = MODES[(MODES.findIndex(m => m[0] === mode) + 1) % MODES.length][0]; drawLabels(); say(mode === 'n' ? 'Numbers.' : mode === 'sum' ? 'Adding! Work out each sum to find its colour.' : 'Taking away! Work out each one to find its colour.'); };
    }
    $('#cbSave').onclick = () => savePng(pg, fills).then(url => {
      gallery.unshift(url); gallery = gallery.slice(0, 30); saveGallery();
      msg('Saved to My pictures! 🖼️'); say('Saved to your pictures!'); tone([659, 784, 1047], 0.09);
    }).catch(() => { msg('Sorry, this picture could not be saved on this device.'); });
    drawLabels();
    sayScreen(numMode ? `${pg.name}. Color by number! Each number has a colour in the key. Number 1 is ${NAME[pg.key[0]]}.` : `${pg.name}. Pick a colour, then tap a shape to fill it.`);
  }

  // Draw the page (without numbers) onto a canvas and keep it as a small picture, like the other drawings.
  function savePng(pg, fills) {
    return new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => { try { const c = document.createElement('canvas'); c.width = c.height = 360; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 360, 360); x.drawImage(im, 0, 0, 360, 360); res(c.toDataURL('image/jpeg', 0.8)); } catch (e) { rej(e); } };
      im.onerror = rej;
      im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgFor(pg, fills, { w: 720 }));
    });
  }

  if (location.hash === '#selftest') window.__color = { PAGES, HEX, NAME, colorPage, colorHomeView, svgFor, spots: id => spots(byId(id), view.querySelector('.cb-svg')), get state() { return st.coloring; } };
  return () => colorHomeView();
})();
