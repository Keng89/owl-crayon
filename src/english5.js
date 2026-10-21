/* ---------- English & Reading, part 5: Word play, Word of the day, Owl's review and the word album ---------- */
// Builds on the screens in english3.js through englishHome.api. Two new sections join the English home:
// "Word play" (7 games) and "My words" (word of the day with a daily streak, a spaced review of missed words, and an
// album that collects every word the child gets right twice). All progress stays in st.english.
(() => {
  const A = englishHome.api, { quiz, give, reward, E, stage, open, talk, tapWords, wireTapWords, ptip, hooks, maxTier, tierOf, SECTIONS, VIEWS } = A;
  const voice = () => !!(st.speak && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined');
  const W = () => {
    const e = E(); e.got = e.got || {}; e.review = e.review || {}; e.tw = e.tw || {}; e.tales = e.tales || {}; e.miles = e.miles || {};
    e.wotd = e.wotd || { last: '', streak: 0, best: 0, n: 0, days: [] }; return e;
  };
  const dn = () => dayNum(today());
  const lw = w => String(w).toLowerCase();

  /* --- the word album and the review queue --- */
  // A word is collected after 2 first-try answers, or when it leaves the review queue, or as the word of the day.
  const MILES = [10, 25, 50, 100, 200, 400, 800];
  const collected = () => Object.keys(W().got).filter(k => W().got[k] >= 2 && EN_WORD[k]);
  function collect(w, n = 2) {
    const e = W(), k = lw(w); e.got[k] = Math.max(e.got[k] || 0, n);
    const c = collected().length, m = MILES.find(x => c >= x && !e.miles[x]);
    if (m) { e.miles[m] = 1; setTimeout(() => toast(`📒 ${m} words in your word album!`), 500); }
  }
  // Leitner boxes: a missed word comes back today, then after 1 day, then 3 days; the third right answer clears it.
  const GAPS = [0, 1, 3];
  hooks.miss = rv => {
    if (!rv || !rv.w) return;
    const e = W(), k = lw(rv.w), r = e.review[k];
    e.review[k] = { w: rv.w, e: rv.e || (r && r.e) || '', k: rv.k || (rv.e ? 'pic' : 'sight'), box: 0, due: dn(), n: ((r && r.n) || 0) + 1 };
    const keys = Object.keys(e.review);
    if (keys.length > 60) delete e.review[keys.filter(x => x !== k).sort((a, b) => e.review[b].due - e.review[a].due)[0]];
    save();
  };
  hooks.hit = (rv, first, inReview) => {
    if (!rv || !rv.w || !first) return;
    const e = W(), k = lw(rv.w), r = e.review[k];
    e.got[k] = (e.got[k] || 0) + 1;
    if (e.got[k] === 2) collect(k);
    if (r && (inReview || r.due <= dn())) {
      r.box++;
      if (r.box >= GAPS.length) { delete e.review[k]; collect(k, 3); } else r.due = dn() + GAPS[r.box];
    }
  };
  const dueList = () => Object.values(W().review).filter(r => r.due <= dn()).sort((a, b) => a.due - b.due || b.n - a.n);
  const when = d => { const g = d - dn(); return g <= 0 ? 'today' : g === 1 ? 'tomorrow' : `in ${g} days`; };

  // Three or four picture choices with different pictures, from the same topic when it can.
  function picChoices(x, n) {
    const out = [x], seen = new Set([x.e]);
    const pools = [EN_ALLWORDS.filter(o => o.topic === x.topic && tierOf(o) <= Math.max(maxTier(), tierOf(x))), EN_ALLWORDS.filter(o => tierOf(o) === 1)];
    for (const p of pools) for (const o of shuffle(p)) { if (out.length > n) break; if (!seen.has(o.e) && lw(o.w) !== lw(x.w)) { seen.add(o.e); out.push(o); } }
    return shuffle(out);
  }

  function reviewQ(r) {
    const x = EN_WORD[lw(r.w)];
    if (r.k === 'pic' && (x || r.e)) {
      const it = x || { w: r.w, e: r.e, topic: 'animals', t: 1 };
      const listen = voice() && Math.random() < 0.5;
      return { prompt: listen ? 'Listen! Tap the picture you hear.' : `Which one is <b>${esc(it.w)}</b>?`, say: listen ? `Listen: ${it.w}. ${it.w}.` : `Which one is ${it.w}?`,
        visual: listen ? '<div class="en-ear" aria-hidden="true">👂</div>' : '', rv: { w: it.w, e: it.e },
        choices: picChoices(it, 2).map(o => ({ html: o.e, val: o.w, say: o.w })), answer: it.w, explain: `${it.e} This one is ${it.w}. It will come back again soon!` };
    }
    const all = [...new Set(EN_SIGHT.flatMap(s => s.words))].filter(o => o !== r.w);
    const near = shuffle(all).sort((a, b) => Math.abs(a.length - r.w.length) - Math.abs(b.length - r.w.length)).slice(0, 2);
    return { prompt: voice() ? 'Tap the word you hear.' : `Find the word <b>${esc(r.w)}</b>.`, say: `Find the word: ${r.w}. ${r.w}.`, visual: '<div class="en-pic">👀</div>', rv: { w: r.w, k: 'sight' },
      choices: enTxt([r.w, ...near]), answer: r.w, explain: `This one says ${r.w}. Look for it again!` };
  }
  function startReview() {
    const due = dueList().slice(0, 6);
    if (!due.length) { go(myWords); say('No words to practice right now. Great job!'); return; }
    quiz({ id: 'review', title: "🔁 Owl's review", back: () => go(myWords), review: true, tip: 'mywords', list: due.map(reviewQ) });
  }

  /* --- word of the day --- */
  function wotdWord() {
    // Young readers get first words; the oldest get the "more" and "big" words.
    const mt = maxTier(), pool = EN_ALLWORDS.filter(x => tierOf(x) <= mt && (mt < 3 || tierOf(x) >= 2) && /^[a-zA-Z -]+$/.test(x.w));
    let h = 7; for (const c of today() + ':' + mt) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return pool[h % pool.length];
  }
  const streakNow = () => { const o = W().wotd; return o.last && dn() - dayNum(o.last) <= 1 ? o.streak : 0; };
  // Rough syllable count for the clapping game (vowel groups, minus a silent e).
  function syllables(word) {
    return word.toLowerCase().split(/[\s-]+/).filter(Boolean).reduce((a, w) => {
      let n = (w.match(/[aeiouy]+/g) || []).length;
      if (n > 1 && /[^l]e$/.test(w) && !/[aeiouy]e$/.test(w)) n--;
      if (/[^aeiou]le$/.test(w) && n < 2) n = 2;
      return a + Math.max(1, n);
    }, 0);
  }
  const USE = [w => `Can you say a sentence with the word "${w}"?`, w => `Can you find something at home that goes with "${w}"?`, w => `Can you act out "${w}" without talking?`,
    w => `Can you tell a grown-up what "${w}" means?`, w => `Can you draw a picture of "${w}"?`];
  function wotd() {
    const e = W(), x = wotdWord(), o = e.wotd, done = o.last === today(), nav = navId, s = streakNow();
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      return `<span class="en-day${o.days.includes(k) ? ' on' : ''}${i === 6 ? ' now' : ''}"><small>${'SMTWTFS'[d.getDay()]}</small>${o.days.includes(k) ? '⭐' : '·'}</span>`; }).join('');
    const use = USE[dayNum(today()) % USE.length](x.w);
    view.innerHTML = `${crumbs('☀️ Word of the day')}
      <div class="en-wotd"><span class="en-wsun" aria-hidden="true">☀️</span><div class="en-wpic">${x.e}</div><div class="en-word">${esc(x.w)}</div>
        ${x.m ? `<p class="en-wmean">${esc(x.m)}</p>` : ''}<span class="note">From the ${esc((EN_VOCAB.find(t => t.id === x.topic) || {}).name || 'word book')} page${tierOf(x) === 3 ? ' · ✨ a big word' : ''}</span></div>
      <div class="row"><button class="btn alt" id="wHear">🔊 Hear it</button><button class="btn alt" id="wClap">👏 Clap it</button></div>
      <div class="en-claps" id="wClaps" aria-live="polite"></div>
      <div class="en-streak"><b>🔥 ${s} day${s === 1 ? '' : 's'} in a row</b><span class="note">Best: ${o.best || 0} · ${o.n || 0} words of the day</span><div class="en-days">${days}</div></div>
      <p class="en-use">💭 ${esc(use)}</p>
      <div id="wPlay">${done ? `<p class="en-wdone">✅ You found today's word! Come back tomorrow for a new one.</p>` : `<button class="btn leaf" id="wGo">🎯 Find today's word!</button>`}</div>
      <div class="cheer" id="cheer" aria-live="polite"></div>${ptip('mywords')}`;
    wireBack(myWords);
    sayScreen(`The word of the day is ${x.w}. ${x.m ? `${x.w} means ${x.m}.` : ''} ${use}`);
    const hear = () => talk([x.w, x.m ? `${x.w} means ${x.m}` : x.w], 0.8);
    $('#wHear').onclick = hear;
    $('#wClap').onclick = () => {
      const n = syllables(x.w), box = $('#wClaps'); box.innerHTML = ''; talk([x.w], 0.6);
      for (let i = 0; i < n; i++) setTimeout(() => { if (nav !== navId || !box.isConnected) return; box.insertAdjacentHTML('beforeend', '<span class="en-clap">👏</span>'); tone([700 + i * 80], .08); }, 300 + i * 450);
      setTimeout(() => { if (nav === navId && box.isConnected) box.insertAdjacentHTML('beforeend', `<b>${n} clap${n > 1 ? 's' : ''}!</b>`); }, 300 + n * 450);
    };
    const g = $('#wGo'); if (!g) return;
    g.onclick = () => {
      const opts = picChoices(x, 2), useTxt = stage() >= 3;
      $('#wPlay').innerHTML = `<div class="choices en-ch" style="grid-template-columns:repeat(3,1fr)">${opts.map((o, i) => `<button class="choice${useTxt ? ' txt' : ''}" data-wi="${i}" aria-label="${esc(o.w)}">${useTxt ? `<span class="en-ce">${o.e}</span><small>${esc(o.w)}</small>` : o.e}</button>`).join('')}</div>`;
      say(`Which one is ${x.w}?`);
      let tries = 0, fin = false;
      view.querySelectorAll('[data-wi]').forEach(b => b.onclick = () => {
        if (fin || b.disabled || nav !== navId) return;
        const o = opts[+b.dataset.wi];
        if (o.w !== x.w) { tries++; b.classList.add('wrong'); b.disabled = true; oops(); say(`That is ${o.w}. Find ${x.w}!`); return; }
        fin = true; b.classList.add('right');
        const ev = W(), w = ev.wotd;
        if (w.last !== today()) {
          w.streak = streakNow() + 1; w.best = Math.max(w.best || 0, w.streak); w.n = (w.n || 0) + 1; w.last = today();
          w.days = [...(w.days || []).filter(d => dn() - dayNum(d) < 30), today()];
          collect(x.w); give(3); confetti(60); yay();
          $('#cheer').textContent = `🔥 ${w.streak} day${w.streak > 1 ? 's' : ''} in a row! ⭐⭐⭐`;
          say(`Yes! ${x.w}! You have a ${w.streak} day streak!`);
        }
        save();
        setTimeout(() => { if (nav === navId) go(wotd); }, 1800);
      });
    };
  }

  /* --- My words: word of the day, review, album --- */
  function myWords(tid) {
    const e = W(), x = wotdWord(), due = dueList(), all = Object.values(e.review).sort((a, b) => a.due - b.due), got = collected();
    const T = EN_VOCAB.find(t => t.id === (tid || e.at || (got[0] && EN_WORD[got[0]].topic))) || EN_VOCAB[0]; e.at = T.id;
    const hasT = w => (e.got[lw(w)] || 0) >= 2;
    view.innerHTML = `${crumbs('🏅 My words')}
      <div class="en-gg">
        <button class="en-gt en-mw" id="mwWotd"><span class="en-sico">☀️</span><b>Word of the day</b><small>${e.wotd.last === today() ? '✅ done today' : `${x.e} new word waiting`} · 🔥 ${streakNow()}</small></button>
        <button class="en-gt en-mw" id="mwRev"><span class="en-sico">🔁</span><b>Owl's review</b><small>${due.length ? `${due.length} word${due.length > 1 ? 's' : ''} to practice now` : all.length ? `next one ${when(all[0].due)}` : 'nothing to review. Hooray!'}</small></button>
      </div>
      ${all.length ? `<div class="en-revlist"><b>Words coming back:</b> ${all.slice(0, 12).map(r => `<span class="en-rv${r.due <= dn() ? ' due' : ''}">${r.e || '🔤'} ${esc(r.w)} <small>${when(r.due)}</small></span>`).join('')}</div>` : ''}
      <h3 class="section-title">📒 Word album <span class="tag">${got.length}/${EN_ALLWORDS.length}</span></h3>
      <span class="meter en-ameter"><i style="width:${Math.max(1, Math.round(got.length / EN_ALLWORDS.length * 100))}%"></i></span>
      <div class="en-badges">${MILES.map(m => `<span class="en-badge${e.miles[m] ? ' on' : ''}" title="${m} words">${e.miles[m] ? '🏅' : '🔒'}<small>${m}</small></span>`).join('')}</div>
      <p class="note">Get a word right on the first try twice and its sticker goes in your album.</p>
      <div class="en-tabs scroll">${EN_VOCAB.map(t => { const n = t.words.filter(w => hasT(w.w)).length; return `<button class="en-tab${t.id === T.id ? ' on' : ''}" data-at="${t.id}">${t.ico} ${n}/${t.words.length}${n === t.words.length ? ' 🏆' : ''}</button>`; }).join('')}</div>
      <div class="en-album">${T.words.map((w, i) => `<button class="en-stk${hasT(w.w) ? ' got' : ''}" data-sk="${i}" aria-label="${hasT(w.w) ? esc(w.w) : 'Not collected yet'}"><span class="en-pe">${w.e}</span><b>${hasT(w.w) ? esc(w.w) : '?'}</b></button>`).join('')}</div>${ptip('mywords')}`;
    wireBack(englishHome);
    sayScreen(`My words. You have ${got.length} words in your album.${due.length ? ` Owl has ${due.length} words for you to practice.` : ''}`);
    $('#mwWotd').onclick = () => go(wotd);
    $('#mwRev').onclick = () => due.length ? go(startReview) : say(all.length ? `The next word comes back ${when(all[0].due)}.` : 'Nothing to review. Hooray!');
    view.querySelectorAll('[data-at]').forEach(b => b.onclick = () => go(myWords, b.dataset.at));
    view.querySelectorAll('[data-sk]').forEach(b => b.onclick = () => { const w = T.words[+b.dataset.sk]; if (hasT(w.w)) { b.classList.remove('wig'); void b.offsetWidth; b.classList.add('wig'); say(w.w); } else say('Not collected yet. Get it right two times to win this sticker!'); });
  }

  /* --- Word play hub --- */
  const PLAY = [
    ['spell', '🐝', 'Spelling bee', 'Spell the picture with letter tiles'], ['maker', '📚', 'Story maker', 'Pick a hero, a place and a problem'],
    ['rhyme', '🎵', 'Rhyme time', 'Finish the rhymes and sing your song'], ['describe', '🔍', 'Describe it', 'Which sentence matches the picture?'],
    ['safari', '🔭', 'Sound safari', 'Hunt for things that start with a sound'], ['twisters', '👅', 'Tongue twisters', 'Say them slow, then super fast'],
    ['listen', '👂', 'Listen & tap', 'Hear a word, tap its picture']
  ];
  function playHome() {
    view.innerHTML = `${crumbs('🎨 Word play')}
      <div class="en-gg">${PLAY.map(([id, ico, name, sub]) => `<button class="en-gt en-wp" data-wp="${id}"><span class="en-sico">${ico}</span><b>${name}</b><small>${sub}</small></button>`).join('')}</div>${ptip('play')}`;
    wireBack(englishHome);
    sayScreen('Word play! Spelling bee, story maker, rhyme time, describe it, sound safari, tongue twisters, or listen and tap.');
    view.querySelectorAll('[data-wp]').forEach(b => b.onclick = () => go(VIEWS[b.dataset.wp]));
  }

  /* --- Spelling bee: tap letter tiles in order to spell the picture --- */
  let SP = null;
  function spellPool() {
    const s = stage(), [lo, hi] = [[3, 3], [3, 4], [3, 5], [4, 6], [4, 8]][s - 1], mt = maxTier(), seen = new Set(), out = [];
    for (const x of [...EN_BLEND.filter(b => b.stage <= 2), ...EN_ALLWORDS.filter(x => tierOf(x) <= mt)])
      if (/^[a-z]+$/.test(x.w) && x.w.length >= lo && x.w.length <= hi && !seen.has(x.w)) { seen.add(x.w); out.push({ w: x.w, e: x.e }); }
    return out;
  }
  function spell() { SP = { list: shuffle(spellPool()).slice(0, 5), i: 0, stars: 0, first: 0 }; spellRound(); }
  function spellRound() {
    const x = SP.list[SP.i], s = stage(), n = s >= 3 ? 2 : s === 2 ? 1 : 0;
    const extra = shuffle('abcdefghijklmnoprstuvwy'.split('').filter(c => !x.w.includes(c))).slice(0, n);
    let tiles = shuffle([...x.w.split(''), ...extra]);
    if (tiles.join('') === x.w && tiles.length > 1) tiles = tiles.reverse();
    Object.assign(SP, { cur: x, tiles: tiles.map(c => ({ c, used: false })), got: 0, miss: 0, done: false, ghost: s === 1 });
    drawSpell(); say(`Spell ${x.w}. ${x.w}.`);
  }
  function drawSpell(msg) {
    const x = SP.cur, nav = navId;
    view.innerHTML = `${crumbs('🐝 Spelling bee')}
      <div class="progress">${SP.list.map((_, k) => `<i class="${k < SP.i ? 'done' : k === SP.i ? 'now' : ''}"></i>`).join('')}</div>
      <div class="en-spell${SP.done ? ' ok' : ''}"><div class="en-pic big en-spic">${x.e}</div><button class="speak" id="spk" aria-label="Hear the word">🔊</button></div>
      <div class="en-slots" aria-label="Your word">${x.w.split('').map((c, i) => `<span class="en-slot${i < SP.got ? ' on' : ''}${i === SP.got && !SP.done ? ' next' : ''}">${i < SP.got ? c : SP.ghost ? `<i>${c}</i>` : ''}</span>`).join('')}</div>
      <div class="en-tiles">${SP.tiles.map((t, i) => t.used ? '' : `<button class="en-tile" data-tl="${i}" aria-label="letter ${t.c}">${t.c}</button>`).join('')}</div>
      <div class="cheer" id="cheer" aria-live="polite">${msg || ''}</div>${ptip('play')}`;
    wireBack(playHome);
    $('#spk').onclick = () => talk([x.w, x.w.split('').map(c => EN_SND[c] || c).join(', '), x.w], 0.75);
    view.querySelectorAll('[data-tl]').forEach(b => b.onclick = () => {
      if (SP.done || nav !== navId) return;
      const t = SP.tiles[+b.dataset.tl], want = x.w[SP.got];
      if (t.c !== want) {
        SP.miss++; oops(); b.classList.add('wrong'); setTimeout(() => b.classList.remove('wrong'), 400);
        if (SP.miss === 1) hooks.miss({ w: x.w, e: x.e });
        say(`Not ${t.c}. Listen: ${x.w}. What sound comes next? ${EN_SND[want] || want}.`); return;
      }
      t.used = true; SP.got++; tone([520 + SP.got * 60], .07);
      if (SP.got < x.w.length) { drawSpell(); say(EN_SND[t.c] || t.c); return; }
      SP.done = true; const first = SP.miss === 0, earned = first ? 2 : 1;
      SP.stars += earned; if (first) { SP.first++; questTick('firsttry'); }
      hooks.hit({ w: x.w, e: x.e }, first); give(earned); yay();
      drawSpell(`${first ? 'Perfect spelling!' : 'You spelled it!'} ${'⭐'.repeat(earned)}`);
      say(`${x.w}! ${x.w.split('').join(', ')}. ${x.w}!`);
      setTimeout(() => {
        if (nav !== navId) return; SP.i++;
        if (SP.i < SP.list.length) { spellRound(); return; }
        const e = E(); e.rounds.spell = (e.rounds.spell || 0) + 1; e.best.spell = Math.max(e.best.spell || 0, SP.first); save();
        reward('Spelling star!', `You spelled ${SP.list.length} words and earned ${SP.stars} ⭐`, () => go(spell), () => go(playHome));
      }, 1900);
    });
  }

  /* --- Story maker: pick a hero, a place and a problem; Owl writes and reads the story --- */
  let TM = null;
  const heroes = () => [...EN_TALE.heroes.map(h => ({ phr: h[0], e: h[1], ref: 'the ' + h[2] })), { phr: st.name || 'You', e: (profileOf(pid) || {}).avatar || '🧒', ref: st.name || 'you', me: true }];
  function storyMaker() { TM = { hero: null, place: null, prob: null }; drawMaker(); say('Story maker! Pick a hero, a place, and a problem.'); }
  function drawMaker(spin) {
    const H = heroes(), steps = [['hero', '🦸 Who is the hero?', H.map(h => [h.e, h.me ? `${h.phr} (me!)` : h.phr])], ['place', '🗺️ Where are they?', EN_TALE.places.map(p => [p[1], p[0]])], ['prob', '⚡ What goes wrong?', EN_TALE.problems.map(p => [p[1], p[2]('the hero')])]];
    const ready = TM.hero != null && TM.place != null && TM.prob != null;
    view.innerHTML = `${crumbs('📚 Story maker')}
      <div class="en-recipe${spin ? ' spin' : ''}">${steps.map(([k, , opts]) => `<span class="en-rslot${TM[k] != null ? ' on' : ''}">${TM[k] != null ? opts[TM[k]][0] : '❔'}</span>`).join('<b>+</b>')}</div>
      <div class="row"><button class="btn alt" id="tmDice">🎲 Surprise me!</button><button class="btn leaf" id="tmGo"${ready ? '' : ' disabled'}>📖 Make my story!</button></div>
      ${steps.map(([k, q, opts]) => `<h3 class="section-title">${q}</h3><div class="en-mk">${opts.map(([e, t], i) => `<button class="en-mko${TM[k] === i ? ' on' : ''}" data-mk="${k}:${i}" aria-label="${esc(t)}"><span>${e}</span><small>${esc(t)}</small></button>`).join('')}</div>`).join('')}
      ${ptip('play')}`;
    wireBack(playHome);
    view.querySelectorAll('[data-mk]').forEach(b => b.onclick = () => { const [k, i] = b.dataset.mk.split(':'); TM[k] = +i; tone([600 + (+i) * 30], .06); say(b.getAttribute('aria-label')); drawMaker(); });
    $('#tmDice').onclick = () => { TM.hero = rnd(0, H.length - 1); TM.place = rnd(0, EN_TALE.places.length - 1); TM.prob = rnd(0, EN_TALE.problems.length - 1); tone([523, 659, 784, 988], .07); drawMaker(true); };
    $('#tmGo').onclick = () => { if (TM.hero != null && TM.place != null && TM.prob != null) go(tale, makeTale(H[TM.hero], EN_TALE.places[TM.place], EN_TALE.problems[TM.prob], stage() >= 4), 0); };
  }
  // Problem ids read badly in a title ("The mouse and the bored"), so titles use a noun.
  const TALE_TITLE = { hiccups: 'hiccups', rain: 'jelly bean rain', stuck: 'tall tree', dark: 'missing sun', hungry: 'rumbly tummy', sneeze: 'big sneeze', bored: 'boring day', monster: 'grumpy monster', balloon: 'runaway balloon' };
  function makeTale(H, place, prob, big) {
    const w = k => EN_TALE.words[k][big ? 1 : 0], helper = pick(EN_TALE.helpers), like = pick(EN_TALE.likes), Ref = enCap(H.ref);
    return { key: `${H.me ? 'me' : H.e}|${place[1]}|${prob[0]}`, title: `${Ref} and the ${TALE_TITLE[prob[0]] || prob[0]}`, pages: [
      [H.e + place[1], H.me ? `Once upon a time, ${H.phr} lived ${place[0]}.` : `Once upon a time, there was ${H.phr} who lived ${place[0]}.`],
      ['😊', `Every day, ${H.ref} liked to ${like}. Life was ${w('good')}!`],
      [prob[1], `${w('start')} ${prob[2](H.ref)}!`],
      [helper[1], `"Oh no!" ${H.ref} ${w('said')}. Just then, ${helper[0]} came by to help.`],
      ['💡', `${prob[3](H.ref)}.`],
      ['🎉', `${Ref} gave the ${helper[2]} a ${w('big')} hug and felt very ${w('happy')}. ${pick(EN_TALE.ends)}`]
    ] };
  }
  function tale(T, p) {
    const pg = T.pages[p], last = p === T.pages.length - 1, nav = navId;
    view.innerHTML = `${crumbs('📚 My story')}
      <div class="progress">${T.pages.map((_, k) => `<i class="${k < p ? 'done' : k === p ? 'now' : ''}"></i>`).join('')}</div>
      <div class="en-page en-tale">${p === 0 ? `<b class="en-ttl">${esc(T.title)}</b>` : ''}<div class="en-pic big">${pg[0]}</div><p class="en-sent" id="tmText">${tapWords(pg[1])}</p></div>
      <div class="row"><button class="btn alt" id="enPrev"${p ? '' : ' disabled'}>◀ Back</button><button class="btn alt" id="enRead">🔊 Read to me</button><button class="btn leaf" id="enNextP">${last ? '⭐ The end!' : 'Next ▶'}</button></div>`;
    wireBack(storyMaker);
    screenText = pg[1]; wireTapWords(view);
    const read = () => { talk([pg[1]], 0.85); glow('#tmText', 0.85, nav); };
    $('#enRead').onclick = read; read();
    $('#enPrev').onclick = () => { if (p) go(tale, T, p - 1); };
    $('#enNextP').onclick = () => {
      if (!last) { go(tale, T, p + 1); return; }
      const e = W(), fresh = !e.tales[T.key]; e.tales[T.key] = 1; e.rounds.tale = (e.rounds.tale || 0) + 1;
      if (fresh) give(2); save();
      const n = Object.keys(e.tales).length;
      reward('What a story!', `You have made ${n} different stor${n === 1 ? 'y' : 'ies'}${fresh ? ' and earned 2 ⭐' : '. Try a new mix for more stars!'}`, () => go(storyMaker), () => go(playHome));
    };
  }
  // Light the words of a line one after another, at about the speed the voice reads them.
  function glow(sel, rate, nav) {
    const ws = [...view.querySelectorAll(`${sel} .en-tw`)], ms = Math.round(330 / rate);
    ws.forEach((b, i) => setTimeout(() => { if (nav !== navId || !b.isConnected) return; ws.forEach(o => o.classList.remove('lit')); b.classList.add('lit'); }, 300 + i * ms));
    setTimeout(() => { if (nav === navId) ws.forEach(o => o.classList.remove('lit')); }, 400 + ws.length * ms);
  }

  /* --- Rhyme time: pick the rhyming word for each line, then sing the song --- */
  const lastWord = l => l.replace(/[^\w\s'-]/g, '').trim().split(/\s+/).pop();
  function rhymeSpec() {
    const list = shuffle(EN_RHYMES).slice(0, 4), many = stage() >= 3 ? 3 : 2;
    return { id: 'rhyme', title: '🎵 Rhyme time', back: () => go(playHome), tip: 'play',
      list: list.map(c => {
        const wrong = shuffle(EN_RHYMES.filter(o => o[4] !== c[4] && o[2] !== c[2])).filter((o, i, a) => a.findIndex(z => z[2] === o[2]) === i).slice(0, many);
        return { c, prompt: `${esc(c[0])}<br>${esc(c[1])} <span class="en-blank">&nbsp;?&nbsp;</span>`, say: `${c[0].replace(/[^\w\s"'!,.-]/g, '')}, ${c[1]}... what rhymes with ${lastWord(c[0])}?`,
          visual: '<div class="en-pic en-note" aria-hidden="true">🎵</div>', choices: shuffle([c, ...wrong]).map(o => ({ html: `<span class="en-ce">${o[3]}</span><small>${o[2]}</small>`, val: o[2], say: o[2] })), answer: c[2],
          explain: `Listen to the end sound: ${lastWord(c[0])}... ${c[2]}! They rhyme because they both end in "${c[4]}".` };
      }),
      end(R, rw) { song(R.list.map(q => q.c), rw); } };
  }
  function song(cs, rw) {
    const nav = navId, lines = cs.flatMap(c => [c[0], `${c[1]} ${c[2]}! ${c[3]}`]);
    view.innerHTML = `<div class="view done en-song"><div class="big en-notes" aria-hidden="true">🎶🦉🎶</div><h1>My rhyme song</h1>
      <div class="en-songl">${lines.map((l, i) => `<p data-sl="${i}">${esc(l)}</p>`).join('')}</div>
      <div class="row"><button class="btn alt" id="enSing">🎤 Sing it again</button><button class="btn leaf" id="enDone">Done ⭐</button></div></div>`;
    const light = i => { if (nav !== navId) return; view.querySelectorAll('[data-sl]').forEach(p => p.classList.toggle('lit', +p.dataset.sl === i)); };
    const sing = () => {
      tone([523, 587, 659, 784], .1);
      if (voice()) { try { speechSynthesis.cancel(); lines.forEach((l, i) => { const u = new SpeechSynthesisUtterance(speakable(l)); u.rate = 0.95; u.pitch = 1.4; u.onstart = () => light(i); speechSynthesis.speak(u); }); light(0); return; } catch (e) {} }
      lines.forEach((_, i) => setTimeout(() => light(i), i * 900));
    };
    $('#enSing').onclick = sing; $('#enDone').onclick = rw; sing();
  }

  /* --- Describe it: read the sentences, pick the one that matches the picture --- */
  function describeSpec() {
    return { id: 'describe', title: '🔍 Describe it', back: () => go(playHome), tip: 'play', gen() {
      const s = stage(), big = s >= 4, D = EN_DESC;
      const mk = (who, act, n, size) => {
        const sz = size ? size[big ? 1 : 0] + ' ' : '', noun = n === 1 ? who[0] : who[1], first = n === 1 ? (/^[aeiou]/.test(sz || noun) ? 'An' : 'A') : enCap(D.count[n - 1]);
        return `${first} ${sz}${noun} ${n === 1 ? act[0] : act[1]}.`;
      };
      const who = pick(D.who), act = pick(D.act), n = s === 1 ? rnd(1, 2) : rnd(1, 4), size = s >= 2 && Math.random() < 0.6 ? pick(D.size) : null;
      const right = mk(who, act, n, size), wrong = new Set();
      const tweaks = shuffle([() => mk(pick(D.who.filter(x => x !== who)), act, n, size), () => mk(who, pick(D.act.filter(x => x !== act)), n, size), () => mk(who, act, pick([1, 2, 3, 4].filter(x => x !== n && (s > 1 || x <= 3))), size),
        () => size ? mk(who, act, n, D.size.find(x => x !== size)) : mk(pick(D.who.filter(x => x !== who)), pick(D.act.filter(x => x !== act)), n, size)]);
      for (const t of tweaks) { if (wrong.size >= (s >= 3 ? 3 : 2)) break; const v = t(); if (v !== right) wrong.add(v); }
      const sc = size ? size[2] : 1;
      return { prompt: 'Which sentence tells about the picture?', say: 'Look at the picture. Which sentence tells about it?',
        visual: `<div class="en-desc"><span class="en-dwho" style="font-size:${Math.round(48 * sc)}px">${who[2].repeat(n)}</span><span class="en-dact">${act[2]}</span></div>`,
        choices: enTxt([right, ...wrong]), answer: right, explain: `Look closely: count the animals, check their size and what they are doing. It says: ${right}` };
    } };
  }

  /* --- Sound safari: find the hidden things that start with a sound --- */
  let SF = null;
  const SAFARI = 'bdfhjlmnprstvwz'.split('');
  function safariPool() {
    const by = {}, skip = /^(sh|ch|th|wh|ph|kn|wr)/;
    for (const x of EN_ALLWORDS) if (tierOf(x) <= 2 && /^[a-z]+$/.test(x.w) && !skip.test(x.w) && !['sugar', 'hour', 'sure'].includes(x.w) && SAFARI.includes(x.w[0])) (by[x.w[0]] = by[x.w[0]] || []).push(x);
    return by;
  }
  function safari() {
    const by = safariPool(), letters = shuffle(Object.keys(by).filter(l => new Set(by[l].map(x => x.e)).size >= 3)).slice(0, 3);
    SF = { by, letters, i: 0, stars: 0, first: 0 }; safariRound();
  }
  function safariRound() {
    const l = SF.letters[SF.i], seen = new Set(), pickU = (arr, n) => { const out = []; for (const x of shuffle(arr)) { if (out.length >= n) break; if (!seen.has(x.e)) { seen.add(x.e); out.push(x); } } return out; };
    const targets = pickU(SF.by[l], 3), others = pickU(Object.keys(SF.by).filter(k => k !== l).flatMap(k => SF.by[k]), 6);
    Object.assign(SF, { l, grid: shuffle([...targets, ...others]), found: {}, miss: 0, lock: false });
    drawSafari(); say(`Sound safari! Find 3 things that start with ${EN_SND[l]}. ${EN_SND[l]}!`);
  }
  function drawSafari(msg) {
    const nav = navId, l = SF.l, n = Object.keys(SF.found).length;
    view.innerHTML = `${crumbs('🔭 Sound safari')}
      <div class="progress">${SF.letters.map((_, k) => `<i class="${k < SF.i ? 'done' : k === SF.i ? 'now' : ''}"></i>`).join('')}</div>
      <div class="prompt"><div class="ptext">Find 3 things that start with <b class="en-sfl">${l}</b> (${EN_SND[l]})</div><button class="speak" id="spk" aria-label="Hear the sound">🔊</button></div>
      <div class="en-cam">📸 ${'🟢'.repeat(n)}${'⚪'.repeat(3 - n)}</div>
      <div class="en-jungle">${SF.grid.map((x, i) => `<button class="en-hid${SF.found[i] ? ' snap' : ''}" data-sf="${i}" style="animation-delay:${(i % 5) * 0.15}s" aria-label="${esc(x.w)}"><span>${x.e}</span>${SF.found[i] ? `<small>${esc(x.w)}</small>` : ''}</button>`).join('')}</div>
      <div class="cheer" id="cheer" aria-live="polite">${msg || ''}</div>${ptip('play')}`;
    wireBack(playHome);
    $('#spk').onclick = () => say(`Find things that start with ${EN_SND[l]}. ${EN_SND[l]}!`);
    view.querySelectorAll('[data-sf]').forEach(b => b.onclick = () => {
      if (SF.lock || nav !== navId) return;
      const i = +b.dataset.sf, x = SF.grid[i];
      if (SF.found[i]) { say(x.w); return; }
      if (x.w[0] !== l) { SF.miss++; oops(); b.classList.add('wrong'); setTimeout(() => b.classList.remove('wrong'), 400); say(`That is ${x.w}. ${x.w} starts with ${EN_SND[x.w[0]] || x.w[0]}.`); return; }
      SF.found[i] = 1; tone([880, 1175], .06);
      if (Object.keys(SF.found).length < 3) { drawSafari(); say(`${x.w}! ${EN_SND[l]}, ${x.w}!`); return; }
      SF.lock = true; const first = SF.miss === 0, earned = first ? 2 : 1;
      SF.stars += earned; if (first) { SF.first++; questTick('firsttry'); }
      give(earned); yay(); drawSafari(`Snap! You found all 3! ${'⭐'.repeat(earned)}`); say(`${x.w}! You found all three ${EN_SND[l]} things!`);
      setTimeout(() => {
        if (nav !== navId) return; SF.i++;
        if (SF.i < SF.letters.length) { safariRound(); return; }
        const e = E(); e.rounds.safari = (e.rounds.safari || 0) + 1; e.best.safari = Math.max(e.best.safari || 0, SF.first); save();
        reward('Safari explorer!', `You found ${SF.letters.length * 3} things and earned ${SF.stars} ⭐`, () => go(safari), () => go(playHome));
      }, 1600);
    });
  }

  /* --- Tongue twisters: hear them slow, fast and super fast; say it 3 times for stars --- */
  function twisterHome() {
    const e = W();
    view.innerHTML = `${crumbs('👅 Tongue twisters')}
      <p class="note">Listen slowly first. Then say it 3 times, faster and faster!</p>
      <div class="en-list">${EN_TWISTERS.map(([t, ico, s], i) => `<button class="en-row${open(s) ? '' : ' locked'}" data-tt="${i}"><span class="en-rico">${open(s) ? ico : '🔒'}</span><span><b>${esc(t)}</b><small>Stage ${s}${e.tw[i] ? ' · ✅ said it' : ''}</small></span></button>`).join('')}</div>${ptip('play')}`;
    wireBack(playHome);
    sayScreen('Tongue twisters! Pick one.');
    view.querySelectorAll('[data-tt]').forEach(b => b.onclick = () => { const i = +b.dataset.tt, s = EN_TWISTERS[i][2]; open(s) ? go(twister, i) : say(A.lockText(s)); });
  }
  function twister(i) {
    const [t, ico, s] = EN_TWISTERS[i], nav = navId; let said = 0;
    view.innerHTML = `${crumbs('👅 Tongue twister')}
      <div class="en-page en-twc"><div class="en-pic big en-twe">${ico}</div><p class="en-sent" id="twText">${tapWords(t)}</p></div>
      <div class="row"><button class="btn alt" data-sp="0.6">🐢 Slow</button><button class="btn alt" data-sp="1">🐇 Fast</button><button class="btn alt" data-sp="1.4">🚀 Super fast</button></div>
      <div class="row"><button class="btn leaf" id="twSaid">🎤 I said it!</button><span class="en-tries" id="twDots">⚪⚪⚪</span></div>
      <div class="cheer" id="cheer" aria-live="polite"></div>
      <div class="row" id="twNext"></div>${ptip('play')}`;
    wireBack(twisterHome);
    wireTapWords(view);
    sayScreen(t);
    view.querySelectorAll('[data-sp]').forEach(b => b.onclick = () => { const r = +b.dataset.sp; talk([t], r); glow('#twText', r, nav); $('.en-twe').classList.remove('wob'); void $('.en-twe').offsetWidth; $('.en-twe').classList.add('wob'); });
    $('#twSaid').onclick = () => {
      if (said >= 3) return;
      said++; tone([500 + said * 120], .08); $('#twDots').textContent = '🟢'.repeat(said) + '⚪'.repeat(3 - said);
      if (said < 3) { say(said === 1 ? 'Good! Now a bit faster!' : 'Faster! One more time!'); return; }
      const e = W(), fresh = !e.tw[i]; e.tw[i] = 1; save();
      if (fresh) { give(2); confetti(50); }
      yay(); $('#cheer').textContent = fresh ? 'Twister champion! ⭐⭐' : 'Great tongue workout!';
      say(fresh ? 'Twister champion! Your tongue is super strong!' : 'Great tongue workout!');
      const nx = EN_TWISTERS.findIndex((x, k) => k > i && open(x[2]));
      $('#twNext').innerHTML = `${nx >= 0 ? '<button class="btn leaf" id="twGo">Next twister ▶</button>' : ''}<button class="btn alt" id="twAll">All twisters</button>`;
      if (nx >= 0) $('#twGo').onclick = () => go(twister, nx);
      $('#twAll').onclick = () => go(twisterHome);
    };
  }

  /* --- Listen & tap --- */
  function listenSpec() {
    return { id: 'listen', title: '👂 Listen & tap', back: () => go(playHome), tip: 'play', gen() {
      const mt = maxTier(), pool = EN_ALLWORDS.filter(x => tierOf(x) <= mt), x = pick(pool), opts = picChoices(x, stage() >= 3 ? 3 : 2), v = voice();
      return { prompt: v ? 'Listen! Tap the picture you hear.' : `Tap the picture: <b>${esc(x.w)}</b>`, say: `Listen: ${x.w}. Tap ${x.w}.`, visual: '<div class="en-ear" aria-hidden="true">👂</div>', rv: { w: x.w, e: x.e },
        choices: opts.map(o => ({ html: o.e, val: o.w, say: o.w })), answer: x.w, explain: `Listen again: ${x.w}. ${x.e} is ${x.w}.` };
    } };
  }

  /* --- wiring into the English area --- */
  SECTIONS.push(
    { id: 'play', ico: '🎨', name: 'Word play', sub: 'Spell, rhyme, make stories, tongue twisters', fn: () => playHome(), c: '#C2410C',
      tip: 'Play along: take turns in Story maker, or race each other on a tongue twister. Laughing together builds readers.' },
    { id: 'mywords', ico: '🏅', name: 'My words', get sub() { return `Word of the day, review, ${collected().length} words collected`; }, fn: () => myWords(), c: '#8A5A00',
      tip: 'Words your child misses come back today, then in 1 and 3 days. A few minutes of review each day helps words stick for good.' }
  );
  Object.assign(VIEWS, { wordplay: playHome, mywords: myWords, wotd, review: startReview, spell, maker: storyMaker, tale, rhyme: () => quiz(rhymeSpec()), describe: () => quiz(describeSpec()),
    safari, twisters: twisterHome, twister, listen: () => quiz(listenSpec()) });
  // The home page gets a "word of the day" strip and, when words are due, an "Owl's review" strip.
  englishHome.after = v => {
    const nx = v.querySelector('#enNext'); if (!nx) return;
    const e = W(), x = wotdWord(), done = e.wotd.last === today(), due = dueList().length, box = document.createElement('div');
    box.className = 'en-today';
    box.innerHTML = `<button class="en-wotdc${done ? ' done' : ''}" id="enWotd"><span class="en-wsun" aria-hidden="true">☀️</span><span><b>Word of the day</b>${done ? `✅ ${x.e} ${esc(x.w)}` : 'A new word is waiting!'}</span><span class="en-fire">🔥 ${streakNow()}</span></button>
      ${due ? `<button class="en-revc" id="enRev"><span class="en-sico">🔁</span><span><b>Owl's review</b>${due} word${due > 1 ? 's' : ''} to practice</span></button>` : ''}`;
    nx.parentNode.insertBefore(box, nx);
    box.querySelector('#enWotd').onclick = () => go(wotd);
    const r = box.querySelector('#enRev'); if (r) r.onclick = () => go(startReview);
  };
  englishHome.more = b => ({ ...b, games: b.games + PLAY.length + 2, wordplay: PLAY.length, twisters: EN_TWISTERS.length, rhymes: EN_RHYMES.length,
    tales: EN_TALE.heroes.length * EN_TALE.places.length * EN_TALE.problems.length, bigwords: EN_ALLWORDS.filter(x => x.t === 3).length });
  if (location.hash === '#selftest' && window.__english) Object.defineProperties(window.__english, Object.getOwnPropertyDescriptors({
    W, wotdWord, dueList, collected, syllables, makeTale, spellPool, safariPool, heroes, streakNow, picChoices, describeSpec, rhymeSpec, listenSpec, PLAY,
    get SP() { return SP; }, get SF() { return SF; }, get TM() { return TM; }
  }));
  Object.assign(window.__english ? window.__english.data : {}, { EN_ALLWORDS, EN_TWISTERS, EN_RHYMES, EN_TALE, EN_DESC });
})();
