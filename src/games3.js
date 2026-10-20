/* ---------- games3: seven more math games, sharing the round engine in games.js ---------- */
// Snakes & Ladders, Bakery Orders, Parking Garage, Hungry Monster, Bubble Count, Sticker Sort, Number Detective.
// Everything lives inside this function so its names never clash with the rest of the app.
(() => {
const okA = c => c ? ' data-ok="1"' : '';
const range = (a, b, s = 1) => { const o = []; for (let v = a; v <= b; v += s) o.push(v); return o; };
const FW = { 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['quarter', 'quarters'], 5: ['fifth', 'fifths'], 6: ['sixth', 'sixths'], 8: ['eighth', 'eighths'], 10: ['tenth', 'tenths'], 12: ['twelfth', 'twelfths'] };
const fw = (n, d) => `${n} ${(FW[d] || [d + 'th', d + 'ths'])[n === 1 ? 0 : 1]}`;
const coin = () => Math.random() < .5;
const myFace = () => { try { return (profileOf(pid) || profiles[0]).avatar; } catch (e) { return '🧒'; } };
const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8], 7: [0, 2, 3, 4, 5, 6, 8], 8: [0, 1, 2, 3, 5, 6, 7, 8], 9: [0, 1, 2, 3, 4, 5, 6, 7, 8] };
const dieHTML = (n, cls = '') => `<span class="g3die ${cls}" role="img" aria-label="${n}">${range(0, 8).map(i => `<i${PIPS[n].includes(i) ? ' class="on"' : ''}></i>`).join('')}</span>`;

GAMES.push(
  { id: 'snake', ico: '🎲', name: 'Snakes & Ladders', blurb: 'Roll, count and race the Owl', bg: '#2E9D5B', pe: '🎲', start: snakeStart, q: snakeQ, result: snakeResult },
  { id: 'bakery', ico: '🧁', name: 'Bakery Orders', blurb: () => ageLvl() >= 3 ? 'Rows, boxes and fractions' : 'Fill the box just right', bg: '#E2558C', pe: '🧁', n: 8, q: bakeQ },
  { id: 'park', ico: '🚗', name: 'Parking Garage', blurb: () => ageLvl() >= 4 ? 'Round to park' : 'Park by number', bg: '#4A5A7A', pe: '🚗', n: 8, q: parkQ },
  { id: 'monster', ico: '👾', name: 'Hungry Monster', blurb: () => ageLvl() >= 2 ? 'Feed it what makes it true' : 'Feed it the bigger group', bg: '#7B4FD6', pe: '🍪', n: 8, q: monQ },
  { id: 'bubble', ico: '🫧', name: 'Bubble Count', blurb: 'Look quick! How many?', bg: '#1FA2C8', pe: '🫧', n: 8, q: bubQ },
  { id: 'sticker', ico: '📊', name: 'Sticker Sort', blurb: 'Sort them, then read the chart', bg: '#F07A2A', pe: '⭐', n: 6, q: stkQ },
  { id: 'sudoku', ico: '🔎', name: 'Number Detective', blurb: () => ageLvl() >= 3 ? 'Sudoku and number riddles' : 'Fruit puzzles', bg: '#2D3F6E', pe: '🔎', n: 5, q: sdkQ }
);

