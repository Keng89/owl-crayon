/* ---------- art7: 3 more lessons in each of the 12 newer kinds (vehicles to famous styles) ---------- */
// Uses the helpers from art.js. Wrapped in a block so the little helpers below never clash with other files.
ART_LATER.push(/*lazy{*/() => {
  const f1 = n => +n.toFixed(1);
  // Colour that soaks in like a marker: lines underneath stay visible (multiply blend). ev = holes via even-odd.
  const T = (c, s, ev) => `<g class="pt" style="fill:${c};mix-blend-mode:multiply${ev ? ';fill-rule:evenodd' : ''}">${s}</g>`;
  // A thick coloured stroke (a rope of clay, a finger of paint, a fat marker line).
  const fat = (c, d, w) => `<g class="sk" style="--sk:${c}"><path d="${d}" style="stroke-width:${w}"/></g>`;
  const rope = (d, w, c = '#E8B48A', e = '#B97A50') => fat(e, d, w + 3) + fat(c, d, w);
  const clay = (s, c = '#E8B48A', e = '#B97A50') => paint(c, s) + stroke(e, s);
  const shine = (x, y, rx, ry) => paint('rgba(255,255,255,.6)', ae(x, y, rx, ry));
  const wide = (s, w) => s.replace(/\/>/g, ` style="stroke-width:${w}"/>`);
  const ink = (x, y, t, size, c = '#22305A') => paint(c, atext(x, y, t, size));
  const dark = s => paint('#22305A', s);
  const mirror = s => `<g transform="matrix(-1 0 0 1 200 0)">${s}</g>`;
  const circ = (cx, cy, r) => `M${f1(cx - r)} ${cy} a${r} ${r} 0 1 0 ${f1(2 * r)} 0 a${r} ${r} 0 1 0 ${f1(-2 * r)} 0 Z`;
  const around = (n, R, cx, cy, f, a0 = -Math.PI / 2) => Array.from({ length: n }, (_, i) => { const a = a0 + i * 2 * Math.PI / n; return f(f1(cx + R * Math.cos(a)), f1(cy + R * Math.sin(a)), a); }).join('');
  const starPts = (cx, cy, R, r, n = 5, rot = 0) => Array.from({ length: n * 2 }, (_, i) => {
    const a = (i * 180 / n - 90 + rot) * Math.PI / 180, d = i % 2 ? r : R;
    return `${f1(cx + d * Math.cos(a))},${f1(cy + d * Math.sin(a))}`;
  }).join(' ');
  const sparkle = (x, y, s = 6) => apg(starPts(x, y, s, s * 0.3, 4));
  // A stadium (rounded strip) from one point to another, w wide.
  const cap = (x1, y1, x2, y2, w) => {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L * w / 2, ny = dx / L * w / 2, r = w / 2;
    return ap(`M${f1(x1 + nx)} ${f1(y1 + ny)} L${f1(x2 + nx)} ${f1(y2 + ny)} A${r} ${r} 0 0 0 ${f1(x2 - nx)} ${f1(y2 - ny)} L${f1(x1 - nx)} ${f1(y1 - ny)} A${r} ${r} 0 0 0 ${f1(x1 + nx)} ${f1(y1 + ny)} Z`);
  };
  // A leaf from its base to its tip, w wide.
  const leafD = (bx, by, tx, ty, w) => {
    const mx = (bx + tx) / 2, my = (by + ty) / 2, L = Math.hypot(tx - bx, ty - by), nx = -(ty - by) / L * w, ny = (tx - bx) / L * w;
    return `M${bx} ${by} Q${f1(mx + nx)} ${f1(my + ny)} ${tx} ${ty} Q${f1(mx - nx)} ${f1(my - ny)} ${bx} ${by} Z`;
  };
  const spiral = (cx, cy, R, turns, a0 = 0) => {
    const n = Math.round(turns * 36), pts = [];
    for (let i = 0; i <= n; i++) { const t = i / n, a = a0 + t * turns * 2 * Math.PI, r = 2 + t * (R - 2); pts.push(`${f1(cx + r * Math.cos(a))} ${f1(cy + r * Math.sin(a))}`); }
    return 'M' + pts.join(' L');
  };
  const rotE = (x, y, rx, ry, deg) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${deg} ${x} ${y})"/>`;
  // A point on a cubic curve, and a little spike standing on it (for dino backs).
  const bez = (p, t) => { const m = 1 - t; return [0, 1].map(k => m ** 3 * p[0][k] + 3 * m * m * t * p[1][k] + 3 * m * t * t * p[2][k] + t ** 3 * p[3][k]); };
  const spike = (p, t, h) => {
    const [x0, y0] = bez(p, t - 0.035), [x1, y1] = bez(p, t + 0.035), [xm, ym] = bez(p, t);
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
    return apl(`${f1(x0)},${f1(y0)} ${f1(xm + dy / L * h)},${f1(ym - dx / L * h)} ${f1(x1)},${f1(y1)}`);
  };
  const P = 'Paper, a pencil and crayons';
  const PE = 'Paper, a pencil, an eraser and crayons';

  /* ---------------- Vehicles ---------------- */
  const ftBody = 'M15 95 H135 V150 H15 Z', ftCab = 'M135 150 V72 H160 L185 104 V150 Z', ftWin = 'M141 79 H157 L176 104 H141 Z';
  const ftWheels = [42, 100, 160];
  const subBody = ar(22, 92, 150, 58, 29), subTower = 'M78 92 V70 Q78 62 86 62 H112 Q120 62 120 70 V92', subScope = 'M96 62 V32 H118 V42 H104 V62';
  const subPorts = [62, 97, 132];
  const dgBucket = 'M22 122 H43 Q48 144 32 152 H14 Q10 136 22 122 Z';
  LESSONS.push(
    { id: 'a7-firetruck', cat: 'vehicles', level: 1, title: 'A fire truck', ico: '🚒', need: P, tip: 'Red is the classic fire truck color, but yellow ones are real too!', steps: [
      ['Draw a long box for the back of the fire truck.', ar(15, 95, 120, 55, 4)],
      ['Draw the cab at the front, with a slanted nose and a big window.', ap(ftCab) + ap(ftWin)],
      ['Draw three wheels under the truck. Put a dot in each one.', ftWheels.map(x => ac(x, 163, 13) + ac(x, 163, 4)).join('')],
      ['Draw a long ladder on top: two lines, with steps in between.', al(20, 78, 128, 78) + al(20, 88, 128, 88) + [28, 40, 52, 64, 76, 88, 100, 112, 124].map(x => al(x, 78, x, 88)).join('') + al(32, 88, 32, 95) + al(116, 88, 116, 95)],
      ['Add a siren light on the roof, a round hose and a stripe.', ar(141, 64, 14, 8, 3) + al(138, 58, 134, 52) + al(148, 56, 148, 49) + al(158, 58, 162, 52) + ac(45, 120, 13) + ac(45, 120, 5) + al(66, 132, 185, 132)],
      ['Draw the road. Color your fire truck red. Nee-naw!', al(0, 177, 200, 177) + T('#F2604F', ap(ftBody + ' ' + ftCab + ' ' + ftWin + ' ' + circ(45, 120, 13)), true) + T('#BFE3F7', ap(ftWin)) + T('#FFD966', ac(45, 120, 13)) + T('#5BC0EB', ar(141, 64, 14, 8, 3)) + T('#8F9BB0', ftWheels.map(x => ac(x, 163, 13)).join('')) + T('#C9D3E0', ar(20, 78, 108, 10))]] },
    { id: 'a7-sub', cat: 'vehicles', level: 1, title: 'A yellow submarine', ico: '⚓', need: P, tip: 'Round windows on a boat are called portholes.', steps: [
      ['Draw a long shape with round ends. That is the submarine.', subBody],
      ['Draw a tower on top, like a little hat.', ap(subTower)],
      ['Draw a bendy periscope on the tower. It peeks out of the water!', ap(subScope)],
      ['Draw three round windows. Put a smaller circle inside each one.', subPorts.map(x => ac(x, 121, 10) + ac(x, 121, 6)).join('')],
      ['Add a propeller at the back to push it along.', al(172, 121, 182, 121) + ae(186, 111, 4, 9) + ae(186, 131, 4, 9)],
      ['Draw the water on top, bubbles, a fish and seaweed. Color it yellow!', ap('M0 46 q11.5 -7 23 0 t23 0 t23 0 t23 0') + ap('M124 46 q12.7 -7 25.3 0 t25.3 0 t25.3 0') + ac(190, 92, 4) + ac(184, 78, 5) + ac(192, 64, 3) + ae(38, 72, 11, 6) + apg('49,72 57,66 57,78') + ac(33, 70, 1.5) + ap('M18 198 q-8 -12 0 -24 t0 -24') + ap('M150 198 q8 -12 0 -24 t0 -24') + T('#FFD966', subBody + ap(subTower + ' Z') + ap(subScope + ' Z')) + T('#9CCBF5', subPorts.map(x => ac(x, 121, 6)).join('')) + T('#FF9F43', ae(38, 72, 11, 6) + apg('49,72 57,66 57,78')) + T('#6CC08B', ap('M18 198 q-8 -12 0 -24 t0 -24') + ap('M150 198 q8 -12 0 -24 t0 -24'))]] },
    { id: 'a7-digger', cat: 'vehicles', level: 3, title: 'A big digger', ico: '🚧', need: PE, tip: 'Long arms are made of parts joined by round pins. Machines bend at the pins.', steps: [
      ['Draw light guides: a ground line, and a big box where the digger goes.', guide(al(0, 180, 200, 180) + ar(60, 74, 124, 104))],
      ['Draw the tracks: a long shape with round ends. Put wheels inside.', ar(60, 148, 124, 30, 15) + ac(75, 163, 10) + ac(169, 163, 10) + ac(106, 163, 6) + ac(138, 163, 6)],
      ['Draw the body on the tracks, and a cab with a big window on top.', ar(70, 118, 104, 30, 4) + ar(120, 74, 46, 44, 4) + ar(127, 80, 32, 24, 3)],
      ['Draw a long arm going up from the body. Put a round pin at the top.', al(63.2, 48.6, 95.8, 118) + al(48.8, 55.4, 78.2, 118) + ac(56, 52, 8)],
      ['Draw the second arm coming down from the pin.', al(60, 59, 38.4, 122) + al(48.6, 55.1, 25.7, 122)],
      ['Draw a bucket on the end, with teeth for digging. Scoop!', ap(dgBucket) + apl('14,152 16,159 20,152 24,159 28,152')],
      ['Add a smoke pipe, a push rod on the arm, and a pile of dirt.', ar(100, 104, 7, 14, 1) + al(108, 118, 90, 98) + al(113, 118, 93, 96) + ap('M0 180 Q16 162 44 180') + ac(14, 174, 2) + ac(30, 172, 2)],
      ['Erase the guides. Draw the ground and color your digger yellow with dark tracks!', al(44, 180, 200, 180) + T('#FFC23D', ar(70, 118, 104, 30, 4) + ar(120, 74, 46, 44, 4) + apg('63.2,48.6 95.8,118 78.2,118 48.8,55.4') + apg('60,59 38.4,122 25.7,122 48.6,55.1') + ac(56, 52, 8)) + T('#BFE3F7', ar(127, 80, 32, 24, 3)) + T('#7B8494', ar(60, 148, 124, 30, 15) + ap(dgBucket)) + T('#C99A6E', ap('M0 180 Q16 162 44 180 Z')), { clear: true }]] }
  );

  /* ---------------- Ocean ---------------- */
  const claw = ap('M58 107.8 Q44 102 40 86') + ap('M40 86 C20 84 16 60 30 52 L36 66 L44 54 C54 62 52 82 40 86 Z');
  const crabLegs = ap('M56.8 130.3 l-18 4 l-8 14') + ap('M64.8 139.3 l-14 10 l-4 14') + ap('M77 146 l-8 12 l0 12');
  const fishStar = apg(starPts(70, 105, 48, 22));
  const armDots = [0.5, 0.78].map(k => around(5, 48 * k, 70, 105, (x, y) => ac(x, y, 2.6))).join('');
  const scallop = 'M140 176 L118 146 Q120 116 150 112 Q180 116 182 146 L160 176 Z';
  const shark = 'M14 110 C30 80 100 72 158 96 L188 60 L176 104 L190 144 L158 112 C110 134 40 136 14 110 Z';
  const sharkTop = 'M14 110 C30 80 100 72 158 96 L188 60 L176 104 L190 144 L158 112 L156 109 C110 124 60 128 30 120 Z';
  const sharkFin = 'M62 84 Q74 64 92 44 Q90 66 96 82', sharkSide = 'M94 128.3 Q100 150 120 158 Q114 140 110.6 126.2';
  LESSONS.push(
    { id: 'a7-crab', cat: 'ocean', level: 1, title: 'A happy crab', ico: '🦀', need: P, tip: 'Crabs walk sideways! Try walking like a crab when you finish.', steps: [
      ['Draw a wide oval for the body.', ae(100, 120, 46, 30)],
      ['Draw two eye stalks on top, with round eyes.', al(86, 91.4, 82, 70) + al(114, 91.4, 118, 70) + ac(81, 64, 7) + ac(119, 64, 7) + dark(ac(82, 65, 3) + ac(118, 65, 3))],
      ['Draw two big claws. Each one looks like a mouth that can pinch!', claw + mirror(claw)],
      ['Draw 3 skinny, bendy legs on each side.', crabLegs + mirror(crabLegs)],
      ['Give it a big smile.', ap('M84 126 q16 14 32 0')],
      ['Draw wavy sand and bubbles. Color your crab red or orange!', ap('M0 182 q25 -6 50 0 t50 0 t50 0 t50 0') + ac(170, 30, 5) + ac(182, 16, 3) + ac(24, 30, 4) + T('#F2604F', ae(100, 120, 46, 30) + ap('M40 86 C20 84 16 60 30 52 L36 66 L44 54 C54 62 52 82 40 86 Z') + mirror(ap('M40 86 C20 84 16 60 30 52 L36 66 L44 54 C54 62 52 82 40 86 Z')) + ac(81, 64, 7) + ac(119, 64, 7)) + T('#F6DFA4', ap('M0 182 q25 -6 50 0 t50 0 t50 0 t50 0 V200 H0 Z'))]] },
    { id: 'a7-starfish', cat: 'ocean', level: 1, title: 'Starfish and shells', ico: '⭐', need: P, tip: 'Next time you visit a beach, look for shells with lines and swirls.', steps: [
      ['Draw a big star with 5 fat arms. That is a starfish!', fishStar],
      ['Give it a happy face in the middle.', ac(62, 100, 3) + ac(78, 100, 3) + ap('M62 109 q8 7 16 0')],
      ['Draw little dots along every arm.', armDots],
      ['Draw a shell like a fan: a round top and two lines that meet at the bottom.', ap(scallop)],
      ['Draw lines on the fan shell, from the bottom up to the top.', al(150, 176, 132, 122) + al(150, 176, 150, 113) + al(150, 176, 168, 122) + al(144, 176, 124, 136) + al(156, 176, 176, 136)],
      ['Draw a swirly snail shell at the top.', ap(spiral(152, 52, 24, 2.6, 0.5))],
      ['Draw wavy sand. Color the starfish orange and the shells pink and purple.', ap('M0 186 q25 -6 50 0 t50 0 t50 0 t50 0') + ac(30, 172, 1.5) + ac(96, 176, 1.5) + ac(186, 176, 1.5) + T('#FF9F43', fishStar) + T('#F7A8C4', ap(scallop)) + T('#CFC4F0', ac(152, 52, 24)) + T('#F6DFA4', ap('M0 186 q25 -6 50 0 t50 0 t50 0 t50 0 V200 H0 Z'))]] },
    { id: 'a7-shark', cat: 'ocean', level: 2, title: 'A friendly shark', ico: '🦈', need: P, tip: 'Sharks are dark on top and white underneath. It helps them hide!', steps: [
      ['Draw a long body with a pointy nose, and a tail like a big V.', ap(shark)],
      ['Draw a tall fin on its back.', ap(sharkFin)],
      ['Add a round eye and a friendly smile.', ac(40, 99, 4.5) + dark(ac(41, 99, 2)) + ap('M18 112 q12 6 26 2')],
      ['Draw 3 gill lines. Sharks breathe through them!', ap('M64 96 q-4 9 0 18 M72 95 q-4 10 0 20 M80 95 q-4 10 0 20')],
      ['Draw a fin underneath, and a line for the white tummy.', ap(sharkSide) + ap('M30 120 C60 128 110 124 156 109')],
      ['Draw two little fish swimming away, and some bubbles.', ae(160, 30, 10, 6) + apg('170,30 178,25 178,35') + ae(40, 170, 10, 6) + apg('50,170 58,165 58,175') + ac(8, 92, 3) + ac(12, 78, 4) + ac(6, 62, 3)],
      ['Color the top grey-blue and keep the tummy white.', T('#8FA9C9', ap(sharkTop) + ap(sharkFin + ' Z')) + T('#FFD966', ae(160, 30, 10, 6) + apg('170,30 178,25 178,35')) + T('#F78FB3', ae(40, 170, 10, 6) + apg('50,170 58,165 58,175'))]] }
  );

  /* ---------------- Bugs & birds ---------------- */
  const cat = [[36, 130], [68, 120], [100, 130], [132, 120]];
  const catFeet = cat.map(([x, y]) => al(x - 6, y + 15.6, x - 8, y + 24) + al(x + 6, y + 15.6, x + 8, y + 24)).join('');
  const munchLeaf = 'M18 98 Q24 34 96 24 Q92 48 80 62 A7 7 0 0 0 72 72 A7 7 0 0 0 62 80 Q44 96 18 98 Z';
  const duckBody = 'M55.9 78.9 C48 96 36 108 38 126 C42 152 78 162 112 160 C150 158 168 140 174 114 L190 100 L162 106 C140 112 118 108 98 104 C90 98 86 90 84.1 78.9';
  const duckWing = 'M98 124 Q120 108 152 116 Q146 142 112 142 Q96 138 98 124 Z';
  const flBody = ae(118, 92, 36, 22), flNeck = ap('M82.6 88 C56 76 52 52 70 40 Q76 35 83 34') + ap('M93.3 76 C72 68 66 54 76 46 Q80 42 85.6 40.4');
  const flWing = 'M100 88 Q126 74 150 88 Q138 102 112 101 Q100 99 100 88 Z';
  LESSONS.push(
    { id: 'a7-caterpillar', cat: 'bugs', level: 1, title: 'A hungry caterpillar', ico: '🐛', need: P, tip: 'Make each circle touch the next one, like beads on a string.', steps: [
      ['Draw 4 circles in a wiggly row. Make them touch.', cat.map(([x, y]) => ac(x, y, 16.7)).join('')],
      ['Draw a bigger circle at the front for the head.', ac(164, 102, 20)],
      ['Give it eyes, a big smile and two feelers.', dark(ac(157, 97, 3.5) + ac(172, 97, 3.5)) + ap('M155 108 q9 9 18 0') + al(156, 83.7, 148, 66) + al(172, 83.7, 180, 66) + ac(147, 63, 3.5) + ac(181, 63, 3.5)],
      ['Draw two little feet under every circle.', catFeet],
      ['Draw the leaf it is munching, with bites taken out!', ap(munchLeaf) + al(10, 106, 18, 98) + ap('M18 98 Q50 66 90 30')],
      ['Color it green with yellow spots. One day it will be a butterfly!', T('#8BD17C', cat.map(([x, y]) => ac(x, y, 16.7)).join('') + ac(164, 102, 20)) + T('#FFD966', cat.map(([x, y]) => ac(x, y - 4, 5)).join('')) + T('#F78FB3', ac(150, 110, 4) + ac(178, 110, 4)) + T('#4FB06A', ap(munchLeaf))]] },
    { id: 'a7-duck', cat: 'bugs', level: 1, title: 'A duck on a pond', ico: '🦆', need: P, tip: 'A duck floats, so you only see the top of it above the water.', steps: [
      ['Draw a circle for the head.', ac(70, 62, 22)],
      ['Draw a big round body, with a pointy tail sticking up at the back.', ap(duckBody)],
      ['Draw a flat, round beak.', ap('M48.8 56 Q28 54 26 64 Q30 72 49.5 70') + ap('M48 63 Q38 64 30 64')],
      ['Add an eye and a wing on the side.', dark(ac(66, 56, 3.5)) + ap(duckWing)],
      ['Draw ripples in the water around it.', ap('M0 152 q8 -6 16 0 t16 0') + ap('M176 150 q6 -6 12 0 t12 0') + ap('M30 176 q15 -8 30 0 t30 0 t30 0 t30 0 t30 0')],
      ['Color your duck yellow with an orange beak, and the pond blue. Quack!', T('#FFD966', ac(70, 62, 22) + ap(duckBody + ' Z')) + T('#FF9F43', ap('M48.8 56 Q28 54 26 64 Q30 72 49.5 70 Z')) + T('#9CCBF5', ap('M0 166 q12.5 -6 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 V200 H0 Z'))]] },
    { id: 'a7-flamingo', cat: 'bugs', level: 2, title: 'A flamingo', ico: '🦩', need: P, tip: 'Flamingos rest on one leg. The bent leg looks like the number 4!', steps: [
      ['Draw an oval for the body.', flBody],
      ['Draw a long neck that bends like the letter S.', flNeck],
      ['Draw a small round head, and a beak that bends down.', ac(92, 34, 9) + ap('M101 31 L114 34 Q116 43 110 49 Q109 40 100.5 38')],
      ['Add an eye, a wing and a little pointy tail.', dark(ac(90, 31, 2)) + ap(flWing) + ap('M154 90 L168 86 L160 98')],
      ['Draw one long, straight leg and a webbed foot.', al(112, 113.7, 112, 184) + ap('M102 189 L112 183 L122 189') + ac(112, 150, 2.5)],
      ['Draw the other leg bent back, like the number 4.', ap('M126 113.4 L130 140 L150 128')],
      ['Draw the water, and color your flamingo pink with a black beak tip.', ap('M28 190 q10 -6 20 0 t20 0 t20 0') + ap('M134 190 q10 -6 20 0 t20 0 t20 0') + T('#F7A8C4', flBody + ap('M82.6 88 C56 76 52 52 70 40 Q76 35 83 34 L85.6 40.4 Q80 42 76 46 C66 54 72 68 93.3 76 Z') + ac(92, 34, 9)) + T('#F2789F', ap(flWing)) + dark(ap('M112 41 Q116 43 110 49 Q109 44 108 42 Z')) + T('#F2789F', ap('M101 31 L114 34 Q116 43 110 49 Q109 40 100.5 38 Z'))]] }
  );

  /* ---------------- Dinosaurs ---------------- */
  const eggBot = 'M50 120 Q48 182 100 182 Q152 182 150 120 L140 110 L128 122 L114 108 L100 122 L86 108 L72 122 L60 110 Z';
  const eggTop = 'M72 62 Q96 14 134 56 L126 50 L118 58 L110 50 L102 58 L94 50 L86 58 L80 52 Z';
  const dinoHead = 'M66 116 C56 92 60 72 72 62 L80 52 L86 58 L94 50 L102 58 L110 50 L118 58 L126 50 L134 56 C146 70 148 94 134 116 L128 122 L114 108 L100 122 L86 108 L72 122 Z';
  const ptWing = ap('M88.7 92 L12 70 Q30 88 34 112 Q58 104 88.7 116');
  const ankBack = [[36, 142], [40, 80], [150, 76], [166, 142]];
  const ankBody = 'M36 142 C40 80 150 76 166 142 Z';
  const ankPlates = [[72, 104], [90, 100], [108, 99], [126, 101], [143, 108], [56, 124], [74, 120], [92, 118], [110, 118], [128, 120], [146, 124]];
  LESSONS.push(
    { id: 'a7-egg', cat: 'dino', level: 1, title: 'Baby dino in an egg', ico: '🥚', need: P, tip: 'Big eyes and a big head make any animal look like a baby.', steps: [
      ['Draw the bottom of an egg, with a zig-zag on top. It is cracking!', ap(eggBot)],
      ['Draw the top piece of the shell up high, like a hat.', ap(eggTop)],
      ['Join them with two curvy lines. That is the baby dino head!', ap('M66 116 C56 92 60 72 72 62') + ap('M134 116 C146 94 148 70 134 56')],
      ['Give it big round eyes, a nose and a happy smile.', ac(86, 84, 8) + ac(114, 84, 8) + dark(ac(87, 85, 3.5) + ac(113, 85, 3.5)) + ac(95, 98, 1.5) + ac(105, 98, 1.5) + ap('M86 104 q14 10 28 0')],
      ['Draw tiny hands holding the edge of the egg.', ap('M54 114 a4 4 0 0 1 6 -6 a4 4 0 0 1 6 2') + ap('M146 114 a4 4 0 0 0 -6 -6 a4 4 0 0 0 -6 2')],
      ['Add spots on the egg and a nest. Color your baby dino. Hello, world!', ac(70, 150, 6) + ac(120, 160, 8) + ac(98, 140, 4) + ac(134, 138, 5) + ap('M28 184 Q100 198 172 184') + ap('M36 190 l14 -6 M150 190 l14 -6 M90 196 l18 -4') + T('#8BD17C', ap(dinoHead)) + T('#FFF0C9', ap(eggBot) + ap(eggTop)) + T('#B9E2C6', ac(70, 150, 6) + ac(120, 160, 8) + ac(98, 140, 4) + ac(134, 138, 5)) + T('#E0B67E', ap('M28 184 Q100 198 172 184 Q100 206 28 184 Z'))]] },
    { id: 'a7-ptero', cat: 'dino', level: 1, title: 'A flying pterosaur', ico: '🦅', need: P, tip: 'Pterosaurs were flying reptiles that lived with the dinosaurs.', steps: [
      ['Draw an oval for the body.', ae(100, 104, 13, 24)],
      ['Draw a round head on top.', ac(100, 66, 12)],
      ['Add a long pointy beak, and a crest on the back of the head.', ap('M88.7 62 L52 72 L88.7 70') + ap('M110.9 61 L138 46 L111.3 70')],
      ['Draw two big wings, wide and pointy, like a kite.', ptWing + mirror(ptWing)],
      ['Give it an eye and two little feet.', dark(ac(96, 63, 2.5)) + ap('M95 127 L93 138 M105 127 L107 138') + ap('M89 140 l4 -2 l4 2 M103 140 l4 -2 l4 2')],
      ['Draw a sun and a smoky volcano below. Color your flyer!', ac(172, 24, 12) + ap('M10 196 L40 152 H58 L88 196') + ac(50, 140, 6) + ac(60, 126, 8) + ac(46, 114, 6) + T('#9C8FD6', ae(100, 104, 13, 24) + ac(100, 66, 12) + ptWing.replace('"/>', ' Z"/>') + mirror(ptWing.replace('"/>', ' Z"/>'))) + T('#FFC23D', ac(172, 24, 12) + ap('M88.7 62 L52 72 L88.7 70 Z')) + T('#F2604F', ap('M110.9 61 L138 46 L111.3 70 Z') + ap('M40 152 H58 L62 158 H36 Z')) + T('#B08463', ap('M10 196 L36 158 H62 L88 196 Z'))]] },
    { id: 'a7-ankylo', cat: 'dino', level: 2, title: 'An armoured ankylosaurus', ico: '🛡️', need: P, tip: 'Its back was covered in hard bony plates, like a turtle shell.', steps: [
      ['Draw a big low hill for the body, flat on the bottom.', ap(ankBody)],
      ['Add a small head at the front, near the ground.', ap('M39 127 Q22 116 10 126 Q6 140 22 144 L37 142')],
      ['Draw a tail with a big round club on the end. Bonk!', ap('M157 122 Q172 120 182.2 112.5') + ap('M166 142 Q182 136 192.6 119.3') + ac(190, 110, 9.6)],
      ['Draw rows of round plates on its back. This is its armour.', ankPlates.map(([x, y]) => ae(x, y, 6, 4.5)).join('')],
      ['Add pointy spikes all along the top of its back.', [0.1, 0.22, 0.34, 0.46, 0.58, 0.7, 0.82, 0.92].map(t => spike(ankBack, t, 10)).join('')],
      ['Draw 4 short, strong legs, an eye and a smile.', ap('M48 142 V162 Q48 166 52 166 H66 Q70 166 70 162 V142') + ap('M78 142 V166 Q78 170 82 170 H96 Q100 170 100 166 V142') + ap('M108 142 V166 Q108 170 112 170 H126 Q130 170 130 166 V142') + ap('M136 142 V162 Q136 166 140 166 H154 Q158 166 158 162 V142') + dark(ac(20, 130, 2.5)) + ap('M10 136 q6 4 12 2')],
      ['Draw some ferns, then color it. It was like a dinosaur tank!', ap('M178 196 Q176 170 186 150 M181 180 l-8 -6 M182 168 l8 -6 M184 158 l-6 -6') + ap('M14 196 Q16 176 8 160 M14 184 l8 -6 M12 172 l-8 -4') + T('#C9A15A', ap(ankBody) + ap('M39 127 Q22 116 10 126 Q6 140 22 144 L37 142 Z') + ap('M157 122 Q172 120 182.2 112.5 L192.6 119.3 Q182 136 166 142 Z') + ar(48, 142, 22, 24, 4) + ar(78, 142, 22, 28, 4) + ar(108, 142, 22, 28, 4) + ar(136, 142, 22, 24, 4)) + T('#9A6A3A', ac(190, 110, 9.6) + ankPlates.map(([x, y]) => ae(x, y, 6, 4.5)).join('')) + stroke('#2FA36B', ap('M178 196 Q176 170 186 150 M181 180 l-8 -6 M182 168 l8 -6 M184 158 l-6 -6') + ap('M14 196 Q16 176 8 160 M14 184 l8 -6 M12 172 l-8 -4'))]] }
  );

  /* ---------------- Food ---------------- */
  const wmSeeds = [[72, 96], [100, 104], [128, 96], [86, 120], [114, 120], [100, 92]].map(([x, y]) => ap(`M${x} ${y - 5} q4 6 0 9 q-4 -3 0 -9`)).join('');
  const ant = (x, y) => ac(x, y, 3) + ac(x + 6, y, 2.5) + ac(x - 6, y, 3.5) + al(x - 2, y + 2, x - 6, y + 8) + al(x, y + 3, x, y + 9) + al(x + 2, y + 2, x + 6, y + 8) + al(x + 7, y - 2, x + 11, y - 7);
  const swTomato = 'M34 140 Q34 129 46 129 H154 Q166 129 166 140 Z';
  const swLettuce = 'M30 140 L22 130 Q28 118 40 124 Q50 116 60 124 Q70 116 80 124 Q90 116 100 124 Q110 116 120 124 Q130 116 140 124 Q150 116 160 124 Q172 118 178 130 L170 140';
  const swCheese = 'M28 104 L16 120 L28 114 H172 L184 120 L172 104';
  const swTop = 'M28 104 Q24 60 100 60 Q176 60 172 104 Z';
  const bowl = 'M24 100 Q28 178 100 178 Q172 178 176 100';
  const noodles = ap('M80 108 q6 -5 12 0 t12 0 t12 0 t12 0 t12 0 t12 0') + ap('M50 114 q6 -5 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0') + ap('M142 100 q6 -5 12 0 t12 0') + ap('M36 98 q4 -5 8 0') + ap('M112 84 q6 -5 12 0 t12 0 t12 0');
  const onions = [[120, 96], [130, 90], [140, 95], [76, 84]];
  LESSONS.push(
    { id: 'a7-watermelon', cat: 'food', level: 1, title: 'A watermelon slice', ico: '🍉', need: P, tip: 'Count the seeds as you draw them. How many did you make?', steps: [
      ['Draw a big half circle, with the flat side on top.', ap('M20 76 A80 80 0 0 0 180 76 Z')],
      ['Draw a curve inside, close to the edge. That is the green skin.', ap('M32 76 A68 68 0 0 0 168 76')],
      ['Draw one more curve just inside it, for the white part.', ap('M38 76 A62 62 0 0 0 162 76')],
      ['Draw black seeds shaped like little drops.', wmSeeds],
      ['Draw three tiny ants coming to share it!', ant(40, 180) + ant(80, 186) + ant(120, 182)],
      ['Color it red inside with a green skin. Yum, summer!', T('#4FB06A', ap('M20 76 A80 80 0 0 0 180 76 Z M32 76 A68 68 0 0 0 168 76 Z'), true) + T('#F2604F', ap('M38 76 A62 62 0 0 0 162 76 Z')) + dark(wmSeeds.replace(/"\/>/g, ' Z"/>'))]] },
    { id: 'a7-sandwich', cat: 'food', level: 1, title: 'A tall sandwich', ico: '🥪', need: P, tip: 'Draw from the bottom up, one layer at a time, just like making a real one.', steps: [
      ['Draw a long, flat box with round corners. That is the bottom bread.', ar(28, 140, 144, 20, 8)],
      ['Draw a red tomato layer on top: a long, flat bump.', ap(swTomato)],
      ['Draw a wiggly line for the lettuce.', ap(swLettuce)],
      ['Draw a cheese slice, with pointy corners sticking out.', ap(swCheese)],
      ['Draw the top bread like a big round hill.', ap(swTop)],
      ['Add seeds on the bread and a toothpick with a flag.', al(100, 60, 100, 28) + apg('100,28 122,34 100,40') + [[70, 80], [88, 72], [112, 72], [130, 80], [80, 92], [120, 92], [100, 86]].map(([x, y]) => ae(x, y, 3, 1.6)).join('')],
      ['Color each layer. What would YOU put in your sandwich?', T('#F2C98B', ar(28, 140, 144, 20, 8) + ap(swTop)) + T('#F2604F', ap(swTomato)) + T('#6CC08B', ap(swLettuce + ' Z ' + swTomato), true) + T('#FFD966', ap(swCheese + ' Z')) + T('#5BC0EB', apg('100,28 122,34 100,40'))]] },
    { id: 'a7-noodles', cat: 'food', level: 2, title: 'A bowl of noodles', ico: '🍜', need: P, tip: 'Seen from the side, the round top of a bowl looks like an oval.', steps: [
      ['Draw a wide oval for the top of the bowl.', ae(100, 100, 76, 22)],
      ['Draw the round bottom of the bowl, and a little foot.', ap(bowl) + ap('M74 175 L70 188 H130 L126 175')],
      ['Put half a boiled egg and a swirly fish cake on top.', ae(62, 98, 15, 10) + ac(62, 98, 5) + ac(98, 92, 9) + ap(spiral(98, 92, 6, 1.6))],
      ['Draw wiggly noodles all around them.', noodles],
      ['Sprinkle little green onion circles.', onions.map(([x, y]) => ac(x, y, 3)).join('')],
      ['Draw steam rising, and chopsticks beside the bowl.', ap('M70 70 q-6 -8 0 -16 t0 -16 M100 66 q-6 -8 0 -16 t0 -16 M130 70 q-6 -8 0 -16 t0 -16') + al(150, 196, 196, 140) + al(158, 199, 199, 148)],
      ['Add a pattern on the bowl. Color your soup!', ap('M34 134 l8 8 l8 -8 l8 8 l8 -8 M134 134 l8 8 l8 -8 l8 8 l8 -8') + T('#F2604F', ap(bowl + ' Q100 122 24 100 Z') + ap('M74 175 L70 188 H130 L126 175 Z')) + T('#FFE6A8', ae(100, 100, 76, 22)) + T('#FFC23D', ac(62, 98, 5)) + T('#F7A8C4', ac(98, 92, 9)) + T('#6CC08B', onions.map(([x, y]) => ac(x, y, 3)).join('')) + stroke('#B97A50', al(150, 196, 196, 140) + al(158, 199, 199, 148))]] }
  );

  /* ---------------- Fairy tales & magic ---------------- */
  const potWave = 'M56.6 118 q10.85 -7 21.7 0 t21.7 0 t21.7 0 t21.7 0';
  const gnHat = 'M60 92 Q86 56 100 8 Q114 56 140 92 Z';
  const gnBeard = 'M64 92 C54 130 76 160 100 172 C124 160 146 130 136 92';
  const gnBody = 'M63 124 Q50 140 54 176 H146 Q150 140 137 124';
  const helm = 'M52 160 V88 Q52 28 100 28 Q148 28 148 88 V160 Z';
  const plume = 'M96 28.2 Q104 6 132 6 Q164 8 176 34 Q156 22 138 24 Q118 26 110 29';
  const holes = [114, 124, 134].map(x => [108, 118, 128].map(y => ac(x, y, 2.4)).join('')).join('');
  LESSONS.push(
    { id: 'a7-potion', cat: 'fantasy', level: 1, title: 'A magic potion', ico: '🧪', need: P, tip: 'Make up a name for your potion, like Giggle Juice!', steps: [
      ['Draw a big round bottle. Leave a gap at the top.', ap('M90 86.1 A45 45 0 1 0 110 86.1')],
      ['Draw a neck going up from the gap, and a rim on top.', al(90, 86.1, 90, 56) + al(110, 86.1, 110, 56) + ar(85, 48, 30, 8, 3)],
      ['Push a cork into the top.', ap('M90 48 V38 Q100 32 110 38 V48')],
      ['Draw a wavy line for the magic potion inside.', ap(potWave)],
      ['Add bubbles in the potion and a star on the bottle.', ac(74, 136, 5) + ac(128, 140, 4) + ac(86, 158, 3) + ac(118, 160, 3) + apg(starPts(100, 145, 13, 6))],
      ['Draw magic swirls and sparkles coming out. What does your potion do?', ap('M100 32 q-14 -8 -2 -16 q12 -8 -2 -14') + sparkle(130, 24, 7) + sparkle(66, 30, 6) + sparkle(160, 70, 6) + sparkle(36, 76, 5) + T('#B98CE8', ap(potWave + ' A45 45 0 1 1 56.6 118 Z')) + T('#FFD966', apg(starPts(100, 145, 13, 6))) + T('#C99A6E', ap('M90 48 V38 Q100 32 110 38 V48 Z')) + T('#D6EAFC', ap('M56.6 118 A45 45 0 0 1 90 86.1 V56 H110 V86.1 A45 45 0 0 1 143.4 118 Z'))]] },
    { id: 'a7-gnome', cat: 'fantasy', level: 1, title: 'A garden gnome', ico: '🍄', need: P, tip: 'A gnome is mostly hat and beard. Make the hat really tall!', steps: [
      ['Draw a tall pointy hat, like a big triangle.', ap(gnHat)],
      ['Draw a round nose just under the hat.', ac(100, 102, 10)],
      ['Draw a big beard around the nose, coming down to a point.', ap(gnBeard)],
      ['Add happy closed eyes and a curly mustache.', ap('M76 99 q5 -5 10 0 M114 99 q5 -5 10 0') + ap('M100 112 q-12 10 -24 0 M100 112 q12 10 24 0')],
      ['Draw the body peeking out from the beard, and two feet.', ap(gnBody) + ap('M56 176 Q46 178 48 186 H86 Q86 178 82 176') + ap('M144 176 Q154 178 152 186 H114 Q114 178 118 176')],
      ['Draw a mushroom friend and the grass. Color your gnome!', ap('M22 186 V158 H36 V186') + ap('M10 158 Q29 124 48 158 Z') + ac(22, 148, 3) + ac(34, 142, 3) + al(0, 188, 200, 188) + T('#F2604F', ap(gnHat) + ap('M10 158 Q29 124 48 158 Z')) + T('#F5C9A6', ac(100, 102, 10)) + T('#E2E8EF', ap(gnBeard + ' Z')) + `<defs><clipPath id="a7gnome"><path d="${gnBody} Z"/></clipPath></defs><g clip-path="url(#a7gnome)">${T('#5B9BE0', ap(gnBody + ' Z ' + gnBeard + ' Z'), true)}</g>` + T('#8B5E3C', ap('M56 176 Q46 178 48 186 H86 Q86 178 82 176 Z') + ap('M144 176 Q154 178 152 186 H114 Q114 178 118 176 Z')) + T('#B9E2C6', ar(0, 188, 200, 12))]] },
    { id: 'a7-helmet', cat: 'fantasy', level: 2, title: "A knight's helmet", ico: '⚔️', need: PE, tip: 'Both sides of a helmet match. Use the middle line to check!', steps: [
      ['Draw a light line down the middle, so both sides will match.', guide(al(100, 6, 100, 194))],
      ['Draw the helmet: two straight sides and a round top.', ap(helm)],
      ['Draw the bottom part that spreads out, like a skirt.', ap('M52 160 L40 182 H160 L148 160')],
      ['Draw two eye slits and a ridge down the middle.', ar(60, 86, 34, 9, 4.5) + ar(106, 86, 34, 9, 4.5) + al(100, 28, 100, 150)],
      ['Add little breathing holes and a band with round metal dots.', holes + mirror(holes) + al(52, 150, 148, 150) + [62, 76, 90, 110, 124, 138].map(x => ac(x, 155, 1.8)).join('')],
      ['Put a fluffy feather plume on top!', ap(plume) + ap('M110 18 q14 -6 30 -4 M120 14 q20 -4 40 6')],
      ['Erase the guide. Color it shiny silver with a red plume.', T('#C9D3E0', ap(helm) + ap('M52 160 L40 182 H160 L148 160 Z')) + paint('rgba(255,255,255,.7)', ar(60, 104, 8, 40, 4)) + T('#F2604F', ap(plume + ' Z')) + dark(ar(60, 86, 34, 9, 4.5) + ar(106, 86, 34, 9, 4.5)), { clear: true }]] }
  );

  /* ---------------- Comics ---------------- */
  const cloud = 'M92 60 a14 14 0 0 1 8 -28 a18 18 0 0 1 30 -12 a18 18 0 0 1 32 6 a14 14 0 0 1 14 24 a14 14 0 0 1 -16 20 a18 18 0 0 1 -30 2 a18 18 0 0 1 -28 -6 a10 10 0 0 1 -10 -6 Z';
  const catHead = ac(56, 148, 30) + ap('M33 128.7 L30 102 L48.2 119') + ap('M63.8 119 L82 102 L79 128.7');
  const heroArm = ap('M80 58 L54 86 L85 106') + ap('M81.5 72 L66 86 L84.1 98');
  const heroLeg = ap('M86 116 L74 170') + ap('M100 116 L90 170') + ap('M76.2 160 L74 176 Q62 176 62 184 H94 L91.9 160 Z');
  const heroCape = ap('M58.6 89 Q46 136 34 172 Q58 162 78.4 150');
  const panels = [[6, 6], [104, 6], [6, 104], [104, 104]];
  const cone = (cx, cy) => apg(`${cx - 12},${cy} ${cx + 12},${cy} ${cx},${cy + 30}`);
  const scoop = (cx, cy) => `M${cx - 12} ${cy} C${cx - 22} ${cy - 26} ${cx + 22} ${cy - 26} ${cx + 12} ${cy} Z`;
  const happy = (cx, cy) => dark(ac(cx - 5, cy - 9, 1.8) + ac(cx + 5, cy - 9, 1.8)) + ap(`M${cx - 5} ${cy - 4} q5 4 10 0`);
  LESSONS.push(
    { id: 'a7-think', cat: 'comics', level: 1, title: 'A thought bubble', ico: '💭', need: P, tip: 'A cloud with little dots means thinking. A pointy tail means talking.', steps: [
      ['Draw a cat face down in the corner: a circle with two pointy ears.', catHead],
      ['Give the cat eyes looking up, a nose, a mouth and whiskers.', ac(46, 144, 5) + ac(66, 144, 5) + dark(ac(48, 141, 2.5) + ac(68, 141, 2.5)) + apg('53,154 59,154 56,158') + ap('M56 158 q-4 5 -8 1 M56 158 q4 5 8 1') + al(28, 154, 42, 156) + al(28, 162, 42, 160) + al(84, 154, 70, 156) + al(84, 162, 70, 160)],
      ['Draw a big puffy cloud up high. That is a thought bubble!', ap(cloud)],
      ['Draw circles from the cat to the cloud: small, middle, big.', ac(84, 120, 3) + ac(94, 106, 5) + ac(106, 90, 7)],
      ['Draw what the cat is thinking inside the cloud. A yummy fish!', ae(128, 46, 16, 9) + apg('144,46 156,38 156,54') + dark(ac(120, 44, 2))],
      ['Color it in. What is YOUR cat dreaming about?', T('#FF9F43', ac(56, 148, 30) + apg('33,128.7 30,102 48.2,119') + apg('63.8,119 82,102 79,128.7')) + T('#D6EAFC', ap(cloud)) + T('#5BC0EB', ae(128, 46, 16, 9) + apg('144,46 156,38 156,54')) + T('#D6EAFC', ac(84, 120, 3) + ac(94, 106, 5) + ac(106, 90, 7))]] },
    { id: 'a7-hero', cat: 'comics', level: 1, title: 'A superhero', ico: '🦸', need: P, tip: 'Hands on hips and chin up makes anyone look super brave!', steps: [
      ['Draw a round head and a short neck.', ac(100, 36, 15) + al(95, 50.1, 95, 58) + al(105, 50.1, 105, 58)],
      ['Draw the body. It is wide at the shoulders and thin at the belt.', ap('M80 58 H120 L114 116 H86 Z') + al(85.2, 108, 114.8, 108)],
      ['Bend the arms so the hands rest on the hips. A proud hero pose!', heroArm + mirror(heroArm)],
      ['Draw the legs apart, with big boots.', heroLeg + mirror(heroLeg)],
      ['Add a cape flying out behind, a mask and a star on the chest.', heroCape + mirror(heroCape) + ap('M86 32 Q100 27 114 32 Q114 42 104 40 Q100 36 96 40 Q86 42 86 32 Z') + dark(ac(93, 35, 2) + ac(107, 35, 2)) + ap('M94 44 q6 4 12 0') + apg(starPts(100, 80, 11, 5))],
      ['Draw a city behind. Color your hero! What is their super power?', ar(2, 120, 22, 70) + ar(176, 100, 22, 90) + [8, 16].map(x => ar(x, 130, 4, 6) + ar(x, 146, 4, 6) + ar(x, 162, 4, 6)).join('') + [182, 190].map(x => ar(x, 110, 4, 6) + ar(x, 126, 4, 6) + ar(x, 142, 4, 6) + ar(x, 158, 4, 6)).join('') + al(0, 190, 200, 190) + T('#2E8BE6', ap('M80 58 H120 L114 116 H86 Z') + ap('M80 58 L54 86 L85 106 L84.1 98 L66 86 L81.5 72 Z') + mirror(ap('M80 58 L54 86 L85 106 L84.1 98 L66 86 L81.5 72 Z')) + ap('M86 116 L74 170 H90 L100 116 Z') + mirror(ap('M86 116 L74 170 H90 L100 116 Z'))) + T('#F2604F', ap('M58.6 89 Q46 136 34 172 Q58 162 78.4 150 L85 106 L54 86 Z') + mirror(ap('M58.6 89 Q46 136 34 172 Q58 162 78.4 150 L85 106 L54 86 Z')) + ap('M76.2 160 L74 176 Q62 176 62 184 H94 L91.9 160 Z') + mirror(ap('M76.2 160 L74 176 Q62 176 62 184 H94 L91.9 160 Z'))) + T('#FFD966', apg(starPts(100, 80, 11, 5)) + ar(85, 108, 30, 8)) + T('#F5C9A6', ac(100, 36, 15)) + T('#C9D3E0', ar(2, 120, 22, 70) + ar(176, 100, 22, 90))]] },
    { id: 'a7-four', cat: 'comics', level: 2, title: 'A 4-box comic story', ico: '🎞️', need: 'Paper, a pencil, a ruler and crayons', tip: 'Draw the same character the same way in every box, so readers know it.', steps: [
      ['Draw 4 boxes, 2 on top and 2 below. Read them like a book: left, right, then down.', panels.map(([x, y]) => ar(x, y, 90, 90, 4)).join('')],
      ['Box 1: draw an ice cream with a happy face.', cone(51, 50) + ap(scoop(51, 50)) + happy(51, 50)],
      ['Box 2: draw it again. Uh oh, a big hot sun comes out!', cone(149, 50) + ap(scoop(149, 50)) + happy(149, 50) + ac(178, 24, 7) + around(8, 10, 178, 24, (x, y, a) => al(x, y, f1(178 + 14 * Math.cos(a)), f1(24 + 14 * Math.sin(a))))],
      ['Box 3: it is melting! Draw drips and a worried face.', cone(51, 148) + ap(`M39 148 C29 122 73 122 63 148 Q62 158 59 150 Q56 156 52 149 Q48 160 44 149 Q41 155 39 148 Z`) + dark(ac(46, 139, 1.8) + ac(56, 139, 1.8)) + ap('M46 145 q5 -3 10 0') + ap('M68 128 q3 5 0 7 q-3 -2 0 -7')],
      ['Box 4: just an empty cone and a puddle. Oh no!', cone(128, 150) + ae(166, 176, 22, 7) + dark(ac(160, 174, 1.6) + ac(171, 174, 1.6))],
      ['Write words: YUM! in box 1, and OH NO! in box 4.', ink(51, 30, 'YUM!', 14) + ink(149, 128, 'OH NO!', 14)],
      ['Color it in. Now make up your own 4-box story!', T('#F7A8C4', ap(scoop(51, 50)) + ap(scoop(149, 50)) + ap('M39 148 C29 122 73 122 63 148 Q62 158 59 150 Q56 156 52 149 Q48 160 44 149 Q41 155 39 148 Z') + ae(166, 176, 22, 7)) + T('#E0B67E', cone(51, 50) + cone(149, 50) + cone(51, 148) + cone(128, 150)) + T('#FFD966', ac(178, 24, 7)) + T('#FFF0B8', ar(104, 6, 90, 90, 4) + ar(6, 104, 90, 90, 4)) + T('#D6EAFC', ar(6, 6, 90, 90, 4) + ar(104, 104, 90, 90, 4))]] }
  );

  /* ---------------- Draw what you see ---------------- */
  const tArm = ap('M72.1 112 Q46 114 46 132 Q48 146 66.4 142'), tLeg = ap('M73.3 162 Q50 162 48 178 Q50 192 70 188 Q84 186 89.6 176');
  const tEar = ap('M77.4 39.4 A12 12 0 1 0 69.9 51.1');
  const bnOut = 'M34 62 C30 130 100 170 176 140', bnIn = 'M46 60 C50 116 110 140 176 132';
  const sideLeaves = [[34, 110, 10, 86], [40, 98, 24, 62], [50, 94, 50, 50], [60, 98, 76, 62], [66, 110, 90, 86]];
  const topLeaves = around(5, 54, 150, 120, (x, y) => ap(leafD(150, 120, x, y, 11)), -Math.PI / 2 + 0.3);
  const topVeins = around(5, 50, 150, 120, (x, y) => al(150, 120, x, y), -Math.PI / 2 + 0.3);
  LESSONS.push(
    { id: 'a7-teddy', cat: 'life', level: 1, title: 'Your teddy bear', ico: '🧸', need: 'A teddy or soft toy, paper, a pencil and crayons', tip: 'Look at your teddy, then your paper, then your teddy again.', steps: [
      ['Sit your teddy in front of you. What shape is its head? Draw a circle.', ac(100, 62, 32)],
      ['Look at the ears. Draw two round ears on top.', tEar + mirror(tEar)],
      ['Draw the face: a round snout, a nose, a mouth and two eyes.', ae(100, 75, 14, 10) + dark(ae(100, 70, 5, 3.5) + ac(87, 54, 3.5) + ac(113, 54, 3.5)) + ap('M100 73.5 V78 M94 80 q6 4 12 0')],
      ['Draw a big oval tummy under the head.', ae(100, 136, 34, 42)],
      ['Look how the arms and legs stick out. Draw them.', tArm + mirror(tArm) + tLeg + mirror(tLeg)],
      ['Add a tummy patch and paw pads. Color it like your real teddy!', ae(100, 140, 18, 22) + ae(60, 179, 6, 5) + ae(140, 179, 6, 5) + T('#C99A6E', ac(100, 62, 32) + ae(100, 136, 34, 42) + ap('M77.4 39.4 A12 12 0 1 0 69.9 51.1 Z') + mirror(ap('M77.4 39.4 A12 12 0 1 0 69.9 51.1 Z')) + ap('M72.1 112 Q46 114 46 132 Q48 146 66.4 142 Z') + mirror(ap('M72.1 112 Q46 114 46 132 Q48 146 66.4 142 Z')) + ap('M73.3 162 Q50 162 48 178 Q50 192 70 188 Q84 186 89.6 176 Z') + mirror(ap('M73.3 162 Q50 162 48 178 Q50 192 70 188 Q84 186 89.6 176 Z'))) + T('#F2D9B8', ae(100, 140, 18, 22) + ae(100, 75, 14, 10) + ae(60, 179, 6, 5) + ae(140, 179, 6, 5))]] },
    { id: 'a7-banana', cat: 'life', level: 1, title: 'A real banana', ico: '🍌', need: 'A real banana, paper, a pencil and crayons', tip: 'A banana is not a straight line. Look for the bend!', steps: [
      ['Look at a real banana. It bends! Draw the long bottom curve.', ap(bnOut)],
      ['Draw the top curve. Make the two lines meet at the end.', ap(bnIn)],
      ['Draw the stem at the top, and the dark tip at the end.', ap('M34 62 L32 42 H44 L46 60') + ap('M176 132 Q186 134 184 138 Q182 140 176 140')],
      ['Look closely: a banana has edges! Draw a line along the middle.', ap('M40 64 C42 124 104 152 176 136')],
      ['Find the little brown spots and draw them.', ae(70, 118, 3, 2) + ae(96, 134, 2.5, 2) + ae(122, 140, 3, 2) + ae(56, 96, 2, 1.5) + ae(146, 144, 2.5, 2)],
      ['Draw the table and the shadow. Color it yellow, with a green stem.', al(0, 176, 200, 176) + T('#AEB8C8', ae(110, 170, 66, 5)) + T('#FFD966', ap(bnOut + ' L176 132 C110 140 50 116 46 60 Z')) + T('#9BCB6C', ap('M34 62 L32 42 H44 L46 60 Z')) + dark(ap('M176 132 Q186 134 184 138 Q182 140 176 140 Z') + ae(70, 118, 3, 2) + ae(96, 134, 2.5, 2) + ae(122, 140, 3, 2) + ae(56, 96, 2, 1.5) + ae(146, 144, 2.5, 2))]] },
    { id: 'a7-plant', cat: 'life', level: 2, title: 'A plant from 2 sides', ico: '🪴', need: 'A small potted plant, paper, a pencil and crayons', tip: 'Things look different from different places. Artists walk around to look!', steps: [
      ['Fold your paper in half. On one side, draw the pot as you see it from the side.', fold(al(100, 8, 100, 192)) + ar(14, 140, 72, 10, 3) + ap('M20 150 L28 190 H72 L80 150') + ink(50, 18, 'SIDE', 13)],
      ['Draw stems going up and out from the soil.', sideLeaves.map(([x, y]) => al(50, 140, x, y)).join('')],
      ['Draw a leaf at the end of each stem.', sideLeaves.map(([x, y, tx, ty]) => ap(leafD(x, y, tx, ty, 9))).join('')],
      ['Now stand up and look DOWN at the plant. The pot is a circle! Draw two circles.', ac(150, 120, 34) + ac(150, 120, 28) + ink(150, 18, 'TOP', 13)],
      ['From the top, the leaves spread out like a star. Draw them over the circles.', paint('#fff', topLeaves) + topLeaves + ac(150, 120, 4)],
      ['Draw a line down the middle of every leaf.', sideLeaves.map(([x, y, tx, ty]) => al(x, y, tx, ty)).join('') + topVeins],
      ['Color both. It is the same plant, but two different pictures!', T('#E07B39', ar(14, 140, 72, 10, 3) + ap('M20 150 L28 190 H72 L80 150 Z') + ap(circ(150, 120, 34) + ' ' + circ(150, 120, 28)), true) + T('#8B5E3C', ac(150, 120, 28)) + T('#7DCB8F', sideLeaves.map(([x, y, tx, ty]) => ap(leafD(x, y, tx, ty, 9))).join('')) + paint('#7DCB8F', topLeaves) + stroke('#2E7D4F', topLeaves + topVeins) + stroke('#2FA36B', sideLeaves.map(([x, y]) => al(50, 140, x, y)).join(''))]] }
  );

  /* ---------------- Seasons ---------------- */
  const boot = dx => `M${40 + dx} 70 V150 Q${40 + dx} 160 ${50 + dx} 160 H${100 + dx} Q${108 + dx} 160 ${108 + dx} 150 Q${108 + dx} 134 ${88 + dx} 130 L${74 + dx} 126 V70 Z`;
  const bootBits = dx => al(40 + dx, 82, 74 + dx, 82) + al(40 + dx, 150, 108 + dx, 150) + ap(`M${48 + dx} 70 q9 -12 18 0`);
  const bootDots = dx => [[50, 98], [64, 110], [52, 124], [64, 138], [84, 142], [96, 146]].map(([x, y]) => ac(x + dx, y, 3.5)).join('');
  const kite = [[130, 18], [162, 58], [130, 106], [98, 58]];
  const kTail = 'M130 106 Q146 120 130 134 T130 162';
  const bow = (x, y) => apg(`${x - 7},${y - 4} ${x},${y} ${x - 7},${y + 4}`) + apg(`${x + 7},${y - 4} ${x},${y} ${x + 7},${y + 4}`);
  const globe = 'M63.3 140 A62 62 0 1 1 136.7 140';
  const pine = '76,70 86,86 81,86 90,100 84,100 94,113 58,113 68,100 62,100 71,86 66,86';
  LESSONS.push(
    { id: 'a7-boots', cat: 'seasons', level: 1, title: 'Rain boots and puddles', ico: '☔', need: P, tip: 'After the rain, put on boots and go jump in a real puddle!', steps: [
      ['Draw a tall boot: a long box going down, then a round toe.', ap(boot(0))],
      ['Draw a second boot next to it, the same shape.', ap(boot(72))],
      ['Add a band at the top, a sole at the bottom and a handle.', bootBits(0) + bootBits(72)],
      ['Draw a big puddle under the boots. Add splash lines!', ae(100, 176, 94, 12) + al(30, 158, 22, 150) + al(36, 154, 32, 144) + al(186, 158, 194, 150) + al(180, 154, 184, 144)],
      ['Draw a rain cloud with raindrops.', ap('M128 34 a10 10 0 0 1 8 -16 a14 14 0 0 1 26 -4 a12 12 0 0 1 22 8 a9 9 0 0 1 0 16 Z') + al(136, 42, 132, 50) + al(152, 42, 148, 50) + al(168, 42, 164, 50) + al(184, 42, 180, 50)],
      ['Add spots on the boots. Color them bright, and the puddle blue!', bootDots(0) + bootDots(72) + T('#FFC23D', ap(boot(0))) + T('#F2604F', ap(boot(72))) + T('#7FC4F0', ae(100, 176, 94, 12)) + T('#C9D3E0', ap('M128 34 a10 10 0 0 1 8 -16 a14 14 0 0 1 26 -4 a12 12 0 0 1 22 8 a9 9 0 0 1 0 16 Z'))]] },
    { id: 'a7-kite', cat: 'seasons', level: 1, title: 'Kite day', ico: '🪁', need: P, tip: 'Windy days are kite days! Draw the tail wiggly so it looks blown.', steps: [
      ['Draw a diamond for the kite: tall and pointy.', apg(kite.map(p => p.join(',')).join(' '))],
      ['Draw a cross inside, from corner to corner.', al(130, 18, 130, 106) + al(98, 58, 162, 58)],
      ['Draw a long wiggly tail with little bows on it.', ap(kTail) + bow(140, 121) + bow(130, 148)],
      ['Draw yourself holding the string!', ac(40, 132, 11) + apg('40,143 28,174 52,174') + al(34, 174, 32, 190) + al(46, 174, 48, 190) + al(44, 152, 60, 132) + al(36, 152, 24, 164) + ap('M60 132 Q100 126 130 106')],
      ['Add clouds and birds in the windy sky.', ap('M18 50 a9 9 0 0 1 12 -12 a12 12 0 0 1 22 0 a9 9 0 0 1 4 14 Z') + ap('M160 140 q5 -5 10 0 q5 -5 10 0 M150 170 q4 -4 8 0 q4 -4 8 0') + al(0, 192, 200, 192)],
      ['Color each part of the kite a different color. Whoosh!', T('#F2604F', apg('130,18 130,58 98,58')) + T('#FFC23D', apg('130,18 162,58 130,58')) + T('#2E8BE6', apg('98,58 130,58 130,106')) + T('#6CC08B', apg('130,58 162,58 130,106')) + T('#F78FB3', bow(140, 121) + bow(130, 148) + apg('40,143 28,174 52,174')) + T('#F5C9A6', ac(40, 132, 11))]] },
    { id: 'a7-globe', cat: 'seasons', level: 2, title: 'A snow globe', ico: '🔮', need: P, tip: 'Draw the snowflakes last, so they fall in front of everything.', steps: [
      ['Draw a big round globe. Leave the bottom open.', ap(globe)],
      ['Draw the base: wider at the bottom. Add a stripe and a star.', ap('M63.3 140 L40 184 H160 L136.7 140 Z') + al(47.4, 170, 152.6, 170) + apg(starPts(100, 156, 8, 3.5))],
      ['Draw a snowy hill inside the globe.', ap('M49.5 126 Q100 108 150.5 126')],
      ['Draw a little pine tree on the hill.', apg(pine) + ar(73, 113, 6, 6)],
      ['Draw a tiny snowman next to it.', ac(122, 108, 10) + ac(122, 91, 7) + dark(ac(119.5, 89, 1.2) + ac(124.5, 89, 1.2) + ac(122, 104, 1.2) + ac(122, 110, 1.2)) + apg('122,92 122,95 128,93.5')],
      ['Add falling snow, and a shine on the glass.', [[60, 60], [84, 44], [110, 40], [136, 52], [148, 80], [56, 92], [100, 66], [104, 92], [140, 108], [96, 120]].map(([x, y]) => ac(x, y, 1.8)).join('') + ap('M54 82 Q56 54 76 40')],
      ['Color it: blue sky inside, a red base. Shake, shake!', T('#D6EAFC', ap(globe + ' Q100 108 49.5 126 Z')) + T('#F2604F', ap('M63.3 140 L40 184 H160 L136.7 140 Z')) + T('#FFD966', apg(starPts(100, 156, 8, 3.5))) + T('#4FB06A', apg(pine)) + T('#E2E8EF', ap('M49.5 126 Q100 108 150.5 126 A62 62 0 0 1 136.7 140 H63.3 A62 62 0 0 1 49.5 126 Z'))]] }
  );

  /* ---------------- Printing ---------------- */
  const cob = 'M100 24 C128 24 138 70 134 110 C130 148 116 168 100 168 C84 168 70 148 66 110 C62 70 72 24 100 24 Z';
  const cobDots = (() => { let s = ''; for (let y = 28, r = 0; y < 170; y += 8.5, r++) for (let x = 60 + (r % 2) * 5; x < 142; x += 10) s += ac(x, f1(y), 3.6); return s; })();
  const husk = 'M100 184 C62 178 48 132 60 90 C70 126 82 152 104 172 Z';
  const grapeRows = [[64, 5], [86, 4], [108, 3], [130, 2], [152, 1]];
  const grapes = grapeRows.map(([y, n]) => Array.from({ length: n }, (_, i) => [100 + (i - (n - 1) / 2) * 24, y]));
  const grape = ([x, y]) => paint('#7B4FBF', ac(x, y, 11.5)) + paint('rgba(255,255,255,.18)', ac(x, y, 6.5)) + paint('rgba(40,20,80,.35)', ac(x + 4, y + 3, 1.6) + ac(x - 5, y + 2, 1.2));
  const strA = 'M104 196 V178 C110 150 120 124 146 116 C178 106 186 64 156 54 C126 46 116 88 146 90 C170 92 172 140 144 152 C124 160 124 126 152 128 C172 130 174 164 150 172';
  const strB = 'M106 196 V186 C122 182 128 168 122 156 M106 100 C120 86 128 60 112 44 C104 36 118 26 128 36';
  LESSONS.push(
    { id: 'a7-bubble', cat: 'print', level: 1, title: 'Bubble wrap corn', ico: '🌽', need: 'Bubble wrap, yellow and green paint, a brush, paper; a grown-up cuts', tip: 'Pat the bubble wrap all over with flat hands so every bubble prints.', steps: [
      ['A grown-up cuts bubble wrap into a long, round shape, like a corn cob.', guide(ap(cob) + ac(90, 60, 4) + ac(110, 60, 4) + ac(100, 76, 4) + ac(90, 92, 4) + ac(110, 92, 4))],
      ['Brush yellow paint all over the bumpy side.', guide(fat('#FFC23D', 'M84 40 L116 60 L80 80 L120 100 L78 120 L118 140 L90 156', 7))],
      ['Turn it over and press it on the paper. Pat it, then peel it off. Corn!', paint('#FFE27A', ap(cob)) + `<defs><clipPath id="a7cob"><path d="${cob}"/></clipPath></defs><g clip-path="url(#a7cob)">${paint('#F2B21B', cobDots)}</g>`, { clear: true }],
      ['Paint two green leaves wrapping around the bottom.', paint('#4FB06A', ap(husk) + mirror(ap(husk))) + paint('#3D8F55', ar(94, 178, 12, 16, 3))],
      ['When it is dry, draw lines on the leaves with a marker.', stroke('#2E6B42', ap('M98 178 C72 168 62 138 64 104') + mirror(ap('M98 178 C72 168 62 138 64 104')))],
      ['Add a happy face if you like! Try bubble wrap for fish scales or honeycomb too.', dark(ac(90, 84, 4) + ac(110, 84, 4)) + stroke('#22305A', ap('M88 100 q12 10 24 0'))]] },
    { id: 'a7-cork', cat: 'print', level: 1, title: 'Cork-stamp grapes', ico: '🍇', need: 'A cork, purple, green and brown paint, paper, a cotton bud', tip: 'Dip, stamp, dip, stamp. Do not slide the cork, just press and lift.', steps: [
      ['Dip a cork in purple paint. Stamp a row of 5 grapes across the top.', grapes[0].map(grape).join('')],
      ['Stamp a row of 4 under it. Put each one in a gap.', grapes[1].map(grape).join('')],
      ['Now stamp a row of 3, then a row of 2.', grapes[2].map(grape).join('') + grapes[3].map(grape).join('')],
      ['Stamp 1 grape at the bottom. Look: a bunch of grapes!', grapes[4].map(grape).join('')],
      ['Paint a brown stem on top, and a green leaf with your finger.', fat('#8B5E3C', 'M100 52 Q98 34 110 20', 6) + paint('#4FB06A', ap(leafD(104, 38, 156, 22, 16))) + stroke('#2E6B42', al(104, 38, 156, 22))],
      ['When it is dry, dab a tiny white dot on each grape with a cotton bud. Shiny!', paint('#fff', grapes.flat().map(([x, y]) => ac(x - 4, y - 4, 2.3)).join(''))]] },
    { id: 'a7-string', cat: 'print', level: 2, title: 'Pulled string painting', ico: '🧵', need: 'Paper, string or wool, runny paint, a spoon; a grown-up to help', tip: 'Keep pressing on top while you pull. That is what makes the swirls.', steps: [
      ['Fold your paper in half, then open it flat again.', ar(10, 10, 180, 180, 4) + fold(al(100, 10, 100, 190))],
      ['Dip a string in red paint. Lay it on one side, in wiggles. Let one end hang off the bottom.', guide(fat('#E8402F', strA, 3))],
      ['Fold the paper closed over the string. Press on top with one hand.', guide(ap('M60 70 Q100 30 140 70') + apl('130,64 140,70 140,58'))],
      ['Keep pressing, and pull the string out from the bottom. Slowly!', guide(ap('M104 172 V198') + apl('98,190 104,198 110,190'))],
      ['Open it up. Wow, the swirls print on both sides, like a mirror!', fat('#F7A39A', strA, 12) + fat('#E8402F', strA, 5) + mirror(fat('#F7A39A', strA, 12) + fat('#E8402F', strA, 5)), { clear: true }],
      ['Do it again with blue paint and a new string.', fat('#9CCBF5', strB, 11) + fat('#2E5FB8', strB, 4) + mirror(fat('#9CCBF5', strB, 11) + fat('#2E5FB8', strB, 4))],
      ['What do you see? A butterfly? Add a body and feelers with a pen!', ae(100, 108, 6, 44) + ac(100, 58, 7) + ap('M97 52 q-6 -16 -16 -20 M103 52 q6 -16 16 -20') + T('#FFD966', ae(100, 108, 6, 44) + ac(100, 58, 7))]] }
  );

  /* ---------------- Clay ---------------- */
  const dough = (s) => clay(s, '#F2D29B', '#C9995A');
  const cheese = ['M62 78 l10 5', 'M88 64 l12 -2', 'M118 70 l8 7', 'M136 92 l2 11', 'M70 112 l9 -6', 'M96 100 l10 4', 'M124 118 l-4 10', 'M84 134 l12 2', 'M112 140 l9 -5', 'M58 96 l3 10', 'M140 128 l-9 6', 'M104 82 l-3 9'];
  const pepperoni = [[80, 84], [122, 86], [100, 120], [70, 128], [134, 130]];
  const legs = [[66, 68, -45], [134, 68, 45], [66, 134, 45], [134, 134, -45]];
  const hex = around(6, 18, 100, 100, (x, y) => `${x},${y} `).trim();
  const hexLines = around(6, 18, 100, 100, (x, y) => { const dx = x - 100, dy = y - 100, t = 1 / Math.hypot(dx / 46, dy / 54); return al(x, y, f1(100 + dx * t * 0.97), f1(100 + dy * t * 0.97)); });
  const ornStar = apg(starPts(100, 84, 52, 23));
  LESSONS.push(
    { id: 'a7-cpizza', cat: 'clay', level: 1, title: 'Clay pizza', ico: '🍕', need: 'Clay or play dough in a few colors, and a plastic knife', tip: 'Use different colored dough for each topping. Pretend to serve it!', steps: [
      ['Roll a big ball of clay. Press it flat with your hands, into a circle.', dough(ac(100, 100, 72)) + shine(70, 64, 12, 6)],
      ['Squash red clay on top for the sauce. Leave an edge all around.', clay(ac(100, 100, 58), '#E35A3F', '#B83A2E')],
      ['Roll a thin snake. Lay it around the edge for the crust.', rope(circ(100, 100, 64), 9, '#F2D29B', '#C9995A')],
      ['Roll tiny yellow snakes for cheese. Sprinkle them on.', cheese.map(d => rope(d, 4, '#FFE27A', '#E0B53A')).join('')],
      ['Make flat red circles for pepperoni, and green bits for peppers.', pepperoni.map(([x, y]) => clay(ac(x, y, 9), '#C0392B', '#8E2A20')).join('') + [[96, 72], [112, 104], [82, 106], [126, 108]].map(([x, y]) => clay(ar(x, y, 8, 4, 2), '#6CC08B', '#2E7D4F')).join('')],
      ['Ask a grown-up to help you cut slices with a plastic knife. Pizza party!', stroke('#8B5E3C', al(100, 36, 100, 164) + al(44.6, 68, 155.4, 132) + al(44.6, 132, 155.4, 68))]] },
    { id: 'a7-cturtle', cat: 'clay', level: 1, title: 'Clay turtle', ico: '🐢', need: 'Clay or play dough (green), and a pencil', tip: 'Press parts together gently, and smooth the joins with your finger.', steps: [
      ['Roll 4 small balls and press them flat. These are the legs.', legs.map(([x, y, a]) => clay(rotE(x, y, 16, 10, a), '#9BD4A0', '#4E9A5E')).join('')],
      ['Roll a ball for the head, and a tiny pointy tail.', clay(ac(100, 40, 15), '#9BD4A0', '#4E9A5E') + clay(apg('93,148 100,170 107,148'), '#9BD4A0', '#4E9A5E')],
      ['Roll a big ball and press it into a dome. Put it on top: the shell!', clay(ae(100, 100, 46, 54), '#5DAE6E', '#2E6B42') + shine(84, 72, 12, 7)],
      ['Press lines into the shell with a pencil, like a honeycomb.', stroke('#2E6B42', apg(hex) + hexLines)],
      ['Poke two eyes with a pencil tip, and draw a smile.', dark(ac(94, 36, 2.4) + ac(106, 36, 2.4)) + stroke('#2E6B42', ap('M94 44 q6 5 12 0'))],
      ['Let it dry, then paint spots on the shell. Slow and steady!', paint('#FFD966', ac(100, 100, 6) + around(6, 36, 100, 100, (x, y) => ac(x, y, 5), -Math.PI / 2 + Math.PI / 6))]] },
    { id: 'a7-ornament', cat: 'clay', level: 2, title: 'Salt-dough ornament', ico: '🌟', need: 'Flour, salt, water, a cookie cutter, a straw, paint; a grown-up bakes', tip: 'Salt dough lasts for years. Write the year on the back!', steps: [
      ['With a grown-up, mix 2 cups of flour, 1 cup of salt and some water. Squish it into a ball.', clay(ac(56, 170, 16), '#F3E3C3', '#C9B28A') + shine(51, 164, 5, 3)],
      ['Roll it flat with a rolling pin.', clay(ar(12, 152, 96, 38, 8), '#F3E3C3', '#C9B28A') + clay(ar(118, 162, 62, 16, 8), '#E0B67E', '#9A6A3A') + clay(ar(108, 166, 10, 8, 3) + ar(180, 166, 10, 8, 3), '#E0B67E', '#9A6A3A')],
      ['Press in a star cookie cutter and lift out the star.', paint('#D9C49C', apg(starPts(56, 172, 15, 6.5))) + clay(ornStar, '#F3E3C3', '#C9B28A')],
      ['Poke a hole near the top with a straw.', paint('#fff', ac(100, 54, 4.5)) + stroke('#C9B28A', ac(100, 54, 4.5))],
      ['A grown-up bakes it in a low oven until it is hard. Let it cool.', guide(ap('M30 70 q-6 -8 0 -16 t0 -16 M170 70 q-6 -8 0 -16 t0 -16 M40 120 q-6 -8 0 -16 t0 -16 M160 120 q-6 -8 0 -16 t0 -16'))],
      ['Paint it bright, and add dots or glitter.', T('#F2604F', ap(`M${starPts(100, 84, 52, 23).replace(/ /g, ' L')} Z ${circ(100, 54, 4.5)}`), true) + paint('#FFD966', around(5, 34, 100, 84, (x, y) => ac(x, y, 3.5)) + ac(100, 90, 6)), { clear: true }],
      ['Thread a ribbon through the hole and hang it up!', fat('#2E8BE6', 'M100 50 Q92 30 100 10', 3) + fat('#2E8BE6', 'M100 10 q-12 -8 -16 2 q8 4 16 -2 q12 -8 16 2 q-8 4 -16 -2', 3)]] }
  );

  /* ---------------- Famous art styles ---------------- */
  const figA = ac(56, 40, 14) + cap(56, 62, 60, 110, 24) + cap(50, 68, 22, 40, 11) + cap(64, 68, 94, 48, 11) + cap(54, 108, 34, 166, 12) + cap(64, 108, 88, 146, 12) + cap(88, 146, 84, 182, 12);
  const figB = ac(146, 52, 14) + cap(146, 74, 140, 122, 24) + cap(140, 82, 112, 64, 11) + cap(152, 80, 180, 104, 11) + cap(138, 118, 120, 176, 12) + cap(146, 118, 166, 148, 12) + cap(166, 148, 186, 166, 12);
  const moves = ap('M36 22 l-8 -6 M56 18 v-10 M76 22 l8 -6 M14 60 h-10 M100 34 l8 -2') + ap('M126 30 l-6 -8 M146 28 v-10 M166 30 l6 -8 M188 84 l8 -4 M104 50 l-8 -2') + ap('M20 176 q8 -6 16 0 M70 190 q8 -6 16 0 M112 188 q8 -6 16 0 M168 184 q8 -6 16 0');
  const pumpkin = 'M100 64 C74 50 30 58 26 112 C24 154 62 172 100 166 C138 172 176 154 174 112 C170 58 126 50 100 64 Z';
  const ribs = ap('M100 64 Q96 115 100 166') + ap('M76 57 Q56 112 74 167') + ap('M124 57 Q144 112 126 167') + ap('M50 66 Q34 112 46 156') + ap('M150 66 Q166 112 154 156');
  const kDots = (() => { let s = ''; for (let y = 60, r = 0; y < 172; y += 14, r++) for (let x = 24 + (r % 2) * 8; x < 178; x += 16) { const k = 1 - ((x - 100) / 82) ** 2 * 0.7 - ((y - 112) / 60) ** 2 * 0.25; s += ac(x, y, f1(Math.max(2, 6.2 * k))); } return s; })();
  const waveBack = 'M0 168 C14 120 40 66 92 46 C130 32 160 46 160 66 C160 82 140 86 132 76 C126 68 132 60 140 62';
  const waveFace = 'M132 76 C110 80 92 112 86 172';
  const waveFill = 'M0 168 C14 120 40 66 92 46 C130 32 160 46 160 66 C160 82 140 86 132 76 C110 80 92 112 86 172 L86 200 H0 Z';
  const smallWave = 'M86 186 C100 160 128 146 148 152 C138 154 134 162 144 166 C160 172 178 160 200 158';
  const claws = [[98, 44], [112, 38], [126, 37], [140, 40], [152, 48]].map(([x, y]) => ap(`M${x} ${y} q2 -9 10 -7 q-6 1 -5 7`)).join('');
  LESSONS.push(
    { id: 'a7-haring', cat: 'styles', level: 1, title: 'Keith Haring dancers', ico: '🕺', need: 'Paper, a pencil, a thick black marker and bright crayons', tip: 'No faces needed! Bendy arms and legs show the feeling.', steps: [
      ['Keith Haring drew happy dancing people. Draw a round head and a bean-shaped body.', ac(56, 40, 14) + cap(56, 62, 60, 110, 24)],
      ['Add arms and legs, bendy like noodles. Make it dance!', cap(50, 68, 22, 40, 11) + cap(64, 68, 94, 48, 11) + cap(54, 108, 34, 166, 12) + cap(64, 108, 88, 146, 12) + cap(88, 146, 84, 182, 12)],
      ['Draw a second dancer jumping next to it.', figB],
      ['Draw little lines around them to show they are moving.', moves],
      ['Fill each dancer with one bright color, right over the lines.', paint('#F2604F', figA) + paint('#2E8BE6', figB)],
      ['Go around the outside with a thick black marker. Bold and simple!', stroke('#1B1B1B', wide(figA + figB, 9)) + paint('#F2604F', figA) + paint('#2E8BE6', figB) + stroke('#1B1B1B', wide(moves, 4.5))]] },
    { id: 'a7-kusama', cat: 'styles', level: 1, title: 'Kusama dotty pumpkin', ico: '🎃', need: 'Paper, a pencil, a yellow crayon and a black marker', tip: 'Make the dots smaller near the edges. It makes the pumpkin look round!', steps: [
      ['Yayoi Kusama loves dots! She made giant yellow pumpkins. Draw a wide, bumpy pumpkin.', ap(pumpkin)],
      ['Draw curved lines from top to bottom for the bumps.', ribs],
      ['Add a short, fat stem on top.', ap('M93 61 L90 36 Q98 28 108 32 L107 61')],
      ['Color the pumpkin bright yellow.', T('#FFD23D', ap(pumpkin))],
      ['Now cover it with black dots! Big in the middle, smaller at the sides.', `<defs><clipPath id="a7pump"><path d="${pumpkin}"/></clipPath></defs><g clip-path="url(#a7pump)">${paint('#1B1B1B', kDots)}</g>`],
      ['Kusama puts dots everywhere. Add colored dots around it too!', T('#6CC08B', ap('M93 61 L90 36 Q98 28 108 32 L107 61 Z')) + paint('#F2604F', ac(20, 24, 6) + ac(178, 30, 8) + ac(186, 184, 6) + ac(14, 186, 8) + ac(46, 16, 3) + ac(150, 14, 4) + ac(190, 60, 3) + ac(10, 60, 3))]] },
    { id: 'a7-wave', cat: 'styles', level: 2, title: "Hokusai's great wave", ico: '🌊', need: 'Paper, a pencil, and blue and white crayons or paint', tip: 'Make the big wave very big and the mountain small. That shows it is far away.', steps: [
      ['Hokusai made a famous picture of a giant wave in Japan. First draw a small mountain far away.', ap('M118 146 L150 104 L182 146') + apl('137.3,120.7 143,125 150,118 157,125 162.7,120.7')],
      ['Draw a huge wave on the left, curling over like a hook.', ap(waveBack)],
      ['Draw the inside of the wave, coming down from the curl.', ap(waveFace)],
      ['Draw little claws of foam along the top of the wave.', claws],
      ['Draw a small wave in front of the mountain, and a long boat.', ap(smallWave) + ap('M126 182 Q160 190 196 178 L192 188 Q160 198 130 190 Z') + ac(146, 180, 2.5) + ac(160, 182, 2.5) + ac(174, 180, 2.5)],
      ['Draw lines inside the big wave, following its shape. Add flying foam dots.', ap('M18 170 C30 126 52 86 96 64') + ap('M40 176 C50 136 70 100 106 80') + ap('M60 182 C68 146 84 116 114 92') + [[170, 64], [176, 80], [166, 92], [184, 52], [156, 100]].map(([x, y]) => ac(x, y, 2.2)).join('')],
      ['Color the waves deep blue, the foam white, and the sky pale yellow.', T('#F6E7C1', ar(0, 0, 200, 200)) + T('#2E5FB8', ap(waveFill)) + T('#7FA7E0', ap(smallWave + ' V200 H86 Z')) + T('#A9B4C4', ap('M118 146 L150 104 L182 146 Z')) + paint('#fff', apg('137.3,120.7 143,125 150,118 157,125 162.7,120.7 150,104')) + T('#C99A6E', ap('M126 182 Q160 190 196 178 L192 188 Q160 198 130 190 Z'))]] }
  );
}/*}lazy*/);
