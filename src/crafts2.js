/* ---------- Crafts corner, part 2: paper folding, cutting, collage, plates, tubes, cards and clay ---------- */
// Each step is { t: what to do (read aloud), a: the kind of mini-movie, ...what it draws }. Drawings use the kit in
// crafts.js (viewBox 0 0 200 150). K.ori(...) folds a paper model step by step, so origami movies stay true to the paper.
craftsHome.later.push(() => {
  const K = craftsHome.kit, C = K.C;
  const S = (t, a, o = {}) => ({ t, a, ...o });
  const mid = svg => K.g(svg, -100, -75); // a finished picture drawn around the middle, for the "show" movie
  const M = {
    paper: ['📄', 'paper'], sq: ['🟦', 'square paper'], color: ['🌈', 'colored paper'], scissors: ['✂️', 'child scissors'], glue: ['🧴', 'glue stick'], tape: ['🩹', 'sticky tape'],
    crayons: ['🖍️', 'crayons'], pens: ['🖊️', 'felt pens'], pencil: ['✏️', 'pencil'], paint: ['🎨', 'paint'], brush: ['🖌️', 'paintbrush'], plate: ['🍽️', 'paper plate'],
    roll: ['🧻', 'toilet roll tube'], dough: ['🟠', 'playdough or clay'], eyes: ['👀', 'googly eyes (or draw them)'], wool: ['🧶', 'wool or string'], card: ['🟨', 'thin card'],
    punch: ['🕳️', 'hole punch'], cotton: ['☁️', 'cotton wool'], tissue: ['🎐', 'tissue paper'], news: ['📰', 'newspaper or big paper']
  };
  const circlePts = (cx, cy, r, n = 20) => K.arc(cx, cy, r, r, 0, 360, n);

  /* --- paper folding & origami --- */
  const fan = (() => {
    const B = K.ori(C.yellow, '#F2C04A', [[40, 35], [160, 35], [160, 115], [40, 115]]);
    const pleats = [92, 96, 100, 104, 108].map(x => K.line([[x, 35], [x, 115]], 'rgba(34,48,90,.4)', 1.2)).join('');
    const s2 = B.fold('Fold a thin strip over at the edge.', { from: [40, 75], to: [58, 75] });
    const s3 = Object.assign(B.morph('Turn it over and fold back. Over and back, like a zigzag!', [[[88, 35], [112, 35], [112, 115], [88, 115]]]), { topEnd: pleats });
    const folded = B.svg() + pleats, tapeP = K.rect(84, 98, 32, 10, 'rgba(142,197,245,.85)', 1);
    const fanSVG = K.poly([[0, 22], ...K.arc(0, 22, 58, 58, 200, 340, 12)], C.yellow) + K.arc(0, 22, 58, 58, 200, 340, 12).map(p => K.line([[0, 22], p], 'rgba(34,48,90,.35)', 1.1)).join('')
      + K.line(K.arc(0, 22, 44, 44, 203, 337, 16), C.red, 3) + K.line(K.arc(0, 22, 32, 32, 207, 333, 14), C.blue, 3) + K.rect(-7, 12, 14, 14, 'rgba(142,197,245,.9)', 2);
    return { id: 'fan', cat: 'fold', name: 'Paper fan', ico: '🪭', lv: 1, min: 10, mat: [M.color, M.crayons, M.tape], tip: 'Crisp folds make a better fan: run a fingernail along each fold.', steps: [
      S('Draw bright stripes on your paper.', 'draw', { base: K.sheet(40, 35, 120, 80, C.yellow), s: [{ p: K.wave(48, 152, 55, 4, 3), c: C.red }, { p: K.wave(48, 152, 75, 4, 3), c: C.blue }, { p: K.wave(48, 152, 95, 4, 3), c: C.green }], w: 3.5, guide: false }),
      s2, s3,
      S('Squeeze the bottom together and wrap tape round it.', 'place', { base: folded, pieces: [{ svg: tapeP, at: [100, 103], from: [0, -60] }] }),
      S('Open the top. Fan your face. Ahh, cool!', 'show', { item: fanSVG, at: [100, 70], kind: 'wiggle' })
    ] };
  })();

  const dog = (() => {
    const B = K.ori('#FFF6EA', '#C98A4B', [[100, 20], [155, 75], [100, 130], [45, 75]]);
    const s1 = B.fold('Fold the square in half to make a triangle.', { from: [100, 20], to: [100, 130] });
    B.shift(0, -15);
    const s2 = B.fold('Fold the side corners down to make floppy ears.', { from: [45, 60], to: [58, 88] }, { from: [155, 60], to: [142, 88] });
    const s3 = B.fold('Fold the bottom tip up a little.', { from: [100, 115], to: [100, 100] });
    const face = K.circ(88, 74, 4, C.black, 0) + K.circ(112, 74, 4, C.black, 0) + K.ell(100, 90, 7, 5, C.black, 0);
    return { id: 'dog', cat: 'fold', name: 'Origami dog face', ico: '🐶', lv: 1, min: 5, mat: [M.sq, M.pens], steps: [
      s1, s2, s3,
      S('Draw eyes and a nose. Woof!', 'draw', { base: B.svg(), tool: 'pen', s: [circlePts(88, 74, 4, 10), circlePts(112, 74, 4, 10), K.arc(100, 90, 7, 5, 0, 360, 12)], fill: face }),
      S('Your puppy is ready to play!', 'show', { item: mid(B.svg() + face + K.smile(100, 97, 6)), kind: 'wiggle' })
    ] };
  })();

  const plane = (() => {
    const B = K.ori('#DDF0FF', '#8EC5F5', [[60, 8], [140, 8], [140, 142], [60, 142]]);
    const s1 = S('Fold the paper in half the long way, then open it again.', 'draw', { base: B.svg(), s: [[[100, 8], [100, 142]]], c: C.purple, dash: '5 4', tool: 'finger' });
    const s2 = B.fold('Fold the top corners in to the middle line.', { from: [60, 8], to: [100, 48] }, { from: [140, 8], to: [100, 48] });
    const s3 = B.fold('Fold the slanted edges in to the middle again.', { from: [60, 48], to: [100, 64.6] }, { from: [140, 48], to: [100, 64.6] });
    const s4 = Object.assign(B.morph('Fold it in half, then fold each wing down.', [{ p: [[100, 10], [158, 124], [100, 108], [42, 124]], f: 1 }]), { topEnd: K.line([[100, 10], [100, 108]], 'rgba(34,48,90,.5)', 1.5) });
    const dart = K.poly([[34, 0], [-28, -24], [-16, 0], [-28, 24]], '#8EC5F5') + K.line([[34, 0], [-16, 0]], 'rgba(34,48,90,.5)', 1.4);
    return { id: 'plane', cat: 'fold', name: 'Paper airplane', ico: '✈️', lv: 2, min: 10, mat: [M.paper], safe: 'Throw it away from faces and windows.', steps: [
      s1, s2, s3, s4, S('Hold it underneath and throw it gently. Whoosh!', 'show', { item: dart, at: [100, 70], kind: 'fly' })
    ] };
  })();

  const cup = (() => {
    const B = K.ori('#E9F7EF', C.green, [[100, 25], [160, 85], [100, 145], [40, 85]]);
    const st = [
      B.fold('Fold the bottom corner up to the top. A triangle!', { from: [100, 145], to: [100, 25] }),
      B.fold('Fold the right corner across to touch the left side.', { from: [160, 85], to: [75.1, 49.9] }),
      B.fold('Fold the left corner across to the right side.', { from: [40, 85], to: [124.9, 49.9] }),
      B.fold('Fold the front top flap down.', { from: [100, 25], to: [100, 72], top: true }),
      B.flip('Turn it over.'),
      B.fold('Fold the other top flap down too.', { from: [100, 25], to: [100, 72], top: true })
    ];
    return { id: 'cup', cat: 'fold', name: 'Origami cup', ico: '🥤', lv: 2, min: 10, mat: [M.sq], tip: 'A paper cup holds water for a minute or two: try it over the sink!', steps: [
      ...st, S('Open the top gently. You made a cup!', 'show', { item: mid(B.svg()), kind: 'bounce' })
    ] };
  })();

  function hatSteps(B) {
    const s1 = B.fold('Fold the paper in half, top down to the bottom.', { from: [100, 5], to: [100, 145] });
    B.shift(0, -35);
    return [s1,
      B.fold('Fold the top corners down to the middle.', { line: [[100, 40], [30, 90]], at: [30, 40] }, { line: [[100, 40], [170, 90]], at: [170, 40] }),
      B.fold('Fold the bottom strip up, just the front one.', { from: [100, 110], to: [100, 70], top: true }),
      B.flip('Turn it over.'),
      B.fold('Fold the other strip up too.', { from: [100, 110], to: [100, 70], top: true })];
  }
  const hat = (() => {
    const B = K.ori('#F9D56E', '#F4C542', [[30, 5], [170, 5], [170, 145], [30, 145]]), st = hatSteps(B);
    return { id: 'hat', cat: 'fold', name: 'Paper hat', ico: '👒', lv: 2, min: 10, mat: [M.news, M.crayons], steps: [...st, S('Open the bottom and put it on your head!', 'show', { item: mid(B.svg()), kind: 'wiggle' })] };
  })();
  const boat = (() => {
    const B = K.ori('#DCEBFF', '#9DC4F2', [[30, 5], [170, 5], [170, 145], [30, 145]]), st = hatSteps(B);
    const s6 = B.morph('Open the bottom and squash it flat into a diamond.', [{ p: [[100, 20], [140, 75], [100, 130], [60, 75]], f: 0 }]);
    const s7 = B.morph('Fold the bottom points up, open again, then pull the top points apart. A boat!', [{ p: [[40, 80], [160, 80], [135, 110], [65, 110]], f: 1 }, { p: [[100, 25], [132, 80], [68, 80]], f: 0 }]);
    const water = K.line(K.wave(10, 190, 118, 3, 5), C.blue, 3);
    return { id: 'boat', cat: 'fold', name: 'Paper boat', ico: '⛵', lv: 3, min: 15, mat: [M.news], tip: 'Float it in the bath or a puddle. Waxed crayon on the bottom keeps it dry longer.', steps: [
      ...st, s6, s7, S('Float your boat!', 'show', { item: mid(B.svg()) + K.g(water, 0, 30), kind: 'float' })
    ] };
  })();

  const frog = (() => {
    const B = K.ori(C.green, '#7CC79A', [[60, 10], [140, 10], [140, 140], [60, 140]]);
    const s1 = S('Fold each top corner across to make an X, then open.', 'draw', { base: B.svg(), s: [[[60, 10], [140, 90]], [[140, 10], [60, 90]], [[60, 50], [140, 50]]], c: C.purple, dash: '5 4', tool: 'finger' });
    const s2 = B.morph('Push the sides in so the top folds into a triangle.', [{ p: [[60, 50], [140, 50], [140, 140], [60, 140]], f: 0 }, { p: [[60, 50], [100, 10], [140, 50]], f: 1 }]);
    const s3 = B.fold('Fold the triangle corners up to the top. Front legs!', { from: [60, 50], to: [100, 12], top: true }, { from: [140, 50], to: [100, 12], top: true });
    const s4 = B.morph('Fold the sides in to the middle.', L => L.map((l, i) => i === 0 ? { p: [[74, 50], [126, 50], [126, 140], [74, 140]], f: 0 } : l));
    const s5 = B.morph('Fold the bottom up, then fold half of it back down. That is the spring!', L => [{ p: [[74, 50], [126, 50], [126, 100], [74, 100]], f: 0 }, { p: [[74, 92], [126, 92], [126, 104], [74, 104]], f: 1 }, ...L.slice(1)]);
    const s6 = B.flip('Turn it over.');
    const eyes = K.eyes(100, 42, 6, 22);
    const frogSVG = K.ell(0, 10, 34, 22, C.green) + K.ell(-30, 24, 12, 7, C.green) + K.ell(30, 24, 12, 7, C.green) + K.circ(-13, -12, 9, C.green) + K.circ(13, -12, 9, C.green) + K.eyes(0, -13, 5, 26) + K.smile(0, 8, 12);
    return { id: 'frog', cat: 'fold', name: 'Jumping frog', ico: '🐸', lv: 3, min: 15, mat: [['🟩', 'a small card or thick paper'], M.pens], tip: 'An index card jumps best. Press its back edge and slide your finger off.', steps: [
      s1, s2, s3, s4, s5, s6,
      S('Draw big eyes. Press its back and let go. Hop!', 'place', { base: B.svg(), pieces: [{ svg: eyes, at: [100, 42], from: [0, -50] }] }),
      S('Hop, hop, hop! How far can it jump?', 'show', { item: frogSVG, at: [100, 92], kind: 'hop' })
    ] };
  })();

  const crane = (() => {
    const B = K.ori('#FFE3EC', '#F2607F', [[100, 15], [160, 75], [100, 135], [40, 75]]);
    const st = [
      B.fold('Fold the bottom corner up to the top.', { from: [100, 135], to: [100, 15] }),
      B.fold('Fold it in half again, left to right.', { from: [40, 75], to: [160, 75] }),
      B.morph('Open the top flap and squash it into a square. Turn over and do the same.', [{ p: [[100, 15], [140, 55], [100, 95], [60, 55]], f: 1 }, { p: [[100, 15], [140, 55], [100, 95], [60, 55]], f: 1 }]),
      B.fold('Fold the lower edges in to the middle line. A kite!', { from: [60, 55], to: [100, 38.4], top: true }, { from: [140, 55], to: [100, 38.4], top: true }),
      B.morph('Fold the top down, then lift the bottom point up and flatten it. Do the back too.', [{ p: [[100, 8], [116, 70], [100, 140], [84, 70]], f: 1 }]),
      B.morph('Fold the edges in to make the legs thin, on both sides.', [{ p: [[100, 8], [114, 72], [103, 140], [97, 140], [86, 72]], f: 1 }]),
      B.morph('Fold the legs up for a neck and a tail. Bend the head down and open the wings.', [
        { p: [[100, 88], [62, 18], [108, 62]], f: 0 }, { p: [[100, 88], [140, 20], [114, 64]], f: 0 },
        { p: [[84, 90], [48, 34], [54, 32], [76, 96]], f: 1 }, { p: [[118, 90], [150, 30], [158, 28], [166, 38], [158, 36], [128, 96]], f: 1 },
        { p: [[68, 96], [100, 80], [134, 96], [100, 108]], f: 1 }])
    ];
    return { id: 'crane', cat: 'fold', name: 'Origami crane', ico: '🕊️', lv: 4, min: 30, mat: [['🟥', 'thin square paper (15 cm)']], tip: 'The crane is a classic challenge. Fold slowly, crease hard, and expect the first one to look wobbly.', steps: [
      ...st, S('A paper crane! In Japan, cranes are a wish for good luck.', 'show', { item: mid(B.svg()), kind: 'float' })
    ] };
  })();

  /* --- paper cutting --- */
  const heart = (() => {
    const B = K.ori(C.pink, '#F9C5DC', [[50, 30], [150, 30], [150, 130], [50, 130]]);
    const s1 = B.fold('Fold the paper in half.', { from: [50, 80], to: [150, 80] });
    const half = [[100, 55], [108, 45], [122, 41], [136, 48], [141, 63], [134, 84], [118, 102], [100, 118]];
    return { id: 'heart', cat: 'cut', name: 'Cut-out heart', ico: '💖', lv: 1, min: 5, mat: [M.color, M.pencil, M.scissors], steps: [
      s1,
      S('Draw half a heart that starts and ends on the fold.', 'draw', { base: B.svg(), s: [half], c: C.grey, tool: 'pen' }),
      S('Cut along the line. Keep the paper folded!', 'cut', { base: B.svg(), pts: half }),
      S('Open it up. A whole heart! Both sides match.', 'show', { item: K.heart(0, 0, 38, C.pink) + K.line([[0, -15], [0, 34]], 'rgba(34,48,90,.25)', 1.2), kind: 'bounce' })
    ] };
  })();

  const snake = (() => {
    const sp = K.spiral(100, 75, 5, 50, 3, 90).reverse(), plate = K.circ(100, 75, 55, '#fff');
    const colored = K.circ(100, 75, 55, C.lime) + K.spiral(100, 75, 10, 50, 3, 90).filter((_, i) => i % 6 === 0).map(p => K.circ(p[0], p[1], 3, C.orange, 0)).join('');
    const helix = Array.from({ length: 91 }, (_, i) => { const k = i / 90, a = k * 6 * Math.PI; return [(34 - 26 * k) * Math.cos(a), -40 + k * 86 + 6 * Math.sin(a)]; });
    const item = K.line([[0, -72], [0, -44]], C.grey, 1.4) + K.line(helix, '#22305A', 9) + K.line(helix, C.lime, 6) + K.circ(0, -40, 7, C.lime) + K.eyes(0, -41, 2.4, 6);
    return { id: 'spiral', cat: 'cut', name: 'Spiral snake', ico: '🐍', lv: 1, min: 10, mat: [M.plate, M.crayons, M.scissors, M.wool], steps: [
      S('Draw a big spiral, round and round to the middle.', 'draw', { base: plate, s: [sp], c: C.grey, tool: 'pen' }),
      S('Color it like a snake: stripes and spots!', 'paint', { base: plate, area: colored + K.line(sp, 'rgba(34,48,90,.5)', 1.3), box: [45, 20, 110, 110], tool: 'crayon', c: C.lime }),
      S('Cut along the spiral line, all the way to the middle.', 'cut', { base: colored, pts: sp }),
      S('Draw eyes and a red tongue on the head.', 'draw', { base: colored + K.line(sp, K.OL, 1.5), s: [{ p: [[100, 75], [100, 86], [96, 91]], c: C.red }, { p: [[100, 86], [104, 91]], c: C.red }], fill: K.eyes(100, 70, 3, 9), tool: 'pen' }),
      S('Hang it on a string. It twirls!', 'show', { item, at: [100, 72], kind: 'wiggle' })
    ] };
  })();

  const chain = (() => {
    const B = K.ori('#FFFFFF', '#F2F2F2', [[20, 40], [180, 40], [180, 110], [20, 110]]);
    const s1 = B.morph('Fold the strip back and forth like a zigzag fan.', [[[78, 40], [122, 40], [122, 110], [78, 110]]]);
    const person = [[78, 66], [92, 64], ...K.arc(100, 54, 9, 9, 150, 390, 14), [108, 64], [122, 66], [122, 76], [108, 76], [110, 110], [101, 110], [100, 92], [99, 92], [98, 110], [90, 110], [92, 76], [78, 76]];
    const at = dx => person.map(([x, y]) => [x + dx, y]), cols = [C.red, C.blue, C.green, C.orange];
    const row = fill => [-66, -22, 22, 66].map((dx, i) => K.poly(at(dx), fill === 'c' ? cols[i] : '#fff', 1.4) + (fill === 'c' ? K.eyes(100 + dx, 53, 2, 6) + K.smile(100 + dx, 58, 3) : '')).join('');
    return { id: 'chain', cat: 'cut', name: 'Paper chain friends', ico: '🧑‍🤝‍🧑', lv: 2, min: 15, mat: [['📜', 'a long strip of paper'], M.pencil, M.scissors, M.crayons], tip: 'The hands must reach the folds, or the friends will not hold hands.', steps: [
      s1,
      S('Draw a person. The hands must touch both sides!', 'draw', { base: B.svg(), s: [person.concat([person[0]])], c: C.grey, tool: 'pen' }),
      S('Cut around the person. Do not cut the hands!', 'cut', { base: B.svg(), pts: person.concat([person[0]]) }),
      S('Open it up. A row of friends holding hands!', 'morph', { from: [{ p: person, c: '#fff' }], to: [-66, -22, 22, 66].map(dx => ({ p: at(dx), c: '#fff' })) }),
      S('Color your paper friends.', 'paint', { base: row(''), area: row('c'), box: [12, 40, 176, 72], tool: 'crayon', c: C.red }),
      S('Hello, friends!', 'show', { item: mid(row('c')), kind: 'bounce' })
    ] };
  })();

  const flake = (() => {
    const B = K.ori('#FFFFFF', '#E8F2FF', [[45, 20], [155, 20], [155, 130], [45, 130]]);
    const st = [
      B.fold('Fold the square corner to corner. A triangle!', { from: [155, 20], to: [45, 130] }),
      B.fold('Fold the triangle in half.', { from: [45, 20], to: [155, 130] }),
      B.fold('Fold it in half one more time.', { from: [45, 130], to: [155, 130] })
    ];
    const cuts = [[[100, 92], [110, 98], [100, 104]], [[114, 130], [120, 119], [126, 130]], [[121, 96], [119, 106], [131, 107]], [[138, 130], [140, 122], [146, 130]]];
    const f = K.starPts(0, 0, 54, 6, 0.55, -90), holes = Array.from({ length: 6 }, (_, i) => { const a = (i * 60 - 90) * Math.PI / 180; return K.poly(K.starPts(30 * Math.cos(a), 30 * Math.sin(a), 7, 3, 0.5, i * 60 + 90), '#DCEBFF', 1); }).join('');
    return { id: 'flake', cat: 'cut', name: 'Paper snowflake', ico: '❄️', lv: 3, min: 15, mat: [['⬜', 'thin white square paper'], M.scissors], tip: 'Thin paper is easier to cut through all the layers. No two snowflakes come out the same!', steps: [
      ...st,
      S('Cut little shapes out of the edges: triangles, curves and notches.', 'cut', { base: B.svg(), cuts }),
      S('Open it very slowly. A snowflake!', 'show', { item: K.poly(f, '#fff') + holes + K.circ(0, 0, 8, '#DCEBFF', 1), kind: 'float' })
    ] };
  })();

  /* --- collage & tearing --- */
  const rainbow = (() => {
    const sheet = K.sheet(20, 20, 160, 110, '#fff'), rs = [[66, C.red], [54, C.orange], [42, C.yellow], [30, C.green]];
    const glue = rs.map(([r]) => K.line(K.arc(100, 120, r, r, 180, 360, 30), '#B9D8F5', 6) + K.line(K.arc(100, 120, r, r, 180, 360, 30), '#fff', 4)).join('');
    const bits = (r, c) => K.arc(100, 120, r, r, 186, 354, 9).map((p, i) => K.poly([[p[0] - 5, p[1] - 4], [p[0] + 4, p[1] - 5], [p[0] + 5, p[1] + 4], [p[0] - 4, p[1] + 5]], c, 1)).join('');
    const pic = sheet + rs.map(([r, c]) => bits(r, c)).join('');
    const cloud = (x, y) => [[-8, 2, 8], [0, -4, 10], [9, 2, 8]].map(([a, b, r]) => K.circ(x + a, y + b, r, '#fff', 1.2)).join('');
    return { id: 'rainbow', cat: 'collage', name: 'Torn paper rainbow', ico: '🌈', lv: 1, min: 15, mat: [M.color, M.glue, M.paper, M.cotton], steps: [
      S('Tear colored paper into little pieces. Rip, rip!', 'tear', { box: [50, 45, 100, 60], c: C.red, n: 5 }),
      S('Draw rainbow stripes with glue.', 'draw', { base: sheet, s: rs.map(([r]) => K.arc(100, 120, r, r, 180, 360, 30)), tool: 'glue', w: 4 }),
      S('Stick on the pieces. One color for each stripe!', 'place', { base: sheet + glue, pieces: rs.map(([r, c], i) => ({ svg: bits(r, c), at: [100, 120 - r], from: [(i - 1.5) * 30, -70] })) }),
      S('Glue fluffy cotton clouds at the ends.', 'place', { base: pic, pieces: [{ svg: cloud(36, 118), at: [36, 118], from: [-30, -40] }, { svg: cloud(164, 118), at: [164, 118], from: [30, -40] }] }),
      S('A rainbow made by you!', 'show', { item: mid(pic + cloud(36, 118) + cloud(164, 118)), kind: 'bounce' })
    ] };
  })();

  const fish = (() => {
    const sheet = K.sheet(15, 15, 170, 120, '#fff'), body = K.arc(88, 75, 48, 32, 0, 360, 32), tail = [[132, 75], [165, 50], [165, 100], [132, 75]];
    const tiles = []; for (let x = 46; x <= 130; x += 11) for (let y = 48; y <= 102; y += 11) if (((x + 4.5 - 88) / 46) ** 2 + ((y + 4.5 - 75) / 30) ** 2 < 0.85) tiles.push([x, y]);
    const tc = x => [C.blue, C.teal, C.yellow, C.orange, C.purple][Math.floor((x - 46) / 22) % 5];
    const tset = k => tiles.filter(([x]) => Math.floor((x - 46) / 22) % 3 === k).map(([x, y]) => K.rect(x, y, 9, 9, tc(x), 1)).join('');
    const outline = sheet + K.line(body, K.OL, 1.8) + K.line(tail, K.OL, 1.8);
    const done = outline + tset(0) + tset(1) + tset(2) + K.poly(tail, C.orange);
    return { id: 'mosaic', cat: 'collage', name: 'Mosaic fish', ico: '🐠', lv: 2, min: 20, mat: [M.color, M.scissors, M.glue, M.pens], steps: [
      S('Cut strips of colored paper, then cut them into little squares.', 'cut', { base: K.sheet(40, 30, 120, 75, C.blue), cuts: [[[40, 55], [160, 55]], [[40, 80], [160, 80]], [[70, 30], [70, 105]], [[100, 30], [100, 105]], [[130, 30], [130, 105]]] }),
      S('Draw a big fish with a tail.', 'draw', { base: sheet, s: [body, tail], c: K.OL, tool: 'pen' }),
      S('Put glue inside the fish.', 'glue', { base: outline, dots: tiles.filter((_, i) => i % 3 === 0).map(([x, y]) => [x + 4.5, y + 4.5]) }),
      S('Stick the squares on, close together. That is a mosaic!', 'place', { base: outline, pieces: [0, 1, 2].map(k => ({ svg: tset(k), at: [88, 75], from: [k * 40 - 40, -80] })) }),
      S('Color the tail and add an eye and bubbles.', 'draw', { base: done, s: [circlePts(60, 68, 5, 12), circlePts(30, 50, 4, 10), circlePts(24, 36, 6, 12)], fill: K.eye(60, 68, 5), tool: 'pen' }),
      S('Blub blub! Your fish is swimming.', 'show', { item: mid(done + K.eye(60, 68, 5) + K.circ(30, 50, 4, 'none') + K.circ(24, 36, 6, 'none')), kind: 'float' })
    ] };
  })();

  const robot = (() => {
    const bg = K.sheet(20, 15, 160, 120, '#EAF4FF');
    const body = K.rect(75, 60, 50, 45, C.grey, 4), head = K.rect(82, 28, 36, 28, C.sky, 4), arms = K.rect(56, 64, 17, 9, C.orange, 3) + K.rect(127, 64, 17, 9, C.orange, 3);
    const legs = K.rect(80, 106, 12, 20, C.blue, 2) + K.rect(108, 106, 12, 20, C.blue, 2), bits = K.circ(92, 40, 5, '#fff') + K.circ(108, 40, 5, '#fff') + K.circ(92, 40, 2, K.OL, 0) + K.circ(108, 40, 2, K.OL, 0) + K.circ(90, 76, 4, C.red) + K.circ(100, 76, 4, C.yellow) + K.circ(110, 76, 4, C.green) + K.line([[100, 28], [100, 18]], K.OL, 2) + K.circ(100, 16, 3.5, C.red);
    const all = bg + body + head + arms + legs;
    return { id: 'robot', cat: 'collage', name: 'Shape robot collage', ico: '🤖', lv: 1, min: 15, mat: [M.color, M.scissors, M.glue, M.paper], steps: [
      S('Cut out squares, rectangles and circles.', 'cut', { base: K.sheet(30, 30, 140, 90, C.grey), pts: [[60, 45], [140, 45], [140, 105], [60, 105], [60, 45]], piece: K.rect(60, 45, 80, 60, C.grey, 2), off: [0, -20] }),
      S('Put glue dots where the robot goes.', 'glue', { base: bg, dots: [[100, 82], [100, 42], [64, 68], [136, 68], [86, 116], [114, 116]] }),
      S('Stick on a body, a head, arms and legs.', 'place', { base: bg, pieces: [{ svg: body, at: [100, 82], from: [0, -80] }, { svg: head, at: [100, 42], from: [-60, -40] }, { svg: arms, at: [100, 68], from: [60, -40] }, { svg: legs, at: [100, 116], from: [0, 40] }] }),
      S('Add circle eyes, buttons and an antenna.', 'place', { base: all, pieces: [{ svg: bits, at: [100, 50], from: [0, -60] }] }),
      S('Beep boop! Hello, robot!', 'show', { item: mid(all + bits), kind: 'wiggle' })
    ] };
  })();

  /* --- paper plate crafts --- */
  const yellowPlate = (c = C.yellow) => K.circ(100, 75, 45, c);
  const lion = (() => {
    const mane = Array.from({ length: 18 }, (_, i) => { const a = i * 20, r = a * Math.PI / 180; return K.g(K.rect(0, -4, 22, 8, i % 2 ? C.orange : '#E8702A', 2), 100 + 40 * Math.cos(r), 75 + 40 * Math.sin(r), 1, a); });
    const q = k => mane.filter((_, i) => Math.floor(i / 4.5) === k).join('');
    const face = K.eyes(100, 66, 5, 22) + K.poly([[93, 80], [107, 80], [100, 88]], C.brown) + K.path('M88,94 Q100,104 112,94', 'none', 2);
    const fsvg = mane.join('') + yellowPlate() + face;
    return { id: 'lion', cat: 'plate', name: 'Paper plate lion', ico: '🦁', lv: 1, min: 20, mat: [M.plate, ['🟨', 'yellow paint'], M.brush, ['🟧', 'orange paper'], M.glue, M.pens], steps: [
      S('Paint the plate yellow.', 'paint', { base: K.plate(100, 75, 45), area: yellowPlate(), box: [55, 30, 90, 90], c: C.yellow }),
      S('Tear orange paper into long strips.', 'tear', { box: [60, 45, 80, 50], c: C.orange, n: 6 }),
      S('Glue the strips all around the edge. A big mane!', 'place', { base: yellowPlate(), pieces: [0, 1, 2, 3].map(k => ({ svg: q(k), at: [100, 75], from: [[50, 50], [-50, 50], [-50, -50], [50, -50]][k] })) }),
      S('Draw eyes, a nose and a big smile.', 'draw', { base: mane.join('') + yellowPlate(), s: [circlePts(89, 66, 5, 10), circlePts(111, 66, 5, 10), [[93, 80], [107, 80], [100, 88], [93, 80]], [[88, 94], [100, 101], [112, 94]]], fill: face, tool: 'pen' }),
      S('Roar! Your lion is ready.', 'show', { item: mid(fsvg), kind: 'wiggle' })
    ] };
  })();

  const sun = (() => {
    const rays = Array.from({ length: 12 }, (_, i) => { const a = i * 30, r = a * Math.PI / 180; return K.g(K.poly([[0, -9], [24, 0], [0, 9]], i % 2 ? C.orange : C.yellow), 100 + 44 * Math.cos(r), 75 + 44 * Math.sin(r), 1, a); });
    const face = K.eyes(100, 68, 4.5, 22) + K.smile(100, 84, 12) + K.circ(82, 82, 4, C.pink, 0) + K.circ(118, 82, 4, C.pink, 0);
    return { id: 'sun', cat: 'plate', name: 'Sunshine plate', ico: '☀️', lv: 1, min: 15, mat: [M.plate, M.paint, M.brush, ['🟧', 'yellow and orange paper'], M.scissors, M.glue], steps: [
      S('Paint the plate a sunny yellow.', 'paint', { base: K.plate(100, 75, 45), area: yellowPlate(), box: [55, 30, 90, 90], c: C.yellow }),
      S('Cut triangles for sun rays.', 'cut', { base: K.sheet(30, 50, 140, 40, C.orange), pts: K.zig(30, 170, 90, 40, 6) }),
      S('Glue the rays all around the plate.', 'place', { base: yellowPlate(), pieces: [0, 1, 2].map(k => ({ svg: rays.filter((_, i) => i % 3 === k).join(''), at: [100, 75], from: [[60, 0], [-60, 20], [0, -60]][k] })) }),
      S('Draw a happy face.', 'draw', { base: rays.join('') + yellowPlate(), s: [circlePts(89, 68, 4.5, 10), circlePts(111, 68, 4.5, 10), [[88, 84], [100, 93], [112, 84]]], fill: face, tool: 'pen' }),
      S('Good morning, sunshine!', 'show', { item: mid(rays.join('') + yellowPlate() + face), kind: 'float' })
    ] };
  })();

  const bug = (() => {
    const red = yellowPlate(C.red), line = K.line([[100, 32], [100, 120]], K.OL, 3), head = K.path('M70,40 A30,22 0 0 1 130,40 Z', K.C.black);
    const spots = [[80, 62], [120, 62], [76, 92], [124, 92], [100, 104]].map(([x, y]) => K.circ(x, y, 7, C.black, 0)).join('');
    const eyes = K.circ(88, 33, 5, '#fff', 1) + K.circ(112, 33, 5, '#fff', 1) + K.circ(88, 33, 2, K.OL, 0) + K.circ(112, 33, 2, K.OL, 0);
    const all = red + line + head + spots + eyes;
    return { id: 'ladybug', cat: 'plate', name: 'Ladybug plate', ico: '🐞', lv: 1, min: 15, mat: [M.plate, ['🟥', 'red paint'], M.brush, ['⚫', 'black paper or pen'], M.glue], steps: [
      S('Paint the plate red.', 'paint', { base: K.plate(100, 75, 45), area: red, box: [55, 30, 90, 90], c: C.red }),
      S('Draw a line down the middle and a black head on top.', 'draw', { base: red, s: [[[100, 32], [100, 120]], K.arc(100, 40, 30, 22, 180, 360, 16)], c: C.black, w: 3, fill: head, tool: 'pen' }),
      S('Stick on round black spots.', 'place', { base: red + line + head, pieces: [{ svg: spots, at: [100, 80], from: [0, -70] }] }),
      S('Add two eyes.', 'place', { base: red + line + head + spots, pieces: [{ svg: eyes, at: [100, 33], from: [0, -50] }] }),
      S('Hello, little ladybug!', 'show', { item: mid(all), kind: 'wiggle' })
    ] };
  })();

  const mask = (() => {
    const holes = K.ell(83, 68, 10, 7, '#FFF6E5') + K.ell(117, 68, 10, 7, '#FFF6E5');
    const tiger = yellowPlate(C.orange) + [[-1, 40], [1, 40]].map(([s]) => [0, 1, 2].map(i => K.line([[100 + s * 45, 58 + i * 14], [100 + s * 28, 62 + i * 14]], C.black, 4)).join('')).join('') + K.poly([[94, 84], [106, 84], [100, 92]], C.pink) + K.smile(100, 96, 8);
    return { id: 'mask', cat: 'plate', name: 'Animal mask', ico: '🐯', lv: 2, min: 20, mat: [M.plate, M.scissors, M.paint, M.brush, M.punch, ['🧵', 'string or elastic']], tip: 'Hold the plate to the face and mark the eyes with a pencil before cutting.', steps: [
      S('Hold the plate to your face. A grown-up marks where your eyes go.', 'draw', { base: K.plate(100, 75, 45), s: [K.arc(83, 68, 10, 7, 0, 360, 16), K.arc(117, 68, 10, 7, 0, 360, 16)], c: C.grey, tool: 'pen' }),
      S('A grown-up cuts out the eye holes.', 'cut', { base: K.plate(100, 75, 45), cuts: [K.arc(83, 68, 10, 7, 0, 360, 16), K.arc(117, 68, 10, 7, 0, 360, 16)], topEnd: holes }),
      S('Paint your animal face. Stripes for a tiger!', 'paint', { base: K.plate(100, 75, 45), area: tiger, box: [55, 30, 90, 90], c: C.orange, top: holes }),
      S('Punch a hole on each side.', 'punch', { base: tiger + holes, holes: [[60, 70], [140, 70]] }),
      S('Tie string through the holes to go round your head.', 'draw', { base: tiger + holes + K.hole(60, 70) + K.hole(140, 70), s: [[[60, 70], [40, 50], [70, 22], [100, 15]], [[140, 70], [160, 50], [130, 22], [100, 15]]], c: C.red, tool: 'finger' }),
      S('Put it on. Grrr!', 'show', { item: mid(tiger + holes), kind: 'wiggle' })
    ] };
  })();

  /* --- toilet roll crafts --- */
  const binos = (() => {
    const tubes = (c, dx = 0) => K.tube(82 - dx, 40, 34, 70, c) + K.tube(118 + dx, 40, 34, 70, c);
    const green = tubes(C.green), tape = K.rect(88, 60, 24, 26, 'rgba(142,197,245,.85)', 1);
    const string = K.line(K.arc(100, 52, 37, 36, 180, 360, 20), C.red, 2.5);
    return { id: 'binos', cat: 'roll', name: 'Explorer binoculars', ico: '🔭', lv: 1, min: 15, mat: [['🧻', 'two toilet roll tubes'], M.tape, M.crayons, M.punch, M.wool], steps: [
      S('Color both tubes.', 'paint', { base: tubes(C.card), area: green, box: [60, 30, 80, 90], tool: 'crayon', c: C.green }),
      S('Hold them side by side and tape them together.', 'place', { base: '', pieces: [{ svg: K.tube(82, 40, 34, 70, C.green), at: [82, 75], from: [-50, 0] }, { svg: K.tube(118, 40, 34, 70, C.green), at: [118, 75], from: [50, 0] }, { svg: tape, at: [100, 73], from: [0, -60] }] }),
      S('Punch a hole near the top on each outside edge.', 'punch', { base: green + tape, holes: [[69, 52], [131, 52]] }),
      S('Tie on a string so they hang round your neck.', 'draw', { base: green + tape + K.hole(69, 52) + K.hole(131, 52), s: [K.arc(100, 52, 31, 36, 180, 360, 20)], c: C.red, w: 2.5, tool: 'finger' }),
      S('Look through them. What can you spy?', 'show', { item: mid(green + tape + string), kind: 'wiggle' })
    ] };
  })();

  const rocket = (() => {
    const red = K.tube(100, 50, 36, 70, C.red), cone = K.poly([[80, 50], [100, 14], [120, 50]], C.sky), fins = K.poly([[82, 95], [66, 124], [82, 120]], C.yellow) + K.poly([[118, 95], [134, 124], [118, 120]], C.yellow);
    const win = K.circ(100, 72, 8, C.sky), flames = K.path('M88,122 Q92,142 96,128 Q100,148 104,128 Q108,142 112,122 Z', C.orange);
    const all = flames + red + win + cone + fins;
    return { id: 'rocket', cat: 'roll', name: 'Tube rocket', ico: '🚀', lv: 2, min: 25, mat: [M.roll, M.paint, M.brush, M.card, M.scissors, M.glue, M.tissue], steps: [
      S('Paint the tube and let it dry.', 'paint', { base: K.tube(100, 50, 36, 70), area: red, box: [80, 40, 40, 85], c: C.red }),
      S('Cut out a circle, then cut a line to the middle.', 'cut', { base: K.sheet(50, 30, 100, 90, C.sky), cuts: [K.arc(100, 75, 36, 36, 0, 360, 30), [[100, 75], [136, 75]]] }),
      S('Roll the circle into a cone and glue it on top.', 'place', { base: red + win, pieces: [{ svg: cone, at: [100, 35], from: [0, -60] }] }),
      S('Cut two fins and glue them on the bottom.', 'place', { base: red + win + cone, pieces: [{ svg: fins, at: [100, 110], from: [0, 40] }] }),
      S('Push in tissue paper flames.', 'place', { base: red + win + cone + fins, pieces: [{ svg: flames, at: [100, 130], from: [0, 30] }] }),
      S('3, 2, 1... blast off!', 'show', { item: mid(all), kind: 'up' })
    ] };
  })();

  const owl = (() => {
    const tube = [[80, 40], [120, 40], [120, 120], [80, 120]], eared = [[80, 30], [90, 44], [110, 44], [120, 30], [120, 120], [80, 120]];
    const brown = K.poly(eared, '#9A6A3E'), eyes = K.circ(91, 60, 8, '#fff') + K.circ(109, 60, 8, '#fff') + K.circ(91, 60, 3.5, K.OL, 0) + K.circ(109, 60, 3.5, K.OL, 0) + K.poly([[96, 70], [104, 70], [100, 78]], C.orange);
    const wings = K.ell(78, 92, 7, 18, '#7A4E2A') + K.ell(122, 92, 7, 18, '#7A4E2A'), belly = [0, 1, 2].map(i => K.path(`M${92 + i * 0},${88 + i * 8} q4,5 8,0 q4,5 8,0`, 'none', 1.4)).join('');
    return { id: 'tubeowl', cat: 'roll', name: 'Tube owl', ico: '🦉', lv: 1, min: 15, mat: [M.roll, M.paint, M.brush, M.paper, M.glue], steps: [
      S('Push the top of the tube down on both sides. Pointy ears!', 'morph', { from: [{ p: tube, c: C.card }], to: [{ p: eared, c: C.card }] }),
      S('Paint it brown.', 'paint', { base: K.poly(eared, C.card), area: brown, box: [78, 28, 44, 94], c: '#9A6A3E' }),
      S('Glue on big round eyes and a little beak.', 'place', { base: brown, pieces: [{ svg: eyes, at: [100, 64], from: [0, -60] }] }),
      S('Add wings on the sides and draw feathers.', 'place', { base: brown + eyes, pieces: [{ svg: wings, at: [100, 92], from: [0, 40] }, { svg: belly, at: [100, 96], from: [0, 30] }] }),
      S('Hoo hoo! A wise little owl.', 'show', { item: mid(brown + eyes + wings + belly), kind: 'wiggle' })
    ] };
  })();

  /* --- cards & gifts --- */
  const handPrint = (c, x, y, s = 1) => K.g(K.ell(0, 8, 15, 16, c, 1.2) + [[-12, -14, -12], [-4, -20, -4], [4, -20, 4], [12, -15, 14]].map(([fx, fy, r]) => K.g(K.rect(-3.5, -14, 7, 22, c, 3.5), fx, fy + 10, 1, r)).join('') + K.g(K.rect(-3.5, -12, 7, 18, c, 3.5), 18, 10, 1, 55), x, y, s);
  const handCard = (() => {
    const B = K.ori('#FFFFFF', '#FFF2D9', [[30, 30], [170, 30], [170, 130], [30, 130]]);
    const s1 = B.fold('Fold a piece of card in half.', { from: [30, 80], to: [170, 80] });
    const cardSVG = B.svg(), print = handPrint(C.blue, 135, 85, 0.95), deco = K.circ(129, 74, 2.5, K.OL, 0) + K.poly([[118, 76], [110, 79], [118, 82]], C.orange) + K.line([[128, 100], [126, 112]], C.orange, 2) + K.line([[138, 100], [140, 112]], C.orange, 2);
    return { id: 'handcard', cat: 'cards', name: 'Handprint card', ico: '🖐️', lv: 1, min: 15, mat: [M.card, M.paint, M.brush, M.pens], tip: 'Washable paint and a wet cloth nearby make this a happy craft.', steps: [
      s1,
      S('Paint your palm and fingers. It tickles!', 'paint', { base: handPrint('#F6D3B3', 100, 80, 1.6), area: handPrint(C.blue, 100, 80, 1.6), box: [62, 30, 82, 90], c: C.blue }),
      S('Press your hand flat on the card, then lift it up.', 'stamp', { base: cardSVG, at: [135, 85], item: K.emo('✋', 0, 0, 44), print }),
      S('Turn it into a bird, a tree or a monster with pens!', 'draw', { base: cardSVG + print, s: [circlePts(129, 74, 2.5, 8), [[118, 76], [110, 79], [118, 82]], [[128, 100], [126, 112]], [[138, 100], [140, 112]]], fill: deco, tool: 'pen' }),
      S('Write a message inside: I love you!', 'draw', { base: K.sheet(30, 30, 140, 100, '#FFF2D9') + K.line([[100, 30], [100, 130]], 'rgba(34,48,90,.3)', 1.2, '3 3'), s: [K.wave(110, 160, 60, 3, 3), K.wave(110, 150, 76, 3, 3), K.wave(110, 140, 92, 3, 2)], c: C.red, tool: 'pen', guide: false }),
      S('Give it to someone you love.', 'show', { item: mid(cardSVG + print + deco), kind: 'bounce' })
    ] };
  })();

  const popup = (() => {
    const flat = [[40, 50], [160, 50], [160, 110], [40, 110]];
    const open = [{ p: [[40, 20], [160, 20], [160, 75], [40, 75]], c: '#FFFDF7' }, { p: [[40, 75], [160, 75], [178, 130], [22, 130]], c: '#FFF2D9' }, { p: [[85, 58], [115, 58], [115, 75], [85, 75]], c: '#FFE3EC' }];
    const openSVG = open.map(o => K.poly(o.p, o.c, 1.4)).join(''), pic = K.heart(100, 52, 14, C.red);
    return { id: 'popup', cat: 'cards', name: 'Pop-up card', ico: '💌', lv: 2, min: 20, mat: [M.card, M.scissors, M.glue, M.crayons], steps: [
      S('Fold the card in half.', 'morph', { from: [{ p: [[40, 20], [160, 20], [160, 130], [40, 130]], c: '#FFFDF7' }], to: [{ p: flat, c: '#FFFDF7' }] }),
      S('Cut two short lines from the fold, side by side.', 'cut', { base: K.poly(flat, '#FFFDF7'), cuts: [[[85, 50], [85, 70]], [[115, 50], [115, 70]]] }),
      S('Fold the flap in, open the card and push the flap through. Pop!', 'morph', { from: [{ p: flat, c: '#FFFDF7' }], to: open }),
      S('Glue a picture on the front of the step.', 'place', { base: openSVG, pieces: [{ svg: pic, at: [100, 52], from: [0, -50] }] }),
      S('Decorate it and write a message.', 'draw', { base: openSVG + pic, s: [K.wave(50, 90, 32, 2, 2), K.wave(110, 150, 32, 2, 2), K.wave(50, 150, 110, 2, 5)], c: C.purple, tool: 'pen', guide: false }),
      S('Open it and it pops up!', 'show', { item: mid(openSVG + pic + K.line(K.wave(50, 150, 110, 2, 5), C.purple, 2)), kind: 'bounce' })
    ] };
  })();

  const monster = (() => {
    const B = K.ori(C.green, '#7CC79A', [[50, 25], [150, 25], [150, 125], [50, 125]]);
    const s1 = B.fold('Fold the square corner to corner. A triangle!', { from: [150, 25], to: [50, 125] });
    const s2 = B.morph('Fold the two side corners up to the top to make a square.', [{ p: [[50, 25], [100, 75], [50, 125]], f: 0 }, { p: [[50, 25], [150, 125], [50, 125]], f: 0 }, { p: [[50, 75], [100, 75], [50, 125]], f: 1 }]);
    const s3 = B.morph('Unfold them, and tuck the top flap into the pocket. A corner!', [{ p: [[50, 25], [150, 125], [50, 125]], f: 0 }, { p: [[50, 60], [115, 125], [50, 125]], f: 1 }]);
    const face = K.eyes(72, 82, 7, 22) + K.poly([[60, 100], [66, 108], [72, 100], [78, 108], [84, 100]], '#fff', 1.2);
    return { id: 'bookmark', cat: 'cards', name: 'Monster bookmark', ico: '👾', lv: 2, min: 15, mat: [M.sq, M.glue, M.pens, ['⬜', 'white paper scraps']], tip: 'A corner bookmark slips over the page corner, so it never falls out.', steps: [
      s1, s2, s3,
      S('Draw two big eyes.', 'draw', { base: B.svg(), s: [circlePts(61, 82, 7, 12), circlePts(83, 82, 7, 12)], fill: K.eyes(72, 82, 7, 22), tool: 'pen' }),
      S('Glue on white zigzag teeth.', 'place', { base: B.svg() + K.eyes(72, 82, 7, 22), pieces: [{ svg: K.poly([[60, 100], [66, 108], [72, 100], [78, 108], [84, 100]], '#fff', 1.2), at: [72, 104], from: [0, 40] }] }),
      S('Chomp! It eats the corner of your page.', 'show', { item: mid(K.sheet(40, 15, 130, 120, '#fff') + [40, 55, 70].map(y => K.line([[100, y], [160, y]], 'rgba(34,48,90,.2)', 2)).join('') + B.svg() + face), kind: 'wiggle' })
    ] };
  })();

  /* --- playdough & clay --- */
  const clayDone = (c, cx = 100, cy = 85, rx = 68, ry = 8.4) => K.ell(cx, cy, rx, ry, c);
  const snakeClay = (() => {
    const body = clayDone(C.green), tongue = K.line([[168, 85], [178, 85], [184, 80]], C.red, 2) + K.line([[178, 85], [184, 90]], C.red, 2);
    const eyes = K.circ(158, 82, 1.8, K.OL, 0) + K.circ(158, 88, 1.8, K.OL, 0);
    const wavy = K.wave(-66, 60, 0, 8, 1.5);
    const item = K.line(wavy, K.OL, 13) + K.line(wavy, C.green, 10) + K.circ(66, -2, 9, C.green) + K.circ(68, -5, 2, K.OL, 0) + K.line([[75, 0], [84, 0], [89, -4]], C.red, 2) + K.line([[84, 0], [89, 4]], C.red, 2);
    return { id: 'claysnake', cat: 'clay', name: 'Playdough snake', ico: '🐍', lv: 1, min: 5, mat: [M.dough, M.pencil], steps: [
      S('Squish a lump of playdough into a ball.', 'clay', { mode: 'ball', c: C.green }),
      S('Roll it back and forth into a long sausage.', 'clay', { mode: 'snake', c: C.green }),
      S('Make a little red tongue and press it on.', 'place', { base: body, pieces: [{ svg: tongue, at: [176, 85], from: [20, -40] }] }),
      S('Poke two eyes with a pencil. Hiss!', 'draw', { base: body + tongue, s: [circlePts(158, 82, 1.8, 6), circlePts(158, 88, 1.8, 6)], fill: eyes, tool: 'pen' }),
      S('Make it wiggle!', 'show', { item, at: [96, 80], kind: 'wiggle' })
    ] };
  })();

  const coilSVG = (cx, cy, r, c) => { const sp = K.spiral(cx, cy, 2, r * 1.15, 2.4, 70); return K.line(sp, K.OL, r * 0.5 + 3) + K.line(sp, c, r * 0.5); };
  const snail = (() => {
    const shell = coilSVG(110, 72, 26, C.orange), body = K.ell(95, 110, 50, 7, C.green), feel = K.line([[52, 106], [44, 86]], K.OL, 2) + K.line([[58, 106], [56, 84]], K.OL, 2) + K.circ(44, 85, 3, K.OL, 0) + K.circ(56, 83, 3, K.OL, 0);
    return { id: 'snail', cat: 'clay', name: 'Playdough snail', ico: '🐌', lv: 1, min: 10, mat: [['🟠', 'playdough in two colors']], steps: [
      S('Roll a long sausage.', 'clay', { mode: 'snake', c: C.orange }),
      S('Roll it up into a swirl. That is the shell!', 'clay', { mode: 'coil', c: C.orange, at: [110, 72], r: 26 }),
      S('Roll a fat little sausage for the body.', 'clay', { mode: 'snake', c: C.green, at: [95, 110], r: 14 }),
      S('Put the shell on the body.', 'place', { base: body, pieces: [{ svg: shell, at: [110, 72], from: [0, -60] }] }),
      S('Add two feelers with eyes.', 'place', { base: body + shell, pieces: [{ svg: feel, at: [50, 96], from: [-30, -30] }] }),
      S('Slowly, slowly... hello, snail!', 'show', { item: mid(body + shell + feel), kind: 'float' })
    ] };
  })();

  K.bowl = (cx, cy, r, c) => { const top = r * 0.35; return K.path(`M${cx - r},${cy} A${r},${r} 0 0 0 ${cx + r},${cy} A${r},${top} 0 0 0 ${cx - r},${cy}Z`, c) + K.ell(cx, cy, r * 0.78, top * 0.7, 'rgba(0,0,0,.22)', 0); };
  const pot = (() => {
    const plain = K.bowl(100, 85, 30, C.tan), painted = K.bowl(100, 85, 30, C.blue) + K.line(K.wave(72, 128, 100, 3, 3), C.yellow, 3);
    return { id: 'pinchpot', cat: 'clay', name: 'Pinch pot bowl', ico: '🥣', lv: 2, min: 20, mat: [['🟤', 'air-dry clay or playdough'], ['💧', 'a little water'], M.paint, M.brush], tip: 'Air-dry clay takes a day or two to dry before painting.', steps: [
      S('Roll the clay into a smooth ball.', 'clay', { mode: 'ball', c: C.tan, r: 30 }),
      S('Push your thumb into the middle.', 'clay', { mode: 'pinch', c: C.tan, r: 30 }),
      S('Pinch and turn, pinch and turn, to make the sides thin.', 'draw', { base: plain, s: [K.arc(100, 85, 26, 9, 180, 540, 30)], tool: 'finger', c: 'rgba(255,255,255,.8)', w: 3 }),
      S('Smooth it with a wet finger. Let it dry.', 'draw', { base: plain, s: [K.arc(100, 88, 30, 18, 20, 160, 20)], tool: 'finger', c: 'rgba(255,255,255,.7)', w: 4 }),
      S('Paint your bowl!', 'paint', { base: plain, area: painted, box: [70, 70, 60, 46], c: C.blue }),
      S('A bowl for your treasures!', 'show', { item: mid(painted), kind: 'bounce' })
    ] };
  })();

  const hog = (() => {
    const body = K.poly([[116, 86], [138, 95], [116, 104]], C.brown) + K.circ(100, 95, 20, C.brown), spikes = k => Array.from({ length: 6 }, (_, i) => { const a = (200 + (k * 6 + i) * 8.5) * Math.PI / 180; return K.line([[100 + 18 * Math.cos(a), 95 + 18 * Math.sin(a)], [100 + 30 * Math.cos(a), 95 + 30 * Math.sin(a)]], '#E7D3A4', 3); }).join('');
    const face = K.circ(110, 88, 2.4, K.OL, 0) + K.circ(137, 95, 3, K.OL, 0);
    const all = spikes(0) + spikes(1) + spikes(2) + body + face;
    return { id: 'hedgehog', cat: 'clay', name: 'Spiky hedgehog', ico: '🦔', lv: 2, min: 15, mat: [M.dough, ['🍝', 'short dry pasta pieces']], steps: [
      S('Roll a brown ball.', 'clay', { mode: 'ball', c: C.brown, at: [100, 95] }),
      S('Pinch and pull out a pointy nose.', 'clay', { mode: 'squeeze', c: C.brown, at: [100, 95] }),
      S('Push pasta spikes into its back. Ouch, prickly!', 'place', { base: body, pieces: [0, 1, 2].map(k => ({ svg: spikes(k), at: [100, 70], from: [[-40, -30], [0, -50], [40, -30]][k] })) }),
      S('Add eyes and a black nose.', 'place', { base: spikes(0) + spikes(1) + spikes(2) + body, pieces: [{ svg: face, at: [118, 90], from: [30, -30] }] }),
      S('Sniff sniff! A happy hedgehog.', 'show', { item: mid(all), kind: 'wiggle' })
    ] };
  })();

  craftsHome.add([fan, dog, plane, cup, hat, boat, frog, crane, heart, snake, chain, flake, rainbow, fish, robot, lion, sun, bug, mask, binos, rocket, owl, handCard, popup, monster, snakeClay, snail, pot, hog]);
});
