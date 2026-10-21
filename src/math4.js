/* ---------- math4: 20 puzzle and real-life topics, 4 for each world ---------- */
// Included right after math3.js. Everything lives inside this function so its helper names never clash with other files.
(() => {
const K = '#22305A';
// Every topic goes through S4: if any answer button needs the smaller text size, all of them get it.
const S4 = (id, w, name, ico, lesson, gen) => S(id, w, name, ico, lesson, L => { const q = gen(L); if (q.choices.some(c => c.txt)) q.choices.forEach(c => { c.txt = true; }); return q; });
const C4 = (val, html, say) => ({ html: String(html), val: String(val), say: String(say), txt: String(html).replace(/<[^>]+>/g, '').length > 3 });
const T = (x, y, s, o = {}) => `<text x="${+(+x).toFixed(1)}" y="${+(+y).toFixed(1)}" font-size="${o.size || 14}" font-weight="${o.w || 800}" text-anchor="${o.anchor || 'middle'}" fill="${o.fill || K}"${o.halo === false ? '' : ' stroke="#fff" stroke-width="3" stroke-linejoin="round" paint-order="stroke"'}>${s}</text>`;
const E = (x, y, e, size = 24) => `<text x="${+(+x).toFixed(1)}" y="${+(+y).toFixed(1)}" font-size="${size}" text-anchor="middle" dominant-baseline="central">${e}</text>`;
const box = (vb, body, label, cls = '') => `<div class="shape wide-shape m4svg ${cls}"><svg viewBox="${vb}" role="img" aria-label="${label}">${body}</svg></div>`;
const row = (...a) => `<div class="m4row">${a.join('')}</div>`;
const stack = (...a) => `<div class="m4stack">${a.join('')}</div>`;
const card = (title, lines, cls = '') => `<div class="m4card ${cls}">${title ? `<b class="m4ct">${title}</b>` : ''}<ul>${lines.map(l => Array.isArray(l) ? `<li class="${l[1]}">${l[0]}</li>` : `<li>${l}</li>`).join('')}</ul></div>`;
const seq = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i).join(', ');
const pl = (n, one, many = one + 's') => `${fmt(n)} ${n === 1 ? one : many}`;
const nOpts = (ans, lo, hi, n = 4, extra = []) => opts(ans, [...extra, ...near(ans)].filter(v => Number.isInteger(v) && v >= lo && v <= hi && v !== ans), n);
const sing = w => w.endsWith('ies') ? w.slice(0, -3) + 'y' : w.endsWith('oes') ? w.slice(0, -2) : w.endsWith('s') ? w.slice(0, -1) : w;
const sum = a => a.reduce((x, y) => x + y, 0);
const cap4 = s => s[0].toUpperCase() + s.slice(1);
// Money is kept in whole cents so it never picks up floating-point dust.
const usd = c => { const a = Math.abs(Math.round(c)); return (c < 0 ? '−' : '') + '$' + (a % 100 ? (a / 100).toFixed(2) : a / 100); };
const usd2 = c => (c < 0 ? '−' : '') + '$' + (Math.abs(Math.round(c)) / 100).toFixed(2);
const usdSay = c => { const a = Math.abs(Math.round(c)), d = Math.floor(a / 100), ct = a % 100; return ((c < 0 ? 'minus ' : '') + (d ? `${d} dollar${d === 1 ? '' : 's'}` : '') + (d && ct ? ' and ' : '') + (ct ? `${ct} cent${ct === 1 ? '' : 's'}` : '')) || '0 dollars'; };
const mOpts = (ans, cands, show = usd) => opts(ans, cands.map(v => Math.round(v)).filter(v => v > 0 && v !== ans), 4, show, usdSay);
const dOpts = (ans, cands) => opts(ans, cands.filter(v => Number.isInteger(v) && v > 0 && v !== ans), 4, v => '$' + v, v => pl(v, 'dollar'));
const NAMES4 = ['Mia', 'Leo', 'Ava', 'Sam', 'Zoe', 'Kai', 'Noah', 'Lily', 'Omar', 'Ruby'];

/* ===================== Seedling Hill (world 0) ===================== */

const BAKE = [['🍪', 'cookies'], ['🧁', 'cupcakes'], ['🍩', 'donuts'], ['🥐', 'croissants'], ['🥚', 'eggs'], ['🍓', 'strawberries'], ['🥕', 'carrots'], ['🍋', 'lemons'], ['🥨', 'pretzels']];
const tray = (n, e, o = {}) => {
  const slots = o.slots || n, cols = o.cols || Math.min(5, Math.max(1, slots)), gone = o.gone || 0;
  return `<div class="m4tray${o.box ? ' box' : ''}" style="grid-template-columns:repeat(${cols},1fr)">${Array.from({ length: slots }, (_, i) => {
    const cls = i >= n ? 'e' : i >= n - gone ? 'g' : '', num = o.num && i < n - gone ? `<sup>${(o.from || 0) + i + 1}</sup>` : o.numEmpty && i >= n ? `<sup>${i - n + 1}</sup>` : '';
    return `<span class="${cls}">${i < n ? e : ''}${num}</span>`; }).join('')}</div>`;
};
S4('kitchen', 0, 'Kitchen counting', '🍪', [
  ['Count the cookies on the tray. Touch each one just once.', () => tray(4, '🍪', { num: true })],
  ['Two trays? Count the first tray, then keep counting on the next one.', () => row(tray(3, '🧁', { num: true }), tray(2, '🧁', { num: true, from: 3 }))],
  ['Empty spots show how many more will fit.', () => tray(4, '🥚', { slots: 6, cols: 3, box: true, numEmpty: true })]
], L => {
  const [e, many] = pick(BAKE);
  if (L <= 2) {
    const n = L === 1 ? rnd(1, 5) : rnd(5, 10);
    return Q({ prompt: `How many ${e}?`, speak: `How many ${many} are on the tray?`, visual: tray(n, e), choices: nOpts(n, 1, 12, L === 1 ? 3 : 4), answer: n,
      explain: tray(n, e, { num: true }), explainText: `Touch each one and count: ${seq(1, n)}. There ${n === 1 ? `is just 1` : `are ${n} ${many}`}.` });
  }
  if (L === 3) {
    const a = rnd(1, 5), b = rnd(1, Math.min(5, 10 - a)), t = a + b;
    return Q({ prompt: `How many ${e} on both trays?`, speak: `How many ${many} are on both trays altogether?`, visual: row(tray(a, e), tray(b, e)), choices: nOpts(t, 1, 12, 4, [a, b, t + 1]), answer: t,
      explain: row(tray(a, e, { num: true }), tray(b, e, { num: true, from: a })), explainText: `${a} on the first tray. Keep counting on the next tray: ${seq(a + 1, t)}. That makes ${t}.` });
  }
  if (L === 4) {
    const n = rnd(4, 9), k = rnd(1, 3), r = n - k;
    return Q({ prompt: `Owl ate ${k}. How many ${e} are left?`, speak: `There were ${n} ${many} on the tray. Owl ate ${k}. How many are left?`, visual: tray(n, e, { gone: k }), choices: nOpts(r, 0, 10, 4, [n, k, r + 1]), answer: r,
      explain: tray(n, e, { gone: k, num: true }), explainText: `Count the ones still on the tray: ${seq(1, r)}. ${n} take away ${k} leaves ${r}.` });
  }
  if (Math.random() < 0.5) {
    const [slots, cols] = pick([[6, 3], [10, 5], [12, 6]]), n = rnd(1, slots - 1), r = slots - n;
    return Q({ prompt: `How many more ${e} will fit?`, speak: `How many more ${many} will fit on the tray?`, visual: tray(n, e, { slots, cols, box: true }), choices: nOpts(r, 1, 12, 4, [n, slots, r + 1]), answer: r,
      explain: tray(n, e, { slots, cols, box: true, numEmpty: true }), explainText: `Count the empty spots: ${seq(1, r)}. ${r} more will fit, then the tray is full with ${slots}.` });
  }
  const t = rnd(2, 4), per = pick([2, 5]), tot = t * per;
  return Q({ prompt: `${t} trays with ${per} on each. How many ${e}?`, speak: `There are ${t} trays with ${per} ${many} on each tray. How many altogether?`, visual: row(...Array.from({ length: t }, () => tray(per, e))), choices: nOpts(tot, 2, 25, 4, [tot + per, tot - per, t + per]), answer: tot,
    explain: row(...Array.from({ length: t }, (_, i) => tray(per, e, { num: true, from: i * per }))), explainText: `Count by ${per}s, one tray at a time: ${Array.from({ length: t }, (_, i) => (i + 1) * per).join(', ')}. That makes ${tot}.` });
});

/* --- shape hunt --- */
const HUNT = {
  circle: [['⚽', 'a ball'], ['🍩', 'a donut'], ['🍪', 'a cookie'], ['🕒', 'a clock'], ['🍊', 'an orange'], ['🏀', 'a basketball']],
  triangle: [['🍕', 'a pizza slice'], ['⛺', 'a tent'], ['🧀', 'a cheese wedge'], ['⚠️', 'a warning sign']],
  square: [['🎁', 'a present'], ['📦', 'a box'], ['🧇', 'a waffle'], ['🎲', 'a dice']],
  rectangle: [['🚪', 'a door'], ['📱', 'a phone'], ['📕', 'a book'], ['💵', 'a banknote']]
};
const SHAPE_HINT = { circle: 'It is round, with no corners.', triangle: 'It has 3 sides and 3 corners.', square: 'It has 4 sides, all the same length.', rectangle: 'It has 4 sides: 2 long and 2 short.' };
const DRAW = {
  circle: [
    (x, y) => `<circle cx="${x}" cy="${y}" r="24" fill="#F2604F" stroke="${K}" stroke-width="2.5"/><path d="M${x - 24} ${y} Q${x} ${y - 14} ${x + 24} ${y}" fill="none" stroke="#fff" stroke-width="3"/>`,
    (x, y) => `<circle cx="${x}" cy="${y}" r="24" fill="#fff" stroke="${K}" stroke-width="3"/><path d="M${x} ${y} V${y - 15} M${x} ${y} H${x + 11}" stroke="${K}" stroke-width="3" stroke-linecap="round"/>`,
    (x, y) => `<circle cx="${x}" cy="${y + 2}" r="22" fill="#FF8A2B" stroke="${K}" stroke-width="2.5"/><path d="M${x} ${y - 20} q6 -8 13 -6" fill="none" stroke="#2FA36B" stroke-width="4" stroke-linecap="round"/>`,
    (x, y) => `<circle cx="${x}" cy="${y}" r="22" fill="#2E8BE6" stroke="${K}" stroke-width="2.5"/>${[[-6, -6], [6, -6], [-6, 6], [6, 6]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r="3" fill="#fff"/>`).join('')}`
  ],
  triangle: [
    (x, y) => `<polygon points="${x - 24},${y - 20} ${x + 24},${y - 20} ${x},${y + 26}" fill="#FFC23D" stroke="${K}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${x - 8}" cy="${y - 9}" r="4" fill="#F2604F"/><circle cx="${x + 8}" cy="${y - 8}" r="4" fill="#F2604F"/><circle cx="${x}" cy="${y + 6}" r="4" fill="#F2604F"/>`,
    (x, y) => `<polygon points="${x},${y - 26} ${x - 28},${y + 22} ${x + 28},${y + 22}" fill="#2FA36B" stroke="${K}" stroke-width="2.5" stroke-linejoin="round"/><path d="M${x} ${y - 4} L${x - 8} ${y + 22} M${x} ${y - 4} L${x + 8} ${y + 22}" stroke="${K}" stroke-width="2"/>`,
    (x, y) => `<polygon points="${x},${y - 24} ${x - 20},${y + 24} ${x + 20},${y + 24}" fill="#6D55D1" stroke="${K}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${x}" cy="${y - 26}" r="5" fill="#FFC23D" stroke="${K}" stroke-width="1.5"/>`
  ],
  square: [
    (x, y) => `<rect x="${x - 24}" y="${y - 24}" width="48" height="48" fill="#D9EBFC" stroke="${K}" stroke-width="3"/><path d="M${x} ${y - 24} V${y + 24} M${x - 24} ${y} H${x + 24}" stroke="${K}" stroke-width="2.5"/>`,
    (x, y) => `<rect x="${x - 23}" y="${y - 23}" width="46" height="46" fill="#F2604F" stroke="${K}" stroke-width="2.5"/><path d="M${x} ${y - 23} V${y + 23} M${x - 23} ${y} H${x + 23}" stroke="#FFC23D" stroke-width="5"/>`,
    (x, y) => `<rect x="${x - 24}" y="${y - 24}" width="48" height="48" fill="#FFF1CC" stroke="#B5651D" stroke-width="4"/><path d="M${x - 18} ${y + 16} L${x - 4} ${y - 4} L${x + 4} ${y + 6} L${x + 10} ${y - 2} L${x + 18} ${y + 16} Z" fill="#2FA36B"/>`
  ],
  rectangle: [
    (x, y) => `<rect x="${x - 17}" y="${y - 30}" width="34" height="60" fill="#B5651D" stroke="${K}" stroke-width="2.5"/><circle cx="${x + 9}" cy="${y + 2}" r="3" fill="#FFC23D"/>`,
    (x, y) => `<rect x="${x - 28}" y="${y - 18}" width="56" height="36" fill="#2E8BE6" stroke="${K}" stroke-width="2.5"/><path d="M${x - 20} ${y - 18} V${y + 18}" stroke="#fff" stroke-width="2.5"/>`,
    (x, y) => `<rect x="${x - 30}" y="${y - 20}" width="60" height="40" rx="3" fill="${K}"/><rect x="${x - 25}" y="${y - 15}" width="50" height="30" fill="#7CC8F5"/>`
  ]
};
// A room with things in a grid of slots. hi = the shape kinds to ring and number in the answer.
function room(items, hi = []) {
  const cols = items.length <= 6 ? 3 : 4, rows = Math.ceil(items.length / cols), W = cols * 80 + 20, H = rows * 80 + 20;
  let g = `<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="14" fill="#FFF6E0" stroke="${K}" stroke-width="2"/>`, k = 0;
  items.forEach(([kind, i], j) => {
    const x = 50 + (j % cols) * 80, y = 50 + Math.floor(j / cols) * 80;
    g += DRAW[kind][i](x, y);
    if (hi.includes(kind)) { k++; g += `<circle cx="${x}" cy="${y}" r="36" fill="none" stroke="#F2604F" stroke-width="3" stroke-dasharray="6 4"/><circle cx="${x + 28}" cy="${y - 28}" r="10" fill="#F2604F"/>${T(x + 28, y - 23.5, k, { size: 13, fill: '#fff', halo: false })}`; }
  });
  return box(`0 0 ${W} ${H}`, g, 'a room full of things to find');
}
const roomItems = (n, want) => { // want: {kind: count}; the rest are other kinds
  const list = [], others = Object.keys(DRAW).filter(k => !(k in want));
  for (const [k, c] of Object.entries(want)) for (let i = 0; i < c; i++) list.push(k);
  while (list.length < n) list.push(pick(others));
  return shuffle(list).map(k => [k, rnd(0, DRAW[k].length - 1)]);
};
S4('shapehunt', 0, 'Shape hunt', '🔍', [
  ['Shapes are all around us! A clock is a circle. A door is a rectangle.', () => room([['circle', 1], ['rectangle', 0], ['triangle', 1]])],
  ['A slice of pizza is a triangle. A window is a square.', () => room([['triangle', 0], ['square', 0], ['circle', 0]])],
  ['To find every circle, look along each row and touch each one as you count.', () => room([['circle', 0], ['square', 1], ['circle', 2], ['triangle', 2], ['rectangle', 1], ['circle', 3]], ['circle'])]
], L => {
  if (L <= 2) {
    const kinds = Object.keys(HUNT), tgt = L === 1 ? 'circle' : pick(kinds);
    const others = kinds.filter(k => k !== tgt && !(tgt === 'square' && k === 'rectangle') && !(tgt === 'rectangle' && k === 'square'));
    const [ae, an] = pick(HUNT[tgt]), wrong = shuffle(others).slice(0, L === 1 ? 2 : 3).map(k => pick(HUNT[k]));
    const ch = shuffle([[ae, an], ...wrong]).map(([e, n]) => C4(n, `<span class="m4emo">${e}</span>`, n));
    return Q({ prompt: L === 1 ? 'Which one is round like a circle?' : `Which one is shaped like a ${tgt}?`, speak: L === 1 ? 'Which one is round like a circle?' : `Which one is shaped like a ${tgt}?`,
      visual: shapeSVG(tgt, '#FFC23D'), choices: ch, answer: an, explain: `<span class="m4emo big">${ae}</span>`, explainText: `${an[0].toUpperCase() + an.slice(1)} is shaped like a ${tgt}. ${SHAPE_HINT[tgt]}` });
  }
  if (L === 5 && Math.random() < 0.5) {
    const c = rnd(2, 4), t = rnd(1, c - 1), items = roomItems(8, { circle: c, triangle: t }), d = c - t;
    return Q({ prompt: 'How many more circles than triangles?', speak: 'Look at the room. How many more circles are there than triangles?', visual: room(items), choices: nOpts(d, 0, 8, 4, [c, t, c + t]), answer: d,
      explain: room(items, ['circle']) + room(items, ['triangle']), explainText: `There are ${c} circles and ${t} ${t === 1 ? 'triangle' : 'triangles'}. ${c} take away ${t} is ${d}, so there ${d === 1 ? 'is 1 more circle' : `are ${d} more circles`}.` });
  }
  if (L === 5) {
    const s = rnd(0, 3), r = rnd(s ? 0 : 1, 3), items = roomItems(8, { square: s, rectangle: r }), n = s + r;
    return Q({ prompt: 'How many things have 4 corners?', speak: 'Look at the room. How many things have 4 corners? Squares and rectangles both count!', visual: room(items), choices: nOpts(n, 0, 8, 4, [s, r, n + 1]), answer: n,
      explain: room(items, ['square', 'rectangle']), explainText: `Squares and rectangles both have 4 corners. There ${s === 1 ? 'is 1 square' : `are ${s} squares`} and ${r === 1 ? '1 rectangle' : `${r} rectangles`}: ${n} altogether.` });
  }
  const tgt = L === 3 ? pick(['circle', 'triangle']) : pick(Object.keys(DRAW)), n = L === 3 ? rnd(1, 3) : rnd(1, 4), items = roomItems(L === 3 ? 6 : 8, { [tgt]: n });
  return Q({ prompt: `How many ${tgt}s can you find?`, speak: `Look at the room. How many things are shaped like a ${tgt}?`, visual: room(items), choices: nOpts(n, 0, 8, L === 3 ? 3 : 4), answer: n,
    explain: room(items, [tgt]), explainText: `${SHAPE_HINT[tgt]} Count them: ${seq(1, n)}. There ${n === 1 ? `is 1 ${tgt}` : `are ${n} ${tgt}s`}.` });
});

/* --- sharing fairly --- */
const TOYS = [['🧸', 'Teddy'], ['🐰', 'Bunny'], ['🐶', 'Puppy'], ['🦆', 'Duck'], ['🐱', 'Kitty'], ['🐸', 'Froggy'], ['🐵', 'Monkey'], ['🐷', 'Piggy']];
const SNACK = [['🍓', 'strawberries'], ['🍪', 'cookies'], ['🥕', 'carrots'], ['🍒', 'cherries'], ['🍌', 'bananas'], ['🍬', 'sweets'], ['🍇', 'grapes'], ['🧁', 'cupcakes']];
const toy = ([e, name], n, f) => `<div class="m4toy"><span class="t">${e}</span><div class="m4plate">${`<i>${f}</i>`.repeat(n)}</div><small>${name}</small></div>`;
const pile = (n, f, lab = '') => n ? `<div class="m4pile">${`<i>${f}</i>`.repeat(n)}${lab ? `<small>${lab}</small>` : ''}</div>` : '';
const party = (toys, counts, f, left = 0, lab = '') => `<div class="m4party">${pile(left, f, lab)}<div class="m4toys">${toys.map((t, i) => toy(t, counts[i], f)).join('')}</div></div>`;
S4('fairshare', 0, 'Sharing fairly', '🧸', [
  ['Fair means everyone gets the same.', () => party(TOYS.slice(0, 2), [3, 3], '🍓')],
  ['To share, give one to each toy, then go round again until they are all gone.', () => party(TOYS.slice(2, 4), [0, 0], '🍪', 6, 'to share') + party(TOYS.slice(2, 4), [3, 3], '🍪')],
  ['Sometimes one is left over. Nobody gets it, so it stays fair!', () => party(TOYS.slice(0, 2), [2, 2], '🍒', 1, 'left over')]
], L => {
  const [f, many] = pick(SNACK), k = L <= 2 || L === 4 ? 2 : pick([2, 3]), toys = shuffle(TOYS).slice(0, k), A = toys[0][1], B = toys[1][1], who = toys.map(t => t[1]);
  const names = k === 2 ? `${A} and ${B}` : `${who[0]}, ${who[1]} and ${who[2]}`;
  if (L === 1) {
    const a = rnd(1, 5), b = Math.random() < 0.5 ? a : pick([1, 2, 3, 4, 5].filter(v => v !== a)), fair = a === b;
    return Q({ prompt: 'Is it fair?', speak: `Look at ${A}'s plate and ${B}'s plate. Is it fair?`, visual: party(toys, [a, b], f), choices: shuffle([C4('fair', 'Fair 👍', 'fair'), C4('unfair', 'Not fair 👎', 'not fair')]), answer: fair ? 'fair' : 'unfair',
      explainText: `${A} has ${a} and ${B} has ${b}. ${fair ? 'They have the same, so it is fair!' : 'They do not have the same, so it is not fair.'}` });
  }
  if (L === 4) {
    const b = rnd(0, 3), g = rnd(1, 3), a = b + 2 * g, m = b + g;
    return Q({ prompt: `${A} has more. How many should ${A} give to ${B} to make it fair?`, speak: `${A} has ${a} ${many}. ${B} has ${b}. How many should ${A} give to ${B} so it is fair?`, visual: party(toys, [a, b], f), choices: nOpts(g, 1, 8, 4, [a - b, b, a]), answer: g,
      explain: party(toys, [m, m], f), steps: [`${A} has ${a} and ${B} has ${b}. Together that is ${a + b}.`, `Fair is ${m} each.`, `${A} gives ${g} to ${B}. Now both have ${m}.`], explainText: `${A} should give ${g}.` });
  }
  const each = L === 2 ? rnd(1, 4) : k === 2 ? rnd(2, 6) : rnd(1, 4), left = L === 5 ? rnd(0, k - 1) : 0, tot = each * k + left;
  const askLeft = L === 5 && left > 0 && Math.random() < 0.5, ans = askLeft ? left : each;
  return Q({ prompt: askLeft ? `Share ${tot} ${f} fairly. How many are left over?` : `Share ${tot} ${f} fairly. How many does each toy get?`, speak: `Share ${tot} ${many} fairly between ${names}. ${askLeft ? 'How many are left over?' : 'How many does each toy get?'}`,
    visual: party(toys, toys.map(() => 0), f, tot, 'to share'), choices: nOpts(ans, askLeft ? 0 : 1, 12, L === 2 ? 3 : 4, [tot, each + 1, k]), answer: ans,
    explain: party(toys, toys.map(() => each), f, left, 'left over'), explainText: `Give one to each toy and go round again. Each toy gets ${each}${left ? `, and ${left} ${left === 1 ? 'is' : 'are'} left over` : ''}. ${askLeft ? `So ${left} left over.` : `So each gets ${each}.`}` });
});

/* --- maze steps --- */
const BUGS = [['🐞', 'ladybug', '🍃', 'leaf'], ['🐰', 'bunny', '🥕', 'carrot'], ['🐝', 'bee', '🌸', 'flower'], ['🐢', 'turtle', '🍓', 'strawberry'], ['🐭', 'mouse', '🧀', 'cheese'], ['🐶', 'puppy', '🦴', 'bone']];
const walk = moves => { let c = 0, r = 0; const out = [[0, 0]]; for (const m of moves) { c += m === 'R' ? 1 : m === 'L' ? -1 : 0; r += m === 'D' ? 1 : m === 'U' ? -1 : 0; out.push([c, r]); } return out; };
function maze(paths, bug, o = {}) {
  const all = paths.flatMap(p => p.cells), minC = Math.min(...all.map(p => p[0])), maxC = Math.max(minC + 4, ...all.map(p => p[0]));
  let minR = Math.min(...all.map(p => p[1])), maxR = Math.max(...all.map(p => p[1]));
  while (maxR - minR < 2) { if ((maxR - minR) % 2) maxR++; else { minR--; maxR++; } }
  const cols = maxC - minC + 1, rows = maxR - minR + 1, s = Math.min(40, 300 / cols), X = c => 4 + (c - minC) * s, Y = r => 4 + (r - minR) * s;
  let g = '';
  for (let c = minC; c <= maxC; c++) for (let r = minR; r <= maxR; r++) g += `<rect x="${X(c)}" y="${Y(r)}" width="${s}" height="${s}" fill="#EAF6EC" stroke="#B9DCC3" stroke-width="1.5"/>`;
  if (paths.length === 1) {
    const p = paths[0].cells;
    p.forEach(([c, r], i) => { g += `<rect x="${X(c) + 2}" y="${Y(r) + 2}" width="${s - 4}" height="${s - 4}" rx="6" fill="#FFE9A8"/>`; if (o.nums && i) g += T(X(c) + 10, Y(r) + 14, i, { size: 12, fill: '#F2604F' }); });
  } else paths.forEach(({ cells, col }, j) => {
    const off = (j ? 4 : -4);
    g += `<polyline points="${cells.map(([c, r]) => `${X(c) + s / 2 + off},${Y(r) + s / 2 + off}`).join(' ')}" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/>`;
    if (o.nums) cells.forEach(([c, r], i) => { if (i && i < cells.length - 1) g += `<circle cx="${X(c) + s / 2 + off * 2.4}" cy="${Y(r) + s / 2 + off * 2.4}" r="7" fill="${col}"/>${T(X(c) + s / 2 + off * 2.4, Y(r) + s / 2 + off * 2.4 + 3.5, i, { size: 9, fill: '#fff', halo: false })}`; });
  });
  const st = paths[0].cells[0], en = paths[0].cells.at(-1);
  g += E(X(st[0]) + s / 2, Y(st[1]) + s / 2 + 1, bug[0], s * 0.62) + E(X(en[0]) + s * 0.58, Y(en[1]) + s * 0.58, bug[2], s * 0.5);
  return box(`0 0 ${cols * s + 8} ${rows * s + 8}`, g, `grid path from the ${bug[1]} to the ${bug[3]}`);
}
const mv = (...parts) => parts.map(([d, n]) => d.repeat(n)).join('');
S4('mazesteps', 0, 'How many steps?', '🐾', [
  ['Each move onto the next square is one step.', () => maze([{ cells: walk('RRR') }], BUGS[1], { nums: true })],
  ['Count the squares you move onto. Do not count the square you start on!', () => maze([{ cells: walk('RRDD') }], BUGS[2], { nums: true })],
  ['Two ways to go? Count both. The smaller number is the shorter way.', () => maze([{ cells: walk('RRRDD'), col: '#F2604F' }, { cells: walk('DDDRRRU'), col: '#2E8BE6' }], BUGS[0], { nums: true })]
], L => {
  const bug = pick(BUGS), V = pick(['U', 'D']);
  if (L <= 4) {
    const moves = L === 1 ? mv(['R', rnd(1, 4)]) : L === 2 ? mv(['R', rnd(4, 7)]) : L === 3 ? mv(['R', rnd(1, 4)], [V, rnd(1, 3)]) : mv(['R', rnd(1, 3)], [V, rnd(1, 2)], ['R', rnd(1, 3)], [pick(['', V]), rnd(1, 2)]);
    const cells = walk(moves), n = moves.length;
    return Q({ prompt: `How many steps to the ${bug[2]}?`, speak: `How many steps does the ${bug[1]} take to get to the ${bug[3]}?`, visual: maze([{ cells }], bug), choices: nOpts(n, 1, 12, L === 1 ? 3 : 4, [n + 1, n - 1]), answer: n,
      explain: maze([{ cells }], bug, { nums: true }), explainText: `Count each square the ${bug[1]} moves onto: ${seq(1, n)}. That is ${n} step${n > 1 ? 's' : ''}.` });
  }
  const a = rnd(2, 4), b = rnd(1, 3), short = mv(['R', a], [V, b]), det = rnd(1, 2), W = V === 'D' ? 'U' : 'D';
  const long = Math.random() < 0.5 ? mv([W, det], ['R', a], [V, b + det]) : mv(['R', a + det], [V, b], ['L', det]);
  const redShort = Math.random() < 0.5, red = redShort ? short : long, blue = redShort ? long : short;
  const paths = [{ cells: walk(red), col: '#F2604F' }, { cells: walk(blue), col: '#2E8BE6' }];
  return Q({ prompt: 'Which path is shorter?', speak: `The ${bug[1]} can take the red path or the blue path to the ${bug[3]}. Which path is shorter?`, visual: maze(paths, bug), choices: shuffle([C4('red', '<span class="m4c red">Red</span>', 'red'), C4('blue', '<span class="m4c blue">Blue</span>', 'blue')]), answer: redShort ? 'red' : 'blue',
    explain: maze(paths, bug, { nums: true }), explainText: `Red path: ${red.length} steps. Blue path: ${blue.length} steps. ${Math.min(red.length, blue.length)} is fewer, so the ${redShort ? 'red' : 'blue'} path is shorter.` });
});

/* ===================== Sprout Valley (world 1) ===================== */

const riddle = clues => card('🕵️ Who am I?', clues, 'riddle');
S4('riddles', 1, 'Number riddles', '🕵️', [
  ['A number riddle gives you clues. "I am 2 more than 5." Start at 5 and count on 2: 6, 7. I am 7!', () => riddle(['I am 2 more than 5.'])],
  ['Some riddles have two clues. Check each answer against every clue.', () => riddle(['I am an even number.', 'I am more than 10 and less than 13.'])],
  ['Work backwards! "Double me and you get 10." Half of 10 is 5, so I am 5.', () => riddle(['If you double me, you get 10.'])]
], L => {
  const ask = (clues, ans, choices, o = {}) => Q({ prompt: 'Who am I?', speak: `Number riddle! ${clues.join(' ')} What number am I?`, visual: riddle(clues), choices, answer: ans, steps: o.steps || null, explainText: o.ex });
  if (L === 1) {
    const base = rnd(1, 8), d = pick([1, 2]), more = base + d <= 10 && (base - d < 0 || Math.random() < 0.6), ans = more ? base + d : base - d;
    return ask([`I am ${d} ${more ? 'more' : 'less'} than ${base}.`], ans, nOpts(ans, 0, 12, 3, [base, more ? base - d : base + d]),
      { ex: `Start at ${base} and count ${more ? 'on' : 'back'} ${d}: ${more ? seq(base + 1, ans) : Array.from({ length: d }, (_, i) => base - 1 - i).join(', ')}. I am ${ans}.` });
  }
  if (L === 2) {
    const k = pick(['ten', 'after', 'before', 'between', 'less']);
    if (k === 'ten') { const b = rnd(1, 9), a = b + 10; return ask([`I am 10 more than ${b}.`], a, nOpts(a, 0, 25, 4, [b + 1, b, 20 + b]), { ex: `10 more than ${b} is 1 ten and ${b} ones: ${a}.` }); }
    if (k === 'after' || k === 'before') { const b = rnd(5, 19), a = k === 'after' ? b + 1 : b - 1; return ask([`I come just ${k} ${b}.`], a, nOpts(a, 0, 25, 4, [b, k === 'after' ? b - 1 : b + 1, a + 10]), { ex: `Just ${k} ${b} on the number line is ${a}.` }); }
    if (k === 'between') { const a = rnd(2, 19); return ask([`I am between ${a - 1} and ${a + 1}.`], a, nOpts(a, 0, 25, 4, [a - 1, a + 1, a + 2]), { ex: `The only number between ${a - 1} and ${a + 1} is ${a}.` }); }
    const b = rnd(10, 20), d = rnd(2, 5), a = b - d;
    return ask([`I am ${d} less than ${b}.`], a, nOpts(a, 0, 25, 4, [b + d, b, a + 1]), { ex: `Count back ${d} from ${b}: ${Array.from({ length: d }, (_, i) => b - 1 - i).join(', ')}. I am ${a}.` });
  }
  if (L === 3) {
    const a = rnd(6, 40), lo = a - rnd(1, 3), hi = a + rnd(1, 3), odd = a % 2 === 1;
    const clues = [`I am an ${odd ? 'odd' : 'even'} number.`, `I am more than ${lo} and less than ${hi}.`], fits = v => v % 2 === a % 2 && v > lo && v < hi;
    const wrong = [a - 1, a + 1, lo, hi, a - 2, a + 2, lo - 1, hi + 1, a + 10, a - 10].filter(v => v > 0 && !fits(v));
    return ask(clues, a, opts(a, wrong, 4), { steps: [`Numbers more than ${lo} and less than ${hi}: ${seq(lo + 1, hi - 1)}.`, `Which of those are ${odd ? 'odd' : 'even'} and on a button?`], ex: `Only ${a} fits both clues.` });
  }
  if (L === 4) {
    const k = pick(['to', 'more', 'sum']);
    if (k === 'to') { const t = rnd(1, 9), o = pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(v => v !== t)), a = 10 * t + o; return ask([`I have ${t} tens and ${o} ones.`], a, opts(a, [10 * o + t, t + o, a + 10, a - 10, 100 * t + o].filter(v => v > 0)), { ex: `${t} tens is ${10 * t}. Add ${o} ones: ${10 * t} + ${o} = ${a}.` }); }
    if (k === 'more') { const t = rnd(1, 7), d = rnd(1, 9 - t), o = t + d, a = 10 * t + o; return ask([`My tens digit is ${t}.`, `My ones digit is ${d} more than my tens digit.`], a, opts(a, [10 * t + d, 10 * o + t, 11 * t, a + 1, a - 1].filter(v => v > 0 && v !== a)), { steps: [`Tens digit: ${t}.`, `Ones digit: ${t} + ${d} = ${o}.`], ex: `I am ${a}.` }); }
    const t = rnd(1, 8), o = rnd(0, 9), s = t + o, a = 10 * t + o;
    const wrong = [10 * o + t, 10 * (t + 1) + o - 1, 10 * (t - 1) + o + 1, a + 1, a - 1, a + 2].filter(v => v > 9 && v < 100 && v !== a && !(Math.floor(v / 10) === t && (v % 10) + t === s));
    return ask([`I am between ${10 * t} and ${10 * t + 10}.`, `My digits add up to ${s}.`], a, opts(a, wrong, 4), { steps: [`Between ${10 * t} and ${10 * t + 10}, my tens digit is ${t}.`, `${t} + ? = ${s}, so my ones digit is ${o}.`], ex: `I am ${a}.` });
  }
  const k = pick(['double', 'half', 'add', 'take', 'dplus']);
  if (k === 'double') { const x = rnd(3, 15); return ask([`If you double me, you get ${2 * x}.`], x, nOpts(x, 1, 60, 4, [4 * x, 2 * x, x + 2]), { ex: `Work backwards: half of ${2 * x} is ${x}. Check: ${x} + ${x} = ${2 * x}.` }); }
  if (k === 'half') { const h = rnd(3, 15); return ask([`Half of me is ${h}.`], 2 * h, nOpts(2 * h, 1, 60, 4, [h, h + 2, 2 * h + 2]), { ex: `Work backwards: double ${h} is ${2 * h}. Check: half of ${2 * h} is ${h}.` }); }
  if (k === 'add') { const a = rnd(3, 9), b = rnd(a + 3, 25), x = b - a; return ask([`If you add ${a} to me, you get ${b}.`], x, nOpts(x, 0, 60, 4, [a + b, b, x + 2]), { ex: `Work backwards: take ${a} away from ${b}. ${b} − ${a} = ${x}.` }); }
  if (k === 'take') { const a = rnd(3, 9), b = rnd(3, 20), x = a + b; return ask([`If you take ${a} away from me, you get ${b}.`], x, nOpts(x, 0, 60, 4, [b - a, b, x + 2].filter(v => v >= 0)), { ex: `Work backwards: add ${a} back on. ${b} + ${a} = ${x}.` }); }
  const a = rnd(1, 5), b = rnd(2, 9), x = 2 * b + a;
  return ask([`I am ${a} more than double ${b}.`], x, nOpts(x, 0, 60, 4, [b + a, 2 * (b + a), x + 2]), { steps: [`Double ${b} is ${2 * b}.`, `${a} more: ${2 * b} + ${a} = ${x}.`], ex: `I am ${x}.` });
});

/* --- shopping list --- */
const SHOP = [['🍎', 'apple', 1, 3], ['🍌', 'banana', 1, 2], ['🥛', 'milk', 2, 4], ['🍞', 'bread', 2, 5], ['🧀', 'cheese', 3, 6], ['🥚', 'egg box', 2, 5], ['🍪', 'cookie pack', 1, 4], ['🧃', 'juice box', 1, 3], ['🍦', 'ice cream', 2, 5], ['🥕', 'carrot bag', 1, 3]];
const shelf = (items, show = p => '$' + p) => `<div class="m4shelf">${items.map(([e, , p]) => `<span><i>${e}</i><b>${show(p)}</b></span>`).join('')}</div>`;
const shopList = list => `<div class="m4list"><b>📝 List</b><span>${list.join(' ')}</span></div>`;
const cash = c => `<div class="m4cash">💵 You pay ${c}</div>`;
const listSay = (items, counts) => items.map(([, n], i) => `${counts[i]} ${n}${counts[i] > 1 ? (n.endsWith('x') ? 'es' : n === 'bread' || n === 'milk' || n === 'cheese' ? '' : 's') : ''}`).join(' and ');
S4('shoplist', 1, 'Shopping list', '🛒', [
  ['Look at the list. Find each thing on the shelf and read its price tag.', () => shelf([['🍎', 'apple', 2], ['🥛', 'milk', 3]]) + shopList(['🍎', '🥛'])],
  ['Add the prices together: $2 + $3 = $5.', () => '<span class="expr">$2 + $3 = $5</span>'],
  ['Pay with a note and get change back: $10 − $5 = $5 change.', () => cash('$10') + '<span class="expr">$10 − $5 = $5</span>']
], L => {
  const n = L === 1 || L === 4 ? 2 : L === 2 ? 3 : L === 3 ? 2 : pick([2, 3]), items = shuffle(SHOP).slice(0, n + (L >= 2 ? 1 : 0)).map(([e, nm, lo, hi]) => [e, nm, rnd(lo, hi)]);
  const buy = items.slice(0, n), counts = buy.map(() => 1);
  if (L === 3 || L === 5) counts[0] = L === 3 ? pick([2, 3]) : rnd(2, 3);
  const tot = sum(buy.map((it, i) => it[2] * counts[i])), list = buy.flatMap((it, i) => Array(counts[i]).fill(it[0]));
  const pay = L === 4 ? 10 : L === 5 ? 20 : 0;
  if (pay && tot >= pay) return MATH.shoplist.gen(L);
  const vis = shelf(shuffle(items)) + shopList(list) + (pay ? cash('$' + pay) : ''), priceSay = items.map(([, nm, p]) => `${cap4(nm)}: ${pl(p, 'dollar')}`).join('. ');
  const addSteps = buy.map((it, i) => counts[i] > 1 ? `${counts[i]} × ${it[0]} = ${counts[i]} × $${it[2]} = $${counts[i] * it[2]}` : `${it[0]} = $${it[2]}`);
  if (!pay) return Q({ prompt: 'How much does the list cost?', speak: `${priceSay}. How much for ${listSay(buy, counts)}?`, visual: vis, choices: dOpts(tot, [tot + 1, tot - 1, tot + 2, sum(buy.map(b => b[2])), tot + 10]), answer: tot,
    steps: [...addSteps, `Add them up: ${buy.map((it, i) => '$' + it[2] * counts[i]).join(' + ')} = $${tot}.`], explainText: `The list costs $${tot}.` });
  const ch = pay - tot;
  return Q({ prompt: `You pay $${pay}. How much change?`, speak: `${priceSay}. You buy ${listSay(buy, counts)} and pay with ${pay} dollars. How much change do you get?`, visual: vis, choices: dOpts(ch, [tot, ch + 1, ch - 1, ch + 2, pay - tot + 10]), answer: ch,
    steps: [...addSteps, `Total: $${tot}.`, `Change: $${pay} − $${tot} = $${ch}.`], explainText: `You get $${ch} change.` });
});

/* --- function machines --- */
const RULE = { add: k => ({ lab: `+ ${k}`, say: `add ${k}`, f: x => x + k, inv: y => y - k, id: '+' + k }), sub: k => ({ lab: `− ${k}`, say: `take away ${k}`, f: x => x - k, inv: y => y + k, id: '-' + k }), dbl: () => ({ lab: '× 2', say: 'double', f: x => 2 * x, inv: y => y / 2, id: 'x2' }), x10: () => ({ lab: '× 10', say: 'times 10', f: x => 10 * x, inv: y => y / 10, id: 'x10' }) };
function machine(inp, rules, out, hiOut = true) {
  const n = rules.length, W = 74 + n * 118 + 62;
  const bub = (x, v, hot) => `<circle cx="${x}" cy="50" r="26" fill="${hot ? '#FFD98A' : '#FFF1CC'}" stroke="${K}" stroke-width="2.5"/>${T(x, 58, v, { size: String(v).length > 2 ? 18 : 22, fill: v === '?' ? '#F2604F' : K })}`;
  let g = bub(32, inp, inp === '?');
  rules.forEach((r, i) => {
    const x = 74 + i * 118;
    g += `<path d="M${x - 14} 50 h10" stroke="${K}" stroke-width="3" stroke-linecap="round"/><path d="M${x - 8} 44 l6 6 l-6 6" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    g += `<rect x="${x}" y="14" width="92" height="72" rx="14" fill="#6D55D1" stroke="${K}" stroke-width="2.5"/><circle cx="${x + 14}" cy="26" r="5" fill="#FFC23D"/><circle cx="${x + 78}" cy="26" r="5" fill="#2FA36B"/>${T(x + 46, 62, r, { size: 24, fill: r === '?' ? '#FFD98A' : '#fff', halo: false })}`;
  });
  const xo = 74 + n * 118 + 30;
  g += `<path d="M${xo - 42} 50 h10" stroke="${K}" stroke-width="3" stroke-linecap="round"/><path d="M${xo - 36} 44 l6 6 l-6 6" fill="none" stroke="${K}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` + bub(xo, out, out === '?' || !hiOut);
  return box(`0 0 ${W} 100`, g, `number machine: ${inp} goes in, ${rules.join(' then ')}, ${out} comes out`);
}
const ioTable = pairs => `<table class="m3tab"><tr><th>In</th>${pairs.map(p => `<td>${p[0]}</td>`).join('')}</tr><tr><th>Out</th>${pairs.map(p => `<td>${p[1]}</td>`).join('')}</tr></table>`;
S4('machine', 1, 'Number machines', '⚙️', [
  ['A number machine does the same thing to every number. This one adds 2.', () => machine(3, ['+ 2'], 5)],
  ['Put 6 in: 6 + 2 = 8 comes out.', () => machine(6, ['+ 2'], 8)],
  ['Find the rule: look at what goes in and what comes out. 4 → 7 and 5 → 8. It adds 3!', () => machine('?', ['?'], '?') + ioTable([[4, 7], [5, 8]])]
], L => {
  if (L <= 2) {
    const r = L === 1 ? RULE.add(rnd(1, 3)) : Math.random() < 0.5 ? RULE.add(rnd(2, 9)) : RULE.sub(rnd(2, 9)), x = L === 1 ? rnd(1, 7) : rnd(r.id[0] === '-' ? 10 : 1, r.id[0] === '-' ? 20 : 11), y = r.f(x);
    return Q({ prompt: 'What comes out?', speak: `${x} goes into the machine. The machine says ${r.say}. What number comes out?`, visual: machine(x, [r.lab], '?'), choices: nOpts(y, 0, 30, L === 1 ? 3 : 4, [r.inv(x), x, y + 1]), answer: y,
      explain: machine(x, [r.lab], y), explainText: `${x} ${r.lab} = ${y}.` });
  }
  if (L === 3) {
    const pool = [RULE.add(rnd(1, 9)), RULE.sub(rnd(1, 5)), RULE.dbl()], r = pick(pool), xs = shuffle(Array.from({ length: 11 }, (_, i) => i + (r.id[0] === '-' ? 6 : 1))).slice(0, 3).sort((a, b) => a - b), pairs = xs.map(x => [x, r.f(x)]);
    const cands = [RULE.add(1), RULE.add(2), RULE.add(3), RULE.add(4), RULE.add(5), RULE.add(10), RULE.sub(1), RULE.sub(2), RULE.sub(3), RULE.dbl(), RULE.add(pairs[0][1] - pairs[0][0] + 1), RULE.add(pairs[1][1] - pairs[1][0])].filter(c => c.id !== r.id && !pairs.every(([a, b]) => c.f(a) === b) && !/-?[-+]-|[-+]0$/.test(c.id));
    const wrong = shuffle(cands).filter((c, i, a) => a.findIndex(d => d.id === c.id) === i).slice(0, 3), all = shuffle([r, ...wrong]);
    return Q({ prompt: 'What does the machine do?', speak: `Look at the numbers that go in and come out. ${pairs.map(([a, b]) => `${a} goes in, ${b} comes out.`).join(' ')} What does the machine do?`, visual: machine('?', ['?'], '?') + ioTable(pairs),
      choices: all.map(c => C4(c.id, c.lab, c.say)), answer: r.id, explain: machine(pairs[0][0], [r.lab], pairs[0][1]),
      explainText: `${pairs.map(([a, b]) => `${a} ${r.lab} = ${b}`).join(', ')}. The machine does ${r.lab} (${r.say}) every time.` });
  }
  if (L === 4) {
    const r = pick([RULE.add(rnd(2, 9)), RULE.sub(rnd(2, 9)), RULE.dbl()]), x = rnd(r.id[0] === '-' ? 10 : 1, r.id === 'x2' ? 12 : 20), y = r.f(x);
    return Q({ prompt: 'What number went in?', speak: `The machine says ${r.say}. ${y} came out. What number went in?`, visual: machine('?', [r.lab], y), choices: nOpts(x, 0, 40, 4, [r.f(y), y, x + 1].filter(v => Number.isInteger(v))), answer: x,
      explain: machine(x, [r.lab], y), steps: [`Work backwards: undo ${r.lab}.`, `${r.id === 'x2' ? `Half of ${y}` : `${y} ${r.id[0] === '+' ? '−' : '+'} ${r.lab.slice(2)}`} = ${x}.`], explainText: `${x} went in. Check: ${x} ${r.lab} = ${y}.` });
  }
  const r1 = pick([RULE.add(rnd(2, 9)), RULE.sub(rnd(1, 5)), RULE.dbl()]), r2 = pick([RULE.add(rnd(2, 9)), RULE.sub(rnd(1, 5)), r1.id === 'x2' ? RULE.add(10) : RULE.dbl()]);
  const x = rnd(6, 15), m = r1.f(x), y = r2.f(m);
  if (m < 0 || y < 0 || y > 60) return MATH.machine.gen(L);
  if (Math.random() < 0.6) return Q({ prompt: 'What comes out at the end?', speak: `${x} goes into two machines. The first says ${r1.say}. The second says ${r2.say}. What comes out at the end?`, visual: machine(x, [r1.lab, r2.lab], '?'), choices: nOpts(y, 0, 80, 4, [m, r1.f(r2.f(x)), y + 1].filter(v => v >= 0)), answer: y,
    explain: machine(x, [r1.lab, r2.lab], y), steps: [`First machine: ${x} ${r1.lab} = ${m}.`, `Second machine: ${m} ${r2.lab} = ${y}.`], explainText: `${y} comes out.` });
  return Q({ prompt: 'What number went in?', speak: `Two machines: first ${r1.say}, then ${r2.say}. ${y} came out. What went in?`, visual: machine('?', [r1.lab, r2.lab], y), choices: nOpts(x, 0, 80, 4, [m, r2.f(r1.f(y)), x + 1].filter(v => Number.isInteger(v) && v >= 0)), answer: x,
    explain: machine(x, [r1.lab, r2.lab], y), steps: [`Work backwards from ${y}. Undo the second machine (${r2.lab}): ${m}.`, `Undo the first machine (${r1.lab}): ${x}.`], explainText: `${x} went in. Check: ${x} ${r1.lab} = ${m}, ${m} ${r2.lab} = ${y}.` });
});

