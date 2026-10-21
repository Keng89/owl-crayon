/* ---------- storage (works offline, survives without localStorage) ---------- */
const mem = {};
const store = {
  get(k, d) { try { const v = localStorage.getItem('owlcrayon:' + k); if (v != null) return JSON.parse(v); } catch (e) {} return k in mem ? mem[k] : d; },
  set(k, v) { mem[k] = v; try { localStorage.setItem('owlcrayon:' + k, JSON.stringify(v)); } catch (e) {} }
};
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const dayNum = s => Math.round(new Date(s + 'T12:00:00').getTime() / 864e5);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- sound + voice (both work offline) ---------- */
let actx = null;
function tone(freqs, dur = 0.12) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    freqs.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * dur;
      o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur * 1.8);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur * 2);
    });
  } catch (e) {}
}
const yay = () => tone([523, 659, 784]);
const oops = () => tone([330, 262], 0.15);
function speakable(text) {
  return String(text).replace(/<sup>(\d+)<\/sup>/g, ' to the power $1 ').replace(/<span class="frac"><i>([^<]*)<\/i><i>([^<]*)<\/i><\/span>/g, ' $1 over $2 ')
    .replace(/<[^>]+>/g, ' ').replace(/&lt;=|≤/g, ' is less than or equal to ').replace(/&gt;=|≥/g, ' is greater than or equal to ').replace(/&lt;/g, ' is less than ').replace(/&gt;/g, ' is greater than ')
    .replace(/≠/g, ' is not equal to ').replace(/≈/g, ' about ').replace(/\$(\d+)\.(\d\d)\b/g, '$1 dollars and $2 cents').replace(/\$(\d+)/g, '$1 dollars').replace(/(\d)\s*¢/g, '$1 cents')
    .replace(/(\d) r (\d)/g, '$1 remainder $2').replace(/(\d) : (\d)/g, '$1 to $2').replace(/&[a-z]+;/g, ' ').replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus ').replace(/²/g, ' squared ').replace(/³/g, ' cubed ')
    .replace(/√/g, ' square root of ').replace(/%/g, ' percent').replace(/°/g, ' degrees').replace(/(^|[\s=(+-])\?(?=[\s=)]|$)/g, '$1 what ').replace(/[^\w\s.,!?'+=:-]/g, ' ').replace(/\s+/g, ' ');
}
function say(text) {
  if (!st.speak || !('speechSynthesis' in window)) return;
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(speakable(text)); u.rate = 0.9; u.pitch = 1.15; speechSynthesis.speak(u); } catch (e) {}
}
function confetti(n = 40) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cols = ['#FFC23D', '#F2604F', '#2FA36B', '#6D55D1', '#2E8BE6'];
  for (let i = 0; i < n; i++) {
    const d = document.createElement('i'); d.className = 'confetti';
    d.style.left = Math.random() * 100 + 'vw'; d.style.background = pick(cols); d.style.animationDelay = Math.random() * 0.4 + 's';
    document.body.appendChild(d); setTimeout(() => d.remove(), 2200);
  }
}

/* ---------- shared pictures ---------- */
const THINGS = [['🍎','apples'],['⭐','stars'],['🐟','fish'],['🌸','flowers'],['🚗','cars'],['🐞','ladybugs'],['🍓','strawberries'],['🎈','balloons'],['🐥','chicks']];
function objs(n, e, opt = {}) {
  let h = '';
  for (let i = 0; i < n; i++) {
    const gone = opt.gone && i >= n - opt.gone ? ' class="gone"' : '';
    h += `<span${gone}>${e}${opt.num ? `<sup>${(opt.numFrom || 0) + i + 1}</sup>` : ''}</span>`;
  }
  return `<div class="objs" style="grid-template-columns:repeat(${Math.min(5, Math.max(1, n))},auto)">${h || '<span style="opacity:.3">∅</span>'}</div>`;
}
const SHAPES = {
  circle: { sides: 0, svg: c => `<circle cx="50" cy="50" r="40" fill="${c}"/>` },
  oval: { sides: 0, svg: c => `<ellipse cx="50" cy="50" rx="45" ry="28" fill="${c}"/>` },
  square: { sides: 4, svg: c => `<rect x="14" y="14" width="72" height="72" rx="3" fill="${c}"/>`, pts: [[14,14],[86,14],[86,86],[14,86]] },
  rectangle: { sides: 4, svg: c => `<rect x="4" y="26" width="92" height="48" rx="3" fill="${c}"/>`, pts: [[4,26],[96,26],[96,74],[4,74]] },
  triangle: { sides: 3 }, pentagon: { sides: 5 }, hexagon: { sides: 6 },
  star: { sides: 10, svg: c => `<polygon points="${starPts()}" fill="${c}"/>` }
};
function polyPts(n) { const p = []; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / n; p.push([50 + 44 * Math.cos(a), 54 + 44 * Math.sin(a)].map(v => +v.toFixed(1))); } return p; }
function starPts() { const p = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? 19 : 46, a = -Math.PI / 2 + i * Math.PI / 5; p.push((50 + r * Math.cos(a)).toFixed(1) + ',' + (52 + r * Math.sin(a)).toFixed(1)); } return p.join(' '); }
function shapeSVG(name, color, corners) {
  const s = SHAPES[name]; let body, pts = s.pts;
  if (s.svg) body = s.svg(color); else { pts = polyPts(s.sides); body = `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${color}"/>`; }
  let marks = '';
  if (corners && pts) marks = pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="7" fill="#22305A"/><text x="${p[0]}" y="${p[1] + 4}" font-size="9" font-weight="800" text-anchor="middle" fill="#fff">${i + 1}</text>`).join('');
  return `<div class="shape"><svg viewBox="-6 -6 112 112" role="img" aria-label="${name}">${body}${marks}</svg></div>`;
}
const COLORS = [['#F2604F','red'],['#2E8BE6','blue'],['#FFC23D','yellow'],['#2FA36B','green'],['#6D55D1','purple'],['#FF8A2B','orange']];
const dot = c => `<span class="dot" style="background:${c}"></span>`;
function numChoices(ans, lo, hi, n = 3) {
  const set = new Set([ans]); let guard = 0;
  while (set.size < n && guard++ < 50) { const d = ans + pick([-2, -1, 1, 2, 3, -3, 10, -10].filter(x => Math.abs(x) < 10 || hi > 30)); if (d >= lo && d <= hi) set.add(d); }
  return shuffle([...set]).map(v => ({ html: v, val: v, say: String(v) }));
}

/* ---------- early-years generators (used by Seedling Hill) ---------- */
const GEN = {
  count(L) {
    const max = [5, 8, 10, 15, 20][L - 1], n = rnd(1, max), [e, word] = pick(THINGS);
    return { prompt: `How many ${word}?`, speak: `How many ${word} can you count?`, visual: objs(n, e), choices: numChoices(n, 0, max + 3), answer: n,
      explain: objs(n, e, { num: true }), explainText: `Touch each one and count: ${Array.from({ length: Math.min(n, 10) }, (_, i) => i + 1).join(', ')}${n > 10 ? '...' : ''}. ${n === 1 ? 'There is just 1!' : `There are ${n} ${word}!`}` };
  },
  compare(L) {
    const max = [10, 20, 50, 100, 1000][L - 1]; let a = rnd(1, max), b = rnd(1, max); while (b === a) b = rnd(1, max);
    const small = L >= 3 && Math.random() < 0.4, ans = small ? Math.min(a, b) : Math.max(a, b), word = small ? 'smaller' : 'bigger';
    const [e] = pick(THINGS), pics = max <= 20;
    return { prompt: `Which number is ${word}?`, speak: `Which number is ${word}? ${a} or ${b}?`,
      visual: pics ? `<div class="row">${objs(a, e)}${objs(b, e)}</div>` : '',
      choices: [a, b].map(v => ({ html: v, val: v, say: String(v) })), answer: ans,
      explain: pics ? `<div class="row"><div><div class="bignum">${a}</div>${objs(a, e)}</div><div><div class="bignum">${b}</div>${objs(b, e)}</div></div>` : `<span class="bignum">${a} ${a > b ? '>' : '<'} ${b}</span>`,
      explainText: pics ? `${Math.max(a, b)} has more. ${Math.min(a, b)} has fewer. So ${ans} is ${word}.` : `Count the digits first, then compare from the left. ${Math.max(a, b)} is more than ${Math.min(a, b)}, so ${ans} is ${word}.` };
  },
  shapes(L) {
    const pool = [['circle', 'square', 'triangle'], ['circle', 'square', 'triangle', 'rectangle', 'star'], ['triangle', 'rectangle', 'oval', 'pentagon', 'star'], ['triangle', 'square', 'pentagon', 'hexagon', 'oval'], ['triangle', 'pentagon', 'hexagon', 'rectangle', 'square']][L - 1];
    const name = pick(pool), c = pick(COLORS)[0], s = SHAPES[name];
    if (L >= 2 && s.sides >= 3 && s.sides <= 6 && Math.random() < 0.5) {
      return { prompt: 'How many sides?', speak: `This is a ${name}. How many straight sides does it have?`, visual: shapeSVG(name, c), choices: numChoices(s.sides, 3, 8), answer: s.sides,
        explain: shapeSVG(name, c, true), explainText: `Count the corners. A ${name} has ${s.sides} corners and ${s.sides} straight sides.` };
    }
    const opts = shuffle([name, ...shuffle(pool.filter(x => x !== name)).slice(0, 2)]);
    const desc = s.sides === 0 ? `A ${name} is round. It has no corners.` : name === 'star' ? 'A star has 5 pointy tips.' : `A ${name} has ${s.sides} straight sides.`;
    return { prompt: 'What shape is this?', speak: 'What shape is this?', visual: shapeSVG(name, c),
      choices: opts.map(o => ({ html: o, val: o, say: o, txt: true })), answer: name, explain: shapeSVG(name, c, true), explainText: `${desc} It is a ${name}!` };
  },
  pattern(L) {
    const units = [['AB'], ['AB', 'AAB'], ['ABC', 'ABB', 'AAB'], ['ABC', 'AABB', 'ABCC'], ['ABCD', 'AABBC', 'ABAC']][L - 1];
    const u = pick(units), cols = shuffle(COLORS).slice(0, 4), seq = [];
    const len = u.length * (u.length <= 2 ? 3 : 2);
    for (let i = 0; i < len; i++) seq.push(u[i % u.length]);
    const next = u[len % u.length], letters = [...new Set(u)];
    const col = ch => cols['ABCD'.indexOf(ch)];
    const optionLetters = shuffle([...letters, ...(letters.length < 3 ? ['ABCD'[letters.length]] : [])]).slice(0, Math.max(3, letters.length));
    if (!optionLetters.includes(next)) optionLetters[0] = next;
    return { prompt: 'What comes next?', speak: 'Look at the colors. What comes next?',
      visual: `<div class="pat">${seq.map(ch => dot(col(ch)[0])).join('')}<span class="dot q">?</span></div>`,
      choices: shuffle(optionLetters).map(ch => ({ html: dot(col(ch)[0]), val: ch, say: col(ch)[1] })), answer: next,
      explain: `<div class="pat"><span class="unit">${u.split('').map(ch => dot(col(ch)[0])).join('')}</span><span class="op">again and again</span></div>`,
      explainText: `The pattern goes ${u.split('').map(ch => col(ch)[1]).join(', ')}, and then it starts again. So next is ${col(next)[1]}.` };
  }
};

//@include math.js
//@include math2.js
//@include math3.js
//@include math4.js
//@include art.js
//@include art2.js
//@include art3.js
//@include art4.js
//@include art5.js
//@include art6.js
//@include art7.js
//@include art8.js
//@include art9.js

/* ---------- state ---------- */
const STICKERS = ['🦄','🐢','🚀','🌈','🐙','🦖','🍩','🐝','🎨','🦊','🐳','🌻','🏰','🐼','⚽','🎸','🦋','🍉','🐧','👑','🦁','🐬','🍄','🎃','🛸','🐉','🍭','🦒','⛵','🎠'];
function startMastery(id, age) { const w = MATH[id].world, aw = ageWorld(age); return w < aw ? 0.65 : w === aw ? 0.25 : 0; }
function freshState(age = 5) {
  const skills = {};
  for (const k in MATH) skills[k] = { m: startMastery(k, age), seen: 0, hist: [], ms: 0 };
  return { v: 2, name: '', age, stars: 0, streak: { n: 0, last: null }, skills, review: [], owlMisses: [], owlTaught: [], plays: { math: 0, art: 0, owl: 0 }, speak: true, unlockAll: false, art: { done: {}, pixel: 1, pixelDone: {} } };
}
//@include family.js

/* ---------- adaptive engine: mastery per skill + spaced review ---------- */
const level = s => 1 + Math.min(4, Math.floor(st.skills[s].m * 5));
const BOXES = [1, 2, 4, 8, 16]; // days until the next review
const worldMastery = w => { const ks = worldSkills(w); return ks.reduce((a, s) => a + st.skills[s.id].m, 0) / ks.length; };
const worldOpen = w => st.unlockAll || w <= ageWorld(st.age) + 1 || worldMastery(w - 1) >= 0.5;
const openSkills = () => Object.keys(MATH).filter(k => worldOpen(MATH[k].world));
function learn(skill, firstTry, ms) {
  const s = st.skills[skill];
  s.seen++; s.hist = (s.hist || []).concat(firstTry ? 1 : 0).slice(-20);
  s.ms = s.ms ? Math.round(s.ms * 0.8 + ms * 0.2) : ms;
  s.m = clamp(s.m + (firstTry ? (ms < 10000 ? 0.06 : 0.035) : -0.07), 0, 1);
}
function addReview(skill, q) {
  if (st.review.some(r => r.q.prompt === q.prompt && String(r.q.answer) === String(q.answer))) return;
  st.review.push({ skill, q, box: 0, due: dayNum(today()) + 1 });
  if (st.review.length > 80) st.review.shift();
}
const dueReviews = () => st.review.filter(r => r.due <= dayNum(today()));
function acc(skill) { const h = st.skills[skill].hist || []; return h.length ? h.reduce((a, b) => a + b, 0) / h.length : null; }
function recommendSkill(world) {
  // Pick the skill in the "just right" zone: not mastered, not frustrating, least practised, easiest world first.
  const ks = world == null ? openSkills() : worldSkills(world).map(s => s.id);
  return ks.map(k => { const a = acc(k), s = st.skills[k]; return [k, (s.m >= 0.95 ? 3 : 0) + (a != null && a < 0.5 ? 1 : 0) + s.seen / 40 + MATH[k].world * 0.35 + Math.random() * 0.3]; })
    .sort((x, y) => x[1] - y[1])[0][0];
}
const artLevelOpen = lv => lv === 1 || st.unlockAll || st.age >= (lv === 2 ? 8 : 10) || LESSONS.filter(l => l.level === lv - 1 && st.art.done[l.id]).length >= 3;
const nextLesson = () => LESSONS.find(l => !st.art.done[l.id] && artLevelOpen(l.level));
function todaysPick() {
  if (dueReviews().length) return { kind: 'review', ico: '🔁', title: 'Quick review', text: `${dueReviews().length} to practise again` };
  if (st.plays.art < st.plays.math - 1) { const l = nextLesson(); if (l) return { kind: 'lesson', id: l.id, ico: l.ico, title: `Draw ${l.title.toLowerCase()}`, text: 'A step-by-step art lesson' }; }
  const k = recommendSkill();
  return { kind: 'skill', skill: k, ico: MATH[k].ico, title: MATH[k].name, text: `${WORLDS[MATH[k].world].name} · good one to play next` };
}
function bumpStreak() {
  const t = today(); if (st.streak.last === t) return;
  st.streak.n = st.streak.last && dayNum(t) - dayNum(st.streak.last) === 1 ? st.streak.n + 1 : 1; st.streak.last = t;
  st.bestStreak = Math.max(st.bestStreak || 0, st.streak.n);
}
function addStars(n) { st.stars += n; dayLog('stars', n); gainXP(n); bumpStreak(); save(); updateTop(); checkBadges(); }

/* ---------- views ---------- */
const view = document.getElementById('view');
const $ = s => view.querySelector(s);
function updateTop() { document.getElementById('starCount').textContent = st.stars; document.getElementById('streakCount').textContent = st.streak.n; const w = document.getElementById('whoBtn'); w.textContent = (profileOf(pid) || profiles[0]).avatar; w.setAttribute('aria-label', `Player: ${st.name || 'Player'}. Tap to switch`); }
let navId = 0;
function go(fn, ...a) { navId++; try { speechSynthesis.cancel(); } catch (e) {} stopCanvas(); view.innerHTML = ''; window.scrollTo(0, 0); fn(...a); }
document.getElementById('homeBtn').onclick = () => go(home);
document.getElementById('whoBtn').onclick = () => go(whoView);
document.getElementById('readBtn').onclick = () => say(screenText || document.getElementById('view').innerText.slice(0, 400));
const crumbs = (title, back) => `<div class="crumbs"><button class="back" id="backBtn">← Back</button><h1>${title}</h1></div>`;
const wireBack = fn => { const b = $('#backBtn'); if (b) b.onclick = () => go(fn); };

function petMood() {
  const n = st.pet.name, gap = st.pet.seen ? dayNum(today()) - dayNum(st.pet.seen) : 0;
  if (!st.pet.seen) return `Meet ${n}, your owl! Every star you earn helps ${n} grow.`;
  if (gap >= 3) return `${n} missed you! Let's play together.`;
  if (questDone(quest()) && !quest().claimed) return `${n} says: the treasure chest is ready!`;
  return pick([`${n} is happy to see you!`, `${n} wants to learn something new today.`, `${n} says hoo hoo!`, `${n} loves stars. Let's earn some!`]);
}
function home() {
  const p = todaysPick(), stickers = Array.from({ length: Math.floor(st.stars / 10) }, (_, i) => STICKERS[i % STICKERS.length]);
  const mood = petMood(); st.pet.seen = today(); save();
  const left = quest().tasks.filter(t => t.have < t.need).length;
  view.innerHTML = `
    <div class="hello"><button class="pet-btn" id="petBtn" aria-label="My owl ${esc(st.pet.name)}">${petHTML(76, 'bounce')}</button><div>
      <h1>Hi${st.name ? ', ' + esc(st.name) : ''}! What shall we do?</h1>
      <p>${esc(mood)}${st.streak.n > 1 ? ` You played ${st.streak.n} days in a row!` : ''}</p></div></div>
    ${questCard()}
    <button class="pick" id="pick"><span class="big">${p.ico}</span><span><b>${p.title}</b>${p.text}</span></button>
    <div class="tiles">
      <button class="tile t-math" id="tMath"><span class="big">🔢</span><span><h2>Number Garden</h2><p>From counting to algebra</p></span></button>
      <button class="tile t-art" id="tArt"><span class="big">🖍️</span><span><h2>Art School</h2><p>Step-by-step drawing and more</p></span></button>
      <button class="tile t-quest" id="tQuest"><span class="big">🗺️</span><span><h2>Owl's Quest</h2><p>A story adventure with math and art</p></span></button>
      <button class="tile t-owl" id="tOwl"><span class="big">🦉</span><span><h2>Ask Owl</h2><p>Ask me anything!</p></span></button>
      <button class="tile t-world" id="tWorld"><span class="big">🌍</span><span><h2>My World</h2><p>Spend your stars on lands, houses and animals</p></span><span class="tw-wallet">⭐ ${worldHome.wallet()} to spend</span><span class="tw-deco" aria-hidden="true">🐄🌳🏡🐧🌈</span></button>
    </div>
    <h3 class="section-title">My stickers <span class="tag">every 10 ⭐</span><button class="tag badge-link" id="badgesBtn">🏅 Badges ${Object.keys(st.badges || {}).length}/${BADGES.length}</button></h3>
    <div class="stickers">${stickers.length ? stickers.map(s => `<span>${s}</span>`).join('') : '<span class="empty">Earn 10 stars to get your first sticker.</span>'}</div>
    <button class="small-link" id="parent">For grown-ups</button>`;
  sayScreen(`Hi${st.name ? ' ' + st.name : ''}! ${mood} ${quest().claimed ? '' : left ? `Your quest has ${left} job${left > 1 ? 's' : ''} left.` : 'Open your treasure chest!'}`);
  $('#petBtn').onclick = () => go(petView);
  $('#badgesBtn').onclick = () => go(badgesView);
  wireQuest();
  $('#tMath').onclick = () => go(mathHome);
  $('#tArt').onclick = () => go(artHome);
  $('#tOwl').onclick = () => go(owl);
  $('#tQuest').onclick = () => go(storyHome);
  $('#tWorld').onclick = () => go(worldHome);
  $('#parent').onclick = () => go(gate);
  $('#pick').onclick = () => p.kind === 'review' ? go(play, 'review') : p.kind === 'lesson' ? go(drawLesson, p.id) : go(startSkill, p.skill);
  tour.maybe();
}

