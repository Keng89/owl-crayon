/* ---------- welcome tour (once per player) and the grown-ups' "What's inside" guide ---------- */
// The tour shows the first time a player reaches the home screen: 5 big cards, each read aloud and pointing at a real
// home-screen tile. It is stored per player as st.tour. Automated runs (#selftest or a webdriver) skip it unless
// window.__owlTourForce is set, so older tests can click tiles without a card in the way.
const tour = (() => {
  // Data that lives inside other modules' closures; t26.js checks these against the real data.
  const FIXED = { coloring: 26, places: 15, chapters: 5, stops: 9, shapes: 27 };
  const auto = () => window.__owlTourForce || !(location.hash === '#selftest' || navigator.webdriver);
  let cur = null; // { root, i, steps, off }

  function steps() {
    const n = esc(st.pet.name), egg = petStage(st.pet.xp) === 0;
    return [
      { sel: '#petBtn', ico: '🦉', title: `Hi${st.name ? ', ' + esc(st.name) : ''}! I'm Owl.`, text: egg ? `This egg is ${n}. Stars help ${n} hatch and grow!` : `This is ${n}, your owl. Stars help ${n} grow!` },
      { sel: '#tMath', ico: '🔢', title: 'Number Garden', text: 'Tap here for numbers. Count, add and play games!' },
      { sel: '#tArt', ico: '🖍️', title: 'Art School', text: 'Tap here to draw and color. I show you each step.' },
      { sel: '#tQuest', ico: '🗺️', title: "Owl's Quest", text: 'A story trip! Help me find the lost crayons.' },
      { sel: '.quest', ico: '🎁', title: "Today's quest", text: 'Do 3 little jobs. Then open the treasure chest!' }
    ];
  }

  function maybe() {
    if (st.tour || cur || !auto()) return;
    setTimeout(() => { if (!st.tour && !cur && document.getElementById('tMath')) start(); }, 250);
  }

  function start() {
    close();
    if (!document.getElementById('tMath')) return;
    const root = document.createElement('div');
    root.className = 'wt'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-labelledby', 'wtTitle');
    root.innerHTML = `<div class="wt-shade"></div><div class="wt-spot" aria-hidden="true"></div>
      <div class="wt-card"><div class="wt-head"><span class="wt-owl" aria-hidden="true"></span><div><h2 id="wtTitle"></h2><p class="wt-text"></p></div></div>
        <div class="wt-dots" aria-hidden="true"></div>
        <div class="wt-nav"><button class="wt-skip" id="wtSkip">Skip</button><button class="wt-say" id="wtSay" aria-label="Say it again">🔊</button><button class="wt-next" id="wtNext">Next ▶</button></div></div>`;
    document.body.appendChild(root);
    const onKey = e => { if (e.key === 'Escape') finish('skip'); };
    const onMove = () => place(false), onSize = () => place(true);
    addEventListener('keydown', onKey); addEventListener('scroll', onMove, { passive: true }); addEventListener('resize', onSize);
    cur = { root, i: 0, steps: steps(), off: () => { removeEventListener('keydown', onKey); removeEventListener('scroll', onMove); removeEventListener('resize', onSize); } };
    root.querySelector('#wtSkip').onclick = () => finish('skip');
    root.querySelector('#wtSay').onclick = () => speak();
    root.querySelector('#wtNext').onclick = () => { if (!cur) return; if (cur.i < cur.steps.length - 1) { cur.i++; tone([600]); show(); } else finish('done'); };
    show();
  }

  function speak() { if (cur) { const s = cur.steps[cur.i]; say(`${s.title} ${s.text}`); } }

  function show() {
    const { root, i, steps: ss } = cur, s = ss[i];
    root.querySelector('.wt-owl').textContent = s.ico;
    root.querySelector('#wtTitle').innerHTML = s.title;
    root.querySelector('.wt-text').innerHTML = s.text;
    root.querySelector('.wt-dots').innerHTML = ss.map((_, k) => `<i class="${k === i ? 'on' : k < i ? 'done' : ''}"></i>`).join('');
    root.querySelector('#wtNext').textContent = i === ss.length - 1 ? "Let's play! 🎉" : 'Next ▶';
    root.dataset.step = i;
    place(true);
    try { root.querySelector('#wtNext').focus({ preventScroll: true }); } catch (e) {}
    speak();
  }

  // Scroll the tile into the part of the screen the card does not cover, then ring it with the spotlight.
  function place(scroll) {
    if (!cur) return;
    const { root } = cur, card = root.querySelector('.wt-card'), spot = root.querySelector('.wt-spot');
    const t = view.querySelector(cur.steps[cur.i].sel);
    if (!document.getElementById('tMath')) { close(); return; } // the home screen went away
    if (!t) { spot.hidden = true; root.classList.add('wt-dim'); root.classList.remove('wt-top'); return; }
    spot.hidden = false; root.classList.remove('wt-dim');
    const H = innerHeight, ch = card.offsetHeight + 24;
    if (scroll) {
      root.classList.remove('wt-top');
      const r = t.getBoundingClientRect(), room = H - ch;
      const y = r.height + 24 > room ? r.top - 12 : r.top + r.height / 2 - room / 2;
      scrollTo(0, Math.max(0, scrollY + y));
    }
    const r = t.getBoundingClientRect(), pad = 8;
    if (scroll) root.classList.toggle('wt-top', r.bottom + pad > H - ch && r.top - pad > ch);
    Object.assign(spot.style, { left: r.left - pad + 'px', top: r.top - pad + 'px', width: r.width + pad * 2 + 'px', height: r.height + pad * 2 + 'px' });
  }

  function close() {
    if (!cur) return;
    cur.off(); cur.root.remove(); cur = null;
    try { speechSynthesis.cancel(); } catch (e) {}
  }
  function finish(how) {
    if (!cur) return;
    close();
    st.tour = { at: today(), how }; save();
    if (how === 'done') { yay(); say("Let's play! Tap a picture to start."); }
  }

  function replay() { go(home); setTimeout(start, 60); }

  /* --- Grown-ups corner --- */
  const panel = () => `<div class="panel wt-gp"><h2>📖 New here?</h2><p class="note">A short guide to everything in the app, how levels work, and tips for a first session.</p>
    <div class="row" style="justify-content:flex-start"><button class="btn" id="wtInside">What's inside</button><button class="btn alt" id="wtReplay">🦉 Replay welcome tour</button></div></div>`;
  function wire() {
    const a = $('#wtInside'), b = $('#wtReplay');
    if (a) a.onclick = () => go(inside);
    if (b) b.onclick = replay;
  }

  const stat = (n, label) => `<div class="wt-stat"><b>${n}</b><span>${label}</span></div>`;
  const li = a => `<ul class="wt-list">${a.map(x => `<li>${x}</li>`).join('')}</ul>`;
  function ageBands() {
    const out = [];
    for (let a = 3; a <= 16; a++) { const w = ageWorld(a), last = out[out.length - 1]; if (last && last.w === w) last.to = a; else out.push({ w, from: a, to: a }); }
    return out.map(b => `${b.from === b.to ? b.from : b.to === 16 ? b.from + '+' : b.from + '–' + b.to}: ${WORLDS[b.w].ico} ${WORLDS[b.w].name}`);
  }
  function inside() {
    const topics = Object.keys(MATH).length, nm = esc(st.name || 'your child');
    const lv = [1, 2, 3].map(l => `${LESSONS.filter(x => x.level === l).length} ${LEVEL_NAMES[l]}`).join(', ');
    const firstGames = GAMES.slice(0, 2).map(g => `${g.ico} ${g.name}`).join(' or ');
    const nl = nextLesson(), aw = WORLDS[ageWorld(st.age)];
    view.innerHTML = `${crumbs("What's inside")}
      <div class="panel"><h2>At a glance</h2>
        <div class="wt-stats">${stat(topics, `math topics in ${WORLDS.length} worlds`)}${stat(GAMES.length, 'math games')}${stat(21, 'numbers to trace (0–20)')}${stat(LESSONS.length, 'step-by-step art lessons')}${stat(ART_CATS.length, 'kinds of art')}${stat(FIXED.coloring, 'coloring pages')}${stat(FIXED.places, 'sticker-scene places')}${stat(FIXED.shapes, 'shape puzzles')}${stat(PICS.length, 'pixel pictures')}${stat(FIXED.chapters, `story chapters of ${FIXED.stops} stops`)}${stat(KB.length, 'offline Owl answers')}${stat(BADGES.length, 'badges')}</div>
        <p class="note">Everything works offline, with no ads and no accounts. Each player has their own progress, owl and pictures.</p></div>
      <div class="panel"><h2>🔢 Number Garden (math)</h2>${li([
        `${WORLDS.map((w, i) => `${w.ico} <b>${w.name}</b> (ages ${w.ages}, ${worldSkills(i).length} topics)`).join(' · ')}.`,
        'Each topic starts with a short lesson Owl reads aloud, then a round of 6–8 questions. 🦉 Hint removes a wrong answer; 💡 shows the method.',
        `<b>Write numbers</b>: trace 0–20 with a finger. <b>Math games</b>: ${GAMES.map(g => g.name).join(', ')}.`])}</div>
      <div class="panel"><h2>🖍️ Art School</h2>${li([
        `${LESSONS.length} drawing lessons in ${ART_CATS.length} kinds (${lv}). Each step draws itself, then your child copies it on the pad; 👻 Trace shows faint lines.`,
        `Studio: free draw, mandala mode, ${PICS.length} pixel pictures, color mixing, a coloring book of ${FIXED.coloring} pages (tap to fill, color by number) sticker scenes in ${FIXED.places} places, and ${FIXED.shapes} shape puzzles (drag shapes into a picture, easy to tangram).`,
        'Finished drawings are saved in <b>My pictures</b>.'])}</div>
      <div class="panel"><h2>🗺️ Owl's Quest, daily quest and owl</h2>${li([
        `<b>Owl's Quest</b>: a story map of ${FIXED.chapters} chapters. Each stop is a few math puzzles, a drawing, or a story choice. Finished chapters become a storybook.`,
        "<b>Today's quest</b> on the home screen: 3 small jobs a day, then a treasure chest.",
        `<b>Owl pet</b>: stars help ${esc(st.pet.name)} hatch and grow and unlock outfits. Every 10 stars gives a sticker; ${BADGES.length} badges mark milestones.`,
        '<b>Ask Owl</b>: offline answers to common questions. Questions it can\'t answer appear in Teach Owl. Online Owl is optional and off by default.'])}</div>
      <div class="panel"><h2>🎚️ Levels and age</h2>${li([
        `Age sets the starting math world: ${ageBands().join(' · ')}. Earlier worlds count as partly learned, and the next world is open too.`,
        'Any other world opens when the one before it reaches 50%. Each topic has 5 levels.',
        'Art: Explorer lessons open after 3 Beginner lessons (or at age 8+), Master after 3 Explorer (or 10+). Games start at your child\'s age and step up after 3 right in a row.',
        `Change age, name, read-aloud, or "Open every world" under <b>Settings</b> in the Grown-ups corner. ${nm} is set to age ${st.age}, starting in ${aw.ico} ${aw.name}.`])}</div>
      <div class="panel"><h2>🧠 How Owl learns your child</h2>${li([
        'Every topic has a mastery score. A right answer on the first try raises it (more when quick); a mistake lowers it. The level follows the score.',
        'After a mistake Owl explains the answer right away, and the question goes into review.',
        `Missed questions come back after ${BOXES.join(', ')} days. Answered right each time, they leave the review list.`,
        'The yellow suggestion on the home screen picks a review, an art lesson, or the topic that is "just right" (not too easy, not too hard).'])}</div>
      <div class="panel"><h2>📊 Progress and backup</h2>${li([
        'In the Grown-ups corner: <b>This week</b> (days played, stars, first-try %), <b>Math progress</b> per topic, <b>Art progress</b>, <b>Teach Owl</b>.',
        'Progress is saved only on this device. Use <b>Backup</b> (under Players) to save a file now and then, and to restore it on a new device.',
        '<b>⏰ Play time</b>: minutes played each day per player, with an optional daily limit and wiggle-break reminders. Off unless you turn them on.'])}</div>
      <div class="panel wt-tips"><h2>⏱️ A first 15 minutes with a 5-year-old</h2>
        <ol class="wt-list">
          <li><b>0–2 min:</b> Sit together, sound up. Let your child do the tapping. Watch Owl's welcome tour (you can replay it).</li>
          <li><b>2–6 min:</b> Number Garden → ${WORLDS[0].ico} ${WORLDS[0].name} → the topic marked "Try this". Let mistakes happen; Owl shows how.</li>
          <li><b>6–9 min:</b> Math games → ${firstGames}.</li>
          <li><b>9–14 min:</b> Art School → ${nl ? `"Next lesson: ${esc(nl.title)}"` : 'a Beginner lesson'}, drawing along step by step. Coloring book is a good switch if hands get tired.</li>
          <li><b>14–15 min:</b> Back home: look at the stars and the owl egg. Stop while it is still fun. Tomorrow brings a new daily quest.</li>
        </ol>
        <p class="note">Tips: the 🔊 button at the top reads any screen again. No voice? Check the volume and "Read everything aloud" in Settings. Short daily visits work better than long ones.</p></div>
      <div class="row" style="justify-content:flex-start"><button class="btn" id="wtBack">Back to Grown-ups corner</button><button class="btn alt" id="wtReplay">🦉 Replay welcome tour</button></div>`;
    wireBack(parent);
    $('#wtBack').onclick = () => go(parent);
    $('#wtReplay').onclick = replay;
  }

  if (location.hash === '#selftest') window.__tour = { FIXED, start, replay, inside, steps, get open() { return !!cur; }, get step() { return cur ? cur.i : -1; } };
  return { maybe, start, panel, wire, inside };
})();
