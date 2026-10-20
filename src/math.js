/* ---------- math curriculum: 5 worlds, every skill has a lesson and 5 levels ---------- */
// Included into the main script by build.py; uses the shared helpers defined above it.

const frac = (n, d) => `<span class="frac"><i>${n}</i><i>${d}</i></span>`;
const fracSay = (n, d) => `${n} over ${d}`;
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const lcm = (a, b) => a / gcd(a, b) * b;
const expr = s => `<span class="expr">${s}</span>`;
const fmt = n => Number.isInteger(n) ? n.toLocaleString('en-US') : String(+n.toFixed(4));

// Build answer buttons: the answer plus distinct wrong options taken from a candidate list.
function opts(ans, cands, n = 4, show = v => fmt(v), speak = v => String(v)) {
  const key = v => String(v), seen = new Set([key(ans)]), wrong = [];
  for (const c of shuffle(cands)) { if (c == null || Number.isNaN(c) || seen.has(key(c))) continue; seen.add(key(c)); wrong.push(c); }
  return shuffle([ans, ...wrong.slice(0, n - 1)]).map(v => ({ html: show(v), val: key(v), say: speak(v), txt: (typeof v === 'string' && v.length > 3) || String(show(v)).replace(/<[^>]+>/g, '').length > 3 }));
}
function near(ans, { neg = false, big = false, dec = 0 } = {}) {
  const st = big ? [1, 2, 10, 100, 9, 11, 20] : [1, 2, 3, 10, 5];
  const out = [];
  for (const d of st) { out.push(ans + d, ans - d); }
  if (dec) for (const d of [0.1, 0.01, 1].slice(0, dec + 1)) out.push(+(ans + d).toFixed(dec), +(ans - d).toFixed(dec));
  return out.filter(v => neg || v >= 0);
}
const Q = (o) => ({ choices: o.choices, answer: String(o.answer), prompt: o.prompt, speak: o.speak || o.prompt, visual: o.visual || '', explain: o.explain || '', explainText: o.explainText || '', steps: o.steps || null });
const word = (q) => `<p class="wordq">${q}</p>`;

