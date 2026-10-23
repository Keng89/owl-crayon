/* ---------- Science & Nature: picture cards, quizzes, mini-labs and try-at-home experiments ---------- */
// 14 topics (my body, animals, life cycles, plants, weather, space, water, materials, forces, light, sound, dinosaurs,
// the ocean and caring for Earth). Each topic has picture cards (a fact, more for older children, and a "Did you
// know?") and a 5-question quiz of mixed kinds: tap the picture, true or false, sort into groups, and put a cycle in
// order by dragging. Six mini-labs (float or sink, magnets, grow a plant, dress for the weather, shadow puppets, planet
// order) and 12 safe experiments to try at home. Every picture is drawn here in SVG and emoji, nothing is downloaded.
// The data lives in science2.js and is built the first time this area opens, so the home screen stays quick.
// Progress is kept per player in st.science, so it is saved, backed up and removed with the player like the rest.
//
// Stars: reading all the cards of a topic 1 (once); a quiz 1 per question right first time, +2 for 5 of 5 (the first
// time it is finished), 1 for a repeat; a topic badge (4 or 5 right first time) +3 once; a mini-lab 3 the first time,
// then 1; trying an experiment at home 2 (once).
const scienceHome = (() => {
  let DATA = null;
  const D = () => DATA || (DATA = sciData());
  let fast = false; // tests: shorter pauses
  const wait = ms => fast ? 40 : ms;
  const OL = '#22305A';
  const f1 = n => Math.round(n * 10) / 10;
  const tierAge = () => +st.age || 5;

  /* --- saved progress, read defensively (an old or damaged save fills itself in) --- */
  const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
  function sc(s = st) {
    if (!isObj(s.science)) s.science = {};
    const S = s.science;
    for (const k of ['seen', 'cards', 'quiz', 'badges', 'labs', 'home']) if (!isObj(S[k])) S[k] = {};
    return S;
  }

  /* --- pictures: a tiny scene language. "bg|emoji x y size anim delay|@drawer x y scale anim" in a 200x120 box --- */
  const DR = {
    cloud: (x, y, s, grey) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="6" rx="24" ry="9" fill="${grey ? '#9AA6B4' : '#fff'}"/><circle cx="-9" cy="0" r="10" fill="${grey ? '#9AA6B4' : '#fff'}"/><circle cx="6" cy="-4" r="13" fill="${grey ? '#AEB9C6' : '#fff'}"/></g>`,
    storm: (x, y, s) => DR.cloud(x, y, s, 1),
    rain: (x, y, s) => DR.cloud(x, y, s, 1) + [-14, -5, 4, 13].map((dx, i) => `<g class="sc-a sc-fall" style="animation-delay:${i * 0.25}s"><line x1="${f1(x + dx * s)}" y1="${f1(y + 14 * s)}" x2="${f1(x + dx * s - 2)}" y2="${f1(y + 21 * s)}" stroke="#2E8BE6" stroke-width="2.4" stroke-linecap="round"/></g>`).join(''),
    snowfall: (x, y, s) => DR.cloud(x, y, s) + [-12, 0, 12].map((dx, i) => `<g class="sc-a sc-fall" style="animation-delay:${i * 0.4}s"><text x="${f1(x + dx * s)}" y="${f1(y + 20 * s)}" font-size="${f1(9 * s)}" text-anchor="middle">❄️</text></g>`).join(''),
    sun: (x, y, s) => `<g class="sc-a sc-spin"><g transform="translate(${x} ${y}) scale(${s})">${Array.from({ length: 10 }, (_, i) => `<line x1="0" y1="-15" x2="0" y2="-21" stroke="#FFB020" stroke-width="3" stroke-linecap="round" transform="rotate(${i * 36})"/>`).join('')}</g></g><circle cx="${x}" cy="${y}" r="${f1(12 * s)}" fill="#FFC23D" stroke="#F0A020" stroke-width="1.5"/>`,
    moon: (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M4,-14 A14,14 0 1 0 4,14 A11,11 0 1 1 4,-14Z" fill="#FFF3B0" stroke="#E6C860" stroke-width="1.2"/>`,
    drop: (x, y, s, c = '#2E8BE6') => `<path transform="translate(${x} ${y}) scale(${s})" d="M0,-14 C6,-5 10,0 10,5 A10,10 0 0 1 -10,5 C-10,0 -6,-5 0,-14Z" fill="${c}" stroke="${OL}" stroke-width="1.2"/><circle cx="${f1(x - 3 * s)}" cy="${f1(y + 3 * s)}" r="${f1(2.2 * s)}" fill="#fff" opacity=".7"/>`,
    waves: (x, y, s) => `<g class="sc-a sc-sway">${[0, 8].map(dy => `<path d="M${f1(x - 40 * s)},${f1(y + dy * s)} ${Array.from({ length: 8 }, (_, i) => `q${f1(5 * s)},${f1(-5 * s)} ${f1(10 * s)},0`).join(' ')}" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".85"/>`).join('')}</g>`,
    arrow: (x, y, s, rot = 0, c = '#F2604F') => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><line x1="-14" y1="0" x2="10" y2="0" stroke="${c}" stroke-width="4" stroke-linecap="round"/><path d="M8,-7 L17,0 L8,7Z" fill="${c}"/></g>`,
    arrowU: (x, y, s) => DR.arrow(x, y, s, -90), arrowD: (x, y, s) => DR.arrow(x, y, s, 90, '#2E8BE6'), arrowL: (x, y, s) => DR.arrow(x, y, s, 180, '#6D55D1'), arrowR: (x, y, s) => DR.arrow(x, y, s, 0, '#2FA36B'),
    cycle: (x, y, s) => `<g class="sc-a sc-spin-slow"><g transform="translate(${x} ${y}) scale(${s})">${[0, 90, 180, 270].map(r => `<g transform="rotate(${r})"><path d="M18,-4 A18,18 0 0 1 4,17" fill="none" stroke="#6D55D1" stroke-width="3"/><path d="M8,14 L2,20 L-1,12Z" fill="#6D55D1"/></g>`).join('')}</g></g>`,
    rainbow: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${['#F2604F', '#FF8A2B', '#FFC23D', '#2FA36B', '#2E8BE6', '#4B37A6', '#8E5BD6'].map((c, i) => `<path d="M${-40 + i * 3},0 A${40 - i * 3},${40 - i * 3} 0 0 1 ${40 - i * 3},0" fill="none" stroke="${c}" stroke-width="3.2"/>`).join('')}</g>`,
    sound: (x, y, s) => [0, 1, 2].map(i => `<g class="sc-a sc-pulse" style="animation-delay:${i * 0.3}s"><path transform="translate(${x} ${y}) scale(${s})" d="M${6 + i * 7},-${8 + i * 6} Q${12 + i * 9},0 ${6 + i * 7},${8 + i * 6}" fill="none" stroke="#6D55D1" stroke-width="2.6" stroke-linecap="round"/></g>`).join(''),
    magnet: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14,10 L-14,-4 A14,14 0 0 1 14,-4 L14,10 L6,10 L6,-4 A6,6 0 0 0 -6,-4 L-6,10Z" fill="#F2604F" stroke="${OL}" stroke-width="1.4"/><rect x="-14" y="6" width="8" height="8" fill="#C9D3DC" stroke="${OL}" stroke-width="1.2"/><rect x="6" y="6" width="8" height="8" fill="#C9D3DC" stroke="${OL}" stroke-width="1.2"/></g>`,
    heart: (x, y, s) => `<g class="sc-a sc-beat"><path transform="translate(${x} ${y}) scale(${s})" d="M0,12 C-20,0 -12,-16 0,-7 C12,-16 20,0 0,12Z" fill="#E8443A" stroke="${OL}" stroke-width="1.3"/></g>`,
    lungs: (x, y, s) => `<g class="sc-a sc-breathe"><g transform="translate(${x} ${y}) scale(${s})"><line x1="0" y1="-16" x2="0" y2="-4" stroke="#C96E96" stroke-width="3"/><path d="M-2,-4 C-10,-10 -18,-2 -17,10 C-16,17 -6,16 -3,12Z" fill="#F49AC1" stroke="${OL}" stroke-width="1.2"/><path d="M2,-4 C10,-10 18,-2 17,10 C16,17 6,16 3,12Z" fill="#F49AC1" stroke="${OL}" stroke-width="1.2"/></g></g>`,
    roots: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-22" y="0" width="44" height="18" fill="#A86B3C" opacity=".55"/><path d="M0,0 L0,-16" stroke="#2FA36B" stroke-width="3"/><path d="M0,-12 q-9,-6 -12,-1 q6,4 12,1Z M0,-16 q9,-6 12,-1 q-6,4 -12,1Z" fill="#2FA36B"/><path d="M0,0 L0,9 M0,4 L-8,12 M0,6 L8,14 M0,9 L-3,16 M-8,12 L-12,15 M8,14 L12,17" stroke="#FFF3D6" stroke-width="1.8" stroke-linecap="round"/></g>`,
    dandelion: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0,18 Q2,4 0,-4" stroke="#2FA36B" stroke-width="2.4" fill="none"/>${Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="-8" x2="${f1(11 * Math.cos(i / 14 * 6.283))}" y2="${f1(-8 + 11 * Math.sin(i / 14 * 6.283))}" stroke="#B8C2CC" stroke-width="1"/><circle cx="${f1(11 * Math.cos(i / 14 * 6.283))}" cy="${f1(-8 + 11 * Math.sin(i / 14 * 6.283))}" r="1.8" fill="#fff" stroke="#B8C2CC" stroke-width=".6"/>`).join('')}<circle cx="0" cy="-8" r="2.4" fill="#C9A060"/></g>`,
    chrys: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><line x1="-16" y1="-16" x2="16" y2="-16" stroke="#8B5A2B" stroke-width="3" stroke-linecap="round"/><line x1="0" y1="-16" x2="0" y2="-11" stroke="#8B5A2B" stroke-width="1.5"/><path d="M0,-11 C8,-8 8,8 0,16 C-8,8 -8,-8 0,-11Z" fill="#7FB04A" stroke="${OL}" stroke-width="1.2"/><path d="M-4,-2 Q0,0 4,-2 M-4,4 Q0,6 4,4" stroke="#4E7A1E" stroke-width="1" fill="none"/></g>`,
    spawn: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${[[-8, -6], [3, -9], [12, -2], [-12, 4], [-2, 2], [8, 8], [-5, 11], [14, 10], [4, 14]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="5" fill="rgba(230,245,255,.9)" stroke="#8EC5F5" stroke-width="1"/><circle cx="${a}" cy="${b}" r="1.8" fill="${OL}"/>`).join('')}</g>`,
    tadpole: (x, y, s) => `<g class="sc-a sc-swim"><g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="-4" cy="0" rx="8" ry="6" fill="#3A3F4A"/><path d="M3,0 Q10,-6 16,0 Q22,6 26,0" stroke="#3A3F4A" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="-7" cy="-2" r="1.5" fill="#fff"/></g></g>`,
    froglet: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M8,4 Q18,8 24,2" stroke="#4E9A3A" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="2" rx="11" ry="8" fill="#6CC04A" stroke="${OL}" stroke-width="1.2"/><circle cx="-5" cy="-6" r="3.6" fill="#fff" stroke="${OL}" stroke-width="1"/><circle cx="4" cy="-6" r="3.6" fill="#fff" stroke="${OL}" stroke-width="1"/><circle cx="-5" cy="-6" r="1.5" fill="${OL}"/><circle cx="4" cy="-6" r="1.5" fill="${OL}"/><path d="M-9,8 l-5,5 M7,9 l2,5" stroke="#4E9A3A" stroke-width="2.4" stroke-linecap="round"/></g>`,
    evap: (x, y, s) => [-12, 0, 12].map((dx, i) => `<g class="sc-a sc-rise" style="animation-delay:${i * 0.5}s"><path transform="translate(${f1(x + dx * s)} ${y}) scale(${s})" d="M0,10 q-4,-5 0,-10 q4,-5 0,-10" stroke="#8EC5F5" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`).join(''),
    steam: (x, y, s) => DR.evap(x, y, s),
    coral: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14,16 L-14,0 M-14,4 L-20,-6 M-14,2 L-8,-8 M0,16 L0,-10 M0,-4 L6,-14 M0,0 L-6,-12 M14,16 L14,-2 M14,4 L20,-8" stroke="#F2789A" stroke-width="5" stroke-linecap="round"/><circle cx="-20" cy="-6" r="3" fill="#FF8A2B"/><circle cx="6" cy="-14" r="3" fill="#FFC23D"/><circle cx="20" cy="-8" r="3" fill="#FF8A2B"/></g>`,
    bury: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-22" y="-14" width="44" height="9" fill="#C9A06A"/><rect x="-22" y="-5" width="44" height="9" fill="#A97D4A"/><rect x="-22" y="4" width="44" height="10" fill="#8B6239"/><text x="0" y="0" font-size="14" text-anchor="middle" dominant-baseline="central">🦴</text></g>`,
    planet: (x, y, s, c, ring, bands) => `<g transform="translate(${x} ${y}) scale(${s})">${ring ? `<ellipse cx="0" cy="0" rx="22" ry="6" fill="none" stroke="#D9C38A" stroke-width="3"/>` : ''}<circle cx="0" cy="0" r="12" fill="${c}" stroke="${OL}" stroke-width="1.2"/>${bands ? '<path d="M-11,-4 H11 M-12,2 H12 M-10,7 H10" stroke="rgba(120,70,30,.45)" stroke-width="2"/>' : ''}${ring ? `<path d="M-22,0 A22,6 0 0 0 22,0" fill="none" stroke="#D9C38A" stroke-width="3"/>` : ''}</g>`,
    mercury: (x, y, s) => DR.planet(x, y, s * 0.6, '#A9A9A9'), venus: (x, y, s) => DR.planet(x, y, s * 0.85, '#E8C77A'),
    earth: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s * 0.9})"><circle r="12" fill="#2E8BE6" stroke="${OL}" stroke-width="1.2"/><path d="M-8,-6 q4,-4 8,-1 q2,4 -3,6 q-4,2 -5,-5Z M2,4 q5,-2 7,2 q-1,5 -6,4Z" fill="#2FA36B"/></g>`,
    mars: (x, y, s) => DR.planet(x, y, s * 0.7, '#D9663B'), jupiter: (x, y, s) => DR.planet(x, y, s * 1.4, '#D9A66B', 0, 1),
    saturn: (x, y, s) => DR.planet(x, y, s * 1.15, '#E8CF8F', 1), uranus: (x, y, s) => DR.planet(x, y, s, '#8FD8E0'), neptune: (x, y, s) => DR.planet(x, y, s, '#3D6FE0'),
    orbit: (x, y, s) => `<ellipse cx="${x}" cy="${y}" rx="${f1(40 * s)}" ry="${f1(14 * s)}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-dasharray="3 3"/>`,
    shadow: (x, y, s) => `<ellipse cx="${x}" cy="${y}" rx="${f1(20 * s)}" ry="${f1(4 * s)}" fill="rgba(34,48,90,.35)"/>`,
    seed: (x, y, s) => `<ellipse cx="${x}" cy="${y}" rx="${f1(6 * s)}" ry="${f1(4 * s)}" fill="#A86B3C" stroke="${OL}" stroke-width="1"/>`,
    pot: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14,-8 L14,-8 L10,12 L-10,12Z" fill="#D9663B" stroke="${OL}" stroke-width="1.3"/><rect x="-16" y="-12" width="32" height="6" rx="2" fill="#E07A4F" stroke="${OL}" stroke-width="1.3"/></g>`,
    bin: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-12" y="-12" width="24" height="26" rx="3" fill="#2FA36B" stroke="${OL}" stroke-width="1.3"/><rect x="-14" y="-16" width="28" height="5" rx="2" fill="#268457" stroke="${OL}" stroke-width="1.2"/><text x="0" y="2" font-size="13" fill="#fff" text-anchor="middle" dominant-baseline="central">♻</text></g>`,
    ice: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-10,-6 L0,-12 L12,-6 L12,8 L2,14 L-10,8Z" fill="#D9F1FF" stroke="#8EC5F5" stroke-width="1.4"/><path d="M-10,-6 L2,0 L12,-6 M2,0 L2,14" stroke="#8EC5F5" stroke-width="1.2" fill="none"/></g>`,
    ramp: (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M-30,14 L30,14 L30,-14Z" fill="#D9A86C" stroke="${OL}" stroke-width="1.3"/>`,
    thermo: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="-18" width="8" height="28" rx="4" fill="#fff" stroke="${OL}" stroke-width="1.2"/><rect x="-2" y="-6" width="4" height="16" fill="#F2604F"/><circle cx="0" cy="12" r="6" fill="#F2604F" stroke="${OL}" stroke-width="1.2"/></g>`,
    glass: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-12,-16 L12,-16 L9,16 L-9,16Z" fill="rgba(142,197,245,.35)" stroke="${OL}" stroke-width="1.3"/><path d="M-11,-4 L11,-4 L9,16 L-9,16Z" fill="rgba(46,139,230,.45)"/></g>`,
    footprint: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="4" rx="7" ry="9" fill="#8B6239"/><circle cx="-7" cy="-9" r="3" fill="#8B6239"/><circle cx="0" cy="-11" r="3" fill="#8B6239"/><circle cx="7" cy="-9" r="3" fill="#8B6239"/></g>`,
    ray: (x, y, s) => `<g class="sc-a sc-pulse"><path d="M${x},${y} L${f1(x + 60 * s)},${f1(y + 30 * s)}" stroke="#FFD75E" stroke-width="5" stroke-linecap="round" opacity=".8"/></g>`,
    vibe: (x, y, s) => `<g class="sc-a sc-wiggle"><g transform="translate(${x} ${y}) scale(${s})"><path d="M-12,-10 l-4,4 l4,4 l-4,4 l4,4 M12,-10 l4,4 l-4,4 l4,4 l-4,4" stroke="#6D55D1" stroke-width="2" fill="none" stroke-linecap="round"/></g></g>`,
    brain: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14,4 C-20,-6 -10,-16 -2,-12 C2,-18 14,-16 14,-6 C20,-2 16,10 8,10 C4,14 -6,14 -8,10 C-14,12 -18,8 -14,4Z" fill="#F7A8C4" stroke="${OL}" stroke-width="1.3"/><path d="M0,-12 Q-3,0 0,12 M-10,-4 q4,2 6,-2 M6,-6 q2,4 6,2 M-8,6 q3,-2 5,1 M4,6 q3,-2 6,0" stroke="#C96E96" stroke-width="1.2" fill="none"/></g>`,
    stars: (x, y, s) => [[-30, -8], [-12, 6], [6, -12], [22, 4], [34, -10], [-22, 14]].map(([a, b], i) => `<g class="sc-a sc-twinkle" style="animation-delay:${i * 0.3}s">${`<circle cx="${f1(x + a * s)}" cy="${f1(y + b * s)}" r="${f1(1.6 * s)}" fill="#FFF3B0"/>`}</g>`).join('')
  };
  const BG = {
    sky: '<rect width="200" height="120" fill="#CDE9FB"/><rect y="96" width="200" height="24" fill="#8FD18A"/>',
    grass: '<rect width="200" height="120" fill="#E4F6D8"/><rect y="92" width="200" height="28" fill="#7CC36E"/>',
    night: '<rect width="200" height="120" fill="#1E2A55"/><rect y="98" width="200" height="22" fill="#2E4A3A"/><circle cx="30" cy="20" r="1.5" fill="#fff"/><circle cx="80" cy="12" r="1.2" fill="#fff"/><circle cx="130" cy="26" r="1.4" fill="#fff"/><circle cx="175" cy="14" r="1.2" fill="#fff"/>',
    space: '<rect width="200" height="120" fill="#0E1433"/>' + [[20, 15], [50, 90], [90, 30], [120, 100], [160, 20], [185, 70], [70, 60], [140, 60], [10, 70]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="1.2" fill="#fff" opacity=".8"/>`).join(''),
    sea: '<rect width="200" height="120" fill="#CDE9FB"/><rect y="52" width="200" height="68" fill="#4FA8E0"/>',
    under: '<rect width="200" height="120" fill="#2E86C8"/><rect y="104" width="200" height="16" fill="#F1D9A0"/><circle cx="30" cy="40" r="3" fill="none" stroke="#BFE3FF"/><circle cx="36" cy="28" r="2" fill="none" stroke="#BFE3FF"/><circle cx="170" cy="50" r="2.5" fill="none" stroke="#BFE3FF"/>',
    deep: '<rect width="200" height="120" fill="#0B2545"/><rect y="108" width="200" height="12" fill="#3B3F5C"/>',
    snow: '<rect width="200" height="120" fill="#E8F1FA"/><rect y="94" width="200" height="26" fill="#fff"/>',
    rain: '<rect width="200" height="120" fill="#B7C4D3"/><rect y="96" width="200" height="24" fill="#7FAF73"/>',
    inside: '<rect width="200" height="120" fill="#FFF3D6"/><rect y="98" width="200" height="22" fill="#E8C9A0"/>',
    lab: '<rect width="200" height="120" fill="#E6F4F1"/><rect y="96" width="200" height="24" fill="#D9B98A"/>',
    desert: '<rect width="200" height="120" fill="#FFE9B8"/><path d="M0,96 Q50,84 100,96 T200,94 V120 H0Z" fill="#F3C77A"/>',
    forest: '<rect width="200" height="120" fill="#D7F2E3"/><rect y="96" width="200" height="24" fill="#6FBF73"/>',
    jungle: '<rect width="200" height="120" fill="#BFE6B0"/><rect y="96" width="200" height="24" fill="#4E9A3A"/>',
    pond: '<rect width="200" height="120" fill="#CDE9FB"/><rect y="80" width="200" height="40" fill="#8FD18A"/><ellipse cx="100" cy="96" rx="80" ry="18" fill="#5BB0E6"/>',
    autumn: '<rect width="200" height="120" fill="#FCE3C4"/><rect y="96" width="200" height="24" fill="#D99A4E"/>',
    earth: '<rect width="200" height="120" fill="#DDF3E6"/><rect y="98" width="200" height="22" fill="#8FD18A"/>',
    dusk: '<rect width="200" height="120" fill="#FFD3B0"/><rect y="96" width="200" height="24" fill="#8FB46E"/>',
    plain: '<rect width="200" height="120" fill="#F4F7FB"/>'
  };
  const PLANETS = new Set(['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']);
  const SKY_DARK = new Set(['night', 'space', 'deep', 'under']);
  // One picture from its spec. Emoji sit on their x,y (centre); drawers take x, y and a scale.
  function scene(spec, label = '') {
    const parts = String(spec || 'plain').split('|'), bg = parts.shift().trim();
    let body = BG[bg] || BG.plain;
    for (const part of parts) {
      const t = part.trim().split(/\s+/); if (!t[0]) continue;
      const [e, x = 100, y = 60, s = 30, anim = '', delay = 0] = t;
      const inner = e[0] === '@' ? (DR[e.slice(1)] ? DR[e.slice(1)](+x, +y, +s || 1) : '') : `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle" dominant-baseline="central">${e}</text>`;
      body += anim && anim !== '-' ? `<g class="sc-a sc-${anim}" style="animation-delay:${+delay || 0}s">${inner}</g>` : inner;
    }
    return `<svg class="sc-scene${SKY_DARK.has(bg) ? ' dark' : ''}" viewBox="0 0 200 120" role="img" aria-label="${esc(label)}">${body}</svg>`;
  }
  // A small picture for an answer button or a drag card: an emoji, or a drawer in its own little box.
  const icon = (ic, cls = 'sc-ic') => String(ic)[0] === '@' && DR[ic.slice(1)]
    ? `<svg class="${cls} sc-icsvg" viewBox="0 0 60 60" aria-hidden="true">${DR[ic.slice(1)](30, 30, PLANETS.has(ic.slice(1)) ? 1.6 : 1.25)}</svg>` : `<span class="${cls}" aria-hidden="true">${ic}</span>`;

  /* --- the text a child sees, by age: the fact, more from 7, the science word from 10 --- */
  const cardText = c => [c.t, tierAge() >= 7 && c.m, tierAge() >= 10 && c.b].filter(Boolean).join(' ');
  const quizOf = T => T.quiz.map(q => tierAge() >= 8 && q.h ? q.h : q);

  /* --- drag and drop, with tap-tap as well (tap a card, then tap where it goes) --- */
  function dragKit(root, item, target, drop) {
    let sel = null;
    const clear = () => { if (sel) sel.classList.remove('sc-sel'); sel = null; };
    root.querySelectorAll(item).forEach(el => {
      el.addEventListener('pointerdown', e => {
        if (e.button > 0) return;
        const sx = e.clientX, sy = e.clientY; let ghost = null, over = null;
        try { el.setPointerCapture(e.pointerId); } catch (x) {}
        const end = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', cancel); el.removeEventListener('lostpointercapture', cancel); if (ghost) ghost.remove(); if (over) over.classList.remove('sc-over'); el.classList.remove('sc-lift'); };
        const move = ev => {
          if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 8) return;
          if (!ghost) { const r = el.getBoundingClientRect(); ghost = el.cloneNode(true); ghost.classList.add('sc-ghost'); ghost.removeAttribute('id'); ghost.style.width = r.width + 'px'; ghost.style.height = r.height + 'px'; document.body.appendChild(ghost); el.classList.add('sc-lift'); clear(); }
          ghost.style.left = ev.clientX - ghost.offsetWidth / 2 + 'px'; ghost.style.top = ev.clientY - ghost.offsetHeight / 2 + 'px';
          const u = document.elementFromPoint(ev.clientX, ev.clientY), t = u && u.closest(target);
          if (over !== t) { if (over) over.classList.remove('sc-over'); over = t && root.contains(t) ? t : null; if (over) over.classList.add('sc-over'); }
        };
        const up = ev => {
          const was = !!ghost; end();
          if (!was) return;
          el._dragged = true; setTimeout(() => { el._dragged = false; }, 0);
          const u = document.elementFromPoint(ev.clientX, ev.clientY), t = u && u.closest(target);
          if (t && root.contains(t) && el.isConnected) drop(el, t);
        };
        const cancel = () => end();
        el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', cancel); el.addEventListener('lostpointercapture', cancel);
      });
      el.addEventListener('click', e => {
        e.stopPropagation();
        if (el._dragged) { el._dragged = false; return; }
        if (sel && sel !== el) { const t = el.closest(target); if (t) { const s = sel; clear(); drop(s, t); return; } }
        if (sel === el) { clear(); return; }
        clear(); sel = el; el.classList.add('sc-sel'); tone([700]);
      });
    });
    root.querySelectorAll(target).forEach(t => t.addEventListener('click', () => { if (sel && sel.isConnected) { const s = sel; clear(); drop(s, t); } }));
  }

  /* --- put things in order: cards from the tray into numbered slots --- */
  // items: the right order, each [icon, label]. onCheck(ok) after Check; returns { el }.
  function orderUI(box, items, { cycle = false, grid = 0, onCheck, onMove }) {
    const n = items.length, slots = Array(n).fill(null);
    let tray = shuffle(items.map((_, i) => i)), msg = '';
    const chip = i => `<button class="sc-chip" data-it="${i}" aria-label="${esc(items[i][1])}">${icon(items[i][0])}<small>${esc(items[i][1])}</small></button>`;
    function render() {
      const full = slots.every(x => x != null);
      box.innerHTML = `<div class="sc-slots${grid ? ' sc-grid' : ''}" style="--n:${grid || n}">${slots.map((it, k) => `<div class="sc-slot${it != null ? ' full' : ''}" data-slot="${k}" role="button" tabindex="0" aria-label="Place ${k + 1}"><span class="sc-sn">${k + 1}</span>${it == null ? '' : chip(it)}</div>${!grid && k < n - 1 ? '<span class="sc-arr" aria-hidden="true">➜</span>' : ''}`).join('')}</div>
        ${cycle ? '<p class="sc-cyc">↻ …and round again!</p>' : ''}
        <div class="sc-tray" data-slot="tray" role="button" aria-label="Tray">${tray.map(chip).join('') || '<span class="sc-empty">All placed! Tap Check.</span>'}</div>
        <p class="sc-msg" aria-live="polite">${msg}</p>
        <div class="row"><button class="btn leaf sc-check" id="scChk"${full ? '' : ' disabled'}>Check ✓</button></div>`;
      dragKit(box, '.sc-chip', '.sc-slot, .sc-tray', (el, t) => {
        const i = +el.dataset.it, from = slots.indexOf(i), to = t.dataset.slot;
        msg = '';
        if (to === 'tray') { if (from >= 0) { slots[from] = null; tray.push(i); } }
        else {
          const k = +to, there = slots[k];
          if (from === k) return render();
          if (from >= 0) { slots[from] = there; } else { tray = tray.filter(x => x !== i); if (there != null) tray.push(there); }
          slots[k] = i; tone([520 + k * 60]);
        }
        render(); if (onMove) onMove();
      });
      box.querySelector('#scChk').onclick = () => {
        if (!slots.every(x => x != null)) return;
        const wrong = slots.map((it, k) => it !== k ? k : -1).filter(k => k >= 0);
        if (!wrong.length) { box.querySelectorAll('.sc-slot').forEach(s => s.classList.add('right')); box.querySelector('#scChk').disabled = true; box.querySelectorAll('.sc-chip').forEach(c => c.disabled = true); onCheck(true); return; }
        wrong.forEach(k => { tray.push(slots[k]); slots[k] = null; });
        msg = `${wrong.length === 1 ? '1 card was' : wrong.length + ' cards were'} in the wrong place. The right ones stay. Try again!`;
        render(); onCheck(false, wrong.length);
      };
    }
    render();
    return { get slots() { return slots.slice(); }, get tray() { return tray.slice(); } };
  }

  /* --- sort into groups: drag (or tap) each card into its group --- */
  function sortUI(box, groups, items, { onWrong, onDone }) {
    const placed = items.map(() => null), order = shuffle(items.map((_, i) => i));
    let msg = '';
    const chip = i => `<button class="sc-chip" data-it="${i}" aria-label="${esc(items[i][1])}">${icon(items[i][0])}<small>${esc(items[i][1])}</small></button>`;
    function render() {
      box.innerHTML = `<div class="sc-bins">${groups.map((g, k) => `<div class="sc-bin" data-bin="${k}" role="button" tabindex="0" aria-label="${esc(g[1])}"><b>${icon(g[0], 'sc-bico')} ${esc(g[1])}</b><div class="sc-binin">${items.map((_, i) => i).filter(i => placed[i] === k).map(i => `<span class="sc-done" aria-label="${esc(items[i][1])}">${icon(items[i][0])}</span>`).join('')}</div></div>`).join('')}</div>
        <div class="sc-tray">${order.filter(i => placed[i] == null).map(chip).join('') || '<span class="sc-empty">All sorted!</span>'}</div><p class="sc-msg" aria-live="polite">${msg}</p>`;
      dragKit(box, '.sc-chip', '.sc-bin', (el, t) => {
        const i = +el.dataset.it, g = +t.dataset.bin;
        if (items[i][2] === g) { placed[i] = g; msg = `Yes! ${items[i][1]}: ${groups[g][1]}.`; tone([600, 800]); render(); if (placed.every(x => x != null)) onDone(); }
        else { msg = items[i][3] || `Not quite. Where else could ${items[i][1]} go?`; oops(); render(); const c = box.querySelector(`[data-it="${i}"]`); if (c) c.classList.add('wrong'); onWrong(i); }
      });
    }
    render();
  }

  /* --- screens --- */
  const tTile = (T, S) => { const b = S.badges[T.id], seen = (S.cards[T.id] ? 1 : 0), q = S.quiz[T.id];
    return `<button class="sc-tt" data-topic="${T.id}" style="--tc:${T.c}" aria-label="${esc(T.name)}${b ? ', badge won' : ''}"><span class="sc-tico" aria-hidden="true">${T.ico}</span><b>${esc(T.name)}</b><span class="sc-tst">${seen ? '📖✓' : '📖'} ${q ? `🎯${q.best}/5` : '🎯'} ${b ? T.badge : ''}</span></button>`; };
  function scHome() {
    document.querySelectorAll('.sc-ghost').forEach(g => g.remove());
    const { TOPICS, LABS, HOME } = D(), S = sc(), nb = TOPICS.filter(T => S.badges[T.id]).length, nl = LABS.filter(L => S.labs[L.id]).length;
    const a = tierAge();
    view.innerHTML = `${crumbs('🔬 Science &amp; Nature')}
      <div class="sc-hello"><span class="sc-howl" aria-hidden="true">🦉</span><p>${a <= 6 ? 'Let\'s find out how the world works! Pick a picture.' : a <= 9 ? 'Explore a topic, take the quiz to win its badge, then try a mini-lab!' : 'Pick a topic to explore, test yourself in the quiz, and run the labs and real experiments.'}</p></div>
      <h3 class="section-title">🔎 Topics <span class="tag">🏅 ${nb} of ${TOPICS.length}</span></h3>
      <div class="sc-topics">${TOPICS.map(T => tTile(T, S)).join('')}</div>
      <h3 class="section-title">🧪 Mini-labs <span class="tag">${nl} of ${LABS.length} done</span></h3>
      <div class="sc-labs">${LABS.map(L => `<button class="sc-lt" data-lab="${L.id}" style="--tc:${L.c}"><span class="sc-tico" aria-hidden="true">${L.ico}</span><b>${esc(L.name)}</b><span class="sc-tst">${S.labs[L.id] ? '✅ done' : esc(L.blurb)}</span></button>`).join('')}</div>
      <h3 class="section-title">🏠 Try at home <span class="tag">${HOME.filter(h => S.home[h.id]).length} of ${HOME.length} tried</span></h3>
      <div class="sc-homes">${HOME.map(h => `<button class="sc-ht" data-home="${h.id}"><span class="sc-hico" aria-hidden="true">${h.ico}</span><span><b>${esc(h.name)}</b><small>${h.safety ? '⚠️ with a grown-up' : 'Easy and safe'}${S.home[h.id] ? ' · ✅ tried' : ''}</small></span></button>`).join('')}</div>
      <h3 class="section-title">🏅 My science badges</h3>
      <div class="sc-shelf">${TOPICS.map(T => `<span class="sc-bdg${S.badges[T.id] ? ' on' : ''}" title="${esc(T.bname)}"><i aria-hidden="true">${S.badges[T.id] ? T.badge : '🔒'}</i><small>${esc(T.bname)}</small></span>`).join('')}</div>
      <p class="note">For grown-ups: get 4 or 5 right first time in a topic quiz to win its badge. Cards say more as your child gets older (ages 5, 7 and 10+). Experiments marked ⚠️ need a grown-up.</p>`;
    wireBack(home);
    sayScreen(a <= 6 ? 'Science and Nature! Pick a picture to find out how the world works.' : 'Science and Nature. Pick a topic, a mini-lab, or an experiment to try at home.');
    view.querySelectorAll('[data-topic]').forEach(b => b.onclick = () => go(topicView, b.dataset.topic, 0));
    view.querySelectorAll('[data-lab]').forEach(b => b.onclick = () => go(labView, b.dataset.lab));
    view.querySelectorAll('[data-home]').forEach(b => b.onclick = () => go(homeExpView, b.dataset.home));
  }

  const topicOf = id => D().TOPICS.find(T => T.id === id) || D().TOPICS[0];
  function topicView(id, i = 0) {
    const T = topicOf(id), S = sc(), n = T.cards.length; i = clamp(+i || 0, 0, n - 1);
    const c = T.cards[i], seen = Array.isArray(S.seen[T.id]) ? S.seen[T.id] : (S.seen[T.id] = []);
    if (!seen.includes(i)) { seen.push(i); save(); }
    let gotNow = false;
    if (!S.cards[T.id] && seen.length >= n) { S.cards[T.id] = today(); gotNow = true; addStars(1); }
    const txt = cardText(c);
    view.innerHTML = `${crumbs(`${T.ico} ${esc(T.name)}`)}
      <div class="sc-card" style="--tc:${T.c}">
        <div class="sc-pic">${scene(c.pic, c.h)}</div>
        <div class="sc-ct"><h2>${esc(c.h)}</h2><p class="sc-fact">${esc(txt)}</p>
          <button class="sc-dykb" id="scDyk" aria-expanded="false">💡 Did you know?</button>
          <p class="sc-dyk" id="scDykT" hidden>${esc(c.dyk)}</p></div>
      </div>
      <div class="sc-nav">
        <button class="btn alt sc-prev" id="scPrev"${i ? '' : ' disabled'} aria-label="Card before">◀</button>
        <span class="sc-dots" aria-label="Card ${i + 1} of ${n}">${T.cards.map((_, k) => `<i class="${k === i ? 'on' : seen.includes(k) ? 'seen' : ''}"></i>`).join('')}</span>
        ${i < n - 1 ? '<button class="btn sc-next" id="scNext" aria-label="Next card">Next ▶</button>' : '<button class="btn leaf sc-next" id="scQuiz">🎯 Quiz time!</button>'}
      </div>
      <div class="row"><button class="btn alt sm sc-sm" id="scSay">🔊 Read it again</button>${i < n - 1 ? '<button class="btn alt sm sc-sm" id="scSkip">🎯 Go to the quiz</button>' : ''}</div>
      ${gotNow ? '<p class="cheer sc-gotcards">You read every card! +1 ⭐</p>' : ''}`;
    wireBack(scHome);
    const talk = () => say(`${c.h}. ${txt}`);
    sayScreen(`${c.h}. ${txt}`);
    $('#scSay').onclick = talk;
    $('#scDyk').onclick = () => { const p = $('#scDykT'); p.hidden = false; $('#scDyk').setAttribute('aria-expanded', 'true'); tone([660, 880]); say('Did you know? ' + c.dyk); };
    $('#scPrev').onclick = () => go(topicView, T.id, i - 1);
    if ($('#scNext')) $('#scNext').onclick = () => go(topicView, T.id, i + 1);
    if ($('#scSkip')) $('#scSkip').onclick = () => go(quizView, T.id);
    if ($('#scQuiz')) $('#scQuiz').onclick = () => go(quizView, T.id);
  }

  /* --- the quiz --- */
  let cur = null; // the question on screen, for tests
  function quizView(id) {
    const T = topicOf(id), qs = quizOf(T), Q = { T, qs, i: 0, miss: qs.map(() => 0) };
    ask(Q);
  }
  function ask(Q) {
    document.querySelectorAll('.sc-ghost').forEach(g => g.remove());
    const { T, qs, i } = Q, q = qs[i], nav = navId;
    cur = { topic: T.id, i, q };
    view.innerHTML = `${crumbs(`${T.ico} ${esc(T.name)} quiz`)}
      <div class="progress">${qs.map((_, k) => `<i class="${k < i ? 'done' : k === i ? 'now' : ''}"></i>`).join('')}</div>
      <div class="qcard sc-q" style="--tc:${T.c}" data-kind="${q.k}">
        <div class="prompt"><div class="ptext">${esc(q.q)}</div><button class="speak" id="spk" aria-label="Read it to me">🔊</button></div>
        <div id="scBody" class="sc-body"></div>
        <div class="cheer" id="cheer" aria-live="polite"></div>
        <div id="exp" class="sc-exp"></div>
      </div>`;
    wireBack(() => topicView(T.id, 0));
    const box = $('#scBody');
    const extra = q.k === 'tf' ? ' True or false?' : q.k === 'sort' ? ' Drag each picture into its group.' : q.k === 'order' ? ' Drag the pictures into the right order.' : (tierAge() <= 8 ? ' Is it ' + q.o.map(o => o[1]).join(', or ') + '?' : '');
    const qSay = q.q + extra; say(qSay);
    $('#spk').onclick = () => say(qSay);
    const missed = () => { Q.miss[i]++; oops(); };
    const explain = text => { $('#exp').innerHTML = `<div class="explain"><p>${esc(text)}</p></div>`; say(text); };
    const right = () => {
      const w = Q.miss[i] ? 'Now you know it!' : pick(['Great job!', 'You got it!', 'Super scientist!', 'Yes!', 'Brilliant!']);
      $('#cheer').textContent = w + (Q.miss[i] ? '' : ' ✓'); yay();
      if (q.why) explain(`${w} ${q.why}`); else say(w);
      setTimeout(() => { if (nav !== navId) return; Q.i++; Q.i < qs.length ? ask(Q) : quizDone(Q); }, wait(q.why ? 2600 : 1400));
    };
    if (q.k === 'pic') {
      const opts = shuffle(q.o.map((o, k) => k));
      box.innerHTML = `<div class="sc-opts" style="--n:${opts.length}">${opts.map(k => `<button class="sc-opt" data-o="${k}" aria-label="${esc(q.o[k][1])}">${icon(q.o[k][0], 'sc-oic')}<small>${esc(q.o[k][1])}</small></button>`).join('')}</div>`;
      let done = false;
      box.querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
        if (done || b.disabled) return;
        if (+b.dataset.o === q.a) { done = true; b.classList.add('right'); box.querySelectorAll('[data-o]').forEach(x => x.disabled = true); right(); }
        else { b.classList.add('wrong'); b.disabled = true; missed(); explain(`Not that one. ${q.hint || 'Look again and try another!'}`); }
      });
    } else if (q.k === 'tf') {
      box.innerHTML = `${q.pic ? `<div class="sc-pic sm">${scene(q.pic, q.q)}</div>` : ''}<div class="sc-tf"><button class="sc-tfb t" data-tf="true">✅ True</button><button class="sc-tfb f" data-tf="false">❌ False</button></div>`;
      let done = false;
      box.querySelectorAll('[data-tf]').forEach(b => b.onclick = () => {
        if (done || b.disabled) return;
        if ((b.dataset.tf === 'true') === q.a) { done = true; b.classList.add('right'); box.querySelectorAll('[data-tf]').forEach(x => x.disabled = true); right(); }
        else { b.classList.add('wrong'); b.disabled = true; missed(); explain(`Not quite. ${q.why || ''}`.trim()); }
      });
    } else if (q.k === 'sort') {
      sortUI(box, q.g, q.items, { onWrong: () => missed(), onDone: () => right() });
    } else if (q.k === 'order') {
      orderUI(box, q.items, { cycle: q.cycle, onCheck: ok => { if (ok) right(); else { missed(); explain(q.hint || 'Think about what happens first, and what comes next.'); } } });
    }
  }
  function quizDone(Q) {
    cur = null;
    const { T, qs } = Q, S = sc(), first = Q.miss.filter(m => !m).length, prev = S.quiz[T.id];
    let stars = prev ? 1 : first + (first === qs.length ? 2 : 0);
    S.quiz[T.id] = { n: (prev ? +prev.n || 0 : 0) + 1, best: Math.max(prev ? +prev.best || 0 : 0, first), last: first, at: today() };
    let badge = false;
    if (first >= 4 && !S.badges[T.id]) { S.badges[T.id] = today(); badge = true; stars += 3; }
    if (stars) addStars(stars); else save();
    confetti(first >= 4 ? 40 : 15);
    view.innerHTML = `<div class="view done sc-result">
      <div class="big">${badge ? T.badge : first >= 4 ? '🏆' : '🌟'}</div>
      <h1>${first === qs.length ? 'Amazing!' : first >= 3 ? 'Well done!' : 'Good try!'}</h1>
      <p class="sc-res">${first} of ${qs.length} right first time · +${stars} ⭐</p>
      ${badge ? `<p class="sc-res sc-badgewon">New badge: ${T.badge} ${esc(T.bname)}!</p>` : !S.badges[T.id] ? '<p class="note">Get 4 or 5 right first time to win this topic\'s badge.</p>' : ''}
      <div class="row"><button class="btn leaf" id="scAgain">Try again</button><button class="btn alt" id="scCards">📖 Cards</button><button class="btn" id="scNextT">Next topic ▶</button></div></div>`;
    say(`You got ${first} of ${qs.length} right first time and earned ${stars} stars!${badge ? ` You won the ${T.bname} badge!` : ''}`);
    const L = D().TOPICS, nx = L[(L.indexOf(T) + 1) % L.length];
    $('#scAgain').onclick = () => go(quizView, T.id);
    $('#scCards').onclick = () => go(topicView, T.id, 0);
    $('#scNextT').onclick = () => go(topicView, nx.id, 0);
  }

  /* --- try at home --- */
  function homeExpView(id) {
    const { HOME } = D(), h = HOME.find(x => x.id === id) || HOME[0], S = sc(), done = !!S.home[h.id];
    view.innerHTML = `${crumbs(`${h.ico} ${esc(h.name)}`)}
      <div class="sc-card sc-exp-card" style="--tc:#1D7C82"><div class="sc-pic">${scene(h.pic, h.name)}</div>
        <div class="sc-ct"><p class="sc-fact">${esc(h.intro)}</p></div></div>
      ${h.safety ? `<div class="sc-safe" role="note"><b>⚠️ Ask a grown-up</b><p>${esc(h.safety)}</p></div>` : ''}
      <div class="panel"><h2>🧺 You need</h2><div class="sc-need">${h.need.map(n => `<span>${esc(n)}</span>`).join('')}</div></div>
      <div class="panel"><h2>👣 Steps</h2><ol class="sc-steps">${h.steps.map((s, k) => `<li><button class="sc-stepb" data-step="${k}" aria-label="Read step ${k + 1}">🔊</button><span>${esc(s)}</span></li>`).join('')}</ol></div>
      <div class="panel"><h2>🤔 What's happening?</h2><p class="sc-fact">${esc(tierAge() >= 9 && h.why2 ? h.why2 : h.why)}</p></div>
      <div class="row"><button class="btn leaf" id="scTried">${done ? '✅ We tried it!' : 'We tried it! ⭐'}</button></div>`;
    wireBack(scHome);
    sayScreen(`${h.name}. ${h.intro}${h.safety ? ' Ask a grown-up to help. ' + h.safety : ''}`);
    view.querySelectorAll('[data-step]').forEach(b => b.onclick = () => say(`Step ${+b.dataset.step + 1}. ${h.steps[+b.dataset.step]}`));
    $('#scTried').onclick = () => {
      if (S.home[h.id]) { say('You already tried this one. Great scientist!'); return; }
      S.home[h.id] = today(); addStars(2); confetti(25); yay();
      $('#scTried').textContent = '✅ We tried it! +2 ⭐'; say('Brilliant! You are a real scientist. Two stars!');
    };
  }

  /* --- mini-labs --- */
  const labOf = id => D().LABS.find(L => L.id === id) || D().LABS[0];
  function labWin(L, msg) {
    const S = sc(), first = !S.labs[L.id], stars = first ? 3 : 1;
    S.labs[L.id] = (+S.labs[L.id] || 0) + 1; addStars(stars); confetti(40); yay();
    const box = $('#scWin'); if (!box) return;
    box.innerHTML = `<div class="sc-win"><b>🎉 ${esc(msg)}</b><span>+${stars} ⭐</span><div class="row"><button class="btn leaf" id="scLabAgain">Play again</button><button class="btn alt" id="scLabHome">More labs</button></div></div>`;
    box.scrollIntoView({ block: 'nearest' });
    say(`${msg} You earned ${stars} stars!`);
    $('#scLabAgain').onclick = () => go(labView, L.id);
    $('#scLabHome').onclick = () => go(scHome);
  }
  let labNow = null; // the running lab's state, for tests
  function labView(id) {
    document.querySelectorAll('.sc-ghost').forEach(g => g.remove());
    const L = labOf(id);
    view.innerHTML = `${crumbs(`${L.ico} ${esc(L.name)}`)}<p class="sc-how" id="scHow"></p><div class="sc-lab" id="scLab"></div><div id="scWin" aria-live="polite"></div>`;
    wireBack(scHome);
    labNow = { id: L.id };
    LAB[L.id](L, $('#scLab'), t => { $('#scHow').textContent = t; });
  }
  const LAB = {
    // Float or sink: guess, then the thing drops into the tank and floats or sinks.
    float(L, el, how) {
      const items = L.items.filter(x => tierAge() >= 7 || !x[3]), done = {}, nav = navId; let sel = null, good = 0;
      labNow.items = items;
      how('Tap a thing. Will it float or sink? Guess, then watch it drop in the water!'); sayScreen('Float or sink? Tap a thing, then guess!');
      el.innerHTML = `<div class="sc-tank" id="scTank"><div class="sc-water"><i></i></div></div>
        <div class="sc-guess" id="scGuess" hidden><b id="scGq"></b><div class="row"><button class="btn sc-up" data-g="1">⬆️ Float</button><button class="btn sc-down" data-g="0">⬇️ Sink</button></div></div>
        <div class="sc-things">${items.map((x, k) => `<button class="sc-thing" data-k="${k}" aria-label="${esc(x[1])}">${x[0]}<small>${esc(x[1])}</small></button>`).join('')}</div>
        <p class="sc-msg" id="scMsg" aria-live="polite"></p>`;
      const tank = $('#scTank');
      view.querySelectorAll('.sc-thing').forEach(b => b.onclick = () => {
        if (b.disabled) return; sel = +b.dataset.k;
        view.querySelectorAll('.sc-thing').forEach(x => x.classList.toggle('sc-sel', x === b));
        $('#scGuess').hidden = false; $('#scGq').textContent = `Will the ${items[sel][1]} float or sink?`; say(`Will the ${items[sel][1]} float or sink?`);
      });
      view.querySelectorAll('[data-g]').forEach(b => b.onclick = () => {
        if (sel == null) return;
        const k = sel, x = items[k], fl = !!x[2], guess = b.dataset.g === '1'; sel = null;
        if (guess === fl) good++;
        done[k] = true; $('#scGuess').hidden = true;
        const btn = view.querySelector(`.sc-thing[data-k="${k}"]`); btn.disabled = true; btn.classList.remove('sc-sel'); btn.classList.add(fl ? 'fl' : 'sk');
        const n = Object.keys(done).length, it = document.createElement('span');
        it.className = 'sc-drop'; it.textContent = x[0]; it.style.left = (8 + ((n - 1) % 5) * 18) + '%'; tank.appendChild(it);
        requestAnimationFrame(() => requestAnimationFrame(() => { it.classList.add(fl ? 'floats' : 'sinks'); }));
        tone(fl ? [500, 700] : [400, 250]);
        const msg = `${guess === fl ? 'Good guess! ' : 'Surprise! '}The ${x[1]} ${fl ? 'floats' : 'sinks'}. ${x[4] || ''}`;
        $('#scMsg').textContent = msg; say(msg);
        labNow.done = n;
        if (n === items.length) setTimeout(() => { if (nav === navId) labWin(L, `You tested everything! ${good} of ${items.length} guesses right.`); }, wait(1400));
      });
    },
    // Magnets: tap a thing (or drag the magnet onto it); metal things made of iron or steel jump up and stick.
    magnet(L, el, how) {
      const items = L.items.filter(x => tierAge() >= 7 || !x[3]), done = {}, nav = navId;
      labNow.items = items;
      how('Drag the magnet onto a thing, or tap the thing. Does it stick?'); sayScreen('Magnet test! Drag the magnet to a thing, or tap it. Does it stick?');
      el.innerHTML = `<div class="sc-mtable"><div class="sc-mag" id="scMag" aria-hidden="true"><svg viewBox="0 0 60 60">${DR.magnet(30, 32, 1.6)}</svg></div>
        <div class="sc-mrow">${items.map((x, k) => `<button class="sc-thing sc-mt" data-k="${k}" aria-label="${esc(x[1])}"><span class="sc-me">${x[0]}</span><small>${esc(x[1])}</small></button>`).join('')}</div></div>
        <div class="sc-mres"><div><b>🧲 Sticks</b><span id="scYes"></span></div><div><b>🚫 Doesn't stick</b><span id="scNo"></span></div></div>
        <p class="sc-msg" id="scMsg" aria-live="polite"></p>`;
      const mag = $('#scMag'), table = view.querySelector('.sc-mtable');
      const test = k => {
        if (done[k] || nav !== navId) return; done[k] = true;
        const b = view.querySelector(`.sc-mt[data-k="${k}"]`), x = items[k], yes = !!x[2];
        const tr = table.getBoundingClientRect(), br = b.getBoundingClientRect();
        mag.style.left = (br.left - tr.left + br.width / 2 - 30) + 'px'; mag.classList.add('down');
        b.disabled = true; b.classList.add(yes ? 'stick' : 'nope');
        tone(yes ? [880, 1100] : [300]);
        const msg = yes ? `Snap! The ${x[1]} sticks. ${x[4] || 'It has iron or steel in it.'}` : `Nothing happens. The ${x[1]} is not magnetic. ${x[4] || ''}`;
        $('#scMsg').textContent = msg; say(msg);
        $(yes ? '#scYes' : '#scNo').insertAdjacentHTML('beforeend', `<i aria-label="${esc(x[1])}">${x[0]}</i>`);
        setTimeout(() => { if (mag.isConnected) mag.classList.remove('down'); }, wait(900));
        labNow.done = Object.keys(done).length;
        if (labNow.done === items.length) setTimeout(() => { if (nav === navId) labWin(L, 'You tested every thing with the magnet!'); }, wait(1400));
      };
      view.querySelectorAll('.sc-mt').forEach(b => b.onclick = () => test(+b.dataset.k));
      // Dragging the magnet: it follows the finger and tests whatever it is let go over.
      mag.style.touchAction = 'none';
      mag.addEventListener('pointerdown', e => {
        const tr = table.getBoundingClientRect(); try { mag.setPointerCapture(e.pointerId); } catch (x) {}
        mag.classList.add('drag');
        const mv = ev => { mag.style.left = (ev.clientX - tr.left - 30) + 'px'; mag.style.top = (ev.clientY - tr.top - 30) + 'px'; };
        const up = ev => { mag.removeEventListener('pointermove', mv); mag.removeEventListener('pointerup', up); mag.classList.remove('drag'); mag.style.top = '';
          mag.style.visibility = 'hidden'; const u = document.elementFromPoint(ev.clientX, ev.clientY); mag.style.visibility = '';
          const b = u && u.closest('.sc-mt'); if (b && !b.disabled) test(+b.dataset.k); };
        mag.addEventListener('pointermove', mv); mag.addEventListener('pointerup', up);
      });
    },
    // Grow a plant: each stage needs water and sunshine.
    plant(L, el, how) {
      const ST = L.stages, nav = navId; let stage = 0, w = false, s = false;
      labNow.stage = 0;
      how('Give your seed water 💧 and sunshine ☀️. Each time it gets both, it grows!'); sayScreen('Grow a plant! Give it water and sunshine.');
      const draw = () => {
        const g = stage, stem = [0, 8, 26, 40, 50, 56][g];
        const leaves = g >= 2 ? `<path d="M100,${92 - stem * 0.5} q-16,-10 -22,0 q10,8 22,0Z" fill="#2FA36B"/><path d="M100,${92 - stem * 0.6} q16,-10 22,0 q-10,8 -22,0Z" fill="#2FA36B"/>` : '';
        const more = g >= 3 ? `<path d="M100,${92 - stem * 0.85} q-14,-8 -18,0 q8,6 18,0Z" fill="#3DBB7A"/><path d="M100,${92 - stem * 0.9} q14,-8 18,0 q-8,6 -18,0Z" fill="#3DBB7A"/>` : '';
        const top = g === 4 ? `<ellipse cx="100" cy="${92 - stem - 4}" rx="6" ry="9" fill="#7FB04A" stroke="${OL}" stroke-width="1"/>` : g >= 5 ? `<g class="sc-a sc-grow">${Array.from({ length: 8 }, (_, i) => `<ellipse cx="100" cy="${92 - stem - 14}" rx="5" ry="11" fill="#FFC23D" stroke="#E0A020" transform="rotate(${i * 45} 100 ${92 - stem - 4})"/>`).join('')}<circle cx="100" cy="${92 - stem - 4}" r="7" fill="#8B5A2B"/></g>` : '';
        const roots = g >= 1 ? `<path d="M100,96 l0,10 M100,100 l-7,8 M100,102 l7,8" stroke="#FFF3D6" stroke-width="1.8" stroke-linecap="round"/>` : '';
        $('#scPlant').innerHTML = `<svg class="sc-scene" viewBox="0 0 200 120" role="img" aria-label="${ST[g][0]}">${BG.sky}<rect x="70" y="92" width="60" height="22" fill="#8B6239"/>${roots}${g === 0 ? DR.seed(100, 100, 1.4) : `<g class="sc-a sc-grow"><line x1="100" y1="96" x2="100" y2="${96 - stem}" stroke="#2FA36B" stroke-width="3"/>${leaves}${more}${top}</g>`}${DR.pot(100, 104, 2.3)}${w ? '<text x="40" y="60" font-size="20">💧</text>' : ''}${s ? DR.sun(160, 26, 1) : ''}</svg>`;
        $('#scStage').innerHTML = `<b>${ST[g][1]} ${esc(ST[g][0])}</b><span>${esc(tierAge() >= 9 ? ST[g][3] : ST[g][2])}</span>`;
        view.querySelectorAll('.sc-pdots i').forEach((d, k) => d.classList.toggle('on', k <= g));
      };
      el.innerHTML = `<div class="sc-pic" id="scPlant"></div><div class="sc-pdots" aria-hidden="true">${ST.map(() => '<i></i>').join('')}</div><p class="sc-stage" id="scStage"></p>
        <div class="row"><button class="btn sc-water-b" id="scW">💧 Water</button><button class="btn sc-sun-b" id="scS">☀️ Sunshine</button></div><p class="sc-msg" id="scMsg" aria-live="polite"></p>`;
      draw();
      const give = kind => {
        if (stage >= ST.length - 1 || nav !== navId) return;
        let msg;
        if (kind === 'w') { if (w) msg = 'Splash! The soil is wet already. Now it needs sunshine.'; else { w = true; msg = 'Glug glug! The roots drink the water.'; tone([500, 600]); } }
        else { if (s) msg = 'It has lots of sunshine. Now it needs a drink of water.'; else { s = true; msg = 'Warm sunshine! The leaves catch the light.'; tone([700, 900]); } }
        if (w && s) { stage++; w = s = false; msg = `It grew! ${ST[stage][2]}`; yay(); labNow.stage = stage; }
        draw(); $('#scMsg').textContent = msg; say(msg);
        if (stage === ST.length - 1) { $('#scW').disabled = $('#scS').disabled = true; setTimeout(() => { if (nav === navId) labWin(L, 'Your seed grew into a flower!'); }, wait(1200)); }
      };
      $('#scW').onclick = () => give('w'); $('#scS').onclick = () => give('s');
    },
    // Dress for the weather: three kinds of day, put on the right clothes, then Check.
    weather(L, el, how) {
      const W = L.days, nav = navId; let r = 0, on = new Set(), said = -1;
      labNow.round = 0;
      how('Look at the weather. Tap clothes to put them on, then tap Check.');
      const draw = () => {
        const d = W[r];
        el.innerHTML = `<div class="sc-wday"><div class="sc-pic">${scene(d.pic, d.name)}</div><b>${d.ico} ${esc(d.name)}</b></div>
          <div class="sc-kid" aria-live="polite"><span class="sc-kidf" aria-hidden="true">🧒</span><span class="sc-worn">${[...on].map(k => `<i>${L.clothes[k][0]}</i>`).join('') || '<small>Nothing on yet</small>'}</span></div>
          <div class="sc-wardrobe">${L.clothes.map((c, k) => `<button class="sc-cl" data-c="${k}" aria-pressed="${on.has(k)}" aria-label="${esc(c[1])}">${c[0]}<small>${esc(c[1])}</small></button>`).join('')}</div>
          <p class="sc-msg" id="scMsg" aria-live="polite"></p>
          <div class="row"><button class="btn leaf" id="scWChk">Check ✓</button></div><p class="note">Day ${r + 1} of ${W.length}</p>`;
        view.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { const k = +b.dataset.c; on.has(k) ? on.delete(k) : on.add(k); tone([on.has(k) ? 700 : 400]); const m = $('#scMsg').textContent; draw(); $('#scMsg').textContent = m; });
        $('#scWChk').onclick = () => {
          const name = k => L.clothes[k][1];
          const miss = d.need.filter(k => !on.has(k)), bad = d.bad.filter(k => on.has(k));
          let msg;
          if (bad.length) { msg = `Hmm, ${name(bad[0])} on a ${d.name.toLowerCase()} day? ${d.badWhy}`; oops(); }
          else if (miss.length) { msg = `Almost! You still need ${miss.map(name).join(' and ')}. ${d.needWhy}`; oops(); }
          else {
            yay(); r++; labNow.round = r; on = new Set();
            if (r >= W.length) { msg = 'Everyone is dressed just right!'; $('#scMsg').textContent = msg; $('#scWChk').disabled = true; setTimeout(() => { if (nav === navId) labWin(L, 'You dressed for every kind of weather!'); }, wait(800)); return; }
            msg = `Perfect for a ${d.name.toLowerCase()} day! Next: a ${W[r].name.toLowerCase()} day.`; draw();
          }
          $('#scMsg').textContent = msg; say(msg);
        };
        if (said !== r) { said = r; sayScreen(`It's a ${d.name.toLowerCase()} day. ${d.say} What should you wear?`); }
      };
      draw();
    },
    // Shadow puppets: move the sun across the sky; the puppet's shadow swings and stretches.
    shadow(L, el, how) {
      const nav = navId; let p = 0.2, ch = 0, pup = L.puppets[0][0], playing = 0;
      labNow.challenge = 0;
      how('Drag the sun across the sky, or use the buttons. Watch the shadow!');
      el.innerHTML = `<div class="sc-pic sc-shbox"><svg id="scSh" class="sc-scene" viewBox="0 0 300 180" role="img" aria-label="A puppet and its shadow"></svg></div>
        <div class="row sc-shbtn"><button class="btn alt" id="scSL" aria-label="Move the sun left">◀ 🌅</button><button class="btn alt" id="scSP">▶️ Play the day</button><button class="btn alt" id="scSR" aria-label="Move the sun right">🌇 ▶</button></div>
        <div class="chips sc-pups">${L.puppets.map(x => `<button data-pup="${x[0]}" aria-pressed="${x[0] === pup}" aria-label="${esc(x[1])}">${x[0]} ${esc(x[1])}</button>`).join('')}</div>
        <p class="sc-task" id="scTask"></p><p class="sc-msg" id="scMsg" aria-live="polite"></p>`;
      const geo = () => {
        const sx = 30 + 240 * p, sy = 76 - 62 * Math.sin(Math.PI * p);
        const t = (150 - sy) / (90 - sy), dx = clamp((150 - sx) * t, -150, 150);
        return { sx, sy, dx };
      };
      const draw = () => {
        const { sx, sy, dx } = geo(), k = -dx / 60;
        $('#scSh').innerHTML = `<rect width="300" height="180" fill="${p < 0.15 || p > 0.85 ? '#FFD3B0' : '#CDE9FB'}"/><rect y="150" width="300" height="30" fill="#8FD18A"/>
          <g transform="matrix(1 0 ${f1(k)} -0.4 150 150)" opacity=".5" class="sc-shadow"><text x="0" y="0" font-size="60" text-anchor="middle" style="filter:brightness(0)">${pup}</text></g>
          <text x="150" y="150" font-size="60" text-anchor="middle">${pup}</text>
          <g id="scSun" class="sc-sundrag">${DR.sun(f1(sx), f1(sy), 1.1)}<circle cx="${f1(sx)}" cy="${f1(sy)}" r="26" fill="transparent"/></g>`;
        $('#scSh').setAttribute('aria-label', `The sun is ${p < 0.35 ? 'low on the left' : p > 0.65 ? 'low on the right' : 'high in the sky'}; the shadow is ${Math.abs(dx) < 35 ? 'short' : 'long'} and points ${dx < 0 ? 'left' : 'right'}.`);
        labNow.p = p; labNow.dx = dx;
      };
      const C = L.challenges;
      const task = () => { if (ch < C.length) { $('#scTask').innerHTML = `<b>Challenge ${ch + 1} of ${C.length}:</b> ${esc(C[ch].t)}`; say(C[ch].t); } };
      const check = () => {
        if (ch >= C.length) return;
        const { dx } = geo();
        if (C[ch].ok(dx)) {
          const msg = C[ch].win; ch++; labNow.challenge = ch; yay();
          $('#scMsg').textContent = msg;
          if (ch >= C.length) { $('#scTask').textContent = 'All challenges done!'; say(msg); setTimeout(() => { if (nav === navId) labWin(L, 'You are a shadow scientist!'); }, wait(1000)); }
          else setTimeout(() => { if (nav === navId) { say(msg); task(); } }, wait(300));
        }
      };
      const setP = v => { p = clamp(v, 0, 1); draw(); check(); };
      draw(); sayScreen('Shadow puppets! Move the sun and watch the shadow change.'); setTimeout(() => { if (nav === navId) task(); }, wait(1600)); $('#scTask').innerHTML = `<b>Challenge 1 of ${C.length}:</b> ${esc(C[0].t)}`;
      $('#scSL').onclick = () => setP(p - 0.1); $('#scSR').onclick = () => setP(p + 0.1);
      $('#scSP').onclick = () => {
        if (playing) return; playing = 1; let t0 = null; p = 0;
        const step = ts => { if (nav !== navId || !$('#scSh')) { playing = 0; return; } t0 = t0 || ts; const v = Math.min(1, (ts - t0) / (fast ? 300 : 5000)); p = v; draw(); if (v < 1) requestAnimationFrame(step); else { playing = 0; check(); } };
        requestAnimationFrame(step);
      };
      view.querySelectorAll('[data-pup]').forEach(b => b.onclick = () => { pup = b.dataset.pup; view.querySelectorAll('[data-pup]').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); });
      const svg = $('#scSh'); svg.style.touchAction = 'none';
      svg.addEventListener('pointerdown', e => {
        const r = svg.getBoundingClientRect(), { sx, sy } = geo(), x = (e.clientX - r.left) / r.width * 300, y = (e.clientY - r.top) / r.height * 180;
        if (Math.hypot(x - sx, y - sy) > 40) return;
        try { svg.setPointerCapture(e.pointerId); } catch (z) {}
        const mv = ev => { const xx = (ev.clientX - r.left) / r.width * 300; p = clamp((xx - 30) / 240, 0, 1); draw(); };
        const up = () => { svg.removeEventListener('pointermove', mv); svg.removeEventListener('pointerup', up); check(); };
        svg.addEventListener('pointermove', mv); svg.addEventListener('pointerup', up);
      });
    },
    // Planet order: drag the planets into place, from the Sun outwards.
    planets(L, el, how) {
      const list = tierAge() >= 7 ? L.planets : L.planets.slice(0, 4), nav = navId;
      labNow.n = list.length;
      how(`Drag the planets into order, starting next to the Sun ☀️.${tierAge() >= 9 ? ' Tip: My Very Easy Method Just Speeds Up Naming!' : ''}`);
      sayScreen(`Put the ${list.length} planets in order, starting next to the Sun.`);
      el.innerHTML = `<div class="sc-sunbar" aria-hidden="true">☀️ <span>The Sun</span></div><div id="scPl"></div><p class="sc-msg" id="scMsg" aria-live="polite"></p>`;
      orderUI($('#scPl'), list.map(x => ['@' + x[0], x[1]]), { grid: 4, onCheck: ok => {
        if (ok) { $('#scMsg').textContent = list.map(x => x[1]).join(', ') + '!'; setTimeout(() => { if (nav === navId) labWin(L, 'You put the planets in order!'); }, wait(900)); }
        else { oops(); say('Some planets are in the wrong place. Try again!'); }
      } });
    }
  };

  /* --- for the grown-ups' report and What's inside --- */
  function info() {
    const { TOPICS, LABS, HOME } = D();
    return { topics: TOPICS.length, cards: TOPICS.reduce((a, T) => a + T.cards.length, 0), questions: TOPICS.reduce((a, T) => a + T.quiz.length + T.quiz.filter(q => q.h).length, 0), labs: LABS.length, home: HOME.length,
      kinds: [...new Set(TOPICS.flatMap(T => T.quiz.map(q => q.k)))].length };
  }
  function stats(sci) {
    const S = isObj(sci) ? sci : {}, o = k => isObj(S[k]) ? S[k] : {}, { TOPICS, LABS, HOME } = D();
    const quiz = o('quiz');
    return { topics: TOPICS.length, read: TOPICS.filter(T => o('cards')[T.id]).length, badges: TOPICS.filter(T => o('badges')[T.id]).length,
      quizzes: TOPICS.reduce((a, T) => a + (isObj(quiz[T.id]) ? +quiz[T.id].n || 0 : 0), 0), labs: LABS.filter(L => +o('labs')[L.id] > 0).length, labsAll: LABS.length,
      home: HOME.filter(h => o('home')[h.id]).length, homeAll: HOME.length, badgeNames: TOPICS.filter(T => o('badges')[T.id]).map(T => `${T.badge} ${T.bname}`),
      next: TOPICS.find(T => !o('badges')[T.id]) || null };
  }

  if (location.hash === '#selftest') window.__science = {
    D, built: () => !!DATA, sc: () => sc(), cardText, quizOf, scene, info, stats, get cur() { return cur; }, get lab() { return labNow; }, set fast(v) { fast = !!v; },
    home: () => go(scHome), topic: (id, i) => go(topicView, id, i || 0), quiz: id => go(quizView, id), labView: id => go(labView, id), exp: id => go(homeExpView, id)
  };
  scHome.info = info; scHome.stats = stats;
  return scHome;
})();
