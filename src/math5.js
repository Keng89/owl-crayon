/* ---------- math5: hands-on real-life math: money, clocks, my day, measuring, temperature and charts ---------- */
// Included right after math4.js. 11 topics. Some questions are hands-on: instead of answer buttons the child sets a
// clock by dragging its hands, pays with coins and notes, builds a bar chart, lines up blocks or puts pictures in
// order. Such a question carries `interact` (plain data, so it can be saved for spaced review) and the play screen
// mounts the matching widget from MX. Every hands-on question still has answer choices with the same values, which
// Owl's worked example, the quest and the tests use.

// Money: the grown-up picks the currency in the Grown-ups corner (dollars by default, as the app always used).
// Amounts are kept in whole small units (cents/pence): coins 1, 2, 5, 10, 20, 50 and notes worth 1, 5, 10 and 20.
const CURRENCIES = {
  usd: { big: '$', small: '¢', bn: ['dollar', 'dollars'], sn: ['cent', 'cents'], label: 'Dollars and cents ($, ¢)' },
  gbp: { big: '£', small: 'p', bn: ['pound', 'pounds'], sn: ['penny', 'pence'], label: 'Pounds and pence (£, p)' },
  eur: { big: '€', small: 'c', bn: ['euro', 'euros'], sn: ['cent', 'cents'], label: 'Euros and cents (€, c)' }
};
const curOf = () => CURRENCIES[store.get('currency', 'usd')] || CURRENCIES.usd;
const cash = c => { const k = curOf(); c = Math.round(c); if (c < 100) return c + k.small; return k.big + (c % 100 ? (c / 100).toFixed(2) : c / 100); };
const cashSay = c => { const k = curOf(), d = Math.floor(Math.round(c) / 100), r = Math.round(c) % 100, p = [];
  if (d) p.push(`${d} ${k.bn[d === 1 ? 0 : 1]}`); if (r || !d) p.push(`${r} ${k.sn[r === 1 ? 0 : 1]}`); return p.join(' and '); };
const MX = {}; // hands-on widgets: MX[kind].mount(el, cfg, answer, onChange) → { value(), lock(), hint(), wrong() }

