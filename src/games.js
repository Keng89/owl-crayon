/* ---------- math games: quick, playful rounds that grow with the player ---------- */
// Level 0 (age 3-4) to 6 (age 11+). A round starts at the player's level, moves up after 3 first-try wins in a row,
// and the next round starts a step higher after 3 stars (or lower after 1).
const ageLvl = () => st.age <= 4 ? 0 : st.age <= 5 ? 1 : st.age <= 6 ? 2 : st.age <= 7 ? 3 : st.age <= 8 ? 4 : st.age <= 10 ? 5 : 6;
let gm = null, GAME_SECS = 60;
const gLvl = () => clamp(gm.base + gm.boost, 0, 6);
const GAMES = [
  { id: 'balloon', ico: '🎈', name: 'Balloon Pop', blurb: 'Pop the right number', bg: 'var(--coral)', pe: '🎈', n: 10, q: balloonQ },
  { id: 'frog', ico: '🐸', name: 'Frog Hop', blurb: 'Where will the frog land?', bg: 'var(--leaf)', pe: '🪷', n: 8, q: frogQ },
  { id: 'shop', ico: '🛒', name: "Owl's Shop", blurb: 'Pay with coins', bg: 'var(--sun)', ink: 1, pe: '🛍️', n: 8, q: shopQ },
  { id: 'memory', ico: '🃏', name: 'Memory Match', blurb: 'Flip and find pairs', bg: 'var(--grape)', pe: '🃏', start: memoryStart, result: memoryResult },
  { id: 'tower', ico: '🧱', name: 'Build the Tower', blurb: 'Make 10 and more', bg: '#FF8A2B', pe: '🧱', n: 10, q: towerQ },
  { id: 'train', ico: '🚂', name: 'Pattern Train', blurb: 'What comes next?', bg: 'var(--sky)', pe: '🚃', n: 8, q: trainQ },
  { id: 'race', ico: '🦉', name: 'Beat the Owl', blurb: () => st.age >= 7 ? 'A 60-second race' : 'Race the owl, no rush', bg: 'var(--ink)', pe: '🏃', start: raceStart, q: raceQ, result: raceResult }
];

function gamesHome() {
  st.games = st.games || {};
  view.innerHTML = `${crumbs('🎮 Math games')}<p class="note">Pick a game! Each one gets a little harder as you win.</p>
    <div class="gtiles">${GAMES.map((g, i) => { const r = st.games[g.id] || {};
      return `<button class="gtile" data-g="${g.id}" style="background:${g.bg}${g.ink ? ';color:var(--ink)' : ''}"><span class="ico" style="animation-delay:-${i * .4}s">${g.ico}</span>
        <b>${g.name}</b><span>${typeof g.blurb === 'function' ? g.blurb() : g.blurb}</span>
        <span class="gbest" aria-label="best ${r.stars || 0} stars">${[1, 2, 3].map(k => `<i class="${k <= (r.stars || 0) ? 'on' : ''}">⭐</i>`).join('')}</span></button>`; }).join('')}</div>`;
  wireBack(mathHome);
  sayScreen('Pick a game! ' + GAMES.map(g => g.name).join(', ') + '.');
  view.querySelectorAll('[data-g]').forEach(b => b.onclick = () => go(gameStart, b.dataset.g));
}

