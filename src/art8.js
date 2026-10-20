/* ---------- art8: art around the world, masks & puppets, cards & gifts, mixed media, chalk & pastels, mosaic & stained glass ---------- */
// Uses the helpers from art.js (ac, ae, al, ap, ar, apg, apl, guide, fold, stroke, paint, atext).
// Wrapped in an IIFE so the little helpers below never clash with other files.
(() => {
  const f1 = n => +n.toFixed(1);
  // Colour that soaks in like a marker: lines underneath stay visible. ev = holes via even-odd.
  const T = (c, s, ev) => `<g class="pt" style="fill:${c};mix-blend-mode:multiply${ev ? ';fill-rule:evenodd' : ''}">${s}</g>`;
  // Solid colour with holes (even-odd), no blending.
  const pev = (c, d) => `<g class="pt" style="fill:${c};fill-rule:evenodd"><path d="${d}"/></g>`;
  // A thick coloured stroke (yarn, chalk, a fat marker line).
  const fat = (c, d, w) => `<g class="sk" style="--sk:${c}"><path d="${d}" style="stroke-width:${w}"/></g>`;
  // Make every line in a fragment a set width.
  const wide = (s, w) => s.replace(/\/>/g, ` style="stroke-width:${w}"/>`);
  // A real object (paper, button, felt): solid colour with an outline on top.
  const solid = (c, s) => paint(c, s) + s;
  const ink = (x, y, t, size, c = '#22305A') => paint(c, atext(x, y, t, size));
  const chalk = (c, s, w = 4) => stroke(c, wide(s, w));
  const ell = (x, y, rx, ry, deg = 0) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"${deg ? ` transform="rotate(${deg} ${x} ${y})"` : ''}/>`;
  const circ = (cx, cy, r) => `M${f1(cx - r)} ${cy} a${r} ${r} 0 1 0 ${f1(2 * r)} 0 a${r} ${r} 0 1 0 ${f1(-2 * r)} 0 Z`;
  const around = (n, R, cx, cy, f, a0 = -Math.PI / 2) => Array.from({ length: n }, (_, i) => { const a = a0 + i * 2 * Math.PI / n; return f(f1(cx + R * Math.cos(a)), f1(cy + R * Math.sin(a)), a, i); }).join('');
  const deg = a => f1(a * 180 / Math.PI);
  const starPts = (cx, cy, R, r, n = 5, rot = 0) => Array.from({ length: n * 2 }, (_, i) => {
    const a = (i * 180 / n - 90 + rot) * Math.PI / 180, d = i % 2 ? r : R;
    return `${f1(cx + d * Math.cos(a))},${f1(cy + d * Math.sin(a))}`;
  }).join(' ');
  const star = (cx, cy, R) => apg(starPts(cx, cy, R, R * 0.45));
  const heartD = (cx, cy, s) => `M${cx} ${f1(cy + s * 0.9)} C${f1(cx - s * 1.4)} ${f1(cy)} ${f1(cx - s * 0.9)} ${f1(cy - s * 1.1)} ${cx} ${f1(cy - s * 0.4)} C${f1(cx + s * 0.9)} ${f1(cy - s * 1.1)} ${f1(cx + s * 1.4)} ${f1(cy)} ${cx} ${f1(cy + s * 0.9)} Z`;
  const leafD = (bx, by, tx, ty, w) => {
    const mx = (bx + tx) / 2, my = (by + ty) / 2, L = Math.hypot(tx - bx, ty - by), nx = -(ty - by) / L * w, ny = (tx - bx) / L * w;
    return `M${bx} ${by} Q${f1(mx + nx)} ${f1(my + ny)} ${tx} ${ty} Q${f1(mx - nx)} ${f1(my - ny)} ${bx} ${by} Z`;
  };
  // A stick: a rounded strip from one point to another.
  const cap = (x1, y1, x2, y2, w) => {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L * w / 2, ny = dx / L * w / 2, r = w / 2;
    return ap(`M${f1(x1 + nx)} ${f1(y1 + ny)} L${f1(x2 + nx)} ${f1(y2 + ny)} A${r} ${r} 0 0 0 ${f1(x2 - nx)} ${f1(y2 - ny)} L${f1(x1 - nx)} ${f1(y1 - ny)} A${r} ${r} 0 0 0 ${f1(x1 + nx)} ${f1(y1 + ny)} Z`);
  };
  const clipDef = (id, d) => `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs>`;
  const inClip = (ids, s) => ids.reduceRight((acc, id) => `<g clip-path="url(#${id})">${acc}</g>`, s);
  const mirror = s => `<g transform="matrix(-1 0 0 1 200 0)">${s}</g>`;
  const blurDef = (id, sd) => `<defs><filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter></defs>`;
  const blurred = (id, s, style = '') => `<g filter="url(#${id})"${style ? ` style="${style}"` : ''}>${s}</g>`;
  // Seeded random so pictures look the same every time.
  const rng = seed => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const blob = (cx, cy, r, seed, n = 9, sx = 1, sy = 1) => { const q = rng(seed); return apg(Array.from({ length: n }, (_, i) => { const a = i * 2 * Math.PI / n + q() * 0.3, d = r * (0.78 + q() * 0.3); return `${f1(cx + d * Math.cos(a) * sx)},${f1(cy + d * Math.sin(a) * sy)}`; }).join(' ')); };
  // Origami-style: a sheet of paper, and a coral arrow showing which way to fold.
  const sheet = (pts, c = '#FFFFFF') => paint(c, apg(pts)) + apg(pts);
  const arrow = (x1, y1, x2, y2, b = 0.3) => {
    const dx = x2 - x1, dy = y2 - y1, cx = (x1 + x2) / 2 - dy * b, cy = (y1 + y2) / 2 + dx * b;
    const tx = x2 - cx, ty = y2 - cy, L = Math.hypot(tx, ty), ux = tx / L, uy = ty / L, h = 8;
    return stroke('#F2604F', ap(`M${x1} ${y1} Q${f1(cx)} ${f1(cy)} ${x2} ${y2}`) +
      apl(`${f1(x2 - ux * h - uy * h * 0.6)},${f1(y2 - uy * h + ux * h * 0.6)} ${x2},${y2} ${f1(x2 - ux * h + uy * h * 0.6)},${f1(y2 - uy * h - ux * h * 0.6)}`));
  };
  const DARK = '#2B2B3A';
  // A button with two holes.
  const btn = (x, y, r, c) => paint(c, ac(x, y, r)) + wide(ac(x, y, r), 1.5) + paint(DARK, ac(f1(x - r * 0.32), y, f1(Math.max(0.9, r * 0.15))) + ac(f1(x + r * 0.32), y, f1(Math.max(0.9, r * 0.15))));

  ART_CATS.push(
    { id: 'world', name: 'Art Around the World', ico: '🌍', blurb: 'Paper flags, rangoli, paper-cuts, fish kites and weaving' },
    { id: 'masks', name: 'Masks & Puppets', ico: '🎭', blurb: 'Make a mask, a sock puppet and a puppet theatre' },
    { id: 'cards', name: 'Cards & Gifts', ico: '🎁', blurb: 'Cards, bookmarks, frames, wrapping paper and a mini book' },
    { id: 'mixed', name: 'Mixed Media', ico: '🧩', blurb: 'Mix crayon, paint, tissue, yarn and magazines' },
    { id: 'chalk', name: 'Chalk & Pastels', ico: '🖍️', blurb: 'Sidewalk chalk, smudgy sunsets and soft pastels' },
    { id: 'mosaic', name: 'Mosaic & Stained Glass', ico: '🪟', blurb: 'Pictures from little pieces and see-through colour' }
  );

  /* ================= Art Around the World ================= */
  // Papel picado (Mexico)
  const PP = [[41, '#F78FB3'], [100, '#FFB347'], [159, '#7CCF6B']];
  const flagD = cx => { let d = `M${cx - 25} 36 H${cx + 25} V112`; for (let i = 1; i <= 10; i++) d += ` L${cx + 25 - i * 5} ${i % 2 ? 120 : 112}`; return d + ' Z'; };
  const hole = s => paint('#FFFFFF', s) + s;
  const ppFlags = PP.map(([cx, c]) => T(c, ap(flagD(cx))) + ap(flagD(cx)) + fold(al(cx - 25, 41, cx + 25, 41))).join('');
  const ppDiam = PP.map(([cx]) => hole(apg(`${cx},52 ${cx + 8},63 ${cx},74 ${cx - 8},63`))).join('');
  const ppDots = PP.map(([cx]) => hole(ac(cx - 14, 86, 5) + ac(cx, 92, 5) + ac(cx + 14, 86, 5))).join('');
  const ppTri = PP.map(([cx]) => hole(apg(`${cx - 18},46 ${cx - 10},46 ${cx - 14},53`) + apg(`${cx + 10},46 ${cx + 18},46 ${cx + 14},53`) + apg(`${cx - 4},102 ${cx + 4},102 ${cx},108`))).join('');

  // Rangoli (India)
  const rgPetals = around(8, 34, 100, 100, (x, y, a) => ell(x, y, 9, 16, deg(a) + 90));
  const rgLeaves = around(8, 0, 100, 100, (x, y, a) => ap(leafD(f1(100 + 60 * Math.cos(a)), f1(100 + 60 * Math.sin(a)), f1(100 + 90 * Math.cos(a)), f1(100 + 90 * Math.sin(a)), 11)));
  const rgDots = around(8, 76, 100, 100, (x, y) => ac(x, y, 4), -Math.PI / 2 + Math.PI / 8) + around(8, 52, 100, 100, (x, y) => ac(x, y, 2.5), -Math.PI / 2 + Math.PI / 8);

  // Chinese paper-cut: the right half, mirrored to make the whole.
  const pcHeart = heartD(100, 104, 62);
  const pcHolesR = apg('100,90 112,104 100,118') + ac(130, 86, 9) + ell(127, 128, 5, 10, -35) + apg('100,130 106,138 100,146') + ell(114, 70, 3.5, 6, 30);
  const pcClip = clipDef('a8pc-r', 'M100 0 H200 V200 H100 Z');
  const pcHalf = (c = '#E23B3B') => pcClip + inClip(['a8pc-r'], solid(c, ap(pcHeart))) + al(100, 79, 100, 160);
  const pcHole = (c, s) => paint(c, s) + wide(s, 2);

  // Koinobori (Japan)
  const koBody = 'M40 64 C90 58 130 62 150 72 L184 56 L168 100 L184 144 L150 128 C130 138 90 142 40 136';
  const koScales = (() => { let s = ''; [[80, 98], [92, 92], [104, 98], [116, 92]].forEach(([y, x0]) => { for (let x = x0; x <= 140; x += 12) s += ap(`M${x} ${y} a6 6 0 0 0 12 0`); }); return s; })();

  // Kente-style paper weaving (Ghana)
  const KR = [36, 58, 80, 102, 124, 146], KC = ['#D9342B', '#2E8B4E', DARK, '#D9342B', '#2E8B4E', DARK];
  const kStrip = r => {
    const y = KR[r], c = KC[r]; let s = '';
    for (let k = 0; k < 8; k++) { if ((k + r) % 2) continue; let x = 20 + k * 20, w = 20; if (k === 0) { x = 12; w = 28; } if (k === 7) w = 28; s += solid(c, ar(x, y, w, 18)); }
    return s + (r % 2 ? solid(c, ar(12, y, 8, 18)) : solid(c, ar(180, y, 8, 18)));
  };
  const kPattern = (() => {
    let s = '';
    KR.forEach((y, r) => { for (let k = 0; k < 8; k++) { if ((k + r) % 2) continue; const x = 20 + k * 20;
      if (KC[r] === DARK) s += al(x + 5, y + 5, x + 15, y + 5) + al(x + 5, y + 9, x + 15, y + 9) + al(x + 5, y + 13, x + 15, y + 13);
      else if (KC[r] === '#2E8B4E') s += apg(`${x + 10},${y + 3} ${x + 16},${y + 9} ${x + 10},${y + 15} ${x + 4},${y + 9}`);
      else s += ac(x + 10, y + 9, 2.5); } });
    return stroke('#F2C230', wide(s, 2));
  })();

  LESSONS.push(
    { id: 'a8-papel', cat: 'world', level: 1, title: 'Papel picado flags (Mexico)', ico: '🎉',
      need: 'Tissue paper, safety scissors, string, glue stick and a grown-up', tip: 'Papel picado means "punched paper". People hang it for parties in Mexico.', steps: [
      ['Ask a grown-up to tie a string across, like a washing line.', al(6, 34, 194, 34) + ac(6, 34, 3) + ac(194, 34, 3)],
      ['Fold the tops of 3 tissue papers over the string and glue them: pink, orange and green.', ppFlags],
      ['Fold a flag in half. Snip a little triangle on the fold. Open it: a diamond!', ppDiam],
      ['Snip some half-circles on the fold. Open it: round holes!', ppDots],
      ['Snip tiny triangles near the top and the bottom. A grown-up can help.', ppTri],
      ['Hang your flags up for a party. ¡Fiesta! Make more in every colour.', paint('#F2604F', ac(30, 150, 3) + ac(130, 162, 3)) + paint('#3D7DD8', ac(70, 140, 3) + ac(170, 150, 3)) + paint('#FFC23D', ac(100, 170, 3) + ac(50, 175, 3) + ac(150, 185, 3))]] },
    { id: 'a8-rangoli', cat: 'world', level: 1, title: 'Rangoli flower (India)', ico: '🪔',
      need: 'Paper and crayons, or coloured chalk outside on the ground', tip: 'Rangoli is made in India for Diwali. Make every side match!', steps: [
      ['Put a dot in the middle. Draw a circle around it.', paint(DARK, ac(100, 100, 3)) + ac(100, 100, 16)],
      ['Draw 8 round petals all the way around the circle.', rgPetals],
      ['Draw a big circle around the petals.', ac(100, 100, 60)],
      ['Draw 8 pointy leaves on the outside of the big circle.', rgLeaves],
      ['Add dots between the leaves and between the petals.', rgDots],
      ['Fill it with bright colours, like coloured powder. Show your family!', T('#FFE58A', ac(100, 100, 60)) + T('#F78FB3', rgPetals) + T('#F59E2E', ac(100, 100, 16)) + T('#6EC6E8', rgLeaves) + paint('#9B59D0', rgDots)]] },
    { id: 'a8-papercut', cat: 'world', level: 2, title: 'Red paper-cut (China)', ico: '🧧', single: true,
      need: 'A square of red paper, a pencil, scissors and a grown-up', tip: 'In China, red paper-cuts are hung at New Year for good luck.', steps: [
      ['Take a square of red paper. Fold it in half, like closing a book.', sheet('30,30 170,30 170,170 30,170', '#E23B3B') + fold(al(100, 30, 100, 170)) + arrow(55, 70, 145, 70, -0.35)],
      ['Draw half a heart with a pencil. The middle of the heart sits on the fold.', sheet('100,30 170,30 170,170 100,170', '#E23B3B') + pcClip + inClip(['a8pc-r'], wide(ap(pcHeart), 2))],
      ['Draw little shapes inside: a half-diamond on the fold, a circle and a petal.', sheet('100,30 170,30 170,170 100,170', '#E23B3B') + pcClip + inClip(['a8pc-r'], wide(ap(pcHeart) + pcHolesR, 2))],
      ['Ask a grown-up to help you cut along all the lines.', pcHalf() + pcHole('#FFFFFF', pcHolesR)],
      ['Open it up! Both sides match. That is called symmetry.', pcHalf() + mirror(pcHalf()) + pcHole('#FFFFFF', pcHolesR + mirror(pcHolesR))],
      ['Stick it on a window. The light shines through the holes!', solid('#CFE8F7', ar(14, 14, 172, 172, 6)) + pcHalf() + mirror(pcHalf()) + pcHole('#CFE8F7', pcHolesR + mirror(pcHolesR))]] },
    { id: 'a8-koinobori', cat: 'world', level: 2, title: 'Koinobori fish kite (Japan)', ico: '🎏',
      need: 'Paper, crayons, a stick or straw, string and tape', tip: 'In Japan, families fly koinobori on Children\'s Day, the 5th of May.', steps: [
      ['Draw a long fish body with a pointy, split tail.', ap(koBody)],
      ['Draw a round mouth at the front, like a ring. The wind blows in here!', ell(40, 100, 10, 36)],
      ['Draw a big eye and a curved line behind it.', ac(70, 88, 12) + paint(DARK, ac(70, 88, 5)) + ap('M88 70 Q96 100 88 130')],
      ['Draw rows of scales, like little letter U shapes.', koScales],
      ['Draw stripes on the tail.', ap('M156 78 L176 66 M156 100 L170 100 M156 122 L176 134')],
      ['Tape it to a stick with a string, so it can fly in the wind.', solid('#A0703F', cap(12, 26, 12, 196, 7)) + solid('#FFC23D', ac(12, 20, 6)) + al(15, 34, 40, 64)],
      ['Colour it bright red or blue. Wave it and make it swim in the air!', T('#F2604F', ap(koBody + ' Z ' + circ(70, 88, 12)), true) + solid('#FFE58A', ell(40, 100, 10, 36))]] },
    { id: 'a8-kente', cat: 'world', level: 3, title: 'Kente-style weaving (Ghana)', ico: '🧵',
      need: 'Yellow paper, strips of red, green and black paper, scissors, glue', tip: 'Kente cloth is woven in Ghana in bright strips. Weavers make up patterns!', steps: [
      ['Take a yellow sheet of paper. Fold it in half.', solid('#F2C230', ar(20, 20, 160, 160)) + guide(al(20, 100, 180, 100))],
      ['Ask a grown-up to cut slits from the fold. Stop before the edge! Open it flat.', [40, 60, 80, 100, 120, 140, 160].map(x => al(x, 34, x, 166)).join(''), { clear: true }],
      ['Weave a red strip: over, under, over, under.', kStrip(0)],
      ['Weave a green strip the other way: under, over, under, over.', kStrip(1)],
      ['Keep going: black, red, green, black. Switch each time!', kStrip(2) + kStrip(3) + kStrip(4) + kStrip(5)],
      ['Draw little gold patterns on the squares: lines, diamonds and dots.', kPattern],
      ['Glue the ends down. Hang it up and tell someone about Ghana!', apl('20,20 100,4 180,20')]] }
  );

  /* ================= Masks & Puppets ================= */
  const mnMane = around(18, 0, 100, 100, (x, y, a, i) => solid(i % 2 ? '#F59E2E' : '#FFC23D', cap(f1(100 + 70 * Math.cos(a)), f1(100 + 70 * Math.sin(a)), f1(100 + 89 * Math.cos(a)), f1(100 + 89 * Math.sin(a)), 13)), -Math.PI / 2 + Math.PI / 18);

  const sockD = 'M96 196 L96 138 Q48 136 36 114 L90 92 L36 70 Q46 38 100 38 Q154 40 154 110 L154 196';

  const fpTube = cx => `M${cx - 18} 80 A18 5 0 0 1 ${cx + 18} 80 V166 A18 5 0 0 1 ${cx - 18} 166 Z`;
  const fpTubes = [48, 100, 152].map(cx => ell(cx, 80, 18, 5) + al(cx - 18, 80, cx - 18, 166) + al(cx + 18, 80, cx + 18, 166) + ap(`M${cx - 18} 166 A18 5 0 0 0 ${cx + 18} 166`)).join('');
  const fpBunnyEars = 'M38 75.8 Q28 30 42 32 Q49 36 46 75 M50 75 Q50 32 58 32 Q68 34 58 75.8';
  const fpBearEars = 'M84 77.7 A7 7 0 1 1 96 75.1 M104 75.1 A7 7 0 1 1 116 77.7';
  const fpFrogEyes = 'M136 77.7 A8 8 0 1 1 150 75 M154 75 A8 8 0 1 1 168 77.7';

  const thW = 'M44 50 H156 V136 H44 Z', thBox = 'M20 30 H180 V180 H20 Z';
  const thCurtL = 'M44 50 H66 Q60 76 68 92 Q54 100 54 136 H44 Z';
  const thVal = 'M44 50 H156 V56' + ' a7 7 0 0 1 -14 0'.repeat(8) + ' Z';
  const thGirl = ac(84, 84, 10) + apg('84,95 70,124 98,124');
  const thCat = ac(118, 98, 12) + apg('108,91 109,77 116,87') + apg('128,91 127,77 120,87');

  LESSONS.push(
    { id: 'a8-platemask', cat: 'masks', level: 1, title: 'Paper-plate lion mask', ico: '🦁',
      need: 'A paper plate, yellow and orange paper, a stick, glue, tape, crayons', tip: 'Try a tiger with stripes or a bear with round ears next!', steps: [
      ['Take a paper plate. That is the lion\'s face.', ac(100, 100, 60) + ac(100, 100, 48)],
      ['Ask a grown-up to cut two eye holes.', solid(DARK, ell(78, 90, 12, 9) + ell(122, 90, 12, 9))],
      ['Draw a big nose and a smiling mouth.', solid('#8B5E3C', apg('90,104 110,104 100,116')) + ap('M100 116 v7 M86 124 q14 12 28 0')],
      ['Glue strips of yellow and orange paper all around. That is the mane!', mnMane],
      ['Draw whiskers and little dots on the cheeks.', al(80, 120, 58, 114) + al(80, 124, 56, 124) + al(80, 128, 64, 130) + al(120, 120, 142, 114) + al(120, 124, 144, 124) + al(120, 128, 136, 130) + paint(DARK, ac(76, 112, 1.6) + ac(70, 116, 1.6) + ac(124, 112, 1.6) + ac(130, 116, 1.6))],
      ['Colour the face, tape a stick at the bottom, hold it up and ROAR!', T('#FFE08A', ac(100, 100, 60)) + solid('#A0703F', cap(100, 162, 100, 196, 8))]] },
    { id: 'a8-sock', cat: 'masks', level: 1, title: 'Sock puppet', ico: '🧦',
      need: 'An old clean sock, felt or paper, googly eyes, a pom-pom, glue', tip: 'Fingers go in the toe, your thumb in the heel. Now it can talk!', steps: [
      ['Put a sock on your hand. Push the toe in between your fingers and thumb to make a mouth.', paint('#8EC9F0', ap(sockD + ' Z')) + ap(sockD)],
      ['Glue red felt inside the mouth, and a pink tongue.', solid('#D9342B', apg('36,70 90,92 36,114')) + solid('#F78FB3', ell(56, 98, 9, 4.5))],
      ['Ask a grown-up to glue on two googly eyes.', solid('#FFFFFF', ac(100, 62, 10) + ac(124, 58, 10)) + paint(DARK, ac(103, 64, 4.5) + ac(127, 60, 4.5))],
      ['Glue a pom-pom on the end for a nose.', solid('#F59E2E', ac(56, 62, 7))],
      ['Glue on some yarn for curly hair.', fat('#9B59D0', 'M104 40 q-4 -14 6 -14 q8 2 2 10 M118 39 q-2 -16 9 -14 q7 4 0 10 M132 42 q2 -16 12 -12 q5 6 -3 10', 4)],
      ['Add felt spots. Give your puppet a name and a funny voice!', solid('#FFD84D', ac(130, 116, 6) + ac(140, 160, 5) + ac(114, 168, 5) + ac(138, 88, 4))]] },
    { id: 'a8-bagowl', cat: 'masks', level: 2, title: 'Paper-bag owl puppet', ico: '🦉',
      need: 'A paper lunch bag, coloured paper, scissors, glue and crayons', tip: 'Put the beak half on the flap so it opens and shuts when you talk!', steps: [
      ['Lay a paper bag flat with the folded bottom at the top. The flap is the owl\'s head.', solid('#D9B382', ar(50, 30, 100, 160)) + al(50, 92, 150, 92)],
      ['Cut two big paper circles for eyes and glue them on the flap.', solid('#FFFFFF', ac(78, 60, 17) + ac(122, 60, 17)) + solid('#FFD84D', ac(78, 60, 10) + ac(122, 60, 10)) + paint(DARK, ac(78, 60, 5) + ac(122, 60, 5))],
      ['Glue a triangle beak on the edge of the flap.', solid('#F59E2E', apg('90,88 110,88 100,108'))],
      ['Cut two pointy ear tufts and glue them on top.', solid('#8B5E3C', apg('52,32 54,8 76,32') + apg('148,32 146,8 124,32'))],
      ['Glue a paper wing on each side.', solid('#A9774E', ap('M50 104 Q20 130 34 176 Q44 160 50 152 Z') + ap('M150 104 Q180 130 166 176 Q156 160 150 152 Z'))],
      ['Draw feathers on the tummy with little U shapes.', [[122, 70], [138, 76], [154, 70], [170, 76]].map(([y, x0]) => { let s = ''; for (let x = x0; x + 12 <= 132; x += 12) s += ap(`M${x} ${y} q6 8 12 0`); return s; }).join('')],
      ['Put your hand inside. Open and shut the flap to make it hoot!', solid('#F59E2E', ap('M78 190 l-6 6 M78 190 v8 M78 190 l6 6 M122 190 l-6 6 M122 190 v8 M122 190 l6 6'))]] },
    { id: 'a8-finger', cat: 'masks', level: 2, title: 'Finger puppet friends', ico: '🐰',
      need: 'Paper strips, tape, scissors, glue and crayons', tip: 'Make a whole family, one for each finger, and tell a story!', steps: [
      ['Wrap a strip of paper round your finger and tape it into a tube. Make 3!', fpTubes],
      ['Draw a smiling mouth on each one.', [48, 100, 152].map(cx => ap(`M${cx - 6} 126 q6 6 12 0`)).join('')],
      ['Bunny: draw two eyes and a pink nose, and glue on two long ears.', ap(fpBunnyEars) + paint(DARK, ac(42, 106, 2.5) + ac(54, 106, 2.5)) + solid('#F78FB3', ell(48, 116, 3, 2))],
      ['Bear: draw eyes and a round snout, and glue on round ears.', ap(fpBearEars) + paint(DARK, ac(93, 104, 2.5) + ac(107, 104, 2.5)) + ell(100, 116, 8, 6) + paint(DARK, ell(100, 113, 3, 2))],
      ['Frog: glue two big eyes on top and add pink cheeks.', ap(fpFrogEyes) + paint(DARK, ac(143, 71, 2.5) + ac(161, 71, 2.5)) + paint('#F78FB3', ell(139, 118, 4, 2.5) + ell(165, 118, 4, 2.5))],
      ['Colour them, pop them on your fingers and put on a show!', T('#F9C0D0', ap(fpTube(48) + ' ' + fpBunnyEars + ' Z')) + T('#D9A35F', ap(fpTube(100) + ' ' + fpBearEars + ' Z')) + T('#8BD17C', ap(fpTube(152) + ' ' + fpFrogEyes + ' Z'))]] },
    { id: 'a8-theatre', cat: 'masks', level: 3, title: 'Stick puppet theatre', ico: '🎪',
      need: 'A cardboard box, paper, straws or sticks, tape, glue and a grown-up', tip: 'Hide behind the box and use a different voice for each puppet.', steps: [
      ['Ask a grown-up to cut a big window in the side of a box.', pev('#E3C08F', thBox + ' ' + thW) + paint('#FFF6D5', ap(thW)) + ap(thBox) + ap(thW)],
      ['Glue red paper curtains on both sides of the window.', solid('#D9342B', ap(thCurtL)) + mirror(solid('#D9342B', ap(thCurtL))) + solid('#F2C230', ac(66, 92, 3) + ac(134, 92, 3))],
      ['Add a wavy strip across the top of the window.', solid('#F2C230', ap(thVal))],
      ['Make a sign that says SHOW for the top. Draw stars on the front.', solid('#FFFFFF', ar(64, 8, 72, 22, 4)) + ink(100, 25, 'SHOW', 15, '#D9342B') + star(44, 158, 9) + star(100, 158, 9) + star(156, 158, 9)],
      ['Draw a person, cut it out and tape it to a stick.', thGirl + paint(DARK, ac(80, 83, 1.5) + ac(88, 83, 1.5)) + ap('M80 88 q4 3 8 0') + fat('#A0703F', 'M84 124 V136', 4)],
      ['Make a cat puppet too!', thCat + paint(DARK, ac(113, 96, 1.6) + ac(123, 96, 1.6)) + ap('M116 102 l2 2 l2 -2') + al(106, 102, 98, 100) + al(130, 102, 138, 100) + fat('#A0703F', 'M118 110 V136', 4)],
      ['Colour your puppets. Hide behind the box and put on a show!', T('#F78FB3', apg('84,95 70,124 98,124')) + T('#F6C9A0', ac(84, 84, 10)) + T('#FFB347', thCat) + T('#F59E2E', star(44, 158, 9) + star(100, 158, 9) + star(156, 158, 9))]] }
  );

  /* ================= Cards & Gifts ================= */
  const tkHeart = heartD(100, 84, 30);
  const tkSmall = ap(heartD(56, 38, 7)) + ap(heartD(144, 38, 7)) + ap(heartD(56, 172, 7)) + ap(heartD(144, 172, 7));

  const bmWaves = [106, 120, 134, 148, 162, 176];
  const bmBands = ['#F2604F', '#F59E2E', '#FFD84D', '#7CCF6B', '#6EB6F0', '#B48AE0'].map((c, i) => {
    const y = bmWaves[i], y2 = i < 5 ? bmWaves[i + 1] : 196;
    return T(c, inClip(['a8bm'], ap(`M70 ${y} q15 -8 30 0 t30 0 L130 ${y2} Q115 ${y2 + 8} 100 ${y2} Q85 ${y2 - 8} 70 ${y2} Z`)));
  }).join('');

  const frBtn = [[40, 40, '#F2604F'], [160, 40, '#3D7DD8'], [40, 160, '#7CCF6B'], [160, 160, '#9B59D0']].map(([x, y, c]) => btn(x, y, 10, c)).join('');
  const bow = (x, y, r) => `<g transform="rotate(${r} ${x} ${y})">${solid('#F5D46A', apg(`${x - 9},${y - 6} ${x},${y - 2} ${x + 9},${y - 6} ${x + 9},${y + 6} ${x},${y + 2} ${x - 9},${y + 6}`))}${al(x, y - 2, x, y + 2)}</g>`;
  const frPasta = [70, 100, 130].map(k => bow(k, 40, 0) + bow(k, 160, 0) + bow(40, k, 90) + bow(160, k, 90)).join('');
  const frFace = ac(100, 96, 22) + paint(DARK, ac(92, 92, 2.5) + ac(108, 92, 2.5)) + ap('M92 103 q8 7 16 0') + ap('M66 144 Q70 124 100 122 Q130 124 134 144');

  const swStars = [[42, 102, '#F2B705'], [62, 110, '#3D7DD8'], [44, 156, '#3D7DD8'], [64, 166, '#F2B705'], [108, 102, '#F2B705'], [128, 110, '#3D7DD8'], [106, 158, '#3D7DD8'], [128, 166, '#F2B705']];

  // Mini book (single pictures)
  const mbSheet = sheet('20,50 180,50 180,150 20,150');
  const mbFolds = fold(al(20, 100, 180, 100) + al(60, 50, 60, 150) + al(100, 50, 100, 150) + al(140, 50, 140, 150));

  LESSONS.push(
    { id: 'a8-thanks', cat: 'cards', level: 1, title: 'Thank-you card', ico: '💌',
      need: 'A sheet of paper or card, a pencil and crayons', tip: 'Inside, draw the person you are thanking and write your name.', steps: [
      ['Fold a sheet of paper in half to make a card.', ar(40, 18, 120, 166, 3) + apl('160,22 164,26 164,188 44,188 40,184')],
      ['Draw a big heart near the top.', ap(tkHeart)],
      ['Write THANK YOU under the heart, in big letters.', ink(100, 142, 'THANK', 22) + ink(100, 166, 'YOU', 22)],
      ['Draw little hearts in the corners and some dots.', tkSmall + paint(DARK, ac(80, 34, 2) + ac(100, 30, 2) + ac(120, 34, 2))],
      ['Colour it in. Write inside, then give it to someone kind!', T('#F2604F', ap(tkHeart)) + T('#F9A3C0', tkSmall)]] },
    { id: 'a8-bookmark', cat: 'cards', level: 1, title: 'Rainbow bookmark', ico: '🔖',
      need: 'A strip of card, crayons, a hole punch, a piece of yarn', tip: 'Make one for a friend and draw their favourite animal on it!', steps: [
      ['Cut a long strip of card. That is your bookmark.', ar(70, 36, 60, 150, 6) + clipDef('a8bm', 'M76 36 H124 A6 6 0 0 1 130 42 V180 A6 6 0 0 1 124 186 H76 A6 6 0 0 1 70 180 V42 A6 6 0 0 1 76 36 Z')],
      ['Ask a grown-up to punch a hole near the top.', ac(100, 50, 5)],
      ['Draw a smiling sun under the hole.', ac(100, 82, 11) + around(8, 0, 100, 82, (x, y, a) => al(f1(100 + 15 * Math.cos(a)), f1(82 + 15 * Math.sin(a)), f1(100 + 20 * Math.cos(a)), f1(82 + 20 * Math.sin(a)))) + paint(DARK, ac(96, 80, 1.5) + ac(104, 80, 1.5)) + ap('M96 85 q4 3 8 0')],
      ['Draw wavy lines down the rest of the strip.', bmWaves.map(y => ap(`M70 ${y} q15 -8 30 0 t30 0`)).join('')],
      ['Push yarn through the hole and tie it. That is a tassel.', fat('#9B59D0', 'M97 50 Q90 30 100 22 Q110 30 103 50 M100 22 L90 6 M100 22 L96 3 M100 22 L104 3 M100 22 L110 6', 3) + paint('#9B59D0', ac(100, 22, 3.5))],
      ['Colour the stripes like a rainbow. Use it in your favourite book!', bmBands + T('#FFD84D', ac(100, 82, 11))]] },
    { id: 'a8-frame', cat: 'cards', level: 2, title: 'Button picture frame', ico: '🖼️',
      need: 'Cardboard, paint, buttons, pasta bows, glue, string and a grown-up', tip: 'Put a photo of someone you love inside. It makes a great present!', steps: [
      ['Cut a square of cardboard. A grown-up cuts a window in the middle.', ar(24, 24, 152, 152, 4) + ar(56, 56, 88, 88)],
      ['Paint the frame a bright colour. Let it dry.', T('#8FD3E8', ap('M24 24 H176 V176 H24 Z M56 56 H144 V144 H56 Z'), true)],
      ['Draw a picture of someone you love. Tape it behind the window.', frFace],
      ['Glue a button on each corner.', frBtn],
      ['Glue pasta bows along the sides.', frPasta],
      ['Colour the picture. Tape a string on the back and hang it up!', T('#F6C9A0', ac(100, 96, 22)) + T('#F78FB3', ap('M66 144 Q70 124 100 122 Q130 124 134 144 Z')) + apl('64,24 100,6 136,24')]] },
    { id: 'a8-stampwrap', cat: 'cards', level: 2, title: 'Star-stamp wrapping paper', ico: '🎁',
      need: 'A box, plain paper, a potato, paint, ribbon, a tag and a grown-up', tip: 'Try other stamps: a cut apple, a cork or a sponge shape.', steps: [
      ['Wrap a box in plain paper. A grown-up can help with the tape.', solid('#F3E3C3', ar(24, 80, 120, 100))],
      ['Ask a grown-up to cut a star into half a potato. Dip it in yellow paint and stamp!', swStars.filter(s => s[2] === '#F2B705').map(([x, y, c]) => paint(c, star(x, y, 9))).join('')],
      ['Stamp blue stars in the spaces. Let it dry.', swStars.filter(s => s[2] !== '#F2B705').map(([x, y, c]) => paint(c, star(x, y, 9))).join('')],
      ['Wrap a ribbon around the box, both ways.', solid('#D9342B', ar(24, 122, 120, 16)) + solid('#D9342B', ar(76, 80, 16, 100))],
      ['Tie a bow on top.', solid('#D9342B', ell(70, 68, 15, 9, -20) + ell(98, 68, 15, 9, 20)) + solid('#B8282A', ac(84, 76, 6))],
      ['Make a little gift tag and tie it on with string.', solid('#FFFFFF', apg('160,100 194,100 194,124 160,124 152,112')) + ac(158, 112, 2.5) + ap('M144 130 Q152 128 156 115')],
      ['Write who it is for on the tag. Give your present!', ink(176, 110, 'TO:', 8) + paint('#F2B705', star(180, 118, 4))]] },
    { id: 'a8-minibook', cat: 'cards', level: 3, title: 'Fold a mini book', ico: '📖', single: true,
      need: 'One sheet of paper, scissors, a grown-up, pencils and crayons', tip: 'Your mini book has 8 pages: a cover, 6 story pages and a back.', steps: [
      ['Fold a sheet of paper in half the long way. Open it again.', mbSheet + fold(al(20, 100, 180, 100)) + arrow(30, 140, 30, 60, -0.2)],
      ['Fold it in half the other way, then in half again. Open it: 8 boxes!', mbSheet + mbFolds],
      ['Ask a grown-up to cut along the middle line, only between the two middle folds.', mbSheet + mbFolds + stroke('#F2604F', wide(al(60, 100, 140, 100), 4))],
      ['Fold it the long way again. Push the ends in so the middle opens up.', sheet('20,80 60,80 100,62 140,80 180,80 180,120 140,120 100,138 60,120 20,120') + paint('#E6E9EE', apg('66,100 100,86 134,100 100,114')) + apg('66,100 100,86 134,100 100,114') + arrow(2, 100, 16, 100, 0) + arrow(198, 100, 184, 100, 0)],
      ['Keep pushing until it makes a plus shape. Then fold the pages flat.', sheet('88,30 112,30 112,88 170,88 170,112 112,112 112,170 88,170 88,112 30,112 30,88 88,88') + al(100, 30, 100, 170) + al(30, 100, 170, 100)],
      ['Now it is a little book! Draw a cover with a title and a picture.', solid('#FFE58A', ar(62, 28, 76, 140, 3)) + al(68, 28, 68, 168) + ink(103, 58, 'MY', 15) + ink(103, 78, 'BOOK', 15) + solid('#F2604F', star(103, 120, 22))],
      ['Draw a story inside, one picture on each page. Read it to your family!', solid('#FFFFFF', ar(18, 46, 82, 112) + ar(100, 46, 82, 112)) + T('#FFB347', ac(59, 96, 18) + apg('45,85 44,66 58,78') + apg('73,85 74,66 60,78')) + ac(59, 96, 18) + apl('45,85 44,66 57,78') + apl('73,85 74,66 61,78') + paint(DARK, ac(53, 93, 2) + ac(65, 93, 2)) + ap('M55 102 q4 3 8 0') + al(141, 108, 141, 140) + T('#F78FB3', around(5, 9, 141, 96, (x, y) => ac(x, y, 6))) + around(5, 9, 141, 96, (x, y) => ac(x, y, 6)) + solid('#FFD84D', ac(141, 96, 4)) + ink(59, 150, '1', 9) + ink(141, 150, '2', 9)]] }
  );

  /* ================= Mixed Media ================= */
  const jfDome = 'M50 92 A50 50 0 0 1 150 92 q-12.5 8 -25 0 t-25 0 t-25 0 t-25 0 Z';
  const jfTent = [62, 81, 100, 119, 138].map(x => `M${x} 96 q-8 14 0 28 t0 28 t0 28`).join(' ');
  const jfBub = [[30, 40, 8], [22, 70, 5], [170, 50, 7], [178, 88, 5], [30, 140, 6], [172, 146, 7]];

  const tfPetalBlobs = around(6, 34, 100, 70, (x, y, a, i) => T(i % 2 ? '#F78FB3' : '#F25C9A', blob(x, y, 18, 11 + i * 7)));
  const tfPetals = around(6, 34, 100, 70, (x, y, a) => ell(x, y, 12, 17, deg(a) + 90));
  const tfLeafL = leafD(100, 160, 66, 140, 12), tfLeafR = leafD(100, 146, 134, 124, 12);

  const snSpiral = (() => { const n = 108, pts = []; for (let i = 0; i <= n; i++) { const t = i / n, a = t * 3 * 2 * Math.PI, r = 2 + t * 42; pts.push(`${f1(112 + r * Math.cos(a))} ${f1(94 + r * Math.sin(a))}`); } return 'M' + pts.join(' L'); })();
  const snBody = 'M60 142 L162 142 Q178 146 172 154 L50 154 Q32 154 30 130 Q28 108 42 106 Q56 106 58 128 Z';

  const piece = (x, y, w, h, rot, bg, inner) => `<g transform="rotate(${rot} ${x} ${y})">${solid(bg, ar(x - w / 2, y - h / 2, w, h, 2))}${inner}</g>`;
  const torn = (cx, y1, y2, w, rot, c, seed) => { const q = rng(seed), L = [], R = []; for (let y = y1; y <= y2; y += 5) { L.push(`${f1(cx - w / 2 + (q() - 0.5) * 3)},${y}`); R.unshift(`${f1(cx + w / 2 + (q() - 0.5) * 3)},${y}`); }
    return `<g transform="rotate(${rot} ${cx} ${(y1 + y2) / 2})">${solid(c, apg(L.concat(R).join(' ')))}</g>`; };
  const HC = ['#FFC23D', '#F59E2E', '#A0703F'];
  const clHair = [56, 69, 82, 95, 108, 121, 134, 147].map((x, i) => torn(x, 26, 62, 14, (i % 3 - 1) * 6, HC[i % 3], 5 + i)).join('') + torn(50, 56, 120, 13, 4, HC[1], 31) + torn(150, 56, 120, 13, -4, HC[2], 37);

  const rbFoil = stroke('#8E9AA6', wide(apl('62,88 70,84 76,90') + apl('128,86 136,90 140,84') + apl('60,146 68,150 74,144') + apl('126,150 134,146 140,152'), 1.5));
  const rbCap = (x, y) => solid('#E8574A', ac(x, y, 11)) + wide(ac(x, y, 8), 1.5) + paint(DARK, ac(x, y, 4)) + paint('#FFFFFF', ac(x + 1.5, y - 1.5, 1.4));

  LESSONS.push(
    { id: 'a8-jelly', cat: 'mixed', level: 1, title: 'Magic crayon jellyfish', ico: '🌊',
      need: 'Thick paper, crayons (one white!), watercolour paint and a brush', tip: 'Press hard with the crayon. Paint slides off wax, like magic!', steps: [
      ['Draw a round jellyfish head with crayon, with a bumpy bottom.', ap(jfDome)],
      ['Draw long wiggly arms hanging down.', ap(jfTent)],
      ['Give it a happy face.', paint(DARK, ac(84, 72, 4) + ac(116, 72, 4)) + paint('#FFFFFF', ac(85.5, 70.5, 1.4) + ac(117.5, 70.5, 1.4)) + ap('M92 80 q8 7 16 0') + paint('#F78FB3', ell(76, 80, 5, 3) + ell(124, 80, 5, 3))],
      ['Colour the head pink and go over the arms with purple crayon.', T('#F7A8D8', ap(jfDome)) + fat('#B06BD8', jfTent, 4)],
      ['Draw bubbles with a white crayon. They are hiding... for now!', stroke('#C9D6E3', wide(jfBub.map(([x, y, r]) => ac(x, y, r)).join(''), 2))],
      ['Paint watery blue all over. A grown-up can help with the paint. Look, the bubbles appear!', T('#8EC5F0', ap('M0 0 H200 V200 H0 Z ' + jfDome + ' ' + jfBub.map(([x, y, r]) => circ(x, y, r)).join(' ')), true)],
      ['When it is dry, add green seaweed. Show someone your magic jellyfish!', fat('#3BAA5C', 'M20 200 q-8 -10 0 -20 t0 -20 M40 200 q8 -10 0 -20 t0 -16 M160 200 q-8 -10 0 -20 t0 -16 M180 200 q8 -10 0 -20 t0 -20', 4)]] },
    { id: 'a8-tissueflower', cat: 'mixed', level: 1, title: 'Tissue paper + marker flower', ico: '🌸',
      need: 'Tissue paper, a glue stick, white paper and a black marker', tip: 'The marker lines do not have to match the tissue. That makes it fun!', steps: [
      ['Tear a yellow piece of tissue paper and glue it in the middle.', T('#FFE04D', blob(100, 70, 20, 3))],
      ['Tear pink pieces and glue them all around it.', tfPetalBlobs],
      ['Glue a green strip for a stem and two green leaves.', T('#7CCF6B', apg('96,116 104,116 106,190 94,190') + ap(tfLeafL) + ap(tfLeafR))],
      ['When the glue is dry, draw a circle in the middle with a black marker.', ac(100, 70, 15)],
      ['Draw petal shapes with the marker, on top of the pink.', tfPetals],
      ['Draw the stem and the leaves with the marker too.', al(100, 121, 100, 190) + ap(tfLeafL) + ap(tfLeafR) + al(100, 160, 74, 144) + al(100, 146, 126, 130)],
      ['Add a sun with tissue and marker. Hang it on a window!', T('#FFD84D', blob(168, 32, 14, 9)) + ac(168, 32, 12) + around(8, 0, 168, 32, (x, y, a) => al(f1(168 + 16 * Math.cos(a)), f1(32 + 16 * Math.sin(a)), f1(168 + 22 * Math.cos(a)), f1(32 + 22 * Math.sin(a))))]] },
    { id: 'a8-yarnsnail', cat: 'mixed', level: 2, title: 'Yarn and glue snail', ico: '🐌',
      need: 'Card, a pencil, white glue, yarn in 2 colours, a button, crayons', tip: 'Lay the card flat while it dries, so the yarn does not slide.', steps: [
      ['Draw a big spiral with pencil for the shell.', guide(ap(snSpiral))],
      ['Draw the snail\'s body under the shell, with a round head.', guide(ap(snBody))],
      ['Squeeze glue on the spiral. Press orange yarn on top, round and round. A grown-up can help.', fat('#F59E2E', snSpiral, 6)],
      ['Do the same on the body with green yarn.', fat('#5DB360', snBody, 6)],
      ['Add two yarn feelers and glue on a button eye.', fat('#5DB360', 'M38 108 L30 84 M48 107 L54 84', 4) + solid('#5DB360', ac(30, 82, 4) + ac(54, 82, 4)) + btn(44, 122, 6, '#3D7DD8')],
      ['Rub out the pencil. Add a yarn ground and colour the shell. Let it dry!', fat('#A0703F', 'M10 168 Q100 160 190 168', 5) + T('#FFE0A3', ac(112, 94, 46)) + T('#CDEFC9', ap(snBody)), { clear: true }]] },
    { id: 'a8-collage', cat: 'mixed', level: 2, title: 'Magazine collage face', ico: '📰',
      need: 'Old magazines, coloured paper, scissors, a glue stick and a grown-up', tip: 'Silly is good! Big eyes, a tiny nose, a giant mouth... anything goes.', steps: [
      ['Cut a big oval face and a neck from paper. Glue them down.', solid('#F6C9A0', ar(88, 150, 24, 30)) + solid('#F6C9A0', ell(100, 100, 48, 60))],
      ['Find two eyes in a magazine. Cut them out and glue them on.', piece(80, 88, 30, 18, -6, '#E8EEF5', solid('#FFFFFF', ell(80, 88, 11, 6)) + solid('#3D7DD8', ac(80, 88, 5)) + paint(DARK, ac(80, 88, 2.2))) + piece(122, 86, 30, 18, 5, '#F2E6D8', solid('#FFFFFF', ell(122, 86, 11, 6)) + solid('#3BAA5C', ac(122, 86, 5)) + paint(DARK, ac(122, 86, 2.2)))],
      ['Find a mouth and glue it on.', piece(100, 136, 40, 18, 3, '#F3D9E4', solid('#D9342B', ap('M84 136 Q100 128 116 136 Q100 146 84 136 Z')) + al(86, 136, 114, 136))],
      ['Cut a triangle nose from coloured paper.', solid('#E8A07A', apg('100,98 108,118 92,118'))],
      ['Tear strips of paper for hair and glue them on.', clHair],
      ['Cut a shirt and glue on cut-out letters.', solid('#3D7DD8', ap('M34 200 Q40 170 76 164 Q100 174 124 164 Q160 170 166 200 Z')) + piece(78, 186, 14, 16, -8, '#FFFFFF', ink(78, 191, 'A', 13, '#D9342B')) + piece(100, 184, 14, 16, 4, '#FFE58A', ink(100, 189, 'B', 13, '#22305A')) + piece(122, 186, 14, 16, -3, '#FFFFFF', ink(122, 191, 'C', 13, '#2E8B4E'))],
      ['Glue little squares around it. Give your funny face a name!', [[14, 14, '#F2604F', 10], [32, 26, '#FFC23D', -12], [180, 16, '#7CCF6B', 8], [166, 34, '#B48AE0', -6], [14, 160, '#6EB6F0', 14], [184, 170, '#F78FB3', -10], [182, 100, '#FFC23D', 6], [16, 92, '#7CCF6B', -8]].map(([x, y, c, r]) => piece(x, y, 12, 12, r, c, '')).join('')]] },
    { id: 'a8-robot', cat: 'mixed', level: 3, title: 'Mixed-media robot', ico: '🤖',
      need: 'Foil, card, bottle caps, paper strips, a pipe cleaner, glue, markers', tip: 'Look in the recycling for robot parts: lids, tubes and boxes!', steps: [
      ['Glue a big square of foil for the body. Scrunch it a bit first!', solid('#C9D1DA', ar(55, 80, 90, 78, 6)) + rbFoil],
      ['Glue a smaller square of card on top for the head.', solid('#B8E0F0', ar(70, 32, 60, 44, 6)) + al(94, 76, 94, 80) + al(106, 76, 106, 80)],
      ['Glue on two bottle caps for eyes. Draw a mouth.', rbCap(86, 50) + rbCap(114, 50) + ar(88, 64, 24, 7, 2) + al(94, 64, 94, 71) + al(100, 64, 100, 71) + al(106, 64, 106, 71)],
      ['Fold paper strips like a fan for bendy arms and legs.', fat('#F2C230', 'M55 100 L47 108 L41 100 L33 108 L27 100 M145 100 L153 108 L159 100 L167 108 L173 100 M80 158 L72 164 L80 170 L72 176 L80 182 M120 158 L128 164 L120 170 L128 176 L120 182', 6) + solid('#9B59D0', ac(20, 101, 7) + ac(180, 101, 7)) + solid('#9B59D0', ar(62, 182, 26, 9, 3) + ar(112, 182, 26, 9, 3))],
      ['Draw buttons and a dial on the body with markers.', solid('#FFFFFF', ar(68, 92, 42, 26, 3)) + al(74, 100, 104, 100) + al(74, 110, 96, 110) + solid('#FFFFFF', ac(126, 105, 10)) + al(126, 105, 132, 98) + solid('#F2604F', ac(76, 138, 5)) + solid('#7CCF6B', ac(92, 138, 5)) + solid('#3D7DD8', ac(108, 138, 5)) + solid('#FFD84D', ac(126, 138, 5))],
      ['Twist a pipe cleaner for an antenna. Put a pom-pom on the end.', fat('#9B59D0', 'M100 32 Q96 22 103 15', 3) + solid('#F78FB3', ac(104, 10, 6))],
      ['Draw a crayon ground and add sticker stars. Your robot says beep boop!', fat('#7CCF6B', 'M0 194 H200', 5) + solid('#FFD84D', star(26, 28, 9) + star(172, 34, 8) + star(178, 140, 9) + star(22, 148, 8))]] }
  );

  /* ================= Chalk & Pastels ================= */
  const hsBoxes = [[[85, 166]], [[85, 136]], [[70, 106], [100, 106]], [[85, 76]], [[70, 46], [100, 46]], [[85, 16]]];
  const hsCol = ['#F78FB3', '#FFD84D', '#7FD3F7', '#9BE07A', '#FFB870', '#D6B4FF', '#F78FB3', '#FFD84D'];
  let hsN = 0;
  const hsSteps = hsBoxes.map(row => row.map(([x, y]) => { hsN++; return chalk('#FFFFFF', ar(x, y, 30, 30)) + paint(hsCol[hsN - 1], atext(x + 15, y + 22, String(hsN), 18)); }).join(''));

  const ssSky = '<defs><linearGradient id="a8-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7D55C7"/><stop offset=".35" stop-color="#EE6FA0"/><stop offset=".7" stop-color="#F7964A"/><stop offset="1" stop-color="#FFD84D"/></linearGradient></defs>';

  const lvA = leafD(60, 150, 40, 40, 28), lvB = leafD(110, 172, 130, 50, 30), lvC = leafD(150, 182, 176, 110, 18);
  const veins = (bx, by, tx, ty, w) => { const dx = tx - bx, dy = ty - by, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L; let d = `M${bx} ${by} L${f1(bx + dx * 0.9)} ${f1(by + dy * 0.9)}`;
    [0.3, 0.5, 0.7].forEach((t, i) => { const px = bx + dx * t, py = by + dy * t, k = w * (0.36 - i * 0.07); [1, -1].forEach(s => { d += ` M${f1(px)} ${f1(py)} L${f1(px + nx * k * s + dx / L * k * 0.8)} ${f1(py + ny * k * s + dy / L * k * 0.8)}`; }); });
    return d + ` M${bx} ${by} L${f1(bx - dx / L * 12)} ${f1(by - dy / L * 12)}`; };
  const lvLines = [[lvA, veins(60, 150, 40, 40, 28), '#F59E2E'], [lvB, veins(110, 172, 130, 50, 30), '#F2C230'], [lvC, veins(150, 182, 176, 110, 18), '#E8574A']];
  const lvDraw = i => fat(lvLines[i][2], lvLines[i][0], 5) + fat(lvLines[i][2], lvLines[i][1], 3);

  const ntHouses = apl('10,130 39,104 68,130') + ar(14, 130, 50, 66) + apl('70,120 100,92 130,120') + ar(74, 120, 52, 76) + apl('132,136 161,112 190,136') + ar(136, 136, 50, 60);
  const ntWin = ar(22, 142, 12, 12) + ar(44, 142, 12, 12) + ar(84, 132, 12, 12) + ar(104, 132, 12, 12) + ar(146, 148, 12, 12) + ar(164, 148, 12, 12);
  const ntStars = [[18, 22], [80, 16], [104, 52], [26, 84], [70, 76], [186, 94], [118, 22], [184, 12]].map(([x, y], i) => i % 2 ? al(x - 4, y, x + 4, y) + al(x, y - 4, x, y + 4) : ac(x, y, 1.5)).join('');

  const apD = 'M100 62 C86 50 50 52 46 92 C42 140 76 178 100 166 C124 178 158 140 154 92 C150 52 114 50 100 62 Z';

  LESSONS.push(
    { id: 'a8-hopscotch', cat: 'chalk', level: 1, title: 'Sidewalk chalk hopscotch', ico: '🦘',
      need: 'Sidewalk chalk, a flat path or playground, and a grown-up outside', tip: 'Chalk washes off with water or rain, so you can draw a new one tomorrow!', steps: [
      ['Go outside with a grown-up. Draw a square at the bottom and write 1 in it.', paint('#9AA3AD', ar(0, 0, 200, 200)) + hsSteps[0]],
      ['Draw square 2 on top of it.', hsSteps[1]],
      ['Now two squares side by side: 3 and 4.', hsSteps[2]],
      ['One square on top: 5.', hsSteps[3]],
      ['Two side by side again: 6 and 7.', hsSteps[4]],
      ['One last square at the top: 8!', hsSteps[5]],
      ['Draw a sun and flowers around it. Throw a pebble and hop, hop, hop!', chalk('#FFD84D', ac(30, 34, 12) + around(8, 0, 30, 34, (x, y, a) => al(f1(30 + 17 * Math.cos(a)), f1(34 + 17 * Math.sin(a)), f1(30 + 23 * Math.cos(a)), f1(34 + 23 * Math.sin(a))))) + chalk('#9BE07A', al(30, 196, 30, 170) + al(170, 196, 170, 172)) + chalk('#F78FB3', around(5, 7, 30, 164, (x, y) => ac(x, y, 4)) + around(5, 7, 170, 166, (x, y) => ac(x, y, 4)), 3) + solid('#6B7480', ell(84, 126, 6, 4))]] },
    { id: 'a8-sunset', cat: 'chalk', level: 1, title: 'Smudgy chalk sunset', ico: '🌅',
      need: 'Chalk pastels or soft chalk, paper, and a wet wipe for your fingers', tip: 'Smudge with one finger for each colour, so the colours stay bright.', steps: [
      ['Draw thick stripes across the top: purple, pink, orange, then yellow.', fat('#8E5BC6', 'M10 20 H190', 16) + fat('#F06FA0', 'M10 52 H190', 16) + fat('#F59E2E', 'M10 86 H190', 16) + fat('#FFD84D', 'M10 120 H190', 16)],
      ['Rub the stripes with your finger, side to side. The colours mix and go soft!', ssSky + paint('url(#a8-sky)', ar(0, 0, 200, 140))],
      ['Draw a half-circle sun on the bottom line. Smudge a glow around it.', blurDef('a8-soft', 8) + blurred('a8-soft', paint('#FFE58A', ac(100, 140, 46)), 'opacity:.8') + paint('#FFF6C8', ap('M66 140 A34 34 0 0 1 134 140 Z'))],
      ['Colour the sea dark blue under the sun.', paint('#2D3E7A', ar(0, 140, 200, 60))],
      ['Add short yellow lines on the water. The sun is shining on the sea!', chalk('#FFE58A', al(70, 150, 130, 150) + al(78, 160, 122, 160) + al(86, 170, 114, 170) + al(92, 180, 108, 180) + al(30, 156, 46, 156) + al(156, 166, 172, 166), 3)],
      ['Draw birds like little m shapes. Show someone your sunset!', chalk('#3B2A4A', ap('M34 44 q6 -6 12 0 q6 -6 12 0 M62 64 q5 -5 10 0 q5 -5 10 0 M140 36 q6 -6 12 0 q6 -6 12 0'), 3)]] },
    { id: 'a8-leafresist', cat: 'chalk', level: 2, title: 'Oil-pastel resist leaves', ico: '🍁',
      need: 'Oil pastels or wax crayons, watercolour paint, a brush and water', tip: 'Oil pastel is waxy, so paint slides off it. That is called resist!', steps: [
      ['Draw a big leaf with an orange oil pastel. Press hard!', fat('#F59E2E', lvA, 5)],
      ['Draw a line down the middle and little side veins, and a stem.', fat('#F59E2E', lvLines[0][1], 3)],
      ['Draw a tall yellow leaf with veins, the same way.', lvDraw(1)],
      ['Draw a small red leaf with veins.', lvDraw(2)],
      ['Paint inside each leaf with watery paint. A grown-up can help.', T('#FFB870', ap(lvA)) + T('#FFE58A', ap(lvB)) + T('#F7A0A0', ap(lvC))],
      ['Paint the background dark purple. The pastel lines push the paint away. Magic! Show it off!', T('#5B4A9E', ap('M0 0 H200 V200 H0 Z ' + lvA + ' ' + lvB + ' ' + lvC), true) + lvDraw(0) + lvDraw(1) + lvDraw(2)]] },
    { id: 'a8-night', cat: 'chalk', level: 2, title: 'Chalk night on black paper', ico: '🌙',
      need: 'Black paper and chalk (white, yellow and some colours)', tip: 'Light colours look brightest on black paper. Try white, yellow and pink.', steps: [
      ['Take black paper. Draw a big round moon with white chalk and colour it in.', paint('#1F2240', ar(0, 0, 200, 200)) + paint('#FFF6D0', ac(146, 48, 24)) + chalk('#FFFFFF', ac(146, 48, 24), 3)],
      ['Smudge a soft glow around the moon with your finger.', blurDef('a8-glow', 9) + blurred('a8-glow', paint('#FFF3B0', ac(146, 48, 34)), 'opacity:.35')],
      ['Draw little houses at the bottom with white chalk.', chalk('#E8ECF5', ntHouses, 3) + chalk('#E8ECF5', ar(93, 170, 14, 26), 3)],
      ['Colour the windows yellow. The lights are on!', paint('#FFD84D', ntWin) + chalk('#FFF3B0', ntWin, 2)],
      ['Add twinkly stars: little dots and crosses.', chalk('#FFFFFF', ntStars, 2.5)],
      ['Draw a shooting star and make a wish! Show someone your night picture.', paint('#FFD84D', apg(starPts(60, 44, 9, 4))) + chalk('#FFE58A', al(52, 40, 24, 24) + al(53, 46, 26, 38), 2.5)]] },
    { id: 'a8-apple', cat: 'chalk', level: 3, title: 'Blending a pastel apple', ico: '🍎',
      need: 'Soft pastels or chalk pastels (red, dark red, yellow, white, brown, green)', tip: 'Light on one side, dark on the other: that makes it look round!', steps: [
      ['Draw a light pencil circle for the apple.', guide(ac(100, 112, 56))],
      ['Draw the apple shape over it: two bumps on top and a dip for the stem.', ap(apD) + clipDef('a8ap', apD) + blurDef('a8b6', 7) + blurDef('a8b2', 1.5)],
      ['Rub out the circle. Colour the apple softly with red pastel.', T('#EF5A4C', ap(apD)), { clear: true }],
      ['Add dark red on the right side. Rub with your finger to blend it in.', '<g style="mix-blend-mode:multiply">' + inClip(['a8ap'], blurred('a8b6', paint('#9E1F2B', ell(150, 130, 34, 60)))) + '</g>'],
      ['Add a little orange on the left side and blend it.', inClip(['a8ap'], blurred('a8b6', paint('#FFB347', ell(66, 104, 16, 30)), 'opacity:.75'))],
      ['Add a white shiny spot. Do not smudge this one!', blurred('a8b2', paint('#FFFFFF', ell(72, 88, 6, 11, 20)))],
      ['Draw a brown stem and a green leaf.', fat('#7A4A25', 'M100 64 Q98 46 106 34', 5) + solid('#5DB360', ap(leafD(104, 48, 142, 32, 11))) + al(106, 47, 138, 33)],
      ['Smudge a grey shadow under it. Sign your name and show someone!', blurred('a8b6', paint('#8C8C9A', ell(108, 180, 56, 7)), 'mix-blend-mode:multiply')]] }
  );

  /* ================= Mosaic & Stained Glass ================= */
  // Mosaic heart: the classic heart curve, tiles placed inside it.
  const mhPts = Array.from({ length: 160 }, (_, i) => { const t = i * 2 * Math.PI / 160; return [f1(100 + 4.9 * 16 * Math.sin(t) ** 3), f1(86 - 4.9 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)))]; });
  const mhD = 'M' + mhPts.map(p => p.join(' ')).join(' L') + ' Z';
  const mhIn = (x, y) => { let c = false; for (let i = 0, j = mhPts.length - 1; i < mhPts.length; j = i++) { const [xi, yi] = mhPts[i], [xj, yj] = mhPts[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const mhDist = (x, y) => Math.min(...mhPts.map(([px, py]) => Math.hypot(px - x, py - y)));
  const mhTiles = [[], [], []];
  (() => { const q = rng(42); for (let y = 22; y < 180; y += 11) for (let x = 21; x < 180; x += 11) { const r = (q() - 0.5) * 18; if (!mhIn(x, y)) continue; const d = mhDist(x, y); if (d < 7) continue;
    mhTiles[d < 17 ? 0 : d < 28 ? 1 : 2].push(`<rect x="${x - 4.5}" y="${y - 4.5}" width="9" height="9" transform="rotate(${f1(r)} ${x} ${y})"/>`); } })();

  const bfPetalA = a => [[27, 5], [38, 5], [48, 4]].map(([R, r]) => [f1(100 + R * Math.cos(a)), f1(70 + R * Math.sin(a)), r]);

  const sgOuter = 'M40 186 V80 A60 60 0 0 1 160 80 V186 Z', sgInner = 'M54 172 V82 A46 46 0 0 1 146 82 V172 Z';
  const sgPieces = (list, c) => T(c, inClip(['a8sg'], list.map(([x, y, r, s]) => blob(x, y, r, s, 6)).join('')));

  const owlD = 'M67.9 56.3 L58 26 L90.3 45 A56 68 0 0 1 109.7 45 L142 26 L132.1 56.3 A56 68 0 1 1 67.9 56.3 Z';
  const owlWings = 'M44.9 100.2 Q80 128 72 170.9 M155.1 100.2 Q120 128 128 170.9';
  const owlFace = ac(80, 88, 19) + ac(120, 88, 19) + apg('92,108 108,108 100,124');
  const owlBelly = [[134, [82, 94, 106]], [148, [88, 100]], [162, [82, 94, 106]]].map(([y, xs]) => xs.map(x => ap(`M${x} ${y} q6 8 12 0`)).join('')).join('');
  const pencil = s => stroke('#9AA6B2', wide(s, 2));
  const glue = s => stroke('#1B1B2F', wide(s, 5));

  const PX = ['.o........o.', '.op......po.', '.ofoooooofo.', 'offffffffffo', 'ofeeffffeefo', 'ofekffffkefo', 'offffppffffo', 'ofwwffffwwfo', '.owwwwwwwwo.', '..oooooooo..'];
  const PXC = { o: DARK, f: '#F59E2E', e: '#7CCF6B', k: DARK, p: '#F78FB3', w: '#FFF1DC', '.': '#BFE3F7' };
  const pxCells = keys => Object.entries(PXC).filter(([k]) => keys.includes(k)).map(([k, c]) => T(c, PX.map((row, r) => [...row].map((ch, cI) => ch === k ? ar(22 + cI * 13, 35 + r * 13, 13, 13) : '').join('')).join(''))).join('');
  const pxGrid = wide(Array.from({ length: 13 }, (_, i) => al(22 + i * 13, 35, 22 + i * 13, 165)).join('') + Array.from({ length: 11 }, (_, i) => al(22, 35 + i * 13, 178, 35 + i * 13)).join(''), 1);

  LESSONS.push(
    { id: 'a8-mosaicheart', cat: 'mosaic', level: 1, title: 'Paper-square mosaic heart', ico: '❤️',
      need: 'Coloured paper, safety scissors, a glue stick and a pencil', tip: 'Leave tiny gaps between the squares. That is what makes it a mosaic!', steps: [
      ['Draw a big heart with a pencil. Cut lots of little paper squares. A grown-up can help.', wide(ap(mhD), 2)],
      ['Glue red squares all along the edge, just inside the line.', paint('#D9342B', mhTiles[0].join(''))],
      ['Glue pink squares in the next row.', paint('#F47A9A', mhTiles[1].join(''))],
      ['Fill the middle with light pink squares.', paint('#FFC2D4', mhTiles[2].join(''))],
      ['Glue a few gold squares around it for sparkle. Give it to someone you love!', paint('#F2C230', [[24, 24, 10], [176, 26, -12], [20, 150, 14], [180, 150, -8], [40, 186, 6], [160, 186, -14], [100, 190, 10]].map(([x, y, r]) => `<rect x="${x - 4.5}" y="${y - 4.5}" width="9" height="9" transform="rotate(${r} ${x} ${y})"/>`).join(''))]] },
    { id: 'a8-buttons', cat: 'mosaic', level: 1, title: 'Button flower mosaic', ico: '🔘',
      need: 'Lots of buttons or bottle caps, card, a pencil, glue and a grown-up', tip: 'Sort the buttons by colour first. It makes gluing easier!', steps: [
      ['Draw a flower with a pencil: a circle, 6 petals, a stem and two leaves.', ac(100, 70, 16) + around(6, 36, 100, 70, (x, y, a) => ell(x, y, 13, 18, deg(a) + 90)) + al(100, 124, 100, 190) + ap(leafD(100, 172, 68, 152, 12)) + ap(leafD(100, 158, 132, 138, 12))],
      ['Ask a grown-up for glue. Fill the middle with yellow buttons.', btn(100, 70, 6, '#FFD84D') + around(6, 10.5, 100, 70, (x, y) => btn(x, y, 4, '#FFC23D'))],
      ['Fill each petal with pink and blue buttons.', around(6, 0, 100, 70, (x, y, a, i) => bfPetalA(a).map(([bx, by, r]) => btn(bx, by, r, i % 2 ? '#7FB5F0' : '#F78FB3')).join(''))],
      ['Glue green buttons along the stem and on the leaves.', [134, 146, 158, 170, 182].map(y => btn(100, y, 5, '#5DB360')).join('') + btn(84, 162, 4.5, '#8BD17C') + btn(74, 156, 3.5, '#8BD17C') + btn(116, 148, 4.5, '#8BD17C') + btn(126, 142, 3.5, '#8BD17C')],
      ['Glue a bottle cap in the corner for a sun.', solid('#F59E2E', apg(starPts(168, 30, 18, 15, 18))) + solid('#FFC23D', ac(168, 30, 12))],
      ['Let the glue dry flat. Show someone your button garden!', [20, 40, 60, 140, 160, 180].map(x => btn(x, 192, 4, '#A0703F')).join('')]] },
    { id: 'a8-tissueglass', cat: 'mosaic', level: 2, title: 'Tissue stained-glass window', ico: '⛪',
      need: 'Black paper, tissue paper, glue or sticky-back plastic, and a grown-up', tip: 'Overlap two colours of tissue and watch a new colour appear!', steps: [
      ['Ask a grown-up to cut an arch window shape from black paper, with the middle cut out.', pev('#1E1E2A', sgOuter + ' ' + sgInner) + ap(sgOuter) + ap(sgInner) + clipDef('a8sg', sgInner)],
      ['Glue black strips across, like window bars.', solid('#1E1E2A', ar(95, 36, 10, 136) + ar(54, 110, 92, 10))],
      ['Glue blue and purple tissue in the top part.', T('#9CCBF5', inClip(['a8sg'], ar(40, 20, 120, 95))) + sgPieces([[74, 62, 20, 3], [128, 70, 20, 5], [104, 44, 16, 7]], '#C7A6EE')],
      ['Glue yellow and orange tissue in the bottom part.', T('#FFE27A', inClip(['a8sg'], ar(40, 115, 120, 70))) + sgPieces([[76, 150, 20, 9], [126, 138, 20, 11]], '#FFB060')],
      ['Add little pink and green pieces on top. See the new colours?', sgPieces([[66, 96, 10, 13], [134, 98, 10, 15], [70, 128, 9, 17], [132, 162, 10, 19]], '#F7A0C8') + sgPieces([[86, 82, 9, 21], [118, 54, 8, 23], [88, 168, 9, 25], [140, 124, 8, 27]], '#A8E39A')],
      ['Tape it to a sunny window and watch the light shine through!', solid('#FFD84D', ac(180, 22, 10)) + around(8, 0, 180, 22, (x, y, a) => al(f1(180 + 13 * Math.cos(a)), f1(22 + 13 * Math.sin(a)), f1(180 + 18 * Math.cos(a)), f1(22 + 18 * Math.sin(a))))]] },
    { id: 'a8-blackglue', cat: 'mosaic', level: 2, title: 'Black-glue stained-glass owl', ico: '🖤',
      need: 'White glue, black paint, card, a pencil, and pastels or paint', tip: 'The glue must dry overnight. Waiting is part of the magic!', steps: [
      ['Draw an owl with a pencil: a big round body with two pointy ears.', pencil(ap(owlD))],
      ['Add big round eyes, a beak and two wings.', pencil(owlFace + ap(owlWings))],
      ['Ask a grown-up to mix black paint into white glue. Squeeze it over all the lines.', glue(ap(owlD) + owlFace + ap(owlWings))],
      ['Add glue feathers on the tummy and dots in the eyes. Let it dry overnight.', glue(owlBelly) + paint('#1B1B2F', ac(80, 88, 7) + ac(120, 88, 7))],
      ['Colour the eyes yellow and the beak orange.', T('#FFD84D', ac(80, 88, 19) + ac(120, 88, 19)) + T('#F59E2E', apg('92,108 108,108 100,124'))],
      ['Colour the body light brown and the wings dark brown.', T('#D9A86C', ap(owlD + ' ' + circ(80, 88, 19) + ' ' + circ(120, 88, 19) + ' M92 108 L108 108 L100 124 Z'), true) + T('#A9774E', ap('M44.9 100.2 Q80 128 72 170.9 A56 68 0 0 1 44.9 100.2 Z M155.1 100.2 Q120 128 128 170.9 A56 68 0 0 0 155.1 100.2 Z'))],
      ['Colour the background blue. Hang it in a window!', T('#9CCBF0', ap('M0 0 H200 V200 H0 Z ' + owlD), true)]] },
    { id: 'a8-pixel', cat: 'mosaic', level: 3, title: 'Pixel mosaic cat', ico: '👾',
      need: 'Squared paper (or draw a grid with a ruler) and felt-tip pens', tip: 'Each square is one tile. Count across and down to put it in the right place.', steps: [
      ['Draw a grid: 12 squares across and 10 squares down.', pxGrid],
      ['Colour the outline squares black: two ears on top, then all around the face.', pxCells('o')],
      ['Fill the face with orange squares.', pxCells('f')],
      ['Colour the eyes: 3 green squares and 1 black square each.', pxCells('ek')],
      ['Colour the nose and the inside of the ears pink, and the chin cream.', pxCells('pw')],
      ['Colour all the background squares light blue.', pxCells('.')],
      ['Glue it on card. Now make your own pixel animal to keep it company!', stroke('#3D7DD8', wide(ar(14, 27, 172, 146, 6), 5))]] }
  );
})();
