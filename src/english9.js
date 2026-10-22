/* ---------- English & Reading, part 9: data for round 4 (the screens are in english10.js) ---------- */
// Sound lab: word families, minimal pairs, tricky spellings and the 44-sound wall. Word power: opposites, categories,
// compound words, synonym ladders, homophones, idioms and slang. Also 10 more Talk time chats with their phrase cards.
// This file is included before english8.js, so the Talk time screens see the new chats and phrase cards.

// Word families: [ending, picture, real words "onset:emoji" (onset + ending is a real, kid-friendly word),
// silly onsets (onset + ending is not a word)]. The spin wheel mixes both, so a child finds out which are real.
const EN_FAMILIES = [
  ['at', '🐱', 'b:🦇,c:🐱,h:🎩,m:🧘,r:🐀,s:🪑,p:🤚,fl:📄,ch:💬,th:👉', 'd,j,z,k,y'],
  ['an', '🍳', 'c:🥫,f:🪭,m:👨,p:🍳,v:🚐,r:🏃,t:🟫,pl:🗺️', 'z,j,k,y,l'],
  ['ig', '🐷', 'b:🐘,d:⛏️,f:🍈,p:🐷,w:💇,j:💃,tw:🌿', 'h,k,s,v'],
  ['op', '🛑', 'h:🐇,m:🧹,p:🎈,t:🔝,sh:🏪,st:🛑,dr:💧,ch:🪓', 'n,k,j,z'],
  ['ug', '🐛', 'b:🐛,h:🤗,j:🫗,m:☕,r:🧶,t:🪢,d:⛏️,pl:🔌,sl:🐌,sn:🛌', 'k,z,y,w'],
  ['ell', '🔔', 'b:🔔,f:🍂,s:💰,sh:🐚,sm:👃,sp:🔤,w:🪣,y:📢,t:🗣️', 'k,z,v,r'],
  ['ake', '🎂', 'b:🍞,c:🎂,l:🏞️,m:🛠️,r:🧹,w:⏰,sh:🥤,sn:🐍,t:🤲', 'g,z,v,n'],
  ['ight', '💡', 'l:💡,n:🌙,r:✅,t:🤏,s:👀,m:🤔,br:🌟,fl:✈️', 'z,v,p,j'],
  ['ot', '🍲', 'h:🔥,p:🍲,d:⚫,c:🛏️,g:🎁,n:🚫,sp:🐆,kn:🪢', 'z,v,f,k'],
  ['et', '✈️', 'j:✈️,n:🥅,p:🐶,v:🧑‍⚕️,w:💦,g:🎁,s:🍽️,m:🤝', 'z,k,f,d'],
  ['in', '📌', 'b:🗑️,f:🦈,p:📌,t:🥫,w:🏆,ch:🧔,sp:🌀,sk:✋,tw:👯', 'z,m,l,h'],
  ['ip', '🚢', 'd:🥣,h:💃,l:👄,s:🥤,t:💡,z:🤐,sh:🚢,ch:🍟,dr:💧,fl:🤸', 'b,f,g,m'],
  ['og', '🐸', 'd:🐶,fr:🐸,l:🪵,f:🌫️,h:🐗,j:🏃,cl:👞', 'z,k,y'],
  ['un', '☀️', 'b:🍞,f:🎉,r:🏃,s:☀️,sp:🌀', 'm,k,z,l'],
  ['ed', '🛏️', 'b:🛏️,r:🔴,f:🍼,sl:🛷,sh:🏚️', 'k,j,v,p'],
  ['ack', '🎒', 'b:🔙,p:🎒,s:🛍️,sn:🍪,tr:🛤️,bl:⚫,qu:🦆', 'd,f,g,v'],
  ['ing', '💍', 'k:🤴,r:💍,s:🎤,w:🪽,sw:🛝,spr:🌸,st:🐝', 'f,h,v,j'],
  ['ock', '⏰', 'cl:⏰,s:🧦,r:🪨,l:🔒,bl:🧱,d:⚓,kn:🚪,sh:⚡', 'z,v,g,y'],
  ['ail', '🐌', 'm:📬,n:💅,p:🪣,r:🛤️,s:⛵,sn:🐌,t:🦊', 'z,y,l'],
  ['ate', '🍽️', 'g:🚪,l:⏰,pl:🍽️,sk:⛸️,d:📅,cr:📦', 'z,v,j,y'],
  ['ink', '🩷', 'p:🩷,s:🚰,w:😉,dr:🥤,th:🤔,bl:👀', 'b,v,t'],
  ['ill', '⛰️', 'h:⛰️,p:💊,f:🫗,sp:🥛,gr:🍖,dr:🔧', 'z,v,y'],
  ['ump', '🦘', 'j:🦘,b:🤕,p:⛽,d:🚛,st:🪵,l:🧱', 'z,v,k,n'],
  ['ee', '🌳', 'b:🐝,s:👀,tr:🌳,fr:🆓,thr:3️⃣,kn:🦵', 'k,r,m'],
  ['all', '⚽', 'b:⚽,c:📞,f:🍂,h:🚪,m:🛍️,t:🦒,w:🧱,sm:🐭', 'z,v,n']
].map(([end, ico, real, silly]) => ({ end, ico, real: real.split(',').map(x => { const [on, e] = x.split(':'); return { on, w: on + end, e }; }), silly: silly.split(',').map(on => ({ on, w: on + end })) }));

// Minimal pairs: [word, picture, word, picture, hard?]. Owl says one; the child picks it. Hard pairs come from stage 2.
const EN_MINPAIRS = [
  ['ship', '🚢', 'sheep', '🐑'], ['pin', '📌', 'pen', '🖊️'], ['bat', '🦇', 'bed', '🛏️'], ['cap', '🧢', 'cab', '🚕'], ['fan', '🪭', 'van', '🚐'],
  ['hat', '🎩', 'hut', '🛖'], ['cut', '✂️', 'cat', '🐱'], ['pig', '🐷', 'big', '🐘'], ['coat', '🧥', 'goat', '🐐'], ['bear', '🐻', 'pear', '🍐'],
  ['bee', '🐝', 'pea', '🫛'], ['cup', '☕', 'cop', '👮'], ['duck', '🦆', 'dock', '⚓'], ['fox', '🦊', 'box', '📦'], ['man', '👨', 'men', '👥'],
  ['ten', '🔟', 'tin', '🥫'], ['gold', '🥇', 'cold', '🥶'], ['hill', '⛰️', 'heel', '👠'], ['bag', '👜', 'back', '🔙'], ['sock', '🧦', 'shock', '⚡'],
  ['chip', '🍟', 'ship', '🚢', 1], ['three', '3️⃣', 'tree', '🌳', 1], ['light', '💡', 'right', '➡️', 1], ['sink', '🚰', 'think', '🤔', 1],
  ['fin', '🦈', 'thin', '🥢', 1], ['mouse', '🐭', 'mouth', '👄', 1], ['lock', '🔒', 'rock', '🪨', 1], ['lake', '🏞️', 'rake', '🧹', 1],
  ['glass', '🥛', 'grass', '🌱', 1], ['wet', '💦', 'vet', '🧑‍⚕️', 1], ['rice', '🍚', 'rise', '🌅', 1], ['chair', '🪑', 'share', '🤝', 1],
  ['witch', '🧙', 'wish', '🌠', 1], ['bath', '🛁', 'bat', '🦇', 1], ['fly', '🪰', 'fry', '🍳', 1], ['cloud', '☁️', 'crowd', '👥', 1]
];

