/* ---------- play time: minutes per player per day, wiggle breaks and a gentle daily limit ---------- */
// Everything is off until a grown-up picks a limit or a break in the Grown-ups corner, so nothing changes for
// existing families. Minutes are counted only while the page is on screen and the child touched it in the last
// 2 minutes. Each player's minutes live in their state (st.pt.min, last 14 days) and in a small shared key
// (pt:<id>) that every open tab adds to, so two tabs never count the same seconds twice.
// Automated runs (#selftest or a webdriver) leave the timer off unless window.__owlTimerForce is set; tests then
// drive a fast clock with window.__timer.tick(ms) (and set window.__owlTimerManual to stop real-time counting).
const timer = (() => {
  const TICK = 15000, IDLE = 120000, DEFER = 60000, SETTLE = 2500, BREAK_S = 20, WARN_S = 120;
  const LIMITS = [0, 15, 20, 30, 45, 60], BREAKS = [0, 10, 15, 20];
  const IDEAS = ['Reach up high, like owl wings! 🙆', 'Blink your eyes slowly, 10 times. 👀', 'Turn your head like an owl: left, then right. 🦉', 'Look far away, out of a window. 🪟', 'Wiggle your fingers and toes! 🖐️', 'Roll your shoulders round and round. 🔄'];
  const on = () => !!(window.__owlTimerForce || !(location.hash === '#selftest' || navigator.webdriver));
  let skew = 0; const now = () => Date.now() + skew;
  let lastInput = now(), lastLocal = now(), ov = null, pend = null, touchedPad = null;

  const ptOf = s => { s.pt = Object.assign({ limit: 0, brk: 0, min: {}, ext: null, off: '', bk: null, warn: '' }, s.pt || {}); return s.pt; };
  const stateOf = id => id === pid ? st : store.get('state:' + id, null) || {};
  const shared = id => { const x = store.get('pt:' + id, null); return x && x.min ? x : { last: 0, min: {} }; };
  const daySecs = (id, d, s = stateOf(id)) => Math.max(shared(id).min[d] || 0, (s.pt && s.pt.min && s.pt.min[d]) || 0);
  const prune = m => { Object.keys(m).sort().slice(0, -14).forEach(k => delete m[k]); return m; };
  const allowed = p => !p.limit || p.off === today() ? null : p.limit * 60 + (p.ext && p.ext.d === today() ? p.ext.s : 0);
  const visible = () => document.visibilityState !== 'hidden';
  const grownup = () => !!view.querySelector('#gf, #wtInside, .wt-stats, #ptPanel');
  const counting = () => on() && visible() && now() - lastInput <= IDLE && !ov && !grownup();

  /* --- counting: one tick about every 15 s adds the time since the last tick in any tab, never more than 15 s --- */
  function step() {
    const t = now(), sh = shared(pid);
    if (sh.last > t + 1000) sh.last = 0; // a clock that went backwards
    const dt = Math.max(0, Math.min(TICK, t - Math.max(lastLocal, sh.last || 0)));
    lastLocal = t;
    if (!counting() || !dt) return;
    const d = today(), p = ptOf(st), secs = Math.round(Math.max(sh.min[d] || 0, p.min[d] || 0) + dt / 1000);
    sh.min[d] = p.min[d] = secs; sh.last = t;
    prune(sh.min); prune(p.min);
    store.set('pt:' + pid, sh); save();
  }

  /* --- what to show: the limit screen, Owl's heads-up, or a wiggle break when the moment is right --- */
  const MENU = '#tMath, .worlds, .skills, .cats, .lessons, .tools-row, .gtiles, .numgrid, .cb-grid, .sp-grid, .sq-map, .gallery, .pet-card, .badges, .wears, .view.done';
  const calm = () => !!view.querySelector(MENU) && !view.querySelector('.choice:not(:disabled):not(.right):not(.gone)');
  // Something that changes when a question or step is answered: stars, a right answer, the step number, the progress dots.
  const sig = () => [st.stars, view.querySelectorAll('.right, .ok, .progress .done').length, (view.querySelector('#sn') || {}).textContent].join('|');
  function check() {
    if (!on() || !st) return;
    const p = ptOf(st), d = today(), s = daySecs(pid, d), allow = allowed(p);
    if (ov && ov.kind === 'limit') { if (ov.pid !== pid || allow == null || s < allow) close(); return; }
    if (grownup() || view.querySelector('.who')) return;
    if (allow != null && s >= allow) { pend = null; showLimit(); return; }
    if (allow != null && s >= allow - WARN_S && p.warn !== d + '|' + allow) {
      p.warn = d + '|' + allow; save();
      const m = Math.max(1, Math.ceil((allow - s) / 60)), text = `🦉 ${m} more minute${m > 1 ? 's' : ''} of play today. Let's finish up!`;
      toast(text); say(text);
    }
    if (ov || !p.brk) { if (!p.brk) pend = null; return; }
    const base = p.bk && p.bk.d === d ? p.bk.s : 0;
    if (s - base < p.brk * 60) { pend = null; return; }
    const t = now();
    if (!pend || pend.pid !== pid) pend = { pid, t, sig: sig(), ans: 0 };
    if (!pend.ans && sig() !== pend.sig) pend.ans = t;
    if (document.querySelector('.wt') && t - pend.t < DEFER) return; // the welcome tour is open
    if (calm() || (pend.ans && t - pend.ans >= SETTLE) || t - pend.t >= DEFER) { p.bk = { d, s }; save(); pend = null; showBreak(); }
  }

  /* --- the full-screen cards --- */
  function open(kind, html) {
    close();
    const root = document.createElement('div');
    root.className = `pt-ov pt-${kind}`; root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-labelledby', 'ptT');
    root.innerHTML = `<div class="pt-card">${html}</div>`;
    document.body.appendChild(root);
    const app = document.getElementById('app'); if (app) app.inert = true;
    try { speechSynthesis.cancel(); } catch (e) {}
    ov = { kind, root, pid, q: s => root.querySelector(s) };
    return ov;
  }
  function close() {
    if (!ov) return;
    clearInterval(ov.iv); ov.root.remove(); ov = null;
    const app = document.getElementById('app'); if (app) app.inert = false;
    lastInput = lastLocal = now();
  }

  function showBreak() {
    const o = open('break', `<div class="pt-owl" aria-hidden="true">🦉</div>
      <h2 id="ptT">Time for a wiggle break!</h2><p class="pt-big">Stand up and stretch like an owl 🦉</p>
      <div class="pt-ring" role="timer" aria-label="Seconds left"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" class="pt-track"/><circle cx="60" cy="60" r="52" class="pt-arc" id="ptArc"/></svg><b id="ptN">${BREAK_S}</b></div>
      <p class="pt-idea" id="ptIdea" aria-live="polite"></p>
      <button class="pt-btn" id="ptBack" hidden>I'm back! 👋</button>`);
    const ideas = shuffle(IDEAS).slice(0, 4), t0 = now(), C = 2 * Math.PI * 52;
    let shown = -1, finished = false;
    o.render = () => {
      const gone = (now() - t0) / 1000, left = Math.max(0, Math.ceil(BREAK_S - gone)), k = Math.min(ideas.length - 1, Math.floor(gone / (BREAK_S / ideas.length)));
      o.q('#ptN').textContent = left;
      o.q('#ptArc').style.strokeDashoffset = (C * Math.min(1, gone / BREAK_S)).toFixed(1);
      if (!finished && k !== shown) { shown = k; o.q('#ptIdea').textContent = ideas[k]; if (k) say(ideas[k]); }
      if (!finished && left === 0) {
        finished = true; clearInterval(o.iv); o.root.classList.add('pt-fin');
        o.q('#ptIdea').textContent = 'Great wiggling! 🎉'; o.q('#ptBack').hidden = false;
        try { o.q('#ptBack').focus({ preventScroll: true }); } catch (e) {}
        yay(); say("Great wiggling! Tap I'm back when you are ready.");
      }
    };
    o.q('#ptArc').style.strokeDasharray = C.toFixed(1);
    o.q('#ptBack').onclick = () => { close(); tone([660, 880]); };
    o.render(); o.iv = setInterval(() => ov === o && o.render(), 250);
    say(`Time for a wiggle break! Stand up and stretch like an owl. ${ideas[0]}`);
  }

  function showLimit() {
    // Keep the child's drawing: save the pad on screen to My pictures first, if it has new strokes.
    let saved = false;
    if (livePad && livePad.cv && livePad.cv.isConnected && livePad.drawn() && touchedPad === livePad.cv) { try { livePad.save(false); saved = true; touchedPad = null; } catch (e) {} }
    const x = st.days[today()] || {}, chip = (ico, n, w) => n ? `<span class="pt-chip">${ico} <b>${n}</b> ${w}${n === 1 ? '' : 's'}</span>` : '';
    const chips = chip('⭐', x.stars || 0, 'star') + chip('🔢', x.q || 0, 'question') + chip('🖍️', x.art || 0, 'drawing');
    const o = open('limit', `<div class="pt-pet" aria-hidden="true">${petHTML(96, 'bounce')}<span class="pt-moon">🌙</span></div>
      <h2 id="ptT">All done for today!</h2><p class="pt-big">See you tomorrow 🌙</p>
      <p class="pt-sum">${chips ? `Today ${esc(st.name || 'you')} earned:` : `${esc(st.pet.name)} is getting sleepy too.`}</p>${chips ? `<div class="pt-chips">${chips}</div>` : ''}
      ${saved ? '<p class="pt-sum">🖼️ Your drawing is saved in My pictures.</p>' : ''}
      <div id="ptGate" class="pt-gate"><button class="pt-btn pt-alt" id="ptGrown">For grown-ups</button></div>`);
    const toGate = () => {
      gate(() => {
        o.q('#ptGate').innerHTML = `<p class="pt-sum">Grown-ups: give a little more time?</p><div class="pt-row"><button class="pt-btn" id="ptMore">+10 minutes</button><button class="pt-btn pt-alt" id="ptOff">Turn off for today</button></div><button class="small-link" id="ptStay">Keep resting</button>`;
        o.q('#ptMore').onclick = () => { const p = ptOf(st), d = today(), s = daySecs(pid, d), a = allowed(p) || 0; p.ext = { d, s: (p.ext && p.ext.d === d ? p.ext.s : 0) + Math.max(0, s - a) + 600 }; save(); close(); toast('10 more minutes! ⏰'); say('Ten more minutes. Have fun!'); };
        o.q('#ptOff').onclick = () => { ptOf(st).off = today(); save(); close(); toast('Play time limit is off for today.'); };
        o.q('#ptStay').onclick = () => { o.q('#ptGate').innerHTML = '<button class="pt-btn pt-alt" id="ptGrown">For grown-ups</button>'; o.q('#ptGrown').onclick = toGate; };
        try { o.q('#ptMore').focus({ preventScroll: true }); } catch (e) {}
      }, o.q('#ptGate'));
      const ga = o.q('#ga'); if (ga) try { ga.focus({ preventScroll: true }); } catch (e) {}
    };
    o.q('#ptGrown').onclick = toGate;
    try { o.q('#ptGrown').focus({ preventScroll: true }); } catch (e) {}
    say(`All done for today! See you tomorrow.${x.stars ? ` You earned ${x.stars} stars today.` : ''}${saved ? ' Your drawing is saved.' : ''}`);
  }

  /* --- Grown-ups corner --- */
  const days7 = () => Array.from({ length: 7 }, (_, i) => { const t = new Date(); t.setDate(t.getDate() - 6 + i); const d = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); return [d, t.toLocaleDateString('en', { weekday: 'short' }), i === 6]; });
  const opt = (vals, cur, fmt) => vals.map(v => `<option value="${v}"${v === cur ? ' selected' : ''}>${fmt(v)}</option>`).join('');
  function chart(id, s, p) {
    const ds = days7().map(([d, w, now]) => [Math.floor(daySecs(id, d, s) / 60), w, now]), H = 84;
    const max = Math.max(10, p.limit, ...ds.map(x => x[0])), tot = ds.reduce((a, x) => a + x[0], 0);
    return `<div class="pt-chart" role="img" aria-label="Minutes played, last 7 days: ${ds.map(([m, w, n]) => `${n ? 'today' : w} ${m}`).join(', ')}${p.limit ? `. Daily limit ${p.limit} minutes` : ''}.">
      <div class="pt-bars">${p.limit ? `<span class="pt-lim" style="bottom:${Math.round(p.limit / max * H)}px"></span>` : ''}${ds.map(([m, , n]) => `<div class="pt-col${n ? ' now' : ''}"><b>${m}</b><i style="height:${Math.max(m ? 3 : 0, Math.round(m / max * H))}px"></i></div>`).join('')}</div>
      <div class="pt-days" aria-hidden="true">${ds.map(([, w, n]) => `<span>${n ? 'Today' : w}</span>`).join('')}</div></div>
      <p class="note">${tot} min in the last 7 days${tot ? `, about ${Math.round(tot / 7)} min a day` : ''}.</p>`;
  }
  function row(pr) {
    const s = stateOf(pr.id), p = ptOf(JSON.parse(JSON.stringify({ pt: s.pt || {} }))), d = today(), m = Math.floor(daySecs(pr.id, d, s) / 60), a = allowed(p);
    const extra = p.off === d ? ' · limit off today' : p.ext && p.ext.d === d ? ` · +${Math.round(p.ext.s / 60)} min added today` : '';
    return `<div class="pt-player" data-pp="${pr.id}"><div class="pt-ph"><span class="pa" aria-hidden="true">${pr.avatar}</span><b>${esc(nameOf(pr.id))}</b>
        <span class="pt-today">Played today: <b>${m} min</b>${a != null ? ` of ${Math.round(a / 60)}` : ''}${extra}</span></div>
      <div class="pt-sets"><label class="field pt-f">Daily limit<select data-lim="${pr.id}">${opt(LIMITS, p.limit, v => v ? v + ' min' : 'Off')}</select></label>
        <label class="field pt-f">Break reminder<select data-brk="${pr.id}">${opt(BREAKS, p.brk, v => v ? `Every ${v} min` : 'Off')}</select></label></div>
      ${chart(pr.id, s, p)}</div>`;
  }
  function panel() {
    const rows = profiles.map(row).join('');
    return `<div class="panel pt-gp" id="ptPanel"><h2>⏰ Play time</h2><p class="note">Minutes count only while the app is on screen and your child has tapped in the last 2 minutes. A break reminder brings a 20-second wiggle break with Owl (after the current question). At the daily limit Owl says goodnight, with a heads-up 2 minutes before; drawings in progress are saved first. Only a grown-up can add time. Both are off unless you choose them.</p>
      ${rows}<p class="note" id="ptMsg" aria-live="polite"></p></div>`;
  }
  function wire() {
    const set = (id, k, v) => {
      if (id === pid) { ptOf(st)[k] = v; save(); }
      else { const s = store.get('state:' + id, null); if (!s) return; ptOf(s)[k] = v; store.set('state:' + id, s); }
      const box = view.querySelector(`[data-pp="${id}"]`), m = $('#ptMsg'), pr = profileOf(id);
      if (box && pr) { box.outerHTML = row(pr); wire(); const el = view.querySelector(`[data-${k === 'limit' ? 'lim' : 'brk'}="${id}"]`); try { el.focus({ preventScroll: true }); } catch (e) {} }
      if (m) m.textContent = `Saved for ${nameOf(id)}: ${k === 'limit' ? (v ? `daily limit ${v} minutes` : 'no daily limit') : v ? `a wiggle break every ${v} minutes` : 'no break reminders'}.`;
    };
    view.querySelectorAll('[data-lim]').forEach(el => el.onchange = () => set(el.dataset.lim, 'limit', +el.value));
    view.querySelectorAll('[data-brk]').forEach(el => el.onchange = () => set(el.dataset.brk, 'brk', +el.value));
  }

  /* --- wiring --- */
  const poke = e => { lastInput = now(); if (e && e.type === 'pointerdown' && livePad && e.target === livePad.cv) touchedPad = e.target; };
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(t => addEventListener(t, poke, { capture: true, passive: true }));
  document.addEventListener('visibilitychange', () => { lastLocal = now(); });
  setTimeout(() => {
    lastInput = lastLocal = now();
    setInterval(() => { if (!window.__owlTimerManual) step(); check(); }, TICK);
    setInterval(check, 1000);
    check();
  }, 0);

  if (location.hash === '#selftest') window.__timer = {
    // Moves the fast clock forward in 15 s ticks. With active, the child "taps" before each tick.
    tick(ms, active = false) { while (ms > 0) { const d = Math.min(TICK, ms); ms -= d; skew += d; if (active) lastInput = now(); step(); check(); if (ov && ov.render) ov.render(); } return this.status; },
    get status() {
      const p = ptOf(st), d = today(), secs = daySecs(pid, d), a = allowed(p);
      return { pid, secs, allowed: a, limit: p.limit, brk: p.brk, overlay: ov ? ov.kind : null, pending: !!pend, idle: now() - lastInput,
        breakIn: p.brk ? p.brk * 60 - (secs - (p.bk && p.bk.d === d ? p.bk.s : 0)) : null, limitIn: a == null ? null : a - secs };
    },
    check, step, daySecs, get on() { return on(); }, get skew() { return skew; }, set skew(v) { skew = v; }
  };
  return { panel, wire };
})();
