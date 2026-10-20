/* ---------- math3: 22 more topics for Treetop Town, Deep Forest and Mountain Peak ---------- */
// Uses the helpers from math.js (S, Q, opts, near, word, frac, fmt, gcd, clockSVG, timeStr, gridSVG, barSVG ...).

const INK = '#22305A';
const svgBox = (vb, body, label, wide = false) => `<div class="shape${wide ? ' wide-shape' : ''}"><svg viewBox="${vb}" role="img" aria-label="${label}">${body}</svg></div>`;
const tx = (x, y, s, o = {}) => `<text x="${+(+x).toFixed(1)}" y="${+(+y).toFixed(1)}" font-size="${o.size || 12}" font-weight="800" text-anchor="${o.anchor || 'middle'}" fill="${o.fill || INK}">${s}</text>`;
const pts2 = p => p.map(q => q.map(v => +(+v).toFixed(1)).join(',')).join(' ');
const sOpts = (ans, cands, say = v => v, show = v => v, n = 4) => opts(ans, cands, n, show, say);
const NAMES3 = ['Mia', 'Leo', 'Ava', 'Sam', 'Zoe', 'Kai', 'Noah', 'Lily', 'Omar', 'Ruby'];
const longTxt = s => `<span class="m3long">${s}</span>`;
const cap = s => s[0].toUpperCase() + s.slice(1);

/* ---------- pictures ---------- */
// An "empty number line": hops drawn as arcs, positions roughly to scale but never squashed together.
function hopLine(vals, hops) {
  const u = [...new Set(vals)].sort((a, b) => a - b), span = (u.at(-1) - u[0]) || 1, pos = {};
  let x = 0; u.forEach((v, i) => { if (i) x += Math.max(46, (v - u[i - 1]) / span * 240); pos[v] = x; });
  const k = x ? 250 / x : 1; u.forEach(v => pos[v] = 25 + pos[v] * k);
  let g = `<line x1="6" y1="70" x2="294" y2="70" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`;
  u.forEach(v => g += `<line x1="${pos[v]}" y1="63" x2="${pos[v]}" y2="77" stroke="${INK}" stroke-width="2"/>${tx(pos[v], 95, fmt(v), { size: 14 })}`);
  hops.forEach((lab, i) => {
    const a = pos[vals[i]], b = pos[vals[i + 1]], m = (a + b) / 2, h = Math.min(46, 14 + Math.abs(b - a) / 4), col = b > a ? '#2E8BE6' : '#F2604F';
    g += `<path d="M${a} 66 Q${m} ${66 - 2 * h} ${b} 66" fill="none" stroke="${col}" stroke-width="2.5"/><path d="M${b - 5} 58 L${b} 66 L${b + 5} 58" fill="none" stroke="${col}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${tx(m, 66 - h - 5, lab, { size: 14, fill: col })}`;
  });
  return svgBox('0 0 300 102', g, 'number line with jumps', true);
}
function arraySVG(r, c, o = {}) {
  const s = 22, cols = o.cover ? 1 : c, extra = o.totals ? 34 : o.split ? 58 : o.cover ? 124 : 0, gap = o.split ? 10 : 0, W = cols * s + 8 + extra, H = r * s + 8 + gap;
  let g = '';
  for (let i = 0; i < r; i++) {
    const y = 4 + i * s + s / 2 + (o.split && i >= o.split ? gap : 0);
    for (let j = 0; j < cols; j++) g += `<circle cx="${4 + j * s + s / 2}" cy="${y}" r="8" fill="${o.split && i >= o.split ? '#F2604F' : '#2E8BE6'}"/>`;
    if (o.totals) g += tx(cols * s + 24, y + 4, (i + 1) * c, { size: 12, fill: '#5A678C' });
  }
  if (o.cover) g += `<rect x="${s + 10}" y="4" width="112" height="${r * s}" rx="14" fill="#FFD98A" stroke="${INK}" stroke-width="2"/>${tx(s + 66, 4 + r * s / 2 + 9, '?', { size: 26 })}`;
  if (o.split) { const y1 = 4 + o.split * s / 2, y2 = 4 + o.split * s + gap + (r - o.split) * s / 2; g += tx(c * s + 14, y1 + 4, `${o.split} × ${c}`, { size: 12, anchor: 'start' }) + tx(c * s + 14, y2 + 4, `${r - o.split} × ${c}`, { size: 12, anchor: 'start', fill: '#F2604F' }); }
  return svgBox(`0 0 ${W} ${H}`, g, o.cover ? `${r} rows, partly hidden` : `${r} rows of ${c} dots`, c >= 7 || !!o.split || !!o.cover);
}
function htoSVG(h, t, o) {
  let x = 2, g = '';
  for (let i = 0; i < h; i++) {
    g += `<rect x="${x}" y="2" width="50" height="50" fill="#FFC23D" stroke="${INK}" stroke-width="1.5"/>`;
    for (let k = 1; k < 10; k++) g += `<line x1="${x + k * 5}" y1="2" x2="${x + k * 5}" y2="52" stroke="${INK}" stroke-opacity=".3" stroke-width=".6"/><line x1="${x}" y1="${2 + k * 5}" x2="${x + 50}" y2="${2 + k * 5}" stroke="${INK}" stroke-opacity=".3" stroke-width=".6"/>`;
    x += 56;
  }
  for (let i = 0; i < t; i++) {
    g += `<rect x="${x}" y="2" width="6" height="50" fill="#2E8BE6" stroke="${INK}" stroke-width="1.2"/>`;
    for (let k = 1; k < 10; k++) g += `<line x1="${x}" y1="${2 + k * 5}" x2="${x + 6}" y2="${2 + k * 5}" stroke="${INK}" stroke-opacity=".35" stroke-width=".6"/>`;
    x += 9;
  }
  if (t) x += 4;
  for (let i = 0; i < o; i++) g += `<rect x="${x + Math.floor(i / 5) * 9}" y="${45 - (i % 5) * 9}" width="7" height="7" fill="#2FA36B" stroke="${INK}" stroke-width="1.2"/>`;
  if (o) x += Math.ceil(o / 5) * 9;
  return svgBox(`0 0 ${Math.max(x + 2, 40)} 54`, g, `place value blocks`, true);
}

/* ===================== Treetop Town (world index 2) ===================== */
S('mental', 2, 'Mental maths tricks', '🧠', [
  ['Adding 9 is easy: add 10, then take 1 away. 34 + 9 → 44 → 43.', () => hopLine([34, 44, 43], ['+10', '−1'])],
  ['Adding 19? Add 20, then take 1 away. 57 + 19 → 77 → 76.', () => hopLine([57, 77, 76], ['+20', '−1'])],
  ['Taking away 9? Take away 10, then give 1 back. 52 − 9 → 42 → 43.', () => hopLine([52, 42, 43], ['−10', '+1'])]
], L => {
  if (L <= 4) {
    const [k, n10] = L === 1 ? pick([[9, 10], [11, 10]]) : L === 2 ? pick([[-9, -10], [-11, -10], [9, 10], [-9, -10]]) : L === 3 ? pick([[19, 20], [29, 30], [21, 20], [-19, -20], [39, 40], [31, 30], [-29, -30]]) : pick([[99, 100], [101, 100], [98, 100], [-99, -100], [199, 200], [-98, -100]]);
    const a = L === 4 ? rnd(120, 850) : L === 3 ? rnd(35, 70) : rnd(14, 89), r = a + k, fix = k - n10, mid = a + n10, op = k > 0 ? '+' : '−', K = Math.abs(k), N = Math.abs(n10);
    return Q({ prompt: `${fmt(a)} ${op} ${K} = ?`, speak: `What is ${a} ${k > 0 ? 'plus' : 'take away'} ${K}?`, choices: opts(r, [r + 1, r - 1, mid, r + 10, r - 10, r + 2, r - 2].filter(v => v >= 0)), answer: r,
      explain: hopLine([a, mid, r], [(n10 > 0 ? '+' : '−') + N, (fix > 0 ? '+' : '−') + Math.abs(fix)]),
      steps: [`${K} is close to ${N}. First ${k > 0 ? 'add' : 'take away'} ${N}: ${fmt(a)} ${op} ${N} = ${fmt(mid)}.`, `Then fix it: ${fix > 0 ? `add ${fix} more` : `take ${-fix} away`}. ${fmt(mid)} ${fix > 0 ? '+' : '−'} ${Math.abs(fix)} = ${fmt(r)}.`],
      explainText: `${fmt(a)} ${op} ${K} = ${fmt(r)}.` });
  }
  const kind = pick(['x5', 'double', 'near', 'x25']);
  if (kind === 'x5') { const n = rnd(6, 49) * 2, r = n * 5; return Q({ prompt: `${n} × 5 = ?`, speak: `What is ${n} times 5?`, choices: opts(r, [r + 5, r - 5, n * 10, r + 10, r - 10, n + 5]), answer: r, steps: ['Times 5 is half of times 10.', `${n} × 10 = ${n * 10}.`, `Half of ${n * 10} is ${r}.`], explainText: `${n} × 5 = ${r}.` }); }
  if (kind === 'double') { const n = rnd(26, 99), t = n - n % 10, o = n % 10, r = 2 * n; return Q({ prompt: `Double ${n} = ?`, speak: `What is double ${n}?`, choices: opts(r, [r + 10, r - 10, 2 * t + o, r + 1, r - 2]), answer: r, steps: [`Double the tens: ${t} + ${t} = ${2 * t}.`, `Double the ones: ${o} + ${o} = ${2 * o}.`, `Put them together: ${2 * t} + ${2 * o} = ${r}.`], explainText: `Double ${n} is ${r}.` }); }
  if (kind === 'near') { const n = rnd(15, 75), r = 2 * n + 1; return Q({ prompt: `${n} + ${n + 1} = ?`, speak: `What is ${n} plus ${n + 1}?`, choices: opts(r, [r - 1, r + 1, r + 10, r - 10, r + 2]), answer: r, steps: [`Use a double: ${n} + ${n} = ${2 * n}.`, `${n + 1} is one more than ${n}, so add 1: ${r}.`], explainText: `${n} + ${n + 1} = ${r}.` }); }
  const n = rnd(2, 12) * 4, r = 25 * n;
  return Q({ prompt: `25 × ${n} = ?`, speak: `What is 25 times ${n}?`, choices: opts(r, [r + 25, r - 25, r + 100, r - 100, n * 20, r / 2]), answer: r, steps: ['Four 25s make 100.', `${n} ÷ 4 = ${n / 4}, so there are ${n / 4} hundreds.`, `${n / 4} × 100 = ${r}.`], explainText: `25 × ${n} = ${r}.` });
});

S('arrays', 2, 'Arrays and equal groups', '🔲', [
  ['An array is rows that all hold the same number. Here are 3 rows of 5.', () => arraySVG(3, 5)],
  ['Count by the rows: 5, 10, 15. So 3 × 5 = 15.', () => arraySVG(3, 5, { totals: true })],
  ['Turn it on its side: 5 rows of 3. Still 15! So 3 × 5 = 5 × 3.', () => arraySVG(5, 3)]
], L => {
  const r = L === 1 ? rnd(2, 3) : L === 2 ? rnd(2, 5) : rnd(3, 6), c = L === 1 ? rnd(2, 5) : L === 2 ? rnd(2, 6) : rnd(4, 9), p = r * c;
  const countBy = `Count by ${c}s: ${Array.from({ length: r }, (_, i) => (i + 1) * c).join(', ')}.`;
  if (L === 1 || L === 3) return Q({ prompt: L === 1 ? 'How many dots?' : 'How many dots? Use times!', speak: `How many dots are in the array? There are ${r} rows.`, visual: arraySVG(r, c), choices: opts(p, [p + 1, p - 1, r + c, p + c, p - c, p + r].filter(v => v > 0)), answer: p,
    explain: arraySVG(r, c, { totals: true }), explainText: `${r} rows of ${c}. ${countBy} ${r} × ${c} = ${p}.` });
  if (L === 2) { const s = `${r} × ${c}`; return Q({ prompt: 'Which number sentence matches?', speak: 'Which number sentence matches the array?', visual: arraySVG(r, c), choices: sOpts(s, [`${r} + ${c}`, `${r} × ${c + 1}`, `${r + 1} × ${c}`, `${r} × ${c - 1}`], v => v.replace('×', 'times').replace('+', 'plus')), answer: s, explainText: `There are ${r} rows with ${c} dots in each row, so it is ${r} × ${c} = ${p}.` }); }
  if (L === 4) return Q({ prompt: word(`There are ${p} dots in ${r} equal rows. A cloth hides some. How many dots are in each row?`), visual: arraySVG(r, c, { cover: true }), choices: opts(c, [c + 1, c - 1, r, p - r, c + 2].filter(v => v > 0 && v !== c)), answer: c,
    explain: arraySVG(r, c), explainText: `${r} × ? = ${p}. Since ${r} × ${c} = ${p}, each row has ${c} dots.` });
  const R = rnd(6, 9), C = rnd(3, 9), P = R * C;
  return Q({ prompt: `${R} × ${C} = ?`, speak: `What is ${R} times ${C}? Split the array into 5 rows and ${R - 5} more.`, visual: arraySVG(R, C, { split: 5 }), choices: opts(P, [P + C, P - C, 5 * C + R - 5, P + 1, P - 1]), answer: P,
    steps: [`Split the ${R} rows into 5 and ${R - 5}.`, `5 × ${C} = ${5 * C}.`, `${R - 5} × ${C} = ${(R - 5) * C}.`, `Add them: ${5 * C} + ${(R - 5) * C} = ${P}.`], explainText: `${R} × ${C} = ${P}.` });
});

S('place1000', 2, 'Hundreds, tens and ones', '💯', [
  ['A flat is 100. A rod is 10. A little cube is 1.', () => htoSVG(1, 1, 1)],
  ['2 flats, 4 rods and 3 cubes make 243: 200 + 40 + 3.', () => htoSVG(2, 4, 3)],
  ['A zero keeps a place empty: 3 hundreds and 5 ones is 305, not 35.', () => htoSVG(3, 0, 5)]
], L => {
  if (L === 1) {
    const h = rnd(1, 3), t = rnd(0, 9), o = rnd(0, 9), n = 100 * h + 10 * t + o;
    return Q({ prompt: 'What number is this?', speak: 'Count the hundreds, tens and ones. What number is this?', visual: htoSVG(h, t, o), choices: opts(n, [100 * h + 10 * o + t, n + 10, n - 10, n + 100, h + t + o, 100 * t + 10 * h + o].filter(v => v > 0)), answer: n,
      explainText: `${h} hundred${h > 1 ? 's' : ''} = ${100 * h}, ${t} tens = ${10 * t}, ${o} ones = ${o}. ${100 * h} + ${10 * t} + ${o} = ${n}.` });
  }
  if (L === 2) {
    const h = rnd(1, 9), t = Math.random() < 0.4 ? 0 : rnd(1, 9), o = rnd(0, 9), n = 100 * h + 10 * t + o, asWords = Math.random() < 0.5;
    const parts = [100 * h, 10 * t, o].filter(Boolean);
    return Q({ prompt: asWords ? `${h} hundreds, ${t} tens and ${o} ones = ?` : `${parts.join(' + ')} = ?`, choices: opts(n, [Number(`${h}${t || ''}${o}`), 100 * h + 10 * o + t, n + 10, n + 100, n - 1, 1000 * h + 10 * t + o].filter(v => v > 0)), answer: n,
      explain: htoSVG(h, t, o), explainText: `Write the hundreds digit ${h}, the tens digit ${t} and the ones digit ${o}: ${n}.${t === 0 ? ' The 0 holds the tens place.' : ''}` });
  }
  if (L === 3) {
    const n = rnd(110, 895), [d, w] = pick([[10, 'more'], [100, 'more'], [10, 'less'], [100, 'less']]), r = w === 'more' ? n + d : n - d, sg = w === 'more' ? 1 : -1;
    return Q({ prompt: `What is ${d} ${w} than ${n}?`, choices: opts(r, [n - sg * d, n + sg * (110 - d), r + 1, r - 1, n + sg]), answer: r,
      explainText: `${d} ${w} changes the ${d === 10 ? 'tens' : 'hundreds'} digit by 1: ${n} ${w === 'more' ? '+' : '−'} ${d} = ${r}.` });
  }
  if (L === 4) {
    const [a, b, c] = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), perms = [[a, b, c], [a, c, b], [b, a, c], [b, c, a], [c, a, b], [c, b, a]].map(p => +p.join(''));
    const big = Math.random() < 0.5, ans = big ? Math.max(...perms) : Math.min(...perms);
    return Q({ prompt: `Which number is the ${big ? 'biggest' : 'smallest'}?`, choices: opts(ans, perms), answer: ans,
      explainText: `Compare the hundreds digits first. The ${big ? 'biggest' : 'smallest'} hundreds digit wins. If they match, compare the tens. ${ans} is the ${big ? 'biggest' : 'smallest'}.` });
  }
  if (Math.random() < 0.5) {
    const n = rnd(100, 999) * 10;
    return Q({ prompt: `How many tens make ${fmt(n)}?`, speak: `How many tens make ${n}?`, choices: opts(n / 10, [Math.floor(n / 100), n, n / 10 + 10, n / 10 - 1, (n / 10) % 100]), answer: n / 10,
      explainText: `Every 10 is one ten. ${fmt(n)} ÷ 10 = ${fmt(n / 10)} tens.` });
  }
  const n = rnd(1000, 9999), d = String(n).split('').map(Number), i = pick([1, 2]);
  if (!d[i]) return MATH.place1000.gen(L);
  const val = d[i] * 10 ** (3 - i), parts = d.map((x, j) => j === i ? '?' : fmt(x * 10 ** (3 - j)));
  return Q({ prompt: `${parts.join(' + ')} = ${fmt(n)}`, speak: `${parts.join(' plus ').replace('?', 'what')} makes ${n}?`, choices: opts(val, [d[i], d[i] * 10, d[i] * 100, d[i] * 1000, (d[i] + 1) * 10 ** (3 - i)].filter(v => v !== val)), answer: val,
    explainText: `In ${fmt(n)}, the ${d[i]} is in the ${i === 1 ? 'hundreds' : 'tens'} place, so it is worth ${fmt(val)}.` });
});

const clk12 = t => { t = ((t % 720) + 720) % 720; return [Math.floor(t / 60) || 12, t % 60]; };
const tStr = t => timeStr(...clk12(t));
const durStr = d => d < 60 ? `${d} minutes` : `${Math.floor(d / 60)} hour${d >= 120 ? 's' : ''}${d % 60 ? ` ${d % 60} min` : ''}`;
const durSay = d => durStr(d).replace('min', 'minutes').replace('minutesutes', 'minutes');
const clocks = (a, b) => `<div class="row m3clocks">${clockSVG(...clk12(a))}<span class="op">→</span>${clockSVG(...clk12(b))}</div>`;
const EVENTS = ['The film', 'Swimming class', 'The party', 'The bus ride', 'Football practice', 'The school trip', 'The puppet show'];
S('elapsed', 2, 'How long does it take?', '⏳', [
  ['How long from 3:00 to 5:30? Look at the start and the end.', () => clocks(180, 330)],
  ['Count on the whole hours first: 3:00 to 5:00 is 2 hours. Then 5:00 to 5:30 is 30 minutes more.', () => hopLine([3, 5, 5.5], ['2 hours', '30 min']).replace('>5.5<', '>5:30<').replace('>3<', '>3:00<').replace('>5<', '>5:00<')],
  ['Remember: 1 hour = 60 minutes. Half an hour = 30 minutes. A quarter of an hour = 15 minutes.', () => clockSVG(12, 30)]
], L => {
  const ev = pick(EVENTS);
  if (L === 1) {
    const h = rnd(1, 9), d = rnd(1, 3);
    if (Math.random() < 0.5) return Q({ prompt: word(`${ev} starts at ${h}:00 and ends at ${h + d}:00. How long is it?`), visual: clocks(h * 60, (h + d) * 60), choices: sOpts(durStr(60 * d), [1, 2, 3, 4, 5].map(x => durStr(60 * x))), answer: durStr(60 * d), explainText: `Count the hours from ${h} to ${h + d}: that is ${d} hour${d > 1 ? 's' : ''}.` });
    const e = tStr((h + d) * 60);
    return Q({ prompt: `It is ${h}:00. What time will it be in ${d} hour${d > 1 ? 's' : ''}?`, visual: clockSVG(h, 0), choices: sOpts(e, [tStr((h + d + 1) * 60), tStr((h + d - 1) * 60), tStr(h * 60 + d * 10), tStr((h + d) * 60 + 30)]), answer: e, explainText: `Move the short hand on ${d} hour${d > 1 ? 's' : ''}: ${h}:00 → ${e}.` });
  }
  if (L <= 3 || (L === 5 && Math.random() < 0.4)) {
    const t = L === 2 ? rnd(1, 12) * 60 + pick([0, 30]) : rnd(12, 143) * 5, d = L === 2 ? pick([15, 30, 45, 60, 90]) : L === 3 ? rnd(2, 11) * 5 : rnd(4, 20) * 5;
    if (L === 5) {
      const end = t, start = t - d, a = tStr(start);
      return Q({ prompt: word(`${ev} ended at ${tStr(end)}. It lasted ${durStr(d)}. When did it start?`), speak: `${ev} ended at ${tStr(end)}. It lasted ${durSay(d)}. When did it start?`, visual: clockSVG(...clk12(end)), choices: sOpts(a, [tStr(end + d), tStr(start + 10), tStr(start - 10), tStr(start + 60), tStr(start - 60)]), answer: a,
        steps: [`Count back ${durSay(d)} from ${tStr(end)}.`, ...(d >= 60 ? [`Back ${Math.floor(d / 60)} hour${d >= 120 ? 's' : ''}: ${tStr(end - 60 * Math.floor(d / 60))}.`] : []), ...(d % 60 ? [`Back ${d % 60} minutes: ${a}.`] : [])], explainText: `It started at ${a}.` });
    }
    const e = tStr(t + d), m = t % 60, toHour = 60 - m;
    return Q({ prompt: `It is ${tStr(t)}. What time will it be in ${durStr(d)}?`, speak: `It is ${tStr(t)}. What time will it be in ${durSay(d)}?`, visual: clockSVG(...clk12(t)), choices: sOpts(e, [tStr(t + d + 10), tStr(t + d - 10), tStr(t + d + 60), tStr(t + d - 5), tStr(t - d)]), answer: e,
      steps: d > toHour && m ? [`From ${tStr(t)} to ${tStr(t + toHour)} is ${toHour} minutes.`, `${d} − ${toHour} = ${d - toHour} minutes more: ${e}.`] : null, explainText: `${tStr(t)} + ${durSay(d)} = ${e}.` });
  }
  if (L === 4) {
    const t = rnd(12, 120) * 5, d = rnd(3, 30) * 5;
    return Q({ prompt: word(`${ev} starts at ${tStr(t)} and ends at ${tStr(t + d)}. How long is it?`), visual: clocks(t, t + d), choices: sOpts(durStr(d), [d + 5, d - 5, d + 10, d - 10, d + 60, d - 60].filter(v => v > 0).map(durStr), v => v.replace(/ min$/, ' minutes')), answer: durStr(d),
      steps: [`Count on from ${tStr(t)} to the next o'clock: ${60 - t % 60} minutes.`, `Then count on to ${tStr(t + d)}.`], explainText: `It lasts ${durSay(d)}.` });
  }
  if (Math.random() < 0.5) { const w = rnd(2, 9); return Q({ prompt: `How many days are in ${w} weeks?`, choices: opts(7 * w, [7 * w + 7, 7 * w - 7, 5 * w, w + 7, 7 * w + 1]), answer: 7 * w, explainText: `A week has 7 days. ${w} × 7 = ${7 * w} days.` }); }
  const h = rnd(1, 4), half = pick([0, 15, 30, 45]), mins = 60 * h + half, words = half === 0 ? `${h} hours` : half === 30 ? `${h} and a half hours` : half === 15 ? `${h} hours and a quarter` : `${h} hours and 45 minutes`;
  return Q({ prompt: `How many minutes are in ${words}?`, choices: opts(mins, [100 * h + half, mins + 15, mins - 15, 60 * h, mins + 60]), answer: mins, explainText: `1 hour is 60 minutes, so ${h} hours is ${60 * h} minutes${half ? `, plus ${half} more is ${mins}` : ''}.` });
});

