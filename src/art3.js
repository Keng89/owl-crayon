/* ---------- more art lessons (art3): comics, drawing from life, seasons, printing, clay & 3D, famous styles ---------- */
// Wrapped in a block so these helper names never clash with other files.
ART_LATER.push(() => {
  const f1 = n => +n.toFixed(1);
  // Colour that soaks in like a marker: lines underneath stay visible (multiply blend). ev = holes via even-odd.
  const T = (c, s, ev) => `<g class="pt" style="fill:${c};mix-blend-mode:multiply${ev ? ';fill-rule:evenodd' : ''}">${s}</g>`;
  // A thick coloured stroke (a rope of clay, a finger of paint, a fat marker line).
  const fat = (c, d, w) => `<g class="sk" style="--sk:${c}"><path d="${d}" style="stroke-width:${w}"/></g>`;
  // A rope of clay: darker edge with a lighter middle.
  const rope = (d, w, c = '#E8B48A', e = '#B97A50') => fat(e, d, w + 3) + fat(c, d, w);
  const clay = (s, c = '#E8B48A', e = '#B97A50') => paint(c, s) + stroke(e, s);
  // Make every line in a fragment a set width (for bold outlines and printed lines).
  const wide = (s, w) => s.replace(/\/>/g, ` style="stroke-width:${w}"/>`);
  const ink = (x, y, t, size, c = '#22305A') => paint(c, atext(x, y, t, size));
  // A stadium (rounded strip) from one point to another, w wide.
  const cap = (x1, y1, x2, y2, w) => {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L * w / 2, ny = dx / L * w / 2, r = w / 2;
    return ap(`M${f1(x1 + nx)} ${f1(y1 + ny)} L${f1(x2 + nx)} ${f1(y2 + ny)} A${r} ${r} 0 0 0 ${f1(x2 - nx)} ${f1(y2 - ny)} L${f1(x1 - nx)} ${f1(y1 - ny)} A${r} ${r} 0 0 0 ${f1(x1 + nx)} ${f1(y1 + ny)} Z`);
  };
  const circ = (cx, cy, r) => `M${f1(cx - r)} ${cy} a${r} ${r} 0 1 0 ${f1(2 * r)} 0 a${r} ${r} 0 1 0 ${f1(-2 * r)} 0 Z`;
  const spiral = (cx, cy, R, turns, a0 = 0) => {
    const n = Math.round(turns * 36), pts = [];
    for (let i = 0; i <= n; i++) { const t = i / n, a = a0 + t * turns * 2 * Math.PI, r = 2 + t * (R - 2); pts.push(`${f1(cx + r * Math.cos(a))} ${f1(cy + r * Math.sin(a))}`); }
    return 'M' + pts.join(' L');
  };
  // Points around any centre (like ring, but anywhere).
  const around = (n, R, cx, cy, f, a0 = -Math.PI / 2) => Array.from({ length: n }, (_, i) => { const a = a0 + i * 2 * Math.PI / n; return f(f1(cx + R * Math.cos(a)), f1(cy + R * Math.sin(a)), a); }).join('');
  const petal = (cx, cy, n, R, rx, ry) => around(n, R, cx, cy, (x, y, a) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${f1(a * 180 / Math.PI + 90)} ${x} ${y})"/>`);
  const heart = (cx, cy, s) => ap(`M${cx} ${f1(cy + s * 0.9)} C${f1(cx - s * 1.4)} ${f1(cy)} ${f1(cx - s * 0.9)} ${f1(cy - s * 1.1)} ${cx} ${f1(cy - s * 0.4)} C${f1(cx + s * 0.9)} ${f1(cy - s * 1.1)} ${f1(cx + s * 1.4)} ${f1(cy)} ${cx} ${f1(cy + s * 0.9)} Z`);
  // A leaf from its base to its tip, w wide.
  const leafD = (bx, by, tx, ty, w) => {
    const mx = (bx + tx) / 2, my = (by + ty) / 2, L = Math.hypot(tx - bx, ty - by), nx = -(ty - by) / L * w, ny = (tx - bx) / L * w;
    return `M${bx} ${by} Q${f1(mx + nx)} ${f1(my + ny)} ${tx} ${ty} Q${f1(mx - nx)} ${f1(my - ny)} ${bx} ${by} Z`;
  };
  const leafVeins = (bx, by, tx, ty, w) => {
    const dx = tx - bx, dy = ty - by, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    let s = al(f1(bx - ux * 14), f1(by - uy * 14), tx, ty);
    [0.28, 0.48, 0.68].forEach((t, i) => {
      const px = bx + dx * t, py = by + dy * t, k = w * (0.42 - i * 0.08);
      [1, -1].forEach(sg => { s += al(f1(px), f1(py), f1(px + nx * k * sg + ux * k * 0.7), f1(py + ny * k * sg + uy * k * 0.7)); });
    });
    return s;
  };
  // Crayon rubbing: soft colour, then lots of little crayon strokes, all kept inside the leaf.
  const rubbing = (id, d, light, dark) => {
    let lines = '';
    for (let k = -200; k < 220; k += 5) lines += al(k, 200, k + 120, 0);
    return T(light, ap(d)) + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">${stroke(dark, lines.replace(/\/>/g, ' style="stroke-width:1.6;opacity:.75"/>'))}</g>`;
  };
  // Matisse-style wavy cut-out shape.
  const algae = (cx, y0, h, w, ph) => {
    const L = [], R = [], N = 48;
    for (let i = 0; i <= N; i++) {
      const t = i / N, y = y0 - t * h, env = Math.sin(Math.PI * (0.06 + 0.9 * t)) * (1 - 0.35 * t);
      const lobe = k => 0.3 + 0.7 * Math.pow(Math.abs(Math.sin(t * Math.PI * 3.5 + k)), 0.7);
      L.push(`${f1(cx - w * env * lobe(ph))},${f1(y)}`); R.unshift(`${f1(cx + w * env * lobe(ph + 1.6))},${f1(y)}`);
    }
    return apg(L.concat([`${cx},${f1(y0 - h - 6)}`], R).join(' '));
  };

  ART_CATS.push(
    { id: 'comics', name: 'Comics & Stories', ico: '💬', blurb: 'Speech bubbles, comic boxes, POW! and story maps' },
    { id: 'life', name: 'Draw What You See', ico: '👀', blurb: 'Look carefully at real things and draw them' },
    { id: 'seasons', name: 'Seasons & Holidays', ico: '🎃', blurb: 'Spring flowers to winter snowflakes and festivals' },
    { id: 'print', name: 'Printing & Stamping', ico: '🖐️', blurb: 'Handprints, fingerprints, stamps and rubbings' },
    { id: 'clay', name: 'Clay & 3D Making', ico: '🧱', blurb: 'Roll, pinch and build things you can hold' },
    { id: 'styles', name: 'Famous Art Styles', ico: '🖼️', blurb: 'Make art like Mondrian, Matisse and Van Gogh' }
  );

  /* ---- Comics & stories ---- */
  const strip = [ar(8, 40, 56, 120, 4), ar(72, 40, 56, 120, 4), ar(136, 40, 56, 120, 4)];
  const burst = apg(zig(10, 40, 64, 115, 80));
  const powText = (extra = 'class="tx"') => atext(115, 92, 'POW!', 34, extra);
  const mapPath = 'M50 168 H140 Q178 168 168 140 Q160 118 120 118 H72 Q36 118 40 92 Q44 78 82 78 H150 Q165 78 165 70';
  const mapTrees = apg('62,152 72,128 82,152') + al(72, 152, 72, 160) + apg('88,155 99,126 110,155') + al(99, 155, 99, 162) + apg('50,110 61,88 72,110') + al(61, 110, 61, 115);
  LESSONS.push(
    { id: 'cm-bubble', cat: 'comics', level: 1, title: 'Speech bubble buddy', ico: '💬',
      need: 'Paper, a pencil and crayons', tip: 'Short words fit best in a bubble. One or two words is plenty!', steps: [
      ['Draw a big circle for a face, down low on one side.', ac(70, 125, 38)],
      ['Give it two eyes and a big smile.', ac(57, 118, 4) + ac(83, 118, 4) + ap('M52 136 q18 18 36 0')],
      ['Add bumpy hair on top and shoulders at the bottom.', ap('M45 96 Q53 76 61 88 Q69 72 77 88 Q85 74 93 95') + ap('M30 200 Q32 168 70 168 Q108 168 110 200')],
      ['Draw a big round bubble up high. Leave a little gap at the bottom.', ap('M112 86.8 A55 35 0 1 1 128 89.7')],
      ['Draw a pointy tail from the gap to the mouth. Now we know who is talking!', apl('112,86.8 96,104 128,89.7')],
      ['Write a word in the bubble, like HI!', ink(135, 67, 'HI!', 32)],
      ['Color it in. Then read your bubble out loud in a funny voice!', T('#FFD966', ac(70, 125, 38)) + T('#9CCBF5', ap('M30 200 Q32 168 70 168 Q108 168 110 200 Z')) + T('#F78FB3', ac(50, 132, 6) + ac(90, 132, 6))]] },
    { id: 'cm-strip', cat: 'comics', level: 1, title: 'A 3-box comic', ico: '🗯️',
      need: 'Paper, a pencil, a ruler and crayons', tip: 'Every box shows what happens next, like pages in a book.', steps: [
      ['Draw 3 boxes in a row. Comic boxes are called panels. We read them from left to right.', strip.join('')],
      ['Box 1: draw the ground and a little seed in the soil.', al(8, 140, 64, 140) + ae(36, 150, 6, 4)],
      ['Box 2: the seed grows! Draw the ground and a little sprout with two leaves.', al(72, 140, 128, 140) + al(100, 140, 100, 118) + ap('M100 128 q-14 -12 -18 0 q8 8 18 0') + ap('M100 122 q14 -12 18 0 q-8 8 -18 0')],
      ['Box 3: the ground and a tall flower. It grew!', al(136, 140, 192, 140) + al(164, 140, 164, 87) + petal(164, 80, 6, 11, 5, 8) + ac(164, 80, 6) + ap('M164 120 q14 -12 18 0 q-8 8 -18 0')],
      ['Show the weather: rain in box 2, and a sun in box 3.', ap('M84 72 a8 8 0 0 1 6 -13 a10 10 0 0 1 18 -3 a8 8 0 0 1 8 16 Z') + al(90, 80, 87, 88) + al(100, 80, 97, 88) + al(110, 80, 107, 88) + al(95, 94, 92, 102) + al(105, 94, 102, 102) + ac(178, 54, 6) + around(8, 11, 178, 54, (x, y, a) => al(x, y, f1(178 + 14 * Math.cos(a)), f1(54 + 14 * Math.sin(a))))],
      ['Write a title over the top.', ink(100, 28, 'MY SEED', 20)],
      ['Color it in. Then tell the story to someone, box by box!', T('#C99A6E', ar(8, 140, 56, 20) + ar(72, 140, 56, 20) + ar(136, 140, 56, 20)) + T('#F78FB3', petal(164, 80, 6, 11, 5, 8)) + T('#FFC23D', ac(164, 80, 6) + ac(178, 54, 6)) + T('#C9D3E0', ap('M84 72 a8 8 0 0 1 6 -13 a10 10 0 0 1 18 -3 a8 8 0 0 1 8 16 Z')) + T('#D6EAFC', ar(8, 40, 56, 100)) + T('#B9E2C6', ar(72, 40, 56, 100) + ar(136, 40, 56, 100))]] },
    { id: 'cm-pow', cat: 'comics', level: 2, title: 'POW! Action words', ico: '💥',
      need: 'Paper, a pencil, a black marker and crayons', tip: 'Make sound words big and fat. Loud sounds get big letters!', steps: [
      ['Draw a big spiky shape, like a crash or a bang.', burst],
      ['Write POW! in the middle with big, thick letters. Comics use words for sounds.', powText()],
      ['Draw a ball flying in from the corner.', ac(64, 144, 14)],
      ['Draw 3 speed lines behind the ball. Now it is zooming!', al(43.5, 151.7, 27.9, 167.3) + al(49.9, 158.1, 34.3, 173.7) + al(56.3, 164.5, 40.7, 180.1)],
      ['Add little lines around the spikes to make the bang shake.', [-108, -72, -36, 0, 36, 72, 180, 216].map(d => { const a = d * Math.PI / 180; return al(f1(115 + 70 * Math.cos(a)), f1(80 + 70 * Math.sin(a)), f1(115 + 80 * Math.cos(a)), f1(80 + 80 * Math.sin(a))); }).join('')],
      ['Color the bang yellow and the letters red. Then make up your own: BOING! SPLAT! ZOOM!', T('#FFD966', burst) + paint('#F2604F', powText('')) + T('#9CCBF5', ac(64, 144, 14))]] },
    { id: 'cm-feel', cat: 'comics', level: 2, title: 'Show the feeling', ico: '😮',
      need: 'Paper, a pencil, crayons and a mirror if you have one', tip: 'Eyebrows do a lot of the work. Try moving yours in a mirror!', steps: [
      ['Draw 4 heads the same size. Each one will show a different feeling.', ac(55, 60, 32) + ac(145, 60, 32) + ac(55, 150, 32) + ac(145, 150, 32)],
      ['Happy: eyes like little rainbows, a big open smile, and sparkles.', ap('M42 58 q5 -7 10 0 M58 58 q5 -7 10 0') + ap('M42 70 Q55 86 68 70 Z') + al(16, 22, 16, 34) + al(10, 28, 22, 28) + al(92, 20, 92, 28) + al(88, 24, 96, 24)],
      ['Sad: eyebrows go up in the middle, the mouth turns down, and a tear falls.', al(131, 50, 141, 46) + al(149, 46, 159, 50) + ac(137, 58, 3) + ac(153, 58, 3) + ap('M134 80 q11 -11 22 0') + ap('M137 64 q-4 7 0 9 q4 -2 0 -9')],
      ['Angry: eyebrows point down in the middle, like a V. Add puffs of steam!', al(41, 138, 51, 144) + al(59, 144, 69, 138) + ac(47, 150, 3) + ac(63, 150, 3) + ap('M44 168 q11 -8 22 0') + ac(18, 122, 6) + ac(26, 112, 5) + ac(92, 122, 6) + ac(84, 112, 5)],
      ['Surprised: eyebrows up high, round eyes, an O mouth, and pop lines.', ap('M131 134 q6 -6 12 0 M147 134 q6 -6 12 0') + ac(138, 146, 4) + ac(152, 146, 4) + ae(145, 166, 6, 8) + al(112, 124, 118, 130) + al(145, 108, 145, 115) + al(178, 124, 172, 130)],
      ['Color each face to match its feeling. Make a face in a mirror and draw that one too!', T('#FFD966', ac(55, 60, 32)) + T('#9CCBF5', ac(145, 60, 32)) + T('#F7A39A', ac(55, 150, 32)) + T('#CFC4F0', ac(145, 150, 32))]] },
    { id: 'cm-map', cat: 'comics', level: 3, title: 'A story map', ico: '🗺️',
      need: 'Paper, a pencil and crayons', tip: 'Every good story has a beginning, a problem in the middle and an end.', steps: [
      ['A story has a beginning, a middle and an end. Draw a house in the bottom corner: the beginning.', ar(14, 148, 36, 30) + apg('10,148 32,128 54,148') + ar(27, 162, 10, 16)],
      ['Draw a castle in the top corner: the end of the journey.', ar(146, 36, 38, 34) + ap('M146 36 V28 H153 V33 H161 V28 H169 V33 H177 V28 H184 V36') + ap('M158 70 V62 a7 7 0 0 1 14 0 V70') + al(165, 28, 165, 14) + apg('165,14 177,18 165,22')],
      ['Draw a winding path from the house door all the way to the castle.', ap(mapPath)],
      ['The middle needs some trouble! Draw a spooky forest beside the path.', mapTrees],
      ['Add another problem: a river to cross. Draw a little bridge where the path goes over it.', ap('M96 0 Q88 25 98 50 T100 92') + ap('M120 0 Q112 25 122 50 T122 92') + ae(111, 100, 18, 9) + al(90, 73, 132, 73) + al(90, 83, 132, 83)],
      ['Number the big moments 1, 2, 3, so a reader knows the order.', ac(32, 116, 8) + ink(32, 121, '1', 13) + ac(130, 145, 8) + ink(130, 150, '2', 13) + ac(178, 96, 8) + ink(178, 101, '3', 13)],
      ['Color your map. Then tell the story out loud as your finger walks along the path!', T('#6CC08B', mapTrees.replace(/<line[^>]*>/g, '')) + T('#9CCBF5', ap('M96 0 Q88 25 98 50 Q108 75 100 92 L122 92 Q132 75 122 50 Q112 25 120 0 Z') + ae(111, 100, 18, 9)) + T('#F2604F', apg('10,148 32,128 54,148')) + T('#C9D3E0', ar(146, 36, 38, 34)) + fat('#E8C27A', mapPath, 6)]] }
  );

  /* ---- Draw what you see (still life) ---- */
  const apple = 'M100 62 C85 50 50 52 45 95 C42 135 70 165 100 158 C130 165 158 135 155 95 C150 52 115 50 100 62 Z';
  const appleShine = 'M70 80 Q60 92 62 108 Q70 94 78 84 Z';
  const cupBody = 'M45 60 L50 150 Q90 166 130 150 L135 60 Q90 74 45 60 Z';
  const cupBand = 'M47.2 100 Q90 116 132.8 100 L132.1 112 Q90 128 47.9 112 Z';
  const hand = 'M75 195 L70 150 C60 140 40 125 32 110 C27 100 37 92 45 100 L72 125 L66 60 C66 48 82 48 82 60 L84 112 L88 50 C88 36 104 36 104 50 L104 110 L110 58 C110 46 126 46 126 58 L122 115 L132 80 C134 70 148 72 146 82 L136 130 C138 160 132 175 130 195';
  const shoeUpper = 'M26 140 L28 72 Q30 58 44 58 L84 62 Q96 64 104 84 L112 96 Q160 104 176 118 Q186 128 184 140';
  const vase = 'M88 110 Q86 120 72 132 Q58 148 66 170 Q72 182 100 182 Q128 182 134 170 Q142 148 128 132 Q114 120 112 110';
  const vaseShine = 'M74 146 Q68 158 74 170 Q77 158 80 147 Z';
  const flowers = [[68, 50], [101, 34], [136, 56]];
  LESSONS.push(
    { id: 'lf-apple', cat: 'life', level: 1, title: 'A real apple', ico: '🍎',
      need: 'A real apple, paper, a pencil and crayons', tip: 'Look at the apple more than at your paper!', steps: [
      ['Look at a real apple. It is round, with a little dip on top. Draw that shape.', ap(apple)],
      ['Look for the stem. Draw a short stick coming out of the dip.', ap('M100 64 Q98 50 104 38')],
      ['Is there a leaf? Draw it next to the stem.', ap('M104 48 Q122 30 138 42 Q120 56 104 48 Z') + ap('M106 47 Q122 42 136 42')],
      ['Find the shiny spot where the light hits. Draw a small shape around it.', ap(appleShine)],
      ['Draw the table line, and the dark shadow under the apple.', al(5, 166, 195, 166) + T('#9FAABD', ae(120, 165, 46, 6))],
      ['Color the apple, but keep the shiny spot white. Show someone your apple next to the real one!', T('#F2604F', ap(apple + ' ' + appleShine), true) + T('#C4453A', ap('M132 70 C160 84 160 140 112 156 C142 140 150 100 132 70 Z')) + T('#6CC08B', ap('M104 48 Q122 30 138 42 Q120 56 104 48 Z')) + stroke('#8B5E3C', ap('M100 64 Q98 50 104 38'))]] },
    { id: 'lf-cup', cat: 'life', level: 1, title: 'A cup', ico: '☕',
      need: 'A cup or mug, paper, a pencil and crayons', tip: 'The top of a cup is an oval, not a circle. Look and see!', steps: [
      ['Look at a cup from the side. The top looks like an oval, not a circle! Draw a wide oval.', ae(90, 60, 45, 14)],
      ['Draw two lines down from the ends of the oval.', al(45, 60, 50, 150) + al(135, 60, 130, 150)],
      ['The bottom is curved too, like a smile. Join the two lines.', ap('M50 150 Q90 166 130 150')],
      ['Draw the handle: a big C on the side, with a smaller C inside it.', ap('M134 80 C172 78 172 135 131 128') + ap('M134 92 C156 92 156 118 132 116')],
      ['Does it have a stripe? Make it curve, just like the bottom does.', ap('M47.2 100 Q90 116 132.8 100') + ap('M47.9 112 Q90 128 132.1 112')],
      ['Shade the shadow under the cup.', T('#9FAABD', ae(112, 160, 52, 6))],
      ['Color it. Keep a thin white shine on one side. Now try a different cup!', T('#9CCBF5', ap(cupBody + ' ' + cupBand + ' M57 76 L58 96 L63 97 L62 77 Z M58 118 L59 140 L64 141 L63 120 Z') + ap('M134 80 C172 78 172 135 131 128 L132 116 C156 118 156 92 134 92 Z'), true) + T('#F2604F', ap(cupBand)) + T('#8B5E3C', ae(90, 60, 45, 14))]] },
    { id: 'lf-hand', cat: 'life', level: 2, title: 'Your own hand', ico: '✋',
      need: 'Paper, a pencil, crayons, and your own hand!', tip: 'Trace slowly with the pencil standing up straight. It tickles!', steps: [
      ['Spread your fingers on the paper. Gently trace around your hand with a pencil.', ap(hand)],
      ['Lift your hand and LOOK at it. Draw little curved lines where each finger bends.', ap('M69 82 q6 3 12 0 M87 74 q8 3 16 0 M108 80 q8 3 16 0 M127 100 q7 3 14 0 M52 107 q-6 8 -8 18')],
      ['Look at your fingertips. Draw a fingernail on each one.', ar(70, 53, 8, 10, 4) + ar(92, 42, 8, 10, 4) + ar(114, 51, 8, 10, 4) + ar(136, 76, 7, 8, 3.5) + ae(37, 103, 4, 5)],
      ['Do you wear a bracelet or a watch? Draw a band around the wrist.', ap('M73 174 Q102 180 131.5 174 L131 186 Q102 192 74.3 186 Z')],
      ['Look for the darkest places, between your fingers. Shade them softly.', T('#AEB8C8', apg('80,100 84,112 87,90') + apg('102,96 104,110 108,90') + apg('120,102 122,115 127,98') + apg('64,116 72,125 69,106'))],
      ['Color it like your own skin. Count the fingers: 1, 2, 3, 4, 5!', T('#F5C9A6', ap(hand + ' Z')) + T('#FFC23D', ap('M73 174 Q102 180 131.5 174 L131 186 Q102 192 74.3 186 Z'))]] },
    { id: 'lf-shoe', cat: 'life', level: 2, title: 'A sneaker', ico: '👟',
      need: 'A shoe or a toy, paper, a pencil and crayons', tip: 'Find one small detail nobody else would notice, and draw it.', steps: [
      ['Put a shoe on the table and look at it from the side. Draw the flat sole at the bottom.', ar(20, 140, 170, 20, 10)],
      ['Look at the top: low at the toe, high at the heel. Draw that shape.', ap(shoeUpper)],
      ['Draw the oval hole where your foot goes in.', ae(64, 60, 20, 5)],
      ['Look at the laces. Draw lines that cross over, and a bow on top.', ap('M80 70 Q90 92 108 106') + al(82, 76, 98, 70) + al(88, 87, 103, 82) + al(96, 97, 110, 94) + ap('M92 68 q-12 -16 -18 -6 q2 8 18 6 q4 -18 16 -14 q2 10 -16 14')],
      ['Look for stripes on the side, and the cap over the toe. Draw them.', ap('M45 125 Q95 130 145 112') + ap('M152 140 Q152 124 170 114')],
      ['Shade a shadow under the sole.', T('#9FAABD', ae(105, 163, 88, 6))],
      ['Color it like the real shoe. Did you spot anything new?', T('#5B9BE0', ap(shoeUpper + ' Z')) + T('#E2E8EF', ar(20, 140, 170, 20, 10)) + fat('#FFC23D', 'M45 125 Q95 130 145 112', 7)]] },
    { id: 'lf-vase', cat: 'life', level: 3, title: 'Flowers in a vase', ico: '💐',
      need: 'Flowers in a vase near a window, paper, a pencil and crayons', tip: 'Squint your eyes: the darks and lights get easier to see.', steps: [
      ['Put flowers near a window or lamp. Notice where the light comes from, and mark it lightly.', guide(ac(20, 20, 8) + al(31, 31, 46, 46) + apl('38,46 46,46 46,38'))],
      ['Draw the vase: a narrow neck and a round belly. Copy the real shape, not the one you imagine.', ap(vase) + ae(100, 110, 12, 4)],
      ['Draw the edge of the table behind the vase.', al(5, 160, 63, 160) + al(137, 160, 195, 160)],
      ['Draw the stems coming out of the neck. Notice how each one bends.', ap('M96 108 Q90 80 68 56') + ap('M100 108 Q100 75 101 40') + ap('M104 108 Q112 80 136 62')],
      ['Draw a flower at the end of each stem. Petals go all the way around the middle.', flowers.map(([x, y]) => petal(x, y, 6, 12, 5, 8) + ac(x, y, 6)).join('')],
      ['Add leaves on the stems.', ap('M98 95 Q80 88 76 96 Q88 102 98 95 Z') + ap('M103 90 Q120 80 126 88 Q114 96 103 90 Z')],
      ['Shade the side of the vase away from the light, and its cast shadow on the table. Leave a bright highlight.', T('#AEB8C8', ap('M120 128 Q140 146 134 170 Q128 182 102 182 Q124 174 126 150 Q126 138 120 128 Z') + ap('M128 180 Q165 182 192 172 Q170 164 136 168 Z')) + ap(vaseShine)],
      ['Erase the guide. Color it all, keeping the highlight white. Sign it like a real artist!', T('#7FB2EA', ap(vase + ' Z ' + vaseShine), true) + T('#F78FB3', petal(68, 50, 6, 12, 5, 8)) + T('#FFC23D', petal(101, 34, 6, 12, 5, 8)) + T('#F2604F', petal(136, 56, 6, 12, 5, 8)) + T('#FFD966', flowers.map(([x, y]) => ac(x, y, 6)).join('')) + T('#6CC08B', ap('M98 95 Q80 88 76 96 Q88 102 98 95 Z') + ap('M103 90 Q120 80 126 88 Q114 96 103 90 Z')) + stroke('#2FA36B', ap('M96 108 Q90 80 68 56') + ap('M100 108 Q100 75 101 40') + ap('M104 108 Q112 80 136 62')), { clear: true }]] }
  );

  /* ---- Seasons & holidays ---- */
  const tulip = (cx, by) => ap(`M${cx - 14} ${by - 12} L${cx - 14} ${by - 32} L${cx - 7} ${by - 24} L${cx} ${by - 36} L${cx + 7} ${by - 24} L${cx + 14} ${by - 32} L${cx + 14} ${by - 12} Q${cx + 14} ${by} ${cx} ${by} Q${cx - 14} ${by} ${cx - 14} ${by - 12} Z`);
  const tulipLeaves = ap('M60 185 Q38 160 44 132 Q58 158 60 185 Z') + ap('M100 185 Q122 160 118 128 Q102 156 100 185 Z') + ap('M140 185 Q162 165 160 140 Q144 160 140 185 Z');
  const tulipStems = al(60, 185, 60, 100) + al(100, 185, 100, 80) + al(140, 185, 140, 105);
  const waves = n => Array.from({ length: n }, () => 't30 0').join(' ');
  const seaD = `M0 95 H205 V140 q-15 -8 -30 0 ${Array.from({ length: 6 }, () => 't-30 0').join(' ')} V95 Z`;
  const sandD = `M-5 140 q15 -8 30 0 ${waves(6)} V205 H-5 Z`;
  const canopy = 'M110 128 Q147 84 184 128 Q172 120 159 128 Q147 120 135 128 Q122 120 110 128 Z';
  const mapleR = [[100, 150], [114, 148], [128, 160], [147, 167], [142, 150], [157, 145], [140, 132], [160, 127], [155, 114], [176, 100], [158, 97], [165, 78], [146, 86], [140, 70], [126, 88], [112, 100], [122, 72], [110, 74], [113, 52], [104, 58], [100, 28]];
  const maple = mapleR.concat(mapleR.slice(1, -1).reverse().map(([x, y]) => [200 - x, y])).map(p => p.join(',')).join(' ');
  const flakeV = (r, len) => around(6, r, 100, 100, (x, y, a) => [0.85, -0.85].map(o => al(x, y, f1(x + len * Math.cos(a + o)), f1(y + len * Math.sin(a + o)))).join(''));
  LESSONS.push(
    { id: 'se-spring', cat: 'seasons', level: 1, title: 'Spring tulips', ico: '🌷',
      need: 'Paper, a pencil and crayons', tip: 'Real tulips come in red, pink, yellow, even purple. Pick your favourites!', steps: [
      ['Draw three tall stem lines. Make the middle one the tallest.', tulipStems],
      ['Draw a tulip cup on top of each stem: a U with three points on top.', tulip(60, 100) + tulip(100, 80) + tulip(140, 105)],
      ['Add a long pointy leaf next to each stem.', tulipLeaves],
      ['Draw the ground, with little tufts of grass.', al(10, 185, 190, 185) + ap('M20 185 l4 -8 l4 8 M168 185 l4 -8 l4 8 M76 185 l4 -8 l4 8')],
      ['Draw a buzzy bee with stripes and wings. Add a dotted line to show where it flew.', ae(160, 40, 11, 8) + al(157, 33, 157, 47) + al(163, 33, 163, 47) + ae(155, 28, 5, 7) + ae(165, 28, 5, 7) + ac(168, 38, 1.5) + '<path d="M148 38 q-14 -14 -26 -4 t-30 -8" style="stroke-dasharray:3 6"/>'],
      ['Color the tulips bright and the stems green. Happy spring!', T('#F2604F', tulip(60, 100)) + T('#F78FB3', tulip(100, 80)) + T('#FFC23D', tulip(140, 105)) + T('#6CC08B', tulipLeaves) + stroke('#2FA36B', tulipStems) + T('#FFD966', ae(160, 40, 11, 8))]] },
    { id: 'se-summer', cat: 'seasons', level: 1, title: 'Summer beach', ico: '🏖️',
      need: 'Paper, a pencil and crayons', tip: 'Press lightly for pale sand and harder for deep blue sea.', steps: [
      ['Draw a straight line across the middle. That is where the sea meets the sky.', al(0, 95, 200, 95)],
      ['Draw a wavy line lower down for the sand.', ap(`M-5 140 q15 -8 30 0 ${waves(6)}`)],
      ['Draw a big sun with rays.', ac(158, 42, 16) + around(10, 21, 158, 42, (x, y, a) => al(x, y, f1(158 + 29 * Math.cos(a)), f1(42 + 29 * Math.sin(a))))],
      ['Draw a sailboat: a boat shape, a pole and a triangle sail.', ap('M30 90 H70 L62 99 H38 Z') + al(50, 90, 50, 58) + apg('53,58 53,86 72,86')],
      ['Draw a beach umbrella in the sand: a pole and a bumpy top.', ap(canopy) + al(147, 128, 147, 182)],
      ['Add a beach ball and some little waves.', ac(60, 165, 14) + ap('M60 151 Q50 165 60 179 M60 151 Q70 165 60 179') + al(46, 165, 74, 165) + ap('M84 112 q5 -5 10 0 t10 0 M14 118 q5 -5 10 0 t10 0 M60 128 q5 -5 10 0')],
      ['Color the sea blue, the sand yellow and the sun bright. Where would you go swimming?', T('#7FC4F0', ap(seaD + ' ' + canopy), true) + T('#F6DFA4', ap(sandD)) + T('#FFC23D', ac(158, 42, 16)) + T('#F2604F', ap(canopy)) + T('#F78FB3', apg('53,58 53,86 72,86')) + T('#FFD966', ac(60, 165, 14))]] },
    { id: 'se-autumn', cat: 'seasons', level: 2, title: 'Autumn maple leaf', ico: '🍁',
      need: 'Paper, a pencil and crayons in red, orange and yellow', tip: 'Go on a leaf hunt outside and compare your drawing to a real leaf!', steps: [
      ['Draw a long line from the bottom up. It is the stem and the middle vein.', al(100, 190, 100, 35)],
      ['Draw two veins going up and out, like a V.', al(100, 132, 152, 92) + al(100, 132, 48, 92)],
      ['Draw two short veins out to the sides, near the bottom.', al(100, 148, 138, 158) + al(100, 148, 62, 158)],
      ['Draw a pointy outline around the veins. Go out to a point at the end of every vein.', apg(maple)],
      ['Add tiny veins branching off the big ones.', al(100, 70, 110, 62) + al(100, 70, 90, 62) + al(100, 95, 110, 86) + al(100, 95, 90, 86) + al(126, 112, 136, 120) + al(126, 112, 124, 100) + al(74, 112, 64, 120) + al(74, 112, 76, 100)],
      ['Color it yellow, then add orange and red at the tips. Autumn leaves change color!', T('#FFD966', apg(maple)) + `<defs><clipPath id="a3maple"><polygon points="${maple}"/></clipPath></defs><g clip-path="url(#a3maple)">${T('#FF9F43', ac(100, 45, 34) + ac(160, 90, 30) + ac(40, 90, 30) + ac(145, 165, 16) + ac(55, 165, 16)) + T('#F2604F', ac(100, 32, 18) + ac(168, 84, 16) + ac(32, 84, 16))}</g>` + stroke('#8B5E3C', al(100, 190, 100, 150))]] },
    { id: 'se-winter', cat: 'seasons', level: 2, title: 'Winter snowflake', ico: '❄️',
      need: 'Paper and a pencil, or white crayon on dark paper', tip: 'Every snowflake has 6 arms. What you add to one arm, add to all!', steps: [
      ['Draw a straight line up and down through the middle.', al(100, 20, 100, 180)],
      ['Draw two more lines through the middle, like a star. Now there are 6 arms.', al(169.3, 60, 30.7, 140) + al(169.3, 140, 30.7, 60)],
      ['Add a V near the end of every arm.', flakeV(56, 18)],
      ['Add a smaller V closer to the middle on every arm.', flakeV(30, 11)],
      ['Draw a little hexagon in the middle: 6 sides, one for each arm.', apg(around(6, 14, 100, 100, (x, y) => `${x},${y} `).trim())],
      ['Put a tiny circle on the tip of every arm.', around(6, 84, 100, 100, (x, y) => ac(x, y, 4))],
      ['Color around it pale blue. No two real snowflakes are the same!', T('#D6EAFC', ac(100, 100, 95)) + stroke('#2E8BE6', around(6, 84, 100, 100, (x, y) => ac(x, y, 4)))]] },
    { id: 'se-lantern', cat: 'seasons', level: 3, title: 'Festival lantern', ico: '🏮',
      need: 'Paper, a pencil, a ruler and crayons (gold if you have it)', tip: 'Curve the lines more near the edges, and the lantern looks round.', steps: [
      ['Lanterns glow at festivals like Lunar New Year and Diwali. Draw a light guide line down the middle.', guide(al(100, 6, 100, 196))],
      ['Draw a wide oval for the lantern.', ae(100, 100, 60, 48)],
      ['Add a flat cap on the top and on the bottom.', ar(80, 44, 40, 12, 3) + ar(80, 144, 40, 12, 3)],
      ['Draw curved ribs from cap to cap. Bend them more near the edges: that makes it look round!', ap('M84 56 Q48 100 84 144 M92 56 Q76 100 92 144 M100 56 V84 M100 116 V144 M108 56 Q124 100 108 144 M116 56 Q152 100 116 144')],
      ['Hang it on a string, and add a tassel at the bottom.', al(100, 44, 100, 8) + al(100, 156, 100, 162) + ar(95, 162, 10, 6, 2) + al(97, 168, 93, 192) + al(100, 168, 100, 194) + al(103, 168, 107, 192)],
      ['Draw a circle in the middle with a little flower pattern inside.', ac(100, 100, 16) + ring(6, 8, (x, y) => ac(f1(x), f1(y), 4))],
      ['Erase the guide. Color it red and gold, with a warm glow around it. Light it up!', T('#FFF0B8', ac(100, 100, 92)) + T('#F2604F', ap(`M40 100 a60 48 0 1 0 120 0 a60 48 0 1 0 -120 0 Z ${circ(100, 100, 16)}`), true) + T('#FFC23D', ac(100, 100, 16) + ar(80, 44, 40, 12, 3) + ar(80, 144, 40, 12, 3) + ar(95, 162, 10, 6, 2)) + stroke('#E0A21C', al(97, 168, 93, 192) + al(100, 168, 100, 194) + al(103, 168, 107, 192)), { clear: true }]] }
  );

  /* ---- Printing & stamping ---- */
  const palm = ae(100, 70, 38, 32), fingers = cap(78, 90, 70, 152, 16) + cap(93, 96, 90, 166, 16) + cap(108, 96, 111, 166, 16) + cap(122, 90, 130, 152, 16) + cap(134, 74, 172, 100, 17);
  const grid = [32, 78, 124, 170], gy = [35, 80, 125, 170];
  const speck = (x, y) => paint('rgba(255,255,255,.55)', ac(x - 4, y - 3, 1.6) + ac(x + 5, y + 2, 1.2) + ac(x - 1, y + 6, 1));
  const stampH = (c, r) => paint('#F2604F', heart(grid[c], gy[r], 16)) + speck(grid[c], gy[r]);
  const stampO = (c, r) => paint('#2E8BE6', ac(grid[c], gy[r], 14)) + speck(grid[c], gy[r]);
  const rowOf = (r, heartFirst) => grid.map((_, c) => (c % 2 === 0) === heartFirst ? stampH(c, r) : stampO(c, r)).join('');
  const leafA = leafD(60, 170, 110, 40, 56), leafB = leafD(128, 188, 186, 118, 40), leafC = leafD(146, 100, 176, 22, 34);
  const plateLines = ar(45, 100, 60, 55) + apg('38,100 75,68 112,100') + ar(68, 125, 14, 30) + ar(87, 110, 12, 12);
  const plateMore = ap('M140 32 A17 17 0 1 0 158 56 A13 13 0 1 1 140 32 Z') + al(60, 40, 60, 50) + al(55, 45, 65, 45) + al(95, 32, 95, 40) + al(91, 36, 99, 36) + al(112, 58, 112, 66) + al(108, 62, 116, 62) + al(145, 155, 145, 120) + ac(145, 104, 17) + al(20, 155, 180, 155);
  LESSONS.push(
    { id: 'pr-hand', cat: 'print', level: 1, title: 'Handprint octopus', ico: '🐙',
      need: 'Paper, purple paint, a brush, a wet cloth, and a grown-up to help', tip: 'Press down, count to 3, then lift your hand straight up!', steps: [
      ['Ask a grown-up to brush purple paint all over your palm and fingers. It tickles!', guide(palm + fingers)],
      ['Press your hand on the paper with your fingers pointing down. Count to 3 and lift it straight up.', paint('#8E7CC3', palm + fingers), { clear: true }],
      ['An octopus has 8 legs! Paint 3 more wiggly legs with your finger.', fat('#8E7CC3', 'M68 86 Q42 110 46 148 q2 8 -6 10', 14) + fat('#8E7CC3', 'M64 72 Q34 70 24 98 q-2 8 -10 4', 14) + fat('#8E7CC3', 'M128 86 Q156 116 158 148 q0 8 8 8', 14)],
      ['When it is dry, glue on googly eyes, or paint white eyes with black dots.', paint('#fff', ac(87, 64, 10) + ac(113, 64, 10)) + stroke('#22305A', ac(87, 64, 10) + ac(113, 64, 10)) + paint('#22305A', ac(89, 66, 4.5) + ac(115, 66, 4.5))],
      ['Draw a happy smile and some bubbles with a marker.', ap('M90 84 q10 9 20 0') + ac(160, 40, 6) + ac(174, 22, 4) + ac(148, 18, 3)],
      ['Paint wavy seaweed around it. Give your octopus a name!', fat('#2FA36B', 'M16 198 q-8 -15 0 -30 t0 -30 t0 -30', 6) + fat('#2FA36B', 'M186 198 q8 -15 0 -30 t0 -30', 6) + fat('#6CC08B', 'M30 198 q6 -12 0 -24 t0 -24', 5)]] },
    { id: 'pr-finger', cat: 'print', level: 1, title: 'Fingerprint bugs', ico: '🐞',
      need: 'Paper, an ink pad or paint, a black pen, and a wet wipe', tip: 'Wipe your finger between colors so they stay bright.', steps: [
      ['Press your finger on red paint, then on the paper. That is a ladybug body!', paint('#F2604F', ae(55, 58, 14, 18))],
      ['Press 5 green fingerprints in a wiggly row: a caterpillar!', paint('#2FA36B', [[40, 140], [60, 132], [80, 140], [100, 132], [120, 140]].map(([x, y]) => ae(x, y, 11, 13)).join(''))],
      ['Press one yellow fingerprint sideways: a bee!', paint('#FFC23D', ae(145, 62, 16, 12))],
      ['When it is dry, give the ladybug a head, spots, legs and a line down its back.', paint('#22305A', ac(55, 39, 7) + ac(48, 54, 2.5) + ac(62, 54, 2.5) + ac(48, 66, 2.5) + ac(62, 66, 2.5)) + al(55, 44, 55, 75) + al(42, 52, 33, 48) + al(41, 60, 32, 60) + al(43, 68, 34, 72) + al(68, 52, 77, 48) + al(69, 60, 78, 60) + al(67, 68, 76, 72) + al(52, 33, 48, 26) + al(58, 33, 62, 26)],
      ['Give the caterpillar a face, feelers and lots of little feet.', paint('#22305A', ac(116, 136, 2) + ac(125, 136, 2)) + ap('M115 145 q5 4 10 0') + al(116, 128, 112, 118) + al(124, 128, 128, 118) + ac(112, 116, 2) + ac(128, 116, 2) + [40, 60, 80, 100, 120].map((x, i) => al(x - 4, (i % 2 ? 145 : 153), x - 5, (i % 2 ? 150 : 158)) + al(x + 4, (i % 2 ? 145 : 153), x + 5, (i % 2 ? 150 : 158))).join('')],
      ['Give the bee stripes, wings, an eye and a stinger. Draw a dotted line where it flew.', al(140, 51, 140, 73) + al(150, 51, 150, 73) + ae(139, 45, 6, 8) + ae(151, 45, 6, 8) + paint('#22305A', ac(156, 59, 1.8)) + apg('129,62 122,59 122,65') + '<path d="M118 60 q-14 -16 -30 -6" style="stroke-dasharray:3 6"/>'],
      ['Draw some grass for them to play in. What else can a fingerprint become?', stroke('#2FA36B', ap('M5 185 q5 -12 10 0 q5 -12 10 0 q5 -12 10 0 q5 -12 10 0 q5 -12 10 0 q5 -12 10 0 q5 -12 10 0 q5 -12 10 0 q5 -12 10 0 q5 -12 10 0 q5 -12 10 0 q5 -12 10 0 q5 -12 10 0 q5 -12 10 0 q5 -12 10 0 q5 -12 10 0 q5 -12 10 0 q5 -12 10 0 q5 -12 10 0'))]] },
    { id: 'pr-potato', cat: 'print', level: 2, title: 'Potato stamp pattern', ico: '🥔',
      need: 'A potato cut and carved by a grown-up, a cork, paint, paper', tip: 'Dab the stamp on a paper towel first so it is not too drippy.', steps: [
      ['A grown-up cuts a potato in half and carves a heart on the flat side.', guide(ae(100, 100, 50, 36) + heart(100, 100, 22))],
      ['Dab the heart in red paint. Stamp a heart, skip a space, stamp a heart.', stampH(0, 0) + stampH(2, 0), { clear: true }],
      ['Dip a cork in blue paint. Stamp circles in the spaces.', stampO(1, 0) + stampO(3, 0)],
      ['Next row: start with a circle this time! Circle, heart, circle, heart.', rowOf(1, false)],
      ['Keep going until the paper is full. Each row swaps which stamp goes first.', rowOf(2, true) + rowOf(3, false)],
      ['When it is dry, add a yellow fingertip dot in each circle. Use it as wrapping paper!', paint('#FFC23D', [0, 1, 2, 3].map(r => grid.map((x, c) => (c + r) % 2 ? ac(x, gy[r], 5) : '').join('')).join(''))]] },
    { id: 'pr-leaf', cat: 'print', level: 2, title: 'Leaf rubbing', ico: '🍂',
      need: 'Leaves from outside, thin paper, crayons with the paper peeled off', tip: 'Rub gently with the long side of the crayon, not the tip.', steps: [
      ['Find a leaf with bumpy veins. Put it under your paper, bumpy side up.', guide(ap(leafA))],
      ['Rub over it with the long side of a green crayon. The leaf appears like magic!', rubbing('a3la', leafA, '#CFEBD8', '#2FA36B'), { clear: true }],
      ['Rub a little harder over the veins. They show up dark!', stroke('#1F7A4C', leafVeins(60, 170, 110, 40, 56))],
      ['Slide a new leaf under the paper and rub it with orange.', rubbing('a3lb', leafB, '#FFE0C2', '#FF8A2B') + stroke('#C8641A', leafVeins(128, 188, 186, 118, 40))],
      ['Add one more leaf with red.', rubbing('a3lc', leafC, '#FBD3CF', '#F2604F') + stroke('#B83A2E', leafVeins(146, 100, 176, 22, 34))],
      ['Write where you found them. Try rubbing coins or tree bark too!', ink(48, 26, 'The park', 15)]] },
    { id: 'pr-scene', cat: 'print', level: 3, title: 'Foam print night', ico: '🏡',
      need: 'A clean foam tray, a pencil, a roller, thick paint, paper; a grown-up cuts', tip: 'Press your lines deep. Shallow lines fill up with paint and vanish.', steps: [
      ['Ask a grown-up to cut a flat square from a clean foam food tray.', ar(20, 20, 160, 160, 4)],
      ['Press a pencil into the foam to draw a house. Press firmly, but do not poke through!', plateLines],
      ['Add a moon, stars, a tree and the ground. No words: they would print backwards!', plateMore],
      ['Roll paint over the foam with a roller: blue over the sky, green over the ground.', T('#3E64B5', ar(20, 20, 160, 135)) + T('#2FA36B', ar(20, 155, 160, 25))],
      ['Lay paper on top and rub all over with your hand. Peel it off slowly. The pressed lines print white!', stroke('#fff', wide(plateLines + plateMore, 4))],
      ['Make more prints in new colors. Sign each one in pencil, like real printmakers do: 1/3, 2/3...', ink(36, 196, '1/3', 12) + ap('M130 194 q4 -8 8 0 t8 0 t8 0 t8 0')]] }
  );

  /* ---- Clay & 3D making ---- */
  const potRows = [0, 1, 2, 3, 4].map(i => ar(110, 165 - 11 * i, 70, 11, 5.5)).join('');
  const shell = spiral(96, 112, 42, 3.1, 0.3);
  const snailBody = 'M22 172 Q20 160 40 158 L140 156 Q160 154 166 130 Q170 112 182 114 Q194 118 190 138 Q186 166 150 174 L36 178 Q22 178 22 172 Z';
  const bodyBox = apg('60,90 75,78 145,78 130,90') + apg('130,90 145,78 145,148 130,160') + ar(60, 90, 70, 70);
  const headBox = apg('76,48 84,42 126,42 118,48') + apg('118,48 126,42 126,80 118,86') + ar(76, 48, 42, 38);
  const shine = (x, y, rx, ry) => paint('rgba(255,255,255,.6)', ae(x, y, rx, ry));
  LESSONS.push(
    { id: 'cl-coil', cat: 'clay', level: 1, title: 'Clay snake & coil pot', ico: '🐍',
      need: 'Clay or play dough, a table mat, and a pencil for patterns', tip: 'Roll with flat hands, not fingers. Start in the middle and slide out.', steps: [
      ['Squeeze a lump of clay to make it soft. Roll it into a ball between your hands.', clay(ac(30, 40, 15)) + shine(25, 34, 5, 3)],
      ['Roll the ball on the table with flat hands, back and forth, into a long snake.', rope('M62 40 q15 -10 30 0 t30 0 t30 0 t30 0', 12) + paint('#22305A', ac(179, 37, 1.6))],
      ['Coil a snake round and round into a flat circle. This is the bottom of your pot.', rope(spiral(50, 135, 31, 2.4), 8)],
      ['Make more snakes. Stack them round and round on the edge to build the walls.', clay(potRows) + paint('#9A6440', ae(145, 124, 31, 4))],
      ['Smooth the inside with your finger so the coils stick. Press dots on the outside with a pencil.', paint('#B97A50', [0, 1, 2, 3, 4].map(i => [120, 135, 150, 165].map(x => ac(x + (i % 2) * 7, 170.5 - 11 * i, 1.6)).join('')).join(''))],
      ['Let it dry. Then fill your pot with pencils or flowers!', fat('#F2604F', 'M134 122 L124 84', 6) + fat('#2E8BE6', 'M146 122 L148 78', 6) + fat('#2FA36B', 'M157 122 L168 86', 6) + paint('#22305A', ac(124, 82, 2.5) + ac(148, 76, 2.5) + ac(168, 84, 2.5))]] },
    { id: 'cl-pinch', cat: 'clay', level: 1, title: 'Pinch pot', ico: '🥣',
      need: 'Air-dry clay or play dough, and paint for later', tip: 'Small pinches, lots of turns. Slow and gentle makes it round.', steps: [
      ['Roll a ball of clay about as big as an orange.', clay(ac(45, 48, 26)) + shine(36, 38, 8, 5)],
      ['Push your thumb into the middle. Stop before you reach the bottom!', clay(ac(150, 48, 26)) + paint('#9A6440', ae(150, 42, 9, 6))],
      ['Pinch the sides gently with your thumb inside and fingers outside. The ball opens into a bowl!', clay(ap('M45 120 Q50 186 100 186 Q150 186 155 120 Z')) + clay(ae(100, 120, 55, 12), '#EFC39E') + paint('#B5774D', ae(100, 122, 45, 8))],
      ['Pinch, then turn it a little. Pinch and turn, all the way around.', ap('M48 100 Q100 76 152 100') + apl('142,92 152,100 141,104')],
      ['Press a pattern around the outside with a pencil tip.', stroke('#B97A50', ap('M52 138 Q76 152 100 152 Q124 152 148 138')) + paint('#B97A50', [[62, 160], [80, 166], [100, 168], [120, 166], [138, 160]].map(([x, y]) => ac(x, y, 2.4)).join(''))],
      ['Let it dry, then paint it bright. Keep tiny treasures inside!', paint('#2E8BE6', ac(86, 118, 6)) + paint('#F78FB3', ac(104, 116, 5)) + paint('#FFC23D', apg(zig(5, 3, 7, 120, 119)))]] },
    { id: 'cl-snail', cat: 'clay', level: 2, title: 'Clay snail', ico: '🐌',
      need: 'Clay or play dough, a pencil and a toothpick', tip: 'Wet your finger a tiny bit to smooth the joins so parts stay on.', steps: [
      ['Roll a fat snake and flatten it a little. Bend the front end up for the head.', clay(ap(snailBody))],
      ['Roll a long thin snake. Coil it up from one end, like a cinnamon roll.', rope(shell, 10)],
      ['Stand the coil on the body and press gently. That is the shell!', paint('#B97A50', ae(96, 157, 30, 3))],
      ['Roll two tiny snakes for eye stalks. Press them onto the head with a ball on each top.', rope('M178 118 L172 94', 5) + rope('M188 120 L194 98', 5) + clay(ac(172, 90, 5) + ac(194, 94, 5))],
      ['Poke eyes with a pencil tip, and draw a smile with a toothpick.', paint('#22305A', ac(172, 90, 2) + ac(194, 94, 2)) + stroke('#22305A', ap('M176 134 q7 5 13 0'))],
      ['Press dots along the body, and make a little slime trail behind it.', paint('#B97A50', [44, 64, 84, 104, 124, 144].map(x => ac(x, 168, 1.8)).join('')) + '<path d="M20 182 Q12 184 2 182" style="stroke-dasharray:3 5"/>'],
      ['Let it dry, then paint the shell. What will you name your snail?', rope(shell, 10, '#F7A8C4', '#C2577F')]] },
    { id: 'cl-plate', cat: 'clay', level: 2, title: 'Paper-plate lion', ico: '🦁',
      need: 'A paper plate, paint, orange paper, glue, a stick; kid scissors with help', tip: 'Curl each paper strip around a pencil to make a fluffy mane.', steps: [
      ['Take a paper plate. Trace around its middle circle so you can see it.', ac(100, 100, 62) + ac(100, 100, 48)],
      ['Paint the whole plate yellow. Let it dry.', T('#FFD966', ac(100, 100, 62))],
      ['Cut strips of orange paper. Glue them all around the back edge: a fluffy mane!', paint('#FF8A2B', around(22, 0, 100, 100, (x, y, a) => cap(f1(100 + 66 * Math.cos(a)), f1(100 + 66 * Math.sin(a)), f1(100 + 92 * Math.cos(a)), f1(100 + 92 * Math.sin(a)), 9)))],
      ['Cut two round ears and glue them on top.', paint('#E07B39', ac(60, 60, 13) + ac(140, 60, 13)) + paint('#F7A39A', ac(60, 60, 6) + ac(140, 60, 6))],
      ['Draw eyes, a nose and a mouth with a marker.', paint('#22305A', ac(84, 92, 5) + ac(116, 92, 5)) + paint('#fff', ac(85.5, 90.5, 1.5) + ac(117.5, 90.5, 1.5)) + paint('#8B5E3C', apg('90,106 110,106 100,118')) + ap('M100 118 v6 q-8 8 -14 2 M100 124 q8 8 14 2')],
      ['Add whiskers, and tape a stick at the bottom. Now it is a lion mask. ROAR!', al(66, 112, 84, 116) + al(64, 122, 84, 120) + al(134, 112, 116, 116) + al(136, 122, 116, 120) + paint('#C08A5A', ar(95, 158, 10, 42, 3))]] },
    { id: 'cl-robot', cat: 'clay', level: 3, title: 'Recycled box robot', ico: '🤖',
      need: 'Clean boxes, tubes, bottle caps, tape, glue, paint; a grown-up for cutting', tip: 'Tape it together first. Paint at the end, once everything holds.', steps: [
      ['Collect clean boxes, tubes and bottle caps. A big box is the body: we can see its front, top and side.', bodyBox],
      ['Tape a smaller box on top for the head.', headBox],
      ['Tape on two tubes for arms.', ar(28, 100, 32, 16, 2) + ae(28, 108, 4, 8) + ar(140, 96, 32, 16, 2) + ae(172, 104, 4, 8)],
      ['Tape two tubes under the body for legs.', ar(70, 160, 18, 30) + ae(79, 190, 9, 3) + ar(102, 160, 18, 30) + ae(111, 190, 9, 3)],
      ['Glue on bottle caps for eyes and buttons, and a strip for a mouth.', ac(88, 62, 7) + ac(106, 62, 7) + paint('#22305A', ac(88, 62, 3) + ac(106, 62, 3)) + ar(86, 74, 22, 6, 2) + paint('#F2604F', ac(76, 108, 6)) + paint('#FFC23D', ac(95, 108, 6)) + paint('#2E8BE6', ac(114, 108, 6)) + ac(76, 108, 6) + ac(95, 108, 6) + ac(114, 108, 6)],
      ['Add a straw antenna with a pom-pom, and draw a control panel.', al(101, 45, 101, 22) + paint('#F2604F', ac(101, 18, 5)) + ar(72, 124, 46, 24, 3) + ac(84, 136, 6) + al(84, 136, 88, 132) + al(96, 132, 112, 132) + al(96, 140, 112, 140)],
      ['Paint it silver. Make the side faces darker and the tops lighter: now it looks 3D! Give it a name.', T('#C9D3E0', ar(60, 90, 70, 70) + ar(76, 48, 42, 38) + ar(28, 100, 32, 16, 2) + ar(140, 96, 32, 16, 2) + ar(70, 160, 18, 30) + ar(102, 160, 18, 30)) + T('#8F9BB0', apg('130,90 145,78 145,148 130,160') + apg('118,48 126,42 126,80 118,86')) + T('#EEF2F6', apg('60,90 75,78 145,78 130,90') + apg('76,48 84,42 126,42 118,48'))]] }
  );

  /* ---- Famous art styles ---- */
  const kBoxes = [[60, 60, ['#FFD966', '#2E8BE6', '#F2604F', '#2FA36B']], [140, 60, ['#F78FB3', '#FFC23D', '#6D55D1', '#F2604F']], [60, 140, ['#6CC08B', '#F2604F', '#FFD966', '#2E8BE6']], [140, 140, ['#B7A6EA', '#FF9F43', '#2FA36B', '#FFD966']]];
  const swirl = 'M10 95 Q45 65 85 82 Q118 96 128 72 Q134 48 110 48 Q94 50 100 64 Q104 72 112 66';
  const vgStars = [[36, 38, 5], [76, 24, 4], [150, 96, 5]];
  const cypress = 'M30 190 Q16 140 30 100 Q34 80 38 60 Q44 90 50 110 Q60 150 50 190 Z';
  const popC = [[55, 55], [145, 55], [55, 145], [145, 145]];
  const popHair = (cx, cy) => `M${cx - 26} ${cy + 6} Q${cx - 30} ${cy - 32} ${cx} ${cy - 28} Q${cx + 30} ${cy - 32} ${cx + 26} ${cy + 6} Q${cx + 16} ${cy - 12} ${cx - 2} ${cy - 14} Q${cx - 18} ${cy - 12} ${cx - 26} ${cy + 6} Z`;
  const popLips = (cx, cy) => `M${cx - 10} ${cy + 20} Q${cx} ${cy + 29} ${cx + 10} ${cy + 20} Q${cx} ${cy + 23} ${cx - 10} ${cy + 20} Z`;
  const popFace = (cx, cy) => ae(cx, cy + 6, 24, 28) + ap(popHair(cx, cy)) + ae(cx - 9, cy + 4, 4, 2.5) + ae(cx + 9, cy + 4, 4, 2.5) + ap(`M${cx} ${cy + 8} L${cx - 3} ${cy + 14} L${cx + 1} ${cy + 14}`) + ap(popLips(cx, cy));
  const popSil = (cx, cy) => `M${cx - 26} ${cy + 6} Q${cx - 30} ${cy - 32} ${cx} ${cy - 28} Q${cx + 30} ${cy - 32} ${cx + 26} ${cy + 6} L${cx + 24} ${cy + 6} A24 28 0 0 1 ${cx - 24} ${cy + 6} Z`;
  const popCol = [['#F78FB3', '#FFE066', '#FF8A2B'], ['#FFD966', '#9CCBF5', '#6D55D1'], ['#5BC0EB', '#F7B6CF', '#F2604F'], ['#FF9F43', '#B9E2C6', '#2E8BE6']];
  const benDay = (() => { let s = ''; for (let y = 16; y < 98; y += 7) for (let x = 16 + (y % 14 ? 3.5 : 0); x < 98; x += 7) if (((x - 55) / 30) ** 2 + ((y - 57) / 38) ** 2 > 1) s += ac(x, y, 2); return s; })();
  LESSONS.push(
    { id: 'st-mondrian', cat: 'styles', level: 1, title: 'Mondrian lines & blocks', ico: '🟥',
      need: 'Paper, a ruler, a black marker, and red, yellow and blue crayons', tip: 'Use a ruler for straight lines. Leave lots of white!', steps: [
      ['Piet Mondrian made art with only straight lines and a few colors. Draw a big square.', ar(20, 20, 160, 160)],
      ['Use a ruler to draw thick black lines. Some go all the way across, some stop at another line.', wide(al(70, 20, 70, 180) + al(20, 80, 180, 80) + al(150, 20, 150, 80) + al(70, 140, 180, 140) + al(120, 140, 120, 180), '6;stroke-linecap:butt')],
      ['Color one big box red.', paint('#E8402F', ar(73, 83, 105.5, 54))],
      ['Color one small box yellow.', paint('#FFC23D', ar(153, 21.5, 25.5, 55.5))],
      ['Color one tall box blue.', paint('#1F5FBF', ar(21.5, 83, 45.5, 95.5))],
      ['Leave the other boxes white. Mondrian liked balance: big and small, colour and white. Try it with tape too!', '']] },
    { id: 'st-kandinsky', cat: 'styles', level: 1, title: 'Kandinsky circles', ico: '⭕',
      need: 'Paper, a pencil and lots of bright crayons or paint', tip: 'Put colors that look very different next to each other.', steps: [
      ['Wassily Kandinsky painted circles inside squares. Draw a big square and split it into 4 boxes.', ar(20, 20, 160, 160) + al(100, 20, 100, 180) + al(20, 100, 180, 100)],
      ['Draw a big circle in every box.', kBoxes.map(([x, y]) => ac(x, y, 32)).join('')],
      ['Draw a smaller circle inside each big one.', kBoxes.map(([x, y]) => ac(x, y, 21)).join('')],
      ['Draw a tiny circle in each middle.', kBoxes.map(([x, y]) => ac(x, y, 10)).join('')],
      ['Color each box a different color, around the outside of the circle.', kBoxes.map(([x, y, c]) => T(c[0], ap(`M${x - 40} ${y - 40} h80 v80 h-80 Z ${circ(x, y, 32)}`), true)).join('')],
      ['Color every ring a new color. Kandinsky said colors are like music!', kBoxes.map(([x, y, c]) => T(c[1], ap(circ(x, y, 32) + ' ' + circ(x, y, 21)), true) + T(c[2], ap(circ(x, y, 21) + ' ' + circ(x, y, 10)), true) + T(c[3], ac(x, y, 10))).join('')]] },
    { id: 'st-matisse', cat: 'styles', level: 2, title: 'Matisse cut-outs', ico: '✂️',
      need: 'Colored paper, glue, and kid scissors (a grown-up can help)', tip: 'Cut without drawing first. Wobbly shapes are perfect here!', steps: [
      ['Henri Matisse made pictures by cutting colored paper. He called it drawing with scissors! Glue down a blue and a pink paper.', paint('#2E8BE6', ar(15, 15, 85, 170)) + paint('#F78FB3', ar(100, 15, 85, 170))],
      ['Cut a big wiggly shape, like seaweed, from yellow paper. Glue it on the blue.', paint('#FFC23D', algae(57, 160, 128, 30, 0))],
      ['Cut another wiggly shape from dark paper for the pink side.', paint('#22305A', algae(142, 160, 116, 30, 1.2))],
      ['Cut little stars and dots from white paper. Sprinkle them around.', paint('#fff', apg(zig(5, 3.5, 8, 28, 30)) + apg(zig(5, 3.5, 8, 170, 40)) + apg(zig(5, 3, 7, 112, 130)) + ac(88, 40, 4) + ac(118, 28, 3.5) + ac(25, 120, 3.5) + ac(172, 120, 4))],
      ['Cut a wavy strip of orange and glue it along the bottom.', paint('#FF8A2B', ap(`M15 172 q10.6 -10 21.25 0 ${Array.from({ length: 7 }, () => 't21.25 0').join(' ')} V185 H15 Z`))],
      ['Move the pieces around until you love it, then glue. Give it a title, like Matisse did!', '']] },
    { id: 'st-vangogh', cat: 'styles', level: 2, title: "Van Gogh's swirly night", ico: '🌌',
      need: 'Paper, a pencil, and oil pastels or crayons', tip: 'Use lots of short strokes side by side. Let them show!', steps: [
      ['Vincent van Gogh painted a night sky full of swirls. Draw one big curly swirl across the sky.', ap(swirl)],
      ['Draw a moon in the corner and some round stars.', ac(166, 36, 13) + vgStars.map(([x, y, r]) => ac(x, y, r)).join('')],
      ['Draw rings around the moon and stars to make them glow.', ac(166, 36, 21) + vgStars.map(([x, y, r]) => ac(x, y, r + 6)).join('')],
      ['Draw rolling hills and a tiny village with a pointy church.', ap('M0 150 Q50 130 100 145 Q150 160 200 140') + ar(70, 158, 16, 12) + apg('68,158 78,150 88,158') + ar(92, 160, 14, 12) + apg('90,160 99,153 108,160') + ar(118, 156, 14, 18) + apg('116,156 125,128 134,156')],
      ['Draw a tall wavy cypress tree on the left, like a dark flame.', ap(cypress)],
      ['Fill the sky with short strokes that follow the swirl, like brush marks.', stroke('#2E5FB8', [-16, 14, 28].map(d => `<path d="M10 95 Q45 65 85 82 Q118 96 128 72" transform="translate(0 ${d})" style="stroke-dasharray:7 5"/>`).join('') + `<path d="${circ(113, 60, 24)}" style="stroke-dasharray:7 5"/>` + '<path d="M60 12 Q100 2 140 14" style="stroke-dasharray:7 5"/><path d="M70 120 Q120 104 180 118" style="stroke-dasharray:7 5"/>')],
      ['Color the sky deep blue, the moon and stars yellow, and the tree almost black. Leave the strokes showing!', T('#5B83D6', ap('M0 0 H200 V140 Q150 160 100 145 Q50 130 0 150 Z')) + T('#5E8C6A', ap('M0 150 Q50 130 100 145 Q150 160 200 140 V200 H0 Z')) + paint('#FFD966', ac(166, 36, 13) + vgStars.map(([x, y, r]) => ac(x, y, r)).join('')) + stroke('#FFC23D', ac(166, 36, 21) + vgStars.map(([x, y, r]) => ac(x, y, r + 6)).join('')) + paint('#1B2442', ap(cypress)) + paint('#FFC23D', ar(75, 162, 5, 5) + ar(97, 164, 4, 4) + ar(123, 162, 4, 6))]] },
    { id: 'st-pop', cat: 'styles', level: 3, title: 'Pop art: 4 colour faces', ico: '🎭',
      need: 'Paper, a pencil, a thick black marker and very bright crayons', tip: 'Pop art is loud! Pick colors that shout, not whisper.', steps: [
      ['Andy Warhol printed the same picture again and again in bright colors. Split your paper into 4 boxes.', ar(10, 10, 180, 180) + al(100, 10, 100, 190) + al(10, 100, 190, 100)],
      ['Draw a simple face in the first box: hair, eyes, nose and lips.', popFace(55, 55)],
      ['Copy the same face into the other 3 boxes. Same size, same place. Tracing is fine!', popFace(145, 55) + popFace(55, 145) + popFace(145, 145)],
      ['Color each background a different bright color.', popC.map(([x, y], i) => T(popCol[i][0], ap(`M${x - 45} ${y - 45} h90 v90 h-90 Z ${popSil(x, y)}`), true)).join('')],
      ['Color each face and hair with colors that pop against the background. Make the lips red.', popC.map(([x, y], i) => T(popCol[i][1], ae(x, y + 6, 24, 28)) + T(popCol[i][2], ap(popHair(x, y))) + paint('#E8402F', ap(popLips(x, y)))).join('')],
      ['Roy Lichtenstein filled spaces with comic-book dots. Add dots to one background.', paint('#E8402F', benDay)],
      ['Go over every line with a thick black marker. Pop art is bold! Hang it up and show someone.', stroke('#1B1B1B', wide(popC.map(([x, y]) => ae(x, y + 6, 24, 28) + ap(popHair(x, y)) + ap(popLips(x, y))).join(''), 4.5))]] }
  );
});
