/* ---------- more art lessons (art2): vehicles, ocean, bugs & birds, dinosaurs, food, fairy tales ---------- */
// Uses the helpers from art.js (ac, ae, al, ap, ar, apg, apl, guide, paint, fold, atext, ring, zig).
// Wrapped in a block so the little helpers below do not clash with other files.
ART_LATER.push(/*lazy{*/() => {
  const f1 = n => +n.toFixed(1);
  // A star with n points, outer radius R, inner radius r, turned by rot degrees.
  const starPts = (cx, cy, R, r, n = 5, rot = 0) => Array.from({ length: n * 2 }, (_, i) => {
    const a = (i * 180 / n - 90 + rot) * Math.PI / 180, d = i % 2 ? r : R;
    return `${f1(cx + d * Math.cos(a))},${f1(cy + d * Math.sin(a))}`;
  }).join(' ');
  // A swirl that winds out from the middle, for snail shells.
  const spiral = (cx, cy, turns, rmax) => {
    const n = turns * 24, pts = [];
    for (let i = 0; i <= n; i++) { const t = i / n, a = t * turns * 2 * Math.PI, r = rmax * t; pts.push(`${f1(cx + r * Math.cos(a))} ${f1(cy + r * Math.sin(a))}`); }
    return ap('M' + pts.join(' L'));
  };
  // A tiny 4-point sparkle.
  const sparkle = (x, y, s = 6) => apg(starPts(x, y, s, s * 0.3, 4));

  ART_CATS.push(
    { id: 'vehicles', name: 'Vehicles & Machines', ico: '🚂', blurb: 'Trains, boats, planes and big machines' },
    { id: 'ocean', name: 'Ocean Life', ico: '🐠', blurb: 'Fish, whales and friends under the sea' },
    { id: 'bugs', name: 'Bugs & Birds', ico: '🐝', blurb: 'Buzzy bees, slow snails and pretty birds' },
    { id: 'dino', name: 'Dinosaurs & Dragons', ico: '🦕', blurb: 'Stomp, roar and fly!' },
    { id: 'food', name: 'Food & Treats', ico: '🍦', blurb: 'Yummy pictures you cannot eat' },
    { id: 'fantasy', name: 'Fairy Tales & Magic', ico: '🦄', blurb: 'Unicorns, mermaids and magic' }
  );

  /* precomputed bits */
  // Peacock fan: feather lines and eye spots around the point (100,150).
  const fanAngles = [-165, -145, -125, -105, -75, -55, -35, -15];
  const fanPt = (a, r) => [100 + r * Math.cos(a * Math.PI / 180), 150 + r * Math.sin(a * Math.PI / 180)];
  const fanLines = fanAngles.map(a => { const [x1, y1] = fanPt(a, Math.abs(a + 90) < 20 ? 62 : 40), [x2, y2] = fanPt(a, 70); return al(f1(x1), f1(y1), f1(x2), f1(y2)); }).join('');
  const fanEyes = fanAngles.map(a => { const [x, y] = fanPt(a, 80); return ac(f1(x), f1(y), 10) + ac(f1(x), f1(y), 4); }).join('');
  const fanEdge = (() => { let d = ''; const n = 12; for (let i = 0; i <= n; i++) { const a = -180 + i * 180 / n, [x, y] = fanPt(a, 92); d += i ? ` A9 9 0 0 1 ${f1(x)} ${f1(y)}` : `M${f1(x)} ${f1(y)}`; } return ap(d); })();
  // Stegosaurus back plates, standing on the back curve.
  const stegoBack = t => { const m = 1 - t, x = m ** 3 * 45 + 3 * m * m * t * 55 + 3 * m * t * t * 145 + t ** 3 * 165, y = m ** 3 * 140 + 3 * m * m * t * 75 + 3 * m * t * t * 75 + t ** 3 * 140; return [x, y]; };
  const stegoPlate = (t, h) => {
    const [x0, y0] = stegoBack(t - 0.05), [x1, y1] = stegoBack(t + 0.05), [xm, ym] = stegoBack(t);
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = dy / L, ny = -dx / L;
    const [xa, ya] = stegoBack(t - 0.03), [xb, yb] = stegoBack(t + 0.03), w = h * 0.55;
    return apl(`${f1(x0)},${f1(y0)} ${f1(xa + nx * w)},${f1(ya + ny * w)} ${f1(xm + nx * h)},${f1(ym + ny * h)} ${f1(xb + nx * w)},${f1(yb + ny * w)} ${f1(x1)},${f1(y1)}`);
  };
  // Cake drips along the front of the bottom layer.
  const cakeDrips = (() => { let d = 'M35 120'; for (let x = 35; x < 165; x += 13) { const xm = x + 6.5, xe = x + 13, ye = 120 + 14 * Math.sqrt(Math.max(0, 1 - ((xe - 100) / 65) ** 2)), ym = 120 + 14 * Math.sqrt(1 - ((xm - 100) / 65) ** 2); d += ` Q${f1(xm)} ${f1(ym + 16)} ${f1(xe)} ${f1(ye + 2)}`; } return ap(d); })();

  const P = 'Paper and a pencil, crayons';
  const mirrorX = s => `<g transform="matrix(-1 0 0 1 200 0)">${s}</g>`;
  const octoLeft = ap('M66 100 C50 118 66 135 44 160 Q36 172 48 172') + ap('M76 108 C64 130 80 150 66 176 Q62 186 72 186') + ap('M88 113 C82 140 92 160 84 186') + ap('M96 115 C98 140 94 160 96 186');

  LESSONS.push(
    /* ---- Vehicles & machines ---- */
    { id: 'v-train', cat: 'vehicles', level: 1, title: 'A choo-choo train', ico: '🚂', need: P, tip: 'Use a ruler for long straight lines if you like.', steps: [
      ['Draw a long rectangle for the engine.', ar(25, 100, 120, 50, 4)],
      ['Draw a tall box on the back end for the driver. Add a window.', ar(100, 50, 45, 50) + ar(110, 60, 25, 22, 3)],
      ['Draw a chimney on the front, with a wider top.', ar(45, 70, 16, 30) + ar(40, 62, 26, 8, 2)],
      ['Draw three round wheels. Put a dot in each one.', ac(50, 158, 14) + ac(88, 158, 14) + ac(126, 158, 14) + ac(50, 158, 3) + ac(88, 158, 3) + ac(126, 158, 3)],
      ['Add a pointy front to push things off the track.', apg('25,128 8,150 25,150')],
      ['Draw puffy smoke clouds coming out of the chimney.', ac(56, 46, 8) + ac(72, 32, 10) + ac(94, 20, 12)],
      ['Draw the track under the wheels. Choo choo! Color your train.', al(5, 176, 195, 176) + [15, 45, 75, 105, 135, 165].map(x => al(x, 176, x + 10, 186)).join('')]] },
    { id: 'v-boat', cat: 'vehicles', level: 1, title: 'A little tugboat', ico: '🚢', need: P, tip: 'Wavy water is just a row of little hills.', steps: [
      ['Draw the boat bottom: a long shape, wide on top and short on the bottom.', ap('M20 120 H180 L160 155 H40 Z')],
      ['Draw a box on top for the cabin.', ar(60, 85, 70, 35, 4)],
      ['Draw two round windows in the cabin.', ac(80, 102, 7) + ac(110, 102, 7)],
      ['Draw a tall chimney on the roof with a stripe.', ar(95, 50, 20, 35) + al(95, 60, 115, 60)],
      ['Add a ring on the side and a flag at the front.', ac(45, 136, 8) + ac(45, 136, 3) + al(165, 120, 165, 92) + apg('165,92 182,99 165,106')],
      ['Draw smoke puffs and wavy water. Toot toot!', ac(118, 38, 7) + ac(132, 25, 9) + ap('M0 152 q12.5 -10 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0') + ap('M10 175 q10 -8 20 0 t20 0 M120 182 q10 -8 20 0 t20 0')]] },
    { id: 'v-plane', cat: 'vehicles', level: 2, title: 'An airplane', ico: '✈️', need: P, tip: 'Press lightly first, then go over the lines you like best.', steps: [
      ['Draw a long sausage shape for the body.', ar(20, 85, 155, 30, 15)],
      ['Add a tall tail fin at the back.', ap('M145 85 L160 45 H176 L172 90')],
      ['Draw a big wing coming down from the middle.', ap('M85 112 L100 155 H118 L118 112')],
      ['Draw a row of round windows and a front window for the pilot.', [55, 70, 85, 100, 115, 130].map(x => ac(x, 96, 4)).join('') + ap('M26 96 Q30 90 40 90 V98 H26')],
      ['Add a door and fluffy clouds.', ar(140, 93, 9, 16, 2) + ap('M15 160 a10 10 0 0 1 18 -6 a12 12 0 0 1 22 4 a8 8 0 0 1 0 14 h-38 a7 7 0 0 1 -2 -12z') + ap('M135 170 a8 8 0 0 1 14 -5 a10 10 0 0 1 18 3 a7 7 0 0 1 0 12 h-30 a6 6 0 0 1 -2 -10z')],
      ['Color the plane. Where is it flying today?', '']] },
    { id: 'v-tractor', cat: 'vehicles', level: 2, title: 'A farm tractor', ico: '🚜', need: P, tip: 'A big wheel and a small wheel make it look like a real tractor!', steps: [
      ['Draw a big wheel at the back. Add a small circle inside.', ac(140, 145, 35) + ac(140, 145, 12)],
      ['Draw a small wheel at the front, with a circle inside.', ac(52, 160, 20) + ac(52, 160, 7)],
      ['Draw a long box between the wheels for the engine.', ap('M105 140 H35 V108 H110')],
      ['Draw the cab on top of the big wheel, with a big window and a roof.', ap('M110 108 V55 H165 V110') + ar(118, 63, 38, 32, 3) + ar(102, 47, 70, 8, 3)],
      ['Add a pipe for smoke, a light and a little seat.', ar(55, 85, 7, 23) + ac(58, 74, 6) + ac(66, 62, 8) + ar(35, 114, 6, 10, 2)],
      ['Add bumps on the big tyre so it can drive in mud.', Array.from({ length: 16 }, (_, i) => { const a = i * Math.PI / 8; return al(f1(140 + 35 * Math.cos(a)), f1(145 + 35 * Math.sin(a)), f1(140 + 40 * Math.cos(a)), f1(145 + 40 * Math.sin(a))); }).join('')],
      ['Draw the ground and color your tractor. Green or red?', al(0, 186, 200, 186)]] },
    { id: 'v-heli', cat: 'vehicles', level: 3, title: 'A helicopter', ico: '🚁', need: 'Paper, a pencil, an eraser, crayons', tip: 'Light guide shapes first, dark lines last. That is how artists work!', steps: [
      ['Draw light guides: an oval for the cabin and a line for the tail.', guide(ae(88, 110, 44, 35) + al(128, 104, 182, 96))],
      ['Draw the round cabin over the oval guide, like a big bubble.', ap('M132 104 C130 80 110 74 88 75 C60 76 44 92 44 112 C44 132 62 145 88 145 C112 145 130 132 132 116')],
      ['Draw the tail: two lines that get closer together. Close the end.', ap('M132 104 L182 92 M132 116 L182 100') + al(182, 92, 182, 100)],
      ['Draw a big window at the front.', ap('M50 112 C50 94 64 86 86 86 V112 Z')],
      ['Add the rotor: a short pole and long, flat blades on top.', al(90, 75, 90, 62) + ar(18, 56, 144, 6, 3) + ac(90, 59, 4)],
      ['Add a small spinning rotor on the end of the tail.', ac(182, 96, 11) + al(182, 85, 182, 107) + al(171, 96, 193, 96)],
      ['Draw the landing skids under the cabin.', al(70, 144, 66, 160) + al(106, 144, 110, 160) + ap('M40 160 H136 Q146 160 148 152')],
      ['Erase the guides. Add a door line and wind lines. Color it bright!', ap('M92 88 V138') + ap('M8 70 h16 M2 82 h14 M20 40 q20 -8 40 0 M120 40 q20 -8 40 0'), { clear: true }]] },

    /* ---- Ocean life ---- */
    { id: 'o-clownfish', cat: 'ocean', level: 1, title: 'A clownfish', ico: '🐠', need: P, tip: 'Stripes that bend look like they wrap around the fish.', steps: [
      ['Draw a big oval for the body.', ae(95, 100, 55, 35)],
      ['Add a tail that looks like a fan.', ap('M150 100 Q172 68 186 74 Q176 100 186 126 Q172 132 150 100')],
      ['Draw a round eye and a little smile.', ac(62, 92, 8) + ac(64, 92, 3) + ap('M42 110 q6 5 12 0')],
      ['Draw two bendy stripes across the body.', ap('M76 68 q-8 32 0 64 M88 66 q-8 34 0 68') + ap('M112 67 q8 33 0 66 M124 70 q8 30 0 60')],
      ['Add a fin on top, one on the bottom and one on the side.', ap('M80 66 Q100 42 125 69') + ap('M92 135 q10 16 24 -1') + ap('M98 98 q14 2 14 18 q-12 -4 -14 -18')],
      ['Draw bubbles and wavy seaweed. Color it orange and white!', ac(28, 62, 5) + ac(20, 44, 7) + ac(30, 24, 4) + ap('M20 198 q-8 -15 0 -30 q8 -15 0 -30') + ap('M175 198 q8 -12 0 -24 q-8 -12 0 -24')]] },
    { id: 'o-octopus', cat: 'ocean', level: 1, title: 'An octopus', ico: '🐙', need: P, tip: 'Wiggly legs are easy: just wiggle your pencil as you draw!', steps: [
      ['Draw a big round head.', ac(100, 70, 45)],
      ['Draw 4 wiggly legs on the left side.', octoLeft],
      ['Draw 4 wiggly legs on the right side, too. That makes 8!', mirrorX(octoLeft)],
      ['Draw two big eyes with shiny dots.', ae(84, 68, 9, 12) + ae(116, 68, 9, 12) + ac(86, 71, 4) + ac(118, 71, 4)],
      ['Add a smile and two round cheeks.', ap('M88 92 q12 10 24 0') + ac(70, 88, 5) + ac(130, 88, 5)],
      ['Add little circles on the legs and some bubbles. Color it purple or pink!', ac(57, 127, 3) + ac(72, 140, 3) + ac(143, 127, 3) + ac(128, 140, 3) + ac(160, 30, 5) + ac(172, 14, 7) + ac(40, 22, 5)]] },
    { id: 'o-whale', cat: 'ocean', level: 2, title: 'A happy whale', ico: '🐳', need: P, tip: 'Big round shapes make animals look friendly.', steps: [
      ['Draw a big rounded body, fat at the front and thin at the back.', ap('M30 120 C15 75 75 50 120 70 C145 80 155 95 165 102 C155 118 140 140 95 142 C60 143 38 135 30 120 Z')],
      ['Add a tail at the thin end, like a big letter V.', ap('M163 101 Q168 82 192 72 Q182 92 180 104 Q190 116 194 132 Q172 126 163 104')],
      ['Draw an eye and a long smile.', ac(62, 100, 4) + ap('M28 112 q22 10 46 2')],
      ['Draw a long curvy line for the belly.', ap('M34 126 Q90 128 152 114')],
      ['Add a flipper on the side.', ap('M88 104 q0 18 22 18 q-6 -10 -8 -18')],
      ['Draw water shooting up from the top of the head.', ap('M70 62 V40 M70 40 q-10 -15 -24 -6 M70 40 q10 -15 24 -6') + ac(44, 44, 3) + ac(96, 44, 3)],
      ['Draw waves under the whale and color it blue!', ap('M0 165 q12.5 -10 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0') + ap('M0 185 q12.5 -10 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0')]] },
    { id: 'o-turtle', cat: 'ocean', level: 2, title: 'A sea turtle', ico: '🐢', need: P, tip: 'Draw one flipper, then copy it on the other side.', steps: [
      ['Draw a big oval for the shell.', ae(100, 105, 45, 55)],
      ['Draw a round head at the top.', ac(100, 37, 14)],
      ['Draw two big front flippers, like wings.', ap('M62 78 Q25 52 18 80 Q38 96 58 98') + ap('M138 78 Q175 52 182 80 Q162 96 142 98')],
      ['Draw two small back flippers and a tiny tail.', ap('M66 140 Q42 158 54 172 Q70 166 78 152') + ap('M134 140 Q158 158 146 172 Q130 166 122 152') + apg('95,159 100,172 105,159')],
      ['Draw a shape with 6 sides in the middle of the shell. Join its corners to the edge.', apg('100,85 118,95 118,115 100,125 82,115 82,95') + al(100, 85, 100, 50) + al(100, 125, 100, 160) + al(82, 95, 59, 82) + al(118, 95, 141, 82) + al(82, 115, 59, 128) + al(118, 115, 141, 128)],
      ['Give it two eyes and a smile.', ac(94, 34, 2.5) + ac(106, 34, 2.5) + ap('M94 42 q6 5 12 0')],
      ['Add bubbles and color the shell green and brown.', ac(160, 30, 5) + ac(172, 14, 7) + ac(30, 150, 4) + ac(22, 130, 6)]] },
    { id: 'o-seahorse', cat: 'ocean', level: 3, title: 'A seahorse', ico: '🌊', need: 'Paper, a pencil, an eraser, crayons', tip: 'A seahorse is an S shape. Find the S first and the rest is easy.', steps: [
      ['Draw a light S-shaped guide line. It shows how the seahorse bends.', guide(ap('M108 40 C85 75 135 105 112 145 C100 165 120 182 132 168'))],
      ['Draw a circle for the head at the top of the S.', ac(105, 50, 18)],
      ['Draw a long tube nose, like a straw, with a round end.', ap('M88 44 L62 41 Q55 47 62 53 L88 56')],
      ['Draw the round tummy in front and the back behind, down to the bottom of the S.', ap('M95 65 C68 85 76 128 106 142') + ap('M118 63 C142 85 138 122 118 145')],
      ['Curl the tail like a snail shell.', ap('M106 142 C98 165 112 184 128 178 C140 172 136 158 126 160') + ap('M118 145 C114 160 120 168 128 168')],
      ['Add the eye, little spikes on top and a fin on the back.', ac(104, 48, 4) + ac(105, 48, 1.5) + apl('98,33 101,24 106,32 111,25 114,36') + ap('M136 92 q16 4 12 24 q-8 -4 -12 -8')],
      ['Draw ridge lines across the tummy.', ap('M80 88 h14 M78 100 h16 M80 112 h16 M86 124 h14 M94 134 h10')],
      ['Erase the guide. Add seaweed and bubbles, then color it yellow or orange.', ap('M30 198 q-10 -20 0 -40 q10 -20 0 -40') + ap('M170 198 q10 -15 0 -30 q-10 -15 0 -30') + ac(40, 80, 5) + ac(30, 62, 3), { clear: true }]] },

    /* ---- Bugs & birds ---- */
    { id: 'b-bee', cat: 'bugs', level: 1, title: 'A busy bee', ico: '🐝', need: P, tip: 'Count the stripes out loud as you draw them!', steps: [
      ['Draw a big oval for the body.', ae(100, 110, 45, 32)],
      ['Draw a round head on the left side.', ac(40, 108, 20)],
      ['Draw 3 bendy stripes on the body.', ap('M85 80 q-8 30 0 60 M105 78 q-8 32 0 64 M125 83 q-6 27 0 54')],
      ['Draw two wings on top, like loops.', ae(85, 60, 14, 21) + ae(113, 58, 14, 21)],
      ['Add a pointy stinger at the back.', apg('144,104 162,110 144,116')],
      ['Give it an eye, a smile and two curly feelers.', ac(33, 102, 3) + ap('M28 114 q6 5 12 0') + ap('M34 89 q-4 -16 -14 -20 M46 90 q2 -16 10 -22') + ac(19, 68, 3) + ac(57, 67, 3)],
      ['Draw a dotted path to show where it flew. Color it yellow and black!', fold(ap('M166 112 q20 4 22 24 q0 16 -14 12 q-10 -6 2 -16 q12 -8 22 14'))]] },
    { id: 'b-snail', cat: 'bugs', level: 1, title: 'A snail', ico: '🐌', need: P, tip: 'Go round and round slowly for the swirl.', steps: [
      ['Draw a big circle for the shell.', ac(105, 95, 45)],
      ['Draw a swirl inside, going round and round.', spiral(105, 95, 3, 40)],
      ['Draw a long body under the shell, with a head that pokes up.', ap('M150 140 Q172 140 178 150 H48 C32 150 28 130 36 112 C42 98 60 98 62 112 L63 137')],
      ['Draw two feelers with balls on the ends.', al(42, 102, 32, 76) + al(54, 100, 60, 75) + ac(31, 72, 4) + ac(61, 71, 4)],
      ['Add an eye and a smile.', ac(46, 118, 2.5) + ap('M40 130 q6 5 12 0')],
      ['Draw a shiny dotted trail and some grass. Color the shell!', fold(al(180, 158, 198, 158)) + ap('M8 190 l5 -12 l5 12 l5 -12 l5 12 M140 190 l5 -12 l5 12 l5 -12 l5 12 l5 -12 l5 12')]] },
    { id: 'b-ladybug', cat: 'bugs', level: 2, title: 'A ladybug on a leaf', ico: '🐞', need: P, tip: 'Make both sides match, like a mirror.', steps: [
      ['Draw a big circle for the body.', ac(100, 105, 45)],
      ['Draw a half circle on top for the head.', ap('M80 67 A22 22 0 1 1 120 67')],
      ['Draw a line down the middle. These are the wings.', al(100, 60, 100, 150)],
      ['Draw round spots. Copy each spot on the other side!', ac(78, 88, 8) + ac(122, 88, 8) + ac(74, 120, 8) + ac(126, 120, 8) + ac(92, 136, 5) + ac(108, 136, 5)],
      ['Add two white eyes and two feelers.', ac(91, 52, 4) + ac(109, 52, 4) + ap('M92 38 q-8 -14 -18 -16 M108 38 q8 -14 18 -16')],
      ['Draw 3 little legs on each side.', al(57, 95, 40, 88) + al(55, 110, 37, 113) + al(60, 126, 44, 138) + al(143, 95, 160, 88) + al(145, 110, 163, 113) + al(140, 126, 156, 138)],
      ['Draw a big leaf behind the ladybug, with a middle line.', ap('M10 192 C4 95 92 10 192 8 C194 110 108 196 10 192 Z') + al(14, 188, 67, 137) + al(133, 73, 188, 12)],
      ['Color the ladybug red with black spots, and the leaf green.', '']] },
    { id: 'b-bird', cat: 'bugs', level: 2, title: 'A bird on a branch', ico: '🐦', need: P, tip: 'A bird is mostly two shapes: a small head and a big tummy.', steps: [
      ['Draw a circle for the head.', ac(65, 75, 20)],
      ['Draw a round tummy curving down and back from the head.', ap('M52 90 C48 130 105 145 145 122') + ap('M84 69 C110 74 130 90 145 104')],
      ['Add a pointy tail at the back.', ap('M145 122 L186 116 L176 102 L145 104')],
      ['Add a triangle beak and a round eye.', apg('46,69 28,76 46,82') + ac(62, 70, 4) + ac(63, 70, 1.5)],
      ['Draw a wing on the side, like a big tear drop.', ap('M80 96 C92 124 124 124 140 110 C120 100 102 92 80 96 Z')],
      ['Draw the branch under the bird, and little feet holding on.', ap('M5 146 Q100 138 195 150 M5 156 Q100 148 195 160') + ap('M88 132 L88 143 M100 134 L100 142') + ap('M82 146 l6 -3 l6 3 M94 145 l6 -3 l6 3')],
      ['Add some leaves and color your bird. What color is it?', ap('M160 154 q15 -22 32 -14 q-14 16 -32 14') + ap('M30 148 q-6 -22 -24 -24 q4 18 24 24')]] },
    { id: 'b-peacock', cat: 'bugs', level: 3, title: 'A proud peacock', ico: '🦚', need: 'Paper, a pencil, an eraser, crayons', tip: 'Turn your paper as you draw the fan. It makes curves easier.', steps: [
      ['Draw a light half circle for the big tail fan.', guide(ap('M8 150 A92 92 0 0 1 192 150'))],
      ['Draw a small head and a long body shaped like a pear.', ac(100, 56, 9) + ap('M95 64 C92 90 82 115 85 140 C88 165 112 165 115 140 C118 115 108 90 105 64')],
      ['Draw lines fanning out from behind the body, like a spread-out hand.', fanLines],
      ['At the end of each line draw an eye: a circle with a dot inside.', fanEyes],
      ['Draw a bumpy edge along the guide to finish the fan.', fanEdge],
      ['Add a beak, an eye and a little crown on the head.', apg('91,57 84,59 91,61') + ac(98, 54, 1.5) + al(100, 47, 95, 36) + al(100, 47, 100, 34) + al(100, 47, 105, 36) + ac(95, 34, 2) + ac(100, 32, 2) + ac(105, 34, 2)],
      ['Draw legs and the ground.', ap('M95 160 L93 182 M105 160 L107 182 M93 182 l-6 4 M93 182 l2 5 M107 182 l6 4 M107 182 l-2 5') + al(20, 188, 180, 188)],
      ['Erase the guide. Color the body blue and the fan green, blue and gold.', '', { clear: true }]] },

    /* ---- Dinosaurs & dragons ---- */
    { id: 'd-longneck', cat: 'dino', level: 1, title: 'A long-neck dinosaur', ico: '🦕', need: P, tip: 'Big shapes first, little details last.', steps: [
      ['Draw a big oval for the body.', ae(110, 130, 50, 32)],
      ['Draw a long neck going up: two lines, side by side.', ap('M66 115 C58 90 50 70 45 50') + ap('M88 101 C80 85 72 66 66 47')],
      ['Draw a small oval head on top of the neck.', ae(52, 38, 20, 13)],
      ['Draw a long tail at the back, ending in a point.', ap('M158 122 Q180 125 195 155 Q178 145 156 143')],
      ['Draw 4 short, thick legs.', ap('M70 149 V182 H84 V157') + ap('M88 159 V184 H102 V162') + ap('M122 161 V184 H136 V157') + ap('M140 156 V180 H152 V147')],
      ['Give it an eye, a smile and spots on its back.', ac(50, 34, 3) + ap('M36 42 q8 5 16 1') + ac(100, 112, 6) + ac(122, 108, 5) + ac(138, 124, 6) + ac(112, 128, 4)],
      ['Draw grass and color your dino! Green, blue or purple?', ap('M5 192 l5 -10 l5 10 l5 -10 l5 10 M60 194 l5 -10 l5 10 l5 -10 l5 10 M165 194 l5 -10 l5 10 l5 -10 l5 10')]] },
    { id: 'd-trex', cat: 'dino', level: 1, title: 'A T-rex', ico: '🦖', need: P, tip: 'Big head, big legs, tiny arms. That is what makes it a T-rex!', steps: [
      ['Draw a big head near the top right: a long box with round corners.', ap('M118 64 C112 38 126 22 152 22 L176 24 Q192 28 191 44 L190 62 Q188 76 172 77 L140 79 C128 80 120 74 118 64 Z')],
      ['Draw a big round body under the head, like a hill leaning up to the head.', ap('M124 74 C104 80 72 84 60 104 C48 126 60 152 90 152 C118 152 140 132 148 110 C152 96 152 88 150 79')],
      ['Draw a long tail sticking out the back, ending in a point.', ap('M60 104 Q30 106 4 120 Q34 130 54 136')],
      ['Draw a long mouth line. Add zig-zag teeth on the top and the bottom.', al(146, 60, 190, 60) + apl('152,60 156,68 160,60 164,68 168,60 172,68 176,60 180,68 184,60')],
      ['Add an eye with a cross eyebrow, and a nose hole.', ac(150, 40, 5) + ac(151, 40, 2) + al(142, 31, 160, 35) + ac(182, 36, 2)],
      ['Draw two tiny arms! Each one has two little claws.', ap('M146 104 q10 2 12 10 M158 114 l5 -1 M158 114 l3 4') + ap('M140 116 q8 4 8 12 M148 128 l5 0 M148 128 l2 4')],
      ['Draw two big strong legs, with three toes on each foot.', ap('M76 146 L74 168 L62 182 H98 L94 168 L98 151') + ap('M116 146 L120 170 L108 182 H140 L134 170 L138 126') + ap('M74 182 v-6 M86 182 v-6 M116 182 v-6 M128 182 v-6')],
      ['Draw the ground and a sun. Color your T-rex. ROAR!', al(0, 184, 200, 184) + ac(30, 30, 12) + ring(8, 20, (x, y) => al(f1(30 + (x - 100) * 0.85), f1(30 + (y - 100) * 0.85), f1(30 + (x - 100) * 1.15), f1(30 + (y - 100) * 1.15)))]] },
    { id: 'd-tricera', cat: 'dino', level: 2, title: 'A triceratops', ico: '🦏', need: P, tip: 'Draw the front shapes first. Then stop your lines when they bump into them.', steps: [
      ['Draw the head on the left: a long shape with a pointy beak at the front.', ap('M84 104 C70 96 50 96 36 104 L14 124 Q26 136 46 134 C62 134 76 130 88 122 Z')],
      ['Draw a big round frill behind the head, like a fan or a shield.', ap('M50 100 C38 60 72 36 100 50 C126 64 120 106 94 120')],
      ['Draw the big round body behind the frill. Stop when you reach the frill.', ap('M116 70 C142 62 180 76 186 108 C190 136 166 150 136 150 C116 150 104 146 96 134')],
      ['Draw two long horns over the eye, and a small horn on the nose.', apl('44,99 10,80 54,97') + apl('62,96 30,70 72,98') + apl('25,114 20,100 31,108')],
      ['Add an eye and a smile. Draw little bumps along the edge of the frill.', ac(56, 112, 4) + ac(57, 112, 1.5) + ap('M20 126 q10 6 22 2') + ac(46, 74, 3.5) + ac(58, 54, 3.5) + ac(78, 44, 3.5) + ac(100, 48, 3.5) + ac(114, 64, 3.5) + ac(116, 86, 3.5)],
      ['Draw 4 thick legs and a short pointy tail.', ap('M100 140 V180 H116 V146') + ap('M122 150 V184 H138 V150') + ap('M150 150 V182 H166 V146') + ap('M170 140 V176 H184 V124') + ap('M186 104 Q196 110 199 124 Q190 122 187 120')],
      ['Color your triceratops and draw some plants to munch!', ap('M8 192 l5 -12 l5 12 l5 -12 l5 12 M40 192 l5 -12 l5 12 l5 -12 l5 12 M170 192 l5 -12 l5 12 l5 -12 l5 12')]] },
    { id: 'd-stego', cat: 'dino', level: 2, title: 'A stegosaurus', ico: '🦕', need: P, tip: 'Big plates in the middle, small ones at the ends.', steps: [
      ['Draw a big hill shape for the body, flat on the bottom.', ap('M45 140 C55 75 145 75 165 140 Z')],
      ['Draw a small head low at the front.', ap('M52 124 Q34 104 14 112 Q2 126 18 134 L48 138')],
      ['Draw a tail at the back, ending in a point.', ap('M158 116 Q180 116 196 98 Q186 126 165 140')],
      ['Draw pointy plates along the back. Big in the middle, small at the ends.', stegoPlate(0.15, 14) + stegoPlate(0.3, 22) + stegoPlate(0.45, 28) + stegoPlate(0.6, 26) + stegoPlate(0.75, 20) + stegoPlate(0.88, 14)],
      ['Add spikes on the tail.', al(184, 108, 190, 92) + al(178, 114, 188, 100)],
      ['Draw 4 thick legs.', ap('M55 140 V172 H70 V140') + ap('M80 140 V176 H95 V140') + ap('M120 140 V176 H135 V140') + ap('M145 140 V172 H160 V140')],
      ['Give it an eye and a smile, then color it!', ac(20, 118, 2.5) + ap('M10 126 q6 4 12 2')]] },
    { id: 'd-dragon', cat: 'dino', level: 3, title: 'A friendly dragon', ico: '🐉', need: 'Paper, a pencil, an eraser, crayons', tip: 'Draw the guide shapes very lightly so they are easy to erase.', steps: [
      ['Draw light guides: a circle for the head and a big circle for the body.', guide(ac(132, 55, 24) + ac(95, 128, 44))],
      ['Draw the head over the small guide, with a long nose sticking out.', ap('M112 66 C104 38 132 26 150 40 L176 48 Q186 58 174 68 L142 76 C128 82 116 76 112 66 Z')],
      ['Draw a round tummy over the big guide. Join it to the head with a neck.', ap('M138 77 C150 100 145 140 132 158 C118 178 70 176 56 155 C44 135 58 100 82 92 C95 86 104 78 112 66')],
      ['Draw a long belly patch on the front of the tummy. Add short lines across it, like a ladder.', ap('M132 88 C120 110 112 140 118 164') + ap('M124 102 l12 4 M118 118 l20 3 M115 134 l24 1 M115 150 l22 -2')],
      ['Draw a bat wing on the back: a long top edge out to a point, then a bumpy edge back to the body.', ap('M84 92 L34 26 Q40 50 22 58 Q38 70 18 84 Q40 92 62 110') + ap('M84 92 L22 58 M84 92 L18 84')],
      ['Add horns, an eye, a nose hole and a long tail with a pointy tip.', apg('126,34 120,14 136,30') + apg('140,34 144,16 150,36') + ac(140, 50, 4) + ac(141, 50, 1.5) + ac(172, 54, 2) + ap('M132 158 Q168 176 184 152 Q192 138 180 130') + apg('180,130 172,114 192,122')],
      ['Draw bumpy spikes down the back and little legs.', apl('112,66 104,72 108,78 96,84 100,90 86,92') + ap('M80 170 V188 H100 V174 M120 170 V188 H140 V160')],
      ['Erase the guides. Add a puff of smoke and color your dragon!', ac(186, 64, 4) + ac(193, 54, 3) + ac(190, 44, 2), { clear: true }]] },

    /* ---- Food & treats ---- */
    { id: 'f-icecream', cat: 'food', level: 1, title: 'An ice cream cone', ico: '🍦', need: P, tip: 'Your favorite flavor is the best color!', steps: [
      ['Draw a triangle pointing down for the cone.', apg('65,95 135,95 100,185')],
      ['Draw criss-cross lines on the cone.', al(85, 95, 75, 120.7) + al(105, 95, 85, 146.4) + al(125, 95, 95, 172) + al(115, 95, 125, 120.7) + al(95, 95, 115, 146.4) + al(75, 95, 105, 172)],
      ['Draw a big round scoop on top, with a bumpy bottom.', ap('M60 97 C50 40 150 40 140 97 q-10 8 -20 0 q-10 8 -20 0 q-10 8 -20 0 q-10 8 -20 0 Z')],
      ['Put a round cherry on top, with a stem.', ac(100, 45, 9) + ap('M100 36 q2 -10 12 -14')],
      ['Add sprinkles: lots of tiny lines!', ap('M75 75 l5 -3 M90 65 l4 4 M110 68 l5 -2 M125 78 l3 5 M85 85 l5 2 M105 82 l-4 4 M120 90 l5 -1')],
      ['Color your ice cream. Add a drip if it is melting!', ap('M120 97 q-2 10 3 14 q5 -2 3 -12')]] },
    { id: 'f-cupcake', cat: 'food', level: 1, title: 'A cupcake', ico: '🧁', need: P, tip: 'Curly lines look like soft, yummy frosting.', steps: [
      ['Draw the cup: wide on top and smaller on the bottom.', ap('M55 115 L68 180 H132 L145 115 Z')],
      ['Draw lines down the cup.', al(78, 115, 85, 180) + al(100, 115, 100, 180) + al(122, 115, 115, 180)],
      ['Draw puffy frosting on top, with a point at the very top.', ap('M50 115 C38 100 52 85 65 90 C62 70 80 62 88 66 C85 50 100 40 100 30 C100 40 115 50 112 66 C120 62 138 70 135 90 C148 85 162 100 150 115 Z')],
      ['Put a cherry on the point.', ac(100, 22, 8) + ap('M100 14 q2 -8 10 -10')],
      ['Add sprinkles all over the frosting.', ap('M70 100 l5 -3 M90 92 l4 4 M110 98 l5 -2 M128 104 l3 5 M100 80 l4 -3 M80 108 l5 2 M118 84 l-3 4 M60 105 l3 4 M140 104 l-4 3')],
      ['Color your cupcake. Pink, blue or chocolate?', '']] },
    { id: 'f-pizza', cat: 'food', level: 2, title: 'A slice of pizza', ico: '🍕', need: P, tip: 'Round things on the pizza can be any size. Real food is not perfect!', steps: [
      ['Draw two slanted lines that meet at the bottom, like a big V.', ap('M42 54 L100 185 L158 54')],
      ['Draw a fat, bumpy crust across the top.', ap('M35 40 Q100 18 165 40 Q170 52 158 55 Q100 38 42 55 Q30 52 35 40 Z')],
      ['Draw round pepperoni slices.', ac(84, 80, 11) + ac(122, 84, 11) + ac(98, 118, 9) + ac(100, 154, 6)],
      ['Add little rings for olives and small leaves.', ac(68, 70, 4) + ac(138, 66, 4) + ac(112, 138, 4) + ap('M120 110 q8 -10 16 0 q-8 8 -16 0') + ap('M70 96 q8 -10 16 0 q-8 8 -16 0')],
      ['Draw cheese dripping off the sides.', ap('M57 88 q-6 10 -2 16 q6 2 6 -6') + ap('M140 92 q8 8 4 16 q-6 0 -6 -8')],
      ['Add wavy lines above to show it is hot. Color it yummy!', ap('M70 26 q-5 -5 0 -10 q5 -5 0 -10 M100 22 q-5 -5 0 -10 q5 -5 0 -10 M130 26 q-5 -5 0 -10 q5 -5 0 -10')]] },
    { id: 'f-fruit', cat: 'food', level: 2, title: 'A fruit bowl', ico: '🍎', need: P, tip: 'Fruit in front hides fruit behind. Stop your line where it bumps another shape.', steps: [
      ['Draw a bowl: a half circle with a flat top.', ap('M25 120 A75 55 0 0 0 175 120 Z')],
      ['Add a little stand under the bowl.', ap('M80 172 L74 188 H126 L120 172')],
      ['Draw a round apple on the left, sitting in the bowl.', ap('M42.5 120 A22 22 0 1 1 81.5 120')],
      ['Draw a round orange on the right.', ap('M118.5 120 A22 22 0 1 1 157.5 120')],
      ['Draw a bunch of grapes in the middle: little circles.', ac(92, 80, 8) + ac(108, 80, 8) + ac(92, 96, 8) + ac(108, 96, 8) + ac(100, 111, 8) + al(100, 72, 100, 62)],
      ['Draw a banana curving over the top.', ap('M45 70 Q100 15 155 70 Q100 32 45 70')],
      ['Add a stem and leaf on the apple, and a dot on the orange. Color it all!', al(62, 88, 64, 78) + ap('M64 82 q10 -8 16 -2 q-8 6 -16 2') + ac(138, 100, 1.5) + ap('M35 140 Q100 158 165 140')]] },
    { id: 'f-cake', cat: 'food', level: 3, title: 'A birthday cake', ico: '🎂', need: 'Paper, a pencil, an eraser, crayons', tip: 'Ovals on top make a cake look round and real, not flat.', steps: [
      ['Draw a light line down the middle, so both sides match.', guide(al(100, 20, 100, 196))],
      ['Draw the top layer first: a flat oval, two sides and a curve at the bottom.', ae(100, 78, 40, 10) + al(60, 78, 60, 118) + al(140, 78, 140, 118) + ap('M60 118 A40 10 0 0 0 140 118')],
      ['Draw a wider layer under it. Stop your line where it touches the top layer.', ap('M60 109 A65 14 0 0 0 35 120 A65 14 0 0 0 165 120 A65 14 0 0 0 140 109') + al(35, 120, 35, 170) + al(165, 120, 165, 170) + ap('M35 170 A65 14 0 0 0 165 170')],
      ['Draw frosting drips along the front of the bottom layer.', cakeDrips],
      ['Put 3 candles on top, each with a flame.', [80, 96, 112].map(x => ar(x, 56, 8, 24, 2) + ap(`M${x + 4} 40 q-7 9 0 13 q7 -4 0 -13`)).join('')],
      ['Add dots on the top layer and a plate under the cake.', [72, 86, 100, 114, 128].map(x => ac(x, 102, 3)).join('') + ap('M35 172 Q16 176 16 180 C16 196 184 196 184 180 Q184 176 165 172')],
      ['Erase the guide. Color your cake and write a name on it!', '', { clear: true }]] },

    /* ---- Fairy tales & magic ---- */
    { id: 'm-wand', cat: 'fantasy', level: 1, title: 'A magic wand', ico: '🪄', need: P, tip: 'Stars are tricky. It is OK if the points are not all the same!', steps: [
      ['Draw a big star with 5 points.', apg(starPts(70, 70, 44, 19, 5, 27))],
      ['Draw a long stick going down from the star.', ap('M83 93 L162 172 Q170 176 172 166 L93 83')],
      ['Give the star a happy face.', ac(62, 66, 3) + ac(78, 66, 3) + ap('M62 76 q8 7 16 0')],
      ['Tie a bow on the stick.', ap('M120 130 q-18 -2 -12 -14 q10 -2 12 14 q2 -18 14 -12 q2 12 -14 12') + ap('M120 130 l-8 14 M120 130 l6 14')],
      ['Draw sparkles flying out of the star!', sparkle(140, 40, 9) + sparkle(160, 80, 6) + sparkle(25, 140, 7) + sparkle(130, 15, 5) + ac(150, 60, 2) + ac(40, 120, 2) + ac(115, 30, 2)],
      ['Color your wand. What wish will you make?', '']] },
    { id: 'm-unicorn', cat: 'fantasy', level: 1, title: 'A unicorn', ico: '🦄', need: P, tip: 'Make the mane any colors you like. A rainbow is fun!', steps: [
      ['Draw a tall oval for the face.', ae(100, 110, 42, 52)],
      ['Draw a curved line across the bottom part for the nose.', ap('M62 132 Q100 118 138 132')],
      ['Add two nose holes and a smile.', ae(86, 145, 3, 5) + ae(114, 145, 3, 5) + ap('M90 154 q10 6 20 0')],
      ['Draw two sleepy happy eyes with lashes.', ap('M74 100 q9 8 18 0 M108 100 q9 8 18 0') + ap('M76 103 l-4 4 M83 106 v5 M106 103 l-4 4 M117 106 v5 M90 103 l4 4 M124 103 l4 4')],
      ['Add two pointy ears and a tall horn in the middle.', apl('68,75 62,40 88,62') + apl('132,75 138,40 112,62') + apl('90,59 100,10 110,59') + al(93, 47, 107, 42) + al(95, 35, 105, 31) + al(97, 24, 103, 21)],
      ['Draw a curly mane down one side of the face.', ap('M132 74 C150 70 160 84 150 92 C164 96 166 114 152 118 C166 124 162 142 146 140 C154 150 146 162 134 156')],
      ['Color your unicorn and add stars around it!', sparkle(30, 40, 8) + sparkle(170, 30, 6) + sparkle(30, 160, 6)]] },
    { id: 'm-mermaid', cat: 'fantasy', level: 2, title: 'A mermaid', ico: '🧜', need: P, tip: 'The tail is just a long curvy shape that gets thin, then fans out.', steps: [
      ['Draw a circle for the head.', ac(100, 45, 18)],
      ['Draw a short neck and the body.', ap('M95 63 V70 M105 63 V70') + ap('M95 70 Q82 72 80 78 L86 108 H114 L120 78 Q118 72 105 70')],
      ['Draw a long tail that curves to the side.', ap('M86 108 C82 140 95 165 125 170') + ap('M114 108 C118 132 118 150 132 158')],
      ['Add a fin at the end of the tail, like a fan.', ap('M125 170 Q148 190 172 178 Q156 168 162 142 Q146 146 132 158')],
      ['Draw long wavy hair and two arms.', ap('M82 44 C78 20 122 20 118 44') + ap('M82 44 C76 64 70 80 66 98 M118 44 C124 64 130 80 134 98') + ap('M82 80 Q68 96 80 110 M118 80 Q132 96 120 110')],
      ['Add a face and scales on the tail, like little U shapes.', ac(94, 44, 2) + ac(106, 44, 2) + ap('M95 52 q5 4 10 0') + ap('M92 120 q4 5 8 0 q4 5 8 0 M95 133 q4 5 8 0 q4 5 8 0 M102 146 q4 5 8 0 q4 5 8 0')],
      ['Draw bubbles and a starfish. Color her tail sparkly!', ac(150, 50, 5) + ac(160, 32, 7) + ac(148, 14, 4) + apg(starPts(40, 170, 14, 6))]] },
    { id: 'm-fairy', cat: 'fantasy', level: 2, title: 'A little fairy', ico: '🧚', need: P, tip: 'Wings look best when the top ones are bigger than the bottom ones.', steps: [
      ['Draw a circle for the head.', ac(100, 50, 18)],
      ['Draw a triangle dress under the head.', ap('M100 68 V72 M92 72 H108 L135 140 H65 Z')],
      ['Draw two big wings on top, one on each side.', ap('M88 84 C55 40 22 70 44 94 C56 104 76 100 85 94') + ap('M112 84 C145 40 178 70 156 94 C144 104 124 100 115 94')],
      ['Draw two small wings below them.', ap('M84 100 C58 104 48 130 68 132 C78 133 82 120 81 108') + ap('M116 100 C142 104 152 130 132 132 C122 133 118 120 119 108')],
      ['Add arms, legs and little shoes.', al(93, 80, 82, 104) + al(107, 80, 120, 64) + al(90, 140, 88, 166) + al(110, 140, 112, 166) + ae(84, 168, 7, 4) + ae(116, 168, 7, 4)],
      ['Give her a face, hair and a magic wand.', ac(94, 50, 2) + ac(106, 50, 2) + ap('M95 57 q5 4 10 0') + ap('M82 50 C78 26 122 26 118 50 C112 38 92 36 82 50') + ac(100, 30, 6) + al(120, 64, 127, 42) + apg(starPts(129, 33, 11, 5))],
      ['Add sparkles and color your fairy!', sparkle(170, 70, 7) + sparkle(30, 30, 6) + sparkle(40, 160, 7) + sparkle(165, 150, 5)]] },
    { id: 'm-chest', cat: 'fantasy', level: 3, title: 'A treasure chest', ico: '💰', need: 'Paper, a pencil, an eraser, a ruler, crayons', tip: 'Lines that go back all slant the same way. That makes a box look 3D.', steps: [
      ['Draw a long rectangle for the front of the chest.', ar(30, 105, 100, 65)],
      ['Draw light guide lines going back from the right corners. They slant the same way.', guide(al(130, 105, 178, 81) + al(130, 170, 178, 146))],
      ['Draw the side of the box: a short back edge standing straight up.', ap('M130 170 L170 150 V85 L130 105')],
      ['Draw the round lid: a curved bump on the side, a flat top and a curve on the left.', ap('M130 105 C130 70 168 50 170 85') + al(56, 66, 154, 66) + ap('M30 105 C30 84 42 68 56 66')],
      ['Add metal bands and a lock with a keyhole.', ap('M44 105 V170 M56 105 V170 M104 105 V170 M116 105 V170') + ap('M44 105 C44 86 50 72 58 67 M56 105 C56 88 62 74 70 66 M104 105 C104 88 110 74 118 66 M116 105 C116 88 122 74 130 66') + ar(72, 98, 16, 22, 3) + ac(80, 106, 2.5) + al(80, 108, 80, 114)],
      ['Draw wood lines on the front and side.', al(30, 128, 44, 128) + al(56, 128, 104, 128) + al(116, 128, 130, 128) + al(30, 150, 44, 150) + al(56, 150, 104, 150) + al(116, 150, 130, 150) + al(130, 128, 170, 108) + al(130, 150, 170, 130)],
      ['Draw gold coins and a jewel on the ground in front.', ae(40, 184, 10, 4) + ae(62, 188, 10, 4) + ae(150, 180, 10, 4) + ae(150, 175, 10, 4) + apg('90,182 98,174 106,182 98,192')],
      ['Erase the guides. Color the chest brown and the treasure gold!', '', { clear: true }]] }
  );
}/*}lazy*/);
