/* ---------- art11: real drawing — real animals, people & bodies, portraits & faces ---------- */
// Uses the helpers from art.js (ac, ae, al, ap, guide, stroke, paint, atext).
// These lessons teach the way real artists work: light construction shapes, then a contour around them,
// then details, texture and shading. Shapes are kept as point lists, so an outline can be the union of
// several shapes (head + body + legs become one smooth animal), and a shape behind can stop where a front shape begins.
ART_LATER.push(/*lazy{*/() => {
  const f1 = n => +n.toFixed(1), DEG = Math.PI / 180;
  const P = 'Paper, a pencil, an eraser and crayons';
  const PS = 'Paper, a soft pencil, an eraser and colored pencils';
  // Colour that soaks in like a marker; the group blends as one, so overlapping shapes do not get darker.
  const T = (c, s) => `<g style="mix-blend-mode:multiply"><g class="pt" style="fill:${c}">${s}</g></g>`;
  // Colour layers: inside one blended group, later layers cover earlier ones, and the lines below stay visible.
  const CL = (...layers) => `<g style="mix-blend-mode:multiply">${layers.map(([c, ...ss]) => `<g class="pt" style="fill:${c}">${ss.map(s => typeof s === 'string' ? s : ap(s.d)).join('')}</g>`).join('')}</g>`;
  const W = (s, w) => s.replace(/\/>/g, ` style="stroke-width:${w}"/>`);
  const pen = (c, s, w) => stroke(c, w ? W(s, w) : s);
  const thin = (s, w = 1.6) => W(s, w);
  const D = pts => pts.map((p, i) => (i ? 'L' : 'M') + f1(p[0]) + ' ' + f1(p[1])).join('');
  const mk = (pts, closed, d) => ({ pts, closed, d: d || D(pts) + (closed ? 'Z' : '') });

  /* ---- shapes ---- */
  const E = (cx, cy, rx, ry = rx, rot = 0) => {
    const n = Math.max(32, Math.round((rx + ry) * 1.3)), c = Math.cos(rot * DEG), s = Math.sin(rot * DEG), pts = [];
    const at = t => { const x = rx * Math.cos(t), y = ry * Math.sin(t); return [cx + x * c - y * s, cy + x * s + y * c]; };
    for (let i = 0; i < n; i++) pts.push(at(i / n * 2 * Math.PI));
    const a = at(Math.PI), b = at(0);
    return mk(pts, true, `M${f1(a[0])} ${f1(a[1])}A${rx} ${ry} ${rot} 1 0 ${f1(b[0])} ${f1(b[1])}A${rx} ${ry} ${rot} 1 0 ${f1(a[0])} ${f1(a[1])}Z`);
  };
  // A smooth curve through points (Catmull-Rom). A point with a third value of 1 is a sharp corner.
  const cr = (q, closed = false) => {
    const n = q.length, g = i => closed ? q[(i + n) % n] : q[Math.max(0, Math.min(n - 1, i))];
    let d = `M${f1(q[0][0])} ${f1(q[0][1])}`; const pts = [];
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
      const c1 = p1[2] ? [p1[0], p1[1]] : [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = p2[2] ? [p2[0], p2[1]] : [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
      const k = Math.max(3, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 2.2));
      for (let j = 0; j < k; j++) {
        const t = j / k, m = 1 - t;
        pts.push([m * m * m * p1[0] + 3 * m * m * t * c1[0] + 3 * m * t * t * c2[0] + t * t * t * p2[0], m * m * m * p1[1] + 3 * m * m * t * c1[1] + 3 * m * t * t * c2[1] + t * t * t * p2[1]]);
      }
    }
    if (!closed) pts.push([q[n - 1][0], q[n - 1][1]]);
    return mk(pts, closed, d + (closed ? 'Z' : ''));
  };
  // A soft strip along a curve that goes from w0 wide to w1 wide, with round ends (legs, necks, tails, trunks).
  const band = (q, w0, w1 = w0) => {
    const c = cr(q).pts, n = c.length, L = [], R = [];
    for (let i = 0; i < n; i++) {
      const a = c[Math.max(0, i - 1)], b = c[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * i / (n - 1)) / 2;
      L.push([c[i][0] - dy / l * w, c[i][1] + dx / l * w]); R.push([c[i][0] + dy / l * w, c[i][1] - dx / l * w]);
    }
    const cap = (ctr, w, a0) => { const o = []; for (let k = 1; k < 8; k++) { const t = a0 - k * Math.PI / 8; o.push([ctr[0] + w * Math.cos(t), ctr[1] + w * Math.sin(t)]); } return o; };
    const e = c[n - 1], s = c[0];
    const pts = [...L, ...cap(e, w1 / 2, Math.atan2(L[n - 1][1] - e[1], L[n - 1][0] - e[0])), ...R.slice().reverse(), ...cap(s, w0 / 2, Math.atan2(R[0][1] - s[1], R[0][0] - s[0]))];
    return mk(pts, true);
  };
  const inside = (p, s) => {
    let c = false; const a = s.pts;
    for (let i = 0, j = a.length - 1; i < a.length; j = i++)
      if ((a[i][1] > p[1]) !== (a[j][1] > p[1]) && p[0] < (a[j][0] - a[i][0]) * (p[1] - a[i][1]) / (a[j][1] - a[i][1]) + a[i][0]) c = !c;
    return c;
  };
  // The parts of a shape's outline that are not hidden, as path data.
  const runs = (s, hid) => {
    const a = s.pts, n = a.length, h = a.map(hid);
    if (!h.some(Boolean)) return s.d;
    const edge = (v, x) => { let lo = v, hi = x; for (let k = 0; k < 6; k++) { const m = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2]; if (hid(m)) hi = m; else lo = m; } return lo; };
    let out = '', start = 0;
    if (s.closed) start = h.indexOf(true);
    const m = s.closed ? n : n;
    let run = [];
    const flush = () => { if (run.length > 1) out += D(run); run = []; };
    for (let k = 0; k <= m; k++) {
      const i = s.closed ? (start + k) % n : k;
      if (!s.closed && k === n) { flush(); break; }
      if (!h[i]) {
        if (!run.length && k > 0) { const pi = s.closed ? (i - 1 + n) % n : i - 1; run.push(edge(a[i], a[pi])); }
        run.push(a[i]);
      } else if (run.length) { const pi = s.closed ? (i - 1 + n) % n : i - 1; run.push(edge(a[pi], a[i])); flush(); }
    }
    flush();
    return out;
  };
  const isIn = (p, fronts) => fronts.some(f => f.closed && inside(p, f));
  // Outline of shapes joined into one (inner overlaps vanish), with anything inside `fronts` hidden too.
  const uni = (ss, fronts = []) => ap(ss.map((s, i) => runs(s, p => isIn(p, fronts) || ss.some((f, j) => j !== i && f.closed && inside(p, f)))).join(''));
  const cut = (s, ...fronts) => ap(runs(s, p => isIn(p, fronts)));
  const o = (...ss) => ss.map(s => ap(s.d)).join('');
  const fil = (c, ...ss) => T(c, ss.map(s => ap(s.d)).join(''));
  const ring = (c, outer, ...holes) => `<g style="mix-blend-mode:multiply"><g class="pt" style="fill:${c};fill-rule:evenodd"><path d="${outer.d}${holes.map(h => h.d).join('')}"/></g></g>`;
  const sol = (c, ...ss) => paint(c, ss.map(s => ap(s.d)).join(''));
  // Pencil hatching: parallel lines inside a shape.
  const hatch = (s, ang, gap, w = 1.3, c = '#6F7491') => {
    const a = s.pts, cs = Math.cos(ang * DEG), sn = Math.sin(ang * DEG), off = p => -p[0] * sn + p[1] * cs, al_ = p => p[0] * cs + p[1] * sn;
    const os = a.map(off), lo = Math.min(...os), hi = Math.max(...os); let d = '';
    for (let v = lo + gap / 2; v < hi; v += gap) {
      const xs = [];
      for (let i = 0, j = a.length - 1; i < a.length; j = i++) {
        const oi = os[i], oj = os[j]; if ((oi > v) === (oj > v)) continue;
        const t = (v - oj) / (oi - oj); xs.push([a[j][0] + (a[i][0] - a[j][0]) * t, a[j][1] + (a[i][1] - a[j][1]) * t]);
      }
      xs.sort((p, q) => al_(p) - al_(q));
      for (let k = 0; k + 1 < xs.length; k += 2) d += D([xs[k], xs[k + 1]]);
    }
    return d ? pen(c, `<path d="${d}" style="stroke-width:${w}"/>`) : '';
  };
  // Short fur or feather strokes along part of an outline (from fraction a to b), pointing out (len > 0) or in.
  const fur = (s, a, b, n, len, tilt = 0, w = 1.5) => {
    const q = s.pts, N = q.length; let d = '';
    for (let k = 0; k < n; k++) {
      const i = Math.round((a + (b - a) * (n > 1 ? k / (n - 1) : 0.5)) * (N - 1)) % N, p = q[i], u = q[(i + 1) % N], v = q[(i - 1 + N) % N];
      let nx = -(u[1] - v[1]), ny = u[0] - v[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
      const c = Math.cos(tilt * DEG), sn = Math.sin(tilt * DEG), rx = nx * c - ny * sn, ry = nx * sn + ny * c;
      d += D([[p[0] - rx * len * 0.15, p[1] - ry * len * 0.15], [p[0] + rx * len, p[1] + ry * len]]);
    }
    return `<path d="${d}" style="stroke-width:${w}"/>`;
  };
  // A list of short strokes, each [x, y, dx, dy].
  const ticks = (list, w = 1.5) => `<path d="${list.map(([x, y, dx, dy]) => D([[x, y], [x + dx, y + dy]])).join('')}" style="stroke-width:${w}"/>`;
  // A pointed stripe or flame shape from (x1,y1) to a sharp tip (x2,y2), w wide at the base.
  const spike = (x1, y1, x2, y2, w, bend = 0) => {
    const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l, mx = (x1 + x2) / 2 + nx * bend, my = (y1 + y2) / 2 + ny * bend;
    return cr([[x1 + nx * w / 2, y1 + ny * w / 2], [mx + nx * w / 4, my + ny * w / 4], [x2, y2, 1], [mx - nx * w / 4, my - ny * w / 4], [x1 - nx * w / 2, y1 - ny * w / 2]], true);
  };
  const eye = (x, y, r, c = '#22305A') => T(c, ac(x, y, r)) + ac(x, y, r) + paint('#fff', ac(f1(x - r * 0.35), f1(y - r * 0.35), f1(r * 0.35)));
  const L = (id, cat, level, title, ico, need, tip, steps, extra = {}) => ({ id, cat, level, title, ico, need, tip, steps, ...extra });

  ART_CATS.push(
    { id: 'realanimals', name: 'Real Animals', ico: '🦁', blurb: 'Draw animals the way real artists do: shapes, outline, fur and shading' },
    { id: 'figures', name: 'People & Bodies', ico: '🏃', blurb: 'Bodies, poses, hands, feet and clothes' },
    { id: 'portraits', name: 'Portraits & Faces', ico: '🧑‍🎨', blurb: 'Eyes, noses, hair, feelings and real portraits' }
  );

  /* =================================================================== Real Animals */
  const RA = [];

  // ---- Wild rabbit (sitting, facing left)
  {
    const head = E(66, 92, 24, 20, -12), body = E(118, 138, 46, 38), neck = E(86, 110, 20, 22), hip = E(140, 150, 30, 28);
    const paw = E(82, 177, 11, 6), foot = E(126, 178, 28, 7, 0), fleg = band([[92, 132], [88, 174]], 13, 10);
    const ear1 = cr([[70, 76], [76, 46], [92, 26], [98, 32], [90, 60], [84, 78]], true), ear2 = cr([[60, 76], [58, 46], [66, 26], [74, 30], [72, 58], [72, 76]], true);
    const tail = cr([[156, 150], [162, 140], [172, 142], [176, 152], [170, 162], [158, 160]], true);
    const all = [head, body, neck, hip, paw, foot, fleg];
    RA.push(L('ra-rabbit', 'realanimals', 1, 'A wild rabbit', '🐇', P, 'Real artists start with soft, light shapes. Press gently, then make the outline darker.', [
      ['Draw a light circle for the head and a big light oval for the body.', guide(o(head, body))],
      ['Draw one smooth outline around both shapes. Add a front leg and a long back foot.', uni(all)],
      ['Draw two long ears lying back from the top of the head.', uni([ear1], [head]) + cut(ear2, ear1, head) + thin(ap('M77 70 Q84 48 92 32'))],
      ['Draw a big dark eye, a little nose and whiskers.', eye(60, 88, 5) + ap('M44 98 l5 2 l-2 5') + thin(ap('M47 100 L22 96 M47 102 L24 108 M48 101 L30 88'), 1.2)],
      ['Draw a round puffy tail. Add little fur lines on the back and chest.', cut(tail, body, hip) + thin(fur(body, 0.62, 0.86, 9, 6) + fur(neck, 0.18, 0.4, 5, 5) + ap('M118 140 Q132 128 152 136'))],
      ['Erase the guides. Color it brown, with a white tail. Darken under the belly.', fil('#C99A6B', ...all, ear1, ear2) + fil('#E8A0A8', cr([[76, 68], [82, 46], [91, 34], [86, 60]], true)) + sol('#FFFFFF', tail) + cut(tail, body, hip) + fil('#BCB3C4', E(116, 170, 22, 5)), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Cat curled up asleep
  {
    const head = E(66, 112, 27, 23), body = E(110, 122, 62, 42), ear1 = cr([[44, 100], [40, 74, 1], [62, 90]], true), ear2 = cr([[70, 89], [88, 74, 1], [90, 98]], true);
    const tail = band([[150, 146], [150, 160], [120, 168], [80, 162], [52, 148]], 18, 11);
    RA.push(L('ra-catnap', 'realanimals', 1, 'A cat curled up asleep', '🐈', P, 'A sleeping cat is like a round bun. Draw the front things first, then the body behind.', [
      ['Draw a big light oval for the body, and a light circle in front for the head.', guide(o(body, head))],
      ['Draw the head outline with two pointy ears on top.', uni([head, ear1, ear2])],
      ['Draw the fluffy tail wrapping round the front, like a scarf.', cut(tail, head)],
      ['Draw the body outline behind the head and tail.', cut(body, head, tail, ear2)],
      ['Draw closed sleepy eyes, a nose, a mouth and whiskers.', ap('M52 112 q6 5 12 0 M72 112 q6 5 12 0') + ap('M65 120 l3 3 l3 -3 z') + ap('M68 123 v3') + thin(ap('M58 124 L34 122 M58 127 L36 132 M78 124 L98 120'), 1.2)],
      ['Erase the guides. Color it ginger and draw tabby stripes on the back and tail.', fil('#F0A94E', head, body, ear1, ear2, tail) + pen('#B5652A', ap('M110 82 q4 10 0 18 M130 84 q4 10 -2 18 M148 92 q2 10 -4 16 M92 84 q4 8 2 14 M150 140 q-6 10 -2 20 M126 150 q-4 8 0 16 M100 148 q-4 8 0 16 M60 96 q4 4 4 8 M72 94 q2 4 0 8'), 2.4), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Emperor penguin
  {
    const head = E(96, 48, 20, 19), body = E(100, 120, 38, 60), neck = E(98, 72, 20, 18);
    const beak = cr([[112, 46], [134, 56, 1], [112, 54]], true);
    const fl1 = band([[66, 92], [58, 120], [56, 142]], 12, 6), fl2 = band([[134, 92], [142, 120], [146, 140]], 12, 6);
    const belly = cr([[96, 66], [112, 74], [126, 110], [124, 158], [100, 176], [78, 160], [74, 110], [84, 74]], true);
    const feet = [E(86, 180, 12, 5), E(114, 180, 12, 5)];
    RA.push(L('ra-penguin', 'realanimals', 1, 'An emperor penguin', '🐧', P, 'Emperor penguins are as tall as a 5-year-old! They keep their eggs warm on their feet.', [
      ['Draw a light circle for the head and a tall light egg shape for the body.', guide(o(head, body))],
      ['Draw a smooth outline around them, like a bowling pin.', uni([head, neck, body])],
      ['Draw a flipper on each side, hanging down from the shoulders.', cut(fl1, body) + cut(fl2, body)],
      ['Draw the long pointy beak and the curved line of the white tummy.', o(beak) + ap(belly.d)],
      ['Draw the eye and two flat orange feet.', eye(102, 44, 2.6) + o(...feet)],
      ['Color the back black, the ear patch yellow, and the beak orange. Leave the tummy white.', fil('#3A3F5C', head, neck, body, fl1, fl2) + sol('#FFFFFF', belly) + ap(belly.d) + sol('#FFC23D', cr([[100, 58], [114, 60], [116, 72], [104, 70]], true)) + fil('#FF8A2B', beak, ...feet) + paint('#fff', ac(103, 43, 1.2))]
    ], { brush: 'pencil' }));
  }

  // ---- Barn owl
  {
    const head = E(100, 62, 40, 34), body = E(100, 125, 46, 58), disc = cr([[100, 46, 1], [116, 34], [134, 44], [132, 70], [116, 88], [100, 96, 1], [84, 88], [68, 70], [66, 44], [84, 34]], true);
    const w1 = cr([[58, 86], [52, 124], [62, 168], [78, 182, 1], [74, 140], [64, 104]], true), w2 = cr([[142, 86], [148, 124], [138, 168], [122, 182, 1], [126, 140], [136, 104]], true);
    RA.push(L('ra-owl', 'realanimals', 1, 'A barn owl', '🦉', P, 'Barn owls have a face shaped like a heart. It works like a dish to catch sounds.', [
      ['Draw a light circle for the head and a big light oval body under it.', guide(o(head, body))],
      ['Draw one outline around the head and body.', uni([head, body])],
      ['Draw a heart shape for the face. Add two dark eyes and a small beak.', ap(disc.d) + eye(86, 64, 6) + eye(114, 64, 6) + ap('M100 70 q-4 8 0 14 q4 -6 0 -14')],
      ['Draw a folded wing on each side of the body.', o(w1, w2)],
      ['Draw feather lines on the wings and little dots on the tummy. Add feet on a branch.', thin(ap('M60 110 q8 6 14 4 M58 128 q8 6 16 4 M60 146 q8 6 16 4 M140 110 q-8 6 -14 4 M142 128 q-8 6 -16 4 M140 146 q-8 6 -16 4')) + [[92, 120], [106, 128], [96, 140], [110, 148], [90, 156], [104, 162]].map(([x, y]) => ac(x, y, 1.4)).join('') + ap('M86 180 v8 M92 180 v8 M108 180 v8 M114 180 v8') + ap('M30 190 Q100 184 172 192')],
      ['Erase the guides. Color the head and wings golden. Keep the face and tummy white.', fil('#E3B26B', head, w1, w2) + sol('#FFFDF7', disc) + ap(disc.d) + eye(86, 64, 6) + eye(114, 64, 6) + ap('M100 70 q-4 8 0 14 q4 -6 0 -14') + fil('#8B5A2B', cr([[30, 190], [100, 184], [172, 192], [170, 198], [30, 196]], true)), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Dog sitting (side view, facing left)
  {
    const head = E(62, 56, 22, 20), muz = E(42, 66, 17, 11, 8), chest = E(80, 112, 26, 34), hip = E(128, 148, 34, 32);
    const neck = band([[62, 62], [74, 92]], 34, 40), back = band([[86, 96], [124, 140]], 36, 40);
    const leg1 = band([[72, 128], [70, 182]], 14, 11), leg2 = band([[90, 130], [92, 182]], 14, 11), hpaw = E(110, 182, 22, 7);
    const ear = cr([[58, 40], [76, 38], [80, 62], [74, 80], [66, 72], [62, 52]], true);
    const tail = band([[160, 166], [176, 176], [190, 174]], 10, 5);
    const all = [head, muz, neck, chest, back, hip, leg1, leg2, hpaw];
    RA.push(L('ra-dog', 'realanimals', 2, 'A dog sitting', '🐕', P, 'Draw through the shapes, even the hidden parts. Then you can erase what you do not need.', [
      ['Draw three light circles: a small one for the head, one for the chest, a big one for the hip.', guide(o(head, chest, hip) + ap('M62 56 Q90 90 128 148'))],
      ['Add a box-shaped muzzle on the front of the head.', guide(o(muz))],
      ['Draw two straight front legs and the big back paw. They are in front, so draw them first.', uni([leg1, leg2, hpaw])],
      ['Draw one smooth outline around the head, neck, chest and hip, behind the legs.', uni([head, muz, neck, chest, back, hip], [leg1, leg2, hpaw])],
      ['Draw a floppy ear, an eye, the nose and the mouth.', ap(ear.d) + eye(50, 52, 3.4) + ap('M24 60 q4 -5 8 -1 q0 6 -8 1z') + ap('M28 72 Q38 76 48 70')],
      ['Draw the tail on the ground. Add fur lines on the chest and the hip.', cut(tail, hip) + thin(fur(chest, 0.32, 0.52, 6, -6) + ap('M110 130 Q128 120 150 136') + ap('M76 182 h-6 M98 182 h-6'))],
      ['Erase the guides. Color your dog golden. Shade under the chin and behind the leg.', fil('#E0B074', ...all, ear, tail) + fil('#C08A4E', ear) + fil('#BCB3C4', E(70, 90, 12, 7, 30)), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Red fox (standing, side view, facing left)
  {
    const body = E(104, 112, 44, 22), head = E(50, 82, 17, 15), snout = cr([[40, 80], [18, 92, 1], [44, 96]], true);
    const chest = E(68, 106, 18, 20), hip = E(140, 112, 18, 20);
    const ear1 = cr([[42, 72], [44, 52, 1], [56, 70]], true), ear2 = cr([[52, 70], [60, 52, 1], [64, 74]], true);
    const l1 = band([[66, 118], [64, 150], [62, 172]], 11, 7), l2 = band([[78, 118], [82, 150], [84, 172]], 10, 7), l3 = band([[132, 120], [126, 146], [130, 172]], 13, 7), l4 = band([[146, 120], [150, 148], [152, 172]], 11, 7);
    const tail = cr([[152, 102], [176, 112], [194, 136], [184, 150, 1], [166, 136], [148, 124]], true);
    const near = [body, head, snout, chest, hip, l2, l4];
    RA.push(L('ra-fox', 'realanimals', 2, 'A red fox', '🦊', P, 'A fox has a long body, thin legs and a giant bushy tail. It uses the tail as a blanket!', [
      ['Draw light shapes: a long oval body, a circle at each end, and a small head circle.', guide(o(body, chest, hip, head) + ap('M50 82 L68 106'))],
      ['Draw the head with a long pointy snout and two tall ears.', uni([head, snout, ear1, ear2])],
      ['Draw the back, the tummy and the chest around the guide shapes.', uni([body, chest, hip], [head, snout, ear2])],
      ['Draw four thin legs. The two far legs peek out behind.', uni([l2, l4], [body, chest, hip]) + uni([l1, l3], [body, chest, hip, l2, l4])],
      ['Draw a big bushy tail. Add an eye, a nose and a white tail tip.', cut(tail, hip, body) + eye(46, 80, 2.6) + ac(19, 92, 2) + thin(ap('M170 126 q8 6 14 22'))],
      ['Erase the guides. Color it orange. Make the socks black and the chin and tail tip white.', fil('#F08A3C', ...near, l1, l3, tail, ear1, ear2) + fil('#3A3F5C', E(63, 168, 4, 6), E(84, 168, 4, 6), E(130, 168, 4, 6), E(152, 168, 4, 6), ear1) + sol('#FFFFFF', cr([[184, 150], [176, 136], [188, 130], [194, 136]], true)) + sol('#FFFFFF', cr([[22, 94], [44, 96], [60, 104], [52, 112], [40, 100]], true)) + fil('#BCB3C4', E(104, 128, 30, 5)), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // A little repeatable "random" so patches and fur look natural but always the same.
  const rnd = (k => () => (k = (k * 16807) % 2147483647) / 2147483647)(7);

  // ---- Deer (a stag, side view, facing left)
  {
    const body = E(114, 100, 40, 22), chest = E(82, 100, 18, 21), hip = E(146, 98, 17, 21), head = E(54, 48, 12, 10);
    const snout = band([[52, 52], [34, 62]], 15, 9), neck = band([[80, 96], [58, 54]], 24, 15);
    const ear = cr([[60, 42], [76, 30], [82, 34, 1], [70, 46]], true);
    const l1 = band([[86, 110], [84, 150], [86, 184]], 10, 5), l2 = band([[74, 112], [70, 150], [68, 184]], 9, 5), l3 = band([[148, 108], [144, 136], [152, 160], [150, 184]], 14, 5), l4 = band([[136, 110], [130, 138], [136, 160], [132, 184]], 12, 5);
    const tail = E(162, 88, 4, 8, 20), front = [body, chest, hip, neck];
    const antler = 'M52 40 Q46 22 54 6 M49 26 L38 18 M51 15 L44 6 M58 40 Q64 22 72 12 M64 24 L74 26';
    RA.push(L('ra-deer', 'realanimals', 2, 'A deer with antlers', '🦌', P, 'Deer legs are thin, with knobby knees. The back leg bends backward, like a zig-zag.', [
      ['Draw light shapes: an oval body, a circle at each end, a small head, and a line for the neck.', guide(o(body, chest, hip, head) + ap('M58 52 L82 96'))],
      ['Draw the head with a long nose and a big ear.', uni([head, snout, ear])],
      ['Draw the neck going down into the chest, the back and the round tummy.', uni(front, [head, snout])],
      ['Draw the near legs, long and thin. The back leg bends like a zig-zag.', uni([l1, l3], front)],
      ['Draw the two far legs peeking out behind. Add a short tail.', uni([l2, l4], [...front, l1, l3]) + cut(tail, hip)],
      ['Draw the branching antlers on top of the head.', W(ap(antler), 4)],
      ['Draw an eye, a black nose and little hooves. Add fur lines on the chest.', eye(50, 46, 2.4) + T('#22305A', ac(33, 62, 3)) + ap('M82 184 h8 M64 184 h8 M146 184 h8 M128 184 h8') + thin(fur(chest, 0.3, 0.5, 6, -5) + fur(neck, 0.05, 0.3, 5, 4))],
      ['Erase the guides. Color it brown, with a white throat, belly and tail.', CL(['#A07A52', l2, l4], ['#C08A55', ...front, head, snout, ear, l1, l3, tail]) + pen('#8B5A2B', ap(antler), 4) + sol('#FFFFFF', E(160, 92, 3, 6, 20)) + sol('#FFF6EA', cr([[42, 62], [58, 60], [66, 76], [56, 70]], true)) + fil('#BCB3C4', E(112, 118, 28, 4)), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Brown bear (walking, facing left)
  {
    const body = E(114, 104, 50, 32), hump = E(90, 84, 24, 20), hip = E(150, 100, 26, 30), head = E(46, 94, 18, 16);
    const snout = band([[40, 98], [22, 104]], 17, 13), neck = band([[52, 96], [80, 90]], 30, 38);
    const ear = E(54, 78, 6), l1 = band([[76, 118], [72, 172]], 26, 22), l2 = band([[96, 122], [100, 168]], 22, 18), l3 = band([[150, 116], [156, 172]], 28, 22), l4 = band([[132, 122], [128, 168]], 22, 18);
    const fa = E(68, 176, 15, 6), fc = E(152, 176, 15, 6), fb = E(100, 172, 12, 5), fd = E(124, 172, 12, 5);
    const near = [body, hump, hip, neck, head, snout, l1, l3, fa, fc];
    RA.push(L('ra-bear', 'realanimals', 2, 'A brown bear', '🐻', P, 'A brown bear has a big hump of muscle on its shoulders. That is how you know it is a grizzly!', [
      ['Draw light shapes: a big oval body, a bump on the shoulders, a round hip and a small head.', guide(o(body, hump, hip, head))],
      ['Draw the head with a short snout and a round ear.', uni([head, snout]) + cut(ear, head)],
      ['Draw the thick near legs, with big flat paws.', uni([l1, l3, fa, fc])],
      ['Draw one outline over the back hump, the bottom and the tummy.', uni([body, hump, hip, neck], [head, snout, l1, l3, fa, fc])],
      ['Draw the far legs peeking out between the near ones.', uni([l2, l4, fb, fd], near)],
      ['Draw an eye, the nose and the mouth. Add claws on the paws.', eye(44, 90, 2.4) + T('#22305A', ae(23, 101, 4, 3)) + ap('M24 110 Q32 112 38 106') + thin(ap('M58 180 l-4 3 M63 181 l-3 4 M68 181 l-2 4 M142 180 l-4 3 M147 181 l-3 4 M152 181 l-2 4'), 1.6)],
      ['Draw lots of short fur strokes along the back and the legs.', thin(fur(hump, 0.6, 0.88, 7, 5, -20) + fur(body, 0.62, 0.86, 9, 5, -20) + fur(hip, 0.7, 0.95, 5, 5, -20) + fur(neck, 0.55, 0.7, 4, 4, -20))],
      ['Erase the guides. Color it brown, darker on the legs. Shade the tummy.', CL(['#86592F', l2, l4, fb, fd], ['#A8743F', ...near, ear]) + hatch(E(114, 128, 36, 8), 60, 4), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Giraffe (side view, facing left)
  {
    const body = E(128, 108, 34, 22), chest = E(104, 106, 17, 20), hip = E(154, 104, 15, 19), head = E(60, 32, 11, 8, -10);
    const neck = band([[104, 100], [86, 66], [66, 36]], 24, 12), muzzle = band([[58, 34], [42, 44]], 13, 9);
    const l1 = band([[106, 120], [104, 158], [106, 190]], 9, 5), l2 = band([[96, 120], [92, 158], [90, 190]], 8, 5), l3 = band([[156, 116], [152, 150], [158, 168], [156, 190]], 12, 5), l4 = band([[146, 118], [140, 150], [146, 168], [142, 190]], 10, 5);
    const tail = band([[166, 98], [172, 132]], 3, 3), ear = cr([[66, 30], [80, 26, 1], [68, 36]], true);
    const front = [body, chest, hip, neck], skin = [...front, head, muzzle];
    const patches = [];
    for (let y = 34; y < 130; y += 11) for (let x = 60 + (y % 22 ? 6 : 0); x < 180; x += 12) {
      const c = [x + (rnd() - 0.5) * 3, y + (rnd() - 0.5) * 3]; if (!isIn(c, front)) continue;
      patches.push(cr(Array.from({ length: 5 }, (_, k) => { const a = k * 2 * Math.PI / 5 + rnd(), r = 4 + rnd() * 1.5; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]; }), true));
    }
    const pin = patches.filter(p => p.pts.every(q => isIn(q, front)));
    RA.push(L('ra-giraffe', 'realanimals', 2, 'A giraffe with real patches', '🦒', P, 'Every giraffe has its own patch pattern, like a fingerprint. No two are the same!', [
      ['Draw light shapes: an oval body with a circle at each end, and a long curved neck line.', guide(o(body, chest, hip, head) + ap('M104 100 Q86 66 64 34'))],
      ['Draw the small head with a long nose, an ear and two little horns.', uni([head, muzzle, ear]) + W(ap('M58 26 L56 14 M64 25 L64 13'), 3) + ac(56, 12, 2.5) + ac(64, 11, 2.5)],
      ['Draw the long neck, thick at the bottom and thin at the top. Join it to the body.', uni(front, [head, muzzle])],
      ['Draw four long thin legs. The far legs peek out behind the near ones.', uni([l1, l3], front) + uni([l2, l4], [...front, l1, l3])],
      ['Draw a thin tail with a tuft, an eye, a nose, and a short mane on the neck.', cut(tail, hip) + W(ap('M172 132 l-3 8 M172 132 l0 9 M172 132 l3 8'), 2) + eye(56, 30, 2) + ac(43, 42, 1.2) + thin(ap('M72 30 L78 36 M76 42 L82 46 M82 54 L88 56 M88 66 L94 66 M94 78 L100 76'), 2)],
      ['Draw the patches: shapes like rounded stones, with thin lines of space between them.', thin(pin.map(p => ap(p.d)).join(''), 2)],
      ['Erase the guides. Color the giraffe yellow and the patches brown. Shade under the tummy.', CL(['#E3B866', l2, l4], ['#F6CF7A', ...skin, l1, l3, ear], ['#B5652A', ...pin]) + fil('#BCB3C4', E(128, 126, 24, 4)), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Horse trotting (Master)
  {
    const body = E(112, 100, 42, 24), chest = E(78, 100, 20, 24), hip = E(146, 96, 22, 25), head = E(54, 46, 11, 10);
    const neck = band([[82, 94], [70, 70], [58, 50]], 36, 20), muzzle = band([[52, 50], [36, 74]], 18, 12);
    const ear = cr([[56, 38], [60, 24, 1], [64, 38]], true);
    const l1 = band([[84, 110], [80, 146], [76, 182]], 15, 8), l2 = band([[70, 112], [72, 148], [80, 180]], 13, 7);
    const l3 = band([[150, 104], [146, 134], [156, 152], [152, 182]], 22, 8), l4 = band([[134, 108], [128, 136], [136, 154], [130, 180]], 18, 7);
    const front = [body, chest, hip, neck], heads = [head, muzzle, ear];
    const mane = cr([[60, 40], [72, 48], [82, 66], [90, 84], [84, 82], [76, 66], [64, 52]], true), tail = cr([[166, 86], [180, 100], [184, 130], [178, 152, 1], [172, 126], [164, 100]], true);
    RA.push(L('ra-horse', 'realanimals', 3, 'A walking horse', '🐎', PS, 'A horse\'s back leg bends like a backward knee. That bump is called the hock!', [
      ['Sketch light shapes: an oval body, a circle for the chest and hip, and a neck line.', guide(o(body, chest, hip) + ap('M80 92 Q70 70 56 48'))],
      ['Add a small circle for the head, and a box shape for the long nose.', guide(o(head) + ap('M50 52 L34 72 L42 78 L60 56'))],
      ['Draw the head over the guides: a long nose, a pointy ear, a big jaw.', uni(heads)],
      ['Draw the strong neck. Draw the back dipping a little, then round over the bottom.', uni(front, heads)],
      ['Draw the near legs, thin with knobby joints. The back leg bends backward at the hock.', uni([l1, l3], front) + ap('M70 182 h12 M146 182 h12')],
      ['Draw the far legs behind. They step a little forward or back.', uni([l2, l4], [...front, l1, l3]) + ap('M74 180 h12 M124 180 h12')],
      ['Draw a flowing mane and tail. Add the eye, nostril and mouth.', cut(mane, ...heads) + cut(tail, hip) + thin(ap('M64 54 Q74 64 78 76 M172 104 Q178 124 176 140')) + eye(50, 46, 2.4) + ac(38, 72, 1.6) + ap('M36 78 q4 2 8 0')],
      ['Erase the guides. Shade the belly, the neck and behind the legs with pencil lines.', hatch(E(110, 116, 32, 7), 50, 3.6) + hatch(E(70, 74, 7, 14, 30), 50, 3.6) + hatch(E(136, 120, 8, 10), 50, 3.6) + thin(ap('M96 96 Q110 88 128 92 M134 90 Q144 80 156 86')), { clear: true }],
      ['Color the horse chestnut brown. Make the mane, tail and far legs darker.', CL(['#8B4F2B', l2, l4], ['#C47A44', ...front, ...heads, l1, l3], ['#4A2E1E', mane, tail]) + sol('#FFFFFF', cr([[42, 56], [46, 54], [40, 72], [37, 70]], true))]
    ], { brush: 'pencil' }));
  }

  // ---- Lion's face (Master)
  {
    const mane = cr(Array.from({ length: 22 }, (_, k) => { const a = k * 2 * Math.PI / 22, r = k % 2 ? 62 : 76; return [100 + r * Math.cos(a) * 0.95, 104 + r * Math.sin(a)]; }), true);
    const face = cr([[100, 56], [124, 62], [134, 88], [128, 118], [116, 136], [100, 142], [84, 136], [72, 118], [66, 88], [76, 62]], true);
    const earL = E(72, 62, 11, 10, -30), earR = E(128, 62, 11, 10, 30);
    const nose = cr([[88, 106], [112, 106], [104, 118, 1], [96, 118, 1]], true), mz1 = E(90, 126, 12, 9), mz2 = E(110, 126, 12, 9), chin = E(100, 138, 9, 6);
    const eyeL = cr([[78, 90, 1], [86, 84], [94, 90, 1], [86, 94]], true), eyeR = cr([[106, 90, 1], [114, 84], [122, 90, 1], [114, 94]], true);
    const strands = Array.from({ length: 26 }, (_, k) => { const a = k * 2 * Math.PI / 26, r1 = 52 + (k % 3) * 3, r2 = r1 + 12; return ap(`M${f1(100 + r1 * Math.cos(a))} ${f1(104 + r1 * Math.sin(a))} Q${f1(100 + (r1 + 8) * Math.cos(a + 0.08))} ${f1(104 + (r1 + 8) * Math.sin(a + 0.08))} ${f1(100 + r2 * Math.cos(a + 0.05))} ${f1(104 + r2 * Math.sin(a + 0.05))}`); }).join('');
    RA.push(L('ra-lion', 'realanimals', 3, "A real lion's face", '🦁', PS, "A lion's eyes, nose and mouth sit close together in the middle. The big mane frames them.", [
      ['Draw a light circle for the face. Draw a line down the middle and a line across for the eyes.', guide(o(E(100, 98, 34, 40)) + ap('M100 52 V146 M62 90 H138'))],
      ['Draw the face shape: wide cheeks, narrowing to the chin.', ap(face.d)],
      ['Draw two round ears on top of the head.', cut(earL, face) + cut(earR, face)],
      ['Draw almond eyes on the eye line, tilted down at the inside corners. Add round pupils.', o(eyeL, eyeR) + T('#22305A', ac(86, 89, 3) + ac(114, 89, 3))],
      ['Draw the wide nose. Draw two lines from the eyes down to the nose.', ap(nose.d) + thin(ap('M94 92 Q92 100 90 106 M106 92 Q108 100 110 106'))],
      ['Draw two round puffs under the nose, and the chin under them. Add whisker dots.', uni([mz1, mz2, chin], [nose]) + [[86, 124], [92, 128], [84, 130], [108, 124], [114, 128], [116, 130]].map(([x, y]) => ac(x, y, 0.9)).join('')],
      ['Draw the big mane around the face, with wavy points.', cut(mane, face, earL, earR)],
      ['Draw flowing hair strokes in the mane, all pointing away from the face.', thin(strands, 1.4)],
      ['Erase the guides. Color the face golden and the mane darker. Shade under the brows.', ring('#C0763A', mane, face) + fil('#EDBE70', face, earL, earR) + fil('#FFF3DC', mz1, mz2, chin) + fil('#C9707A', nose) + fil('#F2A93B', eyeL, eyeR) + T('#22305A', ac(86, 89, 3) + ac(114, 89, 3)) + hatch(cr([[76, 82], [94, 80], [96, 86], [78, 86]], true), 30, 2.5) + hatch(cr([[104, 80], [124, 82], [122, 86], [104, 86]], true), -30, 2.5), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Tiger and its stripes (Master)
  {
    const body = E(110, 110, 46, 24), chest = E(74, 112, 20, 23), hip = E(148, 108, 21, 24), head = E(44, 94, 19, 18);
    const neck = band([[52, 98], [72, 106]], 30, 38), muzzle = E(30, 104, 11, 9), earA = E(44, 76, 7, 6), earB = E(56, 78, 7, 6);
    const l1 = band([[76, 124], [70, 160], [64, 178]], 18, 13), l2 = band([[90, 126], [96, 160], [98, 176]], 15, 11), l3 = band([[150, 120], [144, 146], [156, 178]], 22, 13), l4 = band([[136, 122], [128, 150], [126, 176]], 17, 11);
    const p1 = E(60, 180, 11, 5), p3 = E(158, 180, 11, 5), p2 = E(100, 178, 9, 4), p4 = E(122, 178, 9, 4);
    const tail = band([[166, 104], [184, 116], [190, 146], [180, 160]], 9, 6);
    const front = [body, chest, hip, neck], heads = [head, muzzle], nearL = [l1, l3, p1, p3], all = [...front, ...heads, ...nearL, l2, l4, p2, p4, tail, earA, earB];
    const stripes = [spike(92, 88, 96, 112, 6, 2), spike(106, 86, 108, 114, 7, -2), spike(120, 87, 122, 112, 6, 2), spike(134, 88, 132, 110, 6, -2), spike(146, 86, 140, 104, 6, 2), spike(80, 92, 84, 110, 5, -2), spike(158, 92, 150, 106, 5), spike(100, 132, 102, 120, 5), spike(122, 132, 120, 120, 5),
      spike(62, 140, 80, 142, 5), spike(66, 156, 78, 158, 4), spike(140, 136, 156, 134, 5), spike(146, 152, 158, 154, 4), spike(176, 108, 172, 120, 5), spike(186, 126, 178, 130, 5), spike(188, 142, 180, 144, 5),
      spike(40, 80, 42, 90, 4), spike(48, 80, 46, 90, 4), spike(58, 90, 50, 96, 4), spike(58, 102, 52, 104, 4)];
    RA.push(L('ra-tiger', 'realanimals', 3, 'A tiger and its stripes', '🐅', PS, 'Tiger stripes wrap around the body like ribbons. They are thick on the back and thin at the tips.', [
      ['Sketch light shapes: a long oval body, a circle for the chest and hip, and a circle for the head.', guide(o(body, chest, hip, head))],
      ['Draw the head with a round muzzle and two small round ears.', uni([...heads, earA, earB])],
      ['Draw the near legs, thick and strong, with round paws.', uni(nearL)],
      ['Draw the back, the bottom and the tummy, behind the head and legs.', uni(front, [...heads, ...nearL])],
      ['Draw the far legs behind, and a long tail curving down.', uni([l2, l4, p2, p4], [...front, ...nearL]) + cut(tail, hip)],
      ['Draw the eye, nose and mouth. Add whiskers.', eye(38, 92, 2.4) + T('#22305A', apg('20,98 26,98 23,102')) + ap('M23 102 v4 q-3 4 -6 2 M23 106 q4 4 8 2') + thin(ap('M30 106 L12 102 M30 108 L14 112'), 1.1)],
      ['Draw the stripes like pointy flames: thick at the back, thin at the tip.', stripes.map(s => ap(s.d)).join('')],
      ['Color the tiger orange. Leave the chin and tummy white. Fill the stripes black.', CL(['#C9702E', l2, l4, p2, p4], ['#F08A3C', ...front, ...heads, ...nearL, tail, earA, earB]) + sol('#FFFFFF', cr([[22, 108], [34, 110], [48, 112], [40, 116], [26, 112]], true)) + fil('#22305A', ...stripes)],
      ['Erase the guides. Shade under the tummy and the far legs, so the tiger looks round.', hatch(E(110, 128, 34, 6), 60, 3.4) + hatch(l2, 60, 3.4) + hatch(l4, 60, 3.4), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- African elephant (Master)
  {
    const body = E(120, 98, 48, 38), head = E(62, 80, 24, 26), trunk = band([[46, 92], [38, 126], [42, 160], [52, 170]], 20, 9);
    const ear = cr([[66, 54], [100, 46], [114, 76], [106, 112], [84, 126], [72, 104]], true);
    const l1 = band([[82, 118], [80, 180]], 26, 24), l2 = band([[100, 122], [102, 176]], 22, 21), l3 = band([[152, 116], [152, 180]], 28, 24), l4 = band([[134, 120], [134, 176]], 22, 21);
    const tail = band([[166, 96], [172, 130]], 3, 3), tusk = cr([[48, 108], [36, 120], [28, 122, 1], [40, 112]], true);
    const near = [l1, l3], heads = [head, trunk];
    RA.push(L('ra-elephant', 'realanimals', 3, 'An African elephant', '🐘', PS, 'African elephants have giant ears shaped like a map of Africa. They flap them to stay cool.', [
      ['Sketch light shapes: a big round body, a smaller head circle, and a curved trunk line.', guide(o(body, head) + ap('M46 92 Q36 130 50 168'))],
      ['Draw the big flappy ear first. It is in front of the head and shoulder.', ap(ear.d) + thin(ap('M80 70 Q88 86 86 104 M92 62 Q100 84 96 108'))],
      ['Draw the head and the trunk, wide at the top and thin at the end.', uni(heads, [ear])],
      ['Draw the near legs like thick tree trunks.', uni(near)],
      ['Draw the back, the bottom and the tummy, behind the ear and legs.', uni([body], [ear, head, ...near])],
      ['Draw the far legs peeking out behind, and a thin tail.', uni([l2, l4], [body, ...near]) + cut(tail, body) + W(ap('M172 130 l-2 7 M172 130 l2 7'), 2)],
      ['Draw the tusk, an eye, and toenails on the feet.', ap(tusk.d) + eye(56, 78, 2.4) + thin(ap('M70 180 q4 -4 8 0 M82 180 q4 -4 8 0 M142 180 q4 -4 8 0 M154 180 q4 -4 8 0'), 1.8)],
      ['Draw wrinkles: little lines across the trunk and the legs.', thin(ticks([[38, 112, 10, 2], [37, 122, 10, 1], [37, 132, 9, 1], [38, 142, 8, 0], [40, 152, 7, 0], [72, 150, 16, 0], [74, 160, 14, 0], [144, 150, 16, 0], [144, 160, 16, 0]]), 1.4)],
      ['Erase the guides. Color it gray. Shade the tummy, the far legs, and under the ear.', CL(['#8E8FA3', l2, l4], ['#A9AABA', body, ...heads, l1, l3, tail], ['#BEBFCE', ear]) + sol('#FFFDF5', tusk) + ap(tusk.d) + hatch(E(122, 126, 34, 7), 55, 3.4) + hatch(cr([[114, 110], [118, 84], [126, 100], [120, 120]], true), 55, 3.2), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Eagle in flight (Master)
  {
    const body = E(100, 104, 15, 32), head = E(100, 66, 11, 11);
    const wl = [[90, 84], [64, 66], [34, 58], [10, 62, 1], [28, 70], [8, 78, 1], [28, 82], [12, 94, 1], [34, 92], [22, 106, 1], [46, 100], [42, 112, 1], [64, 104], [90, 112]];
    const wingL = cr(wl, true), wingR = cr(wl.map(([x, y, c]) => [200 - x, y, c]), true);
    const tipL = [[10, 62], [28, 70], [8, 78], [28, 82], [12, 94], [34, 92], [22, 106], [40, 100], [38, 80]];
    const tailF = cr([[92, 128], [82, 158], [92, 162], [100, 164], [108, 162], [118, 158], [108, 128]], true);
    const beak = cr([[96, 72], [104, 72], [102, 82, 1], [98, 78]], true);
    const tailLines = thin(ap('M92 140 L90 158 M100 140 V162 M108 140 L110 158'), 1.6);
    RA.push(L('ra-eagle', 'realanimals', 3, 'An eagle in flight', '🦅', PS, 'The long feathers at the wing tips spread out like fingers. That helps the eagle glide.', [
      ['Draw a light oval body, a circle for the head, and a long line across for the wings.', guide(o(body, head) + ap('M10 70 Q100 58 190 70'))],
      ['Draw the body and the round head.', uni([body, head])],
      ['Draw the left wing, ending in long finger feathers.', cut(wingL, body)],
      ['Draw the right wing to match, like a mirror.', cut(wingR, body)],
      ['Draw the fan-shaped tail and the hooked beak. Add two fierce eyes.', cut(tailF, body) + ap(beak.d) + eye(94, 64, 2) + eye(106, 64, 2)],
      ['Draw rows of feathers on the wings, like overlapping scales.', thin(ap('M40 74 q6 6 12 2 q6 6 12 2 q6 6 12 2 M124 78 q6 6 12 -2 q6 6 12 -2 q6 6 12 -2 M52 88 q6 6 12 2 q6 6 12 2 M124 92 q6 6 12 -2 q6 6 12 -2') + tailLines, 1.6)],
      ['Draw yellow feet tucked under the body.', ap('M94 132 l-4 10 M106 132 l4 10') + thin(ap('M90 142 l-3 3 M90 142 l0 4 M110 142 l3 3 M110 142 l0 4'), 2)],
      ['Erase the guides. Color the wings and body dark brown, the head and tail white, the beak yellow.', fil('#7A5536', wingL, wingR, body) + sol('#FFFFFF', head) + cut(head, body) + eye(94, 64, 2) + eye(106, 64, 2) + sol('#FFFFFF', tailF) + cut(tailF, body) + tailLines + fil('#FFC23D', beak) + ap(beak.d), { clear: true }],
      ['Shade the wing tips darker, to show they curve. Add the sky!', fil('#4A3220', cr(tipL, true), cr(tipL.map(([x, y]) => [200 - x, y]), true)) + pen('#7DBDEB', ap('M20 30 q10 -6 20 0 q8 -6 16 0 M140 24 q10 -6 20 0 q8 -6 16 0'), 3)]
    ], { brush: 'pencil' }));
  }

  RA.forEach(l => LESSONS.push(l));
  /* =================================================================== People & Bodies */
  // Skin tones and hair colours, so every family can find themselves.
  const SK = ['#F7D7C0', '#EBB98F', '#C98D5E', '#9A6440', '#6B4129'], HC = ['#2B1B12', '#5A3A22', '#B5652A', '#E3BC5E', '#C9C9D3'];
  // Colour layers: inside one blended group, later layers cover earlier ones, and the lines below stay visible.
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const across = (a, b, t, w) => { const p = lerp(a, b, t), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return D([[p[0] - dy / l * w / 2, p[1] + dx / l * w / 2], [p[0] + dy / l * w / 2, p[1] - dx / l * w / 2]]); };
  // A body from its joints. J: h head, n neck, pc pelvis, s/e/w shoulder-elbow-wrist, p/k/a/t hip-knee-ankle-toe; 1 = near side, 2 = far side.
  const fig = (J, r, side = false) => {
    const sp = Math.atan2(J.pc[1] - J.n[1], J.pc[0] - J.n[0]) / DEG - 90, len = Math.hypot(J.pc[0] - J.n[0], J.pc[1] - J.n[1]);
    const head = E(J.h[0], J.h[1], r * 0.84, r, J.tilt || 0), neck = band([lerp(J.h, J.n, 0.4), J.n], r * 0.6, r * 0.66);
    const chest = E(...lerp(J.n, J.pc, 0.3), side ? r * 1.0 : r * 1.38, len * 0.33, sp), pelvis = E(...lerp(J.n, J.pc, 0.86), side ? r * 0.95 : r * 1.12, len * 0.24, sp);
    const waist = band([lerp(J.n, J.pc, 0.3), lerp(J.n, J.pc, 0.86)], side ? r * 1.7 : r * 2.1, side ? r * 1.7 : r * 2.0);
    const arm = (s, e, w) => band([s, e, w], r * 0.66, r * 0.42), leg = (p, k, a) => band([p, k, a], r * 0.98, r * 0.48);
    const hand = (e, w) => { const dx = w[0] - e[0], dy = w[1] - e[1], l = Math.hypot(dx, dy); return E(w[0] + dx / l * r * 0.32, w[1] + dy / l * r * 0.32, r * 0.36, r * 0.28, Math.atan2(dy, dx) / DEG); };
    const foot = (a, t) => band([a, t], r * 0.5, r * 0.42);
    const P1 = { arm: arm(J.s1, J.e1, J.w1), hand: hand(J.e1, J.w1), leg: leg(J.p1, J.k1, J.a1), foot: foot(J.a1, J.t1) };
    const P2 = { arm: arm(J.s2, J.e2, J.w2), hand: hand(J.e2, J.w2), leg: leg(J.p2, J.k2, J.a2), foot: foot(J.a2, J.t2) };
    const torso = [chest, waist, pelvis], near = [head, neck, ...torso, P1.arm, P1.hand, P1.leg, P1.foot], far = [P2.arm, P2.hand, P2.leg, P2.foot];
    const sleeve = (s, e, t = 0.55) => band([s, lerp(s, e, t)], r * 0.8, r * 0.7);
    return {
      J, r, head, neck, torso, P1, P2, near, far, all: [...near, ...far],
      line: (fronts = []) => side ? uni(near, fronts) + uni(far, [...near, ...fronts]) : uni([...near, ...far], fronts),
      stick: () => ac(J.h[0], J.h[1], f1(r * 0.9)) + ap(D([J.n, J.pc])) + ap(D([J.s1, J.s2]) + D([J.p1, J.p2]) + D([J.s1, J.e1, J.w1]) + D([J.s2, J.e2, J.w2]) + D([J.p1, J.k1, J.a1, J.t1]) + D([J.p2, J.k2, J.a2, J.t2])) + ap(D([lerp(J.h, J.n, 0.6), J.n])),
      joints: () => [J.s1, J.s2, J.e1, J.e2, J.p1, J.p2, J.k1, J.k2].map(p => ac(f1(p[0]), f1(p[1]), 2.5)).join(''),
      shirt: (t = 0.55) => [...torso, sleeve(J.s1, J.e1, t), sleeve(J.s2, J.e2, t)],
      hems: (t = 0.55, kt = 0) => ap(across(J.s1, J.e1, t, r * 0.8) + across(J.s2, J.e2, t, r * 0.8) + (kt ? across(J.p1, J.k1, kt, r * 1.0) + across(J.p2, J.k2, kt, r * 1.0) : '')),
      pants: (kt = 1.9) => [pelvis, band([J.p1, J.k1, ...(kt > 1 ? [J.a1] : [])], r * 1.0, r * 0.62), band([J.p2, J.k2, ...(kt > 1 ? [J.a2] : [])], r * 1.0, r * 0.62)]
    };
  };
  // A person standing, from where their feet are and how many heads tall they are.
  const stand = (cx, ground, r, heads, o = {}) => {
    const H = heads * 2 * r, top = ground - H, adult = heads > 6, crotch = ground - H * (adult ? 0.48 : heads > 4.5 ? 0.44 : 0.4);
    const sw = r * (adult ? 1.55 : 1.3), hw = r * (adult ? 0.75 : 0.65), n = [cx, top + 2 * r + r * 0.35], sy = n[1] + r * 0.45, pc = [cx, crotch - r * 0.2];
    const ey = sy + (pc[1] - sy) * 0.55, wy = crotch + r * 0.1, ky = (crotch + ground) / 2;
    const a = o.arms || [[-sw - r * 0.35, ey, -sw - r * 0.5, wy], [sw + r * 0.35, ey, sw + r * 0.5, wy]];
    return {
      h: [cx, top + r], n, pc, tilt: o.tilt || 0,
      s1: [cx - sw, sy], e1: [cx + a[0][0], a[0][1]], w1: [cx + a[0][2], a[0][3]], s2: [cx + sw, sy], e2: [cx + a[1][0], a[1][1]], w2: [cx + a[1][2], a[1][3]],
      p1: [cx - hw, crotch - r * 0.3], k1: [cx - hw - r * 0.05, ky], a1: [cx - hw - r * 0.1, ground - r * 0.45], t1: [cx - hw - r * 0.6, ground - r * 0.15],
      p2: [cx + hw, crotch - r * 0.3], k2: [cx + hw + r * 0.05, ky], a2: [cx + hw + r * 0.1, ground - r * 0.45], t2: [cx + hw + r * 0.6, ground - r * 0.15]
    };
  };
  const smile = (x, y, r) => ac(f1(x - r * 0.3), f1(y - r * 0.08), f1(r * 0.1)) + ac(f1(x + r * 0.3), f1(y - r * 0.08), f1(r * 0.1)) + ap(`M${f1(x - r * 0.3)} ${f1(y + r * 0.35)} Q${f1(x)} ${f1(y + r * 0.6)} ${f1(x + r * 0.3)} ${f1(y + r * 0.35)}`);
  const sideFace = (x, y, r, dir = 1) => ac(f1(x + dir * r * 0.4), f1(y - r * 0.1), f1(r * 0.1)) + ap(`M${f1(x + dir * r * 0.82)} ${f1(y - r * 0.05)} l${f1(dir * r * 0.22)} ${f1(r * 0.3)} l${f1(-dir * r * 0.2)} ${f1(r * 0.05)} M${f1(x + dir * r * 0.5)} ${f1(y + r * 0.55)} q${f1(dir * r * 0.2)} ${f1(r * 0.05)} ${f1(dir * r * 0.32)} ${f1(-r * 0.1)}`);
  // Hair caps sitting on a head of radius r.
  const hairCap = (x, y, r, k = 1) => cr([[x - r * 0.9, y + r * 0.2 * k], [x - r * 0.95, y - r * 0.5], [x - r * 0.4, y - r * 1.1], [x + r * 0.4, y - r * 1.12], [x + r * 0.95, y - r * 0.5], [x + r * 0.9, y + r * 0.2 * k], [x + r * 0.6, y - r * 0.45], [x - r * 0.1, y - r * 0.55], [x - r * 0.6, y - r * 0.4]], true);
  const hairCurly = (x, y, r) => cr(Array.from({ length: 16 }, (_, k) => { const a = Math.PI * (0.92 + k / 15 * 1.16), rr = r * (k % 2 ? 1.12 : 1.3); return [x + rr * Math.cos(a), y + rr * Math.sin(a) + r * 0.12]; }).concat([[x + r * 0.7, y - r * 0.3], [x, y - r * 0.55], [x - r * 0.7, y - r * 0.3]]), true);
  const hairLong = (x, y, r, len = 1.6) => cr([[x - r * 0.95, y + r * len], [x - r * 1.05, y - r * 0.3], [x - r * 0.5, y - r * 1.1], [x + r * 0.5, y - r * 1.1], [x + r * 1.05, y - r * 0.3], [x + r * 0.95, y + r * len], [x + r * 0.72, y + r * len * 0.9], [x + r * 0.78, y - r * 0.2], [x, y - r * 0.62], [x - r * 0.78, y - r * 0.2], [x - r * 0.72, y + r * len * 0.9]], true);
  const hairSide = (x, y, r, dir = 1) => cr([[x - dir * r * 0.95, y + r * 0.5], [x - dir * r * 1.0, y - r * 0.4], [x - dir * r * 0.3, y - r * 1.1], [x + dir * r * 0.6, y - r * 0.95], [x + dir * r * 0.88, y - r * 0.4], [x + dir * r * 0.4, y - r * 0.55], [x - dir * r * 0.1, y - r * 0.3], [x - dir * r * 0.3, y + r * 0.3]], true);
  const FG = [];

  // ---- From stick figure to body
  {
    const J = stand(100, 186, 11.5, 7, { arms: [[-24, 80, -28, 104], [36, 44, 42, 18]] }), F = fig(J, 11.5), r = 11.5;
    const hair = hairCap(100, J.h[1], r);
    FG.push(L('fg-stick', 'figures', 1, 'From stick figure to body', '🧍', P, 'Every body has a stick figure hiding inside. Draw the sticks first, then give them muscles!', [
      ['Draw a circle for the head. Draw a line down for the back.', ac(J.h[0], J.h[1], f1(r * 0.9)) + ap(D([[100, J.h[1] + r], J.pc]))],
      ['Draw a line across for the shoulders and a short one for the hips. Add stick arms and legs.', ap(D([J.s1, J.s2]) + D([J.p1, J.p2]) + D([J.s1, J.e1, J.w1]) + D([J.s2, J.e2, J.w2]) + D([J.p1, J.k1, J.a1, J.t1]) + D([J.p2, J.k2, J.a2, J.t2]))],
      ['Now give the sticks muscles! Draw a smooth outline around them, like a tube.', F.line()],
      ['Draw a face and some hair. Add a T-shirt line on each arm and at the waist.', smile(100, J.h[1], r) + cut(hair, F.neck) + F.hems(0.5) + ap(across(J.n, J.pc, 0.86, r * 2.4))],
      ['Erase the sticks. Color the clothes and skin. Wave hello!', CL([SK[2], F.head, F.neck, F.P1.arm, F.P2.arm, F.P1.hand, F.P2.hand], ['#2E8BE6', ...F.shirt(0.5)], ['#22305A', ...F.pants()], ['#F2604F', F.P1.foot, F.P2.foot], [HC[0], hair]) + pen('#9FB3C8', ap('M150 14 q6 4 4 10 M156 10 q8 6 6 16'), 2), { clear: true }]
    ], { brush: 'pencil' }));
    // the sticks are a guide in the last step: mark them so "clear" removes them
    const l = FG[FG.length - 1]; l.steps[0][1] = guide(l.steps[0][1]); l.steps[1][1] = guide(l.steps[1][1]);
    l.steps[0][0] = 'Draw a light circle for the head. Draw a light line down for the back.';
    l.steps[1][0] = 'Draw light lines for the shoulders and hips. Add stick arms and legs.';
  }

  // ---- Jumping for joy
  {
    const r = 14, J = { h: [100, 42], n: [100, 60], pc: [100, 104], s1: [82, 66], e1: [66, 46], w1: [58, 24], s2: [118, 66], e2: [134, 46], w2: [142, 24], p1: [92, 104], k1: [72, 124], a1: [80, 150], t1: [70, 157], p2: [108, 104], k2: [128, 124], a2: [120, 150], t2: [130, 157] };
    const F = fig(J, r), hair = hairCurly(100, 42, r);
    FG.push(L('fg-jump', 'figures', 1, 'Jumping for joy', '🤸', P, 'A little shadow under the feet shows the person is up in the air. Boing!', [
      ['Draw a light stick person: arms up in a V, knees bent out to the sides.', guide(F.stick())],
      ['Draw a tube outline around the sticks, with round hands and feet.', F.line()],
      ['Draw curly hair and a big open smile. Add a shirt line on each arm.', cut(hair, F.head) + ac(95, 41, 1.4) + ac(105, 41, 1.4) + ap('M94 47 Q100 54 106 47 Z') + F.hems(0.45, 0.45)],
      ['Draw a flat oval shadow on the ground under the person, and bouncy lines.', T('#C9C3D6', ae(100, 182, 26, 5)) + ap('M50 160 q-6 6 0 12 M150 160 q6 6 0 12 M100 166 v8')],
      ['Erase the guides. Color the skin, the shirt and the shorts.', CL([SK[3], F.head, F.neck, ...F.all.filter(s => s !== F.torso[0])], ['#FFC23D', ...F.shirt(0.45)], ['#2FA36B', ...F.pants(0.45)], ['#F2604F', F.P1.foot, F.P2.foot], [HC[0], hair]), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Sitting on a chair (side view)
  {
    const r = 11, J = { h: [84, 40], n: [84, 56], pc: [84, 112], s1: [86, 62], e1: [92, 90], w1: [112, 100], s2: [84, 62], e2: [80, 90], w2: [100, 104], p1: [86, 112], k1: [124, 112], a1: [124, 150], t1: [138, 153], p2: [84, 112], k2: [120, 109], a2: [118, 150], t2: [132, 153] };
    const F = fig(J, r, true), hair = hairSide(84, 40, r, 1);
    const seat = 'M60 122 H124 M64 122 V60 M70 122 V158 M118 122 V158 M64 60 H70 V122';
    FG.push(L('fg-sit', 'figures', 1, 'Sitting on a chair', '🪑', P, 'When we sit, our body makes corners: at the hips and at the knees. Like a Z!', [
      ['Draw a light stick person sitting: the back, then the legs make two corners, like a Z.', guide(F.stick())],
      ['Draw the chair: a seat under the bottom, a tall back, and legs to the floor.', ap(seat)],
      ['Draw the body around the sticks: round head, back, bent legs and feet.', F.line()],
      ['Draw a face looking forward, and hair. Add sleeves and pant cuffs.', sideFace(84, 40, r) + cut(hair, F.neck) + F.hems(0.6) + ap(across(J.k1, J.a1, 0.82, r * 0.7))],
      ['Erase the guides. Color the skin, the clothes and the chair.', CL(['#C98A50', cr([[60, 119], [124, 119, 1], [124, 125, 1], [60, 125, 1]], true), cr([[63, 58], [71, 58, 1], [71, 122, 1], [63, 122, 1]], true)], [SK[1], F.head, F.neck, F.P1.hand, F.P2.hand], ['#6D55D1', ...F.shirt(1.2)], ['#2E8BE6', ...F.pants()], ['#22305A', F.P1.foot, F.P2.foot], [HC[2], hair]) + ap('M40 160 H160'), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Feet and shoes
  {
    const foot = cr([[54, 18], [56, 56], [46, 72], [50, 84], [96, 86], [120, 86], [126, 80], [118, 72], [96, 66], [72, 54], [70, 18]], true);
    const shoe = cr([[50, 124], [52, 154], [44, 172], [48, 180], [128, 180], [136, 172], [128, 160], [104, 152], [80, 140], [76, 124]], true);
    FG.push(L('fg-feet', 'figures', 1, 'Feet and shoes', '👟', P, 'Look at your own foot from the side. It is like a slide: high at the ankle, low at the toes.', [
      ['Draw a light triangle like a slide: high at the ankle, low at the toes.', guide(ap('M56 54 L46 84 L124 84 Z'))],
      ['Draw the leg coming down, then the heel, the long sole and the toes.', ap(foot.d)],
      ['Draw a bump for the ankle bone, and little toenails.', ac(62, 60, 3) + ap('M114 76 q4 -2 6 1 M104 72 q3 -2 5 1')],
      ['Now a sneaker! Draw the same slide shape, a bit bigger, lower down.', ap(shoe.d)],
      ['Draw a thick sole along the bottom, a toe cap, and laces.', ap('M46 170 H134 M110 156 Q124 160 128 172') + ap('M78 138 l10 6 M84 134 l10 6 M90 130 l10 6 M94 142 l-8 -4 M100 138 l-8 -4') + ac(62, 136, 2)],
      ['Erase the guides. Color the foot and your sneaker. Add a stripe!', CL([SK[2], foot], ['#F2604F', shoe], ['#FFFFFF', cr([[46, 170], [134, 170, 1], [136, 176], [128, 180], [48, 180], [44, 174]], true)]) + pen('#FFFFFF', ap('M60 162 Q80 150 104 152'), 4), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- A runner (side view)
  {
    const r = 11, J = { h: [118, 32], n: [112, 48], pc: [98, 100], s1: [110, 54], e1: [92, 68], w1: [88, 86], s2: [112, 54], e2: [126, 72], w2: [140, 62], p1: [98, 100], k1: [122, 114], a1: [114, 142], t1: [126, 146], p2: [96, 100], k2: [86, 132], a2: [66, 150], t2: [60, 160], tilt: 15 };
    const F = fig(J, r, true), hair = cr([[106, 38], [104, 24], [114, 18], [126, 22], [128, 30], [122, 28], [118, 34], [112, 36], [100, 48], [92, 54], [96, 44]], true);
    FG.push(L('fg-run', 'figures', 2, 'A fast runner', '🏃', P, 'Runners lean forward. When the left leg goes forward, the right arm goes forward. Try it!', [
      ['Draw a light line that leans forward, like a falling stick. This is the line of action.', guide(ap('M124 22 L92 108'))],
      ['Draw a stick runner on it: the near knee up in front, the far leg pushing back.', guide(F.stick())],
      ['Bend the arms at the elbows. The arms swing opposite to the legs.', ap(D([J.s1, J.e1, J.w1]) + D([J.s2, J.e2, J.w2]))],
      ['Draw the body around the sticks. Near parts are in front of the far parts.', F.line()],
      ['Draw a ponytail flying back, the face, shorts and a running top.', cut(hair, F.head) + sideFace(118, 32, r) + F.hems(0.3, 0.55) + ap(across(J.n, J.pc, 0.86, r * 2.2))],
      ['Draw speed lines behind, and a shadow under the front foot.', ap('M40 60 h24 M30 80 h30 M44 100 h20') + T('#C9C3D6', ae(110, 168, 30, 4))],
      ['Erase the guides. Color skin, clothes and shoes.', CL([SK[4], F.head, F.neck, ...F.near.slice(5), ...F.far], ['#F2604F', ...F.shirt(0.3)], ['#22305A', ...F.pants(0.55)], ['#FFFFFF', F.P1.foot, F.P2.foot], [HC[0], hair]), { clear: true }]
    ], { brush: 'pencil' }));
    const l = FG[FG.length - 1]; l.steps[2][1] = guide(l.steps[2][1]);
  }

  // ---- A dancer
  {
    const r = 12, J = { h: [96, 32], n: [98, 48], pc: [100, 104], tilt: -10, s1: [82, 54], e1: [66, 34], w1: [84, 16], s2: [114, 54], e2: [138, 62], w2: [160, 54], p1: [92, 104], k1: [90, 144], a1: [92, 180], t1: [84, 187], p2: [108, 104], k2: [130, 136], a2: [152, 164], t2: [162, 172] };
    const F = fig(J, r), tutu = cr([[70, 106], [84, 96], [116, 96], [132, 106], [120, 116], [100, 120], [80, 116]], true);
    const bun = E(96, 18, 7, 6), hair = hairCap(96, 32, r, 0.2);
    FG.push(L('fg-dance', 'figures', 2, 'A ballet dancer', '🩰', P, 'Dancers make long smooth curves with their arms and legs. Keep your lines flowing!', [
      ['Draw a light stick dancer. One arm curves over the head, one stretches out.', guide(F.stick())],
      ['Point one leg out to the side, with the toes stretched. Draw the body around the sticks.', F.line([tutu])],
      ['Draw a frilly skirt, called a tutu, around the hips.', ap(tutu.d) + thin(ap('M80 112 l-4 6 M92 118 l-2 6 M108 118 l2 6 M120 112 l4 6'))],
      ['Draw a hair bun on top, closed eyes and a small smile.', cut(bun, hair) + cut(hair, F.neck) + ap('M88 32 q3 2 6 0 M99 32 q3 2 6 0 M92 39 q4 3 8 0')],
      ['Erase the guides. Color the dancer. Add sparkles!', CL([SK[1], F.head, F.neck, ...F.all], ['#F49AC1', F.torso[0], F.torso[1], tutu], [HC[1], hair, bun]) + pen('#FFC23D', ap('M40 70 l4 4 m-4 0 l4 -4 M170 100 l4 4 m-4 0 l4 -4 M150 24 l4 4 m-4 0 l4 -4'), 2.4), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Hands: the mitten method
  {
    const palm = cr([[74, 106], [126, 104], [132, 150], [120, 172], [84, 174], [72, 150]], true), wrist = band([[100, 166], [100, 198]], 44, 42);
    const fins = [band([[82, 110], [76, 80], [72, 58]], 15, 12), band([[97, 106], [96, 72], [96, 46]], 16, 13), band([[112, 106], [116, 74], [118, 52]], 15, 12), band([[125, 112], [132, 90], [138, 70]], 13, 11)];
    const thumb = band([[80, 152], [62, 132], [48, 110]], 22, 14);
    const all = [palm, wrist, thumb, ...fins];
    FG.push(L('fg-hands', 'figures', 2, 'Hands: the mitten method', '✋', P, 'Put your hand on the paper and look at it. The middle finger is the longest one!', [
      ['Draw a light mitten shape: a square palm with a round lid on top for the fingers.', guide(ap('M74 172 L74 104 Q74 40 100 40 Q140 40 136 110 L130 172 Z'))],
      ['Draw a light thumb sticking out of the side, like a mitten thumb.', guide(ap('M76 150 Q50 140 44 108 Q54 100 64 116 L76 128'))],
      ['Split the lid into four fingers with light lines. The middle one is the longest.', guide(ap('M89 108 L84 46 M104 106 L108 44 M119 108 L128 60'))],
      ['Draw each finger as a long tube with a round tip, over the guides.', uni(fins, [palm])],
      ['Draw the palm, the thumb and the wrist, joined in one smooth line.', uni([palm, wrist, thumb], fins)],
      ['Draw knuckle lines on each finger, and the nails. Add a line on the palm.', thin(ap('M70 78 h12 M74 92 h12 M89 70 h14 M90 86 h13 M109 72 h13 M108 88 h13 M126 90 h11 M122 100 h10 M56 128 l8 -6') + ap('M70 60 q2 -6 8 -2 M92 50 q4 -6 8 0 M114 56 q4 -5 8 0 M134 74 q4 -4 7 1') + ap('M84 140 Q100 128 124 132'), 1.6)],
      ['Erase the guides. Color your hand. Shade the side of the palm.', CL([SK[2], ...all]) + hatch(cr([[118, 140], [130, 140], [124, 166], [114, 166]], true), 40, 3), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Clothes and folds
  {
    const head = E(100, 40, 19, 23), neck = band([[100, 56], [100, 80]], 18, 20), hair = hairCurly(100, 38, 22);
    const body = cr([[80, 74], [120, 74], [146, 84], [150, 130], [148, 192], [100, 196], [52, 192], [52, 130], [54, 84]], true);
    const slL = band([[60, 88], [28, 126], [52, 154]], 30, 24), slR = band([[140, 88], [156, 130], [160, 168]], 30, 24);
    const hL = E(60, 160, 8, 10, -40), hR = E(162, 180, 8, 11), shirt = [body, slL, slR];
    FG.push(L('fg-folds', 'figures', 2, 'Clothes and folds', '👕', P, 'Cloth folds where the body bends: at the elbows, under the arms and at the waist.', [
      ['Draw a light stick person. One hand rests on the hip, one arm hangs down.', guide(ac(100, 40, 20) + ap('M100 60 V196 M60 86 H140 M60 86 L28 126 L58 158 M140 86 L156 130 L162 178'))],
      ['Draw a loose shirt around the body. Sleeves are wide tubes around the arms.', uni(shirt)],
      ['Draw the head, the neck and the hands peeking out of the shirt.', uni([head, neck], [body]) + cut(hL, slL, body) + cut(hR, slR) + smile(100, 40, 20) + cut(hair, head)],
      ['Draw curved folds inside the bent elbow. They look like a Z or a star.', ap('M34 116 q6 4 8 12 M30 132 q8 -2 14 4 M42 122 l8 -8')],
      ['Draw folds pulling from the armpits, and soft rings near the cuff.', ap('M66 96 q12 14 10 34 M134 96 q-8 14 -4 30 M152 156 q6 4 14 0 M152 166 q6 3 14 0')],
      ['Draw a few folds at the waist, and a wavy bottom edge.', ap('M60 172 q14 -10 26 -6 M112 166 q16 -4 28 6 M82 194 q4 -8 2 -14 M120 194 q-2 -8 4 -14')],
      ['Erase the guides. Color the shirt. Shade inside each fold, so the cloth looks soft.', CL([SK[3], head, neck, hL, hR], ['#2FA36B', ...shirt], [HC[0], hair]) + hatch(E(38, 126, 5, 10, -30), 40, 2.4) + hatch(E(72, 112, 4, 14, -10), 40, 2.4) + hatch(E(130, 110, 4, 12, 10), 40, 2.4) + hatch(E(100, 180, 16, 5), 40, 2.4), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Kids playing ball
  {
    const r = 12;
    const A = { h: [50, 72], n: [53, 88], pc: [57, 126], tilt: 8, s1: [56, 94], e1: [42, 108], w1: [34, 122], s2: [54, 94], e2: [68, 108], w2: [80, 112], p1: [57, 126], k1: [76, 144], a1: [96, 148], t1: [106, 143], p2: [55, 126], k2: [52, 152], a2: [50, 176], t2: [60, 181] };
    const B = { h: [152, 70], n: [151, 86], pc: [150, 124], s1: [148, 92], e1: [132, 104], w1: [120, 106], s2: [154, 92], e2: [140, 108], w2: [126, 114], p1: [146, 124], k1: [138, 150], a1: [134, 176], t1: [124, 181], p2: [154, 124], k2: [160, 150], a2: [162, 176], t2: [152, 181] };
    const FA = fig(A, r, true), FB = fig(B, r, true), ball = E(118, 146, 9);
    const hA = hairCap(50, 72, r), hB = hairLong(152, 70, r, 1.1);
    FG.push(L('fg-play', 'figures', 2, 'Kids playing ball', '⚽', P, 'Kids are about 5 heads tall. Their heads look big compared to their bodies.', [
      ['Draw two light stick kids. One kicks with a leg out. One holds arms out to catch.', guide(FA.stick() + FB.stick())],
      ['Draw the ball right in front of the kicking foot.', ap(ball.d)],
      ['Draw a body around the kicker. Kids have short arms and legs and a big head.', FA.line()],
      ['Draw a body around the catcher, with arms reaching forward.', FB.line()],
      ['Draw hair and happy faces. Add shirt and shorts lines.', cut(hA, FA.head) + cut(hB, FB.head, FB.P1.arm, FB.P2.arm) + sideFace(50, 72, r, 1) + sideFace(152, 70, r, -1) + FA.hems(0.45, 0.6) + FB.hems(0.45, 0.6)],
      ['Draw a pattern on the ball, grass lines, and motion lines from the ball.', ap('M114 140 l4 4 l5 -3 M112 150 l6 0 M124 150 l-3 4') + thin(ap('M20 186 l2 -6 M40 188 l2 -6 M90 186 l2 -6 M110 188 l2 -6 M176 186 l2 -6') + ap('M130 140 h8 M130 148 h10'))],
      ['Erase the guides. Color the kids and the ball. Use your favorite colors!', CL([SK[0], ...FA.all], [SK[3], ...FB.all], ['#FF8A2B', ...FA.shirt(0.45)], ['#6D55D1', ...FB.shirt(0.45)], ['#2E8BE6', ...FA.pants(0.6)], ['#22305A', ...FB.pants(0.6)], [HC[3], hA], [HC[0], hB], ['#FFFFFF', ball]) + pen('#2FA36B', ap('M10 190 H190'), 3), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Walking, side view (Master)
  {
    const r = 11, J = { h: [104, 26], n: [101, 43], pc: [98, 98], s1: [100, 50], e1: [90, 76], w1: [84, 100], s2: [100, 50], e2: [106, 76], w2: [114, 98], p1: [98, 98], k1: [110, 138], a1: [116, 176], t1: [130, 174], p2: [96, 98], k2: [90, 138], a2: [78, 172], t2: [90, 182] };
    const F = fig(J, r, true), hair = cr([[92, 30], [92, 16], [104, 12], [116, 16], [116, 24], [108, 22], [102, 26], [98, 34]], true);
    const coat = cr([[92, 44], [112, 46], [116, 70], [116, 112], [80, 112], [82, 70]], true);
    FG.push(L('fg-walk', 'figures', 3, 'A person walking, side view', '🚶', PS, 'When you walk, the front leg lands on the heel. The back foot pushes off with the toes.', [
      ['Draw 8 light lines across, the same space apart. A grown-up is about 7 and a half heads tall.', guide([15, 36.5, 58, 79.5, 101, 122.5, 144, 165.5, 187].map(y => al(60, y, 140, y)).join(''))],
      ['Draw the head in the top space. The hips are at line 4, halfway down the body.', guide(ac(104, 26, 10) + ap('M101 43 L98 98'))],
      ['Draw stick legs. The front leg lands on the heel; the back foot pushes off the toes.', guide(ap(D([J.p1, J.k1, J.a1, J.t1]) + D([J.p2, J.k2, J.a2, J.t2])))],
      ['Draw stick arms swinging opposite to the legs. Elbows reach the waist.', guide(ap(D([J.s1, J.e1, J.w1]) + D([J.s2, J.e2, J.w2])))],
      ['Draw the body around the sticks. The far arm and leg go behind.', F.line([coat])],
      ['Draw a jacket over the top half, with a zip and a fold at the elbow.', ap(coat.d) + thin(ap('M112 50 L112 110 M90 74 q4 4 8 2'))],
      ['Draw the profile face, the ear, and short hair.', sideFace(104, 26, r) + ap('M100 24 q-4 2 -2 6 q2 3 4 1') + cut(hair, F.neck)],
      ['Erase the guides. Shade the far arm and leg, and under the jacket.', hatch(F.P2.leg, 45, 3) + hatch(F.P2.arm, 45, 3) + hatch(E(98, 116, 14, 4), 45, 3), { clear: true }],
      ['Color the skin and clothes. Add a shadow on the ground.', CL([SK[1], F.head, F.neck, F.P1.hand, F.P2.hand], ['#2FA36B', coat, F.P1.arm, F.P2.arm], ['#6D55D1', ...F.pants()], ['#8B5A2B', F.P1.foot, F.P2.foot], [HC[4], hair]) + T('#C9C3D6', ae(104, 186, 34, 4))]
    ], { brush: 'pencil' }));
  }

  // ---- A family standing together (Master)
  {
    const g = 186, m = [
      { x: 34, r: 10.2, h: 7.6, sk: SK[3], hc: HC[0], shirt: '#2E8BE6', pants: '#22305A', hair: 'cap' },
      { x: 78, r: 10, h: 7.1, sk: SK[1], hc: HC[2], shirt: '#F2604F', pants: '#6D55D1', hair: 'long' },
      { x: 122, r: 10, h: 5.4, sk: SK[2], hc: HC[1], shirt: '#FFC23D', pants: '#2FA36B', hair: 'curly' },
      { x: 162, r: 10, h: 4.2, sk: SK[2], hc: HC[1], shirt: '#F49AC1', pants: '#2E8BE6', hair: 'cap' }
    ].map(o => ({ ...o, J: stand(o.x, g, o.r, o.h) }));
    m.forEach(o => { o.F = fig(o.J, o.r); const y = o.J.h[1]; o.H = o.hair === 'long' ? hairLong(o.x, y, o.r, 1.4) : o.hair === 'curly' ? hairCurly(o.x, y, o.r) : hairCap(o.x, y, o.r); });
    FG.push(L('fg-family', 'figures', 3, 'A family standing together', '👨‍👩‍👧‍👦', PS, 'Grown-ups are 7 to 8 heads tall, kids about 5, and toddlers about 4. Same size heads!', [
      ['Draw a light ground line. Draw four heads the same size: a grown-up is tall, a toddler is short.', guide(al(10, g, 190, g)) + m.map(o => ac(o.x, o.J.h[1], o.r)).join('')],
      ['Count heads down to each person\'s feet. Mark their hips halfway with light lines.', guide(m.map(o => ap(D([[o.x - 14, o.J.pc[1]], [o.x + 14, o.J.pc[1]]]))).join('') + m.map(o => o.F.stick()).join(''))],
      ['Draw the two grown-ups around their sticks.', m[0].F.line() + m[1].F.line()],
      ['Draw the two kids. Their legs are shorter, and their heads look bigger.', m[2].F.line() + m[3].F.line()],
      ['Draw everyone\'s hair. Make each one different: short, long, curly.', m.map(o => cut(o.H, o.F.head, o.F.neck)).join('')],
      ['Draw happy faces. Add sleeve and shorts lines.', m.map(o => smile(o.x, o.J.h[1], o.r) + o.F.hems(0.5, o.h < 6 ? 0.6 : 0)).join('')],
      ['Erase the guides. Shade the side away from the light, on the right of each body.', m.map(o => hatch(E(o.x + o.r * 0.9, o.J.pc[1] - o.r * 1.4, o.r * 0.4, o.r * 1.6), 45, 2.6)).join(''), { clear: true }],
      ['Color everyone. Use real skin and hair colors for your own family!', CL(...m.flatMap(o => [[o.sk, ...o.F.all], [o.shirt, ...o.F.shirt(0.5)], [o.pants, ...o.F.pants(o.h < 6 ? 0.6 : 1.9)], [o.hc, o.H]]))]
    ], { brush: 'pencil' }));
  }

  // ---- Gesture drawing (Master)
  {
    const r = 7.5;
    const P1 = { h: [36, 40], n: [40, 52], pc: [50, 86], tilt: -20, s1: [36, 56], e1: [24, 40], w1: [18, 22], s2: [44, 56], e2: [54, 44], w2: [62, 34], p1: [48, 86], k1: [44, 112], a1: [46, 140], t1: [40, 144], p2: [52, 86], k2: [60, 112], a2: [64, 136], t2: [70, 140] };
    const P2 = { h: [102, 46], n: [100, 58], pc: [104, 92], s1: [96, 62], e1: [82, 52], w1: [72, 58], s2: [104, 62], e2: [118, 54], w2: [128, 38], p1: [100, 92], k1: [90, 116], a1: [80, 140], t1: [74, 144], p2: [108, 92], k2: [120, 114], a2: [124, 140], t2: [132, 142] };
    const P3 = { h: [168, 92], n: [160, 98], pc: [148, 118], tilt: 30, s1: [162, 100], e1: [172, 116], w1: [176, 132], s2: [158, 102], e2: [166, 118], w2: [168, 134], p1: [148, 118], k1: [150, 134], a1: [146, 144], t1: [154, 146], p2: [146, 118], k2: [138, 134], a2: [134, 144], t2: [142, 146] };
    const G = [fig(P1, r, true), fig(P2, r, true), fig(P3, r, true)];
    FG.push(L('fg-gesture', 'figures', 3, 'Gesture drawing', '💃', PS, 'Gesture drawing is fast! Spend 30 seconds on each pose. Catch the movement, not the details.', [
      ['Draw a long C curve. This line of action shows a person stretching up.', ap('M20 20 Q34 70 46 142')],
      ['On it, quickly draw a head, a bean for the body, and stick arms and legs.', guide(G[0].stick())],
      ['Draw an S curve for a person throwing a ball.', ap('M130 36 Q100 60 104 92 Q108 120 80 142')],
      ['Quickly draw the thrower: one arm back high, legs wide.', guide(G[1].stick())],
      ['Draw a short bent line for a person bending down to tie a shoe.', ap('M172 90 Q156 104 146 120')],
      ['Quickly draw the bending person, low and curled.', guide(G[2].stick())],
      ['Now draw smooth outlines around each stick person. Keep your hand loose!', G.map(F => F.line()).join('')],
      ['Erase the guides. Shade one side of each person and add a ground shadow.', G.map(F => hatch(F.torso[0], 45, 2.4) + hatch(F.P2.leg, 45, 2.4)).join('') + T('#C9C3D6', ae(50, 148, 20, 3) + ae(104, 146, 30, 3) + ae(152, 150, 22, 3)), { clear: true }],
      ['Color each person with one color, like a quick painting.', CL(['#F2604F', ...G[0].all], ['#2E8BE6', ...G[1].all], ['#2FA36B', ...G[2].all])]
    ], { brush: 'pencil' }));
  }

  FG.forEach(l => LESSONS.push(l));

  /* =================================================================== Portraits & Faces */
  // The part of a shape that is inside another (an iris under the eyelids).
  const within = (s, box) => ap(runs(s, p => !inside(p, box)));
  // A front-view face. y is the eye line. o: t (how far down the eyes sit), round, open (eyes), smile (-1 to 1), mouth ('o', 'open'), brow ('angry', 'sad', 'up'), look (iris shift).
  const face = (x, y, w, h, o = {}) => {
    const t = o.t || 0.5, top = y - h * t, chin = top + h, hw = w / 2, jaw = o.round ? 0.84 : 0.7;
    const sideP = s => [[x + s * hw * 0.78, top + h * 0.1], [x + s * hw, y - h * 0.06], [x + s * hw * 0.95, y + (chin - y) * 0.32], [x + s * hw * jaw, y + (chin - y) * 0.7], [x + s * hw * 0.36, chin - h * 0.03]];
    const head = cr([[x, top], ...sideP(1), [x, chin], ...sideP(-1).reverse()], true);
    const ew = w * (o.big ? 0.23 : 0.2), ex = w * 0.2, ny = y + (chin - y) * 0.42, my = y + (chin - y) * 0.68, op = o.open == null ? 1 : o.open;
    const alm = cx => cr([[cx - ew / 2, y, 1], [cx - ew * 0.08, y - ew * 0.36 * op], [cx + ew / 2, y, 1], [cx + ew * 0.04, y + ew * 0.26 * op]], true);
    const eL = alm(x - ex), eR = alm(x + ex), ir = ew * (o.big ? 0.3 : 0.25), lk = (o.look || 0) * ew * 0.15;
    const iris = [E(x - ex + lk, y + (o.down ? ew * 0.08 : 0), ir), E(x + ex + lk, y + (o.down ? ew * 0.08 : 0), ir)];
    let eyes = '';
    if (op > 0.15) eyes = o3(eL) + o3(eR) + iris.map((s, i) => within(s, i ? eR : eL)).join('') + T('#22305A', ac(f1(x - ex + lk), f1(y + (o.down ? ew * 0.08 : 0)), f1(ir * 0.5)) + ac(f1(x + ex + lk), f1(y + (o.down ? ew * 0.08 : 0)), f1(ir * 0.5))) + paint('#fff', ac(f1(x - ex + lk + ir * 0.3), f1(y - ir * 0.3), f1(ir * 0.25)) + ac(f1(x + ex + lk + ir * 0.3), f1(y - ir * 0.3), f1(ir * 0.25)));
    else eyes = ap([-1, 1].map(s => `M${f1(x + s * ex - ew / 2)} ${f1(y)}Q${f1(x + s * ex)} ${f1(y + ew * 0.35)} ${f1(x + s * ex + ew / 2)} ${f1(y)}`).join('') + [-1, 1].map(s => `M${f1(x + s * ex - ew * 0.3)} ${f1(y + ew * 0.2)}l${f1(-ew * 0.1)} ${f1(ew * 0.18)}M${f1(x + s * ex + ew * 0.3)} ${f1(y + ew * 0.2)}l${f1(ew * 0.1)} ${f1(ew * 0.18)}`).join(''));
    const by = y - ew * 0.75, br = o.brow;
    const brows = ap([-1, 1].map(s => { const cx = x + s * ex, inner = cx - s * ew * 0.55, outer = cx + s * ew * 0.62; const iy = by + (br === 'angry' ? ew * 0.35 : br === 'sad' ? -ew * 0.3 : br === 'up' ? -ew * 0.45 : 0), oy = by + (br === 'sad' ? ew * 0.15 : br === 'up' ? -ew * 0.35 : 0), mx = cx, myy = Math.min(iy, oy) - ew * (br === 'angry' ? 0.05 : 0.22); return `M${f1(inner)} ${f1(iy)}Q${f1(mx)} ${f1(myy)} ${f1(outer)} ${f1(oy)}`; }).join(''));
    const nose = ap(`M${f1(x - ew * 0.42)} ${f1(ny - ew * 0.2)}q${f1(-ew * 0.12)} ${f1(ew * 0.26)} ${f1(ew * 0.16)} ${f1(ew * 0.26)}q${f1(ew * 0.14)} ${f1(ew * 0.1)} ${f1(ew * 0.26)} 0q${f1(ew * 0.12)} ${f1(ew * 0.1)} ${f1(ew * 0.26)} 0q${f1(ew * 0.28)} 0 ${f1(ew * 0.16)} ${f1(-ew * 0.26)}`);
    const sm = o.smile || 0, mw = ew * (o.small ? 0.55 : 0.8);
    let mouth, lips;
    if (o.mouth === 'o') { lips = E(x, my, ew * 0.26, ew * 0.36); mouth = ap(lips.d); }
    else if (o.mouth === 'open') { lips = cr([[x - mw, my - ew * 0.1, 1], [x, my - ew * 0.02], [x + mw, my - ew * 0.1, 1], [x, my + ew * 0.55]], true); mouth = ap(lips.d) + ap(`M${f1(x - mw * 0.7)} ${f1(my + ew * 0.02)}Q${x} ${f1(my + ew * 0.12)} ${f1(x + mw * 0.7)} ${f1(my + ew * 0.02)}`); }
    else { const cy = my - sm * ew * 0.22, mid = my + sm * ew * 0.22; lips = cr([[x - mw, cy, 1], [x, mid - ew * 0.12], [x + mw, cy, 1], [x, mid + ew * 0.22]], true); mouth = ap(`M${f1(x - mw)} ${f1(cy)}Q${x} ${f1(mid + (sm < 0 ? -ew * 0.12 : ew * 0.05))} ${f1(x + mw)} ${f1(cy)}`) + thin(ap(`M${f1(x - mw * 0.4)} ${f1(mid + ew * 0.28 - sm * ew * 0.04)}Q${x} ${f1(mid + ew * 0.38)} ${f1(x + mw * 0.4)} ${f1(mid + ew * 0.28 - sm * ew * 0.04)}`), 2); }
    const ear = s => cr([[x + s * hw * 0.9, y - ew * 0.25], [x + s * (hw + ew * 0.35), y - ew * 0.35], [x + s * (hw + ew * 0.42), y + (ny - y) * 0.5], [x + s * (hw + ew * 0.12), ny + ew * 0.1], [x + s * hw * 0.9, ny]], true);
    const neck = band([[x, chin - h * 0.15], [x, chin + h * 0.32]], w * 0.48, w * 0.52);
    return { x, y, w, h, top, chin, ny, my, ew, ex, head, earL: ear(-1), earR: ear(1), neck, eL, eR, iris, lips, eyes, brows, nose, mouth, feat: eyes + brows + nose + mouth, ears: cut(ear(-1), head) + cut(ear(1), head) + thin(ap([-1, 1].map(s => `M${f1(x + s * (hw + ew * 0.05))} ${f1(y)}q${f1(s * ew * 0.25)} ${f1(ew * 0.1)} ${f1(s * ew * 0.12)} ${f1((ny - y) * 0.5)}`).join('')), 1.8) };
  };
  function o3(s) { return ap(s.d); }
  const PT = [];

  // ---- An eye up close
  {
    const alm = cr([[36, 106, 1], [74, 72], [126, 70], [164, 100, 1], [124, 126], [76, 126]], true), iris = E(102, 98, 26), pupil = E(102, 98, 11);
    const brow = cr([[36, 58], [86, 38], [150, 44], [166, 54], [150, 52], [88, 48], [40, 66]], true);
    const spokes = Array.from({ length: 14 }, (_, k) => { const a = k * 2 * Math.PI / 14; return D([[102 + 13 * Math.cos(a), 98 + 13 * Math.sin(a)], [102 + 24 * Math.cos(a), 98 + 24 * Math.sin(a)]]); }).join('');
    PT.push(L('pt-eye', 'portraits', 1, 'An eye up close', '👁️', PS, 'Look at your eye in a mirror. The top lid always hides a little bit of the colored circle!', [
      ['Draw a long shape like a lemon lying down. The top curve is higher than the bottom.', ap(alm.d)],
      ['Draw a big circle in the middle. The top of it hides under the eyelid.', within(iris, alm)],
      ['Draw a dark round pupil in the middle. Leave a little white shine.', T('#22305A', ap(pupil.d)) + ap(pupil.d) + paint('#fff', ac(112, 88, 6))],
      ['Draw the crease above the eye, and eyelashes curving up and out.', ap('M44 90 Q100 44 158 86') + W(ap('M54 92 q-6 -6 -8 -14 M68 82 q-4 -8 -4 -14 M84 76 q-2 -8 0 -14 M102 72 q0 -8 4 -13 M120 72 q2 -8 7 -12 M138 78 q4 -6 10 -10 M152 88 q6 -4 12 -6'), 2.2)],
      ['Draw the eyebrow above, with little hairs going the same way.', ap(brow.d) + thin(ap('M56 56 l8 -6 M70 50 l9 -5 M86 45 l10 -3 M102 44 l10 -2 M118 44 l10 0 M134 46 l9 2'), 1.4)],
      ['Color the iris and draw spokes from the pupil, like a bike wheel. Shade under the lid.', CL(['#6E9C5A', iris], ['#22305A', pupil]) + within(iris, alm) + thin(spokes, 1.2) + paint('#fff', ac(112, 88, 6)) + hatch(cr([[50, 100], [76, 78], [126, 76], [150, 98], [126, 84], [76, 84]], true), 30, 2.6) + fil('#F2A9A0', E(42, 106, 5, 4))]
    ], { brush: 'pencil' }));
  }

  // ---- Lips and a smile
  {
    const meet = 'M40 96 Q68 102 92 100 L100 104 L108 100 Q132 102 160 96';
    const top = cr([[40, 96, 1], [70, 82], [88, 76], [100, 82, 1], [112, 76], [130, 82], [160, 96, 1], [132, 100], [108, 100, 1], [100, 104, 1], [92, 100, 1], [68, 100]], true);
    const bot = cr([[44, 98, 1], [70, 122], [100, 134], [130, 122], [156, 98, 1], [130, 102], [108, 101, 1], [100, 104, 1], [92, 101, 1], [70, 102]], true);
    PT.push(L('pt-lips', 'portraits', 1, 'Lips and a smile', '👄', P, 'The top lip has two little hills in the middle, like a bird flying far away.', [
      ['Draw a long line that dips in the middle and curls up at the ends, like a smile.', ap(meet)],
      ['Draw the top lip: two little hills in the middle, like a flying bird.', ap('M40 96 Q60 84 88 76 Q96 74 100 82 Q104 74 112 76 Q140 84 160 96')],
      ['Draw the bottom lip: a wide, round curve under the line.', ap('M44 98 Q100 150 156 98')],
      ['Draw a dimple at each corner, two short lines going up, and the bottom of the nose.', ap('M38 90 q-6 6 -2 14 M162 90 q6 6 2 14 M93 74 L91 58 M107 74 L109 58') + thin(ap('M78 50 Q100 40 122 50'))],
      ['Color the lips pink. Leave a white shine on the bottom lip. Shade under it.', CL(['#E58A92', top, bot]) + paint('#fff', ae(116, 118, 10, 3)) + hatch(E(100, 140, 26, 5), 20, 2.6)]
    ], { brush: 'pencil' }));
  }

  // ---- An ear
  {
    const out = [[110, 42], [76, 28], [52, 50], [48, 86], [62, 114], [76, 130], [80, 152], [94, 166], [108, 158], [110, 140]];
    const shape = cr([...out, [114, 110], [114, 70]], true);
    PT.push(L('pt-ear', 'portraits', 1, 'An ear', '👂', P, 'Ears sit on the side of the head, between the eyebrows and the bottom of the nose.', [
      ['Draw a big curved shape, like the letter C.', ap(cr(out.slice(0, 7)).d)],
      ['Draw the soft round earlobe at the bottom.', ap(cr(out.slice(5)).d)],
      ['Draw a smaller curve inside, following the outside edge.', ap('M104 50 Q70 40 62 70 Q58 96 76 112')],
      ['Draw a Y shape in the middle, a little bump at the front, and the hollow.', ap('M76 112 Q88 96 88 80 Q90 66 100 60 M88 80 Q80 70 70 68 M110 108 q8 6 0 18') + thin(ap('M96 118 Q104 102 96 92'))],
      ['Color the ear. Shade the deep hollow parts darker.', CL([SK[1], shape]) + hatch(E(98, 108, 8, 14), 40, 2.4) + hatch(cr([[66, 66], [74, 50], [96, 50], [80, 58]], true), 40, 2.4)]
    ], { brush: 'pencil' }));
  }

  // ---- Three hairstyles
  {
    const xs = [38, 100, 162], y = 92, hs = xs.map(x => E(x, y, 19, 24));
    const straight = hairLong(38, 88, 22, 2.6), curly = cr(Array.from({ length: 30 }, (_, k) => { const a = k * 2 * Math.PI / 30, rr = (k % 2 ? 31 : 36); return [100 + rr * Math.cos(a) * 1.0, 86 + rr * Math.sin(a) * (a > 0.4 && a < 2.7 ? 0.7 : 1)]; }), true);
    const cap = cr([[144, 92], [142, 70], [162, 62], [182, 70], [180, 92], [174, 78], [162, 74], [150, 78]], true);
    const braid = s => Array.from({ length: 6 }, (_, k) => E(162 + s * 22, 100 + k * 11, 6, 6.5, s * 30 * (k % 2 ? 1 : -1)));
    const bL = braid(-1), bR = braid(1);
    PT.push(L('pt-hair', 'portraits', 1, 'Hair: straight, curly and braids', '💇', P, 'Hair grows from the top of the head and falls down. Draw it in the direction it grows.', [
      ['Draw three face ovals in a row, all the same size.', o(...hs)],
      ['Straight hair: draw it smooth and long, falling past the shoulders.', cut(straight, hs[0]) + thin(ap('M24 80 Q20 120 24 146 M52 80 Q56 120 52 146 M30 70 Q26 110 28 150'), 1.6)],
      ['Curly hair: draw lots of round bumps all around, like a fluffy cloud.', cut(curly, hs[1]) + thin(ap('M80 64 q4 -4 6 2 M112 60 q4 -4 6 2 M92 54 q4 -4 6 2 M124 80 q4 -4 6 2 M72 84 q4 -4 6 2 M128 100 q4 -4 6 2'), 1.6)],
      ['Braids: draw a middle part, then two braids made of little loops.', cut(cap, hs[2]) + ap('M162 64 L162 70') + uni(bL, [hs[2], cap]) + uni(bR, [hs[2], cap]) + ap('M140 166 l-4 6 M140 166 l4 6 M184 166 l-4 6 M184 166 l4 6')],
      ['Draw a face on each one: eyes, a nose and a smile.', xs.map(x => smile(x, 96, 20) + ac(x, 100, 1)).join('')],
      ['Color the skin and hair. Every person is different!', CL([SK[0], hs[0]], [SK[4], hs[1]], [SK[2], hs[2]], [HC[3], straight], [HC[0], curly], [HC[1], cap, ...bL, ...bR]) + fil('#F2604F', E(140, 166, 4, 2), E(184, 166, 4, 2))]
    ], { brush: 'pencil' }));
  }

  // ---- A real nose
  {
    const area = cr([[84, 34], [116, 34], [122, 100], [142, 126], [132, 146], [100, 152], [68, 146], [58, 126], [78, 100]], true);
    PT.push(L('pt-nose', 'portraits', 2, 'A real nose', '👃', PS, 'A nose is mostly shading! Real noses have very few lines. Light and shadow show the shape.', [
      ['Draw a light circle for the tip of the nose, and a smaller circle on each side.', guide(ac(100, 118, 18) + ac(72, 128, 11) + ac(128, 128, 11))],
      ['Draw two light lines going up from the sides, for the bridge of the nose.', guide(ap('M88 34 L84 104 M112 34 L116 104'))],
      ['Draw the two nostrils under the big circle, like little beans.', T('#22305A', ap('M80 138 q8 -8 16 0 q-8 4 -16 0 Z M120 138 q-8 -8 -16 0 q8 4 16 0 Z')) + ap('M80 138 q8 -8 16 0 M120 138 q-8 -8 -16 0')],
      ['Draw the nostril wings around the small circles.', ap('M70 112 Q56 128 70 140 Q76 144 82 140 M130 112 Q144 128 130 140 Q124 144 118 140')],
      ['Shade one side of the bridge, under the tip, and the side of each wing.', hatch(cr([[110, 40], [118, 40], [124, 106], [114, 104]], true), 40, 3) + hatch(E(100, 148, 26, 5), 40, 3) + hatch(E(134, 128, 4, 10), 40, 3)],
      ['Erase the guides. Color the skin. Leave a bright spot on the tip!', CL([SK[2], area]) + paint('#FFF', ae(96, 114, 5, 3)), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Five feelings on a real face
  {
    const pos = [[38, 50], [100, 50], [162, 50], [68, 140], [132, 140]], w = 46, h = 58;
    const opts = [{ smile: 1, open: 0.75 }, { smile: -1, brow: 'sad', down: 1 }, { mouth: 'o', brow: 'up', open: 1.35 }, { smile: -0.4, brow: 'angry', open: 0.7 }, { open: 0, small: 1, mouth: 'o' }];
    const F = pos.map(([x, y], i) => face(x, y, w, h, opts[i]));
    const hair = [hairCap(38, 44, 25), hairLong(100, 44, 25, 1.1), hairCurly(162, 42, 24), hairCap(68, 134, 25), hairCap(132, 134, 25)];
    PT.push(L('pt-feel', 'portraits', 2, 'Five feelings on a real face', '😮', P, 'Feelings live in the eyebrows and the mouth. Make the faces yourself in a mirror first!', [
      ['Draw five face shapes. Draw a light line across the middle of each one for the eyes.', F.map(f => ap(f.head.d)).join('') + guide(F.map(f => al(f.x - 20, f.y, f.x + 20, f.y)).join(''))],
      ['Happy: a big smile, cheeks pushed up, eyes a little squeezed.', F[0].feat + thin(ap('M20 58 q4 4 8 4 M56 58 q-4 4 -8 4'))],
      ['Sad: the eyebrows go up in the middle, the mouth turns down. Add a tear.', F[1].feat + paint('#7DBDEB', ap('M88 58 q-3 5 0 7 q3 -2 0 -7z'))],
      ['Surprised: eyebrows way up, eyes wide open, mouth in an O.', F[2].feat],
      ['Angry: eyebrows pushed down in the middle, a flat frown.', F[3].feat + thin(ap('M66 120 l2 4 M70 120 l-2 4'))],
      ['Sleepy: closed eyes curving down, a yawn, and a "z".', F[4].feat + W(ap('M156 104 h8 l-8 8 h8 M166 92 h6 l-6 6 h6'), 2)],
      ['Erase the guides. Add hair and color each face. Can you make all five faces?', hair.map((s, i) => cut(s, F[i].head)).join('') + CL(...F.map((f, i) => [SK[i], f.head]), ...hair.map((s, i) => [HC[[0, 2, 0, 1, 3][i]], s])) + F.map(f => T('#E58A92', ap(f.lips.d))).join(''), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- A face from the side
  {
    const prof = 'M72 46 Q60 60 62 78 Q62 86 58 92 Q52 104 44 114 Q42 120 50 121 L56 122 Q54 126 57 130 L53 134 Q56 138 58 140 Q56 146 60 152 Q66 162 80 160';
    const skin = cr([[74, 44], [110, 34], [146, 50], [156, 90], [146, 128], [140, 146], [150, 196], [84, 196], [84, 162], [62, 154], [56, 140], [54, 130], [46, 120], [58, 92], [62, 72]], true);
    const hair = cr([[70, 50], [96, 30], [134, 36], [156, 70], [158, 108], [150, 140], [138, 148], [134, 116], [120, 92], [100, 70], [78, 64]], true);
    const bun = E(156, 52, 15, 13);
    PT.push(L('pt-profile', 'portraits', 2, 'A face from the side', '🗿', PS, 'From the side, the eye is shaped like an arrowhead, and the ear sits right in the middle of the head.', [
      ['Draw a big light circle for the head. Add a light line down to the chin.', guide(ac(108, 88, 46) + ap('M66 92 L80 160 L130 136'))],
      ['Draw the face line: forehead, a bump for the nose, the lips, then the chin.', ap(prof)],
      ['Draw the jaw back to the ear, and the neck going down.', ap('M80 160 Q104 160 120 146 Q128 138 128 128 M86 162 Q88 180 84 196 M136 146 Q140 172 150 196')],
      ['Draw the eye like a sideways arrowhead. Add the eyebrow above it.', ap('M70 92 L84 87 M70 92 L82 98') + T('#22305A', ae(76, 92, 2.4, 4)) + ap('M64 80 Q76 74 90 80')],
      ['Draw the ear in the middle of the head: a C shape with a curl inside.', ap('M120 98 Q138 92 138 112 Q138 130 124 134') + thin(ap('M124 104 Q132 104 130 114 Q128 122 124 120'))],
      ['Draw the hair over the top and back, and a round bun.', ap(hair.d) + cut(bun, hair) + thin(ap('M84 52 Q110 44 132 62 M96 46 Q124 46 144 80 M110 40 Q140 52 150 96'), 1.6)],
      ['Color the skin, the hair and the lips. Shade under the jaw.', CL([SK[3], skin], [HC[0], hair, bun], ['#B5566A', cr([[54, 122], [58, 124], [57, 130], [53, 134], [56, 138]], true)]) + hatch(cr([[86, 160], [120, 148], [136, 150], [138, 166], [90, 172]], true), 40, 3), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Baby, kid and grandparent
  {
    const B = face(36, 104, 50, 52, { t: 0.6, round: 1, big: 1, smile: 0.6, small: 1 }), K = face(100, 96, 50, 62, { t: 0.53, smile: 0.8 }), G = face(164, 88, 50, 70, { t: 0.5, smile: 0.5 });
    const gHair = cr([[136, 86], [138, 62], [150, 50], [164, 50], [178, 50], [190, 62], [192, 86], [184, 70], [164, 62], [144, 70]], true);
    const kHair = hairCurly(100, 74, 28);
    PT.push(L('pt-ages', 'portraits', 2, 'Baby, kid and grandparent', '👵', P, 'Babies have big round heads with the eyes low down. As we grow, the face gets longer.', [
      ['Draw three heads: a round one for the baby, an egg for the kid, a long egg for grandpa.', o(B.head, K.head, G.head)],
      ['Draw light eye lines. The baby\'s eyes are low. Grandpa\'s are halfway down.', guide(al(10, B.y, 62, B.y) + al(74, K.y, 126, K.y) + al(138, G.y, 190, G.y))],
      ['Draw the baby: big eyes, a tiny nose and mouth, and one curl of hair.', B.feat + ap('M36 78 q-6 -6 0 -10 q6 2 2 6')],
      ['Draw the kid: eyes, nose, smile and ears. Add curly hair.', K.feat + K.ears + cut(kHair, K.head)],
      ['Draw grandpa: eyes, nose, smile and bigger ears. Add wrinkles by the eyes and mouth.', G.feat + G.ears + thin(ap('M140 86 l-4 -2 M140 90 l-4 2 M188 86 l4 -2 M188 90 l4 2 M150 106 q-4 8 0 14 M178 106 q4 8 0 14 M152 64 q12 -3 24 0 M154 70 q10 -2 20 0'), 1.5)],
      ['Give grandpa round glasses and white hair on the sides.', ac(152, 88, 9) + ac(176, 88, 9) + ap('M161 88 h6 M143 86 l-6 -2 M185 86 l6 -2') + cut(gHair, G.head)],
      ['Erase the guides. Color their skin and hair.', CL([SK[1], B.head], [SK[2], K.head, K.earL, K.earR], [SK[3], G.head, G.earL, G.earR], [HC[2], kHair], [HC[4], gHair]) + T('#E58A92', ap(B.lips.d) + ap(K.lips.d)), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- A portrait with neck and shoulders
  {
    const f = face(100, 74, 66, 88, { smile: 0.5 }), hair = cr([[64, 120], [58, 60], [74, 32], [100, 22], [126, 32], [142, 60], [136, 120], [128, 124], [130, 70], [116, 52], [92, 50], [74, 62], [72, 124]], true);
    const shoulders = cr([[86, 140], [60, 152], [26, 168], [12, 200], [188, 200], [174, 168], [140, 152], [114, 140]]);
    const shirt = cr([[86, 146], [60, 152], [26, 168], [12, 200], [188, 200], [174, 168], [140, 152], [114, 146], [100, 162]], true);
    PT.push(L('pt-portrait', 'portraits', 2, 'A portrait with shoulders', '🧑', PS, 'Shoulders are much wider than the head: about 3 heads wide for a grown-up!', [
      ['Draw an egg shape for the head, with light lines across for the eyes, nose and mouth.', ap(f.head.d) + guide(al(60, f.y, 140, f.y) + al(100, f.top, 100, f.chin) + al(80, f.ny, 120, f.ny) + al(84, f.my, 116, f.my))],
      ['Draw the eyes on the eye line, one eye apart. Add the eyebrows.', f.eyes + f.brows],
      ['Draw the nose on the nose line, and the mouth on the mouth line.', f.nose + f.mouth],
      ['Draw the ears between the eye line and the nose line.', f.ears],
      ['Draw the neck going down, then the shoulders sloping out wide.', cut(f.neck, f.head) + ap(shoulders.d)],
      ['Draw a collar on the shirt, and long hair around the face.', ap('M86 146 L100 166 L114 146') + cut(hair, f.head, f.neck, E(100, 196, 100, 40))],
      ['Erase the guides. Color the skin, hair and shirt.', CL([SK[4], f.head, f.neck, f.earL, f.earR], ['#2E8BE6', shirt], [HC[0], hair], ['#B5566A', f.lips]), { clear: true }],
      ['Add soft shading: under the chin, beside the nose, and on one side of the neck.', hatch(cr([[86, 128], [114, 128], [112, 142], [88, 142]], true), 40, 3) + hatch(E(110, 96, 3, 8), 40, 2.6) + hatch(E(124, 92, 5, 18), 40, 3)]
    ], { brush: 'pencil' }));
  }

  // ---- Three-quarter view (Master)
  {
    const head = cr([[96, 36], [132, 40], [152, 66], [154, 100], [146, 124], [128, 146], [104, 160], [86, 158], [74, 144], [66, 124], [62, 108], [64, 100, 1], [60, 92], [62, 80], [66, 60], [78, 44]], true);
    const hair = cr([[60, 92], [60, 56], [84, 32], [118, 28], [150, 44], [164, 80], [160, 118], [150, 128], [152, 92], [140, 64], [118, 56], [96, 62], [76, 60], [66, 76]], true);
    const eyeFar = cr([[66, 96, 1], [74, 91], [82, 96, 1], [74, 99]], true), eyeNear = cr([[98, 98, 1], [110, 91], [124, 97, 1], [110, 102]], true);
    const ear = cr([[140, 98], [154, 92], [158, 108], [150, 126], [142, 122]], true);
    PT.push(L('pt-34', 'portraits', 3, 'A face in three-quarter view', '🧑‍🦱', PS, 'When a head turns, the middle line curves and moves. Things on the far side look smaller.', [
      ['Draw a light circle for the head. The face is turning, so curve the middle line to the left.', guide(ac(106, 86, 48) + ap('M86 38 Q68 92 86 158'))],
      ['Draw a light eye line that curves around the head, like a line on a ball.', guide(ap('M58 94 Q100 100 156 90'))],
      ['Draw the face outline: the far cheek bumps at the brow and cheekbone. The jaw goes back to the ear.', ap(head.d)],
      ['Draw the far eye small and narrow. The near eye is bigger.', o(eyeFar, eyeNear) + T('#22305A', ac(76, 95, 2.5) + ac(112, 96, 3.6)) + ap('M64 86 Q74 82 84 86 M96 86 Q110 80 126 86')],
      ['Draw the nose pointing left. It covers a little of the far cheek.', ap('M90 100 Q86 114 76 124 Q72 130 80 131 Q84 134 90 130') + ap('M90 130 q6 2 10 -2')],
      ['Draw the mouth. The far half is shorter than the near half.', ap('M78 144 Q90 147 110 142') + thin(ap('M84 150 Q94 154 104 150'), 2)],
      ['Draw the ear far back on the right, behind the jaw.', cut(ear, head) + thin(ap('M146 102 Q152 104 150 112'))],
      ['Draw the hair, parted on the side, covering the top and back of the head.', cut(hair, head, ear) + thin(ap('M84 40 Q110 48 132 70 M96 34 Q126 40 148 68'), 1.6)],
      ['Erase the guides. Color, and shade the far side of the face, beside the nose and under the jaw.', CL([SK[2], head, ear], [HC[1], hair]) + hatch(cr([[64, 100], [72, 104], [74, 124], [66, 124]], true), 40, 2.6) + hatch(cr([[96, 104], [92, 122], [100, 128]], true), 40, 2.6) + hatch(cr([[104, 160], [128, 146], [134, 160], [110, 168]], true), 40, 2.6) + T('#D97B80', ap('M78 144 Q90 147 110 142 Q94 154 78 144Z')), { clear: true }]
    ], { brush: 'pencil' }));
  }

  // ---- Self-portrait in a mirror (Master)
  {
    const glass = E(100, 88, 60, 76), frame = E(100, 88, 68, 84), handle = band([[100, 170], [100, 198]], 20, 18);
    const f = face(100, 80, 52, 70, { smile: 0.6 }), hair = hairSide(100, f.y - 6, 30, 1), neck = band([[100, 104], [100, 140]], 26, 28);
    const shirt = cr([[88, 134], [70, 140], [60, 148], [74, 155], [100, 160], [126, 155], [140, 148], [130, 140], [112, 134]], true);
    const inG = s => ap(runs(s, p => !inside(p, glass)));
    PT.push(L('pt-mirror', 'portraits', 3, 'A self-portrait in a mirror', '🪞', PS, 'Artists like Frida Kahlo and Rembrandt painted lots of self-portraits. Look closely at yourself!', [
      ['Draw a big oval mirror, with a second oval around it for the frame.', o(glass, frame)],
      ['Draw a handle at the bottom of the frame.', cut(handle, frame)],
      ['Look in a real mirror! Draw your head shape and light guide lines.', ap(f.head.d) + guide(al(70, f.y, 130, f.y) + al(100, f.top, 100, f.chin) + al(84, f.ny, 116, f.ny))],
      ['Draw your eyes and eyebrows. What color are your eyes?', f.eyes + f.brows],
      ['Draw your nose, your mouth and your ears.', f.nose + f.mouth + f.ears],
      ['Draw your hair, just the way it really is. Add your neck and shoulders.', cut(hair, f.head) + ap(runs(neck, p => inside(p, f.head) || inside(p, shirt) || !inside(p, glass))) + inG(cr([[56, 152], [72, 140], [90, 134]])) + inG(cr([[144, 152], [128, 140], [110, 134]])) + ap('M90 134 Q100 144 110 134')],
      ['Erase the guides. Draw a few white shine lines on the glass.', pen('#9FB3C8', ap('M52 66 L66 50 M52 84 L78 56 M136 120 L150 104'), 3), { clear: true }],
      ['Color yourself, the frame and the glass. Sign your name, like a real artist!', CL(['#E3B866', handle], ['#EAF5FC', glass], [SK[3], f.head, neck, f.earL, f.earR], ['#F2604F', shirt], [HC[0], hair], ['#B5566A', f.lips]) + ring('#C9A04F', frame, glass) + pen('#22305A', ap('M138 194 q4 -8 8 0 q4 -8 8 0 q4 -6 8 -2'), 2)]
    ], { brush: 'pencil' }));
  }

  // ---- Shading a face (Master)
  {
    const f = face(104, 84, 72, 96, { smile: 0.3 }), hair = hairCap(104, 80, 46, 0.6);
    const shadow = cr([[134, 52], [140, 84], [134, 112], [122, 128], [114, 132], [128, 108], [132, 84], [128, 60]], true);
    const neckSh = cr([[84, 132], [124, 132], [124, 150], [84, 142]], true);
    PT.push(L('pt-shade', 'portraits', 3, 'Shading a face', '🌗', PS, 'Shadows are on the side away from the light. Press lightly, and add layers to make it darker.', [
      ['Draw a face with all the parts: eyes, nose, mouth, ears and neck.', ap(f.head.d) + f.feat + f.ears + cut(f.neck, f.head)],
      ['Draw the hair on top.', cut(hair, f.head)],
      ['Decide where the light comes from. Draw a little sun on the left.', ac(20, 24, 9) + ap('M20 8 v-4 M20 40 v4 M4 24 h-4 M36 24 h4 M8 12 l-3 -3 M32 12 l3 -3')],
      ['Shade the right side of the face, away from the sun, with soft slanted lines.', hatch(shadow, 45, 3)],
      ['Shade the eye sockets under the brows, and the right side of the nose.', hatch(E(84, 78, 9, 3), 45, 2.4) + hatch(E(124, 78, 9, 3), 45, 2.4) + hatch(cr([[110, 90], [114, 104], [108, 104]], true), 45, 2)],
      ['Shade under the nose, under the bottom lip, and the neck under the chin.', hatch(E(104, 112, 8, 2.5), 45, 2) + hatch(E(104, 132, 7, 2.5), 45, 2) + hatch(neckSh, 45, 3)],
      ['Make the darkest places darker: cross-hatch the other way, under the chin and the right edge.', hatch(neckSh, -45, 3) + hatch(cr([[136, 64], [140, 84], [134, 110], [130, 84]], true), -45, 3)],
      ['Color the skin on top of your shading. The pencil shows through, so the face looks round!', CL([SK[2], f.head, f.neck, f.earL, f.earR], [HC[0], hair], ['#C76B74', f.lips]) + paint('#FFF6EA', ae(86, 66, 7, 3) + ae(98, 106, 3, 2))]
    ], { brush: 'pencil' }));
  }

  PT.forEach(l => LESSONS.push(l));

}/*}lazy*/);