/* 3D shapes drawn as see-through "glass" so every edge and corner can be counted. */
const SOLIDS = {
  cube: { f: 6, e: 12, v: 8, prism: [[12, 48], [72, 48], [72, 108], [12, 108]], d: [30, -30] },
  cuboid: { f: 6, e: 12, v: 8, prism: [[6, 60], [86, 60], [86, 106], [6, 106]], d: [26, -26] },
  'triangular prism': { f: 5, e: 9, v: 6, prism: [[8, 102], [62, 102], [35, 56]], d: [48, -34] },
  'pentagonal prism': { f: 7, e: 15, v: 10, prism: [[38, 46], [66, 66], [56, 100], [20, 100], [10, 66]], d: [44, -32] },
  'hexagonal prism': { f: 8, e: 18, v: 12, prism: [[70, 76], [55, 102], [25, 102], [10, 76], [25, 50], [55, 50]], d: [42, -32] },
  'square pyramid': { f: 5, e: 8, v: 5, pyr: [[12, 98], [76, 98], [104, 76], [40, 76]], apex: [58, 10] },
  'triangular pyramid': { f: 4, e: 6, v: 4, pyr: [[10, 100], [90, 100], [64, 76]], apex: [52, 12] },
  'pentagonal pyramid': { f: 6, e: 10, v: 6, pyr: [0, 1, 2, 3, 4].map(k => [58 + 46 * Math.cos(Math.PI / 2 + k * 2 * Math.PI / 5), 86 + 14 * Math.sin(Math.PI / 2 + k * 2 * Math.PI / 5)]), apex: [58, 8] },
  cylinder: { round: 1 }, cone: { round: 1 }, sphere: { round: 1 }
};
function solidSVG(name, dots) {
  const s = SOLIDS[name], st = `stroke="${INK}" stroke-width="2" stroke-linejoin="round"`, F = '#9CC9F2'; let g = '', vs = [];
  if (s.prism) {
    const B = s.prism, T = B.map(([x, y]) => [x + s.d[0], y + s.d[1]]);
    g += `<polygon points="${pts2(T)}" fill="${F}" fill-opacity=".35" ${st}/>`;
    B.forEach((p, i) => { const j = (i + 1) % B.length; g += `<polygon points="${pts2([p, B[j], T[j], T[i]])}" fill="${F}" fill-opacity=".25" ${st}/>`; });
    g += `<polygon points="${pts2(B)}" fill="${F}" fill-opacity=".55" ${st}/>`; vs = [...B, ...T];
  } else if (s.pyr) {
    const B = s.pyr, A = s.apex;
    g += `<polygon points="${pts2(B)}" fill="${F}" fill-opacity=".45" ${st}/>`;
    B.forEach((p, i) => { g += `<polygon points="${pts2([p, B[(i + 1) % B.length], A])}" fill="${F}" fill-opacity=".22" ${st}/>`; });
    vs = [...B, A];
  } else if (name === 'cylinder') {
    g = `<path d="M24 26 V90 A36 11 0 0 0 96 90 V26" fill="${F}" fill-opacity=".45" ${st}/><ellipse cx="60" cy="26" rx="36" ry="11" fill="${F}" ${st}/><path d="M24 90 A36 11 0 0 1 96 90" fill="none" ${st} stroke-dasharray="4 4"/>`;
  } else if (name === 'cone') {
    g = `<path d="M60 10 L22 90 A38 12 0 0 0 98 90 Z" fill="${F}" fill-opacity=".45" ${st}/><path d="M22 90 A38 12 0 0 1 98 90" fill="none" ${st} stroke-dasharray="4 4"/>`; vs = [[60, 10]];
  } else {
    g = `<circle cx="60" cy="58" r="46" fill="${F}" fill-opacity=".55" ${st}/><ellipse cx="60" cy="58" rx="46" ry="13" fill="none" ${st} stroke-opacity=".5" stroke-dasharray="4 4"/><ellipse cx="44" cy="40" rx="10" ry="6" fill="#fff" fill-opacity=".6"/>`;
  }
  if (dots) g += vs.map(p => `<circle cx="${+p[0].toFixed(1)}" cy="${+p[1].toFixed(1)}" r="4.5" fill="#F2604F" stroke="#fff" stroke-width="1.2"/>`).join('');
  return svgBox('-2 0 124 116', g, name);
}
S('solids', 2, '3D shapes', '🧊', [
  ['3D shapes are solid. A flat side is a face. Where two faces meet is an edge. A corner is a vertex.', () => solidSVG('cube', true)],
  ['A cube has 6 square faces, 12 edges and 8 vertices (the red dots).', () => `<span class="bignum m3mid">6 · 12 · 8</span>`],
  ['Some shapes are curved: a cylinder, a cone and a sphere can roll!', () => `<div class="row">${solidSVG('cylinder')}${solidSVG('cone')}</div>`]
], L => {
  const poly = ['cube', 'cuboid', 'triangular prism', 'square pyramid', 'triangular pyramid'];
  if (L === 1) {
    const n = pick(['cube', 'cuboid', 'cylinder', 'cone', 'sphere', 'square pyramid', 'triangular prism']);
    return Q({ prompt: 'What is this shape called?', visual: solidSVG(n), choices: sOpts(n, ['cube', 'cuboid', 'cylinder', 'cone', 'sphere', 'square pyramid', 'triangular prism'].filter(x => x !== n && !(n === 'cube' && x === 'cuboid') && !(n === 'cuboid' && x === 'cube'))), answer: n,
      explainText: { cube: 'A cube has 6 faces that are all squares.', cuboid: 'A cuboid is a box shape. Its faces are rectangles.', cylinder: 'A cylinder has two flat circles and one curved side, like a tin can.', cone: 'A cone has a circle at the bottom and a point at the top, like an ice-cream cone.', sphere: 'A sphere is perfectly round, like a ball.', 'square pyramid': 'A square pyramid has a square base and 4 triangles meeting at the top.', 'triangular prism': 'A triangular prism has a triangle at each end, like a tent.' }[n] });
  }
  if (L <= 3) {
    const n = pick(L === 2 ? poly : [...poly, 'pentagonal prism']), s = SOLIDS[n], k = L === 2 ? 'faces' : pick(['edges', 'vertices']), ans = s[k[0]];
    return Q({ prompt: `How many ${k} does a ${n} have?`, visual: solidSVG(n), choices: opts(ans, [ans + 1, ans - 1, ans + 2, s.f, s.e, s.v, ans - 2].filter(v => v > 0)), answer: ans, explain: solidSVG(n, true),
      explainText: k === 'faces' ? `Count the flat sides, including the ones at the back and the bottom: ${ans} faces.` : k === 'vertices' ? `Count the corners (the red dots): ${ans} vertices.` : `Count the lines where two faces meet, front and back: ${ans} edges.` });
  }
  if (L === 4) {
    if (Math.random() < 0.4) {
      const [d, n] = pick([['1 curved face and no edges', 'sphere'], ['2 flat circle faces and 1 curved face', 'cylinder'], ['1 flat circle face and 1 vertex at the top', 'cone']]);
      return Q({ prompt: `Which shape has ${d}?`, choices: sOpts(n, ['sphere', 'cylinder', 'cone', 'cube'].filter(x => x !== n)), answer: n, explain: solidSVG(n), explainText: `A ${n} has ${d}.` });
    }
    const n = pick([...poly, 'pentagonal prism', 'hexagonal prism']), s = SOLIDS[n], same = x => SOLIDS[x].f === s.f && SOLIDS[x].e === s.e && SOLIDS[x].v === s.v;
    return Q({ prompt: `Which shape has ${s.f} faces, ${s.e} edges and ${s.v} vertices?`, choices: sOpts(n, [...poly, 'pentagonal prism', 'hexagonal prism'].filter(x => !same(x))), answer: n, explain: solidSVG(n, true), explainText: `A ${n} has ${s.f} faces, ${s.e} edges and ${s.v} vertices.` });
  }
  const sides = rnd(5, 10), nm = { 5: 'pentagonal', 6: 'hexagonal', 7: 'heptagonal', 8: 'octagonal', 9: 'nonagonal', 10: 'decagonal' }[sides];
  if (Math.random() < 0.5) {
    const isP = Math.random() < 0.5, k = pick(['faces', 'edges', 'vertices']), vals = isP ? { faces: sides + 2, edges: 3 * sides, vertices: 2 * sides } : { faces: sides + 1, edges: 2 * sides, vertices: sides + 1 }, ans = vals[k];
    const why = isP ? { faces: `2 ends + ${sides} rectangles = ${ans} faces.`, edges: `${sides} edges on each end + ${sides} joining them = ${ans} edges.`, vertices: `${sides} corners on each end: 2 × ${sides} = ${ans} vertices.` }[k] : { faces: `1 base + ${sides} triangles = ${ans} faces.`, edges: `${sides} around the base + ${sides} up to the top = ${ans} edges.`, vertices: `${sides} around the base + 1 on top = ${ans} vertices.` }[k];
    return Q({ prompt: `A ${nm} ${isP ? 'prism' : 'pyramid'} has a ${sides}-sided ${isP ? 'end' : 'base'}. How many ${k} does it have?`, visual: isP && sides === 6 ? solidSVG('hexagonal prism') : isP && sides === 5 ? solidSVG('pentagonal prism') : !isP && sides === 5 ? solidSVG('pentagonal pyramid') : '', choices: opts(ans, [vals.faces, vals.edges, vals.vertices, ans + 1, ans - 1, ans + 2, sides].filter(v => v > 0)), answer: ans, explainText: why });
  }
  const n = pick(['cube', 'triangular prism', 'square pyramid', 'pentagonal prism', 'hexagonal prism', 'triangular pyramid', 'pentagonal pyramid']), s = SOLIDS[n];
  return Q({ prompt: `A shape has ${s.f} faces and ${s.v} vertices. How many edges does it have?`, choices: opts(s.e, [s.f + s.v, s.e + 2, s.e - 2, s.e + 1, s.f + s.v + 2]), answer: s.e,
    steps: ['For shapes with flat faces: faces + vertices − edges = 2.', `So edges = ${s.f} + ${s.v} − 2 = ${s.e}.`], explainText: `It has ${s.e} edges (it could be a ${n}).` });
});

function cellsSVG(cells, gw, gh) {
  const s = 20, has = (x, y) => cells.has(x + ',' + y); let g = '', fill = '', edge = '';
  for (let i = 0; i <= gw; i++) g += `<line x1="${i * s}" y1="0" x2="${i * s}" y2="${gh * s}" stroke="#CCDBE6" stroke-width="1"/>`;
  for (let j = 0; j <= gh; j++) g += `<line x1="0" y1="${j * s}" x2="${gw * s}" y2="${j * s}" stroke="#CCDBE6" stroke-width="1"/>`;
  const E = (a, b, c, d) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  for (const k of cells) {
    const [x, y] = k.split(',').map(Number), X = x * s, Y = y * s;
    fill += `<rect x="${X}" y="${Y}" width="${s}" height="${s}" fill="#A8E0C2"/>`;
    if (!has(x, y - 1)) edge += E(X, Y, X + s, Y); if (!has(x, y + 1)) edge += E(X, Y + s, X + s, Y + s);
    if (!has(x - 1, y)) edge += E(X, Y, X, Y + s); if (!has(x + 1, y)) edge += E(X + s, Y, X + s, Y + s);
  }
  return svgBox(`-3 -3 ${gw * s + 6} ${gh * s + 6}`, g + fill + edge, 'shape on squared paper', gw > 6);
}
const perimOf = cells => { let p = 0; for (const k of cells) { const [x, y] = k.split(',').map(Number); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!cells.has((x + dx) + ',' + (y + dy))) p++; } return p; };
function polyLabSVG(pts, labs, ticks) {
  const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length; let g = `<polygon points="${pts2(pts)}" fill="#FFD98A" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
  pts.forEach((p, i) => {
    const q = pts[(i + 1) % pts.length], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = mx - cx, dy = my - cy, d = Math.hypot(dx, dy) || 1;
    if (labs[i] != null) g += tx(mx + dx / d * 14, my + dy / d * 14 + 4, labs[i], { size: 11 });
    if (ticks) { const ex = q[0] - p[0], ey = q[1] - p[1], el = Math.hypot(ex, ey), nx = -ey / el * 5, ny = ex / el * 5; g += `<line x1="${+(mx + nx).toFixed(1)}" y1="${+(my + ny).toFixed(1)}" x2="${+(mx - nx).toFixed(1)}" y2="${+(my - ny).toFixed(1)}" stroke="${INK}" stroke-width="2"/>`; }
  });
  return svgBox('-16 -14 132 132', g, 'shape with side lengths');
}
// An L-shaped room: a W × H rectangle with a cw × ch corner cut from the top right.
function lshapeSVG(W, H, cw, ch, lab) {
  const k = Math.min(170 / W, 110 / H), ox = 30, oy = 18, P = (x, y) => [ox + x * k, oy + y * k];
  const pts = [P(0, 0), P(W - cw, 0), P(W - cw, ch), P(W, ch), P(W, H), P(0, H)];
  let g = `<polygon points="${pts2(pts)}" fill="#D9EBFC" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
  g += tx(ox + (W - cw) * k / 2, oy - 5, lab.top) + tx(ox + (W - cw) * k + 5, oy + ch * k / 2 + 4, lab.iv, { anchor: 'start', fill: '#F2604F' }) + tx(ox + (W - cw / 2) * k, oy + ch * k - 5, lab.ih, { fill: '#F2604F' });
  g += tx(ox + W * k + 5, oy + (ch + H) / 2 * k + 4, lab.right, { anchor: 'start' }) + tx(ox + W * k / 2, oy + H * k + 15, lab.bottom) + tx(ox - 5, oy + H * k / 2 + 4, lab.left, { anchor: 'end' });
  return svgBox(`0 0 ${ox + W * k + 34} ${oy + H * k + 22}`, g, 'L-shaped room', true);
}
const rectCells = (x0, y0, w, h) => { const s = new Set(); for (let x = x0; x < x0 + w; x++) for (let y = y0; y < y0 + h; y++) s.add(x + ',' + y); return s; };
S('perimeter', 2, 'Perimeter: all the way round', '🚧', [
  ['Perimeter is the distance all the way around the outside of a shape, like a fence round a field.', () => cellsSVG(rectCells(1, 1, 4, 2), 6, 4)],
  ['On squared paper, count each little edge on the outside: this one is 4 + 2 + 4 + 2 = 12.', () => cellsSVG(rectCells(1, 1, 4, 2), 6, 4)],
  ['With lengths written on, add up every side. Do not miss any!', () => polyLabSVG([[10, 88], [90, 88], [42, 14]], ['8 cm', '6 cm', '5 cm'])]
], L => {
  if (L <= 2) {
    let cells, W = rnd(L === 1 ? 2 : 3, L === 1 ? 5 : 6), H = rnd(L === 1 ? 1 : 2, L === 1 ? 3 : 4);
    cells = rectCells(1, 1, W, H);
    if (L === 2) {
      const cw = rnd(1, W - 1), ch = rnd(1, H - 1), right = Math.random() < 0.5;
      for (let x = 0; x < cw; x++) for (let y = 0; y < ch; y++) cells.delete((right ? W - x : 1 + x) + ',' + (1 + y));
      if (Math.random() < 0.4 && W - cw >= 2) { const x = right ? 1 : W; for (let y = H; y > H - ch && y > 1; y--) cells.delete(x + ',' + y); }
    }
    const p = perimOf(cells);
    return Q({ prompt: 'What is the perimeter? Count the edges all the way round.', speak: 'Count the little edges all the way round the outside. What is the perimeter?', visual: cellsSVG(cells, W + 2, H + 2), choices: opts(p, [cells.size, p + 2, p - 2, p + 1, p - 1].filter(v => v > 0)), answer: p,
      explainText: `Start at one corner and count every edge on the outside until you get back. There are ${p}. (The ${cells.size} squares inside are the area, not the perimeter.)` });
  }
  if (L === 3) {
    const n = pick([3, 4, 5, 6]), shapes = { 3: [[10, 88], [92, 88], [36, 12]], 4: [[8, 80], [86, 92], [96, 24], [26, 10]], 5: polyPts(5), 6: polyPts(6) }, lens = Array.from({ length: n }, () => rnd(2, 15)), p = lens.reduce((a, b) => a + b, 0);
    return Q({ prompt: 'What is the perimeter?', speak: `What is the perimeter? Add the sides: ${lens.join(', ')} centimetres.`, visual: polyLabSVG(shapes[n], lens.map(v => v + ' cm')), choices: opts(p, [p + 1, p - 1, p + 10, p - lens[0], p + lens[1]], 4, v => v + ' cm', v => v + ' centimetres'), answer: p,
      explainText: `Add every side: ${lens.join(' + ')} = ${p} cm.` });
  }
  const names = { 3: 'equilateral triangle', 4: 'square', 5: 'regular pentagon', 6: 'regular hexagon', 8: 'regular octagon' };
  if (L === 4) {
    const n = pick([3, 4, 5, 6, 8]), s = rnd(2, 12), p = n * s, back = Math.random() < 0.4, pp = n === 4 ? [[10, 10], [90, 10], [90, 90], [10, 90]] : polyPts(n);
    if (back) return Q({ prompt: word(`A ${names[n]} has a perimeter of ${p} cm. How long is each side?`), visual: polyLabSVG(pp, pp.map(() => null), true), choices: opts(s, [s + 1, s - 1, p - n, p / 2, s * 2].filter(v => v > 0 && Number.isInteger(v)), 4, v => v + ' cm', v => v + ' centimetres'), answer: s,
      explainText: `It has ${n} equal sides. ${p} ÷ ${n} = ${s} cm.` });
    return Q({ prompt: word(`Every side of this ${names[n]} is ${s} cm. What is the perimeter?`), visual: polyLabSVG(pp, pp.map((_, i) => i ? null : s + ' cm'), true), choices: opts(p, [p + s, p - s, s * s, n + s, 2 * s].filter(v => v !== p), 4, v => v + ' cm', v => v + ' centimetres'), answer: p,
      explainText: `The little marks show all ${n} sides are equal. ${n} × ${s} = ${p} cm.` });
  }
  if (Math.random() < 0.4) {
    const l = rnd(4, 15), w = rnd(2, l - 1), p = 2 * (l + w);
    return Q({ prompt: word(`A rectangle has a perimeter of ${p} cm. It is ${l} cm long. How wide is it?`), visual: rectSVG(l, w, false, false), choices: opts(w, [p - l, p / 2, w + 1, w - 1, p - 2 * l + 1].filter(v => v > 0 && v !== w && Number.isInteger(v)), 4, v => v + ' cm', v => v + ' centimetres'), answer: w,
      steps: [`Long side + short side is half the perimeter: ${p} ÷ 2 = ${l + w}.`, `${l + w} − ${l} = ${w}.`], explainText: `It is ${w} cm wide.` });
  }
  const W = rnd(8, 20), H = rnd(6, 14), cw = rnd(2, W - 4), ch = rnd(2, H - 3), p = 2 * (W + H);
  return Q({ prompt: 'What is the perimeter of this room (in metres)?', speak: 'Two sides are missing. Work them out, then add all six sides. What is the perimeter in metres?', visual: lshapeSVG(W, H, cw, ch, { top: W - cw, iv: '?', ih: '?', right: H - ch, bottom: W, left: H }),
    choices: opts(p, [p - cw - ch, W * H - cw * ch, p + 2, p - 2, W + H + (W - cw) + (H - ch)].filter(v => v > 0), 4, v => v + ' m', v => v + ' metres'), answer: p,
    steps: [`The missing across side: ${W} − ${W - cw} = ${cw}.`, `The missing up side: ${H} − ${H - ch} = ${ch}.`, `Add all six: ${W - cw} + ${ch} + ${cw} + ${H - ch} + ${W} + ${H} = ${p}.`], explainText: `The perimeter is ${p} m.` });
});

