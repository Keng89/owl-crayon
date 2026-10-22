/* ---------- Crafts corner, part 6 (round 3): new movie kinds, a kid-paced player, craft journeys and printable templates ---------- */
// Hooks into crafts.js through craftsHome (R: movie kinds, T: tools, onView / onMade / onHome). Everything stays offline.
// - New movie kinds: slice (a grown-up's knife), spread, inflate (a balloon), layer (paper mache strips), peel (sticky
//   backing), popup (a pop-up card opening), spring (a jumping origami animal), shadow (a torch, a puppet and its shadow),
//   loom (over-under weaving), fish (magnet fishing), music (strum, drum, shake, tap, blow), ring (a mandala, piece by
//   piece) and rise (walls standing up). Tools glow softly so a child sees what moves.
// - The craft page opens with the finished craft playing ("This is what you will make!"), has a slow-motion button and a
//   big "I did this step ✓" button that cheers and moves on at the child's own pace.
// - Craft journeys: 6 themed trails of 6 crafts, easy to expert, with a badge at the end (st.crafts.jbadges).
// - Print template: crafts that need a shape print a real-size outline (only the outline) through window.print().
(() => {
  const H = craftsHome, K = H.kit, C = K.C, OL = K.OL, R = H.R, T = H.T, f1 = K.f1;
  const lerp = (a, b, t) => a + (b - a) * t, cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ez = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, seg = (e, a, b) => cl((e - a) / (b - a));
  const rr = i => { const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); };
  let clipN = 0;

  /* --- new tools --- */
  Object.assign(T, {
    knife: (x, y, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot - 70)})"><path d="M0,0 L-30,-6 L-30,4 Z" fill="#DDE5EC" stroke="${OL}" stroke-width="1.2" stroke-linejoin="round"/><rect x="-50" y="-4.5" width="21" height="9" rx="3" fill="${C.brown}" stroke="${OL}" stroke-width="1.2"/></g>`,
    spreader: (x, y, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot - 60)})"><path d="M2,-4 Q8,0 2,4 L-24,3 L-24,-3 Z" fill="#DDE5EC" stroke="${OL}" stroke-width="1.2"/><rect x="-44" y="-4" width="21" height="8" rx="3" fill="${C.blue}" stroke="${OL}" stroke-width="1.2"/></g>`,
    pump: (x, y, down = 0) => `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="-7" y="-30" width="14" height="30" rx="3" fill="${C.blue}" stroke="${OL}" stroke-width="1.3"/><rect x="-1.5" y="${f1(-44 + down * 12)}" width="3" height="16" fill="${C.grey}"/><rect x="-10" y="${f1(-48 + down * 12)}" width="20" height="6" rx="3" fill="${C.red}" stroke="${OL}" stroke-width="1.2"/></g>`,
    torch: (x, y) => `<g transform="translate(${f1(x)} ${f1(y)})"><rect x="-18" y="-6" width="22" height="12" rx="3" fill="${C.purple}" stroke="${OL}" stroke-width="1.3"/><path d="M4,-8 L12,-10 L12,10 L4,8 Z" fill="${C.yellow}" stroke="${OL}" stroke-width="1.3"/></g>`,
    ice: (x, y, c = C.blue) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(20)"><rect x="-8" y="-14" width="16" height="14" rx="3" fill="${c}" opacity=".85" stroke="${OL}" stroke-width="1.2"/><rect x="-5" y="-12" width="4" height="5" rx="1" fill="rgba(255,255,255,.7)"/><rect x="-2.5" y="-40" width="5" height="27" rx="2" fill="${C.tan}" stroke="${OL}" stroke-width="1.1"/></g>`,
    dstick: (x, y, rot = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)})"><rect x="-2" y="-44" width="4" height="42" rx="2" fill="${C.tan}" stroke="${OL}" stroke-width="1.1"/><circle cx="0" cy="-2" r="5" fill="${C.red}" stroke="${OL}" stroke-width="1.2"/></g>`
  });
  const notes = (x, y, e, n = 3, c = C.purple) => Array.from({ length: n }, (_, i) => { const u = (e * 3 + i / n) % 1;
    return `<g opacity="${f1(Math.sin(Math.PI * u))}"><text x="${f1(x + 8 + u * 30 + i * 6)}" y="${f1(y - u * 34 - i * 4)}" font-size="${f1(12 + 4 * u)}" font-weight="800" fill="${c}" text-anchor="middle">${i % 2 ? '♫' : '♪'}</text></g>`; }).join('');
  // a polygon cut by a half-plane (keeps f(p) >= 0), for the peeling sheet
  const half = (pts, f) => { const out = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], fa = f(a), fb = f(b); if (fa >= 0) out.push(a); if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); } } return out; };
  // a paper fish with a paperclip nose, for the magnet fishing game (also used by the data)
  K.fishy = (x, y, c = C.orange, rot = 0, s = 1) => K.g(`${K.poly([[14, 0], [24, -8], [24, 8]], c)}${K.ell(0, 0, 16, 9, c)}${K.circ(-8, -2, 2, OL, 0)}<rect x="-22" y="-3" width="9" height="6" rx="3" fill="none" stroke="#8A96A3" stroke-width="1.6"/>`, x, y, s, rot);

  /* --- new movie kinds --- */
  Object.assign(R, {
    slice(s, e) {
      // a grown-up's knife saws along a line, then the cut piece slides away
      const [a, b] = s.pts, k = seg(e, 0, 0.75), mv = ez(seg(e, 0.78, 1)), off = s.off || [16, 0];
      const x = lerp(a[0], b[0], k), y = lerp(a[1], b[1], k);
      let out = (s.keep || '') + (s.piece ? K.g(s.piece, off[0] * mv, off[1] * mv) : '');
      out += K.line([a, b], 'rgba(34,48,90,.4)', 1.4, '4 3') + (k > 0 ? K.line([a, [x, y]], OL, 1.8) : '');
      if (e < 0.9) out += T.knife(x + 2 * Math.sin(e * 90), y - 3, 0);
      return out;
    },
    spread(s, e) {
      // a spreading knife zigzags across, leaving icing, jam or glue paste behind
      const [x, y, w, h] = s.box, k = seg(e, 0, 0.9), id = 'cr6s' + (++clipN), edge = x + w * k;
      let out = `<clipPath id="${id}"><rect x="${f1(x - 2)}" y="${f1(y - 4)}" width="${f1(w * k + 2)}" height="${f1(h + 8)}"/></clipPath><g clip-path="url(#${id})">${s.area}</g>`;
      if (e < 0.93) out += T.spreader(edge, y + h * (0.5 + 0.42 * Math.sin(e * 40)), 10 * Math.sin(e * 40));
      return out;
    },
    inflate(s, e) {
      // a pump blows the balloon up, puff by puff
      const [cx, cy] = s.at || [90, 66], r = s.r || 40, k = ez(seg(e, 0, 0.85)), puff = Math.abs(Math.sin(e * Math.PI * 6));
      const rad = lerp(r * 0.22, r, k) * (1 + 0.03 * puff * (e < 0.85 ? 1 : 0)), rx = rad * 0.86;
      const by = cy + rad, c = s.c || C.red;
      let out = K.line([[cx, by + 4], [cx + 6, by + 18], [150, 124]], C.grey, 2.2);
      out += K.ell(cx, cy, rx, rad, c) + K.ell(cx - rx * 0.35, cy - rad * 0.4, rx * 0.16, rad * 0.22, 'rgba(255,255,255,.55)', 0) + K.poly([[cx - 4, by + 5], [cx + 4, by + 5], [cx, by - 1]], c, 1.2);
      out += T.pump(150, 132, e < 0.85 ? puff : 0) + (e < 0.88 ? T.hand(150, 88 + puff * 12, '✋', 22) : '');
      return out;
    },
    layer(s, e) {
      // paper mache: strips land one by one and a brush smooths paste over each
      const n = s.strips.length; let out = '';
      s.strips.forEach((st, i) => {
        const k = seg(e, i / n * 0.9, (i + 1) / n * 0.9); if (k <= 0) return;
        const land = ez(Math.min(1, k * 2.2)), xs = st.p.map(p => p[0]), ys = st.p.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), my = (Math.min(...ys) + Math.max(...ys)) / 2;
        out += `<g transform="translate(0 ${f1(-30 * (1 - land))})" opacity="${f1(0.5 + 0.45 * land)}">${K.poly(st.p, st.c || '#EFE6D2', 1.1)}${K.line([[x0 + 4, my - 2], [x1 - 4, my + 1]], 'rgba(34,48,90,.18)', 1)}</g>`;
        if (k < 1 && k > 0.45 && e < 0.92) out += T.brush(lerp(x0, x1, (Math.sin(k * 18) + 1) / 2), my, s.paste || '#F3EFE4');
      });
      return out;
    },
    peel(s, e) {
      // peel the backing sheet off from the top right corner; the sticky side is underneath
      const [x, y, w, h] = s.box, k = ez(seg(e, 0.05, 0.88)), d = k * (w + h) * 1.02, c0 = d - (x + w) + y, r2 = Math.SQRT2;
      const sheetP = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], f = p => (x + w - p[0]) + (p[1] - y) - d;
      const keep = half(sheetP, f), flap = half(sheetP, p => -f(p)).map(([px, py]) => { const dist = (-px + py - c0) / r2; return [px + 2 * dist / r2, py - 2 * dist / r2]; });
      let out = keep.length > 2 ? K.poly(keep, s.c || '#E3EEF8', 1.2) : '';
      if (flap.length > 2) out += `<g opacity="${f1(1 - seg(e, 0.86, 1))}">${K.poly(flap, '#FFFFFF', 1.2)}</g>`;
      if (e < 0.88 && k > 0) out += T.hand(cl(x + w - d, 10, 190), cl(y + d, 10, 140) - 4, '🤏', 20); // the peeled corner folds back to (x+w-d, y+d)
      return out;
    },
    popup(s, e) {
      // a pop-up card: the cover lifts up, and the inside picture stands up from the fold
      const fy = s.fy || 86, w = s.w || 120, x0 = 100 - w / 2, x1 = 100 + w / 2, hb = s.hb || 40, ht = s.ht || 64, k = ez(seg(e, 0.05, 0.7));
      const yc = lerp(fy + hb, fy - ht, k), lying = yc > fy, sk = 14 * (lying ? (yc - fy) / hb : 0);
      let out = K.poly([[x0, fy], [x1, fy], [x1 + 14, fy + hb], [x0 - 14, fy + hb]], s.in || '#FFF6EA', 1.4);
      const cover = K.poly([[x0, fy], [x1, fy], [x1 + sk, yc], [x0 - sk, yc]], lying ? (s.out || C.pink) : (s.in || '#FFFDF7'), 1.4);
      const deco = !lying && s.deco ? `<g transform="translate(0 ${fy}) scale(1 ${f1((fy - yc) / ht * 100) / 100}) translate(0 ${-fy})">${s.deco}</g>` : '';
      const p = ez(seg(k, 0.35, 1)) * (1 + (e > 0.72 ? 0.04 * Math.sin(e * 40) : 0));
      const pop = p > 0.01 ? `<g transform="translate(100 ${fy}) scale(1 ${f1(p * 100) / 100}) translate(-100 ${-fy})">${s.pop || ''}</g>` : '';
      out += lying ? pop + cover : cover + deco + pop;
      if (e < 0.75) out += T.hand(100, yc - 6, '🤏', 20);
      return out;
    },
    spring(s, e) {
      // press the back, let go, and it jumps in an arc
      const [x, y] = s.at || [60, 118], [x2, y2] = s.to || [150, 118], h = s.h || 60;
      const press = ez(seg(e, 0, 0.3)), u = seg(e, 0.38, 0.82), land = seg(e, 0.82, 1);
      let px = x, py = y, sy = 1 - 0.3 * press, rot = 0;
      if (e >= 0.38) { const m = ez(u); px = lerp(x, x2, m); py = lerp(y, y2, m) - h * Math.sin(Math.PI * u); sy = e < 0.82 ? 1.08 : 1 - 0.18 * Math.sin(Math.PI * land); rot = -22 * Math.sin(Math.PI * u); }
      let out = K.line(K.arc((x + x2) / 2, Math.min(y, y2), (x2 - x) / 2, h, 180, 360, 16), 'rgba(34,48,90,.2)', 1.3, '3 4');
      if (e >= 0.38 && e < 0.82) out += [8, 16].map(dx => K.line([[px - dx - 8, py - 6], [px - dx - 16, py - 2]], C.sky, 2)).join('');
      out += `<g transform="translate(${f1(px)} ${f1(py)}) rotate(${f1(rot)}) scale(${f1((2 - sy) * 100) / 100} ${f1(sy * 100) / 100})">${s.item}</g>`;
      if (e < 0.36) out += T.hand(x - (s.press || 14), y - 30 * sy - 4, '👆', 20);
      return out;
    },
    shadow(s, e, t = 0) {
      // a torch shines on a paper screen; the puppet's shadow grows and moves
      const [sx, sy, sw, shh] = s.screen || [146, 18, 46, 104], [lx, ly] = s.light || [20, 74], on = seg(e, 0, 0.15), k = ez(seg(e, 0.1, 0.85));
      const px = lerp(62, 104, k) + 3 * Math.sin(t / 300), py = 66 + 5 * Math.sin(e * 12), id = 'cr6h' + (++clipN);
      const fct = (sx + sw / 2 - lx) / Math.max(20, px - lx), shx = sx + sw / 2, shy = ly + (py - ly) * fct, sc = cl(fct * 0.5, 0.9, 2.1);
      let out = `<rect width="200" height="150" fill="rgba(34,48,90,${f1(0.12 + 0.2 * on)})"/>` + K.rect(sx, sy, sw, shh, '#FFFDF2', 2);
      out += `<polygon points="${lx + 10},${ly - 8} ${sx},${sy} ${sx},${sy + shh} ${lx + 10},${ly + 8}" fill="rgba(255,226,120,${f1(0.4 * on)})"/>`;
      out += `<clipPath id="${id}"><rect x="${sx}" y="${sy}" width="${sw}" height="${shh}"/></clipPath><g clip-path="url(#${id})" opacity="${f1(0.85 * on)}"><g transform="translate(${f1(shx)} ${f1(shy)}) scale(${f1(sc * 100) / 100})">${s.sil}</g></g>`;
      out += T.torch(lx, ly) + K.line([[px, py + 10], [px - 4, 136]], C.tan, 3) + `<g transform="translate(${f1(px)} ${f1(py)})">${s.puppet}</g>` + T.hand(px - 4, 130, '✊', 20);
      return out;
    },
    loom(s, e) {
      // a cardboard loom: the yarn goes over one string, under the next, row after row from the bottom up
      const [x, y, w, h] = s.box || [44, 18, 112, 114], nw = s.warp || 9, pre = s.pre || 0, n = s.n || 3, rowH = s.rowH || 8, cols = s.colors || [C.red, C.yellow, C.blue];
      const gx = i => x + 10 + (w - 20) * i / (nw - 1), ry = j => y + h - 12 - j * rowH;
      let out = K.rect(x, y, w, h, C.card, 3) + Array.from({ length: nw }, (_, i) => K.poly([[gx(i) - 3, y], [gx(i) + 3, y], [gx(i), y + 5]], '#B98A55', 0) + K.poly([[gx(i) - 3, y + h], [gx(i) + 3, y + h], [gx(i), y + h - 5]], '#B98A55', 0)).join('');
      out += Array.from({ length: nw }, (_, i) => K.line([[gx(i), y + 4], [gx(i), y + h - 4]], '#FFFFFF', 1.8)).join('');
      const k = seg(e, 0, 0.92) * n, cur = pre + Math.min(n - 1, Math.floor(k)), frac = k >= n ? 1 : k - Math.floor(k);
      let tip = null;
      for (let j = 0; j <= cur; j++) {
        const ltr = j % 2 === 0, full = j < cur || (j === cur && k >= n), p = full ? 1 : frac, xa = ltr ? gx(0) - 6 : gx(nw - 1) + 6, xb = ltr ? gx(nw - 1) + 6 : gx(0) - 6, xe = lerp(xa, xb, p), c = cols[j % cols.length];
        if (p <= 0) continue;
        out += K.line([[xa, ry(j)], [xe, ry(j)]], OL, 7.4) + K.line([[xa, ry(j)], [xe, ry(j)]], c, 5.4);
        for (let i = 0; i < nw; i++) if ((i + j) % 2 && (ltr ? gx(i) < xe : gx(i) > xe)) out += K.line([[gx(i), ry(j) - 4.2], [gx(i), ry(j) + 4.2]], '#FFFFFF', 2);
        if (!full) tip = [xe, ry(j), ltr ? 0 : 180];
      }
      if (tip && e < 0.95) out += T.needle(tip[0] + (tip[2] ? -2 : 2), tip[1], tip[2] ? 180 : 0);
      return out;
    },
    fish(s, e) {
      // magnet fishing: the line drops, the magnet clicks onto a paperclip, the fish comes up
      const [px, py, pw, ph] = s.pond || [100, 112, 80, 22], fish = s.fish || [], pick = s.pick || 0, f = fish[pick] || [100, 112, C.orange];
      const lower = ez(seg(e, 0.05, 0.4)), lift = ez(seg(e, 0.5, 0.88)), tx = f[0] - 20, endY = e < 0.5 ? lerp(30, f[1] - 2, lower) : lerp(f[1] - 2, 44, lift);
      let out = K.ell(px, py, pw, ph, 'rgba(46,139,230,.35)', 1.4) + K.ell(px, py - 3, pw * 0.85, ph * 0.6, 'none', 0, 'stroke="rgba(255,255,255,.6)" stroke-width="1.5"');
      fish.forEach((q, i) => { if (i !== pick) out += K.fishy(q[0], q[1], q[2], q[3] || 0, 0.8); });
      const sw = e > 0.5 ? 10 * Math.sin(e * 24) * (1 - lift * 0.5) : 0;
      out += K.line([[26, 46], [tx, 14]], C.brown, 3.2) + K.line([[tx, 14], [tx, endY]], OL, 1.2);
      out += `<g transform="translate(${f1(tx)} ${f1(endY)})"><path d="M-4,0 L-4,5 A4,4 0 0 0 4,5 L4,0" fill="none" stroke="${C.red}" stroke-width="3"/></g>`;
      out += e >= 0.5 ? K.fishy(tx + 18, endY + 6, f[2], 80 + sw, 0.8) : K.fishy(f[0], f[1], f[2], f[3] || 0, 0.8);
      if (e > 0.4 && e < 0.56) out += K.emo('✨', tx + 10, f[1] - 14, 16);
      out += T.hand(24, 52, '✊', 22);
      return out;
    },
    music(s, e, t = 0) {
      // play the instrument: strum, drum, shake, tap or blow, with notes floating out
      const m = s.mode || 'shake'; let out = '';
      if (m === 'strum') {
        const st = s.strings || [], n = st.length, phase = e * 3, loc = phase % 1;
        st.forEach((q, i) => { let since = loc - (i + 0.5) / n; if (since < 0) since = phase >= 1 ? since + 1 : -1;
          const amp = since >= 0 ? 3 * Math.exp(-since * 5) : 0, pts = Array.from({ length: 13 }, (_, j) => { const u = j / 12; return [lerp(q[0], q[2], u) + amp * Math.sin(Math.PI * u) * Math.sin(e * 300 + i), lerp(q[1], q[3], u)]; });
          out += K.line(pts, s.c || '#F4F1E8', 2) + K.line(pts, 'rgba(34,48,90,.35)', 0.6); });
        const hx = lerp(Math.min(...st.map(q => q[0])) - 8, Math.max(...st.map(q => q[0])) + 8, loc), hy = st.length ? (st[0][1] + st[0][3]) / 2 + 6 : 80;
        out += T.hand(hx, hy, '👆', 20) + notes(hx + 10, hy - 20, e);
      } else if (m === 'drum') {
        const hits = s.hits || [[100, 80]], beats = s.n || 6, b = Math.min(beats - 1, Math.floor(e * beats)), fr = e * beats - b, hp = hits[b % hits.length], side = b % 2 ? 1 : -1;
        out += `<g opacity="${f1(1 - fr)}">${K.ell(hp[0], hp[1], 6 + 22 * fr, 2 + 7 * fr, 'none', 0, `stroke="${C.yellow}" stroke-width="2"`)}</g>`;
        const lift = 18 * Math.abs(Math.sin(Math.PI * fr));
        out += T.dstick(hp[0] + side * 6, hp[1] - lift, side * 25) + T.dstick(hp[0] - side * 30, hp[1] - 26, -side * 30) + notes(hp[0], hp[1] - 30, e, 2, C.red);
      } else if (m === 'tap') {
        const pts = s.pts || [], n = pts.length, k = Math.min(n - 1, Math.floor(seg(e, 0, 0.98) * n)), fr = seg(e, 0, 0.98) * n - k, q = pts[k] || [100, 80];
        out += T.spoon(q[0] + 12, q[1] - 4 - 10 * Math.abs(Math.sin(Math.PI * fr)), -40) + `<g opacity="${f1(1 - fr)}">${K.emo('♪', q[0], q[1] - 18 - 16 * fr, 14 + (n - k) * 2)}</g>`;
      } else if (m === 'blow') {
        const [x, y] = s.at || [60, 70];
        out += [0, 1, 2].map(i => { const u = (e * 2 + i / 3) % 1; return `<g opacity="${f1(Math.sin(Math.PI * u))}">${K.line(K.wave(x + 6 + u * 60, x + 26 + u * 60, y + (i - 1) * 8, 2, 1.5, 10), C.sky, 2)}</g>`; }).join('') + notes(x + 10, y - 6, e);
      } else { // shake
        const [x, y] = s.at || [100, 76], a = 16 * Math.sin(e * 70);
        out += `<g transform="translate(${x} ${y}) rotate(${f1(a)})">${s.item || ''}</g>` + T.hand(x + 4 + a * 0.4, y + 24, '✊', 22) + notes(x + 14, y - 20, e, 3, C.green);
      }
      return out;
    },
    ring(s, e) {
      // a mandala: pieces go down one by one, from the middle out
      const it = s.items || [], n = it.length; let out = '', hand = null;
      it.forEach((p, i) => { const k = seg(e, i / n * 0.9, (i + 1) / n * 0.9); if (k <= 0) return; const m = ez(k);
        out += `<g transform="translate(${f1(p.x)} ${f1(p.y - 16 * (1 - m))}) scale(${f1((0.3 + 0.7 * m) * 100) / 100}) translate(${f1(-p.x)} ${f1(-p.y)})">${p.svg}</g>`;
        if (k < 1) hand = [p.x, p.y - 16 * (1 - m)]; });
      if (hand && e < 0.92) out += T.hand(hand[0] + 6, hand[1] - 8, '🤏', 18);
      return out;
    },
    rise(s, e) {
      // flat pieces stand up one after another (castle walls, pop-up houses)
      const ps = s.pieces || [], n = ps.length; let out = '';
      ps.forEach((p, i) => { const k = ez(seg(e, i / n * 0.88, (i + 1) / n * 0.88)), [x, by] = p.at || [100, 120], sy = lerp(0.06, 1, k);
        out += `<g transform="translate(0 ${by}) scale(1 ${f1(sy * 100) / 100}) translate(0 ${-by})">${p.svg}</g>`;
        if (k > 0 && k < 1) out += T.hand(x + 8, by - (p.h || 50) * sy - 6, '👆', 18); });
      return out;
    }
  });
  // The tools glow softly in every movie, so the eye goes to what is moving.
  Object.keys(T).forEach(k => { const f = T[k]; T[k] = (...a) => `<g class="cr-glow">${f(...a)}</g>`; });
  const NEW_KINDS = ['slice', 'spread', 'inflate', 'layer', 'peel', 'popup', 'spring', 'shadow', 'loom', 'fish', 'music', 'ring', 'rise'];

  /* --- craft journeys --- */
  const JOURNEYS = [
    { id: 'paper', ico: '📜', name: 'Paper Master', badge: '🎖️', c: '#2776C3', blurb: 'Fold and cut paper, from a fan to a flying crane.', crafts: ['fan', 'heart', 'popflower', 'hopfrog', 'popdragon', 'crane'] },
    { id: 'builder', ico: '🏗️', name: 'Little Builder', badge: '🦺', c: '#6A5A16', blurb: 'Stack, tape and build, all the way to a castle.', crafts: ['cuptower', 'raft', 'bridge', 'catapult', 'marblerun', 'castle'] },
    { id: 'nature', ico: '🌿', name: 'Nature Explorer', badge: '🧭', c: '#4E7A1E', blurb: 'Leaves, sticks and stones from your walks.', crafts: ['leafprint', 'rockpet', 'mandala', 'storystones', 'dreamcatcher', 'kite'] },
    { id: 'gift', ico: '🎁', name: 'Gift Maker', badge: '💝', c: '#B23A5C', blurb: 'Make presents and cards for the people you love.', crafts: ['stickframe', 'coupons', 'cookieface', 'popcake', 'flowerpot', 'handprint'] },
    { id: 'chef', ico: '🍓', name: 'Little Chef', badge: '👩‍🍳', c: '#B4462B', blurb: 'No-bake kitchen crafts with a grown-up.', crafts: ['fruitface', 'fruitkebab', 'yogurtpaint', 'pastaart', 'snackcar', 'pizzafaces'] },
    { id: 'music', ico: '🎵', name: 'Music Maker', badge: '🎼', c: '#7D3C98', blurb: 'Make instruments, then play a song!', crafts: ['kazoo', 'platetamb', 'drumtub', 'bottlexylo', 'guitarbox', 'panflute'] }
  ];
  const JS = () => { const c = H.CS(); c.jbadges = c.jbadges && typeof c.jbadges === 'object' ? c.jbadges : {}; return c; };
  const jList = j => j.crafts.map(id => H.byId(id)).filter(Boolean);
  function jprog(j, D) {
    const done = D || H.CS().done, L = jList(j), have = L.filter(c => done[c.id]).length;
    return { have, all: L.length, next: L.find(c => !done[c.id]) || null, list: L };
  }
  // Gives the badge once, when every craft of the journey is made. Returns the journeys finished just now.
  function checkBadges() {
    const S = JS(), got = [];
    JOURNEYS.forEach(j => { const p = jprog(j); if (p.all && p.have === p.all && !S.jbadges[j.id]) { S.jbadges[j.id] = today(); got.push(j); } });
    if (got.length) { addStars(5 * got.length); save(); }
    return got;
  }
  // For the progress report: works on any player's saved crafts state, read defensively.
  H.journeyStats = cr => {
    const o = cr && typeof cr === 'object' ? cr : {}, done = o.done && typeof o.done === 'object' ? o.done : {}, jb = o.jbadges && typeof o.jbadges === 'object' ? o.jbadges : {};
    const P = JOURNEYS.map(j => ({ j, p: jprog(j, done) }));
    return { all: JOURNEYS.length, started: P.filter(x => x.p.have > 0).length, done: P.filter(x => x.p.all && x.p.have === x.p.all).length,
      badges: JOURNEYS.filter(j => jb[j.id]).map(j => `${j.badge} ${j.name}`) };
  };
  const bar = (have, all, c) => `<span class="cr-jbar" role="img" aria-label="${have} of ${all} made"><i style="width:${all ? Math.round(have / all * 100) : 0}%;background:${c}"></i></span>`;

  H.onHome = () => {
    const S = JS(), anchor = $('#crPick'); if (!anchor) return;
    anchor.insertAdjacentHTML('afterend', `<div class="panel cr-jrn"><h2>🧭 Craft journeys</h2><p class="note">Six crafts in a row, from easy to expert. Finish a journey to win its badge!</p>
      <div class="cr-jlist">${JOURNEYS.map(j => { const p = jprog(j), b = S.jbadges[j.id];
        return `<button class="cr-jb" data-j="${j.id}" style="--jc:${j.c}" aria-label="${esc(j.name)} journey, ${p.have} of ${p.all} made${b ? ', badge won' : ''}"><span class="cr-jico" aria-hidden="true">${j.ico}</span><span class="cr-jt"><b>${esc(j.name)}</b>${bar(p.have, p.all, j.c)}<small>${p.have} of ${p.all}${b ? ` · ${j.badge} badge!` : ''}</small></span></button>`; }).join('')}</div></div>`);
    view.querySelectorAll('[data-j]').forEach(b => b.onclick = () => go(journeyView, b.dataset.j));
    const wall = view.querySelector('.cr-wall'), won = JOURNEYS.filter(j => S.jbadges[j.id]);
    if (wall && won.length) wall.insertAdjacentHTML('beforeend', `<div class="cr-jwon">${won.map(j => `<span class="cr-jbadge" title="${esc(j.name)}">${j.badge}<small>${esc(j.name)}</small></span>`).join('')}</div>`);
  };
  function journeyView(id) {
    const j = JOURNEYS.find(x => x.id === id) || JOURNEYS[0], got = checkBadges(), S = JS(), p = jprog(j), won = S.jbadges[j.id];
    view.innerHTML = `${crumbs(`${j.ico} ${esc(j.name)}`)}
      <div class="cr-hero" style="border-left:8px solid ${j.c}"><span class="cr-owl" aria-hidden="true">🦉</span><p>${esc(j.blurb)} Make them in order, easy first. ${p.have} of ${p.all} made.</p></div>
      ${bar(p.have, p.all, j.c)}
      <ol class="cr-trail" style="--jc:${j.c}">${p.list.map((c, i) => { const d = H.CS().done[c.id], nx = p.next && p.next.id === c.id, L = H.LEVELS[c.lv - 1];
        return `<li class="${d ? 'done' : nx ? 'next' : 'todo'}"><button class="cr-stop" data-c="${c.id}" aria-label="Stop ${i + 1}: ${esc(c.name)}, ${L.name}${d ? ', made' : nx ? ', next' : ''}"><span class="cr-sn" aria-hidden="true">${d ? '✓' : i + 1}</span><span class="cr-sico" aria-hidden="true">${c.ico}</span><span class="cr-st"><b>${esc(c.name)}</b><small>${L.ico} ${L.name} · ⏱ ${c.min} min</small></span>${nx ? '<span class="cr-snext">Next!</span>' : ''}</button></li>`; }).join('')}
        <li class="${won ? 'done' : 'todo'} cr-goal"><div class="cr-stop cr-goalb" id="crGoal"><span class="cr-sn" aria-hidden="true">${won ? '🏅' : '🔒'}</span><span class="cr-sico" aria-hidden="true">${j.badge}</span><span class="cr-st"><b>${esc(j.name)} badge</b><small>${won ? `Won on ${won}!` : 'Make all 6 to win it'}</small></span></div></li></ol>`;
    wireBack(craftsHome);
    view.querySelectorAll('[data-c]').forEach(b => b.onclick = () => H.open(b.dataset.c, () => journeyView(j.id)));
    if (got.some(x => x.id === j.id)) { confetti(80); yay(); }
    sayScreen(won ? `You finished the ${j.name} journey! You have the badge.` : `${j.name} journey. ${p.have} of ${p.all} made.${p.next ? ` Next: ${p.next.name}.` : ''}`);
  }
  H.onMade = (c, r) => {
    const box = view.querySelector('.cr-win'); if (!box) return;
    const got = checkBadges(), mine = JOURNEYS.filter(j => j.crafts.includes(c.id));
    got.forEach(j => box.insertAdjacentHTML('beforeend', `<div class="cr-jdone" role="status"><span class="cr-jbig" aria-hidden="true">${j.badge}</span><b>Journey done! ${esc(j.name)} badge</b><small>+5 stars</small></div>`));
    mine.filter(j => !got.includes(j)).forEach(j => { const p = jprog(j); if (p.have >= p.all) return;
      box.insertAdjacentHTML('beforeend', `<button class="btn alt cr-jgo" data-jgo="${j.id}">${j.ico} ${esc(j.name)}: ${p.have} of ${p.all}${p.next ? ` · next ${esc(p.next.name)}` : ''}</button>`); });
    box.querySelectorAll('[data-jgo]').forEach(b => b.onclick = () => go(journeyView, b.dataset.jgo));
    if (got.length) { confetti(100); setTimeout(() => say(`Hooray! You finished the ${got.map(j => j.name).join(' and ')} journey and won a badge!`), 50); }
  };

  /* --- printable templates (real size, outline only), in millimeters --- */
  const zig = (x0, x1, y, h, n) => Array.from({ length: n * 2 + 1 }, (_, i) => `${f1(lerp(x0, x1, i / (n * 2)))},${i % 2 ? y : y + h}`).join(' ');
  const dsh = 'stroke-dasharray="3 2"';
  const TPL = {
    heromask: { name: 'Hero eye mask', w: 170, h: 72, svg: `<path d="M8,34 Q12,8 48,8 Q74,8 85,22 Q96,8 122,8 Q158,8 162,34 Q164,58 128,62 Q104,64 85,50 Q66,64 42,62 Q6,58 8,34Z"/><ellipse cx="50" cy="35" rx="19" ry="11"/><ellipse cx="120" cy="35" rx="19" ry="11"/><circle cx="14" cy="35" r="2.5"/><circle cx="156" cy="35" r="2.5"/>` },
    animalmask: { name: 'Cat or tiger mask', w: 180, h: 175, svg: `<path d="M30,60 L22,8 L66,34 Q90,26 114,34 L158,8 L150,60 Q166,90 150,124 Q126,168 90,168 Q54,168 30,124 Q14,90 30,60Z"/><path d="M52,84 Q66,72 78,84 Q66,94 52,84Z"/><path d="M102,84 Q114,72 128,84 Q114,94 102,84Z"/><path d="M82,112 L98,112 L90,122Z" ${dsh}/><circle cx="20" cy="96" r="2.5"/><circle cx="160" cy="96" r="2.5"/>` },
    owlmask: { name: 'Owl mask', w: 180, h: 120, svg: `<path d="M18,40 L10,6 L48,24 Q90,10 132,24 L170,6 L162,40 Q176,84 140,108 Q90,124 40,108 Q4,84 18,40Z"/><circle cx="58" cy="58" r="22"/><circle cx="122" cy="58" r="22"/><circle cx="58" cy="58" r="11"/><circle cx="122" cy="58" r="11"/><path d="M82,74 L98,74 L90,96Z" ${dsh}/><circle cx="16" cy="64" r="2.5"/><circle cx="164" cy="64" r="2.5"/>` },
    crown: { name: 'Crown (2 strips, tape the ends together)', w: 190, h: 140, svg: `<polygon points="5,64 ${zig(5, 175, 6, 22, 6)} 175,64"/><rect x="175" y="28" width="10" height="36" ${dsh}/><polygon points="5,134 ${zig(5, 175, 76, 22, 6)} 175,134"/><rect x="175" y="98" width="10" height="36" ${dsh}/>` },
    popup: { name: 'Pop-up card', w: 180, h: 130, svg: `<rect x="2" y="2" width="176" height="126" rx="2"/><line x1="2" y1="65" x2="178" y2="65" ${dsh}/><line x1="72" y1="47" x2="72" y2="83"/><line x1="108" y1="47" x2="108" y2="83"/><line x1="72" y1="47" x2="108" y2="47" ${dsh}/><line x1="72" y1="83" x2="108" y2="83" ${dsh}/>` },
    popflower: { name: 'Pop-up flower card', w: 180, h: 160, svg: `<rect x="2" y="2" width="176" height="126" rx="2"/><line x1="90" y1="2" x2="90" y2="128" ${dsh}/><path d="M90,132 ${Array.from({ length: 8 }, (_, i) => { const a = (i + 0.5) / 8 * Math.PI * 2; return `Q${f1(90 + 30 * Math.cos(a))},${f1(145 + 13 * Math.sin(a))} ${f1(90 + 14 * Math.cos(a + Math.PI / 8))},${f1(145 + 6 * Math.sin(a + Math.PI / 8))}`; }).join(' ')}"/><line x1="90" y1="132" x2="90" y2="158" ${dsh}/>` },
    popmouth: { name: 'Talking mouth pop-up card', w: 180, h: 130, svg: `<rect x="2" y="2" width="176" height="126" rx="2"/><line x1="90" y1="2" x2="90" y2="128" ${dsh}/><line x1="60" y1="65" x2="90" y2="65"/><line x1="60" y1="65" x2="90" y2="40" ${dsh}/><line x1="60" y1="65" x2="90" y2="90" ${dsh}/><line x1="120" y1="65" x2="90" y2="65"/><line x1="120" y1="65" x2="90" y2="40" ${dsh}/><line x1="120" y1="65" x2="90" y2="90" ${dsh}/>` },
    finger: { name: 'Finger puppets (4)', w: 180, h: 95, svg: [10, 55, 100, 145].map(x => `<path d="M${x},62 L${x},22 Q${x},4 ${x + 14},4 Q${x + 28},4 ${x + 28},22 L${x + 28},62Z"/><rect x="${x}" y="62" width="28" height="28" ${dsh}/><circle cx="${x + 9}" cy="22" r="3"/><circle cx="${x + 19}" cy="22" r="3"/>`).join('') },
    stickpup: { name: 'Stick puppet heads (bear and cat)', w: 180, h: 110, svg: `<circle cx="45" cy="55" r="34"/><circle cx="19" cy="24" r="12"/><circle cx="71" cy="24" r="12"/><ellipse cx="45" cy="66" rx="12" ry="9"/><path d="M110,30 L104,4 L126,20 Q140,16 154,20 L176,4 L170,30 Q182,60 162,80 Q140,96 118,80 Q98,60 110,30Z"/><rect x="40" y="88" width="10" height="20" ${dsh}/><rect x="135" y="88" width="10" height="20" ${dsh}/>` },
    shadow: { name: 'Shadow puppets (bird, rabbit, dragon)', w: 185, h: 160, svg: `<path d="M8,50 Q30,20 50,40 L80,22 L70,48 Q84,58 60,66 Q30,72 8,50Z"/><circle cx="40" cy="44" r="3"/><path d="M110,70 Q100,40 110,6 Q118,30 122,44 Q126,10 136,8 Q134,40 130,52 Q160,56 166,80 Q170,100 140,100 L112,100 Q96,96 110,70Z"/><circle cx="122" cy="60" r="3"/><path d="M10,130 Q30,104 56,112 L70,96 L74,110 Q96,100 120,114 L140,104 L136,118 Q170,118 176,140 Q140,132 120,146 Q80,156 50,146 Q20,150 10,130Z"/><circle cx="34" cy="122" r="3"/><rect x="38" y="70" width="8" height="16" ${dsh}/><rect x="132" y="104" width="8" height="0.1" ${dsh}/>` },
    marionette: { name: 'Puppet on strings (cut 1 head, 1 body, 2 arms, 2 legs)', w: 180, h: 150, svg: `<circle cx="32" cy="30" r="24"/><rect x="66" y="8" width="44" height="60" rx="8"/><rect x="122" y="8" width="16" height="48" rx="6"/><rect x="150" y="8" width="16" height="48" rx="6"/><rect x="10" y="78" width="18" height="60" rx="6"/><rect x="40" y="78" width="18" height="60" rx="6"/>${[[32, 10], [88, 14], [88, 62], [130, 12], [158, 12], [130, 52], [158, 52], [19, 82], [49, 82], [19, 132], [49, 132]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2"/>`).join('')}` },
    kite: { name: 'Diamond kite sail', w: 180, h: 240, svg: `<path d="M90,4 L176,80 L90,236 L4,80Z"/><line x1="90" y1="4" x2="90" y2="236" ${dsh}/><line x1="4" y1="80" x2="176" y2="80" ${dsh}/><circle cx="90" cy="230" r="2.5"/>` },
    fish: { name: 'Fish for the fishing game (6)', w: 180, h: 110, svg: [[30, 25], [90, 25], [150, 25], [30, 80], [90, 80], [150, 80]].map(([x, y]) => `<path d="M${x - 24},${y} Q${x - 4},${y - 18} ${x + 14},${y - 4} L${x + 26},${y - 14} L${x + 26},${y + 14} L${x + 14},${y + 4} Q${x - 4},${y + 18} ${x - 24},${y}Z"/><circle cx="${x - 12}" cy="${y - 3}" r="2"/><rect x="${x - 30}" y="${y - 3}" width="10" height="6" rx="3" ${dsh}/>`).join('') }
  };
  const TPL_FOR = { eyemask: 'heromask', mask: 'animalmask', owlmask: 'owlmask', crown: 'crown', platecrown: 'crown', popup: 'popup', popcake: 'popup', popflower: 'popflower', popdragon: 'popmouth',
    fingerpuppet: 'finger', stickpuppet: 'stickpup', shadowpuppets: 'shadow', shadowtheatre: 'shadow', marionette: 'marionette', kite: 'kite', magnetfish: 'fish' };
  const tplOf = c => c && TPL[c.tpl || TPL_FOR[c.id]] ? (c.tpl || TPL_FOR[c.id]) : '';
  function printTemplate(key) {
    const t = TPL[key]; if (!t) return false;
    let el = document.getElementById('crTplPrint');
    if (!el) { el = document.createElement('div'); el.id = 'crTplPrint'; document.body.appendChild(el); }
    el.innerHTML = `<p class="cr-tpl-h">${esc(t.name)} · real size · cut on the solid lines, fold on the dashed lines</p><svg xmlns="http://www.w3.org/2000/svg" width="${t.w}mm" height="${t.h}mm" viewBox="0 0 ${t.w} ${t.h}" fill="none" stroke="#000" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round">${t.svg}</svg>`;
    document.body.classList.add('cr-printing');
    const off = () => { document.body.classList.remove('cr-printing'); window.removeEventListener('afterprint', off); };
    window.addEventListener('afterprint', off);
    try { window.print(); } catch (e) { off(); }
    return true;
  }

  /* --- the kid-paced player: finished-craft preview, slow motion, "I did this step ✓" with cheers --- */
  const PRAISE = ['Great job!', 'Well done!', 'Super!', 'You did it!', 'Brilliant!', 'Wow, nice work!', 'Fantastic!', 'Yes! Keep going!'];
  H.onView = ({ c, mv, show, setPlay, stopAll }) => {
    const scr = view.querySelector('.cr-screen'), ctrl = view.querySelector('.cr-ctrl'), next = $('#crNext'), movie = $('#crMovie');
    if (!scr || !ctrl || !next) return;
    const S = H.CS(), last = c.steps[c.steps.length - 1], nav = navId, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    mv.rate = S.slow ? 0.5 : 1; mv.did = new Set(); mv.preview = true; mv.pvFrames = 0;
    // controls: slow motion and "see the finished craft"
    ctrl.insertAdjacentHTML('beforeend', `<button class="tool" id="crSlow" aria-pressed="${mv.rate < 1}" aria-label="Slow motion">🐢</button><button class="tool" id="crPvBtn" aria-label="See the finished craft">👀</button>`);
    next.insertAdjacentHTML('beforebegin', `<button class="btn leaf cr-did" id="crDid">✓ I did this step!</button>`);
    next.classList.add('cr-next-alt');
    scr.insertAdjacentHTML('beforeend', `<div class="cr-pv" id="crPv"><svg viewBox="0 0 200 150" id="crPvSvg" role="img" aria-label="The finished ${esc(c.name)}"></svg>
      <p class="cr-pv-t">✨ This is what you will make!</p><button class="btn leaf cr-pv-go" id="crPvGo">▶ Let's start!</button></div><div class="cr-cheer" id="crCheer" aria-live="polite" hidden></div>`);
    const tpl = tplOf(c), need = view.querySelector('.cr-need');
    if (tpl && need) {
      need.insertAdjacentHTML('beforeend', `<div class="cr-tpl"><button class="btn alt" id="crTpl">🖨️ Print template</button><span class="note">Prints the ${esc(TPL[tpl].name.toLowerCase())} shape at real size, outline only. Color it in, then cut it out.</span></div>`);
      $('#crTpl').onclick = () => { say('Printing your template. Ask a grown-up to help.'); printTemplate(tpl); };
    }
    const pv = $('#crPv'), pvSvg = $('#crPvSvg'), t0 = performance.now();
    let pvT = 0, pvLast = t0;
    function pvLoop(now) {
      if (nav !== navId || !pvSvg.isConnected || !mv.preview) return;
      pvT += (now - pvLast) * mv.rate; pvLast = now;
      const d = 4000, u = (pvT % d) / d, e = last.a === 'show' ? 1 : Math.min(1, u / 0.8);
      pvSvg.innerHTML = H.frame(last, e, reduce ? 600 : pvT); mv.pvFrames++;
      if (!reduce) requestAnimationFrame(pvLoop);
    }
    const openPv = () => { mv.preview = true; pv.hidden = false; pvLast = performance.now(); requestAnimationFrame(pvLoop); };
    const closePv = () => { mv.preview = false; pv.hidden = true; };
    $('#crPvGo').onclick = () => { closePv(); setPlay(true); show(0, true); };
    $('#crPvBtn').onclick = e => { e.stopPropagation(); if (mv.preview) closePv(); else { openPv(); say(`This is the ${c.name} you will make!`); } };
    movie.addEventListener('click', e => { if (mv.preview && !pv.contains(e.target) && e.target.id !== 'crPvBtn') closePv(); }, true);
    // slow motion: half speed, keeping the movie where it is
    $('#crSlow').onclick = () => {
      const now = performance.now(), r = mv.rate < 1 ? 1 : 0.5;
      if (mv.playing) { mv.at += (now - mv.start) * (mv.rate || 1); mv.start = now; }
      mv.rate = r; S.slow = r < 1; save();
      $('#crSlow').setAttribute('aria-pressed', r < 1); $('#crSlow').classList.toggle('on', r < 1);
      say(r < 1 ? 'Slow motion. Watch carefully!' : 'Normal speed.');
    };
    $('#crSlow').classList.toggle('on', mv.rate < 1);
    // "I did this step ✓": tick the step, cheer, then on to the next one (or "I made it!" after the last)
    const cheer = $('#crCheer'); let cheerT = 0;
    const sync = () => {
      const lastStep = mv.i === c.steps.length - 1;
      $('#crDid').textContent = mv.did.has(mv.i) ? `✓ Done! ${lastStep ? 'Finish' : 'Next step'}` : lastStep ? '✓ I did the last step!' : '✓ I did this step!';
      view.querySelectorAll('.cr-dot').forEach((b, k) => b.classList.toggle('did', mv.did.has(k)));
    };
    new MutationObserver(sync).observe($('#crBadge'), { childList: true, characterData: true, subtree: true });
    $('#crDid').onclick = () => {
      if (mv.all) stopAll(false);
      const i = mv.i, lastStep = i === c.steps.length - 1, praise = PRAISE[(i + mv.did.size) % PRAISE.length];
      mv.did.add(i); tone([660, 880]);
      cheer.hidden = false; cheer.innerHTML = `<span aria-hidden="true">${['👏', '🌟', '🎉', '💪', '😄'][i % 5]}</span> ${praise}`;
      clearTimeout(cheerT); cheerT = setTimeout(() => { if (cheer.isConnected) cheer.hidden = true; }, 1600);
      if (lastStep) { say(`${praise} You did every step!`); next.click(); return; }
      setPlay(true); show(i + 1, false);
      const s = c.steps[i + 1]; say(`${praise} Now step ${i + 2}. ${s.t}`);
      sync();
    };
    sync();
    // open on the finished craft, playing
    say(`${c.name}! Look, this is what you will make. You need ${c.mat.map(m => m[1]).join(', ')}. ${H.safety(c).length ? 'Ask a grown-up to help. ' : ''}Tap let's start!`);
    openPv();
    if (reduce) pvLoop(performance.now());
  };

  if (window.__crafts) Object.assign(window.__crafts, { JOURNEYS, jprog, checkBadges, journey: id => go(journeyView, id), TPL, TPL_FOR, tplOf, printTemplate, NEW_KINDS, journeyStats: H.journeyStats });
  H.JOURNEYS = JOURNEYS; H.TPL = TPL; H.tplOf = tplOf; H.printTemplate = printTemplate; H.NEW_KINDS = NEW_KINDS;
})();