// Tricky spellings for stage 3+: silent letters, -tion, soft c and g, ph.
const EN_TRICKY = [
  { id: 'kn', ico: '🦵', name: 'Silent k (kn)', kind: 'silent', letter: 'k', rule: 'In kn at the start of a word, the k is silent. Knee says "nee".', words: 'knee:🦵,knot:🪢,knife:🔪,knock:🚪,knight:🛡️,knit:🧶' },
  { id: 'wr', ico: '✍️', name: 'Silent w (wr)', kind: 'silent', letter: 'w', rule: 'In wr at the start of a word, the w is silent. Write says "rite".', words: 'write:✍️,wrist:⌚,wrap:🎁,wrong:❌,wren:🐦,wreck:🚢' },
  { id: 'mb', ico: '🐑', name: 'Silent b (mb)', kind: 'silent', letter: 'b', rule: 'In mb at the end of a word, the b is silent. Lamb says "lam".', words: 'lamb:🐑,thumb:👍,comb:🪮,climb:🧗,crumb:🍞' },
  { id: 'gn', ico: '🧙', name: 'Silent g (gn)', kind: 'silent', letter: 'g', rule: 'In gn, the g is often silent. Gnome says "nome".', words: 'gnome:🧙,gnat:🦟,sign:🪧,gnaw:🦫' },
  { id: 'tion', ico: '🚉', name: '-tion says "shun"', kind: 'tion', rule: 'The letters t-i-o-n at the end of a word say "shun": station, lotion, potion.', words: 'station:🚉,lotion:🧴,potion:🧪,action:🎬,fraction:🍕,motion:🌊', not: 'lemon:🍋,button:🔘,kitten:🐱,dragon:🐉,ribbon:🎀,wagon:🛒,melon:🍈,robin:🐦' },
  { id: 'softc', ico: '🏙️', name: 'Soft c', kind: 'soft', letter: 'c', soft: 'sss', hard: 'kuh', rule: 'C says "sss" when e, i or y comes after it (city, ice). Otherwise it says "kuh" (cat).', words: 'city:🏙️,circle:⭕,cereal:🥣,pencil:✏️,ice:🧊,mice:🐭,face:🙂,rice:🍚', not: 'cat:🐱,cup:☕,cake:🎂,corn:🌽,carrot:🥕,cow:🐮' },
  { id: 'softg', ico: '🦒', name: 'Soft g', kind: 'soft', letter: 'g', soft: 'juh', hard: 'guh', rule: 'G often says "juh" when e, i or y comes after it (giraffe, gem). Otherwise it says "guh" (goat).', words: 'giraffe:🦒,giant:🧌,gem:💎,gym:🏋️,page:📄,magic:🪄,cage:🐦', not: 'goat:🐐,gum:🍬,gate:🚪,garden:🌷,game:🎮,gold:🥇' },
  { id: 'ph', ico: '📱', name: 'ph says "fff"', kind: 'ph', rule: 'P and H together say "fff", just like F: phone, photo, dolphin.', words: 'phone:📱,photo:📷,dolphin:🐬,elephant:🐘,alphabet:🔤,trophy:🏆' }
].map(T => ({ ...T, words: T.words.split(',').map(x => x.split(':')), not: T.not ? T.not.split(',').map(x => x.split(':')) : [] }));

