/* ---------- progress report: what a child learned across the whole app, for the Grown-ups corner ---------- */
// Everything is read from a player's saved state on this device (and their saved pictures), never sent anywhere.
// It works for any player, not only the one playing now, and every field is read defensively, so a brand-new
// player or a state saved by an older version (no st.english, st.crafts, st.world, st.story, st.pt...) shows zeros
// instead of breaking. "This week" adds 3 suggestions picked from the gaps. A print button prints only the report.
const report = (() => {
  let shown = null; // which player's report is on screen
  const num = v => (Number.isFinite(+v) ? +v : 0);
  const obj = v => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
  const arr = v => (Array.isArray(v) ? v : []);
  const keys = v => Object.keys(obj(v));
  const pc = (a, b) => (b > 0 ? Math.max(0, Math.min(100, Math.round(a / b * 100))) : 0);
  const pl = (n, w, p = w + 's') => `${n} ${n === 1 ? w : p}`;
  const dstr = t => t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
  const safe = (f, d) => { try { const v = f(); return v == null ? d : v; } catch (e) { return d; } };

  // A copy of another player's state, filled in the way loading that player would fill it.
  function stateOf(id) {
    if (id === pid) return { s: st, gal: arr(gallery) };
    let s = safe(() => JSON.parse(JSON.stringify(store.get('state:' + id, null))), null);
    if (!s || typeof s !== 'object') s = freshState();
    s = safe(() => migrate(s), s);
    return { s, gal: arr(store.get('gallery:' + id, [])) };
  }

  function stats(id) {
    const { s, gal } = stateOf(id), dn = dayNum(today());
    // --- this week, from the daily log and the play-time minutes ---
    const log = obj(s.days), ptMin = obj(obj(s.pt).min), shMin = obj(obj(store.get('pt:' + id, null)).min);
    const week = Array.from({ length: 7 }, (_, i) => {
      const t = new Date(); t.setDate(t.getDate() - 6 + i); const d = dstr(t), x = obj(log[d]);
      return { d, w: t.toLocaleDateString('en', { weekday: 'short' }), q: num(x.q), ok: num(x.ok), stars: num(x.stars), art: num(x.art), en: num(x.en), cr: num(x.cr),
        min: Math.round(Math.max(num(ptMin[d]), num(shMin[d])) / 60) };
    });
    const wsum = k => week.reduce((a, x) => a + x[k], 0);
    const W = { days: week, q: wsum('q'), ok: wsum('ok'), stars: wsum('stars'), art: wsum('art'), en: wsum('en'), cr: wsum('cr'), min: wsum('min'),
      active: week.filter(x => x.q || x.stars || x.art || x.min).length };

    // --- math ---
    const sk = obj(s.skills), mk = Object.keys(MATH).map(k => ({ k, x: obj(sk[k]) }));
    const tried = mk.filter(o => num(o.x.seen) > 0), hist = tried.flatMap(o => arr(o.x.hist));
    const accOf = o => { const h = arr(o.x.hist); return h.length ? h.reduce((a, b) => a + num(b), 0) / h.length : null; };
    const rated = tried.filter(o => num(o.x.seen) >= 5 && accOf(o) != null).sort((a, b) => accOf(b) - accOf(a));
    const review = arr(s.review).filter(r => r && MATH[r.skill]);
    const M = { topics: mk.length, tried: tried.length, mastered: tried.filter(o => num(o.x.m) >= 0.8).length, answered: tried.reduce((a, o) => a + num(o.x.seen), 0),
      acc: hist.length ? Math.round(hist.reduce((a, b) => a + num(b), 0) / hist.length * 100) : null, review: review.length, due: review.filter(r => num(r.due) <= dn).length,
      best: rated[0] ? { ...MATH[rated[0].k], acc: Math.round(accOf(rated[0]) * 100) } : null,
      hard: (() => { const h = [...rated].reverse().find(o => accOf(o) < 0.7); return h && h !== rated[0] ? { ...MATH[h.k], acc: Math.round(accOf(h) * 100) } : null; })() };

    // --- English & Reading ---
    const e = obj(s.english), heard = keys(e.heard), rounds = obj(e.rounds), A = safe(() => englishHome.api, {});
    const stageN = safe(() => A.stageFor(s), 1), STAGES = arr(A.STAGES);
    const sightAll = EN_SIGHT.reduce((a, x) => a + x.words.length, 0), sightKnown = EN_SIGHT.reduce((a, x) => a + x.words.filter(w => obj(e.sight)[w]).length, 0);
    const wotd = obj(e.wotd), rev = Object.values(obj(e.review)).filter(r => r && typeof r === 'object');
    const E = { stage: stageN, stageName: (STAGES[stageN - 1] || {}).name || 'Sound Seeds', stageIco: (STAGES[stageN - 1] || {}).ico || '🌱', stages: STAGES.length || 5, xp: num(e.xp),
      letters: Math.min(26, heard.filter(k => k.length === 1).length), sounds: heard.length, soundsAll: EN_LETTERS.length + EN_DIGRAPHS.length + EN_MAGIC.length + EN_TEAMS.length,
      sight: sightKnown, sightAll, album: keys(e.got).filter(k => num(e.got[k]) >= 2 && EN_WORD[k]).length,
      stories: EN_STORIES.filter(x => obj(e.stories)[x.id]).length, storiesAll: EN_STORIES.length,
      grammar: EN_GAMES.filter(g => num(rounds['g-' + g.id]) > 0).length, grammarAll: EN_GAMES.length,
      grammarRounds: EN_GAMES.reduce((a, g) => a + num(rounds['g-' + g.id]), 0), blend: num(rounds.blend),
      streak: wotd.last && dn - dayNum(wotd.last) <= 1 ? num(wotd.streak) : 0, bestStreak: num(wotd.best), wotdDays: num(wotd.n),
      review: rev.length, reviewDue: rev.filter(r => num(r.due) <= dn).length, pals: keys(e.pals).length };
    // Round 3 (english8.js): letters traced, sound games, Talk time chats, chapter books, grammar islands, missions.
    E.r3 = Object.assign({ traced: 0, tracedAll: 52, words: 0, chats: 0, scenes: 0, scenesAll: 0, books: 0, booksAll: 0, chapters: 0, islands: 0, islandsAll: 9, sound: 0, missions: 0 }, safe(() => englishHome.round3(e), {}));
    E.nextSight = EN_SIGHT.find(x => x.stage <= stageN && x.words.some(w => !obj(e.sight)[w]));
    E.nextStory = EN_STORIES.find(x => x.stage <= stageN && !obj(e.stories)[x.id]);
    E.nextGame = EN_GAMES.find(x => x.stage <= stageN && !num(rounds['g-' + x.id]));

    // --- art ---
    const art = obj(s.art), done = obj(art.done), lessons = safe(() => [...LESSONS], []);
    const R = { done: lessons.filter(l => done[l.id]).length, all: lessons.length, pixel: num(art.pixel) || 1, pixelDone: keys(art.pixelDone).length, pics: gal.length,
      levels: [1, 2, 3].map(lv => ({ name: LEVEL_NAMES[lv], have: lessons.filter(l => l.level === lv && done[l.id]).length, all: lessons.filter(l => l.level === lv).length })) };

    // --- crafts ---
    const cr = obj(s.crafts), cdone = obj(cr.done), crafts = safe(() => craftsHome.all(), []), CL = safe(() => craftsHome.LEVELS, []);
    const madeIds = Object.keys(cdone).filter(k => crafts.some(c => c.id === k));
    const maxLv = num(s.age) <= 5 ? 1 : num(s.age) <= 7 ? 2 : num(s.age) <= 9 ? 3 : 4, todo = crafts.filter(c => !cdone[c.id]);
    const C = { made: madeIds.length, all: crafts.length, times: madeIds.reduce((a, k) => a + (num(obj(cdone[k]).n) || 1), 0),
      levels: CL.map(L => ({ name: L.name, ico: L.ico, have: crafts.filter(c => c.lv === L.n && cdone[c.id]).length, all: crafts.filter(c => c.lv === L.n).length })),
      next: todo.filter(c => c.lv <= maxLv).sort((a, b) => a.lv - b.lv)[0] || todo[0] || null };

    // --- My World ---
    const w = obj(s.world), items = arr(w.items).filter(o => o && typeof o === 'object'), wi = safe(() => worldHome.info(), {});
    const Wd = { earned: num(s.stars), spent: num(w.spent), wallet: Math.max(0, num(s.stars) - num(w.spent)), items: items.length,
      animals: items.filter(o => safe(() => worldHome.kind(o.id), '') === 'animal').length, lands: Math.max(0, arr(w.lands).length - 1), landsAll: num(wi.lands), landMin: num(wi.landMin) || 30 };

    // --- Owl's Quest ---
    const CH = arr(safe(() => storyHome.CH, [])), sy = obj(s.story), sd = obj(sy.done);
    const Q = { chapters: CH.filter((c, i) => obj(sy.got)[i]).length, chaptersAll: CH.length, stops: CH.reduce((a, c, i) => a + arr(c.stops).filter((_, j) => sd[i + '-' + j]).length, 0),
      stopsAll: CH.reduce((a, c) => a + arr(c.stops).length, 0) };
    Q.now = CH.findIndex((c, i) => !obj(sy.got)[i]);
    Q.nowName = Q.now >= 0 ? CH[Q.now].title : '';
    Q.nowStops = Q.now >= 0 ? arr(CH[Q.now].stops).filter((_, j) => sd[Q.now + '-' + j]).length : 0;
    Q.nowAll = Q.now >= 0 ? arr(CH[Q.now].stops).length : 0;

    // --- overall ---
    const pet = obj(s.pet), ps = safe(() => petStage(num(pet.xp)), 0);
    const O = { name: s.name || 'Player', age: num(s.age) || '?', avatar: (profileOf(id) || {}).avatar || '🦉', stars: num(s.stars), streak: num(obj(s.streak).n),
      best: Math.max(num(s.bestStreak), num(obj(s.streak).n)), badges: keys(s.badges).length, badgesAll: BADGES.length, owl: (PET_STAGES[ps] || PET_STAGES[0])[2], owlName: pet.name || 'Hoot',
      quests: num(s.questsDone), limit: num(obj(s.pt).limit) };
    return { id, O, W, M, E, R, C, Wd, Q };
  }

  // Three friendly next steps, picked from the gaps: at most one per area first, the most useful first.
  function suggestions(S) {
    const { M, E, R, C, Wd, Q, W } = S, out = [];
    const add = (area, score, ico, text) => out.push({ area, score, ico, text });
    // English
    if (E.letters >= 6 && E.blend === 0) add('en', 92, '🧩', `Try the Blend it game in English & Reading — ${E.letters} letter sounds learned, blending not started yet.`);
    else if (E.letters < 26) add('en', E.letters ? 72 : 80, '🔤', `Letter sounds: ${E.letters} of 26 letters heard so far. Tap through the rest together in English & Reading, saying the sound ("sss"), not the name.`);
    if (E.reviewDue) add('en', 86, '🔁', `Owl's review has ${pl(E.reviewDue, 'word')} waiting (English & Reading → My words). A 2-minute round helps them stick.`);
    if (E.nextSight && E.sight < E.sightAll) add('en', 60, '👀', `Sight words: ${E.sight} of ${E.sightAll} known. Try "Find the word" in the ${E.nextSight.name} set.`);
    if (E.nextStory) add('en', 56, '📖', `Read "${E.nextStory.title}" together (English & Reading → Read). ${E.stories} of ${E.storiesAll} stories read so far.`);
    if (E.grammar === 0 && E.stage >= 2 && E.nextGame) add('en', 52, E.nextGame.ico, `Try a grammar game: ${E.nextGame.name}. No grammar games played yet.`);
    if (E.letters >= 10 && E.r3.traced === 0) add('en', 48, '✍️', `Try Write letters in English & Reading: ${E.letters} letter sounds heard, no letters traced yet. Start at the green dot.`);
    if (E.stage >= 3 && E.r3.books === 0) add('en', 50, '📚', 'Read a chapter book together (English & Reading → Chapter books). One chapter a day is plenty.');
    if (E.streak === 0 && E.wotdDays > 0) add('en', 38, '☀️', `Start a new word-of-the-day streak (best so far: ${pl(E.bestStreak, 'day')}).`);
    // Math
    if (M.tried === 0) add('math', 88, '🔢', 'Open the Number Garden and try a first math topic. Owl picks a starting level from your child\'s age.');
    if (M.due) add('math', 82, '🔁', `${pl(M.due, 'math question')} ${M.due === 1 ? 'is' : 'are'} due for review. Missed questions come back so they stick.`);
    if (M.hard) add('math', 76, M.hard.ico, `Practise ${M.hard.name} together: ${M.hard.acc}% right on the first try lately. Use real things (coins, toys, fingers).`);
    if (M.tried && W.q === 0) add('math', 46, '🎈', 'No math this week yet. A quick math game (Balloon Pop, Frog Hop...) is a fun way back in.');
    // Art
    if (R.done === 0) add('art', 66, '🖍️', 'Try a first step-by-step lesson in Art School. Each step draws itself first.');
    else if (R.levels[1] && R.levels[1].have === 0 && R.done >= 5) add('art', 34, '🎨', `Art: ${R.done} lessons done. Try an Explorer-level lesson next.`);
    // Crafts
    if (C.next) add('cr', C.made ? 32 : 62, C.next.ico || '✂️', `${C.made ? 'Next craft idea' : 'Make a first craft together'}: ${C.next.name} (${C.next.min} min).`);
    // Owl's Quest
    if (Q.chaptersAll && Q.stops === 0) add('quest', 58, '🗺️', 'Start Owl\'s Quest: a story map with math, drawing and story stops.');
    else if (Q.now >= 0 && Q.nowAll) add('quest', 30, '🗺️', `Owl's Quest: ${Q.nowStops} of ${Q.nowAll} stops done in "${Q.nowName}". Carry on the story.`);
    // My World
    if (Wd.wallet >= Wd.landMin) add('world', 42, '🌍', `${Wd.wallet} stars saved up for My World. Spending them together is real counting-change math.`);
    out.sort((a, b) => b.score - a.score);
    const pick = [], seen = new Set();
    out.forEach(x => { if (pick.length < 3 && !seen.has(x.area)) { pick.push(x); seen.add(x.area); } });
    out.forEach(x => { if (pick.length < 3 && !pick.includes(x)) pick.push(x); });
    return pick;
  }

  /* --- drawing --- */
  const row = (label, have, all, color = 'var(--leaf)') => `<div class="rp-row"><span class="rp-l">${label}</span><span class="rp-b" role="img" aria-label="${have} of ${all}"><i style="width:${pc(have, all)}%;background:${color}"></i></span><b class="rp-v">${have}<small> / ${all}</small></b></div>`;
  const fact = (label, value) => `<div class="rp-f"><span>${label}</span><b>${value}</b></div>`;
  const ring = (p, color, label) => p == null ? `<div class="rp-ring none"><b>–</b><small>${label}</small></div>`
    : `<div class="rp-ring"><svg viewBox="0 0 36 36" role="img" aria-label="${label}: ${p}%"><circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--line)" stroke-width="4"/><circle cx="18" cy="18" r="15.9" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${Math.max(0.01, p)} 100" transform="rotate(-90 18 18)"/><text x="18" y="21" text-anchor="middle" font-size="9" font-weight="800" fill="var(--ink)">${p}%</text></svg><small>${label}</small></div>`;
  const chart = (days, k, color, label, unit) => { const max = Math.max(1, ...days.map(x => x[k]));
    return `<figure class="rp-chart"><figcaption>${label}</figcaption><div class="week" role="img" aria-label="${esc(label)}: ${days.map(x => `${x.w} ${x[k]}`).join(', ')}">${days.map(x => `<div class="wk"><i style="height:${Math.round(x[k] / max * 70)}px;background:${color}"></i><b>${x[k]}</b><span>${x.w}</span></div>`).join('')}</div>${unit ? `<p class="note">${unit}</p>` : ''}</figure>`; };
  const card = (cls, ico, title, body) => `<section class="rp-card ${cls}"><h3><span aria-hidden="true">${ico}</span> ${title}</h3>${body}</section>`;

  function panel(id) {
    if (id) shown = id;
    if (!profiles.some(p => p.id === shown)) shown = pid;
    const S = stats(shown), { O, W, M, E, R, C, Wd, Q } = S, tips = suggestions(S);
    const when = new Date().toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const summary = [`Played on ${pl(W.active, 'day')} of the last 7`, W.min ? `about ${pl(W.min, 'minute')} in all` : '',
      W.q ? `${pl(W.q, 'math question')} (${Math.round(W.ok / W.q * 100)}% right first try)` : '', W.en ? `${pl(W.en, 'reading star')}` : '',
      W.art ? `${pl(W.art, 'art lesson, drawing or craft', 'art lessons, drawings and crafts')}` : '', W.cr ? `including ${pl(W.cr, 'craft')}` : '', `${pl(W.stars, 'star')} earned`].filter(Boolean).join(' · ');
    return `<section class="panel rp" id="report" aria-labelledby="rpH">
      <div class="rp-head"><h2 id="rpH">📋 Progress report</h2><button class="btn rp-print" id="rpPrint" type="button">🖨️ Print / save as PDF</button></div>
      ${profiles.length > 1 ? `<div class="chips rp-who" role="group" aria-label="Show the report for">${profiles.map(p => `<button type="button" data-rp="${p.id}" aria-pressed="${p.id === shown}">${p.avatar} ${esc(nameOf(p.id))}</button>`).join('')}</div>` : ''}
      <p class="rp-for"><span class="rp-av" aria-hidden="true">${O.avatar}</span><span><b>${esc(O.name)}</b>, age ${O.age}<small>${when} · from this device only</small></span></p>
      <div class="rp-tiles">
        <div class="rp-tile"><b>⭐ ${O.stars}</b><small>stars earned</small></div>
        <div class="rp-tile"><b>🔥 ${O.streak}</b><small>days in a row (best ${O.best})</small></div>
        <div class="rp-tile"><b>🏅 ${O.badges}<small>/${O.badgesAll}</small></b><small>badges</small></div>
        <div class="rp-tile"><b>🦉 ${esc(O.owl)}</b><small>${esc(O.owlName)} the owl</small></div>
      </div>
      <section class="rp-week"><h3>This week</h3>
        <p class="rp-sum">${summary}.</p>
        <div class="rp-charts">${chart(W.days, 'stars', 'var(--sun)', 'Stars each day')}${chart(W.days, 'min', 'var(--sky)', 'Minutes played each day', W.min ? '' : 'Minutes are counted while the app is open on this device; none recorded this week yet.')}</div>
        <h4>Try next</h4>
        <ol class="rp-sugg">${tips.map(t => `<li data-area="${t.area}"><span class="rp-si" aria-hidden="true">${t.ico}</span><span>${esc(t.text)}</span></li>`).join('')}</ol>
      </section>
      <div class="rp-grid">
        ${card('rp-math', '🔢', 'Math', `<div class="rp-split">${ring(M.acc, 'var(--leaf)', 'right first try')}<div class="rp-rows">
          ${row('Topics mastered', M.mastered, M.topics, 'var(--leaf)')}${row('Topics tried', M.tried, M.topics, 'var(--leaf-soft)')}</div></div>
          ${fact('Questions answered', M.answered)}${fact('In review / due today', `${M.review} / ${M.due}`)}
          ${M.best ? fact('Strongest topic', `${M.best.ico} ${esc(M.best.name)} (${M.best.acc}%)`) : ''}${M.hard ? fact('Worth practising', `${M.hard.ico} ${esc(M.hard.name)} (${M.hard.acc}%)`) : ''}`)}
        ${card('rp-en', '📚', 'English &amp; Reading', `<p class="rp-stage">${E.stageIco} Stage ${E.stage} of ${E.stages}: <b>${esc(E.stageName)}</b> · ${pl(E.xp, 'reading star')}</p>
          ${row('Letter sounds (A–Z)', E.letters, 26, 'var(--coral)')}${row('All sounds (pairs, magic e, teams)', E.sounds, E.soundsAll, 'var(--coral-soft)')}
          ${row('Sight words known', E.sight, E.sightAll, 'var(--sky)')}${row('Stories read', E.stories, E.storiesAll, 'var(--leaf)')}
          ${row('Grammar games played', E.grammar, E.grammarAll, 'var(--grape)')}
          ${fact('Words in the word album', E.album)}${fact('Word-of-the-day streak', `${pl(E.streak, 'day')} (best ${E.bestStreak})`)}${fact('Words in Owl\'s review / due', `${E.review} / ${E.reviewDue}`)}${fact('Blend it rounds', E.blend)}
          ${row('Letters traced (A–Z, a–z)', E.r3.traced, E.r3.tracedAll, 'var(--sky-soft)')}${row('Grammar island badges', E.r3.islands, E.r3.islandsAll, 'var(--grape-soft)')}${row('Chapter books read', E.r3.books, E.r3.booksAll, 'var(--leaf-soft)')}
          ${fact('Words traced', E.r3.words)}${fact('Talk time chats', `${E.r3.chats} (${E.r3.scenes} of ${E.r3.scenesAll} places)`)}${fact('Sound game rounds', E.r3.sound)}${fact('English missions done', E.r3.missions)}`)}
        ${card('rp-art', '🖍️', 'Art', `${row('Art lessons done', R.done, R.all, 'var(--coral)')}${R.levels.map(l => row(`${l.name} lessons`, l.have, l.all, 'var(--coral-soft)')).join('')}
          ${fact('Pictures saved', R.pics)}${fact('Pixel art', `level ${R.pixel} of 5 · ${pl(R.pixelDone, 'picture')}`)}`)}
        ${card('rp-cr', '✂️', 'Crafts', `${row('Crafts made', C.made, C.all, 'var(--sun)')}${C.levels.map(l => row(`${l.ico} ${l.name}`, l.have, l.all, 'var(--sun-soft)')).join('')}${fact('Times making crafts', C.times)}`)}
        ${card('rp-world', '🌍', 'My World', `${row('Stars spent', Wd.spent, Wd.earned, 'var(--sky)')}
          ${fact('Stars earned / to spend', `${Wd.earned} / ${Wd.wallet}`)}${fact('Things owned', `${Wd.items} (${pl(Wd.animals, 'animal')})`)}${fact('Lands opened', `${Wd.lands} of ${Wd.landsAll}`)}`)}
        ${card('rp-quest', '🗺️', 'Owl\'s Quest', `${row('Chapters finished', Q.chapters, Q.chaptersAll, 'var(--grape)')}${row('Story stops done', Q.stops, Q.stopsAll, 'var(--grape-soft)')}
          ${Q.now >= 0 && Q.nowAll ? fact('Now on', `${esc(Q.nowName)} (${Q.nowStops}/${Q.nowAll})`) : fact('Now on', 'all chapters done!')}`)}
      </div>
      <p class="note rp-foot">Owl &amp; Crayon · progress is stored only on this device. Daily quests finished: ${O.quests}.${O.limit ? ` Daily play limit: ${O.limit} minutes.` : ''}</p>
    </section>`;
  }
  function wire() {
    const box = view.querySelector('#report'); if (!box) return;
    box.querySelectorAll('[data-rp]').forEach(b => b.onclick = () => { shown = b.dataset.rp; box.outerHTML = panel(); wire(); const n = view.querySelector(`[data-rp="${shown}"]`); try { n && n.focus({ preventScroll: true }); } catch (e) {} });
    box.querySelector('#rpPrint').onclick = () => {
      document.body.classList.add('rp-printing');
      const off = () => { document.body.classList.remove('rp-printing'); window.removeEventListener('afterprint', off); };
      window.addEventListener('afterprint', off);
      try { window.print(); } catch (e) { off(); }
    };
  }
  if (location.hash === '#selftest') window.__report = { stats, suggestions, panel, wire, set shown(v) { shown = v; }, get shown() { return shown; } };
  return { panel, wire, stats, suggestions };
})();
