/* ---------- art school: step-by-step lessons across many kinds of art, 3 levels ---------- */
// Each step adds new lines (shown in red) on top of the earlier ones. Guide lines are dashed and get erased later.
// Pictures use a 200 × 200 box.

const ac = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}"/>`;
const ae = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`;
const al = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const ap = d => `<path d="${d}"/>`;
const ar = (x, y, w, h, rx = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`;
const apg = pts => `<polygon points="${pts}"/>`;
const apl = pts => `<polyline points="${pts}"/>`;
const guide = s => `<g class="gd">${s}</g>`;
const fold = s => `<g class="fold">${s}</g>`;
const stroke = (c, s) => `<g class="sk" style="--sk:${c}">${s}</g>`;
const paint = (c, s) => `<g class="pt" style="fill:${c}">${s}</g>`;
const atext = (x, y, t, size = 60, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" ${extra}>${t}</text>`;
const ring = (n, R, f) => Array.from({ length: n }, (_, i) => { const a = i * 2 * Math.PI / n - Math.PI / 2; return f(100 + R * Math.cos(a), 100 + R * Math.sin(a), a); }).join('');
const zig = (n, r1, r2, cx = 100, cy = 100) => Array.from({ length: n * 2 }, (_, i) => { const a = i * Math.PI / n - Math.PI / 2, r = i % 2 ? r1 : r2; return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
const wedge = (i, n, col, R = 80) => { const a0 = i / n * 2 * Math.PI - Math.PI / 2, a1 = (i + 1) / n * 2 * Math.PI - Math.PI / 2; return paint(col, `<path d="M100 100 L${100 + R * Math.cos(a0)} ${100 + R * Math.sin(a0)} A${R} ${R} 0 0 1 ${100 + R * Math.cos(a1)} ${100 + R * Math.sin(a1)} Z"/>`); };

const ART_CATS = [
  { id: 'shapes', name: 'Shape Pictures', ico: '🔷', blurb: 'Build pictures from circles, squares and triangles' },
  { id: 'animals', name: 'Animals', ico: '🐾', blurb: 'Cats, owls, elephants and more' },
  { id: 'people', name: 'Faces & People', ico: '🙂', blurb: 'Feelings, faces and bodies' },
  { id: 'nature', name: 'Nature & Landscapes', ico: '🌳', blurb: 'Flowers, trees, mountains and sea' },
  { id: 'cartoon', name: 'Cartoons', ico: '👾', blurb: 'Monsters and characters with personality' },
  { id: 'perspective', name: '3D & Perspective', ico: '🧊', blurb: 'Make flat drawings look real' },
  { id: 'shading', name: 'Light & Shading', ico: '🌗', blurb: 'Shadows, highlights and texture' },
  { id: 'color', name: 'Color Theory', ico: '🎨', blurb: 'How colors mix and work together' },
  { id: 'pattern', name: 'Patterns & Mandalas', ico: '🌀', blurb: 'Repeat, mirror and tile' },
  { id: 'letters', name: 'Lettering', ico: '🔤', blurb: 'Fancy letters and your name' },
  { id: 'craft', name: 'Paper Crafts', ico: '✂️', blurb: 'Fold planes, cups and animals' },
  { id: 'paint', name: 'Painting & Collage', ico: '🖌️', blurb: 'Washes, dots, sponges, torn paper and more' }
];
const LEVEL_NAMES = ['', 'Beginner', 'Explorer', 'Master'];

const LESSONS = [
  /* ---- Shape pictures ---- */
  { id: 'house', cat: 'shapes', level: 1, title: 'A cozy house', ico: '🏠', steps: [
    ['Draw a big square for the walls.', ar(50, 90, 100, 90)],
    ['Put a triangle on top for the roof.', apg('40,90 100,35 160,90')],
    ['Add a tall rectangle door in the middle, with a round knob.', ar(88, 130, 24, 50) + ac(107, 157, 2)],
    ['Draw two square windows. Split each into 4 little squares.', ar(60, 105, 22, 22) + ar(118, 105, 22, 22) + al(71, 105, 71, 127) + al(60, 116, 82, 116) + al(129, 105, 129, 127) + al(118, 116, 140, 116)],
    ['Add a chimney with curly smoke.', ar(125, 42, 14, 24) + ap('M132 36 q-8 -8 0 -14 q8 -6 0 -14')],
    ['Color it in! Try a red roof and yellow windows.', '']] },
  { id: 'snowman', cat: 'shapes', level: 1, title: 'A snowman', ico: '⛄', steps: [
    ['Draw a big circle at the bottom.', ac(100, 150, 40)],
    ['Draw a smaller circle on top.', ac(100, 88, 28)],
    ['Draw the smallest circle for the head. Big, medium, small!', ac(100, 45, 20)],
    ['Give him two dot eyes, a carrot nose and a smile.', ac(93, 40, 2.5) + ac(107, 40, 2.5) + apg('100,47 100,53 118,50') + ap('M92 56 q8 6 16 0')],
    ['Add 3 buttons and two stick arms.', ac(100, 78, 3) + ac(100, 92, 3) + ac(100, 140, 3) + al(72, 85, 40, 65) + al(128, 85, 160, 65) + al(40, 65, 32, 60) + al(40, 65, 38, 56) + al(160, 65, 168, 60) + al(160, 65, 162, 56)],
    ['Finish with a top hat.', ar(86, 6, 28, 19) + al(78, 25, 122, 25)]] },
  { id: 'rocket', cat: 'shapes', level: 1, title: 'A rocket ship', ico: '🚀', steps: [
    ['Draw a tall rectangle for the body.', ar(80, 60, 40, 100, 6)],
    ['Put a pointy triangle on top.', apg('80,60 100,20 120,60')],
    ['Add a round window.', ac(100, 85, 10) + ac(100, 85, 6)],
    ['Add two triangle fins at the bottom.', apg('80,120 58,165 80,160') + apg('120,120 142,165 120,160')],
    ['Draw zig-zag flames coming out. Whoosh!', ap('M86 160 L93 190 L100 172 L107 190 L114 160')],
    ['Add some stars and color the flames orange and yellow.', apg(zig(4, 3, 8, 30, 40)) + apg(zig(4, 3, 8, 165, 30)) + apg(zig(4, 2, 6, 160, 110))]] },
  { id: 'robot', cat: 'shapes', level: 2, title: 'A friendly robot', ico: '🤖', steps: [
    ['Draw a square head with rounded corners.', ar(70, 30, 60, 50, 6)],
    ['Add a short neck and a big body rectangle.', ar(92, 80, 16, 8) + ar(60, 88, 80, 70, 6)],
    ['Draw circle eyes and a mouth with teeth.', ac(87, 52, 7) + ac(113, 52, 7) + ar(85, 66, 30, 6) + al(92, 66, 92, 72) + al(100, 66, 100, 72) + al(108, 66, 108, 72)],
    ['Add an antenna with a ball on top.', al(100, 30, 100, 15) + ac(100, 11, 4)],
    ['Draw long arms and round hands.', ar(42, 92, 16, 50, 6) + ar(142, 92, 16, 50, 6) + ac(50, 148, 6) + ac(150, 148, 6)],
    ['Draw two legs and flat feet.', ar(72, 158, 18, 28) + ar(110, 158, 18, 28) + ar(66, 184, 30, 8, 3) + ar(104, 184, 30, 8, 3)],
    ['Put a control panel on the chest. How many buttons can you add?', ar(80, 100, 40, 26, 3) + ac(90, 113, 4) + ac(102, 113, 4) + al(110, 108, 116, 108) + al(110, 118, 116, 118)]] },
  { id: 'car', cat: 'shapes', level: 2, title: 'A race car', ico: '🚗', steps: [
    ['Draw a long rectangle for the car body.', ar(25, 100, 150, 40, 8)],
    ['Add the top part. It is a trapezoid: a shape with slanted sides.', ap('M55 100 L75 65 L135 65 L155 100')],
    ['Draw two windows inside the top.', apg('65,98 80,72 103,72 103,98') + apg('110,98 110,72 130,72 146,98')],
    ['Add two wheels. Draw a small circle inside each one.', ac(60, 140, 18) + ac(140, 140, 18) + ac(60, 140, 7) + ac(140, 140, 7)],
    ['Add lights, a door line and a handle.', ar(165, 108, 10, 10, 2) + ar(25, 108, 8, 10, 2) + al(106, 100, 106, 138) + al(112, 112, 122, 112)],
    ['Draw the road and speed lines to make it zoom!', al(5, 160, 195, 160) + al(2, 112, 18, 112) + al(4, 124, 16, 124)]] },
  { id: 'castle', cat: 'shapes', level: 3, title: 'A castle', ico: '🏰', steps: [
    ['Draw light guide lines: the ground and a middle line. A castle is symmetrical, so both sides match.', guide(al(10, 180, 190, 180) + al(100, 20, 100, 180))],
    ['Draw a wide wall in the middle.', ar(50, 90, 100, 90)],
    ['Draw two tall towers, the same size, one on each side.', ar(20, 60, 35, 120) + ar(145, 60, 35, 120)],
    ['Add the bumpy tops, called battlements.', ap('M20 60 V48 H27 V55 H34 V48 H41 V55 H48 V48 H55 V60') + ap('M145 60 V48 H152 V55 H159 V48 H166 V55 H173 V48 H180 V60') + ap('M55 90 V80 H65 V86 H75 V80 H85 V86 H95 V80 H105 V86 H115 V80 H125 V86 H135 V80 H145 V90')],
    ['Draw an arched gate with bars.', ap('M82 180 V140 A18 18 0 0 1 118 140 V180') + al(91, 125, 91, 180) + al(100, 122, 100, 180) + al(109, 125, 109, 180) + al(82, 150, 118, 150) + al(82, 165, 118, 165)],
    ['Add arched windows and flags on the towers.', ap('M32 92 v-10 a5 5 0 0 1 10 0 v10 z') + ap('M158 92 v-10 a5 5 0 0 1 10 0 v10 z') + al(37, 48, 37, 25) + apg('37,25 55,30 37,35') + al(162, 48, 162, 25) + apg('162,25 180,30 162,35')],
    ['Erase the guide lines. Add a few stones to the walls.', ar(60, 100, 12, 6) + ar(122, 110, 12, 6) + ar(28, 140, 12, 6) + ar(156, 150, 12, 6), { clear: true }]] },

  /* ---- Animals ---- */
  { id: 'cat', cat: 'animals', level: 1, title: 'A cat', ico: '🐱', steps: [
    ['Draw a big circle for the head.', ac(100, 80, 40)],
    ['Add two triangle ears on top.', apg('68,58 72,22 95,42') + apg('132,58 128,22 105,42')],
    ['Draw oval eyes with thin pupils.', ae(85, 78, 7, 9) + ae(115, 78, 7, 9) + ae(85, 78, 2, 7) + ae(115, 78, 2, 7)],
    ['Add a triangle nose and a mouth like a "w".', apg('95,92 105,92 100,98') + ap('M100 98 q-6 8 -12 2 M100 98 q6 8 12 2')],
    ['Give it whiskers: 2 on each side.', al(60, 92, 88, 96) + al(58, 102, 88, 100) + al(140, 92, 112, 96) + al(142, 102, 112, 100)],
    ['Draw an oval body, paws and a curly tail.', ae(100, 155, 38, 35) + ae(85, 188, 10, 6) + ae(115, 188, 10, 6) + ap('M136 160 q40 10 30 -30 q-5 -12 -12 -6')]] },
  { id: 'fish', cat: 'animals', level: 1, title: 'A fish', ico: '🐟', steps: [
    ['Draw a long oval body.', ae(95, 100, 55, 35)],
    ['Add a triangle tail.', apg('148,100 185,70 185,130')],
    ['Draw an eye and a little smile.', ac(65, 92, 8) + ac(67, 92, 3) + ap('M45 110 q8 5 14 0')],
    ['Add fins on top and bottom.', apg('90,66 110,45 120,70') + apg('95,134 110,152 118,132')],
    ['Draw curvy scales.', ap('M85 85 q8 10 0 20 M100 80 q8 12 0 24 M115 82 q8 12 0 22 M100 104 q8 12 0 24')],
    ['Add bubbles floating up!', ac(30, 70, 5) + ac(22, 52, 7) + ac(32, 32, 4)]] },
  { id: 'owl', cat: 'animals', level: 1, title: 'An owl', ico: '🦉', steps: [
    ['Draw a big oval for the body.', ae(100, 115, 50, 65)],
    ['Add pointy ear tufts.', apg('62,70 58,38 82,58') + apg('138,70 142,38 118,58')],
    ['Draw two big round eyes with pupils.', ac(80, 85, 18) + ac(120, 85, 18) + ac(80, 85, 7) + ac(120, 85, 7)],
    ['Add a small triangle beak.', apg('94,100 106,100 100,114')],
    ['Draw curved wings on each side.', ap('M52 110 q-10 40 20 65') + ap('M148 110 q10 40 -20 65')],
    ['Add feathers on the belly and feet on a branch.', ap('M85 135 q5 6 10 0 q5 6 10 0 q5 6 10 0 M80 150 q5 6 10 0 q5 6 10 0 q5 6 10 0 q5 6 10 0') + ap('M88 178 v9 M94 178 v9 M106 178 v9 M112 178 v9') + al(30, 188, 170, 188)]] },
  { id: 'dog', cat: 'animals', level: 2, title: 'A puppy', ico: '🐶', steps: [
    ['Draw a circle for the head.', ac(100, 75, 35)],
    ['Add long floppy ears hanging down.', ap('M72 55 q-30 10 -20 55 q15 0 20 -30') + ap('M128 55 q30 10 20 55 q-15 0 -20 -30')],
    ['Draw an oval snout and a round nose.', ae(100, 92, 18, 13) + ae(100, 84, 7, 5)],
    ['Add eyes, a mouth and a tongue.', ac(86, 68, 4) + ac(114, 68, 4) + ap('M100 89 v8 q-6 6 -12 0 M100 97 q6 6 12 0') + ap('M96 101 q4 10 8 0')],
    ['Draw an oval body and two front legs.', ae(100, 150, 40, 30) + ar(72, 165, 14, 25, 6) + ar(114, 165, 14, 25, 6)],
    ['Add a waggy tail and a collar with a tag.', ap('M138 145 q22 -10 20 -35') + ap('M75 102 q25 14 50 0') + ac(100, 112, 4)]] },
  { id: 'butterfly', cat: 'animals', level: 2, title: 'A butterfly', ico: '🦋', steps: [
    ['Draw a light guide line down the middle, then a thin oval body on it.', guide(al(100, 20, 100, 190)) + ae(100, 105, 6, 45)],
    ['Add a round head and two curly antennae.', ac(100, 55, 8) + ap('M97 48 q-10 -20 -20 -25 M103 48 q10 -20 20 -25') + ac(77, 23, 3) + ac(123, 23, 3)],
    ['Draw the big top wings. Make the right wing a mirror of the left.', ap('M96 80 C60 30 20 60 40 105 C55 120 85 110 96 100') + ap('M104 80 C140 30 180 60 160 105 C145 120 115 110 104 100')],
    ['Draw the smaller bottom wings, mirrored too.', ap('M96 110 C60 110 45 150 70 165 C88 175 96 150 96 130') + ap('M104 110 C140 110 155 150 130 165 C112 175 104 150 104 130')],
    ['Add spots. Whatever you draw on one side, copy on the other side.', ac(60, 80, 10) + ac(140, 80, 10) + ac(75, 145, 7) + ac(125, 145, 7) + ac(48, 98, 4) + ac(152, 98, 4)],
    ['Erase the middle line. Color both sides the same. That is symmetry!', '', { clear: true }]] },
  { id: 'turtle', cat: 'animals', level: 2, title: 'A turtle', ico: '🐢', steps: [
    ['Draw half a circle for the shell, flat on the bottom.', ap('M40 130 A60 60 0 0 1 160 130 Z')],
    ['Draw a hexagon (6 sides) in the middle of the shell.', apg('85,90 115,90 125,110 115,128 85,128 75,110')],
    ['Connect the hexagon to the edges to make shell plates.', al(85, 90, 70, 78) + al(115, 90, 130, 78) + al(75, 110, 42, 115) + al(125, 110, 158, 115)],
    ['Add a round head, an eye and a smile.', ap('M158 120 q30 -15 32 5 q0 15 -30 12') + ac(176, 114, 2.5) + ap('M174 124 q5 3 10 -1')],
    ['Draw stubby legs, a little tail and the ground.', ae(65, 138, 12, 8) + ae(135, 138, 12, 8) + apg('40,128 26,134 40,134') + al(10, 148, 190, 148)]] },
  { id: 'elephant', cat: 'animals', level: 3, title: 'An elephant', ico: '🐘', steps: [
    ['Start with light guide circles: a circle for the head and a big oval for the body. Artists sketch simple shapes first.', guide(ac(85, 85, 40) + ae(125, 135, 55, 40))],
    ['Draw the head outline over the guide.', ap('M60 115 C40 90 50 45 85 45 C115 45 125 70 120 95')],
    ['Draw a long trunk curving down. Two lines that stay the same distance apart.', ap('M60 115 C55 140 60 165 50 175 M76 118 C72 140 76 162 66 178') + al(50, 175, 66, 178)],
    ['Add a big floppy ear.', ap('M95 60 C140 40 160 90 130 115 C115 125 100 110 100 100')],
    ['Draw the body and 4 thick legs, following the guide oval.', ap('M120 95 C160 85 182 110 178 140 L178 178 H158 V158 H112 V178 H92 V145')],
    ['Add an eye, a tusk and a tail.', ac(78, 80, 3) + ap('M70 120 q8 18 22 14') + ap('M178 120 q12 10 8 25')],
    ['Erase the guides. Add wrinkle lines on the trunk.', ap('M57 132 h9 M59 146 h9 M58 160 h9'), { clear: true }]] },
  { id: 'lion', cat: 'animals', level: 3, title: 'A lion', ico: '🦁', steps: [
    ['Draw a circle for the face.', ac(100, 95, 35)],
    ['Draw a spiky mane all the way around, like a sun.', apg(zig(14, 46, 62, 100, 95))],
    ['Add round ears on top of the face.', ac(75, 66, 8) + ac(125, 66, 8)],
    ['Draw the eyes, a triangle nose and the mouth.', ae(87, 88, 4, 5) + ae(113, 88, 4, 5) + apg('92,102 108,102 100,112') + ap('M100 112 v6 q-8 8 -14 2 M100 118 q8 8 14 2')],
    ['Add whisker dots and a chin.', ac(88, 114, 1.5) + ac(84, 110, 1.5) + ac(112, 114, 1.5) + ac(116, 110, 1.5) + ap('M92 126 q8 6 16 0')],
    ['Add lines in the mane so it looks fluffy. Shade it darker near the face.', ring(12, 50, (x, y) => al((x - 100) * 0.95 + 100, (y - 100) * 0.95 + 95, (x - 100) * 1.1 + 100, (y - 100) * 1.1 + 95))]] },

  /* ---- Faces & people ---- */
  { id: 'smile', cat: 'people', level: 1, title: 'A happy face', ico: '😊', steps: [
    ['Draw a big circle.', ac(100, 100, 70)],
    ['Add two eyes, a little above the middle.', ac(75, 85, 7) + ac(125, 85, 7)],
    ['Draw a big smile like a "U".', ap('M65 120 q35 35 70 0')],
    ['Add rosy cheeks and some hair.', ac(58, 112, 8) + ac(142, 112, 8) + ap('M70 40 q10 -15 20 0 q10 -15 20 0 q10 -15 20 0')]] },
  { id: 'feelings', cat: 'people', level: 1, title: 'Four feelings', ico: '🎭', steps: [
    ['Draw 4 circles. We will give each one a different feeling.', ac(55, 55, 35) + ac(145, 55, 35) + ac(55, 145, 35) + ac(145, 145, 35)],
    ['Happy: eyes and a smile that goes up.', ac(45, 48, 3) + ac(65, 48, 3) + ap('M40 65 q15 15 30 0')],
    ['Sad: a mouth that goes down and a tear.', ac(135, 48, 3) + ac(155, 48, 3) + ap('M130 75 q15 -12 30 0') + ap('M157 56 q-3 6 0 8 q3 -2 0 -8')],
    ['Surprised: big eyes, raised eyebrows and an "O" mouth.', ac(45, 140, 5) + ac(65, 140, 5) + ap('M38 128 q7 -6 14 0 M58 128 q7 -6 14 0') + ac(55, 162, 7)],
    ['Angry: eyebrows slant down to the middle, and a tight mouth.', al(128, 132, 141, 138) + al(162, 132, 149, 138) + ac(136, 143, 3) + ac(154, 143, 3) + ap('M133 162 l6 -4 l6 4 l6 -4 l6 4')],
    ['Now try: sleepy, silly or scared. Eyebrows and mouths tell the feeling!', '']] },
  { id: 'stick', cat: 'people', level: 1, title: 'Stick people in action', ico: '🏃', steps: [
    ['Draw a circle for the head.', ac(100, 40, 15)],
    ['Draw a line for the body.', al(100, 55, 100, 115)],
    ['Add arms. One waving up, one down. Bending elbows shows movement.', ap('M100 70 L80 90 L70 110') + ap('M100 70 L120 60 L135 40')],
    ['Add legs with bent knees like it is running.', ap('M100 115 L82 140 L70 165') + ap('M100 115 L120 138 L140 150')],
    ['Add a ball to kick and motion lines!', ac(160, 165, 10) + al(30, 70, 50, 70) + al(25, 90, 45, 90)]] },
  { id: 'faceprop', cat: 'people', level: 2, title: 'Drawing a real face', ico: '🧑', steps: [
    ['Draw an egg shape, wider at the top.', ae(100, 105, 55, 72)],
    ['Draw a light line across the middle. Surprise: eyes go halfway down the head!', guide(al(45, 105, 155, 105))],
    ['Draw a center line, a nose line and a mouth line.', guide(al(100, 33, 100, 177) + al(60, 138, 140, 138) + al(65, 155, 135, 155))],
    ['Draw almond eyes on the eye line. The gap between them is one eye wide.', ap('M62 105 q13 -10 26 0 q-13 8 -26 0') + ap('M112 105 q13 -10 26 0 q-13 8 -26 0') + ac(75, 104, 4) + ac(125, 104, 4)],
    ['Add eyebrows above the eyes and the nose on the nose line.', ap('M60 92 q15 -8 30 0') + ap('M110 92 q15 -8 30 0') + ap('M95 112 L90 136 Q100 142 110 136')],
    ['Draw the mouth on the mouth line. The ears go between the eye line and nose line.', ap('M80 155 q20 10 40 0') + ap('M45 100 q-10 15 4 35') + ap('M155 100 q10 15 -4 35')],
    ['Add hair on top of the head, then erase the guides.', ap('M46 98 C36 18 164 18 154 98 C150 62 125 52 100 56 C75 52 50 62 46 98 Z'), { clear: true }]] },
  { id: 'bodyprop', cat: 'people', level: 3, title: 'Body proportions', ico: '🧍', steps: [
    ['Draw 8 guide lines, evenly spaced. Grown-ups are about 7 to 8 heads tall. Little kids are about 5.', guide([15, 40, 65, 90, 115, 140, 165, 190].map(y => al(60, y, 140, y)).join(''))],
    ['Draw the head in the first space.', ae(100, 27, 11, 13)],
    ['Draw the neck and the chest. Shoulders are about 2 heads wide.', al(100, 40, 100, 48) + ap('M78 50 L122 50 L114 100 L86 100 Z')],
    ['Draw the legs. They start at the middle and take up half the body!', ap('M86 100 L82 145 L86 188 M114 100 L118 145 L114 188 M100 106 L97 188 M100 106 L103 188')],
    ['Draw the arms. Elbows reach the waist and wrists reach the hips.', ap('M78 52 L70 98 L68 125 M122 52 L130 98 L132 125')],
    ['Add hands and feet. A hand is about as big as the face!', ac(67, 131, 6) + ac(133, 131, 6) + ae(84, 192, 9, 4) + ae(116, 192, 9, 4)],
    ['Erase the guides and draw clothes on your person.', '', { clear: true }]] },

  /* ---- Nature ---- */
  { id: 'flower', cat: 'nature', level: 1, title: 'A flower', ico: '🌸', steps: [
    ['Draw a small circle for the middle.', ac(100, 70, 15)],
    ['Draw 6 round petals around it. Count them as you go!', ring(6, 27, (x, y) => ac(x, y - 30, 14))],
    ['Draw a long stem going down.', ap('M100 85 Q95 140 100 190')],
    ['Add two leaves on the stem.', ap('M98 140 q-30 -20 -40 0 q20 15 40 0') + ap('M100 160 q30 -20 40 0 q-20 15 -40 0')],
    ['Draw grass at the bottom.', ap('M50 192 l5 -12 l5 12 l5 -12 l5 12 l5 -12 l5 12 M120 192 l5 -12 l5 12 l5 -12 l5 12 l5 -12 l5 12')]] },
  { id: 'sky', cat: 'nature', level: 1, title: 'Sun, clouds and rain', ico: '⛅', steps: [
    ['Draw a circle for the sun.', ac(55, 55, 25)],
    ['Add 8 rays around the sun.', ring(8, 38, (x, y) => al(55 + (x - 100) * 0.85, 55 + (y - 100) * 0.85, 55 + (x - 100) * 1.15, 55 + (y - 100) * 1.15))],
    ['Draw a fluffy cloud with bumps.', ap('M100 120 a20 20 0 0 1 35 -15 a25 25 0 0 1 45 10 a15 15 0 0 1 0 30 h-80 a15 15 0 0 1 0 -25 z')],
    ['Add rain drops under the cloud and birds like little "m"s.', ap('M115 160 l-3 8 M135 162 l-3 8 M155 160 l-3 8 M125 178 l-3 8 M145 180 l-3 8') + ap('M30 130 q8 -8 16 0 q8 -8 16 0 M60 105 q5 -5 10 0 q5 -5 10 0')]] },
  { id: 'tree', cat: 'nature', level: 2, title: 'A tree with branches', ico: '🌳', steps: [
    ['Draw the trunk, a bit wider at the bottom.', ap('M88 190 L95 112 M112 190 L105 112')],
    ['Split the trunk into branches like the letter Y.', ap('M95 112 L70 72 M105 112 L130 68 M100 110 L100 60')],
    ['Split each branch again into smaller ones. Trees repeat this pattern!', ap('M70 72 L55 55 M70 72 L78 50 M130 68 L145 50 M130 68 L120 48 M100 60 L92 40 M100 60 L110 38')],
    ['Draw a bumpy cloud of leaves around the branches.', ap('M40 75 a20 20 0 0 1 25 -38 a25 25 0 0 1 40 -20 a25 25 0 0 1 45 10 a20 20 0 0 1 20 40 a18 18 0 0 1 -20 28 h-90 a18 18 0 0 1 -20 -20 z')],
    ['Add roots at the bottom and a swing on a branch.', ap('M88 190 q-10 0 -18 6 M112 190 q10 0 18 6') + al(140, 52, 140, 130) + al(160, 62, 160, 130) + ar(136, 130, 28, 5)]] },
  { id: 'landscape', cat: 'nature', level: 2, title: 'A landscape with depth', ico: '🏞️', steps: [
    ['Draw the horizon line, where the land meets the sky.', al(0, 110, 200, 110)],
    ['Background: mountains far away, behind the horizon.', apl('0,110 40,60 75,95 110,50 150,90 200,65')],
    ['Middle ground: rolling hills.', ap('M0 140 Q50 112 100 135 T200 125')],
    ['A path that gets narrow as it goes far away.', ap('M80 200 Q100 165 108 136 M140 200 Q118 165 112 136')],
    ['Foreground: a big tree close to you. Far trees are tiny! Close things are big and low. Far things are small and high.', al(30, 200, 30, 155) + ac(30, 140, 18) + al(150, 132, 150, 125) + ac(150, 121, 5) + al(165, 130, 165, 124) + ac(165, 120, 4)]] },
  { id: 'lake', cat: 'nature', level: 3, title: 'Mountain lake reflection', ico: '🏔️', steps: [
    ['Draw the waterline across the middle.', al(0, 120, 200, 120)],
    ['Draw mountains above it.', apl('10,120 60,40 95,90 130,30 190,120')],
    ['Draw the reflection: the same mountains upside down, with dashed lines because water wiggles.', `<g class="fold">${apl('10,120 60,200 95,150 130,210 190,120')}</g>`],
    ['Add the sun, and its reflection as a squashed oval.', ac(165, 40, 12) + ae(165, 190, 12, 3)],
    ['Add short ripple lines on the water. Make the reflection a little darker than the real mountains.', al(30, 135, 50, 135) + al(120, 145, 145, 145) + al(60, 160, 85, 160) + al(140, 175, 160, 175)]] },
  { id: 'sea', cat: 'nature', level: 2, title: 'Waves and a sailboat', ico: '⛵', steps: [
    ['Draw rolling waves across the page.', ap('M0 125 q25 -30 50 0 t50 0 t50 0 t50 0')],
    ['Add a second row of smaller waves below.', ap('M0 150 q15 -15 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0')],
    ['Draw a boat hull: a trapezoid sitting on the waves.', ap('M70 105 h60 l-10 15 h-40 z')],
    ['Add a mast and two triangle sails.', al(100, 105, 100, 45) + apg('100,48 100,100 138,100') + apg('97,55 97,100 70,100')],
    ['Add seagulls and the sun.', ap('M30 50 q8 -8 16 0 q8 -8 16 0 M150 35 q5 -5 10 0 q5 -5 10 0') + ac(170, 70, 15)]] },

  /* ---- Cartoons ---- */
  { id: 'monster', cat: 'cartoon', level: 1, title: 'A silly monster', ico: '👾', steps: [
    ['Draw a big blob shape. Any blob works!', ap('M60 170 C40 120 50 50 100 50 C150 50 160 120 140 170 Z')],
    ['Give it one giant eye.', ac(100, 90, 22) + ac(100, 92, 9)],
    ['Draw a wide mouth with pointy teeth.', ap('M75 125 q25 25 50 0 z') + apg('85,128 90,136 95,130') + apg('105,130 110,136 115,128')],
    ['Add horns, feet and wiggly arms.', apg('70,62 62,35 82,55') + apg('130,62 138,35 118,55') + ae(75, 172, 15, 6) + ae(125, 172, 15, 6) + ap('M52 120 q-20 -5 -25 -25 M148 120 q20 -5 25 -25')],
    ['Add spots or stripes and give your monster a name!', ac(70, 145, 5) + ac(130, 150, 6) + ac(120, 70, 4)]] },
  { id: 'expressions', cat: 'cartoon', level: 2, title: 'Cartoon expressions', ico: '🤪', steps: [
    ['Draw 4 face circles. Cartoon feelings are big and bold!', ac(55, 55, 35) + ac(145, 55, 35) + ac(55, 145, 35) + ac(145, 145, 35)],
    ['Laughing: eyes shut like upside-down U shapes, mouth wide open.', ap('M38 50 q7 -8 14 0 M58 50 q7 -8 14 0') + ap('M38 62 h34 q-2 22 -17 22 q-15 0 -17 -22')],
    ['In love: heart eyes and a small smile.', ap('M128 48 c0 -8 10 -8 8 0 c-2 -8 8 -8 8 0 l-8 8 z M150 48 c0 -8 10 -8 8 0 c-2 -8 8 -8 8 0 l-8 8 z') + ap('M135 70 q10 8 20 0')],
    ['Scared: tiny pupils, wobbly mouth, sweat drop.', ac(45, 140, 7) + ac(65, 140, 7) + ac(45, 140, 1.5) + ac(65, 140, 1.5) + ap('M40 162 l6 -4 l6 4 l6 -4 l6 4 l6 -4') + ap('M80 120 q-4 8 0 10 q4 -2 0 -10')],
    ['Sleepy: half-closed eyes, a yawn, and "Zzz".', al(128, 142, 142, 142) + al(148, 142, 162, 142) + ap('M128 138 q7 -6 14 0 M148 138 q7 -6 14 0') + ae(145, 162, 6, 8) + atext(175, 115, 'z', 14, 'class="tx"') + atext(185, 103, 'z', 18, 'class="tx"')]] },
  { id: 'bean', cat: 'cartoon', level: 3, title: 'A character in action', ico: '🦸', steps: [
    ['Draw a curvy "line of action". It shows how your character moves.', guide(ap('M85 40 C80 90 95 130 100 180'))],
    ['Draw a bean-shaped body that follows the line.', ap('M80 40 C40 40 50 120 70 160 C85 190 130 185 130 150 C130 120 115 110 120 80 C125 50 110 40 80 40Z')],
    ['Add a face near the top. Put the eyes on the line.', ae(78, 75, 5, 8) + ae(98, 75, 5, 8) + ap('M80 95 q10 10 20 0')],
    ['Add arms in a big pose. One reaching up, one back.', ap('M60 110 q-25 -10 -30 -40') + ap('M125 110 q25 10 35 -10') + ac(30, 66, 7) + ac(162, 98, 7)],
    ['Add legs mid-jump.', ap('M80 175 l-10 18 h-12 M112 178 l10 14 h12')],
    ['Erase the action line. Add motion lines and a cape or costume!', al(15, 120, 35, 120) + al(10, 135, 32, 135) + ap('M120 80 q40 20 55 70 q-30 -10 -50 -20'), { clear: true }]] },

  /* ---- 3D & perspective ---- */
  { id: 'cube', cat: 'perspective', level: 2, title: 'A 3D cube', ico: '🧊', steps: [
    ['Draw a square. This is the front.', ar(50, 80, 80, 80)],
    ['Draw a light guide square, the same size, up and to the right. This is the back.', guide(ar(80, 50, 80, 80))],
    ['Connect each front corner to the matching back corner.', al(50, 80, 80, 50) + al(130, 80, 160, 50) + al(130, 160, 160, 130) + guide(al(50, 160, 80, 130))],
    ['Erase the hidden lines. Darken the outside edges.', al(80, 50, 160, 50) + al(160, 50, 160, 130), { clear: true }],
    ['Shade the side a little darker and the top lighter. Now it pops out!', paint('#9FB3C8', apg('130,80 160,50 160,130 130,160')) + paint('#E3ECF5', apg('50,80 80,50 160,50 130,80'))]] },
  { id: 'cylinder', cat: 'perspective', level: 2, title: 'A cylinder', ico: '🥫', steps: [
    ['Draw a flat oval for the top. A circle seen from the side looks like an oval.', ae(100, 50, 45, 15)],
    ['Draw two straight lines down from the sides.', al(55, 50, 55, 150) + al(145, 50, 145, 150)],
    ['Draw the bottom curve. Only the front half shows.', ap('M55 150 A45 15 0 0 0 145 150') + guide(ap('M55 150 A45 15 0 0 1 145 150'))],
    ['Shade one side with lines that follow the curve.', ap('M125 60 v95 M133 58 v94 M140 55 v93')],
    ['Turn it into a cup, a can or a candle!', ap('M145 75 q30 0 30 30 q0 30 -30 30'), { clear: true }]] },
  { id: 'road', cat: 'perspective', level: 3, title: 'One-point perspective road', ico: '🛣️', steps: [
    ['Draw the horizon line and put a dot on it. That is the vanishing point, where things disappear.', al(0, 80, 200, 80) + ac(100, 80, 3)],
    ['Draw the road edges from the bottom corners to the dot.', al(20, 200, 100, 80) + al(180, 200, 100, 80)],
    ['Draw road stripes. They get shorter and closer as they go far away.', al(100, 200, 100, 178) + al(100, 162, 100, 146) + al(100, 134, 100, 124) + al(100, 115, 100, 109) + al(100, 103, 100, 99)],
    ['Draw guide lines from a pole to the dot. Every pole fits between them.', guide(al(10, 180, 100, 80) + al(10, 100, 100, 80)) + al(10, 180, 10, 100)],
    ['Draw more poles, each one smaller, touching the guides.', al(46, 140, 46, 92) + al(68.5, 115, 68.5, 87) + al(82, 100, 82, 84)],
    ['Erase the guides. Add mountains on the horizon and clouds.', apl('120,80 140,60 160,75 180,55 200,72') + ap('M20 40 a10 10 0 0 1 18 -6 a12 12 0 0 1 22 4 a8 8 0 0 1 0 14 h-38 a7 7 0 0 1 -2 -12z'), { clear: true }]] },
  { id: 'room', cat: 'perspective', level: 3, title: 'A room in perspective', ico: '🛋️', steps: [
    ['Draw a rectangle in the middle. This is the back wall.', ar(65, 60, 70, 60)],
    ['Put a vanishing point dot inside the back wall.', ac(100, 85, 2.5)],
    ['Draw lines from each corner of the back wall out to the corners of the page. Now you have a floor, ceiling and walls!', al(65, 60, 0, 0) + al(135, 60, 200, 0) + al(65, 120, 0, 200) + al(135, 120, 200, 200)],
    ['Draw a door on the left wall. Its top and bottom lines point at the dot.', apg('20,170 20,80 45,81.6 45,143.4')],
    ['Add a window on the back wall and floor lines pointing to the dot.', ar(80, 72, 40, 25) + al(100, 72, 100, 97) + al(50, 200, 84.8, 120) + al(150, 200, 115.2, 120)]] },
  { id: 'letters3d', cat: 'perspective', level: 3, title: '3D block letters', ico: '🔠', steps: [
    ['Draw a flat block letter L.', apg('40,40 70,40 70,130 130,130 130,160 40,160')],
    ['From each corner you can see, draw a short line going up and right. Make them all the same length and direction.', al(40, 40, 60, 25) + al(70, 40, 90, 25) + al(70, 130, 90, 115) + al(130, 130, 150, 115) + al(130, 160, 150, 145)],
    ['Connect the ends to make the back edges.', al(60, 25, 90, 25) + al(90, 25, 90, 115) + al(90, 115, 150, 115) + al(150, 115, 150, 145)],
    ['Shade the side faces darker. Try your initials next!', paint('#9FB3C8', apg('70,40 90,25 90,115 70,130') + apg('130,130 150,115 150,145 130,160')) + paint('#E3ECF5', apg('40,40 60,25 90,25 70,40') + apg('70,130 90,115 150,115 130,130'))]] },

  /* ---- Light & shading ---- */
  { id: 'values', cat: 'shading', level: 2, title: 'Light to dark', ico: '◐', steps: [
    ['Draw 5 boxes in a row.', [0, 1, 2, 3, 4].map(i => ar(10 + i * 37, 80, 33, 33)).join('')],
    ['Leave the first white. Press harder in each box to make it darker. This is called a value scale.', ['#FFFFFF', '#D5DBE5', '#9FAABD', '#5A678C', '#22305A'].map((c, i) => paint(c, ar(10 + i * 37, 80, 33, 33))).join('')],
    ['Practice: can you make 5 steps using only one pencil?', '']] },
  { id: 'sphere', cat: 'shading', level: 2, title: 'Shading a ball', ico: '⚪', steps: [
    ['Draw a circle. Draw a sun in the corner. That is where light comes from.', ac(100, 100, 60) + ac(28, 28, 10) + ring(8, 18, (x, y) => al(28 + (x - 100) * 0.8, 28 + (y - 100) * 0.8, 28 + (x - 100) * 1.1, 28 + (y - 100) * 1.1))],
    ['Mark the highlight: the brightest spot, closest to the light. Leave it white.', guide(ae(78, 78, 12, 8))],
    ['Shade the side away from the light, with lines that curve around the ball.', ap('M66 145 q30 22 70 0 M60 130 q40 32 85 0 M72 155 q25 12 55 0')],
    ['Draw the shadow on the ground, on the side away from the light.', paint('#9FAABD', ae(120, 165, 50, 9))]] },
  { id: 'hatching', cat: 'shading', level: 2, title: 'Hatching and texture', ico: '▦', steps: [
    ['Draw 3 squares.', ar(10, 70, 55, 55) + ar(73, 70, 55, 55) + ar(136, 70, 55, 55)],
    ['Hatching: lines going the same way. Closer lines look darker.', [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => al(14 + i * 6, 74, 14 + i * 6, 121)).join('')],
    ['Cross-hatching: add lines going the other way on top.', [0, 1, 2, 3, 4, 5, 6, 7].map(i => al(77, 76 + i * 6, 124, 76 + i * 6) + al(77 + i * 6, 74, 77 + i * 6, 121)).join('')],
    ['Stippling: lots of dots. More dots look darker.', Array.from({ length: 40 }, (_, i) => ac(140 + (i * 37) % 47, 74 + (i * 23) % 47, 1)).join('')]] },
  { id: 'shadow', cat: 'shading', level: 3, title: 'Cast shadows', ico: '🌓', steps: [
    ['Draw a light in the top right corner and a box on the ground.', ac(175, 25, 10) + ar(40, 100, 50, 50) + al(0, 150, 200, 150)],
    ['Draw guide lines from the light past the corners of the box.', guide(al(175, 25, 0, 172) + al(175, 25, 10, 160))],
    ['The shadow lands on the ground, on the side away from the light. Fill it in.', paint('#9FAABD', apg('40,150 40,100 8,172 30,172'))],
    ['Add a ball and its shadow. A taller light makes a shorter shadow.', ac(140, 128, 22) + paint('#9FAABD', ae(118, 152, 26, 5)), { clear: true }]] },

  /* ---- Color ---- */
  { id: 'wheel', cat: 'color', level: 1, title: 'The color wheel', ico: '🎡', steps: [
    ['The 3 primary colors are red, yellow and blue. You cannot make them by mixing.', wedge(0, 6, '#F2604F') + wedge(2, 6, '#FFC23D') + wedge(4, 6, '#2E8BE6')],
    ['Mix two primaries to get the secondary colors: orange, green and purple.', wedge(1, 6, '#FF8A2B') + wedge(3, 6, '#2FA36B') + wedge(5, 6, '#6D55D1')],
    ['Colors next to each other on the wheel look calm together. Try the Mix colors game!', '']] },
  { id: 'warmcool', cat: 'color', level: 2, title: 'Warm and cool colors', ico: '🔥', steps: [
    ['Warm colors feel like sun and fire: red, orange, yellow.', paint('#F2604F', ac(40, 60, 20)) + paint('#FF8A2B', ac(40, 105, 20)) + paint('#FFC23D', ac(40, 150, 20))],
    ['Cool colors feel like water and night: blue, green, purple.', paint('#2E8BE6', ac(160, 60, 20)) + paint('#2FA36B', ac(160, 105, 20)) + paint('#6D55D1', ac(160, 150, 20))],
    ['Warm colors seem to come closer. Cool colors seem far away. Draw a sunny desert with warm colors, then a night sky with cool colors.', '']] },
  { id: 'tints', cat: 'color', level: 2, title: 'Tints and shades', ico: '🌈', steps: [
    ['Start with one color in the middle.', paint('#2E8BE6', ac(100, 100, 20))],
    ['Add white to make tints: lighter and softer.', paint('#9CCBF5', ac(55, 100, 18)) + paint('#D6EAFC', ac(18, 100, 15))],
    ['Add black to make shades: darker and moodier.', paint('#1D5FA0', ac(145, 100, 18)) + paint('#0F3560', ac(182, 100, 15))],
    ['Paint a picture with only one color and its tints and shades. That is called monochrome.', '']] },
  { id: 'complement', cat: 'color', level: 3, title: 'Complementary colors', ico: '☯️', steps: [
    ['Complementary colors sit opposite on the color wheel.', [0, 1, 2, 3, 4, 5].map(i => wedge(i, 6, ['#F2604F', '#FF8A2B', '#FFC23D', '#2FA36B', '#2E8BE6', '#6D55D1'][i], 70)).join('')],
    ['The pairs are red and green, blue and orange, yellow and purple.', paint('#F2604F', ac(40, 185, 10)) + paint('#2FA36B', ac(62, 185, 10)) + paint('#2E8BE6', ac(90, 185, 10)) + paint('#FF8A2B', ac(112, 185, 10)) + paint('#FFC23D', ac(140, 185, 10)) + paint('#6D55D1', ac(162, 185, 10))],
    ['Put them next to each other to make something pop! Mixed together, they turn brown or grey.', '']] },

  /* ---- Patterns ---- */
  { id: 'stripes', cat: 'pattern', level: 1, title: 'Lines, dots and zig-zags', ico: '〰️', steps: [
    ['Draw a big square and split it into 4 parts.', ar(30, 30, 140, 140) + al(100, 30, 100, 170) + al(30, 100, 170, 100)],
    ['Fill the first part with stripes.', [0, 1, 2, 3, 4, 5].map(i => al(34 + i * 11, 34, 34 + i * 11, 96)).join('')],
    ['Fill the next part with dots in rows.', [0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => ac(112 + c * 16, 42 + r * 16, 3)).join('')).join('')],
    ['Fill the next with zig-zags.', [0, 1, 2, 3].map(r => apl(`34,${112 + r * 15} 42,${104 + r * 15} 50,${112 + r * 15} 58,${104 + r * 15} 66,${112 + r * 15} 74,${104 + r * 15} 82,${112 + r * 15} 90,${104 + r * 15} 96,${110 + r * 15}`)).join('')],
    ['Fill the last with circles inside circles. Now make up your own pattern!', ac(135, 135, 28) + ac(135, 135, 18) + ac(135, 135, 8)]] },
  { id: 'mandala', cat: 'pattern', level: 1, title: 'A mandala', ico: '🏵️', tool: 'mandala', steps: [
    ['A mandala is a circle pattern that repeats all the way around. Start with a small circle in the middle.', ac(100, 100, 10)],
    ['Draw a ring around it.', ac(100, 100, 28)],
    ['Draw 8 petals around the ring. 8 is a nice number for mandalas.', ring(8, 44, (x, y) => ac(x, y, 13))],
    ['Draw a big outer ring and 16 little dots.', ac(100, 100, 72) + ring(16, 64, (x, y) => ac(x, y, 2.5))],
    ['Try Mandala mode in Free Draw: every line you draw copies all the way around!', '']] },
  { id: 'zentangle', cat: 'pattern', level: 2, title: 'Pattern tiles (Zentangle)', ico: '🔲', steps: [
    ['Draw a square tile and a curvy "string" line that splits it into sections.', ar(25, 25, 150, 150) + ap('M25 80 Q90 70 110 25 M110 175 Q100 110 175 90 M60 175 Q70 130 25 120')],
    ['Fill one section with little circles touching each other.', [0, 1, 2, 3].map(i => ac(35 + i * 14, 40, 6) + ac(42 + i * 14, 53, 6)).join('')],
    ['Fill another with stripes that follow the curve.', ap('M120 172 Q115 120 175 102 M135 172 Q130 130 175 117 M150 172 Q148 145 175 135')],
    ['Fill another with a checkerboard.', paint('#22305A', [0, 1, 2].map(r => [0, 1, 2].map(c => (r + c) % 2 ? '' : ar(40 + c * 14, 130 + r * 12, 12, 10)).join('')).join(''))],
    ['Fill the rest with any pattern you like. There are no mistakes in Zentangle!', ap('M80 120 q10 -10 20 0 t20 0 M80 105 q10 -10 20 0 t20 0')]] },
  { id: 'tessellate', cat: 'pattern', level: 3, title: 'Tessellations', ico: '🐝', steps: [
    ['A tessellation is shapes that fit together with no gaps, like tiles on a floor. Hexagons work, just like honeycomb!', apg(Array.from({ length: 6 }, (_, k) => { const t = k * Math.PI / 3; return `${(100 + 30 * Math.cos(t)).toFixed(1)},${(100 + 30 * Math.sin(t)).toFixed(1)}`; }).join(' '))],
    ['Draw hexagons all around the first one, sharing edges.', ring(6, 52, (x, y) => apg(Array.from({ length: 6 }, (_, k) => { const a = k * Math.PI / 3; return `${(x + 30 * Math.cos(a)).toFixed(1)},${(y + 30 * Math.sin(a)).toFixed(1)}`; }).join(' ')))],
    ['Make your own tile: cut a bump out of one side of a square and add it to the opposite side.', ''],
    ['Trace your tile over and over. Turn each one into an animal or a monster!', '']] },

  /* ---- Lettering ---- */
  { id: 'rainbowname', cat: 'letters', level: 1, title: 'Rainbow letters', ico: '🌈', steps: [
    ['Write a letter big and slow. Let us start with A.', atext(100, 150, 'A', 140, 'class="tx"')],
    ['Trace around it again with a different color.', atext(104, 154, 'A', 140, 'class="tx" style="stroke:#FF8A2B"')],
    ['Keep tracing with more colors, a tiny bit lower each time. Now write your name!', atext(108, 158, 'A', 140, 'class="tx" style="stroke:#2FA36B"') + atext(112, 162, 'A', 140, 'class="tx" style="stroke:#2E8BE6"')]] },
  { id: 'bubble', cat: 'letters', level: 2, title: 'Bubble letters', ico: '🫧', steps: [
    ['Write the letter A with thin guide lines.', guide(apl('60,170 100,40 140,170') + al(78, 120, 122, 120))],
    ['Draw a puffy outline all around the guide, with round ends.', ap('M45 172 L92 30 Q100 22 108 30 L155 172 Q140 185 128 170 L120 140 H80 L72 170 Q60 185 45 172 Z')],
    ['Draw the hole in the middle.', apg('86,115 114,115 100,72')],
    ['Erase the guide. Add a shine mark and a shadow. Try the rest of your name!', ap('M95 45 q-5 10 -8 22') + paint('#C9D3E0', ap('M155 172 Q140 185 128 170 L132 182 Q146 192 160 178 Z')), { clear: true }]] },

  /* ---- Crafts (each step is a separate picture) ---- */
  { id: 'plane', cat: 'craft', level: 1, title: 'Paper airplane', ico: '✈️', single: true, steps: [
    ['Take a sheet of paper. Fold it in half the long way, then open it again.', ar(60, 20, 80, 160) + fold(al(100, 20, 100, 180))],
    ['Fold the top two corners in to touch the middle line.', apg('100,20 60,60 60,180 140,180 140,60') + fold(al(100, 20, 100, 180))],
    ['Fold the new slanted edges into the middle line again.', apg('100,20 75,110 75,180 125,180 125,110') + fold(al(100, 20, 100, 180))],
    ['Fold the whole thing in half along the middle line.', apg('30,100 170,70 170,125')],
    ['Fold each side down to make wings.', apg('30,100 170,70 170,125') + fold(al(30, 100, 170, 100))],
    ['Open the wings a little and throw it gently. Which way flies farthest?', apg('100,20 40,170 100,150 160,170') + al(100, 20, 100, 150)]] },
  { id: 'fox', cat: 'craft', level: 2, title: 'Origami fox face', ico: '🦊', single: true, steps: [
    ['Start with a square. Turn it so it looks like a diamond.', apg('100,20 180,100 100,180 20,100')],
    ['Fold the top corner down to the bottom to make a triangle.', apg('20,70 180,70 100,150') + fold(al(20, 70, 180, 70))],
    ['Fold it in half, then open it again to make a middle crease.', apg('20,70 180,70 100,150') + fold(al(100, 70, 100, 150))],
    ['Fold the two side corners up past the top to make ears.', apg('100,150 40,90 55,35 85,72 115,72 145,35 160,90')],
    ['Flip it over and draw eyes and a nose. Hello, fox!', apg('100,160 45,90 55,40 85,75 115,75 145,40 155,90') + ac(80, 100, 5) + ac(120, 100, 5) + apg('94,140 106,140 100,152')]] },
  { id: 'cup', cat: 'craft', level: 2, title: 'Origami cup', ico: '🥤', single: true, steps: [
    ['Fold a square in half from corner to corner to make a triangle. Point it down.', apg('20,60 180,60 100,160')],
    ['Fold the right corner across so it touches the left edge.', apg('20,60 180,60 100,160') + fold(al(60, 110, 140, 100))],
    ['Fold the left corner across to touch the right side.', apg('55,60 145,60 145,105 100,160 55,105') + fold(al(55, 105, 145, 105))],
    ['Fold the top front flap down into the pocket. Turn over and do the same with the back flap.', apg('55,90 145,90 145,105 100,160 55,105') + fold(al(55, 90, 145, 90))],
    ['Open the top and it is a cup! It can even hold a little water for a while.', apg('55,70 145,70 135,160 65,160') + ae(100, 70, 45, 8)]] },
  /* ---- Painting & collage ---- */
  { id: 'wash', cat: 'paint', level: 1, title: 'Watercolor sunset', ico: '🌅', steps: [
    ['Draw a light pencil line across the paper for the ground. Wet the sky part with clean water and a big brush.', al(15, 140, 185, 140)],
    ['Paint a stripe of yellow just above the line. Watery paint spreads by itself: that is called a wash!', paint('#FFD966', ar(15, 110, 170, 30))],
    ['While it is still wet, add orange above the yellow. Let the colors melt into each other.', paint('#FF9F43', ar(15, 75, 170, 38))],
    ['Add pink and then purple at the top. Do not scrub: just touch and let it flow.', paint('#F78FB3', ar(15, 45, 170, 32)) + paint('#8E7CC3', ar(15, 20, 170, 27))],
    ['Wait until it is dry. Then paint dark hills and a tree along the bottom. Dark shapes against a bright sky are called silhouettes.', paint('#22305A', ap('M15 140 Q60 112 100 130 T185 122 V185 H15 Z') + ar(140, 95, 5, 32) + ac(142, 92, 13))]] },
  { id: 'dots', cat: 'paint', level: 1, title: 'Dot painting flower', ico: '🌼', steps: [
    ['Dip the back of a pencil or a cotton bud in paint. Press it straight down to make one perfect dot.', paint('#F2604F', ac(100, 100, 9))],
    ['Make a ring of yellow dots around the middle dot. Keep the gaps the same.', ring(8, 22, (x, y) => paint('#FFC23D', ac(x, y, 7)))],
    ['Make a bigger ring of blue dots around that. Each ring needs more dots!', ring(14, 42, (x, y) => paint('#2E8BE6', ac(x, y, 6)))],
    ['Add an outside ring of tiny green dots. Pictures made of dots are called pointillism.', ring(22, 62, (x, y) => paint('#2FA36B', ac(x, y, 4)))],
    ['Fill the background with white dots, or make up your own colors.', ring(30, 82, (x, y) => paint('#6D55D1', ac(x, y, 3)))]] },
  { id: 'sponge', cat: 'paint', level: 2, title: 'Sponge-print tree', ico: '🌳', steps: [
    ['Paint a brown trunk with a brush. Make it wider at the bottom, with branches at the top.', paint('#8B5E3C', ap('M90 185 L95 110 L75 80 L82 77 L98 102 L100 70 L106 70 L107 100 L122 78 L128 82 L108 112 L113 185 Z'))],
    ['Dip a small sponge in dark green. Dab it around the branches: dab, dab, dab, no wiping!', paint('#1F7A4C', ac(80, 70, 18) + ac(105, 55, 20) + ac(130, 72, 18) + ac(95, 85, 16) + ac(120, 92, 15))],
    ['Now dab light green on the top and one side. That is where the sun shines.', paint('#6CC08B', ac(98, 48, 12) + ac(122, 60, 12) + ac(138, 72, 9) + ac(84, 60, 10))],
    ['Dab a few red dots for apples, and sponge some green grass at the bottom.', paint('#F2604F', ac(90, 72, 4) + ac(118, 80, 4) + ac(106, 62, 4)) + paint('#6CC08B', ar(20, 178, 160, 10, 5))]] },
  { id: 'collage', cat: 'paint', level: 2, title: 'Torn-paper fish', ico: '🐠', steps: [
    ['Tear a big oval from orange paper. Torn edges look soft and fuzzy. Glue it in the middle.', paint('#FF9F43', apg('45,100 60,75 90,62 125,66 150,82 158,100 150,118 125,134 90,138 60,125'))],
    ['Tear a triangle for the tail and glue it at the back, touching the body.', paint('#F2604F', apg('152,100 188,72 182,100 188,128'))],
    ['Tear small yellow pieces and stick them on in rows, like scales. Overlap them a little!', paint('#FFD966', ac(88, 90, 8) + ac(108, 86, 8) + ac(128, 92, 8) + ac(96, 108, 8) + ac(118, 110, 8))],
    ['Cut a white circle and a smaller black circle for the eye. Add blue paper bubbles. You made a collage!', paint('#fff', ac(65, 92, 8)) + paint('#22305A', ac(66, 92, 4)) + paint('#9CCBF5', ac(35, 60, 7) + ac(25, 38, 5) + ac(40, 22, 4))]] },
  { id: 'resist', cat: 'paint', level: 2, title: 'Crayon resist night sky', ico: '🌙', steps: [
    ['Press hard with a white or yellow crayon. Draw a moon and some stars. They are hard to see, and that is OK!', ap('M120 40 A28 28 0 1 0 150 80 A22 22 0 1 1 120 40 Z') + atext(50, 60, '✦', 18) + atext(80, 110, '✦', 14) + atext(160, 140, '✦', 16) + atext(40, 150, '✦', 12)],
    ['Paint over everything with watery dark blue paint.', paint('#22305A', ar(10, 10, 180, 180))],
    ['Like magic, the crayon pushes the paint away! Wax and water do not mix. That is called resist.', paint('#FFD966', ap('M120 40 A28 28 0 1 0 150 80 A22 22 0 1 1 120 40 Z')) + `<g class="pt" style="fill:#FFF3C4">${atext(50, 60, '✦', 18) + atext(80, 110, '✦', 14) + atext(160, 140, '✦', 16) + atext(40, 150, '✦', 12)}</g>`],
    ['Try it again with a secret message in white crayon for a friend to paint over.', '']] },
  { id: 'swirls', cat: 'paint', level: 3, title: 'Swirly starry sky', ico: '🌌', steps: [
    ['Painters like Vincent van Gogh used short, thick brush strokes you can see. First draw a low line of hills and a tall flame-shaped tree.', ap('M10 150 Q60 130 100 145 T190 140') + ap('M40 185 Q30 120 45 70 Q55 120 60 185')],
    ['Paint the sky in curly strokes of blue, following big swirls. Every stroke goes the same way as its neighbour.', paint('#9CCBF5', ap('M10 10 H190 V140 Q145 135 100 145 Q60 130 10 150 Z')) + stroke('#2E5FB8', ap('M70 60 q20 -25 45 -5 q15 15 -5 25 q-15 5 -15 -8') + ap('M20 30 q30 -10 50 5') + ap('M130 100 q25 -20 50 0') + ap('M80 110 q20 -15 40 0') + ap('M15 70 q20 -12 40 0'))],
    ['Add a big glowing moon and stars, each with rings of yellow strokes around it.', paint('#FFD966', ac(160, 40, 14) + ac(30, 90, 6) + ac(110, 30, 5)) + stroke('#FFC23D', ac(160, 40, 22) + ac(30, 90, 12) + ac(110, 30, 10))],
    ['Paint the tree very dark, with strokes that go up like flames. Dark against light makes it stand out.', paint('#22305A', ap('M40 185 Q30 120 45 70 Q55 120 60 185 Z'))],
    ['Add tiny houses with yellow windows on the hills. Leave the brush marks showing: that is the style!', ar(100, 150, 18, 14) + apg('98,150 109,141 120,150') + ar(130, 148, 18, 16) + apg('128,148 139,139 150,148') + paint('#FFC23D', ar(106, 155, 5, 5) + ar(136, 153, 5, 5))]] }
];

const lessonById = id => LESSONS.find(l => l.id === id);
