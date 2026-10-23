/* ---------- Crafts corner, part 3: nature, puppets, threading, recycling, sewing, parties, science and string ---------- */
craftsHome.later.push(/*lazy{*/() => {
  const K = craftsHome.kit, C = K.C;
  const S = (t, a, o = {}) => ({ t, a, ...o });
  const mid = svg => K.g(svg, -100, -75);
  const M = {
    paper: ['📄', 'paper'], color: ['🌈', 'colored paper'], scissors: ['✂️', 'child scissors'], glue: ['🧴', 'glue stick'], tape: ['🩹', 'sticky tape'], crayons: ['🖍️', 'crayons'],
    pens: ['🖊️', 'felt pens'], pencil: ['✏️', 'pencil'], paint: ['🎨', 'paint'], brush: ['🖌️', 'paintbrush'], wool: ['🧶', 'wool or string'], card: ['🟨', 'thin card'],
    punch: ['🕳️', 'hole punch'], felt: ['🟥', 'felt'], eyes: ['👀', 'googly eyes (or draw them)'], sq: ['🟦', 'square paper']
  };
  const circlePts = (cx, cy, r, n = 20) => K.arc(cx, cy, r, r, 0, 360, n);
  // A heart outline as points (the classic heart curve), for lacing, sewing and string art.
  const heartPts = (cx, cy, s, n = 40) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n * Math.PI * 2;
    return [cx + s * 16 * Math.pow(Math.sin(t), 3) / 16, cy - s * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16]; });

  /* --- nature crafts --- */
  const leafPrint = (() => {
    const sheet = K.sheet(25, 20, 150, 110, '#fff'), p1 = `<g opacity=".85">${K.leaf(100, 80, 30, C.red, -20)}</g>`, p2 = `<g opacity=".85">${K.leaf(58, 50, 20, C.orange, 30)}</g>${'<g opacity=".85">' + K.leaf(146, 104, 18, C.green, -60) + '</g>'}`;
    return { id: 'leafprint', cat: 'nature', name: 'Leaf prints', ico: '🍁', lv: 1, min: 15, mat: [['🍂', 'fresh leaves'], M.paint, M.brush, M.paper], tip: 'Fresh, bendy leaves with big veins print best. Collect them on a walk together.', steps: [
      S('Find leaves with bumpy veins.', 'place', { base: '', pieces: [{ svg: K.leaf(60, 75, 22, C.green, 20), at: [60, 75], from: [-20, -90], r: -60 }, { svg: K.leaf(110, 70, 28, C.lime, -15), at: [110, 70], from: [0, -100], r: 80 }, { svg: K.leaf(155, 85, 18, C.orange, 40), at: [155, 85], from: [20, -90], r: -40 }] }),
      S('Paint the bumpy side of a leaf.', 'paint', { base: K.leaf(100, 75, 40, C.mint), area: K.leaf(100, 75, 40, C.red), box: [55, 45, 90, 60], c: C.red }),
      S('Press it paint side down on paper, then peel it off.', 'stamp', { base: sheet, at: [100, 80], item: K.leaf(0, 0, 30, C.red, -20), print: p1 }),
      S('Print more leaves in other colors.', 'stamp', { base: sheet + p1, at: [58, 50], item: K.leaf(0, 0, 20, C.orange, 30), print: p2 }),
      S('Look at all the veins! Nature made the pattern.', 'show', { item: mid(sheet + p1 + p2), kind: 'glow' })
    ] };
  })();

  const rockBug = (() => {
    const rock = K.rock(100, 85, 46, 32, C.grey), red = K.rock(100, 85, 46, 32, C.red), head = K.path('M58,92 C54,70 70,62 78,66 C70,74 70,92 66,100 Z', C.black);
    const spots = [[100, 70], [120, 82], [96, 98], [126, 102], [140, 76]].map(([x, y]) => K.circ(x, y, 5, C.black, 0)).join(''), line = K.line([[80, 62], [140, 104]], C.black, 2.5);
    const eyes = K.circ(64, 78, 3, '#fff', 0) + K.circ(70, 74, 3, '#fff', 0);
    return { id: 'rockbug', cat: 'nature', name: 'Painted rock ladybug', ico: '🪨', lv: 1, min: 15, mat: [['🪨', 'a smooth rock'], M.paint, M.brush, ['🖊️', 'black paint pen']], tip: 'Wash and dry the rock first. Hide it in the garden for someone to find!', steps: [
      S('Paint the rock red all over. Let it dry.', 'paint', { base: rock, area: red, box: [52, 50, 96, 70], c: C.red }),
      S('Paint a black head at one end.', 'paint', { base: red, area: head, box: [52, 60, 28, 44], c: C.black }),
      S('Paint a line down the back and black spots.', 'draw', { base: red + head, s: [[[80, 62], [140, 104]], ...[[100, 70], [120, 82], [96, 98], [126, 102], [140, 76]].map(([x, y]) => circlePts(x, y, 5, 10))], c: C.black, fill: spots + line, tool: 'brush' }),
      S('Add two white dots for eyes.', 'draw', { base: red + head + spots + line, s: [circlePts(64, 78, 3, 8), circlePts(70, 74, 3, 8)], c: '#fff', fill: eyes, tool: 'brush' }),
      S('A rock ladybug! Hide it in the garden.', 'show', { item: mid(red + head + spots + line + eyes), kind: 'wiggle' })
    ] };
  })();

  const coneOwl = (() => {
    const cone = K.cone(100, 88), eyes = K.circ(90, 66, 8, '#fff') + K.circ(110, 66, 8, '#fff') + K.circ(90, 66, 3, K.OL, 0) + K.circ(110, 66, 3, K.OL, 0), beak = K.poly([[96, 74], [104, 74], [100, 82]], C.orange);
    const wings = K.ell(74, 92, 7, 18, C.orange) + K.ell(126, 92, 7, 18, C.orange), tufts = K.poly([[80, 58], [84, 44], [92, 56]], C.brown) + K.poly([[120, 58], [116, 44], [108, 56]], C.brown);
    return { id: 'coneowl', cat: 'nature', name: 'Pinecone owl', ico: '🌰', lv: 2, min: 20, mat: [['🌰', 'a pinecone'], M.felt, M.scissors, M.glue, M.eyes], steps: [
      S('Cut two felt circles for eyes and a little triangle beak.', 'cut', { base: K.sheet(40, 40, 120, 70, '#fff'), cuts: [circlePts(75, 70, 16, 20), circlePts(125, 70, 16, 20), [[96, 95], [104, 95], [100, 104], [96, 95]]] }),
      S('Put glue dots near the top of the pinecone.', 'glue', { base: cone, dots: [[90, 66], [110, 66], [100, 78]] }),
      S('Stick on the eyes and beak.', 'place', { base: cone, pieces: [{ svg: eyes, at: [100, 66], from: [0, -60] }, { svg: beak, at: [100, 78], from: [40, -30] }] }),
      S('Add felt wings and ear tufts.', 'place', { base: cone + eyes + beak, pieces: [{ svg: wings, at: [100, 92], from: [0, 40] }, { svg: tufts, at: [100, 52], from: [0, -40] }] }),
      S('Hoo! A woodland owl.', 'show', { item: mid(cone + wings + tufts + eyes + beak), kind: 'wiggle' })
    ] };
  })();

  const crownN = (() => {
    const band = K.rect(20, 70, 160, 34, C.tan, 2), zig = K.zig(20, 180, 70, 22, 5), cutBand = K.poly([[20, 104], ...zig, [180, 104]], C.tan);
    const bits = [[40, 86, C.green], [72, 84, C.orange], [100, 86, C.red], [128, 84, C.lime], [160, 86, C.yellow]].map(([x, y, c], i) => i % 2 ? K.leaf(x, y, 12, c, 30) : [0, 72, 144, 216, 288].map(a => K.ell(x + 5 * Math.cos(a * Math.PI / 180), y + 5 * Math.sin(a * Math.PI / 180), 4, 4, c, 1)).join('') + K.circ(x, y, 3, C.yellow, 1)).join('');
    const ring = [...K.arc(100, 70, 70, 18, 180, 360, 20).map(([x, y], i) => [x, y - (i % 4 === 2 ? 20 : 0)]), ...K.arc(100, 104, 70, 18, 0, 180, 20)];
    return { id: 'naturecrown', cat: 'nature', name: 'Nature crown', ico: '👑', lv: 2, min: 20, mat: [['🟫', 'a long strip of card'], M.scissors, M.glue, M.tape, ['🌼', 'leaves and flowers']], steps: [
      S('Cut zigzag points along the top of the card strip.', 'cut', { base: band, pts: zig }),
      S('Put glue along the band.', 'glue', { base: cutBand, dots: [[40, 86], [72, 84], [100, 86], [128, 84], [160, 86]] }),
      S('Stick on leaves and flowers.', 'place', { base: cutBand, pieces: [{ svg: bits, at: [100, 86], from: [0, -70] }] }),
      S('Wrap it round your head and tape the ends.', 'morph', { from: [{ p: [[20, 104], ...zig, [180, 104]], c: C.tan }], to: [{ p: ring, c: C.tan }] }),
      S('You are the king or queen of the forest!', 'show', { item: mid(cutBand + bits), kind: 'wiggle' })
    ] };
  })();

  /* --- sock & bag puppets --- */
  const sockP = (() => {
    const head = K.path('M30,62 Q30,40 64,40 L140,45 Q172,50 172,76 Q172,102 140,106 L64,110 Q30,110 30,90 Z', C.blue) + K.line([[172, 76], [130, 80]], K.OL, 2);
    const eyes = K.eye(120, 58, 7) + K.eye(140, 60, 6), tongue = K.path('M150,79 Q160,96 168,80 Z', C.red), hair = K.line(K.zig(80, 130, 42, 10, 5), C.yellow, 3);
    return { id: 'sock', cat: 'puppet', name: 'Sock puppet', ico: '🧦', lv: 1, min: 15, mat: [['🧦', 'an old sock'], M.eyes, M.felt, M.glue, M.wool], tip: 'Fabric glue or a few stitches hold better than a glue stick on socks.', steps: [
      S('Put the sock on your hand. Your thumb makes the mouth.', 'place', { base: '', pieces: [{ svg: head, at: [100, 75], from: [-110, 0] }] }),
      S('Put two glue dots where the eyes go.', 'glue', { base: head, dots: [[120, 58], [140, 60]] }),
      S('Stick on the eyes.', 'place', { base: head, pieces: [{ svg: eyes, at: [130, 59], from: [0, -60] }] }),
      S('Glue a red felt tongue in the mouth.', 'place', { base: head + eyes, pieces: [{ svg: tongue, at: [158, 84], from: [30, 30] }] }),
      S('Add wool hair on top.', 'place', { base: head + eyes + tongue, pieces: [{ svg: hair, at: [105, 40], from: [0, -50] }] }),
      S('Make it talk! Hello, I am Socky!', 'show', { item: mid(head + eyes + tongue + hair), kind: 'wiggle' })
    ] };
  })();

  const bagP = (() => {
    const bag = K.bag(65, 20, 70, 110), face = K.eye(88, 34, 6) + K.eye(112, 34, 6) + K.circ(100, 46, 4, C.pink, 1.2), mouth = K.path('M82,56 Q100,72 118,56 Z', C.red);
    const ears = K.poly([[66, 24], [52, 6], [80, 20]], C.brown) + K.poly([[134, 24], [148, 6], [120, 20]], C.brown), arms = K.rect(46, 78, 20, 10, C.tan, 4) + K.rect(134, 78, 20, 10, C.tan, 4);
    return { id: 'bagpuppet', cat: 'puppet', name: 'Paper bag puppet', ico: '🛍️', lv: 1, min: 15, mat: [['🛍️', 'a paper lunch bag'], M.crayons, M.color, M.scissors, M.glue], steps: [
      S('Lay the bag flat with the folded bottom on top. Draw a face on the flap.', 'draw', { base: bag, s: [circlePts(88, 34, 6, 10), circlePts(112, 34, 6, 10), circlePts(100, 46, 4, 8)], fill: face, tool: 'pen' }),
      S('Draw a mouth just under the flap.', 'draw', { base: bag + face, s: [[[82, 56], [100, 69], [118, 56]]], c: C.red, fill: mouth, tool: 'crayon' }),
      S('Cut out ears and arms from paper.', 'cut', { base: K.sheet(40, 50, 120, 50, C.brown), cuts: [[[50, 95], [65, 55], [80, 95]], [[120, 95], [135, 55], [150, 95]]] }),
      S('Glue on the ears and arms.', 'place', { base: bag + face + mouth, pieces: [{ svg: ears, at: [100, 16], from: [0, -40] }, { svg: arms, at: [100, 83], from: [0, 40] }] }),
      S('Put your hand in and open and close the flap. It talks!', 'show', { item: mid(ears + arms + bag + face + mouth), kind: 'wiggle' })
    ] };
  })();

  const fingerP = (() => {
    const strip = [[40, 65], [160, 65], [160, 85], [40, 85]], tube = [[85, 50], [115, 50], [115, 110], [85, 110]];
    const face = K.eyes(100, 70, 3.5, 12) + K.circ(100, 78, 3, C.pink, 1) + K.smile(100, 84, 5), ears = K.poly([[86, 52], [88, 38], [96, 50]], C.orange) + K.poly([[114, 52], [112, 38], [104, 50]], C.orange);
    const one = (c, dx) => K.g(K.poly(tube, c) + face + ears, dx, 0);
    return { id: 'fingerpuppet', cat: 'puppet', name: 'Finger puppets', ico: '🐱', lv: 2, min: 15, mat: [M.color, M.scissors, M.tape, M.pens], steps: [
      S('Cut a strip of paper a little longer than your finger is round.', 'cut', { base: K.sheet(30, 40, 140, 70, C.orange), cuts: [[[30, 65], [170, 65]], [[30, 85], [170, 85]]] }),
      S('Wrap it round your finger and tape it.', 'morph', { from: [{ p: strip, c: C.orange }], to: [{ p: tube, c: C.orange }], topEnd: K.rect(85, 92, 30, 8, 'rgba(142,197,245,.85)', 1) }),
      S('Draw a face.', 'draw', { base: K.poly(tube, C.orange), s: [circlePts(94, 70, 3.5, 8), circlePts(106, 70, 3.5, 8), [[95, 84], [100, 88], [105, 84]]], fill: face, tool: 'pen' }),
      S('Glue on ears. A kitten!', 'place', { base: K.poly(tube, C.orange) + face, pieces: [{ svg: ears, at: [100, 46], from: [0, -40] }] }),
      S('Make a whole family, one for each finger!', 'show', { item: mid(one(C.orange, -40) + one(C.pink, 0) + one(C.sky, 40)), kind: 'bounce' })
    ] };
  })();

  /* --- threading & weaving --- */
  const necklace = (() => {
    const str = K.arc(100, 30, 70, 80, 170, 10, 40), cols = [C.red, C.yellow, C.blue, C.red, C.yellow, C.blue, C.red, C.yellow];
    const loop = K.arc(100, 75, 50, 48, 0, 360, 40), beadsOn = K.line(loop, K.OL, 1.6) + Array.from({ length: 14 }, (_, i) => { const p = K.arc(100, 75, 50, 48, 110 + i * 23, 110 + i * 23, 1)[0]; return K.bead(p[0], p[1], 7, cols[i % 3]); }).join('');
    return { id: 'necklace', cat: 'thread', name: 'Bead necklace', ico: '📿', lv: 1, min: 10, mat: [M.wool, ['📿', 'big beads or tube pasta'], M.tape], steps: [
      S('Wrap tape round one end of the string. Now it is stiff, like a needle!', 'place', { base: K.line(str, K.OL, 1.8), pieces: [{ svg: K.g(K.rect(-2, -4, 12, 8, C.sky, 2), 169, 44, 1, -40), at: [172, 42], from: [20, -40] }] }),
      S('Thread the first bead and tie it at the end so the others cannot fall off.', 'thread', { pts: str, beads: [C.red], r: 7 }),
      S('Thread the beads on one by one. Make a pattern: red, yellow, blue!', 'thread', { pts: str, beads: cols, r: 7, pre: 1 }),
      S('Tie the ends together in a bow.', 'tie', { base: beadsOn, at: [100, 28] }),
      S('Wear your necklace!', 'show', { item: mid(beadsOn + K.circ(100, 28, 3, C.red)), kind: 'bounce' })
    ] };
  })();

  const weaveMat = (() => {
    const B = K.ori(C.blue, '#7FB2EA', [[40, 30], [160, 30], [160, 120], [40, 120]]);
    const s1 = B.fold('Fold a piece of paper in half.', { from: [100, 120], to: [100, 30] });
    const slits = [52, 64, 76, 88, 100, 112, 124, 136, 148].map(x => [[x, 75], [x, 40]]);
    const mat = [30, 25, 140, 100], w = (row, t, d) => S(t, 'weave', { mat, row, rows: 5, bands: 7, d });
    const done = K.still({ a: 'weave', mat, row: 4, rows: 5, bands: 7 });
    return { id: 'weave', cat: 'thread', name: 'Paper weaving mat', ico: '🧺', lv: 2, min: 25, mat: [['🟦', 'a sheet of paper'], ['🟨', 'strips of another color'], M.scissors, M.glue], tip: 'Over-under is a great pattern lesson. Say "over, under" out loud together.', steps: [
      s1,
      S('Cut lines from the fold. Stop before the edge!', 'cut', { base: B.svg(), cuts: slits }),
      S('Cut strips from the other paper.', 'cut', { base: K.sheet(30, 40, 140, 70, C.yellow), cuts: [[[30, 57], [170, 57]], [[30, 75], [170, 75]], [[30, 93], [170, 93]]] }),
      w(0, 'Open the paper. Weave a strip: over, under, over, under.'),
      w(1, 'The next strip goes under, over, under, over. Push it up close.'),
      w(4, 'Keep going until it is full. Glue the ends down.'),
      S('A woven mat! Baskets and cloth are made like this.', 'show', { item: mid(done), kind: 'glow' })
    ] };
  })();

  const feeder = (() => {
    const line = [[30, 110], [170, 40]], ring = circlePts(100, 80, 36, 40), cer = Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2; return K.circ(100 + 36 * Math.cos(a), 80 + 36 * Math.sin(a), 6, i % 2 ? C.tan : '#E8B86A', 1.2) + K.circ(100 + 36 * Math.cos(a), 80 + 36 * Math.sin(a), 2, '#FFF6E5', 0); }).join('');
    const ringSVG = K.line(ring, '#C8A2E8', 3) + cer;
    return { id: 'feeder', cat: 'thread', name: 'Cereal bird feeder', ico: '🐦', lv: 1, min: 10, mat: [['〰️', 'a pipe cleaner'], ['🥣', 'hoop cereal'], M.wool], steps: [
      S('Thread cereal hoops onto a pipe cleaner.', 'thread', { pts: line, beads: [C.tan, '#E8B86A', C.tan, '#E8B86A', C.tan, '#E8B86A', C.tan, '#E8B86A'], r: 6, sc: '#C8A2E8' }),
      S('Bend it into a circle and twist the ends together.', 'draw', { base: '', s: [ring], c: '#C8A2E8', w: 3, fill: cer, tool: 'finger' }),
      S('Tie on a string to hang it.', 'tie', { base: ringSVG + K.line([[100, 44], [100, 20]], C.red, 2), at: [100, 20] }),
      S('Hang it on a tree. Tweet tweet!', 'show', { item: mid(K.line([[100, 0], [100, 44]], C.red, 2) + ringSVG) + K.emo('🐦', 0, 4, 26), kind: 'float' })
    ] };
  })();

  /* --- recycled crafts --- */
  const planter = (() => {
    const bottom = K.rect(72, 80, 56, 55, 'rgba(142,197,245,.55)', 8);
    const painted = K.rect(72, 80, 56, 55, C.green, 8) + K.eyes(100, 102, 5, 20) + K.smile(100, 114, 8);
    const soil = K.rect(76, 80, 48, 10, '#6B4A2E', 3), sprout = K.line([[100, 82], [100, 56]], C.green, 3) + K.leaf(90, 58, 9, C.lime, -30) + K.leaf(110, 52, 9, C.lime, 30);
    return { id: 'planter', cat: 'recycle', name: 'Bottle planter', ico: '🪴', lv: 2, min: 25, mat: [['🍶', 'a plastic bottle'], ['🔪', 'scissors (a grown-up cuts)'], M.paint, M.brush, ['🪴', 'soil'], ['🌱', 'seeds (cress grows fast)']], safe: 'Cut plastic has sharp edges. A grown-up cuts the bottle and tapes the edge.', steps: [
      S('A grown-up cuts the bottle in half.', 'cut', { base: bottom, pts: [[70, 80], [130, 80]], piece: `<g>${K.bottle(100, 15, 56, 66)}</g>`, off: [30, -10] }),
      S('Paint a funny face on the bottom half.', 'paint', { base: bottom, area: painted, box: [70, 78, 60, 58], c: C.green }),
      S('Fill it with soil.', 'sprinkle', { base: painted, box: [76, 80, 48, 10], colors: ['#6B4A2E', '#8B5E3C', '#5A3D26'], n: 50 }),
      S('Push in some seeds and water them a little.', 'sprinkle', { base: painted + soil, box: [80, 80, 40, 6], colors: [C.yellow, C.tan], n: 12 }),
      S('Put it in the sun. Watch your plant grow!', 'show', { item: mid(painted + soil + sprout), kind: 'glow' })
    ] };
  })();

  const boxBot = (() => {
    const box = K.box(65, 60, 70, 60, C.card), silver = K.box(65, 60, 70, 60, '#C9D3DC'), head = K.box(78, 22, 44, 34, '#C9D3DC');
    const lids = K.circ(90, 38, 7, C.red) + K.circ(110, 38, 7, C.red) + K.circ(90, 38, 2.5, K.OL, 0) + K.circ(110, 38, 2.5, K.OL, 0) + K.circ(84, 80, 5, C.yellow) + K.circ(100, 80, 5, C.green) + K.circ(116, 80, 5, C.blue);
    const arms = K.rect(40, 66, 25, 12, C.card, 5) + K.rect(135, 66, 25, 12, C.card, 5), extra = K.line([[100, 22], [100, 8]], K.OL, 2) + K.circ(100, 6, 4, C.red) + K.line(K.zig(88, 112, 50, 3, 4), K.OL, 2) + K.line([[78, 100], [122, 100]], K.OL, 1.5) + K.line([[78, 106], [122, 106]], K.OL, 1.5);
    return { id: 'boxbot', cat: 'recycle', name: 'Box robot', ico: '🤖', lv: 2, min: 30, mat: [['📦', 'two small boxes'], ['🧻', 'two tubes for arms'], M.tape, M.paint, M.brush, ['🔴', 'bottle lids'], M.glue], steps: [
      S('Paint a box silver or grey.', 'paint', { base: box, area: silver, box: [65, 48, 86, 74], c: '#C9D3DC' }),
      S('Tape a smaller box on top for the head.', 'place', { base: silver, pieces: [{ svg: head, at: [100, 40], from: [0, -60] }] }),
      S('Glue on bottle lids for eyes and buttons.', 'place', { base: silver + head, pieces: [{ svg: lids, at: [100, 58], from: [0, -60] }] }),
      S('Tape on tube arms.', 'place', { base: silver + head + lids, pieces: [{ svg: arms, at: [100, 72], from: [0, 40] }] }),
      S('Draw a mouth, vents and an antenna.', 'draw', { base: silver + head + lids + arms, s: [[[100, 22], [100, 8]], K.zig(88, 112, 50, 3, 4), [[78, 100], [122, 100]], [[78, 106], [122, 106]]], fill: extra, tool: 'pen' }),
      S('Beep beep! I am Box Bot!', 'show', { item: mid(silver + head + lids + arms + extra), kind: 'wiggle' })
    ] };
  })();

  const car = (() => {
    const box = K.box(40, 60, 110, 45, C.card), win = [[90, 64], [135, 64], [135, 82], [90, 82], [90, 64]], hole = K.rect(90, 64, 45, 18, '#5A3D26', 1);
    const red = K.box(40, 60, 110, 45, C.red) + hole, wheels = K.wheel(65, 108, 13) + K.wheel(128, 108, 13), lights = K.circ(147, 74, 5, C.yellow) + K.line([[80, 66], [80, 100]], K.OL, 1.5) + K.rect(44, 66, 8, 6, C.orange, 1);
    return { id: 'boxcar', cat: 'recycle', name: 'Cardboard car', ico: '🚗', lv: 3, min: 40, mat: [['📦', 'a cardboard box'], ['🔪', 'scissors (a grown-up cuts)'], M.paint, M.brush, ['⚪', '4 paper plates or bottle lids'], M.glue, M.tape], safe: 'Cardboard is tough to cut. A grown-up does the cutting.', steps: [
      S('A grown-up cuts out a window.', 'cut', { base: box, pts: win, topEnd: hole }),
      S('Paint your car.', 'paint', { base: box + hole, area: red, box: [40, 48, 126, 58], c: C.red }),
      S('Glue on four wheels. You can see two from the side.', 'place', { base: red, pieces: [{ svg: K.wheel(65, 108, 13), at: [65, 108], from: [-40, 30] }, { svg: K.wheel(128, 108, 13), at: [128, 108], from: [40, 30] }] }),
      S('Add lights and a door.', 'draw', { base: red + wheels, s: [circlePts(147, 74, 5, 10), [[80, 66], [80, 100]], [[44, 66], [52, 66], [52, 72], [44, 72], [44, 66]]], fill: lights, tool: 'pen' }),
      S('Vroom vroom! Where will you drive?', 'show', { item: mid(red + wheels + lights), at: [100, 70], kind: 'drive' })
    ] };
  })();

  /* --- simple sewing --- */
  const lacing = (() => {
    const hp = heartPts(100, 72, 46, 40), holes = heartPts(100, 72, 40, 12).slice(0, 12), card = K.sheet(30, 15, 140, 120, '#fff');
    const cutH = K.poly(hp, C.yellow), lace = K.line(holes.concat([holes[0]]), C.red, 2.6, '7 5');
    return { id: 'lacing', cat: 'sew', name: 'Lacing card', ico: '🥾', lv: 2, min: 20, mat: [M.card, M.pencil, M.scissors, M.punch, ['👟', 'a shoelace (or wool with tape on the end)']], tip: 'Lacing is first sewing: in and out builds the finger skills for real needlework.', steps: [
      S('Draw a big heart on the card.', 'draw', { base: card, s: [hp], c: C.grey, tool: 'pen' }),
      S('Cut it out.', 'cut', { base: card, pts: hp, piece: cutH, off: [0, 0] }),
      S('Punch holes all around the edge.', 'punch', { base: cutH, holes }),
      S('Push the lace in and out, in and out, through the holes.', 'stitch', { base: cutH + holes.map(h => K.hole(h[0], h[1], 3.4)).join(''), pts: holes.concat([holes[0]]) }),
      S('Tie the ends in a bow.', 'tie', { base: cutH + holes.map(h => K.hole(h[0], h[1], 3.4)).join('') + lace, at: [100, 50] }),
      S('You sewed a heart!', 'show', { item: mid(cutH + holes.map(h => K.hole(h[0], h[1], 3.4)).join('') + lace), kind: 'bounce' })
    ] };
  })();

  const pillow = (() => {
    const hp = heartPts(100, 72, 44, 40), inner = heartPts(100, 72, 38, 40), felt = K.sheet(30, 15, 140, 120, C.pink), h1 = K.poly(hp, C.red), h2 = K.poly(hp, '#E0503F');
    const gap = inner.slice(0, 32), close = inner.slice(31).concat([inner[0]]);
    const puff = K.circ(116, 46, 7, '#fff', 1) + K.circ(124, 50, 6, '#fff', 1);
    const sewn = h2 + K.line(gap, C.yellow, 2, '6 4');
    return { id: 'pillow', cat: 'sew', name: 'Felt heart pillow', ico: '❤️', lv: 3, min: 40, mat: [M.felt, M.scissors, ['🪡', 'a big plastic needle'], ['🧵', 'thick thread'], ['☁️', 'stuffing or cotton wool']], tip: 'A blunt plastic needle and thick embroidery thread are easiest. Knot the thread to the needle so it cannot slip off.', steps: [
      S('Cut two hearts from felt.', 'cut', { base: felt, pts: hp, piece: h1, off: [0, 0] }),
      S('Put the two hearts together.', 'place', { base: h1, pieces: [{ svg: h2, at: [100, 72], from: [70, -10] }] }),
      S('Sew little stitches around the edge. Leave a gap!', 'stitch', { base: h2, pts: gap, c: C.yellow }),
      S('Push stuffing in through the gap.', 'place', { base: sewn, pieces: [{ svg: puff, at: [120, 48], from: [40, -40] }] }),
      S('Sew the gap closed and tie a knot.', 'stitch', { base: sewn, pts: close, c: C.yellow }),
      S('A soft, squishy heart pillow!', 'show', { item: mid(sewn + K.line(close, C.yellow, 2, '6 4')), kind: 'bounce' })
    ] };
  })();

  const buttonSew = (() => {
    const cloth = K.rect(30, 25, 140, 100, C.sky, 6) + K.line(K.wave(30, 170, 120, 1.5, 6), 'rgba(34,48,90,.25)', 1), btn = K.circ(100, 75, 22, C.yellow) + K.circ(100, 75, 17, 'none', 1);
    const h = [[92, 67], [108, 67], [108, 83], [92, 83]], dots = h.map(p => K.circ(p[0], p[1], 2.6, K.OL, 0)).join('');
    const x1 = K.line([h[0], h[2]], C.red, 2.6), x2 = K.line([h[1], h[3]], C.red, 2.6);
    return { id: 'button', cat: 'sew', name: 'Sew on a button', ico: '🔘', lv: 4, min: 20, mat: [['🧵', 'thread'], ['🪡', 'a sewing needle'], ['🔘', 'a big button'], ['🧣', 'a scrap of fabric'], M.scissors], tip: 'A real life skill! Sit close by while the needle is in use.', steps: [
      S('Thread the needle and tie a knot at the end of the thread.', 'stitch', { base: K.sheet(20, 40, 160, 70, '#FFF6E5'), pts: [[30, 75], [170, 75]] }),
      S('Hold the button where you want it.', 'place', { base: cloth, pieces: [{ svg: btn + dots, at: [100, 75], from: [60, -50] }] }),
      S('Push the needle up through one hole and down through the hole across.', 'stitch', { base: cloth + btn + dots, pts: [h[0], h[2]] }),
      S('Do it 4 times. Then sew the other two holes to make an X.', 'stitch', { base: cloth + btn + dots + x1, pts: [h[1], h[3], h[1], h[3]] }),
      S('Knot the thread at the back and snip it.', 'cut', { base: cloth + btn + dots + x1 + x2 + K.line([[120, 90], [150, 110]], C.red, 2), pts: [[140, 95], [140, 112]] }),
      S('Your button is on! You can mend clothes now.', 'show', { item: mid(cloth + btn + dots + x1 + x2), kind: 'glow' })
    ] };
  })();

  /* --- holiday & party --- */
  const lantern = (() => {
    const B = K.ori(C.red, '#F7A08F', [[30, 30], [170, 30], [170, 120], [30, 120]]);
    const s1 = B.fold('Fold the paper in half the long way.', { from: [100, 30], to: [100, 120] });
    B.shift(0, -20);
    const slits = [44, 58, 72, 86, 100, 114, 128, 142, 156].map(x => [[x, 55], [x, 90]]);
    const shape = [[72, 30], [128, 30], [142, 75], [128, 120], [72, 120], [58, 75]], lines = [78, 89, 100, 111, 122].map(x => K.line([[x, 32], [x + (x - 100) * 0.35, 75], [x, 118]], 'rgba(34,48,90,.5)', 1.3)).join('');
    const body = K.poly(shape, C.red) + lines + K.rect(72, 26, 56, 6, C.yellow, 1) + K.rect(72, 118, 56, 6, C.yellow, 1), handle = K.path('M76,28 Q100,-4 124,28', 'none', 0, `stroke="${C.yellow}" stroke-width="5"`);
    return { id: 'lantern', cat: 'party', name: 'Paper lantern', ico: '🏮', lv: 2, min: 20, mat: [M.color, M.scissors, M.glue, M.tape], steps: [
      s1,
      S('Cut lines from the fold. Stop before the edge!', 'cut', { base: B.svg(), cuts: slits }),
      S('Open it, roll it into a tube and glue the edges.', 'morph', { from: [{ p: [[30, 30], [170, 30], [170, 120], [30, 120]], c: C.red }], to: [{ p: shape, c: C.red }], topEnd: lines }),
      S('Glue on a paper strip handle.', 'place', { base: K.poly(shape, C.red) + lines, pieces: [{ svg: handle + K.rect(72, 26, 56, 6, C.yellow, 1) + K.rect(72, 118, 56, 6, C.yellow, 1), at: [100, 28], from: [0, -50] }] }),
      S('Hang up your lantern for the party!', 'show', { item: mid(body + handle), kind: 'float' })
    ] };
  })();

  const partyCrown = (() => {
    const band = K.rect(20, 55, 160, 50, C.yellow, 2), zig = K.zig(20, 180, 80, 25, 5), cutB = K.poly([[20, 105], ...zig, [180, 105]], C.yellow);
    const gems = [[36, 92, C.red], [68, 92, C.blue], [100, 92, C.green], [132, 92, C.purple], [164, 92, C.red]].map(([x, y, c]) => K.circ(x, y, 6, c)).join('') + K.zig(20, 180, 80, 25, 5).filter((_, i) => i % 2).map(p => K.circ(p[0], p[1] - 2, 3.5, C.pink)).join('');
    const ring = [...K.arc(100, 80, 70, 16, 180, 360, 20).map(([x, y], i) => [x, y - (i % 4 === 2 ? 22 : 0)]), ...K.arc(100, 105, 70, 16, 0, 180, 20)];
    return { id: 'crown', cat: 'party', name: 'Party crown', ico: '👑', lv: 1, min: 15, mat: [M.card, M.pencil, M.scissors, M.crayons, ['💎', 'stickers'], M.tape], steps: [
      S('Draw a zigzag along a long strip of card.', 'draw', { base: band, s: [zig], c: C.grey, tool: 'pen' }),
      S('Cut along the zigzag.', 'cut', { base: band, pts: zig }),
      S('Decorate it with stickers and jewels.', 'place', { base: cutB, pieces: [{ svg: gems, at: [100, 88], from: [0, -60] }] }),
      S('Wrap it round your head and tape it.', 'morph', { from: [{ p: [[20, 105], ...zig, [180, 105]], c: C.yellow }], to: [{ p: ring, c: C.yellow }] }),
      S('Happy birthday, your majesty!', 'show', { item: mid(cutB + gems), kind: 'wiggle' })
    ] };
  })();

  const wand = (() => {
    const sp = K.starPts(100, 60, 40, 5, 0.45), star = K.poly(sp, C.yellow), card = K.sheet(40, 10, 120, 105, '#fff'), glue = K.line(sp.concat([sp[0]]), '#B9D8F5', 4);
    const stick = K.rect(96, 96, 8, 50, C.purple, 3), rib = K.path('M100,96 Q80,110 86,130', 'none', 0, `stroke="${C.pink}" stroke-width="3"`) + K.path('M100,96 Q122,108 114,132', 'none', 0, `stroke="${C.sky}" stroke-width="3"`);
    const glit = K.starPts(100, 60, 30, 5, 0.45).map((p, i) => K.circ(p[0], p[1], 1.8, [C.pink, C.blue, C.purple][i % 3], 0)).join('');
    return { id: 'wand', cat: 'party', name: 'Star wand', ico: '🪄', lv: 1, min: 15, mat: [M.card, M.pencil, M.scissors, M.glue, ['✨', 'glitter or sequins'], ['🥢', 'a straw or stick'], M.tape, ['🎀', 'ribbon']], steps: [
      S('Draw a big star on card.', 'draw', { base: card, s: [sp.concat([sp[0]])], c: C.grey, tool: 'pen' }),
      S('Cut out the star.', 'cut', { base: card, pts: sp.concat([sp[0]]), piece: star, off: [0, 0] }),
      S('Draw glue lines and shake on glitter.', 'sprinkle', { base: star + glue, box: [70, 30, 60, 55], colors: [C.pink, C.blue, C.purple], n: 40 }),
      S('Tape a stick on the back and tie on ribbons.', 'place', { base: star + glit, pieces: [{ svg: stick, at: [100, 120], from: [0, 50] }, { svg: rib, at: [100, 112], from: [0, 40] }] }),
      S('Wave your magic wand! Abracadabra!', 'show', { item: mid(stick + rib + star + glit), kind: 'wiggle' })
    ] };
  })();

  /* --- science crafts --- */
  const heli = (() => {
    const strip = [[80, 15], [120, 15], [120, 140], [80, 140]], sheet = K.poly(strip, C.sky);
    const stem = [[80, 15], [120, 15], [120, 85], [108, 85], [108, 140], [92, 140], [92, 85], [80, 85]];
    const rotor = [[40, 30], [96, 30], [100, 36], [104, 30], [160, 30], [160, 40], [106, 40], [106, 135], [94, 135], [94, 40], [40, 40]];
    const clip = K.rect(94, 124, 12, 16, 'none', 3, `stroke="#8A96A3" stroke-width="2.5"`);
    return { id: 'heli', cat: 'science', name: 'Paper helicopter', ico: '🚁', lv: 2, min: 10, mat: [['📄', 'a strip of paper'], M.scissors, ['📎', 'a paper clip']], tip: 'Science question: does it spin the other way if you swap the wings? Drop two from up high and see.', steps: [
      S('Cut a line down the middle of the top half.', 'cut', { base: sheet, pts: [[100, 15], [100, 75]] }),
      S('Cut a little way in from each side, in the middle.', 'cut', { base: sheet + K.line([[100, 15], [100, 75]], K.OL, 1.6), cuts: [[[80, 85], [92, 85]], [[120, 85], [108, 85]]] }),
      S('Fold the sides in to make a thin stem.', 'morph', { from: [{ p: strip, c: C.sky }], to: [{ p: stem, c: C.sky }] }),
      S('Fold one wing forward and one wing back.', 'morph', { from: [{ p: stem, c: C.sky }], to: [{ p: rotor, c: C.sky }] }),
      S('Put a paper clip on the bottom.', 'place', { base: K.poly(rotor, C.sky), pieces: [{ svg: clip, at: [100, 132], from: [0, 40] }] }),
      S('Drop it from up high. It spins as it falls!', 'show', { item: mid(K.poly(rotor, C.sky) + clip), kind: 'fall', s: 0.6 })
    ] };
  })();

  const pinwheel = (() => {
    const sq = [[50, 25], [150, 25], [150, 125], [50, 125]], diag = [[[50, 25], [92, 67]], [[150, 25], [108, 67]], [[150, 125], [108, 83]], [[50, 125], [92, 83]]];
    const blades = [[[100, 75], [50, 25], [100, 25]], [[100, 75], [150, 25], [150, 75]], [[100, 75], [150, 125], [100, 125]], [[100, 75], [50, 125], [50, 75]]];
    const cols = [C.red, C.yellow, C.blue, C.green], wheel = blades.map((b, i) => K.poly(b, cols[i])).join('') + K.circ(100, 75, 4, C.white);
    const stick = K.rect(97, 75, 6, 70, C.brown, 2);
    return { id: 'pinwheel', cat: 'science', name: 'Pinwheel', ico: '🎡', lv: 3, min: 20, mat: [M.sq, M.pencil, M.scissors, ['📍', 'a pin (a grown-up does this)'], ['🥢', 'a pencil with an eraser, or a stick']], tip: 'Wind is moving air. Try blowing softly, then hard: which spins faster?', steps: [
      S('Draw lines from each corner toward the middle.', 'draw', { base: K.poly(sq, C.paper), s: diag, c: C.grey, tool: 'pen' }),
      S('Cut along each line. Stop before the middle!', 'cut', { base: K.poly(sq, C.paper), cuts: diag }),
      S('Bend every other corner into the middle.', 'morph', { from: [{ p: sq, c: C.paper }], to: blades.map((b, i) => ({ p: b, c: cols[i] })) }),
      S('A grown-up pushes a pin through the middle into a stick.', 'place', { base: wheel, pieces: [{ svg: stick, at: [100, 110], from: [0, 40] }, { svg: K.circ(100, 75, 3, C.grey), at: [100, 75], from: [0, -50] }] }),
      S('Blow on it. Whirr!', 'show', { item: K.g(wheel, -100, -75), at: [100, 70], kind: 'spin', speed: 1.4, base: K.rect(97, 72, 6, 78, C.brown, 2) })
    ] };
  })();

  const kaleido = (() => {
    const tube = K.circ(100, 75, 46, C.card) + K.circ(100, 75, 38, '#5A3D26'), tri = K.poly([[100, 44], [127, 92], [73, 92]], '#DDE5EC');
    const beads = [[96, 70, C.red], [104, 78, C.blue], [92, 84, C.yellow], [108, 86, C.green], [100, 62, C.pink]].map(([x, y, c]) => K.circ(x, y, 3.5, c, 1)).join('');
    const cap = K.circ(100, 75, 46, C.purple) + K.circ(100, 75, 8, '#5A3D26');
    const pat = Array.from({ length: 6 }, (_, i) => K.g(K.circ(0, -24, 8, C.red, 1) + K.circ(0, -40, 5, C.yellow, 1) + K.poly([[0, -10], [8, -18], [0, -28], [-8, -18]], C.blue, 1), 0, 0, 1, i * 60)).join('');
    return { id: 'kaleido', cat: 'science', name: 'Kaleidoscope', ico: '🔮', lv: 3, min: 40, mat: [['🧻', 'a kitchen roll tube'], ['🪞', 'shiny card or foil card'], M.scissors, M.tape, ['🫙', 'clear plastic (from packaging)'], ['📿', 'tiny beads'], M.paper], tip: 'Mirrors bounce light. Three mirrors make one bead look like many, in a circle.', steps: [
      S('Fold shiny card into a long triangle tube, shiny side in.', 'morph', { from: [{ p: [[40, 60], [160, 60], [160, 90], [40, 90]], c: '#DDE5EC' }], to: [{ p: [[100, 44], [127, 92], [73, 92]], c: '#DDE5EC' }] }),
      S('Slide the triangle into the tube.', 'place', { base: tube, pieces: [{ svg: tri, at: [100, 75], from: [0, -90] }] }),
      S('Tape clear plastic on one end and drop in tiny beads.', 'place', { base: tube + tri, pieces: [{ svg: beads, at: [100, 75], from: [0, -70] }] }),
      S('Cover the other end with a paper cap. Poke a peep hole.', 'place', { base: tube + tri + beads, pieces: [{ svg: cap, at: [100, 75], from: [0, -100] }] }),
      S('Look in and turn it slowly. Magic patterns!', 'show', { item: K.circ(0, 0, 54, '#22305A') + pat + K.circ(0, 0, 6, C.purple, 1), kind: 'spin', speed: 0.4 })
    ] };
  })();

  const strawRocket = (() => {
    const pic = K.poly([[100, 30], [114, 52], [114, 100], [86, 100], [86, 52]], C.red) + K.circ(100, 64, 6, C.sky) + K.poly([[86, 86], [74, 104], [86, 100]], C.yellow) + K.poly([[114, 86], [126, 104], [114, 100]], C.yellow);
    const tubeR = [[90, 30], [110, 30], [110, 120], [90, 120]];
    return { id: 'strawrocket', cat: 'science', name: 'Straw rocket', ico: '🚀', lv: 1, min: 10, mat: [M.paper, M.pencil, M.tape, ['🥤', 'a straw'], M.crayons], safe: 'Never aim it at people or animals.', steps: [
      S('Draw a little rocket and color it.', 'draw', { base: K.sheet(60, 20, 80, 95, '#fff'), s: [[[100, 30], [114, 52], [114, 100], [86, 100], [86, 52], [100, 30]], circlePts(100, 64, 6, 10)], fill: pic, tool: 'crayon', c: C.red }),
      S('Roll a strip of paper round a pencil and tape it. Slide the pencil out.', 'morph', { from: [{ p: [[40, 40], [160, 40], [160, 110], [40, 110]], c: C.paper }], to: [{ p: tubeR, c: C.paper }] }),
      S('Fold the top over and tape it shut.', 'place', { base: K.poly(tubeR, C.paper), pieces: [{ svg: K.rect(86, 28, 28, 10, 'rgba(142,197,245,.85)', 1), at: [100, 33], from: [0, -40] }] }),
      S('Tape your rocket picture onto the tube.', 'place', { base: K.poly(tubeR, C.paper), pieces: [{ svg: pic, at: [100, 70], from: [60, 0] }] }),
      S('Slide it on a straw and blow hard. Blast off!', 'show', { item: mid(pic) + K.rect(-3, 30, 6, 40, C.blue, 2), kind: 'up' })
    ] };
  })();

  /* --- string art & bracelets --- */
  const letter = (() => {
    const L = [[70, 25], [95, 25], [95, 105], [140, 105], [140, 128], [70, 128], [70, 25]], card = K.sheet(40, 15, 130, 120, '#fff'), cutL = K.poly(L, C.tan);
    const wrapV = Array.from({ length: 14 }, (_, i) => K.line([[68, 25 + 103 * (i + 0.2) / 14], [97, 25 + 103 * (i + 0.9) / 14]], C.purple, 3)).join('');
    const wrapH = Array.from({ length: 8 }, (_, i) => K.line([[95 + 45 * (i + 0.2) / 8, 103], [95 + 45 * (i + 0.9) / 8, 130]], C.purple, 3)).join('');
    return { id: 'yarnletter', cat: 'string', name: 'Wool-wrapped letter', ico: '🔤', lv: 2, min: 30, mat: [M.card, M.pencil, M.scissors, M.tape, ['🧶', 'wool']], tip: 'Use the first letter of your child\'s name. It looks lovely on a bedroom door.', steps: [
      S('Draw a big fat letter, like the first letter of your name.', 'draw', { base: card, s: [L], c: C.grey, tool: 'pen' }),
      S('Cut it out.', 'cut', { base: card, pts: L, piece: cutL, off: [0, 0] }),
      S('Tape the end of the wool to the back.', 'place', { base: cutL, pieces: [{ svg: K.rect(74, 30, 18, 8, 'rgba(142,197,245,.85)', 1), at: [83, 34], from: [-40, -30] }] }),
      S('Wrap the wool round and round. Cover it all!', 'wrap', { base: cutL, box: [70, 25, 25, 103], c: C.purple, n: 14 }),
      S('Wrap the bottom part too. Tape the end at the back.', 'wrap', { base: cutL + wrapV, box: [95, 105, 45, 23], c: C.purple, n: 6 }),
      S('Your very own letter!', 'show', { item: mid(cutL + wrapV + wrapH), kind: 'bounce' })
    ] };
  })();

  const braid = (() => {
    const cols = [C.red, C.yellow, C.blue], loop = Array.from({ length: 22 }, (_, i) => { const a = i / 22 * Math.PI * 2; return `<ellipse cx="${(42 * Math.cos(a)).toFixed(1)}" cy="${(30 * Math.sin(a)).toFixed(1)}" rx="7" ry="4.5" transform="rotate(${(a * 180 / Math.PI + (i % 2 ? 30 : -30)).toFixed(0)} ${(42 * Math.cos(a)).toFixed(1)} ${(30 * Math.sin(a)).toFixed(1)})" fill="${cols[i % 3]}" stroke="#22305A" stroke-width="1.1"/>`; }).join('');
    const knot = K.circ(100, 24, 5, C.red);
    return { id: 'braid', cat: 'string', name: 'Braided bracelet', ico: '🎗️', lv: 3, min: 20, mat: [['🧶', 'wool in 3 colors'], M.tape, M.scissors], tip: 'Say it out loud: "left over middle, right over middle". The rhythm helps.', steps: [
      S('Tie three strings together with a knot.', 'tie', { base: cols.map((c, i) => K.line([[100, 26], [80 + i * 20, 120]], c, 3)).join(''), at: [100, 24], c: C.red }),
      S('Tape the knot to the table.', 'place', { base: cols.map((c, i) => K.line([[100, 26], [80 + i * 20, 120]], c, 3)).join('') + knot, pieces: [{ svg: K.rect(86, 16, 28, 12, 'rgba(142,197,245,.85)', 1), at: [100, 22], from: [0, -40] }] }),
      S('Left string over the middle. Right string over the middle. Again and again!', 'braid', { at: [100, 20], colors: cols, n: 5 }),
      S('Keep going until it fits round your wrist.', 'braid', { at: [100, 20], colors: cols, n: 10 }),
      S('Tie a knot at the end. Tie it round your wrist.', 'tie', { base: K.g(loop, 100, 75), at: [100, 105], c: C.yellow }),
      S('A bracelet you made yourself!', 'show', { item: loop, kind: 'float' })
    ] };
  })();

  const friend = (() => {
    const cols = [C.pink, C.purple, C.teal, C.yellow];
    const loop = Array.from({ length: 20 }, (_, i) => { const a = i / 20 * Math.PI * 2, x = 44 * Math.cos(a), y = 30 * Math.sin(a); return K.g(K.poly([[-6, -4], [0, 0], [6, -4], [6, 2], [0, 6], [-6, 2]], cols[i % 4], 1), x, y, 1, a * 180 / Math.PI + 90); }).join('');
    const strings = cols.map((c, i) => K.line([[100, 26], [76 + i * 16, 125]], c, 3)).join('');
    return { id: 'friendship', cat: 'string', name: 'Friendship bracelet', ico: '🤝', lv: 4, min: 60, mat: [['🧵', 'embroidery thread in 4 colors'], M.tape, M.scissors], tip: 'Each knot is two half-knots on the same string. Patience: it grows a little each day.', steps: [
      S('Cut 4 long threads. Knot them together at the top.', 'tie', { base: strings, at: [100, 24], c: C.pink }),
      S('Make a 4 shape with the left thread over the next one. Loop it under and pull up. Do it twice.', 'braid', { mode: 'knot', at: [100, 20], colors: cols, n: 2 }),
      S('That thread knots across every string, to the right side.', 'braid', { mode: 'knot', at: [100, 20], colors: cols, n: 5 }),
      S('Start again with the new left thread. Stripes appear!', 'braid', { mode: 'knot', at: [100, 20], colors: cols, n: 11 }),
      S('Knot the end. Tie it on a friend\'s wrist.', 'tie', { base: K.g(loop, 100, 75), at: [100, 105], c: C.purple }),
      S('A bracelet to share with a friend!', 'show', { item: loop, kind: 'float' })
    ] };
  })();

  const stringArt = (() => {
    const pins = heartPts(100, 74, 46, 24).slice(0, 24), board = K.rect(30, 15, 140, 122, C.card, 4);
    const zig = []; for (let i = 0; i < 12; i++) zig.push(i, 23 - i);
    const cross = []; for (let i = 0; i < 24; i++) cross.push((i * 7) % 24);
    const round = Array.from({ length: 25 }, (_, i) => i % 24);
    const drawn = (order, c) => K.line(order.map(i => pins[i]), c, 1.3);
    const dots = pins.map(p => K.circ(p[0], p[1], 2.4, C.grey, 1)).join('');
    return { id: 'stringart', cat: 'string', name: 'String art heart', ico: '💝', lv: 4, min: 60, mat: [['🟫', 'a cork board or thick card'], ['📍', 'push pins (a grown-up helps)'], M.pencil, ['🧶', 'wool or embroidery thread']], tip: 'Cork board and push pins are safest. Show how to hold the pin by the head.', steps: [
      S('Draw a heart on the board.', 'draw', { base: board, s: [heartPts(100, 74, 46, 40)], c: C.grey, tool: 'pen' }),
      S('A grown-up helps push pins all around the heart.', 'punch', { base: board, holes: pins, r: 2.4 }),
      S('Tie the wool to one pin. Go across to another pin, round it, and back.', 'pins', { base: board, pins, order: zig, c: C.red }),
      S('Keep criss-crossing until the heart is full.', 'pins', { base: board + drawn(zig, C.red), pins, order: cross, c: C.pink }),
      S('Go round the outside edge, then tie it off.', 'pins', { base: board + drawn(zig, C.red) + drawn(cross, C.pink), pins, order: round, c: C.red }),
      S('Beautiful string art!', 'show', { item: mid(board + drawn(zig, C.red) + drawn(cross, C.pink) + drawn(round, C.red) + dots), kind: 'glow' })
    ] };
  })();

  craftsHome.add([leafPrint, rockBug, coneOwl, crownN, sockP, bagP, fingerP, necklace, weaveMat, feeder, planter, boxBot, car, lacing, pillow, buttonSew, lantern, partyCrown, wand, heli, pinwheel, kaleido, strawRocket, letter, braid, friend, stringArt]);
}/*}lazy*/);