// The 44 sounds of English: [key, how it is spelled, sound to say, group, examples "word:emoji", a little rhyme].
const EN_WALL = [
  ['b', 'b', 'buh', 'cons', 'bat:🦇,bear:🐻,bubble:🫧', 'Big brown bear bounces a ball: b, b, b!'],
  ['d', 'd', 'duh', 'cons', 'dog:🐶,duck:🦆,drum:🥁', 'Dizzy duck does a dance: d, d, d!'],
  ['f', 'f, ph', 'fff', 'cons', 'fish:🐟,frog:🐸,phone:📱', 'Five funny fish flip and flop: f, f, f!'],
  ['g', 'g', 'guh', 'cons', 'goat:🐐,gift:🎁,grapes:🍇', 'Green goat gobbles grapes: g, g, g!'],
  ['h', 'h', 'huh', 'cons', 'hat:🎩,horse:🐴,house:🏠', 'Happy horse hops home: h, h, h!'],
  ['j', 'j, g, dge', 'juh', 'cons', 'jet:✈️,jeep:🚙,giraffe:🦒', 'Jolly jellyfish juggle jam: j, j, j!'],
  ['k', 'c, k, ck', 'kuh', 'cons', 'cat:🐱,kite:🪁,duck:🦆', 'Cool cat flies a kite: k, k, k!'],
  ['l', 'l, ll', 'lll', 'cons', 'leaf:🍃,lemon:🍋,log:🪵', 'Little lemon on a log: l, l, l!'],
  ['m', 'm', 'mmm', 'cons', 'moon:🌙,mouse:🐭,milk:🥛', 'Mmm, mouse munches muffins: m, m, m!'],
  ['n', 'n, kn', 'nnn', 'cons', 'nose:👃,nest:🪺,knee:🦵', 'Nine noisy nuts in a nest: n, n, n!'],
  ['p', 'p', 'puh', 'cons', 'pig:🐷,pear:🍐,penguin:🐧', 'Pink pig picks a pear: p, p, p!'],
  ['r', 'r, wr', 'rrr', 'cons', 'rabbit:🐰,rain:🌧️,rocket:🚀', 'Red rocket roars and rumbles: r, r, r!'],
  ['s', 's, ss, c', 'sss', 'cons', 'sun:☀️,snake:🐍,sock:🧦', 'Silly snake slides in the sun: s, s, s!'],
  ['t', 't', 'tuh', 'cons', 'tent:⛺,turtle:🐢,tap:🚰', 'Tiny turtle taps a tent: t, t, t!'],
  ['v', 'v', 'vvv', 'cons', 'van:🚐,vase:🏺,vest:🦺', 'Vroom goes the van with a vase and a vest: v, v, v!'],
  ['w', 'w, wh', 'wuh', 'cons', 'web:🕸️,whale:🐳,wing:🪽', 'Wiggly worm waves at a whale: w, w, w!'],
  ['y', 'y', 'yuh', 'cons', 'yes:✅,yellow:💛,yawn:🥱', 'Yes, yes, a yellow yawn: y, y, y!'],
  ['z', 'z, zz, s', 'zzz', 'cons', 'zebra:🦓,zip:🤐,zoo:🦁', 'Zippy zebra zooms to the zoo: z, z, z!'],
  ['ch', 'ch, tch', 'chuh', 'cons', 'chick:🐥,cheese:🧀,lunch:🥪', 'Chomp, chomp, chicken chews cheese: ch, ch, ch!'],
  ['sh', 'sh', 'shh', 'cons', 'ship:🚢,shell:🐚,fish:🐟', 'Shh, the sheep is sleeping on the ship: sh, sh, sh!'],
  ['th', 'th (thin)', 'th', 'cons', 'thumb:👍,three:3️⃣,tooth:🦷', 'Three thick thumbs: th, th, th!'],
  ['dh', 'th (this)', 'thuh', 'cons', 'this:👉,feather:🪶,bathe:🛁', 'This feather is for mother: th, th, th!'],
  ['ng', 'ng', 'nng', 'cons', 'ring:💍,king:🤴,swing:🛝', 'Ding dong, the king can sing: ng, ng, ng!'],
  ['zh', 's (treasure)', 'zh', 'cons', 'treasure:💰,television:📺,measure:📏', "Pirate's treasure, what a pleasure: zh, zh, zh!"],
  ['a', 'a', 'ah', 'short', 'apple:🍎,ant:🐜,cat:🐱', 'An ant ate an apple: a, a, a!'],
  ['e', 'e', 'eh', 'short', 'egg:🥚,elephant:🐘,bed:🛏️', 'Ed the elephant ate an egg: e, e, e!'],
  ['i', 'i', 'ih', 'short', 'insect:🐞,igloo:🧊,pig:🐷', 'Itchy insect in an igloo: i, i, i!'],
  ['o', 'o', 'aw', 'short', 'octopus:🐙,dog:🐶,box:📦', 'Odd octopus on a box: o, o, o!'],
  ['u', 'u', 'uh', 'short', 'umbrella:☂️,bus:🚌,duck:🦆', 'Up, up, umbrella, up: u, u, u!'],
  ['ai', 'ai, ay, a_e', 'ay', 'long', 'rain:🌧️,snail:🐌,cake:🎂', 'Play in the rain, eat cake again: ay, ay, ay!'],
  ['ee', 'ee, ea, e', 'ee', 'long', 'tree:🌳,bee:🐝,leaf:🍃', 'Three bees in a tree: ee, ee, ee!'],
  ['igh', 'igh, ie, i_e', 'eye', 'long', 'light:💡,pie:🥧,kite:🪁', 'Fly my kite so high at night: eye, eye, eye!'],
  ['oa', 'oa, ow, o_e', 'oh', 'long', 'boat:⛵,snow:❄️,bone:🦴', 'Row the boat through the snow: oh, oh, oh!'],
  ['yoo', 'u_e, ew', 'yoo', 'long', 'cube:🧊,cute:🥰,mule:🫏', 'A cute cube for a mule: yoo, yoo, yoo!'],
  ['oo', 'oo, ew, ue', 'oo', 'more', 'moon:🌙,spoon:🥄,boot:👢', 'A spoon on the moon: oo, oo, oo!'],
  ['u2', 'oo (book)', 'oo, as in book', 'more', 'book:📖,foot:🦶,cookie:🍪', 'Look! A cookie on my book: oo, oo, oo!'],
  ['ar', 'ar', 'ar', 'more', 'car:🚗,star:⭐,shark:🦈', 'A star in a car goes far: ar, ar, ar!'],
  ['or', 'or, aw, au', 'or', 'more', 'fork:🍴,horse:🐴,saw:🪚', 'A horse with a fork: or, or, or!'],
  ['ur', 'ur, er, ir', 'er', 'more', 'bird:🐦,nurse:🧑‍⚕️,turtle:🐢', 'The bird and the nurse: er, er, er!'],
  ['ow', 'ow, ou', 'ow', 'more', 'cow:🐮,owl:🦉,cloud:☁️', 'Wow, a cow and an owl: ow, ow, ow!'],
  ['oi', 'oi, oy', 'oy', 'more', 'coin:🪙,boy:👦,toy:🧸', 'A boy with a toy coin: oy, oy, oy!'],
  ['air', 'air, are, ear', 'air', 'more', 'chair:🪑,bear:🐻,hair:💇', 'A bear on a chair: air, air, air!'],
  ['ear', 'ear, eer', 'ear', 'more', 'ear:👂,deer:🦌,beard:🧔', 'A deer has a big ear: ear, ear, ear!'],
  ['schwa', 'a (banana)', 'uh', 'more', 'banana:🍌,panda:🐼,zebra:🦓', 'The soft little uh in ba-na-na: uh, uh, uh!']
].map(([k, spell, s, g, ex, rhyme]) => ({ k, spell, s, g, ex: ex.split(',').map(x => x.split(':')), rhyme }));
const EN_WALL_GROUPS = [['cons', '🧱', 'Consonant sounds'], ['short', '🍎', 'Short vowels'], ['long', '🌧️', 'Long vowels'], ['more', '🌙', 'More vowel sounds']];

// More opposites for the matching board ("word:opposite:emoji:emoji"); the older list (EN_OPP) is used too.
const EN_OPP2 = 'awake:asleep:😃:😴,laugh:cry:😂:😭,thick:thin:📚:📄,give:take:🎁:🤲,float:sink:🛟:⚓,catch:throw:🧤:⚾,remember:forget:🧠:🤷,sunny:rainy:☀️:🌧️,' +
  'question:answer:❓:💡,true:false:✅:❌,yes:no:👍:👎,summer:winter:🏖️:⛄,front:back:🔜:🔙,lost:found:🔍:🎉,strong:weak:💪:🥀,brave:scared:🦁:😨,inside:outside:🏠:🌳,' +
  'early:late:🐓:🦉,first:last:🥇:🐢,above:below:☁️:🪨,smooth:rough:🧈:🪵,always:never:♾️:🚫,come:go:👋:🚶,buy:sell:🛒:💰';