/* ---------- 15. Snakes & Ladders: one board per round, race the owl to the flag ---------- */
function snakeMake(d) {
  const cfg = [
    { N: 18, faces: 3, dice: 1, step: 1 }, { N: 24, faces: 6, dice: 1, step: 1 }, { N: 30, faces: 6, dice: 1, step: 1 },
    { N: 36, faces: 6, dice: 2, step: 1 }, { N: 30, faces: 6, dice: 1, step: pick([2, 5, 10]) },
    { N: 36, faces: 6, dice: 1, step: pick([3, 4, 6, 25]) }, { N: 36, faces: 6, dice: 2, step: pick([7, 8, 9, 12, 15, 25]) }][d];
  const N = cfg.N, row = k => Math.floor(k / 6), nl = d === 0 ? 1 : 2, ns = d <= 2 ? 1 : 2;
  for (let t = 0; t < 1000; t++) {
    const used = new Set([0, N - 1]), lad = {}, sn = {};
    const take = (a, b) => { if (used.has(a) || used.has(b) || row(a) === row(b)) return false; used.add(a); used.add(b); return true; };
    for (let i = 0; i < nl; i++) { const a = rnd(1, N - 8), b = Math.min(N - 2, a + rnd(5, 11)); if (take(a, b)) lad[a] = b; }
    for (let i = 0; i < ns; i++) { const h = rnd(8, N - 2), tl = Math.max(1, h - rnd(4, d === 0 ? 6 : 9)); if (take(h, tl)) sn[h] = tl; }
    if (Object.keys(lad).length === nl && Object.keys(sn).length === ns) return Object.assign({ d, lad, sn }, cfg);
  }
  return Object.assign({ d, lad: {}, sn: {} }, cfg);
}
const snakeRoll = (S, owl) => range(1, S.dice).map(() => rnd(1, owl ? Math.max(2, S.faces - 1) : S.faces));
const snLab = (S, k) => (k + 1) * S.step;
function snakeStart() { gm.sn = snakeMake(gLvl()); gm.sn.me = 0; gm.sn.owl = 0; gm.n = 99; gameQ(); }
function snakeQ() {
  const S = gm.sn, N = S.N, R = N / 6, lab = k => snLab(S, k);
  const pos = k => { const r = Math.floor(k / 6), c = r % 2 ? 5 - k % 6 : k % 6; return [c, R - 1 - r]; };
  const ctr = k => { const [c, r] = pos(k); return [c + .5, r + .5]; };
  const cells = range(0, N - 1).map(k => { const [c, r] = pos(k);
    return `<button class="g3sn-cell gopt ${(c + r) % 2 ? 'a' : 'b'}${k === N - 1 ? ' fin' : ''}" data-k="${k}" style="grid-row:${r + 1};grid-column:${c + 1}" aria-label="square ${lab(k)}">${k === N - 1 ? '<span class="g3sn-flag">🏁</span>' : ''}<b>${lab(k)}</b></button>`; }).join('');
  let svg = '';
  for (const [a, b] of Object.entries(S.lad)) {
    const [x1, y1] = ctr(+a), [x2, y2] = ctr(b), L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L * .16, ny = (x2 - x1) / L * .16;
    let rungs = ''; for (let s = .18; s < L - .1; s += .3) { const f = s / L, x = x1 + (x2 - x1) * f, y = y1 + (y2 - y1) * f; rungs += `<line x1="${(x - nx).toFixed(2)}" y1="${(y - ny).toFixed(2)}" x2="${(x + nx).toFixed(2)}" y2="${(y + ny).toFixed(2)}"/>`; }
    svg += `<g class="g3sn-lad"><line x1="${x1 - nx}" y1="${y1 - ny}" x2="${x2 - nx}" y2="${y2 - ny}"/><line x1="${x1 + nx}" y1="${y1 + ny}" x2="${x2 + nx}" y2="${y2 + ny}"/>${rungs}</g>`;
  }
  for (const [h, t] of Object.entries(S.sn)) {
    const [x1, y1] = ctr(+h), [x2, y2] = ctr(t), L = Math.hypot(x2 - x1, y2 - y1), px = -(y2 - y1) / L, py = (x2 - x1) / L;
    const pts = range(0, 24).map(i => { const f = i / 24, w = Math.sin(f * Math.PI * 3) * .28 * (1 - f * .5); return `${(x1 + (x2 - x1) * f + px * w).toFixed(2)} ${(y1 + (y2 - y1) * f + py * w).toFixed(2)}`; });
    svg += `<g class="g3sn-snk"><path d="M${pts.join(' L')}"/><path class="spots" d="M${pts.join(' L')}"/><circle cx="${x1}" cy="${y1}" r=".24"/><circle class="eye" cx="${x1 - .08}" cy="${y1 - .06}" r=".06"/><circle class="eye" cx="${x1 + .08}" cy="${y1 - .06}" r=".06"/></g>`;
  }
  const top = `<div class="g3sn-top"><span class="g3sn-who">${myFace()} <b id="snMeN">${lab(S.me)}</b></span><span class="g3sn-vs">vs</span><span class="g3sn-who owl">🦉 <b id="snOwlN">${lab(S.owl)}</b></span></div>`;
  const howHop = S.step > 1 ? ` Each hop is <b>${S.step}</b>.` : '';
  gFrame(`<div class="g3sn-board" style="--r:${R}">${cells}<svg class="g3sn-art" viewBox="0 0 6 ${R}" aria-hidden="true">${svg}</svg>
      <span class="g3sn-tok me" id="snMe">${myFace()}</span><span class="g3sn-tok owl" id="snOwl">🦉</span></div>
    <div class="g3sn-tray"><div class="g3sn-dice" id="snDice">${range(1, S.dice).map(() => '<span class="g3die blank"><b>?</b></span>').join('')}</div>
      <button class="btn g3sn-roll gopt" id="snRoll" data-ok="1">🎲 Roll!</button></div>`,
    `Your turn! Tap <b class="gnum">Roll</b>.${howHop}`, `Your turn! Tap roll to throw the dice.${S.step > 1 ? ` Each hop on this board is ${S.step}.` : ''}`, top);
  const board = $('.g3sn-board'), me = $('#snMe'), owl = $('#snOwl'), cellEls = [...view.querySelectorAll('.g3sn-cell')];
  const put = (tok, k, other) => { const [c, r] = pos(k), off = k === other ? (tok === me ? -.18 : .18) : 0; tok.style.left = `${(c + .5 + off) / 6 * 100}%`; tok.style.top = `${(r + .5) / R * 100}%`; };
  const place = () => { put(me, S.me, S.owl); put(owl, S.owl, S.me); };
  [me, owl].forEach(t => t.style.transition = 'none'); place(); void board.offsetWidth; [me, owl].forEach(t => t.style.transition = '');
  let roll = null, tgt = -1, ready = false;
  const sumTxt = r => r.length > 1 ? `${r[0]} + ${r[1]} = ${r[0] + r[1]}` : String(r[0]);
  const hint = () => {
    const h = roll.reduce((a, b) => a + b, 0);
    if (S.step > 1) return `Each hop is ${S.step}. ${h} hop${h > 1 ? 's' : ''} of ${S.step} is ${h * S.step}. Add ${h * S.step} to ${lab(S.me)}.`;
    if (roll.length > 1) return `Add the dice: ${sumTxt(roll)}. Start on ${lab(S.me)} and count on ${h}.`;
    return `Start on ${lab(S.me)}. Hop ${h}: touch each square as you count ${range(1, h).join(', ')}.`;
  };
  $('#snRoll').onclick = () => {
    if (gm.lock || roll) return;
    roll = snakeRoll(S, false); const btn = $('#snRoll'); btn.removeAttribute('data-ok'); btn.classList.add('used'); btn.disabled = true;
    const dice = $('#snDice'); let f = 0;
    const spin = () => { dice.innerHTML = roll.map(() => dieHTML(rnd(1, S.faces), 'spin')).join(''); tone([300 + f * 40], .04); if (++f < 6) gLater(spin, 75); else land(); };
    const land = () => {
      dice.innerHTML = roll.map(v => dieHTML(v)).join('');
      const h = roll.reduce((a, b) => a + b, 0); tgt = Math.min(S.me + h, N - 1); ready = true;
      cellEls[tgt].dataset.ok = '1';
      const rolled = roll.length > 1 ? `${roll[0]} and ${roll[1]}` : `${h}`;
      $('.ptext').innerHTML = S.step > 1 ? `You rolled <b>${rolled}</b>: <b class="gnum">${h} hop${h > 1 ? 's' : ''} of ${S.step}</b>. Where do you land?`
        : roll.length > 1 ? `You rolled <b>${roll[0]}</b> + <b>${roll[1]}</b>. Where do you land?` : `You rolled <b class="gnum">${h}</b>! Hop ${h}. Where do you land?`;
      say(`You rolled ${rolled}. ${S.step > 1 ? `That is ${h} hops of ${S.step}.` : roll.length > 1 ? 'Add them up and hop.' : `Hop ${h}.`} Tap the square where you land!`);
    };
    spin();
  };
  cellEls.forEach(c => c.onclick = () => {
    if (gm.lock) return;
    if (!roll) { say('Tap Roll first to throw the dice!'); $('#snRoll').classList.remove('wob'); void board.offsetWidth; $('#snRoll').classList.add('wob'); return; }
    if (!ready) return;
    const k = +c.dataset.k;
    if (k === S.me) { say(`You are on ${lab(k)} now. ${hint()}`); return; }
    if (k !== tgt) { gameMiss(c, hint(), cellEls[tgt]); c.classList.remove('no'); return; }
    // Hop square by square, then ladders and snakes, then the owl's turn.
    let ms = 0; const from = S.me;
    for (let j = from + 1; j <= tgt; j++) { ms += 230; gLater(() => { S.me = j; place(); $('#snMeN').textContent = lab(j); tone([400 + (j - from) * 45], .06); }, ms); }
    let words;
    const jump = k => S.lad[k] != null ? S.lad[k] : S.sn[k] != null ? S.sn[k] : k;
    const meTo = jump(tgt); let owlTo = S.owl;
    if (meTo !== tgt) {
      words = meTo > tgt ? 'A ladder! Up you go! 🪜' : 'Oh no, a snake! Wheee! 🐍';
      ms += 450; gLater(() => { S.me = meTo; place(); $('#snMeN').textContent = lab(meTo); tone(meTo > tgt ? [523, 659, 784, 1047] : [700, 560, 440, 330], .08); }, ms); ms += 450;
    }
    if (meTo === N - 1) { gm.n = gm.i + 1; if (!S.owlFirst) S.meFirst = true; }
    else if (gm.i + 1 >= 16) gm.n = gm.i + 1;
    else if (S.owl < N - 1) {
      const or = snakeRoll(S, true), oh = or.reduce((a, b) => a + b, 0), o0 = S.owl, ot = Math.min(o0 + oh, N - 1), oto = jump(ot);
      ms += 500; gLater(() => { const dz = $('#snDice'); dz.innerHTML = `<span class="g3sn-owlroll">🦉</span>${or.map(v => dieHTML(v, 'owl')).join('')}`; $('.ptext').innerHTML = `The Owl rolled <b>${oh}</b>!`; }, ms);
      for (let j = o0 + 1; j <= ot; j++) { ms += 200; gLater(() => { S.owl = j; place(); $('#snOwlN').textContent = lab(j); }, ms); }
      if (oto !== ot) { ms += 400; gLater(() => { S.owl = oto; place(); $('#snOwlN').textContent = lab(oto); }, ms); }
      owlTo = oto; if (oto === N - 1 && !S.meFirst) S.owlFirst = true;
    }
    // The hop animations move S.me and S.owl step by step; make sure they end on the right squares.
    gLater(() => { S.me = meTo; S.owl = owlTo; }, ms + 10);
    S.end = [meTo, owlTo];
    gameRight(c, ms + 900, words);
  });
}
function snakeResult() {
  const S = gm.sn; if (S.end) [S.me, S.owl] = S.end; const done = S.me === S.N - 1;
  return { pts: gm.ok, of: gm.i, title: done ? (S.owlFirst ? 'What a race!' : 'You beat the Owl!') : 'Great racing!',
    line: done ? `You reached the 🏁 in ${gm.i} turns! ${gm.ok} of ${gm.i} hops right first time.` : `${gm.ok} of ${gm.i} hops right first time.` };
}