/* ---------- the round engine every game shares ---------- */
function gameStart(id) {
  st.games = st.games || {};
  const g = GAMES.find(x => x.id === id), rec = st.games[id] || {};
  gm = { g, i: 0, n: g.n || 8, ok: 0, run: 0, boost: 0, tries: 0, base: clamp(ageLvl() + (rec.up || 0), 0, 6) };
  st.plays.math++; save();
  g.start ? g.start() : gameQ();
}
function gameQ() { gm.tries = 0; gm.lock = false; gm.g.q(gLvl()); }
// Runs fn later only if the player is still on the same screen.
function gLater(fn, ms) { const here = view.firstElementChild; setTimeout(() => { if (here && view.firstElementChild === here) fn(); }, ms); }
const gProgress = () => `<div class="gp" aria-label="${gm.i} of ${gm.n}">${Array.from({ length: gm.n }, (_, i) => `<i class="${i === gm.i ? 'now' : ''}">${i < gm.i ? gm.g.pe : ''}</i>`).join('')}</div>`;
function gFrame(body, prompt, speak, top) {
  view.innerHTML = `${crumbs(`${gm.g.ico} ${gm.g.name}`)}
    <div class="game g-${gm.g.id}">${top != null ? top : gProgress()}
      <div class="prompt"><div class="ptext">${prompt}</div><button class="speak" id="spk" aria-label="Read it to me">🔊</button></div>
      ${body}<div class="cheer" id="cheer" aria-live="polite"></div></div>`;
  wireBack(gamesHome);
  const s = speak || prompt; say(s); $('#spk').onclick = () => say(s);
}
function gameRight(el, ms = 1100, words) {
  gm.lock = true; const first = gm.tries === 0;
  if (el) el.classList.add('right');
  if (first) { gm.ok++; if (++gm.run % 3 === 0) gm.boost = Math.min(2, gm.boost + 1); }
  gm.i++; dayLog('q'); if (first) dayLog('ok'); questTick('math');
  if (gm.i >= gm.n) gm.over = true;
  words = words || (first ? pick(['Great job!', 'You got it!', 'Super!', 'Yes!', 'Brilliant!', 'Hooray!']) : 'You did it!');
  const c = $('#cheer'); c.className = 'cheer'; c.textContent = words; yay(); say(words);
  gLater(() => gm.i < gm.n ? gameQ() : gameEnd(), ms);
}
// A wrong tap: wobble, a kind hint, and on the second miss the right answer starts to glow.
function gameMiss(el, hint, okEl) {
  gm.tries++; gm.run = 0; if (gm.tries === 2) gm.boost = Math.max(-1, gm.boost - 1);
  if (el) { el.classList.remove('wob'); void el.offsetWidth; el.classList.add('wob'); if (el.classList.contains('gopt')) el.classList.add('no'); }
  oops(); const c = $('#cheer'); c.className = 'cheer soft'; c.textContent = pick(['Try again!', 'Almost!', 'Try another one!']);
  say(hint || 'Not that one. Try again!');
  if (gm.tries >= 2 && okEl) okEl.classList.add('hint');
}
// Number answer buttons, wired with the shared right/wrong handling.
const choicesHTML = (ch, ans, unit = '') => `<div class="choices gch n${ch.length}" style="--n:${ch.length}">${ch.map(c => `<button class="choice gopt" data-v="${esc(c.val)}"${String(c.val) === String(ans) ? ' data-ok="1"' : ''}${c.label ? ` aria-label="${esc(c.label)}"` : ''}>${c.html}${unit}</button>`).join('')}</div>`;
function wireChoices(ans, hint, onRight, ms) {
  view.querySelectorAll('.gch .gopt').forEach(b => b.onclick = () => {
    if (gm.lock || b.classList.contains('no')) return;
    if (b.dataset.v === String(ans)) { if (onRight) onRight(b); gameRight(b, ms); }
    else gameMiss(b, typeof hint === 'function' ? hint(b.dataset.v) : hint, view.querySelector('.gch [data-ok]'));
  });
}
// Wrong answers near the right one: ans plus some of the given steps.
function nearBy(ans, steps, lo, hi, n) {
  const out = [ans];
  for (const s of shuffle(steps)) { const v = ans + s; if (out.length < n && v >= lo && v <= hi && !out.includes(v)) out.push(v); }
  for (let k = 1; out.length < n && k < 30; k++) for (const v of [ans + k, ans - k]) if (out.length < n && v >= lo && !out.includes(v)) out.push(v);
  return shuffle(out).map(v => ({ html: v, val: v }));
}
function gameEnd() {
  if (!gm || gm.ended) return; gm.ended = gm.over = true; stopCanvas();
  const g = gm.g, rec = st.games[g.id] = Object.assign({ plays: 0, best: 0, stars: 0, up: 0 }, st.games[g.id]);
  const r = Object.assign({ pts: gm.ok, of: gm.n, line: `${gm.ok} of ${gm.n} right on the first try!` }, g.result ? g.result() : {});
  const stars = r.stars || (r.pts >= r.of * .9 ? 3 : r.pts >= r.of * .6 ? 2 : 1);
  const newBest = rec.plays > 0 && r.pts > rec.best;
  rec.plays++; rec.best = Math.max(rec.best, r.pts); rec.stars = Math.max(rec.stars, stars); rec.last = today();
  if (!gm.timed) rec.up = clamp(rec.up + (stars === 3 ? 1 : stars === 1 ? -1 : 0), -1, 2);
  addStars(stars); confetti(); yay();
  const title = r.title || (stars === 3 ? 'Amazing!' : stars === 2 ? 'Well done!' : 'Good try!');
  view.innerHTML = `<div class="view done gdone"><div class="big">${g.ico}</div><h1>${title}</h1>
    <div class="gstars" aria-label="${stars} stars">${[1, 2, 3].map(k => `<span class="${k <= stars ? 'on' : ''}" style="--dl:${k * .25}s">⭐</span>`).join('')}</div>
    <p style="font-weight:800;font-size:22px;margin:0">${r.line}</p>${newBest ? '<p class="tag gnew">🏅 New best!</p>' : ''}
    <div class="row"><button class="btn leaf" id="again">Play again</button><button class="btn alt" id="more">More games</button></div></div>`;
  say(`${title} ${r.line} You earned ${stars} star${stars > 1 ? 's' : ''}!`);
  $('#again').onclick = () => go(gameStart, g.id);
  $('#more').onclick = () => go(gamesHome);
}