/* ---------- Number Garden ---------- */
function mathHome() {
  const due = dueReviews().length;
  view.innerHTML = `${crumbs('Number Garden')}
    <button class="pick" id="wr"><span class="big">✏️</span><span><b>Write numbers</b>Trace 0 to 20 with your finger</span></button>
    <button class="pick" id="gm" style="background:var(--grape);color:#fff"><span class="big">🎮</span><span><b>Math games</b>Pop, hop, shop and race with numbers</span></button>
    <button class="pick" id="sp" style="background:#1D7C82;color:#fff;border-color:#135A5F"><span class="big">🔺</span><span><b>Shape puzzles</b>Build pictures with triangles, squares and circles</span></button>
    ${due ? `<button class="pick" id="rev"><span class="big">🔁</span><span><b>Practise again</b>${due} question${due > 1 ? 's' : ''} you missed before</span></button>` : ''}
    <div class="worlds">${WORLDS.map((w, i) => { const open = worldOpen(i), m = Math.round(worldMastery(i) * 100);
      return `<button class="world${open ? '' : ' locked'}" data-w="${i}" style="background:${w.color}" ${open ? '' : 'aria-disabled="true"'}>
        <span class="big">${open ? w.ico : '🔒'}</span><b>${w.name}</b><span>Ages ${w.ages} · ${worldSkills(i).length} topics</span>
        <span class="meter" aria-label="${m}% learned"><i style="width:${m}%"></i></span>${open ? '' : `<span>Unlocks at 50% of ${WORLDS[i - 1].name}</span>`}</button>`; }).join('')}</div>`;
  wireBack(home);
  sayScreen('Pick a world! ' + WORLDS.filter((w, i) => worldOpen(i)).map(w => w.name).join(', ') + '.');
  if (due) $('#rev').onclick = () => go(play, 'review');
  $('#wr').onclick = () => go(writeHome);
  $('#gm').onclick = () => go(gamesHome);
  $('#sp').onclick = () => go(shapeHome, 'math');
  view.querySelectorAll('[data-w]').forEach(b => b.onclick = () => { const w = +b.dataset.w; if (worldOpen(w)) go(worldView, w); else say('Keep playing the world before to open this one!'); });
}
function worldView(w) {
  const W = WORLDS[w], rec = recommendSkill(w);
  view.innerHTML = `${crumbs(`${W.ico} ${W.name}`)}
    <div class="skills">
      <button class="skill" data-s="mix" style="background:${W.color};color:#fff"><span class="ico">🎲</span><b>Surprise mix</b><span>A bit of everything here</span></button>
      ${worldSkills(w).map(s => `<button class="skill${s.id === rec ? ' rec' : ''}" data-s="${s.id}"><span class="ico">${s.ico}</span><b>${s.name}</b>
        <span class="lvl" aria-label="level ${level(s.id)} of 5">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= level(s.id) ? 'on' : ''}">⭐</i>`).join('')}</span>${s.id === rec ? '<span class="tag">Try this</span>' : ''}</button>`).join('')}
    </div>`;
  wireBack(mathHome);
  sayScreen(`${W.name}. Pick a topic. Try ${MATH[rec].name}! The topics are: ` + worldSkills(w).map(s => s.name).join(', ') + '.');
  view.querySelectorAll('[data-s]').forEach(b => b.onclick = () => b.dataset.s === 'mix' ? go(play, 'mix', w) : go(startSkill, b.dataset.s));
}
function startSkill(id) { if (!st.skills[id].seenLesson) go(lessonView, id, true); else go(play, id); }
function lessonView(id, thenPlay) {
  const s = MATH[id]; st.skills[id].seenLesson = true; save();
  view.innerHTML = `${crumbs(`${s.ico} ${s.name}`)}
    <div class="lesson">${s.lesson.map(([t, v], i) => `<div class="lstep"><span class="n">${i + 1}</span><p>${t}</p>${v() ? `<div class="visual">${v()}</div>` : ''}<button class="speak" data-say="${i}" aria-label="Read it">🔊</button></div>`).join('')}</div>
    <div class="row"><button class="btn alt" id="demo">👀 Watch Owl solve one</button><button class="btn leaf" id="go">${thenPlay ? "Let's practise!" : 'Back to practice'}</button></div>
    <div id="demoBox"></div>`;
  wireBack(() => worldView(s.world));
  $('#demo').onclick = () => workedExample(id);
  say(`Let's learn ${s.name}. ` + s.lesson.map(x => x[0]).join(' '));
  view.querySelectorAll('[data-say]').forEach(b => b.onclick = () => say(s.lesson[+b.dataset.say][0]));
  $('#go').onclick = () => thenPlay ? go(play, id) : history.back();
}