/* ---------- 16. Bakery Orders: fill boxes, arrays, sharing into boxes, fractions of a tray ---------- */
const TRAYS = [[2, 3], [2, 4], [2, 5], [3, 4], [2, 6], [4, 4], [3, 3]];
function bakeMake(d) {
  const r = Math.random();
  const fill = (rows, cols, need, x) => Object.assign({ mode: 'fill', rows, cols, need }, x || {});
  const count = (rmax, cmax) => { const rows = rnd(2, rmax), cols = rnd(2, cmax), ans = rows * cols; return { mode: 'count', rows, cols, ans, choices: nearBy(ans, [rows, -rows, cols, -cols, 1, -1], 1, 100, 4) }; };
  const pickBox = (rmax, cmax) => {
    const rows = rnd(2, rmax), cols = rnd(2, cmax), opts = [[rows, cols]];
    for (const [a, b] of shuffle([[rows + 1, cols], [rows - 1, cols], [rows, cols + 1], [rows, cols - 1], [rows + 1, cols - 1], [rows - 1, cols + 1]]))
      if (opts.length < 3 && a >= 1 && b >= 1 && a <= 6 && b <= 6 && !opts.some(([x, y]) => x === a && y === b) && !(a === cols && b === rows)) opts.push([a, b]);
    return { mode: 'pick', rows, cols, opts: shuffle(opts) };
  };
  const boxes = (kmax, bmax, rem) => { const k = rnd(2, kmax), b = rnd(2, bmax), L = rem ? rnd(1, k - 1) : 0, T = k * b + L, ans = rem ? b + 1 : b; return { mode: 'boxes', k, T, L, ans, choices: nearBy(ans, [1, -1, 2, -2], 1, 40, 4) }; };
  const frac = trays => { const [rows, cols] = pick(trays), T = rows * cols, dens = range(2, T).filter(x => T % x === 0 && x <= 8 && x !== T), den = pick(dens), n = rnd(1, den - 1); return fill(rows, cols, n * T / den, { n, den }); };
  const fracOf = Ts => { const T = pick(Ts), den = pick(range(2, 10).filter(x => T % x === 0 && x < T)), n = rnd(1, den - 1), ans = n * T / den; return { mode: 'of', T, den, n, ans, choices: nearBy(ans, [T / den, -T / den, 1, -1, 2], 1, T, 4) }; };
  if (d === 0) return fill(2, 3, rnd(1, 5));
  if (d === 1) return fill(2, 5, rnd(2, 10));
  if (d === 2) { if (r < .55) { const a = rnd(1, 6), b = rnd(1, 9 - a); return fill(2, 5, a + b, { a, b }); } const k = rnd(1, 5); return fill(2, 5, 2 * k, { dbl: k }); }
  if (d === 3) { if (r < .4) return count(4, 5); if (r < .75) return pickBox(4, 5); const [rows, cols] = pick([[2, 3], [2, 4], [2, 5], [2, 6]]); return fill(rows, cols, rows * cols / 2, { n: 1, den: 2 }); }
  if (d === 4) return r < .3 ? count(5, 6) : r < .55 ? pickBox(5, 6) : r < .8 ? boxes(6, 6) : frac([[2, 4], [2, 3], [3, 4], [2, 6]]);
  if (d === 5) return r < .45 ? frac(TRAYS) : r < .8 ? fracOf([12, 16, 18, 20, 24, 30]) : boxes(9, 9);
  return r < .35 ? fracOf([24, 30, 36, 40, 48, 60]) : r < .65 ? boxes(12, 9, true) : frac([[3, 4], [4, 4], [2, 6], [2, 5]]);
}
const CAKE = ['🧁', '🍩', '🍪', '🧁', '🥐'];
const miniBox = (rows, cols, e, cls = '') => `<span class="g3bk-arr ${cls}" style="--c:${cols}">${range(1, rows * cols).map(() => `<i>${e}</i>`).join('')}</span>`;
function bakeQ(d) {
  const p = bakeMake(d), e = pick(CAKE), ticket = (h) => `<div class="g3bk-shop"><span class="g3bk-chef" aria-hidden="true">🦉</span><div class="g3bk-ticket"><small>ORDER</small>${h}</div></div>`;
  if (p.mode === 'fill') {
    const T = p.rows * p.cols, isF = p.den != null;
    const order = isF ? `<b class="gnum">${frac(p.n, p.den)}</b><span>of the tray</span>` : p.a != null ? `<b>${p.a}</b>${e}<b>+</b><b>${p.b}</b>${e}` : p.dbl != null ? `<b>double</b><b class="gnum">${p.dbl}</b>${e}` : `<b class="gnum">${p.need}</b>${e}${d === 0 ? mdots(p.need) : ''}`;
    gFrame(`${ticket(order)}<div class="g3bk-box${isF ? ' tray' : ''}" data-need="${p.need}" style="--c:${p.cols}">${range(0, T - 1).map(i => `<button class="g3bk-slot gopt" data-i="${i}" aria-label="spot ${i + 1}"></button>`).join('')}</div>
      <div class="g3bk-bar"><b id="bkC">0 in the ${isF ? 'tray' : 'box'}</b><button class="btn leaf g3bk-done" id="bkDone">${isF ? 'Done ✓' : 'Box it 🎀'}</button></div>`,
      isF ? `Fill <span class="gnum">${frac(p.n, p.den)}</span> of the tray!` : p.a != null ? `Box up <b>${p.a}</b> + <b>${p.b}</b> cupcakes!` : p.dbl != null ? `Box up <b class="gnum">double ${p.dbl}</b>!` : `Put <b class="gnum">${p.need}</b> in the box!`,
      isF ? `This tray has ${T} spots. Fill ${fw(p.n, p.den)} of the tray with cakes. Then tap done!` : p.a != null ? `The order is ${p.a} and ${p.b} more. Tap the box to add cakes, then tap box it!`
        : p.dbl != null ? `The order is double ${p.dbl}. Tap the box to add cakes, then tap box it!` : `Put ${p.need} in the box. Tap a spot to add one. Then tap box it!`);
    const slots = [...view.querySelectorAll('.g3bk-slot')], cnt = () => slots.filter(s => s.classList.contains('on')).length;
    slots.forEach(s => s.onclick = () => {
      if (gm.lock) return; const on = s.classList.toggle('on'); s.innerHTML = on ? `<span>${e}</span>` : '';
      tone([on ? 620 + cnt() * 40 : 380], .06); const c = cnt(); $('#bkC').textContent = `${c} in the ${isF ? 'tray' : 'box'}`; if (d <= 2 && on) say(String(c));
    });
    $('#bkDone').onclick = () => {
      if (gm.lock) return; const c = cnt();
      if (c === p.need) { $('.g3bk-box').classList.add('shut'); return gameRight($('#bkDone'), 1500, pick(['Order up! 🎀', 'Yum! Just right!', 'Perfect box!'])); }
      const per = isF ? T / p.den : 0;
      const hint = c === 0 ? 'Tap the empty spots to put cakes in first.' : isF ? `${p.den} equal parts of ${per}. Take ${p.n} of them: that is ${p.need}.` : p.a != null ? `${p.a} and ${p.b} more. Count on from ${p.a}.` : p.dbl != null ? `Double ${p.dbl} means ${p.dbl} and ${p.dbl} again.` : `You have ${c}. The order is ${p.need}.`;
      gameMiss($('.g3bk-bar'), `${c > p.need ? 'Too many!' : c ? 'Not enough!' : ''} ${hint}`, $('#bkDone'), c > p.need ? 'Too many!' : c ? 'Not enough!' : 'Add some cakes!');
      if (gm.tries >= 2) slots.forEach((s, i) => s.classList.toggle('ghost', i < p.need));
    };
    return;
  }
  if (p.mode === 'pick') {
    gFrame(`${ticket(`<b class="gnum">${p.rows}</b><span>rows of</span><b class="gnum">${p.cols}</b>`)}<div class="g3bk-picks">${p.opts.map(([a, b], i) => `<button class="g3bk-pick gopt" data-v="${i}"${okA(a === p.rows && b === p.cols)} aria-label="${a} rows of ${b}">${miniBox(a, b, e)}</button>`).join('')}</div>`,
      `Which box has <b class="gnum">${p.rows} rows</b> of <b class="gnum">${p.cols}</b>?`, `Which box has ${p.rows} rows of ${p.cols}? Rows go across.`);
    view.querySelectorAll('.g3bk-pick').forEach(b => b.onclick = () => {
      if (gm.lock || b.classList.contains('no')) return;
      const [a, c] = p.opts[+b.dataset.v];
      if (b.dataset.ok) gameRight(b, 1300, 'Order up! 🎀');
      else gameMiss(b, `That box has ${a} row${a > 1 ? 's' : ''} of ${c}. Rows go across. Count the rows first.`, $('.g3bk-pick[data-ok]'));
    });
    return;
  }
  let vis, prompt, speak, hint;
  if (p.mode === 'count') {
    vis = `<div class="g3bk-box shut show" style="--c:${p.cols}">${miniBox(p.rows, p.cols, e, 'big')}</div>`;
    prompt = `<b>${p.rows}</b> rows of <b>${p.cols}</b>. How many <b class="gnum">cakes</b>?`; speak = `This box has ${p.rows} rows of ${p.cols}. How many cakes in all?`;
    hint = `Count in ${p.cols}s, one row at a time: ${range(1, Math.min(p.rows, 3)).map(k => k * p.cols).join(', ')}...`;
  } else if (p.mode === 'boxes') {
    vis = `<div class="g3bk-pile">${p.T <= 24 ? range(1, p.T).map(() => `<i>${e}</i>`).join('') : `<b>${p.T}</b> ${e}`}</div><div class="g3bk-empty">${range(1, Math.min(4, p.ans)).map(() => '<span>📦</span>').join('')}<span>…</span></div>`;
    prompt = `<b>${p.T}</b> cakes. <b>${p.k}</b> fit in a box. How many <b class="gnum">boxes</b>${p.L ? ' to pack them all' : ''}?`;
    speak = `There are ${p.T} cakes. ${p.k} fit in each box. How many boxes do you need${p.L ? ' to pack them all' : ''}?`;
    hint = p.L ? `${p.T} ÷ ${p.k} is ${p.ans - 1} with ${p.L} left over. The leftovers need a box too!` : `How many ${p.k}s make ${p.T}? Count in ${p.k}s.`;
  } else {
    vis = `<div class="g3bk-pile">${p.T <= 24 ? range(1, p.T).map(() => `<i>${e}</i>`).join('') : `<b>${p.T}</b> ${e}`}</div>`;
    prompt = `What is <span class="gnum">${frac(p.n, p.den)}</span> of <b>${p.T}</b> cakes?`; speak = `What is ${fw(p.n, p.den)} of ${p.T} cakes?`;
    hint = `Split ${p.T} into ${p.den} equal groups: ${p.T / p.den} in each. Then take ${p.n} group${p.n > 1 ? 's' : ''}.`;
  }
  gFrame(vis + choicesHTML(p.choices, p.ans), prompt, speak);
  wireChoices(p.ans, hint, null, 1300);
}