/* ---------- questions by level ---------- */
function gArith(d) {
  const r = Math.random();
  if (d <= 0) { const n = rnd(1, 5); return { q: n, ans: n, find: 1, hint: `Look for the number ${n}.` }; }
  if (d === 1) {
    if (r < .45) { const n = rnd(1, 10); return { q: n, ans: n, find: 1, hint: `Look for the number ${n}.` }; }
    if (r < .7) { const n = rnd(1, 9), up = Math.random() < .6; return { q: `1 ${up ? 'more' : 'less'} than ${n}`, ans: up ? n + 1 : n - 1, hint: `What number comes ${up ? 'after' : 'before'} ${n}?` }; }
    const a = rnd(1, 5), b = rnd(1, 4); return { q: `${a} + ${b}`, ans: a + b, hint: `Start at ${a} and count on ${b}.` };
  }
  const add = (a, b) => ({ q: `${a} + ${b}`, ans: a + b, hint: `Start at ${a} and count on ${b}.` });
  const sub = (a, b) => ({ q: `${a} − ${b}`, ans: a - b, hint: `Start at ${a} and count back ${b}.` });
  const mul = (a, b) => ({ q: `${a} × ${b}`, ans: a * b, hint: `${a} groups of ${b}.` });
  const div = (b, n) => ({ q: `${b * n} ÷ ${b}`, ans: n, hint: `How many ${b}s make ${b * n}?` });
  if (d === 2) { if (r < .65) { const a = rnd(1, 9); return add(a, rnd(1, 10 - a)); } const a = rnd(3, 10); return sub(a, rnd(1, a - 1)); }
  if (d === 3) { if (r < .55) { const a = rnd(3, 15); return add(a, rnd(2, 20 - a)); } return sub(rnd(10, 20), rnd(2, 9)); }
  if (d === 4) { if (r < .35) { const a = rnd(12, 89); return add(a, rnd(2, Math.min(9, 99 - a))); } if (r < .6) return sub(rnd(20, 99), rnd(2, 9)); return mul(rnd(2, 10), pick([2, 5, 10])); }
  if (d === 5) { if (r < .3) return add(rnd(11, 60), rnd(11, 39)); if (r < .45) { const a = rnd(30, 99); return sub(a, rnd(11, a - 10)); } if (r < .75) return mul(rnd(2, 10), rnd(2, 10)); return div(rnd(2, 10), rnd(2, 10)); }
  if (r < .2) return add(rnd(100, 500), rnd(25, 399));
  if (r < .35) { const a = rnd(200, 900); return sub(a, rnd(25, a - 50)); }
  if (r < .45) { const n = rnd(2, 12); return { q: `${n}²`, ans: n * n, hint: `${n} squared is ${n} × ${n}.` }; }
  if (r < .75) return mul(rnd(3, 12), rnd(3, 12));
  return div(rnd(3, 12), rnd(2, 12));
}
const ansChoices = (a, n) => a.ans > 20 ? nearBy(a.ans, [10, -10, 1, -1, 2, -2, 5], 0, 2000, n) : numChoices(a.ans, a.find ? 1 : 0, Math.max(a.ans + 6, 12), n);