// Owl solves an easy question out loud: question, a pause to think, the answer glows, then the method.
function workedExample(id) {
  let q; try { q = MATH[id].gen(1); } catch (e) { return; }
  const box = $('#demoBox'), here = box;
  box.innerHTML = `<div class="qcard demo"><p class="note">🦉 Owl's turn! Watch how I do it.</p><div class="prompt"><div class="ptext">${q.prompt}</div></div>${q.visual ? `<div class="visual">${q.visual}</div>` : ''}
    <div class="choices" style="grid-template-columns:repeat(${Math.min(q.choices.length, 2)},1fr)">${q.choices.map(c => `<span class="choice${c.txt ? ' txt' : ''}${String(c.val) === String(q.answer) ? ' ans' : ''}">${c.html}</span>`).join('')}</div><div class="wdemo"></div></div>`;
  box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  say(`Owl's turn. ${q.speak || q.prompt} Hmm, let me think.`);
  setTimeout(() => {
    if (!here.isConnected) return;
    const a = box.querySelector('.ans'); if (a) a.classList.add('right');
    const ans = q.choices.find(c => String(c.val) === String(q.answer));
    box.querySelector('.wdemo').innerHTML = `<div class="explain">${q.explain ? `<div class="visual">${q.explain}</div>` : ''}${q.steps ? `<ol class="steps">${q.steps.map(x => `<li>${x}</li>`).join('')}</ol>` : ''}<p>${q.explainText}</p></div><div class="row"><button class="btn leaf" id="tryNow">Now you try! ▶</button></div>`;
    box.querySelector('#tryNow').onclick = () => go(play, id);
    say(`The answer is ${ans ? ans.say : q.answer}. ` + (q.steps ? q.steps.join(' ') + ' ' : '') + q.explainText + ' Now you try!');
  }, 3500);
}

let sess = null;
function play(mode, world) {
  const plan = [];
  if (mode === 'review') dueReviews().slice(0, 8).forEach(r => plan.push({ review: r }));
  else {
    const n = (mode === 'mix' ? world : MATH[mode].world) <= 1 ? 6 : 8;
    for (let i = 0; i < n; i++) plan.push({ skill: mode === 'mix' ? pick(worldSkills(world)).id : mode });
  }
  if (!plan.length) return go(mathHome);
  sess = { mode, world, plan, i: 0, firstTries: 0, stars: 0 };
  st.plays.math++; save();
  question();
}
function question() {
  const item = sess.plan[sess.i];
  const skill = item.review ? item.review.skill : item.skill;
  let q;
  try { q = item.review ? { ...item.review.q, choices: shuffle(item.review.q.choices) } : MATH[skill].gen(level(skill)); }
  catch (e) { q = MATH.count.gen(1); }
  const t0 = Date.now(); let tries = 0, hinted = false;
  view.innerHTML = `
    <div class="progress">${sess.plan.map((_, i) => `<i class="${i < sess.i ? 'done' : i === sess.i ? 'now' : ''}"></i>`).join('')}</div>
    <div class="qcard">
      <div class="prompt"><div class="ptext">${q.prompt}</div><button class="speak" id="spk" aria-label="Read it to me">🔊</button></div>
      ${q.visual ? `<div class="visual">${q.visual}</div>` : ''}
      <div class="choices" style="grid-template-columns:repeat(${q.choices.some(c => String(c.html).replace(/<[^>]+>/g, '').length > 6) && q.choices.length > 2 ? 2 : q.choices.length > 4 ? 3 : q.choices.length},1fr)">${q.choices.map((c, i) => `<button class="choice${c.txt ? ' txt' : ''}" data-i="${i}"${c.say && /<svg|<span/.test(String(c.html)) ? ` aria-label="${esc(c.say)}"` : ''}>${c.html}</button>`).join('')}</div>
      <div class="cheer" id="cheer" aria-live="polite"></div>
      <div id="exp" style="width:100%"></div>
      <div class="row"><button class="help" id="hint">🦉 Hint</button><button class="help" id="how">💡 How does this work?</button></div>
    </div>`;
  // Young children may not read word answers yet, so read them out too.
  const words = q.choices.map(c => c.say != null ? String(c.say) : String(c.val));
  const qSay = (q.speak || q.prompt) + (st.age <= 8 && words.some(w => /[a-z]/i.test(w)) && words.every(w => w.length < 40) ? ` Is it ${words.join(', or ')}?` : '');
  say(qSay);
  $('#spk').onclick = () => say(qSay);
  // A hint takes away one wrong answer (only once, and only when 3 or more are left), so a stuck child can still win.
  $('#hint').onclick = () => {
    const wrong = [...view.querySelectorAll('.choice')].filter(b => !b.disabled && String(q.choices[+b.dataset.i].val) !== String(q.answer));
    if (hinted || wrong.length < 2) { say('Look carefully at the picture and try one!'); return; }
    hinted = true; const b = pick(wrong); b.disabled = true; b.classList.add('gone'); $('#hint').disabled = true;
    say('Owl took away one wrong answer. Try again!');
  };
  $('#how').onclick = () => { const s = MATH[skill]; $('#exp').innerHTML = `<div class="explain">${s.lesson.map(([t, v]) => `<p>${t}</p>${v() ? `<div class="visual">${v()}</div>` : ''}`).join('')}</div>`; say(s.lesson.map(x => x[0]).join(' ')); };
  view.querySelectorAll('.choice').forEach(b => b.onclick = () => {
    const c = q.choices[+b.dataset.i];
    if (b.disabled) return;
    if (String(c.val) === String(q.answer)) {
      const first = tries === 0 && !hinted, ms = Date.now() - t0;
      b.classList.add('right'); view.querySelectorAll('.choice').forEach(x => x.disabled = true);
      if (first) { learn(skill, true, ms); sess.firstTries++; }
      if (item.review) { const r = item.review; r.box = first ? Math.min(r.box + 1, BOXES.length - 1) : 0; r.due = dayNum(today()) + BOXES[r.box]; if (first && r.box === BOXES.length - 1) st.review = st.review.filter(x => x !== r); }
      const earned = first ? 2 : 1; sess.stars += earned; st.stars += earned; dayLog('stars', earned); dayLog('q'); if (first) dayLog('ok'); gainXP(earned); updateTop();
      questTick('math'); if (item.review) questTick('review'); if (first) questTick('firsttry');
      const words = first ? pick(['Great job!', 'You got it!', 'Super!', 'Yes!', 'Brilliant!']) : 'Now you know it!';
      $('#cheer').textContent = words + ' ⭐'.repeat(earned); yay(); say(words);
      save();
      const nav = navId; setTimeout(() => { if (nav !== navId) return; sess.i++; sess.i < sess.plan.length ? question() : finish(); }, first ? 1300 : 2200);
    } else {
      tries++; b.classList.add('wrong'); b.disabled = true; oops();
      if (tries === 1) { learn(skill, false, Date.now() - t0); if (!item.review) addReview(skill, q); save(); }
      $('#exp').innerHTML = `<div class="explain"><p>Let's work it out together.</p>${q.explain ? `<div class="visual">${q.explain}</div>` : ''}${q.steps ? `<ol class="steps">${q.steps.map(s => `<li>${s}</li>`).join('')}</ol>` : ''}<p>${q.explainText}</p></div>`;
      say("Let's work it out together. " + (q.steps ? q.steps.join(' ') + ' ' : '') + q.explainText);
    }
  });
}
function finish() {
  const before = Math.floor((st.stars - sess.stars) / 10), after = Math.floor(st.stars / 10);
  const sticker = after > before ? STICKERS[(after - 1) % STICKERS.length] : null;
  bumpStreak(); save(); updateTop(); confetti(); yay(); checkBadges();
  view.innerHTML = `<div class="view done">
    <div class="big">${sticker || '🏆'}</div>
    <h1>${sess.firstTries >= sess.plan.length - 1 ? 'Amazing!' : 'Well done!'}</h1>
    <p style="font-weight:800;font-size:22px">You got ${sess.firstTries} of ${sess.plan.length} on the first try and earned ${sess.stars} ⭐</p>
    ${sticker ? `<p style="font-weight:800;font-size:22px">New sticker for your book!</p>` : ''}
    <div class="row"><button class="btn leaf" id="again">Play again</button><button class="btn alt" id="back">More games</button></div></div>`;
  say(`Well done! You earned ${sess.stars} stars.${sticker ? ' And a new sticker!' : ''}`);
  const { mode, world } = sess;
  $('#again').onclick = () => go(play, mode === 'review' ? 'mix' : mode, mode === 'review' ? MATH[sess.plan[0].review.skill].world : world);
  $('#back').onclick = () => go(mode === 'review' ? mathHome : worldView, mode === 'mix' ? world : mode === 'review' ? undefined : MATH[mode].world);
}

