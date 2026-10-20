/* ---------- players: each child has their own saved progress and pictures ---------- */
const AVATARS = ['🦊', '🐼', '🐯', '🐸', '🦄', '🐙', '🐵', '🐨', '🐰', '🦁', '🐳', '🐞'];
function migrate(s) {
  for (const k in MATH) if (!s.skills[k]) s.skills[k] = { m: startMastery(k, s.age), seen: 0, hist: [], ms: 0 };
  s.art = s.art || { done: {}, pixel: 1, pixelDone: {} };
  s.review = (s.review || []).filter(r => MATH[r.skill]);
  s.pet = s.pet || { xp: Math.min(s.stars || 0, 150), wear: '', name: 'Hoot', seen: null };
  s.bestStreak = Math.max(s.bestStreak || 0, s.streak.n);
  s.questsDone = s.questsDone || 0;
  s.days = s.days || {};
  return s;
}
let profiles = store.get('profiles', null);
if (!profiles) {
  // First run of this version: the single saved child becomes player 1.
  const old = store.get('state', null);
  profiles = [{ id: 'p1', avatar: '🦊' }];
  if (old) { store.set('state:p1', old); store.set('gallery:p1', store.get('gallery', [])); }
  store.set('profiles', profiles);
}
let pid = store.get('current', profiles[0].id);
if (!profiles.some(p => p.id === pid)) pid = profiles[0].id;
let st, gallery;
function loadProfile(id) { pid = id; store.set('current', id); st = migrate(store.get('state:' + id, null) || freshState()); gallery = store.get('gallery:' + id, []); }
loadProfile(pid);
const save = () => store.set('state:' + pid, st);
const saveGallery = () => store.set('gallery:' + pid, gallery);
const profileOf = id => profiles.find(p => p.id === id);
const nameOf = id => (id === pid ? st : store.get('state:' + id, null) || {}).name || 'Player';
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {}); } catch (e) {}

/* ---------- little pop-up messages ---------- */
function toast(text) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
  t.textContent = text; t.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ---------- read-the-screen button ---------- */
let screenText = '';
function sayScreen(text) { screenText = text; say(text); }

