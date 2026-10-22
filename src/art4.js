/* ---------- art4: farm, jungle & safari, pets, space, sports & play, buildings & cities ---------- */
// Uses the helpers from art.js (ac, ae, al, ap, ar, apg, apl, guide, paint, atext).
// Wrapped in a function so the little helpers below never clash with other files.
ART_LATER.push(() => {
  const f1 = n => +n.toFixed(1);
  const DEG = Math.PI / 180, STEP = 3;

  /* Shapes are kept as lists of points, so a shape at the back can stop exactly where a front shape begins. */
  const ell = (cx, cy, rx, ry, rot = 0) => {
    const n = Math.max(24, Math.round(Math.PI * (rx + ry) / STEP)), c = Math.cos(rot * DEG), s = Math.sin(rot * DEG), pts = [];
    for (let i = 0; i < n; i++) { const t = i / n * 2 * Math.PI, x = rx * Math.cos(t), y = ry * Math.sin(t); pts.push([cx + x * c - y * s, cy + x * s + y * c]); }
    return { pts, closed: true };
  };
  const circ = (cx, cy, r) => ell(cx, cy, r, r);
  // Part of an ellipse, from angle a0 to a1 (degrees, measured before turning by rot).
  const arcE = (cx, cy, rx, ry, a0, a1, rot = 0) => {
    const n = Math.max(6, Math.round(Math.abs(a1 - a0) * DEG * (rx + ry) / 2 / STEP)), c = Math.cos(rot * DEG), s = Math.sin(rot * DEG), pts = [];
    for (let i = 0; i <= n; i++) { const t = (a0 + (a1 - a0) * i / n) * DEG, x = rx * Math.cos(t), y = ry * Math.sin(t); pts.push([cx + x * c - y * s, cy + x * s + y * c]); }
    return { pts, closed: false };
  };
  const dens = (pts, closed) => {
    const out = [], m = closed ? pts.length : pts.length - 1;
    for (let i = 0; i < m; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length], k = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / STEP));
      for (let j = 0; j < k; j++) out.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]);
    }
    if (!closed) out.push(pts[pts.length - 1]);
    return out;
  };
  const poly = (p, closed = true) => {
    const pts = typeof p === 'string' ? p.trim().split(/\s+/).map(q => q.split(',').map(Number)) : p;
    return { pts: dens(pts, closed), closed };
  };
  const rect = (x, y, w, h) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
  const seg = (x1, y1, x2, y2) => poly([[x1, y1], [x2, y2]], false);
  // A fat strip from one point to another, w wide (arms, legs, posts).
  const bar = (x1, y1, x2, y2, w) => {
    const L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L * w / 2, ny = (x2 - x1) / L * w / 2;
    return poly([[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]]);
  };
  const rrect = (x, y, w, h, r) => {
    const pts = [], q = (cx, cy, a0) => { for (let i = 0; i <= 6; i++) { const a = (a0 + i * 15) * DEG; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } };
    q(x + w - r, y + r, -90); q(x + w - r, y + h - r, 0); q(x + r, y + h - r, 90); q(x + r, y + r, 180);
    return poly(pts);
  };
  // Read a simple path (absolute M L H V Q C Z) into points.
  const pth = d => {
    const tk = d.match(/[MLHVQCZ]|-?\d*\.?\d+/g), pts = [];
    let i = 0, cmd = '', x = 0, y = 0, closed = false;
    const num = () => +tk[i++];
    const add = (fn, L) => { const k = Math.max(2, Math.ceil(L / STEP)); for (let j = 1; j <= k; j++) pts.push(fn(j / k)); };
    while (i < tk.length) {
      if (/[A-Z]/.test(tk[i])) cmd = tk[i++];
      const x0 = x, y0 = y;
      if (cmd === 'Z') { closed = true; continue; }
      if (cmd === 'M') { x = num(); y = num(); pts.push([x, y]); cmd = 'L'; continue; }
      if (cmd === 'L' || cmd === 'H' || cmd === 'V') {
        if (cmd === 'H') x = num(); else if (cmd === 'V') y = num(); else { x = num(); y = num(); }
        const X = x, Y = y; add(t => [x0 + (X - x0) * t, y0 + (Y - y0) * t], Math.hypot(X - x0, Y - y0));
      } else if (cmd === 'Q') {
        const qx = num(), qy = num(); x = num(); y = num(); const X = x, Y = y;
        add(t => { const m = 1 - t; return [m * m * x0 + 2 * m * t * qx + t * t * X, m * m * y0 + 2 * m * t * qy + t * t * Y]; }, Math.hypot(qx - x0, qy - y0) + Math.hypot(X - qx, Y - qy));
      } else if (cmd === 'C') {
        const ax = num(), ay = num(), bx = num(), by = num(); x = num(); y = num(); const X = x, Y = y;
        add(t => { const m = 1 - t; return [m * m * m * x0 + 3 * m * m * t * ax + 3 * m * t * t * bx + t * t * t * X, m * m * m * y0 + 3 * m * m * t * ay + 3 * m * t * t * by + t * t * t * Y]; },
          Math.hypot(ax - x0, ay - y0) + Math.hypot(bx - ax, by - ay) + Math.hypot(X - bx, Y - by));
      } else i++;
    }
    if (closed) { const a = pts[0], b = pts[pts.length - 1]; if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.01) pts.pop(); }
    return { pts: closed ? dens(pts, true) : pts, closed };
  };
  // A bumpy cloud, bush or woolly shape: k bumps around an oval.
  const cloud = (cx, cy, rx, ry, k, a = 0.2, ph = 0) => {
    const n = Math.round(Math.PI * (rx + ry) * 1.4 / STEP), pts = [];
    for (let i = 0; i < n; i++) { const t = i / n * 2 * Math.PI, f = 1 - a + a * Math.sqrt(Math.abs(Math.sin(k * t / 2 + ph))); pts.push([cx + rx * f * Math.cos(t), cy + ry * f * Math.sin(t)]); }
    return { pts, closed: true };
  };
  // A leaf from its base to its tip, w wide.
  const leaf = (bx, by, tx, ty, w) => {
    const mx = (bx + tx) / 2, my = (by + ty) / 2, L = Math.hypot(tx - bx, ty - by), nx = -(ty - by) / L * w, ny = (tx - bx) / L * w;
    return pth(`M${bx} ${by} Q${f1(mx + nx)} ${f1(my + ny)} ${tx} ${ty} Q${f1(mx - nx)} ${f1(my - ny)} ${bx} ${by} Z`);
  };
  const inside = (sh, x, y) => {
    const p = sh.pts; let c = false;
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      const xi = p[i][0], yi = p[i][1], xj = p[j][0], yj = p[j][1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  // The parts of a shape you can see: not hidden by any front shape, and (if given) inside every keep shape.
  const visD = (sh, hide = [], keep = []) => {
    const ok = p => !hide.some(h => inside(h, p[0], p[1])) && keep.every(k => inside(k, p[0], p[1]));
    const P = sh.closed ? sh.pts.concat([sh.pts[0]]) : sh.pts, runs = [];
    let prev = ok(P[0]), cur = prev ? [P[0]] : null, all = prev;
    for (let i = 1; i < P.length; i++) {
      const a = P[i - 1], b = P[i], now = ok(b);
      if (now !== prev) {
        let lo = 0, hi = 1;
        for (let k = 0; k < 16; k++) { const m = (lo + hi) / 2; if (ok([a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m]) === prev) lo = m; else hi = m; }
        const m = (lo + hi) / 2, q = [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m];
        if (prev) { cur.push(q); runs.push(cur); cur = null; } else cur = [q];
        all = false;
      }
      if (now) cur.push(b);
      prev = now;
    }
    if (cur) runs.push(cur);
    const str = r => 'M' + r.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' ');
    if (sh.closed && all) return str(P.slice(0, -1)) + 'Z';
    if (sh.closed && runs.length > 1 && ok(P[0])) { const last = runs.pop(); runs[0] = last.concat(runs[0].slice(1)); }
    return runs.filter(r => r.length > 1).map(str).join('');
  };
  const V = (sh, hide, keep) => { const d = visD(sh, hide, keep); return d ? ap(d) : ''; };
  const D = sh => 'M' + sh.pts.map(p => f1(p[0]) + ' ' + f1(p[1])).join(' ') + 'Z';
  const F = sh => ap(D(sh));
  // Colour that soaks in like a marker: front colours cover back ones, and the lines stay visible.
  const M = s => `<g style="mix-blend-mode:multiply">${s}</g>`;
  const fat = (c, d, w) => d ? `<g class="sk" style="--sk:${c}"><path d="${d}" style="stroke-width:${w}"/></g>` : '';
  const starPts = (cx, cy, R, r, n = 5) => Array.from({ length: n * 2 }, (_, i) => {
    const a = (i * 180 / n - 90) * DEG, d = i % 2 ? r : R;
    return `${f1(cx + d * Math.cos(a))},${f1(cy + d * Math.sin(a))}`;
  }).join(' ');
  const star = (x, y, R) => apg(starPts(x, y, R, R * 0.45));
  const around = (n, R, cx, cy, f, a0 = -90) => Array.from({ length: n }, (_, i) => { const a = (a0 + i * 360 / n) * DEG; return f(f1(cx + R * Math.cos(a)), f1(cy + R * Math.sin(a)), a); }).join('');
  const SKY = '#D6EAFC', GRASS = '#6CC08B', NAVY = '#22305A', SUN = '#FFD966';
  const P = 'Paper, a pencil and crayons';

  ART_CATS.push(
    { id: 'farm', name: 'Farm Friends', ico: '🐄', blurb: 'Moo, oink, cluck and baa! Animals on the farm' },
    { id: 'jungle', name: 'Jungle & Safari', ico: '🦁', blurb: 'Monkeys, giraffes, zebras and tigers' },
    { id: 'pets', name: 'Pets', ico: '🐶', blurb: 'Puppies, kittens, bunnies and more' },
    { id: 'space', name: 'Space & Planets', ico: '🪐', blurb: 'Moons, rockets, aliens and planets' },
    { id: 'sports', name: 'Sports & Play', ico: '⚽', blurb: 'Balls, kites, bikes and the playground' },
    { id: 'city', name: 'Buildings & Cities', ico: '🏙️', blurb: 'Shops, skyscrapers, bridges and busy streets' }
  );

  /* ================= Farm ================= */
  {
    const muz = ell(52, 104, 21, 13), head = ell(52, 80, 22, 25), body = ell(118, 118, 54, 34);
    const earL = ell(28, 72, 11, 6, -25), earR = ell(76, 72, 11, 6, 25);
    const legs = [78, 96, 140, 156].map(x => rect(x, 125, 12, 53));
    const horns = 'M41 58.4 Q34 50 34 42 Q42 48 47 55.7 M63 58.4 Q70 50 70 42 Q62 48 57 55.7';
    const spots = 'M100 100 Q112 92 122 100 Q126 112 112 116 Q98 114 100 100 Z M140 120 Q154 114 160 126 Q156 138 144 136 Q134 130 140 120 Z M148 100 Q158 96 164 106 Q156 112 148 100 Z';
    LESSONS.push({ id: 'a4-cow', cat: 'farm', level: 1, title: 'A happy cow', ico: '🐄', need: P, tip: 'Cows have patches in all shapes. Make your spots any shape you like!', steps: [
      ['Draw a wide oval for the nose.', V(muz)],
      ['Draw a bigger oval on top for the head. Stop where it touches the nose.', V(head, [muz])],
      ['Add two floppy ears and two little horns.', V(earL, [head]) + V(earR, [head]) + ap(horns)],
      ['Give your cow two eyes, two nose holes and a smile.', ac(44, 78, 3.5) + ac(60, 78, 3.5) + ae(45, 103, 2.5, 3.5) + ae(59, 103, 2.5, 3.5) + ap('M46 110 Q52 114 58 110')],
      ['Draw a big oval for the body. Stop where it touches the head.', V(body, [head, muz])],
      ['Draw four legs like long boxes. Add a line near the bottom of each one for the hooves.', legs.map(l => V(l, [body])).join('') + [78, 96, 140, 156].map(x => al(x, 170, x + 12, 170)).join('')],
      ['Draw some spots on the body and a swishy tail.', ap(spots) + ap('M171.1 112 Q186 124 181 148') + V(ell(181, 155, 5, 8))],
      ['Color it in! Black spots, a pink nose and green grass. Moo!', M(paint(GRASS, ar(0, 172, 200, 28)) + paint('#fff', legs.map(F).join('') + F(body) + F(head)) + paint('#F7A39A', F(muz) + F(earL) + F(earR)) + paint('#3B3B48', ap(spots) + F(ell(181, 155, 5, 8)) + [78, 96, 140, 156].map(x => ar(x, 170, 12, 8)).join('') + ac(44, 78, 3.5) + ac(60, 78, 3.5)) + paint('#E8C27A', ap(horns)))]] });
  }
  {
    const head = circ(62, 92, 30), body = ell(122, 112, 55, 40), snout = ell(62, 104, 14, 10);
    const earL = poly('40,72 30,50 54,64'), earR = poly('84,72 94,50 70,64');
    const legs = [82, 104, 138, 158].map(x => rect(x, 128, 14, 40));
    const mud = ell(122, 172, 66, 9);
    LESSONS.push({ id: 'a4-pig', cat: 'farm', level: 1, title: 'A pink pig', ico: '🐷', need: P, tip: 'Pigs roll in mud to keep cool. Add lots of brown splashes!', steps: [
      ['Draw a big circle for the head.', V(head)],
      ['Draw an oval snout in the middle, with two nose holes.', V(snout) + ae(57, 104, 2.5, 4) + ae(67, 104, 2.5, 4)],
      ['Add two eyes and a happy smile.', ac(52, 86, 3.5) + ac(72, 86, 3.5) + ap('M54 116 Q62 121 70 116')],
      ['Draw two pointy triangle ears on top. Stop where they touch the head.', V(earL, [head]) + V(earR, [head])],
      ['Draw a big oval body behind the head. Stop where it touches.', V(body, [head])],
      ['Draw four short legs. Add a little line at the bottom of each one.', legs.map(l => V(l, [body, head])).join('') + [82, 104, 138, 158].map(x => al(x + 7, 161, x + 7, 168)).join('')],
      ['Add a curly tail and a muddy puddle under the feet.', ap('M175.9 104 C186 100 190 112 182 112 C176 112 178 102 190 98') + V(mud, legs)],
      ['Color your pig pink, and the mud brown. Oink!', M(paint('#C99A6E', F(mud)) + paint('#F7A39A', legs.map(F).join('') + F(body) + F(earL) + F(earR) + F(head)) + paint('#F78FB3', F(snout)) + fat('#F78FB3', 'M175.9 104 C186 100 190 112 182 112 C176 112 178 102 190 98', 5) + paint(NAVY, ac(52, 86, 3.5) + ac(72, 86, 3.5)))]] });
  }
  {
    const head = circ(70, 80, 20), body = ell(108, 118, 48, 38);
    const comb = 'M62 61.7 Q58 50 66 52 Q68 42 74 50 Q82 46 80 62.7', wattle = 'M53 90.5 Q48 104 56 104 Q60 102 58 96';
    const tail = pth('M140 96 Q146 66 166 62 Q162 72 176 72 Q170 82 184 86 Q174 96 182 106 Q166 108 150 116 Z');
    const wing = pth('M92 116 Q112 98 136 112 Q130 132 106 134 Q92 130 92 116 Z');
    const feet = al(98, 155.2, 96, 176) + al(96, 176, 86, 180) + al(96, 176, 96, 184) + al(96, 176, 106, 180) + al(118, 155.2, 120, 176) + al(120, 176, 110, 180) + al(120, 176, 120, 184) + al(120, 176, 130, 180);
    LESSONS.push({ id: 'a4-chicken', cat: 'farm', level: 2, title: 'A little chicken', ico: '🐔', need: P, tip: 'Draw the head first, then the body behind it. Front things come first!', steps: [
      ['Draw a small circle for the head, with a dot for the eye.', V(head) + ac(64, 76, 3)],
      ['Add a pointy triangle beak on the side.', apl('50.9,74 36,81 51.7,88') + al(44, 81, 51, 81)],
      ['Draw a bumpy comb on top, and a wobbly wattle under the beak.', ap(comb) + ap(wattle)],
      ['Draw a big oval for the body. Stop where it touches the head.', V(body, [head])],
      ['Draw a wavy, feathery tail at the back. Stop where it touches the body.', V(tail, [body]) + V(seg(150, 104, 166, 72), [body]) + V(seg(152, 108, 176, 88), [body])],
      ['Draw a wing in the middle of the body, with a feather line.', V(wing) + ap('M100 126 Q114 118 130 116')],
      ['Draw two skinny legs with three toes each, like a fork.', feet],
      ['Color your chicken. Can you draw an egg next to her?', V(ell(162, 172, 10, 13)) + M(paint(GRASS, ar(0, 178, 200, 22)) + paint('#B97A50', F(tail)) + paint('#E8A86B', F(body) + F(head)) + paint('#C98A55', F(wing)) + paint('#F2604F', ap(comb + 'Z') + ap(wattle + 'Z')) + paint('#FF9F43', apg('50.9,74 36,81 51.7,88')) + fat('#FF9F43', 'M98 155 L96 176 M120 176 L118 155', 5) + paint('#FFF3C4', F(ell(162, 172, 10, 13))))]] });
  }
  {
    const head = ell(52, 98, 16, 22), earL = ell(32, 86, 11, 5, -20), earR = ell(72, 86, 11, 5, 20);
    const body = cloud(114, 106, 52, 38, 9, 0.2);
    const legs = [76, 96, 132, 150].map(x => rect(x, 126, 9, 50));
    const flower = around(5, 6, 176, 150, (x, y) => ac(x, y, 4));
    LESSONS.push({ id: 'a4-sheep', cat: 'farm', level: 2, title: 'A fluffy sheep', ico: '🐑', need: P, tip: 'Bumpy lines look soft and fluffy. Try bumpy clouds and bushes too!', steps: [
      ['Draw a tall oval for the face.', V(head)],
      ['Add two ears sticking out the sides. Stop where they touch the face.', V(earL, [head]) + V(earR, [head])],
      ['Draw two sleepy eyes and a little nose.', ap('M42 94 Q46 98 50 94 M54 94 Q58 98 62 94') + ap('M48 108 Q52 112 56 108') + al(52, 110, 52, 114)],
      ['Draw a big bumpy cloud for the woolly body. Stop at the face and the ear.', V(body, [head, earR])],
      ['Draw four thin legs under the wool.', legs.map(l => V(l, [body])).join('')],
      ['Draw the grass and a little flower.', al(0, 176, 200, 176) + al(176, 176, 176, 156) + flower + ac(176, 150, 3)],
      ['Color the face and legs gray, and leave the wool soft and white. Baa!', M(paint(SKY, ar(0, 0, 200, 176)) + paint(GRASS, ar(0, 176, 200, 24)) + paint('#9AA1AB', legs.map(F).join('') + F(earL) + F(earR) + F(head)) + paint('#FBF6EC', F(body)) + paint('#F78FB3', flower) + paint(SUN, ac(176, 150, 3)))]] });
  }
  {
    const barn = poly('45,180 45,112 55,86 80,68 105,86 115,112 115,180', false), barnC = poly('45,180 45,112 55,86 80,68 105,86 115,112 115,180');
    const silo = pth('M120 180 V80 Q120 69 131 69 Q142 69 142 80 V180 Z'), siloOpen = pth('M120 180 V80 Q120 69 131 69 Q142 69 142 80 V180');
    const hillD = 'M0 120 Q40 100 80 118 Q130 136 200 110';
    const posts = [148, 164, 180, 196].map(x => rect(x, 146, 6, 34));
    const tree = al(175, 117.9, 175, 109) + ac(175, 103, 6);
    const sky = pth(hillD + ' V0 H0 Z'), land = pth(hillD + ' V200 H0 Z');
    LESSONS.push({ id: 'a4-farm', cat: 'farm', level: 3, title: 'A farm with a red barn', ico: '🚜', need: P, tip: 'Things in front hide things behind. Far away things are small and high up.', steps: [
      ['Draw the barn: two walls going up, then a roof that bends like a hat.', V(barn)],
      ['Draw a line under the roof. Then add big double doors with an X on each.', al(45, 112, 115, 112) + ar(62, 140, 36, 40) + al(80, 140, 80, 180) + al(62, 140, 80, 180) + al(80, 140, 62, 180) + al(80, 140, 98, 180) + al(98, 140, 80, 180)],
      ['Draw a little square window up high, for the hay.', ar(72, 88, 16, 16) + al(80, 88, 80, 104)],
      ['Draw a tall tube with a round top next to the barn. It is a silo, where food is kept.', V(siloOpen) + al(120, 100, 142, 100) + al(120, 130, 142, 130) + al(120, 160, 142, 160)],
      ['Draw the hills far behind. Stop when you reach the barn, then start again after the silo.', V(pth(hillD), [barnC, silo])],
      ['Add a fence, and a path coming toward you. It gets wider as it gets closer!', posts.map(p => V(p)).join('') + V(seg(144, 156, 200, 156), posts) + V(seg(144, 168, 200, 168), posts) + al(64, 180, 48, 200) + al(96, 180, 112, 200)],
      ['Far things look small. Draw a tiny tree on the hill, a sun and a cloud.', tree + ac(172, 34, 13) + V(cloud(40, 34, 24, 11, 5, 0.3))],
      ['Color it! A red barn, a gray silo and green hills. What animals live here?', M(paint(SKY, F(sky)) + paint(GRASS, F(land)) + paint('#E8C27A', apg('64,180 96,180 112,200 48,200')) + paint('#E0533F', F(barnC)) + paint('#9E2F25', apg('45,112 55,86 80,68 105,86 115,112') + ar(62, 140, 36, 40)) + paint('#FFF3C4', ar(72, 88, 16, 16)) + paint('#C9D3E0', F(silo)) + paint('#C99A6E', posts.map(F).join('') + ar(144, 154, 56, 4) + ar(144, 166, 56, 4)) + paint(SUN, ac(172, 34, 13)) + paint('#fff', F(cloud(40, 34, 24, 11, 5, 0.3))) + paint('#2FA36B', ac(175, 103, 6)))]] });
  }

  /* ================= Jungle & safari ================= */
  {
    const muz = ell(100, 100, 26, 18), eyeL = circ(87, 76, 14), eyeR = circ(113, 76, 14), head = circ(100, 84, 40);
    const earL = circ(58, 86, 13), earR = circ(142, 86, 13), inL = circ(56, 86, 7), inR = circ(144, 86, 7);
    const body = ell(100, 152, 30, 34), belly = ell(100, 160, 17, 18);
    const handL = circ(60, 178, 7), handR = circ(140, 178, 7);
    const armL = bar(78, 136, 60, 178, 14), armR = bar(122, 136, 140, 178, 14);
    const feetL = ell(84, 186, 12, 7), feetR = ell(116, 186, 12, 7);
    const tailD = 'M129.2 160 Q165 170 160 130 Q156 112 170 108 Q182 108 178 120';
    LESSONS.push({ id: 'a4-monkey', cat: 'jungle', level: 1, title: 'A cheeky monkey', ico: '🐒', need: P, tip: 'Two circles and an oval make a monkey face. Try different sizes for a baby!', steps: [
      ['Draw a wide oval for the mouth part of the face.', V(muz)],
      ['Draw two circles on top for the eye part. Stop where they touch.', V(eyeL, [muz, eyeR]) + V(eyeR, [muz, eyeL])],
      ['Draw a big circle all around the face. That is the head.', V(head)],
      ['Add round ears on the sides, with a circle inside each one.', V(earL, [head]) + V(earR, [head]) + V(inL, [head]) + V(inR, [head]) + ap('M98 44 Q96 34 104 32')],
      ['Give your monkey eyes, nose holes and a big smile.', ac(88, 78, 4) + ac(112, 78, 4) + ac(95, 95, 1.8) + ac(105, 95, 1.8) + ap('M86 106 Q100 118 114 106')],
      ['Draw an oval body and a round belly. Stop where the body touches the head.', V(body, [head]) + V(belly)],
      ['Add long arms with round hands, two feet and a curly tail.', V(handL) + V(handR) + V(armL, [body, handL]) + V(armR, [body, handR]) + V(feetL, [body]) + V(feetR, [body]) + ap(tailD)],
      ['Color your monkey brown with a light face. Give it a yellow banana!', M(fat('#C99A6E', tailD, 7) + paint('#C99A6E', F(earL) + F(earR) + F(feetL) + F(feetR) + F(armL) + F(armR) + F(handL) + F(handR) + F(body) + F(head)) + paint('#F3D3A8', F(inL) + F(inR) + F(belly) + F(eyeL) + F(eyeR) + F(muz)) + paint(NAVY, ac(88, 78, 4) + ac(112, 78, 4)))]] });
  }
  {
    const head = ell(56, 40, 20, 12), body = ell(122, 118, 42, 24), neck = poly('60,48 74,42 110,104 90,112');
    const ear = ell(74, 32, 7, 3, -30);
    const legX = [90, 106, 138, 152], legs = legX.map(x => rect(x, 124, 8, 62));
    const mane = [0.15, 0.3, 0.45, 0.6, 0.75].map(t => { const x = 74 + 36 * t, y = 42 + 62 * t; return al(f1(x), f1(y), f1(x + 6 * 0.865), f1(y - 6 * 0.502)); }).join('');
    const spots = ae(108, 112, 7, 5) + ae(128, 106, 8, 6) + ae(148, 116, 7, 5) + ae(120, 128, 7, 5) + ae(140, 129, 6, 4) + ac(77, 64, 4.5) + ac(85, 80, 5) + ac(93, 95, 5);
    LESSONS.push({ id: 'a4-giraffe', cat: 'jungle', level: 1, title: 'A tall giraffe', ico: '🦒', need: P, tip: 'Giraffes are the tallest animals. Make the neck as long as you like!', steps: [
      ['Draw a small oval for the head, up high.', V(head)],
      ['Add two little horns with balls on top, and an ear.', al(52, 28.2, 50, 18) + ac(50, 15.5, 2.5) + al(62, 28.6, 63, 18) + ac(63, 15.5, 2.5) + V(ear, [head])],
      ['Draw a face: an eye, a nose dot and a smile.', ac(50, 37, 2.5) + ac(41, 41, 1.5) + ap('M40 46 Q46 49 52 47')],
      ['Draw a long, long neck: two lines going down from the head.', V(seg(60, 48, 90, 112), [head, body]) + V(seg(74, 42, 110, 104), [head, body])],
      ['Draw an oval body at the bottom of the neck. Stop where it touches.', V(body, [neck, head])],
      ['Draw four long, skinny legs and a tail.', legs.map(l => V(l, [body])).join('') + legX.map(x => al(x, 180, x + 8, 180)).join('') + ap('M162.7 112 Q170 124 168 146') + V(ell(168, 150, 3, 5))],
      ['Add patchy spots all over, and a little hairy mane.', spots + mane],
      ['Color your giraffe yellow with brown spots. What tree is it eating from?', M(paint(GRASS, ar(0, 182, 200, 18)) + paint(SUN, legs.map(F).join('') + F(neck) + F(body) + F(head)) + paint('#C99A6E', spots + ac(50, 15.5, 2.5) + ac(63, 15.5, 2.5) + F(ell(168, 150, 3, 5)) + legX.map(x => ar(x, 180, 8, 6)).join('')))]] });
  }
  {
    const head = ell(52, 68, 24, 12, 130), body = ell(118, 112, 44, 26), neck = poly('64,52 100,92 82,112 58,78');
    const ear = poly('60,54 63,36 68,54');
    const legX = [84, 100, 134, 150], legs = legX.map(x => rect(x, 120, 9, 64));
    const maneP = []; for (let i = 0; i <= 10; i++) { const x = 64 + 36 * i / 10, y = 52 + 40 * i / 10, o = i % 2 ? 7 : 0; maneP.push([f1(x + 0.743 * o), f1(y - 0.669 * o)]); }
    const mane = poly(maneP, false);
    const sBody = [90, 102, 114, 126, 138, 150].map((x, i) => visD(pth(`M${x} 80 Q${x + 8} ${i % 2 ? 108 : 116} ${x + 2} ${i % 2 ? 128 : 142}`), [neck], [body])).join('');
    const sNeck = [0.25, 0.45, 0.65].map(t => { const cx = 61 + 30 * t, cy = 65 + 37 * t; return visD(seg(cx - 22 * 0.743, cy + 22 * 0.669, cx + 22 * 0.743, cy - 22 * 0.669), [head], [neck]); }).join('');
    const sLegs = legs.map(l => [146, 158, 170].map(y => visD(seg(0, y, 200, y), [body], [l])).join('')).join('');
    const stripes = sBody + sNeck + sLegs;
    LESSONS.push({ id: 'a4-zebra', cat: 'jungle', level: 2, title: 'A stripy zebra', ico: '🦓', need: P, tip: 'Every zebra has its own stripes, like your fingerprints!', steps: [
      ['Draw a long oval for the head, tipped down like a horse.', V(head)],
      ['Add a pointy ear, an eye and a nose hole.', V(ear, [head]) + ac(58, 61, 2.5) + ac(41, 82, 2)],
      ['Draw the neck: two lines going down and to the right from the head.', V(seg(64, 52, 100, 92), [head, body]) + V(seg(58, 78, 82, 112), [head, body])],
      ['Draw a big oval body at the end of the neck. Stop where it touches.', V(body, [neck, head])],
      ['Draw four legs and a swishy tail with a tuft.', legs.map(l => V(l, [body])).join('') + legX.map(x => al(x, 178, x + 9, 178)).join('') + ap('M159.9 104 Q168 116 166 136') + V(ell(166, 143, 3.5, 7))],
      ['Draw a spiky mane along the top of the neck.', V(mane, [head, body])],
      ['Now the fun part: stripes! Draw curvy lines on the body, neck and legs.', ap(stripes)],
      ['Color every stripe black. Leave the gaps white!', M(paint('#FFE9B0', ar(0, 150, 200, 50)) + paint('#fff', legs.map(F).join('') + F(neck) + F(body) + F(head)) + fat('#2B2B33', stripes, 5) + paint('#2B2B33', legX.map(x => ar(x, 178, 9, 6)).join('') + F(ell(166, 143, 3.5, 7)) + apl(maneP.map(p => p.join(',')).join(' '))))]] });
  }
  {
    const nose = poly('90,104 110,104 100,116'), padL = circ(89, 124, 13), padR = circ(111, 124, 13), head = ell(100, 100, 62, 52);
    const earL = circ(52, 52, 16), earR = circ(148, 52, 16), inL = circ(52, 52, 8), inR = circ(148, 52, 8);
    const mir = s => s.split(' ').map(p => { const [x, y] = p.split(','); return `${f1(200 - x)},${y}`; }).join(' ');
    const sL = ['92,48.4 100,72 108,48.4', '66,56.5 86,70 74,52.8', '38.7,92 60,98 38.2,104', '39.7,112 58,116 43.8,122'];
    const sAll = sL.concat(sL.slice(1).map(mir));
    LESSONS.push({ id: 'a4-tiger', cat: 'jungle', level: 2, title: 'A tiger face', ico: '🐯', need: P, tip: 'Tiger stripes are pointy, like flames. Thick at one end, thin at the other.', steps: [
      ['Draw a triangle nose in the middle, pointing down.', V(nose)],
      ['Draw two round cheeks under the nose. Stop where they touch.', V(padL, [nose, padR]) + V(padR, [nose, padL])],
      ['Draw a big, wide oval all around for the head.', V(head)],
      ['Add two round ears on top, with a little circle inside each.', V(earL, [head]) + V(earR, [head]) + V(inL, [head]) + V(inR, [head])],
      ['Draw two eyes with dots in the middle.', ae(76, 88, 9, 7) + ac(76, 88, 3.5) + ae(124, 88, 9, 7) + ac(124, 88, 3.5)],
      ['Draw pointy stripes: three on top, and two on each cheek.', sAll.map(apl).join('')],
      ['Add a chin, whisker dots and long whiskers.', ap('M92 136.6 Q100 146 108 136.6') + ac(84, 121, 1.3) + ac(90, 128, 1.3) + ac(82, 129, 1.3) + ac(116, 121, 1.3) + ac(110, 128, 1.3) + ac(118, 129, 1.3) + al(75, 128, 56, 130) + al(76, 133, 58, 140) + al(125, 128, 144, 130) + al(124, 133, 142, 140)],
      ['Color it orange with black stripes and a white muzzle. Rawr!', M(paint('#FF9F43', F(earL) + F(earR) + F(head)) + paint('#F7A39A', F(inL) + F(inR)) + paint('#fff', F(padL) + F(padR) + ap('M92 136.6 Q100 146 108 136.6 Z')) + paint('#F78FB3', F(nose)) + paint('#2B2B33', sAll.map(apg).join('')) + paint('#B5D96B', ae(76, 88, 9, 7) + ae(124, 88, 9, 7)) + paint('#2B2B33', ac(76, 88, 3.5) + ac(124, 88, 3.5)))]] });
  }
  {
    const leafL = leaf(0, 200, 80, 106, 44), leafR = leaf(200, 200, 122, 110, 44);
    const ribL = visD(seg(4, 195, 78, 108), [], [leafL]), ribR = visD(seg(196, 195, 124, 112), [], [leafR]);
    const veins = (bx, by, tx, ty) => [0.3, 0.5, 0.7].map(t => { const x = bx + (tx - bx) * t, y = by + (ty - by) * t, dx = (tx - bx) / 120, dy = (ty - by) / 120; return al(f1(x), f1(y), f1(x + dx * 12 - dy * 14), f1(y + dy * 12 + dx * 14)) + al(f1(x), f1(y), f1(x + dx * 12 + dy * 14), f1(y + dy * 12 - dx * 14)); }).join('');
    const bush = cloud(100, 196, 64, 30, 9, 0.22), top = cloud(100, 14, 118, 46, 11, 0.2);
    const trunkD = 'M88 50 Q84 140 80 200 L120 200 Q114 140 112 50 Z', trunk = pth(trunkD);
    const vine1 = 'M40 50 Q50 80 38 100 Q28 118 42 132', vine2 = 'M164 50 Q154 74 166 96 Q176 112 162 124';
    const vl = [[44, 84, 56, 78], [33, 110, 22, 104], [158, 72, 146, 66], [170, 104, 182, 98]].map(([a, b, c, d]) => leaf(a, b, c, d, 5));
    const vines = V(pth(vine1), [top, leafL, leafR]) + V(pth(vine2), [top, leafL, leafR]) + vl.map(l => V(l, [leafL, leafR])).join('');
    const eyes = ae(88, 182, 6, 4.5) + ae(112, 182, 6, 4.5) + ac(89, 182, 2) + ac(113, 182, 2);
    LESSONS.push({ id: 'a4-jungle', cat: 'jungle', level: 3, title: 'A jungle scene', ico: '🌴', need: 'Paper, a pencil and lots of green crayons', tip: 'Draw the front first. Make front leaves dark and far leaves light.', steps: [
      ['Start at the front. Draw a giant leaf coming in from the bottom corner, with a line down the middle.', V(leafL) + ap(ribL) + veins(4, 195, 78, 108)],
      ['Draw another giant leaf from the other corner.', V(leafR) + ap(ribR) + veins(196, 195, 124, 112)],
      ['Draw a round bumpy bush in the middle. Stop where it touches the big leaves.', V(bush, [leafL, leafR])],
      ['Draw a big bumpy tree top across the sky.', V(top)],
      ['Draw the tree trunk going down from the tree top. Stop at the bush and the leaves.', V(pth('M88 50 Q84 140 80 200'), [top, bush, leafL, leafR]) + V(pth('M112 50 Q114 140 120 200'), [top, bush, leafL, leafR])],
      ['Hang some wiggly vines from the tree top, with little leaves.', vines],
      ['Who is hiding in the bush? Draw two peeking eyes!', eyes],
      ['Color the front leaves dark green and things far away lighter. Who lives in your jungle?', M(paint('#FFF3C4', ar(0, 0, 200, 200)) + paint('#B9E2C6', F(top)) + paint('#A87A55', F(trunk)) + fat('#6CC08B', visD(pth(vine1), [top]) + visD(pth(vine2), [top]), 4) + paint('#6CC08B', vl.map(F).join('')) + paint('#4FAE72', F(bush)) + paint('#1F7A4C', F(leafL) + F(leafR)) + paint(SUN, ae(88, 182, 6, 4.5) + ae(112, 182, 6, 4.5)) + paint('#2B2B33', ac(89, 182, 2) + ac(113, 182, 2)))]] });
  }

  /* ================= Pets ================= */
  {
    const earL = ell(56, 100, 15, 32, 15), earR = ell(144, 100, 15, 32, -15), head = ell(100, 92, 44, 42);
    const nose = ell(100, 106, 9, 6), muz = ell(100, 118, 22, 15), spot = circ(116, 84, 12);
    const collar = pth('M64 124 Q100 150 136 124 L136 134 Q100 160 64 134 Z'), tag = circ(100, 151, 6);
    const mouth = 'M100 112 V120 M100 120 Q93 127 86 121 M100 120 Q107 127 114 121', tongue = 'M95.8 123 Q100 136 104.2 123';
    LESSONS.push({ id: 'a4-puppy', cat: 'pets', level: 1, title: 'A puppy face', ico: '🐶', need: P, tip: 'Floppy ears make a puppy look cute. Try pointy ears for a different dog!', steps: [
      ['Draw two long floppy ears, like big leaves.', V(earL) + V(earR)],
      ['Draw a big round head between the ears. Stop where it touches them.', V(head, [earL, earR])],
      ['Draw two eyes. Put a round spot around one eye.', ac(84, 84, 5) + ac(116, 84, 5) + V(spot)],
      ['Draw a round nose in the middle.', V(nose)],
      ['Draw an oval under the nose. Add a mouth and a little tongue.', V(muz, [nose]) + ap(mouth) + ap(tongue)],
      ['Add a collar under the chin, with a round tag.', V(collar, [head, earL, earR]) + V(tag, [collar])],
      ['Color your puppy! What is its name? Write it on the tag.', M(paint('#E8C27A', F(head)) + paint('#B97A50', F(earL) + F(earR) + F(spot)) + paint('#FBF1DE', F(muz)) + paint('#F2604F', F(collar)) + paint(SUN, F(tag)) + paint('#F78FB3', ap(tongue + 'Z')) + paint('#2B2B33', F(nose) + ac(84, 84, 5) + ac(116, 84, 5)))]] });
  }
  {
    const head = circ(100, 70, 32), earL = poly('72,58 74,30 96,42'), earR = poly('128,58 126,30 104,42');
    const body = ell(100, 140, 36, 44), pawL = ell(87, 172, 10, 7), pawR = ell(113, 172, 10, 7);
    const tail = (() => { const c = pth('M132.1 160 Q170 165 166 130 Q163 112 174 106'), p = c.pts, L = [], R = [];
      p.forEach((q, i) => { const a = p[Math.max(0, i - 1)], b = p[Math.min(p.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = 5.5; L.push([q[0] - dy / l * w, q[1] + dx / l * w]); R.unshift([q[0] + dy / l * w, q[1] - dx / l * w]); });
      const e = p[p.length - 1], a = Math.atan2(L[L.length - 1][1] - e[1], L[L.length - 1][0] - e[0]), cap = [];
      for (let k = 1; k < 8; k++) { const t = a - k * Math.PI / 8; cap.push([e[0] + 5.5 * Math.cos(t), e[1] + 5.5 * Math.sin(t)]); }
      return poly(L.concat(cap, R)); })();
    LESSONS.push({ id: 'a4-kitten', cat: 'pets', level: 1, title: 'A sitting kitten', ico: '🐱', need: P, tip: 'A cat is a circle on top of an oval, with two triangles. Easy!', steps: [
      ['Draw a circle for the head.', V(head)],
      ['Add two pointy triangle ears. Stop where they touch the head. Draw a small line inside each.', V(earL, [head]) + V(earR, [head]) + V(pth('M80 52 L80 38 L90 45'), [head]) + V(pth('M120 52 L120 38 L110 45'), [head])],
      ['Draw the face: two eyes, a tiny nose, a mouth like a w, and whiskers.', ae(88, 68, 5, 6) + ae(112, 68, 5, 6) + apg('96,78 104,78 100,83') + ap('M100 83 Q96 89 91 86 M100 83 Q104 89 109 86') + al(69, 78, 52, 74) + al(71.2, 84, 54, 88) + al(131, 78, 148, 74) + al(128.8, 84, 146, 88)],
      ['Draw a big oval body under the head. Stop where it touches.', V(body, [head])],
      ['Draw two front legs going down to little round paws.', al(88, 118, 87, 165) + al(112, 118, 113, 165) + V(pawL) + V(pawR) + al(84, 174, 84, 178) + al(90, 174, 90, 178) + al(110, 174, 110, 178) + al(116, 174, 116, 178)],
      ['Add a long curly tail, and three stripes on the head.', V(tail, [body]) + al(92, 42, 93, 50) + al(100, 40, 100, 49) + al(108, 42, 107, 50)],
      ['Color your kitten. Orange, gray or black and white? Meow!', M(paint('#FFC23D', F(tail) + F(body) + F(earL) + F(earR) + F(head)) + paint('#FFE7A8', F(pawL) + F(pawR)) + paint('#F78FB3', apg('96,78 104,78 100,83') + apg('80,52 80,38 90,45') + apg('120,52 120,38 110,45')) + paint('#6CC08B', ae(88, 68, 5, 6) + ae(112, 68, 5, 6)) + fat('#E08A1E', 'M92 42 L93 50 M100 40 L100 49 M108 42 L107 50', 5))]] });
  }
  {
    const head = circ(70, 90, 26), ear1 = ell(60, 50, 9, 26, -12), ear2 = ell(80, 50, 9, 26, 12);
    const in1 = ell(60, 52, 4, 17, -12), in2 = ell(80, 52, 4, 17, 12);
    const foot = ell(128, 168, 28, 9), paw = ell(84, 164, 11, 7), body = ell(118, 132, 46, 40), tail = cloud(164, 120, 13, 12, 6, 0.25);
    const carrot = apg('20,148 34,148 27,186') + al(23, 160, 28, 159) + al(26, 170, 30, 169), tops = ap('M27 148 Q20 136 16 134 M27 148 Q27 134 29 130 M27 148 Q34 138 38 136');
    LESSONS.push({ id: 'a4-bunny', cat: 'pets', level: 2, title: 'A bouncy bunny', ico: '🐰', need: P, tip: 'Draw the front shapes first, then the body behind. Long ears are the secret!', steps: [
      ['Draw a circle for the head.', V(head)],
      ['Draw two long ears standing up. Stop where they touch the head.', V(ear1, [head]) + V(ear2, [head, ear1])],
      ['Draw a line inside each ear. Add an eye, a nose and whiskers.', V(in1, [head]) + V(in2, [head, ear1]) + ac(62, 86, 3.5) + ae(47, 93, 3, 2.5) + ap('M47 95.5 Q48 101 53 100') + al(40, 90, 26, 86) + al(40, 95, 26, 98)],
      ['Draw a long foot at the bottom, and a little front paw.', V(foot) + V(paw)],
      ['Draw a big oval body. Stop at the head, the foot and the paw.', V(body, [head, foot, paw])],
      ['Add a fluffy round tail at the back.', V(tail, [body])],
      ['Color your bunny and give it a crunchy carrot!', carrot + tops + M(paint(GRASS, ar(0, 172, 200, 28)) + paint('#fff', F(tail)) + paint('#C9C2B8', F(ear1) + F(ear2) + F(body) + F(head) + F(foot) + F(paw)) + paint('#F7A39A', F(in1) + F(in2) + ae(47, 93, 3, 2.5) + ac(60, 100, 5)) + paint('#FF9F43', apg('20,148 34,148 27,186')) + fat('#2FA36B', 'M27 148 Q20 136 16 134 M27 148 Q27 134 29 130 M27 148 Q34 138 38 136', 4))]] });
  }
  {
    const bowl = arcE(100, 115, 70, 70, -59, 239), rim = ell(100, 55, 36.06, 7);
    const waves = 'M42.6 75 Q56.9 69 71.3 75 Q85.6 81 100 75 Q114.4 69 128.7 75 Q143.1 81 157.4 75';
    const fish = ell(90, 120, 24, 15), tail = poly('110,120 134,104 128,120 134,136'), fin = pth('M78 108 Q90 92 104 110');
    const pebD = 'M56.7 170 Q63 162 70 168 Q78 160 86 167 Q94 160 102 167 Q110 160 118 167 Q126 160 134 168 Q139 163 143.3 170';
    const weed = 'M70 168 Q62 150 72 136 Q82 122 72 106 M134 168 Q146 152 140 136 Q134 122 144 108';
    LESSONS.push({ id: 'a4-goldfish', cat: 'pets', level: 2, title: 'A goldfish bowl', ico: '🐟', need: P, tip: 'A curved white line on glass makes it look shiny. Try it on windows too!', steps: [
      ['Draw a big round bowl. Leave the top open.', V(bowl)],
      ['Draw a flat oval across the top for the opening.', V(rim)],
      ['Draw a wavy line for the top of the water.', ap(waves)],
      ['Draw an oval for the goldfish.', V(fish)],
      ['Add a tail and a fin. Stop where they touch the body.', V(tail, [fish]) + V(fin, [fish])],
      ['Add an eye, a smile, and bubbles going up.', ac(76, 116, 3) + ap('M67 124 Q70 126 73 124') + ap('M84 108 Q80 120 84 132') + ac(60, 104, 4) + ac(54, 92, 3) + ac(58, 82, 2.5)],
      ['Draw bumpy pebbles and wiggly seaweed at the bottom. Add a shiny line on the glass.', ap(pebD) + V(pth(weed.split(' M')[0]), [fish, tail]) + V(pth('M' + weed.split(' M')[1]), [fish, tail]) + ac(80, 178, 4) + ac(100, 180, 3.5) + ac(118, 177, 4) + ap('M150 90 Q160 102 160 122')],
      ['Color the water blue and your fish bright orange. Blub blub!', M(paint('#CDE6FA', ap(waves + ' A70 70 0 1 1 42.6 75 Z')) + paint('#E8F3FC', F(rim)) + paint('#C99A6E', ap(pebD + ' A70 70 0 0 1 56.7 170 Z')) + fat('#2FA36B', visD(pth(weed.split(' M')[0]), [fish, tail]) + visD(pth('M' + weed.split(' M')[1]), [fish, tail]), 4) + paint('#FF9F43', F(tail) + F(fin) + F(fish)) + paint('#F78FB3', ac(80, 178, 4)) + paint('#9CCBF5', ac(100, 180, 3.5)) + paint(SUN, ac(118, 177, 4)))]] });
  }
  {
    const pawL = ell(91, 141, 7, 5.5), pawR = ell(109, 141, 7, 5.5), seed = pth('M100 120 Q115 138 100 160 Q85 138 100 120 Z');
    const belly = ell(100, 142, 30, 24), footL = ell(80, 172, 12, 6), footR = ell(120, 172, 12, 6), body = ell(100, 112, 62, 58);
    const earL = circ(64, 62, 12), earR = circ(136, 62, 12), inL = circ(64, 62, 6), inR = circ(136, 62, 6), shadow = ell(100, 181, 64, 6);
    const flicks = [150, 165, 180, 195, 210, -30, -15, 0, 15, 30].map(a => { const r = a * DEG, c = Math.cos(r), s = Math.sin(r); return al(f1(100 + 56 * c), f1(112 + 52 * s), f1(100 + 50 * c), f1(112 + 46 * s - 3)); }).join('');
    LESSONS.push({ id: 'a4-hamster', cat: 'pets', level: 3, title: 'A hamster with a seed', ico: '🐹', need: P, tip: 'Little fur lines and a shadow make a drawing look soft and real.', steps: [
      ['Draw two little paws holding a seed shaped like a drop.', V(pawL) + V(pawR) + V(seed, [pawL, pawR]) + V(seg(100, 125, 100, 155), [pawL, pawR])],
      ['Draw an oval belly around the paws.', V(belly)],
      ['Draw two round feet at the bottom.', V(footL) + V(footR) + al(76, 170, 76, 175) + al(84, 170, 84, 175) + al(116, 170, 116, 175) + al(124, 170, 124, 175)],
      ['Draw a big round body, like a ball. Stop where it touches the feet.', V(body, [footL, footR])],
      ['Add round ears on top, with a smaller circle inside each.', V(earL, [body]) + V(earR, [body]) + V(inL, [body]) + V(inR, [body])],
      ['Draw shiny eyes, a tiny nose, a mouth and two front teeth.', ac(80, 90, 5) + ac(120, 90, 5) + ae(100, 100, 4, 3) + ap('M100 103 V107 M100 107 Q95 111 91 108 M100 107 Q105 111 109 108') + apl('97,108.6 97,113 103,113 103,108.6') + al(100, 108.6, 100, 113)],
      ['Make it fluffy! Add a tuft of hair, little fur lines and a shadow on the ground.', ap('M94 54.3 Q94 44 100 50 Q104 42 106 54.3') + flicks + V(shadow, [body, footL, footR])],
      ['Color it golden with a cream belly and pink cheeks. So soft!', M(paint('#C9D3E0', F(shadow)) + paint('#F2B36B', F(earL) + F(earR) + F(body)) + paint('#F7A39A', F(inL) + F(inR) + ac(70, 106, 7) + ac(130, 106, 7)) + paint('#FFF3C4', F(belly) + F(footL) + F(footR)) + paint('#9AA1AB', F(seed)) + paint('#F7C9C2', F(pawL) + F(pawR)) + paint('#2B2B33', ac(80, 90, 5) + ac(120, 90, 5)) + paint('#fff', ac(82, 88, 1.6) + ac(122, 88, 1.6)))]] });
  }

  /* ================= Space ================= */
  {
    const outer = 'M120 28 A76.2 76.2 0 1 0 120 172', inner = 'M120 172 A76.8 76.8 0 0 1 120 28';
    const cl = cloud(166, 182, 26, 11, 5, 0.3);
    const stars = star(150, 62, 16) + star(172, 124, 10) + star(186, 30, 6);
    LESSONS.push({ id: 'a4-moon', cat: 'space', level: 1, title: 'Moon and stars', ico: '🌙', need: P, tip: 'A crescent is two curves that meet at the points. Try a thin one and a fat one!', steps: [
      ['Draw a big curve like a C. Start at the top and go all the way round to the bottom.', ap(outer)],
      ['Draw a second curve inside, from the bottom back up to the top. It is a crescent moon!', ap(inner)],
      ['Give the moon a sleepy face: a closed eye with lashes, and a smile.', ap('M36 82 Q43 89 50 82') + al(39, 86, 37, 90) + al(43, 88, 43, 92) + al(47, 86, 49, 90) + ap('M38 118 Q46 126 56 120')],
      ['Draw a big star with 5 points.', star(150, 62, 16)],
      ['Add more stars, some dots and a fluffy cloud.', star(172, 124, 10) + star(186, 30, 6) + ac(110, 18, 2) + ac(186, 92, 2) + ac(150, 104, 2) + ac(140, 186, 2) + V(cl)],
      ['Color the sky dark blue and the moon bright yellow. Goodnight, moon!', M(paint(NAVY, ar(0, 0, 200, 200)) + paint(SUN, ap(outer + ' A76.8 76.8 0 0 1 120 28 Z') + stars) + paint('#F7A39A', ac(44, 104, 5)) + paint('#fff', F(cl) + ac(110, 18, 2) + ac(186, 92, 2) + ac(150, 104, 2) + ac(140, 186, 2)))]] });
  }
  {
    const R = -12, fo = arcE(100, 100, 86, 24, 0, 180, R), fi = arcE(100, 100, 62, 13, 0, 180, R);
    const bo = arcE(100, 100, 86, 24, 180, 360, R), bi = arcE(100, 100, 62, 13, 180, 360, R);
    const band = poly(fo.pts.concat(fi.pts.slice().reverse())), planet = circ(100, 100, 46);
    const c = Math.cos(R * DEG), s = Math.sin(R * DEG);
    const stripeD = [-30, -16].map(o => visD(seg(100 - s * o - 60 * c, 100 + c * o - 60 * s, 100 - s * o + 60 * c, 100 + c * o + 60 * s), [band], [planet])).join('');
    const ringFill = ap(visD(ell(100, 100, 86, 24, R)) + visD(ell(100, 100, 62, 13, R)));
    LESSONS.push({ id: 'a4-saturn', cat: 'space', level: 1, title: 'A planet with rings', ico: '🪐', need: P, tip: 'Saturn\'s rings are made of ice and rock, spinning round and round.', steps: [
      ['Draw a long curved band, like a big smile. This is the front of the ring.', V(fo) + V(fi)],
      ['Draw a big circle for the planet. Stop where it touches the ring.', V(planet, [band])],
      ['Draw the back of the ring on both sides. It goes behind the planet, so stop when you touch it.', V(bo, [planet]) + V(bi, [planet])],
      ['Draw some stripes across the planet. Stop at the ring.', ap(stripeD)],
      ['Add a little moon and some twinkly stars.', ac(30, 40, 9) + ac(27, 37, 2) + ac(33, 44, 1.5) + star(172, 30, 7) + star(30, 160, 6) + star(176, 168, 8)],
      ['Color your planet. Real Saturn is soft yellow, but yours can be any color!', M(paint(NAVY, ar(0, 0, 200, 200)) + `<g class="pt" style="fill:#CFC4F0;fill-rule:evenodd">${ringFill}</g>` + paint('#FFC23D', F(planet)) + fat('#FF9F43', stripeD, 6) + paint('#CFC4F0', F(band)) + paint('#C9D3E0', ac(30, 40, 9)) + paint(SUN, star(172, 30, 7) + star(30, 160, 6) + star(176, 168, 8)))]] });
  }
  {
    const helmet = circ(100, 58, 32), visor = ell(100, 60, 22, 17), body = rrect(70, 84, 60, 62, 14);
    const gL = circ(46, 140, 9), gR = circ(160, 62, 9), armL = bar(76, 100, 46, 140, 18), armR = bar(124, 100, 160, 62, 18);
    const bootL = ell(84, 180, 15, 8), bootR = ell(116, 180, 15, 8), legL = rect(74, 140, 20, 40), legR = rect(106, 140, 20, 40);
    LESSONS.push({ id: 'a4-astronaut', cat: 'space', level: 2, title: 'An astronaut', ico: '🧑‍🚀', need: P, tip: 'Space suits are puffy, so draw fat round arms and legs.', steps: [
      ['Draw a big circle for the helmet.', V(helmet)],
      ['Draw an oval window inside, with a little shiny line.', V(visor) + ap('M86 56 Q88 48 96 46')],
      ['Draw a body like a box with round corners. Stop at the helmet.', V(body, [helmet])],
      ['Add a control panel with buttons, and a belt.', ar(86, 100, 28, 18, 3) + ac(94, 109, 3) + ac(106, 109, 3) + al(70, 128, 130, 128)],
      ['Draw two round gloves, one up high and one down low. Join them to the body with fat arms.', V(gL) + V(gR) + V(armL, [body, gL]) + V(armR, [body, gR])],
      ['Draw two big boots, then two legs going up to the body.', V(bootL) + V(bootR) + V(legL, [body, bootL]) + V(legR, [body, bootR])],
      ['Give your astronaut a flag to hold.', al(160, 53, 160, 14) + apl('160,14 188,14 188,32 160,32') + star(174, 23, 5)],
      ['Color the sky dark, the suit white and the window gold. 3, 2, 1, blast off!', M(paint(NAVY, ar(0, 0, 200, 200)) + paint('#fff', F(armL) + F(armR) + F(legL) + F(legR) + F(body) + F(helmet)) + paint('#C9D3E0', F(gL) + F(gR) + F(bootL) + F(bootR)) + paint(SUN, F(visor)) + paint('#9CCBF5', ar(86, 100, 28, 18, 3)) + paint('#F2604F', ar(160, 14, 28, 18) + ac(94, 109, 3)) + paint('#fff', star(174, 23, 5)) + paint('#2FA36B', ac(106, 109, 3)) + paint(SUN, star(30, 30, 6) + star(176, 150, 7) + star(28, 186, 5)))]] });
  }
  {
    const saucer = ell(100, 118, 82, 20), dome = arcE(100, 108, 52, 52, 180, 360), domeC = pth('M48 108 Q48 56 100 56 Q152 56 152 108 Z');
    const head = ell(100, 86, 15, 16), under = ell(100, 140, 40, 9);
    const lights = ac(45, 121, 5) + ac(73, 127, 5) + ac(100, 129, 5) + ac(127, 127, 5) + ac(155, 121, 5);
    const beam = poly('72,146 46,192 154,192 128,146');
    const stars = star(24, 30, 6) + star(176, 40, 8) + star(20, 160, 5) + star(182, 170, 6);
    LESSONS.push({ id: 'a4-ufo', cat: 'space', level: 2, title: 'An alien in a flying saucer', ico: '🛸', need: P, tip: 'Aliens can look any way you like. Try 3 eyes or 5 antennas!', steps: [
      ['Draw a long flat oval for the flying saucer.', V(saucer)],
      ['Draw a round alien head peeking out of the middle. Stop at the saucer.', V(head, [saucer])],
      ['Give the alien big eyes, a smile and two antennas with balls on top.', ae(94, 84, 4.5, 6.5) + ae(106, 84, 4.5, 6.5) + ac(94, 86, 2) + ac(106, 86, 2) + ap('M95 94 Q100 98 105 94') + al(95, 70.9, 91, 65) + ac(90, 62.5, 2.5) + al(105, 70.9, 109, 65) + ac(110, 62.5, 2.5)],
      ['Draw a big glass bubble over the alien. Stop where it touches the saucer.', V(dome, [saucer]) + ap('M66 90 Q70 74 84 66')],
      ['Draw a row of round lights on the saucer.', lights],
      ['Draw a small oval underneath, then a beam of light shining down.', V(under, [saucer]) + V(seg(72, 146, 46, 192), [under]) + V(seg(128, 146, 154, 192), [under]) + V(arcE(100, 192, 54, 6, 0, 180))],
      ['Color it in and add stars. Beep boop, hello Earth!', stars + M(paint(NAVY, ar(0, 0, 200, 200)) + paint('#FFF3C4', F(beam)) + paint('#9AA1AB', F(under)) + paint('#D6EAFC', F(domeC)) + paint('#8BD17C', F(head)) + paint('#C9D3E0', F(saucer)) + paint(SUN, lights + stars) + paint('#fff', ae(94, 84, 4.5, 6.5) + ae(106, 84, 4.5, 6.5)) + paint('#8BD17C', ac(90, 62.5, 2.5) + ac(110, 62.5, 2.5)))]] });
  }
  {
    const C = [-20, 100], at = (R, a) => [f1(C[0] + R * Math.cos(a * DEG)), f1(C[1] + R * Math.sin(a * DEG))];
    const pl = [[66, -22, 3.5], [82, 26, 5.5], [100, -32, 6], [118, 14, 4.5], [144, -16, 14], [170, 20, 9], [190, -26, 7], [210, 6, 7]].map(([R, a, r]) => { const [x, y] = at(R, a); return { R, x, y, r, sh: circ(x, y, r) }; });
    const [me, ve, ea, ma, ju, sa, ur, ne] = pl;
    const box = rect(1, 1, 198, 198), sun = circ(-20, 100, 44);
    const rays = [-50, -35, -20, -5, 10, 25, 40].map(a => { const [x1, y1] = at(49, a), [x2, y2] = at(57, a); return al(x1, y1, x2, y2); }).join('');
    const sfo = arcE(sa.x, sa.y, 18, 5, 0, 180, -12), sfi = arcE(sa.x, sa.y, 13, 2.5, 0, 180, -12), sband = poly(sfo.pts.concat(sfi.pts.slice().reverse()));
    const sbo = arcE(sa.x, sa.y, 18, 5, 180, 360, -12), ring = ell(sa.x, sa.y, 18, 5, -12);
    const juS = [-7, 0, 6].map(o => visD(seg(ju.x - 20, ju.y + o, ju.x + 20, ju.y + o), [], [ju.sh])).join('');
    const orbits = pl.map(p => V(circ(-20, 100, p.R), pl.map(q => q.sh).concat([ring]), [box])).join('').replace(/\/>/g, ' style="stroke-width:2"/>');
    LESSONS.push({ id: 'a4-solar', cat: 'space', level: 3, title: 'The solar system', ico: '☀️', need: P, tip: 'My Very Easy Method Just Speeds Up Naming planets: M V E M J S U N!', steps: [
      ['The Sun is so big it does not fit! Draw a huge curve on the left side, with rays.', V(sun, [], [box]) + rays],
      ['Draw four small rocky planets: Mercury, Venus, Earth and Mars. Earth is our home!', V(me.sh) + V(ve.sh) + V(ea.sh) + V(ma.sh) + ap(`M${ea.x - 3} ${ea.y - 2} Q${ea.x} ${ea.y - 5} ${ea.x + 2} ${ea.y + 1}`)],
      ['Draw giant Jupiter, the biggest planet, with stripes and a red spot.', V(ju.sh) + ap(juS) + ae(ju.x + 5, ju.y + 3, 3.5, 2.2)],
      ['Draw Saturn. Draw the front of the ring first, then the planet, then the back of the ring.', V(sfo) + V(sfi) + V(sa.sh, [sband]) + V(sbo, [sa.sh])],
      ['Draw Uranus and Neptune, far, far away.', V(ur.sh) + V(ne.sh)],
      ['Draw the path each planet travels around the Sun. Stop at every planet!', orbits],
      ['Color your planets and the dark space around them. Which planet would you visit?', M(paint(NAVY, ar(0, 0, 200, 200)) + paint('#FFC23D', F(sun)) + paint('#B5B5B5', F(me.sh)) + paint('#E8C27A', F(ve.sh)) + paint('#2E8BE6', F(ea.sh)) + paint('#F2604F', F(ma.sh)) + paint('#E8A86B', F(ju.sh)) + paint('#CFC4F0', F(ring)) + paint('#F2D27A', F(sa.sh)) + paint('#CFC4F0', F(sband)) + paint('#9CE0E6', F(ur.sh)) + paint('#4C7BE0', F(ne.sh)) + paint('#2FA36B', ac(ea.x - 1, ea.y - 1, 2.5)) + paint('#C0392B', ae(ju.x + 5, ju.y + 3, 3.5, 2.2)))]] });
  }

  /* ================= Sports & play ================= */
  {
    const ball = circ(100, 128, 22), pent = around(5, 8, 100, 128, (x, y) => `${x},${y} `).trim();
    const spokes = around(5, 8, 100, 128, (x, y, a) => al(x, y, f1(100 + 22 * Math.cos(a)), f1(128 + 22 * Math.sin(a))));
    let net = ''; for (let x = 58; x <= 142; x += 12) net += visD(seg(x, 66, x, 150), [ball]); for (let y = 78; y <= 138; y += 12) net += visD(seg(46, y, 154, y), [ball]);
    LESSONS.push({ id: 'a4-goal', cat: 'sports', level: 1, title: 'Ball and goal', ico: '⚽', need: P, tip: 'A small shape inside a big one, joined at the corners, makes it look deep.', steps: [
      ['Draw a circle for the ball.', V(ball)],
      ['Draw a little 5-sided shape in the middle. Draw a line from each corner to the edge.', apg(pent) + spokes],
      ['Draw the goal: a big upside-down U.', apl('30,150 30,50 170,50 170,150')],
      ['Draw a smaller one inside it, and join the top corners. Now the goal looks deep!', apl('46,150 46,66 154,66 154,150') + al(30, 50, 46, 66) + al(170, 50, 154, 66)],
      ['Draw the net: lines up and down, then side to side. Stop at the ball.', ap(net)],
      ['Draw the grass line and a corner flag.', V(seg(0, 150, 200, 150), [ball]) + al(186, 150, 186, 112) + apg('186,112 198,118 186,124')],
      ['Color it in. Then shout GOAL!', M(paint(SKY, ar(0, 0, 200, 150)) + paint(GRASS, ar(0, 150, 200, 50)) + paint('#fff', ar(46, 66, 108, 84)) + paint('#fff', F(ball)) + paint('#2B2B33', apg(pent)) + paint('#F2604F', apg('186,112 198,118 186,124')))]] });
  }
  {
    const kite = poly('100,20 140,70 100,140 60,70');
    const bows = [[120, 152], [120, 168], [120, 184]].map(([x, y]) => [poly(`${x - 9},${y - 5} ${x},${y} ${x - 9},${y + 5}`), poly(`${x + 9},${y - 5} ${x},${y} ${x + 9},${y + 5}`)]).flat();
    const cl = cloud(152, 44, 30, 14, 6, 0.3), sun = circ(178, 24, 13);
    LESSONS.push({ id: 'a4-kite', cat: 'sports', level: 1, title: 'A flying kite', ico: '🪁', need: P, tip: 'Kites need wind! Draw swirly wind lines to make it fly higher.', steps: [
      ['Draw a diamond: a point at the top, right, bottom and left. Join them up.', V(kite)],
      ['Draw a cross inside, from point to point. These are the sticks.', al(100, 20, 100, 140) + al(60, 70, 140, 70)],
      ['Draw three little bows under the kite, like bow ties.', bows.map(b => V(b)).join('')],
      ['Join the bows with a wiggly tail line from the kite. Stop at each bow.', V(pth('M100 140 Q130 150 120 168 Q110 186 140 196'), bows)],
      ['Draw a long string going down to the corner. Someone is holding it!', ap('M84 112 Q70 140 50 156 Q24 176 8 198')],
      ['Draw a cloud behind the kite, and a sun peeking out. Stop where they touch.', V(cl, [kite]) + V(sun, [cl]) + ap('M20 40 Q34 30 48 40 M14 60 Q30 50 44 60')],
      ['Color each part of the kite a different color. Whee!', M(paint(SKY, ar(0, 0, 200, 200)) + paint(SUN, F(sun)) + paint('#fff', F(cl)) + paint('#F2604F', apg('100,20 60,70 100,70')) + paint(SUN, apg('100,20 140,70 100,70')) + paint('#2E8BE6', apg('60,70 100,140 100,70')) + paint(GRASS, apg('140,70 100,140 100,70')) + paint('#F78FB3', bows.map(F).join('')))]] });
  }
  {
    const wheel = x => V(circ(x, 135, 32)) + V(circ(x, 135, 26));
    const spokes = x => ac(x, 135, 3) + around(8, 26, x, 135, (px, py, a) => al(f1(x + 3 * Math.cos(a)), f1(135 + 3 * Math.sin(a)), px, py));
    const ring = circ(98, 135, 9);
    const frame1 = V(seg(52, 135, 98, 135), [ring]) + V(seg(98, 135, 84, 84), [ring]) + al(52, 135, 86, 92);
    const frame2 = al(86, 93, 136, 90) + V(seg(98, 135, 138, 98), [ring]) + al(134, 82, 138, 98) + al(138, 98, 148, 135);
    const tube = 'M52 135 L98 135 L84 84 M52 135 L86 92 L136 90 M98 135 L138 98 M134 82 L148 135';
    const seat = pth('M72 82 Q84 74 98 82 Q84 87 72 82 Z');
    const tyre = x => `<g class="pt" style="fill:#3B3B48;fill-rule:evenodd">${ap(D(circ(x, 135, 32)) + D(circ(x, 135, 26)))}</g>`;
    LESSONS.push({ id: 'a4-bike', cat: 'sports', level: 2, title: 'A bicycle', ico: '🚲', need: P, tip: 'A bike frame is made of triangles. Triangles are the strongest shape!', steps: [
      ['Draw two big circles for the wheels. Draw a smaller circle inside each one.', wheel(52) + wheel(148)],
      ['Draw a dot in the middle of each wheel, and spokes like a star.', spokes(52) + spokes(148)],
      ['Draw a little circle between the wheels for the pedals. Draw a triangle from it to the back wheel.', V(ring) + frame1],
      ['Draw a line to the front, and the fork going down to the front wheel.', frame2],
      ['Add a seat on top, and handlebars at the front.', V(seat) + al(134, 82, 132, 72) + ap('M132 72 Q142 68 150 74')],
      ['Add a pedal and the ground.', al(98, 135, 106, 150) + ar(100, 149, 14, 5, 2) + al(0, 167, 200, 167)],
      ['Color your bike! What color will the frame be?', M(paint(SKY, ar(0, 0, 200, 167)) + paint('#C9D3E0', ar(0, 167, 200, 33)) + tyre(52) + tyre(148) + fat('#F2604F', tube, 7) + paint('#8B5E3C', F(seat)) + paint(SUN, F(ring)))]] });
  }
  {
    const head = circ(95, 80, 15), shirt = pth('M84 92 L106 92 L110 138 L80 138 Z');
    const legL = rect(84, 134, 9, 38), legR = rect(97, 134, 9, 38), shoeL = ell(88, 174, 8, 4.5), shoeR = ell(102, 174, 8, 4.5);
    const hL = circ(70, 108, 5), hR = circ(120, 108, 5), armL = bar(86, 100, 70, 108, 7), armR = bar(104, 100, 120, 108, 7);
    const seat = rect(62, 134, 66, 6), topBar = rect(14, 24, 172, 6);
    const frame = [[24, 30, 8, 192], [24, 30, 40, 192], [176, 30, 160, 192], [176, 30, 192, 192]].map(([a, b, c, d]) => V(seg(a, b, c, d), [topBar])).join('');
    LESSONS.push({ id: 'a4-swing', cat: 'sports', level: 2, title: 'Swinging on a swing', ico: '🎠', need: P, tip: 'Draw the child first, then the swing behind. Front things come first!', steps: [
      ['Draw a circle for the head. Add eyes, a smile and some hair.', V(head) + ac(90, 79, 2) + ac(100, 79, 2) + ap('M89 85 Q95 90 101 85') + ap('M88 66.7 L86 58 M95 65 L95 56 M102 66.7 L104 58')],
      ['Draw the body: a shape that gets a little wider at the bottom. Stop at the head.', V(shirt, [head])],
      ['Draw two legs hanging down, with shoes.', V(legL, [shirt, shoeL]) + V(legR, [shirt, shoeR]) + V(shoeL) + V(shoeR)],
      ['Draw two hands up high, one on each side. Join them to the body with arms.', V(hL) + V(hR) + V(armL, [shirt, hL]) + V(armR, [shirt, hR])],
      ['Draw the swing seat under the child. Stop where it touches.', V(seat, [shirt, legL, legR])],
      ['Draw two ropes going straight up from the seat. Stop at the hands.', V(seg(70, 30, 70, 134), [hL]) + V(seg(120, 30, 120, 134), [hR])],
      ['Draw the swing frame: a bar across the top, and legs like an A on each side.', V(topBar) + frame],
      ['Color it in. Who is on your swing? Is it you?', M(paint(SKY, ar(0, 0, 200, 180)) + paint(GRASS, ar(0, 180, 200, 20)) + paint('#F2604F', F(topBar)) + fat('#F2604F', 'M24 30 L8 192 M24 30 L40 192 M176 30 L160 192 M176 30 L192 192', 6) + paint('#8B5E3C', F(seat)) + paint('#2E8BE6', F(legL) + F(legR)) + paint('#2B2B33', F(shoeL) + F(shoeR)) + paint('#F3D3A8', F(armL) + F(armR) + F(hL) + F(hR) + F(head)) + paint('#FFC23D', F(shirt)))]] });
  }
  {
    const box = poly('14,176 28,164 104,164 104,180 90,192 14,192');
    const rungs = [120, 136, 152].map(y => al(40, y, 80, y)).join('');
    const slideD = 'M88 98 Q120 98 140 132 Q156 160 190 162 L190 170 Q150 168 134 138 Q116 106 88 105 Z', slide = pth(slideD);
    const crown = cloud(160, 56, 30, 26, 6, 0.22);
    const trunk = V(seg(154, 80, 154, 150), [crown, slide]) + V(seg(166, 80, 166, 150), [crown, slide]);
    LESSONS.push({ id: 'a4-playground', cat: 'sports', level: 3, title: 'A playground', ico: '🛝', need: P, tip: 'Start with what is in front. Things behind are only partly seen.', steps: [
      ['Start at the front. Draw a sandbox: a long box seen from above, like a tray.', V(box) + apl('14,176 90,176 90,192') + apl('90,176 104,164')],
      ['Draw a pile of sand and a little bucket in the sandbox.', ap('M24 173 Q38 163 52 173') + apg('62,166 76,166 74,175 64,175') + al(66, 166, 66, 175) + al(72, 166, 72, 175)],
      ['Draw two tall posts behind the sandbox. Stop at the sandbox. Add steps between them: a ladder!', V(seg(40, 105, 40, 192), [box]) + V(seg(80, 105, 80, 192), [box]) + rungs],
      ['Draw a flat platform at the top of the ladder, then posts and a pointy roof.', ar(32, 98, 56, 7) + al(40, 64, 40, 98) + al(80, 64, 80, 98) + apg('26,64 60,36 94,64')],
      ['Draw a long slide curving down from the platform.', ap(slideD)],
      ['Draw a tree far behind, and the ground line. Stop wherever something is in front.', V(crown) + trunk + V(seg(0, 150, 200, 150), [slide, box, rect(40, 98, 40, 70)])],
      ['Add a sun and color your playground. What will you play on first?', ac(16, 18, 9) + M(paint(SKY, ar(0, 0, 200, 150)) + paint(GRASS, ar(0, 150, 200, 50)) + paint('#6CC08B', F(crown)) + paint('#A87A55', ar(154, 80, 12, 70)) + fat('#2E8BE6', 'M40 64 V164 M80 64 V164', 6) + paint('#F2604F', apg('26,64 60,36 94,64')) + paint('#C99A6E', ar(32, 98, 56, 7)) + paint(SUN, F(slide) + ac(16, 18, 9)) + paint('#E8C27A', F(box)) + paint('#F78FB3', apg('62,166 76,166 74,175 64,175')))]] });
  }

  /* ================= Buildings & cities ================= */
  {
    let aw = 'M24 70 H176 V88'; for (let k = 7; k >= 0; k--) aw += ` Q${f1(24 + 19 * k + 9.5)} 100 ${24 + 19 * k} 88`; aw += ' Z';
    const awning = pth(aw), stripes = [1, 2, 3, 4, 5, 6, 7].map(k => al(24 + 19 * k, 70, 24 + 19 * k, 88)).join('');
    const redStripes = [0, 2, 4, 6].map(k => ap(`M${24 + 19 * k} 70 H${24 + 19 * (k + 1)} V88 Q${f1(24 + 19 * k + 9.5)} 100 ${24 + 19 * k} 88 Z`)).join('');
    const wall = pth('M30 185 V40 H170 V185');
    const frost = 'M46 146 Q42 138 50 137 Q52 129 58 131 Q66 129 66 137 Q71 140 66 146', cup = apl('46,146 66,146 62,160 50,160 46,146') + al(53, 146, 54, 160) + al(59, 146, 58, 160) + ap(frost) + ac(57, 126, 3);
    const bread = ap('M76 160 V150 Q76 141 91 141 Q106 141 106 150 V160') + al(84, 146, 86, 152) + al(92, 145, 94, 151) + al(100, 146, 102, 152);
    LESSONS.push({ id: 'a4-shop', cat: 'city', level: 1, title: 'A cake shop', ico: '🏪', need: P, tip: 'Shops have big windows so you can see what is inside. Yum!', steps: [
      ['Draw a stripy roof with bumpy edges. It is called an awning.', V(awning) + stripes],
      ['Draw a big box for the shop behind it. Stop where it touches the awning.', V(wall, [awning])],
      ['Draw a sign at the top and write the shop name.', ar(55, 46, 90, 18, 4) + paint(NAVY, atext(100, 60, 'CAKES', 13))],
      ['Draw a big window, with a shelf at the bottom.', ar(38, 104, 74, 58, 3) + al(38, 160, 112, 160)],
      ['Draw a door with a little window and a round handle.', ar(124, 104, 34, 81) + ar(130, 112, 22, 26) + ac(152, 148, 2.5) + al(0, 185, 200, 185)],
      ['Put yummy things in the window: a cupcake and a loaf of bread.', cup + bread],
      ['Color your shop. What would YOU sell?', M(paint('#F7D9A8', ap('M30 185 V40 H170 V185 Z')) + paint('#fff', ap(aw)) + paint('#F2604F', redStripes) + paint('#fff', ar(55, 46, 90, 18, 4)) + paint('#CDE6FA', ar(38, 104, 74, 58, 3) + ar(130, 112, 22, 26)) + paint('#2E8BE6', ap('M124 104 H158 V185 H124 Z M130 112 V138 H152 V112 Z')) + paint('#F78FB3', ap(frost + ' Z')) + paint('#C99A6E', apg('46,146 66,146 62,160 50,160') + ap('M76 160 V150 Q76 141 91 141 Q106 141 106 150 V160 Z')) + paint('#F2604F', ac(57, 126, 3)) + paint('#C9D3E0', ar(0, 185, 200, 15)))]] });
  }
  {
    const front = rect(70, 92, 60, 112), left = rect(18, 40, 58, 160), right = rect(122, 62, 56, 138);
    const grid = (xs, ys, w, h) => xs.map(x => ys.map(y => ar(x, y, w, h)).join('')).join('');
    const ys = s => { const a = []; for (let y = s; y <= 178; y += 16) a.push(y); return a; };
    const wFront = grid([78, 95, 112], [102, 122, 142, 162], 10, 12) + ar(90, 180, 20, 15);
    const wBack = grid([24, 40, 56], ys(50), 9, 10) + grid([136, 150, 164], ys(72), 8, 10);
    const lit = [[78, 102], [112, 122], [95, 162], [40, 66], [24, 114], [56, 146], [40, 162], [150, 88], [164, 120], [136, 152], [164, 168], [56, 82]];
    LESSONS.push({ id: 'a4-skyscrapers', cat: 'city', level: 1, title: 'Tall skyscrapers', ico: '🏙️', need: P, tip: 'Use a ruler for nice straight buildings, or wobbly lines for a cartoon city!', steps: [
      ['Draw a tall box in the middle. This building is in front.', V(pth('M70 200 V92 H130 V200'))],
      ['Draw a taller building on the left, behind it. Stop where it touches the front one.', V(pth('M18 200 V40 H76'), [front])],
      ['Draw another tall one on the right. Stop at the front building too.', V(pth('M122 62 H178 V200'), [front]) + V(seg(122, 62, 122, 200), [front])],
      ['Add an antenna on the tallest building, and a little box on a roof.', al(47, 40, 47, 14) + ac(47, 11, 3) + apl('140,62 140,52 158,52 158,62')],
      ['Draw rows of square windows on the front building, and a door.', wFront],
      ['Draw rows of windows on the buildings behind.', wBack],
      ['It is night! Color the sky dark, and some windows yellow where the lights are on.', star(176, 22, 6) + star(110, 30, 4) + M(paint(NAVY, ar(0, 0, 200, 200)) + paint('#8E7CC3', F(left)) + paint('#6D8AB0', F(right) + ar(140, 52, 18, 10)) + paint('#9AA1AB', F(front)) + paint(SUN, lit.map(([x, y]) => ar(x, y, x < 70 ? 9 : x > 130 ? 8 : 10, x > 70 && x < 130 ? 12 : 10)).join('') + star(176, 22, 6) + star(110, 30, 4) + ac(47, 11, 3)))]] });
  }
  {
    const towers = [48, 138].map(x => rect(x, 34, 14, 138)), deck = rect(-2, 118, 204, 10);
    const cab = pth('M55 34 Q100 182 145 34'), sideL = pth('M55 34 Q30 96 0 112'), sideR = pth('M145 34 Q170 96 200 112');
    const yAt = (sh, x) => { const p = sh.pts; for (let i = 1; i < p.length; i++) { const a = p[i - 1], b = p[i]; if ((a[0] - x) * (b[0] - x) <= 0 && a[0] !== b[0]) return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); } return 118; };
    const hang = [70, 80, 90, 100, 110, 120, 130].map(x => al(x, f1(yAt(cab, x)), x, 118)).join('') + [12, 24, 36].map(x => al(x, f1(yAt(sideL, x)), x, 118) + al(200 - x, f1(yAt(sideR, 200 - x)), 200 - x, 118)).join('');
    const boatHull = poly('84,176 116,176 110,186 90,186'), boatSail = poly('100,146 100,174 118,174');
    const wave = y => { let d = `M0 ${y}`; for (let x = 0; x < 200; x += 20) d += ` Q${x + 10} ${y - 5} ${x + 20} ${y}`; return d; };
    const waves = [150, 166, 182].map(y => V(pth(wave(y)), towers.concat([boatHull, boatSail]))).join('');
    const sun = circ(100, 70, 22);
    LESSONS.push({ id: 'a4-bridge', cat: 'city', level: 2, title: 'A big bridge', ico: '🌉', need: P, tip: 'The long cables hold the road up, so cars can drive high over the water.', steps: [
      ['Draw a long road going all the way across: two straight lines.', al(0, 118, 200, 118) + al(0, 128, 200, 128)],
      ['Draw two tall towers. Stop at the road, then keep going below it into the water.', towers.map(t => V(pth(`M${t.pts[0][0]} 172 V34 H${t.pts[0][0] + 14} V172`), [deck])).join('') + [48, 138].map(x => al(x, 60, x + 14, 60) + al(x, 86, x + 14, 86)).join('')],
      ['Draw a big swoopy cable from the top of one tower to the other. It dips down in the middle.', V(cab, towers)],
      ['Draw cables going down from each tower to the edges.', V(sideL, towers) + V(sideR, towers)],
      ['Draw straight lines from the cables down to the road. They hold the road up!', hang],
      ['Draw wavy water, and a little sailboat.', waves + V(boatHull) + V(boatSail)],
      ['Draw a big sun between the towers. Color the bridge red and the water blue!', V(sun, [cab]) + M(paint('#FFE0B0', ar(0, 0, 200, 140)) + paint('#9CCBF5', ar(0, 140, 200, 60)) + paint('#FF9F43', F(sun)) + paint('#E0533F', towers.map(F).join('') + ar(0, 118, 200, 10)) + fat('#E0533F', visD(cab, towers) + visD(sideL, towers) + visD(sideR, towers), 5) + paint('#fff', F(boatSail)) + paint('#8B5E3C', F(boatHull)))]] });
  }
  {
    const rocksD = 'M40 190 Q42 172 58 170 Q64 158 80 162 Q92 154 104 162 Q118 156 128 166 Q146 164 150 178 Q160 182 160 190 Z', rocks = pth(rocksD);
    const xl = y => f1(84 - (y - 70) * 14 / 110), xr = y => f1(116 + (y - 70) * 14 / 110);
    const bands = [[86, 98], [112, 124], [138, 150]];
    const bandLines = bands.flat().map(y => V(seg(xl(y), y, xr(y), y), [rocks])).join('');
    const gulls = 'M26 110 Q31 105 36 110 Q41 105 46 110 M150 120 Q154 116 158 120 Q162 116 166 120';
    const sea = [176, 188].map(y => { let d = `M0 ${y}`; for (let x = 0; x < 200; x += 20) d += ` Q${x + 10} ${y - 5} ${x + 20} ${y}`; return V(pth(d), [rocks]); }).join('');
    LESSONS.push({ id: 'a4-lighthouse', cat: 'city', level: 2, title: 'A lighthouse', ico: '🗼', need: P, tip: 'A lighthouse shines at night to help ships find their way safely.', steps: [
      ['Draw a pile of bumpy rocks at the bottom.', V(rocks)],
      ['Draw two lines going up from the rocks, closer together at the top. That is the tower.', V(seg(70, 180, 84, 70), [rocks]) + V(seg(130, 180, 116, 70), [rocks])],
      ['Draw a flat box on top for the balcony.', ar(76, 62, 48, 8)],
      ['Draw a small box for the lamp room, with a round roof. Put a circle light inside.', ar(86, 38, 28, 24) + ap('M86 38 A14 14 0 0 1 114 38') + al(100, 24, 100, 16) + ac(100, 50, 6)],
      ['Draw stripes around the tower, and a little window.', bandLines + ar(96, 101, 8, 9)],
      ['Draw beams of light shining out both sides.', al(86, 45, 14, 22) + al(86, 55, 14, 78) + al(114, 45, 186, 22) + al(114, 55, 186, 78)],
      ['Draw the wavy sea and some seagulls.', sea + ap(gulls)],
      ['Color the night sky dark and the light beams bright yellow!', M(paint(NAVY, ar(0, 0, 200, 176)) + paint('#4C7BE0', ar(0, 176, 200, 24)) + paint('#FFF3C4', apg('86,45 14,22 14,78 86,55') + apg('114,45 186,22 186,78 114,55')) + paint('#fff', apg(`${xl(70)},70 ${xr(70)},70 ${xr(180)},180 ${xl(180)},180`)) + paint('#F2604F', bands.map(([a, b]) => apg(`${xl(a)},${a} ${xr(a)},${a} ${xr(b)},${b} ${xl(b)},${b}`)).join('') + ar(76, 62, 48, 8) + ap('M86 38 A14 14 0 0 1 114 38 Z')) + paint(SUN, ar(86, 38, 28, 24)) + paint('#FF9F43', ac(100, 50, 6)) + paint('#9AA1AB', F(rocks)) + paint('#9CCBF5', ar(96, 101, 8, 9)))]] });
  }
  {
    const VP = [100, 90], yAt = (yn, x, xn) => f1(VP[1] + (yn - VP[1]) * (x - VP[0]) / (xn - VP[0]));
    const far = [rect(80, 74, 14, 41.3), rect(96, 80, 10, 35.3), rect(108, 68, 14, 47.3)];
    const lb = 'M0 10 H24 V170 H0 M24 10 L76 64.7 V115.3 L24 170', rb = 'M200 30 H176 V170 H200 M176 30 L124 71.1 V115.3 L176 170';
    const winSide = (xn, cols, rows) => cols.map(([a, b]) => rows.map(([t, u]) => apg(`${a},${yAt(t, a, xn)} ${b},${yAt(t, b, xn)} ${b},${yAt(u, b, xn)} ${a},${yAt(u, a, xn)}`)).join('')).join('');
    const winL = winSide(24, [[32, 44], [52, 60], [66, 71]], [[24, 44], [62, 82], [100, 120], [136, 152]]);
    const winR = winSide(176, [[156, 168], [140, 148], [129, 134]], [[42, 60], [76, 94], [110, 128], [142, 156]]);
    const winF = ar(4, 24, 14, 20) + ar(4, 62, 14, 20) + ar(4, 100, 14, 20) + ar(182, 42, 14, 18) + ar(182, 76, 14, 18) + ar(182, 110, 14, 18);
    const dashes = [[118, 124], [130, 142], [152, 170], [182, 200]].map(([a, b]) => al(100, a, 100, b)).join('');
    LESSONS.push({ id: 'a4-street', cat: 'city', level: 3, title: 'A city street in 3D', ico: '🛣️', need: 'Paper, a pencil, a ruler, an eraser and crayons', tip: 'Every line going away from you points to the same dot: the vanishing point.', steps: [
      ['Lightly draw a line across the middle: the horizon. Put a dot in the middle. It is called the vanishing point.', guide(al(0, 90, 200, 90) + ac(100, 90, 2.5))],
      ['With a ruler, draw light lines from the dot out toward the corners. Things far away shrink into that dot!', guide(al(100, 90, 24, 10) + al(100, 90, 24, 170) + al(100, 90, 176, 30) + al(100, 90, 176, 170) + al(100, 90, 52, 200) + al(100, 90, 148, 200))],
      ['Left building: draw a tall line near the edge. Follow the guide lines to a short line far away.', ap(lb)],
      ['Now the right building, the same way.', ap(rb)],
      ['In the gap at the end, draw small buildings far, far away.', far.map(f => V(f, [], [rect(76, 0, 48, 115.3)])).join('')],
      ['Draw the road: two lines from the far buildings down to the bottom. Add dashes that get bigger as they come closer.', V(seg(100, 90, 52, 200), far) + V(seg(100, 90, 148, 200), far) + dashes],
      ['Erase the guide lines. Draw windows: their tops and bottoms point to the dot too!', winL + winR + winF, { clear: true }],
      ['Color your street. Can you add cars that get smaller as they drive away?', M(paint(SKY, ar(0, 0, 200, 115.3)) + paint('#C9D3E0', apg('100,90 52,200 148,200')) + paint('#E8DCC8', apg('76,115.3 24,170 0,195.3 0,200 52,200 100,90 124,115.3 176,170 200,195.3 200,200 148,200')) + paint('#9AA1AB', far.map(F).join('')) + paint('#F7A39A', ap('M0 10 H24 V170 H0 Z')) + paint('#E8A86B', apg('24,10 76,64.7 76,115.3 24,170')) + paint('#9CCBF5', ap('M200 30 H176 V170 H200 Z')) + paint('#6D9BD1', apg('176,30 124,71.1 124,115.3 176,170')) + paint(SUN, winL + winR + winF + ar(97, 118, 6, 82)))]] });
  }
});