/* --- balance puzzles --- */
// Tokens: {t:'c', c:colour} unit cube, {t:'w', n} numbered weight, {t:'q'} mystery box, {t:'w', n, hi:true} the answer revealed.
function balance(left, right) {
  const size = t => t.t === 'c' ? 18 : 30, g0 = [];
  let top = 130;
  const pan = (toks, cx) => {
    const rows = [[]]; let w = 0;
    toks.forEach(t => { const s = size(t) + 4; if (w + s > 116 && rows.at(-1).length) { rows.push([]); w = 0; } rows.at(-1).push(t); w += s; });
    let y = 130, out = '';
    rows.forEach(r => {
      const h = Math.max(...r.map(size)), W = sum(r.map(t => size(t) + 4)) - 4; let x = cx - W / 2;
      r.forEach(t => {
        const s = size(t), yy = y - s;
        if (t.t === 'c') out += `<rect x="${x}" y="${yy}" width="${s}" height="${s}" rx="3" fill="${t.c}" stroke="${K}" stroke-width="1.5"/>`;
        else if (t.t === 'q') out += `<rect x="${x}" y="${yy}" width="${s}" height="${s}" rx="6" fill="#6D55D1" stroke="${K}" stroke-width="2"/>${T(x + s / 2, yy + 22, '?', { size: 20, fill: '#fff', halo: false })}`;
        else out += `<rect x="${x}" y="${yy}" width="${s}" height="${s}" rx="6" fill="${t.hi ? '#FFC23D' : '#9FB3C8'}" stroke="${K}" stroke-width="2"/>${T(x + s / 2, yy + 21, t.n, { size: String(t.n).length > 1 ? 15 : 18, halo: false })}`;
        x += s + 4;
      });
      y -= h + 4;
    });
    top = Math.min(top, y);
    return out;
  };
  const body = pan(left, 75) + pan(right, 225);
  g0.push(`<rect x="11" y="130" width="128" height="7" rx="3" fill="#C9B58F" stroke="${K}" stroke-width="2"/><rect x="161" y="130" width="128" height="7" rx="3" fill="#C9B58F" stroke="${K}" stroke-width="2"/>`);
  g0.push(`<path d="M75 137 V150 M225 137 V150" stroke="${K}" stroke-width="3"/><rect x="18" y="150" width="264" height="8" rx="4" fill="#B5651D" stroke="${K}" stroke-width="2"/><polygon points="150,158 128,194 172,194" fill="#FFC23D" stroke="${K}" stroke-width="2.5" stroke-linejoin="round"/>`);
  const y0 = Math.min(60, top - 6);
  return box(`0 ${y0} 300 ${198 - y0}`, g0.join('') + body, 'a balanced scale');
}
const cubes = (n, c = '#F2604F') => Array.from({ length: n }, () => ({ t: 'c', c }));
const wt = n => ({ t: 'w', n }), QB = { t: 'q' };
const reveal = (side, x) => side.map(t => t.t === 'q' ? { t: 'w', n: x, hi: true } : t);
S4('balance', 1, 'Balance puzzles', '⚖️', [
  ['When a scale is level, both sides weigh the same.', () => balance([...cubes(3), ...cubes(2, '#2E8BE6')], cubes(5, '#2FA36B'))],
  ['The ? box is a mystery. Here ? and 2 cubes weigh the same as 6 cubes, so ? must be 4.', () => balance([QB, ...cubes(2)], cubes(6, '#2E8BE6'))],
  ['Numbered weights work the same way: 4 + 5 = 9 and 6 + 3 = 9.', () => balance([wt(4), wt(5)], [wt(6), wt(3)])]
], L => {
  const pr = 'What is in the ? box?', ask = (left, right, x, o) => Q({ prompt: pr, speak: `The scale is level, so both sides weigh the same. ${o.say} What is in the mystery box?`, visual: balance(left, right), choices: nOpts(x, 0, 30, L === 1 ? 3 : 4, o.extra || []), answer: x,
    explain: balance(reveal(left, x), reveal(right, x)), steps: o.steps || null, explainText: o.ex });
  if (L === 1) { const a = rnd(1, 5), b = rnd(1, Math.min(5, 10 - a)); return ask([...cubes(a), ...cubes(b, '#2E8BE6')], [QB], a + b, { say: `There are ${a} red cubes and ${b} blue cubes on one side.`, extra: [a, b, a + b + 1], ex: `${a} + ${b} = ${a + b} cubes. So the box weighs ${a + b}.` }); }
  if (L === 2) { const c = rnd(4, 10), a = rnd(1, c - 1), x = c - a; return ask([QB, ...cubes(a)], cubes(c, '#2E8BE6'), x, { say: `The box and ${a} cubes balance ${c} cubes.`, extra: [c, a, c + a], ex: `? + ${a} = ${c}. So ? = ${c} − ${a} = ${x}.` }); }
  if (L === 3) { const a = rnd(2, 9), b = rnd(2, 9), c = rnd(1, a + b - 1), x = a + b - c; return ask([wt(a), wt(b)], [wt(c), QB], x, { say: `${a} and ${b} balance ${c} and the box.`, extra: [a + b, a + b + c, x + 1], steps: [`Left side: ${a} + ${b} = ${a + b}.`, `${c} + ? = ${a + b}, so ? = ${a + b} − ${c} = ${x}.`], ex: `The box weighs ${x}.` }); }
  if (L === 4) {
    const x = rnd(2, 10);
    if (Math.random() < 0.5) return ask([QB, QB], [wt(2 * x)], x, { say: `Two boxes balance ${2 * x}.`, extra: [2 * x, x * 4], steps: [`Two boxes weigh ${2 * x}.`, `Half of ${2 * x} is ${x}.`], ex: `Each box weighs ${x}.` });
    const a = rnd(1, 8), b = 2 * x + a;
    return ask([QB, QB, wt(a)], [wt(b)], x, { say: `Two boxes and ${a} balance ${b}.`, extra: [b - a, (b + a) / 2, x + 1].filter(Number.isInteger), steps: [`Take ${a} off both sides: two boxes weigh ${b} − ${a} = ${2 * x}.`, `Half of ${2 * x} is ${x}.`], ex: `Each box weighs ${x}.` });
  }
  const x = rnd(2, 7);
  if (Math.random() < 0.5) {
    const a = rnd(1, 6), tot = 3 * x + a, b = rnd(Math.ceil(tot / 3), tot - 2), c = tot - b;
    return ask([QB, QB, QB, wt(a)], [wt(b), wt(c)], x, { say: `Three boxes and ${a} balance ${b} and ${c}.`, extra: [tot - a, tot, x + 1, (tot - a) / 2].filter(Number.isInteger), steps: [`Right side: ${b} + ${c} = ${tot}.`, `Take ${a} off both sides: three boxes weigh ${tot - a}.`, `${tot - a} ÷ 3 = ${x}.`], ex: `Each box weighs ${x}.` });
  }
  const a = rnd(1, 9), b = x + a;
  return ask([QB, QB, wt(a)], [QB, wt(b)], x, { say: `Two boxes and ${a} balance one box and ${b}.`, extra: [(b - a) / 2, b + a, b, x + 1].filter(Number.isInteger), steps: ['Take one box off each side. The scale still balances.', `Now one box and ${a} balance ${b}.`, `${b} − ${a} = ${x}.`], ex: `Each box weighs ${x}.` });
});