/* ---------- the owl pet grows with every star ---------- */
const PET_STAGES = [[0, '🥚', 'Egg'], [25, '🐣', 'Hatchling'], [80, '🐥', 'Chick'], [200, '🦉', 'Owlet'], [450, '🦉', 'Wise Owl'], [900, '🦉', 'Super Owl']];
const petStage = xp => PET_STAGES.reduce((s, p, i) => xp >= p[0] ? i : s, 0);
const WEARS = [
  { e: '🎀', need: 'stage', v: 2, label: 'Grow into a Chick' },
  { e: '🕶️', need: 'streak', v: 3, label: 'Play 3 days in a row' },
  { e: '🎩', need: 'stage', v: 3, label: 'Grow into an Owlet' },
  { e: '🌟', need: 'quests', v: 5, label: 'Finish 5 daily quests' },
  { e: '👑', need: 'streak', v: 7, label: 'Play 7 days in a row' },
  { e: '🎓', need: 'stage', v: 4, label: 'Grow into a Wise Owl' },
  { e: '🚀', need: 'streak', v: 14, label: 'Play 14 days in a row' },
  { e: '🌈', need: 'stage', v: 5, label: 'Grow into a Super Owl' },
  { e: '🏆', need: 'quests', v: 30, label: 'Finish 30 daily quests' }
];
const wearOpen = w => w.need === 'stage' ? petStage(st.pet.xp) >= w.v : w.need === 'streak' ? st.bestStreak >= w.v : st.questsDone >= w.v;
const petHTML = (size, cls = '') => { const s = PET_STAGES[petStage(st.pet.xp)]; return `<span class="pet ${cls}" style="font-size:${size}px">${s[1]}${petStage(st.pet.xp) >= 5 ? '<b class="sparkle">✨</b>' : ''}${st.pet.wear ? `<i>${st.pet.wear}</i>` : ''}</span>`; };
function gainXP(n) {
  const before = petStage(st.pet.xp), openBefore = WEARS.filter(wearOpen).length;
  st.pet.xp += n;
  const after = petStage(st.pet.xp);
  if (after > before) { toast(`${st.pet.name} grew into a ${PET_STAGES[after][2]}! ${PET_STAGES[after][1]}`); confetti(30); }
  if (WEARS.filter(wearOpen).length > openBefore) setTimeout(() => toast('New outfit for your owl! Tap your owl to try it on.'), after > before ? 3400 : 0);
}
function petView() {
  const i = petStage(st.pet.xp), next = PET_STAGES[i + 1];
  const pct = next ? Math.round((st.pet.xp - PET_STAGES[i][0]) / (next[0] - PET_STAGES[i][0]) * 100) : 100;
  view.innerHTML = `${crumbs('My owl')}
    <div class="pet-card">${petHTML(140, 'bounce')}
      <h2>${esc(st.pet.name)} the ${PET_STAGES[i][2]}</h2>
      <div class="bar big-bar" aria-label="${pct}% grown"><i style="width:${pct}%"></i></div>
      <p class="note">${next ? `${next[0] - st.pet.xp} more stars until ${st.pet.name} grows into a ${next[2]}!` : `${st.pet.name} is fully grown. Amazing!`}</p></div>
    <h3 class="section-title">Dress up</h3>
    <div class="wears"><button class="wear${st.pet.wear ? '' : ' on'}" data-wear="">None</button>${WEARS.map(w => wearOpen(w)
      ? `<button class="wear${st.pet.wear === w.e ? ' on' : ''}" data-wear="${w.e}">${w.e}</button>`
      : `<button class="wear locked" data-lock="${esc(w.label)}" aria-label="Locked: ${esc(w.label)}">🔒<small>${esc(w.label)}</small></button>`).join('')}</div>
    <h3 class="section-title">Name</h3>
    <div class="chips">${['Hoot', 'Pip', 'Luna', 'Sky', 'Mochi', 'Ziggy', 'Coco', 'Biscuit'].map(n => `<button data-name="${n}"${st.pet.name === n ? ' style="background:var(--grape);color:#fff"' : ''}>${n}</button>`).join('')}</div>`;
  wireBack(home);
  sayScreen(`This is ${st.pet.name} the ${PET_STAGES[i][2]}. ${next ? `Earn ${next[0] - st.pet.xp} more stars to help ${st.pet.name} grow!` : 'Fully grown!'}`);
  view.querySelectorAll('[data-wear]').forEach(b => b.onclick = () => { st.pet.wear = b.dataset.wear; save(); tone([660, 880]); go(petView); });
  view.querySelectorAll('[data-lock]').forEach(b => b.onclick = () => say(b.dataset.lock + ' to unlock this.'));
  view.querySelectorAll('[data-name]').forEach(b => b.onclick = () => { st.pet.name = b.dataset.name; save(); go(petView); });
}

/* ---------- daily quest: 3 small jobs a day, then a treasure chest ---------- */
function quest() {
  const d = today();
  if (!st.quest || st.quest.day !== d) {
    const n = dayNum(d), mathN = st.age <= 6 ? 5 : 8;
    const artJobs = [['art', 1, 'Finish an art lesson or save a drawing', '🖍️'], ['pixel', 1, 'Finish a pixel picture', '👾'], ['mix', 1, 'Make a new color in Mix colors', '🎨'], ['art', 1, 'Finish an art lesson or save a drawing', '🖍️']];
    const extra = dueReviews().length >= 2 ? ['review', 2, 'Practise 2 old questions', '🔁'] : [['owl', 1, 'Ask Owl a question', '🦉'], ['firsttry', 3, 'Get 3 right on the first try', '🎯']][n % 2];
    st.quest = { day: d, claimed: false, tasks: [['math', mathN, `Answer ${mathN} math questions`, '🔢'], artJobs[n % artJobs.length], extra].map(([k, need, t, ico]) => ({ k, need, t, ico, have: 0 })) };
    save();
  }
  return st.quest;
}
function questTick(k, by = 1) {
  const q = quest();
  q.tasks.forEach(t => { if (t.k === k && t.have < t.need) { t.have = Math.min(t.need, t.have + by); if (t.have === t.need) setTimeout(() => toast(`Quest job done: ${t.t}! ✅`), 400); } });
  save();
}
const questDone = q => q.tasks.every(t => t.have >= t.need);
function questCard() {
  const q = quest(), done = questDone(q);
  return `<div class="quest"><div class="quest-head"><b>Today's quest</b><span>${q.tasks.filter(t => t.have >= t.need).length} of 3</span></div>
    ${q.tasks.map((t, i) => `<button class="qtask${t.have >= t.need ? ' ok' : ''}" data-task="${i}"><span class="ico">${t.have >= t.need ? '✅' : t.ico}</span><span class="qt">${t.t}</span><span class="qn">${Math.min(t.have, t.need)}/${t.need}</span></button>`).join('')}
    ${q.claimed ? '<p class="note">Treasure opened! Come back tomorrow for a new quest.</p>' : `<button class="chest${done ? ' ready' : ''}" id="chest" ${done ? '' : 'aria-disabled="true"'}>${done ? '🎁 Open the treasure chest!' : '🔒 Finish all 3 to open the treasure chest'}</button>`}</div>`;
}
function wireQuest() {
  const q = quest();
  view.querySelectorAll('[data-task]').forEach(b => b.onclick = () => {
    const t = q.tasks[+b.dataset.task];
    ({ math: () => go(mathHome), firsttry: () => go(mathHome), review: () => go(play, 'review'), art: () => go(artHome), pixel: () => go(pixelHome), mix: () => go(mixTab), owl: () => go(owl) })[t.k]();
  });
  const c = document.getElementById('chest');
  if (c) c.onclick = () => {
    if (!questDone(q)) { say('Finish all 3 quest jobs to open the treasure chest!'); return; }
    q.claimed = true; st.questsDone++; addStars(5); gainXP(25); save(); confetti(60); yay();
    say(`You opened the treasure chest! 5 bonus stars, and ${st.pet.name} loves it!`); toast('Treasure! +5 ⭐');
    go(home);
  };
}

