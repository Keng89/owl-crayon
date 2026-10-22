/* ---------- English & Reading, part 10: round 4 screens ---------- */
// Three new sections join the English home through englishHome.api (data in english9.js):
// Sound lab: the word family house (spin a first letter, Owl says if it makes a real word), "Which did Owl say?"
// (minimal pairs like ship/sheep), tricky sounds for stage 3+ (silent letters, -tion, soft c and g, ph) and a sound
// wall with all 44 sounds of English, each with example words and a little rhyme.
// Word power: opposites match, sort into groups, odd one out, compound words, synonym ladders, sound-alike words
// (homophones) and 50 new idioms, similes, friendly slang and wise sayings with pictures.
// Read-along: any story, chapter or tongue twister in the app, with each word lighting up as Owl reads; "My turn"
// lights the words at a child's pace (no microphone), and a tap on the next word moves on sooner.
// Talk time gets its 10 new chats from english9.js. Every star goes through give(); progress is kept in st.english
// (fam, wall, wallDone, kara, idi; rounds under e.rounds).
(() => {
  const A = englishHome.api, { quiz, give, reward, E, stage, open, talk, ptip, SECTIONS, VIEWS } = A;
  const R4 = () => { const e = E(); e.fam = e.fam || {}; e.wall = e.wall || {}; e.kara = e.kara || {}; e.idi = e.idi || {}; return e; };
  const voice = () => !!(st.speak && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined');
  const bump = id => { const e = E(); e.rounds[id] = (e.rounds[id] || 0) + 1; };
  const best = (id, n) => { const e = E(); e.best[id] = Math.max(e.best[id] || 0, n); };
  const later = (nav, ms, fn) => setTimeout(() => { if (nav === navId) fn(); }, ms);
  // A grid of big game buttons: [id, icon, name, line, lock stage or 0].
  const tiles = (list, attr) => `<div class="en-gg">${list.map(([id, ico, name, sub, lock]) => { const ok = !lock || open(lock);
    return `<button class="en-gt e10-gt${ok ? '' : ' locked'}" data-${attr}="${id}"><span class="en-sico">${ok ? ico : '🔒'}</span><b>${esc(name)}</b><small>${sub}${ok ? '' : ` · Stage ${lock}`}</small></button>`; }).join('')}</div>`;

  /* ===================== Sound lab ===================== */
  function labHome() {
    save(); // section homes save, so stars held back by a full storage are written out once there is space
    const e = R4(), heard = EN_WALL.filter(T => e.wall[T.k]).length, words = Object.values(e.fam).reduce((a, f) => a + Object.keys(f || {}).length, 0);
    const LAB = [['house', '🏠', 'Word family house', `Spin a letter, make a word · ${words} found`], ['pairs', '👂', 'Which did Owl say?', 'ship or sheep? Listen closely'],
      ['tricky', '🪄', 'Tricky sounds', 'Silent k, -tion, soft c and g', 3], ['wall', '🧱', 'Sound wall', `All 44 sounds · ${heard}/${EN_WALL.length} heard`], ['wallq', '🎯', 'Sound hunt', 'Which sound is in the word?']];
    view.innerHTML = `${crumbs('🏠 Sound lab')}
      <p class="note">Play with the sounds inside words. Spin, listen, and find every sound!</p>
      ${tiles(LAB, 'lab')}${ptip('soundlab')}`;
    wireBack(englishHome);
    sayScreen('Sound lab! Build words in the word family house, listen closely, or explore the sound wall.');
    view.querySelectorAll('[data-lab]').forEach(b => b.onclick = () => {
      const id = b.dataset.lab;
      if (id === 'house') go(famHome); else if (id === 'pairs') go(quiz, pairSpec()); else if (id === 'wall') go(wallView); else if (id === 'wallq') go(quiz, wallSpec());
      else if (open(3)) go(quiz, trickySpec()); else say(A.lockText(3));
    });
  }

  // --- the word family house ---
  function famHome() {
    save();
    const e = R4();
    view.innerHTML = `${crumbs('🏠 Word family houses')}
      <p class="note">Each house has a word family. Spin a first letter to make words that rhyme!</p>
      <div class="e10-street">${EN_FAMILIES.map(F => { const n = Object.keys(e.fam[F.end] || {}).length;
        return `<button class="e10-mini${n >= F.real.length ? ' full' : ''}" data-fam="${F.end}" aria-label="The ${F.end} family"><span class="e10-mroof"></span><span class="e10-mbody"><b>-${F.end}</b><span>${F.ico}</span><small>${n}/${F.real.length}</small></span></button>`; }).join('')}</div>${ptip('soundlab')}`;
    wireBack(labHome);
    sayScreen('Pick a word family house.');
    view.querySelectorAll('[data-fam]').forEach(b => b.onclick = () => go(famHouse, b.dataset.fam));
  }
  let H4 = null;
  function famHouse(end) {
    const F = EN_FAMILIES.find(x => x.end === end), real = shuffle(F.real).slice(0, 7), silly = shuffle(F.silly).slice(0, 3);
    const reel = shuffle([...real, ...silly]);
    H4 = { F, reel, i: 0, rot: 0, found: [], silly: [], stars: 0, tries: 0, need: Math.min(4, real.length), busy: false, done: false };
    const nav = navId, N = reel.length, step = 360 / N;
    view.innerHTML = `${crumbs(`🏠 The -${esc(end)} family`)}
      <div class="e10-hwrap"><div class="e10-house" id="wfHouse"><div class="e10-roof"><b>-${esc(end)}</b></div>
        <div class="e10-wins" id="wfWins"></div><div class="e10-door" aria-hidden="true">🚪</div></div></div>
      <div class="e10-build" id="wfBuild" aria-live="polite"><span class="e10-on" id="wfOn"></span><span class="e10-end">${esc(end)}</span></div>
      <div class="e10-wheelbox"><span class="e10-pointer" aria-hidden="true">▼</span>
        <div class="e10-wheel" id="wfWheel" style="--rot:0deg">${reel.map((r, k) => `<button class="e10-seg" data-k="${k}" style="--a:${(k * step).toFixed(2)}deg" aria-label="${esc(r.on)}">${esc(r.on)}</button>`).join('')}
          <span class="e10-hub" aria-hidden="true">${F.ico}</span></div></div>
      <div class="row"><button class="btn alt" id="wfSpin">🎡 Spin</button><button class="btn leaf" id="wfCheck">✅ Is it a word?</button></div>
      <div class="cheer" id="cheer" aria-live="polite"></div>
      <div class="e10-silly" id="wfSilly"></div>${ptip('soundlab')}`;
    wireBack(famHome);
    const wheel = $('#wfWheel');
    const word = () => H4.reel[H4.i].on + end;
    const draw = () => {
      $('#wfOn').textContent = H4.reel[H4.i].on;
      wheel.style.setProperty('--rot', H4.rot + 'deg');
      view.querySelectorAll('.e10-seg').forEach(b => b.classList.toggle('on', +b.dataset.k === H4.i));
      $('#wfWins').innerHTML = Array.from({ length: H4.need }, (_, k) => { const f = H4.found[k]; return `<span class="e10-win${f ? ' lit' : ''}">${f ? `<i>${f.e}</i><b>${esc(f.w)}</b>` : '🪟'}</span>`; }).join('');
      $('#wfSilly').innerHTML = H4.silly.length ? `<b>🙃 Silly words:</b> ${H4.silly.map(w => `<span>${esc(w)}</span>`).join(' ')}` : '';
    };
    // Turn the wheel so letter k sits under the pointer (the long way round when spinning).
    const turnTo = (k, spins) => {
      const target = -k * step, d = ((H4.rot - target) % 360 + 360) % 360;
      H4.rot = spins ? H4.rot - spins * 360 - d : H4.rot - (d > 180 ? d - 360 : d);
      H4.i = k; draw();
    };
    draw();
    view.querySelectorAll('.e10-seg').forEach(b => b.onclick = () => { if (H4.busy || H4.done || nav !== navId) return; turnTo(+b.dataset.k, 0); tone([520 + (+b.dataset.k) * 30], 0.05); say(word()); });
    $('#wfSpin').onclick = () => {
      if (H4.busy || H4.done || nav !== navId) return;
      H4.busy = true; wheel.classList.add('spin');
      let k = Math.floor(Math.random() * N); if (k === H4.i) k = (k + 1) % N;
      turnTo(k, 2); $('#wfOn').textContent = '?';
      for (let t = 0; t < 8; t++) later(nav, t * 140, () => tone([440 + t * 40], 0.03));
      later(nav, 1300, () => { H4.busy = false; wheel.classList.remove('spin'); draw(); $('#wfBuild').classList.remove('pop'); void $('#wfBuild').offsetWidth; $('#wfBuild').classList.add('pop'); say(word()); });
    };
    $('#wfCheck').onclick = () => {
      if (H4.busy || H4.done || nav !== navId) return;
      const w = word(), hit = F.real.find(r => r.w === w), cheer = $('#cheer');
      if (!hit) {
        H4.tries++; if (!H4.silly.includes(w)) H4.silly.push(w); oops(); draw();
        const b = $('#wfBuild'); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
        const m = `${w}? That is a silly word, not a real one! Spin again.`; cheer.textContent = `🙃 “${w}” is a silly word!`; say(m); return;
      }
      if (H4.found.some(f => f.w === w)) { const m = `${w} is already in the house! Find a new word.`; cheer.textContent = `🏠 ${w} is already in the house!`; say(m); return; }
      H4.found.push(hit); H4.stars++; give(1);
      const e = R4(), fam = e.fam[end] = e.fam[end] || {}; fam[w] = (fam[w] || 0) + 1; save();
      draw(); yay(); cheer.textContent = `Yes! “${w}” is a real word! ⭐`;
      talk([`${w}! Yes! ${w} is a real word.`], 0.85);
      if (H4.found.length >= H4.need) {
        H4.done = true; H4.stars += 2; give(2); bump('fam'); best('fam', H4.found.length); save();
        $('#wfHouse').classList.add('party'); confetti(40);
        later(nav, 1600, () => reward('House full!', `You made ${H4.found.length} -${end} words: ${H4.found.map(f => f.w).join(', ')}. You earned ${H4.stars} ⭐`, () => go(famHouse, end), () => go(famHome)));
      }
    };
    sayScreen(`The ${end} family house. Spin a letter, then ask Owl: is it a real word? Find ${H4.need} real words to fill the windows.`);
  }

  // --- which did Owl say? (minimal pairs) ---
  function pairSpec() {
    return { id: 'lab-pairs', title: '👂 Which did Owl say?', back: () => go(labHome), tip: 'soundlab', n: 6, gen() {
      const s = stage(), pool = EN_MINPAIRS.filter(p => s >= 2 || !p[4]), p = pick(pool), w = Math.random() < 0.5 ? p[0] : p[2], v = voice();
      return { prompt: v ? 'Listen! Which did Owl say?' : `Owl says <b>“${esc(w)}”</b>. Which one is it?`, say: w,
        visual: `<div class="e10-owlsay"><span class="e10-owl">🦉</span><span class="e10-bub">${v ? '🔊 …' : esc(w)}</span></div>`,
        choices: shuffle([[p[0], p[1]], [p[2], p[3]]]).map(([x, em]) => ({ html: `<span class="en-ce">${em}</span><span>${esc(x)}</span>`, val: x, say: x, txt: true })), answer: w,
        explain: `Owl said ${w}. Listen: ${p[0]}... ${p[2]}. They sound almost the same, but not quite!`,
        onShow() { talk(['Which did Owl say?', w], 0.7); } };
    } };
  }
  // --- tricky sounds (stage 3+) ---
  function trickySpec() {
    return { id: 'lab-tricky', title: '🪄 Tricky sounds', back: () => go(labHome), tip: 'soundlab', n: 6, gen() {
      const T = pick(EN_TRICKY), [w, em] = pick(T.words), ex = T.rule;
      if (T.kind === 'silent') {
        const skip = new Set([T.letter]); if (/[^aeiou]e$/.test(w)) skip.add('e'); if (/gh/.test(w)) { skip.add('g'); skip.add('h'); } if (/aw/.test(w)) skip.add('w'); if (/[tsc]h/.test(w)) skip.add('h'); if (/ck/.test(w)) { skip.add('c'); skip.add('k'); }
        const others = shuffle([...new Set(w.split(''))].filter(c => !skip.has(c))).slice(0, 2); for (const c of 'tsm') if (others.length < 2 && !w.includes(c)) others.push(c);
        return { prompt: `Which letter is <b>silent</b> in <b>${esc(w)}</b>?`, say: `Which letter is silent in ${w}? ${w}.`, visual: `<div class="en-pic">${em}</div><div class="e10-letters">${w.split('').map(c => `<span>${esc(c)}</span>`).join('')}</div>`,
          choices: shuffle([T.letter, ...others]).map(c => ({ html: `<span class="e6-gr">${esc(c)}</span>`, val: c, say: c, txt: true })), answer: T.letter, explain: ex };
      }
      if (T.kind === 'tion') {
        const no = shuffle(T.not).slice(0, 2);
        return { prompt: 'Which word ends with the <b>“shun”</b> sound?', say: 'Which word ends with the shun sound?', visual: '<div class="e10-rule">-tion = shun</div>',
          choices: shuffle([[w, em], ...no]).map(([x, e2]) => ({ html: `<span class="en-ce">${e2}</span><span>${esc(x)}</span>`, val: x, say: x, txt: true })), answer: w, explain: ex };
      }
      if (T.kind === 'soft') {
        const hard = Math.random() < 0.4, [x, e2] = hard ? pick(T.not) : [w, em], ans = hard ? T.hard : T.soft;
        return { prompt: `In <b>${esc(x)}</b>, what does the <b>${T.letter}</b> say?`, say: `In ${x}, what does the ${T.letter} say? ${T.soft}, or ${T.hard}?`, visual: `<div class="en-pic">${e2}</div><div class="e6-word">${esc(x)}</div>`,
          choices: [T.soft, T.hard].map(v => ({ html: `<span>${v === T.soft ? '🌬️' : '🔨'}</span><span>${esc(v)}</span>`, val: v, say: v, txt: true })), answer: ans, explain: ex };
      }
      return { prompt: `What sound does <b>ph</b> make in <b>${esc(w)}</b>?`, say: `What sound does p h make in ${w}?`, visual: `<div class="en-pic">${em}</div><div class="e6-word">${esc(w)}</div>`,
        choices: shuffle(['fff', 'puh', 'huh']).map(v => ({ html: esc(v), val: v, say: v, txt: true })), answer: 'fff', explain: ex };
    } };
  }
  // --- the sound wall: all 44 sounds ---
  const big = T => T.spell.split(',')[0].replace(/\s*\(.*\)/, '').replace('_', '‿');
  const hint = T => (T.spell.match(/\((.*)\)/) || [])[1] || T.ex[0][0];
  function wallView(sel) {
    const e = R4();
    view.innerHTML = `${crumbs('🧱 Sound wall')}
      <div class="e10-wprog"><span class="meter"><i id="wMeter"></i></span><span class="note" id="wCount"></span></div>
      <div class="e10-detail" id="wDetail" aria-live="polite"><span class="e10-dowl">🦉</span><p>Tap a sound brick to hear it, with words and a little rhyme!</p></div>
      ${EN_WALL_GROUPS.map(([g, ico, name]) => `<h3 class="section-title">${ico} ${name}</h3><div class="e10-wall g-${g}">${EN_WALL.filter(T => T.g === g).map(T =>
        `<button class="e10-brick${e.wall[T.k] ? ' heard' : ''}" data-ws="${T.k}" aria-label="${esc(big(T))} as in ${esc(T.ex[0][0])}"><b>${esc(big(T))}</b><span>${T.ex[0][1]}</span><small>${esc(hint(T))}</small></button>`).join('')}</div>`).join('')}
      <div class="row"><button class="btn leaf" id="wHunt">🎯 Sound hunt</button></div>${ptip('soundlab')}`;
    wireBack(labHome);
    const nav = navId;
    const count = () => { const n = EN_WALL.filter(T => R4().wall[T.k]).length; $('#wCount').textContent = `🧱 ${n} of ${EN_WALL.length} sounds heard${R4().wallDone ? ' · 🏆 wall complete!' : ''}`; $('#wMeter').style.width = Math.round(n / EN_WALL.length * 100) + '%'; };
    count();
    const show = k => {
      const T = EN_WALL.find(x => x.k === k), e2 = R4(), fresh = !e2.wall[k];
      e2.wall[k] = 1; save();
      view.querySelectorAll('.e10-brick').forEach(b => b.classList.toggle('on', b.dataset.ws === k));
      const br = view.querySelector(`[data-ws="${k}"]`); if (br) br.classList.add('heard');
      $('#wDetail').innerHTML = `<div class="e10-dhead"><b class="e10-dbig">${esc(big(T))}</b><span><b>says “${esc(T.s)}”</b><small>spelled: ${esc(T.spell)}</small></span><button class="speak" id="wSay" aria-label="Hear the sound">🔊</button></div>
        <div class="e10-dex">${T.ex.map(([w, em], i) => `<button class="e10-dw" data-dw="${esc(w)}" style="animation-delay:${i * 0.12}s"><span>${em}</span>${esc(w)}</button>`).join('')}</div>
        <p class="e10-rhyme">🎵 ${esc(T.rhyme)}</p><button class="btn alt" id="wRhyme">🎵 Say the rhyme</button>`;
      $('#wSay').onclick = () => talk([T.s, T.ex.map(x => x[0]).join(', ')], 0.7);
      $('#wRhyme').onclick = () => talk([T.rhyme], 0.8);
      view.querySelectorAll('[data-dw]').forEach(b => b.onclick = () => talk([b.dataset.dw], 0.8));
      talk([T.s, `as in ${T.ex[0][0]}`, T.rhyme], 0.75); count();
      if (fresh && !e2.wallDone && EN_WALL.every(x => e2.wall[x.k])) {
        e2.wallDone = today(); give(5); save(); confetti(70); tone([523, 659, 784, 1046, 1318], 0.1); count();
        later(nav, 400, () => toast('You heard all 44 sounds of English! +5 ⭐'));
      }
    };
    view.querySelectorAll('[data-ws]').forEach(b => b.onclick = () => { if (nav === navId) show(b.dataset.ws); });
    $('#wHunt').onclick = () => go(quiz, wallSpec());
    sayScreen('The sound wall has all 44 sounds of English. Tap a brick!');
    if (sel) show(sel);
  }
  // Spellings of a sound, as tests on a word ("a_e" means a, one consonant, e).
  const spells = T => T.spell.replace(/\(.*?\)/g, '').split(',').map(x => x.trim()).filter(Boolean)
    .map(x => x.includes('_') ? (w => new RegExp(x.replace('_', '[^aeiou]')).test(w)) : (w => w.includes(x)));
  // Sounds that are too close to tell apart in a quiz (or hide inside each other).
  const CLASH = { yoo: ['y', 'oo', 'u2'], oo: ['yoo', 'u2'], u2: ['oo', 'yoo'], u: ['schwa'], schwa: ['u', 'ur'], th: ['dh'], dh: ['th'], s: ['zh'], zh: ['s', 'z'], z: ['zh'],
    or: ['o'], o: ['or'], ur: ['schwa'], ar: ['a'], a: ['ar', 'schwa'], air: ['ear'], ear: ['air'], ee: ['i'], i: ['ee'] };
  function wallSpec() {
    return { id: 'lab-wall', title: '🎯 Sound hunt', back: () => go(labHome), tip: 'soundlab', n: 6, gen() {
      const s = stage(), pool = s <= 1 ? EN_WALL.filter(T => T.g === 'cons' || T.g === 'short') : EN_WALL, T = pick(pool), [w, em] = pick(T.ex);
      const others = shuffle(pool.filter(O => O !== T && !(CLASH[T.k] || []).includes(O.k) && !(CLASH[O.k] || []).includes(T.k) && !spells(O).some(f => f(w)))).slice(0, 2);
      return { prompt: `Which sound can you hear in <b>${esc(w)}</b>?`, say: `Which sound can you hear in ${w}? ${w}.`, visual: `<div class="en-pic">${em}</div><div class="e6-word">${esc(w)}</div>`,
        choices: shuffle([T, ...others]).map(O => ({ html: `<span class="e6-gr">${esc(big(O))}</span><small>${esc(hint(O))}</small>`, val: O.k, say: O.s, txt: true })), answer: T.k,
        explain: `${w} has the ${T.s} sound, spelled ${big(T)}. ${T.rhyme}` };
    }, onRight(q) { R4().wall[q.answer] = 1; } };
  }

  /* ===================== Word power ===================== */
  function wpHome() {
    save();
    const e = R4(), seen = EN_IDIOMS.filter(I => e.idi[I[0]]).length;
    const WP = [['opp', '↔️', 'Opposites match', 'Join each word to its opposite'], ['sort', '🧺', 'Sort it!', 'Fruit, animal or vehicle?'], ['odd', '🕵️', 'Odd one out', 'Which one does not belong?'],
      ['comp', '🧩', 'Compound words', 'sun + flower = sunflower'], ['ladder', '🪜', 'Word ladders', 'big → huge → gigantic'], ['homo', '👯', 'Sound-alikes', 'sea or see? Pick the spelling', 2],
      ['idioms', '🐱', 'Sayings & slang', `${EN_IDIOMS.length} with pictures · ${seen} explored`], ['idiomq', '🎯', 'What does it mean?', 'A saying quiz']];
    view.innerHTML = `${crumbs('💪 Word power')}
      <p class="note">Grow your word power: match, sort, build and climb!</p>
      ${tiles(WP, 'wp')}${ptip('wordpower')}`;
    wireBack(englishHome);
    sayScreen('Word power! Opposites, sorting, odd one out, compound words, word ladders, sound-alikes and funny sayings.');
    view.querySelectorAll('[data-wp]').forEach(b => b.onclick = () => {
      const id = b.dataset.wp;
      if (id === 'homo' && !open(2)) { say(A.lockText(2)); return; }
      ({ opp: () => go(oppMatch), sort: () => go(quiz, sortSpec()), odd: () => go(quiz, oddSpec()), comp: () => go(quiz, compSpec()), ladder: () => go(ladder),
        homo: () => go(quiz, homoSpec()), idioms: () => go(idiomCards), idiomq: () => go(quiz, idiomSpec()) })[id]();
    });
  }
  // --- opposites match: tap a word on the left, then its opposite on the right ---
  // EN_OPP (english2.js) is already a list of [word, opposite, emoji, emoji]; EN_OPP2 is a string in the same shape.
  const OPP2 = EN_OPP2.split(',').map(x => x.split(':'));
  const oppList = () => (stage() <= 1 ? EN_OPP : [...EN_OPP, ...OPP2]).map(([a, b, ea, eb]) => ({ a, b, ea, eb }));
  let OM = null;
  function oppMatch() {
    const used = new Set(), pairs = [];
    for (const p of shuffle(oppList())) { if (pairs.length >= 5) break; if ([p.a, p.b, p.ea, p.eb].some(x => used.has(x))) continue; [p.a, p.b, p.ea, p.eb].forEach(x => used.add(x)); pairs.push({ ...p, tries: 0, done: false }); }
    OM = { pairs, L: shuffle(pairs.map((_, i) => i)), R: shuffle(pairs.map((_, i) => i)), sel: null, stars: 0, first: 0, n: 0 };
    drawOpp(); say('Tap a word, then tap its opposite!');
  }
  function drawOpp(msg) {
    const nav = navId, P = OM.pairs;
    const card = (side, i) => { const p = P[i], w = side === 'L' ? p.a : p.b, em = side === 'L' ? p.ea : p.eb;
      return `<button class="e10-omc${p.done ? ` ok c${p.c}` : ''}${side === 'L' && OM.sel === i ? ' sel' : ''}" data-om="${side}${i}"${p.done ? ' disabled' : ''}><span>${em}</span><b>${esc(w)}</b></button>`; };
    view.innerHTML = `${crumbs('↔️ Opposites match')}
      <div class="progress">${P.map((p, k) => `<i class="${k < OM.n ? 'done' : k === OM.n ? 'now' : ''}"></i>`).join('')}</div>
      <p class="note">Tap a word on the left, then its opposite on the right.</p>
      <div class="e10-om"><div class="e10-omcol">${OM.L.map(i => card('L', i)).join('')}</div><div class="e10-omcol">${OM.R.map(i => card('R', i)).join('')}</div></div>
      <div class="cheer" id="cheer" aria-live="polite">${msg || ''}</div>${ptip('wordpower')}`;
    wireBack(wpHome);
    view.querySelectorAll('[data-om]').forEach(b => b.onclick = () => {
      if (nav !== navId || b.disabled) return;
      const side = b.dataset.om[0], i = +b.dataset.om.slice(1), p = P[i];
      if (side === 'L') { OM.sel = i; tone([600], 0.05); say(p.a); drawOpp(); return; }
      if (OM.sel == null) { say('Tap a word on the left first!'); return; }
      const s = P[OM.sel];
      if (i !== OM.sel) { s.tries++; oops(); b.classList.add('bad'); const m = `${p.b} is not the opposite of ${s.a}. Try again!`; $('#cheer').textContent = `🤔 ${m}`; say(m); return; }
      const first = s.tries === 0, earned = first ? 2 : 1; s.done = true; s.c = OM.n % 5; OM.n++; OM.stars += earned; if (first) { OM.first++; questTick('firsttry'); }
      OM.sel = null; give(earned); yay();
      drawOpp(`${esc(s.a)} ↔ ${esc(s.b)}! ${'⭐'.repeat(earned)}`); say(`${s.a} and ${s.b} are opposites!`);
      if (OM.n >= P.length) {
        bump('wp-opp'); best('wp-opp', OM.first); save();
        later(nav, 1300, () => reward('Opposite expert!', `You matched ${P.length} pairs and earned ${OM.stars} ⭐`, () => go(oppMatch), () => go(wpHome)));
      }
    });
  }
  // --- sort it: which group does it belong to? ---
  function sortSpec() {
    const cats = shuffle(EN_CATS).slice(0, 3), got = {};
    return { id: 'wp-sort', title: '🧺 Sort it!', back: () => go(wpHome), tip: 'wordpower', n: 8, cls: 'e10-baskets', gen() {
      const C = pick(cats), [w, em] = pick(C.items);
      return { prompt: `Where does the <b>${esc(w)}</b> go?`, say: `Where does the ${w} go? ${cats.map(c => c.name).join(', or ')}?`,
        visual: `<div class="en-pic e10-drop">${em}</div><div class="e10-bks">${cats.map(c => `<span><b>${c.ico}</b>${(got[c.id] || []).join('')}</span>`).join('')}</div>`, x: em,
        choices: cats.map(c => ({ html: `<span class="en-ce">${c.ico}</span><span>${esc(c.name)}</span>`, val: c.id, say: c.name, txt: true })), answer: C.id,
        explain: `A ${w} goes with the ${C.name.toLowerCase()}.` };
    }, onRight(q) { (got[q.answer] = got[q.answer] || []).push(q.x); } };
  }
  // --- odd one out ---
  function oddSpec() {
    return { id: 'wp-odd', title: '🕵️ Odd one out', back: () => go(wpHome), tip: 'wordpower', n: 6, gen() {
      const [C, D] = shuffle(EN_CATS), three = shuffle(C.items).slice(0, 3), odd = pick(D.items);
      return { prompt: 'Which one does <b>not</b> belong?', say: `Which one does not belong? ${shuffle([...three, odd]).map(x => x[0]).join(', ')}.`, visual: '',
        choices: shuffle([...three, odd]).map(([w, em]) => ({ html: `<span class="en-ce">${em}</span><span>${esc(w)}</span>`, val: w, say: w, txt: true })), answer: odd[0],
        explain: `The ${odd[0]} belongs with ${D.name.toLowerCase()}. The others are ${C.name.toLowerCase()}: ${three.map(x => x[0]).join(', ')}.` };
    } };
  }
  // --- compound words ---
  const COMP_ALL = new Set([...EN_COMPOUND.map(c => c[0] + c[1]), ...EN_COMPOUND_REAL]);
  function compSpec() {
    const seconds = [...new Set(EN_COMPOUND.map(c => c[1]))];
    return { id: 'wp-comp', title: '🧩 Compound words', back: () => go(wpHome), tip: 'wordpower', n: 6, gen() {
      const [f, s, em] = pick(EN_COMPOUND), wrong = shuffle(seconds).filter(x => x !== s && !COMP_ALL.has(f + x)).slice(0, 2);
      return { prompt: `<b>${esc(f)}</b> + <b>?</b> makes the picture. Which word fits?`, say: `${f}, plus what, makes this picture?`,
        visual: `<div class="e10-comp"><span class="e10-cw">${esc(f)}</span><i>+</i><span class="e10-cq">?</span><i>=</i><span class="e10-cpic">${em}</span></div>`, x: [f, s, em],
        choices: shuffle([s, ...wrong]).map(v => ({ html: esc(v), val: v, say: v, txt: true })), answer: s, explain: `${f} + ${s} = ${f}${s}!` };
    }, onRight(q) { const ex = document.getElementById('exp'); if (ex) ex.innerHTML = `<div class="e10-joined"><span>${esc(q.x[0])}</span><span>${esc(q.x[1])}</span><b>${q.x[2]}</b></div>`; talk([q.x[0] + q.x[1]], 0.8); } };
  }
  // --- synonym ladders: climb from a little to a lot ---
  let LD = null;
  function ladder() {
    const s = stage(), pool = EN_LADDERS.filter(L => s >= 3 || L.length <= 4);
    LD = { list: shuffle(pool).slice(0, 4), i: 0, stars: 0, first: 0 }; ladderRound();
  }
  function ladderRound() { Object.assign(LD, { step: 0, tries: 0, done: false, order: shuffle(LD.list[LD.i].slice(1)) }); drawLadder(); say(`Climb the ladder! Start with the word that means a little bit, up to the word that means a lot. ${LD.order.join(', ')}.`); }
  function drawLadder(msg) {
    const L = LD.list[LD.i], words = L.slice(1), nav = navId, n = words.length;
    view.innerHTML = `${crumbs('🪜 Word ladders')}
      <div class="progress">${LD.list.map((_, k) => `<i class="${k < LD.i ? 'done' : k === LD.i ? 'now' : ''}"></i>`).join('')}</div>
      <p class="note">Climb from <b>a little</b> at the bottom to <b>a LOT</b> at the top!</p>
      <div class="e10-ladder${LD.done ? ' top' : ''}"><span class="e10-lico">${L[0]}</span><div class="e10-rungs">${words.map((w, k) => k).reverse().map(k =>
        `<div class="e10-rung${k < LD.step ? ' set' : ''}"><span>${k < LD.step ? esc(words[k]) : ''}</span>${k === Math.min(LD.step, n - 1) ? `<i class="e10-climber">${LD.done ? '🎉' : '🧗'}</i>` : ''}</div>`).join('')}</div></div>
      <div class="e10-lwords">${LD.order.map(w => `<button class="e10-lw${words.indexOf(w) < LD.step ? ' used' : ''}" data-lw="${esc(w)}"${words.indexOf(w) < LD.step || LD.done ? ' disabled' : ''}>${esc(w)}</button>`).join('')}</div>
      <div class="cheer" id="cheer" aria-live="polite">${msg || ''}</div>${ptip('wordpower')}`;
    wireBack(wpHome);
    view.querySelectorAll('[data-lw]').forEach(b => b.onclick = () => {
      if (LD.done || nav !== navId || b.disabled) return;
      const w = b.dataset.lw;
      if (w !== words[LD.step]) {
        LD.tries++; oops(); b.classList.add('bad');
        const m = LD.step === 0 ? 'Start with the word that means just a little bit.' : `Which word means a bit more than ${words[LD.step - 1]}?`;
        $('#cheer').textContent = `🤔 ${m}`; say(m); return;
      }
      LD.step++; tone([500 + LD.step * 110], 0.08); say(w);
      if (LD.step < n) { drawLadder(); return; }
      LD.done = true; const first = LD.tries === 0, earned = first ? 2 : 1; LD.stars += earned; if (first) { LD.first++; questTick('firsttry'); }
      give(earned); yay(); drawLadder(`${first ? 'Top of the ladder!' : 'You made it!'} ${'⭐'.repeat(earned)}`); talk([words.join(', then ')], 0.85);
      later(nav, 1500, () => {
        LD.i++; if (LD.i < LD.list.length) { ladderRound(); return; }
        bump('wp-ladder'); best('wp-ladder', LD.first); save();
        reward('Ladder champion!', `You climbed ${LD.list.length} word ladders and earned ${LD.stars} ⭐`, () => go(ladder), () => go(wpHome));
      });
    });
  }
  // --- sound-alike words (homophones), stage 2+ ---
  function homoSpec() {
    return { id: 'wp-homo', title: '👯 Sound-alikes', back: () => go(wpHome), tip: 'wordpower', n: 6, gen() {
      const [sent, right, wrong, em] = pick(EN_HOMO2);
      return { prompt: esc(sent).replace('___', '<span class="e10-blank">___</span>'), say: `These words sound the same. Which spelling fits? ${sent.replace('___', 'blank')}`, visual: `<div class="en-pic">${em}</div>`,
        choices: shuffle([right, wrong]).map(v => ({ html: esc(v), val: v, say: v, txt: true })), answer: right,
        explain: `${right} and ${wrong} sound the same, but they mean different things. Here we need ${right}: ${sent.replace('___', right)}` };
    } };
  }
  // --- sayings, similes, slang and wise words ---
  function idiomCards(g) {
    const e = R4(), G = g || e.itab || 'idiom'; e.itab = G; save();
    const list = EN_IDIOMS.filter(I => I[5] === G);
    view.innerHTML = `${crumbs('🐱 Sayings & slang')}
      <div class="en-tabs">${EN_IDIOM_GROUPS.map(([id, ico, nm]) => `<button class="en-tab${G === id ? ' on' : ''}" data-ig="${id}">${ico} ${nm}</button>`).join('')}</div>
      <p class="note">Tap a card to find out what it really means! (${EN_IDIOMS.filter(I => e.idi[I[0]]).length} of ${EN_IDIOMS.length} explored)</p>
      <div class="e10-idgrid">${list.map(I => `<button class="e10-idc${e.idi[I[0]] ? ' got' : ''}" data-idc="${I[0]}" aria-label="${esc(I[1])}"><span class="e10-idf"><span class="e10-idpic">${I[2]}</span><b>${esc(I[1])}</b></span><span class="e10-idb"><b>${esc(I[1])}</b><span>${esc(I[3])}</span><i>“${esc(I[4])}”</i></span></button>`).join('')}</div>
      <div class="row"><button class="btn leaf" id="idQuiz">🎯 What does it mean?</button></div>${ptip('wordpower')}`;
    wireBack(wpHome);
    sayScreen('Sayings and slang. Tap a card to flip it.');
    view.querySelectorAll('[data-ig]').forEach(b => b.onclick = () => go(idiomCards, b.dataset.ig));
    view.querySelectorAll('[data-idc]').forEach(b => b.onclick = () => {
      const I = EN_IDIOMS.find(x => x[0] === b.dataset.idc); b.classList.toggle('on'); b.classList.add('got'); tone([660], 0.05);
      R4().idi[I[0]] = 1; save(); talk([I[1], `It means: ${I[3]}`, `For example: ${I[4]}`], 0.9);
    });
    $('#idQuiz').onclick = () => go(quiz, idiomSpec());
  }
  function idiomSpec() {
    return { id: 'wp-idiom', title: '🎯 What does it mean?', back: () => go(wpHome), tip: 'wordpower', n: 6, gen() {
      const I = pick(EN_IDIOMS), wrong = shuffle(EN_IDIOMS.filter(o => o[0] !== I[0] && o[3] !== I[3])).slice(0, 2);
      return { prompt: `What does <b>“${esc(I[1])}”</b> mean?`, say: `What does ${I[1]} mean?`, visual: `<div class="en-pic">${I[2]}</div>`,
        choices: shuffle([I, ...wrong]).map(o => ({ html: esc(o[3]), val: o[0], say: o[3], txt: true })), answer: I[0], explain: `${I[1]} means: ${I[3]} For example: ${I[4]}` };
    }, onRight(q) { R4().idi[q.answer] = 1; } };
  }

  /* ===================== Read-along (karaoke) ===================== */
  const sentences = t => (t.match(/[^.!?]+[.!?]+["”’']*|[^.!?]+$/g) || [t]).map(x => x.trim()).filter(Boolean);
  const unitsOf = pages => pages.flatMap(([pic, text], pg) => sentences(text).map(s => ({ pic, text: s, pg })));
  const KTABS = [['stories', '📖', 'Stories'], ['books', '📚', 'Chapter books'], ['twisters', '👅', 'Tongue twisters']];
  const ITEMS = () => [
    ...EN_STORIES.map(x => ({ tab: 'stories', key: 's:' + x.id, ico: x.ico, title: x.title, stage: x.stage, pages: x.pages })),
    ...EN_BOOKS.flatMap(B => B.chapters.map((c, ci) => ({ tab: 'books', key: `b:${B.id}:${ci}`, ico: B.ico, title: `${B.title}: ${c[0]}`, sub: `Chapter ${ci + 1}`, stage: B.stage, pages: c[1] }))),
    ...EN_TWISTERS.map(([t, em, s], i) => ({ tab: 'twisters', key: 't:' + i, ico: em, title: t.length > 34 ? t.slice(0, 32).replace(/\s+\S*$/, '') + '…' : t, stage: s, pages: [[em, t]] }))];
  const itemOf = key => ITEMS().find(x => x.key === key);
  function kHome(tab) {
    const e = R4(), T = tab || e.ktab || 'stories'; e.ktab = T; save(); // also writes out anything a full storage held back
    const list = ITEMS().filter(x => x.tab === T);
    view.innerHTML = `${crumbs('🎤 Read-along')}
      <div class="en-tabs">${KTABS.map(([id, ico, nm]) => `<button class="en-tab${T === id ? ' on' : ''}" data-kt="${id}">${ico} ${nm}</button>`).join('')}</div>
      <p class="note">Owl reads and each word lights up. Then tap 🙋 My turn and read the next sentence yourself!</p>
      <div class="en-gg">${list.map(x => `<button class="en-gt e10-kit${open(x.stage) ? '' : ' locked'}" data-kk="${esc(x.key)}"><span class="en-sico">${open(x.stage) ? x.ico : '🔒'}</span><b>${esc(x.title)}</b><small>${x.sub ? esc(x.sub) + ' · ' : ''}Stage ${x.stage}${e.kara[x.key] ? ' · 🎤 ✅' : ''}</small></button>`).join('')}</div>${ptip('karaoke')}`;
    wireBack(englishHome);
    sayScreen('Read-along! Pick a story. Owl reads, the words light up, then it is your turn.');
    view.querySelectorAll('[data-kt]').forEach(b => b.onclick = () => go(kHome, b.dataset.kt));
    view.querySelectorAll('[data-kk]').forEach(b => b.onclick = () => { const x = itemOf(b.dataset.kk); open(x.stage) ? go(kPlay, x.key, 0) : say(A.lockText(x.stage)); });
  }
  const SPEEDS = [[0.7, '🐢 Slow'], [1, '🙂 Normal'], [1.6, '🐇 Fast']];
  let K = null;
  function kPlay(key, u0) {
    const x = itemOf(key); if (!x) { go(kHome); return; }
    const e = R4(), units = unitsOf(x.pages);
    K = { key, x, units, u: Math.min(units.length - 1, Math.max(0, u0 || 0)), read: {}, mine: 0, owl: 0, playing: false, w: -1, sp: e.kspeed != null ? e.kspeed : 1, timer: 0, finished: false };
    drawK(); say(`${x.title}. Tap Owl reads, or My turn!`);
  }
  const wordsOf = t => t.split(/\s+/).filter(Boolean);
  function drawK(msg) {
    const U = K.units[K.u], nav = navId, last = K.u === K.units.length - 1, next = K.u > 0 && K.read[K.u - 1] === 'owl' ? 'mine' : 'owl';
    view.innerHTML = `${crumbs(`🎤 ${esc(K.x.title)}`)}
      <div class="progress">${K.units.map((_, k) => `<i class="${K.read[k] ? 'done' : k === K.u ? 'now' : ''}"></i>`).join('')}</div>
      <div class="en-page e10-kpage"><div class="en-pic big e10-kpic">${U.pic}</div>
        <p class="e10-ktext" id="kText">${wordsOf(U.text).map((w, i) => `<button class="e10-kw" data-kw="${i}">${esc(w)}</button>`).join(' ')}</p></div>
      <div class="e10-kturn" id="kTurn">${K.read[K.u] ? (K.read[K.u] === 'mine' ? '🙋 You read this one!' : '🦉 Owl read this one.') : next === 'mine' ? '🙋 Your turn! Tap My turn and read along.' : '🦉 Owl reads first, or you can try!'}</div>
      <div class="row e10-krow"><button class="btn alt${next === 'owl' && !K.read[K.u] ? ' e10-glow' : ''}" id="kOwl">🦉 Owl reads</button><button class="btn leaf${next === 'mine' && !K.read[K.u] ? ' e10-glow' : ''}" id="kMine">🙋 My turn</button></div>
      <div class="row e10-krow"><button class="btn alt" id="kPrev"${K.u ? '' : ' disabled'} aria-label="Back one sentence">◀</button><button class="btn alt" id="kSpeed">${SPEEDS.find(s => s[0] === K.sp)[1]}</button><button class="btn alt" id="kNext"${K.read[K.u] ? '' : ' disabled'}>${last ? 'Finish ⭐' : 'Next ▶'}</button></div>
      <div class="cheer" id="cheer" aria-live="polite">${msg || ''}</div>${ptip('karaoke')}`;
    wireBack(() => kHome(K.x.tab));
    screenText = U.text;
    const words = wordsOf(U.text), els = [...view.querySelectorAll('.e10-kw')];
    const light = i => { K.w = i; els.forEach((el, k) => { el.classList.toggle('on', k === i); el.classList.toggle('past', k < i); }); };
    const stop = () => { clearTimeout(K.timer); K.playing = false; };
    const dur = (w, mode) => { const n = w.replace(/[^\w']/g, '').length, p = /[.!?,;:]["”’']*$/.test(w) ? 1 : 0;
      return (mode === 'owl' ? 230 + 60 * n + 260 * p : 600 + 110 * n + 380 * p) / K.sp; };
    function play(mode) {
      if (K.playing || K.finished || nav !== navId) return;
      K.playing = true; K.mode = mode; light(-1);
      ['kOwl', 'kMine', 'kNext', 'kPrev'].forEach(id => { const b = $('#' + id); if (b) b.disabled = true; });
      $('#kTurn').textContent = mode === 'owl' ? '🦉 Owl is reading… follow the light!' : '🙋 Your turn! Read each word as it lights up. Tap the next word to go faster.';
      if (mode === 'owl') talk([U.text], Math.min(1.1, 0.8 * K.sp));
      else tone([660, 880], 0.06);
      const step = () => {
        if (nav !== navId) return;
        const i = K.w + 1;
        if (i >= words.length) { endUnit(mode); return; }
        light(i); if (mode === 'mine') tone([500 + (i % 5) * 60], 0.03);
        K.timer = setTimeout(step, dur(words[i], mode));
      };
      K.step = step; step();
    }
    function endUnit(mode) {
      stop(); light(words.length); K.read[K.u] = mode; mode === 'mine' ? K.mine++ : K.owl++;
      const lastU = K.u === K.units.length - 1;
      if (mode === 'mine') { yay(); say(pick(['Great reading!', 'You read it!', 'Super reader!', 'Wonderful!'])); }
      $('#kText').classList.add(mode === 'mine' ? 'e10-yay' : 'e10-done');
      $('#cheer').textContent = mode === 'mine' ? '🙋 You read it! ⭐' : '🦉 Owl read it.';
      later(nav, mode === 'owl' ? 900 : 1100, () => {
        if (lastU) { finishK(); return; }
        K.u++; drawK();
        say(K.read[K.u - 1] === 'owl' ? 'Your turn! Tap My turn.' : 'Owl reads next, or you can keep going!');
      });
    }
    // In "My turn", tapping the next word moves on sooner; any other time a tap just says the word.
    els.forEach((el, i) => el.onclick = () => {
      if (K.playing && K.mode === 'mine' && (i === K.w + 1 || i === K.w)) { clearTimeout(K.timer); if (i === K.w + 1) K.step(); else K.timer = setTimeout(K.step, 120); return; }
      if (!K.playing) { light(i); say(words[i].replace(/[^\w'-]/g, '')); }
    });
    $('#kOwl').onclick = () => play('owl');
    $('#kMine').onclick = () => play('mine');
    $('#kSpeed').onclick = () => { if (K.playing) return; const i = SPEEDS.findIndex(s => s[0] === K.sp); K.sp = SPEEDS[(i + 1) % SPEEDS.length][0]; R4().kspeed = K.sp; save(); $('#kSpeed').textContent = SPEEDS.find(s => s[0] === K.sp)[1]; };
    $('#kPrev').onclick = () => { if (K.playing || !K.u) return; K.u--; drawK(); };
    $('#kNext').onclick = () => { if (K.playing || !K.read[K.u]) return; if (last) { if (K.units.every((_, k) => K.read[k])) finishK(); else { K.u = K.units.findIndex((_, k) => !K.read[k]); drawK(); } return; } K.u++; drawK(); };
  }
  function finishK() {
    if (K.finished) return;
    if (!K.units.every((_, k) => K.read[k])) { K.u = K.units.findIndex((_, k) => !K.read[k]); drawK('Read every sentence to finish!'); return; }
    K.finished = true;
    const e = R4(), first = !e.kara[K.key], earned = (first ? 2 : 1) + Math.min(3, K.mine);
    e.kara[K.key] = (e.kara[K.key] || 0) + 1; bump('kara'); best('kara', K.mine); give(earned); save();
    const key = K.key, tab = K.x.tab;
    reward('Read-along star!', `You read ${K.mine} sentence${K.mine === 1 ? '' : 's'} yourself in ${esc(K.x.title)} and earned ${earned} ⭐`, () => go(kPlay, key, 0), () => go(kHome, tab));
  }
  // Every story and chapter page gets a "Read-along" button that opens it here at the same page.
  const PAGE = new Map();
  for (const x of ITEMS()) { if (x.tab === 'twisters') continue; let u = 0; x.pages.forEach(([, t]) => { if (!PAGE.has(t)) PAGE.set(t, [x.key, u]); u += sentences(t).length; }); }
  new MutationObserver(() => {
    const b = view.querySelector('#enRead, #bkRead'); if (!b || view.querySelector('#kAlong')) return;
    const hit = PAGE.get(screenText); if (!hit) return;
    const k = document.createElement('button'); k.className = 'btn alt'; k.id = 'kAlong'; k.textContent = '🎤 Read-along';
    b.after(k); k.onclick = () => go(kPlay, hit[0], hit[1]);
  }).observe(view, { childList: true });

  /* ===================== wiring ===================== */
  SECTIONS.push(
    { id: 'soundlab', ico: '🏠', name: 'Sound lab', sub: 'Word families, listen closely, all 44 sounds', fn: () => labHome(), c: '#B45309',
      tip: 'Word families make reading snowball: once your child reads "cat", they can read hat, bat and flat. Say silly words together too; spotting that "zat" is not a word is real reading work.' },
    { id: 'wordpower', ico: '💪', name: 'Word power', sub: 'Opposites, sorting, ladders, sayings and slang', fn: () => wpHome(), c: '#0F766E',
      tip: 'Climb word ladders out loud during the day: "Is it warm, hot or boiling?" Try one new saying at dinner and ask what it really means.' },
    { id: 'karaoke', ico: '🎤', name: 'Read-along', sub: 'Words light up as Owl reads. Then it is your turn!', fn: () => kHome(), c: '#BE185D',
      tip: 'Take turns: Owl reads a sentence, your child reads the next. Run a finger under the words together; pace matters more than speed.' }
  );
  Object.assign(VIEWS, { lab: labHome, famHome, fam: famHouse, pairs: () => quiz(pairSpec()), tricky: () => quiz(trickySpec()), wall: wallView, wallQuiz: () => quiz(wallSpec()),
    wp: wpHome, opp: oppMatch, sort: () => quiz(sortSpec()), odd: () => quiz(oddSpec()), comp: () => quiz(compSpec()), ladder, homo: () => quiz(homoSpec()),
    idioms: idiomCards, idiomQuiz: () => quiz(idiomSpec()), kara: kHome, kplay: kPlay });
  const prevMore = englishHome.more;
  englishHome.more = b => { const x = prevMore ? prevMore(b) : b;
    return { ...x, games: x.games + 11, families: EN_FAMILIES.length, familyWords: EN_FAMILIES.reduce((a, F) => a + F.real.length, 0), minPairs: EN_MINPAIRS.length, wallSounds: EN_WALL.length,
      tricky: EN_TRICKY.length, idioms: EN_IDIOMS.length, ladders: EN_LADDERS.length, compounds: EN_COMPOUND.length, homophones: EN_HOMO2.length, opposites: EN_OPP.length + OPP2.length,
      categories: EN_CATS.length, readAlong: ITEMS().length }; };
  // For the grown-ups' report: what round 4 adds, read from any player's saved english state.
  englishHome.round4 = e => {
    const o = v => (v && typeof v === 'object' && !Array.isArray(v) ? v : {}), x = o(e), rounds = o(x.rounds);
    return { famWords: EN_FAMILIES.reduce((a, F) => a + F.real.filter(r => o(o(x.fam)[F.end])[r.w]).length, 0), famAll: EN_FAMILIES.reduce((a, F) => a + F.real.length, 0),
      houses: +rounds.fam || 0, wall: EN_WALL.filter(T => o(x.wall)[T.k]).length, wallAll: EN_WALL.length,
      readAlong: Object.keys(o(x.kara)).length, readAlongAll: ITEMS().length, idioms: EN_IDIOMS.filter(I => o(x.idi)[I[0]]).length, idiomsAll: EN_IDIOMS.length,
      wordPower: ['wp-opp', 'wp-sort', 'wp-odd', 'wp-comp', 'wp-ladder', 'wp-homo', 'wp-idiom'].reduce((a, k) => a + (+rounds[k] || 0), 0),
      listening: ['lab-pairs', 'lab-tricky', 'lab-wall'].reduce((a, k) => a + (+rounds[k] || 0), 0) };
  };
  if (location.hash === '#selftest' && window.__english) {
    Object.defineProperties(window.__english, Object.getOwnPropertyDescriptors({
      R4, pairSpec, trickySpec, wallSpec, sortSpec, oddSpec, compSpec, homoSpec, idiomSpec, oppList, ITEMS, unitsOf, sentences, spells, CLASH,
      get H4() { return H4; }, get OM() { return OM; }, get LD() { return LD; }, get K() { return K; }
    }));
    Object.assign(window.__english.data, { EN_FAMILIES, EN_MINPAIRS, EN_TRICKY, EN_WALL, EN_OPP2, EN_CATS, EN_COMPOUND, EN_LADDERS, EN_HOMO2, EN_IDIOMS });
  }
})();