/* ---------- 1. Balloon Pop ---------- */
function balloonQ(d) {
  const a = gArith(d), ch = ansChoices(a, d <= 1 ? 4 : 5), cols = shuffle(COLORS);
  gFrame(`<div class="sky"><span class="cloud c1">☁️</span><span class="cloud c2">☁️</span>${ch.map((c, i) => `<button class="balloon gopt" data-v="${c.val}"${c.val === a.ans ? ' data-ok="1"' : ''}
      style="--c:${cols[i % 6][0]};--t:${cols[i % 6][1] === 'yellow' ? 'var(--ink)' : '#fff'};--d:${(i * .12 + Math.random() * .2).toFixed(2)}s;--y:${rnd(0, 60)}px">${c.val}</button>`).join('')}</div>`,
    a.find ? `Pop the <b class="gnum">${a.ans}</b>!` : `Pop <span class="gnum">${a.q}</span>`,
    a.find ? `Pop the balloon with ${a.ans}!` : `What is ${a.q}? Pop the balloon with the answer!`);
  view.querySelectorAll('.balloon').forEach(b => b.onclick = () => {
    if (gm.lock || b.classList.contains('no')) return;
    if (+b.dataset.v === a.ans) { b.textContent = '💥'; b.classList.add('pop'); tone([880, 1175], .07); gameRight(null, 1000); }
    else gameMiss(b, a.find ? `That one is ${b.dataset.v}. Find ${a.ans}!` : `Not ${b.dataset.v}. ${a.hint}`, $('.balloon[data-ok]'));
  });
}

/* ---------- 2. Frog Hop: a number track of lily pads ---------- */
function frogQ(d) {
  let step = 1, len = d === 3 ? 20 : 10, s, h;
  if (d >= 4) step = pick(d === 4 ? [2, 5, 10] : d === 5 ? [3, 4, 6, 7, 8, 9] : [6, 7, 8, 9, 11, 12]);
  const back = Math.random() < [0, .25, .4, .4, .3, .3, .35][d], maxH = [3, 4, 5, 9, 6, 8, 9][d];
  if (back) { s = rnd(3, len); h = rnd(1, Math.min(maxH, s)); }
  else { s = d >= 5 && Math.random() < .6 ? 0 : rnd(0, d <= 0 ? 4 : len - 2); h = rnd(1, Math.min(maxH, len - s)); }
  const ans = back ? s - h : s + h, v = k => k * step;
  const label = k => d <= 2 || d === 4 || k === s || (d === 3 ? k % 5 === 0 : k % 2 === 0);
  const prompt = step === 1 ? `🐸 is on <b>${s}</b>. Hop <b>${h}</b> ${back ? 'back' : 'more'}!` : `🐸 is on <b>${v(s)}</b>. <b>${h}</b> jumps of <b>${step}</b>${back ? ' back' : ''}!`;
  const speak = step === 1 ? `The frog is on ${s}. It hops ${h} ${back ? 'back' : 'more'}. Tap where it lands!` : `The frog is on ${v(s)}. It makes ${h} jumps of ${step}, going ${back ? 'back' : 'forward'}. Tap where it lands!`;
  const hint = step === 1 ? `Start on ${s} and count ${h} hop${h > 1 ? 's' : ''} ${back ? 'back' : 'forward'}.` : `Count by ${step}s from ${v(s)}, ${h} times${back ? ', going back' : ''}.`;
  gFrame(`<div class="pond"><div class="pads" style="--cols:${len === 20 ? 7 : 11}">${Array.from({ length: len + 1 }, (_, k) =>
      `<button class="pad gopt${label(k) ? '' : ' blank'}${k === s ? ' start' : ''}" data-k="${k}"${k === ans ? ' data-ok="1"' : ''} aria-label="${v(k)}">${label(k) ? v(k) : ''}</button>`).join('')}</div>
      <span class="frog" id="frog" aria-hidden="true">🐸</span></div>`, prompt, speak);
  const frog = $('#frog'), pads = [...view.querySelectorAll('.pad')];
  const place = k => { const p = pads[k]; frog.style.left = p.offsetLeft + p.offsetWidth / 2 + 'px'; frog.style.top = p.offsetTop + 'px'; };
  frog.style.transition = 'none'; place(s); void frog.offsetWidth; frog.style.transition = '';
  pads.forEach(p => p.onclick = () => {
    if (gm.lock || p.classList.contains('no')) return;
    if (+p.dataset.k === s) { say(`The frog is already on ${v(s)}. ${hint}`); return; }
    if (+p.dataset.k !== ans) return gameMiss(p, hint, pads[ans]);
    for (let j = 1; j <= h; j++) gLater(() => { place(back ? s - j : s + j); tone([380 + j * 50], .08); if (frog.animate) frog.animate([{ marginTop: '0px' }, { marginTop: '-26px' }, { marginTop: '0px' }], 280); }, j * 320);
    gameRight(p, h * 320 + 900);
  });
}

