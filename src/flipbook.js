/* ---------- flipbook: draw a picture on each frame, flip through them fast, and the drawing moves ---------- */
// Frames are drawn at 400×300 and kept as a list of strokes on top of a baked picture, so Undo works per frame
// without keeping big snapshots. Onion skin shows the frame before, faintly. Eight guided lessons put a dotted
// guide on each frame to trace. Saved flipbooks go to My pictures (the first frame, like any picture) and, with
// all their frames as small JPEGs, to a per-player list (flip:<player>, newest 6) that My flipbooks and the
// gallery play back.
const flipHome = lazyArea(/*lazy{*/() => {
  const W = 400, H = 300, MINF = 2, MAXF = 12, KEEP = 6, FW = 320, FH = 240, MAXBYTES = 1500000;
  const SPEEDS = [['🐢', 'Slow', 450], ['🐈', 'Medium', 230], ['🐇', 'Fast', 120]];
  const SIZES = [[4, 'thin', 6], [10, 'medium', 14], [22, 'thick', 26]];
  const key = () => 'flip:' + pid;
  const load = () => { const l = store.get(key(), []); return Array.isArray(l) ? l : []; };
  const rec = () => { st.fb = Object.assign({ done: {}, day: '' }, st.fb || {}); return st.fb; };
  const fp = s => [s.length, s.substr(s.length >> 1, 40), s.substr(s.length * 0.8 | 0, 40)].join(':'); // finds a flipbook's picture in the gallery

  /* --- the guides: dotted shapes on a 400×300 frame --- */
  const C = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}"/>`;
  const E = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`;
  const L = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  const P = d => `<path d="${d}"/>`;
  const GROUND = L(16, 284, 384, 284);
  const face = (eyes) => C(200, 150, 112) + P('M150,205 Q200,240 250,205') + eyes;
  const eyesAt = ry => ry ? E(158, 120, 20, ry) + E(242, 120, 20, ry) : P('M138,122 Q158,134 178,122') + P('M222,122 Q242,134 262,122');
  const sprout = (top, leaves, head) => GROUND + L(200, 284, 200, top) + leaves + head;
  const leaf = (y, dir) => P(`M200,${y} Q${200 + dir * 40},${y - 34} ${200 + dir * 58},${y - 10} Q${200 + dir * 30},${y + 6} 200,${y}`);
  const bloom = (cx, cy) => C(cx, cy, 16) + [0, 1, 2, 3, 4, 5].map(k => { const a = (k + 0.5) * Math.PI / 3; return C(Math.round(cx + 31 * Math.cos(a)), Math.round(cy + 31 * Math.sin(a)), 13); }).join('');
  const person = hand => C(200, 70, 28) + L(200, 98, 200, 195) + L(200, 195, 168, 270) + L(200, 195, 232, 270) + L(200, 125, 158, 178) + P(`M200,125 L250,118 L${hand[0]},${hand[1]}`);
  const rocket = (y, flame) => P(`M180,${y} L180,${y - 70} L200,${y - 104} L220,${y - 70} L220,${y} Z`) + C(200, y - 52, 9) + P(`M180,${y - 22} L164,${y} L180,${y}`) + P(`M220,${y - 22} L236,${y} L220,${y}`)
    + (flame ? P(`M186,${y + 2} Q200,${y + 10 + flame * 16} 214,${y + 2}`) : '') + (flame > 1 ? C(172, 276, 9) + C(228, 276, 9) + C(150, 278, 7) + C(250, 278, 7) : '');
  const sun = (y, rays) => `<clipPath id="fbSky"><rect x="0" y="0" width="400" height="222"/></clipPath><g clip-path="url(#fbSky)">${C(200, y, 44)}${rays ? [0, 1, 2, 3, 4, 5, 6, 7].map(k => { const a = k * Math.PI / 4; return L(Math.round(200 + 58 * Math.cos(a)), Math.round(y + 58 * Math.sin(a)), Math.round(200 + (58 + rays) * Math.cos(a)), Math.round(y + (58 + rays) * Math.sin(a))); }).join('') : ''}</g>`
    + P('M10,222 Q90,190 170,222 Q260,196 390,222') + L(10, 222, 390, 222);
  const fish = (x, y, up) => E(x, y, 42, 26) + P(`M${x - 40},${y} L${x - 76},${y + (up ? -30 : -14)} L${x - 72},${y + (up ? 10 : 28)} Z`) + C(x + 22, y - 6, 5) + C(x + 66, y - 40, 7) + C(x + 84, y - 70, 5);
  const cat = pts => GROUND + pts.map(([x, y], i) => C(x, y, i === pts.length - 1 ? 20 : 15)).join('') + (() => { const [x, y] = pts[pts.length - 1]; return C(x + 8, y - 6, 4) + L(x - 4, y - 20, x - 12, y - 42) + L(x + 8, y - 20, x + 16, y - 42); })();

  const LESSONS = [
    { id: 'ball', ico: '⚽', name: 'Bouncing ball', sp: 1, intro: "Let's make a ball bounce! A flipbook is lots of pictures. Each picture is called a frame.", cheer: 'Boing, boing! Your ball is bouncing!',
      steps: [['Draw the ball up high. Make it nice and round.', GROUND + C(200, 64, 32)],
        ['The ball falls down fast. Draw it long, like an egg. That is called stretch!', GROUND + E(200, 160, 24, 38)],
        ['Boing! The ball hits the floor. Draw it flat and wide. That is called squash!', GROUND + E(200, 266, 44, 18)],
        ['The ball bounces back up. Draw it long again. Then tap Play it!', GROUND + E(200, 150, 24, 38)]] },
    { id: 'blink', ico: '👀', name: 'Blinking eyes', sp: 1, intro: "Let's make a face that blinks!", cheer: 'Blink, blink! Your face is blinking at you!',
      steps: [['Draw a big face with two open eyes and a smile.', face(eyesAt(24))],
        ['Draw the face again. Now the eyes are half shut, sleepy!', face(eyesAt(10))],
        ['Eyes closed! Draw the eyes as little curvy lines.', face(eyesAt(0))],
        ['The eyes open half way again. Then tap Play it!', face(eyesAt(10))]] },
    { id: 'flower', ico: '🌷', name: 'Growing flower', sp: 0, intro: "Let's grow a flower from a tiny seed!", cheer: 'Look! Your flower grew from a seed!',
      steps: [['Draw a tiny seed in the ground.', GROUND + E(200, 272, 12, 8)],
        ['A little sprout pops up! Draw a short stem and one leaf.', sprout(234, leaf(256, 1), '')],
        ['It grows taller! Draw a longer stem and two leaves.', sprout(180, leaf(240, 1) + leaf(214, -1), '')],
        ['A bud on top! Draw a tall stem with a little bud.', sprout(140, leaf(240, 1) + leaf(204, -1), E(200, 122, 16, 22))],
        ['The flower opens! Draw the petals all around. Then tap Play it!', sprout(150, leaf(240, 1) + leaf(204, -1), bloom(200, 102))]] },
    { id: 'wave', ico: '👋', name: 'Waving hello', sp: 1, intro: "Let's draw a stick person who waves hello!", cheer: 'Hello, hello! Your person is waving!',
      steps: [['Draw a stick person. Put the hand up high, out to the side.', person([290, 70])],
        ['Draw the person again. Move the hand a little to the middle.', person([262, 50])],
        ['Move the hand more, near the head. Wave!', person([232, 56])],
        ['Back to the middle. Then tap Play it to see the wave!', person([262, 50])]] },
    { id: 'rocket', ico: '🚀', name: 'Rocket launch', sp: 1, intro: "Three, two, one, blast off! Let's launch a rocket.", cheer: 'Blast off! Your rocket flew into the sky!',
      steps: [['Draw the rocket sitting on the ground.', GROUND + rocket(282, 0)],
        ['Three, two, one! A little fire comes out at the bottom.', GROUND + rocket(282, 1)],
        ['Lift off! Draw the rocket higher, with a big flame and smoke.', GROUND + rocket(222, 2)],
        ['Higher! Draw the rocket up here.', GROUND + rocket(170, 2)],
        ['Way up in the sky! Then tap Play it!', GROUND + rocket(118, 2)]] },
    { id: 'sun', ico: '🌅', name: 'Sunrise', sp: 0, bo: true, intro: "Good morning! Let's make the sun come up.", cheer: 'Good morning, sun! Your sun goes up and down!',
      steps: [['Draw the hills. The sun is just peeking up.', sun(240, 0)],
        ['The sun comes up more. Draw half a sun.', sun(200, 0)],
        ['Now the whole sun is up! Draw it round.', sun(140, 12)],
        ['High in the sky with long rays! Then tap Play it!', sun(96, 26)]] },
    { id: 'fish', ico: '🐟', name: 'Swimming fish', sp: 1, intro: "Let's make a fish swim across the sea!", cheer: 'Swish, swish! Your fish is swimming!',
      steps: [['Draw a fish over here. Its tail points up.', fish(90, 150, true)],
        ['The fish swims a bit. Draw it here. The tail points down.', fish(170, 140, false)],
        ['Swim, swim! The tail goes up again.', fish(250, 150, true)],
        ['Almost across! Tail down. Then tap Play it!', fish(296, 160, false)]] },
    { id: 'cater', ico: '🐛', name: 'Walking caterpillar', sp: 0, intro: "Let's help a caterpillar walk! It makes a hump to move.", cheer: 'Wiggle, wiggle! Your caterpillar is walking!',
      steps: [['Draw the caterpillar lying flat. Five round balls, and a head with feelers.', cat([[80, 262], [116, 262], [152, 262], [188, 262], [226, 258]])],
        ['The back end moves up! Draw a hump in the middle.', cat([[112, 262], [142, 244], [170, 222], [198, 244], [226, 258]])],
        ['The head goes forward. The hump moves too.', cat([[132, 262], [162, 240], [192, 220], [222, 240], [256, 258]])],
        ['Flat again, a bit further on! Then tap Play it!', cat([[120, 262], [156, 262], [192, 262], [228, 262], [266, 258]])]] }
  ];
  const guideSVG = g => g ? `<svg class="fb-guide" viewBox="0 0 ${W} ${H}" aria-hidden="true"><g fill="none" stroke="#8C9EC4" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 11">${g}</g></svg>` : '';

  /* --- frames --- */
  const canvas = (w = W, h = H) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  function frame(base = null, step = null) { const f = { c: canvas(), base, ops: [], g: step ? step[1] : '', tip: step ? step[0] : '' }; paint(f); return f; }
  function dup(f) { const b = canvas(); b.getContext('2d').drawImage(f.c, 0, 0); return Object.assign(frame(b), { g: f.g, tip: f.tip }); }
  function stroke(x, op, from = 0) {
    x.save(); x.globalCompositeOperation = op.er ? 'destination-out' : 'source-over';
    x.strokeStyle = x.fillStyle = op.col; x.lineWidth = op.er ? op.sz * 2 : op.sz; x.lineCap = x.lineJoin = 'round';
    const p = op.pts;
    if (p.length === 1) { x.beginPath(); x.arc(p[0][0], p[0][1], x.lineWidth / 2, 0, 7); x.fill(); }
    else { x.beginPath(); x.moveTo(p[Math.max(0, from - 1)][0], p[Math.max(0, from - 1)][1]); for (let k = Math.max(1, from); k < p.length; k++) x.lineTo(p[k][0], p[k][1]); x.stroke(); }
    x.restore();
  }
  function apply(x, op) { if (op.k === 'clr') x.clearRect(0, 0, W, H); else stroke(x, op); }
  function paint(f) { const x = f.c.getContext('2d'); x.clearRect(0, 0, W, H); if (f.base) x.drawImage(f.base, 0, 0); f.ops.forEach(op => apply(x, op)); }
  function bake(f) { // keep Undo at the last 20 steps of a frame
    while (f.ops.length > 20) { if (!f.base) f.base = canvas(); apply(f.base.getContext('2d'), f.ops.shift()); }
  }
  function inked(c) {
    const t = canvas(100, 75), x = t.getContext('2d'); x.drawImage(c, 0, 0, 100, 75);
    const d = x.getImageData(0, 0, 100, 75).data; for (let i = 3; i < d.length; i += 4) if (d[i] > 8) return true; return false;
  }
  function sig(c) { // a small fingerprint of a picture, for the tests
    const t = canvas(40, 30), x = t.getContext('2d'); x.drawImage(c, 0, 0, 40, 30);
    const d = x.getImageData(0, 0, 40, 30).data; let h = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 20) { n++; h = (h * 31 + (d[i] >> 4) * 7 + (d[i + 1] >> 4) * 3 + (d[i + 2] >> 4) + i) | 0; }
    return n ? n + ':' + h : '0';
  }
  function jpeg(c, w, h, q) { const t = canvas(w, h), x = t.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.drawImage(c, 0, 0, w, h); return t.toDataURL('image/jpeg', q); }
  // A saved frame is a JPEG on white: turn the white back into see-through, so onion skin still shows through it.
  function unjpeg(url) {
    return new Promise(res => {
      const im = new Image();
      im.onload = () => {
        const c = canvas(), x = c.getContext('2d'); x.drawImage(im, 0, 0, W, H);
        try { const d = x.getImageData(0, 0, W, H); for (let i = 0; i < d.data.length; i += 4) { const m = Math.min(d.data[i], d.data[i + 1], d.data[i + 2]); if (m > 236) d.data[i + 3] = 0; else if (m > 214) d.data[i + 3] = Math.round(255 * (236 - m) / 22); } x.putImageData(d, 0, 0); } catch (e) {}
        res(c);
      };
      im.onerror = () => res(canvas()); im.src = url;
    });
  }

  /* --- playing a saved flipbook in an <img> (My flipbooks and My pictures) --- */
  let imgPlay = null;
  function playImg(img, r, btn) {
    const was = imgPlay && imgPlay.img === img; stopImg(); if (was) return;
    const nav = navId, seq = r.fr.map((_, i) => i).concat(r.bo ? r.fr.map((_, i) => i).slice(1, -1).reverse() : []), ms = (SPEEDS[r.sp] || SPEEDS[1])[2];
    const p = imgPlay = { img, btn, src: img.src, k: 0 };
    if (btn) { btn.setAttribute('aria-pressed', 'true'); if (btn.dataset.lbl) btn.textContent = '⏹ Stop'; }
    const step = () => { if (nav !== navId || imgPlay !== p || !img.isConnected) return; img.src = r.fr[seq[p.k++ % seq.length]]; p.t = setTimeout(step, ms); };
    step();
  }
  function stopImg() {
    const p = imgPlay; if (!p) return; imgPlay = null; clearTimeout(p.t);
    if (p.img.isConnected) p.img.src = p.src;
    if (p.btn) { p.btn.setAttribute('aria-pressed', 'false'); if (p.btn.dataset.lbl) p.btn.textContent = p.btn.dataset.lbl; }
  }

  /* --- the flipbook home: new, lessons, my flipbooks --- */
  function home() {
    stopImg();
    const R = rec(), list = load(), done = LESSONS.filter(l => R.done[l.id]).length;
    view.innerHTML = `${crumbs('🎞️ Flipbook')}
      <p class="fb-lead">Draw a picture on each frame. Flip them fast, and your drawing moves!</p>
      <button class="pick" id="fbNew"><span class="big" aria-hidden="true">✏️</span><span><b>Start a new flipbook</b>Draw anything you like</span></button>
      <h3 class="section-title">Learn to animate <span class="tag">${done} of ${LESSONS.length} done</span></h3>
      <div class="fb-les">${LESSONS.map(l => `<button class="fb-lcard${R.done[l.id] ? ' done' : ''}" data-les="${l.id}"><span class="ico" aria-hidden="true">${l.ico}</span><b>${l.name}</b><span>${l.steps.length} frames</span>${R.done[l.id] ? '<i class="fb-tick" aria-label="done">✓</i>' : ''}</button>`).join('')}</div>
      <h3 class="section-title">My flipbooks</h3>
      ${list.length ? `<div class="fb-mine">${list.map((r, i) => { const l = LESSONS.find(x => x.id === r.les);
        return `<div class="fb-card" data-i="${i}"><img src="${r.fr[0]}" alt="${l ? l.name : 'My flipbook'}, ${r.fr.length} frames"><div class="fb-acts">
          <button class="tool fb-pl" data-play="${i}" data-lbl="▶ Play" aria-pressed="false">▶ Play</button><button class="tool" data-edit="${i}">✏️ Edit</button><button class="tool" data-del="${i}" aria-label="Delete this flipbook">🗑️</button></div></div>`; }).join('')}</div>`
        : '<p class="note">Your saved flipbooks show up here. You can keep the newest 6.</p>'}`;
    wireBack(artHome);
    sayScreen('Flipbook! Draw a picture on each frame, then press play to make it move. Start a new flipbook, or pick a lesson.');
    $('#fbNew').onclick = () => go(editor, {});
    view.querySelectorAll('[data-les]').forEach(b => b.onclick = () => go(editor, { les: b.dataset.les }));
    view.querySelectorAll('[data-play]').forEach(b => b.onclick = () => { const r = list[+b.dataset.play]; playImg(view.querySelector(`.fb-card[data-i="${b.dataset.play}"] img`), r, b); });
    view.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => {
      const r = list[+b.dataset.edit], nav = navId; stopImg(); b.disabled = true;
      Promise.all(r.fr.map(unjpeg)).then(cs => { if (nav === navId) go(editor, { rec: r, cs }); });
    });
    view.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
      if (b.dataset.armed !== '1') { b.dataset.armed = '1'; b.textContent = 'Sure?'; say('Tap again to throw away this flipbook.'); const nav = navId; setTimeout(() => { if (nav === navId && b.isConnected) { b.dataset.armed = ''; b.textContent = '🗑️'; } }, 3000); return; }
      const r = list[+b.dataset.del]; store.set(key(), load().filter(x => x.id !== r.id)); go(home);
    });
  }

  /* --- the editor: one canvas, a strip of frames, play --- */
  let ed = null;
  function editor(o = {}) {
    stopImg();
    const les = o.les ? LESSONS.find(l => l.id === o.les) : null;
    const frames = les ? les.steps.map(s => frame(null, s)) : o.cs ? o.cs.map(c => frame(c)) : [frame(), frame(), frame()];
    const S = ed = { frames, cur: 0, color: PAINT[0], size: 10, eraser: false, onion: true, guide: !!les, sp: o.rec ? o.rec.sp : les ? les.sp : 1, bo: o.rec ? !!o.rec.bo : !!(les && les.bo),
      id: o.rec ? o.rec.id : null, th: o.rec ? o.rec.th : null, les: les ? les.id : o.rec ? o.rec.les || '' : '', lesson: les, done: !les, unsaved: false, play: null, shown: 0 };
    const title = les ? `${les.ico} ${les.name}` : '🎞️ Flipbook';
    view.innerHTML = `${crumbs(title)}
      <div class="fb-ed${les ? ' fb-lesson' : ''}">
        ${les ? `<div class="fb-step" id="fbStep"><span class="fb-sn" id="fbSn"></span><p id="fbSt" aria-live="polite"></p><button class="speak" id="fbSpk" aria-label="Read it">🔊</button><button class="btn leaf fb-next" id="fbNext">Next ▶</button></div>` : ''}
        <div class="fb-stage"><div class="fb-wrap" id="fbWrap"><canvas id="fbOn" aria-hidden="true"></canvas><div id="fbG"></div><canvas id="fbCv" role="img" aria-label="Flipbook frame: draw here with your finger"></canvas><span class="fb-no" id="fbNo" aria-hidden="true"></span></div></div>
        <div class="fb-pal">
          <div class="tools">${PAINT.map((c, i) => `<button class="sw" style="background:${c};${c === '#FFFFFF' ? 'box-shadow:inset 0 0 0 2px var(--line)' : ''}" data-c="${c}" aria-label="${PAINT_NAMES[i]}" aria-pressed="${i === 0}"></button>`).join('')}</div>
          <div class="tools">${SIZES.map(([z, n, d]) => `<button class="tool size" data-z="${z}" aria-label="${n}" aria-pressed="${z === 10}"><i style="width:${d}px;height:${d}px"></i></button>`).join('')}
            <button class="tool" id="fbEr" aria-pressed="false">🧽 Eraser</button><button class="tool" id="fbUndo">↩️ Undo</button><button class="tool" id="fbClr">🗑️ Clear</button></div>
        </div>
        <div class="fb-play">
          <button class="fb-big" id="fbPlay" aria-pressed="false">▶ Play</button>
          <span class="fb-sp" role="group" aria-label="Speed">${SPEEDS.map(([e, n], i) => `<button class="tool" data-sp="${i}" aria-pressed="${i === S.sp}">${e} ${n}</button>`).join('')}</span>
          <button class="tool" id="fbBo" aria-pressed="${S.bo}">🔁 Bounce</button>
          <button class="tool" id="fbOnT" aria-pressed="true">👻 Onion</button>
          <button class="tool fb-save" id="fbSave">💾 Save</button>
        </div>
        <div class="fb-strbox">
          <div class="fb-strip" id="fbStrip" role="group" aria-label="Frames"></div>
          <div class="tools fb-frt" id="fbFrt"${les ? ' hidden' : ''}>
            <button class="tool" id="fbL" aria-label="Move this frame left">◀ Move</button><button class="tool" id="fbR" aria-label="Move this frame right">Move ▶</button>
            <button class="tool" id="fbDup">⧉ Copy</button><button class="tool" id="fbDel">🗑️ Delete frame</button>
          </div>
        </div>
        <div id="fbDone"></div>
      </div>`;
    const wrap = $('#fbWrap'), cv = $('#fbCv'), on = $('#fbOn'), cx = cv.getContext('2d'), ox = on.getContext('2d');
    const F = () => S.frames[S.cur];

    // Back: a flipbook is a lot of work, so leaving with changes not saved asks once.
    let backArm = 0;
    $('#backBtn').onclick = () => {
      if (S.unsaved && anyInk() && Date.now() - backArm > 4000) { backArm = Date.now(); $('#backBtn').textContent = '← Leave? Tap again'; say('Your flipbook is not saved. Tap Save to keep it, or tap Back again to leave.'); const nav = navId; setTimeout(() => { if (nav === navId && $('#backBtn')) $('#backBtn').textContent = '← Back'; }, 4000); return; }
      go(home);
    };

    function fit() {
      const r = wrap.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      [cv, on].forEach(c => { c.width = Math.max(1, Math.round(r.width * dpr)); c.height = Math.max(1, Math.round(r.height * dpr)); });
      show();
    }
    function blit(c) { cx.clearRect(0, 0, cv.width, cv.height); cx.drawImage(c, 0, 0, cv.width, cv.height); }
    function show() {
      const playing = !!S.play, f = playing ? S.frames[S.shown] : F();
      blit(f.c);
      ox.clearRect(0, 0, on.width, on.height);
      S.onionAt = -1;
      if (!playing && S.onion && S.cur > 0) { ox.drawImage(S.frames[S.cur - 1].c, 0, 0, on.width, on.height); S.onionAt = S.cur - 1; }
      wrap.classList.toggle('fb-playing', playing);
      $('#fbG').innerHTML = !playing && S.guide && f.g ? guideSVG(f.g) : '';
      $('#fbNo').textContent = `${(playing ? S.shown : S.cur) + 1}`;
    }
    function thumb(i) { const b = view.querySelector(`[data-f="${i}"] canvas`); if (!b) return; const x = b.getContext('2d'); x.clearRect(0, 0, b.width, b.height); x.drawImage(S.frames[i].c, 0, 0, b.width, b.height); }
    function strip() {
      const n = S.frames.length;
      $('#fbStrip').innerHTML = S.frames.map((f, i) => `<button class="fb-fr" data-f="${i}" aria-label="Frame ${i + 1}" aria-current="${i === S.cur}"><canvas width="80" height="60"></canvas><b>${i + 1}</b></button>`).join('')
        + (S.done ? `<button class="fb-add" id="fbAdd" aria-label="Add a frame"${n >= MAXF ? ' aria-disabled="true"' : ''}>➕</button>` : '');
      S.frames.forEach((f, i) => thumb(i));
      view.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { stop(); select(+b.dataset.f); });
      if ($('#fbAdd')) $('#fbAdd').onclick = add;
      $('#fbL').disabled = S.cur === 0; $('#fbR').disabled = S.cur === n - 1;
      $('#fbDel').setAttribute('aria-disabled', n <= MINF); $('#fbDup').setAttribute('aria-disabled', n >= MAXF);
      disarm();
      const cur = view.querySelector(`[data-f="${S.cur}"]`); if (cur) { const s = $('#fbStrip'), l = cur.offsetLeft - s.offsetLeft; if (l < s.scrollLeft || l + cur.offsetWidth > s.scrollLeft + s.clientWidth) s.scrollLeft = l - 8; }
    }
    function step() {
      if (!les) return;
      const f = F();
      $('#fbSn').textContent = `Frame ${S.cur + 1} of ${S.frames.length}`;
      $('#fbSt').textContent = S.done ? 'You did it! Press Play to watch it again, or save it.' : f.tip;
      $('#fbNext').textContent = S.done ? '▶ Play it' : S.cur === S.frames.length - 1 ? 'Play it! 🎬' : 'Next ▶';
    }
    function select(i, speak = true) { S.cur = clamp(i, 0, S.frames.length - 1); show(); strip(); step(); if (les && !S.done && speak) say(F().tip); }

    // Drawing with a finger, pen or mouse.
    let op = null;
    const pos = e => { const r = cv.getBoundingClientRect(); return [+((e.clientX - r.left) / r.width * W).toFixed(1), +((e.clientY - r.top) / r.height * H).toFixed(1)]; };
    cv.onpointerdown = e => {
      if (S.play) stop();
      try { cv.setPointerCapture(e.pointerId); } catch (x) {}
      op = { k: 's', col: S.color, sz: S.size, er: S.eraser, pts: [pos(e)] };
      const f = F(); f.ops.push(op); stroke(f.c.getContext('2d'), op); blit(f.c);
      S.unsaved = true;
    };
    cv.onpointermove = e => { if (!op) return; op.pts.push(pos(e)); stroke(F().c.getContext('2d'), op, op.pts.length - 1); blit(F().c); };
    cv.onpointerup = cv.onpointercancel = () => { if (!op) return; op = null; const f = F(); bake(f); paint(f); blit(f.c); thumb(S.cur); };

    view.querySelectorAll('.sw').forEach(b => b.onclick = () => { S.color = b.dataset.c; S.eraser = false; $('#fbEr').setAttribute('aria-pressed', 'false'); view.querySelectorAll('.sw').forEach(x => x.setAttribute('aria-pressed', x === b)); });
    view.querySelectorAll('[data-z]').forEach(b => b.onclick = () => { S.size = +b.dataset.z; view.querySelectorAll('[data-z]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
    $('#fbEr').onclick = e => { S.eraser = !S.eraser; e.currentTarget.setAttribute('aria-pressed', S.eraser); };
    $('#fbUndo').onclick = () => { stop(); const f = F(); if (!f.ops.length) { say('Nothing more to undo on this frame.'); return; } f.ops.pop(); paint(f); show(); thumb(S.cur); S.unsaved = true; };
    $('#fbClr').onclick = () => { stop(); const f = F(); if (!inked(f.c)) return; f.ops.push({ k: 'clr' }); bake(f); paint(f); show(); thumb(S.cur); S.unsaved = true; say('This frame is clean. Undo brings it back.'); };

    // Frames: add, copy, delete (tap twice), move.
    function add() {
      if (S.frames.length >= MAXF) { say(`A flipbook can have ${MAXF} frames. That is the most!`); return; }
      stop(); S.frames.splice(S.cur + 1, 0, frame()); S.unsaved = true; select(S.cur + 1); tone([660]);
    }
    $('#fbDup').onclick = () => {
      if (S.frames.length >= MAXF) { say(`A flipbook can have ${MAXF} frames. That is the most!`); return; }
      stop(); S.frames.splice(S.cur + 1, 0, dup(F())); S.unsaved = true; select(S.cur + 1); tone([660, 880]); say('A copy! Now change it a little bit.');
    };
    let delArm = 0;
    function disarm() { delArm = 0; const b = $('#fbDel'); if (b) b.textContent = '🗑️ Delete frame'; }
    $('#fbDel').onclick = () => {
      if (S.frames.length <= MINF) { say(`A flipbook needs at least ${MINF} frames.`); return; }
      if (Date.now() - delArm > 3000) { delArm = Date.now(); $('#fbDel').textContent = '🗑️ Tap again'; say(`Tap again to throw away frame ${S.cur + 1}.`); const nav = navId, t = delArm; setTimeout(() => { if (nav === navId && delArm === t) disarm(); }, 3000); return; }
      stop(); S.frames.splice(S.cur, 1); S.unsaved = true; select(Math.min(S.cur, S.frames.length - 1)); oops();
    };
    const move = d => { const j = S.cur + d; if (j < 0 || j >= S.frames.length) return; stop(); [S.frames[S.cur], S.frames[j]] = [S.frames[j], S.frames[S.cur]]; S.unsaved = true; select(j, false); tone([520 + d * 60]); };
    $('#fbL').onclick = () => move(-1); $('#fbR').onclick = () => move(1);

    // Play: show the frames one after another, again and again (or there and back with Bounce).
    function play() {
      if (S.play) return;
      const nav = navId, p = S.play = { k: 0 };
      const seq = () => { const n = S.frames.length, a = S.frames.map((_, i) => i); return S.bo && n > 2 ? a.concat(a.slice(1, -1).reverse()) : a; };
      $('#fbPlay').textContent = '⏹ Stop'; $('#fbPlay').classList.add('on'); $('#fbPlay').setAttribute('aria-pressed', 'true');
      const tick = () => {
        if (nav !== navId || S.play !== p || !cv.isConnected) return;
        const q = seq(); S.shown = q[p.k++ % q.length]; show();
        view.querySelectorAll('[data-f]').forEach(b => b.classList.toggle('fb-on', +b.dataset.f === S.shown));
        p.t = setTimeout(tick, SPEEDS[S.sp][2]);
      };
      tick();
    }
    function stop() {
      const p = S.play; if (!p) return; S.play = null; clearTimeout(p.t);
      if (!cv.isConnected) return;
      $('#fbPlay').textContent = '▶ Play'; $('#fbPlay').classList.remove('on'); $('#fbPlay').setAttribute('aria-pressed', 'false');
      view.querySelectorAll('.fb-on').forEach(b => b.classList.remove('fb-on')); show();
    }
    $('#fbPlay').onclick = () => { if (S.play) stop(); else { if (!anyInk()) { say('Draw something first, then press play!'); return; } play(); } };
    view.querySelectorAll('[data-sp]').forEach(b => b.onclick = () => { S.sp = +b.dataset.sp; S.unsaved = true; view.querySelectorAll('[data-sp]').forEach(x => x.setAttribute('aria-pressed', x === b)); say(SPEEDS[S.sp][1]); });
    $('#fbBo').onclick = e => { S.bo = !S.bo; S.unsaved = true; e.currentTarget.setAttribute('aria-pressed', S.bo); if (S.bo) say('Bounce! It plays forward, then backward.'); };
    $('#fbOnT').onclick = e => { S.onion = !S.onion; e.currentTarget.setAttribute('aria-pressed', S.onion); show(); if (S.onion) say('Onion skin! You can see the frame before, very faintly.'); };

    const anyInk = () => S.frames.some(f => inked(f.c));
    // Save: the first frame goes to My pictures, every frame to My flipbooks.
    function saveFlip(cheer = true) {
      if (!anyInk()) { if (cheer) say('Draw something first!'); return false; }
      if (!S.unsaved && S.id) { if (cheer) say('It is saved! Change something, then save again.'); return false; }
      stop();
      const fr = S.frames.map(f => jpeg(f.c, FW, FH, 0.7)), pic = jpeg(S.frames[0].c, 360, 270, 0.75), th = fp(pic);
      const r = { id: S.id || 'f' + Date.now().toString(36), t: Date.now(), sp: S.sp, bo: S.bo, les: S.les, fr, th };
      let list = [r].concat(load().filter(x => x.id !== r.id)).slice(0, KEEP);
      while (list.length > 1 && JSON.stringify(list).length > MAXBYTES) list.pop();
      for (let k = list.length; k >= 1; k--) { store.set(key(), list.slice(0, k)); if ((load()[0] || {}).id === r.id) break; }
      const at = S.th ? gallery.findIndex(g => fp(g) === S.th) : -1;
      if (at >= 0) gallery[at] = pic; else { gallery.unshift(pic); gallery = gallery.slice(0, 30); }
      saveGallery();
      S.id = r.id; S.th = th; S.unsaved = false;
      if (cheer) {
        questTick('art'); dayLog('art');
        const R = rec(), first = R.day !== today(); R.day = today(); save();
        if (first) addStars(2);
        confetti(20); yay(); say(first ? 'Saved to your pictures and My flipbooks! You earned 2 stars!' : 'Saved to your pictures and My flipbooks!');
      }
      return true;
    }
    $('#fbSave').onclick = () => saveFlip(true);

    // Lessons: one frame at a time, then play it with a cheer.
    if (les) {
      $('#fbSpk').onclick = () => say(S.done ? les.cheer : F().tip);
      $('#fbNext').onclick = () => {
        if (S.done) { play(); return; }
        if (!inked(F().c)) { say('Trace the dotted lines first!'); $('#fbWrap').classList.remove('fb-wig'); void wrap.offsetWidth; wrap.classList.add('fb-wig'); return; }
        if (S.cur < S.frames.length - 1) { select(S.cur + 1); tone([600]); return; }
        const empty = S.frames.findIndex(f => !inked(f.c));
        if (empty >= 0) { select(empty, false); say(`Frame ${empty + 1} still needs a drawing. Trace the dotted lines!`); return; }
        finish();
      };
    }
    function finish() {
      const R = rec(), first = !R.done[les.id]; R.done[les.id] = today(); save();
      S.done = true; S.guide = false; $('#fbFrt').hidden = false;
      if (first) addStars(2);
      select(0, false); play(); confetti(); yay();
      say(`${les.cheer}${first ? ' You earned 2 stars!' : ''} Tap Save to keep it.`);
      const i = LESSONS.indexOf(les), next = LESSONS.slice(i + 1).concat(LESSONS.slice(0, i)).find(l => !R.done[l.id]);
      $('#fbDone').innerHTML = `<div class="fb-done"><p class="fb-owl"><span aria-hidden="true">🦉</span> ${les.cheer}${first ? ' <b>+2 ⭐</b>' : ''}</p>
        <div class="row">${next ? `<button class="btn leaf" id="fbNl">Next: ${next.ico} ${next.name}</button>` : ''}<button class="btn alt" id="fbAll">All flipbooks</button></div></div>`;
      if (next) $('#fbNl').onclick = () => go(editor, { les: next.id });
      $('#fbAll').onclick = () => go(home);
    }

    fit(); const ro = new ResizeObserver(() => fit()); ro.observe(wrap);
    canvasCleanup = () => { ro.disconnect(); stop(); };
    // The play-time limit saves the pad on screen before "All done for today": this is the flipbook's pad.
    livePad = { cv, drawn: () => S.unsaved && anyInk(), save: c => saveFlip(!!c) };
    select(0, false);
    if (les) say(`${les.intro} ${F().tip}`);
    else if (o.rec) say('Here is your flipbook. Press play, or change a frame.');
    else say('Draw your first picture. Then go to the next frame and change it a little bit. Press play to see it move!');
    S.api = { play, stop, select, save: saveFlip, add, finish: () => les && finish() };
  }

  // My pictures: a flipbook's picture plays when tapped.
  function gal() {
    const list = load(); if (!list.length) return;
    view.querySelectorAll('.gallery img').forEach(img => {
      const r = list.find(x => x.th === fp(img.src)); if (!r) return;
      const b = document.createElement('button'); b.className = 'fb-gbtn'; b.setAttribute('aria-label', 'My flipbook: tap to play'); b.setAttribute('aria-pressed', 'false');
      img.replaceWith(b); b.appendChild(img); b.insertAdjacentHTML('beforeend', '<span class="fb-gbadge" aria-hidden="true">🎞️</span>');
      b.onclick = () => playImg(img, r, b);
    });
  }

  if (location.hash === '#selftest') window.__flip = { LESSONS, get ed() { return ed; }, home: () => go(home), open: o => go(editor, o || {}), load, sig, inked, get fb() { return rec(); },
    get livePad() { return livePad; }, get shown() { return ed && ed.play ? ed.shown : -1; }, screenSig: () => sig(document.getElementById('fbCv')), onionSig: () => sig(document.getElementById('fbOn')), frameSig: i => sig(ed.frames[i].c) };
  const f = () => home();
  f.gal = gal;
  return f;
}/*}lazy*/, ['__flip']);