/* --- pictures --- */
function clockSVG(h, m) {
  const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
  let ticks = '';
  for (let i = 1; i <= 12; i++) { const a = i * 30 * Math.PI / 180; ticks += `<text x="${50 + 36 * Math.sin(a)}" y="${54 + -36 * Math.cos(a)}" font-size="10" font-weight="800" text-anchor="middle" fill="#22305A">${i}</text>`; }
  const hand = (a, len, w, c) => `<line x1="50" y1="50" x2="${50 + len * Math.sin(a * Math.PI / 180)}" y2="${50 - len * Math.cos(a * Math.PI / 180)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  return `<div class="shape"><svg viewBox="0 0 100 100" role="img" aria-label="clock"><circle cx="50" cy="50" r="46" fill="#fff" stroke="#22305A" stroke-width="4"/>${ticks}${hand(ha, 22, 5, '#22305A')}${hand(ma, 34, 3, '#F2604F')}<circle cx="50" cy="50" r="3.5" fill="#22305A"/></svg></div>`;
}
const timeStr = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
function pieSVG(d, n, color = '#2E8BE6') {
  let s = '';
  for (let i = 0; i < d; i++) {
    const a0 = (i / d) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
    const p = d === 1 ? `<circle cx="50" cy="50" r="44"` : `<path d="M50 50 L${50 + 44 * Math.cos(a0)} ${50 + 44 * Math.sin(a0)} A44 44 0 0 1 ${50 + 44 * Math.cos(a1)} ${50 + 44 * Math.sin(a1)} Z"`;
    s += `${p} fill="${i < n ? color : '#fff'}" stroke="#22305A" stroke-width="2"/>`;
  }
  return `<div class="shape"><svg viewBox="0 0 100 100" role="img" aria-label="fraction circle">${s}</svg></div>`;
}
function barSVG(d, n, color = '#2FA36B') {
  const w = 200 / d; let s = '';
  for (let i = 0; i < d; i++) s += `<rect x="${i * w + 1}" y="1" width="${w}" height="38" fill="${i < n ? color : '#fff'}" stroke="#22305A" stroke-width="2"/>`;
  return `<div class="shape wide-shape"><svg viewBox="0 0 203 41" role="img" aria-label="bar">${s}</svg></div>`;
}
function rectSVG(w, h, grid, labels = true) {
  const k = Math.min(160 / w, 100 / h), W = w * k, H = h * k; let g = '';
  if (grid) { for (let i = 1; i < w; i++) g += `<line x1="${20 + i * k}" y1="10" x2="${20 + i * k}" y2="${10 + H}" stroke="#9FB3C8" stroke-width="1"/>`; for (let j = 1; j < h; j++) g += `<line x1="20" y1="${10 + j * k}" x2="${20 + W}" y2="${10 + j * k}" stroke="#9FB3C8" stroke-width="1"/>`; }
  const lab = labels ? `<text x="${20 + W / 2}" y="${H + 26}" font-size="12" font-weight="800" text-anchor="middle" fill="#22305A">${w}</text><text x="${W + 26}" y="${10 + H / 2 + 4}" font-size="12" font-weight="800" fill="#22305A">${h}</text>` : '';
  return `<div class="shape wide-shape"><svg viewBox="0 0 ${W + 50} ${H + 34}" role="img" aria-label="rectangle"><rect x="20" y="10" width="${W}" height="${H}" fill="#D9EBFC" stroke="#22305A" stroke-width="2.5"/>${g}${lab}</svg></div>`;
}
function angleSVG(deg, label) {
  const r = 70, a = deg * Math.PI / 180, x = 20 + r * Math.cos(a), y = 90 - r * Math.sin(a);
  const arc = deg === 90 ? `<path d="M36 90 V74 H20" fill="none" stroke="#F2604F" stroke-width="2.5"/>` : `<path d="M44 90 A24 24 0 ${deg > 180 ? 1 : 0} 0 ${20 + 24 * Math.cos(a)} ${90 - 24 * Math.sin(a)}" fill="none" stroke="#F2604F" stroke-width="2.5"/>`;
  return `<div class="shape"><svg viewBox="-40 0 150 110" role="img" aria-label="angle"><line x1="20" y1="90" x2="95" y2="90" stroke="#22305A" stroke-width="4" stroke-linecap="round"/><line x1="20" y1="90" x2="${x}" y2="${y}" stroke="#22305A" stroke-width="4" stroke-linecap="round"/>${arc}${label ? `<text x="52" y="84" font-size="12" font-weight="800" fill="#F2604F">${label}</text>` : ''}</svg></div>`;
}
function gridSVG(px, py, quad4, extra = '') {
  const n = quad4 ? 5 : 10, s = quad4 ? 9 : 9, o = quad4 ? 50 : 5, X = v => o + v * s, Y = v => (quad4 ? 50 : 95) - v * s;
  let g = '';
  for (let i = quad4 ? -n : 0; i <= n; i++) g += `<line x1="${X(i)}" y1="${Y(quad4 ? -n : 0)}" x2="${X(i)}" y2="${Y(n)}" stroke="#CCDBE6" stroke-width=".6"/><line x1="${X(quad4 ? -n : 0)}" y1="${Y(i)}" x2="${X(n)}" y2="${Y(i)}" stroke="#CCDBE6" stroke-width=".6"/>`;
  g += `<line x1="${X(quad4 ? -n : 0)}" y1="${Y(0)}" x2="${X(n)}" y2="${Y(0)}" stroke="#22305A" stroke-width="1.4"/><line x1="${X(0)}" y1="${Y(quad4 ? -n : 0)}" x2="${X(0)}" y2="${Y(n)}" stroke="#22305A" stroke-width="1.4"/>`;
  for (let i = quad4 ? -n : 0; i <= n; i++) if (i) g += `<text x="${X(i)}" y="${Y(0) + 6}" font-size="4" text-anchor="middle" fill="#5A678C">${i}</text><text x="${X(0) - 3}" y="${Y(i) + 1.5}" font-size="4" text-anchor="end" fill="#5A678C">${i}</text>`;
  const pts = (Array.isArray(px) ? px : [[px, py]]).map(([a, b], i) => `<circle cx="${X(a)}" cy="${Y(b)}" r="2.6" fill="${['#F2604F', '#6D55D1'][i]}"/>`).join('');
  return `<div class="shape"><svg viewBox="0 0 100 100" role="img" aria-label="grid">${g}${extra}${pts}</svg></div>`;
}
function tensOnes(t, o) {
  const rod = `<span class="rod">${'<i></i>'.repeat(10)}</span>`, cube = '<span class="cube"></span>';
  return `<div class="blocks">${rod.repeat(t)}<span class="cubes">${cube.repeat(o)}</span></div>`;
}
function column(a, b, op, ans) {
  const w = Math.max(String(a).length, String(b).length + 1, String(ans ?? '').length);
  const pad = s => String(s).padStart(w, ' ');
  return `<pre class="column">${pad(a)}\n${op}${String(b).padStart(w - 1, ' ')}\n${'─'.repeat(w)}\n${ans == null ? pad('?') : pad(ans)}</pre>`;
}

/* --- teaching pictures for lessons and wrong-answer help ---
   (hopLine, arraySVG, barModel and triSVG come from math3.js; they are only called when a question or lesson is shown) */
const bigEq = s => `<span class="bignum m3mid">${s}</span>`;
// Ten frames: a red counters, then b blue ones. More than 10 uses two frames side by side.
function tenFrame(a, b = 0) {
  const n = a + b, frames = n > 10 ? 2 : 1; let s = '';
  for (let f = 0; f < frames; f++) for (let i = 0; i < 10; i++) {
    const k = f * 10 + i, x = 4 + f * 182 + (i % 5) * 34, y = 4 + Math.floor(i / 5) * 34;
    s += `<rect x="${x}" y="${y}" width="34" height="34" fill="#fff" stroke="#22305A" stroke-width="2.5"/>`;
    if (k < n) s += `<circle cx="${x + 17}" cy="${y + 17}" r="12" fill="${k < a ? '#F2604F' : '#2E8BE6'}" stroke="#22305A" stroke-width="1.5"/>`;
  }
  return `<div class="shape wide-shape"><svg viewBox="0 0 ${frames * 182 - 4} 76" role="img" aria-label="ten frame with ${a} red${b ? ` and ${b} blue` : ''} counters">${s}</svg></div>`;
}
// Things lined up in pairs (two per row): an odd number leaves one on its own.
const pairsPic = (n, e) => objs(n, e).replace(/repeat\(\d+,auto\)/, 'repeat(2,auto)');
// Two rows lined up so each thing has a partner; the leftovers show which has more.
const pairRows = (a, ea, b, eb) => { const m = Math.max(a, b), r = (n, e) => `<div class="m2line" style="grid-template-columns:repeat(${m},1fr)">${Array.from({ length: m }, (_, i) => `<span>${i < n ? e : ''}</span>`).join('')}</div>`; return `<div class="m2pairs">${r(a, ea)}${r(b, eb)}</div>`; };
// Place value chart; the digit at index hi (from the left) is highlighted.
const PV_NAMES = ['Ones', 'Tens', 'Hundreds', 'Thousands', 'Ten thousands'];
function pvChart(n, hi = -1) {
  const s = String(n), names = s.split('').map((_, i) => PV_NAMES[s.length - 1 - i]);
  const cell = (v, i) => i === hi ? `<td style="background:#FFD98A">${v}</td>` : `<td>${v}</td>`;
  return `<table class="m3tab"><tr>${names.map(x => `<th>${x}</th>`).join('')}</tr><tr>${s.split('').map(cell).join('')}</tr></table>`;
}
// Grid method for multiplying: split the numbers into parts, multiply each pair.
function gridMul(aParts, bParts) {
  return `<table class="m3tab"><tr><th>×</th>${aParts.map(p => `<th>${fmt(p)}</th>`).join('')}</tr>${bParts.map(q => `<tr><th>${fmt(q)}</th>${aParts.map(p => `<td>${fmt(p * q)}</td>`).join('')}</tr>`).join('')}</table>`;
}
// Short division "bus stop" layout: divisor, the number inside, the answer on top.
const busStop = (d, n, q) => `<pre class="column">${' '.repeat(String(d).length + 1)}${String(q).padStart(String(n).length, ' ')}\n${d}│${n}</pre>`;
const placeWord = p => ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands'][p] || 'next';
// Column taking away, one column at a time, with borrowing explained.
function subSteps(a, b, names = PV_NAMES) {
  const out = []; let borrow = 0, i = 0;
  while (a || b) {
    const top = a % 10, db = b % 10, nm = names[i] || 'Next';
    let cur = top - borrow, pre = '';
    if (borrow) pre = top === 0 ? `The 0 must borrow too, so it becomes 9. ` : `The ${top} lent 1, so it is now ${cur}. `;
    if (cur < 0) cur += 10;
    if (cur < db) { out.push(`${nm}: ${pre}${cur} − ${db}? Too small, so borrow 1 from the next column: ${cur + 10} − ${db} = ${cur + 10 - db}.`); borrow = 1; }
    else { out.push(`${nm}: ${pre}${cur} − ${db} = ${cur - db}.`); borrow = top === 0 && borrow ? 1 : 0; }
    a = Math.floor(a / 10); b = Math.floor(b / 10); i++;
    if (!a && !b) break;
  }
  return out;
}

/* --- money, measuring and charts --- */
const COIN_COL = { 1: '#D98C4A', 2: '#D98C4A', 5: '#B9C3CF', 10: '#B9C3CF', 20: '#E8C24A', 50: '#E8C24A', 100: '#E8C24A' };
const coin = v => `<svg viewBox="0 0 40 40" width="${v >= 20 ? 62 : 52}" height="${v >= 20 ? 62 : 52}" role="img" aria-label="${v >= 100 ? '1 dollar' : v + ' cents'}"><circle cx="20" cy="20" r="18" fill="${COIN_COL[v]}" stroke="#22305A" stroke-width="2"/><circle cx="20" cy="20" r="13" fill="none" stroke="#22305A" stroke-opacity=".25" stroke-width="1.5"/><text x="20" y="25" font-size="${v >= 100 ? 11 : 13}" font-weight="800" text-anchor="middle" fill="#22305A">${v >= 100 ? '$1' : v + '¢'}</text></svg>`;
const coins = list => `<div class="coins">${list.map(coin).join('')}</div>`;
const money = c => c < 100 ? `${c}¢` : `$${(c / 100).toFixed(2)}`;
const moneySay = c => c < 100 ? `${c} cents` : `${Math.floor(c / 100)} dollar${c >= 200 ? 's' : ''}${c % 100 ? ` and ${c % 100} cents` : ''}`;
function ruler(len, max) {
  let t = '';
  for (let i = 0; i <= max; i++) t += `<line x1="${10 + i * 20}" y1="52" x2="${10 + i * 20}" y2="${i % 5 ? 62 : 66}" stroke="#22305A" stroke-width="1.5"/><text x="${10 + i * 20}" y="78" font-size="10" font-weight="800" text-anchor="middle" fill="#22305A">${i}</text>`;
  return `<div class="shape wide-shape"><svg viewBox="0 0 ${max * 20 + 20} 84" role="img" aria-label="ruler in centimetres"><rect x="10" y="22" width="${len * 20}" height="22" rx="11" fill="#FFC23D" stroke="#22305A" stroke-width="2"/><rect x="2" y="50" width="${max * 20 + 16}" height="32" fill="#F7F3E8" stroke="#22305A" stroke-width="1.5" rx="4"/>${t}</svg></div>`;
}
function chartSVG(data, step = 1) {
  const top = Math.ceil(Math.max(...data.map(d => d[1])) / step) * step + step, H = 120, k = H / top, bw = 46;
  let g = '';
  for (let v = 0; v <= top; v += step) g += `<line x1="30" y1="${140 - v * k}" x2="${36 + data.length * (bw + 12)}" y2="${140 - v * k}" stroke="#CCDBE6" stroke-width="1"/><text x="24" y="${144 - v * k}" font-size="12" font-weight="800" text-anchor="end" fill="#5A678C">${v}</text>`;
  const cols = ['#F2604F', '#2E8BE6', '#2FA36B', '#FFC23D', '#6D55D1'];
  data.forEach(([lab, v], i) => { const x = 40 + i * (bw + 12); g += `<rect x="${x}" y="${140 - v * k}" width="${bw}" height="${v * k}" fill="${cols[i % 5]}" stroke="#22305A" stroke-width="1.5"/><text x="${x + bw / 2}" y="${166}" font-size="26" text-anchor="middle">${lab}</text>`; });
  return `<div class="shape wide-shape"><svg viewBox="0 0 ${46 + data.length * (bw + 12)} 176" role="img" aria-label="bar chart">${g}</svg></div>`;
}
const CHART_SETS = [['🍎', 'apples'], ['🍌', 'bananas'], ['🍇', 'grapes'], ['🍓', 'strawberries'], ['🐶', 'dogs'], ['🐱', 'cats'], ['🐟', 'fish'], ['🐰', 'rabbits'], ['⚽', 'football'], ['🏊', 'swimming'], ['🚲', 'cycling'], ['🎨', 'painting']];
const chartData = (n, max) => { const set = pick([CHART_SETS.slice(0, 4), CHART_SETS.slice(4, 8), CHART_SETS.slice(8)]); const vals = shuffle(Array.from({ length: max }, (_, i) => i + 1)).slice(0, n); return set.slice(0, n).map((s, i) => [s[0], vals[i], s[1]]); };

/* --- worlds --- */
const WORLDS = [
  { id: 'seed', name: 'Seedling Hill', ico: '🌱', ages: '3–5', color: 'var(--leaf)' },
  { id: 'sprout', name: 'Sprout Valley', ico: '🌿', ages: '5–7', color: 'var(--sky)' },
  { id: 'tree', name: 'Treetop Town', ico: '🌳', ages: '7–9', color: 'var(--grape)' },
  { id: 'forest', name: 'Deep Forest', ico: '🌲', ages: '9–11', color: 'var(--coral)' },
  { id: 'peak', name: 'Mountain Peak', ico: '⛰️', ages: '11+', color: 'var(--ink)' }
];

/* --- skills: lesson = steps a child reads before practising; gen(L) makes a question at level L (1-5) --- */
const MATH = {};
const S = (id, world, name, ico, lesson, gen) => { MATH[id] = { id, world, name, ico, lesson, gen }; };

/* ===== World 1: Seedling Hill ===== */
S('count', 0, 'Counting', '🍎', [
  ['Touch each one. Say one number for each one.', () => objs(3, '🍎', { num: true })],
  ['The last number you say is how many. 1, 2, 3. There are 3!', () => '<span class="bignum">3</span>'],
  ['Count each one only once. Rows make it easy. A full row is 5. Then 6, 7.', () => tenFrame(7)],
  ['Your turn! Touch and count the stars.', () => objs(4, '⭐')]
], L => { const q = GEN.count(L), n = +q.answer; if (n > 3) q.steps = ['Touch the first one and say 1.', 'Touch the next one and say the next number.', `The last number you say is ${n}.`]; return q; });
S('numbers', 0, 'Find the number', '🔢', [
  ['Every number has a shape. This is 4.', () => '<span class="bignum">4</span>'],
  ['4 means this many. Count them: 1, 2, 3, 4.', () => objs(4, '⭐', { num: true })],
  ['To find 4, count each group. Stop at the group with 4.', () => `<div class="row">${objs(3, '🐟')}${objs(4, '🐟', { num: true })}</div>`]
], L => {
  const max = [5, 8, 10, 15, 20][L - 1], n = rnd(1, max), [e] = pick(THINGS);
  return Q({ prompt: `Which group has ${n}?`, speak: `Find the group with ${n}.`, visual: `<span class="bignum">${n}</span>`,
    choices: opts(n, near(n).filter(v => v > 0 && v <= max + 2), 3, v => `<span class="mini">${objs(v, e)}</span>`), answer: n,
    explain: objs(n, e, { num: true }), steps: n > 3 ? ['Count each group.', `Stop when a group has ${n}.`] : null, explainText: `Count to ${n}. This group has exactly ${n}.` });
});
S('shapes', 0, 'Shapes', '🔺', [
  ['Shapes have sides and corners. Count the corners: 1, 2, 3. A triangle has 3.', () => shapeSVG('triangle', '#2FA36B', true)],
  ['A square has 4 sides, all the same. A rectangle has 4 sides too: 2 long and 2 short.', () => `<div class="row">${shapeSVG('square', '#2E8BE6', true)}${shapeSVG('rectangle', '#F2604F', true)}</div>`],
  ['A circle is round. It has no corners at all!', () => shapeSVG('circle', '#FFC23D')],
  ['Your turn! Count the corners of this one. 6 corners: a hexagon.', () => shapeSVG('hexagon', '#6D55D1', true)]
], L => { const q = GEN.shapes(L); if (q.prompt === 'How many sides?') q.steps = ['Put your finger on one corner. Say 1.', 'Go round the edge and count each corner.', `There are ${q.answer} corners, so ${q.answer} sides.`]; return q; });
S('pattern', 0, 'Patterns', '🔴', [
  ['A pattern repeats again and again. Red, blue, red, blue.', () => `<div class="pat">${dot('#F2604F')}${dot('#2E8BE6')}${dot('#F2604F')}${dot('#2E8BE6')}</div>`],
  ['Find the part that repeats. Here it is red, blue.', () => `<div class="pat"><span class="unit">${dot('#F2604F')}${dot('#2E8BE6')}</span></div>`],
  ['Say it out loud to find what comes next. Red, blue, red, blue, red... blue!', () => `<div class="pat">${dot('#F2604F')}${dot('#2E8BE6')}${dot('#F2604F')}${dot('#2E8BE6')}${dot('#F2604F')}<span class="dot q">?</span></div>`]
], L => { const q = GEN.pattern(L); q.steps = ['Find the part that repeats.', 'Say the colors out loud, again and again.', 'The next color in your song is the answer.']; return q; });
S('compare', 0, 'Bigger or smaller', '🐘', [
  ['Bigger means more. Smaller means fewer.', () => `<div class="row">${objs(5, '🍓')}${objs(2, '🍓')}</div>`],
  ['Line them up in pairs. The row with some left over has more.', () => pairRows(5, '🍓', 2, '🍓')],
  ['5 is bigger than 2. The crocodile mouth opens to the bigger number.', () => '<span class="bignum">5 > 2</span>'],
  ['Big numbers: more digits means bigger. 40 is bigger than 9.', () => '<span class="bignum">40 > 9</span>']
], L => { const q = GEN.compare(L), [a, b] = q.choices.map(c => +c.val), hi = Math.max(a, b), lo = Math.min(a, b);
  q.steps = hi <= 10 ? [`Line them up in pairs.`, `${hi} has ${hi - lo} left over, so ${hi} is more.`] : String(hi).length > String(lo).length ? [`${hi} has more digits than ${lo}.`, `More digits means bigger.`] : [`They have the same number of digits.`, `Look at the first digit: ${String(hi)[0]} and ${String(lo)[0]}.`, ...(String(hi)[0] === String(lo)[0] ? ['They match, so look at the next digit.'] : []), `${hi} is bigger, ${lo} is smaller.`];
  return q; });

const CRITTERS = [['🐱', 'cat'], ['🐶', 'dog'], ['🐸', 'frog'], ['🐰', 'rabbit'], ['🐻', 'bear'], ['🐷', 'pig'], ['🦊', 'fox'], ['🐵', 'monkey'], ['🐼', 'panda'], ['🐯', 'tiger'], ['🐨', 'koala'], ['🐮', 'cow']];
const shelf = (g, cols) => `<div class="shelf" style="grid-template-columns:repeat(${cols},1fr)">${g.map(c => `<span>${c ? c[0] : ''}</span>`).join('')}</div>`;
const critterChoices = (ans, pool) => shuffle([ans, ...shuffle(pool.filter(c => c && c !== ans)).slice(0, 2)]).map(c => ({ html: c[0], val: c[1], say: c[1] }));
S('position', 0, 'Where is it?', '🧭', [
  ['Above means higher up. The cat is above the dog.', () => shelf([CRITTERS[0], CRITTERS[1]], 1)],
  ['Below means lower down. The dog is below the cat.', () => shelf([CRITTERS[0], CRITTERS[1]], 1)],
  ['Hold up your hands. Your left thumb and finger make an L. L is for left! The frog is on the left. The rabbit is on the right.', () => shelf([CRITTERS[2], CRITTERS[3]], 2)],
  ['Rows go across. Count rows from the top. Columns go up and down. Count them from the left.', () => shelf(CRITTERS.slice(4, 10), 3)]
], L => {
  const cols = L <= 2 ? 3 : L === 3 ? 3 : 4, rows = L <= 2 ? 2 : 3, n = cols * rows, g = shuffle(CRITTERS).slice(0, n);
  const at = (r, c) => (r >= 0 && r < rows && c >= 0 && c < cols) ? g[r * cols + c] : null;
  const ri = rnd(0, rows - 1), ci = rnd(0, cols - 1), me = at(ri, ci);
  const dirs = L === 1 ? [['above', -1, 0], ['below', 1, 0]] : L === 2 ? [['to the left of', 0, -1], ['to the right of', 0, 1]] : [['above', -1, 0], ['below', 1, 0], ['to the left of', 0, -1], ['to the right of', 0, 1]];
  const ok = dirs.filter(([, dr, dc]) => at(ri + dr, ci + dc));
  if (!ok.length) return MATH.position.gen(L);
  if (L === 5) {
    const r = rnd(1, rows), c = rnd(1, cols), t = at(r - 1, c - 1);
    return Q({ prompt: `Who is in row ${r}, column ${c}?`, speak: `Row ${r} counts down from the top. Column ${c} counts across from the left. Who is there?`, visual: shelf(g, cols), choices: critterChoices(t, g), answer: t[1],
      explain: shelf(g.map(x => x === t ? x : null), cols), steps: [`Start at the top row. Count down to row ${r}.`, `Now count across from the left to column ${c}.`], explainText: `The ${t[1]} is there.` });
  }
  if (L === 4 && ci + 2 < cols) {
    const t = at(ri, ci + 2);
    return Q({ prompt: `Who is 2 places to the right of the ${me[0]}?`, speak: `Who is two places to the right of the ${me[1]}?`, visual: shelf(g, cols), choices: critterChoices(t, g), answer: t[1],
      explain: shelf(g.map(x => x === t || x === me ? x : null), cols), steps: [`Find the ${me[1]}.`, 'Hop to the right: one, two.'], explainText: `It is the ${t[1]}.` });
  }
  const [word, dr, dc] = pick(ok), t = at(ri + dr, ci + dc);
  return Q({ prompt: `Who is ${word} the ${me[0]}?`, speak: `Who is ${word} the ${me[1]}?`, visual: shelf(g, cols), choices: critterChoices(t, g), answer: t[1],
    explain: shelf(g.map(x => x === t || x === me ? x : null), cols), explainText: `Find the ${me[1]}. ${word === 'above' ? 'Look up' : word === 'below' ? 'Look down' : word.includes('left') ? 'Look to the left side' : 'Look to the right side'}: it is the ${t[1]}.` });
});
const SIZE_THINGS = [['🐘', 'elephant'], ['🐭', 'mouse'], ['🌳', 'tree'], ['🌷', 'flower'], ['🐳', 'whale'], ['🐟', 'fish'], ['🏠', 'house'], ['🐞', 'ladybug']];
const snake = (len, col) => `<svg viewBox="0 0 220 24" width="100%" height="24" role="img" aria-label="ribbon ${len} long"><rect x="2" y="4" width="${len * 20}" height="16" rx="8" fill="${col}" stroke="#22305A" stroke-width="2"/></svg>`;
const tower = (n, col) => `<span class="tower">${Array.from({ length: n }, () => `<i style="background:${col}"></i>`).join('')}</span>`;
S('sizes', 0, 'Big, long and tall', '📏', [
  ['Long means it goes a long way from end to end. Short means it does not.', () => snake(9, '#2FA36B') + snake(4, '#F2604F')],
  ['Tall means it goes high up. Count the blocks to check! 5 blocks is taller than 2.', () => `<div class="towers">${tower(5, '#2E8BE6')}${tower(2, '#FFC23D')}</div>`],
  ['Big things take up lots of space, like an elephant. Small things take up a little, like a mouse.', () => '<div class="row"><span class="bignum">🐘</span><span style="font-size:28px">🐭</span></div>'],
  ['How many more? Count the extra blocks on top. 5 take away 2 is 3 more.', () => `<div class="towers">${tower(5, '#2E8BE6')}${tower(2, '#FFC23D')}</div>`]
], L => {
  const COLS = [['#F2604F', 'red'], ['#2E8BE6', 'blue'], ['#2FA36B', 'green'], ['#FFC23D', 'yellow']];
  if (L === 1) {
    const pair = pick([[0, 1], [2, 3], [4, 5], [6, 7]]), big = SIZE_THINGS[pair[0]], small = SIZE_THINGS[pair[1]], askBig = Math.random() < 0.5, t = askBig ? big : small;
    return Q({ prompt: `Which is ${askBig ? 'bigger' : 'smaller'} in real life?`, speak: `Which is ${askBig ? 'bigger' : 'smaller'} in real life, the ${big[1]} or the ${small[1]}?`, choices: shuffle([big, small]).map(c => ({ html: c[0], val: c[1], say: c[1] })), answer: t[1], explainText: `A ${big[1]} is much bigger than a ${small[1]}.` });
  }
  const n = L === 2 ? 3 : 4, cols = shuffle(COLS).slice(0, n), lens = shuffle(L === 2 ? [3, 6, 9] : L === 3 ? [2, 4, 5, 7] : [3, 4, 5, 6]).slice(0, n);
  const ch = cols.map((c, i) => ({ html: `<span class="dot" style="background:${c[0]}"></span>`, val: c[1], say: c[1] }));
  if (L <= 3) {
    const kind = L === 2 ? pick(['longest', 'shortest']) : pick(['tallest', 'shortest']), i = kind.includes('short') ? lens.indexOf(Math.min(...lens)) : lens.indexOf(Math.max(...lens));
    const visual = L === 2 ? cols.map((c, k) => snake(lens[k], c[0])).join('') : `<div class="towers">${cols.map((c, k) => tower(lens[k], c[0])).join('')}</div>`;
    return Q({ prompt: `Which is the ${kind}?`, visual, choices: ch, answer: cols[i][1], steps: [L === 2 ? 'Look at where each one ends.' : 'Count the blocks in each tower.', `The ${cols[i][1]} one ${L === 2 ? (kind === 'longest' ? 'goes the furthest' : 'stops first') : `has ${kind === 'tallest' ? 'the most' : 'the fewest'} blocks`}.`], explainText: `The ${cols[i][1]} one ${L === 2 ? 'is' : 'has'} ${lens[i]}${L === 3 ? ' blocks' : ''}. It is the ${kind}.` });
  }
  if (L === 4) {
    const i = lens.indexOf(Math.max(...lens)), j = lens.indexOf(Math.min(...lens));
    return Q({ prompt: `How many blocks taller is the ${cols[i][1]} tower than the ${cols[j][1]} one?`, visual: `<div class="towers">${cols.map((c, k) => tower(lens[k], c[0])).join('')}</div>`, choices: opts(lens[i] - lens[j], [lens[i], lens[j], lens[i] - lens[j] + 1, lens[i] + lens[j]]), answer: lens[i] - lens[j],
      explain: `<div class="towers">${tower(lens[i], cols[i][0])}${tower(lens[j], cols[j][0])}</div>`, steps: [`The ${cols[i][1]} tower has ${lens[i]} blocks.`, `The ${cols[j][1]} tower has ${lens[j]} blocks.`, `Count the extra blocks on top: ${lens[i] - lens[j]}.`], explainText: `${lens[i]} blocks take away ${lens[j]} blocks is ${lens[i] - lens[j]}.` });
  }
  const pairs = [['1 metre', '90 cm', '1 metre', '1 metre is 100 cm, which is more than 90 cm.'], ['1 kg', '500 g', '1 kg', '1 kg is 1000 g, more than 500 g.'], ['half an hour', '20 minutes', 'half an hour', 'Half an hour is 30 minutes, longer than 20.'], ['2 litres', '1500 mL', '2 litres', '2 litres is 2000 mL, more than 1500.'], ['60 seconds', '2 minutes', '2 minutes', '2 minutes is 120 seconds.']];
  const [a, b, ans, why] = pick(pairs);
  return Q({ prompt: `Which is more: ${a} or ${b}?`, choices: shuffle([a, b]).map(v => ({ html: v, val: v, say: v, txt: true })), answer: ans, explainText: why });
});

/* ===== World 2: Sprout Valley ===== */
S('add10', 1, 'Adding to 10', '➕', [
  ['Adding means putting groups together. 2 fish and 3 fish.', () => `${objs(2, '🐟')}<span class="op">+</span>${objs(3, '🐟')}`],
  ['Count them all: 1, 2, 3, 4, 5. So 2 + 3 = 5.', () => `${objs(2, '🐟', { num: true })}<span class="op">+</span>${objs(3, '🐟', { num: true, numFrom: 2 })}`],
  ['A faster way: start at the bigger number, 3. Then count on 2 more: 4, 5.', () => hopLine([3, 4, 5], ['+1', '+1'])],
  ['Try it: 4 + 2. Say 4, then count on: 5, 6. The ten frame shows 6.', () => tenFrame(4, 2)]
], L => {
  const [e] = pick(THINGS);
  if (L === 4) { const a = rnd(1, 4), b = rnd(1, 3), c = rnd(1, 10 - a - b); return Q({ prompt: `${a} + ${b} + ${c} = ?`, speak: `What is ${a} plus ${b} plus ${c}?`, visual: `${objs(a, e)}<span class="op">+</span>${objs(b, e)}<span class="op">+</span>${objs(c, e)}`, choices: opts(a + b + c, near(a + b + c)), answer: a + b + c,
    explain: tenFrame(a + b, c), steps: [`Add two first: ${a} + ${b} = ${a + b}.`, `Then add the last one: ${a + b} + ${c} = ${a + b + c}.`], explainText: `So ${a} + ${b} + ${c} = ${a + b + c}.` }); }
  if (L === 5) { const s = rnd(4, 10), a = rnd(1, s - 1); return Q({ prompt: `${a} + ? = ${s}`, speak: `${a} plus what makes ${s}?`, visual: objs(a, e), choices: opts(s - a, near(s - a)), answer: s - a, explain: tenFrame(a, s - a),
    steps: [`Start at ${a}.`, `Count up to ${s}: ${Array.from({ length: s - a }, (_, i) => a + i + 1).join(', ')}.`, `You counted ${s - a} more. The blue ones show them.`], explainText: `${a} + ${s - a} = ${s}.` }); }
  const max = L === 1 ? 5 : 10, a = rnd(1, max - 1), b = rnd(1, max - a);
  return Q({ prompt: `${a} + ${b} = ?`, speak: `What is ${a} plus ${b}?`, visual: L <= 2 ? `${objs(a, e)}<span class="op">+</span>${objs(b, e)}` : '', choices: opts(a + b, near(a + b)), answer: a + b,
    explain: `${objs(a, e, { num: true })}<span class="op">+</span>${objs(b, e, { num: true, numFrom: a })}`, steps: [`Start at the bigger number: ${Math.max(a, b)}.`, `Count on ${Math.min(a, b)}: ${Array.from({ length: Math.min(a, b) }, (_, i) => Math.max(a, b) + i + 1).join(', ')}.`], explainText: `${a} + ${b} = ${a + b}.` });
});
S('sub10', 1, 'Taking away to 10', '➖', [
  ['Taking away means some go away. 5 balloons. 2 fly off.', () => objs(5, '🎈', { gone: 2 })],
  ['Count what is left: 1, 2, 3. So 5 − 2 = 3.', () => '<span class="bignum">5 − 2 = 3</span>'],
  ['Or count back: start at 5, then jump back 2. 4, 3.', () => hopLine([5, 4, 3], ['−1', '−1'])],
  ['Check by adding back: 3 + 2 = 5. Yes!', () => '<span class="bignum">3 + 2 = 5</span>']
], L => {
  const [e] = pick(THINGS);
  if (L === 5) { const a = rnd(5, 10), r = rnd(1, a - 1); return Q({ prompt: `${a} − ? = ${r}`, speak: `${a} take away what leaves ${r}?`, visual: objs(a, e), choices: opts(a - r, near(a - r)), answer: a - r, explain: objs(a, e, { gone: a - r }),
    steps: [`Start with ${a}.`, `Keep ${r}. Cross out the rest.`, `You crossed out ${a - r}.`], explainText: `${a} − ${a - r} = ${r}.` }); }
  const max = [5, 10, 10, 10][L - 1], a = rnd(2, max), b = rnd(1, a - 1);
  return Q({ prompt: `${a} − ${b} = ?`, speak: `What is ${a} take away ${b}?`, visual: L <= 2 ? objs(a, e) : '', choices: opts(a - b, near(a - b)), answer: a - b,
    explain: L === 4 ? hopLine([b, a], [`+${a - b}`]) : objs(a, e, { gone: b }),
    steps: L === 4 ? [`Think of adding instead: ${b} + what makes ${a}?`, `Count up from ${b} to ${a}: ${Array.from({ length: a - b }, (_, i) => b + i + 1).join(', ')}.`, `That is ${a - b} jumps.`] : [`Start with ${a}.`, `Cross out ${b}.`, `Count what is left: ${a - b}.`], explainText: `${a} − ${b} = ${a - b}.` });
});
S('bonds', 1, 'Number friends', '🤝', [
  ['Number friends are two numbers that make a total. Let us make 10 in a ten frame.', () => tenFrame(7)],
  ['7 red. How many empty boxes? 3! So 7 and 3 are friends of 10.', () => tenFrame(7, 3)],
  ['Learn the friends of 10: 1 and 9, 2 and 8, 3 and 7, 4 and 6, 5 and 5.', () => '<div class="m2track"><span>1+9</span><span>2+8</span><span>3+7</span><span>4+6</span><span>5+5</span></div>'],
  ['They help with big numbers too. 3 and 7 make 10, so 30 and 70 make 100.', () => bigEq('30 + 70 = 100')]
], L => {
  const T = [5, 10, 10, 20, 100][L - 1], step = T === 100 ? 10 : 1, a = rnd(1, T / step - 1) * step, f = T - a;
  const steps = T === 5 ? [`Hold up ${a} finger${a > 1 ? 's' : ''} on one hand.`, `Count the fingers still down: ${f}.`]
    : T === 10 ? [`Put ${a} in the ten frame.`, `Count the empty boxes: ${f}.`]
    : T === 20 ? (a === 10 ? ['10 and 10 make 20. Double 10!'] : a < 10 ? [`${a} and ${10 - a} make 10.`, `Then 10 more makes 20.`, `${10 - a} + 10 = ${f}.`] : [`${a} is 10 and ${a - 10}.`, `${a - 10} needs ${20 - a} to make the next 10.`, `So ${a} + ${f} = 20.`])
    : [`Think in tens: ${a} is ${a / 10} tens.`, `${a / 10} and ${10 - a / 10} are friends of 10.`, `So ${a} and ${f} make 100.`];
  return Q({ prompt: `${a} + ? = ${T}`, speak: `What goes with ${a} to make ${T}?`, visual: T <= 10 ? objs(a, '🔵') : '', choices: opts(T - a, near(T - a, { big: T === 100 }).filter(v => v % step === 0)), answer: T - a,
    explain: T === 5 ? `${objs(a, '🔵')}<span class="op">+</span>${objs(T - a, '🔴')}` : T <= 20 ? tenFrame(a, f) : tenFrame(a / 10, f / 10), steps, explainText: `${a} and ${T - a} are friends. Together they make ${T}.` });
});
S('add20', 1, 'Adding to 20 and beyond', '🧮', [
  ['Doubles are easy to remember: 6 + 6 = 12. So 6 + 7 is just 1 more: 13.', () => tenFrame(6, 6)],
  ['Make a 10 first! 8 + 5: move 2 from the 5 to fill up the 8.', () => tenFrame(8, 5)],
  ['Now it is 10 + 3, which is 13.', () => hopLine([8, 10, 13], ['+2', '+3'])],
  ['Big numbers: add the tens, then the ones. 23 + 14: 20 + 10 = 30, 3 + 4 = 7. So 37.', () => bigEq('23 + 14 = 37')]
], L => {
  let a, b, how, pic;
  if (L === 1) { a = rnd(2, 10); b = a; how = [`${a} + ${a} is a double.`, `Double ${a} is ${a * 2}.`]; pic = tenFrame(a, a); }
  else if (L === 2) { a = rnd(3, 9); b = a + 1; how = [`Near double! Use ${a} + ${a} = ${2 * a}.`, `${b} is 1 more than ${a}, so add 1 more: ${2 * a + 1}.`]; pic = tenFrame(a, b); }
  else if (L === 3) { a = rnd(6, 9); b = rnd(11 - a, 9); how = [`Split ${b} into ${10 - a} and ${b - (10 - a)}.`, `Make 10: ${a} + ${10 - a} = 10.`, `Then 10 + ${b - (10 - a)} = ${a + b}.`]; pic = tenFrame(a, b); }
  else if (L === 4) { a = rnd(11, 45); b = rnd(2, 9); const o = a % 10 + b, up = Math.ceil(a / 10) * 10;
    how = [`Add the ones: ${a % 10} + ${b} = ${o}.`, o >= 10 ? `That is 1 more ten and ${o - 10} ones.` : `The tens stay the same: ${a - a % 10}.`, `${a - a % 10} + ${o} = ${a + b}.`];
    pic = o > 10 && up !== a ? hopLine([a, up, a + b], [`+${up - a}`, `+${a + b - up}`]) : hopLine([a, a + b], [`+${b}`]); }
  else { a = rnd(11, 60); b = rnd(11, 89 - a); const T = a - a % 10 + b - b % 10, O = a % 10 + b % 10;
    how = [`Add the tens: ${a - a % 10} + ${b - b % 10} = ${T}.`, `Add the ones: ${a % 10} + ${b % 10} = ${O}.`, `Put them together: ${T} + ${O} = ${a + b}.`]; pic = hopLine([a, a + b - b % 10, a + b], b % 10 ? [`+${b - b % 10}`, `+${b % 10}`] : [`+${b}`]); }
  return Q({ prompt: `${a} + ${b} = ?`, speak: `What is ${a} plus ${b}?`, choices: opts(a + b, near(a + b)), answer: a + b, explain: pic, steps: how, explainText: `${a} + ${b} = ${a + b}.` });
});
S('sub20', 1, 'Taking away to 20 and beyond', '🧺', [
  ['13 − 4: jump back to 10 first. That is a jump of 3.', () => hopLine([13, 10, 9], ['−3', '−1'])],
  ['You need to take 4, so jump back 1 more: 10 − 1 = 9.', () => '<span class="bignum">13 − 4 = 9</span>'],
  ['Big numbers: take away the tens, then the ones. 57 − 23: 57 − 20 = 37, then 37 − 3 = 34.', () => hopLine([57, 37, 34], ['−20', '−3'])],
  ['Check by adding back: 34 + 23 = 57. Yes!', () => bigEq('34 + 23 = 57 ✓')]
], L => {
  let a, b;
  if (L === 1) { a = rnd(11, 19); b = a - 10; }
  else if (L === 2) { a = rnd(11, 19); b = rnd(1, a % 10 || 1); }
  else if (L === 3) { a = rnd(11, 18); b = rnd(a % 10 + 1, 9); }
  else if (L === 4) { a = rnd(21, 99); b = rnd(1, a % 10 || 1); }
  else { a = rnd(30, 99); b = rnd(11, a - 10); }
  const r = a - b, bt = b - b % 10, bo = b % 10, down = a - a % 10;
  let steps, pic;
  if (b <= 9 && bo > a % 10 && a % 10) { steps = [`Jump back to ${down} first: ${a} − ${a % 10} = ${down}.`, `You still need to take away ${b - a % 10} more.`, `${down} − ${b - a % 10} = ${r}.`]; pic = hopLine([a, down, r], [`−${a % 10}`, `−${b - a % 10}`]); }
  else if (b <= 9) { steps = a % 10 ? [`Take away from the ones: ${a % 10} − ${b} = ${a % 10 - b}.`, `The tens stay the same: ${down}.`, `So ${a} − ${b} = ${r}.`] : [`Count back ${b} from ${a}.`, `${r} + ${b} = ${a}, so it is ${r}.`]; pic = hopLine([a, r], [`−${b}`]); }
  else { steps = [`Split ${b} into ${bt}${bo ? ` and ${bo}` : ''}.`, `Take away the tens: ${a} − ${bt} = ${a - bt}.`, ...(bo ? [`Take away the ones: ${a - bt} − ${bo} = ${r}.`] : []), `Check: ${r} + ${b} = ${a}.`]; pic = hopLine([a, a - bt, r], bo ? [`−${bt}`, `−${bo}`] : [`−${bt}`]); }
  return Q({ prompt: `${a} − ${b} = ?`, speak: `What is ${a} take away ${b}?`, choices: opts(r, near(r)), answer: r, explain: pic, steps, explainText: `${a} − ${b} = ${r}.` });
});
S('place', 1, 'Tens and ones', '🧱', [
  ['A long rod is 10 cubes stuck together. A small cube is just 1.', () => tensOnes(1, 1)],
  ['Count the rods in tens: 10, 20, 30. Then count on the cubes: 31, 32, 33, 34.', () => tensOnes(3, 4)],
  ['So 34 is 3 tens and 4 ones. The 3 is worth 30. The 4 is worth 4.', () => pvChart(34, 0)],
  ['Bigger numbers have more places. In 2,345 the 2 is worth 2,000.', () => pvChart(2345, 0)]
], L => {
  if (L <= 2) { const t = rnd(1, L === 1 ? 4 : 9), o = rnd(0, 9), n = t * 10 + o;
    return Q({ prompt: L === 1 ? 'What number is this?' : `${t} tens and ${o} ones is?`, speak: L === 1 ? 'Count the tens and the ones. What number is this?' : `What number is ${t} tens and ${o} ones?`, visual: L === 1 ? tensOnes(t, o) : '', choices: opts(n, [o * 10 + t, n + 10, n - 10, n + 1, t + o]), answer: n, explain: tensOnes(t, o),
      steps: [`Count the tens: ${Array.from({ length: t }, (_, i) => (i + 1) * 10).join(', ')}.`, o ? `Count on the ${o} one${o > 1 ? 's' : ''}: ${Array.from({ length: o }, (_, i) => t * 10 + i + 1).join(', ')}.` : 'There are no ones.'], explainText: `${t} tens and ${o} ones make ${n}.` }); }
  const digits = L === 3 ? 2 : L === 4 ? 3 : 4, n = rnd(10 ** (digits - 1), 10 ** digits - 1), s = String(n), i = rnd(0, digits - 1), place = 10 ** (digits - 1 - i), d = +s[i];
  if (d === 0) return MATH.place.gen(L);
  const names = { 1: 'ones', 10: 'tens', 100: 'hundreds', 1000: 'thousands' };
  return Q({ prompt: `What is the ${d} worth in ${fmt(n)}?`, speak: `In the number ${n}, what is the digit ${d} worth?`, choices: opts(d * place, [d, d * 10, d * 100, d * 1000, d * place * 10].filter(v => v !== d * place)), answer: d * place,
    explain: pvChart(n, i), steps: [`Put ${fmt(n)} in the place chart.`, `The ${d} sits under ${names[place]}.`, place === 1 ? `${d} ones is just ${d}.` : `${d} ${names[place]} is ${d} × ${fmt(place)} = ${fmt(d * place)}.`], explainText: `So the ${d} is worth ${fmt(d * place)}.` });
});
S('skip', 1, 'Skip counting', '🐸', [
  ['Skip counting means jumping by the same number each time. Here we jump by 5.', () => hopLine([0, 5, 10, 15, 20], ['+5', '+5', '+5', '+5'])],
  ['Count in 2s: 2, 4, 6, 8, 10. Count in 10s: 10, 20, 30, 40.', () => '<div class="m2track"><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span></div>'],
  ['To find the jump, take one number from the next. 6 − 4 = 2, so we jump by 2.', () => hopLine([4, 6], ['+2'])],
  ['Try it: 5, 10, 15, what next? Jump 5 more: 20! Skip counting helps with times tables.', () => '<span class="bignum">5, 10, 15, 20</span>']
], L => {
  const by = [10, 5, 2, pick([3, 4]), pick([25, 3, 4, 6])][L - 1], back = L === 5 && Math.random() < 0.5, start = by * rnd(0, 4);
  const seq = Array.from({ length: 4 }, (_, i) => back ? start + by * (8 - i) : start + by * i), next = back ? seq[3] - by : seq[3] + by;
  return Q({ prompt: `${seq.join(', ')}, ?`, speak: `Count by ${by}s. ${seq.join(', ')}. What comes next?`, choices: opts(next, [next + 1, next - 1, next + by, next - by * 2, next + 10]), answer: next,
    explain: hopLine([seq[2], seq[3], next], [`${back ? '−' : '+'}${by}`, `${back ? '−' : '+'}${by}`]), steps: [back ? `Find the jump: ${seq[0]} − ${seq[1]} = ${by}. It goes down.` : `Find the jump: ${seq[1]} − ${seq[0]} = ${by}.`, `Jump once more: ${seq[3]} ${back ? '−' : '+'} ${by} = ${next}.`], explainText: `The next number is ${next}.` });
});
S('time', 1, 'Telling time', '🕒', [
  ['A clock has two hands. The short hand shows the hour. Here it points to 3.', () => clockSVG(3, 0)],
  ['The long red hand shows the minutes. When it points straight up to 12, it is o\'clock: 3 o\'clock.', () => clockSVG(3, 0)],
  ['When the long hand points down to 6, it has gone half way round. It is half past 3, or 3:30.', () => clockSVG(3, 30)],
  ['Each number is 5 minutes for the long hand. Count in 5s: 5, 10, 15. Pointing at 3 means 15 minutes past.', () => clockSVG(3, 15)]
], L => {
  const h = rnd(1, 12), m = L === 1 ? 0 : L === 2 ? pick([0, 30]) : L === 3 ? pick([0, 15, 30, 45]) : L === 4 ? rnd(0, 11) * 5 : rnd(0, 59);
  if (L === 5 && Math.random() < 0.5) {
    const add = pick([15, 30, 45, 60, 90]), tot = h * 60 + m + add, h2 = ((Math.floor(tot / 60) - 1) % 12) + 1, m2 = tot % 60;
    const hr = add >= 60, mid = h * 60 + m + (hr ? 60 : 0), hM = ((Math.floor(mid / 60) - 1) % 12) + 1, rest = add - (hr ? 60 : 0);
    return Q({ prompt: `What time will it be in ${add} minutes?`, visual: clockSVG(h, m), choices: opts(timeStr(h2, m2), [timeStr(h2, (m2 + 15) % 60), timeStr((h2 % 12) + 1, m2), timeStr(h, m2), timeStr(h2, (m2 + 30) % 60)], 4, v => v), answer: timeStr(h2, m2), explain: clockSVG(h2, m2),
      steps: [`It is ${timeStr(h, m)} now.`, ...(hr ? [`60 minutes is 1 hour. 1 hour later is ${timeStr(hM, m)}.`] : []), ...(rest ? [`Add ${rest} more minutes: ${timeStr(h2, m2)}.`] : [])], explainText: `In ${add} minutes it will be ${timeStr(h2, m2)}.` });
  }
  const cand = [timeStr(m === 0 ? h : h, (m + 30) % 60), timeStr((h % 12) + 1, m), timeStr(Math.round(m / 5) || 12, h * 5 % 60), timeStr(h, (m + 15) % 60), timeStr(h === 1 ? 12 : h - 1, m)];
  const words = m === 0 ? `${h} o'clock` : m === 30 ? `half past ${h}` : m === 15 ? `quarter past ${h}` : m === 45 ? `quarter to ${h % 12 + 1}` : `${m} minutes past ${h}`;
  return Q({ prompt: 'What time is it?', speak: 'Look at the clock. What time is it?', visual: clockSVG(h, m), choices: opts(timeStr(h, m), cand, 4, v => v), answer: timeStr(h, m), explain: clockSVG(h, m),
    steps: [`Short hand first: it is ${m ? `just past ${h}` : `on ${h}`}${m >= 30 ? `, on its way to ${h % 12 + 1}` : ''}. The hour is ${h}.`, m === 0 ? 'The long hand points to 12, so it is exactly on the hour.' : m % 5 ? `The long hand: count in 5s, then count on the little marks. It shows ${m} minutes.` : `The long hand points to ${m / 5}. Count in 5s: ${m / 5} × 5 = ${m} minutes.`], explainText: `It is ${words}, ${timeStr(h, m)}.` });
});
S('oddeven', 1, 'Odd and even', '🧦', [
  ['Even numbers make pairs, with none left over. 4 socks make 2 pairs.', () => pairsPic(4, '🧦')],
  ['Odd numbers always have one left over. 5 socks: 2 pairs and 1 on its own.', () => pairsPic(5, '🧦')],
  ['Big numbers: just look at the last digit. 0, 2, 4, 6, 8 mean even. 1, 3, 5, 7, 9 mean odd.', () => '<div class="m2track"><span>0</span><span>2</span><span>4</span><span>6</span><span>8</span></div>'],
  ['Try it: 358 ends in 8, so 358 is even.', () => '<span class="bignum">35<u>8</u></span>']
], L => {
  const n = L === 1 ? rnd(1, 10) : L === 2 ? rnd(1, 20) : L === 3 ? rnd(10, 100) : L === 4 ? 0 : rnd(100, 99999);
  if (L === 4) { const a = rnd(1, 20), b = rnd(1, 20), s = a + b; return Q({ prompt: `Is ${a} + ${b} odd or even?`, choices: opts(s % 2 ? 'odd' : 'even', ['odd', 'even'], 2, v => v), answer: s % 2 ? 'odd' : 'even',
    steps: [`Add first: ${a} + ${b} = ${s}.`, `${s} ends in ${s % 10}.`, `${s % 10} is ${s % 2 ? 'odd' : 'even'}, so ${s} is ${s % 2 ? 'odd' : 'even'}.`], explainText: `Tip: odd + odd is even, even + even is even, odd + even is odd.` }); }
  const oe = n % 2 ? 'odd' : 'even';
  return Q({ prompt: `Is ${fmt(n)} odd or even?`, visual: L === 1 ? objs(n, '🧦') : '', choices: opts(oe, ['odd', 'even'], 2, v => v), answer: oe, explain: n <= 12 ? pairsPic(n, '🧦') : '',
    steps: n <= 12 ? ['Put them in pairs.', n % 2 ? 'There is 1 left over.' : 'None are left over.'] : [`Look at the last digit: ${n % 10}.`, `${n % 10} is ${oe}.`],
    explainText: `So ${fmt(n)} is ${oe}. ${n % 2 ? 'Odd numbers end in 1, 3, 5, 7 or 9.' : 'Even numbers end in 0, 2, 4, 6 or 8.'}` });
});