/* ---------- 3. Owl's Shop: pay with coins, or work out the change ---------- */
const SHOP_ITEMS = [['🍎', 'apple'], ['🧸', 'teddy bear'], ['🍪', 'cookie'], ['🎈', 'balloon'], ['🖍️', 'crayon'], ['🍌', 'banana'], ['🚗', 'toy car'], ['⚽', 'ball'], ['🍦', 'ice cream'], ['📚', 'book'], ['🦕', 'dinosaur'], ['🪀', 'yo-yo'], ['🧃', 'juice'], ['🪁', 'kite']];
const shopCounter = (e, price) => `<div class="counter"><span class="keeper" aria-hidden="true">🦉</span><div class="item"><span>${e}</span><b class="price">${price}¢</b></div></div>`;
function shopQ(d) {
  const [e, name] = pick(SHOP_ITEMS);
  if (d >= 5 && Math.random() < .45) {
    const pay = d >= 6 ? pick([100, 100, 50]) : pick([20, 50, 100]), price = rnd(Math.ceil(pay * .3), pay - 1), ans = pay - price;
    gFrame(`<div class="shop" data-price="${price}">${shopCounter(e, price)}<div class="paywith"><b>You pay</b>${coin(pay)}<b>Your change?</b></div>
      ${choicesHTML(nearBy(ans, [10, -10, 1, -1, 5, -5], 1, pay, 4), ans, '¢')}</div>`,
      `The ${name} costs ${price}¢. You pay ${pay}¢. How much change?`, `The ${name} costs ${price} cents. You pay with ${pay} cents. How much change do you get back?`);
    return wireChoices(ans, `Count up from ${price} to ${pay}.`, () => $('.item').classList.add('sold'), 1300);
  }
  const kinds = [[1], [1, 5], [1, 5, 10], [1, 5, 10], [1, 5, 10, 20, 50], [1, 2, 5, 10, 20, 50], [1, 5, 10, 20, 50, 100]][d];
  const price = [rnd(1, 5), rnd(2, 10), rnd(6, 20), rnd(11, 50), rnd(20, 99), rnd(25, 99), rnd(60, 199)][d];
  gFrame(`<div class="shop" data-price="${price}">${shopCounter(e, price)}
    <div class="purse" id="purse"><div class="paid" id="paid"></div><b class="tot" id="tot">Tap the coins to pay</b></div>
    <div class="tray">${kinds.map(v => `<button class="cbtn" data-c="${v}">${coin(v)}</button>`).join('')}</div></div>`,
    `Pay <b class="gnum">${price}¢</b> for the ${name}!`, `The ${name} costs ${price} cents. Tap the coins to pay ${price} cents.`);
  let paid = [];
  const total = () => paid.reduce((a, b) => a + b, 0);
  const show = () => {
    $('#paid').innerHTML = paid.map((v, i) => `<button class="pc" data-i="${i}" aria-label="Give back ${v} cents">${coin(v)}</button>`).join('');
    $('#tot').textContent = paid.length ? `You paid ${total()}¢` : 'Tap the coins to pay';
    view.querySelectorAll('.pc').forEach(b => b.onclick = () => { if (gm.lock) return; paid.splice(+b.dataset.i, 1); show(); tone([300]); });
  };
  view.querySelectorAll('.cbtn').forEach(b => b.onclick = () => {
    if (gm.lock || paid.length >= 20) return;
    paid.push(+b.dataset.c); show(); const t = total();
    if (t === price) { $('.item').classList.add('sold'); gameRight($('#purse'), 1400, `Thank you! 🛍️`); }
    else if (t > price) gameMiss($('#purse'), `That is ${t} cents. Too much! Tap a coin in your purse to give it back.${gm.tries >= 1 ? ' Start with the biggest coin that fits.' : ''}`);
    else { tone([500 + t * 4], .06); if (d <= 2) say(String(t)); }
  });
}