/* ---------- who's playing ---------- */
function whoView() {
  view.innerHTML = `<h1 style="font-size:40px;text-align:center">Who's playing?</h1>
    <div class="who">${profiles.map(p => `<button class="who-btn${p.id === pid ? ' on' : ''}" data-p="${p.id}"><span>${p.avatar}</span><b>${esc(nameOf(p.id))}</b></button>`).join('')}</div>
    <div class="row"><button class="small-link" id="addP">Grown-ups: add a player</button></div>`;
  sayScreen("Who's playing? Tap your picture.");
  view.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { loadProfile(b.dataset.p); updateTop(); go(home); });
  $('#addP').onclick = () => go(gate);
}
function playersPanel() {
  return `<div class="panel"><h2>Players</h2><p class="note">Each child gets their own progress, owl and pictures. The animal button at the top switches players.</p>
    <div class="players">${profiles.map(p => `<div class="player"><span class="pa">${p.avatar}</span><b>${esc(nameOf(p.id))}</b><span class="note">age ${(p.id === pid ? st : store.get('state:' + p.id, null) || {}).age || '?'}${p.id === pid ? ' · playing now' : ''}</span>
      ${p.id === pid ? '' : `<button class="btn alt sm" data-switch="${p.id}">Switch</button>`}${profiles.length > 1 ? `<button class="btn alt sm" data-del="${p.id}">Remove</button>` : ''}</div>`).join('')}</div>
    <form id="addForm" class="add-player"><label class="field" for="npn">New player's name<input id="npn" autocomplete="off" required></label>
      <label class="field" for="npa">Age<input id="npa" type="number" min="3" max="16" value="5"></label>
      <div class="avatars" role="group" aria-label="Picture">${AVATARS.map((a, i) => `<button type="button" class="av${i === profiles.length % AVATARS.length ? ' on' : ''}" data-av="${a}">${a}</button>`).join('')}</div>
      <button class="btn leaf" type="submit">Add player</button></form></div>
  <div class="panel"><h2>Backup</h2><p class="note">Progress is saved on this tablet only. Save a backup file now and then (for example to Files or Google Drive), so nothing is lost if the browser is cleared or you get a new tablet.</p>
    <div class="row" style="justify-content:flex-start"><button class="btn" id="bk">Save a backup file</button><label class="btn alt" for="rs" style="cursor:pointer">Restore from a backup<input id="rs" type="file" accept="application/json,.json" hidden></label></div><p class="note" id="bkm" aria-live="polite"></p></div>`;
}
function wirePlayers() {
  let av = view.querySelector('.av.on')?.dataset.av || AVATARS[0];
  view.querySelectorAll('[data-av]').forEach(b => b.onclick = () => { av = b.dataset.av; view.querySelectorAll('[data-av]').forEach(x => x.classList.toggle('on', x === b)); });
  view.querySelectorAll('[data-switch]').forEach(b => b.onclick = () => { loadProfile(b.dataset.switch); updateTop(); go(parent); });
  view.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
    if (b.dataset.armed !== '1') { b.dataset.armed = '1'; b.textContent = 'Tap again to remove'; return; }
    const id = b.dataset.del; profiles = profiles.filter(p => p.id !== id); store.set('profiles', profiles);
    try { localStorage.removeItem('owlcrayon:state:' + id); localStorage.removeItem('owlcrayon:gallery:' + id); } catch (e) {}
    if (id === pid) loadProfile(profiles[0].id); updateTop(); go(parent);
  });
  $('#addForm').onsubmit = e => {
    e.preventDefault();
    const id = 'p' + Date.now().toString(36), s = freshState(clamp(+$('#npa').value || 5, 3, 16)); s.name = $('#npn').value.trim().slice(0, 20);
    profiles.push({ id, avatar: av }); store.set('profiles', profiles); store.set('state:' + id, migrate(s)); store.set('gallery:' + id, []);
    go(parent); toast(`${s.name || 'New player'} added!`);
  };
  $('#bk').onclick = () => {
    const data = { app: 'owl-crayon', v: 1, saved: new Date().toISOString(), profiles, current: pid, states: {}, galleries: {} };
    save(); saveGallery();
    profiles.forEach(p => { data.states[p.id] = store.get('state:' + p.id, null); data.galleries[p.id] = store.get('gallery:' + p.id, []); });
    try {
      const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' })), a = document.createElement('a');
      a.href = url; a.download = `owl-crayon-backup-${today()}.json`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 5000);
      $('#bkm').textContent = 'Backup file saved. Keep it somewhere safe.';
    } catch (e) { $('#bkm').textContent = 'This browser could not save the file. Try opening the app from the Home Screen icon.'; }
  };
  $('#rs').onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    f.text().then(txt => {
      const d = JSON.parse(txt);
      if (d.app !== 'owl-crayon' || !Array.isArray(d.profiles)) throw new Error('not a backup');
      profiles = d.profiles; store.set('profiles', profiles);
      profiles.forEach(p => { if (d.states[p.id]) store.set('state:' + p.id, d.states[p.id]); store.set('gallery:' + p.id, d.galleries[p.id] || []); });
      loadProfile(profiles.some(p => p.id === d.current) ? d.current : profiles[0].id); updateTop();
      go(parent); toast('Backup restored!');
    }).catch(() => { $('#bkm').textContent = 'That file is not an Owl & Crayon backup. Pick the file that starts with owl-crayon-backup.'; });
  };
}