/* ===================== Treetop Town (world 2) ===================== */

const LINES3 = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const LINE_NAME = ['top row', 'middle row', 'bottom row', 'left column', 'middle column', 'right column', 'diagonal', 'diagonal'];
function magicSq(v, ask, hide = [], show = false) {
  let g = '';
  v.forEach((n, i) => {
    const x = 6 + (i % 3) * 64, y = 6 + Math.floor(i / 3) * 64, isA = i === ask, isH = hide.includes(i);
    g += `<rect x="${x}" y="${y}" width="62" height="62" rx="8" fill="${isA ? '#FFD98A' : isH ? '#E8ECF2' : '#fff'}" stroke="${K}" stroke-width="2.5"/>`;
    if (!isH) g += T(x + 31, y + 41, isA && !show ? '?' : n, { size: String(n).length > 2 ? 22 : 26, fill: isA ? '#F2604F' : K, halo: false });
  });
  return `<div class="shape m4sq"><svg viewBox="0 0 204 204" role="img" aria-label="magic square">${g}</svg></div>`;
}
const TRI_POS = [[110, 28], [36, 188], [184, 188], [73, 108], [110, 188], [147, 108]]; // corners A B C, then mids AB, BC, CA
const TRI_SIDES = [[0, 3, 1], [1, 4, 2], [2, 5, 0]];
function magicTri(v, ask, show = false) {
  let g = `<polygon points="110,28 36,188 184,188" fill="#EAF6EC" stroke="${K}" stroke-width="3" stroke-linejoin="round"/>`;
  TRI_POS.forEach(([x, y], i) => { const a = i === ask; g += `<circle cx="${x}" cy="${y}" r="22" fill="${a ? '#FFD98A' : '#fff'}" stroke="${K}" stroke-width="2.5"/>${T(x, y + 8, a && !show ? '?' : v[i], { size: 22, fill: a ? '#F2604F' : K, halo: false })}`; });
  return `<div class="shape m4sq"><svg viewBox="0 0 220 216" role="img" aria-label="magic triangle">${g}</svg></div>`;
}
function pyramid(rows, ask, hide = [], show = false) { // rows[0] = bottom
  let g = '';
  rows.forEach((r, j) => r.forEach((n, i) => {
    const id = `${j},${i}`, x = 4 + i * 72 + j * 36, y = 4 + (rows.length - 1 - j) * 46, a = id === ask, h = hide.includes(id);
    g += `<rect x="${x}" y="${y}" width="70" height="44" rx="6" fill="${a ? '#FFD98A' : h ? '#E8ECF2' : '#F7C9A0'}" stroke="${K}" stroke-width="2.5"/>`;
    if (!h || (a && show)) g += T(x + 35, y + 30, a && !show ? '?' : n, { size: 22, fill: a ? '#F2604F' : K, halo: false });
  }));
  return `<div class="shape m4sq"><svg viewBox="0 0 ${rows[0].length * 72 + 6} ${rows.length * 46 + 6}" role="img" aria-label="number pyramid">${g}</svg></div>`;
}
function loShu() { let v = [2, 7, 6, 9, 5, 1, 4, 3, 8]; for (let i = rnd(0, 3); i > 0; i--) v = [6, 3, 0, 7, 4, 1, 8, 5, 2].map(j => v[j]); if (Math.random() < 0.5) v = [2, 1, 0, 5, 4, 3, 8, 7, 6].map(j => v[j]); return v; }
S4('magicsq', 2, 'Magic squares', '✨', [
  ['In a magic square every row, column and diagonal adds up to the same total. Here it is 15.', () => magicSq([2, 7, 6, 9, 5, 1, 4, 3, 8], -1)],
  ['Find a line with only one gap. 4 + ? + 8 = 15, so ? = 15 − 12 = 3.', () => magicSq([2, 7, 6, 9, 5, 1, 4, 3, 8], 7)],
  ['In a number pyramid, each brick is the two bricks under it added together.', () => pyramid([[3, 5, 2], [8, 7], [15]], '')]
], L => {
  if (L <= 3) {
    let v = loShu(), S = 15;
    if (L >= 2) { if (Math.random() < 0.5) { const c = rnd(1, 12); v = v.map(n => n + c); S = 15 + 3 * c; } else { const m = pick([2, 3, 10]); v = v.map(n => n * m); S = 15 * m; } }
    const ask = rnd(0, 8), lines = LINES3.map((l, i) => [l, i]).filter(([l]) => l.includes(ask));
    let hide = [];
    if (L >= 2) { const other = pick([0, 1, 2, 3, 4, 5, 6, 7, 8].filter(i => i !== ask && LINES3.some(l => l.includes(ask) && !l.includes(i)) && (L < 3 || LINES3.some(l => !l.includes(ask) && !l.includes(i))))); hide = [other]; }
    const [line, li] = pick(lines.filter(([l]) => !l.some(i => hide.includes(i)))), known = line.filter(i => i !== ask).map(i => v[i]), x = v[ask];
    const full = LINES3.findIndex(l => !l.includes(ask) && !l.some(i => hide.includes(i))), fl = LINES3[full];
    const steps = [...(L === 3 ? [`Find the magic total from a full line (${LINE_NAME[full]}): ${fl.map(i => v[i]).join(' + ')} = ${S}.`] : []), `Use the ${LINE_NAME[li]}: ${known[0]} + ${known[1]} + ? = ${S}.`, `${known[0]} + ${known[1]} = ${known[0] + known[1]}. ${S} − ${known[0] + known[1]} = ${x}.`];
    return Q({ prompt: L === 3 ? 'Every line adds to the same total. What is the missing number?' : `Every row, column and diagonal adds to ${S}. What is the missing number?`, speak: L === 3 ? 'This is a magic square. Every row, column and diagonal adds up to the same total. What is the missing number?' : `This is a magic square. Every row, column and diagonal adds up to ${S}. What is the missing number?`,
      visual: magicSq(v, ask, hide), choices: nOpts(x, 1, 999, 4, [S - known[0], S - known[1], known[0] + known[1], x + 2]), answer: x, explain: magicSq(v, ask, hide, true), steps, explainText: `The missing number is ${x}.` });
  }
  if (L === 4) {
    const base = pick([[1, 2, 3, 6, 4, 5], [4, 5, 6, 3, 1, 2], [1, 3, 5, 6, 2, 4], [2, 4, 6, 5, 1, 3]]), c = rnd(0, 10), r = rnd(0, 2);
    let v = base.map(n => n + c); for (let k = 0; k < r; k++) v = [v[1], v[2], v[0], v[4], v[5], v[3]];
    const S = v[0] + v[3] + v[1], ask = rnd(0, 5), side = TRI_SIDES.find(s => s.includes(ask)), known = side.filter(i => i !== ask).map(i => v[i]), x = v[ask];
    return Q({ prompt: `Each side of the triangle adds to ${S}. What is the missing number?`, speak: `This is a magic triangle. The three numbers along each side add up to ${S}. What is the missing number?`, visual: magicTri(v, ask), choices: nOpts(x, 1, 99, 4, [S - known[0], known[0] + known[1], x + 2]), answer: x,
      explain: magicTri(v, ask, true), steps: [`Pick a side with the gap: ${known[0]} + ${known[1]} + ? = ${S}.`, `${S} − ${known[0] + known[1]} = ${x}.`], explainText: `The missing number is ${x}.` });
  }
  const a = rnd(3, 25), b = rnd(3, 25), c = rnd(3, 25), rows = [[a, b, c], [a + b, b + c], [a + 2 * b + c]], left = Math.random() < 0.5;
  const hide = left ? ['0,1', '1,0'] : ['0,1', '1,1'], knownMid = left ? b + c : a + b, otherMid = left ? a + b : b + c, edge = left ? a : c;
  return Q({ prompt: 'Each brick is the sum of the two below it. What is the ? brick?', speak: 'In this number pyramid, each brick is the two bricks under it added together. What number goes in the question mark brick?', visual: pyramid(rows, '0,1', hide), choices: nOpts(b, 1, 99, 4, [otherMid, rows[2][0] - edge, knownMid - edge, b + 2].filter(v => v > 0)), answer: b,
    explain: pyramid(rows, '0,1', [], true), steps: [`The top brick ${rows[2][0]} sits on ${knownMid} and the empty brick. So the empty brick is ${rows[2][0]} − ${knownMid} = ${otherMid}.`, `That brick sits on ${edge} and ?, so ? = ${otherMid} − ${edge} = ${b}.`], explainText: `The ? brick is ${b}.` });
});

/* --- recipes --- */
const RECIPES = [
  { n: 'Pancakes', e: '🥞', s: 4, ing: [['🥚', 'eggs', 2, ''], ['🥛', 'milk', 300, 'ml'], ['🌾', 'flour', 150, 'g'], ['🧈', 'butter', 20, 'g']] },
  { n: 'Fruit smoothie', e: '🥤', s: 2, ing: [['🍌', 'bananas', 2, ''], ['🍓', 'strawberries', 8, ''], ['🥛', 'milk', 250, 'ml']] },
  { n: 'Cupcakes', e: '🧁', s: 12, unit: 'cupcakes', ing: [['🥚', 'eggs', 2, ''], ['🍚', 'sugar', 100, 'g'], ['🧈', 'butter', 100, 'g'], ['🌾', 'flour', 120, 'g']] },
  { n: 'Lemonade', e: '🍋', s: 4, unit: 'glasses', ing: [['🍋', 'lemons', 3, ''], ['🍚', 'sugar', 60, 'g'], ['💧', 'water', 800, 'ml']] },
  { n: 'Vegetable soup', e: '🍲', s: 6, ing: [['🥕', 'carrots', 6, ''], ['🧅', 'onions', 2, ''], ['🥔', 'potatoes', 4, ''], ['💧', 'stock', 900, 'ml']] },
  { n: 'Pizza', e: '🍕', s: 2, ing: [['🌾', 'flour', 250, 'g'], ['🍅', 'tomatoes', 4, ''], ['🧀', 'cheese', 150, 'g']] },
  { n: 'Fruit salad', e: '🥗', s: 6, ing: [['🍎', 'apples', 3, ''], ['🍇', 'grapes', 30, ''], ['🍊', 'oranges', 2, ''], ['🍌', 'bananas', 3, '']] }
];
const UNIT_SAY = { g: 'grams', ml: 'millilitres' };
const amtShow = (ing, v) => ing[3] ? `${fmt(v)} ${ing[3]}` : `${fmt(v)} ${ing[0]}`;
const amtSay = (ing, v) => ing[3] ? `${fmt(v)} ${UNIT_SAY[ing[3]]}` : `${fmt(v)} ${v === 1 ? sing(ing[1]) : ing[1]}`;
const serves = (r, n = r.s) => r.unit ? `makes ${n} ${r.unit}` : `serves ${n}`;
const feed = (r, n) => r.unit ? `make ${n} ${r.unit}` : `serve ${n} people`;
const recipe = (r, hi) => card(`${r.e} ${r.n} (${serves(r)})`, r.ing.map((g, i) => [`${g[0]} ${g[3] ? `${g[2]} ${g[3]} ${g[1]}` : `${g[2]} ${g[1]}`}`, i === hi ? 'hi' : '']), 'recipe');
const howMuch = g => g[3] ? `How much ${g[1]}` : `How many ${g[1]}`;
S4('recipes', 2, 'Cooking with recipes', '🧁', [
  ['A recipe says how much of each thing to use, and how many people it feeds.', () => recipe(RECIPES[0], -1)],
  ['Double the recipe for twice as many people: multiply every amount by 2.', () => '<span class="expr">2 eggs × 2 = 4 eggs</span>'],
  ['Half the recipe? Divide every amount by 2. For 1½ times, add half again: 300 + 150 = 450 ml.', () => '<span class="expr">300 ml × 1½ = 450 ml</span>']
], L => {
  const r = pick(RECIPES), people = r.unit || 'people', mk = (g, x, prompt, speak, wrong, steps) => {
    const ch = opts(x, wrong.filter(v => v > 0 && Number.isFinite(v) && v !== x).map(v => +v.toFixed(2)), 4, v => amtShow(g, v), v => amtSay(g, v));
    return Q({ prompt, speak, visual: recipe(r, r.ing.indexOf(g)), choices: ch, answer: x, steps, explainText: `You need ${amtShow(g, x)}${g[3] ? ` of ${g[1]}` : ''}.` });
  };
  if (L === 1) { const g = pick(r.ing), x = g[2] * 2; return mk(g, x, `Double the recipe. ${howMuch(g)}?`, `Here is a recipe for ${r.n.toLowerCase()}. You double the recipe. ${howMuch(g)} do you need?`, [g[2], g[2] + 2, x + g[2], g[2] + 10, x - 1], [`Double means × 2.`, `${amtShow(g, g[2])} × 2 = ${amtShow(g, x)}.`]); }
  if (L === 2) { const g = pick(r.ing.filter(g => g[2] % 2 === 0)), x = g[2] / 2; return mk(g, x, `Make half the recipe. ${howMuch(g)}?`, `Here is a recipe for ${r.n.toLowerCase()}. You make half the recipe. ${howMuch(g)} do you need?`, [g[2], g[2] * 2, g[2] - 2, x + 10, x + 1], [`Half means ÷ 2.`, `${amtShow(g, g[2])} ÷ 2 = ${amtShow(g, x)}.`]); }
  if (L === 3) { const k = rnd(3, 5), g = pick(r.ing), x = g[2] * k, N = r.s * k; return mk(g, x, `You want it to ${feed(r, N)}. ${howMuch(g)}?`, `This recipe ${serves(r)}. You want it to ${feed(r, N)}. ${howMuch(g)} do you need?`, [g[2] * (k - 1), g[2] * (k + 1), g[2] + N, g[2] * 2, x + 1], [`${N} ÷ ${r.s} = ${k}, so make the recipe ${k} times.`, `${amtShow(g, g[2])} × ${k} = ${amtShow(g, x)}.`]); }
  if (L === 4) {
    const ok = r.s % 2 === 0 ? r.ing.filter(g => g[2] % 2 === 0) : [];
    if (!ok.length) return MATH.recipes.gen(L);
    const g = pick(ok), x = g[2] * 1.5, N = r.s * 1.5;
    return mk(g, x, `You want it to ${feed(r, N)}. ${howMuch(g)}?`, `This recipe ${serves(r)}. You want it to ${feed(r, N)}. ${howMuch(g)} do you need?`, [g[2] * 2, g[2] + N - r.s, g[2] / 2, x + 10, g[2] * 3],
      [`${N} is ${r.s} and half of ${r.s} more, so make 1½ times the recipe.`, `Half of ${amtShow(g, g[2])} is ${amtShow(g, g[2] / 2)}.`, `${fmt(g[2])} + ${fmt(g[2] / 2)} = ${amtShow(g, x)}.`]);
  }
  if (Math.random() < 0.5) {
    const g = pick(r.ing), k = rnd(2, 5), have = g[2] * k, N = r.s * k;
    return Q({ prompt: `You have ${amtShow(g, have)}${g[3] ? ` of ${g[1]}` : ''}. How many ${people} can you make it for?`, speak: `This recipe ${serves(r)}. You have ${amtSay(g, have)}${g[3] ? ` of ${g[1]}` : ''} and plenty of everything else. How many ${people} can you make it for?`, visual: recipe(r, r.ing.indexOf(g)),
      choices: nOpts(N, 1, 999, 4, [k, N + r.s, N - r.s, have]), answer: N, steps: [`${amtShow(g, have)} ÷ ${amtShow(g, g[2])} = ${k}, so you can make the recipe ${k} times.`, `${k} × ${r.s} = ${N}.`], explainText: `Enough for ${N} ${people}.` });
  }
  const cands = []; r.ing.forEach(g => { for (let N = 1; N <= 12; N++) if (N !== r.s && N % r.s && (g[2] * N) % r.s === 0) cands.push([g, N]); });
  if (!cands.length) return MATH.recipes.gen(L);
  const [g, N] = pick(cands), one = g[2] / r.s, x = g[2] * N / r.s;
  return mk(g, x, `You want it to ${feed(r, N)}. ${howMuch(g)}?`, `This recipe ${serves(r)}. You want it to ${feed(r, N)}. ${howMuch(g)} do you need?`, [g[2] * N, g[2] + N - r.s, x + one, x - one, g[2] * 2],
    [`First find the amount for 1: ${fmt(g[2])} ÷ ${r.s} = ${fmt(one)}.`, `Then for ${N}: ${fmt(one)} × ${N} = ${amtShow(g, x)}.`]);
});