/* ---------- 4. Memory Match: one board, find every pair ---------- */
const mdots = n => `<span class="mdots" aria-hidden="true">${'<i></i>'.repeat(n)}</span>`;
function memoryStart() {
  const d = gLvl(), pairs = d <= 0 ? 3 : d <= 2 ? 4 : 6, keys = new Set(), cards = [];
  for (let t = 0; keys.size < pairs && t < 300; t++) {
    if (d <= 1) { const n = rnd(1, d ? 10 : 5); if (keys.has(n)) continue; keys.add(n); cards.push({ k: n, h: mdots(n), s: '' }, { k: n, h: `<b class="mnum">${n}</b>`, s: String(n) }); }
    else { const a = gArith(d); if (keys.has(a.ans)) continue; keys.add(a.ans); cards.push({ k: a.ans, h: `<span class="mexpr">${a.q}</span>`, s: String(a.q) }, { k: a.ans, h: `<b class="mnum">${a.ans}</b>`, s: String(a.ans) }); }
  }
  gm.n = keys.size;
  const deck = shuffle(cards), back = '<span class="mback">🦉</span>';
  gFrame(`<div class="mgrid m${deck.length}" style="--mc:${deck.length <= 6 ? 3 : 4}">${deck.map((c, j) => `<button class="mcard" data-j="${j}" data-k="${c.k}" aria-label="card ${j + 1}">${back}</button>`).join('')}</div>`,
    d <= 1 ? 'Match the dots to the number!' : 'Match each question to its answer!',
    d <= 1 ? 'Flip two cards. Find the dots and the number that match!' : 'Flip two cards. Find a question and its answer!');
  let open = [], miss = 0;
  view.querySelectorAll('.mcard').forEach(b => b.onclick = () => {
    if (open.length > 1 || b.classList.contains('up')) return;
    const c = deck[+b.dataset.j]; b.classList.add('up'); b.innerHTML = c.h; tone([620 + open.length * 120], .08); if (c.s) say(c.s);
    open.push(b); if (open.length < 2) return;
    const [x, y] = open;
    if (x.dataset.k === y.dataset.k) {
      open = []; gm.i++; x.classList.add('got'); y.classList.add('got'); dayLog('q'); questTick('math'); yay();
      $('#cheer').textContent = pick(['A pair!', 'Match!', 'Great memory!']); $('.gp').outerHTML = gProgress();
      if (gm.i === gm.n) { gm.ok = clamp(gm.n - Math.ceil(Math.max(0, miss - gm.n) / 2), 0, gm.n); dayLog('ok', gm.ok); gLater(gameEnd, 1300); }
    } else { miss++; tone([392], .1); gLater(() => { [x, y].forEach(z => { z.classList.remove('up'); z.innerHTML = back; }); open = []; }, 1100); }
  });
}
function memoryResult() { return { line: gm.ok === gm.n ? `You found all ${gm.n} pairs with a super memory!` : `You found all ${gm.n} pairs!` }; }

/* ---------- 5. Build the Tower: number bonds ---------- */
function towerQ(d) {
  const T = d <= 0 ? 5 : d <= 2 ? (d === 1 && Math.random() < .3 ? 5 : 10) : d === 3 ? pick([10, 20]) : d === 6 && Math.random() < .5 ? 1000 : 100;
  const a = T <= 20 ? rnd(1, T - 1) : d === 4 ? rnd(1, 9) * 10 : T === 1000 ? rnd(1, 19) * 50 : rnd(11, 89), ans = T - a;
  const c = pick(['#F2604F', '#2E8BE6', '#6D55D1', '#2FA36B']);
  const vis = T <= 20 ? `<div class="bricks" style="--bc:${Math.min(T, 10)}">${Array.from({ length: T }, (_, i) => `<i class="${i < a ? 'on' : 'off'}" style="--c:${c};--dl:${((i - a) * .06).toFixed(2)}s"></i>`).join('')}</div>`
    : `<div class="bar2wrap"><b>${T}</b><div class="bar2"><span style="flex:${a}">${a}</span><span class="q" style="flex:${ans}">?</span></div></div>`;
  const ch = T <= 20 ? numChoices(ans, 0, T, d <= 1 ? 3 : 4) : nearBy(ans, T === 1000 ? [50, -50, 100, -100] : d === 4 ? [10, -10, 20, 1] : [10, -10, 1, -1, 2], 0, T, 4);
  gFrame(`${vis}${choicesHTML(ch, ans)}`, T <= 20 ? `Make <b class="gnum">${T}</b>! How many more?` : `<b>${a}</b> + <b class="gnum">?</b> = <b>${T}</b>`,
    T <= 20 ? `You have ${a} block${a > 1 ? 's' : ''}. How many more make ${T}?` : `${a} and what make ${T}?`);
  wireChoices(ans, T <= 20 ? 'Count the empty spaces.' : `Count up from ${a} to ${T}.`, () => {
    view.querySelectorAll('.bricks .off').forEach(i => i.className = 'fill');
    const q = $('.bar2 .q'); if (q) { q.textContent = ans; q.classList.add('fillq'); }
  }, 1400);
}

