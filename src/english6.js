/* ---------- English & Reading, part 6: data for round 3 (letter shapes, sound games, Talk time, phrase cards) ---------- */
// The screens are in english8.js. Letters are drawn in a box 160 tall: the top line is y 20, the dashed middle line
// y 65, the base line y 110 and the tail line y 150. Each letter is [width, stroke, stroke...]; strokes are in the
// order children are taught, each one an SVG path that starts where the pencil goes down.
const EN_ABC = {
  A: [80, 'M40 20 L12 110', 'M40 20 L68 110', 'M24 74 L56 74'],
  B: [72, 'M15 20 L15 110', 'M15 20 C66 18 66 64 15 65', 'M15 65 C76 64 76 112 15 110'],
  C: [76, 'M66 34 C52 12 14 16 14 65 C14 114 52 118 66 96'],
  D: [76, 'M15 20 L15 110', 'M15 20 C80 20 80 110 15 110'],
  E: [68, 'M15 20 L15 110', 'M15 20 L60 20', 'M15 65 L52 65', 'M15 110 L60 110'],
  F: [66, 'M15 20 L15 110', 'M15 20 L58 20', 'M15 65 L50 65'],
  G: [78, 'M66 34 C52 12 14 16 14 65 C14 114 56 118 66 92 L66 70 L44 70'],
  H: [76, 'M15 20 L15 110', 'M61 20 L61 110', 'M15 65 L61 65'],
  I: [60, 'M30 20 L30 110', 'M12 20 L48 20', 'M12 110 L48 110'],
  J: [66, 'M48 20 L48 88 C48 118 14 118 12 92', 'M28 20 L62 20'],
  K: [70, 'M15 20 L15 110', 'M60 20 L15 70', 'M30 56 L62 110'],
  L: [62, 'M15 20 L15 110 L56 110'],
  M: [84, 'M12 110 L12 20 L42 76 L72 20 L72 110'],
  N: [76, 'M15 110 L15 20 L61 110 L61 20'],
  O: [82, 'M41 20 C10 20 10 110 41 110 C72 110 72 20 41 20'],
  P: [68, 'M15 20 L15 110', 'M15 20 C68 20 68 68 15 68'],
  Q: [84, 'M41 20 C10 20 10 110 41 110 C72 110 72 20 41 20', 'M48 86 L74 116'],
  R: [70, 'M15 20 L15 110', 'M15 20 C68 20 68 66 15 66', 'M34 66 L64 110'],
  S: [70, 'M60 32 C50 14 16 18 18 40 C20 60 60 60 60 86 C60 112 20 116 12 96'],
  T: [76, 'M38 20 L38 110', 'M10 20 L66 20'],
  U: [76, 'M15 20 L15 80 C15 118 61 118 61 80 L61 20'],
  V: [78, 'M10 20 L39 110 L68 20'],
  W: [92, 'M8 20 L26 110 L46 46 L66 110 L84 20'],
  X: [74, 'M12 20 L62 110', 'M62 20 L12 110'],
  Y: [76, 'M12 20 L38 65', 'M64 20 L38 65 L38 110'],
  Z: [72, 'M12 20 L60 20 L12 110 L60 110'],
  a: [72, 'M56 74 C46 60 16 62 16 88 C16 114 50 116 56 100', 'M57 65 L57 110'],
  b: [70, 'M15 20 L15 110', 'M15 84 C24 60 58 62 58 88 C58 114 24 116 15 98'],
  c: [66, 'M54 74 C44 60 14 62 14 88 C14 114 44 116 54 104'],
  d: [72, 'M56 74 C46 60 16 62 16 88 C16 114 50 116 56 100', 'M57 20 L57 110'],
  e: [68, 'M16 88 L56 88 C56 62 16 60 16 88 C14 114 46 116 56 104'],
  f: [60, 'M50 28 C44 16 28 16 28 34 L28 110', 'M12 66 L46 66'],
  g: [72, 'M56 74 C46 60 16 62 16 88 C16 114 50 116 56 100', 'M57 65 L57 130 C57 152 22 152 16 136'],
  h: [68, 'M15 20 L15 110', 'M15 82 C22 60 54 60 54 82 L54 110'],
  i: [44, 'M22 65 L22 110', 'M22 44 L22 47'],
  j: [52, 'M36 65 L36 130 C36 152 12 150 10 136', 'M36 44 L36 47'],
  k: [64, 'M15 20 L15 110', 'M52 65 L15 92', 'M28 84 L54 110'],
  l: [40, 'M20 20 L20 110'],
  m: [80, 'M10 65 L10 110', 'M10 80 C14 60 38 60 39 80 L39 110', 'M39 80 C43 60 68 60 68 80 L68 110'],
  n: [68, 'M15 65 L15 110', 'M15 80 C20 60 54 60 54 80 L54 110'],
  o: [70, 'M35 65 C12 65 12 110 35 110 C58 110 58 65 35 65'],
  p: [70, 'M15 65 L15 150', 'M15 80 C24 60 58 62 58 88 C58 114 24 116 15 98'],
  q: [72, 'M56 74 C46 60 16 62 16 88 C16 114 50 116 56 100', 'M57 65 L57 150'],
  r: [60, 'M15 65 L15 110', 'M15 84 C20 64 40 62 52 70'],
  s: [64, 'M52 72 C46 62 18 62 18 76 C18 88 52 86 52 98 C52 112 22 114 12 104'],
  t: [60, 'M30 28 L30 102 C30 112 42 112 50 106', 'M14 65 L48 65'],
  u: [68, 'M15 65 L15 92 C15 116 54 116 54 92 L54 65 L54 110'],
  v: [66, 'M10 65 L33 110 L56 65'],
  w: [80, 'M8 65 L22 110 L39 74 L56 110 L70 65'],
  x: [62, 'M12 65 L52 110', 'M52 65 L12 110'],
  y: [66, 'M10 65 L33 108', 'M56 65 L20 150'],
  z: [62, 'M12 65 L52 65 L12 110 L52 110']
};
// How to say each stroke, for the voice and for the hint under the letter.
const EN_ABC_TALK = {
  line: ['Straight down.', 'Across.', 'Slide down.', 'Across the middle.'],
  A: 'Slide down, slide down, then across the middle.', B: 'Down, then two bumps.', C: 'Round like a big C.', D: 'Down, then a big round tummy.', E: 'Down, then three lines across.',
  F: 'Down, then two lines across.', G: 'Round like C, then in and across.', H: 'Down, down, then across.', I: 'Down, then a hat and a shoe.', J: 'Down and hook, then a hat.',
  K: 'Down, then in and out.', L: 'Down, then along the floor.', M: 'Up, down, up, down.', N: 'Up, down, up.', O: 'Round and round, back to the start.',
  P: 'Down, then up and round.', Q: 'Round like O, then a little tail.', R: 'Down, round, then a leg.', S: 'Curve back, then curve forward.', T: 'Down, then a line across the top.',
  U: 'Down, round, and up.', V: 'Down and up.', W: 'Down, up, down, up.', X: 'Slide down, then cross over.', Y: 'Slide in, slide in, then down.', Z: 'Across, slide back, across.',
  a: 'Round like c, then up and down.', b: 'Down, then up and round.', c: 'Round like a little c.', d: 'Round like c, then tall up and down.', e: 'Across, then round like c.',
  f: 'Hook and down, then across.', g: 'Round like c, then down and hook.', h: 'Down, then up and over.', i: 'Down, then a dot.', j: 'Down and hook, then a dot.',
  k: 'Down, then in and out.', l: 'Tall, straight down.', m: 'Down, up and over, up and over.', n: 'Down, up and over.', o: 'Round and round, back to the start.',
  p: 'Down low, then up and round.', q: 'Round like c, then down low.', r: 'Down, then up and over a little.', s: 'Curve back, then curve forward.', t: 'Down and flick, then across.',
  u: 'Down, round, up and down.', v: 'Down and up.', w: 'Down, up, down, up.', x: 'Slide down, then cross over.', y: 'Slide in, then a long line down.', z: 'Across, slide back, across.'
};
// Short words to trace once letters are going well: [word, emoji].
const EN_TRACE_WORDS = [['cat', '🐱'], ['dog', '🐶'], ['sun', '☀️'], ['mom', '👩'], ['dad', '👨'], ['pig', '🐷'], ['hat', '🎩'], ['bed', '🛏️'], ['bus', '🚌'], ['red', '🔴'],
  ['fish', '🐟'], ['frog', '🐸'], ['love', '❤️'], ['book', '📖'], ['star', '⭐'], ['duck', '🦆'], ['home', '🏠'], ['yes', '👍'], ['zoo', '🦓'], ['cake', '🎂']];