S('money', 1, 'Money', '🪙', [
  ['Coins have different values. Look at the number on each coin. A big coin is not always worth more!', () => coins([1, 5, 10, 20])],
  ['To count money, start with the biggest coin and count on: 10, then 15, then 16.', () => `${coins([10, 5, 1])}<span class="bignum">16¢</span>`],
  ['100 cents make 1 dollar.', () => `${coins([100])}<span class="bignum">= 100¢</span>`],
  ['Change: count up from the price to what you paid. Toy 70¢, pay $1: 80, 90, 100. That is 30¢ change.', () => hopLine([70, 80, 90, 100], ['+10', '+10', '+10'])]
], L => {
  if (L <= 3) {
    const kinds = [[1, 5], [1, 2, 5, 10], [1, 2, 5, 10, 20, 50]][L - 1], n = rnd(2, [3, 4, 5][L - 1]);
    const list = Array.from({ length: n }, () => pick(kinds)).sort((a, b) => b - a), tot = list.reduce((a, b) => a + b, 0);
    const run = []; list.reduce((a, b) => (run.push(a + b), a + b), 0);
    return Q({ prompt: 'How much money is this?', visual: coins(list), choices: opts(tot, near(tot).filter(v => v > 0).concat([list.length]), 4, v => v + '¢'), answer: tot,
      explain: coins(list), steps: [`Start with the biggest coin: ${list[0]}¢.`, ...list.slice(1).map((c, i) => `Add ${c}¢ to get ${run[i + 1]}¢.`)], explainText: `${list.join('¢ + ')}¢ = ${tot}¢.` });
  }
  if (L === 4) {
    const price = rnd(1, 19) * 5, pay = 100, ch = pay - price, up = Math.ceil(price / 10) * 10, two = price % 10 && up < 100;
    return Q({ prompt: word(`A toy costs ${price}¢. You pay with $1. How much change do you get?`), speak: `A toy costs ${price} cents. You pay with 1 dollar, which is 100 cents. How much change do you get?`, visual: coins([100]),
      choices: opts(ch, near(ch).filter(v => v > 0 && v < 100).concat([price]), 4, v => v + '¢'), answer: ch, explain: hopLine(two ? [price, up, 100] : [price, 100], two ? [`+${up - price}`, `+${100 - up}`] : [`+${ch}`]),
      steps: ['$1 is 100¢.', `Count up from ${price}¢ to 100¢.`, two ? `${price} to ${up} is ${up - price}. ${up} to 100 is ${100 - up}. Together ${ch}.` : `${price} to 100 is ${ch}.`], explainText: `100 − ${price} = ${ch}, so your change is ${ch}¢.` });
  }
  const a = rnd(105, 495), b = rnd(55, 395), tot = a + b, pay = Math.ceil((tot + 1) / 500) * 500;
  if (Math.random() < 0.5) return Q({ prompt: word(`A book costs ${money(a)} and a pen costs ${money(b)}. How much altogether?`), speak: `A book costs ${moneySay(a)} and a pen costs ${moneySay(b)}. How much altogether?`,
    choices: opts(tot, [tot + 10, tot - 10, tot + 100, tot - 100, tot + 1], 4, money, moneySay), answer: tot, steps: [`Add the dollars: ${Math.floor(a / 100)} + ${Math.floor(b / 100)} = ${Math.floor(a / 100) + Math.floor(b / 100)}.`, `Add the cents: ${a % 100} + ${b % 100} = ${a % 100 + b % 100}.`, ...(a % 100 + b % 100 >= 100 ? ['100 cents make 1 more dollar.'] : [])], explainText: `Altogether it costs ${money(tot)}.` });
  const ch = pay - tot;
  return Q({ prompt: word(`You buy things costing ${money(tot)} and pay with $${pay / 100}. How much change?`), speak: `You buy things costing ${moneySay(tot)} and pay with ${pay / 100} dollars. How much change?`,
    choices: opts(ch, [ch + 10, ch - 10, ch + 100, ch - 1, ch + 5].filter(v => v > 0), 4, money, moneySay), answer: ch, steps: [`Change = ${money(pay)} − ${money(tot)}.`, `Count up from ${money(tot)} to ${money(pay)}.`], explainText: `Your change is ${money(ch)}.` });
});