// Things in groups, for the sort game and odd one out. Groups never overlap.
const EN_CATS = [
  { id: 'fruit', ico: '🧺', name: 'Fruit', items: 'apple:🍎,banana:🍌,grapes:🍇,strawberry:🍓,orange:🍊,watermelon:🍉,pear:🍐,cherries:🍒,pineapple:🍍,kiwi:🥝,peach:🍑,lemon:🍋' },
  { id: 'veg', ico: '🥗', name: 'Vegetables', items: 'carrot:🥕,broccoli:🥦,corn:🌽,cucumber:🥒,potato:🥔,onion:🧅,pepper:🫑,lettuce:🥬,peas:🫛,garlic:🧄' },
  { id: 'animal', ico: '🐾', name: 'Animals', items: 'dog:🐶,cat:🐱,elephant:🐘,lion:🦁,tiger:🐯,monkey:🐵,rabbit:🐰,bear:🐻,giraffe:🦒,horse:🐴,pig:🐷,cow:🐮' },
  { id: 'vehicle', ico: '🛣️', name: 'Vehicles', items: 'car:🚗,bus:🚌,bike:🚲,train:🚂,plane:✈️,rocket:🚀,helicopter:🚁,tractor:🚜,fire truck:🚒,scooter:🛵,boat:⛵,truck:🚚' },
  { id: 'clothes', ico: '👚', name: 'Clothes', items: 'shirt:👕,jeans:👖,socks:🧦,dress:👗,cap:🧢,coat:🧥,gloves:🧤,scarf:🧣,shoes:👟,boots:👢' },
  { id: 'weather', ico: '🌦️', name: 'Weather', items: 'sun:☀️,rain:🌧️,snow:❄️,rainbow:🌈,lightning:⚡,cloud:☁️,tornado:🌪️,fog:🌫️,wind:🌬️' },
  { id: 'music', ico: '🎼', name: 'Music makers', items: 'guitar:🎸,drum:🥁,piano:🎹,trumpet:🎺,violin:🎻,accordion:🪗,saxophone:🎷,banjo:🪕' },
  { id: 'body', ico: '🧍', name: 'Body parts', items: 'nose:👃,ear:👂,eyes:👀,hand:✋,foot:🦶,tooth:🦷,leg:🦵,arm:💪,tongue:👅' },
  { id: 'home', ico: '🏠', name: 'Things at home', items: 'bed:🛏️,chair:🪑,sofa:🛋️,door:🚪,window:🪟,bath:🛁,toilet:🚽,lamp:💡,mirror:🪞' },
  { id: 'toys', ico: '🧸', name: 'Toys', items: 'teddy:🧸,yo-yo:🪀,kite:🪁,balloon:🎈,puzzle:🧩,dice:🎲,doll:🪆,ball:⚽,robot:🤖' }
].map(C => ({ ...C, items: C.items.split(',').map(x => x.split(':')) }));

// Compound words: [first, second, picture].
const EN_COMPOUND = [['sun', 'flower', '🌻'], ['rain', 'bow', '🌈'], ['butter', 'fly', '🦋'], ['pop', 'corn', '🍿'], ['cup', 'cake', '🧁'], ['foot', 'ball', '🏈'],
  ['snow', 'man', '⛄'], ['tooth', 'brush', '🪥'], ['fire', 'truck', '🚒'], ['bed', 'room', '🛏️'], ['jelly', 'fish', '🪼'], ['lady', 'bug', '🐞'], ['sun', 'glasses', '🕶️'],
  ['rain', 'coat', '🧥'], ['pan', 'cake', '🥞'], ['snow', 'flake', '❄️'], ['air', 'plane', '✈️'], ['water', 'melon', '🍉'], ['sand', 'castle', '🏰'], ['hand', 'bag', '👜'],
  ['pine', 'apple', '🍍'], ['moon', 'light', '🌙'], ['door', 'bell', '🔔'], ['grass', 'hopper', '🦗'], ['rain', 'drop', '💧'], ['back', 'pack', '🎒'], ['head', 'phones', '🎧'],
  ['sun', 'rise', '🌅'], ['pea', 'nut', '🥜'], ['skate', 'board', '🛹'], ['hot', 'dog', '🌭'], ['cow', 'boy', '🤠'], ['camp', 'fire', '🏕️'], ['star', 'fish', '⭐'], ['gold', 'fish', '🐠']];
// Real words that are not on the list, so they are never offered as a wrong answer.
const EN_COMPOUND_REAL = 'sunhat,sunlight,sunshine,sunset,sunburn,sunday,sunfish,rainfall,rainstorm,butterscotch,buttercup,buttermilk,starlight,cupboard,footprint,footstep,football,footpath,snowball,snowstorm,snowboard,snowfall,toothpaste,toothache,fireman,firework,fireplace,firefly,bedtime,bedbug,jellybean,backyard,backbone,waterfall,waterslide,handshake,handball,moonbeam,doormat,doorway,headband,headlight,cowgirl,airport,sandbox,pinecone,popcorn,goldfish,starfish,sunflower,campfire,hotdog,bedroom,backpack,pancake,cupcake'.split(',');

// Synonym ladders: from a little to a lot.
const EN_LADDERS = [['🌡️', 'warm', 'hot', 'boiling'], ['🥶', 'cool', 'cold', 'freezing'], ['🐘', 'big', 'huge', 'gigantic'], ['🐜', 'small', 'tiny', 'microscopic'],
  ['😊', 'glad', 'happy', 'overjoyed'], ['😢', 'sad', 'upset', 'heartbroken'], ['😴', 'tired', 'worn out', 'exhausted'], ['🏃', 'walk', 'jog', 'run', 'sprint'],
  ['📢', 'whisper', 'talk', 'shout', 'roar'], ['🌧️', 'drizzle', 'rain', 'downpour'], ['😨', 'nervous', 'scared', 'terrified'], ['😠', 'cross', 'angry', 'furious'],
  ['💦', 'damp', 'wet', 'soaked'], ['😂', 'funny', 'hilarious'], ['❤️', 'like', 'love', 'adore'], ['🌸', 'pretty', 'beautiful', 'gorgeous'], ['🍪', 'nibble', 'eat', 'gobble'],
  ['🧠', 'clever', 'brilliant', 'genius'], ['🐷', 'grubby', 'dirty', 'filthy'], ['⭐', 'good', 'great', 'amazing']];