/* ---------- 17. Parking Garage: park by number, tens and ones, then rounding ---------- */
function parkMake(d) {
  const r = Math.random();
  const blocks = tmax => { const t = rnd(1, tmax), o = rnd(0, 9), n = 10 * t + o, out = [n];
    for (const v of shuffle([10 * o + t, t + o, n + 10, n - 10, 10 * t, n + 1, n - 1])) if (out.length < 4 && v >= 1 && v <= 99 && !out.includes(v)) out.push(v);
    return { mode: 'blocks', n, t, o, ans: n, spots: out.sort((a, b) => a - b).map(v => ({ v, l: String(v) })) }; };
  const round = (u, lo, hi, dp) => {
    let n; do n = rnd(lo, hi); while (n % u === 0);
    const ans = Math.floor((n + u / 2) / u) * u, L = Math.floor(n / u) * u, out = [L - u, L, L + u, L + 2 * u].filter(v => v >= 0);
    return { mode: 'round', u, n, ans, L, dp, nShow: dp ? (n / 10).toFixed(1) : String(n), spots: out.map(v => ({ v, l: dp ? String(v / 10) : String(v) })) };
  };
  if (d === 0) { const n = rnd(1, 5); return { mode: 'match', n, ans: n, spots: range(1, 5).map(v => ({ v, l: String(v) })) }; }
  if (d === 1) { const n = pick([2, 3, 4, 6, 7, 8, 9]); return { mode: 'line', n, ans: n, spots: range(1, 10).map(v => ({ v, l: [1, 5, 10].includes(v) ? String(v) : '' })) }; }
  if (d === 2) { if (r < .55) return blocks(4); const n = pick([12, 13, 14, 16, 17, 18, 19]); return { mode: 'line', n, ans: n, spots: range(11, 20).map(v => ({ v, l: [11, 15, 20].includes(v) ? String(v) : '' })) }; }
  if (d === 3) { if (r < .5) { const n = rnd(10, 59); return { mode: 'floor', n, ans: Math.floor(n / 10) * 10, spots: range(1, 5).reverse().map(t => ({ v: t * 10, l: `${t * 10}s` })) }; } return blocks(9); }
  if (d === 4) return round(10, 11, 99);
  if (d === 5) return r < .5 ? round(100, 101, 999) : round(10, 101, 999);
  return r < .4 ? round(1000, 1001, 9999) : r < .7 ? round(10, 1001, 9999) : round(10, 11, 199, 1);
}
const CARS = ['🚗', '🚙', '🚕', '🚓', '🏎️', '🚐'];
const tensOnes = (t, o) => `<span class="g3pk-blk">${range(1, t).map(() => '<i class="ten"></i>').join('')}${range(1, o).map(() => '<i class="one"></i>').join('')}</span>`;
function parkQ(d) {
  const p = parkMake(d), car = pick(CARS), col = pick(['#F2604F', '#2E8BE6', '#FFC23D', '#2FA36B', '#6D55D1']);
  const plate = p.mode === 'blocks' ? tensOnes(p.t, p.o) : `<b>${p.mode === 'round' ? p.nShow : p.n}</b>${p.mode === 'match' ? mdots(p.n) : ''}`;
  const fmt = v => p.dp ? String(v / 10) : String(v);
  let road = '';
  if (p.mode === 'round') {
    const f = (p.n - p.L) / p.u;
    road = `<div class="g3pk-road"><span class="end">${fmt(p.L)}</span><div class="g3pk-line">${range(0, 10).map(k => `<i style="left:${k * 10}%"${k === 5 ? ' class="mid"' : ''}></i>`).join('')}<span class="g3pk-mark" style="left:${(f * 100).toFixed(1)}%">${car}</span></div><span class="end">${fmt(p.L + p.u)}</span></div>`;
  }
  const lot = p.mode === 'floor'
    ? `<div class="g3pk-lot floors">${p.spots.map(s => `<button class="g3pk-spot floor gopt" data-v="${s.v}"${okA(s.v === p.ans)} aria-label="${s.v} to ${s.v + 9} floor"><b>${s.l}</b><small>${s.v}–${s.v + 9}</small></button>`).join('')}</div>`
    : `<div class="g3pk-lot" style="--n:${Math.min(5, p.spots.length)}">${p.spots.map(s => `<button class="g3pk-spot gopt${s.l ? '' : ' blank'}" data-v="${s.v}"${okA(s.v === p.ans)} aria-label="${s.l || 'spot'}"><b>${s.l}</b></button>`).join('')}</div>`;
  const U = { 10: 'ten', 100: 'hundred', 1000: 'thousand' };
  const prompt = p.mode === 'match' ? `Park in spot <b class="gnum">${p.n}</b>!` : p.mode === 'line' ? `Park in spot <b class="gnum">${p.n}</b>! Count along.`
    : p.mode === 'blocks' ? 'Read the blocks. Which spot?' : p.mode === 'floor' ? `Which <b class="gnum">floor</b> for <b>${p.n}</b>?`
    : `Park <b>${p.nShow}</b> at the nearest <b class="gnum">${p.dp ? 'whole number' : U[p.u]}</b>`;
  const speak = p.mode === 'match' ? `This car is number ${p.n}. Park it in spot ${p.n}!` : p.mode === 'line' ? `Park the car in spot ${p.n}. Some numbers are missing, so count along!`
    : p.mode === 'blocks' ? `This car shows ${p.t} tens and ${p.o} ones. Which spot is that number?` : p.mode === 'floor' ? `Car ${p.n} parks on the floor of its tens. Which floor?`
    : `Car ${p.nShow}. Round it to the nearest ${p.dp ? 'whole number' : U[p.u]} to find its spot.`;
  const hint = p.mode === 'match' ? `Find the spot with ${p.n} on it.` : p.mode === 'line' ? `Start at ${p.spots[0].v} and count each spot until you get to ${p.n}.`
    : p.mode === 'blocks' ? `Count the long tens: ${range(1, p.t).map(k => k * 10).join(', ')}. Then count on the ones.` : p.mode === 'floor' ? `${p.n} has ${Math.floor(p.n / 10)} tens, so it goes on the ${p.ans}s floor.`
    : `Is ${p.nShow} closer to ${fmt(p.L)} or ${fmt(p.L + p.u)}? Halfway or more rounds up.`;
  gFrame(`<div class="g3pk-gate"><div class="g3pk-car" id="pkCar" style="--cc:${col}"><span class="g3pk-e">${car}</span><span class="g3pk-plate">${plate}</span></div></div>${road}${lot}`, prompt, speak);
  view.querySelectorAll('.g3pk-spot').forEach(b => b.onclick = () => {
    if (gm.lock || b.classList.contains('no')) return;
    if (!b.dataset.ok) return gameMiss(b, `${b.classList.contains('blank') ? 'Not that spot.' : `That spot is ${b.querySelector('b').textContent}.`} ${hint}`, $('.g3pk-spot[data-ok]'));
    const cr = $('#pkCar'), a = cr.getBoundingClientRect(), z = b.getBoundingClientRect();
    cr.style.transform = `translate(${(z.left + z.width / 2 - a.left - a.width / 2).toFixed(0)}px,${(z.top + z.height / 2 - a.top - a.height / 2).toFixed(0)}px) scale(.8)`; cr.classList.add('drive');
    b.classList.add('taken'); tone([392, 523, 659], .08); gameRight(b, 1500, pick(['Parked! 🅿️', 'Beep beep! Perfect parking!', 'Vroom! Just right!']));
  });
}

