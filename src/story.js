/* ---------- Owl's Quest: a story adventure with math puzzles, drawing and choices ---------- */
// Three chapters of nine stops on a winding storybook map. Each stop tells a short story, then asks for
// 3 math puzzles (from the player's age world, so the adaptive engine learns from them), a drawing, or a story choice
// that changes a later line. Progress lives in st.story = { chapter, stop, done, picks, got }.
const storyHome = (() => {
  const CRAYON = { red: '#F2604F', orange: '#FF8A2B', yellow: '#FFC23D', green: '#2FA36B', blue: '#2E8BE6', purple: '#6D55D1', pink: '#F49AC1', brown: '#8B5A2B', black: '#22305A' };
  const cr = (n, name) => ({ crayon: CRAYON[n], name });
  const g = (e, name) => ({ e, name });
  // Owl's own idea pictures (200 x 200, drawn with lines like the art lessons).
  const IDEA = {
    key: '<circle cx="58" cy="100" r="32"/><circle cx="58" cy="100" r="12"/><path d="M90 100 H174 M150 100 V128 H138 M170 100 V122"/><path d="M40 70 l-8 -10 M76 70 l8 -10" style="stroke:#FFC23D"/>',
    rainbow: ['#F2604F', '#FF8A2B', '#FFC23D', '#2FA36B', '#2E8BE6', '#6D55D1'].map((c, i) => `<path d="M${20 + i * 12} 150 A${80 - i * 12} ${80 - i * 12} 0 0 1 ${180 - i * 12} 150" style="stroke:${c};stroke-width:8"/>`).join('') +
      '<path d="M8 160 q0 -18 18 -16 q6 -14 22 -8 q14 0 12 24 z M140 160 q0 -18 18 -16 q6 -14 22 -8 q14 0 12 24 z"/>',
    web: (() => { let s = ''; for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; s += `<path d="M100 100 L${(100 + 86 * Math.cos(a)).toFixed(1)} ${(100 + 86 * Math.sin(a)).toFixed(1)}"/>`; }
      [24, 46, 68].forEach(r => { s += '<path d="' + Array.from({ length: 9 }, (_, k) => { const a = k * Math.PI / 4; return (k ? 'L' : 'M') + (100 + r * Math.cos(a)).toFixed(1) + ' ' + (100 + r * Math.sin(a)).toFixed(1); }).join(' ') + '"/>'; });
      return s + '<circle cx="132" cy="52" r="8"/><path d="M124 46 l-8 -6 M124 52 h-10 M124 58 l-8 6 M140 46 l8 -6 M140 52 h10 M140 58 l8 6 M132 44 V28"/>'; })()
  };
  const CH = [
    { id: 'crayons', title: 'The Lost Crayons', ico: '🖍️', color: 'var(--coral)', token: '🖍️', prize: { name: 'Golden Crayon', golden: true },
      intro: 'A sneaky raccoon took all the colours! Help {owl} find the crayons.', decor: ['🌷', '🌳', '🌼', '🍄', '🌻', '🐞', '🌸', '🦋', '🌳', '🐌'],
      stops: [
        { ico: '🏘️', name: 'Crayon Village', kind: 'math', story: ['Oh no! All the colours in Crayon Village are gone. Everything is grey!', '{owl} the owl finds a trail of rainbow paw prints.'],
          scene: [['🏠', 165, 112, 46], ['🏡', 232, 118, 40], ['🐾', 272, 158, 20], ['🐾', 300, 146, 20]], task: 'Solve 3 puzzles to follow the paw prints!', win: 'The paw prints lead out of the village. {owl} found the RED crayon!', gift: cr('red', 'the red crayon') },
        { ico: '🪧', name: 'Two Paths', kind: 'choice', story: ['The paw prints split in two!', 'One trail goes into a sunflower field. The other goes along the river.'],
          scene: [['🪧', 170, 118, 42], ['🌻', 250, 132, 30], ['🌻', 282, 124, 28], ['🌊', 292, 162, 26]], ask: 'Which way should {owl} go?',
          opts: [{ e: '🌻', t: 'Sunflower field', line: '{owl} flew through the tall sunflowers. They nodded hello! An ORANGE crayon was hiding under a leaf.', echo: 'A sunflower petal was still stuck on {owl}\'s wing.' },
            { e: '🏞️', t: 'River path', line: '{owl} hopped along the river. Splash! A fish pointed its fin at an ORANGE crayon.', echo: '{owl}\'s feet were still wet from the river.' }], gift: cr('orange', 'the orange crayon') },
        { ico: '🚪', name: 'The Locked Gate', kind: 'art', story: ['A tall gate blocks the way. It is locked!', 'A sign says: Draw a key, and the gate will open.'],
          scene: [['🚪', 200, 108, 64], ['🔒', 228, 118, 22]], draw: 'Draw a key for the gate!', idea: { svg: IDEA.key }, win: 'Click! Your key opened the gate. Behind it was the YELLOW crayon!', gift: cr('yellow', 'the yellow crayon') },
        { ico: '🐰', name: 'Bunny Burrow', kind: 'math', story: ['{echo1}', 'Three little bunnies pop out of a hole. "The raccoon ran past us!" they say.', '"Help with our puzzles, and we will show you the way."'],
          scene: [['🐰', 170, 140, 34], ['🐰', 212, 146, 30], ['🐰', 252, 140, 34], ['🕳️', 212, 168, 30]], task: 'Solve 3 puzzles for the bunnies!', win: 'The bunnies hop for joy and give {owl} the GREEN crayon.', gift: cr('green', 'the green crayon') },
        { ico: '🌉', name: 'The Wide Lake', kind: 'choice', story: ['A big lake! The paw prints stop at the water.', 'There is a wobbly bridge, and a little red boat.'],
          scene: [['🌉', 210, 120, 52], ['⛵', 268, 150, 34]], ask: 'Should {owl} take the bridge or the boat?',
          opts: [{ e: '🌉', t: 'The bridge', line: '{owl} tiptoed over the wobbly bridge. Creak, creak, creak! On the other side was the BLUE crayon.', echo: '{owl}\'s legs were still wobbly from the bridge.' },
            { e: '⛵', t: 'The boat', line: '{owl} sailed across the lake. Whoosh went the wind! The BLUE crayon was floating in the water.', echo: '{owl} tied the little boat to a tree.' }], gift: cr('blue', 'the blue crayon') },
        { ico: '🌈', name: 'The Grey Rainbow', kind: 'art', story: ['{echo4}', 'Over the hill is a rainbow with no colours at all. It looks so sad.'],
          scene: [['🌈', 210, 100, 70]], grey: true, draw: 'Draw a rainbow full of colours!', idea: { svg: IDEA.rainbow }, win: 'The rainbow shines again! A PURPLE crayon slides down it. Wheee!', gift: cr('purple', 'the purple crayon') },
        { ico: '🦇', name: 'Echo Cave', kind: 'math', story: ['Inside a dark cave, {owl} hears giggles. "Tee hee! You will never find me!"', 'Glowing number stones light the way.'],
          scene: [['🪨', 200, 130, 60], ['🦇', 250, 60, 26], ['🦇', 150, 48, 22], ['✨', 272, 120, 22]], task: 'Solve 3 puzzles to light the stones!', win: 'The stones glow bright. In the corner {owl} finds the PINK crayon!', gift: cr('pink', 'the pink crayon') },
        { ico: '🍄', name: 'Mushroom Ring', kind: 'choice', story: ['{owl} finds a ring of glowing mushrooms near the raccoon\'s den.', 'A firefly whispers: "Bring a gift. The raccoon is a little bit sad."'],
          scene: [['🍄', 170, 150, 30], ['🍄', 215, 160, 34], ['🍄', 262, 150, 30], ['✨', 230, 92, 22]], ask: 'What should {owl} bring?',
          opts: [{ e: '🏮', t: 'A lantern', line: '{owl} picks up a warm lantern. Under it is the BROWN crayon!', echo: '{owl} held up the warm, glowing lantern.' },
            { e: '🍪', t: 'Cookies to share', line: '{owl} picks some cookies to share. Next to them is the BROWN crayon!', echo: '{owl} held out the cookies to share.' }], gift: cr('brown', 'the brown crayon') },
        { ico: '🦝', name: 'Raccoon\'s Den', kind: 'math', final: true, story: ['{echo7}', 'The raccoon peeks out. "I took the colours because my home was so grey," he sniffs.', '"Solve my riddles, and I will give them all back!"'],
          scene: [['🦝', 220, 128, 54], ['🖍️', 270, 154, 26]], task: 'Solve the raccoon\'s 3 riddles!', win: 'The raccoon gives back every crayon and says sorry. Now he colours together with everyone. Crayon Village is bright again!', gift: cr('black', 'the very last crayon') }
      ] },
    { id: 'forest', title: 'The Number Forest', ico: '🌲', color: 'var(--leaf)', token: '✨', prize: { name: 'Firefly Lantern', e: '🏮' },
      intro: 'The fireflies lost their glow. Help {owl} light up the Number Forest!', decor: ['🌲', '🌳', '🍄', '🌿', '🦔', '🪵', '🌲', '🍂', '🌲', '🦊'],
      stops: [
        { ico: '🌲', name: 'Forest Gate', kind: 'math', story: ['Deep in the Number Forest, the trees whisper numbers.', 'But tonight the fireflies have lost their glow, and the forest is too dark!'],
          scene: [['🌲', 170, 110, 54], ['🌲', 250, 106, 60], ['🌲', 300, 120, 44]], task: 'Solve 3 puzzles to wake the first fireflies!', win: 'Blink, blink! The first fireflies light up. {owl} finds a magic leaf.', gift: g('🍃', 'a magic leaf') },
        { ico: '🐿️', name: 'The Tall Tree', kind: 'choice', story: ['A little squirrel is stuck at the top of a tall tree.', '"Help! I can\'t get down!"'],
          scene: [['🌳', 220, 96, 90], ['🐿️', 236, 48, 26]], ask: 'How should {owl} help the squirrel?',
          opts: [{ e: '🪜', t: 'Build a ladder', line: '{owl} builds a ladder out of sticks. The squirrel climbs down and gives {owl} an acorn!', echo: 'The squirrel ran beside {owl}, carrying the stick ladder.' },
            { e: '🦉', t: 'Fly up and help', line: '{owl} flies up and gives the squirrel a ride down. Whee! She gives {owl} an acorn.', echo: 'The squirrel rode on {owl}\'s back, giggling.' }], gift: g('🌰', 'an acorn') },
        { ico: '🌙', name: 'The Dark Path', kind: 'art', story: ['{echo1}', 'The path is so dark that nobody can see.', '"If only the moon were out," says the squirrel.'],
          scene: [['🌲', 180, 112, 48], ['🌲', 290, 112, 48], ['🐿️', 116, 148, 26]], draw: 'Draw a big moon to light the path!', idea: { lesson: 'a4-moon' }, win: 'Your moon glows in the sky! Now the path is easy to see. {owl} finds a shiny feather.', gift: g('🪶', 'a shiny feather') },
        { ico: '🦫', name: 'Beaver Dam', kind: 'math', story: ['Splash! The beavers are building a dam.', 'But they lost count of their logs. Can you help them?'],
          scene: [['🦫', 200, 140, 40], ['🪵', 252, 150, 34], ['🪵', 290, 140, 30], ['💧', 160, 162, 20]], task: 'Solve 3 puzzles for the beavers!', win: 'The dam is finished! The beavers give {owl} a smooth shell.', gift: g('🐚', 'a smooth shell') },
        { ico: '🪵', name: 'The Stream', kind: 'choice', story: ['The path ends at a stream.', 'There is a hollow log to crawl through, or stepping stones to hop on.'],
          scene: [['🪵', 200, 140, 52], ['🪨', 262, 158, 24], ['🪨', 296, 150, 22]], ask: 'Should {owl} crawl through the log or hop on the stones?',
          opts: [{ e: '🪵', t: 'Crawl through the log', line: '{owl} crawls through the hollow log. It tickles! Inside is a tiny glowing mushroom.', echo: '{owl} brushed bits of bark off both wings.' },
            { e: '🪨', t: 'Hop on the stones', line: 'Hop, hop, hop! {owl} reaches the other side and finds a tiny glowing mushroom.', echo: '{owl} was still counting hops: one, two, three!' }], gift: g('🍄', 'a glowing mushroom') },
        { ico: '🕸️', name: 'Spider\'s Web', kind: 'art', story: ['{echo4}', 'A friendly spider waves her eight legs. "My web broke in the wind!"', '"Can you draw me a new one?"'],
          scene: [['🕷️', 220, 70, 32], ['🌲', 280, 116, 52]], draw: 'Draw a new web for Spider!', idea: { svg: IDEA.web }, win: 'Spider loves her new web! She gives {owl} a sparkly dewdrop.', gift: g('💧', 'a sparkly dewdrop') },
        { ico: '🐸', name: 'Frog Pond', kind: 'math', story: ['Ribbit! Frogs sit on lily pads around a pond.', '"We hop by the rules of numbers," they croak. "Can you solve our puzzles?"'],
          scene: [['🐸', 180, 140, 34], ['🪷', 236, 156, 28], ['🐸', 280, 136, 30]], task: 'Solve 3 puzzles with the frogs!', win: 'The frogs do a happy hop. They give {owl} a lily flower.', gift: g('🪷', 'a lily flower') },
        { ico: '💎', name: 'Something Shiny', kind: 'choice', story: ['Look! Something shiny is stuck in the mud.', 'It is the Firefly Queen\'s little crown!'],
          scene: [['👑', 220, 142, 40], ['💦', 268, 120, 24]], ask: 'How should {owl} make the crown beautiful again?',
          opts: [{ e: '💦', t: 'Wash it in the stream', line: '{owl} washes the crown until it sparkles like a star! A jewel twinkles on top.', echo: '{owl} held up the sparkling clean crown.' },
            { e: '🌸', t: 'Add flowers', line: '{owl} wipes the crown and adds tiny pink flowers. So pretty! A jewel twinkles on top.', echo: '{owl} held up the crown, covered in tiny flowers.' }], gift: g('💎', 'a twinkly jewel') },
        { ico: '✨', name: 'Firefly Queen', kind: 'math', final: true, story: ['At the end of the path sits the Firefly Queen. Her light is very dim.', '{echo7}', '"My crown! Solve my last riddles and my light will come back!"'],
          scene: [['🧚', 222, 112, 50], ['✨', 260, 76, 22]], task: 'Solve the Queen\'s 3 riddles!', win: 'GLOW! The Queen shines bright, and thousands of fireflies light up the whole forest!', gift: g('✨', 'the firefly glow') }
      ] },
    { id: 'sky', title: 'The Sky Castle', ico: '🏰', color: 'var(--grape)', token: '⭐', prize: { name: 'Star Crown', e: '👑' },
      intro: 'The stars will not come out! Help {owl} reach the Sky Castle.', decor: ['☁️', '🌟', '🎈', '☁️', '✨', '🪁', '☁️', '🕊️', '☁️', '💫'],
      stops: [
        { ico: '🌈', name: 'Rainbow Stairs', kind: 'math', story: ['The rainbow from Crayon Village reaches up into the clouds!', '{owl} climbs the rainbow stairs, one step at a time.'],
          scene: [['🌈', 220, 100, 76], ['☁️', 290, 140, 30]], task: 'Solve 3 puzzles to climb the stairs!', win: '{owl} reaches the top of the rainbow. A cloud gives {owl} a fluffy puff.', gift: g('☁️', 'a cloud puff') },
        { ico: '🎈', name: 'Up, Up, Up', kind: 'choice', story: ['Way up high, a castle floats on the clouds.', 'It is too high to fly. How can {owl} get there?'],
          scene: [['🏰', 260, 50, 40], ['☁️', 260, 82, 46]], ask: 'Should {owl} ride a balloon or a giant kite?',
          opts: [{ e: '🎈', t: 'A hot air balloon', line: 'Up, up, up goes the balloon! {owl} waves to the birds and catches a puff of wind.', echo: '{owl} tied the balloon to a cloud post.' },
            { e: '🪁', t: 'A giant kite', line: 'Whoosh! The wind lifts the kite high into the sky. {owl} catches a puff of wind.', echo: '{owl} tied the kite to a cloud post.' }], gift: g('💨', 'a puff of wind') },
        { ico: '☁️', name: 'Cloud Garden', kind: 'art', story: ['{echo1}', 'In the cloud garden, the cloud people make shapes out of clouds.', '"Make one with us!" they say.'],
          scene: [['☁️', 180, 80, 44], ['☁️', 260, 110, 52], ['🌸', 230, 160, 24]], draw: 'Draw a cloud with a happy face!', idea: { lesson: 'a5-cloud' }, win: 'Your cloud floats away, smiling! The cloud people give {owl} a tiny rainbow.', gift: g('🌈', 'a tiny rainbow') },
        { ico: '🌬️', name: 'Wind Bridge', kind: 'math', story: ['A bridge made of wind blows across the sky.', 'Every right answer turns a puff of wind into a solid step.'],
          scene: [['🌬️', 220, 110, 50], ['☁️', 290, 140, 30]], task: 'Solve 3 puzzles to build the bridge!', win: 'The wind bridge holds! {owl} crosses safely and catches a shooting star.', gift: g('🌠', 'a shooting star') },
        { ico: '🐲', name: 'Little Dragon', kind: 'choice', story: ['A little dragon guards the castle door. He looks lonely.', '"Nobody ever plays with me," he sighs.'],
          scene: [['🐲', 226, 120, 54], ['🚪', 290, 112, 40]], ask: 'What should {owl} do?',
          opts: [{ e: '🎵', t: 'Sing a silly song', line: '{owl} sings a silly song. The dragon laughs so hard he puffs smoke rings! He gives {owl} a golden heart.', echo: 'The little dragon flew beside {owl}, humming the silly song.' },
            { e: '🤝', t: 'Ask to be friends', line: '"Will you be my friend?" asks {owl}. The dragon smiles a big toothy smile and gives {owl} a golden heart.', echo: '{owl}\'s new friend, the little dragon, flew beside {owl}.' }], gift: g('💛', 'a golden heart') },
        { ico: '🖼️', name: 'Empty Frame', kind: 'art', story: ['{echo4}', 'Inside the castle hall there is an empty picture frame.', '"The Queen wants a picture of her castle," says the dragon.'],
          scene: [['🖼️', 222, 100, 64]], draw: 'Draw a castle for the Cloud Queen!', idea: { lesson: 'castle' }, win: 'The picture is done! It looks magnificent. A guard gives {owl} a silver key.', gift: g('🗝️', 'a silver key') },
        { ico: '⭐', name: 'Star Room', kind: 'math', story: ['{owl} opens a door with the silver key. Inside are buckets and buckets of stars!', 'They must be counted and sorted before night comes.'],
          scene: [['🪣', 200, 146, 36], ['🪣', 254, 150, 32], ['⭐', 206, 112, 22], ['⭐', 258, 118, 20], ['🌟', 290, 84, 22]], task: 'Solve 3 puzzles to sort the stars!', win: 'All the stars are ready! {owl} keeps one little star.', gift: g('⭐', 'a little star') },
        { ico: '🌙', name: 'Sleepy Moon', kind: 'choice', story: ['Oh dear! The Moon is fast asleep and snoring. Zzzz!', 'Without the Moon, night cannot start.'],
          scene: [['🌛', 230, 70, 56], ['💤', 278, 40, 24]], ask: 'How should {owl} wake the Moon?',
          opts: [{ e: '🔔', t: 'Ring a little bell', line: 'Ding, ding! The Moon opens one sleepy eye and yawns. It gives {owl} a moonbeam.', echo: 'The Moon was awake now, yawning a big yawn.' },
            { e: '😂', t: 'Tell a funny joke', line: '"Why did the cloud stay home? It felt under the weather!" The Moon giggles awake and gives {owl} a moonbeam.', echo: 'The Moon was awake now, still giggling at the joke.' }], gift: g('🌙', 'a moonbeam') },
        { ico: '👸', name: 'Throne Room', kind: 'math', final: true, story: ['{echo7}', 'The Cloud Queen smiles. "You did it! One last test, and the stars will shine all over the world."'],
          scene: [['👸', 222, 110, 54], ['🏰', 290, 96, 40]], task: 'Solve the Queen\'s 3 puzzles!', win: 'Twinkle, twinkle! The stars pop out one by one. The Cloud Queen gives {owl} the Star Crown!', gift: g('🌟', 'the night stars') }
      ] }
  ];

  /* --- state --- */
  const S = () => { const s = st.story = st.story || {}; s.chapter = s.chapter || 0; s.stop = s.stop || 0; s.done = s.done || {}; s.picks = s.picks || {}; s.got = s.got || {}; return s; };
  const key = (c, i) => c + '-' + i;
  const isDone = (c, i) => !!S().done[key(c, i)];
  const doneN = c => CH[c].stops.filter((_, i) => isDone(c, i)).length;
  const nextStop = c => CH[c].stops.findIndex((_, i) => !isDone(c, i));
  const chOpen = c => c === 0 || st.unlockAll || !!S().got[c - 1];
  const stopOpen = (c, i) => chOpen(c) && (i === 0 || st.unlockAll || isDone(c, i - 1));
  const owlName = () => (st.pet && st.pet.name) || 'Hoot';
  function fill(text, c) {
    return text.replace(/\{owl\}/g, owlName()).replace(/\{kid\}/g, st.name || 'friend').replace(/\{echo(\d)\}/g, (m, n) => {
      const s = CH[c].stops[+n], k = S().picks[key(c, +n)];
      return s && s.opts ? fill(s.opts[k == null ? 0 : k].echo, c) : '';
    });
  }
  const lines = (c, s) => s.story.map(t => fill(t, c)).filter(Boolean);
  // Runs fn later only if the player is still on the same screen.
  function later(fn, ms) { const here = view.firstElementChild; setTimeout(() => { if (here && view.firstElementChild === here) fn(); }, ms); }

  /* --- pictures --- */
  function crayonSVG(color, cls = '', label = '') {
    const gold = color === 'gold';
    const fillC = gold ? 'url(#sqGold)' : color;
    return `<svg class="sq-crayon ${cls}" viewBox="0 0 30 80" role="img" aria-label="${esc(label || 'crayon')}">${gold ? '<defs><linearGradient id="sqGold" x1="0" x2="1"><stop offset="0" stop-color="#C98B12"/><stop offset=".45" stop-color="#FFE48A"/><stop offset="1" stop-color="#D99A1C"/></linearGradient></defs>' : ''}
      <path d="M8 22 L15 3 L22 22 Z" fill="${fillC}"/><rect x="5" y="21" width="20" height="56" rx="4" fill="${fillC}"/>
      <rect x="5" y="30" width="20" height="7" fill="rgba(0,0,0,.18)"/><rect x="5" y="62" width="20" height="7" fill="rgba(0,0,0,.18)"/><rect x="8" y="40" width="4" height="18" rx="2" fill="rgba(255,255,255,.45)"/></svg>`;
  }
  const giftHTML = (gf, cls = '') => gf.crayon ? crayonSVG(gf.crayon, cls, gf.name) : `<span class="sq-ge ${cls}" role="img" aria-label="${esc(gf.name)}">${gf.e}</span>`;
  const prizeHTML = (c, cls = '') => CH[c].prize.golden ? crayonSVG('gold', cls, CH[c].prize.name) : `<span class="sq-ge ${cls}" role="img" aria-label="${esc(CH[c].prize.name)}">${CH[c].prize.e}</span>`;
  // Seeded random numbers, so the map looks the same every visit.
  const seeded = seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  function sceneBG(c, prog) {
    if (c === 0) return `<defs><linearGradient id="sqS0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD3FF"/><stop offset="1" stop-color="#E4F6FF"/></linearGradient></defs>
      <rect width="320" height="180" fill="url(#sqS0)"/><circle cx="276" cy="36" r="20" fill="#FFD447"/>
      <g fill="#fff"><ellipse cx="70" cy="36" rx="26" ry="10"/><ellipse cx="88" cy="29" rx="17" ry="10"/><ellipse cx="190" cy="48" rx="22" ry="8"/></g>
      <path d="M0 118 Q80 82 170 110 T320 98 V180 H0Z" fill="#8ED16F"/><path d="M0 146 Q100 122 200 142 T320 136 V180 H0Z" fill="#5DB65A"/>
      <g>${[[30, 160, '#F2604F'], [120, 168, '#FFC23D'], [150, 156, '#F49AC1'], [300, 166, '#6D55D1'], [96, 150, '#fff']].map(([x, y, f]) => `<circle cx="${x}" cy="${y}" r="4" fill="${f}"/>`).join('')}</g>`;
    if (c === 1) { const r = seeded(7); let flies = ''; for (let k = 0; k < Math.round(4 + prog * 22); k++) flies += `<circle cx="${(r() * 320).toFixed(0)}" cy="${(20 + r() * 120).toFixed(0)}" r="2.4" fill="#FFF27A" opacity=".9"/>`;
      return `<defs><linearGradient id="sqS1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1F3B5C"/><stop offset="1" stop-color="#4C7E86"/></linearGradient></defs>
      <rect width="320" height="180" fill="url(#sqS1)"/><circle cx="276" cy="34" r="14" fill="#FFF4C2" opacity="${(0.4 + prog * 0.6).toFixed(2)}"/>
      <g fill="#1E4A33">${[20, 70, 120, 300].map((x, k) => `<path d="M${x} ${150 - k % 2 * 8} l-26 0 l26 -${70 + k % 3 * 14} l26 ${70 + k % 3 * 14}z"/>`).join('')}</g>
      <path d="M0 150 Q160 136 320 150 V180 H0Z" fill="#2F5D3A"/>${flies}`; }
    const r = seeded(11); let stars = ''; for (let k = 0; k < 14; k++) stars += `<circle cx="${(r() * 320).toFixed(0)}" cy="${(r() * 90).toFixed(0)}" r="${(1 + r() * 1.6).toFixed(1)}" fill="#fff" opacity="${(0.3 + prog * 0.7).toFixed(2)}"/>`;
    return `<defs><linearGradient id="sqS2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9C8AF0"/><stop offset="1" stop-color="#FFD6E8"/></linearGradient></defs>
      <rect width="320" height="180" fill="url(#sqS2)"/>${stars}
      <g fill="#fff">${[[30, 172, 50, 20], [110, 178, 60, 22], [200, 174, 56, 22], [292, 176, 52, 20], [70, 160, 30, 16], [250, 158, 34, 16]].map(([x, y, a, b]) => `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}"/>`).join('')}</g>`;
  }
  const bgFilter = (c, prog) => c === 0 ? `filter:grayscale(${(0.85 * (1 - prog)).toFixed(2)})` : c === 1 ? `filter:brightness(${(0.7 + 0.3 * prog).toFixed(2)})` : '';
  function sceneHTML(c, i, extra = []) {
    const s = CH[c].stops[i], prog = doneN(c) / CH[c].stops.length;
    const hoot = s.hoot || [86, 134], wear = st.pet && st.pet.wear;
    const items = [...s.scene, ...extra].map(([e, x, y, z]) => `<text x="${x}" y="${y}" font-size="${z}" text-anchor="middle" dominant-baseline="central">${e}</text>`).join('');
    return `<div class="sq-scene"><svg class="sq-bg" viewBox="0 0 320 180" style="${bgFilter(c, prog)}" aria-hidden="true">${sceneBG(c, prog)}</svg>
      <svg class="sq-fg" viewBox="0 0 320 180" aria-hidden="true">${items}<g class="sq-shoot"><text x="${hoot[0]}" y="${hoot[1]}" font-size="56" text-anchor="middle" dominant-baseline="central">🦉</text>${wear ? `<text x="${hoot[0] + 2}" y="${hoot[1] - 30}" font-size="24" text-anchor="middle" dominant-baseline="central">${wear}</text>` : ''}</g></svg></div>`;
  }

  /* --- the map --- */
  function layout(n, wide) {
    const cols = wide ? 5 : 3, W = wide ? 1000 : 360, cw = W / cols, rowH = wide ? 180 : 150, top = wide ? 92 : 84;
    const rows = Math.ceil(n / cols), H = top * 2 + (rows - 1) * rowH, pts = [];
    for (let i = 0; i < n; i++) { const r = Math.floor(i / cols), k = i % cols, col = r % 2 ? cols - 1 - k : k; pts.push([cw * (col + 0.5), top + r * rowH + (k % 2 ? 16 : -8)]); }
    return { W, H, pts, cols, cw, rowH, top, rows };
  }
  function trail(p, upto) {
    let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
    for (let a = 0; a < Math.min(upto, p.length - 1); a++) {
      const p0 = p[a - 1] || p[a], p1 = p[a], p2 = p[a + 1], p3 = p[a + 2] || p2, t = 4.5;
      d += ` C${(p1[0] + (p2[0] - p0[0]) / t).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / t).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / t).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / t).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  }
  function mapHTML(c, L) {
    const ch = CH[c], n = ch.stops.length, prog = doneN(c) / n, r = seeded(31 + c * 17);
    const base = ['#CFEFB4', '#3F7D52', null][c], blob = [['#BDE59C', '#DDF5C6'], ['#4C8F60', '#356B45'], ['rgba(255,255,255,.55)', 'rgba(255,255,255,.35)']][c];
    let bg = c === 2 ? `<defs><linearGradient id="sqM2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9A7F5"/><stop offset="1" stop-color="#FFD9EC"/></linearGradient></defs><rect width="${L.W}" height="${L.H}" fill="url(#sqM2)"/>` : `<rect width="${L.W}" height="${L.H}" fill="${base}"/>`;
    for (let k = 0; k < 14; k++) bg += `<ellipse cx="${(r() * L.W).toFixed(0)}" cy="${(r() * L.H).toFixed(0)}" rx="${(30 + r() * 60).toFixed(0)}" ry="${(14 + r() * 24).toFixed(0)}" fill="${blob[k % 2]}"/>`;
    if (c === 0) bg += `<path d="M${L.W * 0.72} 0 C${L.W * 0.6} ${L.H * 0.3} ${L.W * 0.95} ${L.H * 0.55} ${L.W * 0.82} ${L.H}" stroke="#9ED8F5" stroke-width="18" fill="none" opacity=".8"/>`;
    // decorations sit in the gaps between rows, away from the trail
    let dec = '', di = 0;
    for (let row = 0; row < L.rows - 1; row++) {
      const turn = row % 2 === 0 ? L.cols - 1 : 0, y = L.top + row * L.rowH + L.rowH / 2 + 4;
      for (let col = 0; col < L.cols; col++) if (col !== turn) dec += `<text x="${(L.cw * (col + 0.5) + (r() - 0.5) * L.cw * 0.5).toFixed(0)}" y="${y.toFixed(0)}" font-size="${L.W > 500 ? 34 : 26}" text-anchor="middle" dominant-baseline="central">${ch.decor[di++ % ch.decor.length]}</text>`;
    }
    for (let col = 0; col < L.cols - 1; col++) dec += `<text x="${(L.cw * (col + 1)).toFixed(0)}" y="${(L.top - 52).toFixed(0)}" font-size="${L.W > 500 ? 28 : 22}" text-anchor="middle" dominant-baseline="central">${ch.decor[di++ % ch.decor.length]}</text>`;
    const lastRow = L.rows - 1, filled = n - lastRow * L.cols;
    if (filled < L.cols) { const col = lastRow % 2 ? L.cols - 1 - filled : filled; dec += `<text x="${(L.cw * (col + 0.5)).toFixed(0)}" y="${(L.top + lastRow * L.rowH).toFixed(0)}" font-size="44" text-anchor="middle" dominant-baseline="central" opacity="${S().got[c] ? 1 : 0.35}">${ch.prize.golden ? '🖍️' : ch.prize.e}</text>`; }
    const nx = nextStop(c), upto = nx < 0 ? n - 1 : nx;
    const path = trail(L.pts, n), donePath = trail(L.pts, upto);
    const trailCol = ['#F3DDA8', '#8C6A43', '#FFFFFF'][c], dashCol = ['#C9A35F', '#5E452A', '#C9B8F5'][c];
    const pct = p => `left:${(p[0] / L.W * 100).toFixed(2)}%;top:${(p[1] / L.H * 100).toFixed(2)}%`;
    return `<div class="sq-map${L.W > 500 ? ' wide' : ''}" style="aspect-ratio:${L.W}/${L.H}">
      <svg class="sq-mapbg" viewBox="0 0 ${L.W} ${L.H}" style="${bgFilter(c, prog)}" aria-hidden="true">${bg}
        <path d="${path}" stroke="${trailCol}" stroke-width="24" fill="none" stroke-linecap="round"/>
        <path d="${path}" stroke="${dashCol}" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="2 12"/>
        ${upto > 0 ? `<path d="${donePath}" stroke="#FFC23D" stroke-width="9" fill="none" stroke-linecap="round"/>` : ''}${dec}</svg>
      ${ch.stops.map((s, i) => { const done = isDone(c, i), open = stopOpen(c, i), nxt = i === nx;
        return `<button class="sq-stop${done ? ' done' : ''}${nxt ? ' next' : ''}${open ? '' : ' locked'}${s.final ? ' final' : ''}" data-stop="${i}" style="${pct(L.pts[i])}" aria-label="Stop ${i + 1}: ${esc(s.name)}${done ? ', done' : open ? '' : ', locked'}">
          <span class="sq-si">${s.ico}</span>${done ? '<b class="sq-star">⭐</b>' : open ? '' : '<b class="sq-lock">🔒</b>'}<i class="sq-num">${i + 1}</i></button>`; }).join('')}
      <div class="sq-hoot" id="sqHoot" style="${pct(L.pts[nx < 0 ? n - 1 : nx])}" aria-hidden="true">🦉${st.pet && st.pet.wear ? `<i>${st.pet.wear}</i>` : ''}</div></div>`;
  }

  function mapView(c, from) {
    const s = S();
    if (c == null || !CH[c]) c = s.chapter;
    if (!chOpen(c)) c = 0;
    s.chapter = c; s.stop = Math.max(0, nextStop(c)); save();
    const ch = CH[c], nx = nextStop(c), wide = view.clientWidth >= 640, L = layout(ch.stops.length, wide);
    const allDone = nx < 0, got = !!s.got[c];
    view.innerHTML = `${crumbs("🗺️ Owl's Quest")}
      <div class="sq-chs" role="tablist">${CH.map((x, k) => { const open = chOpen(k);
        return `<button class="sq-ch${k === c ? ' on' : ''}${open ? '' : ' locked'}" data-ch="${k}" role="tab" aria-selected="${k === c}" style="--chc:${x.color}">
          <span class="sq-chi">${open ? x.ico : '🔒'}</span><b>${x.title}</b><span class="sq-chn">${s.got[k] ? `${prizeHTML(k, 'mini')} Done!` : open ? `${doneN(k)} of ${x.stops.length} ⭐` : `Finish chapter ${k}`}</span></button>`; }).join('')}</div>
      <div class="sq-banner"><span class="sq-bowl" aria-hidden="true">🦉</span><p><b>Chapter ${c + 1}: ${ch.title}</b>${esc(fill(ch.intro, c))}</p><button class="speak" id="sqSpk" aria-label="Read it">🔊</button></div>
      ${mapHTML(c, L)}
      <div class="sq-under">
        ${allDone ? (got ? '' : `<button class="btn leaf sq-cta" id="sqPrize">🎁 Open your chapter prize!</button>`) : `<button class="btn leaf sq-cta" id="sqGo">▶ ${nx === 0 && !doneN(c) ? 'Start' : 'Go to'} stop ${nx + 1}: ${esc(ch.stops[nx].name)}</button>`}
        ${allDone && got && CH[c + 1] ? `<button class="btn sq-cta" id="sqNextCh" style="background:${CH[c + 1].color}">▶ Next chapter: ${CH[c + 1].title}</button>` : ''}
        <div class="sq-gifts" aria-label="Treasures found">${ch.stops.map((x, i) => isDone(c, i) ? `<span class="sq-slot got">${giftHTML(x.gift)}</span>` : '<span class="sq-slot"></span>').join('')}</div>
        ${doneN(c) ? `<button class="btn alt" id="sqBook">📖 Read my storybook</button>` : ''}
      </div>`;
    wireBack(home);
    const intro = `Chapter ${c + 1}: ${ch.title}. ${fill(ch.intro, c)} ${allDone ? (got ? 'You finished this chapter!' : 'Open your prize!') : `Tap the shining stop to go on!`}`;
    sayScreen(intro);
    $('#sqSpk').onclick = () => say(intro);
    view.querySelectorAll('[data-ch]').forEach(b => b.onclick = () => { const k = +b.dataset.ch; if (chOpen(k)) go(mapView, k); else say(`Finish chapter ${k}, ${CH[k - 1].title}, to open ${CH[k].title}!`); });
    view.querySelectorAll('[data-stop]').forEach(b => b.onclick = () => { const i = +b.dataset.stop; if (stopOpen(c, i)) go(stopView, c, i); else say(`${ch.stops[i].name} is still locked. Finish the stops before it first!`); });
    if ($('#sqGo')) $('#sqGo').onclick = () => go(stopView, c, nx);
    if ($('#sqPrize')) $('#sqPrize').onclick = () => go(chapterDone, c);
    if ($('#sqNextCh')) $('#sqNextCh').onclick = () => go(mapView, c + 1);
    if ($('#sqBook')) $('#sqBook').onclick = () => go(bookView, c);
    // Hoot walks along the trail from the stop just finished.
    const h = $('#sqHoot');
    if (from != null && L.pts[from] && h && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const end = h.getAttribute('style'); h.style.transition = 'none';
      h.style.left = (L.pts[from][0] / L.W * 100) + '%'; h.style.top = (L.pts[from][1] / L.H * 100) + '%';
      later(() => { h.style.transition = ''; h.setAttribute('style', end); tone([523, 659]); }, 350);
    }
  }

  /* --- a stop: story page, then the challenge --- */
  function stopView(c, i) {
    const ch = CH[c], s = ch.stops[i], ls = lines(c, s), again = isDone(c, i);
    const label = s.kind === 'math' ? '🔢 Help with puzzles!' : s.kind === 'art' ? '🖍️ Time to draw!' : '🤔 You choose!';
    view.innerHTML = `${crumbs(`${s.ico} ${s.name}`)}
      <div class="sq-page"><p class="sq-where">Chapter ${c + 1} · Stop ${i + 1} of ${ch.stops.length}${again ? ' · ⭐ done' : ''}</p>
        ${sceneHTML(c, i)}
        <div class="sq-story">${ls.map(t => `<p>${esc(t)}</p>`).join('')}<button class="speak" id="sqSpk" aria-label="Read it">🔊</button></div>
        <button class="btn leaf sq-cta" id="sqGo">${label} ▶</button></div>`;
    wireBack(() => mapView(c));
    const text = ls.join(' ');
    sayScreen(text);
    $('#sqSpk').onclick = () => say(text);
    $('#sqGo').onclick = () => go(s.kind === 'math' ? mathStep : s.kind === 'art' ? artStep : choiceStep, c, i, 0, []);
  }
  function taskBar(c, i, text, dots) {
    const s = CH[c].stops[i];
    return `${crumbs(`${s.ico} ${s.name}`)}<div class="sq-task"><span class="sq-tico" aria-hidden="true">${s.ico}</span><p id="sqTask">${esc(text)}</p>${dots || ''}<button class="speak" id="sqTSpk" aria-label="Read it">🔊</button></div>`;
  }

  // Math: 3 questions from the player's age world. The first one is the topic the engine recommends.
  function pickSkill(k, used) {
    const w = clamp(ageWorld(st.age), 0, WORLDS.length - 1), ids = worldSkills(w).map(x => x.id);
    if (k === 0) { try { return recommendSkill(w); } catch (e) {} }
    const fresh = ids.filter(x => !used.includes(x));
    return pick(fresh.length ? fresh : ids);
  }
  function mathStep(c, i, k, used) {
    const ch = CH[c], s = ch.stops[i];
    let skill = pickSkill(k, used), q;
    try { q = MATH[skill].gen(level(skill)); } catch (e) { skill = 'count'; q = MATH.count.gen(1); }
    used.push(skill);
    const t0 = Date.now(); let tries = 0, hinted = false;
    const dots = `<div class="sq-dots" aria-label="Puzzle ${k + 1} of 3">${[0, 1, 2].map(j => `<i class="${j < k ? 'on' : j === k ? 'now' : ''}">${j < k ? ch.token : ''}</i>`).join('')}</div>`;
    const cols = q.choices.some(x => String(x.html).replace(/<[^>]+>/g, '').length > 6) && q.choices.length > 2 ? 2 : q.choices.length > 4 ? 3 : q.choices.length;
    view.innerHTML = `${taskBar(c, i, fill(s.task, c), dots)}
      <div class="qcard sq-q">
        <div class="prompt"><div class="ptext">${q.prompt}</div><button class="speak" id="spk" aria-label="Read it to me">🔊</button></div>
        ${q.visual ? `<div class="visual">${q.visual}</div>` : ''}
        <div class="choices" style="grid-template-columns:repeat(${cols},1fr)">${q.choices.map((x, j) => `<button class="choice${x.txt ? ' txt' : ''}" data-i="${j}"${String(x.val) === String(q.answer) ? ' data-ok="1"' : ''}${x.say && /<svg|<span/.test(String(x.html)) ? ` aria-label="${esc(x.say)}"` : ''}>${x.html}</button>`).join('')}</div>
        <div class="cheer" id="cheer" aria-live="polite"></div>
        <div id="exp" style="width:100%"></div>
        <div class="row"><button class="help" id="hint">🦉 Hint</button></div>
      </div>`;
    wireBack(() => mapView(c));
    const words = q.choices.map(x => x.say != null ? String(x.say) : String(x.val));
    const qSay = (q.speak || q.prompt) + (st.age <= 8 && words.some(w => /[a-z]/i.test(w)) && words.every(w => w.length < 40) ? ` Is it ${words.join(', or ')}?` : '');
    say((k === 0 ? fill(s.task, c) + ' ' : '') + qSay);
    $('#spk').onclick = () => say(qSay);
    $('#sqTSpk').onclick = () => say(fill(s.task, c));
    $('#hint').onclick = () => {
      const wrong = [...view.querySelectorAll('.choice')].filter(b => !b.disabled && String(q.choices[+b.dataset.i].val) !== String(q.answer));
      if (hinted || wrong.length < 2) { say('Look carefully and try one!'); return; }
      hinted = true; const b = pick(wrong); b.disabled = true; b.classList.add('gone'); $('#hint').disabled = true;
      say(`${owlName()} took away one wrong answer. Try again!`);
    };
    view.querySelectorAll('.choice').forEach(b => b.onclick = () => {
      const x = q.choices[+b.dataset.i];
      if (b.disabled) return;
      if (String(x.val) === String(q.answer)) {
        const first = tries === 0 && !hinted;
        b.classList.add('right'); view.querySelectorAll('.choice').forEach(y => y.disabled = true);
        if (first) learn(skill, true, Date.now() - t0);
        dayLog('q'); if (first) dayLog('ok');
        questTick('math'); if (first) questTick('firsttry');
        const cheer = first ? pick(['Great job!', 'You got it!', 'Super!', 'Yes!', 'Brilliant!']) : 'Now you know it!';
        $('#cheer').textContent = cheer + ' ' + ch.token; yay(); say(cheer);
        save();
        later(() => k < 2 ? mathStep(c, i, k + 1, used) : complete(c, i), first ? 1300 : 2200);
      } else {
        tries++; b.classList.add('wrong'); b.disabled = true; oops();
        if (tries === 1) { learn(skill, false, Date.now() - t0); addReview(skill, q); save(); }
        $('#exp').innerHTML = `<div class="explain"><p>Let's work it out together.</p>${q.explain ? `<div class="visual">${q.explain}</div>` : ''}${q.steps ? `<ol class="steps">${q.steps.map(y => `<li>${y}</li>`).join('')}</ol>` : ''}<p>${q.explainText}</p></div>`;
        say("Let's work it out together. " + (q.steps ? q.steps.join(' ') + ' ' : '') + q.explainText);
      }
    });
  }

  // Art: Owl shows an idea, the child draws anything on the pad, then taps Done.
  function ideaSVG(idea, cls) {
    if (idea.lesson) { const ls = lessonById(idea.lesson); if (ls) return lessonSVG(ls, ls.steps.length - 1, 'trace-svg').replace('class="trace-svg"', `class="${cls}"`); }
    return `<svg class="${cls}" viewBox="0 0 200 200" aria-hidden="true"><g class="old">${idea.svg || ''}</g></svg>`;
  }
  function artStep(c, i) {
    const s = CH[c].stops[i], task = fill(s.draw, c);
    view.innerHTML = `${taskBar(c, i, task)}
      <div class="sq-art"><div class="sq-idea"><b>💡 ${esc(owlName())}'s idea</b>${ideaSVG(s.idea, 'art-svg')}<span class="note">Draw it your own way. Any drawing is great!</span></div>
        <div class="sq-padbox"><div class="studio" id="sqPad"></div><button class="btn leaf sq-cta" id="sqDone">✔ I'm done!</button></div></div>`;
    wireBack(() => mapView(c));
    let trace = false;
    const pad = makePad($('#sqPad'), { square: true, extra: '<button class="tool" id="sqTrace" aria-pressed="false">👻 Trace</button>' });
    say(task + ' Draw it any way you like, then tap I\'m done.');
    $('#sqTSpk').onclick = () => say(task);
    $('#sqTrace').onclick = e => { trace = !trace; e.currentTarget.setAttribute('aria-pressed', trace); pad.setTrace(trace ? ideaSVG(s.idea, 'trace-svg') : ''); if (trace) say('Trace mode! Draw over the light lines.'); };
    $('#sqDone').onclick = () => {
      if (!pad.drawn()) { say('Draw something first! Any drawing is great.'); $('#sqDone').classList.remove('sq-nudge'); void $('#sqDone').offsetWidth; $('#sqDone').classList.add('sq-nudge'); return; }
      pad.save(false);
      try { // a small copy for the storybook
        const cv = view.querySelector('#cv'), t = document.createElement('canvas'); t.width = 200; t.height = Math.round(200 * cv.height / cv.width);
        const tc = t.getContext('2d'); tc.fillStyle = '#fff'; tc.fillRect(0, 0, t.width, t.height); tc.drawImage(cv, 0, 0, t.width, t.height);
        const pics = store.get('questPics:' + pid, {}); pics[key(c, i)] = t.toDataURL('image/jpeg', 0.6); store.set('questPics:' + pid, pics);
      } catch (e) {}
      questTick('art'); dayLog('art');
      complete(c, i, 'Your drawing is saved in My pictures.');
    };
  }

  // A story choice: either answer is right, and it changes a line later in the story.
  function choiceStep(c, i) {
    const s = CH[c].stops[i], ask = fill(s.ask, c);
    view.innerHTML = `${taskBar(c, i, ask)}
      <div class="sq-opts">${s.opts.map((o, k) => `<button class="sq-opt" data-o="${k}"><span class="sq-oe">${o.e}</span><b>${esc(fill(o.t, c))}</b></button>`).join('')}</div>
      <p class="note sq-center">There is no wrong answer. You decide what happens in the story!</p>`;
    wireBack(() => mapView(c));
    const text = `${ask} ${s.opts.map(o => fill(o.t, c)).join(', or ')}?`;
    say(text); $('#sqTSpk').onclick = () => say(text);
    view.querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
      const k = +b.dataset.o; S().picks[key(c, i)] = k; save(); tone([523, 784]);
      b.classList.add('chosen'); view.querySelectorAll('[data-o]').forEach(x => x.disabled = true);
      later(() => complete(c, i, null, k), 500);
    });
  }

  function complete(c, i, note, pickK) {
    const ch = CH[c], s = ch.stops[i], first = !isDone(c, i);
    S().done[key(c, i)] = today(); S().stop = Math.max(0, nextStop(c)); save();
    const earn = s.kind === 'choice' ? 1 : 2;
    if (first) addStars(earn); else { save(); updateTop(); }
    yay(); confetti(first ? 30 : 12);
    const line = pickK != null ? fill(s.opts[pickK].line, c) : fill(s.win, c);
    const last = nextStop(c) < 0 && !S().got[c];
    const extra = pickK != null ? [[s.opts[pickK].e, 142, 92, 34]] : [];
    view.innerHTML = `<div class="sq-win">
      ${sceneHTML(c, i, extra)}
      <div class="sq-prize sq-pop">${giftHTML(s.gift, 'big')}</div>
      <h1>${pick(['Hooray!', 'You did it!', 'Wonderful!', 'Hoo hoo, hooray!'])}</h1>
      <p class="sq-line">${esc(line)}</p>
      ${note ? `<p class="note sq-center">${esc(note)}</p>` : ''}
      <p class="sq-earn">${first ? `+${earn} ⭐` : 'Played again!'}</p>
      <div class="row"><button class="btn leaf" id="sqOn">${last ? '🎁 Chapter prize!' : '🗺️ On to the next stop!'}</button></div></div>`;
    say(`${line} ${first ? `You earned ${earn} star${earn > 1 ? 's' : ''}!` : ''}`);
    $('#sqOn').onclick = () => last ? go(chapterDone, c) : go(mapView, c, i);
  }

  function chapterDone(c) {
    const ch = CH[c], first = !S().got[c];
    if (nextStop(c) >= 0) return mapView(c);
    if (first) { S().got[c] = today(); save(); addStars(5); }
    confetti(70); yay(); setTimeout(() => tone([523, 659, 784, 1047], 0.14), 500);
    const picks = ch.stops.map((s, i) => s.opts ? s.opts[S().picks[key(c, i)] || 0] : null).filter(Boolean);
    const finale = CH[c + 1];
    view.innerHTML = `<div class="sq-win sq-final">
      <div class="sq-rays" aria-hidden="true"></div>
      <div class="sq-prize sq-pop">${prizeHTML(c, 'huge')}</div>
      <h1>Chapter ${c + 1} complete!</h1>
      <p class="sq-line">${esc(fill(ch.stops[ch.stops.length - 1].win, c))}</p>
      <p class="sq-line">You won the <b>${ch.prize.name}</b>!${first ? ' +5 ⭐' : ''}</p>
      <div class="sq-mine"><b>Your story choices:</b>${picks.map(o => `<span>${o.e} ${esc(fill(o.t, c))}</span>`).join('')}</div>
      <div class="row"><button class="btn alt" id="sqBook">📖 Read my storybook</button>
        ${finale ? `<button class="btn leaf" id="sqNext">▶ Chapter ${c + 2}: ${finale.title}</button>` : '<button class="btn leaf" id="sqMap">🏆 Back to the map</button>'}</div>
      ${finale ? '' : `<p class="sq-line">You finished the whole quest! ${esc(owlName())} is so proud of you.</p>`}</div>`;
    say(`Chapter ${c + 1} complete! You won the ${ch.prize.name}! ${first ? 'And 5 bonus stars!' : ''} ${finale ? `Next is ${finale.title}.` : 'You finished the whole quest!'}`);
    $('#sqBook').onclick = () => go(bookView, c);
    if (finale) $('#sqNext').onclick = () => go(mapView, c + 1); else $('#sqMap').onclick = () => go(mapView, c);
  }

  // The storybook: every finished stop as a page, with the child's choices and drawings.
  function bookView(c) {
    const ch = CH[c], pics = store.get('questPics:' + pid, {});
    const pages = ch.stops.map((s, i) => isDone(c, i) ? { s, i, text: [...lines(c, s), s.opts ? fill(s.opts[S().picks[key(c, i)] || 0].line, c) : fill(s.win, c)] } : null).filter(Boolean);
    view.innerHTML = `${crumbs(`📖 ${ch.title}`)}
      <div class="sq-book">${pages.map((p, n) => `<article class="sq-bpage"><span class="sq-pno">${n + 1}</span>
        ${sceneHTML(c, p.i, p.s.opts ? [[p.s.opts[S().picks[key(c, p.i)] || 0].e, 142, 92, 34]] : [])}
        <div class="sq-btext"><h2>${p.s.ico} ${esc(p.s.name)}</h2>${p.text.map(t => `<p>${esc(t)}</p>`).join('')}
          ${pics[key(c, p.i)] ? `<figure><img src="${pics[key(c, p.i)]}" alt="My drawing"><figcaption>My drawing</figcaption></figure>` : ''}</div></article>`).join('')}
        ${S().got[c] ? `<div class="sq-bend">${prizeHTML(c, 'big')}<b>The End</b></div>` : `<p class="note sq-center">To be continued…</p>`}</div>
      <div class="row"><button class="btn leaf" id="sqRead">🔊 Read me the story</button><button class="btn alt" id="sqMap">🗺️ Map</button></div>`;
    wireBack(() => mapView(c));
    const all = `${ch.title}. ` + pages.map(p => p.text.join(' ')).join(' ') + (S().got[c] ? ' The end.' : ' To be continued.');
    screenText = all; say(`Your storybook: ${ch.title}. Tap Read me the story to hear it.`);
    $('#sqRead').onclick = () => say(all);
    $('#sqMap').onclick = () => go(mapView, c);
  }

  if (location.hash === '#selftest') window.__quest = { CH, get state() { return S(); }, mapView, stopView, bookView, chapterDone, layout, isDone, nextStop };
  return mapView;
})();