/* --- sound games (phonemic awareness) --- */
// Sounds for chunks the first data file does not list.
const EN_SND6 = Object.assign({}, EN_SND, { gg: 'guh', ee: 'ee', ea: 'ee', ey: 'ee', oo: 'oo', oa: 'oh', ai: 'ay', ay: 'ay', ar: 'ar', or: 'or', igh: 'eye', ie: 'eye', oe: 'oh', ow: 'ow', ou: 'ow', ck: 'kuh', ll: 'lll', ss: 'sss', x: 'ks' });
// Words split into their sounds (one chunk per sound): "word:emoji:s-o-u-n-d-s".
const EN_PHON = ('up:⬆️:u-p,egg:🥚:e-gg,bee:🐝:b-ee,key:🔑:k-ey,tea:🍵:t-ea,cow:🐮:c-ow,pie:🥧:p-ie,toe:🦶:t-oe,car:🚗:c-ar,' +
  'cat:🐱:c-a-t,dog:🐶:d-o-g,sun:☀️:s-u-n,pig:🐷:p-i-g,bed:🛏️:b-e-d,bus:🚌:b-u-s,fish:🐟:f-i-sh,ship:🚢:sh-i-p,duck:🦆:d-u-ck,moon:🌙:m-oo-n,boat:⛵:b-oa-t,rain:🌧️:r-ai-n,night:🌃:n-igh-t,chick:🐥:ch-i-ck,sheep:🐑:sh-ee-p,book:📖:b-oo-k,star:⭐:s-t-ar,fork:🍴:f-or-k,' +
  'frog:🐸:f-r-o-g,crab:🦀:c-r-a-b,drum:🥁:d-r-u-m,flag:🚩:f-l-a-g,tent:⛺:t-e-n-t,hand:✋:h-a-n-d,nest:🪺:n-e-s-t,snail:🐌:s-n-ai-l,train:🚆:t-r-ai-n,spoon:🥄:s-p-oo-n,lamp:💡:l-a-m-p,milk:🥛:m-i-l-k,clock:🕰️:c-l-o-ck,' +
  'plant:🪴:p-l-a-n-t,stamp:📮:s-t-a-m-p,drink:🥤:d-r-i-n-k,splash:💦:s-p-l-a-sh')
  .split(',').map(x => { const [w, e, s] = x.split(':'); return { w, e, s: s.split('-') }; });