/* ---------- 18. Hungry Monster: feed it the bigger group, the number that makes it true, equal fractions ---------- */
const MFOOD = ['🍪', '🍎', '🍓', '🧁', '🍩', '🍌', '🥕', '🍬'];
function monMake(d) {
  const r = Math.random(), N = v => ({ v, h: String(v), s: String(v) });
  const grp = (k, max, less) => { let vs; do vs = range(1, k).map(() => rnd(1, max)); while (new Set(vs).size < k); const tv = less ? Math.min(...vs) : Math.max(...vs), e = pick(MFOOD);
    return { mode: 'group', less, e, items: vs.map(v => ({ v, ok: v === tv, s: `${v}` })), q: `Feed me the <b class="gnum">${less ? 'smaller' : 'bigger'}</b> group!`, say: `Feed me the plate with ${less ? 'fewer' : 'more'}!`, hint: 'Count each plate. Which has ' + (less ? 'fewer?' : 'more?') }; };
  const nums = (ans, cand, q, sayS, hint, n = 3) => ({ mode: 'num', items: shuffle([ans, ...shuffle(cand.filter(v => v !== ans && v >= 0)).filter((v, i, a) => a.indexOf(v) === i).slice(0, n - 1)]).map(v => Object.assign(N(v), { ok: v === ans })), q, say: sayS, hint });
  const box = '<span class="g3mo-box">?</span>';
  const eqn = (a, op, b, c, miss) => { const parts = [a, b, c].map((v, i) => i === miss ? box : v); return `${parts[0]} ${op} ${parts[1]} = ${parts[2]}`; };
  const sayEq = (a, op, b, c, miss) => { const parts = [a, b, c].map((v, i) => i === miss ? 'what' : v); return `${parts[0]} ${{ '+': 'plus', '−': 'minus', '×': 'times', '÷': 'divided by' }[op]} ${parts[1]} equals ${parts[2]}`; };
  const OPF = { '+': (x, y) => x + y, '−': (x, y) => x - y, '×': (x, y) => x * y, '÷': (x, y) => x / y };
  const sent = (a, op, b, c, miss, n) => { const ans = [a, b, c][miss], near = [ans + 1, ans - 1, ans + 2, ans - 2, c, a + b, ans + 10];
    const check = v => { const q = [a, b, c]; q[miss] = v; return Math.abs(OPF[op](q[0], q[1]) - q[2]) < 1e-9; };
    return Object.assign({ check }, nums(ans, near, `Make it true: <span class="gexpr">${eqn(a, op, b, c, miss)}</span>`, `Feed me the number that makes it true. ${sayEq(a, op, b, c, miss)}.`,
      op === '+' ? (miss === 2 ? `Add ${a} and ${b}.` : `Count on from ${miss ? a : b} to ${c}.`) : op === '−' ? (miss === 0 ? `Add them back: ${b} + ${c}.` : miss === 1 ? `Count back from ${a} to ${c}.` : `Count back ${b} from ${a}.`)
        : op === '×' ? `Think of the ${miss ? a : b} times table. What makes ${c}?` : `What times ${b} makes the first number? ${b} × ${c}.`, n)); };
  const fr = (a, b) => ({ v: a / b, h: frac(a, b), s: fw(a, b) });
  const one = (target, opts, q, sayS, hint) => ({ mode: 'eq', target, items: shuffle(opts.map(o => Object.assign(o, { ok: Math.abs(o.v - target.v) < 1e-9 }))), q, say: sayS, hint });
  if (d === 0) return grp(2, 5, false);
  if (d === 1) return grp(r < .35 ? 3 : 2, 8, r < .3);
  if (d === 2) { if (r < .35) return grp(3, 10, coin()); const T = rnd(4, 10), a = rnd(1, T - 1); return sent(a, '+', T - a, T, r < .7 ? 1 : 0, 3); }
  if (d === 3) {
    if (r < .3) { const T = rnd(8, 20), a = rnd(1, T - 1); return sent(a, '+', T - a, T, rnd(0, 1), 4); }
    if (r < .65) { const a = rnd(8, 20), b = rnd(2, 9); return sent(a, '−', b, a - b, rnd(0, 2), 4); }
    const k = rnd(6, 18), big = coin(), ans = big ? k + rnd(1, 4) : k - rnd(1, 4), others = shuffle(big ? [k, k - 1, k - 2, k - 3] : [k, k + 1, k + 2, k + 3]).slice(0, 3);
    return { mode: 'num', check: v => big ? v > k : v < k, items: shuffle([ans, ...others]).map(v => Object.assign(N(v), { ok: v === ans })), q: `Make it true: <span class="gexpr">${box} ${big ? '&gt;' : '&lt;'} ${k}</span>`, say: `What number is ${big ? 'bigger' : 'smaller'} than ${k}?`, hint: `${big ? 'Bigger' : 'Smaller'} than ${k} means it comes ${big ? 'after' : 'before'} ${k} when you count. ${k} itself does not count!` };
  }
  if (d === 4) {
    if (r < .4) { const a = rnd(2, 10), b = rnd(2, 10); return sent(a, '×', b, a * b, rnd(0, 1), 4); }
    if (r < .65) { const b = rnd(2, 10), c = rnd(2, 10); return sent(b * c, '÷', b, c, 0, 4); }
    const x = rnd(2, 6), y = rnd(2, 6), v = x * y, E = (h, val, s) => ({ v: val, h, s });
    const opts = [E(`${x} × ${y}`, v, `${x} times ${y}`), E(`${x} + ${y}`, x + y, `${x} plus ${y}`), E(`${v} − ${x}`, v - x, `${v} minus ${x}`), E(`${x + 1} × ${y}`, (x + 1) * y, `${x + 1} times ${y}`)];
    const tgt = { v, h: String(v) }; const shown = opts.filter((o, i, a) => a.findIndex(z => Math.abs(z.v - o.v) < 1e-9) === i);
    return one(tgt, shown.slice(0, 4), `Feed me one that makes <b class="gnum">${v}</b>!`, `Feed me the one that makes ${v}.`, 'Work out each one. Which one makes ' + v + '?');
  }
  if (d === 5) {
    if (r < .65) {
      const b = rnd(2, 6), a = rnd(1, b - 1), k = rnd(2, 4), opts = [fr(a * k, b * k)];
      for (const [x, y] of shuffle([[a * k, b * k + k], [a * k + 1, b * k], [a + k, b + k], [a * k, b + k], [a + 1, b * k], [b - a, b], [a, b + 1]]))
        if (opts.length < 4 && x >= 1 && x < y && !opts.some(o => Math.abs(o.v - x / y) < 1e-9) && Math.abs(x / y - a / b) > 1e-9) opts.push(fr(x, y));
      return one(fr(a, b), opts, `Feed me one equal to <span class="gnum">${frac(a, b)}</span>`, `Feed me the fraction that is the same as ${fw(a, b)}.`, `Times the top and the bottom of ${fw(a, b)} by the same number.`);
    }
    const t = pick([1, 2, 3, 4, 5, 6, 7, 8, 9]), opts = [fr(t, 10)];
    for (const o of shuffle([fr(1, t + 1), { v: t / 100, h: (t / 100).toFixed(2), s: (t / 100).toFixed(2) }, fr(t, 100), { v: t, h: String(t), s: String(t) }, fr(t + 1, 10)]))
      if (opts.length < 4 && !opts.some(z => Math.abs(z.v - o.v) < 1e-9)) opts.push(o);
    return one({ v: t / 10, h: (t / 10).toFixed(1) }, opts, `Feed me one equal to <b class="gnum">${(t / 10).toFixed(1)}</b>`, `Feed me the one that is the same as ${(t / 10).toFixed(1)}.`, `The first place after the point is tenths. ${(t / 10).toFixed(1)} is ${t} tenths.`);
  }
  const POOL = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10], [1, 20], [1, 8]];
  const form = ([a, b], k) => { const v = a / b, dec = String(+v.toFixed(3)), pc = String(+(v * 100).toFixed(1)) + '%';
    return k === 0 ? fr(a, b) : k === 1 ? { v, h: dec, s: dec } : { v, h: pc, s: pc.replace('%', ' percent') }; };
  const T = pick(POOL), kt = rnd(0, 2), kc = pick([0, 1, 2].filter(k => k !== kt)), opts = [form(T, kc)];
  const [a, b] = T;
  const wrong = [{ v: a / 10 === T[0] / T[1] ? -1 : a / 10, h: (a / 10).toFixed(1), s: (a / 10).toFixed(1) }, { v: (a * 10 + b) / 100, h: `${a * 10 + b}%`, s: `${a * 10 + b} percent` }];
  for (const o of shuffle([...shuffle(POOL).filter(x => x[0] / x[1] !== a / b).slice(0, 3).map(x => form(x, kc)), ...wrong.filter(w => w.v > 0)]))
    if (opts.length < 4 && !opts.some(z => Math.abs(z.v - o.v) < 1e-9)) opts.push(o);
  const tg = form(T, kt);
  return one(tg, opts, `Feed me one equal to <b class="gnum">${tg.h}</b>`, `Feed me the one that is the same as ${tg.s}.`, kt === 0 || kc === 0 ? `Turn the fraction into hundredths. ${fw(a, b)} is ${+(a / b * 100).toFixed(1)} out of 100.` : 'Percent means out of 100. Move the point two places.');
}
const MONSTER = c => `<svg class="g3mo-svg" viewBox="0 0 120 112" aria-hidden="true"><path d="M30 26 L20 2 L44 18Z M90 26 L100 2 L76 18Z" fill="#FFC23D" stroke="#C9921A" stroke-width="2"/>
  <ellipse cx="34" cy="104" rx="14" ry="7" fill="${c}" opacity=".85"/><ellipse cx="86" cy="104" rx="14" ry="7" fill="${c}" opacity=".85"/>
  <ellipse cx="60" cy="62" rx="52" ry="44" fill="${c}"/><ellipse cx="60" cy="80" rx="32" ry="20" fill="#fff" opacity=".18"/>
  <circle cx="40" cy="44" r="14" fill="#fff"/><circle cx="80" cy="44" r="14" fill="#fff"/><circle class="g3mo-eye" cx="43" cy="47" r="6.5" fill="#22305A"/><circle class="g3mo-eye" cx="77" cy="47" r="6.5" fill="#22305A"/>
  <g class="g3mo-mouth"><path d="M34 70 Q60 102 86 70 Z" fill="#5A1530"/><path d="M42 71 l5 7 l5 -7 Z M68 71 l5 7 l5 -7 Z" fill="#fff"/><ellipse cx="60" cy="86" rx="9" ry="4" fill="#F2604F"/></g></svg>`;
