/* ---------- welcome tour (once per player) and the grown-ups' "What's inside" guide ---------- */
// The tour shows the first time a player reaches the home screen: 7 big cards, each read aloud and pointing at a real
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
      { sel: '#tEnglish', ico: '📚', title: 'English & Reading', text: 'Tap here to read. Hear sounds, words and stories!' },
      { sel: '#tQuest', ico: '🗺️', title: "Owl's Quest", text: 'A story trip! Help me find the lost crayons.' },
      { sel: '#tWorld', ico: '🌍', title: 'My World', text: 'Spend your stars here. Buy animals, houses and land!' },
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
      // A target near the end of the page (Today's quest, under the area tiles) gets room below it, so it can scroll
      // clear of the card; the room goes when the tour ends.
      const want = scrollY + y, max = document.documentElement.scrollHeight - H;
      if (want > max) view.style.paddingBottom = (parseFloat(view.style.paddingBottom) || 0) + want - max + 'px';
      scrollTo(0, Math.max(0, want));
    }
    const r = t.getBoundingClientRect(), pad = 8;
    if (scroll) root.classList.toggle('wt-top', r.bottom + pad > H - ch && r.top - pad > ch);
    Object.assign(spot.style, { left: r.left - pad + 'px', top: r.top - pad + 'px', width: r.width + pad * 2 + 'px', height: r.height + pad * 2 + 'px' });
  }

  function close() {
    if (!cur) return;
    cur.off(); cur.root.remove(); cur = null; view.style.paddingBottom = '';
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
        <div class="wt-stats">${stat(topics, `math topics in ${WORLDS.length} worlds`)}${stat(GAMES.length, 'math games')}${stat(21, 'numbers to trace (0–20)')}${stat(LESSONS.length, 'step-by-step art lessons')}${stat(paintStudio.info().lessons, 'painting lessons in the Painting Studio')}${stat(ART_CATS.length, 'kinds of art')}${stat(FIXED.coloring, 'coloring pages')}${stat(FIXED.places, 'sticker-scene places')}${stat(FIXED.shapes, 'shape puzzles')}${stat(PICS.length, 'pixel pictures')}${stat(FIXED.chapters, `story chapters of ${FIXED.stops} stops`)}${stat(KB.length, 'offline Owl answers')}${stat(BADGES.length, 'badges')}${stat(worldHome.info().items, 'things to buy in My World')}${stat(englishHome.info().words, 'English words in pictures')}${stat(englishHome.info().pathLessons, 'step-by-step reading lessons')}${stat(englishHome.info().stories, 'reading stories')}${stat(englishHome.info().games, 'reading and grammar games')}${stat(craftsHome.info().crafts, 'crafts with step-by-step movies')}${stat(scienceHome.info().topics, 'science topics')}${stat(scienceHome.info().labs, 'science mini-labs')}${stat(scienceHome.info().home, 'experiments to try at home')}</div>
        <p class="note">Everything works offline, with no ads and no accounts. Each player has their own progress, owl and pictures.</p></div>
      <div class="panel"><h2>🔢 Number Garden (math)</h2>${li([
        `${WORLDS.map((w, i) => `${w.ico} <b>${w.name}</b> (ages ${w.ages}, ${worldSkills(i).length} topics)`).join(' · ')}.`,
        'Each topic starts with a short lesson Owl reads aloud, then a round of 6–8 questions. 🦉 Hint removes a wrong answer; 💡 shows the method.',
        `<b>Hands-on real-life math</b> (${Object.values(MATH).filter(s => ['coins5', 'myday', 'purse', 'toyshop', 'setclock', 'blocks', 'thermo', 'pictogram', 'buildbar', 'change5', 'sorting'].includes(s.id)).length} topics): coins and notes, count the purse, pay at the toy shop by tapping coins, give change, set the clock by dragging its hands, my day in order, measure with blocks and a ruler, hot and cold, pictograms, build a bar chart, and Venn and Carroll diagrams. Money is in ${esc(curOf().label.toLowerCase())}; change it under Settings below.`,
        `<b>Write numbers</b>: trace 0–20 with a finger. <b>Math games</b>: ${GAMES.map(g => g.name).join(', ')}.`])}</div>
      <div class="panel"><h2>🖍️ Art School</h2>${li([
        `${LESSONS.length} drawing lessons in ${ART_CATS.length} kinds (${lv}). Each step draws itself, then your child copies it on the pad; 👻 Trace shows faint lines.`,
        `Studio: free draw, mandala mode, ${PICS.length} pixel pictures, color mixing, a coloring book of ${FIXED.coloring} pages (tap to fill, color by number) sticker scenes in ${FIXED.places} places, ${FIXED.shapes} shape puzzles (drag shapes into a picture, easy to tangram), and a flipbook to make drawings move (8 animation lessons).`,
        `<b>Painting Studio</b>: ${paintStudio.info().lessons} painting lessons in ${paintStudio.info().kinds} techniques (watercolor, thick paint, chalk on black paper, ink and wash, spray and stencil, famous art and mixed media) at 4 levels: Easy ${paintStudio.info().levels[0]}, Medium ${paintStudio.info().levels[1]}, Tricky ${paintStudio.info().levels[2]}, Expert ${paintStudio.info().levels[3]}. Each step picks the real brush, paper and paint color on the pad. The <b>Color lab</b> mixes paint blobs by dragging them together (primary and secondary colors, tints with white, shades with black, warm and cool; ${paintStudio.info().find} colors to discover), with a color wheel game, "Match the color" and warm-or-cool sorting. The <b>gallery wall</b> hangs saved paintings in ${paintStudio.info().frames} kinds of frame, with a slideshow.`,
        'Finished drawings are saved in <b>My pictures</b>.'])}</div>
      <div class="panel"><h2>📚 English &amp; Reading</h2>${li([
        `<b>Learn to Read</b> (the big 📖 Today's reading lesson button at the top of English & Reading): a step-by-step daily phonics path of ${englishHome.info().pathLessons} short lessons in ${englishHome.info().pathUnits} units, ${englishHome.info().pathSounds} sounds in order (s a t p i n first, then m d g o c k, ... ch sh th ng, ai ee igh oa oo, ar or ur ow oi, magic e, other spellings), ${englishHome.info().pathTricky} tricky words and ${englishHome.info().pathGrammar} grammar bites. Every lesson: review, a new sound (mouth tip, action, picture, chant), blend words, read ${englishHome.info().pathSentences} decodable sentences in all (only sounds and tricky words already taught), write it on the tracing pad, a tiny game, and a sticker. Stepping stones show progress; a placement check skips known sounds; a gentle check-up ends each unit and missed sounds go to Owl's review. Each lesson has a grown-up tip.`,
        `A reading ladder of ${englishHome.info().stages} stages (Sound Seeds 4–5, Word Builders 5–6, Sentence Explorers 6–7, Story Readers 7–8, Word Wizards 9+). Age opens the matching stage; reading stars open the next ones. Every reading star is a normal star too, so it counts for the owl, stickers and My World.`,
        `<b>Letter sounds</b>: ${englishHome.info().sounds} sound cards (26 letters, letter pairs like sh and ch, magic e, vowel teams), a sound song, and first-sound, magic e and vowel team games. <b>Blend it</b>: ${englishHome.info().blend} words to sound out (c-a-t), each sound lights up, then you pick the picture.`,
        `<b>Sight words</b>: the ${englishHome.info().sight} Dolch words in 5 sets with flash cards and "find the word". <b>Read</b>: word and sentence matching, silly sentences, and ${englishHome.info().stories} short stories with tap-a-word help and questions after.`,
        `<b>Sentence builder</b> (${englishHome.info().build} sentences: word order, capital letter, end mark), <b>${englishHome.info().grammar} grammar games</b> (rhymes, opposites, nouns and verbs, plurals, a/an, in/on/under, pronouns, past tense, punctuation, contractions, synonyms, sound-alikes, word parts...), a <b>word book</b> of ${englishHome.info().words} words in ${englishHome.info().topics} topics, and <b>Say it!</b> with ${englishHome.info().sayings} everyday expressions, friendly slang and idioms explained simply.`,
        `<b>Fun games</b>: bubble pop, Feed Munch the monster, a word treasure hunt and silly sentences. Each finished round brings out a word pal for the reading club (${englishHome.info().pals} to collect).`,
        `<b>Word play</b>: a spelling bee with letter tiles, a story maker (hero, place and problem: ${englishHome.info().tales} stories, read aloud), rhyme time that turns into a song (${englishHome.info().rhymes} rhymes), describe it, a sound safari, ${englishHome.info().twisters} tongue twisters, and listen &amp; tap. The word book has age tiers: first words, more words, and ${englishHome.info().bigwords} big words with meanings.`,
        `<b>Round 3</b>: <b>Write letters</b> (trace all ${englishHome.info().letters} big and small letters stroke by stroke from a green start dot, then ${englishHome.info().traceWords} short words), <b>Sound games</b> (count the sounds, change a sound, first/middle/last sound, clap the beats), <b>Talk time</b> (${englishHome.info().talks} everyday chats with ${englishHome.info().phrases} phrase cards for polite words and friendly slang), <b>${englishHome.info().books} chapter books</b> for stages 3–5 with tap-for-meaning words and who/what/where/why/feeling questions, <b>${englishHome.info().islands} grammar islands</b> with a badge each, and a daily English mission that counts for the quest.`,
        `<b>Round 4</b>: <b>Sound lab</b> (${englishHome.info().families} word family houses where you spin a first letter and Owl says if it is a real word, ${englishHome.info().minPairs} listening pairs like ship/sheep, tricky sounds such as silent k, -tion and soft c, and a sound wall with all ${englishHome.info().wallSounds} sounds of English, each with words and a rhyme), <b>Word power</b> (opposites match, sort into groups, odd one out, ${englishHome.info().compounds} compound words, ${englishHome.info().ladders} word ladders like big → huge → gigantic, ${englishHome.info().homophones} sound-alike sentences, and ${englishHome.info().idioms} more sayings, similes and friendly slang with pictures), <b>Read-along</b> (${englishHome.info().readAlong} stories, chapters and tongue twisters where each word lights up as Owl reads, then "My turn" at your child's pace), and ${englishHome.info().talks} Talk time chats in all.`,
        `<b>✍️ My Book Studio</b>: your child writes and draws their own little books. Sentences are built from ${englishHome.info().studioTiles} big picture word tiles (Who, Does, What, Where &amp; when, Describe, Join, . ! ?), and Owl reads each one aloud. Grammar helps as they write: a or an, he/she/it + verb-s, one cat / two cats, "yesterday" turns verbs into the past (ran, saw, went...), and Owl checks the big letter at the start and the end mark. A book has a cover and 3–8 pages with emoji-sticker pictures; ${englishHome.info().studioPrompts} story starters and ${englishHome.info().studioFrames} fill-the-frame books help the youngest. The bookshelf reads books aloud with each word lighting up, and prints them.`,
        `<b>My words</b>: a word of the day with a daily streak, Owl's review (missed words come back the same day, then after 1 and 3 days, until learned), and a word album that collects a sticker for each word got right twice. Each section ends with a one-line tip for grown-ups.`])}</div>
      <div class="panel"><h2>✂️ Crafts corner</h2>${li([
        `${craftsHome.info().crafts} real crafts in ${craftsHome.info().cats} kinds (origami, paper cutting, collage, paper plates, toilet rolls, cards, playdough, nature, puppets, threading and weaving, recycling, simple sewing, parties, science, string and bracelets, painting, beads and jewelry, costumes, sensory play, building and engineering, gifts for family, the four seasons, no-bake kitchen crafts, music makers, and toys & games), at 4 levels: Easy 4+ (${craftsHome.info().levels[0]}), Medium 6+ (${craftsHome.info().levels[1]}), Tricky 8+ (${craftsHome.info().levels[2]}) and Expert 10+ (${craftsHome.info().levels[3]}).`,
        'Each craft lists what you need and the time it takes. Every step is a short looping movie drawn in the app (scissors cutting, paper folding, glue dots, beads sliding on), read aloud by Owl, with play, pause, replay and "Watch all".',
        'Each craft opens on a little movie of the finished craft. A 🐢 button plays the steps in slow motion, the moving hand or tool glows, and a big "I did this step ✓" button cheers your child on and moves to the next step at their own pace.',
        `${craftsHome.JOURNEYS.length} craft journeys (Paper Master, Little Builder, Nature Explorer, Gift Maker, Little Chef, Music Maker): 6 crafts each from easy to expert on a trail, with a badge at the end. Masks, crowns, puppets, pop-up cards, a kite and the fishing game have a "Print template" button that prints the outline at real size.`,
        'Crafts with scissors, glue, needles or pins show a safety note: ask a grown-up. "I made it!" lets your child draw the craft (saved to My pictures) or pick a sticker, and earns stars (more for harder crafts, 1 for a repeat).'])}</div>
      <div class="panel"><h2>🔬 Science &amp; Nature</h2>${li([
        `${scienceHome.info().topics} topics: my body and senses, animals and habitats, life cycles (butterfly, frog, plant, hen), plants and seeds, weather and seasons, day and night and space, the water cycle, materials, push and pull, light and shadow, sound, dinosaurs, the ocean, and caring for Earth. ${scienceHome.info().cards} picture cards, each with a fact read aloud by Owl, a "Did you know?", and a little moving picture. The text grows with your child: more detail from age 7 and the science word from age 10.`,
        `Each topic ends with a 5-question quiz mixing tap the picture, true or false, sort into groups and put a cycle in order by dragging (${scienceHome.info().questions} questions, with harder versions from age 8). 4 or 5 right first time wins the topic's badge.`,
        `${scienceHome.info().labs} mini-labs: float or sink, a magnet test, grow a plant with water and sunshine, dress for the weather, shadow puppets with a moving sun, and putting the planets in order.`,
        `<b>Try at home</b>: ${scienceHome.info().home} real experiments (a rainbow in a glass, a bean in a jar, a rain cloud in a jar, dancing raisins, a fizzy volcano, walking water, a string telephone...) with what you need, steps, and an "ask a grown-up" note where one is needed.`])}</div>
      <div class="panel"><h2>🗺️ Owl's Quest, My World, daily quest and owl</h2>${li([
        `<b>Owl's Quest</b>: a story map of ${FIXED.chapters} chapters. Each stop is a few math puzzles, a drawing, or a story choice. Finished chapters become a storybook.`,
        "<b>Today's quest</b> on the home screen: 3 small jobs a day, then a treasure chest.",
        `<b>🌍 My World</b>: stars buy things for a little map world: ${worldHome.info().items} plants, houses, animals, decorations and sky things (${worldHome.info().minP}–${worldHome.info().maxP} ⭐) and ${worldHome.info().lands} new lands (${worldHome.info().landMin}–${worldHome.info().landMax} ⭐). Animals need feeding once a day (they only get sad, never sick), flowers bloom over 2 days, ripe fruit gives a bonus star (up to 5 a day), and some animals need their habitat (penguins need snow). From age 7 the shop asks the subtraction before buying. Spending never lowers badges, stickers or the owl's growth, and a small gift welcomes each daily visit.`,
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
