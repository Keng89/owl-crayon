/* ---------- English & Reading, part 8: round 3 screens ---------- */
// Five new sections join the English home through englishHome.api: Write letters (trace A–Z, a–z and short words with
// a finger, stroke by stroke), Sound games (count the sounds, change a sound, first/middle/last sound, clap the beats),
// Talk time (everyday chats with friendly slang and meaning cards), Chapter books (12 longer stories for stages 3–5 with
// tap-for-meaning words and who/what/where/why/feeling questions) and Grammar islands (9 islands opened in order, each a
// 5-question challenge with a badge). A daily English mission (3 small jobs) sits on the English home and feeds the daily
// quest. Every star goes through give(), so it is a normal star; all progress is kept in st.english.
(() => {
  const A = englishHome.api, { quiz, give, reward, E, stage, open, talk, ptip, SECTIONS, VIEWS } = A;
  const R3 = () => {
    const e = E(); e.trace = e.trace || {}; e.trace.L = e.trace.L || {}; e.trace.W = e.trace.W || {};
    e.talk = e.talk || {}; e.cards = e.cards || {}; e.books = e.books || {}; e.bookCh = e.bookCh || {}; e.isl = e.isl || {}; e.missions = e.missions || 0;
    return e;
  };
  const snd = c => EN_SND6[c] || c;
  const plain = h => String(h).replace(/<[^>]+>/g, '');

  /* ===================== daily English mission ===================== */
  const MJOBS = {
    trace: ['✍️', 'Trace 2 letters or words', 2, () => go(writeHome)],
    sound: ['🎧', 'Play a sound game', 1, () => go(soundsHome)],
    talk: ['🗣️', 'Have a chat in Talk time', 1, () => go(talkHome)],
    book: ['📚', 'Read a chapter of a book', 1, () => go(booksHome)],
    island: ['🏝️', 'Play a grammar island', 1, () => go(islandsHome)],
    stars: ['⭐', 'Earn 6 reading stars', 6, () => go(englishHome)],
    wotd: ['☀️', 'Find the word of the day', 1, () => go(VIEWS.wotd)]
  };
  function mission() {
    const e = R3(), d = today();
    if (!e.mission || e.mission.day !== d) {
      const n = dayNum(d), s = stage();
      const a = ['trace', 'sound', 'talk'], b = [s >= 3 ? 'book' : 'island', 'stars', VIEWS.wotd ? 'wotd' : 'stars', 'island'];
      const ks = [a[n % 3], a[(n + 1) % 3], b[n % b.length]];
      e.mission = { day: d, xp0: e.xp, claimed: false, tasks: [...new Set(ks)].map(k => ({ k, have: 0 })) };
      if (e.mission.tasks.length < 3) e.mission.tasks.push({ k: 'stars', have: 0 });
      save();
    }
    return e.mission;
  }
  const need = t => MJOBS[t.k][2];
  const have = t => { const e = R3(); return t.k === 'stars' ? Math.max(0, Math.min(6, e.xp - mission().xp0)) : t.k === 'wotd' ? (e.wotd && e.wotd.last === today() ? 1 : 0) : Math.min(need(t), t.have); };
  const mDone = () => mission().tasks.every(t => have(t) >= need(t));
  // A finished job ticks the daily quest's "English" job once.
  function msync() {
    const m = mission(); let ch = false;
    m.tasks.forEach(t => { if (!t.ticked && have(t) >= need(t)) { t.ticked = 1; ch = true; questTick('english'); setTimeout(() => toast(`English mission job done: ${MJOBS[t.k][1]}! ✅`), 700); } });
    if (ch) save();
  }
  function mtick(k, by = 1) { const m = mission(); m.tasks.forEach(t => { if (t.k === k) t.have = Math.min(need(t), t.have + by); }); msync(); save(); }
  function missionView() {
    const m = mission(), done = mDone(), nav = navId;
    view.innerHTML = `${crumbs('🎯 English mission')}
      <p class="note">Three little jobs for today. Finish them all to open the prize!</p>
      <div class="e6-mlist">${m.tasks.map((t, i) => { const h = have(t), n = need(t), ok = h >= n;
        return `<button class="e6-mjob${ok ? ' ok' : ''}" data-mj="${i}"><span class="e6-mico">${ok ? '✅' : MJOBS[t.k][0]}</span><span><b>${MJOBS[t.k][1]}</b><span class="meter"><i style="width:${Math.round(h / n * 100)}%"></i></span></span><span class="e6-mn">${h}/${n}</span></button>`; }).join('')}</div>
      ${m.claimed ? '<p class="e6-mclaimed">🏆 Mission complete! Come back tomorrow for a new one.</p>' : `<button class="e6-chest${done ? ' ready' : ''}" id="mChest">${done ? '🎁 Open the mission prize!' : '🔒 Finish all 3 jobs to open the prize'}</button>`}
      <div class="cheer" id="cheer" aria-live="polite"></div>${ptip('mission')}`;
    wireBack(englishHome);
    sayScreen(`Today's English mission: ${m.tasks.map(t => MJOBS[t.k][1]).join(', ')}.`);
    view.querySelectorAll('[data-mj]').forEach(b => b.onclick = () => MJOBS[m.tasks[+b.dataset.mj].k][3]());
    const c = $('#mChest');
    if (c) c.onclick = () => {
      if (nav !== navId || m.claimed) return;
      if (!mDone()) { say('Finish all 3 jobs to open the prize!'); return; }
      m.claimed = true; const e = R3(); e.missions++; give(3); save(); confetti(60); yay();
      c.outerHTML = '<p class="e6-mclaimed e6-pop">🏆 Mission complete! +3 ⭐</p>'; say('Mission complete! You earned 3 bonus stars!');
    };
  }

  /* ===================== Write letters ===================== */
  const UPPER = Object.keys(EN_ABC).filter(k => k === k.toUpperCase()), LOWER = Object.keys(EN_ABC).filter(k => k !== k.toUpperCase());
  const wordsOpen = () => st.unlockAll || stage() >= 2 || Object.keys(R3().trace.L).length >= 6;
  function writeHome(tab) {
    const e = R3(), T = tab || e.wtab || 'upper'; e.wtab = T;
    const L = e.trace.L, Wd = e.trace.W, wo = wordsOpen();
    const items = T === 'words' ? EN_TRACE_WORDS.map(([w, em]) => [w, `<span class="e6-wem">${em}</span>${w}`, Wd[w]]) : (T === 'upper' ? UPPER : LOWER).map(k => [k, k, L[k]]);
    const n = Object.keys(L).length;
    view.innerHTML = `${crumbs('✍️ Write letters')}
      <div class="en-tabs" role="tablist">${[['upper', 'ABC Big letters'], ['lower', 'abc Small letters'], ['words', `${wo ? '' : '🔒 '}✏️ Words`]].map(([id, nm]) => `<button class="en-tab${T === id ? ' on' : ''}" data-wt="${id}" role="tab" aria-selected="${T === id}">${nm}</button>`).join('')}</div>
      <div class="e6-wprog"><span class="meter"><i style="width:${Math.round(n / 52 * 100)}%"></i></span><span class="note">✍️ ${n} of 52 letters traced · ${Object.keys(Wd).length} words</span></div>
      ${T === 'words' && !wo ? '<p class="note">Words open after you trace 6 letters. You can do it!</p>' : `<p class="note">${T === 'words' ? 'Trace a whole word, letter by letter.' : 'Pick a letter. Start at the green dot and follow the arrow.'}</p>`}
      <div class="e6-lgrid${T === 'words' ? ' words' : ''}${T === 'words' && !wo ? ' dim' : ''}">${items.map(([k, html, done]) => `<button class="e6-lt${done ? ' done' : ''}" data-lt="${esc(k)}" aria-label="${T === 'words' ? esc(k) : `letter ${k}`}">${html}${done ? '<i>✓</i>' : ''}</button>`).join('')}</div>${ptip('write')}`;
    wireBack(englishHome);
    sayScreen(T === 'words' ? 'Pick a word to trace.' : 'Pick a letter to trace with your finger.');
    view.querySelectorAll('[data-wt]').forEach(b => b.onclick = () => go(writeHome, b.dataset.wt));
    view.querySelectorAll('[data-lt]').forEach(b => b.onclick = () => {
      if (T === 'words' && !wo) { say('Trace 6 letters first, then words open!'); return; }
      go(trace, T === 'words' ? 'W' : 'L', b.dataset.lt);
    });
  }
  // Lay letters side by side; returns strokes with their path moved into place.
  function layout(key, kind) {
    const glyphs = kind === 'W' ? key.split('') : [key], pad = 8, gap = 6; let x = pad;
    const strokes = [];
    glyphs.forEach((g, gi) => {
      const [w, ...ps] = EN_ABC[g];
      ps.forEach(d => strokes.push({ g, gi, d: d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (m, a, b) => `${+a + x} ${b}`) }));
      x += w + gap;
    });
    return { strokes, W: x - gap + pad, H: 160, glyphs };
  }
  let TR = null;
  // hook (english11.js, the reading path): { back, done } — the lesson gives its own stars, so a hooked trace gives none.
  function trace(kind, key, hook) {
    const e = R3(), Lt = layout(key, kind), { strokes, W, H } = Lt, nav = navId;
    const low = key.toLowerCase(), LL = EN_LETTERS.find(l => l[0] === low), word = kind === 'W' ? EN_TRACE_WORDS.find(x => x[0] === key) : null;
    const big = kind === 'L' && key !== low;
    const title = kind === 'W' ? `Write “${key}”` : `Write ${big ? 'big' : 'small'} ${key}`;
    TR = { kind, key, k: 0, ink: [], lines: [], done: false, tries: 0, strokes };
    view.innerHTML = `${crumbs(`✍️ ${esc(title)}`)}
      <div class="e6-thead">${kind === 'W' ? `<span class="e6-tpic">${word ? word[1] : '✏️'}</span><b>${esc(key)}</b>` : `<span class="e6-tpic">${LL ? LL[3] : ''}</span><b>${key}</b><span class="note">${esc(key)} is for ${LL ? esc(LL[2]) : ''}</span>`}</div>
      <div class="e6-pwrap" style="aspect-ratio:${W}/${H};width:min(100%, ${kind === 'W' ? 620 : 360}px, calc(52vh * ${(W / H).toFixed(3)}))">
        <svg class="e6-pad" id="tPad" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tracing pad for ${esc(key)}">
          <rect x="0" y="0" width="${W}" height="${H}" class="e6-paper"/>
          <line x1="0" x2="${W}" y1="20" y2="20" class="e6-ln"/><line x1="0" x2="${W}" y1="65" y2="65" class="e6-ln mid"/><line x1="0" x2="${W}" y1="110" y2="110" class="e6-ln base"/><line x1="0" x2="${W}" y1="150" y2="150" class="e6-ln"/>
          <g class="e6-trk">${strokes.map(s => `<path d="${s.d}"/>`).join('')}</g>
          <g class="e6-dot">${strokes.map((s, i) => `<path d="${s.d}" data-sk="${i}"/>`).join('')}</g>
          <path class="e6-demo" id="tDemo" d=""/>
          <g id="tInk" class="e6-ink"></g>
          <g id="tMarks"></g>
        </svg></div>
      <p class="e6-thint" id="tHint" aria-live="polite"></p>
      <div class="row" id="tBtns"><button class="btn alt" id="tWatch">👀 Watch me</button><button class="btn alt" id="tClear">🗑️ Again</button><button class="btn leaf" id="tCheck">✅ Check</button></div>
      <div class="cheer" id="cheer" aria-live="polite"></div><div class="row" id="tNext"></div>${ptip('write')}`;
    wireBack(hook ? hook.back : () => writeHome(kind === 'W' ? 'words' : big ? 'upper' : 'lower'));
    const svg = $('#tPad'), inkG = $('#tInk'), marks = $('#tMarks'), demo = $('#tDemo');
    const els = [...svg.querySelectorAll('.e6-dot path')];
    strokes.forEach((s, i) => { s.el = els[i]; s.len = s.el.getTotalLength(); s.pts = []; for (let d = 0; d <= s.len; d += 3) { const p = s.el.getPointAtLength(d); s.pts.push([p.x, p.y]); } const p = s.el.getPointAtLength(s.len); s.pts.push([p.x, p.y]); });
    const allPts = strokes.flatMap(s => s.pts);
    const scale = () => { const r = svg.getBoundingClientRect(); return r.width ? r.width / W : 2; };
    const radii = () => { const k = scale(); return [Math.max(12, 22 / k), Math.max(20, 34 / k)]; };
    const cover = i => { const [r] = radii(), r2 = r * r, P = TR.ink; if (!P.length) return 0; let hit = 0; for (const [x, y] of strokes[i].pts) { for (const [a, b] of P) if ((a - x) * (a - x) + (b - y) * (b - y) <= r2) { hit++; break; } } return hit / strokes[i].pts.length; };
    const stray = () => { const [, s] = radii(), s2 = s * s, P = TR.ink; if (!P.length) return 0; let out = 0; for (const [a, b] of P) { let near = false; for (const [x, y] of allPts) if ((a - x) * (a - x) + (b - y) * (b - y) <= s2) { near = true; break; } if (!near) out++; } return out / P.length; };
    TR.cover = cover; TR.stray = stray;
    const tip = () => kind === 'W' ? `Trace line ${TR.k + 1} of ${strokes.length}, letter ${strokes[TR.k].g}.` : strokes.length > 1 ? `Line ${TR.k + 1}: start at the green dot.` : 'Start at the green dot.';
    function drawMarks() {
      els.forEach((el, i) => el.setAttribute('class', i < TR.k ? 'ok' : i === TR.k && !TR.done ? 'on' : ''));
      marks.innerHTML = strokes.map((s, i) => {
        if (i < TR.k || TR.done) return '';
        const [x, y] = s.pts[0], on = i === TR.k, [ax, ay] = strokes[TR.k].pts[0];
        if (!on && Math.hypot(x - ax, y - ay) < 18) return ''; // a later start right on top of the green dot waits its turn
        let arrow = '';
        if (on) { const L = Math.min(s.len * 0.5, 30), p = s.el.getPointAtLength(L), q = s.el.getPointAtLength(Math.min(s.len, L + 4)), ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
          if (s.len > 8) arrow = `<g transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${ang.toFixed(0)})"><path class="e6-arrow" d="M-6 -6 L4 0 L-6 6 Z"/></g>`; }
        return `${arrow}<g class="e6-start${on ? ' on' : ''}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${on ? 8 : 6.5}"/><text x="${x.toFixed(1)}" y="${(y + 3.5).toFixed(1)}">${i + 1}</text></g>`;
      }).reverse().join('');
      $('#tHint').textContent = TR.done ? '' : tip();
    }
    drawMarks();
    // Finger ink, kept in the pad's own units so the size of the screen does not matter.
    const pt = ev => { const m = svg.getScreenCTM(); if (!m) return null; const p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY; const q = p.matrixTransform(m.inverse()); return [q.x, q.y]; };
    let down = false, line = null, last = null;
    const add = p => {
      if (last) { const dx = p[0] - last[0], dy = p[1] - last[1], n = Math.ceil(Math.hypot(dx, dy) / 2.5); for (let i = 1; i <= n; i++) TR.ink.push([last[0] + dx * i / n, last[1] + dy * i / n]); } else TR.ink.push(p);
      line.pts.push(p); last = p;
      line.el.setAttribute('d', 'M' + line.pts.map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' L') + (line.pts.length === 1 ? ' l0.1 0' : ''));
    };
    svg.onpointerdown = ev => {
      if (TR.done || nav !== navId) return;
      const p = pt(ev); if (!p) return; ev.preventDefault();
      down = true; last = null; try { svg.setPointerCapture(ev.pointerId); } catch (x) {}
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'path'); inkG.appendChild(el); line = { el, pts: [] }; TR.lines.push(line); add(p);
    };
    svg.onpointermove = ev => { if (!down || TR.done) return; const p = pt(ev); if (p) add(p); };
    svg.onpointerup = svg.onpointercancel = () => {
      if (!down) return; down = false;
      if (TR.done || nav !== navId) return;
      const k0 = TR.k;
      while (TR.k < strokes.length && cover(TR.k) >= 0.8) TR.k++;
      if (TR.k > k0) tone([620 + TR.k * 60], 0.07);
      if (TR.k >= strokes.length) { finishCheck(); return; }
      drawMarks();
      if (TR.k > k0) say(strokes.length > 1 ? `Good! Now line ${TR.k + 1}.` : 'Keep going!');
    };
    function clear() { TR.ink = []; TR.lines = []; TR.k = 0; inkG.innerHTML = ''; drawMarks(); }
    function finishCheck() {
      if (stray() > 0.25) {
        TR.tries++; oops(); const m = 'Lots of wiggles outside the dotted line! Let\'s try again, nice and slow.';
        $('#cheer').textContent = ''; $('#tHint').textContent = m; say(m); svg.classList.add('e6-shake');
        setTimeout(() => { if (nav !== navId) return; svg.classList.remove('e6-shake'); clear(); }, 700); return;
      }
      win();
    }
    function win() {
      TR.done = true; drawMarks();
      if (hook) {
        if (kind === 'L' || EN_TRACE_WORDS.some(x => x[0] === key)) e.trace[kind][key] = (e.trace[kind][key] || 0) + 1;
        TR.earned = 0; mtick('trace'); save(); svg.classList.add('e6-win'); confetti(30); yay(); $('#tBtns').style.display = 'none';
        $('#cheer').textContent = 'Beautiful writing! ✅'; say(`Beautiful! You wrote ${key.split('').join(', ')}.`); hook.done(); return;
      }
      const store = e.trace[kind], first = !store[key]; store[key] = (store[key] || 0) + 1;
      const earned = first ? (kind === 'W' ? 3 : 2) : 1; TR.earned = earned;
      give(earned); if (TR.tries === 0) questTick('firsttry'); mtick('trace'); save();
      svg.classList.add('e6-win'); confetti(30); yay();
      const nice = pick(['Beautiful', 'Super', 'Wonderful', 'Perfect']);
      $('#cheer').textContent = `${nice}! ${'⭐'.repeat(earned)}`;
      say(kind === 'W' ? `${nice}! You wrote ${key}! ${key.split('').join(', ')}. ${key}!` : `${nice}! You wrote ${big ? 'big' : 'small'} ${key}! ${LL ? `${key} is for ${LL[2]}.` : ''}`);
      const list = kind === 'W' ? EN_TRACE_WORDS.map(x => x[0]) : big ? UPPER : LOWER, nx = list[list.indexOf(key) + 1];
      $('#tBtns').style.display = 'none';
      $('#tNext').innerHTML = `${nx ? `<button class="btn leaf" id="tGo">Next: ${esc(nx)} ▶</button>` : ''}<button class="btn alt" id="tAll">${kind === 'W' ? 'All words' : 'All letters'}</button>`;
      if (nx) $('#tGo').onclick = () => go(trace, kind, nx);
      $('#tAll').onclick = () => go(writeHome, kind === 'W' ? 'words' : big ? 'upper' : 'lower');
    }
    // Watch me: each line draws itself in order.
    function watch() {
      let t = 0;
      strokes.forEach((s, i) => {
        const dur = 0.35 + s.len / 110;
        setTimeout(() => {
          if (nav !== navId || !demo.isConnected) return;
          demo.setAttribute('d', s.d); demo.style.transition = 'none'; demo.style.strokeDasharray = s.len + 1; demo.style.strokeDashoffset = s.len + 1; demo.getBoundingClientRect();
          demo.style.transition = `stroke-dashoffset ${dur}s linear`; demo.style.strokeDashoffset = 0;
        }, t * 1000);
        t += dur + 0.25;
      });
      setTimeout(() => { if (nav === navId && demo.isConnected) demo.setAttribute('d', ''); }, t * 1000 + 300);
    }
    $('#tWatch').onclick = () => { watch(); say(kind === 'W' ? `Watch: ${key}.` : (EN_ABC_TALK[key] || 'Watch me.')); };
    $('#tClear').onclick = () => { clear(); $('#cheer').textContent = ''; };
    $('#tCheck').onclick = () => {
      if (TR.done) return;
      if (!TR.ink.length) { say('Trace the dotted line with your finger. Start at the green dot!'); $('#tHint').textContent = 'Trace the dotted line with your finger.'; return; }
      while (TR.k < strokes.length && cover(TR.k) >= 0.8) TR.k++;
      if (TR.k >= strokes.length) { finishCheck(); return; }
      TR.tries++; oops(); drawMarks();
      const m = stray() > 0.25 ? 'Try to stay on the dotted line.' : `Keep going! ${tip()}`;
      $('#tHint').textContent = m; say(m);
    };
    sayScreen(kind === 'W' ? `Let's write ${key}. Trace each letter, starting at the green dot.` : `Let's write ${big ? 'big' : 'small'} ${key}. ${EN_ABC_TALK[key] || ''} Start at the green dot.`);
    setTimeout(() => { if (nav === navId) watch(); }, 500);
  }

  /* ===================== Sound games ===================== */
  const SGAMES = [['count', '🔢', 'Count the sounds', 'How many sounds in fish? f-i-sh: 3!'], ['change', '🔁', 'Change a sound', 'cat → hat: swap one sound'],
    ['where', '🎯', 'First, middle, last', 'Which sound is at the start?'], ['clap', '👏', 'Clap the beats', 'Tap a clap for each beat: ba-na-na']];
  function soundsHome() {
    const e = R3();
    view.innerHTML = `${crumbs('🎧 Sound games')}
      <p class="note">Words are made of little sounds. Listen closely and play with them!</p>
      <div class="en-gg">${SGAMES.map(([id, ico, name, sub]) => `<button class="en-gt e6-sg" data-sg="${id}"><span class="en-sico">${ico}</span><b>${name}</b><small>${sub}${e.best['snd-' + id] != null ? ` · best ${e.best['snd-' + id]}` : ''}</small></button>`).join('')}</div>${ptip('sounds')}`;
    wireBack(englishHome);
    sayScreen('Sound games! Count the sounds, change a sound, find the first, middle or last sound, or clap the beats.');
    view.querySelectorAll('[data-sg]').forEach(b => b.onclick = () => { const id = b.dataset.sg; id === 'clap' ? go(clap) : go(quiz, ({ count: countSpec, change: changeSpec, where: whereSpec })[id]()); });
  }
  const boxes = (s, hi) => `<div class="e6-boxes">${s.map((c, i) => `<span class="${i === hi ? 'hi' : ''}" style="animation-delay:${i * 0.25}s">${esc(c)}</span>`).join('')}</div>`;
  const sgDone = id => () => { mtick('sound'); };
  function countSpec() {
    return { id: 'snd-count', title: '🔢 Count the sounds', back: () => go(soundsHome), tip: 'sounds', n: 6, done: sgDone('count'), gen() {
      const s = stage(), pool = EN_PHON.filter(x => s <= 1 ? x.s.length <= 4 : true), x = pick(pool), opts = s <= 1 ? [2, 3, 4] : [2, 3, 4, 5];
      return { prompt: `How many sounds in <b>${esc(x.w)}</b>?`, say: `Say it slowly: ${x.w}. How many sounds can you hear?`, visual: `<div class="en-pic">${x.e}</div><div class="e6-word">${esc(x.w)}</div>`, x,
        choices: opts.map(v => ({ html: `<span class="e6-pips">${'●'.repeat(v)}</span><small>${v}</small>`, val: v, say: String(v), txt: true })), answer: x.s.length,
        explain: `Listen: ${x.s.map(snd).join(', ')}. That is ${x.s.length} sounds. ${x.s.some(c => c.length > 1) ? 'Some sounds use two letters!' : ''}` };
    }, onRight(q) { const ex = document.getElementById('exp'); if (ex) ex.innerHTML = boxes(q.x.s); talk(q.x.s.map(snd).concat([q.x.w]), 0.8); } };
  }
  // Every pair of three-sound words that differ in exactly one sound.
  const PAIRS = (() => { const out = []; for (const a of EN_CVC) for (const b of EN_CVC) { if (a === b || a.s.length !== b.s.length) continue; const diff = a.s.map((c, i) => c !== b.s[i] ? i : -1).filter(i => i >= 0); if (diff.length === 1) out.push({ a, b, pos: diff[0] }); } return out; })();
  function changeSpec() {
    return { id: 'snd-change', title: '🔁 Change a sound', back: () => go(soundsHome), tip: 'sounds', n: 6, done: sgDone('change'), gen() {
      const s = stage(), pool = s <= 1 ? PAIRS.filter(p => p.pos !== 1) : PAIRS, { a, b, pos } = pick(pool);
      const seen = new Set([a.e, b.e]), others = [];
      for (const o of shuffle(EN_CVC)) { if (others.length >= 2) break; if (o !== a && o !== b && !seen.has(o.e)) { seen.add(o.e); others.push(o); } }
      const nm = ['first', 'middle', 'last'][pos];
      return { prompt: `Change the ${nm} sound <b>${esc(a.s[pos])}</b> to <b>${esc(b.s[pos])}</b>. What's the new word?`,
        say: `This is ${a.w}. Change ${snd(a.s[pos])} to ${snd(b.s[pos])}. What new word do you get?`,
        visual: `<div class="e6-change"><span class="e6-cpic">${a.e}</span>${boxes(a.s, pos)}<span class="e6-carrow">➜</span><span class="e6-cnew">${esc(b.s[pos])}</span></div>`, x: b,
        choices: shuffle([b, ...others]).map(o => ({ html: o.e, val: o.w, say: o.w })), answer: b.w,
        explain: `${a.w}... swap ${snd(a.s[pos])} for ${snd(b.s[pos])}: ${b.s.map(snd).join(', ')}... ${b.w}!` };
    }, onRight(q) { const ex = document.getElementById('exp'); if (ex) ex.innerHTML = `<div class="e6-newword">${q.x.e} <b>${esc(q.x.w)}</b></div>`; } };
  }
  function whereSpec() {
    return { id: 'snd-where', title: '🎯 First, middle, last', back: () => go(soundsHome), tip: 'sounds', n: 6, done: sgDone('where'), gen() {
      const s = stage(), pos = s <= 1 ? pick([0, 2]) : pick([0, 1, 2]), x = pick(EN_CVC), ans = x.s[pos];
      const ch = [...new Set(x.s)]; for (const c of shuffle('bdfgmnpst'.split(''))) { if (ch.length >= 3) break; if (!ch.includes(c)) ch.push(c); }
      const nm = ['first', 'middle', 'last'][pos];
      return { prompt: `What is the <b>${nm}</b> sound in <b>${esc(x.w)}</b>?`, say: `What is the ${nm} sound in ${x.w}? ${x.w}.`,
        visual: `<div class="en-pic">${x.e}</div><div class="e6-slots">${x.s.map((_, i) => `<span class="${i === pos ? 'on' : ''}">${i === pos ? '?' : ''}</span>`).join('')}</div>`, x,
        choices: shuffle(ch).map(c => ({ html: `<span class="e6-gr">${esc(c)}</span>`, val: c, say: snd(c), txt: true })), answer: ans,
        explain: `${x.w}: ${x.s.map(snd).join(', ')}. The ${nm} sound is ${snd(ans)}.` };
    }, onRight(q) { const ex = document.getElementById('exp'); if (ex) ex.innerHTML = boxes(q.x.s); } };
  }
  // Clap the beats: tap the big clap once for each beat, then Done.
  let CL = null;
  function clap() {
    const s = stage(), pool = EN_CLAP.filter(x => x.parts.length <= (s <= 1 ? 3 : 4));
    const list = []; const by = n => shuffle(pool.filter(x => x.parts.length === n));
    for (const n of shuffle([1, 2, 3, s >= 2 ? 4 : 2, 3])) { const x = by(n).find(o => !list.includes(o)); if (x) list.push(x); }
    while (list.length < 5) list.push(pick(pool.filter(o => !list.includes(o))));
    CL = { list: list.slice(0, 5), i: 0, stars: 0, first: 0 }; clapRound();
  }
  function clapRound() { Object.assign(CL, { n: 0, tries: 0, done: false }); drawClap(); say(`Clap the beats in ${CL.list[CL.i].w}. ${CL.list[CL.i].w}.`); }
  function drawClap(msg, show) {
    const x = CL.list[CL.i], nav = navId;
    view.innerHTML = `${crumbs('👏 Clap the beats')}
      <div class="progress">${CL.list.map((_, k) => `<i class="${k < CL.i ? 'done' : k === CL.i ? 'now' : ''}"></i>`).join('')}</div>
      <div class="e6-clapw"><div class="en-pic">${x.e}</div><div class="e6-word" id="cWord">${show ? x.parts.map((p, i) => `<span class="e6-syl" style="animation-delay:${i * 0.45}s">${esc(p)}</span>`).join('<i>·</i>') : esc(x.w)}</div>
        <button class="speak" id="spk" aria-label="Hear the word">🔊</button></div>
      <div class="e6-claps" id="cClaps" aria-live="polite">${CL.n ? '👏'.repeat(CL.n) : '<span class="note">Tap the hands for each beat!</span>'}</div>
      <button class="e6-clapbtn" id="cTap" aria-label="Clap">👏<small>Clap!</small></button>
      <div class="row"><button class="btn alt" id="cReset">↩️ Start over</button><button class="btn leaf" id="cDone">✅ Done (${CL.n})</button></div>
      <div class="cheer" id="cheer" aria-live="polite">${msg || ''}</div>${ptip('sounds')}`;
    wireBack(soundsHome);
    $('#spk').onclick = () => talk([x.w], 0.7);
    $('#cTap').onclick = () => {
      if (CL.done || nav !== navId || CL.n >= 6) return;
      CL.n++; tone([600 + CL.n * 70], 0.06);
      $('#cClaps').innerHTML = '👏'.repeat(CL.n); $('#cDone').textContent = `✅ Done (${CL.n})`;
      const b = $('#cTap'); b.classList.remove('hit'); void b.offsetWidth; b.classList.add('hit');
    };
    $('#cReset').onclick = () => { if (CL.done) return; CL.n = 0; drawClap(); };
    $('#cDone').onclick = () => {
      if (CL.done || nav !== navId) return;
      if (!CL.n) { say('Tap the clapping hands for each beat first!'); return; }
      const want = x.parts.length;
      if (CL.n !== want) {
        CL.tries++; CL.n = 0; oops();
        const m = `Listen: ${x.parts.join(', ')}. That is ${want} beat${want > 1 ? 's' : ''}. Try again!`;
        drawClap(m, true); talk([x.parts.join('... '), `${want} beat${want > 1 ? 's' : ''}`], 0.7); return;
      }
      CL.done = true; const first = CL.tries === 0, earned = first ? 2 : 1; CL.stars += earned; if (first) { CL.first++; questTick('firsttry'); }
      give(earned); yay();
      drawClap(`${first ? 'Perfect beats!' : 'You got it!'} ${'⭐'.repeat(earned)}`, true);
      x.parts.forEach((p, i) => setTimeout(() => { if (nav === navId) tone([700 + i * 90], 0.08); }, i * 450));
      talk([x.parts.join('... ')], 0.7);
      setTimeout(() => {
        if (nav !== navId) return; CL.i++;
        if (CL.i < CL.list.length) { clapRound(); return; }
        const e = E(); e.rounds['snd-clap'] = (e.rounds['snd-clap'] || 0) + 1; e.best['snd-clap'] = Math.max(e.best['snd-clap'] || 0, CL.first); mtick('sound'); save();
        reward('Super clapping!', `You clapped ${CL.list.length} words and earned ${CL.stars} ⭐`, () => go(clap), () => go(soundsHome));
      }, 1500 + x.parts.length * 450);
    };
  }

  /* ===================== Talk time ===================== */
  const PH = Object.fromEntries(EN_PHRASES.map(p => [p[0], p]));
  const KIND = { polite: ['🎩', 'Polite words'], everyday: ['💬', 'Everyday talk'], slang: ['😎', 'Friendly slang'] };
  const cardHTML = p => `<div class="e6-card k-${p[5]}"><span class="e6-ck">${KIND[p[5]][0]} ${KIND[p[5]][1]}</span><span class="e6-ce">${p[2]}</span><b>${esc(p[1])}</b><p>${esc(p[3])}</p><i>“${esc(p[4])}”</i></div>`;
  function talkHome() {
    const e = R3();
    view.innerHTML = `${crumbs('🗣️ Talk time')}
      <div class="en-games"><button class="en-gbtn" id="tkCards">🃏 Phrase cards (${Object.keys(e.cards).length}/${EN_PHRASES.length})</button><button class="en-gbtn" id="tkQuiz">🎯 What does it mean?</button></div>
      <p class="note">Chat with friends! Pick the friendly answer that fits.</p>
      <div class="en-gg">${EN_TALK.map(S => `<button class="en-gt e6-tk${open(S.stage) ? '' : ' locked'}" data-tk="${S.id}"><span class="en-sico">${open(S.stage) ? S.ico : '🔒'}</span><b>${esc(S.name)}</b><small>${S.who[0]} ${esc(S.who[1])}${e.talk[S.id] ? ' · ✅' : ''}${open(S.stage) ? '' : ` · Stage ${S.stage}`}</small></button>`).join('')}</div>${ptip('talk')}`;
    wireBack(englishHome);
    sayScreen('Talk time! Pick a place and chat with a friend.');
    $('#tkCards').onclick = () => go(cards);
    $('#tkQuiz').onclick = () => go(quiz, phraseSpec());
    view.querySelectorAll('[data-tk]').forEach(b => b.onclick = () => { const S = EN_TALK.find(x => x.id === b.dataset.tk); open(S.stage) ? go(chat, S.id) : say(A.lockText(S.stage)); });
  }
  let TK = null;
  function chat(id) {
    const S = EN_TALK.find(x => x.id === id);
    TK = { S, i: 0, log: [], tries: 0, stars: 0, first: 0, wait: false };
    turn();
  }
  const me = () => ({ e: (profileOf(pid) || {}).avatar || '🧒', n: st.name || 'You' });
  function turn() {
    const S = TK.S, T = S.turns[TK.i];
    TK.tries = 0; TK.wait = false; TK.order = shuffle(T[1].map((_, i) => i)); TK.log.push(['them', T[0]]);
    drawChat(); say(`${S.who[1]} says: ${T[0]}`);
  }
  function drawChat(tipTxt, card) {
    const S = TK.S, T = S.turns[TK.i], nav = navId, M = me();
    view.innerHTML = `${crumbs(`${S.ico} ${esc(S.name)}`)}
      <div class="progress">${S.turns.map((_, k) => `<i class="${k < TK.i ? 'done' : k === TK.i ? 'now' : ''}"></i>`).join('')}</div>
      <div class="e6-scene" aria-hidden="true">${S.place}</div>
      <div class="e6-chat" id="tkChat">${TK.log.map(([who, t], i) => `<div class="e6-b ${who}${i === TK.log.length - 1 ? ' new' : ''}"><span class="e6-av">${who === 'them' ? S.who[0] : who === 'owl' ? '🦉' : M.e}</span><p><small>${who === 'them' ? esc(S.who[1]) : who === 'owl' ? 'Owl' : esc(M.n)}</small>${esc(t)}</p></div>`).join('')}</div>
      ${tipTxt ? `<div class="e6-b owl tip"><span class="e6-av">🦉</span><p>${esc(tipTxt)}</p></div>` : ''}
      ${card ? cardHTML(card) : ''}
      <div class="e6-replies" id="tkR">${TK.wait ? `<button class="btn leaf" id="tkNext">${TK.i < S.turns.length - 1 ? 'Next ▶' : 'Finish ⭐'}</button>` : TK.order.map((j, n) => `<button class="e6-reply${(TK.bad || []).includes(j) ? ' wrong' : ''}" data-rp="${j}"${(TK.bad || []).includes(j) ? ' disabled' : ''}><span class="e6-rn">${n + 1}</span>${esc(T[1][j][0])}</button>`).join('')}</div>
      ${TK.wait ? '' : '<div class="row"><button class="btn alt" id="tkHear">🔊 Read the answers</button></div>'}
      <div class="cheer" id="cheer" aria-live="polite"></div>${ptip('talk')}`;
    wireBack(talkHome);
    const ch = $('#tkChat'); try { ch.scrollTop = ch.scrollHeight; } catch (x) {}
    const h = $('#tkHear'); if (h) h.onclick = () => talk(TK.order.map((j, n) => `${n + 1}. ${T[1][j][0]}`), 0.9);
    const nx = $('#tkNext'); if (nx) nx.onclick = () => { if (nav !== navId) return; TK.i++; TK.bad = []; if (TK.i < S.turns.length) turn(); else endChat(); };
    view.querySelectorAll('[data-rp]').forEach(b => b.onclick = () => {
      if (TK.wait || b.disabled || nav !== navId) return;
      const j = +b.dataset.rp, [txt, good, why] = T[1][j];
      if (!good) { TK.tries++; TK.bad = [...(TK.bad || []), j]; oops(); drawChat(why); say(why); return; }
      const first = TK.tries === 0, earned = first ? 2 : 1; TK.stars += earned; if (first) { TK.first++; questTick('firsttry'); }
      give(earned); yay(); TK.wait = true; TK.bad = [];
      TK.log.push(['me', txt]); if (T[2]) TK.log.push(['them', T[2]]);
      const card = T[3] && PH[T[3]]; if (card) { R3().cards[card[0]] = 1; save(); }
      drawChat(why, card);
      $('#cheer').textContent = `${first ? 'Great talking!' : 'Nice!'} ${'⭐'.repeat(earned)}`;
      talk([txt, T[2] ? `${S.who[1]} says: ${T[2]}` : '', card ? `${card[1]} means: ${card[3]}` : ''].filter(Boolean), 0.9);
    });
  }
  function endChat() {
    const S = TK.S, e = R3(); e.talk[S.id] = (e.talk[S.id] || 0) + 1; e.rounds['talk-' + S.id] = (e.rounds['talk-' + S.id] || 0) + 1; e.best['talk-' + S.id] = Math.max(e.best['talk-' + S.id] || 0, TK.first);
    mtick('talk'); save();
    reward('Great chat!', `You chatted with ${S.who[1]} and earned ${TK.stars} ⭐`, () => go(chat, S.id), () => go(talkHome));
  }
  function cards(kind) {
    const e = R3(), K = kind || 'all', list = EN_PHRASES.filter(p => K === 'all' || p[5] === K);
    view.innerHTML = `${crumbs('🃏 Phrase cards')}
      <div class="en-tabs">${[['all', '🌈 All'], ...Object.entries(KIND).map(([k, v]) => [k, `${v[0]} ${v[1]}`])].map(([k, nm]) => `<button class="en-tab${K === k ? ' on' : ''}" data-pk="${k}">${nm}</button>`).join('')}</div>
      <p class="note">Tap a card to flip it and hear what it means. ⭐ cards were collected in Talk time.</p>
      <div class="e6-cards">${list.map(p => `<button class="e6-flip${e.cards[p[0]] ? ' got' : ''}" data-pc="${p[0]}" aria-label="${esc(p[1])}"><span class="e6-front"><span class="e6-ce">${p[2]}</span><b>${esc(p[1])}</b>${e.cards[p[0]] ? '<i>⭐</i>' : ''}</span><span class="e6-back"><b>${esc(p[1])}</b><span>${esc(p[3])}</span></span></button>`).join('')}</div>${ptip('talk')}`;
    wireBack(talkHome);
    sayScreen('Phrase cards. Tap a card to flip it.');
    view.querySelectorAll('[data-pk]').forEach(b => b.onclick = () => go(cards, b.dataset.pk));
    view.querySelectorAll('[data-pc]').forEach(b => b.onclick = () => { const p = PH[b.dataset.pc]; b.classList.toggle('on'); tone([660], 0.05); talk([p[1], `That means: ${p[3]}`, `For example: ${p[4]}`], 0.9); });
  }
  function phraseSpec() {
    return { id: 'phrases', title: '🎯 What does it mean?', back: () => go(talkHome), tip: 'talk', n: 6, gen() {
      const s = stage(), pool = EN_PHRASES.filter(p => s >= 2 || p[5] !== 'slang' || ['awesome', 'cool', 'seeya', 'highfive', 'whatsup', 'noworries'].includes(p[0])), p = pick(pool);
      const wrong = shuffle(EN_PHRASES.filter(o => o[0] !== p[0])).slice(0, 2);
      return { prompt: `What does <b>“${esc(p[1])}”</b> mean?`, say: `What does ${p[1]} mean?`, visual: `<div class="en-pic">${p[2]}</div>`,
        choices: shuffle([p, ...wrong]).map(o => ({ html: esc(o[3]), val: o[0], say: o[3], txt: true })), answer: p[0], explain: `${p[1]} means: ${p[3]} For example: ${p[4]}` };
    }, onRight(q) { R3().cards[q.answer] = 1; } };
  }

  /* ===================== Chapter books ===================== */
  const pagesOf = B => B.chapters.reduce((a, c) => a + c[1].length, 0);
  function booksHome() {
    const e = R3();
    view.innerHTML = `${crumbs('📚 Chapter books')}
      <p class="note">Longer stories in chapters. Tap a <span class="e6-vw sample">blue word</span> to see what it means.</p>
      ${[3, 4, 5].map(s => `<h3 class="section-title">${A.STAGES[s - 1].ico} Stage ${s}: ${A.STAGES[s - 1].name}${open(s) ? '' : ' 🔒'}</h3>
        <div class="e6-shelf">${EN_BOOKS.filter(b => b.stage === s).map(B => { const ch = e.bookCh[B.id] || 0, done = e.books[B.id];
          return `<button class="e6-book${open(s) ? '' : ' locked'}${done ? ' read' : ''}" data-bk="${B.id}"><span class="e6-bcov">${open(s) ? B.ico : '🔒'}</span><b>${esc(B.title)}</b><small>${done ? '✅ read' : `${Math.min(ch, B.chapters.length)}/${B.chapters.length} chapters`}</small></button>`; }).join('')}</div>`).join('')}${ptip('books')}`;
    wireBack(englishHome);
    sayScreen('Chapter books! Pick a book to read.');
    view.querySelectorAll('[data-bk]').forEach(b => b.onclick = () => { const B = EN_BOOKS.find(x => x.id === b.dataset.bk); const ch = e.bookCh[B.id] || 0; open(B.stage) ? go(bookPage, B.id, !e.books[B.id] && ch < B.chapters.length ? ch : 0, 0) : say(A.lockText(B.stage)); });
  }
  const meaning = (B, w) => B.words[w] ? B.words[w] : EN_WORD[w] && EN_WORD[w].m ? [EN_WORD[w].m, EN_WORD[w].e] : null;
  const bookWords = (B, text) => text.split(' ').map(w => { const bare = w.replace(/[^\w'-]/g, '').toLowerCase().replace(/^'|'$/g, ''), m = bare && meaning(B, bare);
    return `<button class="en-tw${m ? ' e6-vw' : ''}" data-bw="${esc(bare)}">${esc(w)}</button>`; }).join(' ');
  function bookPage(id, c, p) {
    const B = EN_BOOKS.find(x => x.id === id), ch = B.chapters[c], pg = ch[1][p], lastP = p === ch[1].length - 1, lastC = c === B.chapters.length - 1, nav = navId;
    view.innerHTML = `${crumbs(`${B.ico} ${esc(B.title)}`)}
      <div class="e6-chaps">${B.chapters.map((x, k) => `<span class="${k < c ? 'done' : k === c ? 'now' : ''}">${k + 1}</span>`).join('')}</div>
      <div class="en-page e6-bpage">${p === 0 ? `<b class="e6-chname">Chapter ${c + 1}: ${esc(ch[0])}</b>` : ''}<div class="e6-bpic" aria-hidden="true">${pg[0]}</div>
        <p class="en-sent e6-btext" id="bkText">${bookWords(B, pg[1])}</p></div>
      <div id="bkPop" aria-live="polite"></div>
      <div class="progress">${ch[1].map((_, k) => `<i class="${k < p ? 'done' : k === p ? 'now' : ''}"></i>`).join('')}</div>
      <div class="row"><button class="btn alt" id="bkPrev"${c || p ? '' : ' disabled'}>◀ Back</button><button class="btn alt" id="bkRead">🔊 Read to me</button><button class="btn leaf" id="bkNext">${lastP ? (lastC ? 'Questions ▶' : 'End of chapter ▶') : 'Next ▶'}</button></div>${ptip('books')}`;
    wireBack(booksHome);
    screenText = pg[1];
    if (p === 0) say(`${c === 0 ? B.title + '. ' : ''}Chapter ${c + 1}: ${ch[0]}.`);
    view.querySelectorAll('[data-bw]').forEach(b => b.onclick = () => {
      view.querySelectorAll('.en-tw.lit').forEach(o => o.classList.remove('lit')); b.classList.add('lit');
      const w = b.dataset.bw, m = meaning(B, w);
      if (!m) { say(w); return; }
      $('#bkPop').innerHTML = `<div class="e6-pop e6-vcard"><span class="e6-ce">${m[1]}</span><span><b>${esc(w)}</b><span>${esc(m[0])}</span></span><button class="e6-x" id="bkX" aria-label="Close">✖</button></div>`;
      $('#bkX').onclick = () => { $('#bkPop').innerHTML = ''; };
      const e = R3(); e.vocab = e.vocab || {}; e.vocab[w] = 1; save();
      talk([w, `${w} means ${m[0]}`], 0.85);
    });
    $('#bkRead').onclick = () => talk([pg[1]], 0.85);
    $('#bkPrev').onclick = () => { if (p) go(bookPage, id, c, p - 1); else if (c) go(bookPage, id, c - 1, B.chapters[c - 1][1].length - 1); };
    $('#bkNext').onclick = () => {
      if (nav !== navId) return;
      if (!lastP) { go(bookPage, id, c, p + 1); return; }
      const e = R3(), fresh = (e.bookCh[id] || 0) < c + 1;
      if (fresh) { e.bookCh[id] = c + 1; give(1); }
      mtick('book'); save();
      if (lastC) { go(quiz, bookQuiz(id)); return; }
      view.innerHTML = `<div class="view done e6-chend"><div class="big e6-bounce" aria-hidden="true">📖✨</div><h1>End of chapter ${c + 1}!</h1>
        <p style="font-weight:800;font-size:22px">${fresh ? 'You earned ⭐ for reading a whole chapter!' : 'Great reading!'}</p>
        <div class="row"><button class="btn leaf" id="bkGo">Chapter ${c + 2}: ${esc(B.chapters[c + 1][0])} ▶</button><button class="btn alt" id="bkShelf">Bookshelf</button></div></div>`;
      if (fresh) { confetti(25); yay(); }
      say(`End of chapter ${c + 1}! ${fresh ? 'You earned a star!' : ''} Next: ${B.chapters[c + 1][0]}.`);
      $('#bkGo').onclick = () => go(bookPage, id, c + 1, 0); $('#bkShelf').onclick = () => go(booksHome);
    };
  }
  const QK = { who: ['🧑', 'Who?'], what: ['❓', 'What?'], where: ['📍', 'Where?'], why: ['🤔', 'Why?'], feel: ['💗', 'Feelings'] };
  function bookQuiz(id) {
    const B = EN_BOOKS.find(x => x.id === id);
    return { id: 'book-' + id, title: `${B.ico} ${esc(B.title)}`, back: () => go(booksHome), tip: 'books',
      list: B.qs.map(([k, q, a, b, c]) => ({ prompt: `<span class="e6-qk k-${k}">${QK[k][0]} ${QK[k][1]}</span> ${esc(q)}`, say: `${q} ${shuffle([a, b, c]).join(', or ')}?`, choices: shuffle([a, b, c]).map(v => ({ html: esc(v), val: v, say: v, txt: true })), answer: a,
        explain: k === 'feel' ? `Think about what happened to them. The answer is: ${a}.` : k === 'why' ? `Look for the reason in the story. The answer is: ${a}.` : `Look back at the story. The answer is: ${a}.` })),
      done(R) { const e = R3(); e.books[id] = Math.max(e.books[id] || 0, R.first + 1); } };
  }

  /* ===================== Grammar islands ===================== */
  const POSK = { noun: 'a noun (a naming word)', verb: 'a verb (a doing word)', adj: 'an adjective (a describing word)' };
  const kindGen = k => () => {
    const x = pick(EN_POS_W.filter(w => w.k === k)), o = shuffle(EN_POS_W.filter(w => w.k !== k)), others = [];
    for (const w of o) { if (others.length >= 2) break; if (w.w !== x.w && w.e !== x.e && !others.some(z => z.k === w.k)) others.push(w); }
    return { prompt: `Which word is ${POSK[k]}?`, say: `Which word is ${POSK[k].replace(/[()]/g, '')}?`, visual: '',
      choices: shuffle([x, ...others]).map(w => ({ html: `<span class="en-ce">${w.e}</span><span>${esc(w.w)}</span>`, val: w.w, say: w.w, txt: true })), answer: x.w,
      explain: `${enCap(x.w)} is ${POSK[k]}. ${k === 'noun' ? 'You can point to it.' : k === 'verb' ? `You can ${x.w}!` : 'It tells you what something is like.'}` };
  };
  const G = id => { const g = EN_GAMES.find(x => x.id === id); return () => g.gen(stage()); };
  const ISLANDS = [
    { id: 'nouns', ico: '🏷️', land: '🌴', name: 'Noun Island', about: 'A noun is a naming word: a person, a place, an animal or a thing. Mom, park, dog and ball are all nouns.', gens: [kindGen('noun'), kindGen('noun'), G('pos')] },
    { id: 'verbs', ico: '🏃', land: '🌋', name: 'Verb Volcano', about: 'A verb is a doing word, an action: run, jump, eat, sing. If you can do it, it is a verb!', gens: [kindGen('verb'), kindGen('verb'), G('pos')] },
    { id: 'adjs', ico: '🎨', land: '🏝️', name: 'Adjective Cove', about: 'An adjective describes a noun: big, red, happy, soft. It tells you what something is like.', gens: [kindGen('adj'), G('opp')] },
    { id: 'plurals', ico: '🔢', land: '🏔️', name: 'Plural Peaks', about: 'Plural means more than one. One cat, two cats. One box, two boxes. Some words change: one mouse, two mice!', gens: [G('plural')] },
    { id: 'tenses', ico: '⏰', land: '🏜️', name: 'Time Travel Bay', about: 'Verbs change with time. Today I jump. Yesterday I jumped. Many add ed, some change: go, went.', gens: [G('past'), G('isare')] },
    { id: 'punct', ico: '❗', land: '🗿', name: 'Punctuation Point', about: 'Punctuation marks help us read: a full stop ends a sentence, ? asks, ! shouts. Capitals start sentences and names.', gens: [G('qs'), G('caps')] },
    { id: 'pronouns', ico: '👤', land: '🛖', name: 'Pronoun Harbor', about: 'Pronouns stand in for names: he, she, it, they, we. Sam is kind. He is kind.', gens: [G('pron')] },
    { id: 'conj', ico: '🔗', land: '🌿', name: 'Joining Jungle', about: 'Joining words (conjunctions) link ideas: and, but, because, so, or.', gens: [G('conj')] },
    { id: 'preps', ico: '📦', land: '🏰', name: 'Preposition Castle', about: 'Prepositions tell where things are: in, on, under, behind, next to, between.', gens: [G('prep')] }
  ];
  const islOpen = i => st.unlockAll || i === 0 || !!(R3().isl[ISLANDS[i - 1].id] || {}).badge;
  const badges = () => ISLANDS.filter(I => (R3().isl[I.id] || {}).badge).length;
  // Island spots on the sea map (percent), in a snake from top left.
  const SPOT = [[18, 15], [50, 15], [82, 15], [82, 50], [50, 50], [18, 50], [18, 85], [50, 85], [82, 85]];
  function islandsHome() {
    const e = R3(), cur = ISLANDS.findIndex((I, i) => islOpen(i) && !(e.isl[I.id] || {}).badge);
    view.innerHTML = `${crumbs('🏝️ Grammar islands')}
      <div class="e6-ihead"><b>🏅 ${badges()} of ${ISLANDS.length} badges</b><span class="note">Win each island's badge to sail to the next one!</span></div>
      <div class="e6-sea"><svg class="e6-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points="${SPOT.map(p => p.join(',')).join(' ')}"/></svg>
        ${ISLANDS.map((I, i) => { const ok = islOpen(i), b = (e.isl[I.id] || {}).badge;
          return `<button class="e6-isl${ok ? '' : ' locked'}${b ? ' won' : ''}${i === cur ? ' cur' : ''}" data-is="${i}" style="left:${SPOT[i][0]}%;top:${SPOT[i][1]}%" aria-label="${esc(I.name)}${ok ? '' : ', locked'}">
            <span class="e6-land">${ok ? I.land : '🌫️'}</span><span class="e6-iico">${ok ? I.ico : '🔒'}</span><b>${esc(I.name)}</b>${b ? '<i class="e6-badge">🏅</i>' : ''}${i === cur ? '<i class="e6-boat">⛵</i>' : ''}</button>`; }).join('')}</div>${ptip('islands')}`;
    wireBack(englishHome);
    sayScreen(`Grammar islands! You have ${badges()} badges.${cur >= 0 ? ` Sail to ${ISLANDS[cur].name}!` : ''}`);
    view.querySelectorAll('[data-is]').forEach(b => b.onclick = () => { const i = +b.dataset.is; islOpen(i) ? go(island, i) : say(`Win the ${ISLANDS[i - 1].name} badge first, then sail here!`); });
  }
  function island(i) {
    const I = ISLANDS[i], r = R3().isl[I.id] || {};
    view.innerHTML = `${crumbs(`${I.land} ${esc(I.name)}`)}
      <div class="e6-ilesson"><span class="e6-iico big">${I.ico}</span><p>${esc(I.about)}</p><button class="speak" id="iAbout" aria-label="Read it">🔊</button></div>
      <p class="note">5 questions. Get 3 right on the first try to win the ${esc(I.name)} badge${r.badge ? ' (you have it! 🏅)' : ''}.</p>
      <div class="row"><button class="btn leaf" id="iGo">⛵ Let's go!</button></div>${ptip('islands')}`;
    wireBack(islandsHome);
    sayScreen(I.about);
    $('#iAbout').onclick = () => say(I.about);
    $('#iGo').onclick = () => go(quiz, islandSpec(i));
  }
  function islandSpec(i) {
    const I = ISLANDS[i];
    return { id: 'isl-' + I.id, title: `${I.land} ${esc(I.name)}`, back: () => go(islandsHome), tip: 'islands', n: 5, gen: () => pick(I.gens)(),
      done(R) {
        const e = R3(), x = e.isl[I.id] = e.isl[I.id] || { n: 0, best: 0 };
        x.n++; x.best = Math.max(x.best, R.first); R.pass = R.first >= 3; R.fresh = R.pass && !x.badge;
        if (R.pass && !x.badge) { x.badge = today(); give(3); R.stars += 3; }
        mtick('island');
      },
      end(R, rw) { islandEnd(i, R, rw); } };
  }
  function islandEnd(i, R, rw) {
    const I = ISLANDS[i], nx = ISLANDS[i + 1], nextOk = nx && islOpen(i + 1);
    view.innerHTML = `<div class="view done e6-iend">${R.pass ? `<div class="e6-medal${R.fresh ? ' new' : ''}" aria-hidden="true"><span>🏅</span><b>${I.ico}</b></div>` : '<div class="big" aria-hidden="true">🌊</div>'}
      <h1>${R.pass ? (R.fresh ? `${esc(I.name)} badge!` : 'Island cleared!') : 'So close!'}</h1>
      <p style="font-weight:800;font-size:22px">You got ${R.first} of ${R.n} on the first try and earned ${R.stars} ⭐${R.fresh ? ' (with 3 badge stars)' : ''}.</p>
      ${R.pass ? (nx ? (nextOk ? `<p class="note">${esc(nx.name)} is open! ⛵</p>` : '') : '<p class="note">You won every island. Grammar captain! 🏴‍☠️</p>') : '<p class="note">Get 3 right on the first try to win the badge. Try again!</p>'}
      <div class="row">${R.pass && nextOk ? `<button class="btn leaf" id="iNext">⛵ ${esc(nx.name)}</button>` : `<button class="btn leaf" id="iAgain">Play again</button>`}<button class="btn alt" id="iMap">🗺️ Map</button><button class="btn alt" id="iPal">📖 Word pal</button></div></div>`;
    if (R.fresh) { confetti(70); tone([523, 659, 784, 1046, 1318], 0.1); } else if (R.pass) yay();
    say(R.pass ? (R.fresh ? `You won the ${I.name} badge! ${nx ? `${nx.name} is open now!` : 'You won every island!'}` : 'Island cleared!') : 'So close! Get 3 right on the first try to win the badge.');
    const n = $('#iNext'); if (n) n.onclick = () => go(island, i + 1);
    const a = $('#iAgain'); if (a) a.onclick = () => go(quiz, islandSpec(i));
    $('#iMap').onclick = () => go(islandsHome);
    $('#iPal').onclick = rw;
  }

  /* ===================== wiring ===================== */
  SECTIONS.push(
    { id: 'write', ico: '✍️', name: 'Write letters', sub: 'Trace ABC, abc and words with your finger', fn: () => writeHome(), c: '#0E7490',
      tip: 'Say the stroke out loud as your child traces ("down, then across"). Start every letter at the green dot; neat comes later.' },
    { id: 'sounds', ico: '🎧', name: 'Sound games', sub: 'Count, swap and clap the sounds in words', fn: () => soundsHome(), c: '#9D174D',
      tip: 'Play these with no letters at all: "What sound does sun start with? Change the s to f, what do you get?" Ears first, eyes later.' },
    { id: 'talk', ico: '🗣️', name: 'Talk time', sub: 'Chat at the shop, park, party and more', fn: () => talkHome(), c: '#4D7C0F',
      tip: 'Act the chats out for real: be the shopkeeper or the doctor and let your child answer. Talk about when slang fits (friends) and when it does not.' },
    { id: 'books', ico: '📚', name: 'Chapter books', sub: `${EN_BOOKS.length} longer stories with tap-for-meaning words`, fn: () => booksHome(), c: '#7C2D12',
      tip: 'One chapter a day is perfect. Ask a why or a feeling question at the end of each chapter: "Why did she do that? How did he feel?"' },
    { id: 'islands', ico: '🏝️', name: 'Grammar islands', get sub() { return `Sail ${ISLANDS.length} islands · ${badges()} badges`; }, fn: () => islandsHome(), c: '#1E3A8A',
      tip: 'Each island is 5 quick questions. Spot the same idea in real life: name the nouns on a walk, act out verbs, describe dinner with adjectives.' },
    { id: 'mission', ico: '🎯', name: 'English mission', hidden: true, fn: () => missionView(), c: '#000',
      tip: 'Three small jobs a day keeps English fun. Finishing mission jobs also counts for the daily quest on the home screen.' }
  );
  // The mission is reached from its strip on the English home, not from a section tile.
  const realSecs = SECTIONS.filter(s => !s.hidden);
  const prevAfter = englishHome.after;
  englishHome.after = v => {
    // Hide the mission entry from the tile grid (it has its own strip).
    v.querySelectorAll('[data-sec="mission"]').forEach(b => b.remove());
    if (prevAfter) prevAfter(v);
    const nx = v.querySelector('#enNext'); if (!nx) return;
    msync();
    const m = mission(), done = m.tasks.filter(t => have(t) >= need(t)).length, box = document.createElement('button');
    box.className = 'e6-mis' + (m.claimed ? ' claimed' : done === 3 ? ' ready' : ''); box.id = 'enMission';
    box.innerHTML = `<span class="e6-mico" aria-hidden="true">🎯</span><span><b>Today's English mission</b>${m.claimed ? '🏆 Complete!' : done === 3 ? '🎁 Prize ready!' : `${done} of 3 jobs done`}</span><span class="e6-mdots">${m.tasks.map(t => have(t) >= need(t) ? '✅' : MJOBS[t.k][0]).join('')}</span>`;
    nx.parentNode.insertBefore(box, nx);
    box.onclick = () => go(missionView);
  };
  Object.assign(VIEWS, { write: writeHome, trace, sounds: soundsHome, count: () => quiz(countSpec()), change: () => quiz(changeSpec()), where: () => quiz(whereSpec()), clap,
    talk: talkHome, chat, cards, phrases: () => quiz(phraseSpec()), books: booksHome, book: bookPage, bookQuiz: id => quiz(bookQuiz(id)), islands: islandsHome, island, islandPlay: i => quiz(islandSpec(i)), mission: missionView });
  const prevMore = englishHome.more;
  englishHome.more = b => { const x = prevMore ? prevMore(b) : b;
    return { ...x, games: x.games + SGAMES.length + ISLANDS.length + 2, letters: UPPER.length + LOWER.length, traceWords: EN_TRACE_WORDS.length, soundGames: SGAMES.length,
      talks: EN_TALK.length, phrases: EN_PHRASES.length, books: EN_BOOKS.length, bookPages: EN_BOOKS.reduce((a, B) => a + pagesOf(B), 0), islands: ISLANDS.length }; };
  // For the grown-ups' report: what round 3 adds, read from any player's saved english state.
  englishHome.round3 = e => {
    const o = v => (v && typeof v === 'object' && !Array.isArray(v) ? v : {}), tr = o(o(e).trace);
    return { traced: Object.keys(o(tr.L)).filter(k => EN_ABC[k]).length, tracedAll: UPPER.length + LOWER.length, words: Object.keys(o(tr.W)).length,
      chats: Object.values(o(o(e).talk)).reduce((a, v) => a + (+v || 0), 0), scenes: Object.keys(o(o(e).talk)).length, scenesAll: EN_TALK.length,
      books: EN_BOOKS.filter(B => o(o(e).books)[B.id]).length, booksAll: EN_BOOKS.length, chapters: Object.values(o(o(e).bookCh)).reduce((a, v) => a + (+v || 0), 0),
      islands: ISLANDS.filter(I => o(o(o(e).isl)[I.id]).badge).length, islandsAll: ISLANDS.length,
      sound: ['snd-count', 'snd-change', 'snd-where', 'snd-clap'].reduce((a, k) => a + (+o(o(e).rounds)[k] || 0), 0), missions: +o(e).missions || 0 };
  };
  if (location.hash === '#selftest' && window.__english) {
    Object.defineProperties(window.__english, Object.getOwnPropertyDescriptors({
      R3, mission, mDone, mtick, layout, countSpec, changeSpec, whereSpec, phraseSpec, bookQuiz, islandSpec, ISLANDS, PAIRS, SGAMES, realSecs,
      get TR() { return TR; }, get CL() { return CL; }, get TK() { return TK; }
    }));
    Object.assign(window.__english.data, { EN_ABC, EN_TRACE_WORDS, EN_PHON, EN_CVC, EN_CLAP, EN_PHRASES, EN_TALK, EN_BOOKS });
  }
})();