const ROMAN = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
const toRoman = n => { let s = ''; for (const [v, r] of ROMAN) while (n >= v) { s += r; n -= v; } return s; };
const RV = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
const romanNaive = s => [...s].reduce((a, c) => a + RV[c], 0);
const romanPlain = n => { let s = ''; for (const [v, r] of ROMAN.filter(x => x[1].length === 1)) while (n >= v) { s += r; n -= v; } return s; };
const romanSay = s => s.split('').join(' ');
const tablet = s => `<span class="roman">${s}</span>`;
const romanParts = s => { const out = []; for (let i = 0; i < s.length; i++) { const a = RV[s[i]], b = RV[s[i + 1]] || 0; if (a < b) { out.push(`${s[i]}${s[i + 1]} = ${b - a}`); i++; } else out.push(`${s[i]} = ${a}`); } return out; };
S('roman', 2, 'Roman numerals', '🏛️', [
  ['Long ago, the Romans wrote numbers with letters: I = 1, V = 5, X = 10, L = 50, C = 100.', () => `<div class="row">${['I', 'V', 'X', 'L', 'C'].map(tablet).join('')}</div>`],
  ['Letters side by side are added: XVI = 10 + 5 + 1 = 16.', () => tablet('XVI')],
  ['A smaller letter BEFORE a bigger one is taken away: IV = 4, IX = 9, XL = 40.', () => `<div class="row">${tablet('IV')}${tablet('IX')}</div>`]
], L => {
  if (L === 3) {
    const n = rnd(4, 49), r = toRoman(n), swap = r.length > 1 ? r.slice(0, -2) + r.slice(-1) + r.slice(-2, -1) : r;
    return Q({ prompt: `Write ${n} in Roman numerals`, speak: `How do you write ${n} in Roman numerals?`, choices: sOpts(r, [romanPlain(n), swap, toRoman(n + 1), toRoman(n - 1), toRoman(n + 10), toRoman(Math.max(1, n - 10))].filter(v => v && v !== r), romanSay), answer: r,
      steps: romanParts(r), explainText: `${n} = ${r}.` });
  }
  const n = L === 1 ? rnd(1, 10) : L === 2 ? rnd(11, 39) : L === 4 ? rnd(40, 100) : (Math.random() < 0.6 ? rnd(1000, 2099) : rnd(101, 999)), r = toRoman(n);
  return Q({ prompt: 'What number is this?', speak: `What number is ${romanSay(r)}?`, visual: tablet(r), choices: opts(n, [romanNaive(r), n + 1, n - 1, n + 5, n + 10, n - 10, L === 5 ? n + 100 : n - 5, L === 5 ? n - 100 : n + 2].filter(v => v > 0)), answer: n,
    steps: r.length > 1 ? romanParts(r) : null, explainText: `${r} = ${fmt(n)}.` });
});

const BAR_COLS = ['#9CC9F2', '#FFD98A', '#A8E0C2', '#F7B9AE'];
function barModel(parts, total) {
  const sum = parts.reduce((a, p) => a + p.w, 0); let x = 10, g = `<path d="M10 30 V22 H290 V30" fill="none" stroke="${INK}" stroke-width="2"/>${tx(150, 16, total, { size: 15 })}`;
  parts.forEach((p, i) => { const w = p.w / sum * 280; g += `<rect x="${x}" y="34" width="${w}" height="40" fill="${p.c || BAR_COLS[i % 4]}" stroke="${INK}" stroke-width="2"/>${tx(x + w / 2, 59, p.t, { size: 15 })}`; x += w; });
  return svgBox('0 0 300 80', g, 'bar model', true);
}
// Rows of bars that start at the same place, for "more than" and "times as many" stories.
function compareModel(rows, total) {
  const max = Math.max(...rows.map(r => r.segs.reduce((a, s) => a + s.w, 0))), k = 196 / max; let g = '';
  rows.forEach((r, i) => {
    const y = 6 + i * 48; let x = 62;
    g += tx(56, y + 24, r.name, { size: 13, anchor: 'end' });
    r.segs.forEach((s, j) => { const w = s.w * k; g += `<rect x="${x}" y="${y}" width="${w}" height="34" fill="${s.dash ? 'none' : s.c || BAR_COLS[(i + j) % 4]}" stroke="${s.dash ? '#F2604F' : INK}" stroke-width="2"${s.dash ? ' stroke-dasharray="5 4"' : ''}/>${tx(x + w / 2, y + 23, s.t, { size: 14, fill: s.dash ? '#F2604F' : INK })}`; x += w; });
  });
  const H = rows.length * 48 + 4;
  if (total != null) g += `<path d="M264 6 H270 V${H - 8} H264" fill="none" stroke="${INK}" stroke-width="2"/>${tx(274, H / 2 + 2, total, { size: 14, anchor: 'start' })}`;
  return svgBox(`0 0 300 ${H}`, g, 'bar model comparing amounts', true);
}
S('barmodel', 2, 'Bar models', '📦', [
  ['A bar model is a picture of a story. The whole bar is the total. The pieces are the parts.', () => barModel([{ w: 30, t: '30' }, { w: 20, t: '20' }], '50')],
  ['If a part is missing, take the part you know from the whole: 50 − 30 = 20.', () => barModel([{ w: 30, t: '30' }, { w: 20, t: '?' }], '50')],
  ['To compare, draw one bar under the other. The extra bit is the difference.', () => compareModel([{ name: 'Leo', segs: [{ w: 20, t: '20' }, { w: 12, t: '12 more', dash: 1 }] }, { name: 'Ava', segs: [{ w: 32, t: '32' }] }])]
], L => {
  const [A, B] = shuffle(NAMES3), t = pick(THINGS)[1];
  if (L === 1) { const a = rnd(10, 50), b = rnd(10, 50); return Q({ prompt: word(`${A} has ${a} ${t}. ${B} has ${b} ${t}. How many do they have altogether?`), visual: barModel([{ w: a, t: a }, { w: b, t: b }], '?'), choices: opts(a + b, near(a + b).concat([Math.abs(a - b)])), answer: a + b, explainText: `The whole bar is both parts together: ${a} + ${b} = ${a + b}.` }); }
  if (L === 2) { const T = rnd(40, 100), a = rnd(10, T - 10); return Q({ prompt: word(`${A} and ${B} have ${T} ${t} in total. ${A} has ${a}. How many does ${B} have?`), visual: barModel([{ w: a, t: a }, { w: T - a, t: '?' }], T), choices: opts(T - a, near(T - a).concat([T + a])), answer: T - a, explainText: `Whole − part = missing part: ${T} − ${a} = ${T - a}.` }); }
  if (L === 3) {
    const a = rnd(12, 60), d = rnd(5, 30);
    if (Math.random() < 0.5) return Q({ prompt: word(`${A} has ${a} ${t}. ${B} has ${d} more than ${A}. How many does ${B} have?`), visual: compareModel([{ name: A, segs: [{ w: a, t: a }, { w: d, t: `${d} more`, dash: 1 }] }, { name: B, segs: [{ w: a + d, t: '?' }] }]), choices: opts(a + d, near(a + d).concat([a - d])), answer: a + d, explainText: `${B}'s bar is ${A}'s bar plus ${d} more: ${a} + ${d} = ${a + d}.` });
    return Q({ prompt: word(`${A} has ${a + d} ${t}. ${B} has ${a}. How many more does ${A} have?`), visual: compareModel([{ name: A, segs: [{ w: a + d, t: a + d }] }, { name: B, segs: [{ w: a, t: a }, { w: d, t: '?', dash: 1 }] }]), choices: opts(d, near(d).filter(v => v > 0).concat([2 * a + d])), answer: d, explainText: `The difference is the extra bit: ${a + d} − ${a} = ${d}.` });
  }
  if (L === 4) {
    const k = rnd(3, 8), e = rnd(3, 12), T = k * e, cut = Math.random() < 0.5, thing = pick([['ribbon', 'cm'], ['rope', 'm'], ['pizza money', 'dollars']]);
    if (cut) return Q({ prompt: word(`A ${thing[0]} of ${T} ${thing[1]} is shared into ${k} equal parts. How much is each part?`), visual: barModel(Array.from({ length: k }, () => ({ w: 1, t: '?', c: '#A8E0C2' })), `${T}`), choices: opts(e, near(e).filter(v => v > 0).concat([T - k, k])), answer: e, explainText: `${k} equal parts make ${T}, so each part is ${T} ÷ ${k} = ${e}.` });
    return Q({ prompt: word(`${A} buys ${k} packs with ${e} ${t} in each. How many ${t} is that?`), visual: barModel(Array.from({ length: k }, () => ({ w: 1, t: e, c: '#FFD98A' })), '?'), choices: opts(T, [T + e, T - e, k + e, T + k, T - 1]), answer: T, explainText: `${k} equal parts of ${e}: ${k} × ${e} = ${T}.` });
  }
  if (Math.random() < 0.5) {
    const s = rnd(10, 40), d = rnd(4, 30), S2 = 2 * s + d;
    return Q({ prompt: word(`${A} and ${B} have ${S2} ${t} together. ${B} has ${d} more than ${A}. How many does ${A} have?`), visual: compareModel([{ name: A, segs: [{ w: s, t: '?' }] }, { name: B, segs: [{ w: s, t: '?' }, { w: d, t: d, c: '#F7B9AE' }] }], S2), choices: opts(s, [s + d, S2 - d, (S2 / 2) | 0, s + 1, s - 1].filter(v => v > 0 && v !== s)), answer: s,
      steps: [`Take away the extra ${d}: ${S2} − ${d} = ${S2 - d}.`, `Now the two bars are the same: ${S2 - d} ÷ 2 = ${s}.`], explainText: `${A} has ${s} and ${B} has ${s + d}.` });
  }
  const k = rnd(2, 5), u = rnd(4, 15), T = (k + 1) * u;
  return Q({ prompt: word(`${A} has ${k} times as many ${t} as ${B}. Together they have ${T}. How many does ${B} have?`), visual: compareModel([{ name: A, segs: Array.from({ length: k }, () => ({ w: 1, t: '?', c: '#9CC9F2' })) }, { name: B, segs: [{ w: 1, t: '?', c: '#FFD98A' }] }], T), choices: opts(u, [k * u, T / k, T - k, u + 1, u - 1].filter(v => v > 0 && Number.isInteger(v) && v !== u)), answer: u,
    steps: [`Count the equal boxes: ${k} + 1 = ${k + 1}.`, `${T} ÷ ${k + 1} = ${u} in each box.`], explainText: `${B} has ${u} (and ${A} has ${k * u}).` });
});

/* ===================== Deep Forest (world index 3) ===================== */
const isDiv = (n, k) => n % k === 0;
const DIV_RULE = { 2: 'it ends in 0, 2, 4, 6 or 8', 5: 'it ends in 0 or 5', 10: 'it ends in 0', 3: 'its digits add up to a number in the 3 times table', 9: 'its digits add up to a number in the 9 times table', 4: 'its last two digits make a number in the 4 times table', 6: 'it is even AND its digits add up to a multiple of 3' };
const digSum = n => String(n).split('').reduce((a, b) => a + +b, 0);
S('divis', 3, 'Divisibility tricks', '🔎', [
  ['Quick checks: a number divides by 2 if it ends in 0, 2, 4, 6 or 8. By 5 if it ends in 0 or 5. By 10 if it ends in 0.', () => '<span class="bignum m3mid">…0 …5</span>'],
  ['For 3 and 9, add up the digits. 126 → 1 + 2 + 6 = 9, so 126 divides by 3 and by 9.', () => '<span class="expr">126 → 1 + 2 + 6 = 9 ✓</span>'],
  ['Factor pairs are rectangles: 12 = 2 × 6 = 3 × 4.', () => `<div class="row">${arraySVG(2, 6)}${arraySVG(3, 4)}</div>`]
], L => {
  if (L === 1 || L === 3) {
    const k = L === 1 ? pick([2, 5, 10]) : pick([3, 4, 6, 9]), lo = L === 1 ? 20 : 100, hi = L === 1 ? 999 : 999;
    let ans; do ans = rnd(lo, hi); while (!isDiv(ans, k));
    const wrong = []; while (wrong.length < 8) { const v = rnd(lo, hi); if (!isDiv(v, k)) wrong.push(v); }
    return Q({ prompt: `Which number divides exactly by ${k}?`, speak: `Which number can be divided exactly by ${k}?`, choices: opts(ans, wrong), answer: ans,
      explainText: `A number divides by ${k} if ${DIV_RULE[k]}. ${ans}${[3, 9, 6].includes(k) ? `: ${String(ans).split('').join(' + ')} = ${digSum(ans)}` : ''}${k === 4 ? `: ${ans % 100} = 4 × ${(ans % 100) / 4}` : ''}. ${ans} ÷ ${k} = ${ans / k}.` });
  }
  if (L === 2) {
    let n = rnd(100, 999); const want = Math.random() < 0.5; while (isDiv(n, 3) !== want) n = rnd(100, 999);
    return Q({ prompt: `Does ${n} divide exactly by 3?`, choices: sOpts(want ? 'yes' : 'no', ['yes', 'no'], v => v, v => v, 2), answer: want ? 'yes' : 'no',
      explainText: `${String(n).split('').join(' + ')} = ${digSum(n)}. ${digSum(n)} ${want ? 'is' : 'is not'} in the 3 times table, so ${n} ${want ? 'divides' : 'does not divide'} by 3.` });
  }
  if (L === 4) {
    const n = pick([24, 30, 36, 40, 42, 48, 56, 60, 72, 84, 90, 96]);
    if (Math.random() < 0.5) {
      const pairs = []; for (let a = 2; a * a <= n; a++) if (n % a === 0) pairs.push([a, n / a]);
      const [a, b] = pick(pairs), s = `${a} × ${b}`, bad = [[a, b + 1], [a + 1, b], [a - 1, b + 1], [a + 1, b - 1], [a, b - 1]].filter(([x, y]) => x > 0 && x * y !== n).map(([x, y]) => `${x} × ${y}`);
      return Q({ prompt: `Which is a factor pair of ${n}?`, choices: sOpts(s, bad, v => v.replace('×', 'times')), answer: s, explainText: `${a} × ${b} = ${n}, so ${a} and ${b} are a factor pair of ${n}.` });
    }
    const fs = []; for (let a = 1; a <= n; a++) if (n % a === 0) fs.push(a);
    return Q({ prompt: `How many factors does ${n} have?`, choices: opts(fs.length, [fs.length + 1, fs.length - 1, fs.length + 2, fs.length - 2, fs.length / 2]), answer: fs.length,
      explainText: `List them in pairs: ${fs.slice(0, Math.ceil(fs.length / 2)).map(a => `${a} × ${n / a}`).join(', ')}. That is ${fs.length} factors: ${fs.join(', ')}.` });
  }
  const k = pick([3, 9]), a = rnd(1, 9), c = rnd(0, 9);
  let x = 0; while ((a + x + c) % k) x++;
  const bad = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => (a + d + c) % k);
  return Q({ prompt: `${a}<span class="m3blank">?</span>${c} divides by ${k}. What is the smallest digit that fits?`, speak: `The number ${a}, blank, ${c} divides by ${k}. What is the smallest digit that can go in the blank?`, choices: opts(x, bad), answer: x,
    steps: [`Add the digits you know: ${a} + ${c} = ${a + c}.`, `The total must be in the ${k} times table. ${a + c} + ${x} = ${a + c + x} works.`], explainText: `The number is ${a}${x}${c}, and ${a}${x}${c} ÷ ${k} = ${(100 * a + 10 * x + c) / k}.` });
});

// Isometric drawings of cubes and boxes. Each box is [x, y, z, dx, dy, dz].
function isoSVG(boxes, o = {}) {
  const [, , , DX = 1, DY = 1, DZ = 1] = boxes[0], s = o.s || 18, c = 0.866 * s, h = s / 2, P = (x, y, z) => [(x - y) * c, (x + y) * h - z * s];
  const sorted = [...boxes].sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]) || a[2] - b[2]);
  const xs = [], ys = [], poly = (p, f) => { p.forEach(q => { xs.push(q[0]); ys.push(q[1]); }); return `<polygon points="${pts2(p)}" fill="${f}" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/>`; };
  let g = '';
  for (const [x, y, z, dx = 1, dy = 1, dz = 1] of sorted) {
    g += poly([P(x, y, z + dz), P(x + dx, y, z + dz), P(x + dx, y + dy, z + dz), P(x, y + dy, z + dz)], o.top || '#FFD98A');
    g += poly([P(x + dx, y, z), P(x + dx, y + dy, z), P(x + dx, y + dy, z + dz), P(x + dx, y, z + dz)], o.right || '#2E8BE6');
    g += poly([P(x, y + dy, z), P(x + dx, y + dy, z), P(x + dx, y + dy, z + dz), P(x, y + dy, z + dz)], o.left || '#9CC9F2');
  }
  if (o.labels) {
    const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], l1 = m(P(0, DY, 0), P(DX, DY, 0)), l2 = m(P(DX, 0, 0), P(DX, DY, 0)), l3 = m(P(DX, 0, 0), P(DX, 0, DZ));
    g += tx(l1[0] - 8, l1[1] + 18, o.labels[0], { size: 13, anchor: 'end' }) + tx(l2[0] + 8, l2[1] + 18, o.labels[1], { size: 13, anchor: 'start' }) + tx(l3[0] + 8, l3[1] + 4, o.labels[2], { size: 13, anchor: 'start' });
    xs.push(l1[0] - 60, l2[0] + 60, l3[0] + 60); ys.push(l1[1] + 24, l2[1] + 24);
  }
  const x0 = Math.min(...xs) - 4, y0 = Math.min(...ys) - 4, w = Math.max(...xs) - x0 + 4, hh = Math.max(...ys) - y0 + 4;
  return svgBox(`${+x0.toFixed(1)} ${+y0.toFixed(1)} ${+w.toFixed(1)} ${+hh.toFixed(1)}`, g, o.label || 'drawing of cubes', !!o.labels);
}
const cubesOf = (l, w, h) => { const out = []; for (let z = 0; z < h; z++) for (let y = 0; y < w; y++) for (let x = 0; x < l; x++) out.push([x, y, z]); return out; };
const boxPic = (l, w, h, labels) => { const k = Math.max(l, w, h * 1.3); return isoSVG([[0, 0, 0, l / k * 5, w / k * 5, h / k * 5]], { s: 22, labels, label: 'box' }); };
S('volume', 3, 'Volume with cubes', '🧊', [
  ['Volume is how much space something fills. We measure it in cubes.', () => isoSVG(cubesOf(3, 2, 1))],
  ['Count one layer: 3 × 2 = 6 cubes. There are 2 layers, so 6 × 2 = 12 cubes.', () => isoSVG(cubesOf(3, 2, 2))],
  ['For any box: volume = length × width × height. The answer is in cubic centimetres (cm³).', () => boxPic(5, 3, 2, ['5 cm', '3 cm', '2 cm'])]
], L => {
  if (L <= 2) {
    const l = rnd(2, L === 1 ? 4 : 4), w = rnd(1, 3), h = L === 1 ? 1 : rnd(2, 3), v = l * w * h;
    return Q({ prompt: L === 1 ? 'How many cubes?' : 'How many cubes make this solid box?', speak: L === 1 ? 'How many cubes are there?' : 'How many cubes make this box? It is solid, with no gaps inside.', visual: isoSVG(cubesOf(l, w, h)), choices: opts(v, [v + 1, v - 1, l * w, l + w + h, v + l * w, v + 2].filter(x => x > 0)), answer: v,
      steps: h > 1 ? [`One layer has ${l} × ${w} = ${l * w} cubes.`, `There are ${h} layers: ${l * w} × ${h} = ${v}.`] : null, explainText: `There are ${v} cubes.` });
  }
  if (L === 3) {
    const l = rnd(2, 10), w = rnd(2, 6), h = rnd(2, 8), v = l * w * h;
    return Q({ prompt: 'What is the volume of the box?', speak: `The box is ${l} by ${w} by ${h} centimetres. What is its volume?`, visual: boxPic(l, w, h, [`${l} cm`, `${w} cm`, `${h} cm`]), choices: opts(v, [l + w + h, l * w, v + l * w, 2 * (l * w + w * h + l * h), v - w * h].filter(x => x > 0 && x !== v), 4, x => `${x} cm³`, x => `${x} cubic centimetres`), answer: v,
      steps: [`Length × width: ${l} × ${w} = ${l * w}.`, `× height: ${l * w} × ${h} = ${v}.`], explainText: `The volume is ${v} cm³.` });
  }
  if (L === 4) {
    if (Math.random() < 0.5) {
      const l = pick([20, 30, 40, 50]), w = pick([10, 20, 30]), h = pick([10, 20, 30]), v = l * w * h, lit = v / 1000;
      return Q({ prompt: word(`A fish tank is ${l} cm long, ${w} cm wide and ${h} cm tall. How many litres of water fill it?`), visual: boxPic(l, w, h, [`${l} cm`, `${w} cm`, `${h} cm`]), choices: opts(lit, [v / 100, v / 10, lit * 10, lit + 1, lit * 2].filter(x => x !== lit), 4, x => `${fmt(x)} L`, x => `${x} litres`), answer: lit,
        steps: [`Volume: ${l} × ${w} × ${h} = ${fmt(v)} cm³.`, '1 cm³ holds 1 mL, and 1000 mL = 1 L.', `${fmt(v)} ÷ 1000 = ${lit} L.`], explainText: `It holds ${lit} litres.` });
    }
    const l = rnd(2, 10), w = rnd(2, 6), h = rnd(2, 9), v = l * w * h;
    return Q({ prompt: word(`A box has a volume of ${v} cm³. It is ${l} cm long and ${w} cm wide. How tall is it?`), visual: boxPic(l, w, h, [`${l} cm`, `${w} cm`, '?']), choices: opts(h, [v - l - w, v / l, h + 1, h - 1, l * w].filter(x => x > 0 && Number.isInteger(x) && x !== h), 4, x => `${x} cm`, x => `${x} centimetres`), answer: h,
      steps: [`One layer is ${l} × ${w} = ${l * w} cm³.`, `${v} ÷ ${l * w} = ${h} layers.`], explainText: `The box is ${h} cm tall.` });
  }
  // Stepped towers: heights never grow towards the front, so every cube can be seen or worked out.
  const nx = rnd(2, 3), ny = rnd(2, 3), H = [];
  for (let x = 0; x < nx; x++) { H[x] = []; for (let y = 0; y < ny; y++) H[x][y] = x + y === 0 ? rnd(2, 4) : rnd(1, Math.min(x ? H[x - 1][y] : 9, y ? H[x][y - 1] : 9)); }
  const boxes = []; let v = 0; for (let x = 0; x < nx; x++) for (let y = 0; y < ny; y++) for (let z = 0; z < H[x][y]; z++) { boxes.push([x, y, z]); v++; }
  return Q({ prompt: 'How many cubes are in these towers?', speak: 'How many cubes are in these towers? Every tower stands on the floor with no gaps.', visual: isoSVG(boxes), choices: opts(v, [v + 1, v - 1, v + 2, nx * ny, nx * ny * H[0][0]].filter(x => x > 0)), answer: v,
    steps: [`Count each tower from the back: ${H.flat().join(' + ')}.`], explainText: `Altogether there are ${v} cubes.` });
});