/* --- bus timetables --- */
const STOPS = ['🏠 Oak Street', '🏫 School', '📚 Library', '🏞️ Park', '🦁 Zoo', '🏊 Pool', '🛒 Shops', '🚉 Station', '🏖️ Beach', '🏰 Castle', '🎡 Fair', '🏥 Hospital'];
const BUSES = ['Bus A', 'Bus B', 'Bus C'];
const tStr = (m, h24) => { m = ((m % 1440) + 1440) % 1440; const h = Math.floor(m / 60), mm = String(m % 60).padStart(2, '0'); return h24 ? `${String(h).padStart(2, '0')}:${mm}` : `${h % 12 || 12}:${mm}`; };
const dStr = d => d < 60 ? `${d} min` : `${Math.floor(d / 60)} h${d % 60 ? ` ${d % 60} min` : ''}`;
const dSay = d => d < 60 ? `${d} minutes` : `${Math.floor(d / 60)} hour${d >= 120 ? 's' : ''}${d % 60 ? ` ${d % 60} minutes` : ''}`;
function timetable(stops, times, h24, hi = []) {
  return `<table class="m3tab m4tt"><tr><th>Stop</th>${BUSES.map(b => `<th>${b}</th>`).join('')}</tr>${stops.map((s, i) => `<tr><th>${s}</th>${times.map((col, j) => `<td class="${hi.includes(`${i},${j}`) ? 'hi' : ''}">${tStr(col[i], h24)}</td>`).join('')}</tr>`).join('')}</table>`;
}
S4('timetable', 2, 'Bus timetables', '🚌', [
  ['A timetable shows when each bus gets to each stop. Read across for the stop and down for the bus.', () => timetable(['🏠 Oak Street', '🏫 School', '🦁 Zoo'], [[480, 490, 505], [510, 520, 535], [540, 550, 565]], false, ['1,1'])],
  ['How long from Oak Street to the Zoo on Bus A? 8:00 to 8:25 is 25 minutes.', () => timetable(['🏠 Oak Street', '🏫 School', '🦁 Zoo'], [[480, 490, 505], [510, 520, 535], [540, 550, 565]], false, ['0,0', '2,0'])],
  ['Just missed a bus? Look down the row for the next time after now.', () => '<span class="expr">8:12 → next bus 8:20</span>']
], L => {
  const n = L >= 4 ? 5 : 4, stops = shuffle(STOPS).slice(0, n), h24 = L === 5, gap = pick([15, 20, 30, 40]);
  const off = [0]; for (let i = 1; i < n; i++) off.push(off[i - 1] + rnd(1, 4) * 5);
  const t0 = h24 ? rnd(144, 216) * 5 : rnd(84, 120) * 5, times = BUSES.map((_, j) => off.map(o => t0 + j * gap + o));
  const TT = hi => timetable(stops, times, h24, hi), sName = s => s.slice(s.indexOf(' ') + 1), tO = (a, c) => opts(a, c.filter(v => v !== a), 4, v => v, v => v);
  if (L === 1) {
    const s = rnd(1, n - 1), b = rnd(0, 2), a = tStr(times[b][s]);
    return Q({ prompt: `When does ${BUSES[b]} get to the ${sName(stops[s])}?`, visual: TT([]), choices: tO(a, [...times.map(c => tStr(c[s])), ...off.map((_, i) => tStr(times[b][i])), tStr(times[b][s] + 10)]), answer: a,
      explain: TT([`${s},${b}`]), explainText: `Find the ${sName(stops[s])} row, then go across to the ${BUSES[b]} column: ${a}.` });
  }
  if (L === 2) {
    const i = rnd(0, n - 2), j = rnd(i + 1, n - 1), b = rnd(0, 2), d = off[j] - off[i];
    return Q({ prompt: `How long does ${BUSES[b]} take from the ${sName(stops[i])} to the ${sName(stops[j])}?`, visual: TT([]), choices: opts(d, [d + 5, d - 5, d + 10, off[j], gap, d + 60].filter(v => v > 0 && v !== d), 4, v => dStr(v), dSay), answer: d,
      explain: TT([`${i},${b}`, `${j},${b}`]), steps: [`${BUSES[b]} leaves the ${sName(stops[i])} at ${tStr(times[b][i])}.`, `It gets to the ${sName(stops[j])} at ${tStr(times[b][j])}.`, `From ${tStr(times[b][i])} to ${tStr(times[b][j])} is ${dSay(d)}.`], explainText: `It takes ${dSay(d)}.` });
  }
  if (L === 3) {
    const s = rnd(0, n - 2), b = rnd(1, 2), now = times[b - 1][s] + rnd(1, gap / 5 - 1) * 5, a = tStr(times[b][s]);
    return Q({ prompt: `You get to the ${sName(stops[s])} at ${tStr(now)}. When does the next bus leave?`, speak: `You get to the ${sName(stops[s])} stop at ${tStr(now)}. What time does the next bus leave from there?`, visual: TT([]),
      choices: tO(a, [...times.map(c => tStr(c[s])), tStr(now), tStr(times[b][s + 1]), tStr(now + gap)]), answer: a,
      explain: TT([`${s},${b - 1}`, `${s},${b}`]), steps: [`${BUSES[b - 1]} left the ${sName(stops[s])} at ${tStr(times[b - 1][s])}. That is before ${tStr(now)}, so you missed it.`, `The next one is ${BUSES[b]} at ${a}.`], explainText: `The next bus leaves at ${a}.` });
  }
  if (L === 4) {
    const k = rnd(0, 1), last = n - 1, dl = times[k][last] + rnd(0, gap / 5 - 1) * 5, a = tStr(times[k][0]);
    return Q({ prompt: `You must be at the ${sName(stops[last])} by ${tStr(dl)}. What is the latest bus you can catch from ${sName(stops[0])}?`, speak: `You must be at the ${sName(stops[last])} by ${tStr(dl)}. What time is the latest bus you can catch from ${sName(stops[0])}?`, visual: TT([]),
      choices: tO(a, [...times.map(c => tStr(c[0])), tStr(times[k][last]), tStr(dl - off[last] + 5)]), answer: a,
      explain: TT([`0,${k}`, `${last},${k}`]), steps: [`Look along the ${sName(stops[last])} row for times at or before ${tStr(dl)}.`, `${BUSES[k]} gets there at ${tStr(times[k][last])}: just in time. ${BUSES[k + 1]} gets there at ${tStr(times[k + 1][last])}: too late.`, `${BUSES[k]} leaves ${sName(stops[0])} at ${a}.`], explainText: `Catch the ${a} bus.` });
  }
  if (Math.random() < 0.5) {
    const b = rnd(0, 2), s = rnd(1, n - 1), late = pick([15, 20, 25, 35, 40, 45]), t = times[b][s] + late, a = tStr(t, true);
    return Q({ prompt: `${BUSES[b]} is running ${late} minutes late. When will it get to the ${sName(stops[s])}?`, visual: TT([]), choices: tO(a, [tStr(t - 60, true), tStr(t + 10, true), tStr(t - 10, true), tStr(times[b][s], true), tStr(t + 60, true)]), answer: a,
      explain: TT([`${s},${b}`]), steps: [`On time it gets there at ${tStr(times[b][s], true)}.`, `${tStr(times[b][s], true)} + ${late} minutes = ${a}.`], explainText: `It will get there at ${a}.` });
  }
  const b = rnd(0, 2), d = off[n - 1];
  return Q({ prompt: `How long is the whole trip on ${BUSES[b]}, from ${sName(stops[0])} to the ${sName(stops[n - 1])}?`, visual: TT([]), choices: opts(d, [d + 5, d - 5, d + 10, d + 40, d - 40].filter(v => v > 0 && v !== d), 4, dStr, dSay), answer: d,
    explain: TT([`0,${b}`, `${n - 1},${b}`]), steps: [`It leaves at ${tStr(times[b][0], true)} and arrives at ${tStr(times[b][n - 1], true)}.`, `Count on from ${tStr(times[b][0], true)} to ${tStr(times[b][n - 1], true)}: ${dSay(d)}.`], explainText: `The trip takes ${dSay(d)}.` });
});

/* --- code breaking --- */
const SYM = [['🍎', 'apple'], ['🍌', 'banana'], ['🍇', 'grapes'], ['⭐', 'star'], ['🐱', 'cat'], ['🌸', 'flower'], ['🍩', 'donut'], ['🚗', 'car']];
const WORDS4 = { 3: ['CAT', 'DOG', 'SUN', 'HAT', 'BEE', 'OWL', 'PIG', 'BUS', 'CUP', 'JAM', 'FOX', 'BAT', 'ANT', 'EGG', 'MAP', 'PEN'], 4: ['FISH', 'CAKE', 'MOON', 'STAR', 'FROG', 'TREE', 'BIRD', 'KITE', 'DUCK', 'LION', 'BEAR', 'GOAT', 'SHIP', 'BOOK'] };
const eqs = lines => `<div class="m4eqs">${lines.map(l => `<div>${l}</div>`).join('')}</div>`;
const symSay = s => s.replace(/[🍎🍌🍇⭐🐱🌸🍩🚗]/gu, m => ' ' + (SYM.find(x => x[0] === m) || ['', ''])[1] + ' ').replace(/\+/g, 'plus').replace(/−/g, 'minus').replace(/×/g, 'times').replace(/=/g, 'equals').replace(/\s+/g, ' ').trim();
const abcKey = (hi = []) => `<div class="m4key">${Array.from({ length: 26 }, (_, i) => { const ch = String.fromCharCode(65 + i); return `<span class="${hi.includes(ch) ? 'hi' : ''}"><b>${ch}</b>${i + 1}</span>`; }).join('')}</div>`;
const lv = ch => ch.charCodeAt(0) - 64;
S4('codes', 2, 'Code breaking', '🔐', [
  ['Each picture stands for a number. 🍎 + 🍎 = 6, so each 🍎 is 3.', () => eqs(['🍎 + 🍎 = 6', '🍎 = 3'])],
  ['Use what you know to crack the next one: 🍎 + 🍌 = 8, and 🍎 is 3, so 🍌 is 5.', () => eqs(['🍎 + 🍌 = 8', '3 + 🍌 = 8', '🍌 = 5'])],
  ['A letter code: A = 1, B = 2, C = 3 … So 3 · 1 · 20 spells CAT.', () => abcKey(['C', 'A', 'T'])]
], L => {
  const [s1, s2, s3] = shuffle(SYM).slice(0, 3), A = s1[0], B = s2[0], Cc = s3[0];
  const ask = (lines, who, ans, wrong, steps, ex) => Q({ prompt: `What is ${who}?`, speak: `Crack the code. ${lines.map(symSay).join('. ')}. What number is the ${symSay(who)}?`, visual: eqs(lines), choices: nOpts(ans, 0, 99, 4, wrong), answer: ans, steps, explainText: ex });
  if (L === 1) {
    const a = rnd(1, 10), k = a <= 6 ? pick([2, 3]) : 2, tot = a * k;
    return ask([`${Array(k).fill(A).join(' + ')} = ${tot}`], A, a, [tot, a + 2, tot - a], null, `${Array(k).fill(a).join(' + ')} = ${tot}, so ${A} = ${a}.`);
  }
  if (L === 2) {
    const a = rnd(2, 10), b = pick([...Array(12).keys()].map(i => i + 1).filter(v => v !== a));
    return ask([`${A} + ${A} = ${2 * a}`, `${A} + ${B} = ${a + b}`], B, b, [a, a + b, 2 * a, b + 1], [`${A} + ${A} = ${2 * a}, so ${A} = ${a}.`, `${a} + ${B} = ${a + b}, so ${B} = ${a + b} − ${a} = ${b}.`], `${B} = ${b}.`);
  }
  if (L === 3) {
    const len = pick([3, 4]), w = pick(WORDS4[len]), nums = w.split('').map(lv);
    const wrong = shuffle(WORDS4[len].filter(x => x !== w)).slice(0, 3), all = shuffle([w, ...wrong]);
    return Q({ prompt: `A = 1, B = 2 … Which word is ${nums.join(' · ')}?`, speak: `Use the code: A is 1, B is 2, C is 3, and so on. Which word is ${nums.join(', ')}?`, visual: abcKey(), choices: all.map(x => C4(x, x, x.toLowerCase())), answer: w,
      explain: abcKey(w.split('')), steps: w.split('').map((ch, i) => `${nums[i]} = ${ch}`), explainText: `${nums.join(' · ')} spells ${w}.` });
  }
  if (L === 4) {
    const w = pick([...WORDS4[3], ...WORDS4[4]]), nums = w.split('').map(lv), s = sum(nums);
    return Q({ prompt: `Add up the letters. What is ${w} worth?`, speak: `Use the code: A is 1, B is 2, C is 3, and so on. Add up the letters. What is the word ${w.toLowerCase()} worth?`, visual: abcKey(), choices: nOpts(s, 1, 120, 4, [s + 1, s - 1, s + 10, s - 10, nums.length * 10]), answer: s,
      explain: abcKey(w.split('')), steps: [`${w.split('').map((ch, i) => `${ch} = ${nums[i]}`).join(', ')}.`, `${nums.join(' + ')} = ${s}.`], explainText: `${w} is worth ${s}.` });
  }
  if (Math.random() < 0.5) {
    const a = rnd(2, 9), b = rnd(2, 12), c = rnd(1, 12);
    return ask([`${A} + ${A} + ${A} = ${3 * a}`, `${A} + ${B} = ${a + b}`, `${B} + ${Cc} = ${b + c}`], Cc, c, [b, a, b + c, c + 1, a + b], [`${3 * a} ÷ 3 = ${a}, so ${A} = ${a}.`, `${a} + ${B} = ${a + b}, so ${B} = ${b}.`, `${b} + ${Cc} = ${b + c}, so ${Cc} = ${c}.`], `${Cc} = ${c}.`);
  }
  const a = rnd(2, 9), b = rnd(3, 12), c = rnd(1, b - 1);
  return ask([`${A} × ${A} = ${a * a}`, `${A} + ${B} = ${a + b}`, `${B} − ${Cc} = ${b - c}`], Cc, c, [b, a, b - c, c + 1, a * a / 2].filter(Number.isInteger), [`${A} × ${A} = ${a * a}, so ${A} = ${a}.`, `${a} + ${B} = ${a + b}, so ${B} = ${b}.`, `${b} − ${Cc} = ${b - c}, so ${Cc} = ${c}.`], `${Cc} = ${c}.`);
});

/* ===================== Deep Forest (world 3) ===================== */

const STORE = [['🎒', 'backpack'], ['📚', 'book'], ['🧸', 'teddy bear'], ['⚽', 'football'], ['🎨', 'paint set'], ['🧩', 'jigsaw'], ['🎧', 'headphones'], ['🖍️', 'crayons'], ['🧢', 'cap'], ['🎲', 'board game'], ['🛹', 'skateboard'], ['🔦', 'torch'], ['🎮', 'video game'], ['⌚', 'watch'], ['🧃', 'juice'], ['🍫', 'chocolate bar']];
const wallet = c => `<div class="m4cash">👛 You have ${usd(c)}</div>`;
S4('budget', 3, 'Budget planning', '💵', [
  ['A budget is how much money you have to spend. Add up prices to check you can afford them.', () => shelf([['🎒', '', 1200], ['📚', '', 600]], usd) + wallet(2000)],
  ['$12 + $6 = $18. That is less than $20, so you can buy both, with $2 left.', () => '<span class="expr">$20 − $18 = $2</span>'],
  ['How many $3 juices for $20? 6 × $3 = $18 fits, but 7 × $3 = $21 is too much. So 6.', () => '<span class="expr">6 × $3 = $18 ✓  7 × $3 = $21 ✗</span>']
], L => {
  if (L === 1) {
    const [e, nm] = pick(STORE), p = rnd(3, 17) * 100, left = 2000 - p;
    return Q({ prompt: `You buy the ${e} for ${usd(p)}. How much is left?`, speak: `You have 20 dollars. You buy the ${nm} for ${usdSay(p)}. How much money is left?`, visual: shelf([[e, nm, p]], usd) + wallet(2000), choices: mOpts(left, [p, left + 100, left - 100, left + 1000, 2000 + p]), answer: left,
      explainText: `$20 − ${usd(p)} = ${usd(left)}.` });
  }
  if (L === 2) {
    for (let t = 0; t < 50; t++) {
      const items = shuffle(STORE).slice(0, 4).map(([e, nm]) => [e, nm, rnd(4, 16) * 100]), pairs = [];
      for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) pairs.push([items[i], items[j], items[i][2] + items[j][2]]);
      const good = pairs.filter(p => p[2] <= 2000), bad = pairs.filter(p => p[2] > 2000);
      if (!good.length || bad.length < 3) continue;
      const g = pick(good), ch = shuffle([g, ...shuffle(bad).slice(0, 3)]), key = p => p[0][0] + p[1][0];
      return Q({ prompt: 'You have $20. Which two things can you buy?', speak: `You have 20 dollars. ${items.map(it => `The ${it[1]} costs ${usdSay(it[2])}.`).join(' ')} Which two things can you buy together?`, visual: shelf(items, usd) + wallet(2000),
        choices: ch.map(p => C4(key(p), `${p[0][0]} + ${p[1][0]}`, `${p[0][1]} and ${p[1][1]}`)), answer: key(g),
        steps: ch.map(p => `${p[0][0]} + ${p[1][0]} = ${usd(p[0][2])} + ${usd(p[1][2])} = ${usd(p[2])} ${p[2] <= 2000 ? '✓' : '✗ too much'}`), explainText: `Only ${g[0][0]} + ${g[1][0]} costs $20 or less.` });
    }
    return MATH.budget.gen(1);
  }
  if (L === 3) {
    const [e, nm] = pick(STORE), p = pick([150, 175, 250, 300, 350, 400, 450, 600, 700, 800, 900]), n = Math.floor(2000 / p), left = 2000 - n * p;
    return Q({ prompt: `How many ${e} at ${usd(p)} each can you buy with $20?`, speak: `Each ${nm} costs ${usdSay(p)}. How many can you buy with 20 dollars?`, visual: shelf([[e, nm, p]], usd) + wallet(2000), choices: nOpts(n, 1, 20, 4, [n + 1, Math.round(2000 / p), n - 1, Math.floor(20 / Math.ceil(p / 100))]), answer: n,
      steps: [`${n} × ${usd(p)} = ${usd(n * p)}. That fits.`, `${n + 1} × ${usd(p)} = ${usd((n + 1) * p)}. That is more than $20.`], explainText: `You can buy ${n}${left ? `, with ${usd(left)} left over` : ''}.` });
  }
  if (L === 4) {
    const [[e1, n1], [e2, n2]] = shuffle(STORE).slice(0, 2), a = rnd(3, 7) * 100 + pick([25, 50, 75, 95]), b = rnd(1, 5) * 100 + pick([0, 25, 50, 99]), tot = 2 * a + b, ch = 2000 - tot;
    if (ch <= 0) return MATH.budget.gen(L);
    return Q({ prompt: `You buy 2 ${e1} and 1 ${e2}. How much change from $20?`, speak: `The ${n1} costs ${usdSay(a)} and the ${n2} costs ${usdSay(b)}. You buy 2 ${n1}s and 1 ${n2} and pay with 20 dollars. How much change do you get?`, visual: shelf([[e1, n1, a], [e2, n2, b]], usd2) + wallet(2000),
      choices: mOpts(ch, [2000 - a - b, tot, ch + 100, ch - 100, ch + 10, ch - 10], usd2), answer: ch, steps: [`2 × ${usd2(a)} = ${usd2(2 * a)}.`, `${usd2(2 * a)} + ${usd2(b)} = ${usd2(tot)}.`, `$20.00 − ${usd2(tot)} = ${usd2(ch)}.`], explainText: `Your change is ${usd2(ch)}.` });
  }
  const [e, nm] = pick(STORE), h = rnd(2, 15), w = rnd(3, 9), T0 = rnd(30, 90), need = T0 - h, wk = Math.ceil(need / w);
  return Q({ prompt: `You have $${h} and save $${w} a week. How many weeks until you can buy the $${T0} ${e}?`, speak: `You have ${h} dollars and you save ${w} dollars every week. The ${nm} costs ${T0} dollars. How many weeks until you can buy it?`, visual: shelf([[e, nm, T0 * 100]], usd) + wallet(h * 100),
    choices: nOpts(wk, 1, 40, 4, [Math.floor(need / w), Math.ceil(T0 / w), wk + 1].filter(v => v !== wk)), answer: wk,
    steps: [`You still need $${T0} − $${h} = $${need}.`, `${need} ÷ ${w} = ${fmt(+(need / w).toFixed(2))}${need % w ? ', so round up' : ''}.`, `After ${wk} weeks: $${h} + ${wk} × $${w} = $${h + wk * w}. ${wk > 1 ? `After ${wk - 1} weeks it is only $${h + (wk - 1) * w}.` : ''}`], explainText: `${wk} week${wk > 1 ? 's' : ''}.` });
});