/* ===== World 3: Treetop Town ===== */
S('addbig', 2, 'Big adding', '🏗️', [
  ['Line the numbers up in columns: ones under ones, tens under tens.', () => column(47, 25, '+')],
  ['Add the ones first. 7 + 5 = 12. That is 1 ten and 2 ones. Write 2 and carry the 1 ten.', () => tensOnes(1, 2)],
  ['Then add the tens, plus the carried 1: 4 + 2 + 1 = 7. Answer: 72.', () => column(47, 25, '+', 72)],
  ['Check it is sensible: 47 is about 50 and 25 is about 30. 50 + 30 = 80, close to 72.', () => bigEq('50 + 30 = 80')]
], L => {
  const r = [[10, 49, 10, 49, false], [15, 69, 15, 29, true], [100, 699, 11, 99, true], [100, 599, 100, 399, true], [1000, 5999, 1000, 3999, true]][L - 1];
  let a = rnd(r[0], r[1]), b = rnd(r[2], r[3]); if (!r[4]) b = b - (b % 10) + rnd(0, 9 - (a % 10));
  const s = a + b;
  return Q({ prompt: `${fmt(a)} + ${fmt(b)} = ?`, speak: `What is ${a} plus ${b}?`, visual: column(a, b, '+'), choices: opts(s, [s + 10, s - 10, s + 1, s - 100, s + 100, s - 9]), answer: s, explain: column(a, b, '+', s),
    steps: colSteps(a, b), explainText: `So ${fmt(a)} + ${fmt(b)} = ${fmt(s)}.` });
});
function colSteps(a, b, place = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands']) {
  const out = []; let carry = 0, i = 0;
  while (a || b || carry) { const da = a % 10, db = b % 10, t = da + db + carry; out.push(`${place[i]}: ${da} + ${db}${carry ? ' + 1 carried' : ''} = ${t}${t >= 10 ? `, write ${t % 10} and carry 1` : ''}.`); carry = t >= 10 ? 1 : 0; a = Math.floor(a / 10); b = Math.floor(b / 10); i++; }
  return out.map(s => s[0].toUpperCase() + s.slice(1));
}
S('subbig', 2, 'Big taking away', '⛏️', [
  ['Line up the columns. Start with the ones.', () => column(52, 17, '−')],
  ['2 − 7? Not enough! Borrow a ten: break one rod into 10 cubes. Now there are 4 tens and 12 ones.', () => tensOnes(4, 12)],
  ['12 − 7 = 5. Then the tens: 4 − 1 = 3. Answer: 35.', () => column(52, 17, '−', 35)],
  ['Check by adding back: 35 + 17 = 52. Yes!', () => bigEq('35 + 17 = 52 ✓')]
], L => {
  const r = [[20, 99, 10, 19, false], [30, 99, 11, 29, true], [200, 999, 11, 99, true], [300, 999, 101, 299, true], [2000, 9999, 1000, 1999, true]][L - 1];
  let a = rnd(r[0], r[1]), b = rnd(r[2], Math.min(r[3], a - 1)); if (!r[4]) b = b - (b % 10) + rnd(0, a % 10);
  const d = a - b;
  return Q({ prompt: `${fmt(a)} − ${fmt(b)} = ?`, speak: `What is ${a} take away ${b}?`, visual: column(a, b, '−'), choices: opts(d, [d + 10, d - 10, d + 1, d + 100, Math.abs((a % 10) - (b % 10)) + (Math.floor(a / 10) - Math.floor(b / 10)) * 10]), answer: d, explain: column(a, b, '−', d),
    steps: subSteps(a, b), explainText: `${fmt(a)} − ${fmt(b)} = ${fmt(d)}. Check: ${fmt(d)} + ${fmt(b)} = ${fmt(a)}.` });
});
S('times', 2, 'Times tables', '✖️', [
  ['3 × 4 means 3 groups of 4.', () => `<div class="row">${objs(4, '🍪')}${objs(4, '🍪')}${objs(4, '🍪')}</div>`],
  ['You can add: 4 + 4 + 4 = 12. So 3 × 4 = 12.', () => '<span class="bignum">3 × 4 = 12</span>'],
  ['Put them in rows. 3 rows of 4. Turn it round and it is 4 rows of 3: still 12!', () => arraySVG(3, 4)],
  ['Tricks: × 2 is double. × 10 puts a 0 on the end. × 5 is half of × 10: 8 × 10 = 80, so 8 × 5 = 40.', () => bigEq('8 × 5 = 40')]
], L => {
  const t = pick([[2, 10], [5, 2, 10], [3, 4], [6, 7, 8, 9], [11, 12, 6, 7, 8, 9]][L - 1]), b = rnd(1, L >= 4 ? 12 : 10), p = t * b, [e] = pick(THINGS);
  const [x, y] = Math.random() < 0.5 ? [t, b] : [b, t];
  const tSteps = t === 2 ? [`Times 2 means double.`, `Double ${b} is ${p}.`]
    : t === 10 ? [`Times 10: put a 0 on the end of ${b}.`, `${b} becomes ${p}.`]
    : t === 5 ? [`Times 5 is half of times 10.`, `${b} × 10 = ${b * 10}.`, `Half of ${b * 10} is ${p}.`]
    : t === 4 ? [`Times 4 is double, then double again.`, `Double ${b} is ${2 * b}.`, `Double ${2 * b} is ${p}.`]
    : t === 3 ? [`Times 3 is double, and one more.`, `Double ${b} is ${2 * b}.`, `${2 * b} + ${b} = ${p}.`]
    : t === 9 ? [`Times 9 is times 10, take away one.`, `${b} × 10 = ${b * 10}.`, `${b * 10} − ${b} = ${p}.`]
    : t === 11 ? [`Times 11 is times 10, add one more.`, `${b} × 10 = ${b * 10}.`, `${b * 10} + ${b} = ${p}.`]
    : t === 12 ? [`Times 12 is times 10, add times 2.`, `${b} × 10 = ${b * 10} and ${b} × 2 = ${b * 2}.`, `${b * 10} + ${b * 2} = ${p}.`]
    : [`Split ${t} into 5 and ${t - 5}.`, `${b} × 5 = ${b * 5} and ${b} × ${t - 5} = ${b * (t - 5)}.`, `${b * 5} + ${b * (t - 5)} = ${p}.`];
  return Q({ prompt: `${x} × ${y} = ?`, speak: `What is ${x} times ${y}?`, visual: p <= 30 && L <= 2 ? `<div class="row">${Array.from({ length: x }, () => objs(y, e)).join('')}</div>` : '',
    choices: opts(p, [p + t, p - t, p + b, p - b, p + 1, x + y]), answer: p, explain: p <= 60 && x <= 10 && y <= 10 ? arraySVG(x, y) : '', steps: tSteps, explainText: `${x} × ${y} means ${x} groups of ${y}. ${x <= 6 ? Array(x).fill(y).join(' + ') + ' = ' + p : 'Count by ' + y + 's ' + x + ' times to reach ' + p}.` });
});
S('divide', 2, 'Sharing and dividing', '➗', [
  ['Dividing means sharing equally. 12 ÷ 3: share 12 cookies between 3 friends, one at a time.', () => `<div class="row">${objs(4, '🍪')}${objs(4, '🍪')}${objs(4, '🍪')}</div>`],
  ['Each friend gets 4. So 12 ÷ 3 = 4.', () => '<span class="bignum">12 ÷ 3 = 4</span>'],
  ['A quicker way: use times tables backwards. 3 × what = 12? 3 × 4 = 12, so the answer is 4.', () => arraySVG(3, 4)],
  ['Sometimes some are left over. 13 ÷ 3 = 4, with 1 left. The 1 is the remainder.', () => `<div class="row">${objs(4, '🍪')}${objs(4, '🍪')}${objs(4, '🍪')}${objs(1, '🍪')}</div>`]
], L => {
  const d = pick([[2], [2, 5, 10], [3, 4], [6, 7, 8, 9], [3, 4, 6, 7, 8, 9]][L - 1]), q = rnd(1, L <= 2 ? 6 : 12), r = L === 5 ? rnd(1, d - 1) : 0, n = d * q + r, [e] = pick(THINGS);
  if (r) { const ans = `${q} r ${r}`; return Q({ prompt: `${n} ÷ ${d} = ?`, speak: `What is ${n} divided by ${d}?`, choices: opts(ans, [`${q + 1} r ${r}`, `${q} r ${r + 1}`, `${q - 1} r ${r + d}`, `${q}`], 4, v => v), answer: ans,
    steps: [`Find the ${d} times table number just below ${n}: ${d} × ${q} = ${d * q}.`, `${d} × ${q + 1} = ${d * (q + 1)} is too big.`, `${n} − ${d * q} = ${r} left over.`], explainText: `So ${n} ÷ ${d} is ${q} remainder ${r}.` }); }
  return Q({ prompt: `${n} ÷ ${d} = ?`, speak: `What is ${n} divided by ${d}?`, visual: L === 1 ? objs(n, e) : '', choices: opts(q, near(q).filter(v => v > 0).concat([d, n - d])), answer: q,
    explain: L <= 2 ? `<div class="row">${Array.from({ length: d }, () => objs(q, e)).join('')}</div>` : n <= 60 ? arraySVG(d, q) : '',
    steps: [`Think: ${d} × what = ${n}?`, `${d} × ${q} = ${n}.`], explainText: `So ${n} ÷ ${d} = ${q}. ${n} shared into ${d} equal groups gives ${q} in each.` });
});
S('missing', 2, 'Missing numbers', '🔍', [
  ['A number is hiding! Something plus 5 makes 12.', () => '<span class="bignum">? + 5 = 12</span>'],
  ['Draw it as a bar. The whole bar is 12. One part is 5. The other part is the mystery.', () => barModel([{ w: 7, t: '?' }, { w: 5, t: 5 }], 12)],
  ['Do the opposite to find it: 12 − 5 = 7. Check: 7 + 5 = 12. Yes!', () => '<span class="bignum">? = 7</span>'],
  ['Opposites undo each other: + and −, × and ÷. Something × 3 = 12? Then 12 ÷ 3 = 4.', () => bigEq('? × 3 = 12')]
], L => {
  const op = pick([['+'], ['+', '−'], ['×'], ['×', '÷'], ['+', '−', '×', '÷']][L - 1]);
  let a, b, c, txt;
  if (op === '+') { a = rnd(5, 50); b = rnd(5, 50); c = a + b; txt = `${c} − ${b} = ${a}`; }
  if (op === '−') { c = rnd(5, 50); b = rnd(5, 40); a = c + b; c = a - b; txt = `${a} = ${c} + ${b}`; }
  if (op === '×') { a = rnd(2, 12); b = rnd(2, 12); c = a * b; txt = `${c} ÷ ${b} = ${a}`; }
  if (op === '÷') { b = rnd(2, 12); c = rnd(2, 12); a = b * c; txt = `${c} × ${b} = ${a}`; }
  const inv = { '+': 'take away', '−': 'add', '×': 'divide', '÷': 'multiply' }[op], wd = { '+': 'adding', '−': 'taking away', '×': 'multiplying', '÷': 'dividing' }[op];
  const pic = op === '+' ? barModel([{ w: Math.max(a, c / 5), t: '?' }, { w: Math.max(b, c / 5), t: b }], c) : op === '−' ? barModel([{ w: Math.max(c, a / 5), t: c }, { w: Math.max(b, a / 5), t: b }], '?') : '';
  return Q({ prompt: `? ${op} ${b} = ${c}`, speak: `What number ${op === '+' ? 'plus' : op === '−' ? 'minus' : op === '×' ? 'times' : 'divided by'} ${b} makes ${c}?`, choices: opts(a, near(a).concat([c, b])), answer: a, explain: pic,
    steps: [`The opposite of ${wd} is to ${inv}.`, `${txt}.`, `Check: ${a} ${op} ${b} = ${c}.`], explainText: `The missing number is ${a}.` });
});
S('fractions', 2, 'Fractions', '🍕', [
  ['A fraction is part of a whole cut into equal pieces. This pizza has 4 equal pieces.', () => pieSVG(4, 1)],
  ['The bottom number says how many equal pieces. The top number says how many we take. 1 of 4 pieces is one quarter.', () => `<span class="bignum">${frac(1, 4)}</span>`],
  ['3 pieces shaded out of 4 is three quarters.', () => `<div class="row">${pieSVG(4, 3)}<span class="bignum">${frac(3, 4)}</span></div>`],
  ['A fraction of a number: one third of 12. Share 12 into 3 equal groups. One group is 4.', () => `<div class="row">${objs(4, '🍓')}${objs(4, '🍓', { gone: 4 })}${objs(4, '🍓', { gone: 4 })}</div>`]
], L => {
  if (L === 4) { const d = pick([2, 3, 4, 5]), n = rnd(1, d - 1), k = rnd(2, 5), tot = d * k; return Q({ prompt: `What is ${frac(n, d)} of ${tot}?`, speak: `What is ${fracSay(n, d)} of ${tot}?`, visual: objs(Math.min(tot, 20), '🍓'), choices: opts(n * k, [k, tot - n * k, n * k + 1, tot / n | 0, d * n]), answer: n * k,
    explain: `<div class="row">${Array.from({ length: d }, (_, i) => objs(k, '🍓', { gone: i < n ? 0 : k })).join('')}</div>`, steps: [`The bottom number is ${d}: share ${tot} into ${d} equal groups.`, `${tot} ÷ ${d} = ${k} in each group.`, `The top number is ${n}: take ${n} group${n > 1 ? 's' : ''}. ${n} × ${k} = ${n * k}.`], explainText: `${frac(n, d)} of ${tot} is ${n * k}.` }); }
  if (L === 5) { const a = rnd(2, 8), b = rnd(2, 8); if (a === b) return MATH.fractions.gen(L); const big = a < b ? `1/${a}` : `1/${b}`, lo = Math.min(a, b), hi = Math.max(a, b); return Q({ prompt: `Which is bigger?`, speak: `Which is bigger, one over ${a} or one over ${b}?`, visual: `<div class="row">${pieSVG(a, 1)}${pieSVG(b, 1, '#F2604F')}</div>`, choices: opts(big, [`1/${a}`, `1/${b}`], 2, v => frac(...v.split('/'))), answer: big,
    explain: `<div class="row">${pieSVG(lo, 1)}${pieSVG(hi, 1, '#F2604F')}</div>`, steps: [`${frac(1, lo)} is 1 piece when the whole is cut into ${lo}.`, `${frac(1, hi)} is 1 piece when the whole is cut into ${hi}.`, `Fewer pieces means each piece is bigger.`], explainText: `${frac(1, lo)} is bigger than ${frac(1, hi)}.` }); }
  const d = pick([[2, 4], [2, 3, 4], [3, 4, 5, 6, 8]][L - 1]), n = L === 3 ? rnd(1, d - 1) : 1, shape = Math.random() < 0.5 ? pieSVG(d, n) : barSVG(d, n, '#2E8BE6');
  return Q({ prompt: 'What fraction is shaded?', speak: 'What fraction is colored in?', visual: shape, choices: opts(`${n}/${d}`, [`${d - n}/${d}`, `${n}/${d + 1}`, `${d}/${n}`, `1/${d + 1}`, `${n + 1}/${d}`].filter(s => !s.endsWith('/0') && s.split('/')[0] !== '0'), 4, v => frac(...v.split('/')), v => fracSay(...v.split('/'))), answer: `${n}/${d}`,
    explain: shape, steps: [`Count all the equal pieces: ${d}. That is the bottom number.`, `Count the shaded pieces: ${n}. That is the top number.`], explainText: `So it is ${frac(n, d)}.` });
});
S('word', 2, 'Story problems', '📖', [
  ['Read the story. Find the numbers.', () => word('Mia has <b>5</b> apples. She gets <b>3</b> more. How many now?')],
  ['Ask: are things joining? Add. Are things leaving? Take away. Here 3 more join, so add.', () => barModel([{ w: 5, t: 5 }, { w: 3, t: 3 }], '?')],
  ['Equal groups? Multiply. Sharing out equally? Divide.', () => '<span class="bignum">+ − × ÷</span>'],
  ['Write the number sentence and work it out: 5 + 3 = 8. Mia has 8 apples.', () => '<span class="bignum">5 + 3 = 8</span>']
], L => {
  const n = [10, 20, 50, 100, 1000][L - 1], name = pick(['Mia', 'Leo', 'Ava', 'Sam', 'Zoe', 'Kai']), t = pick(THINGS);
  const kinds = L <= 2 ? ['add', 'sub'] : ['add', 'sub', 'mul', 'div'];
  const k = pick(kinds);
  if (k === 'add') { const a = rnd(1, n / 2), b = rnd(1, n / 2); return Q({ prompt: word(`${name} has ${a} ${t[1]}. A friend gives ${b} more. How many now?`), speak: `${name} has ${a} ${t[1]}. A friend gives ${b} more. How many now?`, choices: opts(a + b, near(a + b).concat([a - b])), answer: a + b, explain: barModel([{ w: a + (a + b) / 4, t: a }, { w: b + (a + b) / 4, t: b }], '?'), steps: ['More are joining, so add.', `${a} + ${b} = ${a + b}.`], explainText: `${name} has ${a + b} ${t[1]} now.` }); }
  if (k === 'sub') { const a = rnd(3, n), b = rnd(1, a - 1); return Q({ prompt: word(`${name} has ${a} ${t[1]} and gives away ${b}. How many are left?`), speak: `${name} has ${a} ${t[1]} and gives away ${b}. How many are left?`, choices: opts(a - b, near(a - b).concat([a + b])), answer: a - b, explain: barModel([{ w: a - b + a / 4, t: '?' }, { w: b + a / 4, t: b, c: '#F7B9AE' }], a), steps: ['Some are given away, so take away.', `${a} − ${b} = ${a - b}.`], explainText: `${a - b} ${t[1]} are left.` }); }
  const g = rnd(2, L === 3 ? 5 : 10), e = rnd(2, L === 3 ? 6 : 12);
  if (k === 'mul') return Q({ prompt: word(`There are ${g} boxes with ${e} ${t[1]} in each. How many altogether?`), speak: `There are ${g} boxes with ${e} ${t[1]} in each. How many altogether?`, choices: opts(g * e, [g + e, g * e + e, g * e - g, (g + 1) * e]), answer: g * e, explain: barModel(Array.from({ length: g }, () => ({ w: 1, t: e })), '?'), steps: [`${g} boxes, each with ${e}: equal groups, so multiply.`, `${g} × ${e} = ${g * e}.`], explainText: `There are ${g * e} ${t[1]} altogether.` });
  return Q({ prompt: word(`${name} shares ${g * e} ${t[1]} equally between ${g} friends. How many does each get?`), speak: `${name} shares ${g * e} ${t[1]} equally between ${g} friends. How many does each get?`, choices: opts(e, near(e).filter(v => v > 0).concat([g])), answer: e, explain: barModel(Array.from({ length: g }, () => ({ w: 1, t: '?' })), g * e), steps: [`Sharing equally between ${g}, so divide.`, `${g * e} ÷ ${g} = ${e}. Check: ${g} × ${e} = ${g * e}.`], explainText: `Each friend gets ${e}.` });
});
S('round', 2, 'Rounding', '🎯', [
  ['Rounding finds the nearest easy number. Is 47 nearer to 40 or to 50?', () => hopLine([40, 47, 50], [])],
  ['Look at the digit just to the right. 5 or more: round up. 4 or less: round down.', () => '<div class="m2track"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span></div><div class="m2track"><span class="hi">5</span><span class="hi">6</span><span class="hi">7</span><span class="hi">8</span><span class="hi">9</span></div>'],
  ['47 has 7 ones. 7 is 5 or more, so 47 rounds up to 50.', () => '<span class="bignum">47 → 50</span>'],
  ['Rounding helps you estimate. 48 + 31 is about 50 + 30 = 80.', () => bigEq('50 + 30 = 80')]
], L => {
  if (L === 5) { const a = rnd(11, 99), b = rnd(11, 99), r = x => Math.round(x / 10) * 10, est = r(a) + r(b); return Q({ prompt: `Estimate ${a} + ${b} by rounding to the nearest 10`, choices: opts(est, [est + 10, est - 10, a + b, est + 20]), answer: est,
    steps: [`${a} has ${a % 10} ones, so it rounds ${a % 10 >= 5 ? 'up' : 'down'} to ${r(a)}.`, `${b} has ${b % 10} ones, so it rounds ${b % 10 >= 5 ? 'up' : 'down'} to ${r(b)}.`, `Add the easy numbers: ${r(a)} + ${r(b)} = ${est}.`], explainText: `The estimate is ${est}. The exact answer, ${a + b}, is close to it.` }); }
  const to = [10, 10, 100, 1000][L - 1], n = L === 1 ? rnd(11, 99) : L === 2 ? rnd(101, 999) : L === 3 ? rnd(101, 999) : rnd(1001, 9999);
  const ans = Math.round(n / to) * to, down = Math.floor(n / to) * to;
  const dig = String(n).at(-(String(to).length - 1)), dn = { 10: 'ones', 100: 'tens', 1000: 'hundreds' }[to];
  return Q({ prompt: `Round ${fmt(n)} to the nearest ${to}`, choices: opts(ans, [down, down + to, down - to, n, down + 2 * to]), answer: ans, explain: hopLine([down, n, down + to], []),
    steps: [`${fmt(n)} is between ${fmt(down)} and ${fmt(down + to)}.`, `Look at the ${dn} digit: ${dig}.`, `${dig} is ${+dig >= 5 ? '5 or more, so round up' : '4 or less, so round down'}.`], explainText: `${fmt(n)} rounds to ${fmt(ans)}.` });
});