function monQ(d) {
  const p = monMake(d), col = ['#8E5BE8', '#2FA36B', '#F2604F', '#2E8BE6', '#FF8A2B'][gm.i % 5], ans = p.items.findIndex(x => x.ok), food = pick(MFOOD);
  const items = p.items.map((x, i) => p.mode === 'group'
    ? `<button class="g3mo-plate gopt" data-v="${i}"${okA(x.ok)} aria-label="${x.v}"><span class="g3mo-grp n${x.v > 5 ? 'b' : 's'}">${p.e.repeat(x.v)}</span></button>`
    : `<button class="g3mo-food gopt" data-v="${i}"${okA(x.ok)} aria-label="${esc(x.s)}"><span class="g3mo-ck" aria-hidden="true">${food}</span><b>${x.h}</b></button>`).join('');
  gFrame(`<div class="g3mo-den"><div class="g3mo-who" id="mon" style="--grow:${(1 + gm.i * .04).toFixed(2)}">${MONSTER(col)}</div><div class="g3mo-say" id="monSay">${pick(['I am SO hungry!', 'Feed me!', 'Yum yum?', 'Nom nom time!'])}</div></div>
    <div class="g3mo-foods n${p.items.length}${p.mode === 'group' ? ' plates' : ''}">${items}</div>`, p.q, p.say);
  const mon = $('#mon'), sayB = $('#monSay');
  view.querySelectorAll('.g3mo-plate,.g3mo-food').forEach(b => b.onclick = () => {
    if (gm.lock || b.classList.contains('no')) return;
    if (+b.dataset.v === ans) {
      const a = b.getBoundingClientRect(), m = mon.getBoundingClientRect();
      b.style.transform = `translate(${(m.left + m.width / 2 - a.left - a.width / 2).toFixed(0)}px,${(m.top + m.height * .7 - a.top - a.height / 2).toFixed(0)}px) scale(.3)`; b.classList.add('eaten');
      mon.classList.add('chomp'); sayB.textContent = pick(['NOM NOM NOM! 😋', 'Yummy! More!', 'Delicious! 😋']); tone([220, 330, 440, 660], .07);
      return gameRight(null, 1400, pick(['Yum! You fed the monster!', 'Nom nom! Right!', 'The monster loves it!']));
    }
    mon.classList.remove('yuck'); void mon.offsetWidth; mon.classList.add('yuck'); sayB.textContent = pick(['Yuck! Not that one!', 'Bleh! Try again!', 'Hmm, not that!']);
    gameMiss(b, `${p.mode === 'group' ? '' : `Not ${b.getAttribute('aria-label')}. `}${p.hint}`, $('.g3mo-foods [data-ok]'));
  });
}

/* ---------- 19. Bubble Count: see how many at a glance, count in groups, estimate ---------- */
const BUBSETS = { 5: [10, 20, 50, 100], 6: [25, 50, 100, 200] };
function bubMake(d) {
  const r = Math.random();
  const res = (groups, kind, choices, ans, flash, x) => Object.assign({ groups, kind, choices, ans, flash, total: groups.reduce((a, b) => a + b, 0) }, x || {});
  const single = (lo, hi, kind, flash) => { const n = rnd(lo, hi); return res([n], kind, numChoices(n, 1, hi + 2, d === 0 ? 3 : 4), n, flash); };
  const pair = (hi, max, flash) => { let a, b; do { a = rnd(1, hi); b = rnd(1, hi); } while (a + b > max); return res([a, b], 'die', numChoices(a + b, 2, max + 2, 4), a + b, flash); };
  const groups = (gs, ks, flash) => { const g = rnd(gs[0], gs[1]), k = pick(ks), T = g * k; return res(Array(g).fill(k), k === 10 || k === 5 && coin() ? 'frame' : 'die', nearBy(T, [k, -k, 1, -1, 2 * k], 1, 200, 4), T, flash, { g, k }); };
  const est = set => { const ans = pick(set), n = Math.max(3, Math.round(ans * (.87 + Math.random() * .26))); return res([n], 'scatter', set.map(v => ({ html: `≈${v}`, val: v, label: `about ${v}` })), ans, 2600, { est: true }); };
  if (d === 0) return single(1, 4, 'die', 2600);
  if (d === 1) return r < .6 ? single(1, 6, 'die', 2300) : pair(3, 6, 2300);
  if (d === 2) return r < .5 ? single(5, 10, 'frame', 2300) : pair(6, 10, 2300);
  if (d === 3) { if (r < .4) { const k = rnd(1, 9); return res([10, k], 'frame', numChoices(10 + k, 10, 22, 4), 10 + k, 3000); } return groups([2, 5], [2, 3, 4, 5], 4000); }
  if (d === 4) return groups([3, 8], [2, 5, 10], 4500);
  if (d === 5) return r < .5 ? est(BUBSETS[5]) : groups([3, 8], [3, 4, 6], 4500);
  return r < .5 ? est(BUBSETS[6]) : groups([3, 8], [6, 7, 8, 9], 4500);
}
function scatterDots(n) {
  const s = Math.sqrt(Math.PI * .8 / (1.7 * n)), pts = [];
  for (let y = -.9; y <= .9; y += s) for (let x = -.9; x <= .9; x += s) if (x * x + y * y < .78) pts.push([x, y]);
  return shuffle(pts).slice(0, n).map(([x, y]) => `<i style="left:${(50 + (x + (Math.random() - .5) * s * .5) * 50).toFixed(1)}%;top:${(50 + (y + (Math.random() - .5) * s * .5) * 50).toFixed(1)}%"></i>`).join('');
}
const bubDots = (n, kind) => kind === 'scatter' ? `<span class="g3bb-sc" style="--ds:${(Math.sqrt(Math.PI * .8 / (1.7 * n)) * 27).toFixed(2)}%">${scatterDots(n)}</span>`
  : kind === 'frame' ? `<span class="g3bb-fr">${range(0, 9).map(i => `<i${i < n ? ' class="on"' : ''}></i>`).join('')}</span>` : `<span class="g3bb-die">${range(0, 8).map(i => `<i${PIPS[n].includes(i) ? ' class="on"' : ''}></i>`).join('')}</span>`;
function bubQ(d) {
  const p = bubMake(d), many = p.groups.length, big = p.kind === 'scatter', hue = pick(['#F2604F', '#6D55D1', '#2FA36B', '#FF8A2B', '#2E8BE6']);
  gFrame(`<div class="g3bb-tank${big ? ' big' : ''}" id="tank" style="--dc:${hue}"><div class="g3bb-bubs n${Math.min(many, 9)}">${p.groups.map((n, i) => `<span class="g3bb-bub${big ? ' huge' : ''}" style="--dl:${(i * .12).toFixed(2)}s">${bubDots(n, p.kind)}<b class="g3bb-q">?</b></span>`).join('')}</div>
      <span class="g3bb-fishy" aria-hidden="true">🐠</span><button class="g3bb-peek" id="peek" hidden>👀 Peek</button></div>${choicesHTML(p.choices, p.ans)}`,
    p.est ? 'About how many dots? <b class="gnum">Look quick!</b>' : many > 1 && p.k ? `<b>${many}</b> bubbles of <b>${p.k}</b>. How many <b class="gnum">dots</b>?` : many > 1 ? 'How many dots <b class="gnum">altogether</b>?' : 'How many dots? <b class="gnum">Look quick!</b>',
    p.est ? 'Look quick! About how many dots are in the bubble? Don\'t count them all, just guess!' : many > 1 && p.k ? `There are ${many} bubbles with ${p.k} dots in each. How many dots altogether? Count in ${p.k}s!` : many > 1 ? 'Look quick! How many dots altogether?' : 'Look quick! How many dots are in the bubble?');
  const tank = $('#tank'), peek = $('#peek');
  const hide = () => { tank.classList.add('fog'); peek.hidden = false; };
  gLater(hide, p.flash + 600);
  peek.onclick = () => { tank.classList.remove('fog'); peek.hidden = true; gLater(hide, p.flash); };
  const hint = p.est ? `Count about ten dots and see how much space they take. How many tens fit in the bubble?`
    : p.k ? `Count in ${p.k}s: ${range(1, Math.min(many, 4)).map(j => j * p.k).join(', ')}...` : p.kind === 'frame' ? 'A full row is 5. A full frame is 10. Count on from there.' : 'Peek again and look at the shape the dots make, like on a dice.';
  wireChoices(p.ans, hint, () => { tank.classList.remove('fog'); peek.hidden = true; view.querySelectorAll('.g3bb-bub').forEach((b, i) => setTimeout(() => b.classList.add('pop'), 300 + i * 90)); tone([880, 1175, 1568], .05); }, 1500 + many * 90);
  // A second miss shows the dots again to help.
  view.querySelectorAll('.gch .gopt').forEach(b => b.addEventListener('click', () => { if (gm.tries >= 2) { tank.classList.remove('fog'); peek.hidden = true; } }));
}