/* ---------- Art School ---------- */
const PAINT = ['#22305A', '#F2604F', '#FF8A2B', '#FFC23D', '#2FA36B', '#2E8BE6', '#6D55D1', '#F49AC1', '#8B5A2B', '#FFFFFF'];
const PAINT_NAMES = ['dark blue', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'white'];
let canvasCleanup = null;
let livePad = null; // the pad on screen, so the play timer can save a drawing before "All done for today"
function stopCanvas() { if (canvasCleanup) { canvasCleanup(); canvasCleanup = null; } }
// Art School groups its many kinds so a child can find things: things to draw, ways to make art, and art skills.
const ART_GROUPS = [
  { id: 'draw', ico: '✏️', name: 'Things to draw' },
  { id: 'make', ico: '✂️', name: 'Ways to make art', ids: ['paint', 'craft', 'print', 'clay', 'origami', 'naturalart', 'string', 'silhouette', 'doodle', 'comics', 'styles', 'world', 'masks', 'cards', 'mixed', 'chalk', 'mosaic'] },
  { id: 'skill', ico: '🎓', name: 'Art skills', ids: ['perspective', 'shading', 'color', 'pattern', 'letters', 'life'] }
];
const artGroup = id => (ART_GROUPS.find(g => g.ids && g.ids.includes(id)) || ART_GROUPS[0]).id;
function artHome() {
  st.plays.art++; save();
  const nl = nextLesson();
  view.innerHTML = `${crumbs('Art School')}
    ${nl ? `<button class="pick" id="nextL"><span class="big">${nl.ico}</span><span><b>Next lesson: ${nl.title}</b>${LEVEL_NAMES[nl.level]} · ${ART_CATS.find(c => c.id === nl.cat).name}</span></button>` : ''}
    <h3 class="section-title">Studio</h3>
    <div class="tools-row">
      <button class="tool-tile" data-tool="free"><span class="ico">🖍️</span><b>Free draw</b><span>Any idea you like</span></button>
      <button class="tool-tile" data-tool="mandala" style="background:var(--grape);box-shadow:0 4px 0 #4B37A6"><span class="ico">🏵️</span><b>Mandala mode</b><span>Lines copy around</span></button>
      <button class="tool-tile" data-tool="pixel" style="background:var(--sky-deep);box-shadow:0 4px 0 #1D5FA0"><span class="ico">👾</span><b>Pixel art</b><span>Color the squares</span></button>
      <button class="tool-tile" data-tool="mix" style="background:var(--sun);color:var(--ink);box-shadow:0 4px 0 #C9921A"><span class="ico">🎨</span><b>Mix colors</b><span>Make new colors</span></button>
      <button class="tool-tile" data-tool="color" style="background:#F49AC1;color:var(--ink);box-shadow:0 4px 0 #C96E96"><span class="ico">🖌️</span><b>Coloring book</b><span>Tap to fill colors</span></button>
      <button class="tool-tile" data-tool="scene" style="background:var(--orange-deep);box-shadow:0 4px 0 #7F4413"><span class="ico">🏞️</span><b>Sticker scenes</b><span>Make a picture story</span></button>
      <button class="tool-tile" data-tool="shapes" style="background:#1D7C82;box-shadow:0 4px 0 #135A5F"><span class="ico">🔺</span><b>Shape puzzles</b><span>Build with shapes</span></button>
      <button class="tool-tile" data-tool="flip" style="background:#9B3A82;box-shadow:0 4px 0 #6E2A5C"><span class="ico">🎞️</span><b>Flipbook</b><span>Make drawings move</span></button>
      <button class="tool-tile" data-tool="gal" style="background:var(--leaf-deep);box-shadow:0 4px 0 #1A6E46"><span class="ico">🖼️</span><b>My pictures</b><span>${gallery.length} saved</span></button>
    </div>
    <h3 class="section-title">Lessons <span class="tag">${Object.keys(st.art.done).length} of ${LESSONS.length} done</span></h3>
    ${ART_GROUPS.map(g => { const cs = ART_CATS.filter(c => artGroup(c.id) === g.id); return cs.length ? `<h3 class="section-title sub">${g.ico} ${g.name}</h3><div class="cats">${cs.map(c => { const ls = LESSONS.filter(l => l.cat === c.id), d = ls.filter(l => st.art.done[l.id]).length;
      return `<button class="cat" data-cat="${c.id}"><span class="ico">${c.ico}</span><b>${c.name}</b><span>${c.blurb}</span><span>${d} of ${ls.length} done</span></button>`; }).join('')}</div>` : ''; }).join('')}`;
  wireBack(home);
  sayScreen('Welcome to Art School! Pick a lesson or a tool.');
  if (nl) $('#nextL').onclick = () => go(drawLesson, nl.id);
  view.querySelectorAll('[data-tool]').forEach(b => b.onclick = () => { const t = b.dataset.tool; go(t === 'free' ? freeDraw : t === 'mandala' ? () => freeDraw(8) : t === 'pixel' ? pixelHome : t === 'mix' ? mixTab : t === 'color' ? colorHome : t === 'scene' ? sceneHome : t === 'shapes' ? shapeHome : t === 'flip' ? flipHome : galTab); });
  view.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => go(catView, b.dataset.cat));
}
function catView(cid) {
  const c = ART_CATS.find(x => x.id === cid), ls = LESSONS.filter(l => l.cat === cid).sort((a, b) => a.level - b.level);
  view.innerHTML = `${crumbs(`${c.ico} ${c.name}`)}
    <div class="lessons">${ls.map(l => { const open = artLevelOpen(l.level);
      return `<button class="lcard${st.art.done[l.id] ? ' done' : ''}${open ? '' : ' locked'}" data-l="${l.id}"><span class="ico">${open ? l.ico : '🔒'}</span><b>${l.title}</b><span class="lvl-tag lv${l.level}">${LEVEL_NAMES[l.level]}</span><span class="note">${l.steps.length} steps</span></button>`; }).join('')}</div>
    <p class="note">Explorer lessons open after 3 Beginner lessons. Master lessons open after 3 Explorer lessons.</p>`;
  wireBack(artHome);
  sayScreen(`${c.name}. Pick a lesson: ` + ls.filter(l => artLevelOpen(l.level)).map(l => l.title).join(', ') + '.');
  view.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { const l = lessonById(b.dataset.l); if (artLevelOpen(l.level)) go(drawLesson, l.id); else say(`Finish 3 ${LEVEL_NAMES[l.level - 1]} lessons to open this one!`); });
}
function lessonSVG(ls, i, cls) {
  const cleared = ls.steps.slice(0, i + 1).some(s => s[2] && s[2].clear);
  const parts = ls.steps.map((s, k) => {
    if (ls.single ? k !== i : k > i) return '';
    let svg = s[1]; if (!svg) return '';
    if (cleared) svg = svg.replace(/<g class="gd">[\s\S]*?<\/g>/g, '');
    return `<g class="${k === i && !ls.single && cls === 'art-svg' ? 'new' : 'old'}">${svg}</g>`;
  }).join('');
  return `<svg class="${cls}" viewBox="0 0 200 200" aria-hidden="true">${parts}</svg>`;
}
// The newest step draws itself line by line, like a teacher's pen, then colour fades in.
function drawIn(svg) {
  const g = svg && svg.querySelector('g.new');
  if (!g || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = [...g.querySelectorAll('path,line,circle,ellipse,rect,polygon,polyline')].filter(e => !e.closest('.pt,.gd,.fold') && !e.getAttribute('stroke-dasharray') && !/dasharray/.test(e.getAttribute('style') || '') && e.getTotalLength);
  const per = Math.max(0.25, Math.min(0.8, 2.4 / Math.max(1, els.length)));
  let t = 0;
  for (const e of els) { let L = 0; try { L = e.getTotalLength(); } catch (x) {} if (!L) continue; e.style.strokeDasharray = L + 1; e.style.strokeDashoffset = L + 1; e.style.animation = `drawIn ${per}s ${t.toFixed(2)}s ease-out forwards`; t += per * 0.85; }
  g.querySelectorAll('.pt, text, .gd, .fold').forEach(e => { e.style.opacity = 0; e.style.animation = `fadeIn .5s ${t.toFixed(2)}s forwards`; });
}
function drawLesson(id) {
  const ls = lessonById(id); let i = 0, trace = false;
  view.innerHTML = `${crumbs(`${ls.ico} ${ls.title}`)}
    <div class="lesson-view">
      <div class="guide-card"><span class="stepno" id="sn"></span><div id="gsvg"></div><p id="gt"></p><p class="note" id="gx"></p>
        <div class="stepnav"><button class="btn alt" id="prev" aria-label="Back one step">◀</button><button class="speak" id="gspk" aria-label="Read it">🔊</button><button class="speak" id="gplay" aria-label="Show me again">✏️</button><button class="btn" id="next">Next ▶</button></div></div>
      <div class="studio" id="studio"></div>
    </div>`;
  wireBack(() => catView(ls.cat));
  const pad = makePad($('#studio'), { square: true, extra: `<button class="tool" id="trace" aria-pressed="false">👻 Trace</button>${ls.tool === 'mandala' ? '<button class="tool" id="mand">🏵️ Mandala mode</button>' : ''}` });
  const render = () => {
    $('#sn').textContent = `Step ${i + 1} of ${ls.steps.length}`;
    $('#gsvg').innerHTML = lessonSVG(ls, i, 'art-svg'); drawIn($('#gsvg svg'));
    $('#gt').textContent = ls.steps[i][0];
    $('#gx').textContent = i === 0 && ls.need ? `🧰 You need: ${ls.need}` : i === ls.steps.length - 1 && ls.tip ? `💡 Tip: ${ls.tip}` : '';
    $('#prev').disabled = i === 0; $('#prev').style.opacity = i === 0 ? .4 : 1;
    $('#next').textContent = i === ls.steps.length - 1 ? 'I finished! 🎉' : 'Next ▶';
    pad.setTrace(trace ? lessonSVG(ls, i, 'trace-svg') : '');
    say(ls.steps[i][0]);
  };
  $('#prev').onclick = () => { if (i > 0) { i--; render(); } };
  $('#next').onclick = () => {
    if (i < ls.steps.length - 1) { i++; render(); tone([600]); return; }
    const first = !st.art.done[ls.id]; st.art.done[ls.id] = today();
    if (pad.drawn()) pad.save(false);
    questTick('art'); dayLog('art'); addStars(first ? 3 : 1); confetti(); yay();
    say(`You finished ${ls.title}! ${first ? 'You earned 3 stars!' : ''}`);
    const nl = nextLesson();
    view.innerHTML = `<div class="view done"><div class="big">${ls.ico}</div><h1>Beautiful work!</h1><p style="font-weight:800;font-size:22px">${first ? 'You earned 3 ⭐' : 'Practice makes perfect!'}${pad.drawn() ? ' Your drawing is saved in My pictures.' : ''}</p>
      <div class="row">${nl ? `<button class="btn leaf" id="nl">Next: ${nl.title}</button>` : ''}<button class="btn alt" id="more">More lessons</button></div></div>`;
    if (nl) $('#nl').onclick = () => go(drawLesson, nl.id);
    $('#more').onclick = () => go(catView, ls.cat);
  };
  $('#gspk').onclick = () => say(ls.steps[i][0]);
  $('#gplay').onclick = () => { $('#gsvg').innerHTML = lessonSVG(ls, i, 'art-svg'); drawIn($('#gsvg svg')); };
  $('#trace').onclick = e => { trace = !trace; e.currentTarget.setAttribute('aria-pressed', trace); render(); if (trace) say('Trace mode! Draw over the light lines.'); };
  if (ls.tool === 'mandala') $('#mand').onclick = () => go(freeDraw, 8);
  render();
}
function freeDraw(sym = 0) {
  const IDEAS = ['Draw your family as animals.', 'Draw a house with a square and a triangle roof.', 'Draw a monster with 3 eyes.', 'Draw what you want to be when you grow up.', 'Draw a rainbow with 7 colors.', 'Draw a robot using only rectangles.', 'Draw your favourite food.', 'Draw an underwater city.', 'Draw a pattern with circles and squares.', 'Draw a dragon having a picnic.'];
  let idea = sym ? 'Draw anywhere. Every line copies all the way around the middle!' : pick(IDEAS);
  view.innerHTML = `${crumbs(sym ? 'Mandala mode' : 'Free draw')}
    <div class="idea"><span style="font-size:34px">💡</span><p id="idea">${idea}</p><button class="speak" id="ispk" aria-label="Read it">🔊</button>${sym ? '' : '<button class="tool" id="inew">New idea</button>'}</div>
    <div class="studio" id="studio"></div>`;
  wireBack(artHome);
  const pad = makePad($('#studio'), { square: !!sym, sym });
  say(idea);
  $('#ispk').onclick = () => say(idea);
  if (!sym) $('#inew').onclick = () => { idea = pick(IDEAS.filter(x => x !== idea)); $('#idea').textContent = idea; say(idea); };
  void pad;
}
// A drawing pad: transparent canvas over a white card, with optional trace layer and symmetry.
function makePad(el, { square = false, sym = 0, extra = '' } = {}) {
  el.innerHTML = `<div class="canvas-wrap${square ? ' sq' : ''}" id="cw"><div id="tr"></div><canvas id="cv" role="img" aria-label="Drawing pad: draw here with your finger"></canvas><div class="mirror-line" id="ml" hidden></div></div>
    <div class="tools">${PAINT.map((c, i) => `<button class="sw" style="background:${c};${c === '#FFFFFF' ? 'box-shadow:inset 0 0 0 2px var(--line)' : ''}" data-c="${c}" aria-label="${PAINT_NAMES[i]}" aria-pressed="${i === 0}"></button>`).join('')}</div>
    <div class="tools">
      <button class="tool size" data-z="5" aria-label="thin"><i style="width:6px;height:6px"></i></button>
      <button class="tool size" data-z="12" aria-pressed="true" aria-label="medium"><i style="width:14px;height:14px"></i></button>
      <button class="tool size" data-z="28" aria-label="thick"><i style="width:26px;height:26px"></i></button>
      <button class="tool" id="er" aria-pressed="false">🧽 Eraser</button>
      <span class="sym" role="group" aria-label="Mirror">${[[0, 'No mirror'], [2, '🦋 Mirror'], [4, '✳️ 4'], [6, '❄️ 6'], [8, '🏵️ 8']].map(([n, t]) => `<button class="tool" data-sym="${n}" aria-pressed="${n === sym}">${t}</button>`).join('')}</span>
      ${extra}
      <button class="tool" id="und">↩️ Undo</button>
      <button class="tool" id="clr">🗑️ Clear</button>
      <button class="tool" id="sav" style="background:var(--leaf-deep);color:#fff">💾 Save</button></div>`;
  const cw = el.querySelector('#cw'), cv = el.querySelector('#cv'), ctx = cv.getContext('2d');
  let color = PAINT[0], size = 12, eraser = false, drawing = false, last = null, dirty = false, unsaved = false; const undo = [];
  const W = () => cw.getBoundingClientRect();
  function fit() {
    const r = W(), dpr = window.devicePixelRatio || 1, old = dirty ? cv.toDataURL() : null;
    cv.width = Math.max(1, r.width * dpr); cv.height = Math.max(1, r.height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (old) { const im = new Image(); im.onload = () => ctx.drawImage(im, 0, 0, r.width, r.height); im.src = old; }
  }
  fit(); const ro = new ResizeObserver(() => fit()); ro.observe(cw);
  canvasCleanup = () => ro.disconnect();
  const pos = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  function copies(p) {
    const r = W(), cx = r.width / 2, cy = r.height / 2, out = [p];
    if (sym === 2) out.push([2 * cx - p[0], p[1]]);
    else if (sym > 2) for (let k = 1; k < sym; k++) { const a = k * 2 * Math.PI / sym, dx = p[0] - cx, dy = p[1] - cy; out.push([cx + dx * Math.cos(a) - dy * Math.sin(a), cy + dx * Math.sin(a) + dy * Math.cos(a)]); }
    return out;
  }
  function seg(a, b) {
    ctx.globalCompositeOperation = eraser ? 'destination-out' : 'source-over';
    ctx.strokeStyle = color; ctx.lineWidth = eraser ? size * 2 : size; ctx.lineCap = ctx.lineJoin = 'round';
    const A = copies(a), B = copies(b);
    A.forEach((p, k) => { ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(B[k][0], B[k][1]); ctx.stroke(); });
    ctx.globalCompositeOperation = 'source-over';
  }
  function restore(src) { const r = W(); ctx.clearRect(0, 0, r.width, r.height); if (!src) return; const im = new Image(); im.onload = () => ctx.drawImage(im, 0, 0, r.width, r.height); im.src = src; }
  cv.onpointerdown = e => { drawing = true; dirty = unsaved = true; try { cv.setPointerCapture(e.pointerId); } catch (x) {} undo.push(cv.toDataURL()); if (undo.length > 15) undo.shift(); last = pos(e); seg(last, last); };
  cv.onpointermove = e => { if (!drawing) return; const p = pos(e); seg(last, p); last = p; };
  cv.onpointerup = cv.onpointercancel = () => { drawing = false; };
  const setSym = n => { sym = n; el.querySelector('#ml').hidden = sym !== 2; el.querySelectorAll('[data-sym]').forEach(x => x.setAttribute('aria-pressed', +x.dataset.sym === n)); };
  setSym(sym);
  el.querySelectorAll('.sw').forEach(b => b.onclick = () => { color = b.dataset.c; eraser = false; el.querySelector('#er').setAttribute('aria-pressed', 'false'); el.querySelectorAll('.sw').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  el.querySelectorAll('[data-z]').forEach(b => b.onclick = () => { size = +b.dataset.z; el.querySelectorAll('[data-z]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  el.querySelector('#er').onclick = e => { eraser = !eraser; e.currentTarget.setAttribute('aria-pressed', eraser); };
  el.querySelectorAll('[data-sym]').forEach(b => b.onclick = () => { setSym(+b.dataset.sym); if (sym === 2) say('Mirror is on. Both sides match, like a butterfly. That is called symmetry!'); else if (sym) say(`Every line copies ${sym} times around the middle!`); });
  el.querySelector('#und').onclick = () => { unsaved = true; restore(undo.pop() || null); };
  el.querySelector('#clr').onclick = () => { unsaved = true; undo.push(cv.toDataURL()); restore(null); };
  function savePic(cheer = true) {
    // A double tap (or a tap with nothing new drawn) does not save the same picture again.
    if (cheer && !unsaved) { say(dirty ? 'It is saved! Draw some more, then save again.' : 'Draw something first!'); return; }
    unsaved = false;
    const t = document.createElement('canvas'), w = 360; t.width = w; t.height = Math.round(w * cv.height / cv.width);
    const tc = t.getContext('2d'); tc.fillStyle = '#fff'; tc.fillRect(0, 0, t.width, t.height); tc.drawImage(cv, 0, 0, t.width, t.height);
    gallery.unshift(t.toDataURL('image/jpeg', 0.75)); gallery = gallery.slice(0, 30); saveGallery();
    if (cheer) { questTick('art'); dayLog('art'); addStars(1); confetti(20); yay(); say('Saved to your pictures! You earned a star.'); }
  }
  el.querySelector('#sav').onclick = () => savePic(true);
  return (livePad = { setTrace: svg => { el.querySelector('#tr').innerHTML = svg; }, save: savePic, drawn: () => dirty, cv });
}
const MIXES = { 'red+yellow': ['#FF8A2B', 'orange'], 'blue+yellow': ['#2FA36B', 'green'], 'blue+red': ['#6D55D1', 'purple'], 'red+white': ['#F49AC1', 'pink'], 'blue+white': ['#8EC5F5', 'light blue'], 'white+yellow': ['#FFE79A', 'light yellow'], 'black+red': ['#8E2A20', 'dark red'], 'black+blue': ['#123E6E', 'navy blue'], 'black+white': ['#9AA0A8', 'grey'], 'black+yellow': ['#7A7A1E', 'olive'] };
const BASE = { red: '#F2604F', yellow: '#FFC23D', blue: '#2E8BE6', white: '#FFFFFF', black: '#22252B' };
function mixTab() {
  const goals = ['orange', 'green', 'purple', 'pink', 'light blue', 'grey', 'navy blue'];
  let goal = pick(goals.slice(0, 4)), pot = [];
  view.innerHTML = `${crumbs('Mix colors')}<div class="mix"><h2 id="goal" style="font-size:30px;text-align:center"></h2>
    <div class="pot" id="pot">Tap two paints</div>
    <div class="paints">${Object.entries(BASE).map(([n, c]) => `<button data-p="${n}" style="background:${c};${n === 'white' ? 'color:#22305A;' : ''}">${n}</button>`).join('')}</div>
    <div class="row"><button class="btn alt" id="empty">Empty the pot</button></div></div>`;
  wireBack(artHome);
  const potEl = $('#pot');
  const setGoal = () => { $('#goal').textContent = `Can you make ${goal}?`; say(`Can you make ${goal}? Pick two paints.`); };
  setGoal();
  view.querySelectorAll('[data-p]').forEach(b => b.onclick = () => {
    if (pot.length >= 2) pot = [];
    pot.push(b.dataset.p); tone([440 + pot.length * 110]);
    if (pot.length === 1) { potEl.style.background = BASE[pot[0]]; potEl.textContent = pot[0] + ' + ?'; potEl.style.color = pot[0] === 'white' || pot[0] === 'yellow' ? '#22305A' : '#fff'; return; }
    const key = [...pot].sort().join('+'), res = pot[0] === pot[1] ? [BASE[pot[0]], pot[0]] : MIXES[key] || ['#8B7F72', 'muddy brown'];
    potEl.style.background = res[0]; potEl.textContent = `${pot[0]} + ${pot[1]} = ${res[1]}`; potEl.style.color = /yellow|light|pink|white|grey/.test(res[1]) ? '#22305A' : '#fff';
    if (res[1] === goal) { yay(); confetti(25); questTick('mix'); addStars(1); say(`${pot[0]} and ${pot[1]} make ${res[1]}! You did it!`); goal = pick(goals.filter(g => g !== goal)); const nav = navId; setTimeout(() => { if (nav === navId) setGoal(); }, 2600); }
    else say(`${pot[0]} and ${pot[1]} make ${res[1]}.`);
  });
  $('#empty').onclick = () => { pot = []; potEl.style.background = ''; potEl.style.color = ''; potEl.textContent = 'Tap two paints'; };
}
function galTab() {
  view.innerHTML = `${crumbs('My pictures')}` + (gallery.length ? `<div class="gallery">${gallery.map(g => `<img src="${g}" alt="My drawing">`).join('')}</div>`
    : `<div class="mix"><span style="font-size:64px">🖼️</span><p style="font-weight:800;font-size:22px;text-align:center">Your saved drawings will show up here.</p></div>`);
  wireBack(artHome); flipHome.gal();
}

/* ---------- pixel art: copy a picture square by square; the last level uses grid coordinates ---------- */
const PX = { r: '#F2604F', y: '#FFC23D', b: '#2E8BE6', g: '#2FA36B', k: '#22305A', o: '#FF8A2B', p: '#F49AC1', w: '#FFFFFF', n: '#8B5A2B', u: '#6D55D1' };
const PXNAME = { r: 'red', y: 'yellow', b: 'blue', g: 'green', k: 'black', o: 'orange', p: 'pink', w: 'white', n: 'brown', u: 'purple' };
const PICS = [
  { id: 'heart', name: 'Heart', level: 1, rows: ['.rr.rr.', 'rrrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'] },
  { id: 'flag', name: 'Rainbow flag', level: 1, rows: ['rrrrrr', 'oooooo', 'yyyyyy', 'gggggg', 'bbbbbb', 'uuuuuu'] },
  { id: 'smiley', name: 'Smiley', level: 2, rows: ['..yyyy..', '.yyyyyy.', 'yykyykyy', 'yyyyyyyy', 'ykyyyyky', 'yykkkkyy', '.yyyyyy.', '..yyyy..'] },
  { id: 'mushroom', name: 'Mushroom', level: 2, rows: ['..rrrr..', '.rrwwrr.', 'rwwrrwwr', 'rrrrrrrr', '..wwww..', '..wkwk..', '..wwww..', '..wwww..'] },
  { id: 'cat', name: 'Cat', level: 3, rows: ['.o......o.', '.oo....oo.', '.oooooooo.', 'oooooooooo', 'oogoooogoo', 'oooooooooo', 'ooooppoooo', '.oookkooo.', '..oooooo..', '..........'] },
  { id: 'tree', name: 'Tree', level: 3, rows: ['....gg....', '...gggg...', '..gggggg..', '.gggggggg.', 'gggggggggg', '..gggggg..', '.gggrgggg.', 'gggggggrgg', '....nn....', '....nn....'] },
  { id: 'rocket', name: 'Rocket', level: 4, rows: ['.....rr.....', '....rrrr....', '....wwww....', '....wbbw....', '....wbbw....', '....wwww....', '....wwww....', '...rwwwwr...', '..rrwwwwrr..', '..rr.oo.rr..', '.....oo.....', '.....yy.....'] },
  { id: 'fish', name: 'Fish', level: 4, rows: ['............', '....bbbb....', '..bbbbbbb..b', '.bwkbbbbbbbb', 'bbbbbbbbbbb.', 'bbbbbybbbbb.', '.bbbbybbbbbb', '..bbbbbbb..b', '....bbbb....', '............', '....b.......', '...b.b......'] },
  { id: 'xheart', name: 'Secret picture A', level: 5, coord: true, rows: ['.rr.rr.', 'rrrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'] },
  { id: 'xmush', name: 'Secret picture B', level: 5, coord: true, rows: ['..rrrr..', '.rrwwrr.', 'rwwrrwwr', 'rrrrrrrr', '..wwww..', '..wkwk..', '..wwww..', '..wwww..'] }
];
const COLS = 'ABCDEFGHIJKL';
function pixelHome() {
  view.innerHTML = `${crumbs('Pixel art')}<p class="note">Copy the picture one square at a time. Count across and down! The last level gives secret pictures as grid directions.</p>
    <div class="lessons">${PICS.map(p => { const open = st.unlockAll || p.level <= st.art.pixel;
      return `<button class="lcard${st.art.pixelDone[p.id] ? ' done' : ''}${open ? '' : ' locked'}" data-p="${p.id}"><span class="ico">${open ? (p.coord ? '🗺️' : '👾') : '🔒'}</span><b>${p.name}</b><span class="lvl-tag lv${Math.min(3, Math.ceil(p.level / 2))}">Level ${p.level} · ${p.rows[0].length}×${p.rows.length}</span></button>`; }).join('')}</div>`;
  wireBack(artHome);
  sayScreen('Pick a pixel picture to copy!');
  view.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { const p = PICS.find(x => x.id === b.dataset.p); if (st.unlockAll || p.level <= st.art.pixel) go(pixelPlay, p.id); else say('Finish a picture on the level before to open this one!'); });
}
function pixelPlay(id) {
  const P = PICS.find(x => x.id === id), H = P.rows.length, Wd = P.rows[0].length, used = [...new Set(P.rows.join('').replace(/\./g, ''))];
  const grid = Array.from({ length: H }, () => Array(Wd).fill('.')); let cur = used[0], painting = false, solved = false;
  const lab = !!P.coord, cols = Wd + (lab ? 1 : 0);
  const instr = P.rows.map((r, y) => { const byC = {}; r.split('').forEach((ch, x) => { if (ch !== '.') (byC[ch] = byC[ch] || []).push(COLS[x]); }); const parts = Object.entries(byC).map(([ch, xs]) => `${xs.join(', ')} ${PXNAME[ch]}`); return parts.length ? `Row ${y + 1}: ${parts.join(' · ')}` : ''; }).filter(Boolean);
  view.innerHTML = `${crumbs(P.name)}
    <div class="pixel"><div class="pgrid" id="pg" style="grid-template-columns:repeat(${cols},1fr);--ar:${cols}/${H + (lab ? 1 : 0)}"></div>
    <div class="pside">${lab ? `<ul class="coords-list">${instr.map(s => `<li>${s}</li>`).join('')}</ul>` : `<div class="ptarget" style="grid-template-columns:repeat(${Wd},1fr)">${P.rows.join('').split('').map(ch => `<i style="background:${ch === '.' ? '#fff' : PX[ch]}"></i>`).join('')}</div>`}
      <div class="tools">${[...used, '.'].map((ch, i) => `<button class="sw" data-px="${ch}" style="background:${ch === '.' ? '#fff' : PX[ch]};${ch === '.' || ch === 'w' ? 'box-shadow:inset 0 0 0 2px var(--line)' : ''}" aria-label="${ch === '.' ? 'eraser' : PXNAME[ch]}" aria-pressed="${i === 0}">${ch === '.' ? '🧽' : ''}</button>`).join('')}</div>
      <button class="btn leaf" id="chk">Check my picture</button><p class="note" id="pmsg" aria-live="polite"></p></div></div>`;
  wireBack(pixelHome);
  say(lab ? 'Follow the directions. Row 1 is the top row. The letters tell you which column.' : 'Copy the picture. Pick a color, then tap the squares.');
  const pg = $('#pg');
  let html = '';
  if (lab) { html += '<b class="lab"></b>' + Array.from({ length: Wd }, (_, x) => `<b class="lab">${COLS[x]}</b>`).join(''); }
  for (let y = 0; y < H; y++) { if (lab) html += `<b class="lab">${y + 1}</b>`; for (let x = 0; x < Wd; x++) html += `<b data-x="${x}" data-y="${y}"></b>`; }
  pg.innerHTML = html;
  const paintCell = el => { if (!el || el.dataset.x == null) return; const x = +el.dataset.x, y = +el.dataset.y; if (grid[y][x] !== cur) solved = false; grid[y][x] = cur; el.style.background = cur === '.' ? '#fff' : PX[cur]; el.classList.remove('bad'); };
  pg.onpointerdown = e => { painting = true; try { pg.setPointerCapture(e.pointerId); } catch (x) {} paintCell(document.elementFromPoint(e.clientX, e.clientY)); };
  pg.onpointermove = e => { if (painting) paintCell(document.elementFromPoint(e.clientX, e.clientY)); };
  pg.onpointerup = pg.onpointercancel = () => { painting = false; };
  view.querySelectorAll('[data-px]').forEach(b => b.onclick = () => { cur = b.dataset.px; view.querySelectorAll('[data-px]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  $('#chk').onclick = () => {
    let right = 0, bad = 0;
    pg.querySelectorAll('[data-x]').forEach(el => { const x = +el.dataset.x, y = +el.dataset.y, ok = grid[y][x] === P.rows[y][x]; if (ok) right++; else { bad++; el.classList.add('bad'); } });
    const pct = Math.round(right / (H * Wd) * 100);
    if (!bad && solved) { say(`Perfect! You made the ${P.name}!`); return; }
    if (!bad) {
      solved = true; const first = !st.art.pixelDone[P.id]; st.art.pixelDone[P.id] = today(); st.art.pixel = Math.max(st.art.pixel, Math.min(5, P.level + 1));
      questTick('pixel'); addStars(first ? 3 : 1); confetti(); yay(); $('#pmsg').textContent = 'Perfect copy! 🎉'; say(`Perfect! You made the ${P.name}!`);
    } else { $('#pmsg').textContent = `${pct}% right. The squares with a red border need fixing.`; say(`${pct} percent right. Fix the squares with a red border.`); }
  };
}

/* ---------- Ask Owl: offline answers, grows from what grown-ups teach it ---------- */
const KB = [
  { k: ['zero', 'nothing'], q: 'What is zero?', a: 'Zero means none at all. If you have 3 cookies and eat all 3, you have zero left!', v: () => objs(3, '🍪', { gone: 3 }) },
  { k: ['number'], q: 'What is a number?', a: 'A number tells us how many. Three ducks, three cars, three jumps. It is always 3!', v: () => objs(3, '🦆') },
  { k: ['plus', 'add', 'adding', 'addition'], q: 'What does plus mean?', a: 'Plus means put together. 2 apples plus 1 apple, push them together and count. 3 apples!', v: () => `${objs(2, '🍎')}<span class="op">+</span>${objs(1, '🍎')}` },
  { k: ['minus', 'take away', 'subtract', 'subtraction'], q: 'What does take away mean?', a: 'Take away means some go away. Then you count what is left.', v: () => objs(5, '🐟', { gone: 2 }) },
  { k: ['equal', 'equals', 'same'], q: 'What does equals mean?', a: 'Equals means both sides are the same amount, like a seesaw that is perfectly flat.' },
  { k: ['bigger', 'more', 'larger'], q: 'How do I know which is bigger?', a: 'The bigger number has more things. Line them up and see which line is longer!', v: () => `<div class="row">${objs(5, '⭐')}${objs(2, '⭐')}</div>` },
  { k: ['biggest number', 'infinity', 'last number'], q: 'What is the biggest number?', a: 'There is no biggest number! You can always add one more. People call that idea infinity.' },
  { k: ['even', 'odd'], q: 'What is an even number?', a: 'Even numbers can make pairs with no one left out, like 4 socks. Odd numbers always have one left over, like 5 socks.', v: () => `<div class="row">${objs(4, '🧦')}${objs(5, '🧦')}</div>` },
  { k: ['half', 'halves'], q: 'What is half?', a: 'Half means two parts that are the same size. Cut a sandwich down the middle and you get two halves.', v: () => pieSVG(2, 1) },
  { k: ['fraction', 'quarter', 'third'], q: 'What is a fraction?', a: 'A fraction is part of a whole cut into equal pieces. 3 out of 4 pieces is three quarters, written 3/4.', v: () => pieSVG(4, 3) },
  { k: ['times', 'multiply', 'multiplication', 'times table'], q: 'What does times mean?', a: '2 times 3 means 2 groups of 3. Count them all and you get 6.', v: () => `<div class="row">${objs(3, '🍓')}${objs(3, '🍓')}</div>` },
  { k: ['divide', 'division', 'divided', 'share', 'sharing'], q: 'What does divide mean?', a: 'Divide means share equally. 6 cookies shared by 2 friends is 3 each. So 6 ÷ 2 = 3.', v: () => `<div class="row">${objs(3, '🍪')}${objs(3, '🍪')}</div>` },
  { k: ['remainder', 'left over'], q: 'What is a remainder?', a: 'A remainder is what is left over when you cannot share equally. 7 shared by 2 is 3 each, with 1 left over.' },
  { k: ['decimal', 'point'], q: 'What is a decimal?', a: 'A decimal shows parts of a whole using a dot. 0.5 means 5 tenths, which is the same as a half.', v: () => barSVG(10, 5) },
  { k: ['percent', 'percentage'], q: 'What is a percent?', a: 'Percent means out of 100. 50 percent is half. 100 percent is all of it!', v: () => barSVG(10, 5) },
  { k: ['negative', 'minus number', 'below zero'], q: 'What is a negative number?', a: 'Negative numbers are less than zero, like a very cold day of minus 5 degrees. On a number line they are to the left of zero.' },
  { k: ['algebra', 'letter', 'x'], q: 'What is algebra?', a: 'Algebra uses a letter like x for a mystery number. In x + 2 = 5, x is 3. Algebra is a puzzle where you find the mystery!' },
  { k: ['area'], q: 'What is area?', a: 'Area is how much space a flat shape covers. Count the squares inside, or for a rectangle do length times width.', v: () => rectSVG(4, 3, true) },
  { k: ['perimeter'], q: 'What is perimeter?', a: 'Perimeter is the distance all the way around the edge. Like walking around a park!', v: () => rectSVG(4, 3, false) },
  { k: ['angle', 'degree'], q: 'What is an angle?', a: 'An angle is how much something turns. A square corner is 90 degrees. A full turn is 360 degrees.', v: () => angleSVG(90) },
  { k: ['prime'], q: 'What is a prime number?', a: 'A prime number can only be divided by 1 and itself. 2, 3, 5, 7 and 11 are primes.' },
  { k: ['square number', 'squared'], q: 'What is a square number?', a: 'A square number is a number times itself. 3 times 3 is 9, so 9 is a square number. You can make a square with 9 dots!' },
  { k: ['pi'], q: 'What is pi?', a: 'Pi is about 3.14. It is how many times the distance across a circle fits around the outside of it.' },
  { k: ['count to 100', 'count high', 'hundred'], q: 'How do I count to 100?', a: 'Count in tens! 10, 20, 30, 40, 50, 60, 70, 80, 90, 100. Then fill in the numbers between.' },
  { k: ['clock', 'time'], q: 'How do I tell the time?', a: 'The short hand points to the hour. When the long hand points straight up to 12, it is something o\'clock!', v: () => clockSVG(3, 0) },
  { k: ['shape'], q: 'What is a shape?', a: 'A shape is the outline of something. A ball looks like a circle. A door looks like a rectangle.', v: () => `<div class="row">${shapeSVG('circle', '#F2604F')}${shapeSVG('rectangle', '#2E8BE6')}</div>` },
  { k: ['circle', 'round'], q: 'What is a circle?', a: 'A circle is perfectly round. It has no corners and no straight sides. Like a pizza!', v: () => shapeSVG('circle', '#FFC23D') },
  { k: ['triangle'], q: 'What is a triangle?', a: 'A triangle has 3 sides and 3 corners. Tri means three!', v: () => shapeSVG('triangle', '#2FA36B', true) },
  { k: ['square'], q: 'What is a square?', a: 'A square has 4 sides that are all the same length, and 4 corners.', v: () => shapeSVG('square', '#2E8BE6', true) },
  { k: ['rectangle'], q: 'What is a rectangle?', a: 'A rectangle has 4 sides and 4 corners. Two sides are long and two are short, like a door.', v: () => shapeSVG('rectangle', '#6D55D1', true) },
  { k: ['hexagon', 'honeycomb'], q: 'What is a hexagon?', a: 'A hexagon has 6 sides. Bees build their honeycomb out of hexagons!', v: () => shapeSVG('hexagon', '#FFC23D', true) },
  { k: ['pentagon'], q: 'What is a pentagon?', a: 'A pentagon has 5 sides and 5 corners.', v: () => shapeSVG('pentagon', '#F2604F', true) },
  { k: ['pattern'], q: 'What is a pattern?', a: 'A pattern is something that repeats. Red, blue, red, blue. Can you guess what comes next?', v: () => `<div class="pat">${dot('#F2604F')}${dot('#2E8BE6')}${dot('#F2604F')}${dot('#2E8BE6')}<span class="dot q">?</span></div>` },
  { k: ['symmetry', 'mirror', 'butterfly'], q: 'What is symmetry?', a: 'Symmetry means both halves match, like a butterfly. Try the Mirror button in Free draw!' },
  { k: ['green'], q: 'How do I make green?', a: 'Mix blue and yellow. They make green!', v: () => `<div class="row">${dot('#2E8BE6')}<span class="op">+</span>${dot('#FFC23D')}<span class="op">=</span>${dot('#2FA36B')}</div>` },
  { k: ['orange'], q: 'How do I make orange?', a: 'Mix red and yellow. They make orange!', v: () => `<div class="row">${dot('#F2604F')}<span class="op">+</span>${dot('#FFC23D')}<span class="op">=</span>${dot('#FF8A2B')}</div>` },
  { k: ['purple'], q: 'How do I make purple?', a: 'Mix red and blue. They make purple!', v: () => `<div class="row">${dot('#F2604F')}<span class="op">+</span>${dot('#2E8BE6')}<span class="op">=</span>${dot('#6D55D1')}</div>` },
  { k: ['pink'], q: 'How do I make pink?', a: 'Mix red and white. You get pink!', v: () => `<div class="row">${dot('#F2604F')}<span class="op">+</span>${dot('#FFFFFF')}<span class="op">=</span>${dot('#F49AC1')}</div>` },
  { k: ['brown'], q: 'How do I make brown?', a: 'Mix colors that are opposite, like red and green, or mix all three primaries together. You get brown!' },
  { k: ['primary', 'main color'], q: 'What are primary colors?', a: 'Red, yellow and blue. You can mix them to make lots of other colors!', v: () => `<div class="row">${dot('#F2604F')}${dot('#FFC23D')}${dot('#2E8BE6')}</div>` },
  { k: ['warm', 'cool'], q: 'What are warm and cool colors?', a: 'Warm colors are red, orange and yellow, like fire. Cool colors are blue, green and purple, like water.', v: () => `<div class="row">${dot('#F2604F')}${dot('#FF8A2B')}${dot('#FFC23D')}<span class="op">·</span>${dot('#2E8BE6')}${dot('#2FA36B')}${dot('#6D55D1')}</div>` },
  { k: ['complementary', 'opposite color'], q: 'What are complementary colors?', a: 'Colors opposite each other on the color wheel: red and green, blue and orange, yellow and purple. Side by side, they make each other pop!' },
  { k: ['rainbow'], q: 'What colors are in a rainbow?', a: 'Red, orange, yellow, green, blue, indigo and violet. That is 7 colors!', v: () => `<div class="pat">${['#F2604F', '#FF8A2B', '#FFC23D', '#2FA36B', '#2E8BE6', '#3F3FA8', '#6D55D1'].map(dot).join('')}</div>` },
  { k: ['perspective', '3d', 'vanishing'], q: 'How do I make a drawing look 3D?', a: 'Things far away look smaller. Lines going away meet at one spot called the vanishing point. Try the 3D and Perspective lessons!' },
  { k: ['shade', 'shading', 'shadow'], q: 'How do I shade?', a: 'Find where the light comes from. Make the side away from the light darker, and put the shadow on the ground away from the light.' },
  { k: ['horizon'], q: 'What is a horizon line?', a: 'The horizon is where the land or sea meets the sky. It is at the height of your eyes.' },
  { k: ['origami', 'fold', 'paper'], q: 'What is origami?', a: 'Origami is the art of folding paper into shapes, like planes, cups and animals, with no glue or scissors!' },
  { k: ['mandala'], q: 'What is a mandala?', a: 'A mandala is a circle pattern that repeats all the way around. Try Mandala mode in Art School!' },
  { k: ['pixel'], q: 'What is pixel art?', a: 'Pixel art is a picture made of tiny colored squares, like old video games. Try it in Art School!' },
  { k: ['sky', 'blue sky'], q: 'Why is the sky blue?', a: 'Sunlight has all the colors inside it. The air bounces the blue light around the most, so the sky looks blue!' },
  { k: ['draw a cat', 'draw cat', 'drawing a cat'], q: 'How do I draw a cat?', a: 'Draw a big circle for the head. Add two triangle ears on top. Then two dot eyes, a little nose and whiskers! There is a cat lesson in Art School.' },
  { k: ['draw', 'drawing', 'art'], q: 'What should I draw?', a: 'Try a house! A square for the walls and a triangle for the roof. Art School has lots of step-by-step lessons.' },
  { k: ['money', 'coin', 'coins', 'cents', 'cent'], q: 'How do I count money?', a: 'Look at the number on each coin. Start with the biggest coin, then count on with the others. 10, then 15, then 16 cents!', v: () => coins([10, 5, 1]) },
  { k: ['dollar', 'dollars'], q: 'How many cents in a dollar?', a: 'One dollar is the same as 100 cents. So two 50 cent coins make one dollar!', v: () => coins([50, 50]) },
  { k: ['change', 'pay', 'shop', 'buy'], q: 'What is change?', a: 'Change is the money you get back when you pay too much. A toy costs 70 cents, you pay 100 cents, so you get 30 cents back. Count up from 70 to 100!' },
  { k: ['measure', 'ruler', 'centimetre', 'centimeter', 'cm', 'long', 'length'], q: 'How do I measure with a ruler?', a: 'Put the start of the thing at 0 on the ruler. Look at the number where it ends. That is how long it is!', v: () => ruler(4, 6) },
  { k: ['metre', 'meter'], q: 'How long is a metre?', a: 'A metre is 100 centimetres. That is about one big step for a grown-up, or as tall as a kitchen table.' },
  { k: ['kilometre', 'kilometer', 'km'], q: 'How far is a kilometre?', a: 'A kilometre is 1000 metres. Walking one kilometre takes about 15 minutes.' },
  { k: ['weigh', 'weight', 'heavy', 'kilogram', 'gram', 'kg'], q: 'What is a kilogram?', a: 'A kilogram tells us how heavy something is. A big bag of sugar weighs about 1 kilogram. 1 kilogram is 1000 grams.' },
  { k: ['litre', 'liter', 'millilitre', 'milliliter', 'capacity'], q: 'What is a litre?', a: 'A litre tells us how much a container holds. A big bottle of water holds 1 litre. That is 1000 millilitres.' },
  { k: ['chart', 'graph', 'bar chart', 'tally'], q: 'What is a bar chart?', a: 'A bar chart is a picture of numbers. Each bar shows how many. The tallest bar has the most!', v: () => chartSVG([['🍎', 3], ['🍌', 5], ['🍇', 2]]) },
  { k: ['average', 'mean'], q: 'What is an average?', a: 'The average is the fair share. Add all the numbers, then share the total equally. 2, 4 and 6 add to 12. 12 shared by 3 is 4!' },
  { k: ['minute', 'minutes', 'hour', 'hours', 'second', 'seconds'], q: 'How many minutes in an hour?', a: 'There are 60 minutes in an hour, and 60 seconds in a minute. A minute is about how long it takes to wash your hands really well.' },
  { k: ['week', 'days in a week', 'month', 'year', 'calendar'], q: 'How many days are in a week?', a: 'A week has 7 days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday and Sunday. A year has 12 months and 365 days.' },
  { k: ['watercolor', 'watercolour', 'paint', 'painting', 'brush'], q: 'How do I paint with watercolors?', a: 'Use lots of water and a little paint. Paint light colors first and dark ones last. Let it dry before painting next to a wet part, or the colors will run together!' },
  { k: ['collage', 'glue', 'tear'], q: 'What is a collage?', a: 'A collage is a picture made by sticking pieces of paper, cloth or leaves together. Tear or cut shapes, move them around until you like it, then glue!' },
  { k: ['why math', 'why learn'], q: 'Why do we learn math?', a: 'Math helps us share snacks fairly, build things, cook, play games and so much more!' }
];
const STOP = new Set('what is a an the how do does i you me my can why are to of it this that there please tell about make with and or'.split(' '));
const norm = s => ' ' + s.toLowerCase().replace(/[^a-z0-9+×*÷/\-\s]/g, ' ').split(/\s+/).filter(Boolean).map(w => w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w).join(' ') + ' ';
const words = s => norm(s).trim().split(' ').filter(w => !STOP.has(w));
function mathAnswer(text) {
  const t = text.toLowerCase().replace(/×/g, 'x').replace(/÷/g, '/');
  let m = t.match(/(\d+)\s*(\+|plus|add|and|-|minus|take away|takeaway|x|times|\*|\/|divided by|shared by)\s*(\d+)/);
  if (m) {
    const a = +m[1], b = +m[3], op = m[2];
    if (a > 100000 || b > 100000) return null;
    const [e] = pick(THINGS);
    if (/\+|plus|add|and/.test(op)) return { a: `${a} plus ${b} is ${a + b}. Put them together and count them all!`, v: a + b <= 20 ? `${objs(a, e)}<span class="op">+</span>${objs(b, e)}` : `<span class="bignum">${a} + ${b} = ${a + b}</span>` };
    if (/^(x|times|\*)$/.test(op)) return { a: `${a} times ${b} is ${a * b}. That is ${a} groups of ${b}.`, v: a * b <= 25 ? `<div class="row">${Array.from({ length: a }, () => objs(b, e)).join('')}</div>` : `<span class="bignum">${a} × ${b} = ${a * b}</span>` };
    if (/\/|divided|shared/.test(op)) { if (!b) return { a: 'You cannot share things between zero friends. Dividing by zero does not work!' }; const q = Math.floor(a / b), r = a % b; return { a: `${a} divided by ${b} is ${q}${r ? ` with ${r} left over` : ''}. Share ${a} into ${b} equal groups.`, v: a <= 20 && b <= 5 ? `<div class="row">${Array.from({ length: b }, () => objs(q, e)).join('')}</div>` : `<span class="bignum">${a} ÷ ${b} = ${q}${r ? ' r ' + r : ''}</span>` }; }
    if (b > a) return { a: `${a} take away ${b} is ${a - b}. That is a negative number, below zero, like a very cold temperature!` };
    return { a: `${a} take away ${b} is ${a - b}. Cross out ${b} and count what is left.`, v: a <= 20 ? objs(a, e, { gone: b }) : `<span class="bignum">${a} − ${b} = ${a - b}</span>` };
  }
  m = t.match(/(after|before)\s+(\d+)/);
  if (m) { const n = +m[2], r = m[1] === 'after' ? n + 1 : n - 1; return { a: `The number ${m[1]} ${n} is ${r}.`, v: `<span class="bignum">${m[1] === 'after' ? n + ' → ' + r : r + ' ← ' + n}</span>` }; }
  return null;
}
/* Online Owl (optional): a grown-up connects the family's own server, which keeps the API key off this tablet. */
const onlineCfg = () => store.get('online', { url: '', code: '', on: false });
const onlineReady = () => { const c = onlineCfg(); return c.on && c.url && c.code && navigator.onLine !== false; };
function askOnline(q, path = '/ask') {
  const c = onlineCfg(), ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 15000);
  return fetch(c.url.replace(/\/+$/, '') + path, { method: 'POST', signal: ctl.signal, headers: { 'Content-Type': 'application/json', 'X-Owl-Code': c.code }, body: JSON.stringify({ question: q, age: st.age }) })
    .then(r => r.ok ? r.json() : Promise.reject(new Error(r.status === 401 ? 'code' : 'http ' + r.status))).finally(() => clearTimeout(t));
}
// Every online answer is saved, so the same question works offline next time.
function owlRemember(q, a) { const c = store.get('owlCache', []).filter(x => x.q !== norm(q)); c.unshift({ q: norm(q), text: q, a, at: today() }); store.set('owlCache', c.slice(0, 300)); }
const owlForget = q => store.set('owlCache', store.get('owlCache', []).filter(x => x.q !== norm(q)));
function owlFind(text) {
  const mth = mathAnswer(text); if (mth) return mth;
  const n = norm(text);
  const hit = store.get('owlCache', []).find(x => x.q === n); if (hit) return { a: hit.a, v: '' };
  let best = null, bestScore = 0;
  for (const e of [...st.owlTaught.map(t => ({ k: words(t.q), a: t.a, taught: true })), ...KB]) {
    let s = 0;
    for (const k of e.k) { const nk = norm(k); if (n.includes(nk)) s += nk.trim().split(' ').length; }
    // A grown-up's answer wins when most of its question's words appear.
    if (e.taught) s = e.k.length && s / e.k.length >= 0.6 ? 2 + s : 0;
    if (s > bestScore) { bestScore = s; best = e; }
  }
  return best ? { a: best.a, v: best.v ? best.v() : '' } : null;
}
const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
function owl() {
  st.plays.owl++; save();
  const chips = shuffle(KB).slice(0, 4).map(e => e.q).concat(['What is 3 plus 4?']);
  view.innerHTML = `<div class="owl-head"><div class="owl-face" aria-hidden="true">🦉</div>
      <div class="bubble" id="bub" aria-live="polite"><p>Hoo hoo! Ask me about numbers, shapes, colors or drawing.</p></div></div>
    <form class="ask" id="askf">${Rec ? '<button type="button" class="btn mic" id="mic" aria-label="Talk to Owl">🎤</button>' : ''}<input id="askq" autocomplete="off" placeholder="Type your question…" aria-label="Your question"><button class="btn" type="submit" style="background:var(--grape)">Ask</button></form>
    <div class="chips">${chips.map(c => `<button data-q="${esc(c)}">${esc(c)}</button>`).join('')}</div>`;
  sayScreen('Hoo hoo! Ask me about numbers, shapes, colors or drawing.' + (Rec ? ' Tap the microphone to talk to me.' : ''));
  let lastQ = '';
  const ask = q => {
    q = q.trim(); if (!q) return;
    lastQ = q; questTick('owl');
    const r = owlFind(q), bub = $('#bub');
    if (!r && onlineReady()) {
      bub.innerHTML = '<p>Hmm, let me think… 🤔</p>';
      askOnline(q).then(d => { if (!d.answer) throw new Error('empty'); owlRemember(q, d.answer); if ($('#bub') === bub) show({ a: d.answer, v: '' }); })
        .catch(() => { if ($('#bub') === bub) miss(); });
      return;
    }
    r ? show(r) : miss();
  };
  function show(r) {
    const bub = $('#bub');
    bub.innerHTML = `<p>${esc(r.a)}</p>${r.v ? `<div class="visual">${r.v}</div>` : ''}<div class="helped">Did that help? <button data-h="1" aria-label="yes">👍</button><button data-h="0" aria-label="no">👎</button></div>`;
      say(r.a);
      bub.querySelectorAll('[data-h]').forEach(b => b.onclick = () => {
        if (b.dataset.h === '0') { owlForget(lastQ); logMiss(lastQ, 'did not help'); bub.querySelector('.helped').textContent = 'Thanks! I will ask a grown-up to teach me a better answer.'; say('Thanks! I will ask a grown-up to teach me.'); }
        else { bub.querySelector('.helped').textContent = 'Yay! 🦉'; yay(); }
      });
  }
  function miss() {
    logMiss(lastQ, 'no answer');
    $('#bub').innerHTML = `<p>Ooh, that is a great question! I don't know yet. I saved it so a grown-up can teach me.</p>`;
    say('Ooh, that is a great question! I do not know yet. I saved it so a grown-up can teach me.');
  }
  $('#askf').onsubmit = e => { e.preventDefault(); ask($('#askq').value); $('#askq').value = ''; };
  view.querySelectorAll('[data-q]').forEach(b => b.onclick = () => ask(b.dataset.q));
  if (Rec) $('#mic').onclick = e => {
    const btn = e.currentTarget, bub = $('#bub');
    let r; try { r = new Rec(); } catch (err) { bub.innerHTML = '<p>My ears are not working here. Can a grown-up type it for you?</p>'; return; }
    r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 1;
    try { speechSynthesis.cancel(); } catch (err) {}
    btn.classList.add('on'); bub.innerHTML = '<p>I am listening… 👂</p>';
    r.onresult = ev => { if (!btn.isConnected) return; const t = ev.results[0][0].transcript; $('#askq').value = t; ask(t); $('#askq').value = ''; };
    r.onerror = ev => { bub.innerHTML = `<p>${navigator.onLine === false || ev.error === 'network' ? 'I can only hear you when the internet is on. You can type, or tap a question below!' : 'I did not hear that. Tap the microphone and try again!'}</p>`; };
    r.onend = () => btn.classList.remove('on');
    try { r.start(); } catch (err) { btn.classList.remove('on'); }
  };
}
function logMiss(q, why) { if (!st.owlMisses.some(m => m.q === q)) st.owlMisses.unshift({ q, why, at: today() }); st.owlMisses = st.owlMisses.slice(0, 40); save(); }

/* ---------- grown-ups corner ---------- */
function gate(onPass, box = view) {
  const a = rnd(6, 9), b = rnd(6, 9), $ = s => box.querySelector(s);
  box.innerHTML = `<div class="panel" style="max-width:520px"><h2>For grown-ups</h2><p class="note">Answer to continue: what is ${a} × ${b}?</p>
    <form id="gf" class="ask"><input id="ga" inputmode="numeric" aria-label="Answer" autocomplete="off"><button class="btn" type="submit">Go</button></form><p class="note" id="gm"></p></div>`;
  $('#gf').onsubmit = e => { e.preventDefault(); +$('#ga').value === a * b ? (onPass ? onPass() : go(parent)) : ($('#gm').textContent = 'Not quite. Try again.'); };
}
function parent() {
  const rows = WORLDS.map((w, wi) => `<tr><th colspan="6" style="padding-top:16px">${w.ico} ${w.name} (ages ${w.ages})${worldOpen(wi) ? '' : ' · locked'}</th></tr>` + worldSkills(wi).map(s => { const k = s.id, x = st.skills[k], a = acc(k);
    return `<tr><td>${s.ico} ${s.name}</td><td>${level(k)} / 5</td><td><div class="bar"><i style="width:${Math.round(x.m * 100)}%"></i></div></td><td>${a == null ? '–' : Math.round(a * 100) + '%'}</td><td>${x.ms ? (x.ms / 1000).toFixed(1) + 's' : '–'}</td><td>${x.seen}</td></tr>`; }).join('')).join('');
  const artDone = [1, 2, 3].map(lv => `${LEVEL_NAMES[lv]}: ${LESSONS.filter(l => l.level === lv && st.art.done[l.id]).length} of ${LESSONS.filter(l => l.level === lv).length}`).join(' · ');
  view.innerHTML = `<h1 style="font-size:36px">Grown-ups corner</h1><p class="note">Showing ${profileOf(pid).avatar} ${esc(st.name || 'Player')}. Switch players under Players below.</p>
    ${tour.panel()}
    ${timer.panel()}
    ${weekPanel()}
    <div class="panel"><h2>Math progress</h2><p class="note">Each topic has 5 levels. It gets harder after answers that are right on the first try, and easier after mistakes. Missed questions come back for review after 1, 2, 4, 8 and 16 days. ${st.review.length} questions are in review, ${dueReviews().length} due today. A new world opens when your child reaches 50% in the world before it.</p>
      <div class="wide"><table class="ptable"><thead><tr><th>Topic</th><th>Level</th><th>Mastery</th><th>Right first try (last 20)</th><th>Avg time</th><th>Answered</th></tr></thead><tbody>${rows}</tbody></table></div></div>
    <div class="panel"><h2>Art progress</h2><p class="note">${artDone}. Pixel art level ${st.art.pixel} of 5. ${gallery.length} saved pictures.</p></div>
    <div class="panel"><h2>Teach Owl</h2><p class="note">Questions Owl could not answer well. Write a short, simple answer and Owl will use it next time, even offline.</p>
      <div id="misses">${st.owlMisses.length ? st.owlMisses.map((m, i) => `<div class="miss"><b>“${esc(m.q)}”</b><span class="note">${m.at} · ${m.why}</span>
        <textarea id="t${i}" placeholder="A simple answer a child can understand"></textarea><div class="row" style="justify-content:flex-start"><button class="btn leaf" data-teach="${i}" style="font-size:18px;padding:10px 18px">Teach Owl</button><button class="btn alt" data-skip="${i}" style="font-size:18px;padding:10px 18px">Dismiss</button></div></div>`).join('') : '<p class="note">Nothing waiting. Owl has answered everything so far.</p>'}</div>
      ${st.owlTaught.length ? `<p class="note">Owl has learned ${st.owlTaught.length} answer${st.owlTaught.length > 1 ? 's' : ''} from you.</p>` : ''}</div>
    ${playersPanel()}
    <div class="panel"><h2>Online Owl <span class="tag">optional</span></h2>
      <p class="note">Owl answers many questions offline. With the Online Owl server (see the server folder in the app's code), Owl can answer any question using AI: Cloudflare's free AI, or Claude if you add a Claude key. The API key stays on your server, never on this tablet. Every answer is saved here, so it also works offline next time.</p>
      <label class="field" for="ou">Server address<input id="ou" value="${esc(onlineCfg().url)}" placeholder="https://owl-crayon-owl.yourname.workers.dev" autocomplete="off" inputmode="url"></label>
      <label class="field" for="oc">Access code<input id="oc" value="${esc(onlineCfg().code)}" autocomplete="off"></label>
      <label class="field" style="flex-direction:row;align-items:center;gap:10px"><input type="checkbox" id="oo" ${onlineCfg().on ? 'checked' : ''} style="width:26px;height:26px"> Use Online Owl when the internet is on</label>
      <div class="row" style="justify-content:flex-start"><button class="btn" id="oSave">Save and test</button></div><p class="note" id="om" aria-live="polite"></p>
      ${store.get('owlCache', []).length ? `<details><summary class="note">Questions Online Owl answered (${store.get('owlCache', []).length})</summary>${store.get('owlCache', []).slice(0, 20).map(x => `<div class="miss"><b>“${esc(x.text)}”</b><span class="note">${x.at}</span><p>${esc(x.a)}</p></div>`).join('')}</details>` : ''}</div>
    <div class="panel"><h2>Settings</h2>
      <label class="field" for="nm">Child's name<input id="nm" value="${esc(st.name)}" autocomplete="off"></label>
      <label class="field" for="ag">Age<input id="ag" type="number" min="3" max="16" value="${st.age}"></label>
      <label class="field" style="flex-direction:row;align-items:center;gap:10px"><input type="checkbox" id="sp" ${st.speak ? 'checked' : ''} style="width:26px;height:26px"> Read everything aloud</label>
      <label class="field" style="flex-direction:row;align-items:center;gap:10px"><input type="checkbox" id="ua" ${st.unlockAll ? 'checked' : ''} style="width:26px;height:26px"> Open every world, lesson and level</label>
      <div class="row" style="justify-content:flex-start"><button class="btn" id="saveS">Save settings</button><button class="btn alt" id="reset">Reset all progress</button></div><p class="note" id="sm" aria-live="polite"></p></div>
    <div class="panel"><h2>About and privacy</h2>
      <p class="note">Owl &amp; Crayon works without the internet. Progress, drawings and Owl's answers are saved only in this browser on this device. There are no ads, no tracking and no accounts, and nothing is sent anywhere unless you switch on Online Owl.</p>
      <p class="note">With Online Owl on, only the question your child asks and their age go to your Online Owl server, which asks an AI (Cloudflare's free AI, or Claude by Anthropic) for a short, child-friendly answer. Names and progress are never sent. You can read every answer above, and turn it off at any time.</p>
      <p class="note">The microphone button uses the browser's own speech recognition, which may send the recording to the browser maker (for example Google or Apple) to turn it into text. Typing works without it.</p>
      <p class="note">Version __BUILD__</p></div>`;
  view.querySelectorAll('[data-teach]').forEach(b => b.onclick = () => {
    const i = +b.dataset.teach, ans = $('#t' + i).value.trim(); if (!ans) return;
    owlForget(st.owlMisses[i].q); st.owlTaught.push({ q: st.owlMisses[i].q, a: ans }); st.owlMisses.splice(i, 1); save(); go(parent);
  });
  wirePlayers(); tour.wire(); timer.wire();
  $('#oSave').onclick = () => {
    const cfg = { url: $('#ou').value.trim(), code: $('#oc').value.trim(), on: $('#oo').checked }, m = $('#om');
    if (cfg.url && !/^https:\/\//.test(cfg.url)) { m.textContent = 'The address must start with https://'; return; }
    store.set('online', cfg);
    if (!cfg.on || !cfg.url) { m.textContent = 'Saved. Owl is using offline answers only.'; return; }
    m.textContent = 'Saved. Testing the connection…';
    askOnline('', '/check').then(() => { m.textContent = 'Connected! Owl can now answer new questions online.'; })
      .catch(e => { m.textContent = e.message === 'code' ? 'The server says the access code is wrong.' : 'Could not reach the server. Check the address and the internet connection.'; });
  };
  view.querySelectorAll('[data-skip]').forEach(b => b.onclick = () => { st.owlMisses.splice(+b.dataset.skip, 1); save(); go(parent); });
  $('#saveS').onclick = () => {
    const age = clamp(+$('#ag').value || 5, 3, 16);
    if (age !== st.age) for (const k in MATH) if (st.skills[k].seen === 0) st.skills[k].m = startMastery(k, age);
    st.name = $('#nm').value.trim().slice(0, 20); st.age = age; st.speak = $('#sp').checked; st.unlockAll = $('#ua').checked; save(); updateTop(); $('#sm').textContent = 'Saved.';
  };
  let armed = false;
  $('#reset').onclick = e => {
    if (!armed) { armed = true; e.currentTarget.textContent = 'Tap again to erase everything'; return; }
    const keep = { name: st.name, age: st.age }; st = migrate(freshState(keep.age)); st.name = keep.name; gallery = []; saveGallery(); save(); updateTop(); go(parent);
  };
}

//@include write.js
//@include games.js
//@include games2.js
//@include games3.js
//@include story.js
//@include coloring.js
//@include scenes.js
//@include shapes.js
//@include flipbook.js
//@include world.js
//@include tour.js
//@include timer.js

/* ---------- start ---------- */
updateTop();
go(profiles.length > 1 ? whoView : home);
if (location.hash === "#selftest") window.__owl = { MATH, LESSONS, lessonSVG, PICS, get st() { return st; }, get profiles() { return profiles; }, quest, questTick, gainXP, petStage, go, home, mathHome, artHome, catView, drawLesson, gamesHome, ART_CATS, lessonView, play, speakable, storyHome, colorHome, sceneHome, shapeHome, flipHome, galTab, worldHome };
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  try {
    // A new version installs in the background; offer a tap to switch rather than reloading mid-game.
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || document.getElementById('updBar')) return;
      const bar = document.createElement('button'); bar.id = 'updBar'; bar.textContent = '✨ A new version is ready. Tap to update!';
      bar.onclick = () => location.reload(); document.body.appendChild(bar);
    });
    navigator.serviceWorker.register('sw.js').then(reg => {
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
    }).catch(() => {});
  } catch (e) {}
}
