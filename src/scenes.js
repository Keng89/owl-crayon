/* ---------- sticker scenes: pick a place, add stickers, doodle, count, tell a story, save ---------- */
const sceneHome = (() => {
  const W = 400, H = 300; // scene units; the stage is always 4:3
  // Starry skies need the same stars every time, so they come from a tiny seeded random.
  const dots = (n, seed, y0, y1, r0, r1, fill) => { let s = seed, o = ''; const R = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < n; i++) o += `<circle cx="${(R() * W).toFixed(0)}" cy="${(y0 + R() * (y1 - y0)).toFixed(0)}" r="${(r0 + R() * (r1 - r0)).toFixed(1)}" fill="${fill}"/>`; return o; };
  const cloud = (x, y, k = 1, c = '#fff') => `<g fill="${c}" transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="0" rx="26" ry="14"/><ellipse cx="-18" cy="6" rx="18" ry="11"/><ellipse cx="20" cy="6" rx="20" ry="11"/><ellipse cx="2" cy="-9" rx="16" ry="12"/></g>`;
  const BGS = [
    { id: 'beach', name: 'Beach', at: 'at the beach', svg: `<rect width="400" height="300" fill="#8ED8F8"/><circle cx="335" cy="52" r="30" fill="#FFD54A"/><circle cx="335" cy="52" r="40" fill="#FFD54A" opacity=".25"/>${cloud(90, 50)}${cloud(220, 34, .7)}
      <rect y="140" width="400" height="70" fill="#2E9BD6"/><path d="M0 150q20-8 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0" stroke="#8ED8F8" stroke-width="4" fill="none" opacity=".7"/><path d="M0 172q25-7 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0" stroke="#7FC6EE" stroke-width="3" fill="none" opacity=".6"/>
      <path d="M0 198q50-14 100-4t110 2 100-6 90 6V300H0z" fill="#F6DC9A"/><path d="M0 204q50-12 100-3t110 2 100-5 90 5" stroke="#fff" stroke-width="5" fill="none" opacity=".8"/>
      <g transform="translate(46 210)"><path d="M0 0L6 -60" stroke="#8B5A2B" stroke-width="3"/><path d="M-34 -52Q6 -88 46 -68Z" fill="#F2604F"/><path d="M-34 -52Q-8 -78 6 -60Z" fill="#fff"/></g>${dots(14, 3, 220, 295, 1.5, 2.5, '#E3C47A')}` },
    { id: 'farm', name: 'Farm', at: 'on the farm', svg: `<rect width="400" height="300" fill="#A9DDF7"/><circle cx="60" cy="50" r="26" fill="#FFD54A"/>${cloud(200, 45)}${cloud(320, 70, .8)}
      <path d="M0 160Q90 110 190 150T400 140V300H0z" fill="#8BCF6A"/><path d="M0 190Q120 160 260 185T400 180V300H0z" fill="#6DBB4F"/>
      <g transform="translate(290 112)"><rect x="0" y="30" width="80" height="62" fill="#D9473A"/><path d="M-8 32L40 0 88 32z" fill="#A8322A"/><rect x="28" y="58" width="24" height="34" fill="#fff"/><path d="M28 58l24 34M52 58L28 92" stroke="#D9473A" stroke-width="3"/><rect x="31" y="38" width="18" height="14" fill="#fff"/></g>
      <g stroke="#fff" stroke-width="4">${[...Array(9)].map((_, i) => `<line x1="${10 + i * 32}" y1="214" x2="${10 + i * 32}" y2="244"/>`).join('')}<line x1="0" y1="222" x2="275" y2="222"/><line x1="0" y1="236" x2="275" y2="236"/></g>
      <path d="M150 300Q190 260 230 250T330 230" stroke="#D9B27C" stroke-width="22" fill="none" stroke-linecap="round"/>` },
    { id: 'space', name: 'Space', at: 'in space', svg: `<rect width="400" height="300" fill="#151A3D"/>${dots(70, 11, 0, 240, .6, 1.8, '#fff')}${dots(8, 5, 0, 220, 2, 3, '#FFE79A')}
      <circle cx="320" cy="72" r="30" fill="#F2A65A"/><path d="M320 64q-16 6-28 2M325 82q-14 4-32 0" stroke="#D9843A" stroke-width="4" fill="none"/><ellipse cx="320" cy="74" rx="52" ry="11" fill="none" stroke="#FFD08A" stroke-width="4" transform="rotate(-14 320 74)"/>
      <circle cx="70" cy="60" r="14" fill="#7FC6EE"/><circle cx="66" cy="56" r="5" fill="#2FA36B"/>
      <path d="M0 250Q100 225 200 245T400 238V300H0z" fill="#B7B9CC"/><ellipse cx="80" cy="268" rx="22" ry="7" fill="#9A9CB2"/><ellipse cx="250" cy="282" rx="30" ry="8" fill="#9A9CB2"/><ellipse cx="340" cy="258" rx="14" ry="5" fill="#9A9CB2"/>` },
    { id: 'sea', name: 'Under the sea', at: 'under the sea', svg: `<rect width="400" height="300" fill="#1B78C2"/><rect width="400" height="110" fill="#2E9BD6"/><path d="M60 0L20 300H70L110 0zM200 0L180 300H230L250 0zM320 0L330 300H370L350 0z" fill="#fff" opacity=".07"/>
      ${[[40, 80, 5], [52, 60, 3], [300, 120, 6], [312, 96, 4], [180, 50, 3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#BFE6FF" stroke-width="2"/>`).join('')}
      <path d="M0 255Q70 238 150 252T300 248 400 250V300H0z" fill="#E9CF8E"/>
      ${[[30, 0], [62, 1], [355, 0], [378, 1], [190, 1]].map(([x, k]) => `<path d="M${x} 262q${k ? 14 : -14}-24 0-48t0-48" stroke="#2FA36B" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}
      <g fill="#F2604F"><path d="M250 258q-6-26 4-38q2 14 8 18q2-16 10-22q-2 18 2 42z"/></g>${dots(10, 9, 262, 296, 1.5, 2.5, '#D2B26E')}` },
    { id: 'forest', name: 'Forest', at: 'in the forest', svg: `<rect width="400" height="300" fill="#BFE6F5"/>${cloud(300, 40, .8)}
      <g fill="#4E9E66">${[20, 70, 130, 200, 260, 330, 385].map((x, i) => `<path d="M${x} ${70 + (i % 3) * 14}l-34 120h68z"/>`).join('')}</g>
      <g fill="#3B7F51">${[45, 165, 235, 300, 360].map((x, i) => `<path d="M${x} ${100 + (i % 2) * 16}l-30 110h60z"/>`).join('')}</g>
      <rect y="200" width="400" height="100" fill="#6CB650"/><path d="M170 300Q200 250 180 230T220 200" stroke="#D9B27C" stroke-width="26" fill="none" stroke-linecap="round"/>${dots(18, 21, 215, 295, 2, 3, '#4E9E40')}` },
    { id: 'city', name: 'City street', at: 'in the city', svg: `<rect width="400" height="300" fill="#9FD3F2"/>${cloud(80, 36, .8)}
      ${[[0, 90, 60, '#6D55D1'], [62, 60, 54, '#2E8BE6'], [118, 110, 70, '#F49AC1'], [190, 50, 56, '#FF8A2B'], [248, 80, 66, '#2FA36B'], [316, 40, 84, '#8C7AE6']].map(([x, y, w, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${215 - y}" fill="${c}"/>` + [...Array(Math.floor((205 - y) / 28))].map((_, r) => [...Array(Math.floor((w - 8) / 18))].map((_, k) => `<rect x="${x + 8 + k * 18}" y="${y + 12 + r * 28}" width="10" height="14" fill="#FFF1A8"/>`).join('')).join('')).join('')}
      <rect y="214" width="400" height="18" fill="#D2D6DE"/><rect y="232" width="400" height="68" fill="#4D5361"/><path d="M0 266h400" stroke="#FFC23D" stroke-width="5" stroke-dasharray="26 20"/>` },
    { id: 'snow', name: 'Snowy hill', at: 'on the snowy hill', svg: `<rect width="400" height="300" fill="#CFE7F7"/>
      <path d="M-20 200L80 80 170 200zM120 200L250 60 380 200zM300 200L380 110 440 200z" fill="#A7C4DA"/><path d="M80 80l-24 28 14-4 10 10 10-12 14 6zM250 60l-30 34 16-4 14 12 12-14 18 6z" fill="#fff"/>
      <path d="M0 210Q140 150 260 196T400 190V300H0z" fill="#fff"/><path d="M0 250Q160 220 400 260V300H0z" fill="#E3EFF8"/>${dots(40, 7, 0, 290, 1.5, 3, '#fff')}` },
    { id: 'castle', name: 'Castle', at: 'at the castle', svg: `<rect width="400" height="300" fill="#E8D9FF"/>${cloud(70, 50, .8)}${cloud(330, 36, .7)}
      <g fill="#B9A9D9"><rect x="120" y="100" width="160" height="110"/><rect x="104" y="70" width="40" height="140"/><rect x="256" y="70" width="40" height="140"/><rect x="180" y="50" width="40" height="60"/></g>
      <g fill="#8C7AE6"><path d="M98 72l26-36 26 36zM250 72l26-36 26 36zM174 52l26-34 26 34z"/></g><g stroke="#8B5A2B" stroke-width="2"><line x1="124" y1="36" x2="124" y2="20"/><line x1="276" y1="36" x2="276" y2="20"/><line x1="200" y1="18" x2="200" y2="4"/></g><g fill="#F2604F"><path d="M124 20l14 4-14 4zM276 20l14 4-14 4zM200 4l14 4-14 4z"/></g>
      <path d="M180 210v-40a20 20 0 0 1 40 0v40z" fill="#6B4A2B"/><g fill="#FFF1A8"><rect x="116" y="96" width="14" height="20" rx="7"/><rect x="270" y="96" width="14" height="20" rx="7"/><rect x="194" y="70" width="12" height="18" rx="6"/></g>
      <rect y="206" width="400" height="94" fill="#8BD07A"/><path d="M200 210Q190 250 160 300H240Q210 250 200 210z" fill="#E6D3A3"/>` },
    { id: 'jungle', name: 'Jungle', at: 'in the jungle', svg: `<rect width="400" height="300" fill="#7FCB8A"/><rect width="400" height="300" fill="#2E7D4F" opacity=".35"/>
      ${[[0, 30, -30], [40, 0, 20], [370, 20, 200], [400, 70, 160], [20, 120, -60], [380, 140, 220]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="70" ry="22" fill="#2E7D4F" transform="rotate(${r} ${x} ${y})"/>`).join('')}
      <path d="M110 0q-10 60 10 110M290 0q14 50-6 90" stroke="#3B7F2E" stroke-width="5" fill="none"/><g fill="#5BB04C"><ellipse cx="118" cy="60" rx="8" ry="4"/><ellipse cx="114" cy="86" rx="8" ry="4"/><ellipse cx="292" cy="50" rx="8" ry="4"/></g>
      <path d="M0 230Q100 205 200 225T400 220V300H0z" fill="#4E8F34"/>${[[60, 236], [200, 240], [330, 232]].map(([x, y]) => `<path d="M${x} ${y}q-20-30-36-24q20 6 36 24zM${x} ${y}q18-34 38-30q-22 6-38 30z" fill="#2E7D4F"/>`).join('')}` },
    { id: 'party', name: 'Birthday party', at: 'at the birthday party', svg: `<rect width="400" height="300" fill="#FFE3EC"/>${dots(30, 13, 40, 200, 3, 5, '#FFC9DA')}
      <path d="M0 14Q100 44 200 14T400 14" stroke="#22305A" stroke-width="2" fill="none"/>${[...Array(12)].map((_, i) => { const x = 8 + i * 33, y = 14 + 13 * Math.sin(Math.PI * ((x % 200) / 200)); return `<path d="M${x} ${y.toFixed(0)}l16 2-6 22z" fill="${['#F2604F', '#FFC23D', '#2FA36B', '#2E8BE6', '#6D55D1'][i % 5]}"/>`; }).join('')}
      <rect y="210" width="400" height="90" fill="#F7C98B"/><path d="M0 210h400" stroke="#E0A65E" stroke-width="4"/>
      <rect x="90" y="190" width="220" height="16" rx="6" fill="#fff"/><path d="M96 206h208l-8 30H104z" fill="#F2604F" opacity=".85"/><g fill="#fff" opacity=".6"><circle cx="130" cy="220" r="4"/><circle cx="170" cy="224" r="4"/><circle cx="210" cy="220" r="4"/><circle cx="250" cy="224" r="4"/></g>` },
    { id: 'rain', name: 'Rainy day', at: 'on a rainy day', svg: `<rect width="400" height="300" fill="#9BA9B8"/>${cloud(80, 40, 1.4, '#6E7D8F')}${cloud(250, 30, 1.6, '#7C8A9B')}${cloud(370, 55, 1.1, '#6E7D8F')}
      <g stroke="#DDE8F3" stroke-width="2" stroke-linecap="round">${[...Array(36)].map((_, i) => { const x = (i * 53) % 400, y = 70 + ((i * 37) % 150); return `<line x1="${x}" y1="${y}" x2="${x - 5}" y2="${y + 14}"/>`; }).join('')}</g>
      <rect y="220" width="400" height="80" fill="#7B9A68"/><ellipse cx="90" cy="262" rx="50" ry="10" fill="#8EB4D6"/><ellipse cx="290" cy="276" rx="64" ry="12" fill="#8EB4D6"/><ellipse cx="290" cy="276" rx="30" ry="5" fill="none" stroke="#C9DDF0" stroke-width="2"/>` },
    { id: 'night', name: 'Night sky', at: 'at night', svg: `<rect width="400" height="300" fill="#1B2559"/>${dots(55, 17, 0, 200, .7, 1.8, '#fff')}<circle cx="320" cy="64" r="32" fill="#FFF1A8"/><circle cx="334" cy="56" r="30" fill="#1B2559"/>
      <path d="M0 210Q100 170 200 205T400 195V300H0z" fill="#22404A"/><path d="M0 250Q150 225 400 255V300H0z" fill="#183038"/>
      <g transform="translate(70 186)"><rect x="0" y="12" width="40" height="30" fill="#3A4C7A"/><path d="M-6 14L20 -6 46 14z" fill="#2B385C"/><rect x="8" y="20" width="10" height="10" fill="#FFE07A"/><rect x="24" y="20" width="10" height="10" fill="#FFE07A"/></g>` },
    { id: 'garden', name: 'Garden', at: 'in the garden', svg: `<rect width="400" height="300" fill="#BDE7FF"/><circle cx="340" cy="50" r="26" fill="#FFD54A"/>${cloud(110, 50, .9)}
      <g fill="#fff" stroke="#E2D2B4" stroke-width="2">${[...Array(14)].map((_, i) => `<path d="M${i * 30 + 2} 200v-56l12-12 12 12v56z"/>`).join('')}</g><rect y="160" width="400" height="8" fill="#fff"/>
      <rect y="196" width="400" height="104" fill="#7CCB5C"/>${[[40, 214], [120, 230], [300, 222], [360, 244], [210, 262]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="5" fill="${['#F2604F', '#FFC23D', '#F49AC1', '#6D55D1', '#fff'][i]}"/><circle cx="${x}" cy="${y}" r="2" fill="#FFC23D"/>`).join('')}` },
    { id: 'desert', name: 'Desert', at: 'in the desert', svg: `<rect width="400" height="300" fill="#FFD9A1"/><circle cx="200" cy="80" r="40" fill="#FFB347"/>
      <path d="M0 170Q60 130 140 165T280 150 400 160V300H0z" fill="#F2B866"/><path d="M0 220Q120 180 240 215T400 205V300H0z" fill="#E9A44F"/>
      <g fill="#4E9E40"><rect x="320" y="150" width="14" height="60" rx="7"/><path d="M320 180h-14v-20" stroke="#4E9E40" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M334 172h12v-16" stroke="#4E9E40" stroke-width="10" fill="none" stroke-linecap="round"/></g>` },
    { id: 'paper', name: 'Plain paper', at: 'on my paper', svg: `<rect width="400" height="300" fill="#FFFDF6"/><g stroke="#E4EEF6" stroke-width="2">${[...Array(9)].map((_, i) => `<line x1="0" y1="${30 + i * 32}" x2="400" y2="${30 + i * 32}"/>`).join('')}</g>` }
  ];
  const bgById = id => BGS.find(b => b.id === id) || BGS[0];
  const bgSVG = (b, cls = '') => `<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">${b.svg}</svg>`;

  // name/plural; a plain name gets an "s".
  const G = (id, ico, name, list) => ({ id, ico, name, items: list.split('|').map(x => { const [e, n] = [x.slice(0, x.indexOf(' ')), x.slice(x.indexOf(' ') + 1)]; const [one, many] = n.split('/'); return { e, one, many: many || one + 's' }; }) });
  const GROUPS = [
    G('animals', '🐶', 'Animals', '🐶 dog|🐱 cat|🐭 mouse/mice|🐹 hamster|🐰 bunny/bunnies|🦊 fox/foxes|🐻 bear|🐼 panda|🐨 koala|🐯 tiger|🦁 lion|🐮 cow|🐷 pig|🐸 frog|🐵 monkey|🐔 hen|🐤 chick|🐦 bird|🦆 duck|🦉 owl|🐧 penguin|🐴 horse|🐑 sheep/sheep|🐐 goat|🐘 elephant|🦒 giraffe|🦓 zebra|🐢 turtle|🐍 snake|🦔 hedgehog|🐿️ squirrel|🦘 kangaroo'),
    G('sea', '🐟', 'Sea', '🐟 fish/fish|🐠 striped fish/striped fish|🐡 puffer fish/puffer fish|🐬 dolphin|🐳 whale|🦈 shark|🐙 octopus/octopuses|🦑 squid/squid|🦀 crab|🦞 lobster|🦐 shrimp/shrimp|🐚 shell|🐊 crocodile|🦭 seal|⚓ anchor'),
    G('people', '👧', 'People', '👶 baby/babies|👧 girl|👦 boy|👩 mom|👨 dad|👵 grandma|👴 grandpa|🧒 kid|👮 police officer|👷 builder|🧑‍🚀 astronaut|🧑‍🍳 chef|🧑‍🚒 firefighter|🧑‍🌾 farmer|💃 dancer|🕺 dancer'),
    G('vehicles', '🚗', 'Things that go', '🚗 car|🚕 taxi/taxis|🚙 jeep|🚌 bus/buses|🚒 fire truck|🚑 ambulance|🚓 police car|🚜 tractor|🏎️ race car|🚚 truck|🚲 bike|🛴 scooter|🚂 train|🚀 rocket|✈️ plane|🚁 helicopter|⛵ sailboat|🚤 speedboat|🛸 flying saucer|🎈 balloon'),
    G('food', '🍎', 'Food', '🍎 apple|🍌 banana|🍇 grapes/grapes|🍓 strawberry/strawberries|🍉 watermelon|🍒 cherries/cherries|🍍 pineapple|🥕 carrot|🌽 corn/corn|🥦 broccoli/broccoli|🍕 pizza|🍔 burger|🌭 hot dog|🍟 fries/fries|🍩 donut|🍪 cookie|🎂 cake|🧁 cupcake|🍦 ice cream/ice creams|🍭 lollipop|🍫 chocolate|🥪 sandwich/sandwiches|🧃 juice box/juice boxes|🍯 honey pot'),
    G('nature', '🌳', 'Nature', '🌳 tree|🌲 pine tree|🌴 palm tree|🌵 cactus/cactuses|🌻 sunflower|🌷 tulip|🌹 rose|🌸 blossom|🍄 mushroom|🍀 clover|🍁 leaf/leaves|🌿 plant|⛰️ mountain|🏠 house|🏡 cottage|⛺ tent|🔥 campfire|🌊 wave|🐝 bee|🐛 caterpillar|🦋 butterfly/butterflies|🐞 ladybug|🐌 snail|🐜 ant'),
    G('sky', '🌈', 'Sky & weather', '☀️ sun|🌙 moon|⭐ star|🌟 shining star|☁️ cloud|🌧️ rain cloud|⛈️ storm cloud|🌈 rainbow|❄️ snowflake|⛄ snowman/snowmen|⚡ lightning bolt|💧 raindrop|🌪️ tornado|☂️ umbrella|🪐 planet|🌍 Earth/Earths|☄️ comet'),
    G('fantasy', '🦄', 'Magic', '🦄 unicorn|🐉 dragon|🧚 fairy/fairies|🧜 mermaid|🧙 wizard|👸 princess/princesses|🤴 prince|🦸 superhero/superheroes|🤖 robot|👻 ghost|👽 alien|👾 monster|🧞 genie|👑 crown|💎 gem|🔮 crystal ball|🏰 castle|🎃 pumpkin|🪄 magic wand'),
    G('toys', '🧸', 'Toys & party', '⚽ soccer ball|🏀 basketball|🎾 tennis ball|🎁 present|🎀 bow|🧸 teddy bear|🎨 paint set|🎸 guitar|🥁 drum|🎺 trumpet|🎪 circus tent|🎠 carousel|🎡 big wheel|🪁 kite|🎉 party popper|🎲 dice/dice|🧩 puzzle piece|🏆 trophy|🎯 target|🪀 yo-yo|🛝 slide'),
    G('shapes', '🔴', 'Shapes', '🔴 red circle|🔵 blue circle|🟢 green circle|🟡 yellow circle|🟠 orange circle|🟣 purple circle|🟥 red square|🟦 blue square|🟩 green square|🟨 yellow square|🔺 triangle|🔷 diamond|❤️ red heart|💛 yellow heart|💚 green heart|💙 blue heart|💜 purple heart|⭐ star')
  ];
  const INFO = {}; GROUPS.forEach(g => g.items.forEach(it => { if (!INFO[it.e]) INFO[it.e] = it; }));

  // Kinds the counting games ask for: one name, many stickers that count as it.
  const K = (one, many, list) => ({ one, many, list });
  const KINDS = {
    fish: K('fish', 'fish', ['🐟', '🐠', '🐡']), tree: K('tree', 'trees', ['🌳', '🌲', '🌴']), flower: K('flower', 'flowers', ['🌻', '🌷', '🌹', '🌸']),
    star: K('star', 'stars', ['⭐', '🌟']), car: K('car', 'cars', ['🚗', '🚕', '🚙', '🏎️', '🚓']), bird: K('bird', 'birds', ['🐦', '🐤', '🦉', '🦆', '🐔', '🐧']),
    cloud: K('cloud', 'clouds', ['☁️', '🌧️', '⛈️']), apple: K('apple', 'apples', ['🍎']), balloon: K('balloon', 'balloons', ['🎈']), cupcake: K('cupcake', 'cupcakes', ['🧁']),
    present: K('present', 'presents', ['🎁']), snowman: K('snowman', 'snowmen', ['⛄']), snowflake: K('snowflake', 'snowflakes', ['❄️']), bug: K('bug', 'bugs', ['🐝', '🐛', '🦋', '🐞', '🐌', '🐜']),
    cat: K('cat', 'cats', ['🐱']), dog: K('dog', 'dogs', ['🐶']), person: K('person', 'people', ['👶', '👧', '👦', '👩', '👨', '👵', '👴', '🧒', '👮', '👷', '🧑‍🚀', '🧑‍🍳', '🧑‍🚒', '🧑‍🌾', '💃', '🕺', '👸', '🤴', '🦸', '🧙', '🧚', '🧜']),
    icecream: K('ice cream', 'ice creams', ['🍦']), crab: K('crab', 'crabs', ['🦀']), rocket: K('rocket', 'rockets', ['🚀']), planet: K('planet', 'planets', ['🪐', '🌍']),
    house: K('house', 'houses', ['🏠', '🏡']), sheep: K('sheep', 'sheep', ['🐑']), cow: K('cow', 'cows', ['🐮']), shell: K('shell', 'shells', ['🐚']), monkey: K('monkey', 'monkeys', ['🐵']), banana: K('banana', 'bananas', ['🍌'])
  };
  const kindOf = e => Object.keys(KINDS).filter(k => KINDS[k].list.includes(e));
  const nm = (k, n) => n === 1 ? KINDS[k].one : KINDS[k].many;

  // Counting games. lv 1 for the youngest; lv 2 joins at age 6+.
  const MATHP = [
    { lv: 1, t: 'Put 5 fish in the sea.', bg: 'sea', tab: 'sea', need: { fish: 5 } },
    { lv: 1, t: 'Put 3 stars in the night sky.', bg: 'night', tab: 'sky', need: { star: 3 } },
    { lv: 1, t: 'Put 4 cars on the street.', bg: 'city', tab: 'vehicles', need: { car: 4 } },
    { lv: 1, t: 'Put 6 flowers in the garden.', bg: 'garden', tab: 'nature', need: { flower: 6 } },
    { lv: 1, t: 'Put 2 cupcakes and 3 balloons at the party.', bg: 'party', tab: 'food', need: { cupcake: 2, balloon: 3 } },
    { lv: 1, t: 'Put 2 crabs and 4 shells on the beach.', bg: 'beach', tab: 'sea', need: { crab: 2, shell: 4 } },
    { lv: 1, t: 'Make 2 groups of 3 trees. Keep each group close together.', bg: 'forest', tab: 'nature', groups: ['tree', 2, 3] },
    { lv: 1, t: 'Put 3 birds in the sky. Then add 1 more! How many birds now?', bg: 'farm', tab: 'animals', need: { bird: 4 } },
    { lv: 1, t: 'Put 3 bugs in the garden. Then 2 more bugs come to play!', bg: 'garden', tab: 'nature', need: { bug: 5 } },
    { lv: 1, t: 'Build 2 snowmen and 3 snowflakes.', bg: 'snow', tab: 'sky', need: { snowman: 2, snowflake: 3 } },
    { lv: 1, t: 'Put 1 rocket and 4 stars in space.', bg: 'space', tab: 'sky', need: { rocket: 1, star: 4 } },
    { lv: 1, t: 'Make a pattern: red circle, blue circle, red circle, blue circle… Use 6 circles in a row.', bg: 'paper', tab: 'shapes', pattern: ['🔴', '🔵'], min: 6 },
    { lv: 1, t: 'Put some dogs and some cats. Put MORE cats than dogs!', bg: 'garden', tab: 'animals', more: ['cat', 'dog'] },
    { lv: 1, t: 'Put 2 people. Give each person 1 ice cream.', bg: 'beach', tab: 'people', need: { person: 2, icecream: 2 } },
    { lv: 1, t: 'Put 3 monkeys in the jungle and 3 bananas, one for each monkey.', bg: 'jungle', tab: 'animals', need: { monkey: 3, banana: 3 } },
    { lv: 1, t: 'Put 4 sheep and 1 cow on the farm.', bg: 'farm', tab: 'animals', need: { sheep: 4, cow: 1 } },
    { lv: 2, t: 'Make 3 groups of 2 apples. How many apples is that?', bg: 'paper', tab: 'food', groups: ['apple', 3, 2] },
    { lv: 2, t: 'Make a pattern: yellow, green, green, yellow, green, green… Use 6 circles in a row.', bg: 'paper', tab: 'shapes', pattern: ['🟡', '🟢', '🟢'], min: 6 },
    { lv: 2, t: 'Put 10 fish in the sea. Try 2 groups of 5!', bg: 'sea', tab: 'sea', need: { fish: 10 } },
    { lv: 2, t: 'Put 8 balloons at the party.', bg: 'party', tab: 'vehicles', need: { balloon: 8 } },
    { lv: 2, t: 'Put 2 houses. Give each house 2 trees.', bg: 'farm', tab: 'nature', need: { house: 2, tree: 4 } },
    { lv: 2, t: 'Put 3 planets and double that many stars.', bg: 'space', tab: 'sky', need: { planet: 3, star: 6 } },
    { lv: 2, t: 'Make 2 groups of 4 presents for the party.', bg: 'party', tab: 'toys', groups: ['present', 2, 4] }
  ];
  const IDEAS = [
    ['Put 3 animals at a picnic.', 'garden'], ['A rocket lands on the farm!', 'farm'], ['A dragon goes to the beach.', 'beach'], ['A birthday party for a dinosaur… or a dragon!', 'party'],
    ['The fish are having a race under the sea.', 'sea'], ['A snowman makes a new friend.', 'snow'], ['An alien visits the city.', 'city'], ['A princess and a robot have a tea party.', 'castle'],
    ['Who is hiding in the jungle?', 'jungle'], ['The animals are scared of the storm. Who helps them?', 'rain'], ['A bedtime story: who is still awake at night?', 'night'], ['A unicorn gets lost in the forest.', 'forest'],
    ['Make a zoo! Which animals live there?', 'garden'], ['A traffic jam! Who is stuck?', 'city'], ['A camping trip in the forest.', 'forest'], ['Astronauts find a new planet.', 'space'],
    ['A monster bakes a cake.', 'party'], ['The penguins go on holiday to the desert!', 'desert'], ['A treasure hunt at the beach.', 'beach'], ['The farm animals put on a show.', 'farm'],
    ['A pirate ship sails past the castle.', 'castle'], ['A puddle jumping party in the rain.', 'rain'], ['A shark who is scared of fish.', 'sea'], ['What do toys do when nobody is looking?', 'paper'],
    ['A superhero saves the kitten.', 'city'], ['A camel and a cactus become friends.', 'desert'], ['Fairies dance under the moon.', 'night'], ['A bus full of animals goes to the snow.', 'snow']
  ];

  const MAX = 60;
  let S, sel = null, mode = 'move', tab = 'bg', prompt = null, solved = false, undo = [], crayon = { c: '#F2604F', z: 4, er: false }, saveT = 0, nextId = 1, clearArm = 0;
  const draftKey = () => 'sceneDraft:' + pid;
  const fresh = () => ({ bg: 'beach', items: [], doodle: null, story: '' });
  const persist = () => { clearTimeout(saveT); saveT = setTimeout(() => store.set(draftKey(), S), 250); };
  const snap = () => { undo.push({ items: JSON.stringify(S.items), doodle: S.doodle, bg: S.bg }); if (undo.length > 30) undo.shift(); };
  const kidName = e => (INFO[e] || { one: 'sticker' }).one;

  function sceneHome() {
    S = Object.assign(fresh(), store.get(draftKey(), null) || {});
    S.items = (S.items || []).filter(x => x && x.e); S.items.forEach(x => { x.id = nextId++; });
    sel = null; mode = 'move'; prompt = null; solved = false; undo = []; tab = S.items.length ? 'animals' : 'bg';
    view.innerHTML = `${crumbs('🏞️ Sticker scenes')}
      <div class="idea ss-idea"><span class="ss-bulb" aria-hidden="true">💡</span><p id="ssIdea">Pick a place, then add stickers to make a picture story!</p>
        <button class="speak" id="ssSpk" aria-label="Read it">🔊</button>
        <div class="ss-idea-btns"><button class="tool" id="ssStory">💡 Story idea</button><button class="tool" id="ssCount">🔢 Counting game</button><button class="tool ss-check" id="ssCheck" hidden>✅ Check</button></div></div>
      <div class="ss-wrap">
        <div class="ss-left">
          <div class="ss-stage" id="ssStage" role="application" aria-label="Your scene. Tap a sticker to pick it, then drag it to move it."><div class="ss-bg" id="ssBg"></div><div class="ss-items" id="ssItems"></div><canvas class="ss-doodle" id="ssDoodle" width="800" height="600"></canvas><div class="ss-nums" id="ssNums"></div><p class="ss-hint" id="ssHint"></p></div>
          <div class="ss-mode" role="group" aria-label="Mode"><button class="tool" data-mode="move" aria-pressed="true">✋ Stickers</button><button class="tool" data-mode="crayon" aria-pressed="false">🖍️ Crayon</button><button class="tool" id="ssUndo">↩️ Undo</button></div>
          <div class="ss-edit" id="ssEdit">
            <button class="ss-eb" data-ed="big"><span>➕</span>Bigger</button><button class="ss-eb" data-ed="small"><span>➖</span>Smaller</button>
            <button class="ss-eb" data-ed="flip"><span>↔️</span>Flip</button><button class="ss-eb" data-ed="turn"><span>🔄</span>Turn</button>
            <button class="ss-eb" data-ed="front"><span>⬆️</span>Front</button><button class="ss-eb" data-ed="copy"><span>📋</span>Copy</button><button class="ss-eb ss-del" data-ed="del"><span>🗑️</span>Delete</button></div>
          <div class="ss-crayon" id="ssCrayon" hidden>
            <div class="tools">${PAINT.map(c => `<button class="sw" style="background:${c};${c === '#FFFFFF' ? 'box-shadow:inset 0 0 0 2px var(--line)' : ''}" data-c="${c}" aria-label="crayon color" aria-pressed="${c === crayon.c}"></button>`).join('')}</div>
            <div class="tools"><button class="tool size" data-z="2" aria-label="thin"><i style="width:6px;height:6px"></i></button><button class="tool size" data-z="4" aria-pressed="true" aria-label="medium"><i style="width:14px;height:14px"></i></button><button class="tool size" data-z="9" aria-label="thick"><i style="width:26px;height:26px"></i></button>
              <button class="tool" id="ssEr" aria-pressed="false">🧽 Eraser</button><button class="tool" id="ssClrD">🧹 Clear crayon</button></div></div>
        </div>
        <div class="ss-tray">
          <div class="ss-tabs" role="tablist"><button class="ss-tab" role="tab" data-tab="bg" aria-label="Places">🖼️</button>${GROUPS.map(g => `<button class="ss-tab" role="tab" data-tab="${g.id}" aria-label="${g.name}">${g.ico}</button>`).join('')}</div>
          <p class="ss-tabname" id="ssTabName"></p>
          <div class="ss-grid" id="ssGrid"></div>
        </div>
      </div>
      <div class="ss-tell" id="ssTell" hidden><label for="ssText"><b>📖 Tell your story</b> <span class="note">A grown-up can type what happens in the picture.</span></label>
        <textarea id="ssText" rows="2" maxlength="220" placeholder="Once upon a time…"></textarea><div class="row"><button class="btn sm" id="ssRead">🔊 Read it back</button><button class="btn sm alt" id="ssTellDone">Done</button></div></div>
      <div class="ss-actions"><button class="btn alt" id="ssTellBtn">📖 Tell my story</button><button class="btn alt" id="ssLook">👀 What's in my picture?</button><button class="btn leaf" id="ssSave">💾 Save</button><button class="btn alt" id="ssNew">🆕 New</button></div>
      <div class="ss-saved" id="ssSaved" hidden><span>🖼️ Saved to My pictures!</span><button class="btn sm" id="ssGal">See My pictures</button></div>`;
    wireBack(artHome);
    const stage = $('#ssStage'), cv = $('#ssDoodle'), ctx = cv.getContext('2d');
    const setU = () => stage.style.setProperty('--u', stage.clientWidth / W + 'px');
    setU(); const ro = new ResizeObserver(setU); ro.observe(stage);
    if (S.doodle) { const im = new Image(); im.onload = () => ctx.drawImage(im, 0, 0, 800, 600); im.src = S.doodle; }

    const hint = t => { $('#ssHint').textContent = t; };
    const renderBg = () => { $('#ssBg').innerHTML = bgSVG(bgById(S.bg)); };
    const elOf = s => view.querySelector(`.ss-st[data-id="${s.id}"]`);
    function place(s, el = elOf(s)) {
      if (!el) return;
      el.style.left = (s.x / W * 100) + '%'; el.style.top = (s.y / H * 100) + '%';
      el.style.setProperty('--s', s.s); el.style.transform = `translate(-50%,-50%) rotate(${s.r}deg) scaleX(${s.f ? -1 : 1})`;
    }
    function renderItems() {
      $('#ssItems').innerHTML = S.items.map(s => `<span class="ss-st${sel === s.id ? ' on' : ''}" data-id="${s.id}" role="img" aria-label="${esc(kidName(s.e))}">${s.e}</span>`).join('');
      S.items.forEach(s => place(s));
      editState();
    }
    function editState() {
      const on = !!sel;
      view.querySelectorAll('[data-ed]').forEach(b => { b.disabled = !on; });
      $('#ssEdit').classList.toggle('off', !on);
      hint(mode === 'crayon' ? '' : S.items.length ? (on ? '' : 'Tap a sticker to change it') : 'Tap a sticker below to add it');
    }
    const cur = () => S.items.find(s => s.id === sel);
    function select(id) { sel = id; view.querySelectorAll('.ss-st').forEach(el => el.classList.toggle('on', +el.dataset.id === id)); editState(); }
    function changed() { persist(); clearNums(); $('#ssSaved').hidden = true; }

    function add(e) {
      if (S.items.length >= MAX) { say('Your picture is full! Delete a sticker to add more.'); return; }
      snap();
      // Try a few spots near the middle and use the one with the most room, so stickers are easy to count.
      let best = null, room = -1;
      for (let i = 0; i < 14; i++) { const x = W / 2 + rnd(-130, 130), y = H / 2 + rnd(-85, 85), d = Math.min(999, ...S.items.map(q => Math.hypot(q.x - x, q.y - y))); if (d > room) { room = d; best = [x, y]; } if (d > 70) break; }
      const s = { id: nextId++, e, x: best[0], y: best[1], s: 52, r: 0, f: false };
      S.items.push(s); sel = s.id; renderItems();
      const el = elOf(s); if (el) el.classList.add('pop');
      tone([520 + rnd(0, 6) * 40]); say(kidName(e)); changed();
    }
    function edit(k) {
      const s = cur(); if (!s) return;
      snap();
      if (k === 'big') s.s = Math.min(170, Math.round(s.s * 1.25));
      else if (k === 'small') s.s = Math.max(20, Math.round(s.s / 1.25));
      else if (k === 'flip') s.f = !s.f;
      else if (k === 'turn') s.r = (s.r + 30) % 360;
      else if (k === 'front') { S.items = S.items.filter(x => x !== s).concat(s); renderItems(); }
      else if (k === 'copy') { if (S.items.length >= MAX) { undo.pop(); return say('Your picture is full!'); } const c = Object.assign({}, s, { id: nextId++, x: clamp(s.x + 34, 20, W - 20), y: clamp(s.y + 10, 20, H - 20) }); S.items.push(c); sel = c.id; renderItems(); tone([660]); changed(); return; }
      else if (k === 'del') { S.items = S.items.filter(x => x !== s); sel = null; renderItems(); tone([300, 220]); changed(); return; }
      place(s); tone([k === 'small' ? 440 : 600]); changed();
    }
    function restore() {
      const u = undo.pop(); if (!u) return say('Nothing to undo.');
      S.items = JSON.parse(u.items); S.bg = u.bg; S.doodle = u.doodle; sel = null;
      ctx.clearRect(0, 0, 800, 600);
      if (S.doodle) { const im = new Image(); im.onload = () => ctx.drawImage(im, 0, 0, 800, 600); im.src = S.doodle; }
      renderBg(); renderItems(); showTab(); changed();
    }

    // Tray: places plus groups of stickers.
    function showTab() {
      view.querySelectorAll('.ss-tab').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === tab));
      const g = GROUPS.find(x => x.id === tab);
      $('#ssTabName').textContent = g ? g.name : 'Places';
      $('#ssGrid').className = 'ss-grid' + (g ? '' : ' ss-bgs');
      $('#ssGrid').innerHTML = g ? g.items.map(it => `<button class="ss-sk" data-e="${it.e}" aria-label="${esc(it.one)}">${it.e}</button>`).join('')
        : BGS.map(b => `<button class="ss-bgb" data-bg="${b.id}" aria-pressed="${b.id === S.bg}">${bgSVG(b)}<span>${b.name}</span></button>`).join('');
      view.querySelectorAll('.ss-sk').forEach(b => b.onclick = () => add(b.dataset.e));
      view.querySelectorAll('.ss-bgb').forEach(b => b.onclick = () => setBg(b.dataset.bg, true));
    }
    function setBg(id, speak) {
      if (S.bg !== id) snap();
      S.bg = id; renderBg(); view.querySelectorAll('.ss-bgb').forEach(x => x.setAttribute('aria-pressed', x.dataset.bg === id));
      if (speak) { tone([500, 700]); say(bgById(id).name + '!'); }
      changed();
    }
    view.querySelectorAll('.ss-tab').forEach(b => b.onclick = () => { tab = b.dataset.tab; showTab(); const g = GROUPS.find(x => x.id === tab); say(g ? g.name : 'Pick a place'); });

    // Moving stickers with a finger or mouse; drawing in crayon mode.
    const pt = e => { const r = stage.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
    let drag = null, drawing = null;
    stage.addEventListener('pointerdown', e => {
      if (e.button > 0) return;
      if (mode === 'crayon') {
        e.preventDefault(); snap(); const [x, y] = pt(e); drawing = { id: e.pointerId, x, y }; stroke(x, y, x, y); try { stage.setPointerCapture(e.pointerId); } catch (x) {} return;
      }
      const el = e.target.closest('.ss-st');
      if (!el) { select(null); return; }
      e.preventDefault();
      const s = S.items.find(x => x.id === +el.dataset.id); if (!s) return;
      select(s.id); const [x, y] = pt(e);
      drag = { id: e.pointerId, s, dx: s.x - x, dy: s.y - y, moved: false, sx: x, sy: y };
      try { stage.setPointerCapture(e.pointerId); } catch (x) {}
    });
    const move = e => {
      if (drawing && e.pointerId === drawing.id) { const [x, y] = pt(e); stroke(drawing.x, drawing.y, x, y); drawing.x = x; drawing.y = y; return; }
      if (!drag || e.pointerId !== drag.id) return;
      const [x, y] = pt(e);
      if (!drag.moved && Math.hypot(x - drag.sx, y - drag.sy) < 3) return;
      if (!drag.moved) { snap(); drag.moved = true; elOf(drag.s) && elOf(drag.s).classList.add('drag'); }
      drag.s.x = clamp(x + drag.dx, 0, W); drag.s.y = clamp(y + drag.dy, 0, H); place(drag.s);
    };
    const up = e => {
      if (drawing && e.pointerId === drawing.id) { drawing = null; try { S.doodle = cv.toDataURL(); } catch (x) {} changed(); return; }
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag; drag = null; const el = elOf(d.s); if (el) el.classList.remove('drag');
      if (d.moved) { tone([480]); changed(); } else say(kidName(d.s.e));
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    canvasCleanup = () => { ro.disconnect(); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); clearTimeout(saveT); store.set(draftKey(), S); };
    function stroke(x1, y1, x2, y2) {
      ctx.globalCompositeOperation = crayon.er ? 'destination-out' : 'source-over';
      ctx.strokeStyle = crayon.c; ctx.lineWidth = (crayon.er ? crayon.z * 3 : crayon.z) * 2; ctx.lineCap = ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(x1 * 2, y1 * 2); ctx.lineTo(x2 * 2 + 0.01, y2 * 2); ctx.stroke(); ctx.globalCompositeOperation = 'source-over';
    }
    function setMode(m) {
      mode = m; stage.classList.toggle('drawing', m === 'crayon');
      view.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === m));
      $('#ssEdit').hidden = m === 'crayon'; $('#ssCrayon').hidden = m !== 'crayon';
      if (m === 'crayon') { select(null); say('Crayon time! Draw on your picture.'); }
      editState();
    }
    view.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => setMode(b.dataset.mode));
    view.querySelectorAll('#ssCrayon .sw').forEach(b => b.onclick = () => { crayon.c = b.dataset.c; crayon.er = false; $('#ssEr').setAttribute('aria-pressed', 'false'); view.querySelectorAll('#ssCrayon .sw').forEach(x => x.setAttribute('aria-pressed', x === b)); });
    view.querySelectorAll('#ssCrayon [data-z]').forEach(b => b.onclick = () => { crayon.z = +b.dataset.z; view.querySelectorAll('#ssCrayon [data-z]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
    $('#ssEr').onclick = e => { crayon.er = !crayon.er; e.currentTarget.setAttribute('aria-pressed', crayon.er); };
    $('#ssClrD').onclick = () => { snap(); ctx.clearRect(0, 0, 800, 600); S.doodle = null; changed(); };
    view.querySelectorAll('[data-ed]').forEach(b => b.onclick = () => edit(b.dataset.ed));
    $('#ssUndo').onclick = restore;

    // Ideas and counting games.
    const showIdea = t => { $('#ssIdea').textContent = t; say(t); };
    $('#ssSpk').onclick = () => say($('#ssIdea').textContent);
    $('#ssStory').onclick = () => {
      const [t, bg] = pick(IDEAS.filter(i => i[0] !== $('#ssIdea').textContent));
      prompt = null; $('#ssCheck').hidden = true; clearNums();
      if (!S.items.length && bg) setBg(bg, false);
      showIdea(t);
    };
    function newCount() {
      const lv = st.age >= 6 ? 2 : 1, pool = MATHP.filter(p => p.lv <= lv && p !== prompt);
      prompt = pick(pool); solved = false; clearNums();
      if (!S.items.length && prompt.bg) setBg(prompt.bg, false);
      tab = prompt.tab || tab; showTab();
      $('#ssCheck').hidden = false; showIdea(prompt.t + ' Then tap Check!');
    }
    $('#ssCount').onclick = newCount;

    function clearNums() { const n = $('#ssNums'); if (n) n.innerHTML = ''; clearTimeout(clearNums.t); }
    // Number the counted stickers one by one, like counting with a finger.
    function countUp(list, done) {
      clearNums(); const box = $('#ssNums'); let i = 0;
      const step = () => {
        if (i >= list.length) { clearNums.t = setTimeout(done, 250); return; }
        const s = list[i++]; const b = document.createElement('b'); b.textContent = i;
        b.style.left = (s.x / W * 100) + '%'; b.style.top = ((s.y - s.s * 0.55) / H * 100) + '%'; box.appendChild(b); tone([400 + i * 40], 0.08);
        clearNums.t = setTimeout(step, list.length > 8 ? 220 : 330);
      };
      step();
    }
    const ofKind = k => S.items.filter(s => KINDS[k].list.includes(s.e));
    function judge(p) {
      if (p.need) {
        const ks = Object.keys(p.need), counted = [].concat(...ks.map(ofKind));
        const parts = ks.map(k => { const have = ofKind(k).length, want = p.need[k];
          return { k, have, want, msg: have === want ? '' : have < want ? `You have ${have} ${nm(k, have)}. We need ${want}. Add ${want - have} more!` : `You have ${have} ${nm(k, have)}. We need ${want}. Take away ${have - want}!` }; });
        const bad = parts.find(x => x.msg);
        return { ok: !bad, counted, msg: bad ? bad.msg : `Yes! ${parts.map(x => `${x.want} ${nm(x.k, x.want)}`).join(' and ')}. You did it!` };
      }
      if (p.groups) {
        const [k, g, n] = p.groups, list = ofKind(k), want = g * n;
        if (list.length !== want) return { ok: false, counted: list, msg: `You have ${list.length} ${nm(k, list.length)}. ${g} groups of ${n} makes ${want}. ${list.length < want ? `Add ${want - list.length} more!` : `Take away ${list.length - want}!`}` };
        const cl = clusters(list, 78), sizes = cl.map(c => c.length);
        if (cl.length === g && sizes.every(z => z === n)) return { ok: true, counted: [].concat(...cl), msg: `Yes! ${g} groups of ${n} ${nm(k, 2)}. That makes ${want}! You did it!` };
        return { ok: false, counted: [], msg: `You have ${want} ${nm(k, want)}! Now drag them into ${g} groups of ${n}. Put each group close together, with space in between.` };
      }
      if (p.pattern) {
        const seq = S.items.filter(s => p.pattern.includes(s.e)).sort((a, b) => a.x - b.x), es = seq.map(s => s.e);
        if (es.length < p.min) return { ok: false, counted: seq, msg: `You have ${es.length} circles. Use ${p.min} circles in a row. Add ${p.min - es.length} more!` };
        const ph = p.pattern.findIndex((_, i) => es.every((e, j) => e === p.pattern[(i + j) % p.pattern.length]));
        return ph < 0 ? { ok: false, counted: [], msg: 'Look again at the colors from left to right. Can you fix the pattern?' } : { ok: true, counted: seq, msg: 'Yes! What a beautiful pattern! It repeats again and again.' };
      }
      if (p.more) {
        const [a, b] = p.more, A = ofKind(a), B = ofKind(b);
        if (!A.length || !B.length) return { ok: false, counted: A.concat(B), msg: `Put some ${nm(a, 2)} and some ${nm(b, 2)} first!` };
        return A.length > B.length ? { ok: true, counted: A.concat(B), msg: `Yes! ${A.length} ${nm(a, A.length)} and ${B.length} ${nm(b, B.length)}. ${A.length} is more than ${B.length}!` }
          : { ok: false, counted: A.concat(B), msg: `${A.length} ${nm(a, A.length)} and ${B.length} ${nm(b, B.length)}. We need MORE ${nm(a, 2)} than ${nm(b, 2)}. Add some ${nm(a, 2)}!` };
      }
      return { ok: false, counted: [], msg: '' };
    }
    // Stickers close to each other (chains of near neighbours) form one group.
    function clusters(list, d) {
      const left = list.slice(), out = [];
      while (left.length) { const g = [left.shift()]; for (let i = 0; i < g.length; i++) for (let j = left.length - 1; j >= 0; j--) if (Math.hypot(g[i].x - left[j].x, g[i].y - left[j].y) < d) g.push(left.splice(j, 1)[0]); out.push(g); }
      return out;
    }
    $('#ssCheck').onclick = () => {
      if (!prompt) return;
      select(null); const r = judge(prompt);
      countUp(r.counted, () => {
        if (r.ok) {
          yay(); confetti(30); say(r.msg); $('#ssIdea').textContent = '🎉 ' + r.msg;
          if (!solved) { solved = true; addStars(1); }
          $('#ssCheck').hidden = true;
          setTimeout(() => { if ($('#ssCount')) $('#ssCount').textContent = '🔢 Next game'; }, 50);
        } else { oops(); say(r.msg); $('#ssIdea').textContent = r.msg; }
      });
    };

    // Tell the story, and describe the picture in words.
    $('#ssText').value = S.story || '';
    $('#ssText').oninput = () => { S.story = $('#ssText').value; changed(); };
    $('#ssTellBtn').onclick = () => { const t = $('#ssTell'); t.hidden = !t.hidden; if (!t.hidden) { $('#ssText').focus(); say('Tell me your story! A grown-up can type it.'); } };
    $('#ssTellDone').onclick = () => { $('#ssTell').hidden = true; };
    $('#ssRead').onclick = () => { const t = ($('#ssText').value || '').trim(); say(t || describe()); };
    $('#ssLook').onclick = () => { const t = describe(); showIdea(t); };
    function describe() {
      if (!S.items.length) return `Your picture is ${bgById(S.bg).at}. Add some stickers!`;
      const m = new Map(); S.items.forEach(s => { const n = kidName(s.e); m.set(n, (m.get(n) || 0) + 1); });
      const parts = [...m].map(([n, c]) => { const it = Object.values(INFO).find(x => x.one === n) || { one: n, many: n + 's' }; return c === 1 ? (/^[aeiou]/i.test(n) ? 'an ' : 'a ') + n : `${c} ${it.many}`; });
      const list = parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts[0];
      return `In my picture ${bgById(S.bg).at}, there ${/^(a|an) /.test(parts[0]) && parts.length === 1 ? 'is' : 'are'} ${list}. That is ${S.items.length} sticker${S.items.length > 1 ? 's' : ''}!`;
    }

    // Save: paint the place, stickers and crayon onto a canvas, like the other pictures.
    $('#ssSave').onclick = async () => {
      if (!S.items.length && !S.doodle) return say('Add some stickers first!');
      const b = $('#ssSave'); b.disabled = true; select(null);
      try {
        const url = await render(S, cv);
        gallery.unshift(url); gallery = gallery.slice(0, 30); saveGallery();
        questTick('art'); dayLog('art');
        const first = st.sceneDay !== today(); st.sceneDay = today(); save();
        if (first) addStars(2);
        confetti(25); yay(); say(first ? 'Saved to your pictures! You earned 2 stars!' : 'Saved to your pictures!');
        $('#ssSaved').hidden = false;
      } catch (x) { say('Oops, that did not save. Try again.'); }
      if (b.isConnected) b.disabled = false;
    };
    $('#ssGal').onclick = () => go(galTab);
    $('#ssNew').onclick = e => {
      if (!S.items.length && !S.doodle) return;
      if (Date.now() - clearArm > 3000) { clearArm = Date.now(); e.currentTarget.textContent = '🆕 Tap again'; say('Tap again to start a new picture.'); setTimeout(() => { if ($('#ssNew')) $('#ssNew').textContent = '🆕 New'; }, 3000); return; }
      clearArm = 0; snap(); S.items = []; S.doodle = null; S.story = ''; $('#ssText').value = ''; ctx.clearRect(0, 0, 800, 600); sel = null;
      $('#ssNew').textContent = '🆕 New'; tab = 'bg'; renderItems(); showTab(); changed(); say('A fresh page! Pick a place.');
    };

    renderBg(); renderItems(); showTab(); setMode('move');
    sayScreen(S.items.length ? 'Welcome back to your sticker scene!' : 'Sticker scenes! Pick a place, then tap stickers to add them. Drag them to move them.');
    if (location.hash === '#selftest') window.__scenes = { BGS, GROUPS, MATHP, IDEAS, KINDS, get S() { return S; }, get sel() { return sel; }, get prompt() { return prompt; }, setPrompt: i => { prompt = MATHP[i]; solved = false; $('#ssCheck').hidden = false; showIdea(prompt.t); }, judge: () => judge(prompt), describe, galleryCount: () => gallery.length, add };
  }

  const loadImg = src => new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = src; setTimeout(() => no(new Error('timeout')), 4000); });
  async function render(sc, doodle) {
    const w = 360, h = 270, k = w / W, story = (sc.story || '').trim();
    const t = document.createElement('canvas'), c = t.getContext('2d');
    c.font = '800 15px Nunito, ui-rounded, system-ui, sans-serif';
    const lines = []; if (story) { let line = ''; story.split(/\s+/).forEach(wd => { const tr = line ? line + ' ' + wd : wd; if (c.measureText(tr).width > w - 24 && line) { lines.push(line); line = wd; } else line = tr; }); if (line) lines.push(line); }
    const cap = lines.length ? 14 + lines.slice(0, 4).length * 19 : 0;
    t.width = w; t.height = h + cap;
    c.fillStyle = '#fff'; c.fillRect(0, 0, t.width, t.height);
    const svg = bgSVG(bgById(sc.bg)).replace('<svg class=""', `<svg width="${w * 2}" height="${h * 2}"`);
    try { c.drawImage(await loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)), 0, 0, w, h); } catch (x) { c.fillStyle = '#BDE7FF'; c.fillRect(0, 0, w, h); }
    c.textAlign = 'center'; c.textBaseline = 'middle';
    sc.items.forEach(s => {
      c.save(); c.translate(s.x * k, s.y * k); c.rotate(s.r * Math.PI / 180); c.scale(s.f ? -1 : 1, 1);
      c.font = `${(s.s * k).toFixed(1)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; c.fillText(s.e, 0, s.s * k * 0.06); c.restore();
    });
    if (sc.doodle && doodle) c.drawImage(doodle, 0, 0, w, h);
    if (cap) {
      c.fillStyle = '#FFF6DE'; c.fillRect(0, h, w, cap); c.fillStyle = '#22305A'; c.font = '800 15px Nunito, ui-rounded, system-ui, sans-serif'; c.textAlign = 'left'; c.textBaseline = 'top';
      lines.slice(0, 4).forEach((l, i) => c.fillText(i === 3 && lines.length > 4 ? l + '…' : l, 12, h + 8 + i * 19));
    }
    return t.toDataURL('image/jpeg', 0.75);
  }
  return sceneHome;
})();
