/* ---------- math2: 22 more picture topics for Seedling Hill (world 0) and Sprout Valley (world 1) ---------- */
// Included right after math.js. Everything lives inside this function so its helper names never clash with other files.
(() => {
const C = (val, html, say, txt) => ({ html: String(html), val: String(val), say: String(say), txt: !!txt });
const P = (svg, cls = '') => `<div class="m2p ${cls}">${svg}</div>`;
const ROW = (...a) => `<div class="m2row">${a.join('')}</div>`;
// Number buttons: the answer plus nearby wrong numbers inside lo..hi (extra = likely mistakes, tried first).
const nOpts = (ans, lo, hi, n = 3, extra = []) => opts(ans, [...extra, ...near(ans)].filter(v => Number.isInteger(v) && v >= lo && v <= hi && v !== ans), n);
const SPEAK_EQ = s => String(s).replace(/\+/g, ' plus ').replace(/−/g, ' minus ').replace(/=/g, ' equals ').replace(/\s+/g, ' ').trim();
const cap = s => s[0].toUpperCase() + s.slice(1);

/* ---------- pictures ---------- */
const PIPS = { 1: [[50, 50]], 2: [[27, 27], [73, 73]], 3: [[27, 27], [50, 50], [73, 73]], 4: [[27, 27], [73, 27], [27, 73], [73, 73]], 5: [[27, 27], [73, 27], [50, 50], [27, 73], [73, 73]], 6: [[27, 25], [73, 25], [27, 50], [73, 50], [27, 75], [73, 75]] };
const die = (n, fill = '#fff') => `<svg class="m2die" viewBox="0 0 100 100" role="img" aria-label="dice showing ${n}"><rect x="4" y="4" width="92" height="92" rx="18" fill="${fill}" stroke="#22305A" stroke-width="4"/>${PIPS[n].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9.5" fill="#22305A"/>`).join('')}</svg>`;
const dice = (...ns) => ROW(...ns.map((n, i) => die(n, ['#fff', '#FFF1CC', '#D9EBFC'][i % 3])));

function frame(cols, label) {
  let s = '';
  for (let i = 0; i < 10; i++) {
    const x = 6 + (i % 5) * 36, y = 6 + Math.floor(i / 5) * 36;
    s += `<rect x="${x}" y="${y}" width="36" height="36" fill="#fff" stroke="#22305A" stroke-width="2.5"/>`;
    if (cols[i]) s += `<circle cx="${x + 18}" cy="${y + 18}" r="13" fill="${cols[i]}" stroke="#22305A" stroke-width="1.5"/>`;
  }
  return `<svg class="m2frame" viewBox="0 0 192 84" role="img" aria-label="${label || `ten frame with ${cols.filter(Boolean).length} counters`}">${s}</svg>`;
}
const fr = (n, c = '#F2604F', m = 0, c2 = '#2E8BE6') => frame(Array.from({ length: 10 }, (_, i) => i < n ? c : i < n + m ? c2 : null));

const grp = (n, e, cls = '') => `<div class="m2grp ${cls}">${objs(n, e)}</div>`;
// Two rows lined up so each thing has a partner: the leftovers show the difference.
const lineUp = (a, ea, b, eb) => { const m = Math.max(a, b), row = (n, e) => `<div class="m2line" style="grid-template-columns:repeat(${m},1fr)">${Array.from({ length: m }, (_, i) => `<span>${i < n ? e : ''}</span>`).join('')}</div>`; return `<div class="m2pairs">${row(a, ea)}${row(b, eb)}</div>`; };
const track = (arr, hi = -1) => `<div class="m2track">${arr.map((v, i) => `<span class="${v === '?' ? 'q' : i === hi ? 'hi' : ''}">${v}</span>`).join('')}</div>`;

function mini(name, c) {
  const s = SHAPES[name], body = s.svg ? s.svg(c) : `<polygon points="${polyPts(s.sides).map(p => p.join(',')).join(' ')}" fill="${c}"/>`;
  return `<svg class="m2shape" viewBox="-6 -6 112 112" role="img" aria-label="${name}">${body.replace('/>', ' stroke="#22305A" stroke-width="4" stroke-linejoin="round"/>')}</svg>`;
}

/* ===================== World 0: Seedling Hill ===================== */

S('quicklook', 0, 'Quick look', '🎲', [
  ['Some numbers have a shape you know at once. Five on a dice looks like an X.', () => dice(5)],
  ['Try to see how many without counting one by one.', () => dice(3, 6)],
  ['In a ten frame, a full top row is 5.', () => P(fr(7), 'sm')]
], L => {
  const DIE_WORDS = ['', 'One dot on its own', 'Two dots, corner to corner', 'Three dots in a line', 'Four dots, one in each corner', 'Four corners and one in the middle', 'Two lines of three'];
  if (L <= 2) {
    const n = rnd(1, L === 1 ? 3 : 6);
    return Q({ prompt: 'How many dots? Take a quick look!', speak: 'Take a quick look at the dice. How many dots?', visual: dice(n), choices: nOpts(n, 1, 6, L === 1 ? 3 : 4), answer: n,
      explain: dice(n), explainText: `${DIE_WORDS[n]}. That is ${n}.` });
  }
  if (L === 3) {
    const n = rnd(3, 10);
    return Q({ prompt: 'How many dots in the ten frame?', speak: 'Take a quick look at the ten frame. How many dots?', visual: P(fr(n)), choices: nOpts(n, 1, 10, 4), answer: n,
      explain: P(fr(n)), explainText: n > 5 ? `The top row is full: that is 5. Then ${n - 5} more on the bottom makes ${n}.` : n === 5 ? 'The top row is full. A full row is 5.' : `There are ${n} dots on the top row, and ${5 - n} empty ${5 - n === 1 ? 'box' : 'boxes'}.` });
  }
  const a = rnd(1, L === 4 ? 4 : 6), b = rnd(1, L === 4 ? 4 : 6), t = a + b, big = Math.max(a, b), sm = Math.min(a, b);
  return Q({ prompt: 'How many dots on both dice?', speak: 'Look at both dice. How many dots altogether?', visual: dice(a, b), choices: nOpts(t, 2, 12, 4, [a, b, t + 1]), answer: t,
    explain: dice(a, b), explainText: `See ${big} on one dice straight away. Then count on ${sm}: ${Array.from({ length: sm }, (_, i) => big + i + 1).join(', ')}. That is ${t}.` });
});

const FRUITS2 = [['🍎', 'apples'], ['🍌', 'bananas'], ['🐟', 'fish'], ['🌸', 'flowers'], ['🚗', 'cars'], ['🐞', 'ladybugs'], ['🍓', 'strawberries'], ['🎈', 'balloons'], ['🐥', 'chicks'], ['⭐', 'stars'], ['🍪', 'cookies'], ['🐸', 'frogs']];
S('moreless', 0, 'More or fewer', '🧺', [
  ['More means the bigger group. Fewer means the smaller group.', () => ROW(grp(5, '🍓'), grp(2, '🍌'))],
  ['Line them up in pairs. The group with some left over has more.', () => lineUp(5, '🍓', 2, '🍌')],
  ['Big pictures can trick you! Always count.', () => ROW(grp(2, '🐘', 'm2big'), grp(4, '🐭', 'm2small'))]
], L => {
  const [x, y] = shuffle(FRUITS2).slice(0, 2);
  let a, b;
  if (L === 5) {
    a = rnd(3, 12); do b = rnd(2, 12); while (a === b);
    const [hn, he, hw, ln, le, lw] = a > b ? [a, x[0], x[1], b, y[0], y[1]] : [b, y[0], y[1], a, x[0], x[1]], d = hn - ln;
    return Q({ prompt: `How many more ${he} than ${le}?`, speak: `How many more ${hw} than ${lw}?`, visual: ROW(grp(a, x[0]), grp(b, y[0])), choices: nOpts(d, 1, 12, 4, [hn, ln, d + 1]), answer: d,
      explain: lineUp(hn, he, ln, le), explainText: `Pair them up. ${ln} of the ${hw} have a partner, and ${d} ${d === 1 ? 'is' : 'are'} left over. So there ${d === 1 ? 'is' : 'are'} ${d} more.` });
  }
  if (L === 1) { a = rnd(1, 3); b = rnd(6, 9); if (Math.random() < 0.5) [a, b] = [b, a]; }
  else if (L === 2) { a = rnd(1, 10); do b = rnd(1, 10); while (Math.abs(a - b) < 2); }
  else if (L === 3) { a = rnd(2, 10); do b = rnd(2, 10); while (a === b); }
  else { a = rnd(3, 9); b = Math.random() < 0.3 ? a : clamp(a + pick([-3, -2, -1, 1, 2, 3]), 2, 10); }
  const more = L === 1 || Math.random() < 0.5, w = more ? 'more' : 'fewer', trick = L === 4 && a !== b;
  const cls = n => trick ? (n === Math.min(a, b) ? 'm2big' : 'm2small') : '';
  const choices = [C(x[1], x[0], x[1]), C(y[1], y[0], y[1])];
  if (L === 4) choices.push(C('same', 'same', 'the same', true));
  const ans = a === b ? 'same' : (more === (a > b)) ? x[1] : y[1];
  const [hw, lw] = a > b ? [x[1], y[1]] : [y[1], x[1]];
  return Q({ prompt: `Which group has ${w}?`, speak: `Which group has ${w}, the ${x[1]} or the ${y[1]}?${L === 4 ? ' Or are they the same? Count carefully!' : ''}`,
    visual: ROW(grp(a, x[0], cls(a)), grp(b, y[0], cls(b))), choices: shuffle(choices), answer: ans,
    explain: lineUp(a, x[0], b, y[0]), explainText: a === b ? `There are ${a} of each. Every one has a partner, so they are the same.` : `There are ${a} ${x[1]} and ${b} ${y[1]}. The ${hw} have some left over, so there are more ${hw} and fewer ${lw}.${trick ? ' Big pictures do not mean more!' : ''}` });
});

S('onemore', 0, 'One more, one less', '🐥', [
  ['One more means add 1. It is the next number when you count.', () => `${objs(3, '🐥')}<span class="op">+</span>${objs(1, '🐥')}`],
  ['One less means take 1 away. It is the number just before.', () => objs(4, '🎈', { gone: 1 })],
  ['On a number track, one more is one step right. One less is one step left.', () => track([3, 4, 5], 1)]
], L => {
  const [e, nm] = pick(THINGS);
  if (L === 1) {
    const n = rnd(1, 5);
    return Q({ prompt: '1 more comes along. How many now?', speak: `There are ${n} ${nm}. One more comes along. How many now?`, visual: `${objs(n, e)}<span class="op">+</span>${objs(1, e)}`, choices: nOpts(n + 1, 1, 7, 3, [n]), answer: n + 1,
      explain: objs(n + 1, e, { num: true }), explainText: `${n} and 1 more is ${n + 1}. ${n + 1} comes right after ${n} when you count.` });
  }
  if (L === 2) {
    const n = rnd(2, 7);
    return Q({ prompt: '1 goes away. How many are left?', speak: `There are ${n} ${nm}. One goes away. How many are left?`, visual: objs(n, e, { gone: 1 }), choices: nOpts(n - 1, 0, 8, 3, [n]), answer: n - 1,
      explain: objs(n - 1, e, { num: true }), explainText: `${n} take away 1 leaves ${n - 1}. ${n - 1} comes just before ${n}.` });
  }
  const more = Math.random() < 0.5, n = L === 3 ? rnd(1, 9) : L === 4 ? rnd(1, 19) : pick([rnd(11, 98), rnd(1, 9) * 10, rnd(1, 9) * 10 + 9]), ans = more ? n + 1 : n - 1;
  const cross = Math.floor(ans / 10) !== Math.floor(n / 10);
  return Q({ prompt: `What is 1 ${more ? 'more' : 'less'} than ${n}?`, visual: L === 3 ? objs(n, e) : `<span class="bignum">${n}</span>`, choices: nOpts(ans, 0, 100, L === 3 ? 3 : 4, [n, more ? n - 1 : n + 1, more ? n + 10 : n - 10]), answer: ans,
    explain: track([n - 1, n, n + 1], more ? 2 : 0), explainText: `${more ? `1 more is the next number: ${n}, then ${n + 1}.` : `1 less is the number just before: ${n - 1}, then ${n}.`}${cross ? ' Watch out, the tens change here!' : ''}` });
});

const ORD = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'], ORDW = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];
const RACERS = [['🐱', 'cat'], ['🐶', 'dog'], ['🐸', 'frog'], ['🐰', 'rabbit'], ['🐻', 'bear'], ['🐷', 'pig'], ['🦊', 'fox'], ['🐵', 'monkey'], ['🐼', 'panda'], ['🐯', 'tiger'], ['🐮', 'cow'], ['🐔', 'chicken']];
const race = (rs, lab) => `<div class="m2race"><span class="m2flag">🏁</span>${rs.map((r, i) => `<span class="m2run">${r[0]}${lab ? `<small>${ORD[i]}</small>` : ''}</span>`).join('')}</div>`;
S('ordinal', 0, 'First, second, third', '🏁', [
  ['In a race, the one at the finish flag is 1st. We say first.', () => race(RACERS.slice(0, 3))],
  ['Count from the flag: 1st first, 2nd second, 3rd third, 4th fourth, 5th fifth.', () => race(RACERS.slice(0, 5), true)],
  ['The one at the very end, furthest from the flag, is last.', () => race(RACERS.slice(3, 7))]
], L => {
  const n = [3, 4, 5, 5, 6][L - 1], rs = shuffle(RACERS).slice(0, n), rc = r => C(r[1], r[0], r[1]);
  const three = t => shuffle([t, ...shuffle(rs.filter(r => r !== t)).slice(0, 2)]).map(rc);
  if (L === 4 || (L === 5 && Math.random() < 0.5)) {
    const i = rnd(0, n - 1), r = rs[i];
    return Q({ prompt: `What place is the ${r[0]} in?`, speak: `What place is the ${r[1]} in the race?`, visual: race(rs), choices: opts(ORD[i], ORD.slice(0, n), 4, v => v, v => ORDW[ORD.indexOf(v)]), answer: ORD[i],
      explain: race(rs, true), explainText: `Count from the flag: ${ORDW.slice(0, i + 1).join(', ')}. The ${r[1]} is ${ORDW[i]}.` });
  }
  if (L === 5) {
    const i = rnd(1, n - 2), behind = Math.random() < 0.5, j = behind ? i + 1 : i - 1, t = rs[j];
    return Q({ prompt: `Who is just ${behind ? 'behind' : 'in front of'} the ${ORD[i]}?`, speak: `Who is just ${behind ? 'behind' : 'in front of'} the animal in ${ORDW[i]} place?`, visual: race(rs), choices: three(t), answer: t[1],
      explain: race(rs, true), explainText: `${cap(ORDW[i])} is the ${rs[i][1]}. Just ${behind ? 'behind it, further from the flag,' : 'in front of it, nearer the flag,'} is the ${t[1]}. It is ${ORDW[j]}.` });
  }
  const last = L === 1 ? Math.random() < 0.5 : L === 3 && Math.random() < 0.25, i = last ? n - 1 : rnd(0, L === 1 ? 0 : L === 2 ? 2 : n - 1), t = rs[i];
  return Q({ prompt: `Who is ${last ? 'last' : ORD[i]}?`, speak: `Who is ${last ? 'last' : ORDW[i]} in the race?`, visual: race(rs), choices: three(t), answer: t[1],
    explain: race(rs, true), explainText: last ? `Last is the one at the very end, furthest from the flag: the ${t[1]}.` : `Start at the flag and count: ${ORDW.slice(0, i + 1).join(', ')}. The ${t[1]} is ${ORDW[i]}.` });
});

const KINDS = {
  fruit: [['🍎', 'apple'], ['🍌', 'banana'], ['🍇', 'grapes'], ['🍓', 'strawberry'], ['🍐', 'pear'], ['🍊', 'orange'], ['🍉', 'watermelon'], ['🍒', 'cherries']],
  animal: [['🐶', 'dog'], ['🐱', 'cat'], ['🐰', 'rabbit'], ['🐻', 'bear'], ['🐸', 'frog'], ['🐷', 'pig'], ['🦊', 'fox'], ['🐮', 'cow']],
  vehicle: [['🚗', 'car'], ['🚌', 'bus'], ['🚲', 'bike'], ['🚂', 'train'], ['✈️', 'plane'], ['🚀', 'rocket'], ['🚜', 'tractor'], ['🚒', 'fire engine']],
  clothes: [['👕', 'T-shirt'], ['👖', 'jeans'], ['🧦', 'socks'], ['🧢', 'cap'], ['👗', 'dress'], ['🧤', 'gloves'], ['👟', 'shoe'], ['🧣', 'scarf']]
};
const KNAME = { fruit: 'fruit', animal: 'animals', vehicle: 'things that go', clothes: 'clothes' };
S('oddone', 0, 'Odd one out', '🧩', [
  ['Look for what is the same: colour, shape or kind.', () => ROW(mini('circle', '#F2604F'), mini('square', '#F2604F'), mini('star', '#F2604F'))],
  ['One of these is not like the others. The blue one does not belong!', () => ROW(mini('circle', '#F2604F'), mini('circle', '#F2604F'), mini('circle', '#2E8BE6'), mini('circle', '#F2604F'))],
  ['Things can belong together by kind too: these are all fruit.', () => '<span class="m2emo">🍎 🍌 🍇</span>']
], L => {
  const SH = ['circle', 'square', 'triangle', 'star', 'hexagon', 'rectangle'];
  let items, why, prompt = 'Which one does not belong?', speak = 'Three are the same in some way. Which one does not belong?';
  const kind = L === 1 ? 'colour' : L === 2 ? 'shape' : L === 3 ? 'kind' : L === 4 ? pick(['colour', 'shape']) : 'number';
  if (kind === 'colour') {
    const [c1, c2] = shuffle(COLORS).slice(0, 2), shapes = L === 1 ? Array(4).fill(pick(SH)) : shuffle(SH).slice(0, 4);
    items = shapes.map((s, i) => { const c = i === 0 ? c2 : c1; return { html: mini(s, c[0]), say: `the ${c[1]} ${s}` }; });
    why = `The others are all ${c1[1]}. This one is ${c2[1]}.`;
  } else if (kind === 'shape') {
    const [s1, s2] = shuffle(SH).slice(0, 2), cols = L === 2 ? Array(4).fill(pick(COLORS)) : shuffle(COLORS).slice(0, 4);
    items = [s2, s1, s1, s1].map((s, i) => ({ html: mini(s, cols[i][0]), say: `the ${cols[i][1]} ${s}` }));
    why = `The others are all ${s1}s. This one is a ${s2}.`;
  } else if (kind === 'kind') {
    const [k1, k2] = shuffle(Object.keys(KINDS)).slice(0, 2), o = pick(KINDS[k2]);
    items = [o, ...shuffle(KINDS[k1]).slice(0, 3)].map(x => ({ html: `<span class="m2emo">${x[0]}</span>`, say: x[1] }));
    why = `The others are all ${KNAME[k1]}. The ${o[1]} is not.`;
  } else {
    const n = rnd(2, 5), m = n + pick([-1, 1]), e = pick(THINGS)[0], reps = shuffle(['die', 'num', 'objs', 'tally']);
    const show = (r, v) => r === 'die' ? die(v) : r === 'num' ? `<span class="m2num">${v}</span>` : r === 'objs' ? `<span class="mini">${objs(v, e)}</span>` : tallySVG(v);
    items = reps.map((r, i) => ({ html: show(r, i === 0 ? m : n), say: { die: 'the dice', num: 'the number', objs: 'the group of pictures', tally: 'the tally marks' }[r] }));
    why = `The others all show ${n}. This one shows ${m}.`; prompt = 'Three show the same number. Which one is different?'; speak = 'Three of these show the same number. Which one shows a different number?';
  }
  const ids = ['a', 'b', 'c', 'd'];
  return Q({ prompt, speak, choices: shuffle(items.map((it, i) => C(ids[i], it.html, it.say))), answer: 'a', explain: `<div class="m2odd">${items[0].html}</div>`, explainText: why });
});

/* 3D shapes, drawn simply so they read on a small screen. */
const SOLID = {
  sphere: c => `<circle cx="50" cy="52" r="40" fill="${c}" stroke="#22305A" stroke-width="3"/><path d="M10 52 A40 12 0 0 0 90 52" fill="none" stroke="#22305A" stroke-width="2" opacity=".55"/><ellipse cx="36" cy="36" rx="11" ry="7" fill="#fff" opacity=".55"/>`,
  cube: c => `<path d="M14 36 H62 V84 H14 Z" fill="${c}"/><path d="M14 36 L36 16 H84 L62 36 Z" fill="${c}"/><path d="M14 36 L36 16 H84 L62 36 Z" fill="#fff" opacity=".4"/><path d="M62 36 L84 16 V64 L62 84 Z" fill="${c}"/><path d="M62 36 L84 16 V64 L62 84 Z" fill="#000" opacity=".2"/><path d="M14 36 H62 V84 H14 Z M14 36 L36 16 H84 L62 36 M84 16 V64 L62 84" fill="none" stroke="#22305A" stroke-width="3" stroke-linejoin="round"/>`,
  cuboid: c => `<path d="M6 44 H68 V86 H6 Z" fill="${c}"/><path d="M6 44 L28 26 H92 L68 44 Z" fill="${c}"/><path d="M6 44 L28 26 H92 L68 44 Z" fill="#fff" opacity=".4"/><path d="M68 44 L92 26 V68 L68 86 Z" fill="${c}"/><path d="M68 44 L92 26 V68 L68 86 Z" fill="#000" opacity=".2"/><path d="M6 44 H68 V86 H6 Z M6 44 L28 26 H92 L68 44 M92 26 V68 L68 86" fill="none" stroke="#22305A" stroke-width="3" stroke-linejoin="round"/>`,
  cylinder: c => `<path d="M22 22 V80 A28 9 0 0 0 78 80 V22 Z" fill="${c}" stroke="#22305A" stroke-width="3"/><path d="M60 24 V80" stroke="#000" stroke-opacity=".12" stroke-width="16"/><ellipse cx="50" cy="22" rx="28" ry="9" fill="${c}" stroke="#22305A" stroke-width="3"/><ellipse cx="50" cy="22" rx="28" ry="9" fill="#fff" opacity=".4"/>`,
  cone: c => `<path d="M18 80 L50 10 L82 80 A32 10 0 0 1 18 80 Z" fill="${c}" stroke="#22305A" stroke-width="3" stroke-linejoin="round"/><path d="M50 12 L66 80 A32 10 0 0 0 82 80 Z" fill="#000" opacity=".15"/><path d="M18 80 A32 10 0 0 1 82 80" fill="none" stroke="#22305A" stroke-width="2" stroke-dasharray="4 4" opacity=".6"/>`,
  pyramid: c => `<path d="M12 78 L50 10 L62 90 Z" fill="${c}" stroke="#22305A" stroke-width="3" stroke-linejoin="round"/><path d="M62 90 L50 10 L90 70 Z" fill="${c}"/><path d="M62 90 L50 10 L90 70 Z" fill="#000" opacity=".2"/><path d="M62 90 L50 10 L90 70 Z" fill="none" stroke="#22305A" stroke-width="3" stroke-linejoin="round"/><path d="M12 78 L52 62 L90 70 M52 62 L50 10" fill="none" stroke="#22305A" stroke-width="1.5" stroke-dasharray="4 4" opacity=".55"/>`
};
const solid = (n, c) => `<svg class="m2solid" viewBox="0 0 100 100" role="img" aria-label="${n}">${SOLID[n](c)}</svg>`;
const SOL = { sphere: ['sphere', 'a ball', 0, true], cube: ['cube', 'a dice', 6, false], cuboid: ['cuboid', 'a box', 6, false], cylinder: ['cylinder', 'a tin can', 2, true], cone: ['cone', 'an ice cream cone', 1, true], pyramid: ['pyramid', 'a pointy tent', 5, false] };
const FACES = { sphere: 'A sphere is curved all over. It has no flat faces: 0.', cube: 'A cube has 6 flat faces: top, bottom, front, back and 2 sides.', cylinder: 'A cylinder has a flat circle on the top and one on the bottom: 2.', cone: 'Only the round bottom of a cone is flat: 1.', pyramid: 'This pyramid has a square bottom and 4 triangle sides: 5.' };
const REAL = [['⚽', 'football', 'sphere'], ['🏀', 'basketball', 'sphere'], ['🌍', 'globe', 'sphere'], ['🍊', 'orange', 'sphere'], ['🎲', 'dice', 'cube'], ['🧊', 'ice cube', 'cube'], ['🧱', 'brick', 'cuboid'], ['📦', 'parcel box', 'cuboid'], ['🥫', 'tin can', 'cylinder'], ['🔋', 'battery', 'cylinder'], ['🥁', 'drum', 'cylinder'], ['🍦', 'ice cream cone', 'cone']];
S('shapes3d', 0, '3D shapes', '📦', [
  ['Some shapes are flat, like a drawing. 3D shapes are solid. You can pick them up!', () => ROW(mini('square', '#2E8BE6'), solid('cube', '#2E8BE6'))],
  ['A sphere is like a ball. A cube is like a dice. A cylinder is like a tin can. A cone is like an ice cream cone.', () => ROW(solid('sphere', '#F2604F'), solid('cube', '#FFC23D'), solid('cylinder', '#2FA36B'), solid('cone', '#6D55D1'))],
  ['Round shapes can roll. Shapes with flat faces and corners can stack.', () => '<span class="m2emo">⚽ 🥫 🎲 📦</span>']
], L => {
  const cols = shuffle(COLORS), pc = (n, i) => C(n, solid(n, cols[i][0]), `the ${cols[i][1]} one`);
  const sibling = t => t === 'cube' ? 'cuboid' : t === 'cuboid' ? 'cube' : null;
  if (L === 1) {
    const pool = ['sphere', 'cube', 'cylinder', 'cone'], t = pick(pool), ch = [t, ...shuffle(pool.filter(x => x !== t)).slice(0, 2)];
    return Q({ prompt: `Find the ${SOL[t][0]}. It is shaped like ${SOL[t][1]}.`, choices: shuffle(ch.map(pc)), answer: t, explain: P(solid(t, '#FFC23D'), 'sm'), explainText: `This is a ${SOL[t][0]}. It looks like ${SOL[t][1]}.` });
  }
  if (L === 2) {
    const t = pick(Object.keys(SOL));
    return Q({ prompt: 'What is this 3D shape called?', visual: P(solid(t, pick(COLORS)[0]), 'sm'), choices: opts(t, Object.keys(SOL), 3, v => v), answer: t, explainText: `It is a ${t}. It looks like ${SOL[t][1]}.` });
  }
  if (L === 3) {
    const [e, nm, t] = pick(REAL), pool = Object.keys(SOL).filter(x => x !== t && x !== sibling(t) && x !== 'pyramid'), ch = [t, ...shuffle(pool).slice(0, 2)];
    return Q({ prompt: `What shape is a ${nm}?`, speak: `What 3D shape is a ${nm} like?`, visual: `<span class="m2emo big">${e}</span>`, choices: shuffle(ch.map(pc)), answer: t, explain: P(solid(t, '#FFC23D'), 'sm'), explainText: `A ${nm} is shaped like a ${t}.` });
  }
  if (L === 4) {
    const FLAT = { circle: ['sphere', 'cylinder'], square: ['cube', 'cuboid'], triangle: ['cone', 'pyramid'] }, flatAsk = Math.random() < 0.5;
    if (flatAsk) {
      const f = pick(Object.keys(FLAT)), sols = shuffle([...FLAT[f], ...shuffle(Object.keys(SOL).filter(x => !FLAT[f].includes(x))).slice(0, 1)]).slice(0, 2);
      const ch = [C(f, mini(f, cols[0][0]), `the ${cols[0][1]} one`), ...sols.map((s, i) => pc(s, i + 1))];
      return Q({ prompt: 'Which one is flat?', speak: 'Which one is flat, like a drawing on paper?', choices: shuffle(ch), answer: f, explain: P(mini(f, '#FFC23D'), 'sm'), explainText: `The ${f} is flat. The others are solid 3D shapes you could hold.` });
    }
    const s = pick(Object.keys(SOL)), flats = shuffle(Object.keys(FLAT)).slice(0, 2);
    const ch = [pc(s, 0), ...flats.map((f, i) => C(f, mini(f, cols[i + 1][0]), `the ${cols[i + 1][1]} one`))];
    return Q({ prompt: 'Which one is a solid 3D shape?', speak: 'Which one is solid, so you could pick it up?', choices: shuffle(ch), answer: s, explain: P(solid(s, '#FFC23D'), 'sm'), explainText: `The ${s} is solid. The others are flat shapes.` });
  }
  if (Math.random() < 0.5) {
    const t = pick(['sphere', 'cube', 'cylinder', 'cone', 'pyramid']), f = SOL[t][2];
    return Q({ prompt: `How many flat faces does a ${t} have?`, visual: P(solid(t, pick(COLORS)[0]), 'sm'), choices: nOpts(f, 0, 8, 4, [f + 1, f + 2]), answer: f, explainText: FACES[t] });
  }
  const roll = Math.random() < 0.5, yes = ['sphere', 'cylinder', 'cone'], no = ['cube', 'cuboid', 'pyramid'];
  const t = pick(roll ? yes : no), rest = shuffle(roll ? no : yes).slice(0, 2), ch = [t, ...rest].map(pc);
  return Q({ prompt: `Which one can${roll ? '' : 'not'} roll?`, speak: `Which one can${roll ? '' : ' not'} roll?`, choices: shuffle(ch), answer: t, explain: P(solid(t, '#FFC23D'), 'sm'),
    explainText: roll ? `The ${t} has a curved side, so it can roll.` : `The ${t} has only flat faces and corners, so it cannot roll. The others have curved sides.` });
});

const NW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const TENSW = { 13: 'thirty', 14: 'forty', 15: 'fifty', 16: 'sixty', 17: 'seventy', 18: 'eighty', 19: 'ninety' };
const spell = w => w.toUpperCase().split('').join(' ');
S('numwords', 0, 'Number words', '🔤', [
  ['Numbers can be written as words too. 3 is written three.', () => `<span class="bignum">3</span><span class="m2word">three</span>`],
  ['Look at the first letter for a clue: t for two, three and ten. f for four and five. s for six and seven.', () => '<span class="m2word">two · three · ten</span>'],
  ['Teen numbers end in teen: thirteen is 13, fifteen is 15.', () => '<span class="m2word">fifteen = 15</span>']
], L => {
  const hi = [3, 6, 10, 10, 20][L - 1], n = rnd(L === 5 ? 11 : 1, hi), e = pick(THINGS)[0];
  const nums = [...near(n), ...(L >= 4 ? [n > 10 ? n - 10 : n + 10] : [])].filter(v => v >= 1 && v <= (L >= 4 ? 20 : Math.max(hi + 2, 5)) && v !== n);
  if (L === 4 || (L === 5 && Math.random() < 0.5)) {
    return Q({ prompt: 'Which number is this word?', speak: 'Read the word. Which number is it?', visual: `<span class="m2word big">${NW[n]}</span>`, choices: opts(n, TENSW[n] ? [(n - 10) * 10, ...nums] : nums, 4), answer: n,
      explain: `<span class="bignum">${n}</span>${n <= 10 ? objs(n, e) : ''}`, explainText: `The word ${NW[n]} means ${n}.${n > 12 ? ` It ends in teen, so it is a teen number between 10 and 20.` : ''}` });
  }
  const words = nums.map(v => NW[v]).concat(TENSW[n] ? [TENSW[n]] : []);
  return Q({ prompt: `Which word says ${n}?`, visual: `<span class="bignum">${n}</span>${L <= 2 ? objs(n, e) : ''}`, choices: opts(NW[n], words, 3, v => v, spell).map(c => ({ ...c, txt: true })), answer: NW[n],
    explain: `<span class="m2word">${NW[n]}</span>`, explainText: `${n} is written ${NW[n]}. You spell it ${NW[n].split('').join(', ')}.` });
});

/* Mirror patterns on a little grid, with a dashed fold line. */
const PAL = ['#F2604F', '#2E8BE6', '#FFC23D', '#2FA36B', '#6D55D1'];
function symGrid(g, { line = true, marks = [], blankRight = false } = {}) {
  const rows = g.length, cols = g[0].length, z = 22, W = cols * z + 4, H = rows * z + 4; let s = '';
  g.forEach((r, y) => r.forEach((c, x) => {
    const blank = blankRight && x >= cols / 2;
    s += `<rect x="${x * z + 2}" y="${y * z + 2}" width="${z}" height="${z}" fill="${blank ? '#EEF3F7' : c || '#fff'}" stroke="#9FB3C8" stroke-width="1"/>`;
  }));
  if (blankRight) s += `<text x="${W * 0.75}" y="${H / 2 + 9}" font-size="26" font-weight="800" text-anchor="middle" fill="#5A678C">?</text>`;
  marks.forEach(([y, x]) => { s += `<rect x="${x * z + 3.5}" y="${y * z + 3.5}" width="${z - 3}" height="${z - 3}" fill="none" stroke="#22305A" stroke-width="3.5"/>`; });
  if (line) s += `<line x1="${W / 2}" y1="0" x2="${W / 2}" y2="${H}" stroke="#22305A" stroke-width="3" stroke-dasharray="6 4"/>`;
  return `<svg class="m2sym" viewBox="0 0 ${W} ${H}" role="img" aria-label="colour pattern">${s}</svg>`;
}
function mkHalf(rows, hc, k) { for (;;) { const h = Array.from({ length: rows }, () => Array.from({ length: hc }, () => Math.random() < 0.55 ? PAL[rnd(0, k - 1)] : null)); if (h.flat().filter(Boolean).length >= 2) return h; } }
const mirror = h => h.map(r => [...r, ...[...r].reverse()]);
const isSym = g => g.every(r => r.every((c, i) => c === r[r.length - 1 - i]));
const misses = g => { const out = []; g.forEach((r, y) => r.forEach((c, x) => { if (x >= r.length / 2 && c !== r[r.length - 1 - x]) out.push([y, x]); })); return out; };
function breakIt(g, k) {
  for (;;) {
    const h = g.map(r => r.slice()), cols = h[0].length;
    for (let i = 0; i < k; i++) { const y = rnd(0, h.length - 1), x = rnd(cols / 2, cols - 1); h[y][x] = pick([null, ...PAL.slice(0, 3)].filter(c => c !== h[y][x])); }
    if (!isSym(h)) return h;
  }
}
const YESNO = () => [C('yes', '👍 yes', 'yes', true), C('no', '👎 no', 'no', true)];
S('mirror', 0, 'Mirror halves', '🦋', [
  ['Something is symmetrical when both sides match, like a butterfly.', () => '<span class="m2emo big">🦋</span>'],
  ['Fold it on the dashed line. If the two halves match like a mirror, it is the same on both sides.', () => P(symGrid(mirror([['#F2604F', null], [null, '#2E8BE6'], ['#FFC23D', '#FFC23D']])), 'sm')],
  ['Check each square on the left with the square the same distance away on the right.', () => '']
], L => {
  if (L === 3) {
    const half = mkHalf(3, 2, 3), good = mirror(half), cols = shuffle(COLORS);
    const ch = [good, breakIt(good, 1), breakIt(good, 2)].map((g, i) => C(i ? 'x' + i : 'ok', symGrid(g), `the ${cols[i][1]} one`));
    // colour the button edge so the spoken colour names point somewhere
    ch.forEach((c, i) => { c.html = `<span class="m2tag" style="--c:${cols[i][0]}">${c.html}</span>`; });
    return Q({ prompt: 'Which one is the same on both sides?', speak: 'Which pattern is the same on both sides of the dashed line?', choices: shuffle(ch), answer: 'ok', explain: P(symGrid(good), 'sm'), explainText: 'In this one every square on the left has a matching square on the right, like a mirror.' });
  }
  if (L === 4) {
    let half; do half = mkHalf(3, 2, 3); while (half.every(r => r[0] === r[1]));
    const right = half.map(r => [...r].reverse()), copy = half.map(r => r.slice()), full = mirror(half);
    const wrong2 = breakIt(full, 1).map(r => r.slice(2));
    const halfSVG = h => symGrid(h, { line: false });
    const cands = [['ok', right], ['copy', copy], ['odd', wrong2]].filter(([k, h], i, a) => i === 0 || JSON.stringify(h) !== JSON.stringify(right));
    const cols = shuffle(COLORS);
    const ch = cands.map(([k, h], i) => C(k, `<span class="m2tag" style="--c:${cols[i][0]}">${halfSVG(h)}</span>`, `the ${cols[i][1]} one`));
    return Q({ prompt: 'Which half finishes the mirror picture?', speak: 'Which half makes the picture the same on both sides?', visual: P(symGrid(full, { blankRight: true }), 'sm'), choices: shuffle(ch), answer: 'ok',
      explain: P(symGrid(full), 'sm'), explainText: 'A mirror flips the picture. The square next to the line on the left matches the square next to the line on the right.' });
  }
  const [rows, hc, k, br] = [[3, 2, 2, 2], [4, 2, 3, pick([1, 2])], null, null, [5, 3, 4, 1]][L - 1];
  const good = mirror(mkHalf(rows, hc, k)), same = Math.random() < 0.5, g = same ? good : breakIt(good, br), m = misses(g);
  return Q({ prompt: 'Is it the same on both sides of the line?', speak: 'Look at the dashed line. Is the pattern the same on both sides, like a mirror?', visual: P(symGrid(g), L === 5 ? '' : 'sm'), choices: YESNO(), answer: same ? 'yes' : 'no',
    explain: P(symGrid(g, { marks: m }), 'sm'), explainText: same ? 'Yes! Every square on one side has a matching square on the other side.' : `No. ${m.length === 1 ? 'The square with the dark box does' : `The ${m.length} squares with dark boxes do`} not match the other side.` });
});

/* Balance scales: the heavier side goes down. */
function scaleSVG(left, right, t) {
  const ly = 44 - 16 * t, ry = 44 + 16 * t;
  const pan = (x, y, c) => `<line x1="${x}" y1="${y}" x2="${x - 30}" y2="${y + 34}" stroke="#5A678C" stroke-width="2"/><line x1="${x}" y1="${y}" x2="${x + 30}" y2="${y + 34}" stroke="#5A678C" stroke-width="2"/>${c(x, y + 33)}<path d="M${x - 37} ${y + 34} Q${x} ${y + 56} ${x + 37} ${y + 34} Z" fill="#FFC23D" stroke="#22305A" stroke-width="2.5"/>`;
  return `<svg class="m2scale" viewBox="0 0 240 150" role="img" aria-label="balance scale"><path d="M120 44 L100 140 L140 140 Z" fill="#B07A4A" stroke="#22305A" stroke-width="2.5" stroke-linejoin="round"/><rect x="80" y="136" width="80" height="10" rx="4" fill="#5A678C"/><line x1="40" y1="${ly}" x2="200" y2="${ry}" stroke="#22305A" stroke-width="6" stroke-linecap="round"/><circle cx="120" cy="44" r="6" fill="#F2604F" stroke="#22305A" stroke-width="2"/>${pan(40, ly, left)}${pan(200, ry, right)}</svg>`;
}
const emo = (s, n = 1) => (x, b) => `<text x="${x}" y="${b}" font-size="${n === 1 ? 32 : n === 2 ? 25 : 19}" text-anchor="middle">${s.repeat(n)}</text>`;
const cubes = k => (x, b) => { let s = ''; for (let i = 0; i < k; i++) { const r = Math.floor(i / 4), c = i % 4, inRow = Math.min(4, k - r * 4); s += `<rect x="${x - inRow * 7 + c * 14}" y="${b - 13 - r * 14}" width="13" height="13" rx="2" fill="#2E8BE6" stroke="#22305A" stroke-width="1.5"/>`; } return s; };
const HEAVY = [[['🐘', 'elephant'], ['🐭', 'mouse']], [['🚗', 'car'], ['🚲', 'bike']], [['🍉', 'watermelon'], ['🍒', 'cherry']], [['🐻', 'bear'], ['🐦', 'bird']], [['🏠', 'house'], ['🧸', 'teddy bear']], [['🎃', 'pumpkin'], ['🍃', 'leaf']], [['🐄', 'cow'], ['🐈', 'cat']], [['📚', 'pile of books'], ['🎈', 'balloon']]];
const TOYS = [['🧸', 'teddy'], ['⚽', 'ball'], ['🎁', 'present'], ['🍍', 'pineapple'], ['🥥', 'coconut'], ['🚂', 'toy train'], ['🍎', 'apple'], ['🍌', 'banana'], ['🥕', 'carrot'], ['🍞', 'bread']];
S('weigh', 0, 'Heavy and light', '⚖️', [
  ['Heavy things are hard to lift. Light things are easy to lift.', () => '<span class="m2emo">🐘 🍃</span>'],
  ['On a balance scale, the heavier side goes down. The lighter side goes up.', () => P(scaleSVG(emo('🍉'), emo('🍒'), -1), 'sm')],
  ['If the scale is level, both sides weigh the same.', () => P(scaleSVG(emo('🍎'), cubes(3), 0), 'sm')]
], L => {
  const tc = t => C(t[1], t[0], t[1]);
  if (L === 1) {
    const [big, small] = pick(HEAVY), heavy = Math.random() < 0.7, t = heavy ? big : small;
    return Q({ prompt: `Which is ${heavy ? 'heavier' : 'lighter'}?`, speak: `Which is ${heavy ? 'heavier' : 'lighter'}, the ${big[1]} or the ${small[1]}?`, choices: shuffle([big, small]).map(tc), answer: t[1], explainText: `A ${big[1]} is much heavier than a ${small[1]}. So the ${t[1]} is ${heavy ? 'heavier' : 'lighter'}.` });
  }
  if (L <= 3) {
    const [a, b] = shuffle(TOYS).slice(0, 2), level = L === 3 && Math.random() < 0.3, t = level ? 0 : pick([-1, 1]), heavy = Math.random() < 0.6;
    const down = t === -1 ? a : b, up = t === -1 ? b : a, ans = level ? 'same' : heavy ? down[1] : up[1];
    const ch = [tc(a), tc(b)]; if (L === 3) ch.push(C('same', 'same', 'the same', true));
    return Q({ prompt: `Which is ${heavy ? 'heavier' : 'lighter'}?`, speak: `Look at the scale. Which is ${heavy ? 'heavier' : 'lighter'}, the ${a[1]} or the ${b[1]}?${L === 3 ? ' Or do they weigh the same?' : ''}`, visual: P(scaleSVG(emo(a[0]), emo(b[0]), t)), choices: ch, answer: ans,
      explainText: level ? 'The scale is level, so they weigh the same.' : `The ${down[1]} side went down, so the ${down[1]} is heavier and the ${up[1]} is lighter.` });
  }
  if (L === 4) {
    const [a, b, c] = shuffle(TOYS).slice(0, 3), heavy = Math.random() < 0.5, s1 = Math.random() < 0.5, s2 = Math.random() < 0.5;
    const sc = (h, l, flip) => flip ? scaleSVG(emo(l[0]), emo(h[0]), 1) : scaleSVG(emo(h[0]), emo(l[0]), -1);
    const t = heavy ? a : c;
    return Q({ prompt: `Which is the ${heavy ? 'heaviest' : 'lightest'}?`, speak: `Look at both scales. Which is the ${heavy ? 'heaviest' : 'lightest'}: the ${a[1]}, the ${b[1]} or the ${c[1]}?`, visual: ROW(P(sc(a, b, s1), 'sm'), P(sc(b, c, s2), 'sm')), choices: shuffle([a, b, c]).map(tc), answer: t[1],
      explainText: `The ${a[1]} is heavier than the ${b[1]}, and the ${b[1]} is heavier than the ${c[1]}. So the ${a[1]} is heaviest and the ${c[1]} is lightest.` });
  }
  const [e, nm] = pick([['🍎', 'apple'], ['🍐', 'pear'], ['🍊', 'orange'], ['🥕', 'carrot'], ['🍋', 'lemon']]), k = rnd(1, 3);
  if (Math.random() < 0.5) {
    const n = rnd(2, 3), kk = Math.min(k, Math.floor(9 / n));
    return Q({ prompt: `How many cubes weigh the same as one ${e}?`, speak: `The scale is level. ${n} ${nm}s weigh the same as ${n * kk} cubes. How many cubes weigh the same as one ${nm}?`, visual: P(scaleSVG(emo(e, n), cubes(n * kk), 0)), choices: nOpts(kk, 1, 9, 4, [n * kk, n]), answer: kk,
      steps: [`${n} ${nm}s balance ${n * kk} cubes.`, `Share the ${n * kk} cubes into ${n} equal groups: ${kk} in each.`], explainText: `One ${nm} weighs the same as ${kk} cube${kk > 1 ? 's' : ''}.` });
  }
  const kk = rnd(2, 4), m = rnd(2, 3);
  return Q({ prompt: `How many cubes for ${m} ${e}?`, speak: `One ${nm} weighs the same as ${kk} cubes. How many cubes weigh the same as ${m} ${nm}s?`, visual: P(scaleSVG(emo(e), cubes(kk), 0)), choices: nOpts(kk * m, 1, 14, 4, [kk + m, kk, kk * m + 1]), answer: kk * m,
    explainText: `Each ${nm} needs ${kk} cubes. ${Array(m).fill(kk).join(' + ')} = ${kk * m} cubes.` });
});

/* Glasses with water in them. */
function glass(f, col = '#22305A', marks = 0) {
  const y = 112 - f * 94, t = (112 - y) / 100, xl = 26 - 12 * t, xr = 74 + 12 * t;
  const water = f > 0 ? `<path d="M26 112 L74 112 L${xr.toFixed(1)} ${y.toFixed(1)} L${xl.toFixed(1)} ${y.toFixed(1)} Z" fill="#8EC5F5"/><line x1="${xl.toFixed(1)}" y1="${y.toFixed(1)}" x2="${xr.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#2E8BE6" stroke-width="3"/>` : '';
  let tk = ''; for (let i = 1; i < marks; i++) { const yy = 112 - (i / marks) * 94, xx = 74 + 12 * ((112 - yy) / 100); tk += `<line x1="${(xx - 12).toFixed(1)}" y1="${yy.toFixed(1)}" x2="${(xx - 1).toFixed(1)}" y2="${yy.toFixed(1)}" stroke="#22305A" stroke-width="2.5"/>`; }
  return `<svg class="m2glass" viewBox="0 0 100 120" role="img" aria-label="glass of water"><path d="M14 10 L26 112 L74 112 L86 10 Z" fill="#fff"/>${water}${tk}<path d="M14 10 L26 112 L74 112 L86 10" fill="none" stroke="${col}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}