function regLines(n) { const out = []; for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + k * Math.PI / n; out.push([50 + 54 * Math.cos(a), 54 + 54 * Math.sin(a), 50 - 54 * Math.cos(a), 54 - 54 * Math.sin(a)]); } return out; }
const SYMS = {
  square: { pts: [[15, 15], [85, 15], [85, 85], [15, 85]], lines: [[50, 4, 50, 96], [4, 50, 96, 50], [8, 8, 92, 92], [92, 8, 8, 92]] },
  rectangle: { pts: [[5, 28], [95, 28], [95, 72], [5, 72]], lines: [[50, 16, 50, 84], [-2, 50, 102, 50]] },
  'equilateral triangle': { pts: polyPts(3), lines: regLines(3) },
  'isosceles triangle': { pts: [[50, 8], [82, 92], [18, 92]], lines: [[50, 0, 50, 100]] },
  'regular pentagon': { pts: polyPts(5), lines: regLines(5) },
  'regular hexagon': { pts: polyPts(6), lines: regLines(6) },
  kite: { pts: [[50, 5], [78, 36], [50, 95], [22, 36]], lines: [[50, -2, 50, 102]] },
  rhombus: { pts: [[50, 5], [78, 50], [50, 95], [22, 50]], lines: [[50, -2, 50, 102], [12, 50, 88, 50]] },
  parallelogram: { pts: [[25, 25], [95, 25], [75, 75], [5, 75]], lines: [] },
  'scalene triangle': { pts: [[10, 85], [90, 85], [30, 20]], lines: [] }
};
function symSVG(name, lines, col = '#B9A6F2') {
  const s = SYMS[name];
  return svgBox('-8 -8 116 116', `<polygon points="${pts2(s.pts)}" fill="${col}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>${lines.map(l => `<line x1="${+l[0].toFixed(1)}" y1="${+l[1].toFixed(1)}" x2="${+l[2].toFixed(1)}" y2="${+l[3].toFixed(1)}" stroke="#F2604F" stroke-width="2.5" stroke-dasharray="6 4"/>`).join('')}`, name);
}
const butterfly = () => svgBox('0 0 120 100', `<path d="M60 50 C40 10 5 10 10 40 C14 60 40 60 60 50 C40 62 20 90 40 92 C52 93 58 75 60 50 Z" fill="#F2604F" stroke="${INK}" stroke-width="2"/><path d="M60 50 C80 10 115 10 110 40 C106 60 80 60 60 50 C80 62 100 90 80 92 C68 93 62 75 60 50 Z" fill="#F2604F" stroke="${INK}" stroke-width="2"/><circle cx="35" cy="35" r="7" fill="#FFC23D"/><circle cx="85" cy="35" r="7" fill="#FFC23D"/><line x1="60" y1="2" x2="60" y2="98" stroke="${INK}" stroke-width="2.5" stroke-dasharray="6 4"/>`, 'butterfly with a line of symmetry');
const V_SYM = 'AHIMOTUVWXY', H_SYM = 'BCDEHIKOX', NO_SYM = 'FGJLNPQRSZ';
S('symmetry', 3, 'Symmetry and reflection', '🦋', [
  ['A line of symmetry cuts a shape into two halves that match, like a butterfly’s wings.', butterfly],
  ['Fold along the line and the halves land exactly on top of each other. A square has 4 lines of symmetry!', () => symSVG('square', SYMS.square.lines)],
  ['When you reflect a point in a mirror line, it lands the same distance away on the other side.', () => gridSVG([[2, 4], [8, 4]], 0, false, `<line x1="50" y1="5" x2="50" y2="95" stroke="#F2604F" stroke-width="1.6" stroke-dasharray="3 2"/>`)]
], L => {
  if (L === 1) {
    const [n, li, yes] = pick([['square', 0, 1], ['square', 2, 1], ['rectangle', 0, 1], ['rectangle', 1, 1], ['isosceles triangle', 0, 1], ['kite', 0, 1], ['rhombus', 1, 1], ['regular hexagon', 0, 1], ['equilateral triangle', 0, 1],
      ['rectangle', [2, 25, 98, 75], 0], ['parallelogram', [50, 15, 50, 85], 0], ['kite', [12, 36, 88, 36], 0], ['scalene triangle', [50, 10, 50, 95], 0], ['isosceles triangle', [8, 60, 92, 60], 0], ['parallelogram', [0, 50, 100, 50], 0]]);
    const line = Array.isArray(li) ? li : SYMS[n].lines[li], a = yes ? 'yes' : 'no';
    return Q({ prompt: 'Is the dashed line a line of symmetry?', speak: `Is the dashed line a line of symmetry of this ${n}?`, visual: symSVG(n, [line]), choices: sOpts(a, ['yes', 'no'], v => v, v => v, 2), answer: a,
      explainText: yes ? `Fold the ${n} along the line: both halves match exactly.` : `If you fold the ${n} along that line, the halves do not match, so it is not a line of symmetry.` });
  }
  if (L === 2) {
    const n = pick(Object.keys(SYMS)), k = SYMS[n].lines.length;
    return Q({ prompt: 'How many lines of symmetry?', speak: `How many lines of symmetry does this ${n} have?`, visual: symSVG(n, []), choices: opts(k, [0, 1, 2, 3, 4, 5, 6].filter(v => v !== k)), answer: k, explain: symSVG(n, SYMS[n].lines),
      explainText: k ? `A ${n} has ${k} line${k > 1 ? 's' : ''} of symmetry.` : `A ${n} has no lines of symmetry: no fold makes the halves match.` });
  }
  if (L === 3) {
    const vert = Math.random() < 0.5, good = vert ? V_SYM : H_SYM, bad = NO_SYM + (vert ? 'BCDEK' : 'AMTUVWY'), a = pick(good);
    return Q({ prompt: `Which letter has a ${vert ? 'vertical (up and down)' : 'horizontal (across)'} line of symmetry?`, choices: sOpts(a, bad.split('')), answer: a,
      explainText: `Draw a line ${vert ? 'down the middle' : 'across the middle'} of ${a}: the two halves match. ${vert ? 'A, H, M, O, T, U, V, W, X and Y' : 'B, C, D, E, H, K, O and X'} all work.` });
  }
  if (L === 4) {
    const vert = Math.random() < 0.5, m = rnd(3, 7), a = rnd(0, 10), b = rnd(1, 9), d = rnd(1, Math.min(m, 10 - m)), p = vert ? [m - d * pick([1, -1]), b] : [a, m - d * pick([1, -1])], r = vert ? [2 * m - p[0], p[1]] : [p[0], 2 * m - p[1]], s = `(${r[0]}, ${r[1]})`;
    const line = vert ? `<line x1="${5 + m * 9}" y1="5" x2="${5 + m * 9}" y2="95" stroke="#F2604F" stroke-width="1.6" stroke-dasharray="3 2"/>` : `<line x1="5" y1="${95 - m * 9}" x2="95" y2="${95 - m * 9}" stroke="#F2604F" stroke-width="1.6" stroke-dasharray="3 2"/>`;
    return Q({ prompt: `Reflect the red dot (${p[0]}, ${p[1]}) in the dashed line ${vert ? 'x' : 'y'} = ${m}. Where does it land?`, visual: gridSVG(p[0], p[1], false, line), choices: sOpts(s, [`(${p[0]}, ${p[1]})`, vert ? `(${r[0]}, ${10 - r[1]})` : `(${10 - r[0]}, ${r[1]})`, `(${r[1]}, ${r[0]})`, vert ? `(${r[0] + 1}, ${r[1]})` : `(${r[0]}, ${r[1] + 1})`, vert ? `(${m + d * 2}, ${r[1]})` : `(${r[0]}, ${m - d * 2})`].filter(v => !v.includes('-'))), answer: s,
      explain: gridSVG([p, r], 0, false, line), explainText: `The dot is ${d} square${d > 1 ? 's' : ''} from the line, so its reflection is ${d} square${d > 1 ? 's' : ''} on the other side: ${s}.` });
  }
  const a = rnd(-5, 5) || 3, b = rnd(-5, 5) || -2, k = pick(['x', 'y', 'yx']);
  if (k === 'yx' && a === b) return MATH.symmetry.gen(L);
  const r = k === 'x' ? [a, -b] : k === 'y' ? [-a, b] : [b, a], s = `(${r[0]}, ${r[1]})`, ln = k === 'x' ? 'the x axis' : k === 'y' ? 'the y axis' : 'the line y = x';
  const extra = k === 'yx' ? `<line x1="5" y1="95" x2="95" y2="5" stroke="#F2604F" stroke-width="1.4" stroke-dasharray="3 2"/>` : k === 'x' ? `<line x1="5" y1="50" x2="95" y2="50" stroke="#F2604F" stroke-width="1.4" stroke-dasharray="3 2"/>` : `<line x1="50" y1="5" x2="50" y2="95" stroke="#F2604F" stroke-width="1.4" stroke-dasharray="3 2"/>`;
  return Q({ prompt: `Reflect (${a}, ${b}) in ${ln}.`, speak: `Reflect the point ${a}, ${b} in ${ln}. Where does it land?`, visual: gridSVG(a, b, true, extra), choices: sOpts(s, [`(${-a}, ${-b})`, `(${a}, ${-b})`, `(${-a}, ${b})`, `(${b}, ${a})`, `(${-b}, ${-a})`]), answer: s,
    explain: gridSVG([[a, b], r], 0, true, extra), explainText: k === 'x' ? `Reflecting in the x axis flips up and down: the y number changes sign. ${s}.` : k === 'y' ? `Reflecting in the y axis flips left and right: the x number changes sign. ${s}.` : `Reflecting in y = x swaps the two numbers: ${s}.` });
});

const pad2 = n => String(n).padStart(2, '0');
const f24 = t => { t = ((t % 1440) + 1440) % 1440; return `${pad2(Math.floor(t / 60))}:${pad2(t % 60)}`; };
const f12 = t => { t = ((t % 1440) + 1440) % 1440; const H = Math.floor(t / 60); return `${H % 12 || 12}:${pad2(t % 60)} ${H < 12 ? 'am' : 'pm'}`; };
const digi = s => `<span class="digi">${s}</span>`;
const hm = d => `${Math.floor(d / 60) ? Math.floor(d / 60) + ' h ' : ''}${d % 60 ? d % 60 + ' min' : ''}`.trim();
const hmSay = d => hm(d).replace('h', 'hours').replace('min', 'minutes');
S('clock24', 3, '24-hour clock', '🕰️', [
  ['The 24-hour clock keeps counting after noon: 1 pm is 13:00, 2 pm is 14:00, all the way to 23:59.', () => `<div class="row">${digi('1:00 pm')}<span class="op">→</span>${digi('13:00')}</div>`],
  ['For pm times add 12 to the hour: 7:30 pm → 19:30. Morning times keep their hour with a 0 in front: 7:30 am → 07:30.', () => `<div class="row">${digi('7:30 pm')}<span class="op">→</span>${digi('19:30')}</div>`],
  ['Midnight is 00:00 and noon is 12:00.', () => `<div class="row">${digi('00:00')}${digi('12:00')}</div>`]
], L => {
  if (L <= 3) {
    const t = L === 3 && Math.random() < 0.35 ? pick([0, 12]) * 60 + rnd(0, 11) * 5 : L === 3 ? rnd(0, 287) * 5 : rnd(13, 23) * 60 + (L === 1 ? 0 : rnd(0, 11) * 5), to24 = L === 1 || (L === 3 && Math.random() < 0.5);
    const H = Math.floor(t / 60), m = t % 60;
    if (to24) { const a = f24(t); return Q({ prompt: `Write ${f12(t)} in 24-hour time`, speak: `What is ${f12(t)} in 24 hour time?`, visual: digi(f12(t)), choices: sOpts(a, [f24(t + 720), f24(t + 60), f24(t - 60), `${H % 12 || 12}:${pad2(m)}`, f24(t + 600)]), answer: a, explainText: H >= 12 ? `It is pm, so add 12 to the hour: ${H % 12 || 12}${H === 12 ? ' (noon stays 12)' : ` + 12 = ${H}`}. ${a}.` : `It is am${H === 0 ? ' and the hour after midnight is 00' : ', so keep the hour'}: ${a}.` }); }
    const a = f12(t);
    return Q({ prompt: `What is ${f24(t)} on a 12-hour clock?`, visual: digi(f24(t)), choices: sOpts(a, [f12(t + 720), f12(t + 120), f12(t - 120), f12(t + 60), ...(H >= 11 ? [`${H - 10}:${pad2(m)} ${H < 12 ? 'am' : 'pm'}`] : [])].filter(v => v !== a)), answer: a,
      explainText: H >= 13 ? `The hour is more than 12, so take away 12: ${H} − 12 = ${H - 12}. It is ${a}.` : H === 12 ? `12:xx is just after noon: ${a}.` : H === 0 ? `00:xx is just after midnight: ${a}.` : `It is before noon, so it is am: ${a}.` });
  }
  if (L === 4) {
    const t = rnd(72, 240) * 5, d = rnd(3, 30) * 5, a = hm(d), mode = pick(['Bus', 'Train', 'Ferry', 'Tram']);
    const visual = `<table class="m3tab"><tr><th>${mode}</th><th>Leaves</th><th>Arrives</th></tr><tr><td>🚌</td><td>${f24(t)}</td><td>${f24(t + d)}</td></tr></table>`.replace('🚌', { Bus: '🚌', Train: '🚆', Ferry: '⛴️', Tram: '🚋' }[mode]);
    return Q({ prompt: `How long is the ${mode.toLowerCase()} journey?`, speak: `The ${mode.toLowerCase()} leaves at ${f24(t)} and arrives at ${f24(t + d)}. How long is the journey?`, visual, choices: sOpts(a, [d + 5, d - 5, d + 10, d + 40, d - 40, d + 60].filter(v => v > 0).map(hm), v => v.replace(" h", " hours").replace("min", "minutes")), answer: a,
      steps: [`From ${f24(t)} to ${f24(t - t % 60 + 60)} is ${60 - t % 60} minutes.`, `Then count on to ${f24(t + d)}.`], explainText: `The journey takes ${hmSay(d)}.` });
  }
  if (Math.random() < 0.5) {
    const t = rnd(252, 287) * 5, d = rnd(16, 60) * 5, a = hm(d);
    return Q({ prompt: word(`A night train leaves at ${f24(t)} and arrives at ${f24(t + d)} the next morning. How long is the trip?`), visual: `<div class="row">${digi(f24(t))}<span class="op">→</span>${digi(f24(t + d))}</div>`, choices: sOpts(a, [d + 60, d - 60, d + 30, d + 15, 1440 - d].filter(v => v > 0 && v < 1440).map(hm), v => v.replace(" h", " hours").replace("min", "minutes")), answer: a,
      steps: [`From ${f24(t)} to midnight (00:00) is ${hmSay(1440 - t)}.`, `From 00:00 to ${f24(t + d)} is ${hmSay((t + d) % 1440) || '0 minutes'}.`, 'Add them together.'], explainText: `The trip takes ${hmSay(d)}.` });
  }
  const [c1, c2, off] = pick([['London', 'New York', -5], ['London', 'Tokyo', 9], ['Paris', 'Dubai', 3], ['Sydney', 'London', -10], ['Los Angeles', 'London', 8], ['Delhi', 'Beijing', 2.5], ['Cairo', 'Rio', -5]]), t = rnd(0, 47) * 30, a = f24(t + off * 60);
  return Q({ prompt: word(`It is ${f24(t)} in ${c1}. ${c2} is ${Math.abs(off)} hours ${off > 0 ? 'ahead' : 'behind'}. What time is it in ${c2}?`), visual: digi(f24(t)), choices: sOpts(a, [f24(t - off * 60), f24(t + off * 60 + 60), f24(t + off * 60 - 60), f24(t + off * 60 + 720)]), answer: a,
    explainText: `${off > 0 ? 'Ahead means later: add' : 'Behind means earlier: take away'} ${Math.abs(off)} hours. ${f24(t)} ${off > 0 ? '+' : '−'} ${Math.abs(off)} h = ${a}${Math.floor((t + off * 60) / 1440) !== 0 || t + off * 60 < 0 ? ` (on the ${t + off * 60 < 0 ? 'day before' : 'next day'})` : ''}.` });
});