/* ---------- 20. Sticker Sort: sort stickers into a chart, then read it ---------- */
const STK = [['⭐', 'stars', 'star'], ['🐞', 'ladybugs', 'ladybug'], ['🌸', 'flowers', 'flower'], ['🍓', 'strawberries', 'strawberry'], ['🚀', 'rockets', 'rocket'], ['🐟', 'fish', 'fish'], ['🦄', 'unicorns', 'unicorn'], ['🍩', 'donuts', 'donut']];
function stkMake(d) {
  const k = [2, 3, 3, 4, 4, 4, 5][d], kinds = shuffle(STK).slice(0, k), r = Math.random();
  const [lo, hi, sc] = [[1, 4, 1], [1, 5, 1], [1, 7, 1], [1, 10, 1], [2, 20, 2], [5, 50, 5], [5, 100, 5]][d];
  const pool = shuffle(range(lo, hi, sc)), counts = pool.slice(0, k);
  const scale = [1, 1, 1, 1, 2, 5, 10][d];
  const nm = i => kinds[i][1];
  const by = f => counts.indexOf(f(...counts));
  const pickQ = d === 0 ? 'most' : d === 1 ? pick(['most', 'fewest', 'howmany']) : d === 2 ? pick(['more', 'howmany', 'most', 'total']) : pick(['more', 'more', 'howmany', 'total2', 'fewest']);
  const numQ = (ans, q, sayS, hint) => ({ ans, q, say: sayS, hint, choices: nearBy(ans, [1, -1, 2, -2, sc, -sc, 10], 0, 300, d <= 1 ? 3 : 4) });
  const emQ = (i, q, sayS, hint) => ({ ans: nm(i), q, say: sayS, hint, choices: shuffle(kinds.map(([e, w]) => ({ html: e, val: w, label: w }))) });
  let Q;
  if (pickQ === 'most') Q = emQ(by(Math.max), 'Which sticker has the <b class="gnum">most</b>?', 'Which sticker has the most?', 'Find the tallest column.');
  else if (pickQ === 'fewest') Q = emQ(by(Math.min), 'Which sticker has the <b class="gnum">fewest</b>?', 'Which sticker has the fewest?', 'Find the shortest column.');
  else if (pickQ === 'howmany') { const i = rnd(0, k - 1); Q = numQ(counts[i], `How many <b class="gnum">${kinds[i][0]}</b>?`, `How many ${nm(i)} are there?`, `Look at the top of the ${kinds[i][2]} column, then across to the numbers.`); }
  else if (pickQ === 'total') { Q = numQ(counts.reduce((a, b) => a + b, 0), 'How many stickers <b class="gnum">altogether</b>?', 'How many stickers are there altogether?', `Add up every column: ${counts.join(' + ')}.`); }
  else if (pickQ === 'total2') { const [i, j] = shuffle(range(0, k - 1)); Q = numQ(counts[i] + counts[j], `How many <b>${kinds[i][0]}</b> and <b>${kinds[j][0]}</b> <b class="gnum">together</b>?`, `How many ${nm(i)} and ${nm(j)} together?`, `Read each bar, then add them.`); }
  else { let [i, j] = shuffle(range(0, k - 1)); if (counts[i] < counts[j]) [i, j] = [j, i]; Q = numQ(counts[i] - counts[j], `How many more <b>${kinds[i][0]}</b> than <b>${kinds[j][0]}</b>?`, `How many more ${nm(i)} than ${nm(j)}?`, `Read both bars. Then find the difference: ${counts[i]} take away ${counts[j]}... or count up from the smaller one.`); }
  return Object.assign({ kinds, counts, scale, sort: d <= 2, kind: pickQ }, Q);
}
function stkQ(d) {
  const p = stkMake(d), k = p.kinds.length, cols = ['#F2604F', '#2E8BE6', '#2FA36B', '#6D55D1', '#FF8A2B'];
  let chart;
  if (p.sort) {
    const H = Math.max(...p.counts);
    chart = `<div class="g3sk-chart sort" style="--k:${k};--h:${H}"><div class="g3sk-y">${range(1, H).reverse().map(v => `<span>${v}</span>`).join('')}</div>
      ${p.kinds.map((x, i) => `<div class="g3sk-col"><div class="g3sk-stack" id="sk${i}"></div><span class="g3sk-lab">${x[0]}</span></div>`).join('')}</div>`;
  } else {
    const top = Math.ceil(Math.max(...p.counts) / p.scale) * p.scale + p.scale;
    chart = `<div class="g3sk-chart bars" style="--k:${k}"><div class="g3sk-y">${range(0, top, p.scale).reverse().map(v => `<span style="bottom:${v / top * 100}%">${v}</span>`).join('')}</div>
      <div class="g3sk-plot">${range(0, top, p.scale).map(v => `<i class="g3sk-grid" style="bottom:${v / top * 100}%"></i>`).join('')}
      ${p.kinds.map((x, i) => `<div class="g3sk-bar" style="--v:${p.counts[i] / top * 100}%;--c:${cols[i]};--dl:${i * .12}s"></div>`).join('')}</div>
      <span></span><div class="g3sk-labs">${p.kinds.map(x => `<span class="g3sk-lab">${x[0]}</span>`).join('')}</div></div>`;
  }
  const pile = [];
  p.kinds.forEach((x, i) => { for (let j = 0; j < p.counts[i]; j++) pile.push(i); });
  const sh = shuffle(pile);
  gFrame(`${chart}${p.sort ? `<div class="g3sk-pile" id="skPile">${sh.map((i, j) => `<button class="g3sk-stk gopt" data-c="${i}" data-ok="1" style="--rot:${rnd(-20, 20)}deg" aria-label="${p.kinds[i][2]}">${p.kinds[i][0]}</button>`).join('')}</div>` : ''}<div id="skq" class="g3sk-q">${p.sort ? '' : choicesHTML(p.choices, p.ans)}</div>`,
    p.sort ? 'Tap each sticker to <b class="gnum">sort</b> it!' : p.q, p.sort ? 'Tap each sticker to sort it into its column on the chart!' : p.say + (p.scale > 1 ? ` Each line on the chart counts ${p.scale}.` : ''));
  const ask = () => { $('.ptext').innerHTML = p.q; $('#skq').innerHTML = choicesHTML(p.choices, p.ans); say(p.say); wireChoices(p.ans, p.hint, null, 1400); };
  if (!p.sort) return wireChoices(p.ans, p.hint + (p.scale > 1 ? ` Each line counts ${p.scale}.` : ''), null, 1400);
  const have = Array(k).fill(0);
  view.querySelectorAll('.g3sk-stk').forEach(b => b.onclick = () => {
    if (gm.lock) return; const i = +b.dataset.c; have[i]++;
    $('#sk' + i).insertAdjacentHTML('beforeend', `<i>${p.kinds[i][0]}</i>`); b.remove(); tone([500 + have[i] * 70], .06); say(String(have[i]));
    if (!view.querySelector('.g3sk-stk')) { $('#skPile').remove(); gLater(ask, 500); }
  });
}

/* ---------- 21. Number Detective: picture sudoku, number sudoku and number riddles ---------- */
const FRUIT = [['🍎', 'apple'], ['🍌', 'banana'], ['🍇', 'grapes'], ['🍊', 'orange'], ['🍓', 'strawberry'], ['🍐', 'pear']];
function sdkSolution(n) {
  const bh = 2, bw = n / 2, base = (r, c) => ((r % 2) * bw + Math.floor(r / 2) + c) % n;
  const perm = shuffle(range(0, n - 1));
  const bands = shuffle(range(0, n / bh - 1)), rows = bands.flatMap(b => shuffle(range(0, bh - 1)).map(x => b * bh + x));
  const stacks = shuffle(range(0, n / bw - 1)), cols = stacks.flatMap(s => shuffle(range(0, bw - 1)).map(x => s * bw + x));
  return rows.map(r => cols.map(c => perm[base(r, c)]));
}
const sdkPeers = (n, i) => { const bw = n / 2, r = Math.floor(i / n), c = i % n, br = r - r % 2, bc = c - c % bw, out = new Set();
  for (let k = 0; k < n; k++) { out.add(r * n + k); out.add(k * n + c); } for (let y = br; y < br + 2; y++) for (let x = bc; x < bc + bw; x++) out.add(y * n + x); out.delete(i); return [...out]; };
