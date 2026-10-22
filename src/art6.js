/* ---------- art6: 3 more lessons for each of the 12 first kinds of art ---------- */
// Uses the helpers from art.js (ac, ae, al, ap, ar, apg, apl, guide, fold, stroke, paint, atext, ring, zig).
// Wrapped in an IIFE so the little helpers below never clash with other files.
ART_LATER.push(() => {
  const f1 = n => +(+n).toFixed(1);
  const P = (x, y) => `${f1(x)} ${f1(y)}`;
  const pts = a => a.map(p => `${f1(p[0])},${f1(p[1])}`).join(' ');
  // Colour that soaks in like a marker: lines underneath stay visible. ev = holes (even-odd).
  const T = (c, s, ev) => `<g class="pt" style="fill:${c};mix-blend-mode:multiply${ev ? ';fill-rule:evenodd' : ''}">${s}</g>`;
  // A thick line, like a fat crayon or a painty string.
  const fat = (d, w) => `<path d="${d}" style="stroke-width:${w}"/>`;
  const ell = (cx, cy, rx, ry = rx) => `M${f1(cx - rx)} ${cy} a${rx} ${ry} 0 1 0 ${f1(2 * rx)} 0 a${rx} ${ry} 0 1 0 ${f1(-2 * rx)} 0 Z`;
  const around = (n, R, cx, cy, f, a0 = -Math.PI / 2) => Array.from({ length: n }, (_, i) => { const a = a0 + i * 2 * Math.PI / n; return f(f1(cx + R * Math.cos(a)), f1(cy + R * Math.sin(a)), a); }).join('');
  const rays = (cx, cy, r1, r2, n = 8) => around(n, 1, cx, cy, (x, y, a) => al(f1(cx + r1 * Math.cos(a)), f1(cy + r1 * Math.sin(a)), f1(cx + r2 * Math.cos(a)), f1(cy + r2 * Math.sin(a))));
  const sun = (cx, cy, r) => ac(cx, cy, r) + rays(cx, cy, r + 4, r + 10);
  const starPts = (cx, cy, R, r, n = 5) => Array.from({ length: n * 2 }, (_, i) => { const a = (i * 180 / n - 90) * Math.PI / 180, d = i % 2 ? r : R; return `${f1(cx + d * Math.cos(a))},${f1(cy + d * Math.sin(a))}`; }).join(' ');
  const cloudD = (cx, cy, s = 1) => `M${f1(cx - 32 * s)} ${f1(cy + 12 * s)} A${f1(12 * s)} ${f1(12 * s)} 0 0 1 ${f1(cx - 24 * s)} ${f1(cy - 8 * s)} A${f1(14 * s)} ${f1(14 * s)} 0 0 1 ${f1(cx)} ${f1(cy - 16 * s)} A${f1(14 * s)} ${f1(14 * s)} 0 0 1 ${f1(cx + 24 * s)} ${f1(cy - 8 * s)} A${f1(12 * s)} ${f1(12 * s)} 0 0 1 ${f1(cx + 32 * s)} ${f1(cy + 12 * s)} Z`;
  // Little bumps (curly hair) or spikes around the top of a head circle, from angle a0 to a1 (degrees).
  const pol = (cx, cy, r, deg) => [cx + r * Math.cos(deg * Math.PI / 180), cy + r * Math.sin(deg * Math.PI / 180)];
  const bumpsD = (cx, cy, r, a0, a1, n) => {
    let d = 'M' + P(...pol(cx, cy, r, a0));
    for (let i = 1; i <= n; i++) { const p = pol(cx, cy, r, a0 + (a1 - a0) * i / n), q = pol(cx, cy, r, a0 + (a1 - a0) * (i - 1) / n), s = f1(Math.hypot(p[0] - q[0], p[1] - q[1]) / 2); d += ` A${s} ${s} 0 0 1 ${P(...p)}`; }
    return d;
  };
  const spikePts = (cx, cy, r, len, a0, a1, n) => { const a = []; for (let i = 0; i <= 2 * n; i++) a.push(pol(cx, cy, i % 2 ? r + len : r, a0 + (a1 - a0) * i / (2 * n))); return a; };
  // Scissors sign for "a grown-up helps cut".
  const scissors = (x, y) => ac(x - 6, y + 10, 4) + ac(x + 6, y + 10, 4) + al(x - 4, y + 6, x + 8, y - 12) + al(x + 4, y + 6, x - 8, y - 12);
  // A soft wobbly paint blob (deterministic, so it looks the same every time).
  const rnd = seed => () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const blobD = (cx, cy, r, seed, n = 9, wob = 0.25) => {
    const R = rnd(seed), rr = Array.from({ length: n }, () => r * (1 - wob + 2 * wob * R()));
    const p = rr.map((q, i) => pol(cx, cy, q, i * 360 / n));
    let d = 'M' + P((p[0][0] + p[1][0]) / 2, (p[0][1] + p[1][1]) / 2);
    for (let i = 1; i <= n; i++) { const a = p[i % n], b = p[(i + 1) % n]; d += ` Q${P(...a)} ${P((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)}`; }
    return d + ' Z';
  };
  const splat = (cx, cy, r, seed) => {
    const R = rnd(seed + 7);
    let s = ap(blobD(cx, cy, r, seed, 11, 0.35));
    for (let i = 0; i < 6; i++) { const a = R() * 360, d = r * (1.5 + R() * 0.9); s += ac(...pol(cx, cy, d, a).map(f1), f1(1.2 + R() * r * 0.14)); }
    return s;
  };

  /* ================= Shape pictures ================= */
  const truckBox = ar(20, 70, 115, 80, 6), truckCab = ar(135, 95, 45, 55, 6);
  const balloonOut = 'M61.1 113.9 A55 55 0 1 1 138.9 113.9 L112 142 H88 Z';
  const lhBands = apg('77.3,85 122.7,85 124.4,100 75.6,100') + apg('72.9,125 127.1,125 128.7,140 71.3,140');
  const waves = 'M0 180 q12.5 -8 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0';
  LESSONS.push(
    { id: 'a6-sh-truck', cat: 'shapes', level: 1, title: 'An ice-cream truck', ico: '🚚',
      need: 'Paper, a pencil and crayons', tip: 'A truck is only rectangles and circles put together!', steps: [
      ['Draw a long rectangle for the back of the truck.', truckBox],
      ['Add a smaller rectangle at the front. That is where the driver sits.', truckCab],
      ['Draw a window for the driver and a big window to sell ice cream.', ar(143, 103, 28, 20, 3) + ar(40, 82, 60, 34, 3)],
      ['Add two round wheels with a small circle in each.', ac(55, 164, 14) + ac(150, 164, 14) + ac(55, 164, 5) + ac(150, 164, 5)],
      ['Put a giant ice-cream cone on the roof!', apg('66,45 94,45 80,70') + ap('M66 45 A14 14 0 0 1 94 45') + ac(80, 26, 4)],
      ['Draw a wavy stripe along the side.', ap('M20 132 q11.5 -8 23 0 t23 0 t23 0 t23 0 t23 0')],
      ['Color it in! What flavor is your ice cream?', T('#FFC7D6', truckBox) + T('#9CCBF5', truckCab) + T('#FFF3C4', ar(40, 82, 60, 34) + ar(143, 103, 28, 20)) + T('#E8B46A', apg('66,45 94,45 80,70')) + T('#F78FB3', ap('M66 45 A14 14 0 0 1 94 45 Z')) + T('#F2604F', ac(80, 26, 4)) + T('#7C88A8', ac(55, 164, 14) + ac(150, 164, 14))]] },
    { id: 'a6-sh-lighthouse', cat: 'shapes', level: 1, title: 'A lighthouse', ico: '🗼',
      need: 'Paper, a pencil and crayons', tip: 'Lighthouses shine at night so boats do not bump the rocks.', steps: [
      ['Draw a tall tower. Make it thin at the top and wide at the bottom.', apg('80,60 120,60 132,170 68,170')],
      ['Put a small square on top. The light lives in there.', ar(84, 38, 32, 22)],
      ['Add a triangle roof on top of the square.', apg('78,38 122,38 100,16')],
      ['Draw 4 lines across the tower to make 2 wide stripes.', al(77.3, 85, 122.7, 85) + al(75.6, 100, 124.4, 100) + al(72.9, 125, 127.1, 125) + al(71.3, 140, 128.7, 140)],
      ['Add a round window and a door with a round top.', ac(100, 112, 6) + ap('M92 170 V158 A8 8 0 0 1 108 158 V170')],
      ['Draw light beams shining out to both sides.', al(84, 44, 25, 30) + al(84, 54, 25, 68) + al(116, 44, 175, 30) + al(116, 54, 175, 68)],
      ['Draw wavy sea at the bottom.', ap(waves)],
      ['Color the stripes red and the light bright yellow!', T('#F2604F', lhBands + apg('78,38 122,38 100,16')) + T('#FFD966', ar(84, 38, 32, 22) + apg('84,44 25,30 25,68 84,54') + apg('116,44 175,30 175,68 116,54')) + T('#9CCBF5', ap(waves + ' V200 H0 Z'))]] },
    { id: 'a6-sh-balloon', cat: 'shapes', level: 2, title: 'A hot-air balloon', ico: '🎈',
      need: 'Paper, a pencil and crayons', tip: 'Start with a light circle. Then change its bottom into a point.', steps: [
      ['Draw a big light guide circle.', guide(ac(100, 75, 55))],
      ['Draw over the circle, but make the bottom go in to a narrow end.', ap(balloonOut)],
      ['Draw 3 lines from the top to the bottom to make stripes.', ap('M100 20 Q60 75 88 142') + al(100, 20, 100, 142) + ap('M100 20 Q140 75 112 142')],
      ['Hang a basket under the balloon with two ropes.', al(88, 142, 88, 158) + al(112, 142, 112, 158) + ar(84, 158, 32, 22, 3)],
      ['Erase the guide circle. Add little clouds and birds in the sky.', ap(cloudD(30, 40, 0.6)) + ap(cloudD(172, 122, 0.6)) + ap('M150 30 q5 -5 10 0 q5 -5 10 0'), { clear: true }],
      ['Color the stripes in two colors that take turns: red, yellow, red, yellow!', T('#F2604F', ap('M61.1 113.9 A55 55 0 0 1 100 20 Q60 75 88 142 Z') + ap('M100 20 V142 H112 Q140 75 100 20 Z')) + T('#FFD966', ap('M100 20 Q60 75 88 142 H100 Z') + ap('M100 20 A55 55 0 0 1 138.9 113.9 L112 142 Q140 75 100 20 Z')) + T('#C99A6E', ar(84, 158, 32, 22))]] }
  );

  /* ================= Animals ================= */
  const pengFace = 'M100 60 C85 40 62 52 66 80 C56 110 60 160 100 176 C140 160 144 110 134 80 C138 52 115 40 100 60 Z';
  const frogHead = 'M56.4 81 C20 95 30 150 100 150 C170 150 180 95 143.6 81 A18 18 0 0 1 115.3 84.7 Q100 80 84.7 84.7 A18 18 0 0 1 56.4 81 Z';
  const frogBody = 'M72.5 146.6 Q55 190 100 190 Q145 190 127.5 146.6';
  const horseHead = 'M72 118 C66 100 60 92 54 84 L34 86 Q22 88 20 78 Q19 68 28 62 L40 46 L44 32 L52 44 Q70 50 86 84';
  const horseBack = 'M86 84 Q120 80 150 88 Q166 94 162 120';
  const horseAll = horseHead + ' Q120 80 150 88 Q166 94 162 120 L160 180 H150 L148 138 Q118 146 90 136 L89 180 H77 L74 130 Z';
  const farLegs = 'M101.3 139.3 L102 176 H110 L107 140.4 M136.1 140.4 L134 176 H142 L142 139.5';
  const mane = 'M52 44 Q64 40 61 49 Q74 48 69.5 57 Q84 60 77.9 68.8 Q92 74 86 84';
  const tail = 'M160 96 Q190 100 182 140 Q180 152 186 160 Q168 154 170 132 Q172 112 162 102';
  LESSONS.push(
    { id: 'a6-an-penguin', cat: 'animals', level: 1, title: 'A penguin', ico: '🐧',
      need: 'Paper, a pencil and crayons', tip: 'Penguins waddle! Try drawing one leaning to the side.', steps: [
      ['Draw a big tall oval for the body.', ae(100, 108, 52, 74)],
      ['Draw a white tummy inside. It goes up into a heart shape for the face.', ap(pengFace)],
      ['Add two eyes and a pointy beak.', ac(86, 72, 4.5) + ac(114, 72, 4.5) + apg('93,80 107,80 100,92')],
      ['Draw a flipper on each side, like little wings.', ap('M49 95 Q22 130 58 152') + ap('M151 95 Q178 130 142 152')],
      ['Add two flat feet at the bottom.', ae(82, 186, 13, 6) + ae(118, 186, 13, 6)],
      ['Draw the icy ground and some snowflakes.', al(10, 194, 190, 194) + ac(25, 30, 2) + ac(40, 60, 2) + ac(170, 40, 2) + ac(180, 75, 2) + ac(20, 95, 2)],
      ['Color the back dark, keep the tummy white, and make the beak and feet orange.', T('#4A5A7E', ap(ell(100, 108, 52, 74) + ' ' + pengFace), true) + T('#4A5A7E', ap('M49 95 Q22 130 58 152 Z') + ap('M151 95 Q178 130 142 152 Z')) + T('#FF9F43', apg('93,80 107,80 100,92') + ae(82, 186, 13, 6) + ae(118, 186, 13, 6)) + T('#22305A', ac(86, 72, 4.5) + ac(114, 72, 4.5)) + T('#F78FB3', ac(78, 92, 5) + ac(122, 92, 5))]] },
    { id: 'a6-an-frog', cat: 'animals', level: 1, title: 'A happy frog', ico: '🐸',
      need: 'Paper, a pencil and green crayons', tip: 'Frog eyes sit on top of the head, so they can peek out of the water.', steps: [
      ['Draw two circles side by side for the eyes.', ac(72, 72, 18) + ac(128, 72, 18)],
      ['Draw a wide round face under the eyes. Join it to both eyes.', ap('M56.4 81 C20 95 30 150 100 150 C170 150 180 95 143.6 81') + ap('M84.7 84.7 Q100 80 115.3 84.7')],
      ['Draw big dark dots in the eyes.', ac(72, 74, 8) + ac(128, 74, 8)],
      ['Add a big wide smile and two little nose dots.', ap('M60 118 Q100 145 140 118') + ac(94, 100, 2) + ac(106, 100, 2)],
      ['Draw a round body under the face, and a back leg on each side.', ap(frogBody) + ae(48, 182, 20, 9) + ae(152, 182, 20, 9)],
      ['Add pink cheeks and a buzzing fly. Yum!', ac(46, 112, 6) + ac(154, 112, 6) + ac(170, 30, 3) + ae(165, 24, 4, 3) + ae(175, 24, 4, 3) + fold(ap('M164 33 Q150 45 136 34'))],
      ['Color your frog green. Make the cheeks pink!', T('#7ACB8E', ap(frogHead) + ap(frogBody + ' Q100 154 72.5 146.6 Z') + ae(48, 182, 20, 9) + ae(152, 182, 20, 9) + ac(72, 72, 18) + ac(128, 72, 18)) + T('#22305A', ac(72, 74, 8) + ac(128, 74, 8)) + T('#F78FB3', ac(46, 112, 6) + ac(154, 112, 6))]] },
    { id: 'a6-an-horse', cat: 'animals', level: 3, title: 'A horse', ico: '🐴',
      need: 'Paper, a pencil, an eraser and crayons', tip: 'Horse legs are thin with knobby knees. Look at a photo of a horse!', steps: [
      ['Sketch light guide shapes: a long oval for the body, a small oval for the head, and a neck line.', guide(ae(115, 112, 48, 28) + ae(36, 68, 17, 16) + al(48, 60, 80, 95))],
      ['Draw the head and neck over the guides. Add a pointy ear on top.', ap(horseHead)],
      ['Draw the back. It dips a little, then goes round over the bottom.', ap(horseBack) + ap('M148 138 Q118 146 90 136')],
      ['Draw the two front-side legs, long and thin, with flat hooves.', ap('M162 120 L160 180 H150 L148 138') + ap('M90 136 L89 180 H77 L74 130 L72 118')],
      ['Draw the two legs on the far side, peeking out between the others.', ap(farLegs)],
      ['Add a wavy mane on the neck and a long flowing tail.', ap(mane) + ap(tail)],
      ['Erase the guides. Add an eye, a nostril and hoof lines.', ac(38, 60, 2.5) + ac(24, 76, 1.5) + ap('M21 82 q5 2 10 0') + al(77, 174, 89, 174) + al(150, 174, 160, 174), { clear: true }],
      ['Color your horse brown, with a dark mane and tail. Give it a name!', T('#D9A066', ap(horseAll)) + T('#B57E48', ap(farLegs + ' Z')) + T('#5A3A22', ap(mane + ' Q70 50 52 44 Z') + ap(tail + ' Z'))]] }
  );

  /* ================= Faces & people ================= */
  const fam = [ar(30, 80, 36, 95, 18), ar(76, 90, 34, 85, 17), ar(122, 125, 28, 50, 14), ar(160, 152, 22, 23, 11)];
  const famHeads = [[48, 62, 16], [93, 73, 15], [136, 110, 13], [171, 141, 9.5]];
  const face = (cx, cy, r) => ac(f1(cx - r * 0.33), f1(cy - r * 0.15), r > 12 ? 2 : 1.5) + ac(f1(cx + r * 0.33), f1(cy - r * 0.15), r > 12 ? 2 : 1.5) + ap(`M${f1(cx - r * 0.38)} ${f1(cy + r * 0.3)} q${f1(r * 0.38)} ${f1(r * 0.3)} ${f1(r * 0.76)} 0`);
  const hairA = bumpsD(48, 62, 16, 180, 360, 5), hairB = pts(spikePts(93, 73, 15, 7, 190, 350, 4)), hairC = bumpsD(136, 110, 13, 190, 350, 4);
  // Four faces, four hair styles.
  const hf = [[55, 62], [145, 62], [55, 152], [145, 152]];
  const curly = bumpsD(55, 62, 24, 180, 360, 7);
  const spiky = spikePts(55, 152, 24, 12, 180, 360, 6);
  const longHair = 'M118 180 V152 A27 27 0 0 1 172 152 V180';
  // People moving: bean figures in their own little turned boxes.
  const fig = (x, y, r, s) => `<g transform="translate(${x} ${y}) rotate(${r})">${s}</g>`;
  const bean = ar(-10, -22, 20, 44, 10), bhead = ac(0, -36, 11);
  const bface = ac(-4, -38, 1.6) + ac(4, -38, 1.6) + ap('M-4 -32 q4 3 8 0');
  const FA = [38, 76, 0], FB = [98, 100, 12], FC = [158, 104, -10];
  LESSONS.push(
    { id: 'a6-pp-family', cat: 'people', level: 1, title: 'A family portrait', ico: '👨‍👩‍👧',
      need: 'Paper, a pencil and crayons', tip: 'Grown-ups are tall and kids are short. Big and small makes it look real!', steps: [
      ['Draw a tall bean shape for a grown-up.', fam[0]],
      ['Give it a round head on top.', ac(48, 62, 16)],
      ['Draw another grown-up with a head, a little shorter.', fam[1] + ac(93, 73, 15)],
      ['Now a short bean and head for a kid. That is you!', fam[2] + ac(136, 110, 13)],
      ['Add a tiny bean for the baby, or for your pet.', fam[3] + ac(171, 141, 9.5)],
      ['Give everyone eyes, a smile and some hair.', famHeads.map(h => face(...h)).join('') + ap(hairA) + apl(hairB) + ap(hairC) + ap('M171 131.5 q-5 -6 2 -9')],
      ['Join them with arms holding hands, and draw the ground.', al(66, 112, 76, 118) + al(110, 125, 122, 145) + al(150, 152, 160, 163) + al(30, 108, 16, 88) + al(182, 163, 190, 172) + al(10, 177, 190, 177)],
      ['Color everyone\'s clothes and hair. Who is in your family?', T('#F2604F', fam[0]) + T('#2E8BE6', fam[1]) + T('#FFD966', fam[2]) + T('#6CC08B', fam[3]) + T('#F6D5B8', famHeads.map(h => ac(...h)).join('')) + T('#8B5E3C', ap(hairA + ' A16 16 0 0 0 32 62 Z') + ap(hairC + ' A13 13 0 0 0 ' + P(...pol(136, 110, 13, 190)) + ' Z')) + T('#22305A', ap('M' + spikePts(93, 73, 15, 7, 190, 350, 4).map(p => P(...p)).join(' L') + ' A15 15 0 0 0 ' + P(...pol(93, 73, 15, 190)) + ' Z'))]] },
    { id: 'a6-pp-hair', cat: 'people', level: 1, title: 'Me with different hair', ico: '💇',
      need: 'Paper, a pencil, crayons and a mirror', tip: 'Look in a mirror. Is your hair curly, straight, long or short?', steps: [
      ['Draw 4 circle faces. Give each one eyes and a smile.', hf.map(([x, y]) => ac(x, y, 24) + ac(x - 8, y - 3, 2.5) + ac(x + 8, y - 3, 2.5) + ap(`M${x - 9} ${y + 8} q9 8 18 0`)).join('')],
      ['Curly hair: draw little bumps all around the top of the first face.', ap(curly)],
      ['Pigtails: draw hair on top, and a bunch tied on each side.', ap('M118 62 A27 27 0 0 1 172 62') + ae(112, 72, 7, 12) + ae(178, 72, 7, 12)],
      ['Spiky hair: draw zig-zags on top, like a crown.', apl(pts(spiky))],
      ['Long hair: draw it falling down past the chin.', ap(longHair)],
      ['Which one looks like you? Color them in, then draw your own hair!', T('#F6D5B8', hf.map(([x, y]) => ac(x, y, 24)).join('')) + T('#8B5E3C', ap(curly + ' A24 24 0 0 0 31 62 Z')) + T('#FFC23D', ap('M118 62 A27 27 0 0 1 172 62 L169 62 A24 24 0 0 0 121 62 Z') + ae(112, 72, 7, 12) + ae(178, 72, 7, 12)) + T('#FF8A2B', ap('M' + spiky.map(p => P(...p)).join(' L') + ' A24 24 0 0 0 31 152 Z')) + T('#4A4A5A', ap(longHair + ' Z ' + ell(145, 152, 24)), true)]] },
    { id: 'a6-pp-moving', cat: 'people', level: 2, title: 'People on the move', ico: '💃',
      need: 'Paper, a pencil and crayons', tip: 'Bend the arms and legs. Straight sticks stand still, bent ones move!', steps: [
      ['Draw 3 bean shapes. Tip one forward and one a little back.', fig(...FA, bean) + fig(...FB, bean) + fig(...FC, bean)],
      ['Put a round head on top of each bean.', fig(...FA, bhead) + fig(...FB, bhead) + fig(...FC, bhead)],
      ['The jumper: both arms up high and both knees bent. Boing!', fig(...FA, ap('M-10 -12 L-22 -26 L-26 -40') + ap('M10 -12 L22 -26 L26 -40') + ap('M-5 20.7 L-14 32 L-6 42') + ap('M5 20.7 L14 32 L6 42'))],
      ['The runner: one arm forward and one back. One leg forward and one back.', fig(...FB, ap('M10 -12 L18 2 L28 4') + ap('M-10 -12 L-20 2 L-30 0') + ap('M5 20.7 L18 30 L16 44') + ap('M-5 20.7 L-12 34 L-26 36'))],
      ['The dancer: arms out wide and one leg kicked up high.', fig(...FC, ap('M-10 -12 L-22 -18 L-32 -12') + ap('M10 -12 L22 -22 L28 -34') + ap('M-4 21.5 L-6 46 L-14 47') + ap('M5 20.7 L20 28 L30 20'))],
      ['Give them faces. Add motion lines, the ground, and a music note.', fig(...FA, bface) + fig(...FB, bface) + fig(...FC, bface) + ap('M26 132 q12 6 24 0') + al(52, 92, 64, 92) + al(50, 104, 62, 104) + al(10, 152, 190, 152) + ap('M178 50 V36 l8 -3 v12') + ac(175, 50, 3) + ac(183, 45, 3)],
      ['Color their clothes. Can you draw someone swimming or skating?', fig(...FA, T('#F2604F', bean)) + fig(...FB, T('#2E8BE6', bean)) + fig(...FC, T('#F78FB3', bean)) + fig(...FA, T('#F6D5B8', bhead)) + fig(...FB, T('#F6D5B8', bhead)) + fig(...FC, T('#F6D5B8', bhead))]] }
  );

  /* ================= Nature ================= */
  const bandR = [80, 72, 64, 56, 48, 40, 32], rbCol = ['#F2604F', '#FF8A2B', '#FFD966', '#6CC08B', '#2E8BE6', '#8E7CC3'];
  const arcD = r => `M${100 - r} 150 A${r} ${r} 0 0 1 ${100 + r} 150`;
  const band = (ro, ri) => `M${100 - ro} 150 A${ro} ${ro} 0 0 1 ${100 + ro} 150 L${100 + ri} 150 A${ri} ${ri} 0 0 0 ${100 - ri} 150 Z`;
  const rbClouds = cloudD(44, 150) + ' ' + cloudD(156, 150);
  const cactusFill = 'M85 160 V60 A15 15 0 0 1 115 60 V160 Z M85 125 H70 A12 12 0 0 1 58 113 V85 A10 10 0 0 1 78 85 V105 H85 Z M115 110 H130 A12 12 0 0 0 142 98 V75 A10 10 0 0 0 122 75 V90 H115 Z';
  const spikes = [[93, 70], [107, 85], [93, 100], [107, 115], [93, 132], [107, 147], [68, 96], [132, 86]].map(([x, y]) => `M${x} ${y} l-3 -4 M${x} ${y} l3 -4`).join(' ');
  const wfWater = 'M68 48 Q100 56 132 50 L130 146 L70 146 Z';
  LESSONS.push(
    { id: 'a6-na-rainbow', cat: 'nature', level: 1, title: 'A rainbow and clouds', ico: '🌈',
      need: 'Paper, a pencil and rainbow crayons', tip: 'Rainbows come out when the sun shines while it rains.', steps: [
      ['Draw a big bump, like a hill, across the page.', ap(arcD(80))],
      ['Draw more bumps inside it, each one a little smaller. Count 6 stripes!', bandR.slice(1).map(r => ap(arcD(r))).join('')],
      ['Color the stripes: red on the outside, then orange, yellow, green, blue and purple.', rbCol.map((c, i) => T(c, ap(band(bandR[i], bandR[i + 1])))).join('')],
      ['Draw a fluffy white cloud at each end of the rainbow.', paint('#fff', ap(rbClouds)) + ap(cloudD(44, 150)) + ap(cloudD(156, 150))],
      ['Draw a sun shining in the corner.', sun(170, 30, 12)],
      ['Add raindrops and birds. Say the rainbow colors out loud, from the top!', ap('M30 170 l-2 6 M44 176 l-2 6 M58 170 l-2 6 M142 170 l-2 6 M156 176 l-2 6 M170 170 l-2 6') + ap('M20 40 q6 -6 12 0 q6 -6 12 0 M50 25 q4 -4 8 0 q4 -4 8 0') + T('#FFD966', ac(170, 30, 12))]] },
    { id: 'a6-na-cactus', cat: 'nature', level: 1, title: 'A desert cactus', ico: '🌵',
      need: 'Paper, a pencil and crayons', tip: 'Cactus spikes are sharp, so only draw them! Do not touch a real one.', steps: [
      ['Draw a tall shape with a round top. Make two small parts dotted: arms go there!', ap('M85 160 V125') + guide(al(85, 125, 85, 105)) + ap('M85 105 V60 A15 15 0 0 1 115 60 V90') + guide(al(115, 90, 115, 110)) + ap('M115 110 V160')],
      ['Draw an arm on the left that bends up, starting at the dotted part.', ap('M85 125 H70 A12 12 0 0 1 58 113 V85 A10 10 0 0 1 78 85 V105 H85')],
      ['Draw a shorter arm on the right side, bending up too.', ap('M115 110 H130 A12 12 0 0 0 142 98 V75 A10 10 0 0 0 122 75 V90 H115')],
      ['Erase the dotted bits. Put the cactus in a flower pot.', ar(68, 160, 64, 10, 3) + apg('73,170 127,170 120,194 80,194'), { clear: true }],
      ['Draw a line down the middle and tiny spikes in pairs.', al(100, 50, 100, 156) + ap(spikes)],
      ['Put a flower on top and a hot sun in the sky.', around(5, 9, 100, 32, (x, y) => ac(x, y, 4)) + ac(100, 32, 5) + sun(165, 35, 12)],
      ['Color it green, the flower pink and the pot orange.', T('#7ACB8E', ap(cactusFill)) + T('#F78FB3', around(5, 9, 100, 32, (x, y) => ac(x, y, 4))) + T('#FFC23D', ac(100, 32, 5) + ac(165, 35, 12)) + T('#E8935A', ar(68, 160, 64, 10) + apg('73,170 127,170 120,194 80,194'))]] },
    { id: 'a6-na-waterfall', cat: 'nature', level: 2, title: 'A waterfall', ico: '💦',
      need: 'Paper, a pencil and crayons or paint', tip: 'Long lines going down make water look like it is falling fast.', steps: [
      ['Draw two rocky cliffs, one on each side, with a gap in the middle.', apl('0,40 40,38 68,48 70,146') + apl('200,44 160,40 132,50 130,146')],
      ['Draw the river at the top, coming from far away to the edge.', ap('M80 18 Q72 34 68 48') + ap('M118 18 Q128 34 132 50') + ap('M68 48 Q100 56 132 50') + ap('M0 28 Q25 8 50 20 Q65 10 80 18') + ap('M118 18 Q140 6 165 18 Q185 8 200 22')],
      ['Draw long wavy lines falling straight down from the edge.', [80, 92, 104, 116].map(x => ap(`M${x} 54 Q${x - 3} 98 ${x + 2} 141`)).join('')],
      ['Draw a round pool at the bottom, with splashy bumps on top.', ae(100, 165, 70, 18) + ap('M72 148 q7 -10 14 0 q7 -10 14 0 q7 -10 14 0 q7 -10 14 0')],
      ['Add trees on the cliffs and rocks by the pool.', al(22, 38.9, 22, 28) + ac(22, 18, 10) + apg('168,40.8 175,20 182,42.2') + ap('M6 192 a12 10 0 0 1 24 0 Z') + ap('M172 194 a12 10 0 0 1 24 0 Z')],
      ['Draw little mist bubbles where the water splashes.', ac(60, 136, 4) + ac(52, 124, 3) + ac(140, 134, 5) + ac(148, 122, 3)],
      ['Paint the water blue, the rocks brown and the grass green. Splash!', T('#9CCBF5', ap(wfWater) + ae(100, 165, 70, 18) + ap('M80 18 Q72 34 68 48 Q100 56 132 50 Q128 34 118 18 Z')) + T('#C9AE90', ap('M0 40 L40 38 L68 48 L70 152 L0 152 Z') + ap('M200 44 L160 40 L132 50 L130 152 L200 152 Z') + ap('M6 192 a12 10 0 0 1 24 0 Z') + ap('M172 194 a12 10 0 0 1 24 0 Z')) + T('#9ED6A6', ap('M0 28 Q25 8 50 20 Q65 10 80 18 Q72 34 68 48 L40 38 L0 40 Z') + ap('M200 22 Q185 8 165 18 Q140 6 118 18 Q128 34 132 50 L160 40 L200 44 Z') + ap('M0 152 H200 V200 H0 Z ' + ell(100, 165, 70, 18), true) + ac(22, 18, 10) + apg('168,40.8 175,20 182,42.2'))]] }
  );

  /* ================= Cartoons ================= */
  const ghostFill = 'M50 160 V90 A50 50 0 0 1 150 90 V160 q-12.5 -15 -25 0 q-12.5 15 -25 0 q-12.5 -15 -25 0 q-12.5 15 -25 0 Z';
  const ghostArms = 'M50 108 Q28 104 26 84 Q38 94 50 94 M150 108 Q172 104 174 84 Q162 94 150 94';
  const blob1 = 'M18 170 C8 120 22 60 44 60 C66 60 78 120 70 170 Z', blob2 = 'M82 170 C76 135 88 105 108 105 C128 105 140 135 134 170 Z', blob3 = 'M144 170 C140 150 146 130 168 130 C190 130 196 150 192 170 Z';
  const capeL = 'M84 88 Q50 112 44 172 Q58 164 66 174 Q70 156 81.7 138', capeR = 'M116 88 Q150 112 156 172 Q142 164 134 174 Q130 156 118.3 138';
  const heroMask = 'M81 54 Q100 48 119 54 L117.5 64 Q100 58 82.5 64 Z';
  LESSONS.push(
    { id: 'a6-ca-ghost', cat: 'cartoon', level: 1, title: 'A friendly ghost', ico: '👻',
      need: 'Paper, a pencil and crayons', tip: 'Big round eyes make a ghost look cute, not scary.', steps: [
      ['Draw a tall bump, like an upside-down U.', ap('M50 160 V90 A50 50 0 0 1 150 90 V160')],
      ['Make a wavy bottom, like a skirt blowing in the wind.', ap('M50 160 q12.5 15 25 0 q12.5 -15 25 0 q12.5 15 25 0 q12.5 -15 25 0')],
      ['Draw two big oval eyes.', ae(82, 92, 8, 12) + ae(118, 92, 8, 12)],
      ['Add a little round mouth. Boo!', ae(100, 124, 7, 9)],
      ['Draw a waving arm on each side.', ap(ghostArms)],
      ['Add pink cheeks and swooshes underneath. It floats!', ac(66, 112, 5) + ac(134, 112, 5) + ap('M60 186 q10 6 20 0 M95 190 q10 6 20 0 M130 186 q10 6 20 0')],
      ['Color the eyes dark and the cheeks pink. Make the ghost white or light blue!', T('#DCEBFB', ap(ghostFill) + ap('M50 108 Q28 104 26 84 Q38 94 50 94 Z M150 108 Q172 104 174 84 Q162 94 150 94 Z')) + T('#22305A', ae(82, 92, 8, 12) + ae(118, 92, 8, 12) + ae(100, 124, 7, 9)) + T('#F78FB3', ac(66, 112, 5) + ac(134, 112, 5)) + paint('#fff', ac(85, 87, 2.5) + ac(121, 87, 2.5))]] },
    { id: 'a6-ca-blobs', cat: 'cartoon', level: 1, title: 'Blob buddies', ico: '🫠',
      need: 'Paper, a pencil and crayons', tip: 'Any wobbly shape can be a character. Just add a face!', steps: [
      ['Draw a tall blob, like a jelly bean standing up.', ap(blob1)],
      ['Draw a round blob next to it.', ap(blob2)],
      ['Draw a short, wide blob at the end.', ap(blob3)],
      ['The tall blob is happy: dot eyes and a big smile.', ac(36, 95, 3) + ac(54, 95, 3) + ap('M32 110 q12 12 24 0')],
      ['The round blob is silly: one eye winks and its tongue sticks out!', ac(100, 130, 3.5) + ap('M112 131 q5 -5 10 0') + ap('M98 145 q10 8 20 0') + ap('M104 148.4 q4.5 10 9 -0.4')],
      ['The wide blob is sleepy: closed eyes, a little yawn, and "z z".', ap('M156 148 q4 4 8 0 M172 148 q4 4 8 0') + ae(168, 160, 3, 4) + atext(186, 122, 'z', 14, 'class="tx"') + atext(176, 110, 'z', 11, 'class="tx"')],
      ['Give each blob its own color and a funny name!', T('#F78FB3', ap(blob1)) + T('#FFD966', ap(blob2)) + T('#9CCBF5', ap(blob3)) + T('#F2604F', ap('M104 148.4 q4.5 10 9 -0.4 Z')) + T('#9FAABD', ae(44, 176, 24, 4) + ae(108, 176, 26, 4) + ae(168, 176, 24, 4))]] },
    { id: 'a6-ca-hero', cat: 'cartoon', level: 2, title: 'A superhero', ico: '🦸',
      need: 'Paper, a pencil and crayons', tip: 'A big chest symbol and a cape make anyone look super!', steps: [
      ['Draw a bean shape for the body and a circle head on top.', ar(80, 80, 40, 70, 20) + ac(100, 58, 20)],
      ['Draw a cape flowing out from behind both shoulders.', ap(capeL) + ap(capeR)],
      ['Put one fist up high and the other hand on the hip. Super pose!', ap('M118 92 L140 70 L148 50') + ac(150, 44, 6) + ap('M80 102 L68 113 L80 126')],
      ['Draw two legs and big boots.', al(92, 148.3, 90, 177) + al(108, 148.3, 110, 177) + ae(86, 182, 9, 5) + ae(114, 182, 9, 5)],
      ['Draw a mask over the eyes and a brave smile.', ap(heroMask) + ae(91, 57, 3, 2) + ae(109, 57, 3, 2) + ap('M92 68 q8 6 16 0')],
      ['Put a star on the chest. Add a hair swoosh and speed lines.', apg(starPts(100, 112, 12, 5)) + ap('M92 40.4 Q94 28 106 30') + al(20, 60, 40, 60) + al(14, 75, 34, 75) + al(160, 120, 186, 120)],
      ['Color your hero. What is their super power?', T('#F2604F', ap(capeL + ' Z') + ap(capeR + ' Z')) + T('#2E8BE6', ar(80, 80, 40, 70, 20) + ae(86, 182, 9, 5) + ae(114, 182, 9, 5)) + T('#FFD966', apg(starPts(100, 112, 12, 5))) + T('#F6D5B8', ac(100, 58, 20) + ac(150, 44, 6)) + T('#22305A', ap(heroMask))]] }
  );

  /* ================= 3D & perspective ================= */
  // Peek-a-boo: a box in front, a ball behind it, a teddy behind both. Only the parts you can see.
  const bearVis = 'M58.4 120 A30 30 0 1 1 105 95.45 A35 35 0 0 0 95.07 117.3 A30 30 0 0 1 91.6 120 Z';
  const earL = 'M48.01 81.84 A11 11 0 1 1 63.05 67.46', earR = 'M86.95 67.46 A11 11 0 1 1 101.99 81.84';
  const pyrL = (f) => al(f1(30 + 70 * f), f1(160 - 120 * f), 100, f1(185 - 145 * f)), pyrR = (f) => al(f1(170 - 70 * f), f1(160 - 120 * f), 100, f1(185 - 145 * f));
  LESSONS.push(
    { id: 'a6-pe-nearfar', cat: 'perspective', level: 1, title: 'Near and far trees', ico: '🌲',
      need: 'Paper, a pencil and crayons', tip: 'Close things are big and low. Far things are small and high up.', steps: [
      ['Draw a line across the page. That is where the land meets the sky.', al(0, 90, 200, 90)],
      ['Draw a BIG tree at the bottom. It is close to you!', apg('18,172 48,100 78,172') + ar(43, 172, 10, 20)],
      ['Draw a middle-sized tree higher up. It is farther away.', apg('140,145 158,105 176,145') + ar(155, 145, 6, 10)],
      ['Draw two tiny trees right near the line. They are very far away!', apg('26,101 33,92 40,101') + ar(31.5, 101, 3, 4) + apg('176,101 183,92 190,101') + ar(181.5, 101, 3, 4)],
      ['Draw a path that gets thinner and thinner as it goes far away.', al(85, 200, 98, 90) + al(125, 200, 102, 90)],
      ['Add a sun and a cloud in the sky.', sun(160, 40, 12) + ap(cloudD(60, 45, 0.7))],
      ['Color it in. Big things look close, small things look far!', T('#D6EAFC', ar(0, 0, 200, 90)) + T('#C5E8B7', ar(0, 90, 200, 110)) + T('#E8C27A', apg('85,200 98,90 102,90 125,200')) + T('#3E9A62', apg('18,172 48,100 78,172') + apg('140,145 158,105 176,145') + apg('26,101 33,92 40,101') + apg('176,101 183,92 190,101')) + T('#FFD966', ac(160, 40, 12)) + T('#fff', ap(cloudD(60, 45, 0.7)))]] },
    { id: 'a6-pe-overlap', cat: 'perspective', level: 1, title: 'In front and behind', ico: '🧸',
      need: 'Paper, a pencil and crayons', tip: 'Draw the front thing first. Then only draw the bits of the back things you can see.', steps: [
      ['Draw a present box near the bottom. It is in front of everything.', ar(40, 120, 80, 60)],
      ['A ball is hiding behind the box. Only draw the part that peeks out!', ap('M95 120 A35 35 0 1 1 120 153.5')],
      ['A teddy is behind the box AND the ball. Draw only the part of its head you can see.', ap('M58.4 120 A30 30 0 1 1 105 95.45') + ap('M95.07 117.3 A30 30 0 0 1 91.6 120')],
      ['Add round ears that peek out from behind the head.', ap(earL) + ap(earR)],
      ['Give the teddy a face.', ac(65, 82, 3) + ac(85, 82, 3) + ae(75, 92, 5, 4) + ap('M75 96 q-5 5 -10 1 M75 96 q5 5 10 1')],
      ['Add a ribbon and a bow on the box, and stripes on the ball.', al(80, 120, 80, 180) + al(40, 150, 120, 150) + ap('M80 120 q-14 -14 -18 -2 q4 6 18 2 M80 120 q14 -14 18 -2 q-4 6 -18 2') + ap('M126 85.2 Q140 110 120 135') + ap('M150 91.3 Q160 120 145 151.6')],
      ['Color them in. Things in front cover up the things behind!', T('#C99A6E', ap(bearVis) + ap(earL + ' A30 30 0 0 0 48.01 81.84 Z') + ap(earR + ' A30 30 0 0 0 86.95 67.46 Z')) + T('#9CCBF5', ap('M95 120 A35 35 0 1 1 120 153.5 V120 Z')) + T('#F2604F', ar(40, 120, 80, 60)) + T('#FFD966', ar(76, 120, 8, 60) + ar(40, 146, 80, 8))]] },
    { id: 'a6-pe-pyramid', cat: 'perspective', level: 2, title: 'A 3D pyramid', ico: '🔺',
      need: 'Paper, a pencil, a ruler and crayons', tip: 'A 3D shape shows 2 sides at once. Shade one side to make it pop!', steps: [
      ['Draw a light guide diamond. It is a square lying flat on the sand.', guide(apg('30,160 100,140 170,160 100,185'))],
      ['Put a dot high above the middle. That is the tip.', ac(100, 40, 2.5)],
      ['Draw lines from the 3 front corners up to the tip.', al(30, 160, 100, 40) + al(100, 185, 100, 40) + al(170, 160, 100, 40)],
      ['Go over the two front edges at the bottom, nice and dark.', al(30, 160, 100, 185) + al(100, 185, 170, 160)],
      ['Erase the guide. The back corner is hidden! Add rows of stones.', [0.25, 0.5, 0.75].map(f => pyrL(f) + pyrR(f)).join(''), { clear: true }],
      ['Draw a sun in the top corner and sandy hills at the bottom.', sun(35, 40, 12) + ap('M0 172 Q15 165 30 160') + ap('M170 160 Q185 165 200 172')],
      ['Color it sandy yellow. Make the side away from the sun darker!', T('#F6D58E', apg('100,40 30,160 100,185 170,160')) + T('#C9A060', apg('100,40 100,185 170,160')) + T('#FFD966', ac(35, 40, 12)) + T('#FBE7B5', ap('M0 172 Q15 165 30 160 L100 185 L170 160 Q185 165 200 172 V200 H0 Z'))]] }
  );

  /* ================= Light & shading ================= */
  const tb = [[15, 15], [105, 15], [15, 105], [105, 105]];
  const fur = (() => { let d = ''; for (let y = 27; y <= 87; y += 10) for (let x = 22; x <= 86; x += 9) d += `M${x + (y % 20 ? 4 : 0)} ${y + 4} l4 -9 `; return d; })();
  const bricks = al(15, 125, 95, 125) + al(15, 145, 95, 145) + al(15, 165, 95, 165) + [[45, 105, 125], [75, 105, 125], [30, 125, 145], [60, 125, 145], [45, 145, 165], [75, 145, 165], [30, 165, 185], [60, 165, 185]].map(([x, a, b]) => al(x, a, x, b)).join('');
  const bumps = (() => { let s = ''; for (let r = 0; r < 6; r++) for (let c = 0; c < (r % 2 ? 5 : 6); c++) s += ac(f1(113 + c * 13 + (r % 2 ? 6.5 : 0)), 114 + r * 12, 5); return s; })();
  // Shadow of a toy robot, lying long on the paper, away from a flashlight on the left.
  const S = (x, y) => { const h = 125 - y; return [85 + 0.9 * h, 128 + (x - 70) * 0.4]; };
  const shQuad = (x1, y1, x2, y2) => apg(pts([S(x1, y2), S(x2, y2), S(x2, y1), S(x1, y1)]));
  const robotShadow = shQuad(55, 111, 65, 125) + shQuad(75, 111, 85, 125) + shQuad(50, 71, 90, 111) + shQuad(55, 43, 85, 69) + al(...S(70, 43).map(f1), ...S(70, 33).map(f1)) + ac(...S(70, 30).map(f1), 2.5);
  const coneY = x => f1(160 + 14 * Math.sqrt(Math.max(0, 1 - ((x - 100) / 45) ** 2)));
  const coneBand = (x1, x2) => ap(`M100 30 L${x1} ${coneY(x1)} A45 14 0 0 0 ${x2} ${coneY(x2)} Z`);
  const coneOut = 'M100 30 L55 160 A45 14 0 0 0 145 160 Z';
  LESSONS.push(
    { id: 'a6-sd-texture', cat: 'shading', level: 1, title: 'Fur, wood, bricks and bumps', ico: '🪵',
      need: 'Paper, a pencil and crayons', tip: 'Texture is how something feels. Lines can show soft, rough or bumpy!', steps: [
      ['Draw 4 boxes. Each one gets a different texture.', tb.map(([x, y]) => ar(x, y, 80, 80)).join('')],
      ['Fur: lots of short little flicks, all leaning the same way.', ap(fur)],
      ['Wood: long wavy lines that go around a little knot.', ae(145, 55, 8, 5) + ae(145, 55, 15, 9) + ap('M108 25 Q145 20 182 25') + ap('M108 34 Q145 30 182 34') + ap('M108 43 Q130 42 135 40 Q145 33 155 40 Q160 42 182 43') + ap('M108 67 Q130 68 135 70 Q145 77 155 70 Q160 68 182 67') + ap('M108 77 Q145 82 182 77') + ap('M108 86 Q145 91 182 86')],
      ['Bricks: rows of long boxes, like a wall.', bricks],
      ['Bumps: little circles close together, like lizard skin.', bumps],
      ['Go on a texture hunt! Touch a tree, a rug or a wall. Then color your boxes.', T('#E8B46A', ar(15, 15, 80, 80)) + T('#C99A6E', ar(105, 15, 80, 80)) + T('#F7A39A', ar(15, 105, 80, 80)) + T('#9ED6A6', ar(105, 105, 80, 80))]] },
    { id: 'a6-sd-trace', cat: 'shading', level: 1, title: 'Trace a toy\'s shadow', ico: '🔦',
      need: 'A toy, a flashlight, a big paper, a pencil and a grown-up', tip: 'Move the light higher and the shadow gets shorter. Try it!', steps: [
      ['Stand a toy on a big paper. We used a little robot.', ar(55, 43, 30, 26, 3) + ar(50, 71, 40, 40, 3) + ar(55, 111, 10, 14) + ar(75, 111, 10, 14) + al(70, 43, 70, 33) + ac(70, 30, 3) + ac(64, 54, 3) + ac(76, 54, 3) + al(64, 62, 76, 62) + ar(62, 82, 16, 10, 2)],
      ['Make the room dark. A grown-up shines a flashlight on the toy from the side.', ar(4, 30, 28, 14, 3) + apg('32,30 42,25 42,49 32,44') + guide(al(46, 30, 54, 40) + al(46, 46, 52, 56))],
      ['Look at the paper. The toy makes a dark shape. That is its shadow!', T('#B5BFD0', robotShadow)],
      ['Trace around the edges of the shadow with your pencil. Go slowly!', robotShadow],
      ['Shadows point away from the light. Draw an arrow to show which way.', al(100, 165, 160, 165) + apl('152,160 160,165 152,170')],
      ['Color the shadow dark. Or give it eyes and turn it into a shadow monster!', T('#7C88A8', robotShadow.replace(/<line[^>]*>/, ''))]] },
    { id: 'a6-sd-cone', cat: 'shading', level: 2, title: 'Shading a party hat', ico: '🥳',
      need: 'Paper, a pencil and crayons', tip: 'Light side: press softly. Shadow side: press hard. Bright spot: no color.', steps: [
      ['Draw a sun in the top corner. The light comes from there.', sun(25, 28, 10)],
      ['Draw a tall cone: a triangle with a curved bottom.', ap(coneOut)],
      ['Draw two light guide lines. The bright stripe goes between them.', guide(al(100, 30, 68, coneY(68)) + al(100, 30, 82, coneY(82)))],
      ['Shade the far side with lines close together. Spread them out near the bright stripe.', [142, 138, 133, 127, 120, 111].map(x => al(100, 30, x, coneY(x))).join('')],
      ['Draw the shadow on the table, on the side away from the sun.', T('#9FAABD', ap(`M145 160 A45 14 0 0 1 118 ${coneY(118)} L186 183 Z`))],
      ['Erase the guides. Put a fluffy pompom on top.', ac(100, 22, 8), { clear: true }],
      ['Color the hat. Keep the bright stripe light and the shady side dark!', T('#E3E7EE', coneBand(55, 68)) + T('#D5DBE5', coneBand(82, 105)) + T('#AEB8CA', coneBand(105, 125)) + T('#7C88A8', coneBand(125, 145)) + T('#F78FB3', ap(coneOut)) + T('#FFD966', ac(100, 22, 8))]] }
  );

  /* ================= Color ================= */
  const pud = (cx, cy, c, seed) => paint(c, ap(blobD(cx, cy, 15, seed, 8, 0.18)));
  const plus = (x, y) => al(x - 7, y, x + 7, y) + al(x, y - 7, x, y + 7), eq = (x, y) => al(x - 7, y - 4, x + 7, y - 4) + al(x - 7, y + 4, x + 7, y + 4);
  const moodHouse = dx => ar(22 + dx, 110, 56, 50) + apg(`${16 + dx},110 ${50 + dx},80 ${84 + dx},110`) + ar(43 + dx, 135, 14, 25) + ar(28 + dx, 118, 12, 12);
  const jellyDome = 'M50 100 A50 45 0 0 1 150 100 q-8.33 8 -16.67 0 q-8.33 8 -16.67 0 q-8.33 8 -16.67 0 q-8.33 8 -16.67 0 q-8.33 8 -16.67 0 q-8.33 8 -16.67 0 Z';
  const tent = x => `M${x} 100 q-8 15 0 30 t0 30 t0 30`;
  const tx = [66.67, 83.33, 100, 116.67, 133.33];
  LESSONS.push(
    { id: 'a6-co-mix', cat: 'color', level: 1, title: 'Mixing paint puddles', ico: '🧪',
      need: 'Red, yellow and blue paint, a brush, a plate and water', tip: 'Wash your brush in water before you dip into a new color.', steps: [
      ['Put a blob of red paint and a blob of yellow paint on a plate.', pud(30, 40, '#F2604F', 11) + plus(62, 40) + pud(95, 40, '#FFC23D', 12)],
      ['Swirl them together with your brush. You made orange!', eq(128, 40) + pud(165, 40, '#FF8A2B', 13)],
      ['Now try yellow and blue. Swirl, swirl... green!', pud(30, 100, '#FFC23D', 14) + plus(62, 100) + pud(95, 100, '#2E8BE6', 15) + eq(128, 100) + pud(165, 100, '#2FA36B', 16)],
      ['Now blue and red. What do you get? Purple!', pud(30, 160, '#2E8BE6', 17) + plus(62, 160) + pud(95, 160, '#F2604F', 18) + eq(128, 160) + pud(165, 160, '#7B5BD6', 19)],
      ['Paint a picture with only your 3 new colors: orange, green and purple!', '']] },
    { id: 'a6-co-moods', cat: 'color', level: 1, title: 'Happy and gloomy colors', ico: '🌦️',
      need: 'Paper, a pencil and crayons', tip: 'Colors show feelings. Bright colors feel happy, grey ones feel quiet.', steps: [
      ['Draw a line down the middle of your paper.', al(100, 8, 100, 192)],
      ['Draw the same little house on each side.', moodHouse(0) + moodHouse(100)],
      ['Add a sun on the left side, and a rain cloud on the right side.', sun(30, 35, 11) + ap(cloudD(150, 40, 0.8)) + ap('M135 58 l-3 8 M150 60 l-3 8 M165 58 l-3 8')],
      ['Color the left side with bright happy colors: yellow, pink and orange.', T('#FFF3C4', ar(0, 0, 100, 160)) + T('#F78FB3', ar(22, 110, 56, 50)) + T('#FF8A2B', apg('16,110 50,80 84,110')) + T('#FFC23D', ac(30, 35, 11)) + T('#8ED69B', ar(0, 160, 100, 40))],
      ['Color the right side with dark gloomy colors: grey and dark blue.', T('#B9C0CC', ar(100, 0, 100, 160)) + T('#9CA3B0', ar(122, 110, 56, 50)) + T('#5A678C', apg('116,110 150,80 184,110')) + T('#7C8494', ap(cloudD(150, 40, 0.8))) + T('#8A9A8C', ar(100, 160, 100, 40))],
      ['Which side feels happy? Now paint a picture that shows how YOU feel today.', '']] },
    { id: 'a6-co-neighbours', cat: 'color', level: 2, title: 'Neighbor colors jellyfish', ico: '🪼',
      need: 'Paper, a pencil and blue, green and purple crayons', tip: 'Neighbor colors sit side by side on the color wheel. They look calm together.', steps: [
      ['Colors that sit next to each other on the color wheel are neighbors. Look: blue, teal and purple.', paint('#6D55D1', ac(22, 22, 9)) + paint('#2E8BE6', ac(44, 22, 9)) + paint('#1FA5A0', ac(66, 22, 9))],
      ['Draw a dome for the jellyfish, with a wavy bottom.', ap(jellyDome)],
      ['Draw long wiggly arms hanging down.', tx.map(x => ap(tent(x))).join('')],
      ['Add sleepy eyes, a smile, a stripe and some dots.', ap('M82 80 q5 5 10 0 M108 80 q5 5 10 0') + ap('M92 90 q8 6 16 0') + ap('M62 76 Q100 58 138 76') + ac(84, 63, 2.5) + ac(100, 60, 2.5) + ac(116, 63, 2.5)],
      ['Color the dome blue. Color the arms teal and purple. Neighbors look calm together!', T('#8EC3F2', ap(jellyDome)) + T('#B7A6EC', ap('M62 76 Q100 58 138 76 Q144 82 145 88 Q100 72 58 88 Q57 82 62 76 Z')) + stroke('#1FA5A0', ap(tent(66.67)) + ap(tent(100)) + ap(tent(133.33))) + stroke('#6D55D1', ap(tent(83.33)) + ap(tent(116.67)))],
      ['Add bubbles in neighbor colors too. Next, try yellow, orange and red!', stroke('#2E8BE6', ac(30, 120, 8) + ac(170, 60, 6)) + stroke('#6D55D1', ac(40, 150, 5) + ac(165, 140, 8)) + stroke('#1FA5A0', ac(20, 80, 4) + ac(178, 100, 4))]] }
  );

  /* ================= Patterns ================= */
  // Pattern snake: a wavy body that gets thinner to the tail.
  const sc = s => [35 + 140 * s, 105 - 30 * Math.sin(2 * Math.PI * s)];
  const sn = s => { const tx_ = 140, ty = -60 * Math.PI * Math.cos(2 * Math.PI * s), L = Math.hypot(tx_, ty); return [ty / L, -tx_ / L, tx_ / L, ty / L]; };
  const sw = s => 13 * (1 - 0.82 * s * s);
  const side = (s, k) => { const c = sc(s), n = sn(s), w = sw(s) * k; return [c[0] + n[0] * w, c[1] + n[1] * w]; };
  const range = (a, b, st = 0.02) => { const r = []; for (let s = a; s < b - 1e-9; s += st) r.push(s); r.push(b); return r; };
  const snakeD = (() => {
    const L = range(0, 1).map(s => side(s, 1)), R = range(0, 1).map(s => side(s, -1)).reverse(), n1 = sn(1), c1 = sc(1);
    return 'M' + L.map(p => P(...p)).join(' L') + ` L${P(c1[0] + n1[2] * 8, c1[1] + n1[3] * 8)} L` + R.map(p => P(...p)).join(' L') + ` A13 13 0 0 1 ${P(...side(0, 1))} Z`;
  })();
  const cuts = range(0.1, 0.94, 0.07);
  const secD = (a, b) => 'M' + range(a, b, 0.01).map(s => P(...side(s, 1))).join(' L') + ' L' + range(a, b, 0.01).reverse().map(s => P(...side(s, -1))).join(' L') + ' Z';
  const snakeEyes = (() => { const c = sc(0.02), n = sn(0.02); return ac(f1(c[0] + n[0] * 6), f1(c[1] + n[1] * 6), 2.5) + ac(f1(c[0] - n[0] * 6), f1(c[1] - n[1] * 6), 2.5); })();
  const tongue = (() => { const c = sc(0), n = sn(0), b = [c[0] - n[2] * 13, c[1] - n[3] * 13], f = [b[0] - n[2] * 9, b[1] - n[3] * 9]; return ap(`M${P(...b)} L${P(...f)} L${P(f[0] - n[2] * 4 + n[0] * 3, f[1] - n[3] * 4 + n[1] * 3)} M${P(...f)} L${P(f[0] - n[2] * 4 - n[0] * 3, f[1] - n[3] * 4 - n[1] * 3)}`); })();
  // Beads.
  const bq = t => [10 + 180 * t, 25 + 240 * t * (1 - t)];
  const beadT = [1, 2, 3, 4, 5, 6, 7].map(i => i / 8);
  const bead1 = beadT.map((t, i) => { const [x, y] = bq(t); return i % 2 ? ar(f1(x - 8), f1(y - 8), 16, 16, 2) : ac(f1(x), f1(y), 9); });
  const strSeg = (a, b, ra = 9, rb = 9) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy); return al(f1(a[0] + dx / L * ra), f1(a[1] + dy / L * ra), f1(b[0] - dx / L * rb), f1(b[1] - dy / L * rb)); };
  const bc = beadT.map(bq);
  const row2 = [0, 1, 2, 3, 4, 5, 6].map(i => [22 + i * 26, 155]);
  const shape3 = ([x, y], i) => i % 3 === 0 ? ac(x, y, 9) : i % 3 === 1 ? apg(`${x - 9},${y + 8} ${x},${y - 9} ${x + 9},${y + 8}`) : ar(x - 8, y - 8, 16, 16, 2);
  // Mirror mask.
  const maskL = 'M100 72 C82 54 44 44 22 50 C24 92 52 126 82 122 Q92 110 100 104';
  const maskR = 'M100 72 C118 54 156 44 178 50 C176 92 148 126 118 122 Q108 110 100 104';
  const maskAll = 'M100 72 C82 54 44 44 22 50 C24 92 52 126 82 122 Q92 110 100 104 Q108 110 118 122 C148 126 176 92 178 50 C156 44 118 54 100 72 Z';
  const feathers = ap('M100 72 Q84 46 74 22 Q94 40 100 72') + ap('M100 72 Q116 46 126 22 Q106 40 100 72') + ap('M100 72 Q94 46 100 14 Q106 46 100 72');
  LESSONS.push(
    { id: 'a6-pa-snake', cat: 'pattern', level: 1, title: 'A pattern snake', ico: '🐍',
      need: 'Paper, a pencil and 2 crayons', tip: 'A pattern repeats. Say it out loud: red, yellow, red, yellow...', steps: [
      ['Draw a long wiggly snake. Round head, pointy tail.', ap(snakeD)],
      ['Give it two eyes and a forked tongue. Hiss!', snakeEyes + tongue],
      ['Draw lines across the body to split it into lots of parts.', cuts.map(s => al(...side(s, 1).map(f1), ...side(s, -1).map(f1))).join('')],
      ['Color the parts: red, yellow, red, yellow... all the way to the tail. That is a pattern!', cuts.slice(0, -1).map((s, i) => T(i % 2 ? '#FFD966' : '#F2604F', ap(secD(s, cuts[i + 1])))).join('')],
      ['Put a dot in every yellow part. The pattern repeats again!', cuts.slice(0, -1).map((s, i) => i % 2 ? ac(...sc((s + cuts[i + 1]) / 2).map(f1), 2.5) : '').join('')],
      ['Color the head and tail green. Make another snake with your own pattern!', T('#7ACB8E', ap(secD(0, 0.1).replace(/ Z$/, '') + ' A13 13 0 0 1 ' + P(...side(0, 1)) + ' Z') + ap(secD(0.94, 1)))]] },
    { id: 'a6-pa-beads', cat: 'pattern', level: 1, title: 'A pattern bracelet', ico: '📿',
      need: 'Paper, a pencil and crayons. Real beads and string are fun too!', tip: 'Ask: what comes next? Patterns let you guess!', steps: [
      ['Draw beads in a big smile shape: circle, square, circle, square...', bead1.join('')],
      ['Join the beads with a string. Tie a bow at the top.', bc.slice(0, -1).map((p, i) => strSeg(p, bc[i + 1])).join('') + strSeg([10, 25], bc[0], 0) + strSeg(bc[6], [190, 25], 9, 0) + ap('M10 25 Q48 8 88 14') + ap('M190 25 Q152 8 112 14') + ap('M100 14 Q86 2 88 14 Q86 26 100 14 Z') + ap('M100 14 Q114 2 112 14 Q114 26 100 14 Z')],
      ['Color them: red circle, blue square, red, blue... An AB pattern!', bead1.map((b, i) => T(i % 2 ? '#2E8BE6' : '#F2604F', b)).join('')],
      ['Now draw a straight row: circle, triangle, square, then again!', row2.map(shape3).join('')],
      ['Join them with a string too.', row2.slice(0, -1).map((p, i) => strSeg(p, row2[i + 1])).join('') + al(4, 155, 13, 155) + al(187, 155, 196, 155)],
      ['Color them red, yellow, green, red, yellow, green. What comes next?', row2.map((p, i) => T(['#F2604F', '#FFD966', '#6CC08B'][i % 3], shape3(p, i))).join('')]] },
    { id: 'a6-pa-mask', cat: 'pattern', level: 2, title: 'A mirror mask', ico: '🎭',
      need: 'Paper, a pencil, an eraser and crayons', tip: 'Symmetry means both sides match, like your face in a mirror.', steps: [
      ['Draw a light guide line down the middle.', guide(al(100, 10, 100, 190))],
      ['Draw the left half of a mask: a big curvy wing shape.', ap(maskL)],
      ['Now draw the right half the same, like in a mirror.', ap(maskR)],
      ['Draw an eye hole on each side. Make them match!', ae(68, 84, 16, 11) + ae(132, 84, 16, 11)],
      ['Add swirls and dots. What you draw on the left, copy on the right.', ap('M34 62 q8 -8 16 -2 q4 6 -4 8') + ap('M166 62 q-8 -8 -16 -2 q-4 6 4 8') + ac(50, 104, 3) + ac(150, 104, 3) + ac(40, 88, 2.5) + ac(160, 88, 2.5) + ac(90, 112, 2) + ac(110, 112, 2)],
      ['Add three feathers on top, one in the middle and one on each side.', feathers],
      ['Erase the middle line. Color both sides the same. That is symmetry!', T('#B7A6EC', ap(maskAll + ' ' + ell(68, 84, 16, 11) + ' ' + ell(132, 84, 16, 11)), true) + T('#FFD966', ac(50, 104, 3) + ac(150, 104, 3) + ac(40, 88, 2.5) + ac(160, 88, 2.5) + ac(90, 112, 2) + ac(110, 112, 2)) + T('#F78FB3', ap('M100 72 Q84 46 74 22 Q94 40 100 72 Z') + ap('M100 72 Q116 46 126 22 Q106 40 100 72 Z')) + T('#6CC08B', ap('M100 72 Q94 46 100 14 Q106 46 100 72 Z')), { clear: true }]] }
  );

  /* ================= Lettering ================= */
  const by = x => { const u = (x - 10) / 180; return 40 + 80 * u * (1 - u); };
  const flags = [[20, 54], [63, 97], [106, 140], [149, 183]];
  const flagTip = ([a, b]) => [(a + b) / 2, by((a + b) / 2) + 44];
  const flagFill = ([a, b]) => { const p = []; for (let x = a; x <= b + 0.01; x += (b - a) / 8) p.push([x, by(x)]); p.push(flagTip([a, b])); return apg(pts(p)); };
  const flagCol = ['#F2604F', '#FFD966', '#6CC08B', '#9CCBF5'];
  const sD = 'M72.5 45 Q55 25 38 42 Q25 60 50 80 Q78 100 65 128 Q50 150 28 132';
  const Hpoly = apg('30,40 50,40 50,90 80,90 80,40 100,40 100,160 80,160 80,110 50,110 50,160 30,160');
  const Ipoly = apg('125,40 175,40 175,60 160,60 160,140 175,140 175,160 125,160 125,140 140,140 140,60 125,60');
  LESSONS.push(
    { id: 'a6-le-banner', cat: 'letters', level: 1, title: 'A name banner', ico: '🎏',
      need: 'Paper, a pencil, crayons. Scissors, string and tape for a real one.', tip: 'Make a real banner: one paper flag per letter, taped onto string.', steps: [
      ['Draw a long droopy string across the top, like a smile.', ap('M10 40 Q100 80 190 40')],
      ['Hang 4 triangle flags from the string. Two lines for each flag meet at a point.', flags.map(f => apl(pts([[f[0], by(f[0])], flagTip(f), [f[1], by(f[1])]]))).join('')],
      ['Write one letter in each flag. We wrote S, A, M and a star. Write YOUR name!', ['S', 'A', 'M'].map((t, i) => atext(f1((flags[i][0] + flags[i][1]) / 2), f1(by((flags[i][0] + flags[i][1]) / 2) + 22), t, 18, 'class="tx"')).join('') + apg(starPts(166, by(166) + 16, 8, 3.5))],
      ['Add little dots near the bottom of each flag.', flags.map(f => { const [x, y] = flagTip(f); return ac(f1(x), f1(y - 13), 2); }).join('')],
      ['Color each flag a different color. Hang your banner on your door!', flags.map((f, i) => T(flagCol[i], flagFill(f))).join('') + paint('#22305A', ac(10, 40, 3) + ac(190, 40, 3))]] },
    { id: 'a6-le-animals', cat: 'letters', level: 1, title: 'Letters into animals', ico: '🦉',
      need: 'Paper, a pencil and crayons', tip: 'Try your first letter. Can a B be a bee or an M be mountains?', steps: [
      ['Draw a big letter S on the left side, nice and thick.', fat(sD, 9)],
      ['Turn the S into a snake: draw a round head at the top, with an eye.', ac(80, 40, 9) + ac(83, 37, 1.8)],
      ['Give the snake a forked tongue and a pointy tail.', ap('M89 41 h7 l3 -3 M96 41 l3 3') + ap('M28 132 Q20 126 16 116')],
      ['Now draw a big letter O on the right, nice and thick.', fat(ell(145, 95, 36), 9)],
      ['Turn the O into an owl: two big eyes, a beak and pointy ears.', ac(132, 88, 9) + ac(158, 88, 9) + ac(132, 88, 3.5) + ac(158, 88, 3.5) + apg('140,98 150,98 145,108') + apg('118,72 112,46 132,62') + apg('172,72 178,46 158,62')],
      ['Add wings and little feet to the owl.', ap('M104 92 Q94 110 106 124') + ap('M186 92 Q196 110 184 124') + ap('M136 136 v8 l-4 4 M136 144 l4 4 M154 136 v8 l-4 4 M154 144 l4 4')],
      ['Color your letter animals. What can the first letter of YOUR name become?', stroke('#4FAF6E', fat(sD, 9)) + T('#7ACB8E', ac(80, 40, 9)) + stroke('#B97A50', fat(ell(145, 95, 36), 9)) + T('#F6D58E', ac(145, 95, 31) + apg('118,72 112,46 132,62') + apg('172,72 178,46 158,62')) + T('#FF9F43', apg('140,98 150,98 145,108'))]] },
    { id: 'a6-le-block', cat: 'letters', level: 2, title: 'Block letters', ico: '🔲',
      need: 'Paper, a pencil, a ruler, an eraser and markers', tip: 'Keep every part of a block letter the same thickness.', steps: [
      ['Write HI with thin guide lines. These are the skeleton letters.', guide(al(40, 50, 40, 150) + al(90, 50, 90, 150) + al(40, 100, 90, 100) + al(150, 50, 150, 150) + al(135, 50, 165, 50) + al(135, 150, 165, 150))],
      ['Draw a fat box outline all around the H skeleton.', Hpoly],
      ['Draw a fat outline around the I. Give it flat feet on the top and bottom.', Ipoly],
      ['Erase the skeleton. Fill the H with stripes.', [52, 64, 76, 124, 136, 148].map(y => al(30, y, 50, y) + al(80, y, 100, y)).join('') + al(30, 100, 100, 100), { clear: true }],
      ['Fill the I with dots.', [72, 86, 100, 114, 128].map(y => ac(150, y, 3.5)).join('') + ac(133, 50, 3) + ac(167, 50, 3) + ac(133, 150, 3) + ac(167, 150, 3)],
      ['Color each letter. Now try your name in block letters!', T('#FF8A2B', Hpoly) + T('#2E8BE6', Ipoly)]] }
  );

  /* ================= Paper crafts (each step is its own picture) ================= */
  // A paper-chain person, centre cx, scale s (the base person is 60 wide, centre 100, y 59-160).
  const pp = (cx, cy, s) => (x, y) => P(cx + (x - 100) * s, cy + (y - 110) * s);
  const personFull = (cx, cy, s) => { const q = pp(cx, cy, s), r = f1(13 * s); return `M${q(94, 84)} A${r} ${r} 0 1 1 ${q(106, 84)} L${q(112, 94)} L${q(130, 94)} L${q(130, 106)} L${q(114, 106)} L${q(116, 128)} L${q(122, 160)} L${q(106, 160)} L${q(100, 136)} L${q(94, 160)} L${q(78, 160)} L${q(84, 128)} L${q(86, 106)} L${q(70, 106)} L${q(70, 94)} L${q(88, 94)} Z`; };
  const personOpen = (cx, cy, s) => { const q = pp(cx, cy, s), r = f1(13 * s); return `M${q(130, 94)} L${q(112, 94)} L${q(106, 84)} A${r} ${r} 0 1 0 ${q(94, 84)} L${q(88, 94)} L${q(70, 94)} M${q(70, 106)} L${q(86, 106)} L${q(84, 128)} L${q(78, 160)} L${q(94, 160)} L${q(100, 136)} L${q(106, 160)} L${q(122, 160)} L${q(116, 128)} L${q(114, 106)} L${q(130, 106)}`; };
  const chainX = [32.5, 77.5, 122.5, 167.5];
  const chain = chainX.map(x => ap(personOpen(x, 100, 0.75))).join('') + fold([55, 100, 145].map(x => al(x, 88, x, 98)).join(''));
  const chainFaces = chainX.map(x => ac(x - 3, 70, 1.6) + ac(x + 3, 70, 1.6) + ap(`M${x - 3.5} 74 q3.5 3 7 0`)).join('');
  // Lantern.
  const slitX = [45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155];
  const lanternStrips = [-40, -28, -14, 0, 14, 28, 40].map(k => { const e = 8 * Math.sqrt(1 - (k / 40) ** 2); return ap(`M${100 + k} ${f1(50 + e)} Q${f1(100 + k * 1.45)} 105 ${100 + k} ${f1(160 - e)}`); }).join('');
  const lantern = ae(100, 50, 40, 8) + ae(100, 160, 40, 8) + lanternStrips;
  // Pop-up card (open, seen from the front).
  const cardOpen = ap('M30 100 V30 H170 V100') + ap('M30 100 L10 160 H190 L170 100');
  const cake = ar(72, 96, 56, 25.4, 3) + ar(80, 74, 40, 22, 3) + ar(88, 62, 4, 12) + ar(98, 62, 4, 12) + ar(108, 62, 4, 12) + ap('M90 60 q-3 -4 0 -7 q3 3 0 7 M100 60 q-3 -4 0 -7 q3 3 0 7 M110 60 q-3 -4 0 -7 q3 3 0 7') + ap('M72 104 q7 6 14 0 q7 6 14 0 q7 6 14 0 q7 6 14 0');
  LESSONS.push(
    { id: 'a6-cr-chain', cat: 'craft', level: 1, title: 'Paper chain people', ico: '👫', single: true,
      need: 'A long strip of paper, a pencil, safety scissors and a grown-up', tip: 'The hands must touch the folded sides, or your people will not hold hands!', steps: [
      ['Take a long strip of paper. Fold it back and forth, like a fan.', ar(10, 80, 180, 50) + fold(al(55, 80, 55, 130) + al(100, 80, 100, 130) + al(145, 80, 145, 130)) + apl('70,55 85,40 100,55 115,40 130,55')],
      ['Squash it flat. Now it is a small, thick rectangle.', ar(70, 50, 60, 115) + al(74, 46, 134, 46) + al(134, 46, 134, 161)],
      ['Draw a person on top. The hands must touch both sides of the paper!', ar(70, 50, 60, 115) + ap(personFull(100, 110, 1))],
      ['A grown-up helps you cut around the person. Do NOT cut where the hands touch the sides!', ap(personFull(100, 110, 1)) + fold(al(70, 88, 70, 112) + al(130, 88, 130, 112)) + scissors(160, 60)],
      ['Open it up. Your paper people are holding hands!', chain],
      ['Draw faces and clothes on each one. Make your whole family!', chain + chainFaces + chainX.map((x, i) => T(['#F2604F', '#FFD966', '#6CC08B', '#9CCBF5'][i], ap(personFull(x, 100, 0.75)))).join('')]] },
    { id: 'a6-cr-lantern', cat: 'craft', level: 1, title: 'A paper lantern', ico: '🏮', single: true,
      need: 'A sheet of paper, a pencil, safety scissors, tape and a grown-up', tip: 'Stop cutting before the edge, or the lantern falls apart.', steps: [
      ['Fold a paper in half the long way.', ar(30, 40, 140, 120, 2) + fold(al(30, 100, 170, 100)) + ap('M182 60 q14 40 0 80') + apl('176,134 182,140 188,133')],
      ['Draw lines up from the fold. Stop before the top edge.', ap('M30 130 V70 H170 V130') + fold(al(30, 130, 170, 130)) + slitX.map(x => al(x, 130, x, 82)).join('')],
      ['A grown-up helps you cut along each line. Stop at the end of the line!', ap('M30 130 V70 H170 V130') + fold(al(30, 130, 170, 130)) + slitX.map(x => al(x, 130, x, 82)).join('') + scissors(100, 40)],
      ['Open it up. Now it has lots of slits in the middle.', ar(30, 40, 140, 120, 2) + fold(al(30, 100, 170, 100)) + slitX.map(x => al(x, 52, x, 148)).join('')],
      ['Roll it into a tube and tape the edges. The middle pops out!', lantern],
      ['Tape a paper strip on top for a handle. Color it and hang it up!', lantern + ap('M64 46.5 Q100 -5 136 46.5') + T('#F2604F', ap('M60 50 Q42 105 60 160 L140 160 Q158 105 140 50 Z')) + T('#FFD966', ae(100, 50, 40, 8) + ae(100, 160, 40, 8))]] },
    { id: 'a6-cr-popup', cat: 'craft', level: 2, title: 'A pop-up birthday card', ico: '🎂', single: true,
      need: 'Card or thick paper, a pencil, safety scissors, glue and a grown-up', tip: 'Cut only 2 short slits. The step between them is what pops up!', steps: [
      ['Fold a paper in half to make a card.', ar(40, 30, 120, 140, 2) + fold(al(40, 100, 160, 100))],
      ['Keep it folded. Cut 2 short slits into the fold. A grown-up can help.', ap('M40 130 V60 H160 V130') + fold(al(40, 130, 160, 130)) + al(85, 130, 85, 105) + al(115, 130, 115, 105) + scissors(100, 35)],
      ['Fold the flap between the slits up. Press hard, then fold it back down.', ap('M40 130 V60 H160 V130') + fold(al(40, 130, 85, 130) + al(115, 130, 160, 130) + al(85, 105, 115, 105)) + al(85, 130, 85, 105) + al(115, 130, 115, 105) + ap('M85 105 V80 H115 V105')],
      ['Open the card. Push the flap through to the inside. It pops out like a step!', ap('M30 100 V30 H170 V100') + al(30, 100, 85, 100) + al(115, 100, 170, 100) + ap('M30 100 L10 160 H190 L170 100') + ar(85, 75, 30, 21.4) + ar(85, 96.4, 30, 25)],
      ['Draw a cake on another paper. Cut it out and glue it on the front of the step.', cardOpen + al(30, 100, 72, 100) + al(128, 100, 170, 100) + cake],
      ['Write a message and color everything. Give it to someone special!', cardOpen + al(30, 100, 72, 100) + al(128, 100, 170, 100) + cake + atext(100, 48, 'HOORAY!', 16, 'class="tx"') + T('#D6EAFC', ar(30, 30, 140, 70)) + T('#FFF3C4', apg('30,100 10,160 190,160 170,100')) + T('#F78FB3', ar(72, 96, 56, 25.4) + ar(80, 74, 40, 22)) + T('#FFD966', ap('M90 60 q-3 -4 0 -7 q3 3 0 7 Z M100 60 q-3 -4 0 -7 q3 3 0 7 Z M110 60 q-3 -4 0 -7 q3 3 0 7 Z'))]] }
  );

  /* ================= Painting ================= */
  const splats = [[60, 60, 16, 3, '#2E8BE6'], [140, 132, 12, 5, '#2E8BE6'], [70, 142, 8, 9, '#2E8BE6'], [132, 55, 14, 21, '#F2604F'], [42, 110, 9, 23, '#F2604F'], [108, 98, 7, 27, '#F2604F'], [102, 160, 10, 31, '#FFC23D'], [160, 90, 8, 33, '#FFC23D'], [90, 38, 6, 37, '#FFC23D']];
  const spl = c => splats.filter(s => s[4] === c).map(([x, y, r, k]) => paint(c, splat(x, y, r, k))).join('');
  const tapes = apg('20,95 180,95 180,105 20,105') + apg('95,20 105,20 105,180 95,180') + apg('20,27 20,20 27,20 180,173 180,180 173,180');
  const tapeRegions = [['#F2604F', '20,20 100,20 100,100'], ['#FF8A2B', '20,20 20,100 100,100'], ['#FFD966', '100,20 180,20 180,100 100,100'], ['#6CC08B', '20,100 100,100 100,180 20,180'], ['#2E8BE6', '100,100 180,100 180,180'], ['#8E7CC3', '100,100 100,180 180,180']];
  const swirl = 'M150 192 Q148 175 148 160 Q120 150 125 125 Q130 100 160 105 Q175 80 140 75 Q112 70 125 50';
  const mirror = s => `<g transform="matrix(-1 0 0 1 200 0)">${s}</g>`;
  const swirlA = 'M106 150 Q130 160 150 140 Q168 122 140 112 Q118 104 128 86 Q140 66 166 72', swirlB = 'M106 60 Q126 40 150 52 Q164 62 150 78';
  LESSONS.push(
    { id: 'a6-pt-splatter', cat: 'paint', level: 1, title: 'Splatter painting', ico: '💥',
      need: 'Paper, runny paint, a brush, an old shirt, newspaper and a grown-up', tip: 'Splatter outside or on lots of newspaper. It gets messy, and that is OK!', steps: [
      ['Go outside, or cover the table with newspaper. Wear an old shirt! Put your paper down.', ar(15, 15, 170, 170, 4)],
      ['Dip a brush in runny blue paint. Hold it over the paper and tap it on your finger. Splat!', spl('#2E8BE6')],
      ['Now do it with red. Tap, tap, tap!', spl('#F2604F')],
      ['And yellow! Big taps make big splats. Little taps make little dots.', spl('#FFC23D')],
      ['Let it dry. Can you see a shape in a splat? Give it eyes and a smile!', paint('#fff', ac(54, 56, 4) + ac(66, 56, 4)) + ac(54, 56, 4) + ac(66, 56, 4) + paint('#22305A', ac(54, 57, 1.8) + ac(66, 57, 1.8)) + stroke('#fff', ap('M54 66 q6 5 12 0'))]] },
    { id: 'a6-pt-tape', cat: 'paint', level: 1, title: 'Tape-resist painting', ico: '🟦',
      need: 'Paper, painter\'s tape, paint and a brush. A grown-up helps peel.', tip: 'Wait until the paint is dry before you peel. Then peel slowly!', steps: [
      ['Stick strips of tape across your paper: one across, one down and one slanted.', ar(20, 20, 160, 160) + paint('#E8DCC0', tapes)],
      ['Rub the tape down hard with your finger so paint cannot sneak under. Rub, rub, rub!', ap('M30 100 l5 -3 l5 6 l5 -6 l5 6 l5 -6 l5 3 M140 100 l5 -3 l5 6 l5 -6 l5 6 l5 -6 l5 3 M100 130 l-3 5 l6 5 l-6 5 l6 5 l-6 5 l3 5 M100 40 l-3 5 l6 5 l-6 5 l6 5 l-3 5')],
      ['Paint every space a different color. Paint right over the tape!', tapeRegions.map(([c, p]) => T(c, apg(p))).join('')],
      ['When it is dry, slowly peel off the tape. Ta-da: white lines!', paint('#fff', tapes)],
      ['It looks like a stained-glass window! Next time, make a house or your first letter out of tape.', '']] },
    { id: 'a6-pt-string', cat: 'paint', level: 2, title: 'String painting', ico: '🧶', single: true,
      need: 'Paper, a piece of string or yarn, runny paint, a plate and a grown-up', tip: 'Press down hard while you pull. Every pull makes a new surprise!', steps: [
      ['Fold a paper in half, then open it again.', ar(20, 30, 160, 140, 2) + fold(al(100, 30, 100, 170))],
      ['Pour a little paint on a plate. Dip a piece of string in it. A grown-up can help: it is messy!', ap('M40 120 H160 Q150 160 100 160 Q50 160 40 120 Z') + T('#8E7CC3', ae(100, 124, 52, 6)) + stroke('#6D55D1', fat('M110 124 Q130 70 150 60 Q170 50 160 30', 3))],
      ['Lay the painty string in wiggles on one half. Let the end hang out at the bottom.', ar(20, 30, 160, 140, 2) + fold(al(100, 30, 100, 170)) + stroke('#6D55D1', fat(swirl, 3))],
      ['Fold the other half over the string. Press down with one hand.', ar(100, 30, 80, 140, 2) + fold(al(100, 30, 100, 170)) + stroke('#6D55D1', fat('M150 170 Q148 182 150 192', 3)) + [120, 140, 160].map(x => al(x, 70, x, 90) + apl(`${x - 5},84 ${x},90 ${x + 5},84`)).join('')],
      ['Keep pressing and slowly pull the string out. Zzzip!', ar(100, 30, 80, 140, 2) + fold(al(100, 30, 100, 170)) + stroke('#6D55D1', fat('M150 170 Q150 185 130 190 Q100 196 70 186 Q50 178 40 188', 3)) + al(60, 160, 30, 160) + apl('36,155 30,160 36,165')],
      ['Open it up: a mirror swirl! Try again with a second color on top.', ar(20, 30, 160, 140, 2) + fold(al(100, 30, 100, 170)) + stroke('#6D55D1', fat(swirlA, 6) + mirror(fat(swirlA, 6))) + stroke('#F78FB3', fat(swirlB, 5) + mirror(fat(swirlB, 5)))]] }
  );
});
