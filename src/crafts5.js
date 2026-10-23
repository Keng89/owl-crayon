/* ---------- Crafts corner, part 5 (round 3): 43 more crafts, most of them easy ---------- */
// No-bake kitchen crafts with a grown-up, music makers, toys and games, pop-up cards, jumping origami, shadow puppets and
// a theatre, loom weaving, rock pets, story stones, a nature mandala, a dream catcher, a kite, a paper mache bowl and a
// cardboard castle. Same step format as crafts2.js. The new movie kinds (slice, spread, inflate, layer, peel, popup,
// spring, shadow, loom, fish, music, ring, rise) are drawn by crafts6.js. Crafts that need a shape have a printable
// template (crafts6.js, by craft id).
craftsHome.CATS.push(
  { id: 'kitchen', ico: '🍓', name: 'No-bake kitchen crafts', c: '#B4462B' },
  { id: 'music', ico: '🥁', name: 'Music makers', c: '#7D3C98' },
  { id: 'toys', ico: '🎲', name: 'Toys & games', c: '#1F6FA8' }
);
craftsHome.later.push(/*lazy{*/() => {
  const K = craftsHome.kit, C = K.C, OL = K.OL;
  const S = (t, a, o = {}) => ({ t, a, ...o });
  const mid = svg => K.g(svg, -100, -75);
  const done = s => K.still(s);
  const M = {
    paper: ['📄', 'paper'], sq: ['🟦', 'square paper'], color: ['🌈', 'colored paper'], scissors: ['✂️', 'child scissors'], glue: ['🧴', 'glue stick'], pva: ['🧴', 'white glue (PVA)'],
    tape: ['🩹', 'sticky tape'], crayons: ['🖍️', 'crayons'], pens: ['🖊️', 'felt pens'], pencil: ['✏️', 'pencil'], paint: ['🎨', 'paint'], brush: ['🖌️', 'paintbrush'],
    plate: ['🍽️', 'paper plate'], roll: ['🧻', 'toilet roll tube'], wool: ['🧶', 'wool or string'], card: ['🟨', 'thin card'], punch: ['🕳️', 'hole punch'], felt: ['🟥', 'felt'],
    eyes: ['👀', 'googly eyes (or draw them)'], ruler: ['📏', 'a ruler'], sticks: ['🪵', 'craft sticks'], ribbon: ['🎀', 'ribbon'], tissue: ['🎐', 'tissue paper'],
    knife: ['🔪', 'a knife (a grown-up cuts)'], board: ['🟫', 'a chopping board'], tpl: ['🖨️', 'the printed template (or draw it)'], news: ['📰', 'newspaper']
  };
  const FOOD = 'Wash hands first. Check for food allergies. A grown-up does all the cutting, and little ones eat sitting down.';
  const circlePts = (cx, cy, r, n = 20) => K.arc(cx, cy, r, r, 0, 360, n);
  const ring = (cx, cy, r, n, a0 = -90) => Array.from({ length: n }, (_, i) => { const a = (a0 + i * 360 / n) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a), a * 180 / Math.PI]; });
  const tapeP = (x, y, w = 24, h = 8, r = 0) => K.g(K.rect(-w / 2, -h / 2, w, h, 'rgba(142,197,245,.85)', 1), x, y, 1, r);
  const sheet = (c = '#fff') => K.sheet(20, 15, 160, 115, c);
  const plate = (cx = 100, cy = 78, r = 54) => K.plate(cx, cy, r);
  // food pieces
  const grape = (x, y, c = C.purple, r = 7) => K.circ(x, y, r, c) + K.circ(x - r * 0.35, y - r * 0.35, r * 0.25, 'rgba(255,255,255,.6)', 0);
  const strawb = (x, y, s = 1) => K.g(K.path('M-10,-6 Q0,20 10,-6 Q0,-12 -10,-6Z', C.red) + [[-4, -1], [3, 0], [0, 6], [-2, -5]].map(([a, b]) => K.circ(a, b, 0.9, C.yellow, 0)).join('') + K.poly([[-8, -8], [0, -12], [8, -8], [0, -5]], C.green, 1), x, y, s);
  const banSmile = (x, y, w = 32) => K.path(`M${x - w},${y - 6} Q${x},${y + 22} ${x + w},${y - 6} Q${x},${y + 8} ${x - w},${y - 6}Z`, C.yellow);
  const apple = (x, y, rot = 0) => K.g(K.path('M-15,0 A15,15 0 0 1 15,0 Z', '#FFF3D6') + K.path('M-15,0 A15,15 0 0 1 15,0', 'none', 0, `stroke="${C.red}" stroke-width="3"`) + K.circ(-3, -6, 1, OL, 0) + K.circ(3, -6, 1, OL, 0), x, y, 1, rot);
  const cube = (x, y, c, s = 9) => K.rect(x - s, y - s, s * 2, s * 2, c, 3);
  const stone = (x, y, c = C.grey, rx = 16, ry = 11) => K.rock(x, y, rx, ry, c);

  /* ================= no-bake kitchen crafts ================= */
  const fruitface = (() => {
    const pl = plate(), eyes = grape(82, 62) + grape(118, 62), nose = strawb(100, 80), smile = banSmile(100, 98);
    const hair = [[-40, -14], [-20, -26], [0, -30], [20, -26], [40, -14]].map(([dx, dy], i) => apple(100 + dx, 50 + dy, (i - 2) * 22)).join('');
    const ban = K.rect(46, 66, 64, 26, C.yellow, 13), banR = K.rect(112, 66, 30, 26, C.yellow, 10) + K.circ(127, 79, 6, '#FFF3D6', 1);
    return { id: 'fruitface', cat: 'kitchen', name: 'Fruit face snack', ico: '🍓', lv: 1, min: 10, mat: [M.plate, ['🍇', 'grapes'], ['🍓', 'a strawberry'], ['🍌', 'a banana'], ['🍎', 'an apple'], M.knife], safe: FOOD + ' Cut grapes in half for under-fives.', tip: 'Let your child choose where each piece goes. Silly faces taste the best!', steps: [
      S('A grown-up cuts the fruit into slices.', 'slice', { base: K.rect(30, 100, 140, 26, C.tan, 4), keep: ban, piece: banR, pts: [[111, 58], [111, 100]], off: [18, 0] }),
      S('Put two grape eyes on the plate.', 'place', { base: pl, pieces: [{ svg: grape(82, 62), at: [82, 62], from: [-40, -60] }, { svg: grape(118, 62), at: [118, 62], from: [40, -60] }] }),
      S('Add a strawberry nose.', 'place', { base: pl + eyes, pieces: [{ svg: nose, at: [100, 80], from: [60, -50], r: 40 }] }),
      S('Make a big banana smile.', 'place', { base: pl + eyes + nose, pieces: [{ svg: smile, at: [100, 98], from: [0, 50] }] }),
      S('Add apple slices for hair.', 'place', { base: pl + eyes + nose + smile, pieces: [{ svg: hair, at: [100, 34], from: [0, -50] }] }),
      S('Say hello to your fruit face, then eat it up!', 'show', { item: mid(pl + hair + eyes + nose + smile), kind: 'bounce' })
    ] };
  })();

  const fruitkebab = (() => {
    const cols = [C.red, C.orange, C.yellow, C.lime, C.purple], melon = K.rect(50, 60, 100, 50, '#F7B267', 6) + K.rect(50, 60, 100, 8, '#8FCB6B', 4);
    const stick = [[16, 76], [184, 76]], full = K.line(stick, C.tan, 3) + cols.concat(cols, cols.slice(0, 2)).map((c, i) => cube(30 + i * 19, 76, c, 8)).join('');
    return { id: 'fruitkebab', cat: 'kitchen', name: 'Rainbow fruit stick', ico: '🍢', lv: 1, min: 10, mat: [['🍉', 'fruit in 5 colors'], ['🥢', 'a blunt wooden skewer or a straw'], M.knife, M.board], safe: FOOD, tip: 'Name each color as it goes on: red, orange, yellow, green, purple. A paper straw works instead of a skewer.', steps: [
      S('A grown-up cuts the fruit into little cubes.', 'slice', { keep: melon, pts: [[100, 52], [100, 116]], piece: '', off: [0, 0] }),
      S('Push the fruit onto the stick: red, orange, yellow, green, purple.', 'thread', { pts: stick, beads: cols, r: 8, tube: true, sc: C.tan }),
      S('Do it again until the stick is full!', 'thread', { pts: stick, beads: cols.concat(cols, cols.slice(0, 2)), r: 8, tube: true, sc: C.tan, pre: 5 }),
      S('A rainbow you can eat. Crunch!', 'show', { item: mid(full), kind: 'wiggle' })
    ] };
  })();

  const cookieface = (() => {
    const bis = K.circ(100, 78, 44, C.tan) + [[80, 60], [118, 66], [96, 100], [124, 92]].map(([x, y]) => K.circ(x, y, 1.6, '#B98A55', 0)).join('');
    const ice = K.circ(100, 78, 38, C.pink, 0), spr = { a: 'sprinkle', box: [66, 44, 68, 68], colors: [C.yellow, C.blue, C.green, '#fff'], n: 40 };
    const face = K.circ(86, 70, 4.5, OL, 0) + K.circ(114, 70, 4.5, OL, 0) + K.path('M84,90 Q100,104 116,90', 'none', 0, `stroke="${C.red}" stroke-width="4" stroke-linecap="round"`);
    return { id: 'cookieface', cat: 'kitchen', name: 'Biscuit faces', ico: '🍪', lv: 1, min: 10, mat: [['🍪', 'plain biscuits'], ['🍥', 'soft icing or cream cheese'], ['🧈', 'a blunt butter knife'], ['✨', 'sprinkles'], ['🍫', 'raisins or chocolate drops']], safe: FOOD, tip: 'Make one for each person in the family, a little gift that looks like them!', steps: [
      S('Spread icing on the biscuit with a blunt knife.', 'spread', { base: bis, area: ice, box: [60, 38, 80, 80] }),
      S('Shake on some sprinkles.', 'sprinkle', { base: bis + ice, ...spr }),
      S('Add raisin eyes and a smile.', 'place', { base: bis + ice + done(spr), pieces: [{ svg: face, at: [100, 80], from: [0, -60] }] }),
      S('A happy biscuit! Who will you give it to?', 'show', { item: mid(bis + ice + done(spr) + face), kind: 'bounce' })
    ] };
  })();

  const yogurtpaint = (() => {
    const cupX = [52, 84, 116, 148], cols = [C.red, C.yellow, C.blue, C.green];
    const cups = cupX.map(x => K.path(`M${x - 13},84 L${x + 13},84 L${x + 10},112 L${x - 10},112Z`, '#fff')).join('');
    const filled = cupX.map((x, i) => K.ell(x, 88, 12, 3.5, i < 0 ? cols[i] : '#FFFDF7', 1)).join('');
    const colored = cupX.map((x, i) => K.ell(x, 88, 12, 3.5, cols[i], 1)).join('');
    const pl = plate(100, 78, 56), pic = [{ p: K.arc(100, 60, 20, 20, 0, 360, 18), c: C.yellow }, { p: [[60, 110], [80, 90], [100, 110], [120, 90], [140, 110]], c: C.blue }, { p: [[78, 40], [70, 30]], c: C.red }, { p: [[122, 40], [130, 30]], c: C.red }];
    return { id: 'yogurtpaint', cat: 'kitchen', name: 'Yogurt paint', ico: '🥛', lv: 1, min: 15, mat: [['🥛', 'plain yogurt'], ['💧', 'food coloring'], ['🥤', '4 little cups'], ['🥄', 'a spoon'], M.brush, M.plate], safe: FOOD + ' This paint is safe to taste, but it is still messy!', tip: 'Great for toddlers who still put everything in their mouths. Paint on a tray for easy cleaning.', steps: [
      S('Spoon some yogurt into each little cup.', 'pour', { base: cups, box: [74, 86, 20, 25], c: '#FFFDF7', lv1: 0.8, cup: [104, 60], cupC: '#fff' }),
      S('Add one drop of food coloring to each cup.', 'dab', { base: cups + filled, pts: cupX.map((x, i) => [x, 88, cols[i]]), shape: 'dot', r: 4, tool: 'dropper' }),
      S('Stir until the color is all smooth.', 'stir', { at: [100, 92], r: 36, c0: '#FFFDF7', c1: C.pink, bowl: '#fff' }),
      S('Paint a picture on a plate with your yogurt paint.', 'draw', { base: pl, s: pic, w: 5, tool: 'brush', guide: false }),
      S('Yum, art you can lick off your fingers!', 'show', { item: mid(pl + pic.map(p => K.line(p.p, p.c, 5)).join('') + K.g(colored, 0, 34, 1)), kind: 'glow' })
    ] };
  })();

  const pastaart = (() => {
    const card = sheet('#FFF6D8'), shell = K.spiral(96, 74, 4, 34, 2.6, 60), body = [[30, 110], [60, 112], [130, 112], [160, 108], [176, 96]];
    const outline = K.line(shell, '#B98A55', 2) + K.line(body, '#B98A55', 2);
    const glue = K.line(shell, '#B9D8F5', 6) + K.line(shell, '#fff', 4);
    const macaroni = (x, y, a) => K.g(K.path('M-6,-2 A6,5 0 0 1 6,-2 L4,2 A4,3 0 0 0 -4,2Z', '#F4C95D', 1.1), x, y, 1, a);
    const items = shell.filter((_, i) => i % 3 === 0).slice(1).map(([x, y], i) => ({ x, y, svg: macaroni(x, y, i * 37) }));
    const bow = body.map(([x, y]) => K.g(K.path('M-6,-4 L0,0 L-6,4Z M6,-4 L0,0 L6,4Z', C.yellow, 1.1), x, y - 2, 1)).join('');
    const placed = items.map(p => p.svg).join('');
    return { id: 'pastaart', cat: 'kitchen', name: 'Pasta snail picture', ico: '🐌', lv: 1, min: 20, mat: [['🍝', 'dried pasta shapes'], M.pva, M.card, M.crayons], tip: 'Dried pasta only, and count the pieces together as they go on. Paint them afterwards for color.', steps: [
      S('Draw a big snail shell and a long body.', 'draw', { base: card, s: [shell, body], c: '#B98A55', tool: 'crayon' }),
      S('Squeeze glue along the shell line.', 'draw', { base: card + outline, s: [shell], tool: 'glue', w: 4 }),
      S('Press pasta onto the glue, one by one, round and round.', 'ring', { base: card + outline + glue, items }),
      S('Add bow pasta along the body and draw a happy face.', 'place', { base: card + outline + placed, pieces: [{ svg: bow + K.eye(166, 88, 4), at: [110, 104], from: [0, 40] }] }),
      S('A crunchy snail picture! How many pastas did you use?', 'show', { item: mid(card + outline + placed + bow + K.eye(166, 88, 4)), kind: 'glow' })
    ] };
  })();

  const snackcar = (() => {
    const appleW = K.circ(100, 76, 40, C.red) + K.path('M100,36 Q104,28 108,26', 'none', 2.4) + K.leaf(114, 32, 7, C.green, -20);
    const body = K.path('M56,90 A44,30 0 0 1 144,90 Z', '#FFF3D6') + K.path('M56,90 A44,30 0 0 1 144,90', 'none', 0, `stroke="${C.red}" stroke-width="5"`);
    const axles = K.line([[64, 96], [64, 104]], C.tan, 3) + K.line([[136, 96], [136, 104]], C.tan, 3);
    const wheels = grape(64, 106, C.green, 10) + grape(136, 106, C.green, 10), flag = K.line([[100, 62], [100, 40]], C.tan, 2) + K.poly([[100, 40], [118, 46], [100, 52]], C.yellow);
    const car = body + axles + wheels + flag;
    return { id: 'snackcar', cat: 'kitchen', name: 'Apple race car', ico: '🍏', lv: 2, min: 15, mat: [['🍎', 'an apple'], ['🍇', 'grapes'], ['🧀', 'a cheese slice'], ['🥢', 'cocktail sticks (toothpicks)'], M.knife], safe: FOOD + ' Take the sticks out before eating.', steps: [
      S('A grown-up cuts a thick slice from the side of the apple.', 'slice', { keep: appleW, pts: [[60, 92], [140, 92]], piece: '', off: [0, 0] }),
      S('Push two sticks through the apple slice, front and back.', 'place', { base: body, pieces: [{ svg: axles, at: [100, 100], from: [0, 40] }] }),
      S('Push a grape wheel on each end.', 'place', { base: body + axles, pieces: [{ svg: grape(64, 106, C.green, 10), at: [64, 106], from: [-40, 20] }, { svg: grape(136, 106, C.green, 10), at: [136, 106], from: [40, 20] }] }),
      S('Add a cheese flag on a stick. Ready, steady...', 'place', { base: body + axles + wheels, pieces: [{ svg: flag, at: [104, 50], from: [0, -50] }] }),
      S('Vroom! Race it, then eat it.', 'show', { item: mid(car), kind: 'drive', s: 0.7 })
    ] };
  })();

  const pizzafaces = (() => {
    const bread = K.circ(100, 78, 44, '#E8C08A') + K.circ(100, 78, 38, '#F2D3A0', 0), sauce = K.circ(100, 78, 36, C.red, 0);
    const chz = { a: 'sprinkle', box: [68, 48, 64, 60], colors: [C.yellow, '#FFE38A'], n: 50 };
    const face = K.circ(86, 68, 5, OL) + K.circ(114, 68, 5, OL) + K.circ(86, 68, 2, '#fff', 0) + K.circ(114, 68, 2, '#fff', 0) + K.path('M80,90 Q100,106 120,90 Q100,98 80,90Z', C.green) + K.circ(100, 80, 4, C.orange);
    const pizza = bread + sauce + done(chz) + face;
    return { id: 'pizzafaces', cat: 'kitchen', name: 'Mini pizza faces', ico: '🍕', lv: 2, min: 25, mat: [['🫓', 'muffin halves or small pitta breads'], ['🍅', 'tomato sauce'], ['🧀', 'grated cheese'], ['🫒', 'olives, pepper and tomato'], ['🔥', 'the oven (a grown-up)']], safe: FOOD, tip: 'Cut the toppings ready in little bowls, then the child does all the building.', steps: [
      S('Spread tomato sauce on the bread with a spoon.', 'spread', { base: bread, area: sauce, box: [60, 38, 80, 80] }),
      S('Sprinkle on lots of cheese.', 'sprinkle', { base: bread + sauce, ...chz }),
      S('Make a face: olive eyes, a pepper smile, a tomato nose.', 'place', { base: bread + sauce + done(chz), pieces: [{ svg: face, at: [100, 80], from: [0, -60] }] }),
      S('A grown-up bakes it for about 10 minutes, until the cheese melts.', 'oven', { item: pizza }),
      S('Let it cool a little. Smiley pizza time!', 'show', { item: mid(pizza), kind: 'bounce' })
    ] };
  })();

  /* ================= music makers ================= */
  const kazoo = (() => {
    const tube = K.rect(48, 62, 104, 30, C.card, 4) + K.ell(48, 77, 6, 15, '#7A5A3A'), colored = K.rect(48, 62, 104, 30, C.sky, 4) + K.line(K.zig(52, 148, 74, 6, 7), C.purple, 2.5) + K.ell(48, 77, 6, 15, '#7A5A3A');
    const wax = K.ell(152, 77, 7, 18, 'rgba(255,255,255,.85)') + K.rect(146, 60, 6, 34, C.red, 2), hole = K.hole(132, 70, 3);
    return { id: 'kazoo', cat: 'music', name: 'Tube kazoo', ico: '🎺', lv: 1, min: 10, mat: [M.roll, ['📃', 'wax paper or baking paper'], ['➰', 'a rubber band'], M.crayons, M.pencil], tip: 'Hum, do not blow! Humming makes the paper buzz. Try humming a song you both know.', steps: [
      S('Color your tube with stripes and zigzags.', 'paint', { base: tube, area: colored, box: [42, 60, 116, 34], tool: 'crayon', c: C.sky }),
      S('Cover one end with wax paper. Hold it on with a rubber band.', 'place', { base: colored, pieces: [{ svg: wax, at: [150, 77], from: [40, 0] }] }),
      S('A grown-up pokes a small hole near the paper with a pencil.', 'punch', { base: colored + wax, holes: [[132, 70]], r: 3 }),
      S('Put your mouth on the open end and hum. Buzz, buzz!', 'music', { base: colored + wax + hole + K.emo('😮', 34, 77, 26), mode: 'blow', at: [150, 70] }),
      S('A buzzy kazoo! Hum your favorite song.', 'show', { item: mid(colored + wax + hole), kind: 'wiggle' })
    ] };
  })();

  const platetamb = (() => {
    const pl = plate(100, 80, 48), deco = [{ p: circlePts(100, 80, 22, 18), c: C.red }, { p: K.zig(64, 136, 112, 6, 6), c: C.blue }, { p: K.zig(64, 136, 50, 6, 6), c: C.green }];
    const decoS = deco.map(d => K.line(d.p, d.c, 3)).join(''), top = K.circ(100, 80, 48, '#fff') + decoS;
    const tapes = [0, 60, 120, 180, 240, 300].map(a => { const r = a * Math.PI / 180; return { svg: tapeP(100 + 48 * Math.cos(r), 80 + 48 * Math.sin(r), 16, 7, a + 90), at: [100 + 48 * Math.cos(r), 80 + 48 * Math.sin(r)], from: [0, -40] }; });
    const rib = [[52, 80, C.red], [148, 80, C.yellow], [100, 128, C.purple]].map(([x, y, c]) => K.line([[x, y], [x + (x < 100 ? -10 : x > 100 ? 10 : 0), y + 20], [x + (x < 100 ? -4 : x > 100 ? 4 : 6), y + 32]], c, 4)).join('');
    const tamb = top + tapes.map(t => t.svg).join('') + rib;
    return { id: 'platetamb', cat: 'music', name: 'Paper plate tambourine', ico: '🪘', lv: 1, min: 15, mat: [['🍽️', '2 paper plates'], ['🫘', 'a handful of dried beans or rice'], M.tape, M.crayons, M.ribbon], tip: 'Shake it fast, then slow, then stop! A great game: freeze when the shaking stops.', steps: [
      S('Draw bright patterns on the back of one plate.', 'draw', { base: pl, s: deco, w: 3, tool: 'crayon', guide: false }),
      S('Pour a handful of beans onto the other plate.', 'pour', { base: pl, box: [70, 70, 60, 20], grain: true, colors: [C.brown, '#E8C9A0', C.red], lv1: 0.7, cup: [130, 40] }),
      S('Put the colored plate on top. Tape all round the edge.', 'place', { base: top, pieces: tapes }),
      S('Tape on some ribbons.', 'place', { base: top + tapes.map(t => t.svg).join(''), pieces: [{ svg: rib, at: [100, 100], from: [0, 40] }] }),
      S('Shake it and tap it! Shake, shake, tap!', 'music', { mode: 'shake', item: K.g(tamb, -100, -80, 0.8), at: [100, 74] }),
      S('Your tambourine is ready for the band!', 'show', { item: mid(tamb), kind: 'shake', s: 0.8 })
    ] };
  })();

  const drumtub = (() => {
    const tub = K.rect(60, 64, 80, 58, '#E7EBEF', 4) + K.ell(100, 64, 40, 10, '#F4F6F8'), wrapP = K.rect(60, 68, 80, 54, C.orange, 2);
    const lid = K.ell(100, 64, 40, 10, C.purple), deco = [{ p: K.zig(64, 136, 84, 6, 6), c: C.yellow }, { p: K.zig(64, 136, 104, 6, 6), c: C.blue }];
    const decoS = deco.map(d => K.line(d.p, d.c, 3)).join(''), sticks = K.g(K.rect(-2, -40, 4, 40, C.tan, 2) + K.circ(0, 0, 5, C.red), 158, 112, 1, 20) + K.g(K.rect(-2, -40, 4, 40, C.tan, 2) + K.circ(0, 0, 5, C.red), 172, 112, 1, 20);
    const drum = tub + wrapP + decoS + lid;
    return { id: 'drumtub', cat: 'music', name: 'Tub drum', ico: '🥁', lv: 1, min: 15, mat: [['🥫', 'an empty tub or tin with a lid'], M.color, M.tape, M.crayons, ['✏️', '2 pencils'], ['🎀', '2 pom-poms']], tip: 'Play "copy my beat": you drum a pattern, your child copies it. Then swap!', steps: [
      S('Wrap colored paper round the tub. Tape it on.', 'place', { base: tub, pieces: [{ svg: wrapP, at: [100, 95], from: [-80, 0] }] }),
      S('Draw zigzags all round.', 'draw', { base: tub + wrapP, s: deco, w: 3, tool: 'crayon', guide: false }),
      S('Put the lid on. Tape a pom-pom on the end of each pencil.', 'place', { base: drum, pieces: [{ svg: sticks, at: [165, 92], from: [20, -60] }] }),
      S('Drum it! Loud, quiet, fast and slow.', 'music', { base: drum, mode: 'drum', hits: [[86, 64], [114, 64]], n: 8 }),
      S('Boom, boom, tap! You are a drummer.', 'show', { item: mid(drum + sticks), kind: 'shake', s: 0.9 })
    ] };
  })();

  const bottlexylo = (() => {
    const xs = [40, 70, 100, 130, 160], lv = [0.85, 0.68, 0.5, 0.34, 0.18], cols = [C.red, C.orange, C.yellow, C.green, C.blue];
    const jar = x => K.rect(x - 12, 64, 24, 60, 'rgba(142,197,245,.25)', 6) + K.rect(x - 8, 58, 16, 8, '#E7EBEF', 2);
    const water = (i, c) => K.rect(xs[i] - 11, 123 - 58 * lv[i], 22, 58 * lv[i], c, 5);
    const jars = xs.map(jar).join(''), clear = xs.map((x, i) => i < 4 ? water(i, 'rgba(142,197,245,.7)') : '').join(''), colored = xs.map((x, i) => water(i, cols[i])).join('');
    return { id: 'bottlexylo', cat: 'music', name: 'Water jar xylophone', ico: '🎶', lv: 2, min: 20, mat: [['🫙', '5 glass jars or bottles, all the same'], ['💧', 'water'], ['🌈', 'food coloring'], ['🥄', 'a metal spoon']], safe: 'Glass can break: tap gently, and a grown-up carries the jars.', tip: 'Science: more water makes a lower note when you tap. Can you play "Twinkle twinkle"?', steps: [
      S('Line up five jars in a row.', 'stack', { pieces: xs.map(x => ({ svg: jar(x), at: [x, 90] })) }),
      S('Pour water in: a lot in the first jar, less in each next one.', 'pour', { base: jars + clear, box: [149, 66, 22, 56], lv1: lv[4], c: 'rgba(142,197,245,.7)', cup: [178, 40] }),
      S('Add a drop of a different color to each jar.', 'dab', { base: jars + clear + water(4, 'rgba(142,197,245,.7)'), pts: xs.map((x, i) => [x, 123 - 58 * lv[i] + 4, cols[i]]), shape: 'dot', r: 5, spread: true, tool: 'dropper' }),
      S('Tap each jar with a spoon. Every jar sings a different note!', 'music', { base: jars + colored, mode: 'tap', pts: xs.map(x => [x, 64]) }),
      S('Ding, dong, ding! Play a tune.', 'show', { item: mid(jars + colored), kind: 'glow' })
    ] };
  })();

  const guitarbox = (() => {
    const box = K.rect(30, 50, 110, 70, C.card, 4), painted = K.rect(30, 50, 110, 70, C.red, 4), holeS = K.ell(85, 85, 20, 20, '#5A3A1A');
    const sx = [70, 80, 90, 100], strings = sx.map(x => K.line([[x, 52], [x, 118]], '#F4F1E8', 2)).join(''), neck = K.rect(140, 74, 50, 22, C.tan, 3) + [150, 162, 174].map(x => K.line([[x, 76], [x, 94]], '#B98A55', 1.4)).join('');
    const strL = sx.map(x => [x, 52, x, 118]), gtr = painted + holeS + neck;
    return { id: 'guitarbox', cat: 'music', name: 'Box guitar', ico: '🎸', lv: 2, min: 30, mat: [['📦', 'a tissue box or a small box with a hole'], ['➰', '4 rubber bands, thin and thick'], ['🧻', 'a kitchen roll tube'], M.tape, M.paint, M.brush], tip: 'Science: thick bands make low notes, thin bands make high notes. Stretch one tighter and listen!', steps: [
      S('Paint the box. Let it dry.', 'paint', { base: box + holeS, area: painted + holeS, box: [30, 50, 110, 70], c: C.red }),
      S('Stretch rubber bands round the box, over the hole.', 'place', { base: gtr, pieces: sx.map((x, i) => ({ svg: K.line([[x, 52], [x, 118]], '#F4F1E8', 2), at: [x, 85], from: [0, -70 - i * 6] })) }),
      S('Tape a tube on the end for the neck.', 'place', { base: painted + holeS + strings, pieces: [{ svg: neck, at: [165, 85], from: [40, 0] }] }),
      S('Pluck the bands one by one, then strum them all!', 'music', { base: gtr, mode: 'strum', strings: strL }),
      S('Rock star! Sing a song with your guitar.', 'show', { item: mid(gtr + strings), kind: 'wiggle' })
    ] };
  })();

  const panflute = (() => {
    const hs = [70, 62, 54, 46, 38, 30], straws = (n = 6) => hs.slice(0, n).map((h, i) => K.rect(64 + i * 12, 40, 10, h, [C.red, C.orange, C.yellow, C.green, C.blue, C.purple][i], 3)).join('');
    const longs = hs.map((_, i) => K.rect(64 + i * 12, 40, 10, 70, [C.red, C.orange, C.yellow, C.green, C.blue, C.purple][i], 3)).join('');
    const tape = K.rect(58, 52, 84, 10, 'rgba(142,197,245,.85)', 2) + K.rect(58, 66, 84, 8, 'rgba(142,197,245,.85)', 2);
    return { id: 'panflute', cat: 'music', name: 'Straw pan flute', ico: '🪈', lv: 3, min: 20, mat: [['🥤', '6 wide paper straws'], M.ruler, M.scissors, M.tape], tip: 'Blow across the top, like on a bottle. Longer straws make lower notes.', steps: [
      S('Measure each straw a little shorter than the one before.', 'measure', { base: longs, from: [64, 116], to: [136, 116], n: 6 }),
      S('Cut the straws to their sizes.', 'cut', { base: longs, cuts: hs.map((h, i) => [[63 + i * 12, 40 + h], [75 + i * 12, 40 + h]]) }),
      S('Line them up, longest to shortest, tops all even.', 'stack', { pieces: hs.map((h, i) => ({ svg: K.rect(64 + i * 12, 40, 10, h, [C.red, C.orange, C.yellow, C.green, C.blue, C.purple][i], 3), at: [69 + i * 12, 60], h: 60 })) }),
      S('Wrap tape across them, front and back.', 'place', { base: straws(), pieces: [{ svg: tape, at: [100, 62], from: [-90, 0] }] }),
      S('Blow gently across the tops. Toot, toot!', 'music', { base: straws() + tape + K.emo('😗', 46, 34, 22), mode: 'blow', at: [70, 36] }),
      S('Your own pan flute! Play high and low notes.', 'show', { item: mid(straws() + tape), kind: 'wiggle' })
    ] };
  })();

  /* ================= toys & games ================= */
  const magnetfish = (() => {
    const card = sheet(), fishPts = [[48, 50], [64, 38], [86, 44], [96, 36], [96, 64], [86, 56], [64, 62], [48, 50]];
    const fishes = [[60, 104, C.orange], [92, 116, C.pink], [124, 106, C.green], [148, 116, C.yellow], [110, 120, C.blue]];
    const cut = K.poly(fishPts, C.orange), clips = fishes.map(([x, y, c]) => K.fishy(x, y, c, 0, 0.8)).join('');
    const pond = K.ell(100, 112, 80, 22, 'rgba(46,139,230,.35)', 1.4);
    return { id: 'magnetfish', cat: 'toys', name: 'Magnet fishing game', ico: '🎣', lv: 2, min: 30, mat: [M.card, M.scissors, M.crayons, ['📎', 'paperclips'], ['🧲', 'a magnet'], ['🪵', 'a stick or a pencil'], M.wool], safe: 'Magnets must never be swallowed. A grown-up ties the magnet on tightly.', tip: 'Write numbers or letters on the fish: "Catch the number 5!" turns it into a learning game.', steps: [
      S('Draw fish on card and cut them out.', 'cut', { base: card, pts: fishPts, piece: '' }),
      S('Color them in bright colors.', 'paint', { base: K.poly(fishPts, '#fff'), area: cut, box: [44, 34, 56, 32], tool: 'crayon', c: C.orange }),
      S('Slide a paperclip onto each fish\'s nose.', 'place', { base: pond, pieces: fishes.map(([x, y, c]) => ({ svg: K.fishy(x, y, c, 0, 0.8), at: [x, y], from: [0, -60] })) }),
      S('Tie string to a stick. Tie the magnet on the end.', 'knot', { at: [100, 60], c: OL }),
      S('Go fishing! The magnet grabs the paperclip.', 'fish', { pond: [100, 112, 80, 22], fish: fishes, pick: 2 }),
      S('How many fish can you catch? Count them!', 'show', { item: mid(pond + clips), kind: 'float' })
    ] };
  })();

  const cupball = (() => {
    const cup = K.path('M78,70 L122,70 L114,120 L86,120Z', C.blue), deco = [{ p: K.wave(84, 116, 86, 3, 3), c: C.yellow }, { p: K.wave(86, 114, 102, 3, 3), c: C.pink }];
    const cupD = cup + deco.map(d => K.line(d.p, d.c, 3)).join(''), ball = K.circ(0, -6, 7, '#C9D3DC') + K.circ(-2, -8, 2, '#fff', 0);
    const str = K.path('M100,70 Q140,40 150,70', 'none', 0, `stroke="${OL}" stroke-width="1.3"`);
    return { id: 'cupball', cat: 'toys', name: 'Cup and ball game', ico: '🥤', lv: 1, min: 10, mat: [['🥤', 'a paper cup'], ['🧶', 'string (as long as your arm)'], ['🥈', 'kitchen foil'], M.tape, M.pens], tip: 'Too hard? Use a shorter string. Too easy? Make it longer!', steps: [
      S('Draw wavy patterns on your cup.', 'draw', { base: cup, s: deco, w: 3, tool: 'pen', guide: false }),
      S('Scrunch some foil into a ball.', 'clay', { mode: 'ball', at: [150, 90], r: 14, c: '#C9D3DC' }),
      S('Tape one end of the string to the ball and one to the cup.', 'place', { base: cupD + K.circ(150, 84, 7, '#C9D3DC'), pieces: [{ svg: str + tapeP(100, 72, 14, 6) + tapeP(150, 78, 10, 6), at: [125, 70], from: [0, -40] }] }),
      S('Swing the ball up and catch it in the cup!', 'spring', { base: cupD, item: ball, at: [150, 120], to: [100, 78], h: 60, press: 0 }),
      S('You caught it! How many in a row?', 'show', { item: mid(cupD + K.circ(100, 72, 7, '#C9D3DC')), kind: 'hop' })
    ] };
  })();

  const stonettt = (() => {
    const pos = [[44, 44], [74, 40], [104, 46], [134, 42], [160, 46], [48, 76], [78, 72], [108, 78], [138, 74], [162, 78]];
    const stones = pos.map(([x, y]) => stone(x, y)).join(''), painted = pos.map(([x, y], i) => stone(x, y, i < 5 ? C.red : C.blue)).join('');
    const marks = pos.map(([x, y], i) => i < 5 ? K.line([[x - 5, y - 5], [x + 5, y + 5]], '#fff', 2.5) + K.line([[x + 5, y - 5], [x - 5, y + 5]], '#fff', 2.5) : K.circ(x, y, 5, 'none', 0, 'stroke="#fff" stroke-width="2.5"')).join('');
    const grid = [[[80, 92], [80, 140]], [[110, 92], [110, 140]], [[52, 108], [138, 108]], [[52, 124], [138, 124]]];
    const gridS = grid.map(p => K.line(p, OL, 2.5)).join(''), mat = K.rect(46, 88, 98, 56, C.cream, 4);
    const play = [[66, 100, 0], [95, 116, 5], [124, 132, 1], [95, 100, 6], [66, 132, 7]].map(([x, y, i]) => ({ x, y, svg: K.g(stone(0, 0, i < 5 ? C.red : C.blue, 10, 7) + (i < 5 ? K.line([[-3, -3], [3, 3]], '#fff', 2) + K.line([[3, -3], [-3, 3]], '#fff', 2) : K.circ(0, 0, 3, 'none', 0, 'stroke="#fff" stroke-width="2"')), x, y) }));
    return { id: 'stonettt', cat: 'toys', name: 'Tic-tac-toe stones', ico: '⭕', lv: 1, min: 20, mat: [['🪨', '10 flat stones'], M.paint, M.brush, ['🟫', 'a square of card or cloth'], M.pens], tip: 'Collect the stones on a walk. A pocket game for cafes and trips!', steps: [
      S('Find ten smooth, flat stones.', 'place', { pieces: pos.map(([x, y], i) => ({ svg: stone(x, y), at: [x, y], from: [i % 2 ? 30 : -30, -80] })) }),
      S('Paint five stones red and five stones blue.', 'dab', { base: stones, pts: pos.map(([x, y], i) => [x, y, i < 5 ? C.red : C.blue]), shape: 'blob', r: 12, tool: 'brush' }),
      S('Paint an X on the red ones and an O on the blue ones.', 'draw', { base: painted, s: pos.slice(0, 5).map(([x, y]) => [[x - 5, y - 5], [x + 5, y + 5]]).concat(pos.slice(5).map(([x, y]) => circlePts(x, y, 5, 10))), c: '#fff', w: 2.5, tool: 'brush', fill: marks }),
      S('Draw a grid: two lines down and two lines across.', 'draw', { base: painted + marks + mat, s: grid, w: 2.5, tool: 'pen' }),
      S('Take turns. Three in a row wins!', 'ring', { base: mat + gridS, items: play }),
      S('Who will win? Play again!', 'show', { item: mid(mat + gridS + play.map(p => p.svg).join('')), kind: 'glow' })
    ] };
  })();

  const bowling = (() => {
    const pin = (x, y, s = 1, face = false) => K.g(K.rect(-9, -34, 18, 34, '#fff', 6) + K.rect(-5, -42, 10, 9, '#E7EBEF', 2) + K.rect(-9, -24, 18, 5, C.red, 0) + (face ? K.circ(-3, -14, 1.5, OL, 0) + K.circ(3, -14, 1.5, OL, 0) + K.smile(0, -10, 3) : ''), x, y, s);
    const one = K.g(K.rect(-14, -50, 28, 50, 'rgba(255,255,255,.7)', 8) + K.rect(-7, -62, 14, 13, '#E7EBEF', 2), 100, 124);
    const tri = [[100, 96], [86, 108], [114, 108], [72, 122], [100, 122], [128, 122]];
    const pins = tri.map(([x, y]) => pin(x, y, 0.75, true)).join(''), ball = K.circ(0, -8, 9, C.purple) + K.circ(-3, -11, 2, '#fff', 0);
    return { id: 'bowling', cat: 'toys', name: 'Bottle bowling', ico: '🎳', lv: 1, min: 20, mat: [['🧴', '6 empty plastic bottles'], ['🏖️', 'a little sand or water'], M.paint, M.pens, ['⚽', 'a soft ball']], tip: 'Count how many fall down, and how many are still standing. 6 take away 4 is 2!', steps: [
      S('Pour a little sand into each bottle so it stands up well.', 'pour', { base: one, box: [87, 76, 26, 46], grain: true, colors: ['#E8C9A0', '#D9B98A'], lv1: 0.25, cup: [130, 40] }),
      S('Paint a red stripe and draw a face on each one.', 'draw', { base: K.g(K.rect(-14, -50, 28, 50, '#fff', 8) + K.rect(-7, -62, 14, 13, '#E7EBEF', 2), 100, 124), s: [[[86, 96], [114, 96]], circlePts(94, 106, 2, 6), circlePts(106, 106, 2, 6), K.arc(100, 112, 6, 4, 20, 160, 8)], c: C.red, w: 4, tool: 'brush' }),
      S('Stand them in a triangle: 1, then 2, then 3.', 'stack', { pieces: tri.map(([x, y]) => ({ svg: pin(x, y, 0.75, true), at: [x, y - 20] })) }),
      S('Roll the ball. Bang! How many fall down?', 'spring', { base: pins, item: ball, at: [20, 124], to: [96, 124], h: 4, press: 0 }),
      S('Strike! Stand them up and play again.', 'show', { item: mid(pins), kind: 'shake', s: 0.9 })
    ] };
  })();

  const spinner = (() => {
    const disc = K.circ(100, 75, 40, '#fff'), sp = K.spiral(100, 75, 2, 36, 3, 60), drawn = disc + K.line(sp, C.purple, 4);
    const holes = [[94, 75], [106, 75]], hs = holes.map(([x, y]) => K.hole(x, y, 2.4)).join(''), str = K.line([[20, 75], [94, 75]], C.red, 1.6) + K.line([[106, 75], [180, 75]], C.red, 1.6);
    return { id: 'spinner', cat: 'toys', name: 'Whirligig spinner', ico: '🌀', lv: 3, min: 20, mat: [M.card, M.scissors, M.pens, ['🪡', 'a needle or skewer (a grown-up pokes)'], ['🧵', 'strong string (1 meter)']], tip: 'Wind it up with 20 little circles first, then pull and let the string go slack, pull and slack. It hums!', steps: [
      S('Draw round a cup on card and cut out the circle.', 'cut', { base: sheet(), pts: circlePts(100, 75, 40, 24) }),
      S('Draw a big spiral on it.', 'draw', { base: disc, s: [sp], c: C.purple, w: 4, tool: 'pen' }),
      S('A grown-up pokes two holes near the middle.', 'punch', { base: drawn, holes, r: 2.4 }),
      S('Thread the string through both holes and tie the ends.', 'knot', { base: drawn + hs + str, at: [100, 112], c: C.red }),
      S('Wind it up, then pull and relax, pull and relax. It whirrs!', 'show', { item: mid(drawn + hs), kind: 'spin', speed: 2.5, base: str })
    ] };
  })();

  /* ================= jumping origami ================= */
  const hopfrog = (() => {
    const B = K.ori(C.green, '#7CC79A', [[70, 10], [130, 10], [130, 140], [70, 140]]);
    const s1 = S('Fold the top corners across to make an X crease. Open it.', 'draw', { base: B.svg(), s: [[[70, 10], [130, 70]], [[130, 10], [70, 70]]], c: C.purple, dash: '5 4', tool: 'finger' });
    const s2 = B.morph('Push the sides in so the top folds down into a triangle.', [{ p: [[70, 40], [130, 40], [130, 140], [70, 140]], f: 0 }, { p: [[70, 40], [130, 40], [100, 10]], f: 1 }]);
    const s3 = B.fold('Fold the long sides in to meet in the middle.', { from: [70, 100], to: [100, 100] }, { from: [130, 100], to: [100, 100] });
    const s4 = B.fold('Fold the bottom up to the triangle.', { from: [100, 140], to: [100, 44] });
    const s5 = B.fold('Fold that part in half, back down. That is the spring!', { from: [100, 44], to: [100, 92], top: true });
    const frog = K.g(B.svg() + K.eye(90, 26, 4) + K.eye(110, 26, 4), -100, -92);
    return { id: 'hopfrog', cat: 'fold', name: 'Hopping card frog', ico: '🐸', lv: 2, min: 15, mat: [['🟩', 'a stiff card rectangle (an index card)'], M.pens], tip: 'Stiff card jumps best. Have a frog race: whose frog jumps the furthest?', steps: [
      s1, s2, s3, s4, s5,
      S('Draw eyes. Press its back and slide your finger off. Jump!', 'spring', { item: K.g(frog, 0, 0, 0.6), at: [60, 120], to: [150, 120], h: 60 }),
      S('Hop, hop, hop! How far can it jump?', 'show', { item: K.g(frog, 0, 20, 0.7), kind: 'hop' })
    ] };
  })();

  const jumpbunny = (() => {
    const B = K.ori(C.pink, '#F7C1D9', [[100, 20], [155, 75], [100, 130], [45, 75]]);
    const s1 = B.fold('Fold the square in half to make a triangle.', { from: [100, 130], to: [100, 20] });
    B.shift(0, 30);
    const s2 = B.fold('Fold both side corners up to make two long ears.', { from: [45, 105], to: [78, 52] }, { from: [155, 105], to: [122, 52] });
    const s3 = B.fold('Fold the top point down to make a face.', { from: [100, 50], to: [100, 78], top: true });
    const s4 = B.fold('Fold the bottom up. Press it flat, then let it spring back.', { from: [100, 105], to: [100, 86] });
    const face = K.circ(92, 88, 2.6, OL, 0) + K.circ(108, 88, 2.6, OL, 0) + K.circ(100, 94, 2.4, C.red, 0) + K.line([[86, 96], [76, 94]], OL, 1) + K.line([[114, 96], [124, 94]], OL, 1);
    const s5 = S('Draw a face with whiskers.', 'draw', { base: B.svg(), s: [circlePts(92, 88, 2.6, 8), circlePts(108, 88, 2.6, 8), [[86, 96], [76, 94]], [[114, 96], [124, 94]]], tool: 'pen', fill: face });
    const bun = K.g(B.svg() + face, -100, -106);
    return { id: 'jumpbunny', cat: 'fold', name: 'Jumping origami bunny', ico: '🐰', lv: 3, min: 20, mat: [['🟪', 'square paper'], M.pens], tip: 'The bottom fold is the spring: crease it hard, then press the bunny\'s back edge and slide off.', steps: [
      s1, s2, s3, s4, s5,
      S('Press the back edge and slide your finger off. Boing!', 'spring', { item: K.g(bun, 0, 0, 0.55), at: [60, 122], to: [148, 122], h: 64 }),
      S('Your bunny can jump! Make a whole family.', 'show', { item: K.g(bun, 0, 30, 0.7), kind: 'hop' })
    ] };
  })();

  /* ================= pop-up cards ================= */
  const cardFold = (t, c = '#FFFDF7') => S(t, 'morph', { from: [{ p: [[40, 20], [160, 20], [160, 130], [40, 130]], c }], to: [{ p: [[40, 50], [160, 50], [160, 110], [40, 110]], c }] });
  const popflower = (() => {
    const petals = Array.from({ length: 8 }, (_, i) => { const a = i * 45 * Math.PI / 180; return K.ell(100 + 14 * Math.cos(a), 62 + 14 * Math.sin(a), 9, 9, C.pink, 1.2); }).join('') + K.circ(100, 62, 8, C.yellow);
    const flowerUp = petals + K.line([[100, 70], [100, 86]], C.green, 3) + K.leaf(92, 80, 6, C.green, -30);
    const fl = Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2, r = i % 2 ? 14 : 26; return [100 + r * Math.cos(a), 75 + r * Math.sin(a)]; });
    const pop = { fy: 86, w: 120, out: C.purple, in: '#FFFDF7', pop: flowerUp, deco: K.line(K.wave(56, 144, 40, 2, 4), C.purple, 2) };
    return { id: 'popflower', cat: 'cards', name: 'Pop-up flower card', ico: '🌸', lv: 1, min: 15, mat: [M.card, M.color, M.scissors, M.glue, M.crayons, M.tpl], tip: 'The magic is the fold in the flower: glue only the two halves, never the middle line.', steps: [
      cardFold('Fold the card in half and open it again.'),
      S('Cut out a paper flower.', 'cut', { base: K.sheet(40, 30, 120, 90, C.pink), pts: fl.concat([fl[0]]) }),
      S('Fold the flower in half.', 'morph', { from: [{ p: fl, c: C.pink }], to: [{ p: fl.filter(p => p[0] >= 99), c: C.pink }] }),
      S('Glue it over the middle fold of the card.', 'glue', { base: K.rect(40, 30, 120, 90, '#FFFDF7', 2) + K.line([[40, 75], [160, 75]], 'rgba(34,48,90,.35)', 1.2, '3 3'), dots: [[86, 62], [114, 62], [86, 88], [114, 88]] }),
      S('Close the card, then open it. The flower pops up!', 'popup', pop),
      S('A card that blooms! Who will you give it to?', 'show', { item: mid(done({ a: 'popup', ...pop })), kind: 'bounce' })
    ] };
  })();

  const popcake = (() => {
    const flat = [[40, 50], [160, 50], [160, 110], [40, 110]];
    const cake = K.rect(80, 58, 40, 28, C.pink, 3) + K.rect(80, 58, 40, 7, '#fff', 3) + [88, 100, 112].map(x => K.rect(x - 1.5, 46, 3, 12, C.blue, 1) + K.ell(x, 43, 2.5, 4, C.orange, 1)).join('');
    const box = K.rect(84, 62, 32, 24, '#FFE3EC', 1);
    const pop = { fy: 86, w: 120, out: C.blue, in: '#FFFDF7', pop: box + cake, deco: '' };
    const deco = { fy: 86, w: 120, out: C.blue, in: '#FFFDF7', pop: box + cake, deco: K.line(K.wave(52, 148, 34, 2, 5), C.red, 2) };
    return { id: 'popcake', cat: 'cards', name: 'Pop-up birthday cake card', ico: '🎂', lv: 2, min: 25, mat: [M.card, M.color, M.scissors, M.glue, M.crayons, M.tpl], tip: 'Cut the two slits the same length, from the fold. The template marks them.', steps: [
      cardFold('Fold the card in half.'),
      S('Cut two short slits from the fold, side by side.', 'cut', { base: K.poly(flat, '#FFFDF7'), cuts: [[[84, 50], [84, 74]], [[116, 50], [116, 74]]] }),
      S('Push the flap through to the inside. Open: a little box stands up!', 'popup', { ...pop, pop: box }),
      S('Glue a paper cake with candles on the box.', 'place', { base: done({ a: 'popup', ...pop, pop: box }), pieces: [{ svg: cake, at: [100, 66], from: [0, -50] }] }),
      S('Write "Happy birthday" inside.', 'draw', { base: done({ a: 'popup', ...pop }), s: [K.wave(52, 148, 34, 2, 5)], c: C.red, tool: 'pen' }),
      S('Close it and open it: surprise! Happy birthday!', 'popup', deco),
      S('A pop-up cake! Hip hip hooray!', 'show', { item: mid(done({ a: 'popup', ...deco })), kind: 'bounce' })
    ] };
  })();

  const popdragon = (() => {
    const flat = [[40, 40], [160, 40], [160, 110], [40, 110]], mouth = K.poly([[70, 86], [100, 62], [130, 86]], C.red) + K.poly([[70, 86], [100, 106], [130, 86]], '#B8432F') + K.poly([[80, 80], [84, 72], [88, 78]], '#fff', 1) + K.poly([[112, 78], [116, 72], [120, 80]], '#fff', 1);
    const head = K.ell(100, 70, 56, 38, C.green, 1.4) + K.eye(76, 52, 7) + K.eye(124, 52, 7) + K.poly([[60, 36], [70, 14], [80, 34]], C.lime) + K.poly([[120, 34], [130, 14], [140, 36]], C.lime);
    const pop = { fy: 86, w: 128, out: C.green, in: C.mint, pop: mouth, deco: head };
    const flaps = [{ p: [[40, 40], [160, 40], [160, 110], [40, 110]], c: '#FFFDF7' }, { p: [[78, 75], [100, 53], [100, 75]], c: '#F2E6D2' }, { p: [[122, 75], [100, 53], [100, 75]], c: '#F2E6D2' }];
    return { id: 'popdragon', cat: 'cards', name: 'Talking dragon pop-up card', ico: '🐲', lv: 4, min: 45, mat: [['🟨', '2 sheets of card, two colors'], M.scissors, M.ruler, M.glue, M.crayons, M.tpl], tip: 'An expert fold: the mouth flaps are folded both ways before they are pushed through. Crease hard!', steps: [
      cardFold('Fold the inside card in half.'),
      S('Cut one straight slit from the fold, into the middle.', 'cut', { base: K.poly(flat, '#FFFDF7'), pts: [[100, 75], [100, 40]] }),
      S('Fold each side of the slit back into a triangle, then forward again.', 'morph', { from: [{ p: flat, c: '#FFFDF7' }], to: flaps }),
      S('Open the card and push both triangles inside. Close and open: it talks!', 'popup', { ...pop, deco: '' }),
      S('Glue the inside card into the outside card. Do not glue the mouth!', 'glue', { base: K.rect(30, 20, 140, 110, C.green, 3) + K.rect(40, 30, 120, 90, '#FFFDF7', 2), dots: [[48, 38], [152, 38], [48, 112], [152, 112], [48, 75], [152, 75]] }),
      S('Draw a dragon head round the mouth: eyes, horns and scales.', 'draw', { base: K.rect(40, 30, 120, 90, C.mint, 2) + mouth, s: [K.arc(100, 70, 56, 38, 0, 360, 30), circlePts(76, 52, 7, 10), circlePts(124, 52, 7, 10), [[60, 36], [70, 14], [80, 34]], [[120, 34], [130, 14], [140, 36]]], c: C.green, tool: 'pen' }),
      S('Open and close it. The dragon roars!', 'popup', pop),
      S('Roar! Make it say hello, happy birthday, or a joke.', 'show', { item: mid(done({ a: 'popup', ...pop })), kind: 'wiggle' })
    ] };
  })();

  /* ================= nature: rocks, stones, leaves, mandala ================= */
  const rockpet = (() => {
    const rock = K.rock(100, 90, 50, 34, C.grey), blue = K.rock(100, 90, 50, 34, C.sky), spots = [[80, 78], [118, 72], [128, 98], [92, 104]].map(([x, y]) => [x, y, C.purple]);
    const sp = { a: 'dab', pts: spots, shape: 'dot', r: 6, tool: 'brush' }, eyes = K.eye(88, 84, 8) + K.eye(112, 84, 8), ears = K.poly([[70, 64], [62, 44], [84, 58]], C.pink) + K.poly([[130, 64], [138, 44], [116, 58]], C.pink);
    const smile = K.path('M90,100 Q100,110 110,100', 'none', 2.4), pet = ears + blue + done(sp) + eyes + smile;
    return { id: 'rockpet', cat: 'nature', name: 'Rock pet', ico: '🪨', lv: 1, min: 15, mat: [['🪨', 'a round, smooth rock'], M.paint, M.brush, M.eyes, M.felt, M.glue], tip: 'Make a bed for it from a little box and a sock. Some children like to give their rock pet a name and a birthday!', steps: [
      S('Paint the whole rock your favorite color.', 'paint', { base: rock, area: blue, box: [50, 56, 100, 70], c: C.sky }),
      S('Dab on some spots.', 'dab', { base: blue, ...sp }),
      S('Glue on two googly eyes.', 'place', { base: blue + done(sp), pieces: [{ svg: eyes, at: [100, 84], from: [0, -60] }] }),
      S('Cut felt ears and glue them on top.', 'place', { base: blue + done(sp) + eyes, pieces: [{ svg: ears, at: [100, 56], from: [0, -40] }] }),
      S('Paint a little smile.', 'draw', { base: ears + blue + done(sp) + eyes, s: [[[90, 100], [100, 108], [110, 100]]], tool: 'brush', c: OL, fill: smile }),
      S('Hello, rock pet! What is its name?', 'show', { item: mid(pet), kind: 'wiggle' })
    ] };
  })();

  const storystones = (() => {
    const xs = [34, 68, 102, 136, 170], st = xs.map(x => stone(x, 104, '#C9CFD6', 16, 12)).join('');
    const pics = [K.circ(34, 104, 6, C.yellow, 1.2), K.poly([[60, 108], [68, 98], [76, 108]], C.red, 1.2) + K.rect(62, 107, 12, 6, C.red, 1), K.circ(102, 104, 6, C.orange, 1.2) + K.poly([[97, 99], [99, 94], [102, 99]], C.orange, 1) + K.poly([[102, 99], [105, 94], [107, 99]], C.orange, 1), K.poly([[128, 110], [136, 96], [144, 110]], C.green, 1.2), K.path('M162,106 Q170,94 178,106', 'none', 2) + K.circ(170, 106, 2, OL, 0)].join('');
    const lines = [circlePts(34, 104, 6, 10), [[60, 108], [68, 98], [76, 108]], circlePts(102, 104, 6, 10), [[128, 110], [136, 96], [144, 110]], [[162, 106], [170, 96], [178, 106]]];
    const bag = K.path('M70,60 Q60,128 100,128 Q140,128 130,60 Z', C.brown) + K.line([[70, 60], [130, 60]], C.yellow, 3);
    return { id: 'storystones', cat: 'nature', name: 'Story stones', ico: '📖', lv: 1, min: 20, mat: [['🪨', '5 or more flat stones'], ['🖊️', 'paint pens or felt pens'], ['👜', 'a little bag']], tip: 'Pull out one stone at a time and add a sentence: "Once upon a time, the sun..." There is no wrong story!', steps: [
      S('Find five flat stones and wash them.', 'place', { pieces: xs.map((x, i) => ({ svg: stone(x, 104, '#C9CFD6', 16, 12), at: [x, 104], from: [0, -70 - i * 6] })) }),
      S('Draw a little picture on each one: a sun, a house, a cat, a tree, a boat.', 'draw', { base: st, s: lines, c: C.purple, tool: 'pen', fill: pics }),
      S('Put them all in a bag.', 'stack', { base: bag, pieces: [0, 1, 2].map(i => ({ svg: stone(90 + i * 10, 100 - i * 10, '#C9CFD6', 14, 10), at: [90 + i * 10, 90 - i * 10] })) }),
      S('Pull out a stone and start a story. Pull out another one: what happens next?', 'ring', { base: K.rect(14, 84, 172, 40, C.cream, 8), items: xs.map((x, i) => ({ x, y: 104, svg: stone(x, 104, '#C9CFD6', 16, 12) + K.circ(x, 104, 6, [C.yellow, C.red, C.orange, C.green, C.blue][i], 1.2) })) }),
      S('Once upon a time... Your stories never end!', 'show', { item: mid(st + pics + K.path('M60,40 Q100,20 140,40 Q148,64 110,62 L96,74 L98,62 Q56,62 60,40Z', '#fff') + K.emo('💭', 100, 46, 18)), kind: 'glow' })
    ] };
  })();

  const mandala = (() => {
    const center = K.circ(100, 75, 9, C.yellow) + K.circ(100, 75, 4, C.orange, 0);
    const leaves = ring(100, 75, 22, 8).map(([x, y, a]) => ({ x, y, svg: K.leaf(x, y, 8, C.green, a) }));
    const berries = ring(100, 75, 36, 12, -75).map(([x, y]) => ({ x, y, svg: K.circ(x, y, 4, C.red) }));
    const sticks = ring(100, 75, 52, 12).map(([x, y, a]) => ({ x, y, svg: K.g(K.rect(-9, -2, 18, 4, C.brown, 2), x, y, 1, a) }));
    const all = center + [leaves, berries, sticks].map(r => r.map(p => p.svg).join('')).join('');
    return { id: 'mandala', cat: 'nature', name: 'Nature mandala', ico: '🌼', lv: 1, min: 20, mat: [['🍃', 'leaves'], ['🌸', 'petals or berries'], ['🪵', 'little sticks'], ['🪨', 'a stone or a flower for the middle']], tip: 'Only pick things from the ground. Take a photo, then leave it for the wind and the birds.', steps: [
      S('Put a flower or a round stone in the middle.', 'place', { pieces: [{ svg: center, at: [100, 75], from: [0, -80] }] }),
      S('Make a ring of leaves all round it.', 'ring', { base: center, items: leaves }),
      S('Add a ring of berries or petals.', 'ring', { base: center + leaves.map(p => p.svg).join(''), items: berries }),
      S('Make sticks shine out like the sun.', 'ring', { base: center + leaves.map(p => p.svg).join('') + berries.map(p => p.svg).join(''), items: sticks }),
      S('A nature mandala! Take a photo of it.', 'show', { item: mid(all), kind: 'spin', speed: 0.15 })
    ] };
  })();

  const leafanimals = (() => {
    const pap = sheet(), body = K.leaf(96, 86, 34, C.orange, 0), head = K.leaf(140, 70, 18, C.red, -40), tail = K.leaf(46, 72, 20, C.orange, 40);
    const legs = [70, 84, 108, 122].map(x => K.line([[x, 98], [x, 118]], C.brown, 3)).join(''), face = K.eye(146, 64, 3.5) + K.circ(156, 72, 2.4, OL, 0);
    const fox = body + tail + head + legs + face;
    return { id: 'leafanimals', cat: 'nature', name: 'Leaf animals', ico: '🦊', lv: 1, min: 15, mat: [['🍂', 'dry leaves in different shapes'], M.glue, M.paper, M.pens], tip: 'Lay the leaves out first and play with shapes before gluing. One big leaf body, one small leaf head!', steps: [
      S('Find a big leaf for a body and a small one for a head.', 'place', { base: pap, pieces: [{ svg: body, at: [96, 86], from: [-40, -80], r: -40 }, { svg: head, at: [140, 70], from: [30, -80], r: 50 }] }),
      S('Glue them onto the paper.', 'glue', { base: pap + body + head, dots: [[80, 86], [112, 86], [140, 70]] }),
      S('Add a leaf tail.', 'place', { base: pap + body + head, pieces: [{ svg: tail, at: [46, 72], from: [-50, -30], r: 60 }] }),
      S('Draw legs, an eye and a nose.', 'draw', { base: pap + body + head + tail, s: [70, 84, 108, 122].map(x => [[x, 98], [x, 118]]).concat([circlePts(146, 64, 3.5, 8)]), c: C.brown, w: 3, tool: 'pen', fill: legs + face }),
      S('A leafy fox! What other animals can you make?', 'show', { item: mid(pap + fox), kind: 'glow' })
    ] };
  })();

  /* ================= string, science and recycling ================= */
  const dreamcatcher = (() => {
    const plateS = K.circ(100, 62, 46, '#fff'), ringS = K.circ(100, 62, 46, C.purple) + K.circ(100, 62, 32, '#FFF6E5');
    const pins = Array.from({ length: 10 }, (_, i) => { const a = (i * 36 - 90) * Math.PI / 180; return [100 + 39 * Math.cos(a), 62 + 39 * Math.sin(a)]; });
    const order = [0, 4, 8, 2, 6, 0, 3, 7, 1, 5, 9, 3];
    const web = K.line(order.map(i => pins[i]), '#fff', 1.6), holes = pins.map(([x, y]) => K.hole(x, y, 2.2)).join('');
    const hang = [76, 100, 124].map(x => K.line([[x, 100], [x, 132]], C.purple, 1.6)).join(''), beads = [76, 100, 124].map(x => K.bead(x, 116, 4, C.yellow)).join('');
    const feathers = [76, 100, 124].map(x => K.g(K.ell(0, 0, 4, 11, C.sky, 1.2) + K.line([[0, -10], [0, 12]], OL, 1), x, 134, 1)).join('');
    const dc = ringS + holes + web + hang + beads + feathers;
    return { id: 'dreamcatcher', cat: 'string', name: 'Dream catcher', ico: '🕸️', lv: 3, min: 40, mat: [M.plate, M.scissors, M.punch, M.paint, M.wool, ['💠', 'beads'], ['🪶', 'feathers']], tip: 'Dream catchers come from the Ojibwe people of North America. Talk about where the idea comes from while you make it.', steps: [
      S('Cut the middle out of a paper plate. A grown-up starts the cut.', 'cut', { base: plateS, pts: circlePts(100, 62, 32, 24) }),
      S('Paint the ring. Let it dry.', 'paint', { base: K.circ(100, 62, 46, '#fff') + K.circ(100, 62, 32, '#FFF6E5'), area: ringS, box: [54, 16, 92, 92], c: C.purple }),
      S('Punch holes all round the ring.', 'punch', { base: ringS, holes: pins, r: 2.2 }),
      S('Weave the wool across from hole to hole to make a web.', 'pins', { base: ringS + holes, pins, order, c: '#fff' }),
      S('Tie three strings to the bottom. Thread on beads.', 'thread', { base: ringS + holes + web + hang, pts: [[100, 132], [100, 100]], beads: [C.yellow, C.pink], r: 4 }),
      S('Tie a feather to the end of each string.', 'tie', { base: ringS + holes + web + hang + beads + feathers, at: [100, 124], c: C.purple }),
      S('Hang it by your bed. Sweet dreams!', 'show', { item: mid(dc), kind: 'swing' })
    ] };
  })();

  const kite = (() => {
    const v = [[100, 20], [150, 62], [100, 132], [50, 62]], sticks = K.line([[100, 20], [100, 132]], C.brown, 3) + K.line([[50, 62], [150, 62]], C.brown, 3);
    const sail = K.poly(v, C.red) + K.poly([[100, 20], [150, 62], [100, 62]], C.yellow, 1.2) + K.poly([[100, 62], [50, 62], [100, 132]], C.yellow, 1.2), tail = K.line([[100, 132], [92, 140], [108, 148]], OL, 1.4);
    const bows = [[94, 140], [106, 147]].map(([x, y]) => K.poly([[x - 6, y - 4], [x, y], [x - 6, y + 4]], C.blue, 1) + K.poly([[x + 6, y - 4], [x, y], [x + 6, y + 4]], C.blue, 1)).join('');
    const k = sail + sticks + tail + bows, bag = K.rect(30, 14, 140, 122, '#FFE3EC', 3);
    return { id: 'kite', cat: 'science', name: 'Diamond kite', ico: '🪁', lv: 3, min: 60, mat: [['🪵', '2 thin sticks (one 60 cm, one 50 cm)'], ['🛍️', 'a big plastic bag or paper'], M.scissors, M.tape, M.ruler, M.wool, M.ribbon, M.tpl], safe: 'Fly kites in a big open space, far from roads, trees and power lines.', tip: 'Science: wind pushes on the sail and the tail keeps it steady. No wind? Run!', steps: [
      S('Measure the cross stick a third of the way down the long one.', 'measure', { base: K.line([[100, 20], [100, 132]], C.brown, 3), from: [100, 20], to: [100, 62], n: 3, nums: true }),
      S('Lay the sticks in a cross.', 'place', { base: K.line([[100, 20], [100, 132]], C.brown, 3), pieces: [{ svg: K.line([[50, 62], [150, 62]], C.brown, 3), at: [100, 62], from: [80, 0], r: 30 }] }),
      S('Tie them together tightly where they cross.', 'knot', { base: sticks, at: [100, 62], c: OL }),
      S('Cut a diamond sail from a bag. Use the template!', 'cut', { base: bag, pts: v.concat([v[0]]) }),
      S('Tape the sail onto the sticks at every corner.', 'place', { base: sticks, pieces: [{ svg: sail + sticks, at: [100, 75], from: [0, -40] }].concat(v.map(([x, y]) => ({ svg: tapeP(x, y, 12, 7), at: [x, y], from: [0, -30] }))) }),
      S('Tie a long tail with ribbon bows on it.', 'tie', { base: sail + sticks + tail, at: [100, 140], c: C.blue }),
      S('Tie a long string to the middle. Run into the wind!', 'show', { item: K.g(k, -100, -75, 0.6), kind: 'fly', at: [100, 60] })
    ] };
  })();

  const machebowl = (() => {
    const strips = []; for (let i = 0; i < 6; i++) { const a0 = 190 + i * 27, a1 = a0 + 34, p = K.arc(100, 80, 46, 46, a0, a1, 6), q = K.arc(100, 80, 30, 30, a1 + 6, a0 - 6, 6); strips.push({ p: p.concat(q), c: i % 2 ? '#EFE6D2' : '#E3DCCB' }); }
    const strips2 = []; for (let i = 0; i < 5; i++) { const x = 58 + i * 17; strips2.push({ p: [[x, 38], [x + 16, 36], [x + 20, 82], [x + 2, 84]], c: i % 2 ? '#F4ECDA' : '#E9E0CC' }); }
    const balloon = K.ell(100, 80, 46, 50, C.red) + K.ell(84, 60, 7, 12, 'rgba(255,255,255,.5)', 0), news = K.rect(40, 30, 120, 90, '#E9E9E4', 2) + [44, 56, 68, 80, 92, 104].map(y => K.line([[48, y], [152, y]], '#A9B2BC', 2)).join('');
    const l1 = { a: 'layer', strips }, l2 = { a: 'layer', strips: strips2 }, covered = balloon + done(l1) + done(l2);
    const bowl = K.path('M50,70 Q50,126 100,126 Q150,126 150,70 Z', '#EFE6D2') + K.ell(100, 70, 50, 12, '#E3DCCB');
    const painted = K.path('M50,70 Q50,126 100,126 Q150,126 150,70 Z', C.blue) + K.ell(100, 70, 50, 12, C.yellow) + [70, 100, 130].map(x => K.circ(x, 100, 5, C.yellow, 0)).join('');
    return { id: 'machebowl', cat: 'recycle', name: 'Paper mache bowl', ico: '🥣', lv: 3, min: 60, mat: [['🎈', 'a balloon'], M.news, ['🧴', 'flour-and-water paste or watered-down white glue'], ['🥣', 'a bowl and a spoon'], M.scissors, M.paint, M.brush], tip: 'Spread it over two days: layers today, dry overnight, pop and paint tomorrow. It gets messy, so cover the table!', steps: [
      S('Blow up a balloon. Tie it.', 'inflate', { at: [90, 68], r: 46, c: C.red }),
      S('Tear newspaper into long strips.', 'tear', { box: [40, 40, 120, 70], n: 6, c: '#E9E9E4' }),
      S('Stir flour and water into a gooey paste.', 'stir', { at: [100, 92], r: 40, c0: '#FFFFFF', c1: '#EFE6D2', bits: ['#F4F1E8', '#fff'] }),
      S('Dip each strip in paste and lay it on the top half of the balloon.', 'layer', { base: balloon, ...l1 }),
      S('Add two more layers, crossing the strips. Let it dry for a day.', 'layer', { base: balloon + done(l1), ...l2 }),
      S('A grown-up pops the balloon. Trim the edge with scissors.', 'cut', { base: bowl, pts: K.arc(100, 70, 50, 12, 180, 360, 16) }),
      S('Paint your bowl inside and out.', 'paint', { base: bowl, area: painted, box: [50, 58, 100, 70], c: C.blue }),
      S('Your very own bowl! Keep treasures in it.', 'show', { item: mid(painted), kind: 'glow' })
    ] };
  })();

  const eggcaterpillar = (() => {
    const xs = [56, 80, 104, 128], carton = K.rect(40, 70, 104, 40, '#D9CDB8', 6) + xs.map(x => K.ell(x, 90, 11, 16, '#C9BCA4', 1.2)).join('');
    const strip = xs.map(x => K.ell(x, 92, 12, 16, '#D9CDB8')).join(''), green = xs.map(x => K.ell(x, 92, 12, 16, C.lime)).join('');
    const sp = { a: 'dab', pts: xs.map(x => [x, 88, C.yellow]), shape: 'dot', r: 3.5, tool: 'brush' };
    const feelers = K.line([[54, 78], [46, 56]], C.purple, 2.5) + K.line([[60, 78], [64, 56]], C.purple, 2.5) + K.circ(46, 55, 3, C.pink) + K.circ(64, 55, 3, C.pink);
    const face = K.eye(52, 88, 3.5) + K.eye(62, 88, 3.5) + K.smile(57, 96, 4);
    const cat = green + done(sp) + feelers + face;
    return { id: 'eggcaterpillar', cat: 'recycle', name: 'Egg carton caterpillar', ico: '🐛', lv: 1, min: 20, mat: [['🥚', 'a cardboard egg carton'], M.scissors, M.paint, M.brush, ['〰️', 'a pipe cleaner'], M.pens], tip: 'Read "The Very Hungry Caterpillar" together, then make one!', steps: [
      S('A grown-up cuts a strip of four egg cups.', 'cut', { base: carton, pts: [[40, 110], [144, 110]], piece: '', off: [0, 0] }),
      S('Paint it green all over. Let it dry.', 'paint', { base: strip, area: green, box: [42, 74, 100, 36], c: C.lime }),
      S('Dab yellow spots on its back.', 'dab', { base: green, ...sp }),
      S('Poke in a pipe cleaner for feelers.', 'place', { base: green + done(sp), pieces: [{ svg: feelers, at: [55, 66], from: [0, -40] }] }),
      S('Draw a happy face.', 'draw', { base: green + done(sp) + feelers, s: [circlePts(52, 88, 3.5, 8), circlePts(62, 88, 3.5, 8), K.arc(57, 96, 4, 3, 20, 160, 8)], tool: 'pen', fill: face }),
      S('Wiggle, wiggle! A very hungry caterpillar.', 'show', { item: mid(cat), kind: 'drive', s: 0.9 })
    ] };
  })();

  /* ================= the cardboard castle (expert) ================= */
  const castle = (() => {
    const wall = (x, w, c = C.card) => K.poly([[x, 124], [x, 74], ...Array.from({ length: Math.floor(w / 10) }, (_, i) => [[x + i * 10, 64], [x + i * 10 + 5, 64], [x + i * 10 + 5, 74], [x + i * 10 + 10, 74]]).flat(), [x + w, 74], [x + w, 124]], c);
    const flatWall = K.rect(30, 74, 140, 50, C.card, 2), back = wall(46, 108, '#C99A5E'), front = wall(40, 120);
    const tower = (x, c = '#E5BC85') => K.rect(x - 11, 46, 22, 78, c, 2) + K.poly([[x - 11, 46], [x - 11, 38], [x - 6, 38], [x - 6, 44], [x + 1, 44], [x + 1, 38], [x + 6, 38], [x + 6, 44], [x + 11, 44], [x + 11, 46]], c, 1.2);
    const towers = [36, 164].map(x => tower(x)).join(''), door = K.path('M88,124 L88,100 Q100,88 112,100 L112,124Z', '#7A5A3A');
    const chains = K.line([[88, 100], [76, 120]], '#8A96A3', 1.4) + K.line([[112, 100], [124, 120]], '#8A96A3', 1.4);
    const stones = [[60, 90], [74, 106], [130, 92], [140, 110], [56, 114]].map(([x, y]) => K.rect(x - 6, y - 3, 12, 6, '#B98A55', 1)).join('');
    const flags = [36, 164].map(x => K.line([[x, 38], [x, 22]], OL, 1.4) + K.poly([[x, 22], [x + 12, 26], [x, 30]], C.red, 1)).join('');
    const full = back + front + stones + towers + door + chains + flags;
    return { id: 'castle', cat: 'build', name: 'Cardboard castle', ico: '🏰', lv: 4, min: 120, mat: [['📦', 'a big cardboard box'], ['🧻', '4 kitchen roll tubes'], M.ruler, M.pencil, M.scissors, M.tape, M.paint, M.brush, ['🧵', 'string']], safe: 'Cardboard is tough: a grown-up does the hard cutting, maybe with a craft knife.', tip: 'A showpiece for a rainy weekend. Make knights from pegs or toilet rolls, and play stories in it!', steps: [
      S('Measure along the top of each wall and mark every 5 centimeters.', 'measure', { base: flatWall, from: [30, 74], to: [170, 74], n: 7, nums: false }),
      S('Cut out every other square to make battlements.', 'cut', { base: flatWall, pts: [[30, 74], ...Array.from({ length: 14 }, (_, i) => [[30 + i * 10, 64], [35 + i * 10, 64], [35 + i * 10, 74], [40 + i * 10, 74]]).flat()].slice(0, 30), piece: '' }),
      S('Stand the four walls up and tape the corners inside.', 'rise', { pieces: [{ svg: back, at: [100, 124], h: 60 }, { svg: front, at: [100, 124], h: 60 }] }),
      S('Cut notches on top of the tubes. Tape a tower at each corner.', 'stack', { base: back + front, pieces: [36, 164].map(x => ({ svg: tower(x), at: [x, 80], h: 100 })) }),
      S('Cut a door on three sides. It folds down: a drawbridge!', 'cut', { base: back + front + towers, pts: [[88, 124], [88, 100], [100, 90], [112, 100], [112, 124]] }),
      S('Poke two holes. Tie string from the drawbridge to the wall.', 'knot', { base: back + front + towers + door, at: [100, 96], c: '#8A96A3' }),
      S('Paint stones on the walls and add paper flags.', 'paint', { base: back + front + towers + door + chains, area: back + front + stones + towers + door + chains + flags, box: [20, 20, 160, 108], c: C.grey }),
      S('Your castle! Raise the drawbridge. Who lives here?', 'show', { item: mid(full), kind: 'glow' })
    ] };
  })();

  /* ================= collage, plates, costumes, sensory ================= */
  const suncatcher = (() => {
    const box = [40, 25, 120, 100], sticky = K.rect(40, 25, 120, 100, 'rgba(255,255,255,.75)', 2) + K.rect(40, 25, 120, 100, 'none', 2);
    const sq = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) sq.push([56 + c * 22 + (r % 2) * 6, 40 + r * 22, [C.red, C.yellow, C.blue, C.green, C.pink, C.orange, C.purple][(r * 5 + c) % 7]]);
    const tiss = { a: 'dab', pts: sq, shape: 'sq', r: 10, tool: 'finger' }, layer = sticky + done(tiss), top = K.rect(40, 25, 120, 100, 'rgba(227,238,248,.35)', 2);
    const heart = Array.from({ length: 41 }, (_, i) => { const t = i / 40 * Math.PI * 2; return [100 + 46 * Math.pow(Math.sin(t), 3), 72 - 46 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16]; });
    const cid = 'cr5sun', heartArt = `<clipPath id="${cid}"><polygon points="${heart.map(p => p.join(',')).join(' ')}"/></clipPath><g clip-path="url(#${cid})">${done(tiss)}</g>` + K.line(heart, OL, 1.6);
    return { id: 'suncatcher', cat: 'collage', name: 'Tissue sun catcher', ico: '🌞', lv: 1, min: 20, mat: [['🪟', 'sticky-back plastic (contact paper)'], M.tissue, M.scissors, ['🧵', 'string for hanging']], tip: 'Pre-cut the tissue squares for little hands. Hang it in a sunny window and watch the colors on the floor!', steps: [
      S('A grown-up peels the backing off. Sticky side up!', 'peel', { base: sticky, box }),
      S('Press tissue squares onto the sticky side. Cover it all!', 'dab', { base: sticky, ...tiss }),
      S('Put another sticky sheet on top and smooth it flat.', 'peel', { base: layer, box, c: '#F0F6FC' }),
      S('Cut it into a big heart. A grown-up helps.', 'cut', { base: layer + top, pts: heart }),
      S('Hang it in a sunny window. It glows!', 'show', { item: mid(heartArt), kind: 'swing' })
    ] };
  })();

  const cottonsheep = (() => {
    const card = sheet(C.sky), grass = K.rect(20, 110, 160, 20, C.green, 0), cloud = [...K.arc(96, 80, 40, 26, 0, 360, 26)];
    const glue = K.line(cloud, '#B9D8F5', 5) + K.line(cloud, '#fff', 3);
    const balls = []; for (let i = 0; i < 16; i++) { const a = rr(i) * Math.PI * 2, d = Math.sqrt(rr(i + 30)) * 0.85; balls.push([96 + 34 * d * Math.cos(a), 80 + 20 * d * Math.sin(a), '#FFFFFF']); }
    const wool = { a: 'dab', pts: balls, shape: 'bubble', r: 12, tool: 'finger' };
    const head = K.ell(142, 74, 12, 15, OL) + K.eye(140, 70, 3) + K.ell(132, 68, 6, 3, OL, 0), legs = [80, 96, 108, 120].map(x => K.rect(x - 2, 100, 5, 16, OL, 2)).join('');
    function rr(i) { const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return x - Math.floor(x); }
    return { id: 'cottonsheep', cat: 'collage', name: 'Fluffy cotton sheep', ico: '🐑', lv: 1, min: 15, mat: [M.card, ['☁️', 'cotton wool balls'], M.pva, ['⬛', 'black paper (or a black pen)'], M.scissors], tip: 'Pulling the cotton wool a little makes it fluffier. Count the balls as they go on!', steps: [
      S('Draw a big cloud shape for the body.', 'draw', { base: card + grass, s: [cloud], c: '#fff', w: 3, tool: 'crayon' }),
      S('Spread glue inside the cloud.', 'draw', { base: card + grass + K.line(cloud, '#fff', 3), s: [K.spiral(96, 80, 2, 30, 3, 50).map(([x, y]) => [x, 80 + (y - 80) * 0.6])], tool: 'glue', w: 4 }),
      S('Press on lots of fluffy cotton wool.', 'dab', { base: card + grass + glue, ...wool }),
      S('Add a black head and four legs.', 'place', { base: card + grass + done(wool), pieces: [{ svg: legs, at: [100, 108], from: [0, 40] }, { svg: head, at: [142, 74], from: [40, -40] }] }),
      S('Baa! A soft, fluffy sheep. Stroke it!', 'show', { item: mid(card + grass + legs + done(wool) + head), kind: 'wiggle' })
    ] };
  })();

  const platefish = (() => {
    const pl = K.circ(96, 78, 48, '#fff'), wedge = [[144, 78], [168, 50], [168, 106]], fishBody = K.path('M48,78 A48,48 0 1 1 132,102 L104,78 L132,54 A48,48 0 0 0 48,78Z', '#fff');
    const tail = K.poly([[38, 78], [14, 54], [14, 102]], C.orange), scales = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) scales.push([62 + c * 15 + (r % 2) * 7, 60 + r * 17, [C.blue, C.teal, C.purple][r]]);
    const sc = { a: 'dab', pts: scales, shape: 'print', r: 7, tool: 'finger' }, eye = K.eye(110, 64, 6);
    return { id: 'platefish', cat: 'plate', name: 'Paper plate fish', ico: '🐠', lv: 1, min: 15, mat: [M.plate, M.scissors, M.glue, M.paint, M.pens], tip: 'Fingerprint scales are fun, but a sponge or a cork works too.', steps: [
      S('Cut a triangle out of the plate. That is the mouth!', 'cut', { base: pl, pts: [[148, 50], [104, 78], [148, 106]], piece: K.poly([[148, 50], [104, 78], [148, 106]], '#fff'), off: [20, 0] }),
      S('Glue the triangle on the other side for a tail.', 'place', { base: fishBody, pieces: [{ svg: tail, at: [26, 78], from: [120, 0], r: 180 }] }),
      S('Press painty fingers on for scales.', 'dab', { base: fishBody + tail, ...sc }),
      S('Draw a big eye.', 'draw', { base: fishBody + tail + done(sc), s: [circlePts(110, 64, 6, 10)], tool: 'pen', fill: eye }),
      S('Blub blub! Your fish can swim.', 'show', { item: mid(fishBody + tail + done(sc) + eye), kind: 'float' })
    ] };
  })();

  const owlmask = (() => {
    const out = [[44, 40], [38, 16], [64, 30], [100, 22], [136, 30], [162, 16], [156, 40], [166, 76], [140, 104], [100, 112], [60, 104], [34, 76], [44, 40]];
    const card = K.sheet(24, 10, 152, 110, '#FFFDF7'), mask = K.poly(out, C.brown), eyesO = circlePts(76, 62, 15, 16), eyesO2 = circlePts(124, 62, 15, 16);
    const eyeRing = K.circ(76, 62, 15, '#FFE38A') + K.circ(124, 62, 15, '#FFE38A') + K.circ(76, 62, 9, '#FFF6E5') + K.circ(124, 62, 9, '#FFF6E5');
    const beak = K.poly([[92, 78], [108, 78], [100, 94]], C.orange), feathers = [K.zig(56, 144, 100, 5, 7), K.zig(66, 134, 90, 5, 5)];
    const fS = feathers.map(p => K.line(p, C.cream, 2.4)).join(''), holes = K.hole(40, 62, 2.6) + K.hole(160, 62, 2.6);
    const m = mask + eyeRing + beak + fS;
    return { id: 'owlmask', cat: 'costume', name: 'Owl mask', ico: '🦉', lv: 1, min: 20, mat: [M.card, M.tpl, M.scissors, M.crayons, M.punch, ['🧵', 'elastic or string']], tip: 'Print the template, or hold the card to the face and mark the eyes. A grown-up cuts the eye holes.', steps: [
      S('Draw an owl face on card, or use the printed template.', 'draw', { base: card, s: [out], c: C.brown, tool: 'crayon' }),
      S('Cut round the outside line.', 'cut', { base: card + K.line(out, C.brown, 2), pts: out }),
      S('A grown-up cuts out the two eye holes.', 'cut', { base: mask, cuts: [eyesO, eyesO2] }),
      S('Color big yellow eyes, an orange beak and feathers.', 'paint', { base: mask + K.circ(76, 62, 9, '#FFF6E5') + K.circ(124, 62, 9, '#FFF6E5'), area: m, box: [34, 16, 132, 96], tool: 'crayon', c: C.orange }),
      S('Punch a hole on each side.', 'punch', { base: m, holes: [[40, 62], [160, 62]], r: 2.6 }),
      S('Tie on the elastic. A grown-up checks it fits.', 'knot', { base: m + holes, at: [100, 120], c: C.red }),
      S('Twit-twoo! You are a wise owl.', 'show', { item: mid(m + holes), kind: 'wiggle' })
    ] };
  })();

  const icepaint = (() => {
    const tray = K.rect(40, 70, 120, 44, '#E3EEF8', 6) + [0, 1, 2, 3].map(i => K.rect(48 + i * 28, 78, 22, 28, '#fff', 4)).join('');
    const cols = [C.red, C.yellow, C.blue, C.green], water = [0, 1, 2, 3].map(i => K.rect(49 + i * 28, 86, 20, 19, 'rgba(142,197,245,.6)', 3)).join('');
    const colored = [0, 1, 2, 3].map(i => K.rect(49 + i * 28, 86, 20, 19, cols[i], 3)).join(''), sticks = [0, 1, 2, 3].map(i => K.rect(57 + i * 28, 56, 5, 36, C.tan, 2)).join('');
    const paper = sheet(), strokes = [{ p: K.wave(40, 160, 50, 8, 2), c: C.red }, { p: K.wave(40, 160, 76, 8, 2), c: C.blue }, { p: K.wave(40, 160, 102, 8, 2), c: C.yellow }];
    return { id: 'icepaint', cat: 'sensory', name: 'Ice cube painting', ico: '🧊', lv: 1, min: 15, mat: [['🧊', 'an ice cube tray'], ['💧', 'water'], ['🌈', 'food coloring or watercolor paint'], M.sticks, M.paper, ['❄️', 'a freezer']], safe: 'Ice is very cold: hold it by the stick, and stop if fingers get too cold.', tip: 'Talk about melting: why is the ice getting smaller? Warm days melt it faster!', steps: [
      S('Pour water into the ice cube tray.', 'pour', { base: tray, box: [133, 86, 20, 19], c: 'rgba(142,197,245,.6)', lv1: 1, cup: [160, 60] }),
      S('Add a few drops of color to each one.', 'dab', { base: tray + water, pts: [0, 1, 2, 3].map(i => [59 + i * 28, 95, cols[i]]), shape: 'blob', r: 8, spread: true, tool: 'dropper' }),
      S('Put a craft stick in each one. Freeze it overnight.', 'place', { base: tray + colored, pieces: [0, 1, 2, 3].map(i => ({ svg: K.rect(57 + i * 28, 56, 5, 36, C.tan, 2), at: [59 + i * 28, 74], from: [0, -60] })) }),
      S('Paint with your ice! Watch the colors melt onto the paper.', 'draw', { base: paper, s: strokes, w: 7, tool: 'ice', guide: false }),
      S('Melty rainbow art! Where did the ice go?', 'show', { item: mid(paper + strokes.map(s => K.line(s.p, s.c, 7)).join('') + K.g(tray + colored + sticks, 60, 90, 0.4)), kind: 'glow' })
    ] };
  })();

  /* ================= puppets, shadows and the theatre ================= */
  const bearHead = (x, y, c = C.brown) => K.circ(x - 20, y - 22, 10, c) + K.circ(x + 20, y - 22, 10, c) + K.circ(x, y, 28, c) + K.ell(x, y + 10, 11, 8, C.tan) + K.circ(x, y + 6, 3.5, OL, 0) + K.eye(x - 10, y - 6, 4) + K.eye(x + 10, y - 6, 4);
  const stickpuppet = (() => {
    const card = sheet(), outline = [K.arc(100, 66, 28, 28, 0, 360, 24), K.arc(80, 44, 10, 10, 0, 360, 12), K.arc(120, 44, 10, 10, 0, 360, 12)];
    const drawn = card + outline.map(p => K.line(p, OL, 2)).join(''), bear = bearHead(100, 66), stick = K.rect(96, 88, 8, 46, C.tan, 3);
    return { id: 'stickpuppet', cat: 'puppet', name: 'Teddy stick puppet', ico: '🧸', lv: 1, min: 15, mat: [M.card, M.tpl, M.crayons, M.scissors, M.tape, M.sticks], tip: 'Make two or three and act out a story: Goldilocks needs three bears!', steps: [
      S('Draw a big round teddy face with two ears. Or use the template.', 'draw', { base: card, s: outline, tool: 'pen' }),
      S('Color it in: brown fur, a light nose.', 'paint', { base: drawn, area: card + bear, box: [70, 30, 60, 66], tool: 'crayon', c: C.brown }),
      S('Cut it out. A grown-up helps with the ears.', 'cut', { base: card + bear, pts: [[72, 66], [70, 44], [80, 32], [92, 40], [108, 40], [120, 32], [130, 44], [128, 66], [118, 90], [100, 95], [82, 90], [72, 66]] }),
      S('Tape a craft stick on the back.', 'place', { base: bear, pieces: [{ svg: stick + tapeP(100, 94, 16, 7), at: [100, 110], from: [0, 50] }] }),
      S('Hello! Put on a puppet show.', 'show', { item: mid(stick + bear), kind: 'wiggle' })
    ] };
  })();

  const spoondoll = (() => {
    const spoon = K.ell(100, 50, 22, 28, '#E2B87C') + K.rect(96, 76, 8, 58, '#E2B87C', 3), face = K.eye(92, 48, 3.4) + K.eye(108, 48, 3.4) + K.smile(100, 58, 6) + K.circ(88, 56, 3, C.pink, 0) + K.circ(112, 56, 3, C.pink, 0);
    const hair = Array.from({ length: 9 }, (_, i) => K.path(`M${80 + i * 5},28 Q${76 + i * 6},${48 + (i % 3) * 6} ${74 + i * 6.5},${60 + (i % 2) * 6}`, 'none', 0, `stroke="${C.orange}" stroke-width="3" stroke-linecap="round"`)).join('');
    const dress = K.path('M80,82 L120,82 L134,132 L66,132Z', C.purple) + [86, 100, 114].map(x => K.circ(x, 110, 3, C.yellow, 0)).join('');
    const doll = spoon + dress + face + hair;
    return { id: 'spoondoll', cat: 'puppet', name: 'Wooden spoon doll', ico: '🥄', lv: 1, min: 20, mat: [['🥄', 'a wooden spoon'], M.pens, M.wool, M.glue, ['🧣', 'a scrap of fabric'], M.ribbon], tip: 'Make a whole family of spoon people, one for everyone at home.', steps: [
      S('Draw a face on the back of the spoon.', 'draw', { base: spoon, s: [circlePts(92, 48, 3.4, 8), circlePts(108, 48, 3.4, 8), K.arc(100, 58, 6, 4, 20, 160, 8)], tool: 'pen', fill: face }),
      S('Put glue dots round the top.', 'glue', { base: spoon + face, dots: [[82, 34], [92, 26], [104, 25], [116, 32]] }),
      S('Press on wool hair.', 'place', { base: spoon + face, pieces: [{ svg: hair, at: [100, 40], from: [0, -60] }] }),
      S('Wrap fabric round for clothes. Tie it with ribbon.', 'tie', { base: spoon + dress + face + hair, at: [100, 84], c: C.pink }),
      S('Hello, spoon friend! What is her name?', 'show', { item: mid(doll), kind: 'wiggle' })
    ] };
  })();

  const birdPts = [[-30, 4], [-14, -12], [0, -6], [18, -22], [12, -2], [30, -4], [16, 8], [-8, 12], [-30, 4]];
  const birdSil = c => K.poly(birdPts, c, 0) + K.circ(-18, -2, 2, c === OL ? OL : '#fff', 0);
  const shadowpuppets = (() => {
    const card = K.sheet(30, 20, 140, 100, '#3A3F4A'), drawn = K.g(K.line(birdPts, '#fff', 1.6), 100, 70, 2);
    const bird = K.g(K.poly(birdPts, '#2B2B33', 1.4) + K.circ(-18, -2, 2, '#fff', 0), 100, 70, 2), stick = K.rect(97, 86, 6, 46, C.tan, 2);
    const puppet = K.g(K.poly(birdPts, '#2B2B33', 1.2) + K.circ(-18, -2, 1.6, '#fff', 0) + K.rect(-2, 8, 4, 20, C.tan, 1), 0, 0, 0.9);
    return { id: 'shadowpuppets', cat: 'puppet', name: 'Shadow puppets', ico: '🐦', lv: 2, min: 25, mat: [['⬛', 'black card'], M.tpl, M.pencil, M.scissors, M.tape, ['🥤', 'straws or sticks'], ['🔦', 'a torch or a lamp']], tip: 'Move the puppet closer to the light and the shadow grows huge. Further away, it shrinks!', steps: [
      S('Draw a bird on black card with a white pencil. Or use the template.', 'draw', { base: card, s: [birdPts.map(([x, y]) => [100 + x * 2, 70 + y * 2])], c: '#fff', tool: 'pen' }),
      S('Cut it out carefully.', 'cut', { base: card + drawn, pts: birdPts.map(([x, y]) => [100 + x * 2, 70 + y * 2]), piece: '' }),
      S('Tape a straw on the back for a handle.', 'place', { base: bird, pieces: [{ svg: stick + tapeP(100, 92, 14, 7), at: [100, 110], from: [0, 50] }] }),
      S('Turn off the lights. Shine a torch on the wall. Fly your bird!', 'shadow', { puppet, sil: K.g(birdSil(OL), 0, 0, 1) }),
      S('Tweet tweet! Make a rabbit and a dragon too.', 'show', { item: mid(bird + stick), kind: 'fly', s: 0.6 })
    ] };
  })();

  const shadowtheatre = (() => {
    const box = K.rect(30, 20, 140, 110, C.card, 3), win = [[50, 34], [150, 34], [150, 104], [50, 104], [50, 34]], hole = K.rect(50, 34, 100, 70, '#3A3F4A', 1);
    const screen = K.rect(50, 34, 100, 70, '#FFFDF2', 1), red = K.rect(30, 20, 140, 110, C.red, 3), curt = K.path('M50,34 Q62,70 50,104 L44,104 L44,34Z', C.purple) + K.path('M150,34 Q138,70 150,104 L156,104 L156,34Z', C.purple) + K.rect(44, 26, 112, 10, C.yellow, 2);
    const stage = red + screen + curt, rabbit = K.path('M-12,10 Q-16,-6 -6,-8 L-8,-26 L-2,-10 L2,-28 L4,-8 Q14,-4 12,10Z', OL, 0), puppet = K.g(K.path('M-12,10 Q-16,-6 -6,-8 L-8,-26 L-2,-10 L2,-28 L4,-8 Q14,-4 12,10Z', '#2B2B33', 1.2) + K.rect(-2, 10, 4, 20, C.tan, 1), 0, 0, 0.8);
    return { id: 'shadowtheatre', cat: 'puppet', name: 'Shadow puppet theatre', ico: '🎭', lv: 4, min: 90, mat: [['📦', 'a big cardboard box'], M.ruler, M.pencil, M.scissors, ['📃', 'baking paper or a white sheet'], M.tape, M.paint, M.brush, M.color, M.tpl, ['🔦', 'a torch']], safe: 'A grown-up cuts the window, maybe with a craft knife. Never leave a lamp touching paper.', tip: 'A showpiece: make the theatre one day and the puppets the next, then sell "tickets" to the family!', steps: [
      S('Measure and draw a big window in the bottom of the box.', 'measure', { base: box, from: [50, 104], to: [150, 104], n: 5, nums: false }),
      S('A grown-up cuts out the window.', 'cut', { base: box + K.line(win, OL, 1.4, '4 3'), pts: win, piece: '' }),
      S('Tape baking paper over the window, on the inside. That is the screen.', 'place', { base: box + hole, pieces: [{ svg: screen, at: [100, 69], from: [0, -80] }] }),
      S('Paint the theatre bright red.', 'paint', { base: box + screen, area: red + screen, box: [30, 20, 140, 110], c: C.red }),
      S('Glue on paper curtains and a yellow sign.', 'place', { base: red + screen, pieces: [{ svg: curt, at: [100, 60], from: [0, -60] }] }),
      S('Put a torch behind the screen. Hold up your puppets and tell a story!', 'shadow', { screen: [128, 18, 64, 104], puppet, sil: K.g(rabbit, 0, 0, 1) }),
      S('Showtime! Bow when the story ends.', 'show', { item: mid(stage + K.g(rabbit, 100, 78, 1.6)), kind: 'glow' })
    ] };
  })();

  const marionette = (() => {
    const card = sheet(), parts = [circlePts(46, 44, 16, 16), [[78, 30], [108, 30], [108, 74], [78, 74], [78, 30]], [[122, 30], [132, 30], [132, 64], [122, 64], [122, 30]], [[142, 30], [152, 30], [152, 64], [142, 64], [142, 30]], [[40, 82], [52, 82], [52, 122], [40, 122], [40, 82]], [[62, 82], [74, 82], [74, 122], [62, 122], [62, 82]]];
    const col = [C.pink, C.blue, C.blue, C.blue, C.purple, C.purple], partsS = parts.map((p, i) => K.poly(p, col[i], 1.4)).join('');
    const pHoles = [[46, 32], [93, 34], [93, 70], [127, 34], [147, 34], [127, 60], [147, 60], [46, 86], [68, 86]];
    // the assembled puppet
    const body = K.rect(86, 70, 28, 36, C.blue, 4), head = K.circ(100, 56, 13, C.pink) + K.eye(95, 54, 2.4) + K.eye(105, 54, 2.4) + K.smile(100, 60, 4);
    const arms = K.rect(74, 72, 9, 28, C.blue, 3) + K.rect(117, 72, 9, 28, C.blue, 3), legs = K.rect(88, 106, 10, 28, C.purple, 3) + K.rect(102, 106, 10, 28, C.purple, 3);
    const doll = arms + legs + body + head, cross = K.rect(66, 10, 68, 6, C.tan, 2) + K.rect(97, 2, 6, 24, C.tan, 2);
    const strings = [[[70, 13], [78, 98]], [[130, 13], [122, 98]], [[100, 20], [100, 44]]];
    const stringsS = strings.map(p => K.line(p, OL, 1)).join('');
    return { id: 'marionette', cat: 'puppet', name: 'Puppet on strings', ico: '🪆', lv: 4, min: 75, mat: [M.card, M.tpl, M.scissors, M.crayons, M.punch, ['🧵', 'string or thread'], ['🪵', '2 craft sticks'], M.tape], tip: 'An expert puppet: the joints must be loose to swing. Tilt the cross and your puppet walks!', steps: [
      S('Draw a head, a body, two arms and two legs. Cut them all out.', 'cut', { base: card, cuts: parts }),
      S('Color your puppet\'s clothes and face.', 'paint', { base: card + parts.map(p => K.poly(p, '#fff', 1.4)).join(''), area: card + partsS, box: [28, 26, 128, 100], tool: 'crayon', c: C.blue }),
      S('Punch a hole at each end where the parts join.', 'punch', { base: card + partsS, holes: pHoles, r: 2.2 }),
      S('Tie the arms, legs and head on with short loose strings.', 'knot', { base: doll, at: [100, 104], c: OL }),
      S('Tape two craft sticks into a cross.', 'place', { base: doll, pieces: [{ svg: cross, at: [100, 12], from: [0, -40] }] }),
      S('Tie long strings from the cross to the hands and the head.', 'draw', { base: doll + cross, s: strings, c: OL, w: 1.2, tool: 'pen' }),
      S('Tilt the cross: your puppet waves and dances!', 'show', { item: mid(cross + stringsS + doll), kind: 'swing' })
    ] };
  })();

  /* ================= loom weaving ================= */
  const loomweave = (() => {
    const box = [44, 18, 112, 114], board = K.rect(44, 18, 112, 114, C.card, 3), cols1 = [C.red, C.orange], cols2 = [C.yellow, C.lime], cols3 = [C.blue, C.purple];
    const L = (pre, n, colors) => ({ a: 'loom', box, warp: 9, pre, n, rowH: 9, colors });
    const notchesFrom = [52, 18], notchesTo = [148, 18];
    const allCols = [C.red, C.orange, C.red, C.orange, C.yellow, C.lime, C.yellow, C.lime, C.blue, C.purple, C.blue];
    const finished = done(L(0, 11, allCols));
    return { id: 'loomweave', cat: 'thread', name: 'Cardboard loom weaving', ico: '🧶', lv: 3, min: 60, mat: [['🟫', 'a piece of stiff cardboard'], M.ruler, M.scissors, ['🧶', 'wool in 3 colors'], ['🪡', 'a big plastic needle']], tip: 'Do not pull the rows tight, or the sides go thin. Push each row down with your fingers, like a comb.', steps: [
      S('Mark every centimeter along the top and bottom with a ruler.', 'measure', { base: board, from: notchesFrom, to: notchesTo, n: 8, nums: false }),
      S('Cut a small notch at every mark, top and bottom.', 'cut', { base: board, cuts: [K.zig(52, 148, 18, -5, 8), K.zig(52, 148, 132, 5, 8)] }),
      S('Wrap wool up and down through the notches. These are the warp strings.', 'draw', { base: board, s: [Array.from({ length: 9 }, (_, i) => [[54 + i * 12, i % 2 ? 130 : 20], [54 + i * 12, i % 2 ? 20 : 130]]).flat()], c: '#FFFFFF', w: 1.8, tool: 'yarn', guide: false }),
      S('Thread the needle. Go over one string, under the next, all the way across.', 'loom', L(0, 4, cols1)),
      S('Come back the other way: under, over. Push the rows down.', 'loom', L(4, 4, cols2)),
      S('Change colors and keep going to the top.', 'loom', L(8, 3, cols3)),
      S('Cut the back strings. Tie them in pairs, then slide it off.', 'knot', { base: finished, at: [100, 136], c: '#FFFFFF' }),
      S('You wove a little rug! Make one for a teddy.', 'show', { item: mid(finished), kind: 'glow' })
    ] };
  })();

  craftsHome.add([fruitface, fruitkebab, cookieface, yogurtpaint, pastaart, snackcar, pizzafaces, kazoo, platetamb, drumtub, bottlexylo, guitarbox, panflute,
    magnetfish, cupball, stonettt, bowling, spinner, hopfrog, jumpbunny, popflower, popcake, popdragon, rockpet, storystones, mandala, leafanimals,
    dreamcatcher, kite, machebowl, eggcaterpillar, castle, suncatcher, cottonsheep, platefish, owlmask, icepaint, stickpuppet, spoondoll, shadowpuppets,
    shadowtheatre, marionette, loomweave]);
}/*}lazy*/);