/* ---------- 6. Pattern Train ---------- */
const PAT_SETS = [[['🔴', 'red'], ['🔵', 'blue'], ['🟡', 'yellow'], ['🟢', 'green']], [['🍎', 'apple'], ['🍌', 'banana'], ['🍇', 'grapes'], ['🍊', 'orange']],
  [['🐶', 'dog'], ['🐱', 'cat'], ['🐰', 'bunny'], ['🐸', 'frog']], [['⭐', 'star'], ['🌙', 'moon'], ['❤️', 'heart'], ['🔷', 'diamond']]];
const seqRun = (a, f, n = 6) => { const o = [a]; while (o.length < n) o.push(f(o[o.length - 1], o.length)); return o; };
const NUM_SEQS = [null, null,
  [() => seqRun(rnd(0, 10), x => x + 1), () => seqRun(rnd(0, 3) * 2, x => x + 2)],
  [() => seqRun(rnd(0, 9), x => x + 2), () => seqRun(rnd(0, 4) * 5, x => x + 5), () => seqRun(rnd(1, 9), x => x + 10), () => seqRun(rnd(10, 20), x => x - 1), () => seqRun(rnd(12, 20), x => x - 2)],
  [() => seqRun(rnd(0, 10), x => x + 3), () => seqRun(rnd(0, 10), x => x + 4), () => seqRun(rnd(1, 4) + 5 * rnd(0, 4), x => x + 5), () => seqRun(rnd(11, 40), x => x + 10), () => seqRun(rnd(60, 99), x => x - 5), () => seqRun(rnd(1, 3), x => x * 2)],
  [() => { const s = rnd(6, 9); return seqRun(rnd(0, 20), x => x + s); }, () => seqRun(rnd(0, 4) * 25, x => x + 25), () => { const s = rnd(3, 9); return seqRun(rnd(60, 99), x => x - s); }, () => seqRun(rnd(1, 5), x => x * 2), () => seqRun(rnd(1, 2), x => x * 3)],
  [() => { const k = rnd(1, 5); return seqRun(k * k, (x, i) => (k + i) * (k + i)); }, () => seqRun(rnd(1, 10), (x, i) => x + i), () => { const o = [rnd(1, 3)]; o.push(o[0] + rnd(0, 2)); while (o.length < 6) o.push(o[o.length - 1] + o[o.length - 2]); return o; },
    () => seqRun(pick([3, 5, 7]) * 32, x => x / 2), () => { const s = rnd(11, 19); return seqRun(rnd(0, 30), x => x + s); }]];
function trainQ(d) {
  const ncol = ['#F2604F', '#2E8BE6', '#2FA36B', '#6D55D1', '#FF8A2B'];
  let cars, ans, ch, speak, hint;
  if (d <= 1 || (d === 2 && Math.random() < .4)) {
    const set = shuffle(pick(PAT_SETS)), u = pick(d <= 0 ? ['AB'] : d === 1 ? ['AB', 'AAB', 'ABB', 'ABC'] : ['ABC', 'AABB', 'ABCC', 'ABCD']);
    const shown = u.length === 4 ? 7 : 6, seq = Array.from({ length: shown }, (_, i) => set['ABCD'.indexOf(u[i % u.length])]), nx = set['ABCD'.indexOf(u[shown % u.length])];
    const opt = [...new Set(u)].map(ch => set['ABCD'.indexOf(ch)]); if (opt.length < 3) opt.push(set[opt.length]);
    cars = seq.map(([e], i) => `<span class="car pic" style="--c:${ncol[i % 5]}">${e}</span>`).join('') + '<span class="car q">?</span>';
    ans = nx[1]; ch = shuffle(opt).map(([e, w]) => ({ html: e, val: w, label: w }));
    speak = `${seq.map(x => x[1]).join(', ')}. What comes next on the train?`; hint = `Say the pattern out loud: ${u.split('').map(c => set['ABCD'.indexOf(c)][1]).join(', ')}, and again.`;
    gFrame(`<div class="rail"><div class="train" id="train"><span class="engine">🚂</span>${cars}</div></div>${choicesHTML(ch, ans)}`, 'What comes next?', speak);
    return wireChoices(ans, hint, () => { const q = $('.car.q'); q.textContent = nx[0]; q.className = 'car pic got'; gLater(() => $('#train').classList.add('go'), 450); }, 1700);
  }
  const seq = pick(NUM_SEQS[Math.min(d, 6)])(), gap = d >= 4 && Math.random() < .3 ? rnd(2, 4) : 5, diff = seq[gap] - seq[gap - 1];
  ans = seq[gap];
  cars = seq.map((v, i) => i === gap ? '<span class="car q">?</span>' : `<span class="car" style="--c:${ncol[i % 5]}">${v}</span>`).join('');
  ch = nearBy(ans, [diff, -diff, 1, -1, 2], 0, 9999, d <= 2 ? 3 : 4);
  gFrame(`<div class="rail"><div class="train" id="train"><span class="engine">🚂</span>${cars}</div></div>${choicesHTML(ch, ans)}`,
    gap === 5 ? 'What number comes next?' : 'Which number is missing?', `${seq.map((v, i) => i === gap ? 'what' : v).join(', ')}. ${gap === 5 ? 'What number comes next?' : 'Which number is missing?'}`);
  wireChoices(ans, 'Look at how the numbers change from one car to the next.', () => { const q = $('.car.q'); q.textContent = ans; q.className = 'car got'; gLater(() => $('#train').classList.add('go'), 450); }, 1700);
}

