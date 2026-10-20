/* ---------- write numbers: trace each digit along a guide, then the app checks the tracing ---------- */
// Each digit is one or two pen strokes in a 100 × 140 box, starting where children are taught to start.
const DIGIT_PATHS = {
  0: 'M50 15 C20 15 15 50 15 70 C15 95 25 125 50 125 C75 125 85 95 85 70 C85 45 80 15 50 15',
  1: 'M32 38 L55 15 L55 125',
  2: 'M20 40 C20 12 80 10 80 40 C80 65 40 92 20 125 L85 125',
  3: 'M20 27 C38 6 84 14 76 44 C71 61 57 65 45 67 C70 68 85 80 82 100 C78 128 35 131 18 112',
  4: 'M55 15 L15 90 L85 90 M64 55 L64 125',
  5: 'M78 15 L32 15 L26 62 C46 50 82 55 82 88 C82 120 40 132 18 112',
  6: 'M72 18 C40 14 18 50 18 85 C18 115 35 125 52 125 C75 125 84 108 84 92 C84 72 70 62 52 62 C35 62 20 75 18 85',
  7: 'M18 15 L82 15 L40 125',
  8: 'M50 67 C25 60 22 15 50 15 C78 15 75 60 50 67 C20 75 18 125 50 125 C82 125 80 75 50 67',
  9: 'M80 50 C80 25 65 15 50 15 C30 15 20 30 20 48 C20 68 35 78 50 78 C66 78 80 68 80 50 L80 125'
};
const writeOpen = n => n <= 10 || st.unlockAll || st.age >= 6 || Object.keys(st.write.done).filter(k => +k <= 10).length >= 6;
function writeHome() {
  st.write = st.write || { done: {} };
  view.innerHTML = `${crumbs('✏️ Write numbers')}<p class="note">Trace each number with your finger. Start at the green dot and follow the arrow.</p>
    <div class="numgrid">${Array.from({ length: 21 }, (_, n) => `<button class="numbtn${st.write.done[n] ? ' done' : ''}${writeOpen(n) ? '' : ' locked'}" data-n="${n}">${writeOpen(n) ? n : '🔒'}</button>`).join('')}</div>
    ${writeOpen(11) ? '' : '<p class="note">Numbers 11 to 20 open after you write 6 of the numbers up to 10.</p>'}`;
  wireBack(mathHome);
  sayScreen('Pick a number to write!');
  view.querySelectorAll('[data-n]').forEach(b => b.onclick = () => writeOpen(+b.dataset.n) ? go(writeView, +b.dataset.n) : say('Write 6 of the numbers up to 10 first!'));
}
function writeView(n) {
  st.write = st.write || { done: {} };
  const digits = String(n).split(''), W = digits.length * 100 + 20, H = 140;
  const path = digits.map((d, i) => DIGIT_PATHS[d].replace(/([ML]|C)?\s*(-?[\d.]+) (-?[\d.]+)/g, (m, c, x, y) => `${c || ''} ${+x + 10 + i * 100} ${y}`)).join(' ');
  view.innerHTML = `${crumbs(`Write ${n}`)}
    <div class="write-wrap" style="aspect-ratio:${W}/${H};width:min(100%, 560px, calc(60vh * ${(W / H).toFixed(3)}))"><svg class="write-guide" viewBox="0 0 ${W} ${H}" aria-hidden="true">
      <line x1="0" y1="70" x2="${W}" y2="70" class="mid"/><path d="${path}" class="trk"/><path d="${path}" class="dash"/><path d="${path}" class="demo" id="demo"/>
      <circle id="startDot" r="7" class="start"/></svg><canvas id="wc"></canvas></div>
    <div class="row"><button class="btn alt" id="watch">👀 Watch me</button><button class="btn alt" id="wclr">🗑️ Again</button><button class="btn leaf" id="wdone">✅ Done</button></div>
    <p class="cheer" id="wmsg" aria-live="polite"></p>`;
  wireBack(writeHome);
  const svg = view.querySelector('.write-guide'), guide = svg.querySelector('.trk'), demo = svg.querySelector('#demo'), cv = $('#wc'), ctx = cv.getContext('2d'), wrap = view.querySelector('.write-wrap');
  const starts = [...path.matchAll(/M\s*(-?[\d.]+) (-?[\d.]+)/g)].map(m => [+m[1], +m[2]]);
  svg.querySelector('#startDot').setAttribute('cx', starts[0][0]); svg.querySelector('#startDot').setAttribute('cy', starts[0][1]);
  const len = guide.getTotalLength();
  const playDemo = () => { demo.style.transition = 'none'; demo.style.strokeDasharray = len; demo.style.strokeDashoffset = len; demo.getBoundingClientRect(); demo.style.transition = `stroke-dashoffset ${1.2 + digits.length}s linear`; demo.style.strokeDashoffset = 0; };
  let drawing = false, last = null, inked = false;
  const fit = () => { const r = wrap.getBoundingClientRect(), dpr = window.devicePixelRatio || 1; cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); inked = false; };
  fit(); const ro = new ResizeObserver(fit); ro.observe(wrap); canvasCleanup = () => ro.disconnect();
  const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const seg = (a, b) => { const k = wrap.getBoundingClientRect().width / W; ctx.strokeStyle = '#2E8BE6'; ctx.lineWidth = 11 * k; ctx.lineCap = ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };
  cv.onpointerdown = e => { drawing = true; inked = true; try { cv.setPointerCapture(e.pointerId); } catch (x) {} last = pos(e); seg(last, last); };
  cv.onpointermove = e => { if (!drawing) return; const p = pos(e); seg(last, p); last = p; };
  cv.onpointerup = cv.onpointercancel = () => { drawing = false; };
  $('#watch').onclick = () => { playDemo(); say(`Watch how to write ${n}. Start at the green dot.`); };
  $('#wclr').onclick = () => { ctx.clearRect(0, 0, cv.width, cv.height); inked = false; $('#wmsg').textContent = ''; };
  $('#wdone').onclick = () => {
    if (!inked) { say('Trace the grey number with your finger first!'); return; }
    const res = writeScore(cv, guide, len, W, H);
    if (res.cover >= 0.75 && res.stray <= 0.4) {
      const first = !st.write.done[n]; st.write.done[n] = today(); save();
      questTick('math'); addStars(first ? 2 : 1); yay(); confetti(25);
      $('#wmsg').textContent = `Beautiful ${n}! ${first ? '⭐⭐' : '⭐'}`; say(`Beautiful! You wrote ${n}!`);
      const here = $('#wdone'); setTimeout(() => { if ($('#wdone') !== here) return; const next = n < 20 && writeOpen(n + 1) ? n + 1 : null; next != null ? go(writeView, next) : go(writeHome); }, 2200);
    } else {
      oops(); const msg = res.cover < 0.75 ? 'Go over the whole grey number, from the green dot to the end.' : 'Try to stay on the grey line.';
      $('#wmsg').textContent = msg; say(msg + ' Tap Watch me to see how.');
    }
  };
  sayScreen(`Let's write ${n}. Start at the green dot and follow the grey line.`);
  setTimeout(playDemo, 400);
}
// How much of the guide was traced (cover), and how much ink landed away from it (stray).
function writeScore(cv, guide, len, W, H) {
  const sx = cv.width / W, sy = cv.height / H, data = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
  const ink = (x, y) => { x = Math.round(x); y = Math.round(y); return x >= 0 && y >= 0 && x < cv.width && y < cv.height && data[(y * cv.width + x) * 4 + 3] > 40; };
  let hit = 0, n = 0;
  for (let d = 0; d <= len; d += 3) {
    const p = guide.getPointAtLength(d); n++;
    const r = 9; let near = false;
    for (let dx = -r; dx <= r && !near; dx += 3) for (let dy = -r; dy <= r && !near; dy += 3) if (ink((p.x + dx) * sx, (p.y + dy) * sy)) near = true;
    if (near) hit++;
  }
  // Ink far from the guide: draw the guide fat on a mask and count ink outside it.
  const m = document.createElement('canvas'); m.width = cv.width; m.height = cv.height; const mc = m.getContext('2d');
  mc.setTransform(sx, 0, 0, sy, 0, 0); mc.lineWidth = 30; mc.lineCap = mc.lineJoin = 'round'; mc.stroke(new Path2D(guide.getAttribute('d')));
  const md = mc.getImageData(0, 0, m.width, m.height).data; let all = 0, out = 0;
  for (let i = 3; i < data.length; i += 16) if (data[i] > 40) { all++; if (md[i] < 40) out++; }
  return { cover: n ? hit / n : 0, stray: all ? out / all : 1 };
}