/* ---------- daily activity log for the grown-ups' weekly summary ---------- */
function dayLog(k, n = 1) {
  const d = today(), x = st.days[d] = st.days[d] || { q: 0, ok: 0, stars: 0, art: 0 };
  x[k] = (x[k] || 0) + n;
  const keep = Object.keys(st.days).sort().slice(-60); for (const key in st.days) if (!keep.includes(key)) delete st.days[key];
}
function weekPanel() {
  const days = Array.from({ length: 7 }, (_, i) => { const t = new Date(); t.setDate(t.getDate() - 6 + i); const d = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); return [d, st.days[d] || { q: 0, ok: 0, stars: 0, art: 0 }, t.toLocaleDateString('en', { weekday: 'short' })]; });
  const sum = k => days.reduce((a, [, x]) => a + (x[k] || 0), 0), q = sum('q'), ok = sum('ok'), active = days.filter(([, x]) => x.q || x.art || x.stars).length;
  const max = Math.max(1, ...days.map(([, x]) => x.stars || 0));
  const tried = Object.keys(MATH).filter(k => st.skills[k].seen >= 5 && acc(k) != null);
  const best = tried.sort((a, b) => acc(b) - acc(a))[0], hard = [...tried].sort((a, b) => acc(a) - acc(b)).find(k => acc(k) < 0.7);
  return `<div class="panel"><h2>This week</h2>
    <div class="week" aria-label="Stars earned each day">${days.map(([d, x, w]) => `<div class="wk"><i style="height:${Math.round((x.stars || 0) / max * 70)}px"></i><b>${x.stars || 0}</b><span>${w}</span></div>`).join('')}</div>
    <p class="note">Played on ${active} of the last 7 days. ${q} math questions answered${q ? `, ${Math.round(ok / q * 100)}% right on the first try` : ''}. ${sum('art')} art lesson${sum('art') === 1 ? '' : 's'} or drawing${sum('art') === 1 ? '' : 's'} finished. ${sum('stars')} stars earned.</p>
    ${best ? `<p class="note">Strongest topic: ${MATH[best].ico} ${MATH[best].name} (${Math.round(acc(best) * 100)}% first try).${hard && hard !== best ? ` Worth practising together: ${MATH[hard].ico} ${MATH[hard].name} (${Math.round(acc(hard) * 100)}%).` : ''}</p>` : ''}</div>`;
}