function triSVG(b, h, off, lb, lh, o = {}) {
  const k = Math.min(200 / b, 110 / h), B = b * k, H = h * k, x0 = 16, y0 = H + 16, ax = x0 + off * B;
  let g = '';
  if (o.rect) g += `<rect x="${x0}" y="16" width="${B}" height="${H}" fill="none" stroke="#9FB3C8" stroke-width="2" stroke-dasharray="5 4"/>`;
  g += `<polygon points="${pts2([[x0, y0], [x0 + B, y0], [ax, 16]])}" fill="#FFD98A" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
  g += `<line x1="${+ax.toFixed(1)}" y1="16" x2="${+ax.toFixed(1)}" y2="${y0}" stroke="#F2604F" stroke-width="2" stroke-dasharray="5 4"/><path d="M${+(ax + (off > 0.9 ? -10 : 10)).toFixed(1)} ${y0} V${y0 - 10} H${+ax.toFixed(1)}" fill="none" stroke="#F2604F" stroke-width="1.6"/>`;
  g += tx(x0 + B / 2, y0 + 18, lb, { size: 13 }) + tx(ax + (off > 0.9 ? -6 : 6), 16 + H / 2 + 4, lh, { size: 13, anchor: off > 0.9 ? 'end' : 'start', fill: '#F2604F' });
  return svgBox(`0 0 ${B + 32} ${H + 42}`, g, 'triangle with base and height', true);
}
function paraSVG(b, h, off, lb, lh, ls) {
  const k = Math.min(170 / (b + off), 100 / h), B = b * k, H = h * k, O = off * k, x0 = 14, y0 = H + 14;
  return svgBox(`0 0 ${B + O + 48} ${H + 40}`, `<polygon points="${pts2([[x0, y0], [x0 + B, y0], [x0 + B + O, 14], [x0 + O, 14]])}" fill="#A8E0C2" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><line x1="${x0 + O}" y1="14" x2="${x0 + O}" y2="${y0}" stroke="#F2604F" stroke-width="2" stroke-dasharray="5 4"/><path d="M${x0 + O + 10} ${y0} V${y0 - 10} H${x0 + O}" fill="none" stroke="#F2604F" stroke-width="1.6"/>`
    + tx(x0 + B / 2, y0 + 18, lb, { size: 13 }) + tx(x0 + O + 6, 14 + H / 2 + 4, lh, { size: 13, anchor: 'start', fill: '#F2604F' }) + (ls ? tx(x0 + B + O / 2 + 8, 14 + H / 2 + 4, ls, { size: 13, anchor: 'start' }) : ''), 'parallelogram', true);
}
function trapSVG(a, b, h, la, lb, lh) {
  const k = Math.min(200 / b, 100 / h), A = a * k, B = b * k, H = h * k, x0 = 14, y0 = H + 22, s = (B - A) / 2;
  return svgBox(`0 0 ${B + 30} ${H + 46}`, `<polygon points="${pts2([[x0, y0], [x0 + B, y0], [x0 + s + A, 22], [x0 + s, 22]])}" fill="#9CC9F2" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><line x1="${x0 + s + A / 2}" y1="22" x2="${x0 + s + A / 2}" y2="${y0}" stroke="#F2604F" stroke-width="2" stroke-dasharray="5 4"/>`
    + tx(x0 + s + A / 2, 16, la, { size: 13 }) + tx(x0 + B / 2, y0 + 18, lb, { size: 13 }) + tx(x0 + s + A / 2 + 6, 22 + H / 2 + 4, lh, { size: 13, anchor: 'start', fill: '#F2604F' }), 'trapezium', true);
}
function houseSVG(w, h1, h2) {
  const k = Math.min(150 / w, 120 / (h1 + h2)), W = w * k, H1 = h1 * k, H2 = h2 * k, x0 = 30, yR = 12 + H2, yB = yR + H1;
  return svgBox(`0 0 ${W + 80} ${yB + 28}`, `<rect x="${x0}" y="${yR}" width="${W}" height="${H1}" fill="#9CC9F2" stroke="${INK}" stroke-width="2.5"/><polygon points="${pts2([[x0, yR], [x0 + W, yR], [x0 + W / 2, 12]])}" fill="#F7B9AE" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><line x1="${x0 + W / 2}" y1="12" x2="${x0 + W / 2}" y2="${yR}" stroke="#F2604F" stroke-width="2" stroke-dasharray="4 3"/>`
    + tx(x0 + W / 2, yB + 18, `${w} m`, { size: 13 }) + tx(x0 + W + 6, yR + H1 / 2 + 4, `${h1} m`, { size: 13, anchor: 'start' }) + tx(x0 + W / 2 + 5, 12 + H2 / 2 + 6, `${h2} m`, { size: 12, anchor: 'start', fill: '#F2604F' }), 'house shape', true);
}
function gridTri(w, h) {
  const s = Math.min(22, 200 / w, 150 / h); let g = '';
  for (let i = 0; i <= w; i++) g += `<line x1="${10 + i * s}" y1="10" x2="${10 + i * s}" y2="${10 + h * s}" stroke="#CCDBE6" stroke-width="1"/>`;
  for (let j = 0; j <= h; j++) g += `<line x1="10" y1="${10 + j * s}" x2="${10 + w * s}" y2="${10 + j * s}" stroke="#CCDBE6" stroke-width="1"/>`;
  g += `<rect x="10" y="10" width="${w * s}" height="${h * s}" fill="none" stroke="#9FB3C8" stroke-width="2" stroke-dasharray="5 4"/><polygon points="${pts2([[10, 10], [10, 10 + h * s], [10 + w * s, 10 + h * s]])}" fill="#FFD98A" fill-opacity=".85" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
  return svgBox(`0 0 ${w * s + 20} ${h * s + 20}`, g, 'triangle on squared paper', w > 6);
}
S('shapearea', 3, 'Area of triangles and more', '🔺', [
  ['A triangle is exactly half of a rectangle. Area = base × height ÷ 2.', () => triSVG(8, 5, 0.6, 'base 8', 'height 5', { rect: true })],
  ['The height goes straight up from the base, at a right angle (the little square).', () => triSVG(8, 5, 0.3, 'base', 'height')],
  ['A parallelogram is a rectangle with a slice moved across, so area = base × height.', () => paraSVG(8, 4, 3, '8 cm', '4 cm')]
], L => {
  const u = v => `${v} cm²`, us = v => `${v} square centimetres`;
  if (L === 1) {
    let w = rnd(2, 8), h = rnd(2, 6); if (w * h % 2) w++;
    const a = w * h / 2;
    return Q({ prompt: 'What is the area of the yellow triangle?', speak: 'The triangle is half of the dashed rectangle. What is its area in squares?', visual: gridTri(w, h), choices: opts(a, [w * h, a + 1, a - 1, w + h, a + w].filter(v => v > 0)), answer: a,
      steps: [`The rectangle is ${w} × ${h} = ${w * h} squares.`, `The triangle is half of it: ${w * h} ÷ 2 = ${a}.`], explainText: `The triangle covers ${a} squares.` });
  }
  if (L === 2) {
    const b = rnd(2, 10) * 2, h = rnd(3, 12), a = b * h / 2;
    return Q({ prompt: 'What is the area of the triangle?', speak: `The base is ${b} centimetres and the height is ${h} centimetres. What is the area?`, visual: triSVG(b, h, pick([0.25, 0.4, 0.6, 0.75]), `${b} cm`, `${h} cm`), choices: opts(a, [b * h, b + h, a + h, 2 * (b + h), a - b].filter(v => v > 0), 4, u, us), answer: a,
      steps: [`Base × height: ${b} × ${h} = ${b * h}.`, `Halve it: ${b * h} ÷ 2 = ${a}.`], explainText: `The area is ${a} cm².` });
  }
  if (L === 3) {
    const [h, off, sl] = pick([[4, 3, 5], [3, 4, 5], [8, 6, 10], [6, 8, 10], [12, 5, 13], [5, 12, 13], [12, 9, 15]]), b = rnd(Math.max(off + 1, 6), 18), a = b * h;
    return Q({ prompt: 'What is the area of the parallelogram?', speak: `The base is ${b}, the sloping side is ${sl} and the height is ${h} centimetres. What is the area?`, visual: paraSVG(b, h, off, `${b} cm`, `${h} cm`, `${sl} cm`), choices: opts(a, [b * sl, a / 2, 2 * (b + sl), b + h, a + b].filter(v => v > 0 && Number.isInteger(v)), 4, u, us), answer: a,
      explainText: `Use the height (the dashed line), not the sloping side: ${b} × ${h} = ${a} cm².` });
  }
  if (L === 4) {
    const a = rnd(3, 10), b = a + rnd(2, 10), h = (a + b) % 2 ? rnd(1, 6) * 2 : rnd(3, 12), A = (a + b) * h / 2;
    return Q({ prompt: 'What is the area of the trapezium?', speak: `The parallel sides are ${a} and ${b} centimetres. The height is ${h}. What is the area?`, visual: trapSVG(a, b, h, `${a} cm`, `${b} cm`, `${h} cm`), choices: opts(A, [(a + b) * h, a * b, b * h, a * h, A + h].filter(v => v !== A), 4, u, us), answer: A,
      steps: [`Add the parallel sides: ${a} + ${b} = ${a + b}.`, `Halve it: ${(a + b) / 2}.`, `× height: ${(a + b) / 2} × ${h} = ${A}.`], explainText: `The area is ${A} cm².` });
  }
  if (Math.random() < 0.5) {
    const b = rnd(2, 10) * 2, h = rnd(2, 12), A = b * h / 2;
    return Q({ prompt: word(`A triangle has an area of ${A} cm² and a base of ${b} cm. How tall is it?`), visual: triSVG(b, h, 0.4, `${b} cm`, '?'), choices: opts(h, [A / b, A - b, h + 1, h - 1, 2 * h].filter(v => v > 0 && Number.isInteger(v) && v !== h), 4, v => `${v} cm`, v => `${v} centimetres`), answer: h,
      steps: [`Area = base × height ÷ 2, so base × height = ${A} × 2 = ${2 * A}.`, `${2 * A} ÷ ${b} = ${h}.`], explainText: `The height is ${h} cm.` });
  }
  const w = rnd(2, 6) * 2, h1 = rnd(3, 8), h2 = rnd(2, 6), A = w * h1 + w * h2 / 2;
  return Q({ prompt: 'What is the area of the house shape?', speak: `A rectangle ${w} by ${h1} metres, with a triangle roof ${h2} metres tall on top. What is the total area?`, visual: houseSVG(w, h1, h2), choices: opts(A, [w * h1 + w * h2, w * (h1 + h2), w * h1, A + w].filter(v => v !== A), 4, v => `${v} m²`, v => `${v} square metres`), answer: A,
    steps: [`Rectangle: ${w} × ${h1} = ${w * h1}.`, `Roof triangle: ${w} × ${h2} ÷ 2 = ${w * h2 / 2}.`, `Add: ${w * h1} + ${w * h2 / 2} = ${A}.`], explainText: `The area is ${A} m².` });
});