const UNITS = [['the length of a pencil', 'cm'], ['how far to the next town', 'km'], ['the length of a room', 'm'], ['the weight of an apple', 'g'], ['the weight of a dog', 'kg'], ['the water in a bath', 'L'], ['medicine on a spoon', 'mL'], ['the width of a fingernail', 'mm']];
S('measure', 2, 'Measuring', '📏', [
  ['Line the thing up with 0 on the ruler. The number at the end is how long it is.', () => ruler(4, 6)],
  ['Big units hold many small ones: 1 m = 100 cm, 1 kg = 1000 g, 1 L = 1000 mL.', () => '<span class="bignum">1 m = 100 cm</span>'],
  ['Big unit to small unit? Multiply. 3 m = 3 × 100 = 300 cm.', () => bigEq('3 m = 300 cm')],
  ['Small unit to big unit? Divide. 2000 g = 2000 ÷ 1000 = 2 kg.', () => bigEq('2000 g = 2 kg')]
], L => {
  if (L <= 2) {
    if (L === 2 && Math.random() < 0.5) { const [what, u] = pick(UNITS), others = ['mm', 'cm', 'm', 'km', 'g', 'kg', 'mL', 'L'].filter(x => x !== u); return Q({ prompt: `Which unit would you use for ${what}?`, choices: opts(u, others, 4, v => v), answer: u, steps: ['Think how big it is.', ['mm', 'cm', 'm', 'km'].includes(u) ? 'Tiny things use mm, small things cm, rooms m, long trips km.' : ['g', 'kg'].includes(u) ? 'Light things use g. Heavy things use kg.' : 'A little liquid uses mL. A lot uses L.'], explainText: `${what[0].toUpperCase() + what.slice(1)} is measured in ${{ mm: 'millimetres', cm: 'centimetres', m: 'metres', km: 'kilometres', g: 'grams', kg: 'kilograms', mL: 'millilitres', L: 'litres' }[u]} (${u}).` }); }
    const max = L === 1 ? 8 : 12, len = rnd(2, max - 1);
    return Q({ prompt: 'How long is the crayon?', speak: 'How many centimetres long is the crayon?', visual: ruler(len, max), choices: opts(len, near(len).filter(v => v > 0 && v <= max), 4, v => v + ' cm'), answer: len, explain: ruler(len, max), steps: ['Check the crayon starts at 0.', `Look at the number where it ends: ${len}.`], explainText: `So it is ${len} cm long.` });
  }
  const conv = [['m', 'cm', 100], ['kg', 'g', 1000], ['L', 'mL', 1000], ['km', 'm', 1000], ['cm', 'mm', 10]];
  const [big, small, f] = pick(L === 5 ? conv.slice(0, 4) : conv);
  if (L === 3) { const n = rnd(2, 9), ans = n * f; return Q({ prompt: `${n} ${big} = ? ${small}`, choices: opts(ans, [n * f / 10, n * f * 10, n + f, (n + 1) * f], 4, v => fmt(v) + ' ' + small), answer: ans, steps: [`1 ${big} = ${fmt(f)} ${small}.`, `Big to small, so multiply: ${n} × ${fmt(f)} = ${fmt(ans)}.`], explainText: `${n} ${big} = ${fmt(ans)} ${small}.` }); }
  if (L === 4) {
    const n = rnd(11, 99) / 10, ans = Math.round(n * f), back = Math.random() < 0.5;
    if (back) return Q({ prompt: `${fmt(ans)} ${small} = ? ${big}`, choices: opts(n, [n * 10, n / 10, +(n + 1).toFixed(1), ans], 4, v => fmt(v) + ' ' + big), answer: n, steps: [`1 ${big} = ${fmt(f)} ${small}.`, `Small to big, so divide: ${fmt(ans)} ÷ ${fmt(f)} = ${fmt(n)}.`], explainText: `${fmt(ans)} ${small} = ${fmt(n)} ${big}.` });
    return Q({ prompt: `${fmt(n)} ${big} = ? ${small}`, choices: opts(ans, [ans * 10, ans / 10, Math.round(n) * f, ans + f], 4, v => fmt(v) + ' ' + small), answer: ans, steps: [`1 ${big} = ${fmt(f)} ${small}.`, `Big to small, so multiply: ${fmt(n)} × ${fmt(f)} = ${fmt(ans)}.`], explainText: `${fmt(n)} ${big} = ${fmt(ans)} ${small}.` });
  }
  const a1 = rnd(1, 4), a2 = rnd(10, f - 1 > 99 ? 900 : 90), b2 = rnd(10, f - 1 > 99 ? 900 : 90), tot = a1 * f + a2 + b2;
  return Q({ prompt: word(`A ribbon is ${a1} ${big} ${a2} ${small}. Another is ${b2} ${small}. How long are they together, in ${small}?`), speak: `One is ${a1} ${big} and ${a2} ${small}. Another is ${b2} ${small}. How much together, in ${small}?`,
    choices: opts(tot, [a1 + a2 + b2, tot + f, tot - 10, a1 * 10 + a2 + b2], 4, v => fmt(v) + ' ' + small), answer: tot, steps: [`Change ${a1} ${big} into ${small}: ${a1} × ${fmt(f)} = ${fmt(a1 * f)} ${small}.`, `Add: ${fmt(a1 * f)} + ${a2} + ${b2} = ${fmt(tot)}.`], explainText: `Together they are ${fmt(tot)} ${small}.` });
});
S('data', 2, 'Charts and data', '📊', [
  ['A bar chart shows how many. The taller the bar, the more there are.', () => chartSVG([['🍎', 3], ['🍌', 5], ['🍇', 2]])],
  ['Read across from the top of a bar to the numbers on the side. Bananas: 5.', () => chartSVG([['🍎', 3], ['🍌', 5], ['🍇', 2]])],
  ['How many more? Read both bars, then take away. Bananas 5, apples 3: 5 − 3 = 2 more.', () => bigEq('5 − 3 = 2')],
  ['Averages: the mean is the total shared out equally. The median is the middle one in order. The range is biggest take away smallest.', () => '<span class="bignum">2, 3, 5</span>']
], L => {
  if (L === 5) {
    const n = 5, list = Array.from({ length: n }, () => rnd(2, 20));
    let sum = list.reduce((a, b) => a + b, 0);
    if (sum % n) { list[0] += n - sum % n; sum = list.reduce((a, b) => a + b, 0); }
    const sorted = [...list].sort((a, b) => a - b), k = pick(['mean', 'range', 'median']);
    const ans = k === 'mean' ? sum / n : k === 'range' ? sorted[n - 1] - sorted[0] : sorted[2];
    const how = { mean: `Add them: ${list.join(' + ')} = ${sum}. Share by ${n}: ${sum} ÷ ${n} = ${ans}.`, range: `Biggest minus smallest: ${sorted[n - 1]} − ${sorted[0]} = ${ans}.`, median: `Put them in order: ${sorted.join(', ')}. The middle one is ${ans}.` }[k];
    const st = { mean: [`Add them all: ${list.join(' + ')} = ${sum}.`, `There are ${n} numbers, so share by ${n}.`, `${sum} ÷ ${n} = ${ans}.`], range: [`Find the biggest: ${sorted[n - 1]}.`, `Find the smallest: ${sorted[0]}.`, `${sorted[n - 1]} − ${sorted[0]} = ${ans}.`], median: [`Put them in order: ${sorted.join(', ')}.`, `The middle one is the 3rd: ${ans}.`] }[k];
    return Q({ prompt: `Find the ${k === 'mean' ? 'mean (average)' : k} of: ${list.join(', ')}`, choices: opts(ans, [sum / n + 1, sorted[n - 1] - sorted[0], sorted[2], sum, list[2]].filter(v => Number.isInteger(v)), 4), answer: ans, steps: st, explainText: `The ${k} is ${ans}.` });
  }
  const step = L === 4 ? 2 : 1, data = chartData(L === 1 ? 3 : 4, L === 4 ? 10 : [5, 8, 10][L - 1]).map(d => [d[0], d[1] * step, d[2]]);
  const vis = chartSVG(data, step), [a, b] = shuffle(data);
  const k = L === 1 ? pick(['most', 'count']) : L === 2 ? pick(['count', 'least', 'most']) : L === 3 ? pick(['more', 'total']) : pick(['count', 'more', 'total']);
  if (k === 'most' || k === 'least') { const t = [...data].sort((x, y) => k === 'most' ? y[1] - x[1] : x[1] - y[1])[0]; return Q({ prompt: `Which has the ${k}?`, speak: `Look at the bar chart. Which has the ${k}?`, visual: vis, choices: data.map(d => ({ html: d[0], val: d[0], say: d[2] })), answer: t[0], steps: [`${k === 'most' ? 'The most' : 'The least'} means the ${k === 'most' ? 'tallest' : 'shortest'} bar.`, `Look along the tops of the bars to find it.`], explainText: `The ${t[2]} bar is the ${k === 'most' ? 'tallest' : 'shortest'}. It shows ${t[1]}.` }); }
  if (k === 'count') return Q({ prompt: `How many ${a[0]}?`, speak: `How many ${a[2]} are there?`, visual: vis, choices: opts(a[1], near(a[1]).filter(v => v > 0).concat([b[1]])), answer: a[1], explain: chartSVG([[a[0], a[1]]], step), steps: [`Find the ${a[2]} bar.`, 'Go to the top of it and read straight across to the numbers on the side.'], explainText: `It shows ${a[1]}.` });
  if (k === 'more') { const [hi, lo] = a[1] > b[1] ? [a, b] : [b, a]; return Q({ prompt: `How many more ${hi[0]} than ${lo[0]}?`, speak: `How many more ${hi[2]} than ${lo[2]}?`, visual: vis, choices: opts(hi[1] - lo[1], near(hi[1] - lo[1]).filter(v => v > 0).concat([hi[1] + lo[1], hi[1]])), answer: hi[1] - lo[1], explain: chartSVG([[hi[0], hi[1]], [lo[0], lo[1]]], step), steps: [`Read the ${hi[2]} bar: ${hi[1]}.`, `Read the ${lo[2]} bar: ${lo[1]}.`, `How many more means take away: ${hi[1]} − ${lo[1]} = ${hi[1] - lo[1]}.`], explainText: `There are ${hi[1] - lo[1]} more ${hi[2]}.` }); }
  const tot = data.reduce((s, d) => s + d[1], 0);
  return Q({ prompt: 'How many altogether?', speak: 'Add up all the bars. How many altogether?', visual: vis, choices: opts(tot, near(tot).filter(v => v > 0)), answer: tot, steps: [`Read every bar: ${data.map(d => d[1]).join(', ')}.`, `Add them up: ${data.map(d => d[1]).join(' + ')} = ${tot}.`], explainText: `Altogether there are ${tot}.` });
});