// Homophones (sound the same, spelled differently): [sentence, right word, wrong word, picture of the right meaning].
const EN_HOMO2 = [['I can ___ a bird.', 'see', 'sea', '👀'], ['We swim in the ___.', 'sea', 'see', '🌊'], ['The ___ is hot today.', 'sun', 'son', '☀️'], ['Grandpa has a ___ and a daughter.', 'son', 'sun', '👦'],
  ['A ___ smells sweet.', 'flower', 'flour', '🌸'], ['We need ___ to bake bread.', 'flour', 'flower', '🌾'], ['The sky is dark at ___.', 'night', 'knight', '🌙'], ['The ___ rides a horse.', 'knight', 'night', '🛡️'],
  ['A ___ makes honey.', 'bee', 'be', '🐝'], ['I have a ___ of socks.', 'pair', 'pear', '🧦'], ['I ate a juicy ___.', 'pear', 'pair', '🍐'], ['The dog wags its ___.', 'tail', 'tale', '🐕'],
  ['Please ___ your name.', 'write', 'right', '✍️'], ['Turn ___ at the shop.', 'right', 'write', '➡️'], ['Come over ___!', 'here', 'hear', '📍'], ['I can ___ music.', 'hear', 'here', '👂'],
  ['The wind ___ my hat away.', 'blew', 'blue', '🌬️'], ['The sky is ___.', 'blue', 'blew', '💙'], ['Nice to ___ you!', 'meet', 'meat', '🤝'], ['We walk on the ___.', 'road', 'rode', '🛣️'],
  ['I ___ my bike to school.', 'rode', 'road', '🚲'], ['I am ___ years old.', 'eight', 'ate', '8️⃣'], ['I ___ my lunch.', 'ate', 'eight', '🍽️'], ['A brown ___ lives in the woods.', 'bear', 'bare', '🐻'],
  ['We ___ the game!', 'won', 'one', '🏆'], ['I have ___ nose.', 'one', 'won', '1️⃣'], ['A ___ eats grass in the forest.', 'deer', 'dear', '🦌'], ['There are seven days in a ___.', 'week', 'weak', '📅'],
  ['I ___ my coat in the rain.', 'wear', 'where', '🧥'], ['The mouse ran into a ___.', 'hole', 'whole', '🕳️']];

// New idioms, similes, slang and wise sayings: [id, saying, picture, meaning, example, group].
const EN_IDIOMS = [
  ['catgot', 'Cat got your tongue?', '🐱👅', 'Why are you so quiet?', "You haven't said a word. Cat got your tongue?", 'idiom'],
  ['bananas', 'Go bananas', '🍌🤪', 'Get very excited or very silly.', 'The kids went bananas when the clown came in.', 'idiom'],
  ['pickle', 'In a pickle', '🥒😬', 'In a tricky spot, with a problem to fix.', "I'm in a pickle: I forgot my lunch!", 'idiom'],
  ['feelblue', 'Feeling blue', '💙😢', 'Feeling sad.', 'Ben was feeling blue when it rained on his birthday.', 'idiom'],
  ['coldfeet', 'Get cold feet', '🥶🦶', 'Suddenly feel too nervous to do something.', 'She got cold feet before jumping in the pool.', 'idiom'],
  ['lendhand', 'Lend a hand', '🤝✋', 'Help someone.', 'Can you lend a hand with these bags?', 'idiom'],
  ['allears', "I'm all ears", '👂👂', 'I am listening very carefully.', "Tell me your story. I'm all ears!", 'idiom'],
  ['eyeon', 'Keep an eye on it', '👁️🍪', 'Watch something carefully.', 'Please keep an eye on the cookies in the oven.', 'idiom'],
  ['monkeybiz', 'Monkey business', '🐒🙈', 'Silly or naughty behavior.', 'No monkey business while I am on the phone!', 'idiom'],
  ['headclouds', 'Head in the clouds', '☁️🧒', 'Daydreaming, not paying attention.', 'He had his head in the clouds and missed the bus.', 'idiom'],
  ['breakice', 'Break the ice', '🧊🔨', 'Say or do something friendly so new people start chatting.', 'We played a name game to break the ice.', 'idiom'],
  ['outworld', 'Out of this world', '🪐✨', 'Amazing, super good.', 'This chocolate cake is out of this world!', 'idiom'],
  ['sweettooth', 'A sweet tooth', '🍭🦷', 'Loving sweet food.', 'Grandpa has a sweet tooth. He loves candy!', 'idiom'],
  ['nightowl', 'A night owl', '🦉🌙', 'Someone who likes to stay up late.', 'My big sister is a night owl.', 'idiom'],
  ['bookworm', 'A bookworm', '🐛📚', 'Someone who loves to read.', 'Mia reads every day. She is a bookworm!', 'idiom'],
  ['butterfingers', 'Butterfingers!', '🧈🖐️', 'Someone who keeps dropping things.', 'Oops, I dropped the ball again. Butterfingers!', 'idiom'],
  ['smartcookie', 'A smart cookie', '🍪🧠', 'A clever person.', 'You solved the puzzle. You are a smart cookie!', 'idiom'],
  ['chickenout', 'Chicken out', '🐔😨', 'Get too scared to do something.', 'I almost chickened out of the big slide, but I did it!', 'idiom'],
  ['dumps', 'Down in the dumps', '😞⬇️', 'Feeling sad and gloomy.', 'He was down in the dumps when his toy broke.', 'idiom'],
  ['noodle', 'Use your noodle', '🍜🧠', 'Think hard! (Your noodle is your brain.)', 'Use your noodle to find the answer.', 'idiom'],
  ['bush', 'Beat around the bush', '🌳🥁', 'Not say the main thing straight away.', "Don't beat around the bush. Just tell me!", 'idiom'],
  ['parade', 'Rain on my parade', '🌧️🎉', "Spoil someone's happy plans.", "Don't rain on my parade, I'm excited!", 'idiom'],
  ['snugbug', 'Snug as a bug in a rug', '🐛🧶', 'Very cozy and warm.', 'In my blanket I am snug as a bug in a rug.', 'simile'],
  ['fiddle', 'Fit as a fiddle', '🎻💪', 'Very healthy and well.', 'Grandma is ninety and fit as a fiddle.', 'simile'],
  ['quietmouse', 'Quiet as a mouse', '🐭🤫', 'Very, very quiet.', 'Be quiet as a mouse, the baby is asleep.', 'simile'],
  ['whistle', 'Clean as a whistle', '😗✨', 'Very clean.', 'After the bath, the dog was clean as a whistle.', 'simile'],
  ['fishwater', 'Like a fish out of water', '🐟🏜️', 'Feeling strange in a new place.', 'On my first day I felt like a fish out of water.', 'simile'],
  ['snail', 'Slow as a snail', '🐌', 'Very slow.', 'Hurry up! You are slow as a snail today.', 'simile'],
  ['button', 'Bright as a button', '🔘💡', 'Clever and lively.', 'Little Leo is bright as a button.', 'simile'],
  ['feather', 'Light as a feather', '🪶', 'Very, very light.', 'The kitten is light as a feather.', 'simile'],
  ['coolbeans', 'Cool beans!', '🫘😎', 'Slang for "Great! Sounds good!"', '"We are going swimming." "Cool beans!"', 'slang'],
  ['awesomesauce', 'Awesome sauce!', '🥫🤩', 'Slang for "super awesome!"', 'You built a robot? Awesome sauce!', 'slang'],
  ['bornready', 'Born ready', '😎👶', 'Slang for "I am totally ready!"', '"Ready for the race?" "Born ready!"', 'slang'],
  ['alligator', 'See you later, alligator!', '🐊👋', 'A funny way to say goodbye. The answer is "In a while, crocodile!"', 'See you later, alligator! In a while, crocodile!', 'slang'],
  ['digin', 'Dig in!', '🍽️😋', 'Start eating!', 'Dinner is ready. Dig in!', 'slang'],
  ['riseshine', 'Rise and shine!', '🌅😊', 'Wake up and get up happily!', "Rise and shine, it's a sunny day!", 'slang'],
  ['hangthere', 'Hang in there!', '🐨🌳', "Don't give up, keep going.", 'Hang in there, the hard part is almost done.', 'slang'],
  ['giveshot', 'Give it a shot', '🎯', 'Give it a try.', 'You have never skated? Give it a shot!', 'slang'],
  ['topdog', 'Top dog', '🐕👑', 'The winner, or the boss.', 'Who is top dog at this game?', 'slang'],
  ['bigcheese', 'The big cheese', '🧀👔', 'The most important person (said for fun).', 'The principal is the big cheese at school.', 'slang'],
  ['nailedit', 'Nailed it!', '🔨✅', 'Slang for "I did it perfectly!"', 'I wrote my whole name. Nailed it!', 'slang'],
  ['onfire', "You're on fire!", '🔥⭐', 'Slang for "You are doing great, again and again!" (no real fire!)', "Three goals! You're on fire!", 'slang'],
  ['practice', 'Practice makes perfect', '🎹🏆', 'The more you practice, the better you get.', 'I fell off my bike a lot, but practice makes perfect.', 'wise'],
  ['twoheads', 'Two heads are better than one', '🧠🧠', 'Two people thinking together find answers faster.', "Let's solve it together. Two heads are better than one!", 'wise'],
  ['silver', 'Every cloud has a silver lining', '⛅✨', 'Something good can come from something bad.', 'It rained, but we saw a rainbow. Every cloud has a silver lining.', 'wise'],
  ['extramile', 'Go the extra mile', '🛣️⭐', 'Do even more than you have to.', 'She went the extra mile and tidied the whole room.', 'wise'],
  ['onestep', 'One step at a time', '👣', 'Do a big job little by little.', 'The puzzle is big, but we can do it one step at a time.', 'wise'],
  ['sharing', 'Sharing is caring', '🤲💛', 'Being kind means sharing.', 'Here, have some of my crayons. Sharing is caring!', 'wise'],
  ['betterlate', 'Better late than never', '⏰🙂', 'It is good to do it, even if it is late.', "I finished Gran's card a day late. Better late than never!", 'wise'],
  ['leap', 'Look before you leap', '👀🐸', 'Think before you do something.', 'Look before you leap: check how deep the water is.', 'wise']
];
const EN_IDIOM_GROUPS = [['idiom', '🐱', 'Funny sayings'], ['simile', '🐭', 'As ... as'], ['slang', '😎', 'Friendly slang'], ['wise', '🦉', 'Wise words']];

