/* ---------- shape puzzles: drag colourful shapes onto a silhouette to finish a picture (math + art) ---------- */
// Easy: a few big pieces whose outlines are drawn inside the picture. Medium: only the outer outline with faint
// piece hints, and some pieces must be turned. Tricky: classic 7-piece tangrams, with turn and flip and no hints.
const shapeHome = lazyArea(/*lazy{*/() => {
  const INK = '#22305A', SIL = '#BCC7D8', COLS = ['#F2604F', '#2E8BE6', '#FFC23D', '#2FA36B', '#6D55D1', '#FF8A2B', '#F49AC1', '#2EC4B6'];
  const LEVELS = [
    { id: 'easy', name: 'Easy', ico: '🟢', step: 90, tol: 64, lead: 'Match each shape to its outline.' },
    { id: 'medium', name: 'Medium', ico: '🟡', step: 90, tol: 50, lead: 'Only the outline! Some shapes need a turn.' },
    { id: 'tricky', name: 'Tricky', ico: '🔴', step: 45, tol: 40, lead: 'Seven tangram pieces. Turn and flip them to fit.' }
  ];
  const INFO = {
    triangle: ['triangles', 3, 'A triangle has 3 sides and 3 corners.', '3 sides, 3 corners'],
    square: ['squares', 4, 'A square has 4 sides, all the same length, and 4 corners.', '4 same sides, 4 corners'],
    rectangle: ['rectangles', 4, 'A rectangle has 4 sides and 4 corners. Its opposite sides are the same length.', '4 sides, 4 corners'],
    circle: ['circles', 0, 'A circle is round. It has no corners and no straight sides.', 'round, no corners'],
    semicircle: ['semicircles', 2, 'A semicircle is half a circle. It has 1 straight side, 1 curved side and 2 corners.', 'half a circle, 2 corners'],
    parallelogram: ['parallelograms', 4, 'A parallelogram has 4 sides and 4 corners. It looks like a rectangle leaning over.', '4 sides, 4 corners'],
    trapezoid: ['trapezoids', 4, 'A trapezoid has 4 sides and 4 corners. Two of its sides are parallel, like train tracks.', '4 sides, 4 corners'],
    hexagon: ['hexagons', 6, 'A hexagon has 6 sides and 6 corners, like a honeycomb cell.', '6 sides, 6 corners']
  };
  const ICON = {
    triangle: '<polygon points="5,1 9.5,9 0.5,9"/>', square: '<rect x="1.5" y="1.5" width="7" height="7"/>', rectangle: '<rect x="0.5" y="2.5" width="9" height="5"/>',
    circle: '<circle cx="5" cy="5" r="4.3"/>', semicircle: '<path d="M0.6,7.5 A4.4,4.4 0 0 1 9.4,7.5 Z"/>', parallelogram: '<polygon points="3,2 9.6,2 7,8 0.4,8"/>',
    trapezoid: '<polygon points="3,2 7,2 9.6,8 0.4,8"/>', hexagon: '<polygon points="5,0.6 8.8,2.8 8.8,7.2 5,9.4 1.2,7.2 1.2,2.8"/>'
  };
  const icon = (t, c = '#6D55D1') => `<svg viewBox="-0.5 -0.5 11 11" aria-hidden="true"><g fill="${c}" stroke="${INK}" stroke-width=".5" stroke-linejoin="round">${ICON[t]}</g></svg>`;

  /* --- shape builders (all in puzzle units) --- */
  const r3 = v => Math.round(v * 1000) / 1000;
  const tri = (...p) => ({ t: 'triangle', p });
  const trap = (...p) => ({ t: 'trapezoid', p });
  const para = (...p) => ({ t: 'parallelogram', p });
  const rect = (x, y, w, h) => ({ t: w === h ? 'square' : 'rectangle', p: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]] });
  const arc = (cx, cy, r, a0, a1, n) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [r3(cx + r * Math.cos(a)), r3(cy + r * Math.sin(a))]; });
  const circ = (cx, cy, r) => ({ t: 'circle', p: arc(cx, cy, r, 0, 360, 48).slice(0, 48) });
  // A half circle whose round side faces `dir` degrees (0 right, 90 down, 180 left, 270 up).
  const semi = (cx, cy, r, dir) => ({ t: 'semicircle', p: arc(cx, cy, r, dir - 90, dir + 90, 24) });
  const hexPts = (cx, cy, r, a0) => Array.from({ length: 6 }, (_, i) => { const a = (a0 + i * 60) * Math.PI / 180; return [r3(cx + r * Math.cos(a)), r3(cy + r * Math.sin(a))]; });
  const hex = (cx, cy, r, a0 = 0) => ({ t: 'hexagon', p: hexPts(cx, cy, r, a0) });
  const col = (s, c) => Object.assign(s, { c });
  const dot = (x, y, r, f = INK) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`;
  const eye = (x, y, r) => dot(x, y, r, '#fff') + dot(x + r * 0.15, y + r * 0.1, r * 0.55);
  const box = (x, y, w, h, f, s = INK) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx=".25" fill="${f}" stroke="${s}" stroke-width=".18"/>`;
  const poly = (pts, f) => `<polygon points="${pts}" fill="${f}" stroke="${INK}" stroke-width=".15" stroke-linejoin="round"/>`;

  // Flower petals: one half circle on each edge of a flat-topped hexagon, except the bottom edge where the stem goes.
  const FH = hexPts(7, 7, 2.6, 0);
  const petal = k => { const a = FH[k], b = FH[(k + 1) % 6], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2; return semi(mx, my, 1.3, Math.round(Math.atan2(my - 7, mx - 7) * 180 / Math.PI)); };

  /* --- tangram pieces (classic set: 2 large, 1 medium, 2 small triangles, a square, a parallelogram) --- */
  const TN = { LT: 'triangle', M: 'triangle', ST: 'triangle', SQ: 'square', P: 'parallelogram' };
  const tg = list => list.map(([k, p]) => ({ t: TN[k], p }));

  const PUZZLES = [
    // ----- Easy: 3 to 5 big pieces -----
    { id: 'e-house', lvl: 'easy', name: 'House', ico: '🏠', pieces: [trap([0, 7], [12, 7], [9, 3], [3, 3]), rect(7, 0, 2, 3), col(rect(2, 7, 8, 8), '#FFC23D')],
      deco: box(3.6, 10.5, 2.4, 4.5, '#8B5A2B') + box(6.8, 9, 2, 2, '#8EC5F5') + `<path d="M7.8,9V11M6.8,10H8.8" stroke="${INK}" stroke-width=".15"/>` },
    { id: 'e-rocket', lvl: 'easy', name: 'Rocket', ico: '🚀', pieces: [tri([4, 4], [8, 4], [6, 0]), col(rect(4, 4, 4, 8), '#2E8BE6'), tri([1, 12], [4, 12], [4, 8]), tri([8, 8], [8, 12], [11, 12]), col(trap([4.5, 12], [7.5, 12], [7, 14], [5, 14]), '#FF8A2B')],
      deco: `<circle cx="6" cy="7" r="1.1" fill="#8EC5F5" stroke="${INK}" stroke-width=".2"/>` },
    { id: 'e-fish', lvl: 'easy', name: 'Fish', ico: '🐟', pieces: [col(semi(6, 6, 4, 180), '#FF8A2B'), col(trap([6, 2], [6, 10], [10, 8], [10, 4]), '#FFC23D'), col(trap([10, 4], [10, 8], [13, 10], [13, 2]), '#F2604F')],
      deco: eye(4.2, 4.8, 0.7) + `<path d="M2.6,7.2Q3.4,7.6 4,7.1" fill="none" stroke="${INK}" stroke-width=".18" stroke-linecap="round"/>` },
    { id: 'e-sailboat', lvl: 'easy', name: 'Sailboat', ico: '⛵', pieces: [col(trap([0, 10], [14, 10], [11, 13], [3, 13]), '#F2604F'), tri([2, 10], [7, 10], [7, 1]), tri([7, 10], [11, 10], [7, 4])] },
    { id: 'e-tree', lvl: 'easy', name: 'Tree', ico: '🌲', pieces: [col(trap([1, 9], [13, 9], [10, 5], [4, 5]), '#2FA36B'), col(tri([4, 5], [10, 5], [7, 0]), '#2EC4B6'), col(rect(5.5, 9, 3, 4), '#8B5A2B')],
      deco: dot(5.5, 7.5, 0.5, '#F2604F') + dot(9, 8, 0.5, '#FFC23D') + dot(7, 3, 0.5, '#F49AC1') + dot(8, 6, 0.45, '#6D55D1') },
    { id: 'e-car', lvl: 'easy', name: 'Car', ico: '🚗', pieces: [col(rect(0, 4, 14, 4), '#F2604F'), col(trap([3, 4], [11, 4], [9, 1], [5, 1]), '#2E8BE6'), col(semi(3.5, 8, 2, 90), '#22305A'), col(semi(10.5, 8, 2, 90), '#22305A')],
      deco: box(5.5, 1.8, 1.3, 1.8, '#D9EBFC') + box(7.2, 1.8, 1.3, 1.8, '#D9EBFC') + dot(13, 5.3, .5, '#FFC23D') },
    { id: 'e-snowman', lvl: 'easy', name: 'Snowman', ico: '⛄', pieces: [col(circ(6, 13, 4.5), '#D9EBFC'), col(circ(6, 6, 2.5), '#EEF6FF'), col(rect(4, 0.5, 4, 3), '#22305A')],
      deco: dot(5.2, 5.5, .3) + dot(6.8, 5.5, .3) + poly('6,6.3 8,6.8 6,7.1', '#FF8A2B') + dot(6, 11, .35) + dot(6, 13, .35) + dot(6, 15, .35) },
    { id: 'e-icecream', lvl: 'easy', name: 'Ice cream', ico: '🍦', pieces: [col(tri([2, 7], [10, 7], [6, 16]), '#E8B36A'), col(semi(6, 7, 4, 270), '#F49AC1'), col(circ(6, 1.8, 1.2), '#F2604F')],
      deco: `<g stroke-width=".35" stroke-linecap="round"><path d="M4,5.5l.5-.4" stroke="#2E8BE6"/><path d="M6.5,4.5l.5.3" stroke="#FFC23D"/><path d="M8,5.8l-.3.5" stroke="#2FA36B"/><path d="M5.3,6.3l.5.1" stroke="#6D55D1"/></g><path d="M3.4,9.6L8.6,9.6M4.6,12.4L7.4,12.4" stroke="#B07A3A" stroke-width=".2"/>` },
    { id: 'e-flower', lvl: 'easy', name: 'Flower', ico: '🌼', pieces: [col(rect(4, 4, 4, 4), '#FFC23D'), col(semi(6, 4, 2, 270), '#F49AC1'), col(semi(4, 6, 2, 180), '#F2604F'), col(semi(8, 6, 2, 0), '#6D55D1'), col(semi(6, 8, 2, 90), '#2E8BE6')],
      deco: dot(6, 6, .9, '#FF8A2B') + dot(5.7, 5.7, .3, '#FFE79A') },
    { id: 'e-candle', lvl: 'easy', name: 'Candle', ico: '🕯️', pieces: [col(tri([5, 6], [7, 6], [6, 2.4]), '#FF8A2B'), col(rect(4, 6, 4, 8), '#F2604F'), col(trap([1, 14], [11, 14], [10, 16], [2, 16]), '#FFC23D')],
      deco: poly('5.6,6 6.4,6 6,4.4', '#FFE79A') },
    { id: 'e-owl', lvl: 'easy', name: 'Owl', ico: '🦉', pieces: [col(rect(3, 4, 8, 10), '#8B5A2B'), tri([3, 4], [6, 4], [3, 1]), tri([8, 4], [11, 4], [11, 1]), tri([3, 6], [3, 13], [0.5, 12]), tri([11, 6], [11, 13], [13.5, 12])],
      deco: eye(5.4, 7, 1.4) + eye(8.6, 7, 1.4) + poly('6.3,8.6 7.7,8.6 7,10', '#FF8A2B') + `<path d="M5,11.5q.7.6 1.4 0M7.6,11.5q.7.6 1.4 0M6.3,12.7q.7.6 1.4 0" fill="none" stroke="#F6C9A0" stroke-width=".25" stroke-linecap="round"/>` },

    // ----- Medium: 5 to 7 pieces, outline only -----
    { id: 'm-cat', lvl: 'medium', name: 'Cat', ico: '🐱', pieces: [tri([3, 3], [6, 3], [3, 0]), tri([6, 3], [9, 3], [9, 0]), col(rect(3, 3, 6, 6), '#FF8A2B'), col(rect(2, 9, 8, 7), '#FFC23D'), para([10, 14], [14, 10], [14, 12], [10, 16])],
      deco: dot(4.8, 5.4, .45) + dot(7.2, 5.4, .45) + poly('5.6,6.6 6.4,6.6 6,7.2', '#F49AC1') + `<path d="M6,7.2q-.6.7-1.3.3M6,7.2q.6.7 1.3.3" fill="none" stroke="${INK}" stroke-width=".15"/>` },
    { id: 'm-robot', lvl: 'medium', name: 'Robot', ico: '🤖', pieces: [tri([6, 2], [8, 2], [7, 0.4]), col(rect(5, 2, 4, 4), '#9AA0A8'), col(rect(3, 6, 8, 7), '#2E8BE6'), rect(1, 7, 2, 5), rect(11, 7, 2, 5), rect(4, 13, 2, 4), rect(8, 13, 2, 4)],
      deco: dot(6.2, 3.7, .45, '#FFC23D') + dot(7.8, 3.7, .45, '#FFC23D') + box(6, 4.7, 2, .5, INK) + box(5, 8, 4, 2.5, '#D9EBFC') + dot(6, 9.2, .4, '#F2604F') + dot(8, 9.2, .4, '#2FA36B') },
    { id: 'm-castle', lvl: 'medium', name: 'Castle', ico: '🏰', pieces: [col(rect(4, 6, 8, 8), '#9AA0A8'), rect(1, 4, 3, 10), rect(12, 4, 3, 10), tri([1, 4], [4, 4], [2.5, 0.6]), tri([12, 4], [15, 4], [13.5, 0.6]), rect(5, 4, 2, 2), rect(9, 4, 2, 2)],
      deco: `<path d="M6.5,14V11.2a1.5,1.5 0 0 1 3,0V14Z" fill="#8B5A2B" stroke="${INK}" stroke-width=".15"/>` + box(2, 7, 1, 1.6, INK) + box(13, 7, 1, 1.6, INK) },
    { id: 'm-flower', lvl: 'medium', name: 'Flower', ico: '🌸', pieces: [col(hex(7, 7, 2.6, 0), '#FFC23D'), petal(0), petal(2), petal(3), petal(4), petal(5), col(rect(6.2, r3(7 + 2.6 * Math.sqrt(3) / 2), 1.6, 5), '#2FA36B')],
      deco: dot(7, 7, .9, '#FF8A2B') + `<path d="M7.8,13.2Q9.6,11 10.8,11.4Q10.2,13.4 7.8,13.2ZM6.2,12.4Q4.4,10.4 3.2,10.8Q3.8,12.8 6.2,12.4Z" fill="#2FA36B" stroke="${INK}" stroke-width=".15"/>` },
    { id: 'm-rabbit', lvl: 'medium', name: 'Rabbit', ico: '🐰', pieces: [rect(3.5, 0, 2, 5), rect(6.5, 0, 2, 5), col(rect(3, 5, 6, 6), '#F6C9A0'), col(trap([2, 11], [10, 11], [12, 17], [0, 17]), '#9AA0A8'), semi(3, 17, 2, 90), semi(9, 17, 2, 90)],
      deco: dot(4.8, 7.4, .45) + dot(7.2, 7.4, .45) + poly('5.5,8.6 6.5,8.6 6,9.3', '#F49AC1') + box(4.1, 1, .8, 3.4, '#F49AC1', 'none') + box(7.1, 1, .8, 3.4, '#F49AC1', 'none') },
    { id: 'm-bird', lvl: 'medium', name: 'Bird', ico: '🐦', pieces: [col(semi(7, 8, 5, 90), '#2E8BE6'), tri([2, 8], [4, 8], [-1, 4.5]), tri([4, 8], [9, 8], [6, 4.5]), col(rect(9, 5, 3, 3), '#2EC4B6'), col(tri([12, 5.5], [12, 7.5], [14, 6.5]), '#FF8A2B')],
      deco: eye(10.6, 6, .55) },
    { id: 'm-boat', lvl: 'medium', name: 'Steamboat', ico: '🚢', pieces: [col(trap([0, 8], [16, 8], [13, 11], [3, 11]), '#F2604F'), rect(3, 5, 8, 3), rect(5, 2, 2, 3), rect(8, 2, 2, 3), rect(11, 6, 2, 2)],
      deco: dot(5, 9.4, .5, '#D9EBFC') + dot(8, 9.4, .5, '#D9EBFC') + dot(11, 9.4, .5, '#D9EBFC') + box(4.2, 5.7, 1.4, 1.3, '#D9EBFC') + box(6.6, 5.7, 1.4, 1.3, '#D9EBFC') },
    { id: 'm-train', lvl: 'medium', name: 'Train', ico: '🚂', pieces: [col(rect(1, 2, 4, 6), '#F2604F'), col(rect(5, 4, 7, 4), '#2E8BE6'), trap([7.5, 1.5], [10.5, 1.5], [10, 4], [8, 4]), tri([12, 4], [12, 8], [14, 8]), col(semi(3, 8, 1.5, 90), INK), col(semi(7, 8, 1.5, 90), INK), col(semi(10.5, 8, 1.5, 90), INK)],
      deco: box(1.8, 3, 2.4, 2, '#D9EBFC') },

    // ----- Tricky: the classic 7-piece tangram -----
    { id: 't-house', lvl: 'tricky', name: 'House', ico: '🏡', sil: [[4, 0], [8, 4], [6, 4], [6, 8], [2, 8], [2, 4], [0, 4]],
      pieces: tg([['LT', [[2, 4], [6, 4], [2, 8]]], ['LT', [[6, 8], [2, 8], [6, 4]]], ['M', [[6, 2], [2, 2], [4, 0]]], ['ST', [[2, 4], [0, 4], [2, 2]]], ['ST', [[4, 4], [4, 2], [6, 4]]], ['SQ', [[2, 2], [4, 2], [4, 4], [2, 4]]], ['P', [[4, 2], [6, 2], [8, 4], [6, 4]]]]) },
    { id: 't-sailboat', lvl: 'tricky', name: 'Sailboat', ico: '⛵', sil: [[0, 4], [1, 4], [5, 0], [9, 4], [10, 4], [8, 6], [2, 6]],
      pieces: tg([['LT', [[5, 4], [1, 4], [5, 0]]], ['LT', [[5, 4], [5, 0], [9, 4]]], ['M', [[0, 4], [4, 4], [2, 6]]], ['ST', [[6, 4], [8, 4], [6, 6]]], ['ST', [[4, 6], [2, 6], [4, 4]]], ['SQ', [[4, 4], [6, 4], [6, 6], [4, 6]]], ['P', [[10, 4], [8, 4], [6, 6], [8, 6]]]]) },
    { id: 't-rocket', lvl: 'tricky', name: 'Rocket', ico: '🚀', sil: [[2, 0], [4, 2], [4, 4], [6, 6], [6, 8], [4, 6], [3, 6], [3, 8], [1, 8], [1, 6], [0, 6], [-2, 8], [-2, 6], [0, 4], [0, 2]],
      pieces: tg([['LT', [[0, 2], [4, 2], [0, 6]]], ['LT', [[4, 6], [0, 6], [4, 2]]], ['M', [[4, 2], [0, 2], [2, 0]]], ['ST', [[-2, 6], [0, 6], [-2, 8]]], ['ST', [[0, 6], [-2, 6], [0, 4]]], ['SQ', [[1, 6], [3, 6], [3, 8], [1, 8]]], ['P', [[6, 8], [6, 6], [4, 4], [4, 6]]]]) },
    { id: 't-cat', lvl: 'tricky', name: 'Cat', ico: '🐈', sil: [[0, 0], [2, 2], [4, 0], [4, 6], [6, 4], [6, 6], [4, 8], [0, 8]],
      pieces: tg([['LT', [[0, 4], [4, 4], [0, 8]]], ['LT', [[4, 4], [0, 4], [4, 0]]], ['M', [[0, 4], [0, 0], [2, 2]]], ['ST', [[2, 8], [0, 8], [2, 6]]], ['ST', [[4, 6], [2, 6], [4, 4]]], ['SQ', [[2, 6], [4, 6], [4, 8], [2, 8]]], ['P', [[6, 4], [6, 6], [4, 8], [4, 6]]]]),
      deco: dot(1.3, 2.9, .3) + dot(2.7, 2.9, .3) },
    { id: 't-tree', lvl: 'tricky', name: 'Tree', ico: '🎄', sil: [[4, 0], [8, 4], [6, 4], [8, 6], [5, 6], [5, 8], [3, 8], [3, 6], [0, 6], [2, 4], [0, 4]],
      pieces: tg([['LT', [[4, 4], [0, 4], [4, 0]]], ['LT', [[6, 6], [2, 6], [6, 2]]], ['M', [[4, 4], [4, 0], [6, 2]]], ['ST', [[6, 4], [6, 2], [8, 4]]], ['ST', [[6, 6], [6, 4], [8, 6]]], ['SQ', [[3, 6], [5, 6], [5, 8], [3, 8]]], ['P', [[4, 4], [2, 4], [0, 6], [2, 6]]]]) },
    { id: 't-fish', lvl: 'tricky', name: 'Fish', ico: '🐠', sil: [[0, 4], [4, 0], [4, 2], [6, 2], [8, 0], [8, 2], [6, 4], [8, 6], [6, 6], [4, 8]],
      pieces: tg([['LT', [[4, 4], [4, 8], [0, 4]]], ['LT', [[4, 4], [0, 4], [4, 0]]], ['M', [[8, 6], [4, 6], [6, 4]]], ['ST', [[4, 4], [6, 4], [4, 6]]], ['ST', [[4, 6], [6, 6], [4, 8]]], ['SQ', [[4, 2], [6, 2], [6, 4], [4, 4]]], ['P', [[8, 0], [8, 2], [6, 4], [6, 2]]]]),
      deco: dot(1.8, 3.6, .35) },
    { id: 't-duck', lvl: 'tricky', name: 'Duck', ico: '🦆', sil: [[-2, 2], [0, 0], [2, 0], [2, 2], [4, 4], [8, 4], [8, 6], [6, 8], [2, 8], [2, 4], [0, 2]],
      pieces: tg([['LT', [[2, 4], [6, 4], [2, 8]]], ['LT', [[6, 8], [2, 8], [6, 4]]], ['M', [[2, 0], [2, 4], [0, 2]]], ['ST', [[6, 6], [8, 6], [6, 8]]], ['ST', [[2, 4], [2, 2], [4, 4]]], ['SQ', [[6, 4], [8, 4], [8, 6], [6, 6]]], ['P', [[2, 0], [0, 0], [-2, 2], [0, 2]]]]),
      deco: dot(1, 0.9, .3) },
    { id: 't-gem', lvl: 'tricky', name: 'Gem', ico: '💎', sil: [[4, 8], [0, 4], [-1, 4], [1, 2], [7, 2], [9, 4], [8, 4]],
      pieces: tg([['LT', [[4, 4], [8, 4], [4, 8]]], ['LT', [[4, 4], [4, 8], [0, 4]]], ['M', [[3, 4], [-1, 4], [1, 2]]], ['ST', [[3, 2], [3, 4], [1, 2]]], ['ST', [[5, 4], [5, 2], [7, 4]]], ['SQ', [[3, 2], [5, 2], [5, 4], [3, 4]]], ['P', [[5, 2], [7, 2], [9, 4], [7, 4]]]]),
      deco: `<path d="M1.6,2.6L2.4,3.4M6.6,2.4l.8.8" stroke="#fff" stroke-width=".3" stroke-linecap="round"/>` }
  ];

  /* --- geometry --- */
  const area = p => { let a = 0; for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]; a += x1 * y2 - x2 * y1; } return a / 2; };
  const centroid = p => { let a = 0, cx = 0, cy = 0; for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length], k = x1 * y2 - x2 * y1; a += k; cx += (x1 + x2) * k; cy += (y1 + y2) * k; } return [cx / (3 * a), cy / (3 * a)]; };
  const inside = ([x, y], p) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const [xi, yi] = p[i], [xj, yj] = p[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const orient = (base, rot, flip) => { const a = rot * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return base.map(([x, y]) => { if (flip) x = -x; return [x * c - y * s, x * s + y * c]; }); };
  const sameSet = (A, B, eps = 0.04) => A.length === B.length && A.every(([x, y]) => B.some(([u, v]) => Math.abs(x - u) < eps && Math.abs(y - v) < eps));
  const bbox = pts => { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
  const ptsAttr = p => p.map(([x, y]) => `${r3(x)},${r3(y)}`).join(' ');
  const plural = (n, t) => `${n} ${n === 1 ? t : INFO[t][0]}`;
  const an = t => (/^[aeiou]/.test(t) ? 'an ' : 'a ') + t;
  const listJoin = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];

  // Every puzzle piece: its outline centred on its own middle, its colour, and a kind (same kind = same shape and size).
  PUZZLES.forEach(pz => {
    pz.P = pz.pieces.map((s, i) => { const c = centroid(s.p), ar = Math.abs(area(s.p)); return { t: s.t, poly: s.p, c, area: ar, base: s.p.map(([x, y]) => [x - c[0], y - c[1]]), color: s.c || COLS[i % COLS.length], kind: s.t + '|' + ar.toFixed(2) }; });
    pz.box = bbox(pz.pieces.flatMap(s => s.p));
    pz.count = {}; pz.P.forEach(p => pz.count[p.t] = (pz.count[p.t] || 0) + 1);
  });
  const byId = id => PUZZLES.find(p => p.id === id);
  const levelOf = id => LEVELS.find(l => l.id === id);

  /* --- tangram fitting on a grid of quarter squares, so any correct answer is accepted (not only Owl's) --- */
  // Every corner of every piece sits on whole numbers and every edge is straight, across or at 45°, so each piece
  // covers whole quarter-squares (a square cut corner to corner). A piece may go wherever the rest can still be finished.
  const QC = [[.5, 1 / 6], [5 / 6, .5], [.5, 5 / 6], [1 / 6, .5]];
  function grid(pz) {
    if (pz.G) return pz.G;
    const [x0, y0, x1, y1] = bbox(pz.sil).map(Math.round), W = x1 - x0, H = y1 - y0, sil = new Uint8Array(W * H * 4);
    const cellsOf = (p, ox, oy) => { const out = [], [a, b, c, d] = bbox(p).map(Math.round); for (let j = b; j < d; j++) for (let i = a; i < c; i++) QC.forEach(([qx, qy], q) => { if (inside([i + qx, j + qy], p)) out.push([i - ox, j - oy, q]); }); return out; };
    cellsOf(pz.sil, 0, 0).forEach(([i, j, q]) => sil[((j - y0) * W + i - x0) * 4 + q] = 1);
    const kinds = {};
    pz.P.forEach(p => {
      if (kinds[p.kind]) return;
      const or = [];
      for (const flip of [false, true]) for (const rot of [0, 90, 180, 270]) {
        const o = orient(p.base, rot, flip), rel = o.map(([x, y]) => [Math.round(x - o[0][0]), Math.round(y - o[0][1])]);
        if (or.some(e => sameSet(e.o, o))) continue;
        or.push({ rot, flip, o, rel, cells: cellsOf(rel, 0, 0) });
      }
      kinds[p.kind] = or;
    });
    return pz.G = { x0, y0, W, H, sil, kinds, cellsOf };
  }
  const gIdx = (G, i, j, q) => (i < G.x0 || j < G.y0 || i >= G.x0 + G.W || j >= G.y0 + G.H) ? -1 : ((j - G.y0) * G.W + i - G.x0) * 4 + q;
  function fitCells(G, or, ai, aj, free) {
    const out = [];
    for (const [di, dj, q] of or.cells) { const k = gIdx(G, ai + di, aj + dj, q); if (k < 0 || !free[k]) return null; out.push(k); }
    return out;
  }
  // Fill the free quarter-squares with the pieces left (a multiset of kinds). Returns the placements, or null.
  function tSolve(G, free, need, guard = { n: 0 }) {
    const first = free.indexOf(1);
    if (first < 0) return Object.values(need).every(n => !n) ? [] : null;
    if (++guard.n > 60000) return null;
    const q = first % 4, c = (first - q) / 4, i = c % G.W + G.x0, j = Math.floor(c / G.W) + G.y0;
    for (const k in need) {
      if (!need[k]) continue;
      for (const or of G.kinds[k]) for (const [di, dj, qq] of or.cells) {
        if (qq !== q) continue;
        const ai = i - di, aj = j - dj, ks = fitCells(G, or, ai, aj, free); if (!ks) continue;
        ks.forEach(x => free[x] = 0); need[k]--;
        const rest = tSolve(G, free, need, guard);
        ks.forEach(x => free[x] = 1); need[k]++;
        if (rest) return [{ k, or, ai, aj }, ...rest];
      }
    }
    return null;
  }

  /* --- state --- */
  const rec = () => { st.shapes = st.shapes || { lvl: null, done: {} }; st.shapes.done = st.shapes.done || {}; return st.shapes; };
  const ageLevel = () => st.age <= 5 ? 'easy' : st.age <= 8 ? 'medium' : 'tricky';
  let from = 'art', cur = null;

  function silSVG(pz, { done, cls = '', label = '' } = {}) {
    const [x0, y0, x1, y1] = pz.box, m = 0.8;
    const body = done ? pz.P.map(p => `<polygon points="${ptsAttr(p.poly)}" fill="${p.color}" stroke="${INK}" stroke-width=".1" stroke-linejoin="round"/>`).join('') + (pz.deco || '')
      : pz.sil ? `<polygon points="${ptsAttr(pz.sil)}" fill="${SIL}" stroke="${INK}" stroke-width=".25" stroke-linejoin="round"/>`
      : `<g stroke="${INK}" stroke-width=".35" stroke-linejoin="round" fill="${SIL}">${pz.P.map(p => `<polygon points="${ptsAttr(p.poly)}"/>`).join('')}</g><g fill="${SIL}" stroke="${SIL}" stroke-width=".14">${pz.P.map(p => `<polygon points="${ptsAttr(p.poly)}"/>`).join('')}</g>`;
    return `<svg class="${cls}" viewBox="${x0 - m} ${y0 - m} ${x1 - x0 + 2 * m} ${y1 - y0 + 2 * m}" role="img" aria-label="${label || pz.name}">${body}</svg>`;
  }

  /* --- the puzzle grid --- */
  function gridView(lvl) {
    const R = rec(); lvl = lvl || R.lvl || ageLevel(); R.lvl = lvl;
    const L = levelOf(lvl), list = PUZZLES.filter(p => p.lvl === lvl), n = list.filter(p => R.done[p.id]).length;
    view.innerHTML = `${crumbs('🔺 Shape puzzles')}
      <p class="sp-lead">Drag the shapes onto the picture to finish it. <b>${n} of ${list.length}</b> done.</p>
      <div class="tabs sp-tabs" role="group" aria-label="Level">${LEVELS.map(l => `<button data-lvl="${l.id}" aria-pressed="${l.id === lvl}">${l.ico} ${l.name}</button>`).join('')}</div>
      <p class="note">${L.lead}</p>
      <div class="sp-grid">${list.map(p => { const d = !!R.done[p.id];
        return `<button class="sp-card${d ? ' done' : ''}" data-pz="${p.id}" aria-label="${p.name}${d ? ', done' : ''}">${silSVG(p, { done: d, cls: 'sp-thumb', label: p.name })}<b>${p.name}</b><span>${d ? '✓ Done' : `${p.P.length} shapes`}</span>${d ? '<i class="sp-tick" aria-hidden="true">✓</i>' : ''}</button>`; }).join('')}</div>`;
    wireBack(from === 'math' ? mathHome : artHome);
    sayScreen(`Shape puzzles! ${L.name} level. Pick a picture to build with shapes.`);
    view.querySelectorAll('[data-lvl]').forEach(b => b.onclick = () => { rec().lvl = b.dataset.lvl; save(); go(gridView, b.dataset.lvl); });
    view.querySelectorAll('[data-pz]').forEach(b => b.onclick = () => go(puzzleView, b.dataset.pz));
  }

  /* --- one puzzle --- */
  function puzzleView(id) {
    const pz = byId(id), L = levelOf(pz.lvl), tricky = pz.lvl === 'tricky', R = rec();
    const G = tricky ? grid(pz) : null, free = tricky ? G.sil.slice() : null;
    // Pieces start in the tray. Easy: already turned the right way. Medium: every other uneven piece needs one turn.
    // Tricky: any turn of 45°, and the parallelogram may start flipped.
    const order = shuffle(pz.P.map((_, i) => i));
    const pieces = pz.P.map((p, i) => {
      let rot = 0, flip = false;
      if (pz.lvl === 'medium' && i % 2 === 1 && !sameSet(orient(p.base, 90, false), p.base)) rot = 270;
      if (tricky) { rot = pick([45, 90, 135, 180, 225, 270, 315, 0]); flip = p.t === 'parallelogram' && Math.random() < 0.5; if (!rot && !flip) rot = 90; }
      return { i, ...p, rot, raw: rot, flip, x: 0, y: 0, placed: false };
    });
    const targets = tricky ? [] : pz.P.map((p, j) => ({ j, kind: p.kind, rel: p.base, c: p.c, poly: p.poly, filled: null }));
    let sel = null, drag = null, finished = false, lay = null;
    cur = { pz, pieces, targets, get finished() { return finished; }, free, G };

    view.innerHTML = `${crumbs(`${pz.ico} ${pz.name}`)}
      <div class="sp-bar">
        <button class="tool" id="spRot" aria-label="Turn the shape">↻ Turn</button>
        ${tricky ? '<button class="tool" id="spFlip" aria-label="Flip the shape over">⇋ Flip</button>' : ''}
        <button class="tool" id="spHint" aria-label="Show where the shape goes">💡 Hint</button>
        <button class="tool" id="spSay" aria-label="Say it again">🔊</button>
        <span class="sp-lvl">${L.ico} ${L.name}</span>
      </div>
      <p class="sp-msg" id="spMsg" aria-live="polite"></p>
      <div class="sp-stage" id="spStage"></div>
      <div id="spDone"></div>`;
    wireBack(() => gridView(pz.lvl));
    const msg = t => { $('#spMsg').textContent = t; };
    const intro = `Let's make ${an(pz.name.toLowerCase())}! Drag each shape onto the picture.${tricky ? ' Use turn and flip to make them fit.' : pz.lvl === 'medium' ? ' Some shapes need a turn first.' : ''}`;
    msg('🦉 ' + (tricky ? 'Turn ↻ and flip ⇋ the 7 pieces to fit.' : pz.lvl === 'medium' ? 'Drag the shapes in. Some need a turn ↻.' : 'Drag each shape onto its outline.')); sayScreen(intro);
    $('#spSay').onclick = () => say(screenText);

    /* layout: board and tray side by side or stacked, whichever gives bigger shapes */
    const [bx0, by0, bx1, by1] = pz.box, BM = 0.7, GAP = 0.8;
    const ext = p => { // half-size of the slot a piece needs, for every way it can be turned
      const rots = pz.lvl === 'easy' ? [p.rot] : tricky ? [0, 45, 90, 135] : [0, 90];
      let hx = 0, hy = 0; rots.forEach(r => orient(p.base, r, false).forEach(([x, y]) => { hx = Math.max(hx, Math.abs(x)); hy = Math.max(hy, Math.abs(y)); }));
      return [hx + 0.35, hy + 0.35];
    };
    const exts = pieces.map(ext);
    function pack(TW) {
      let x = 0, y = 0, rowH = 0, w = 0; const slots = [];
      order.forEach(i => { const [hx, hy] = exts[i]; if (x > 0 && x + 2 * hx > TW) { x = 0; y += rowH; rowH = 0; } slots[i] = [x + hx, y + hy]; x += 2 * hx; w = Math.max(w, x); rowH = Math.max(rowH, 2 * hy); });
      return { slots, w, h: y + rowH };
    }
    function layout() {
      const stage = $('#spStage'); if (!stage) return;
      const aw = Math.max(200, stage.clientWidth - 16), top = stage.getBoundingClientRect().top + window.scrollY;
      const ah = Math.max(300, window.innerHeight - top - 20);
      const bw = bx1 - bx0 + 2 * BM, bh = by1 - by0 + 2 * BM, maxW = Math.max(...exts.map(e => 2 * e[0]));
      let best = null;
      const consider = (vert, TW) => {
        const pk = pack(Math.max(TW, maxW)), W = vert ? Math.max(bw, pk.w) : bw + GAP + pk.w, H = vert ? bh + GAP + pk.h : Math.max(bh, pk.h);
        const s = Math.min(aw / W, ah / H); if (!best || s > best.s + 1e-9) best = { s, vert, pk, W, H };
      };
      for (const k of [1, 1.3, 1.6]) consider(true, bw * k);
      for (const k of [0.5, 0.7, 0.9, 1.1, 1.4, 1.8, 2.3, 3]) consider(false, bw * k);
      const { vert, pk, W, H, s } = best, ox = bx0 - BM, oy = by0 - BM;
      // Tray position in board units.
      const tx = vert ? ox + (W - pk.w) / 2 : ox + bw + GAP, ty = vert ? oy + bh + GAP : oy + (H - pk.h) / 2;
      lay = { ox, oy, W, H, s, vert, tray: [tx, ty, pk.w, pk.h], board: [ox, oy, bw, bh] };
      pieces.forEach(p => { p.slot = [tx + pk.slots[p.i][0], ty + pk.slots[p.i][1]]; if (!p.placed) { p.x = p.slot[0]; p.y = p.slot[1]; } });
      return lay;
    }

    function draw() {
      const l = layout(), lvl = pz.lvl;
      const hints = lvl === 'tricky' ? '' : `<g fill="none" stroke="${INK}" stroke-width="${lvl === 'easy' ? .14 : .1}" stroke-dasharray="${lvl === 'easy' ? '.45 .3' : '.3 .35'}" opacity="${lvl === 'easy' ? .75 : .28}" stroke-linejoin="round">${pz.P.map(p => `<polygon points="${ptsAttr(p.poly)}"/>`).join('')}</g>`;
      const silhouette = tricky ? `<polygon points="${ptsAttr(pz.sil)}" fill="${SIL}" stroke="${INK}" stroke-width=".22" stroke-linejoin="round"/>`
        : `<g stroke="${INK}" stroke-width=".36" stroke-linejoin="round" fill="${SIL}">${pz.P.map(p => `<polygon points="${ptsAttr(p.poly)}"/>`).join('')}</g><g fill="${SIL}" stroke="${SIL}" stroke-width=".1">${pz.P.map(p => `<polygon points="${ptsAttr(p.poly)}"/>`).join('')}</g>`;
      $('#spStage').innerHTML = `<svg class="sp-svg" id="spSvg" viewBox="${l.ox} ${l.oy} ${l.W} ${l.H}" width="${Math.floor(l.W * l.s)}" height="${Math.floor(l.H * l.s)}" role="img" aria-label="${pz.name} puzzle: drag the shapes from the tray onto the picture">
        <rect id="spTray" x="${l.tray[0] - .3}" y="${l.tray[1] - .3}" width="${l.tray[2] + .6}" height="${l.tray[3] + .6}" rx=".8" fill="#EEF4FA"/>
        <g id="spSil">${silhouette}${hints}</g><g id="spHintL"></g>
        <g id="spPcs">${pieces.map(p => `<g class="sp-pc${p.placed ? ' placed' : ''}" data-i="${p.i}" role="img" aria-label="${p.t}"><g class="sp-in"><polygon points="${ptsAttr(p.base)}" fill="${p.color}" stroke="${INK}" stroke-width=".1" stroke-linejoin="round"/></g></g>`).join('')}</g><g id="spDeco" pointer-events="none"></g></svg>`;
      pieces.forEach(p => setT(p));
      wire();
    }
    const gOf = p => view.querySelector(`.sp-pc[data-i="${p.i}"]`);
    function setT(p, anim) {
      const g = gOf(p); if (!g) return;
      g.classList.toggle('sp-anim', !!anim);
      g.style.transform = `translate(${r3(p.x)}px,${r3(p.y)}px) rotate(${p.raw}deg) scale(${p.flip ? -1 : 1},1)`;
    }
    function select(p) {
      sel = p; view.querySelectorAll('.sp-pc').forEach(g => g.classList.toggle('sel', !!p && +g.dataset.i === p.i));
    }
    const toUser = e => { const m = $('#spSvg').getScreenCTM().inverse(); return [m.a * e.clientX + m.c * e.clientY + m.e, m.b * e.clientX + m.d * e.clientY + m.f]; };
    const unitPx = () => $('#spSvg').getScreenCTM().a;

    function wire() {
      const svg = $('#spSvg');
      svg.addEventListener('pointerdown', e => {
        const g = e.target.closest && e.target.closest('.sp-pc');
        if (!g || g.classList.contains('placed') || finished || drag) return;
        e.preventDefault();
        const p = pieces[+g.dataset.i], [ux, uy] = toUser(e);
        select(p); drag = { p, id: e.pointerId, dx: p.x - ux, dy: p.y - uy, sx: e.clientX, sy: e.clientY, moved: false };
        g.classList.remove('sp-anim'); g.classList.add('sp-drag'); g.parentNode.appendChild(g);
        try { svg.setPointerCapture(e.pointerId); } catch (x) {}
      });
    }
    function move(e) {
      if (!drag || e.pointerId !== drag.id) return;
      if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) drag.moved = true;
      if (!drag.moved) return;
      const [ux, uy] = toUser(e); drag.p.x = ux + drag.dx; drag.p.y = uy + drag.dy; setT(drag.p);
    }
    function up(e) {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag; drag = null; const g = gOf(d.p); if (g) g.classList.remove('sp-drag');
      if (!d.moved) { tapPiece(d.p); return; }
      drop(d.p);
    }
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    // Redraw only when the screen really changed size (not for a moment, e.g. while a screenshot is taken).
    let rt = 0, size = [innerWidth, innerHeight]; const onResize = () => { clearTimeout(rt); rt = setTimeout(() => {
      if (!$('#spSvg') || drag || (size[0] === innerWidth && size[1] === innerHeight)) return;
      size = [innerWidth, innerHeight]; draw(); if (finished) showDeco(); }, 200); };
    window.addEventListener('resize', onResize);
    canvasCleanup = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); window.removeEventListener('resize', onResize); };

    function tapPiece(p) {
      const I = INFO[p.t]; msg(`${icon2(p.t)} ${cap(p.t)}: ${I[3]}`); say(`${cap(p.t)}! ${I[2]}`); tone([523 + I[1] * 40], 0.08);
    }
    const cap = s => s[0].toUpperCase() + s.slice(1);
    const icon2 = t => ({ triangle: '🔺', square: '🟧', rectangle: '▬', circle: '⚪', semicircle: '◗', parallelogram: '▱', trapezoid: '⏢', hexagon: '⬢' })[t];
    function back(p, wiggle) {
      const g = gOf(p);
      const home = () => { p.x = p.slot[0]; p.y = p.slot[1]; setT(p, true); };
      if (wiggle && g) { const inner = g.querySelector('.sp-in'); inner.classList.remove('sp-wig'); void inner.getBBox(); inner.classList.add('sp-wig'); setTimeout(() => { inner.classList.remove('sp-wig'); home(); }, 420); }
      else home();
    }
    const overBoard = p => p.x > bx0 - 1 && p.x < bx1 + 1 && p.y > by0 - 1 && p.y < by1 + 1;
    function canReach(p, rel) { for (let r = 0; r < 360; r += L.step) for (const f of tricky ? [false, true] : [p.flip]) if (sameSet(orient(p.base, r, f), rel)) return true; return false; }

    function drop(p) {
      const tol = Math.max(0.7, L.tol / unitPx());
      if (tricky) return dropTangram(p, tol);
      const o = orient(p.base, p.rot, p.flip), near = targets.filter(t => !t.filled && t.kind === p.kind).map(t => ({ t, d: Math.hypot(p.x - t.c[0], p.y - t.c[1]) })).sort((a, b) => a.d - b.d);
      const fit = near.find(n => n.d <= tol && sameSet(o, n.t.rel));
      if (fit) return snap(p, fit.t.c, () => { fit.t.filled = p; });
      if (near.some(n => n.d <= tol && canReach(p, n.t.rel))) { turnTip(p); return back(p, true); }
      if (overBoard(p)) { oops(); msg(`🦉 That ${p.t} goes somewhere else.`); say(`That ${p.t} goes somewhere else. Look for its shape!`); return back(p, true); }
      back(p, false);
    }
    function turnTip(p) { oops(); msg(tricky ? '🦉 Good spot! Turn ↻ or flip ⇋ it.' : '🦉 Good spot! Now tap ↻ Turn.'); say(`Good spot! Now turn the ${p.t} so it fits.`); }
    function snap(p, c, mark) {
      p.x = c[0]; p.y = c[1]; p.placed = true; mark(); setT(p, true);
      const g = gOf(p); g.classList.add('placed'); select(null);
      tone([659, 880], 0.08);
      const left = pieces.filter(q => !q.placed).length;
      if (!left) return complete();
      msg(left === 1 ? '🦉 Just one more shape!' : `🦉 Yes! ${left} shapes to go.`);
    }
    function dropTangram(p, tol) {
      if (p.rot % 90 !== 0) { oops(); msg('🦉 Turn it ↻ so its sides line up.'); say('Turn it a little more so its sides line up with the picture.'); return back(p, true); }
      const ors = G.kinds[p.kind], o = orient(p.base, p.rot, p.flip), or = ors.find(e => sameSet(e.o, o));
      const near = e => { const v = e.o[0], out = []; // grid spots for this way round, nearest first
        for (let dx = -3; dx <= 3; dx++) for (let dy = -3; dy <= 3; dy++) {
          const ai = Math.round(p.x + v[0]) + dx, aj = Math.round(p.y + v[1]) + dy, cx = ai - v[0], cy = aj - v[1], d = Math.hypot(cx - p.x, cy - p.y);
          if (d <= tol) out.push({ ai, aj, cx, cy, d });
        }
        return out.sort((a, b) => a.d - b.d); };
      const cands = near(or);
      const need = {}; pieces.forEach(q => { if (!q.placed && q !== p) need[q.kind] = (need[q.kind] || 0) + 1; });
      let fitsSomewhere = false;
      for (const c of cands) {
        const ks = fitCells(G, or, c.ai, c.aj, free); if (!ks) continue;
        fitsSomewhere = true; ks.forEach(k => free[k] = 0);
        if (tSolve(G, free, { ...need })) return snap(p, [c.cx, c.cy], () => { p.cells = ks; });
        ks.forEach(k => free[k] = 1);
      }
      if (fitsSomewhere) { oops(); msg('🦉 Then the others won\'t fit. Try again!'); say('It fits there, but then the other shapes will not fit. Try another spot!'); return back(p, true); }
      // Would another turn fit right here?
      const turned = ors.some(e => e !== or && near(e).some(c => fitCells(G, e, c.ai, c.aj, free)));
      if (turned && overBoard(p)) { turnTip(p); return back(p, true); }
      if (overBoard(p)) { oops(); msg(`🦉 That ${p.t} does not fit there.`); say(`That ${p.t} does not fit there.`); return back(p, true); }
      back(p, false);
    }

    // Where could this piece go? Easy and Medium: the nearest empty outline of the same shape. Tricky: a full solution from here.
    function goal(p) {
      if (!tricky) { const t = targets.filter(t => !t.filled && t.kind === p.kind && canReach(p, t.rel))[0]; if (!t) return null; let rot = 0; while (rot < 360 && !sameSet(orient(p.base, rot, p.flip), t.rel)) rot += L.step; return { c: t.c, poly: t.poly, rot, flip: p.flip }; }
      const need = {}; pieces.forEach(q => { if (!q.placed) need[q.kind] = (need[q.kind] || 0) + 1; });
      const sol = tSolve(G, free.slice(), need); if (!sol) return null;
      const s = sol.find(x => x.k === p.kind), o = s.or.o;
      // The same way round, said for this piece (twin pieces start from different outlines).
      let rot = 0, flip = p.flip;
      search: for (const f of [p.flip, !p.flip]) for (let r = 0; r < 360; r += 90) if (sameSet(orient(p.base, r, f), o)) { rot = r; flip = f; break search; }
      return { c: [s.ai - o[0][0], s.aj - o[0][1]], poly: s.or.rel.map(([x, y]) => [x + s.ai, y + s.aj]), rot, flip };
    }
    $('#spHint').onclick = () => {
      if (finished) return;
      const p = sel && !sel.placed ? sel : pieces.find(q => !q.placed); if (!p) return; select(p);
      const gl = goal(p); if (!gl) return;
      const hl = $('#spHintL'); hl.innerHTML = `<polygon class="sp-flash" points="${ptsAttr(gl.poly)}" fill="#FFC23D" stroke="#B07A00" stroke-width=".2" stroke-linejoin="round"/>`;
      setTimeout(() => { if (hl.isConnected) hl.innerHTML = ''; }, 2600);
      const turnNeeded = !sameSet(orient(p.base, p.rot, p.flip), orient(p.base, gl.rot, gl.flip));
      const t = `The ${p.t} goes in the yellow spot!${turnNeeded ? (tricky && gl.flip !== p.flip ? ' Flip it and turn it to fit.' : ' Turn it to fit.') : ''}`;
      msg(`💡 The ${p.t} goes on the yellow spot.${turnNeeded ? ' Turn it ↻' + (tricky && gl.flip !== p.flip ? ' and flip ⇋' : '') + '.' : ''}`); say(t);
    };
    $('#spRot').onclick = () => {
      if (!sel || sel.placed || finished) { msg('🦉 Tap a shape first, then turn it.'); say('Tap a shape first, then turn it.'); return; }
      sel.raw += L.step; sel.rot = ((sel.raw % 360) + 360) % 360; setT(sel, true); tone([440], 0.05);
    };
    if (tricky) $('#spFlip').onclick = () => {
      if (!sel || sel.placed || finished) { msg('🦉 Tap a shape first, then flip it.'); say('Tap a shape first, then flip it.'); return; }
      sel.flip = !sel.flip; setT(sel, true); tone([392], 0.05);
    };

    // A finished picture: show its details (eyes, windows) and drop the empty tray so the picture and Owl's summary fit.
    function showDeco() {
      const d = $('#spDeco'), svg = $('#spSvg'); if (!d) return; d.innerHTML = pz.deco || '';
      const [ox, oy, bw, bh] = lay.board, t = $('#spTray'); if (t) t.remove();
      svg.setAttribute('viewBox', `${ox} ${oy} ${bw} ${bh}`); svg.setAttribute('width', Math.floor(bw * lay.s)); svg.setAttribute('height', Math.floor(bh * lay.s));
    }
    function complete() {
      finished = true; showDeco(); $('#spSvg').classList.add('sp-fin');
      const first = !R.done[pz.id];
      if (first) { R.done[pz.id] = today(); questTick('math'); dayLog('math'); addStars(2); } else save();
      confetti(); yay();
      const types = Object.keys(pz.count), parts = types.map(t => plural(pz.count[t], t));
      const sum = `You made ${an(pz.name.toLowerCase())}! You used ${listJoin(parts)}!`;
      msg(`🎉 You made ${an(pz.name.toLowerCase())}!${first ? ' +2 ⭐' : ''}`);
      $('#spDone').innerHTML = `<div class="sp-done">
        <p class="sp-owl"><span aria-hidden="true">🦉</span> ${sum}${first ? ' <b>+2 ⭐</b>' : ''}</p>
        <div class="sp-tally" aria-label="Shapes used">${types.map(t => `<span class="sp-chip">${icon(t)}<b>${pz.count[t]}</b> ${pz.count[t] === 1 ? t : INFO[t][0]}</span>`).join('')}</div>
        ${pz.lvl === 'easy' ? '<button class="btn alt sm" id="spAsk">❓ Name the shapes</button><div id="spQ"></div>' : ''}
        <div class="row"><button class="btn leaf" id="spNext">Next puzzle ▶</button><button class="btn alt" id="spAll">All puzzles</button></div></div>`;
      say(sum + (first ? ' You earned 2 stars!' : ''));
      const list = PUZZLES.filter(p => p.lvl === pz.lvl), k = list.indexOf(pz);
      const next = list.slice(k + 1).concat(list.slice(0, k)).find(p => !R.done[p.id]) || list[(k + 1) % list.length];
      $('#spNext').onclick = () => go(puzzleView, next.id);
      $('#spAll').onclick = () => go(gridView, pz.lvl);
      if (pz.lvl === 'easy') $('#spAsk').onclick = askName;
      const panel = $('.sp-done');
      setTimeout(() => { if (panel.isConnected && panel.getBoundingClientRect().top > window.innerHeight - 80) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 600);
    }
    // One question, one right answer: which of these three is the <shape> from the picture?
    function askName() {
      const want = pick(Object.keys(pz.count)), others = shuffle(Object.keys(INFO).filter(t => t !== want)).slice(0, 2), opts = shuffle([want, ...others]);
      const q = `Which one is the ${want}?`;
      $('#spQ').innerHTML = `<p class="sp-qt">${q}</p><div class="sp-qs">${opts.map((t, i) => `<button class="sp-qb" data-t="${t}" aria-label="Shape ${i + 1}">${icon(t, COLS[(i * 3 + 1) % COLS.length])}</button>`).join('')}</div><p class="sp-qm" id="spQm" aria-live="polite"></p>`;
      say(q);
      view.querySelectorAll('.sp-qb').forEach(b => b.onclick = () => {
        const t = b.dataset.t;
        if (t === want) { b.classList.add('right'); view.querySelectorAll('.sp-qb').forEach(x => x.disabled = true); yay(); const w = `Yes! That is the ${want}. ${INFO[want][2]}`; $('#spQm').textContent = w; say(w); }
        else { b.classList.add('wrong'); b.disabled = true; oops(); const w = `That one is ${an(t)}. Try again!`; $('#spQm').textContent = w; say(w); }
      });
    }

    draw();
    if (location.hash === '#selftest') Object.assign(cur, { goal, select: i => select(pieces[i]), toScreen: ([x, y]) => { const m = $('#spSvg').getScreenCTM(); return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f }; } });
  }

  /* --- checks for the tests: pieces are real shapes, never overlap, touch to make one picture, and tangrams fill their outline --- */
  function clip(subject, clipPoly) { // convex polygon intersection (both counter- or clockwise)
    const s = area(clipPoly) > 0 ? 1 : -1; let out = subject;
    for (let i = 0; i < clipPoly.length && out.length; i++) {
      const a = clipPoly[i], b = clipPoly[(i + 1) % clipPoly.length], inp = out; out = [];
      const side = p => s * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) >= -1e-9;
      const hit = (p, q) => { const d1 = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]), d2 = (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]), t = d1 / (d1 - d2); return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; };
      for (let j = 0; j < inp.length; j++) { const p = inp[j], q = inp[(j + 1) % inp.length], ip = side(p), iq = side(q); if (ip) out.push(p); if (ip !== iq) out.push(hit(p, q)); }
    }
    return out.length > 2 ? Math.abs(area(out)) : 0;
  }
  const segDist = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], t = clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1), 0, 1); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); };
  const touch = (A, B) => A.some(p => B.some((q, j) => segDist(p, q, B[(j + 1) % B.length]) < 1e-3)) || B.some(p => A.some((q, j) => segDist(p, q, A[(j + 1) % A.length]) < 1e-3));
  function shapeOk(p) {
    const P = p.poly, n = P.length, side = i => Math.hypot(P[(i + 1) % n][0] - P[i][0], P[(i + 1) % n][1] - P[i][1]);
    const dir = i => [P[(i + 1) % n][0] - P[i][0], P[(i + 1) % n][1] - P[i][1]], cross = (u, v) => u[0] * v[1] - u[1] * v[0], dotp = (u, v) => u[0] * v[0] + u[1] * v[1];
    const par = (i, j) => Math.abs(cross(dir(i), dir(j))) < 1e-6 * side(i) * side(j) + 1e-9, right = i => Math.abs(dotp(dir(i), dir((i + 1) % n))) < 1e-6;
    switch (p.t) {
      case 'triangle': return n === 3;
      case 'square': return n === 4 && [0, 1, 2, 3].every(right) && Math.abs(side(0) - side(1)) < 1e-6;
      case 'rectangle': return n === 4 && [0, 1, 2, 3].every(right) && Math.abs(side(0) - side(1)) > 1e-6;
      case 'parallelogram': return n === 4 && par(0, 2) && par(1, 3) && !right(0);
      case 'trapezoid': return n === 4 && (par(0, 2) !== par(1, 3));
      case 'hexagon': return n === 6 && [1, 2, 3, 4, 5].every(i => Math.abs(side(i) - side(0)) < 1e-3);
      case 'circle': { const c = centroid(P), r = Math.hypot(P[0][0] - c[0], P[0][1] - c[1]); return n >= 24 && P.every(q => Math.abs(Math.hypot(q[0] - c[0], q[1] - c[1]) - r) < 1e-2); }
      case 'semicircle': { const a = P[0], b = P[n - 1], c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], r = Math.hypot(a[0] - c[0], a[1] - c[1]); return n >= 13 && P.every(q => Math.abs(Math.hypot(q[0] - c[0], q[1] - c[1]) - r) < 1e-2); }
    }
    return false;
  }
  function verify() {
    const out = [];
    for (const pz of PUZZLES) {
      const bad = m => out.push(`${pz.id}: ${m}`), n = pz.P.length;
      if (pz.lvl === 'easy' && (n < 3 || n > 5)) bad(`${n} pieces`);
      if (pz.lvl === 'medium' && (n < 5 || n > 7)) bad(`${n} pieces`);
      pz.P.forEach((p, i) => { if (!shapeOk(p)) bad(`piece ${i} is not a real ${p.t}`); });
      let overlap = 0;
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const o = clip(pz.P[i].poly, pz.P[j].poly); if (o > 1e-4) bad(`pieces ${i} and ${j} overlap by ${o.toFixed(4)}`); overlap += o; }
      // One picture: every piece touches the rest.
      const seen = new Set([0]), stack = [0];
      while (stack.length) { const i = stack.pop(); for (let j = 0; j < n; j++) if (!seen.has(j) && touch(pz.P[i].poly, pz.P[j].poly)) { seen.add(j); stack.push(j); } }
      if (seen.size !== n) bad('pieces do not all join up');
      const sum = pz.P.reduce((a, p) => a + p.area, 0);
      if (pz.sil) {
        const ar = pz.P.map(p => p.area).sort((a, b) => a - b).join(',');
        if (ar !== '2,2,4,4,4,8,8') bad('not the 7 tangram pieces: ' + ar);
        if (Math.abs(Math.abs(area(pz.sil)) - sum) > 1e-6) bad(`outline area ${area(pz.sil)} but pieces cover ${sum}`);
        const G = grid(pz), cover = new Uint8Array(G.sil.length);
        pz.P.forEach(p => G.cellsOf(p.poly, 0, 0).forEach(([i, j, q]) => { const k = gIdx(G, i, j, q); if (k < 0 || !G.sil[k]) bad('a piece goes outside the outline'); else cover[k]++; }));
        for (let k = 0; k < cover.length; k++) if (G.sil[k] !== (cover[k] ? 1 : 0) || cover[k] > 1) { bad('outline and pieces do not match exactly'); break; }
      }
      // Fine raster: points inside the silhouette are covered exactly once.
      const [x0, y0, x1, y1] = pz.box, h = 0.1; let multi = 0, hits = 0;
      for (let y = y0 + h / 2 + 0.0137; y < y1; y += h) for (let x = x0 + h / 2 + 0.0071; x < x1; x += h) {
        const c = pz.P.reduce((a, p) => a + (inside([x, y], p.poly) ? 1 : 0), 0);
        if (c > 1) multi++; if (c) hits++;
        if (pz.sil && !!c !== inside([x, y], pz.sil)) multi++;
      }
      if (multi > 2) bad(`${multi} raster points covered twice or outside the outline`);
      if (Math.abs(hits * h * h - sum) > 0.03 * sum + 0.2) bad(`raster area ${(hits * h * h).toFixed(2)} vs ${sum.toFixed(2)}`);
    }
    return out;
  }

  if (location.hash === '#selftest') window.__shapes = { PUZZLES, LEVELS, INFO, verify, grid, tSolve, open: id => go(puzzleView, id), home: lvl => go(gridView, lvl), get cur() { return cur; }, get state() { return rec(); } };
  return f => { from = f === 'math' ? 'math' : 'art'; gridView(); };
}/*}lazy*/, ['__shapes']);