/* --- map scales --- */
const PLACES = [['🏠', 'Home'], ['🏰', 'Castle'], ['⛺', 'Camp'], ['🏖️', 'Beach'], ['🏔️', 'Mountain'], ['🏫', 'School'], ['🌉', 'Bridge'], ['🏞️', 'Lake'], ['🌲', 'Forest'], ['🎡', 'Fair']];
function mapPic(places, legs, scaleTxt) { // legs: label per road between consecutive places
  const tot = legs.length, W = 300, H = 180, xs = places.map((_, i) => 34 + i * (232 / tot)), ys = places.map((_, i) => i % 2 ? 50 : 112);
  let g = `<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="14" fill="#E5F4D9" stroke="${K}" stroke-width="2"/>`;
  for (let x = 22; x < W; x += 20) g += `<line x1="${x}" y1="4" x2="${x}" y2="${H - 4}" stroke="#CFE5C0" stroke-width="1"/>`;
  for (let y = 22; y < H; y += 20) g += `<line x1="4" y1="${y}" x2="${W - 4}" y2="${y}" stroke="#CFE5C0" stroke-width="1"/>`;
  legs.forEach((lab, i) => { const [x1, y1, x2, y2] = [xs[i], ys[i], xs[i + 1], ys[i + 1]]; g += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#B5651D" stroke-width="5" stroke-dasharray="10 5" stroke-linecap="round"/>` + T((x1 + x2) / 2 + (i % 2 ? 0 : 0), (y1 + y2) / 2 + (i % 2 ? 22 : -10), lab, { size: 15, fill: '#B5651D' }); });
  places.forEach(([e, n], i) => { g += E(xs[i], ys[i], e, 28) + T(xs[i], ys[i] + 30, n, { size: 12 }); });
  g += `<rect x="12" y="${H - 30}" width="40" height="8" fill="${K}"/><rect x="32" y="${H - 30}" width="20" height="8" fill="#fff" stroke="${K}" stroke-width="1"/>` + T(60, H - 21, scaleTxt, { size: 13, anchor: 'start' });
  return box(`0 0 ${W} ${H}`, g, `map, scale ${scaleTxt}`);
}
S4('mapscale', 3, 'Map scales', '🗺️', [
  ['A map is a small drawing of a big place. The scale tells you how far 1 cm on the map really is.', () => mapPic(PLACES.slice(0, 2), ['4 cm'], '1 cm = 5 km')],
  ['If 1 cm = 5 km, then 4 cm = 4 × 5 = 20 km.', () => '<span class="expr">4 × 5 km = 20 km</span>'],
  ['Going the other way? Divide: 30 km ÷ 5 = 6 cm on the map.', () => '<span class="expr">30 km ÷ 5 = 6 cm</span>']
], L => {
  const pl3 = shuffle(PLACES).slice(0, 3), [A, B, Cp] = pl3;
  if (L <= 2) {
    const s = L === 1 ? pick([2, 3, 5, 10]) : pick([5, 10, 20, 25, 50]), cm = L === 1 ? rnd(2, 6) : rnd(3, 9), km = s * cm;
    return Q({ prompt: `How far is it really from ${A[1]} to ${B[1]}?`, speak: `On this map, 1 centimetre stands for ${s} kilometres. The road from ${A[1]} to ${B[1]} is ${cm} centimetres on the map. How far is it really?`, visual: mapPic([A, B], [`${cm} cm`], `1 cm = ${s} km`),
      choices: opts(km, [km + s, km - s, cm + s, s * (cm + 1), km * 10].filter(v => v > 0 && v !== km), 4, v => `${v} km`, v => `${v} kilometres`), answer: km, explainText: `Each cm is ${s} km. ${cm} × ${s} = ${km} km.` });
  }
  if (L === 3) {
    const s = pick([2, 5, 10, 20, 25]), cm = rnd(2, 9), km = s * cm;
    if (Math.random() < 0.5) return Q({ prompt: `The real road is ${km} km. How long is it on the map?`, speak: `On this map, 1 centimetre stands for ${s} kilometres. The real road from ${A[1]} to ${B[1]} is ${km} kilometres. How long is it on the map?`, visual: mapPic([A, B], ['? cm'], `1 cm = ${s} km`),
      choices: opts(cm, [cm + 1, cm - 1, km, km * s, cm * 2].filter(v => v > 0 && v !== cm && v < 2000), 4, v => `${v} cm`, v => `${v} centimetres`), answer: cm, explainText: `Each cm is ${s} km. ${km} ÷ ${s} = ${cm} cm.` });
    const lab = v => `1 cm = ${v} km`;
    return Q({ prompt: `On the map the road is ${cm} cm. Really it is ${km} km. What is the scale?`, speak: `The road from ${A[1]} to ${B[1]} is ${cm} centimetres on the map. Really it is ${km} kilometres. What is the scale?`, visual: mapPic([A, B], [`${cm} cm`], 'scale ?'),
      choices: opts(s, [km, s + 5, s * 2, Math.max(1, s - 5), km - cm].filter(v => v > 0 && v !== s), 4, lab, v => `1 centimetre is ${v} kilometres`), answer: s, explainText: `${km} km ÷ ${cm} cm = ${s} km for every cm.` });
  }
  if (L === 4) {
    const s = pick([2, 4, 6, 10, 20]), c1 = rnd(2, 12) / 2, c2 = rnd(2, 12) / 2, tot = (c1 + c2) * s;
    return Q({ prompt: `How far is it from ${A[1]} to ${Cp[1]}, going through ${B[1]}?`, speak: `On this map, 1 centimetre stands for ${s} kilometres. ${A[1]} to ${B[1]} is ${c1} centimetres, and ${B[1]} to ${Cp[1]} is ${c2} centimetres. How far is the whole trip really?`, visual: mapPic(pl3, [`${fmt(c1)} cm`, `${fmt(c2)} cm`], `1 cm = ${s} km`),
      choices: opts(tot, [tot + s, tot - s, c1 + c2, c1 * s, tot + s / 2, (Math.floor(c1) + Math.floor(c2)) * s].filter(v => v > 0 && v !== tot), 4, v => `${fmt(v)} km`, v => `${fmt(v)} kilometres`), answer: tot,
      steps: [`On the map: ${fmt(c1)} + ${fmt(c2)} = ${fmt(c1 + c2)} cm.`, `${fmt(c1 + c2)} × ${s} = ${fmt(tot)} km.`], explainText: `The whole trip is ${fmt(tot)} km.` });
  }
  const sc = pick([25000, 50000, 100000, 200000, 250000]), cm = rnd(2, 12), km = cm * sc / 100000, per = sc / 100000;
  return Q({ prompt: `The map scale is 1 : ${fmt(sc)}. The path is ${cm} cm on the map. How far is it really?`, speak: `The map scale is 1 to ${sc}. The path from ${A[1]} to ${B[1]} is ${cm} centimetres on the map. How many kilometres is it really?`, visual: mapPic([A, B], [`${cm} cm`], `1 : ${fmt(sc)}`),
    choices: opts(km, [km * 10, km / 10, cm * sc / 1000, km + per, km * 2].map(v => +v.toFixed(3)).filter(v => v > 0 && v !== km), 4, v => `${fmt(v)} km`, v => `${fmt(v)} kilometres`), answer: km,
    steps: [`1 cm on the map is ${fmt(sc)} cm in real life.`, `${fmt(sc)} cm = ${fmt(sc / 100)} m = ${fmt(per)} km.`, `${cm} × ${fmt(per)} = ${fmt(km)} km.`], explainText: `It is really ${fmt(km)} km.` });
});

/* --- sports scores and averages --- */
const TEAMS = [['🦉', 'Owls'], ['🦊', 'Foxes'], ['🐻', 'Bears'], ['🐯', 'Tigers'], ['🦅', 'Eagles'], ['🐬', 'Dolphins']];
const board = (head, rows) => `<table class="m3tab m4sc"><tr><th></th>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(([n, v]) => `<tr><th>${n}</th>${v.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</table>`;
S4('sportsavg', 3, 'Sports scores and averages', '🏀', [
  ['A scoreboard shows the points in each part of the game. Add them for the total.', () => board(['Q1', 'Q2', 'Q3', 'Q4'], [['🦉 Owls', [12, 8, 15, 10]]])],
  ['The mean (average) shares the total out equally: add all the scores, then divide by how many games.', () => '<span class="expr">(3 + 5 + 4) ÷ 3 = 4</span>'],
  ['Working backwards: for a mean of 6 over 4 games you need 4 × 6 = 24 points in total.', () => '<span class="expr">4 × 6 = 24</span>']
], L => {
  const [t1, t2] = shuffle(TEAMS).slice(0, 2), nm = pick(NAMES4), Qs = ['Q1', 'Q2', 'Q3', 'Q4'];
  if (L === 1) {
    const q = Qs.map(() => rnd(6, 20)), s = sum(q);
    return Q({ prompt: `How many points did the ${t1[1]} score in the whole game?`, speak: `The scoreboard shows the ${t1[1]}' points in each quarter: ${q.join(', ')}. How many points altogether?`, visual: board(Qs, [[`${t1[0]} ${t1[1]}`, q]]), choices: nOpts(s, 1, 200, 4, [s + 10, s - 10, s + 1, q[0] + q[1] + q[2]]), answer: s,
      steps: [`${q[0]} + ${q[1]} = ${q[0] + q[1]}.`, `${q[2]} + ${q[3]} = ${q[2] + q[3]}.`, `${q[0] + q[1]} + ${q[2] + q[3]} = ${s}.`], explainText: `The ${t1[1]} scored ${s} points.` });
  }
  if (L === 2) {
    const a = Qs.map(() => rnd(6, 20)), b = Qs.map(() => rnd(6, 20)), sa = sum(a), sb = sum(b), d = Math.abs(sa - sb);
    if (!d) return MATH.sportsavg.gen(L);
    const win = sa > sb ? t1 : t2;
    return Q({ prompt: 'By how many points did the winning team win?', speak: `The ${t1[1]} scored ${a.join(', ')} in the four quarters. The ${t2[1]} scored ${b.join(', ')}. By how many points did the winning team win?`, visual: board(Qs, [[`${t1[0]} ${t1[1]}`, a], [`${t2[0]} ${t2[1]}`, b]]),
      choices: nOpts(d, 1, 99, 4, [d + 10, Math.abs(d - 10), Math.abs(a[3] - b[3]), d + 2].filter(v => v > 0)), answer: d, steps: [`${t1[1]}: ${a.join(' + ')} = ${sa}.`, `${t2[1]}: ${b.join(' + ')} = ${sb}.`, `${Math.max(sa, sb)} − ${Math.min(sa, sb)} = ${d}.`], explainText: `The ${win[1]} won by ${d} points.` });
  }
  if (L === 3) {
    const n = pick([3, 4, 5]), m = rnd(3, 15), v = Array.from({ length: n - 1 }, () => rnd(Math.max(0, m - 6), m + 6)), last = n * m - sum(v);
    if (last < 0 || last > 30) return MATH.sportsavg.gen(L);
    v.push(last); const g = Array.from({ length: n }, (_, i) => `G${i + 1}`);
    return Q({ prompt: `What is ${nm}'s mean score per game?`, speak: `${nm} scored ${v.join(', ')} points in ${n} games. What is the mean score per game?`, visual: board(g, [[nm, v]]), choices: nOpts(m, 0, 200, 4, [n * m, m + 1, m - 1, [...v].sort((a, b) => a - b)[Math.floor(n / 2)]]), answer: m,
      steps: [`Total: ${v.join(' + ')} = ${n * m}.`, `${n * m} ÷ ${n} games = ${m}.`], explainText: `${nm}'s mean is ${m} points a game.` });
  }
  if (L === 4) {
    const n = pick([4, 5]), m = rnd(8, 20), v = Array.from({ length: n - 1 }, () => rnd(m - 7, m + 5)), x = n * m - sum(v);
    if (x < 0 || x > 40) return MATH.sportsavg.gen(L);
    const g = Array.from({ length: n }, (_, i) => `G${i + 1}`);
    return Q({ prompt: `What must ${nm} score in game ${n} for a mean of ${m}?`, speak: `${nm} scored ${v.join(', ')} in the first ${n - 1} games. How many points does ${nm} need in game ${n} to have a mean of ${m}?`, visual: board(g, [[nm, [...v, '?']]]), choices: nOpts(x, 0, 99, 4, [m, n * m, x + n, Math.abs(x - n)]), answer: x,
      steps: [`A mean of ${m} over ${n} games needs ${n} × ${m} = ${n * m} points.`, `So far: ${v.join(' + ')} = ${sum(v)}.`, `${n * m} − ${sum(v)} = ${x}.`], explainText: `${nm} needs ${x} points.` });
  }
  if (Math.random() < 0.5) {
    const n = rnd(4, 6), m1 = rnd(12, 22), m2 = m1 + pick([-2, -1, 1, 2, 3]), x = (n + 1) * m2 - n * m1;
    if (x < 0) return MATH.sportsavg.gen(L);
    return Q({ prompt: word(`After ${n} games the ${t1[0]} ${t1[1]} had a mean of ${m1} points. After game ${n + 1} their mean was ${m2}. How many points did they score in game ${n + 1}?`), speak: `After ${n} games the ${t1[1]} had a mean of ${m1} points. After game ${n + 1} the mean was ${m2}. How many points did they score in game ${n + 1}?`,
      choices: nOpts(x, 0, 99, 4, [m2, m2 + (m2 - m1), (n + 1) * m2, x + m2 - m1 + 1].filter(v => v !== x)), answer: x,
      steps: [`Total after ${n} games: ${n} × ${m1} = ${n * m1}.`, `Total after ${n + 1} games: ${n + 1} × ${m2} = ${(n + 1) * m2}.`, `Game ${n + 1}: ${(n + 1) * m2} − ${n * m1} = ${x}.`], explainText: `They scored ${x} points in game ${n + 1}.` });
  }
  let v, s; do { v = Array.from({ length: 4 }, () => rnd(5, 25)); s = sum(v); } while (s % 4 === 0);
  const m = +(s / 4).toFixed(1), mr = Math.round(s / 4 * 10) / 10;
  return Q({ prompt: `What is ${nm}'s mean score, to 1 decimal place?`, speak: `${nm} scored ${v.join(', ')} in 4 games. What is the mean, to 1 decimal place?`, visual: board(['G1', 'G2', 'G3', 'G4'], [[nm, v]]),
    choices: opts(mr, [+(mr + 1).toFixed(1), +(mr - 1).toFixed(1), Math.round(s / 4) === mr ? mr + 0.5 : Math.round(s / 4), +(s / 3).toFixed(1), +(mr + 0.2).toFixed(1)].filter(x => x !== mr), 4), answer: mr,
    steps: [`Total: ${v.join(' + ')} = ${s}.`, `${s} ÷ 4 = ${fmt(s / 4)}.`, `To 1 decimal place: ${fmt(m)}.`], explainText: `The mean is ${fmt(mr)} points.` });
});

/* --- logic grid puzzles --- */
const LCATS = [
  { head: 'pet', items: [['🐶', 'the dog'], ['🐱', 'the cat'], ['🐟', 'the fish'], ['🐰', 'the rabbit'], ['🐦', 'the bird']], pos: (p, x) => `${p} has ${x}.`, neg: (p, x) => `${p} does not have ${x}.`, nei: (p, q, x) => `Neither ${p} nor ${q} has ${x}.`, who: x => `Who has ${x}?`, what: p => `Which pet does ${p} have?` },
  { head: 'fruit', items: [['🍎', 'apples'], ['🍌', 'bananas'], ['🍇', 'grapes'], ['🍓', 'strawberries'], ['🍉', 'melon']], pos: (p, x) => `${p} likes ${x} best.`, neg: (p, x) => `${p} does not like ${x} best.`, nei: (p, q, x) => `Neither ${p} nor ${q} likes ${x} best.`, who: x => `Who likes ${x} best?`, what: p => `Which fruit does ${p} like best?` },
  { head: 'game', items: [['⚽', 'football'], ['🎾', 'tennis'], ['🏀', 'basketball'], ['♟️', 'chess'], ['🏓', 'table tennis']], pos: (p, x) => `${p} plays ${x}.`, neg: (p, x) => `${p} does not play ${x}.`, nei: (p, q, x) => `Neither ${p} nor ${q} plays ${x}.`, who: x => `Who plays ${x}?`, what: p => `Which game does ${p} play?` }
];
const PERMS = n => n <= 1 ? [[0]] : PERMS(n - 1).flatMap(p => Array.from({ length: n }, (_, i) => [...p.slice(0, i), n - 1, ...p.slice(i)]));
const holds = (perm, c) => c.k === 'pos' ? perm[c.p] === c.x : c.k === 'neg' ? perm[c.p] !== c.x : perm[c.p] !== c.x && perm[c.q] !== c.x;
function logicPuzzle(n, kinds, maxClues) {
  const perms = PERMS(n); let best = null;
  for (let t = 0; t < 120; t++) {
    const sol = shuffle([...Array(n).keys()]), all = [];
    for (let p = 0; p < n; p++) for (let x = 0; x < n; x++) {
      if (x === sol[p] && kinds.includes('pos')) all.push({ k: 'pos', p, x });
      if (x !== sol[p] && kinds.includes('neg')) all.push({ k: 'neg', p, x });
      if (kinds.includes('nei')) for (let q = p + 1; q < n; q++) if (x !== sol[p] && x !== sol[q]) all.push({ k: 'nei', p, q, x });
    }
    const count = cl => perms.filter(pm => cl.every(c => holds(pm, c))).length;
    let clues = [];
    for (const c of shuffle(all)) { clues.push(c); if (count(clues) === 1) break; }
    if (count(clues) !== 1) continue;
    for (const c of shuffle(clues.slice())) { const rest = clues.filter(d => d !== c); if (count(rest) === 1) clues = rest; }
    if (!best || clues.length < best.clues.length) best = { sol, clues };
    if (clues.length <= maxClues) break;
  }
  return best;
}
const lgGrid = (people, items, sol) => `<table class="m3tab m4lg"><tr><th></th>${items.map(i => `<th>${i[0]}</th>`).join('')}</tr>${people.map((p, i) => `<tr><th>${p}</th>${items.map((_, x) => `<td class="${sol ? (sol[i] === x ? 'yes' : 'no') : ''}">${sol ? (sol[i] === x ? '✓' : '✗') : ''}</td>`).join('')}</tr>`).join('')}</table>`;
S4('logicgrid', 3, 'Logic grid puzzles', '🧩', [
  ['A logic grid helps you solve "who has what" puzzles. Each person has exactly one, and each one belongs to exactly one person.', () => lgGrid(['Mia', 'Leo'], LCATS[0].items.slice(0, 2), null)],
  ['"Mia does not have the dog." Put ✗ in Mia\'s dog box. Then Mia must have the cat, and Leo has the dog!', () => lgGrid(['Mia', 'Leo'], LCATS[0].items.slice(0, 2), [1, 0])],
  ['When a row has only one empty box left, that box must be ✓. Then cross out the rest of that column.', () => lgGrid(['Mia', 'Leo', 'Ava'], LCATS[0].items.slice(0, 3), [2, 0, 1])]
], L => {
  const n = L === 1 ? 2 : L <= 3 ? 3 : 4, cat = pick(LCATS), people = shuffle(NAMES4).slice(0, n), items = shuffle(cat.items).slice(0, n);
  const kinds = L === 1 || L === 3 ? ['neg'] : L === 2 ? ['pos', 'neg'] : L === 4 ? ['pos', 'neg', 'nei'] : ['neg', 'nei'];
  const { sol, clues } = logicPuzzle(n, kinds, [1, 2, 3, 4, 5][L - 1]);
  const txt = c => c.k === 'pos' ? cat.pos(people[c.p], items[c.x][1]) : c.k === 'neg' ? cat.neg(people[c.p], items[c.x][1]) : cat.nei(people[c.p], people[c.q], items[c.x][1]);
  const told = new Set(clues.filter(c => c.k === 'pos').map(c => c.x)), free = [...Array(n).keys()].filter(x => !told.has(x)), x = pick(free.length ? free : [...Array(n).keys()]), p = sol.indexOf(x);
  const vis = card('', clues.map((c, i) => `${i + 1}. ${txt(c)}`), 'clues') + lgGrid(people, items, null), cl = clues.map(txt).join(' ');
  const steps = [...clues.map(c => `${txt(c)} → ${c.k === 'pos' ? `✓ for ${people[c.p]} and ${items[c.x][0]}.` : c.k === 'neg' ? `✗ for ${people[c.p]} and ${items[c.x][0]}.` : `✗ for ${people[c.p]} and ${people[c.q]} with ${items[c.x][0]}.`}`), `Each row and each column has just one ✓, so fill in the boxes that are left.`];
  if (Math.random() < 0.5) return Q({ prompt: cat.who(`${items[x][1]} ${items[x][0]}`), speak: `Logic puzzle. ${people.join(', ')} each have a different ${cat.head}. ${cl} ${cat.who(items[x][1])}`, visual: vis,
    choices: people.map(q => C4(q, q, q)), answer: people[p], explain: lgGrid(people, items, sol), steps, explainText: `So ${cat.pos(people[p], items[x][1]).replace(/\.$/, '')}.` });
  return Q({ prompt: cat.what(people[p]), speak: `Logic puzzle. ${people.join(', ')} each have a different ${cat.head}. ${cl} ${cat.what(people[p])}`, visual: vis,
    choices: items.map((it, i) => C4(i, `<span class="m4emo">${it[0]}</span>`, it[1])), answer: x, explain: lgGrid(people, items, sol), steps, explainText: `So ${cat.pos(people[p], items[x][1]).replace(/\.$/, '')}.` });
});

/* ===================== Mountain Peak (world 4) ===================== */

const PACKS = [['🧃', 'juice boxes'], ['🍫', 'chocolate bars'], ['🧻', 'toilet rolls'], ['🥚', 'eggs'], ['🍪', 'cookies'], ['🔋', 'batteries'], ['🧼', 'soap bars'], ['🎾', 'tennis balls'], ['✏️', 'pencils']];
const BULK = [['🍚', 'rice', 'g'], ['🍝', 'pasta', 'g'], ['🥣', 'cereal', 'g'], ['🧴', 'shampoo', 'ml'], ['🥛', 'milk', 'ml'], ['☕', 'coffee', 'g'], ['🧀', 'cheese', 'g']];
const tag = (lab, top, price) => `<div class="m4tag"><b>${lab}</b><span>${top}</span><em>${price}</em></div>`;
const tags = (...a) => `<div class="m4tags">${a.join('')}</div>`;
const wtS = (w, u) => w >= 1000 ? `${fmt(w / 1000)} ${u === 'g' ? 'kg' : 'L'}` : `${w} ${u}`;
const wtSay = (w, u) => w >= 1000 ? `${fmt(w / 1000)} ${u === 'g' ? 'kilograms' : 'litres'}` : `${w} ${u === 'g' ? 'grams' : 'millilitres'}`;
const centsTxt = c => c >= 100 ? usd2(c) : Number.isInteger(c) ? `${c}¢` : `${fmt(+c.toFixed(2))}¢`;
S4('bestbuy', 4, 'Best buys', '🏷️', [
  ['Bigger packs are not always cheaper! Compare the price for one of each.', () => tags(tag('A', '🧃×4', '$3.00'), tag('B', '🧃×6', '$4.80'))],
  ['A: $3.00 ÷ 4 = 75¢ each. B: $4.80 ÷ 6 = 80¢ each. A is the better buy.', () => '<span class="expr">75¢ &lt; 80¢</span>'],
  ['For food sold by weight, compare the price per 100 g or per kg.', () => tags(tag('A', '🍚 500 g', '$2.00'), tag('B', '🍚 1 kg', '$3.50'))]
], L => {
  const L3 = ['A', 'B', 'C'];
  if (L === 1 || L === 3) {
    const k = L === 1 ? 2 : 3, [e, nm] = pick(PACKS), cnt = shuffle([2, 3, 4, 5, 6, 8, 10, 12]).slice(0, k);
    let u = Array.from({ length: k }, () => rnd(4, 30) * 5); const tie = L === 1 && Math.random() < 0.15;
    if (tie) u[1] = u[0];
    else if (new Set(u).size < k || u.filter(v => v === Math.min(...u)).length > 1) return MATH.bestbuy.gen(L);
    const pr = u.map((v, i) => v * cnt[i]), best = tie ? 'same' : L3[u.indexOf(Math.min(...u))];
    const ch = L === 1 ? [C4('A', 'Pack A', 'pack A'), C4('B', 'Pack B', 'pack B'), C4('same', 'Same value', 'they are the same')] : L3.map(l => C4(l, `Pack ${l}`, `pack ${l}`));
    return Q({ prompt: 'Which is the better buy?', speak: `${cnt.map((c, i) => `Pack ${L3[i]}: ${c} ${nm} for ${usdSay(pr[i])}.`).join(' ')} Which is the better buy?`, visual: tags(...cnt.map((c, i) => tag(L3[i], `${e}×${c}`, usd2(pr[i])))), choices: ch, answer: best,
      steps: cnt.map((c, i) => `Pack ${L3[i]}: ${usd2(pr[i])} ÷ ${c} = ${centsTxt(u[i])} each.`), explainText: tie ? 'They cost the same for each one, so neither is better.' : `Pack ${best} is cheapest for each one, so it is the better buy.` });
  }
  if (L === 2) {
    const [e, nm, un] = pick(BULK), w = pick([200, 250, 300, 400, 500, 750, 1000]), u = rnd(2, 20) * 10, p = u * w / 100;
    return Q({ prompt: `What is the price per 100 ${un}?`, speak: `A pack of ${nm} has ${wtSay(w, un)} and costs ${usdSay(p)}. What is the price for every 100 ${un === 'g' ? 'grams' : 'millilitres'}?`, visual: tags(tag('', `${e} ${wtS(w, un)}`, usd2(p))),
      choices: mOpts(u, [u + 10, u - 10, u * 2, p / 10, u + 50], usd2), answer: u, steps: [`${wtS(w, un)} is ${w / 100} lots of 100 ${un}.`, `${usd2(p)} ÷ ${fmt(w / 100)} = ${usd2(u)}.`], explainText: `${usd2(u)} for every 100 ${un}.` });
  }
  if (L === 4) {
    const [e, nm, un] = pick(BULK), w = pick([200, 250, 400, 500, 750, 1500, 2000]); let u, p, t = 0;
    do { u = rnd(10, 150) * 10; p = u * w / 1000; } while ((!Number.isInteger(p) || p % 5) && ++t < 100);
    if (!Number.isInteger(p)) return MATH.bestbuy.gen(L);
    const big = un === 'g' ? 'kg' : 'litre';
    return Q({ prompt: `${e} ${wtS(w, un)} costs ${usd2(p)}. What is the price per ${big}?`, speak: `${wtSay(w, un)} of ${nm} costs ${usdSay(p)}. What is the price per ${un === 'g' ? 'kilogram' : 'litre'}?`, visual: tags(tag('', `${e} ${wtS(w, un)}`, usd2(p))),
      choices: mOpts(u, [p, u / 10, u * 2, u / 2, p * 10], usd2), answer: u, steps: [`1 ${big} = 1000 ${un}.`, `1000 ÷ ${w} = ${fmt(1000 / w)}.`, `${usd2(p)} × ${fmt(1000 / w)} = ${usd2(u)}.`], explainText: `${usd2(u)} per ${big}.` });
  }
  const [e, nm] = pick(PACKS), p = rnd(2, 10) * 30, q = rnd(8, 40) * 30, ua = p * 2 / 3, ub = q / 6;
  if (Math.random() < 0.5) {
    if (ua === ub) return MATH.bestbuy.gen(L);
    const best = ua < ub ? 'A' : 'B';
    return Q({ prompt: 'Which shop is cheaper for each one?', speak: `Shop A sells ${nm} for ${usdSay(p)} each, buy 2 get 1 free. Shop B sells a pack of 6 for ${usdSay(q)}. Which shop is cheaper for each one?`, visual: tags(tag('Shop A', `${e} ${usd2(p)} each`, 'Buy 2, get 1 free!'), tag('Shop B', `${e}×6`, usd2(q))),
      choices: [C4('A', 'Shop A', 'shop A'), C4('B', 'Shop B', 'shop B')], answer: best, steps: [`Shop A: you pay for 2 and get 3. ${usd2(2 * p)} ÷ 3 = ${usd2(ua)} each.`, `Shop B: ${usd2(q)} ÷ 6 = ${usd2(ub)} each.`], explainText: `Shop ${best} is cheaper for each one.` });
  }
  const n = pick([6, 9, 12]), pay = n / 3 * 2 * p;
  return Q({ prompt: `Buy 2, get 1 free. How much do ${n} ${e} cost?`, speak: `${cap4(nm)} cost ${usdSay(p)} each, and it is buy 2 get 1 free. How much do you pay for ${n}?`, visual: tags(tag('Offer', `${e} ${usd2(p)} each`, 'Buy 2, get 1 free!')),
    choices: mOpts(pay, [n * p, (n - 1) * p, n / 2 * p, pay + p], usd2), answer: pay, steps: [`Every 3 you take, you pay for 2.`, `${n} ÷ 3 = ${n / 3} groups, so you pay for ${n / 3} × 2 = ${n / 3 * 2}.`, `${n / 3 * 2} × ${usd2(p)} = ${usd2(pay)}.`], explainText: `You pay ${usd2(pay)}.` });
});