// Three-sound words for "change one sound" and "first, middle or last sound".
const EN_CVC = ('cat:🐱,hat:🎩,bat:🦇,rat:🐀,cap:🧢,can:🥫,map:🗺️,tap:🚰,van:🚐,man:👨,pan:🍳,bag:👜,hot:🔥,pot:🍲,dot:⚫,dog:🐶,log:🪵,fog:🌫️,mop:🧹,' +
  'pig:🐷,dig:⛏️,pin:📌,bin:🗑️,fin:🦈,zip:🤐,lip:👄,kit:🧰,sit:🪑,sun:☀️,bun:🍞,run:🏃,nut:🥜,hut:🛖,cut:✂️,bug:🐛,mug:☕,hug:🤗,jug:🫗,cup:🥤,pup:🐕,bus:🚌,' +
  'bed:🛏️,red:🔴,ten:🔟,hen:🐔,pen:🖊️,net:🥅,jet:✈️,wet:💦,web:🕸️,leg:🦵,ship:🚢,shop:🛍️,chip:🍟,fish:🐟,dish:🍽️,sock:🧦,rock:🪨,lock:🔒,duck:🦆')
  .split(',').map(x => { const [w, e] = x.split(':'), s = w.length === 4 ? (/^(sh|ch)/.test(w) ? [w.slice(0, 2), w[2], w[3]] : [w[0], w[1], w.slice(2)]) : w.split(''); return { w, e, s }; });
