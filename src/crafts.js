/* ---------- Crafts corner: drawing kit, mini-movie engine and screens ---------- */
// Real crafts to make with paper, playdough, string and boxes, from Easy to Expert. Every step is a short looping
// "mini-movie" drawn in code (SVG, redrawn each frame: scissors cut along a dashed line, paper folds over, glue dots
// appear, beads slide down a string), read aloud by Owl with the text shown too. No video files, no network.
// The craft data lives in crafts2.js, crafts3.js and crafts4.js and is added with craftsHome.add(). Finished crafts are kept per
// player in st.crafts, so they are saved, backed up and removed with the player like everything else.
const craftsHome = (() => {
  const OL = '#22305A';
  const C = { red: '#F2604F', orange: '#FF8A2B', yellow: '#FFC23D', green: '#2FA36B', blue: '#2E8BE6', purple: '#6D55D1', pink: '#F49AC1', brown: '#A86B3C',
    white: '#FFFFFF', sky: '#8EC5F5', mint: '#9ED9B4', card: '#D9A86C', grey: '#A9B2BC', black: '#2B2B33', cream: '#FFF3D6', lime: '#B6E05A', teal: '#1D9AA0', tan: '#E8C9A0', paper: '#FFFDF7' };
  const f1 = n => Math.round(n * 10) / 10;
  const P = pts => pts.map(p => f1(p[0]) + ',' + f1(p[1])).join(' ');
  const lerp = (a, b, t) => a + (b - a) * t;
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ez = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const seg = (e, a, b) => cl((e - a) / (b - a)); // the part of the progress between a and b, as 0..1
  const sk = (w = 1.6) => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const rr = i => { const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); }; // the same "random" every frame

  /* --- the drawing kit: small shapes the craft data is built from (viewBox 0 0 200 150) --- */
  const K = {
    C, OL, f1,
    poly: (pts, fill, w = 1.6, extra = '') => `<polygon points="${P(pts)}" fill="${fill}" ${w ? sk(w) : ''} ${extra}/>`,
    rect: (x, y, w, h, fill, rx = 3, extra = '') => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx}" fill="${fill}" ${sk()} ${extra}/>`,
    circ: (cx, cy, r, fill, w = 1.6, extra = '') => `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="${fill}" ${w ? sk(w) : ''} ${extra}/>`,
    ell: (cx, cy, rx, ry, fill, w = 1.6, extra = '') => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${fill}" ${w ? sk(w) : ''} ${extra}/>`,
    path: (d, fill = 'none', w = 1.6, extra = '') => `<path d="${d}" fill="${fill}" ${w ? sk(w) : ''} ${extra}/>`,
    line: (pts, color = OL, w = 2, dash = '') => `<polyline points="${P(pts)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`,
    emo: (ch, x, y, size = 20, rot = 0) => `<text x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="middle" dominant-baseline="central"${rot ? ` transform="rotate(${f1(rot)} ${f1(x)} ${f1(y)})"` : ''}>${ch}</text>`,
    g: (svg, x = 0, y = 0, s = 1, r = 0, extra = '') => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(r)}) scale(${s})" ${extra}>${svg}</g>`,
    eye: (x, y, r = 5) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="#fff" ${sk(1.2)}/><circle cx="${f1(x + r * 0.2)}" cy="${f1(y + r * 0.15)}" r="${f1(r * 0.5)}" fill="${OL}"/>`,
    eyes: (x, y, r = 5, gap = 14) => K.eye(x - gap / 2, y, r) + K.eye(x + gap / 2, y, r),
    smile: (x, y, w = 8, c = OL) => `<path d="M${f1(x - w)},${f1(y)} Q${f1(x)},${f1(y + w * 0.8)} ${f1(x + w)},${f1(y)}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`,
    heart: (cx, cy, s, fill, w = 1.6) => `<path d="M${f1(cx)},${f1(cy + s * 0.9)} C${f1(cx - s * 1.5)},${f1(cy - s * 0.1)} ${f1(cx - s * 0.7)},${f1(cy - s * 1.2)} ${f1(cx)},${f1(cy - s * 0.4)} C${f1(cx + s * 0.7)},${f1(cy - s * 1.2)} ${f1(cx + s * 1.5)},${f1(cy - s * 0.1)} ${f1(cx)},${f1(cy + s * 0.9)}Z" fill="${fill}" ${w ? sk(w) : ''}/>`,
    starPts: (cx, cy, r, n = 5, inner = 0.45, rot = -90) => Array.from({ length: n * 2 }, (_, i) => { const a = (rot + i * 180 / n) * Math.PI / 180, q = i % 2 ? r * inner : r; return [cx + q * Math.cos(a), cy + q * Math.sin(a)]; }),
    star: (cx, cy, r, fill, n = 5) => K.poly(K.starPts(cx, cy, r, n), fill),
    arc: (cx, cy, rx, ry, a0, a1, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; }),
    spiral: (cx, cy, r0, r1, turns = 3, n = 80) => Array.from({ length: n + 1 }, (_, i) => { const k = i / n, a = k * turns * Math.PI * 2, r = lerp(r0, r1, k); return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }),
    wave: (x0, x1, y, amp = 6, waves = 3, n = 40) => Array.from({ length: n + 1 }, (_, i) => [lerp(x0, x1, i / n), y + amp * Math.sin(i / n * waves * Math.PI * 2)]),
    zig: (x0, x1, y, h = 8, n = 6) => Array.from({ length: n * 2 + 1 }, (_, i) => [lerp(x0, x1, i / (n * 2)), i % 2 ? y - h : y]),
    sheet: (x, y, w, h, fill = C.paper) => K.rect(x, y, w, h, fill, 2),
    plate: (cx, cy, r, fill = '#fff') => K.circ(cx, cy, r, fill) + `<circle cx="${cx}" cy="${cy}" r="${f1(r * 0.76)}" fill="none" stroke="rgba(34,48,90,.18)" stroke-width="1.5"/>`,
    tube: (cx, y, w, h, fill = C.card) => `${K.rect(cx - w / 2, y, w, h, fill, 0)}${K.path(`M${f1(cx - w / 2)},${f1(y + h)} Q${f1(cx)},${f1(y + h + w * 0.3)} ${f1(cx + w / 2)},${f1(y + h)}`, fill)}${K.ell(cx, y, w / 2, w * 0.18, '#7A5A3A')}`,
    sock: (x, y, fill = C.blue) => K.path(`M${x},${y} h30 v60 q0,24 -24,24 h-26 q-14,0 -14,-13 q0,-12 14,-13 l20,-2 z`, fill) + K.rect(x, y, 30, 10, '#fff', 2),
    bag: (x, y, w, h, fill = C.tan) => K.rect(x, y, w, h, fill, 2) + K.rect(x, y, w, h * 0.32, '#D9B98A', 2) + K.line([[x + 4, y + h * 0.32 + 3], [x + w - 4, y + h * 0.32 + 3]], 'rgba(34,48,90,.25)', 1.5),
    leaf: (cx, cy, s, fill = C.green, rot = 0) => K.g(`${K.path(`M${-s},0 Q0,${-s * 0.75} ${s},0 Q0,${s * 0.75} ${-s},0Z`, fill)}${K.line([[-s * 1.25, 0], [s * 0.8, 0]], OL, 1.2)}${K.line([[-s * 0.3, 0], [0, -s * 0.3]], OL, 1)}${K.line([[0.1 * s, 0], [0.35 * s, s * 0.28]], OL, 1)}`, cx, cy, 1, rot),
    rock: (cx, cy, rx, ry, fill = C.grey) => K.path(`M${f1(cx - rx)},${f1(cy + ry * 0.2)} C${f1(cx - rx)},${f1(cy - ry * 1.1)} ${f1(cx + rx * 0.9)},${f1(cy - ry * 1.15)} ${f1(cx + rx)},${f1(cy)} C${f1(cx + rx * 1.05)},${f1(cy + ry)} ${f1(cx - rx * 0.9)},${f1(cy + ry * 1.05)} ${f1(cx - rx)},${f1(cy + ry * 0.2)}Z`, fill),
    cone: (cx, cy, s = 1) => K.g(`${K.ell(0, 0, 24, 34, '#8B5A2B')}${[-22, -10, 2, 14, 26].map((y, i) => K.path(`M-${20 - Math.abs(y) * 0.3},${y} Q0,${y + 9} ${20 - Math.abs(y) * 0.3},${y}`, 'none', 1.4) + (i % 2 ? '' : K.line([[0, y - 6], [0, y + 4]], OL, 1))).join('')}`, cx, cy, s),
    bottle: (cx, y, w, h, fill = 'rgba(142,197,245,.55)') => `${K.rect(cx - w / 2, y + h * 0.22, w, h * 0.78, fill, 8)}${K.path(`M${f1(cx - w / 2 + 4)},${f1(y + h * 0.24)} Q${f1(cx - w * 0.2)},${f1(y + h * 0.1)} ${f1(cx - w * 0.16)},${f1(y + 8)} L${f1(cx + w * 0.16)},${f1(y + 8)} Q${f1(cx + w * 0.2)},${f1(y + h * 0.1)} ${f1(cx + w / 2 - 4)},${f1(y + h * 0.24)}`, fill)}${K.rect(cx - w * 0.18, y, w * 0.36, 9, C.red, 2)}`,
    box: (x, y, w, h, fill = C.card) => `${K.poly([[x, y], [x + 14, y - 10], [x + w + 14, y - 10], [x + w, y]], '#E5BC85')}${K.poly([[x + w, y], [x + w + 14, y - 10], [x + w + 14, y + h - 10], [x + w, y + h]], '#B98A55')}${K.rect(x, y, w, h, fill, 1)}`,
    bead: (x, y, r, fill) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${fill}" ${sk(1.2)}/><circle cx="${f1(x - r * 0.35)}" cy="${f1(y - r * 0.35)}" r="${f1(r * 0.28)}" fill="rgba(255,255,255,.7)"/>`,
    wheel: (cx, cy, r) => K.circ(cx, cy, r, OL) + K.circ(cx, cy, r * 0.45, C.grey, 1.2),
    card: (x, y, w, h, fill = C.paper) => K.rect(x, y, w, h, fill, 2) + K.line([[x + w / 2, y], [x + w / 2, y + h]], 'rgba(34,48,90,.35)', 1.2, '3 3'),
    hole: (x, y, r = 3) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="#FFF6E5" ${sk(1.2)}/>`,
    dash: (pts, c = OL) => K.line(pts, c, 1.6, '4 3')
  };

  /* --- tools that move in the movies --- */
  const T = {
    scissors(x, y, ang, open) {
      const blade = r => `<g transform="rotate(${f1(r)} -16 0)"><path d="M-16,0 L6,-2 L9,0 L-16,2.6Z" fill="#DDE5EC" stroke="${OL}" stroke-width="1.2" stroke-linejoin="round"/></g>`;
      const handle = (r, yy) => `<g transform="rotate(${f1(r)} -16 0)"><ellipse cx="-28" cy="${yy}" rx="8.5" ry="5.5" fill="none" stroke="${C.red}" stroke-width="3.6"/><line x1="-20" y1="${yy * 0.45}" x2="-16" y2="0" stroke="${C.red}" stroke-width="3.6" stroke-linecap="round"/></g>`;
      return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})">${handle(open, -7)}${handle(-open, 7)}${blade(-open)}${blade(open)}<circle cx="-16" cy="0" r="1.8" fill="${OL}"/></g>`;
    },
    glue: (x, y) => `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M0,0 L-3.5,-8 L3.5,-8Z" fill="${C.orange}" ${sk(1.2)}/><rect x="-8" y="-33" width="16" height="25" rx="4" fill="#fff" ${sk(1.4)}/><rect x="-8" y="-25" width="16" height="9" fill="${C.blue}"/></g>`,
    crayon: (x, y, c = C.red) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(35)"><path d="M0,0 L-4.5,-10 L4.5,-10Z" fill="${c}" ${sk(1.2)}/><rect x="-4.5" y="-38" width="9" height="28" rx="1.5" fill="${c}" ${sk(1.2)}/><rect x="-4.5" y="-31" width="9" height="13" fill="rgba(255,255,255,.55)"/></g>`,
    pen: (x, y, c = OL) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(35)"><path d="M0,0 L-3,-7 L3,-7Z" fill="${c}"/><rect x="-4" y="-40" width="8" height="33" rx="3" fill="#fff" ${sk(1.2)}/><rect x="-4" y="-40" width="8" height="9" rx="3" fill="${c}"/></g>`,
    brush: (x, y, c = C.blue) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(35)"><path d="M0,0 Q-5,-6 -4,-12 L4,-12 Q5,-6 0,0Z" fill="${c}" ${sk(1.2)}/><rect x="-4.5" y="-19" width="9" height="7" fill="#C9D3DC" ${sk(1.2)}/><rect x="-3" y="-48" width="6" height="29" rx="3" fill="${C.brown}" ${sk(1.2)}/></g>`,
    sponge: (x, y, c = C.yellow) => `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="-12" y="-16" width="24" height="16" rx="4" fill="${C.yellow}" ${sk(1.4)}/><rect x="-12" y="-4" width="24" height="4" fill="${c}"/><circle cx="-5" cy="-11" r="1.5" fill="#E0A82A"/><circle cx="4" cy="-9" r="1.8" fill="#E0A82A"/></g>`,
    hand: (x, y, ch = '👆', s = 22, rot = 0) => K.emo(ch, x, y + (ch === '👆' ? s * 0.5 : 0), s, rot),
    needle: (x, y, ang = -30) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(ang)})"><line x1="0" y1="0" x2="-24" y2="0" stroke="#8A96A3" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="-20" cy="0" rx="2.6" ry="1.2" fill="#FFF6E5" stroke="#8A96A3" stroke-width="1"/></g>`,
    punch: (x, y, down) => `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="-13" y="-6" width="26" height="12" rx="3" fill="#8A96A3" ${sk(1.2)}/><rect x="-13" y="${down ? -13 : -20}" width="26" height="7" rx="3" fill="${C.blue}" ${sk(1.2)}/><rect x="-2" y="${down ? -7 : -14}" width="4" height="${down ? 7 : 8}" fill="${OL}"/></g>`,
    shaker: (x, y) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(160)"><rect x="-8" y="-10" width="16" height="22" rx="4" fill="#fff" ${sk(1.3)}/><rect x="-9" y="-14" width="18" height="6" rx="2" fill="${C.purple}" ${sk(1.2)}/></g>`,
    yarn: (x, y, c = C.red) => `<g transform="translate(${f1(x)} ${f1(y)})"><circle r="9" fill="${c}" ${sk(1.3)}/><path d="M-7,-4 Q0,2 7,-5 M-8,2 Q0,7 8,1 M-3,-8 Q2,0 -1,8" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1.3"/></g>`,
    // round 2 tools: a marble rolling through paint, a straw for blow painting, a pouring jug, a spoon, a dropper and a potato stamp
    marble: (x, y, c = C.blue) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="6" fill="${c}" ${sk(1.3)}/><circle cx="${f1(x - 2)}" cy="${f1(y - 2)}" r="2" fill="rgba(255,255,255,.75)"/>`,
    straw: (x, y) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(-35)"><rect x="-3" y="-52" width="6" height="46" rx="2" fill="#fff" ${sk(1.2)}/>${[0, 1, 2, 3, 4].map(i => `<rect x="-3" y="${-50 + i * 9}" width="6" height="4" fill="${C.red}"/>`).join('')}<path d="M-6,-2 Q0,-8 6,-2" fill="none" stroke="${C.sky}" stroke-width="1.6" stroke-linecap="round"/></g>`,
    cup: (x, y, rot = 0, c = C.sky) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><path d="M-14,-26 L14,-26 L11,0 L-11,0Z" fill="${c}" ${sk(1.4)}/><path d="M14,-20 Q24,-16 13,-6" fill="none" ${sk(2.2)}/><path d="M-14,-26 L-19,-29" ${sk(2)}/></g>`,
    spoon: (x, y, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><ellipse cx="0" cy="0" rx="6" ry="8" fill="#C9D3DC" ${sk(1.2)}/><rect x="-2" y="-46" width="4" height="39" rx="2" fill="#C9D3DC" ${sk(1.2)}/></g>`,
    dropper: (x, y, c = C.blue) => `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M-3,-6 L0,0 L3,-6Z" fill="${c}"/><rect x="-3.5" y="-30" width="7" height="24" rx="2" fill="rgba(255,255,255,.85)" ${sk(1.2)}/><rect x="-3.5" y="-18" width="7" height="12" fill="${c}" opacity=".7"/><rect x="-5" y="-42" width="10" height="13" rx="5" fill="${C.red}" ${sk(1.2)}/></g>`,
    stamp: (x, y, c = C.red) => `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M-16,-2 Q-18,-26 0,-28 Q18,-26 16,-2Z" fill="#E8C98E" ${sk(1.3)}/><rect x="-16" y="-4" width="32" height="4" rx="2" fill="${c}"/><circle cx="-6" cy="-16" r="1.5" fill="#B8925A"/><circle cx="7" cy="-20" r="1.3" fill="#B8925A"/></g>`
  };
  // mix two #rrggbb colors (k = 0 gives a, 1 gives b), for paint that blends while it is stirred
  const mixC = (a, b, k) => { const h = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); const A = h(a), B = h(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], cl(k))).toString(16).padStart(2, '0')).join(''); };

  /* --- polylines: lengths, points along them, partial strokes --- */
  const plen = pts => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
  function along(pts, d) {
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (d <= l || i === pts.length - 1) { const k = l ? cl(d / l) : 0; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI]; }
      d -= l;
    }
    return [pts[0][0], pts[0][1], 0];
  }
  function upto(pts, d) {
    const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (d >= l) { out.push(b); d -= l; } else { if (l) out.push([a[0] + (b[0] - a[0]) * d / l, a[1] + (b[1] - a[1]) * d / l]); break; }
    }
    return out;
  }

  /* --- paper folding: a tiny flat-folding simulator for the origami movies --- */
  // A model is a stack of flat layers ({p: points, f: 0 front / 1 back}). A fold reflects every layer part on the
  // "from" side of a line onto the other side (the line is the one that takes the point `from` to the point `to`).
  // Folded flaps land on top, in reverse order, like real paper. `top: true` folds only the top layer under `from`.
  const area = pts => { let a = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; };
  function clip(pts, f) {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length], fa = f(a), fb = f(b);
      if (fa >= 0) out.push(a);
      if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out;
  }
  function inPoly(pt, pts) {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }
  function nearEdge(pt, pts) {
    let m = 1e9;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length], dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy || 1, t = cl(((pt[0] - a[0]) * dx + (pt[1] - a[1]) * dy) / L2);
      m = Math.min(m, Math.hypot(a[0] + dx * t - pt[0], a[1] + dy * t - pt[1]));
    }
    return m;
  }
  function foldGeo(op) {
    let from = op.from, to = op.to;
    if (op.line) { // a fold along a given line, moving the side the point `at` is on
      const [a, b] = op.line, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, s = (op.at[0] - a[0]) * nx + (op.at[1] - a[1]) * ny;
      from = op.at; to = [op.at[0] - 2 * s * nx, op.at[1] - 2 * s * ny];
    }
    const mx = (from[0] + to[0]) / 2, my = (from[1] + to[1]) / 2, L = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1, nx = (to[0] - from[0]) / L, ny = (to[1] - from[1]) / L;
    return { from, to, nx, ny, side: p => (p[0] - mx) * nx + (p[1] - my) * ny };
  }
  // Split the stack for one or more folds made together; each later fold only touches what the earlier ones left.
  function foldParts(L, ops) {
    let keep = L.map(l => ({ ...l, i: 0 })); const flaps = [];
    ops.forEach(op => {
      const g = foldGeo(op), probe = [g.from[0] + g.nx * 1.5, g.from[1] + g.ny * 1.5];
      let only = -1;
      if (op.top) { for (let i = keep.length - 1; i >= 0; i--) if (inPoly(probe, keep[i].p) || nearEdge(g.from, keep[i].p) < 1.5) { only = i; break; } }
      const nk = [], fl = [];
      keep.forEach((l, i) => {
        if (op.top && i !== only) { nk.push(l); return; }
        const k = clip(l.p, p => g.side(p)), f = clip(l.p, p => -g.side(p));
        if (Math.abs(area(k)) > 0.5) nk.push({ p: k, f: l.f });
        if (Math.abs(area(f)) > 0.5) fl.push({ p: f, f: l.f, g });
      });
      keep = nk; flaps.push(...fl.reverse());
    });
    return { keep, flaps };
  }
  const moveFlap = (fl, e) => { const c = Math.cos(Math.PI * e), g = fl.g; return { p: fl.p.map(p => { const s = g.side(p); return [p[0] - g.nx * s * (1 - c), p[1] - g.ny * s * (1 - c)]; }), f: c < 0 ? 1 - fl.f : fl.f }; };
  // Resample a polygon to n points spaced evenly round its edge, clockwise, starting at its top-left, for morphing.
  function resample(pts, n = 40) {
    let q = area(pts) < 0 ? pts.slice().reverse() : pts.slice();
    const s = q.reduce((b, p, i) => p[0] + p[1] < q[b][0] + q[b][1] ? i : b, 0); q = q.slice(s).concat(q.slice(0, s)); q.push(q[0]);
    const L = plen(q); return Array.from({ length: n }, (_, i) => along(q, L * i / n).slice(0, 2));
  }
  function applyOri(L, op) {
    if (op.k === 'fold') { const { keep, flaps } = foldParts(L, op.ops); const moved = flaps.map(f => moveFlap(f, 1)); return op.under ? moved.reverse().concat(keep) : keep.concat(moved); }
    if (op.k === 'flip') return L.slice().reverse().map(l => ({ p: l.p.map(([x, y]) => [200 - x, y]).reverse(), f: 1 - l.f }));
    if (op.k === 'turn') { const a = op.deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return L.map(l => ({ f: l.f, p: l.p.map(([x, y]) => [100 + (x - 100) * c - (y - 75) * s, 75 + (x - 100) * s + (y - 75) * c]) })); }
    if (op.k === 'morph') return op.to;
    return L;
  }
  const layerSVG = (l, cols) => K.poly(l.p, cols[l.f], 1.4);
  function oriFrame(s, e) {
    const L = s.L, op = s.op, cols = s.c; let out = '';
    if (op.k === 'fold') {
      const { keep, flaps } = foldParts(L, op.ops), moved = flaps.map(f => moveFlap(f, e));
      const fs = moved.map(l => layerSVG(l, cols)).join(''), ks = keep.map(l => layerSVG(l, cols)).join('');
      out = op.under && e > 0.5 ? fs + ks : ks + fs;
      // the fold line shows first, then a finger pushes the moving corner across
      if (e < 0.6) op.ops.forEach(o => { const g = foldGeo(o), dx = -g.ny * 140, dy = g.nx * 140, mx = (g.from[0] + g.to[0]) / 2, my = (g.from[1] + g.to[1]) / 2;
        out += `<g opacity="${f1(1 - seg(e, 0.35, 0.6))}">${K.line([[mx - dx, my - dy], [mx + dx, my + dy]], C.purple, 1.6, '5 4')}</g>`; });
      const g = foldGeo(op.ops[0]), c = Math.cos(Math.PI * e), sd = g.side(g.from), tip = [g.from[0] - g.nx * sd * (1 - c), g.from[1] - g.ny * sd * (1 - c)];
      out += T.hand(tip[0], tip[1] - 2, '👆', 20);
    } else if (op.k === 'flip') {
      const c = Math.cos(Math.PI * e), order = c < 0 ? L.slice().reverse() : L;
      out = order.map(l => K.poly(l.p.map(([x, y]) => [100 + (x - 100) * c, y]), cols[c < 0 ? 1 - l.f : l.f], 1.4)).join('');
      out += K.g(`<path d="M-26,0 A26,10 0 1 0 26,0" fill="none" stroke="${C.purple}" stroke-width="2.5" stroke-dasharray="5 4"/><path d="M26,0 l-6,-6 m6,6 l4,-7" stroke="${C.purple}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`, 100, 142, 1);
    } else if (op.k === 'turn') {
      out = `<g transform="rotate(${f1(op.deg * e)} 100 75)">${L.map(l => layerSVG(l, cols)).join('')}</g>`;
    } else if (op.k === 'morph') {
      out = morphSVG(L.map(l => ({ p: l.p, c: cols[l.f] })), op.to.map(l => ({ p: l.p, c: cols[l.f] })), e);
    }
    return out;
  }
  function morphSVG(A, B, e) {
    const n = Math.max(A.length, B.length); let out = '';
    for (let i = 0; i < n; i++) {
      const a = A[i], b = B[i];
      if (a && b) { const ra = resample(a.p), rb = resample(b.p); out += K.poly(ra.map((p, k) => [lerp(p[0], rb[k][0], e), lerp(p[1], rb[k][1], e)]), e < 0.5 ? a.c : b.c, 1.4); }
      else if (a) out += `<g opacity="${f1(1 - e)}">${K.poly(a.p, a.c, 1.4)}</g>`;
      else out += `<g opacity="${f1(e)}">${K.poly(b.p, b.c, 1.4)}</g>`;
    }
    return out;
  }
  // The builder the data files use: each call returns one movie step and moves the paper model on.
  K.ori = (c0, c1, pts) => {
    let L = [{ p: pts, f: 0 }]; const cols = [c0, c1];
    const step = (t, op, o = {}) => { const s = { t, a: 'ori', L, op, c: cols, ...o }; L = applyOri(L, op); return s; };
    const B = {
      fold: (t, ...ops) => step(t, { k: 'fold', ops: ops.filter(o => !o.opt) }, Object.assign({}, ...ops.filter(o => o.opt).map(o => o.opt))),
      under: (t, ...ops) => step(t, { k: 'fold', ops, under: true }),
      flip: t => step(t, { k: 'flip' }),
      turn: (t, deg) => step(t, { k: 'turn', deg }),
      morph: (t, to) => step(t, { k: 'morph', to: (typeof to === 'function' ? to(L) : to).map(l => Array.isArray(l) ? { p: l, f: 0 } : l) }),
      shift: (dx, dy) => { L = L.map(l => ({ f: l.f, p: l.p.map(([x, y]) => [x + dx, y + dy]) })); return B; },
      svg: () => L.map(l => layerSVG(l, cols)).join(''),
      get L() { return L; }
    };
    return B;
  };

  /* --- the movie frames: one drawing function per kind of action --- */
  let clipN = 0;
  const R = {
    ori: (s, e) => oriFrame(s, e),
    morph: (s, e) => morphSVG(s.from, s.to, e),
    draw(s, e) {
      const strokes = (s.s || []).map(x => Array.isArray(x) ? { p: x } : x), total = strokes.reduce((a, x) => a + plen(x.p), 0);
      let left = total * seg(e, 0, 0.92), out = '', tip = null, tc = s.c || OL;
      strokes.forEach(x => {
        const L = plen(x.p), col = x.c || s.c || OL, w = x.w || s.w || 2.6;
        if (s.guide !== false && left < L) out += K.line(x.p, 'rgba(34,48,90,.18)', 1.3, '3 3');
        if (left <= 0) return;
        const part = upto(x.p, Math.min(left, L));
        if (s.tool === 'glue') out += K.line(part, '#B9D8F5', w + 2.5) + K.line(part, '#fff', w);
        else out += K.line(part, col, w, x.dash || s.dash || '');
        if (left < L) { const q = along(x.p, left); tip = q; tc = col; } else if (!tip) { const q = along(x.p, L); tip = q; tc = col; }
        left -= L;
      });
      if (s.fill && e > 0.85) out = `<g opacity="${f1(seg(e, 0.85, 1))}">${s.fill}</g>` + out;
      const tool = s.tool || 'crayon';
      if (tip && e < 0.97) out += tool === 'finger' ? T.hand(tip[0], tip[1], '👆') : tool === 'glue' ? T.glue(tip[0], tip[1]) : (T[tool] || T.crayon)(tip[0], tip[1], tc);
      return out;
    },
    cut(s, e) {
      // one cutting line (pts) or several in turn (cuts); the scissors snip along the dashed line
      const lines = s.cuts || [s.pts], lens = lines.map(plen), total = lens.reduce((a, b) => a + b, 0), mv = ez(seg(e, 0.8, 1));
      let d = total * seg(e, 0, 0.78), out = s.piece ? K.g(s.piece, (s.off || [0, 0])[0] * mv, (s.off || [0, 0])[1] * mv) : '', q = null;
      lines.forEach((pts, i) => {
        out += K.line(pts, 'rgba(34,48,90,.55)', 1.6, '4 3');
        if (d > 0) { const part = Math.min(d, lens[i]); out += K.line(upto(pts, part), OL, 1.8); if (d <= lens[i] || i === lines.length - 1) q = q || along(pts, part); }
        d -= lens[i];
      });
      const k = seg(e, 0, 0.78); q = q || along(lines[0], 0);
      const open = k > 0 && k < 1 ? 6 + 10 * Math.abs(Math.sin(e * 60)) : 4;
      if (e < 0.9) out += T.scissors(q[0], q[1], q[2], open);
      return out;
    },
    glue(s, e) {
      const n = s.dots.length, k = seg(e, 0, 0.9) * n, i = Math.min(n - 1, Math.floor(k)), f = k - i;
      let out = s.dots.map((d, j) => j < Math.floor(k) || (j === i && f > 0.55) ? K.circ(d[0], d[1], s.r || 3.6, '#fff', 0, `stroke="#9CC8F0" stroke-width="1.5"`) : '').join('');
      const a = s.dots[Math.max(0, i - (f < 0.4 ? 1 : 0))], b = s.dots[i], m = f < 0.4 ? ez(f / 0.4) : 1;
      const x = lerp(a[0], b[0], m), y = lerp(a[1], b[1], m) - (f < 0.4 ? 8 * Math.sin(Math.PI * m) : f < 0.6 ? 0 : 3);
      if (e < 0.95) out += T.glue(x, y);
      return out;
    },
    place(s, e) {
      const ps = s.pieces, n = ps.length; let out = '';
      ps.forEach((p, i) => {
        const k = seg(e, i / n * 0.85, (i + 1) / n * 0.85), m = ez(k), fr = p.from || [0, -60];
        // pieces wait at their start spot, a little see-through, then slide into place
        const press = k >= 1 ? 1 - 0.04 * Math.sin(Math.PI * seg(e, (i + 1) / n * 0.85, (i + 1) / n * 0.85 + 0.08)) : 1;
        const at = p.at || [100, 75];
        out += `<g${k <= 0 ? ' opacity=".55"' : ''} transform="translate(${f1(fr[0] * (1 - m))} ${f1(fr[1] * (1 - m))}) rotate(${f1((p.r || 0) * (1 - m))} ${at[0]} ${at[1]})"><g transform="translate(${at[0]} ${at[1]}) scale(${f1(press * 100) / 100}) translate(${-at[0]} ${-at[1]})">${p.svg}</g></g>`;
        if (k > 0 && k < 1) out += T.hand(at[0] + fr[0] * (1 - m) + 6, at[1] + fr[1] * (1 - m) - 4, '👆', 18);
      });
      return out;
    },
    paint(s, e) {
      const [x, y, w, h] = s.box, k = seg(e, 0, 0.9), id = 'crp' + (++clipN), edge = x + w * k;
      let out = `<clipPath id="${id}"><rect x="${f1(x - 2)}" y="${f1(y - 4)}" width="${f1(w * k + 2)}" height="${f1(h + 8)}"/></clipPath><g clip-path="url(#${id})">${s.area}</g>`;
      const by = y + h * (0.5 + 0.45 * Math.sin(e * 46)), tool = s.tool || 'brush';
      if (e < 0.93) out += tool === 'sponge' ? T.sponge(edge, by, s.c) : tool === 'crayon' ? T.crayon(edge, by, s.c) : tool === 'finger' ? T.hand(edge, by, '👆') : T.brush(edge, by, s.c);
      return out;
    },
    clay(s, e) {
      const [cx, cy] = s.at || [100, 85], r = s.r || 20, c = s.c || C.orange, t = e * 8 * Math.PI; let out = '';
      if (s.mode === 'ball') {
        const pts = Array.from({ length: 40 }, (_, i) => { const a = i / 40 * Math.PI * 2, q = r * (1 + 0.28 * (1 - e) * Math.sin(5 * a + 1) * Math.cos(3 * a)); return [cx + q * Math.cos(a), cy + q * Math.sin(a)]; });
        out = K.poly(pts, c) + T.hand(cx + 22 * Math.cos(t), cy - r - 10 + 6 * Math.sin(t), '✋', 22);
      } else if (s.mode === 'snake') {
        const rx = lerp(r, r * 3.4, e), ry = lerp(r, r * 0.42, e);
        out = K.ell(cx, cy, rx, ry, c) + T.hand(cx - rx * 0.45 + 6 * Math.sin(t), cy - ry - 8, '✋', 20) + T.hand(cx + rx * 0.45 - 6 * Math.sin(t), cy - ry - 8, '✋', 20);
      } else if (s.mode === 'flat') {
        const rx = lerp(r, r * 1.9, e), ry = lerp(r, r * 0.42, e);
        out = K.ell(cx, cy, rx, ry, c) + T.hand(cx, cy - ry - 12 - 8 * Math.abs(Math.sin(t / 2)), '✋', 24);
      } else if (s.mode === 'coil') {
        const sp = K.spiral(cx, cy, 2, r * 1.15, 2.4, 70), Ls = plen(sp), k = ez(e), coil = upto(sp, Ls * k), end = coil[coil.length - 1];
        const tail = [end, [end[0] + (Ls * (1 - k)) * 0.55, end[1]]];
        const pts = coil.concat(tail.slice(1)), w = r * 0.5;
        out = K.line(pts, OL, w + 3) + K.line(pts, c, w) + T.hand(end[0] + 8, end[1] - 14, '👆', 18);
      } else if (s.mode === 'pinch') {
        const d = ez(e), top = lerp(r, r * 0.35, d);
        out = K.path(`M${cx - r},${cy} A${r},${r} 0 0 0 ${cx + r},${cy} A${r},${top} 0 0 0 ${cx - r},${cy}Z`, c) +
          (d > 0.05 ? K.ell(cx, cy, r * 0.78 * d, top * 0.7 * d, 'rgba(0,0,0,.22)', 0) : '') + T.hand(cx + 2 * Math.sin(t), cy - top - 6 + 8 * d, '👍', 22);
      } else if (s.mode === 'squeeze') { // pull a nose or point out of a ball
        const nose = lerp(0, r * 0.9, ez(e));
        out = K.poly([[cx + r * 0.8, cy - r * 0.45], [cx + r + nose, cy], [cx + r * 0.8, cy + r * 0.45]], c) + K.circ(cx, cy, r, c) + T.hand(cx + r + nose + 4, cy - 10, '🤏', 20);
      }
      return out;
    },
    thread(s, e) {
      const pts = s.pts, L = plen(pts), r = s.r || 6, n = s.beads.length, pre = s.pre || 0; let out = K.line(pts, s.sc || OL, 1.8);
      s.beads.forEach((b, i) => {
        const slot = (i + 0.6) * r * 2.1, k = i < pre ? 1 : ez(seg(e, (i - pre) / (n - pre) * 0.85, (i - pre + 1) / (n - pre) * 0.85));
        if (k <= 0 && i > pre) return;
        const q = along(pts, lerp(L + r * 3, slot, k));
        out += s.tube ? `<g transform="rotate(${f1(q[2])} ${f1(q[0])} ${f1(q[1])})">${K.rect(q[0] - r, q[1] - r * 0.7, r * 2, r * 1.4, b, 2)}</g>` : K.bead(q[0], q[1], r, b);
      });
      const end = along(pts, L);
      out += `<g transform="translate(${f1(end[0])} ${f1(end[1])}) rotate(${f1(end[2])})"><rect x="-2" y="-3" width="10" height="6" rx="1.5" fill="${C.sky}" ${sk(1)}/></g>`;
      return out;
    },
    tear(s, e) {
      const [x, y, w, h] = s.box, n = s.n || 4, k = ez(seg(e, 0.1, 0.9)), cuts = Array.from({ length: n + 1 }, (_, i) => x + w * i / n);
      const edge = (cx, j) => Array.from({ length: 9 }, (_, i) => [cx + (i % 2 ? 3 : -3) * (j ? 1 : 0) + (rr(j * 9 + i) - 0.5) * 4 * (j ? 1 : 0), y + h * i / 8]);
      let out = '';
      for (let i = 0; i < n; i++) {
        const left = i === 0 ? [[x, y + h], [x, y]] : edge(cuts[i], i).reverse(), right = i === n - 1 ? [[x + w, y], [x + w, y + h]] : edge(cuts[i + 1], i + 1);
        const pts = (i === 0 ? left : left).concat(right), mid = i - (n - 1) / 2;
        out += `<g transform="translate(${f1(mid * 10 * k)} ${f1((i % 2 ? 14 : -4) * k)}) rotate(${f1(mid * 7 * k)} ${f1(x + w * (i + 0.5) / n)} ${f1(y + h / 2)})">${K.poly(pts, s.c || C.red, 1.3)}</g>`;
      }
      if (e < 0.92) { const ci = Math.min(n - 1, 1 + Math.floor(k * (n - 1))); out += T.hand(cuts[ci] - 10 - 8 * k, y - 4, '🤏', 20) + T.hand(cuts[ci] + 10 + 8 * k, y - 4, '🤏', 20); }
      return out;
    },
    stamp(s, e) {
      const [x, y] = s.at, down = seg(e, 0, 0.4), up = seg(e, 0.58, 1), sq = e > 0.4 && e < 0.58 ? 0.92 : 1;
      const dy = e < 0.4 ? -70 * (1 - ez(down)) : e > 0.58 ? -70 * ez(up) : 0;
      let out = e > 0.5 ? `<g opacity="${f1(seg(e, 0.5, 0.62))}">${s.print}</g>` : '';
      out += `<g transform="translate(${x} ${f1(y + dy)}) scale(1 ${sq})">${s.item}</g>`;
      if (e > 0.3 && e < 0.65) out += T.hand(x, y + dy - 22, '✋', 22);
      return out;
    },
    wrap(s, e) {
      const [x, y, w, h] = s.box, n = s.n || 9, k = seg(e, 0, 0.92) * n; let out = '';
      for (let i = 0; i < n; i++) {
        if (i > k) break;
        const f = Math.min(1, k - i), y0 = y + h * (i + 0.2) / n, y1 = y + h * (i + 0.9) / n;
        out += K.line([[x - 2, y0], [lerp(x - 2, x + w + 2, f), lerp(y0, y1, f)]], s.c || C.red, 3);
      }
      const bx = x + w + 16 + 6 * Math.sin(e * 40), by = y + h * Math.min(1, k / n);
      if (e < 0.95) out += T.yarn(bx, by, s.c);
      return out;
    },
    weave(s, e) {
      const [x, y, w, h] = s.mat, nb = s.bands || 7, sh = s.sh || 12, bw = (w - 16) / nb, row = s.row || 0, rows = s.rows || 5;
      let out = K.rect(x, y, w, h, s.c || C.blue, 2);
      for (let b = 1; b < nb; b++) out += K.line([[x + 8 + b * bw, y + 8], [x + 8 + b * bw, y + h - 8]], 'rgba(34,48,90,.5)', 1.2);
      const edge = lerp(x - 30, x + w + 4, ez(seg(e, 0, 0.9)));
      for (let r = 0; r <= row; r++) {
        const ry = y + 10 + (h - 20) * (r + 0.5) / rows - sh / 2, col = (s.sc || [C.yellow, C.red, C.green, C.pink, C.orange])[r % 5], cur = r === row;
        const x1 = cur ? edge : x + w + 4, x0 = x1 - (w + 34);
        if (x0 < x + 8) out += K.rect(x0, ry, Math.min(x + 8, x1) - x0, sh, col, 1);
        for (let b = 0; b < nb; b++) {
          const bx0 = x + 8 + b * bw, bx1 = bx0 + bw, a = Math.max(bx0, x0), z = Math.min(bx1, x1);
          if (z > a && (b + r) % 2 === 0) out += K.rect(a, ry, z - a, sh, col, 1);
        }
        if (x1 > x + w - 8) out += K.rect(x + w - 8, ry, x1 - (x + w - 8), sh, col, 1);
      }
      if (e < 0.93) out += T.hand(edge + 4, y + 10 + (h - 20) * (row + 0.5) / rows - 8, '👆', 18);
      return out;
    },
    punch(s, e) {
      const n = s.holes.length, k = seg(e, 0, 0.9) * n, i = Math.min(n - 1, Math.floor(k)), f = k - i;
      let out = s.holes.map((h, j) => j < i || (j === i && f > 0.6) ? K.hole(h[0], h[1], s.r || 3.4) : '').join('');
      const a = s.holes[Math.max(0, i - 1)], b = s.holes[i], m = ez(cl(f / 0.4));
      if (e < 0.95) out += T.punch(lerp(a[0], b[0], m), lerp(a[1], b[1], m), f > 0.45 && f < 0.7);
      return out;
    },
    sprinkle(s, e) {
      const [x, y, w, h] = s.box, n = s.n || 36, cols = s.colors || [C.yellow, C.pink, C.blue], k = seg(e, 0, 0.9); let out = '', sx = x;
      for (let i = 0; i < n; i++) {
        const t0 = i / n, px = x + rr(i) * w, py = y + rr(i + 99) * h, f = (k - t0) * 8;
        if (f <= 0) continue;
        if (f < 1) { sx = px; out += K.circ(px, lerp(y - 40, py, f), 1.8, cols[i % cols.length], 0); }
        else out += K.circ(px, py, 2, cols[i % cols.length], 0);
      }
      if (e < 0.95) out += T.shaker(sx, y - 50);
      return out;
    },
    tie(s, e) {
      const [x, y] = s.at, k = ez(seg(e, 0.1, 0.9)), c = s.c || C.red;
      return `<g transform="translate(${x} ${y})">${K.line([[-3, 2], [-10, 18 * k + 4]], c, 3)}${K.line([[3, 2], [10, 18 * k + 4]], c, 3)}${K.ell(-12 * k - 2, -2, 11 * k + 1, 6 * k + 1, 'none', 0, `stroke="${c}" stroke-width="3" transform="rotate(-10)"`)}${K.ell(12 * k + 2, -2, 11 * k + 1, 6 * k + 1, 'none', 0, `stroke="${c}" stroke-width="3" transform="rotate(10)"`)}${K.circ(0, 0, 3.5, c, 1.2)}</g>` + (e < 0.92 ? T.hand(x - 18 - 6 * k, y + 10, '🤏', 18) + T.hand(x + 18 + 6 * k, y + 10, '🤏', 18) : '');
    },
    stitch(s, e) {
      const L = plen(s.pts), d = L * seg(e, 0, 0.92), q = along(s.pts, d), up = Math.floor(d / 8) % 2 === 0;
      return K.line(s.pts, 'rgba(34,48,90,.25)', 1.2, '2 3') + K.line(upto(s.pts, d), s.c || C.red, 2.6, '7 5') + (e < 0.95 ? `<g opacity="${up ? 1 : 0.45}">${T.needle(q[0], q[1], q[2] + 180 - (up ? 20 : -20))}</g>` : '');
    },
    braid(s, e) {
      const [x, y] = s.at, cols = s.colors || [C.red, C.yellow, C.blue], n = s.n || 9, k = ez(seg(e, 0, 0.92)) * n; let out = K.rect(x - 14, y - 10, 28, 8, C.grey, 2);
      for (let i = 0; i < n; i++) {
        if (i > k) break;
        const yy = y + 4 + i * 9, f = Math.min(1, k - i);
        out += s.mode === 'knot'
          ? `<g opacity="${f1(f)}">${K.poly([[x - 12, yy], [x, yy + 6], [x + 12, yy], [x + 12, yy + 7], [x, yy + 13], [x - 12, yy + 7]], cols[i % cols.length], 1.1)}</g>`
          : `<g opacity="${f1(f)}"><ellipse cx="${f1(x + (i % 2 ? 4 : -4))}" cy="${f1(yy + 5)}" rx="9" ry="5.5" transform="rotate(${i % 2 ? -30 : 30} ${f1(x + (i % 2 ? 4 : -4))} ${f1(yy + 5)})" fill="${cols[i % cols.length]}" ${sk(1.1)}/></g>`;
      }
      const ty = y + 4 + Math.min(n, Math.ceil(k)) * 9 + 6;
      cols.forEach((c, i) => { out += K.line([[x + (i - 1) * 5, ty], [x + (i - 1) * 12, Math.max(ty + 8, y + n * 9 + 30)]], c, 3); });
      if (e < 0.93) out += T.hand(x - 26, ty, '🤏', 18) + T.hand(x + 26, ty, '🤏', 18);
      return out;
    },
    pins(s, e) {
      const pts = s.order.map(i => s.pins[i]), L = plen(pts), d = L * seg(e, 0, 0.92), q = along(pts, d);
      return s.pins.map(p => K.circ(p[0], p[1], 2.4, C.grey, 1)).join('') + K.line(upto(pts, d), s.c || C.red, 1.6) + (e < 0.95 ? T.yarn(q[0] + 10, q[1] - 10, s.c) : '');
    },
    /* round 2 movie kinds: dab, pour, stir, stack, knot, measure, launch, oven */
    dab(s, e) {
      // a sponge, finger, brush, stamp or dropper hops from spot to spot and leaves a print at each one;
      // with spread: true the prints grow after landing, like watercolor soaking into paper
      const pts = s.pts, n = pts.length, k = seg(e, 0, 0.9) * n, i = Math.min(n - 1, Math.floor(k)), f = k - i, r = s.r || 9;
      const cols = s.colors || [s.c || C.red];
      const mark = (p, j, g) => {
        const c = p[2] || cols[j % cols.length], x = p[0], y = p[1], q = r * g, sh = s.shape || 'blob';
        if (sh === 'sq') return `<rect x="${f1(x - q)}" y="${f1(y - q * 0.75)}" width="${f1(q * 2)}" height="${f1(q * 1.5)}" rx="${f1(q * 0.3)}" fill="${c}" opacity=".9"/>` + [0, 1, 2, 3].map(m => `<circle cx="${f1(x + (rr(j * 7 + m) - 0.5) * q * 1.4)}" cy="${f1(y + (rr(j * 7 + m + 3) - 0.5) * q)}" r="${f1(q * 0.12 + 0.4)}" fill="#fff" opacity=".6"/>`).join('');
        if (sh === 'star') return K.poly(K.starPts(x, y, q, 5), c, 0);
        if (sh === 'heart') return K.heart(x, y, q * 0.75, c, 0);
        if (sh === 'bubble') return [[0, 0], ...Array.from({ length: 6 }, (_, m) => [Math.cos(m * Math.PI / 3), Math.sin(m * Math.PI / 3)])].map(([a, b]) => `<circle cx="${f1(x + a * q * 0.62)}" cy="${f1(y + b * q * 0.62)}" r="${f1(q * 0.27)}" fill="${c}"/><circle cx="${f1(x + a * q * 0.62 - q * 0.08)}" cy="${f1(y + b * q * 0.62 - q * 0.08)}" r="${f1(q * 0.08)}" fill="#fff" opacity=".6"/>`).join('');
        if (sh === 'print') return K.ell(x, y, q * 0.7, q, c, 0) + `<path d="M${f1(x - q * 0.4)},${f1(y)} Q${f1(x)},${f1(y - q * 0.7)} ${f1(x + q * 0.4)},${f1(y)} M${f1(x - q * 0.25)},${f1(y + q * 0.35)} Q${f1(x)},${f1(y - q * 0.2)} ${f1(x + q * 0.25)},${f1(y + q * 0.35)}" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1"/>`;
        if (sh === 'dot') return K.circ(x, y, q, c, 0);
        return K.poly(Array.from({ length: 14 }, (_, m) => { const a = m / 14 * Math.PI * 2, w = q * (0.82 + 0.3 * rr(j * 13 + m)); return [x + w * Math.cos(a), y + w * Math.sin(a)]; }), c, 0, s.spread ? 'opacity=".8"' : '');
      };
      let out = '';
      pts.forEach((p, j) => { if (j < i || (j === i && f > 0.5)) out += mark(p, j, s.spread ? lerp(0.3, 1, ez(cl((k - j - 0.5) / 1.6))) : 1); });
      const a = pts[Math.max(0, i - (f < 0.4 ? 1 : 0))], b = pts[i], m = f < 0.4 ? ez(f / 0.4) : 1;
      const lift = f < 0.4 ? 14 * Math.sin(Math.PI * m) + 4 : f < 0.62 ? 0 : 6 * seg(f, 0.62, 1);
      const x = lerp(a[0], b[0], m), y = lerp(a[1], b[1], m) - lift, tool = s.tool || 'sponge', tc = b[2] || cols[i % cols.length];
      if (e < 0.95) out += tool === 'finger' ? T.hand(x, y - 4, '👆', 20) : tool === 'brush' ? T.brush(x, y, tc) : tool === 'stamp' ? T.stamp(x, y, tc) : tool === 'dropper' ? T.dropper(x, y, tc) : tool === 'straw' ? T.straw(x, y) : tool === 'cork' ? `<g transform="translate(${f1(x)} ${f1(y)})">${K.rect(-6, -22, 12, 22, '#C9A06A', 3)}</g>` : T.sponge(x, y, tc);
      return out;
    },
    pour(s, e) {
      // a jug tips over the container and pours; the level rises (grains: beans, rice or sand fall as dots)
      const [x, y, w, h] = s.box, lv0 = s.lv0 || 0, lv1 = s.lv1 || 0.6, c = s.c || C.sky, tilt = e < 0.2 ? ez(e / 0.2) : e > 0.85 ? 1 - ez(seg(e, 0.85, 1)) : 1;
      const flow = seg(e, 0.2, 0.85), lv = lerp(lv0, lv1, flow), top = y + h - h * lv, cx = s.cup ? s.cup[0] : x + w * 0.75, cy = s.cup ? s.cup[1] : y - 26;
      let out = '';
      const cid = s.clip ? 'crq' + (++clipN) : '';
      if (s.grain) {
        const n = Math.round(w * h * lv / 22);
        for (let i = 0; i < n; i++) out += K.circ(x + 3 + rr(i) * (w - 6), y + h - 3 - rr(i + 50) * (h * lv - 4), s.gr || 2.2, (s.colors || [c])[i % (s.colors || [c]).length], 0.6);
      } else {
        out += `<path d="M${f1(x)},${f1(top)} ${K.wave(x, x + w, top, lv > 0.02 ? 1.6 : 0, 3, 12).map(p => 'L' + f1(p[0]) + ',' + f1(p[1] + 1.6 * Math.sin(e * 30 + p[0] / 6))).join(' ')} L${f1(x + w)},${f1(y + h)} L${f1(x)},${f1(y + h)}Z" fill="${c}" opacity=".85"/>`;
      }
      if (cid) out = `<clipPath id="${cid}"><path d="${s.clip}"/></clipPath><g clip-path="url(#${cid})">${out}</g>`;
      const ra = -100 * tilt * Math.PI / 180, lip = [cx - 14 * Math.cos(ra) + 26 * Math.sin(ra), cy - 14 * Math.sin(ra) - 26 * Math.cos(ra)];
      if (flow > 0 && flow < 1 && tilt > 0.9) {
        if (s.grain) for (let i = 0; i < 7; i++) { const u = ((e * 9 + i / 7) % 1); out += K.circ(lip[0] + (rr(i) - 0.5) * 4, lerp(lip[1], top, u), s.gr || 2.2, (s.colors || [c])[i % (s.colors || [c]).length], 0.6); }
        else out += K.line([lip, [lip[0] - 2, (lip[1] + top) / 2], [lip[0] - 1, top]], c, 4);
      }
      if (e < 0.95) out += T.cup(cx, cy, -100 * tilt, s.cupC || C.sky);
      return out;
    },
    stir(s, e) {
      // a spoon goes round a bowl; the colors swirl together into one
      const [cx, cy] = s.at || [100, 88], r = s.r || 42, k = seg(e, 0, 0.9), c = mixC(s.c0 || '#FFFFFF', s.c1 || C.pink, k), a = e * Math.PI * 7;
      let out = K.ell(cx, cy - 4, r * 0.86, r * 0.3, c, 1.2);
      (s.bits || []).forEach((b, i) => { const ang = a * (0.6 + i * 0.1) + i * 2, d = r * 0.55 * (1 - k * 0.7); out += `<g opacity="${f1(1 - k)}">${K.ell(cx + d * Math.cos(ang), cy - 4 + d * 0.3 * Math.sin(ang), 7, 3, b, 0)}</g>`; });
      out += K.line(K.spiral(cx, cy - 4, 2, r * 0.6, 1.4, 30).map(p => [p[0], cy - 4 + (p[1] - cy + 4) * 0.33]), 'rgba(255,255,255,.55)', 1.6).replace('<polyline', `<polyline transform="rotate(${f1(a * 57.3 % 360)} ${cx} ${cy - 4})"`);
      out += T.spoon(cx + r * 0.45 * Math.cos(a), cy - 6 + r * 0.14 * Math.sin(a), 18 * Math.cos(a));
      out += K.path(`M${cx - r},${cy - 4} A${r},${r * 0.95} 0 0 0 ${cx + r},${cy - 4}`, s.bowl || C.sky);
      return out;
    },
    stack(s, e) {
      // pieces drop one at a time from above and land with a little bounce
      const ps = s.pieces, n = ps.length; let out = '';
      ps.forEach((p, i) => {
        const k = seg(e, i / n * 0.88, (i + 1) / n * 0.88), at = p.at || [100, 75];
        if (k <= 0) { if (i === 0 || !s.base) out += `<g opacity=".3" transform="translate(0 ${-(p.h || 90)})">${p.svg}</g>`; return; } // waiting above, ready to drop
        const fall = k < 0.7 ? 1 - Math.pow(k / 0.7, 2) : 0, bounce = k >= 0.7 ? Math.sin(seg(k, 0.7, 1) * Math.PI) * 4 : 0, dy = -(p.h || 90) * fall - bounce;
        out += `<g transform="translate(0 ${f1(dy)})">${p.svg}</g>`;
        if (k < 0.7) out += T.hand(at[0] + 4, at[1] + dy - (p.hy || 18), '🤏', 18);
      });
      return out;
    },
    knot(s, e) {
      // two ends of a string cross, loop and pull tight into a knot
      const [x, y] = s.at || [100, 70], c = s.c || C.red, k = ez(seg(e, 0.05, 0.6)), pull = ez(seg(e, 0.6, 0.92)), loopR = lerp(14, 3.5, pull), spread = lerp(26, 46, pull);
      const lx = lerp(x - 40, x - spread, k), rx = lerp(x + 40, x + spread, k), ty = y + lerp(30, 26, pull);
      let out = K.line([[x - 60, ty + 12], [lx, ty], [x - 4, y + loopR * 0.6], [x + 3, y - loopR], [x + loopR, y], [x - 2, y + loopR * 0.4], [rx, ty], [x + 60, ty + 12]], c, 3.2);
      if (k > 0.3) out += K.ell(x, y, loopR, loopR * 0.8, 'none', 0, `stroke="${c}" stroke-width="3.2"`);
      if (pull > 0.9) out += K.circ(x, y, 4, c, 1.2);
      if (e < 0.94) out += T.hand(lx - 6, ty - 4, '🤏', 18) + T.hand(rx + 6, ty - 4, '🤏', 18);
      return out;
    },
    measure(s, e) {
      // a ruler slides in along a line, then a pencil marks it off: 1, 2, 3...
      const [ax, ay] = s.from, [bx, by] = s.to, ang = Math.atan2(by - ay, bx - ax) * 180 / Math.PI, L = Math.hypot(bx - ax, by - ay), n = s.n || 5, slide = ez(seg(e, 0, 0.25)), k = seg(e, 0.28, 0.9);
      const ruler = `<g transform="translate(${f1(ax)} ${f1(ay)}) rotate(${f1(ang)}) translate(${f1(-L * 1.2 * (1 - slide))} 0)"><rect x="-4" y="2" width="${f1(L + 8)}" height="14" rx="2" fill="${C.yellow}" ${sk(1.2)}/>${Array.from({ length: n * 2 + 1 }, (_, i) => `<line x1="${f1(L * i / (n * 2))}" y1="2" x2="${f1(L * i / (n * 2))}" y2="${i % 2 ? 6 : 9}" stroke="${OL}" stroke-width="1"/>`).join('')}</g>`;
      let out = ruler, tip = [ax, ay];
      for (let i = 0; i <= n; i++) {
        if (i / n > k + 0.001) break;
        const px = lerp(ax, bx, i / n), py = lerp(ay, by, i / n);
        out += K.line([[px, py - 5], [px, py + 1]], s.c || C.red, 2) + (s.nums !== false ? `<text x="${f1(px)}" y="${f1(py - 9)}" font-size="8" font-weight="700" text-anchor="middle" fill="${OL}">${i}</text>` : '');
        tip = [px, py - 3];
      }
      const q = [lerp(ax, bx, k), lerp(ay, by, k) - 3];
      if (e < 0.95 && slide >= 1) out += T.pen(q[0], q[1], s.c || C.red);
      return out;
    },
    launch(s, e) {
      // a spoon catapult: push the spoon down, let go, the pom-pom flies in an arc and lands
      const [px, py] = s.at || [70, 110], L = s.arm || 54, c = s.c || C.pink, tg = s.target || [170, 112];
      const press = ez(seg(e, 0.05, 0.3)), snap = seg(e, 0.32, 0.4), back = seg(e, 0.85, 1);
      const ang = e < 0.32 ? lerp(-8, 14, press) : e < 0.85 ? lerp(14, -55, ez(snap)) : lerp(-55, -8, ez(back));
      const rad = ang * Math.PI / 180, tipx = px - L * Math.cos(rad), tipy = py + L * Math.sin(rad);
      let out = `<g transform="rotate(${f1(-ang)} ${px} ${py})">${K.rect(px - L, py - 3, L, 6, C.tan, 2)}${K.ell(px - L, py - 6, 9, 5, '#C9D3DC', 1.3)}</g>`;
      const fly = seg(e, 0.36, 0.86), start = [tipx, tipy - 6];
      if (e < 0.36) out += K.circ(start[0], start[1], 6, c, 1.3);
      else { const bx = lerp(start[0], tg[0], fly), by = lerp(start[1], tg[1], fly) - 80 * Math.sin(Math.PI * fly); out += K.circ(bx, by, 6, c, 1.3); }
      if (e > 0.05 && e < 0.32) out += T.hand(tipx + 2, tipy - 18, '👆', 18);
      return out;
    },
    oven(s, e) {
      // a grown-up bakes it: the oven light glows, the dial turns, warm waves rise
      const glow = Math.sin(Math.PI * seg(e, 0, 1)), dial = e * 270;
      let out = K.rect(40, 30, 120, 100, '#E7EBEF', 8) + K.rect(52, 52, 96, 66, '#3A3F4A', 6) + `<rect x="56" y="56" width="88" height="58" rx="4" fill="${C.orange}" opacity="${f1(0.15 + 0.5 * glow)}"/>` + K.g(s.item || '', 100, 92, 0.5);
      out += [64, 84].map((cx, i) => K.circ(cx, 41, 6, '#fff', 1.2) + `<line x1="${cx}" y1="41" x2="${f1(cx + 5 * Math.cos((dial + i * 90) * Math.PI / 180))}" y2="${f1(41 + 5 * Math.sin((dial + i * 90) * Math.PI / 180))}" stroke="${OL}" stroke-width="1.6"/>`).join('');
      out += `<text x="132" y="44" font-size="10" font-weight="800" text-anchor="middle" fill="${C.red}">${Math.round(e * 30)} min</text>`;
      out += [80, 100, 120].map((x, i) => `<g opacity="${f1(glow * 0.8)}">${K.line(K.wave(x, x, 0, 0, 1, 2).map((_, m) => [x + 3 * Math.sin(e * 20 + i + m), 26 - m * 9 - 6 * e]), C.orange, 1.6)}</g>`).join('');
      out += T.hand(150, 118, '🧤', 22);
      return out;
    },
    show(s, e, t) {
      const [x, y] = s.at || [100, 78], sc = s.s || 1, k = s.kind || 'bounce'; let tr = '';
      if (k === 'bounce') tr = `translate(${x} ${f1(y - Math.abs(Math.sin(t / 320)) * 10)}) scale(${sc})`;
      else if (k === 'spin') tr = `translate(${x} ${y}) rotate(${f1((t / 6 * (s.speed || 1)) % 360)}) scale(${sc})`;
      else if (k === 'drive') { const u = (t % 3600) / 3600; tr = `translate(${f1(lerp(-70, 270, u))} ${f1(y + 1.5 * Math.sin(t / 60))}) scale(${sc})`; }
      else if (k === 'wiggle') tr = `translate(${x} ${y}) rotate(${f1(8 * Math.sin(t / 260))}) scale(${sc})`;
      else if (k === 'float') tr = `translate(${x} ${f1(y + 5 * Math.sin(t / 420))}) rotate(${f1(3 * Math.sin(t / 600))}) scale(${sc})`;
      else if (k === 'fly') { const u = (t % 3200) / 3200; tr = `translate(${f1(lerp(-40, 240, u))} ${f1(y + 14 * Math.sin(u * Math.PI * 2))}) rotate(${f1(10 * Math.cos(u * Math.PI * 2))}) scale(${sc})`; }
      else if (k === 'up') { const u = (t % 3000) / 3000; tr = `translate(${x} ${f1(lerp(190, -50, u))}) scale(${sc})`; }
      else if (k === 'fall') { const u = (t % 3400) / 3400; tr = `translate(${f1(x + 10 * Math.sin(u * 9))} ${f1(lerp(-10, 150, u))}) scale(${f1(Math.cos(t / 70) * sc)} ${sc})`; }
      else if (k === 'hop') { const u = (t % 1400) / 1400; tr = `translate(${x} ${f1(y - 34 * Math.sin(u * Math.PI))}) rotate(${f1(-12 * Math.sin(u * Math.PI))}) scale(${sc})`; }
      else if (k === 'shake') tr = `translate(${f1(x + 4 * Math.sin(t / 40))} ${f1(y + 2 * Math.cos(t / 55))}) rotate(${f1(14 * Math.sin(t / 90))}) scale(${sc})`;
      else if (k === 'swing') tr = `translate(${x} ${y - 60}) rotate(${f1(16 * Math.sin(t / 380))}) translate(0 60) scale(${sc})`;
      else tr = `translate(${x} ${y}) scale(${f1((1 + 0.05 * Math.sin(t / 300)) * sc * 100) / 100})`;
      let out = (s.base || '') + `<g transform="${tr}">${s.item}</g>`;
      const sp = [[30, 26], [172, 32], [40, 124], [166, 116]];
      sp.forEach((p, i) => { const a = (Math.sin(t / 300 + i * 1.7) + 1) / 2; out += `<g opacity="${f1(a)}">${K.emo('✨', p[0], p[1], 14 + 6 * a)}</g>`; });
      return out;
    }
  };
  K.still = (s, e = 1) => (s.base || '') + ((R[s.a] || R.show)(s, e, 0) || '') + (s.top || ''); // a finished step as a picture
  const BG = `<rect width="200" height="150" fill="#FFF6E5"/><rect x="0" y="132" width="200" height="18" fill="#F3E3C6"/>`;
  function frame(s, e, t = 0) {
    let body = '';
    try { body = (R[s.a] || R.show)(s, e, t) || ''; } catch (err) { body = ''; }
    return BG + (s.a === 'show' ? '' : s.base || '') + body + (s.top || '') + (s.topEnd && e > 0.85 ? `<g opacity="${f1(seg(e, 0.85, 1))}">${s.topEnd}</g>` : '');
  }

  /* --- data: categories, levels, crafts --- */
  const CATS = [
    { id: 'fold', ico: '🦢', name: 'Paper folding & origami', c: '#2776C3' },
    { id: 'cut', ico: '✂️', name: 'Paper cutting', c: '#C44E40' },
    { id: 'collage', ico: '🌈', name: 'Collage & tearing', c: '#B05F1E' },
    { id: 'plate', ico: '🍽️', name: 'Paper plate crafts', c: '#268457' },
    { id: 'roll', ico: '🧻', name: 'Toilet roll crafts', c: '#8A5A2B' },
    { id: 'cards', ico: '💌', name: 'Cards & gifts', c: '#A23E78' },
    { id: 'clay', ico: '🐌', name: 'Playdough & clay', c: '#C0541F' },
    { id: 'nature', ico: '🍂', name: 'Nature crafts', c: '#4E7A1E' },
    { id: 'puppet', ico: '🧦', name: 'Sock & bag puppets', c: '#5B44C0' },
    { id: 'thread', ico: '📿', name: 'Threading & weaving', c: '#1D7C82' },
    { id: 'recycle', ico: '♻️', name: 'Recycled crafts', c: '#2F7D4F' },
    { id: 'sew', ico: '🪡', name: 'Simple sewing', c: '#9B3A82' },
    { id: 'party', ico: '🎉', name: 'Holiday & party', c: '#C2371F' },
    { id: 'science', ico: '🚁', name: 'Science crafts', c: '#22305A' },
    { id: 'string', ico: '🧶', name: 'String art & bracelets', c: '#7A3FB8' },
    { id: 'paint', ico: '🎨', name: 'Painting crafts', c: '#B8432F' },
    { id: 'beads', ico: '💍', name: 'Beads & jewelry', c: '#8E3FA0' },
    { id: 'costume', ico: '🦸', name: 'Costumes & dress-up', c: '#2B62B5' },
    { id: 'sensory', ico: '🫧', name: 'Sensory & play', c: '#13817F' },
    { id: 'build', ico: '🏗️', name: 'Building & engineering', c: '#6A5A16' },
    { id: 'gifts', ico: '🎁', name: 'Gifts for family', c: '#B23A5C' },
    { id: 'season', ico: '🌸', name: 'Seasons: spring to winter', c: '#3D7A3A' }
  ];
  const LEVELS = [
    { n: 1, name: 'Easy', ico: '🟢', ages: '4+', stars: 3 },
    { n: 2, name: 'Medium', ico: '🟡', ages: '6+', stars: 4 },
    { n: 3, name: 'Tricky', ico: '🟠', ages: '8+', stars: 5 },
    { n: 4, name: 'Expert', ico: '🔴', ages: '10+', stars: 6 }
  ];
  const CRAFTS = [], BY = {};
  function add(list) { list.forEach(c => { if (BY[c.id]) return; c.steps = c.steps.filter(Boolean); CRAFTS.push(c); BY[c.id] = c; }); }
  const stepDur = s => s.d || (s.a === 'show' ? 4000 : s.a === 'ori' ? 4600 : 5000);

  // Safety notes come from what the craft uses, so a new craft cannot forget one.
  function safety(c) {
    const m = c.mat.map(x => x[1].toLowerCase()).join(' | '), acts = c.steps.map(s => s.a), out = [];
    if (/scissor|knife/.test(m) || acts.includes('cut')) out.push(['✂️', 'Scissors are sharp. Ask a grown-up to help, and keep fingers away from the blades.']);
    if (/glue/.test(m) || acts.includes('glue')) out.push(['🧴', 'Glue is not for eating. Ask a grown-up which glue to use, and wash your hands after.']);
    if (/needle|pin\b|pins|skewer|toothpick/.test(m)) out.push(['📌', 'Pins and needles are sharp. Ask a grown-up to do the poking.']);
    if (c.hot) out.push(['🔥', c.hot]);
    else if (/hot glue|glue gun/.test(m)) out.push(['🔥', 'A glue gun gets very hot. Only a grown-up uses it.']);
    else if (/oven|bake|hot water|kettle|boil|stove|microwave/.test(m) || acts.includes('oven')) out.push(['🔥', 'Ovens and hot water burn. A grown-up does the hot part, and it cools before you touch it.']);
    if (/paint|food colou?r/.test(m)) out.push(['🎨', 'Paint is not for eating. Ask a grown-up for washable paint, and cover the table.']);
    if (/bead|button|pasta|cereal|seed|marble|bean|rice|sequin|pom-pom|balloon|lentil|magnet/.test(m)) out.push(['👶', 'Small pieces can choke babies. Keep them away from little ones.']);
    if (c.safe) out.push(['⚠️', c.safe]);
    return out;
  }

  /* --- per-player progress in st.crafts --- */
  const CS = () => { const c = st.crafts = st.crafts || {}; c.done = c.done || {}; c.stars = c.stars || 0; return c; };
  const madeCount = () => Object.keys(CS().done).filter(k => BY[k]).length;
  const maxLvForAge = () => st.age <= 5 ? 1 : st.age <= 7 ? 2 : st.age <= 9 ? 3 : 4;
  function suggest() {
    const ml = maxLvForAge(), D = CS().done, todo = CRAFTS.filter(c => !D[c.id]);
    return todo.filter(c => c.lv <= ml).sort((a, b) => a.lv - b.lv)[0] || todo.sort((a, b) => a.lv - b.lv)[0] || CRAFTS[0];
  }
  const lvChip = c => `<span class="cr-lv cr-lv${c.lv}">${LEVELS[c.lv - 1].ico} ${LEVELS[c.lv - 1].name}</span>`;
  const card = c => { const d = CS().done[c.id];
    return `<button class="cr-card" data-c="${c.id}" aria-label="${esc(c.name)}, ${LEVELS[c.lv - 1].name}, ${c.min} minutes${d ? ', made' : ''}"><span class="cr-ico" aria-hidden="true">${c.ico}</span><b>${esc(c.name)}</b>
      <span class="cr-meta">${lvChip(c)}<span class="cr-time">⏱ ${c.min} min</span></span>${d ? `<span class="cr-done" aria-hidden="true">${d.sticker || '✅'}</span>` : ''}</button>`; };
  const wireCards = back => view.querySelectorAll('[data-c]').forEach(b => b.onclick = () => go(craftView, b.dataset.c, back));
  const TIP = 'Do the cutting and poking parts together. Praise the trying, not the neatness: a wonky boat still floats!';

  // "I have..." quick filters: the things a family is likely to have at home, matched against each craft's materials
  const HAVE = [
    { id: 'paper', ico: '📄', name: 'paper', re: /paper|card(?!board)|newspaper/ },
    { id: 'plates', ico: '🍽️', name: 'plates', re: /plate/ },
    { id: 'rolls', ico: '🧻', name: 'rolls', re: /roll tube|tube|kitchen roll/ },
    { id: 'string', ico: '🧶', name: 'string', re: /wool|string|thread|yarn|ribbon|lace|elastic|cord|pipe cleaner/ },
    { id: 'clay', ico: '🟠', name: 'clay', re: /dough|clay(?! pot)/ },
    { id: 'paint', ico: '🎨', name: 'paint', re: /paint/ },
    { id: 'boxes', ico: '📦', name: 'boxes & bottles', re: /box|bottle|carton|cup|lid|jar/ },
    { id: 'nature', ico: '🍂', name: 'leaves & sticks', re: /leaf|leaves|rock|pinecone|stick|flower|shell|twig/ }
  ];
  const norm = x => String(x).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  // The crafts that match a level (0 = any), a material chip and typed words (every word must match the name, a material or the kind).
  function filter(level = 0, have = '', q = '') {
    const h = HAVE.find(x => x.id === have), words = norm(q).split(' ').filter(Boolean);
    return CRAFTS.filter(c => {
      if (level && c.lv !== level) return false;
      const mats = c.mat.map(m => m[1].toLowerCase()).join(' | ');
      if (h && !h.re.test(mats)) return false;
      if (words.length) {
        const hay = norm(c.name + ' ' + mats + ' ' + (CATS.find(k => k.id === c.cat) || {}).name + ' ' + LEVELS[c.lv - 1].name);
        if (!words.every(w => hay.includes(w) || (w.length > 3 && w.endsWith('s') && hay.includes(w.slice(0, -1))))) return false;
      }
      return true;
    }).sort((a, b) => a.lv - b.lv);
  }
  // Craft of the day: the same craft all day (from the date), picked from the levels that suit the child's age.
  function cotd(day = today()) {
    let h = 2166136261; for (const ch of day) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
    const ml = maxLvForAge(), pool = CRAFTS.filter(c => c.lv <= ml), L = pool.length ? pool : CRAFTS;
    return L[h % L.length];
  }

  function crHome(level = 0, have = '', q = '') {
    const D = CS(), s = suggest(), made = madeCount(), stickers = CRAFTS.filter(c => D.done[c.id]).map(c => D.done[c.id].sticker || c.ico), cd = cotd();
    view.innerHTML = `${crumbs('✂️ Crafts corner')}
      <div class="cr-hero"><span class="cr-owl" aria-hidden="true">🦉</span><p>Let's make real things! Watch each little movie, then make it with your hands. Easy ones first, then trickier ones.</p></div>
      <button class="cr-cotd" id="crDay" aria-label="Craft of the day: ${esc(cd.name)}, ${LEVELS[cd.lv - 1].name}, ${cd.min} minutes"><svg viewBox="0 0 200 150" aria-hidden="true">${frame(cd.steps[cd.steps.length - 1], 1, 600)}</svg>
        <span class="cr-cotd-t"><small>🌞 Craft of the day</small><b>${cd.ico} ${esc(cd.name)}</b><span class="cr-meta">${lvChip(cd)}<span class="cr-time">⏱ ${cd.min} min</span>${D.done[cd.id] ? '<span class="cr-time">✅ made</span>' : ''}</span></span></button>
      <button class="pick" id="crPick"><span class="big">${s.ico}</span><span><b>Try this: ${esc(s.name)}</b>${LEVELS[s.lv - 1].name} · ${s.min} minutes</span></button>
      <div class="panel cr-find"><h2>🔎 I have…</h2>
        <div class="cr-have" role="group" aria-label="Show crafts that use what I have">${HAVE.map(x => `<button class="cr-hv" data-have="${x.id}" aria-pressed="${have === x.id}"><span aria-hidden="true">${x.ico}</span> ${x.name}</button>`).join('')}</div>
        <div class="cr-search"><input type="search" id="crQ" placeholder="Find a craft: owl, box, star…" aria-label="Find a craft" value="${esc(q)}" autocomplete="off"><button class="tool" id="crQx" aria-label="Clear the search">✖️</button></div></div>
      <div class="cr-levels" role="group" aria-label="Show crafts by level"><button class="cr-lvb" data-lv="0" aria-pressed="${!level}">All</button>${LEVELS.map(l => `<button class="cr-lvb" data-lv="${l.n}" aria-pressed="${level === l.n}">${l.ico} ${l.name} <small>${l.ages}</small></button>`).join('')}</div>
      <div id="crList"></div>
      <div class="panel cr-wall"><h2>🏆 My crafts: ${made} made</h2>${stickers.length ? `<div class="cr-stk">${stickers.map(x => `<span>${x}</span>`).join('')}</div>` : '<p class="note">Finish a craft and tap "I made it!" to put it on your wall.</p>'}</div>
      <p class="en-ptip"><span aria-hidden="true">👪</span> <b>Grown-ups:</b> ${TIP}</p>`;
    wireBack(home);
    sayScreen(`Crafts corner! Let's make things. The craft of the day is ${cd.name}. Or try ${s.name}!`);
    const cur = { have, q };
    function list() {
      const box = $('#crList'), back = () => crHome(level, cur.have, cur.q);
      if (cur.have || norm(cur.q)) {
        const r = filter(level, cur.have, cur.q), h = HAVE.find(x => x.id === cur.have);
        box.innerHTML = `<h2 class="cr-h" aria-live="polite">${r.length} craft${r.length === 1 ? '' : 's'}${h ? ` with ${h.ico} ${h.name}` : ''}${norm(cur.q) ? ` for “${esc(cur.q.trim())}”` : ''}</h2>` +
          (r.length ? `<div class="cr-cards">${r.map(card).join('')}</div>` : '<p class="note">No crafts match. Try another word, or tap a different thing you have.</p>');
      } else if (level) box.innerHTML = `<h2 class="cr-h">${LEVELS[level - 1].ico} ${LEVELS[level - 1].name} crafts</h2><div class="cr-cards">${CRAFTS.filter(c => c.lv === level).map(card).join('')}</div>`;
      else {
        box.innerHTML = `<div class="cr-cats">${CATS.map(k => { const l = CRAFTS.filter(c => c.cat === k.id), dn = l.filter(c => D.done[c.id]).length;
          return `<button class="cr-cat" data-cat="${k.id}" style="background:${k.c}"><span class="cr-cico" aria-hidden="true">${k.ico}</span><b>${k.name}</b><span>${l.length} crafts${dn ? ` · ${dn} made ✅` : ''}</span></button>`; }).join('')}</div>`;
        box.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => go(catView, b.dataset.cat));
      }
      box.querySelectorAll('[data-c]').forEach(b => b.onclick = () => go(craftView, b.dataset.c, back));
    }
    $('#crDay').onclick = () => go(craftView, cd.id, () => crHome(level, cur.have, cur.q));
    $('#crPick').onclick = () => go(craftView, s.id);
    view.querySelectorAll('[data-lv]').forEach(b => b.onclick = () => go(crHome, +b.dataset.lv, cur.have, cur.q));
    view.querySelectorAll('[data-have]').forEach(b => b.onclick = () => {
      cur.have = cur.have === b.dataset.have ? '' : b.dataset.have;
      view.querySelectorAll('[data-have]').forEach(x => x.setAttribute('aria-pressed', x.dataset.have === cur.have));
      list();
      const h = HAVE.find(x => x.id === cur.have);
      if (h) say(`Crafts with ${h.name}! ${filter(level, cur.have, cur.q).length} crafts.`);
    });
    const qi = $('#crQ');
    qi.oninput = () => { cur.q = qi.value; list(); };
    qi.onkeydown = e => { if (e.key === 'Enter') qi.blur(); };
    $('#crQx').onclick = () => { qi.value = ''; cur.q = ''; list(); };
    list();
  }
  function catView(id) {
    const k = CATS.find(x => x.id === id) || CATS[0], list = CRAFTS.filter(c => c.cat === k.id).sort((a, b) => a.lv - b.lv);
    view.innerHTML = `${crumbs(`${k.ico} ${k.name}`)}<p class="note">From easy to tricky. Tap one to watch how to make it.</p><div class="cr-cards">${list.map(card).join('')}</div>`;
    wireBack(crHome);
    sayScreen(`${k.name}. ${list.map(c => c.name).join(', ')}.`);
    wireCards(() => catView(id));
  }

  /* --- the craft page and its movie player --- */
  let M = null; // the movie on screen: { c, i, playing, start, at, all, frames, raf }
  function craftView(id, back) {
    const c = BY[id] || CRAFTS[0], d = CS().done[c.id], safe = safety(c), backTo = back || (() => catView(c.cat));
    view.innerHTML = `${crumbs(`${c.ico} ${esc(c.name)}`)}
      <div class="cr-info">${lvChip(c)}<span class="cr-time">⏱ ${c.min} minutes</span><span class="cr-time">🎬 ${c.steps.length} steps</span>${d ? `<span class="cr-time">✅ made ${d.n}×</span>` : ''}</div>
      <div class="panel cr-need"><h2>You need</h2><ul class="cr-mat">${c.mat.map(([e, n]) => `<li><span aria-hidden="true">${e}</span>${esc(n)}</li>`).join('')}</ul>
        ${safe.length ? `<div class="cr-safe" role="note"><b>⚠️ Safety: ask a grown-up</b>${safe.map(([e, t]) => `<p><span aria-hidden="true">${e}</span> ${esc(t)}</p>`).join('')}</div>` : ''}</div>
      <div class="cr-movie" id="crMovie">
        <div class="cr-screen"><svg viewBox="0 0 200 150" id="crSvg" role="img" aria-label="A little movie of this step"></svg><span class="cr-badge" id="crBadge"></span><span class="cr-mode" id="crMode" hidden>🎬 Movie</span></div>
        <div class="cr-bar" aria-hidden="true"><i id="crBar"></i></div>
        <p class="cr-text" id="crText" aria-live="polite"></p>
        <div class="cr-ctrl">
          <button class="tool" id="crPrev" aria-label="Step before">⏮</button>
          <button class="tool" id="crPlay" aria-label="Pause">⏸</button>
          <button class="tool" id="crReplay" aria-label="Replay this step">🔁</button>
          <button class="tool" id="crSay" aria-label="Say it again">🔊</button>
          <button class="tool" id="crAll">🎬 Watch all</button>
        </div>
        <div class="cr-dots" role="group" aria-label="Steps">${c.steps.map((_, i) => `<button class="cr-dot" data-s="${i}" aria-label="Step ${i + 1}">${i + 1}</button>`).join('')}</div>
        <button class="btn leaf cr-next" id="crNext">Next step ▶</button>
      </div>
      ${c.tip ? `<p class="en-ptip"><span aria-hidden="true">👪</span> <b>Grown-ups:</b> ${esc(c.tip)}</p>` : ''}`;
    wireBack(backTo);
    const nav = navId, svg = $('#crSvg');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    M = { c, i: 0, playing: !reduce, start: performance.now(), at: reduce ? 0.9 * stepDur(c.steps[0]) : 0, all: false, frames: 0, raf: 0, nav, holdUntil: 0 };
    const mv = M;
    function show(i, speak = true) {
      mv.i = cl(i, 0, c.steps.length - 1) | 0; mv.start = performance.now(); mv.at = 0; mv.holdUntil = 0;
      if (!mv.playing && !mv.all) mv.at = 0.9 * stepDur(c.steps[mv.i]);
      const s = c.steps[mv.i], last = mv.i === c.steps.length - 1;
      $('#crBadge').textContent = `Step ${mv.i + 1} of ${c.steps.length}`;
      $('#crText').innerHTML = `<b>Step ${mv.i + 1}.</b> ${esc(s.t)}`;
      $('#crNext').textContent = last ? '🎉 I made it!' : 'Next step ▶';
      $('#crNext').classList.toggle('cr-made', last);
      $('#crPrev').disabled = mv.i === 0;
      view.querySelectorAll('.cr-dot').forEach((b, k) => { b.classList.toggle('on', k === mv.i); b.classList.toggle('seen', k < mv.i); b.setAttribute('aria-current', k === mv.i ? 'step' : 'false'); });
      draw(performance.now());
      if (speak) say(`Step ${mv.i + 1}. ${s.t}`);
      screenText = `Step ${mv.i + 1}. ${s.t}`;
    }
    function draw(now) {
      const s = c.steps[mv.i], d = stepDur(s), el = mv.playing ? now - mv.start + mv.at : mv.at;
      const u = mv.all ? Math.min(1, el / d) : (el % d) / d, e = u < 0.12 ? 0 : u > 0.82 ? 1 : ez((u - 0.12) / 0.7);
      svg.innerHTML = frame(s, e, el); mv.frames++; mv.u = u; mv.e = e;
      const bar = $('#crBar'); if (bar) bar.style.width = (u * 100).toFixed(1) + '%';
      if (mv.all && mv.playing && el >= d) {
        if (!mv.holdUntil) mv.holdUntil = now + Math.max(900, s.t.split(/\s+/).length * 330 - d + 1600);
        else if (now >= mv.holdUntil) { if (mv.i < c.steps.length - 1) show(mv.i + 1); else stopAll(true); }
      }
    }
    function loop(now) {
      if (nav !== navId || !svg.isConnected) { M === mv && cancelAnimationFrame(mv.raf); return; }
      if (mv.playing) draw(now);
      mv.raf = requestAnimationFrame(loop);
    }
    function setPlay(on) {
      const now = performance.now();
      if (on && !mv.playing) { mv.start = now; mv.playing = true; }
      else if (!on && mv.playing) { mv.at += now - mv.start; mv.playing = false; draw(now); }
      $('#crPlay').textContent = mv.playing ? '⏸' : '▶️'; $('#crPlay').setAttribute('aria-label', mv.playing ? 'Pause' : 'Play');
    }
    function startAll() { mv.all = true; $('#crMode').hidden = false; $('#crAll').textContent = '⏹ Stop movie'; setPlay(true); show(0); }
    function stopAll(end) {
      mv.all = false; $('#crMode').hidden = true; $('#crAll').textContent = '🎬 Watch all';
      if (end) { mv.start = performance.now(); mv.at = 0; say("That's how to make it! Now you try. Then tap I made it!"); $('#crNext').classList.add('cr-pulse'); }
    }
    $('#crPlay').onclick = () => setPlay(!mv.playing);
    $('#crReplay').onclick = () => { setPlay(true); show(mv.i, true); };
    $('#crSay').onclick = () => say(`Step ${mv.i + 1}. ${c.steps[mv.i].t}`);
    $('#crPrev').onclick = () => { if (mv.all) stopAll(); show(mv.i - 1); };
    $('#crAll').onclick = () => mv.all ? stopAll() : startAll();
    $('#crNext').onclick = () => { if (mv.all) stopAll(); if (mv.i < c.steps.length - 1) { tone([620]); show(mv.i + 1); } else go(madeView, c.id); };
    view.querySelectorAll('.cr-dot').forEach(b => b.onclick = () => { if (mv.all) stopAll(); show(+b.dataset.s); });
    canvasCleanup = () => cancelAnimationFrame(mv.raf);
    setPlay(mv.playing);
    show(0, false);
    say(`${c.name}. ${LEVELS[c.lv - 1].name}. You need ${c.mat.map(m => m[1]).join(', ')}. ${safe.length ? 'Ask a grown-up to help.' : ''} Step 1. ${c.steps[0].t}`);
    mv.raf = requestAnimationFrame(loop);
  }

  /* --- "I made it!": draw your craft or pick a sticker, then stars --- */
  const STK = ['🌟', '🏆', '🎨', '🦄', '🚀', '🐸', '🦉', '🌈', '💖', '🐱', '🦋', '🌻', '🐉', '🎁', '👑', '🐙'];
  function award(c, how, sticker) {
    const D = CS(), rec = D.done[c.id], first = !rec, n = first ? LEVELS[c.lv - 1].stars : 1;
    D.done[c.id] = { n: (rec ? rec.n : 0) + 1, first: rec ? rec.first : today(), last: today(), sticker: sticker || (rec && rec.sticker) || c.ico, how };
    D.stars += n; questTick('art'); dayLog('art'); addStars(n); confetti(60); yay();
    return { n, first };
  }
  function madeView(id) {
    const c = BY[id] || CRAFTS[0], last = c.steps[c.steps.length - 1];
    let done = false;
    view.innerHTML = `${crumbs('🎉 You made it!')}
      <div class="cr-made-top"><svg viewBox="0 0 200 150" class="cr-mini" aria-hidden="true">${frame(last, 1, 600)}</svg><div><h2>${c.ico} ${esc(c.name)}</h2><p>Wow! Show Owl what yours looks like.</p></div></div>
      <div class="row cr-how"><button class="btn" id="crDraw">✏️ Draw my craft</button><button class="btn alt" id="crStk">⭐ Pick a sticker</button></div>
      <div id="crBox"></div><div class="cheer" id="cheer" aria-live="polite"></div>`;
    wireBack(() => craftView(c.id));
    sayScreen(`You made the ${c.name}! Draw it, or pick a sticker for it.`);
    const finish = (how, sticker) => {
      if (done) return; done = true;
      const r = award(c, how, sticker), nx = CRAFTS.filter(x => x.cat === c.cat && x.id !== c.id && !CS().done[x.id]).sort((a, b) => a.lv - b.lv)[0] || suggest();
      $('#crBox').innerHTML = `<div class="panel cr-win"><div class="cr-big" aria-hidden="true">${sticker || c.ico}</div><h2>${'⭐'.repeat(r.n)} +${r.n} star${r.n > 1 ? 's' : ''}!</h2>
        <p>${r.first ? `Your ${esc(c.name)} is on your crafts wall.` : 'You made it again! Practice makes it better.'}</p>
        <div class="row"><button class="btn leaf" id="crNx">${nx.ico} Next: ${esc(nx.name)}</button><button class="btn alt" id="crHm">✂️ All crafts</button></div></div>`;
      $('#cheer').textContent = r.first ? 'Super crafter!' : 'Well done!';
      view.querySelectorAll('.cr-how button').forEach(b => b.disabled = true);
      say(`Well done! You earned ${r.n} star${r.n > 1 ? 's' : ''}! ${r.first ? `Your ${c.name} is on your crafts wall.` : ''}`);
      $('#crNx').onclick = () => go(craftView, nx.id);
      $('#crHm').onclick = () => go(crHome);
    };
    $('#crStk').onclick = () => {
      if (done) return;
      $('#crBox').innerHTML = `<div class="panel"><h2>Pick a sticker for it</h2><div class="cr-stks">${[c.ico, ...STK.filter(x => x !== c.ico)].map(x => `<button class="cr-sb" data-k="${x}" aria-label="Sticker ${x}">${x}</button>`).join('')}</div></div>`;
      say('Pick a sticker for your craft!');
      view.querySelectorAll('[data-k]').forEach(b => b.onclick = () => finish('sticker', b.dataset.k));
    };
    $('#crDraw').onclick = () => {
      if (done) return;
      $('#crBox').innerHTML = `<div class="panel"><h2>Draw your ${esc(c.name.toLowerCase())}</h2>
        <div class="cr-pad"><canvas id="crCv" aria-label="Drawing pad: draw your craft here"></canvas></div>
        <div class="tools cr-cols">${PAINT.slice(0, 9).map((p, i) => `<button class="sw" style="background:${p}" data-pc="${p}" aria-label="${PAINT_NAMES[i]}" aria-pressed="${i === 0}"></button>`).join('')}</div>
        <div class="row"><button class="tool" id="crUndo">↩️ Undo</button><button class="tool" id="crClr">🗑️ Clear</button><button class="btn leaf" id="crSave">✅ Done</button></div></div>`;
      say('Draw your craft! Then tap done.');
      const cv = $('#crCv'), ctx = cv.getContext('2d'), wrap = cv.parentElement, dpr = window.devicePixelRatio || 1;
      const W = wrap.clientWidth, H = Math.round(W * 0.7);
      cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ctx.lineCap = ctx.lineJoin = 'round'; ctx.lineWidth = 6;
      let col = PAINT[0], down = false, ink = 0; const undo = [];
      const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
      cv.onpointerdown = e => { down = true; try { cv.setPointerCapture(e.pointerId); } catch (x) {} undo.push(ctx.getImageData(0, 0, cv.width, cv.height)); if (undo.length > 12) undo.shift(); const [x, y] = pos(e); ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 0.1, y + 0.1); ctx.stroke(); ink++; };
      cv.onpointermove = e => { if (!down) return; const [x, y] = pos(e); ctx.lineTo(x, y); ctx.stroke(); ink++; };
      cv.onpointerup = cv.onpointercancel = () => { down = false; };
      view.querySelectorAll('[data-pc]').forEach(b => b.onclick = () => { col = b.dataset.pc; view.querySelectorAll('[data-pc]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
      $('#crUndo').onclick = () => { const im = undo.pop(); if (im) { ctx.putImageData(im, 0, 0); ink = undo.length ? ink : 0; } };
      $('#crClr').onclick = () => { undo.push(ctx.getImageData(0, 0, cv.width, cv.height)); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); ink = 0; };
      $('#crSave').onclick = () => {
        if (done) return;
        if (ink < 3) { say('Draw your craft first!'); oops(); return; }
        try { const t = document.createElement('canvas'); t.width = 360; t.height = Math.round(360 * H / W); t.getContext('2d').drawImage(cv, 0, 0, t.width, t.height);
          gallery.unshift(t.toDataURL('image/jpeg', 0.75)); gallery = gallery.slice(0, 30); saveGallery(); } catch (e) {}
        finish('drawing');
      };
    };
  }

  const info = () => ({ crafts: CRAFTS.length, cats: CATS.length, steps: CRAFTS.reduce((a, c) => a + c.steps.length, 0), levels: LEVELS.map(l => CRAFTS.filter(c => c.lv === l.n).length) });
  if (location.hash === '#selftest') window.__crafts = {
    CATS, LEVELS, HAVE, get CRAFTS() { return CRAFTS; }, BY, info, safety, frame, stepDur, CS, suggest, filter, cotd, raw: (s, e, t = 0) => R[s.a](s, e, t),
    home: (lv, have, q) => go(crHome, lv || 0, have || '', q || ''), cat: id => go(catView, id), open: id => go(craftView, id), made: id => go(madeView, id), get movie() { return M; }
  };
  crHome.add = add; crHome.kit = K; crHome.info = info; crHome.LEVELS = LEVELS; crHome.CATS = CATS;
  return crHome;
})();