/* ---------- 7. Beat the Owl: a race. Ages 7+ race a 60-second clock; younger players never run out of time. ---------- */
const lanePos = f => `calc((100% - 44px) * ${clamp(f, 0, 1).toFixed(3)})`;
function raceStart() {
  const rec = st.games.race || {};
  gm.timed = st.age >= 7; gm.n = gm.timed ? clamp(rec.owl || 4 + 2 * gLvl(), 6, 40) : 10; gm.t0 = Date.now();
  if (gm.timed) { const iv = setInterval(raceTick, 250); canvasCleanup = () => clearInterval(iv); }
  gameQ();
}
function raceTick() {
  if (!gm || gm.over || !$('.g-race')) return;
  const f = (Date.now() - gm.t0) / 1000 / GAME_SECS, o = $('#owlR'), t = $('#tbar');
  if (o) o.style.left = lanePos(f); if (t) t.style.width = Math.max(0, 100 - f * 100) + '%';
  if (f >= 1) gameEnd();
}
function raceQ(d) {
  const a = gArith(d), me = (profileOf(pid) || profiles[0]).avatar;
  const owlF = gm.timed ? (Date.now() - gm.t0) / 1000 / GAME_SECS : gm.i * .85 / gm.n;
  const top = `<div class="track"><div class="lane"><span class="runner" id="meR" style="left:${lanePos(gm.i / gm.n)}">${me}</span></div>
    <div class="lane"><span class="runner" id="owlR" style="left:${lanePos(owlF)}">🦉</span></div><span class="finish" aria-hidden="true">🏁</span></div>
    ${gm.timed ? `<div class="tbar" aria-hidden="true"><i id="tbar" style="width:${Math.max(0, 100 - owlF * 100)}%"></i></div>` : `<div class="note">${gm.i} of ${gm.n}</div>`}`;
  let body, prompt, speak;
  if (a.find) { const [e, w] = pick(THINGS); body = `<div class="visual">${objs(a.ans, e)}</div>`; prompt = `How many ${w}?`; speak = prompt; }
  else { body = ''; prompt = `<span class="gexpr">${a.q} = ?</span>`; speak = `What is ${a.q}?`; }
  gFrame(body + choicesHTML(a.find ? numChoices(a.ans, 1, 12, 3) : ansChoices(a, d <= 2 ? 3 : 4), a.ans), prompt, speak, top);
  wireChoices(a.ans, v => a.find ? 'Touch each one and count.' : `Not ${v}. ${a.hint}`, () => {
    $('#meR').style.left = lanePos((gm.i + 1) / gm.n);
    if (!gm.timed) $('#owlR').style.left = lanePos((gm.i + 1) * .85 / gm.n);
  }, gm.timed ? 550 : 1000);
}
function raceResult() {
  if (!gm.timed) return { line: `You won the race! ${gm.ok} of ${gm.n} right on the first try.`, title: 'You beat the Owl!' };
  const rec = st.games.race, won = gm.i >= gm.n;
  rec.owl = won ? Math.min(40, gm.n + 1) : Math.max(6, Math.min(gm.n - 1, gm.i + 2));
  return { pts: gm.i, of: gm.n, stars: won ? 3 : gm.i >= gm.n * .7 ? 2 : 1, title: won ? 'You beat the Owl!' : 'What a race!',
    line: won ? `You answered ${gm.i} before the Owl reached the flag!` : `You answered ${gm.i}. The Owl needed ${gm.n}. So close!` };
}

if (location.hash === '#selftest') window.__games = { GAMES, gArith, get gm() { return gm; }, set secs(v) { GAME_SECS = v; } };