/* --- sales and tips --- */
const SALE = [['👟', 'trainers'], ['🧥', 'coat'], ['🎮', 'game'], ['🎒', 'backpack'], ['🚲', 'bike'], ['🎧', 'headphones'], ['👗', 'dress'], ['⌚', 'watch'], ['⛺', 'tent']];
const saleTag = (e, price, pct) => `<div class="m4sale"><span class="e">${e}</span><b>${usd(price)}</b>${pct ? `<i>${pct}% OFF</i>` : ''}</div>`;
const receipt = lines => `<div class="m4receipt"><b>🧾 Bill</b>${lines.map(([a, b]) => `<div><span>${a}</span><span>${b}</span></div>`).join('')}</div>`;
const pctOpts = (ans, c) => opts(ans, c.filter(v => v > 0 && v < 100 && v !== ans), 4, v => v + '%', v => v + ' percent').map(o => ({ ...o, txt: true }));
S4('salestips', 4, 'Sales and tips', '🛍️', [
  ['"25% off" means you save 25 out of every 100. On $40 you save $10, so you pay $30.', () => saleTag('👟', 4000, 25)],
  ['A tip is extra money for good service. 10% is easy: move the decimal point one place. 10% of $36 = $3.60.', () => receipt([['Meal', '$36.00'], ['Tip 10%', '$3.60']])],
  ['15% = 10% + 5%. And 5% is half of 10%. On $40: $4 + $2 = $6.', () => '<span class="expr">15% of $40 = $4 + $2 = $6</span>']
], L => {
  const [e, nm] = pick(SALE);
  if (L === 1 || (L === 3 && Math.random() < 0.5)) {
    const pct = L === 1 ? pick([50, 25, 10]) : pick([30, 40, 60, 75, 20]), step = { 50: 2, 25: 4, 10: 10, 30: 10, 40: 5, 60: 5, 75: 4, 20: 5 }[pct], P = rnd(Math.ceil(10 / step), Math.floor(200 / step)) * step * 100, off = P * pct / 100, sp = P - off;
    return Q({ prompt: `The ${e} is ${pct}% off. What is the sale price?`, speak: `The ${nm} usually costs ${usdSay(P)}. It is ${pct} percent off. What is the sale price?`, visual: saleTag(e, P, pct), choices: mOpts(sp, [off, P, P - pct * 100, sp + 500, sp - 500, sp + 100, sp - 100, sp + 1000].filter(v => v !== sp)), answer: sp,
      steps: [pct === 50 ? `50% is half. Half of ${usd(P)} is ${usd(off)}.` : pct === 25 ? `25% is a quarter. ${usd(P)} ÷ 4 = ${usd(off)}.` : pct === 10 ? `10% is ${usd(P)} ÷ 10 = ${usd(off)}.` : `10% of ${usd(P)} is ${usd(P / 10)}, so ${pct}% is ${pct / 10} × ${usd(P / 10)} = ${usd(off)}.`, `${usd(P)} − ${usd(off)} = ${usd(sp)}.`], explainText: `The sale price is ${usd(sp)}.` });
  }
  if (L === 2 || L === 3) {
    const pct = L === 2 ? pick([10, 20]) : 15, bill = rnd(12, 90) * 100, tip = bill * pct / 100, tot = bill + tip, askTot = L === 3;
    const ans = askTot ? tot : tip;
    return Q({ prompt: askTot ? `The bill is ${usd2(bill)}. Add a ${pct}% tip. How much do you pay altogether?` : `The bill is ${usd2(bill)}. How much is a ${pct}% tip?`, speak: `The bill is ${usdSay(bill)}. ${askTot ? `You add a ${pct} percent tip. How much do you pay altogether?` : `How much is a ${pct} percent tip?`}`, visual: receipt([['Meal', usd2(bill)], [`Tip ${pct}%`, '?']]),
      choices: mOpts(ans, askTot ? [bill + bill / 10, tot + 100, tot - 100, tip, bill + 1500] : [tip * 10, pct === 20 ? tip / 2 : tip * 2, tip + 100, bill / 100 * 10, tip + 10], usd2), answer: ans,
      steps: [`10% of ${usd2(bill)} is ${usd2(bill / 10)}.`, ...(pct === 20 ? [`20% is double that: ${usd2(tip)}.`] : pct === 15 ? [`5% is half of that: ${usd2(bill / 20)}.`, `15% = ${usd2(bill / 10)} + ${usd2(bill / 20)} = ${usd2(tip)}.`] : []), ...(askTot ? [`${usd2(bill)} + ${usd2(tip)} = ${usd2(tot)}.`] : [])], explainText: askTot ? `You pay ${usd2(tot)}.` : `The tip is ${usd2(tip)}.` });
  }
  if (L === 4) {
    if (Math.random() < 0.5) {
      const pct = pick([10, 20, 25, 50]), O = rnd(2, 15) * 20 * 100, sp = O * (100 - pct) / 100;
      return Q({ prompt: `After ${pct}% off, the ${e} costs ${usd(sp)}. What was the price before?`, speak: `After ${pct} percent off, the ${nm} costs ${usdSay(sp)}. What was the price before the sale?`, visual: saleTag(e, sp, pct), choices: mOpts(O, [sp + sp * pct / 100, sp * (100 + pct) / 100, O + 1000, O - 1000, sp * 2]), answer: O,
        steps: [`${pct}% off means you pay ${100 - pct}% of the old price.`, `${100 - pct}% = ${usd(sp)}, so 1% = ${usd(sp)} ÷ ${100 - pct} = ${usd2(sp / (100 - pct))}.`, `100% = ${usd(O)}.`], explainText: `It was ${usd(O)} before. (Adding ${pct}% to the sale price would give the wrong answer!)` });
    }
    const pct = pick([10, 20, 25, 30, 40, 50, 75]), O = rnd(1, 10) * 20 * 100, sp = O * (100 - pct) / 100;
    return Q({ prompt: `The ${e} was ${usd(O)}. Now it is ${usd(sp)}. What percent off is that?`, speak: `The ${nm} was ${usdSay(O)}. Now it costs ${usdSay(sp)}. What percent off is that?`, visual: row(saleTag(e, O, 0), '<span class="m4arr">→</span>', saleTag(e, sp, 0)), choices: pctOpts(pct, [100 - pct, pct + 5, pct - 5, pct + 10, (O - sp) / 100]), answer: pct,
      steps: [`You save ${usd(O)} − ${usd(sp)} = ${usd(O - sp)}.`, `${usd(O - sp)} ÷ ${usd(O)} = ${fmt(pct / 100)} = ${pct}%.`], explainText: `It is ${pct}% off.` });
  }
  if (Math.random() < 0.5) {
    const p1 = pick([20, 25, 30, 50]), p2 = pick([10, 20]), P = rnd(2, 12) * 20 * 100, mid = P * (100 - p1) / 100, fin = mid * (100 - p2) / 100, wrong = P * (100 - p1 - p2) / 100;
    return Q({ prompt: `The ${e} is ${p1}% off, then an extra ${p2}% off the sale price. What do you pay?`, speak: `The ${nm} usually costs ${usdSay(P)}. It is ${p1} percent off, and then there is an extra ${p2} percent off the sale price. What do you pay?`, visual: saleTag(e, P, `${p1}% + ${p2}`), choices: mOpts(fin, [wrong, mid, fin + 100, fin - 100, P * p1 * p2 / 10000], usd2), answer: fin,
      steps: [`${p1}% off ${usd(P)}: ${usd(P)} × ${fmt((100 - p1) / 100)} = ${usd2(mid)}.`, `Extra ${p2}% off ${usd2(mid)}: ${usd2(mid)} × ${fmt((100 - p2) / 100)} = ${usd2(fin)}.`], explainText: `You pay ${usd2(fin)}. That is not the same as ${p1 + p2}% off, which would be ${usd2(wrong)}.` });
  }
  const pct = pick([5, 10, 15, 20, 25, 50]), O = rnd(1, 4) * 20 * 100, N = O * (100 + pct) / 100, [te, tn] = pick([['🎟️', 'concert ticket'], ['🚌', 'bus pass'], ['🏊', 'swim pass'], ['🎬', 'film ticket']]);
  return Q({ prompt: `A ${te} went up from ${usd(O)} to ${usd(N)}. What is the percentage increase?`, speak: `The price of a ${tn} went up from ${usdSay(O)} to ${usdSay(N)}. What is the percentage increase?`, visual: row(saleTag(te, O, 0), '<span class="m4arr">→</span>', saleTag(te, N, 0)),
    choices: pctOpts(pct, [(N - O) / 100, Math.round((N - O) / N * 100), pct + 5, pct * 2]), answer: pct, steps: [`Increase: ${usd(N)} − ${usd(O)} = ${usd(N - O)}.`, `${usd(N - O)} ÷ ${usd(O)} (the old price) = ${fmt(pct / 100)}.`, `${fmt(pct / 100)} = ${pct}%.`], explainText: `A ${pct}% increase.` });
});

/* --- spinners and dice --- */
const SPIN = [['#F2604F', 'red'], ['#2E8BE6', 'blue'], ['#FFC23D', 'yellow'], ['#2FA36B', 'green'], ['#6D55D1', 'purple']];
function spinner(secs) { // secs: [{c, lab}]
  const n = secs.length; let g = '';
  secs.forEach((s, i) => {
    const a0 = i / n * 2 * Math.PI - Math.PI / 2, a1 = (i + 1) / n * 2 * Math.PI - Math.PI / 2, am = (a0 + a1) / 2, P = (a, r) => `${+(100 + r * Math.cos(a)).toFixed(1)} ${+(104 + r * Math.sin(a)).toFixed(1)}`;
    g += `<path d="M100 104 L${P(a0, 84)} A84 84 0 0 1 ${P(a1, 84)} Z" fill="${s.c}" stroke="${K}" stroke-width="2"/>`;
    if (s.lab != null) g += T(100 + 56 * Math.cos(am), 104 + 56 * Math.sin(am) + 5, s.lab, { size: n > 6 ? 13 : 16 });
  });
  g += `<circle cx="100" cy="104" r="7" fill="${K}"/><path d="M100 104 L128 72" stroke="${K}" stroke-width="5" stroke-linecap="round"/><polygon points="92,4 108,4 100,22" fill="${K}"/>`;
  return `<div class="shape m4spin"><svg viewBox="0 0 200 196" role="img" aria-label="spinner with ${n} equal parts">${g}</svg></div>`;
}
const PIP = { 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[28, 28], [50, 50], [72, 72]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]], 6: [[28, 26], [72, 26], [28, 50], [72, 50], [28, 74], [72, 74]] };
const die4 = (n, hot) => `<svg class="m4die" viewBox="0 0 100 100" role="img" aria-label="dice showing ${n}"><rect x="5" y="5" width="90" height="90" rx="16" fill="${hot ? '#FFD98A' : '#fff'}" stroke="${K}" stroke-width="5"/>${PIP[n].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${K}"/>`).join('')}</svg>`;
const sumGrid = k => `<table class="m3tab m4sum"><tr><th>+</th>${[1, 2, 3, 4, 5, 6].map(i => `<th>${i}</th>`).join('')}</tr>${[1, 2, 3, 4, 5, 6].map(a => `<tr><th>${a}</th>${[1, 2, 3, 4, 5, 6].map(b => `<td class="${a + b === k ? 'hi' : ''}">${a + b}</td>`).join('')}</tr>`).join('')}</table>`;
const signed = c => c > 0 ? '+' + usd2(c) : usd2(c);
const gainSay = c => c > 0 ? `win ${usdSay(c)}` : `lose ${usdSay(-c)}`;
S4('expected', 4, 'Spinners and dice games', '🎡', [
  ['Probability tells you what to expect. This spinner lands on red 1 time in 4.', () => spinner([{ c: '#F2604F' }, { c: '#2E8BE6' }, { c: '#2E8BE6' }, { c: '#2E8BE6' }])],
  ['Spin it 40 times and you expect about ¼ × 40 = 10 reds. Not exactly 10 every time, but close.', () => '<span class="expr">¼ × 40 = 10</span>'],
  ['Expected winnings: add up the prizes and share by the number of equal parts. ($0 + $0 + $2 + $6) ÷ 4 = $2 a spin.', () => spinner([{ c: '#F2604F', lab: '$0' }, { c: '#2E8BE6', lab: '$2' }, { c: '#FFC23D', lab: '$0' }, { c: '#2FA36B', lab: '$6' }])]
], L => {
  if (L === 1) {
    const n = pick([4, 5, 6, 8, 10]), r = rnd(1, n - 1), N = n * rnd(2, 10), ans = r * N / n, others = shuffle(SPIN.slice(1)).slice(0, 2);
    const secs = shuffle([...Array(r).fill(SPIN[0]), ...Array.from({ length: n - r }, (_, i) => others[i % 2])]).map(([c]) => ({ c }));
    return Q({ prompt: `You spin ${N} times. About how many times will it land on red?`, speak: `This spinner has ${n} equal parts and ${r} of them are red. You spin it ${N} times. About how many times would you expect red?`, visual: spinner(secs), choices: nOpts(ans, 0, 999, 4, [r, N / n, N - ans, ans + n].filter(Number.isInteger)), answer: ans,
      steps: [`${r} out of ${n} parts are red: the chance is ${r}/${n}.`, `${r}/${n} of ${N} = ${N} ÷ ${n} × ${r} = ${ans}.`], explainText: `Expect about ${ans} reds.` });
  }
  if (L === 2) {
    const [ev, k, faces] = pick([['a 6', 1, [6]], ['an even number', 3, [2, 4, 6]], ['a number bigger than 4', 2, [5, 6]], ['a 1 or a 2', 2, [1, 2]], ['a number less than 4', 3, [1, 2, 3]], ['a 5', 1, [5]]]), N = pick([30, 60, 120, 300, 600]), ans = N * k / 6;
    return Q({ prompt: `You roll a dice ${N} times. About how many times will you get ${ev}?`, visual: row(...[1, 2, 3, 4, 5, 6].map(i => die4(i))), choices: nOpts(ans, 1, 999, 4, [N / 6, N / 2, N / 3, ans + 10, N - ans].filter(v => Number.isInteger(v) && v !== ans)), answer: ans,
      explain: row(...[1, 2, 3, 4, 5, 6].map(i => die4(i, faces.includes(i)))), steps: [`${k} of the 6 faces ${k === 1 ? 'is' : 'are'} ${ev}: the chance is ${k}/6.`, `${k}/6 of ${N} = ${N} ÷ 6 × ${k} = ${ans}.`], explainText: `Expect about ${ans}.` });
  }
  if (L === 3) {
    const k = rnd(3, 11), w = 6 - Math.abs(7 - k), N = pick([36, 72, 180, 360]), ans = w * N / 36;
    return Q({ prompt: `You roll two dice ${N} times. About how many times will the total be ${k}?`, speak: `You roll two dice and add them, ${N} times. About how many times would you expect a total of ${k}?`, visual: row(die4(rnd(1, 6)), die4(rnd(1, 6))),
      choices: nOpts(ans, 1, 999, 4, [(w + 1) * N / 36, Math.max(1, w - 1) * N / 36, N / 11, N / 36, N / 6].filter(v => Number.isInteger(v) && v !== ans)), answer: ans,
      explain: sumGrid(k), steps: [`Two dice make 6 × 6 = 36 equally likely pairs.`, `${w} of them add up to ${k}, so the chance is ${w}/36.`, `${w}/36 of ${N} = ${N} ÷ 36 × ${w} = ${ans}.`], explainText: `Expect about ${ans}.` });
  }
  const n = pick([4, 5, 8, 10]); let prizes, ev, t = 0;
  do { prizes = Array.from({ length: n }, () => pick([0, 0, 0, 1, 2, 5, 10])); ev = sum(prizes) * 100 / n; } while ((!Number.isInteger(ev) || ev === 0 || new Set(prizes).size < 2) && ++t < 100);
  if (!Number.isInteger(ev)) return MATH.expected.gen(L);
  const secs = prizes.map((p, i) => ({ c: SPIN[i % 5][0], lab: '$' + p })), distinct = [...new Set(prizes)], avgD = Math.round(sum(distinct) * 100 / distinct.length);
  const st = [`There are ${n} equal parts. Add the prizes: ${prizes.map(p => '$' + p).join(' + ')} = $${sum(prizes)}.`, `$${sum(prizes)} ÷ ${n} = ${usd2(ev)} a spin, on average.`];
  if (L === 4) return Q({ prompt: 'On average, how much do you win per spin?', speak: `This spinner has ${n} equal parts with prizes of ${prizes.map(p => pl(p, 'dollar')).join(', ')}. On average, how much do you win per spin?`, visual: spinner(secs),
    choices: mOpts(ev, [avgD, sum(prizes) * 100, ev + 50, ev - 50, Math.max(...prizes) * 100 / 2], usd2), answer: ev, steps: st, explainText: `On average you win ${usd2(ev)} a spin.` });
  const cost = pick([100, 200, 300].filter(c => c !== ev)), gain = ev - cost, games = 100;
  if (Math.random() < 0.5) return Q({ prompt: `It costs ${usd(cost)} to spin. On average, how much do you win or lose per game?`, speak: `It costs ${usdSay(cost)} to spin. The prizes are ${prizes.map(p => pl(p, 'dollar')).join(', ')}. On average, how much do you win or lose each game?`, visual: spinner(secs),
    choices: opts(gain, [-gain, ev, gain + 50, gain - 50, -cost].filter(v => v !== gain && v !== 0), 4, signed, gainSay), answer: gain, steps: [...st, `Take away the ${usd(cost)} cost: ${usd2(ev)} − ${usd2(cost)} = ${signed(gain)}.`], explainText: `On average you ${gainSay(gain)} each game.` });
  return Q({ prompt: `It costs ${usd(cost)} to spin. You play ${games} times. About how much will you win or lose altogether?`, speak: `It costs ${usdSay(cost)} to spin. The prizes are ${prizes.map(p => pl(p, 'dollar')).join(', ')}. You play ${games} times. About how much will you win or lose altogether?`, visual: spinner(secs),
    choices: opts(gain * games, [-gain * games, ev * games, gain * 10, (gain + 50) * games].filter(v => v !== gain * games && v !== 0), 4, signed, gainSay), answer: gain * games, steps: [...st, `Each game: ${usd2(ev)} − ${usd2(cost)} = ${signed(gain)}.`, `${games} games: ${games} × ${signed(gain)} = ${signed(gain * games)}.`], explainText: `About ${signed(gain * games)}: you ${gainSay(gain * games)}.` });
});

/* --- pattern rules and the nth term --- */
function tablesPic(n) { const W = n * 26 + 32; let g = ''; for (let i = 0; i < n; i++) { const x = 16 + i * 26; g += `<rect x="${x}" y="16" width="26" height="26" fill="#C9B58F" stroke="${K}" stroke-width="2"/><circle cx="${x + 13}" cy="8" r="5.5" fill="#F2604F"/><circle cx="${x + 13}" cy="50" r="5.5" fill="#F2604F"/>`; } g += `<circle cx="8" cy="29" r="5.5" fill="#F2604F"/><circle cx="${W - 8}" cy="29" r="5.5" fill="#F2604F"/>`; return [W, 58, g]; }
function sticksPic(n) { const s = 24, W = n * s + 10; let g = ''; const st = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#B5651D" stroke-width="4" stroke-linecap="round"/>`; for (let i = 0; i <= n; i++) g += st(5 + i * s, 5, 5 + i * s, 5 + s); for (let i = 0; i < n; i++) g += st(5 + i * s, 5, 5 + (i + 1) * s, 5) + st(5 + i * s, 5 + s, 5 + (i + 1) * s, 5 + s); return [W, s + 10, g]; }
function triPic(n) { const s = 26, h = 22, B = j => [5 + j * s, 5 + h], Tp = j => [5 + j * s + s / 2, 5]; const ed = new Set(), out = []; const add = (a, b) => { const k = [a, b].map(p => p.join(',')).sort().join('|'); if (!ed.has(k)) { ed.add(k); out.push(`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#B5651D" stroke-width="4" stroke-linecap="round"/>`); } };
  for (let i = 0; i < n; i++) { const j = Math.floor(i / 2); if (i % 2 === 0) { add(B(j), B(j + 1)); add(B(j), Tp(j)); add(Tp(j), B(j + 1)); } else { add(Tp(j), Tp(j + 1)); add(Tp(j + 1), B(j + 1)); add(Tp(j), B(j + 1)); } }
  return [Math.ceil((n + 1) / 2) * s + 10 + s / 2, h + 10, out.join('')]; }
function gridPic(cols, rows, fill) { const c = 13; let g = ''; for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) g += `<rect x="${2 + q * c}" y="${2 + r * c}" width="${c}" height="${c}" fill="${fill(q, r)}" stroke="${K}" stroke-width="1"/>`; return [cols * c + 4, rows * c + 4, g]; }
const pondPic = n => gridPic(n + 2, 3, (q, r) => r === 1 && q > 0 && q <= n ? '#7CC8F5' : '#B9C3CF');
const bedPic = n => gridPic(n + 2, n + 2, (q, r) => q > 0 && r > 0 && q <= n && r <= n ? '#7ED19B' : '#B9C3CF');
function cansPic(n) { const r = 8; let g = ''; for (let row = 0; row < n; row++) for (let i = 0; i < n - row; i++) g += `<rect x="${3 + row * r + i * 2 * r}" y="${3 + (n - 1 - row) * 18}" width="${2 * r - 2}" height="16" rx="3" fill="#F2604F" stroke="${K}" stroke-width="1.2"/><rect x="${3 + row * r + i * 2 * r}" y="${8 + (n - 1 - row) * 18}" width="${2 * r - 2}" height="5" fill="#fff"/>`; return [n * 2 * r + 6, n * 18 + 6, g]; }
const PATS = [
  { pic: tablesPic, a: 2, b: 2, unit: 'chairs', what: 'tables in a row with chairs around them' },
  { pic: sticksPic, a: 3, b: 1, unit: 'matchsticks', what: 'squares made of matchsticks' },
  { pic: triPic, a: 2, b: 1, unit: 'matchsticks', what: 'triangles made of matchsticks' },
  { pic: pondPic, a: 2, b: 6, unit: 'border tiles', what: 'a pond with grey tiles around it' },
  { pic: bedPic, a: 4, b: 4, unit: 'grey tiles', what: 'a square flower bed with grey tiles around it' }
];
const pats = (pic, ns, lab = n => `Pattern ${n}`) => `<div class="m4pats">${ns.map(n => { const [w, h, g] = pic(n); return `<figure><svg viewBox="0 0 ${w} ${h}" style="width:${Math.min(w * 1.15, 130)}px" role="img" aria-label="${lab(n)}">${g}</svg><figcaption>${lab(n)}</figcaption></figure>`; }).join('')}</div>`;
const rule = (a, b) => `${a === 1 ? '' : a}n${b ? ` + ${b}` : ''}`;
const ruleSay = (a, b) => `${a === 1 ? '' : a + ' '}n${b ? ` plus ${b}` : ''}`;
S4('nthterm', 4, 'Pattern rules', '🧱', [
  ['Tables in a row: 1 table seats 4, 2 tables seat 6, 3 tables seat 8. Each new table adds 2 chairs.', () => pats(tablesPic, [1, 2, 3])],
  ['So the rule is 2n + 2: two chairs for each table, plus one at each end. 10 tables seat 2 × 10 + 2 = 22.', () => '<span class="expr">2n + 2</span>'],
  ['Some patterns grow faster. A square bed of n × n flowers has n² flower tiles.', () => pats(bedPic, [1, 2, 3])]
], L => {
  const P = pick(PATS), f = n => P.a * n + P.b, show = pats(P.pic, [1, 2, 3]), sp = `The pattern shows ${P.what}.`;
  const why = N => [`Pattern 1 has ${f(1)}, pattern 2 has ${f(2)}, pattern 3 has ${f(3)}: each one adds ${P.a}.`, `So pattern n has ${P.a} × n + ${P.b}. The rule is ${rule(P.a, P.b)}.`, `Pattern ${N}: ${P.a} × ${N} + ${P.b} = ${f(N)}.`];
  if (L === 1) return Q({ prompt: `How many ${P.unit} in pattern 4?`, speak: `${sp} Pattern 1 has ${f(1)} ${P.unit}, pattern 2 has ${f(2)}, pattern 3 has ${f(3)}. How many ${P.unit} in pattern 4?`, visual: show, choices: nOpts(f(4), 1, 99, 4, [f(3) + 1, f(4) + P.a, f(4) - 1, 4 * P.a]), answer: f(4),
    explain: pats(P.pic, [4]), explainText: `Each pattern adds ${P.a} ${P.unit}: ${f(1)}, ${f(2)}, ${f(3)}, ${f(4)}. Pattern 4 has ${f(4)}.` });
  if (L === 2) { const N = rnd(6, 15); return Q({ prompt: `How many ${P.unit} in pattern ${N}?`, speak: `${sp} Pattern 1 has ${f(1)} ${P.unit}, pattern 2 has ${f(2)}, pattern 3 has ${f(3)}. How many ${P.unit} in pattern ${N}?`, visual: show, choices: nOpts(f(N), 1, 999, 4, [P.a * N, f(1) * N, f(N) + P.a, f(N) - P.a]), answer: f(N), steps: why(N), explainText: `Pattern ${N} has ${f(N)} ${P.unit}.` }); }
  if (L === 3) {
    const ans = rule(P.a, P.b), cands = [[P.a, 0], [1, P.a + P.b], [P.b, P.a], [P.a + P.b, 0], [P.a, P.b + P.a], [P.a, P.b - 1], [P.a + 1, P.b - 1]].filter(([a, b]) => a > 0 && b >= 0 && rule(a, b) !== ans);
    return Q({ prompt: `Which rule gives the number of ${P.unit} in pattern n?`, speak: `${sp} Pattern 1 has ${f(1)} ${P.unit}, pattern 2 has ${f(2)}, pattern 3 has ${f(3)}. Which rule gives the number in pattern n?`, visual: show,
      choices: opts(ans, cands.map(([a, b]) => rule(a, b)), 4, v => v, v => { const m = v.match(/^(\d*)n(?: \+ (\d+))?$/); return ruleSay(m[1] ? +m[1] : 1, m[2] ? +m[2] : 0); }), answer: ans,
      steps: why(1).slice(0, 2).concat([`Check pattern 3: ${P.a} × 3 + ${P.b} = ${f(3)}. ✓`]), explainText: `The rule is ${ans}.` });
  }
  if (L === 4) {
    if (Math.random() < 0.5) { const k = rnd(10, 40), Tt = f(k); return Q({ prompt: `Which pattern uses exactly ${Tt} ${P.unit}?`, speak: `${sp} Pattern 1 has ${f(1)} ${P.unit}, pattern 2 has ${f(2)}, pattern 3 has ${f(3)}. Which pattern number uses exactly ${Tt}?`, visual: show,
      choices: nOpts(k, 1, 999, 4, [Math.round(Tt / P.a), Tt - P.b, k + 1, k - 1].filter(v => v !== k)), answer: k, steps: [`The rule is ${rule(P.a, P.b)}.`, `${P.a} × n + ${P.b} = ${Tt}, so ${P.a} × n = ${Tt - P.b}.`, `n = ${Tt - P.b} ÷ ${P.a} = ${k}.`], explainText: `Pattern ${k}.` }); }
    const N = pick([50, 100, 25, 75]);
    return Q({ prompt: `How many ${P.unit} in pattern ${N}?`, speak: `${sp} Pattern 1 has ${f(1)} ${P.unit}, pattern 2 has ${f(2)}, pattern 3 has ${f(3)}. How many in pattern ${N}?`, visual: show, choices: nOpts(f(N), 1, 9999, 4, [P.a * N, f(1) * N, f(N) + P.a, f(N) - P.b, f(N) + 10]), answer: f(N), steps: why(N), explainText: `Pattern ${N} has ${f(N)} ${P.unit}.` });
  }
  const k = pick(['total', 'green', 'cans']);
  if (k === 'cans') {
    const N = rnd(6, 12), t = N * (N + 1) / 2;
    return Q({ prompt: `Cans are stacked like this. How many cans in a stack ${N} rows high?`, speak: `Cans are stacked in a triangle. A stack 1 row high has 1 can, 2 rows has 3 cans, 3 rows has 6 cans. How many cans are in a stack ${N} rows high?`, visual: pats(cansPic, [1, 2, 3], n => `${n} row${n > 1 ? 's' : ''}`),
      choices: nOpts(t, 1, 999, 4, [N * N, N * (N - 1) / 2, 2 * N, t + N]), answer: t, steps: [`The rows hold ${N}, ${N - 1}, ${N - 2} … down to 1 can.`, `Add them: 1 + 2 + … + ${N}. A quick way is n × (n + 1) ÷ 2.`, `${N} × ${N + 1} ÷ 2 = ${t}.`], explainText: `${t} cans.` });
  }
  const N = rnd(5, 12), green = N * N, tot = (N + 2) ** 2, border = 4 * N + 4, ans = k === 'total' ? tot : green;
  return Q({ prompt: k === 'total' ? `Pattern ${N}: how many tiles altogether, green and grey?` : `Pattern ${N}: how many green flower tiles?`, speak: `The pattern shows a square flower bed with grey tiles around it. Pattern 1 has 1 green tile, pattern 2 has 4, pattern 3 has 9. In pattern ${N}, how many ${k === 'total' ? 'tiles are there altogether, green and grey' : 'green tiles are there'}?`,
    visual: pats(bedPic, [1, 2, 3]), choices: nOpts(ans, 1, 999, 4, k === 'total' ? [green + 4 * N, green, border, (N + 1) ** 2] : [2 * N, 4 * N, (N + 1) ** 2, border]), answer: ans,
    steps: k === 'total' ? [`The whole square is (n + 2) tiles wide: ${N + 2} for pattern ${N}.`, `Tiles altogether = (n + 2)² = ${N + 2} × ${N + 2} = ${tot}.`, `Check: ${green} green + ${border} grey (4n + 4) = ${tot}.`] : [`Pattern n is an n × n square of green tiles.`, `${N} × ${N} = ${green}.`], explainText: `${ans} tiles.` });
});
})();