/* ===== World 4: Deep Forest ===== */
S('longmul', 3, 'Long multiplication', '🧮', [
  ['Split the big number into tens and ones: 23 is 20 and 3. So 23 × 4 is 20 × 4 and 3 × 4.', () => gridMul([20, 3], [4])],
  ['20 × 4 = 80 and 3 × 4 = 12. Add them: 80 + 12 = 92.', () => '<span class="bignum">23 × 4 = 92</span>'],
  ['For 2-digit × 2-digit, split both: 23 × 14. Fill in every box of the grid.', () => gridMul([20, 3], [10, 4])],
  ['Add up all the boxes: 200 + 30 + 80 + 12 = 322.', () => bigEq('23 × 14 = 322')]
], L => {
  const r = [[12, 49, 2, 9], [101, 499, 2, 9], [12, 49, 11, 29], [101, 399, 11, 49], [1001, 4999, 11, 59]][L - 1], a = rnd(r[0], r[1]), b = rnd(r[2], r[3]), p = a * b;
  const steps = b < 10 ? splitSteps(a, b) : [`Split ${b} into ${b - b % 10} and ${b % 10}.`, `${fmt(a)} × ${b - b % 10} = ${fmt(a * (b - b % 10))}.`, `${fmt(a)} × ${b % 10} = ${fmt(a * (b % 10))}.`, `Add them: ${fmt(a * (b - b % 10))} + ${fmt(a * (b % 10))} = ${fmt(p)}.`];
  const aParts = String(a).split('').map((d, i, s) => +d * 10 ** (s.length - 1 - i)).filter(Boolean);
  return Q({ prompt: `${fmt(a)} × ${b} = ?`, speak: `What is ${a} times ${b}?`, choices: opts(p, [p + a, p - a, p + 10, p + b * 10, a * (b % 10) + a * Math.floor(b / 10)]), answer: p,
    explain: b < 10 ? gridMul(aParts, [b]) : gridMul([a], [b - b % 10, b % 10].filter(Boolean)), steps, explainText: `${fmt(a)} × ${b} = ${fmt(p)}.` });
});
function splitSteps(a, b) {
  const parts = String(a).split('').map((d, i, s) => +d * 10 ** (s.length - 1 - i)).filter(Boolean);
  return [`Split ${fmt(a)} into ${parts.map(fmt).join(' + ')}.`, ...parts.map(p => `${fmt(p)} × ${b} = ${fmt(p * b)}.`), `Add: ${parts.map(p => fmt(p * b)).join(' + ')} = ${fmt(a * b)}.`];
}
S('longdiv', 3, 'Long division', '🍰', [
  ['Write it like a bus stop. Divide one digit at a time from the left. 84 ÷ 4: how many 4s in 8? 2.', () => busStop(4, 84, '2')],
  ['Now the next digit. How many 4s in 4? 1. So 84 ÷ 4 = 21.', () => busStop(4, 84, 21)],
  ['If a digit does not share exactly, carry what is left to the next digit. 72 ÷ 4: 7 ÷ 4 = 1, 3 left. 32 ÷ 4 = 8. Answer 18.', () => busStop(4, 72, 18)],
  ['Some left over at the end is the remainder: 85 ÷ 4 = 21 remainder 1. Check: 4 × 21 + 1 = 85.', () => bigEq('85 ÷ 4 = 21 r 1')]
], L => {
  const d = L === 5 ? rnd(11, 25) : rnd(2, 9), q = L === 1 ? rnd(11, Math.max(11, Math.floor(99 / d))) : L === 5 ? rnd(11, 60) : rnd(21, L === 4 ? 999 : 199), r = L === 3 ? rnd(1, d - 1) : 0, n = d * q + r;
  const ans = r ? `${q} r ${r}` : String(q);
  const steps = []; let rem = 0, qs = '';
  for (const ch of String(n)) { const cur = rem * 10 + +ch, k = Math.floor(cur / d); if (qs || k) steps.push(`${rem ? (steps.length ? `Carry the ${rem} to make ${cur}. ` : `${rem} is too small to share by ${d}, so use ${cur}. `) : ''}${cur} ÷ ${d} = ${k}${cur - k * d ? `, ${cur - k * d} left over` : ''}.`); qs += k; rem = cur - k * d; }
  return Q({ prompt: `${fmt(n)} ÷ ${d} = ?`, speak: `What is ${n} divided by ${d}?`, choices: opts(ans, r ? [`${q + 1} r ${r}`, `${q} r ${(r + 1) % d || d}`, `${q - 1} r ${r}`, String(q)] : [q + 1, q - 1, q + 10, q * 10, q - 10].map(String), 4, v => v), answer: ans,
    explain: busStop(d, n, ans), steps: steps.length <= 5 ? steps : null, explainText: `Check: ${d} × ${q}${r ? ` + ${r}` : ''} = ${fmt(n)}. So the answer is ${r ? `${q} remainder ${r}` : q}.` });
});
S('fracops', 3, 'Fraction maths', '🥧', [
  [`Equivalent fractions are the same amount: ${frac(1, 2)} is the same as ${frac(2, 4)}.`, () => `<div class="row">${pieSVG(2, 1)}${pieSVG(4, 2)}</div>`],
  ['To make one, multiply the top and the bottom by the same number. To simplify, divide them both by the same number.', () => bigEq(`${frac(1, 2)} = ${frac(2, 4)} = ${frac(4, 8)}`)],
  [`To add fractions, the bottoms must match. Then just add the tops: ${frac(1, 4)} + ${frac(2, 4)} = ${frac(3, 4)}.`, () => barSVG(4, 3)],
  [`To multiply fractions, multiply the tops, then multiply the bottoms: ${frac(1, 2)} × ${frac(3, 4)} = ${frac(3, 8)}.`, () => bigEq(`${frac(1, 2)} × ${frac(3, 4)} = ${frac(3, 8)}`)]
], L => {
  const F = v => frac(...v.split('/')), sayF = v => fracSay(...v.split('/'));
  const simp = (n, d) => { const g = gcd(n, d); return `${n / g}/${d / g}`; };
  if (L === 1) { const d = pick([2, 3, 4, 5]), n = rnd(1, d - 1), k = rnd(2, 4); return Q({ prompt: `${frac(n, d)} = ${frac('?', d * k)}`, speak: `${fracSay(n, d)} equals what over ${d * k}?`, choices: opts(n * k, [n + k, n * k + 1, d * k - n * k, n]), answer: n * k, explain: `<div class="row">${pieSVG(d, n)}${pieSVG(d * k, n * k)}</div>`, steps: [`The bottom went from ${d} to ${d * k}. That is times ${k}.`, `Do the same to the top: ${n} × ${k} = ${n * k}.`], explainText: `${frac(n, d)} = ${frac(n * k, d * k)}. Same amount, smaller pieces.` }); }
  if (L === 2) { const d = pick([2, 3, 4, 5]), n = rnd(1, d - 1), k = rnd(2, 5), s = simp(n * k, d * k); return Q({ prompt: `Simplify ${frac(n * k, d * k)}`, speak: `Simplify ${fracSay(n * k, d * k)}`, choices: opts(s, [`${n * k / gcd(n * k, d * k) + 1}/${d}`, `${n}/${d * k}`, `${n * k}/${d}`, `1/${k}`], 4, F, sayF), answer: s, explain: `<div class="row">${barSVG(d * k, n * k)}${barSVG(+s.split('/')[1], +s.split('/')[0])}</div>`, steps: [`Find the biggest number that divides both ${n * k} and ${d * k}: ${gcd(n * k, d * k)}.`, `${n * k} ÷ ${gcd(n * k, d * k)} = ${s.split('/')[0]} and ${d * k} ÷ ${gcd(n * k, d * k)} = ${s.split('/')[1]}.`], explainText: `So ${frac(n * k, d * k)} = ${F(s)}.` }); }
  if (L === 3) { const d = pick([5, 6, 7, 8, 9, 10]), a = rnd(1, d - 2), b = rnd(1, d - 1 - a), s = `${a + b}/${d}`; return Q({ prompt: `${frac(a, d)} + ${frac(b, d)} = ?`, speak: `${fracSay(a, d)} plus ${fracSay(b, d)}`, choices: opts(s, [`${a + b}/${d * 2}`, `${a * b}/${d}`, `${a + b + 1}/${d}`, `${Math.abs(a - b) || 1}/${d}`], 4, F, sayF), answer: s, explain: barSVG(d, a + b), steps: [`The bottoms match: both are ${d}.`, `Add the tops: ${a} + ${b} = ${a + b}.`, `Keep the bottom the same: ${F(s)}.`], explainText: `The pieces are the same size, so you just count them.` }); }
  if (L === 4) { const [d1, d2] = pick([[2, 4], [3, 6], [2, 6], [4, 8], [2, 3], [3, 4], [2, 5]]), a = rnd(1, d1 - 1), b = rnd(1, d2 - 1), L2 = lcm(d1, d2), n = a * L2 / d1 + b * L2 / d2, s = simp(n, L2); return Q({ prompt: `${frac(a, d1)} + ${frac(b, d2)} = ?`, speak: `${fracSay(a, d1)} plus ${fracSay(b, d2)}`, choices: opts(s, [`${a + b}/${d1 + d2}`, `${a + b}/${L2}`, simp(n + 1, L2), `${a * b}/${d1 * d2}`], 4, F, sayF), answer: s, steps: [`Make the bottoms match: use ${L2}.`, `${frac(a, d1)} = ${frac(a * L2 / d1, L2)} and ${frac(b, d2)} = ${frac(b * L2 / d2, L2)}.`, `Add the tops: ${a * L2 / d1} + ${b * L2 / d2} = ${n}, so ${frac(n, L2)}${s !== `${n}/${L2}` ? ` = ${F(s)}` : ''}.`], explainText: `The answer is ${F(s)}.` }); }
  const a = rnd(1, 4), b = rnd(2, 6), c = rnd(1, 4), d = rnd(2, 6), s = simp(a * c, b * d);
  return Q({ prompt: `${frac(a, b)} × ${frac(c, d)} = ?`, speak: `${fracSay(a, b)} times ${fracSay(c, d)}`, choices: opts(s, [`${a + c}/${b + d}`, `${a * d}/${b * c}`, `${a * c}/${b + d}`, simp(a * c + 1, b * d)], 4, F, sayF), answer: s, steps: [`Multiply the tops: ${a} × ${c} = ${a * c}.`, `Multiply the bottoms: ${b} × ${d} = ${b * d}.`, s !== `${a * c}/${b * d}` ? `${frac(a * c, b * d)} simplifies to ${F(s)}.` : `That gives ${F(s)}.`], explainText: `The answer is ${F(s)}.` });
});
S('decimals', 3, 'Decimals', '🔟', [
  ['A decimal point splits wholes from parts. Cut 1 whole into 10 equal parts. 3 parts is 3 tenths: 0.3.', () => barSVG(10, 3)],
  ['After the point: first tenths, then hundredths. 0.25 is 2 tenths and 5 hundredths.', () => '<table class="m3tab"><tr><th>Ones</th><th>.</th><th>Tenths</th><th>Hundredths</th></tr><tr><td>0</td><td>.</td><td>2</td><td>5</td></tr></table>'],
  ['To compare, give them the same number of places. 0.5 is 0.50, which is more than 0.45.', () => bigEq('0.50 > 0.45')],
  ['Line up the decimal points to add or take away: 1.5 + 2.3 = 3.8.', () => '<pre class="column"> 1.5\n+2.3\n────\n 3.8</pre>']
], L => {
  if (L === 1) { const n = rnd(1, 9); return Q({ prompt: 'What decimal is shaded?', visual: barSVG(10, n), choices: opts(`0.${n}`, [`${n}.0`, `0.0${n}`, `0.${10 - n}`, `0.${(n % 9) + 1}`], 4, v => v), answer: `0.${n}`, explain: barSVG(10, n), steps: ['The bar is cut into 10 equal parts. Each part is one tenth, 0.1.', `${n} parts are shaded: ${n} tenths.`], explainText: `${n} tenths is written 0.${n}.` }); }
  if (L === 2) { const a = rnd(1, 99) / 100, b = rnd(1, 9) / 10; if (a === b) return MATH.decimals.gen(L); const big = Math.max(a, b); return Q({ prompt: 'Which is bigger?', choices: opts(String(big), [String(a), String(b)], 2, v => v), answer: String(big), steps: [`Give both 2 decimal places: ${a.toFixed(2)} and ${b.toFixed(2)}.`, `Compare the tenths first: ${a.toFixed(2)[2]} and ${b.toFixed(2)[2]}.${a.toFixed(2)[2] === b.toFixed(2)[2] ? ' They match, so compare the hundredths.' : ''}`], explainText: `${big} is bigger.` }); }
  if (L === 5) { const a = rnd(11, 999) / 10, k = pick([10, 100]), mul = Math.random() < 0.5, r = +(mul ? a * k : a / k).toFixed(4); return Q({ prompt: `${a} ${mul ? '×' : '÷'} ${k} = ?`, choices: opts(r, [+(mul ? a / k : a * k).toFixed(4), +(r * 10).toFixed(4), +(r / 10).toFixed(4)]), answer: r, steps: [`${mul ? 'Multiplying' : 'Dividing'} by ${k} makes the number ${k} times ${mul ? 'bigger' : 'smaller'}.`, `Every digit moves ${k === 10 ? 'one place' : 'two places'} to the ${mul ? 'left' : 'right'}.`, `${a} becomes ${fmt(r)}.`], explainText: `${a} ${mul ? '×' : '÷'} ${k} = ${fmt(r)}.` }); }
  const dp = L === 3 ? 1 : 2, a = rnd(10, 999) / 10 ** dp, b = rnd(10, 499) / 10 ** dp, sub = L === 4 && Math.random() < 0.5 && a > b, r = +(sub ? a - b : a + b).toFixed(dp);
  const sc = 10 ** dp, A = Math.round(a * sc), B = Math.round(b * sc), dn = dp === 1 ? ['Tenths', 'Ones', 'Tens', 'Hundreds'] : ['Hundredths', 'Tenths', 'Ones', 'Tens'];
  const w = Math.max(a.toFixed(dp).length, b.toFixed(dp).length + 1, r.toFixed(dp).length);
  return Q({ prompt: `${a.toFixed(dp)} ${sub ? '−' : '+'} ${b.toFixed(dp)} = ?`, choices: opts(r, near(r, { dec: dp }).concat([+(r * 10).toFixed(dp)])), answer: r,
    explain: `<pre class="column">${a.toFixed(dp).padStart(w)}\n${sub ? '−' : '+'}${b.toFixed(dp).padStart(w - 1)}\n${'─'.repeat(w)}\n${r.toFixed(dp).padStart(w)}</pre>`,
    steps: ['Line up the decimal points.', ...(sub ? subSteps(A, B, dn) : colSteps(A, B, dn.map(x => x.toLowerCase()))).slice(0, 4)], explainText: `Keep the point in line: the answer is ${r.toFixed(dp)}.` });
});
S('percent', 3, 'Percentages', '💯', [
  ['Percent means out of 100. 50% is half, 25% is a quarter, 10% is a tenth.', () => barSVG(10, 5)],
  ['50% is half. 25% is a quarter. 10% is one tenth.', () => `<div class="row">${barSVG(4, 2, '#2E8BE6')}${barSVG(4, 1, '#F2604F')}</div>`],
  ['To find 10%, divide by 10. 10% of 80 is 8.', () => bigEq('80 ÷ 10 = 8')],
  ['Build other percents from 10%. 30% is 3 lots of 10%: 3 × 8 = 24. 5% is half of 10%: 4.', () => bigEq('30% of 80 = 24')]
], L => {
  if (L === 3) { const [n, d] = pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [1, 10], [7, 10], [3, 5]]), p = n / d * 100; return Q({ prompt: `${frac(n, d)} = ?%`, speak: `What percent is ${fracSay(n, d)}?`, choices: opts(`${p}%`, [`${n * 10}%`, `${d * 10}%`, `${100 - p}%`, `${n}${d}%`].filter(v => v !== `${p}%`), 4, v => v), answer: `${p}%`, explain: barSVG(d, n), steps: ['Percent means out of 100, so make the bottom 100.', `${d} × ${100 / d} = 100, so do the same to the top: ${n} × ${100 / d} = ${p}.`, `${frac(p, 100)} is ${p}%.`], explainText: `${frac(n, d)} = ${p}%.` }); }
  const pc = L === 1 ? pick([50, 25, 10]) : L === 2 ? rnd(1, 9) * 10 : L === 4 ? pick([5, 15, 20, 35, 75, 12]) : pick([10, 20, 25, 50]), base = L === 4 ? rnd(2, 20) * 20 : L === 1 ? rnd(1, 10) * 20 : rnd(2, 20) * 10, v = pc * base / 100;
  const t = base / 10, pcSteps = pc === 50 ? [`50% is half.`, `${base} ÷ 2 = ${v}.`] : pc === 25 ? [`25% is a quarter.`, `${base} ÷ 4 = ${v}.`] : pc === 10 ? [`10% means divide by 10.`, `${base} ÷ 10 = ${v}.`]
    : pc === 5 ? [`10% of ${base} is ${fmt(t)}.`, `5% is half of that: ${fmt(v)}.`]
    : pc === 15 ? [`10% of ${base} is ${fmt(t)}. 5% is half of that: ${fmt(t / 2)}.`, `15% is 10% + 5%: ${fmt(t)} + ${fmt(t / 2)} = ${fmt(v)}.`]
    : pc === 35 ? [`10% of ${base} is ${fmt(t)}, so 30% is ${fmt(3 * t)}.`, `5% is half of 10%: ${fmt(t / 2)}.`, `35% is 30% + 5%: ${fmt(3 * t)} + ${fmt(t / 2)} = ${fmt(v)}.`]
    : pc === 75 ? [`50% of ${base} is ${fmt(base / 2)}. 25% is ${fmt(base / 4)}.`, `75% is 50% + 25%: ${fmt(base / 2)} + ${fmt(base / 4)} = ${fmt(v)}.`]
    : pc === 12 ? [`10% of ${base} is ${fmt(t)}. 1% is ${fmt(base / 100)}, so 2% is ${fmt(base / 50)}.`, `12% is 10% + 2%: ${fmt(t)} + ${fmt(base / 50)} = ${fmt(v)}.`]
    : [`10% of ${base} is ${base} ÷ 10 = ${fmt(t)}.`, `${pc}% is ${pc / 10} lots of 10%: ${pc / 10} × ${fmt(t)} = ${fmt(v)}.`];
  if (L === 5) { const up = Math.random() < 0.5, nv = up ? base + v : base - v; return Q({ prompt: word(`A toy costs $${base}. The price goes ${up ? 'up' : 'down'} ${pc}%. What is the new price?`), choices: opts(nv, [v, base, up ? base - v : base + v, nv + 10]), answer: nv,
    steps: [...pcSteps, `The price goes ${up ? 'up, so add' : 'down, so take away'}: ${base} ${up ? '+' : '−'} ${v} = ${nv}.`], explainText: `The new price is $${nv}.` }); }
  return Q({ prompt: `${pc}% of ${base} = ?`, choices: opts(v, [base / 10, base / 2, v + 5, v * 2, pc]), answer: v, explain: [10, 20, 30, 40, 50, 60, 70, 80, 90].includes(pc) ? barSVG(10, pc / 10) : '', steps: pcSteps, explainText: `${pc}% of ${base} is ${fmt(v)}.` });
});
S('negatives', 3, 'Negative numbers', '🌡️', [
  ['Numbers below zero are negative, like a very cold day. Further left on the number line means lower.', () => hopLine([-3, -2, -1, 0, 1, 2, 3], [])],
  ['Adding moves right on the number line. Taking away moves left. −2 + 5: start at −2, move right 5. You land on 3.', () => hopLine([-2, 3, 0], ['+5'])],
  ['Taking away a negative is the same as adding: 4 − (−2) = 4 + 2 = 6.', () => bigEq('4 − (−2) = 6')],
  ['Times and divide: same signs give a positive answer. Different signs give a negative answer. −3 × 4 = −12.', () => bigEq('−3 × 4 = −12')]
], L => {
  if (L === 1) { const a = rnd(-10, 10), b = rnd(-10, 10); if (a === b) return MATH.negatives.gen(L); const c = Math.min(a, b); return Q({ prompt: `Which is colder: ${a}° or ${b}°?`, choices: opts(`${c}°`, [`${a}°`, `${b}°`], 2, v => v), answer: `${c}°`,
    explain: hopLine([a, b, 0], []), steps: ['Put both on the number line.', `${c} is further left, so it is lower.`], explainText: `${c}° is colder.` }); }
  let a, b, op, r;
  if (L === 2) { a = rnd(-9, -1); b = rnd(1, 15); op = '+'; }
  else if (L === 3) { a = rnd(-12, 12); b = rnd(-12, 12); op = pick(['+', '−']); }
  else if (L === 4) { a = rnd(-9, 9) || 2; b = rnd(-9, 9) || -3; op = pick(['×', '÷']); if (op === '÷') { const q = a; a = q * b; b = b; } }
  else { a = rnd(-20, 20); b = rnd(1, 20) * pick([1, -1]); op = pick(['+', '−', '×']); }
  r = op === '+' ? a + b : op === '−' ? a - b : op === '×' ? a * b : a / b;
  const sb = b < 0 ? `(${b})` : b, md = op === '×' || op === '÷', right = op === '+' ? b >= 0 : b < 0;
  const steps = md ? (r === 0 ? ['Anything times 0 is 0.'] : [`Ignore the signs first: ${Math.abs(a)} ${op} ${Math.abs(b)} = ${Math.abs(r)}.`, (a < 0) === (b < 0) ? 'The signs are the same, so the answer is positive.' : 'The signs are different, so the answer is negative.'])
    : b === 0 ? [`Adding or taking away 0 changes nothing.`] : [...(op === '−' && b < 0 ? [`Taking away a negative is the same as adding: ${a} + ${-b}.`] : op === '+' && b < 0 ? [`Adding a negative is the same as taking away: ${a} − ${-b}.`] : []), `Start at ${a} on the number line.`, `Move ${right ? 'right' : 'left'} ${Math.abs(b)}. You land on ${r}.`];
  return Q({ prompt: `${a} ${op} ${sb} = ?`, choices: opts(r, [-r, r + 1, r - 1, r + 2, r - 10].filter(v => v !== r)), answer: r,
    explain: md || b === 0 ? '' : hopLine([a, r, 0], [`${right ? '+' : '−'}${Math.abs(b)}`]), steps, explainText: `${a} ${op} ${sb} = ${r}.` });
});
S('area', 3, 'Area and perimeter', '📐', [
  ['Perimeter is the distance all the way around the edge. Add every side.', () => rectSVG(5, 3, false)],
  ['Area is the space inside. Count the squares: 3 rows of 5.', () => rectSVG(5, 3, true)],
  ['Quicker: multiply. Length × width: 5 × 3 = 15 squares.', () => bigEq('5 × 3 = 15')],
  ['A triangle is half of a rectangle. Its area is base × height ÷ 2.', () => triSVG(8, 5, 0.6, 'base 8', 'height 5', { rect: true })]
], L => {
  const w = rnd(2, L <= 2 ? 6 : 12), h = rnd(2, L <= 2 ? 5 : 9);
  if (L === 1 || L === 2) { const a = w * h; return Q({ prompt: L === 1 ? 'Count the squares. What is the area?' : 'What is the area?', visual: rectSVG(w, h, L === 1), choices: opts(a, [2 * (w + h), a + w, a - h, w + h]), answer: a, explain: rectSVG(w, h, true), steps: [`One row has ${w} squares.`, `There are ${h} rows.`, `${h} rows of ${w}: ${w} × ${h} = ${a}.`], explainText: `The area is ${a} squares.` }); }
  if (L === 3) { const p = 2 * (w + h); return Q({ prompt: 'What is the perimeter?', visual: rectSVG(w, h, false), choices: opts(p, [w * h, w + h, p + 2, p - 2]), answer: p, explain: rectSVG(w, h, false), steps: ['A rectangle has 4 sides. Opposite sides are the same.', `Add all 4: ${w} + ${h} + ${w} + ${h} = ${p}.`], explainText: `The perimeter is ${p}. (Do not multiply: that gives the area!)` }); }
  if (L === 4) { const W = rnd(6, 10), H = rnd(5, 8), cw = rnd(2, W - 3), ch = rnd(2, H - 3), a = W * H - cw * ch; return Q({ prompt: word(`A ${W} × ${H} rectangle has a ${cw} × ${ch} corner cut out. What area is left?`), visual: rectSVG(W, H, true), choices: opts(a, [W * H, cw * ch, a + cw, a - ch]), answer: a, steps: [`Whole rectangle: ${W} × ${H} = ${W * H}.`, `Cut-out corner: ${cw} × ${ch} = ${cw * ch}.`, `Take it away: ${W * H} − ${cw * ch} = ${a}.`], explainText: `The area left is ${a}.` }); }
  const b = rnd(2, 10) * 2, ht = rnd(2, 12), a = b * ht / 2;
  return Q({ prompt: `A triangle has base ${b} and height ${ht}. What is its area?`, choices: opts(a, [b * ht, b + ht, a + b, a / 2]), answer: a, explain: triSVG(b, ht, 0.6, `base ${b}`, `height ${ht}`, { rect: true }),
    steps: ['A triangle is half of a rectangle.', `Rectangle: ${b} × ${ht} = ${b * ht}.`, `Half of ${b * ht} is ${a}.`], explainText: `The area is ${a}.` });
});
S('angles', 3, 'Angles', '📏', [
  ['An angle is how far something turns. A square corner is a right angle: 90°.', () => angleSVG(90)],
  ['Smaller than 90° is acute. Between 90° and 180° is obtuse.', () => `<div class="row">${angleSVG(40)}${angleSVG(130)}</div>`],
  ['A straight line is 180°. A whole turn, all the way round, is 360°. So angles on a line add to 180°.', () => angleSVG(180)],
  ['The 3 angles inside any triangle add up to 180°. If two are 60° and 70°, the third is 180 − 60 − 70 = 50°.', () => shapeSVG('triangle', '#FFC23D', true)]
], L => {
  if (L === 1) { const d = pick([30, 45, 60, 90, 110, 135, 150, 180]), t = d < 90 ? 'acute' : d === 90 ? 'right' : d < 180 ? 'obtuse' : 'straight'; return Q({ prompt: 'What kind of angle is this?', visual: angleSVG(d), choices: opts(t, ['acute', 'right', 'obtuse', 'straight'], 4, v => v), answer: t,
    explain: `<div class="row">${angleSVG(90)}${angleSVG(d)}</div>`, steps: ['Compare it with a square corner, 90°.', d < 90 ? 'It is smaller, so it is acute.' : d === 90 ? 'It is exactly a square corner.' : d < 180 ? 'It is bigger, but not a straight line, so it is obtuse.' : 'It is a flat straight line, 180°.'], explainText: `This angle is ${d}°. ${t === 'acute' ? 'Less than 90° is acute.' : t === 'right' ? '90° is a right angle.' : t === 'obtuse' ? 'Between 90° and 180° is obtuse.' : '180° is a straight line.'}` }); }
  if (L === 2) { const a = rnd(20, 160); return Q({ prompt: `Angles on a straight line: ${a}° and ?`, visual: angleSVG(180 - a, '?'), choices: opts(180 - a, [360 - a, 90 - a, a, 180 - a + 10].filter(v => v > 0)), answer: 180 - a, explain: angleSVG(180 - a, `${180 - a}°`), steps: ['Angles on a straight line add to 180°.', `180 − ${a} = ${180 - a}.`], explainText: `The missing angle is ${180 - a}°.` }); }
  if (L === 3) { const a = rnd(20, 100), b = rnd(20, 150 - a), c = 180 - a - b; return Q({ prompt: `A triangle has angles ${a}° and ${b}°. What is the third?`, choices: opts(c, [360 - a - b, c + 10, c - 10, 90]), answer: c, steps: ['The angles in a triangle add to 180°.', `Add the two you know: ${a} + ${b} = ${a + b}.`, `180 − ${a + b} = ${c}.`], explainText: `The third angle is ${c}°.` }); }
  if (L === 4) { const a = rnd(50, 150), b = rnd(50, 150), c = 360 - a - b; return Q({ prompt: `Angles around a point: ${a}°, ${b}° and ?`, choices: opts(c, [180 - a, c + 10, c - 20, 180]), answer: c, steps: ['Angles all the way round a point add to 360°.', `Add the two you know: ${a} + ${b} = ${a + b}.`, `360 − ${a + b} = ${c}.`], explainText: `The missing angle is ${c}°.` }); }
  const n = rnd(4, 10), s = (n - 2) * 180, names = { 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon' };
  return Q({ prompt: `What do the inside angles of a ${names[n]} add up to?`, choices: opts(s, [n * 180, s + 180, s - 180, 360]), answer: s, explain: n <= 6 ? shapeSVG(['', '', '', 'triangle', 'square', 'pentagon', 'hexagon'][n], '#B9A6F2', true) : '', steps: [`A ${names[n]} has ${n} sides.`, `From one corner, it splits into ${n} − 2 = ${n - 2} triangles.`, `Each triangle has 180°: ${n - 2} × 180 = ${s}°.`], explainText: `The inside angles add up to ${s}°.` });
});
S('order', 3, 'Order of operations', '🪜', [
  ['Do things in this order: Brackets, then × and ÷, then + and −.', () => '<span class="bignum">( ) → × ÷ → + −</span>'],
  ['2 + 3 × 4: times first! 3 × 4 = 12, then 2 + 12 = 14. Not 20!', () => bigEq('2 + 3 × 4 = 14')],
  ['Brackets change the order. (2 + 3) × 4: brackets first, 2 + 3 = 5. Then 5 × 4 = 20.', () => bigEq('(2 + 3) × 4 = 20')],
  ['When the signs are on the same step, like + and −, go from left to right, like reading.', () => bigEq('9 − 4 + 2 = 7')]
], L => {
  const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 9);
  let e, r, how;
  if (L === 1) { e = `${a} + ${b} × ${c}`; r = a + b * c; how = [`Times first: ${b} × ${c} = ${b * c}.`, `Then ${a} + ${b * c} = ${r}.`]; }
  else if (L === 2) { e = `(${a} + ${b}) × ${c}`; r = (a + b) * c; how = [`Brackets first: ${a} + ${b} = ${a + b}.`, `Then ${a + b} × ${c} = ${r}.`]; }
  else if (L === 3) { const d = rnd(1, 9); e = `${a} × ${b} − ${c} + ${d}`; r = a * b - c + d; how = [`Times first: ${a} × ${b} = ${a * b}.`, `Then left to right: ${a * b} − ${c} = ${a * b - c}, + ${d} = ${r}.`]; }
  else if (L === 4) { const q = a * c; e = `${q} ÷ ${c} + ${b} × 2`; r = a + b * 2; how = [`${q} ÷ ${c} = ${a}.`, `${b} × 2 = ${b * 2}.`, `${a} + ${b * 2} = ${r}.`]; }
  else { e = `${a}² + ${b} × (${c} − 1)`; r = a * a + b * (c - 1); how = [`Brackets: ${c} − 1 = ${c - 1}.`, `Powers: ${a}² = ${a * a}.`, `Times: ${b} × ${c - 1} = ${b * (c - 1)}.`, `Add: ${a * a} + ${b * (c - 1)} = ${r}.`]; }
  const wrong = L === 1 ? (a + b) * c : L === 2 ? a + b * c : r + c;
  return Q({ prompt: `${e} = ?`, choices: opts(r, [wrong, r + 1, r - 2, r + 10]), answer: r, steps: how, explainText: `The answer is ${r}.` });
});

