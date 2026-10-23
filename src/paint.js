/* ---------- Painting Studio: studio home, Colour lab and the gallery wall (the lessons are in art12.js) ---------- */
// Progress lives in the player's state as st.paint { wall, lab }, so backups and removing a player cover it.
// The wall points at pictures in the player's normal gallery (My pictures) by a short fingerprint, like flipbooks do.
const paintStudio = (() => {
  const CATS = ['ps-water', 'ps-thick', 'ps-chalk', 'ps-ink', 'ps-spray', 'ps-famous', 'ps-mixed'];
  const LVN = ['', 'Easy', 'Medium', 'Tricky', 'Expert'];
  ART_GROUPS.splice(1, 0, { id: 'studio', ico: '🖼️', name: 'Painting Studio', ids: CATS });
  const num = (v, d = 0) => Number.isFinite(+v) && +v >= 0 ? Math.floor(+v) : d;
  function ps() {
    let p = st.paint;
    if (!p || typeof p !== 'object' || Array.isArray(p)) p = st.paint = {};
    if (!Array.isArray(p.wall)) p.wall = [];
    p.wall = p.wall.filter(w => w && typeof w.fp === 'string' && FRAMES.some(f => f[0] === w.f));
    if (!p.lab || typeof p.lab !== 'object') p.lab = {};
    const L = p.lab; if (!Array.isArray(L.found)) L.found = [];
    for (const k of ['wheel', 'bigWheel', 'match', 'matchBest', 'sort', 'mixes']) L[k] = num(L[k]);
    return p;
  }

  /* ---- the colour model: drops of red, yellow, blue, white and black ---- */
  const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const toHex = c => '#' + c.map(v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('').toUpperCase();
  // The corners of the red-yellow-blue paint cube, in the app's own paint colors.
  const K = { o: hx('#FFFFFF'), r: hx('#F2604F'), y: hx('#FFC23D'), b: hx('#2E8BE6'), ry: hx('#FF8A2B'), rb: hx('#6D55D1'), yb: hx('#2FA36B'), ryb: hx('#8B5A2B') };
  const WHITE = hx('#FFFFFF'), BLACK = hx('#22252B');
  const PAINTS = [['r', 'red', '#F2604F'], ['y', 'yellow', '#FFC23D'], ['b', 'blue', '#2E8BE6'], ['w', 'white', '#FFFFFF'], ['k', 'black', '#22252B']];
  const pname = k => PAINTS.find(p => p[0] === k)[1];
  const rec = o => ({ r: num(o.r), y: num(o.y), b: num(o.b), w: num(o.w), k: num(o.k) });
  function ryb(r, y, b) {
    const m = Math.max(r, y, b); r /= m; y /= m; b /= m;
    const w = { o: (1 - r) * (1 - y) * (1 - b), r: r * (1 - y) * (1 - b), y: (1 - r) * y * (1 - b), b: (1 - r) * (1 - y) * b, ry: r * y * (1 - b), rb: r * (1 - y) * b, yb: (1 - r) * y * b, ryb: r * y * b };
    return [0, 1, 2].map(i => Object.keys(w).reduce((s, k) => s + w[k] * K[k][i], 0));
  }
  function mixRGB(o) {
    const q = rec(o), h = q.r + q.y + q.b, tot = h + q.w + q.k;
    if (!tot) return WHITE.slice();
    const base = h ? ryb(q.r, q.y, q.b) : null;
    return [0, 1, 2].map(i => ((base ? base[i] * h : 0) + WHITE[i] * q.w + BLACK[i] * q.k) / tot);
  }
  const mixHex = o => toHex(mixRGB(o));
  const SEC = { ry: 'orange', rb: 'purple', yb: 'green' };
  const TER = { 'r>y': 'red-orange', 'y>r': 'yellow-orange', 'y>b': 'yellow-green', 'b>y': 'blue-green', 'b>r': 'blue-purple', 'r>b': 'red-purple' };
  function hueName(q) {
    const hs = ['r', 'y', 'b'].filter(k => q[k] > 0);
    if (!hs.length) return '';
    if (hs.length === 3) return 'brown';
    if (hs.length === 1) return pname(hs[0]);
    const [a, b] = hs, ra = q[a] / q[b];
    if (ra >= 4) return pname(a); if (ra <= 0.25) return pname(b);
    if (ra >= 1.5) return TER[a + '>' + b]; if (ra <= 1 / 1.5) return TER[b + '>' + a];
    return SEC[a + b];
  }
  const SPECIAL = { 'light red': 'pink', 'very light red': 'light pink', 'dark yellow': 'olive', 'very dark yellow': 'dark olive', 'dark blue': 'navy blue', 'dark orange': 'brown' };
  function colorName(o) {
    const q = rec(o), hue = hueName(q), h = q.r + q.y + q.b;
    if (!h && !q.w && !q.k) return 'nothing yet';
    if (!h) return !q.k ? 'white' : !q.w ? 'black' : q.w > q.k ? 'light grey' : q.w < q.k ? 'dark grey' : 'grey';
    if (q.w && q.k) return 'greyish ' + hue;
    let n = hue;
    if (q.w) n = (q.w / (h + q.w) >= 0.7 ? 'very light ' : 'light ') + hue;
    if (q.k) n = (q.k / (h + q.k) >= 0.7 ? 'very dark ' : 'dark ') + hue;
    return SPECIAL[n] || n;
  }
  function kindOf(o) {
    const q = rec(o), hs = ['r', 'y', 'b'].filter(k => q[k] > 0);
    if (!hs.length) return 'neutral';
    if (q.w && !q.k) return 'tint'; if (q.k && !q.w) return 'shade'; if (q.k && q.w) return 'tone';
    if (hs.length === 3) return 'neutral';
    if (hs.length === 1) return 'primary';
    const n = hueName(q); return Object.values(SEC).includes(n) ? 'secondary' : Object.values(TER).includes(n) ? 'tertiary' : 'primary';
  }
  const WARM = ['red', 'orange', 'yellow', 'red-orange', 'yellow-orange', 'brown'], COOL = ['blue', 'green', 'purple', 'blue-green', 'blue-purple'];
  const tempOf = o => { const h = hueName(rec(o)); return !h ? 'neutral' : WARM.includes(h) ? 'warm' : COOL.includes(h) ? 'cool' : 'between'; };
  function explain(o) {
    const q = rec(o), n = colorName(q), k = kindOf(q), t = tempOf(q), hue = hueName(q);
    const parts = PAINTS.filter(p => q[p[0]]).map(p => q[p[0]] > 1 ? `${q[p[0]]} ${p[1]}` : p[1]);
    let s = `${parts.join(' + ')} makes ${n}.`;
    if (k === 'primary') s += ` ${cap(n)} is a primary color: you can not mix it from other paints.`;
    else if (k === 'secondary') s += ` ${cap(n)} is a secondary color: two primary colors mixed together.`;
    else if (k === 'tertiary') s += ` ${cap(n)} is a tertiary color: more of one primary than the other.`;
    else if (k === 'tint') s += ` Adding white makes a tint: a lighter ${hue}.`;
    else if (k === 'shade') s += ` Adding black makes a shade: a darker ${hue}.`;
    else if (k === 'tone') s += ' White and black together make a tone: a softer, greyer color.';
    else if (hue === 'brown') s += ' All three primaries together make brown!';
    if (t === 'warm') s += ' It is a warm color, like fire and sunshine.';
    else if (t === 'cool') s += ' It is a cool color, like water and leaves.';
    return s;
  }
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  // Colours to discover in the mixing tray (one new star each).
  const FIND = [['orange', { r: 1, y: 1 }], ['green', { y: 1, b: 1 }], ['purple', { r: 1, b: 1 }], ['pink', { r: 1, w: 1 }], ['light blue', { b: 1, w: 1 }], ['light yellow', { y: 1, w: 1 }], ['dark red', { r: 1, k: 1 }], ['navy blue', { b: 1, k: 1 }], ['olive', { y: 1, k: 1 }], ['grey', { w: 1, k: 1 }], ['brown', { r: 1, y: 1, b: 1 }], ['red-orange', { r: 2, y: 1 }]];
  const textOn = hex => { const [r, g, b] = hx(hex); return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? '#22305A' : '#FFFFFF'; };

  /* ---- studio home ---- */
  const lessons = () => LESSONS.filter(l => l.studio);
  let tab = 'all', lvl = 0;
  function home(cat) {
    if (cat) tab = cat;
    const p = ps(), all = lessons(), done = all.filter(l => st.art.done[l.id]).length;
    const list = all.filter(l => (tab === 'all' || l.cat === tab) && (!lvl || l.plevel === lvl)).sort((a, b) => a.plevel - b.plevel);
    const cats = CATS.map(id => ART_CATS.find(c => c.id === id));
    view.innerHTML = `${crumbs('🖼️ Painting Studio')}
      <p class="note">Real painting, step by step: each step picks the brush, paper and paint for you. ${done} of ${all.length} paintings done.</p>
      <div class="ps-top">
        <button class="ps-big ps-lab" id="psLab"><span class="ico" aria-hidden="true">🎨</span><b>Color lab</b><span>Mix paints, the color wheel and match the color</span></button>
        <button class="ps-big ps-wallb" id="psWall"><span class="ico" aria-hidden="true">🖼️</span><b>My gallery wall</b><span>${p.wall.length} hanging · slideshow</span></button>
      </div>
      <h3 class="section-title sub">Painting lessons</h3>
      <div class="ps-tabs" role="group" aria-label="Kind of painting">${[['all', '✨', 'All']].concat(cats.map(c => [c.id, c.ico, c.name])).map(([id, ico, nm]) => `<button class="ps-chip" data-tab="${id}" aria-pressed="${tab === id}"><span aria-hidden="true">${ico}</span> ${nm}</button>`).join('')}</div>
      <div class="ps-tabs" role="group" aria-label="Level">${[0, 1, 2, 3, 4].map(n => `<button class="ps-chip lv" data-lv="${n}" aria-pressed="${lvl === n}">${n ? LVN[n] : 'All levels'}</button>`).join('')}</div>
      ${tab !== 'all' ? `<p class="note">${esc(cats.find(c => c.id === tab).blurb)}.</p>` : ''}
      <div class="lessons ps-lessons">${list.map(l => { const open = artLevelOpen(l.level), c = cats.find(x => x.id === l.cat);
        return `<button class="lcard${st.art.done[l.id] ? ' done' : ''}${open ? '' : ' locked'}" data-l="${l.id}"><span class="ico">${open ? l.ico : '🔒'}</span><b>${esc(l.title)}</b><span class="lvl-tag ps-lv${l.plevel}">${LVN[l.plevel]}</span><span class="note">${c.ico} ${c.name} · ${l.steps.length} steps</span></button>`; }).join('') || '<p class="note">No paintings here yet. Try another level.</p>'}</div>
      <p class="note">Medium paintings are open for everyone. Tricky ones open after 3 Beginner lessons, Expert ones after 3 Explorer lessons (or from age 8 and 10).</p>`;
    wireBack(artHome);
    sayScreen(`Painting Studio! Pick a painting lesson, the color lab, or your gallery wall.`);
    $('#psLab').onclick = () => go(lab);
    $('#psWall').onclick = () => go(wall);
    view.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; go(home); });
    view.querySelectorAll('[data-lv]').forEach(b => b.onclick = () => { lvl = +b.dataset.lv; go(home); });
    view.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { const l = lessonById(b.dataset.l); if (artLevelOpen(l.level)) go(drawLesson, l.id); else say(`Finish 3 ${LEVEL_NAMES[l.level - 1]} lessons to open this one!`); });
  }

  /* ---- Colour lab ---- */
  function lab() {
    const L = ps().lab;
    view.innerHTML = `${crumbs('🎨 Color lab')}
      <div class="ps-top">
        <button class="ps-big" data-go="mix" style="background:var(--sun);color:var(--ink);box-shadow:0 4px 0 #C9921A"><span class="ico" aria-hidden="true">🫧</span><b>Mix with your finger</b><span>Drag two blobs together · ${L.found.length} of ${FIND.length} colors found</span></button>
        <button class="ps-big" data-go="wheel" style="background:var(--grape);box-shadow:0 4px 0 #4B37A6"><span class="ico" aria-hidden="true">🎡</span><b>Color wheel game</b><span>Put the colors in their places</span></button>
        <button class="ps-big" data-go="match" style="background:var(--coral-deep);box-shadow:0 4px 0 #8E3A2F"><span class="ico" aria-hidden="true">🎯</span><b>Match the color</b><span>Mix drops to copy a color${L.matchBest ? ` · best ${L.matchBest} ⭐` : ''}</span></button>
        <button class="ps-big" data-go="sort" style="background:var(--sky-deep);box-shadow:0 4px 0 #1D5FA0"><span class="ico" aria-hidden="true">🔥</span><b>Warm or cool?</b><span>Sort colors like fire or ice</span></button>
      </div>
      <div class="panel"><h2>Color words</h2><ul class="ps-words">
        <li><b>Primary</b>: red, yellow and blue. You can not mix them.</li>
        <li><b>Secondary</b>: two primaries mixed: orange, green, purple.</li>
        <li><b>Tint</b>: a color + white, lighter. <b>Shade</b>: a color + black, darker.</li>
        <li><b>Warm</b> colors: red, orange, yellow. <b>Cool</b> colors: blue, green, purple.</li></ul></div>`;
    wireBack(home);
    sayScreen('Color lab! Mix paints, play the color wheel game, match the color, or sort warm and cool colors.');
    view.querySelectorAll('[data-go]').forEach(b => b.onclick = () => go({ mix, wheel, match, sort }[b.dataset.go]));
  }

  // Mix with your finger: tap a paint pot to put a blob in the tray (or drag it in), drag a blob onto another to mix.
  let tray = null;
  function mix() {
    const L = ps().lab;
    view.innerHTML = `${crumbs('🫧 Mix with your finger')}
      <p class="note">Tap a paint, or drag it into the tray. Then drag one blob onto another to mix them!</p>
      <div class="ps-shelf" role="group" aria-label="Paints">${PAINTS.map(([k, n, c]) => `<button class="ps-pot" data-pot="${k}" style="--c:${c};color:${textOn(c)}" aria-label="${n} paint">${n}</button>`).join('')}</div>
      <div class="ps-tray" id="psTray" aria-label="Mixing tray"></div>
      <p class="ps-say" id="psSay" aria-live="polite">Your mixing tray is empty.</p>
      <div class="row"><button class="btn alt" id="psClear">🧽 Clean the tray</button></div>
      <h3 class="section-title sub">Colors I found <span class="tag" id="psN">${L.found.length} of ${FIND.length}</span></h3>
      <div class="ps-found" id="psFound"></div>`;
    wireBack(lab);
    sayScreen('Tap a paint to put a blob in the tray. Drag one blob onto another to mix them!');
    const T = $('#psTray'), blobs = []; let uid = 0;
    tray = { T, blobs };
    const showFound = () => { $('#psFound').innerHTML = FIND.map(([n, o]) => { const has = ps().lab.found.includes(n); return `<span class="ps-fchip${has ? '' : ' no'}" style="--c:${has ? mixHex(o) : '#E7EEF3'}">${has ? n : '?'}</span>`; }).join(''); $('#psN').textContent = `${ps().lab.found.length} of ${FIND.length}`; };
    showFound();
    const R = b => 26 + 3 * Math.min(8, b.q.r + b.q.y + b.q.b + b.q.w + b.q.k);
    const draw = b => { const r = R(b), hex = mixHex(b.q), n = colorName(b.q); Object.assign(b.el.style, { width: 2 * r + 'px', height: 2 * r + 'px', left: b.x - r + 'px', top: b.y - r + 'px', background: hex, color: textOn(hex) });
      b.el.dataset.hex = hex; b.el.dataset.name = n; b.el.setAttribute('aria-label', `${n} blob`); b.el.querySelector('span').textContent = n; };
    const size = () => T.getBoundingClientRect();
    const keepIn = b => { const r = R(b), s = size(); b.x = clamp(b.x, r, Math.max(r, s.width - r)); b.y = clamp(b.y, r, Math.max(r, s.height - r)); };
    function add(q, x, y) {
      if (blobs.length >= 8) { say('The tray is full. Mix some blobs, or clean the tray.'); return null; }
      const s = size(), el = document.createElement('div');
      el.className = 'ps-blob'; el.setAttribute('role', 'button'); el.tabIndex = 0; el.innerHTML = '<span></span>';
      const b = { id: ++uid, q: rec(q), el, x: x == null ? 50 + Math.random() * Math.max(10, s.width - 100) : x, y: y == null ? 50 + Math.random() * Math.max(10, s.height - 100) : y };
      el.dataset.id = b.id; T.appendChild(el); blobs.push(b); keepIn(b); draw(b); wireBlob(b);
      $('#psSay').textContent = `A ${colorName(b.q)} blob. Drag it onto another blob!`;
      return b;
    }
    function merge(a, b) { // a is dropped onto b
      const q = { r: a.q.r + b.q.r, y: a.q.y + b.q.y, b: a.q.b + b.q.b, w: a.q.w + b.q.w, k: a.q.k + b.q.k };
      if (q.r + q.y + q.b + q.w + q.k > 12) { say('That blob is too full! Clean the tray and start again.'); a.x += 60; keepIn(a); draw(a); return; }
      b.q = q; a.el.remove(); blobs.splice(blobs.indexOf(a), 1); draw(b); b.el.classList.remove('pop'); void b.el.offsetWidth; b.el.classList.add('pop');
      const n = colorName(q), msg = explain(q); $('#psSay').textContent = msg; say(msg); tone([523, 659]);
      const P = ps(); P.lab.mixes++;
      const f = FIND.find(([fn, fo]) => fn === n && mixHex(fo) === mixHex(q));
      if (f && !P.lab.found.includes(n)) { P.lab.found.push(n); addStars(1); confetti(18); toast(`New color found: ${n}! ⭐`); showFound(); }
      else save();
    }
    function wireBlob(b) {
      let drag = null;
      b.el.onpointerdown = e => { e.preventDefault(); try { b.el.setPointerCapture(e.pointerId); } catch (x) {} const s = size(); drag = { dx: e.clientX - s.left - b.x, dy: e.clientY - s.top - b.y }; b.el.classList.add('drag'); };
      b.el.onpointermove = e => { if (!drag) return; const s = size(); b.x = e.clientX - s.left - drag.dx; b.y = e.clientY - s.top - drag.dy; keepIn(b); draw(b); };
      b.el.onpointerup = b.el.onpointercancel = () => { if (!drag) return; drag = null; b.el.classList.remove('drag'); if (!b.el.isConnected) return;
        const t = blobs.filter(o => o !== b).sort((o1, o2) => Math.hypot(o1.x - b.x, o1.y - b.y) - Math.hypot(o2.x - b.x, o2.y - b.y))[0];
        if (t && Math.hypot(t.x - b.x, t.y - b.y) < (R(t) + R(b)) * 0.8) merge(b, t); };
      b.el.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { const t = blobs.find(o => o !== b); if (t) merge(b, t); } };
    }
    view.querySelectorAll('[data-pot]').forEach(btn => {
      let start = null, made = null;
      btn.onpointerdown = e => { start = [e.clientX, e.clientY]; made = null; try { btn.setPointerCapture(e.pointerId); } catch (x) {} };
      btn.onpointermove = e => {
        if (!start) return; const s = size();
        if (!made && Math.hypot(e.clientX - start[0], e.clientY - start[1]) > 12) made = add({ [btn.dataset.pot]: 1 }, e.clientX - s.left, e.clientY - s.top);
        if (made) { made.x = e.clientX - s.left; made.y = e.clientY - s.top; keepIn(made); draw(made); }
      };
      btn.onpointerup = btn.onpointercancel = e => {
        if (!start) return; const was = made; start = null; made = null;
        if (!was) { if (e.type === 'pointerup') { add({ [btn.dataset.pot]: 1 }); tone([440]); } return; }
        const t = blobs.filter(o => o !== was).find(o => Math.hypot(o.x - was.x, o.y - was.y) < (R(o) + R(was)) * 0.8); if (t) merge(was, t);
      };
      btn.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); add({ [btn.dataset.pot]: 1 }); } };
    });
    $('#psClear').onclick = () => { blobs.splice(0).forEach(b => b.el.remove()); $('#psSay').textContent = 'Your mixing tray is clean.'; };
  }

  // Colour wheel game: put the colours between the primaries.
  const WHEEL12 = [['red', { r: 1 }], ['red-orange', { r: 2, y: 1 }], ['orange', { r: 1, y: 1 }], ['yellow-orange', { y: 2, r: 1 }], ['yellow', { y: 1 }], ['yellow-green', { y: 2, b: 1 }], ['green', { y: 1, b: 1 }], ['blue-green', { b: 2, y: 1 }], ['blue', { b: 1 }], ['blue-purple', { b: 2, r: 1 }], ['purple', { r: 1, b: 1 }], ['red-purple', { r: 2, b: 1 }]];
  let wheelState = null;
  function wheel(big = false) {
    const W = big ? WHEEL12 : WHEEL12.filter((c, i) => i % 2 === 0), n = W.length, given = ['red', 'yellow', 'blue'];
    const S = wheelState = { big, placed: new Set(given), misses: 0, sel: null, W, done: false };
    const wedge = (i, r0 = 40, r1 = 92) => { const a0 = (i - 0.5) / n * 2 * Math.PI - Math.PI / 2, a1 = (i + 0.5) / n * 2 * Math.PI - Math.PI / 2, P = (r, a) => `${(100 + r * Math.cos(a)).toFixed(1)} ${(100 + r * Math.sin(a)).toFixed(1)}`;
      return `M${P(r0, a0)}L${P(r1, a0)}A${r1} ${r1} 0 0 1 ${P(r1, a1)}L${P(r0, a1)}A${r0} ${r0} 0 0 0 ${P(r0, a0)}Z`; };
    view.innerHTML = `${crumbs('🎡 Color wheel game')}
      <div class="ps-tabs" role="group" aria-label="Wheel size"><button class="ps-chip" data-w="0" aria-pressed="${!big}">6 colors</button><button class="ps-chip" data-w="1" aria-pressed="${big}">12 colors</button></div>
      <p class="ps-say" id="psSay" aria-live="polite">${big ? 'Tertiary colors sit between a primary and a secondary. Tap a color, then its place on the wheel.' : 'Red, yellow and blue are on the wheel. Each mixed color goes between the two colors that make it! Tap a color, then its place.'}</p>
      <div class="ps-wheelbox"><svg class="ps-wheel" viewBox="0 0 200 200" role="group" aria-label="Color wheel">${W.map(([nm, o], i) => `<path class="ps-slot" data-slot="${i}" d="${wedge(i)}" fill="${given.includes(nm) ? mixHex(o) : '#F1F5F8'}" role="button" aria-label="${given.includes(nm) ? nm : 'empty place ' + (i + 1)}"/>`).join('')}<circle cx="100" cy="100" r="34" fill="#fff"/><text x="100" y="106" text-anchor="middle" font-size="18">🎨</text></svg></div>
      <div class="ps-chips" id="psChips">${shuffle(W.filter(([nm]) => !given.includes(nm))).map(([nm, o]) => `<button class="ps-cchip" data-chip="${nm}" style="--c:${mixHex(o)};color:${textOn(mixHex(o))}">${nm}</button>`).join('')}</div>`;
    wireBack(lab);
    say($('#psSay').textContent);
    view.querySelectorAll('[data-w]').forEach(b => b.onclick = () => go(wheel, b.dataset.w === '1'));
    const pickChip = b => { S.sel = b.dataset.chip; view.querySelectorAll('[data-chip]').forEach(x => x.setAttribute('aria-pressed', x === b)); say(S.sel); };
    const place = slot => {
      if (S.done || !S.sel) { if (!S.done) say('Tap a color first!'); return; }
      const i = +slot.dataset.slot, [nm, o] = W[i];
      if (S.placed.has(nm)) return;
      if (nm !== S.sel) {
        S.misses++; oops(); slot.classList.remove('bad'); void slot.getBBox(); slot.classList.add('bad');
        const at = W.findIndex(w => w[0] === S.sel), a = W[(at - 1 + n) % n][0], c = W[(at + 1) % n][0];
        $('#psSay').textContent = `Not there. ${cap(S.sel)} goes between ${a} and ${c}.`; say($('#psSay').textContent); return;
      }
      S.placed.add(nm); slot.setAttribute('fill', mixHex(o)); slot.setAttribute('aria-label', nm); tone([600, 800]);
      view.querySelector(`[data-chip="${nm}"]`).remove(); S.sel = null;
      $('#psSay').textContent = explain(o); say(explain(o));
      if (S.placed.size === n) {
        S.done = true; const stars = big ? Math.max(2, 5 - S.misses) : Math.max(1, 3 - S.misses), P = ps();
        if (big) P.lab.bigWheel++; else P.lab.wheel++;
        S.stars = stars; addStars(stars); confetti(); yay(); questTick('mix');
        $('#psSay').textContent = `You finished the color wheel! ${stars} ⭐`; say(`You finished the color wheel! You earned ${stars} stars.`);
        $('#psChips').innerHTML = `<button class="btn leaf" id="psAgain">Play again</button>`; $('#psAgain').onclick = () => go(wheel, big);
      }
    };
    view.querySelectorAll('[data-chip]').forEach(b => {
      b.onclick = () => pickChip(b);
      b.onpointerdown = e => { try { b.setPointerCapture(e.pointerId); } catch (x) {} };
      // Dragging a chip and letting go over the wheel places it too.
      b.onpointerup = e => { const t = document.elementFromPoint(e.clientX, e.clientY); if (t && t.dataset && t.dataset.slot != null) { pickChip(b); place(t); } };
    });
    view.querySelectorAll('[data-slot]').forEach(s => s.addEventListener('click', () => place(s)));
  }

  // Match the colour: add drops until the pot matches the target. 2 stars for a first-try match, 1 after a miss.
  const POOLS = [
    [{ r: 1, y: 1 }, { y: 1, b: 1 }, { r: 1, b: 1 }, { r: 1, w: 1 }, { b: 1, w: 1 }, { y: 1, w: 1 }, { w: 1, k: 1 }],
    [{ r: 2, y: 1 }, { y: 2, b: 1 }, { b: 2, r: 1 }, { r: 1, k: 1 }, { b: 1, k: 1 }, { b: 1, w: 2 }, { y: 2, r: 1 }, { r: 1, y: 1, w: 1 }, { y: 1, b: 1, w: 1 }],
    [{ r: 1, y: 1, b: 1 }, { r: 2, y: 1, w: 1 }, { y: 1, b: 1, k: 1 }, { r: 1, b: 1, w: 2 }, { y: 2, b: 1, k: 1 }, { r: 2, b: 1, w: 1 }, { b: 2, y: 1, w: 2 }, { r: 1, y: 2, k: 1 }]
  ];
  let M = null;
  function match(level) {
    if (level == null) level = M && M.level != null ? M.level : st.age <= 6 ? 0 : st.age <= 9 ? 1 : 2;
    const targets = shuffle(POOLS[level]).slice(0, 5);
    M = { level, targets, i: 0, pot: rec({}), misses: 0, stars: 0, firsts: 0, done: false, wait: false };
    view.innerHTML = `${crumbs('🎯 Match the color')}
      <div class="ps-tabs" role="group" aria-label="Level">${['Easy', 'Medium', 'Hard'].map((t, i) => `<button class="ps-chip" data-ml="${i}" aria-pressed="${i === level}">${t}</button>`).join('')}</div>
      <div class="progress" id="psProg"></div>
      <div class="ps-match"><div class="ps-swatch"><div class="ps-sw" id="psT"></div><b>Owl’s color</b></div><div class="ps-swatch"><div class="ps-sw" id="psP"></div><b>My pot</b></div></div>
      <p class="ps-say" id="psSay" aria-live="polite"></p>
      <div class="ps-shelf" role="group" aria-label="Add a drop">${PAINTS.map(([k, n, c]) => `<button class="ps-pot sm" data-drop="${k}" style="--c:${c};color:${textOn(c)}" aria-label="Add a drop of ${n}">${n}<i id="psD${k}">0</i></button>`).join('')}</div>
      <div class="row"><button class="btn alt" id="psEmpty">🧽 Start again</button><button class="btn leaf" id="psCheck">Check ✓</button></div>`;
    wireBack(lab);
    view.querySelectorAll('[data-ml]').forEach(b => b.onclick = () => go(match, +b.dataset.ml));
    const show = () => {
      const t = M.targets[M.i], tot = M.pot.r + M.pot.y + M.pot.b + M.pot.w + M.pot.k;
      $('#psProg').innerHTML = M.targets.map((_, k) => `<i class="${k < M.i ? 'done' : k === M.i ? 'now' : ''}"></i>`).join('');
      $('#psT').style.background = mixHex(t); $('#psT').setAttribute('aria-label', `Owl's color: ${colorName(t)}`);
      $('#psP').style.background = tot ? mixHex(M.pot) : '#fff'; $('#psP').textContent = tot ? '' : 'empty'; $('#psP').setAttribute('aria-label', `My pot: ${tot ? colorName(M.pot) : 'empty'}`);
      PAINTS.forEach(([k]) => { $('#psD' + k).textContent = M.pot[k]; });
    };
    const ask = () => { M.misses = 0; M.pot = rec({}); show(); const t = M.targets[M.i]; $('#psSay').textContent = `Color ${M.i + 1} of 5: can you make ${colorName(t)}? Add drops of paint.`; say($('#psSay').textContent); };
    ask();
    view.querySelectorAll('[data-drop]').forEach(b => b.onclick = () => {
      if (M.done || M.wait) return;
      const tot = M.pot.r + M.pot.y + M.pot.b + M.pot.w + M.pot.k;
      if (tot >= 8) { say('The pot is full! Start again, or check it.'); return; }
      M.pot[b.dataset.drop]++; tone([420 + tot * 40]); show();
    });
    $('#psEmpty').onclick = () => { if (M.done || M.wait) return; M.pot = rec({}); show(); };
    $('#psCheck').onclick = () => {
      if (M.done || M.wait) return;
      const t = M.targets[M.i], tot = M.pot.r + M.pot.y + M.pot.b + M.pot.w + M.pot.k;
      if (!tot) { say('Add some drops of paint first!'); return; }
      const a = mixRGB(M.pot), b = mixRGB(t), d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      if (d < 4) {
        const n = M.misses ? 1 : 2; M.stars += n; if (!M.misses) M.firsts++; M.wait = true;
        const P = ps(); P.lab.match++; addStars(n); yay();
        $('#psSay').textContent = `Perfect match! ${colorName(t)}. ${'⭐'.repeat(n)}`; say(`Perfect match! You made ${colorName(t)}.`);
        const nav = navId;
        setTimeout(() => {
          if (nav !== navId) return; M.wait = false; M.i++;
          if (M.i < M.targets.length) { ask(); return; }
          M.done = true; P.lab.matchBest = Math.max(P.lab.matchBest, M.stars); save(); confetti(); questTick('mix');
          view.querySelector('.ps-shelf').hidden = true; $('#psCheck').closest('.row').hidden = true;
          view.querySelector('.ps-match').insertAdjacentHTML('afterend', `<div class="panel ps-end" id="psEnd"><h2>All 5 colors matched!</h2><p class="ps-say">${M.firsts} on the first try. You earned ${M.stars} ⭐</p><div class="row"><button class="btn leaf" id="psAgain">Play again</button><button class="btn alt" id="psLabB">Color lab</button></div></div>`);
          say(`All five colors matched! You earned ${M.stars} stars.`);
          $('#psAgain').onclick = () => go(match, M.level); $('#psLabB').onclick = () => go(lab);
        }, 1400);
        return;
      }
      M.misses++; oops();
      // A hint: the paint the target has more of than the pot (by share), or one the target does not have at all.
      const share = (q, k) => q[k] / Math.max(1, q.r + q.y + q.b + q.w + q.k);
      const extra = PAINTS.find(([k]) => M.pot[k] && !t[k]);
      const need = PAINTS.map(([k]) => [k, share(rec(t), k) - share(M.pot, k)]).sort((x, y) => y[1] - x[1])[0];
      const hint = extra ? `Owl’s color has no ${extra[1]} in it. Start again!` : `Close! Try a little more ${pname(need[0])}.`;
      $('#psSay').textContent = `Not quite. ${hint}`; say(`Not quite. ${hint}`);
    };
  }

  // Warm or cool: tap a colour, then the basket.
  function sort() {
    const pool = shuffle([['red', { r: 1 }], ['orange', { r: 1, y: 1 }], ['yellow', { y: 1 }], ['red-orange', { r: 2, y: 1 }], ['yellow-orange', { y: 2, r: 1 }], ['blue', { b: 1 }], ['green', { y: 1, b: 1 }], ['purple', { r: 1, b: 1 }], ['blue-green', { b: 2, y: 1 }], ['blue-purple', { b: 2, r: 1 }]]).slice(0, 8);
    const S = { left: pool.length, misses: 0, sel: null };
    view.innerHTML = `${crumbs('🔥 Warm or cool?')}
      <p class="ps-say" id="psSay" aria-live="polite">Warm colors feel like fire and sunshine. Cool colors feel like water, ice and leaves. Tap a color, then its basket.</p>
      <div class="ps-chips" id="psChips">${pool.map(([n, o]) => `<button class="ps-cchip" data-c="${n}" data-t="${tempOf(o)}" style="--c:${mixHex(o)};color:${textOn(mixHex(o))}">${n}</button>`).join('')}</div>
      <div class="ps-bins"><button class="ps-bin warm" data-bin="warm"><span aria-hidden="true">🔥</span> Warm</button><button class="ps-bin cool" data-bin="cool"><span aria-hidden="true">❄️</span> Cool</button></div>`;
    wireBack(lab); say($('#psSay').textContent);
    view.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { S.sel = b; view.querySelectorAll('[data-c]').forEach(x => x.setAttribute('aria-pressed', x === b)); say(b.dataset.c); });
    view.querySelectorAll('[data-bin]').forEach(bin => bin.onclick = () => {
      if (!S.sel) { say('Tap a color first!'); return; }
      const b = S.sel;
      if (b.dataset.t !== bin.dataset.bin) { S.misses++; oops(); $('#psSay').textContent = `${cap(b.dataset.c)} is a ${b.dataset.t} color. Try the other basket!`; say($('#psSay').textContent); return; }
      tone([600, 760]); bin.insertAdjacentHTML('beforeend', `<i style="background:${b.style.getPropertyValue('--c')}"></i>`); b.remove(); S.sel = null; S.left--;
      if (!S.left) { const n = S.misses ? 1 : 2; ps().lab.sort++; addStars(n); confetti(); yay(); $('#psSay').textContent = `All sorted! ${'⭐'.repeat(n)}`; say(`All sorted! You earned ${n} stars.`);
        $('#psChips').innerHTML = '<button class="btn leaf" id="psAgain">Play again</button>'; $('#psAgain').onclick = () => go(sort); }
    });
  }

  /* ---- Gallery wall ---- */
  const FRAMES = [['gold', 'Gold'], ['wood', 'Wood'], ['white', 'White mat'], ['rainbow', 'Rainbow'], ['black', 'Black'], ['stars', 'Stars']];
  const fp = s => [s.length, s.substr(s.length >> 1, 40), s.substr(s.length * 0.8 | 0, 40)].join(':');
  const MAXW = 12;
  // The hung pictures that are still in My pictures (a picture pushed out of the 30 kept drops off the wall).
  function hung() { const p = ps(), by = new Map(gallery.map(g => [fp(g), g])); const keep = p.wall.filter(w => by.has(w.fp)); if (keep.length !== p.wall.length) { p.wall = keep; save(); } return keep.map(w => ({ ...w, src: by.get(w.fp) })); }
  function hang(src, f = 'gold') {
    if (!src) return false;
    const p = ps(), k = fp(src);
    if (p.wall.some(w => w.fp === k)) return true;
    if (hung().length >= MAXW) { say('Your wall is full. Take a picture down first.'); return false; }
    p.wall.unshift({ fp: k, f, t: today() }); save(); return true;
  }
  const framed = (w, i) => `<button class="ps-frame f-${w.f}" data-hung="${i}" aria-label="My painting in a ${FRAMES.find(f => f[0] === w.f)[1].toLowerCase()} frame"><img src="${w.src}" alt=""></button>`;
  function wall(focus) {
    const H = hung();
    view.innerHTML = `${crumbs('🖼️ My gallery wall')}
      <div class="row ps-wallbar"><button class="btn leaf" id="psHang">➕ Hang a picture</button><button class="btn" id="psShow"${H.length ? '' : ' disabled'}>▶ Slideshow</button></div>
      <div class="ps-wall" id="psWallBox">${H.length ? H.map(framed).join('') : `<p class="ps-empty">Your wall is empty. Finish a painting or save a drawing, then hang it here like a real gallery!</p>`}</div>
      <div id="psEdit"></div>`;
    wireBack(home);
    sayScreen(H.length ? `Your gallery wall has ${H.length} picture${H.length > 1 ? 's' : ''}. Tap one to change its frame.` : 'Your gallery wall is empty. Hang a picture!');
    $('#psHang').onclick = () => go(picker);
    $('#psShow').onclick = () => { if (H.length) slideshow(H); };
    view.querySelectorAll('[data-hung]').forEach(b => b.onclick = () => edit(+b.dataset.hung));
    if (focus != null && H[focus]) { const el = view.querySelector(`[data-hung="${focus}"]`); if (el) el.classList.add('new'); }
  }
  function edit(i) {
    const H = hung(), w = H[i]; if (!w) return;
    $('#psEdit').innerHTML = `<div class="panel"><h2>Change the frame</h2><div class="ps-tabs" role="group" aria-label="Frames">${FRAMES.map(([id, nm]) => `<button class="ps-chip ps-fc f-${id}" data-fr="${id}" aria-pressed="${w.f === id}">${nm}</button>`).join('')}</div>
      <div class="row" style="justify-content:flex-start"><button class="btn alt sm" id="psDown">Take it down</button></div></div>`;
    $('#psEdit').scrollIntoView({ block: 'nearest' });
    view.querySelectorAll('[data-fr]').forEach(b => b.onclick = () => { const p = ps(), e = p.wall.find(x => x.fp === w.fp); if (e) { e.f = b.dataset.fr; save(); } go(wall, i); });
    $('#psDown').onclick = () => { const p = ps(); p.wall = p.wall.filter(x => x.fp !== w.fp); save(); go(wall); };
  }
  function picker() {
    const have = new Set(ps().wall.map(w => w.fp)); let f = 'gold';
    view.innerHTML = `${crumbs('➕ Hang a picture')}
      <p class="note">Pick a frame, then tap a picture to hang it on your wall.</p>
      <div class="ps-tabs" role="group" aria-label="Frames">${FRAMES.map(([id, nm]) => `<button class="ps-chip ps-fc f-${id}" data-fr="${id}" aria-pressed="${id === f}">${nm}</button>`).join('')}</div>
      ${gallery.length ? `<div class="gallery ps-pick">${gallery.map((g, i) => `<button class="ps-pbtn${have.has(fp(g)) ? ' on' : ''}" data-g="${i}" aria-label="${have.has(fp(g)) ? 'Already on the wall' : 'Hang this picture'}"><img src="${g}" alt=""></button>`).join('')}</div>`
        : '<p class="ps-empty">No saved pictures yet. Paint one in the studio and it will show up here!</p>'}`;
    wireBack(wall);
    say('Pick a frame, then tap a picture.');
    view.querySelectorAll('[data-fr]').forEach(b => b.onclick = () => { f = b.dataset.fr; view.querySelectorAll('[data-fr]').forEach(x => x.setAttribute('aria-pressed', x === b)); say(b.textContent); });
    view.querySelectorAll('[data-g]').forEach(b => b.onclick = () => {
      if (b.classList.contains('on')) { say('That one is already on your wall!'); return; }
      if (hang(gallery[+b.dataset.g], f)) { yay(); toast('Hung on your gallery wall! 🖼️'); go(wall, 0); }
    });
  }
  let show = null;
  function slideshow(H) {
    stopShow();
    let i = 0, playing = true, timer = 0;
    const ov = document.createElement('div'); ov.className = 'ps-show'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'Slideshow');
    ov.innerHTML = `<div class="ps-stage" id="psStage"></div><p class="ps-cap" id="psCap"></p>
      <div class="ps-ctrl"><button class="tool" id="psPrev" aria-label="Back one picture">◀</button><button class="tool" id="psPlay" aria-label="Pause">⏸️</button><button class="tool" id="psNext" aria-label="Next picture">▶</button><button class="tool" id="psClose" aria-label="Close the slideshow">✕ Close</button></div>`;
    view.appendChild(ov);
    const paintIt = () => { const w = H[i]; ov.querySelector('#psStage').innerHTML = `<div class="ps-frame big f-${w.f}"><img src="${w.src}" alt="My painting ${i + 1}"></div>`; ov.querySelector('#psCap').textContent = `${i + 1} of ${H.length}`; };
    const tick = d => { i = (i + d + H.length) % H.length; paintIt(); };
    const arm = () => { clearInterval(timer); timer = playing ? setInterval(() => { if (!ov.isConnected) return stopShow(); tick(1); }, 3000) : 0; };
    show = { stop: () => { clearInterval(timer); timer = 0; ov.remove(); }, get i() { return i; }, get playing() { return playing; }, get timer() { return timer; } };
    canvasCleanup = stopShow;
    ov.querySelector('#psPrev').onclick = () => { tick(-1); arm(); };
    ov.querySelector('#psNext').onclick = () => { tick(1); arm(); };
    ov.querySelector('#psPlay').onclick = e => { playing = !playing; e.currentTarget.textContent = playing ? '⏸️' : '▶️'; e.currentTarget.setAttribute('aria-label', playing ? 'Pause' : 'Play'); arm(); };
    ov.querySelector('#psClose').onclick = () => { stopShow(); if (canvasCleanup === stopShow) canvasCleanup = null; };
    paintIt(); arm(); say('Welcome to my gallery!');
  }
  function stopShow() { if (show) { show.stop(); show = null; } }

  /* ---- hooks for core.js ---- */
  // The finish screen of a studio lesson offers to hang the painting that was just saved.
  function done(ls, drawn) {
    if (!ls.studio) return;
    const row = view.querySelector('.view.done .row'); if (!row) return;
    const src = drawn ? gallery[0] : null;
    row.insertAdjacentHTML('afterbegin', src ? '<button class="btn ps-hangb" id="psHangIt">🖼️ Hang it in my gallery</button>' : '');
    const more = view.querySelector('#more'); if (more) more.onclick = () => go(home, ls.cat);
    const b = view.querySelector('#psHangIt');
    if (b) b.onclick = () => { if (b.dataset.done) { go(wall, 0); return; } if (hang(src, 'gold')) { yay(); toast('Hung on your gallery wall! 🖼️'); b.dataset.done = '1'; b.textContent = '🖼️ See my gallery wall'; say('It is hanging in your gallery!'); } };
  }
  // My pictures gets a button to the wall.
  function galHook() {
    const c = view.querySelector('.crumbs'); if (!c) return;
    c.insertAdjacentHTML('afterend', `<div class="row" style="justify-content:flex-start"><button class="btn leaf sm" id="psToWall" style="min-height:48px">🖼️ My gallery wall (${hung().length})</button></div>`);
    $('#psToWall').onclick = () => go(wall);
  }
  const info = () => { const all = lessons(); return { lessons: all.length, kinds: CATS.length, levels: [1, 2, 3, 4].map(n => all.filter(l => l.plevel === n).length), frames: FRAMES.length, find: FIND.length }; };

  if (location.hash === '#selftest') window.__paint = { CATS, FIND, FRAMES, WHEEL12, POOLS, mixHex, mixRGB, colorName, kindOf, tempOf, explain, ps, hang, hung, fp, info,
    home: c => go(home, c), lab: () => go(lab), mix: () => go(mix), wheel: big => go(wheel, !!big), match: l => go(match, l), sort: () => go(sort), wall: () => go(wall),
    get tray() { return tray; }, get wheelState() { return wheelState; }, get M() { return M; }, get show() { return show; } };
  const f = c => home(c);
  Object.assign(f, { done, galHook, info, wall: () => wall(), lab: () => lab() });
  return f;
})();