/* ---------- setup pictures for topics that were words only ----------
   Each wrapper only fills q.visual when the question has none; answers and choices are never touched.
   Pictures show the set-up and put '?' where the answer goes. */
(() => {
  const QC = '#F2604F', BL = '#9CC9F2', YE = '#FFD98A', PK = '#F7B9AE', GR = '#A8E0C2';
  const num = s => +String(s).replace(/−/g, '-').replace(/,/g, '');
  const plain = h => String(h).replace(/<span class="frac"><i>(.*?)<\/i><i>(.*?)<\/i><\/span>/g, '$1/$2').replace(/<sup>(.*?)<\/sup>/g, '^$1').replace(/<br\s*\/?>/g, ' | ').replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const tw = (s, k = 9) => [...String(s)].length * k;
  const W = (id, fn) => { const g = MATH[id].gen; MATH[id].gen = L => { const q = g(L); if (!q.visual || !String(q.visual).trim()) { try { const v = fn(plain(q.prompt), L, q); if (v) q.visual = v; } catch (e) { /* keep words only */ } } return q; }; };
  const pill = (x, y, s, o = {}) => { const w = Math.max(o.min || 34, tw(s, o.k || 9.5) + 16), h = o.h || 30, q = s === '?'; return `<rect x="${+(x - w / 2).toFixed(1)}" y="${y - h / 2}" width="${+w.toFixed(1)}" height="${h}" rx="9" fill="${q ? '#fff' : o.fill || '#D9EBFC'}" stroke="${INK}" stroke-width="2"${q ? ' stroke-dasharray="5 4"' : ''}/>${tx(x, y + 5.5, esc(s), { size: o.size || 16, fill: q ? QC : INK })}`; };
  // A row of boxes joined by arrows, each arrow labelled with what to do: [box, op, box, op, box ...]
  function flow(items, label = 'steps') {
    const ws = items.map((s, i) => i % 2 ? Math.max(46, tw(s, 8.5) + 14) : Math.max(40, tw(s, 9.5) + 18)); let x = 4, g = '';
    items.forEach((s, i) => { const w = ws[i];
      if (i % 2) g += `<line x1="${x + 3}" y1="44" x2="${x + w - 7}" y2="44" stroke="#2E8BE6" stroke-width="2.5"/><path d="M${x + w - 12} 38 L${x + w - 4} 44 L${x + w - 12} 50" fill="none" stroke="#2E8BE6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${tx(x + w / 2, 30, esc(s), { size: 14, fill: '#2E8BE6' })}`;
      else g += pill(x + w / 2, 44, s, { min: w }); x += w; });
    return svgBox(`0 0 ${Math.max(x + 4, 120).toFixed(0)} 66`, g, label, true);
  }
  // Square made of n × n little squares: sides and inside labels.
  function sqPic(n, side, inside) {
    const S = 132, c = S / n; let g = `<rect x="44" y="8" width="${S}" height="${S}" fill="#D9EBFC" stroke="${INK}" stroke-width="2.5"/>`;
    if (n <= 15) for (let i = 1; i < n; i++) g += `<line x1="${44 + i * c}" y1="8" x2="${44 + i * c}" y2="${8 + S}" stroke="#9FB3C8" stroke-width="1"/><line x1="44" y1="${8 + i * c}" x2="${44 + S}" y2="${8 + i * c}" stroke="#9FB3C8" stroke-width="1"/>`;
    g += pill(110, 74, inside, { size: 18 }) + tx(110, 162, side, { size: 17, fill: side === '?' ? QC : INK }) + tx(36, 80, side, { size: 17, anchor: 'end', fill: side === '?' ? QC : INK });
    return svgBox('0 0 200 170', g, `square ${side} by ${side}`, true);
  }
  // Rectangle with an area written inside and unknown sides.
  const areaRect = n => svgBox('0 0 240 130', `<rect x="40" y="10" width="170" height="90" rx="4" fill="#FFF1CC" stroke="${INK}" stroke-width="2.5"/>${tx(125, 52, 'area', { size: 13, fill: '#5A678C' })}${tx(125, 74, n, { size: 22 })}${tx(125, 122, '?', { size: 18, fill: QC })}${tx(30, 61, '?', { size: 18, fill: QC, anchor: 'end' })}`, `rectangle with area ${n}, sides unknown`, true);
  // Factor tree: n splits into two unknown factors.
  const tree = n => svgBox('0 0 200 120', `<line x1="100" y1="30" x2="54" y2="90" stroke="${INK}" stroke-width="2.5"/><line x1="100" y1="30" x2="146" y2="90" stroke="${INK}" stroke-width="2.5"/>${pill(100, 28, String(n), { size: 18, fill: YE })}${pill(54, 92, '?')}${pill(146, 92, '?')}${tx(100, 98, '×', { size: 18 })}`, `factor tree for ${n}`, true);
  // b × b × … × b, e of them.
  function chain(b, e) {
    const show = e <= 5 ? Array(e).fill(String(b)) : [b, b, b, '…', b].map(String); let x = 10, g = '';
    show.forEach((s, i) => { if (i) { g += tx(x + 8, 42, '×', { size: 18 }); x += 18; } if (s === '…') { g += tx(x + 12, 42, '…', { size: 20 }); x += 24; } else { g += `<circle cx="${x + 17}" cy="36" r="17" fill="${YE}" stroke="${INK}" stroke-width="2"/>${tx(x + 17, 42, s, { size: 16 })}`; x += 34; } });
    g += `<path d="M12 62 V70 H${x - 2} V62" fill="none" stroke="${INK}" stroke-width="2"/>${tx((x + 10) / 2, 90, `${e} of them`, { size: 14, fill: '#5A678C' })}${pill(x + 38, 36, '?', { min: 34 })}${tx(x + 12, 42, '=', { size: 18 })}`;
    return svgBox(`0 0 ${x + 62} 98`, g, `${b} multiplied ${e} times`, true);
  }
  // a^m × a^n or a^m ÷ a^n as tiles.
  function powTiles(m, n, op) {
    const tile = (x, y, c) => `<rect x="${x}" y="${y}" width="24" height="26" rx="5" fill="${c}" stroke="${INK}" stroke-width="1.6"/>${tx(x + 12, y + 18, 'a', { size: 15 })}`; let g = '';
    if (op === '×') { const w = Math.max(m, n) * 27 + 34; for (let i = 0; i < m; i++) g += tile(30 + i * 27, 6, BL); g += tx(14, 66, '×', { size: 20 }); for (let i = 0; i < n; i++) g += tile(30 + i * 27, 46, PK);
      g += tx(w + 10, 46, '= a', { size: 16, anchor: 'start' }) + tx(w + 42, 37, '?', { size: 16, fill: QC, anchor: 'start' });
      return svgBox(`0 0 ${w + 58} 78`, g, `a to the ${m} times a to the ${n}`, true); }
    const w = Math.max(m, n) * 27 + 10; for (let i = 0; i < m; i++) g += tile(8 + i * 27, 6, BL); g += `<line x1="4" y1="40" x2="${w}" y2="40" stroke="${INK}" stroke-width="2.5"/>`; for (let i = 0; i < n; i++) g += tile(8 + i * 27, 46, PK);
    g += tx(w + 10, 46, '= a', { size: 16, anchor: 'start' }) + tx(w + 42, 37, '?', { size: 16, fill: QC, anchor: 'start' });
    return svgBox(`0 0 ${w + 58} 78`, g, `a to the ${m} divided by a to the ${n}`, true);
  }
  // Two overlapping circles: what is in both?
  const venn = (a, b, what) => svgBox('0 0 280 140', `<circle cx="105" cy="74" r="58" fill="${BL}" fill-opacity=".55" stroke="${INK}" stroke-width="2"/><circle cx="175" cy="74" r="58" fill="${PK}" fill-opacity=".55" stroke="${INK}" stroke-width="2"/>${tx(78, 80, a, { size: 20 })}${tx(202, 80, b, { size: 20 })}${tx(140, 82, '?', { size: 22, fill: QC })}${tx(70, 12, `${what} of ${a}`, { size: 12, fill: '#5A678C' })}${tx(210, 12, `${what} of ${b}`, { size: 12, fill: '#5A678C' })}`, `${what} of ${a} and of ${b}: which are in both?`, true);
  // Rods of length a and b laid end to end: where do the two rows first line up?
  function rods(a, b) {
    const k = 210 / (3 * Math.max(a, b)); let g = '';
    [[a, BL, 14], [b, PK, 60]].forEach(([v, c, y]) => { for (let i = 0; i < 3; i++) g += `<rect x="${34 + i * v * k}" y="${y}" width="${v * k}" height="30" fill="${c}" stroke="${INK}" stroke-width="2"/>${tx(34 + (i + .5) * v * k, y + 20, v, { size: v * k > 22 ? 14 : 11 })}`; g += tx(34 + 3 * v * k + 6, y + 21, '…', { size: 16, anchor: 'start' }); g += tx(26, y + 21, v, { size: 14, anchor: 'end', fill: '#5A678C' }); });
    return svgBox('0 0 300 112', g + tx(280, 106, 'meet at ?', { size: 13, anchor: 'end', fill: QC }), `rods of ${a} and of ${b}`, true);
  }
  // Place-value strip with the digits of a number and an arrow showing how far they move.
  const PLN = p => p >= 0 ? ['1', '10', '100', '1k', '10k', '100k', '1M', '10M', '100M', '1B'][p] : '.' + '0'.repeat(-p - 1) + '1';
  function shiftPic(numStr, from, to, lab) {
    const s = String(numStr).replace(/,/g, ''), [ip, fp = ''] = s.split('.'), digs = []; [...ip].forEach((d, i) => digs.push([ip.length - 1 - i, d])); [...fp].forEach((d, i) => digs.push([-1 - i, d]));
    const ps = digs.map(d => d[0]).concat([0, from, to]), hi = Math.max(...ps), lo = Math.min(...ps), n = hi - lo + 1, cw = Math.min(28, 280 / n), VW = Math.max(300, 20 + n * cw), X = p => (VW - n * cw) / 2 + (hi - p) * cw; let g = '';
    for (let p = hi; p >= lo; p--) g += `<rect x="${X(p)}" y="22" width="${cw}" height="32" fill="${p === 0 ? '#FFF1CC' : '#fff'}" stroke="#9FB3C8" stroke-width="1.2"/>${tx(X(p) + cw / 2, 15, PLN(p), { size: cw < 24 ? 8.5 : 10, fill: '#5A678C' })}`;
    digs.forEach(([p, d]) => g += tx(X(p) + cw / 2, 45, d, { size: 17 }));
    g += `<circle cx="${X(0) + cw}" cy="54" r="3.2" fill="${INK}"/>`;
    const xa = X(from) + cw / 2, xb = X(to) + cw / 2, dir = xb < xa ? -1 : 1;
    g += `<path d="M${xa} 62 Q${(xa + xb) / 2} 84 ${xb} 62" fill="none" stroke="${QC}" stroke-width="2.5"/><path d="M${xb - 6 * dir} 64 L${xb} 62 L${xb - 1 * dir} 69" fill="none" stroke="${QC}" stroke-width="2.5" stroke-linecap="round"/>${tx((xa + xb) / 2, 96, lab, { size: 13, fill: QC })}`;
    return svgBox(`0 0 ${VW.toFixed(0)} 102`, g, 'place value columns', true);
  }
  // A balance: the two pans weigh the same.
  function scale(cx, left, right) {
    return `<path d="M${cx} 60 L${cx - 12} 96 H${cx + 12} Z" fill="#B9C3CF" stroke="${INK}" stroke-width="2"/><line x1="${cx - 54}" y1="58" x2="${cx + 54}" y2="58" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>` +
      [[cx - 46, left], [cx + 46, right]].map(([x, t]) => `<line x1="${x}" y1="58" x2="${x}" y2="44" stroke="${INK}" stroke-width="1.5"/><path d="M${x - 30} 44 H${x + 30} Q${x} 60 ${x - 30} 44 Z" fill="${YE}" stroke="${INK}" stroke-width="1.8"/>${tx(x, 34, esc(t), { size: [...t].length > 6 ? 15 : 19 })}`).join('');
  }
  const scales = (a, b) => svgBox('0 0 340 100', scale(84, ...a) + scale(256, ...b), 'two balances', true);
  // Bag of red and blue marbles.
  function bag(r, b) {
    let g = `<path d="M70 26 Q34 30 26 80 Q22 118 70 120 H150 Q198 118 194 80 Q186 30 150 26 Z" fill="#E9D9C0" stroke="${INK}" stroke-width="2.5"/><path d="M78 26 Q110 10 142 26" fill="none" stroke="${INK}" stroke-width="3"/>`;
    const all = [...Array(r).fill('#F2604F'), ...Array(b).fill('#2E8BE6')];
    all.forEach((c, i) => { const row = Math.floor(i / 5), col = i % 5; g += `<circle cx="${62 + col * 24}" cy="${row ? 96 : 70}" r="11" fill="${c}" stroke="${INK}" stroke-width="1.5"/>`; });
    return svgBox('0 0 220 128', g, `bag with ${r} red and ${b} blue balls`);
  }
  const PIPP = { 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[28, 28], [50, 50], [72, 72]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]], 6: [[28, 26], [72, 26], [28, 50], [72, 50], [28, 74], [72, 74]] };
  const face = (x, y, n, s = 44) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s / 6}" fill="#fff" stroke="${INK}" stroke-width="2"/>` + (n ? PIPP[n].map(([a, b]) => `<circle cx="${(x + a / 100 * s).toFixed(1)}" cy="${(y + b / 100 * s).toFixed(1)}" r="${(s / 11).toFixed(1)}" fill="${INK}"/>`).join('') : tx(x + s / 2, y + s / 2 + 7, '?', { size: 20, fill: QC }));
  const coinS = (x, y) => `<circle cx="${x + 22}" cy="${y + 22}" r="22" fill="#E8C24A" stroke="${INK}" stroke-width="2"/>${tx(x + 22, y + 28, 'H|T', { size: 14 })}`;
  // Number chips in the order given, and empty slots to put them in order; the middle slot is '?'.
  function slots(list, mid) {
    const n = list.length, cw = Math.min(40, 290 / n), x0 = (300 - n * cw) / 2; let g = '';
    list.forEach((v, i) => g += `<rect x="${x0 + i * cw + 2}" y="4" width="${cw - 4}" height="30" rx="7" fill="${YE}" stroke="${INK}" stroke-width="1.6"/>${tx(x0 + (i + .5) * cw, 25, v, { size: 15 })}`);
    if (mid) { for (let i = 0; i < n; i++) { const m = mid.includes(i); g += `<rect x="${x0 + i * cw + 2}" y="58" width="${cw - 4}" height="30" rx="7" fill="#fff" stroke="${m ? QC : '#9FB3C8'}" stroke-width="${m ? 2.5 : 1.6}" stroke-dasharray="${m ? '0' : '4 3'}"/>${m ? tx(x0 + (i + .5) * cw, 79, '?', { size: 16, fill: QC }) : ''}`; }
      g += tx(x0, 104, 'smallest', { size: 11, anchor: 'start', fill: '#5A678C' }) + tx(x0 + n * cw, 104, 'biggest', { size: 11, anchor: 'end', fill: '#5A678C' }) + `<path d="M150 38 V52 M144 46 L150 53 L156 46" fill="none" stroke="#2E8BE6" stroke-width="2.2" stroke-linecap="round"/>`; }
    return svgBox(`0 0 300 ${mid ? 110 : 40}`, g, mid ? 'numbers to put in order' : 'the numbers', true);
  }
  // Columns that grow each year; the last one is '?'.
  function growth(start, years, compound, rate) {
    const n = years + 1, cw = Math.min(46, 250 / n), gap = cw * .35, H = 60; let g = '', x = 30;
    for (let i = 0; i < n; i++) { let y = 120 - H; g += `<rect x="${x}" y="${y}" width="${cw}" height="${H}" fill="${BL}" stroke="${INK}" stroke-width="1.6"/>`;
      for (let j = 0; j < i; j++) { const h = compound ? 12 * Math.pow(1 + rate / 40, j) : 12; y -= h; g += `<rect x="${x}" y="${y.toFixed(1)}" width="${cw}" height="${h.toFixed(1)}" fill="${YE}" stroke="${INK}" stroke-width="1.4"/>`; }
      g += tx(x + cw / 2, 136, i ? `yr ${i}` : 'start', { size: 11, fill: '#5A678C' });
      if (i === 0) g += tx(x + cw / 2, 120 - H / 2 + 4, start, { size: cw < 40 ? 9 : 11 }); if (i === n - 1) g += tx(x + cw / 2, y - 8, '?', { size: 18, fill: QC });
      x += cw + gap; }
    g += tx(4, 12, `+${rate}%${compound ? ' of the new total' : ' each year'}`, { size: 12, anchor: 'start', fill: '#B7791F' });
    return svgBox('0 0 300 142', g, 'savings growing each year', true);
  }
  // Two number lines matched up: units on top, other units below.
  function dbl(top, bot, k, val, valOnTop) {
    const big = valOnTop ? val : val / k, max = Math.max(1, Math.ceil(big)), X = v => 20 + v / max * 260, step = max > 10 ? Math.ceil(max / 10) : 1; let g = `<line x1="14" y1="40" x2="286" y2="40" stroke="${INK}" stroke-width="2.5"/><line x1="14" y1="78" x2="286" y2="78" stroke="${INK}" stroke-width="2.5"/>`;
    for (let v = 0; v <= max; v += step) { g += `<line x1="${X(v)}" y1="34" x2="${X(v)}" y2="84" stroke="#9FB3C8" stroke-width="1.4"/>`; if (v === 0 || v === step) g += tx(X(v), 26, `${v} ${top}`, { size: 11, fill: '#5A678C' }) + tx(X(v), 100, `${fmt(v * k)} ${bot}`, { size: 11, fill: '#5A678C' }); }
    g += `<line x1="${X(big)}" y1="34" x2="${X(big)}" y2="84" stroke="${QC}" stroke-width="2.5"/>` + tx(X(big), 26, valOnTop ? `${fmt(val)} ${top}` : '?', { size: 15, fill: valOnTop ? INK : QC, anchor: X(big) > 240 ? 'end' : 'middle' }) + tx(X(big), 100, valOnTop ? '?' : `${fmt(val)} ${bot}`, { size: 15, fill: valOnTop ? QC : INK, anchor: X(big) > 240 ? 'end' : 'middle' });
    return svgBox('0 0 300 106', g, `double number line: ${top} and ${bot}`, true);
  }
  // Digits in circles added up.
  function digitAdd(ds, note) {
    let x = 8, g = ''; ds.forEach((d, i) => { if (i) { g += tx(x + 8, 40, '+', { size: 18 }); x += 18; } g += `<circle cx="${x + 18}" cy="34" r="18" fill="${d === '?' ? '#fff' : YE}" stroke="${d === '?' ? QC : INK}" stroke-width="2"${d === '?' ? ' stroke-dasharray="5 4"' : ''}/>${tx(x + 18, 40, d, { size: 17, fill: d === '?' ? QC : INK })}`; x += 36; });
    g += tx(x + 6, 40, '= ' + note, { size: 14, anchor: 'start' });
    return svgBox(`0 0 ${x + 12 + tw(note, 8) + 20} 64`, g, 'add the digits', true);
  }
  // Fraction of a fraction: columns for the first, rows for the second.
  function fracGrid(a, b, c, d) {
    const Wd = 180, Ht = 120, cw = Wd / b, rh = Ht / d; let g = '';
    for (let i = 0; i < b; i++) for (let j = 0; j < d; j++) g += `<rect x="${60 + i * cw}" y="${8 + j * rh}" width="${cw}" height="${rh}" fill="${i < a ? BL : '#fff'}" stroke="${INK}" stroke-width="1.2"/>`;
    for (let j = 0; j < c; j++) g += `<rect x="60" y="${8 + j * rh}" width="${Wd}" height="${rh}" fill="#F2604F" fill-opacity=".28" stroke="none"/>`;
    g += `<rect x="60" y="8" width="${Wd}" height="${Ht}" fill="none" stroke="${INK}" stroke-width="2.5"/>${tx(60 + a * cw / 2, 146, `${a}/${b}`, { size: 14, fill: '#2E8BE6' })}${tx(52, 8 + c * rh / 2 + 5, `${c}/${d}`, { size: 14, anchor: 'end', fill: QC })}`;
    return svgBox('0 0 260 154', g, `${a} over ${b} of ${c} over ${d}`, true);
  }
  // A prism or pyramid with a k-sided base.
  function solidK(k, prism) {
    const P = (i, y) => [130 + 90 * Math.cos(Math.PI * 2 * i / k + .3), y + 26 * Math.sin(Math.PI * 2 * i / k + .3)], base = Array.from({ length: k }, (_, i) => P(i, 120)); let g = '';
    const front = i => Math.sin(Math.PI * 2 * i / k + .3) > -0.2;
    if (prism) { const top = Array.from({ length: k }, (_, i) => P(i, 40)); base.forEach((p, i) => g += `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${top[i][0].toFixed(1)}" y2="${top[i][1].toFixed(1)}" stroke="${INK}" stroke-width="2"${front(i) ? '' : ' stroke-dasharray="4 4" stroke-opacity=".5"'}/>`); g = `<polygon points="${pts2(top)}" fill="${YE}" stroke="${INK}" stroke-width="2"/>` + g; }
    else base.forEach((p, i) => g += `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="130" y2="14" stroke="${INK}" stroke-width="2"${front(i) ? '' : ' stroke-dasharray="4 4" stroke-opacity=".5"'}/>`);
    g = `<polygon points="${pts2(base)}" fill="${BL}" fill-opacity=".6" stroke="${INK}" stroke-width="2"/>` + g;
    return svgBox('0 0 260 156', g, `${prism ? 'prism' : 'pyramid'} with a ${k}-sided ${prism ? 'end' : 'base'}`, true);
  }
  // A cube with its face, an edge and a vertex pointed out.
  const cubeParts = () => svgBox('0 0 280 150', `<polygon points="70,50 160,50 160,140 70,140" fill="${BL}" stroke="${INK}" stroke-width="2.5"/><polygon points="70,50 110,18 200,18 160,50" fill="${YE}" stroke="${INK}" stroke-width="2.5"/><polygon points="160,50 200,18 200,108 160,140" fill="#2E8BE6" stroke="${INK}" stroke-width="2.5"/>${tx(115, 100, 'face', { size: 15 })}<circle cx="200" cy="18" r="5" fill="${QC}"/>${tx(212, 22, 'vertex', { size: 14, anchor: 'start', fill: QC })}<line x1="200" y1="18" x2="200" y2="108" stroke="#2FA36B" stroke-width="5"/>${tx(208, 72, 'edge', { size: 14, anchor: 'start', fill: '#2FA36B' })}`, 'cube showing a face, an edge and a vertex', true);
  const tab = (head, rows) => `<table class="m3tab">${head ? `<tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>` : ''}${rows.map(r => `<tr>${r.map(v => v === '?' ? '<td style="background:#FFD98A;color:#F2604F">?</td>' : `<td>${v}</td>`).join('')}</tr>`).join('')}</table>`;
  const sgn = v => v < 0 ? '− ' + -v : '+ ' + v;
  const supH = e => `10<sup>${e}</sup>`;

  W('powers', (p, L) => {
    let m;
    if (L === 1 && (m = p.match(/^(\d+)² =/))) return sqPic(+m[1], m[1], '?');
    if (L === 2 && (m = p.match(/^(\d+)³ =/))) { const n = +m[1]; return n <= 4 ? isoSVG(cubesOf(n, n, n), { s: 16, label: `${n} by ${n} by ${n} cubes` }) : boxPic(n, n, n, [n, n, n]); }
    if (L === 3 && (m = p.match(/√(\d+)/))) { const n = Math.round(Math.sqrt(+m[1])); return sqPic(n, '?', m[1]); }
    if (L === 4 && (m = p.match(/^(\d+)\^(\d+) =/))) return chain(+m[1], +m[2]);
    if ((m = p.match(/a\^(\d+) (×|÷) a\^(\d+)/))) return powTiles(+m[1], +m[3], m[2]);
  });
  W('primes', (p, L) => {
    let m;
    if (L === 1 && (m = p.match(/Is (\d+) a prime/))) { const n = +m[1], ps = [2, 3, 5, 7].filter(k => k < n); return ps.length ? tab(null, [[`<b>${n} ÷</b>`, ...ps], ['<b>exact?</b>', ...ps.map(() => '?')]]) : tree(n); }
    if (L === 2 && (m = p.match(/factor of (\d+)/))) return areaRect(+m[1]);
    if (L === 3 && (m = p.match(/of (\d+) and (\d+)/))) return venn(+m[1], +m[2], 'factors');
    if (L === 4 && (m = p.match(/of (\d+) and (\d+)/))) return rods(+m[1], +m[2]);
    if ((m = p.match(/Prime factors of (\d+)/))) return tree(+m[1]);
  });
  W('stdform', (p, L) => {
    let m;
    if ((m = p.match(/^\((\d+) × 10\^(\d+)\) (×|÷) \((\d+) × 10\^(\d+)\)/))) return tab(null, [['<b>Numbers</b>', `${m[1]} ${m[3]} ${m[4]}`, '?'], ['<b>Powers of 10</b>', `${supH(m[2])} ${m[3]} ${supH(m[5])}`, '?']]);
    if ((m = p.match(/^([\d.]+) × 10\^(−?\d+) =/))) { const e = num(m[2]); return shiftPic(m[1], 0, e, `${Math.abs(e)} place${Math.abs(e) > 1 ? 's' : ''} ${e > 0 ? 'bigger' : 'smaller'}`); }
    if ((m = p.match(/Write ([\d,.]+) in standard form/))) { const s = m[1].replace(/,/g, ''), v = +s, e = Math.floor(Math.log10(v) + 1e-9); return shiftPic(s, e, 0, '? places'); }
  });
  W('simul', (p, L) => {
    let m;
    if ((m = p.match(/^(\d+) (\S+) and 1 (\S+) cost (\d+)\. (\d+) \S+ and 1 \S+ cost (\d+)/u))) return scales([m[2].repeat(+m[1]) + m[3], m[4]], [m[2].repeat(+m[5]) + m[3], m[6]]);
    const eqs = p.split(' | ').filter(s => s.includes('=')).map(s => s.split(' = '));
    if (eqs.length === 2) return scales(eqs[0], eqs[1]);
  });
  W('expand', (p, L) => {
    let m;
    if (L === 1 && (m = p.match(/^Simplify (.+)$/))) { const ts = m[1].match(/[+−]?\s*\d*[a-z]/g); if (!ts) return; const vars = [...new Set(ts.map(t => t.slice(-1)))]; let x = 6, g = '';
      ts.forEach(t => { const s = t.replace(/\s+/g, ''), w = tw(s, 10) + 18, c = s.slice(-1) === vars[0] ? BL : PK; g += `<rect x="${x}" y="8" width="${w}" height="36" rx="8" fill="${c}" stroke="${INK}" stroke-width="2"/>${tx(x + w / 2, 32, s, { size: 17 })}`; x += w + 8; });
      return svgBox(`0 0 ${x} 52`, g + '', 'terms sorted by colour', true); }
    if (L === 2 && (m = p.match(/Expand (\d+)\(x ([+−]) (\d+)\)/))) return areaModel(['x', (m[2] === '−' ? '−' : '+') + m[3]], [m[1]], [['?', '?']]);
    if (L === 3 && (m = p.match(/(\d+)\(x ([+−]) (\d+)\) ([+−]) (\d+)\(x ([+−]) (\d+)\)/))) return areaModel(['x', m[2] + m[3]], [m[1]], [['?', '?']]) + areaModel(['x', m[6] + m[7]], [(m[4] === '−' ? '−' : '') + m[5]], [['?', '?']]);
    if (L === 4 && (m = p.match(/\(x ([+−]) (\d+)\)\(x ([+−]) (\d+)\)/))) return areaModel(['x', m[1] + m[2]], ['x', m[3] + m[4]], [['?', '?'], ['?', '?']]);
    if ((m = p.match(/Factorise x² ([+−]) (\d*)x ([+−]) (\d+)/))) return areaModel(['x', '?'], ['x', '?'], [['x²', '?'], ['?', m[3] + m[4]]]);
    if ((m = p.match(/Factorise (\d+)x ([+−]) (\d+)$/))) return areaModel(['?', '?'], ['?'], [[m[1] + 'x', m[2] + m[3]]]);
  });
  W('probability', (p, L) => {
    let m;
    if ((m = p.match(/has (\d+) red and (\d+) blue/))) return bag(+m[1], +m[2]);
    if (/Roll a dice/.test(p)) return svgBox('0 0 300 52', [1, 2, 3, 4, 5, 6].map(n => face(4 + (n - 1) * 50, 4, n)).join(''), 'the six sides of a dice', true);
    if ((m = p.match(/rain is (\d+)\/(\d+)/))) { const a = +m[1], b = +m[2]; return barModel(Array.from({ length: b }, (_, i) => ({ w: 1, t: i === 0 ? 'rain' : i === b - 1 ? '?' : '', c: i < a ? BL : '#fff' })), 'rain + no rain = 1 whole'); }
    if (/chance of/.test(p)) { const coinFirst = !/two 6s/.test(p), second = /coins/.test(p) ? 'coin' : 'die'; const a = coinFirst ? coinS(40, 6) : face(40, 6, 0); const b = second === 'coin' ? coinS(190, 6) : face(190, 6, 0);
      return svgBox('0 0 280 80', a + b + tx(150, 34, 'and', { size: 15 }) + tx(62, 72, coinFirst ? '2 sides' : '6 sides', { size: 12, fill: '#5A678C' }) + tx(212, 72, second === 'coin' ? '2 sides' : '6 sides', { size: 12, fill: '#5A678C' }), 'two things at once', true); }
  });
  W('stats', (p, L) => {
    let m;
    if ((m = p.match(/Find the (mode|median): ([\d, ]+)/))) { const list = m[2].split(',').map(s => s.trim()).filter(Boolean), n = list.length; return m[1] === 'mode' ? slots(list) : slots(list, n % 2 ? [(n - 1) / 2] : [n / 2 - 1, n / 2]); }
    if ((m = p.match(/interquartile range: ([\d, ]+)/))) { const list = m[1].split(',').map(x => x.trim()).filter(Boolean), n = list.length; return slots(list, [(n + 1) / 4 - 1, 3 * (n + 1) / 4 - 1]); }
    if ((m = p.match(/mean of (\d+) numbers is (\d+)\. \d+ of them are ([\d, ]+)\./))) { const ks = m[3].split(',').map(s => s.trim()).filter(Boolean); return barModel([...ks.map(v => ({ w: 1, t: v })), { w: 1, t: '?', c: '#fff' }], `${m[1]} × ${m[2]} altogether`); }
  });
  W('lines', (p, L) => {
    let m;
    const parts = (mm, cc) => { const o = [...(mm !== 1 ? ['× ' + String(mm).replace('-', '−')] : []), ...(cc ? [sgn(cc)] : [])]; return o.length ? o : ['× 1']; };
    if ((m = p.match(/y = (−?\d*)x(?: ([+−]) (\d+))?\. When x = ([−-]?\d+)/))) { const mm = m[1] === '' ? 1 : m[1] === '−' ? -1 : num(m[1]), cc = m[2] ? num(m[2] + m[3]) : 0, ops = parts(mm, cc), items = [neg(m[4])]; ops.forEach((o, i) => items.push(o, i === ops.length - 1 ? '?' : ' ')); return flow(items, 'number machine'); }
    if ((m = p.match(/y = (−?\d*)x(?: ([+−]) (\d+))?\. For which x is y = ([−-]?\d+)/))) { const mm = m[1] === '' ? 1 : m[1] === '−' ? -1 : num(m[1]), cc = m[2] ? num(m[2] + m[3]) : 0, ops = parts(mm, cc), items = ['?']; ops.forEach((o, i) => items.push(o, i === ops.length - 1 ? neg(m[4]) : ' ')); return flow(items, 'number machine backwards'); }
  });
  W('inequal', (p, L) => {
    let m;
    if (L === 2) {
      const circ = (X, v, fill) => `<circle cx="${X(v)}" cy="34" r="7" fill="${fill ? '#2E8BE6' : '#fff'}" stroke="#2E8BE6" stroke-width="3"/>`;
      const line = (lo, hi, dots) => { const X = v => 20 + (v - lo) / (hi - lo) * 260; let g = `<line x1="6" y1="34" x2="294" y2="34" stroke="${INK}" stroke-width="2"/>`; for (let v = lo; v <= hi; v++) g += `<line x1="${X(v)}" y1="28" x2="${X(v)}" y2="40" stroke="${INK}" stroke-width="1.5"/>${tx(X(v), 58, neg(v), { size: 12 })}`; return svgBox('0 0 300 66', g + dots.map(([v, f]) => circ(X, v, f)).join('') + tx(150, 14, 'where does x go?', { size: 12, fill: QC }), 'number line', true); };
      if ((m = p.match(/fits (−?\d+) (<|≤) x (<|≤) (−?\d+)/))) { const lo = num(m[1]), hi = num(m[4]); return line(lo - 2, hi + 2, [[lo, m[2] === '≤'], [hi, m[3] === '≤']]); }
      if ((m = p.match(/fits x (<|>|≤|≥) (−?\d+)/))) { const v = num(m[2]); return line(v - 5, v + 5, [[v, m[1] === '≤' || m[1] === '≥']]); }
    }
    if ((m = p.match(/(Solve|with) (−?\d+)x ([+−]) (\d+) (<|>|≤|≥) (−?\d+)/))) { const a = m[2], b = num(m[3] + m[4]), op = m[5], undo = b > 0 ? `− ${b}` : `+ ${-b}`, last = L === 4 ? `x ${op} ?` : 'x ? ?';
      return flow([`${a}x ${op} ?`, `÷ ${num(a) < 0 ? '(' + a + ') ⚠' : a}`, last], `first ${undo} on both sides`).replace('</svg>', tx(4, 12, `first ${undo} on both sides`, { size: 12, anchor: 'start', fill: '#5A678C' }) + '</svg>'); }
  });
  W('interest', (p, L) => {
    let m;
    if ((m = p.match(/save \$([\d,]+) at (\d+)% simple interest a year\. How much .* after (\d+) years/))) return growth('$' + m[1], +m[3], false, +m[2]);
    if ((m = p.match(/^\$([\d,]+) earns (\d+)% compound interest each year\. How much is there after (\d+) years/))) return growth('$' + m[1], +m[3], true, +m[2]);
    if ((m = p.match(/price (rose|fell) from \$([\d,]+) to \$([\d,]+)/))) { const a = num(m[2]), b = num(m[3]), up = m[1] === 'rose';
      return compareModel(up ? [{ name: 'before', segs: [{ w: a, t: '$' + a, c: BL }] }, { name: 'after', segs: [{ w: a, t: '$' + a, c: BL }, { w: b - a, t: `+$${b - a}`, c: YE }] }] : [{ name: 'before', segs: [{ w: b, t: '$' + b, c: BL }, { w: a - b, t: `$${a - b}`, c: PK }] }, { name: 'after', segs: [{ w: b, t: '$' + b, c: BL }] }], `? %`); }
    if ((m = p.match(/(\d+)% off sale, a \w+ costs \$([\d,]+)/))) { const d = +m[1]; return barModel([{ w: 100 - d, t: `${100 - d}% = $${m[2]}`, c: GR }, { w: d, t: `${d}%`, c: PK }], 'the old price, 100% = ?'); }
    if ((m = p.match(/After a (\d+)% price rise, a \w+ costs \$([\d,]+)/))) { const d = +m[1]; return barModel([{ w: 100, t: '100% = ?', c: '#fff' }, { w: d, t: `${d}%`, c: YE }], `${100 + d}% = $${m[2]}`); }
  });
  W('order', (p, L) => {
    const n = (p.match(/\d+/g) || []).map(Number), [a, b, c, d] = n; let rows;
    if (L === 1) rows = [['1st', `${b} × ${c}`], ['2nd', `${a} + ?`]];
    else if (L === 2) rows = [['1st', `(${a} + ${b})`], ['2nd', `? × ${c}`]];
    else if (L === 3) rows = [['1st', `${a} × ${b}`], ['2nd', `? − ${c}`], ['3rd', `? + ${d}`]];
    else if (L === 4) rows = [['1st', `${a} ÷ ${b}`], ['2nd', `${c} × ${d}`], ['3rd', '? + ?']];
    else rows = [['1st', `(${c} − ${d})`], ['2nd', `${a}²`], ['3rd', `${b} × ?`], ['4th', '? + ?']];
    return tab(['Step', 'Work out', '='], rows.map(r => [`<b>${r[0]}</b>`, r[1], '?']));
  });
  const RULES = { 2: 'last digit is 0, 2, 4, 6 or 8', 3: 'the digits add up to a multiple of 3', 4: 'the last two digits make a multiple of 4', 5: 'last digit is 0 or 5', 6: 'it divides by 2 and by 3', 9: 'the digits add up to a multiple of 9', 10: 'last digit is 0' };
  W('divis', (p, L) => {
    let m;
    if ((m = p.match(/Does (\d+) divide exactly by (\d+)/))) { const k = +m[2]; return k === 3 || k === 9 ? digitAdd([...m[1]], `? Is it in the ${k} times table?`) : tab(null, [[`<b>÷ ${k}</b>`, RULES[k]]]); }
    if ((m = p.match(/divides exactly by (\d+)\?/))) return RULES[m[1]] ? tab(null, [[`<b>÷ ${m[1]} test</b>`, RULES[m[1]]]]) : '';
    if ((m = p.match(/(factor pair|factors does) (?:of )?(\d+)/))) return areaRect(+m[2]);
    if ((m = p.match(/^(\d)\s*\?\s*(\d) divides by (\d)/))) return digitAdd([m[1], '?', m[2]], `a multiple of ${m[3]}`);
  });
  W('mental', (p, L) => {
    let m;
    if ((m = p.match(/^Double (\d+)/))) { const n = +m[1], t = n - n % 10; return flow([String(n), `double ${t}`, '?', `+ double ${n % 10}`, '?'], 'double tens then ones'); }
    if ((m = p.match(/^(\d+) \+ (\d+) = \?/)) && +m[2] === +m[1] + 1) return flow([m[1], `+ ${m[1]}`, '?', '+ 1', '?'], 'near double');
    if ((m = p.match(/^(\d+) × 5 = \?/))) return flow([m[1], '× 10', '?', '÷ 2', '?'], 'times 10 then halve');
    if ((m = p.match(/^(\d+) × (\d+) = \?/))) { const b = +m[2]; return b % 10 === 0 ? flow([m[1], `× ${b / 10}`, '?', '× 10', '?'], 'times trick') : flow([m[1], `× ${b}`, '?'], 'times'); }
    if ((m = p.match(/^(\d+) ([+−]) (\d+) = \?/))) { const a = m[1], op = m[2], b = +m[3], r = b >= 90 ? Math.round(b / 100) * 100 : Math.round(b / 10) * 10, k = b - r;
      if (!k) return flow([a, `${op} ${b}`, '?'], 'jump');
      const fix = op === '+' ? (k > 0 ? `+ ${k}` : `− ${-k}`) : (k > 0 ? `− ${k}` : `+ ${-k}`); return flow([a, `${op} ${r}`, '?', fix, '?'], 'round then fix'); }
  });
  W('place1000', (p, L, q) => {
    let m;
    if (/^[\d +]+= \?$/.test(p)) { const v = p.match(/\d+/g).reduce((a, b) => a + +b, 0); if (v < 1000) return htoSVG(Math.floor(v / 100), Math.floor(v / 10) % 10, v % 10); }
    if (/hundred|tens|ones/.test(p) && / = \?$/.test(p)) { const g = w => +((p.match(new RegExp('(\\d+) ' + w)) || [0, 0])[1]); return htoSVG(g('hundred'), g('ten'), g('one')); }
    if ((m = p.match(/What is (\d+) (less|more) than ([\d,]+)/))) { const s = m[3].replace(/,/g, ''); return pvChart(+s, s.length - 1 - Math.round(Math.log10(+m[1]))); }
    if (/biggest|smallest/.test(p)) { const vs = q.choices.map(c => c.val), len = Math.max(...vs.map(v => v.length)); return tab(PV_NAMES.slice(0, len).reverse(), vs.map(v => [...v.padStart(len, ' ')].map(d => d === ' ' ? '' : d))); }
    if ((m = p.match(/How many tens make ([\d,]+)/))) { const s = m[1].replace(/,/g, ''); return pvChart(+s, s.length - 2); }
    if ((m = p.match(/^([\d,?]+) \+ ([\d,?]+) \+ ([\d,?]+) \+ ([\d,?]+) = ([\d,]+)/))) return tab(PV_NAMES.slice(0, 4).reverse(), [[m[1], m[2], m[3], m[4]]]);
  });
  const CONV = { 'L mL': 1000, 'm cm': 100, 'km m': 1000, 'kg g': 1000, 'cm mm': 10, 'm mm': 1000 };
  W('measure', (p, L, q) => {
    let m;
    if ((m = p.match(/^([\d.,]+) (\w+) = \? (\w+)/))) { const a = num(m[1]), u1 = m[2], u2 = m[3]; if (CONV[`${u1} ${u2}`]) return dbl(u1, u2, CONV[`${u1} ${u2}`], a, true); if (CONV[`${u2} ${u1}`]) return dbl(u2, u1, CONV[`${u2} ${u1}`], a, false); }
    if (/Which unit/.test(p)) { const g = [['📏', 'length', 'mm cm m km'], ['⚖️', 'weight', 'g kg'], ['🫗', 'liquid', 'mL L']].map(([e, w, u], i) => `<text x="${50 + i * 100}" y="44" font-size="34" text-anchor="middle">${e}</text>${tx(50 + i * 100, 70, w, { size: 13 })}${tx(50 + i * 100, 88, u, { size: 12, fill: '#5A678C' })}`).join('');
      return svgBox('0 0 300 96', g, 'length, weight or liquid?', true); }
  });
  W('roman', (p, L) => {
    const m = p.match(/Write (\d+) in Roman/); if (!m) return; const n = +m[1], parts = [Math.floor(n / 100) * 100, Math.floor(n % 100 / 10) * 10, n % 10].filter(Boolean);
    return tab(null, [['<b>I</b> = 1', '<b>V</b> = 5', '<b>X</b> = 10', '<b>L</b> = 50', '<b>C</b> = 100']]) + tab(null, [['<b>Number</b>', ...parts], ['<b>Roman</b>', ...parts.map(() => '?')]]);
  });
  W('solids', (p, L) => {
    let m;
    if ((m = p.match(/has a (\d+)-sided (end|base)/))) return solidK(+m[1], m[2] === 'end');
    if ((m = p.match(/has (\d+) faces and (\d+) vertices/))) return cubeParts() + tab(null, [['<b>Faces</b>', m[1]], ['<b>Vertices</b>', m[2]], ['<b>Edges</b>', '?']]);
    if (/Which shape has/.test(p)) return cubeParts();
  });
  W('elapsed', p => { let m = p.match(/How many days are in (\d+) weeks/); if (m) return barModel(Array.from({ length: +m[1] }, () => ({ w: 1, t: '7' })), `${m[1]} weeks = ? days`);
    if ((m = p.match(/How many minutes are in (\d+) hours?(?: and (\d+) minutes)?/))) return barModel([...Array.from({ length: +m[1] }, () => ({ w: 60, t: '60', c: BL })), ...(m[2] ? [{ w: +m[2], t: m[2], c: YE }] : [])], '? minutes');
    if ((m = p.match(/How many minutes are in (\d+) and a half hours/))) return barModel([...Array.from({ length: +m[1] }, () => ({ w: 60, t: '60', c: BL })), { w: 30, t: '½ h', c: YE }], '? minutes'); });
  W('fracops', (p, L) => { const m = p.match(/^(\d+)\/(\d+) × (\d+)\/(\d+) =/); if (m) return fracGrid(+m[1], +m[2], +m[3], +m[4]); });
  W('decimals', (p, L) => { const m = p.match(/^([\d.]+) (×|÷) (10|100|1000) =/); if (!m) return; const e = Math.log10(+m[3]) * (m[2] === '×' ? 1 : -1); return shiftPic(m[1], 0, e, `${m[2]} ${m[3]}: ${Math.abs(e)} place${Math.abs(e) > 1 ? 's' : ''} ${e > 0 ? 'bigger' : 'smaller'}`); });
  W('negatives', (p, L) => { if (/[×÷]/.test(p) && L >= 4) return tab(['× ÷', '+', '−'], [['<b>+</b>', '+', '−'], ['<b>−</b>', '−', '+']]); });
})();