(() => {
const K = '#22305A', RED = '#F2604F';
const C5 = (val, html, say, txt) => ({ html: String(html), val: String(val), say: String(say), txt: !!txt });
const Q5 = o => Object.assign(Q(o), o.interact ? { interact: o.interact } : {}, o.answerSay ? { answerSay: o.answerSay } : {});
const nOpts = (ans, lo, hi, n = 4, extra = []) => opts(ans, [...extra, ...near(ans)].filter(v => Number.isInteger(v) && v >= lo && v <= hi && v !== ans), n);
const T = (x, y, s, size = 14, fill = K, anchor = 'middle', w = 800) => `<text x="${+(+x).toFixed(1)}" y="${+(+y).toFixed(1)}" font-size="${size}" font-weight="${w}" text-anchor="${anchor}" fill="${fill}">${s}</text>`;
const E = (x, y, e, size = 24) => `<text x="${+(+x).toFixed(1)}" y="${+(+y).toFixed(1)}" font-size="${size}" text-anchor="middle" dominant-baseline="central">${e}</text>`;
const pic = (vb, body, label, cls = '') => `<div class="m5p ${cls}"><svg viewBox="${vb}" role="img" aria-label="${label}">${body}</svg></div>`;
const row = (...a) => `<div class="m5row">${a.join('')}</div>`;
const seqTo = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const sum = a => a.reduce((x, y) => x + y, 0);
let uid = 0;

/* ================= money pictures ================= */
const COINS = [1, 2, 5, 10, 20, 50], NOTES = [100, 500, 1000, 2000];
const COIN_LOOK = { 1: ['#D98C4A', 15], 2: ['#D98C4A', 17.5], 5: ['#C9D1DA', 16], 10: ['#C9D1DA', 14], 20: ['#F0CB55', 16.5], 50: ['#F0CB55', 18.5] };
const NOTE_LOOK = { 100: '#8DCB9C', 500: '#8EBEEB', 1000: '#F4B26E', 2000: '#C3AEE6' };
const coinSVG = v => { const [c, r] = COIN_LOOK[v], s = r / 18.5; return `<svg class="m5coin" viewBox="0 0 40 40" style="width:calc(var(--cw, 52px) * ${s.toFixed(2)})" role="img" aria-label="${cashSay(v)} coin"><circle cx="20" cy="20" r="18.5" fill="${c}" stroke="${K}" stroke-width="${(2 / s).toFixed(2)}"/><circle cx="20" cy="20" r="14" fill="none" stroke="${K}" stroke-opacity=".25" stroke-width="1.5"/>${T(20, 25.5, v + curOf().small, String(v).length > 1 ? 12.5 : 14)}</svg>`; };
const noteSVG = v => `<svg class="m5note" viewBox="0 0 100 52" role="img" aria-label="${cashSay(v)} note"><rect x="2" y="2" width="96" height="48" rx="6" fill="${NOTE_LOOK[v]}" stroke="${K}" stroke-width="2.5"/><rect x="8" y="8" width="84" height="36" rx="4" fill="none" stroke="${K}" stroke-opacity=".3" stroke-width="1.5"/><circle cx="72" cy="26" r="12" fill="#fff" fill-opacity=".6"/>${E(72, 27, '🦉', 15)}${T(32, 34, cash(v), 20)}</svg>`;
const cashPic = v => v >= 100 ? noteSVG(v) : coinSVG(v);
const cashRow = (list, cls = '') => `<div class="m5cash ${cls}">${list.map(cashPic).join('')}</div>`;
// Fewest coins and notes for an amount (biggest first). Works for this coin set.
const split = (c, set = [...NOTES, ...COINS]) => { const out = [], ds = [...set].sort((a, b) => b - a); for (const d of ds) while (c >= d) { out.push(d); c -= d; } return out; };
const kindOf = v => v >= 100 ? 'note' : 'coin';
const runSteps = list => { let t = 0; return list.map((v, i) => { t += v; return i ? `Add ${cash(v)}: ${cash(t)}.` : `Start with the biggest: ${cash(v)}.`; }); };
const TOYS5 = [['🧸', 'teddy bear'], ['🚗', 'toy car'], ['🪀', 'yo-yo'], ['🎈', 'balloon'], ['🪁', 'kite'], ['🦕', 'dinosaur'], ['🎲', 'dice'], ['🧩', 'puzzle'], ['🚂', 'toy train'], ['⚽', 'ball'], ['🛹', 'skateboard'], ['🤖', 'robot'], ['🎨', 'paint set'], ['🪆', 'doll']];
const tagSVG = (e, price) => pic('0 0 200 110', `<rect x="4" y="8" width="88" height="94" rx="16" fill="#FFF6E0" stroke="${K}" stroke-width="2.5"/>${E(48, 56, e, 52)}
  <path d="M104 30 L120 14 H192 V98 H120 L104 82 Z" fill="#FFC23D" stroke="${K}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="118" cy="56" r="5" fill="#fff" stroke="${K}" stroke-width="2"/>${T(156, 65, cash(price), String(cash(price)).length > 5 ? 22 : 28)}`, `price tag: ${cashSay(price)}`, 'sm');
const piggySVG = text => pic('0 0 200 110', `<ellipse cx="70" cy="62" rx="52" ry="38" fill="#F7B9C8" stroke="${K}" stroke-width="2.5"/><rect x="58" y="22" width="26" height="6" rx="3" fill="${K}"/><circle cx="96" cy="50" r="4" fill="${K}"/><ellipse cx="120" cy="64" rx="10" ry="12" fill="#F49AC1" stroke="${K}" stroke-width="2"/><rect x="38" y="92" width="12" height="14" fill="#F7B9C8" stroke="${K}" stroke-width="2"/><rect x="86" y="92" width="12" height="14" fill="#F7B9C8" stroke="${K}" stroke-width="2"/>
  <rect x="134" y="26" width="62" height="44" rx="10" fill="#fff" stroke="${K}" stroke-width="2.5"/>${T(165, 56, text, String(text).length > 4 ? 16 : 22)}`, `piggy bank: ${text}`, 'sm');
// Count up from one number to another in friendly jumps (to the next 10, the next 100, then the rest).
function hopsSVG(from, to, show = v => v) {
  const pts = [from]; let c = from;
  for (const s of [10, 100, 1000]) { const n = Math.ceil(c / s) * s; if (n > c && n < to && (to - c) > s / 2) { pts.push(n); c = n; } }
  pts.push(to);
  const X = v => 20 + (v - from) / (to - from) * 280; let g = `<line x1="12" y1="80" x2="308" y2="80" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`;
  pts.forEach((v, i) => { g += `<line x1="${X(v)}" y1="72" x2="${X(v)}" y2="88" stroke="${K}" stroke-width="2.5"/>${T(X(v), 104, show(v), 12, i === 0 || i === pts.length - 1 ? K : '#5A678C')}`;
    if (i) { const a = X(pts[i - 1]), b = X(v), m = (a + b) / 2; g += `<path d="M${a} 72 Q${m} ${Math.max(14, 72 - (b - a) * .7)} ${b} 72" fill="none" stroke="${RED}" stroke-width="2.5"/>${T(m, Math.max(24, 72 - (b - a) * .38) - 4, '+' + show(v - pts[i - 1]), 13, RED)}`; } });
  return pic('0 0 320 112', g, `count up from ${from} to ${to}`, 'wide');
}

/* ================= clocks ================= */
const tStr = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
const parseT = s => { const [h, m] = String(s).split(':').map(Number); return [h, m]; };
const nextH = h => h % 12 + 1, prevH = h => (h + 10) % 12 + 1;
const timeWords = (h, m) => m === 0 ? `${h} o'clock` : m === 30 ? `half past ${h}` : m === 15 ? `quarter past ${h}` : m === 45 ? `quarter to ${nextH(h)}` : m < 30 ? `${m} minute${m === 1 ? '' : 's'} past ${h}` : `${60 - m} minute${60 - m === 1 ? '' : 's'} to ${nextH(h)}`;
function faceBase() {
  let g = `<circle cx="100" cy="100" r="95" fill="#fff" stroke="${K}" stroke-width="6"/>`;
  for (let i = 0; i < 60; i++) { const a = i * 6 * Math.PI / 180, r1 = i % 5 ? 86 : 80; g += `<line x1="${(100 + r1 * Math.sin(a)).toFixed(1)}" y1="${(100 - r1 * Math.cos(a)).toFixed(1)}" x2="${(100 + 91 * Math.sin(a)).toFixed(1)}" y2="${(100 - 91 * Math.cos(a)).toFixed(1)}" stroke="${K}" stroke-width="${i % 5 ? 1.5 : 3.5}"/>`; }
  for (let i = 1; i <= 12; i++) { const a = i * 30 * Math.PI / 180; g += T(100 + 66 * Math.sin(a), 108 - 66 * Math.cos(a), i, 22); }
  return g;
}
const handLine = (deg, len, w, c, id) => { const a = deg * Math.PI / 180, x = 100 + len * Math.sin(a), y = 100 - len * Math.cos(a);
  return `<line x1="100" y1="100" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>${id ? `<circle data-hand="${id}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="12" fill="${c}" fill-opacity=".9" stroke="#fff" stroke-width="3"/>` : ''}`; };
const hands = (h, m, knobs) => handLine(((h % 12) + m / 60) * 30, 50, 10, K, knobs && 'h') + handLine(m * 6, 76, 7, RED, knobs && 'm') + `<circle cx="100" cy="100" r="7" fill="${K}"/>`;
const faceSVG = (h, m, cls = 'm5face') => `<svg class="${cls}" viewBox="0 0 200 200" role="img" aria-label="clock showing ${timeWords(h, m)}">${faceBase()}${hands(h, m)}</svg>`;
const clockPic = (h, m) => `<div class="m5p sm">${faceSVG(h, m)}</div>`;
const digiSVG = s => pic('0 0 170 70', `<rect x="3" y="3" width="164" height="64" rx="14" fill="${K}"/><rect x="11" y="11" width="148" height="48" rx="8" fill="#10182E"/>${T(85, 50, s, 36, '#7CF29A', 'middle', 700)}`, `digital clock: ${s}`, 'xs');

/* ================= the hands-on widgets ================= */
const btn = (a, label, aria) => `<button class="m5b" data-a="${a}" aria-label="${aria || label}">${label}</button>`;
// Set the clock: drag either hand (the nearer tip is picked up), or use the buttons. Snaps to cfg.step minutes.
MX.clock = { mount(el, cfg, ans, onChange) {
  const step = cfg.step || 5, bstep = step === 60 ? 60 : step;
  let t = ((cfg.h0 % 12) * 60 + cfg.m0) % 720, locked = false, drag = null, lastM = 0;
  el.innerHTML = `<div class="m5clock"><svg class="m5face m5set" viewBox="0 0 200 200" role="img" aria-label="a clock to set: drag the hands">${faceBase()}<g class="m5h"></g></svg>
    <div class="m5cbtns"><div class="m5grp"><b>Short hand</b>${btn('h-', '◀', 'short hand back')}${btn('h+', '▶', 'short hand forward')}</div>
    <div class="m5grp"><b>Long hand</b>${step === 1 ? btn('m-5', '◀◀', 'long hand back 5 minutes') : ''}${btn('m-', '◀', 'long hand back')}${btn('m+', '▶', 'long hand forward')}${step === 1 ? btn('m+5', '▶▶', 'long hand forward 5 minutes') : ''}</div></div></div>`;
  const svg = el.querySelector('svg'), g = el.querySelector('.m5h');
  const hm = () => { const h = Math.floor(t / 60) % 12; return [h || 12, t % 60]; };
  const draw = () => { const [h, m] = hm(); g.innerHTML = hands(h, m, true); svg.setAttribute('aria-label', 'clock you are setting'); if (onChange) onChange(tStr(h, m)); };
  const norm = () => { t = ((t % 720) + 720) % 720; };
  const ang = e => { const r = svg.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 200 - 100, y = (e.clientY - r.top) / r.height * 200 - 100; return [(Math.atan2(x, -y) * 180 / Math.PI + 360) % 360, Math.hypot(x, y)]; };
  const move = e => {
    const [a] = ang(e);
    if (drag === 'm') { const nm = Math.round(a / 6) % 60; if (lastM >= 45 && nm < 15) t += 60; else if (lastM < 15 && nm >= 45) t -= 60; t = Math.floor(t / 60) * 60 + nm; lastM = nm; }
    else { const m = t % 60; let h = Math.round((a - m * 0.5) / 30); h = ((h % 12) + 12) % 12; t = h * 60 + m; }
    norm(); draw();
  };
  svg.addEventListener('pointerdown', e => {
    if (locked) return;
    const [h, m] = hm(), r = svg.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * 200, py = (e.clientY - r.top) / r.height * 200;
    const tip = (deg, len) => [100 + len * Math.sin(deg * Math.PI / 180), 100 - len * Math.cos(deg * Math.PI / 180)];
    const [hx, hy] = tip(((h % 12) + m / 60) * 30, 50), [mx, my] = tip(m * 6, 76);
    if (Math.hypot(px - 100, py - 100) < 14) return;
    drag = Math.hypot(px - hx, py - hy) < Math.hypot(px - mx, py - my) ? 'h' : 'm'; lastM = m;
    try { svg.setPointerCapture(e.pointerId); } catch (x) {}
    e.preventDefault(); move(e); tone([620], .04);
  });
  svg.addEventListener('pointermove', e => { if (drag && !locked) { e.preventDefault(); move(e); } });
  const end = () => { if (!drag) return; if (drag === 'm' || step === 60) { t = Math.round(t / step) * step; norm(); } drag = null; draw(); };
  svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end); svg.addEventListener('lostpointercapture', end);
  el.querySelectorAll('.m5b').forEach(b => b.onclick = () => { if (locked) return; const a = b.dataset.a;
    t += a === 'h-' ? -60 : a === 'h+' ? 60 : a === 'm-' ? -bstep : a === 'm+' ? bstep : a === 'm-5' ? -5 : 5; norm(); draw(); tone([520], .04); });
  draw();
  return {
    value: () => tStr(...hm()),
    lock() { locked = true; el.classList.add('m5locked'); },
    wrong() {},
    hint() { const [H, M] = parseT(ans), [h, m] = hm();
      if (m !== M) { t = (h % 12) * 60 + M; norm(); draw(); return `Owl moved the long hand for you. Now point the short hand at ${M >= 30 && M !== 30 ? `just before ${nextH(H)}` : H}.`; }
      return `The long hand is right. The short hand shows the hour: ${H}.`; },
    set(s) { const [h, m] = parseT(s); t = (h % 12) * 60 + m; norm(); draw(); }
  };
} };

// Pay with coins and notes: tap money in the tray to put it on the counter, tap it on the counter to take it back.
MX.pay = { mount(el, cfg, ans, onChange) {
  let paid = [], locked = false;
  el.innerHTML = `<div class="m5pay"><div class="m5counter"><div class="m5paid"></div><b class="m5tot" aria-live="polite"></b></div>
    <div class="m5tray">${cfg.tray.map(v => `<button class="m5money" data-c="${v}" aria-label="${cashSay(v)} ${kindOf(v)}">${cashPic(v)}</button>`).join('')}</div></div>`;
  const total = () => sum(paid);
  const show = () => {
    el.querySelector('.m5paid').innerHTML = paid.length ? paid.map((v, i) => `<button class="m5money m5back" data-i="${i}" aria-label="take back ${cashSay(v)}">${cashPic(v)}</button>`).join('') : `<span class="m5empty">${cfg.change ? 'Tap the money to give change' : 'Tap the money to pay'}</span>`;
    el.querySelector('.m5tot').textContent = paid.length ? `${cfg.change ? 'Change' : 'You gave'}: ${cash(total())}` : '';
    el.querySelectorAll('.m5back').forEach(b => b.onclick = () => { if (locked) return; paid.splice(+b.dataset.i, 1); tone([300], .06); show(); if (onChange) onChange(total()); });
  };
  el.querySelectorAll('.m5tray .m5money').forEach(b => b.onclick = () => {
    if (locked || paid.length >= 30) return;
    paid.push(+b.dataset.c); paid.sort((x, y) => y - x); tone([480 + paid.length * 30], .05); show();
    el.querySelectorAll('.m5glow').forEach(x => x.classList.remove('m5glow'));
    if (onChange) onChange(total());
  });
  show();
  return {
    value: () => paid.length ? String(total()) : null, total, lock() { locked = true; el.classList.add('m5locked'); }, wrong() {},
    clear() { paid = []; show(); },
    hint() { const want = +ans, t = total();
      if (t > want) return `That is ${cash(t)}, too much. Tap money on the counter to take it back.`;
      const left = want - t, c = [...cfg.tray].sort((a, b) => b - a).find(v => v <= left);
      if (!c) return 'Take some money back and try again.';
      const b = el.querySelector(`.m5tray [data-c="${c}"]`); if (b) b.classList.add('m5glow');
      return `${t ? `You have ${cash(t)}. ` : ''}Try the ${cash(c)} ${kindOf(c)}: it is the biggest one that fits.`; }
  };
} };

// Build a bar chart: tap a square to make the bar that tall (tap the top again to lower it), or use − and +.
MX.bars = { mount(el, cfg, ans, onChange) {
  const n = cfg.cats.length, rows = Math.round(cfg.max / cfg.step), h = (cfg.start || []).slice(0, n).concat(Array(n).fill(0)).slice(0, n);
  let locked = false;
  const cols = ['#F2604F', '#2E8BE6', '#2FA36B', '#FFC23D', '#6D55D1'];
  el.innerHTML = `<div class="m5bars" style="--n:${n};--rows:${rows}">
    <div class="m5axis">${Array.from({ length: rows }, (_, i) => `<span>${(rows - i) * cfg.step}</span>`).join('')}<span>0</span></div>
    ${cfg.cats.map(([e, nm], j) => `<div class="m5col" data-j="${j}" style="--c:${cols[j % 5]}">${Array.from({ length: rows }, (_, i) => `<button class="m5cell" data-j="${j}" data-k="${rows - i}" aria-label="${nm}: ${(rows - i) * cfg.step}"></button>`).join('')}
      <div class="m5lab">${e}</div><div class="m5pm">${btn('-' + j, '−', `${nm} lower`)}${btn('+' + j, '+', `${nm} higher`)}</div></div>`).join('')}</div>`;
  const draw = () => { el.querySelectorAll('.m5cell').forEach(c => c.classList.toggle('on', +c.dataset.k * cfg.step <= h[+c.dataset.j])); if (onChange) onChange(h.join(',')); };
  el.querySelectorAll('.m5cell').forEach(c => c.onclick = () => { if (locked) return; const j = +c.dataset.j, v = +c.dataset.k * cfg.step;
    h[j] = h[j] === v ? v - cfg.step : v; tone([300 + h[j] / cfg.step * 40], .05); draw(); });
  el.querySelectorAll('.m5pm .m5b').forEach(b => b.onclick = () => { if (locked) return; const j = +b.dataset.a.slice(1), up = b.dataset.a[0] === '+';
    h[j] = clamp(h[j] + (up ? cfg.step : -cfg.step), 0, cfg.max); tone([300 + h[j] / cfg.step * 40], .05); draw(); });
  draw();
  return {
    value: () => h.some(v => v) ? h.join(',') : null, lock() { locked = true; el.classList.add('m5locked'); }, wrong() {},
    hint() { const want = String(ans).split(',').map(Number), j = want.findIndex((v, i) => v !== h[i]);
      if (j < 0) return 'Your bars look right. Tap Check!';
      h[j] = want[j]; draw(); return `Owl built the ${cfg.cats[j][1]} bar for you: ${want[j]}. Now check the others.`; }
  };
} };

// Put pictures in order: tap the first one, then the next... Tap a numbered one to undo from there.
MX.order = { mount(el, cfg, ans, onChange) {
  let seq = [], locked = false;
  el.innerHTML = `<div class="m5order" style="--n:${cfg.items.length}">${cfg.items.map(([e, nm], i) => `<button class="m5card" data-i="${i}" aria-label="${nm}"><span class="m5num"></span><span class="m5e">${e}</span><span class="m5t">${nm}</span></button>`).join('')}</div>
    <div class="row">${btn('reset', '↺ Start again', 'start again')}</div>`;
  const draw = () => { el.querySelectorAll('.m5card').forEach(b => { const k = seq.indexOf(+b.dataset.i); b.classList.toggle('on', k >= 0); b.querySelector('.m5num').textContent = k >= 0 ? k + 1 : ''; }); if (onChange) onChange(seq.length); };
  el.querySelectorAll('.m5card').forEach(b => b.onclick = () => { if (locked) return; const i = +b.dataset.i, k = seq.indexOf(i);
    if (k >= 0) seq = seq.slice(0, k); else { seq.push(i); say(cfg.items[i][1]); } tone([440 + seq.length * 60], .06); draw(); });
  el.querySelector('[data-a="reset"]').onclick = () => { if (locked) return; seq = []; draw(); };
  draw();
  return {
    value: () => seq.length === cfg.items.length ? seq.map(i => cfg.items[i][1]).join(' > ') : null, lock() { locked = true; el.classList.add('m5locked'); },
    wrong() { seq = []; draw(); },
    hint() { const want = String(ans).split(' > '); let k = 0; while (k < seq.length && cfg.items[seq[k]][1] === want[k]) k++;
      if (k >= want.length) return 'That order is right. Tap Check!';
      seq = seq.slice(0, k); seq.push(cfg.items.findIndex(x => x[1] === want[k])); draw();
      return `${k ? 'Your first ones are right. ' : ''}Next comes: ${want[k]}.`; }
  };
} };

// Measure with blocks: add blocks under the thing, end to end, until they reach its end.
const BU = 30; // one block, in picture units
function blockPic(len, n, max, thing = 'pencil') {
  const W = max * BU + 30; let g = '';
  if (thing === 'pencil') g += `<rect x="10" y="20" width="${len * BU - 18}" height="22" rx="4" fill="#FFC23D" stroke="${K}" stroke-width="2"/><polygon points="${10 + len * BU - 18},20 ${10 + len * BU},31 ${10 + len * BU - 18},42" fill="#F7D9A8" stroke="${K}" stroke-width="2" stroke-linejoin="round"/><rect x="10" y="20" width="10" height="22" fill="#F49AC1" stroke="${K}" stroke-width="2"/>`;
  else g += `<path d="M10 31 q${len * BU / 4} -16 ${len * BU / 2} 0 t${len * BU / 2} 0" fill="none" stroke="#2FA36B" stroke-width="12" stroke-linecap="round"/>${E(10 + len * BU - 4, 26, '👀', 14)}`;
  g += `<line x1="10" y1="10" x2="10" y2="96" stroke="${K}" stroke-width="2" stroke-dasharray="4 3"/><line x1="${10 + len * BU}" y1="10" x2="${10 + len * BU}" y2="96" stroke="${RED}" stroke-width="2" stroke-dasharray="4 3"/>`;
  for (let i = 0; i < max; i++) g += i < n ? `<rect x="${10 + i * BU}" y="58" width="${BU}" height="${BU}" fill="${['#2E8BE6', '#F2604F', '#2FA36B', '#6D55D1'][i % 4]}" stroke="${K}" stroke-width="2"/>` : `<rect x="${10 + i * BU + 1}" y="59" width="${BU - 2}" height="${BU - 2}" fill="none" stroke="#CCDBE6" stroke-width="1.5" stroke-dasharray="3 3"/>`;
  return `<svg class="m5blk" viewBox="0 0 ${W} 100" role="img" aria-label="a ${thing} ${n ? `with ${n} blocks under it` : 'to measure with blocks'}">${g}</svg>`;
}
MX.blocks = { mount(el, cfg, ans, onChange) {
  let n = 0, locked = false;
  el.innerHTML = `<div class="m5blocks"><div class="m5bpic"></div><div class="m5cbtns">${btn('b-', '➖ Take one', 'take a block away')}${btn('b+', '➕ Add a block', 'add a block')}</div><b class="m5tot" aria-live="polite"></b></div>`;
  const draw = () => { el.querySelector('.m5bpic').innerHTML = blockPic(cfg.len, n, cfg.max, cfg.thing); el.querySelector('.m5tot').textContent = n ? `${n} block${n > 1 ? 's' : ''}` : ''; if (onChange) onChange(n);
    el.querySelectorAll('.m5bpic rect').forEach(() => {}); };
  el.querySelector('.m5bpic').onclick = e => { if (locked) return; const r = e.currentTarget.querySelector('svg').getBoundingClientRect(), x = (e.clientX - r.left) / r.width * (cfg.max * BU + 30);
    const k = clamp(Math.ceil((x - 10) / BU), 0, cfg.max); n = n === k ? k - 1 : k; tone([400 + n * 30], .05); draw(); };
  el.querySelectorAll('.m5cbtns .m5b').forEach(b => b.onclick = () => { if (locked) return; n = clamp(n + (b.dataset.a === 'b+' ? 1 : -1), 0, cfg.max); tone([400 + n * 30], .05); draw(); });
  draw();
  return { value: () => n ? String(n) : null, lock() { locked = true; el.classList.add('m5locked'); }, wrong() {},
    hint() { return n < cfg.len ? 'Keep adding blocks until they reach the red line at the end.' : n > cfg.len ? 'Too many! The blocks go past the red line. Take some away.' : 'That looks right. Tap Check!'; } };
} };

/* ================= Seedling Hill (world 0) ================= */

S('coins5', 0, 'Coins and notes', '🪙', [
  ['Money comes as coins and notes. Coins are round and made of metal.', () => cashRow(COINS)],
  ['Notes are paper or plastic. They are worth more than coins.', () => cashRow(NOTES)],
  ['Look at the number, not the size! This small coin is worth more than the big one.', () => cashRow([10, 2])],
  ['Five 1s make 5. So one 5 coin buys the same as five 1 coins.', () => row(cashRow([1, 1, 1, 1, 1]), '<span class="m5op">=</span>', cashRow([5]))]
], L => {
  if (L === 1) {
    const set = shuffle([1, 2, 5, 10]).slice(0, 3), v = pick(set);
    return Q({ prompt: `Find the ${cash(v)} coin`, speak: `Find the ${cashSay(v)} coin.`, visual: piggySVG(cash(v)), choices: set.map(c => C5(c, coinSVG(c), `${cashSay(c)} coin`)), answer: v,
      explain: cashRow([v]), steps: ['Look at the number on each coin.', `This one says ${cash(v)}.`], explainText: `That is the ${cashSay(v)} coin.` });
  }
  if (L === 2) {
    const [a, b] = shuffle(COINS).slice(0, 2), more = Math.random() < 0.6, t = more ? Math.max(a, b) : Math.min(a, b);
    return Q({ prompt: `Which coin is worth ${more ? 'more' : 'less'}?`, speak: `Which coin is worth ${more ? 'more' : 'less'}: ${cashSay(a)} or ${cashSay(b)}?`, visual: piggySVG(more ? 'more?' : 'less?'),
      choices: [a, b].map(c => C5(c, coinSVG(c), `${cashSay(c)} coin`)), answer: t, explain: cashRow([Math.max(a, b), Math.min(a, b)]),
      steps: ['Do not look at how big the coin is.', `Read the numbers: ${Math.max(a, b)} is more than ${Math.min(a, b)}.`], explainText: `The ${cash(t)} coin is worth ${more ? 'more' : 'less'}.` });
  }
  if (L === 3) {
    const [small, big] = pick([[1, 2], [1, 5], [1, 10], [2, 10], [5, 10], [5, 20], [10, 20], [10, 50], [2, 20]]), k = big / small;
    return Q({ prompt: `How many ${cash(small)} coins make ${cash(big)}?`, speak: `How many ${cashSay(small)} coins make ${cashSay(big)}?`, visual: row(cashRow([big]), '<span class="m5op">= ?</span>', cashRow([small])),
      choices: nOpts(k, 1, 25, 4, [k + 1, k - 1, big, small + 1]), answer: k, explain: cashRow(Array(k).fill(small)),
      steps: [`Count in ${small}s until you reach ${big}: ${Array.from({ length: k }, (_, i) => (i + 1) * small).join(', ')}.`, `That is ${k} coins.`], explainText: `${k} coins of ${cash(small)} make ${cash(big)}.` });
  }
  if (L === 4) {
    if (Math.random() < 0.5) {
      const v = pick(NOTES), coinTwin = v / 100 <= 50 && COINS.includes(v / 100) ? v / 100 : pick(COINS), others = shuffle(NOTES.filter(x => x !== v)).slice(0, 2);
      const ch = shuffle([v, coinTwin, ...others]).map(c => C5(c, cashPic(c), `${cashSay(c)} ${kindOf(c)}`));
      return Q({ prompt: `Find the ${cash(v)} note`, speak: `Find the ${cashSay(v)} note.`, visual: piggySVG(cash(v)), choices: ch, answer: v, explain: cashRow([v]),
        steps: ['Notes are flat rectangles. Coins are round.', `Find the note that says ${cash(v)}.`], explainText: `This is the ${cashSay(v)} note.${coinTwin === v / 100 ? ` The ${cash(coinTwin)} coin is a lot less!` : ''}` });
    }
    const set = shuffle([...shuffle(COINS).slice(0, 2), ...shuffle(NOTES).slice(0, 2)]), most = Math.random() < 0.6, t = most ? Math.max(...set) : Math.min(...set);
    return Q({ prompt: `Which is worth the ${most ? 'most' : 'least'}?`, speak: `Which is worth the ${most ? 'most' : 'least'}?`, visual: piggySVG(most ? 'most?' : 'least?'),
      choices: set.map(c => C5(c, cashPic(c), `${cashSay(c)} ${kindOf(c)}`)), answer: t, explain: cashRow([...set].sort((a, b) => b - a)),
      steps: ['Read the number on each one.', 'Remember: 100 small ones make 1 big one, so notes are worth more than coins.', `In order: ${[...set].sort((a, b) => b - a).map(cash).join(', ')}.`], explainText: `${cash(t)} is worth the ${most ? 'most' : 'least'}.` });
  }
  const amt = rnd(11, 99), list = split(amt, COINS), k = list.length;
  return Q({ prompt: `What is the fewest coins that make ${cash(amt)}?`, speak: `What is the smallest number of coins that make ${cashSay(amt)}?`, visual: piggySVG(cash(amt)), choices: nOpts(k, 1, 12, 4, [k + 1, k - 1, k + 2]), answer: k,
    explain: cashRow(list), steps: ['Use the biggest coin that fits, again and again.', ...runSteps(list).slice(0, 6)], explainText: `${k} coins: ${list.map(cash).join(' + ')} = ${cash(amt)}.` });
});

/* --- my day, and things that happen in order --- */
const DAY = [['🛏️', 'wake up', 'morning'], ['🥣', 'eat breakfast', 'morning'], ['🎒', 'go to school', 'morning'], ['🥪', 'eat lunch', 'afternoon'],
  ['🛝', 'play in the park', 'afternoon'], ['🍝', 'eat dinner', 'evening'], ['🛁', 'have a bath', 'evening'], ['📖', 'bedtime story', 'evening'], ['😴', 'go to sleep', 'night']];
// Only things that always come in this order, for the "what comes next" and ordering questions.
const DAYORDER = [['🛏️', 'wake up'], ['🥣', 'eat breakfast'], ['🎒', 'go to school'], ['🥪', 'eat lunch'], ['🍝', 'eat dinner'], ['😴', 'go to sleep']];
const SEQS = [
  [['🫘', 'plant a seed'], ['💧', 'water it'], ['🌱', 'it sprouts'], ['🌻', 'it flowers']],
  [['🥚', 'an egg'], ['🐣', 'it hatches'], ['🐥', 'a chick'], ['🐔', 'a hen']],
  [['❄️', 'snow falls'], ['⚪', 'roll a snowball'], ['⛄', 'build a snowman'], ['☀️', 'the sun melts it']],
  [['🍞', 'take some bread'], ['🧈', 'spread the butter'], ['🧀', 'add the cheese'], ['🥪', 'eat the sandwich']],
  [['🧦', 'put on socks'], ['👟', 'put on shoes'], ['🚪', 'open the door'], ['🌳', 'walk to the park']],
  [['🎂', 'bake a cake'], ['🕯️', 'add candles'], ['🎶', 'sing Happy Birthday'], ['🍰', 'eat the cake']],
  [['🌧️', 'it rains'], ['🌦️', 'the sun comes out'], ['🌈', 'a rainbow'], ['🌙', 'night time']]
];
const PARTS = { morning: '🌅', afternoon: '☀️', evening: '🌇', night: '🌙' };
const daySVG = hi => { const xs = { morning: 50, afternoon: 130, evening: 210, night: 280 };
  let g = `<rect x="0" y="0" width="320" height="110" rx="14" fill="#D9EBFC"/><rect x="240" y="0" width="80" height="110" rx="14" fill="#22305A" fill-opacity=".85"/><path d="M14 90 Q130 -10 246 90" fill="none" stroke="#FFC23D" stroke-width="3" stroke-dasharray="6 5"/><rect x="0" y="90" width="320" height="20" rx="6" fill="#8FD1A6"/>`;
  for (const [k, x] of Object.entries(xs)) g += E(x, k === 'afternoon' ? 34 : k === 'night' ? 40 : 66, PARTS[k], 26) + T(x, 104, k, 11, k === 'night' ? '#fff' : K) + (hi === k ? `<circle cx="${x}" cy="${k === 'afternoon' ? 34 : k === 'night' ? 40 : 66}" r="22" fill="none" stroke="${RED}" stroke-width="3"/>` : '');
  return pic('0 0 320 110', g, 'a day from morning to night', 'wide'); };
const stripSVG = (items, q = true) => { const n = items.length + (q ? 1 : 0), W = n * 84 + 10; let g = '';
  items.forEach(([e, nm], i) => { g += `<rect x="${8 + i * 84}" y="6" width="74" height="74" rx="14" fill="#FFF6E0" stroke="${K}" stroke-width="2.5"/>${E(45 + i * 84, 43, e, 38)}${i < n - 1 ? `<path d="M${83 + i * 84} 37 l7 6 l-7 6" fill="none" stroke="${K}" stroke-width="2.5"/>` : ''}`; });
  if (q) g += `<rect x="${8 + items.length * 84}" y="6" width="74" height="74" rx="14" fill="#fff" stroke="${RED}" stroke-width="3" stroke-dasharray="7 5"/>${T(45 + items.length * 84, 58, '?', 40, RED)}`;
  return pic(`0 0 ${W} 86`, g, `${items.map(x => x[1]).join(', ')}${q ? ', then what?' : ''}`, 'wide'); };
const DUR = [['👁️', 'blink your eyes', 'seconds', 0], ['🥤', 'drink a glass of water', 'seconds', 1], ['🪥', 'brush your teeth', 'minutes', 2], ['🍽️', 'eat your lunch', 'minutes', 3], ['🎬', 'watch a film', 'hours', 4], ['😴', 'sleep at night', 'hours', 5]];
const MEALS = [['🥣', 'breakfast', 7], ['🥪', 'lunch', 12], ['🍝', 'dinner', 6], ['😴', 'bedtime', 8]];
S('myday', 0, 'My day', '🌞', [
  ['A day goes morning, afternoon, evening, then night.', () => daySVG()],
  ['We wake up and eat breakfast in the morning. We sleep at night.', () => stripSVG([DAY[0], DAY[1]], false)],
  ['Things happen in order: first, next, then, last. A seed grows into a flower.', () => stripSVG(SEQS[0], false)],
  ['Some things are quick, like a blink: seconds. Some take minutes, like brushing teeth. Sleeping takes hours!', () => stripSVG([DUR[0], DUR[2], DUR[5]], false)]
], L => {
  if (L === 1) {
    const it = pick(DAY.filter(d => d[2] !== 'evening' && d[1] !== 'play in the park')), parts = ['morning', 'afternoon', 'night'];
    return Q({ prompt: `When do we usually ${it[1]}? ${it[0]}`, speak: `When do we usually ${it[1]}? In the morning, the afternoon, or at night?`, visual: daySVG(), choices: parts.map(p => C5(p, `${PARTS[p]} ${p}`, p, true)), answer: it[2],
      explain: daySVG(it[2]), explainText: `We usually ${it[1]} in the ${it[2]}.` });
  }
  if (L === 2) {
    const s = Math.random() < 0.5 ? DAYORDER : pick(SEQS), i = rnd(0, s.length - 3), ans = s[i + 2];
    const wrong = shuffle(s.filter((x, j) => j !== i + 2 && j !== i + 1 && j !== i)).slice(0, 2);
    return Q({ prompt: 'What comes next?', speak: `First ${s[i][1]}, then ${s[i + 1][1]}. What comes next?`, visual: stripSVG([s[i], s[i + 1]]), choices: shuffle([ans, ...wrong]).map(x => C5(x[1], x[0], x[1])), answer: ans[1],
      explain: stripSVG([s[i], s[i + 1], ans], false), explainText: `${s[i][1]}, then ${s[i + 1][1]}, then ${ans[1]}.` });
  }
  if (L <= 4) {
    const n = L === 3 ? 3 : 4, base = Math.random() < 0.4 ? (() => { const st0 = rnd(0, DAYORDER.length - n); return DAYORDER.slice(st0, st0 + n); })() : pick(SEQS).slice(0, n);
    let shown; do shown = shuffle(base); while (shown.every((x, i) => x === base[i]));
    const ans = base.map(x => x[1]).join(' > '), perms = new Set([ans]);
    for (let t = 0; perms.size < 4 && t < 50; t++) perms.add(shuffle(base).map(x => x[1]).join(' > '));
    const em = s => s.split(' > ').map(w => base.find(b => b[1] === w)[0]).join(' → ');
    return Q5({ prompt: 'Tap the pictures in order: first to last', speak: `Put them in order. What happens first? Tap the pictures from first to last: ${shown.map(x => x[1]).join(', ')}.`, visual: stripSVG(shown, false),
      choices: [...perms].map(s => C5(s, `<span class="m5seq">${em(s)}</span>`, s.replace(/ > /g, ', then '))), answer: ans, interact: { kind: 'order', items: shown, own: true }, answerSay: ans.replace(/ > /g, ', then '),
      explain: stripSVG(base, false), steps: ['Think: which one has to happen first?', ...base.slice(1).map((x, i) => `After ${base[i][1]} comes ${x[1]}.`)], explainText: `The order is: ${base.map(x => x[1]).join(', then ')}.` });
  }
  const k = pick(['long', 'unit', 'clock']);
  if (k === 'long') {
    const set = shuffle(DUR).slice(0, 3), most = Math.random() < 0.6, t = set.reduce((a, b) => (most ? b[3] > a[3] : b[3] < a[3]) ? b : a);
    return Q({ prompt: `Which takes the ${most ? 'longest' : 'shortest'} time?`, speak: `Which takes the ${most ? 'longest' : 'shortest'} time: ${set.map(x => x[1]).join(', ')}?`, visual: stripSVG(set.map(x => [x[0], x[1]]), false),
      choices: set.map(x => C5(x[1], `${x[0]} ${x[1]}`, x[1], true)), answer: t[1], explainText: `To ${t[1]} takes ${t[2]}. ${set.filter(x => x !== t).map(x => `To ${x[1]} takes ${x[2]}.`).join(' ')}` });
  }
  if (k === 'unit') {
    const x = pick(DUR);
    return Q({ prompt: `To ${x[1]} takes a few…`, speak: `To ${x[1]} takes a few what? Seconds, minutes or hours?`, visual: stripSVG([[x[0], x[1]]], false), choices: ['seconds', 'minutes', 'hours'].map(u => C5(u, u, u, true)), answer: x[2],
      steps: ['Seconds are very quick: say "one elephant".', 'Minutes are longer: a song lasts about 3 minutes.', 'Hours are long: a night of sleep is about 10 hours.'], explainText: `To ${x[1]} takes a few ${x[2]}.` });
  }
  const [e, nm, h] = pick(MEALS), others = shuffle(MEALS.filter(x => x[2] !== h)).slice(0, 2).map(x => x[2]);
  return Q({ prompt: `${nm[0].toUpperCase() + nm.slice(1)} is at ${h} o'clock. Which clock shows it?`, speak: `${nm} is at ${h} o'clock. Which clock shows ${h} o'clock?`, visual: stripSVG([[e, nm]], false),
    choices: shuffle([h, ...others]).map(v => C5(v, faceSVG(v, 0, 'm5face m5fc'), `${v} o'clock`)), answer: h, explain: clockPic(h, 0), steps: ['The long hand points up to 12 for o\'clock.', `The short hand points to ${h}.`], explainText: `This clock shows ${h} o'clock: ${nm} time!` });
});

/* ================= Sprout Valley (world 1) ================= */

S('purse', 1, 'Count the purse', '👛', [
  ['To count money, sort it first: biggest on the left.', () => cashRow([10, 5, 2, 1])],
  ['Start with the biggest and count on: 10, then 15, 17, 18.', () => cashRow([10, 5, 2, 1])],
  ['Notes first, then coins. 100 small ones make 1 big one.', () => cashRow([500, 100, 50, 20])]
], L => {
  const kinds = [[1, 2], [1, 2, 5, 10], [5, 10, 20], [1, 2, 5, 10, 20, 50], null][L - 1];
  let list;
  if (L < 5) { const n = rnd(2, [4, 5, 5, 6][L - 1]); do list = Array.from({ length: n }, () => pick(kinds)); while (L === 1 && sum(list) > 10); }
  else list = [...Array.from({ length: rnd(1, 2) }, () => pick([100, 500, 1000])), ...Array.from({ length: rnd(2, 3) }, () => pick([5, 10, 20, 50]))];
  const tot = sum(list), sorted = [...list].sort((a, b) => b - a), small = Math.min(...list);
  return Q({ prompt: 'How much money is in the purse?', speak: 'Count the money. How much is in the purse?', visual: `<div class="m5purse">${cashRow(shuffle(list))}</div>`,
    choices: opts(tot, [tot + small, tot - small, tot + 1, tot - 1, tot + 10, tot - 10, tot + 5, list.length].filter(v => v > 0), 4, cash, cashSay), answer: tot,
    explain: cashRow(sorted), steps: ['Sort the money: biggest first.', ...runSteps(sorted)], explainText: `Altogether: ${cash(tot)}.` });
});

S('toyshop', 1, 'Toy shop', '🧸', [
  ['At the toy shop, every toy has a price. Pay the exact price with your coins.', () => tagSVG('🧸', 7)],
  ['Use the biggest coin that fits first. 7: a 5, then a 2. That makes 7!', () => cashRow([5, 2])],
  ['Tap the money to put it on the counter. Tap it again to take it back.', () => cashRow([2, 1, 1])]
], L => {
  const [e, nm] = pick(TOYS5), tray = [[1, 2], [1, 2, 5], [1, 2, 5, 10, 20], COINS, [...COINS, ...NOTES]][L - 1];
  const price = [rnd(2, 5), rnd(6, 10), rnd(11, 30), rnd(31, 99), rnd(21, 499) * 5][L - 1], best = split(price, tray);
  const sets = [best], tots = new Set([price]);
  for (const d of shuffle([1, -1, 2, -2, 5, -5, 10, -10, L === 5 ? 100 : 3, L === 5 ? -100 : -3])) { const v = price + d; if (sets.length < 4 && v > 0 && !tots.has(v)) { tots.add(v); sets.push(split(v, tray)); } }
  return Q5({ prompt: `Pay exactly ${cash(price)} for the ${nm}`, speak: `The ${nm} costs ${cashSay(price)}. Tap the money to pay exactly ${cashSay(price)}.`, visual: tagSVG(e, price),
    choices: shuffle(sets).map(s => C5(sum(s), `<span class="m5mini">${cashRow(s)}</span>`, cashSay(sum(s)))), answer: price, answerSay: cashSay(price),
    interact: { kind: 'pay', tray, empty: 'Tap the money to pay, then tap Check.' },
    explain: cashRow(best), steps: ['Find the biggest coin that is not too much.', ...runSteps(best)], explainText: `${best.map(cash).join(' + ')} = ${cash(price)}. Exactly right!` });
});

S('setclock', 1, 'Set the clock', '⏰', [
  ['The short hand shows the hour. The long hand shows the minutes.', () => clockPic(3, 0)],
  ['O\'clock: the long hand points straight up to 12. Move the short hand to the hour.', () => clockPic(8, 0)],
  ['Half past: the long hand points down to 6. The short hand is half way to the next number.', () => clockPic(4, 30)],
  ['Quarter past: the long hand on 3. Quarter to: the long hand on 9. Each number is 5 minutes.', () => row(clockPic(2, 15), clockPic(2, 45))]
], L => {
  const later = L === 5 && Math.random() < 0.5, step = later ? 5 : [60, 30, 15, 5, 1][L - 1];
  let h = rnd(1, 12), m = L === 1 ? 0 : L === 2 ? pick([30, 30, 0]) : L === 3 ? pick([15, 45, 15, 45, 30]) : L === 4 ? rnd(1, 11) * 5 : rnd(1, 59), sh, sm, add;
  if (later) { sh = h; sm = rnd(0, 11) * 5; add = pick([10, 15, 20, 25, 30, 40, 45, 50]); const t = sh * 60 + sm + add; h = (Math.floor(t / 60) - 1) % 12 + 1; m = t % 60; }
  const ans = tStr(h, m);
  let h0 = h, m0 = m; while (tStr(h0, m0) === ans || (L === 1 && h0 === h)) { h0 = rnd(1, 12); m0 = L === 1 ? 0 : rnd(0, 11) * 5; }
  const cand = [tStr(nextH(h), m), tStr(prevH(h), m), tStr(m === 0 ? 12 : Math.max(1, Math.round(m / 5)) || 12, (h * 5) % 60), tStr(h, (m + 30) % 60), tStr(h, (m + 15) % 60), tStr(h, (m + 5) % 60)];
  const words = timeWords(h, m);
  return Q5({ prompt: later ? `It is ${tStr(sh, sm)}. Set the clock to ${add} minutes later.` : `Set the clock to <b>${words}</b>`, speak: later ? `It is ${timeWords(sh, sm)}. Set the clock to ${add} minutes later.` : `Set the clock to ${words}. Drag the hands, or use the buttons.`,
    visual: later ? clockPic(sh, sm) : digiSVG(ans),
    choices: opts(ans, cand, 4, v => faceSVG(...parseT(v), 'm5face m5fc'), v => timeWords(...parseT(v))), answer: ans, answerSay: words,
    interact: { kind: 'clock', step, h0, m0 },
    explain: clockPic(h, m), steps: [...(later ? [`Start at ${tStr(sh, sm)} and count on ${add} minutes in 5s.`] : []), m === 0 ? 'Long hand: straight up to 12.' : `Long hand: ${m % 5 ? `${m} minutes, just past the ${Math.floor(m / 5) || 12}` : `points to ${m / 5}, because ${m / 5} × 5 = ${m}`}.`, m === 0 ? `Short hand: right on ${h}.` : m < 30 ? `Short hand: just after ${h}.` : m === 30 ? `Short hand: half way between ${h} and ${nextH(h)}.` : `Short hand: nearly at ${nextH(h)}, but it is still ${h} until the long hand gets to 12.`],
    explainText: `${words}: ${ans}.` });
});

/* --- measuring --- */
const COLS5 = [['#F2604F', 'red'], ['#2E8BE6', 'blue'], ['#FFC23D', 'yellow'], ['#2FA36B', 'green'], ['#6D55D1', 'purple']];
const swatch = c => `<span class="m5sw" style="background:${c}"></span>`;
const ribbons = list => pic(`0 0 300 ${list.length * 36 + 10}`, list.map(([len, c], i) => `<rect x="${10 + (list.off ? list.off[i] : 0)}" y="${10 + i * 36}" width="${len * 25}" height="22" rx="11" fill="${c}" stroke="${K}" stroke-width="2"/>`).join('') + `<line x1="10" y1="2" x2="10" y2="${list.length * 36 + 8}" stroke="${K}" stroke-width="2" stroke-dasharray="4 3"/>`, 'ribbons to compare', 'wide');
const towers = list => pic(`0 0 ${list.length * 70 + 10} 190`, list.map(([n, c], i) => Array.from({ length: n }, (_, k) => `<rect x="${18 + i * 70}" y="${176 - (k + 1) * 16}" width="44" height="16" fill="${c}" stroke="${K}" stroke-width="2"/>`).join('')).join('') + `<line x1="4" y1="177" x2="${list.length * 70 + 6}" y2="177" stroke="${K}" stroke-width="3"/>`, 'towers of blocks', 'sm');
function rulerPic(len, from, max, thing = '🖍️') {
  const U = 22, W = max * U + 30; let g = `<rect x="${12 + from * U}" y="14" width="${len * U}" height="22" rx="11" fill="#FFC23D" stroke="${K}" stroke-width="2"/><rect x="${12 + from * U}" y="14" width="12" height="22" rx="5" fill="#F2604F"/>`;
  g += `<rect x="4" y="44" width="${max * U + 16}" height="40" rx="5" fill="#F7F3E8" stroke="${K}" stroke-width="1.5"/>`;
  for (let i = 0; i <= max; i++) g += `<line x1="${12 + i * U}" y1="44" x2="${12 + i * U}" y2="${i % 5 ? 56 : 60}" stroke="${K}" stroke-width="1.6"/>${T(12 + i * U, 76, i, 11)}`;
  for (let i = 0; i < max; i++) g += `<line x1="${12 + i * U + U / 2}" y1="44" x2="${12 + i * U + U / 2}" y2="50" stroke="${K}" stroke-width="1"/>`;
  return pic(`0 0 ${W} 90`, g + `<line x1="${12 + from * U}" y1="36" x2="${12 + from * U}" y2="46" stroke="${RED}" stroke-width="2"/><line x1="${12 + (from + len) * U}" y1="36" x2="${12 + (from + len) * U}" y2="46" stroke="${RED}" stroke-width="2"/>`, 'a crayon on a centimetre ruler', 'wide');
}
S('blocks', 1, 'Measure with blocks', '🧱', [
  ['To see which is longer, line them up at the same start.', () => ribbons([[8, '#F2604F'], [5, '#2E8BE6']])],
  ['Measure with blocks: put them end to end, no gaps, from the start to the end. Count them.', () => `<div class="m5p wide">${blockPic(4, 4, 6)}</div>`],
  ['A ruler is like blocks with numbers. Start at 0 and read the number at the end: 6 cm.', () => rulerPic(6, 0, 10)],
  ['If it does not start at 0, take away: ends at 9, starts at 3, so 9 − 3 = 6 cm.', () => rulerPic(6, 3, 10)]
], L => {
  if (L <= 2) {
    const n = L === 1 ? 2 : 3, cs = shuffle(COLS5).slice(0, n), lens = shuffle(L === 1 ? [rnd(3, 5), rnd(7, 10)] : [rnd(2, 4), rnd(5, 7), rnd(8, 10)]), ask = L === 1 ? pick(['longer', 'shorter']) : pick(['tallest', 'shortest']);
    const big = ask === 'longer' || ask === 'tallest', t = lens.indexOf(big ? Math.max(...lens) : Math.min(...lens));
    const vis = L === 1 ? ribbons(lens.map((v, i) => [v, cs[i][0]])) : towers(lens.map((v, i) => [v, cs[i][0]]));
    return Q({ prompt: `Which one is ${ask}?`, speak: `Which one is ${ask}: ${cs.map(c => 'the ' + c[1]).join(' or ')}?`, visual: vis, choices: cs.map(c => C5(c[1], `${swatch(c[0])}${c[1]}`, `the ${c[1]} one`, true)), answer: cs[t][1],
      steps: L === 1 ? ['They start at the same line.', 'Look where each one ends.'] : ['They all stand on the same floor.', 'Look at the tops.'], explainText: `The ${cs[t][1]} one is ${ask}.` });
  }
  if (L === 3) {
    const len = rnd(3, 8), max = len + rnd(1, 2), thing = pick(['pencil', 'snake']);
    return Q5({ prompt: `How many blocks long is the ${thing}?`, speak: `Add blocks under the ${thing}, end to end, until they reach the end. How many blocks long is it?`, visual: `<div class="m5p wide">${blockPic(len, 0, max, thing)}</div>`,
      choices: nOpts(len, 1, 12, 4, [len + 1, len - 1, max]), answer: len, interact: { kind: 'blocks', len, max, thing, own: true, empty: 'Add some blocks first, then tap Check.' },
      explain: `<div class="m5p wide">${blockPic(len, len, max, thing)}</div>`, steps: ['Start the first block at the start of the ' + thing + '.', 'Put the blocks end to end, with no gaps.', `Stop at the red line and count: ${seqTo(1, len).join(', ')}.`], explainText: `The ${thing} is ${len} blocks long.` });
  }
  if (L === 4) {
    const max = 12, len = rnd(2, 11);
    return Q({ prompt: 'How long is the crayon?', speak: 'The crayon starts at 0. How many centimetres long is it?', visual: rulerPic(len, 0, max), choices: opts(len, near(len).filter(v => v > 0 && v <= 12), 4, v => v + ' cm', v => v + ' centimetres'), answer: len,
      steps: ['Check the crayon starts at 0.', `Read the number at the end: ${len}.`], explainText: `It is ${len} cm long.` });
  }
  const max = 15, from = rnd(1, 5), len = rnd(3, max - from - 1), end = from + len;
  return Q({ prompt: 'How long is the crayon?', speak: `This crayon does not start at 0. How many centimetres long is it?`, visual: rulerPic(len, from, max), choices: opts(len, [end, from, len + 1, len - 1, len + 2].filter(v => v > 0), 4, v => v + ' cm', v => v + ' centimetres'), answer: len,
    steps: [`It starts at ${from}, not 0.`, `It ends at ${end}.`, `${end} − ${from} = ${len}.`], explainText: `It is ${len} cm long. You could also count the spaces from ${from} to ${end}.` });
});

/* --- hot and cold --- */
const HOT = [['🍲', 'hot soup'], ['☕', 'hot cocoa'], ['🔥', 'a campfire'], ['🌞', 'a sunny beach'], ['🫖', 'a teapot'], ['🍕', 'pizza from the oven']];
const COLD = [['🍦', 'ice cream'], ['🧊', 'an ice cube'], ['⛄', 'a snowman'], ['🐧', 'a penguin\'s home'], ['❄️', 'snow'], ['🧃', 'a juice from the fridge']];
function thermo(v, lo, hi, minor, major, mark) {
  const Y = x => 210 - (x - lo) / (hi - lo) * 190; let g = '';
  for (let x = lo; x <= hi; x += minor) { const big = (x - lo) % major === 0; g += `<line x1="86" y1="${Y(x).toFixed(1)}" x2="${big ? 104 : 96}" y2="${Y(x).toFixed(1)}" stroke="${K}" stroke-width="${big ? 2.5 : 1.3}"/>`; if (big) g += T(58, Y(x) + 5, String(x).replace('-', '−'), 13, x < 0 ? '#2776C3' : K, 'end'); }
  g = `<rect x="66" y="10" width="20" height="214" rx="10" fill="#fff" stroke="${K}" stroke-width="2.5"/>${g}<rect x="71" y="${Y(v).toFixed(1)}" width="10" height="${(222 - Y(v)).toFixed(1)}" fill="${RED}"/><circle cx="76" cy="236" r="16" fill="${RED}" stroke="${K}" stroke-width="2.5"/>${T(120, 40, '°C', 15)}`;
  if (mark != null) g += `<path d="M106 ${Y(mark).toFixed(1)} l12 -6 v12 z" fill="#2E8BE6"/>`;
  return `<svg class="m5thermo" viewBox="0 0 140 256" role="img" aria-label="thermometer">${g}</svg>`;
}
const thermoPic = (...a) => `<div class="m5p xs">${thermo(...a)}</div>`;
S('thermo', 1, 'Hot and cold', '🌡️', [
  ['Some things are hot, like soup. Some are cold, like ice cream.', () => row(stripSVG([HOT[0], COLD[0]], false))],
  ['A thermometer shows how hot it is. The red line goes up when it gets hotter.', () => row(thermoPic(10, 0, 40, 5, 10), thermoPic(30, 0, 40, 5, 10))],
  ['Read the number next to the top of the red line. This one shows 20 degrees.', () => thermoPic(20, 0, 50, 5, 10)],
  ['Below zero is freezing cold! Count down past 0: −1, −2, −3...', () => thermoPic(-5, -10, 30, 2, 10)]
], L => {
  if (L === 1) {
    const h = pick(HOT), c = pick(COLD), hot = Math.random() < 0.5, t = hot ? h : c;
    return Q({ prompt: `Which one is ${hot ? 'hot' : 'cold'}?`, speak: `Which one is ${hot ? 'hot' : 'cold'}: ${h[1]} or ${c[1]}?`, visual: thermoPic(hot ? 35 : 5, 0, 40, 5, 10), choices: shuffle([h, c]).map(x => C5(x[1], x[0], x[1])), answer: t[1],
      explainText: `${t[1][0].toUpperCase() + t[1].slice(1)} is ${hot ? 'hot. Be careful!' : 'cold. Brrr!'}` });
  }
  if (L === 2) {
    if (Math.random() < 0.5) {
      const cold = Math.random() < 0.5, a = rnd(0, 2) * 10 + (cold ? 0 : 20), b = a + (cold ? 1 : -1) * rnd(1, 2) * 10;
      const [x, y] = shuffle([[a, 'A'], [b, 'B']]), ask = cold ? 'colder' : 'hotter', t = cold ? (x[0] < y[0] ? x : y) : (x[0] > y[0] ? x : y);
      return Q({ prompt: `Which thermometer shows ${ask}?`, speak: `Which thermometer shows ${ask}?`, visual: stripSVG([['☀️', 'hot'], ['❄️', 'cold']], false), choices: [x, y].map(v => C5(v[1], thermo(v[0], 0, 50, 5, 10), `${v[0]} degrees`)), answer: t[1],
        explain: row(thermoPic(x[0], 0, 50, 5, 10), thermoPic(y[0], 0, 50, 5, 10)), explainText: `The ${ask} one has the ${cold ? 'lower' : 'higher'} red line: ${t[0]} degrees.` });
    }
    const hot = Math.random() < 0.5, wear = hot ? [['🩳', 'shorts'], ['🧢', 'a sun hat'], ['🩴', 'flip-flops']] : [['🧤', 'gloves'], ['🧣', 'a scarf'], ['🧥', 'a warm coat']], other = hot ? [['🧤', 'gloves'], ['🧣', 'a scarf'], ['🧥', 'a warm coat']] : [['🩳', 'shorts'], ['🩴', 'flip-flops'], ['👙', 'a swimsuit']];
    const a = pick(wear), b = shuffle(other).slice(0, 2), v = hot ? 32 : 2;
    return Q({ prompt: `It is ${hot ? 'hot' : 'cold'} today. What should you wear?`, speak: `The thermometer shows ${v} degrees. It is ${hot ? 'hot' : 'cold'} today. What should you wear?`, visual: thermoPic(v, 0, 40, 5, 10),
      choices: shuffle([a, ...b]).map(x => C5(x[1], x[0], x[1])), answer: a[1], explainText: hot ? `When it is hot, wear cool things like ${a[1]}.` : `When it is cold, wrap up warm with ${a[1]}.` });
  }
  if (L <= 4) {
    const [minor, major] = L === 3 ? [10, 10] : pick([[2, 10], [5, 10]]), v = L === 3 ? rnd(0, 5) * 10 : rnd(0, 50 / minor) * minor, cand = [v + minor, v - minor, v + 10, v - 10, v + 1, v + 5].filter(x => x >= 0 && x <= 50);
    return Q({ prompt: 'What temperature does it show?', speak: 'Read the thermometer. How many degrees is it?', visual: thermoPic(v, 0, 50, minor, major), choices: opts(v, cand, 4, x => x + '°', x => x + ' degrees'), answer: v,
      steps: [`Find the top of the red line.`, minor === 10 ? 'Read the number next to it.' : `Each small line is ${minor}. Count on from the number below: ${Math.floor(v / 10) * 10}${v % 10 ? `, then ${seqTo(1, (v % 10) / minor).map(k => Math.floor(v / 10) * 10 + k * minor).join(', ')}` : ''}.`], explainText: `It shows ${v} degrees.` });
  }
  const s = rnd(-4, 25), d = rnd(3, 12), up = s < 0 ? true : Math.random() < 0.5, e = up ? s + d : s - d, f = n => String(n).replace('-', '−') + '°';
  return Q({ prompt: `It is ${f(s)}. It gets ${d}° ${up ? 'warmer' : 'colder'}. What is it now?`, speak: `It is ${s} degrees. It gets ${d} degrees ${up ? 'warmer' : 'colder'}. What is the temperature now?`, visual: thermoPic(s, -10, 40, 2, 10),
    choices: opts(e, [up ? s - d : s + d, e + 1, e - 1, e + 2, e - 10, -e].filter(x => x !== e), 4, f, x => `${x} degrees`), answer: e,
    explain: thermoPic(e, -10, 40, 2, 10, s), steps: [`Start at ${f(s)}.`, `${up ? 'Warmer means up' : 'Colder means down'}: count ${d} ${up ? 'up' : 'down'}${(s < 0) !== (e < 0) ? ', past 0' : ''}.`], explainText: `${f(s)} ${up ? '+' : '−'} ${d} = ${f(e)}.` });
});

/* --- pictograms and bar charts --- */
const CAT_SETS = [[['🍎', 'apples'], ['🍌', 'bananas'], ['🍇', 'grapes'], ['🍓', 'strawberries']], [['🐶', 'dogs'], ['🐱', 'cats'], ['🐟', 'fish'], ['🐰', 'rabbits']],
  [['⚽', 'football'], ['🏊', 'swimming'], ['🚲', 'cycling'], ['🎨', 'painting']], [['🚗', 'cars'], ['🚌', 'buses'], ['🚲', 'bikes'], ['🚚', 'trucks']], [['☀️', 'sunny days'], ['🌧️', 'rainy days'], ['☁️', 'cloudy days'], ['❄️', 'snowy days']]];
function pictoSVG(rows, key) {
  const per = rows.map(r => r[2] / key), mx = Math.max(...per.map(Math.ceil)), W = 100 + mx * 30 + 10, id = 'm5c' + (++uid);
  let g = `<defs><clipPath id="${id}"><rect x="-15" y="-15" width="15" height="30"/></clipPath></defs>`;
  rows.forEach(([e, nm], i) => { const y = 24 + i * 38; g += `<rect x="2" y="${y - 17}" width="${W - 4}" height="34" rx="8" fill="${i % 2 ? '#F7F3E8' : '#fff'}"/>${T(8, y + 5, nm, nm.length > 10 ? 10 : 12, K, 'start')}`;
    for (let k = 0; k < Math.ceil(per[i]); k++) { const x = 114 + k * 30, half = per[i] - k < 1; g += half ? `<g transform="translate(${x} ${y})"><g clip-path="url(#${id})">${E(0, 1, e, 24)}</g></g>` : E(x, y + 1, e, 24); } });
  const H = 20 + rows.length * 38;
  g += `<rect x="2" y="${H - 2}" width="${W - 4}" height="30" rx="8" fill="#FFF1CC" stroke="${K}" stroke-width="1.5"/>${T(W / 2, H + 18, `Each picture = ${key}`, 13)}`;
  return pic(`0 0 ${W} ${H + 32}`, g, `pictogram, each picture stands for ${key}`, 'wide');
}
S('pictogram', 1, 'Pictograms', '🖼️', [
  ['A pictogram uses pictures to show how many. Count the pictures in a row.', () => pictoSVG([['🍎', 'apples', 3], ['🍌', 'bananas', 5]], 1)],
  ['Always read the key! Here each picture stands for 2. Count in 2s: 2, 4, 6.', () => pictoSVG([['🐶', 'dogs', 6], ['🐱', 'cats', 4]], 2)],
  ['Half a picture is half of the key. Half of 2 is 1, so this row shows 5.', () => pictoSVG([['🚲', 'bikes', 5]], 2)]
], L => {
  const key = [1, 1, 1, 2, pick([5, 10])][L - 1], n = L === 1 ? 3 : 4, set = pick(CAT_SETS).slice(0, n), maxK = L <= 1 ? 5 : 8;
  let units = shuffle(seqTo(1, maxK)).slice(0, n); // pictures per row
  if (key % 2 === 0) units = units.map(u => Math.random() < 0.35 ? u - 0.5 : u).map(u => Math.max(0.5, u));
  const rows = set.map((s, i) => [s[0], s[1], units[i] * key]), vis = pictoSVG(rows, key), [a, b] = shuffle(rows);
  const k = L === 1 ? 'count' : L === 2 ? pick(['count', 'most', 'least']) : L === 3 ? pick(['more', 'total']) : pick(['count', 'more', 'total']);
  if (k === 'most' || k === 'least') { const t = [...rows].sort((x, y) => k === 'most' ? y[2] - x[2] : x[2] - y[2])[0];
    return Q({ prompt: `Which has the ${k}?`, speak: `Look at the pictogram. Which has the ${k}?`, visual: vis, choices: rows.map(r => C5(r[1], r[0], r[1])), answer: t[1], steps: [`The ${k} is the row with the ${k === 'most' ? 'most' : 'fewest'} pictures.`], explainText: `${t[1][0].toUpperCase() + t[1].slice(1)}: ${t[2]}.` }); }
  const cnt = r => key === 1 ? `Count the pictures: ${r[2]}.` : `${r[2] / key} pictures, each ${key}: ${r[2] % key ? `count the whole ones in ${key}s to ${Math.floor(r[2] / key) * key}, then half a picture is ${key / 2}` : `count in ${key}s`}: ${r[2]}.`;
  if (k === 'count') return Q({ prompt: `How many ${a[1]}?`, speak: `Look at the pictogram. How many ${a[1]}?`, visual: vis, choices: nOpts(a[2], 0, 200, 4, [a[2] / key, a[2] + key, a[2] - key, b[2]].filter(Number.isInteger)), answer: a[2],
    steps: [`Find the ${a[1]} row.`, cnt(a)], explainText: `There are ${a[2]} ${a[1]}.` });
  if (k === 'more') { const [hi, lo] = a[2] > b[2] ? [a, b] : [b, a], d = hi[2] - lo[2];
    return Q({ prompt: `How many more ${hi[1]} than ${lo[1]}?`, speak: `How many more ${hi[1]} than ${lo[1]}?`, visual: vis, choices: nOpts(d, 0, 200, 4, [hi[2] + lo[2], hi[2], d + key, (hi[2] - lo[2]) / key].filter(v => Number.isInteger(v) && v !== d)), answer: d,
      steps: [cnt(hi), cnt(lo), `${hi[2]} − ${lo[2]} = ${d}.`], explainText: `There are ${d} more ${hi[1]}.` }); }
  const tot = sum(rows.map(r => r[2]));
  return Q({ prompt: 'How many altogether?', speak: 'Add up every row. How many altogether?', visual: vis, choices: nOpts(tot, 1, 400, 4, [tot + key, tot - key, sum(units), tot + 10]), answer: tot,
    steps: [`Read each row: ${rows.map(r => r[2]).join(', ')}.`, `Add them: ${rows.map(r => r[2]).join(' + ')} = ${tot}.`], explainText: `Altogether ${tot}.` });
});

function tallySVG(n) { let g = '', x = 6; for (let b = 0; b < Math.ceil(n / 5); b++) { const k = Math.min(5, n - b * 5); for (let i = 0; i < Math.min(4, k); i++) g += `<line x1="${x + i * 8}" y1="6" x2="${x + i * 8}" y2="40" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`; if (k === 5) g += `<line x1="${x - 4}" y1="34" x2="${x + 28}" y2="12" stroke="${RED}" stroke-width="3" stroke-linecap="round"/>`; x += 44; }
  return `<svg class="m5tally" viewBox="0 0 ${Math.max(40, x)} 46" style="width:${Math.max(40, x) * 0.9}px" role="img" aria-label="${n} tally marks">${g}</svg>`; }
// Things to count, one row for each kind, with a gap after every 5 so they are easy to count.
const groupsSVG = (cats, vals) => { const mx = Math.max(...vals), W = 44 + mx * 30 + Math.floor((mx - 1) / 5) * 10; let g = '';
  cats.forEach(([e, nm], i) => { const y = 24 + i * 44; g += `<rect x="2" y="${y - 20}" width="${W - 4}" height="40" rx="10" fill="${i % 2 ? '#F7F3E8' : '#FFF6E0'}"/>`;
    for (let k = 0; k < vals[i]; k++) g += E(28 + k * 30 + Math.floor(k / 5) * 10, y, e, 24); });
  return pic(`0 0 ${W} ${cats.length * 44 + 6}`, g, cats.map((c, i) => `${vals[i]} ${c[1]}`).join(', '), 'wide'); };
const miniBars = (vals, cats, step, max) => { const n = vals.length, W = n * 30 + 10; let g = `<line x1="4" y1="62" x2="${W - 2}" y2="62" stroke="${K}" stroke-width="2"/>`;
  vals.forEach((v, i) => { const hh = v / max * 54; g += `<rect x="${8 + i * 30}" y="${62 - hh}" width="22" height="${hh}" fill="${['#F2604F', '#2E8BE6', '#2FA36B', '#FFC23D'][i % 4]}" stroke="${K}" stroke-width="1.5"/>${T(19 + i * 30, 76, cats[i][0], 12)}${T(19 + i * 30, 58 - hh, v, 9)}`; });
  return `<svg class="m5mb" viewBox="0 0 ${W} 82" role="img" aria-label="bar chart: ${vals.join(', ')}">${g}</svg>`; };
const dataTable = rows => { const W = 230, H = rows.length * 32 + 34; let g = `<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="10" fill="#fff" stroke="${K}" stroke-width="2"/><rect x="2" y="2" width="${W - 4}" height="30" rx="10" fill="#FFF1CC"/>${T(70, 22, 'What', 13)}${T(180, 22, 'How many', 13)}`;
  rows.forEach(([e, nm, v], i) => { const y = 54 + i * 32; g += `<line x1="8" y1="${y - 20}" x2="${W - 8}" y2="${y - 20}" stroke="#CCDBE6"/>${E(24, y - 4, e, 20)}${T(42, y + 1, nm, 13, K, 'start', 700)}${T(180, y + 2, v, 16)}`; });
  return pic(`0 0 ${W} ${H}`, g, 'a table of results', 'sm'); };
S('buildbar', 1, 'Build a bar chart', '📊', [
  ['Count each group. Then build its bar: one square for each one.', () => miniBars([3, 5], [['🍎'], ['🍌']], 1, 6)],
  ['Tap a square to make the bar that tall. Tap − or + to fix it.', () => miniBars([2, 4, 3], [['🐶'], ['🐱'], ['🐟']], 1, 5)],
  ['Read the side! If it counts in 2s, a bar to 6 shows 6, but only uses 3 squares.', () => miniBars([6, 10], [['🚗'], ['🚌']], 2, 12)]
], L => {
  const n = [2, 3, 3, 4, 4][L - 1], step = [1, 1, 1, 2, 5][L - 1], max = [5, 8, 10, 16, 40][L - 1], cats = pick(CAT_SETS).slice(0, n);
  const vals = cats.map(() => rnd(1, max / step) * step);
  const ans = vals.join(','), src = L <= 2 ? groupsSVG(cats, vals)
    : L === 3 ? `<div class="m5groups">${cats.map((c, i) => `<div class="m5grp m5tg"><span class="m5e">${c[0]}</span>${tallySVG(vals[i])}</div>`).join('')}</div>` : dataTable(cats.map((c, i) => [c[0], c[1], vals[i]]));
  const alts = new Set([ans]);
  const tw = () => { const v = vals.slice(), r = Math.random(); if (r < 0.4 && n > 1) { const [i, j] = shuffle(seqTo(0, n - 1)); [v[i], v[j]] = [v[j], v[i]]; } else { const i = rnd(0, n - 1); v[i] = clamp(v[i] + pick([-1, 1, 2]) * step, step, max); } return v.join(','); };
  for (let t = 0; alts.size < 4 && t < 60; t++) alts.add(tw());
  return Q5({ prompt: L <= 2 ? 'Count each group, then build the bars' : L === 3 ? 'Read the tally marks, then build the bars' : `Build the bar chart. The side counts in ${step}s.`, speak: L <= 2 ? `Count each group. Then build a bar for each one: ${cats.map(c => c[1]).join(', ')}.` : L === 3 ? 'Count the tally marks for each one, then build its bar.' : `Read the table and build the bar chart. Careful: the side counts in ${step}s.`,
    visual: src, choices: [...alts].map(s => C5(s, miniBars(s.split(',').map(Number), cats, step, max), cats.map((c, i) => `${c[1]} ${s.split(',')[i]}`).join(', '))), answer: ans,
    answerSay: cats.map((c, i) => `${c[1]} ${vals[i]}`).join(', '), interact: { kind: 'bars', cats, step, max, empty: 'Tap the squares to build the bars, then tap Check.' },
    explain: miniBars(vals, cats, step, max), steps: [...cats.map((c, i) => `${c[1][0].toUpperCase() + c[1].slice(1)}: ${vals[i]}${step > 1 ? `, that is ${vals[i] / step} squares` : ''}.`)], explainText: 'Each bar goes up to its number on the side.' });
});

/* ================= Treetop Town (world 2) ================= */

S('change5', 2, 'Giving change', '🧾', [
  ['Change is the money you get back when you pay too much.', () => row(tagSVG('🍦', 7), cashRow([10]))],
  ['Count up from the price to what you paid: 7, then 8, 9, 10. That is 3 back.', () => hopsSVG(7, 10)],
  ['Big jumps are quicker: from 35 jump to 40, then to 100. 5 + 60 = 65.', () => hopsSVG(35, 100)]
], L => {
  const [e, nm] = pick(TOYS5);
  const [pay, price] = L === 1 ? [10, rnd(1, 9)] : L === 2 ? [20, rnd(5, 19)] : L === 3 ? (() => { const p = pick([50, 100]); return [p, rnd(1, p / 5 - 1) * 5]; })() : L === 4 ? (() => { const p = pick([50, 100]); return [p, rnd(Math.floor(p * .3), p - 2)]; })() : (() => { const p = pick([500, 1000, 2000]); return [p, rnd(Math.floor(p * .2 / 5), p / 5 - 1) * 5]; })();
  const ch = pay - price, vis = row(tagSVG(e, price), `<div class="m5paywith"><b>Paid with</b>${cashRow([pay])}</div>`), steps = [`Count up from ${cash(price)} to ${cash(pay)}.`, `${cash(price)} + ${cash(ch)} = ${cash(pay)}.`];
  if (L === 4) {
    const tray = COINS, best = split(ch, tray), sets = [best], tots = new Set([ch]);
    for (const d of shuffle([1, -1, 2, -2, 5, -5, 10, -10])) { const v = ch + d; if (sets.length < 4 && v > 0 && !tots.has(v)) { tots.add(v); sets.push(split(v, tray)); } }
    return Q5({ prompt: `You are the shopkeeper! The ${nm} costs ${cash(price)}. Give the change from ${cash(pay)}.`, speak: `You are the shopkeeper. The ${nm} costs ${cashSay(price)}. The customer pays ${cashSay(pay)}. Tap coins to give the right change.`, visual: vis,
      choices: shuffle(sets).map(s => C5(sum(s), `<span class="m5mini">${cashRow(s)}</span>`, cashSay(sum(s)))), answer: ch, answerSay: cashSay(ch), interact: { kind: 'pay', tray, change: true, empty: 'Tap coins to give change, then tap Check.' },
      explain: hopsSVG(price, pay, cash), steps: [...steps, `Coins: ${best.map(cash).join(' + ')}.`], explainText: `The change is ${cash(ch)}.` });
  }
  return Q({ prompt: `The ${nm} costs ${cash(price)}. You pay with ${cash(pay)}. How much change?`, speak: `The ${nm} costs ${cashSay(price)}. You pay with ${cashSay(pay)}. How much change do you get?`, visual: vis,
    choices: opts(ch, [ch + 1, ch - 1, ch + 10, ch - 10, ch + 5, price, ch + 100].filter(v => v > 0 && v < pay), 4, cash, cashSay), answer: ch, explain: hopsSVG(price, pay, cash), steps, explainText: `Your change is ${cash(ch)}.` });
});

/* --- sorting: hoops, Venn and Carroll diagrams --- */
const ATTR = [
  { a: 'red', b: 'round', items: [['🍎', 'apple', 1, 1], ['🍅', 'tomato', 1, 1], ['🔴', 'red button', 1, 1], ['🍓', 'strawberry', 1, 0], ['🚒', 'fire truck', 1, 0], ['❤️', 'heart', 1, 0], ['🍊', 'orange', 0, 1], ['🏀', 'basketball', 0, 1], ['🌕', 'full moon', 0, 1], ['🍌', 'banana', 0, 0], ['🥕', 'carrot', 0, 0], ['🌲', 'tree', 0, 0]] },
  { a: 'animals', b: 'can fly', items: [['🐦', 'bird', 1, 1], ['🦋', 'butterfly', 1, 1], ['🐝', 'bee', 1, 1], ['🦉', 'owl', 1, 1], ['🐶', 'dog', 1, 0], ['🐟', 'fish', 1, 0], ['🐢', 'turtle', 1, 0], ['✈️', 'plane', 0, 1], ['🪁', 'kite', 0, 1], ['🚁', 'helicopter', 0, 1], ['🚗', 'car', 0, 0], ['🌳', 'tree', 0, 0], ['🏠', 'house', 0, 0]] },
  { a: 'fruit', b: 'yellow', items: [['🍌', 'banana', 1, 1], ['🍋', 'lemon', 1, 1], ['🍍', 'pineapple', 1, 1], ['🍎', 'apple', 1, 0], ['🍇', 'grapes', 1, 0], ['🍉', 'watermelon', 1, 0], ['🌻', 'sunflower', 0, 1], ['⭐', 'star', 0, 1], ['🐥', 'chick', 0, 1], ['🥕', 'carrot', 0, 0], ['🚙', 'jeep', 0, 0], ['🥦', 'broccoli', 0, 0]] }
];
const HOOPS = [['fruit', [['🍎', 'apple'], ['🍌', 'banana'], ['🍇', 'grapes'], ['🍐', 'pear'], ['🍓', 'strawberry']]], ['animals', [['🐶', 'dog'], ['🐱', 'cat'], ['🐮', 'cow'], ['🐸', 'frog'], ['🐷', 'pig']]],
  ['toys', [['🧸', 'teddy'], ['🪀', 'yo-yo'], ['🪁', 'kite'], ['🎲', 'dice'], ['🪆', 'doll']]], ['things that go', [['🚗', 'car'], ['🚌', 'bus'], ['🚲', 'bike'], ['🚂', 'train'], ['🚀', 'rocket']]], ['sea animals', [['🐟', 'fish'], ['🐙', 'octopus'], ['🦀', 'crab'], ['🐳', 'whale'], ['🐬', 'dolphin']]]];
const REG = { a: [[78, 78], [62, 118], [92, 150]], ab: [[150, 84], [150, 124], [150, 160]], b: [[222, 78], [238, 118], [208, 150]], out: [[22, 34], [278, 34], [22, 176], [278, 176], [150, 20]] };
function vennSVG(A, B, items, apart, q) {
  const [ca, cb] = apart ? [82, 218] : [115, 185], r = apart ? 64 : 74, used = { a: 0, b: 0, ab: 0, out: 0 };
  let g = `<rect x="1" y="1" width="298" height="198" rx="12" fill="#fff" stroke="${K}" stroke-width="2"/><circle cx="${ca}" cy="110" r="${r}" fill="#F2604F" fill-opacity=".14" stroke="#C44E40" stroke-width="3"/><circle cx="${cb}" cy="110" r="${r}" fill="#2E8BE6" fill-opacity=".14" stroke="#2776C3" stroke-width="3"/>${T(ca, 30, A, 14, '#C44E40')}${T(cb, 30, B, 14, '#2776C3')}`;
  for (const [e, reg] of items) { const p = REG[reg][used[reg]++ % REG[reg].length]; const x = apart && reg === 'a' ? p[0] + 6 : apart && reg === 'b' ? p[0] - 6 : p[0]; g += E(x, p[1], e, 22); }
  if (q) g += `<rect x="236" y="164" width="58" height="32" rx="10" fill="#FFF1CC" stroke="${RED}" stroke-width="2.5"/>${E(265, 180, q, 22)}`;
  return pic('0 0 300 200', g, apart ? `two hoops: ${A} and ${B}` : `a Venn diagram: ${A} and ${B}`, 'wide');
}
function carrollSVG(cols, rows, cells, hi) {
  let g = `<rect x="1" y="1" width="298" height="168" rx="10" fill="#fff" stroke="${K}" stroke-width="2"/><line x1="90" y1="1" x2="90" y2="169" stroke="${K}" stroke-width="2"/><line x1="195" y1="1" x2="195" y2="169" stroke="${K}" stroke-width="2"/><line x1="1" y1="40" x2="299" y2="40" stroke="${K}" stroke-width="2"/><line x1="1" y1="104" x2="299" y2="104" stroke="${K}" stroke-width="2"/>`;
  g += T(142, 26, cols[0], 13) + T(247, 26, cols[1], 13) + T(46, 77, rows[0], 13) + T(46, 141, rows[1], 13);
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) { const x = 142 + c * 105, y = 72 + r * 64; if (hi && hi[0] === r && hi[1] === c) g += `<rect x="${x - 50}" y="${y - 30}" width="100" height="62" fill="#FFF1CC"/>`; g += T(x, y + 5, (cells[r][c] || []).join(', '), (cells[r][c] || []).join(', ').length > 10 ? 12 : 15); }
  return pic('0 0 300 170', g, 'a Carroll diagram', 'wide');
}
const regName = (A, B) => ({ a: `${A} only`, b: `${B} only`, ab: 'both', out: 'neither' });
S('sorting', 2, 'Sorting diagrams', '🔵', [
  ['Sort things into hoops: each thing goes in the hoop it belongs to.', () => vennSVG('fruit', 'animals', [['🍎', 'a'], ['🍌', 'a'], ['🐶', 'b'], ['🐸', 'b']], true)],
  ['In a Venn diagram the hoops overlap. Things that are both go in the middle. Things that are neither go outside.', () => vennSVG('red', 'round', [['🍓', 'a'], ['🍎', 'ab'], ['🍊', 'b'], ['🍌', 'out']])],
  ['A Carroll diagram is a table: each thing goes in the one box where its row and column are both true.', () => carrollSVG(['even', 'odd'], ['under 10', '10 or more'], [[[4, 8], [3, 7]], [[12], [15, 11]]])]
], L => {
  if (L === 1) {
    const [x, y] = shuffle(HOOPS).slice(0, 2), item = pick(x[1]), shown = [...shuffle(x[1].filter(i => i !== item)).slice(0, 2).map(i => [i[0], 'a']), ...shuffle(y[1]).slice(0, 2).map(i => [i[0], 'b'])];
    const flip = Math.random() < 0.5, [A, B] = flip ? [y, x] : [x, y], items = shown.map(([e, r]) => [e, flip ? (r === 'a' ? 'b' : 'a') : r]);
    return Q({ prompt: `Which hoop does the ${item[1]} go in?`, speak: `Which hoop does the ${item[1]} go in: ${A[0]} or ${B[0]}?`, visual: vennSVG(A[0], B[0], items, true, item[0]), choices: [A[0], B[0]].map(h => C5(h, h, h, true)), answer: x[0],
      explainText: `A ${item[1]} is one of the ${x[0]}, so it goes in the ${x[0]} hoop.` });
  }
  const S0 = pick(ATTR), reg = it => it[2] && it[3] ? 'ab' : it[2] ? 'a' : it[3] ? 'b' : 'out', nm = regName(S0.a, S0.b);
  if (L === 2) {
    const it = pick(S0.items), placed = shuffle(S0.items.filter(i => i !== it)).slice(0, 5).map(i => [i[0], reg(i)]);
    return Q({ prompt: `Where does the ${it[1]} go?`, speak: `Where does the ${it[1]} go? ${S0.a} only, ${S0.b} only, both, or neither?`, visual: vennSVG(S0.a, S0.b, placed, false, it[0]),
      choices: ['a', 'b', 'ab', 'out'].map(r => C5(nm[r], nm[r], nm[r], true)), answer: nm[reg(it)],
      steps: [`Is it ${S0.a}? ${it[2] ? 'Yes' : 'No'}.`, `Is it ${S0.b}? ${it[3] ? 'Yes' : 'No'}.`], explainText: it[2] && it[3] ? 'It is both, so it goes in the middle where the hoops overlap.' : it[2] || it[3] ? `It goes in the ${it[2] ? S0.a : S0.b} hoop, but not in the middle.` : 'It is neither, so it goes outside both hoops.' });
  }
  if (L === 3) {
    const placed = shuffle(S0.items).slice(0, rnd(6, 9)), counts = { a: 0, b: 0, ab: 0, out: 0 };
    placed.forEach(i => counts[reg(i)]++);
    const k = pick(['ab', 'out', 'A', 'B']), ans = k === 'A' ? counts.a + counts.ab : k === 'B' ? counts.b + counts.ab : counts[k];
    const ask = k === 'ab' ? `are both ${S0.a} and ${S0.b}` : k === 'out' ? `are neither` : `are ${k === 'A' ? S0.a : S0.b}`;
    return Q({ prompt: `How many things ${ask}?`, speak: `Look at the Venn diagram. How many things ${ask}?`, visual: vennSVG(S0.a, S0.b, placed.map(i => [i[0], reg(i)])), choices: nOpts(ans, 0, 12, 4, [counts.a, counts.b, counts.ab, counts.out, counts.a + counts.ab + counts.b]), answer: ans,
      steps: k === 'A' || k === 'B' ? [`Count everything inside the ${k === 'A' ? S0.a : S0.b} hoop.`, 'Remember the middle is inside it too!'] : [k === 'ab' ? 'Look in the middle, where the hoops overlap.' : 'Look outside both hoops.'], explainText: `The answer is ${ans}.` });
  }
  if (L === 4) {
    const [cA, cB, fA, rA, rB, fR] = pick([['even', 'odd', v => v % 2 === 0, 'under 10', '10 or more', v => v < 10], ['ends in 0 or 5', 'does not', v => v % 5 === 0, 'under 20', '20 or more', v => v < 20], ['even', 'odd', v => v % 2 === 0, 'in the 3× table', 'not in it', v => v % 3 === 0]]);
    const nums = shuffle(seqTo(1, 30)).slice(0, 7), cells = [[[], []], [[], []]], cellOf = v => [fR(v) ? 0 : 1, fA(v) ? 0 : 1], q = nums.pop();
    nums.forEach(v => { const [r, c] = cellOf(v); if (cells[r][c].length < 2) cells[r][c].push(v); });
    const [r, c] = cellOf(q), names = [[`${rA}, ${cA}`, `${rA}, ${cB}`], [`${rB}, ${cA}`, `${rB}, ${cB}`]];
    return Q({ prompt: `Which box does ${q} go in?`, speak: `Look at the Carroll diagram. Which box does ${q} go in?`, visual: carrollSVG([cA, cB], [rA, rB], cells),
      choices: [0, 1].flatMap(i => [0, 1].map(j => C5(names[i][j], names[i][j], names[i][j], true))), answer: names[r][c],
      explain: carrollSVG([cA, cB], [rA, rB], cells.map((rw, i) => rw.map((cl, j) => i === r && j === c ? [...cl, q] : cl)), [r, c]), steps: [`Is ${q} ${cA}? ${c === 0 ? 'Yes' : 'No'}: it is ${c === 0 ? cA : cB}.`, `Row: ${q} is ${r === 0 ? rA : rB}.`], explainText: `${q} goes in the box for "${names[r][c]}".` });
  }
  const [m1, m2] = pick([[2, 3], [2, 5], [3, 4], [3, 5]]), top = pick([20, 30]), both = seqTo(1, top).filter(v => v % m1 === 0 && v % m2 === 0);
  if (Math.random() < 0.5) {
    const ans = pick(both), wrong = shuffle(seqTo(1, top).filter(v => (v % m1 === 0) !== (v % m2 === 0))).slice(0, 3);
    return Q({ prompt: `Which number goes in the middle: in the ${m1}× table and the ${m2}× table?`, speak: `The hoops are: multiples of ${m1}, and multiples of ${m2}. Which number goes in the middle?`, visual: vennSVG(`× ${m1}`, `× ${m2}`, [[m1, 'a'], [m2, 'b'], ['?', 'ab']]),
      choices: opts(ans, wrong, 4), answer: ans, steps: [`The middle needs a number in both tables.`, `${ans} ÷ ${m1} = ${ans / m1} and ${ans} ÷ ${m2} = ${ans / m2}.`], explainText: `${ans} is a multiple of both ${m1} and ${m2}.` });
  }
  const k = both.length;
  return Q({ prompt: `From 1 to ${top}, how many numbers go in the middle?`, speak: `The hoops are multiples of ${m1} and multiples of ${m2}, using the numbers 1 to ${top}. How many numbers go in the middle?`, visual: vennSVG(`× ${m1}`, `× ${m2}`, [[m1, 'a'], [m2, 'b'], ['?', 'ab']]),
    choices: nOpts(k, 0, 12, 4, [k + 1, k - 1, Math.floor(top / m1), Math.floor(top / m2)]), answer: k, steps: [`The middle is for numbers in both tables: the ${m1 * m2 / gcd(m1, m2)}× table.`, `They are: ${both.join(', ')}.`], explainText: `${k} number${k === 1 ? '' : 's'} go in the middle.` });
});

if (location.hash === '#selftest') window.__math5 = { cash, cashSay, split, timeWords, MX, CURRENCIES, ids: ['coins5', 'myday', 'purse', 'toyshop', 'setclock', 'blocks', 'thermo', 'pictogram', 'buildbar', 'change5', 'sorting'] };
})();