// More Talk time phrase cards (the deck is in english6.js): [id, phrase, emoji, meaning, example, kind].
EN_PHRASES.push(
  ['mayi', 'May I...?', '✋', 'A very polite way to ask if you are allowed.', 'May I pet your dog, please?', 'polite'],
  ['didntmean', "I didn't mean to", '😟', 'It was an accident, not on purpose.', "I'm sorry, I didn't mean to knock your tower.", 'polite'],
  ['forgive', 'I forgive you', '💞', 'What you say when someone says sorry and you are not cross any more.', '"Sorry I took your crayon." "It\'s okay, I forgive you."', 'polite'],
  ['canhelp', 'Can I help?', '🤲', 'A kind way to offer a hand.', 'That box looks heavy. Can I help?', 'polite'],
  ['wantplay', 'Want to play?', '🧸', 'A friendly way to ask someone to join in.', 'I have a ball. Want to play?', 'everyday'],
  ['whatsname', "What's your name?", '🏷️', 'A question to ask someone new.', "Hi! I'm Leo. What's your name?", 'everyday'],
  ['gotit', 'Got it!', '✅', 'I understand.', '"Wash your hands first." "Got it!"', 'everyday'],
  ['yourturn', 'Your turn!', '🔄', 'Now it is your go.', 'I rolled the dice. Your turn!', 'everyday'],
  ['goodluck', 'Good luck!', '🍀', 'A wish that things go well for someone.', 'Good luck in your race!', 'everyday'],
  ['goodgame', 'Good game!', '🤝', 'A kind thing to say after playing, win or lose.', '"Good game!" "You too!"', 'everyday'],
  ['betterluck', 'Better luck next time', '🎲', 'A kind thing to say when someone did not win.', 'You almost won! Better luck next time.', 'everyday'],
  ['cantwait', "I can't wait!", '🤩', 'You are very excited about something coming soon.', "We're going to the zoo tomorrow? I can't wait!", 'everyday'],
  ['sleeptight', 'Sleep tight!', '🛌', 'A cozy way to say good night.', 'Good night, sleep tight!', 'everyday'],
  ['nobiggie', 'No biggie', '🤏', 'Slang for "It is not a big deal."', '"Sorry I spilled a bit." "No biggie!"', 'slang'],
  ['sweet', 'Sweet!', '🍬', 'Slang for "Cool! Great!" (nothing to do with candy!)', 'We get pizza tonight? Sweet!', 'slang'],
  ['yum', 'Yum!', '😋', 'Slang for "This tastes so good!"', 'Strawberries with cream? Yum!', 'slang'],
  ['letsgo', "Let's go!", '🚀', 'Slang for "Come on, let\'s start!" It is a cheer too.', "Let's go, team!", 'slang'],
  ['hangout', "Let's hang out", '🛋️', 'Slang for "Let\'s spend time together."', "Let's hang out after school!", 'slang']
);

