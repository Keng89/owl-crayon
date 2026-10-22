/* ---------- Crafts corner, part 4 (round 2): painting, beads, costumes, sensory play, building, gifts, seasons, more origami ---------- */
// Same step format as crafts2.js. New movie kinds from crafts.js used here: dab (sponge, finger, stamp, dropper, cork
// or straw prints, spread: true for watercolor), pour (a jug tips and the level rises; grain: true for beans, rice or
// sand), stir, stack (pieces drop and land), knot, measure (a ruler and pencil marks), launch (spoon catapult) and oven.
(() => {
  const K = craftsHome.kit, C = K.C;
  const S = (t, a, o = {}) => ({ t, a, ...o });
  const mid = svg => K.g(svg, -100, -75);
  const M = {
    paper: ['📄', 'paper'], sq: ['🟦', 'square paper'], color: ['🌈', 'colored paper'], scissors: ['✂️', 'child scissors'], glue: ['🧴', 'glue stick'], pva: ['🧴', 'white glue (PVA)'],
    tape: ['🩹', 'sticky tape'], crayons: ['🖍️', 'crayons'], pens: ['🖊️', 'felt pens'], pencil: ['✏️', 'pencil'], paint: ['🎨', 'paint'], brush: ['🖌️', 'paintbrush'],
    plate: ['🍽️', 'paper plate'], roll: ['🧻', 'toilet roll tube'], wool: ['🧶', 'wool or string'], card: ['🟨', 'thin card'], punch: ['🕳️', 'hole punch'], felt: ['🟥', 'felt'],
    eyes: ['👀', 'googly eyes (or draw them)'], ruler: ['📏', 'a ruler'], pipe: ['〰️', 'a pipe cleaner'], sticks: ['🪵', 'craft sticks'], ribbon: ['🎀', 'ribbon'], tissue: ['🎐', 'tissue paper'],
    bowl: ['🥣', 'a big bowl and a spoon'], news: ['📰', 'newspaper']
  };
  const circlePts = (cx, cy, r, n = 20) => K.arc(cx, cy, r, r, 0, 360, n);
  const heartPts = (cx, cy, s, n = 40) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n * Math.PI * 2;
    return [cx + s * Math.pow(Math.sin(t), 3), cy - s * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16]; });
  const ring = (cx, cy, r, n, c, i0 = 0) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return [cx + r * Math.cos(a), cy + r * Math.sin(a), Array.isArray(c) ? c[(i + i0) % c.length] : c]; });
  const tapeP = (x, y, w = 26, h = 9) => K.rect(x - w / 2, y - h / 2, w, h, 'rgba(142,197,245,.85)', 1);
  const sheet = (c = '#fff') => K.sheet(20, 15, 160, 115, c);
  const done = s => K.still(s); // a finished step, as a picture for the next one
  // a see-through mixing bowl that pour and stir share (stir draws its own bowl at the same spot)
  const BOWL = { base: K.ell(100, 84, 42, 12, '#E3EEF8'), top: `<path d="M58,84 A42,40 0 0 0 142,84" fill="rgba(142,197,245,.3)" stroke="#22305A" stroke-width="1.6"/>` + K.ell(100, 84, 42, 12, 'none', 1.6), clip: 'M58,84 A42,40 0 0 0 142,84 Z', box: [58, 84, 84, 40] };
  const pourBowl = (t, o) => S(t, 'pour', { base: BOWL.base + (o.base || ''), top: BOWL.top, clip: BOWL.clip, box: BOWL.box, ...o });
  const stick = (x, y, r = 0, len = 100, c = C.tan) => K.g(K.rect(-len / 2, -5, len, 10, c, 5), x, y, 1, r);
  const cupSVG = (x, y, c = C.red) => K.poly([[x - 13, y], [x + 13, y], [x + 9, y - 24], [x - 9, y - 24]], c) + K.rect(x - 14, y - 3, 28, 4, '#fff', 1);

  /* ================= painting crafts ================= */
  const spongeFlowers = (() => {
    const f1 = ring(66, 58, 15, 5, C.pink), f2 = ring(134, 66, 15, 5, C.purple), f3 = ring(98, 98, 13, 5, C.orange);
    const centers = [[66, 58, C.yellow], [134, 66, C.yellow], [98, 98, C.yellow]];
    const d1 = { a: 'dab', pts: f1, shape: 'sq', r: 8 }, d2 = { a: 'dab', pts: [...f2, ...f3, ...centers], shape: 'sq', r: 8 };
    const prints = done(d1) + done(d2);
    const stems = [[[66, 66], [70, 128]], [[134, 74], [130, 128]], [[98, 106], [100, 128]]];
    const leaves = K.leaf(80, 112, 8, C.green, -30) + K.leaf(120, 108, 8, C.green, 30);
    const pic = sheet() + stems.map(p => K.line(p, C.green, 3.5)).join('') + leaves + prints;
    return { id: 'spongeflowers', cat: 'paint', name: 'Sponge flowers', ico: '🌷', lv: 1, min: 15, mat: [M.paper, M.paint, ['🧽', 'a sponge cut into little squares']], tip: 'Use a little paint on a plate, not a lot: thin paint makes the nicest sponge texture.', steps: [
      S('Pour a little paint onto a plate.', 'pour', { base: K.ell(100, 112, 62, 16, '#fff'), box: [64, 104, 72, 12], c: C.pink, lv1: 0.8, clip: 'M40,112 A60,14 0 0 0 160,112 A60,14 0 0 0 40,112Z' }),
      S('Dip the sponge, then press it on the paper. Dab, dab, dab in a circle!', 'dab', { base: sheet(), ...d1 }),
      S('Make more flowers in other colors. Dab a yellow middle.', 'dab', { base: sheet() + done(d1), ...d2 }),
      S('Paint green stems and leaves with a brush.', 'draw', { base: sheet() + prints, s: stems, c: C.green, w: 3.5, tool: 'brush', fill: leaves }),
      S('A garden of sponge flowers!', 'show', { item: mid(pic), kind: 'glow' })
    ] };
  })();

  const bubbleWrap = (() => {
    const wrap = c => K.rect(-24, -20, 48, 40, c, 4) + Array.from({ length: 12 }, (_, i) => K.circ(-16 + (i % 4) * 10.7, -10 + Math.floor(i / 4) * 10, 3.6, 'rgba(255,255,255,.45)', 0.8)).join('');
    const fishBody = K.arc(96, 75, 50, 32, 0, 360, 30);
    const dots = (c, k) => { const o = []; for (let j = 0; j < 8; j++) for (let i = 0; i < 12; i++) { const x = 52 + i * 8 + (j % 2 ? 4 : 0), y = 47 + j * 8; if (((x - 96) / 48) ** 2 + ((y - 75) / 30) ** 2 < 0.9 && (i + j) % 2 === k) o.push(K.circ(x, y, 3.2, c, 0)); } return o.join(''); };
    const p1 = dots(C.blue, 0), p2 = dots(C.teal, 1), tail = K.poly([[144, 75], [172, 54], [172, 96]], C.orange, 0), eye = K.eye(70, 68, 6);
    const pic = sheet() + p1 + p2 + tail + eye;
    return { id: 'bubblewrap', cat: 'paint', name: 'Bubble wrap fish print', ico: '🐟', lv: 1, min: 15, mat: [['🫧', 'bubble wrap'], M.paint, M.brush, M.paper, M.pens], steps: [
      S('Paint the bumpy side of the bubble wrap blue.', 'paint', { base: K.g(wrap('#EAF4FF'), 100, 75, 2), area: K.g(wrap(C.blue), 100, 75, 2), box: [52, 35, 96, 80], c: C.blue }),
      S('Press it on the paper, paint side down, then lift it. Dots!', 'stamp', { base: sheet(), at: [96, 75], item: K.g(wrap(C.blue), 0, 0, 2.2), print: p1 }),
      S('Paint it green and print again, a little to the side.', 'stamp', { base: sheet() + p1, at: [100, 79], item: K.g(wrap(C.teal), 0, 0, 2.2), print: p2 }),
      S('Paint a tail and draw a big eye. A bubbly fish!', 'draw', { base: sheet() + p1 + p2, s: [[[144, 75], [172, 54], [172, 96], [144, 75]], circlePts(70, 68, 6, 10)], c: C.orange, w: 3, fill: tail + eye, tool: 'brush' }),
      S('Blub blub! Your fish is all bubbles.', 'show', { item: mid(pic), kind: 'float' })
    ] };
  })();

  const saltPaint = (() => {
    const sp = K.starPts(100, 72, 46, 5, 0.45), star = sp.concat([sp[0]]), card = K.sheet(30, 15, 140, 115, '#22305A');
    const glueL = K.line(star, '#B9D8F5', 6) + K.line(star, '#fff', 4);
    const salt = K.line(star, '#F4F6F8', 7) + star.map((p, i) => K.circ(p[0] + (i % 2 ? 2 : -2), p[1] + 1, 1.5, '#fff', 0)).join('');
    const drops = sp.map((p, i) => [p[0], p[1], [C.blue, C.pink, C.yellow, C.purple, C.green][i % 5]]);
    const dr = { a: 'dab', pts: drops, shape: 'blob', r: 11, spread: true, tool: 'dropper' };
    return { id: 'saltpaint', cat: 'paint', name: 'Salt painting', ico: '🧂', lv: 2, min: 20, mat: [M.card, M.pva, ['🧂', 'salt'], ['💧', 'runny watercolor paint'], ['🖌️', 'a dropper or a soft brush']], tip: 'Science! Salt soaks up water, so the color runs along the salt lines all by itself.', steps: [
      S('Squeeze glue lines onto dark card. Make a big star!', 'draw', { base: card, s: [star], tool: 'glue', w: 4 }),
      S('Shake lots of salt all over the glue.', 'sprinkle', { base: card + glueL, box: [50, 26, 100, 90], colors: ['#fff', '#EEF2F6'], n: 60 }),
      S('Tip the card and tap it. The extra salt falls off.', 'show', { item: mid(card + salt), kind: 'shake', s: 0.85 }),
      S('Touch drops of watercolor on the salt. Watch the color creep along!', 'dab', { base: card + salt, ...dr }),
      S('A glowing salt star!', 'show', { item: mid(card + salt + done(dr)), kind: 'glow' })
    ] };
  })();

  const marblePaint = (() => {
    const tray = K.rect(25, 18, 150, 114, C.card, 4) + K.rect(33, 26, 134, 98, '#B98A55', 2), pap = K.rect(36, 29, 128, 92, '#fff', 1);
    const blobs = [[60, 50, C.red], [140, 50, C.blue], [100, 100, C.yellow], [76, 96, C.green]];
    const bl = { a: 'dab', pts: blobs, shape: 'blob', r: 6, tool: 'brush' };
    const trails = [{ p: [[60, 50], [150, 78], [44, 110], [150, 112]], c: C.red }, { p: [[140, 50], [48, 70], [120, 116], [70, 38]], c: C.blue }, { p: [[100, 100], [154, 36], [96, 64], [46, 40]], c: C.yellow }, { p: [[76, 96], [130, 92], [60, 70]], c: C.green }];
    const lines = trails.map(t => K.line(t.p, t.c, 3)).join('');
    return { id: 'marblepaint', cat: 'paint', name: 'Marble rolling painting', ico: '🔵', lv: 1, min: 10, mat: [['📦', 'a box lid or a tray'], M.paper, M.paint, ['🔵', 'a marble or a small ball']], tip: 'Tape the paper into the lid so it does not slide. A ping-pong ball works for little ones.', steps: [
      S('Put a piece of paper inside a box lid.', 'place', { base: tray, pieces: [{ svg: pap, at: [100, 75], from: [0, -90] }] }),
      S('Drop blobs of paint on the paper.', 'dab', { base: tray + pap, ...bl }),
      S('Put in a marble. Tip the box this way and that way!', 'draw', { base: tray + pap + done(bl), s: trails, w: 3, tool: 'marble', guide: false }),
      S('Take out your paper. Zoom lines everywhere!', 'show', { item: mid(pap + lines + done(bl)), kind: 'wiggle' })
    ] };
  })();

  const blowPaint = (() => {
    const pap = sheet(), blob = { a: 'dab', pts: [[100, 84, C.purple]], shape: 'blob', r: 16, spread: true, tool: 'dropper' };
    const legs = [[[100, 84], [70, 60], [56, 40]], [[100, 84], [128, 58], [146, 42]], [[100, 84], [62, 100], [40, 112]], [[100, 84], [140, 104], [160, 116]], [[100, 84], [98, 116], [104, 128]]].map(p => { const q = []; for (let i = 0; i < p.length - 1; i++) for (let k = 0; k < 4; k++) { const t = k / 4; q.push([p[i][0] + (p[i + 1][0] - p[i][0]) * t + (k % 2 ? 3 : -3), p[i][1] + (p[i + 1][1] - p[i][1]) * t]); } q.push(p[p.length - 1]); return q; });
    const body = done(blob) + legs.map(l => K.line(l, C.purple, 4)).join(''), eyes = K.eye(92, 78, 7) + K.eye(110, 76, 5), mouth = K.path('M90,92 Q100,100 110,92', '#fff', 1.6);
    return { id: 'blowpaint', cat: 'paint', name: 'Straw blow monsters', ico: '👾', lv: 2, min: 15, mat: [M.paper, ['💧', 'runny paint'], ['🥤', 'a straw'], M.eyes, M.pens], tip: 'Blow, do not suck! Practice blowing through the straw at a hand first.', steps: [
      S('Drop a big blob of runny paint on the paper.', 'dab', { base: pap, ...blob }),
      S('Blow through a straw. Push the paint into wiggly legs!', 'draw', { base: pap + done(blob), s: legs, c: C.purple, w: 4, tool: 'straw', guide: false }),
      S('Stick on googly eyes. Maybe three!', 'place', { base: pap + body, pieces: [{ svg: eyes, at: [100, 77], from: [0, -60] }] }),
      S('Draw a mouth with teeth.', 'draw', { base: pap + body + eyes, s: [[[90, 92], [100, 99], [110, 92]]], c: '#fff', fill: mouth, tool: 'pen' }),
      S('Rooar! Give your monster a name.', 'show', { item: mid(pap + body + eyes + mouth), kind: 'wiggle' })
    ] };
  })();

  const fingerBugs = (() => {
    const pad = K.rect(60, 70, 80, 50, '#22305A', 6) + K.rect(66, 76, 68, 38, C.green, 4);
    const cat = Array.from({ length: 6 }, (_, i) => [42 + i * 16, 58 + 8 * Math.sin(i * 1.2), i % 2 ? C.lime : C.green]);
    const c1 = { a: 'dab', pts: cat, shape: 'print', r: 9, tool: 'finger' };
    const legs = cat.slice(0, 5).map(([x, y]) => [[x, y + 9], [x - 2, y + 15]]), face = K.eyes(122, 48, 2.6, 7) + K.smile(122, 54, 4);
    const feel = [[[120, 46], [116, 36]], [[126, 46], [130, 36]]];
    const bugs = [[60, 104, C.red], [100, 110, C.yellow], [146, 102, C.red]], c2 = { a: 'dab', pts: bugs, shape: 'print', r: 11, tool: 'finger' };
    const bugDeco = K.circ(56, 102, 2, K.OL, 0) + K.circ(64, 106, 2, K.OL, 0) + K.line([[94, 108], [106, 108]], K.OL, 2) + K.line([[95, 114], [105, 114]], K.OL, 2) + K.circ(142, 100, 2, K.OL, 0) + K.circ(150, 104, 2, K.OL, 0);
    const pic = sheet() + done(c1) + legs.map(l => K.line(l, K.OL, 1.6)).join('') + feel.map(l => K.line(l, K.OL, 1.6)).join('') + face + done(c2) + bugDeco;
    return { id: 'fingerbugs', cat: 'paint', name: 'Fingerprint bugs', ico: '🐛', lv: 1, min: 10, mat: [M.paper, ['🖐️', 'a washable ink pad or paint'], M.pens], tip: 'Keep a damp cloth close by for wiping fingers between colors.', steps: [
      S('Press your finger on the paint pad.', 'stamp', { base: pad, at: [100, 86], item: K.emo('👇', 0, -6, 34), print: K.ell(100, 95, 8, 10, 'rgba(255,255,255,.35)', 0) }),
      S('Press it on the paper in a wiggly row. A caterpillar!', 'dab', { base: sheet(), ...c1 }),
      S('Draw legs, feelers and a smiley face.', 'draw', { base: sheet() + done(c1), s: [...legs, ...feel], tool: 'pen', fill: face }),
      S('Make ladybugs and bees with other colors!', 'dab', { base: sheet() + done(c1) + legs.map(l => K.line(l, K.OL, 1.6)).join('') + feel.map(l => K.line(l, K.OL, 1.6)).join('') + face, ...c2 }),
      S('A whole bug family from your fingers!', 'show', { item: mid(pic), kind: 'bounce' })
    ] };
  })();

  const resist = (() => {
    const pap = sheet(), lines = [circlePts(70, 50, 16, 20), [[110, 110], [125, 70], [140, 110]], [[118, 92], [132, 92]], K.wave(30, 170, 120, 3, 4)];
    const drawn = lines.map(p => K.line(p, '#FFFFFF', 3)).join(''), wash = K.rect(20, 15, 160, 115, C.blue, 2) + K.rect(20, 15, 160, 50, C.purple, 2) + drawn;
    return { id: 'resist', cat: 'paint', name: 'Magic crayon resist', ico: '🪄', lv: 1, min: 10, mat: [['📄', 'white paper'], ['🖍️', 'a white crayon'], ['💧', 'watercolor paint'], M.brush], steps: [
      S('Draw a secret picture with a white crayon. Press hard!', 'draw', { base: pap, s: lines, c: '#E9EDF2', w: 3, tool: 'crayon' }),
      S('Paint over the whole paper with watercolor.', 'paint', { base: pap + lines.map(p => K.line(p, '#EEF1F4', 3)).join(''), area: wash, box: [20, 15, 160, 115], c: C.blue }),
      S('Magic! The wax pushes the paint away, and your picture appears.', 'show', { item: mid(wash), kind: 'glow' })
    ] };
  })();

  const potato = (() => {
    const half = K.ell(100, 80, 40, 30, '#E8C98E') + K.ell(100, 80, 33, 24, '#F4E2B8', 0), whole = K.ell(100, 80, 46, 32, '#C9A06A');
    const sp = K.starPts(100, 80, 20, 5, 0.45), starO = sp.concat([sp[0]]);
    const raised = K.ell(100, 80, 40, 30, '#D9B57A') + K.poly(sp, '#F4E2B8', 1.4), painted = K.ell(100, 80, 40, 30, '#D9B57A') + K.poly(sp, C.red, 1.4);
    const grid = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) grid.push([40 + c * 34 + (r % 2 ? 17 : 0), 36 + r * 36, r % 2 ? C.blue : C.red]);
    const pr = { a: 'dab', pts: grid, shape: 'star', r: 14, tool: 'stamp' };
    return { id: 'potato', cat: 'paint', name: 'Potato stamp prints', ico: '🥔', lv: 3, min: 25, mat: [['🥔', 'a potato'], ['🔪', 'a knife (a grown-up cuts)'], M.pens, M.paint, M.brush, M.paper], tip: 'Simple, chunky shapes stamp best: a star, a heart, a triangle.', steps: [
      S('A grown-up cuts the potato in half.', 'cut', { base: whole, pts: [[100, 44], [100, 116]], piece: K.ell(130, 80, 16, 30, '#C9A06A'), off: [30, 0], topEnd: half }),
      S('Draw a star on the flat side with a pen.', 'draw', { base: half, s: [starO], tool: 'pen' }),
      S('A grown-up cuts away the potato around the star.', 'cut', { base: half + K.line(starO, K.OL, 1.4), pts: starO, topEnd: raised }),
      S('Brush paint onto the star.', 'paint', { base: raised, area: painted, box: [78, 58, 44, 44], c: C.red }),
      S('Stamp, stamp, stamp! Make a pattern.', 'dab', { base: sheet(), ...pr }),
      S('Your own wrapping paper!', 'show', { item: mid(sheet() + done(pr)), kind: 'glow' })
    ] };
  })();

  const blotFly = (() => {
    const L = [[20, 15], [100, 15], [100, 130], [20, 130]], R = [[100, 15], [180, 15], [180, 130], [100, 130]], Rm = [[100, 15], [20, 15], [20, 130], [100, 130]];
    const blobs = [[70, 45, C.pink], [62, 80, C.yellow], [80, 104, C.purple], [86, 62, C.blue]], bl = { a: 'dab', pts: blobs, shape: 'blob', r: 13, tool: 'brush' };
    const mirror = svg => `<g transform="translate(200 0) scale(-1 1)">${svg}</g>`, left = done(bl), both = left + mirror(left);
    const wing = K.path('M100,30 C60,0 18,30 46,70 C10,96 50,140 100,110 C150,140 190,96 154,70 C182,30 140,0 100,30Z', '#fff');
    const body = K.ell(100, 72, 5, 34, K.OL, 0) + K.line([[100, 40], [90, 24]], K.OL, 2) + K.line([[100, 40], [110, 24]], K.OL, 2);
    return { id: 'blotfly', cat: 'paint', name: 'Butterfly blot painting', ico: '🦋', lv: 1, min: 10, mat: [M.paper, M.paint, ['🖊️', 'a black pen']], tip: 'Symmetry: both sides match like a mirror. Look for it on real butterflies!', steps: [
      S('Fold the paper in half, then open it again.', 'draw', { base: K.poly(L, '#fff') + K.poly(R, '#fff'), s: [[[100, 15], [100, 130]]], c: C.purple, dash: '5 4', tool: 'finger' }),
      S('Drop blobs of paint on one side only.', 'dab', { base: K.poly(L, '#fff') + K.poly(R, '#fff'), ...bl }),
      S('Fold it closed and press hard. Squish!', 'morph', { base: K.poly(L, '#fff') + left, from: [{ p: R, c: '#fff' }], to: [{ p: Rm, c: '#F4F4F4' }] }),
      S('Open it up. Both sides match!', 'morph', { base: K.poly(L, '#fff') + left, from: [{ p: Rm, c: '#F4F4F4' }], to: [{ p: R, c: '#fff' }], topEnd: mirror(left) }),
      S('Draw a body and feelers. Fly away, butterfly!', 'draw', { base: K.sheet(20, 15, 160, 115, '#fff') + both, s: [[[100, 40], [100, 106]], [[100, 40], [90, 24]], [[100, 40], [110, 24]]], w: 4, tool: 'pen', fill: body }),
      S('Flutter, flutter!', 'show', { item: mid(`<clipPath id="crbf"><path d="M100,30 C60,0 18,30 46,70 C10,96 50,140 100,110 C150,140 190,96 154,70 C182,30 140,0 100,30Z"/></clipPath>` + wing + `<g clip-path="url(#crbf)">${both}</g>` + body), kind: 'fly', s: 0.7 })
    ] };
  })();

  /* ================= beads & jewelry ================= */
  const pastaNeck = (() => {
    const tubes = c => Array.from({ length: 9 }, (_, i) => K.g(K.rect(-10, -5, 20, 10, typeof c === 'string' ? c : c[i % c.length], 2) + K.line([[-6, -5], [-6, 5]], 'rgba(34,48,90,.25)', 1) + K.line([[0, -5], [0, 5]], 'rgba(34,48,90,.25)', 1), 52 + (i % 3) * 48, 48 + Math.floor(i / 3) * 28, 1, (i * 37) % 40 - 20)).join('');
    const cols = [C.red, C.blue, C.yellow, C.green, C.purple], str = K.arc(100, 30, 70, 80, 170, 10, 40);
    const loop = K.line(K.arc(100, 75, 50, 46, 0, 360, 40), K.OL, 1.6) + Array.from({ length: 12 }, (_, i) => { const a = 100 + i * 28, p = K.arc(100, 75, 50, 46, a, a, 1)[0]; return K.g(K.rect(-9, -5, 18, 10, cols[i % 5], 2), p[0], p[1], 1, a + 90); }).join('');
    return { id: 'pastaneck', cat: 'beads', name: 'Painted pasta necklace', ico: '🍝', lv: 1, min: 20, mat: [['🍝', 'dry tube pasta'], M.paint, M.brush, M.wool, M.tape], tip: 'Paint the pasta the day before so it is dry. Or shake it in a bag with a little paint!', steps: [
      S('Paint the pasta tubes in bright colors. Let them dry.', 'paint', { base: tubes(C.tan), area: tubes(cols), box: [38, 36, 128, 74], c: C.red }),
      S('Wrap tape round the end of the string. Now it is stiff, like a needle!', 'place', { base: K.line(str, K.OL, 1.8), pieces: [{ svg: K.g(K.rect(-2, -4, 12, 8, C.sky, 2), 169, 44, 1, -40), at: [172, 42], from: [20, -40] }] }),
      S('Thread the pasta on, one by one.', 'thread', { pts: str, beads: cols.concat(cols.slice(0, 3)), r: 7, tube: true }),
      S('Tie the two ends in a tight knot.', 'knot', { at: [100, 60], c: K.OL }),
      S('Wear your pasta necklace!', 'show', { item: mid(loop), kind: 'bounce' })
    ] };
  })();

  const strawBeads = (() => {
    const cols = [C.red, C.yellow, C.blue, C.green, C.pink], straws = cols.slice(0, 3).map((c, i) => K.rect(30, 46 + i * 20, 140, 10, c, 4)).join('');
    const line = [[30, 80], [170, 80]], band = [[30, 76], [170, 76], [170, 84], [30, 84]], ringPts = K.arc(100, 75, 42, 42, 0, 360, 30);
    const ringSVG = K.line(ringPts, C.purple, 4) + Array.from({ length: 10 }, (_, i) => { const a = i * 36, p = K.arc(100, 75, 42, 42, a, a, 1)[0]; return K.g(K.rect(-7, -5, 14, 10, cols[i % 5], 2), p[0], p[1], 1, a + 90); }).join('');
    return { id: 'strawbeads', cat: 'beads', name: 'Straw bead bracelet', ico: '🥤', lv: 1, min: 15, mat: [['🥤', 'colored straws'], M.scissors, M.pipe], steps: [
      S('Cut the straws into short pieces. Snip, snip!', 'cut', { base: straws, cuts: [50, 72, 94, 116, 138].map(x => [[x, 40], [x, 92]]) }),
      S('Thread the pieces onto a pipe cleaner.', 'thread', { pts: line, beads: cols.concat(cols), r: 6, tube: true, sc: C.purple }),
      S('Bend it round your wrist.', 'morph', { from: [{ p: band, c: C.purple }], to: [{ p: ringPts, c: '#FFF6E5' }], topEnd: ringSVG }),
      S('Twist the ends together, round and round.', 'knot', { base: ringSVG, at: [100, 33], c: C.purple }),
      S('A bracelet as bright as a rainbow!', 'show', { item: mid(ringSVG), kind: 'spin', speed: 0.3 })
    ] };
  })();

  const paperBeads = (() => {
    const mag = K.rect(30, 30, 140, 90, '#F6E3EF', 3) + [44, 70, 100].map((y, i) => K.line(K.wave(36, 164, y, 2, 4), [C.blue, C.pink, C.green][i], 4)).join('');
    const zig = [[30, 30], [58, 120], [86, 30], [114, 120], [142, 30], [170, 120]];
    const tri = [[30, 70], [170, 62], [170, 78]], bead = K.arc(100, 70, 20, 10, 0, 360, 20);
    const stripe = K.line([[84, 66], [116, 66]], C.blue, 2) + K.line([[82, 72], [118, 72]], C.pink, 2) + K.line([[60, 70], [140, 70]], '#8A6A3E', 2.4);
    const beads = [C.pink, C.blue, C.green, C.purple, C.orange, C.pink];
    const loop = K.line(K.arc(100, 75, 50, 46, 0, 360, 40), K.OL, 1.6) + Array.from({ length: 10 }, (_, i) => { const a = 110 + i * 32, p = K.arc(100, 75, 50, 46, a, a, 1)[0]; return K.g(K.ell(0, 0, 10, 6, beads[i % 6], 1.3) + K.line([[-5, -3], [5, -3]], '#fff', 1.2), p[0], p[1], 1, a + 90); }).join('');
    return { id: 'paperbeads', cat: 'beads', name: 'Rolled paper beads', ico: '📜', lv: 3, min: 40, mat: [['📰', 'old magazine pages'], M.ruler, M.pencil, M.scissors, M.glue, ['🥢', 'a toothpick or thin stick'], M.wool], tip: 'Longer triangles make fatter beads. A coat of PVA glue makes them shiny and strong.', steps: [
      S('Use a ruler to mark the top edge every 2 centimeters.', 'measure', { base: mag, from: [30, 30], to: [170, 30], n: 5 }),
      S('Draw and cut long thin triangles across the page.', 'cut', { base: mag, pts: zig }),
      S('Roll a triangle round a stick, starting at the wide end.', 'morph', { base: K.line([[50, 70], [150, 70]], '#8A6A3E', 2.4), from: [{ p: tri, c: '#F6E3EF' }], to: [{ p: bead, c: '#F6E3EF' }], topEnd: stripe }),
      S('Glue the thin tip down. Slide the bead off the stick.', 'glue', { base: K.ell(100, 70, 20, 10, '#F6E3EF') + stripe, dots: [[96, 62], [104, 62], [100, 78]], r: 2.6 }),
      S('Make lots of beads, then thread them on a string.', 'thread', { pts: K.arc(100, 30, 70, 80, 170, 10, 40), beads, r: 8, tube: true }),
      S('Beads made from old paper!', 'show', { item: mid(loop), kind: 'bounce' })
    ] };
  })();

  const buttonBrace = (() => {
    const btn = (x, y, r, c) => K.circ(x, y, r, c) + [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => K.circ(x + a * r * 0.3, y + b * r * 0.3, r * 0.12, K.OL, 0)).join('');
    const big = btn(100, 75, 34, C.yellow), cols = [C.red, C.blue, C.yellow, C.green, C.pink, C.purple, C.orange];
    const loop = K.line(K.arc(100, 75, 46, 44, 0, 360, 40), K.OL, 1.6) + Array.from({ length: 12 }, (_, i) => { const a = i * 30, p = K.arc(100, 75, 46, 44, a, a, 1)[0]; return btn(p[0], p[1], 9, cols[i % 7]); }).join('');
    return { id: 'buttonbrace', cat: 'beads', name: 'Button bracelet', ico: '🔘', lv: 2, min: 15, mat: [['🔘', 'buttons with 2 or 4 holes'], ['🧵', 'stretchy elastic cord'], M.scissors], steps: [
      S('Measure the elastic round your wrist. Cut it a bit longer.', 'measure', { base: K.line([[20, 90], [180, 90]], C.red, 2), from: [30, 80], to: [170, 80], n: 6, nums: true }),
      S('Push the elastic up through one hole and down through the next.', 'stitch', { base: big, pts: [[40, 100], [90, 65], [110, 65], [110, 85], [90, 85], [160, 100]] }),
      S('Add more buttons in a row, up and down.', 'thread', { pts: [[20, 80], [180, 80]], beads: cols, r: 8, pre: 1 }),
      S('Tie the ends in a tight double knot.', 'knot', { at: [100, 64], c: C.red }),
      S('Clicky, colorful, and all yours!', 'show', { item: mid(loop), kind: 'spin', speed: 0.3 })
    ] };
  })();

  const clayBeads = (() => {
    const xs = [44, 72, 100, 128, 156], plain = xs.map(x => K.circ(x, 80, 11, C.tan)).join(''), holes = xs.map(x => [x, 80, '#7A5A3A']);
    const cols = [C.pink, C.blue, C.yellow, C.green, C.purple], painted = xs.map((x, i) => K.circ(x, 80, 11, cols[i]) + K.circ(x - 4, 76, 2.5, 'rgba(255,255,255,.6)', 0)).join('');
    const ho = { a: 'dab', pts: holes, shape: 'dot', r: 2.6, tool: 'straw' };
    const loop = K.line(K.arc(100, 75, 46, 44, 0, 360, 40), K.OL, 1.6) + Array.from({ length: 10 }, (_, i) => { const a = 110 + i * 34, p = K.arc(100, 75, 46, 44, a, a, 1)[0]; return K.bead(p[0], p[1], 9, cols[i % 5]); }).join('');
    return { id: 'claybeads', cat: 'beads', name: 'Clay bead charms', ico: '🟣', lv: 2, min: 30, mat: [['🟤', 'air-dry clay'], ['🥤', 'a straw'], M.paint, M.brush, M.wool], tip: 'Air-dry clay beads need a day to dry hard before painting.', steps: [
      S('Roll little balls of clay between your hands.', 'clay', { mode: 'ball', c: C.tan, r: 22, at: [100, 80] }),
      S('Poke a hole right through each ball with a straw.', 'dab', { base: plain, ...ho }),
      S('When they are dry, paint them.', 'paint', { base: plain + done(ho), area: painted + done(ho), box: [30, 66, 140, 28], c: C.pink }),
      S('Thread them on a string. Tie a knot.', 'thread', { pts: K.arc(100, 30, 70, 80, 170, 10, 40), beads: cols, r: 9 }),
      S('A necklace of clay beads!', 'show', { item: mid(loop), kind: 'bounce' })
    ] };
  })();

  const pipeRing = (() => {
    const line = [[30, 75], [170, 75]], band = [[30, 72], [170, 72], [170, 78], [30, 78]], circ = K.arc(100, 85, 28, 28, 0, 360, 30);
    const ringSVG = K.line(circ, C.purple, 4) + K.bead(100, 52, 12, C.pink) + K.line([[94, 60], [88, 66]], C.purple, 3) + K.line([[106, 60], [112, 66]], C.purple, 3);
    return { id: 'pipering', cat: 'beads', name: 'Pipe cleaner ring', ico: '💍', lv: 1, min: 5, mat: [M.pipe, ['📿', 'one big bead']], steps: [
      S('Thread a big bead to the middle of the pipe cleaner.', 'thread', { pts: line, beads: [C.pink], r: 12, sc: C.purple }),
      S('Wrap it round your finger.', 'morph', { from: [{ p: band, c: C.purple }], to: [{ p: circ, c: '#FFF6E5' }], topEnd: ringSVG }),
      S('Twist the ends round and round under the bead.', 'knot', { base: ringSVG, at: [100, 62], c: C.purple }),
      S('A ring fit for a princess or a pirate!', 'show', { item: mid(ringSVG), kind: 'bounce' })
    ] };
  })();

  const lizard = (() => {
    // the lizard is made in rows of pony beads; each step adds some rows
    const g = C.green, y = C.yellow, rows = [[g, g], [g, y, g], [g, g, g], [y, g, g, g, y], [g, g, g], [g, y, g], [y, g, g, g, y], [g, g], [g], [g]];
    const rowSVG = (r, i) => r.map((c, j) => K.bead(100 + (j - (r.length - 1) / 2) * 11, 24 + i * 11, 5.4, c)).join('');
    const pieces = (a, b) => rows.slice(a, b).map((r, k) => ({ svg: rowSVG(r, a + k), at: [100, 24 + (a + k) * 11], h: 70 }));
    const all = rows.map(rowSVG).join(''), cord = K.line([[96, 10], [100, 24], [104, 10]], K.OL, 1.4) + K.circ(100, 8, 6, 'none', 0, `stroke="${C.grey}" stroke-width="3"`);
    const tails = K.line([[100, 134], [92, 146]], K.OL, 1.4) + K.line([[100, 134], [108, 146]], K.OL, 1.4);
    return { id: 'lizard', cat: 'beads', name: 'Bead lizard keyring', ico: '🦎', lv: 4, min: 45, mat: [['📿', 'pony beads in 2 colors'], ['🧵', 'thin cord, as long as your arm'], ['🔑', 'a key ring'], M.scissors], tip: 'The trick is the criss-cross: both cord ends pass through each row from opposite sides. Pull snug after every row.', steps: [
      S('Fold the cord in half round the key ring.', 'draw', { base: K.circ(100, 8, 6, 'none', 0, `stroke="${C.grey}" stroke-width="3"`), s: [[[96, 10], [70, 120]], [[104, 10], [130, 120]]], w: 1.6, tool: 'finger' }),
      S('Thread 2 beads on one end. Push the other end through them the other way. Pull snug.', 'stack', { base: cord, pieces: pieces(0, 1) }),
      S('Do the same for the head rows: 3 beads, then 3.', 'stack', { base: cord + rowSVG(rows[0], 0), pieces: pieces(1, 3) }),
      S('Front legs: a row of 5, the yellow feet stick out.', 'stack', { base: cord + rows.slice(0, 3).map(rowSVG).join(''), pieces: pieces(3, 4) }),
      S('Body rows, then back legs, the same way.', 'stack', { base: cord + rows.slice(0, 4).map(rowSVG).join(''), pieces: pieces(4, 7) }),
      S('Smaller and smaller rows for the tail.', 'stack', { base: cord + rows.slice(0, 7).map(rowSVG).join(''), pieces: pieces(7, 10) }),
      S('Tie the two ends in a tight knot and trim.', 'knot', { base: cord + all, at: [100, 134], c: K.OL }),
      S('Your lizard keyring! Clip it on your bag.', 'show', { item: mid(cord + all + tails), kind: 'swing' })
    ] };
  })();

  /* ================= costumes & dress-up ================= */
  const cape = (() => {
    const tee = [[60, 20], [84, 14], [100, 22], [116, 14], [140, 20], [168, 42], [150, 58], [138, 50], [138, 130], [62, 130], [62, 50], [50, 58], [32, 42]];
    const capeP = [[84, 14], [100, 22], [116, 14], [140, 30], [160, 132], [40, 132], [60, 30]], red = K.poly(capeP, C.red);
    const sp = K.starPts(100, 76, 22, 5, 0.45), star = K.poly(sp, C.yellow);
    return { id: 'cape', cat: 'costume', name: 'Superhero cape', ico: '🦸', lv: 2, min: 30, mat: [['👕', 'an old big T-shirt'], M.scissors, M.ruler, M.felt, ['🧴', 'fabric glue']], tip: 'Keep the neck band whole, so the cape slips on and off with no ties.', steps: [
      S('Lay the T-shirt flat. A grown-up cuts off the front and the sleeves, but keeps the neck band.', 'cut', { base: K.poly(tee, C.red), cuts: [[[84, 14], [62, 50], [62, 130]], [[116, 14], [138, 50], [138, 130]]], topEnd: K.poly(capeP, 'rgba(255,255,255,.25)', 0) }),
      S('Measure how long your cape should be.', 'measure', { base: red, from: [150, 30], to: [150, 128], n: 5 }),
      S('Cut a big star from felt.', 'cut', { base: K.sheet(60, 40, 80, 72, C.yellow), pts: sp.concat([sp[0]]), piece: star, off: [0, 0] }),
      S('Glue the star in the middle of the cape.', 'place', { base: red, pieces: [{ svg: star, at: [100, 76], from: [0, -70] }] }),
      S('Slip the neck band over your head. Ready to fly!', 'show', { item: mid(red + star), kind: 'swing' })
    ] };
  })();

  const eyeMask = (() => {
    const out = [[30, 70], [40, 50], [70, 44], [100, 56], [130, 44], [160, 50], [170, 70], [158, 92], [126, 98], [100, 84], [74, 98], [42, 92], [30, 70]];
    const holes = [K.arc(72, 70, 14, 9, 0, 360, 16), K.arc(128, 70, 14, 9, 0, 360, 16)];
    const blank = K.poly(out, '#fff'), hole = holes.map(h => K.poly(h, '#FFF6E5', 1.2)).join(''), blue = K.poly(out, C.blue) + K.line(K.wave(36, 164, 88, 2, 5), C.yellow, 2) + hole;
    return { id: 'eyemask', cat: 'costume', name: 'Hero eye mask', ico: '🎭', lv: 1, min: 15, mat: [M.card, M.pencil, M.scissors, M.crayons, M.punch, ['🧵', 'elastic or string']], tip: 'Hold the card up to the face and mark the eyes first, so the holes are in the right place.', steps: [
      S('Draw a mask shape on card. Mark two eye holes.', 'draw', { base: K.sheet(20, 30, 160, 80, '#fff'), s: [out, ...holes], tool: 'pen', c: C.grey }),
      S('Cut out the mask. A grown-up helps with the eye holes.', 'cut', { base: K.sheet(20, 30, 160, 80, '#fff'), cuts: [out, ...holes], topEnd: hole }),
      S('Color it in your hero colors.', 'paint', { base: blank + hole, area: blue, box: [30, 44, 140, 54], tool: 'crayon', c: C.blue }),
      S('Punch a hole on each side.', 'punch', { base: blue, holes: [[38, 68], [162, 68]] }),
      S('Tie on elastic to go round your head.', 'knot', { base: blue + K.hole(38, 68) + K.hole(162, 68) + K.line([[38, 68], [20, 50]], C.red, 2) + K.line([[162, 68], [180, 50]], C.red, 2), at: [100, 28], c: C.red }),
      S('Who is that masked hero? It is you!', 'show', { item: mid(blue + K.hole(38, 68) + K.hole(162, 68)), kind: 'wiggle' })
    ] };
  })();

  const ribbonWand = (() => {
    const stickS = K.rect(96, 40, 8, 100, C.brown, 3), cols = [C.red, C.yellow, C.blue], strips = cols.map((c, i) => K.rect(20, 50 + i * 18, 160, 8, c, 3)).join('');
    const rib2 = cols.map((c, i) => K.path(`M100,40 C${70 + i * 30},${60} ${40 + i * 60},${90} ${60 + i * 40},${130}`, 'none', 0, `stroke="${c}" stroke-width="5" stroke-linecap="round"`)).join('');
    return { id: 'ribbonwand', cat: 'costume', name: 'Ribbon dancing wand', ico: '🎀', lv: 1, min: 10, mat: [['🥢', 'a stick or a thick straw'], ['🎀', 'long ribbons in 3 colors'], M.scissors, M.tape], steps: [
      S('Cut 3 ribbons, as long as your arm.', 'cut', { base: strips, pts: [[160, 44], [160, 104]] }),
      S('Tie the ribbons to the top of the stick.', 'knot', { base: stickS + rib2, at: [100, 40], c: C.red }),
      S('Wrap tape round the knot so it holds.', 'place', { base: stickS + rib2 + K.circ(100, 40, 4, C.red, 1.2), pieces: [{ svg: tapeP(100, 42, 16, 12), at: [100, 42], from: [0, -50] }] }),
      S('Dance! Swirl it in circles and waves.', 'show', { item: mid(stickS + rib2 + tapeP(100, 42, 16, 12)), kind: 'swing' })
    ] };
  })();

  const bagVest = (() => {
    const bag = K.rect(40, 15, 120, 120, C.tan, 3) + K.rect(40, 15, 120, 22, '#D9B98A', 3);
    const vest = [[40, 15], [82, 15], [96, 50], [96, 135], [40, 135], [40, 60], [56, 48]], vestR = vest.map(([x, y]) => [200 - x, y]);
    const v = K.poly(vest, C.tan) + K.poly(vestR, C.tan), fringe = Array.from({ length: 13 }, (_, i) => K.line([[44 + i * 9, 118], [44 + i * 9, 135]], 'rgba(34,48,90,.6)', 1.4)).join('');
    const pts = [[62, 70, C.red], [138, 70, C.blue], [66, 98, C.yellow], [134, 98, C.green], [126, 54, C.yellow]];
    const st = { a: 'dab', pts, shape: 'star', r: 9, tool: 'brush' };
    return { id: 'bagvest', cat: 'costume', name: 'Paper bag vest', ico: '🤠', lv: 2, min: 25, mat: [['🛍️', 'a big paper grocery bag'], M.scissors, M.paint, M.brush], tip: 'Draw the cut lines for your child first. Cowboys, explorers, or a fishing vest: the same bag works.', steps: [
      S('Cut a line up the middle of the front of the bag.', 'cut', { base: bag, pts: [[100, 135], [100, 15]] }),
      S('Cut a hole for your head and two holes for your arms.', 'cut', { base: bag + K.line([[100, 135], [100, 15]], K.OL, 1.4), cuts: [[[82, 15], [96, 50]], [[118, 15], [104, 50]], [[40, 60], [56, 48], [40, 36]], [[160, 60], [144, 48], [160, 36]]], topEnd: v }),
      S('Snip a fringe all along the bottom. Snip, snip, snip!', 'cut', { base: v, cuts: Array.from({ length: 6 }, (_, i) => [[48 + i * 21, 135], [48 + i * 21, 118]]), topEnd: fringe }),
      S('Paint stars and a sheriff badge.', 'dab', { base: v + fringe, ...st }),
      S('Howdy, partner!', 'show', { item: mid(v + fringe + done(st)), kind: 'wiggle' })
    ] };
  })();

  const earBand = (() => {
    const strip = K.rect(20, 100, 160, 18, C.white, 3), ear = (x, r) => K.g(K.path('M0,0 C-16,-30 -12,-70 0,-76 C12,-70 16,-30 0,0Z', '#fff'), x, 104, 1, r), inner = (x, r) => K.g(K.path('M0,-8 C-8,-30 -6,-56 0,-62 C6,-56 8,-30 0,-8Z', C.pink, 0), x, 104, 1, r);
    const ears = ear(80, -10) + ear(120, 10), pink = ears + inner(80, -10) + inner(120, 10);
    return { id: 'earband', cat: 'costume', name: 'Bunny ears headband', ico: '🐰', lv: 1, min: 15, mat: [M.card, M.ruler, M.pencil, M.scissors, M.crayons, M.glue, M.tape], tip: 'Make cat, bear or fox ears the same way, just change the ear shape.', steps: [
      S('Measure a strip of card that goes round your head.', 'measure', { base: strip, from: [20, 100], to: [180, 100], n: 6 }),
      S('Draw two tall ears and cut them out.', 'cut', { base: K.sheet(40, 20, 120, 90, '#fff'), cuts: [K.arc(80, 65, 16, 40, 0, 360, 20), K.arc(120, 65, 16, 40, 0, 360, 20)] }),
      S('Color the middle of each ear pink.', 'paint', { base: strip + ears, area: strip + pink, box: [60, 26, 80, 80], tool: 'crayon', c: C.pink }),
      S('Glue the ears onto the strip.', 'place', { base: strip, pieces: [{ svg: pink, at: [100, 70], from: [0, -60] }] }),
      S('Tape the ends together. Hop like a bunny!', 'show', { item: mid(strip + pink), kind: 'hop' })
    ] };
  })();

  const shield = (() => {
    const outl = [[50, 20], [150, 20], [150, 70], [100, 132], [50, 70], [50, 20]], card = K.box(30, 20, 130, 112, C.card);
    const silver = K.poly(outl, '#C9D3DC'), cross = K.rect(92, 24, 16, 90, C.red, 2) + K.rect(56, 52, 88, 16, C.red, 2), handle = K.rect(80, 64, 40, 12, C.tan, 4) + tapeP(78, 70, 10, 14) + tapeP(122, 70, 10, 14);
    return { id: 'shield', cat: 'costume', name: 'Knight\'s shield', ico: '🛡️', lv: 3, min: 40, mat: [['📦', 'a big piece of cardboard'], ['🔪', 'scissors (a grown-up cuts)'], M.pencil, M.paint, M.brush, ['🟫', 'a strip of card'], M.tape], safe: 'Cardboard is tough to cut. A grown-up does the cutting.', steps: [
      S('Draw a big shield shape on the cardboard.', 'draw', { base: card, s: [outl], tool: 'pen', c: C.grey }),
      S('A grown-up cuts it out.', 'cut', { base: card, pts: outl, piece: K.poly(outl, C.card), off: [0, 0] }),
      S('Paint it silver all over.', 'paint', { base: K.poly(outl, C.card), area: silver, box: [50, 20, 100, 112], c: '#C9D3DC' }),
      S('Paint a big red cross, or your own sign.', 'paint', { base: silver, area: `<clipPath id="crsh"><polygon points="50,20 150,20 150,70 100,132 50,70"/></clipPath><g clip-path="url(#crsh)">${cross}</g>`, box: [50, 20, 100, 112], c: C.red }),
      S('Turn it over. Tape on a card strip handle.', 'place', { base: K.poly(outl, C.card), pieces: [{ svg: handle, at: [100, 70], from: [0, 60] }] }),
      S('Sir Knight! Lady Knight! Protect the castle!', 'show', { item: mid(silver + `<g clip-path="url(#crsh2)">${cross}</g><clipPath id="crsh2"><polygon points="50,20 150,20 150,70 100,132 50,70"/></clipPath>`), kind: 'wiggle' })
    ] };
  })();

  const plateCrown = (() => {
    const plate = K.plate(100, 75, 50), cuts = Array.from({ length: 8 }, (_, i) => { const a = i * 45 * Math.PI / 180; return [[100, 75], [100 + 38 * Math.cos(a), 75 + 38 * Math.sin(a)]]; });
    const crownP = [[40, 120], [160, 120], [160, 60], [145, 90], [130, 40], [115, 85], [100, 30], [85, 85], [70, 40], [55, 90], [40, 60]];
    const gold = K.poly(crownP, C.yellow) + K.line([[40, 108], [160, 108]], '#E0A82A', 3);
    const gems = [[70, 46, C.red], [100, 36, C.blue], [130, 46, C.green], [70, 114, C.pink], [100, 114, C.purple], [130, 114, C.pink]].map(([x, y, c]) => K.circ(x, y, 5, c)).join('');
    return { id: 'platecrown', cat: 'costume', name: 'Paper plate crown', ico: '👑', lv: 1, min: 15, mat: [M.plate, M.scissors, M.paint, M.brush, ['💎', 'stickers or paper jewels']], steps: [
      S('Cut lines from the middle of the plate to the rim, like pizza slices.', 'cut', { base: plate, cuts }),
      S('Turn it over and push the points up. A crown!', 'morph', { from: [{ p: K.arc(100, 75, 50, 50, 0, 360, 24), c: '#fff' }], to: [{ p: crownP, c: '#fff' }] }),
      S('Paint it gold or yellow.', 'paint', { base: K.poly(crownP, '#fff'), area: gold, box: [40, 30, 120, 90], c: C.yellow }),
      S('Stick on jewels.', 'place', { base: gold, pieces: [{ svg: gems, at: [100, 70], from: [0, -60] }] }),
      S('Bow down to the king or queen!', 'show', { item: mid(gold + gems), kind: 'wiggle' })
    ] };
  })();

  craftsHome.add([spongeFlowers, bubbleWrap, saltPaint, marblePaint, blowPaint, fingerBugs, resist, potato, blotFly,
    pastaNeck, strawBeads, paperBeads, buttonBrace, clayBeads, pipeRing, lizard,
    cape, eyeMask, ribbonWand, bagVest, earBand, shield, plateCrown]);
})();
(() => {
  const K = craftsHome.kit, C = K.C;
  const S = (t, a, o = {}) => ({ t, a, ...o });
  const mid = svg => K.g(svg, -100, -75);
  const M = {
    paper: ['📄', 'paper'], sq: ['🟦', 'square paper'], color: ['🌈', 'colored paper'], scissors: ['✂️', 'child scissors'], glue: ['🧴', 'glue stick'], pva: ['🧴', 'white glue (PVA)'],
    tape: ['🩹', 'sticky tape'], crayons: ['🖍️', 'crayons'], pens: ['🖊️', 'felt pens'], pencil: ['✏️', 'pencil'], paint: ['🎨', 'paint'], brush: ['🖌️', 'paintbrush'],
    plate: ['🍽️', 'paper plate'], wool: ['🧶', 'wool or string'], card: ['🟨', 'thin card'], punch: ['🕳️', 'hole punch'], ruler: ['📏', 'a ruler'], pipe: ['〰️', 'a pipe cleaner'],
    sticks: ['🪵', 'craft sticks'], ribbon: ['🎀', 'ribbon'], tissue: ['🎐', 'tissue paper'], bowl: ['🥣', 'a big bowl and a spoon'], news: ['📰', 'newspaper'], eyes: ['👀', 'googly eyes (or draw them)']
  };
  const circlePts = (cx, cy, r, n = 20) => K.arc(cx, cy, r, r, 0, 360, n);
  const heartPts = (cx, cy, s, n = 40) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n * Math.PI * 2;
    return [cx + s * Math.pow(Math.sin(t), 3), cy - s * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16]; });
  const tapeP = (x, y, w = 26, h = 9) => K.rect(x - w / 2, y - h / 2, w, h, 'rgba(142,197,245,.85)', 1);
  const sheet = (c = '#fff') => K.sheet(20, 15, 160, 115, c);
  const done = s => K.still(s);
  const BOWL = { base: K.ell(100, 84, 42, 12, '#E3EEF8'), top: `<path d="M58,84 A42,40 0 0 0 142,84" fill="rgba(142,197,245,.3)" stroke="#22305A" stroke-width="1.6"/>` + K.ell(100, 84, 42, 12, 'none', 1.6), clip: 'M58,84 A42,40 0 0 0 142,84 Z', box: [58, 84, 84, 40] };
  const pourBowl = (t, o) => S(t, 'pour', { base: BOWL.base + (o.under || ''), top: BOWL.top, clip: BOWL.clip, box: BOWL.box, ...o });
  const stick = (x, y, r = 0, len = 100, c = C.tan) => K.g(K.rect(-len / 2, -5, len, 10, c, 5), x, y, 1, r);
  const flourC = ['#FFFFFF', '#F3EEE4', '#EDE6D8'];

  /* ================= sensory & play ================= */
  const playdough = (() => {
    const flour = { grain: true, colors: flourC, lv1: 0.45, gr: 2 }, flourIn = done({ a: 'pour', box: BOWL.box, clip: BOWL.clip, ...flour, lv0: 0.45 });
    const drops = { a: 'dab', pts: [[88, 96, C.pink], [104, 102, C.pink], [116, 94, C.yellow]], shape: 'blob', r: 5, tool: 'dropper' };
    const shapes = K.circ(70, 96, 22, C.pink) + K.star(128, 92, 20, C.pink) + K.heart(100, 60, 14, C.pink);
    return { id: 'playdough', cat: 'sensory', name: 'Homemade playdough', ico: '🥣', lv: 2, min: 20, mat: [['🌾', '2 cups of flour'], ['🧂', 'half a cup of salt'], ['🫒', '2 spoons of cooking oil'], ['🎨', 'food coloring'], ['♨️', '1 cup of hot water (a grown-up pours)'], M.bowl],
      safe: 'Homemade playdough is very salty. Keep it away from dogs, and do not eat it.', tip: 'Kept in a closed bag or box in the fridge, it stays soft for weeks.', steps: [
      pourBowl('Pour the flour and salt into a big bowl.', flour),
      S('Add the oil and a few drops of food coloring.', 'dab', { base: BOWL.base + flourIn + BOWL.top, ...drops }),
      pourBowl('A grown-up pours in the hot water.', { under: flourIn + done(drops), c: '#EAF4FF', lv0: 0.45, lv1: 0.6, cupC: C.red }),
      S('Stir and stir until it sticks together.', 'stir', { c0: '#F3EEE4', c1: '#F7B7D3', bits: [C.pink, C.yellow, '#fff'] }),
      S('When it is cool, knead it on the table. Squish, push, fold!', 'clay', { mode: 'ball', c: C.pink, r: 30 }),
      S('Your own playdough! What will you make?', 'show', { item: mid(shapes), kind: 'bounce' })
    ] };
  })();

  const rainstick = (() => {
    const tube = K.rect(84, 20, 32, 112, C.card, 3), spring = K.line(Array.from({ length: 41 }, (_, i) => [100 + 12 * Math.sin(i * 0.9), 24 + i * 2.6]), '#C9D3DC', 3);
    const foil = K.line(K.wave(30, 170, 75, 5, 7), '#C9D3DC', 6), capB = K.ell(100, 132, 18, 6, C.purple), capT = K.ell(100, 20, 18, 6, C.purple);
    const deco = { a: 'dab', pts: [[92, 40, C.red], [108, 58, C.blue], [92, 76, C.yellow], [108, 94, C.green], [92, 112, C.red]], shape: 'star', r: 7, tool: 'brush' };
    const full = tube + capB + capT + done(deco);
    return { id: 'rainstick', cat: 'sensory', name: 'Rain stick', ico: '🌧️', lv: 2, min: 30, mat: [['🧻', 'a long kitchen roll tube'], ['🥈', 'kitchen foil'], ['🍚', 'a handful of rice'], ['📄', 'paper for the ends'], M.tape, M.paint, M.brush], steps: [
      S('Scrunch foil into a long snake. Twist it into a spring.', 'draw', { base: foil, s: [Array.from({ length: 41 }, (_, i) => [30 + i * 3.5, 75 + 14 * Math.sin(i * 0.9)])], c: '#9AA6B2', w: 3, tool: 'finger', guide: false }),
      S('Push the foil spring inside the tube.', 'place', { base: tube, pieces: [{ svg: `<g opacity=".7">${spring}</g>`, at: [100, 75], from: [0, -100] }] }),
      S('Tape paper over one end.', 'place', { base: tube + `<g opacity=".5">${spring}</g>`, pieces: [{ svg: capB, at: [100, 132], from: [0, 30] }] }),
      S('Pour in the rice. Tape paper over the top end too.', 'pour', { base: tube + capB, top: `<g opacity=".5">${spring}</g>`, box: [86, 22, 28, 108], grain: true, colors: ['#fff', '#F3EEE4'], lv1: 0.2, gr: 1.8, cup: [124, 4] }),
      S('Paint it with stars and stripes.', 'dab', { base: tube + capB + capT, ...deco }),
      S('Tip it slowly. Listen... it sounds like rain!', 'show', { item: mid(full), kind: 'swing' })
    ] };
  })();

  const shaker = (() => {
    const bottle = K.bottle(100, 22, 52, 106), lid = K.rect(91, 18, 18, 11, C.red, 2) + tapeP(100, 28, 24, 8);
    const deco = { a: 'dab', pts: [[88, 70, C.pink], [112, 84, C.yellow], [90, 104, C.green], [110, 112, C.purple]], shape: 'heart', r: 9, tool: 'finger' };
    return { id: 'shaker', cat: 'sensory', name: 'Bottle shaker', ico: '🪇', lv: 1, min: 10, mat: [['🍶', 'a small plastic bottle with a lid'], ['🫘', 'dry beans or rice'], M.tape, ['⭐', 'stickers']], tip: 'Try beans, then rice, then pasta. Which is loudest? Which is quietest?', steps: [
      S('Pour dry beans into the bottle.', 'pour', { base: bottle, box: [76, 60, 48, 66], grain: true, colors: ['#A0522D', '#E8C9A0', '#7A3B1A'], lv1: 0.35, gr: 3, cup: [130, 18] }),
      S('Put the lid on tight. Tape it shut.', 'place', { base: bottle + done({ a: 'pour', box: [76, 60, 48, 66], grain: true, colors: ['#A0522D', '#E8C9A0', '#7A3B1A'], lv0: 0.35, lv1: 0.35, gr: 3 }), pieces: [{ svg: lid, at: [100, 22], from: [0, -60] }] }),
      S('Stick on stickers to make it pretty.', 'dab', { base: bottle + lid, ...deco }),
      S('Shake it to the music! Fast, slow, loud, quiet.', 'show', { item: mid(bottle + lid + done(deco) + done({ a: 'pour', box: [76, 60, 48, 66], grain: true, colors: ['#A0522D', '#E8C9A0', '#7A3B1A'], lv0: 0.35, lv1: 0.35, gr: 3 })), kind: 'shake' })
    ] };
  })();

  const calmJar = (() => {
    const jar = K.rect(64, 34, 72, 96, 'rgba(220,236,250,.5)', 10), lid = K.rect(62, 24, 76, 14, C.purple, 4), box = [66, 40, 68, 88];
    const water = { box, c: '#CFE6FA', lv1: 0.55 }, glueL = { box, c: '#E9F3FC', lv0: 0.55, lv1: 0.8 };
    const glitter = { a: 'sprinkle', box: [70, 62, 60, 60], colors: [C.pink, C.yellow, C.purple, '#fff'], n: 40 };
    const all = done({ a: 'pour', ...glueL, lv0: 0.8 }) + done(glitter);
    return { id: 'calmjar', cat: 'sensory', name: 'Calm-down glitter jar', ico: '✨', lv: 1, min: 10, mat: [['🫙', 'a plastic jar or bottle'], ['💧', 'warm water'], ['🧴', 'clear glue'], ['✨', 'glitter'], ['🎨', 'a drop of food coloring']], tip: 'When feelings are big, shake the jar and breathe slowly until the glitter settles.', steps: [
      S('Pour warm water into the jar, half way up.', 'pour', { base: jar, ...water, cup: [134, 12] }),
      S('Pour in clear glue. It makes the glitter fall slowly.', 'pour', { base: jar, ...glueL, cup: [134, 12], cupC: '#fff' }),
      S('Shake in lots of glitter.', 'sprinkle', { base: jar + done({ a: 'pour', ...glueL, lv0: 0.8 }), ...glitter }),
      S('A grown-up glues the lid on tight.', 'glue', { base: jar + all, dots: [[66, 36], [84, 34], [100, 34], [116, 34], [134, 36]], r: 3 }),
      S('Put the lid on. Shake it, then breathe slowly and watch it settle.', 'place', { base: jar + all, pieces: [{ svg: lid, at: [100, 31], from: [0, -50] }] }),
      S('Calm and sparkly.', 'show', { item: mid(jar + all + lid), kind: 'float' })
    ] };
  })();

  const texture = (() => {
    const card = K.sheet(30, 15, 140, 120, '#fff'), lines = [[[100, 15], [100, 135]], [[30, 75], [170, 75]]];
    const soft = [0, 1, 2, 3, 4, 5].map(i => K.circ(46 + (i % 3) * 14, 34 + Math.floor(i / 3) * 18, 9, '#FFF', 1)).join('');
    const foil = K.rect(108, 22, 56, 46, '#C9D3DC', 3) + K.line(K.zig(112, 160, 50, 6, 5), '#fff', 1.4);
    const bumpy = K.rect(36, 82, 56, 46, '#B6E05A', 3) + Array.from({ length: 12 }, (_, i) => K.circ(44 + (i % 4) * 13, 92 + Math.floor(i / 4) * 13, 4, '#9ACB44', 1)).join('');
    const scratch = K.rect(108, 82, 56, 46, '#C9A06A', 3) + Array.from({ length: 30 }, (_, i) => K.circ(112 + (i * 37 % 48), 86 + (i * 53 % 38), 0.9, '#7A5A3A', 0)).join('');
    const all = card + lines.map(l => K.line(l, K.OL, 1.4)).join('') + soft + foil + bumpy + scratch;
    return { id: 'texture', cat: 'sensory', name: 'Touch-and-feel board', ico: '🖐️', lv: 1, min: 15, mat: [M.card, M.glue, ['🧸', 'soft, bumpy, smooth and scratchy bits: cotton wool, foil, bubble wrap, sandpaper']], tip: 'Talk about the words: soft, rough, smooth, bumpy, crinkly. Then play a blindfold guessing game.', steps: [
      S('Draw a cross to make four boxes on the card.', 'draw', { base: card, s: lines, tool: 'pen' }),
      S('Put glue in each box.', 'glue', { base: card + lines.map(l => K.line(l, K.OL, 1.4)).join(''), dots: [[64, 44], [136, 44], [64, 104], [136, 104]], r: 6 }),
      S('Stick on something soft, something smooth, something bumpy and something scratchy.', 'place', { base: card + lines.map(l => K.line(l, K.OL, 1.4)).join(''), pieces: [{ svg: soft, at: [60, 42], from: [-40, -40] }, { svg: foil, at: [136, 45], from: [40, -40] }, { svg: bumpy, at: [64, 105], from: [-40, 40] }, { svg: scratch, at: [136, 105], from: [40, 40] }] }),
      S('Close your eyes and touch. Which one is soft? Which is bumpy?', 'show', { item: mid(all), kind: 'glow' })
    ] };
  })();

  const cloudDough = (() => {
    const flour = { grain: true, colors: flourC, lv1: 0.5, gr: 2 }, flourIn = done({ a: 'pour', box: BOWL.box, clip: BOWL.clip, ...flour, lv0: 0.5 });
    const castle = K.rect(70, 60, 60, 50, '#F3EEE4', 3) + K.rect(64, 44, 18, 20, '#F3EEE4', 2) + K.rect(118, 44, 18, 20, '#F3EEE4', 2) + K.rect(92, 84, 16, 26, '#D9CDB8', 6);
    return { id: 'clouddough', cat: 'sensory', name: 'Cloud dough', ico: '☁️', lv: 1, min: 10, mat: [['🌾', '8 spoons of flour'], ['🫒', '1 spoon of cooking oil'], M.bowl], tip: 'Play on a tray or a big baking tin. It brushes off clothes easily.', steps: [
      pourBowl('Pour the flour into a bowl.', flour),
      pourBowl('Add one spoon of oil.', { under: flourIn, c: '#F7E08A', lv0: 0.5, lv1: 0.56 }),
      S('Mix it with your fingers until it feels silky.', 'stir', { c0: '#FFFFFF', c1: '#F3EEE4', bits: ['#F7E08A', '#F7E08A'] }),
      S('Squeeze it: it holds a shape! Crumble it: soft like a cloud.', 'clay', { mode: 'ball', c: '#F3EEE4', r: 28 }),
      S('Press it into cups and build a castle!', 'show', { item: mid(castle), kind: 'bounce' })
    ] };
  })();

  const pompom = (() => {
    const fork = K.rect(96, 92, 8, 48, '#C9D3DC', 3) + [80, 92, 108, 120].map(x => K.rect(x - 2, 30, 4, 66, '#C9D3DC', 2)).join('') + K.rect(78, 88, 46, 8, '#C9D3DC', 3);
    const wrapped = Array.from({ length: 14 }, (_, i) => K.line([[74, 50 + i * 2.6], [128, 52 + i * 2.6]], C.red, 3)).join('');
    const loops = [[[76, 50], [62, 62], [76, 82]], [[126, 50], [140, 62], [126, 82]]];
    const pp = Array.from({ length: 40 }, (_, i) => { const a = i / 40 * Math.PI * 2, r = 26 + (i % 3) * 3; return K.line([[100, 75], [100 + r * Math.cos(a), 75 + r * Math.sin(a)]], i % 2 ? C.red : '#E0503F', 3); }).join('') + K.circ(100, 75, 18, C.red, 0);
    return { id: 'pompom', cat: 'string', name: 'Fork pom-poms', ico: '🧶', lv: 3, min: 20, mat: [M.wool, ['🍴', 'a fork'], M.scissors], tip: 'More wraps make a fluffier pom-pom. Stick two on a headband for monster ears!', steps: [
      S('Wrap wool round and round the fork. About 50 times!', 'wrap', { base: fork, box: [74, 50, 54, 36], c: C.red, n: 14 }),
      S('Slide a piece of wool through the middle gap. Tie it tight.', 'knot', { base: fork + wrapped, at: [100, 68], c: C.red }),
      S('Slide it off the fork. Cut through all the loops on both sides.', 'cut', { base: wrapped + K.circ(100, 68, 4, C.red), cuts: loops }),
      S('Fluff it up and trim it round.', 'clay', { mode: 'ball', c: C.red, r: 26, at: [100, 80] }),
      S('A fluffy pom-pom!', 'show', { item: mid(pp), kind: 'bounce' })
    ] };
  })();

  /* ================= building & engineering ================= */
  const book = (x, y, w, c) => K.rect(x, y, w, 12, c, 2) + K.line([[x + 4, y + 9], [x + w - 4, y + 9]], 'rgba(255,255,255,.6)', 1.2);
  const bridge = (() => {
    const lb = [C.red, C.blue, C.green], books = (side) => lb.map((c, i) => ({ svg: book(side ? 130 : 20, 120 - i * 12, 50, c), at: [side ? 155 : 45, 126 - i * 12] }));
    const piles = [...books(0), ...books(1)].map(p => p.svg).join(''), coin = (x, y) => K.ell(x, y, 8, 3.5, C.yellow, 1.2);
    const flat = [[60, 84], [140, 84], [140, 88], [60, 88]], sag = [[60, 84], [100, 100], [140, 84], [140, 88], [100, 104], [60, 88]];
    const zigTop = K.zig(66, 134, 84, 10, 6), zig = [[60, 84], ...zigTop.map(([x, y]) => [x, y + 10]), [140, 84], [140, 88], [60, 88]];
    const zp = K.poly([[66, 84], ...K.zig(66, 134, 84, -12, 6).slice(1), [134, 84]], '#fff');
    return { id: 'bridge', cat: 'build', name: 'Paper bridge challenge', ico: '🌉', lv: 2, min: 20, mat: [M.paper, ['📚', '6 books'], ['🪙', 'coins']], tip: 'Ask first: "How many coins will it hold?" Guess, test, then try a new fold. That is real engineering.', steps: [
      S('Make two piles of books with a gap in the middle.', 'stack', { pieces: [...books(0), ...books(1)].sort((a, b) => b.at[1] - a.at[1]) }),
      S('Lay flat paper over the gap and put on a coin. Oops, it sags!', 'morph', { base: piles, from: [{ p: flat, c: '#fff' }], to: [{ p: sag, c: '#fff' }], topEnd: coin(100, 98) }),
      S('Fold the paper into a zigzag, like a fan.', 'morph', { base: piles, from: [{ p: [[60, 84], [140, 84], [140, 88], [60, 88]], c: '#fff' }], to: [{ p: [[66, 84], ...K.zig(66, 134, 84, -12, 6).slice(1), [134, 84]], c: '#fff' }] }),
      S('Lay it over the gap. Add coins one by one. How many can it hold?', 'stack', { base: piles + zp, pieces: [0, 1, 2, 3, 4].map(i => ({ svg: coin(100 + (i % 2 ? 4 : -4), 70 - i * 4), at: [100, 70 - i * 4] })) }),
      S('Zigzags make paper strong! Real bridges use shapes too.', 'show', { item: mid(piles + zp + [0, 1, 2, 3, 4].map(i => coin(100 + (i % 2 ? 4 : -4), 70 - i * 4)).join('')), kind: 'glow' })
    ] };
  })();

  const cupTower = (() => {
    const cup = (x, y, c) => K.poly([[x - 13, y], [x + 13, y], [x + 9, y - 24], [x - 9, y - 24]], c) + K.rect(x - 14, y - 3, 28, 4, '#fff', 1);
    const cols = [C.red, C.blue, C.yellow, C.green], rows = [4, 3, 2, 1];
    const piece = (r, i) => ({ svg: cup(100 + (i - (rows[r] - 1) / 2) * 30, 132 - r * 26, cols[r]), at: [100 + (i - (rows[r] - 1) / 2) * 30, 120 - r * 26] });
    const rowP = r => Array.from({ length: rows[r] }, (_, i) => piece(r, i)), svg = rs => rs.flatMap(rowP).map(p => p.svg).join('');
    return { id: 'cuptower', cat: 'build', name: 'Cup pyramid', ico: '🥤', lv: 1, min: 10, mat: [['🥤', '10 paper or plastic cups'], ['🟨', 'card for floors (for a bigger tower)']], tip: 'Knocking it down is half the fun! Count the cups in each row together: 4, 3, 2, 1.', steps: [
      S('Put 4 cups in a row, upside down.', 'stack', { pieces: rowP(0) }),
      S('Put 3 cups on top, then 2.', 'stack', { base: svg([0]), pieces: [...rowP(1), ...rowP(2)] }),
      S('One cup on the very top. A pyramid!', 'stack', { base: svg([0, 1, 2]), pieces: rowP(3) }),
      S('Can you build it higher? Try card floors between rows!', 'show', { item: mid(svg([0, 1, 2, 3])), kind: 'wiggle' })
    ] };
  })();

  const catapult = (() => {
    const pile = [0, 1, 2, 3, 4].map(i => ({ svg: stick(100, 120 - i * 5, 0, 90), at: [100, 120 - i * 5] }));
    const pileS = pile.map(p => p.svg).join(''), bands = K.rect(60, 96, 6, 30, C.orange, 2) + K.rect(134, 96, 6, 30, C.orange, 2);
    const base = K.g(pileS + bands, 30, 0, 0.6), arm = K.rect(30, 104, 110, 7, C.tan, 3), spoonS = K.ell(44, 100, 9, 5, '#C9D3DC') + K.rect(48, 98, 34, 4, '#C9D3DC', 2);
    const cat = K.g(pileS, 10, 20, 0.7) + K.line([[60, 112], [140, 112]], K.OL, 0);
    return { id: 'catapult', cat: 'build', name: 'Spoon catapult', ico: '🥄', lv: 3, min: 25, mat: [['🪵', '7 craft sticks'], ['➰', 'rubber bands'], ['🥄', 'a plastic spoon'], ['🎀', 'pom-poms'], M.tape], safe: 'Only fire soft pom-poms, never at faces.', tip: 'Science: pushing the spoon down stores energy, letting go turns it into movement. Try a cup as a target!', steps: [
      S('Stack 5 craft sticks. Wrap a rubber band round each end.', 'stack', { pieces: pile }),
      S('Band two more sticks together at one end only.', 'wrap', { base: stick(100, 60, 0, 120) + stick(100, 72, 0, 120), box: [150, 56, 8, 20], c: C.orange, n: 5 }),
      S('Slide the stack between the two sticks, near the band. Band it in a cross.', 'place', { base: stick(100, 60, -8, 120) + stick(100, 76, 0, 120), pieces: [{ svg: K.g(pileS, 0, -40, 1), at: [100, 72], from: [0, 50] }] }),
      S('Tape the spoon onto the end of the top stick.', 'place', { base: arm, pieces: [{ svg: spoonS + tapeP(70, 100, 12, 10), at: [60, 100], from: [-40, -40] }] }),
      S('Put a pom-pom in the spoon. Push down, let go!', 'launch', { base: cat, at: [130, 108], arm: 70, c: C.pink, target: [180, 124] }),
      S('Whee! How far can it fly? Try to land it in a cup.', 'show', { base: cat + `<g transform="rotate(8 130 108)">${K.rect(60, 105, 70, 6, C.tan, 2)}${K.ell(60, 102, 9, 5, '#C9D3DC', 1.3)}</g>` + K.poly([[168, 128], [192, 128], [188, 106], [172, 106]], C.blue), item: K.circ(0, 0, 7, C.pink, 1.3), kind: 'fly', at: [100, 60] })
    ] };
  })();

  const toothpick = (() => {
    const ball = (x, y) => K.circ(x, y, 6, C.orange), pick = (a, b) => K.line([a, b], '#C9A06A', 3);
    const triP = [[50, 110], [90, 110], [70, 76]], tri = pick(triP[0], triP[1]) + pick(triP[1], triP[2]) + pick(triP[2], triP[0]) + triP.map(p => ball(...p)).join('');
    const sqP = [[110, 110], [150, 110], [150, 70], [110, 70]], sq = sqP.map((p, i) => pick(p, sqP[(i + 1) % 4])).join('') + sqP.map(p => ball(...p)).join('');
    const top = sqP.map(([x, y]) => [x + 16, y - 26]), cube = sqP.map((p, i) => pick(p, top[i])).join('') + top.map((p, i) => pick(p, top[(i + 1) % 4])).join('') + top.map(p => ball(...p)).join('');
    return { id: 'toothpicks', cat: 'build', name: 'Toothpick shape builder', ico: '🔺', lv: 2, min: 20, mat: [['🥢', 'toothpicks'], ['🟠', 'little balls of playdough']], tip: 'Push a triangle and a square gently: the square squashes flat, the triangle stays strong. That is why towers use triangles.', steps: [
      S('Roll lots of little playdough balls.', 'clay', { mode: 'ball', c: C.orange, r: 14 }),
      S('Join 3 toothpicks with 3 balls. A triangle!', 'place', { pieces: [{ svg: tri, at: [70, 95], from: [-40, -60] }] }),
      S('Now 4 toothpicks and 4 balls. A square!', 'place', { base: tri, pieces: [{ svg: sq, at: [130, 90], from: [40, -60] }] }),
      S('Stand toothpicks up on the square and join the tops. A cube!', 'stack', { base: tri + sq, pieces: [{ svg: cube, at: [140, 60], h: 60 }] }),
      S('Push gently. Which is stronger, the triangle or the square?', 'show', { item: mid(tri + sq + cube), kind: 'wiggle' })
    ] };
  })();

  const balloonCar = (() => {
    const body = K.rect(50, 70, 100, 34, '#DCEBFF', 10) + K.rect(144, 78, 14, 18, C.red, 3), straws = K.rect(56, 104, 6, 6, '#fff', 1) + K.rect(132, 104, 6, 6, '#fff', 1);
    const axles = K.line([[59, 107], [59, 107]], K.OL, 2) + K.line([[135, 107], [135, 107]], K.OL, 2), lidsFlat = [[40, 50], [80, 50], [120, 50], [160, 50]];
    const wheels = K.wheel(59, 110, 13) + K.wheel(135, 110, 13), strawTop = K.rect(60, 64, 80, 5, '#fff', 2) + tapeP(100, 66, 14, 10);
    const balloon = r => K.ell(58 - r * 0.6, 60 - r * 0.3, r, r * 0.8, C.red) + K.poly([[60, 64], [56, 60], [56, 68]], C.red, 1);
    const car = body + straws + axles + wheels + strawTop;
    return { id: 'ballooncar', cat: 'build', name: 'Balloon-powered car', ico: '🎈', lv: 4, min: 60, mat: [['🍶', 'a small plastic bottle'], ['🥤', '3 straws'], ['🍢', '2 wooden skewers (a grown-up cuts)'], ['🔴', '4 bottle lids'], ['🎈', 'a balloon'], M.tape, ['📌', 'a pin (a grown-up pokes holes)']], tip: 'If it will not roll, check the wheels spin freely and the straws are straight. Engineers fix and try again!', steps: [
      S('Tape two straws across the bottom of the bottle.', 'place', { base: body, pieces: [{ svg: straws, at: [96, 107], from: [0, 40] }] }),
      S('A grown-up pokes a hole in the middle of each lid.', 'punch', { base: lidsFlat.map(([x, y]) => K.circ(x, y, 13, C.red)).join(''), holes: lidsFlat, r: 2.6 }),
      S('Push a skewer through each straw. Push a lid wheel onto every end.', 'place', { base: body + straws, pieces: [{ svg: K.wheel(59, 110, 13), at: [59, 110], from: [-40, 20] }, { svg: K.wheel(135, 110, 13), at: [135, 110], from: [40, 20] }] }),
      S('Tape a balloon onto a straw. Tape the straw on top of the car.', 'place', { base: body + straws + wheels, pieces: [{ svg: strawTop + balloon(6), at: [90, 66], from: [0, -50] }] }),
      S('Blow up the balloon through the straw. Pinch the straw closed.', 'morph', { base: car, from: [{ p: K.arc(54, 58, 6, 5, 0, 360, 20), c: C.red }], to: [{ p: K.arc(40, 54, 24, 19, 0, 360, 20), c: C.red }] }),
      S('Put it down and let go. Zoom!', 'show', { item: mid(car + balloon(24)), kind: 'drive', at: [100, 75] })
    ] };
  })();

  const marbleRun = (() => {
    const board = K.rect(25, 10, 150, 125, C.card, 3), tube = K.tube(100, 30, 34, 90);
    const ramps = [[60, 34, 12], [134, 62, -12], [66, 90, 12]], rampS = ramps.map(([x, y, r]) => K.g(K.path('M-34,0 A34,10 0 0 0 34,0', '#C9965E') + K.line([[-34, 0], [34, 0]], K.OL, 1.4), x, y, 1, r)).join('');
    const cupB = K.poly([[132, 128], [156, 128], [160, 106], [128, 106]], C.blue);
    const path = [[30, 26], [92, 40], [100, 52], [102, 56], [168, 54], [104, 70], [100, 78], [34, 84], [96, 98], [140, 108], [144, 116]];
    return { id: 'marblerun', cat: 'build', name: 'Tube marble run', ico: '🎢', lv: 3, min: 40, mat: [['🧻', '4 or more toilet roll tubes'], M.scissors, M.tape, ['📦', 'a big box side or a door'], ['🔵', 'a marble'], ['🥤', 'a cup']], tip: 'Test as you build: every ramp should tip a little more downhill than you think.', steps: [
      S('Cut each tube in half the long way. Now they are ramps.', 'cut', { base: tube, pts: [[100, 30], [100, 124]] }),
      S('Tape the ramps onto the box in a zigzag, going down.', 'place', { base: board, pieces: ramps.map(([x, y, r], i) => ({ svg: K.g(K.path('M-34,0 A34,10 0 0 0 34,0', '#C9965E') + K.line([[-34, 0], [34, 0]], K.OL, 1.4), x, y, 1, r), at: [x, y], from: [i % 2 ? 50 : -50, -30] })) }),
      S('Tape a cup at the bottom to catch the marble.', 'place', { base: board + rampS, pieces: [{ svg: cupB, at: [144, 118], from: [40, 20] }] }),
      S('Drop the marble in at the top. Watch it zigzag down!', 'draw', { base: board + rampS + cupB, s: [path], c: 'rgba(46,139,230,.35)', w: 2, tool: 'marble', guide: false }),
      S('Clatter, roll, plop! Make it longer!', 'show', { item: mid(board + rampS + cupB + K.circ(144, 112, 6, C.blue, 1.3)), kind: 'glow' })
    ] };
  })();

  const paperTower = (() => {
    const tubeP = [[96, 20], [104, 20], [104, 130], [96, 130]], rollT = (a, b) => K.line([a, b], '#DDD7C8', 6) + K.line([a, b], 'rgba(34,48,90,.35)', 1);
    const triB = rollT([60, 128], [140, 128]) + rollT([60, 128], [100, 112]) + rollT([140, 128], [100, 112]);
    const lv1 = rollT([60, 128], [80, 80]) + rollT([140, 128], [120, 80]) + rollT([100, 112], [100, 78]) + rollT([80, 80], [120, 80]);
    const lv2 = rollT([80, 80], [92, 40]) + rollT([120, 80], [108, 40]) + rollT([100, 78], [100, 22]) + rollT([92, 40], [108, 40]);
    const tower = triB + lv1 + lv2;
    return { id: 'papertower', cat: 'build', name: 'Newspaper tower', ico: '🗼', lv: 4, min: 45, mat: [M.news, M.tape, ['📏', 'a tape measure']], tip: 'Set a challenge: the tallest tower that can hold a book on top. Triangles are the secret.', steps: [
      S('Roll a sheet of newspaper into a tight tube, from the corner. Tape it.', 'morph', { from: [{ p: [[40, 20], [160, 20], [160, 130], [40, 130]], c: '#EDE7D9' }], to: [{ p: tubeP, c: '#DDD7C8' }] }),
      S('Make lots of tubes. Tape 3 into a triangle on the floor.', 'stack', { pieces: [{ svg: triB, at: [100, 120], h: 60 }] }),
      S('Tape a tube standing up at each corner. Lean them in and join the tops.', 'stack', { base: triB, pieces: [{ svg: lv1, at: [100, 80], h: 60 }] }),
      S('Add more triangles, higher and higher.', 'stack', { base: triB + lv1, pieces: [{ svg: lv2, at: [100, 40], h: 50 }] }),
      S('Measure your tower. Can you beat it next time?', 'measure', { base: tower, from: [170, 130], to: [170, 22], n: 5 }),
      S('A tower made of newspaper!', 'show', { item: mid(tower), kind: 'wiggle' })
    ] };
  })();

  const raft = (() => {
    const deck = Array.from({ length: 8 }, (_, i) => ({ svg: K.rect(52 + i * 12, 60, 11, 60, C.tan, 3), at: [57 + i * 12, 90], h: 60 }));
    const deckS = deck.map(p => p.svg).join(''), cross = K.rect(44, 70, 112, 9, '#C9A06A', 3) + K.rect(44, 102, 112, 9, '#C9A06A', 3);
    const sail = K.poly([[100, 20], [100, 66], [138, 60]], C.red) + K.rect(98, 18, 4, 72, '#fff', 1);
    const all = deckS + cross + sail, water = K.line(K.wave(10, 190, 126, 3, 5), C.blue, 3);
    return { id: 'raft', cat: 'build', name: 'Craft stick raft', ico: '🛶', lv: 2, min: 25, mat: [['🪵', '10 craft sticks'], M.pva, ['🥤', 'a straw'], M.paper, M.scissors, M.tape], tip: 'Let the glue dry overnight before the boat test. Does it float? Can it carry a toy?', steps: [
      S('Lay 8 sticks side by side.', 'stack', { pieces: deck }),
      S('Put glue across the sticks in two lines.', 'glue', { base: deckS, dots: [56, 80, 104, 128, 152].flatMap(x => [[x - 4, 74], [x - 4, 106]]), r: 3 }),
      S('Press 2 sticks across them. Let it dry.', 'place', { base: deckS, pieces: [{ svg: cross, at: [100, 90], from: [0, -60] }] }),
      S('Cut a paper sail, tape it to a straw and push it between the sticks.', 'place', { base: deckS + cross, pieces: [{ svg: sail, at: [100, 50], from: [0, -60] }] }),
      S('Float it in the bath or a puddle. Ahoy!', 'show', { item: mid(K.g(all, 0, -10)) + K.g(water, -100, -30), kind: 'float' })
    ] };
  })();

  /* ================= gifts for family ================= */
  const frame = (() => {
    const sticks = [{ svg: stick(100, 34, 0, 110), at: [100, 34] }, { svg: stick(100, 116, 0, 110), at: [100, 116] }, { svg: stick(54, 75, 90, 100), at: [54, 75] }, { svg: stick(146, 75, 90, 100), at: [146, 75] }];
    const plain = sticks.map(p => p.svg).join(''), paintS = [stick(100, 34, 0, 110, C.pink), stick(100, 116, 0, 110, C.pink), stick(54, 75, 90, 100, C.pink), stick(146, 75, 90, 100, C.pink)].join('');
    const deco = { a: 'dab', pts: [[54, 40, C.red], [100, 34, C.yellow], [146, 40, C.blue], [146, 110, C.red], [100, 116, C.purple], [54, 110, C.yellow]], shape: 'heart', r: 8, tool: 'finger' };
    const photo = K.rect(60, 40, 80, 70, C.sky, 2) + K.circ(100, 70, 14, '#F6D3B3') + K.eyes(100, 68, 2.4, 8) + K.smile(100, 74, 5) + K.rect(84, 86, 32, 24, C.red, 4);
    return { id: 'stickframe', cat: 'gifts', name: 'Craft stick photo frame', ico: '🖼️', lv: 1, min: 20, mat: [['🪵', '4 craft sticks'], M.pva, M.paint, M.brush, ['⭐', 'stickers or buttons'], ['📷', 'a photo or a drawing'], M.tape], steps: [
      S('Glue 4 sticks into a square.', 'stack', { pieces: sticks }),
      S('Paint the frame your favorite color.', 'paint', { base: plain, area: paintS, box: [44, 28, 112, 94], c: C.pink }),
      S('Stick on hearts, stickers or buttons.', 'dab', { base: paintS, ...deco }),
      S('Tape a photo or a drawing on the back.', 'place', { base: '', top: paintS + done(deco), pieces: [{ svg: photo, at: [100, 75], from: [0, 70] }] }),
      S('A present for someone you love!', 'show', { item: mid(photo + paintS + done(deco)), kind: 'bounce' })
    ] };
  })();

  const coupons = (() => {
    const sheetS = K.sheet(30, 30, 140, 90, '#FFF2D9'), cuts = [[[30, 60], [170, 60]], [[30, 90], [170, 90]], [[100, 30], [100, 120]]];
    const tix = [[30, 30], [100, 30], [30, 60], [100, 60], [30, 90], [100, 90]].map(([x, y], i) => K.rect(x + 2, y + 2, 66, 26, ['#FFF2D9', '#FDE0DB', '#D9EBFC'][i % 3], 3)).join('');
    const pics = K.heart(52, 46, 7, C.red) + K.emo('🎵', 122, 45, 14) + K.emo('🧹', 52, 75, 14) + K.emo('🤗', 122, 75, 14) + K.emo('🍪', 52, 105, 14) + K.emo('📚', 122, 105, 14);
    const words = [[64, 46], [134, 46], [64, 76], [134, 76], [64, 106], [134, 106]].map(([x, y]) => K.wave(x, x + 28, y, 1.5, 2, 10));
    const holes = [[36, 36], [106, 36], [36, 66], [106, 66], [36, 96], [106, 96]];
    const book = K.rect(60, 50, 80, 40, '#FFF2D9', 3) + K.rect(64, 46, 80, 40, '#FDE0DB', 3) + K.rect(68, 42, 80, 40, '#D9EBFC', 3) + K.emo('🤗', 92, 62, 18) + K.line(K.wave(104, 136, 62, 1.5, 2, 10), K.OL, 2) + K.hole(74, 48);
    return { id: 'coupons', cat: 'gifts', name: 'Hug coupon book', ico: '🎟️', lv: 1, min: 20, mat: [M.paper, M.scissors, M.crayons, M.punch, M.ribbon], tip: 'Help write the words: "1 big hug", "I tidy my toys", "a song for you". Grown-ups: please cash them in!', steps: [
      S('Cut paper into six little tickets.', 'cut', { base: sheetS, cuts }),
      S('Draw a gift on each one: a hug, a song, tidying up!', 'draw', { base: tix, s: words, c: C.red, tool: 'pen', guide: false, fill: pics }),
      S('Punch a hole in the corner of each ticket.', 'punch', { base: tix + pics + words.map(w => K.line(w, C.red, 2)).join(''), holes }),
      S('Stack them and tie a ribbon through the holes.', 'tie', { base: book, at: [74, 48], c: C.pink }),
      S('Give your coupon book to someone special!', 'show', { item: mid(book + K.circ(74, 48, 3.5, C.pink)), kind: 'bounce' })
    ] };
  })();

  const flowerPot = (() => {
    const potP = [[64, 70], [136, 70], [126, 128], [74, 128]], rim = c => K.rect(58, 60, 84, 16, c, 3), pot = c => K.poly(potP, c) + rim(c);
    const dots = { a: 'dab', pts: [[80, 90, '#fff'], [100, 98, C.yellow], [120, 90, '#fff'], [86, 114, C.yellow], [114, 114, '#fff'], [70, 68, C.yellow], [100, 68, '#fff'], [130, 68, C.yellow]], shape: 'dot', r: 4, tool: 'cork' };
    const blue = pot(C.blue), plant = K.line([[100, 62], [100, 26]], C.green, 3) + K.leaf(88, 46, 9, C.green, -30) + K.leaf(112, 40, 9, C.green, 30) + [0, 72, 144, 216, 288].map(a => K.ell(100 + 8 * Math.cos(a * Math.PI / 180), 22 + 8 * Math.sin(a * Math.PI / 180), 6, 6, C.pink, 1)).join('') + K.circ(100, 22, 4, C.yellow);
    return { id: 'flowerpot', cat: 'gifts', name: 'Painted flower pot', ico: '🪴', lv: 2, min: 30, mat: [['🪴', 'a small clay pot'], M.paint, M.brush, ['🍾', 'a cork'], ['🟫', 'soil'], ['🌼', 'a small plant or seeds']], tip: 'Acrylic paint lasts best on clay pots. A grown-up can spray clear varnish after.', steps: [
      S('Paint the pot all over. Let it dry.', 'paint', { base: pot('#C8744B'), area: blue, box: [58, 60, 84, 70], c: C.blue }),
      S('Dip a cork in paint and dot patterns.', 'dab', { base: blue, ...dots }),
      S('Fill it with soil.', 'pour', { base: blue + done(dots), box: [62, 62, 76, 12], grain: true, colors: ['#6B4A2E', '#5A3D26'], lv1: 0.9, gr: 2.4, cup: [150, 40], clip: 'M58,60 L142,60 L142,76 L58,76Z' }),
      S('Plant a little flower and water it.', 'place', { base: blue + done(dots) + K.rect(60, 60, 80, 8, '#6B4A2E', 3), pieces: [{ svg: plant, at: [100, 44], from: [0, -60] }] }),
      S('A gift that grows!', 'show', { item: mid(plant + blue + done(dots) + K.rect(60, 60, 80, 8, '#6B4A2E', 3)), kind: 'glow' })
    ] };
  })();

  const tasselMark = (() => {
    const strip = K.rect(80, 15, 40, 120, '#fff', 3), card = K.sheet(40, 15, 120, 120, '#fff');
    const pattern = [K.wave(84, 116, 50, 3, 2), K.wave(84, 116, 70, 3, 2), K.wave(84, 116, 90, 3, 2), K.wave(84, 116, 110, 3, 2)];
    const pat = pattern.map((p, i) => K.line(p, [C.red, C.blue, C.green, C.purple][i], 2.6)).join('');
    const tassel = Array.from({ length: 7 }, (_, i) => K.line([[100, 32], [92 + i * 2.6, 12 + (i % 2) * 2]], C.purple, 2)).join('') + K.circ(100, 22, 3, C.purple);
    return { id: 'tassel', cat: 'gifts', name: 'Bookmark with a tassel', ico: '🔖', lv: 2, min: 25, mat: [M.card, M.ruler, M.pencil, M.scissors, M.pens, M.punch, M.wool], steps: [
      S('Measure a long strip on the card, as wide as two fingers.', 'measure', { base: card, from: [80, 15], to: [80, 135], n: 6 }),
      S('Cut out the strip.', 'cut', { base: card, cuts: [[[80, 15], [80, 135]], [[120, 15], [120, 135]]] }),
      S('Draw wavy patterns all down it.', 'draw', { base: strip, s: pattern, tool: 'pen', c: C.red, guide: false }),
      S('Punch a hole at the top.', 'punch', { base: strip + pat, holes: [[100, 26]] }),
      S('Wrap wool round your fingers. Tie it through the hole. Snip the loops.', 'knot', { base: strip + pat + K.hole(100, 26), at: [100, 22], c: C.purple }),
      S('A bookmark for a book lover!', 'show', { item: mid(strip + pat + K.hole(100, 26) + tassel), kind: 'swing' })
    ] };
  })();

  const handprint = (() => {
    const flour = { grain: true, colors: flourC, lv1: 0.4, gr: 2 }, flourIn = done({ a: 'pour', box: BOWL.box, clip: BOWL.clip, ...flour, lv0: 0.4 });
    const disc = K.ell(100, 90, 60, 26, '#F3E6CF'), hand = `<g opacity=".55">${K.g(K.emo('✋', 0, 0, 52), 100, 86, 1)}</g>`, print = K.ell(100, 90, 60, 26, '#F3E6CF') + `<g opacity=".35" style="filter:grayscale(1)">${K.emo('✋', 100, 86, 50)}</g>`;
    const painted = K.ell(100, 90, 60, 26, C.sky) + `<g opacity=".7">${K.emo('✋', 100, 86, 50)}</g>` + K.line(K.wave(52, 148, 108, 2, 4), '#fff', 2);
    return { id: 'handprint', cat: 'gifts', name: 'Salt dough handprint', ico: '🖐️', lv: 3, min: 45, mat: [['🌾', '1 cup of flour'], ['🧂', 'half a cup of salt'], ['💧', 'half a cup of water'], M.bowl, ['♨️', 'an oven (a grown-up bakes it)'], M.paint, M.brush], tip: 'Bake low and slow (about 120°C for 2–3 hours) until hard. Write the date on the back: a keepsake for years.', steps: [
      pourBowl('Pour the flour and salt into a bowl.', flour),
      pourBowl('Add water, a little at a time.', { under: flourIn, c: '#DCEBFF', lv0: 0.4, lv1: 0.5 }),
      S('Stir, then squish it with your hands into a smooth dough.', 'stir', { c0: '#FFFFFF', c1: '#F3E6CF', bits: ['#DCEBFF'] }),
      S('Roll it out flat, like a big cookie.', 'clay', { mode: 'flat', c: '#F3E6CF', r: 32, at: [100, 90] }),
      S('Press your hand in hard, then lift it up.', 'stamp', { base: disc, at: [100, 86], item: K.emo('✋', 0, 0, 52), print }),
      S('A grown-up bakes it slowly until it is hard.', 'oven', { item: K.g(print, -100, -90) }),
      S('When it is cool, paint it. A gift for grandma!', 'paint', { base: print, area: painted, box: [40, 62, 120, 56], c: C.sky }),
      S('Your hand, kept forever!', 'show', { item: mid(painted), kind: 'glow' })
    ] };
  })();

  const garland = (() => {
    const B = K.ori(C.pink, '#F9C5DC', [[60, 30], [140, 30], [140, 120], [60, 120]]);
    const s1 = B.fold('Fold a square of paper in half.', { from: [60, 75], to: [140, 75] });
    const half = [[100, 52], [108, 42], [120, 39], [132, 46], [136, 60], [128, 80], [114, 96], [100, 110]];
    const cols = [C.red, C.pink, C.purple, C.orange, C.red], str = K.path('M10,40 Q100,80 190,40', 'none', 0, `stroke="${K.OL}" stroke-width="1.8"`);
    const hp = i => { const x = 30 + i * 35, y = 40 + 40 * (1 - Math.pow((x - 100) / 90, 2)) * 0.5 + 8; return K.heart(x, y + 10, 12, cols[i]) + tapeP(x, y, 12, 6); };
    const hearts = [0, 1, 2, 3, 4].map(hp).join('');
    return { id: 'garland', cat: 'gifts', name: 'Heart garland', ico: '💕', lv: 1, min: 20, mat: [M.color, M.pencil, M.scissors, M.wool, M.tape], tip: 'Perfect for birthdays and Mother\'s or Father\'s Day. Write a word on each heart!', steps: [
      s1,
      S('Draw half a heart on the fold, then cut it out. Make lots!', 'cut', { base: B.svg() + K.line(half, K.OL, 1.2), pts: half }),
      S('Tape the hearts onto a long string, one by one.', 'place', { base: str, pieces: [0, 1, 2, 3, 4].map(i => ({ svg: hp(i), at: [30 + i * 35, 60], from: [0, -70] })) }),
      S('Hang it up for a party!', 'show', { item: mid(str + hearts), kind: 'swing' })
    ] };
  })();

  craftsHome.add([playdough, rainstick, shaker, calmJar, texture, cloudDough, pompom,
    bridge, cupTower, catapult, toothpick, balloonCar, marbleRun, paperTower, raft,
    frame, coupons, flowerPot, tasselMark, handprint, garland]);
})();
(() => {
  const K = craftsHome.kit, C = K.C;
  const S = (t, a, o = {}) => ({ t, a, ...o });
  const mid = svg => K.g(svg, -100, -75);
  const M = {
    paper: ['📄', 'paper'], sq: ['🟦', 'square paper'], color: ['🌈', 'colored paper'], scissors: ['✂️', 'child scissors'], glue: ['🧴', 'glue stick'], pva: ['🧴', 'white glue (PVA)'],
    tape: ['🩹', 'sticky tape'], pens: ['🖊️', 'felt pens'], pencil: ['✏️', 'pencil'], paint: ['🎨', 'paint'], brush: ['🖌️', 'paintbrush'], plate: ['🍽️', 'paper plate'],
    wool: ['🧶', 'wool or string'], card: ['🟨', 'thin card'], ruler: ['📏', 'a ruler'], pipe: ['〰️', 'a pipe cleaner'], tissue: ['🎐', 'tissue paper'], ribbon: ['🎀', 'ribbons or wool']
  };
  const circlePts = (cx, cy, r, n = 20) => K.arc(cx, cy, r, r, 0, 360, n);
  const tapeP = (x, y, w = 26, h = 9) => K.rect(x - w / 2, y - h / 2, w, h, 'rgba(142,197,245,.85)', 1);
  const sheet = (c = '#fff') => K.sheet(20, 15, 160, 115, c);
  const done = s => K.still(s);
  const stick = (x, y, r = 0, len = 100, c = C.tan) => K.g(K.rect(-len / 2, -5, len, 10, c, 5), x, y, 1, r);

  /* ================= seasons: spring, summer, autumn, winter ================= */
  const tissueFlower = (() => {
    const cols = ['#F9C5DC', C.pink, '#F9C5DC', C.pink, '#F9C5DC', C.pink], sheets = cols.map((c, i) => ({ svg: K.rect(40 - i * 2, 40 + i * 4, 120, 70, c, 2), at: [100, 75 + i * 4] }));
    const fan = [[92, 30], [108, 30], [108, 120], [92, 120]], pleats = [94, 97, 100, 103, 106].map(x => K.line([[x, 30], [x, 120]], 'rgba(34,48,90,.3)', 1)).join('');
    const bow = [[70, 64], [130, 64], [130, 86], [70, 86]], twist = K.rect(96, 62, 8, 26, C.green, 3);
    const flower = Array.from({ length: 24 }, (_, i) => { const a = i / 24 * Math.PI * 2, r = 34 + (i % 2) * 6; return [100 + r * Math.cos(a), 62 + r * Math.sin(a)]; });
    const fl = K.poly(flower, C.pink) + K.poly(Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2, r = 20 + (i % 2) * 5; return [100 + r * Math.cos(a), 62 + r * Math.sin(a)]; }), '#F9C5DC') + K.circ(100, 62, 7, C.yellow);
    const stem = K.line([[100, 70], [100, 140]], C.green, 4) + K.leaf(88, 118, 10, C.green, -30);
    return { id: 'tissueflower', cat: 'season', name: 'Spring tissue flower', ico: '🌸', lv: 2, min: 15, mat: [M.tissue, M.pipe, M.scissors], tip: 'Pull each layer up very gently: tissue paper tears easily. Make a bunch for a spring table!', steps: [
      S('Stack 6 sheets of tissue paper.', 'stack', { pieces: sheets }),
      S('Fold them back and forth like a fan.', 'morph', { from: [{ p: [[40, 30], [160, 30], [160, 120], [40, 120]], c: C.pink }], to: [{ p: fan, c: C.pink }], topEnd: pleats }),
      S('Twist a pipe cleaner round the middle.', 'knot', { base: K.poly([[70, 64], [100, 72], [130, 64], [130, 86], [100, 78], [70, 86]], C.pink), at: [100, 75], c: C.green }),
      S('Round off both ends with scissors.', 'cut', { base: K.poly(bow, C.pink) + twist, cuts: [[[76, 62], [66, 75], [76, 88]], [[124, 62], [134, 75], [124, 88]]] }),
      S('Open the fan. Gently pull each layer up, one by one. Fluffy!', 'morph', { from: [{ p: bow, c: C.pink }], to: [{ p: flower, c: C.pink }], topEnd: fl }),
      S('A spring flower that never wilts!', 'show', { item: mid(stem + fl), kind: 'float' })
    ] };
  })();

  const filterFly = (() => {
    const disc = circlePts(100, 72, 46, 40), filter = K.poly(disc, '#fff') + K.circ(100, 72, 34, 'none', 1, 'stroke-dasharray="3 3"');
    const scrib = [{ p: K.wave(64, 136, 50, 4, 3), c: C.red }, { p: K.wave(60, 140, 72, 4, 3), c: C.blue }, { p: K.wave(64, 136, 94, 4, 3), c: C.yellow }, { p: K.zig(70, 130, 112, 6, 4), c: C.green }];
    const spr = { a: 'dab', pts: [[76, 52, C.red], [124, 52, C.pink], [70, 76, C.blue], [130, 76, C.purple], [84, 98, C.yellow], [116, 98, C.green], [100, 72, C.blue]], shape: 'blob', r: 15, spread: true, tool: 'dropper' };
    const wings = [[100, 72], [56, 34], [44, 64], [62, 76], [44, 92], [60, 116], [100, 76], [140, 116], [156, 92], [138, 76], [156, 64], [144, 34]];
    const clip = `<clipPath id="crff"><polygon points="${wings.map(p => p.join(',')).join(' ')}"/></clipPath>`, colors = done(spr);
    const fly = clip + K.poly(wings, '#fff') + `<g clip-path="url(#crff)">${colors}</g>` + K.rect(96, 50, 8, 50, C.brown, 3);
    const feelers = K.path('M98,52 Q90,36 84,34', 'none', 2) + K.path('M102,52 Q110,36 116,34', 'none', 2);
    return { id: 'filterfly', cat: 'season', name: 'Coffee filter butterfly', ico: '🦋', lv: 1, min: 15, mat: [['⚪', 'a coffee filter or kitchen paper'], ['🖊️', 'washable felt pens'], ['💧', 'a spray bottle or a dropper of water'], ['🪵', 'a wooden clothes peg'], M.pipe], tip: 'Washable felt pens are the ones that spread. Dry it flat on a towel.', steps: [
      S('Scribble lines and dots all over the filter.', 'draw', { base: filter, s: scrib, w: 3, tool: 'pen', guide: false }),
      S('Drip water on it. Watch the colors spread!', 'dab', { base: filter + scrib.map(x => K.line(x.p, x.c, 3)).join(''), ...spr }),
      S('When it is dry, pinch the middle and clip a peg on.', 'morph', { base: '', from: [{ p: disc, c: '#F5E6FF' }], to: [{ p: wings, c: '#F5E6FF' }], topEnd: fly }),
      S('Twist a pipe cleaner on top for feelers.', 'place', { base: fly, pieces: [{ svg: feelers, at: [100, 42], from: [0, -40] }] }),
      S('A spring butterfly!', 'show', { item: mid(fly + feelers), kind: 'fly', s: 0.7 })
    ] };
  })();

  const jellyfish = (() => {
    const plate = K.plate(100, 75, 50), halfP = [...K.arc(100, 75, 50, 50, 180, 360, 20)], half = K.poly(halfP, '#fff'), pinkH = K.poly(halfP, C.purple) + [76, 100, 124].map(x => K.circ(x, 58, 5, '#B79CF2', 0)).join('');
    const tent = [70, 85, 100, 115, 130].map((x, i) => K.line(K.wave(0, 60, 0, 4, 2, 16).map(([a, b]) => [x + b, 76 + a]), [C.pink, C.sky, C.yellow, C.pink, C.sky][i], 3.4)).join('');
    const face = K.eyes(100, 56, 4, 18) + K.smile(100, 64, 6);
    return { id: 'jellyfish', cat: 'season', name: 'Summer jellyfish', ico: '🪼', lv: 1, min: 20, mat: [M.plate, M.scissors, M.paint, M.brush, M.ribbon, M.tape, M.pens], steps: [
      S('Cut the paper plate in half.', 'cut', { base: plate, pts: [[50, 75], [150, 75]], piece: K.poly(K.arc(100, 75, 50, 50, 0, 180, 20), '#fff'), off: [0, 40] }),
      S('Paint it purple with pale spots.', 'paint', { base: half, area: pinkH, box: [50, 25, 100, 52], c: C.purple }),
      S('Tape ribbons on the back for wiggly tentacles.', 'place', { base: pinkH, pieces: [{ svg: tent, at: [100, 104], from: [0, 50] }] }),
      S('Draw a happy face.', 'draw', { base: tent + pinkH, s: [circlePts(91, 56, 4, 8), circlePts(109, 56, 4, 8), [[94, 64], [100, 69], [106, 64]]], tool: 'pen', fill: face }),
      S('Bloop, bloop! Swimming in the summer sea.', 'show', { item: mid(tent + pinkH + face), kind: 'float' })
    ] };
  })();

  const sandArt = (() => {
    const card = K.sheet(25, 15, 150, 120, '#fff'), sun = circlePts(70, 50, 24, 24), waves = [K.wave(30, 170, 100, 5, 3), K.wave(30, 170, 116, 5, 3)];
    const lines = K.line(sun, K.OL, 1.4) + waves.map(w => K.line(w, K.OL, 1.4)).join('');
    const ysand = { a: 'sprinkle', box: [48, 28, 44, 44], colors: [C.yellow, '#F7D774', C.orange], n: 70 };
    const sunS = `<clipPath id="crsun"><circle cx="70" cy="50" r="24"/></clipPath><g clip-path="url(#crsun)">${K.circ(70, 50, 24, '#FCE9A9', 0)}${done(ysand)}</g>`;
    const bsand = { a: 'sprinkle', box: [30, 96, 140, 24], colors: [C.blue, C.sky, C.teal], n: 80 };
    const all = card + sunS + done(bsand) + lines;
    return { id: 'sandart', cat: 'season', name: 'Summer sand picture', ico: '🏖️', lv: 2, min: 20, mat: [M.card, M.pencil, M.pva, M.brush, ['🏖️', 'colored sand (or salt mixed with chalk)']], tip: 'Do one color at a time and tip the extra back into its pot over a tray.', steps: [
      S('Draw a big sun and two wavy lines for the sea.', 'draw', { base: card, s: [sun, ...waves], tool: 'pen' }),
      S('Brush glue inside the sun only.', 'paint', { base: card + lines, area: K.circ(70, 50, 24, '#E6F1FB', 0), box: [46, 26, 48, 48], c: '#fff' }),
      S('Shake yellow sand on the sun. Tip off the extra.', 'sprinkle', { base: card + K.circ(70, 50, 24, '#E6F1FB', 0), top: lines, ...ysand }),
      S('Now glue the waves and shake on blue sand.', 'sprinkle', { base: card + sunS, top: lines, ...bsand }),
      S('A sparkly summer day at the beach!', 'show', { item: mid(all), kind: 'glow' })
    ] };
  })();

  const autumnTree = (() => {
    const trunk = [[[100, 132], [100, 76]], [[100, 96], [72, 64]], [[100, 90], [130, 60]], [[100, 76], [96, 46]], [[84, 78], [70, 82]]];
    const tr = trunk.map(p => K.line(p, C.brown, 6)).join('');
    const crown = (n, c, i0) => Array.from({ length: n }, (_, i) => { const a = (i0 + i * 2.39) % (Math.PI * 2), r = 18 + ((i * 7 + i0 * 5) % 28); return [100 + r * Math.cos(a) * 1.2, 58 + r * Math.sin(a) * 0.8, c]; });
    const l1 = { a: 'dab', pts: crown(10, C.red, 0.2), shape: 'print', r: 6, tool: 'finger' }, l2 = { a: 'dab', pts: [...crown(8, C.orange, 1.1), ...crown(8, C.yellow, 2.3)], shape: 'print', r: 6, tool: 'finger' };
    const l3 = { a: 'dab', pts: [[60, 128, C.orange], [76, 124, C.red], [128, 126, C.yellow], [146, 128, C.red]], shape: 'print', r: 5, tool: 'finger' };
    const pic = sheet() + tr + done(l1) + done(l2) + done(l3);
    return { id: 'autumntree', cat: 'season', name: 'Autumn fingerprint tree', ico: '🍁', lv: 1, min: 15, mat: [M.paper, ['🖍️', 'a brown crayon or paint'], ['🎨', 'paint in red, orange and yellow']], steps: [
      S('Draw a tree trunk and branches in brown.', 'draw', { base: sheet(), s: trunk, c: C.brown, w: 6, tool: 'crayon' }),
      S('Dip a finger in red paint. Dot leaves on the branches.', 'dab', { base: sheet() + tr, ...l1 }),
      S('Now orange and yellow leaves!', 'dab', { base: sheet() + tr + done(l1), ...l2 }),
      S('Some leaves have fallen. Dot a few on the ground.', 'dab', { base: sheet() + tr + done(l1) + done(l2), ...l3 }),
      S('Whoosh! The autumn wind blows.', 'show', { base: pic, item: K.leaf(0, 0, 8, C.orange, 30), at: [120, 40], kind: 'fall' })
    ] };
  })();

  const pumpkin = (() => {
    const strips = [0, 1, 2, 3, 4].map(i => K.rect(30, 26 + i * 20, 140, 12, C.orange, 2)).join(''), sheetS = K.sheet(30, 26, 140, 92, C.orange);
    const pile = [0, 1, 2, 3, 4].map(i => ({ svg: K.rect(30, 80 - i * 3, 140, 12, i % 2 ? '#F07B1E' : C.orange, 2), at: [100, 86 - i * 3], h: 70 }));
    const ball = K.circ(100, 80, 44, C.orange) + [-30, -15, 0, 15, 30].map(d => K.ell(100, 80, Math.abs(d) * 1.4 + 4, 44, 'none', 1.4)).join('');
    const top = K.rect(96, 26, 8, 14, C.brown, 2) + K.leaf(116, 32, 10, C.green, -20) + K.path('M104,34 q8,-10 14,0 q6,10 12,0', 'none', 1.6);
    return { id: 'pumpkin', cat: 'season', name: 'Autumn paper pumpkin', ico: '🎃', lv: 2, min: 25, mat: [['🟧', 'orange paper'], M.scissors, M.ruler, ['📍', 'a paper fastener (split pin)'], ['🟩', 'green paper'], M.glue], tip: 'A grown-up pokes the holes for the paper fastener with a sharp pencil.', steps: [
      S('Cut the orange paper into long strips, all the same.', 'cut', { base: sheetS, cuts: [44, 62, 80, 98].map(y => [[30, y], [170, y]]) }),
      S('Stack the strips. Push a fastener through both ends.', 'stack', { pieces: pile }),
      S('Bend each strip up and round to make a ball.', 'morph', { from: [{ p: [[30, 74], [170, 74], [170, 90], [30, 90]], c: C.orange }], to: [{ p: circlePts(100, 80, 44, 30), c: C.orange }], topEnd: ball }),
      S('Glue on a stem and a curly green leaf.', 'place', { base: ball, pieces: [{ svg: top, at: [104, 32], from: [0, -50] }] }),
      S('A pumpkin for autumn!', 'show', { item: mid(ball + top), kind: 'bounce' })
    ] };
  })();

  const sockSnow = (() => {
    const sockP = [[74, 20], [126, 20], [126, 126], [74, 126]], sock = K.poly(sockP, '#fff');
    const body = K.circ(100, 104, 28, '#fff') + K.circ(100, 58, 22, '#fff') + K.path('M84,36 Q100,26 116,36', '#fff', 1.6);
    const face = K.circ(92, 54, 3, K.OL, 0) + K.circ(108, 54, 3, K.OL, 0) + K.poly([[100, 60], [114, 63], [100, 66]], C.orange) + [96, 104, 112].map(y => K.circ(100, y, 3.5, C.red)).join('');
    const scarf = K.rect(76, 74, 48, 9, C.red, 4) + K.rect(110, 78, 9, 22, C.red, 3), band = K.rect(78, 78, 44, 4, C.blue, 2);
    return { id: 'socksnowman', cat: 'season', name: 'Winter sock snowman', ico: '⛄', lv: 2, min: 25, mat: [['🧦', 'a white sock'], ['🍚', 'rice'], ['➰', '2 rubber bands or string'], ['🔘', 'buttons'], ['🧣', 'a scrap of fabric'], M.glue], steps: [
      S('Pour rice into the sock, almost to the top.', 'pour', { base: sock, box: [76, 26, 48, 98], grain: true, colors: ['#fff', '#F3EEE4'], lv1: 0.8, gr: 2, cup: [140, 4] }),
      S('Tie the top closed tight.', 'knot', { base: sock, at: [100, 30], c: C.blue }),
      S('Tie a band round the middle. A head and a body!', 'morph', { from: [{ p: [[74, 30], [126, 30], [126, 126], [74, 126]], c: '#fff' }], to: [{ p: [...K.arc(100, 58, 22, 22, 180, 360, 12), ...K.arc(100, 104, 28, 28, -60, 240, 20)], c: '#fff' }], topEnd: band }),
      S('Glue on button eyes, a nose and buttons.', 'place', { base: body + band, pieces: [{ svg: face, at: [100, 80], from: [0, -60] }] }),
      S('Tie a fabric scarf round its neck.', 'place', { base: body + face, pieces: [{ svg: scarf, at: [100, 80], from: [40, -30] }] }),
      S('Brrr! A snowman that never melts.', 'show', { item: mid(body + face + scarf), kind: 'wiggle' })
    ] };
  })();

  const stickFlake = (() => {
    const sticks = [0, 60, 120].map((r, i) => ({ svg: stick(100, 75, r, 110), at: [100, 75] })), plain = sticks.map(p => p.svg).join('');
    const blue = [0, 60, 120].map(r => stick(100, 75, r, 110, C.sky)).join('') + K.circ(100, 75, 8, '#fff');
    const dots = [0, 60, 120, 180, 240, 300].flatMap(a => [26, 44].map(d => [100 + d * Math.cos(a * Math.PI / 180), 75 + d * Math.sin(a * Math.PI / 180)]));
    const glit = { a: 'sprinkle', box: [50, 25, 100, 100], colors: ['#fff', C.purple, C.yellow], n: 50 };
    const flake = blue + dots.map(([x, y]) => K.circ(x, y, 3, '#fff', 1)).join('');
    return { id: 'stickflake', cat: 'season', name: 'Winter stick snowflake', ico: '❄️', lv: 2, min: 25, mat: [['🪵', '3 craft sticks'], M.pva, M.paint, M.brush, ['✨', 'glitter or sequins'], M.wool], steps: [
      S('Glue 3 sticks crossing in the middle, like a star.', 'stack', { pieces: sticks }),
      S('Paint them icy blue.', 'paint', { base: plain, area: blue, box: [45, 20, 110, 110], c: C.sky }),
      S('Add white glue dots.', 'glue', { base: blue, dots, r: 3 }),
      S('Shake glitter over the glue.', 'sprinkle', { base: flake, ...glit }),
      S('Tie on a string to hang it.', 'tie', { base: flake + done(glit) + K.line([[100, 20], [100, 4]], C.red, 2), at: [100, 20] }),
      S('Hang it in the window. It spins!', 'show', { item: mid(flake + done(glit)), kind: 'spin', speed: 0.5 })
    ] };
  })();

  const star3d = (() => {
    const sp = K.starPts(100, 75, 56, 5, 0.45), outl = sp.concat([sp[0]]), card = K.sheet(30, 10, 140, 130, '#fff');
    const outer = sp.filter((_, i) => i % 2 === 0), inner = sp.filter((_, i) => i % 2 === 1);
    const ridges = outer.map(p => [[100, 75], p]), valleys = inner.map(p => [[100, 75], p]);
    const facets = sp.map((p, i) => K.poly([[100, 75], p, sp[(i + 1) % 10]], i % 2 ? '#FFD86B' : '#E8A92A', 0.8)).join('');
    const flat = K.poly(sp, C.yellow), pop = K.poly(sp, C.yellow) + facets;
    return { id: 'star3d', cat: 'season', name: 'Winter 3D paper star', ico: '⭐', lv: 4, min: 40, mat: [M.card, M.ruler, M.pencil, M.scissors, M.glue], tip: 'Mountain folds point up like a hill, valley folds dip down. Score the lines with an empty pen first for sharp folds.', steps: [
      S('Draw a big star. Use a ruler to join each point to the middle.', 'draw', { base: card, s: [outl, ...ridges], tool: 'pen', c: C.grey }),
      S('Cut out the star. Make two the same.', 'cut', { base: card + K.line(outl, C.grey, 1.4), pts: outl, piece: flat, off: [0, 0] }),
      S('Fold up along each line to a point. Mountain folds!', 'draw', { base: flat, s: ridges, c: C.purple, dash: '5 4', tool: 'finger' }),
      S('Fold down between the points. Valley folds! It pops up.', 'morph', { base: '', from: [{ p: sp, c: C.yellow }], to: [{ p: K.starPts(100, 75, 52, 5, 0.5), c: C.yellow }], topEnd: pop, top: valleys.map(v => K.line(v, 'rgba(34,48,90,.25)', 1, '3 3')).join('') }),
      S('Glue the two stars back to back, edge to edge.', 'glue', { base: pop, dots: sp, r: 3 }),
      S('A shining winter star!', 'show', { item: mid(pop), kind: 'spin', speed: 0.3 })
    ] };
  })();

  /* ================= more origami ================= */
  const fox = (() => {
    // A new fox face model: triangle, corners down to the tip (a diamond), then the flaps lifted up and out as ears.
    const B = K.ori(C.orange, '#FFF3E0', [[100, 20], [155, 75], [100, 130], [45, 75]]);
    const s1 = B.fold('Fold the top corner down to the bottom corner. A triangle!', { from: [100, 20], to: [100, 130] });
    B.shift(0, -14);
    const s2 = B.fold('Fold both side corners down to the bottom point. A diamond!', { from: [45, 61], to: [100, 116] }, { from: [155, 61], to: [100, 116] });
    const s3 = B.morph('Fold each flap back up so its point sticks out past the top. Ears!', [
      { p: [[52, 58], [148, 58], [100, 120]], f: 0 },
      { p: [[56, 58], [48, 18], [86, 58]], f: 0 }, { p: [[144, 58], [152, 18], [114, 58]], f: 0 },
      { p: [[60, 56], [54, 30], [76, 56]], f: 1 }, { p: [[140, 56], [146, 30], [124, 56]], f: 1 }]);
    const face = K.ell(84, 74, 3.5, 5, K.OL, 0) + K.ell(116, 74, 3.5, 5, K.OL, 0) + K.circ(100, 112, 5, K.OL, 0);
    return { id: 'fox', cat: 'fold', name: 'Origami fox face', ico: '🦊', lv: 1, min: 5, mat: [['🟧', 'square paper, orange on one side'], M.pens], tip: 'Use paper that is orange on one side and white on the other: the ears get white insides, like a real fox.', steps: [
      s1, s2, s3,
      S('Draw two eyes and a nose on the tip.', 'draw', { base: B.svg(), s: [K.arc(84, 74, 3.5, 5, 0, 360, 10), K.arc(116, 74, 3.5, 5, 0, 360, 10), circlePts(100, 112, 5, 10)], tool: 'pen', fill: face }),
      S('Hello, little fox!', 'show', { item: mid(B.svg() + face), kind: 'wiggle' })
    ] };
  })();

  const tulip = (() => {
    const B = K.ori(C.red, '#F7A08F', [[100, 20], [155, 75], [100, 130], [45, 75]]);
    const s1 = B.fold('Fold the bottom corner up to the top. A triangle!', { from: [100, 130], to: [100, 20] });
    const s2 = B.fold('Fold the left corner up, so it pokes past the top.', { from: [45, 75], to: [80, 30] });
    const s3 = B.fold('Fold the right corner up too. A tulip!', { from: [155, 75], to: [120, 30] });
    const stem = K.rect(97, 74, 6, 62, C.green, 2) + K.leaf(116, 112, 14, C.green, -40);
    return { id: 'tulip', cat: 'fold', name: 'Origami tulip', ico: '🌷', lv: 1, min: 10, mat: [['🟥', 'square paper (red or pink)'], ['🟩', 'a green paper strip'], M.glue], steps: [
      s1, s2, s3,
      S('Glue it on a green paper stem with a leaf.', 'place', { base: stem, pieces: [{ svg: B.svg(), at: [100, 55], from: [0, -60] }] }),
      S('A tulip for spring!', 'show', { item: mid(stem + B.svg()), kind: 'wiggle' })
    ] };
  })();

  const oriHeart = (() => {
    const B = K.ori(C.red, '#FFD6DD', [[100, 15], [160, 75], [100, 135], [40, 75]]);
    const s1 = S('Fold corner to corner both ways, and open again.', 'draw', { base: B.svg(), s: [[[100, 15], [100, 135]], [[40, 75], [160, 75]]], c: C.purple, dash: '5 4', tool: 'finger' });
    const s2 = B.fold('Fold the top corner down to the middle.', { from: [100, 15], to: [100, 75] });
    const s3 = B.fold('Fold the bottom corner up to the top edge.', { from: [100, 135], to: [100, 45] });
    const s4 = B.fold('Fold the right side up along the middle line.', { line: [[100, 90], [145, 45]], at: [145, 90] });
    const s5 = B.fold('Fold the left side up the same way.', { line: [[100, 90], [55, 45]], at: [55, 90] });
    const s6 = B.flip('Turn it over.');
    const hp = Array.from({ length: 40 }, (_, i) => { const t = i / 40 * Math.PI * 2; return [100 + 3 * 16 * Math.pow(Math.sin(t), 3), 70 - 3 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]; });
    const s7 = B.morph('Fold down the top points and tuck in the side corners. A heart!', [{ p: hp, f: 0 }]);
    return { id: 'oriheart', cat: 'fold', name: 'Origami heart', ico: '❤️', lv: 2, min: 15, mat: [['🟥', 'square paper, red on one side']], tip: 'A folded heart fits inside a card or a lunch box as a surprise.', steps: [
      s1, s2, s3, s4, s5, s6, s7,
      S('A paper heart, all folded by you!', 'show', { item: mid(B.svg()), kind: 'bounce' })
    ] };
  })();

  const oriFly = (() => {
    const B = K.ori(C.pink, C.yellow, [[50, 25], [150, 25], [150, 125], [50, 125]]);
    const s1 = S('Fold in half both ways and corner to corner. Open it up.', 'draw', { base: B.svg(), s: [[[100, 25], [100, 125]], [[50, 75], [150, 75]], [[50, 25], [150, 125]], [[150, 25], [50, 125]]], c: C.purple, dash: '5 4', tool: 'finger' });
    const s2 = B.morph('Push the sides in so it folds down into a triangle.', [{ p: [[40, 110], [160, 110], [100, 50]], f: 0 }]);
    const s3 = B.fold('Fold the two front corners up to the top point.', { from: [40, 110], to: [100, 50], top: true }, { from: [160, 110], to: [100, 50], top: true });
    const s4 = B.flip('Turn it over.');
    const s5 = B.fold('Fold the top point down so it pokes past the bottom.', { from: [100, 50], to: [100, 124] });
    const wings = [{ p: [[100, 80], [44, 40], [52, 96]], f: 0 }, { p: [[100, 80], [156, 40], [148, 96]], f: 0 }, { p: [[100, 84], [62, 120], [92, 100]], f: 1 }, { p: [[100, 84], [138, 120], [108, 100]], f: 1 }, { p: [[96, 60], [104, 60], [104, 116], [96, 116]], f: 0 }];
    const s6 = B.morph('Tuck the tip over the top, then fold it in half and open the wings.', wings);
    return { id: 'orifly', cat: 'fold', name: 'Origami butterfly', ico: '🦋', lv: 3, min: 20, mat: [['🟪', 'square paper, two colors']], tip: 'This uses the "waterbomb base": the push-the-sides-in fold. Practice it once on scrap paper.', steps: [
      s1, s2, s3, s4, s5, s6,
      S('Your butterfly can fly!', 'show', { item: mid(B.svg()), kind: 'fly', s: 0.8 })
    ] };
  })();

  const fortune = (() => {
    const B = K.ori('#FFFFFF', C.sky, [[45, 20], [155, 20], [155, 130], [45, 130]]);
    const s1 = S('Fold the square corner to corner both ways. Open it.', 'draw', { base: B.svg(), s: [[[45, 20], [155, 130]], [[155, 20], [45, 130]]], c: C.purple, dash: '5 4', tool: 'finger' });
    const s2 = B.fold('Fold all four corners into the middle.', { from: [45, 20], to: [100, 75] }, { from: [155, 20], to: [100, 75] }, { from: [155, 130], to: [100, 75] }, { from: [45, 130], to: [100, 75] });
    const s3 = B.flip('Turn it over.');
    const s4 = B.fold('Fold the four new corners into the middle again.', { from: [100, 20], to: [100, 75] }, { from: [155, 75], to: [100, 75] }, { from: [100, 130], to: [100, 75] }, { from: [45, 75], to: [100, 75] });
    const nums = [[86, 62, '1'], [114, 62, '2'], [114, 90, '3'], [86, 90, '4']].map(([x, y, n]) => `<text x="${x}" y="${y}" font-size="14" font-weight="800" text-anchor="middle" dominant-baseline="central" fill="${C.purple}">${n}</text>`).join('');
    const s5 = S('Write numbers on the flaps. Under them, write fun fortunes!', 'draw', { base: B.svg(), s: [[[84, 56], [86, 54], [86, 68]], [[110, 58], [116, 56], [110, 68], [118, 68]], [[110, 84], [118, 86], [112, 90], [118, 94], [110, 96]], [[88, 82], [82, 92], [90, 92]]], c: C.purple, tool: 'pen', fill: nums });
    const teller = [{ p: [[100, 75], [60, 40], [100, 30]], f: 0 }, { p: [[100, 75], [140, 40], [100, 30]], f: 1 }, { p: [[100, 75], [140, 40], [160, 80]], f: 0 }, { p: [[100, 75], [160, 80], [140, 116]], f: 1 }, { p: [[100, 75], [140, 116], [100, 124]], f: 0 }, { p: [[100, 75], [60, 116], [100, 124]], f: 1 }, { p: [[100, 75], [60, 116], [40, 80]], f: 0 }, { p: [[100, 75], [40, 80], [60, 40]], f: 1 }];
    const s6 = B.morph('Fold it in half. Push your fingers into the 4 pockets and pinch to the middle.', teller);
    return { id: 'fortune', cat: 'fold', name: 'Paper fortune teller', ico: '🔮', lv: 3, min: 20, mat: [['⬜', 'square paper'], M.pens], tip: 'Ideas for fortunes: "You will get a hug", "Do a silly dance", "Tell a joke". Spell the color, count the number, open the flap!', steps: [
      s1, s2, s3, s4, s5, s6,
      S('Pick a color, spell it, open and close. What is your fortune?', 'show', { item: mid(B.svg()), kind: 'wiggle' })
    ] };
  })();

  const starBox = (() => {
    const B = K.ori(C.blue, C.sky, [[45, 20], [155, 20], [155, 130], [45, 130]]);
    const s1 = S('Crease the square in half both ways and corner to corner.', 'draw', { base: B.svg(), s: [[[100, 20], [100, 130]], [[45, 75], [155, 75]], [[45, 20], [155, 130]], [[155, 20], [45, 130]]], c: C.purple, dash: '5 4', tool: 'finger' });
    const s2 = B.morph('Collapse it into a small square: the "square base".', [{ p: [[100, 20], [140, 60], [100, 120], [60, 60]], f: 1 }, { p: [[100, 20], [140, 60], [100, 120], [60, 60]], f: 0 }]);
    const s3 = B.morph('Squash-fold each of the 4 flaps into a little diamond.', [{ p: [[100, 18], [130, 60], [100, 128], [70, 60]], f: 0 }, { p: [[100, 18], [118, 60], [100, 128], [82, 60]], f: 1 }]);
    const s4 = B.morph('Petal-fold every flap: edges in to the middle, lift the bottom point up.', [{ p: [[100, 14], [116, 70], [100, 130], [84, 70]], f: 0 }, { p: [[100, 30], [110, 70], [100, 110], [90, 70]], f: 1 }]);
    const s5 = B.morph('Fold the top point down inside, then open the box from the bottom.', [{ p: [[100, 40], [130, 70], [100, 100], [70, 70]], f: 0 }]);
    const st8 = Array.from({ length: 16 }, (_, i) => { const a = (i * 22.5 - 90) * Math.PI / 180, r = i % 2 ? 26 : 56; return [100 + r * Math.cos(a), 75 + r * Math.sin(a)]; });
    const oct = Array.from({ length: 8 }, (_, i) => { const a = (i * 45 - 67.5) * Math.PI / 180; return [100 + 24 * Math.cos(a), 75 + 24 * Math.sin(a)]; });
    const s6 = B.morph('Push out the 8 star points and flatten the bottom. A star box!', [{ p: st8, f: 0 }, { p: oct, f: 1 }]);
    return { id: 'starbox', cat: 'fold', name: 'Origami star box', ico: '✴️', lv: 4, min: 40, mat: [['🟦', 'big thin square paper (20 cm)']], tip: 'An expert model. Watch each step twice, fold slowly, and crease very sharply. It holds sweets or tiny treasures!', steps: [
      s1, s2, s3, s4, s5, s6,
      S('A little box shaped like a star!', 'show', { item: mid(B.svg()), kind: 'spin', speed: 0.3 })
    ] };
  })();

  craftsHome.add([tissueFlower, filterFly, jellyfish, sandArt, autumnTree, pumpkin, sockSnow, stickFlake, star3d, fox, tulip, oriHeart, oriFly, fortune, starBox]);
})();
