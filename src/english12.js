/* ---------- English & Reading, part 12: My Book Studio, where the child writes their own little books ---------- */
// The other English sections teach reading; here the child composes. Sentences are built from big picture word tiles
// grouped by role (Who, Does, What, Where & when, Describe, Join, . ! ?). A tiny grammar engine, render(), turns the
// tiles into a correct sentence and says what it fixed, so the grammar is taught as it happens: a or an by the next
// word's sound, he/she/it + verb-s, one cat / two cats (and sheep, mice, boxes), "yesterday" turning verbs into the past
// (with the common irregulars: ran, saw, went, ate...), "after can the doing word stays the same", and he → him after a
// doing word. The child must give the sentence its big letter (tap the first word) and its end mark; Owl checks both
// gently, then reads the sentence aloud. A book has a cover (a title built from tiles, a sticker and a color) and 3–8
// pages; a page is 1–3 sentences and a picture made by tapping emoji stickers onto a small scene. Story starters (24)
// help a child who does not know what to write, and 3 "fill the frame" books (I see a ___. It is ___.) suit the
// youngest. The bookshelf reads books aloud with each word lighting up, and prints them. Books live in
// st.english.mybooks ({ list, stars }) — st.english.books already holds the chapter books read — so they are saved,
// backed up and removed with the player like the rest of st.english. Stars go through give(): 1 a finished page and 3 a
// finished book, the first time only and at most 8 pages and 2 books a day.
(() => {
  const { give, E, ptip, SECTIONS, VIEWS } = englishHome.api;
  const o = v => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
  const later = (nav, ms, fn) => setTimeout(() => { if (nav === navId) fn(); }, ms);

  /* ===================== the words ===================== */
  // nouns: word:emoji[:plural]  (an underscore is a space)
  const NOUNS = ('cat:🐱 dog:🐶 pig:🐷 hen:🐔 fox:🦊 frog:🐸 fish:🐟:fish duck:🦆 bug:🐛 bird:🐦 cow:🐮 owl:🦉 ant:🐜 bee:🐝 snail:🐌 sheep:🐑:sheep ' +
    'mouse:🐭:mice elephant:🐘 octopus:🐙 unicorn:🦄 dragon:🐉 robot:🤖 pet:🐾 friend:🧒 teddy:🧸 egg:🥚 apple:🍎 cake:🎂 ice_cream:🍦 ball:⚽ kite:🪁 ' +
    'bike:🚲 bus:🚌 car:🚗 boat:⛵ hat:🎩 sock:🧦 book:📖 tree:🌳 sun:☀️ moon:🌙 star:⭐ box:📦 cup:🥤 bed:🛏️ shell:🐚 umbrella:☂️ flower:🌸')
    .split(' ').map(x => { const [w, e, pl] = x.split(':'); return { w: w.replace(/_/g, ' '), e, pl: pl ? pl.replace(/_/g, ' ') : '' }; });
  const N = Object.fromEntries(NOUNS.map(n => [n.w, n]));
  const WHO_N = ['cat', 'dog', 'pig', 'hen', 'fox', 'frog', 'fish', 'duck', 'bird', 'cow', 'owl', 'bee', 'snail', 'elephant', 'unicorn', 'dragon', 'robot', 'pet', 'friend', 'teddy'];
  // person, object form, emoji
  const PRON = { I: ['1s', 'me', '🙋'], you: ['2', 'you', '🫵'], he: ['3s', 'him', '👦'], she: ['3s', 'her', '👧'], it: ['3s', 'it', '👉'], we: ['pl', 'us', '👨‍👩‍👧'], they: ['pl', 'them', '👫'] };
  const NAMES = [['Mum', '👩'], ['Dad', '👨'], ['Gran', '👵'], ['Sam', '👦'], ['Pip', '👧']];
  // verbs: base:emoji:past
  const VERBS = ('run:🏃:ran jump:🤸:jumped hop:🐇:hopped swim:🏊:swam eat:😋:ate see:👀:saw go:🚶:went like:❤️:liked love:🥰:loved play:🎲:played ' +
    'sit:🪑:sat dig:⛏️:dug sing:🎤:sang have:🤲:had get:🙌:got hug:🤗:hugged kick:🦵:kicked read:📖:read ride:🚲:rode fly:🕊️:flew make:🛠️:made ' +
    'find:🔍:found sleep:😴:slept draw:🖍️:drew help:🤝:helped splash:💦:splashed be:✨:was can:💪:could')
    .split(' ').map(x => { const [w, e, past] = x.split(':'); return { w, e, past }; });
  const V = Object.fromEntries(VERBS.map(v => [v.w, v]));
  // where and when: phrase:emoji[:past]
  const PLACES = ('in the park:🛝|at the beach:🏖️|at home:🏠|at school:🏫|in the sea:🌊|on the bus:🚌|under the bed:🛏️|up the tree:🌳|in the garden:🌷|' +
    'at the zoo:🦁|on the moon:🌙|in the snow:❄️|in the rain:🌧️|to the shop:🛒|in the sky:☁️|yesterday:⏪:1|last night:🌃:1|today:📅|at night:🌌|in the morning:🌅|every day:🔁')
    .split('|').map(x => { const [w, e, p] = x.split(':'); return { w, e, past: !!p }; });
  const PL = Object.fromEntries(PLACES.map(p => [p.w, p]));
  const ADJS = ('big:🐘 little:🐭 tiny:🐜 red:🔴 blue:🔵 green:🟢 pink:🩷 yellow:🟡 orange:🟠 purple:🟣 happy:😊 sad:😢 funny:😂 silly:🤪 fast:⚡ slow:🐢 ' +
    'hot:🔥 cold:🧊 wet:💧 soft:🪶 yummy:😋 old:👴 new:✨ kind:💗 brave:🦸').split(' ').map(x => { const [w, e] = x.split(':'); return { w, e }; });
  const NUMS = [['two', '✌️'], ['three', '3️⃣'], ['five', '🖐️']];
  const JOIN = [['and', '➕'], ['but', '🔀'], ['because', '💡'], ['so', '➡️']];
  const ENDS = [['.', 'full stop', 'telling'], ['!', 'exclamation mark', 'big feeling'], ['?', 'question mark', 'asking']];
  const GROUPS = [['who', '👤', 'Who'], ['does', '🏃', 'Does'], ['what', '🎁', 'What'], ['where', '📍', 'Where & when'], ['desc', '🎨', 'Describe'], ['join', '🔗', 'Join'], ['end', '❗', '. ! ?']];
  const TILES = {
    who: [...Object.keys(PRON).map(w => ({ k: 'p', w, e: PRON[w][2] })), ...NAMES.map(([w, e]) => ({ k: 'nm', w, e })), ...WHO_N.map(w => ({ k: 'n', w, e: N[w].e }))],
    does: VERBS.map(v => ({ k: 'v', w: v.w, e: v.e })),
    what: NOUNS.map(n => ({ k: 'n', w: n.w, e: n.e })),
    where: PLACES.map(p => ({ k: 'pp', w: p.w, e: p.e })),
    desc: [...ADJS.map(a => ({ k: 'a', w: a.w, e: a.e })), ...NUMS.map(([w, e]) => ({ k: 'num', w, e }))],
    join: JOIN.map(([w, e]) => ({ k: 'j', w, e })),
    end: ENDS.map(([w, nm]) => ({ k: 'e', w, e: w, nm }))
  };
  const TILE_COUNT = Object.values(TILES).reduce((a, l) => a + l.length, 0);

  /* ===================== the grammar engine ===================== */
  const anOf = w => /^[aeiou]/i.test(w) && !/^(uni|use|eu|one)/i.test(w) ? 'an' : 'a';
  function plural(w) { const n = N[w]; if (n && n.pl) return n.pl; if (/(s|x|z|ch|sh)$/.test(w)) return w + 'es'; if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ies'; return w + 's'; }
  function v3(w) { if (w === 'have') return 'has'; if (/(s|x|z|ch|sh|o)$/.test(w)) return w + 'es'; if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ies'; return w + 's'; }
  function conj(w, subj, past, afterCan) {
    if (afterCan) return w === 'can' ? 'can' : w;
    if (w === 'be') return past ? (subj === '1s' || subj === '3s' || !subj ? 'was' : 'were') : subj === '1s' ? 'am' : subj === '3s' || !subj ? 'is' : 'are';
    if (w === 'can') return past ? 'could' : 'can';
    if (past) return V[w].past;
    return subj === '3s' ? v3(w) : w;
  }
  const isPast = toks => toks.some(t => t.k === 'pp' && PL[t.w] && PL[t.w].past);
  // Tiles → words. Returns the words (each with the tile it came from), what was taught, and the state at the end
  // (who is doing it, past or not, after "can" or not) so the tiles can show the form they will take.
  function render(toks, cap) {
    const past = isPast(toks), words = [], notes = [];
    const note = s => { if (!notes.includes(s)) notes.push(s); };
    let subj = null, prev = null, afterCan = false, hasSubj = false, verbs = 0, subjBeforeVerb = false;
    const add = (t, i, x = {}) => words.push({ t, i, ...x });
    for (let i = 0; i < toks.length; i++) {
      const t = toks[i];
      if (t.k === 'blank') { if (t.d && t.d !== '-') add(t.d === 'a' ? 'a/an' : t.d, i); add('___', i, { blank: true }); prev = t.as || 'n'; continue; }
      if (t.k === 'a' || t.k === 'num' || t.k === 'n') {
        let j = i; while (j < toks.length && (toks[j].k === 'a' || toks[j].k === 'num')) j++;
        const head = j < toks.length && toks[j].k === 'n' ? toks[j] : null;
        const mods = toks.slice(i, j);
        if (!head) { mods.forEach((m, q) => add(m.w, i + q)); if (prev === 'v' && toks[i - 1] && toks[i - 1].w === 'be' && mods.length) note(`is + a describing word: it is ${mods[0].w}`); prev = 'a'; i = j - 1; continue; }
        const obj = prev === 'v', hasNum = mods.some(m => m.k === 'num'), many = !!head.pl || hasNum;
        let det = head.d || '-';
        if (many && det === 'a') det = hasNum ? '-' : 'some';
        const first = mods.length ? mods[0].w : head.w;
        if (det === 'a') {
          det = anOf(first);
          if (det === 'an') note(`an before a vowel sound: an ${first}`);
          else if (/^[aeiou]/i.test(first)) note(`a ${first}: it starts with a “you” sound, so we say a`);
          if (mods.length && anOf(head.w) !== det) note(`a or an? The word right after it decides: ${det} ${first} ${head.w}`);
        }
        if (det !== '-') add(det, j);
        mods.forEach((m, q) => add(m.w, i + q));
        const hw = many ? plural(head.w) : head.w;
        if (many) note(hw === head.w ? `One ${head.w}, two ${hw}: it stays the same!` : `More than one: ${head.w} → ${hw}`);
        add(hw, j);
        if (!obj) { subj = many ? 'pl' : '3s'; hasSubj = true; if (!verbs) subjBeforeVerb = true; }
        prev = 'n'; afterCan = false; i = j; continue;
      }
      if (t.k === 'p') {
        const obj = prev === 'v' && !afterCan, P = PRON[t.w];
        if (obj) { if (P[1] !== t.w) note(`After a doing word, ${t.w} → ${P[1]}`); add(P[1], i); }
        else { subj = P[0]; hasSubj = true; if (!verbs) subjBeforeVerb = true; add(t.w, i); if (t.w === 'I') note('I is always a big letter.'); }
        prev = 'p'; continue;
      }
      if (t.k === 'nm') { if (prev !== 'v') { subj = '3s'; hasSubj = true; if (!verbs) subjBeforeVerb = true; } add(t.w, i); note('Names start with a big letter.'); prev = 'n'; continue; }
      if (t.k === 'v') {
        const f = conj(t.w, subj, past, afterCan);
        if (afterCan) note(`After can, the doing word stays the same: can ${f}`);
        else if (past && t.w !== 'be') note(`Yesterday: ${t.w} → ${f}${/ed$/.test(f) ? '' : ' (a special one!)'}`);
        else if (t.w === 'be') note(past ? `In the past, is → ${f}` : `${subj === '1s' ? 'I am' : subj === '3s' || !subj ? 'he, she, it is' : 'we, you, they are'}`);
        else if (subj === '3s' && f !== t.w) note(`he, she, it: add s → ${f}`);
        add(f, i); verbs++;
        afterCan = t.w === 'can'; prev = afterCan ? 'can' : 'v'; continue;
      }
      if (t.k === 'pp') { add(t.w, i); if (PL[t.w] && PL[t.w].past) note('Yesterday makes the doing words go into the past.'); prev = 'pp'; continue; }
      if (t.k === 'j') { add(t.w, i); prev = 'j'; afterCan = false; continue; }
    }
    return { words, notes, past, subj, prev, afterCan, hasSubj, subjBeforeVerb, verbs };
  }
  const cap1 = s => s ? s[0].toUpperCase() + s.slice(1) : s;
  // The finished sentence text: the first word gets its big letter only if the child gave it one (I and names always have it).
  function textOf(toks, cap, end) {
    const r = render(toks, cap);
    return r.words.map((w, k) => k === 0 && cap ? cap1(w.t) : w.t).join(' ') + (end || '');
  }
  // The gentle check: words, then the big letter, then the end mark.
  function check(toks, cap, end) {
    const r = render(toks, cap), w0 = r.words[0];
    if (!r.words.length) return { ok: false, code: 'empty', msg: 'Tap some word tiles to make a sentence!' };
    if (!r.verbs) return { ok: false, code: 'verb', msg: 'A sentence needs a doing word. Find one in Does!' };
    if (!r.subjBeforeVerb) return { ok: false, code: 'who', msg: 'Who is doing it? Add a Who word before the doing word.' };
    if (toks[toks.length - 1].k === 'j') return { ok: false, code: 'join', msg: `Finish your idea after “${toks[toks.length - 1].w}”.` };
    const big = cap || /^[A-Z]/.test(w0.t);
    if (!big) return { ok: false, code: 'cap', msg: 'Sentences start with a big letter! Tap the first word to make it big.' };
    if (!end) return { ok: false, code: 'stop', msg: 'Every sentence ends with a mark. Pick . ! or ? in the last tab.' };
    return { ok: true, text: textOf(toks, cap, end), r };
  }

  /* ===================== story starters and frames ===================== */
  const T = {
    p: w => ({ k: 'p', w }), nm: w => ({ k: 'nm', w }), n: (w, d = 'the', pl = 0) => ({ k: 'n', w, d, pl }), v: w => ({ k: 'v', w }), a: w => ({ k: 'a', w }),
    pp: w => ({ k: 'pp', w }), j: w => ({ k: 'j', w })
  };
  // [icon, the starter, what Owl asks, title words, tiles]
  const PROMPTS = [
    ['🐾', 'My pet…', 'What does your pet do?', ['My', 'Pet'], [T.n('pet', 'my')]],
    ['🏖️', 'At the beach…', 'Who is at the beach? What do they do?', ['Beach', 'Day'], [T.pp('at the beach')]],
    ['⏪', 'Yesterday I…', 'What did you do yesterday?', ['Yesterday'], [T.pp('yesterday'), T.p('I')]],
    ['🐉', 'The big dragon…', 'What does the dragon do?', ['The', 'Big', 'Dragon'], [T.a('big'), T.n('dragon')]],
    ['❄️', 'In the snow…', 'What can you do in the snow?', ['Snow', 'Day'], [T.pp('in the snow')]],
    ['🤖', 'The robot can…', 'What can the robot do?', ['The', 'Robot'], [T.n('robot'), T.v('can')]],
    ['👩', 'Mum…', 'What does Mum like?', ['Mum', 'and', 'Me'], [T.nm('Mum')]],
    ['🦁', 'At the zoo I see…', 'What animals do you see?', ['Zoo', 'Trip'], [T.pp('at the zoo'), T.p('I'), T.v('see')]],
    ['🌙', 'On the moon…', 'Who goes to the moon?', ['The', 'Moon'], [T.pp('on the moon')]],
    ['🐱', 'The silly cat…', 'What silly thing does the cat do?', ['The', 'Silly', 'Cat'], [T.a('silly'), T.n('cat')]],
    ['🌃', 'Last night…', 'What happened last night?', ['Last', 'Night'], [T.pp('last night')]],
    ['❤️', 'I like… because…', 'What do you like? Why?', ['Things', 'I', 'Like'], [T.p('I'), T.v('like')]],
    ['🦊', 'The fox and the hen…', 'Are they friends?', ['Fox', 'and', 'Hen'], [T.n('fox'), T.j('and'), T.n('hen')]],
    ['🌷', 'In the garden…', 'What lives in the garden?', ['My', 'Garden'], [T.pp('in the garden')]],
    ['👨', 'Dad can…', 'What can Dad do?', ['Dad'], [T.nm('Dad'), T.v('can')]],
    ['🛏️', 'Under the bed…', 'What is under the bed?', ['Under', 'the', 'Bed'], [T.pp('under the bed')]],
    ['🐜', 'The tiny ant…', 'Where does the ant go?', ['The', 'Tiny', 'Ant'], [T.a('tiny'), T.n('ant')]],
    ['🛒', 'We go to the shop…', 'What do you get?', ['Shop', 'Day'], [T.p('we'), T.v('go'), T.pp('to the shop')]],
    ['🦄', 'A happy unicorn…', 'What makes the unicorn happy?', ['A', 'Happy', 'Unicorn'], [T.a('happy'), T.n('unicorn', 'a')]],
    ['🌧️', 'In the rain…', 'What do you do in the rain?', ['Rain', 'Day'], [T.pp('in the rain')]],
    ['🐟', 'Two fish…', 'Where do the fish swim?', ['Two', 'Fish'], [{ k: 'num', w: 'two' }, T.n('fish')]],
    ['🧒', 'My friend…', 'What do you and your friend play?', ['My', 'Friend'], [T.n('friend', 'my')]],
    ['🔁', 'Every day I…', 'What do you do every day?', ['My', 'Day'], [T.pp('every day'), T.p('I')]],
    ['🦉', 'The owl at night…', 'What does the owl see?', ['Owl', 'at', 'Night'], [T.n('owl'), T.pp('at night')]]
  ].map(([e, t, ask, title, toks]) => ({ e, t, ask, title, toks }));
  // Fill the frame, for the youngest: a slot is filled from a short picture list; the rest is fixed.
  const FRAMES = [
    { ico: '👀', name: 'I see a ___. It is ___.', title: ['I', 'See'], end: ['.', '.'],
      sents: [[T.p('I'), T.v('see'), { k: 'slot', n: 0, d: 'a', as: 'n' }], [T.p('it'), T.v('be'), { k: 'slot', n: 1, as: 'a' }]],
      slots: [['What do you see?', 'what'], ['What is it like?', 'adj']] },
    { ico: '💪', name: 'My ___ can ___!', title: ['What', 'We', 'Can', 'Do'], end: ['!'],
      sents: [[{ k: 'slot', n: 0, d: 'my', as: 'n' }, T.v('can'), { k: 'slot', n: 1, as: 'v' }]],
      slots: [['Who is it?', 'who'], ['What can it do?', 'verb']] },
    { ico: '❤️', name: 'I like ___ because they are ___.', title: ['Things', 'I', 'Like'], end: ['.'],
      sents: [[T.p('I'), T.v('like'), { k: 'slot', n: 0, d: '-', pl: 1, as: 'n' }, T.j('because'), T.p('they'), T.v('be'), { k: 'slot', n: 1, as: 'a' }]],
      slots: [['What do you like?', 'what'], ['What are they like?', 'adj']] }
  ];
  const SLOT_LIST = {
    what: NOUNS.filter(n => n.w !== 'friend' && n.w !== 'pet').map(n => ({ k: 'n', w: n.w, e: n.e })),
    who: WHO_N.map(w => ({ k: 'n', w, e: N[w].e })),
    adj: ADJS.map(a => ({ k: 'a', w: a.w, e: a.e })),
    verb: VERBS.filter(v => !['be', 'can', 'have', 'see', 'like', 'love', 'get', 'make', 'find', 'read', 'kick', 'hug', 'help'].includes(v.w)).map(v => ({ k: 'v', w: v.w, e: v.e }))
  };
  const fillFrame = (F, picks) => F.sents.map(s => s.map(t => {
    if (t.k !== 'slot') return t;
    const p = picks[t.n]; if (!p) return { k: 'blank', d: t.d, as: t.as };
    return p.k === 'n' ? { k: 'n', w: p.w, d: t.d, pl: t.pl || 0 } : { k: p.k, w: p.w };
  }));

  /* ===================== the books ===================== */
  const BGS = [['grass', '🌳', 'Park'], ['beach', '🏖️', 'Beach'], ['sea', '🌊', 'Under the sea'], ['night', '🌙', 'Night'], ['snow', '❄️', 'Snow'], ['room', '🏠', 'My room'], ['space', '🚀', 'Space']];
  const STICKERS = ('🐱 🐶 🐷 🐔 🦊 🐸 🐟 🦆 🐛 🐦 🐮 🦉 🐝 🐌 🐘 🐙 🦄 🐉 🤖 👦 👧 👩 👨 👵 🧸 🌳 🌸 🌷 ☀️ 🌙 ⭐ ☁️ 🌈 🏠 🏫 🚗 🚌 ⛵ 🚲 🪁 ⚽ 🎂 🍎 🍦 🎁 📖 ❄️ 🔥 💧 ❤️').split(' ');
  const COVERS = ['📕', '📗', '📘', '🐉', '🦄', '🐱', '🐶', '🚀', '🌈', '🏰', '🌊', '🦖', '🌸', '⭐', '🤖', '🎈'];
  const COLS = ['#C44E40', '#2776C3', '#268457', '#6D55D1', '#B05F1E', '#A23E78'];
  const TITLE_W = ('My The A Big Little Silly Happy Brave Magic Busy Best Day Trip Book Adventure Friends Pet Dragon Cat Dog Robot Unicorn Beach Zoo Moon ' +
    'Snow Garden Party Dream and at the in on of Me Mum Dad').split(' ');
  const SMALL = new Set(['a', 'an', 'the', 'and', 'at', 'in', 'on', 'of', 'to', 'but']);
  const titleText = ws => (ws || []).map((w, i) => i && SMALL.has(w.toLowerCase()) ? w.toLowerCase() : cap1(w)).join(' ');
  const MAXP = 8, MINP = 3, MAXS = 3, MAXST = 14, PAGE_CAP = 8, BOOK_CAP = 2;
  const M = () => {
    const e = E(), m = e.mybooks = o(e.mybooks);
    m.list = Array.isArray(m.list) ? m.list.filter(b => b && typeof b === 'object' && typeof b.id === 'string') : [];
    m.list.forEach(b => {
      b.title = Array.isArray(b.title) ? b.title.filter(w => typeof w === 'string') : []; b.pages = Array.isArray(b.pages) ? b.pages.filter(p => p && typeof p === 'object') : [];
      b.pages.forEach(p => { p.s = Array.isArray(p.s) ? p.s.filter(x => typeof x === 'string') : []; p.st = Array.isArray(p.st) ? p.st.filter(x => Array.isArray(x) && x.length >= 3) : []; if (!BGS.some(g => g[0] === p.bg)) p.bg = 'grass'; });
      if (!COVERS.includes(b.cover) && typeof b.cover !== 'string') b.cover = '📕';
    });
    m.stars = o(m.stars); if (m.stars.d !== today()) m.stars = { d: today(), p: 0, b: 0 };
    return m;
  };
  const byId = id => M().list.find(b => b.id === id);
  const author = () => st.name || 'me';
  const finished = b => b.pages.filter(p => p.fin && p.s.length);
  function newBook(spec = {}) {
    const m = M(), b = { id: 'b' + Date.now().toString(36) + Math.floor(Math.random() * 1e4), title: spec.title || [], cover: spec.cover || '📕', col: spec.col || 0, pages: [], done: false, made: today(), kind: spec.kind || '' };
    m.list.unshift(b); save(); return b;
  }
  const newPage = () => ({ s: [], bg: 'grass', st: [], fin: 0 });

  /* ===================== pictures ===================== */
  const sceneHTML = (pg, live) => `<div class="eb-scene eb-bg-${pg.bg}"${live ? ' id="ebScene" aria-label="The picture. Tap to place the sticker."' : ' aria-hidden="true"'}>${pg.st.map(([e, x, y, s], k) =>
    live ? `<button class="eb-stk${s > 1 ? ' big' : ''}" data-si="${k}" style="left:${x}%;top:${y}%" aria-label="Take off the ${esc(e)} sticker">${esc(e)}</button>`
      : `<span class="eb-stk${s > 1 ? ' big' : ''}" style="left:${x}%;top:${y}%">${esc(e)}</span>`).join('')}</div>`;
  const wordsHTML = s => s.split(' ').map(w => `<span class="eb-rw">${esc(w)}</span>`).join(' ');
  const coverHTML = b => `<div class="eb-cover" style="--bc:${COLS[b.col] || COLS[0]}"><span class="eb-cico" aria-hidden="true">${esc(b.cover)}</span><b class="eb-ctitle">${b.title.length ? esc(titleText(b.title)) : 'My Book'}</b><small>by ${esc(author())}</small></div>`;

  /* ===================== the sentence builder ===================== */
  let B = null;
  const freshB = (pre = []) => ({ toks: pre.map(t => ({ ...t })), cap: false, end: '', tab: pre.length ? (pre.some(t => t.k === 'v') ? 'what' : pre.some(t => ['p', 'nm', 'n'].includes(t.k)) ? 'does' : 'who') : 'who', det: { who: 'the', what: 'a' } });
  function tileLabel(t, r) {
    if (t.k === 'v') return conj(t.w, r.subj, r.past, r.afterCan);
    if (t.k === 'p') return r.prev === 'v' && !r.afterCan ? (PRON[t.w][1]) : t.w;
    if (t.k === 'n') { const d = B.det[B.tab] || 'the'; return `${d === 'a' ? anOf(t.w) : d} ${t.w}`; }
    return t.w;
  }
  function drawB() {
    const box = $('#ebB'); if (!box || !B) return;
    const r = render(B.toks, B.cap), list = TILES[B.tab], last = [...B.toks].reverse().find(t => t.k === 'n');
    const tips = r.words.length && !B.cap && !/^[A-Z]/.test(r.words[0].t) ? ['Tap the first word to give it a big letter.'] : [];
    box.innerHTML = `<div class="eb-strip" id="ebStrip" aria-live="polite">${r.words.length ? r.words.map((w, k) => `<button class="eb-w${k === 0 ? ' first' + (B.cap || /^[A-Z]/.test(w.t) ? ' big' : '') : ''}" data-wi="${k}" aria-label="${k === 0 ? 'First word: ' : ''}${esc(w.t)}">${esc(k === 0 && B.cap ? cap1(w.t) : w.t)}</button>`).join('') : '<span class="eb-ph">Tap the word tiles to make a sentence ✨</span>'}${B.end ? `<span class="eb-endm" aria-label="${ENDS.find(x => x[0] === B.end)[1]}">${B.end}</span>` : r.words.length ? '<span class="eb-endq" aria-hidden="true">_</span>' : ''}</div>
      <div class="eb-help" id="ebHelp">${[...r.notes, ...tips].map(n => `<span>💡 ${esc(n)}</span>`).join('')}</div>
      <div class="eb-tools"><button class="eb-tool" id="ebUndo"${B.toks.length || B.end ? '' : ' disabled'}>⌫ Undo</button><button class="eb-tool" id="ebClear"${B.toks.length || B.end ? '' : ' disabled'}>🗑️ Clear</button>
        <button class="eb-tool${r.past ? ' on' : ''}" id="ebPast" aria-pressed="${r.past}">⏪ Yesterday</button><button class="eb-tool${last && last.pl ? ' on' : ''}" id="ebMany"${last ? '' : ' disabled'} aria-pressed="${!!(last && last.pl)}">🐱🐱 More than one</button></div>
      <div class="eb-tabs" role="tablist">${GROUPS.map(([id, ico, nm]) => `<button class="eb-tab${id === B.tab ? ' on' : ''}" role="tab" aria-selected="${id === B.tab}" data-tab="${id}"><span aria-hidden="true">${ico}</span>${esc(nm)}</button>`).join('')}</div>
      ${B.tab === 'who' || B.tab === 'what' ? `<div class="eb-det" aria-label="Pick the little word">${['the', 'a', 'my'].map(d => `<button class="eb-dt${(B.det[B.tab] || 'the') === d ? ' on' : ''}" data-det="${d}" aria-pressed="${(B.det[B.tab] || 'the') === d}">${d === 'a' ? 'a / an' : d}</button>`).join('')}</div>` : ''}
      <div class="eb-tiles eb-g-${B.tab}" id="ebTiles">${list.map((t, k) => `<button class="eb-tile" data-tile="${k}" aria-label="${esc(t.nm || tileLabel(t, r))}"><span class="eb-te" aria-hidden="true">${t.e}</span><b>${esc(tileLabel(t, r))}</b>${t.nm ? `<small>${esc(t.nm)}</small>` : ''}</button>`).join('')}</div>
      <p class="eb-msg" id="ebMsg" aria-live="polite"></p>
      <button class="btn leaf eb-done" id="ebDone">✅ My sentence is ready</button>`;
  }
  const NEXT_TAB = { who: 'does', does: 'what' };
  function addTile(t) {
    if (t.k === 'e') { B.end = t.w; say(`${t.nm}. A ${ENDS.find(x => x[0] === t.w)[2]} sentence.`); drawB(); return; }
    if (B.toks.length >= 12) { say('That is a long sentence! Finish it with a full stop.'); oops(); return; }
    const tok = t.k === 'n' ? { k: 'n', w: t.w, d: B.det[B.tab] || 'the', pl: 0 } : { k: t.k, w: t.w };
    B.toks.push(tok); B.end = ''; // a new word comes after the end mark, so the mark comes off until the sentence is done
    const r = render(B.toks, B.cap), mine = r.words.filter(w => w.i === B.toks.length - 1).map(w => w.t).join(' ');
    say(mine || t.w);
    if (NEXT_TAB[B.tab] && (t.k !== 'n' || B.tab === 'who')) B.tab = NEXT_TAB[B.tab];
    drawB();
  }
  function wireB(onDone) {
    const box = $('#ebB'); if (!box) return;
    box.onclick = ev => {
      const b = ev.target.closest('button'); if (!b || b.disabled) return;
      const msg = $('#ebMsg');
      if (b.dataset.wi != null) {
        const k = +b.dataset.wi, r = render(B.toks, B.cap), w = r.words[k];
        if (k === 0) { if (/^[A-Z]/.test(w.t)) { say(`${w.t} already has a big letter!`); return; } B.cap = !B.cap; say(B.cap ? `Big letter! ${cap1(w.t)}` : w.t); if (B.cap) yay(); drawB(); return; }
        say(w.t); return;
      }
      if (b.dataset.tab) { B.tab = b.dataset.tab; drawB(); return; }
      if (b.dataset.det) { B.det[B.tab] = b.dataset.det; say(b.dataset.det === 'a' ? 'a, or an' : b.dataset.det); drawB(); return; }
      if (b.dataset.tile != null) { addTile(TILES[B.tab][+b.dataset.tile]); return; }
      if (b.id === 'ebUndo') { if (B.end) B.end = ''; else B.toks.pop(); drawB(); return; }
      if (b.id === 'ebClear') { B = { ...freshB(), tab: 'who' }; drawB(); return; }
      if (b.id === 'ebPast') { if (isPast(B.toks)) B.toks = B.toks.filter(t => !(t.k === 'pp' && PL[t.w].past)); else B.toks.unshift({ k: 'pp', w: 'yesterday' }); say(isPast(B.toks) ? 'Yesterday! The doing words go into the past.' : 'Now!'); drawB(); return; }
      if (b.id === 'ebMany') { const n = [...B.toks].reverse().find(t => t.k === 'n'); if (n) { n.pl = n.pl ? 0 : 1; say(n.pl ? `More than one: ${plural(n.w)}` : `One ${n.w}`); } drawB(); return; }
      if (b.id === 'ebDone') {
        const c = check(B.toks, B.cap, B.end);
        if (!c.ok) {
          oops(); if (msg) msg.textContent = c.msg; say(c.msg);
          if (c.code === 'stop') { B.tab = 'end'; drawB(); $('#ebMsg').textContent = c.msg; }
          const f = c.code === 'cap' ? box.querySelector('.eb-w.first') : c.code === 'stop' ? box.querySelector('.eb-endq') : null;
          if (f) { f.classList.remove('pulse'); void f.offsetWidth; f.classList.add('pulse'); }
          return;
        }
        yay(); say(c.text); onDone(c.text);
      }
    };
  }

  /* ===================== the studio home ===================== */
  function studioHome() {
    save();
    const m = M(), done = m.list.filter(b => b.done), drafts = m.list.filter(b => !b.done);
    const card = b => `<button class="eb-shelfb${b.done ? '' : ' draft'}" data-book="${esc(b.id)}" style="--bc:${COLS[b.col] || COLS[0]}" aria-label="${esc(titleText(b.title) || 'My Book')}${b.done ? '' : ', keep writing'}"><span class="eb-sico" aria-hidden="true">${esc(b.cover)}</span><b>${esc(titleText(b.title) || 'My Book')}</b><small>${b.done ? `${b.pages.length} pages` : `✏️ Keep writing · ${finished(b).length} of ${MINP}+ pages`}</small></button>`;
    view.innerHTML = `${crumbs('✍️ My Book Studio')}
      <div class="eb-hero"><span class="eb-howl" aria-hidden="true">🦉</span><p>Let's write a book! You make the sentences, Owl reads them, you draw the pictures.</p></div>
      <div class="eb-starts">
        <button class="eb-big" id="ebNew"><span aria-hidden="true">📗</span><span><b>Make a new book</b>Cover, then 3 to ${MAXP} pages</span></button>
        <button class="eb-big alt" id="ebIdeas"><span aria-hidden="true">💡</span><span><b>Story starters</b>${PROMPTS.length} ideas when you don't know what to write</span></button>
      </div>
      <h2 class="eb-h">🧩 Fill the frame <small>for little writers</small></h2>
      <div class="eb-frames">${FRAMES.map((F, i) => `<button class="eb-frame" data-frame="${i}"><span aria-hidden="true">${F.ico}</span><b>${esc(F.name)}</b></button>`).join('')}</div>
      <h2 class="eb-h">📚 My bookshelf <small>${done.length} book${done.length === 1 ? '' : 's'}</small></h2>
      ${m.list.length ? `<div class="eb-shelf" id="ebShelf">${[...drafts, ...done].map(card).join('')}</div>` : '<p class="note eb-empty">Your books will stand here. Make your first one!</p>'}
      ${ptip('studio')}`;
    wireBack(englishHome);
    sayScreen(m.list.length ? 'My Book Studio! Write a new book, or read one from your bookshelf.' : 'My Book Studio! Let\'s write your very first book.');
    $('#ebNew').onclick = () => go(coverEdit, newBook().id);
    $('#ebIdeas').onclick = () => go(ideas);
    view.querySelectorAll('[data-frame]').forEach(b => b.onclick = () => { const i = +b.dataset.frame, F = FRAMES[i]; go(pageEdit, newBook({ title: F.title.slice(), cover: F.ico, col: i + 1, kind: 'f' + i }).id, 0); });
    view.querySelectorAll('[data-book]').forEach(b => b.onclick = () => { const bk = byId(b.dataset.book); if (!bk) return; if (bk.done) go(bookRead, bk.id, -1); else if (!bk.title.length && !bk.kind) go(coverEdit, bk.id); else { const k = bk.pages.findIndex(p => !p.fin); go(pageEdit, bk.id, k < 0 ? Math.min(bk.pages.length, MAXP - 1) : k); } });
  }

  function ideas() {
    view.innerHTML = `${crumbs('💡 Story starters')}
      <p class="note">Pick one. Owl puts the first words in for you, and you write the rest!</p>
      <div class="eb-ideas">${PROMPTS.map((P, i) => `<button class="eb-idea" data-idea="${i}"><span aria-hidden="true">${P.e}</span><b>${esc(P.t)}</b><small>${esc(P.ask)}</small></button>`).join('')}</div>${ptip('studio')}`;
    wireBack(studioHome);
    sayScreen('Story starters! Pick one, and finish the sentence your way.');
    view.querySelectorAll('[data-idea]').forEach(b => b.onclick = () => { const P = PROMPTS[+b.dataset.idea]; go(pageEdit, newBook({ title: P.title.slice(), cover: P.e, col: +b.dataset.idea % COLS.length }).id, 0, +b.dataset.idea); });
  }

  /* ===================== the cover ===================== */
  function coverEdit(id) {
    const b = byId(id); if (!b) { go(studioHome); return; }
    view.innerHTML = `${crumbs('📗 My book cover')}
      <div class="eb-covwrap" id="ebCov">${coverHTML(b)}</div>
      <p class="eb-teach">💡 Titles give the important words a big letter: <b>The Silly Cat</b>.</p>
      <h2 class="eb-h">1. Make the title</h2>
      <div class="eb-ttiles">${TITLE_W.map((w, i) => `<button class="eb-tt" data-tw="${i}">${esc(w)}</button>`).join('')}<button class="eb-tt eb-ttx" id="ebTUndo" aria-label="Take off the last word">⌫</button></div>
      <h2 class="eb-h">2. Pick a cover sticker</h2>
      <div class="eb-covs">${COVERS.map(c => `<button class="eb-cv${b.cover === c ? ' on' : ''}" data-cv="${c}" aria-label="Cover sticker ${c}">${c}</button>`).join('')}</div>
      <h2 class="eb-h">3. Pick a color</h2>
      <div class="eb-cols">${COLS.map((c, i) => `<button class="eb-col${b.col === i ? ' on' : ''}" data-col="${i}" style="background:${c}" aria-label="Color ${i + 1}"></button>`).join('')}</div>
      <p class="eb-msg" id="ebMsg" aria-live="polite"></p>
      <div class="row"><button class="btn leaf" id="ebStart">✏️ Start writing</button></div>${ptip('studio')}`;
    wireBack(studioHome);
    sayScreen('Make your book cover. Tap words for the title, then pick a sticker and a color.');
    const redraw = () => { $('#ebCov').innerHTML = coverHTML(b); view.querySelectorAll('[data-cv]').forEach(x => x.classList.toggle('on', x.dataset.cv === b.cover)); view.querySelectorAll('[data-col]').forEach(x => x.classList.toggle('on', +x.dataset.col === b.col)); save(); };
    view.querySelectorAll('[data-tw]').forEach(x => x.onclick = () => { if (b.title.length >= 6) { say('That is a long title!'); return; } b.title.push(TITLE_W[+x.dataset.tw]); say(titleText(b.title)); redraw(); });
    $('#ebTUndo').onclick = () => { b.title.pop(); redraw(); };
    view.querySelectorAll('[data-cv]').forEach(x => x.onclick = () => { b.cover = x.dataset.cv; redraw(); });
    view.querySelectorAll('[data-col]').forEach(x => x.onclick = () => { b.col = +x.dataset.col; redraw(); });
    $('#ebStart').onclick = () => { if (!b.title.length) { const t = 'Give your book a title first. Tap some words!'; $('#ebMsg').textContent = t; say(t); oops(); return; } go(pageEdit, b.id, 0); };
  }

  /* ===================== a page ===================== */
  let F = null, S = { sel: STICKERS[0], big: false }, PG = null;
  function pageEdit(id, pi, idea) {
    const b = byId(id); if (!b) { go(studioHome); return; }
    pi = Math.max(0, Math.min(pi | 0, MAXP - 1, b.pages.length));
    if (pi === b.pages.length) { b.pages.push(newPage()); save(); }
    const pg = b.pages[pi], fr = /^f\d$/.test(b.kind) ? FRAMES[+b.kind[1]] : null;
    PG = { b, pi, pg };
    const P = idea != null ? PROMPTS[idea] : null;
    B = freshB(P ? P.toks : []); F = fr ? { F: fr, picks: [] } : null;
    const nFin = finished(b).length;
    view.innerHTML = `${crumbs(`✍️ ${esc(titleText(b.title) || 'My Book')}: page ${pi + 1}`)}
      <div class="eb-pages" aria-label="Pages">${b.kind ? '' : '<button class="eb-pc" id="ebCoverBtn" aria-label="The cover">📗</button>'}${b.pages.map((p, k) => `<button class="eb-pc${k === pi ? ' on' : ''}${p.fin ? ' fin' : ''}" data-pg="${k}" aria-label="Page ${k + 1}${p.fin ? ', done' : ''}">${p.fin ? '✓' : ''}${k + 1}</button>`).join('')}${b.pages.length < MAXP && pg.fin ? '<button class="eb-pc add" id="ebAddPg" aria-label="New page">＋</button>' : ''}</div>
      ${P ? `<p class="eb-idea-ask"><span aria-hidden="true">${P.e}</span> ${esc(P.ask)}</p>` : ''}
      <section class="eb-card"><h2 class="eb-h">📝 My sentences <small id="ebSN">${pg.s.length} of ${MAXS}</small></h2>
        <div class="eb-sents" id="ebSents"></div>
        <div id="ebB"></div></section>
      <section class="eb-card"><h2 class="eb-h">🎨 My picture <small>tap a sticker, then tap the picture</small></h2><div id="ebPic"></div></section>
      <p class="eb-msg" id="ebPMsg" aria-live="polite"></p>
      <div class="row eb-acts"><button class="btn leaf" id="ebPageDone">✅ Page done</button><button class="btn" id="ebFinish"${nFin >= MINP || (nFin >= MINP - 1 && !pg.fin) ? '' : ' disabled'}>📕 Finish my book</button></div>
      <p class="note eb-left">${nFin >= MINP ? `${nFin} pages done. Finish your book, or write more (up to ${MAXP}).` : `Write ${MINP} pages to finish your book. ${nFin} done.`}</p>
      ${ptip('studio')}`;
    wireBack(studioHome);
    sayScreen(pg.s.length ? `Page ${pi + 1}.` : fr ? `Fill the frame! ${fr.slots[0][0]}` : P ? `${P.t.replace('…', '')}. ${P.ask}` : `Page ${pi + 1}. Who is in your story? Tap a Who word.`);
    drawSents(); drawPic();
    const cb = $('#ebCoverBtn'); if (cb) cb.onclick = () => go(coverEdit, b.id);
    view.querySelectorAll('[data-pg]').forEach(x => x.onclick = () => go(pageEdit, b.id, +x.dataset.pg));
    const ad = $('#ebAddPg'); if (ad) ad.onclick = () => go(pageEdit, b.id, b.pages.length);
    $('#ebPageDone').onclick = () => pageDone();
    $('#ebFinish').onclick = () => finishBook();
  }
  function drawSents() {
    const { pg } = PG, box = $('#ebSents'), bb = $('#ebB'); if (!box) return;
    const sn = $('#ebSN'); if (sn) sn.textContent = `${pg.s.length} of ${MAXS}`;
    box.innerHTML = pg.s.length ? pg.s.map((s, k) => `<div class="eb-sent"><button class="eb-say" data-hear="${k}" aria-label="Hear it">🔊</button><span>${esc(s)}</span><button class="eb-del" data-del="${k}" aria-label="Take this sentence off">✕</button></div>`).join('') : '';
    box.querySelectorAll('[data-hear]').forEach(x => x.onclick = () => say(pg.s[+x.dataset.hear]));
    box.querySelectorAll('[data-del]').forEach(x => x.onclick = () => { pg.s.splice(+x.dataset.del, 1); pg.fin = pg.s.length ? pg.fin : 0; save(); drawSents(); });
    if (pg.s.length >= MAXS) { bb.onclick = null; bb.innerHTML = `<p class="eb-full">This page is full of words! 🎉 Now make the picture.</p>`; return; }
    if (F) { if (pg.s.length) { bb.onclick = null; bb.innerHTML = '<p class="eb-full">Great writing! 🎉 Now make the picture, then tap Page done.</p>'; return; } drawFrame(); return; }
    const added = text => { pg.s.push(text); save(); const keep = B.det; B = freshB(); B.det = keep; drawSents(); toast('Owl read your sentence! ✨'); };
    drawB(); wireB(added);
  }
  // Fill the frame: one slot at a time from a short picture list; the frame shows a/an ___ until it is filled.
  function drawFrame() {
    const bb = $('#ebB'), Fr = F.F, k = F.picks.length, sents = fillFrame(Fr, F.picks);
    const full = k >= Fr.slots.length, texts = sents.map((s, j) => textOf(s, true, Fr.end[j]));
    const r = sents.map(s => render(s, true)), notes = [...new Set(r.flatMap(x => x.notes))].filter(n => !/big letter/.test(n));
    bb.innerHTML = `<div class="eb-fr" id="ebFrame">${sents.map((s, j) => `<p>${render(s, true).words.map((w, q) => `<span class="${w.blank ? 'eb-blank' : 'eb-fw'}">${esc(q === 0 ? cap1(w.t) : w.t)}</span>`).join(' ')}${esc(Fr.end[j])}</p>`).join('')}</div>
      ${notes.length && full ? `<div class="eb-help">${notes.map(n => `<span>💡 ${esc(n)}</span>`).join('')}</div>` : ''}
      ${full ? `<div class="row"><button class="btn leaf" id="ebUse">✅ Put it on my page</button><button class="btn alt" id="ebRedo">↺ Change</button></div>`
        : `<h3 class="eb-ask">${esc(Fr.slots[k][0])}</h3><div class="eb-tiles" id="ebTiles">${SLOT_LIST[Fr.slots[k][1]].map((t, q) => `<button class="eb-tile" data-slot="${q}"><span class="eb-te" aria-hidden="true">${t.e}</span><b>${esc(t.w)}</b></button>`).join('')}</div>`}`;
    if (full) {
      say(texts.join(' '));
      $('#ebUse').onclick = () => { const { pg } = PG; pg.s.push(...texts); const n = F.picks.find(p => p.k === 'n'); if (n && !pg.st.length) pg.st.push([N[n.w].e, 50, 55, 2]); save(); yay(); drawSents(); drawPic(); };
      $('#ebRedo').onclick = () => { F.picks = []; drawFrame(); };
    } else bb.querySelectorAll('[data-slot]').forEach(x => x.onclick = () => { const t = SLOT_LIST[Fr.slots[k][1]][+x.dataset.slot]; F.picks.push(t); say(t.w); drawFrame(); });
  }
  function drawPic() {
    const { pg } = PG, box = $('#ebPic'); if (!box) return;
    box.innerHTML = `<div class="eb-bgs">${BGS.map(([id, e, nm]) => `<button class="eb-bgb${pg.bg === id ? ' on' : ''}" data-bg="${id}" aria-label="${nm}" aria-pressed="${pg.bg === id}">${e}</button>`).join('')}</div>
      ${sceneHTML(pg, true)}
      <div class="eb-pal" id="ebPal"><button class="eb-size${S.big ? ' on' : ''}" id="ebBig" aria-pressed="${S.big}">${S.big ? '🔍 Big' : '🔎 Small'}</button>${STICKERS.map((e, k) => `<button class="eb-ps${S.sel === e ? ' on' : ''}" data-ps="${k}" aria-label="Sticker ${e}">${e}</button>`).join('')}</div>
      <p class="note">Tap a sticker in the picture to take it off.</p>`;
    box.querySelectorAll('[data-bg]').forEach(x => x.onclick = () => { pg.bg = x.dataset.bg; save(); drawPic(); });
    box.querySelectorAll('[data-ps]').forEach(x => x.onclick = () => { S.sel = STICKERS[+x.dataset.ps]; box.querySelectorAll('[data-ps]').forEach(y => y.classList.toggle('on', y === x)); });
    $('#ebBig').onclick = () => { S.big = !S.big; drawPic(); };
    const sc = $('#ebScene');
    sc.onclick = ev => {
      const s = ev.target.closest('[data-si]');
      if (s) { pg.st.splice(+s.dataset.si, 1); save(); tone([392, 294], 0.08); drawPic(); return; }
      if (pg.st.length >= MAXST) { say('The picture is full! Tap a sticker to take it off.'); return; }
      const R = sc.getBoundingClientRect(), x = clamp(Math.round((ev.clientX - R.left) / R.width * 100), 7, 93), y = clamp(Math.round((ev.clientY - R.top) / R.height * 100), 10, 90);
      pg.st.push([S.sel, x, y, S.big ? 2 : 1]); save(); tone([660, 880], 0.06); drawPic();
    };
  }
  function pageDone() {
    const { b, pi, pg } = PG, msg = $('#ebPMsg');
    const bad = !pg.s.length ? (F ? 'Fill the frame first, then put it on your page.' : 'Write a sentence first! Then tap “My sentence is ready”.') : !pg.st.length ? 'Add a picture! Tap a sticker, then tap the picture.' : '';
    if (bad) { oops(); msg.textContent = bad; say(bad); return; }
    const first = !pg.fin; pg.fin = 1;
    const m = M(); let got = 0;
    if (first && !pg.rw && m.stars.p < PAGE_CAP) { pg.rw = 1; m.stars.p++; got = 1; give(1); }
    save(); yay();
    toast(got ? `Page ${pi + 1} done! +1 ⭐` : `Page ${pi + 1} done!`);
    const next = b.pages.findIndex((p, k) => k > pi && !p.fin);
    if (next > 0) { go(pageEdit, b.id, next); return; }
    if (b.pages.length < MAXP) { go(pageEdit, b.id, b.pages.length); if (finished(b).length >= MINP) say(`Page ${pi + 1} done! You can finish your book now, or write another page.`); return; }
    go(pageEdit, b.id, pi); say('Your book has all its pages! Tap Finish my book.');
  }
  function finishBook() {
    const { b, pg } = PG;
    if (pg.s.length && pg.st.length && !pg.fin) { pg.fin = 1; const m = M(); if (!pg.rw && m.stars.p < PAGE_CAP) { pg.rw = 1; m.stars.p++; give(1); } }
    if (finished(b).length < MINP) { const t = `A book needs ${MINP} pages. You have ${finished(b).length}. Keep going!`; $('#ebPMsg').textContent = t; say(t); oops(); return; }
    b.pages = b.pages.filter(p => p.fin && p.s.length);
    if (!b.title.length) b.title = ['My', 'Book'];
    const first = !b.done; b.done = true; b.finished = today();
    const m = M(); let got = 0;
    if (first && !b.rw && m.stars.b < BOOK_CAP) { b.rw = 1; m.stars.b++; got = 3; give(3); }
    save(); go(bookDone, b.id, got);
  }
  function bookDone(id, got) {
    const b = byId(id); if (!b) { go(studioHome); return; }
    confetti(70); tone([523, 659, 784, 1046], 0.1);
    view.innerHTML = `<div class="view done eb-donev">${coverHTML(b)}<h1>You wrote a book! 🎉</h1>
      <p style="font-weight:800;font-size:22px">${b.pages.length} pages by ${esc(author())}${got ? ` · +${got} ⭐` : ''}</p>
      <div class="row"><button class="btn leaf" id="ebReadIt">📖 Read it to me</button><button class="btn alt" id="ebShelfB">📚 My bookshelf</button></div></div>`;
    say(`Hooray! You wrote a book: ${titleText(b.title)}. It has ${b.pages.length} pages. It is on your bookshelf now.`);
    $('#ebReadIt').onclick = () => go(bookRead, b.id, -1, true);
    $('#ebShelfB').onclick = () => go(studioHome);
  }

  /* ===================== reading a book ===================== */
  let RD = null;
  function bookRead(id, pg = -1, auto = false) {
    const b = byId(id); if (!b) { go(studioHome); return; }
    pg = Math.max(-1, Math.min(pg, b.pages.length - 1));
    const P = pg >= 0 ? b.pages[pg] : null, nav = navId;
    RD = { id, pg, auto, reading: false, lit: -1 };
    view.innerHTML = `${crumbs(`📖 ${esc(titleText(b.title) || 'My Book')}`)}
      <div class="eb-read">${P ? `${sceneHTML(P, false)}<div class="eb-text" id="ebText">${P.s.map(s => `<p>${wordsHTML(s)}</p>`).join('')}</div>`
        : `${coverHTML(b)}<div class="eb-text" id="ebText"><p>${wordsHTML(titleText(b.title) || 'My Book')}</p><p class="eb-by">${wordsHTML('by ' + author())}</p></div>`}
        <p class="eb-pn">${P ? `Page ${pg + 1} of ${b.pages.length}` : 'The cover'}</p></div>
      <div class="row eb-rnav"><button class="btn alt" id="ebPrev"${pg < 0 ? ' disabled' : ''} aria-label="Back a page">◀</button><button class="btn leaf" id="ebRead">▶ Read to me</button><button class="btn alt" id="ebNext"${pg >= b.pages.length - 1 ? ' disabled' : ''} aria-label="Next page">▶</button></div>
      <div class="row eb-racts"><button class="btn alt sm" id="ebAll">📖 Read the whole book</button><button class="btn alt sm" id="ebPrintBtn">🖨️ Print</button><button class="btn alt sm" id="ebEdit">✏️ Change it</button><button class="btn alt sm" id="ebDel">🗑️ Delete</button></div>
      ${ptip('studio')}`;
    wireBack(studioHome);
    screenText = P ? P.s.join(' ') : titleText(b.title);
    $('#ebPrev').onclick = () => go(bookRead, id, pg - 1);
    $('#ebNext').onclick = () => go(bookRead, id, pg + 1);
    $('#ebRead').onclick = () => readPage(nav);
    $('#ebAll').onclick = () => go(bookRead, id, -1, true);
    $("#ebPrintBtn").onclick = () => printBook(b);
    $('#ebEdit').onclick = () => { b.done = false; save(); go(pageEdit, b.id, Math.max(0, pg)); };
    let sure = false;
    $('#ebDel').onclick = () => { if (!sure) { sure = true; $('#ebDel').textContent = '🗑️ Tap again to delete'; say('Tap again to delete this book.'); return; } const m = M(); m.list = m.list.filter(x => x.id !== id); save(); toast('Book deleted'); go(studioHome); };
    if (auto) later(nav, 500, () => readPage(nav));
  }
  // Owl reads the page while each word lights up in turn; in "whole book" mode the next page follows.
  function readPage(nav) {
    const b = byId(RD.id); if (!b) return;
    const ws = [...view.querySelectorAll('#ebText .eb-rw')], text = ws.map(w => w.textContent).join(' '), step = 430;
    RD.reading = true; RD.lit = -1;
    say(text);
    ws.forEach((w, j) => later(nav, 150 + j * step, () => { ws.forEach(z => z.classList.remove('lit')); w.classList.add('lit'); RD.lit = j; }));
    later(nav, 300 + ws.length * step, () => {
      ws.forEach(z => z.classList.remove('lit')); RD.reading = false; RD.read = (RD.read || 0) + 1;
      if (RD.auto && RD.pg < b.pages.length - 1) later(nav, 600, () => go(bookRead, b.id, RD.pg + 1, true));
      else if (RD.auto) { say('The end!'); const m = M(); m.reads = (m.reads || 0) + 1; save(); }
    });
  }
  function printBook(b) {
    let el = document.getElementById('ebPrint');
    if (!el) { el = document.createElement('div'); el.id = 'ebPrint'; document.body.appendChild(el); }
    el.innerHTML = `<section class="eb-pp eb-ppc">${coverHTML(b)}</section>${b.pages.map((p, k) => `<section class="eb-pp">${sceneHTML(p, false)}<div class="eb-ptext">${p.s.map(s => `<p>${esc(s)}</p>`).join('')}</div><small>${k + 1}</small></section>`).join('')}`;
    document.body.classList.add('eb-printing');
    const off = () => { document.body.classList.remove('eb-printing'); window.removeEventListener('afterprint', off); };
    window.addEventListener('afterprint', off);
    try { window.print(); } catch (e) { off(); }
  }

  /* ===================== wiring ===================== */
  SECTIONS.push({ id: 'studio', ico: '✍️', name: 'My Book Studio', sub: 'Write and draw your own books', fn: () => studioHome(), c: '#B4235A',
    tip: 'Let your child choose every word, even silly ones. Read their sentence back with expression and ask "What happens next?" Point to the big letter and the full stop each time.' });
  Object.assign(VIEWS, { studio: studioHome, ideas, cover: coverEdit, page: pageEdit, bookRead, bookDone });
  const prevMore = englishHome.more;
  englishHome.more = b => { const x = prevMore ? prevMore(b) : b; return { ...x, studioTiles: TILE_COUNT, studioPrompts: PROMPTS.length, studioFrames: FRAMES.length, studioStickers: STICKERS.length }; };
  // For the grown-ups' report: books written, read from any saved english state.
  englishHome.studioStats = e => { const l = Array.isArray(o(o(e).mybooks).list) ? o(e).mybooks.list : []; return { books: l.filter(b => b && b.done).length, pages: l.reduce((a, b) => a + (b && Array.isArray(b.pages) ? b.pages.filter(p => p && p.fin).length : 0), 0) }; };
  if (location.hash === '#selftest') window.__book = {
    render, textOf, check, plural, conj, anOf, fillFrame, M, byId, newBook, TILES, PROMPTS, FRAMES, STICKERS, TILE_COUNT,
    get B() { return B; }, set B(v) { B = v; }, get F() { return F; }, get PG() { return PG; }, get RD() { return RD; },
    go: (v, ...a) => go(VIEWS[v], ...a), drawB, studioHome
  };
})();