/* ===== World 5: Mountain Peak ===== */
S('algebra', 4, 'Algebra: find x', '🔣', [
  ['A letter like x stands for a mystery number.', () => '<span class="bignum">x + 3 = 10</span>'],
  ['Think of a balance scale. Do the same thing to both sides and it stays level. Take 3 from both sides: x = 7.', () => bigEq('x + 3 − 3 = 10 − 3')],
  ['For 2x + 1 = 9: take 1 from both sides, so 2x = 8. Then divide both sides by 2, so x = 4.', () => bigEq('2x = 8 → x = 4')],
  ['Always check: put your answer back in. 2 × 4 + 1 = 9. Yes!', () => bigEq('2 × 4 + 1 = 9 ✓')]
], L => {
  const x = rnd(-3, 12) || 5, a = rnd(2, 9), b = rnd(1, 15), c = rnd(1, 5);
  let e, how;
  if (L === 1) { e = `x + ${b} = ${x + b}`; how = [`Take ${b} from both sides.`, `x = ${x + b} − ${b} = ${x}.`]; }
  else if (L === 2) { e = `${a}x = ${a * x}`; how = [`Divide both sides by ${a}.`, `x = ${a * x} ÷ ${a} = ${x}.`]; }
  else if (L === 3) { e = `${a}x + ${b} = ${a * x + b}`; how = [`Take ${b} from both sides: ${a}x = ${a * x}.`, `Divide by ${a}: x = ${x}.`]; }
  else if (L === 4) { const d = a + c, k = rnd(1, 20); e = `${d}x + ${b} = ${c}x + ${a * x + b}`; how = [`Take ${c}x from both sides: ${a}x + ${b} = ${a * x + b}.`, `Take ${b} from both sides: ${a}x = ${a * x}.`, `Divide by ${a}: x = ${x}.`]; void k; }
  else { e = `${a}(x + ${c}) = ${a * (x + c)}`; how = [`Divide both sides by ${a}: x + ${c} = ${x + c}.`, `Take ${c} from both sides: x = ${x}.`]; }
  return Q({ prompt: `${e}`, speak: `Solve for x: ${e.replace(/x/g, ' x ')}`, visual: '<p class="wordq">What is x?</p>', choices: opts(x, [x + 1, x - 1, -x, x + 2, x * 2].filter(v => v !== x)), answer: x, steps: how, explainText: `Check by putting x = ${x} back in. Both sides match!` });
});
S('powers', 4, 'Powers and roots', '🚀', [
  ['A power is repeated multiplying. 3² means 3 × 3 = 9 (3 squared).', () => '<span class="bignum">3² = 9</span>'],
  ['Squared numbers make squares! 3 rows of 3 dots is 9.', () => arraySVG(3, 3)],
  ['The square root undoes squaring: √9 = 3, because 3 × 3 = 9.', () => '<span class="bignum">√9 = 3</span>'],
  ['Cubed means three of them multiplied: 2³ = 2 × 2 × 2 = 8. Careful: it is not 2 × 3!', () => bigEq('2³ = 2 × 2 × 2 = 8')]
], L => {
  if (L === 1) { const n = rnd(2, 12); return Q({ prompt: `${n}² = ?`, speak: `What is ${n} squared?`, choices: opts(n * n, [n * 2, n * n + n, n * n - 1, (n + 1) ** 2]), answer: n * n, explain: n <= 10 ? arraySVG(n, n) : '',
    steps: [`${n}² means ${n} × ${n}, not ${n} × 2.`, `${n} × ${n} = ${n * n}.`], explainText: `${n} squared is ${n * n}.` }); }
  if (L === 2) { const n = rnd(2, 6); return Q({ prompt: `${n}³ = ?`, speak: `What is ${n} cubed?`, choices: opts(n ** 3, [n * 3, n * n, n ** 3 + n, (n + 1) ** 3]), answer: n ** 3,
    steps: [`${n}³ means ${n} × ${n} × ${n}.`, `${n} × ${n} = ${n * n}.`, `${n * n} × ${n} = ${n ** 3}.`], explainText: `${n} cubed is ${n ** 3}.` }); }
  if (L === 3) { const n = rnd(2, 15); return Q({ prompt: `√${n * n} = ?`, speak: `What is the square root of ${n * n}?`, choices: opts(n, [n * n / 2, n + 1, n - 1, n * 2]), answer: n, explain: n <= 10 ? arraySVG(n, n) : '',
    steps: [`Ask: what number times itself makes ${n * n}?`, `${n} × ${n} = ${n * n}.`], explainText: `So √${n * n} = ${n}.` }); }
  if (L === 4) { const b = pick([2, 3, 10]), e = rnd(2, b === 2 ? 10 : 5), run = Array.from({ length: e }, (_, i) => fmt(b ** (i + 1))); return Q({ prompt: `${b}<sup>${e}</sup> = ?`, speak: `What is ${b} to the power ${e}?`, choices: opts(b ** e, [b * e, b ** (e - 1), b ** e + b, b ** (e + 1)]), answer: b ** e,
    steps: [`Multiply ${e} ${b}s together: ${Array(e).fill(b).join(' × ')}.`, b === 10 ? `Powers of 10: write 1 with ${e} zeros.` : `Keep multiplying by ${b}: ${run.join(', ')}.`], explainText: `${b} to the power ${e} is ${fmt(b ** e)}.` }); }
  const m = rnd(2, 6), n = rnd(2, 6), op = pick(['×', '÷']), r = op === '×' ? m + n : m - n;
  return Q({ prompt: `a<sup>${m}</sup> ${op} a<sup>${n}</sup> = a<sup>?</sup>`, speak: `a to the ${m} ${op === '×' ? 'times' : 'divided by'} a to the ${n} is a to the what?`, choices: opts(r, [m * n, op === '×' ? m - n : m + n, r + 1]), answer: r,
    steps: op === '×' ? [`a to the ${m} is ${m} a's multiplied. a to the ${n} is ${n} more.`, `Altogether that is ${m} + ${n} = ${r} a's.`] : [`a to the ${m} is ${m} a's multiplied on top. Dividing by a to the ${n} cancels ${n} of them.`, r > 0 ? `${m} − ${n} = ${r} are left.` : r === 0 ? `${m} − ${n} = 0. They all cancel, and a to the 0 is 1.` : `${m} − ${n} = ${r}. A negative power means ${-r} a's are left on the bottom.`], explainText: `When you ${op === '×' ? 'multiply, add' : 'divide, subtract'} the powers: a to the ${r}.` });
});
S('primes', 4, 'Factors and primes', '🔑', [
  ['Factors are numbers that divide exactly. 12 dots make a 3 by 4 rectangle, so 3 and 4 are factors of 12.', () => arraySVG(3, 4)],
  ['Find them in pairs: 1 × 12, 2 × 6, 3 × 4. So the factors of 12 are 1, 2, 3, 4, 6 and 12.', () => bigEq('1 2 3 4 6 12')],
  ['7 dots can only make one long line, 1 × 7. A number with exactly two factors, 1 and itself, is prime.', () => arraySVG(1, 7)],
  ['Primes: 2, 3, 5, 7, 11, 13. Every number can be split into primes: 12 = 2 × 2 × 3.', () => '<span class="bignum">2 3 5 7 11</span>']
], L => {
  const isP = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  if (L === 1) { const n = rnd(2, 50), p = isP(n), f = []; for (let i = 2; i < n; i++) if (n % i === 0) { f.push(i); break; } const tried = [2, 3, 5, 7].filter(k => k * k <= n);
    return Q({ prompt: `Is ${n} a prime number?`, choices: opts(p ? 'yes' : 'no', ['yes', 'no'], 2, v => v), answer: p ? 'yes' : 'no',
      steps: p ? (tried.length ? [`Try dividing ${n} by small primes: ${tried.join(', ')}.`, 'None of them divide it exactly.'] : [`${n} can only be made as 1 × ${n}.`]) : [`Try ${f[0]}: ${n} ÷ ${f[0]} = ${n / f[0]} exactly.`, `So ${f[0]} × ${n / f[0]} = ${n}. That is a factor that is not 1 or ${n}.`],
      explainText: p ? `${n} can only be divided by 1 and ${n}, so it is prime.` : `So ${n} is not prime.` }); }
  if (L === 2) { const n = pick([12, 18, 20, 24, 30, 36, 40, 42, 48, 60]), fs = []; for (let i = 2; i < n; i++) if (n % i === 0) fs.push(i); const f = pick(fs), wrong = []; for (let i = 2; i < n; i++) if (n % i) wrong.push(i); return Q({ prompt: `Which is a factor of ${n}?`, choices: opts(f, wrong), answer: f, steps: [`Try dividing ${n} by each choice.`, `${n} ÷ ${f} = ${n / f}, with nothing left over.`, `The factor pairs of ${n} are ${fs.filter(x => x * x <= n).map(x => `${x} × ${n / x}`).join(', ')}.`], explainText: `${f} is a factor of ${n}.` }); }
  if (L === 3) { const g = rnd(2, 12), a = g * rnd(1, 6), b = g * rnd(1, 6); const G = gcd(a, b); if (a === b) return MATH.primes.gen(L); const fl = x => Array.from({ length: x }, (_, i) => i + 1).filter(i => x % i === 0).join(', ');
    return Q({ prompt: `Highest common factor of ${a} and ${b}?`, choices: opts(G, [G * 2, 1, Math.min(a, b), G / 2 | 0 || 3]), answer: G, steps: [`Factors of ${a}: ${fl(a)}.`, `Factors of ${b}: ${fl(b)}.`, `The biggest number in both lists is ${G}.`], explainText: `The highest common factor is ${G}.` }); }
  if (L === 4) { const a = rnd(2, 12), b = rnd(2, 12); if (a === b) return MATH.primes.gen(L); const M = lcm(a, b); const hi = Math.max(a, b), lo = Math.min(a, b);
    return Q({ prompt: `Lowest common multiple of ${a} and ${b}?`, choices: opts(M, [a * b === M ? M * 2 : a * b, a + b, M + a, Math.max(a, b)]), answer: M, steps: [`Count in ${hi}s: ${Array.from({ length: M / hi }, (_, i) => hi * (i + 1)).join(', ')}.`, `Stop at the first one that is also in the ${lo} times table: ${M} = ${lo} × ${M / lo}.`], explainText: `The lowest common multiple is ${M}.` }); }
  const ps = [2, 2, 3, 3, 5, 7], f = shuffle(ps).slice(0, rnd(3, 4)).sort((x, y) => x - y), n = f.reduce((x, y) => x * y, 1), s = f.join(' × ');
  let left = n; const div = f.map(p => { const st = `${left} ÷ ${p} = ${left / p}.`; left /= p; return st; });
  return Q({ prompt: `Prime factors of ${n}?`, choices: opts(s, [[...f.slice(0, -1), f.at(-1) + 1].join(' × '), [2, ...f.slice(1)].join(' × '), `${f[0] * f[1]} × ${f.slice(2).join(' × ')}`].filter(x => x !== s), 4, v => v), answer: s,
    steps: ['Keep dividing by the smallest prime that works.', ...div], explainText: `Stop at 1. The primes you used: ${n} = ${s}.` });
});
S('ratio', 4, 'Ratio and proportion', '⚖️', [
  ['A ratio compares amounts. 2 red for every 3 blue is 2 : 3.', () => `<div class="pat">${dot('#F2604F')}${dot('#F2604F')}${dot('#2E8BE6')}${dot('#2E8BE6')}${dot('#2E8BE6')}</div>`],
  ['Simplify like fractions: divide both sides by the same number. 4 : 6 = 2 : 3.', () => bigEq('4 : 6 = 2 : 3')],
  ['Sharing in a ratio: 2 : 3 means 5 parts in all. Share 20: one part is 20 ÷ 5 = 4. So 8 and 12.', () => barModel([{ w: 1, t: 4, c: '#FFD98A' }, { w: 1, t: 4, c: '#FFD98A' }, { w: 1, t: 4, c: '#9CC9F2' }, { w: 1, t: 4, c: '#9CC9F2' }, { w: 1, t: 4, c: '#9CC9F2' }], 20)],
  ['Recipes scale: twice the people need twice as much of everything.', () => bigEq('2 eggs → 4 eggs')]
], L => {
  if (L === 1) { const a = rnd(1, 5), b = rnd(1, 5), k = rnd(2, 6), g = gcd(a, b), s = `${a / g} : ${b / g}`; return Q({ prompt: `Simplify ${a * k} : ${b * k}`, choices: opts(s, [`${b / g} : ${a / g}`, `${a} : ${b * k}`, `${a * k / 2 | 0} : ${b * k}`, `${a / g + 1} : ${b / g}`].filter(v => v !== s), 4, v => v), answer: s, steps: [`Find the biggest number that divides ${a * k} and ${b * k}: ${gcd(a * k, b * k)}.`, `${a * k} ÷ ${gcd(a * k, b * k)} = ${a / g} and ${b * k} ÷ ${gcd(a * k, b * k)} = ${b / g}.`], explainText: `So it simplifies to ${s}.` }); }
  if (L === 2) { const a = rnd(1, 4), b = rnd(1, 4), k = rnd(2, 10), tot = (a + b) * k; return Q({ prompt: word(`Share ${tot} sweets in the ratio ${a} : ${b}. How many does the first person get?`), choices: opts(a * k, [b * k, tot / 2, a * k + k, tot - k]), answer: a * k, explain: barModel([...Array.from({ length: a }, () => ({ w: 1, t: k, c: '#FFD98A' })), ...Array.from({ length: b }, () => ({ w: 1, t: k, c: '#9CC9F2' }))], tot), steps: [`Add the parts: ${a} + ${b} = ${a + b}.`, `One part: ${tot} ÷ ${a + b} = ${k}.`, `The first person gets ${a} part${a > 1 ? 's' : ''}: ${a} × ${k} = ${a * k}.`], explainText: `The first person gets ${a * k}.` }); }
  if (L === 3) { const eggs = rnd(2, 4), ppl = rnd(2, 4), m = rnd(2, 4); return Q({ prompt: word(`A recipe for ${ppl} people uses ${eggs} eggs. How many eggs for ${ppl * m} people?`), choices: opts(eggs * m, [eggs + m, eggs * m + 1, ppl * m, eggs * ppl]), answer: eggs * m, steps: [`How many times more people? ${ppl * m} ÷ ${ppl} = ${m}.`, `So use ${m} times the eggs: ${eggs} × ${m} = ${eggs * m}.`], explainText: `You need ${eggs * m} eggs.` }); }
  if (L === 4) { const n = rnd(2, 6), p = rnd(2, 9), m = rnd(2, 8); return Q({ prompt: word(`${n} pens cost $${n * p}. How much do ${m} pens cost?`), choices: opts(m * p, [n * p, m * n, m * p + p, p]), answer: m * p, steps: [`Find one pen first: $${n * p} ÷ ${n} = $${p}.`, `Then ${m} pens: ${m} × $${p} = $${m * p}.`], explainText: `${m} pens cost $${m * p}.` }); }
  const a = rnd(1, 5), b = rnd(1, 5), s = `${a}/${a + b}`;
  return Q({ prompt: `Red : blue = ${a} : ${b}. What fraction is red?`, choices: opts(s, [`${a}/${b}`, `${b}/${a + b}`, `${a + b}/${a}`], 4, v => frac(...v.split('/')), v => fracSay(...v.split('/'))), answer: s, explain: `<div class="pat">${Array(a).fill(dot('#F2604F')).join('')}${Array(b).fill(dot('#2E8BE6')).join('')}</div>`, steps: [`Count all the parts: ${a} + ${b} = ${a + b}. That is the bottom number.`, `${a} of them are red. That is the top number.`], explainText: `Red is ${frac(a, a + b)}.` });
});
S('sequences', 4, 'Sequences', '🔗', [
  ['A sequence follows a rule. 3, 7, 11, 15… adds 4 each time.', () => '<span class="bignum">3, 7, 11, 15</span>'],
  ['Find the rule by taking each number from the next: 7 − 3 = 4.', () => hopLine([3, 7, 11, 15], ['+4', '+4', '+4'])],
  ['Some sequences multiply instead: 2, 4, 8, 16 doubles each time.', () => '<span class="bignum">2, 4, 8, 16</span>'],
  ['The nth term is a formula for any place. 4n − 1: for term 10, 4 × 10 − 1 = 39.', () => '<table class="m3tab"><tr><th>n</th><td>1</td><td>2</td><td>3</td><td>10</td></tr><tr><th>4n − 1</th><td>3</td><td>7</td><td>11</td><td>39</td></tr></table>']
], L => {
  const a = rnd(1, 10), d = rnd(2, 9);
  if (L === 1 || L === 2) { const dd = L === 2 ? -d : d, s0 = L === 2 ? a + 40 : a, seq = [0, 1, 2, 3].map(i => s0 + dd * i), nx = s0 + dd * 4; return Q({ prompt: `${seq.join(', ')}, ?`, choices: opts(nx, [nx + 1, nx - dd * 2, nx + dd, nx - 1]), answer: nx, explain: hopLine([seq[2], seq[3], nx], [`${dd > 0 ? '+' : '−'}${Math.abs(dd)}`, `${dd > 0 ? '+' : '−'}${Math.abs(dd)}`]), steps: [dd > 0 ? `Find the difference: ${seq[1]} − ${seq[0]} = ${dd}.` : `Find the difference: ${seq[0]} − ${seq[1]} = ${-dd}. It goes down.`, `Each term ${dd > 0 ? 'adds' : 'takes away'} ${Math.abs(dd)}.`, `${seq[3]} ${dd > 0 ? '+' : '−'} ${Math.abs(dd)} = ${nx}.`], explainText: `The next term is ${nx}.` }); }
  if (L === 3) { const r = pick([2, 3]), s0 = rnd(1, 5), seq = [0, 1, 2, 3].map(i => s0 * r ** i), nx = s0 * r ** 4; return Q({ prompt: `${seq.join(', ')}, ?`, choices: opts(nx, [seq[3] + (seq[3] - seq[2]), nx + r, nx * r, nx - 1]), answer: nx, steps: [`The gaps keep growing, so try dividing: ${seq[1]} ÷ ${seq[0]} = ${r}.`, `Each term is multiplied by ${r}.`, `${seq[3]} × ${r} = ${nx}.`], explainText: `The next term is ${nx}.` }); }
  const b = rnd(1, 9) * pick([1, 1, -1]), n = rnd(10, 50), rule = `${d}n ${b < 0 ? '−' : '+'} ${Math.abs(b)}`;
  if (L === 4) return Q({ prompt: `nth term ${rule}. What is term ${n}?`, choices: opts(d * n + b, [d * n, d * (n + b), d * n + b + d, n + b]), answer: d * n + b, steps: [`Put n = ${n} into the rule.`, `${d} × ${n} = ${d * n}.`, `${d * n} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${d * n + b}.`], explainText: `Term ${n} is ${d * n + b}.` });
  const seq = [1, 2, 3, 4].map(i => d * i + b);
  return Q({ prompt: `Find the rule: ${seq.join(', ')}, …`, choices: opts(rule, [`${b}n ${d < 0 ? '−' : '+'} ${d}`, `${d}n`, `n + ${d}`, `${d + 1}n ${b - 1 < 0 ? '−' : '+'} ${Math.abs(b - 1)}`].filter(v => v !== rule), 4, v => v), answer: rule, steps: [`It goes up by ${d} each time, so the rule starts with ${d}n.`, `For the first term, ${d}n is ${d} × 1 = ${d}. But the first term is ${seq[0]}.`, `To get from ${d} to ${seq[0]}, ${b < 0 ? 'take away ' + -b : 'add ' + b}.`], explainText: `The rule is ${rule}.` });
});
S('probability', 4, 'Chance and probability', '🎲', [
  ['Probability is how likely something is, from 0 (impossible) to 1 (certain).', () => '<span class="bignum">0 … ½ … 1</span>'],
  [`A bag has 3 red and 1 blue. The chance of red is 3 out of 4: ${frac(3, 4)}.`, () => `<div class="pat">${dot('#F2604F')}${dot('#F2604F')}${dot('#F2604F')}${dot('#2E8BE6')}</div>`],
  [`Chance = the ways you want ÷ all the ways. A dice has 6 sides, and one of them is a 6, so the chance of a 6 is ${frac(1, 6)}.`, () => '<div class="m2track"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span class="hi">6</span></div>'],
  [`All the chances add up to 1. If the chance of rain is ${frac(1, 4)}, the chance of no rain is ${frac(3, 4)}.`, () => barSVG(4, 1, '#2E8BE6')]
], L => {
  const F = v => frac(...v.split('/')), sF = v => fracSay(...v.split('/'));
  const simp = (n, d) => { const g = gcd(n, d); return `${n / g}/${d / g}`; };
  if (L === 1) { const r = rnd(0, 10), w = ['impossible', 'unlikely', 'even chance', 'likely', 'certain'], ans = r === 0 ? w[0] : r < 5 ? w[1] : r === 5 ? w[2] : r < 10 ? w[3] : w[4]; return Q({ prompt: word(`A bag has ${r} red and ${10 - r} blue balls. Picking red is…`), choices: opts(ans, w, 4, v => v), answer: ans, explain: `<div class="pat">${Array(r).fill(dot('#F2604F')).join('')}${Array(10 - r).fill(dot('#2E8BE6')).join('')}</div>`, steps: [`${r} out of 10 balls are red.`, r === 0 ? 'No red at all: impossible.' : r === 10 ? 'All of them are red: certain.' : r === 5 ? 'Exactly half are red: even chance.' : r < 5 ? 'Less than half are red: unlikely.' : 'More than half are red: likely.'], explainText: `Picking red is ${ans}.` }); }
  if (L === 2) { const r = rnd(1, 6), b = rnd(1, 6), s = simp(r, r + b); return Q({ prompt: `${r} red, ${b} blue. Chance of red?`, visual: `<div class="pat">${Array(r).fill(dot('#F2604F')).join('')}${Array(b).fill(dot('#2E8BE6')).join('')}</div>`, choices: opts(s, [`${r}/${b}`, simp(b, r + b), `1/${r + b}`].filter(v => v !== s), 4, F, sF), answer: s, steps: [`Count the red: ${r}.`, `Count all the balls: ${r} + ${b} = ${r + b}.`, `Red out of all: ${frac(r, r + b)}${s !== `${r}/${r + b}` ? ` = ${F(s)}` : ''}.`], explainText: `The chance of red is ${F(s)}.` }); }
  if (L === 3) { const t = pick([['an even number', 3, '2, 4 and 6'], ['a 6', 1, 'just 6'], ['more than 4', 2, '5 and 6'], ['a number less than 3', 2, '1 and 2'], ['a prime number', 3, '2, 3 and 5']]), s = simp(t[1], 6); return Q({ prompt: `Roll a dice. Chance of ${t[0]}?`, choices: opts(s, ['1/6', '1/2', '1/3', '2/3', '5/6'], 4, F, sF), answer: s,
    steps: ['A dice has 6 sides: 1, 2, 3, 4, 5, 6.', `The ones that work: ${t[2]}. That is ${t[1]}.`, `${t[1]} out of 6: ${frac(t[1], 6)}${s !== `${t[1]}/6` ? ` = ${F(s)}` : ''}.`], explainText: `The chance is ${F(s)}.` }); }
  if (L === 4) { const p = pick([[1, 4], [2, 5], [3, 10], [1, 3], [5, 8]]), s = `${p[1] - p[0]}/${p[1]}`; return Q({ prompt: `The chance of rain is ${frac(p[0], p[1])}. Chance of no rain?`, choices: opts(s, [`${p[0]}/${p[1]}`, `1/${p[1]}`, `${p[1]}/${p[0]}`], 4, F, sF), answer: s, explain: barSVG(p[1], p[0], '#2E8BE6'), steps: ['Rain and no rain together make 1 whole.', `1 whole is ${frac(p[1], p[1])}.`, `${frac(p[1], p[1])} − ${frac(p[0], p[1])} = ${F(s)}.`], explainText: `The chance of no rain is ${F(s)}.` }); }
  const ev = pick([['two heads with two coins', '1/4', ['heads', 2], ['heads', 2]], ['heads and a 6', '1/12', ['heads', 2], ['a 6', 6]], ['two 6s with two dice', '1/36', ['a 6', 6], ['a 6', 6]], ['tails and an even number', '1/4', ['tails', 2], ['an even number', 2]]]);
  return Q({ prompt: `What is the chance of ${ev[0]}?`, choices: opts(ev[1], ['1/2', '1/4', '1/6', '1/12', '1/36', '1/8'], 4, F, sF), answer: ev[1],
    steps: [`The chance of ${ev[2][0]} is ${frac(1, ev[2][1])}.`, `The chance of ${ev[3][0]} is ${frac(1, ev[3][1])}.`, `Both together: multiply. ${frac(1, ev[2][1])} × ${frac(1, ev[3][1])} = ${F(ev[1])}.`], explainText: `For two separate events, multiply the chances.` });
});
S('geometry', 4, 'Shapes and space', '🧊', [
  ['Volume is how much space is inside a box. Count the cubes in one layer, then times by the number of layers.', () => isoSVG(cubesOf(4, 3, 2))],
  ['So volume = length × width × height. 4 × 3 × 2 = 24 cubes.', () => bigEq('4 × 3 × 2 = 24')],
  ['Circles: the radius goes from the middle to the edge. The distance round is 2 × π (pi) × r. The area is pi × r × r. Use pi = 3.14, roughly.', () => shapeSVG('circle', '#FFC23D')],
  ['In a right triangle, a² + b² = c² (Pythagoras). 3² + 4² = 9 + 16 = 25 = 5².', () => bigEq('3² + 4² = 5²')]
], L => {
  if (L === 1) { const l = rnd(2, 10), w = rnd(2, 8), h = rnd(2, 6), v = l * w * h; return Q({ prompt: `Volume of a ${l} × ${w} × ${h} box?`, choices: opts(v, [l + w + h, l * w, v + l, 2 * (l * w + w * h + l * h)]), answer: v,
    steps: [`One layer: ${l} × ${w} = ${l * w} cubes.`, `There are ${h} layers: ${l * w} × ${h} = ${v}.`], explainText: `The volume is ${v} cubes.` }); }
  if (L === 2) { const r = rnd(1, 10), c = +(2 * 3.14 * r).toFixed(2); return Q({ prompt: `Circumference of a circle with radius ${r}? (π ≈ 3.14)`, visual: shapeSVG('circle', '#2E8BE6'), choices: opts(c, [+(3.14 * r * r).toFixed(2), +(3.14 * r).toFixed(2), +(c + 3.14).toFixed(2)]), answer: c,
    steps: ['Circumference = 2 × pi × r.', `2 × ${r} = ${2 * r}.`, `${2 * r} × 3.14 = ${c}.`], explainText: `The circumference is ${c}.` }); }
  if (L === 3) { const r = rnd(1, 10), a = +(3.14 * r * r).toFixed(2); return Q({ prompt: `Area of a circle with radius ${r}? (π ≈ 3.14)`, visual: shapeSVG('circle', '#FFC23D'), choices: opts(a, [+(2 * 3.14 * r).toFixed(2), r * r, +(3.14 * r).toFixed(2)]), answer: a,
    steps: ['Area = pi × r × r.', `${r} × ${r} = ${r * r}.`, `${r * r} × 3.14 = ${a}.`], explainText: `The area is ${a}.` }); }
  const [x, y, z] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25]]);
  if (L === 4) return Q({ prompt: `Right triangle with sides ${x} and ${y}. Longest side?`, choices: opts(z, [x + y, z + 1, z - 1, y + 1]), answer: z, steps: [`${x}² + ${y}² = ${x * x} + ${y * y} = ${z * z}.`, `√${z * z} = ${z}.`], explainText: `The longest side is ${z}.` });
  return Q({ prompt: `Right triangle: longest side ${z}, one side ${x}. Other side?`, choices: opts(y, [z - x, y + 1, y - 1, z + x]), answer: y, steps: [`${z}² − ${x}² = ${z * z} − ${x * x} = ${y * y}.`, `√${y * y} = ${y}.`], explainText: `The other side is ${y}.` });
});
S('coords', 4, 'Coordinates and graphs', '📍', [
  ['A point is written (across, up). Go along the corridor, then up the stairs!', () => gridSVG(3, 4, false)],
  ['Negative numbers go left or down from the middle (0, 0).', () => gridSVG(-2, 3, true)],
  ['Across always comes first! (3, 4) and (4, 3) are different places.', () => gridSVG([[3, 4], [4, 3]], 0, false)],
  ['The midpoint is halfway. Add the two x numbers and halve, then the same for y. (0, 0) and (4, 2): halfway is (2, 1).', () => gridSVG([[0, 0], [4, 2]], 0, true, `<circle cx="${50 + 2 * 9}" cy="${50 - 9}" r="2.6" fill="#2FA36B"/>`)]
], L => {
  if (L <= 3) { const q4 = L === 3, x = q4 ? rnd(-5, 5) : rnd(0, L === 1 ? 5 : 10), y = q4 ? rnd(-5, 5) : rnd(0, L === 1 ? 5 : 10), s = `(${x}, ${y})`;
    const X = v => q4 ? 50 + v * 9 : 5 + v * 9, Y = v => q4 ? 50 - v * 9 : 95 - v * 9, path = `<path d="M${X(0)} ${Y(0)} H${X(x)} V${Y(y)}" fill="none" stroke="#2FA36B" stroke-width="1.8" stroke-dasharray="3 2"/>`;
    return Q({ prompt: 'Where is the red dot?', visual: gridSVG(x, y, q4), choices: opts(s, [`(${y}, ${x})`, `(${x + 1}, ${y})`, `(${x}, ${y - 1})`, `(${-x}, ${y})`].filter(v => v !== s), 4, v => v), answer: s, explain: gridSVG(x, y, q4, path),
      steps: ['Start at the middle, (0, 0).', x ? `Go across, ${x > 0 ? 'right' : 'left'}, to ${x}. That is the first number.` : 'It does not go across at all, so the first number is 0.', y ? `Then go ${y > 0 ? 'up' : 'down'} to ${y}. That is the second number.` : 'It does not go up or down, so the second number is 0.'], explainText: `The dot is at ${s}.` }); }
  if (L === 4) { const a = [rnd(-2, 2), rnd(-2, 2)], b = [a[0] + 2 * pick([-1, 1]), a[1] + 2 * rnd(-1, 1)], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, m = `(${mx}, ${my})`; return Q({ prompt: `Midpoint of (${a}) and (${b})?`.replace(/\((-?\d+),(-?\d+)\)/g, '($1, $2)'), visual: gridSVG([a, b], 0, true), choices: opts(m, [`(${a[0] + b[0]}, ${a[1] + b[1]})`, `(${(b[0] - a[0]) / 2}, ${(b[1] - a[1]) / 2})`, `(${(a[0] + b[0]) / 2 + 1}, ${(a[1] + b[1]) / 2})`].filter(v => v !== m), 4, v => v), answer: m,
    explain: gridSVG([a, b], 0, true, `<circle cx="${50 + mx * 9}" cy="${50 - my * 9}" r="2.6" fill="#2FA36B"/>`), steps: [`x: (${a[0]} + ${b[0]}) ÷ 2 = ${mx}.`, `y: (${a[1]} + ${b[1]}) ÷ 2 = ${my}.`], explainText: `The midpoint, the green dot, is ${m}.` }); }
  const [dx, dy, dd] = pick([[3, 4, 5], [4, 3, 5], [3, 4, 5], [4, 3, 5]]), a = [rnd(-4, 0), rnd(-4, 0)], b = [a[0] + Math.min(dx, 5), a[1] + Math.min(dy, 5)];
  if (dx > 5 || dy > 5) return MATH.coords.gen(L);
  return Q({ prompt: `Distance from (${a[0]}, ${a[1]}) to (${b[0]}, ${b[1]})?`, visual: gridSVG([a, b], 0, true), choices: opts(dd, [dx + dy, dd + 1, Math.abs(dx - dy) || 2]), answer: dd, steps: [`Across ${dx}, up ${dy}.`, `Pythagoras: ${dx}² + ${dy}² = ${dx * dx + dy * dy}.`, `√${dx * dx + dy * dy} = ${dd}.`], explainText: `The distance is ${dd}.` });
});

