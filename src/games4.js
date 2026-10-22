/* ---------- games4: Toy Shop and Clock Race, sharing the round engine in games.js and the widgets in math5.js ---------- */
// Everything lives inside this function so its names never clash with the rest of the app.
(() => {
const CO = [1, 2, 5, 10, 20, 50], NO = [100, 500, 1000, 2000];
const split4 = (c, set) => { const out = []; for (const d of [...set].sort((a, b) => b - a)) while (c >= d) { out.push(d); c -= d; } return out; };
const TOYS = [['🧸', 'teddy bear'], ['🚗', 'toy car'], ['🪀', 'yo-yo'], ['🎈', 'balloon'], ['🪁', 'kite'], ['🦕', 'dinosaur'], ['🎲', 'dice'], ['🧩', 'puzzle'], ['🚂', 'toy train'], ['⚽', 'ball'], ['🤖', 'robot'], ['🪆', 'doll'], ['🛹', 'skateboard'], ['🎨', 'paint set']];
const PALS = [['🐰', 'Bunny'], ['🐻', 'Bear'], ['🦊', 'Fox'], ['🐼', 'Panda'], ['🐨', 'Koala'], ['🐸', 'Frog']];
const ok = c => c ? ' data-ok="1"' : '';
const tag = (e, p, cls = '') => `<span class="g4toy ${cls}"><span class="g4e">${e}</span><b class="g4tag">${cash(p)}</b></span>`;
// In #selftest the current round's answer is kept on gm.cur, so tests can play exactly.
const cur = (kind, ans) => { if (location.hash === '#selftest') gm.cur = { kind, ans }; };

GAMES.push(
  { id: 'toys', ico: '🧸', name: 'Toy Shop', blurb: () => ageLvl() >= 4 ? 'Pay, add up and give change' : 'Buy toys with coins', bg: '#D9534F', pe: '🧸', n: 8, q: toysQ },
  { id: 'clockrace', ico: '⏰', name: 'Clock Race', blurb: 'Match and set the clocks', bg: '#2B6CB0', pe: '⏰', n: 8, start: clockStart, q: clockQ, result: clockResult }
);

/* ---------- 22. Toy Shop ---------- */
const shopTray = d => [[1], [1, 2], [1, 2, 5], [1, 2, 5, 10], CO, [...CO, 100, 500], [...CO, ...NO]][d];
const shopPrice = d => [rnd(1, 4), rnd(2, 8), rnd(5, 15), rnd(11, 40), rnd(21, 99), rnd(21, 199) * 5, rnd(41, 399) * 5][d];
function toysQ(d) {
  const kinds = d <= 1 ? ['afford', 'pay'] : d <= 3 ? ['afford', 'pay', 'basket'] : ['pay', 'basket', 'change'], kind = kinds[gm.i % kinds.length];
  const [e, nm] = pick(TOYS);
  if (kind === 'afford') {
    const purse = Array.from({ length: rnd(2, d === 0 ? 3 : 4) }, () => pick(shopTray(Math.min(d + 1, 3)))), have = purse.reduce((a, b) => a + b, 0);
    const yes = rnd(Math.max(1, have - 3), have), toys = shuffle(TOYS).slice(0, 3), prices = shuffle([yes, have + rnd(1, 3), have + rnd(4, 9)]);
    const yi = prices.indexOf(yes); cur('afford', yi);
    gFrame(`<div class="g4purse"><b>Your purse</b>${purse.sort((a, b) => b - a).map(cashPicG).join('')}</div>
      <div class="choices gch g4shelf">${toys.map((t, i) => `<button class="choice gopt" data-v="${i}"${ok(i === yi)} aria-label="${t[1]}, ${cashSay(prices[i])}">${tag(t[0], prices[i])}</button>`).join('')}</div>`,
      `You have <b class="gnum">${cash(have)}</b>. Which toy can you buy?`, `Count your money: you have ${cashSay(have)}. Which toy can you buy?`);
    return wireChoices(yi, v => `That one costs ${cashSay(prices[+v])}. You only have ${cashSay(have)}. Find a price that is not more than ${cashSay(have)}.`, () => {}, 1300);
  }
  if (kind === 'basket') {
    const [a, b] = shuffle(TOYS).slice(0, 2), pa = shopPrice(Math.max(1, d - 1)), pb = shopPrice(Math.max(1, d - 1)), ans = pa + pb, step = pa > 100 ? 100 : 10;
    cur('basket', ans);
    const ch = nearBy(ans, [step, -step, 1, -1, 5, -5], 1, 99999, 4).map(c => ({ html: cash(c.val), val: c.val, label: cashSay(c.val) }));
    gFrame(`<div class="g4basket">${tag(a[0], pa)}<span class="g4plus">+</span>${tag(b[0], pb)}</div>${choicesHTML(ch, ans)}`,
      `How much for the ${a[1]} and the ${b[1]}?`, `The ${a[1]} costs ${cashSay(pa)} and the ${b[1]} costs ${cashSay(pb)}. How much for both?`);
    return wireChoices(ans, `Add the two prices: ${cash(pa)} plus ${cash(pb)}.`, null, 1300);
  }
  const change = kind === 'change', tray = change ? (d >= 5 ? [...CO, 100, 500] : CO) : shopTray(d);
  let price = shopPrice(d), paid = 0, target = price, who = pick(PALS);
  if (change) { paid = d >= 6 ? 2000 : d >= 5 ? pick([500, 1000]) : pick([20, 50, 100]); price = rnd(Math.ceil(paid * .3), paid - 1); if (d >= 5) price = clamp(Math.round(price / 5) * 5, 5, paid - 5); target = paid - price; }
  cur(change ? 'change' : 'pay', target);
  gFrame(`<div class="g4counter">${change ? `<span class="g4pal">${who[0]}</span>` : ''}${tag(e, price)}${change ? `<span class="g4paid"><b>${who[1]} pays</b>${cashPicG(paid)}</span>` : ''}</div><div class="g4mx" id="g4mx"></div>`,
    change ? `${who[1]} pays ${cash(paid)}. Give <b class="gnum">change</b>!` : `Pay <b class="gnum">${cash(price)}</b> for the ${nm}!`,
    change ? `You are the shopkeeper! The ${nm} costs ${cashSay(price)}. ${who[1]} pays with ${cashSay(paid)}. Tap the coins to give the change.` : `The ${nm} costs ${cashSay(price)}. Tap the money to pay exactly ${cashSay(price)}.`);
  const w = MX.pay.mount($('#g4mx'), { tray, change }, target, t => {
    if (gm.lock) return;
    if (t === target) { w.lock(); gameRight($('.g4counter'), 1400, change ? 'Thank you! Right change! 🛍️' : 'Thank you! 🛍️'); }
    else if (t > target) gameMiss($('.g4counter'), `That is ${cashSay(t)}. Too much! Tap money on the counter to take it back.${gm.tries >= 1 ? ` ${w.hint()}` : ''}`, null, 'Too much!');
    else if (d <= 2) say(cashSay(t));
  });
}
const cashPicG = v => `<span class="g4m">${(v >= 100 ? noteSVGg : coinSVGg)(v)}</span>`;
// The money pictures from math5.js are inside its own function, so draw small ones here.
const coinSVGg = v => `<svg viewBox="0 0 40 40" class="m5coin" style="width:46px" role="img" aria-label="${cashSay(v)} coin"><circle cx="20" cy="20" r="18.5" fill="${v <= 2 ? '#D98C4A' : v <= 10 ? '#C9D1DA' : '#F0CB55'}" stroke="#22305A" stroke-width="2"/><text x="20" y="25.5" font-size="${String(v).length > 1 ? 12.5 : 14}" font-weight="800" text-anchor="middle" fill="#22305A">${v}${curOf().small}</text></svg>`;
const noteSVGg = v => `<svg viewBox="0 0 100 52" class="m5note" role="img" aria-label="${cashSay(v)} note"><rect x="2" y="2" width="96" height="48" rx="6" fill="${{ 100: '#8DCB9C', 500: '#8EBEEB', 1000: '#F4B26E', 2000: '#C3AEE6' }[v]}" stroke="#22305A" stroke-width="2.5"/><text x="50" y="34" font-size="20" font-weight="800" text-anchor="middle" fill="#22305A">${cash(v)}</text></svg>`;

/* ---------- 23. Clock Race: race the Owl. Each right clock moves you on; a wrong one lets the Owl catch up. ---------- */
const tS = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
const nH = h => h % 12 + 1;
const words = (h, m) => m === 0 ? `${h} o'clock` : m === 30 ? `half past ${h}` : m === 15 ? `quarter past ${h}` : m === 45 ? `quarter to ${nH(h)}` : m < 30 ? `${m} minutes past ${h}` : `${60 - m} minutes to ${nH(h)}`;
const minsFor = d => d <= 0 ? [0] : d === 1 ? [0, 30] : d === 2 ? [0, 30, 15] : d === 3 ? [15, 30, 45] : d <= 5 ? Array.from({ length: 12 }, (_, i) => i * 5) : Array.from({ length: 60 }, (_, i) => i);
const face = (h, m) => { // a small clock face drawn here (the math5 one is private to that file)
  let g = '<circle cx="50" cy="50" r="46" fill="#fff" stroke="#22305A" stroke-width="4"/>';
  for (let i = 1; i <= 12; i++) { const a = i * Math.PI / 6; g += `<text x="${(50 + 34 * Math.sin(a)).toFixed(1)}" y="${(54 - 34 * Math.cos(a)).toFixed(1)}" font-size="11" font-weight="800" text-anchor="middle" fill="#22305A">${i}</text>`; }
  const hand = (deg, len, w, c) => `<line x1="50" y1="50" x2="${(50 + len * Math.sin(deg * Math.PI / 180)).toFixed(1)}" y2="${(50 - len * Math.cos(deg * Math.PI / 180)).toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  return `<svg class="g4face" viewBox="0 0 100 100" role="img" aria-label="clock showing ${words(h, m)}">${g}${hand(((h % 12) + m / 60) * 30, 24, 5, '#22305A')}${hand(m * 6, 36, 3.5, '#F2604F')}<circle cx="50" cy="50" r="3.5" fill="#22305A"/></svg>`;
};
function clockStart() { gm.owl = 0; gameQ(); }
function clockTrack() {
  const me = (() => { try { return (profileOf(pid) || profiles[0]).avatar; } catch (e) { return '🧒'; } })();
  return `<div class="track"><div class="lane"><span class="runner" id="meR" style="left:${lanePos(gm.i / gm.n)}">${me}</span></div>
    <div class="lane"><span class="runner" id="owlR" style="left:${lanePos(gm.owl / gm.n)}">🦉</span></div><span class="finish" aria-hidden="true">🏁</span></div><div class="note">${gm.i} of ${gm.n}</div>`;
}
const owlStep = f => { gm.owl = Math.min(gm.n, gm.owl + f); const o = $('#owlR'); if (o) o.style.left = lanePos(gm.owl / gm.n); };
const meStep = () => { const m = $('#meR'); if (m) m.style.left = lanePos((gm.i + 1) / gm.n); };
function clockQ(d) {
  const kinds = d <= 0 ? ['match'] : d <= 3 ? ['match', 'set'] : ['set', 'read', 'later'], kind = kinds[gm.i % kinds.length];
  const h = rnd(1, 12), m = pick(minsFor(d)), ans = tS(h, m);
  if (kind === 'set') {
    const step = d <= 1 ? 30 : d <= 3 ? 15 : d <= 5 ? 5 : 1;
    let h0 = h, m0 = 0; while (tS(h0, m0) === ans) { h0 = rnd(1, 12); m0 = pick([0, 30]); }
    cur('set', ans);
    gFrame(`<div class="g4mx" id="g4mx"></div><div class="row"><button class="btn leaf" id="g4ok">Done ✓</button></div>`, `Set the clock to <b class="gnum">${words(h, m)}</b>`, `Set the clock to ${words(h, m)}. Drag the hands, then tap Done.`, clockTrack());
    const w = MX.clock.mount($('#g4mx'), { step, h0, m0 }, ans);
    $('#g4ok').onclick = () => {
      if (gm.lock) return;
      if (w.value() === ans) { w.lock(); meStep(); owlStep(.8); gameRight($('#g4ok'), 1300); }
      else { owlStep(1); gameMiss($('#g4ok'), `Not yet. ${gm.tries >= 1 ? w.hint() : `The long hand shows the minutes, the short hand the hour: ${h}.`}`, null, 'Not yet!'); }
    };
    return;
  }
  let body, prompt, speak, ch, hint;
  if (kind === 'match') {
    const n = d <= 0 ? 3 : 4, set = new Set([ans]);
    for (let t = 0; set.size < n && t < 80; t++) set.add(pick([tS(nH(h), m), tS(h, pick(minsFor(Math.max(d, 1)))), tS(rnd(1, 12), m), tS(m === 0 ? 12 : Math.max(1, m / 5 | 0) || 12, (h * 5) % 60)]));
    ch = shuffle([...set]).map(v => { const [a, b] = v.split(':').map(Number); return { html: face(a, b), val: v, label: words(a, b) }; });
    prompt = `Which clock says <b class="gnum">${words(h, m)}</b>?`; speak = `Which clock says ${words(h, m)}?`; hint = `Look at the long hand first: ${m === 0 ? 'straight up for o\'clock' : `it shows ${m} minutes`}. The short hand is near ${m >= 30 && m !== 30 ? nH(h) : h}.`;
    body = choicesHTML(ch, ans).replace('class="choices gch', 'class="choices gch g4clocks');
  } else if (kind === 'read') {
    const set = new Set([ans]); for (let t = 0; set.size < 4 && t < 80; t++) set.add(pick([tS(nH(h), m), tS(h, (m + 5) % 60), tS(h, (m + 55) % 60), tS(m === 0 ? 12 : Math.max(1, m / 5 | 0) || 12, (h * 5) % 60), tS((h + 10) % 12 + 1, m)]));
    ch = shuffle([...set]).map(v => ({ html: v, val: v, label: v }));
    body = `<div class="g4big">${face(h, m)}</div>${choicesHTML(ch, ans)}`; prompt = 'What time is it?'; speak = 'Look at the clock. What time is it?'; hint = `The short hand is ${m < 30 ? 'just past' : 'on its way from'} ${h}. Count the long hand in 5s.`;
  } else {
    const add = pick([5, 10, 15, 20, 30, 45, 60]), t = h * 60 + m + add, h2 = (Math.floor(t / 60) - 1) % 12 + 1, m2 = t % 60, a2 = tS(h2, m2);
    const set = new Set([a2]); for (let k = 0; set.size < 4 && k < 80; k++) set.add(pick([tS(nH(h2), m2), tS(h2, (m2 + 5) % 60), tS(h, m2), tS(h2, (m2 + 55) % 60), tS(h, (m + add / 2 | 0) % 60)]));
    ch = shuffle([...set]).map(v => ({ html: v, val: v, label: v }));
    body = `<div class="g4big">${face(h, m)}</div>${choicesHTML(ch, a2)}`; prompt = `What time will it be in <b class="gnum">${add} minutes</b>?`; speak = `It is ${words(h, m)}. What time will it be in ${add} minutes?`; hint = `Count on ${add} minutes from ${tS(h, m)}${m + add >= 60 ? '. Going past 60 minutes moves on to the next hour.' : '.'}`;
    cur(kind, a2); gFrame(body, prompt, speak, clockTrack());
    return wireAndRace(a2, hint);
  }
  cur(kind, ans); gFrame(body, prompt, speak, clockTrack());
  wireAndRace(ans, hint);
}
function wireAndRace(ans, hint) {
  view.querySelectorAll('.gch .gopt').forEach(b => b.onclick = () => {
    if (gm.lock || b.classList.contains('no')) return;
    if (b.dataset.v === String(ans)) { meStep(); owlStep(.8); gameRight(b, 1200); }
    else { owlStep(1); gameMiss(b, hint, view.querySelector('.gch [data-ok]')); }
  });
}
function clockResult() {
  const won = gm.owl < gm.n;
  return { title: won ? 'You won the Clock Race!' : 'What a race!', line: `${gm.ok} of ${gm.n} clocks right on the first try${won ? ', and you beat the Owl!' : '. The Owl just won. Try again!'}` };
}

if (location.hash === '#selftest') window.__games4 = { toysQ, clockQ, split4 };
})();