// Shape pictures with marks: dashes for equal sides, arrows for parallel sides, squares for right angles.
const QUADS = {
  'equilateral triangle': { pts: polyPts(3), t: [1, 1, 1] },
  'isosceles triangle': { pts: [[50, 8], [80, 92], [20, 92]], t: [1, 0, 1] },
  'scalene triangle': { pts: [[8, 90], [92, 90], [30, 20]], t: [1, 2, 3] },
  square: { pts: [[18, 18], [82, 18], [82, 82], [18, 82]], t: [1, 1, 1, 1], r: [0, 1, 2, 3] },
  rectangle: { pts: [[4, 28], [96, 28], [96, 72], [4, 72]], t: [1, 2, 1, 2], r: [0, 1, 2, 3] },
  rhombus: { pts: [[50, 4], [80, 50], [50, 96], [20, 50]], t: [1, 1, 1, 1] },
  parallelogram: { pts: [[28, 25], [96, 25], [72, 75], [4, 75]], t: [1, 2, 1, 2], a: [1, 2, 1, 2] },
  trapezium: { pts: [[30, 25], [72, 25], [96, 75], [4, 75]], a: [1, 0, 1, 0] },
  kite: { pts: [[50, 5], [78, 36], [50, 95], [22, 36]], t: [1, 2, 2, 1] }
};
function quadSVG(name, rot = 0, angles) {
  const s = QUADS[name], P = s.pts, n = P.length; let g = `<polygon points="${pts2(P)}" fill="#B9A6F2" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
  P.forEach((p, i) => {
    const q = P[(i + 1) % n], ex = q[0] - p[0], ey = q[1] - p[1], L = Math.hypot(ex, ey), ux = ex / L, uy = ey / L, nx = -uy, ny = ux, mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
    const tk = s.t ? s.t[i] : 0; for (let j = 0; j < tk; j++) { const o = (j - (tk - 1) / 2) * 4; g += `<line x1="${+(mx + ux * o + nx * 5).toFixed(1)}" y1="${+(my + uy * o + ny * 5).toFixed(1)}" x2="${+(mx + ux * o - nx * 5).toFixed(1)}" y2="${+(my + uy * o - ny * 5).toFixed(1)}" stroke="${INK}" stroke-width="2"/>`; }
    const ar = s.a ? s.a[i] : 0; for (let j = 0; j < ar; j++) { const o = (j - (ar - 1) / 2) * 6 + (tk ? 9 : 0); g += `<path d="M${+(mx + ux * (o - 4) + nx * 4).toFixed(1)} ${+(my + uy * (o - 4) + ny * 4).toFixed(1)} L${+(mx + ux * o).toFixed(1)} ${+(my + uy * o).toFixed(1)} L${+(mx + ux * (o - 4) - nx * 4).toFixed(1)} ${+(my + uy * (o - 4) - ny * 4).toFixed(1)}" fill="none" stroke="${INK}" stroke-width="2"/>`; }
  });
  (s.r || []).forEach(i => { const p = P[i], a = P[(i + 1) % n], b = P[(i + n - 1) % n], u = (q) => { const L = Math.hypot(q[0] - p[0], q[1] - p[1]); return [(q[0] - p[0]) / L * 9, (q[1] - p[1]) / L * 9]; }, [ax, ay] = u(a), [bx, by] = u(b); g += `<path d="M${p[0] + ax} ${p[1] + ay} L${p[0] + ax + bx} ${p[1] + ay + by} L${p[0] + bx} ${p[1] + by}" fill="none" stroke="${INK}" stroke-width="1.6"/>`; });
  if (angles) angles.forEach(([i, lab]) => { const p = P[i], cx = P.reduce((a, q) => a + q[0], 0) / n, cy = P.reduce((a, q) => a + q[1], 0) / n, dx = cx - p[0], dy = cy - p[1], d = Math.hypot(dx, dy); g += tx(p[0] + dx / d * 20, p[1] + dy / d * 20 + 4, lab, { size: 11, fill: '#F2604F' }); });
  return svgBox('-12 -12 124 124', rot ? `<g transform="rotate(${rot} 50 50)">${g}</g>` : g, name);
}
const QPROPS = [['exactly one pair of parallel sides', 'trapezium', []], ['4 equal sides but no right angles', 'rhombus', ['square']], ['two pairs of equal sides that sit next to each other', 'kite', ['rhombus', 'square']], ['4 right angles, but its sides are not all equal', 'rectangle', []], ['4 equal sides and 4 right angles', 'square', []], ['two pairs of parallel sides, no right angles and not all sides equal', 'parallelogram', []]];
const QTRUE = ['Every square is a rectangle', 'Every square is a rhombus', 'Every rhombus is a parallelogram', 'Every rectangle is a parallelogram', 'A square has 4 lines of symmetry', 'An equilateral triangle has 3 equal angles'];
const QFALSE = ['Every rectangle is a square', 'Every rhombus is a square', 'Every parallelogram is a rectangle', 'A trapezium has 2 pairs of parallel sides', 'Every kite is a rhombus', 'A rectangle has 4 lines of symmetry', 'A triangle can have 2 right angles', 'Every quadrilateral has a right angle'];
S('quads', 3, 'Triangles and quadrilaterals', '🔷', [
  ['Little dashes mean equal sides. Equilateral: 3 equal sides. Isosceles: 2 equal. Scalene: none equal.', () => `<div class="row m3three">${quadSVG('equilateral triangle')}${quadSVG('isosceles triangle')}${quadSVG('scalene triangle')}</div>`],
  ['Arrows mean parallel: the sides go the same way and never meet. A parallelogram has 2 pairs; a trapezium has 1.', () => `<div class="row">${quadSVG('parallelogram')}${quadSVG('trapezium')}</div>`],
  ['A little square in a corner means a right angle (90°). Squares and rectangles have 4.', () => `<div class="row">${quadSVG('square')}${quadSVG('rectangle')}</div>`]
], L => {
  const rot = pick([0, 0, 15, -20, 90, 180]);
  if (L === 1) { const n = pick(['equilateral triangle', 'isosceles triangle', 'scalene triangle']), w = n.split(' ')[0]; return Q({ prompt: 'What kind of triangle is this?', speak: 'Look at the little marks. What kind of triangle is this?', visual: quadSVG(n, rot), choices: sOpts(w, ['equilateral', 'isosceles', 'scalene']), answer: w, explainText: { equilateral: 'All 3 sides have the same mark, so all are equal: equilateral.', isosceles: 'Two sides have the same mark, so 2 sides are equal: isosceles.', scalene: 'Every side has a different mark, so no sides are equal: scalene.' }[w] }); }
  const quads = ['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezium', 'kite'];
  if (L === 2) { const n = pick(quads); return Q({ prompt: 'What is this shape called?', speak: 'Look at the marks for equal sides, parallel sides and right angles. What is this shape?', visual: quadSVG(n, rot), choices: sOpts(n, quads.filter(x => x !== n)), answer: n, explainText: { square: '4 equal sides and 4 right angles: a square.', rectangle: '4 right angles, with opposite sides equal: a rectangle.', rhombus: '4 equal sides but no right angles: a rhombus.', parallelogram: 'Two pairs of parallel sides (the arrows) and no right angles: a parallelogram.', trapezium: 'Exactly one pair of parallel sides: a trapezium.', kite: 'Two pairs of equal sides next to each other: a kite.' }[n] }); }
  if (L === 3) { const [d, n, ex] = pick(QPROPS); return Q({ prompt: `Which shape has ${d}?`, choices: sOpts(n, quads.filter(x => x !== n && !ex.includes(x))), answer: n, explain: quadSVG(n), explainText: `A ${n} has ${d}.` }); }
  if (L === 4) {
    if (Math.random() < 0.5) {
      const apex = rnd(10, 70) * 2, base = (180 - apex) / 2, askBase = Math.random() < 0.5, ans = askBase ? base : apex;
      return Q({ prompt: askBase ? `An isosceles triangle has a top angle of ${apex}°. What is each bottom angle?` : `An isosceles triangle has two bottom angles of ${base}°. What is the top angle?`, visual: quadSVG('isosceles triangle', 0, askBase ? [[0, apex + '°'], [1, '?'], [2, '?']] : [[0, '?'], [1, base + '°'], [2, base + '°']]), choices: opts(ans, [180 - ans, ans + 10, ans - 10, 180 - 2 * ans, 90 - ans].filter(v => v > 0 && v !== ans), 4, v => v + '°', v => v + ' degrees'), answer: ans,
        steps: askBase ? [`Angles in a triangle add to 180°. 180 − ${apex} = ${180 - apex}.`, `The two bottom angles are equal: ${180 - apex} ÷ 2 = ${base}°.`] : [`The bottom angles add to ${base} + ${base} = ${2 * base}.`, `180 − ${2 * base} = ${apex}°.`], explainText: `The answer is ${ans}°.` });
    }
    const a = rnd(11, 34) * 5, nextTo = Math.random() < 0.5, ans = nextTo ? 180 - a : a, [v0, vOpp, vAdj] = a < 90 ? [3, 1, 2] : [0, 2, 1];
    if (a === 90) return MATH.quads.gen(L);
    return Q({ prompt: `One angle of a parallelogram is ${a}°. What is the angle marked ?`, visual: quadSVG('parallelogram', 0, [[v0, a + '°'], [nextTo ? vAdj : vOpp, '?']]), choices: opts(ans, [180 - ans, 360 - a, 90, ans + 10, ans - 10].filter(v => v > 0 && v !== ans), 4, v => v + '°', v => v + ' degrees'), answer: ans,
      explainText: nextTo ? `Angles next to each other in a parallelogram add to 180°: 180 − ${a} = ${ans}°.` : `Opposite angles in a parallelogram are equal: ${ans}°.` });
  }
  const t = pick(QTRUE);
  return Q({ prompt: 'Which one is true?', choices: opts(t, QFALSE, 4, longTxt, v => v), answer: t,
    explainText: `${t}. ${t.includes('square is a') ? 'A square has everything a ' + t.split(' ').at(-1) + ' needs.' : t.includes('rhombus is a parallelogram') ? 'A rhombus has two pairs of parallel sides.' : t.includes('rectangle is a parallelogram') ? 'A rectangle has two pairs of parallel sides.' : ''}`.trim() });
});

function pieChartSVG(slices, showDeg) {
  let a = -90, g = '';
  for (const s of slices) {
    const a0 = a * Math.PI / 180, a1 = (a + s.deg) * Math.PI / 180, mid = (a + s.deg / 2) * Math.PI / 180, big = s.deg > 180 ? 1 : 0;
    g += `<path d="M50 50 L${+(50 + 44 * Math.cos(a0)).toFixed(2)} ${+(50 + 44 * Math.sin(a0)).toFixed(2)} A44 44 0 ${big} 1 ${+(50 + 44 * Math.cos(a1)).toFixed(2)} ${+(50 + 44 * Math.sin(a1)).toFixed(2)} Z" fill="${s.col}" stroke="#fff" stroke-width="1.5"/>`;
    const r = s.deg >= 90 ? 25 : 30, lx = 50 + r * Math.cos(mid), ly = 50 + r * Math.sin(mid);
    g += `<text x="${+lx.toFixed(1)}" y="${+(ly + (showDeg ? 0 : 4)).toFixed(1)}" font-size="${s.deg >= 60 ? 12 : 9}" text-anchor="middle">${s.lab}</text>`;
    if (showDeg) g += tx(lx, ly + 11, s.deg + '°', { size: 8, fill: INK });
    a += s.deg;
  }
  return `<div class="shape"><svg viewBox="2 2 96 96" role="img" aria-label="pie chart">${g}<circle cx="50" cy="50" r="44" fill="none" stroke="${INK}" stroke-width="2"/></svg></div>`;
}
const PIE_COLS = ['#F7B9AE', '#9CC9F2', '#A8E0C2', '#FFD98A', '#B9A6F2'];
const partition = (total, n, min = 1, distinct = false) => { let p, g = 0; do { p = Array.from({ length: n }, () => min); let left = total - n * min; while (left-- > 0) p[rnd(0, n - 1)]++; } while (distinct && new Set(p).size < n && g++ < 500); return shuffle(p); };
function lineGraphSVG(labels, vals, lo, hi, step, unit, labStep = step) {
  const X = i => 36 + i * (248 / (labels.length - 1)), Y = v => 150 - (v - lo) / (hi - lo) * 136; let g = '';
  for (let v = lo; v <= hi; v += step) g += `<line x1="36" y1="${Y(v)}" x2="288" y2="${Y(v)}" stroke="#CCDBE6" stroke-width="1"/>${v % labStep ? '' : tx(30, Y(v) + 4, v, { size: 10, anchor: 'end', fill: '#5A678C' })}`;
  labels.forEach((l, i) => g += `<line x1="${X(i)}" y1="14" x2="${X(i)}" y2="150" stroke="#E4EDF3" stroke-width="1"/>${tx(X(i), 166, l, { size: 10, fill: '#5A678C' })}`);
  g += `<polyline points="${vals.map((v, i) => `${X(i)},${Y(v)}`).join(' ')}" fill="none" stroke="#F2604F" stroke-width="2.5" stroke-linejoin="round"/>${vals.map((v, i) => `<circle cx="${X(i)}" cy="${Y(v)}" r="3.5" fill="#F2604F"/>`).join('')}${tx(6, 8, unit, { size: 10, anchor: 'start', fill: '#5A678C' })}`;
  return svgBox('0 0 296 174', g, 'line graph', true);
}
S('piechart', 3, 'Pie charts and line graphs', '🥧', [
  ['A pie chart shows the parts of a whole. The bigger the slice, the more people chose it.', () => pieChartSVG([{ deg: 180, col: PIE_COLS[0], lab: '🍕' }, { deg: 90, col: PIE_COLS[1], lab: '🌮' }, { deg: 90, col: PIE_COLS[2], lab: '🍝' }])],
  ['Half the circle is half the people. If 40 children were asked, half of 40 = 20 chose pizza.', () => `<span class="expr">${frac(1, 2)} of 40 = 20</span>`],
  ['A line graph shows how something changes, like the temperature during a day.', () => lineGraphSVG(['9am', '11am', '1pm', '3pm', '5pm'], [8, 14, 18, 16, 10], 0, 20, 4, '°C')]
], L => {
  const set = pick([CHART_SETS.slice(0, 4), CHART_SETS.slice(4, 8), CHART_SETS.slice(8)]);
  if (L <= 3 || L === 5) {
    const n = L === 1 ? 3 : pick([3, 4]), den = L === 5 ? 12 : 8, parts = partition(den, n, L === 5 ? 2 : 1, L === 1), items = set.slice(0, n).map((s, i) => ({ deg: parts[i] * 360 / den, col: PIE_COLS[i], lab: s[0], name: s[1], part: parts[i] }));
    const vis = pieChartSVG(items, L === 5);
    if (L === 1) { const best = [...items].sort((a, b) => b.part - a.part)[0]; return Q({ prompt: 'Which was chosen the most?', speak: 'Look at the pie chart. Which was chosen the most?', visual: vis, choices: items.map(it => ({ html: it.lab, val: it.lab, say: it.name })), answer: best.lab, explainText: `The ${best.name} slice is the biggest.` }); }
    const it = pick(items), [nn, dd] = [it.part / gcd(it.part, den), den / gcd(it.part, den)], fs = `${nn}/${dd}`;
    if (L === 2) return Q({ prompt: `What fraction chose ${it.lab}?`, speak: `What fraction of the pie is ${it.name}?`, visual: vis, choices: opts(fs, ['1/2', '1/4', '1/8', '3/8', '3/4', '5/8', '1/3'].filter(v => v !== fs), 4, v => frac(...v.split('/')), v => fracSay(...v.split('/'))), answer: fs,
      explainText: `The pie is like ${den} equal slices. ${it.name} has ${it.part} of them: ${it.part}/${den}${it.part / den === nn / dd && dd !== den ? ` = ${fs}` : ''}.` });
    const N = L === 3 ? pick([16, 24, 32, 40, 80]) : pick([24, 36, 48, 60, 72, 120]), ans = N * it.part / den;
    return Q({ prompt: `${N} people were asked. How many chose ${it.lab}?`, speak: `${N} people were asked. How many chose ${it.name}?`, visual: vis, choices: opts(ans, [it.part, ans + N / den, ans - N / den, N / den, L === 5 ? it.deg : N - ans].filter(v => v > 0 && v !== ans)), answer: ans,
      steps: L === 5 ? [`The ${it.name} slice is ${it.deg}° out of 360°.`, `${it.deg} ÷ 360 = ${frac(nn, dd)}.`, `${frac(nn, dd)} of ${N} = ${N} ÷ ${dd} × ${nn} = ${ans}.`] : [`The slice is ${frac(nn, dd)} of the pie.`, `${N} ÷ ${dd} = ${N / dd}, × ${nn} = ${ans}.`], explainText: `${ans} people chose ${it.name}.` });
  }
  const labels = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm'], peak = rnd(2, 5), base = rnd(2, 8), vals = labels.map((_, i) => 2 * (base + (i <= peak ? i * rnd(1, 2) : 0)));
  for (let i = peak + 1; i < 7; i++) vals[i] = Math.max(2, vals[i - 1] - 2 * rnd(0, 2));
  for (let i = 1; i <= peak; i++) vals[i] = Math.max(vals[i], vals[i - 1] + 2);
  const hi = Math.ceil((Math.max(...vals) + 1) / 4) * 4, vis = lineGraphSVG(labels, vals, 0, hi, 2, '°C', 4), k = pick(['read', 'rise', 'warm']);
  if (k === 'read') { const i = rnd(0, 6); return Q({ prompt: `What was the temperature at ${labels[i]}?`, visual: vis, choices: opts(vals[i], [vals[i] + 2, vals[i] - 2, vals[i] + 1, vals[i] + 4].filter(v => v >= 0), 4, v => v + '°C', v => v + ' degrees'), answer: vals[i], explainText: `Find ${labels[i]} along the bottom, go up to the line, then across to the side: ${vals[i]}°C.` }); }
  if (k === 'rise') { const i = rnd(0, peak - 1), j = peak, d = vals[j] - vals[i]; return Q({ prompt: `How much warmer was it at ${labels[j]} than at ${labels[i]}?`, visual: vis, choices: opts(d, [d + 2, d - 2, vals[j], vals[i], d + 1].filter(v => v >= 0), 4, v => v + '°C', v => v + ' degrees'), answer: d, explainText: `${labels[j]}: ${vals[j]}°C. ${labels[i]}: ${vals[i]}°C. ${vals[j]} − ${vals[i]} = ${d}°C.` }); }
  const mx = Math.max(...vals), at = labels[vals.indexOf(mx)];
  if (vals.filter(v => v === mx).length > 1) return MATH.piechart.gen(L);
  return Q({ prompt: 'At what time was it warmest?', visual: vis, choices: sOpts(at, labels.filter(l => l !== at)), answer: at, explainText: `The highest point on the line is at ${at}: ${mx}°C.` });
});

/* ===================== Mountain Peak (world index 4) ===================== */
const term = (c, v, first) => { const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); return first ? (c < 0 ? '−' : '') + body : (c < 0 ? ' − ' : ' + ') + body; };
const polyStr = ts => { const t = ts.filter(([c]) => c !== 0); return t.length ? t.map(([c, v], i) => term(c, v, i === 0)).join('') : '0'; };
const brk = a => `(x ${a < 0 ? '−' : '+'} ${Math.abs(a)})`;
const algSay = s => s.replace(/\)\(/g, ') times (').replace(/(\d)\(/g, '$1 times (').replace(/x²/g, 'x squared').replace(/−/g, ' minus ').replace(/[()]/g, ' ').replace(/\s+/g, ' ').trim();
function areaModel(cols, rows, cells) {
  const W = 72, H = 40; let g = '';
  cols.forEach((c, i) => g += tx(56 + i * W + W / 2, 16, c, { size: 14 }));
  rows.forEach((r, j) => { g += tx(44, 24 + j * H + H / 2 + 5, r, { size: 14, anchor: 'end' }); cols.forEach((_, i) => g += `<rect x="${56 + i * W}" y="${24 + j * H}" width="${W}" height="${H}" fill="${['#D9EBFC', '#FFF1CC', '#D7F2E3', '#FDE0DB'][(i + j * 2) % 4]}" stroke="${INK}" stroke-width="2"/>${tx(56 + i * W + W / 2, 24 + j * H + H / 2 + 5, cells[j][i], { size: 14 })}`); });
  return svgBox(`0 0 ${60 + cols.length * W} ${28 + rows.length * H}`, g, 'grid for multiplying brackets');
}
S('expand', 4, 'Brackets and like terms', '🧮', [
  ['Like terms have the same letter part. 3x + 2x = 5x, but 3x + 2y cannot be joined.', () => '<span class="expr">3x + 2x = 5x</span>'],
  ['To expand a bracket, multiply everything inside: 3(x + 4) = 3x + 12.', () => areaModel(['x', '+4'], ['3'], [['3x', '12']])],
  ['Two brackets? Use a grid: (x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6.', () => areaModel(['x', '+3'], ['x', '+2'], [['x²', '3x'], ['2x', '6']])]
], L => {
  const opt = (ans, c, prompt, extra) => Q({ prompt, speak: algSay(prompt.replace(/<[^>]+>/g, ' ')), choices: sOpts(ans, c, algSay), answer: ans, ...extra });
  if (L === 1) {
    const [p, q] = pick([['a', 'b'], ['x', 'y'], ['m', 'n'], ['p', 'q']]), c1 = rnd(1, 6), c2 = rnd(1, 6), c3 = rnd(1, 6), c4 = rnd(1, 6) * (Math.random() < 0.3 ? -1 : 1);
    const terms = shuffle([[c1, p], [c2, q], [c3, p], [c4, q]]), e = polyStr(terms), a = polyStr([[c1 + c3, p], [c2 + c4, q]]);
    return opt(a, [`${c1 + c2 + c3 + c4}${p}${q}`, polyStr([[c1 + c3, p], [c2 - c4, q]]), polyStr([[c1 + c3 + 1, p], [c2 + c4, q]]), polyStr([[c1 * c3, p], [c2 * c4, q]]), polyStr([[c1 + c3, p], [c2 + c4 + 1, q]])], `Simplify ${e}`,
      { steps: [`Collect the ${p} terms: ${terms.filter(t => t[1] === p).map(t => t[0]).join(' + ').replace(/\+ -/g, '− ')} = ${c1 + c3}, so ${term(c1 + c3, p, true)}.`, `Collect the ${q} terms: ${terms.filter(t => t[1] === q).map(t => t[0]).join(' + ').replace(/\+ -/g, '− ')} = ${c2 + c4}.`], explainText: `${e} = ${a}.` });
  }
  if (L === 2) {
    const k = rnd(2, 9), b = rnd(1, 9) * pick([1, -1]), e = `${k}${brk(b)}`, a = polyStr([[k, 'x'], [k * b, '']]);
    return opt(a, [polyStr([[k, 'x'], [b, '']]), polyStr([[1, 'x'], [k * b, '']]), polyStr([[k, 'x'], [-k * b, '']]), polyStr([[k, 'x'], [k + b, '']])], `Expand ${e}`,
      { explain: areaModel(['x', (b < 0 ? '−' : '+') + Math.abs(b)], [String(k)], [[k + 'x', String(k * b).replace('-', '−')]]), explainText: `Multiply both parts by ${k}: ${k} × x = ${k}x and ${k} × ${String(b).replace('-', '−')} = ${String(k * b).replace('-', '−')}. So ${a}.` });
  }
  if (L === 3) {
    const p = rnd(2, 5), q = rnd(2, 5) * pick([1, -1]), a1 = rnd(1, 7) * pick([1, -1]), b1 = rnd(1, 7) * pick([1, -1]);
    if (p + q === 0) return MATH.expand.gen(L);
    const e = `${p}${brk(a1)} ${q < 0 ? '−' : '+'} ${Math.abs(q)}${brk(b1)}`, a = polyStr([[p + q, 'x'], [p * a1 + q * b1, '']]);
    return opt(a, [polyStr([[p + q, 'x'], [p * a1 - q * b1, '']]), polyStr([[p + q, 'x'], [p * a1 + b1, '']]), polyStr([[p * q, 'x'], [p * a1 + q * b1, '']]), polyStr([[p + q, 'x'], [a1 + b1, '']])], `Expand and simplify ${e}`,
      { steps: [`${p}${brk(a1)} = ${polyStr([[p, 'x'], [p * a1, '']])}.`, `${q < 0 ? '−' : ''}${Math.abs(q)}${brk(b1)} = ${polyStr([[q, 'x'], [q * b1, '']])}.`, `Collect: x terms ${p} ${q < 0 ? '−' : '+'} ${Math.abs(q)} = ${p + q}; numbers ${p * a1} ${q * b1 < 0 ? '−' : '+'} ${Math.abs(q * b1)} = ${p * a1 + q * b1}.`], explainText: `${a}.` });
  }
  const a1 = rnd(-6, 9) || 1, b1 = rnd(-6, 9) || 2, [m, n] = a1 <= b1 ? [a1, b1] : [b1, a1], quad = polyStr([[1, 'x²'], [m + n, 'x'], [m * n, '']]);
  if (L === 4) {
    return opt(quad, [polyStr([[1, 'x²'], [m * n, 'x'], [m + n, '']]), polyStr([[1, 'x²'], [m * n, '']]), polyStr([[1, 'x²'], [m + n, 'x'], [-m * n, '']]), polyStr([[1, 'x²'], [m + n + 1, 'x'], [m * n, '']]), polyStr([[2, 'x'], [m * n, '']])], `Expand ${brk(m)}${brk(n)}`,
      { explain: areaModel(['x', (n < 0 ? '−' : '+') + Math.abs(n)], ['x', (m < 0 ? '−' : '+') + Math.abs(m)], [['x²', polyStr([[n, 'x']])], [polyStr([[m, 'x']]), String(m * n).replace('-', '−')]]), steps: [`x × x = x².`, `The two x terms: ${m}x and ${n}x make ${m + n}x.`, `The numbers: ${m} × ${n} = ${m * n}.`].map(s => s.replace(/-/g, '−')), explainText: `${quad}.` });
  }
  if (Math.random() < 0.6) {
    const ans = `${brk(m)}${brk(n)}`, bad = [];
    for (const [c, d] of [[-m, -n], [m, -n], [-m, n], [m + 1, n - 1], [m - 1, n + 1], [1, m * n], [m * n, 1], [m + n, 0]]) { if (!d || !c) continue; if (c + d === m + n && c * d === m * n) continue; const [u, v] = c <= d ? [c, d] : [d, c]; bad.push(`${brk(u)}${brk(v)}`); }
    return opt(ans, bad, `Factorise ${quad}`, { steps: [`Find two numbers that multiply to ${m * n} and add to ${m + n}.`, `${m} × ${n} = ${m * n} and ${m} + ${n} = ${m + n}.`].map(s => s.replace(/-/g, '−')), explainText: `${quad} = ${ans}.` });
  }
  const k = rnd(2, 6), mm = rnd(1, 5), nn = rnd(1, 9) * pick([1, -1]);
  if (gcd(mm, Math.abs(nn)) !== 1) return MATH.expand.gen(L);
  const e = polyStr([[k * mm, 'x'], [k * nn, '']]), ans = `${k}(${polyStr([[mm, 'x'], [nn, '']])})`;
  return opt(ans, [`${k}(${polyStr([[mm, 'x'], [nn + 1, '']])})`, `${k * mm}(${polyStr([[1, 'x'], [nn, '']])})`, `${k}(${polyStr([[mm, 'x'], [k * nn, '']])})`, `${k + 1}(${polyStr([[mm, 'x'], [nn, '']])})`], `Factorise ${e}`,
    { steps: [`The biggest number that divides ${k * mm} and ${Math.abs(k * nn)} is ${k}.`, `Take ${k} outside the bracket: ${ans}.`, 'Check by expanding it again.'], explainText: `${e} = ${ans}.` });
});

const LT = { '<': '&lt;', '>': '&gt;', '≤': '≤', '≥': '≥' }, FLIP = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
const ineqH = s => s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ineqSay = s => s.replace(/≤/g, ' is less than or equal to ').replace(/≥/g, ' is more than or equal to ').replace(/</g, ' is less than ').replace(/>/g, ' is more than ').replace(/−/g, 'minus ').replace(/\s+/g, ' ').trim();
const neg = n => String(n).replace('-', '−');
function ineqSVG(lo, hi, a, aIn, b, bIn) {
  const X = v => 20 + (v - lo) / (hi - lo) * 260; let g = `<line x1="6" y1="34" x2="294" y2="34" stroke="${INK}" stroke-width="2"/>`;
  for (let v = lo; v <= hi; v++) g += `<line x1="${X(v)}" y1="28" x2="${X(v)}" y2="40" stroke="${INK}" stroke-width="1.5"/>${tx(X(v), 58, neg(v), { size: 11 })}`;
  const xa = a == null ? 6 : X(a), xb = b == null ? 294 : X(b);
  g += `<line x1="${xa}" y1="34" x2="${xb}" y2="34" stroke="#2E8BE6" stroke-width="6" stroke-linecap="round"/>`;
  if (a == null) g += `<path d="M14 26 L4 34 L14 42" fill="none" stroke="#2E8BE6" stroke-width="4" stroke-linecap="round"/>`;
  if (b == null) g += `<path d="M286 26 L296 34 L286 42" fill="none" stroke="#2E8BE6" stroke-width="4" stroke-linecap="round"/>`;
  if (a != null) g += `<circle cx="${xa}" cy="34" r="7" fill="${aIn ? '#2E8BE6' : '#fff'}" stroke="#2E8BE6" stroke-width="3"/>`;
  if (b != null) g += `<circle cx="${xb}" cy="34" r="7" fill="${bIn ? '#2E8BE6' : '#fff'}" stroke="#2E8BE6" stroke-width="3"/>`;
  return svgBox('0 0 300 66', g, 'number line', true);
}
const ineqPic = (op, v) => ineqSVG(v - 5, v + 5, op === '<' || op === '≤' ? null : v, op === '≥', op === '<' || op === '≤' ? v : null, op === '≤');
S('inequal', 4, 'Inequalities', '↔️', [
  ['x > 3 means x is any number bigger than 3. The empty circle means 3 itself is not included.', () => ineqPic('>', 3)],
  ['≤ means "less than or equal to". A filled circle means the number is included: x ≤ 2.', () => ineqPic('≤', 2)],
  ['Solve like an equation: 2x + 1 < 9 → 2x < 8 → x < 4. If you multiply or divide by a negative, flip the sign!', () => `<span class="expr">${ineqH('2x + 1 < 9 → x < 4')}</span>`]
], L => {
  const ops = ['<', '>', '≤', '≥'];
  if (L === 1) {
    const op = pick(ops), v = rnd(-3, 6), a = `x ${op} ${neg(v)}`;
    return Q({ prompt: 'Which inequality does this number line show?', visual: ineqPic(op, v), choices: opts(a, ops.map(o => `x ${o} ${neg(v)}`).concat([`x ${op} ${neg(v + 1)}`]), 4, ineqH, ineqSay), answer: a,
      explainText: `The line goes ${op === '<' || op === '≤' ? 'left (smaller numbers)' : 'right (bigger numbers)'} and the circle is ${op === '≤' || op === '≥' ? 'filled, so ' + neg(v) + ' is included' : 'empty, so ' + neg(v) + ' is not included'}: ${a}.` });
  }
  if (L === 2) {
    const two = Math.random() < 0.5, lo = rnd(-4, 3), hi = lo + rnd(2, 5), o1 = pick(['<', '≤']), o2 = pick(['<', '≤']), v = rnd(-3, 6), op = pick(ops);
    const ok = two ? n => (o1 === '<' ? n > lo : n >= lo) && (o2 === '<' ? n < hi : n <= hi) : n => op === '<' ? n < v : op === '>' ? n > v : op === '≤' ? n <= v : n >= v;
    const pool = []; for (let n = -8; n <= 12; n++) pool.push(n);
    const good = pool.filter(ok), bad = pool.filter(n => !ok(n)).sort((x, y) => Math.min(Math.abs(x - lo), Math.abs(x - hi), Math.abs(x - v)) - Math.min(Math.abs(y - lo), Math.abs(y - hi), Math.abs(y - v))).slice(0, 5), ans = pick(good);
    const s = two ? `${neg(lo)} ${o1} x ${o2} ${neg(hi)}` : `x ${op} ${neg(v)}`;
    return Q({ prompt: `Which number fits ${ineqH(s)}?`, speak: `Which number fits: ${ineqSay(s)}?`, choices: opts(ans, bad, 4, neg, v2 => String(v2)), answer: ans,
      explain: two ? ineqSVG(lo - 2, hi + 2, lo, o1 === '≤', hi, o2 === '≤') : ineqPic(op, v), explainText: `${neg(ans)} is inside the shaded part. Watch the ends: < and > leave the end number out, ≤ and ≥ include it.` });
  }
  if (L === 3 || L === 5) {
    const a = rnd(2, 6) * (L === 5 ? -1 : 1), k = rnd(-4, 8), b = rnd(-9, 9) || 4, op = pick(ops), c = a * k + b, fop = a < 0 ? FLIP[op] : op, ans = `x ${fop} ${neg(k)}`;
    const e = `${polyStr([[a, 'x'], [b, '']])} ${op} ${neg(c)}`;
    return Q({ prompt: `Solve ${ineqH(e)}`, speak: `Solve ${ineqSay(e)}`, choices: opts(ans, [`x ${FLIP[fop]} ${neg(k)}`, `x ${fop} ${neg(-k)}`, `x ${fop} ${neg(c - b)}`, `x ${fop} ${neg(k + 1)}`, `x ${op} ${neg(k)}`].filter(v => v !== ans), 4, ineqH, ineqSay), answer: ans,
      steps: [`${b > 0 ? 'Take away ' + b : 'Add ' + -b} on both sides: ${ineqH(`${polyStr([[a, 'x']])} ${op} ${neg(c - b)}`)}.`, `Divide both sides by ${neg(a)}${a < 0 ? '. It is negative, so flip the sign!' : '.'}`, `${ineqH(ans)}.`], explainText: `${ineqH(ans)}.` });
  }
  if (Math.random() < 0.5) {
    const lo = rnd(-5, 3), hi = lo + rnd(3, 7), o1 = pick(['<', '≤']), o2 = pick(['<', '≤']), list = []; for (let n = lo; n <= hi; n++) if ((o1 === '<' ? n > lo : true) && (o2 === '<' ? n < hi : true)) list.push(n);
    const s = `${neg(lo)} ${o1} n ${o2} ${neg(hi)}`;
    return Q({ prompt: `How many integers n fit ${ineqH(s)}?`, speak: `How many integers n fit: ${ineqSay(s)}?`, visual: ineqSVG(lo - 1, hi + 1, lo, o1 === '≤', hi, o2 === '≤'), choices: opts(list.length, [list.length + 1, list.length - 1, list.length + 2, hi - lo + 1, hi - lo - 1].filter(v => v > 0)), answer: list.length,
      explainText: `List them: ${list.map(neg).join(', ')}. That is ${list.length}.` });
  }
  const a = rnd(2, 6), b = rnd(-8, 8), c = rnd(-5, 30), strict = Math.random() < 0.5, ans = strict ? Math.floor((c - b) / a) + 1 : Math.ceil((c - b) / a), e = `${polyStr([[a, 'x'], [b, '']])} ${strict ? '>' : '≥'} ${neg(c)}`;
  return Q({ prompt: `What is the smallest integer x with ${ineqH(e)}?`, speak: `What is the smallest integer x where ${ineqSay(e)}?`, choices: opts(ans, [ans + 1, ans - 1, ans + 2, c - b].filter(v => v !== ans), 4, neg, String), answer: ans,
    steps: [`${ineqH(`${a}x ${strict ? '>' : '≥'} ${neg(c - b)}`)}, so ${ineqH(`x ${strict ? '>' : '≥'} ${fmt(+((c - b) / a).toFixed(2))}`)}.`.replace(/-/g, '−'), `The smallest whole number that works is ${neg(ans)}.`], explainText: `Check: ${a} × ${neg(ans)} ${b < 0 ? '−' : '+'} ${Math.abs(b)} = ${neg(a * ans + b)}, which ${strict ? 'is more than' : 'is at least'} ${neg(c)}.` });
});

const supE = e => `<sup>${e < 0 ? '−' + -e : e}</sup>`;
const sfH = v => { const [m, e] = v.split('e'); return `${m} × 10${supE(+e)}`; };
const sfS = v => { const [m, e] = v.split('e'); return `${m} times 10 to the power ${+e < 0 ? 'minus ' + -e : e}`; };
function sfPlain(m, e) {
  const [ip, fp = ''] = String(m).split('.'), d = ip + fp, pt = ip.length + e;
  if (pt <= 0) return '0.' + '0'.repeat(-pt) + d.replace(/0+$/, '');
  if (pt >= d.length) return Number(d + '0'.repeat(pt - d.length)).toLocaleString('en-US');
  return Number(d.slice(0, pt)).toLocaleString('en-US') + '.' + d.slice(pt);
}
const mant = () => +(rnd(11, 99) / 10).toFixed(1);
S('stdform', 4, 'Standard form', '🔭', [
  ['Huge numbers are written as (a number from 1 to 10) × (a power of 10). 3,000,000 = 3 × 10⁶.', () => `<span class="expr">3,000,000 = 3 × 10<sup>6</sup></span>`],
  ['The power counts how many places the digits move: 45,000 = 4.5 × 10⁴.', () => `<span class="expr">45,000 = 4.5 × 10<sup>4</sup></span>`],
  ['Tiny numbers use negative powers: 0.007 = 7 × 10⁻³.', () => `<span class="expr">0.007 = 7 × 10<sup>−3</sup></span>`]
], L => {
  if (L === 1) {
    const m = rnd(1, 9), e = rnd(2, 6), a = sfPlain(m, e);
    return Q({ prompt: `${m} × 10${supE(e)} = ?`, speak: `What is ${m} times 10 to the power ${e}?`, choices: sOpts(a, [sfPlain(m, e + 1), sfPlain(m, e - 1), sfPlain(m, e + 2), fmt(m * 10 * e)], v => v.replace(/,/g, '')), answer: a,
      explainText: `10${supE(e)} is 1 followed by ${e} zeros. ${m} × ${sfPlain(1, e)} = ${a}.` });
  }
  if (L === 2 || (L === 4 && Math.random() < 0.5)) {
    const m = mant(), e = L === 2 ? rnd(3, 8) : -rnd(1, 5), n = sfPlain(m, e), a = `${m}e${e}`, mm = +(m * 10).toFixed(1), md = +(m / 10).toFixed(2);
    return Q({ prompt: `Write ${n} in standard form`, speak: `Write ${n.replace(/,/g, '')} in standard form`, choices: opts(a, [`${m}e${e - 1}`, `${m}e${e + 1}`, `${mm}e${e - 1}`, `${md}e${e + 1}`, `${m}e${-e}`], 4, sfH, sfS), answer: a,
      steps: [`Put the point after the first non-zero digit: ${m}.`, e > 0 ? `${m} must be made ${e} places bigger to reach ${n}.` : `${m} must be made ${-e} places smaller to reach ${n}.`], explainText: `${n} = ${sfH(a)}.` });
  }
  if (L === 3 || L === 4) {
    const m = Math.random() < 0.5 ? mant() : +(rnd(101, 999) / 100).toFixed(2), e = L === 3 ? rnd(2, 7) : -rnd(1, 5), a = sfPlain(m, e), digits = String(m).replace('.', '');
    return Q({ prompt: `${m} × 10${supE(e)} = ?`, speak: `What is ${sfS(`${m}e${e}`)}?`, choices: sOpts(a, [sfPlain(m, e + 1), sfPlain(m, e - 1), e > 0 ? Number(digits + '0'.repeat(e)).toLocaleString('en-US') : '0.' + '0'.repeat(-e) + digits, sfPlain(m, -e)], v => v.replace(/,/g, '')), answer: a,
      explainText: `Move the decimal point ${Math.abs(e)} place${Math.abs(e) > 1 ? 's' : ''} to the ${e > 0 ? 'right' : 'left'}: ${a}.` });
  }
  if (Math.random() < 0.5) {
    const a = rnd(2, 9), b = rnd(2, 9), p = rnd(2, 8), q = rnd(1, 6), ab = a * b, m = ab >= 10 ? +(ab / 10).toFixed(1) : ab, e = p + q + (ab >= 10 ? 1 : 0), ans = `${m}e${e}`;
    return Q({ prompt: `(${a} × 10${supE(p)}) × (${b} × 10${supE(q)}) = ?`, speak: `${a} times 10 to the ${p}, multiplied by ${b} times 10 to the ${q}`, choices: opts(ans, [`${m}e${p * q}`, `${m}e${e + 1}`, `${m}e${e - 1}`, `${a + b}e${p + q}`, `${m}e${p + q + (ab >= 10 ? 0 : 1)}`], 4, sfH, sfS), answer: ans,
      steps: [`Multiply the numbers: ${a} × ${b} = ${ab}.`, `Add the powers: ${p} + ${q} = ${p + q}.`, ...(ab >= 10 ? [`${ab} is not between 1 and 10, so write ${ab} = ${m} × 10 and add 1 to the power.`] : [])], explainText: `= ${sfH(ans)}.` });
  }
  const b = rnd(2, 4), c = rnd(1, Math.floor(9 / b)), a = b * c, p = rnd(5, 9), q = rnd(1, p - 2), ans = `${c}e${p - q}`;
  return Q({ prompt: `(${a} × 10${supE(p)}) ÷ (${b} × 10${supE(q)}) = ?`, speak: `${a} times 10 to the ${p}, divided by ${b} times 10 to the ${q}`, choices: opts(ans, [`${c}e${p + q}`, `${c}e${p - q + 1}`, `${c}e${Math.round(p / q)}`, `${a - b}e${p - q}`, `${c}e${p - q - 1}`], 4, sfH, sfS), answer: ans,
    steps: [`Divide the numbers: ${a} ÷ ${b} = ${c}.`, `Subtract the powers: ${p} − ${q} = ${p - q}.`], explainText: `= ${sfH(ans)}.` });
});

const cents = n => Math.round(n * 100) / 100;
const usd = n => '$' + (Number.isInteger(n) ? fmt(n) : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const usdSay = n => Number.isInteger(n) ? `${n} dollars` : `${Math.floor(n)} dollars ${Math.round((n % 1) * 100)} cents`;
function pctBar(keep, lab1, lab2) {
  const w = keep * 2.8;
  return svgBox('0 0 300 64', `<rect x="10" y="10" width="${w}" height="34" fill="#A8E0C2" stroke="${INK}" stroke-width="2"/><rect x="${10 + w}" y="10" width="${280 - w}" height="34" fill="#F7B9AE" stroke="${INK}" stroke-width="2"/>${tx(10 + w / 2, 32, lab1, { size: 13 })}${tx(10 + w + (280 - w) / 2, 32, lab2, { size: 12 })}${tx(10, 60, '0%', { size: 10, anchor: 'start', fill: '#5A678C' })}${tx(290, 60, '100%', { size: 10, anchor: 'end', fill: '#5A678C' })}`, 'percentage bar', true);
}
S('interest', 4, 'Discounts and interest', '💰', [
  ['A 20% discount means you pay the other 80%. $50 × 0.8 = $40.', () => pctBar(80, 'you pay 80%', 'save 20%')],
  ['Simple interest is the same every year. $200 at 5% earns $10 a year, so 3 years earns $30.', () => '<span class="expr">$200 × 5% × 3 = $30</span>'],
  ['Compound interest grows on the interest too: multiply by 1.05 every year for 5%.', () => '<span class="expr">$200 → $210 → $220.50</span>']
], L => {
  if (L === 1) {
    const d = pick([10, 20, 25, 50, 30, 40]), p = (d === 25 ? rnd(1, 15) * 20 : rnd(2, 30) * 10), sale = p * (100 - d) / 100, off = p - sale;
    return Q({ prompt: word(`A jacket costs ${usd(p)}. It has ${d}% off. What is the sale price?`), speak: `A jacket costs ${p} dollars. It has ${d} percent off. What is the sale price?`, visual: pctBar(100 - d, `pay ${100 - d}%`, `${d}% off`), choices: opts(sale, [off, p - d, p + off, sale + 10, sale - 5].filter(v => v > 0 && v !== sale), 4, usd, usdSay), answer: sale,
      steps: [`${d}% of ${usd(p)} = ${usd(off)}.`, `${usd(p)} − ${usd(off)} = ${usd(sale)}.`], explainText: `The sale price is ${usd(sale)}.` });
  }
  if (L === 2) {
    const P = rnd(1, 20) * 100, r = rnd(2, 10), t = rnd(2, 6), I = P * r * t / 100, total = Math.random() < 0.5, ans = total ? P + I : I;
    return Q({ prompt: word(`You save ${usd(P)} at ${r}% simple interest a year. ${total ? `How much is in the account after ${t} years?` : `How much interest after ${t} years?`}`), speak: `You save ${P} dollars at ${r} percent simple interest a year. ${total ? `How much is in the account after ${t} years?` : `How much interest after ${t} years?`}`,
      choices: opts(ans, [P * r / 100, total ? I : P + I, ans + P * r / 100, cents(P * (1 + r / 100) ** t), I * 2].filter(v => v !== ans).map(cents), 4, usd, usdSay), answer: ans,
      steps: [`One year: ${r}% of ${usd(P)} = ${usd(P * r / 100)}.`, `${t} years: ${t} × ${usd(P * r / 100)} = ${usd(I)}.`, ...(total ? [`Add it to the ${usd(P)}: ${usd(P + I)}.`] : [])], explainText: `The answer is ${usd(ans)}.` });
  }
  if (L === 3) {
    const old = pick([20, 25, 40, 50, 80, 200, 60]), pc = pick([10, 20, 25, 50, 75]), up = Math.random() < 0.5, nw = old * (100 + (up ? pc : -pc)) / 100, ch = Math.abs(nw - old), a = `${pc}%`;
    if (!Number.isInteger(nw)) return MATH.interest.gen(L);
    const wrongBase = +(ch / nw * 100).toFixed(1);
    return Q({ prompt: word(`A price ${up ? 'rose' : 'fell'} from ${usd(old)} to ${usd(nw)}. What was the percentage ${up ? 'increase' : 'decrease'}?`), speak: `A price ${up ? 'rose' : 'fell'} from ${old} dollars to ${nw} dollars. What was the percentage ${up ? 'increase' : 'decrease'}?`, choices: sOpts(a, [`${wrongBase}%`, `${ch}%`, `${pc + 5}%`, `${pc * 2}%`, `${100 - pc}%`].filter(v => v !== a), v => v.replace('%', ' percent')), answer: a,
      steps: [`The change is ${usd(ch)}.`, `Divide by the ORIGINAL price: ${ch} ÷ ${old} = ${pc / 100}.`, `× 100 = ${pc}%.`], explainText: `It was a ${pc}% ${up ? 'increase' : 'decrease'}.` });
  }
  if (L === 4) {
    const P = pick([100, 200, 500, 1000, 2000, 5000]), r = pick([10, 20, 5, 10]), n = r === 5 ? 2 : pick([2, 3]), A = cents(P * (1 + r / 100) ** n);
    const yrs = []; let v = P; for (let i = 1; i <= n; i++) { v = cents(v * (1 + r / 100)); yrs.push(`After year ${i}: ${usd(v)}.`); }
    return Q({ prompt: word(`${usd(P)} earns ${r}% compound interest each year. How much is there after ${n} years?`), speak: `${P} dollars earns ${r} percent compound interest each year. How much is there after ${n} years?`, choices: opts(A, [P + P * r / 100 * n, cents(P * (1 + r / 100) ** (n + 1)), cents(P * (1 + r / 100) ** (n - 1)), cents(A - P), cents(A + 10)].map(cents).filter(x => x !== A), 4, usd, usdSay), answer: A,
      steps: [`Each year multiply by ${1 + r / 100}.`, ...yrs], explainText: `${usd(P)} × ${1 + r / 100}${n === 2 ? '²' : '³'} = ${usd(A)}.` });
  }
  const d = pick([10, 20, 25, 50, 40]), up = Math.random() < 0.35, O = d === 25 ? rnd(2, 20) * 20 : rnd(2, 40) * 10, F = O * (100 + (up ? d : -d)) / 100;
  if (!Number.isInteger(F)) return MATH.interest.gen(L);
  return Q({ prompt: word(up ? `After a ${d}% price rise, a bike costs ${usd(F)}. What did it cost before?` : `In a ${d}% off sale, a coat costs ${usd(F)}. What was the original price?`), speak: up ? `After a ${d} percent price rise, a bike costs ${F} dollars. What did it cost before?` : `In a ${d} percent off sale, a coat costs ${F} dollars. What was the original price?`,
    choices: opts(O, [cents(F * (100 + (up ? -d : d)) / 100), F, O + 10, O - 10, cents(F + d)].filter(x => x !== O && x > 0), 4, usd, usdSay), answer: O,
    steps: [`${usd(F)} is ${100 + (up ? d : -d)}% of the original.`, `1% is ${usd(F)} ÷ ${100 + (up ? d : -d)} = ${usd(cents(F / (100 + (up ? d : -d))))}.`, `100% is ${usd(O)}.`], explainText: `The original price was ${usd(O)}. (Taking ${d}% of the new price does not work!)` });
});

function road(km, hrs) {
  return svgBox('0 0 300 70', `<rect x="10" y="30" width="280" height="22" rx="4" fill="#5A678C"/><line x1="20" y1="41" x2="280" y2="41" stroke="#fff" stroke-width="2" stroke-dasharray="10 8"/><text x="22" y="34" font-size="24">🚗</text><text x="268" y="30" font-size="22">🏁</text>${tx(150, 66, km, { size: 13 })}${tx(150, 20, hrs, { size: 13, fill: '#F2604F' })}`, 'car on a road', true);
}
function dtGraph(pts, tMax, dMax) {
  const X = t => 34 + t / tMax * 250, Y = d => 140 - d / dMax * 126; let g = '';
  const ds = dMax / 6; for (let d = 0; d <= dMax; d += ds) g += `<line x1="34" y1="${Y(d)}" x2="284" y2="${Y(d)}" stroke="#CCDBE6" stroke-width="1"/>${tx(28, Y(d) + 4, d, { size: 10, anchor: 'end', fill: '#5A678C' })}`;
  for (let t = 0; t <= tMax; t++) g += `<line x1="${X(t)}" y1="14" x2="${X(t)}" y2="140" stroke="#E4EDF3" stroke-width="1"/>${tx(X(t), 154, t, { size: 10, fill: '#5A678C' })}`;
  g += `<polyline points="${pts.map(([t, d]) => `${X(t)},${Y(d)}`).join(' ')}" fill="none" stroke="#2E8BE6" stroke-width="3" stroke-linejoin="round"/>${tx(160, 170, 'time (hours)', { size: 10, fill: '#5A678C' })}${tx(4, 8, 'km', { size: 10, anchor: 'start', fill: '#5A678C' })}`;
  return svgBox('0 0 292 174', g, 'distance-time graph', true);
}
S('speed', 4, 'Speed, distance and time', '🚗', [
  ['Speed tells you how far you go in each hour. 60 km/h means 60 km every hour.', () => road('120 km', '2 hours at 60 km/h')],
  ['Distance = speed × time. Speed = distance ÷ time. Time = distance ÷ speed.', () => svgBox('0 0 120 100', `<polygon points="60,6 114,94 6,94" fill="#FFF1CC" stroke="${INK}" stroke-width="2.5"/><line x1="30" y1="56" x2="90" y2="56" stroke="${INK}" stroke-width="2"/><line x1="60" y1="56" x2="60" y2="94" stroke="${INK}" stroke-width="2"/>${tx(60, 46, 'D', { size: 20 })}${tx(42, 84, 'S', { size: 20 })}${tx(78, 84, 'T', { size: 20 })}`, 'distance speed time triangle')],
  ['Watch the units! 30 minutes is half an hour, so at 60 km/h you go 30 km.', () => '<span class="expr">60 × ½ = 30 km</span>']
], L => {
  const unit = (u, s) => [v => `${fmt(v)} ${u}`, v => `${v} ${s}`];
  if (L === 1) { const s = rnd(2, 9) * 10, t = rnd(2, 6), d = s * t, [sh, sy] = unit('km', 'kilometres'); return Q({ prompt: word(`A car drives at ${s} km/h for ${t} hours. How far does it go?`), visual: road('? km', `${t} hours at ${s} km/h`), choices: opts(d, [s + t, d + s, d - s, s * (t + 1) + 5, d / 2].filter(v => v !== d && Number.isInteger(v)), 4, sh, sy), answer: d, explainText: `Distance = speed × time = ${s} × ${t} = ${d} km.` }); }
  if (L === 2) {
    const s = rnd(2, 12) * 5, t = rnd(2, 8), d = s * t;
    if (Math.random() < 0.5) return Q({ prompt: word(`A train goes ${d} km in ${t} hours. What is its average speed?`), visual: road(`${d} km`, `${t} hours`), choices: opts(s, [d - t, s + 5, s - 5, d * t, s * 2].filter(v => v > 0 && v !== s), 4, v => `${v} km/h`, v => `${v} kilometres per hour`), answer: s, explainText: `Speed = distance ÷ time = ${d} ÷ ${t} = ${s} km/h.` });
    return Q({ prompt: word(`A bus travels ${d} km at ${s} km/h. How long does it take?`), visual: road(`${d} km`, `${s} km/h`), choices: opts(t, [t + 1, t - 1, d - s, t * 2, Math.round(s / t)].filter(v => v > 0 && v !== t), 4, v => `${v} hours`, v => `${v} hours`), answer: t, explainText: `Time = distance ÷ speed = ${d} ÷ ${s} = ${t} hours.` });
  }
  if (L === 3) {
    let s, m; do { s = pick([20, 30, 40, 60, 80, 90, 120]); m = pick([15, 20, 30, 40, 45, 90]); } while ((s * m) % 60);
    const d = s * m / 60;
    if (Math.random() < 0.5) return Q({ prompt: word(`A cyclist rides at ${s} km/h for ${m} minutes. How far is that?`), choices: opts(d, [s * m, d * 2, d + 10, s - m, s * m / 100].filter(v => v > 0 && v !== d && Number.isInteger(v)), 4, v => `${v} km`, v => `${v} kilometres`), answer: d, steps: [`${m} minutes = ${m}/60 of an hour = ${fmt(m / 60)} h.`, `${s} × ${fmt(m / 60)} = ${d} km.`], explainText: `That is ${d} km.` });
    return Q({ prompt: word(`How many minutes does it take to go ${d} km at ${s} km/h?`), choices: opts(m, [m + 10, m - 5, d * 2, Math.round(s / d), 60 - m].filter(v => v > 0 && v !== m), 4, v => `${v} min`, v => `${v} minutes`), answer: m, steps: [`Time = ${d} ÷ ${s} = ${fmt(+(d / s).toFixed(4))} hours.`, `× 60 = ${m} minutes.`], explainText: `It takes ${m} minutes.` });
  }
  if (L === 4) {
    const t1 = rnd(1, 3), d1 = rnd(2, 6) * 10, stop = rnd(1, 2), t2 = rnd(1, 2), back = Math.random() < 0.5, d2 = back ? 0 : d1 + rnd(1, 4) * 10, tMax = t1 + stop + t2, dMax = Math.ceil(Math.max(d1, d2) / 60) * 60 || 60;
    const pts = [[0, 0], [t1, d1], [t1 + stop, d1], [tMax, d2]], vis = dtGraph(pts, tMax, dMax), k = pick(['first', 'stop', 'last']);
    if (k === 'stop') return Q({ prompt: 'For how many hours did they stop?', speak: 'The graph shows a journey. For how many hours did they stop?', visual: vis, choices: opts(stop, [1, 2, 3, t1, t2].filter(v => v !== stop), 4, v => `${v} h`, v => `${v} hours`), answer: stop, explainText: `A flat line means not moving. It is flat from ${t1} to ${t1 + stop} hours: ${stop} hour${stop > 1 ? 's' : ''}.` });
    const [dd, tt] = k === 'first' ? [d1, t1] : [Math.abs(d2 - d1), t2], sp = dd / tt;
    if (!Number.isInteger(sp)) return MATH.speed.gen(L);
    return Q({ prompt: `What was the speed in the ${k === 'first' ? 'first part' : 'last part'} of the journey?`, visual: vis, choices: opts(sp, [dd, sp * 2, sp + 10, Math.max(1, sp - 10), d1 / tMax].filter(v => v > 0 && v !== sp && Number.isInteger(v)), 4, v => `${v} km/h`, v => `${v} kilometres per hour`), answer: sp,
      steps: [`In that part they go ${dd} km${k === 'last' && back ? ' (back home)' : ''} in ${tt} hour${tt > 1 ? 's' : ''}.`, `${dd} ÷ ${tt} = ${sp} km/h.`], explainText: `The speed is ${sp} km/h.` });
  }
  if (Math.random() < 0.5) {
    let s1, s2, t1, t2, avg; do { s1 = rnd(3, 12) * 10; s2 = rnd(3, 12) * 10; t1 = rnd(1, 3); t2 = rnd(1, 3); avg = (s1 * t1 + s2 * t2) / (t1 + t2); } while (!Number.isInteger(avg) || s1 === s2 || avg === (s1 + s2) / 2);
    return Q({ prompt: word(`A car drives ${t1} h at ${s1} km/h, then ${t2} h at ${s2} km/h. What is its average speed for the whole trip?`), choices: opts(avg, [(s1 + s2) / 2, s1 * t1 + s2 * t2, avg + 5, avg - 5].filter(v => v !== avg && Number.isInteger(v)), 4, v => `${v} km/h`, v => `${v} kilometres per hour`), answer: avg,
      steps: [`Total distance: ${s1} × ${t1} + ${s2} × ${t2} = ${s1 * t1 + s2 * t2} km.`, `Total time: ${t1 + t2} h.`, `${s1 * t1 + s2 * t2} ÷ ${t1 + t2} = ${avg} km/h. (Not just the middle of the two speeds!)`], explainText: `The average speed is ${avg} km/h.` });
  }
  const v = rnd(1, 8) * 5, k = +(v * 3.6).toFixed(1), toKmh = Math.random() < 0.5;
  if (toKmh) return Q({ prompt: `A cheetah runs at ${v} m/s. What is that in km/h?`, choices: opts(k, [v * 60, v * 36, +(v / 3.6).toFixed(1), k + 10].filter(x => x !== k), 4, x => `${fmt(x)} km/h`, x => `${x} kilometres per hour`), answer: k,
    steps: [`In 1 hour (3600 s) it goes ${v} × 3600 = ${fmt(v * 3600)} m.`, `${fmt(v * 3600)} m = ${fmt(k)} km. So ×3.6.`], explainText: `${v} m/s = ${fmt(k)} km/h.` });
  return Q({ prompt: `A car goes ${fmt(k)} km/h. What is that in m/s?`, choices: opts(v, [k * 3.6, +(k / 60).toFixed(1), v * 10, v + 5].map(x => +x.toFixed(1)).filter(x => x !== v), 4, x => `${fmt(x)} m/s`, x => `${x} metres per second`), answer: v,
    steps: [`${fmt(k)} km/h = ${fmt(k * 1000)} m every 3600 s.`, `${fmt(k * 1000)} ÷ 3600 = ${v} m/s. (Divide by 3.6.)`], explainText: `${fmt(k)} km/h = ${v} m/s.` });
});

// Right-angled triangle: right angle at A (bottom), B along the bottom, C straight up. θ sits at B or C.
function rtriSVG(w, h, at, lab, flip) {
  const k = Math.min(170 / w, 110 / h), W = w * k, H = h * k, ox = 34, oy = 14 + H, fx = x => flip ? 2 * ox + W - x : x;
  const A = [fx(ox), oy], B = [fx(ox + W), oy], C = [fx(ox), oy - H], cx = (A[0] + B[0] + C[0]) / 3, cy = (A[1] + B[1] + C[1]) / 3;
  let g = `<polygon points="${pts2([A, B, C])}" fill="#D9EBFC" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M${A[0] + (flip ? -12 : 12)} ${oy} V${oy - 12} H${A[0]}" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
  const side = (P, Q2, t, col) => { if (t == null) return ''; const mx = (P[0] + Q2[0]) / 2, my = (P[1] + Q2[1]) / 2, dx = mx - cx, dy = my - cy, d = Math.hypot(dx, dy); return tx(mx + dx / d * 16, my + dy / d * 16 + 5, t, { size: 14, fill: col || INK }); };
  g += side(A, B, lab.AB) + side(A, C, lab.AC) + side(B, C, lab.BC);
  if (at) { const V = at === 'B' ? B : C, P1 = A, P2 = at === 'B' ? C : B, u = P => { const L = Math.hypot(P[0] - V[0], P[1] - V[1]); return [(P[0] - V[0]) / L, (P[1] - V[1]) / L]; }, [a1, b1] = u(P1), [a2, b2] = u(P2), r = 22, cr = a1 * b2 - b1 * a2;
    g += `<path d="M${+(V[0] + a1 * r).toFixed(1)} ${+(V[1] + b1 * r).toFixed(1)} A${r} ${r} 0 0 ${cr > 0 ? 1 : 0} ${+(V[0] + a2 * r).toFixed(1)} ${+(V[1] + b2 * r).toFixed(1)}" fill="none" stroke="#F2604F" stroke-width="2.5"/>`;
    const bx = a1 + a2, by = b1 + b2, bl = Math.hypot(bx, by); g += tx(V[0] + bx / bl * 36, V[1] + by / bl * 36 + 5, lab.ang || 'θ', { size: 13, fill: '#F2604F' }); }
  return svgBox(`0 0 ${W + 76} ${H + 44}`, g, 'right-angled triangle', true);
}
// Name sides relative to θ: which of AB / AC / BC is opp, adj, hyp.
const trigSides = at => at === 'B' ? { opp: 'AC', adj: 'AB', hyp: 'BC' } : { opp: 'AB', adj: 'AC', hyp: 'BC' };
const TRIG_NAME = { sin: 'sine', cos: 'cosine', tan: 'tangent' };
S('trig', 4, 'Trigonometry: SOH CAH TOA', '⛺', [
  ['In a right-angled triangle, the longest side, across from the right angle, is the hypotenuse.', () => rtriSVG(4, 3, null, { BC: 'hypotenuse' })],
  ['Look from the angle θ. The side across from it is the opposite. The side next to it (not the hypotenuse) is the adjacent.', () => rtriSVG(4, 3, 'B', { AC: 'opposite', AB: 'adjacent', BC: 'hyp' })],
  ['SOH CAH TOA: sin θ = opp ÷ hyp, cos θ = adj ÷ hyp, tan θ = opp ÷ adj.', () => '<span class="expr">S<sub>O/H</sub> C<sub>A/H</sub> T<sub>O/A</sub></span>']
], L => {
  const at = pick(['B', 'C']), flip = Math.random() < 0.5, sd = trigSides(at);
  if (L === 1) {
    const [w, h] = pick([[4, 3], [3, 4], [12, 5], [5, 12], [8, 6]]), letters = shuffle(['a', 'b', 'c']), lab = { AB: letters[0], AC: letters[1], BC: letters[2] }, k = pick(['opp', 'adj', 'hyp']), full = { opp: 'opposite', adj: 'adjacent', hyp: 'hypotenuse' }[k], ans = lab[sd[k]];
    return Q({ prompt: `Which side is the ${full} (from angle θ)?`, speak: `Looking from the angle theta, which side is the ${full}?`, visual: rtriSVG(w, h, at, lab, flip), choices: ['a', 'b', 'c'].map(v => ({ html: v, val: v, say: v })), answer: ans,
      explainText: k === 'hyp' ? `The hypotenuse is always across from the right angle: side ${ans}.` : k === 'opp' ? `The opposite side does not touch θ: side ${ans}.` : `The adjacent side touches θ but is not the hypotenuse: side ${ans}.` });
  }
  if (L === 2) {
    const [p, q, r] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17]]), [w, h] = Math.random() < 0.5 ? [p, q] : [q, p], len = { AB: w, AC: h, BC: r }, f = pick(['sin', 'cos', 'tan']);
    const o = len[sd.opp], a = len[sd.adj], hy = r, ans = f === 'sin' ? `${o}/${hy}` : f === 'cos' ? `${a}/${hy}` : `${o}/${a}`;
    return Q({ prompt: `What is ${f} θ?`, speak: `What is the ${TRIG_NAME[f]} of theta?`, visual: rtriSVG(w, h, at, len, flip), choices: opts(ans, [`${o}/${hy}`, `${a}/${hy}`, `${o}/${a}`, `${a}/${o}`, `${hy}/${o}`], 4, v => frac(...v.split('/')), v => fracSay(...v.split('/'))), answer: ans,
      steps: [`From θ: opposite = ${o}, adjacent = ${a}, hypotenuse = ${hy}.`, f === 'sin' ? 'SOH: sin = opposite ÷ hypotenuse.' : f === 'cos' ? 'CAH: cos = adjacent ÷ hypotenuse.' : 'TOA: tan = opposite ÷ adjacent.'], explainText: `${f} θ = ${ans}.` });
  }
  if (L === 3) {
    const pair = pick([['opp', 'hyp', 'sin'], ['adj', 'hyp', 'cos'], ['opp', 'adj', 'tan']]), [k1, k2, f] = Math.random() < 0.5 ? pair : [pair[1], pair[0], pair[2]], n = rnd(4, 20), ang = rnd(20, 70), lab = { ang: ang + '°' };
    lab[sd[k1]] = String(n); lab[sd[k2]] = 'x';
    const full = { opp: 'opposite', adj: 'adjacent', hyp: 'hypotenuse' };
    return Q({ prompt: 'Which ratio links the two marked sides?', speak: `The angle is ${ang} degrees. You know one side and want x. Which ratio links them: sine, cosine or tangent?`, visual: rtriSVG(pick([4, 3, 5]), pick([3, 4]), at, lab, flip), choices: ['sin', 'cos', 'tan'].map(v => ({ html: v, val: v, say: TRIG_NAME[v] })), answer: f,
      steps: [`From the ${ang}° angle: ${n} is the ${full[k1]} and x is the ${full[k2]}.`, `${f === 'sin' ? 'SOH' : f === 'cos' ? 'CAH' : 'TOA'} uses the ${full[pair[0]]} and the ${full[pair[1]]}.`], explainText: `Use ${f}.` });
  }
  const cases = [['sin', 30, 'opp', 'hyp', 0.5], ['cos', 60, 'adj', 'hyp', 0.5], ['tan', 45, 'opp', 'adj', 1]], [f, ang, top, bot, val] = pick(cases);
  const shape = ang === 45 ? [3, 3] : (ang === 30) === (at === 'B') ? [5.2, 3] : [3, 5.2];
  if (L === 4) {
    const findTop = Math.random() < 0.5, base = rnd(2, 15) * 2, known = findTop ? base : base * val, ans = findTop ? base * val : base, lab = { ang: ang + '°' };
    lab[sd[findTop ? bot : top]] = String(known); lab[sd[findTop ? top : bot]] = 'x';
    return Q({ prompt: `Find x. (${f} ${ang}° = ${val})`, speak: `Find x. Use ${TRIG_NAME[f]} ${ang} degrees equals ${val}.`, visual: rtriSVG(...shape, at, lab, flip), choices: opts(ans, [known * 2, known / 2, ans + 2, ans - 2, known + val].filter(v => v > 0 && v !== ans && Number.isInteger(v))), answer: ans,
      steps: [`${f} ${ang}° = ${top} ÷ ${bot}.`, findTop ? `x ÷ ${known} = ${val}, so x = ${known} × ${val} = ${ans}.` : `${known} ÷ x = ${val}, so x = ${known} ÷ ${val} = ${ans}.`], explainText: `x = ${ans}.` });
  }
  const b = rnd(2, 12) * 2, lab = {}; lab[sd[top]] = String(b * val); lab[sd[bot]] = String(b);
  return Q({ prompt: 'What is the angle θ?', speak: 'What is the angle theta? Remember: sine 30 is a half, cosine 60 is a half, tangent 45 is 1.', visual: rtriSVG(...shape, at, lab, flip) + word(`Remember: sin 30° = 0.5, cos 60° = 0.5, tan 45° = 1`), choices: opts(ang, [30, 45, 60, 90].filter(v => v !== ang), 4, v => v + '°', v => v + ' degrees'), answer: ang,
    steps: [`The marked sides are the ${top === 'opp' ? 'opposite' : 'adjacent'} and the ${bot === 'hyp' ? 'hypotenuse' : 'adjacent'}, so use ${f}.`, `${f} θ = ${b * val} ÷ ${b} = ${val}.`, `${f} ${ang}° = ${val}, so θ = ${ang}°.`], explainText: `θ = ${ang}°.` });
});