function sdkCands(n, g, i) { const used = new Set(sdkPeers(n, i).map(j => g[j]).filter(v => v >= 0)); return range(0, n - 1).filter(v => !used.has(v)); }
function sdkSolvable(n, sol, blanks) {
  const g = sol.flat(); blanks.forEach(i => g[i] = -1); let left = blanks.slice();
  while (left.length) { const i = left.find(j => sdkCands(n, g, j).length === 1); if (i == null) return false; g[i] = sol.flat()[i]; left = left.filter(x => x !== i); }
  return true;
}
function riddleMake(d) {
  const [lo, hi] = d <= 4 ? [10, 50] : d === 5 ? [10, 99] : [20, 199];
  const ds = v => String(v).split('').reduce((a, b) => a + +b, 0);
  for (let t = 0; t < 400; t++) {
    const ans = rnd(lo + 2, hi - 2), a = Math.max(lo, ans - rnd(3, 16)), b = Math.min(hi, ans + rnd(3, 16)), o = ans % 10, tn = Math.floor(ans / 10) % 10;
    const P = [
      { t: ans % 2 ? 'I am <b>odd</b>.' : 'I am <b>even</b>.', s: ans % 2 ? 'I am odd.' : 'I am even.', f: v => v % 2 === ans % 2 },
      { t: `My digits add up to <b>${ds(ans)}</b>.`, s: `My digits add up to ${ds(ans)}.`, f: v => ds(v) === ds(ans) },
      { t: `My ones digit is <b>${o}</b>.`, s: `My ones digit is ${o}.`, f: v => v % 10 === o },
      ...(tn !== o ? [{ t: `My tens digit is <b>${tn > o ? 'bigger' : 'smaller'}</b> than my ones digit.`, s: `My tens digit is ${tn > o ? 'bigger' : 'smaller'} than my ones digit.`, f: v => (Math.floor(v / 10) % 10 > v % 10) === (tn > o) && Math.floor(v / 10) % 10 !== v % 10 }] : []),
      ...[3, 4, 5, 6, 7, 9].filter(m => ans % m === 0).slice(0, 1).map(m => ({ t: `I am in the <b>${m} times table</b>.`, s: `I am in the ${m} times table.`, f: v => v % m === 0 })),
      ...(Number.isInteger(Math.sqrt(ans)) ? [{ t: 'I am a <b>square number</b>.', s: 'I am a square number.', f: v => Number.isInteger(Math.sqrt(v)) }] : [])
    ];
    const clues = [{ t: `I am between <b>${a}</b> and <b>${b}</b>.`, s: `I am between ${a} and ${b}.`, f: v => v > a && v < b }];
    let cands = range(a + 1, b - 1);
    for (const p of shuffle(P)) { if (cands.length === 1) break; const nc = cands.filter(p.f); if (nc.length < cands.length) { clues.push(p); cands = nc; } }
    if (cands.length !== 1 || clues.length < 3 || clues.length > 4) continue;
    const near = shuffle(range(a + 1, b - 1).filter(v => v !== ans)), sameP = near.filter(v => v % 2 === ans % 2), others = [...sameP.slice(0, 2), ...near.filter(v => !sameP.slice(0, 2).includes(v))].slice(0, 3);
    if (others.length < 3) continue;
    return { mode: 'riddle', clues, ans, choices: shuffle([ans, ...others]).map(v => ({ html: v, val: v })) };
  }
  return { mode: 'riddle', clues: [{ t: 'I am <b>10 + 2</b>.', s: 'I am 10 plus 2.', f: v => v === 12 }], ans: 12, choices: [11, 12, 13, 14].map(v => ({ html: v, val: v })) };
}
function sdkMake(d) {
  if (d >= 4 && Math.random() < [0, 0, 0, 0, .3, .3, .4][d]) return riddleMake(d);
  const n = d <= 4 ? 4 : 6, nb = [2, 3, 4, 6, 8, 10, 14][d], sol = sdkSolution(n), fruit = d <= 2;
  for (let t = 0; t < 400; t++) {
    let blanks;
    if (d <= 2) { const rows = shuffle(range(0, n - 1)).slice(0, nb), cs = shuffle(range(0, n - 1)); blanks = rows.map((r, j) => r * n + (d === 2 ? cs[j] : rnd(0, n - 1))); }
    else blanks = shuffle(range(0, n * n - 1)).slice(0, nb);
    if (new Set(blanks).size === nb && sdkSolvable(n, sol, blanks)) return { mode: 'grid', n, sol, blanks, fruit };
  }
  return { mode: 'grid', n, sol, blanks: [0], fruit };
}
function sdkQ(d) {
  const p = sdkMake(d);
  if (p.mode === 'riddle') {
    gFrame(`<div class="g3sd-case"><span class="g3sd-glass" aria-hidden="true">🕵️</span><ol class="g3sd-clues">${p.clues.map(c => `<li>${c.t}</li>`).join('')}</ol></div>${choicesHTML(p.choices, p.ans)}`,
      'Which number am I? 🔎', `Number riddle! ${p.clues.map(c => c.s).join(' ')} Which number am I?`);
    return wireChoices(p.ans, v => { const bad = p.clues.find(c => !c.f(+v)); return bad ? `${v} does not fit this clue: ${bad.s} Check each clue in turn.` : 'Check every clue.'; }, null, 1400);
  }
  const { n } = p, bw = n / 2, flat = p.sol.flat(), g = flat.slice(); p.blanks.forEach(i => g[i] = -1);
  const sym = v => p.fruit ? FRUIT[v][0] : String(v + 1), nmS = v => p.fruit ? FRUIT[v][1] : String(v + 1);
  const cellHTML = i => { const r = Math.floor(i / n), c = i % n, cls = `${c % bw === bw - 1 && c < n - 1 ? ' br' : ''}${r % 2 === 1 && r < n - 1 ? ' bb' : ''}${(Math.floor(r / 2) + Math.floor(c / bw)) % 2 ? ' alt' : ''}`;
    return g[i] < 0 ? `<button class="g3sd-cell gopt blank${cls}" data-i="${i}" aria-label="empty square">?</button>` : `<span class="g3sd-cell given${cls}">${sym(g[i])}</span>`; };
  gFrame(`<div class="g3sd-grid${p.fruit ? ' fruit' : ''}" style="--n:${n}">${range(0, n * n - 1).map(cellHTML).join('')}</div>
    <div class="g3sd-pal" style="--n:${n}">${range(0, n - 1).map(v => `<button class="g3sd-key gopt" data-v="${v}" aria-label="${nmS(v)}">${sym(v)}</button>`).join('')}</div>`,
    p.fruit ? `Each row needs ${range(0, n - 1).map(sym).join('')} <b class="gnum">once</b>!` : `Each row, column and box needs <b class="gnum">1 to ${n}</b> once!`,
    p.fruit ? `Every row, every column and every box needs one of each fruit: ${range(0, n - 1).map(nmS).join(', ')}. What goes in the glowing square?` : `Sudoku! Every row, column and box needs each number from 1 to ${n} once. What goes in the glowing square?`);
  let sel = -1;
  const keys = [...view.querySelectorAll('.g3sd-key')], cellEl = i => view.querySelector(`.g3sd-cell[data-i="${i}"]`);
  const choose = i => {
    if (sel >= 0 && cellEl(sel)) cellEl(sel).classList.remove('sel');
    sel = i; cellEl(i).classList.add('sel'); keys.forEach(k => { k.classList.remove('no', 'hint'); k.removeAttribute('data-ok'); if (+k.dataset.v === flat[i]) k.dataset.ok = '1'; });
  };
  const nextCell = () => { const left = p.blanks.filter(i => g[i] < 0); return left.find(i => sdkCands(n, g, i).length === 1) ?? left[0]; };
  const hint = () => {
    const r = Math.floor(sel / n), c = sel % n, row = range(0, n - 1).map(x => r * n + x), col = range(0, n - 1).map(y => y * n + c);
    const br = r - r % 2, bc = c - c % bw, bx = []; for (let y = br; y < br + 2; y++) for (let x = bc; x < bc + bw; x++) bx.push(y * n + x);
    for (const [cells, w] of [[row, 'row'], [col, 'column'], [bx, 'box']]) { const have = cells.filter(j => g[j] >= 0); if (have.length === n - 1) return `This ${w} has ${have.map(j => nmS(g[j])).join(', ')}. Which ${p.fruit ? 'fruit' : 'number'} is missing?`; }
    const seen = [...new Set(sdkPeers(n, sel).map(j => g[j]).filter(v => v >= 0))].sort().map(nmS);
    return `Look across the row, down the column and in the box. You can already see ${seen.join(', ')}. What is left?`;
  };
  view.querySelectorAll('.g3sd-cell.blank').forEach(b => b.onclick = () => { if (gm.lock || g[+b.dataset.i] >= 0) return; choose(+b.dataset.i); tone([600], .05); });
  keys.forEach(k => k.onclick = () => {
    if (gm.lock || sel < 0 || k.classList.contains('no')) return;
    const v = +k.dataset.v;
    if (v !== flat[sel]) { gameMiss(k, `Not ${nmS(v)}. ${hint()}`, view.querySelector('.g3sd-key[data-ok]')); return; }
    g[sel] = v; const c = cellEl(sel); c.classList.remove('sel', 'blank'); c.classList.add('done'); c.textContent = sym(v); c.removeAttribute('data-i');
    tone([660, 880], .06); say(nmS(v));
    if (p.blanks.every(i => g[i] >= 0)) { keys.forEach(x => x.removeAttribute('data-ok')); $('.g3sd-grid').classList.add('solved'); return gameRight(null, 1500, pick(['Puzzle solved! 🔎', 'Case closed, detective! 🕵️', 'You cracked it!'])); }
    choose(nextCell()); if (gm.tries >= 2) view.querySelector('.g3sd-key[data-ok]').classList.add('hint');
  });
  choose(nextCell());
}

if (location.hash === '#selftest') window.__games3 = { scatterDots, snakeMake, snakeRoll, bakeMake, parkMake, monMake, bubMake, stkMake, sdkMake, sdkSolution, sdkSolvable, riddleMake };
})();
