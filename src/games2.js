/* ---------- games2: seven more math games, sharing the round engine in games.js ---------- */
// Gone Fishing, Pizza Party, Feed the Animals, Rocket Countdown, Target Practice, Bee Hive Pairs, Treasure Map.
// Everything lives inside this function so its names never clash with the rest of the app.
(() => {
const FRAC_W = { 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['quarter', 'quarters'], 5: ['fifth', 'fifths'], 6: ['sixth', 'sixths'], 8: ['eighth', 'eighths'], 10: ['tenth', 'tenths'], 12: ['twelfth', 'twelfths'] };
const fw = (n, d) => `${n} ${(FRAC_W[d] || [d + 'th', d + 'ths'])[n === 1 ? 0 : 1]}`;
const mn = v => (v < 0 ? '−' : '') + Math.abs(v);          // a real minus sign, read aloud as "minus"
const okA = c => c ? ' data-ok="1"' : '';
const vals = cs => cs.map(c => c.val);
const range = (a, b, s = 1) => { const o = []; for (let v = a; v <= b; v += s) o.push(v); return o; };

GAMES.push(
  { id: 'fish', ico: '🎣', name: 'Gone Fishing', blurb: 'Catch the right fish', bg: '#1E88B8', pe: '🐟', n: 8, q: fishQ },
  { id: 'pizza', ico: '🍕', name: 'Pizza Party', blurb: () => ageLvl() >= 3 ? 'Slice up fractions' : 'Share it fairly', bg: '#C8553D', pe: '🍕', n: 8, q: pizzaQ },
  { id: 'feed', ico: '🥕', name: 'Feed the Animals', blurb: () => ageLvl() >= 3 ? 'Groups and times' : 'Give everyone the same', bg: '#4E9A2F', pe: '🥕', n: 8, q: feedQ },
  { id: 'rocket', ico: '🚀', name: 'Rocket Countdown', blurb: '3, 2, 1... blast off!', bg: '#3B2E7E', pe: '🌟', n: 8, q: rocketQ },
  { id: 'target', ico: '🎯', name: 'Target Practice', blurb: 'Which is bigger?', bg: '#D94A6A', pe: '🎯', n: 10, q: targetQ },
  { id: 'bee', ico: '🐝', name: 'Bee Hive Pairs', blurb: 'Two that make the number', bg: 'var(--sun)', ink: 1, pe: '🍯', n: 8, q: beeQ },
  { id: 'map', ico: '🏝️', name: 'Treasure Map', blurb: () => ageLvl() >= 4 ? 'Find (x, y)' : 'Follow the steps', bg: '#0F8F84', pe: '💰', n: 8, q: mapQ }
);

/* ---------- 8. Gone Fishing: fish swim back and forth, catch the one that fits ---------- */
function fishMake(d) {
  const n = [3, 4, 5, 5, 5, 5, 5][d], r = Math.random();
  const rule = (q, speak, ok, lo, hi, hint) => {
    const pool = range(lo, hi), good = shuffle(pool.filter(ok)), bad = shuffle(pool.filter(v => !ok(v)));
    return { q, speak, ok, hint, ans: good[0], nums: shuffle([good[0], ...bad.slice(0, n - 1)]) };
  };
  const find = a => ({ q: `Catch the <b class="gnum">${a}</b>!`, speak: `Catch the fish with the number ${a}!`, ans: a, ok: v => v === a, hint: `Look for the number ${a}.`, nums: vals(nearBy(a, [1, -1, 2, -2, 3], 1, 20, n)) });
  const sum = a => a.find ? find(a.ans) : { q: `Catch <span class="gnum gexpr">${a.q}</span>`, speak: `What is ${a.q}? Catch the fish with the answer!`, ans: a.ans, ok: v => v === a.ans, hint: a.hint, nums: vals(nearBy(a.ans, [1, -1, 2, -2, 10, -10, 5], 0, 2000, n)) };
  const big = (k, hi, small) => rule(`Catch a number <b class="gnum">${small ? 'smaller' : 'bigger'} than ${k}</b>`, `Catch the fish with a number ${small ? 'smaller' : 'bigger'} than ${k}!`,
    small ? v => v < k : v => v > k, 1, hi, small ? `Smaller than ${k} means it comes before ${k} when you count.` : `Bigger than ${k} means it comes after ${k} when you count.`);
  const evenOdd = (hi, odd) => rule(`Catch an <b class="gnum">${odd ? 'odd' : 'even'}</b> number`, `Catch the fish with an ${odd ? 'odd' : 'even'} number!`, odd ? v => v % 2 === 1 : v => v % 2 === 0, 1, hi,
    odd ? 'Odd numbers end in 1, 3, 5, 7 or 9.' : 'Even numbers end in 0, 2, 4, 6 or 8. They split into pairs.');
  if (d === 0) { const a = rnd(1, 5); return r < .5 ? find(a) : { q: `Catch this many! ${mdots(a)}`, speak: 'Count the dots. Then catch the fish with that number!', ans: a, ok: v => v === a, hint: 'Touch each dot and count.', nums: vals(nearBy(a, [1, -1, 2, -2], 1, 6, n)) }; }
  if (d === 1) return r < .3 ? find(rnd(1, 10)) : r < .55 ? big(rnd(3, 7), 10) : r < .7 ? big(rnd(4, 8), 10, true) : sum(gArith(1));
  if (d === 2) return r < .6 ? sum(gArith(2)) : r < .8 ? big(rnd(8, 15), 20, Math.random() < .4) : evenOdd(12);
  if (d === 3) {
    if (r < .55) return sum(gArith(3));
    if (r < .75) return evenOdd(20, Math.random() < .5);
    const lo = rnd(5, 14);
    return rule(`Catch a number <b class="gnum">between ${lo} and ${lo + 4}</b>`, `Catch the fish with a number between ${lo} and ${lo + 4}!`, v => v > lo && v < lo + 4, Math.max(1, lo - 6), lo + 10, `Count from ${lo} to ${lo + 4}. Which numbers are in the middle?`);
  }
  if (d === 4) {
    if (r < .5) return sum(gArith(4));
    if (r < .75) { const m = pick([2, 5, 10]); return rule(`Catch a number you say <b class="gnum">counting in ${m}s</b>`, `Catch the fish with a number you say when you count in ${m}s!`, v => v % m === 0, 11, 60, `Count in ${m}s: ${m}, ${2 * m}, ${3 * m}, ${4 * m}...`); }
    const t = rnd(2, 9); return rule(`Catch a number with <b class="gnum">${t} tens</b>`, `Catch the fish with a number that has ${t} tens!`, v => Math.floor(v / 10) === t, 10, 99, `${t} tens means the first digit is ${t}.`);
  }
  if (d === 5) {
    if (r < .5) return sum(gArith(5));
    if (r < .75) { const m = pick([3, 4, 6, 7, 8, 9]); return rule(`Catch a <b class="gnum">multiple of ${m}</b>`, `Catch the fish with a multiple of ${m}!`, v => v % m === 0, 10, 60, `A multiple of ${m} is in the ${m} times table.`); }
    const t = rnd(3, 9) * 10; return rule(`Catch a number that rounds to <b class="gnum">${t}</b>`, `Catch the fish with a number that rounds to ${t}, to the nearest ten!`, v => Math.round(v / 10) * 10 === t, t - 25, t + 25, 'Look at the ones digit. 5 or more rounds up, 4 or less rounds down.');
  }
  if (r < .45) return sum(gArith(6));
  if (r < .65) return rule('Catch a <b class="gnum">prime number</b>', 'Catch the fish with a prime number!', v => range(2, v - 1).every(k => v % k), 2, 50, 'A prime number can only be divided by 1 and itself.');
  if (r < .8) return rule('Catch a <b class="gnum">square number</b>', 'Catch the fish with a square number!', v => Number.isInteger(Math.sqrt(v)), 2, 100, 'A square number is a number times itself, like 7 × 7 = 49.');
  const N = pick([24, 36, 48, 60, 72]);
  return rule(`Catch a <b class="gnum">factor of ${N}</b>`, `Catch the fish with a factor of ${N}!`, v => N % v === 0, 2, N - 1, `A factor of ${N} divides it with nothing left over.`);
}
function fishQ(d) {
  const f = fishMake(d), kinds = shuffle(['🐟', '🐠', '🐡', '🐟', '🐠']), lap = [17, 15, 13, 12, 11, 10, 10][d];
  gFrame(`<div class="pond2"><span class="frod" aria-hidden="true">🎣</span>${f.nums.map((v, i) => { const s = lap + rnd(-2, 2);
      return `<div class="flane"><button class="fish gopt" data-v="${v}"${okA(f.ok(v))} aria-label="fish ${v}" style="--s:${s}s;--dl:-${(Math.random() * s).toFixed(2)}s;--x:${((i * 37) % 100) / 100}"><span class="fb">${kinds[i]}</span><b>${v}</b></button></div>`; }).join('')}
      <span class="fweed w1" aria-hidden="true">🌿</span><span class="fweed w2" aria-hidden="true">🪸</span></div>`, f.q, f.speak);
  const okF = $('.fish[data-ok]');
  view.querySelectorAll('.fish').forEach(b => b.onclick = () => {
    if (gm.lock || b.classList.contains('no')) return;
    if (f.ok(+b.dataset.v)) { b.style.left = getComputedStyle(b).left; b.classList.add('caught'); tone([660, 990, 1320], .07); gameRight(null, 1300, pick(['Got it! 🐟', 'What a catch!', 'Splash! You got it!'])); return; }
    b.classList.add('no'); gameMiss(null, `That fish has ${b.dataset.v}. ${f.hint}`);
    if (gm.tries >= 2) okF.classList.add('hint');
  });
}

/* ---------- 9. Pizza Party: share slices fairly, then make and name fractions ---------- */
function fracOpts(n, den, extra = []) {
  const ans = [n, den], seen = new Set([n / den]), out = [ans];
  for (const [a, b] of shuffle([[den - n, den], [n + 1, den], [n - 1, den], [n, den * 2], ...extra]))
    if (out.length < 4 && a >= 1 && b >= 2 && a <= b && !seen.has(a / b)) { seen.add(a / b); out.push([a, b]); }
  return shuffle(out).map(([a, b]) => ({ html: frac(a, b), val: `${a}/${b}`, label: fw(a, b) }));
}
function pizzaMake(d) {
  const r = Math.random();
  const share = (fMax, eMax) => { const f = rnd(2, fMax), e = rnd(1, Math.min(eMax, Math.floor(12 / f))); return { mode: 'share', f, e, den: f * e, ans: e, choices: nearBy(e, [1, -1, 2], 1, 12, 3) }; };
  const make = (dts, maxMul) => { const dt = pick(dts), n = rnd(1, dt - 1), m = rnd(1, Math.max(1, Math.min(maxMul, Math.floor(12 / dt)))); return { mode: 'make', dt, n, den: dt * m, need: n * m }; };
  const left = dens => { const den = pick(dens), k = rnd(1, den - 1); return { mode: 'left', den, k, ans: `${den - k}/${den}`, choices: fracOpts(den - k, den) }; };
  const add = dens => { const den = pick(dens), a = rnd(1, den - 2), b = rnd(1, den - 1 - a); return { mode: 'add', den, a, b, ans: `${a + b}/${den}`, choices: fracOpts(a + b, den, [[a + b, den * 2]]) }; };
  if (d === 0) return share(2, 3);
  if (d === 1) return share(3, 3);
  if (d === 2) return r < .7 ? share(4, 3) : make([2], 2);
  if (d === 3) return r < .3 ? share(4, 4) : make([2, 3, 4], 1);
  if (d === 4) return r < .6 ? make([2, 3, 4, 6, 8], 3) : left([4, 6, 8]);
  if (d === 5) return r < .35 ? left([4, 5, 6, 8, 10, 12]) : r < .65 ? add([4, 5, 6, 8]) : make([3, 4, 5, 6], 2);
  if (r < .4) { const dt = pick([2, 3, 4, 6]), N = dt * rnd(2, Math.floor(12 / dt)), n = rnd(1, dt - 1), ans = N / dt * n; return { mode: 'of', dt, n, den: N, ans, choices: nearBy(ans, [1, -1, N / dt, -N / dt, 2], 1, N, 4) }; }
  return r < .7 ? add([5, 6, 8, 10, 12]) : make([2, 3, 4, 6], 4);
}
const PIZ = (a, r) => `${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`;
function pizzaInner(den, stt) {
  let s = '<circle cx="50" cy="50" r="49.5" fill="#fff" stroke="#CCDBE6" stroke-width="1.5"/>';
  for (let i = 0; i < den; i++) {
    const a0 = i / den * 2 * Math.PI - Math.PI / 2, a1 = (i + 1) / den * 2 * Math.PI - Math.PI / 2, am = (a0 + a1) / 2, w = a1 - a0;
    const wedge = rr => `M50 50 L${PIZ(a0, rr)} A${rr} ${rr} 0 0 1 ${PIZ(a1, rr)} Z`;
    if (stt[i] < 0) { s += `<path class="pz gone" data-i="${i}" d="${wedge(44)}" fill="#F6EBD6" stroke="#E2CFA8" stroke-width="1.2" stroke-dasharray="3 3"/>`; continue; }
    const spots = den <= 2 ? [[22, am - w / 4], [22, am + w / 4], [33, am]] : den <= 4 ? [[18, am], [32, am - w / 5], [32, am + w / 5]] : den <= 6 ? [[17, am], [31, am]] : [[29, am]];
    const pep = stt[i] > 0 ? spots.map(([rr, a]) => `<circle cx="${(50 + rr * Math.cos(a)).toFixed(1)}" cy="${(50 + rr * Math.sin(a)).toFixed(1)}" r="${den > 8 ? 4.6 : 6}" fill="#D9442F" stroke="#A82E1F" stroke-width="1"/>`).join('') : '';
    s += `<g class="pz${stt[i] > 0 ? ' on' : ''}" data-i="${i}"><path d="${wedge(45)}" fill="#E9A23B" stroke="#9C5E14" stroke-width="1.4"/><path d="${wedge(38.5)}" fill="#FFD45C" stroke="#E8B53A" stroke-width=".8"/>${pep}</g>`;
  }
  return s;
}
const pizzaSVG = (den, stt, id = '') => `<svg class="pizza"${id ? ` id="${id}"` : ''} viewBox="-1 -1 102 102" role="img" aria-label="pizza cut into ${den} slices">${pizzaInner(den, stt)}</svg>`;
function pizzaQ(d) {
  const p = pizzaMake(d), FR = shuffle(['🐻', '🐰', '🐱', '🐶', '🦊', '🐼']);
  let stt, body, prompt, speak, hint;
  // Tapping slices is a helper everywhere: in "share" they move to the plates, otherwise they toggle pepperoni.
  if (p.mode === 'share') {
    stt = Array(p.den).fill(1);
    body = `<div class="pzrow"><div class="pzwrap">${pizzaSVG(p.den, stt, 'pzz')}</div><div class="pplates">${Array.from({ length: p.f }, (_, k) =>
      `<div class="pplate"><span class="pwho">${FR[k]}</span><span class="ppile" id="pl${k}"></span></div>`).join('')}</div></div>${choicesHTML(p.choices, p.ans)}`;
    prompt = `<b>${p.den}</b> slices, <b>${p.f}</b> friends. How many <b class="gnum">each</b>?`;
    speak = `There are ${p.den} slices of pizza and ${p.f} hungry friends. Tap the slices to share them out fairly. How many slices does each friend get?`;
    hint = 'Tap the pizza to give out the slices one at a time. Then count one plate.';
  } else if (p.mode === 'make') {
    stt = Array(p.den).fill(0);
    body = `<div class="pzwrap" data-need="${p.need}">${pizzaSVG(p.den, stt, 'pzz')}</div><div class="pzbar"><b id="pzc">0 of ${p.den} slices</b><button class="btn leaf serve" id="serve">Serve 🍽️</button></div>`;
    prompt = `Put pepperoni on <span class="gnum">${frac(p.n, p.dt)}</span> of the pizza!`;
    speak = `This pizza has ${p.den} slices. Put pepperoni on ${fw(p.n, p.dt)} of the pizza. Tap the slices, then tap Serve!`;
  } else if (p.mode === 'left') {
    stt = Array(p.den).fill(1); shuffle(range(0, p.den - 1)).slice(0, p.k).forEach(i => stt[i] = -1);
    body = `<div class="pzwrap">${pizzaSVG(p.den, stt, 'pzz')}<span class="muncher" aria-hidden="true">🦉</span></div>${choicesHTML(p.choices, p.ans)}`;
    prompt = `Owl ate <b>${p.k}</b> of the ${p.den} slices. What fraction is <b class="gnum">left</b>?`;
    speak = `The pizza had ${p.den} slices. Owl ate ${p.k}. What fraction of the pizza is left?`;
    hint = `Count the slices that are left. The bottom number is how many slices the whole pizza had: ${p.den}.`;
  } else if (p.mode === 'add') {
    const A = range(0, p.den - 1).map(i => i < p.a ? 1 : 0), B = range(0, p.den - 1).map(i => i < p.b ? 1 : 0);
    body = `<div class="pzrow two"><div class="pzwrap sm">${pizzaSVG(p.den, A)}</div><b class="pplus">+</b><div class="pzwrap sm">${pizzaSVG(p.den, B)}</div></div>${choicesHTML(p.choices, p.ans)}`;
    prompt = `<span class="gexpr">${frac(p.a, p.den)} + ${frac(p.b, p.den)} = <span class="gnum">?</span></span>`;
    speak = `What is ${fw(p.a, p.den)} plus ${fw(p.b, p.den)}?`;
    hint = `The slices are the same size, so add the top numbers: ${p.a} + ${p.b}. The bottom number stays ${p.den}.`;
  } else {
    stt = Array(p.den).fill(0);
    body = `<div class="pzwrap">${pizzaSVG(p.den, stt, 'pzz')}</div>${choicesHTML(p.choices, p.ans)}`;
    prompt = `What is <span class="gnum">${frac(p.n, p.dt)}</span> of <b>${p.den}</b> slices?`;
    speak = `What is ${fw(p.n, p.dt)} of ${p.den} slices? You can tap slices to help.`;
    hint = `Split ${p.den} slices into ${p.dt} equal groups. How many in one group? Then take ${p.n} group${p.n > 1 ? 's' : ''}.`;
  }
  gFrame(body, prompt, speak);
  const svg = $('#pzz'); let dealt = 0;
  const draw = () => svg.innerHTML = pizzaInner(p.den, stt);
  const give = i => { stt[i] = -1; const k = dealt++ % p.f; $('#pl' + k).insertAdjacentHTML('beforeend', '<i>🍕</i>'); draw(); };
  if (svg) svg.onclick = e => {
    const g = e.target.closest('.pz'); if (!g || gm.lock) return; const i = +g.dataset.i;
    if (p.mode === 'share') { if (stt[i] > 0) { give(i); tone([500 + dealt * 30], .07); say(String(Math.ceil(dealt / p.f))); } return; }
    if (stt[i] < 0) return;
    stt[i] = stt[i] ? 0 : 1; draw(); tone([stt[i] ? 700 : 420], .06);
    const c = stt.filter(v => v > 0).length, cnt = $('#pzc'); if (cnt) cnt.textContent = `${c} of ${p.den} slices`;
  };
  if (p.mode !== 'make') return wireChoices(p.ans, hint, () => { if (p.mode === 'share') stt.forEach((v, i) => { if (v > 0) give(i); }); }, 1500);
  $('#serve').onclick = () => {
    if (gm.lock) return;
    const c = stt.filter(v => v > 0).length;
    if (c === p.need) return gameRight($('#serve'), 1500, pick(['Yum! Perfect pizza!', 'Order up! 🍕', 'Delicious!']));
    const per = p.den / p.dt;
    gameMiss($('.pzbar'), c === 0 ? `Tap some slices to put pepperoni on them first.` :
      gm.tries >= 1 ? `${frac(p.n, p.dt)}: the pizza is ${p.dt} equal parts${per > 1 ? ` of ${per} slices each` : ''}. Put pepperoni on ${p.need} slices.` :
      `You have ${c}. The bottom number ${p.dt} means ${p.dt} equal parts. The top number ${p.n} means ${p.n} of them.`, $('#serve'), c > p.need ? 'Too many!' : c ? 'Not enough!' : 'Tap the slices!');
  };
}

/* ---------- 10. Feed the Animals: equal groups, then times and sharing ---------- */
const CRIT = [['🐰', 'bunny', 'bunnies', '🥕', 'carrot', 'carrots'], ['🐴', 'horse', 'horses', '🍎', 'apple', 'apples'], ['🐵', 'monkey', 'monkeys', '🍌', 'banana', 'bananas'],
  ['🐿️', 'squirrel', 'squirrels', '🌰', 'acorn', 'acorns'], ['🐶', 'puppy', 'puppies', '🦴', 'bone', 'bones'], ['🐔', 'hen', 'hens', '🌽', 'corn cob', 'corn cobs'], ['🐼', 'panda', 'pandas', '🎋', 'bamboo stick', 'bamboo sticks']];
function feedMake(d) {
  const c = pick(CRIT), r = Math.random();
  if (d <= 2) { const g = d === 0 ? rnd(2, 3) : rnd(2, d === 1 ? 3 : 4), e = d === 0 ? rnd(1, 2) : rnd(d === 1 ? 1 : 2, 3); return { mode: 'feed', c, g, e, ans: g * e, total: d === 2, choices: nearBy(g * e, [1, -1, 2, -2, e, -e], 1, 40, 3) }; }
  const mul = (g, e) => ({ mode: 'mul', c, g, e, ans: g * e, choices: nearBy(g * e, [g, -g, e, -e, 1, -1, 10], 1, 200, 4) });
  const div = (g, e) => ({ mode: 'div', c, g, e, T: g * e, ans: e, choices: nearBy(e, [1, -1, 2, -2], 1, 20, 4) });
  if (d === 3) return r < .7 ? mul(rnd(2, 5), pick([2, 3, 4, 5, 10])) : div(rnd(2, 4), rnd(2, 4));
  if (d === 4) return r < .6 ? mul(rnd(2, 10), pick([2, 3, 4, 5, 10])) : div(rnd(2, 5), rnd(2, 5));
  if (d === 5) return r < .5 ? mul(rnd(2, 10), rnd(2, 10)) : div(rnd(2, 10), rnd(2, 10));
  if (r < .35) return mul(rnd(3, 12), rnd(3, 12));
  if (r < .65) return div(rnd(3, 12), rnd(3, 12));
  const g = rnd(3, 9), e = rnd(2, 9), L = rnd(1, g - 1), ans = `${e} r ${L}`;
  const ch = [[e, L], [e + 1, L], [e - 1, L], [e, L === 1 ? 2 : L - 1]];
  return { mode: 'rem', c, g, e, L, T: g * e + L, ans, choices: shuffle(ch).map(([a, b]) => ({ html: `${a}<small>r</small>${b}`, val: `${a} r ${b}`, label: `${a} each, ${b} left over` })) };
}
const plateHTML = (n, food) => n <= 10 ? `<span class="ffd n${Math.min(n, 10)}">${food.repeat(n)}</span>` : `<span class="ffd big"><b>${n}</b>${food}</span>`;
function feedQ(d) {
  const p = feedMake(d), [ce, one, many, food, f1, fN] = p.c, fe = n => n === 1 ? f1 : fN;
  const farm = (inner, cls = '') => `<div class="ffarm ${cls}" style="--g:${p.g}">${inner}</div>`;
  if (p.mode === 'feed') {
    const fed = Array(p.g).fill(0); let phase2 = false;
    gFrame(farm(range(0, p.g - 1).map(k => `<button class="fcritter gopt" data-k="${k}" data-ok="1" aria-label="${one} ${k + 1}"><span class="fce">${ce}</span><span class="fdish" id="fp${k}"></span></button>`).join(''), 'big') + '<div id="feedq" class="feedq"></div>',
      `Give each ${one} <b class="gnum">${p.e}</b> <span class="fneed">${food.repeat(p.e)}</span>`, `Give each ${one} ${p.e} ${fe(p.e)}. Tap an animal to give it one.`);
    view.querySelectorAll('.fcritter').forEach(b => b.onclick = () => {
      if (gm.lock || phase2) return; const k = +b.dataset.k;
      if (fed[k] >= p.e) { gameMiss(b, `This ${one} already has ${p.e}. Feed a hungry one!`, view.querySelector('.fcritter[data-ok]'), 'I am full!'); b.classList.remove('no'); return; }
      fed[k]++; $('#fp' + k).innerHTML = plateHTML(fed[k], food); tone([520 + fed[k] * 90], .07); say(String(fed[k]));
      if (fed[k] === p.e) { b.removeAttribute('data-ok'); b.classList.remove('hint'); b.classList.add('full'); const nx = view.querySelector('.fcritter[data-ok]'); if (nx && gm.tries >= 2) nx.classList.add('hint'); }
      if (fed.some(v => v < p.e)) return;
      if (!p.total) return gameRight(null, 1400, `Yum! Every ${one} has ${p.e}!`);
      phase2 = true; $('.ptext').innerHTML = `How many ${fN} <b class="gnum">altogether</b>?`;
      $('#feedq').innerHTML = choicesHTML(p.choices, p.ans); say(`Yum! Now, how many ${fN} altogether?`);
      wireChoices(p.ans, `Count all the ${fN}: ${range(1, p.g).map(k => k * p.e).join(', ')}.`, null, 1300);
    });
    return;
  }
  let body, prompt, speak, hint, deal = null;
  if (p.mode === 'mul') {
    body = farm(range(1, p.g).map(() => `<div class="fcritter"><span class="fce">${ce}</span><span class="fdish">${plateHTML(p.e, food)}</span></div>`).join(''));
    prompt = `${p.g} ${many}, <b>${p.e}</b> ${fe(p.e)} each. How many <b class="gnum">in all</b>?`;
    speak = `There are ${p.g} ${many}. Each one has ${p.e} ${fe(p.e)}. How many ${fN} in all?`;
    hint = `${p.g} groups of ${p.e}. Count in ${p.e}s: ${range(1, Math.min(p.g, 3)).map(k => k * p.e).join(', ')}...`;
  } else {
    const T = p.T, fedN = Array(p.g).fill(0);
    body = `<button class="pile2" id="pile" aria-label="${T} ${fN}. Tap to share one out"><b id="pileN">${T}</b>${food}</button>` + farm(range(0, p.g - 1).map(k => `<div class="fcritter"><span class="fce">${ce}</span><span class="fdish" id="fp${k}"></span></div>`).join(''));
    deal = () => { if (T <= 0) return; const k = fedN.reduce((a, b) => a + b, 0); if (k >= T) return; fedN[k % p.g]++; $('#fp' + (k % p.g)).innerHTML = plateHTML(fedN[k % p.g], food); $('#pileN').textContent = T - k - 1; tone([440 + (k % p.g) * 60], .06); };
    if (p.mode === 'div') {
      prompt = `Share <b>${T}</b> ${fN} with ${p.g} ${many}. How many <b class="gnum">each</b>?`;
      speak = `Share ${T} ${fN} fairly with ${p.g} ${many}. How many does each one get? Tap the pile to share them out.`;
      hint = `What times ${p.g} makes ${T}? You can tap the pile to share them out.`;
    } else {
      prompt = `Share <b>${T}</b> ${fN} with ${p.g} ${many}. How many each, and how many <b class="gnum">left over</b>?`;
      speak = `Share ${T} ${fN} fairly with ${p.g} ${many}. How many does each get, and how many are left over?`;
      hint = `Find the biggest number in the ${p.g} times table that fits in ${T}. Then what is left?`;
    }
  }
  gFrame(body + choicesHTML(p.choices, p.ans), prompt, speak);
  if (deal) $('#pile').onclick = () => { if (!gm.lock) deal(); };
  wireChoices(p.ans, hint, () => { if (deal) for (let k = 0; k < p.T; k++) deal(); }, 1500);
}

/* ---------- 11. Rocket Countdown: count back to blast off, or land the rocket on a number line ---------- */
function rocketMake(d, i = 0) {
  if (d === 0 || i % 2 === 0) {
    let step = 1, start, len = 6;
    if (d === 0) { start = rnd(3, 5); len = start; }
    else if (d === 1) { start = rnd(5, 10); len = start; }
    else if (d === 2) start = rnd(9, 20);
    else if (d === 3) { step = 2; start = rnd(12, 30); }
    else if (d === 4) { step = pick([5, 10]); start = step * rnd(6, step === 5 ? 20 : 10); }
    else if (d === 5) { step = pick([3, 4, 25]); start = step === 25 ? 25 * rnd(6, 12) : rnd(20, 50); }
    else { step = pick([6, 7, 8, 9, 11, 12]); start = rnd(10, 40); }
    const seq = range(0, len - 1).map(k => start - k * step), given = d >= 2;
    const dec = [...new Set(shuffle([start + 1, start + 2, start + step, ...seq.map(v => v + 1), ...seq.map(v => v - 1)]))].filter(v => !seq.includes(v) && (d === 6 || v >= 0)).slice(0, d <= 1 ? 2 : 3);
    return { mode: 'count', step, start, seq, given, pad: shuffle([...(given ? seq.slice(1) : seq), ...dec]) };
  }
  let a, b;
  if (d === 1) { a = rnd(3, 10); b = rnd(1, 3); }
  else if (d === 2) { a = rnd(4, 10); b = rnd(1, Math.min(6, a)); }
  else if (d === 3) { a = rnd(10, 20); b = rnd(2, 8); }
  else if (d === 4) { a = rnd(20, 99); b = rnd(3, 19); }
  else if (d === 5) { a = rnd(40, 150); b = rnd(11, Math.min(99, a - 5)); }
  else { a = rnd(-5, 12); b = Math.random() < .6 ? rnd(3, 8) : rnd(9, 15); }
  const ans = a - b;
  return { mode: 'sub', a, b, ans, lad: b <= 8, choices: nearBy(ans, [1, -1, 2, -2, 10, -10], d === 6 ? -60 : 0, 999, d <= 2 ? 3 : 4) };
}
function rocketQ(d) {
  const p = rocketMake(d, gm.i);
  if (p.mode === 'count') {
    const { seq, step, given } = p; let at = given ? 1 : 0;
    gFrame(`<div class="rspace"><div class="rlights" style="--n:${seq.length}">${seq.map((v, k) => `<i class="${given && !k ? 'lit' : ''}">${given && !k ? mn(v) : ''}</i>`).join('')}</div>
        <span class="rrocket" id="rk" aria-hidden="true">🚀<span class="rflame">🔥</span></span><span class="pad0" aria-hidden="true"></span></div>
      <div class="rnumpad">${p.pad.map(v => `<button class="nkey gopt" data-v="${v}"${okA(v === seq[at])}>${mn(v)}</button>`).join('')}</div>`,
      given ? `Count down${step > 1 ? ` by <b class="gnum">${step}s</b>` : ''} from <b>${mn(p.start)}</b>!` : `Count down from <b class="gnum">${p.start}</b>!`,
      `Count down from ${mn(p.start)}${step > 1 ? ` by ${step}s` : ''}. Tap the numbers in order!`);
    const lights = view.querySelectorAll('.rlights i');
    view.querySelectorAll('.nkey').forEach(b => b.onclick = () => {
      if (gm.lock || b.classList.contains('used') || b.classList.contains('no')) return;
      const v = +b.dataset.v;
      if (v !== seq[at]) {
        const prev = at ? seq[at - 1] : null;
        gameMiss(b, prev == null ? `Start with ${p.start}!` : step === 1 ? `What number comes just before ${mn(prev)}?` : `Take away ${step} from ${mn(prev)}.`, view.querySelector('.nkey[data-ok]'));
        if (seq.includes(v)) b.classList.remove('no');
        return;
      }
      b.classList.add('used'); b.classList.remove('hint'); b.removeAttribute('data-ok'); lights[at].classList.add('lit'); lights[at].textContent = mn(v); say(mn(v)); tone([300 + 60 * (seq.length - at)], .1); at++;
      if (at < seq.length) { const nx = view.querySelector(`.nkey[data-v="${seq[at]}"]`); nx.dataset.ok = '1'; if (gm.tries >= 2) nx.classList.add('hint'); return; }
      $('#rk').classList.add('go'); $('.rspace').classList.add('launch'); tone([262, 330, 392, 523, 784], .09);
      gameRight(null, 2000, 'Blast off! 🚀');
    });
    return;
  }
  const { a, b, ans } = p;
  const top = p.lad ? `<div class="rspace sub"><div class="rladder" id="lad">${range(ans - 1, a + 1).reverse().map(v => `<div class="rrung${v === 0 ? ' zero' : ''}" data-v="${v}"><span>${mn(v)}</span></div>`).join('')}</div>
      <span class="rrocket down" id="rk" aria-hidden="true">🚀</span><span class="rmoon" aria-hidden="true">🌍</span></div>`
    : `<div class="rspace eq"><span class="rrocket" aria-hidden="true">🚀</span><b class="reqn">${mn(a)} − ${b} = ?</b></div>`;
  gFrame(top + choicesHTML(p.choices, ans), p.lad ? `🚀 is at <b>${mn(a)}</b>. It flies down <b class="gnum">${b}</b>. Where does it land?` : `<span class="gexpr">${mn(a)} − ${b} = <span class="gnum">?</span></span>`,
    p.lad ? `The rocket is at ${mn(a)}. It flies down ${b}. Where does it land?` : `What is ${mn(a)} minus ${b}?`);
  const rk = $('#rk'), rung = v => view.querySelector(`.rrung[data-v="${v}"]`);
  const place = v => { const r = rung(v); if (r && rk) rk.style.top = r.offsetTop + r.offsetHeight / 2 + 'px'; };
  if (p.lad) { rk.style.transition = 'none'; place(a); void rk.offsetWidth; rk.style.transition = ''; }
  wireChoices(ans, `Start at ${mn(a)} and count back ${b}.`, () => {
    if (!p.lad) return;
    for (let j = 1; j <= b; j++) gLater(() => { place(a - j); tone([700 - j * 40], .06); }, j * 230);
    gLater(() => { const r = rung(ans); if (r) r.classList.add('land'); }, b * 230 + 150);
  }, p.lad ? b * 230 + 1100 : 1100);
}

/* ---------- 12. Target Practice: bigger, smaller, and < = > ---------- */
function targetMake(d) {
  const r = Math.random();
  const N = v => ({ v, h: mn(v), s: mn(v), k: v < 0 ? 'neg' : 'n' });
  const F = (a, b) => ({ v: a / b, h: frac(a, b), s: fw(a, b), k: 'f' });
  const D = (n, dp) => ({ v: n / 10 ** dp, h: (n / 10 ** dp).toFixed(dp), s: (n / 10 ** dp).toFixed(dp), k: 'dec' });
  const apart = it => it.every((x, i) => it.every((y, j) => i === j || Math.abs(x.v - y.v) > 1e-9));
  const pk = (gen, k, small) => { let it; for (let t = 0; t < 200; t++) { it = range(1, k).map(gen); if (apart(it)) break; } const vs = it.map(x => x.v), ans = vs.indexOf(small ? Math.min(...vs) : Math.max(...vs)); return { mode: 'pick', items: it, small, ans }; };
  const sg = (A, B) => ({ mode: 'sign', items: [A, B], ans: Math.abs(A.v - B.v) < 1e-9 ? 'eq' : A.v < B.v ? 'lt' : 'gt' });
  const coin = () => Math.random() < .5;
  if (d === 0) return pk(() => { const v = rnd(1, 5); return { v, h: mdots(v), s: `${v} dots`, k: 'dots' }; }, 2, false);
  if (d === 1) return pk(() => N(rnd(1, 10)), 2, r < .35);
  if (d === 2) { if (r < .6) return pk(() => N(rnd(1, 20)), r < .3 ? 3 : 2, coin()); const a = rnd(1, 20); return sg(N(a), N(Math.random() < .15 ? a : rnd(1, 20))); }
  if (d === 3) {
    if (r < .5) return pk(() => N(rnd(10, 100)), 3, coin());
    const a = rnd(12, 98), sw = a % 10 * 10 + Math.floor(a / 10), b = Math.random() < .3 && a % 10 ? sw : Math.random() < .1 ? a : clamp(a + pick([-1, 1]) * rnd(1, 15), 1, 100);
    return sg(N(a), N(b));
  }
  if (d === 4) {
    if (r < .4) { const h = rnd(1, 9) * 100; return pk(() => N(h + rnd(0, 99)), 3, coin()); }
    const x = rnd(2, 10), y = rnd(2, 10), mul = coin(), v = mul ? x * y : x + y, E = { v, h: `${x} ${mul ? '×' : '+'} ${y}`, s: `${x} ${mul ? 'times' : 'plus'} ${y}`, k: 'e' };
    const c = Math.max(1, v + pick([-2, -1, 0, 0, 1, 2]));
    return coin() ? sg(E, N(c)) : sg(N(c), E);
  }
  if (d === 5) {
    if (r < .45) return pk(() => coin() ? D(rnd(1, 9), 1) : D(rnd(1, 99), 2), 3, coin());
    if (r < .9) { const den = pick([3, 4, 5, 6, 8, 10]); if (coin()) return sg(F(rnd(1, den - 1), den), F(rnd(1, den - 1), den)); const n = rnd(1, 3); return sg(F(n, pick([2, 3, 4, 5])), F(n, pick([6, 8, 10]))); }
    return coin() ? sg(F(1, 2), D(5, 1)) : sg(D(pick([25, 75]), 2), F(pick([25, 75]) / 25, 4));
  }
  if (r < .35) return pk(() => N(rnd(-20, 20)), 3, coin());
  if (r < .7) { const A = pick([2, 3, 4, 5, 6, 8]), B = pick([2, 3, 4, 5, 6, 8]); return sg(F(rnd(1, A - 1), A), F(rnd(1, B - 1), B)); }
  const dn = pick([2, 4, 5, 10]), n = rnd(1, dn - 1), v = Math.round(n / dn * 100) + pick([-5, 0, 0, 5, 10]);
  return coin() ? sg(F(n, dn), D(clamp(v, 5, 95), 2)) : sg(D(clamp(v, 5, 95), 2), F(n, dn));
}
function targetHint(it, small) {
  const k = it[0].k;
  if (k === 'dots') return 'Count the dots on each target.';
  if (it.some(x => x.k === 'neg')) return 'With minus numbers, the one closer to zero is bigger.';
  if (it.some(x => x.k === 'dec') && it.some(x => x.k === 'f')) return 'Turn the fraction into a decimal: one half is 0.5, one quarter is 0.25.';
  if (it.some(x => x.k === 'dec')) return 'Line up the decimal points. Compare the tenths first, then the hundredths.';
  if (it.some(x => x.k === 'f')) return 'Picture the pizzas. More slices means smaller slices. Compare how much is shaded.';
  if (it.some(x => x.k === 'e')) return 'Work out the sum or times first, then compare.';
  return it.some(x => x.v >= 10) ? 'Compare the tens first. If they match, compare the ones.' : `Which comes ${small ? 'first' : 'later'} when you count?`;
}
function targetQ(d) {
  const p = targetMake(d), it = p.items, hint = targetHint(it, p.small);
  if (p.mode === 'pick') {
    const w = it[0].k === 'dots' ? 'more' : `${p.small ? 'small' : 'bigg'}${it.length > 2 ? 'est' : 'er'}`;
    gFrame(`<div class="trange"><div class="ttargets t${it.length}">${it.map((x, i) => `<button class="tgt gopt${x.k === 'dots' ? ' dots' : ''}" data-v="${i}"${okA(i === p.ans)} aria-label="${esc(x.s)}"><span class="tbull">${x.h}</span></button>`).join('')}</div>
        <span class="tbow" aria-hidden="true">🏹</span></div>`,
      it[0].k === 'dots' ? 'Which target has <b class="gnum">more</b> dots?' : `Hit the <b class="gnum">${w}</b> number!`,
      it[0].k === 'dots' ? 'Which target has more dots? Tap it!' : `Which is ${w}? ${it.map(x => x.s).join(', or ')}? Tap it!`);
    view.querySelectorAll('.tgt').forEach(b => b.onclick = () => {
      if (gm.lock || b.classList.contains('no')) return;
      if (+b.dataset.v === p.ans) { b.insertAdjacentHTML('beforeend', '<span class="tdart" aria-hidden="true">🏹</span>'); $('.tbow').classList.add('shot'); tone([1200, 900], .05); gameRight(b, 1200, pick(['Bullseye! 🎯', 'Right on target!', 'Great shot!'])); }
      else gameMiss(b, `${it[+b.dataset.v].s} is ${p.small ? 'not the smallest' : 'not the biggest'}. ${hint}`, $('.tgt[data-ok]'));
    });
    return;
  }
  const [A, B] = it, SIGN = { lt: '&lt;', eq: '=', gt: '&gt;' };
  gFrame(`<div class="tcmp"><span class="tcv">${A.h}</span><span class="tslot" id="slot">?</span><span class="tcv">${B.h}</span></div>
    ${choicesHTML([{ html: '&lt;', val: 'lt', label: 'less than' }, { html: '=', val: 'eq', label: 'equals' }, { html: '&gt;', val: 'gt', label: 'greater than' }], p.ans)}
    <p class="note gsign">🐊 The open mouth eats the bigger number.</p>`,
    'Which sign goes in the middle?', `${A.s}, and ${B.s}. Is the first one less than, equal to, or greater than the second?`);
  wireChoices(p.ans, v => v === 'eq' ? `They are not the same. ${hint}` : `${hint} The open mouth points at the bigger one.`, () => { const s = $('#slot'); s.innerHTML = SIGN[p.ans]; s.classList.add('got'); }, 1300);
}

/* ---------- 13. Bee Hive Pairs: tap two honeycombs that make the number ---------- */
function beeMake(d) {
  const r = Math.random(), k = d === 0 ? 4 : d <= 2 ? 7 : d <= 4 ? 8 : 10;
  let T, op = '+', sc = 1, unit = 1, lo = 1, hi;
  if (d === 0) { T = rnd(3, 5); hi = T + 2; }
  else if (d === 1) { T = rnd(5, 7); hi = T + 4; }
  else if (d === 2) { T = r < .7 ? 10 : rnd(6, 9); hi = T + 5; }
  else if (d === 3) { T = r < .4 ? 20 : rnd(11, 19); hi = T + 6; }
  else if (d === 4) { if (r < .5) { T = 100; unit = lo = 10; hi = 150; } else { T = rnd(20, 50); hi = T + 9; } }
  else if (d === 5) { if (r < .6) { T = 100; hi = 120; } else { T = 10; sc = 10; hi = 15; } }
  else if (r < .35) { T = 1000; unit = lo = 50; hi = 1200; }
  else if (r < .7) { op = '×'; T = pick([12, 18, 20, 24, 30, 36, 40, 48, 60]); lo = 2; hi = 15; }
  else { T = 100; sc = 100; unit = lo = 5; hi = 130; }
  const comb = (x, y) => op === '+' ? x + y : x * y, all = range(lo, hi, unit).filter(v => v !== T);
  const firsts = all.filter(a => { const b = op === '+' ? T - a : T / a; return b !== a && all.includes(b); });
  const a = pick(firsts), b = op === '+' ? T - a : T / a, out = [a, b];
  for (const v of shuffle(all)) if (out.length < k && !out.includes(v) && out.every(x => comb(x, v) !== T)) out.push(v);
  return { T, op, sc, a, b, nums: shuffle(out) };
}
const beeShow = (v, sc) => String(v / sc);
function beeQ(d) {
  const p = beeMake(d), S = v => beeShow(v, p.sc), rows = { 4: [1, 2, 1], 7: [2, 3, 2], 8: [3, 2, 3], 10: [3, 4, 3] }[p.nums.length];
  let j = 0;
  gFrame(`<div class="bhive">${rows.map(n => `<div class="bhrow">${range(1, n).map(() => { const v = p.nums[j++];
      return `<button class="bhex gopt" data-v="${v}"${okA(v === p.a || v === p.b)}><span>${S(v)}</span></button>`; }).join('')}</div>`).join('')}
      <span class="bee1" aria-hidden="true">🐝</span></div>`,
    p.op === '+' ? `Find two that make <b class="gnum">${S(p.T)}</b>` : `Find two that <b>multiply</b> to make <b class="gnum">${p.T}</b>`,
    p.op === '+' ? `Tap two honeycombs that add up to ${S(p.T)}.` : `Tap two honeycombs that multiply to make ${p.T}.`);
  let sel = null;
  view.querySelectorAll('.bhex').forEach(h => h.onclick = () => {
    if (gm.lock) return;
    if (!sel) { sel = h; h.classList.add('sel'); tone([600], .06); say(S(+h.dataset.v)); return; }
    if (sel === h) { h.classList.remove('sel'); sel = null; return; }
    const x = +sel.dataset.v, y = +h.dataset.v, first = sel; sel = null;
    if ((p.op === '+' ? x + y : x * y) === p.T) {
      first.classList.add('right'); h.classList.remove('sel'); h.classList.add('right'); first.classList.remove('sel');
      const bee = $('.bee1'); if (bee) { bee.style.left = h.offsetLeft + h.offsetWidth / 2 + 'px'; bee.style.top = h.offsetTop + 'px'; bee.classList.add('fly'); }
      return gameRight(null, 1400, `${S(x)} ${p.op} ${S(y)} = ${S(p.T)}! 🍯`);
    }
    first.classList.remove('sel');
    const ok1 = $('.bhex[data-ok]');
    gameMiss(h, p.op === '+' ? `${S(x)} and ${S(y)} make ${S(x + y)}. ${x + y > p.T ? 'Too much!' : 'Not enough!'} Pick one number, then find what adds on to make ${S(p.T)}.` : `${x} times ${y} is ${x * y}. What times ${x} makes ${p.T}?`, ok1);
    h.classList.remove('no'); first.classList.add('wob');
    setTimeout(() => first.classList.remove('wob'), 400);
  });
}

/* ---------- 14. Treasure Map: steps on a grid, then (x, y) coordinates ---------- */
const MDIR = { r: [1, 0, '→', 'right'], l: [-1, 0, '←', 'left'], u: [0, 1, '↑', 'up'], d: [0, -1, '↓', 'down'] };
function walkFrom(N0, N1, nm, mx, sx, sy) {
  for (let t = 0; t < 500; t++) {
    let x = sx != null ? sx : rnd(N0, N1), y = sy != null ? sy : rnd(N0, N1), hz = Math.random() < .5; const start = [x, y], moves = [], path = [[x, y]];
    for (let m = 0; m < nm; m++, hz = !hz) { const dir = hz ? pick(['r', 'l']) : pick(['u', 'd']), n = rnd(1, mx); for (let s = 0; s < n; s++) { x += MDIR[dir][0]; y += MDIR[dir][1]; path.push([x, y]); } moves.push([dir, n]); }
    if (path.every(([px, py]) => px >= N0 && py >= N0 && px <= N1 && py <= N1)) return { start, moves, path, ans: [x, y] };
  }
  return null;
}
function mapMake(d) {
  const r = Math.random();
  if (d <= 3) { const N = [4, 5, 5, 6][d]; return Object.assign({ mode: 'walk', lo: 0, hi: N - 1 }, walkFrom(0, N - 1, [1, 1, 2, 3][d], [2, 4, 3, 3][d])); }
  const lo = d === 6 ? -3 : 0, hi = d === 4 ? 5 : d === 5 ? 6 : 3, P = () => [rnd(lo, hi), rnd(lo, hi)];
  if (d >= 5 && r < .3) {
    const [x, y] = P(), key = ([a, b]) => a + ',' + b, seen = new Set([key([x, y])]), out = [[x, y]];
    for (const c of [[y, x], [x + 1, y], [x, y + 1], [x - 1, y], [x, y - 1], [-x, y], [x, -y], [y, -x]])
      if (out.length < 4 && c.every(v => v >= lo && v <= hi) && !seen.has(key(c))) { seen.add(key(c)); out.push(c); }
    return { mode: 'read', lo, hi, ans: [x, y], choices: shuffle(out).map(([a, b]) => ({ html: `(${mn(a)}, ${mn(b)})`, val: `${a},${b}`, label: `${mn(a)}, ${mn(b)}` })) };
  }
  if (d >= 5 && r < .6) return Object.assign({ mode: 'walkc', lo, hi }, walkFrom(lo, hi, 2, 4));
  let a; do a = P(); while (a[0] === 0 && a[1] === 0);
  return { mode: 'tap', lo, hi, ans: a };
}
function mapQ(d) {
  const p = mapMake(d), { lo, hi } = p, N = hi - lo + 1, walk = p.mode === 'walk', lab = !walk, [ax, ay] = p.ans;
  const isStart = (x, y) => p.start && p.start[0] === x && p.start[1] === y;
  const deco = {};
  if (walk) { const onPath = new Set(p.path.map(c => c.join())); shuffle(range(0, N * N - 1).map(k => [k % N, Math.floor(k / N)])).filter(c => !onPath.has(c.join())).slice(0, N - 2).forEach(c => deco[c.join()] = pick(['🌴', '🪨', '🐚', '🌵', '🦀'])); }
  let grid = '';
  for (let y = hi; y >= lo; y--) {
    if (lab) grid += `<span class="mapx">${mn(y)}</span>`;
    for (let x = lo; x <= hi; x++) {
      const st0 = isStart(x, y), crab = p.mode === 'read' && x === ax && y === ay;
      const tagN = p.mode === 'read' ? 'span' : 'button';
      grid += `<${tagN} class="tcell${p.mode === 'read' ? '' : ' gopt'}${st0 ? ' start' : ''}${x === 0 && lab ? ' x0' : ''}${y === 0 && lab ? ' y0' : ''}${lab ? (x === lo ? ' xl' : x === hi ? ' xh' : '') + (y === lo ? ' yl' : y === hi ? ' yh' : '') : ''}" data-x="${x}" data-y="${y}"${okA(p.mode !== 'read' && x === ax && y === ay)} aria-label="${lab ? `${mn(x)}, ${mn(y)}` : `square ${x + 1}, ${N - y}`}">${crab ? '<span class="mcrab">🦀</span>' : deco[x + ',' + y] ? `<span class="mdeco">${deco[x + ',' + y]}</span>` : ''}</${tagN}>`;
    }
  }
  if (lab) grid += '<span></span>' + range(lo, hi).map(x => `<span class="mapx">${mn(x)}</span>`).join('');
  const moves = p.moves ? p.moves.map(([dr, n]) => `<span class="mmv">${n} <i>${MDIR[dr][2]}</i><small>${MDIR[dr][3]}</small></span>`).join('<span class="mthen">then</span>') : '';
  const movesSay = p.moves ? p.moves.map(([dr, n]) => `${n} step${n > 1 ? 's' : ''} ${MDIR[dr][3]}`).join(', then ') : '';
  const sxy = p.start ? `(${mn(p.start[0])}, ${mn(p.start[1])})` : '';
  const prompt = walk ? `Start at 🦜. Go ${moves}` : p.mode === 'walkc' ? `Start at <b>${sxy}</b>. Go ${moves}` : p.mode === 'read' ? 'Where is the crab? 🦀' : `Dig at <b class="gnum">(${mn(ax)}, ${mn(ay)})</b>`;
  const speak = walk ? `Start at the parrot. Go ${movesSay}. Tap where the treasure is!` : p.mode === 'walkc' ? `Start at ${mn(p.start[0])}, ${mn(p.start[1])}. Go ${movesSay}. Tap where you end up!`
    : p.mode === 'read' ? 'Where is the crab? Go across first, then up. Pick its coordinates.' : `Dig for treasure at ${mn(ax)}, ${mn(ay)}. Go across first, then ${ay < 0 ? 'down' : 'up'}.`;
  gFrame(`<div class="tmapwrap"><div class="tmap ${lab ? 'coord' : 'walk'}" style="--n:${N}">${grid}${p.start ? '<span class="mparrot" id="parrot" aria-hidden="true">🦜</span>' : ''}</div></div>${p.mode === 'read' ? choicesHTML(p.choices, `${ax},${ay}`) : ''}`, prompt, speak);
  if (p.mode === 'read') return wireChoices(`${ax},${ay}`, `Start at zero. Count across to the crab first, then ${ay < 0 ? 'down' : 'up'}. The across number comes first.`, () => $('.mcrab').classList.add('got'), 1300);
  const cells = [...view.querySelectorAll('.tcell')], cell = (x, y) => cells.find(c => +c.dataset.x === x && +c.dataset.y === y), parrot = $('#parrot');
  const place = (x, y) => { const c = cell(x, y); parrot.style.left = c.offsetLeft + c.offsetWidth / 2 + 'px'; parrot.style.top = c.offsetTop + c.offsetHeight / 2 + 'px'; };
  if (parrot) { parrot.style.transition = 'none'; place(...p.start); void parrot.offsetWidth; parrot.style.transition = ''; }
  const okC = cell(ax, ay), firstMove = p.moves ? `First go ${p.moves[0][1]} ${MDIR[p.moves[0][0]][3]}.` : '';
  cells.forEach(c => c.onclick = () => {
    if (gm.lock || c.classList.contains('no')) return;
    const x = +c.dataset.x, y = +c.dataset.y;
    if (isStart(x, y)) { say(`That is where you start. ${firstMove}`); return; }
    if (c !== okC) return gameMiss(c, p.start ? `Start at ${walk ? 'the parrot' : sxy}. ${firstMove} Count each square.` : `That is ${mn(x)}, ${mn(y)}. Go across to ${mn(ax)} first, then ${ay < 0 ? 'down' : 'up'} to ${mn(ay)}.`, okC);
    let ms = 0;
    if (parrot) p.path.slice(1).forEach(([px, py], k) => { ms = (k + 1) * 300; gLater(() => { place(px, py); tone([500 + k * 40], .06); }, ms); });
    gLater(() => { c.innerHTML = '<span class="mchest">💰</span>'; tone([784, 988, 1319], .08); }, ms + 250);
    gameRight(c, ms + 1300, pick(['Treasure! 💰', 'You found it!', 'X marks the spot!']));
  });
}

if (location.hash === '#selftest') window.__games2 = { fishMake, pizzaMake, feedMake, rocketMake, targetMake, beeMake, mapMake };
})();
