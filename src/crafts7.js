/* ---------- Crafts corner, part 7 (round 4): 52 more crafts, most of them tricky or expert ---------- */
// Fills the harder levels: simple sewing with a plastic needle, plate and stick weaving, finger and spool knitting, clay
// and salt dough, papier-mache, origami beyond the basics (penguin, samurai helmet, water bomb, flapping bird, masu
// box), cardboard engineering (catapult, rubber band car, tilt maze, grabber arm, windmill, periscope), a paper circuit
// with a coin battery (a grown-up handles it), printmaking (foam tray, string block, stencil), recycled crafts and
// celebrations from many places (Diwali rangoli and diya, Lunar New Year red envelope and dragon, Eid, Ramadan, Raksha
// Bandhan, Kwanzaa, Día de Muertos, Christmas in Denmark and the Philippines, Japan's Children's Day, a Mexican piñata).
// Same step format as crafts2.js. Three new movie kinds live here: knit (loops lifted over fingers or spool pegs),
// light (copper tape laid down, then the LED switches on) and roll (an ink roller across a printing block).
// Like crafts2-5, the builder is queued in craftsHome.later and kept as lazy text, so none of it is compiled at startup.
craftsHome.CATS.push({ id: 'world', ico: '🌍', name: 'Celebrations around the world', c: '#A33A6B' });
craftsHome.JOURNEYS.push(
  { id: 'world', ico: '🌍', name: 'Around the World', badge: '🗺️', c: '#A33A6B', blurb: 'Make crafts for celebrations from many countries.', crafts: ['rangoli', 'redenvelope', 'diya', 'papelpicado', 'godseye', 'pinata'] },
  { id: 'engineer', ico: '⚙️', name: 'Young Engineer', badge: '🔧', c: '#3E5C7A', blurb: 'Build things that stand, fling, roll and light up.', crafts: ['cuptower', 'bridge', 'stickcatapult', 'chainreaction', 'bandcar', 'papercircuit'] },
  { id: 'stitch', ico: '🪡', name: 'Needle & Thread', badge: '🧵', c: '#9B3A82', blurb: 'Thread, weave, knit and sew, one step at a time.', crafts: ['sewplate', 'buttonsnake', 'plateweave', 'fingerknit', 'feltornament', 'feltpouch'] }
);
craftsHome.later.push(/*lazy{*/() => {
  const H = craftsHome, K = H.kit, C = K.C, OL = K.OL, R = H.R, T = H.T, f1 = K.f1;
  const lerp = (a, b, t) => a + (b - a) * t, cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ez = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, seg = (e, a, b) => cl((e - a) / (b - a));
  const plen = p => p.reduce((a, q, i) => i ? a + Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1]) : 0, 0);
  const upto = (p, d) => { const o = [p[0]]; for (let i = 1; i < p.length; i++) { const a = p[i - 1], b = p[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (d >= l) { o.push(b); d -= l; } else { if (l) o.push([a[0] + (b[0] - a[0]) * d / l, a[1] + (b[1] - a[1]) * d / l]); break; } } return o; };
  let clipN = 0;

  /* --- new tools (they glow like the others) and new movie kinds --- */
  const glow = f => (...a) => `<g class="cr-glow">${f(...a)}</g>`;
  Object.assign(T, {
    roller: glow((x, y, len = 40, c = C.blue) => `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M5,0 L22,-18 L44,-18" fill="none" stroke="${OL}" stroke-width="2.4" stroke-linecap="round"/><rect x="38" y="-23" width="22" height="10" rx="4" fill="${C.red}" stroke="${OL}" stroke-width="1.2"/><rect x="-6" y="${f1(-len / 2)}" width="12" height="${f1(len)}" rx="5" fill="${c}" stroke="${OL}" stroke-width="1.3"/><rect x="-3" y="${f1(-len / 2 + 3)}" width="3" height="${f1(len - 6)}" rx="1.5" fill="rgba(255,255,255,.45)"/></g>`)
  });
  const SKIN = '#F6C9A0';
  const handSVG = xs => xs.map(x => K.rect(x - 7, 30, 14, 66, SKIN, 7)).join('') + K.g(K.rect(-6, -22, 12, 40, SKIN, 6), xs[0] - 20, 104, 1, -40) + K.rect(xs[0] - 13, 86, xs[xs.length - 1] - xs[0] + 26, 50, SKIN, 16);
  const spoolSVG = xs => K.tube(100, 70, 76, 52, C.card) + xs.map(x => K.rect(x - 3, 34, 6, 46, C.tan, 2)).join('');
  Object.assign(R, {
    knit(s, e) {
      // finger (or spool) knitting: wrap a row of loops round the posts, or lift each bottom loop over the top one;
      // the knitted cord grows behind the hand (or out of the bottom of the tube)
      const spool = !!s.spool, xs = s.posts || (spool ? [76, 92, 108, 124] : [70, 90, 110, 130]), n = xs.length, c = s.c || C.red;
      const y0 = spool ? 66 : 76, y1 = y0 - 13, tipY = spool ? 30 : 34;
      const loop = (x, y, op = 1) => `<g opacity="${f1(op)}">${K.ell(x, y, 9, 3.6, 'none', 0, `stroke="${OL}" stroke-width="4.6"`)}${K.ell(x, y, 9, 3.6, 'none', 0, `stroke="${c}" stroke-width="3"`)}</g>`;
      const k = seg(e, 0, 0.9) * n, cur = Math.min(n - 1, Math.floor(k)), fr = k >= n ? 1 : k - cur;
      const links = m => Array.from({ length: Math.min(12, m) }, (_, j) => K.ell(spool ? 100 : 156, (spool ? 128 : 66) + j * (spool ? 4 : 6), 6, 3.2, 'none', 0, `stroke="${c}" stroke-width="2.6"`)).join('');
      let out = spool ? spoolSVG(xs) : handSVG(xs);
      if (s.mode === 'lift') {
        const lifted = cur + (fr > 0.75 ? 1 : 0);
        out += links((s.pre || 0) + lifted);
        xs.forEach((x, i) => {
          if (i < cur || (i === cur && fr >= 1)) { out += loop(x, y0); return; }
          if (i > cur) { out += loop(x, y0) + loop(x, y1); return; }
          const up = ez(seg(fr, 0, 0.7)), y = lerp(y0, tipY - 6, up);
          out += loop(x, fr < 0.85 ? y1 : lerp(y1, y0, seg(fr, 0.85, 1))) + loop(x, y, 1 - seg(fr, 0.7, 0.9));
          if (e < 0.93) out += T.hand(x + 10, y - 2, '🤏', 18);
        });
      } else {
        const r = s.rows || 0;
        out += links(s.pre || 0);
        xs.forEach((x, i) => {
          if (r) out += loop(x, y0);
          if (i < cur || fr >= 1) out += loop(x, r ? y1 : y0); else if (i === cur) out += loop(x, r ? y1 : y0, fr);
        });
        if (e < 0.93) out += T.yarn(xs[cur] + (fr - 0.5) * 18, (r ? y1 : y0) + 12, c);
      }
      return out;
    },
    light(s, e, t = 0) {
      // a paper circuit: copper tape goes down (mode tape), or a finger presses the folded corner and the LED lights up
      let out = '';
      if (s.mode === 'tape') {
        const p = s.path, L = plen(p), part = upto(p, L * seg(e, 0, 0.9)), q = part[part.length - 1];
        out += K.line(p, 'rgba(255,255,255,.4)', 1.2, '3 3') + K.line(part, OL, 6.4) + K.line(part, '#D98B3A', 4.6) + K.line(part, 'rgba(255,230,190,.6)', 1.2);
        if (e < 0.95) out += T.hand(q[0] + 2, q[1] + 2, '👆', 20);
        return out;
      }
      const [lx, ly] = s.led || [100, 56], [px, py] = s.press || [150, 106], press = ez(seg(e, 0.05, 0.4)), on = seg(e, 0.4, 0.5);
      if (s.flap) out += `<g opacity="${f1(0.4 + 0.6 * press)}">${s.flap}</g>`;
      if (on > 0) {
        const r = 9 + 7 * on + 1.5 * Math.sin(e * 40 + t / 120);
        out += `<circle cx="${lx}" cy="${ly}" r="${f1(r + 8)}" fill="rgba(255,230,90,${f1(0.25 * on)})"/><circle cx="${lx}" cy="${ly}" r="${f1(r)}" fill="rgba(255,226,80,${f1(0.55 * on)})"/>`;
        out += Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4 + e * 2; return K.line([[lx + (r + 3) * Math.cos(a), ly + (r + 3) * Math.sin(a)], [lx + (r + 9) * Math.cos(a), ly + (r + 9) * Math.sin(a)]], `rgba(255,200,40,${f1(on)})`, 2); }).join('');
        out += K.circ(lx, ly, 5, '#FFF8C0', 1.2);
      }
      if (e < 0.6) out += T.hand(px, py - 18 + 12 * press, '👇', 22);
      return out;
    },
    roll(s, e) {
      // an ink roller (brayer) rolls across the block, leaving the inked picture behind it
      const [x, y, w, h] = s.box, k = seg(e, 0, 0.9), id = 'cr7r' + (++clipN), edge = x + w * k;
      let out = `<clipPath id="${id}"><rect x="${f1(x - 2)}" y="${f1(y - 4)}" width="${f1(w * k + 2)}" height="${f1(h + 8)}"/></clipPath><g clip-path="url(#${id})">${s.area}</g>`;
      if (e < 0.93) out += T.roller(edge, y + h / 2 + 4 * Math.sin(e * 30), Math.min(56, h * 0.8), s.c || C.blue);
      return out;
    }
  });

  /* --- helpers, shared shapes and materials --- */
  const S = (t, a, o = {}) => ({ t, a, ...o });
  const mid = svg => K.g(svg, -100, -75);
  const done = s => K.still(s);
  const closed = p => p.concat([p[0]]);
  const sheet = (c = '#fff') => K.sheet(20, 15, 160, 115, c);
  const circlePts = (cx, cy, r, n = 20) => K.arc(cx, cy, r, r, 0, 360, n);
  const heartPts = (cx, cy, s, n = 40) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n * Math.PI * 2;
    return [cx + s * Math.pow(Math.sin(t), 3), cy - s * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16]; });
  const tapeP = (x, y, w = 24, h = 8, r = 0) => K.g(K.rect(-w / 2, -h / 2, w, h, 'rgba(142,197,245,.85)', 1), x, y, 1, r);
  const stick = (x, y, len = 100, r = 0, c = C.tan, w = 10) => K.g(K.rect(-len / 2, -w / 2, len, w, c, w / 2), x, y, 1, r);
  const scale = (pts, cx, cy, k) => pts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]);
  const rot = (pts, cx, cy, deg) => { const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return pts.map(([x, y]) => [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]); };
  const center = (svg, s = 1) => K.g(svg, -100 * s, -75 * s, s); // a 200x150 drawing, centered on 0,0 (for stamps and spinning things)
  const cotton = (x, y) => [[0, 0], [7, -3], [-6, -4], [3, 5]].map(([a, b]) => K.circ(x + a, y + b, 6, '#fff', 1)).join('');
  const BOWL = { base: K.ell(100, 84, 42, 12, '#E3EEF8'), top: `<path d="M58,84 A42,40 0 0 0 142,84" fill="rgba(142,197,245,.3)" stroke="${OL}" stroke-width="1.6"/>` + K.ell(100, 84, 42, 12, 'none', 1.6), clip: 'M58,84 A42,40 0 0 0 142,84 Z', box: [58, 84, 84, 40] };
  const pourBowl = (t, o) => S(t, 'pour', { base: BOWL.base + (o.base || ''), top: BOWL.top, clip: BOWL.clip, box: BOWL.box, ...o });
  const paste = t => S(t, 'stir', { at: [100, 92], r: 40, c0: '#FFFFFF', c1: '#EFE6D2', bits: ['#F4F1E8', '#fff'] });
  // papier-mache strips over an oval (cx, cy, rx, ry): bands across (dir 0) or down (dir 1)
  const bands = (cx, cy, rx, ry, n, dir, cols = ['#EFE6D2', '#E3DCCB'], from = 0, to = 1) => Array.from({ length: n }, (_, i) => {
    const a = lerp(from, to, i / n), b = lerp(from, to, (i + 1) / n) + 0.03, ext = u => Math.sqrt(Math.max(0, 1 - (2 * u - 1) ** 2));
    const p = dir ? [[cx - rx + 2 * rx * a, cy - ry * ext(a)], [cx - rx + 2 * rx * b, cy - ry * ext(b)], [cx - rx + 2 * rx * b, cy + ry * ext(b)], [cx - rx + 2 * rx * a, cy + ry * ext(a)]]
      : [[cx - rx * ext(a), cy - ry + 2 * ry * a], [cx + rx * ext(a), cy - ry + 2 * ry * a], [cx + rx * ext(b), cy - ry + 2 * ry * b], [cx - rx * ext(b), cy - ry + 2 * ry * b]];
    return { p, c: cols[i % cols.length] };
  });
  const M = {
    paper: ['📄', 'paper'], sq: ['🟦', 'square paper'], color: ['🌈', 'colored paper'], scissors: ['✂️', 'child scissors'], glue: ['🧴', 'glue stick'], pva: ['🧴', 'white glue (PVA)'],
    tape: ['🩹', 'sticky tape'], crayons: ['🖍️', 'crayons'], pens: ['🖊️', 'felt pens'], pencil: ['✏️', 'pencil'], paint: ['🎨', 'paint'], brush: ['🖌️', 'paintbrush'],
    plate: ['🍽️', 'paper plate'], roll: ['🧻', 'toilet roll tube'], wool: ['🧶', 'wool'], card: ['🟨', 'thin card'], punch: ['🕳️', 'hole punch'], felt: ['🟥', 'felt'],
    eyes: ['👀', 'googly eyes (or draw them)'], ruler: ['📏', 'a ruler'], sticks: ['🪵', 'craft sticks'], ribbon: ['🎀', 'ribbon'], tissue: ['🎐', 'tissue paper'],
    news: ['📰', 'newspaper'], string: ['🧵', 'string'], bands: ['➰', 'rubber bands'], balloon: ['🎈', 'a balloon'], pastem: ['🥣', 'flour-and-water paste in a bowl'],
    pneedle: ['🪡', 'a big blunt plastic needle'], needle: ['🪡', 'a needle with a big eye (a grown-up helps)'], thread: ['🧵', 'embroidery thread'], stuffing: ['☁️', 'a little stuffing or cotton wool'],
    clay: ['🟤', 'air-dry clay'], tlight: ['💡', 'a battery tea light (no flame)'], box: ['📦', 'a cardboard box'], caps: ['🥤', 'bottle caps'], marble: ['🔵', 'a marble'], fasteners: ['📌', 'split pins (paper fasteners)']
  };

  /* ================= easy: first sewing, rangoli, a red envelope, roll prints ================= */
  const sewplate = (() => {
    const pl = K.plate(100, 76, 58), hp = heartPts(100, 74, 34, 40), heart = K.line(hp, C.pink, 2.4);
    const holes = hp.filter((_, i) => i % 3 === 0 && i < 39), holed = pl + heart + holes.map(h => K.hole(h[0], h[1], 2.6)).join('');
    const st1 = { a: 'stitch', base: holed, pts: holes.slice(0, 8), c: C.purple }, half = done(st1);
    const st2 = { a: 'stitch', base: half, pts: holes.slice(7).concat([holes[0]]), c: C.purple }, sewn = done(st2);
    return { id: 'sewplate', cat: 'sew', name: 'Paper plate sewing', ico: '🪡', lv: 1, min: 20, mat: [M.plate, M.crayons, M.punch, M.wool, M.pneedle], tip: 'Wrap sticky tape round the wool end if you have no plastic needle: it makes a stiff tip for little fingers.', steps: [
      S('Draw a big heart in the middle of a paper plate.', 'draw', { base: pl, s: [hp], c: C.pink, w: 2.4 }),
      S('A grown-up punches holes all round the heart.', 'punch', { base: pl + heart, holes, r: 2.6 }),
      S('Thread the wool on the needle. Tie a big knot at the end.', 'knot', { at: [100, 64], c: C.purple }),
      S('Push the needle up through a hole, then down through the next hole.', 'stitch', st1),
      S('Keep going all the way round. Up, down, up, down!', 'stitch', st2),
      S('A sewn heart! Hang it on your door.', 'show', { item: mid(sewn), kind: 'swing' })
    ] };
  })();

  const rangoli = (() => {
    const card = K.rect(28, 8, 144, 134, '#3B2A5A', 6), cx = 100, cy = 75, dots = [];
    for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) if (Math.abs(i) + Math.abs(j) <= 3) dots.push([cx + i * 14, cy + j * 14, '#FFFFFF']);
    const dd = { a: 'dab', pts: dots, shape: 'dot', r: 2.2, tool: 'finger' }, dotted = card + done(dd);
    const petal = (a, len, w) => { const r = a * Math.PI / 180, ux = Math.cos(r), uy = Math.sin(r); return [[cx, cy], [cx + ux * len / 2 - uy * w, cy + uy * len / 2 + ux * w], [cx + ux * len, cy + uy * len], [cx + ux * len / 2 + uy * w, cy + uy * len / 2 - ux * w], [cx, cy]]; };
    const petals = [0, 45, 90, 135, 180, 225, 270, 315].map(a => a % 90 ? petal(a, 34, 9) : petal(a, 42, 12)), lines = petals.map(p => K.line(p, '#fff', 1.6)).join('');
    const cols = [C.pink, C.yellow, C.orange, C.lime], ring = { a: 'ring', items: petals.map((p, i) => ({ x: (p[2][0] + cx) / 2, y: (p[2][1] + cy) / 2, svg: K.poly(p.slice(0, 4), cols[i % 4], 1.2) })).concat([{ x: cx, y: cy, svg: K.circ(cx, cy, 7, C.red, 1.2) }]) };
    const pic = dotted + done(ring) + lines;
    return { id: 'rangoli', cat: 'world', name: 'Diwali rangoli', ico: '🌸', lv: 1, min: 20, mat: [['⬛', 'dark card'], ['🖍️', 'white chalk'], M.glue, ['🍚', 'colored sand, rice or salt']], tip: 'Rangoli patterns welcome guests at Diwali, the festival of lights in India. Outdoors, try it on the path with chalk!', steps: [
      S('Make dots in a diamond shape on dark card.', 'dab', { base: card, ...dd }),
      S('Join the dots with chalk to make eight petals.', 'draw', { base: dotted, s: petals, c: '#FFFFFF', w: 1.6 }),
      S('Put glue inside each petal.', 'glue', { base: dotted + lines, dots: petals.map(p => [(p[0][0] + p[2][0]) / 2, (p[0][1] + p[2][1]) / 2]) }),
      S('Sprinkle colored sand on each petal, one by one.', 'ring', { base: dotted + lines, ...ring }),
      S('Tip off the extra sand. A rangoli to welcome your guests!', 'show', { item: mid(pic), kind: 'glow' })
    ] };
  })();

  const redenvelope = (() => {
    const B = K.ori(C.red, '#C93A2B', [[40, 15], [160, 15], [160, 135], [40, 135]]);
    const s1 = B.fold('Fold the left side in, past the middle.', { from: [40, 75], to: [104, 75] });
    const s2 = B.fold('Fold the right side in, over the top.', { from: [160, 75], to: [96, 75] });
    const s3 = S('Glue down the edge where they meet.', 'glue', { base: B.svg(), dots: [[100, 30], [100, 50], [100, 70], [100, 90], [100, 110]] });
    const s4 = B.fold('Fold the bottom up and glue it.', { from: [100, 135], to: [100, 107] });
    const s5 = B.fold('Fold the top down. Now it can close!', { from: [100, 15], to: [100, 47] });
    const coin = K.circ(100, 82, 12, C.yellow, 1.4) + K.rect(95, 77, 10, 10, C.red, 1);
    return { id: 'redenvelope', cat: 'world', name: 'Lunar New Year red envelope', ico: '🧧', lv: 1, min: 15, mat: [['🟥', 'red paper'], M.glue, ['🟡', 'a gold pen or a yellow crayon']], tip: 'In China and many other places, red envelopes with a little money or a kind wish are given at Lunar New Year. Red means luck!', steps: [
      s1, s2, s3, s4, s5,
      S('Draw a gold coin on the front for good luck.', 'draw', { base: B.svg(), s: [circlePts(100, 82, 12, 16), [[95, 77], [105, 77], [105, 87], [95, 87], [95, 77]]], c: C.yellow, w: 2.6, tool: 'pen', fill: coin }),
      S('Put a kind wish inside. Give it with two hands. Happy New Year!', 'show', { item: mid(B.svg() + coin), kind: 'bounce' })
    ] };
  })();

  const rollstamp = (() => {
    const ring = circlePts(100, 74, 24, 40).slice(0, -1), hp = heartPts(100, 76, 26, 40).slice(0, -1);
    const hl = (x, y, c, s = 18) => K.line(heartPts(x, y, s, 30), c, 3.2);
    const print1 = hl(62, 56, C.red), more = [[110, 50, C.pink], [150, 66, C.purple], [80, 100, C.orange], [130, 104, C.blue]];
    const ring2 = { a: 'ring', items: more.map(([x, y, c]) => ({ x, y, svg: hl(x, y, c) })) }, pic = sheet() + print1 + done(ring2);
    return { id: 'rollstamp', cat: 'paint', name: 'Toilet roll heart prints', ico: '💗', lv: 1, min: 15, mat: [M.roll, M.paint, ['🍽️', 'a plate for the paint'], M.paper], tip: 'Squash the roll flat, then push one fold in to make the heart dip. A round roll makes circle prints too!', steps: [
      S('Squash a toilet roll a little. Pinch a dip in the top. A heart!', 'morph', { from: [{ p: ring, c: C.card }], to: [{ p: hp, c: C.card }] }),
      S('Pour a little paint onto a plate.', 'pour', { base: K.ell(100, 112, 62, 16, '#fff'), box: [64, 104, 72, 12], c: C.red, lv1: 0.8, clip: 'M40,112 A60,14 0 0 0 160,112 A60,14 0 0 0 40,112Z' }),
      S('Dip the roll in the paint. Press it on the paper.', 'stamp', { base: sheet(), at: [62, 56], item: hl(0, 0, C.red) + K.line(heartPts(0, -4, 18, 30), C.card, 2), print: print1 }),
      S('Print lots more hearts in other colors!', 'ring', { base: sheet() + print1, ...ring2 }),
      S('A paper full of hearts! Make it into a card.', 'show', { item: mid(pic), kind: 'bounce' })
    ] };
  })();

  /* ================= medium ================= */
  const buttonsnake = (() => {
    const pts = K.wave(26, 160, 90, 12, 1.5, 40), cols = [C.red, C.yellow, C.blue, C.green, C.purple, C.orange, C.pink, C.teal];
    const th = { a: 'thread', pts, beads: cols, r: 9, sc: C.green }, body = done(th);
    const head = K.ell(172, 88, 14, 11, C.green) + K.eye(176, 84, 3.4) + K.line([[186, 90], [196, 90], [199, 86]], C.red, 1.6) + K.line([[196, 90], [199, 94]], C.red, 1.6);
    return { id: 'buttonsnake', cat: 'sew', name: 'Button snake', ico: '🐍', lv: 2, min: 20, mat: [['🔘', 'lots of big buttons'], ['🎀', 'a ribbon or a shoelace'], M.pneedle, ['🟩', 'a bit of green felt'], M.glue], tip: 'A shoelace needs no needle: its hard tip pushes through the button holes on its own.', steps: [
      S('Tie a big knot at one end of the ribbon.', 'knot', { at: [100, 70], c: C.green }),
      S('Push the needle up through one button hole, then down the other.', 'thread', { ...th, beads: cols.slice(0, 3) }),
      S('Add more buttons. Big ones, small ones, all the colors!', 'thread', { ...th, pre: 3 }),
      S('Glue on a felt head with an eye and a tongue.', 'place', { base: body, pieces: [{ svg: head, at: [176, 88], from: [10, -60] }] }),
      S('Sssss! Your button snake can wiggle.', 'show', { item: mid(body + head), kind: 'wiggle', s: 0.9 })
    ] };
  })();

  const plateweave = (() => {
    const cx = 100, cy = 75, R0 = 56, N = 9, ang = i => (i * 360 / N - 90) * Math.PI / 180, pt = (i, r) => [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))];
    const pl = K.plate(cx, cy, R0), notches = Array.from({ length: N }, (_, i) => [pt(i, R0), pt(i, R0 - 8)]), notched = pl + notches.map(p => K.line(p, OL, 1.6)).join('');
    const spokes = Array.from({ length: N }, (_, i) => [[cx, cy], pt(i, R0 - 6)]), spokeSVG = spokes.map(p => K.line(p, C.red, 1.8)).join('');
    const spiral = (j0, j1) => Array.from({ length: j1 - j0 + 1 }, (_, k) => pt((j0 + k) % N, 6 + (j0 + k) * 1.15));
    const w1 = spiral(0, 18), w2 = spiral(18, 36), wl = (p, c) => K.line(p, OL, 4.6) + K.line(p, c, 3.2);
    const woven = notched + spokeSVG + wl(w1, C.blue) + wl(w2, C.yellow);
    return { id: 'plateweave', cat: 'thread', name: 'Paper plate weaving', ico: '🌀', lv: 2, min: 30, mat: [M.plate, M.scissors, ['🧶', 'wool in 3 colors'], M.pneedle], tip: 'An odd number of notches makes the over-under pattern swap by itself on each new round.', steps: [
      S('Snip little notches all round the edge of a paper plate.', 'cut', { base: pl, cuts: notches }),
      S('Wrap wool across the plate, notch to notch, like a big star.', 'draw', { base: notched, s: spokes, c: C.red, w: 1.8, tool: 'yarn', guide: false }),
      S('Tie a new color in the middle. Go over one spoke, under the next.', 'draw', { base: notched + spokeSVG, s: [{ p: w1, c: C.blue, w: 3.2 }], tool: 'yarn', guide: false }),
      S('Round and round! Change colors when you like.', 'draw', { base: notched + spokeSVG + wl(w1, C.blue), s: [{ p: w2, c: C.yellow, w: 3.2 }], tool: 'yarn', guide: false }),
      S('Tuck the end under and tie it tight.', 'knot', { base: woven, at: [100, 36], c: C.yellow }),
      S('A web of color! Hang it in a window.', 'show', { item: center(woven), kind: 'spin', speed: 0.25 })
    ] };
  })();

  const doughstar = (() => {
    const DOUGH = '#F1E4C8', slab = K.rect(28, 42, 144, 80, DOUGH, 16), xs = [62, 100, 138];
    const starAt = (x, c = '#F6EAD0') => K.poly(K.starPts(x, 82, 17), c, 1.4), stars = xs.map(x => starAt(x)).join('');
    const holes = xs.map(x => [x, 74]), holed = stars + holes.map(([x, y]) => K.hole(x, y, 2.6)).join('');
    const painted = xs.map((x, i) => starAt(x, [C.red, C.yellow, C.blue][i]) + K.circ(x, 86, 2.4, '#fff', 0) + K.circ(x - 6, 90, 1.8, '#fff', 0)).join('') + holes.map(([x, y]) => K.hole(x, y, 2.6)).join('');
    const ribbons = holes.map(([x, y]) => K.line([[x, y], [x, 50], [x + 3, 46]], C.red, 1.8)).join('');
    return { id: 'doughstar', cat: 'clay', name: 'Salt dough ornaments', ico: '⭐', lv: 2, min: 45, mat: [['🌾', '2 cups of flour'], ['🧂', '1 cup of salt'], ['💧', 'about 3/4 cup of water'], ['🥣', 'a big bowl and a spoon'], ['⭐', 'cookie cutters'], ['🥤', 'a straw'], M.paint, M.brush, M.ribbon, ['🔥', 'an oven (a grown-up uses it)']], tip: 'Bake low and slow (about 120°C for 2 to 3 hours) so they dry without puffing. Or let them air-dry for two days.', steps: [
      pourBowl('Put the flour and salt in a big bowl.', { grain: true, colors: ['#FFFFFF', '#F4F1E8'], lv1: 0.5 }),
      S('Add water bit by bit. Stir, then squish it with your hands.', 'stir', { at: [100, 92], r: 40, c0: '#FFFFFF', c1: DOUGH, bits: ['#fff', '#EADBB8'] }),
      S('Roll the dough flat, as thick as your finger.', 'clay', { mode: 'flat', at: [100, 92], r: 28, c: DOUGH }),
      S('Press out shapes with cookie cutters.', 'stamp', { base: slab, at: [62, 82], item: K.line(closed(K.starPts(0, 0, 18)), '#8A96A3', 3), print: starAt(62) }),
      S('Poke a hole near the top of each one with a straw.', 'punch', { base: stars, holes }),
      S('A grown-up bakes them slowly until hard. Let them cool.', 'oven', { item: mid(holed) }),
      S('Paint them bright. Thread a ribbon through each hole.', 'paint', { base: holed, area: painted + ribbons, box: [40, 44, 120, 60], c: C.red }),
      S('Hang your ornaments on a tree or in a window!', 'show', { item: mid(painted + ribbons), kind: 'swing' })
    ] };
  })();

  const diya = (() => {
    const CL = '#C98A5A', GOLD = '#F2B33D';
    const shape = c => K.path('M48,84 Q54,122 100,122 Q140,122 150,94 L178,80 L146,82 Q120,72 100,74 Q64,74 48,84Z', c) + K.ell(98, 82, 46, 8, 'rgba(0,0,0,.18)', 0);
    const zz = K.zig(58, 140, 104, 5, 8), dots = [64, 80, 96, 112, 128].map(x => K.circ(x, 112, 2.2, '#7A4A2A', 0)).join('');
    const pattern = K.line(zz, '#7A4A2A', 1.6) + dots, plain = shape(CL) + pattern;
    const painted = shape(GOLD) + K.line(zz, C.red, 2.4) + [64, 80, 96, 112, 128].map(x => K.circ(x, 112, 2.6, C.orange, 0)).join('') + K.path('M60,96 Q100,110 140,96', 'none', 0, `stroke="${C.red}" stroke-width="2.4"`);
    const light = K.rect(88, 70, 24, 10, '#F4F6F8', 3) + K.path('M100,54 Q108,64 100,70 Q92,64 100,54Z', C.orange, 1.2);
    const glowSVG = K.circ(100, 62, 18, 'rgba(255,214,80,.4)', 0) + light;
    return { id: 'diya', cat: 'world', name: 'Clay diya lamp', ico: '🪔', lv: 2, min: 40, mat: [M.clay, M.pencil, M.paint, M.brush, M.tlight], safe: 'Use a battery tea light. Real candles and flames are only for grown-ups.', tip: 'Diyas are little lamps lit for Diwali, the festival of lights. Make one for each person in the family!', steps: [
      S('Roll a ball of clay, as big as a plum.', 'clay', { mode: 'ball', at: [100, 86], r: 24, c: CL }),
      S('Push your thumb in the middle. Pinch the sides up into a bowl.', 'clay', { mode: 'pinch', at: [100, 92], r: 34, c: CL }),
      S('Pinch one side into a little spout for the light.', 'clay', { mode: 'squeeze', at: [96, 92], r: 30, c: CL }),
      S('Press a zigzag and dots round the side with a pencil.', 'draw', { base: shape(CL), s: [zz], c: '#7A4A2A', w: 1.6, tool: 'pen', fill: dots }),
      S('Let it dry. Paint it gold, orange and red.', 'paint', { base: plain, area: painted, box: [46, 70, 134, 54], c: GOLD }),
      S('Put a battery tea light inside. Never a real flame!', 'place', { base: painted, pieces: [{ svg: light, at: [100, 72], from: [0, -60] }] }),
      S('Happy Diwali! Your diya glows.', 'show', { item: mid(painted + glowSVG), kind: 'glow' })
    ] };
  })();

  const eidcard = (() => {
    const crescent = (cx, cy, r) => { const o = K.arc(cx, cy, r, r, 50, 310, 24), e = o[0], ic = cx + r * 0.46, d = Math.hypot(e[0] - ic, e[1] - cy), a = Math.atan2(e[1] - cy, e[0] - ic) * 180 / Math.PI; return o.concat(K.arc(ic, cy, d, d, 360 - a, a, 20)); };
    const B = K.ori('#1F4E8C', '#2E6BB8', [[30, 25], [170, 25], [170, 125], [30, 125]]);
    const s1 = B.fold('Fold dark blue card in half.', { from: [30, 75], to: [170, 75] });
    B.shift(-35, 0);
    const cardSVG = B.svg(), yel = K.rect(55, 30, 90, 90, C.yellow, 2), moonP = crescent(98, 75, 30), moon = K.poly(moonP, C.yellow, 1.4);
    const sm = crescent(92, 78, 22), smallMoon = K.poly(sm, C.yellow, 1.4), star = K.star(118, 58, 9, C.yellow);
    const sp = { a: 'sprinkle', box: [70, 34, 60, 86], colors: [C.yellow, '#FFFFFF'], n: 26 }, front = cardSVG + smallMoon + star;
    return { id: 'eidcard', cat: 'world', name: 'Eid moon card', ico: '🌙', lv: 2, min: 25, mat: [['🟦', 'dark blue card'], ['🟨', 'yellow paper'], M.pencil, M.scissors, M.glue, ['✨', 'glitter or star stickers']], tip: 'Eid comes at the end of Ramadan, when the new moon is seen. Write "Eid Mubarak" inside: it means "blessed celebration".', steps: [
      s1,
      S('Draw a big moon shape on yellow paper.', 'draw', { base: yel, s: [closed(moonP)], c: OL, w: 1.6, tool: 'pen' }),
      S('Cut out the moon.', 'cut', { base: yel + K.line(closed(moonP), OL, 1.6), pts: closed(moonP), piece: moon, off: [0, 0] }),
      S('Glue the moon and a star on the front of the card.', 'place', { base: cardSVG, pieces: [{ svg: smallMoon, at: [92, 78], from: [-60, -30] }, { svg: star, at: [118, 58], from: [50, -40] }] }),
      S('Add sparkly dots around them.', 'sprinkle', { base: front, ...sp }),
      S('Write Eid Mubarak inside. Give it to someone you love!', 'show', { item: mid(front + done(sp)), kind: 'bounce' })
    ] };
  })();

  const foamprint = (() => {
    const tray = K.rect(36, 20, 128, 110, '#EEF2F6', 16) + K.rect(46, 30, 108, 90, '#FBFCFD', 6), foam = K.rect(46, 30, 108, 90, '#FBFCFD', 4);
    const fish = closed(K.arc(92, 70, 30, 18, 25, 335, 24)).slice(0, -1).concat([[148, 56], [148, 84]]), fishL = closed(fish);
    const lines = [fishL, circlePts(76, 66, 4, 10), K.wave(52, 148, 104, 3, 3, 30), [[110, 60], [116, 66], [110, 72]]];
    const groove = c => lines.map(p => K.line(p, c, 2.4)).join('');
    const inked = K.rect(46, 30, 108, 90, C.blue, 4) + groove('#E9F2FC');
    const paperS = K.rect(42, 26, 116, 98, '#FFFFFF', 2), pic = K.rect(42, 26, 116, 98, '#FFFFFF', 2) + K.rect(46, 30, 108, 90, C.blue, 2) + groove('#FFFFFF');
    return { id: 'foamprint', cat: 'paint', name: 'Foam tray prints', ico: '🐠', lv: 2, min: 30, mat: [['🍱', 'a clean foam tray (from fruit or vegetables)'], M.scissors, M.pencil, M.paint, ['🧽', 'a small roller or a sponge'], M.paper], tip: 'This is real printmaking! Whatever you press in stays white. Writing comes out back to front, so draw pictures, not words.', steps: [
      S('Cut the curvy edges off a clean foam tray.', 'cut', { base: tray, pts: [[46, 30], [154, 30], [154, 120], [46, 120], [46, 30]] }),
      S('Press a picture into the foam with a pencil. Push hard!', 'draw', { base: foam, s: lines, c: '#B9C3CE', w: 2.4, tool: 'pen' }),
      S('Roll paint all over the foam.', 'roll', { base: foam + groove('#B9C3CE'), area: inked, box: [46, 30, 108, 90], c: C.blue }),
      S('Lay paper on top. Rub it all over with your hand.', 'place', { base: inked, pieces: [{ svg: paperS, at: [100, 75], from: [0, -80] }] }),
      S('Peel the paper off slowly. Your lines stay white!', 'peel', { base: pic, box: [42, 26, 116, 98], c: '#FFFFFF' }),
      S('A real print! Ink it again and make lots more.', 'show', { item: mid(pic), kind: 'glow' })
    ] };
  })();

  const penguin = (() => {
    const B = K.ori('#FFFFFF', '#2B2B33', [[100, 10], [165, 75], [100, 140], [35, 75]]);
    const s1 = S('Fold the square corner to corner, then open it again.', 'draw', { base: B.svg(), s: [[[100, 10], [100, 140]]], c: C.purple, dash: '5 4', tool: 'finger' });
    const s2 = B.fold('Fold the bottom tip up a little.', { from: [100, 140], to: [100, 118] });
    const s3 = B.fold('Fold the sides in, so they nearly meet in the middle.', { from: [35, 75], to: [90, 75] }, { from: [165, 75], to: [110, 75] });
    const s4 = B.fold('Fold the top tip down for the head.', { from: [100, 10], to: [100, 46] });
    const face = K.eye(94, 38, 3.4) + K.eye(106, 38, 3.4) + K.poly([[96, 43], [104, 43], [100, 50]], C.orange, 1.2), feet = K.ell(90, 122, 8, 3.5, C.orange, 1.2) + K.ell(110, 122, 8, 3.5, C.orange, 1.2);
    return { id: 'penguin', cat: 'fold', name: 'Origami penguin', ico: '🐧', lv: 2, min: 15, mat: [['⬛', 'square paper, black on one side'], M.pens, ['🟧', 'a bit of orange paper']], tip: 'Use paper with a dark side and a white side, so the penguin gets its white tummy all by itself.', steps: [
      s1, s2, s3, s4,
      S('Add eyes, an orange beak and two feet.', 'place', { base: B.svg(), pieces: [{ svg: face, at: [100, 42], from: [0, -50] }, { svg: feet, at: [100, 122], from: [0, 40] }] }),
      S('Waddle, waddle! Make a whole penguin family.', 'show', { item: mid(B.svg() + face + feet), kind: 'wiggle' })
    ] };
  })();

  const eggflowers = (() => {
    const carton = K.rect(40, 70, 112, 40, '#D9CDB8', 6) + [58, 82, 106, 130].map(x => K.ell(x, 90, 11, 16, '#C9BCA4', 1.2)).join('');
    const cupP = [[66, 46], [134, 46], [124, 104], [76, 104]], cup = K.poly(cupP, '#D9CDB8') + K.ell(100, 46, 34, 7, '#C9BCA4', 1.2);
    const flowerP = (cx, cy, r) => Array.from({ length: 60 }, (_, i) => { const a = i / 60 * Math.PI * 2, q = r * (0.7 + 0.3 * Math.abs(Math.cos(3 * a))); return [cx + q * Math.cos(a), cy + q * Math.sin(a)]; });
    const fl = flowerP(100, 70, 40), plain = K.poly(fl, '#D9CDB8') + K.circ(100, 70, 14, '#C9BCA4', 1.2);
    const bloom = (cx, cy, r, c, cc) => K.poly(flowerP(cx, cy, r), c) + K.circ(cx, cy, r * 0.35, cc, 1.2);
    const painted = bloom(100, 70, 40, C.pink, C.purple), stem = K.line([[100, 82], [100, 140]], C.green, 4) + K.leaf(112, 120, 10, C.green, -30);
    const button = K.circ(100, 70, 8, C.yellow, 1.2) + [[-2.5, -2.5], [2.5, -2.5], [-2.5, 2.5], [2.5, 2.5]].map(([a, b]) => K.circ(100 + a, 70 + b, 1.1, OL, 0)).join('');
    const bunch = [[60, 60, C.orange, C.red], [140, 60, C.blue, C.yellow], [100, 46, C.pink, C.purple]].map(([x, y, c, cc]) => K.line([[x, y + 10], [100, 140]], C.green, 3.5) + bloom(x, y, 26, c, cc)).join('');
    return { id: 'eggflowers', cat: 'recycle', name: 'Egg carton flowers', ico: '🌷', lv: 2, min: 30, mat: [['🥚', 'a cardboard egg carton'], M.scissors, M.paint, M.brush, ['〰️', 'pipe cleaners'], ['🔘', 'buttons']], tip: 'Snip the petals round, pointy or fringed: every egg cup becomes a different flower.', steps: [
      S('A grown-up cuts the egg cups apart.', 'cut', { base: carton, cuts: [[[70, 66], [70, 114]], [[94, 66], [94, 114]], [[118, 66], [118, 114]]] }),
      S('Snip down the sides of a cup to make petals.', 'cut', { base: cup, cuts: [[[78, 48], [84, 80]], [[100, 50], [100, 82]], [[122, 48], [116, 80]]] }),
      S('Open the petals out wide.', 'morph', { from: [{ p: cupP, c: '#D9CDB8' }], to: [{ p: fl, c: '#D9CDB8' }] }),
      S('Paint your flower. Let it dry.', 'paint', { base: plain, area: painted, box: [58, 28, 84, 84], c: C.pink }),
      S('Poke a pipe cleaner through the middle for a stem.', 'place', { base: painted, pieces: [{ svg: stem, at: [100, 110], from: [0, 50] }] }),
      S('Glue a button in the middle.', 'place', { base: stem + painted, pieces: [{ svg: button, at: [100, 70], from: [40, -50] }] }),
      S('Make a bunch for someone special!', 'show', { item: mid(bunch), kind: 'wiggle' })
    ] };
  })();

  const papelpicado = (() => {
    const PINK = '#F27FB2', B = K.ori(PINK, '#F59AC4', [[50, 25], [150, 25], [150, 125], [50, 125]]);
    const s1 = B.fold('Fold a sheet of tissue paper in half.', { from: [50, 75], to: [150, 75] });
    const s2 = B.fold('Fold it in half again.', { from: [125, 25], to: [125, 125] });
    const BGC = '#FFF6E5', hole = (pts) => K.poly(pts, BGC, 1);
    const cuts = [[[100, 84], [110, 90], [100, 96]], [[100, 104], [108, 110], [100, 116]], [[120, 75], [126, 84], [132, 75]], [[138, 75], [142, 82], [146, 75]]];
    const picado = (x, y, w, c) => { const k = w / 120, hx = (a, b) => [x + a * k, y + b * k];
      return K.rect(x, y, w, 96 * k, c, 1) + [[60, 30], [60, 62]].map(([a, b]) => hole([hx(a, b - 10), hx(a + 10, b), hx(a, b + 10), hx(a - 10, b)])).join('')
        + [[24, 30], [96, 30], [24, 62], [96, 62]].map(([a, b]) => K.circ(...hx(a, b), 6 * k, BGC, 1)).join('')
        + [[40, 46], [80, 46]].map(([a, b]) => hole([hx(a - 6, b), hx(a, b - 6), hx(a + 6, b), hx(a, b + 6)])).join('') + hole(Array.from({ length: 13 }, (_, i) => hx(i * 10, i % 2 ? 84 : 92)).concat([hx(120, 96), hx(0, 96)])); };
    const big = picado(40, 30, 120, PINK), strand = K.line([[6, 30], [194, 30]], OL, 1.4);
    const flags = [[14, C.orange], [74, C.green], [134, C.purple]].map(([x, c]) => picado(x, 31, 52, c)).join('');
    return { id: 'papelpicado', cat: 'world', name: 'Papel picado flags', ico: '🎊', lv: 2, min: 30, mat: [M.tissue, M.scissors, M.string, M.glue], tip: 'Papel picado means "punched paper". In Mexico, rows of these flags flutter at Día de Muertos and every fiesta.', steps: [
      s1, s2,
      S('Snip little triangles and points along the folds.', 'cut', { base: B.svg(), cuts }),
      S('Open it up slowly. What a pattern!', 'show', { item: mid(big), kind: 'glow' }),
      S('Fold the top over a long string and glue it.', 'glue', { base: strand + big, dots: [[50, 34], [70, 34], [90, 34], [110, 34], [130, 34], [150, 34]] }),
      S('Make more flags in other colors.', 'place', { base: strand, pieces: [[40, C.orange], [100, C.green], [160, C.purple]].map(([x], i) => ({ svg: picado(x - 26, 31, 52, [C.orange, C.green, C.purple][i]), at: [x, 50], from: [0, 60] })) }),
      S('Hang them up for Día de Muertos or a fiesta!', 'show', { item: mid(strand + flags), kind: 'swing' })
    ] };
  })();

  const koinobori = (() => {
    const tail = [[170, 75], [192, 52], [184, 75], [192, 98]];
    const outline = closed(K.arc(100, 75, 68, 24, 30, 330, 28).concat(tail.slice(1)));
    const scales = []; for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) scales.push(K.arc(70 + i * 22, 64 + j * 18, 10, 8, 0, 180, 8));
    const paper = K.rect(20, 40, 176, 70, '#FFFDF7', 2), lines = p => K.line(p, OL, 1.6);
    const fish = c => K.poly(outline, c) + scales.map(s => K.line(s, '#fff', 2)).join('') + K.circ(48, 70, 9, '#fff', 1.4) + K.circ(48, 70, 4, OL, 0) + K.ell(33, 75, 3, 10, OL, 0);
    const colored = paper + fish(C.red), streamers = [70, 75, 80].map((y, i) => K.line(K.wave(176, 196, y, 3, 1.5, 10), [C.blue, C.yellow, C.green][i], 4)).join('');
    const tube = fish(C.red) + streamers;
    return { id: 'koinobori', cat: 'world', name: 'Carp windsock (koinobori)', ico: '🎏', lv: 2, min: 30, mat: [['📄', 'a long piece of paper'], M.crayons, M.tape, M.tissue, M.glue, M.string], tip: 'On Children\'s Day in Japan (5 May), families fly carp windsocks: a carp swims up waterfalls, so it means "be strong".', steps: [
      S('Draw a big fish on long paper. Add scales like little rainbows.', 'draw', { base: paper, s: [outline, ...scales, circlePts(48, 70, 9, 12)], c: OL, w: 1.6, tool: 'pen' }),
      S('Color your fish. Red, blue or gold!', 'paint', { base: paper + lines(outline) + scales.map(s => K.line(s, OL, 1.4)).join(''), area: colored, box: [20, 40, 176, 70], c: C.red, tool: 'crayon' }),
      S('Roll it into a tube and tape the edges.', 'place', { base: fish(C.red), pieces: [60, 100, 140].map(x => ({ svg: tapeP(x, 98, 12, 8, 90), at: [x, 98], from: [0, 40] })) }),
      S('Glue tissue streamers on the tail.', 'place', { base: fish(C.red), pieces: [{ svg: streamers, at: [186, 75], from: [30, 0] }] }),
      S('Tie string to the mouth. Tie it to a stick.', 'knot', { base: tube, at: [30, 66], c: OL }),
      S('Run with it! Your carp swims in the wind.', 'show', { item: K.g(tube, -100, -75, 0.8), kind: 'fly', at: [100, 70] })
    ] };
  })();

  /* ================= tricky ================= */
  const fingerknit = (() => {
    const xs = [70, 90, 110, 130], c = C.red, hand = handSVG(xs), endP = K.line([[34, 120], [48, 104], [58, 96]], c, 3.2);
    const rope = K.line(K.wave(-80, 80, 0, 6, 4, 60), OL, 9) + K.line(K.wave(-80, 80, 0, 6, 4, 60), c, 7) + Array.from({ length: 16 }, (_, i) => K.ell(-75 + i * 10, Math.sin(i / 15 * 8 * Math.PI) * 6, 4, 3, 'none', 0, 'stroke="rgba(255,255,255,.55)" stroke-width="1.2"')).join('');
    return { id: 'fingerknit', cat: 'string', name: 'Finger knitting', ico: '🧣', lv: 3, min: 30, mat: [['🧶', 'thick, soft wool']], tip: 'Keep the loops loose. If one slips off, just put it back on the finger and carry on. The long cord makes scarves, headbands and dolls\' hair.', steps: [
      S('Hold the wool end between your thumb and your first finger.', 'place', { base: hand, pieces: [{ svg: endP, at: [52, 104], from: [-40, 20] }] }),
      S('Weave the wool in and out of your fingers, there and back.', 'knit', { mode: 'wrap', rows: 0, c }),
      S('Now lay the wool across the front of all four fingers.', 'knit', { mode: 'wrap', rows: 1, c }),
      S('Lift each bottom loop up, over the top and off the finger.', 'knit', { mode: 'lift', c }),
      S('Lay the wool across again and lift again. Over and over!', 'knit', { mode: 'lift', c, pre: 5 }),
      S('When it is long, cut the wool. Thread the end through all the loops.', 'knot', { at: [100, 70], c }),
      S('A long, soft cord! Make a scarf for your teddy.', 'show', { item: rope, kind: 'wiggle' })
    ] };
  })();

  const godseye = (() => {
    const cx = 100, cy = 75, sv = stick(cx, cy, 124, 90, C.tan, 8), sh = stick(cx, cy, 124, 0, C.tan, 8), cross = sv + sh;
    const wrapP = (r0, r1) => { const n = Math.round((r1 - r0) / 1.1); return Array.from({ length: n + 1 }, (_, j) => { const a = (j * 90 - 90) * Math.PI / 180, r = r0 + (r1 - r0) * j / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }); };
    const w1 = wrapP(4, 22), w2 = wrapP(22, 38), w3 = wrapP(38, 52), wl = (p, c) => K.line(p, OL, 4.8) + K.line(p, c, 3.4);
    const all = cross + wl(w1, C.red) + wl(w2, C.yellow) + wl(w3, C.blue), tassel = Array.from({ length: 5 }, (_, i) => K.line([[cx, 136], [cx - 6 + i * 3, 148]], C.blue, 2)).join('');
    const d = (p, c) => ({ s: [{ p, c, w: 3.4 }], tool: 'yarn', guide: false });
    return { id: 'godseye', cat: 'world', name: 'God\'s eye weaving', ico: '✴️', lv: 3, min: 40, mat: [['🪵', '2 craft sticks or straight twigs'], ['🧶', 'wool in 3 colors'], M.pva, M.scissors], tip: 'The Ojo de Dios comes from the Huichol people of Mexico. Turn the sticks, not the wool, and keep the wool tight.', steps: [
      S('Cross two sticks. Glue them in the middle.', 'place', { base: sv, pieces: [{ svg: sh, at: [cx, cy], from: [0, -50], r: 40 }] }),
      S('Tie the wool round the middle to hold them tight.', 'knot', { base: cross, at: [cx, cy], c: C.red }),
      S('Wrap the wool over a stick and round it. Turn to the next stick.', 'draw', { base: cross, ...d(w1, C.red) }),
      S('Change color. Keep turning and wrapping!', 'draw', { base: cross + wl(w1, C.red), ...d(w2, C.yellow) }),
      S('Add a third color near the ends.', 'draw', { base: cross + wl(w1, C.red) + wl(w2, C.yellow), ...d(w3, C.blue) }),
      S('Tie off the end. Add a tassel at the bottom.', 'tie', { base: all + tassel, at: [cx, 134], c: C.blue }),
      S('A God\'s eye from Mexico. It watches over your room!', 'show', { item: mid(all + tassel), kind: 'swing' })
    ] };
  })();

  const feltornament = (() => {
    const tree = [[100, 20], [134, 58], [120, 58], [146, 94], [124, 94], [152, 124], [48, 124], [76, 94], [54, 94], [80, 58], [66, 58]], tc = closed(tree), inset = closed(scale(tree, 100, 82, 0.84));
    const felt = K.rect(34, 12, 132, 124, '#7CC79A', 4), shape = K.poly(tree, C.green) + K.rect(92, 124, 16, 10, C.brown, 2);
    const st1 = { a: 'stitch', base: shape, pts: inset.slice(0, 9), c: C.red }, s1 = done(st1);
    const st2 = { a: 'stitch', base: s1 + cotton(84, 104), pts: inset.slice(8), c: C.red }, sewn = done(st2);
    const baubles = [[100, 50, C.yellow], [86, 78, C.red], [114, 82, C.blue], [76, 108, C.purple], [124, 108, C.yellow], [100, 102, C.pink]].map(([x, y, c]) => K.bead(x, y, 4.5, c)).join('');
    const loop = K.ell(100, 13, 5, 7, 'none', 0, `stroke="${C.red}" stroke-width="2.4"`), full = sewn + baubles + loop;
    return { id: 'feltornament', cat: 'sew', name: 'Felt Christmas tree ornament', ico: '🎄', lv: 3, min: 45, mat: [M.felt, ['🖍️', 'chalk'], M.scissors, M.needle, M.thread, M.stuffing, ['🔘', 'small buttons or beads'], M.ribbon], tip: 'Running stitch is fine, and so are big wonky stitches. Thread the needle with a doubled thread knotted at the end, so it cannot slip off.', steps: [
      S('Draw a tree on green felt with chalk.', 'draw', { base: felt, s: [tc], c: '#FFFFFF', w: 2 }),
      S('Cut out two trees, the same size.', 'cut', { base: felt + K.line(tc, '#fff', 2), pts: tc }),
      S('Hold them together. Sew round the edge, up and down.', 'stitch', st1),
      S('Leave a gap. Push in a little stuffing.', 'place', { base: s1, pieces: [{ svg: cotton(84, 104), at: [84, 104], from: [-60, 30] }] }),
      S('Sew the gap closed. Tie a knot at the back.', 'stitch', st2),
      S('Sew or glue on little button baubles.', 'place', { base: sewn, pieces: [{ svg: baubles, at: [100, 80], from: [0, -60] }] }),
      S('Tie a ribbon loop at the top.', 'tie', { base: sewn + baubles + loop, at: [100, 20], c: C.red }),
      S('Hang it on the tree, or give it as a gift!', 'show', { item: mid(full), kind: 'swing' })
    ] };
  })();

  const crossstitch = (() => {
    const x0 = 40, y0 = 21, cs = 12, cols = 10, rows = 9;
    const grid = K.rect(x0 - 4, y0 - 4, cols * cs + 8, rows * cs + 8, '#FFF9EE', 3) + Array.from({ length: cols + 1 }, (_, i) => K.line([[x0 + i * cs, y0], [x0 + i * cs, y0 + rows * cs]], 'rgba(34,48,90,.2)', 0.8)).join('') + Array.from({ length: rows + 1 }, (_, j) => K.line([[x0, y0 + j * cs], [x0 + cols * cs, y0 + j * cs]], 'rgba(34,48,90,.2)', 0.8)).join('');
    const HEART = { 1: [2, 3, 6, 7], 2: [1, 2, 3, 4, 5, 6, 7, 8], 3: [1, 2, 3, 4, 5, 6, 7, 8], 4: [2, 3, 4, 5, 6, 7], 5: [3, 4, 5, 6], 6: [4, 5] };
    const cells = Object.entries(HEART).flatMap(([r, cs2]) => cs2.map(c => [x0 + c * cs, y0 + +r * cs]));
    const mk = { a: 'dab', pts: cells.map(([x, y]) => [x + cs / 2, y + cs / 2, 'rgba(242,96,79,.35)']), shape: 'dot', r: 2.4, tool: 'finger' }, marked = grid + done(mk);
    const X = ([x, y]) => K.line([[x + 2, y + 10], [x + 10, y + 2]], C.red, 2.2) + K.line([[x + 2, y + 2], [x + 10, y + 10]], C.red, 2.2);
    const row2 = cells.filter(([, y]) => y === y0 + 2 * cs);
    const fwd = row2.flatMap(([x, y]) => [[x + 2, y + 10], [x + 10, y + 2]]), back = row2.slice().reverse().flatMap(([x, y]) => [[x + 10, y + 10], [x + 2, y + 2]]);
    const half = marked + row2.map(([x, y]) => K.line([[x + 2, y + 10], [x + 10, y + 2]], C.red, 2.2)).join(''), allX = cells.map(X).join('');
    return { id: 'crossstitch', cat: 'sew', name: 'Cross-stitch heart', ico: '❣️', lv: 3, min: 45, mat: [['🔲', 'plastic canvas or binca fabric'], M.thread, M.pneedle, M.pens, M.scissors], tip: 'Counting squares is great maths practice! Keep all the top stitches slanting the same way and it looks neat.', steps: [
      S('Count the squares. Mark a heart shape with dots.', 'dab', { base: grid, ...mk }),
      S('Sew a row of slanted stitches, corner to corner.', 'stitch', { base: marked, pts: fwd, c: C.red }),
      S('Come back along the row the other way. Now each one is an X!', 'stitch', { base: half, pts: back, c: C.red }),
      S('Do every row the same way. Count as you go!', 'ring', { base: marked, items: cells.map(([x, y]) => ({ x: x + 6, y: y + 6, svg: X([x, y]) })) }),
      S('Turn it over. Tie a knot at the back and snip the end.', 'knot', { at: [100, 70], c: C.red }),
      S('A stitched heart! Frame it, or sew it on a bag.', 'show', { item: mid(grid + allX), kind: 'glow' })
    ] };
  })();

  const macheplanet = (() => {
    const cx = 100, cy = 72, rx = 40, ry = 46, balloon = K.ell(cx, cy, rx, ry, C.blue) + K.ell(cx - 14, cy - 18, 6, 10, 'rgba(255,255,255,.5)', 0);
    const L1 = bands(cx, cy, rx, ry, 6, 0), L2 = bands(cx, cy, rx, ry, 5, 1, ['#F4ECDA', '#E9E0CC']), covered = balloon + done({ a: 'layer', strips: L1 }) + done({ a: 'layer', strips: L2 });
    const planet = K.ell(cx, cy, rx, ry, C.orange) + [[-20, -24, 22, 4], [-30, 0, 34, 5], [-22, 22, 26, 4]].map(([a, b, w, h]) => K.ell(cx + a + w / 2, cy + b, w, h, '#F7B267', 0)).join('') + K.circ(cx + 14, cy - 8, 6, '#D96A2B', 0);
    const ringSVG = K.ell(cx, cy, 70, 14, 'none', 0, `stroke="${OL}" stroke-width="8"`) + K.ell(cx, cy, 70, 14, 'none', 0, `stroke="${C.yellow}" stroke-width="5.6"`), front = `<path d="M30,72 A70,14 0 0 0 170,72" fill="none" stroke="${C.yellow}" stroke-width="5.6"/>`;
    const saturn = ringSVG + planet + front;
    return { id: 'macheplanet', cat: 'recycle', name: 'Papier-mâché planet', ico: '🪐', lv: 3, min: 90, mat: [M.balloon, M.news, M.pastem, M.paint, M.brush, M.card, M.scissors, M.string], tip: 'Do it over three days: layers, drying, then painting. Make all eight planets and hang them in order from the Sun!', steps: [
      S('Blow up a round balloon and tie it.', 'inflate', { at: [cx, 70], r: 46, c: C.blue }),
      S('Tear newspaper into lots of strips.', 'tear', { box: [40, 40, 120, 70], n: 6, c: '#E9E9E4' }),
      paste('Stir flour and water into a gooey paste.'),
      S('Dip a strip. Slide off the extra paste. Lay it on the balloon.', 'layer', { base: balloon, strips: L1 }),
      S('Cover it all, three layers thick. Let it dry for two days.', 'layer', { base: balloon + done({ a: 'layer', strips: L1 }), strips: L2 }),
      S('Paint it like a planet. Swirls, spots or stripes!', 'paint', { base: covered, area: planet, box: [cx - rx, cy - ry, rx * 2, ry * 2], c: C.orange }),
      S('Cut a card ring and slide it on. Now it is Saturn!', 'place', { base: planet, pieces: [{ svg: ringSVG + front, at: [cx, cy], from: [0, -60], r: -20 }] }),
      S('Hang your planet up high. Make the whole solar system!', 'show', { item: mid(saturn), kind: 'float', s: 0.9 })
    ] };
  })();

  const stickcatapult = (() => {
    const pile = Array.from({ length: 5 }, (_, i) => stick(100, 110 - i * 9, 120, 0, C.tan, 8)).join(''), bandA = [52, 66, 14, 44];
    const twoS = stick(96, 56, 120, 0, C.tan, 8) + stick(96, 66, 120, 0, C.tan, 8);
    const low = stick(96, 116, 130, 0, C.tan, 8), arm = K.g(K.rect(-130, -4, 130, 8, C.tan, 4), 160, 112, 1, 14), block = Array.from({ length: 5 }, (_, i) => K.rect(98, 82 + i * 6, 22, 6, '#D9B98A', 2)).join('');
    const side = low + block, cap = K.rect(30, 76, 18, 8, C.red, 2), xBand = K.line([[96, 80], [122, 112]], C.purple, 2.2) + K.line([[122, 80], [96, 112]], C.purple, 2.2);
    const pom = K.circ(39, 70, 6, C.pink, 1.2), full = side + arm + xBand + cap;
    return { id: 'stickcatapult', cat: 'build', name: 'Craft stick catapult', ico: '🏹', lv: 3, min: 30, mat: [['🪵', '7 craft sticks'], M.bands, ['🥤', 'a bottle cap'], M.pva, ['☁️', 'pom-poms or scrunched paper balls']], safe: 'Fire only soft things, and never at people or pets.', tip: 'Science: the bent stick stores energy, like a spring. Move the pile closer to the cap: does it fly higher or further?', steps: [
      S('Stack five craft sticks in a pile.', 'stack', { pieces: Array.from({ length: 5 }, (_, i) => ({ svg: stick(100, 110 - i * 9, 120, 0, C.tan, 8), at: [100, 110 - i * 9], h: 60 })) }),
      S('Wrap a rubber band tight round each end of the pile.', 'wrap', { base: pile, box: bandA, n: 6, c: C.purple }),
      S('Hold two more sticks together. Band them at one end only.', 'wrap', { base: twoS, box: [140, 48, 12, 26], n: 4, c: C.purple }),
      S('Open the two sticks. Push the pile in between them.', 'place', { base: low + arm, pieces: [{ svg: block, at: [109, 97], from: [-70, 0] }] }),
      S('Wrap a band round the middle in an X shape.', 'wrap', { base: side + arm, box: [96, 80, 26, 32], n: 5, c: C.purple }),
      S('Glue a bottle cap on the end of the top stick.', 'place', { base: side + arm + xBand, pieces: [{ svg: cap, at: [39, 80], from: [-20, -60] }] }),
      S('Put a pom-pom in the cap. Push down, then let go!', 'launch', { base: side + xBand, at: [160, 110], arm: 124, c: C.pink, target: [24, 120] }),
      S('Ping! How far can it fly? Measure it!', 'show', { item: mid(full + pom), kind: 'bounce' })
    ] };
  })();

  const kabuto = (() => {
    const B = K.ori('#DCEBFF', C.blue, [[100, 10], [165, 75], [100, 140], [35, 75]]);
    const s1 = B.fold('Fold the top corner down to the bottom. A triangle!', { from: [100, 10], to: [100, 140] });
    const s2 = B.fold('Fold both side corners down to the bottom point.', { from: [35, 75], to: [100, 140] }, { from: [165, 75], to: [100, 140] });
    B.shift(0, -26);
    const dome = { p: [[100, 49], [132.5, 81.5], [67.5, 81.5]], f: 1 }, lowD = { p: [[67.5, 81.5], [132.5, 81.5], [100, 114]], f: 1 };
    const s3 = B.morph('Fold the two front points up to the top.', [dome, lowD, { p: [[67.5, 81.5], [100, 81.5], [100, 49]], f: 0 }, { p: [[132.5, 81.5], [100, 81.5], [100, 49]], f: 0 }]);
    const hornL = { p: [[70, 81], [98, 81], [58, 44]], f: 0 }, hornR = { p: [[130, 81], [102, 81], [142, 44]], f: 0 };
    const s4 = B.morph('Fold the points out to the sides. These are the horns!', [dome, lowD, hornL, hornR]);
    const s5 = B.morph('Fold the bottom flap up, then up again. That is the brim.', [dome, hornL, hornR, { p: [[64, 82], [136, 82], [130, 100], [70, 100]], f: 0 }]);
    const crest = K.circ(100, 66, 7, C.yellow, 1.2) + K.star(100, 66, 4, C.red);
    return { id: 'kabuto', cat: 'fold', name: 'Origami samurai helmet', ico: '⛑️', lv: 3, min: 20, mat: [['🟦', 'square paper (newspaper squares make one you can wear)'], M.pens], tip: 'In Japan, children fold kabuto helmets for Children\'s Day. A big square of newspaper, about 50 cm, fits a child\'s head.', steps: [
      s1, s2, s3, s4, s5,
      S('Tuck the last flap inside. Draw a crest on the front.', 'draw', { base: B.svg(), s: [circlePts(100, 66, 7, 14)], c: C.yellow, w: 2.4, tool: 'pen', fill: crest }),
      S('A samurai helmet! Open the bottom and put it on.', 'show', { item: mid(B.svg() + crest), kind: 'bounce' })
    ] };
  })();

  const coilpot = (() => {
    const CL = '#C98A5A', coil = (y, rx) => K.ell(100, y, rx, 7, 'none', 0, `stroke="${OL}" stroke-width="10"`) + K.ell(100, y, rx, 7, 'none', 0, `stroke="${CL}" stroke-width="7.4"`);
    const baseD = K.ell(100, 112, 42, 9, CL), rs = [110, 101, 92, 83, 74].map((y, i) => [y, 38 + i * 2]);
    const pot = baseD + rs.map(([y, rx]) => coil(y, rx)).join('');
    const smooth = K.path('M60,110 L62,72 Q100,64 138,72 L140,110 Q100,122 60,110Z', CL), painted = K.path('M60,110 L62,72 Q100,64 138,72 L140,110 Q100,122 60,110Z', C.blue) + K.ell(100, 72, 38, 7, '#1E5FA0') + K.line(K.wave(62, 138, 92, 4, 4), C.yellow, 3) + [70, 90, 110, 130].map(x => K.circ(x, 104, 2.6, '#fff', 0)).join('');
    return { id: 'coilpot', cat: 'clay', name: 'Clay coil pot', ico: '🏺', lv: 3, min: 60, mat: [M.clay, ['💧', 'a little water'], M.paint, M.brush], tip: 'People have made pots this way for thousands of years. Scratch and wet each coil a little so it sticks to the one below.', steps: [
      S('Flatten a clay ball into a round base.', 'clay', { mode: 'flat', at: [100, 112], r: 22, c: CL }),
      S('Roll long snakes, as thin as a pencil.', 'clay', { mode: 'snake', at: [100, 80], r: 10, c: CL }),
      S('Coil a snake round the edge of the base.', 'clay', { mode: 'coil', at: [100, 80], r: 30, c: CL }),
      S('Stack more coils on top, round and round.', 'stack', { base: baseD, pieces: rs.map(([y, rx]) => ({ svg: coil(y, rx), at: [100, y], h: 50 })) }),
      S('Smooth the inside with a wet finger so the coils stick.', 'draw', { base: pot, s: [[[66, 104], [70, 84], [74, 74]], [[100, 108], [100, 80]], [[134, 104], [130, 84], [126, 74]]], c: '#B07448', w: 4, tool: 'finger', guide: false }),
      S('Let it dry for two days. Then paint it.', 'paint', { base: smooth + K.ell(100, 72, 38, 7, '#A86B3C'), area: painted, box: [60, 64, 80, 58], c: C.blue }),
      S('A real coil pot! Keep pencils or treasures in it.', 'show', { item: mid(painted), kind: 'glow' })
    ] };
  })();

  const stringprint = (() => {
    const block = K.rect(55, 30, 90, 90, C.card, 4), sp = K.spiral(100, 75, 4, 36, 2.6, 70);
    const glueL = K.line(sp, '#B9D8F5', 6) + K.line(sp, '#fff', 4), str = c => K.line(sp, OL, 4.4) + K.line(sp, c, 3);
    const inked = block + K.rect(55, 30, 90, 90, 'rgba(109,85,209,.25)', 4) + str(C.purple), small = (x, y, c) => K.g(K.line(sp, c, 3), x - 100 * 0.5, y - 75 * 0.5, 0.5);
    const print1 = small(62, 56, C.purple), more = [[100, 56, C.blue], [138, 56, C.purple], [62, 100, C.blue], [100, 100, C.purple], [138, 100, C.blue]];
    const rg = { a: 'ring', items: more.map(([x, y, c]) => ({ x, y, svg: small(x, y, c) })) }, pic = sheet() + print1 + done(rg);
    return { id: 'stringprint', cat: 'paint', name: 'String print block', ico: '〰️', lv: 3, min: 40, mat: [['🟫', 'a square of thick card'], M.pva, ['🧵', 'thick string or wool'], M.paint, ['🧽', 'a roller or a brush'], M.paper], tip: 'Make several blocks (a spiral, a wave, a zigzag) and print them together to make wrapping paper.', steps: [
      S('Draw a swirly line of glue on thick card.', 'draw', { base: block, s: [sp], tool: 'glue', w: 4 }),
      S('Press string along the glue line. Let it dry.', 'draw', { base: block + glueL, s: [sp], c: '#F4F1E8', w: 3, tool: 'yarn', guide: false }),
      S('Roll paint over the string.', 'roll', { base: block + str('#F4F1E8'), area: inked, box: [55, 30, 90, 90], c: C.purple }),
      S('Turn it over and press it on paper. Press hard!', 'stamp', { base: sheet(), at: [62, 56], item: center(inked, 0.42), print: print1 }),
      S('Print it again and again in rows. A pattern!', 'ring', { base: sheet() + print1, ...rg }),
      S('Your own printing block! Try a star or a fish next.', 'show', { item: mid(pic), kind: 'glow' })
    ] };
  })();

  const fanous = (() => {
    const shapeP = [[72, 40], [100, 16], [128, 40], [128, 112], [100, 132], [72, 112]], panelC = '#6D55D1';
    const card = K.rect(40, 10, 120, 130, panelC, 3), panel = K.poly(shapeP, panelC), holes = [];
    K.starPts(100, 76, 22, 5, 0.45).forEach(p => holes.push(p)); holes.push([100, 76], [100, 34], [86, 118], [114, 118]);
    const holed = panel + holes.map(([x, y]) => K.hole(x, y, 3)).join(''), tissue = K.poly(shapeP, 'rgba(255,226,120,.35)', 0);
    const lit = panel + holes.map(([x, y]) => K.circ(x, y, 3.4, C.yellow, 1)).join('');
    const side = (dx, c) => K.poly(shapeP.map(([x, y]) => [100 + (x - 100) * 0.45 + dx, y]), c);
    const lantern = side(-40, '#5A44B8') + side(40, '#5A44B8') + lit, handle = K.path('M86,20 Q100,-4 114,20', 'none', 0, `stroke="${C.yellow}" stroke-width="4"`);
    const glowL = K.circ(100, 76, 30, 'rgba(255,214,80,.3)', 0) + lantern + handle;
    return { id: 'fanous', cat: 'world', name: 'Ramadan lantern (fanous)', ico: '🏮', lv: 3, min: 50, mat: [['🟪', '4 pieces of thin card'], M.ruler, M.pencil, M.scissors, M.punch, ['🟡', 'yellow tissue paper'], M.glue, M.tape, M.tlight], safe: 'Use a battery light only, never a candle inside paper.', tip: 'In Egypt and many other places, children carry glowing fanous lanterns during Ramadan. Make one panel first as a pattern for the other three.', steps: [
      S('Draw a lantern shape on card. Use a ruler for the straight sides.', 'draw', { base: card, s: [closed(shapeP)], c: '#FFFFFF', w: 1.8, tool: 'pen' }),
      S('Cut it out. Make three more the same.', 'cut', { base: card + K.line(closed(shapeP), '#fff', 1.8), pts: closed(shapeP) }),
      S('Punch holes in a star pattern.', 'punch', { base: panel, holes, r: 3 }),
      S('Glue yellow tissue on the back. The holes will glow!', 'place', { base: holed, pieces: [{ svg: tissue, at: [100, 74], from: [0, -70] }] }),
      S('Tape the four sides together into a tall lantern.', 'rise', { pieces: [{ svg: side(-40, '#5A44B8'), at: [60, 132], h: 110 }, { svg: lit, at: [100, 132], h: 110 }, { svg: side(40, '#5A44B8'), at: [140, 132], h: 110 }] }),
      S('Add a card handle on top.', 'place', { base: lantern, pieces: [{ svg: handle, at: [100, 10], from: [0, -40] }] }),
      S('Put a battery light inside. Ramadan Kareem!', 'show', { item: mid(glowL), kind: 'glow' })
    ] };
  })();

  const mkeka = (() => {
    const BLK = '#2B2B33', B = K.ori(BLK, '#3A3A44', [[30, 20], [170, 20], [170, 130], [30, 130]]);
    const s1 = B.fold('Fold black paper in half.', { from: [100, 20], to: [100, 130] });
    B.shift(0, -27);
    const xs = [1, 2, 3, 4, 5, 6].map(i => 30 + i * 20), cuts = xs.map(x => [[x, 48], [x, 94]]);
    const W = { a: 'weave', mat: [30, 20, 140, 110], bands: 7, rows: 5, c: BLK, sc: [C.red, C.green, C.red, C.green, C.red] };
    const mat = done({ ...W, row: 4 }), ends = [0, 1, 2, 3, 4].flatMap(r => { const y = 20 + 10 + 90 * (r + 0.5) / 5; return [[34, y], [166, y]]; });
    return { id: 'mkeka', cat: 'world', name: 'Kwanzaa woven mat (mkeka)', ico: '🟥', lv: 3, min: 40, mat: [['⬛', 'black paper'], ['🟥', 'red and green paper strips'], M.ruler, M.pencil, M.scissors, M.glue], tip: 'The mkeka mat is the first thing set out for Kwanzaa, an African-American celebration of family and harvest. Red, black and green are its colors.', steps: [
      s1,
      S('Draw lines from the fold, a finger apart. Stop near the edge.', 'measure', { base: B.svg(), from: [30, 48], to: [170, 48], n: 7, nums: false }),
      S('Cut along each line. Then open it up.', 'cut', { base: B.svg(), cuts }),
      S('Weave a red strip: over, under, over, under.', 'weave', { ...W, row: 0 }),
      S('Weave a green strip the other way: under, over. Push it up close.', 'weave', { ...W, row: 1 }),
      S('Keep going: red, green, red. Fill the mat!', 'weave', { ...W, row: 4 }),
      S('Glue the strip ends down at the sides.', 'glue', { base: mat, dots: ends }),
      S('A mkeka for Kwanzaa! Put fruit on it for the harvest.', 'show', { item: mid(mat), kind: 'glow' })
    ] };
  })();

  const rakhi = (() => {
    const cols = [C.red, C.yellow, C.orange], braidH = Array.from({ length: 16 }, (_, i) => { const x = 22 + i * 10.4; return `<ellipse cx="${f1(x)}" cy="${i % 2 ? 77 : 73}" rx="7" ry="4.5" transform="rotate(${i % 2 ? -30 : 30} ${f1(x)} 75)" fill="${cols[i % 3]}" stroke="${OL}" stroke-width="1.1"/>`; }).join('');
    const petals = Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return K.ell(100 + 16 * Math.cos(a), 75 + 16 * Math.sin(a), 9, 6, C.pink, 1.2, `transform="rotate(${i * 45} ${f1(100 + 16 * Math.cos(a))} ${f1(75 + 16 * Math.sin(a))})"`); }).join('');
    const flPts = Array.from({ length: 64 }, (_, i) => { const a = i / 64 * Math.PI * 2, r = 22 + 6 * Math.cos(8 * a); return [100 + r * Math.cos(a), 75 + r * Math.sin(a)]; });
    const felt = K.rect(60, 35, 80, 80, C.pink, 3), flower = petals + K.circ(100, 75, 10, C.yellow, 1.2), bead = K.bead(100, 75, 6, C.red);
    const rk = braidH + flower + bead;
    return { id: 'rakhi', cat: 'world', name: 'Rakhi bracelet', ico: '🪢', lv: 3, min: 35, mat: [['🧵', 'embroidery thread in 3 colors'], M.tape, ['🟪', 'a bit of felt or card'], M.scissors, ['🔴', 'a big bead or sequin'], M.pva], tip: 'At Raksha Bandhan in India, sisters tie a rakhi on their brothers\' wrists (and cousins and friends join in) as a promise to look after each other.', steps: [
      S('Knot three threads together at the top. Tape the knot down.', 'knot', { at: [100, 60], c: C.red }),
      S('Braid them: left over the middle, then right over the middle.', 'braid', { at: [100, 22], colors: cols, n: 5 }),
      S('Keep braiding until it fits round a wrist.', 'braid', { at: [100, 22], colors: cols, n: 10 }),
      S('Cut a felt flower for the middle.', 'cut', { base: felt, pts: closed(flPts) }),
      S('Glue a big bead in the middle of the flower.', 'place', { base: flower, pieces: [{ svg: bead, at: [100, 75], from: [0, -50] }] }),
      S('Glue the flower onto the middle of the braid.', 'place', { base: braidH, pieces: [{ svg: flower + bead, at: [100, 75], from: [0, -60] }] }),
      S('Tie it on a brother\'s or sister\'s wrist. Happy Raksha Bandhan!', 'show', { item: mid(rk), kind: 'bounce' })
    ] };
  })();

  const windchime = (() => {
    const xs = [56, 78, 100, 122, 144], lens = [52, 72, 84, 70, 50], bar = stick(100, 30, 128, 0, C.brown, 10);
    const capAt = (x, y, c) => K.circ(x, y, 9, c) + K.circ(x, y, 5.5, 'none', 1);
    const keyAt = (x, y) => K.circ(x, y - 6, 6, C.yellow) + K.circ(x, y - 6, 2, '#FFF6E5', 1) + K.rect(x - 1.8, y, 3.6, 16, C.yellow, 1) + K.rect(x, y + 10, 5, 3, C.yellow, 0);
    const spoonAt = (x, y) => K.ell(x, y + 10, 6, 8, '#C9D3DC') + K.rect(x - 1.6, y - 12, 3.2, 16, '#C9D3DC', 1);
    const items = (i, x, y) => i % 2 ? (i === 1 ? keyAt(x, y) : spoonAt(x, y)) : capAt(x, y, [C.red, C.blue, C.green][i / 2]);
    const hang = xs.map((x, i) => K.line([[x, 34], [x, 30 + lens[i]]], OL, 1.2) + items(i, x, 38 + lens[i])).join(''), chime = bar + hang + K.path('M40,30 Q100,-4 160,30', 'none', 0, `stroke="${OL}" stroke-width="1.4"`);
    const caps = [60, 100, 140].map((x, i) => capAt(x, 75, [C.red, C.blue, C.green][i])).join('');
    return { id: 'windchime', cat: 'recycle', name: 'Recycled wind chime', ico: '🎐', lv: 3, min: 40, mat: [['🥤', 'metal bottle caps'], ['🔑', 'old keys and spoons'], ['🪵', 'a stick'], M.string, M.scissors, ['🔨', 'a hammer and nail (a grown-up makes the holes)']], safe: 'A grown-up makes the holes. Metal edges can be sharp, so check for rough bits first.', tip: 'Hang longer strings in the middle so the pieces knock together in the wind. Different metals ring with different notes.', steps: [
      S('A grown-up makes a hole in each bottle cap.', 'punch', { base: caps, holes: [[60, 75], [100, 75], [140, 75]], r: 2.6 }),
      S('Cut five strings, all different lengths.', 'measure', { from: [30, 110], to: [170, 110], n: 5, nums: true }),
      S('Tie a cap, a key or an old spoon on each string.', 'knot', { at: [100, 70], c: OL }),
      S('Tie the strings along a stick. Long ones go in the middle.', 'place', { base: bar, pieces: xs.map((x, i) => ({ svg: K.line([[x, 34], [x, 30 + lens[i]]], OL, 1.2) + items(i, x, 38 + lens[i]), at: [x, 60], from: [0, 60] })) }),
      S('Tie one more string to both ends of the stick for hanging.', 'draw', { base: bar + hang, s: [K.arc(100, 30, 60, 26, 180, 360, 20)], c: OL, w: 1.4, tool: 'finger' }),
      S('Tap them gently: ding, ding, ding!', 'music', { base: chime, mode: 'tap', pts: xs.map((x, i) => [x, 38 + lens[i]]) }),
      S('Hang it outside. The wind will play music!', 'show', { item: mid(chime), kind: 'swing' })
    ] };
  })();

  const chainreaction = (() => {
    const xs = Array.from({ length: 8 }, (_, i) => 66 + i * 14), cols = [C.red, C.yellow, C.blue, C.green], Y = 128;
    const up = (x, c) => ({ p: [[x - 3, Y - 22], [x + 3, Y - 22], [x + 3, Y], [x - 3, Y]], c });
    const dominos = xs.map((x, i) => up(x, cols[i % 4])), dSVG = dominos.map(d => K.poly(d.p, d.c, 1.3)).join('');
    const fallen = dominos.map((d, i) => ({ p: rot(d.p, xs[i] + 3, Y, i === 7 ? 90 : 60), c: d.c }));
    const ramp = K.poly([[14, 70], [20, 70], [62, 128], [50, 128]], C.card) + K.rect(8, 70, 14, 58, '#B98A55', 2), scene = ramp + dSVG;
    const roll = [[18, 64], [34, 86], [50, 108], [60, 122]];
    return { id: 'chainreaction', cat: 'build', name: 'Domino chain reaction', ico: '🧱', lv: 3, min: 30, mat: [['🁢', 'dominoes, blocks or books'], ['📏', 'a strip of cardboard for a ramp'], M.tape, M.marble], tip: 'Engineers test and fix! If the chain stops, look at the gap where it stopped and move that piece a little.', steps: [
      S('Stand dominoes in a long line, a finger apart.', 'stack', { pieces: dominos.map((d, i) => ({ svg: K.poly(d.p, d.c, 1.3), at: [xs[i], Y - 11], h: 50 })) }),
      S('Tape a cardboard ramp at the start.', 'place', { base: dSVG, pieces: [{ svg: ramp, at: [30, 100], from: [-40, -40] }] }),
      S('Check the gaps with your finger. Not too close, not too far!', 'measure', { base: scene, from: [66, 134], to: [164, 134], n: 7, nums: false }),
      S('Let a marble roll down the ramp…', 'draw', { base: scene, s: [roll], c: 'rgba(46,139,230,.35)', w: 2, tool: 'marble', guide: false }),
      S('Click, click, click! They all fall down.', 'morph', { base: ramp, from: dominos, to: fallen }),
      S('Set them up again. Can you make the line turn a corner?', 'show', { item: mid(ramp + fallen.map(d => K.poly(d.p, d.c, 1.3)).join('')), kind: 'bounce' })
    ] };
  })();

  const cupphone = (() => {
    const cupDown = (x, y) => K.poly([[x - 10, y - 16], [x + 10, y - 16], [x + 15, y + 16], [x - 15, y + 16]], '#fff') + K.ell(x, y - 16, 10, 3, '#E3EEF8', 1.2);
    const cupSide = (x, flip) => K.g(K.poly([[-16, -15], [16, -10], [16, 10], [-16, 15]], '#fff') + K.ell(-16, 0, 4, 15, '#E3EEF8', 1.2), x, 75, 1, flip ? 180 : 0);
    const both = cupDown(60, 70) + cupDown(140, 70), line = K.line([[44, 75], [156, 75]], OL, 1.4), phone = cupSide(28, false) + cupSide(172, true) + line;
    return { id: 'cupphone', cat: 'science', name: 'Cup string telephone', ico: '📞', lv: 3, min: 20, mat: [['🥤', '2 paper cups'], ['🧵', 'a long string (5 meters or more)'], ['✏️', 'a sharp pencil (a grown-up pokes the holes)'], ['📎', '2 paperclips']], tip: 'Science: your voice makes the cup bottom shake, the tight string carries the shake, and the other cup turns it back into sound. A slack string will not work!', steps: [
      S('A grown-up pokes a small hole in the bottom of each cup.', 'punch', { base: both, holes: [[60, 54], [140, 54]], r: 2.4 }),
      S('Push one end of the string through a hole, into the cup.', 'draw', { base: both, s: [[[60, 14], [60, 54], [60, 80]]], c: OL, w: 1.4, tool: 'finger' }),
      S('Tie it to a paperclip inside, so it cannot slip out.', 'knot', { at: [100, 70], c: OL }),
      S('Do the same with the other cup on the other end.', 'place', { base: cupSide(28, false) + line, pieces: [{ svg: cupSide(172, true), at: [172, 75], from: [20, -50] }] }),
      S('Walk apart until the string is tight and straight.', 'measure', { base: phone, from: [44, 92], to: [156, 92], n: 5, nums: false }),
      S('Talk into one cup. Your friend listens in the other!', 'music', { base: phone, mode: 'blow', at: [44, 70] }),
      S('Can you hear me? Try whispering a secret!', 'show', { item: mid(phone), kind: 'wiggle' })
    ] };
  })();

  const twigweave = (() => {
    const Y = K.line([[100, 140], [100, 92], [58, 22]], OL, 8) + K.line([[100, 92], [142, 22]], OL, 8) + K.line([[100, 140], [100, 92], [58, 22]], C.brown, 5.6) + K.line([[100, 92], [142, 22]], C.brown, 5.6);
    const zz = []; for (let t = 0.08; t <= 0.92; t += 0.07) { const L = [100 - 42 * t, 92 - 70 * t], Rr = [100 + 42 * t, 92 - 70 * t]; zz.push(...(zz.length / 2) % 2 ? [Rr, L] : [L, Rr]); }
    const strings = K.line(zz, C.purple, 1.6), leaves = K.leaf(92, 64, 10, C.orange, -20) + K.leaf(110, 48, 9, C.green, 25), more = K.emo('🪶', 104, 74, 20) + K.circ(90, 40, 5, C.pink, 1) + K.circ(118, 70, 4, C.yellow, 1);
    const full = Y + strings + leaves + more;
    return { id: 'twigweave', cat: 'nature', name: 'Y-stick nature weaving', ico: '🌿', lv: 3, min: 40, mat: [['🌿', 'a Y-shaped stick'], M.wool, ['🍂', 'leaves, feathers and flowers']], tip: 'Go on a hunt for the stick first. Each season gives different treasures to weave in.', steps: [
      S('Find a Y-shaped stick on a walk.', 'place', { pieces: [{ svg: Y, at: [100, 80], from: [0, -60], r: 20 }] }),
      S('Tie wool on low down, just above where the stick splits.', 'knot', { base: Y, at: [100, 88], c: C.purple }),
      S('Wrap the wool across, round one arm, back across, round the other.', 'draw', { base: Y, s: [zz], c: C.purple, w: 1.6, tool: 'yarn', guide: false }),
      S('Weave a leaf in: over one string, under the next.', 'place', { base: Y + strings, pieces: [{ svg: leaves, at: [100, 56], from: [-60, 0] }] }),
      S('Add feathers and flowers the same way.', 'place', { base: Y + strings + leaves, pieces: [{ svg: more, at: [104, 60], from: [60, 0] }] }),
      S('A nature weaving! Change it with every season.', 'show', { item: mid(full), kind: 'swing' })
    ] };
  })();

  /* ================= expert ================= */
  const bandcar = (() => {
    const body = K.rect(50, 58, 100, 38, C.card, 3) + K.rect(64, 64, 26, 16, '#BDE0F7', 2) + K.rect(108, 64, 26, 16, '#BDE0F7', 2);
    const straws = [64, 136].map(x => K.rect(x - 4, 94, 8, 8, '#fff', 2)).join(''), wheel = x => K.circ(x, 108, 13, C.red) + K.circ(x, 108, 4, '#fff', 1.2);
    const car = body + straws + wheel(64) + wheel(136), band = K.line([[136, 108], [100, 100], [64, 102]], C.purple, 2.2), ready = car + band;
    const caps = [40, 80, 120, 160].map(x => K.circ(x, 75, 14, C.red) + K.circ(x, 75, 9, 'none', 1)).join('');
    return { id: 'bandcar', cat: 'build', name: 'Rubber band car', ico: '🏎️', lv: 4, min: 60, mat: [['📦', 'a small cardboard box'], ['🥤', '4 bottle caps'], ['🥢', '2 wooden skewers'], ['🥤', '2 straws'], M.bands, M.tape, M.ruler, M.scissors], safe: 'A grown-up pokes the holes and snips off the sharp skewer tips. Keep rubber bands away from eyes.', tip: 'Science: winding the band stores energy; letting go turns it into movement. Try two bands, or bigger wheels: which goes further?', steps: [
      S('Mark where the wheels go, near each end of the box.', 'measure', { base: body, from: [50, 98], to: [150, 98], n: 5, nums: false }),
      S('Tape two straws across the bottom, at the marks.', 'place', { base: body, pieces: [64, 136].map(x => ({ svg: K.rect(x - 4, 94, 8, 8, '#fff', 2), at: [x, 98], from: [0, 40] })) }),
      S('A grown-up pokes a hole in the middle of each bottle cap.', 'punch', { base: caps, holes: [[40, 75], [80, 75], [120, 75], [160, 75]], r: 2.4 }),
      S('Push a skewer through each straw. Put a cap on each end.', 'place', { base: body + straws, pieces: [64, 136].map(x => ({ svg: wheel(x), at: [x, 108], from: [0, 40] })) }),
      S('Hook a rubber band round the back axle. Tape the other end to the front.', 'draw', { base: car, s: [[[136, 108], [100, 100], [64, 102]]], c: C.purple, w: 2.2, tool: 'finger' }),
      S('Roll the car backwards. The band winds round the axle.', 'wrap', { base: ready, box: [128, 100, 16, 16], n: 6, c: C.purple }),
      S('Let go! Zoom! The band spins the wheels.', 'show', { item: mid(ready), kind: 'drive' })
    ] };
  })();

  const papercircuit = (() => {
    const card = K.rect(28, 14, 144, 118, '#22305A', 4) + [[50, 30], [150, 36], [64, 100], [140, 120], [44, 70]].map(([x, y]) => K.circ(x, y, 1.6, '#fff', 0)).join('');
    const starP = closed(K.starPts(100, 54, 18)), star = K.line(starP, C.yellow, 2.4);
    const p1 = [[94, 60], [60, 60], [60, 116], [146, 116]], p2 = [[106, 60], [160, 60], [160, 96]];
    const tape = p => K.line(p, OL, 6.4) + K.line(p, '#D98B3A', 4.6), taped = card + star + tape(p1) + tape(p2);
    const led = K.line([[96, 60], [96, 52]], '#8A96A3', 1.6) + K.line([[104, 60], [104, 52]], '#8A96A3', 1.6) + K.path('M94,52 L94,46 A6,6 0 0 1 106,46 L106,52Z', '#FFF8E0'), cell = K.circ(148, 112, 10, '#C9D3DC') + K.circ(148, 112, 6, '#E3E8EE', 1);
    const flap = K.poly([[172, 92], [172, 132], [132, 132]], '#E8ECF2', 1.4) + K.line([[166, 104], [166, 124], [146, 124]], '#D98B3A', 3.4);
    const built = taped + led + cell, on = { a: 'light', led: [100, 48], press: [158, 116], flap };
    return { id: 'papercircuit', cat: 'science', name: 'Light-up paper circuit card', ico: '💡', lv: 4, min: 45, mat: [M.card, ['🟫', 'copper tape (with sticky back)'], ['🔋', 'a 3 volt coin battery (CR2032)'], ['💡', 'a small LED light'], M.tape, M.crayons], safe: 'Coin batteries are very dangerous if swallowed. A grown-up keeps them, fits them, and puts them away straight after. Never use a plug socket.', tip: 'The LED\'s long leg is +: it must touch the tape that goes to the top (+) of the battery. If it stays dark, turn the LED round.', steps: [
      S('Draw a night picture with a big star in the sky.', 'draw', { base: card, s: [starP], c: C.yellow, w: 2.4 }),
      S('Stick copper tape from the star down to the corner.', 'light', { base: card + star, mode: 'tape', path: p1 }),
      S('Stick a second tape from the star to the other side.', 'light', { base: card + star + tape(p1), mode: 'tape', path: p2 }),
      S('Bend the LED legs flat. Tape one leg on each copper tape.', 'place', { base: taped, pieces: [{ svg: led, at: [100, 54], from: [0, -50] }] }),
      S('A grown-up puts the coin battery on the corner tape.', 'place', { base: taped + led, pieces: [{ svg: cell, at: [148, 112], from: [40, -60] }] }),
      S('Fold the corner over the battery and press. It lights up!', 'light', { base: built, ...on }),
      S('Electricity goes round in a loop. That is a circuit!', 'show', { item: mid(built + flap + K.circ(100, 48, 16, 'rgba(255,226,80,.55)', 0) + K.circ(100, 48, 5, '#FFF8C0', 1.2)), kind: 'glow' })
    ] };
  })();

  const tiltmaze = (() => {
    const lid = K.rect(30, 15, 140, 115, C.card, 4) + K.rect(38, 23, 124, 99, '#F3DDB8', 2);
    const path = [[48, 32], [48, 108], [75, 108], [75, 38], [105, 38], [105, 108], [135, 108], [135, 40], [152, 40]];
    const walls = [[[61, 23], [61, 95]], [[90, 50], [90, 122]], [[120, 23], [120, 95]], [[145, 54], [145, 122]]];
    const wallSVG = w => K.line(w, OL, 5.6) + K.line(w, '#FFFFFF', 3.6), maze = lid + walls.map(wallSVG).join('');
    const flags = K.emo('🟢', 48, 30, 10) + K.emo('🏁', 156, 36, 14), trap = K.circ(105, 72, 5.5, '#3A3F4A', 1.2), game = maze + trap + flags;
    return { id: 'tiltmaze', cat: 'build', name: 'Tilt marble maze', ico: '🧩', lv: 4, min: 60, mat: [['📦', 'a shoebox lid'], ['🟨', 'card strips'], M.ruler, M.pencil, M.scissors, M.pva, M.marble, M.pens], tip: 'Plan on paper first. Leave gaps a bit wider than the marble, then make it harder with dead ends and trap holes.', steps: [
      S('Draw a twisty path in a box lid, from start to finish.', 'draw', { base: lid, s: [path], c: C.blue, w: 2, dash: '4 4', tool: 'pen' }),
      S('Measure and cut card strips for the walls.', 'measure', { base: K.rect(30, 60, 140, 24, '#fff', 2), from: [30, 60], to: [170, 60], n: 7, nums: false }),
      S('Squeeze glue lines between the paths.', 'draw', { base: lid, s: walls, tool: 'glue', w: 3 }),
      S('Stand the walls up on the glue. Hold them till they stick.', 'rise', { base: lid, pieces: walls.map(w => ({ svg: wallSVG(w), at: [w[0][0], Math.max(w[0][1], w[1][1])], h: 72 })) }),
      S('Cut a trap hole in the path. Fall in? Start again!', 'cut', { base: maze, pts: circlePts(105, 72, 5.5, 12) }),
      S('Put in a marble. Tilt the lid to roll it to the finish!', 'draw', { base: game, s: [path], c: 'rgba(46,139,230,.3)', w: 2, tool: 'marble', guide: false }),
      S('You built a maze game! Time how fast you can do it.', 'show', { item: mid(game), kind: 'wiggle' })
    ] };
  })();

  const grabber = (() => {
    const sp = (a, b, w = 4) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L * w, ny = dx / L * w; return [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]]; };
    const tongs = (x0, dx, yt, yb, n = 3) => { const out = []; for (let i = 0; i < n; i++) { const xa = x0 + i * dx, xb = xa + dx; out.push({ p: sp([xa, yt], [xb, yb]), c: C.tan }, { p: sp([xa, yb], [xb, yt]), c: '#D9B98A' }); }
      const xe = x0 + n * dx; out.push({ p: [[xe, yt], [xe + 18, yt - 8], [xe + 22, yt + 8], [xe + 4, yt + 5]], c: C.red }, { p: [[xe, yb], [xe + 18, yb + 8], [xe + 22, yb - 8], [xe + 4, yb - 5]], c: C.red }); return out; };
    const shut = tongs(60, 16, 46, 104), open = tongs(26, 40, 66, 84), svgOf = L => L.map(l => K.poly(l.p, l.c, 1.3)).join('');
    const one = K.poly(sp([40, 80], [160, 80], 5), C.tan, 1.3), two = K.poly(sp([60, 52], [140, 98], 5), '#D9B98A', 1.3) + K.circ(100, 75, 3, C.yellow, 1);
    return { id: 'grabber', cat: 'build', name: 'Craft stick grabber arm', ico: '🦾', lv: 4, min: 60, mat: [['🪵', '6 long craft sticks'], M.fasteners, ['🕳️', 'a drill or a sharp tool (a grown-up makes the holes)'], M.ruler, M.pencil, ['🟥', 'card for the claws'], M.pva], tip: 'Real lazy tongs! Do not push the split pins too tight, or the arm will not slide. Add more X shapes for a longer reach.', steps: [
      S('Mark both ends and the middle of each stick.', 'measure', { base: one, from: [44, 80], to: [156, 80], n: 2, nums: false }),
      S('A grown-up makes a small hole at every mark.', 'punch', { base: one, holes: [[44, 80], [100, 80], [156, 80]], r: 2.6 }),
      S('Cross two sticks in an X. Push a split pin through the middle holes.', 'place', { base: K.poly(sp([60, 98], [140, 52], 5), C.tan, 1.3), pieces: [{ svg: two, at: [100, 75], from: [0, -50], r: 40 }] }),
      S('Join more X shapes at the ends with split pins. A zigzag!', 'place', { pieces: [0, 2, 4].map(i => ({ svg: svgOf(shut.slice(i, i + 2)), at: [68 + i * 8, 75], from: [-40, -40] })) }),
      S('Glue card claws on the two front ends.', 'place', { base: svgOf(shut.slice(0, 6)), pieces: [{ svg: svgOf(shut.slice(6)), at: [118, 75], from: [40, 0] }] }),
      S('Push the handles together. The arm shoots out and grabs!', 'morph', { from: shut, to: open }),
      S('Grab a sock or a teddy from across the room!', 'show', { item: mid(svgOf(open)), kind: 'wiggle' })
    ] };
  })();

  const spoolknit = (() => {
    const xs = [76, 92, 108, 124], c = C.blue, tube = K.tube(100, 70, 76, 52, C.card), spool = spoolSVG(xs);
    const rope = K.path('M-60,-20 C-40,30 0,-40 20,10 S60,20 70,-10', 'none', 0, `stroke="${OL}" stroke-width="11" stroke-linecap="round"`) + K.path('M-60,-20 C-40,30 0,-40 20,10 S60,20 70,-10', 'none', 0, `stroke="${c}" stroke-width="8.4" stroke-linecap="round" stroke-dasharray="5 2"`);
    return { id: 'spoolknit', cat: 'string', name: 'Spool knitting', ico: '🧶', lv: 4, min: 60, mat: [M.roll, ['🪵', '4 craft sticks'], M.tape, ['🧶', 'smooth wool'], ['🪡', 'a blunt plastic needle or a crochet hook']], tip: 'Also called French knitting or a knitting dolly. Tug the tail gently every few rounds so the stitches drop down the tube.', steps: [
      S('Tape four craft sticks round a toilet roll tube, sticking up at the top.', 'place', { base: tube, pieces: xs.map(x => ({ svg: K.rect(x - 3, 34, 6, 46, C.tan, 2), at: [x, 56], from: [0, -50] })) }),
      S('Drop the wool end down through the tube.', 'draw', { base: spool, s: [[[100, 24], [100, 70], [100, 142]]], c, w: 3, tool: 'yarn', guide: false }),
      S('Wrap the wool once round each stick, going round in a circle.', 'knit', { spool: true, mode: 'wrap', rows: 0, c }),
      S('Go round again, so each stick has two loops.', 'knit', { spool: true, mode: 'wrap', rows: 1, c }),
      S('Lift each bottom loop over the top loop and off the stick.', 'knit', { spool: true, mode: 'lift', c }),
      S('Wrap and lift, wrap and lift. Gently pull the tail below.', 'knit', { spool: true, mode: 'lift', c, pre: 6 }),
      S('Cut the wool. Thread the end through all four loops and pull tight.', 'knot', { at: [100, 70], c }),
      S('A long knitted rope! Coil it into a mat, or make a necklace.', 'show', { item: rope, kind: 'wiggle' })
    ] };
  })();

  const feltpouch = (() => {
    const feltBig = K.rect(40, 6, 120, 138, '#B9A8F0', 3), strip = [[70, 10], [130, 10], [130, 140], [70, 140]];
    const B = K.ori(C.purple, '#8A70E0', strip);
    const s3 = B.fold('Fold the bottom up, two thirds of the way.', { from: [100, 140], to: [100, 54] });
    const p1 = B.svg(), sl = { a: 'stitch', base: p1, pts: [[74, 57], [74, 94]], c: C.yellow }, sr = { a: 'stitch', base: done(sl), pts: [[126, 57], [126, 94]], c: C.yellow };
    const sewnSides = K.line([[74, 57], [74, 94]], C.yellow, 2.6, '7 5') + K.line([[126, 57], [126, 94]], C.yellow, 2.6, '7 5');
    const s6 = B.fold('Fold the top flap down over the pocket.', { from: [100, 10], to: [100, 70] });
    const closedP = B.svg() + sewnSides, slit = [[94, 64], [106, 64]], btn = K.circ(100, 78, 7, C.yellow, 1.3) + [[-2.4, -2.4], [2.4, 2.4], [2.4, -2.4], [-2.4, 2.4]].map(([a, b]) => K.circ(100 + a, 78 + b, 1, OL, 0)).join('');
    const withSlit = closedP + K.line(slit, OL, 1.8), full = withSlit + btn;
    return { id: 'feltpouch', cat: 'sew', name: 'Felt pouch with a button', ico: '👛', lv: 4, min: 60, mat: [M.felt, M.ruler, ['🖍️', 'chalk'], M.scissors, M.needle, M.thread, ['🔘', 'a big button']], tip: 'Felt does not fray, so no hemming. Make the slit a tiny bit smaller than the button and it will stay shut.', steps: [
      S('Measure a felt strip, a ruler long and a hand wide.', 'measure', { base: feltBig, from: [70, 12], to: [70, 138], n: 6, nums: false }),
      S('Cut out the strip.', 'cut', { base: feltBig + K.line(closed(strip), '#fff', 1.6), pts: closed(strip) }),
      s3,
      S('Sew up the left side with small stitches.', 'stitch', sl),
      S('Now sew up the right side. Tie a knot.', 'stitch', sr),
      s6,
      S('Cut a slit in the flap. Sew the button on just under it, up and down six times.', 'stitch', { base: withSlit + K.circ(100, 78, 7, C.yellow, 1.3), pts: [[97.6, 75.6], [102.4, 80.4], [102.4, 75.6], [97.6, 80.4], [97.6, 75.6], [102.4, 80.4]], c: OL }),
      S('Button it shut! A pouch for your treasures.', 'show', { item: mid(full), kind: 'bounce' })
    ] };
  })();

  const feltfish = (() => {
    const body = K.arc(92, 75, 48, 30, 25, 335, 26), fish = body.concat([[170, 48], [164, 75], [170, 102]]), fc = closed(fish);
    const paperS = sheet(), feltS = K.rect(24, 22, 160, 108, '#8EC5F5', 3), shape = K.poly(fish, C.blue);
    const inset = scale(body, 92, 75, 0.86), st1 = { a: 'stitch', base: shape, pts: inset, c: C.yellow }, s1 = done(st1);
    const tailIn = [inset[inset.length - 1], [158, 58], [154, 75], [158, 92], inset[0]], st2 = { a: 'stitch', base: s1 + cotton(110, 76), pts: tailIn, c: C.yellow };
    const sewn = done(st2), deco = K.circ(64, 68, 6, '#fff', 1.2) + K.circ(64, 68, 3, OL, 0) + [84, 100, 116].map(x => K.path(`M${x},50 Q${x + 8},75 ${x},100`, 'none', 0, `stroke="${C.orange}" stroke-width="4"`)).join('');
    return { id: 'feltfish', cat: 'sew', name: 'Felt fish cushion', ico: '🐠', lv: 4, min: 75, mat: [M.paper, M.pencil, ['🟦', '2 pieces of felt'], ['📌', 'pins (a grown-up helps)'], M.scissors, M.needle, M.thread, M.stuffing, ['🔘', 'a button']], tip: 'Over-and-over stitch (whip stitch) holds the edges well and is easy to learn. Stuff it softly so the stitches do not pull.', steps: [
      S('Draw a fish on paper. Cut it out for a pattern.', 'draw', { base: paperS, s: [fc], c: OL, w: 1.8, tool: 'pen' }),
      S('Pin the pattern on two layers of felt. Cut round it.', 'cut', { base: feltS + K.line(fc, OL, 1.4), pts: fc }),
      S('Sew round the edge with over-and-over stitches. Leave the tail open.', 'stitch', st1),
      S('Push in stuffing through the gap. Not too much!', 'place', { base: s1, pieces: [{ svg: cotton(110, 76), at: [110, 76], from: [70, 0] }] }),
      S('Sew round the tail. Tie a knot and hide it inside.', 'stitch', st2),
      S('Sew on a button eye. Glue on felt stripes.', 'place', { base: sewn, pieces: [{ svg: deco, at: [90, 75], from: [0, -60] }] }),
      S('A soft fish to cuddle! Make a whole aquarium.', 'show', { item: mid(sewn + deco), kind: 'float' })
    ] };
  })();

  const pinata = (() => {
    const cx = 100, cy = 74, rx = 42, ry = 50, balloon = K.ell(cx, cy, rx, ry, C.yellow) + K.ell(cx - 15, cy - 20, 6, 11, 'rgba(255,255,255,.5)', 0);
    const L1 = bands(cx, cy, rx, ry, 6, 0, undefined, 0.1, 1), L2 = bands(cx, cy, rx, ry, 5, 1, ['#F4ECDA', '#E9E0CC']);
    const shell = K.ell(cx, cy, rx, ry, '#EFE6D2') + K.ell(cx, cy - ry + 6, 11, 4, '#7A6A55', 1.2), clipE = `M${cx - rx},${cy} A${rx},${ry} 0 1 0 ${cx + rx},${cy} A${rx},${ry} 0 1 0 ${cx - rx},${cy}Z`;
    const fringeCols = [C.pink, C.orange, C.yellow, C.green, C.blue, C.purple], fr = bands(cx, cy, rx + 3, ry + 3, 6, 0, fringeCols).reverse();
    const fringed = done({ a: 'layer', strips: fr }) + fr.map(b => { const ys = b.p.map(p => p[1]), y = Math.max(...ys), xs = b.p.map(p => p[0]), x0 = Math.min(...xs), x1 = Math.max(...xs); return K.line(K.zig(x0 + 3, x1 - 3, y, 4, Math.max(2, Math.round((x1 - x0) / 8))), OL, 1); }).join('');
    const hang = K.line([[cx, 0], [cx, cy - ry]], OL, 1.4);
    return { id: 'pinata', cat: 'world', name: 'Papier-mâché piñata', ico: '🪅', lv: 4, min: 120, mat: [M.balloon, M.news, M.pastem, M.tissue, M.scissors, M.pva, ['🍬', 'little treats or confetti'], M.string], safe: 'Everyone stands well back while one person swings, using a soft stick. No blindfolds for little ones.', tip: 'Piñatas are a party favorite in Mexico. It takes a few days: two days of drying for the shell, then decorating. Three layers is strong enough to break!', steps: [
      S('Blow up a big balloon and tie it.', 'inflate', { at: [cx, 70], r: 50, c: C.yellow }),
      paste('Stir flour and water into a runny paste.'),
      S('Cover the balloon with pasted newspaper strips. Leave a hole at the top.', 'layer', { base: balloon, strips: L1 }),
      S('Add two more layers. Let it dry for two days.', 'layer', { base: balloon + done({ a: 'layer', strips: L1 }), strips: L2 }),
      S('A grown-up pops the balloon and pulls it out of the hole.', 'cut', { base: K.ell(cx, cy, rx, ry, '#EFE6D2'), pts: circlePts(cx, cy - ry + 6, 11, 14) }),
      S('Fill it with little treats through the hole.', 'pour', { base: shell, box: [cx - rx, cy - 20, rx * 2, ry + 20], grain: true, colors: [C.red, C.blue, C.green, C.pink], lv1: 0.55, gr: 3, clip: clipE, cup: [cx + 10, cy - ry - 14] }),
      S('Snip tissue strips into fringes. Glue them round and round, from the bottom up.', 'layer', { base: shell, strips: fr }),
      S('Hang it up. Take turns to hit it, then share the treats!', 'show', { item: mid(hang + shell + fringed), kind: 'swing' })
    ] };
  })();

  const foilclay = (() => {
    const FOIL = '#DDE3EA', CLY = '#E8DCCB';
    const sheetP = [[40, 40], [160, 40], [160, 110], [40, 110]];
    const fox = [[44, 70], [52, 60], [118, 58], [128, 44], [134, 30], [140, 42], [146, 30], [150, 46], [168, 58], [150, 68], [140, 74], [138, 104], [130, 104], [128, 82], [82, 82], [80, 104], [72, 104], [70, 82], [56, 80], [30, 92], [24, 84]];
    const foilSVG = K.poly(fox, '#C9D3DC'), clayA = K.poly(fox, CLY);
    const fur = [[[60, 66], [66, 72]], [[76, 64], [82, 70]], [[92, 64], [98, 70]], [[108, 64], [114, 70]], [[34, 86], [40, 90]]];
    const painted = K.poly(fox, C.orange) + K.poly([[118, 64], [150, 62], [140, 74], [124, 76]], '#fff', 1) + K.poly([[24, 84], [30, 92], [38, 86]], '#fff', 1) + K.circ(146, 50, 2.2, OL, 0) + K.circ(167, 58, 2.4, OL, 0) + fur.map(f => K.line(f, '#B85A1E', 1.4)).join('');
    return { id: 'foilclay', cat: 'clay', name: 'Clay fox on a foil skeleton', ico: '🦊', lv: 4, min: 90, mat: [['🥫', 'kitchen foil'], M.clay, ['💧', 'a little water'], ['🍴', 'a fork'], M.paint, M.brush], tip: 'Sculptors call the foil inside an armature. It saves clay and stops legs from drooping. Any animal works: try a cat or a horse.', steps: [
      S('Scrunch foil into a body, a head, a tail and legs. Squeeze it hard!', 'morph', { from: [{ p: sheetP, c: FOIL }], to: [{ p: fox, c: '#C9D3DC' }] }),
      S('Flatten clay into thin pancakes.', 'clay', { mode: 'flat', at: [100, 92], r: 26, c: CLY }),
      S('Wrap the clay over the foil. Smooth the joins with a wet finger.', 'paint', { base: foilSVG, area: clayA, box: [20, 26, 152, 82], c: CLY, tool: 'finger' }),
      S('Pinch out a pointy nose and two ears.', 'clay', { mode: 'squeeze', at: [96, 80], r: 26, c: CLY }),
      S('Scratch fur lines with a fork.', 'draw', { base: clayA, s: fur, c: '#9C8466', w: 1.4, tool: 'pen' }),
      S('Let it dry for two days. Paint your fox.', 'paint', { base: clayA + fur.map(f => K.line(f, '#9C8466', 1.4)).join(''), area: painted, box: [20, 26, 152, 82], c: C.orange }),
      S('A clay fox that stands up on its own!', 'show', { item: mid(painted), kind: 'bounce' })
    ] };
  })();

  const dragonpuppet = (() => {
    const red = [[30, 70], [170, 70], [170, 82], [30, 82]], yel = [[30, 70], [42, 70], [42, 140], [30, 140]];
    const body = Array.from({ length: 11 }, (_, i) => { const x = 50 + i * 10, y = 76 + 9 * Math.sin(i / 10 * Math.PI * 2); return { p: [[x - 6, y - 8], [x + 6, y - 8], [x + 6, y + 8], [x - 6, y + 8]], c: i % 2 ? C.yellow : C.red }; });
    const bodySVG = body.map(b => K.poly(b.p, b.c, 1.2)).join('');
    const headP = [[20, 60], [44, 50], [52, 62], [52, 92], [30, 94], [16, 84], [8, 74]], headC = closed(headP);
    const head = K.poly(headP, C.red) + K.eye(34, 66, 5) + K.line([[10, 80], [24, 82]], OL, 1.6) + K.poly([[44, 50], [40, 38], [50, 46]], C.yellow, 1.2);
    const tail = K.poly([[152, 70], [178, 58], [170, 76], [182, 92], [152, 84]], C.red), sticks = K.line([[34, 92], [34, 140]], C.brown, 4) + K.line([[160, 84], [160, 140]], C.brown, 4);
    const flames = K.poly([[8, 74], [-6, 66], [0, 74], [-8, 82]], C.orange, 1) + K.line([[12, 82], [2, 96]], C.yellow, 2) + K.line([[16, 84], [10, 100]], C.yellow, 2);
    const full = sticks + bodySVG + head + tail + flames;
    return { id: 'dragonpuppet', cat: 'world', name: 'Dancing dragon puppet', ico: '🐉', lv: 4, min: 60, mat: [['🟥', 'long red and yellow paper strips'], M.card, M.pens, M.scissors, M.glue, M.tape, ['🪵', '2 sticks or straws'], M.tissue], tip: 'Dragon dances bring luck at Lunar New Year. The folded spring body is a "witch\'s ladder": keep the strips at right angles and fold tight.', steps: [
      S('Glue a red strip and a yellow strip together in an L.', 'place', { base: K.poly(red, C.red), pieces: [{ svg: K.poly(yel, C.yellow), at: [36, 105], from: [0, 40] }] }),
      S('Fold them over each other again and again. A springy body!', 'morph', { from: [{ p: red, c: C.red }, { p: yel, c: C.yellow }], to: body }),
      S('Draw a dragon head with big eyes on card. Cut it out.', 'cut', { base: K.rect(2, 36, 64, 66, '#fff', 2) + K.line(headC, OL, 1.6), pts: headC }),
      S('Glue the head on one end and a tail on the other.', 'place', { base: bodySVG, pieces: [{ svg: head, at: [30, 72], from: [-50, -30] }, { svg: tail, at: [164, 76], from: [40, -30] }] }),
      S('Tape a stick under the head and one under the tail.', 'place', { base: bodySVG + head + tail, pieces: [{ svg: K.line([[34, 92], [34, 140]], C.brown, 4), at: [34, 116], from: [0, 40] }, { svg: K.line([[160, 84], [160, 140]], C.brown, 4), at: [160, 112], from: [0, 40] }] }),
      S('Glue on tissue flames and whiskers.', 'place', { base: sticks + bodySVG + head + tail, pieces: [{ svg: flames, at: [6, 80], from: [-30, 0] }] }),
      S('Make it dance! Happy Lunar New Year!', 'show', { item: mid(full), kind: 'wiggle' })
    ] };
  })();

  const parol = (() => {
    const o = K.starPts(100, 72, 54, 5, 0.42).filter((_, i) => i % 2 === 0), gram = [o[0], o[2], o[4], o[1], o[3], o[0]];
    const sticksSVG = (dx = 0, dy = 0) => K.line(gram.map(([x, y]) => [x + dx, y + dy]), OL, 4.4) + K.line(gram.map(([x, y]) => [x + dx, y + dy]), C.brown, 2.6);
    const frame = sticksSVG(), frame2 = sticksSVG(5, 5) + frame, starP = K.starPts(100, 72, 54, 5, 0.42);
    const filled = K.poly(starP, C.red) + K.poly(K.starPts(100, 72, 30, 5, 0.42), C.yellow, 1.2) + frame;
    const tails = K.path('M73,116 Q64,130 72,146', 'none', 0, `stroke="${C.yellow}" stroke-width="4"`) + K.path('M127,116 Q136,130 128,146', 'none', 0, `stroke="${C.yellow}" stroke-width="4"`);
    const full = filled + tails;
    return { id: 'parol', cat: 'world', name: 'Parol star lantern', ico: '🌟', lv: 4, min: 90, mat: [['🪵', '10 thin sticks or paper straws'], M.string, M.pva, M.tissue, M.scissors], safe: 'If you use bamboo skewers, a grown-up snips off the sharp tips first.', tip: 'In the Philippines, glowing parol stars hang in every window at Christmas. They stand for the star that guided the wise men.', steps: [
      S('Lay five sticks in a star shape, crossing at the points.', 'draw', { s: [gram], c: C.brown, w: 3, tool: 'finger' }),
      S('Tie every corner tight with string. Make two stars.', 'knot', { base: frame, at: [o[0][0], o[0][1] + 20], c: OL }),
      S('Join the two stars with short sticks in the middle.', 'place', { base: frame, pieces: [{ svg: sticksSVG(5, 5), at: [105, 77], from: [40, 40] }] }),
      S('Spread glue along all the sticks.', 'glue', { base: frame2, dots: starP }),
      S('Cover it with colored tissue paper. Trim the edges.', 'paint', { base: frame2, area: filled, box: [46, 16, 108, 104], c: C.red }),
      S('Cut two long tissue tails. Glue them to the bottom points.', 'place', { base: filled, pieces: [{ svg: tails, at: [100, 130], from: [0, 40] }] }),
      S('Hang it in a window with a light behind. Merry Christmas from the Philippines!', 'show', { item: mid(full), kind: 'swing' })
    ] };
  })();

  const heartbasket = (() => {
    const B = K.ori(C.red, '#D94A3B', [[40, 30], [160, 30], [160, 100], [40, 100]]);
    const s1 = B.fold('Fold a red paper and a white paper in half.', { from: [40, 65], to: [160, 65] });
    const u = [[100, 30], [146, 30], ...K.arc(146, 65, 12, 35, -90, 90, 12), [100, 100]], l1 = [[100, 53], [140, 53]], l2 = [[100, 77], [140, 77]];
    const W = { a: 'weave', mat: [50, 35, 100, 80], bands: 3, rows: 3, c: C.red, sc: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'] }, woven = done({ ...W, row: 2 });
    const sq = [[70, 40], [130, 40], [130, 100], [70, 100]], hb = heartPts(100, 70, 34, 40).slice(0, -1), heart = rot(hb, 100, 70, 0);
    const handle = K.path('M76,44 Q100,0 124,44', 'none', 0, `stroke="${OL}" stroke-width="6"`) + K.path('M76,44 Q100,0 124,44', 'none', 0, `stroke="#FFFFFF" stroke-width="4"`);
    const check = K.line([[84, 50], [116, 90]], '#fff', 6) + K.line([[116, 50], [84, 90]], '#fff', 6), basket = K.poly(heart, C.red) + check;
    return { id: 'heartbasket', cat: 'world', name: 'Woven paper heart basket', ico: '💝', lv: 4, min: 45, mat: [['🟥', 'red paper'], ['⬜', 'white paper'], M.ruler, M.pencil, M.scissors, M.glue], tip: 'Danish children have woven these for Christmas trees since the 1800s; Hans Christian Andersen made one. The strips go THROUGH one loop, then AROUND the next.', steps: [
      s1,
      S('Draw a long U shape. Draw two lines up from the fold.', 'draw', { base: B.svg(), s: [u, l1, l2], c: OL, w: 1.6, tool: 'pen' }),
      S('Cut round the U. Then cut along the two lines.', 'cut', { base: B.svg() + K.line(u, OL, 1.4), cuts: [u, l1, l2] }),
      S('Weave the strips: through one loop, then around the next.', 'weave', { ...W, row: 0 }),
      S('Keep weaving, strip by strip, until it is full.', 'weave', { ...W, row: 2 }),
      S('Open it gently. It is a heart basket!', 'morph', { from: [{ p: sq, c: C.red }], to: [{ p: heart, c: C.red }], topEnd: check }),
      S('Glue a paper strip on top for a handle.', 'place', { base: basket, pieces: [{ svg: handle, at: [100, 26], from: [0, -40] }] }),
      S('Fill it with sweets and hang it on a tree, like in Denmark!', 'show', { item: mid(basket + handle), kind: 'swing' })
    ] };
  })();

  const waterbomb = (() => {
    const B = K.ori('#FFE3EC', C.pink, [[45, 20], [155, 20], [155, 130], [45, 130]]);
    const s1 = S('Fold in half both ways, then corner to corner both ways. Open it.', 'draw', { base: B.svg(), s: [[[45, 75], [155, 75]], [[100, 20], [100, 130]], [[45, 20], [155, 130]], [[155, 20], [45, 130]]], c: C.purple, dash: '5 4', tool: 'finger' });
    const tri = { p: [[45, 103], [155, 103], [100, 48]], f: 0 };
    const s2 = B.morph('Push the sides in. It folds down into a triangle.', [tri]);
    const s3 = B.morph('Fold the bottom corners of the front flaps up to the top point.', [tri, { p: [[72.5, 75.5], [100, 103], [100, 48]], f: 1 }, { p: [[127.5, 75.5], [100, 103], [100, 48]], f: 1 }]);
    const s4 = B.morph('Fold the side points in to the middle line.', [tri, { p: [[86, 62], [100, 48], [100, 103], [86, 89]], f: 1 }, { p: [[114, 62], [100, 48], [100, 103], [114, 89]], f: 1 }]);
    const s5 = B.morph('Fold the top flaps down and tuck them into the little pockets.', [tri, { p: [[86, 62], [100, 62], [100, 103], [86, 89]], f: 1 }, { p: [[114, 62], [100, 62], [100, 103], [114, 89]], f: 1 }]);
    const s6 = B.flip('Turn it over and do the same on the back.');
    const flatD = [[100, 48], [128, 75], [100, 103], [72, 75]], cube = [[100, 40], [136, 56], [136, 96], [100, 112], [64, 96], [64, 56]];
    const edges = K.line([[64, 56], [100, 72], [136, 56]], OL, 1.4) + K.line([[100, 72], [100, 112]], OL, 1.4), ball = K.poly(cube, '#FFE3EC') + K.poly([[100, 72], [136, 56], [136, 96], [100, 112]], C.pink, 1.4) + edges;
    return { id: 'waterbomb', cat: 'fold', name: 'Origami water bomb balloon', ico: '🎈', lv: 4, min: 25, mat: [['🟥', 'thin square paper (15 cm or bigger)']], tip: 'The tuck into the pockets is the tricky part: open the pocket with a fingernail first. Fill it with water outside for a real water bomb!', steps: [
      s1, s2, s3, s4, s5, s6,
      S('Blow hard into the hole at the bottom. It puffs up!', 'morph', { from: [{ p: flatD, c: '#FFE3EC' }], to: [{ p: cube, c: '#FFE3EC' }], topEnd: K.poly([[100, 72], [136, 56], [136, 96], [100, 112]], C.pink, 1.4) + edges }),
      S('A paper balloon! Toss it and catch it.', 'show', { item: mid(ball), kind: 'hop' })
    ] };
  })();

  const flapbird = (() => {
    const B = K.ori('#E9F7EF', C.green, [[100, 15], [160, 75], [100, 135], [40, 75]]);
    const st = [
      B.fold('Fold the bottom corner up to the top.', { from: [100, 135], to: [100, 15] }),
      B.fold('Fold it in half again, left to right.', { from: [40, 75], to: [160, 75] }),
      B.morph('Open the top flap and squash it into a square. Turn over and do the same.', [{ p: [[100, 15], [140, 55], [100, 95], [60, 55]], f: 1 }, { p: [[100, 15], [140, 55], [100, 95], [60, 55]], f: 1 }]),
      B.fold('Fold the lower edges in to the middle line. A kite!', { from: [60, 55], to: [100, 38.4], top: true }, { from: [140, 55], to: [100, 38.4], top: true }),
      B.morph('Lift the bottom point up and flatten it. Do the back too.', [{ p: [[100, 8], [116, 70], [100, 140], [84, 70]], f: 1 }]),
      B.morph('Fold the two thin points out: one for the neck, one for the tail.', [{ p: [[100, 50], [140, 30], [116, 70], [100, 100], [84, 70], [60, 30]], f: 1 }, { p: [[84, 70], [52, 54], [58, 48], [92, 66]], f: 0 }, { p: [[116, 70], [150, 50], [146, 44], [108, 66]], f: 0 }]),
      B.morph('Fold the tip of the neck down for a head. Bend the wings down.', [{ p: [[100, 56], [150, 74], [116, 76], [100, 100], [84, 76], [50, 74]], f: 1 }, { p: [[84, 70], [52, 54], [58, 48], [92, 66]], f: 0 }, { p: [[116, 70], [150, 50], [146, 44], [108, 66]], f: 0 }, { p: [[52, 54], [44, 64], [58, 48]], f: 1 }])
    ];
    return { id: 'flapbird', cat: 'fold', name: 'Origami flapping bird', ico: '🐦', lv: 4, min: 30, mat: [['🟩', 'thin square paper (15 cm)']], tip: 'It starts like the crane. Hold the bottom of the neck and gently pull the tail: the wings flap!', steps: [
      ...st, S('Hold the neck and pull the tail. The wings flap!', 'show', { item: mid(B.svg()), kind: 'fly' })
    ] };
  })();

  const masubox = (() => {
    const B = K.ori('#DCEBFF', C.blue, [[45, 20], [155, 20], [155, 130], [45, 130]]);
    const s1 = S('Fold corner to corner both ways. Open it to find the middle.', 'draw', { base: B.svg(), s: [[[45, 20], [155, 130]], [[155, 20], [45, 130]]], c: C.purple, dash: '5 4', tool: 'finger' });
    const s2 = B.fold('Fold all four corners in to the middle point.', { from: [45, 20], to: [100, 75] }, { from: [155, 20], to: [100, 75] }, { from: [155, 130], to: [100, 75] }, { from: [45, 130], to: [100, 75] });
    const s3 = B.turn('Turn it so it looks like a square.', 45);
    const s4 = B.fold('Fold the top and bottom edges to the middle line.', { from: [100, 36.1], to: [100, 75] }, { from: [100, 113.9], to: [100, 75] });
    const s5 = B.morph('Open them. Fold the sides to the middle, then open those too.', [{ p: [[61, 36], [139, 36], [139, 114], [61, 114]], f: 1 }, { p: [[80, 36], [120, 36], [120, 114], [80, 114]], f: 0 }]);
    const floor = K.poly([[66, 96], [134, 96], [150, 80], [82, 80]], '#C9DDF5'), wallF = K.poly([[66, 96], [134, 96], [134, 120], [66, 120]], C.blue), wallR = K.poly([[134, 96], [150, 80], [150, 104], [134, 120]], '#2470BC');
    const wallB = K.poly([[82, 80], [150, 80], [150, 60], [82, 60]], '#9DC4F2'), wallL = K.poly([[66, 96], [82, 80], [82, 60], [66, 76]], '#7FB0E8'), boxSVG = wallB + wallL + floor + wallF + wallR;
    return { id: 'masubox', cat: 'fold', name: 'Origami masu box', ico: '📦', lv: 4, min: 30, mat: [['🟦', 'square paper (15 cm or bigger)']], tip: 'Masu boxes were once used in Japan to measure rice. Fold a second one from paper 1 cm bigger to make a lid.', steps: [
      s1, s2, s3, s4, s5,
      S('Lift up the two long walls, then push in the ends to make the short walls.', 'rise', { base: floor, pieces: [{ svg: wallB, at: [116, 80], h: 20 }, { svg: wallL, at: [74, 88], h: 20 }, { svg: wallF, at: [100, 96], h: 24 }, { svg: wallR, at: [142, 100], h: 24 }] }),
      S('Fold the last flaps over the walls and tuck them inside.', 'place', { base: boxSVG, pieces: [{ svg: K.poly([[66, 96], [134, 96], [126, 104], [74, 104]], '#DCEBFF', 1.2), at: [100, 100], from: [0, -50] }] }),
      S('A strong paper box! Fill it with tiny treasures.', 'show', { item: mid(boxSVG), kind: 'bounce' })
    ] };
  })();

  const stencil = (() => {
    const rk = [[100, 32], [114, 52], [114, 92], [124, 108], [108, 104], [100, 112], [92, 104], [76, 108], [86, 92], [86, 52]], rc = closed(rk), GREEN = '#9ED9B4';
    const card = K.rect(40, 18, 120, 112, GREEN, 3), stencilSVG = K.path(`M40,18 h120 v112 h-120 Z M${rk.map(p => p.join(',')).join(' L')} Z`, GREEN, 1.6, 'fill-rule="evenodd"');
    const d1 = { a: 'dab', pts: [[100, 46], [94, 60], [106, 60], [94, 74], [106, 74], [100, 88]].map(([x, y]) => [x, y, C.blue]), shape: 'sq', r: 9, tool: 'sponge' };
    const d2 = { a: 'dab', pts: [[84, 102], [100, 104], [116, 102], [100, 96]].map(([x, y]) => [x, y, C.orange]), shape: 'sq', r: 9, tool: 'sponge' };
    const cid = 'cr7stc', clipR = `<clipPath id="${cid}"><polygon points="${rk.map(p => p.join(',')).join(' ')}"/></clipPath>`;
    const prints = `${clipR}<g clip-path="url(#${cid})">${done(d1)}${done(d2)}</g>`, deco = K.circ(100, 64, 6, '#fff', 1.4) + K.star(66, 40, 6, C.yellow) + K.star(140, 56, 5, C.yellow) + K.star(138, 110, 4, C.yellow);
    const tapes = [[44, 22], [156, 22], [44, 126], [156, 126]].map(([x, y]) => tapeP(x, y, 14, 7, 45)).join('');
    return { id: 'stencil', cat: 'paint', name: 'Rocket stencil print', ico: '🚀', lv: 4, min: 40, mat: [['📁', 'a plastic folder or stiff card'], M.pencil, M.scissors, M.tape, ['🎨', 'paint in 2 colors'], ['🧽', 'a sponge'], M.paper, M.pens], tip: 'Use only a little paint on the sponge and dab straight down, so it does not creep under the edges. One stencil prints dozens of times.', steps: [
      S('Draw a simple rocket on stiff card or a plastic folder.', 'draw', { base: card, s: [rc], c: OL, w: 1.6, tool: 'pen' }),
      S('A grown-up starts the cut. Cut out the rocket and keep the outside part!', 'cut', { base: card + K.line(rc, OL, 1.4), pts: rc }),
      S('Tape the stencil onto clean paper.', 'place', { base: sheet(), pieces: [{ svg: stencilSVG + tapes, at: [100, 74], from: [0, -70] }] }),
      S('Dab blue paint through the hole. Dab, do not wipe!', 'dab', { base: sheet(), ...d1, top: stencilSVG + tapes }),
      S('Dab orange at the bottom for the flames.', 'dab', { base: sheet() + done(d1), ...d2, top: stencilSVG + tapes }),
      S('Lift the stencil off slowly. Ta-da!', 'peel', { base: sheet() + prints, box: [40, 18, 120, 112], c: GREEN }),
      S('When it is dry, add a window and stars with a pen.', 'draw', { base: sheet() + prints, s: [circlePts(100, 64, 6, 12), closed(K.starPts(66, 40, 6)), closed(K.starPts(140, 56, 5))], c: OL, w: 1.4, tool: 'pen', fill: deco }),
      S('Blast off! Use your stencil again and again.', 'show', { item: mid(sheet() + prints + deco), kind: 'glow' })
    ] };
  })();

  const machemask = (() => {
    const cx = 100, cy = 70, rx = 44, ry = 52, balloon = K.ell(cx, cy, rx, ry, C.pink) + K.ell(cx - 16, cy - 22, 6, 11, 'rgba(255,255,255,.5)', 0);
    const L1 = bands(cx, cy, rx, ry, 6, 1, undefined, 0.05, 0.95), nose = K.ell(cx, cy + 6, 9, 12, '#E9E0CC'), L2 = bands(cx, cy, rx * 0.8, ry * 0.8, 4, 0, ['#F4ECDA', '#E9E0CC']);
    const shell = K.ell(cx, cy, rx, ry, '#EFE6D2') + nose, eyes = [circlePts(84, 56, 9, 14), circlePts(116, 56, 9, 14)];
    const holed = shell + eyes.map(p => K.poly(p, '#FFF6E5', 1.4)).join('');
    const painted = K.ell(cx, cy, rx, ry, C.orange) + [[-30, -20], [30, -20], [-34, 10], [34, 10], [0, -40]].map(([a, b]) => K.path(`M${cx + a},${cy + b} l${a > 0 ? -10 : 10},4 l${a > 0 ? 10 : -10},4`, 'none', 0, `stroke="${OL}" stroke-width="3"`)).join('') + K.ell(cx, cy + 6, 9, 12, '#FFFFFF') + K.ell(cx, cy + 22, 14, 6, '#fff') + eyes.map(p => K.poly(p, '#FFF6E5', 1.4)).join('') + K.ell(cx, cy + 2, 4, 3, OL, 0);
    const holes = [[60, 70], [140, 70]], el = K.path('M60,70 Q100,4 140,70', 'none', 0, `stroke="${OL}" stroke-width="2"`);
    return { id: 'machemask', cat: 'costume', name: 'Papier-mâché tiger mask', ico: '🐯', lv: 4, min: 120, mat: [M.balloon, M.news, M.pastem, M.scissors, M.paint, M.brush, M.punch, ['🪢', 'thin elastic']], tip: 'Make the balloon about the size of the child\'s head. Five layers make a mask strong enough to wear again and again.', steps: [
      S('Blow up a balloon, about as big as your head.', 'inflate', { at: [cx, 66], r: 52, c: C.pink }),
      S('Lay pasted paper strips over the front half of the balloon.', 'layer', { base: balloon, strips: L1 }),
      S('Add a scrunched paper nose and more strips. Dry it for two days.', 'layer', { base: balloon + done({ a: 'layer', strips: L1 }) + nose, strips: L2 }),
      S('Pop the balloon. A grown-up cuts out the eye holes.', 'cut', { base: shell, cuts: eyes }),
      S('Paint your mask like a tiger. Stripes, whiskers and a nose!', 'paint', { base: holed, area: painted, box: [cx - rx, cy - ry, rx * 2, ry * 2], c: C.orange }),
      S('Punch a hole at each side.', 'punch', { base: painted, holes, r: 3 }),
      S('Tie elastic through the holes, so it fits your head.', 'draw', { base: painted + holes.map(([x, y]) => K.hole(x, y, 3)).join(''), s: [[[60, 70], [80, 30], [100, 22], [120, 30], [140, 70]]], c: OL, w: 2, tool: 'finger' }),
      S('Roar! Put on a show in your tiger mask.', 'show', { item: mid(el + painted), kind: 'wiggle' })
    ] };
  })();

  const windmill = (() => {
    const tower = K.poly([[78, 132], [122, 132], [112, 52], [88, 52]], C.card) + K.poly([[84, 54], [116, 54], [100, 34]], C.red);
    const towerP = tower + K.path('M93,132 L93,116 Q100,108 107,116 L107,132Z', '#7A5A3A') + K.rect(94, 74, 12, 10, '#BDE0F7', 2) + K.rect(94, 92, 12, 10, '#BDE0F7', 2);
    const blade = (a, x = 0, y = 0) => K.g(K.rect(5, -8, 46, 16, '#FFFFFF', 2) + K.line([[10, 0], [48, 0]], 'rgba(34,48,90,.3)', 1), x, y, 1, a);
    const blades = [0, 90, 180, 270].map(a => blade(a)).join('') + K.circ(0, 0, 6, C.yellow, 1.4), atHub = K.g(blades, 100, 58);
    return { id: 'windmill', cat: 'build', name: 'Turning windmill', ico: '🌬️', lv: 4, min: 75, mat: [['📦', 'a tall box or a carton'], M.card, M.ruler, M.pencil, M.scissors, M.fasteners, ['🥤', 'a bead or a bit of straw'], M.glue, M.paint, M.brush], tip: 'Put a bead or a slice of straw between the blades and the box so they spin freely. Engineers call that a spacer!', steps: [
      S('Measure four blades on card, all the same size.', 'measure', { base: K.rect(30, 50, 140, 40, '#fff', 2), from: [30, 70], to: [170, 70], n: 4, nums: true }),
      S('Cut out the four blades.', 'cut', { base: K.rect(30, 50, 140, 40, '#fff', 2), cuts: [[[65, 50], [65, 90]], [[100, 50], [100, 90]], [[135, 50], [135, 90]]] }),
      S('Glue the blades onto a card circle, like a big plus.', 'ring', { base: K.circ(100, 75, 16, C.card) + K.line([[40, 75], [160, 75]], 'rgba(34,48,90,.25)', 1.3, '4 3') + K.line([[100, 15], [100, 135]], 'rgba(34,48,90,.25)', 1.3, '4 3'), items: [0, 90, 180, 270].map(a => ({ x: 100 + 28 * Math.cos(a * Math.PI / 180), y: 75 + 28 * Math.sin(a * Math.PI / 180), svg: blade(a, 100, 75) })).concat([{ x: 100, y: 75, svg: K.circ(100, 75, 6, C.yellow, 1.4) }]) }),
      S('A grown-up makes a hole near the top of the box.', 'punch', { base: tower, holes: [[100, 58]], r: 3 }),
      S('Push a split pin through the blades, a bead and the box. Not too tight!', 'place', { base: tower, pieces: [{ svg: atHub, at: [100, 58], from: [0, -60] }] }),
      S('Paint a door and little windows.', 'paint', { base: tower + atHub, area: towerP + atHub, box: [78, 34, 44, 98], c: C.brown }),
      S('Blow on it, or put it near a fan. Round and round!', 'show', { base: towerP, item: blades, at: [100, 58], kind: 'spin' })
    ] };
  })();

  const wallhanging = (() => {
    const box = [44, 18, 112, 114], board = K.rect(44, 18, 112, 114, C.card, 3), cols = [C.teal, C.teal, C.teal, C.yellow, C.pink, C.pink, C.pink, C.yellow, C.teal];
    const warp = [Array.from({ length: 9 }, (_, i) => [[54 + i * 12, i % 2 ? 130 : 20], [54 + i * 12, i % 2 ? 20 : 130]]).flat()];
    const L = (pre, n) => ({ a: 'loom', box, warp: 9, pre, n, rowH: 9, colors: cols }), woven = done(L(0, 9));
    const fringe = Array.from({ length: 5 }, (_, i) => { const x = 58 + i * 21; return [0, 1, 2, 3].map(k => K.line([[x, 132], [x - 4 + k * 3, 148]], [C.teal, C.pink, C.yellow, C.teal, C.pink][i], 2)).join(''); }).join('');
    const top = stick(100, 12, 140, 0, C.brown, 8), full = woven + fringe + top;
    return { id: 'wallhanging', cat: 'thread', name: 'Woven wall hanging', ico: '🖼️', lv: 4, min: 120, mat: [['🟫', 'stiff cardboard'], M.ruler, M.scissors, ['🧶', 'wool in 3 colors'], M.pneedle, ['🪵', 'a stick for hanging']], tip: 'Mix thick and thin stripes and try a fluffy wool for texture. Leave the warp a little loose at the top so it slides off the card.', steps: [
      S('Cut notches along the top and bottom of a piece of card.', 'cut', { base: board, cuts: [K.zig(52, 148, 18, -5, 8), K.zig(52, 148, 132, 5, 8)] }),
      S('Wrap wool up and down through the notches.', 'draw', { base: board, s: warp, c: '#FFFFFF', w: 1.8, tool: 'yarn', guide: false }),
      S('Weave a thick stripe: over, under. Push each row down.', 'loom', L(0, 3)),
      S('Add a thin stripe in a new color, then a thick one.', 'loom', L(3, 4)),
      S('Finish with a thin stripe and a thick one.', 'loom', L(7, 2)),
      S('Slide it off the card. Tie bunches of wool at the bottom for a fringe.', 'place', { base: woven, pieces: [{ svg: fringe, at: [100, 140], from: [0, 30] }] }),
      S('Tie the top loops onto a stick.', 'place', { base: woven + fringe, pieces: [{ svg: top, at: [100, 12], from: [0, -40] }] }),
      S('Hang your weaving on the wall. You made art!', 'show', { item: mid(full), kind: 'swing' })
    ] };
  })();

  const papermaking = (() => {
    const tub = K.rect(36, 80, 128, 44, 'rgba(142,197,245,.35)', 6), frameS = K.rect(56, 40, 88, 60, 'none', 2, `stroke="${C.brown}" stroke-width="5"`), pulp = K.rect(58, 42, 84, 56, '#EDE7D9', 2);
    const towel = K.rect(30, 30, 140, 96, '#9ED9B4', 4) + Array.from({ length: 6 }, (_, i) => K.line([[30, 40 + i * 16], [170, 40 + i * 16]], 'rgba(255,255,255,.5)', 2)).join('');
    const wet = K.rect(58, 42, 84, 56, '#E3DCCB', 2), paper = K.rect(58, 42, 84, 56, '#F4F0E6', 2) + [[70, 54], [120, 80], [90, 88], [130, 50]].map(([x, y]) => K.circ(x, y, 1.6, '#C9BCA4', 0)).join('');
    const press = { a: 'dab', pts: [[70, 54], [100, 54], [130, 54], [70, 84], [100, 84], [130, 84]].map(([x, y]) => [x, y, 'rgba(255,255,255,.4)']), shape: 'sq', r: 12, tool: 'sponge' };
    return { id: 'papermaking', cat: 'recycle', name: 'Make your own paper', ico: '📃', lv: 4, min: 120, mat: [['📰', 'scrap paper'], ['💧', 'warm water'], ['🥣', 'a big bowl'], ['🫙', 'a blender (a grown-up uses it)'], ['🖼️', 'an old picture frame with net curtain stretched over it'], ['🛁', 'a big tub'], ['🧽', 'a sponge'], ['🧻', 'old towels']], safe: 'Only a grown-up uses the blender, and fingers stay out of it.', tip: 'Real recycling! Add flower petals, glitter or seeds to the pulp. Seed paper can be planted later.', steps: [
      S('Tear old paper into tiny pieces.', 'tear', { box: [40, 40, 120, 70], n: 6, c: '#F4F1E8' }),
      pourBowl('Soak them in warm water for an hour.', { c: '#DCE8F3', lv1: 0.7 }),
      S('A grown-up blends it into mushy pulp.', 'stir', { at: [100, 92], r: 40, c0: '#DCE8F3', c1: '#E9E3D6', bits: ['#fff', '#F4F1E8', '#EDE7D9'] }),
      S('Pour the pulp into a big tub of water.', 'pour', { base: tub, box: [36, 86, 128, 38], c: '#E3DED2', lv1: 0.7 }),
      S('Dip the frame in. Lift it out flat with a layer of pulp on top.', 'place', { base: tub, pieces: [{ svg: frameS + wet, at: [100, 70], from: [0, 40] }] }),
      S('Flip it onto a towel. Press a sponge all over to soak up water.', 'dab', { base: towel + wet + frameS, ...press }),
      S('Lift the frame off. Let your paper dry for a day.', 'peel', { base: towel + paper, box: [54, 38, 92, 64], c: '#C9D3DC' }),
      S('Brand new paper, made by you! Draw on it.', 'show', { item: mid(paper + K.heart(100, 70, 10, C.pink)), kind: 'glow' })
    ] };
  })();

  const periscope = (() => {
    const carton = (y, h, c = '#FFFFFF') => K.rect(80, y, 40, h, c, 3) + K.rect(80, y + h * 0.3, 40, h * 0.2, C.orange, 0);
    const lower = carton(76, 54), upper = carton(20, 56), winL = K.rect(84, 106, 32, 20, '#3A3F4A', 2), winU = K.rect(84, 24, 32, 20, '#3A3F4A', 2);
    const mirrorL = K.line([[84, 126], [116, 106]], '#BDE0F7', 4), mirrorU = K.line([[84, 24], [116, 44]], '#BDE0F7', 4), scope = upper + lower + winL + winU + mirrorL + mirrorU;
    const ray = K.line([[180, 34], [100, 34], [100, 116], [20, 116]], C.yellow, 2, '5 4');
    return { id: 'periscope', cat: 'science', name: 'Cardboard periscope', ico: '🔭', lv: 4, min: 60, mat: [['🧃', '2 clean juice cartons'], ['🪞', '2 small safety mirrors (plastic)'], M.ruler, M.pencil, M.scissors, M.tape], safe: 'Use plastic safety mirrors, never glass. Do not look at the Sun through it.', tip: 'Science: each mirror bounces the light round a corner. Submarines use periscopes to see above the water.', steps: [
      S('A grown-up cuts the tops off two clean juice cartons.', 'cut', { base: carton(40, 70), pts: [[80, 44], [120, 44]] }),
      S('Mark a square window near the bottom of each carton.', 'measure', { base: lower, from: [84, 106], to: [116, 106], n: 4, nums: false }),
      S('Cut out the windows.', 'cut', { base: lower, pts: [[84, 106], [116, 106], [116, 126], [84, 126], [84, 106]] }),
      S('Slide a mirror in, slanted like a slide. Tape it. Do both cartons.', 'place', { base: lower + winL, pieces: [{ svg: mirrorL, at: [100, 116], from: [-60, 0] }] }),
      S('Stack the cartons, windows facing opposite ways.', 'stack', { base: lower + winL + mirrorL, pieces: [{ svg: upper + winU + mirrorU, at: [100, 48], h: 80 }] }),
      S('Wrap tape round the join.', 'wrap', { base: scope, box: [80, 70, 40, 12], n: 4, c: '#8EC5F5' }),
      S('Look in the bottom window. You can see over walls!', 'show', { item: mid(scope + ray), kind: 'bounce' })
    ] };
  })();

  const notebook = (() => {
    const B = K.ori('#FFFDF7', '#F4EFE4', [[30, 30], [170, 30], [170, 120], [30, 120]]);
    const s1 = B.fold('Fold five sheets of paper in half. Put them inside a card cover.', { from: [30, 75], to: [170, 75] });
    const open = K.rect(26, 26, 148, 98, C.teal, 3) + K.card(30, 30, 140, 90), holes = [[100, 40], [100, 75], [100, 110]], holed = open + holes.map(([x, y]) => K.hole(x, y, 2.4)).join('');
    const st = { a: 'stitch', base: holed, pts: [[100, 75], [100, 40], [100, 110]], c: C.red }, sewn = done(st);
    const cover = K.rect(64, 26, 72, 98, C.teal, 3) + K.line([[64, 26], [64, 124]], C.red, 3), doodle = K.star(100, 60, 14, C.yellow) + K.line(K.wave(76, 124, 96, 4, 2), '#fff', 3);
    return { id: 'notebook', cat: 'sew', name: 'Hand-stitched notebook', ico: '📒', lv: 4, min: 45, mat: [['📄', '5 sheets of paper'], M.card, M.ruler, M.pencil, ['📌', 'a pushpin (a grown-up pokes the holes)'], M.needle, ['🧵', 'strong thread or thin wool'], M.crayons], tip: 'This is a real bookbinding stitch called a pamphlet stitch. Make the holes on a folded towel or an old magazine.', steps: [
      s1,
      S('Open it. Mark three dots along the fold.', 'measure', { base: open, from: [100, 40], to: [100, 110], n: 2, nums: false }),
      S('A grown-up pokes a hole at each dot.', 'punch', { base: open, holes, r: 2.4 }),
      S('Sew in through the middle hole, out the top, then in the bottom.', 'stitch', st),
      S('Come back out the middle. Tie the two ends over the long stitch.', 'knot', { base: sewn, at: [100, 66], c: C.red }),
      S('Close it and decorate the cover.', 'draw', { base: cover, s: [closed(K.starPts(100, 60, 14)), K.wave(76, 124, 96, 4, 2)], c: C.yellow, w: 2.4, fill: doodle }),
      S('Your own notebook! Fill it with drawings and stories.', 'show', { item: mid(cover + doodle), kind: 'bounce' })
    ] };
  })();

  craftsHome.add([sewplate, rangoli, redenvelope, rollstamp,
    buttonsnake, plateweave, doughstar, diya, eidcard, foamprint, penguin, eggflowers, papelpicado, koinobori,
    fingerknit, godseye, feltornament, crossstitch, macheplanet, stickcatapult, kabuto, coilpot, stringprint, fanous, mkeka, rakhi, windchime, chainreaction, cupphone, twigweave,
    bandcar, papercircuit, tiltmaze, grabber, spoolknit, feltpouch, feltfish, pinata, foilclay, dragonpuppet, parol, heartbasket, waterbomb, flapbird, masubox, stencil, machemask,
    windmill, wallhanging, papermaking, periscope, notebook]);
  if (window.__crafts) window.__crafts.R7 = ['knit', 'light', 'roll'];
}/*}lazy*/);