const CONTAIN = [['🥄', 'spoon'], ['☕', 'cup'], ['🫖', 'teapot'], ['🪣', 'bucket'], ['🛁', 'bathtub'], ['🏊', 'swimming pool']];
S('capacity', 0, 'Full and empty', '🥛', [
  ['Full means it cannot hold any more. Empty means nothing is inside.', () => ROW(P(glass(1), 'xs'), P(glass(0), 'xs'))],
  ['Half full is in the middle.', () => P(glass(0.5), 'xs')],
  ['When the glasses are the same, the higher the water, the more there is.', () => ROW(P(glass(0.3), 'xs'), P(glass(0.8), 'xs'))]
], L => {
  const cols = shuffle(COLORS), gc = (val, f, i) => C(val, glass(f, cols[i][0]), `the ${cols[i][1]} glass`);
  if (L <= 2) {
    const ask = L === 1 ? 'full' : pick(['empty', 'half full', 'full']), lv = { full: 1, 'half full': 0.5, empty: 0 };
    const ch = shuffle(Object.keys(lv)).map((k, i) => gc(k, lv[k], i));
    return Q({ prompt: `Which glass is ${ask}?`, choices: ch, answer: ask, explain: P(glass(lv[ask]), 'xs'),
      explainText: { full: 'The full glass has water right up to the top.', 'half full': 'The half full glass has water up to the middle.', empty: 'The empty glass has no water at all.' }[ask] });
  }
  if (L === 3) {
    const n = pick([3, 4]), lv = shuffle([0.15, 0.35, 0.55, 0.75, 0.95]).slice(0, n), most = Math.random() < 0.5, t = most ? Math.max(...lv) : Math.min(...lv);
    return Q({ prompt: `Which glass has the ${most ? 'most' : 'least'} water?`, choices: lv.map((f, i) => gc('g' + Math.round(f * 100), f, i)), answer: 'g' + Math.round(t * 100),
      explain: P(glass(t), 'xs'), explainText: `The glasses are all the same size, so look for the ${most ? 'highest' : 'lowest'} water.` });
  }
  if (L === 4) {
    const idx = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 3), most = Math.random() < 0.5, t = most ? Math.max(...idx) : Math.min(...idx);
    return Q({ prompt: `Which can hold the ${most ? 'most' : 'least'} water?`, speak: `Which can hold the ${most ? 'most' : 'least'} water: ${idx.map(i => 'a ' + CONTAIN[i][1]).join(', ')}?`, choices: idx.map(i => C(CONTAIN[i][1], CONTAIN[i][0], 'a ' + CONTAIN[i][1])), answer: CONTAIN[t][1],
      explainText: `From least to most: ${idx.slice().sort((a, b) => a - b).map(i => CONTAIN[i][1]).join(', ')}. The ${CONTAIN[t][1]} holds the ${most ? 'most' : 'least'}.` });
  }
  const cup = c => `<span class="m2cups">${Array.from({ length: c }, () => glass(1)).join('')}</span>`;
  if (Math.random() < 0.5) {
    const k = rnd(2, 5), m = 2;
    return Q({ prompt: `1 jug fills ${k} cups. How many cups do 2 jugs fill?`, speak: `One jug of water fills ${k} cups. How many cups do 2 jugs fill?`, visual: ROW(P(glass(1), 'xs'), '<span class="op">=</span>', cup(k)), choices: nOpts(k * m, 1, 12, 4, [k, k + 2, k * m + 1]), answer: k * m,
      explainText: `Each jug fills ${k} cups. ${k} + ${k} = ${k * m} cups.` });
  }
  const n = rnd(4, 9), m = rnd(1, n - 1);
  return Q({ prompt: `A jug holds ${n} cups. You pour out ${m}. How many cups are left in the jug?`, speak: `A jug holds ${n} cups of water. You pour out ${m} cup${m > 1 ? 's' : ''}. How many cups of water are left in the jug?`, visual: P(glass((n - m) / n, '#22305A', n), 'xs'), choices: nOpts(n - m, 0, 10, 4, [n, m, n + m]), answer: n - m,
    explainText: `${n} cup${n > 1 ? 's' : ''} take away ${m} cup${m > 1 ? 's' : ''} leaves ${n - m} cup${n - m > 1 ? 's' : ''}. Count the marks on the jug to check.` });
});

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DCOL = ['#F2604F', '#FF8A2B', '#FFC23D', '#2FA36B', '#2E8BE6', '#6D55D1', '#F49AC1'];
const week = (hide = -1, hi = -1) => `<div class="m2week">${DAYS.map((d, i) => `<span style="--c:${DCOL[i]}" class="${i === hide ? 'q' : i === hi ? 'hi' : ''}">${i === hide ? '?' : d.slice(0, 3)}</span>`).join('')}</div>`;
const dayOpts = (i, n = 3) => opts(DAYS[i], [1, 6, 2, 5].map(d => DAYS[(i + d) % 7]), n, v => v);
S('days', 0, 'Days of the week', '📅', [
  ['There are 7 days in a week. They always come in the same order.', () => week()],
  ['Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday. Then Monday again!', () => ''],
  ['Saturday and Sunday are the weekend.', () => week(-1, 5)]
], L => {
  if (L === 1) {
    const i = rnd(0, 6);
    return Q({ prompt: 'Which day is missing?', speak: 'One day of the week is hiding. Which day is missing?', visual: week(i), choices: dayOpts(i), answer: DAYS[i], explain: week(-1, i), explainText: `${i ? DAYS[i - 1] : 'The week starts with Monday'}${i ? `, then ${DAYS[i]}` : ''}${i < 6 ? `, then ${DAYS[i + 1]}` : ''}. The missing day is ${DAYS[i]}.` });
  }
  if (L <= 3) {
    const i = rnd(0, 6), after = L === 2, j = (i + (after ? 1 : 6)) % 7;
    return Q({ prompt: `What day comes ${after ? 'after' : 'before'} ${DAYS[i]}?`, visual: week(-1, i), choices: dayOpts(j, L === 2 ? 3 : 4), answer: DAYS[j], explain: week(-1, j),
      explainText: `${after ? `${DAYS[i]}, then ${DAYS[j]}.` : `${DAYS[j]}, then ${DAYS[i]}.`}${after && i === 6 ? ' After Sunday, the week starts again with Monday.' : !after && i === 0 ? ' Before Monday comes Sunday, from the week before.' : ''}` });
  }
  if (L === 4) {
    const i = rnd(0, 6), tom = Math.random() < 0.5, j = (i + (tom ? 1 : 6)) % 7;
    return Q({ prompt: `Today is ${DAYS[i]}. What day ${tom ? 'will it be tomorrow' : 'was it yesterday'}?`, choices: dayOpts(j, 4), answer: DAYS[j], explain: week(-1, i),
      explainText: tom ? `Tomorrow is the next day. After ${DAYS[i]} comes ${DAYS[j]}.` : `Yesterday was the day before. Before ${DAYS[i]} comes ${DAYS[j]}.` });
  }
  const k = pick(['jump', 'jump', 'count', 'weekend']);
  if (k === 'count') return Q({ prompt: 'How many days are in a week?', choices: opts(7, [5, 6, 10, 12, 30], 4), answer: 7, explain: week(), explainText: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday. That is 7 days.' });
  if (k === 'weekend') {
    const ans = 'Saturday and Sunday';
    return Q({ prompt: 'Which days are the weekend?', choices: opts(ans, ['Monday and Tuesday', 'Friday and Monday', 'Sunday and Monday', 'Thursday and Friday'], 3, v => v), answer: ans, explain: week(-1, 5), explainText: 'Saturday and Sunday are the weekend. The other five days are weekdays.' });
  }
  const i = rnd(0, 6), d = rnd(2, 3), j = (i + d) % 7;
  return Q({ prompt: `What day is ${d} days after ${DAYS[i]}?`, choices: opts(DAYS[j], [DAYS[(j + 6) % 7], DAYS[(j + 1) % 7], DAYS[(i + 1) % 7], DAYS[(i + 6) % 7]], 4, v => v), answer: DAYS[j], explain: week(-1, i),
    explainText: `Start at ${DAYS[i]} and count on ${d}: ${Array.from({ length: d }, (_, s) => DAYS[(i + s + 1) % 7]).join(', ')}. It is ${DAYS[j]}.` });
});

/* ===================== World 1: Sprout Valley ===================== */

S('tenframe', 1, 'Ten frames', '🔟', [
  ['A ten frame has 10 boxes: 5 on top and 5 below.', () => P(fr(0), 'sm')],
  ['Fill the top row first. 7 is a full row of 5 and 2 more.', () => P(fr(7), 'sm')],
  ['Empty boxes show how many more to make 10. 7 and 3 make 10.', () => P(fr(7, '#F2604F', 3), 'sm')]
], L => {
  if (L === 1) {
    const n = rnd(1, 10);
    return Q({ prompt: 'How many dots?', speak: 'How many dots are in the ten frame?', visual: P(fr(n)), choices: nOpts(n, 0, 10, 3, [10 - n]), answer: n, explain: P(fr(n)), explainText: n >= 5 ? `The top row is 5${n > 5 ? `, and there are ${n - 5} below` : ''}. That makes ${n}.` : `Count the dots on the top row: ${n}.` });
  }
  if (L === 2) {
    const n = rnd(1, 9);
    return Q({ prompt: 'How many more to make 10?', speak: 'How many more dots would fill the ten frame to make 10?', visual: P(fr(n)), choices: nOpts(10 - n, 0, 10, 4, [n]), answer: 10 - n, explain: P(fr(n, '#F2604F', 10 - n)), explainText: `Count the empty boxes: ${10 - n}. ${n} and ${10 - n} make 10.` });
  }
  if (L === 3) {
    const k = rnd(1, 10);
    return Q({ prompt: 'How many dots?', speak: 'Count the dots in both ten frames. How many?', visual: `<div class="m2stack">${fr(10)}${fr(k)}</div>`, choices: nOpts(10 + k, 1, 20, 4, [k, 10 + k + 10]), answer: 10 + k, explain: `<div class="m2stack">${fr(10)}${fr(k, '#2E8BE6')}</div>`, explainText: `One full frame is 10. Then ${k} more makes ${10 + k}.` });
  }
  if (L === 4) {
    const n = rnd(3, 10), vals = shuffle([n, ...shuffle([n - 1, n + 1, n - 2, n + 2].filter(v => v >= 1 && v <= 10)).slice(0, 2)]), cols = shuffle(COLORS);
    return Q({ prompt: `Which ten frame shows ${n}?`, choices: vals.map((v, i) => C(v, fr(v, cols[i][0]), `the ${cols[i][1]} frame`)), answer: n, explain: P(fr(n), 'sm'), explainText: n >= 5 ? `${n} is a full top row of 5${n > 5 ? ` and ${n - 5} more` : ''}.` : `${n} is ${n} dots on the top row.` });
  }
  const a = rnd(6, 9), b = rnd(11 - a, 9), fill = 10 - a, rest = b - fill;
  return Q({ prompt: `${a} + ${b} = ?`, speak: `What is ${a} plus ${b}? Fill up the ten frame first.`, visual: `<div class="m2stack">${fr(a, '#F2604F', fill)}${fr(0, '#F2604F', rest)}</div>`, choices: nOpts(a + b, 1, 20, 4, [a + b - 10, 10 + b]), answer: a + b,
    steps: [`Move ${fill} of the ${b} to fill the first frame: ${a} + ${fill} = 10.`, `There are ${rest} left over.`, `10 + ${rest} = ${a + b}.`], explainText: `So ${a} + ${b} = ${a + b}.` });
});

const SPOT = [[32, 40], [20, 60], [38, 58], [26, 78], [42, 78], [34, 95]];
function bug(l, r) {
  const sp = (x, y) => `<circle cx="${x}" cy="${y}" r="6.5" fill="#22305A"/>`;
  return `<svg class="m2bug" viewBox="0 0 100 112" role="img" aria-label="ladybug with ${l} spots and ${r} spots"><circle cx="50" cy="18" r="14" fill="#22305A"/><circle cx="44" cy="14" r="3" fill="#fff"/><circle cx="56" cy="14" r="3" fill="#fff"/><ellipse cx="50" cy="64" rx="40" ry="44" fill="#F2604F" stroke="#22305A" stroke-width="3"/><line x1="50" y1="22" x2="50" y2="108" stroke="#22305A" stroke-width="3"/>${SPOT.slice(0, l).map(([x, y]) => sp(x, y)).join('')}${SPOT.slice(0, r).map(([x, y]) => sp(100 - x, y)).join('')}</svg>`;
}
S('doubles', 1, 'Doubles', '🐞', [
  ['A double is a number added to itself. This ladybug has 3 spots on each side: 3 + 3 = 6.', () => P(bug(3, 3), 'xs')],
  ['Near doubles are one more: 3 + 4 is double 3 plus 1, so 7.', () => P(bug(3, 4), 'xs')],
  ['Halving undoes doubling. Half of 6 is 3.', () => `<span class="bignum">6 → 3</span>`]
], L => {
  if (L <= 2) {
    const n = rnd(1, L === 1 ? 5 : 10), pic = n <= 6;
    return Q({ prompt: L === 1 ? `${n} spots on each wing. How many spots altogether?` : `${n} + ${n} = ?`, speak: L === 1 ? `This ladybug has ${n} spots on each wing. How many spots altogether?` : `What is double ${n}? ${n} plus ${n}?`, visual: pic ? P(bug(n, n), 'sm') : '',
      choices: nOpts(2 * n, 1, 22, L === 1 ? 3 : 4, [n, 2 * n + 1, 2 * n - 1]), answer: 2 * n, explain: pic ? P(bug(n, n), 'xs') : '', explainText: `Double ${n} is ${n} + ${n} = ${2 * n}.` });
  }
  if (L === 3) {
    const n = rnd(2, 9), [a, b] = Math.random() < 0.5 ? [n, n + 1] : [n + 1, n];
    return Q({ prompt: `${a} + ${b} = ?`, speak: `What is ${a} plus ${b}? Use a double!`, visual: n + 1 <= 6 ? P(bug(a, b), 'sm') : '', choices: nOpts(2 * n + 1, 1, 20, 4, [2 * n, 2 * n + 2]), answer: 2 * n + 1,
      steps: [`${n} + ${n} = ${2 * n} is a double you know.`, `${n + 1} is one more than ${n}, so add 1: ${2 * n + 1}.`], explainText: `${a} + ${b} = ${2 * n + 1}.` });
  }
  if (L === 4) {
    const n = rnd(1, 10), [e, nm] = pick(THINGS);
    return Q({ prompt: `Half of ${2 * n} is?`, speak: `Share ${2 * n} ${nm} into 2 equal groups. What is half of ${2 * n}?`, visual: objs(2 * n, e), choices: nOpts(n, 1, 20, 4, [2 * n, n + 2]), answer: n,
      explain: ROW(objs(n, e), objs(n, e)), explainText: `Split ${2 * n} into 2 equal groups of ${n}. Check: ${n} + ${n} = ${2 * n}.` });
  }
  if (Math.random() < 0.5) {
    const n = pick([11, 12, 13, 14, 15, 20, 25, 30, 35, 40, 50]);
    return Q({ prompt: `Double ${n} = ?`, speak: `What is double ${n}?`, choices: nOpts(2 * n, 1, 110, 4, [n + 2, 2 * n + 10, 2 * n - 10]), answer: 2 * n,
      explainText: n % 10 ? `Double the tens and the ones: double ${n - n % 10} is ${2 * (n - n % 10)}, double ${n % 10} is ${2 * (n % 10)}. Together ${2 * n}.` : `Double ${n / 10} tens is ${n / 5} tens: ${2 * n}.` });
  }
  const h = pick([12, 15, 20, 25, 30, 40, 50]);
  return Q({ prompt: `Half of ${2 * h} = ?`, speak: `What is half of ${2 * h}?`, choices: nOpts(h, 1, 110, 4, [2 * h, h + 10, h - 5]), answer: h, explainText: `Half of ${2 * h} is ${h}, because ${h} + ${h} = ${2 * h}.` });
});

/* Number line with frog jumps. */
function nline(min, max, start, jumps, { step = 1, labelEvery = 1, end = null, qLabel = false } = {}) {
  const W = 340, x0 = 18, sp = (W - 2 * x0) / (max - min), X = v => +(x0 + (v - min) * sp).toFixed(1), y = 62;
  let s = `<line x1="${x0 - 8}" y1="${y}" x2="${W - x0 + 8}" y2="${y}" stroke="#22305A" stroke-width="3" stroke-linecap="round"/>`;
  for (let v = min; v <= max; v += step) {
    const lab = (v - min) % labelEvery === 0;
    s += `<line x1="${X(v)}" y1="${y - (lab ? 7 : 4)}" x2="${X(v)}" y2="${y + (lab ? 7 : 4)}" stroke="#22305A" stroke-width="2"/>`;
    if (lab) s += `<text x="${X(v)}" y="${y + 22}" font-size="${max - min > 12 && step === 1 ? 11 : 15}" font-weight="800" text-anchor="middle" fill="#22305A">${v}</text>`;
  }
  let at = start;
  for (const j of jumps) {
    const to = at + j, x1 = X(at), x2 = X(to), h = Math.min(qLabel ? 30 : 40, 10 + Math.abs(x2 - x1) * 0.45), col = j > 0 ? '#F2604F' : '#2E8BE6', mx = (x1 + x2) / 2;
    s += `<path d="M${x1} ${y - 4} Q${mx} ${y - 4 - 2 * h} ${x2} ${y - 6}" fill="none" stroke="${col}" stroke-width="2.5"/><path d="M${x2 - 4} ${y - 12} L${x2 + 4} ${y - 12} L${x2} ${y - 4} Z" fill="${col}"/>`;
    if (qLabel) s += `<text x="${mx}" y="${y - 10 - h}" font-size="20" font-weight="800" text-anchor="middle" fill="${col}">?</text>`;
    at = to;
  }
  if (end != null) s += `<circle cx="${X(end)}" cy="${y}" r="6" fill="#FFC23D" stroke="#22305A" stroke-width="2"/>`;
  s += `<text x="${X(start)}" y="${y - 5}" font-size="24" text-anchor="middle">🐸</text>`;
  return `<svg class="m2nl" viewBox="0 0 ${W} 90" role="img" aria-label="number line from ${min} to ${max}">${s}</svg>`;
}
const unit = (n, sgn) => Array(n).fill(sgn);
S('numline', 1, 'Number line jumps', '🐸', [
  ['A number line has the numbers in order. Bigger numbers are further right.', () => P(nline(0, 10, 2, []))],
  ['Adding jumps forward to the right. 2 + 3: start at 2, jump 3 times, land on 5.', () => P(nline(0, 10, 2, unit(3, 1)))],
  ['Taking away jumps back to the left. 7 − 2: jump back 2, land on 5.', () => P(nline(0, 10, 7, unit(2, -1)))]
], L => {
  if (L <= 3) {
    const max = L === 3 ? 20 : 10, fwd = L === 1 || (L === 3 && Math.random() < 0.5), b = rnd(L === 3 ? 2 : 1, L === 3 ? 6 : 4), a = fwd ? rnd(0, max - b) : rnd(b, max), ans = fwd ? a + b : a - b;
    return Q({ prompt: `${a} ${fwd ? '+' : '−'} ${b} = ?`, speak: `The frog starts on ${a} and jumps ${fwd ? 'forward' : 'back'} ${b}. Where does it land?`, visual: P(nline(0, max, a, unit(b, fwd ? 1 : -1))), choices: nOpts(ans, 0, max, 4, [a, fwd ? ans + 1 : ans - 1]), answer: ans,
      explainText: `Start on ${a}. Jump ${fwd ? 'forward' : 'back'}: ${Array.from({ length: b }, (_, i) => fwd ? a + i + 1 : a - i - 1).join(', ')}. The frog lands on ${ans}.` });
  }
  if (L === 4) {
    const d = rnd(2, 8), fwd = Math.random() < 0.5, a = fwd ? rnd(0, 20 - d) : rnd(d, 20), c = fwd ? a + d : a - d, ans = (fwd ? '+' : '−') + d;
    const say = v => `jump ${v[0] === '+' ? 'forward' : 'back'} ${v.slice(1)}`;
    return Q({ prompt: `The frog jumps from ${a} to ${c}. What was the jump?`, speak: `The frog jumps from ${a} to ${c}. What was the jump?`, visual: P(nline(0, 20, a, [c - a], { end: c, qLabel: true })),
      choices: opts(ans, [(fwd ? '−' : '+') + d, (fwd ? '+' : '−') + (d + 1), (fwd ? '+' : '−') + (d - 1), (fwd ? '+' : '−') + (d + 2)], 4, v => v, say), answer: ans,
      explainText: `It went ${fwd ? 'forward to a bigger' : 'back to a smaller'} number. From ${a} to ${c} is ${d} steps, so the jump is ${ans}.` });
  }
  const m = rnd(2, 4), fwd = Math.random() < 0.5, a = fwd ? rnd(0, 10 - m) * 10 : rnd(m, 10) * 10, ans = fwd ? a + 10 * m : a - 10 * m;
  return Q({ prompt: `${a} ${fwd ? '+' : '−'} ${10 * m} = ?`, speak: `The frog starts on ${a} and makes ${m} jumps of 10 ${fwd ? 'forward' : 'back'}. Where does it land?`, visual: P(nline(0, 100, a, unit(m, fwd ? 10 : -10), { step: 10, labelEvery: 10 })), choices: nOpts(ans, 0, 100, 4, [fwd ? ans - 10 : ans + 10, a + (fwd ? m : -m)]), answer: ans,
    explainText: `${10 * m} is ${m} jumps of 10. ${a}, ${Array.from({ length: m }, (_, i) => fwd ? a + 10 * (i + 1) : a - 10 * (i + 1)).join(', ')}. The frog lands on ${ans}.` });
});

function tallySVG(n, col = '#22305A') {
  const g = Math.max(1, Math.ceil(n / 5)); let s = '', x = 8;
  for (let i = 0; i < g; i++) {
    const k = Math.min(5, n - i * 5);
    for (let j = 0; j < Math.min(k, 4); j++) s += `<line x1="${x + j * 9}" y1="6" x2="${x + j * 9}" y2="46" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`;
    if (k === 5) s += `<line x1="${x - 6}" y1="38" x2="${x + 33}" y2="14" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`;
    x += 50;
  }
  return `<svg class="m2tally" viewBox="0 0 ${x - 4} 52" role="img" aria-label="tally marks">${s}</svg>`;
}
S('tally', 1, 'Tally marks', '🖍️', [
  ['A tally mark is one line for each thing you count.', () => P(tallySVG(3), 'xs')],
  ['The 5th line goes across the other four. That makes a bundle of 5.', () => P(tallySVG(5), 'xs')],
  ['Count bundles in 5s, then the ones: 5, 10, 11, 12.', () => P(tallySVG(12))]
], L => {
  if (L <= 3) {
    const n = L === 1 ? rnd(1, 5) : L === 2 ? rnd(3, 10) : rnd(8, 20), b = Math.floor(n / 5), r = n % 5;
    return Q({ prompt: 'How many tally marks?', speak: 'Count the tally marks. How many?', visual: P(tallySVG(n), n > 10 ? '' : 'sm'), choices: nOpts(n, 1, 25, L === 1 ? 3 : 4, [b * 4 + r, n + 5, n - 5]), answer: n,
      explainText: b ? `Count the bundles by 5s: ${Array.from({ length: b }, (_, i) => 5 * (i + 1)).join(', ')}.${r ? ` Then count on ${r}: ${Array.from({ length: r }, (_, i) => b * 5 + i + 1).join(', ')}.` : ''} That is ${n}.` : `Count each line: ${Array.from({ length: n }, (_, i) => i + 1).join(', ')}.` });
  }
  if (L === 4) {
    const n = rnd(4, 15), vals = shuffle([n, ...shuffle([n - 1, n + 1, n + 5, n - 5, n + 2].filter(v => v >= 1 && v <= 20)).slice(0, 2)]), cols = shuffle(COLORS);
    return Q({ prompt: `Which tally shows ${n}?`, choices: vals.map((v, i) => C(v, tallySVG(v, cols[i][0]), `the ${cols[i][1]} tally`)), answer: n, explain: P(tallySVG(n), 'sm'),
      explainText: `${n} is ${Math.floor(n / 5)} bundle${Math.floor(n / 5) === 1 ? '' : 's'} of 5${n % 5 ? ` and ${n % 5} more line${n % 5 > 1 ? 's' : ''}` : ''}.` });
  }
  const set = pick([[['🍎', 'apples'], ['🍌', 'bananas'], ['🍇', 'grapes']], [['🐶', 'dogs'], ['🐱', 'cats'], ['🐟', 'fish']], [['⚽', 'football'], ['🏊', 'swimming'], ['🚲', 'cycling']]]);
  const vals = shuffle([3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 3), chart = `<div class="m2tchart">${set.map((s, i) => `<span>${s[0]}</span>${tallySVG(vals[i])}`).join('')}</div>`;
  if (Math.random() < 0.5) {
    const [i, j] = shuffle([0, 1, 2]).slice(0, 2), [h, l] = vals[i] > vals[j] ? [i, j] : [j, i], d = vals[h] - vals[l];
    return Q({ prompt: `How many more ${set[h][0]} than ${set[l][0]}?`, speak: `Read the tally chart. How many more for ${set[h][1]} than ${set[l][1]}?`, visual: chart, choices: nOpts(d, 1, 12, 4, [vals[h], vals[l], d + 1]), answer: d,
      explainText: `${set[h][1]} has ${vals[h]}. ${set[l][1]} has ${vals[l]}. ${vals[h]} − ${vals[l]} = ${d}.` });
  }
  const tot = vals[0] + vals[1] + vals[2];
  return Q({ prompt: 'How many altogether?', speak: 'Read the tally chart. How many tally marks altogether?', visual: chart, choices: nOpts(tot, 1, 40, 4, [tot + 5, tot - 5]), answer: tot, explainText: `${vals.join(' + ')} = ${tot}.` });
});

/* Shapes cut into parts. */
const strips = (x, y, w, h, fr, vert = true) => { const out = []; let a = 0; for (const f of fr) { out.push(vert ? `M${+(x + a * w).toFixed(1)} ${y} h${+(f * w).toFixed(1)} v${h} h${-(f * w).toFixed(1)} Z` : `M${x} ${+(y + a * h).toFixed(1)} h${w} v${+(f * h).toFixed(1)} h${-w} Z`); a += f; } return out; };
const quad = (x, y, w, h, fx, fy) => [[0, 0, fx, fy], [fx, 0, 1 - fx, fy], [0, fy, fx, 1 - fy], [fx, fy, 1 - fx, 1 - fy]].map(([a, b, c, d]) => `M${x + a * w} ${y + b * h} h${+(c * w).toFixed(1)} v${+(d * h).toFixed(1)} h${-(c * w).toFixed(1)} Z`);
const diag2 = (x, y, s) => [`M${x} ${y} L${x + s} ${y} L${x} ${y + s} Z`, `M${x + s} ${y} L${x + s} ${y + s} L${x} ${y + s} Z`];
const diag4 = (x, y, s) => { const cx = x + s / 2, cy = y + s / 2; return [[x, y, x + s, y], [x + s, y, x + s, y + s], [x + s, y + s, x, y + s], [x, y + s, x, y]].map(([a, b, c, d]) => `M${a} ${b} L${c} ${d} L${cx} ${cy} Z`); };
const sectors = (d, rot = 0) => Array.from({ length: d }, (_, i) => { const a0 = (rot - 90 + i * 360 / d) * Math.PI / 180, a1 = (rot - 90 + (i + 1) * 360 / d) * Math.PI / 180, p = a => `${(50 + 44 * Math.cos(a)).toFixed(1)} ${(50 + 44 * Math.sin(a)).toFixed(1)}`; return `M50 50 L${p(a0)} A44 44 0 0 1 ${p(a1)} Z`; });
function cut(kind, d, sh, col, equal = true, orient = 0) {
  let Ps, vb = '0 0 100 100';
  if (kind === 'circle') Ps = equal ? sectors(d, orient ? (d === 2 ? 90 : 45) : 0) : ['M30 10.8 A44 44 0 0 0 30 89.2 Z', 'M30 10.8 A44 44 0 1 1 30 89.2 Z'];
  else if (kind === 'square') {
    if (!equal) Ps = d === 2 ? strips(6, 6, 88, 88, orient ? [0.7, 0.3] : [0.3, 0.7], orient !== 2) : quad(6, 6, 88, 88, 0.3, 0.62);
    else if (d === 2) Ps = orient === 2 ? diag2(6, 6, 88) : strips(6, 6, 88, 88, [0.5, 0.5], orient === 0);
    else if (d === 4) Ps = orient === 2 ? diag4(6, 6, 88) : orient === 1 ? strips(6, 6, 88, 88, [0.25, 0.25, 0.25, 0.25]) : quad(6, 6, 88, 88, 0.5, 0.5);
    else Ps = strips(6, 6, 88, 88, Array(d).fill(1 / d));
  } else { vb = '0 0 140 100'; Ps = strips(6, 16, 128, 68, equal ? Array(d).fill(1 / d) : d === 2 ? [0.3, 0.7] : d === 3 ? [0.2, 0.3, 0.5] : [0.15, 0.2, 0.3, 0.35]); }
  return `<svg class="m2cut" viewBox="${vb}" role="img" aria-label="shape cut into ${d} parts">${Ps.map((p, i) => `<path d="${p}" fill="${i < sh ? col : '#fff'}" stroke="#22305A" stroke-width="3" stroke-linejoin="round"/>`).join('')}</svg>`;
}
const PARTW = { 2: 'one half', 3: 'one third', 4: 'one quarter' };
S('halves', 1, 'Halves and quarters', '🍰', [
  ['A half is 1 of 2 equal parts. Both parts must be the same size!', () => ROW(P(cut('circle', 2, 1, '#FFC23D'), 'xs'), P(cut('square', 2, 1, '#2FA36B', true, 2), 'xs'))],
  ['A quarter is 1 of 4 equal parts.', () => ROW(P(cut('square', 4, 1, '#2E8BE6'), 'xs'), P(cut('circle', 4, 1, '#F2604F'), 'xs'))],
  ['These parts are not equal, so they are not halves.', () => P(cut('bar', 2, 1, '#6D55D1', false), 'xs')]
], L => {
  const cols = shuffle(COLORS), kinds = ['circle', 'square', 'bar'];
  if (L === 1) {
    const ks = shuffle(kinds), ori = rnd(0, ks[0] === 'square' ? 2 : 1), ch = [C('equal', cut(ks[0], 2, 2, cols[0][0], true, ori), `the ${cols[0][1]} one`), C('bad1', cut(ks[1], 2, 2, cols[1][0], false, rnd(0, 1)), `the ${cols[1][1]} one`), C('bad2', cut(ks[2], 2, 2, cols[2][0], false, 0), `the ${cols[2][1]} one`)];
    return Q({ prompt: 'Which one is cut in half?', speak: 'Which one is cut into 2 equal halves?', choices: shuffle(ch), answer: 'equal', explain: P(cut(ks[0], 2, 1, '#FFC23D', true, ori), 'xs'), explainText: 'Halves must be the same size. Only one shape has 2 equal parts.' });
  }
  if (L === 2) {
    const want = pick([2, 4]), k = pick(kinds), ds = shuffle([2, 3, 4]);
    return Q({ prompt: `Which shows ${PARTW[want]} coloured?`, choices: ds.map((d, i) => C('d' + d, cut(k, d, 1, cols[i][0]), `the ${cols[i][1]} one`)), answer: 'd' + want, explain: P(cut(k, want, 1, '#FFC23D'), 'xs'),
      explainText: `${cap(PARTW[want])} means 1 of ${want} equal parts. Count the parts: this one has ${want}.` });
  }
  if (L === 3 && Math.random() < 0.5) {
    const k = pick(kinds), d = k === 'circle' ? 2 : pick([2, 4]), eq = Math.random() < 0.5;
    return Q({ prompt: 'Are the parts equal?', speak: 'Look at the parts. Are they all the same size?', visual: P(cut(k, d, 0, '#fff', eq, k === 'square' ? rnd(0, 2) : 0), 'sm'), choices: YESNO(), answer: eq ? 'yes' : 'no',
      explainText: eq ? `Yes. All ${d} parts are the same size.` : 'No. Some parts are bigger than others.' });
  }
  if (L === 3 || (L === 5 && Math.random() < 0.5)) {
    const opts3 = L === 5 ? [[2, 1], [4, 1], [3, 1], [4, 3]] : [[2, 1], [4, 1], [3, 1]], [d, s] = pick(opts3), k = pick(kinds), name = s === 3 ? 'three quarters' : PARTW[d];
    const names = L === 5 ? ['one half', 'one quarter', 'one third', 'three quarters'] : ['one half', 'one quarter', 'one third'];
    return Q({ prompt: 'What part is coloured?', visual: P(cut(k, d, s, '#FFC23D', true, k === 'square' ? rnd(0, 2) : rnd(0, 1)), 'sm'), choices: opts(name, names, L === 5 ? 4 : 3, v => v), answer: name,
      explainText: `There are ${d} equal parts and ${s} ${s === 1 ? 'is' : 'are'} coloured. That is ${name}.` });
  }
  const [e, nm] = pick(THINGS);
  if (L === 4) {
    const n = 2 * rnd(1, 6);
    return Q({ prompt: `What is half of ${n}?`, speak: `Share ${n} ${nm} into 2 equal groups. What is half of ${n}?`, visual: objs(n, e), choices: nOpts(n / 2, 1, 12, 4, [n, n - 2]), answer: n / 2,
      explain: ROW(objs(n / 2, e), objs(n / 2, e)), explainText: `Share them out one at a time into 2 groups. Each group gets ${n / 2}.` });
  }
  const n = 4 * rnd(1, 5);
  return Q({ prompt: `What is a quarter of ${n}?`, speak: `Share ${n} ${nm} into 4 equal groups. What is one quarter of ${n}?`, visual: objs(n, e), choices: nOpts(n / 4, 1, 20, 4, [n / 2, n - 4]), answer: n / 4,
    explain: ROW(objs(n / 4, e), objs(n / 4, e), objs(n / 4, e), objs(n / 4, e)), steps: [`Half of ${n} is ${n / 2}.`, `Half of ${n / 2} is ${n / 4}.`], explainText: `A quarter is half of a half. A quarter of ${n} is ${n / 4}.` });
});

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const SEASONS = [['spring', '🌷🐣'], ['summer', '☀️🏖️'], ['autumn', '🍂🍁'], ['winter', '⛄❄️']];
const monthStrip = (hi = -1) => `<div class="m2months">${MONTHS.map((m, i) => `<span class="${i === hi ? 'hi' : ''}">${m.slice(0, 3)}</span>`).join('')}</div>`;
function calGrid(mi, start, ask) {
  let cells = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => `<b>${d}</b>`).join('');
  cells += '<i></i>'.repeat(start);
  for (let d = 1; d <= MDAYS[mi]; d++) cells += `<span class="${d === ask ? 'hi' : ''}">${d}</span>`;
  return `<div class="m2cal"><div class="m2calt">${MONTHS[mi]}</div><div class="m2calg">${cells}</div></div>`;
}
const mOpts = (i, n = 3) => opts(MONTHS[i], [1, 11, 2, 10, 6].map(d => MONTHS[(i + d) % 12]), n, v => v);
S('calendar', 1, 'Months and seasons', '🗓️', [
  ['A year has 12 months. It starts with January and ends with December.', () => monthStrip()],
  ['There are 4 seasons: spring, summer, autumn and winter. Then spring comes again.', () => `<span class="m2emo">🌷 ☀️ 🍂 ⛄</span>`],
  ['A calendar shows the days of a month. Each column is a day of the week.', () => calGrid(4, 2, 0)]
], L => {
  if (L === 1) {
    const [nm, pic] = pick(SEASONS);
    return Q({ prompt: 'Which season is this?', speak: 'Look at the picture. Which season is it?', visual: `<span class="m2emo big">${pic}</span>`, choices: opts(nm, SEASONS.map(s => s[0]), 3, v => v), answer: nm,
      explainText: { spring: 'Flowers grow and baby animals are born in spring.', summer: 'Summer is the hot, sunny season. Time for the beach!', autumn: 'In autumn the leaves change colour and fall.', winter: 'Winter is the cold season. Sometimes it snows!' }[nm] });
  }
  if (L <= 3) {
    if (L === 3 && Math.random() < 0.35) {
      const i = rnd(0, 3), j = (i + 1) % 4;
      return Q({ prompt: `Which season comes after ${SEASONS[i][0]}?`, choices: opts(SEASONS[j][0], SEASONS.map(s => s[0]), 3, v => v), answer: SEASONS[j][0], explain: `<span class="m2emo">${SEASONS.map(s => s[1].slice(0, 2)).join(' ')}</span>`, explainText: `The seasons go spring, summer, autumn, winter, and round again. After ${SEASONS[i][0]} comes ${SEASONS[j][0]}.` });
    }
    const i = rnd(0, 11), after = L === 2 || Math.random() < 0.5, j = (i + (after ? 1 : 11)) % 12;
    return Q({ prompt: `Which month comes ${after ? 'after' : 'before'} ${MONTHS[i]}?`, visual: L === 2 ? monthStrip(i) : '', choices: mOpts(j, L === 2 ? 3 : 4), answer: MONTHS[j], explain: monthStrip(j),
      explainText: `${after ? `${MONTHS[i]}, then ${MONTHS[j]}.` : `${MONTHS[j]}, then ${MONTHS[i]}.`}${after && i === 11 ? ' After December, a new year starts with January.' : !after && i === 0 ? ' Before January comes December of the year before.' : ''}` });
  }
  if (L === 4) {
    const k = pick(['nth', 'nth', 'count', 'jump']);
    if (k === 'count') return Q({ prompt: 'How many months are in a year?', choices: opts(12, [10, 7, 4, 52, 30], 4), answer: 12, explain: monthStrip(), explainText: 'January to December is 12 months.' });
    if (k === 'jump') {
      const i = rnd(0, 11), d = rnd(2, 3), j = (i + d) % 12;
      return Q({ prompt: `Which month is ${d} months after ${MONTHS[i]}?`, choices: opts(MONTHS[j], [MONTHS[(j + 11) % 12], MONTHS[(j + 1) % 12], MONTHS[(i + 1) % 12]], 4, v => v), answer: MONTHS[j], explain: monthStrip(i),
        explainText: `Count on ${d} from ${MONTHS[i]}: ${Array.from({ length: d }, (_, s) => MONTHS[(i + s + 1) % 12]).join(', ')}.` });
    }
    const n = rnd(1, 12);
    return Q({ prompt: `What is month number ${n}?`, speak: `Which month is the ${['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'][n]} month of the year?`, choices: mOpts(n - 1, 4), answer: MONTHS[n - 1], explain: monthStrip(n - 1),
      explainText: `Count from January: ${MONTHS.slice(0, n).join(', ')}. Month ${n} is ${MONTHS[n - 1]}.` });
  }
  const mi = rnd(0, 11), start = rnd(0, 6);
  if (Math.random() < 0.6) {
    const d = rnd(2, MDAYS[mi]), wd = (start + d - 1) % 7;
    return Q({ prompt: `What day of the week is ${MONTHS[mi]} ${d}?`, speak: `Look at the calendar. What day of the week is the ${d}${d % 10 === 1 && d !== 11 ? 'st' : d % 10 === 2 && d !== 12 ? 'nd' : d % 10 === 3 && d !== 13 ? 'rd' : 'th'} of ${MONTHS[mi]}?`, visual: calGrid(mi, start, d),
      choices: opts(DAYS[wd], [DAYS[(wd + 1) % 7], DAYS[(wd + 6) % 7], DAYS[(wd + 2) % 7]], 4, v => v), answer: DAYS[wd], explainText: `Find ${d} on the calendar, then look up to the top of its column. It says ${DAYS[wd].slice(0, 2)}, for ${DAYS[wd]}.` });
  }
  const wd = rnd(0, 6), cnt = Array.from({ length: MDAYS[mi] }, (_, i) => (start + i) % 7).filter(x => x === wd).length;
  return Q({ prompt: `How many ${DAYS[wd]}s are in this month?`, speak: `Look at the calendar for ${MONTHS[mi]}. How many ${DAYS[wd]}s are there?`, visual: calGrid(mi, start, 0), choices: opts(cnt, [3, 4, 5, 6, 7], 3), answer: cnt,
    explainText: `Find the ${DAYS[wd].slice(0, 2)} column and count the dates in it: ${cnt}.` });
});

S('between', 1, 'Before, after, between', '🔢', [
  ['After means the next number. After 14 comes 15.', () => track([13, 14, 15], 2)],
  ['Before means the number just in front. Before 14 comes 13.', () => track([13, 14, 15], 0)],
  ['Between means in the middle. 14 is between 13 and 15.', () => track([13, 14, 15], 1)]
], L => {
  if (L === 5) {
    const x = rnd(10, 85), y = x + rnd(4, 8), ans = rnd(x + 1, y - 1);
    return Q({ prompt: `Which number is between ${x} and ${y}?`, choices: opts(ans, [x, y, x - rnd(1, 5), y + rnd(1, 5), y + 10, x - 10].filter(v => v >= 0), 4), answer: ans,
      explainText: `Between ${x} and ${y} are the numbers ${Array.from({ length: y - x - 1 }, (_, i) => x + i + 1).join(', ')}. ${ans} is one of them.` });
  }
  const kind = L === 1 ? 'after' : L === 2 ? 'before' : L === 3 ? 'between' : pick(['after', 'before', 'between']);
  let n = L <= 2 ? rnd(2, 19) : L === 3 ? rnd(2, 49) : clamp(rnd(1, 9) * 10 + pick([-1, 0, 1]), 2, 98);
  const ans = kind === 'after' ? n + 1 : kind === 'before' ? n - 1 : n;
  const seq = kind === 'after' ? [n - 1, n, '?'] : kind === 'before' ? ['?', n, n + 1] : [n - 1, '?', n + 1];
  const say = kind === 'after' ? `What number comes just after ${n}?` : kind === 'before' ? `What number comes just before ${n}?` : `What number is between ${n - 1} and ${n + 1}?`;
  const cross = Math.floor((n + 1) / 10) !== Math.floor((n - 1) / 10);
  return Q({ prompt: say, visual: track(seq), choices: nOpts(ans, 0, 100, L === 1 ? 3 : 4, [kind === 'after' ? n - 1 : n + 1, ans + 10, ans - 10]), answer: ans, explain: track([ans - 1, ans, ans + 1], 1),
    explainText: `Count: ${ans - 1}, ${ans}, ${ans + 1}. ${kind === 'after' ? `After ${n} comes ${ans}.` : kind === 'before' ? `Just before ${n} is ${ans}.` : `${ans} is in the middle.`}${cross && L >= 4 ? ' The tens digit changes when you go past a 9.' : ''}` });
});

const house = (a, b, c) => `<svg class="m2house" viewBox="0 0 160 140" role="img" aria-label="number house"><path d="M80 6 L152 62 L8 62 Z" fill="#F2604F" stroke="#22305A" stroke-width="3" stroke-linejoin="round"/><rect x="22" y="62" width="116" height="72" fill="#FFF1CC" stroke="#22305A" stroke-width="3"/><line x1="80" y1="62" x2="80" y2="134" stroke="#22305A" stroke-width="2" stroke-dasharray="5 4"/><text x="80" y="54" font-size="28" font-weight="800" text-anchor="middle" fill="#fff">${c}</text><text x="51" y="110" font-size="30" font-weight="800" text-anchor="middle" fill="#22305A">${a}</text><text x="109" y="110" font-size="30" font-weight="800" text-anchor="middle" fill="#22305A">${b}</text></svg>`;
const facts = (a, b, c) => [`${a} + ${b} = ${c}`, `${b} + ${a} = ${c}`, `${c} − ${a} = ${b}`, `${c} − ${b} = ${a}`];
S('factfam', 1, 'Fact families', '🏠', [
  ['A number house holds a family: two parts downstairs, the whole on the roof.', () => P(house(3, 4, 7), 'xs')],
  ['The parts add to make the whole: 3 + 4 = 7 and 4 + 3 = 7.', () => `${objs(3, '🔴')}<span class="op">+</span>${objs(4, '🔵')}`],
  ['Take a part from the whole to get the other part: 7 − 4 = 3 and 7 − 3 = 4.', () => '<span class="m2eq">7 − 4 = 3<br>7 − 3 = 4</span>']
], L => {
  const max = L <= 3 ? 10 : 20;
  let a = rnd(1, max - 2), b; do b = rnd(1, max - a); while (b === a); const c = a + b;
  if (L === 1) {
    return Q({ prompt: `${a} + ${b} = ${c}. So ${b} + ${a} = ?`, speak: `${a} plus ${b} equals ${c}. So what is ${b} plus ${a}?`, visual: c <= 10 ? `${objs(a, '🔴')}<span class="op">+</span>${objs(b, '🔵')}` : '', choices: nOpts(c, 0, 20, 3, [a, b, c + 1]), answer: c,
      explainText: `Adding in any order gives the same total. ${b} + ${a} is still ${c}.` });
  }
  if (L === 2) {
    const takeB = Math.random() < 0.5, ans = takeB ? a : b;
    return Q({ prompt: `${a} + ${b} = ${c}. So ${c} − ${takeB ? b : a} = ?`, speak: `${a} plus ${b} equals ${c}. So what is ${c} minus ${takeB ? b : a}?`, visual: P(house(a, b, c), 'xs'), choices: nOpts(ans, 0, 20, 3, [c, takeB ? b : a, ans + 1]), answer: ans,
      explainText: `${c} is the whole. Take away the part ${takeB ? b : a} and the other part is left: ${ans}.` });
  }
  if (L === 3) {
    const right = pick(facts(a, b, c)), wrong = [`${a} − ${b} = ${c}`, `${a} + ${c} = ${b}`, `${b} − ${c} = ${a}`, `${c} + ${a} = ${b}`, `${b} − ${a} = ${c}`];
    return Q({ prompt: `Which fact is in the family ${a}, ${b}, ${c}?`, visual: P(house(a, b, c), 'xs'), choices: opts(right, wrong, 3, v => v, SPEAK_EQ), answer: right,
      explainText: `The family facts are ${facts(a, b, c).join(', ')}. The whole, ${c}, is always the biggest number.` });
  }
  if (L === 4) {
    const hide = pick(['a', 'b', 'c']), ans = { a, b, c }[hide];
    return Q({ prompt: 'What number is missing from the house?', speak: hide === 'c' ? `The parts are ${a} and ${b}. What is the whole?` : `The whole is ${c}. One part is ${hide === 'a' ? b : a}. What is the other part?`,
      visual: P(house(hide === 'a' ? '?' : a, hide === 'b' ? '?' : b, hide === 'c' ? '?' : c), 'sm'), choices: nOpts(ans, 0, 20, 4, hide === 'c' ? [Math.abs(a - b), c + 1] : [c, c + (hide === 'a' ? b : a)]), answer: ans,
      explainText: hide === 'c' ? `Add the parts: ${a} + ${b} = ${c}.` : `Take the part from the whole: ${c} − ${hide === 'a' ? b : a} = ${ans}.` });
  }
  const ok = shuffle(facts(a, b, c)).slice(0, 3), bad = pick([`${c} − ${a} = ${b + 1}`, `${a} + ${b} = ${c - 1}`, `${b} − ${a} = ${c}`, `${c} + ${b} = ${a}`, `${c} − ${b} = ${a + 2}`]);
  return Q({ prompt: `Which one is NOT in the family ${a}, ${b}, ${c}?`, speak: `Three of these belong to the family ${a}, ${b}, ${c}. Which one does not belong?`, choices: shuffle([bad, ...ok]).map(v => C(v, v, SPEAK_EQ(v), true)), answer: bad,
    explainText: `${bad} is not true. The family facts are ${facts(a, b, c).join(', ')}.` });
});

/* Beanbag target for adding three scores. */
const RINGS = [[1, 72, '#2E8BE6'], [2, 55, '#fff'], [5, 38, '#F2604F'], [10, 19, '#FFC23D']];
function target(hits) {
  let s = RINGS.map(([, r, c]) => `<circle cx="80" cy="80" r="${r}" fill="${c}" stroke="#22305A" stroke-width="2.5"/>`).join('');
  s += RINGS.map(([v, r], i) => i < 3 ? `<text x="80" y="${80 - r + 13}" font-size="12" font-weight="800" text-anchor="middle" fill="${i === 1 ? '#22305A' : '#fff'}">${v}</text>` : `<text x="80" y="86" font-size="15" font-weight="800" text-anchor="middle" fill="#22305A">10</text>`).join('');
  const ang = shuffle([25, 90, 155, 200, 340]);
  hits.forEach((v, k) => { const i = RINGS.findIndex(r => r[0] === v), ro = RINGS[i][1], ri = i < 3 ? RINGS[i + 1][1] : 0, rr = i < 3 ? (ro + ri) / 2 : 14, a = ang[k] * Math.PI / 180; s += `<circle cx="${(80 + rr * Math.cos(a)).toFixed(1)}" cy="${(80 + rr * Math.sin(a)).toFixed(1)}" r="6.5" fill="#6D55D1" stroke="#fff" stroke-width="2.5"/>`; });
  return `<svg class="m2target" viewBox="0 0 160 160" role="img" aria-label="target with ${hits.length} beanbags">${s}</svg>`;
}
S('add3', 1, 'Adding three numbers', '🎯', [
  ['To add three numbers, add two first. Then add the third.', () => '<span class="m2eq">2 + 3 + 4<br>5 + 4 = 9</span>'],
  ['Look for two numbers that make 10. 7 + 5 + 3: 7 + 3 = 10, then 10 + 5 = 15.', () => '<span class="m2eq">7 + 3 = 10</span>'],
  ['Doubles help too: 4 + 4 + 5 = 8 + 5 = 13.', () => '']
], L => {
  let a, b, c, steps, visual = '', speak;
  if (L === 1) { a = rnd(1, 3); b = rnd(1, 3); c = rnd(1, 3); const [e] = pick(THINGS); visual = `${objs(a, e)}<span class="op">+</span>${objs(b, e)}<span class="op">+</span>${objs(c, e)}`; }
  else if (L === 2) { const x = rnd(1, 9); [a, b, c] = shuffle([x, 10 - x, rnd(1, 9)]); }
  else if (L === 3) { a = rnd(1, 6); b = rnd(1, 6); c = rnd(1, 6); visual = dice(a, b, c); speak = 'Add the dots on all three dice. How many altogether?'; }
  else if (L === 4) { a = rnd(2, 9); b = Math.random() < 0.5 ? a : rnd(2, 9); c = rnd(2, 9); [a, b, c] = shuffle([a, b, c]); }
  else if (Math.random() < 0.5) {
    const hits = Array.from({ length: 3 }, () => pick([1, 2, 5, 10])), tot = hits.reduce((x, y) => x + y, 0), sorted = hits.slice().sort((x, y) => y - x);
    return Q({ prompt: 'Three beanbags hit the target. What is the score?', speak: 'Three beanbags landed on the target. Read the number on each ring. What is the total score?', visual: P(target(hits), 'sm'), choices: nOpts(tot, 3, 30, 4, [tot + 1, tot - 5, tot + 5]), answer: tot,
      steps: [`The beanbags are on ${hits.join(', ')}.`, `Start with the biggest: ${sorted[0]} + ${sorted[1]} = ${sorted[0] + sorted[1]}.`, `${sorted[0] + sorted[1]} + ${sorted[2]} = ${tot}.`], explainText: `The score is ${tot}.` });
  } else { a = rnd(1, 4) * 10; b = rnd(1, 4) * 10; c = rnd(1, 9); }
  const s = a + b + c, pair = [[a, b, c], [a, c, b], [b, c, a]].find(([x, y]) => x + y === 10) || (a === b ? [a, b, c] : null);
  steps = pair ? [`${pair[0]} + ${pair[1]} = ${pair[0] + pair[1]}${pair[0] + pair[1] === 10 ? ' (a ten!)' : ' (a double!)'}.`, `${pair[0] + pair[1]} + ${pair[2]} = ${s}.`] : [`${a} + ${b} = ${a + b}.`, `${a + b} + ${c} = ${s}.`];
  return Q({ prompt: `${a} + ${b} + ${c} = ?`, speak: speak || `What is ${a} plus ${b} plus ${c}?`, visual, choices: nOpts(s, 1, 100, L === 1 ? 3 : 4, [a + b, b + c, s + 10]), answer: s, steps, explainText: `So ${a} + ${b} + ${c} = ${s}.` });
});

const SYM = { lt: ['&lt;', 'less than'], gt: ['&gt;', 'greater than'], eq: ['=', 'equal to'] };
const symCh = () => ['lt', 'gt', 'eq'].map(k => C(k, `<span class="m2sign">${SYM[k][0]}</span>`, SYM[k][1]));
const rel = (x, y) => x < y ? 'lt' : x > y ? 'gt' : 'eq';
S('compsym', 1, 'Greater, less, equal', '🐊', [
  ['The hungry crocodile always opens its mouth to the bigger number.', () => '<span class="bignum">9 &gt; 4</span>'],
  ['&gt; means greater than. &lt; means less than. = means equal, the same.', () => '<span class="bignum">3 &lt; 8 &nbsp; 5 = 5</span>'],
  ['For sums, work out each side first. 4 + 3 = 7, so 4 + 3 &lt; 9.', () => '']
], L => {
  let A, B, va, vb, visual = '';
  if (L === 1) { va = rnd(1, 10); do vb = rnd(1, 10); while (vb === va); A = va; B = vb; const [e] = pick(THINGS); visual = ROW(objs(va, e), objs(vb, e)); }
  else if (L === 2) { va = rnd(1, 50); vb = Math.random() < 0.2 ? va : rnd(1, 50); A = va; B = vb; }
  else if (L === 3) { if (Math.random() < 0.4) { const x = rnd(1, 9); let y; do y = rnd(1, 9); while (y === x); va = 10 * x + y; vb = 10 * y + x; } else { va = rnd(10, 99); vb = Math.random() < 0.2 ? va : rnd(10, 99); } A = va; B = vb; }
  else if (L === 4) { const x = rnd(1, 9), y = rnd(1, 9), sub = Math.random() < 0.3 && x !== y; va = sub ? Math.abs(x - y) : x + y; A = sub ? `${Math.max(x, y)} − ${Math.min(x, y)}` : `${x} + ${y}`; vb = Math.max(0, va + pick([-2, -1, 0, 0, 1, 2])); B = vb; if (Math.random() < 0.5) { [A, B] = [B, A]; [va, vb] = [vb, va]; } }
  else { const x = rnd(2, 9), y = rnd(2, 9); va = x + y; A = `${x} + ${y}`; if (Math.random() < 0.4) { const k = pick([-1, 1]); const p = x + k, q = y - k; vb = p + q; B = `${p} + ${q}`; } else { const p = rnd(2, 9), q = rnd(2, 9); vb = p + q; B = `${p} + ${q}`; } }
  const ans = rel(va, vb), word = SYM[ans][1], exprs = typeof A === 'string' || typeof B === 'string';
  return Q({ prompt: 'Which sign goes in the box?', speak: `Is ${SPEAK_EQ(A)} greater than, less than, or equal to ${SPEAK_EQ(B)}?`, visual: `<div class="m2cmp"><span>${A}</span><span class="m2box"></span><span>${B}</span></div>${visual}`, choices: symCh(), answer: ans,
    explainText: `${exprs ? `${A} is ${va} and ${B} is ${vb}. ` : ''}${ans === 'eq' ? `Both are ${va}, so they are equal: =.` : `${Math.max(va, vb)} is bigger than ${Math.min(va, vb)}. The crocodile mouth opens to the bigger side, so it is ${word}: ${SYM[ans][0]}.`}` });
});

function chart100({ q = -1, marks = {}, show = () => true } = {}) {
  const z = 30; let s = '';
  for (let i = 1; i <= 100; i++) {
    const x = ((i - 1) % 10) * z + 2, y = Math.floor((i - 1) / 10) * z + 2;
    s += `<rect x="${x}" y="${y}" width="${z}" height="${z}" fill="${i === q ? '#FFF1CC' : marks[i] || '#fff'}" stroke="#9FB3C8" stroke-width="1"/>`;
    if (i === q) s += `<text x="${x + z / 2}" y="${y + 21}" font-size="18" font-weight="800" text-anchor="middle" fill="#F2604F">?</text>`;
    else if (show(i)) s += `<text x="${x + z / 2}" y="${y + 19}" font-size="11.5" font-weight="700" text-anchor="middle" fill="#22305A">${i}</text>`;
  }
  return `<svg class="m2hund" viewBox="0 0 304 304" role="img" aria-label="hundred chart">${s}</svg>`;
}
const plusWin = (n, q) => { const cell = (v, k) => `<span class="${k === q ? 'q' : ''}">${k === q ? '?' : v}</span>`; return `<div class="m2win"><i></i>${cell(n - 10, 'up')}<i></i>${cell(n - 1, 'left')}${cell(n, 'mid')}${cell(n + 1, 'right')}<i></i>${cell(n + 10, 'down')}<i></i></div>`; };
S('hundred', 1, 'Hundred chart', '💯', [
  ['The hundred chart has 1 to 100 in rows of 10.', () => P(chart100(), 'chart')],
  ['Going right adds 1. Going down a row adds 10.', () => plusWin(45, '')],
  ['Going left takes away 1. Going up a row takes away 10.', () => '']
], L => {
  if (L === 1) {
    const s = rnd(1, 46), arr = Array.from({ length: 5 }, (_, i) => s + i), qi = rnd(0, 4), ans = arr[qi];
    return Q({ prompt: 'What number is missing?', speak: 'This is part of a row on the hundred chart. What number is missing?', visual: track(arr.map((v, i) => i === qi ? '?' : v)), choices: nOpts(ans, 1, 60, 3, [ans + 10, ans + 2]), answer: ans, explain: track(arr, qi), explainText: `Going right adds 1 each time: ${arr.join(', ')}.` });
  }
  if (L === 2) {
    let n; do n = rnd(12, 89); while (n % 10 === 0 || n % 10 === 1);
    const q = pick(['up', 'down', 'left', 'right', 'mid']), ans = { up: n - 10, down: n + 10, left: n - 1, right: n + 1, mid: n }[q];
    return Q({ prompt: 'What number is hiding?', speak: 'This is a piece of the hundred chart. What number is hiding under the question mark?', visual: plusWin(n, q), choices: nOpts(ans, 1, 100, 4, [ans + 1, ans - 1, ans + 10, ans - 10].filter(v => v !== ans)), answer: ans, explain: plusWin(n, ''),
      explainText: q === 'up' ? `Up one row is 10 less: ${n} − 10 = ${ans}.` : q === 'down' ? `Down one row is 10 more: ${n} + 10 = ${ans}.` : q === 'left' ? `Left is 1 less: ${ans}.` : q === 'right' ? `Right is 1 more: ${ans}.` : `It is 1 more than ${n - 1}, and 10 more than ${n - 10}: ${ans}.` });
  }
  if (L === 3) {
    let qn; do qn = rnd(12, 99); while (qn % 10 === 1 || qn <= 10);
    return Q({ prompt: 'What number goes in the yellow square?', speak: 'Only some numbers are written. What number goes in the square with the question mark?', visual: P(chart100({ q: qn, show: i => i <= 10 || i % 10 === 1 }), 'chart'), choices: nOpts(qn, 1, 100, 4, [qn + 10, qn - 10, qn + 1]), answer: qn,
      explainText: `Its row starts with ${qn - (qn - 1) % 10}, and it is in the column under ${(qn - 1) % 10 + 1}. So it is ${qn}.` });
  }
  if (L === 4) {
    const by = pick([2, 5, 10]), k = rnd(3, by === 10 ? 6 : by === 5 ? 8 : 12), marks = {};
    for (let i = 1; i <= k; i++) marks[by * i] = '#BFE5CF';
    const next = by * (k + 1);
    return Q({ prompt: `The green squares count by ${by}s. What is the next green number?`, visual: P(chart100({ marks }), 'chart'), choices: nOpts(next, 1, 100, 4, [next - 1, next + 1, next + by, by * k + 1]), answer: next,
      explainText: `Counting by ${by}s: ${Array.from({ length: Math.min(k, 6) }, (_, i) => by * (k - Math.min(k, 6) + i + 1)).join(', ')}, and next is ${next}.` });
  }
  let s, dr, dc;
  do { s = rnd(1, 100); dr = pick([-2, -1, 1, 2, 3]); dc = pick([-3, -2, -1, 1, 2, 3]); } while (s + 10 * dr < 1 || s + 10 * dr > 100 || (s - 1) % 10 + dc < 0 || (s - 1) % 10 + dc > 9);
  const ans = s + 10 * dr + dc, mv = `${Math.abs(dr)} row${Math.abs(dr) > 1 ? 's' : ''} ${dr > 0 ? 'down' : 'up'} and ${Math.abs(dc)} ${dc > 0 ? 'right' : 'left'}`;
  return Q({ prompt: `Start at ${s}. Go ${mv}. Where are you?`, visual: P(chart100({ marks: { [s]: '#FFC23D' } }), 'chart'), choices: nOpts(ans, 1, 100, 4, [s + dr + 10 * dc, s + 10 * dr - dc, s - 10 * dr + dc].filter(v => v !== ans)), answer: ans,
    steps: [`${Math.abs(dr)} row${Math.abs(dr) > 1 ? 's' : ''} ${dr > 0 ? 'down adds' : 'up takes away'} ${10 * Math.abs(dr)}: ${s + 10 * dr}.`, `${Math.abs(dc)} ${dc > 0 ? 'right adds' : 'left takes away'} ${Math.abs(dc)}: ${ans}.`], explainText: `You end on ${ans}.` });
});
})();
