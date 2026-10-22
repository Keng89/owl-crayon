/* ---------- brush engine: real-media brushes and papers for the drawing pad ---------- */
// makePad hands each stroke to BRUSHES.engine(cv, wet). Points are queued and painted in requestAnimationFrame with a
// stamp budget per frame, so a fast finger never makes the pad lag. "Layer" brushes (marker, watercolor) paint into the
// see-through `wet` canvas on top and are pressed into the drawing when the stroke ends (watercolor first spreads a
// little, then dries with darker edges and paper grain). Everything lands in the one drawing canvas, so undo, clear,
// eraser, mirror and save work the same for every brush.
const BRUSHES = (() => {
  const LIST = [
    { id: 'round', ico: '🖊️', name: 'Smooth pen', tip: 'Smooth, even lines. Great for outlines.' },
    { id: 'pencil', ico: '✏️', name: 'Pencil', tip: 'Go slow for dark lines and fast for light ones. Perfect for sketching!' },
    { id: 'crayon', ico: '🖍️', name: 'Crayon', tip: 'Waxy and bumpy, like a real crayon. Color over it again to fill the little gaps.' },
    { id: 'marker', ico: '🖋️', name: 'Marker', tip: 'See-through ink. Where two lines cross, the color gets darker.' },
    { id: 'watercolor', ico: '💧', name: 'Watercolor', tip: 'Soft, wet paint. Paint next to wet paint and the colors run together!' },
    { id: 'oil', ico: '🖌️', name: 'Thick paint', tip: 'Thick, bumpy paint that mixes with the colors under it. Try little dabs!' },
    { id: 'chalk', ico: '🌫️', name: 'Chalk', tip: 'Dusty and soft. It looks amazing on black paper!' },
    { id: 'spray', ico: '💨', name: 'Spray can', tip: 'Hold still to spray more paint. Move fast for a light mist.' },
    { id: 'ink', ico: '✒️', name: 'Ink pen', tip: 'A flat pen nib. Lines going one way are thick, the other way thin. Try loops!' },
    { id: 'glitter', ico: '✨', name: 'Glitter', tip: 'Sparkly glitter in your color.' },
    { id: 'smudge', ico: '👆', name: 'Smudge', tip: 'Rub your finger over the paint to blend and smear the colors.' },
    { id: 'rainbow', ico: '🌈', name: 'Rainbow', tip: 'The color changes as you draw. Make a long swirl!' },
    { id: 'stamps', ico: '⭐', name: 'Stamps', tip: 'Tap to stamp. Pick a shape. The size buttons make it bigger or smaller.' }
  ];
  const STAMPS = [['star', '⭐', 'Star'], ['heart', '❤️', 'Heart'], ['leaf', '🍃', 'Leaf'], ['flower', '🌸', 'Flower'], ['paw', '🐾', 'Paw']];
  const PAPERS = [
    { id: 'plain', ico: '⬜', name: 'Plain paper', base: '#FFFFFF' },
    { id: 'wc', ico: '🧻', name: 'Watercolor paper', base: '#FFFDF7' },
    { id: 'canvas', ico: '🧵', name: 'Canvas', base: '#FAF5EA' },
    { id: 'black', ico: '⬛', name: 'Black paper', base: '#1F2027' }
  ];
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const hex = c => { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  // f > 0 lightens toward white, f < 0 darkens toward black.
  const shade = (rgb, f) => `rgb(${rgb.map(v => Math.round(f >= 0 ? v + (255 - v) * f : v * (1 + f))).join(',')})`;
  const mk = (w, h = w) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const dprOf = () => window.devicePixelRatio || 1;

  /* ---- textures, made once in code (no image files) ---- */
  // Tileable value noise: smooth bumps every `cell` pixels on an n × n tile.
  function vnoise(n, cell) {
    const m = Math.max(1, Math.round(n / cell)), g = Float32Array.from({ length: m * m }, Math.random), sm = t => t * t * (3 - 2 * t);
    const G = (i, j) => g[((j % m) + m) % m * m + ((i % m) + m) % m];
    return (x, y) => { const fx = x / (n / m), fy = y / (n / m), x0 = Math.floor(fx), y0 = Math.floor(fy), tx = sm(fx - x0), ty = sm(fy - y0);
      const a = G(x0, y0) + (G(x0 + 1, y0) - G(x0, y0)) * tx, b = G(x0, y0 + 1) + (G(x0 + 1, y0 + 1) - G(x0, y0 + 1)) * tx; return a + (b - a) * ty; };
  }
  // A white tile whose alpha is f(x, y) in 0..1.
  function alphaTile(n, f, rgb = [255, 255, 255]) {
    const c = mk(n), x = c.getContext('2d'), im = x.createImageData(n, n), d = im.data;
    for (let y = 0; y < n; y++) for (let X = 0; X < n; X++) { const i = (y * n + X) * 4; d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2]; d[i + 3] = clamp(f(X, y), 0, 1) * 255; }
    x.putImageData(im, 0, 0); return c;
  }
  const GRAIN = {};
  function grainTile(kind) {
    if (GRAIN[kind]) return GRAIN[kind];
    const n = 128, a = vnoise(n, 3), b = vnoise(n, 9), c = vnoise(n, 24), r = Math.random;
    const f = {
      // paper tooth: mostly covered, speckled
      pencil: (x, y) => { const v = 0.45 * a(x, y) + 0.2 * b(x, y) + 0.35 * r(); return v > 0.3 ? 0.6 + 0.4 * (v - 0.3) / 0.7 : v * 0.7; },
      // wax skips the low spots: real gaps
      crayon: (x, y) => { const v = 0.45 * a(x, y) + 0.3 * b(x, y) + 0.25 * r(); return v > 0.43 ? 0.8 + (v - 0.43) : 0; },
      // powder: patchy, soft, broken
      chalk: (x, y) => { const v = 0.35 * a(x, y) + 0.3 * c(x, y) + 0.35 * r(); return v > 0.46 ? 0.45 + (v - 0.46) * 1.6 : 0; },
      // granulation for watercolor: holes taken out of the wash
      gran: (x, y) => { const v = 0.6 * a(x, y) + 0.4 * r(); return v > 0.6 ? (v - 0.6) * 2.5 : 0; },
      // uneven pigment in a wash: big soft patches
      mottle: (x, y) => Math.max(0, c(x, y) * 1.3 - 0.35)
    }[kind];
    return (GRAIN[kind] = alphaTile(n, f));
  }
  // A grain tile filled with a color, as a pattern for one canvas context. Grain is fixed to the paper, like real paper tooth.
  const patCache = new WeakMap();
  function grainPat(c, kind, color) {
    let m = patCache.get(c); if (!m) patCache.set(c, m = new Map());
    const key = kind + color; let p = m.get(key);
    if (!p) {
      const t = grainTile(kind), cc = mk(t.width), x = cc.getContext('2d');
      x.drawImage(t, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, cc.width, cc.width);
      p = c.createPattern(cc, 'repeat');
      const d = dprOf(), s = Math.min(d, 2) / d; // about 1 grain dot per CSS pixel, 2 device pixels at most
      try { p.setTransform(new DOMMatrix([s, 0, 0, s, 0, 0])); } catch (e) {}
      if (m.size > 40) m.clear(); m.set(key, p);
    }
    return p;
  }
  // Soft round mask (smudge) and an irregular soft blob (watercolor), white, 64px.
  let softMask = null, blobs = null;
  function getSoft() {
    if (softMask) return softMask;
    return (softMask = alphaTile(64, (x, y) => { const d = Math.hypot(x - 31.5, y - 31.5) / 32; return d >= 1 ? 0 : Math.pow(1 - d * d, 1.6); }));
  }
  function getBlobs() {
    if (blobs) return blobs;
    blobs = [0, 1, 2].map(() => { const nz = vnoise(64, 11);
      return alphaTile(64, (x, y) => { const d = Math.hypot(x - 31.5, y - 31.5) / 32 + (nz(x, y) - 0.5) * 0.3; return d >= 0.86 ? 0 : d < 0.76 ? 0.95 : 0.95 * (0.86 - d) / 0.1; }); });
    return blobs;
  }
  const tintCache = new Map();
  function tinted(img, color, tag) {
    const key = tag + color; let t = tintCache.get(key);
    if (!t) { t = mk(img.width, img.height); const x = t.getContext('2d'); x.drawImage(img, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, t.width, t.height); if (tintCache.size > 60) tintCache.clear(); tintCache.set(key, t); }
    return t;
  }
  // Paper textures: a tile drawn under the drawing (CSS background on screen, painted in when saving).
  const paperTiles = {};
  function paperTile(id) {
    if (id === 'plain') return null;
    if (paperTiles[id]) return paperTiles[id];
    const n = 128, a = vnoise(n, 6), b = vnoise(n, 18), r = Math.random;
    const t = id === 'wc' ? alphaTile(n, (x, y) => 0.025 + 0.11 * Math.max(0, a(x, y) * 0.6 + b(x, y) * 0.4 - 0.35) + 0.02 * r(), [120, 110, 95])
      : id === 'canvas' ? alphaTile(n, (x, y) => { const cx = Math.floor(x / 4), cy = Math.floor(y / 4), v = (cx + cy) % 2 ? Math.cos(2 * Math.PI * y / 4) : Math.cos(2 * Math.PI * x / 4); return 0.05 + 0.05 * v + 0.04 * a(x, y) + 0.025 * r(); }, [110, 90, 60])
      : alphaTile(n, (x, y) => 0.02 + 0.03 * a(x, y) + 0.025 * r(), [255, 255, 255]);
    return (paperTiles[id] = { tile: t, url: t.toDataURL() });
  }
  const paperOf = id => PAPERS.find(p => p.id === id) || PAPERS[0];
  function paperCSS(el, id) {
    const p = paperOf(id), t = paperTile(p.id);
    el.style.background = t ? `url(${t.url}) 0 0 / 128px 128px, ${p.base}` : '';
    el.classList.toggle('dark-paper', p.id === 'black');
  }
  function paperFill(c, id, w, h) {
    const p = paperOf(id), t = paperTile(p.id);
    c.fillStyle = p.base; c.fillRect(0, 0, w, h);
    if (t) { c.fillStyle = c.createPattern(t.tile, 'repeat'); c.fillRect(0, 0, w, h); }
  }

  /* ---- stamp shapes, in a box from -1 to 1 ---- */
  const starPath = (() => { const p = new Path2D(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, r = i % 2 ? 0.45 : 1; i ? p.lineTo(r * Math.cos(a), r * Math.sin(a)) : p.moveTo(r * Math.cos(a), r * Math.sin(a)); } p.closePath(); return p; })();
  const SHAPES = {
    star: c => { c.fill(starPath); c.stroke(starPath); },
    heart: c => { const p = new Path2D('M0 0.9 C-0.5 0.5 -1.05 0.1 -1 -0.4 C-0.95 -0.95 -0.25 -1 0 -0.5 C0.25 -1 0.95 -0.95 1 -0.4 C1.05 0.1 0.5 0.5 0 0.9Z'); c.fill(p); c.stroke(p); },
    leaf: c => { const p = new Path2D('M0 1 C-0.85 0.45 -0.7 -0.55 0 -1 C0.7 -0.55 0.85 0.45 0 1Z'); c.fill(p); c.stroke(p); c.beginPath(); c.moveTo(0, 1.15); c.lineTo(0, -0.7); for (const y of [0.45, 0, -0.4]) { c.moveTo(0, y); c.lineTo(-0.4, y - 0.3); c.moveTo(0, y); c.lineTo(0.4, y - 0.3); } c.stroke(); },
    flower: (c, rgb) => { for (let i = 0; i < 5; i++) { const a = i * 2 * Math.PI / 5 - Math.PI / 2; c.beginPath(); c.arc(0.55 * Math.cos(a), 0.55 * Math.sin(a), 0.42, 0, 7); c.fill(); c.stroke(); }
      c.fillStyle = rgb[0] > 200 && rgb[1] > 150 ? '#F2604F' : '#FFC23D'; c.beginPath(); c.arc(0, 0, 0.3, 0, 7); c.fill(); c.stroke(); },
    paw: c => { c.beginPath(); c.ellipse(0, 0.35, 0.48, 0.4, 0, 0, 7); c.fill(); c.stroke(); for (const [x, y, r] of [[-0.62, -0.18, 0.21], [-0.24, -0.6, 0.22], [0.24, -0.6, 0.22], [0.62, -0.18, 0.21]]) { c.beginPath(); c.ellipse(x, y, r, r * 1.2, 0, 0, 7); c.fill(); c.stroke(); } }
  };

  /* ---- helpers for brushes ---- */
  // Walks from a to b putting a stamp every `sp` pixels (carrying the leftover between segments). Returns stamps made.
  function walk(s, a, b, sp, f) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy); let t, n = 0;
    if (s.rem == null) { f(a[0], a[1]); n++; t = sp; } else t = s.rem;
    while (t <= L) { f(a[0] + dx * t / L, a[1] + dy * t / L); n++; t += sp; }
    s.rem = t - L; return n;
  }
  const line = (c, a, b) => { c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); };
  // Copies a soft round patch of the drawing at (ax, ay) and lays it down at (bx, by): smudging, and paint picking up color.
  let patch = null;
  function smear(c, src, ax, ay, bx, by, r, alpha) {
    const d = dprOf(), R = Math.max(2, Math.ceil(r * d)), S = 2 * R, T = Math.min(S, 96); // a smear is soft anyway: carry it at low resolution
    if (!patch) patch = mk(96);
    const x = patch.getContext('2d');
    x.globalCompositeOperation = 'copy'; x.clearRect(0, 0, T, T);
    x.drawImage(src, Math.round(ax * d) - R, Math.round(ay * d) - R, S, S, 0, 0, T, T);
    x.globalCompositeOperation = 'destination-in'; x.drawImage(getSoft(), 0, 0, T, T);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = alpha; c.drawImage(patch, 0, 0, T, T, Math.round(bx * d) - R, Math.round(by * d) - R, S, S); c.restore();
  }
  const pressure = P => clamp(1.25 - P.v * 0.32, 0.5, 1.25);

  /* ---- the brushes ---- */
  // Each: begin(c, s, P) once per mirror copy, seg(c, s, a, b, P) for each move (returns how many stamps it drew).
  // s is that copy's own state (s.xf = {m: mirrored, a: turn angle}); P is shared: color, rgb, size, v (speed px/ms).
  const B = {};
  B.round = { seg(c, s, a, b, P) { c.strokeStyle = P.color; c.lineWidth = P.size; c.lineCap = c.lineJoin = 'round'; line(c, a, b); return 1; } };
  B.eraser = { seg(c, s, a, b, P) { c.save(); c.globalCompositeOperation = 'destination-out'; c.lineWidth = P.size * 2; c.lineCap = 'round'; line(c, a, b); c.restore(); return 1; } };
  B.pencil = { seg(c, s, a, b, P) {
    const pr = pressure(P), w = Math.max(1.2, P.size * 0.3) * (0.6 + 0.4 * pr);
    c.save(); c.lineCap = c.lineJoin = 'round'; c.strokeStyle = grainPat(c, 'pencil', P.color);
    c.globalAlpha = clamp(0.45 + 0.45 * pr, 0.4, 0.95); c.lineWidth = w; line(c, a, b);
    c.globalAlpha *= 0.5; c.lineWidth = Math.max(0.8, w * 0.45); line(c, a, b);
    c.restore(); return 2;
  } };
  B.crayon = { seg(c, s, a, b, P) {
    const w = Math.max(5, P.size * 1.05), dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = grainPat(c, 'crayon', P.color);
    c.lineWidth = w * 0.8; line(c, a, b);
    c.lineWidth = w * 0.3; c.globalAlpha = 0.75;
    for (const k of [-0.36, 0.36]) { const j = k * w + (Math.random() - 0.5) * 1.5; line(c, [a[0] + nx * j, a[1] + ny * j], [b[0] + nx * j, b[1] + ny * j]); }
    c.restore(); return 3;
  } };
  B.chalk = { seg(c, s, a, b, P) {
    const w = Math.max(5, P.size * 1.2 + 2), dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    c.save(); c.lineCap = 'round'; c.strokeStyle = grainPat(c, 'chalk', P.color);
    c.globalAlpha = 0.9; c.lineWidth = w * 0.75; line(c, a, b);
    c.globalAlpha = 0.55; c.lineWidth = w * 0.35;
    for (const k of [-0.4, 0.4]) { const j = k * w + (Math.random() - 0.5) * 2.5; line(c, [a[0] + nx * j, a[1] + ny * j], [b[0] + nx * j, b[1] + ny * j]); }
    // loose dust beside the stroke
    c.fillStyle = P.color; c.globalAlpha = 0.35; const n = 1 + Math.min(6, L / 4 | 0);
    for (let i = 0; i < n; i++) { const t = Math.random(), o = (Math.random() - 0.5) * w * 1.5, z = 0.6 + Math.random() * 1.4; c.fillRect(a[0] + dx * t + nx * o, a[1] + dy * t + ny * o, z, z); }
    c.restore(); return 4;
  } };
  B.marker = { layer: { alpha: 0.72, blend: 'multiply', edge: 0.22, edgeW: 1.4 },
    seg(c, s, a, b, P) { c.strokeStyle = P.color; c.lineWidth = Math.max(3, P.size * 1.25); c.lineCap = c.lineJoin = 'round'; line(c, a, b); return 1; } };
  B.watercolor = { layer: { alpha: 0.5, blend: 'multiply', edge: 0.75, gran: 0.3, mottle: 0.3, bloom: true },
    begin(c, s, P) { s.rem = null; },
    seg(c, s, a, b, P) {
      const r = P.size * 0.95 + 3, bl = getBlobs(), E = P.eng;
      return walk(s, a, b, Math.max(1.5, r * 0.32), (x, y) => {
        // Painting into paint that is still wet from an earlier stroke: the new color runs and spreads.
        // On dry paper the edge is crisp and wobbly; in wet paint it is feathery and runs further.
        const wetHere = E.wetAt(x, y), rr = wetHere ? r * (1.4 + Math.random() * 0.4) : r * (0.95 + Math.random() * 0.12);
        const img = wetHere ? tinted(getSoft(), P.color, 's') : tinted(bl[(Math.random() * 3) | 0], P.color, 'b');
        c.save(); c.translate(x + (wetHere ? (Math.random() - 0.5) * r * 0.5 : 0), y + (wetHere ? (Math.random() - 0.5) * r * 0.5 : 0)); c.rotate(Math.random() * 6.28);
        c.globalAlpha = wetHere ? 0.55 : 0.9; c.drawImage(img, -rr, -rr, 2 * rr, 2 * rr); c.restore();
        E.markWet(x, y, r);
        if (P.marks.length < 360) P.marks.push([x, y, r]); else if (Math.random() < 0.2) P.marks[(Math.random() * 360) | 0] = [x, y, r];
      });
    } };
  B.oil = {
    begin(c, s, P) {
      const N = clamp(Math.round(P.size * 0.6) + 6, 7, 22);
      s.br = Array.from({ length: N }, (_, i) => ({ o: (i + Math.random() * 0.6 - 0.3) / (N - 1) - 0.5, k: 0.6 + Math.random() * 0.6, sh: (Math.random() - 0.5) * 0.7, dry: Math.random() }));
      s.vx = s.vy = 0; s.d = 0; s.rem = null;
    },
    seg(c, s, a, b, P) {
      const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), w = P.size * 1.1 + 6;
      if (L < 0.01 && s.d > 0) return 0;
      if (L) { s.vx = dx / L; s.vy = dy / L; }
      const m = Math.hypot(s.vx, s.vy), nx = m ? -s.vy / m : 0.7, ny = m ? s.vx / m : 0.7; // across the brush
      s.d += L; const load = Math.max(0.3, 1 - s.d / 1200), N = s.br.length;
      // The brush picks up the paint it runs into (a peek at one pixel just ahead, every few pixels or a few times a second) and the
      // colors mix on the brush; fresh paint from inside the brush slowly comes back.
      const now = performance.now();
      P.pickD = (P.pickD || 0) + L;
      if (L > 0.5 && (now - (P.pickT || 0) > 45 || P.pickD > w * 0.4)) {
        P.pickT = now; P.pickD = 0; const d = dprOf();
        try { const q = c.getImageData(Math.round((b[0] + dx / L * w * 0.35) * d), Math.round((b[1] + dy / L * w * 0.35) * d), 1, 1).data;
          if (q[3] > 60) { const k = 0.22 * q[3] / 255; P.mix = P.mix.map((v, i) => v * (1 - k) + q[i] * k); } } catch (e) {}
      }
      if (!P.mix) P.mix = P.rgb.slice();
      P.mix = P.mix.map((v, i) => v + (P.rgb[i] - v) * Math.min(0.2, L * 0.006));
      const base = `rgb(${P.mix.map(Math.round).join(',')})`, mixed = P.mix;
      c.save();
      // the first touch leaves a blob of paint
      if (s.d === L) { c.globalAlpha = 0.9; c.fillStyle = base; c.beginPath(); c.arc(a[0], a[1], w * 0.42, 0, 7); c.fill(); }
      // bristle streaks: every hair leaves its own line of a slightly different shade; a drying brush skips
      const cols = s.br.map(r => shade(mixed, r.sh)); let n = 0;
      if (s.nx == null) { s.nx = nx; s.ny = ny; }
      walk(s, a, b, 1.5, (x, y) => {
        // the brush turns smoothly round corners
        s.nx += (nx - s.nx) * 0.25; s.ny += (ny - s.ny) * 0.25; const nl = Math.hypot(s.nx, s.ny) || 1; s.nx /= nl; s.ny /= nl;
        for (let i = 0; i < N; i++) { const r = s.br[i]; if (r.dry > load + 0.5) continue; const o = r.o * w * 0.9, z = Math.max(1.4, w / N * 2.1 * r.k);
          c.fillStyle = cols[i]; c.globalAlpha = 0.9; c.fillRect(x + s.nx * o - z / 2, y + s.ny * o - z / 2, z, z); }
        n++;
      });
      c.restore(); return 3 + n * (N >> 2);
    } };
  B.spray = {
    emit(c, x, y, P, n) {
      const R = P.size * 1.7 + 8; c.save(); c.fillStyle = P.color; c.globalAlpha = 0.6; c.beginPath();
      for (let i = 0; i < n; i++) { const g = (Math.random() + Math.random() + Math.random()) / 3, t = Math.random() * 6.283, rr = Math.abs(g - 0.5) * 2 * R, z = 0.6 + Math.random() * 1.1; c.rect(x + Math.cos(t) * rr, y + Math.sin(t) * rr, z, z); }
      c.fill(); c.restore(); return Math.ceil(n / 25);
    },
    seg(c, s, a, b, P) { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); return walk(s, a, b, 4, (x, y) => this.emit(c, x, y, P, 4 + P.size * 0.6)) + (L ? 0 : this.emit(c, a[0], a[1], P, 10 + P.size)); },
    hold(c, s, P, dt) { return this.emit(c, s.p[0], s.p[1], P, Math.min(80, dt * (0.15 + P.size * 0.02))); } };
  B.ink = { seg(c, s, a, b, P) {
    const th = s.xf.m ? Math.PI + Math.PI / 4 : -Math.PI / 4 + s.xf.a, h = (P.size * 0.95 + 2) / 2, nx = Math.cos(th) * h, ny = Math.sin(th) * h;
    c.save(); c.fillStyle = P.color; c.strokeStyle = P.color; c.globalAlpha = 0.96; c.lineWidth = 1.1; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(a[0] + nx, a[1] + ny); c.lineTo(b[0] + nx, b[1] + ny); c.lineTo(b[0] - nx, b[1] - ny); c.lineTo(a[0] - nx, a[1] - ny); c.closePath(); c.fill(); c.stroke();
    c.restore(); return 1;
  } };
  B.glitter = { seg(c, s, a, b, P) {
    const R = P.size * 0.8 + 4, cols = [shade(P.rgb, 0.6), shade(P.rgb, 0.3), P.color, P.color, shade(P.rgb, -0.4), '#FFFFFF', '#FFE07A'];
    return walk(s, a, b, Math.max(2, R * 0.3), (x, y) => {
      c.save(); const n = 7 + (P.size / 2 | 0);
      // glitter flakes: little squares and diamonds catching the light
      for (let i = 0; i < n; i++) { const t = Math.random() * 6.283, rr = Math.pow(Math.random(), 0.7) * R, z = 1.2 + Math.random() * 2.2; c.globalAlpha = 0.75 + Math.random() * 0.25; c.fillStyle = cols[(Math.random() * cols.length) | 0];
        const fx = x + Math.cos(t) * rr, fy = y + Math.sin(t) * rr; if (i & 1) c.fillRect(fx - z / 2, fy - z / 2, z, z); else { c.beginPath(); c.moveTo(fx, fy - z * 0.7); c.lineTo(fx + z * 0.7, fy); c.lineTo(fx, fy + z * 0.7); c.lineTo(fx - z * 0.7, fy); c.fill(); } }
      if (Math.random() < 0.22) { // a twinkle
        const sx = x + (Math.random() - 0.5) * R, sy = y + (Math.random() - 0.5) * R, k = 2.5 + Math.random() * R * 0.4;
        c.globalAlpha = 0.95; c.strokeStyle = '#fff'; c.lineWidth = 1.2; c.lineCap = 'round';
        c.beginPath(); c.moveTo(sx - k, sy); c.lineTo(sx + k, sy); c.moveTo(sx, sy - k); c.lineTo(sx, sy + k); c.stroke();
        c.fillStyle = '#fff'; c.beginPath(); c.arc(sx, sy, 1.4, 0, 7); c.fill();
      }
      c.restore();
    });
  } };
  B.smudge = { begin(c, s) { s.rem = null; s.q = null; },
    seg(c, s, a, b, P) {
      const r = P.size * 0.9 + 8; if (!P.src) return 0;
      return 12 * walk(s, a, b, Math.max(1.5, r * 0.22), (x, y) => { if (s.q) smear(c, P.src, s.q[0], s.q[1], x, y, r, 0.85); s.q = [x, y]; });
    } };
  B.rainbow = { begin(c, s, P) { s.h = P.hue; },
    // Each piece is drawn on from the point before, with a round join and flat ends, so no bead marks show between colors.
    seg(c, s, a, b, P) {
      c.strokeStyle = `hsl(${s.h | 0},90%,56%)`; c.lineWidth = P.size; c.lineJoin = 'round'; c.lineCap = s.pp ? 'butt' : 'round';
      c.beginPath(); if (s.pp) c.moveTo(s.pp[0], s.pp[1]); else c.moveTo(a[0], a[1]); c.lineTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L > 0.5) s.pp = a; s.h = (s.h + L * 1.1) % 360; return 1;
    } };
  B.stamps = {
    put(c, s, x, y, P) {
      const R = P.size * 1.3 + 8, f = SHAPES[P.stamp] || SHAPES.star;
      c.save(); c.translate(x, y); c.rotate(P.tilt + s.xf.a * (s.xf.m ? -1 : 1)); c.scale(s.xf.m ? -R : R, R);
      c.fillStyle = P.color; c.strokeStyle = shade(P.rgb, P.rgb.every(v => v < 60) ? 0.4 : -0.35); c.lineWidth = 0.08; c.lineJoin = c.lineCap = 'round';
      f(c, P.rgb); c.restore(); s.last = [x, y]; return 4;
    },
    begin(c, s, P) { this.put(c, s, s.p[0], s.p[1], P); },
    seg(c, s, a, b, P) { const R = P.size * 1.3 + 8; return Math.hypot(b[0] - s.last[0], b[1] - s.last[1]) >= R * 2.3 ? this.put(c, s, b[0], b[1], P) : 0; } };

  /* ---- the engine one pad uses ---- */
  function engine(cv, wet) {
    const ctx = cv.getContext('2d'), wx = wet.getContext('2d');
    let brush = 'round', stamp = 'star', cur = null, P = null, S = [], q = [], raf = 0, drawing = false, bloom = null, lastT = 0, strokeId = 0, ring = null;
    const wetGrid = new Map(), CELL = 14;
    const E = {
      wetAt(x, y) { const v = wetGrid.get(((x / CELL) | 0) + ',' + ((y / CELL) | 0)); return !!v && v.id !== strokeId && performance.now() - v.t < 7000; },
      markWet(x, y, r) { const t = performance.now(); for (let i = ((x - r * 0.5) / CELL) | 0; i <= ((x + r * 0.5) / CELL | 0); i++) for (let j = ((y - r * 0.5) / CELL) | 0; j <= ((y + r * 0.5) / CELL | 0); j++) wetGrid.set(i + ',' + j, { t, id: strokeId }); if (wetGrid.size > 6000) wetGrid.clear(); }
    };
    const loop = () => { raf = 0; frame(); if (drawing || q.length || bloom) raf = requestAnimationFrame(loop); };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    function run(it) {
      let n = 0;
      if (P.last) { const L = Math.hypot(it.pts[0][0] - P.last[0], it.pts[0][1] - P.last[1]), dt = Math.max(1, it.t - P.lt); P.v = P.v * 0.7 + (L / dt) * 0.3; }
      P.last = it.pts[0]; P.lt = it.t;
      const c = cur.layer ? wx : ctx; if (cur.layer) grow(it.pts);
      for (let k = 0; k < S.length && k < it.pts.length; k++) { n += cur.seg(c, S[k], S[k].p, it.pts[k], P); S[k].p = it.pts[k]; }
      return n;
    }
    function frame(unlimited) {
      let budget = unlimited ? Infinity : 700, did = false;
      while (q.length && budget > 0) { budget -= run(q.shift()) + 1; did = true; }
      const now = performance.now();
      if (drawing && cur && cur.hold && !did && !unlimited) { const c = cur.layer ? wx : ctx, dt = Math.min(50, now - lastT); for (const s of S) cur.hold(c, s, P, dt); }
      lastT = now;
      if (bloom && !unlimited) { bloomStep(); if (++bloom.f >= bloom.n) commit(); }
    }
    // Watercolor spreading after the stroke: soft rings grow out from the painted spots, then it dries.
    function bloomStep() {
      const m = P.marks; if (!m.length) return; const k = bloom.f / bloom.n, img = getBlobs();
      wx.save(); wx.globalAlpha = 0.1;
      for (let i = 0; i < Math.min(22, m.length); i++) { const [x, y, r] = m[(Math.random() * m.length) | 0], rr = r * (1.02 + 0.14 * k); wx.translate(x, y); wx.rotate(Math.random() * 6.28); wx.drawImage(tinted(img[i % 3], P.color, 'b'), -rr, -rr, 2 * rr, 2 * rr); wx.setTransform(dprOf(), 0, 0, dprOf(), 0, 0); }
      wx.restore();
    }
    // Grow the box the stroke covers (CSS px), so drying only touches that part of the page.
    function grow(pts) { const m = P.size * 2.4 + 16, bb = P.bb; for (const [x, y] of pts) { if (x - m < bb[0]) bb[0] = x - m; if (y - m < bb[1]) bb[1] = y - m; if (x + m > bb[2]) bb[2] = x + m; if (y + m > bb[3]) bb[3] = y + m; } }
    function commit() {
      const L = cur && cur.layer; bloom = null; if (!L) return;
      const d = dprOf(), W = wet.width, H = wet.height, bb = P.bb;
      const x0 = clamp(Math.floor(bb[0] * d), 0, W), y0 = clamp(Math.floor(bb[1] * d), 0, H), w = clamp(Math.ceil(bb[2] * d), 0, W) - x0, h = clamp(Math.ceil(bb[3] * d), 0, H) - y0;
      if (w > 0 && h > 0) {
        wx.save(); wx.setTransform(d, 0, 0, d, 0, 0);
        // patchy pigment, and grains of pigment settling darker in the paper's dips
        if (L.mottle) { wx.globalCompositeOperation = 'destination-out'; wx.globalAlpha = L.mottle; wx.fillStyle = grainPat(wx, 'mottle', '#000'); wx.fillRect(x0 / d, y0 / d, w / d, h / d); }
        if (L.gran) { wx.globalCompositeOperation = 'source-atop'; wx.globalAlpha = L.gran; wx.fillStyle = grainPat(wx, 'gran', '#000'); wx.fillRect(x0 / d, y0 / d, w / d, h / d); }
        wx.restore();
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = L.blend || 'source-over'; ctx.globalAlpha = L.alpha; ctx.drawImage(wet, x0, y0, w, h, x0, y0, w, h);
        if (L.edge) { // the paint pools at the edge as it dries: a darker rim
          if (!ring || ring.width < w || ring.height < h) ring = mk(Math.max(w, ring ? ring.width : 0), Math.max(h, ring ? ring.height : 0));
          const rx = ring.getContext('2d'), o = Math.max(1.5, (L.edgeW || Math.min(3.5, P.size * 0.18 + 1)) * d);
          rx.globalCompositeOperation = 'copy'; rx.globalAlpha = 1; rx.drawImage(wet, x0, y0, w, h, 0, 0, w, h); rx.globalCompositeOperation = 'destination-out';
          for (let i = 0; i < 8; i++) { const t = i * Math.PI / 4; rx.drawImage(wet, x0, y0, w, h, Math.cos(t) * o, Math.sin(t) * o, w, h); }
          ctx.globalAlpha = L.edge; ctx.drawImage(ring, 0, 0, w, h, x0, y0, w, h);
        }
        ctx.restore();
      }
      wx.save(); wx.setTransform(1, 0, 0, 1, 0, 0); wx.clearRect(0, 0, W, H); wx.restore();
      wet.style.opacity = 0;
    }
    return Object.assign(E, {
      getBrush: () => brush, setBrush(v) { brush = B[v] && v !== 'eraser' ? v : 'round'; },
      getStamp: () => stamp, setStamp(v) { stamp = SHAPES[v] ? v : 'star'; },
      busy: () => !!(drawing || q.length || bloom),
      // Start a stroke: pts = the point and its mirror copies, xf = how each copy is turned or flipped.
      down(pts, xf, { color, size, eraser }) {
        this.settle(); strokeId++;
        cur = eraser ? B.eraser : B[brush];
        P = { color, rgb: hex(color), size, v: 0.3, eng: E, marks: [], stamp, tilt: (Math.random() - 0.5) * 0.5, hue: Math.random() * 360, src: cur === B.smudge ? cv : null, mix: null, bb: [1e9, 1e9, -1e9, -1e9] };
        S = pts.map((p, k) => ({ p, xf: xf[k] || { m: 0, a: 0 } }));
        const c = cur.layer ? wx : ctx; if (cur.layer) grow(pts);
        if (cur.layer) { wet.style.opacity = cur.layer.alpha; wet.style.mixBlendMode = cur.layer.blend || 'normal'; }
        drawing = true; lastT = performance.now(); q = [];
        for (const s of S) { if (cur.begin) cur.begin(c, s, P); }
        if (cur !== B.smudge && cur !== B.stamps) for (const s of S) cur.seg(c, s, s.p, s.p, P); // a tap leaves a dot
        P.last = pts[0]; P.lt = lastT; kick();
      },
      move(pts) { if (drawing) { q.push({ pts, t: performance.now() }); kick(); } },
      up() {
        if (!drawing) return; frame(true); drawing = false;
        if (cur.layer && cur.layer.bloom && P.marks.length) { bloom = { f: 0, n: 16 }; kick(); } else commit();
      },
      // Finish everything now (before a new stroke, undo snapshot, save or resize).
      settle() { if (drawing) { frame(true); drawing = false; } if (bloom) { while (bloom.f < bloom.n) { bloomStep(); bloom.f++; } } if (cur && cur.layer) commit(); cur = null; },
      // Throw away the stroke in progress (undo or clear).
      cancel() { q = []; drawing = false; bloom = null; cur = null; wx.save(); wx.setTransform(1, 0, 0, 1, 0, 0); wx.clearRect(0, 0, wet.width, wet.height); wx.restore(); wet.style.opacity = 0; wetGrid.clear(); }
    });
  }
  return { LIST, STAMPS, PAPERS, get: id => LIST.find(b => b.id === id), engine, paperCSS, paperFill, paperOf };
})();