// 10 more Talk time chats. Each turn: [their line, replies [[text, good?, what Owl says]], their answer after a good reply, phrase card].
EN_TALK.push(
  { id: 'zoo', ico: '🦁', name: 'At the zoo', stage: 1, who: ['🧑‍🌾', 'Zookeeper Jo'], place: '🦒🐘🦓', turns: [
    ['Welcome to the zoo! Which animal do you want to see first?', [["The lions, please! They're my favorite.", 1, 'You answered and said please!'], ['Zoos are for babies.', 0, 'That is not kind. Tell her which animal!'], ['My sock is green.', 0, 'She asked which animal you want to see.']], 'Great pick! This way to the lions.', 'please'],
    ['Shh! The baby lion is sleeping.', [["Oh! I'll use my quiet voice.", 1, 'Kind to the sleepy cub!'], ['WAKE UP, LION!', 0, 'Shouting would wake the baby. Be quiet!'], ['I like pancakes.', 0, 'She asked you to be quiet.']], "Thank you. You're a great zoo helper!", null],
    ['Do you want to feed the giraffe?', [['You bet! May I hold the leaves?', 1, '"May I" is a very polite way to ask.'], ['No, giraffes are smelly!', 0, 'Try a kinder answer.'], ['What is a sandwich?', 0, 'She asked about feeding the giraffe.']], 'Sure! Hold them up high!', 'mayi'],
    ['The giraffe licked your hand! How was that?', [['Ha ha, it tickled! That was awesome!', 1, 'You shared how it felt!'], ['Boring.', 0, 'Tell her how it really felt, kindly.'], ['Go away.', 0, 'That is rude.']], "I'm so glad you had fun! See you soon!", 'awesome']] },
  { id: 'beach', ico: '🏖️', name: 'At the beach', stage: 1, who: ['👧', 'Ava'], place: '🏖️🌊🐚', turns: [
    ['Hi! Want to build a sandcastle with me?', [["Yes! Let's build a big one!", 1, 'Saying yes and joining in!'], ['Sand is yucky. No.', 0, 'Try a kinder answer.'], ['The moon is round.', 0, 'She asked you to build with her.']], 'Yay! You get the bucket.', 'wantplay'],
    ['Can you pass me the spade, please?', [['Here you go!', 1, '"Here you go" is what we say when we hand something over.'], ['Get it yourself!', 0, 'That sounds bossy. Help your friend!'], ['I like trains.', 0, 'She asked for the spade.']], 'Thanks! Our castle is getting tall!', 'hereyougo'],
    ['Oh no, a wave knocked our castle down!', [['No biggie! We can build another one.', 1, '"No biggie" means "It is not a big deal."'], ['You made the wave do that!', 0, "Waves are nobody's fault!"], ['Bye forever.', 0, 'Help your friend feel better.']], "You're right! Let's build it farther from the water.", 'nobiggie'],
    ['Look! I found a shiny shell!', [["Wow, it's so pretty! Sweet!", 1, '"Sweet!" is slang for "Cool!"'], ['Give it to me.', 0, 'It is her shell. Say something kind!'], ['Shells are ugly.', 0, 'That is not kind.']], "You can hold it. Let's look for more!", 'sweet']] },
  { id: 'bus', ico: '🚌', name: 'On the bus', stage: 1, who: ['🧑‍✈️', 'Driver Dan'], place: '🚌🚏🛣️', turns: [
    ['Good morning! Where are you going today?', [["Good morning! We're going to the library.", 1, 'You said good morning back and answered.'], ['Drive faster!', 0, 'That is bossy. Say good morning!'], ['Purple!', 0, 'He asked where you are going.']], 'Hop on! Please find a seat.', null],
    ['Please sit down and hold on tight.', [["Okay! I'll hold on.", 1, 'Listening keeps you safe on the bus.'], ['I want to stand on the seat!', 0, 'Standing on seats is not safe.'], ['Bananas!', 0, 'He told you a safety rule.']], 'Thanks for being safe!', null],
    ['An old man got on. There are no seats left.', [['Excuse me, would you like my seat?', 1, 'Giving your seat is very kind.'], ['Too bad, my seat!', 0, 'Think about how he feels.'], ['Look, a cloud!', 0, 'Someone needs a seat.']], 'Thank you, young one. How kind!', 'excuse'],
    ['Here is your stop. Have a great day!', [['Thank you! You too!', 1, '"You too" sends the wish back.'], ['Whatever.', 0, 'That sounds rude. Say a friendly goodbye.'], ['Stop the bus forever!', 0, 'Say thank you and goodbye.']], 'Bye! Enjoy the library!', 'thanks']] },
  { id: 'sorry', ico: '💞', name: 'Saying sorry', stage: 1, who: ['👦', 'Ben'], place: '🧱🏰😢', turns: [
    ['Hey! You knocked down my tower!', [["I'm sorry, I didn't mean to.", 1, 'Saying sorry helps a lot!'], ["It's your fault for building it there.", 0, 'Blaming does not help. Try saying sorry.'], ['Ha ha!', 0, 'He is upset. How can you make it better?']], 'Oh. It was an accident?', 'didntmean'],
    ['I worked so hard on it.', [['Can I help you build it again?', 1, 'Offering to help shows you care.'], ['Towers are boring anyway.', 0, 'That would hurt his feelings.'], ['I want a snack.', 0, 'Think about how he feels.']], 'Okay! You can do the top.', 'canhelp'],
    ['Look, our new tower is even taller!', [['Wow! We make a great team!', 1, 'Celebrating together!'], ['Mine is the best part.', 0, 'You built it together!'], ['Knock it down!', 0, 'Not again! Enjoy it together.']], 'We do!', null],
    ["I'm not mad anymore. I forgive you.", [['Thank you! Friends again?', 1, 'Being friends again feels good.'], ['Whatever.', 0, 'He forgave you. Say something kind!'], ['Bye.', 0, 'Answer him kindly first.']], 'Friends again! High five!', 'forgive']] },
  { id: 'newfriend', ico: '🤝', name: 'Making a new friend', stage: 1, who: ['👧', 'Zoe'], place: '🛝🌳☀️', turns: [
    ["Hi... I'm new here.", [["Hi! What's your name? I'm glad you're here.", 1, 'Asking her name is a great start!'], ['So what?', 0, 'That might make her feel lonely.'], ['Clouds are white.', 0, 'She is new. Say hello!']], "I'm Zoe. Nice to meet you!", 'whatsname'],
    ["I don't know anyone here.", [['Want to play with me and my friends?', 1, 'Inviting someone in is super kind.'], ['That is sad for you.', 0, 'You can help! Invite her to play.'], ['Go home then.', 0, 'That is unkind.']], 'Really? Yes, please!', 'wantplay'],
    ['What games do you like?', [['I like tag and hide-and-seek. What about you?', 1, 'You answered and asked her back!'], ['None of your business.', 0, 'That is rude.'], ['Tuesday.', 0, 'She asked about games.']], "I love tag too! Let's play!", null],
    ['This was fun! Can we play again tomorrow?', [['You bet! See you tomorrow, Zoe!', 1, '"You bet" means "Yes, for sure!"'], ['Maybe, if you give me your toy.', 0, 'Friends do not need presents to play.'], ['Hmph.', 0, 'Say something friendly!']], 'Yay! I made a new friend!', 'youbet']] },
  { id: 'cooking', ico: '🍪', name: 'Cooking together', stage: 2, who: ['👨‍🍳', 'Uncle Raj'], place: '🥣🍪🧁', turns: [
    ["Let's bake cookies! Can you wash your hands first?", [["Got it! I'll wash them now.", 1, '"Got it" means "I understand."'], ['No, my hands are fine.', 0, 'Clean hands keep food safe!'], ['Cookies are round.', 0, 'He asked you to wash your hands.']], 'Great! Now we can start.', 'gotit'],
    ['Can you crack the egg into the bowl?', [["I'll try! Oops, a bit of shell fell in.", 1, 'Trying is great, and saying oops is fine!'], ['You do it, I am busy.', 0, 'Cooking together means helping.'], ['Eggs are chickens.', 0, 'He asked you to crack the egg.']], "No worries, I'll scoop it out.", 'noworries'],
    ['The oven is very hot. What should we do?', [['Let a grown-up open it, and stay back.', 1, 'Safe and smart!'], ['Touch it to see!', 0, 'Ouch! Hot ovens can burn.'], ['Sing a song.', 0, 'He asked how to stay safe.']], 'Exactly! Safety first.', null],
    ['The cookies are ready. Try one!', [['Yum! These are so tasty. Thank you!', 1, '"Yum!" shows you like it, and you said thank you.'], ['Give me all of them!', 0, 'Share the cookies!'], ['Yuck, I hate food.', 0, 'That is not kind to the cook.']], "You're a super chef helper!", 'yum']] },
  { id: 'gamenight', ico: '🎲', name: 'Game night', stage: 2, who: ['👨', 'Dad'], place: '🎲🃏🧩', turns: [
    ["It's game night! Which game shall we play?", [['Can we play the card game, please?', 1, 'Asking politely to choose!'], ['Only my game or I quit!', 0, 'Bossy! Choose together.'], ['My nose is cold.', 0, 'Dad asked which game.']], 'Good idea! Let me shuffle.', null],
    ["I rolled a six! Now it's your turn.", [['Okay! Here I go!', 1, 'Taking turns is fair!'], ['I want two turns!', 0, 'Everyone gets one turn at a time.'], ['Sixes are boring.', 0, 'It is your turn now!']], 'Go for it!', 'yourturn'],
    ['Oh no, I lost this round!', [['Good game, Dad! Better luck next time!', 1, 'Kind words when someone loses!'], ['Ha ha, you lose! You are bad!', 0, 'Teasing makes people sad. Be a kind winner.'], ['I am a dinosaur.', 0, 'Say something kind to Dad.']], "Thanks! You're a good sport.", 'betterluck'],
    ['Now YOU lost a round. How do you feel?', [["A bit sad, but it's okay. Good game!", 1, 'Saying how you feel and staying kind. Great!'], ['I quit! This game is silly!', 0, 'Losing is hard, but try to stay kind.'], ['Pizza!', 0, 'Dad asked how you feel.']], "I'm proud of you. High five!", 'goodgame']] },
  { id: 'sleepover', ico: '🌙', name: 'Sleepover', stage: 2, who: ['🧒', 'Max'], place: '🏕️🔦🌙', turns: [
    ['Welcome to my sleepover! Where do you want your sleeping bag?', [['Next to yours, please!', 1, 'Clear and polite!'], ['In the bathtub!', 0, 'Silly! Pick a cozy spot.'], ["I don't care, whatever.", 0, 'That sounds grumpy. Answer kindly.']], 'Cool, we can tell stories!', null],
    ['Do you want to hear a spooky story?', [['Hmm, can we have a funny story? Spooky ones scare me.', 1, 'It is okay to say how you feel!'], ['You are a baby for asking.', 0, 'That is mean.'], ['Teeth!', 0, 'He asked about a story.']], 'Okay! A funny one about a dancing pig!', null],
    ["We're having pancakes in the morning!", [["I can't wait!", 1, '"I can\'t wait" means you are very excited.'], ['Pancakes are for losers.', 0, 'That is not kind.'], ['Brush my hair.', 0, 'He is excited about breakfast.']], "Ha ha, we're pancake buddies!", 'cantwait'],
    ['Time to sleep. Good night!', [['Good night! Sleep tight!', 1, '"Sleep tight" is a cozy way to say good night.'], ['NO! I will shout all night!', 0, 'Others want to sleep.'], ['Hello!', 0, 'He said good night.']], 'Sleep tight! See you in the morning.', 'sleeptight']] },
  { id: 'sports', ico: '🏅', name: 'Sports day', stage: 2, who: ['🧑‍🏫', 'Coach Amy'], place: '🏃🏅🏁', turns: [
    ['Ready for the race? Line up at the start!', [["Let's go! I'm ready!", 1, '"Let\'s go!" is a cheer to start.'], ["I'll start early to win.", 0, 'Everyone starts together. Be fair!'], ['Is it lunch?', 0, 'The race is starting!']], 'On your marks, get set, go!', 'letsgo'],
    ['Your friend Mia is about to race. What can you say?', [['Good luck, Mia! You can do it!', 1, 'Cheering for friends is lovely.'], ['You will lose.', 0, 'That is unkind.'], ['Bye.', 0, 'Cheer for your friend!']], 'That was a kind thing to say!', 'goodluck'],
    ['Oops, Leo tripped and fell!', [['Are you okay, Leo? Let me help you up.', 1, 'Helping is what good friends do.'], ['Ha ha, he fell!', 0, 'Laughing when someone is hurt is not kind.'], ['Keep running, forget him.', 0, 'Check if he is okay!']], "Thank you for helping. You're a real team player!", null],
    ['Our team came second. What do we say to the winners?', [['Well done! Good game!', 1, 'Being a good sport is the best!'], ['Not fair! You cheated!', 0, 'Be a good sport.'], ['Hmph.', 0, 'Say something kind to the winners.']], 'Great sportsmanship! High five!', 'goodgame']] },
  { id: 'losttoy', ico: '🧸', name: 'The lost toy', stage: 3, who: ['👧', 'Lily'], place: '🧸🔍🛋️', turns: [
    ["I can't find my teddy bear! I'm so sad.", [["Oh no! Don't worry, I'll help you look.", 1, 'Kind words and a helping hand!'], ['Not my problem.', 0, 'Your friend is sad. Try to help!'], ["I have a teddy and you don't!", 0, 'That would make her sadder.']], 'Thank you! Where should we look?', null],
    ['Where did I have it last?', [['Maybe in the garden, where we played?', 1, 'Thinking about where it was last is smart.'], ['On the moon.', 0, 'Silly! Think of real places.'], ['Who cares?', 0, 'She cares a lot. Be kind.']], "Good thinking! Let's check.", null],
    ['Look! Something fluffy under the bench!', [["It's your teddy! I found it!", 1, 'Hooray, you found it!'], ['It is mine now!', 0, 'It is her teddy. Give it back!'], ['A spider! Run!', 0, 'Take a closer look. It might be teddy!']], 'Teddy! Thank you so much!', null],
    ["You're the best friend ever! How can I thank you?", [["No biggie! I'm happy to help.", 1, 'Helping friends feels good!'], ['Give me your candy forever.', 0, 'Friends help without asking for stuff.'], ['Go away now.', 0, 'That is not friendly.']], "Let's hang out tomorrow!", 'hangout']] }
);
