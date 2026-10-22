/* ---------- art5: doodles, kawaii, origami, nature art, weaving & string, shadows & silhouettes ---------- */
// Uses the helpers from art.js (ac, ae, al, ap, ar, apg, apl, guide, fold, stroke, paint, atext, zig).
// Wrapped in an IIFE so the little helpers below never clash with other files.
ART_LATER.push(() => {
  const f1 = n => +n.toFixed(1);
  // Colour that soaks in like a marker: lines underneath stay visible. ev = holes via even-odd.
  const T = (c, s, ev) => `<g class="pt" style="fill:${c};mix-blend-mode:multiply${ev ? ';fill-rule:evenodd' : ''}">${s}</g>`;
  // A thick coloured stroke (yarn, a stick, a fat marker line).
  const fat = (c, d, w) => `<g class="sk" style="--sk:${c}"><path d="${d}" style="stroke-width:${w}"/></g>`;
  // Make every line in a fragment a set width.
  const wide = (s, w) => s.replace(/\/>/g, ` style="stroke-width:${w}"/>`);
  // A real object: solid colour with an outline on top.
  const solid = (c, s) => paint(c, s) + s;
  const ink = (x, y, t, size, c = '#22305A') => paint(c, atext(x, y, t, size));
  const DARK = '#1B1B2F';
  const around = (n, R, cx, cy, f, a0 = -Math.PI / 2) => Array.from({ length: n }, (_, i) => { const a = a0 + i * 2 * Math.PI / n; return f(f1(cx + R * Math.cos(a)), f1(cy + R * Math.sin(a)), a, i); }).join('');
  const starPts = (cx, cy, R, r, n = 5, rot = 0) => Array.from({ length: n * 2 }, (_, i) => {
    const a = (i * 180 / n - 90 + rot) * Math.PI / 180, d = i % 2 ? r : R;
    return `${f1(cx + d * Math.cos(a))},${f1(cy + d * Math.sin(a))}`;
  }).join(' ');
  const heartD = (cx, cy, s) => `M${cx} ${f1(cy + s * 0.9)} C${f1(cx - s * 1.4)} ${f1(cy)} ${f1(cx - s * 0.9)} ${f1(cy - s * 1.1)} ${cx} ${f1(cy - s * 0.4)} C${f1(cx + s * 0.9)} ${f1(cy - s * 1.1)} ${f1(cx + s * 1.4)} ${f1(cy)} ${cx} ${f1(cy + s * 0.9)} Z`;
  // A leaf from its base to its tip; w sets how fat it is.
  const leafD = (bx, by, tx, ty, w) => {
    const mx = (bx + tx) / 2, my = (by + ty) / 2, L = Math.hypot(tx - bx, ty - by), nx = -(ty - by) / L * w, ny = (tx - bx) / L * w;
    return `M${bx} ${by} Q${f1(mx + nx)} ${f1(my + ny)} ${tx} ${ty} Q${f1(mx - nx)} ${f1(my - ny)} ${bx} ${by} Z`;
  };
  // A stick or rope: a rounded strip from one point to another.
  const cap = (x1, y1, x2, y2, w) => {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L * w / 2, ny = dx / L * w / 2, r = w / 2;
    return ap(`M${f1(x1 + nx)} ${f1(y1 + ny)} L${f1(x2 + nx)} ${f1(y2 + ny)} A${r} ${r} 0 0 0 ${f1(x2 - nx)} ${f1(y2 - ny)} L${f1(x1 - nx)} ${f1(y1 - ny)} A${r} ${r} 0 0 0 ${f1(x1 + nx)} ${f1(y1 + ny)} Z`);
  };
  const stick = (x1, y1, x2, y2, w = 8, c = '#A0703F') => solid(c, cap(x1, y1, x2, y2, w));
  const circ = (cx, cy, r) => `M${f1(cx - r)} ${cy} a${r} ${r} 0 1 0 ${f1(2 * r)} 0 a${r} ${r} 0 1 0 ${f1(-2 * r)} 0 Z`;
  const spiral = (cx, cy, R, turns) => {
    const n = Math.round(turns * 30), pts = [];
    for (let i = 0; i <= n; i++) { const t = i / n, a = t * turns * 2 * Math.PI, r = 1 + t * (R - 1); pts.push(`${f1(cx + r * Math.cos(a))} ${f1(cy + r * Math.sin(a))}`); }
    return ap('M' + pts.join(' L'));
  };
  const clipDef = (id, d, ev) => `<defs><clipPath id="${id}"><path d="${d}"${ev ? ' clip-rule="evenodd"' : ''}/></clipPath></defs>`;
  const inClip = (ids, s) => ids.reduceRight((acc, id) => `<g clip-path="url(#${id})">${acc}</g>`, s);
  // Kawaii face bits: shiny eyes, a tiny smile, pink cheeks.
  const keyes = (cx, cy, s = 1, g = 12) => paint('#2B2B3A', ae(f1(cx - g * s), cy, f1(3.6 * s), f1(4.6 * s)) + ae(f1(cx + g * s), cy, f1(3.6 * s), f1(4.6 * s))) +
    paint('#fff', ac(f1(cx - g * s + 1.3 * s), f1(cy - 1.8 * s), f1(1.4 * s)) + ac(f1(cx + g * s + 1.3 * s), f1(cy - 1.8 * s), f1(1.4 * s)));
  const ksmile = (cx, cy, s = 1) => ap(`M${f1(cx - 4 * s)} ${cy} q${f1(4 * s)} ${f1(4.5 * s)} ${f1(8 * s)} 0`);
  const kblush = (cx, cy, s = 1, g = 20) => paint('#F9A3B5', ae(f1(cx - g * s), cy, f1(5 * s), f1(3 * s)) + ae(f1(cx + g * s), cy, f1(5 * s), f1(3 * s)));
  // Origami: a sheet of paper, and a coral arrow showing which way to fold.
  const sheet = (pts, c = '#FFE7A3') => paint(c, apg(pts)) + apg(pts);
  const arrow = (x1, y1, x2, y2, b = 0.3) => {
    const dx = x2 - x1, dy = y2 - y1, cx = (x1 + x2) / 2 - dy * b, cy = (y1 + y2) / 2 + dx * b;
    const tx = x2 - cx, ty = y2 - cy, L = Math.hypot(tx, ty), ux = tx / L, uy = ty / L, h = 8;
    return stroke('#F2604F', ap(`M${x1} ${y1} Q${f1(cx)} ${f1(cy)} ${x2} ${y2}`) +
      apl(`${f1(x2 - ux * h - uy * h * 0.6)},${f1(y2 - uy * h + ux * h * 0.6)} ${x2},${y2} ${f1(x2 - ux * h + uy * h * 0.6)},${f1(y2 - uy * h - ux * h * 0.6)}`));
  };

  ART_CATS.push(
    { id: 'doodle', name: 'Doodles & Zentangle', ico: '✒️', blurb: 'Zigzags, loops, doodle monsters and pattern tiles' },
    { id: 'kawaii', name: 'Cute Kawaii', ico: '🍡', blurb: 'Tiny faces that make everything adorable' },
    { id: 'origami', name: 'Origami', ico: '🦢', blurb: 'Fold a square into dogs, hearts, boats and games' },
    { id: 'naturalart', name: 'Nature Art', ico: '🍂', blurb: 'Make art with stones, leaves, sticks and flowers' },
    { id: 'string', name: 'Weaving & String Art', ico: '🧶', blurb: 'Wrap, weave, lace and stitch with yarn' },
    { id: 'silhouette', name: 'Shadows & Silhouettes', ico: '🌅', blurb: 'Sunsets, shadow puppets and night skies' }
  );

  /* ================= Doodles & Zentangle ================= */
  const lnZig = apl(Array.from({ length: 17 }, (_, i) => `${20 + i * 10},${i % 2 ? 50 : 66}`).join(' '));
  const lnWave = ap('M20 94 q10 -14 20 0' + ' t20 0'.repeat(7));
  const lnLoop = ap('M' + Array.from({ length: 241 }, (_, i) => { const t = i * 0.2; return `${f1(26 + 3.4 * t - 8 * Math.sin(t))} ${f1(128 + 8 * Math.cos(t))}`; }).join(' L'));
  const lnBump = ap('M20 168' + ' a10 10 0 0 1 20 0'.repeat(8));
  const lnDots = Array.from({ length: 11 }, (_, i) => ac(24 + i * 15.2, 188, 2.5)).join('');

  // Cloud of bumps around a name.
  const nameCloud = (() => {
    const n = 16, P = Array.from({ length: n }, (_, i) => { const a = i * 2 * Math.PI / n; return [f1(100 + 80 * Math.cos(a)), f1(100 + 50 * Math.sin(a))]; });
    return `M${P[0][0]} ${P[0][1]}` + P.map((p, i) => { const q = P[(i + 1) % n]; return ` A13 13 0 0 1 ${q[0]} ${q[1]}`; }).join('');
  })();
  const nmStars = [[24, 24, 10], [176, 176, 10], [104, 18, 6], [16, 112, 6]].map(([x, y, r]) => apg(starPts(x, y, r, r * 0.45))).join('');
  const nmHearts = [[176, 24, 10], [24, 176, 10], [186, 98, 6]].map(([x, y, s]) => ap(heartD(x, y, s))).join('');

  // Zentangle tile: a wavy string across and one down make 4 spaces.
  const zA = 'M30 100 C70 70 130 130 170 95', zB = 'M90 30 C120 70 70 130 110 170';
  const zDefs = clipDef('a5z-up', zA + ' L170 30 L30 30 Z') + clipDef('a5z-dn', zA + ' L170 170 L30 170 Z') +
    clipDef('a5z-lf', zB + ' L30 170 L30 30 Z') + clipDef('a5z-rt', zB + ' L170 170 L170 30 Z');
  let zGrid = '', zOrbs = '', zStripes = '', zZig = '';
  for (let k = 30; k <= 170; k += 10) zGrid += al(k, 30, k, 110) + al(30, k > 110 ? 110 : k, 110, k > 110 ? 110 : k);
  for (let y = 38; y < 130; y += 16) for (let x = 90 + ((y - 38) / 16 % 2) * 8; x < 176; x += 16) zOrbs += ac(x, y, 6) + paint('#22305A', ac(x + 1.5, y - 1.5, 1.6));
  for (let k = -150; k < 120; k += 9) zStripes += al(k, 170, k + 140, 30);
  for (let y = 80; y < 176; y += 10) zZig += apl(Array.from({ length: 21 }, (_, i) => `${70 + i * 5},${i % 2 ? y : y + 5}`).join(' '));
  const zRegion = (a, b, s) => inClip([a, b], s);
  const zTile = ar(30, 30, 140, 140, 4);

  // Doodle monster
  const mBlob = 'M60 70 Q58 40 90 42 Q110 30 130 44 Q160 46 152 80 Q170 110 150 140 Q150 165 120 160 Q100 172 80 160 Q50 164 52 136 Q36 106 60 70 Z';
  const mEyes = [[84, 78, 13], [120, 64, 9], [137, 92, 7]];
  const mMouth = 'M72 118 L138 118 Q105 162 72 118 Z';
  const mTeeth = 'M80 118 L86 128 L92 118 Z M114 118 L120 128 L126 118 Z';
  const mSpots = ac(64, 96, 4) + ac(70, 145, 5) + ac(134, 146, 4) + ac(104, 50, 3) + ac(146, 122, 3) + ac(96, 150, 2.5);

  // Doodle-filled cat
  const dcBody = 'M82 80 C58 100 46 150 58 182 L142 182 C154 150 142 100 118 80';
  const dcCurves = [115, 140, 162].map(y => ap(`M30 ${y} Q100 ${y + 14} 170 ${y}`)).join('');
  const band = (yt, yb) => `M30 ${yt} Q100 ${yt + 14} 170 ${yt} L170 ${yb} Q100 ${yb + 14} 30 ${yb} Z`;
  const dcDefs = clipDef('a5c-body', dcBody + ' Q100 92 82 80 Z') + clipDef('a5c-b1', 'M30 92 L170 92 L170 115 Q100 129 30 115 Z') +
    clipDef('a5c-b2', band(115, 140)) + clipDef('a5c-b3', band(140, 162)) + clipDef('a5c-b4', 'M30 162 Q100 176 170 162 L170 195 L30 195 Z');
  let dcDots = '', dcZig = '', dcScale = '', dcStripe = '';
  for (let y = 96; y < 130; y += 8) for (let x = 44 + (y % 16 ? 4 : 0); x < 160; x += 9) dcDots += ac(x, y, 1.8);
  for (let y = 118; y < 156; y += 8) dcZig += apl(Array.from({ length: 25 }, (_, i) => `${40 + i * 5},${i % 2 ? y : y + 5}`).join(' '));
  for (let y = 146, r = 0; y < 180; y += 7, r++) for (let x = 40 + (r % 2) * 6; x < 160; x += 12) dcScale += ap(`M${x} ${y} a6 6 0 0 1 12 0`);
  for (let x = 42; x < 160; x += 7) dcStripe += al(x, 164, x, 192);
  const dcIn = (b, s) => inClip(['a5c-body', b], s);

  LESSONS.push(
    { id: 'a5-lines', cat: 'doodle', level: 1, title: 'A line party', ico: '〰️',
      need: 'Paper, a pencil or felt-tip pens, and crayons', tip: 'Go slowly. Wobbly lines are fine. They are your lines!', steps: [
      ['Draw a straight line across the top, from one side to the other.', al(20, 28, 180, 28)],
      ['Under it, draw a zigzag line: up, down, up, down. Pointy like teeth!', lnZig],
      ['Next draw a wavy line, like a snake swimming.', lnWave],
      ['Now a loopy line. Go round in little loops, like a spring.', lnLoop],
      ['Draw a bumpy line, like the top of a cloud.', lnBump],
      ['Finish with a dotty line: dot, dot, dot!', lnDots],
      ['Go over each line with a different colour. Which line is your favourite?', stroke('#F2604F', wide(al(20, 28, 180, 28), 4)) + stroke('#F59E2E', wide(lnZig, 4)) + stroke('#E8B400', wide(lnWave, 4)) + stroke('#3BAA5C', wide(lnLoop, 4)) + stroke('#3D7DD8', wide(lnBump, 4)) + paint('#9B59D0', lnDots.replace(/r="2.5"/g, 'r="3.5"'))]] },
    { id: 'a5-name', cat: 'doodle', level: 1, title: 'Doodle your name', ico: '📛',
      need: 'Paper, a pencil, felt-tip pens and crayons', tip: 'Fill every empty space with tiny doodles. No space left!', steps: [
      ['Write your name big in the middle of the paper.', ink(100, 120, 'SAM', 54)],
      ['Draw a bumpy cloud all the way around your name.', ap(nameCloud)],
      ['Outside the cloud, draw some stars.', nmStars],
      ['Draw some hearts too.', nmHearts],
      ['Fill the empty spaces with swirls and dots.', spiral(60, 22, 8, 2.2) + spiral(140, 180, 8, 2.2) + spiral(14, 62, 6, 2) + spiral(186, 140, 6, 2) + ac(136, 16, 2.5) + ac(70, 184, 2.5) + ac(24, 144, 2.5) + ac(178, 58, 2.5) + ac(84, 14, 2) + ac(116, 186, 2)],
      ['Colour the cloud, the stars and the hearts. Hang it on your door!', T('#FFE58A', ap(nameCloud)) + T('#FFC23D', nmStars) + T('#F78FB3', nmHearts)]] },
    { id: 'a5-tangle', cat: 'doodle', level: 2, title: 'A zentangle tile', ico: '🔳',
      need: 'A square of paper (a sticky note works), a black pen and a pencil', tip: 'Zentangle is slow and calm. One line at a time, no rubbing out!', steps: [
      ['Draw a square tile with a pen.', zTile],
      ['Draw a wavy line across. Then a wavy line down. Now the tile has 4 spaces.', ap(zA) + ap(zB) + zDefs],
      ['Fill the top-left space with a grid, like a little window.', zRegion('a5z-up', 'a5z-lf', wide(zGrid, 1.8))],
      ['Fill the top-right space with bubbles. Put a dot in each one.', zRegion('a5z-up', 'a5z-rt', wide(zOrbs, 1.8))],
      ['Fill the bottom-left space with slanted stripes.', zRegion('a5z-dn', 'a5z-lf', wide(zStripes, 1.8))],
      ['Fill the last space with rows of zigzags.', zRegion('a5z-dn', 'a5z-rt', wide(zZig, 1.8))],
      ['Colour each space softly with a different colour. Make another tile and put them side by side!', T('#BFE3F7', zRegion('a5z-up', 'a5z-lf', zTile)) + T('#FFE58A', zRegion('a5z-up', 'a5z-rt', zTile)) + T('#F9C0D0', zRegion('a5z-dn', 'a5z-lf', zTile)) + T('#C8EBC0', zRegion('a5z-dn', 'a5z-rt', zTile))]] },
    { id: 'a5-monster', cat: 'doodle', level: 2, title: 'Doodle monster', ico: '👹',
      need: 'Paper, a pencil, a black pen and crayons', tip: 'Monsters can have any number of eyes. Be as silly as you like!', steps: [
      ['Draw a big wobbly blob. Any shape is fine!', ap(mBlob)],
      ['Give it 3 eyes, all different sizes, with dark middles.', mEyes.map(([x, y, r]) => ac(x, y, r)).join('') + paint('#22305A', mEyes.map(([x, y, r]) => ac(x + r * 0.2, y + r * 0.15, f1(r * 0.45))).join(''))],
      ['Draw a big open mouth with two pointy teeth.', ap(mMouth) + ap(mTeeth)],
      ['Add two horns on top.', apl('62,55 48,24 76,43') + apl('143,47 166,22 152,58')],
      ['Draw arms with 3 fingers, and two legs with feet.', ap('M46 117 Q30 112 24 96') + al(24, 96, 16, 90) + al(24, 96, 22, 86) + al(24, 96, 14, 99) + ap('M160 116 Q176 112 180 96') + al(180, 96, 188, 90) + al(180, 96, 178, 86) + al(180, 96, 190, 99) + al(86, 163, 84, 183) + al(116, 162, 118, 183) + ae(77, 188, 10, 5) + ae(125, 188, 10, 5)],
      ['Doodle spots all over its body.', mSpots],
      ['Colour your monster. Give it a name, like Bobo or Snorkle!', T('#9BE07A', ap(mBlob + ' ' + mEyes.map(([x, y, r]) => circ(x, y, r)).join(' ') + ' ' + mMouth), true) + T('#E8574A', ap(mMouth + ' ' + mTeeth), true) + T('#FFC23D', apg('62,55 48,24 76,43') + apg('143,47 166,22 152,58') + ae(77, 188, 10, 5) + ae(125, 188, 10, 5)) + T('#3BAA5C', mSpots)]] },
    { id: 'a5-doodlecat', cat: 'doodle', level: 3, title: 'Doodle-filled cat', ico: '🐈',
      need: 'Paper, a pencil, a fine black pen and colour pens', tip: 'Thin lines and small patterns look best. Turn the paper as you go!', steps: [
      ['Draw a circle for the head with two pointy ears.', ac(100, 58, 28) + apl('78,41 74,14 94,31') + apl('106,31 126,14 122,41')],
      ['Draw a big pear-shaped body under the head, and a curly tail.', ap(dcBody) + ap('M144 176 C180 176 186 140 166 128 C158 124 152 132 158 136') + dcDefs],
      ['Draw 3 curvy lines across the body. Now it has 4 stripes of space.', inClip(['a5c-body'], dcCurves)],
      ['Fill the top stripe with dots, and the next one with zigzags.', dcIn('a5c-b1', paint('#22305A', dcDots)) + dcIn('a5c-b2', wide(dcZig, 1.8))],
      ['Fill the next stripe with little bumps, like fish scales.', dcIn('a5c-b3', wide(dcScale, 1.8))],
      ['Fill the last stripe with straight lines.', dcIn('a5c-b4', wide(dcStripe, 1.8))],
      ['Draw the face: eyes, a nose, a mouth and whiskers.', paint('#22305A', ae(89, 55, 4, 6) + ae(111, 55, 4, 6)) + apg('96,65 104,65 100,70') + ap('M100 70 q-5 6 -10 2 M100 70 q5 6 10 2') + al(64, 64, 84, 67) + al(64, 73, 84, 71) + al(136, 64, 116, 67) + al(136, 73, 116, 71)],
      ['Colour each stripe a different colour. Frame it and show your family!', T('#FFB870', ac(100, 58, 28) + apg('78,41 74,14 94,31') + apg('106,31 126,14 122,41')) + T('#FFE58A', dcIn('a5c-b1', ar(30, 80, 140, 120))) + T('#F9C0D0', dcIn('a5c-b2', ar(30, 80, 140, 120))) + T('#BFE3F7', dcIn('a5c-b3', ar(30, 80, 140, 120))) + T('#D7C8F2', dcIn('a5c-b4', ar(30, 80, 140, 120))) + fat('#FFB870', 'M144 176 C180 176 186 140 166 128 C158 124 152 132 158 136', 5)]] }
  );

  /* ================= Cute Kawaii ================= */
  const kCloud = 'M55 135 Q25 135 30 110 Q35 88 58 92 Q62 58 98 62 Q125 50 140 80 Q172 82 168 110 Q168 135 145 135 Z';
  const drop = (x, y) => ap(`M${x} ${y} q-7 10 0 13 q7 -3 0 -13 Z`);
  const kDrops = drop(70, 150) + drop(100, 160) + drop(130, 150);
  const toast = 'M55 175 L55 85 Q40 80 42 62 Q46 36 78 40 Q100 30 122 40 Q154 36 158 62 Q160 80 145 85 L145 175 Q145 182 138 182 L62 182 Q55 182 55 175 Z';
  const toastIn = 'M64 170 L64 79 Q51 75 52 62 Q55 47 80 49 Q100 41 120 49 Q145 47 148 62 Q149 75 136 79 L136 170 Q136 173 133 173 L67 173 Q64 173 64 170 Z';
  const butter = '<rect x="98" y="58" width="28" height="18" rx="4" transform="rotate(-10 112 67)"/>';
  const kcEars = ap('M50 73 L48 42 Q48 34 55 38 L67 59') + ap('M150 73 L152 42 Q152 34 145 38 L133 59');
  const kcBody = 'M76 135 Q66 176 84 176 L116 176 Q134 176 124 135';
  const kcTail = 'M124 170 Q152 174 152 150 Q152 138 162 140';
  const cactus = 'M82 110 L82 86 L70 86 Q60 86 60 76 L60 64 Q60 57 66 57 Q72 57 72 64 L72 74 L82 74 L82 60 Q82 38 100 38 Q118 38 118 60 L118 66 L128 66 L128 54 Q128 47 134 47 Q140 47 140 54 L140 68 Q140 78 130 78 L118 78 L118 110';
  const potBody = 'M60 128 L70 182 Q71 186 76 186 L124 186 Q129 186 130 182 L140 128';
  const flower = around(5, 7, 100, 34, (x, y, a) => `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="6.5" transform="rotate(${f1(a * 180 / Math.PI + 90)} ${x} ${y})"/>`);
  // sticker sheet
  const dango = [[55, 34, '#F9A3B5'], [55, 53, '#FFFFFF'], [55, 72, '#9BD67E']];
  const onigiri = 'M55 108 Q62 108 88 158 Q92 170 80 170 L30 170 Q18 170 22 158 Q48 108 55 108 Z';
  const cutLines = 'M36 35 A19 19 0 0 1 74 35 L74 81 A19 19 0 0 1 36 81 Z ' + circ(145, 57, 38) +
    ' M55 98 Q66 98 98 160 Q104 180 84 180 L26 180 Q6 180 12 160 Q44 98 55 98 Z ' + heartD(145, 148, 36);

  LESSONS.push(
    { id: 'a5-cloud', cat: 'kawaii', level: 1, title: 'Kawaii cloud', ico: '☁️',
      need: 'Paper, a pencil, a black pen and crayons', tip: 'The kawaii secret: put the eyes low and far apart!', steps: [
      ['Draw a big puffy cloud with round bumps on top and a flat bottom.', ap(kCloud)],
      ['Draw two eyes low down and far apart. Leave a white dot in each one so they shine.', keyes(100, 108, 1.4)],
      ['Draw a tiny smile between the eyes.', ksmile(100, 112, 1.2)],
      ['Add pink cheeks under the eyes.', kblush(100, 118, 1.4)],
      ['Draw raindrops falling down.', kDrops],
      ['Colour the cloud light blue and the drops blue. Now give it a friend!', T('#CDE7FB', ap(kCloud)) + T('#7FB5F0', kDrops)]] },
    { id: 'a5-toast', cat: 'kawaii', level: 1, title: 'Happy toast', ico: '🍞',
      need: 'Paper, a pencil, a black pen and crayons', tip: 'Any food can be kawaii. Try a happy egg or a smiling cupcake next!', steps: [
      ['Draw a slice of bread: a puffy round top and a square bottom.', ap(toast)],
      ['Draw a second line inside, close to the edge. That is the crust.', ap(toastIn)],
      ['Draw two shiny eyes and a little smile in the middle.', keyes(100, 122, 1.5) + ksmile(100, 128, 1.3)],
      ['Add pink cheeks.', kblush(100, 134, 1.5, 19)],
      ['Put a square of butter on top. It is melting!', butter + ap('M104 74 q0 10 4 10 q4 0 4 -8')],
      ['Give it tiny arms and legs.', ap('M55 130 q-14 -2 -18 -14') + ap('M145 130 q14 -2 18 -14') + ap('M82 182 v10 h-6') + ap('M118 182 v10 h6')],
      ['Colour the crust brown and the bread pale yellow. Yum!', T('#D9A35F', ap(toast + ' ' + toastIn), true) + T('#FBE7B5', ap(toastIn)) + paint('#FFD84D', butter) + butter]] },
    { id: 'a5-kcat', cat: 'kawaii', level: 2, title: 'Kawaii kitty', ico: '😺',
      need: 'Paper, a pencil, a black pen and crayons', tip: 'Kawaii heads are big and bodies are tiny. That makes them cute!', steps: [
      ['Draw a wide, round head, like a bean on its side.', ae(100, 95, 58, 44)],
      ['Add two small ears on top with rounded tips.', kcEars],
      ['Draw shiny eyes low down and far apart.', keyes(100, 104, 1.5, 15)],
      ['Draw a tiny nose and a mouth like a little "w".', paint('#2B2B3A', ae(100, 106, 2.6, 1.8)) + ap('M92 110 q4 5 8 0 q4 5 8 0')],
      ['Draw a small body under the head with two paws.', ap(kcBody) + ap('M84 176 q6 -9 12 0 M104 176 q6 -9 12 0')],
      ['Add a curly tail and whiskers.', ap(kcTail) + al(38, 98, 24, 94) + al(38, 106, 22, 106) + al(38, 114, 24, 118) + al(162, 98, 176, 94) + al(162, 106, 178, 106) + al(162, 114, 176, 118)],
      ['Add pink cheeks and colour your kitty. Draw a bow or a hat on top!', kblush(100, 114, 1.5, 21) + T('#FFD6A8', ae(100, 95, 58, 44) + ap(kcBody + ' Z') + ap('M50 73 L48 42 Q48 34 55 38 L67 59 Z M150 73 L152 42 Q152 34 145 38 L133 59 Z')) + T('#F9A3B5', apg('53,62 52,46 60,58') + apg('147,62 148,46 140,58')) + fat('#FFC48A', kcTail, 4)]] },
    { id: 'a5-pot', cat: 'kawaii', level: 2, title: 'Kawaii cactus pot', ico: '🌵',
      need: 'Paper, a pencil, a black pen and crayons', tip: 'A real cactus is spiky, so this one is a friend you can hug in a drawing!', steps: [
      ['Draw the top of the pot: a long rectangle with round corners.', ar(52, 110, 96, 18, 5)],
      ['Draw the pot under it, a bit narrower at the bottom.', ap(potBody)],
      ['Give the pot a happy face with pink cheeks.', keyes(100, 152, 1.3, 14) + ksmile(100, 157, 1.1) + kblush(100, 162, 1.3, 24)],
      ['Draw a cactus growing out of the pot, with two arms.', ap(cactus)],
      ['Add tiny lines all over for prickles.', [[92, 52], [108, 52], [92, 76], [108, 72], [96, 96], [106, 90], [66, 70], [134, 60]].map(([x, y]) => al(x, y, x + 3, y - 3)).join('')],
      ['Put a little flower on the top.', solid('#F78FB3', flower) + solid('#FFD84D', ac(100, 34, 3.5))],
      ['Colour the pot orange and the cactus green. Draw a whole shelf of plant friends!', T('#F2A07B', ar(52, 110, 96, 18, 5) + ap(potBody + ' Z')) + T('#8FD18B', ap(cactus + ' Z'))]] },
    { id: 'a5-stickers', cat: 'kawaii', level: 3, title: 'Kawaii sticker sheet', ico: '🍡',
      need: 'Paper or sticker paper, a black pen, crayons; a grown-up with scissors', tip: 'Leave a white edge round each sticker. It makes it pop!', steps: [
      ['Draw a big rectangle. This is your sticker sheet.', ar(10, 10, 180, 180, 10)],
      ['Top left: draw a dango. That is 3 sweet balls on a stick.', dango.map(([x, y]) => ac(x, y, 9)).join('') + al(55, 21, 55, 25) + al(55, 81, 55, 94)],
      ['Top right: draw a star.', apg(starPts(145, 59, 30, 15))],
      ['Bottom left: draw a rice ball with a dark seaweed strip.', ap(onigiri) + ar(42, 150, 26, 20, 2)],
      ['Bottom right: draw a heart.', ap(heartD(145, 145, 26))],
      ['Give every one a kawaii face: eyes, a smile and pink cheeks.', keyes(55, 53, 0.6, 8) + ksmile(55, 55, 0.5) + keyes(145, 62, 0.7, 9) + ksmile(145, 66, 0.6) + kblush(145, 70, 0.7, 14) + keyes(55, 136, 0.7, 10) + ksmile(55, 140, 0.6) + kblush(55, 143, 0.7, 17) + keyes(145, 140, 0.8, 10) + ksmile(145, 145, 0.7) + kblush(145, 149, 0.8, 16)],
      ['Draw a cutting line round each one, leaving a white edge.', fold(ap(cutLines))],
      ['Colour them in. A grown-up can cut them out. Stick them on your book!', dango.map(([x, y, c]) => T(c, ac(x, y, 9))).join('') + T('#FFD84D', apg(starPts(145, 59, 30, 15))) + T('#FFF6E0', ap(onigiri)) + paint('#2E4A3A', ar(42, 150, 26, 20, 2)) + T('#F78FB3', ap(heartD(145, 145, 26))) + T('#DDEFFB', ap('M10 20 Q10 10 20 10 L180 10 Q190 10 190 20 L190 180 Q190 190 180 190 L20 190 Q10 190 10 180 Z ' + cutLines), true)]] }
  );

  /* ================= Origami (each picture shows the paper after that fold) ================= */
  const DIA = '100,20 180,100 100,180 20,100';
  const hk = (pts, k = 1.6, cx = 100, cy = 80) => pts.split(' ').map(p => { const [x, y] = p.split(',').map(Number); return `${f1(cx + (x - cx) * k)},${f1(100 + (y - cy) * k)}`; }).join(' ');
  const tulipBody = '60,60 140,60 120,110 100,130 80,110';
  const tulipL = '80,110 60,60 81.8,39.4', tulipR = '120,110 140,60 118.2,39.4';
  const tulipAt = (dy, c = '#F2604F', c2 = '#D84A3A') => {
    const sh = p => p.split(' ').map(q => { const [x, y] = q.split(','); return `${x},${f1(+y + dy)}`; }).join(' ');
    return sheet(sh(tulipBody), c) + sheet(sh(tulipL), c2) + sheet(sh(tulipR), c2);
  };
  const heartFlat = '100,164 30,94 30,74 58,46 78,46 100,68 122,46 142,46 170,74 170,94';
  const tellerNums = around(8, 40, 100, 100, (x, y, a, i) => ink(x, f1(+y + 6), String(i + 1), 17), -Math.PI / 2 + Math.PI / 8);
  const pocket = (a, c) => { const R = (x, y) => { const ca = Math.cos(a), sa = Math.sin(a); return `${f1(100 + x * ca - y * sa)},${f1(100 + x * sa + y * ca)}`; };
    return sheet(`${R(0, 0)} ${R(-34, -34)} ${R(0, -80)} ${R(34, -34)}`, c) + al(100, 100, ...R(0, -80).split(',').map(Number)); };
  const boatHull = '15,95 185,95 150,140 50,140';

  LESSONS.push(
    { id: 'a5-dog', cat: 'origami', level: 1, title: 'Origami dog face', ico: '🐶', single: true,
      need: 'A square of paper (brown or orange is great) and a pen', tip: 'Press each fold flat with your fingernail. Sharp folds look best!', steps: [
      ['Start with a square of paper. Turn it so it looks like a diamond.', sheet(DIA, '#E9B77A')],
      ['Fold the top corner down to the bottom corner. Now it is a triangle.', fold(apl('20,100 100,20 180,100')) + sheet('20,100 180,100 100,180', '#E9B77A') + arrow(110, 34, 112, 166, -0.25)],
      ['Fold the two side corners down. These are floppy ears!', sheet('40,50 160,50 100,130', '#E9B77A') + sheet('40,50 68,50 50,118 28,106', '#B98250') + sheet('160,50 132,50 150,118 172,106', '#B98250') + arrow(22, 40, 26, 96, -0.4) + arrow(178, 40, 174, 96, 0.4)],
      ['Fold the bottom tip up a little bit. That is the nose.', sheet('40,50 160,50 113.5,112 86.5,112', '#E9B77A') + sheet('86.5,112 113.5,112 100,98.5', '#B98250') + sheet('40,50 68,50 50,118 28,106', '#B98250') + sheet('160,50 132,50 150,118 172,106', '#B98250') + arrow(100, 136, 100, 106, 0.6)],
      ['Draw two eyes. Colour the nose black and draw a smile.', sheet('40,50 160,50 113.5,112 86.5,112', '#E9B77A') + sheet('86.5,112 113.5,112 100,98.5', '#2B2B3A') + sheet('40,50 68,50 50,118 28,106', '#B98250') + sheet('160,50 132,50 150,118 172,106', '#B98250') + paint('#2B2B3A', ac(82, 76, 5) + ac(118, 76, 5)) + paint('#fff', ac(84, 74, 1.6) + ac(120, 74, 1.6)) + ap('M100 112 v4 q-6 5 -10 0 M100 116 q6 5 10 0')],
      ['Glue it on paper and draw a body and a waggy tail. Woof!', ap('M80 120 Q58 150 64 186 H136 Q142 150 120 120') + ap('M136 170 Q160 168 162 146') + ap('M86 186 v-14 M114 186 v-14') + sheet('40,50 160,50 113.5,112 86.5,112', '#E9B77A') + sheet('86.5,112 113.5,112 100,98.5', '#2B2B3A') + sheet('40,50 68,50 50,118 28,106', '#B98250') + sheet('160,50 132,50 150,118 172,106', '#B98250') + paint('#2B2B3A', ac(82, 76, 5) + ac(118, 76, 5)) + paint('#fff', ac(84, 74, 1.6) + ac(120, 74, 1.6)) + ap('M100 112 v4 q-6 5 -10 0 M100 116 q6 5 10 0')]] },
    { id: 'a5-tulip', cat: 'origami', level: 1, title: 'Origami tulip', ico: '🌷', single: true,
      need: 'A square of red or pink paper, green paper or a green crayon, and glue', tip: 'Make 3 tulips in different colours for a bunch of flowers!', steps: [
      ['Start with a square. Turn it so it looks like a diamond.', sheet(DIA, '#F2604F')],
      ['Fold the top corner down to the bottom corner. Now it is a triangle.', fold(apl('20,100 100,20 180,100')) + sheet('20,100 180,100 100,180', '#F2604F') + arrow(110, 34, 112, 166, -0.25)],
      ['Fold the left corner up, so it sticks out past the top.', sheet('60,60 170,60 100,130 80,110', '#F2604F') + sheet(tulipL, '#D84A3A') + fold(apl('60,60 30,60 80,110')) + arrow(32, 70, 72, 40, 0.4)],
      ['Fold the right corner up the same way. It is a tulip!', tulipAt(0) + fold(apl('140,60 170,60 120,110')) + arrow(168, 70, 128, 40, -0.4)],
      ['Make a green stem and a leaf. Glue the tulip on top.', stick(100, 128, 100, 190, 8, '#5DB360') + solid('#7CC46B', ap(leafD(100, 178, 140, 140, 16))) + tulipAt(0)],
      ['Glue it on a card. Add grass and a sun, and give it to someone!', al(10, 190, 190, 190) + ap('M20 190 l4 -10 l4 10 M150 190 l4 -10 l4 10 M170 190 l4 -10 l4 10') + solid('#FFD84D', ac(170, 30, 14)) + stick(100, 128, 100, 190, 8, '#5DB360') + solid('#7CC46B', ap(leafD(100, 178, 140, 140, 16))) + tulipAt(0)]] },
    { id: 'a5-heart', cat: 'origami', level: 2, title: 'Origami heart', ico: '❤️', single: true,
      need: 'A square of red or pink paper', tip: 'Line the edges up exactly before you press the fold flat.', steps: [
      ['Start with a diamond. Fold it in half both ways, then open it again.', sheet(DIA, '#F47A9A') + fold(al(100, 20, 100, 180) + al(20, 100, 180, 100))],
      ['Fold the top corner down to the middle.', sheet('20,100 60,60 140,60 180,100 100,180', '#F47A9A') + sheet('60,60 140,60 100,100', '#E8557D') + fold(al(100, 100, 100, 180)) + fold(apl('60,60 100,20 140,60')) + arrow(112, 30, 112, 90, -0.4)],
      ['Fold the bottom corner up to the top edge.', sheet('60,60 140,60 180,100 160,120 40,120 20,100', '#F47A9A') + sheet('60,60 140,60 100,100', '#E8557D') + sheet('40,120 160,120 100,60', '#E8557D') + fold(apl('40,120 100,180 160,120')) + arrow(112, 170, 112, 72, 0.4)],
      ['Fold the right bottom edge up to the middle line. Then do the left side.', sheet(hk('100,120 50,70 80,40 100,60 120,40 150,70'), '#F47A9A') + sheet(hk('50,70 80,40 100,60 100,120'), '#E8557D') + sheet(hk('150,70 120,40 100,60 100,120'), '#E8557D')],
      ['Flip it over. Fold the 4 little corners on top to the back, to make it round.', sheet(heartFlat, '#F47A9A') + fold(apl('30,94 20,84 30,74') + apl('58,46 68,36 78,46') + apl('122,46 132,36 142,46') + apl('170,74 180,84 170,94'))],
      ['Write a love note on it and give it to someone special!', sheet(heartFlat, '#F47A9A') + ink(100, 108, 'LOVE', 26, '#FFFFFF') + paint('#FFFFFF', ap(heartD(68, 72, 6)))]] },
    { id: 'a5-teller', cat: 'origami', level: 2, title: 'Fortune teller', ico: '🔮', single: true,
      need: 'A square of paper, a pen, and crayons', tip: 'Write kind fortunes, like "You will laugh today!"', steps: [
      ['Start with a square. Fold it corner to corner both ways, then open it.', sheet('30,30 170,30 170,170 30,170', '#FFF3C4') + fold(al(30, 30, 170, 170) + al(170, 30, 30, 170))],
      ['Fold all 4 corners into the middle. Now it is a smaller square.', fold(apl('30,100 30,30 100,30') + apl('100,30 170,30 170,100') + apl('170,100 170,170 100,170') + apl('100,170 30,170 30,100')) + sheet('100,30 170,100 100,170 30,100', '#FFF3C4') + al(100, 30, 100, 170) + al(30, 100, 170, 100)],
      ['Flip it over. Fold the 4 new corners into the middle again.', sheet('40,40 160,40 160,160 40,160', '#FFF3C4') + al(40, 40, 160, 160) + al(160, 40, 40, 160) + fold(al(100, 40, 100, 160) + al(40, 100, 160, 100))],
      ['Write a number on each of the 8 little triangles.', sheet('40,40 160,40 160,160 40,160', '#FFF3C4') + al(40, 40, 160, 160) + al(160, 40, 40, 160) + fold(al(100, 40, 100, 160) + al(40, 100, 160, 100)) + tellerNums],
      ['Lift each flap and write a secret fortune underneath.', sheet('40,70 160,70 160,190 40,190', '#FFF3C4') + al(40, 70, 160, 190) + al(160, 70, 40, 190) + sheet('40,70 160,70 100,10', '#FFFBE6') + fold(al(40, 70, 160, 70)) + ink(100, 54, 'YOU', 13) + ink(100, 66, 'ROCK!', 11) + ink(100, 166, '6', 17) + ink(66, 136, '7', 17) + ink(134, 136, '4', 17)],
      ['Flip it over. Colour the 4 squares in 4 colours.', sheet('40,40 100,40 100,100 40,100', '#F78FB3') + sheet('100,40 160,40 160,100 100,100', '#7FB5F0') + sheet('40,100 100,100 100,160 40,160', '#9BD67E') + sheet('100,100 160,100 160,160 100,160', '#FFD84D') + fold(al(40, 40, 100, 100) + al(160, 40, 100, 100) + al(40, 160, 100, 100) + al(160, 160, 100, 100))],
      ['Fold it in half, push your fingers into the 4 pockets, and play with a friend!', pocket(0, '#F78FB3') + pocket(Math.PI / 2, '#7FB5F0') + pocket(Math.PI, '#FFD84D') + pocket(-Math.PI / 2, '#9BD67E')]] },
    { id: 'a5-boat', cat: 'origami', level: 3, title: 'Paper boat', ico: '⛵', single: true,
      need: 'A sheet of paper (not square), and crayons', tip: 'Newspaper boats float too! Rub a crayon on the bottom to keep it dry.', steps: [
      ['Fold a sheet of paper in half, top down to the bottom.', fold(apl('30,60 30,20 170,20 170,60')) + sheet('30,60 170,60 170,160 30,160') + arrow(150, 26, 150, 140, 0.3)],
      ['Fold the two top corners down so they meet in the middle.', fold(apl('30,130 30,60 100,60') + apl('100,60 170,60 170,130')) + sheet('100,60 170,130 170,160 30,160 30,130') + al(30, 130, 170, 130) + al(100, 60, 100, 130) + arrow(40, 70, 70, 110, -0.3) + arrow(160, 70, 130, 110, 0.3)],
      ['Fold the bottom strip up. Flip it, and fold the other strip up too. A hat!', sheet('100,60 140,100 60,100') + sheet('30,100 170,100 170,130 30,130') + al(100, 60, 100, 100)],
      ['Open the hat from the bottom. Squash it flat into a diamond.', sheet('100,30 160,100 100,170 40,100') + al(40, 100, 160, 100) + al(100, 100, 100, 170)],
      ['Fold the bottom corner up to the top. Flip it and do the same.', fold(apl('40,100 100,170 160,100')) + sheet('40,100 160,100 100,30') + al(100, 30, 100, 100) + arrow(112, 160, 112, 46, 0.4)],
      ['Open it and squash it flat again, into a smaller diamond.', sheet('100,50 140,100 100,150 60,100') + al(60, 100, 140, 100) + al(100, 100, 100, 150)],
      ['Gently pull the two top points out to the sides. It is a boat!', sheet(boatHull) + ap('M15 95 L70 112 L130 112 L185 95') + sheet('100,30 132,110 68,110') + arrow(30, 70, 14, 88, -0.4) + arrow(170, 70, 186, 88, 0.4)],
      ['Colour a flag on it. Float it in the bath or a puddle!', ap('M0 160 q12 -8 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0') + ap('M10 178 q12 -8 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0') + sheet(boatHull, '#FFE7A3') + ap('M15 95 L70 112 L130 112 L185 95') + sheet('100,30 132,110 68,110', '#FFF6D6') + al(100, 30, 100, 14) + solid('#F2604F', apg('100,14 118,19 100,24')) + T('#7FB5F0', ap('M0 160 q12 -8 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 V200 H0 Z'))]] }
  );

  /* ================= Nature Art ================= */
  const stoneD = 'M28 110 a72 52 0 1 0 144 0 a72 52 0 1 0 -144 0 Z';
  const lbBody = 'M60 66.8 Q44 110 60 153.2 A72 52 0 1 0 60 66.8 Z';
  const lbHead = 'M60 66.8 Q44 110 60 153.2 A72 52 0 0 1 60 66.8 Z';
  const lbSpots = ac(86, 86, 8) + ac(120, 80, 9) + ac(150, 93, 7) + ac(86, 134, 8) + ac(120, 140, 9) + ac(150, 127, 7);
  const owlBody = 'M100 182 C40 170 44 70 100 52 C156 70 160 170 100 182 Z';
  const raftX = [60, 76, 92, 108, 124, 140];
  const raftSticks = raftX.map(x => stick(x, 72, x, 168, 14)).join('');
  const ties = [[60, 90], [140, 90], [60, 150], [140, 150], [100, 90], [100, 150]].map(([x, y]) => stroke('#F4EBD0', wide(al(x - 6, y - 7, x + 6, y + 7) + al(x + 6, y - 7, x - 6, y + 7), 2.5))).join('');
  const pflower = (cx, cy, c, r = 9) => solid(c, around(5, r * 0.8, cx, cy, (x, y, a) => `<ellipse cx="${x}" cy="${y}" rx="${f1(r * 0.45)}" ry="${f1(r * 0.7)}" transform="rotate(${f1(a * 180 / Math.PI + 90)} ${x} ${y})"/>`)) + solid('#FFD84D', ac(cx, cy, f1(r * 0.35)));
  const cardFlowers = al(86, 92, 92, 150) + al(122, 106, 110, 150) + al(100, 128, 100, 150) + solid('#8FCB7A', ap(leafD(92, 140, 70, 122, 8)) + ap(leafD(108, 140, 128, 128, 7))) + pflower(86, 84, '#F78FB3', 13) + pflower(122, 98, '#B48CE0', 11) + pflower(100, 122, '#FFB347', 9);
  const card = sheet('50,24 150,24 150,184 50,184', '#FFFBEA') + al(50, 24, 50, 184);
  const mLeaf1 = around(8, 0, 100, 100, (x, y, a) => solid('#7CB65A', ap(leafD(f1(100 + 18 * Math.cos(a)), f1(100 + 18 * Math.sin(a)), f1(100 + 46 * Math.cos(a)), f1(100 + 46 * Math.sin(a)), 12))), 0);
  const mPeb1 = around(8, 34, 100, 100, (x, y) => solid('#B8B2A7', ac(x, y, 5)), Math.PI / 8);
  const mSticks = around(8, 0, 100, 100, (x, y, a) => stick(f1(100 + 50 * Math.cos(a)), f1(100 + 50 * Math.sin(a)), f1(100 + 74 * Math.cos(a)), f1(100 + 74 * Math.sin(a)), 5, '#8A5A33'), Math.PI / 8);
  const mLeaf2 = around(8, 0, 100, 100, (x, y, a, i) => solid(i % 2 ? '#E8574A' : '#F59E2E', ap(leafD(f1(100 + 54 * Math.cos(a)), f1(100 + 54 * Math.sin(a)), f1(100 + 82 * Math.cos(a)), f1(100 + 82 * Math.sin(a)), 18))), 0);
  const mPeb2 = around(24, 90, 100, 100, (x, y, a, i) => solid(i % 3 === 0 ? '#F9E79F' : '#CFC9BE', ac(x, y, 3.6)), Math.PI / 24);

  LESSONS.push(
    { id: 'a5-ladybug', cat: 'naturalart', level: 1, title: 'Ladybug stone', ico: '🐞',
      need: 'A smooth stone, red, black and white paint, a brush and newspaper', tip: 'Let each colour dry before you paint the next one.', steps: [
      ['Find a smooth, round stone. Wash it and let it dry.', T('#C9C3B8', ap(stoneD)) + ap(stoneD)],
      ['Paint most of the stone red. Leave one end for the head.', paint('#E8402F', ap(lbBody))],
      ['Paint the head black.', paint(DARK, ap(lbHead))],
      ['Paint a black line down the middle of the back.', fat(DARK, 'M52 110 H171', 4)],
      ['Dab black spots on both sides.', paint(DARK, lbSpots)],
      ['Dot on two white eyes. Put your ladybug in the garden!', paint('#fff', ac(40, 98, 5) + ac(40, 122, 5)) + paint(DARK, ac(38, 98, 2) + ac(38, 122, 2))]] },
    { id: 'a5-leafowl', cat: 'naturalart', level: 1, title: 'Leaf owl collage', ico: '🍃',
      need: 'Leaves and a stick from outside, paper, glue, bottle caps or buttons', tip: 'Press leaves flat in a book for a day first. They stick better!', steps: [
      ['Glue a big leaf in the middle of your paper for the body.', solid('#E59A3C', ap(owlBody)) + ap('M100 182 V130')],
      ['Glue two smaller leaves on the sides for wings.', solid('#C9772B', ap(leafD(70, 100, 38, 164, 16)) + ap(leafD(130, 100, 162, 164, 16)))],
      ['Glue on two big round eyes. Bottle caps or buttons work well!', solid('#fff', ac(82, 92, 15) + ac(118, 92, 15)) + paint(DARK, ac(82, 94, 6) + ac(118, 94, 6))],
      ['Glue a seed or a tiny leaf for the beak.', solid('#8B5A2B', ap(leafD(100, 104, 100, 126, 7)))],
      ['Glue two pointy leaves on top for ear tufts.', solid('#C9772B', ap(leafD(84, 64, 66, 30, 9)) + ap(leafD(116, 64, 134, 30, 9)))],
      ['Glue a stick under it for a branch, and draw feet. Hoo-hoo! Show someone.', stick(18, 186, 182, 186, 9) + ap('M90 178 l-4 12 M94 178 v12 M98 178 l4 12 M102 178 l-4 12 M106 178 v12 M110 178 l4 12')]] },
    { id: 'a5-raft', cat: 'naturalart', level: 2, title: 'Stick raft', ico: '🛶',
      need: 'Sticks, string, a bit of clay, a big leaf, and a grown-up to help tie', tip: 'Wrap the string round and round, then pull it tight before you knot.', steps: [
      ['Find 6 sticks about the same size. Lay them side by side, touching.', raftSticks],
      ['Lay 2 more sticks across them, one at the top and one at the bottom.', stick(44, 90, 156, 90, 10, '#8A5A33') + stick(44, 150, 156, 150, 10, '#8A5A33')],
      ['Tie string where the sticks cross. A grown-up can help with the knots.', ties],
      ['Push a lump of clay in the middle and stand a tall stick in it for a mast.', stick(100, 118, 100, 22, 6, '#8A5A33') + solid('#9DA7A0', ae(100, 120, 12, 7))],
      ['Poke a big leaf onto the mast for a sail.', solid('#6CC08B', ap('M104 28 Q156 52 104 104 Z')) + ap('M104 32 Q126 64 104 100')],
      ['Float it in a puddle or a tub of water. Does it sail? Blow on it!', T('#CFE6FA', ar(0, 0, 200, 200)) + ap('M10 186 q10 -7 20 0 t20 0 t20 0 M120 186 q10 -7 20 0 t20 0 t20 0') + ap('M8 120 q8 -6 16 0 t16 0 M164 64 q8 -6 16 0 t16 0 M166 128 q8 -6 16 0')]] },
    { id: 'a5-pressed', cat: 'naturalart', level: 2, title: 'Pressed flower card', ico: '🌸', single: true,
      need: 'Small flowers and leaves, a big heavy book, paper, card and glue', tip: 'Thin, flat flowers like pansies and daisies press best.', steps: [
      ['Pick a few small, flat flowers and leaves. Always ask before you pick!', pflower(50, 70, '#F78FB3', 18) + pflower(140, 60, '#B48CE0', 16) + pflower(95, 120, '#FFB347', 14) + solid('#8FCB7A', ap(leafD(40, 160, 80, 140, 12)) + ap(leafD(150, 160, 120, 130, 10)))],
      ['Lay them on paper inside a big book. Do not let them touch.', solid('#7FA8D8', ap('M10 48 L100 56 L190 48 L190 178 L100 186 L10 178 Z')) + solid('#FFFBEA', ap('M18 50 Q60 44 100 58 L100 176 Q60 162 18 170 Z') + ap('M182 50 Q140 44 100 58 L100 176 Q140 162 182 170 Z')) + pflower(128, 84, '#F78FB3', 12) + pflower(160, 110, '#B48CE0', 10) + pflower(130, 140, '#FFB347', 9)],
      ['Close the book. Put more heavy books on top and wait one whole week.', sheet('30,150 170,150 170,184 30,184', '#7FA8D8') + sheet('40,118 160,118 160,150 40,150', '#F2A07B') + sheet('36,90 164,90 164,118 36,118', '#9BD67E') + al(44, 134, 156, 134) + al(42, 104, 158, 104) + ink(100, 62, '7 days', 22) + ap('M60 70 q-14 0 -14 -12 M140 70 q14 0 14 -12')],
      ['Open the book. The flowers are flat and dry! Fold a card in half.', card + fold(apl('50,24 22,40 22,168 50,184'))],
      ['Glue the flowers on the front with tiny dots of glue.', card + cardFlowers],
      ['Write a message, like "For you", and give it to someone you love.', card + cardFlowers + ink(100, 174, 'For you', 18, '#C0392B')]] },
    { id: 'a5-mandala', cat: 'naturalart', level: 3, title: 'Leaf & stone mandala', ico: '🍂',
      need: 'Leaves, small stones, sticks and petals from outside', tip: 'Make every ring the same all the way round. That is what a mandala is!', steps: [
      ['Find a flat spot outside. Put one special stone in the middle.', solid('#9DA7A0', ae(100, 100, 13, 11))],
      ['Make a ring of green leaves around it, all pointing out.', mLeaf1],
      ['Put a little stone in each gap between the leaves.', mPeb1],
      ['Make a ring of sticks, like the spokes of a wheel.', mSticks],
      ['Put orange and red leaves in the spaces between the sticks.', mLeaf2],
      ['Finish with a big circle of small stones and petals all round the outside.', mPeb2],
      ['Take a photo before the wind blows it away! Make a new one tomorrow.', ap('M6 26 V6 H26 M174 6 H194 V26 M194 174 V194 H174 M26 194 H6 V174')]] }
  );

  /* ================= Weaving & String Art ================= */
  const dia = r => apg(`100,${100 - r} ${100 + r},100 100,${100 + r} ${100 - r},100`);
  const yarnBand = (c, r0, r1) => { let s = ''; for (let r = r0; r <= r1; r += 4) s += dia(r); return stroke(c, wide(s, 4.6)); };
  const tassel = (x, y, dx, dy, c) => stroke(c, wide([-0.45, -0.15, 0.15, 0.45].map(k => al(x, y, f1(x + dx * 16 - dy * 16 * k), f1(y + dy * 16 + dx * 16 * k))).join(''), 2.5));
  // paper weaving
  const wvBase = '#7FB5F0', wvCols = ['#FFD24D', '#F78FB3', '#FFD24D', '#F78FB3', '#FFD24D'];
  const wvSlits = [50, 70, 90, 110, 130, 150].map(x => al(x, 44, x, 156)).join('');
  const wvStrip = j => { const y = 47 + j * 22; let s = solid(wvCols[j], ar(38, y, 124, 18)), under = '';
    for (let c = 0; c < 5; c++) if ((c + j) % 2 === 0) under += ar(50 + 20 * c, y - 2, 20, 22);
    return s + paint(wvBase, under) + [50, 70, 90, 110, 130, 150].map(x => al(x, y - 2, x, y + 20)).join(''); };
  // lacing card
  const bez = (p0, p1, p2, p3, t) => { const u = 1 - t; return [0, 1].map(k => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]); };
  const appleSegs = [[[100, 62], [80, 44], [36, 52], [38, 100]], [[38, 100], [40, 150], [78, 178], [100, 164]], [[100, 164], [122, 178], [160, 150], [162, 100]], [[162, 100], [164, 52], [120, 44], [100, 62]]];
  const appleD = 'M100 62 C80 44 36 52 38 100 C40 150 78 178 100 164 C122 178 160 150 162 100 C164 52 120 44 100 62 Z';
  const holes = [];
  appleSegs.forEach(sg => [0.2, 0.5, 0.8].forEach(t => { const [x, y] = bez(...sg, t), dx = 100 - x, dy = 112 - y, L = Math.hypot(dx, dy); holes.push([f1(x + dx / L * 11), f1(y + dy / L * 11)]); }));
  const holeSVG = solid('#FFFFFF', holes.map(([x, y]) => ac(x, y, 3.5)).join(''));
  const stitches = (start, c) => fat(c, holes.map((h, i) => (i % 2 === start ? `M${h[0]} ${h[1]} L${holes[(i + 1) % holes.length][0]} ${holes[(i + 1) % holes.length][1]}` : '')).join(' '), 4.5);
  // string art star
  const ssOuter = Array.from({ length: 5 }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return [f1(100 + 72 * Math.cos(a)), f1(106 + 72 * Math.sin(a))]; });
  const ssInner = Array.from({ length: 5 }, (_, i) => { const a = -Math.PI / 2 + Math.PI / 5 + i * 2 * Math.PI / 5; return [f1(100 + 29 * Math.cos(a)), f1(106 + 29 * Math.sin(a))]; });
  const ssStar = ssOuter.map((p, i) => `${p} ${ssInner[i]}`).join(' ');
  const ssLines = (pairs, c) => stroke(c, wide(pairs.map(([p, q]) => al(p[0], p[1], q[0], q[1])).join(''), 1.8));
  // cardboard loom
  const lmX = Array.from({ length: 9 }, (_, k) => 52 + 12 * k);
  const lmRows = (from, to, c) => { let s = ''; for (let r = from; r <= to; r++) { const y = 172 - r * 7; s += fat(c, `M46 ${y} H154`, 6.5) + stroke('#6B4E3A', wide(lmX.filter((x, k) => (k + r) % 2 === 0).map(x => al(x, y - 3.5, x, y + 3.5)).join(''), 2)); } return s; };

  LESSONS.push(
    { id: 'a5-godseye', cat: 'string', level: 1, title: "God's eye weaving", ico: '🧶',
      need: 'Two sticks (or lolly sticks), yarn in 3 colours, scissors and a grown-up', tip: 'Keep the yarn snug, not too tight, and the rings stay neat.', steps: [
      ['Cross two sticks to make a plus sign. A grown-up can help hold them.', stick(100, 14, 100, 186, 8) + stick(14, 100, 186, 100, 8)],
      ['Tie yarn round the middle in an X shape, so the sticks hold together.', stroke('#E8574A', wide(al(92, 92, 108, 108) + al(108, 92, 92, 108), 3.5))],
      ['Wrap the yarn over a stick and round it, then go to the next stick. Round and round!', yarnBand('#E8574A', 8, 32)],
      ['Tie on a new colour and keep wrapping.', yarnBand('#FFC23D', 36, 56)],
      ['Add one more colour.', yarnBand('#3D7DD8', 60, 76)],
      ['Tie a knot. Add tassels to the tips and hang it on your wall!', tassel(14, 100, -1, 0, '#E8574A') + tassel(186, 100, 1, 0, '#E8574A') + tassel(100, 186, 0, 1, '#3D7DD8') + stroke('#3D7DD8', ap('M100 14 Q86 2 100 2 Q114 2 100 14'))]] },
    { id: 'a5-weave', cat: 'string', level: 1, title: 'Paper weaving mat', ico: '🟦',
      need: 'Two colours of paper, a ruler, glue, and a grown-up with scissors', tip: 'Over, under, over, under. Say it out loud as you go!', steps: [
      ['A grown-up cuts lines down a sheet of paper. Not all the way to the edge!', solid(wvBase, ar(30, 30, 140, 140, 4)) + wvSlits],
      ['Weave a paper strip across: over, under, over, under.', wvStrip(0)],
      ['Weave the next strip the other way: under, over, under, over.', wvStrip(1)],
      ['Weave one more strip, just like the first one.', wvStrip(2)],
      ['Keep going until the paper is full. Push the strips close together.', wvStrip(3) + wvStrip(4)],
      ['Glue down the ends of each strip. Use it as a placemat at dinner!', paint('#FFFFFF', [0, 1, 2, 3, 4].map(j => ac(43, 56 + j * 22, 2.5) + ac(157, 56 + j * 22, 2.5)).join(''))]] },
    { id: 'a5-lacing', cat: 'string', level: 2, title: 'Apple lacing card', ico: '🍎',
      need: 'Cardboard, a hole punch, yarn, sticky tape, crayons; a grown-up to cut', tip: 'Wrap tape round the yarn end to make a stiff needle. Easy to poke!', steps: [
      ['Draw a big apple on a piece of cardboard, like a cereal box.', ap(appleD)],
      ['A grown-up cuts it out and punches holes all the way round.', holeSVG],
      ['Wrap tape round one end of the yarn. Tie the other end to the top hole.', solid('#7A3FB0', ac(holes[11][0] - 2, holes[11][1] - 6, 4))],
      ['Sew in and out: up through one hole, down through the next one.', stitches(1, '#7A3FB0')],
      ['Go round again with a new colour to fill in the gaps.', stitches(0, '#3BAA5C')],
      ['Tie a bow. Add a stem and a leaf, then colour your apple red!', T('#F47A6A', ap(appleD)) + stick(100, 62, 106, 34, 6, '#8A5A33') + solid('#6CC08B', ap(leafD(106, 44, 140, 30, 9)))]] },
    { id: 'a5-stringstar', cat: 'string', level: 2, title: 'String art star', ico: '⭐',
      need: 'A cork board, paper, pins, string; a grown-up pushes the pins in', tip: 'Keep the string pulled tight as you wrap, and the lines stay straight.', steps: [
      ['Put a paper star on a cork board.', solid('#E8C08A', ar(12, 12, 176, 176, 8)) + guide(apg(ssStar))],
      ['A grown-up pushes a pin into every point and every corner of the star.', solid(DARK, [...ssOuter, ...ssInner].map(([x, y]) => ac(x, y, 3)).join(''))],
      ['Tie string to the top pin. Wrap it round the outside, pin to pin.', stroke('#E8402F', wide(apg(ssStar), 2.2))],
      ['Now cross over: go from one big point to another, skipping one each time.', ssLines([0, 1, 2, 3, 4].map(i => [ssOuter[i], ssOuter[(i + 2) % 5]]), '#F59E2E')],
      ['Zigzag from each inside pin across to the far points, lots of times.', ssLines(ssInner.flatMap((p, i) => [[p, ssOuter[(i + 3) % 5]], [p, ssOuter[(i + 4) % 5]]]), '#3D7DD8')],
      ['Tie a knot and tear the paper away. Hang your star up!', stroke('#E8402F', ap('M80 12 Q100 -6 120 12')), { clear: true }]] },
    { id: 'a5-loom', cat: 'string', level: 3, title: 'Cardboard loom', ico: '🪢',
      need: 'Strong cardboard, string, yarn in 4 colours, a fork; a grown-up to cut', tip: 'Do not pull the yarn tight at the sides, or your weaving gets thin in the middle.', steps: [
      ['A grown-up cuts little notches along the top and bottom of the cardboard.', T('#D8B07A', ar(40, 20, 120, 166, 4)) + ap('M40 24 Q40 20 44 20' + lmX.map(x => ` L${x - 3} 20 L${x} 26 L${x + 3} 20`).join('') + ' L156 20 Q160 20 160 24 L160 182 Q160 186 156 186' + lmX.slice().reverse().map(x => ` L${x + 3} 186 L${x} 180 L${x - 3} 186`).join('') + ' L44 186 Q40 186 40 182 Z')],
      ['Wrap string up and down through the notches, like the strings of a harp.', stroke('#6B4E3A', wide(lmX.map(x => al(x, 26, x, 180)).join(''), 2))],
      ['Weave yarn across: over one string, under the next. Push it down to the bottom.', lmRows(0, 0, '#E8574A')],
      ['Come back the other way: under, then over. Weave lots more rows!', lmRows(1, 4, '#E8574A')],
      ['Tie on a new colour and keep weaving. A fork helps push the rows down.', lmRows(5, 9, '#FFC23D')],
      ['Add a third colour.', lmRows(10, 14, '#3BAA5C')],
      ['Weave to the top with one more colour. A grown-up helps tie it off. Hang it up!', lmRows(15, 20, '#9B59D0')]] }
  );

  /* ================= Shadows & Silhouettes ================= */
  const ssTree = paint(DARK, ap('M42 158 L48 104 L44 84 L52 84 L54 100 L58 84 L64 86 L58 108 L60 158 Z') + ac(52, 70, 18) + ac(34, 82, 13) + ac(70, 80, 14) + ac(40, 60, 11) + ac(64, 58, 12)) + fat(DARK, 'M50 116 L30 96 M57 112 L76 92', 4);
  const birdsM = (pts, c = DARK) => stroke(c, pts.map(([x, y, s]) => ap(`M${x - s} ${y} q${s / 2} ${-s / 1.5} ${s} 0 q${s / 2} ${-s / 1.5} ${s} 0`)).join(''));
  // shadow puppets
  const spot = 'M10 90 a90 64 0 1 0 180 0 a90 64 0 1 0 -180 0 Z';
  const bunny = ae(56, 112, 19, 14) + '<ellipse cx="46" cy="82" rx="5.5" ry="18" transform="rotate(-14 46 82)"/>' + '<ellipse cx="60" cy="80" rx="5.5" ry="18" transform="rotate(12 60 80)"/>' + ap('M46 120 L36 200 L72 200 L66 120 Z');
  const bird = ap('M100 60 Q84 30 56 36 Q72 44 76 52 Q64 52 58 58 Q80 62 94 68 Z M110 60 Q126 30 154 36 Q138 44 134 52 Q146 52 152 58 Q130 62 116 68 Z') + ae(105, 64, 10, 7) + ac(105, 54, 6) + apg('105,50 112,46 109,54');
  const dog = ap('M182 74 Q166 62 150 70 L126 78 Q108 82 104 90 L106 96 Q112 100 126 98 L146 98 L118 108 Q112 112 118 116 L148 114 Q160 124 158 146 L156 200 L200 200 L200 104 Q198 84 182 74 Z M156 72 L158 44 L176 70 Z');
  // skyline
  const blds = [[0, 30, 110], [30, 28, 80], [58, 36, 120], [94, 26, 60], [120, 34, 100], [154, 22, 132], [176, 24, 92]];
  let wins = '';
  blds.forEach(([x, w, top], b) => { for (let y = top + 8; y < 192; y += 12) for (let xx = x + 5, c = 0; xx + 5 <= x + w - 3; xx += 9, c++) if ((b * 7 + c * 3 + y) % 5 < 2) wins += ar(xx, y, 5, 6); });
  const nightStars = [[20, 24], [60, 14], [92, 34], [120, 12], [30, 60], [186, 70], [140, 50], [76, 60]].map(([x, y], i) => apg(starPts(x, y, i % 2 ? 3 : 4.5, i % 2 ? 1.2 : 1.8, 4))).join('');
  // black cat
  const bat = (cx, cy, s) => ap(`M${cx} ${cy} q${-4 * s} ${-6 * s} ${-12 * s} ${-4 * s} q${3 * s} ${2 * s} ${2 * s} ${5 * s} q${3 * s} ${-2 * s} ${5 * s} ${1 * s} q${1 * s} ${-3 * s} ${5 * s} ${-2 * s} q${4 * s} ${-1 * s} ${5 * s} ${2 * s} q${2 * s} ${-3 * s} ${5 * s} ${-1 * s} q${-1 * s} ${-3 * s} ${2 * s} ${-5 * s} q${-8 * s} ${-2 * s} ${-12 * s} ${4 * s} Z`);
  // toy shadows
  const rocket = 'M100 60 Q116 78 116 105 L116 145 L128 165 L116 160 L84 160 L72 165 L84 145 L84 105 Q84 78 100 60 Z';
  const sh1 = 'matrix(1 0 0.75 0.5 -123.75 82.5)', sh2 = 'matrix(1 0 -0.6 0.45 99 90.75)';
  const shDefs = `<defs><clipPath id="a5s-notoy"><path d="M0 0H200V200H0Z ${rocket}" clip-rule="evenodd"/></clipPath><clipPath id="a5s-sh1"><path d="${rocket}" transform="${sh1}"/></clipPath><clipPath id="a5s-sh2"><path d="${rocket}" transform="${sh2}"/></clipPath></defs>`;
  let shStripes = '', shDots = '';
  for (let k = -60; k < 140; k += 6) shStripes += al(k, 170, k + 60, 100);
  for (let y = 116; y < 172; y += 6) for (let x = 100 + (y % 12 ? 3 : 0); x < 176; x += 6) shDots += ac(x, y, 1.5);
  const sunIcon = (x, y, c) => solid(c, ac(x, y, 8)) + stroke('#F59E2E', around(8, 0, x, y, (px, py, a) => al(f1(x + 11 * Math.cos(a)), f1(y + 11 * Math.sin(a)), f1(x + 16 * Math.cos(a)), f1(y + 16 * Math.sin(a)))));

  LESSONS.push(
    { id: 'a5-sunset', cat: 'silhouette', level: 1, title: 'Sunset tree', ico: '🌅',
      need: 'Paper, crayons or paint, and a black crayon or marker', tip: 'A silhouette is a shape filled all in black, with no details inside.', steps: [
      ['Colour stripes across the sky: purple at the top, then pink, orange and yellow.', paint('#8E6CC8', ar(0, 0, 200, 50)) + paint('#F28DB2', ar(0, 50, 200, 40)) + paint('#F8A04C', ar(0, 90, 200, 40)) + paint('#FFD966', ar(0, 130, 200, 40))],
      ['Draw a big sun, low down near the bottom.', paint('#FFF4B8', ac(132, 150, 30))],
      ['Colour a black hill all along the bottom.', paint(DARK, ap('M0 160 Q60 142 110 152 Q160 162 200 150 V200 H0 Z'))],
      ['Draw a black tree trunk with branches on the hill.', paint(DARK, ap('M42 158 L48 104 L44 84 L52 84 L54 100 L58 84 L64 86 L58 108 L60 158 Z')) + fat(DARK, 'M50 116 L30 96 M57 112 L76 92', 4)],
      ['Add big round puffs of leaves. Fill them all in black.', paint(DARK, ac(52, 70, 18) + ac(34, 82, 13) + ac(70, 80, 14) + ac(40, 60, 11) + ac(64, 58, 12) + ac(28, 94, 7) + ac(78, 90, 7))],
      ['Draw some birds: little black m shapes. Show someone your sunset!', birdsM([[150, 60, 8], [172, 76, 6], [134, 82, 5]])]] },
    { id: 'a5-puppets', cat: 'silhouette', level: 1, title: 'Hand shadow puppets', ico: '🐰',
      need: 'A torch (flashlight), a dark room, a plain wall, and your hands', tip: 'Move your hand closer to the torch to make a giant shadow!', steps: [
      ['In a dark room, shine a torch at a wall. A grown-up can help.', paint('#3A3F5C', ar(0, 0, 200, 200)) + paint('#FFF3B0', ap(spot)) + stroke('#FFF3B0', wide(al(90, 162, 22, 120) + al(110, 162, 178, 120), 1.5)) + solid('#E8574A', ar(91, 170, 18, 28, 3)) + solid('#C9D3E0', apg('84,160 116,160 110,170 90,170')) + clipDef('a5p-spot', spot)],
      ['Bunny: hold up two fingers in a V shape. Wiggle the ears!', inClip(['a5p-spot'], paint(DARK, bunny)) + paint('#FFF3B0', ac(64, 108, 2))],
      ['Bird: cross your thumbs and flap your fingers like wings.', paint(DARK, bird)],
      ['Dog: thumb up for an ear, and move your little finger to open the mouth.', inClip(['a5p-spot'], paint(DARK, `<g transform="translate(-10 16)">${dog}</g>`)) + paint('#FFF3B0', ac(132, 98, 3))],
      ['Put on a shadow show! Make up a story for your animals.', paint('#FFF3B0', ap('M30 30 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z M172 34 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z'))]] },
    { id: 'a5-skyline', cat: 'silhouette', level: 2, title: 'City at night', ico: '🌃',
      need: 'Dark blue or black paper (or crayons), a black marker, yellow crayon', tip: 'Make the buildings different heights. That is what makes a skyline!', steps: [
      ['Colour the whole sky dark blue. Or use dark paper!', paint('#26305E', ar(0, 0, 200, 200))],
      ['Draw a round moon high up in the corner.', paint('#FFF1B8', ac(160, 36, 16)) + paint('#F2E3A0', ac(154, 32, 3) + ac(166, 42, 2.5))],
      ['Add twinkly stars.', paint('#FFE58A', nightStars)],
      ['Draw buildings side by side along the bottom, tall and short. Colour them black.', paint(DARK, blds.map(([x, w, t]) => ar(x, t, w, 200 - t)).join(''))],
      ['Add yellow windows. Some lights are on and some are off.', paint('#FFD84D', wins)],
      ['Add a tall tower with a red light on top. Who lives in your city?', paint(DARK, apg('97,60 107,30 117,60') + ar(105, 12, 4, 20)) + paint('#FF4D4D', ac(107, 11, 3.5)) + stroke('#FF4D4D', wide(ac(107, 11, 7), 1.2))]] },
    { id: 'a5-blackcat', cat: 'silhouette', level: 2, title: 'Black cat moon', ico: '🐈‍⬛',
      need: 'Paper, a purple crayon, a yellow crayon and a black marker or paint', tip: 'Turn the light off and look out the window. What shapes can you see?', steps: [
      ['Colour the whole sky dark purple.', paint('#4B3B7A', ar(0, 0, 200, 200))],
      ['Draw a giant round moon in the middle.', paint('#FFE9A0', ac(100, 100, 70)) + paint('#F3D987', ac(72, 78, 8) + ac(130, 70, 5) + ac(140, 124, 6))],
      ['Colour a black rooftop along the bottom, with a chimney.', paint(DARK, ap('M0 180 L60 166 L140 166 L200 180 V200 H0 Z') + ar(156, 140, 18, 32))],
      ['Draw a cat sitting on the roof: a round head, pointy ears and an oval body. Fill it in black.', paint(DARK, ac(100, 104, 15) + apg('87,99 88,80 98,92') + apg('113,99 112,80 102,92') + ae(100, 140, 22, 27))],
      ['Give the cat a long curly tail.', fat(DARK, 'M118 158 Q148 162 146 136 Q144 124 154 120', 7)],
      ['Add bats and stars. Spooky and cute! Show someone.', paint(DARK, bat(34, 40, 1.4) + bat(170, 30, 1.1) + bat(160, 64, 0.8)) + paint('#FFE58A', apg(starPts(26, 120, 5, 2, 4)) + apg(starPts(180, 110, 5, 2, 4)) + apg(starPts(60, 20, 4, 1.6, 4)))]] },
    { id: 'a5-shadowtrace', cat: 'silhouette', level: 3, title: 'Trace toy shadows', ico: '🔦',
      need: 'A sunny day, paper, a small toy, a pencil and two colour pens', tip: 'Shadows are long in the morning and evening, and short at lunchtime.', steps: [
      ['On a sunny morning, put paper on the ground outside. Stand a toy on it.', T('#BFE3A5', ar(0, 0, 200, 200)) + solid('#FFFFFF', ar(8, 40, 184, 146, 4)) + solid('#F47A6A', ap(rocket)) + solid('#BFE3F7', ac(100, 98, 7)) + shDefs],
      ['See the toy\'s shadow? Trace all round it with a pencil.', inClip(['a5s-notoy'], `<path d="${rocket}" transform="${sh1}"/>`)],
      ['Come back after lunch. The shadow has moved! Trace it again with a new colour.', inClip(['a5s-notoy'], stroke('#3D7DD8', `<path d="${rocket}" transform="${sh2}"/>`))],
      ['Fill the morning shadow with stripes.', inClip(['a5s-notoy', 'a5s-sh1'], wide(shStripes, 1.6))],
      ['Fill the afternoon shadow with dots.', inClip(['a5s-notoy', 'a5s-sh2'], paint('#3D7DD8', shDots))],
      ['The sun was on the other side of the toy. Draw a sun for each shadow and show someone!', sunIcon(170, 66, '#FFE58A') + sunIcon(30, 66, '#FFC23D')]] }
  );
});
