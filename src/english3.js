/* ---------- English & Reading, part 3: the screens ---------- */
// A reading ladder of 5 stages. A stage is open when the child's age reaches it, or when enough reading stars are
// earned (st.english.xp), or "Open every world" is on. Every star here is also a normal star (st.stars), so it counts
// for stickers, badges, the owl and My World. Progress lives inside the player's state (st.english), so it is saved,
// backed up and removed with the player like everything else.
const englishHome = (() => {
  const STAGES = [
    { n: 1, ico: '🌱', name: 'Sound Seeds', ages: '4–5', need: 0, about: 'letter sounds, blending 3-letter words, first sight words' },
    { n: 2, ico: '🧱', name: 'Word Builders', ages: '5–6', need: 25, about: 'letter blends, more sight words, grammar basics, fun talk' },
    { n: 3, ico: '🧭', name: 'Sentence Explorers', ages: '6–7', need: 70, about: 'magic e, vowel teams, punctuation, past tense, funny sayings' },
    { n: 4, ico: '📖', name: 'Story Readers', ages: '7–8', need: 140, about: 'longer stories, short words, comparing, joining words' },
    { n: 5, ico: '🧙', name: 'Word Wizards', ages: '9+', need: 240, about: 'sound-alike words, word parts, adverbs, harder stories' }
  ];
  const E = () => {
    const e = st.english = st.english || {};
    e.xp = e.xp || 0; e.heard = e.heard || {}; e.sight = e.sight || {}; e.stories = e.stories || {}; e.rounds = e.rounds || {}; e.best = e.best || {};
    return e;
  };
  const ageStage = a => a <= 5 ? 1 : a === 6 ? 2 : a === 7 ? 3 : a <= 9 ? 4 : 5;
  const open = s => st.unlockAll || s <= ageStage(st.age) || E().xp >= STAGES[s - 1].need;
  const stage = () => [5, 4, 3, 2, 1].find(open);
  const lockText = s => `This opens at Stage ${s}, ${STAGES[s - 1].name}. Earn ${Math.max(1, STAGES[s - 1].need - E().xp)} more reading stars to get there!`;
  const lockTag = s => `<span class="en-lock">🔒 Stage ${s}</span>`;
  const plain = h => String(h).replace(/<[^>]+>/g, '');

  // Speak several bits in a row (sounds, then the word). Quietly does nothing when there is no voice.
  function talk(parts, rate = 0.75) {
    if (!st.speak || !('speechSynthesis' in window)) return;
    try { speechSynthesis.cancel(); parts.forEach(t => { const u = new SpeechSynthesisUtterance(speakable(t)); u.rate = rate; u.pitch = 1.15; speechSynthesis.speak(u); }); } catch (e) {}
  }
  // Every reading star is a real star; crossing a stage line says so.
  function give(n) {
    const before = stage(); E().xp += n; addStars(n);
    const after = stage();
    if (after > before) { const S = STAGES[after - 1]; setTimeout(() => toast(`New reading stage: ${S.ico} ${S.name}!`), 600); confetti(40); }
  }

  const SECTIONS = [
    { id: 'phonics', ico: '🔤', name: 'Letter sounds', sub: 'Tap a letter to hear its sound', fn: () => phonics('letters'), c: '#C44E40' },
    { id: 'blend', ico: '🧩', name: 'Blend it', sub: 'c-a-t makes cat!', fn: () => blendGame(), c: '#B05F1E' },
    { id: 'sight', ico: '👀', name: 'Sight words', sub: 'Words to know at a glance', fn: () => sightHome(), c: '#2776C3' },
    { id: 'read', ico: '📖', name: 'Read', sub: 'Words, sentences and stories', fn: () => readHome(), c: '#268457' },
    { id: 'build', ico: '🏗️', name: 'Sentence builder', sub: 'Put the words in order', fn: () => buildGame(), c: '#5B44C0' },
    { id: 'grammar', ico: '📐', name: 'Grammar games', sub: `${EN_GAMES.length} word games`, fn: () => grammarHome(), c: '#1D7C82' },
    { id: 'vocab', ico: '🗂️', name: 'Word book', sub: `${EN_VOCAB.reduce((a, t) => a + t.words.length, 0)} words in ${EN_VOCAB.length} topics`, fn: () => vocab(), c: '#A23E78' },
    { id: 'say', ico: '💬', name: 'Say it!', sub: 'Everyday words, fun talk, funny sayings', fn: () => sayings(), c: '#22305A' },
    { id: 'fun', ico: '🎪', name: 'Fun games', sub: 'Pop bubbles, feed the monster, dig for treasure', fn: () => funHome(), c: '#7A3FB8' }
  ];
  // Word pals: a little friend pops out of the book after every finished round, and joins the reading club.
  const PALS = [['🦄', 'Sparkle the unicorn'], ['🐲', 'Puff the dragon'], ['🦖', 'Rexy the dinosaur'], ['🐙', 'Inky the octopus'], ['🐼', 'Bao the panda'], ['🦊', 'Rusty the fox'],
    ['🐧', 'Pip the penguin'], ['🐸', 'Hopper the frog'], ['🐝', 'Buzz the bee'], ['🦋', 'Flutter the butterfly'], ['🐳', 'Splash the whale'], ['🐯', 'Stripes the tiger'], ['🐨', 'Cuddles the koala'],
    ['🐰', 'Bun the bunny'], ['🐵', 'Cheeky the monkey'], ['🐞', 'Dotty the ladybug'], ['🐢', 'Shelly the turtle'], ['🦁', 'Leo the lion'], ['🐿️', 'Nutty the squirrel'], ['🦔', 'Spike the hedgehog']];
  const TIPS = ['The word "the" is the most used word in English!', 'Every word has at least one vowel sound: a, e, i, o, u (and sometimes y).', 'Why did the cookie go to the doctor? It felt crummy!',
    'A sentence is a complete idea. It starts with a capital and ends with a mark.', 'What has ears but cannot hear? A corn field!', 'Reading for 10 minutes a day helps your brain grow strong.',
    'Q almost always has a U friend next to it.', 'What do you call a sleeping dinosaur? A dino-snore!', 'Can you spell your own name? Names start with a capital letter.', 'Why are fish so smart? They live in schools!'];
  function reward(title, line, again, back) {
    const e = E(); e.pals = e.pals || {};
    const fresh = PALS.filter(p => !e.pals[p[0]]), pal = pick(fresh.length && Math.random() < 0.8 ? fresh : PALS), isNew = !e.pals[pal[0]];
    e.pals[pal[0]] = (e.pals[pal[0]] || 0) + 1; save(); confetti(); tone([523, 659, 784, 1046], .1);
    view.innerHTML = `<div class="view done en-reward"><div class="en-rbook" aria-hidden="true"><span class="en-rpal">${pal[0]}</span><span class="en-rb">📖</span></div>
      <h1>${title}</h1><p style="font-weight:800;font-size:22px">${line}</p>
      <p class="en-rnew">${isNew ? `New word pal! <b>${pal[1]}</b> joins your reading club.` : `<b>${pal[1]}</b> came back to cheer for you!`} (${Object.keys(e.pals).length}/${PALS.length})</p>
      <div class="row"><button class="btn leaf" id="enAgain">Play again</button><button class="btn alt" id="enBack">Back</button></div></div>`;
    say(`${title} ${line.replace(/⭐/g, 'stars')} ${isNew ? `${pal[1]} pops out of the book and joins your reading club!` : `${pal[1]} came back to cheer!`}`);
    $('#enAgain').onclick = again; $('#enBack').onclick = back;
  }
  const SEC = Object.fromEntries(SECTIONS.map(s => [s.id, s]));

  // The "next up" card: what a reader at this stage should try next.
  function nextUp() {
    const s = stage(), e = E();
    if (Object.keys(e.heard).filter(k => k.length === 1).length < 26) return { ico: '🔤', title: 'Letter sounds', text: 'Tap every letter and hear its sound', go: () => go(phonics, 'letters') };
    if ((e.rounds.blend || 0) < 2) return { ico: '🧩', title: 'Blend it', text: 'Sound out little words', go: () => go(blendGame) };
    const set = EN_SIGHT.filter(x => x.stage <= s).find(x => x.words.some(w => !e.sight[w]));
    if (set && (e.rounds['sight-' + set.id] || 0) < 2) return { ico: set.ico, title: `Sight words: ${set.name}`, text: 'Find the word you hear', go: () => go(sightFind, set.id) };
    const story = EN_STORIES.find(x => x.stage <= s && !e.stories[x.id]);
    if (story) return { ico: story.ico, title: `Story: ${story.title}`, text: 'Read it, then answer 3 questions', go: () => go(storyRead, story.id, 0) };
    const g = EN_GAMES.find(x => x.stage <= s && !e.rounds['g-' + x.id]) || pick(EN_GAMES.filter(x => x.stage <= s));
    return { ico: g.ico, title: g.name, text: 'A grammar game', go: () => go(grammarGame, g.id) };
  }

  function enHome() {
    const s = stage(), S = STAGES[s - 1], N = STAGES[s], e = E();
    const pct = N ? Math.round(Math.min(1, Math.max(0, (e.xp - S.need) / (N.need - S.need))) * 100) : 100;
    const nx = nextUp();
    view.innerHTML = `${crumbs('📚 English & Reading')}
      <div class="en-ladder"><span class="en-lico">${S.ico}</span><div><b>Stage ${s}: ${S.name}</b><span class="note">${S.about}</span>
        <span class="meter" aria-label="${pct}% to the next stage"><i style="width:${pct}%"></i></span>
        <span class="note">${N ? `⭐ ${e.xp} reading stars · Stage ${s + 1} ${N.ico} at ${N.need}` : `⭐ ${e.xp} reading stars · top stage!`}</span></div></div>
      <button class="pick" id="enNext"><span class="big">${nx.ico}</span><span><b>${esc(nx.title)}</b>${esc(nx.text)}</span></button>
      <div class="en-secs">${SECTIONS.map(x => `<button class="en-sec" data-sec="${x.id}" style="background:${x.c}"><span class="en-sico">${x.ico}</span><b>${x.name}</b><span>${x.sub}</span></button>`).join('')}</div>
      <div class="en-hoot"><span class="en-owl" aria-hidden="true">🦉</span><div class="en-bub">${esc(pick(TIPS))}</div></div>
      ${Object.keys(e.pals || {}).length ? `<div class="en-club"><b>Reading club</b>${PALS.map(p => (e.pals || {})[p[0]] ? `<span title="${p[1]}">${p[0]}</span>` : '').join('')}</div>` : ''}
      <div class="en-stages">${STAGES.map(x => `<span class="en-st${open(x.n) ? ' on' : ''}${x.n === s ? ' now' : ''}" title="${x.name}">${open(x.n) ? x.ico : '🔒'}<small>${x.n}</small></span>`).join('')}</div>`;
    wireBack(home);
    sayScreen(`English and reading. You are at stage ${s}, ${S.name}. Try ${nx.title}!`);
    $('#enNext').onclick = nx.go;
    view.querySelectorAll('[data-sec]').forEach(b => b.onclick = () => go(SEC[b.dataset.sec].fn));
  }

  /* --- a round of questions (used by every game) --- */
  let Q = null;
  function quiz(spec) { Q = { ...spec, spec, n: spec.list ? spec.list.length : spec.n || 6, i: 0, first: 0, stars: 0, used: new Set() }; ask(); }
  function ask() {
    const nav = navId; let q;
    if (Q.list) q = Q.list[Q.i];
    else { for (let t = 0; t < 15; t++) { q = Q.gen(); if (!Q.used.has(plain(q.prompt) + q.answer)) break; } Q.used.add(plain(q.prompt) + q.answer); }
    Q.q = q; let tries = 0, done = false;
    const long = q.choices.some(c => plain(c.html).length > 14), cols = long ? 1 : q.choices.length === 4 ? 2 : q.choices.length;
    view.innerHTML = `${crumbs(Q.title)}
      <div class="progress">${Array.from({ length: Q.n }, (_, i) => `<i class="${i < Q.i ? 'done' : i === Q.i ? 'now' : ''}"></i>`).join('')}</div>
      <div class="qcard en-q">
        <div class="prompt"><div class="ptext">${q.prompt}</div><button class="speak" id="spk" aria-label="Read it to me">🔊</button></div>
        ${q.visual ? `<div class="visual">${q.visual}</div>` : ''}
        <div class="choices en-ch${Q.cls ? ' ' + Q.cls : ''}" style="grid-template-columns:repeat(${cols},1fr)">${q.choices.map((c, i) => `<button class="choice${c.txt ? ' txt' : ''}" data-i="${i}" aria-label="${esc(c.say != null ? c.say : plain(c.html))}">${c.html}</button>`).join('')}</div>
        <div class="cheer" id="cheer" aria-live="polite"></div><div id="exp" style="width:100%"></div>
      </div>`;
    wireBack(Q.back);
    const speak = () => q.onShow ? q.onShow(nav) : say(q.say || plain(q.prompt));
    $('#spk').onclick = speak;
    speak();
    view.querySelectorAll('.choice').forEach(b => b.onclick = () => {
      if (b.disabled || done || nav !== navId) return;
      const c = q.choices[+b.dataset.i];
      if (String(c.val) === String(q.answer)) {
        done = true; const first = tries === 0, earned = first ? 2 : 1;
        b.classList.add('right'); view.querySelectorAll('.choice').forEach(x => x.disabled = true);
        Q.stars += earned; if (first) { Q.first++; questTick('firsttry'); }
        if (Q.onRight) Q.onRight(q, first, b);
        give(earned);
        const w = first ? pick(['Great reading!', 'You got it!', 'Super!', 'Yes!', 'Brilliant!']) : 'Now you know it!';
        $('#cheer').textContent = w + ' ⭐'.repeat(earned); yay(); say(w);
        setTimeout(() => { if (nav !== navId) return; Q.i++; Q.i < Q.n ? ask() : finish(); }, first ? 1300 : 2100);
      } else {
        tries++; b.classList.add('wrong'); b.disabled = true; oops();
        $('#exp').innerHTML = `<div class="explain"><p>${esc(q.explain || 'Try another one!')}</p></div>`;
        say(q.explain || 'Try another one!');
      }
    });
  }
  function finish() {
    const e = E(), id = Q.id, spec = Q.spec;
    e.rounds[id] = (e.rounds[id] || 0) + 1; e.best[id] = Math.max(e.best[id] || 0, Q.first);
    if (Q.done) Q.done(Q);
    save();
    reward(Q.first >= Q.n - 1 ? 'Amazing reading!' : 'Well done!', `You got ${Q.first} of ${Q.n} on the first try and earned ${Q.stars} ⭐`, () => go(quiz, spec), spec.back);
  }

  /* --- letter sounds --- */
  const PH_TABS = [
    { id: 'letters', name: 'Letters', stage: 1, list: () => EN_LETTERS.map(([l, s, w, e]) => ({ k: l, big: l.toUpperCase() + l, s, w, e, tip: `The letter ${l.toUpperCase()} says ${s}.` })) },
    { id: 'pairs', name: 'Letter pairs', stage: 1, list: () => EN_DIGRAPHS.map(([l, s, w, e, tip]) => ({ k: l, big: l, s, w, e, tip })) },
    { id: 'magic', name: 'Magic e', stage: 2, list: () => EN_MAGIC.map(([l, s, w, e, tip]) => ({ k: l, big: l.replace('_', '‿'), s, w, e, tip })) },
    { id: 'teams', name: 'Vowel teams', stage: 2, list: () => EN_TEAMS.map(([l, s, w, e]) => ({ k: l + ':' + w, big: l, s, w, e, tip: `${l.toUpperCase().split('').join(' ')} together say ${s}.` })) }
  ];
  function phonics(tab) {
    const T = PH_TABS.find(t => t.id === tab) || PH_TABS[0], items = T.list(), e = E();
    view.innerHTML = `${crumbs('🔤 Letter sounds')}
      <div class="en-tabs" role="tablist">${PH_TABS.map(t => `<button class="en-tab${t.id === T.id ? ' on' : ''}" data-tab="${t.id}" role="tab" aria-selected="${t.id === T.id}">${open(t.stage) ? '' : '🔒 '}${t.name}</button>`).join('')}</div>
      <div class="en-games">
        <button class="en-gbtn" id="enSong">🎵 Sound song</button>
        <button class="en-gbtn" id="enFirst">🎯 First sounds game</button>
        <button class="en-gbtn${open(3) ? '' : ' locked'}" id="enMagic">✨ Magic e game${open(3) ? '' : ' 🔒'}</button>
        <button class="en-gbtn${open(3) ? '' : ' locked'}" id="enTeams">🧪 Vowel team game${open(3) ? '' : ' 🔒'}</button></div>
      <p class="note">${open(T.stage) ? 'Tap a card to hear its sound.' : lockText(T.stage)}</p>
      <div class="en-ph${open(T.stage) ? '' : ' dim'}">${items.map((x, i) => `<button class="en-pt${e.heard[x.k] ? ' heard' : ''}" data-ph="${i}" aria-label="${esc(x.big)}, ${esc(x.w)}"><b>${x.big}</b><span class="en-pe">${x.e}</span><small>${x.w}</small></button>`).join('')}</div>`;
    wireBack(enHome);
    sayScreen(`${T.name}. Tap a card to hear its sound.`);
    view.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => go(phonics, b.dataset.tab));
    view.querySelectorAll('[data-ph]').forEach(b => b.onclick = () => {
      if (!open(T.stage)) { say(lockText(T.stage)); return; }
      const x = items[+b.dataset.ph];
      view.querySelectorAll('.en-pt.lit').forEach(o => o.classList.remove('lit'));
      b.classList.add('lit', 'heard'); E().heard[x.k] = 1; save(); tone([660 + (+b.dataset.ph % 8) * 40], 0.08);
      talk([`${x.tip}`, `${x.s}, ${x.s}, ${x.w}.`], 0.85);
    });
    $('#enFirst').onclick = () => go(quiz, firstSoundSpec());
    $('#enSong').onclick = () => open(T.stage) ? chant(items, T.id) : say(lockText(T.stage));
    $('#enMagic').onclick = () => open(3) ? go(quiz, magicSpec()) : say(lockText(3));
    $('#enTeams').onclick = () => open(3) ? go(quiz, teamSpec()) : say(lockText(3));
  }
  const GROUP = l => 'ckq'.includes(l) ? 'k' : l;
  function firstSoundSpec() {
    return { id: 'first', title: '🎯 First sounds', back: () => go(phonics, 'letters'), gen() {
      const pool = EN_LETTERS.filter(l => l[0] !== 'x'), L = pick(pool);
      const others = shuffle(pool.filter(o => GROUP(o[0]) !== GROUP(L[0]))).slice(0, 2);
      const opts = shuffle([L, ...others]);
      return { prompt: `Which picture starts with <b>${L[0]}</b>?`, say: `Which picture starts with ${L[1]}? ${L[1]}.`, visual: `<div class="en-letter">${L[0].toUpperCase()}${L[0]}</div>`,
        choices: opts.map(o => ({ html: o[3], val: o[2], say: o[2] })), answer: L[2], explain: `${L[2]} starts with ${L[1]}. ${L[1]}, ${L[2]}!` };
    } };
  }
  function magicSpec() {
    return { id: 'magic', title: '✨ Magic e', back: () => go(phonics, 'magic'), gen() {
      const [a, ea, b, eb] = pick(EN_MAGIC_PAIRS), other = pick(EN_MAGIC_PAIRS.filter(p => p[0] !== a));
      return { prompt: `${a} + e = ?`, say: `This word says ${a}. Add a magic e. What does it say now?`, visual: `<div class="en-magic"><span>${a}</span><b>+e</b></div>`,
        choices: shuffle([[b, eb], [a, ea], [other[2], other[3]]]).map(([w, e]) => ({ html: e, val: w, say: w })), answer: b,
        explain: `${a} plus magic e makes ${b}. The e is quiet, and makes the vowel say its name.` };
    } };
  }
  function teamSpec() {
    return { id: 'teams', title: '🧪 Vowel teams', back: () => go(phonics, 'teams'), gen() {
      const [t, s, w, e] = pick(EN_TEAMS), wrong = shuffle([...new Set(EN_TEAMS.map(x => x[0]).filter(x => x !== t && !w.includes(x)))]).slice(0, 2);
      return { prompt: `${esc(w.replace(t, '__'))}`, say: `Which letters finish the word ${w}?`, visual: `<div class="en-pic">${e}</div>`,
        choices: enTxt([t, ...wrong]), answer: t, explain: `${w} is spelled ${w.split('').join(' ')}. ${t} says ${s}.` };
    } };
  }

  /* --- blending --- */
  function blendGame() { go(quiz, blendSpec()); }
  function blendSpec() {
    return { id: 'blend', title: '🧩 Blend it', back: () => go(enHome), gen() {
      const s = stage(), pool = EN_BLEND.filter(b => b.stage <= Math.min(2, s)), B = pick(pool);
      const others = shuffle(pool.filter(x => x.w !== B.w)).slice(0, 2);
      return { prompt: 'Blend the sounds. Which picture is it?', word: B.w, parts: B.parts,
        visual: `<div class="en-blend" id="enBlend">${B.parts.map((p, i) => `<span class="en-snd" data-sn="${i}">${p}</span>`).join('')}<span class="en-bw">${B.w}</span></div>`,
        choices: shuffle([B, ...others]).map(o => ({ html: o.e, val: o.w, say: o.w })), answer: B.w,
        explain: `${B.parts.map(p => EN_SND[p]).join(', ')}... ${B.w}! Say the sounds faster and faster.`,
        onShow(nav) {
          const box = document.getElementById('enBlend'); if (!box) return;
          box.classList.remove('joined'); box.querySelectorAll('.en-snd').forEach(x => x.classList.remove('lit'));
          talk(['Listen.', ...B.parts.map(p => EN_SND[p]), B.w], 0.7);
          B.parts.forEach((p, i) => setTimeout(() => { if (nav !== navId || !box.isConnected) return; const sp = box.querySelector(`[data-sn="${i}"]`); if (sp) sp.classList.add('lit'); }, 500 + i * 800));
          setTimeout(() => { if (nav === navId && box.isConnected) box.classList.add('joined'); }, 500 + B.parts.length * 800 + 300);
        } };
    } };
  }

  /* --- sight words --- */
  function sightHome() {
    const e = E();
    view.innerHTML = `${crumbs('👀 Sight words')}
      <p class="note">These words show up in almost every book. Many can't be sounded out, so we learn them by heart.</p>
      <div class="en-list">${EN_SIGHT.map(x => { const k = x.words.filter(w => e.sight[w]).length;
        return `<button class="en-row${open(x.stage) ? '' : ' locked'}" data-set="${x.id}"><span class="en-rico">${open(x.stage) ? x.ico : '🔒'}</span><span><b>${x.name}</b><small>${x.words.length} words · ${k} known</small></span>${open(x.stage) ? `<span class="meter"><i style="width:${Math.round(k / x.words.length * 100)}%"></i></span>` : lockTag(x.stage)}</button>`; }).join('')}</div>`;
    wireBack(enHome);
    sayScreen('Sight words. Pick a set.');
    view.querySelectorAll('[data-set]').forEach(b => b.onclick = () => { const x = EN_SIGHT.find(s => s.id === b.dataset.set); open(x.stage) ? go(sightSet, x.id) : say(lockText(x.stage)); });
  }
  function sightSet(id) {
    const x = EN_SIGHT.find(s => s.id === id), e = E();
    view.innerHTML = `${crumbs(`${x.ico} ${x.name} words`)}
      <div class="en-games"><button class="en-gbtn" id="enFlash">🃏 Flash cards</button><button class="en-gbtn" id="enFind">🔎 Find the word</button></div>
      <p class="note">Tap a word to hear it. A ✓ means you found it on the first try.</p>
      <div class="en-words">${x.words.map(w => `<button class="en-wc${e.sight[w] ? ' known' : ''}" data-w="${esc(w)}">${esc(w)}${e.sight[w] ? '<i>✓</i>' : ''}</button>`).join('')}</div>`;
    wireBack(sightHome);
    sayScreen(`${x.name} words. Tap a word to hear it.`);
    view.querySelectorAll('[data-w]').forEach(b => b.onclick = () => say(b.dataset.w));
    $('#enFlash').onclick = () => go(flash, id, 0);
    $('#enFind').onclick = () => go(sightFind, id);
  }
  function flash(id, i, order) {
    const x = EN_SIGHT.find(s => s.id === id), e = E();
    order = order || shuffle(x.words).slice(0, 10);
    if (i >= order.length) {
      view.innerHTML = `<div class="view done"><div class="big">🃏</div><h1>All done!</h1><p style="font-weight:800;font-size:22px">You know ${x.words.filter(w => e.sight[w]).length} of ${x.words.length} ${x.name} words.</p>
        <div class="row"><button class="btn leaf" id="enFind">🔎 Find the word game</button><button class="btn alt" id="enBack">Back</button></div></div>`;
      say('All done! Now play find the word to win stars.');
      $('#enFind').onclick = () => go(sightFind, id); $('#enBack').onclick = () => go(sightSet, id);
      return;
    }
    const w = order[i];
    view.innerHTML = `${crumbs('🃏 Flash cards')}<div class="progress">${order.map((_, k) => `<i class="${k < i ? 'done' : k === i ? 'now' : ''}"></i>`).join('')}</div>
      <button class="en-flash" id="enCard" aria-label="Hear the word">${esc(w)}</button>
      <div class="row"><button class="btn alt" id="enHear">🔊 Hear it</button><button class="btn leaf" id="enKnow">✅ I know it</button><button class="btn alt" id="enNot">🔁 Not yet</button></div>`;
    wireBack(() => go(sightSet, id));
    say('Can you read this word?');
    const hear = () => say(w);
    $('#enCard').onclick = hear; $('#enHear').onclick = hear;
    $('#enKnow').onclick = () => { say(w + '! Yes!'); tone([660, 880], .08); go(flash, id, i + 1, order); };
    $('#enNot').onclick = () => { say(`This word says ${w}. ${w}.`); const o = order.slice(); o.push(w); go(flash, id, i + 1, o.length > 16 ? order : o); };
  }
  function sightFind(id) {
    const x = EN_SIGHT.find(s => s.id === id);
    quiz({ id: 'sight-' + id, title: `🔎 Find the word`, back: () => go(sightSet, id),
      gen() { const e = E(), fresh = x.words.filter(w => !e.sight[w]), w = pick(fresh.length && Math.random() < 0.75 ? fresh : x.words);
        const near = shuffle(x.words.filter(o => o !== w)).sort((a, b) => Math.abs(a.length - w.length) - Math.abs(b.length - w.length) || (a[0] === w[0] ? -1 : 1)).slice(0, 3);
        return { prompt: 'Tap the word you hear.', say: `Find the word: ${w}. ${w}.`, visual: '<div class="en-pic">👂</div>', choices: enTxt([w, ...near]), answer: w, explain: `This one says ${w}. Look for it again!` }; },
      onRight(q, first) { if (first) E().sight[q.answer] = 1; } });
  }

  /* --- reading --- */
  function readHome() {
    const s = stage(), e = E();
    view.innerHTML = `${crumbs('📖 Read')}
      <div class="en-games"><button class="en-gbtn" id="enRW">🔤 Read &amp; match words</button><button class="en-gbtn" id="enRS">📝 Read sentences</button><button class="en-gbtn" id="enSilly">🤪 Silly sentences</button></div>
      <h3 class="section-title">Stories <span class="tag">${Object.keys(e.stories).length}/${EN_STORIES.length} read</span></h3>
      <div class="en-stories">${EN_STORIES.map(x => `<button class="en-story${open(x.stage) ? '' : ' locked'}" data-story="${x.id}"><span class="en-sico">${open(x.stage) ? x.ico : '🔒'}</span><b>${esc(x.title)}</b><small>Stage ${x.stage}${e.stories[x.id] ? ' · ✅ read' : ''}</small></button>`).join('')}</div>`;
    wireBack(enHome);
    sayScreen('Read! Pick a word game, a sentence game or a story.');
    $('#enRW').onclick = () => go(quiz, readWordSpec());
    $('#enRS').onclick = () => go(quiz, readSentSpec());
    $('#enSilly').onclick = () => go(quiz, sillySpec());
    view.querySelectorAll('[data-story]').forEach(b => b.onclick = () => { const x = EN_STORIES.find(t => t.id === b.dataset.story); open(x.stage) ? go(storyRead, x.id, 0) : say(lockText(x.stage)); });
  }
  function readWordSpec() {
    return { id: 'readword', title: '🔤 Read & match', back: () => go(readHome), gen() {
      const s = stage(); let pool = EN_BLEND.filter(b => b.stage <= Math.min(2, s)).map(b => ({ w: b.w, e: b.e }));
      if (s >= 3) pool = pool.concat(EN_VOCAB.flatMap(t => t.words).filter(x => !/ /.test(x.w) && x.w.length <= 8));
      const W = pick(pool), others = shuffle(pool.filter(x => x.w !== W.w && x.e !== W.e)).slice(0, 2);
      return { prompt: 'Read the word. Which picture is it?', say: 'Read the word. Then tap its picture.', visual: `<div class="en-word">${esc(W.w)}</div>`,
        choices: shuffle([W, ...others]).map(o => ({ html: o.e, val: o.w, say: o.w })), answer: W.w, explain: `This word says ${W.w}.` };
    } };
  }
  const tapWords = s => s.split(' ').map(w => `<button class="en-tw" data-tw="${esc(w.replace(/[^\w'-]/g, ''))}">${esc(w)}</button>`).join(' ');
  function wireTapWords(root) { root.querySelectorAll('[data-tw]').forEach(b => b.onclick = () => { root.querySelectorAll('.en-tw.lit').forEach(o => o.classList.remove('lit')); b.classList.add('lit'); say(b.dataset.tw); }); }
  function readSentSpec() {
    return { id: 'readsent', title: '📝 Read sentences', back: () => go(readHome), gen() {
      const s = stage(), pool = EN_SENTENCES.filter(x => x.stage <= s), S = pick(pool), others = shuffle(EN_SENTENCES.filter(x => x.e !== S.e)).slice(0, 2);
      return { prompt: 'Read it. Which picture matches?', say: 'Read the sentence. Tap a word if you need help. Which picture matches?', visual: `<div class="en-sent">${tapWords(S.s)}</div>`,
        choices: shuffle([S, ...others]).map(o => ({ html: o.e, val: o.s, say: 'this picture' })), answer: S.s, explain: `It says: ${S.s}`,
        onShow() { wireTapWords(view); say('Read the sentence. Tap a word if you need help. Which picture matches?'); } };
    } };
  }
  function storyRead(id, p) {
    const x = EN_STORIES.find(t => t.id === id), pg = x.pages[p], last = p === x.pages.length - 1;
    view.innerHTML = `${crumbs(`${x.ico} ${esc(x.title)}`)}
      <div class="progress">${x.pages.map((_, k) => `<i class="${k < p ? 'done' : k === p ? 'now' : ''}"></i>`).join('')}</div>
      <div class="en-page"><div class="en-pic big">${pg[0]}</div><p class="en-sent">${tapWords(pg[1])}</p></div>
      <p class="note">Tap a word to hear it. Try reading it yourself first!</p>
      <div class="row"><button class="btn alt" id="enPrev"${p ? '' : ' disabled'}>◀ Back</button><button class="btn alt" id="enRead">🔊 Read to me</button><button class="btn leaf" id="enNextP">${last ? 'Questions ▶' : 'Next ▶'}</button></div>`;
    wireBack(() => go(readHome));
    screenText = pg[1];
    if (p === 0) say(`${x.title}. Tap a word if you need help.`);
    wireTapWords(view);
    $('#enRead').onclick = () => talk([pg[1]], 0.8);
    $('#enPrev').onclick = () => { if (p) go(storyRead, id, p - 1); };
    $('#enNextP').onclick = () => last ? go(quiz, storyQuizSpec(id)) : go(storyRead, id, p + 1);
  }
  function storyQuizSpec(id) {
    const x = EN_STORIES.find(t => t.id === id);
    return { id: 'story-' + id, title: `${x.ico} ${esc(x.title)}`, back: () => go(readHome),
      list: x.qs.map(([q, a, b, c]) => ({ prompt: esc(q), say: `${q} ${shuffle([a, b, c]).join(', or ')}?`, choices: enTxt([a, b, c]), answer: a, explain: `Look back at the story. The answer is: ${a}.` })),
      done(R) { E().stories[id] = Math.max(E().stories[id] || 0, R.first + 1); } };
  }

  /* --- sentence builder --- */
  let B = null;
  function parseSent(s) {
    const m = s.match(/^(.*?)([.?!])$/), words = m[1].split(' ');
    const toks = words.map((w, i) => { const bare = w.replace(/,$/, ''), proper = EN_NAMES.includes(bare); return { low: w.toLowerCase(), show: i === 0 && !proper ? w.toLowerCase() : w, proper }; });
    return { s, words, mark: m[2], toks };
  }
  function buildGame() {
    const s = stage(), pool = EN_BUILD.filter(x => x.stage <= s), now = pool.filter(x => x.stage === s);
    const list = shuffle(now).slice(0, 3).concat(shuffle(pool.filter(x => x.stage < s)).slice(0, 2));
    while (list.length < 5) list.push(pick(pool));
    B = { list: shuffle(list).map(x => parseSent(x.s)), i: 0, stars: 0, first: 0 };
    buildRound();
  }
  function buildRound() {
    const S = B.list[B.i]; let order = shuffle(S.toks.map((_, i) => i));
    if (order.length > 2 && order.every((v, i) => v === i)) order = order.reverse();
    Object.assign(B, { cur: S, order, placed: [], mark: null, cap: false, tries: 0, done: false });
    drawBuild();
    say('Tap the words to make a sentence. Start with a capital letter, and end with a mark.');
  }
  function shown(i, pos) { const t = B.cur.toks[i]; return pos === 0 && B.cap && !t.proper ? enCap(t.show) : t.show; }
  function drawBuild(msg) {
    const S = B.cur, nav = navId;
    view.innerHTML = `${crumbs('🏗️ Sentence builder')}
      <div class="progress">${B.list.map((_, k) => `<i class="${k < B.i ? 'done' : k === B.i ? 'now' : ''}"></i>`).join('')}</div>
      <div class="en-line" id="enLine" aria-label="Your sentence">${B.placed.map((i, p) => `<button class="en-blk on" data-p="${p}">${esc(shown(i, p))}</button>`).join('')}${B.mark ? `<button class="en-blk mark on" id="enMk">${B.mark}</button>` : ''}${!B.placed.length && !B.mark ? '<span class="note">Tap the words below…</span>' : ''}</div>
      <div class="en-tray">${B.order.map(i => B.placed.includes(i) ? '' : `<button class="en-blk" data-t="${i}">${esc(S.toks[i].show)}</button>`).join('')}</div>
      <div class="en-tools">
        <button class="en-tool" id="enCap" aria-label="Capital letter">🔠 Capital</button>
        ${['.', '?', '!'].map(m => `<button class="en-tool mk${B.mark === m ? ' on' : ''}" data-m="${m}" aria-label="${{ '.': 'full stop', '?': 'question mark', '!': 'exclamation mark' }[m]}">${m}</button>`).join('')}
        <button class="en-tool" id="enUndo" aria-label="Undo">↩️</button>
      </div>
      <div class="row"><button class="btn leaf" id="enCheck">✔ Check</button><button class="btn alt" id="enHearS">🔊 Hear it</button></div>
      <div class="cheer" id="cheer" aria-live="polite">${msg || ''}</div>`;
    wireBack(enHome);
    view.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { if (B.done) return; B.placed.push(+b.dataset.t); tone([520 + B.placed.length * 40], .06); drawBuild(); say(S.toks[+b.dataset.t].low.replace(/,$/, '')); });
    view.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { if (B.done) return; const p = +b.dataset.p; B.placed.splice(p, 1); if (p === 0) B.cap = false; drawBuild(); });
    view.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { if (B.done) return; B.mark = b.dataset.m; drawBuild(); say({ '.': 'full stop', '?': 'question mark', '!': 'exclamation mark' }[B.mark]); });
    const mk = $('#enMk'); if (mk) mk.onclick = () => { if (B.done) return; B.mark = null; drawBuild(); };
    $('#enCap').onclick = () => {
      if (B.done) return;
      if (!B.placed.length) { say('Put the first word in, then tap capital.'); return; }
      if (B.cur.toks[B.placed[0]].proper) { say('That word always has a capital letter already!'); return; }
      B.cap = !B.cap; tone([880], .06); drawBuild(); say(B.cap ? 'Capital letter!' : 'Small letter.');
    };
    $('#enUndo').onclick = () => { if (B.done) return; if (B.mark) B.mark = null; else if (B.placed.length) { B.placed.pop(); if (!B.placed.length) B.cap = false; } drawBuild(); };
    $('#enHearS').onclick = () => say(B.cur.s);
    $('#enCheck').onclick = () => check(nav);
  }
  function check(nav) {
    if (B.done) return;
    const S = B.cur, want = S.toks.map(t => t.low).join(' '), got = B.placed.map(i => S.toks[i].low).join(' ');
    const firstOK = B.placed.length && (B.cap || S.toks[B.placed[0]].proper);
    let msg = '';
    if (B.placed.length < S.toks.length) msg = 'Use all the words first.';
    else if (got !== want) msg = 'The words are mixed up. Read it out loud. Does it make sense?';
    else if (!firstOK) msg = 'Great order! A sentence starts with a capital letter. Tap 🔠 Capital.';
    else if (!B.mark) msg = 'Nearly! Every sentence ends with a mark. Is it . ? or ! ?';
    else if (B.mark !== S.mark) msg = S.mark === '?' ? 'It asks something, so it needs a question mark ?' : S.mark === '!' ? 'It shows a big feeling, so it needs an exclamation mark !' : 'It tells us something, so it needs a full stop .';
    if (msg) { B.tries++; oops(); drawBuild(msg); say(msg); return; }
    B.done = true; const first = B.tries === 0, earned = first ? 2 : 1;
    B.stars += earned; if (first) { B.first++; questTick('firsttry'); }
    give(earned); yay();
    const w = first ? 'Perfect sentence!' : 'You built it!';
    view.querySelector('#enLine').classList.add('ok');
    $('#cheer').textContent = `${w} ${'⭐'.repeat(earned)}`; say(`${w} ${S.s}`);
    setTimeout(() => {
      if (nav !== navId) return;
      B.i++;
      if (B.i < B.list.length) { buildRound(); return; }
      const e = E(); e.rounds.build = (e.rounds.build || 0) + 1; e.best.build = Math.max(e.best.build || 0, B.first); save();
      reward('Super sentences!', `You built ${B.list.length} sentences and earned ${B.stars} ⭐`, () => go(buildGame), () => go(enHome));
    }, first ? 1800 : 2300);
  }

  /* --- grammar --- */
  function grammarHome() {
    const e = E();
    view.innerHTML = `${crumbs('📐 Grammar games')}
      <div class="en-gg">${EN_GAMES.map(g => `<button class="en-gt${open(g.stage) ? '' : ' locked'}" data-g="${g.id}"><span class="en-sico">${open(g.stage) ? g.ico : '🔒'}</span><b>${g.name}</b><small>Stage ${g.stage}${e.best['g-' + g.id] != null ? ` · best ${e.best['g-' + g.id]}/6` : ''}</small></button>`).join('')}</div>`;
    wireBack(enHome);
    sayScreen('Grammar games. Pick one!');
    view.querySelectorAll('[data-g]').forEach(b => b.onclick = () => { const g = EN_GAMES.find(x => x.id === b.dataset.g); open(g.stage) ? go(grammarGame, g.id) : say(lockText(g.stage)); });
  }
  function grammarGame(id) {
    const g = EN_GAMES.find(x => x.id === id);
    view.innerHTML = `${crumbs(`${g.ico} ${g.name}`)}
      <div class="lesson"><div class="lstep"><span class="n">💡</span><p>${esc(g.about)}</p><button class="speak" id="enAbout" aria-label="Read it">🔊</button></div></div>
      <div class="row"><button class="btn leaf" id="enPlay">Let's play! ▶</button></div>`;
    wireBack(grammarHome);
    sayScreen(g.about);
    $('#enAbout').onclick = () => say(g.about);
    $('#enPlay').onclick = () => go(quiz, grammarSpec(id));
  }
  const grammarSpec = id => { const g = EN_GAMES.find(x => x.id === id); return { id: 'g-' + id, title: `${g.ico} ${g.name}`, back: () => go(grammarHome), gen: () => g.gen(stage()) }; };

  /* --- word book --- */
  function vocab(tid) {
    const T = EN_VOCAB.find(t => t.id === (tid || E().vt)) || EN_VOCAB[0]; E().vt = T.id;
    view.innerHTML = `${crumbs('🗂️ Word book')}
      <div class="en-tabs scroll">${EN_VOCAB.map(t => `<button class="en-tab${t.id === T.id ? ' on' : ''}" data-topic="${t.id}">${t.ico} ${t.name}</button>`).join('')}</div>
      <div class="en-games"><button class="en-gbtn" id="enVQ">🎯 ${esc(T.name)} quiz</button></div>
      <div class="en-vg">${T.words.map((x, i) => `<button class="en-vc" data-v="${i}"><span class="en-pe">${x.e}</span><b>${esc(x.w)}</b></button>`).join('')}</div>`;
    wireBack(enHome);
    sayScreen(`${T.name}. Tap a picture to hear the word.`);
    view.querySelectorAll('[data-topic]').forEach(b => b.onclick = () => go(vocab, b.dataset.topic));
    view.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { const x = T.words[+b.dataset.v]; view.querySelectorAll('.en-vc.lit').forEach(o => o.classList.remove('lit')); b.classList.add('lit'); say(x.w); });
    $('#enVQ').onclick = () => go(quiz, vocabSpec(T.id));
  }
  function vocabSpec(tid) {
    const T = EN_VOCAB.find(t => t.id === tid);
    return { id: 'v-' + tid, title: `🎯 ${T.name}`, back: () => go(vocab, tid), gen() {
      const W = pick(T.words), others = shuffle(T.words.filter(x => x.w !== W.w && x.e !== W.e)).slice(0, 3), opts = shuffle([W, ...others]);
      if (stage() >= 3 && Math.random() < 0.5)
        return { prompt: 'What is this?', say: 'What is this? Read the words.', visual: `<div class="en-pic">${W.e}</div>`, choices: enTxt(opts.map(o => o.w)), answer: W.w, explain: `This is: ${W.w}.` };
      return { prompt: `Which one is <b>${esc(W.w)}</b>?`, say: `Which one is ${W.w}?`, visual: '', choices: opts.map(o => ({ html: o.e, val: o.w, say: o.w })), answer: W.w, explain: `${W.e} This one is ${W.w}.` };
    } };
  }

  /* --- everyday words, fun talk and funny sayings --- */
  function sayings(gid) {
    const G = EN_SAYINGS.find(g => g.id === gid) || EN_SAYINGS[0], ok = open(G.stage);
    view.innerHTML = `${crumbs('💬 Say it!')}
      <div class="en-tabs">${EN_SAYINGS.map(g => `<button class="en-tab${g.id === G.id ? ' on' : ''}" data-grp="${g.id}">${open(g.stage) ? g.ico : '🔒'} ${g.name}</button>`).join('')}</div>
      ${ok ? `<div class="en-games"><button class="en-gbtn" id="enSQ">🎯 What does it mean?</button></div>` : `<p class="note">${lockText(G.stage)}</p>`}
      <div class="en-says${ok ? '' : ' dim'}">${G.items.map(([p, e, m, ex], i) => `<button class="en-say" data-s="${i}"><span class="en-pe">${e}</span><span><b>${esc(p)}</b><span>${esc(m)}</span><i>“${esc(ex)}”</i></span></button>`).join('')}</div>`;
    wireBack(enHome);
    sayScreen(`${G.name}. Tap one to hear it.`);
    view.querySelectorAll('[data-grp]').forEach(b => b.onclick = () => go(sayings, b.dataset.grp));
    view.querySelectorAll('[data-s]').forEach(b => b.onclick = () => {
      if (!ok) { say(lockText(G.stage)); return; }
      const [p, , m, ex] = G.items[+b.dataset.s]; b.classList.add('lit'); talk([p, `That means: ${m}`, `For example: ${ex}`], 0.85);
    });
    if (ok) $('#enSQ').onclick = () => go(quiz, sayingSpec(G.id));
  }
  function sayingSpec(gid) {
    const G = EN_SAYINGS.find(g => g.id === gid);
    return { id: 's-' + gid, title: `💬 ${G.name}`, back: () => go(sayings, gid), gen() {
      const it = pick(G.items), wrong = shuffle(G.items.filter(x => x[2] !== it[2])).slice(0, 2).map(x => x[2]);
      return { prompt: `What does <b>“${esc(it[0])}”</b> mean?`, say: `What does ${it[0]} mean?`, visual: `<div class="en-pic">${it[1]}</div>`, choices: enTxt([it[2], ...wrong]), answer: it[2], explain: `${it[0]} means: ${it[2]} For example: ${it[3]}` };
    } };
  }

  /* --- the sound song: each card lights up as its line is sung --- */
  function chant(items, tab) {
    const nav = navId, tiles = [...view.querySelectorAll('[data-ph]')];
    const light = i => { if (nav !== navId) return; tiles.forEach(t => t.classList.remove('lit', 'sing')); const t = tiles[i]; if (t) { t.classList.add('lit', 'sing', 'heard'); E().heard[items[i].k] = 1; try { t.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {} } };
    const line = x => tab === 'letters' ? `${x.big[0]}, ${x.big[0]}, ${x.s}, ${x.s}, ${x.s}! ${x.big[0]} is for ${x.w}!` : `${x.big.replace('‿', ' ')} says ${x.s}, ${x.s}, ${x.w}!`;
    save(); tone([523, 587, 659, 698, 784], .12);
    const voice = st.speak && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
    if (voice) {
      try {
        speechSynthesis.cancel();
        items.forEach((x, i) => { const u = new SpeechSynthesisUtterance(speakable(line(x))); u.rate = 1; u.pitch = 1.35; u.onstart = () => light(i); speechSynthesis.speak(u); });
        const u = new SpeechSynthesisUtterance('Now you sing it too!'); u.pitch = 1.35; speechSynthesis.speak(u);
        light(0);
        return;
      } catch (e) {}
    }
    items.forEach((x, i) => setTimeout(() => light(i), i * 700));
  }

  /* --- fun games --- */
  function funHome() {
    view.innerHTML = `${crumbs('🎪 Fun games')}
      <div class="en-gg">
        <button class="en-gt en-fun" data-fun="bubbles"><span class="en-sico">🎈</span><b>Bubble pop</b><small>Pop the bubble with the sound you hear</small></button>
        <button class="en-gt en-fun" data-fun="monster"><span class="en-sico">👾</span><b>Feed Munch</b><small>Munch the monster only eats the right word</small></button>
        <button class="en-gt en-fun" data-fun="hunt"><span class="en-sico">💎</span><b>Word treasure hunt</b><small>Dig up the words Owl calls out</small></button>
        <button class="en-gt en-fun" data-fun="silly"><span class="en-sico">🤪</span><b>Silly sentences</b><small>Read a silly sentence, find its silly picture</small></button>
      </div>`;
    wireBack(enHome);
    sayScreen('Fun games! Pop bubbles, feed Munch the monster, dig for treasure, or read silly sentences.');
    view.querySelectorAll('[data-fun]').forEach(b => b.onclick = () => { const f = b.dataset.fun; f === 'hunt' ? go(hunt) : go(quiz, f === 'bubbles' ? bubbleSpec() : f === 'monster' ? monsterSpec() : sillySpec()); });
  }
  function bubbleSpec() {
    return { id: 'bubbles', title: '🎈 Bubble pop', back: () => go(funHome), cls: 'en-bubbles', gen() {
      const s = stage(), pool = s >= 2 ? EN_LETTERS.concat(EN_DIGRAPHS.slice(0, 4)) : EN_LETTERS, L = pick(pool);
      const opts = [L, ...shuffle(pool.filter(o => o[1] !== L[1] && GROUP(o[0]) !== GROUP(L[0]))).slice(0, 3)];
      return { prompt: 'Pop the bubble that makes this sound!', say: `Pop the bubble that says ${L[1]}! ${L[1]}!`, visual: '<div class="en-pic">👂🔊</div>',
        choices: shuffle(opts).map(o => ({ html: o[0], val: o[0], say: o[0] })), answer: L[0], explain: `${L[0]} says ${L[1]}, like ${L[2]}. Listen again!` };
    }, onRight(q, first, b) { b.classList.add('popped'); tone([1200, 1600], .05); } };
  }
  function monsterSpec() {
    return { id: 'monster', title: '👾 Feed Munch', back: () => go(funHome), cls: 'en-cookies', gen() {
      const s = stage(), words = EN_SIGHT.filter(x => x.stage <= s).flatMap(x => x.words), w = pick(words);
      const near = shuffle(words.filter(o => o !== w && Math.abs(o.length - w.length) <= 1)).slice(0, 3);
      while (near.length < 3) near.push(pick(words.filter(o => o !== w && !near.includes(o))));
      return { prompt: 'Munch is hungry! Feed him the word he asks for.', say: `Munch says: I want to eat the word ${w}! Yum yum, ${w}!`,
        visual: '<div class="en-mon" id="enMon"><span class="en-mface">👾</span><span class="en-mbub">🍪 Yum yum! 🔊</span></div>',
        choices: enTxt([w, ...near]), answer: w, explain: `Bleh! Munch does not want that word. He wants ${w}. ${w}!` };
    }, onRight(q, first, b) { const m = document.getElementById('enMon'); if (m) { m.classList.add('chomp'); m.querySelector('.en-mbub').textContent = 'CHOMP! Yummy!'; } b.classList.add('eaten'); } };
  }
  const SILLY = { who: [['pig', '🐷'], ['cat', '🐱'], ['dog', '🐶'], ['frog', '🐸'], ['cow', '🐮'], ['duck', '🦆'], ['bear', '🐻'], ['fox', '🦊']],
    act: [['dance', '💃'], ['sing', '🎤'], ['swim', '🏊'], ['sleep', '😴'], ['eat cake', '🍰'], ['ride a bike', '🚲'], ['read a book', '📖'], ['play the drum', '🥁']],
    at: [['on the moon', '🌙'], ['in a box', '📦'], ['on a bus', '🚌'], ['in the bath', '🛁'], ['up a tree', '🌳'], ['in the snow', '❄️'], ['on a boat', '⛵'], ['in bed', '🛏️']] };
  function sillySpec() {
    return { id: 'silly', title: '🤪 Silly sentences', back: () => go(funHome), gen() {
      const a = pick(SILLY.who), v = pick(SILLY.act), p = pick(SILLY.at), sent = `The ${a[0]} can ${v[0]} ${p[0]}.`;
      const b = pick(SILLY.who.filter(x => x !== a)), c = pick(SILLY.at.filter(x => x !== p)), d = pick(SILLY.act.filter(x => x !== v));
      const opts = [[a, v, p], [b, v, p], [a, d, c]].map(([x, y, z]) => ({ html: `<span class="en-combo">${x[1]}${y[1]}${z[1]}</span>`, val: x[0] + y[0] + z[0], say: `the ${x[0]} can ${y[0]} ${z[0]}` }));
      return { prompt: 'Read the silly sentence. Which picture is it?', visual: `<div class="en-sent">${tapWords(sent)}</div>`, choices: shuffle(opts), answer: a[0] + v[0] + p[0],
        explain: `It says: ${sent} Look for the ${a[0]}, then ${v[0]}, then ${p[0]}.`, onShow() { wireTapWords(view); say('Read the silly sentence. Tap a word if you need help. Which picture is it?'); } };
    } };
  }
  // Word treasure hunt: 9 words in the sand; Owl calls 5 of them; each one found on the first try is a star.
  let H = null;
  function hunt() {
    const s = stage(), words = shuffle([...new Set(EN_SIGHT.filter(x => x.stage <= s).flatMap(x => x.words))]).slice(0, 9);
    H = { words, calls: shuffle(words).slice(0, 5), i: 0, found: {}, miss: 0, stars: 0, first: 0, lock: false };
    drawHunt(); callWord();
  }
  const callWord = () => say(`Dig up the word: ${H.calls[H.i]}! ${H.calls[H.i]}.`);
  function drawHunt(msg) {
    const nav = navId;
    view.innerHTML = `${crumbs('💎 Word treasure hunt')}
      <div class="progress">${H.calls.map((_, k) => `<i class="${k < H.i ? 'done' : k === H.i ? 'now' : ''}"></i>`).join('')}</div>
      <div class="prompt"><div class="ptext">Owl calls a word. Tap it to dig up the treasure!</div><button class="speak" id="spk" aria-label="Say the word again">🔊</button></div>
      <div class="en-sand">${H.words.map((w, i) => `<button class="en-dig${H.found[w] ? ' found' : ''}" data-h="${i}">${H.found[w] ? `<span class="en-gem">${H.found[w]}</span>` : ''}<b>${esc(w)}</b></button>`).join('')}</div>
      <div class="cheer" id="cheer" aria-live="polite">${msg || ''}</div>`;
    wireBack(funHome);
    $('#spk').onclick = callWord;
    view.querySelectorAll('[data-h]').forEach(b => b.onclick = () => {
      if (nav !== navId || H.lock) return;
      const w = H.words[+b.dataset.h], want = H.calls[H.i];
      if (H.found[w]) { say(`You already dug up ${w}!`); return; }
      if (w !== want) { H.miss++; oops(); b.classList.add('wrong'); say(`That one says ${w}. Find ${want}!`); setTimeout(() => b.classList.remove('wrong'), 450); return; }
      const first = !H.miss; H.found[w] = pick(['💎', '👑', '💰', '🏆', '⭐']); H.lock = true;
      if (first) { H.first++; H.stars++; give(1); questTick('firsttry'); }
      yay(); drawHunt(first ? 'Treasure! ⭐' : 'Treasure!'); say(`${w}! You found treasure!`);
      setTimeout(() => {
        if (nav !== navId) return; H.lock = false; H.miss = 0; H.i++;
        if (H.i < H.calls.length) { drawHunt(); callWord(); return; }
        const e = E(); e.rounds.hunt = (e.rounds.hunt || 0) + 1; e.best.hunt = Math.max(e.best.hunt || 0, H.first); give(2); H.stars += 2;
        reward('Treasure chest full!', `You found ${H.calls.length} words and earned ${H.stars} ⭐`, () => go(hunt), () => go(funHome));
      }, 1400);
    });
  }

  const info = () => ({
    words: EN_VOCAB.reduce((a, t) => a + t.words.length, 0), topics: EN_VOCAB.length, sounds: EN_LETTERS.length + EN_DIGRAPHS.length + EN_MAGIC.length + EN_TEAMS.length,
    blend: EN_BLEND.length, sight: EN_SIGHT.reduce((a, s) => a + s.words.length, 0), stories: EN_STORIES.length, sentences: EN_SENTENCES.length, build: EN_BUILD.length,
    grammar: EN_GAMES.length, games: EN_GAMES.length + 15, pals: PALS.length, sayings: EN_SAYINGS.reduce((a, g) => a + g.items.length, 0), stages: STAGES.length
  });
  const VIEWS = { home: enHome, phonics, blend: blendGame, sight: sightHome, sightSet, flash, sightFind, read: readHome, story: storyRead, build: buildGame, grammar: grammarHome, game: grammarGame, vocab, say: sayings,
    fun: funHome, hunt, bubbles: () => quiz(bubbleSpec()), monster: () => quiz(monsterSpec()), silly: () => quiz(sillySpec()),
    first: () => quiz(firstSoundSpec()), magic: () => quiz(magicSpec()), teams: () => quiz(teamSpec()), readword: () => quiz(readWordSpec()), readsent: () => quiz(readSentSpec()),
    storyQuiz: id => quiz(storyQuizSpec(id)), play: id => quiz(grammarSpec(id)), vocabQuiz: id => quiz(vocabSpec(id)), sayQuiz: id => quiz(sayingSpec(id)) };
  if (location.hash === '#selftest') window.__english = {
    STAGES, SECTIONS: SECTIONS.map(s => s.id), info, stage, open, E, talk, ageStage,
    go: (v, ...a) => go(VIEWS[v], ...a), get q() { return Q && Q.q; }, get Q() { return Q; }, get B() { return B; }, get H() { return H; }, parseSent, PALS,
    data: { EN_LETTERS, EN_DIGRAPHS, EN_TEAMS, EN_BLEND, EN_SIGHT, EN_VOCAB, EN_SAYINGS, EN_STORIES, EN_SENTENCES, EN_BUILD, EN_GAMES }
  };
  enHome.info = info;
  return enHome;
})();
