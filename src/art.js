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

// Tessellation helpers: a flat-topped hexagon, and a square tile with a bump moved from its left side to its right side.
const hexPts = (cx, cy, r = 17) => Array.from({ length: 6 }, (_, k) => { const t = k * Math.PI / 3; return `${(cx + r * Math.cos(t)).toFixed(1)},${(cy + r * Math.sin(t)).toFixed(1)}`; }).join(' ');
const tessTile = (x, y, s = 36) => { const r = s * 0.22, m = s / 2; return `M${x} ${y} H${x + s} V${y + m - r} a${r} ${r} 0 0 1 0 ${2 * r} V${y + s} H${x} V${y + m + r} a${r} ${r} 0 0 0 0 ${-2 * r} Z`; };

const LESSONS = [
  /* ---- Shape pictures ---- */
  { id: 'house', cat: 'shapes', level: 1, title: 'A cozy house', ico: '🏠', need: 'Paper, a pencil and crayons', tip: 'A house is just a square with a triangle hat. You can draw shapes!', steps: [
    ['Draw a big square near the bottom of the page. These are the walls.', ar(50, 90, 100, 90)],
    ['Draw a triangle sitting on top of the square. This is the roof.', apg('40,90 100,35 160,90')],
    ['Draw a tall rectangle in the middle at the bottom. This is the door. Add a dot for the knob.', ar(88, 130, 24, 50) + ac(107, 157, 2)],
    ['Draw a small square window on each side of the door. Draw a cross inside each window.', ar(60, 105, 22, 22) + ar(118, 105, 22, 22) + al(71, 105, 71, 127) + al(60, 116, 82, 116) + al(129, 105, 129, 127) + al(118, 116, 140, 116)],
    ['Draw a little rectangle on the roof for the chimney. Draw curly smoke coming out of the top.', ar(125, 42, 14, 24) + ap('M132 36 q-8 -8 0 -14 q8 -6 0 -14')],
    ['Color it in! Try a red roof and yellow windows.', '']] },
  { id: 'snowman', cat: 'shapes', level: 1, title: 'A snowman', ico: '⛄', need: 'Paper, a pencil and crayons', tip: 'Big, medium, small! Lots of things are made of stacked circles.', steps: [
    ['Draw a big circle at the bottom of the page.', ac(100, 150, 40)],
    ['Draw a smaller circle sitting on top of it.', ac(100, 88, 28)],
    ['Draw the smallest circle on top for the head. Big, medium, small!', ac(100, 45, 20)],
    ['Draw two dot eyes on the head. Add a triangle carrot nose and a smile under it.', ac(93, 40, 2.5) + ac(107, 40, 2.5) + apg('100,47 100,53 118,50') + ap('M92 56 q8 6 16 0')],
    ['Draw 3 dot buttons going down his middle.', ac(100, 78, 3) + ac(100, 92, 3) + ac(100, 140, 3)],
    ['Draw a stick arm out of each side of the middle circle. Give each one little twig fingers.', al(72, 85, 40, 65) + al(128, 85, 160, 65) + al(40, 65, 32, 60) + al(40, 65, 38, 56) + al(160, 65, 168, 60) + al(160, 65, 162, 56)],
    ['Draw a top hat on his head: a flat line, with a tall rectangle on it.', ar(86, 6, 28, 19) + al(78, 25, 122, 25)]] },
  { id: 'rocket', cat: 'shapes', level: 1, title: 'A rocket ship', ico: '🚀', need: 'Paper, a pencil and crayons', tip: 'Count down 3, 2, 1 as you color the flames. Blast off!', steps: [
    ['Draw a tall rectangle in the middle. This is the rocket body.', ar(80, 60, 40, 100, 6)],
    ['Draw a pointy triangle on top of it.', apg('80,60 100,20 120,60')],
    ['Draw a round window near the top. Draw a smaller circle inside it.', ac(100, 85, 10) + ac(100, 85, 6)],
    ['Draw a triangle fin on each side at the bottom.', apg('80,120 58,165 80,160') + apg('120,120 142,165 120,160')],
    ['Draw zig-zag flames coming out of the bottom. Whoosh!', ap('M86 160 L93 190 L100 172 L107 190 L114 160')],
    ['Draw some stars in the sky. Color the flames orange and yellow.', apg(zig(4, 3, 8, 30, 40)) + apg(zig(4, 3, 8, 165, 30)) + apg(zig(4, 2, 6, 160, 110))]] },
  { id: 'robot', cat: 'shapes', level: 2, title: 'A friendly robot', ico: '🤖', need: 'Paper, a pencil, an eraser and crayons', tip: 'Robots are all rectangles and circles. Invent your own buttons and lights!', steps: [
    ['Draw a square near the top for the head. Make the corners a little round.', ar(70, 30, 60, 50, 6)],
    ['Draw a short neck under the head, and a big rectangle under that for the body.', ar(92, 80, 16, 8) + ar(60, 88, 80, 70, 6)],
    ['Draw two circle eyes. Below them draw a thin rectangle mouth with lines for teeth.', ac(87, 52, 7) + ac(113, 52, 7) + ar(85, 66, 30, 6) + al(92, 66, 92, 72) + al(100, 66, 100, 72) + al(108, 66, 108, 72)],
    ['Draw a short line up from the top of the head, with a little ball on the end. That is the antenna.', al(100, 30, 100, 15) + ac(100, 11, 4)],
    ['Draw a long rectangle arm on each side of the body. Add a circle hand at the bottom of each.', ar(42, 92, 16, 50, 6) + ar(142, 92, 16, 50, 6) + ac(50, 148, 6) + ac(150, 148, 6)],
    ['Draw two rectangle legs under the body. Add a flat foot under each leg.', ar(72, 158, 18, 28) + ar(110, 158, 18, 28) + ar(66, 184, 30, 8, 3) + ar(104, 184, 30, 8, 3)],
    ['Draw a box on the chest for the control panel. Fill it with buttons and switches. How many can you fit?', ar(80, 100, 40, 26, 3) + ac(90, 113, 4) + ac(102, 113, 4) + al(110, 108, 116, 108) + al(110, 118, 116, 118)]] },
  { id: 'car', cat: 'shapes', level: 2, title: 'A race car', ico: '🚗', need: 'Paper, a pencil, an eraser and crayons', tip: 'Speed lines behind something make it look fast. Try them on a runner too!', steps: [
    ['Draw a long rectangle across the page for the car body.', ar(25, 100, 150, 40, 8)],
    ['Draw the top part on the body. It has slanted sides, like a hill with a flat top. That shape is called a trapezoid.', ap('M55 100 L75 65 L135 65 L155 100')],
    ['Draw two windows inside the top part, one in front and one behind.', apg('65,98 80,72 103,72 103,98') + apg('110,98 110,72 130,72 146,98')],
    ['Draw two big circle wheels at the bottom. Draw a small circle inside each one.', ac(60, 140, 18) + ac(140, 140, 18) + ac(60, 140, 7) + ac(140, 140, 7)],
    ['Draw a small square light at the front and one at the back.', ar(165, 108, 10, 10, 2) + ar(25, 108, 8, 10, 2)],
    ['Draw a line down the side for the door. Add a short line for the handle.', al(106, 100, 106, 138) + al(112, 112, 122, 112)],
    ['Draw a long line under the wheels for the road. Add speed lines behind the car. Zoom!', al(5, 160, 195, 160) + al(2, 112, 18, 112) + al(4, 124, 16, 124)]] },
  { id: 'castle', cat: 'shapes', level: 3, title: 'A castle', ico: '🏰', need: 'Paper, a pencil, an eraser, a ruler and crayons', tip: 'Both sides of a castle match. Draw one tower, then copy it on the other side.', steps: [
    ['Draw two light guide lines: one across the bottom for the ground, and one down the middle. Both sides of a castle match, so the middle line helps you copy.', guide(al(10, 180, 190, 180) + al(100, 20, 100, 180))],
    ['Draw a wide rectangle wall in the middle, standing on the ground.', ar(50, 90, 100, 90)],
    ['Draw a tall tower on each side of the wall. Make them the same size.', ar(20, 60, 35, 120) + ar(145, 60, 35, 120)],
    ['Draw bumpy tops on the towers and the wall: up, across, down, like teeth. These are called battlements.', ap('M20 60 V48 H27 V55 H34 V48 H41 V55 H48 V48 H55 V60') + ap('M145 60 V48 H152 V55 H159 V48 H166 V55 H173 V48 H180 V60') + ap('M55 90 V80 H65 V86 H75 V80 H85 V86 H95 V80 H105 V86 H115 V80 H125 V86 H135 V80 H145 V90')],
    ['Draw a gate in the middle of the wall with a round top, like an upside-down U. Add bars across it.', ap('M82 180 V140 A18 18 0 0 1 118 140 V180') + al(91, 125, 91, 180) + al(100, 122, 100, 180) + al(109, 125, 109, 180) + al(82, 150, 118, 150) + al(82, 165, 118, 165)],
    ['Draw a small window with a round top on each tower.', ap('M32 92 v-10 a5 5 0 0 1 10 0 v10 z') + ap('M158 92 v-10 a5 5 0 0 1 10 0 v10 z')],
    ['Draw a pole on top of each tower with a triangle flag.', al(37, 48, 37, 25) + apg('37,25 55,30 37,35') + al(162, 48, 162, 25) + apg('162,25 180,30 162,35')],
    ['Erase the guide lines. Draw a few small rectangle stones on the walls.', ar(60, 100, 12, 6) + ar(122, 110, 12, 6) + ar(28, 140, 12, 6) + ar(156, 150, 12, 6), { clear: true }]] },

  /* ---- Animals ---- */
  { id: 'cat', cat: 'animals', level: 1, title: 'A cat', ico: '🐱', need: 'Paper, a pencil and crayons', tip: 'Make the eyes big or small, round or sleepy. Every cat looks different!', steps: [
    ['Draw a big circle near the top for the head.', ac(100, 80, 40)],
    ['Draw a pointy triangle ear on each side of the top of the head.', apg('68,58 72,22 95,42') + apg('132,58 128,22 105,42')],
    ['Draw two oval eyes. Draw a thin oval inside each one.', ae(85, 78, 7, 9) + ae(115, 78, 7, 9) + ae(85, 78, 2, 7) + ae(115, 78, 2, 7)],
    ['Draw a small upside-down triangle nose. Under it, draw a mouth like a "w".', apg('95,92 105,92 100,98') + ap('M100 98 q-6 8 -12 2 M100 98 q6 8 12 2')],
    ['Draw 2 whisker lines on each side of the nose.', al(60, 92, 88, 96) + al(58, 102, 88, 100) + al(140, 92, 112, 96) + al(142, 102, 112, 100)],
    ['Draw an oval body under the head. Add two small oval paws at the bottom.', ae(100, 155, 38, 35) + ae(85, 188, 10, 6) + ae(115, 188, 10, 6)],
    ['Draw a long curly tail coming out of the side of the body.', ap('M136 160 q40 10 30 -30 q-5 -12 -12 -6')]] },
  { id: 'fish', cat: 'animals', level: 1, title: 'A fish', ico: '🐟', need: 'Paper, a pencil and crayons', tip: 'Fish come in every color. Try stripes or rainbow scales!', steps: [
    ['Draw a long oval in the middle, lying on its side. This is the body.', ae(95, 100, 55, 35)],
    ['Draw a triangle tail at the right end of the body.', apg('148,100 185,70 185,130')],
    ['Draw a round eye near the left end, with a dot inside. Add a little smile under it.', ac(65, 92, 8) + ac(67, 92, 3) + ap('M45 110 q8 5 14 0')],
    ['Draw a fin on top of the body and a fin on the bottom.', apg('90,66 110,45 120,70') + apg('95,134 110,152 118,132')],
    ['Draw some curved lines on the body, like little "c" shapes backwards. These are scales.', ap('M85 85 q8 10 0 20 M100 80 q8 12 0 24 M115 82 q8 12 0 22 M100 104 q8 12 0 24')],
    ['Draw circle bubbles floating up from the mouth!', ac(30, 70, 5) + ac(22, 52, 7) + ac(32, 32, 4)]] },
  { id: 'owl', cat: 'animals', level: 1, title: 'An owl', ico: '🦉', need: 'Paper, a pencil and crayons', tip: 'Owls have the biggest eyes. Make yours as big and round as you like!', steps: [
    ['Draw a big tall oval in the middle. This is the owl body.', ae(100, 115, 50, 65)],
    ['Draw a pointy ear on each side of the top. They are really little tufts of feathers.', apg('62,70 58,38 82,58') + apg('138,70 142,38 118,58')],
    ['Draw two big round eyes. Draw a smaller circle inside each one.', ac(80, 85, 18) + ac(120, 85, 18) + ac(80, 85, 7) + ac(120, 85, 7)],
    ['Draw a small triangle beak between the eyes, pointing down.', apg('94,100 106,100 100,114')],
    ['Draw a curved line on each side of the body for the wings.', ap('M52 110 q-10 40 20 65') + ap('M148 110 q10 40 -20 65')],
    ['Draw rows of little bumps on the belly. These are feathers.', ap('M85 135 q5 6 10 0 q5 6 10 0 q5 6 10 0 M80 150 q5 6 10 0 q5 6 10 0 q5 6 10 0 q5 6 10 0')],
    ['Draw a long line under the owl for a branch. Add little lines for toes holding on.', ap('M88 178 v9 M94 178 v9 M106 178 v9 M112 178 v9') + al(30, 188, 170, 188)]] },
  { id: 'dog', cat: 'animals', level: 2, title: 'A puppy', ico: '🐶', need: 'Paper, a pencil, an eraser and crayons', tip: 'Give your puppy a spot over one eye. Now it has its own look!', steps: [
    ['Draw a circle near the top for the head.', ac(100, 75, 35)],
    ['Draw a long floppy ear hanging down on each side of the head.', ap('M72 55 q-30 10 -20 55 q15 0 20 -30') + ap('M128 55 q30 10 20 55 q-15 0 -20 -30')],
    ['Draw a wide oval at the bottom of the face for the snout. Draw a small oval nose at the top of it.', ae(100, 92, 18, 13) + ae(100, 84, 7, 5)],
    ['Draw two dot eyes above the snout. Under the nose, draw a mouth with a little tongue sticking out.', ac(86, 68, 4) + ac(114, 68, 4) + ap('M100 89 v8 q-6 6 -12 0 M100 97 q6 6 12 0') + ap('M96 101 q4 10 8 0')],
    ['Draw an oval body under the head. Draw two front legs at the bottom.', ae(100, 150, 40, 30) + ar(72, 165, 14, 25, 6) + ar(114, 165, 14, 25, 6)],
    ['Draw a curved tail going up from the back. Wag, wag!', ap('M138 145 q22 -10 20 -35')],
    ['Draw a curved collar under the chin, with a round tag.', ap('M75 102 q25 14 50 0') + ac(100, 112, 4)]] },
  { id: 'butterfly', cat: 'animals', level: 2, title: 'A butterfly', ico: '🦋', need: 'Paper, a pencil, an eraser and crayons', tip: 'Whatever you put on one wing, copy on the other. That is called symmetry.', steps: [
    ['Draw a light guide line down the middle of the page. Draw a long thin oval on it for the body.', guide(al(100, 20, 100, 190)) + ae(100, 105, 6, 45)],
    ['Draw a small circle on top for the head. Add two curly antennae with a dot on each end.', ac(100, 55, 8) + ap('M97 48 q-10 -20 -20 -25 M103 48 q10 -20 20 -25') + ac(77, 23, 3) + ac(123, 23, 3)],
    ['Draw a big wing on each side at the top. Make the right wing look like the left one in a mirror.', ap('M96 80 C60 30 20 60 40 105 C55 120 85 110 96 100') + ap('M104 80 C140 30 180 60 160 105 C145 120 115 110 104 100')],
    ['Draw a smaller wing on each side at the bottom. Make them match too.', ap('M96 110 C60 110 45 150 70 165 C88 175 96 150 96 130') + ap('M104 110 C140 110 155 150 130 165 C112 175 104 150 104 130')],
    ['Draw circle spots on the wings. Each spot on one side gets a twin on the other side.', ac(60, 80, 10) + ac(140, 80, 10) + ac(75, 145, 7) + ac(125, 145, 7) + ac(48, 98, 4) + ac(152, 98, 4)],
    ['Erase the middle line. Color both sides the same. That is symmetry!', '', { clear: true }]] },
  { id: 'turtle', cat: 'animals', level: 2, title: 'A turtle', ico: '🐢', need: 'Paper, a pencil, an eraser and crayons', tip: 'Color each shell plate a different green. It looks like a real shell!', steps: [
    ['Draw half a circle, like a hill, with a flat line on the bottom. This is the shell.', ap('M40 130 A60 60 0 0 1 160 130 Z')],
    ['Draw a shape with 6 sides in the middle of the shell. A 6-sided shape is called a hexagon.', apg('85,90 115,90 125,110 115,128 85,128 75,110')],
    ['Draw lines from the corners of the hexagon out to the edge of the shell. Now the shell has plates.', al(85, 90, 70, 78) + al(115, 90, 130, 78) + al(75, 110, 42, 115) + al(125, 110, 158, 115)],
    ['Draw a round head poking out on the right. Give it a dot eye and a smile.', ap('M158 120 q30 -15 32 5 q0 15 -30 12') + ac(176, 114, 2.5) + ap('M174 124 q5 3 10 -1')],
    ['Draw two short oval legs under the shell.', ae(65, 138, 12, 8) + ae(135, 138, 12, 8)],
    ['Draw a little pointy tail on the left. Draw a line under the turtle for the ground.', apg('40,128 26,134 40,134') + al(10, 148, 190, 148)]] },
  { id: 'elephant', cat: 'animals', level: 3, title: 'An elephant', ico: '🐘', need: 'Paper, a pencil, an eraser and crayons', tip: 'Light guide shapes first, dark lines last. That is how real artists start!', steps: [
    ['Start with light guide shapes: a circle on the left for the head, and a big oval on the right for the body. Artists sketch simple shapes first.', guide(ac(85, 85, 40) + ae(125, 135, 55, 40))],
    ['Draw the top of the head over the guide circle, with a darker line.', ap('M60 115 C40 90 50 45 85 45 C115 45 125 70 120 95')],
    ['Draw a long trunk curving down from the face. Use two lines side by side that stay the same distance apart. Close the end.', ap('M60 115 C55 140 60 165 50 175 M76 118 C72 140 76 162 66 178') + al(50, 175, 66, 178)],
    ['Draw a big floppy ear on the side of the head.', ap('M95 60 C140 40 160 90 130 115 C115 125 100 110 100 100')],
    ['Follow the guide oval to draw the back and the body. Then draw thick legs down to the ground.', ap('M120 95 C160 85 182 110 178 140 L178 178 H158 V158 H112 V178 H92 V145')],
    ['Add a dot eye, a curved tusk under the eye, and a short tail at the back.', ac(78, 80, 3) + ap('M70 120 q8 18 22 14') + ap('M178 120 q12 10 8 25')],
    ['Erase the guide shapes. Draw short wrinkle lines across the trunk.', ap('M57 132 h9 M59 146 h9 M58 160 h9'), { clear: true }]] },
  { id: 'lion', cat: 'animals', level: 3, title: 'A lion', ico: '🦁', need: 'Paper, a pencil and crayons in yellow, orange and brown', tip: 'Use two or three colors in the mane. It will look thick and fluffy.', steps: [
    ['Draw a circle in the middle for the face.', ac(100, 95, 35)],
    ['Draw a spiky mane all the way around the face, like the rays of a sun.', apg(zig(14, 46, 62, 100, 95))],
    ['Draw a small round ear on each side of the top of the face.', ac(75, 66, 8) + ac(125, 66, 8)],
    ['Draw two oval eyes. Under them draw a triangle nose, and a mouth that curves down from the nose on both sides.', ae(87, 88, 4, 5) + ae(113, 88, 4, 5) + apg('92,102 108,102 100,112') + ap('M100 112 v6 q-8 8 -14 2 M100 118 q8 8 14 2')],
    ['Add a few tiny dots beside the mouth where the whiskers grow. Draw a curved line under the mouth for the chin.', ac(88, 114, 1.5) + ac(84, 110, 1.5) + ac(112, 114, 1.5) + ac(116, 110, 1.5) + ap('M92 126 q8 6 16 0')],
    ['Draw short lines in the mane, pointing out from the face, so it looks fluffy. Color it darker close to the face.', ring(12, 50, (x, y) => al((x - 100) * 0.95 + 100, (y - 100) * 0.95 + 95, (x - 100) * 1.1 + 100, (y - 100) * 1.1 + 95))]] },

  /* ---- Faces & people ---- */
  { id: 'smile', cat: 'people', level: 1, title: 'A happy face', ico: '😊', need: 'Paper, a pencil and crayons', tip: 'Draw a face for each person in your family. Who has curly hair?', steps: [
    ['Draw a big circle in the middle of the page.', ac(100, 100, 70)],
    ['Draw two dot eyes, a little above the middle of the circle.', ac(75, 85, 7) + ac(125, 85, 7)],
    ['Draw a big smile under the eyes, like the letter "U".', ap('M65 120 q35 35 70 0')],
    ['Draw a round pink cheek on each side of the smile.', ac(58, 112, 8) + ac(142, 112, 8)],
    ['Draw some bumpy hair on top of the head.', ap('M70 40 q10 -15 20 0 q10 -15 20 0 q10 -15 20 0')]] },
  { id: 'feelings', cat: 'people', level: 1, title: 'Four feelings', ico: '🎭', need: 'Paper, a pencil and crayons', tip: 'Make the face in a mirror first, then draw what you see!', steps: [
    ['Draw 4 circles: two at the top and two at the bottom. Each one will show a different feeling.', ac(55, 55, 35) + ac(145, 55, 35) + ac(55, 145, 35) + ac(145, 145, 35)],
    ['Top left is happy. Draw two dot eyes and a smile that curves up.', ac(45, 48, 3) + ac(65, 48, 3) + ap('M40 65 q15 15 30 0')],
    ['Top right is sad. Draw two dot eyes, a mouth that curves down, and a tear.', ac(135, 48, 3) + ac(155, 48, 3) + ap('M130 75 q15 -12 30 0') + ap('M157 56 q-3 6 0 8 q3 -2 0 -8')],
    ['Bottom left is surprised. Draw big eyes, eyebrows up high, and a mouth like an "O".', ac(45, 140, 5) + ac(65, 140, 5) + ap('M38 128 q7 -6 14 0 M58 128 q7 -6 14 0') + ac(55, 162, 7)],
    ['Bottom right is angry. Draw eyebrows that slant down to the middle, two dot eyes, and a zig-zag mouth.', al(128, 132, 141, 138) + al(162, 132, 149, 138) + ac(136, 143, 3) + ac(154, 143, 3) + ap('M133 162 l6 -4 l6 4 l6 -4 l6 4')],
    ['Now try sleepy, silly or scared. Eyebrows and mouths tell the feeling!', '']] },
  { id: 'stick', cat: 'people', level: 1, title: 'Stick people in action', ico: '🏃', need: 'Paper, a pencil and crayons', tip: 'Bent arms and legs make people move. Straight ones make them stand still.', steps: [
    ['Draw a small circle near the top for the head.', ac(100, 40, 15)],
    ['Draw a straight line down from the head for the body.', al(100, 55, 100, 115)],
    ['Draw two arms from the top of the body. Bend each one in the middle, like an elbow. One waves up, one swings down.', ap('M100 70 L80 90 L70 110') + ap('M100 70 L120 60 L135 40')],
    ['Draw two legs from the bottom of the body. Bend them at the knees, like running.', ap('M100 115 L82 140 L70 165') + ap('M100 115 L120 138 L140 150')],
    ['Draw a ball by the foot to kick. Add short lines behind the person to show they are moving fast!', ac(160, 165, 10) + al(30, 70, 50, 70) + al(25, 90, 45, 90)]] },
  { id: 'faceprop', cat: 'people', level: 2, title: 'Drawing a real face', ico: '🧑', need: 'Paper, a pencil, an eraser, crayons and a mirror if you have one', tip: 'Look in a mirror: are your eyes really halfway down your head?', steps: [
    ['Draw a big egg shape, wider at the top. This is the head.', ae(100, 105, 55, 72)],
    ['Draw a light guide line across the middle of the egg. Surprise: the eyes go right on this line, halfway down the head!', guide(al(45, 105, 155, 105))],
    ['Draw three more light guide lines: one straight down the middle, one across for the bottom of the nose, and one lower for the mouth.', guide(al(100, 33, 100, 177) + al(60, 138, 140, 138) + al(65, 155, 135, 155))],
    ['Draw two eyes on the eye line, shaped like lemons lying down. Leave a gap between them as wide as one eye. Add a dot in each.', ap('M62 105 q13 -10 26 0 q-13 8 -26 0') + ap('M112 105 q13 -10 26 0 q-13 8 -26 0') + ac(75, 104, 4) + ac(125, 104, 4)],
    ['Draw a curved eyebrow above each eye. Then draw the nose, ending on the nose line.', ap('M60 92 q15 -8 30 0') + ap('M110 92 q15 -8 30 0') + ap('M95 112 L90 136 Q100 142 110 136')],
    ['Draw the mouth on the mouth line.', ap('M80 155 q20 10 40 0')],
    ['Draw an ear on each side of the head. The top of the ear is at the eye line, and the bottom is at the nose line.', ap('M45 100 q-10 15 4 35') + ap('M155 100 q10 15 -4 35')],
    ['Draw hair on top of the head. Then erase the guide lines.', ap('M46 98 C36 18 164 18 154 98 C150 62 125 52 100 56 C75 52 50 62 46 98 Z'), { clear: true }]] },
  { id: 'bodyprop', cat: 'people', level: 3, title: 'Body proportions', ico: '🧍', need: 'Paper, a pencil, a ruler, an eraser and crayons', tip: 'Measure with heads! Count how many heads tall a grown-up is in a photo.', steps: [
    ['Draw 8 light guide lines across the page, the same space apart. Each space is one head tall. Grown-ups are about 7 to 8 heads tall. Little kids are about 5.', guide([15, 40, 65, 90, 115, 140, 165, 190].map(y => al(60, y, 140, y)).join(''))],
    ['Draw an oval head in the top space.', ae(100, 27, 11, 13)],
    ['Draw a short neck under the head. Draw the chest below it. The shoulders are about 2 heads wide.', al(100, 40, 100, 48) + ap('M78 50 L122 50 L114 100 L86 100 Z')],
    ['Draw the legs. They start at the middle line and take up half of the whole body!', ap('M86 100 L82 145 L86 188 M114 100 L118 145 L114 188 M100 106 L97 188 M100 106 L103 188')],
    ['Draw the arms down from the shoulders. The elbows reach the waist, and the wrists reach the hips.', ap('M78 52 L70 98 L68 125 M122 52 L130 98 L132 125')],
    ['Draw round hands and oval feet. A hand is about as big as the face!', ac(67, 131, 6) + ac(133, 131, 6) + ae(84, 192, 9, 4) + ae(116, 192, 9, 4)],
    ['Erase the guide lines. Draw clothes on your person.', '', { clear: true }]] },

  /* ---- Nature ---- */
  { id: 'flower', cat: 'nature', level: 1, title: 'A flower', ico: '🌸', need: 'Paper, a pencil and crayons', tip: 'Draw a whole garden! Give each flower a different color.', steps: [
    ['Draw a small circle near the top. This is the middle of the flower.', ac(100, 70, 15)],
    ['Draw 6 round petals all around the middle. Count them as you go!', ring(6, 27, (x, y) => ac(x, y - 30, 14))],
    ['Draw a long stem going down from the flower to the bottom.', ap('M100 85 Q95 140 100 190')],
    ['Draw a leaf on each side of the stem.', ap('M98 140 q-30 -20 -40 0 q20 15 40 0') + ap('M100 160 q30 -20 40 0 q-20 15 -40 0')],
    ['Draw zig-zag grass at the bottom.', ap('M50 192 l5 -12 l5 12 l5 -12 l5 12 l5 -12 l5 12 M120 192 l5 -12 l5 12 l5 -12 l5 12 l5 -12 l5 12')]] },
  { id: 'sky', cat: 'nature', level: 1, title: 'Sun, clouds and rain', ico: '⛅', need: 'Paper, a pencil and crayons', tip: 'Look out of the window. What is the sky doing today? Draw that!', steps: [
    ['Draw a circle in the top left corner for the sun.', ac(55, 55, 25)],
    ['Draw 8 short lines around the sun. These are its rays.', ring(8, 38, (x, y) => al(55 + (x - 100) * 0.85, 55 + (y - 100) * 0.85, 55 + (x - 100) * 1.15, 55 + (y - 100) * 1.15))],
    ['Draw a fluffy cloud on the right. Make the top bumpy and the bottom flat.', ap('M100 120 a20 20 0 0 1 35 -15 a25 25 0 0 1 45 10 a15 15 0 0 1 0 30 h-80 a15 15 0 0 1 0 -25 z')],
    ['Draw short slanted lines under the cloud. These are raindrops falling.', ap('M115 160 l-3 8 M135 162 l-3 8 M155 160 l-3 8 M125 178 l-3 8 M145 180 l-3 8')],
    ['Draw birds flying in the sky, like little letter "m"s.', ap('M30 130 q8 -8 16 0 q8 -8 16 0 M60 105 q5 -5 10 0 q5 -5 10 0')]] },
  { id: 'tree', cat: 'nature', level: 2, title: 'A tree with branches', ico: '🌳', need: 'Paper, a pencil, an eraser and crayons', tip: 'Go outside and look at a real tree. See how the branches split?', steps: [
    ['Draw two lines for the trunk. Make them a bit wider apart at the bottom.', ap('M88 190 L95 112 M112 190 L105 112')],
    ['At the top of the trunk, draw three branches going up and out, like the letter Y with a line in the middle.', ap('M95 112 L70 72 M105 112 L130 68 M100 110 L100 60')],
    ['At the end of each branch, draw two smaller branches. Trees repeat this pattern again and again!', ap('M70 72 L55 55 M70 72 L78 50 M130 68 L145 50 M130 68 L120 48 M100 60 L92 40 M100 60 L110 38')],
    ['Draw a big bumpy cloud shape around the branches. These are the leaves.', ap('M40 75 a20 20 0 0 1 25 -38 a25 25 0 0 1 40 -20 a25 25 0 0 1 45 10 a20 20 0 0 1 20 40 a18 18 0 0 1 -20 28 h-90 a18 18 0 0 1 -20 -20 z')],
    ['Draw curvy roots spreading out at the bottom of the trunk.', ap('M88 190 q-10 0 -18 6 M112 190 q10 0 18 6')],
    ['Draw two ropes hanging from a branch, with a flat seat at the bottom. Now the tree has a swing!', al(140, 52, 140, 130) + al(160, 62, 160, 130) + ar(136, 130, 28, 5)]] },
  { id: 'landscape', cat: 'nature', level: 2, title: 'A landscape with depth', ico: '🏞️', need: 'Paper, a pencil, an eraser and crayons', tip: 'Big and low means close. Small and high means far away.', steps: [
    ['Draw a straight line across the page, a bit above the middle. This is the horizon, where the land meets the sky.', al(0, 110, 200, 110)],
    ['Draw pointy mountains on the line. They are far, far away, at the back of the picture.', apl('0,110 40,60 75,95 110,50 150,90 200,65')],
    ['Below the line, draw a wavy line for rolling hills. These are closer, in the middle of the picture.', ap('M0 140 Q50 112 100 135 T200 125')],
    ['Draw a path coming toward you. Make it wide at the bottom and thin where it goes far away.', ap('M70 200 Q98 160 104 128 M150 200 Q116 160 112 128')],
    ['Draw a big tree at the bottom left. It is close to you, so it is big. Draw two tiny trees far away on the hill. Far things are small and high up!', ap('M26 200 V162 M42 200 V162') + ap('M20 164 a15 15 0 0 1 -2 -28 a18 18 0 0 1 32 -8 a15 15 0 0 1 4 36 Z') + apg('140,141 146,127 152,141') + apg('160,133 165,121 170,133') + apg('176,128 180,118 184,128')]] },
  { id: 'lake', cat: 'nature', level: 3, title: 'Mountain lake reflection', ico: '🏔️', need: 'Paper, a pencil, an eraser and crayons in blue, grey and yellow', tip: 'A reflection is like the picture flipped over. Try it with a tree too!', steps: [
    ['Draw a line across the middle of the page. This is the edge of the water.', al(0, 110, 200, 110)],
    ['Draw pointy mountains standing on the line. Add a zig-zag of snow near each top.', apl('10,110 60,52 95,86 130,40 190,110') + apl('48,66 60,74 72,66') + apl('116,56 130,64 144,56')],
    ['Under the line, draw the same mountains upside down. This is the reflection, like a mirror. Use dashed lines, because water wiggles.', `<g class="fold">${apl('10,110 60,168 95,134 130,180 190,110')}</g>`],
    ['Draw a sun in the sky. In the water below it, draw a flat squashed oval for its reflection.', ac(170, 30, 11) + ae(170, 190, 11, 3)],
    ['Draw short flat lines on the water for ripples. Color the reflection a little darker than the real mountains.', al(20, 125, 40, 125) + al(150, 130, 175, 130) + al(70, 186, 95, 186) + al(20, 160, 38, 160) + al(160, 160, 185, 160)]] },
  { id: 'sea', cat: 'nature', level: 2, title: 'Waves and a sailboat', ico: '⛵', need: 'Paper, a pencil and crayons in blue, white and yellow', tip: 'Wavy water is a row of little hills. Big waves at the front, small at the back.', steps: [
    ['Draw a row of rolling waves across the page, like big round hills.', ap('M0 125 q25 -30 50 0 t50 0 t50 0 t50 0')],
    ['Draw a second row of smaller waves below the first.', ap('M0 150 q15 -15 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0')],
    ['Draw the boat sitting on the waves: a shape wide at the top and narrow at the bottom.', ap('M70 105 h60 l-10 15 h-40 z')],
    ['Draw a tall line up from the boat for the mast. Draw a triangle sail on each side of it.', al(100, 105, 100, 45) + apg('100,48 100,100 138,100') + apg('97,55 97,100 70,100')],
    ['Draw a sun on the right. Draw seagulls in the sky, like little letter "m"s.', ap('M30 50 q8 -8 16 0 q8 -8 16 0 M150 35 q5 -5 10 0 q5 -5 10 0') + ac(170, 70, 15)]] },

  /* ---- Cartoons ---- */
  { id: 'monster', cat: 'cartoon', level: 1, title: 'A silly monster', ico: '👾', need: 'Paper, a pencil and crayons', tip: 'There are no wrong monsters! Try two eyes, or ten.', steps: [
    ['Draw a big blob shape, round at the top and flat at the bottom. Any blob works!', ap('M60 170 C40 120 50 50 100 50 C150 50 160 120 140 170 Z')],
    ['Draw one giant eye in the middle. Draw a smaller circle inside it.', ac(100, 90, 22) + ac(100, 92, 9)],
    ['Draw a wide smiling mouth under the eye. Add pointy triangle teeth.', ap('M75 125 q25 25 50 0 z') + apg('85,128 90,136 95,130') + apg('105,130 110,136 115,128')],
    ['Draw a pointy horn on each side of the top of the head.', apg('70,62 62,35 82,55') + apg('130,62 138,35 118,55')],
    ['Draw two oval feet at the bottom. Draw a wiggly arm on each side.', ae(75, 172, 15, 6) + ae(125, 172, 15, 6) + ap('M52 120 q-20 -5 -25 -25 M148 120 q20 -5 25 -25')],
    ['Draw spots or stripes all over. Give your monster a name!', ac(70, 145, 5) + ac(130, 150, 6) + ac(120, 70, 4)]] },
  { id: 'expressions', cat: 'cartoon', level: 2, title: 'Cartoon expressions', ico: '🤪', need: 'Paper, a pencil and crayons', tip: 'Make each feeling extra big. Cartoons love to show off!', steps: [
    ['Draw 4 face circles: two at the top and two at the bottom. Cartoon feelings are big and bold!', ac(55, 55, 35) + ac(145, 55, 35) + ac(55, 145, 35) + ac(145, 145, 35)],
    ['Top left is laughing. Draw closed eyes like little hills. Draw a big open mouth, flat on top and round on the bottom.', ap('M38 50 q7 -8 14 0 M58 50 q7 -8 14 0') + ap('M38 62 h34 q-2 22 -17 22 q-15 0 -17 -22')],
    ['Top right is in love. Draw two heart eyes and a small smile.', ap('M128 48 c0 -8 10 -8 8 0 c-2 -8 8 -8 8 0 l-8 8 z M150 48 c0 -8 10 -8 8 0 c-2 -8 8 -8 8 0 l-8 8 z') + ap('M135 70 q10 8 20 0')],
    ['Bottom left is scared. Draw big eyes with tiny dots inside, a wobbly zig-zag mouth, and a drop of sweat.', ac(45, 140, 7) + ac(65, 140, 7) + ac(45, 140, 1.5) + ac(65, 140, 1.5) + ap('M40 162 l6 -4 l6 4 l6 -4 l6 4 l6 -4') + ap('M80 120 q-4 8 0 10 q4 -2 0 -10')],
    ['Bottom right is sleepy. Draw eyes half closed, a small yawning mouth, and "z z" floating up.', al(128, 142, 142, 142) + al(148, 142, 162, 142) + ap('M128 138 q7 -6 14 0 M148 138 q7 -6 14 0') + ae(145, 162, 6, 8) + atext(175, 115, 'z', 14, 'class="tx"') + atext(185, 103, 'z', 18, 'class="tx"')]] },
  { id: 'bean', cat: 'cartoon', level: 3, title: 'A character in action', ico: '🦸', need: 'Paper, a pencil, an eraser and crayons', tip: 'A curvy action line makes a character look alive. A straight one looks stiff.', steps: [
    ['Draw a light curvy line from top to bottom. This is the "line of action". It shows how your character moves.', guide(ap('M85 40 C80 90 95 130 100 180'))],
    ['Draw a body shaped like a bean around the line. Let it bend the same way the line bends.', ap('M80 40 C40 40 50 120 70 160 C85 190 130 185 130 150 C130 120 115 110 120 80 C125 50 110 40 80 40Z')],
    ['Draw a face near the top: two oval eyes on either side of the line, and a smile under them.', ae(78, 75, 5, 8) + ae(98, 75, 5, 8) + ap('M80 95 q10 10 20 0')],
    ['Draw two arms in a big pose: one reaching up high, one stretching back. Add round hands.', ap('M60 110 q-25 -10 -30 -40') + ap('M125 110 q25 10 35 -10') + ac(30, 66, 7) + ac(162, 98, 7)],
    ['Draw two short legs at the bottom, bent like they are jumping.', ap('M80 175 l-10 18 h-12 M112 178 l10 14 h12')],
    ['Erase the action line. Draw a flowing cape and some lines behind to show movement. Now it is a hero!', al(15, 120, 35, 120) + al(10, 135, 32, 135) + ap('M120 80 q40 20 55 70 q-30 -10 -50 -20'), { clear: true }]] },

  /* ---- 3D & perspective ---- */
  { id: 'cube', cat: 'perspective', level: 2, title: 'A 3D cube', ico: '🧊', need: 'Paper, a pencil, a ruler, an eraser and crayons', tip: 'Turn your cube into a present, a dice or a box. Add a bow or dots!', steps: [
    ['Draw a square. This is the front of the box.', ar(50, 80, 80, 80)],
    ['Draw a light guide square, the same size, a little up and to the right. This is the back of the box.', guide(ar(80, 50, 80, 80))],
    ['Draw a line from each corner of the front square to the same corner of the back square.', al(50, 80, 80, 50) + al(130, 80, 160, 50) + al(130, 160, 160, 130) + guide(al(50, 160, 80, 130))],
    ['Erase the lines you could not see on a real box. Go over the top and right outside edges to make them dark.', al(80, 50, 160, 50) + al(160, 50, 160, 130), { clear: true }],
    ['Color the right side a bit darker and the top a bit lighter. Now it pops out!', paint('#9FB3C8', apg('130,80 160,50 160,130 130,160')) + paint('#E3ECF5', apg('50,80 80,50 160,50 130,80'))]] },
  { id: 'cylinder', cat: 'perspective', level: 2, title: 'A cylinder', ico: '🥫', need: 'Paper, a pencil, an eraser and crayons', tip: 'Look at a cup from the side. The round top looks like a flat oval!', steps: [
    ['Draw a flat oval at the top. A circle seen from the side looks like this.', ae(100, 50, 45, 15)],
    ['Draw a straight line down from each side of the oval.', al(55, 50, 55, 150) + al(145, 50, 145, 150)],
    ['Join the bottoms with a curve that bends down, like a smile. Only the front half of the bottom shows.', ap('M55 150 A45 15 0 0 0 145 150') + guide(ap('M55 150 A45 15 0 0 1 145 150'))],
    ['Draw a few lines down the right side to make it look shadowed.', ap('M125 60 v95 M133 58 v94 M140 55 v93')],
    ['Draw a handle on the side. Now it is a cup! You could make a can or a candle instead.', ap('M145 75 q30 0 30 30 q0 30 -30 30'), { clear: true }]] },
  { id: 'road', cat: 'perspective', level: 3, title: 'One-point perspective road', ico: '🛣️', need: 'Paper, a pencil, a ruler, an eraser and crayons', tip: 'Every line going away from you points to the same dot. Use your ruler!', steps: [
    ['Draw a line across the page for the horizon. Put a dot in the middle. This is the vanishing point, where far things disappear.', al(0, 80, 200, 80) + ac(100, 80, 3)],
    ['With a ruler, draw a line from each bottom corner of the page to the dot. These are the edges of the road.', al(20, 200, 100, 80) + al(180, 200, 100, 80)],
    ['Draw stripes down the middle of the road. Make them shorter and closer together as they get near the dot.', al(100, 200, 100, 178) + al(100, 162, 100, 146) + al(100, 134, 100, 124) + al(100, 115, 100, 109) + al(100, 103, 100, 99)],
    ['Draw a tall pole at the left. Then draw two light guide lines from its top and bottom to the dot.', guide(al(10, 180, 100, 80) + al(10, 100, 100, 80)) + al(10, 180, 10, 100)],
    ['Draw more poles between the two guide lines. Each one gets smaller as it gets closer to the dot.', al(46, 140, 46, 92) + al(68.5, 115, 68.5, 87) + al(82, 100, 82, 84)],
    ['Erase the guide lines. Draw mountains on the horizon and a cloud in the sky.', apl('120,80 140,60 160,75 180,55 200,72') + ap('M20 40 a10 10 0 0 1 18 -6 a12 12 0 0 1 22 4 a8 8 0 0 1 0 14 h-38 a7 7 0 0 1 -2 -12z'), { clear: true }]] },
  { id: 'room', cat: 'perspective', level: 3, title: 'A room in perspective', ico: '🛋️', need: 'Paper, a pencil, a ruler, an eraser and crayons', tip: 'Draw your own bedroom this way. Add a bed and a rug with lines to the dot!', steps: [
    ['Draw a rectangle in the middle of the page. This is the back wall of the room.', ar(65, 60, 70, 60)],
    ['Put a small dot inside the back wall. This is the vanishing point: lines going away from you all point to it.', ac(100, 85, 2.5)],
    ['With a ruler, draw a line from each corner of the back wall out to the matching corner of the page. Now you have a floor, a ceiling and two side walls!', al(65, 60, 0, 0) + al(135, 60, 200, 0) + al(65, 120, 0, 200) + al(135, 120, 200, 200)],
    ['Draw a door on the left wall. Its sides go straight up and down. Its top and bottom lines tilt toward the dot.', apg('20,170 20,80 45,81.6 45,143.4')],
    ['Draw a window on the back wall. Then draw two lines on the floor that point toward the dot, like floorboards.', ar(80, 72, 40, 25) + al(100, 72, 100, 97) + al(50, 200, 84.8, 120) + al(150, 200, 115.2, 120)]] },
  { id: 'letters3d', cat: 'perspective', level: 3, title: '3D block letters', ico: '🔠', need: 'Paper, a pencil, a ruler, an eraser and crayons', tip: 'All the slanted lines go the same way and the same length. Then it looks solid!', steps: [
    ['Draw a big, fat letter L made of straight lines, like a block.', apg('40,40 70,40 70,130 130,130 130,160 40,160')],
    ['From the corners on the top and right, draw a short line going up and to the right. Make them all the same length and pointing the same way.', al(40, 40, 60, 25) + al(70, 40, 90, 25) + al(70, 130, 90, 115) + al(130, 130, 150, 115) + al(130, 160, 150, 145)],
    ['Join the ends of those short lines. These are the back edges of the letter.', al(60, 25, 90, 25) + al(90, 25, 90, 115) + al(90, 115, 150, 115) + al(150, 115, 150, 145)],
    ['Color the right sides darker and the tops lighter. Now try the first letter of your name!', paint('#9FB3C8', apg('70,40 90,25 90,115 70,130') + apg('130,130 150,115 150,145 130,160')) + paint('#E3ECF5', apg('40,40 60,25 90,25 70,40') + apg('70,130 90,115 150,115 130,130'))]] },

  /* ---- Light & shading ---- */
  { id: 'values', cat: 'shading', level: 2, title: 'Light to dark', ico: '◐', need: 'Paper and a soft pencil', tip: 'Press softly for light and harder for dark. Your pencil can make many greys!', steps: [
    ['Draw 5 boxes in a row.', [0, 1, 2, 3, 4].map(i => ar(10 + i * 37, 80, 33, 33)).join('')],
    ['Leave the first box white. Color the next box very lightly. Press a little harder in each box after that, so the last one is the darkest. This is called a value scale.', ['#FFFFFF', '#D5DBE5', '#9FAABD', '#5A678C', '#22305A'].map((c, i) => paint(c, ar(10 + i * 37, 80, 33, 33))).join('')],
    ['Practice: can you make 5 steps from light to dark using only one pencil?', '']] },
  { id: 'sphere', cat: 'shading', level: 2, title: 'Shading a ball', ico: '⚪', need: 'Paper, a pencil, an eraser and a grey or blue crayon', tip: 'Shine a flashlight on a real ball. See where it is bright and where it is dark?', steps: [
    ['Draw a big circle in the middle. This is the ball.', ac(100, 100, 60)],
    ['Draw a little sun in the top left corner. The light comes from there.', ac(28, 28, 10) + ring(8, 18, (x, y) => al(28 + (x - 100) * 0.8, 28 + (y - 100) * 0.8, 28 + (x - 100) * 1.1, 28 + (y - 100) * 1.1))],
    ['Draw a light oval on the ball, on the side nearest the sun. This is the shiniest spot. Leave it white.', guide(ae(78, 78, 12, 8))],
    ['Shade the bottom of the ball, away from the sun. Use lines that curve around the ball.', ap('M66 145 q30 22 70 0 M60 130 q40 32 85 0 M72 155 q25 12 55 0')],
    ['Draw a flat oval shadow on the ground, on the side away from the sun.', paint('#9FAABD', ae(120, 165, 50, 9))]] },
  { id: 'hatching', cat: 'shading', level: 2, title: 'Hatching and texture', ico: '▦', need: 'Paper and a pencil or a black pen', tip: 'Try these lines on your other drawings to make fur, grass or shadows.', steps: [
    ['Draw 3 squares in a row.', ar(10, 70, 55, 55) + ar(73, 70, 55, 55) + ar(136, 70, 55, 55)],
    ['In the first square, draw lines all going up and down. This is called hatching. Lines close together look darker.', [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => al(14 + i * 6, 74, 14 + i * 6, 121)).join('')],
    ['In the middle square, draw up-and-down lines, then lines going across on top. This is called cross-hatching.', [0, 1, 2, 3, 4, 5, 6, 7].map(i => al(77, 76 + i * 6, 124, 76 + i * 6) + al(77 + i * 6, 74, 77 + i * 6, 121)).join('')],
    ['In the last square, tap lots of tiny dots. This is called stippling. More dots look darker.', Array.from({ length: 40 }, (_, i) => ac(140 + (i * 37) % 47, 74 + (i * 23) % 47, 1)).join('')]] },
  { id: 'shadow', cat: 'shading', level: 3, title: 'Cast shadows', ico: '🌓', need: 'Paper, a pencil, a ruler, an eraser and a grey crayon', tip: 'Shadows always point away from the light. Look at your own shadow outside!', steps: [
    ['Draw a line across for the ground. Draw a box sitting on it. Put a small round light in the top right corner.', ac(175, 25, 10) + ar(40, 100, 50, 50) + al(0, 150, 200, 150)],
    ['With a ruler, draw two light guide lines from the light, over the top of the box, down to the ground.', guide(al(175, 25, 0, 172) + al(175, 25, 10, 160))],
    ['The shadow is on the ground, on the side away from the light, between the guide lines. Color it in grey.', paint('#9FAABD', apg('40,150 40,100 8,172 30,172'))],
    ['Erase the guides. Draw a ball on the ground with a flat oval shadow beside it. A light up high makes a short shadow.', ac(140, 128, 22) + paint('#9FAABD', ae(118, 152, 26, 5)), { clear: true }]] },

  /* ---- Color ---- */
  { id: 'wheel', cat: 'color', level: 1, title: 'The color wheel', ico: '🎡', need: 'Paper, a pencil, and red, yellow and blue crayons or paint', tip: 'With paint, mix two colors on a plate and watch a new one appear!', steps: [
    ['Red, yellow and blue are the 3 primary colors. You cannot make them by mixing other colors. Color three slices of a circle, leaving a gap between each.', wedge(0, 6, '#F2604F') + wedge(2, 6, '#FFC23D') + wedge(4, 6, '#2E8BE6')],
    ['Fill each gap by mixing the two colors beside it. Red and yellow make orange. Yellow and blue make green. Blue and red make purple.', wedge(1, 6, '#FF8A2B') + wedge(3, 6, '#2FA36B') + wedge(5, 6, '#6D55D1')],
    ['Colors that sit next to each other on the wheel look calm together. Try the Mix colors game!', '']] },
  { id: 'warmcool', cat: 'color', level: 2, title: 'Warm and cool colors', ico: '🔥', need: 'Paper and crayons in lots of colors', tip: 'Warm colors feel close and cozy. Cool colors feel calm and far away.', steps: [
    ['Draw three circles on the left. Color them red, orange and yellow. These are warm colors, like sun and fire.', paint('#F2604F', ac(40, 60, 20)) + paint('#FF8A2B', ac(40, 105, 20)) + paint('#FFC23D', ac(40, 150, 20))],
    ['Draw three circles on the right. Color them blue, green and purple. These are cool colors, like water and night.', paint('#2E8BE6', ac(160, 60, 20)) + paint('#2FA36B', ac(160, 105, 20)) + paint('#6D55D1', ac(160, 150, 20))],
    ['Now draw a sunny desert using only warm colors. Then draw a night sky using only cool colors. Which one feels hot?', '']] },
  { id: 'tints', cat: 'color', level: 2, title: 'Tints and shades', ico: '🌈', need: 'Paint in one color plus white and black, a brush and a plate; a grown-up helps', tip: 'Add just a tiny bit of black at a time. A little goes a long way!', steps: [
    ['Paint one blue circle in the middle.', paint('#2E8BE6', ac(100, 100, 20))],
    ['Mix a little white into the blue. Paint a circle on the left. Add more white and paint another. These lighter colors are called tints.', paint('#9CCBF5', ac(55, 100, 18)) + paint('#D6EAFC', ac(18, 100, 15))],
    ['Now mix a little black into the blue. Paint a circle on the right. Add more black and paint another. These darker colors are called shades.', paint('#1D5FA0', ac(145, 100, 18)) + paint('#0F3560', ac(182, 100, 15))],
    ['Paint a whole picture with just one color and its tints and shades. That is called monochrome, which means "one color".', '']] },
  { id: 'complement', cat: 'color', level: 3, title: 'Complementary colors', ico: '☯️', need: 'Paper and crayons or paint in the six rainbow colors', tip: 'Want something to stand out? Put its opposite color right next to it.', steps: [
    ['Look at the color wheel. Colors straight across from each other are called complementary colors. They are opposites.', [0, 1, 2, 3, 4, 5].map(i => wedge(i, 6, ['#F2604F', '#FF8A2B', '#FFC23D', '#2FA36B', '#2E8BE6', '#6D55D1'][i], 70)).join('')],
    ['Draw the three pairs of circles side by side: red and green, blue and orange, yellow and purple.', paint('#F2604F', ac(40, 185, 10)) + paint('#2FA36B', ac(62, 185, 10)) + paint('#2E8BE6', ac(90, 185, 10)) + paint('#FF8A2B', ac(112, 185, 10)) + paint('#FFC23D', ac(140, 185, 10)) + paint('#6D55D1', ac(162, 185, 10))],
    ['Next to each other, opposites make each other pop! But if you mix them together, they turn brown or grey. Try a red apple on green grass.', '']] },

  /* ---- Patterns ---- */
  { id: 'stripes', cat: 'pattern', level: 1, title: 'Lines, dots and zig-zags', ico: '〰️', need: 'Paper, a pencil and crayons', tip: 'A pattern repeats again and again. Say it out loud: line, line, line!', steps: [
    ['Draw a big square. Draw a line down the middle and a line across the middle. Now it has 4 boxes.', ar(30, 30, 140, 140) + al(100, 30, 100, 170) + al(30, 100, 170, 100)],
    ['In the top left box, draw straight lines going up and down. These are stripes.', [0, 1, 2, 3, 4, 5].map(i => al(34 + i * 11, 34, 34 + i * 11, 96)).join('')],
    ['In the top right box, draw dots in neat rows.', [0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => ac(112 + c * 16, 42 + r * 16, 3)).join('')).join('')],
    ['In the bottom left box, draw zig-zag lines: up, down, up, down.', [0, 1, 2, 3].map(r => apl(`34,${112 + r * 15} 42,${104 + r * 15} 50,${112 + r * 15} 58,${104 + r * 15} 66,${112 + r * 15} 74,${104 + r * 15} 82,${112 + r * 15} 90,${104 + r * 15} 96,${110 + r * 15}`)).join('')],
    ['In the last box, draw a circle, then a smaller circle inside, then a tiny one inside that. Now make up your own pattern!', ac(135, 135, 28) + ac(135, 135, 18) + ac(135, 135, 8)]] },
  { id: 'mandala', cat: 'pattern', level: 1, title: 'A mandala', ico: '🏵️', tool: 'mandala', need: 'Paper, a pencil and crayons', tip: 'Turn your paper as you draw. It is easier to go all the way around!', steps: [
    ['A mandala is a circle pattern that repeats all the way around. Start with a small circle in the middle.', ac(100, 100, 10)],
    ['Draw a bigger circle around it, like a ring.', ac(100, 100, 28)],
    ['Draw 8 round petals around the ring. Count them as you go!', ring(8, 44, (x, y) => ac(x, y, 13))],
    ['Draw a big circle around everything. Just inside it, draw a ring of little dots.', ac(100, 100, 72) + ring(16, 64, (x, y) => ac(x, y, 2.5))],
    ['Try Mandala mode in Free Draw: every line you draw copies itself all the way around!', '']] },
  { id: 'zentangle', cat: 'pattern', level: 2, title: 'Pattern tiles (Zentangle)', ico: '🔲', need: 'Paper, a pencil and a black pen or marker', tip: 'Go slowly and calmly. In Zentangle there are no mistakes!', steps: [
    ['Draw a big square tile. Draw three curvy lines across it to split it into smaller parts. This is called the string.', ar(25, 25, 150, 150) + ap('M25 80 Q90 70 110 25 M110 175 Q100 110 175 90 M60 175 Q70 130 25 120')],
    ['In the top left part, draw rows of little circles touching each other.', [0, 1, 2, 3].map(i => ac(35 + i * 14, 40, 6) + ac(42 + i * 14, 53, 6)).join('')],
    ['In the bottom right part, draw stripes that follow the curve of the string.', ap('M120 172 Q115 120 175 102 M135 172 Q130 130 175 117 M150 172 Q148 145 175 135')],
    ['In the bottom left part, draw a checkerboard: color every other little box dark.', paint('#22305A', [0, 1, 2].map(r => [0, 1, 2].map(c => (r + c) % 2 ? '' : ar(40 + c * 14, 130 + r * 12, 12, 10)).join('')).join(''))],
    ['Fill the middle with wavy lines, or any pattern you like. There are no mistakes in Zentangle!', ap('M80 120 q10 -10 20 0 t20 0 M80 105 q10 -10 20 0 t20 0')]] },
  { id: 'tessellate', cat: 'pattern', level: 3, title: 'Tessellations', ico: '🐝', need: 'Paper, card, a pencil, tape, crayons and scissors; a grown-up helps cut', tip: 'Look for tessellations at home: floor tiles, bricks and honeycomb!', steps: [
    ['A tessellation is shapes that fit together with no gaps, like tiles on a floor. Draw a hexagon: a shape with 6 equal sides, like a honeycomb cell.', apg(hexPts(56, 58))],
    ['Draw more hexagons all around the first one. Each one shares a side with its neighbours, with no gaps.', Array.from({ length: 6 }, (_, k) => { const a = k * Math.PI / 3 + Math.PI / 6; return apg(hexPts(56 + 29.44 * Math.cos(a), 58 + 29.44 * Math.sin(a))); }).join('')],
    ['Make your own tile from a square of card. Cut a bump out of one side, slide it straight across, and tape it onto the opposite side.', guide(ar(128, 20, 44, 44)) + ap(tessTile(128, 20, 44)) + ap('M132 76 q24 14 48 0') + apl('171,73 180,76 174,83')],
    ['Trace around your tile again and again, fitting each one into the last. Turn each shape into an animal or a monster!', [0, 1, 2, 3].map(c => [0, 1].map(r => { const x = 24 + c * 36, y = 114 + r * 36; return ap(tessTile(x, y)) + ac(x + 12, y + 14, 2.5) + ac(x + 24, y + 14, 2.5) + ap(`M${x + 12} ${y + 24} q6 5 12 0`); }).join('')).join(''), { clear: true }]] },

  /* ---- Lettering ---- */
  { id: 'rainbowname', cat: 'letters', level: 1, title: 'Rainbow letters', ico: '🌈', need: 'Paper and crayons in lots of colors', tip: 'Go slowly and stay close to the line. Your letters will glow like a rainbow!', steps: [
    ['Write a big letter A, slowly, with one crayon.', atext(100, 150, 'A', 140, 'class="tx"')],
    ['Pick a new color. Trace right next to your A, just a tiny bit lower.', atext(104, 154, 'A', 140, 'class="tx" style="stroke:#FF8A2B"')],
    ['Keep tracing with more colors, a tiny bit lower each time. Now write your name this way!', atext(108, 158, 'A', 140, 'class="tx" style="stroke:#2FA36B"') + atext(112, 162, 'A', 140, 'class="tx" style="stroke:#2E8BE6"')]] },
  { id: 'bubble', cat: 'letters', level: 2, title: 'Bubble letters', ico: '🫧', need: 'Paper, a pencil, an eraser and crayons', tip: 'Bubble letters are fat and round. Pretend you are blowing them up like balloons!', steps: [
    ['Write a big letter A with thin, light guide lines.', guide(apl('60,170 100,40 140,170') + al(78, 120, 122, 120))],
    ['Draw a puffy line all the way around the guide letter, like a balloon. Make the ends round.', ap('M45 172 L92 30 Q100 22 108 30 L155 172 Q140 185 128 170 L120 140 H80 L72 170 Q60 185 45 172 Z')],
    ['Draw a small triangle hole in the middle of the A.', apg('86,115 114,115 100,72')],
    ['Erase the guide. Draw a little shine line at the top and a grey shadow at the bottom. Try the rest of your name!', ap('M95 45 q-5 10 -8 22') + paint('#C9D3E0', ap('M155 172 Q140 185 128 170 L132 182 Q146 192 160 178 Z')), { clear: true }]] },

  /* ---- Crafts (each step is a separate picture) ---- */
  { id: 'plane', cat: 'craft', level: 1, title: 'Paper airplane', ico: '✈️', single: true, need: 'One sheet of paper; a grown-up can help with the folds', tip: 'Press each fold flat with your thumbnail. Sharp folds fly better!', steps: [
    ['Take a sheet of paper. Fold it in half the long way. Then open it flat again.', ar(60, 20, 80, 160) + fold(al(100, 20, 100, 180))],
    ['Fold each top corner down so its edge touches the middle line. Now the top is pointy.', apg('100,20 60,60 60,180 140,180 140,60') + fold(al(100, 20, 100, 180))],
    ['Fold each slanted side in to the middle line again. The point gets thinner.', apg('100,20 75,110 75,180 125,180 125,110') + fold(al(100, 20, 100, 180))],
    ['Fold the whole thing in half along the middle line, with the folds on the outside.', apg('30,100 170,70 170,125')],
    ['Fold one side down to make a wing. Turn it over and fold the other side the same way.', apg('30,100 170,70 170,125') + fold(al(30, 100, 170, 100))],
    ['Open the wings a little. Throw it gently, not hard. Which way flies farthest?', apg('100,20 40,170 100,150 160,170') + al(100, 20, 100, 150)]] },
  { id: 'fox', cat: 'craft', level: 2, title: 'Origami fox face', ico: '🦊', single: true, need: 'A square of orange paper and a black pen; a grown-up can help fold', tip: 'Make a whole fox family with big and small squares of paper!', steps: [
    ['Start with a square of paper. Turn it so a corner points up, like a diamond.', apg('100,20 180,100 100,180 20,100')],
    ['Fold the top corner down to the bottom corner. Now you have a triangle.', apg('20,70 180,70 100,150') + fold(al(20, 70, 180, 70))],
    ['Fold the triangle in half, side to side. Then open it again. Now there is a line down the middle.', apg('20,70 180,70 100,150') + fold(al(100, 70, 100, 150))],
    ['Fold each side corner up, so it sticks out past the top. These are the ears.', apg('100,150 40,90 55,35 85,72 115,72 145,35 160,90')],
    ['Turn it over. Draw two dot eyes and a nose at the bottom point. Hello, fox!', apg('100,160 45,90 55,40 85,75 115,75 145,40 155,90') + ac(80, 100, 5) + ac(120, 100, 5) + apg('94,140 106,140 100,152')]] },
  { id: 'cup', cat: 'craft', level: 2, title: 'Origami cup', ico: '🥤', single: true, need: 'A big square of paper; a grown-up can help with the folds', tip: 'Decorate your cup with stripes or dots before you fold it!', steps: [
    ['Fold a square in half from corner to corner to make a triangle. Turn it so the point is at the bottom.', apg('20,60 180,60 100,160')],
    ['Fold the right corner across, so its tip touches the left edge.', apg('20,60 180,60 100,160') + fold(al(60, 110, 140, 100))],
    ['Fold the left corner across, so its tip touches the right edge.', apg('55,60 145,60 145,105 100,160 55,105') + fold(al(55, 105, 145, 105))],
    ['At the top there are two flaps. Fold the front flap down and tuck it into the pocket.', apg('55,90 145,90 145,105 100,160 55,105') + fold(al(55, 90, 145, 90))],
    ['Turn it over. Fold the other flap down the same way.', apg('55,90 145,90 145,105 100,160 55,105') + fold(al(55, 90, 145, 90))],
    ['Gently open the top. It is a cup! It can even hold a little water for a short time.', apg('55,70 145,70 135,160 65,160') + ae(100, 70, 45, 8)]] },
  /* ---- Painting & collage ---- */
  { id: 'wash', cat: 'paint', level: 1, title: 'Watercolor sunset', ico: '🌅', need: 'Watercolor paints, a big brush, water, thick paper; a grown-up helps', tip: 'Let the paint do the work. Just touch the paper and watch the colors flow!', steps: [
    ['Draw a light pencil line across the paper, near the bottom. This is the ground.', al(15, 140, 185, 140)],
    ['Dip a big brush in clean water. Paint water all over the sky part, above the line. It looks shiny and wet!', paint('#DCEEFB', ar(15, 20, 170, 120)) + stroke('#A9D2F2', ap('M30 40 h40 M90 60 h60 M40 90 h50 M120 115 h45'))],
    ['Paint a stripe of yellow just above the line. Watery paint spreads by itself. That is called a wash!', paint('#FFD966', ar(15, 110, 170, 30))],
    ['While it is still wet, paint orange above the yellow. Let the colors melt into each other.', paint('#FF9F43', ar(15, 75, 170, 38))],
    ['Paint pink above the orange, then purple at the very top. Do not scrub. Just touch and let it flow.', paint('#F78FB3', ar(15, 45, 170, 32)) + paint('#8E7CC3', ar(15, 20, 170, 27))],
    ['Wait until it is dry. Then paint dark hills and a tree along the bottom. Dark shapes in front of a bright sky are called silhouettes.', paint('#22305A', ap('M15 140 Q60 112 100 130 T185 122 V185 H15 Z') + ar(140, 95, 5, 32) + ac(142, 92, 13))]] },
  { id: 'dots', cat: 'paint', level: 1, title: 'Dot painting flower', ico: '🌼', need: 'Paint, cotton buds or a pencil with an eraser end, paper; a grown-up helps', tip: 'Use a new cotton bud for each color, so the colors stay bright.', steps: [
    ['Dip the end of a cotton bud in red paint. Press it straight down in the middle of the paper to make one dot.', paint('#F2604F', ac(100, 100, 9))],
    ['Make a ring of yellow dots around the red dot. Try to keep the gaps the same.', ring(8, 22, (x, y) => paint('#FFC23D', ac(x, y, 7)))],
    ['Make a bigger ring of blue dots around the yellow ones. A bigger ring needs more dots!', ring(14, 42, (x, y) => paint('#2E8BE6', ac(x, y, 6)))],
    ['Make a ring of small green dots around the blue ones. Pictures made of dots are called pointillism.', ring(22, 62, (x, y) => paint('#2FA36B', ac(x, y, 4)))],
    ['Make one last ring of tiny purple dots, or pick your own color.', ring(30, 82, (x, y) => paint('#6D55D1', ac(x, y, 3)))]] },
  { id: 'sponge', cat: 'paint', level: 2, title: 'Sponge-print tree', ico: '🌳', need: 'Paint, a brush, a small sponge, paper, a plate; a grown-up helps', tip: 'Dab, do not wipe! Little dabs make the leaves look soft and bushy.', steps: [
    ['With a brush, paint a brown trunk. Make it wide at the bottom, and split it into branches at the top.', paint('#8B5E3C', ap('M90 185 L95 110 L75 80 L82 77 L98 102 L100 70 L106 70 L107 100 L122 78 L128 82 L108 112 L113 185 Z'))],
    ['Dip a small sponge in dark green paint. Dab it all around the branches: dab, dab, dab, no wiping!', paint('#1F7A4C', ac(80, 70, 18) + ac(105, 55, 20) + ac(130, 72, 18) + ac(95, 85, 16) + ac(120, 92, 15))],
    ['Now dab light green on the top and on one side. That is where the sun shines.', paint('#6CC08B', ac(98, 48, 12) + ac(122, 60, 12) + ac(138, 72, 9) + ac(84, 60, 10))],
    ['Dip a fingertip in red paint. Press a few dots on the tree for apples.', paint('#F2604F', ac(90, 72, 4) + ac(118, 80, 4) + ac(106, 62, 4))],
    ['Sponge a strip of green grass along the bottom.', paint('#6CC08B', ar(20, 178, 160, 10, 5))]] },
  { id: 'collage', cat: 'paint', level: 2, title: 'Torn-paper fish', ico: '🐠', need: 'Colored paper, glue, kid scissors and paper; a grown-up can help cut', tip: 'Torn edges look soft and fuzzy. Tear slowly with your fingers close together.', steps: [
    ['Tear a big oval out of orange paper. Glue it in the middle of your page. This is the fish body.', paint('#FF9F43', apg('45,100 60,75 90,62 125,66 150,82 158,100 150,118 125,134 90,138 60,125'))],
    ['Tear a triangle out of red paper for the tail. Glue it at the back, touching the body.', paint('#F2604F', apg('152,100 188,72 182,100 188,128'))],
    ['Tear small pieces of yellow paper. Glue them on the body in rows, like scales. Let them overlap a little!', paint('#FFD966', ac(88, 90, 8) + ac(108, 86, 8) + ac(128, 92, 8) + ac(96, 108, 8) + ac(118, 110, 8))],
    ['Cut a white circle and a smaller black circle. Glue them on, one on top of the other, for the eye.', paint('#fff', ac(65, 92, 8)) + paint('#22305A', ac(66, 92, 4))],
    ['Tear little circles of blue paper for bubbles. Glue them above the fish. You made a collage!', paint('#9CCBF5', ac(35, 60, 7) + ac(25, 38, 5) + ac(40, 22, 4))]] },
  { id: 'resist', cat: 'paint', level: 2, title: 'Crayon resist night sky', ico: '🌙', need: 'White or yellow crayon, dark blue watery paint, a brush, paper; a grown-up helps', tip: 'Press really hard with the crayon. The thicker the wax, the brighter it shows!', steps: [
    ['Press hard with a white or yellow crayon. Draw a moon and some stars. They are hard to see, and that is OK!', ap('M120 40 A28 28 0 1 0 150 80 A22 22 0 1 1 120 40 Z') + atext(50, 60, '✦', 18) + atext(80, 110, '✦', 14) + atext(160, 140, '✦', 16) + atext(40, 150, '✦', 12)],
    ['Paint over the whole paper with watery dark blue paint.', paint('#22305A', ar(10, 10, 180, 180))],
    ['Look! The crayon pushes the paint away, like magic! Wax and water do not mix. That is called resist.', paint('#FFD966', ap('M120 40 A28 28 0 1 0 150 80 A22 22 0 1 1 120 40 Z')) + `<g class="pt" style="fill:#FFF3C4">${atext(50, 60, '✦', 18) + atext(80, 110, '✦', 14) + atext(160, 140, '✦', 16) + atext(40, 150, '✦', 12)}</g>`],
    ['Try it again: write a secret message in white crayon for a friend to paint over.', '']] },
  { id: 'swirls', cat: 'paint', level: 3, title: 'Swirly starry sky', ico: '🌌', need: 'Paints or oil pastels, a brush, a pencil, paper; a grown-up helps with paint', tip: 'Do not smooth the paint. Short, thick strokes you can see make it swirl!', steps: [
    ['Van Gogh painted with short, thick strokes. With a pencil, draw a low wavy line of hills, and a tall flame-shaped tree on the left.', ap('M10 150 Q60 130 100 145 T190 140') + ap('M40 185 Q30 120 45 70 Q55 120 60 185')],
    ['Paint the sky light blue. Then add short curly strokes of dark blue in big swirls. Each stroke goes the same way as the one beside it.', paint('#9CCBF5', ap('M10 10 H190 V140 Q145 135 100 145 Q60 130 10 150 Z')) + stroke('#2E5FB8', ap('M70 60 q20 -25 45 -5 q15 15 -5 25 q-15 5 -15 -8') + ap('M20 30 q30 -10 50 5') + ap('M130 100 q25 -20 50 0') + ap('M80 110 q20 -15 40 0') + ap('M15 70 q20 -12 40 0'))],
    ['Paint a big yellow moon and a few stars. Paint a ring of yellow strokes around each one, so they glow.', paint('#FFD966', ac(160, 40, 14) + ac(30, 90, 6) + ac(110, 30, 5)) + stroke('#FFC23D', ac(160, 40, 22) + ac(30, 90, 12) + ac(110, 30, 10))],
    ['Paint the tree very dark, with strokes that go up like flames. Dark next to light makes it stand out.', paint('#22305A', ap('M40 185 Q30 120 45 70 Q55 120 60 185 Z'))],
    ['Paint tiny houses on the hills, each a square with a triangle roof and a yellow window. Leave the brush marks showing: that is the style!', ar(100, 150, 18, 14) + apg('98,150 109,141 120,150') + ar(130, 148, 18, 16) + apg('128,148 139,139 150,148') + paint('#FFC23D', ar(106, 155, 5, 5) + ar(136, 153, 5, 5))]] }
];

const lessonById = id => LESSONS.find(l => l.id === id);