const tiles = (list, hi = []) => `<div class="ntiles">${list.map((v, i) => `<span${hi.includes(i) ? ' class="hi"' : ''}>${neg(v)}</span>`).join('')}</div>`;
const median = s => s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
S('stats', 4, 'Averages and spread', '📋', [
  ['Mean: add them all up and share equally. Median: the middle one when they are in order. Mode: the most common.', () => tiles([2, 3, 3, 5, 7], [2])],
  ['Range = biggest − smallest. The interquartile range is the spread of the middle half.', () => '<span class="expr">7 − 2 = 5</span>'],
  ['In a frequency table, multiply each value by how often it happens, add them, then divide by the total count.', () => `<table class="m3tab"><tr><th>Pets</th><td>0</td><td>1</td><td>2</td></tr><tr><th>Children</th><td>3</td><td>5</td><td>2</td></tr></table>`]
], L => {
  if (L === 1) {
    if (Math.random() < 0.5) {
      const m = rnd(1, 15), list = [m, m, m]; while (list.length < 7) { const v = rnd(1, 15); if (list.filter(x => x === v).length < 2 && v !== m) list.push(v); }
      const sh = shuffle(list);
      return Q({ prompt: `Find the mode: ${sh.join(', ')}`, speak: `Find the mode of these numbers: ${sh.join(', ')}`, choices: opts(m, [...new Set(list.filter(v => v !== m))]), answer: m, explain: tiles([...list].sort((a, b) => a - b)), explainText: `${m} appears 3 times, more than any other number, so the mode is ${m}.` });
    }
    const n = pick([5, 7]), list = Array.from({ length: n }, () => rnd(1, 30)), s = [...list].sort((a, b) => a - b), md = median(s);
    return Q({ prompt: `Find the median: ${list.join(', ')}`, speak: `Find the median of: ${list.join(', ')}`, choices: opts(md, [list[(n - 1) / 2], s[0], s[n - 1], s[(n - 1) / 2 + 1], Math.round(s.reduce((a, b) => a + b, 0) / n)]), answer: md, explain: tiles(s, [(n - 1) / 2]), explainText: `Put them in order first. The middle one is ${md}.` });
  }
  if (L === 2) {
    const list = Array.from({ length: 6 }, () => rnd(1, 30)), s = [...list].sort((a, b) => a - b), md = median(s);
    return Q({ prompt: `Find the median: ${list.join(', ')}`, speak: `Find the median of: ${list.join(', ')}`, choices: opts(md, [s[2], s[3], (list[2] + list[3]) / 2, md + 1, md - 1, s[5] - s[0]]), answer: md, explain: tiles(s, [2, 3]),
      steps: [`In order: ${s.join(', ')}.`, `There are two middle numbers: ${s[2]} and ${s[3]}.`, `Halfway between them: (${s[2]} + ${s[3]}) ÷ 2 = ${fmt(md)}.`], explainText: `The median is ${fmt(md)}.` });
  }
  if (L === 3) {
    const n = pick([4, 5]), mean = rnd(5, 20), known = Array.from({ length: n - 1 }, () => rnd(Math.max(1, mean - 8), mean + 8)), x = n * mean - known.reduce((a, b) => a + b, 0);
    if (x < 0 || x > 60) return MATH.stats.gen(L);
    return Q({ prompt: word(`The mean of ${n} numbers is ${mean}. ${n - 1} of them are ${known.join(', ')}. What is the last one?`), choices: opts(x, [mean, x + 1, x - 1, n * mean, x + n].filter(v => v >= 0 && v !== x)), answer: x,
      steps: [`The total must be ${n} × ${mean} = ${n * mean}.`, `The known ones add to ${known.reduce((a, b) => a + b, 0)}.`, `${n * mean} − ${known.reduce((a, b) => a + b, 0)} = ${x}.`], explainText: `The last number is ${x}.` });
  }
  const [what, who] = pick([['Pets', 'Children'], ['Goals', 'Matches'], ['Books read', 'Pupils'], ['Siblings', 'Children']]), vals = [0, 1, 2, 3, 4], N = pick([10, 20]), f = partition(N, 5, 0);
  const table = `<table class="m3tab"><tr><th>${what}</th>${vals.map(v => `<td>${v}</td>`).join('')}</tr><tr><th>${who}</th>${f.map(v => `<td>${v}</td>`).join('')}</tr></table>`, sum = vals.reduce((a, v, i) => a + v * f[i], 0);
  if (L === 4) {
    const m = +(sum / N).toFixed(2);
    return Q({ prompt: `Find the mean number of ${what.toLowerCase()}.`, speak: `The table shows how many ${what.toLowerCase()} each of ${N} ${who.toLowerCase()} have. Find the mean.`, visual: table, choices: opts(m, [sum, 2, +(sum / 5).toFixed(2), +(m + 0.5).toFixed(2), +(N / 5).toFixed(2), +(m - 0.3).toFixed(2)].filter(v => v !== m)), answer: m,
      steps: [`Multiply each value by its frequency: ${vals.map((v, i) => `${v}×${f[i]}`).join(' + ')} = ${sum}.`, `Total count: ${N}.`, `${sum} ÷ ${N} = ${fmt(m)}.`], explainText: `The mean is ${fmt(m)}.` });
  }
  if (Math.random() < 0.4) {
    const cum = []; f.reduce((a, b, i) => (cum[i] = a + b), 0);
    const mid = N / 2, vA = vals[cum.findIndex(c => c >= mid)], vB = vals[cum.findIndex(c => c >= mid + 1)], md = (vA + vB) / 2;
    return Q({ prompt: `Find the median number of ${what.toLowerCase()}.`, visual: table, choices: opts(md, [2, md + 1, md - 1, f[2], Math.max(...f), md + 0.5].filter(v => v >= 0 && v !== md)), answer: md,
      steps: [`There are ${N} values, so the middle is between the ${mid}th and ${mid + 1}th.`, `Count along the table: the ${mid}th is ${vA} and the ${mid + 1}th is ${vB}.`], explainText: `The median is ${fmt(md)}.` });
  }
  const n = pick([7, 11]), list = Array.from({ length: n }, () => rnd(1, 40)), s = [...list].sort((a, b) => a - b), q1 = s[(n + 1) / 4 - 1], q3 = s[3 * (n + 1) / 4 - 1], iqr = q3 - q1;
  return Q({ prompt: `Find the interquartile range: ${list.join(', ')}`, speak: `Find the interquartile range of: ${list.join(', ')}`, choices: opts(iqr, [s[n - 1] - s[0], q3, q1, iqr + 1, iqr - 2].filter(v => v >= 0 && v !== iqr)), answer: iqr, explain: tiles(s, [(n + 1) / 4 - 1, 3 * (n + 1) / 4 - 1]),
    steps: [`In order: ${s.join(', ')}.`, `Lower quartile (the ${(n + 1) / 4}${(n + 1) / 4 === 2 ? 'nd' : 'rd'} value): ${q1}. Upper quartile (the ${3 * (n + 1) / 4}th value): ${q3}.`, `${q3} − ${q1} = ${iqr}.`], explainText: `The interquartile range is ${iqr}.` });
});
