/* ---------- Owl's Quest: a story adventure with math puzzles, drawing and choices ---------- */
// Five chapters of nine stops on a winding storybook map. Each stop tells a short story, then asks for
// 3 math puzzles (from the player's age world, so the adaptive engine learns from them), a drawing, or a story choice
// that changes a later line. Progress lives in st.story = { chapter, stop, done, picks, got }.
const storyHome = lazyArea(/*lazy{*/() => {
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
      return s + '<circle cx="132" cy="52" r="8"/><path d="M124 46 l-8 -6 M124 52 h-10 M124 58 l-8 6 M140 46 l8 -6 M140 52 h10 M140 58 l8 6 M132 44 V28"/>'; })(),
    // a fish: oval body, tail, eye and smile, fin, stripes, then bubbles and seaweed
    fish: '<path d="M30 100 Q82 44 136 100 Q82 156 30 100 Z"/><path d="M134 100 L178 66 Q166 100 178 134 Z"/><circle cx="60" cy="92" r="7"/><path d="M40 112 q8 6 16 0"/>' +
      '<path d="M74 75 Q94 44 120 80"/><path d="M90 84 q8 16 0 32 M106 82 q9 18 0 36" style="stroke:#FF8A2B"/>' +
      '<g style="stroke:#2E8BE6"><circle cx="24" cy="62" r="6"/><circle cx="16" cy="40" r="4"/><circle cx="28" cy="22" r="3"/></g><path d="M150 196 q-10 -14 0 -28 q10 -14 0 -28" style="stroke:#2FA36B"/>',
    // a fan shell: a bumpy fan, lines from the bottom to each bump, a little foot
    shell: (() => { const P = (a, r) => [(100 + r * Math.cos(a * Math.PI / 180)).toFixed(1), (156 + r * Math.sin(a * Math.PI / 180)).toFixed(1)].join(' ');
      let d = `M100 156 L${P(205, 100)}`, lines = '';
      for (let k = 0; k < 6; k++) { const a = 205 + k * 26; d += ` Q${P(a + 13, 122)} ${P(a + 26, 100)}`; if (k) lines += `M100 156 L${P(a, 92)} `; }
      return `<path d="${d} Z"/><path d="${lines}"/><path d="M84 156 L80 176 H120 L116 156"/><circle cx="158" cy="44" r="10" style="stroke:#F49AC1"/><path d="M152 40 q3 -4 7 -4" style="stroke:#F49AC1"/>`; })(),
    // a dinosaur footprint: one outline, a broad round heel pad with three thick toes that end in points, then a sharp
    // claw on the tip of each toe
    foot: '<path d="M100 182 C74 182 60 160 58 138 Q32 112 28 66 Q66 66 82 108 Q74 52 100 26 Q126 52 118 108 Q134 66 172 66 Q168 112 142 138 C140 160 126 182 100 182 Z"/>' +
      '<g style="stroke:#F2604F"><path d="M93 37 L100 10 L107 37 Z"/><path d="M37 66 L17 52 L25 74 Z"/><path d="M163 66 L183 52 L175 74 Z"/></g>',
    // a calm volcano: a big mountain with a flat top, a happy face, one little puff of smoke
    volcano: '<path d="M18 176 L78 66 H122 L182 176 Z"/><path d="M78 66 Q100 80 122 66"/><path d="M84 70 q4 14 -2 24 M116 70 q-2 10 4 18" style="stroke:#F2604F"/>' +
      '<circle cx="86" cy="118" r="5"/><circle cx="114" cy="118" r="5"/><path d="M84 136 q16 14 32 0"/><path d="M92 54 q-12 -10 2 -18 q6 -12 20 -4 q14 -2 10 12 q-2 10 -16 8" style="stroke:#9A9AA8"/>' +
      '<path d="M6 176 H194"/><path d="M164 176 V130 M164 132 q-14 -6 -22 2 M164 132 q14 -8 22 2 M164 132 q-4 -14 -14 -16 M164 132 q6 -14 16 -14" style="stroke:#2FA36B"/>'
  };
  // Chapter prizes drawn as pictures (100 x 100). u keeps gradient ids apart when one shows up twice on a page.
  const PRIZE = {
    pearl: u => `<defs><radialGradient id="sqPg${u}" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#F6E9F7"/><stop offset=".8" stop-color="#D6C8F2"/><stop offset="1" stop-color="#B7E3F5"/></radialGradient></defs>
      <path d="M10.0 44.0 Q4.6 31.8 15.4 24.0 Q16.8 10.8 30.0 9.4 Q37.8 -1.4 50.0 4.0 Q62.2 -1.4 70.0 9.4 Q83.2 10.8 84.6 24.0 Q95.4 31.8 90.0 44.0 Z" fill="#F7B8D2" stroke="#22305A" stroke-width="2.5" stroke-linejoin="round"/><path d="M50 44 L20.6 27.0 M50 44 L33.0 14.6 M50 44 L50.0 10.0 M50 44 L67.0 14.6 M50 44 L79.4 27.0" stroke="#E07AA6" stroke-width="2" stroke-linecap="round"/>
      <path d="M6 62 H94 Q88 96 50 96 Q12 96 6 62 Z" fill="#F49AC1" stroke="#22305A" stroke-width="2.5" stroke-linejoin="round"/><path d="M20 70 Q50 88 80 70" stroke="#E07AA6" stroke-width="2" fill="none"/><circle cx="50" cy="56" r="17" fill="url(#sqPg${u})" stroke="#9E8BC7" stroke-width="2"/><ellipse cx="44" cy="50" rx="5.5" ry="3.8" fill="#fff"/>`,
    egg: u => `<defs><linearGradient id="sqEg${u}" x1="0" x2="1"><stop offset="0" stop-color="#C98B12"/><stop offset=".45" stop-color="#FFE48A"/><stop offset="1" stop-color="#D99A1C"/></linearGradient></defs>
      <path d="M50 5 C78 5 90 52 88 66 C85 88 70 96 50 96 C30 96 15 88 12 66 C10 52 22 5 50 5 Z" fill="url(#sqEg${u})" stroke="#8A5A00" stroke-width="2.5"/>
      <g fill="#E0A41F"><circle cx="36" cy="40" r="5"/><circle cx="62" cy="30" r="4"/><circle cx="66" cy="62" r="6"/><circle cx="40" cy="74" r="4"/></g><ellipse cx="34" cy="26" rx="5" ry="10" fill="#fff" opacity=".6" transform="rotate(20 34 26)"/>`
  };
  let uid = 0;
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
      ] },
    { id: 'sea', title: 'Under the Sea', ico: '🐙', color: 'var(--sky-deep)', token: '🐚', prize: { name: 'Rainbow Pearl', e: '🦪', svg: PRIZE.pearl },
      intro: 'Little Inky the octopus lost her magic pearl, and the sea is getting dark! Help {owl} find it.', decor: ['🐠', '🐚', '🦀', '🌿', '🐡', '🐢', '🐟', '🦑', '⭐', '🪨'],
      stops: [
        { ico: '🏖️', name: 'Seashell Beach', kind: 'math', story: ['{owl} lands on a sunny beach. In a rock pool sits a sad little octopus.', '"I am Inky. My magic pearl rolled away into the deep sea, and now the sea is getting dark!"'],
          scene: [['🐙', 206, 140, 42], ['🪨', 256, 156, 30], ['🐚', 292, 162, 22]], task: 'Solve 3 puzzles to get ready to dive!', win: 'Inky gives {owl} a diving mask. Now {owl} can swim under the sea!', gift: g('🤿', 'a diving mask') },
        { ico: '🌊', name: 'Down, Down, Down', kind: 'choice', story: ['The sea is big and deep. The pearl is far down at the bottom.', 'Two friends swim up to help.'],
          scene: [['🐢', 200, 120, 40], ['🐬', 268, 96, 42]], ask: 'Who should {owl} ride down to the bottom?',
          opts: [{ e: '🐢', t: 'A sea turtle', line: '{owl} holds on to a friendly sea turtle. Down they glide, slow and gentle. The turtle gives {owl} a spiral shell.', echo: '{owl} waved goodbye to the gentle sea turtle.' },
            { e: '🐬', t: 'A dolphin', line: 'Whoosh! A dolphin zooms {owl} down, down, down. Squeak, squeak! The dolphin gives {owl} a spiral shell.', echo: 'The dolphin squeaked goodbye and zoomed away.' }], gift: g('🐚', 'a spiral shell') },
        { ico: '🐠', name: 'Fish School', kind: 'art', story: ['{echo1}', 'A little fish swims all alone. "I lost my school of friends!" it says.', '"Can you draw me a fish friend?"'],
          scene: [['🐠', 214, 112, 40], ['🌿', 290, 150, 34]], draw: 'Draw a fish friend!', idea: { svg: IDEA.fish }, win: 'Your fish swims next to the little fish. Now they are a school! They give {owl} a shiny scale.', gift: g('✨', 'a shiny scale') },
        { ico: '🦀', name: 'Crab Rock', kind: 'math', story: ['Snap, snap! Two crabs are arguing over a pile of shells.', '"Help us count fairly," they say, "and we will tell you where the pearl went."'],
          scene: [['🦀', 190, 146, 36], ['🦀', 276, 146, 36], ['🐚', 232, 160, 24], ['🪨', 232, 112, 44]], task: 'Solve 3 puzzles for the crabs!', win: 'The crabs stop arguing and wave their claws. "The pearl rolled into the seaweed!" They give {owl} a pink shell.', gift: g('🐚', 'a pink shell') },
        { ico: '🌿', name: 'Seaweed Forest', kind: 'choice', story: ['Tall seaweed sways back and forth, like a forest under the sea.', 'Something peeks out. It is a shy little seahorse!'],
          scene: [['🌿', 180, 120, 52], ['🌿', 290, 116, 56], ['🐴', 236, 118, 28]], ask: 'How should {owl} say hello to the seahorse?',
          opts: [{ e: '🎶', t: 'Hum a soft song', line: '{owl} hums a soft song. The seahorse dances out and points the way with its curly tail. It gives {owl} a sea flower.', echo: 'The seahorse was still dancing to {owl}\'s song.' },
            { e: '👋', t: 'Wave hello', line: '{owl} gives a big wave. The seahorse waves back with its curly tail and points the way. It gives {owl} a sea flower.', echo: 'The seahorse swam beside {owl}, waving its curly tail.' }], gift: g('🌺', 'a sea flower') },
        { ico: '🧜', name: 'Mermaid Rock', kind: 'art', story: ['{echo4}', 'On a big rock sits a mermaid with a shell collection.', '"I have every shell in the sea, except a fan shell. Can you draw one for me?"'],
          scene: [['🧜', 226, 104, 50], ['🪨', 226, 150, 54]], draw: 'Draw a fan shell for the mermaid!', idea: { svg: IDEA.shell }, win: 'The mermaid puts your shell in her collection and sings a happy song. She gives {owl} a lucky coin.', gift: g('🪙', 'a lucky coin') },
        { ico: '🦪', name: 'Clam Garden', kind: 'math', story: ['A row of clams opens and shuts. Clap, clap, clap!', '"We saw the pearl!" they giggle. "Solve our puzzles, and we will tell you where."'],
          scene: [['🦪', 180, 150, 32], ['🦪', 232, 156, 34], ['🦪', 284, 150, 32]], task: 'Solve 3 puzzles with the clams!', win: 'The biggest clam opens wide. Inside is a treasure map to the Shark Cave!', gift: g('🗺️', 'a treasure map') },
        { ico: '🦈', name: 'Shark Cave', kind: 'choice', story: ['The map leads to a dark cave. Inside, something big is snoring.', 'It is a sleepy shark, and the magic pearl is right under its nose!'],
          scene: [['🦈', 226, 116, 56], ['💤', 284, 72, 22], ['⚪', 196, 150, 16]], ask: 'How should {owl} get the pearl?',
          opts: [{ e: '🤫', t: 'Tiptoe very quietly', line: 'Shh! {owl} swims in so quietly that the shark keeps snoring. {owl} rolls the pearl out gently. Got it!', echo: 'The pearl glowed in {owl}\'s wings. Behind them, the shark was still snoring.' },
            { e: '😊', t: 'Wake the shark kindly', line: '"Excuse me, Mr. Shark?" The shark opens one eye and smiles. "Oh! Is this yours? I was keeping it safe." Got it!', echo: 'The friendly shark swam behind {owl} to say goodbye.' }], gift: g('🦪', 'the magic pearl') },
        { ico: '🐙', name: 'Pearl Palace', kind: 'math', final: true, story: ['{echo7}', 'At the Pearl Palace, Inky\'s mama, the Octopus Queen, waits by a giant shell.', '"Solve my last riddles to open the shell, and the pearl can go home!"'],
          scene: [['🐙', 222, 112, 54], ['🏰', 290, 100, 40]], task: 'Solve the Octopus Queen\'s 3 riddles!', win: 'The giant shell opens. In goes the pearl, and WHOOSH! The whole sea fills with bright, sparkly light. The Octopus Queen gives {owl} a Rainbow Pearl of its own!', gift: g('🌊', 'the sparkling sea') }
      ] },
    { id: 'dino', title: 'Dino Valley', ico: '🦕', color: 'var(--orange-deep)', token: '🥚', prize: { name: 'Golden Dino Egg', e: '🥚', svg: PRIZE.egg },
      intro: 'Baby dinosaur Pip is lost, and the volcano is rumbling! Help {owl} get Pip home before it puffs.', decor: ['🌴', '🌿', '🦴', '🪨', '🦖', '🌴', '🍃', '🦕', '🌾', '🐢'],
      stops: [
        { ico: '🥚', name: 'Crack!', kind: 'math', story: ['Crack! In a field of ferns, a little egg breaks open.', 'Out pops a baby dinosaur named Pip. "Where is my mama?" Far away, the volcano goes rumble, rumble.'],
          scene: [['🦕', 206, 140, 42], ['🥚', 256, 160, 26], ['🌿', 296, 150, 30]], task: 'Solve 3 puzzles to find the first clue!', win: 'Look! Big footprints lead away from the nest. They must be Mama\'s! Pip gives {owl} a piece of eggshell.', gift: g('🥚', 'a piece of eggshell') },
        { ico: '👣', name: 'Muddy Tracks', kind: 'choice', story: ['The footprints go two ways around a big rock.', 'One way goes through a muddy swamp. The other goes over a hill of tall ferns.'],
          scene: [['🪨', 222, 128, 50], ['👣', 278, 158, 22], ['🌿', 172, 150, 30]], ask: 'Which way should {owl} and Pip go?',
          opts: [{ e: '💦', t: 'Through the swamp', line: 'Squish, squash! {owl} and Pip splash through the mud. In the mud, Pip finds a smooth stone.', echo: 'Pip\'s little feet were still muddy from the swamp.' },
            { e: '🌿', t: 'Over the fern hill', line: 'Up and over the fern hill they go! At the top, {owl} spots a smooth stone.', echo: 'Pip still had a fern leaf stuck on its nose.' }], gift: g('🪨', 'a smooth stone') },
        { ico: '🐾', name: 'Flat Rock', kind: 'art', story: ['{echo1}', 'The footprints stop at a wide, flat rock. Where did Mama go?', 'A wise old turtle says: "Draw me a footprint, and I will tell you whose it is."'],
          scene: [['🪨', 230, 150, 50], ['🐢', 280, 140, 34]], draw: 'Draw a big dinosaur footprint!', idea: { svg: IDEA.foot }, win: 'The turtle nods. "That is a Long-Neck footprint. Go to the river!" She gives {owl} a fossil shell.', gift: g('🐚', 'a fossil shell') },
        { ico: '🏞️', name: 'Long-Neck River', kind: 'math', story: ['At the river, Long-Neck dinosaurs are drinking. Slurp, slurp!', '"Have you seen Pip\'s mama?" asks {owl}. "Solve our puzzles first," they say.'],
          scene: [['🦕', 200, 116, 50], ['🦕', 270, 124, 40], ['💧', 236, 162, 20]], task: 'Solve 3 puzzles for the Long-Necks!', win: 'The Long-Necks stretch up high. "We can see her, past the Egg Hills!" They give {owl} a giant leaf.', gift: g('🍃', 'a giant leaf') },
        { ico: '🧗', name: 'Tall Cliff', kind: 'choice', story: ['A tall cliff blocks the path. The volcano rumbles louder. Rumble, RUMBLE!', 'A friendly flying dinosaur lands next to them.'],
          scene: [['🪨', 250, 110, 70], ['🦅', 190, 70, 34]], ask: 'How should they get over the cliff?',
          opts: [{ e: '🦅', t: 'Fly with the flying dino', line: 'Flap, flap! The flying dinosaur carries {owl} and Pip over the cliff. It drops a soft feather for {owl}.', echo: 'Pip was still giggling about the flying ride.' },
            { e: '🪜', t: 'Climb the rocky steps', line: 'Step, step, step! {owl} helps Pip climb the rocky steps. At the top is a soft feather.', echo: 'Pip was puffing and panting after the big climb.' }], gift: g('🪶', 'a soft feather') },
        { ico: '🌋', name: 'Grumpy Volcano', kind: 'art', story: ['{echo4}', 'The volcano is puffing grey smoke. It looks very grumpy!', '{owl} has an idea: "Let\'s draw the volcano feeling calm and happy."'],
          scene: [['🌋', 236, 100, 64]], draw: 'Draw a calm, happy volcano!', idea: { svg: IDEA.volcano }, win: 'The volcano sees your picture and lets out a long, slow sigh. Ahhh. The smoke gets smaller! A warm lava rock rolls out for {owl}.', gift: g('🔥', 'a warm lava rock') },
        { ico: '⛰️', name: 'Egg Hills', kind: 'math', story: ['Over the Egg Hills there are nests everywhere, full of eggs!', '"Help us count our eggs before the volcano puffs," say the dino mamas.'],
          scene: [['🌿', 186, 150, 34], ['🥚', 240, 150, 26], ['🥚', 268, 158, 22], ['🦖', 296, 120, 38]], task: 'Solve 3 puzzles for the dino mamas!', win: 'Every egg is counted and safe. A dino mama gives {owl} a bunch of sweet berries.', gift: g('🍓', 'sweet berries') },
        { ico: '🦖', name: 'Big T-Rex', kind: 'choice', story: ['A big T-rex stands in the path. ROAR! Pip hides behind {owl}.', 'But wait... the T-rex is crying. "Boo hoo! My tooth is wobbly and sore!"'],
          scene: [['🦖', 236, 112, 60], ['💧', 262, 88, 16]], ask: 'What should {owl} do?',
          opts: [{ e: '🦷', t: 'Help with the tooth', line: '{owl} gently wiggles out the wobbly tooth. "Thank you!" smiles the T-rex, and he gives {owl} the tooth to keep.', echo: 'The T-rex waved goodbye with his tiny arms.' },
            { e: '🤗', t: 'Give a big hug', line: '{owl} gives the T-rex a big, soft hug. He stops crying, and out pops the wobbly tooth! He gives it to {owl} to keep.', echo: 'The T-rex was still smiling after the big hug.' }], gift: g('🦷', 'a dino tooth') },
        { ico: '🏡', name: 'Home Nest', kind: 'math', final: true, story: ['{echo7}', 'There is Pip\'s mama! But the volcano is about to puff. RUMBLE!', '"Solve the last riddles," says Mama, "and we can all hide in the safe cave together!"'],
          scene: [['🦕', 230, 108, 60], ['🦕', 282, 140, 30]], task: 'Solve Mama\'s 3 riddles!', win: 'Everyone is safe in the cave. PUFF! The volcano lets out one tiny, sleepy cloud, and then it is quiet. Pip is home at last! Mama gives {owl} the Golden Dino Egg.', gift: g('💛', 'a big dino hug') }
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
  const prizeHTML = (c, cls = '') => { const pz = CH[c].prize;
    return pz.golden ? crayonSVG('gold', cls, pz.name) : pz.svg ? `<svg class="sq-psvg ${cls}" viewBox="0 0 100 100" role="img" aria-label="${esc(pz.name)}">${pz.svg(++uid)}</svg>`
      : `<span class="sq-ge ${cls}" role="img" aria-label="${esc(pz.name)}">${pz.e}</span>`; };
  // Seeded random numbers, so the map looks the same every visit.
  const seeded = seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  // Dino Valley's volcano: the lava glow and the smoke shrink as the chapter goes on, down to one sleepy puff.
  // drift: on the map the smoke drifts off to the right, into the gap between stops, instead of straight up.
  function volcanoG(x, by, h, prog, drift) {
    const w = h * 0.95, top = by - h, cw = h * 0.2, f = n => n.toFixed(1), puffs = 1 + Math.round((1 - prog) * 4);
    const [x0, dx, y0, dy] = drift ? [0.2, 0.25, 0.08, 0.11] : [0, 0.13, 0.14, 0.17];
    let g = `<path d="M${f(x - w)} ${by} L${f(x - cw)} ${f(top)} H${f(x + cw)} L${f(x + w)} ${by} Z" fill="#8A6A55"/><path d="M${f(x - w * 0.45)} ${by} L${f(x - cw * 0.6)} ${f(top + h * 0.1)} H${f(x + cw * 0.2)} L${f(x - w * 0.05)} ${by} Z" fill="#9C7B63"/>`;
    g += `<ellipse cx="${f(x)}" cy="${f(top)}" rx="${f(cw)}" ry="${f(h * 0.06)}" fill="#F2604F" opacity="${(0.25 + 0.75 * (1 - prog)).toFixed(2)}"/>`;
    g += `<path d="M${f(x - cw * 0.5)} ${f(top)} q${f(-h * 0.04)} ${f(h * 0.18)} ${f(-h * 0.12)} ${f(h * 0.3)} M${f(x + cw * 0.4)} ${f(top)} q${f(h * 0.02)} ${f(h * 0.14)} ${f(h * 0.1)} ${f(h * 0.22)}" stroke="#FF8A2B" stroke-width="${f(h * 0.05)}" fill="none" stroke-linecap="round" opacity="${(1 - prog).toFixed(2)}"/>`;
    for (let k = 0; k < puffs; k++) g += `<circle cx="${f(x + h * (x0 + k * dx))}" cy="${f(top - h * (y0 + k * dy))}" r="${f(h * (0.09 + k * 0.03))}" fill="${prog > 0.99 ? '#FFFFFF' : '#8E8E9C'}" opacity=".85"/>`;
    return g;
  }
  function sceneBG(c, prog) {
    if (c === 3) { const r = seeded(13); let bub = '';
      for (let k = 0; k < 9; k++) bub += `<circle cx="${(r() * 320).toFixed(0)}" cy="${(16 + r() * 120).toFixed(0)}" r="${(2 + r() * 4).toFixed(1)}" fill="none" stroke="#fff" stroke-width="1.5" opacity=".7"/>`;
      return `<defs><linearGradient id="sqS3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FD0EE"/><stop offset="1" stop-color="#15588A"/></linearGradient></defs>
      <rect width="320" height="180" fill="url(#sqS3)"/><g fill="#fff" opacity="${(0.08 + prog * 0.3).toFixed(2)}"><path d="M40 0 H76 L130 180 H96Z"/><path d="M150 0 H176 L214 180 H186Z"/><path d="M240 0 H262 L300 180 H276Z"/></g>${bub}
      <path d="M0 152 Q90 136 170 150 T320 144 V180 H0Z" fill="#F2D79A"/><g stroke="#2FA36B" stroke-width="5" fill="none" stroke-linecap="round"><path d="M18 160 q-8 -14 0 -28 q8 -14 0 -28"/><path d="M304 156 q8 -12 0 -24 q-8 -12 0 -24"/></g>`; }
    if (c === 4) return `<defs><linearGradient id="sqS4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD3FF"/><stop offset="1" stop-color="#FFEBC2"/></linearGradient></defs>
      <rect width="320" height="180" fill="url(#sqS4)"/><rect width="320" height="180" fill="#B07A55" opacity="${(0.4 * (1 - prog)).toFixed(2)}"/>${volcanoG(120, 136, 84, prog)}
      <path d="M0 134 Q100 116 200 132 T320 126 V180 H0Z" fill="#9BCB6A"/><path d="M0 158 Q120 144 220 156 T320 152 V180 H0Z" fill="#7DB653"/>`;
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
  const bgFilter = (c, prog) => c === 0 ? `filter:grayscale(${(0.85 * (1 - prog)).toFixed(2)})` : c === 1 ? `filter:brightness(${(0.7 + 0.3 * prog).toFixed(2)})`
    : c === 3 ? `filter:brightness(${(0.6 + 0.4 * prog).toFixed(2)}) saturate(${(0.7 + 0.3 * prog).toFixed(2)})` : c === 4 ? `filter:saturate(${(0.65 + 0.35 * prog).toFixed(2)})` : '';
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
    const base = ['#CFEFB4', '#3F7D52', null, null, '#BFE08A'][c], blob = [['#BDE59C', '#DDF5C6'], ['#4C8F60', '#356B45'], ['rgba(255,255,255,.55)', 'rgba(255,255,255,.35)'], ['rgba(255,255,255,.14)', 'rgba(10,60,100,.14)'], ['#AAD472', '#D5EBA6']][c];
    const grad = { 2: ['#B9A7F5', '#FFD9EC'], 3: ['#7AD6EF', '#1B6A9C'] }[c];
    let bg = grad ? `<defs><linearGradient id="sqM${c}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${grad[0]}"/><stop offset="1" stop-color="${grad[1]}"/></linearGradient></defs><rect width="${L.W}" height="${L.H}" fill="url(#sqM${c})"/>` : `<rect width="${L.W}" height="${L.H}" fill="${base}"/>`;
    for (let k = 0; k < 14; k++) bg += `<ellipse cx="${(r() * L.W).toFixed(0)}" cy="${(r() * L.H).toFixed(0)}" rx="${(30 + r() * 60).toFixed(0)}" ry="${(14 + r() * 24).toFixed(0)}" fill="${blob[k % 2]}"/>`;
    if (c === 3) { // sunbeams reach further down as the sea lights up again, and bubbles rise
      for (let k = 0; k < 4; k++) { const x = L.W * (0.1 + k * 0.26); bg += `<path d="M${x.toFixed(0)} 0 h${(L.W * 0.08).toFixed(0)} L${(x + L.W * 0.2).toFixed(0)} ${L.H} h-${(L.W * 0.1).toFixed(0)}Z" fill="#fff" opacity="${(0.05 + prog * 0.2).toFixed(2)}"/>`; }
      for (let k = 0; k < 18; k++) bg += `<circle cx="${(r() * L.W).toFixed(0)}" cy="${(r() * L.H).toFixed(0)}" r="${(3 + r() * 5).toFixed(1)}" fill="none" stroke="#fff" stroke-width="2" opacity=".55"/>`; }
    if (c === 0) bg += `<path d="M${L.W * 0.72} 0 C${L.W * 0.6} ${L.H * 0.3} ${L.W * 0.95} ${L.H * 0.55} ${L.W * 0.82} ${L.H}" stroke="#9ED8F5" stroke-width="18" fill="none" opacity=".8"/>`;
    // decorations sit in the gaps between rows, away from the trail and the stops (class sq-dec, so a test can check)
    let dec = '', di = 0;
    for (let row = 0; row < L.rows - 1; row++) {
      const turn = row % 2 === 0 ? L.cols - 1 : 0, y = L.top + row * L.rowH + L.rowH / 2 + 4;
      for (let col = 0; col < L.cols; col++) if (col !== turn) if (c === 4 && row === 0 && col === 0) bg += `<g class="sq-dec">${L.W > 500 ? volcanoG(L.cw * 0.5, y + 54, 78, prog, true) : volcanoG(L.cw * 0.5, y + 22, 54, prog, true)}</g>`; else dec += `<text class="sq-dec" x="${(L.cw * (col + 0.5) + (r() - 0.5) * L.cw * 0.5).toFixed(0)}" y="${y.toFixed(0)}" font-size="${L.W > 500 ? 34 : 26}" text-anchor="middle" dominant-baseline="central">${ch.decor[di++ % ch.decor.length]}</text>`;
    }
    for (let col = 0; col < L.cols - 1; col++) dec += `<text class="sq-dec" x="${(L.cw * (col + 1)).toFixed(0)}" y="${(L.top - 52).toFixed(0)}" font-size="${L.W > 500 ? 28 : 22}" text-anchor="middle" dominant-baseline="central">${ch.decor[di++ % ch.decor.length]}</text>`;
    const lastRow = L.rows - 1, filled = n - lastRow * L.cols;
    if (filled < L.cols) { const col = lastRow % 2 ? L.cols - 1 - filled : filled; dec += `<text class="sq-dec" x="${(L.cw * (col + 0.5)).toFixed(0)}" y="${(L.top + lastRow * L.rowH).toFixed(0)}" font-size="44" text-anchor="middle" dominant-baseline="central" opacity="${S().got[c] ? 1 : 0.35}">${ch.prize.golden ? '🖍️' : ch.prize.e}</text>`; }
    const nx = nextStop(c), upto = nx < 0 ? n - 1 : nx;
    const path = trail(L.pts, n), donePath = trail(L.pts, upto);
    const trailCol = ['#F3DDA8', '#8C6A43', '#FFFFFF', '#F6E3B0', '#E2C08C'][c], dashCol = ['#C9A35F', '#5E452A', '#C9B8F5', '#C9A35F', '#8B5A2B'][c];
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

  // The map picks a phone (3 across) or tablet (5 across) layout. While it is showing, a resize or turn of the
  // device that crosses the line draws it again. The watcher stops itself as soon as the map leaves the screen.
  let unwatchMap = null;
  function watchMap(c, wide) {
    if (unwatchMap) unwatchMap();
    const map = view.querySelector('.sq-map'); let timer = 0;
    const stop = () => { clearTimeout(timer); removeEventListener('resize', onResize); removeEventListener('orientationchange', onResize); mo.disconnect(); if (unwatchMap === stop) unwatchMap = null; };
    const check = () => { timer = 0; if (!map || !map.isConnected) stop(); else if ((view.clientWidth >= 640) !== wide) mapView(c, null, true); };
    const onResize = () => { clearTimeout(timer); timer = setTimeout(check, 200); };
    const mo = new MutationObserver(() => { if (!map || !map.isConnected) stop(); });
    addEventListener('resize', onResize); addEventListener('orientationchange', onResize); mo.observe(view, { childList: true });
    unwatchMap = stop;
  }

  function mapView(c, from, quiet) {
    const s = S();
    if (c == null || !CH[c]) c = s.chapter;
    if (!chOpen(c)) c = 0;
    s.chapter = c; s.stop = Math.max(0, nextStop(c)); save();
    const ch = CH[c], nx = nextStop(c), wide = view.clientWidth >= 640, L = layout(ch.stops.length, wide);
    const allDone = nx < 0, got = !!s.got[c];
    view.innerHTML = `${crumbs("🗺️ Owl's Quest")}
      <div class="sq-chs" role="tablist">${CH.map((x, k) => { const open = chOpen(k);
        const state = s.got[k] ? 'done' : open ? `${doneN(k)} of ${x.stops.length} stops` : `locked, finish chapter ${k} first`;
        return `<button class="sq-ch${k === c ? ' on' : ''}${open ? '' : ' locked'}${s.got[k] ? ' got' : ''}" data-ch="${k}" role="tab" aria-selected="${k === c}" aria-label="Chapter ${k + 1}: ${esc(x.title)}, ${state}" style="--chc:${x.color};--chp:${(doneN(k) / x.stops.length * 100).toFixed(0)}%">
          <span class="sq-chi" aria-hidden="true">${open ? x.ico : '🔒'}</span><b>${x.title}</b><span class="sq-chn">${s.got[k] ? `${prizeHTML(k, 'mini')} Done!` : open ? `${doneN(k)} of ${x.stops.length} ⭐` : `Finish chapter ${k}`}</span><i class="sq-chbar" aria-hidden="true"></i></button>`; }).join('')}</div>
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
    if (quiet) screenText = intro; else sayScreen(intro);
    $('#sqSpk').onclick = () => say(intro);
    watchMap(c, wide);
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

  /* --- story riddles: math puzzles that belong to each chapter's story, sized by age --- */
  // tier 0: age 5 and under (count to 10, more or less, one more or one less), 1: ages 6-7 (add and take away to 20),
  // 2: ages 8-9 (groups, times, sharing, 2-digit numbers), 3: 10+ (the same with bigger numbers).
  const tierOf = () => { const a = +st.age || 6; return a <= 5 ? 0 : a <= 7 ? 1 : a <= 9 ? 2 : 3; };
  const nums = (ans, t, extra = []) => opts(ans, [...extra, ...near(ans)].filter(v => Number.isInteger(v) && v >= 0 && v !== ans), t ? 4 : 3);
  const upTo = (a, b) => { const out = []; for (let v = a; a <= b ? v <= b : v >= b; v += a <= b ? 1 : -1) out.push(v); return out; };
  const list = vs => vs.length > 10 ? vs.slice(0, 4).join(', ') + ' … ' + vs.slice(-2).join(', ') : vs.join(', ');
  const pic = (inner, label) => `<div class="sq-pic" role="img" aria-label="${esc(label)}">${inner}</div>`;
  const OP = s => `<b class="sq-op" aria-hidden="true">${s}</b>`;
  const CRC = ['red', 'blue', 'green', 'orange', 'purple', 'yellow', 'pink', 'brown'];
  const miniCrayon = col => `<svg class="sq-mc" viewBox="0 0 30 80" aria-hidden="true"><path d="M8 22 L15 3 L22 22 Z" fill="${col}"/><rect x="5" y="21" width="20" height="56" rx="4" fill="${col}"/><rect x="5" y="32" width="20" height="7" fill="rgba(0,0,0,.2)"/><rect x="5" y="60" width="20" height="7" fill="rgba(0,0,0,.2)"/></svg>`;
  const crayons = (n, color) => `<div class="sq-crow">${Array.from({ length: n }, (_, i) => miniCrayon(CRAYON[color || CRC[i % CRC.length]])).join('')}</div>`;
  // A night-time jar with n glowing fireflies lined up in rows, so they are easy to count.
  function jarSVG(n, cls = 'sq-jar', label = '') {
    const cols = n > 12 ? 4 : 3, rows = Math.ceil(n / cols), gap = n > 12 ? 15 : 18;
    let flies = '';
    for (let k = 0; k < n; k++) { const r = Math.floor(k / cols), cIn = r === rows - 1 ? n - r * cols : cols, x = 45 + (k % cols - (cIn - 1) / 2) * gap, y = 98 - (rows - 1 - r) * gap - 6;
      flies += `<circle cx="${x}" cy="${y}" r="8" fill="#FFF27A" opacity=".35"/><circle cx="${x}" cy="${y}" r="4.6" fill="#FFE14D"/>`; }
    return `<svg class="${cls}" viewBox="0 0 90 112" role="img" aria-label="${esc(label || `jar with ${n} firefl${n === 1 ? 'y' : 'ies'}`)}"><rect x="24" y="4" width="42" height="12" rx="4" fill="#8B5A2B"/><path d="M20 16 H70 V24 Q80 30 80 42 V100 Q80 110 70 110 H20 Q10 110 10 100 V42 Q10 30 20 24 Z" fill="#24476A" stroke="#22305A" stroke-width="3"/><path d="M18 46 V92" stroke="#fff" stroke-opacity=".35" stroke-width="5" stroke-linecap="round"/>${flies}</svg>`;
  }
  const rowsPic = (r, c, e) => `<div class="sq-rows" style="grid-template-columns:repeat(${c},auto)">${`<span>${e}</span>`.repeat(r * c)}</div>`;
  const groupsPic = (g, each, e) => `<div class="sq-groups">${`<span class="sq-grp"><i>${e}</i><b>${each}</b></span>`.repeat(g)}</div>`;
  // A castle made of shapes: each tower is a rectangle with a triangle roof and square windows.
  function castleSVG(wins, mark) {
    const T = wins.length, W = T * 70 + 10; let g = '', nt = 0, ns = 0;
    wins.forEach((w, i) => {
      const x = 10 + i * 70;
      g += `<rect x="${x}" y="62" width="56" height="62" fill="#EDE7FF" stroke="#22305A" stroke-width="2.5"/><polygon points="${x - 4},62 ${x + 28},16 ${x + 60},62" fill="#F49AC1" stroke="#22305A" stroke-width="2.5" stroke-linejoin="round"/>`;
      if (mark === 'tri' || mark === 'both') g += tx(x + 28, 52, ++nt, { size: 15, fill: '#B0306A' });
      for (let k = 0; k < w; k++) { const wx = x + 9 + (k % 2) * 22, wy = 72 + Math.floor(k / 2) * 22;
        g += `<rect x="${wx}" y="${wy}" width="16" height="16" fill="#FFC23D" stroke="#22305A" stroke-width="2"/>`;
        if (mark === 'sq' || mark === 'both') g += tx(wx + 8, wy + 12.5, ++ns, { size: ns > 9 ? 9 : 12 }); }
    });
    return `<div class="sq-castle">${svgBox(`0 0 ${W} 130`, g, `castle with ${T} triangle roofs and ${wins.reduce((a, b) => a + b, 0)} square windows`)}</div>`;
  }
  const splitWins = (total, T) => { const w = Array(T).fill(1); for (let k = T; k < total; k++) { const open = w.map((v, i) => v < 4 ? i : -1).filter(i => i >= 0); w[pick(open)]++; } return w; };
  // Wrap a riddle in the normal question shape (Q) and mark it as part of the story.
  function riddle(o) {
    const q = Q({ ...o, prompt: `<span class="sq-rtag">${o.tag}</span>${word(esc(o.text))}<span class="sq-ask">${esc(o.ask)}</span>`, speak: `${o.text} ${o.ask}` });
    q.story = true; q.kind = o.kind; if (o.topic) q.topic = o.topic; return q;
  }
  // The app's math topic each riddle kind practises, so a riddle answer counts toward that topic's mastery.
  // Riddles can't be rebuilt outside the quest, so they feed learn() only, never the spaced review.
  const topicOf = (kind, t) => ({ count: 'count', compare: 'moreless', add: ['onemore', 'add20', 'addbig', 'addbig'][t], sub: ['onemore', 'sub20', 'subbig', 'subbig'][t],
    mul: 'times', div: 'divide', pattern: 'pattern', order: 'ordinal', time: 'time' })[kind];
  // Shared teaching for the four operations.
  const addHelp = (a, b) => { const hi = Math.max(a, b), lo = Math.min(a, b);
    return a + b <= 20 ? { explain: tenFrame(a, b), steps: [`Start with the bigger number, ${hi}.`, `Count on ${lo} more: ${list(upTo(hi + 1, hi + lo))}.`], explainText: `${a} + ${b} = ${a + b}.` }
      : { explain: column(a, b, '+', a + b), steps: addSteps(a, b), explainText: `${a} + ${b} = ${a + b}.` }; };
  function addSteps(a, b) { const out = [], nm = PV_NAMES; let carry = 0, i = 0;
    while (a || b || carry) { const x = a % 10, y = b % 10, s = x + y + carry; out.push(`${nm[i]}: ${x} + ${y}${carry ? ' + 1 carried' : ''} = ${s}${s > 9 ? `. Write ${s % 10} and carry 1.` : '.'}`); carry = s > 9 ? 1 : 0; a = Math.floor(a / 10); b = Math.floor(b / 10); i++; }
    return out; }
  const subHelp = (a, b) => a <= 20 ? { explain: hopLine([a, a - b], [`−${b}`]), steps: [`Start at ${a}.`, `Count back ${b}: ${list(upTo(a - 1, a - b))}.`], explainText: `${a} − ${b} = ${a - b}.` }
    : { explain: column(a, b, '−', a - b), steps: subSteps(a, b), explainText: `${a} − ${b} = ${a - b}.` };
  const mulHelp = (r, c, what) => ({ explain: arraySVG(r, c, { totals: true }), steps: [`${r} groups of ${c} is ${r} × ${c}.`, `Count by ${c}s: ${list(Array.from({ length: r }, (_, k) => (k + 1) * c))}.`], explainText: `${r} × ${c} = ${r * c} ${what}.` });
  const divHelp = (n, g, each, e, what) => ({ explain: groupsPic(g, each, e), steps: [`Share ${n} into ${g} equal groups.`, `Think: ${g} × what = ${n}?`, `${g} × ${each} = ${n}.`], explainText: `So each one gets ${each} ${what}.` });
  const mulOpts = (r, c, t) => nums(r * c, t, [r * c + c, r * c - c, r * c + r, r * c - r, r + c]);
  const countHelp = (n, e, what) => ({ explain: objs(n, e, { num: true }), steps: n > 3 ? ['Touch the first one and say 1.', 'Touch each one once and say the next number.'] : null, explainText: `${list(upTo(1, n))}. There ${n === 1 ? 'is' : 'are'} ${n} ${what}!` });
  // Pick which of two groups has more or fewer, by tapping the group itself.
  function moreLess(a, b, show, names, more) {
    const ans = (a > b) === more ? 'a' : 'b', hi = Math.max(a, b), lo = Math.min(a, b);
    return { ans, choices: [['a', a, names[0]], ['b', b, names[1]]].map(([v, n, nm]) => ({ html: `<span class="sq-pick">${show(n, v)}</span>`, val: v, say: nm, txt: false })),
      explain: pairRows(a, '🔴', b, '🔵'), steps: [`Line them up in pairs.`, `${hi} has ${hi - lo} left over with no partner.`],
      explainText: `${names[0][0].toUpperCase() + names[0].slice(1)} has ${a}, ${names[1]} has ${b}. ${hi} is more and ${lo} is fewer, so the answer is ${ans === 'a' ? names[0] : names[1]}.` };
  }
  const pair = (lo, hi) => { const a = rnd(lo, hi); let b = rnd(lo, hi); while (b === a) b = rnd(lo, hi); return [a, b]; };
  const PAT = [['⭐', 'star'], ['🌙', 'moon'], ['☁️', 'cloud'], ['🎈', 'balloon'], ['🌈', 'rainbow']];
  // Under the Sea pictures: bubbles in the water, little fan shells, pearls, an open clam.
  function bubblesSVG(n, num) {
    const cols = n > 9 ? 4 : 3, rows = Math.ceil(n / cols), gap = n > 9 ? 19 : 22, H = 16 + rows * gap;
    let b = '';
    for (let k = 0; k < n; k++) { const r = Math.floor(k / cols), cIn = r === rows - 1 ? n - r * cols : cols, x = 50 + (k % cols - (cIn - 1) / 2) * gap, y = 18 + r * gap + (k % 2 ? 3 : 0);
      b += `<circle cx="${x}" cy="${y}" r="8" fill="rgba(255,255,255,.3)" stroke="#fff" stroke-width="2.2"/>${num ? tx(x, y + 4, k + 1, { size: 10 }) : `<path d="M${x - 4} ${y - 1} q1 -4 4 -5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`}`; }
    return `<svg class="sq-bub" viewBox="0 0 100 ${H + 22}" role="img" aria-label="${n} bubble${n === 1 ? '' : 's'}"><rect x="3" y="3" width="94" height="${H + 16}" rx="16" fill="#2E8BE6" stroke="#22305A" stroke-width="3"/><path d="M5 ${H + 8} q22 -6 45 0 t45 0 V${H + 12} q0 7 -8 7 H13 q-8 0 -8 -7Z" fill="#F2D79A"/>${b}</svg>`;
  }
  const miniShell = col => `<svg class="sq-ms" viewBox="0 0 30 28" aria-hidden="true"><path d="M15 24 L3 12 Q3 4 9 4 Q11 1 15 1.5 Q19 1 21 4 Q27 4 27 12 Z" fill="${col}" stroke="#22305A" stroke-width="1.5" stroke-linejoin="round"/><path d="M15 24 L9 5 M15 24 V2.5 M15 24 L21 5" stroke="rgba(0,0,0,.25)" stroke-width="1.4"/><rect x="11.5" y="23" width="7" height="4" rx="1.5" fill="${col}" stroke="#22305A" stroke-width="1.2"/></svg>`;
  const shells = (n, col) => `<div class="sq-crow">${Array.from({ length: n }, () => miniShell(col)).join('')}</div>`;
  const PEARL = '<svg class="sq-pearl" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="#F7F0FA" stroke="#A996C9" stroke-width="1.5"/><circle cx="7.2" cy="7" r="2.6" fill="#fff"/></svg>';
  function clamSVG(n, cls = 'sq-clam') {
    const per = n > 5 ? Math.ceil(n / 2) : n, rows = n > 5 ? 2 : 1, gap = 13;
    let p = '';
    for (let k = 0; k < n; k++) { const r = Math.floor(k / per), cIn = r === rows - 1 ? n - r * per : per, x = 50 + (k % per - (cIn - 1) / 2) * gap, y = 52 + r * 12 - (rows - 1) * 6;
      p += `<circle cx="${x}" cy="${y}" r="5.6" fill="#F7F0FA" stroke="#A996C9" stroke-width="1.3"/><circle cx="${x - 1.8}" cy="${y - 1.8}" r="1.6" fill="#fff"/>`; }
    return `<svg class="${cls}" viewBox="0 0 100 78" role="img" aria-label="clam with ${n} pearl${n === 1 ? '' : 's'}"><path d="M10 44 Q50 -4 90 44 Z" fill="#F7B8D2" stroke="#22305A" stroke-width="2.5" stroke-linejoin="round"/><path d="M4 48 Q50 98 96 48 Z" fill="#F49AC1" stroke="#22305A" stroke-width="2.5" stroke-linejoin="round"/>${p}</svg>`;
  }
  // Dino Valley pictures: a nest of eggs, and dinosaurs measured in blocks.
  function nestSVG(n, num, cls = 'sq-nest') {
    const cols = n > 9 ? 4 : 3, rows = Math.ceil(n / cols), gap = n > 9 ? 18 : 22, H = rows * 22 - 3;
    let e = '';
    for (let k = 0; k < n; k++) { const r = Math.floor(k / cols), cIn = r === rows - 1 ? n - r * cols : cols, x = 50 + (k % cols - (cIn - 1) / 2) * gap, y = 18 + r * 22;
      e += `<ellipse cx="${x}" cy="${y}" rx="${n > 9 ? 7.5 : 8.5}" ry="10" fill="#F6EEDC" stroke="#22305A" stroke-width="1.8"/>${num ? tx(x, y, k + 1, { size: 10 }) : `<circle cx="${x - 3}" cy="${y - 3}" r="1.6" fill="#7DB653"/><circle cx="${x + 3}" cy="${y + 3}" r="1.3" fill="#7DB653"/>`}`; }
    return `<svg class="${cls}" viewBox="0 0 100 ${H + 34}" role="img" aria-label="nest with ${n} egg${n === 1 ? '' : 's'}"><path d="M8 ${H + 4} Q50 ${H - 10} 92 ${H + 4}" stroke="#7A4E25" stroke-width="3" fill="none"/>${e}<path d="M4 ${H + 4} Q50 ${H + 44} 96 ${H + 4} Z" fill="#B07A45" stroke="#22305A" stroke-width="2.5" stroke-linejoin="round"/><path d="M14 ${H + 12} l18 6 M40 ${H + 20} l22 -4 M70 ${H + 12} l16 8" stroke="#7A4E25" stroke-width="2" stroke-linecap="round"/></svg>`;
  }
  // Each row is a dinosaur and its length in blocks. mark: colour the extra blocks of the longest one.
  function lenSVG(rows, mark) {
    const most = Math.max(...rows.map(x => x[1])), least = Math.min(...rows.map(x => x[1])), s = most > 12 ? 11 : 14, W = 40 + most * s + 30;
    let g = '';
    rows.forEach(([e, n, col], i) => { const y = 6 + i * 34;
      g += `<text x="18" y="${y + 14}" font-size="24" text-anchor="middle" dominant-baseline="central">${e}</text>`;
      for (let k = 0; k < n; k++) g += `<rect x="${40 + k * s}" y="${y + 5}" width="${s - 2}" height="18" rx="3" fill="${mark && n === most && k >= least ? '#F2604F' : col}" stroke="#22305A" stroke-width="1.2"/>`;
      g += tx(40 + n * s + 14, y + 19, n, { size: 14 }); });
    return svgBox(`0 0 ${W} ${rows.length * 34 + 8}`, g, rows.map(x => `${x[1]} blocks`).join(' and '), true);
  }
  // One dinosaur as a tap choice: both choices share one scale (most blocks), so the longer bar really looks longer.
  const dinoBar = (e, n, col, most) => svgBox(`0 0 ${most * 15 + 6} 58`, `<text x="16" y="16" font-size="26" text-anchor="middle" dominant-baseline="central">${e}</text>` +
    Array.from({ length: n }, (_, k) => `<rect x="${3 + k * 15}" y="34" width="13" height="20" rx="3" fill="${col}" stroke="#22305A" stroke-width="1.2"/>`).join(''), `${n} blocks long`);
  const PAT5 = [['🦕', 'long-neck'], ['🦖', 'T-rex'], ['🥚', 'egg'], ['🌴', 'palm tree'], ['🌋', 'volcano']];
  const ORDER = [{ text: 'A tiny sprout grows into a tall tree.', s: [['🌱', 'tiny sprout'], ['🌿', 'fern'], ['🌴', 'tall tree']] },
    { text: 'Pip plays all day long, from morning to night.', s: [['🌅', 'morning'], ['☀️', 'sunny afternoon'], ['🌙', 'night']] },
    { text: 'Pip is hungry. Pip picks a leaf, eats it, then has a nap.', s: [['🍃', 'pick a leaf'], ['😋', 'eat it'], ['😴', 'have a nap']] }];
  const clk = t => { t = ((t % 720) + 720) % 720; return [Math.floor(t / 60) || 12, t % 60]; };
  const tm = t => timeStr(...clk(t));
  const twoClocks = (a, b) => `<div class="row m3clocks">${clockSVG(...clk(a))}<span class="op">→</span>${clockSVG(...clk(b))}</div>`;

  const RIDDLES = [
    [ // chapter 1: The Lost Crayons
      t => { const tag = '🐾 Paw print riddle';
        if (t === 0) { const n = rnd(3, 10); return riddle({ tag, kind: 'count', text: 'The sneaky raccoon left a trail of paw prints.', ask: 'How many paw prints?', visual: pic(objs(n, '🐾'), `${n} paw prints`), choices: nums(n, t), answer: n, ...countHelp(n, '🐾', 'paw prints') }); }
        if (t === 1) { const a = rnd(4, 12), b = rnd(2, Math.min(9, 20 - a)); return riddle({ tag, kind: 'add', text: `The raccoon left ${a} paw prints on the grass and ${b} more on the path.`, ask: 'How many paw prints in all?', visual: pic(objs(a, '🐾') + OP('+') + objs(b, '🐾'), `${a} and ${b} paw prints`), choices: nums(a + b, t), answer: a + b, ...addHelp(a, b) }); }
        const r = t === 2 ? rnd(3, 6) : rnd(4, 9), c = t === 2 ? rnd(3, 6) : rnd(6, 12);
        return riddle({ tag, kind: 'mul', text: `The raccoon did a happy dance! He stamped ${r} rows of paw prints, with ${c} in each row.`, ask: 'How many paw prints?', visual: pic(r * c <= 40 ? rowsPic(r, c, '🐾') : groupsPic(r, c, '🐾'), `${r} rows of ${c} paw prints`), choices: mulOpts(r, c, t), answer: r * c, ...mulHelp(r, c, 'paw prints') }); },
      t => { const tag = '🖍️ Crayon pile riddle';
        if (t === 0) { const [a, b] = pair(1, 10), more = Math.random() < 0.6, m = moreLess(a, b, (n, v) => crayons(n, v === 'a' ? 'red' : 'blue'), ['the red pile', 'the blue pile'], more);
          return riddle({ tag, kind: 'compare', text: 'The raccoon dropped two piles of crayons.', ask: `Which pile has ${more ? 'more' : 'fewer'}?`, choices: m.choices, answer: m.ans, explain: m.explain, steps: m.steps, explainText: m.explainText }); }
        if (t === 1) { const a = rnd(9, 18), b = rnd(3, a - 2); return riddle({ tag, kind: 'sub', text: `The red pile has ${a} crayons. The blue pile has ${b} crayons.`, ask: 'How many more red crayons are there?', visual: pic(crayons(a, 'red') + crayons(b, 'blue'), `${a} red crayons and ${b} blue crayons`), choices: nums(a - b, t, [a + b]), answer: a - b,
          explain: hopLine([b, a], [`+${a - b}`]), steps: [`Start at the smaller pile, ${b}.`, `Count up to ${a}: ${list(upTo(b + 1, a))}.`, `That is ${a - b} jumps.`], explainText: `${a} − ${b} = ${a - b}. There are ${a - b} more red crayons.` }); }
        const g = t === 2 ? rnd(2, 6) : rnd(4, 9), each = t === 2 ? rnd(2, 9) : rnd(6, 12), n = g * each;
        return riddle({ tag, kind: 'div', text: `The raccoon shares ${n} crayons into ${g} boxes. Every box gets the same.`, ask: 'How many crayons go in each box?', visual: pic(`<span class="sq-total">${n} 🖍️</span>${OP('→')}${groupsPic(g, '?', '📦')}`, `${n} crayons shared into ${g} boxes`), choices: nums(each, t, [each + 1, each - 1, g, n - g]), answer: each, ...divHelp(n, g, each, '📦', 'crayons') }); },
      t => { const tag = '🦉 Crayon hunt riddle', owl = owlName();
        if (t === 0) { const n = rnd(1, 9), up = Math.random() < 0.5 || n < 2, ans = up ? n + 1 : n - 1;
          return riddle({ tag, kind: up ? 'add' : 'sub', text: up ? `${owl} has ${n} crayon${n > 1 ? 's' : ''}. Then ${owl} finds 1 more!` : `${owl} has ${n} crayons. The raccoon takes 1 away!`, ask: 'How many crayons now?', visual: pic(up ? objs(n, '🖍️') + OP('+') + objs(1, '🖍️') : objs(n, '🖍️', { gone: 1 }), up ? `${n} crayons and 1 more` : `${n} crayons, 1 taken away`), choices: nums(ans, t), answer: ans,
            explain: objs(ans, '🖍️', { num: true }), steps: null, explainText: up ? `One more than ${n} is the next number: ${ans}.` : `One less than ${n} is the number before it: ${ans}.` }); }
        if (t === 1) { if (Math.random() < 0.5) { const a = rnd(3, 12), b = rnd(2, Math.min(9, 20 - a)); return riddle({ tag, kind: 'add', text: `${owl} finds ${a} crayons by the lake and ${b} crayons in the cave.`, ask: 'How many crayons altogether?', visual: pic(crayons(a) + OP('+') + crayons(b), `${a} and ${b} crayons`), choices: nums(a + b, t), answer: a + b, ...addHelp(a, b) }); }
          const a = rnd(11, 20), b = rnd(2, 9); return riddle({ tag, kind: 'sub', text: `${owl} has ${a} crayons. Oops! ${b} fall into the river.`, ask: 'How many crayons are left?', visual: pic(crayons(a), `${a} crayons`), choices: nums(a - b, t, [a + b]), answer: a - b, ...subHelp(a, b) }); }
        const a = t === 2 ? rnd(15, 59) : rnd(120, 480), b = t === 2 ? rnd(12, 39) : rnd(105, 399);
        return riddle({ tag, kind: 'add', text: `The raccoon kept ${a} grey crayons and ${b} white crayons in his den.`, ask: 'How many crayons is that in all?', visual: pic(`<span class="sq-total">${a} 🖍️</span>${OP('+')}<span class="sq-total">${b} 🖍️</span>`, `${a} crayons and ${b} crayons`), choices: nums(a + b, t, [a + b + 10, a + b - 10, a + b + 100]), answer: a + b, ...addHelp(a, b) }); }
    ],
    [ // chapter 2: The Number Forest
      t => { const tag = '✨ Firefly jar riddle';
        if (t === 0) { const n = rnd(2, 10); return riddle({ tag, kind: 'count', text: `${owlName()} catches sleepy fireflies in a jar.`, ask: 'How many fireflies are in the jar?', visual: jarSVG(n), choices: nums(n, t), answer: n, ...countHelp(n, '✨', 'fireflies') }); }
        if (t === 1) { const a = rnd(3, 12), b = rnd(2, Math.min(8, 20 - a)); return riddle({ tag, kind: 'add', text: `One jar has ${a} fireflies. Another jar has ${b}.`, ask: 'How many fireflies in both jars?', visual: pic(jarSVG(a) + OP('+') + jarSVG(b), `jars with ${a} and ${b} fireflies`), choices: nums(a + b, t), answer: a + b, ...addHelp(a, b) }); }
        const g = t === 2 ? rnd(2, 5) : rnd(4, 8), c = t === 2 ? rnd(3, 9) : rnd(6, 12);
        return riddle({ tag, kind: 'mul', text: `The beavers fill ${g} jars. Each jar has ${c} fireflies.`, ask: 'How many fireflies in all?', visual: pic(Array.from({ length: g }, () => jarSVG(c, 'sq-jar sm')).join(''), `${g} jars with ${c} fireflies each`), choices: mulOpts(g, c, t), answer: g * c, ...mulHelp(g, c, 'fireflies') }); },
      t => { const tag = '🐸 Frog riddle';
        if (t === 0) { const [a, b] = pair(1, 10), more = Math.random() < 0.6, m = moreLess(a, b, n => jarSVG(n, 'sq-jar sm'), ['the first jar', 'the second jar'], more);
          return riddle({ tag, kind: 'compare', text: 'The frogs hold up two jars of fireflies.', ask: `Which jar has ${more ? 'more' : 'fewer'} fireflies?`, choices: m.choices, answer: m.ans, explain: m.explain, steps: m.steps, explainText: m.explainText }); }
        if (t === 1) { const a = rnd(9, 18), b = rnd(3, a - 2); return riddle({ tag, kind: 'sub', text: `The big jar has ${a} fireflies. The small jar has ${b}.`, ask: 'How many more are in the big jar?', visual: pic(jarSVG(a) + jarSVG(b), `jars with ${a} and ${b} fireflies`), choices: nums(a - b, t, [a + b]), answer: a - b,
          explain: hopLine([b, a], [`+${a - b}`]), steps: [`Start at the smaller number, ${b}.`, `Count up to ${a}: ${list(upTo(b + 1, a))}.`, `That is ${a - b} jumps.`], explainText: `${a} − ${b} = ${a - b}. The big jar has ${a - b} more.` }); }
        const a = t === 2 ? rnd(35, 99) : rnd(210, 950), b = t === 2 ? rnd(12, a - 8) : rnd(105, a - 40);
        return riddle({ tag, kind: 'sub', text: `The frogs counted ${a} fireflies by the pond and ${b} by the stream.`, ask: 'How many more were by the pond?', visual: pic(`<span class="sq-total">🪷 ${a}</span><span class="sq-total">🌊 ${b}</span>`, `${a} by the pond and ${b} by the stream`), choices: nums(a - b, t, [a + b, a - b + 10, a - b - 10]), answer: a - b, ...subHelp(a, b) }); },
      t => { const tag = '🦫 Beaver riddle';
        if (t === 0) { const n = rnd(2, 9), up = Math.random() < 0.5, ans = up ? n + 1 : n - 1;
          return riddle({ tag, kind: up ? 'add' : 'sub', text: up ? `There are ${n} fireflies. 1 more firefly flies in!` : `There are ${n} fireflies. 1 firefly flies home to sleep.`, ask: 'How many fireflies now?', visual: pic(up ? objs(n, '✨') + OP('+') + objs(1, '✨') : objs(n, '✨', { gone: 1 }), up ? `${n} fireflies and 1 more` : `${n} fireflies, 1 flies away`), choices: nums(ans, t), answer: ans,
            explain: objs(ans, '✨', { num: true }), steps: null, explainText: up ? `One more than ${n} is ${ans}.` : `One less than ${n} is ${ans}.` }); }
        if (t === 1) { const a = rnd(11, 20), b = rnd(2, 9); return riddle({ tag, kind: 'sub', text: `${a} fireflies glow over the beaver dam. ${b} of them fly home to sleep.`, ask: 'How many are still glowing?', visual: pic(objs(a, '✨', { gone: b }), `${a} fireflies, ${b} fly away`), choices: nums(a - b, t, [a + b]), answer: a - b, ...subHelp(a, b) }); }
        const each = t === 2 ? rnd(3, 9) : rnd(6, 12), g = t === 2 ? rnd(2, 6) : rnd(4, 12), n = g * each;
        return riddle({ tag, kind: 'div', text: `The beavers have ${n} fireflies. Each lantern holds ${each} fireflies.`, ask: 'How many lanterns can they fill?', visual: pic(`<span class="sq-total">${n} ✨</span>${OP('÷')}<span class="sq-total">${each} in each 🏮</span>`, `${n} fireflies, ${each} in each lantern`), choices: nums(g, t, [g + 1, g - 1, each, n - each]), answer: g,
          explain: groupsPic(g, each, '🏮'), steps: [`Make groups of ${each} until all ${n} are used.`, `Think: what × ${each} = ${n}?`, `${g} × ${each} = ${n}.`], explainText: `They can fill ${g} lanterns.` }); }
    ],
    [ // chapter 3: The Sky Castle
      t => { const tag = '⭐ Star riddle';
        if (t === 0) { const n = rnd(2, 10); return riddle({ tag, kind: 'count', text: 'The stars tumble out of a bucket!', ask: 'How many stars?', visual: pic(objs(n, '⭐'), `${n} stars`), choices: nums(n, t), answer: n, ...countHelp(n, '⭐', 'stars') }); }
        if (t === 1) { const k = rnd(1, 9); return riddle({ tag, kind: 'add', text: `A full bucket has 10 stars. ${k} more stars are next to it.`, ask: 'How many stars in all?', visual: pic(objs(10, '⭐') + OP('+') + objs(k, '⭐'), `10 stars and ${k} more`), choices: nums(10 + k, t, [k, 1 + k]), answer: 10 + k,
          explain: tenFrame(10, k), steps: ['A full ten frame is 10.', `10 and ${k} more is ${10 + k}.`], explainText: `10 + ${k} = ${10 + k}. The 1 means one ten, the ${k} means ${k} ones.` }); }
        const r = t === 2 ? rnd(3, 6) : rnd(4, 9), c = t === 2 ? rnd(3, 6) : rnd(6, 12);
        return riddle({ tag, kind: 'mul', text: `${owlName()} lines the stars up in ${r} rows. Each row has ${c} stars.`, ask: 'How many stars are there?', visual: pic(r * c <= 40 ? rowsPic(r, c, '⭐') : groupsPic(r, c, '⭐'), `${r} rows of ${c} stars`), choices: mulOpts(r, c, t), answer: r * c, ...mulHelp(r, c, 'stars') }); },
      t => { const tag = '🏰 Castle shapes riddle';
        if (t === 0) { const tri = Math.random() < 0.5, T = tri ? rnd(2, 4) : rnd(2, 3), W = tri ? rnd(T, T * 2) : rnd(Math.max(3, T), Math.min(10, T * 4)), w = splitWins(W, T), n = tri ? T : W, nm = tri ? 'triangle roofs' : 'square windows';
          return riddle({ tag, kind: 'count', text: 'The Sky Castle is built from shapes.', ask: `How many ${nm}?`, visual: castleSVG(w), choices: nums(n, t), answer: n, explain: castleSVG(w, tri ? 'tri' : 'sq'), steps: tri ? ['A triangle has 3 sides and 3 corners.', 'Count each pointy roof once.'] : ['A square has 4 sides that are all the same.', 'Count each window once.'], explainText: `There are ${n} ${nm}.` }); }
        if (t === 1) { const T = rnd(2, 4), W = rnd(T + 2, Math.min(16 - T, T * 4)), w = splitWins(W, T);
          return riddle({ tag, kind: 'add', text: 'The castle has triangle roofs and square windows.', ask: 'How many triangles and squares in all?', visual: castleSVG(w), choices: nums(T + W, t, [T, W]), answer: T + W,
            explain: castleSVG(w, 'both'), steps: [`Count the triangles: ${T}.`, `Count the squares: ${W}.`, `Add them: ${T} + ${W}.`], explainText: `${T} + ${W} = ${T + W} shapes.` }); }
        const T = rnd(2, 4), W = rnd(T + 1, T * 4), w = splitWins(W, T);
        if (t === 2) return riddle({ tag, kind: 'mul', text: 'Every square window has 4 corners.', ask: 'How many corners do all the windows have?', visual: castleSVG(w), choices: mulOpts(W, 4, t), answer: W * 4,
          explain: castleSVG(w, 'sq'), steps: [`There are ${W} windows.`, `${W} windows with 4 corners each is ${W} × 4.`], explainText: `${W} × 4 = ${W * 4} corners.` });
        return riddle({ tag, kind: 'mul', text: 'Every triangle has 3 corners and every square has 4 corners.', ask: 'How many corners on all the roofs and windows?', visual: castleSVG(w), choices: nums(3 * T + 4 * W, t, [4 * (T + W), 3 * (T + W), 4 * W, 3 * T + 4 * W + 1]), answer: 3 * T + 4 * W,
          explain: castleSVG(w, 'both'), steps: [`${T} triangles: ${T} × 3 = ${3 * T}.`, `${W} squares: ${W} × 4 = ${4 * W}.`, `${3 * T} + ${4 * W} = ${3 * T + 4 * W}.`], explainText: `There are ${3 * T + 4 * W} corners in all.` }); },
      t => { const tag = '🌙 Moon pattern riddle';
        if (t <= 1) { const set = shuffle(PAT).slice(0, 3), unit = t === 0 ? [set[0], set[1]] : pick([[set[0], set[1], set[2]], [set[0], set[0], set[1]], [set[0], set[1], set[1]]]);
          const len = t === 0 ? 5 : unit.length * 2 + rnd(0, unit.length - 1), seq = Array.from({ length: len }, (_, k) => unit[k % unit.length]), ans = unit[len % unit.length];
          const choices = opts(ans[0], set.map(x => x[0]), t ? 3 : 2 + (Math.random() < 0.5 ? 1 : 0), v => v, v => PAT.find(x => x[0] === v)[1]);
          const unitHTML = `<span class="sq-unit">${unit.map(x => `<span>${x[0]}</span>`).join('')}</span>`;
          return riddle({ tag, kind: 'pattern', text: 'The Moon hangs lights in a pattern.', ask: 'What comes next?', visual: `<div class="pat sq-pat">${seq.map(x => `<span>${x[0]}</span>`).join('')}<span class="dot q">?</span></div>`, choices, answer: ans[0],
            explain: `<div class="pat sq-pat">${unitHTML.repeat(Math.ceil((len + 1) / unit.length))}</div>`, steps: [`Find the part that repeats: ${unit.map(x => x[1]).join(', ')}.`, 'Say it again and again, and keep going.'], explainText: `${seq.map(x => x[1]).join(', ')}, … the next one is the ${ans[1]}.` }); }
        const d = t === 2 ? rnd(2, 10) : rnd(11, 25), s = t === 2 ? d : rnd(3, 60), vals = Array.from({ length: 5 }, (_, k) => s + k * d), ans = s + 5 * d;
        return riddle({ tag, kind: 'pattern', topic: t === 2 ? 'skip' : 'sequences', text: 'Each night the Moon wakes up more stars.', ask: 'How many stars on the next night?', visual: `<div class="pat sq-pat">${vals.map(v => `<span class="sq-nb">⭐<b>${v}</b></span>`).join('')}<span class="dot q">?</span></div>`, choices: nums(ans, t, [ans + d, ans - 1, ans + 1, vals[4] + d + 1]), answer: ans,
          explain: hopLine([...vals.slice(2), ans], [`+${d}`, `+${d}`, `+${d}`]), steps: [`Find the jump between numbers: ${vals[1]} − ${vals[0]} = ${d}.`, `Every night has ${d} more stars.`], explainText: `${vals[4]} + ${d} = ${ans}.` }); }
    ],
    [ // chapter 4: Under the Sea
      t => { const tag = t === 0 ? '🐙 Bubble riddle' : '🐟 Fish school riddle';
        if (t === 0) { const n = rnd(2, 10); return riddle({ tag, kind: 'count', text: 'Inky the octopus blows bubbles. Blub, blub!', ask: 'How many bubbles?', visual: bubblesSVG(n), choices: nums(n, t), answer: n,
          explain: bubblesSVG(n, true), steps: n > 3 ? ['Touch the first bubble and say 1.', 'Touch each bubble once and say the next number.'] : null, explainText: `${list(upTo(1, n))}. There ${n === 1 ? 'is' : 'are'} ${n} bubble${n === 1 ? '' : 's'}!` }); }
        if (t === 1) { const a = rnd(3, 12), b = rnd(2, Math.min(8, 20 - a)); return riddle({ tag, kind: 'add', text: `A school of ${a} fish swims by. Then ${b} more fish join them.`, ask: 'How many fish in all?', visual: pic(objs(a, '🐟') + OP('+') + objs(b, '🐠'), `${a} fish and ${b} more fish`), choices: nums(a + b, t), answer: a + b, ...addHelp(a, b) }); }
        const r = t === 2 ? rnd(3, 6) : rnd(4, 9), c = t === 2 ? rnd(3, 6) : rnd(6, 12);
        return riddle({ tag, kind: 'mul', text: `A big school of fish swims in ${r} rows. Each row has ${c} fish.`, ask: 'How many fish are in the school?', visual: pic(r * c <= 40 ? rowsPic(r, c, '🐟') : groupsPic(r, c, '🐟'), `${r} rows of ${c} fish`), choices: mulOpts(r, c, t), answer: r * c, ...mulHelp(r, c, 'fish') }); },
      t => { const tag = '🐚 Shell riddle';
        if (t === 0) { const [a, b] = pair(1, 10), more = Math.random() < 0.6, m = moreLess(a, b, (n, v) => shells(n, v === 'a' ? '#F49AC1' : '#FFC23D'), ['the pink pile', 'the yellow pile'], more);
          return riddle({ tag, kind: 'compare', text: 'The two crabs each have a pile of shells.', ask: `Which pile has ${more ? 'more' : 'fewer'} shells?`, choices: m.choices, answer: m.ans, explain: m.explain, steps: m.steps, explainText: m.explainText }); }
        if (t === 1) { const a = rnd(9, 18), b = rnd(3, a - 2); return riddle({ tag, kind: 'sub', text: `The big crab has ${a} shells. The little crab has ${b} shells.`, ask: 'How many more shells does the big crab have?', visual: pic(shells(a, '#F49AC1') + shells(b, '#FFC23D'), `${a} pink shells and ${b} yellow shells`), choices: nums(a - b, t, [a + b]), answer: a - b,
          explain: hopLine([b, a], [`+${a - b}`]), steps: [`Start at the smaller pile, ${b}.`, `Count up to ${a}: ${list(upTo(b + 1, a))}.`, `That is ${a - b} jumps.`], explainText: `${a} − ${b} = ${a - b}. The big crab has ${a - b} more shells.` }); }
        const a = t === 2 ? rnd(35, 99) : rnd(210, 950), b = t === 2 ? rnd(12, a - 8) : rnd(105, a - 40);
        return riddle({ tag, kind: 'sub', text: `The mermaid has ${a} shells. Inky has ${b} shells.`, ask: 'How many more shells does the mermaid have?', visual: pic(`<span class="sq-total">🧜 ${a}</span><span class="sq-total">🐙 ${b}</span>`, `the mermaid has ${a} and Inky has ${b}`), choices: nums(a - b, t, [a + b, a - b + 10, a - b - 10]), answer: a - b, ...subHelp(a, b) }); },
      t => { const tag = '🦪 Pearl riddle';
        if (t === 0) { const n = rnd(1, 9), up = Math.random() < 0.5 || n < 2, ans = up ? n + 1 : n - 1;
          return riddle({ tag, kind: up ? 'add' : 'sub', text: up ? `Inky has ${n} pearl${n > 1 ? 's' : ''}. She finds 1 more!` : `Inky has ${n} pearls. A crab borrows 1.`, ask: 'How many pearls now?', visual: pic(up ? objs(n, PEARL) + OP('+') + objs(1, PEARL) : objs(n, PEARL, { gone: 1 }), up ? `${n} pearls and 1 more` : `${n} pearls, 1 taken away`), choices: nums(ans, t), answer: ans,
            explain: objs(ans, PEARL, { num: true }), steps: null, explainText: up ? `One more than ${n} is the next number: ${ans}.` : `One less than ${n} is the number before it: ${ans}.` }); }
        if (t === 1) { const n = rnd(2, 10), h = addHelp(n, n); return riddle({ tag, kind: 'add', topic: 'doubles', text: `Two clams are open. Each clam has ${n} pearls.`, ask: 'How many pearls in both clams?', visual: pic(clamSVG(n) + OP('+') + clamSVG(n), `two clams with ${n} pearls each`), choices: nums(2 * n, t, [n, n + 1, 2 * n + 2]), answer: 2 * n,
          explain: h.explain, steps: [`The same number twice is called a double.`, ...h.steps], explainText: `Double ${n}: ${n} + ${n} = ${2 * n}.` }); }
        if (t === 2) { const g = rnd(2, 5), each = rnd(2, 6), n = g * each;
          return riddle({ tag, kind: 'div', text: `The Octopus Queen shares ${n} pearls into ${g} clams. Every clam gets the same.`, ask: 'How many pearls go in each clam?', visual: pic(`<span class="sq-total">${n} ${PEARL}</span>${OP('→')}${groupsPic(g, '?', '🦪')}`, `${n} pearls shared into ${g} clams`), choices: nums(each, t, [each + 1, each - 1, g, n - g]), answer: each, ...divHelp(n, g, each, '🦪', 'pearls') }); }
        const each = rnd(6, 12), g = rnd(4, 12), n = g * each;
        return riddle({ tag, kind: 'div', text: `The palace has ${n} pearls. Each clam can hold ${each} pearls.`, ask: 'How many clams do they need?', visual: pic(`<span class="sq-total">${n} ${PEARL}</span>${OP('÷')}<span class="sq-total">${each} in each 🦪</span>`, `${n} pearls, ${each} in each clam`), choices: nums(g, t, [g + 1, g - 1, each, n - each]), answer: g,
          explain: groupsPic(g, each, '🦪'), steps: [`Make groups of ${each} until all ${n} are used.`, `Think: what × ${each} = ${n}?`, `${g} × ${each} = ${n}.`], explainText: `They need ${g} clams.` }); }
    ],
    [ // chapter 5: Dino Valley
      t => { const tag = '🥚 Dino egg riddle';
        if (t === 0) { const n = rnd(2, 10); return riddle({ tag, kind: 'count', text: 'A dino mama has a nest full of eggs.', ask: 'How many eggs are in the nest?', visual: nestSVG(n), choices: nums(n, t), answer: n,
          explain: nestSVG(n, true), steps: n > 3 ? ['Touch the first egg and say 1.', 'Touch each egg once and say the next number.'] : null, explainText: `${list(upTo(1, n))}. There ${n === 1 ? 'is' : 'are'} ${n} egg${n === 1 ? '' : 's'}!` }); }
        if (t === 1) { const a = rnd(3, 10), b = rnd(2, Math.min(8, 20 - a)); return riddle({ tag, kind: 'add', text: `One nest has ${a} eggs. The nest next to it has ${b} eggs.`, ask: 'How many eggs in both nests?', visual: pic(nestSVG(a) + OP('+') + nestSVG(b), `nests with ${a} and ${b} eggs`), choices: nums(a + b, t), answer: a + b, ...addHelp(a, b) }); }
        const g = t === 2 ? rnd(2, 5) : rnd(4, 9), c = t === 2 ? rnd(3, 9) : rnd(6, 12);
        return riddle({ tag, kind: 'mul', text: `There are ${g} nests on the Egg Hills. Each nest has ${c} eggs.`, ask: 'How many eggs in all?', visual: pic(t === 2 ? Array.from({ length: g }, () => nestSVG(c, false, 'sq-nest sm')).join('') : groupsPic(g, c, '🥚'), `${g} nests with ${c} eggs each`), choices: mulOpts(g, c, t), answer: g * c, ...mulHelp(g, c, 'eggs') }); },
      t => { const tag = '📏 Dino size riddle';
        if (t === 0) { const [a, b] = pair(2, 10), longer = Math.random() < 0.6, ans = (a > b) === longer ? 'a' : 'b', hi = Math.max(a, b), lo = Math.min(a, b);
          const nm = ['the green dino', 'the orange dino'], rows = [['🦕', a, '#7DB653'], ['🦖', b, '#FF8A2B']];
          return riddle({ tag, kind: 'compare', topic: 'sizes', text: 'Two dinosaurs lie down next to a row of blocks to measure how long they are.', ask: `Which dino is ${longer ? 'longer' : 'shorter'}?`,
            choices: [['a', 0], ['b', 1]].map(([v, k]) => ({ html: `<span class="sq-pick">${dinoBar(rows[k][0], rows[k][1], rows[k][2], hi)}</span>`, val: v, say: nm[k], txt: false })), answer: ans,
            explain: lenSVG(rows, true), steps: ['Line them up at the same start.', `${hi} blocks is ${hi - lo} more than ${lo} blocks.`], explainText: `The green dino is ${a} blocks, the orange dino is ${b} blocks. ${hi} is longer and ${lo} is shorter, so the answer is ${nm[ans === 'a' ? 0 : 1]}.` }); }
        if (t === 1) { const a = rnd(9, 18), b = rnd(3, a - 2), rows = [['🦕', a, '#7DB653'], ['🦖', b, '#FF8A2B']];
          return riddle({ tag, kind: 'sub', text: `The Long-Neck is ${a} blocks long. The little T-rex is ${b} blocks long.`, ask: 'How many blocks longer is the Long-Neck?', visual: lenSVG(rows), choices: nums(a - b, t, [a + b]), answer: a - b,
            explain: lenSVG(rows, true), steps: [`Line them up at the same start.`, `Count the extra red blocks: start at ${b} and count up to ${a}.`], explainText: `${a} − ${b} = ${a - b}. The Long-Neck is ${a - b} blocks longer.` }); }
        if (t === 2) { const a = rnd(21, 39), b = rnd(11, a - 6);
          return riddle({ tag, kind: 'sub', text: `A Long-Neck is ${a} metres long. A T-rex is ${b} metres long.`, ask: 'How many metres longer is the Long-Neck?', visual: pic(`<span class="sq-total">🦕 ${a} m</span><span class="sq-total">🦖 ${b} m</span>`, `${a} metres and ${b} metres`), choices: nums(a - b, t, [a + b, a - b + 10, a - b - 10]), answer: a - b, ...subHelp(a, b) }); }
        const g = rnd(4, 9), L = pick([12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28]), tens = L - L % 10, ones = L % 10, ans = g * L;
        return riddle({ tag, kind: 'mul', topic: 'longmul', text: `${g} Long-Necks stand nose to tail in a line. Each one is ${L} metres long.`, ask: 'How long is the whole line?', visual: pic(`<span class="sq-total">${g} × 🦕</span><span class="sq-total">${L} m each</span>`, `${g} dinosaurs, ${L} metres each`), choices: nums(ans, t, [ans + g, ans - g, ans + 10, ans - 10, g + L]), answer: ans,
          explain: groupsPic(g, `${L} m`, '🦕'), steps: [`${g} × ${L}: split ${L} into ${tens} and ${ones}.`, `${g} × ${tens} = ${g * tens}.`, `${g} × ${ones} = ${g * ones}.`, `${g * tens} + ${g * ones} = ${ans}.`], explainText: `The line is ${ans} metres long.` }); },
      t => {
        if (t === 0 && Math.random() < 0.5) { const tag = '🌴 Dino pattern riddle', set = shuffle(PAT5).slice(0, 2), len = 5, seq = Array.from({ length: len }, (_, k) => set[k % 2]), ans = set[len % 2];
          const choices = opts(ans[0], shuffle(PAT5).map(x => x[0]), 2 + (Math.random() < 0.5 ? 1 : 0), v => v, v => PAT5.find(x => x[0] === v)[1]);
          return riddle({ tag, kind: 'pattern', text: 'Pip lines up toys in a pattern.', ask: 'What comes next?', visual: `<div class="pat sq-pat">${seq.map(x => `<span>${x[0]}</span>`).join('')}<span class="dot q">?</span></div>`, choices, answer: ans[0],
            explain: `<div class="pat sq-pat">${`<span class="sq-unit">${set.map(x => `<span>${x[0]}</span>`).join('')}</span>`.repeat(3)}</div>`, steps: [`Find the part that repeats: ${set.map(x => x[1]).join(', ')}.`, 'Say it again and again, and keep going.'], explainText: `${seq.map(x => x[1]).join(', ')}, … the next one is the ${ans[1]}.` }); }
        if (t === 0) { const tag = '🔢 First and last riddle', o = pick(ORDER), first = Math.random() < 0.5, ans = first ? o.s[0] : o.s[2];
          return riddle({ tag, kind: 'order', text: o.text, ask: `What happens ${first ? 'first' : 'last'}?`, choices: opts(ans[0], o.s.map(x => x[0]), 3, v => v, v => o.s.find(x => x[0] === v)[1]), answer: ans[0],
            explain: `<div class="pat sq-pat">${o.s.map((x, k) => `<span class="sq-nb">${x[0]}<b>${k + 1}</b></span>`).join(OP('→'))}</div>`, steps: [`First: ${o.s[0][1]}.`, `Next: ${o.s[1][1]}.`, `Last: ${o.s[2][1]}.`], explainText: `${first ? 'First' : 'Last'} is the ${ans[1]}.` }); }
        if (t === 1 && Math.random() < 0.5) { const tag = '👣 Footprint riddle', a = rnd(11, 20), b = rnd(2, 9);
          return riddle({ tag, kind: 'sub', text: `The path to Mama has ${a} footprints. Pip has hopped on ${b} of them.`, ask: 'How many footprints are left to hop on?', visual: pic(objs(a, '👣', { gone: b }), `${a} footprints, ${b} hopped on`), choices: nums(a - b, t, [a + b]), answer: a - b, ...subHelp(a, b) }); }
        const tag = '⏰ Volcano clock riddle';
        if (t === 1) { const h = rnd(1, 12), d = rnd(1, 4), e = (h + d - 1) % 12 + 1, at = x => timeStr((x + 11) % 12 + 1, 0);
          return riddle({ tag, kind: 'time', text: `It is ${h} o'clock. The volcano will puff in ${d} hour${d > 1 ? 's' : ''}.`, ask: 'What time will it puff?', visual: clockSVG(h, 0), choices: opts(at(e), [at(e + 1), at(e - 1), at(h), at(h - d), at(e + 2)], 4, v => v), answer: at(e),
            explain: twoClocks(h * 60, e * 60), steps: [`Start at ${h} o'clock.`, `Move the short hand on ${d}: ${list(Array.from({ length: d }, (_, k) => (h + k) % 12 + 1))}.`], explainText: `${d} hour${d > 1 ? 's' : ''} after ${h} o'clock is ${e} o'clock.` }); }
        if (t === 2) { const st0 = rnd(1, 11) * 60 + rnd(0, 11) * 5, d = pick([15, 20, 25, 30, 35, 40, 45]), end = st0 + d, toHr = 60 - st0 % 60;
          return riddle({ tag, kind: 'time', text: `Pip starts walking home at ${tm(st0)}. The walk takes ${d} minutes.`, ask: 'What time does Pip get home?', visual: clockSVG(...clk(st0)), choices: opts(tm(end), [tm(end + 5), tm(end - 5), tm(end + 10), tm(end - 10), tm(end + 60), tm(st0 - d)], 4, v => v), answer: tm(end),
            explain: twoClocks(st0, end), steps: d < toHr ? [`Start at ${tm(st0)}.`, `Count on ${d} minutes: ${st0 % 60} + ${d} = ${st0 % 60 + d}.`] : [`From ${tm(st0)} to the next o'clock is ${toHr} minutes.`, `${d} − ${toHr} = ${d - toHr} more minutes after that.`], explainText: `${d} minutes after ${tm(st0)} is ${tm(end)}.` }); }
        const now = rnd(1, 10) * 60 + rnd(0, 11) * 5, d = rnd(7, 22) * 5, puff = now + d, toHr = 60 - now % 60;
        return riddle({ tag, kind: 'time', text: `It is ${tm(now)}. The volcano will puff at ${tm(puff)}.`, ask: 'How many minutes until it puffs?', visual: twoClocks(now, puff), choices: nums(d, t, [d + 5, d - 5, d + 10, d - 10, d + 60, d - 60, d + 40]), answer: d,
          explain: twoClocks(now, puff), steps: d <= toHr ? [`Count on from ${tm(now)} to ${tm(puff)} in fives.`] : [`From ${tm(now)} to the next o'clock: ${toHr} minutes.`, `Then on to ${tm(puff)}: ${d - toHr} minutes.`, `${toHr} + ${d - toHr} = ${d}.`], explainText: `It puffs in ${d} minutes${d >= 60 ? `, which is 1 hour${d > 60 ? ` and ${d - 60} minutes` : ''}` : ''}.` }); }
    ]
  ];

  const makeRiddle = (c, type, t = tierOf()) => { const q = RIDDLES[c][type % 3](t); if (!q.topic) q.topic = topicOf(q.kind, t); return q; };

  // Math: 3 questions from the player's age world. The first one is the topic the engine recommends,
  // the second is always a story riddle, and on a chapter's final stop the third one is too.
  function pickSkill(k, used) {
    const w = clamp(ageWorld(st.age), 0, WORLDS.length - 1), ids = worldSkills(w).map(x => x.id);
    if (k === 0) { try { return recommendSkill(w); } catch (e) {} }
    const fresh = ids.filter(x => !used.includes(x));
    return pick(fresh.length ? fresh : ids);
  }
  function mathStep(c, i, k, used) {
    const ch = CH[c], s = ch.stops[i];
    let skill = null, q = null;
    if (k === 1 || (k === 2 && s.final)) { // a riddle from this chapter's story; each math stop starts on a different kind
      const m = ch.stops.slice(0, i).filter(x => x.kind === 'math').length;
      try { q = makeRiddle(c, m + k - 1); } catch (e) { q = null; }
    }
    if (!q) {
      skill = pickSkill(k, used);
      try { q = MATH[skill].gen(level(skill)); } catch (e) { skill = 'count'; q = MATH.count.gen(1); }
      // Hands-on questions (set a clock, pay, build a chart) need their own screen; story stops use tap answers.
      for (let t = 0; q.interact && t < 6; t++) { skill = pickSkill(k, used.concat(skill)); try { q = MATH[skill].gen(level(skill)); } catch (e) { q = { interact: 1 }; } }
      if (q.interact) { skill = 'count'; q = MATH.count.gen(1); }
      used.push(skill);
    }
    // what the engine learns from: the generic question's skill, or the topic a story riddle practises
    const topic = skill || (q.story && q.topic && MATH[q.topic] && st.skills[q.topic] ? q.topic : null);
    const t0 = Date.now(); let tries = 0, hinted = false;
    const dots = `<div class="sq-dots" aria-label="Puzzle ${k + 1} of 3">${[0, 1, 2].map(j => `<i class="${j < k ? 'on' : j === k ? 'now' : ''}">${j < k ? ch.token : ''}</i>`).join('')}</div>`;
    const cols = q.choices.some(x => String(x.html).replace(/<[^>]+>/g, '').length > 6) && q.choices.length > 2 ? 2 : q.choices.length > 4 ? 3 : q.choices.length;
    view.innerHTML = `${taskBar(c, i, fill(s.task, c), dots)}
      <div class="qcard sq-q${q.story ? ' sq-riddle' : ''}"${q.story ? ` data-story="${q.kind}"` : ''}>
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
        if (first && topic) learn(topic, true, Date.now() - t0);
        dayLog('q'); if (first) dayLog('ok');
        questTick('math'); if (first) questTick('firsttry');
        const cheer = first ? pick(['Great job!', 'You got it!', 'Super!', 'Yes!', 'Brilliant!']) : 'Now you know it!';
        $('#cheer').textContent = cheer + ' ' + ch.token; yay(); say(cheer);
        save();
        later(() => k < 2 ? mathStep(c, i, k + 1, used) : complete(c, i), first ? 1300 : 2200);
      } else {
        tries++; b.classList.add('wrong'); b.disabled = true; oops();
        if (tries === 1 && topic) { learn(topic, false, Date.now() - t0); if (skill) addReview(skill, q); save(); } // riddles stay out of review
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

  if (location.hash === '#selftest') window.__quest = { CH, get state() { return S(); }, mapView, stopView, bookView, chapterDone, layout, isDone, nextStop, riddle: makeRiddle, topicOf, tierOf, get watching() { return !!unwatchMap; } };
  mapView.CH = CH; // the grown-ups' progress report counts chapters and stops
  return mapView;
}/*}lazy*/, ['__quest']);