// Words to clap: "word:emoji:syl-la-bles".
const EN_CLAP = ('cat:🐱:cat,sun:☀️:sun,frog:🐸:frog,bird:🐦:bird,cake:🎂:cake,tree:🌳:tree,apple:🍎:ap-ple,tiger:🐯:ti-ger,rabbit:🐰:rab-bit,pencil:✏️:pen-cil,monkey:🐵:mon-key,' +
  'rocket:🚀:rock-et,zebra:🦓:ze-bra,carrot:🥕:car-rot,rainbow:🌈:rain-bow,popcorn:🍿:pop-corn,penguin:🐧:pen-guin,cupcake:🧁:cup-cake,pizza:🍕:piz-za,' +
  'banana:🍌:ba-na-na,dinosaur:🦕:di-no-saur,kangaroo:🦘:kan-ga-roo,umbrella:☂️:um-brel-la,hamburger:🍔:ham-bur-ger,octopus:🐙:oc-to-pus,pineapple:🍍:pine-ap-ple,tomato:🍅:to-ma-to,butterfly:🦋:but-ter-fly,elephant:🐘:el-e-phant,' +
  'watermelon:🍉:wa-ter-mel-on,caterpillar:🐛:cat-er-pil-lar,helicopter:🚁:hel-i-cop-ter,alligator:🐊:al-li-ga-tor,avocado:🥑:av-o-ca-do')
  .split(',').map(x => { const [w, e, c] = x.split(':'); return { w, e, parts: c.split('-') }; });