/* ---- 🎨 Paint like a pro: brush technique lessons (Art skills › Brush Techniques) ---- */
// `brush` and `paper` preselect them on the pad; a step's third item { brush } switches brush at that step.
ART_LATER.push(() => {
  const band = (y, h, col, op = 0.75) => paint(col, `<path d="M15 ${y} Q57 ${y - 7} 100 ${y} T185 ${y} L185 ${y + h} Q143 ${y + h + 7} 100 ${y + h} T15 ${y + h}Z" opacity="${op}"/>`);
  const frame = ar(15, 15, 170, 170, 8);
  const sky = paint('#1F2027', ar(15, 15, 170, 170, 8));
  const pstar = (x, y, r, col) => paint(col, apg(Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5 - Math.PI / 2, q = i % 2 ? r * 0.45 : r; return `${(x + q * Math.cos(a)).toFixed(1)},${(y + q * Math.sin(a)).toFixed(1)}`; }).join(' ')));
  const dots = (pts, col, r = 1.6) => paint(col, pts.map(([x, y]) => ac(x, y, r)).join(''));
  const dab = (x, y, a, col) => paint(col, `<ellipse cx="${x}" cy="${y}" rx="9" ry="4.5" transform="rotate(${a} ${x} ${y})"/>`);
  const flower = (x, y, col) => Array.from({ length: 8 }, (_, i) => dab((x + 12 * Math.cos(i * Math.PI / 4)).toFixed(1), (y + 12 * Math.sin(i * Math.PI / 4)).toFixed(1), i * 45, col)).join('');
  const cloud = (x, y, s = 1) => ac(x, y, 14 * s) + ac(x + 16 * s, y - 8 * s, 16 * s) + ac(x + 34 * s, y, 13 * s) + ar(x - 4 * s, y, 40 * s, 12 * s, 6);
  const swirl = (x, y) => ap(`M${x} ${y} q12 -14 24 0 t24 0 q6 10 -4 12`);
  const arch = (r, col) => `<path d="M${100 - r} 160 A${r} ${r} 0 0 1 ${100 + r} 160" style="fill:none;stroke:${col};stroke-width:10"/>`;

  ART_CATS.push({ id: 'brushes', name: 'Brush Techniques', ico: '🎨', blurb: 'Paint like a pro: watercolor, chalk, thick paint, ink and more' });
  LESSONS.push(
    { id: 'bt-wash', cat: 'brushes', level: 1, title: 'Watercolor sky wash', ico: '💧', brush: 'watercolor', paper: 'wc', need: 'Watercolor paints, a big soft brush, a cup of water and thick paper. Or the 💧 Watercolor brush on the pad.', tip: 'Watercolor is see-through. Leave white paper showing for clouds and light!', steps: [
      ['Watercolor paper is bumpy, so the paint soaks in. Pick blue and the thick size.', frame],
      ['Paint long side-to-side lines across the top. Leave a few white gaps for clouds.', band(22, 26, '#2E8BE6', 0.55) + paint('#fff', ae(70, 38, 16, 6))],
      ['While it is still wet, paint the next line just under it so they touch. The edges melt together. That is called wet-on-wet!', band(46, 26, '#2E8BE6', 0.4)],
      ['Use the thin size and fewer lines as you go down. The sky gets lighter near the ground.', band(72, 22, '#8EC5F5', 0.45) + band(98, 14, '#8EC5F5', 0.3)],
      ['Pick green. Paint hills along the bottom and let them touch the wet sky a little.', paint('#2FA36B', ap('M15 185 L15 150 Q55 118 100 146 Q140 124 185 142 L185 185Z')) + ap('M15 150 Q55 118 100 146 Q140 124 185 142')],
      ['Let it dry. See the darker edges where the paint stopped? Real watercolor dries like that too!', '']] },
    { id: 'bt-sunset', cat: 'brushes', level: 1, title: 'Sunset color blend', ico: '🌅', brush: 'watercolor', paper: 'wc', need: 'Paints or crayons in yellow, orange, pink and purple, and a tissue', tip: 'Blending is how painters make one color fade into the next.', steps: [
      ['Pick yellow and the thick size. Paint a wide stripe near the bottom.', band(120, 34, '#FFC23D', 0.8)],
      ['Pick orange. Paint a stripe just above, touching the yellow.', band(88, 34, '#FF8A2B', 0.75)],
      ['Paint pink above the orange, then purple at the very top.', band(56, 34, '#F49AC1', 0.8) + band(18, 40, '#6D55D1', 0.6)],
      ['Now the Smudge finger: rub side to side where two colors meet. They blend into a soft sunset!', guide(al(25, 88, 175, 88) + al(25, 120, 175, 120) + al(25, 56, 175, 56)), { brush: 'smudge' }],
      ['Pick the Smooth pen and dark blue. Draw a hill and a little tree as a dark shape against the sky.', paint('#22305A', ap('M15 185 L15 160 Q70 140 120 158 Q150 150 185 156 L185 185Z') + ar(138, 120, 5, 34) + ac(140, 116, 14)), { brush: 'round' }]] },
    { id: 'bt-chalk', cat: 'brushes', level: 1, title: 'Chalk night sky', ico: '🌌', brush: 'chalk', paper: 'black', need: 'Black paper and chalk or soft pastels', tip: 'Light colors glow on black paper. Artists call this working light on dark.', steps: [
      ['Black paper makes light colors glow. Pick white chalk.', sky],
      ['Draw a big round moon near the top. Color it in softly.', paint('#F6F1D8', ac(130, 60, 26)) + ac(130, 60, 26)],
      ['Pick yellow. Draw little dots and tiny plus signs for stars.', dots([[40, 40], [70, 30], [55, 75], [95, 50], [170, 100], [30, 110], [85, 95]], '#FFC23D', 2.2) + al(160, 30, 160, 42) + al(154, 36, 166, 36)],
      ['Pick blue and draw a few swirly wind lines, like the famous painting The Starry Night by Van Gogh!', stroke('#2E8BE6', swirl(30, 135) + swirl(80, 120) + swirl(110, 145))],
      ['Pick the Smudge finger. Rub around the edge of the moon to make it glow.', guide(ac(130, 60, 36)), { brush: 'smudge' }],
      ['Pick Chalk again. Draw dark hills or a little house along the bottom with chalk outlines.', ap('M15 175 Q60 150 100 168 Q140 152 185 170') + ar(40, 150, 26, 22) + apg('36,150 53,136 70,150'), { brush: 'chalk' }]] },
    { id: 'bt-rainbow', cat: 'brushes', level: 1, title: 'Rainbow and glitter', ico: '🌈', brush: 'rainbow', need: 'Crayons or paints in all the rainbow colors, and glitter glue if you have it', tip: 'Red, orange, yellow, green, blue, purple. The rainbow order never changes!', steps: [
      ['Pick the Rainbow brush and the thick size. Draw a big arch from one side to the other.', arch(70, '#F2604F')],
      ['Draw more arches inside it, each one a bit smaller. The colors change by themselves!', arch(58, '#FFC23D') + arch(46, '#2FA36B') + arch(34, '#2E8BE6')],
      ['Pick the Crayon and white. Draw fluffy clouds at the two ends.', paint('#fff', cloud(14, 160, 0.9) + cloud(144, 160, 0.9)) + cloud(14, 160, 0.9) + cloud(144, 160, 0.9), { brush: 'crayon' }],
      ['Pick Glitter and yellow. Sprinkle sparkles over your rainbow!', dots([[60, 90], [100, 60], [140, 90], [80, 110], [120, 110], [100, 85]], '#FFC23D', 2.5), { brush: 'glitter' }]] },
    { id: 'bt-dab', cat: 'brushes', level: 2, title: 'Thick paint flowers', ico: '🌻', brush: 'oil', paper: 'canvas', need: 'Thick paint (poster paint or acrylic), a stiff brush and card', tip: 'Thick paint keeps the shape of every brush mark. Van Gogh loved that!', steps: [
      ['Pick green and the thick size. Paint 3 stems from the bottom up.', stroke('#2FA36B', ap('M60 185 Q62 130 58 90') + ap('M100 185 Q98 120 102 70') + ap('M140 185 Q140 140 144 100'))],
      ['Pick yellow. Press down and lift up: short dabs in a circle make a flower. Do not drag far!', flower(102, 62, '#FFC23D')],
      ['Make more flowers in pink and orange. Dabs can overlap.', flower(58, 84, '#F49AC1') + flower(144, 94, '#FF8A2B')],
      ['Dab brown in the middle of each flower. See how it mixes a little with the wet petals?', paint('#8B5A2B', ac(102, 62, 7) + ac(58, 84, 7) + ac(144, 94, 7))],
      ['Dab short green strokes for leaves and grass. Every brush mark shows!', dab(70, 130, -30, '#2FA36B') + dab(90, 140, 30, '#2FA36B') + dab(130, 150, -30, '#2FA36B') + [30, 50, 80, 110, 160, 175].map(x => dab(x, 178, -70, '#2FA36B')).join('')]] },
    { id: 'bt-ink', cat: 'brushes', level: 2, title: 'Ink loops and letters', ico: '✒️', brush: 'ink', need: 'A calligraphy pen or a flat-tipped marker, and paper', tip: 'Keep the flat tip pointing the same way. The pen makes thick and thin for you!', steps: [
      ['The Ink pen has a flat tip. Draw a line down to the right: thick! Now one up to the right: thin!', '<path d="M30 40 L70 80" style="stroke-width:12"/><path d="M90 80 L130 40" style="stroke-width:3"/>'],
      ['Draw a row of loops, like a spring. Watch the thick and thin parts swap.', ap('M20 120 c10 -30 30 -30 20 0 c-6 18 20 18 26 0 c-10 -30 10 -30 20 0 c6 18 26 18 26 0 c-10 -30 10 -30 20 0 c6 18 26 18 30 0')],
      ['Draw a wavy line all the way across the page.', ap('M20 160 q20 -20 40 0 t40 0 t40 0 t40 0')],
      ['Write the first letter of your name, big and slow.', atext(100, 92, 'A', 70, 'class="tx"')],
      ['Add curls and swirls around it to decorate. Fancy!', ap('M40 30 q-14 10 0 20 q14 10 0 20') + ap('M160 30 q14 10 0 20 q-14 10 0 20')]] },
    { id: 'bt-spray', cat: 'brushes', level: 2, title: 'Spray paint galaxy', ico: '🌠', brush: 'spray', paper: 'black', need: 'Black paper, paint and an old toothbrush to flick. Real spray paint is only for grown-ups, outside!', tip: 'Holding the spray still makes it thick. Moving fast makes a light mist.', steps: [
      ['Black paper is outer space! Pick purple and the thick size. Hold still in a few places to spray big glowing clouds.', sky + paint('#6D55D1', '<ellipse cx="80" cy="80" rx="50" ry="30" opacity=".6"/>')],
      ['Pick blue, then pink. Spray more clouds that overlap the purple.', paint('#2E8BE6', '<ellipse cx="130" cy="110" rx="45" ry="26" opacity=".55"/>') + paint('#F49AC1', '<ellipse cx="100" cy="95" rx="30" ry="16" opacity=".5"/>')],
      ['Pick Stamps, then the star. Tap yellow and white stars all over.', pstar(40, 40, 10, '#FFC23D') + pstar(160, 50, 8, '#fff') + pstar(60, 150, 9, '#fff') + pstar(150, 160, 11, '#FFC23D'), { brush: 'stamps' }],
      ['Pick the Spray can again with the thin size. Tap tiny white dots for far-away stars.', dots([[30, 90], [110, 30], [180, 130], [90, 170], [120, 140], [20, 170], [70, 120]], '#fff', 1.4), { brush: 'spray' }],
      ['Pick Glitter and draw a sparkly shooting star!', '<path d="M40 70 L120 130" style="stroke:#FFE07A;stroke-dasharray:3 5"/>' + pstar(125, 134, 9, '#FFE07A'), { brush: 'glitter' }]] },
    { id: 'bt-cloud', cat: 'brushes', level: 3, title: 'Soft smudged clouds', ico: '☁️', brush: 'watercolor', paper: 'wc', need: 'Blue paint or crayon, white chalk, and a tissue or your finger for smudging', tip: 'Smudging hides hard lines. Use it for clouds, smoke, fur and shadows.', steps: [
      ['Pick blue and the thick size. Paint a watercolor sky all over and let it dry.', band(20, 80, '#2E8BE6', 0.45) + band(100, 80, '#8EC5F5', 0.45)],
      ['Pick Chalk and white. Scribble round, bumpy cloud shapes.', paint('#fff', cloud(40, 70) + cloud(110, 120, 0.8)) + cloud(40, 70) + cloud(110, 120, 0.8), { brush: 'chalk' }],
      ['Pick the Smudge finger. Rub small circles along the bottom of each cloud to make it fluffy.', guide(al(40, 84, 90, 84) + al(106, 132, 150, 132)), { brush: 'smudge' }],
      ['Pick Chalk and purple, thin size. Draw a little shadow under each cloud.', stroke('#6D55D1', ap('M40 86 Q65 92 90 86') + ap('M108 134 Q128 140 148 134')), { brush: 'chalk' }],
      ['Smudge the shadows gently into the white. Now your clouds look soft and round!', '', { brush: 'smudge' }]] }
  );
});