// A straight line y = mx + c drawn across the -5..5 grid.
function lineSVG(m, c, pts = []) {
  const X = v => 50 + v * 9, Y = v => 50 - v * 9;
  let x1 = -5, x2 = 5;
  if (m) { const a = (-5 - c) / m, b = (5 - c) / m; x1 = Math.max(-5, Math.min(a, b)); x2 = Math.min(5, Math.max(a, b)); }
  const seg = `<line x1="${X(x1)}" y1="${Y(m * x1 + c)}" x2="${X(x2)}" y2="${Y(m * x2 + c)}" stroke="#2E8BE6" stroke-width="2.2" stroke-linecap="round"/>`;
  return gridSVG(pts.length ? pts : [[0, c]], 0, true, seg);
}
const lineEq = (m, c) => `y = ${m === 1 ? '' : m === -1 ? '−' : String(m).replace('-', '−')}x${c ? (c > 0 ? ' + ' + c : ' − ' + -c) : ''}`;
S('lines', 4, 'Straight-line graphs', '📈', [
  ['y = 2x + 1 is a rule: take x, double it, add 1. Every point that follows the rule sits on one straight line.', () => lineSVG(2, 1)],
  ['The gradient is how steep the line is: go 1 across, count how far it goes up. The number on its own is where it crosses the y axis.', () => lineSVG(1, -2)],
  ['To find y, put the x number into the rule. y = 2x + 1 and x = 3: 2 × 3 + 1 = 7. So the point (3, 7) is on the line.', () => bigEq('2 × 3 + 1 = 7')]
], L => {
  const m = pick([1, 2, 3, -1, -2, 2, 1]), c = rnd(-3, 3);
  if (L <= 2) {
    const mm = L === 1 ? 1 : m, x = rnd(-3, 4), y = mm * x + c;
    return Q({ prompt: `${lineEq(mm, c)}. When x = ${x}, what is y?`, speak: `The rule is ${lineEq(mm, c)}. When x is ${x}, what is y?`, choices: opts(y, [y + 1, y - 1, mm * x - c, x + c + mm, -y].filter(v => v !== y)), answer: y,
      steps: [`Put ${x} in place of x.`, `${mm === 1 ? x : `${mm} × ${x} = ${mm * x}`}${c ? `, then ${c > 0 ? 'add ' + c : 'take away ' + -c}` : ''}.`], explainText: `y = ${y}.` });
  }
  if (L === 3) {
    const mg = pick([1, 2, 3, -1, -2, 1, 2]), cc = rnd(-2, 2);
    return Q({ prompt: 'What is the gradient (steepness) of the blue line?', visual: lineSVG(mg, cc, [[0, cc], [1, mg + cc]]), choices: opts(mg, [-mg, mg + 1, mg - 1, cc, 2 * mg].filter(v => v !== mg)), answer: mg,
      steps: ['Start at a dot on the line.', `Go 1 square across to the right. The line goes ${mg > 0 ? 'up' : 'down'} ${Math.abs(mg)}.`], explainText: `The gradient is ${mg}${mg < 0 ? ' (negative, because it goes downhill)' : ''}.` });
  }
  if (L === 4) {
    const s = lineEq(m, c);
    return Q({ prompt: 'Which equation matches the blue line?', visual: lineSVG(m, c, [[0, c], [1, m + c]]), choices: opts(s, [lineEq(m, -c), lineEq(-m, c), lineEq(m, c + 1), lineEq(m + 1, c), lineEq(c || 2, m)].filter(v => v !== s), 4, v => v), answer: s,
      steps: [`It crosses the y axis at ${c}, so the number on its own is ${c}.`, `1 across, ${m > 0 ? 'up' : 'down'} ${Math.abs(m)}: the gradient is ${m}.`], explainText: `The line is ${s}.` });
  }
  const y = rnd(-6, 12), x = (y - c) / m;
  if (!Number.isInteger(x)) return MATH.lines.gen(5);
  return Q({ prompt: `${lineEq(m, c)}. For which x is y = ${y}?`, choices: opts(x, [x + 1, x - 1, -x, y - c, y + c].filter(v => v !== x)), answer: x,
    steps: [`${y} = ${m === 1 ? '' : m}x${c ? (c > 0 ? ' + ' + c : ' − ' + -c) : ''}`, `${c > 0 ? 'Take away ' + c : c < 0 ? 'Add ' + -c : 'Nothing to move'}: ${m === 1 ? '' : m}x = ${y - c}.`, ...(m !== 1 ? [`Divide by ${m}: x = ${x}.`] : [])], explainText: `x = ${x}. Check: ${m} × ${x}${c ? (c > 0 ? ' + ' + c : ' − ' + -c) : ''} = ${y}.` });
});
S('simul', 4, 'Two equations together', '🧩', [
  ['Two mystery numbers need two clues. x + y = 10 and x − y = 2.', () => '<span class="bignum">x + y = 10<br>x − y = 2</span>'],
  ['Add the clues to make y vanish: 2x = 12, so x = 6.', () => bigEq('2x = 12 → x = 6')],
  ['Put x back into a clue: 6 + y = 10, so y = 4.', () => bigEq('6 + y = 10 → y = 4')],
  ['Always check both clues: 6 + 4 = 10 and 6 − 4 = 2. Both work!', () => bigEq('✓ ✓')]
], L => {
  const x = rnd(L >= 4 ? -4 : 1, 9), y = rnd(L >= 4 ? -4 : 1, 8), ask = L === 2 ? 'y' : 'x', ans = ask === 'x' ? x : y;
  const term = (k, v) => k === 1 ? v : k === -1 ? '−' + v : k + v, side = (a, b) => `${term(a, 'x')} ${b < 0 ? '−' : '+'} ${term(Math.abs(b), 'y')}`;
  if (L === 5) {
    const [f1, f2] = pick([['🍎', '🍐'], ['🍩', '🧃'], ['🎈', '⭐']]), a = rnd(2, 4), b = rnd(1, 3), px = rnd(1, 6), py = rnd(1, 6);
    if (a === b) return MATH.simul.gen(5);
    const s = `${f1} = ${px}, ${f2} = ${py}`;
    return Q({ prompt: word(`${a} ${f1} and 1 ${f2} cost ${a * px + py}. ${b} ${f1} and 1 ${f2} cost ${b * px + py}. How much is each?`), speak: `${a} of the first and 1 of the second cost ${a * px + py}. ${b} of the first and 1 of the second cost ${b * px + py}. How much is each?`,
      choices: opts(s, [`${f1} = ${py}, ${f2} = ${px}`, `${f1} = ${px + 1}, ${f2} = ${py - a}`, `${f1} = ${px - 1}, ${f2} = ${py + a}`, `${f1} = ${px + 1}, ${f2} = ${py + 1}`, `${f1} = ${px}, ${f2} = ${py + 1}`, `${f1} = ${px + 1}, ${f2} = ${py}`].filter(v => v !== s && !/-|= 0\b/.test(v)), 4, v => v.replace(', ', '<br>')), answer: s,
      steps: [`The difference is ${Math.abs(a - b)} ${f1}, and the cost difference is ${Math.abs(a - b) * px}.`, `So 1 ${f1} = ${Math.abs(a - b) * px} ÷ ${Math.abs(a - b)} = ${px}.`, `Then 1 ${f2} = ${b * px + py} − ${b * px} = ${py}.`], explainText: `${s}.` });
  }
  let e1, e2, how;
  if (L <= 2) { e1 = `x + y = ${x + y}`; e2 = `x − y = ${x - y}`; how = [`Add the equations: 2x = ${2 * x}, so x = ${x}.`, `Then y = ${x + y} − ${x} = ${y}.`]; }
  else if (L === 3) { e1 = `x + y = ${x + y}`; e2 = `2x + y = ${2 * x + y}`; how = [`Take the first from the second: x = ${2 * x + y} − ${x + y} = ${x}.`, `Then y = ${x + y} − ${x} = ${y}.`]; }
  else { const a = rnd(2, 3), b = pick([1, -1]), c = 1, d = pick([2, 3]); e1 = `${side(a, b)} = ${a * x + b * y}`; e2 = `${side(c, d)} = ${c * x + d * y}`;
    if (a * d - b * c === 0) return MATH.simul.gen(4);
    how = [`Make the y parts match: multiply the first by ${d} and the second by ${Math.abs(b)}.`, `${b > 0 ? 'Subtract' : 'Add'} to remove y: ${a * d - b * c}x = ${(a * d - b * c) * x}.`, `So x = ${x}, and putting it back in gives y = ${y}.`]; }
  return Q({ prompt: `${e1}<br>${e2}<br>What is ${ask}?`, speak: `${e1}. ${e2}. What is ${ask}?`.replace(/−/g, ' minus '), choices: opts(ans, [x, y, x + y, ans + 1, ans - 1, -ans].filter(v => v !== ans)), answer: ans, steps: how, explainText: `x = ${x} and y = ${y}. Check them in both equations!` });
});

/* --- world helpers used by the app --- */
const worldSkills = w => Object.values(MATH).filter(s => s.world === w);
const ageWorld = age => age <= 5 ? 0 : age <= 7 ? 1 : age <= 9 ? 2 : age <= 11 ? 3 : 4;