/* --- Talk time: everyday expressions and friendly slang, each with a meaning card --- */
// [id, phrase, emoji, meaning, when to use it, kind]
const EN_PHRASES = [
  ['please', 'Please', '🙏', 'The magic word you add when you ask for something.', 'Can I have a turn, please?', 'polite'],
  ['thanks', 'Thank you', '💐', 'What you say when someone gives you something or helps you.', 'Thank you for the sticker!', 'polite'],
  ['welcome', "You're welcome", '😊', 'A kind answer when someone says thank you.', '"Thanks for helping!" "You\'re welcome!"', 'polite'],
  ['excuse', 'Excuse me', '🙋', 'A polite way to get someone\'s attention, or to get past them.', 'Excuse me, where is the library?', 'polite'],
  ['sorry', "I'm sorry", '😔', 'What you say when you made a mistake or someone is sad.', "I'm sorry I bumped you.", 'polite'],
  ['bless', 'Bless you!', '🤧', 'What people often say when someone sneezes.', '"Achoo!" "Bless you!"', 'everyday'],
  ['nice', 'Nice to meet you', '🤝', 'What you say when you meet someone for the first time.', "Hi, I'm Mia. Nice to meet you!", 'everyday'],
  ['howgoing', "How's it going?", '🙂', 'A friendly way to ask "How are you?"', "Hey Sam, how's it going?", 'everyday'],
  ['hereyougo', 'Here you go', '🫴', 'What you say when you hand something to someone.', 'Here you go, one apple!', 'everyday'],
  ['howmuch', 'How much is it?', '💰', 'A question to ask what something costs.', 'How much is the teddy bear?', 'everyday'],
  ['holdon', 'Hold on', '✋', 'Wait a little moment, please.', 'Hold on, I will get my mom.', 'everyday'],
  ['getwell', 'Get well soon', '🤒', 'A kind wish for someone who is sick.', 'Get well soon, Grandpa!', 'everyday'],
  ['makewish', 'Make a wish!', '🎂', 'What people say before you blow out birthday candles.', 'Close your eyes and make a wish!', 'everyday'],
  ['niceday', 'Have a nice day!', '🌞', 'A friendly goodbye.', 'Bye! Have a nice day!', 'everyday'],
  ['takecare', 'Take care', '💛', 'A caring way to say goodbye.', 'See you next week. Take care!', 'everyday'],
  ['myturn', 'Can I have a turn?', '🔄', 'A nice way to ask to play next.', 'That looks fun. Can I have a turn?', 'everyday'],
  ['whatsup', "What's up?", '👋', 'Slang for "Hi! How are you? What are you doing?"', "Hey Leo, what's up?", 'slang'],
  ['awesome', 'Awesome!', '🤩', 'Slang for "really great!"', 'We won the game? Awesome!', 'slang'],
  ['cool', 'Cool!', '😎', 'Slang for "nice!" or "I like it!" (not cold!)', 'You have a dinosaur kite? Cool!', 'slang'],
  ['noworries', 'No worries', '👌', 'Slang for "That\'s okay, don\'t worry about it."', '"Sorry I\'m late!" "No worries!"', 'slang'],
  ['seeya', 'See ya!', '👋', 'Slang for "See you later, goodbye!"', 'See ya tomorrow at school!', 'slang'],
  ['later', 'Catch you later!', '🎣', 'Slang for "Goodbye, see you soon." Nobody gets caught!', 'I have to go home now. Catch you later!', 'slang'],
  ['mybad', 'My bad', '🙈', 'Slang for "Oops, that was my mistake."', 'I kicked the ball the wrong way. My bad!', 'slang'],
  ['noway', 'No way!', '😲', 'Slang for "Wow, I can\'t believe it!"', 'You saw a real whale? No way!', 'slang'],
  ['highfive', 'High five!', '🙌', 'Slap hands up high to say "well done!"', 'We finished the puzzle. High five!', 'slang'],
  ['gotcha', 'Gotcha!', '👍', 'Slang for "I understand" (or "I caught you!" in tag).', '"Put your shoes by the door." "Gotcha!"', 'slang'],
  ['youbet', 'You bet!', '✅', 'Slang for "Yes, for sure!"', '"Want to play?" "You bet!"', 'slang'],
  ['kidding', 'Just kidding!', '😜', 'I was only joking, it is not true.', 'I ate 100 cookies. Just kidding!', 'slang'],
  ['piece', 'Piece of cake', '🍰', 'Something very easy. No cake needed!', 'That puzzle was a piece of cake.', 'slang'],
  ['yourock', 'You rock!', '🎸', 'Slang for "You are great!"', 'You helped me clean up. You rock!', 'slang'],
  ['samehere', 'Same here!', '🙋', 'Slang for "Me too!"', '"I love pizza!" "Same here!"', 'slang'],
  ['deal', "It's a deal!", '🤝', 'We agree on a plan.', 'You build the tower, I build the bridge. Deal!', 'slang'],
  ['stuffed', "I'm stuffed", '😮‍💨', 'Slang for "I am very full, I ate a lot!"', 'No more pizza for me, I\'m stuffed!', 'slang'],
  ['chill', 'Chill out', '🧊', 'Slang for "Calm down, relax."', "Chill out, it's only a game.", 'slang']
];
// Talk time scenes. Each turn: [who says it, their line, replies [[text, good?, what Owl says]], their answer after a good reply, a phrase card to show].
// Replies are always: one friendly and fitting, the others rude or off topic, so a child learns what fits.
const EN_TALK = [
  { id: 'park', ico: '🛝', name: 'At the park', stage: 1, who: ['🧒', 'Leo'], place: '🌳🛝🌳', turns: [
    ["Hi! What's up?", [["Hi! I'm playing on the slide. Want to come?", 1, "Great! You answered and asked him to play."], ['Go away.', 0, "Ouch, that is not friendly. Try a kinder one!"], ['Bananas are yellow.', 0, "Funny, but he asked what you are doing."]], 'Cool! I love the slide!', 'whatsup'],
    ['Can I have a turn on the swing?', [['Sure! Here you go.', 1, 'Sharing is kind!'], ['No, it is mine forever!', 0, 'Hmm, the swing is for everyone. Try sharing!'], ['I had soup.', 0, "That doesn't answer his question."]], 'Thanks! Wheee!', 'myturn'],
    ['Oops, I bumped you. Sorry!', [['No worries! Are you okay?', 1, '"No worries" means it\'s okay.'], ['You did it on purpose!', 0, 'He said sorry. Be kind back!'], ['My shoes are blue.', 0, 'He said sorry. What do we say?']], "I'm okay! You're nice.", 'noworries'],
    ['I have to go home now.', [['Okay! See ya tomorrow!', 1, '"See ya" is a friendly goodbye.'], ['Whatever.', 0, 'That sounds a little rude. Say a nice goodbye!'], ['Look, a pigeon!', 0, 'He is leaving. Say goodbye!']], 'See ya! Bye!', 'seeya']] },
  { id: 'shop', ico: '🏪', name: 'At the shop', stage: 1, who: ['👩‍💼', 'Mrs. Lee'], place: '🍎🍌🥖', turns: [
    ['Hello! Can I help you?', [['Hello! Can I have some apples, please?', 1, 'Lovely! You said hello and please.'], ['Give me apples.', 0, 'That sounds bossy. Try with please!'], ['I can jump high.', 0, 'Fun! But she asked how she can help.']], 'Of course! How many would you like?', 'please'],
    ['How many apples would you like?', [['Three apples, please.', 1, 'Clear and polite!'], ['Purple!', 0, 'She asked how many, so answer with a number.'], ['None of your business.', 0, 'That is rude. Try again!']], 'Three apples. Here you go!', 'hereyougo'],
    ['That will be two dollars.', [['Here you go. Thank you!', 1, 'Paying and saying thank you. Perfect!'], ['I want a pony.', 0, 'Hmm, it is time to pay.'], ['No!', 0, 'At a shop, we pay for things.']], 'Thank you! Here is your change.', 'thanks'],
    ['Have a nice day!', [['You too! Bye!', 1, '"You too" sends the wish back. Nice!'], ['Hmph.', 0, 'Say something kind back!'], ['What is a day?', 0, 'She is saying a friendly goodbye.']], 'Bye bye!', 'niceday']] },
  { id: 'school', ico: '🏫', name: 'First day at school', stage: 1, who: ['👧', 'Mia'], place: '🏫🎒✏️', turns: [
    ["Hi, I'm Mia. I'm new here.", [["Hi Mia! I'm glad you're here. Nice to meet you!", 1, 'A warm welcome!'], ['So?', 0, 'That might make her feel sad. Try a kinder one!'], ['My cat is fat.', 0, 'She told you her name. Say hello!']], 'Nice to meet you too!', 'nice'],
    ["How's it going?", [["Good, thanks! How about you?", 1, 'You answered and asked her back. Great talking!'], ['Going where?', 0, "\"How's it going?\" means \"How are you?\""], ['Stop talking to me.', 0, 'That is not friendly.']], "I'm a bit nervous, but I'm okay!", 'howgoing'],
    ['Can I sit with you?', [['Sure! Come sit here.', 1, 'Kind and welcoming!'], ['No, this table is only for cool kids.', 0, 'Everyone should feel welcome.'], ['I like broccoli.', 0, 'She asked to sit with you.']], 'Yay! Thank you!', null],
    ['I made a picture for you!', [['Wow, thank you! You rock!', 1, '"You rock" means "you are great!"'], ['Ew, ugly.', 0, 'That would hurt her feelings.'], ['Where is the bus?', 0, 'She gave you a present. What do we say?']], "You're welcome, friend!", 'yourock']] },
  { id: 'birthday', ico: '🎂', name: 'Birthday party', stage: 1, who: ['🧒', 'Ben'], place: '🎈🎂🎁', turns: [
    ["Hi! Thanks for coming to my party!", [['Happy birthday, Ben! This present is for you.', 1, 'You said happy birthday and gave the present.'], ['Where is the cake? I want it now!', 0, 'Say hello and happy birthday first!'], ['I am a teapot.', 0, 'Silly! But it is his birthday.']], 'Wow, thank you so much!', null],
    ["It's cake time! Make a wish!", [["I wish you a super happy birthday!", 1, 'What a kind wish!'], ['Your cake looks yucky.', 0, 'That would make him sad.'], ['I want to go home.', 0, 'Join the fun!']], "Aww, thanks! Let's eat!", 'makewish'],
    ['Do you want more cake?', [["No thank you, I'm stuffed!", 1, '"I\'m stuffed" means "I am very full!"'], ['Give me ten pieces!', 0, 'That is a lot of cake, and a bit bossy!'], ['Cake is a planet.', 0, 'He asked if you want more.']], 'Ha ha, me too!', 'stuffed'],
    ['Thanks for the awesome present!', [["You're welcome! Thanks for inviting me!", 1, 'Polite and kind!'], ['It was cheap.', 0, 'We do not need to say that!'], ['Bye.', 0, 'Answer his thank you first.']], 'See you at school!', 'welcome']] },
  { id: 'doctor', ico: '🩺', name: 'At the doctor', stage: 2, who: ['🧑‍⚕️', 'Dr. Patel'], place: '🏥🩺💊', turns: [
    ['Hello! What seems to be the trouble?', [['Hello. My tummy hurts.', 1, 'You told the doctor clearly what is wrong.'], ['Nothing, I just like the stickers.', 0, 'Tell the doctor how you feel.'], ['I hate doctors!', 0, 'The doctor wants to help you.']], "Oh dear. Let me have a look.", null],
    ['When did it start hurting?', [['It started this morning.', 1, 'Good answer to "when".'], ['In the kitchen.', 0, '"When" asks about time, not a place.'], ['Because.', 0, 'Tell the doctor when.']], 'Thank you. Please take a deep breath.', null],
    ['Achoo! Oh, excuse me!', [['Bless you!', 1, 'People often say "Bless you" after a sneeze.'], ['Gross!', 0, 'That is not very kind.'], ['Where is my hat?', 0, 'The doctor sneezed. What can you say?']], 'Thank you! You are very polite.', 'bless'],
    ['Drink water and rest. You will feel better soon!', [['Thank you, Doctor! Bye!', 1, 'Lovely manners!'], ['No.', 0, 'The doctor is helping you get well.'], ['Do you like trains?', 0, 'Say thank you and goodbye.']], 'Get well soon!', 'getwell']] },
  { id: 'phone', ico: '📞', name: 'A phone call', stage: 2, who: ['👵', 'Grandma'], place: '📱💬🏠', turns: [
    ['Ring ring! Hello, who is this?', [["Hi Grandma! It's me!", 1, 'Say who you are on the phone.'], ['Who are YOU?', 0, 'That sounds rude. Say who you are.'], ['Moo!', 0, 'Silly! Grandma wants to know who is calling.']], 'Hello, sweetie! How are you?', null],
    ['How was your day?', [['It was great! I learned a new song.', 1, 'You told her about your day!'], ['Bye.', 0, 'She wants to chat with you a little.'], ['A day has 24 hours.', 0, 'True! But she asked how YOUR day was.']], 'Wonderful! Will you sing it for me?', null],
    ['Can I talk to your mom, please?', [['Sure! Hold on, I will get her.', 1, '"Hold on" means "wait a moment."'], ['No, she is mine.', 0, 'Grandma asked nicely. Help her!'], ['Hang up!', 0, 'That is not polite.']], 'Thank you, dear!', 'holdon'],
    ['Love you! Talk soon!', [['Love you too, Grandma! Take care!', 1, '"Take care" is a caring goodbye.'], ['Whatever.', 0, 'Grandma said love you. Say something kind!'], ['*hangs up*', 0, 'Say goodbye before you hang up.']], 'Bye bye!', 'takecare']] },
  { id: 'cafe', ico: '🍝', name: 'At a restaurant', stage: 2, who: ['🧑‍🍳', 'Chef Rosa'], place: '🍝🍕🥤', turns: [
    ['Welcome! Are you ready to order?', [['Yes, please. Can I have the pasta?', 1, 'A clear, polite order!'], ['FOOD! NOW!', 0, 'Too loud and bossy. Use please!'], ['I have a sock.', 0, 'She is asking what you want to eat.']], 'Great choice! Anything to drink?', 'please'],
    ['Anything to drink?', [['Some water, please.', 1, 'Polite!'], ['Pasta.', 0, 'You already ordered food. She asked about a drink.'], ['No talking!', 0, 'That is not friendly.']], "Coming right up!", null],
    ["Oops! I dropped a fork. My bad!", [["That's okay! No worries.", 1, '"My bad" means "my mistake."'], ['You are so clumsy!', 0, 'Everybody drops things sometimes.'], ['I want ice cream.', 0, 'She dropped a fork. Be kind!']], "Thanks! Here's a clean fork.", 'mybad'],
    ['How was your food?', [["It was yummy! Thank you, it was awesome!", 1, '"Awesome" means "really great."'], ['Bad.', 0, 'If you liked it, say so! If not, say it kindly.'], ['Where is the moon?', 0, 'She asked about your food.']], "I'm so happy you liked it!", 'awesome']] },
  { id: 'friend', ico: '🧸', name: 'A playdate', stage: 2, who: ['👦', 'Sam'], place: '🧸🧩🏠', turns: [
    ['Want to build a tower with me?', [['You bet! I will get the blocks.', 1, '"You bet" means "yes, for sure!"'], ['No, I play alone.', 0, 'Sam wants to play with you!'], ['Towers are tall.', 0, 'Answer his question!']], 'Yay! Let\'s go!', 'youbet'],
    ["You build the bottom, I'll build the top. Deal?", [["It's a deal!", 1, 'Making a plan together. Great teamwork!'], ['I do everything!', 0, 'Share the job!'], ['Purple monkey!', 0, 'He asked if you agree.']], 'High five!', 'deal'],
    ['Oh no, the tower fell down!', [['Chill out, we can build it again!', 1, '"Chill out" means "calm down, it\'s okay."'], ['It is all your fault!', 0, 'Blaming makes friends sad.'], ['I want to go home.', 0, 'Help your friend!']], "You're right! Let's build it bigger!", 'chill'],
    ['That was the best tower ever!', [['Same here! High five!', 1, '"Same here" means "me too!"'], ['Mine was better.', 0, 'You built it together!'], ['Okay bye.', 0, 'Celebrate together first!']], 'High five!', 'highfive']] },
  { id: 'library', ico: '📚', name: 'At the library', stage: 3, who: ['🧑‍🏫', 'Mr. Gray'], place: '📚📖🪑', turns: [
    ['Hello! Can I help you find a book?', [['Excuse me, where are the dinosaur books?', 1, '"Excuse me" is a polite way to ask.'], ['BOOKS!', 0, 'Libraries are quiet places. Ask nicely!'], ['I can whistle.', 0, 'He asked about books.']], 'Right this way. They are on the blue shelf.', 'excuse'],
    ['Shh, please use a quiet voice in the library.', [['Oh, sorry! I will whisper.', 1, 'Saying sorry when you forget is great.'], ['NO!', 0, 'Remember, quiet voices here.'], ['Can I have a pizza?', 0, 'He asked you to be quiet.']], 'Thank you!', 'sorry'],
    ['You can keep the book for two weeks.', [['Gotcha! I will bring it back.', 1, '"Gotcha" means "I understand."'], ['I will keep it forever.', 0, 'Library books go back so others can read them.'], ['Two is a number.', 0, 'True, but he told you a rule!']], 'Wonderful. Happy reading!', 'gotcha'],
    ['Did you know a T. rex had teeth as big as bananas?', [['No way! That is so cool!', 1, '"No way!" shows you are surprised.'], ['Boring.', 0, 'That is not very kind. Show some interest!'], ['Bananas are yellow.', 0, 'Yes, but react to the fun fact!']], 'Ha ha! The book has lots more facts!', 'noway']] },
  { id: 'lost', ico: '🧭', name: 'Asking for help', stage: 3, who: ['👮', 'Officer Kim'], place: '🏬🧭👮', turns: [
    ['Hello there. Are you okay?', [["Excuse me, I can't find my dad.", 1, 'Telling a helper clearly is very smart.'], ['I am fine, go away.', 0, 'If you are lost, a helper can help!'], ['I like cheese.', 0, 'Tell her what is wrong.']], "Don't worry. We will find him together.", 'excuse'],
    ['What is your name?', [['My name is Ava.', 1, 'A clear answer.'], ['Seven.', 0, 'That sounds like your age. She asked your name.'], ['Secret!', 0, 'It is okay to tell a police officer or a shop worker.']], 'Thank you, Ava.', null],
    ["What does your dad look like?", [['He is tall and has a green coat.', 1, 'Describing words help a lot!'], ['He looks like a dad.', 0, 'Give more details: tall, short, colors...'], ['Banana!', 0, 'She needs to know what he looks like.']], 'Is that him over there?', null],
    ['Look! Your dad is here!', [['Dad! Thank you so much for helping me!', 1, 'Thanking a helper is lovely.'], ['Finally.', 0, 'Say thank you to the helper!'], ['Can I have a balloon?', 0, 'Say thank you first!']], "You're welcome. Take care!", 'thanks']] }
];
