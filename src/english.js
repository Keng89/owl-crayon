/* ---------- English & Reading, part 1: sounds, words and phrases (data only; the screens are in english3.js) ---------- */
// Sounds are written the way a grown-up would say them to a child ("buh", "sss"), so the offline voice can say them.
// Each letter: [letter, sound, picture word, emoji].
const EN_LETTERS = [
  ['a', 'ah', 'apple', '🍎'], ['b', 'buh', 'ball', '⚽'], ['c', 'kuh', 'cat', '🐱'], ['d', 'duh', 'dog', '🐶'], ['e', 'eh', 'egg', '🥚'],
  ['f', 'fff', 'fish', '🐟'], ['g', 'guh', 'goat', '🐐'], ['h', 'huh', 'hat', '🎩'], ['i', 'ih', 'insect', '🐞'], ['j', 'juh', 'juice', '🧃'],
  ['k', 'kuh', 'kite', '🪁'], ['l', 'lll', 'lion', '🦁'], ['m', 'mmm', 'moon', '🌙'], ['n', 'nnn', 'nose', '👃'], ['o', 'aw', 'octopus', '🐙'],
  ['p', 'puh', 'pig', '🐷'], ['q', 'kwuh', 'queen', '👸'], ['r', 'rrr', 'rabbit', '🐰'], ['s', 'sss', 'sun', '☀️'], ['t', 'tuh', 'tiger', '🐯'],
  ['u', 'uh', 'umbrella', '☂️'], ['v', 'vvv', 'van', '🚐'], ['w', 'wuh', 'web', '🕸️'], ['x', 'ks', 'fox', '🦊'], ['y', 'yuh', 'yo-yo', '🪀'], ['z', 'zzz', 'zebra', '🦓']
];
// Two letters, one sound (digraphs). [letters, sound, word, emoji, tip]
const EN_DIGRAPHS = [
  ['sh', 'shh', 'ship', '🚢', 'S and H together say shh, like "be quiet".'],
  ['ch', 'chuh', 'chick', '🐥', 'C and H together say ch, like a train: choo choo!'],
  ['th', 'thuh', 'thumb', '👍', 'T and H together: put your tongue between your teeth.'],
  ['wh', 'wuh', 'whale', '🐳', 'W and H together say wuh, as in what, where and why.'],
  ['ph', 'fff', 'phone', '📱', 'P and H together say fff, just like F.'],
  ['ck', 'kuh', 'duck', '🦆', 'C and K together say kuh, at the end of a short word.'],
  ['ng', 'nng', 'ring', '💍', 'N and G together make a sound in your nose: ng.'],
  ['qu', 'kwuh', 'quilt', '🛏️', 'Q almost always has U with it. Together they say kwuh.']
];
// Long vowels with a "magic e": the e is silent and makes the vowel say its name.
const EN_MAGIC = [
  ['a_e', 'ay', 'cake', '🎂', 'Magic e makes A say its name: ay.'],
  ['i_e', 'eye', 'kite', '🪁', 'Magic e makes I say its name: eye.'],
  ['o_e', 'oh', 'rose', '🌹', 'Magic e makes O say its name: oh.'],
  ['u_e', 'you', 'cube', '🧊', 'Magic e makes U say its name: you.'],
  ['e_e', 'ee', 'these', '👉', 'Magic e makes E say its name: ee.']
];
// Vowel teams and r-controlled vowels: two or three letters that work together.
const EN_TEAMS = [
  ['ee', 'ee', 'bee', '🐝'], ['ea', 'ee', 'leaf', '🍃'], ['ai', 'ay', 'rain', '🌧️'], ['ay', 'ay', 'tray', '🍽️'],
  ['oa', 'oh', 'boat', '⛵'], ['ow', 'oh', 'snow', '❄️'], ['oo', 'oo', 'moon', '🌙'], ['oo', 'uu', 'book', '📖'],
  ['ou', 'ow', 'house', '🏠'], ['ow', 'ow', 'cow', '🐄'], ['oi', 'oy', 'coin', '🪙'], ['oy', 'oy', 'boy', '👦'],
  ['ar', 'ar', 'car', '🚗'], ['or', 'or', 'corn', '🌽'], ['er', 'er', 'tiger', '🐯'], ['ir', 'er', 'bird', '🐦'],
  ['ur', 'er', 'turtle', '🐢'], ['igh', 'eye', 'light', '💡'], ['ew', 'oo', 'stew', '🍲'], ['ie', 'eye', 'pie', '🥧']
];
// Sound of every chunk used in blending words.
const EN_SND = Object.assign(Object.fromEntries(EN_LETTERS.map(l => [l[0], l[1]])), Object.fromEntries(EN_DIGRAPHS.map(d => [d[0], d[1]])),
  { ll: 'lll', ss: 'sss', ff: 'fff', zz: 'zzz' });

// Words to blend, sound by sound. Hyphens split the sounds. [word, emoji, stage]
const EN_BLEND = [
  ...'c-a-t🐱 d-o-g🐶 p-i-g🐷 h-e-n🐔 s-u-n☀️ b-u-s🚌 c-u-p☕ b-e-d🛏️ h-a-t🎩 b-a-t🦇 m-a-p🗺️ v-a-n🚐 j-a-m🍯 p-e-n🖊️ n-e-t🥅 w-e-b🕸️ l-e-g🦵 f-o-x🦊 b-o-x📦 p-o-t🍲 b-u-g🐛 n-u-t🥜 h-u-g🤗 p-i-n📌 l-i-p👄 k-i-d🧒 z-i-p🤐 j-e-t✈️ t-e-n🔟 r-e-d🔴 w-e-t💦 m-a-n👨 r-a-t🐀 r-a-m🐏 c-a-p🧢 p-a-n🍳 s-a-d😢 h-o-t🔥 d-i-g⛏️ t-a-p🚰 r-o-d🎣 n-a-p😴 h-u-t🛖 t-u-b🛁 c-a-b🚕 g-a-s⛽ l-o-g🪵 s-i-x6️⃣'
    .split(' ').map(x => [x.match(/^[a-z-]+/)[0], x.replace(/^[a-z-]+/, ''), 1]),
  ...'f-r-o-g🐸 c-r-a-b🦀 d-r-u-m🥁 f-l-a-g🚩 s-t-o-p🛑 sh-i-p🚢 f-i-sh🐟 d-u-ck🦆 ch-i-ck🐥 c-l-a-p👏 s-l-e-d🛷 t-e-n-t⛺ m-i-l-k🥛 h-a-n-d✋ g-i-f-t🎁 l-a-m-p💡 p-l-u-g🔌 b-e-ll🔔 sh-e-ll🐚 b-a-th🛁 t-r-u-ck🚚 b-r-i-ck🧱 c-l-o-ck⏰ r-i-ng💍 k-i-ng🤴 s-w-i-m🏊 s-o-ck🧦 d-r-e-ss👗 s-n-a-ck🍿 ch-e-s-t🧰'
    .split(' ').map(x => [x.match(/^[a-z-]+/)[0], x.replace(/^[a-z-]+/, ''), 2])
].map(([s, e, stage]) => ({ w: s.replace(/-/g, ''), parts: s.split('-'), e, stage }));

// Magic e pairs: short word + e makes a new word. [short, emoji, long, emoji]
const EN_MAGIC_PAIRS = [['cap', '🧢', 'cape', '🦸'], ['kit', '🧰', 'kite', '🪁'], ['tub', '🛁', 'tube', '🧪'], ['pin', '📌', 'pine', '🌲'],
  ['can', '🥫', 'cane', '🦯'], ['man', '👨', 'mane', '🦁'], ['cub', '🐻', 'cube', '🧊'], ['rob', '🦹', 'robe', '👘'], ['glob', '💧', 'globe', '🌍'], ['plan', '📝', 'plane', '✈️']];

// Dolch sight words: the words children meet most often, many of which do not sound out.
const EN_SIGHT = [
  { id: 'pre', name: 'Pre-primer', stage: 1, ico: '🌱', words: 'a and away big blue can come down find for funny go help here I in is it jump little look make me my not one play red run said see the three to two up we where yellow you' },
  { id: 'primer', name: 'Primer', stage: 2, ico: '🌿', words: 'all am are at ate be black brown but came did do eat four get good have he into like must new no now on our out please pretty ran ride saw say she so soon that there they this too under want was well went what white who will with yes' },
  { id: 'g1', name: 'Grade 1', stage: 3, ico: '🌳', words: 'after again an any as ask by could every fly from give going had has her him his how just know let live may of old once open over put round some stop take thank them then think walk were when' },
  { id: 'g2', name: 'Grade 2', stage: 4, ico: '🍎', words: "always around because been before best both buy call cold does don't fast first five found gave goes green its made many off or pull read right sing sit sleep tell their these those upon us use very wash which why wish work would write your" },
  { id: 'g3', name: 'Grade 3', stage: 5, ico: '🏆', words: 'about better bring carry clean cut done draw drink eight fall far full got grow hold hot hurt if keep kind laugh light long much myself never only own pick seven shall show six small start ten today together try warm' }
].map(s => ({ ...s, words: s.words.split(' ') }));

// Words by topic, with a picture. "word:emoji" pairs.
const EN_VOCAB = [
  { id: 'animals', ico: '🐾', name: 'Animals', w: 'dog:🐶,cat:🐱,cow:🐮,pig:🐷,horse:🐴,sheep:🐑,goat:🐐,chicken:🐔,duck:🦆,rabbit:🐰,mouse:🐭,frog:🐸,fish:🐟,bird:🐦,owl:🦉,lion:🦁,tiger:🐯,bear:🐻,elephant:🐘,monkey:🐵,giraffe:🦒,zebra:🦓,snake:🐍,turtle:🐢,whale:🐳,dolphin:🐬,penguin:🐧,bee:🐝,butterfly:🦋,spider:🕷️,fox:🦊,kangaroo:🦘,camel:🐫,crab:🦀,octopus:🐙' },
  { id: 'food', ico: '🍎', name: 'Food', w: 'apple:🍎,banana:🍌,orange:🍊,grapes:🍇,strawberry:🍓,watermelon:🍉,pear:🍐,cherry:🍒,lemon:🍋,peach:🍑,pineapple:🍍,carrot:🥕,corn:🌽,potato:🥔,tomato:🍅,broccoli:🥦,bread:🍞,cheese:🧀,egg:🥚,milk:🥛,rice:🍚,pizza:🍕,cake:🍰,cookie:🍪,ice cream:🍦,soup:🍲,sandwich:🥪,noodles:🍜,honey:🍯,juice:🧃,water:💧' },
  { id: 'family', ico: '👪', name: 'Family & people', w: 'mom:👩,dad:👨,baby:👶,sister:👧,brother:👦,grandma:👵,grandpa:👴,aunt:👩‍🦰,uncle:🧔,cousin:🧒,family:👪,parents:👫,twins:👯,friend:🤝,neighbor:🏘️,pet:🐕,hug:🤗,kiss:😘' },
  { id: 'body', ico: '🖐️', name: 'My body', w: 'head:🗣️,face:🙂,hair:💇,eye:👁️,ear:👂,nose:👃,mouth:👄,teeth:🦷,tongue:👅,hand:✋,finger:☝️,thumb:👍,arm:💪,leg:🦵,foot:🦶,brain:🧠,heart:❤️,bone:🦴,nail:💅,lips:💋' },
  { id: 'colors', ico: '🎨', name: 'Colors', w: 'red:🔴,blue:🔵,green:🟢,yellow:🟡,orange:🟠,purple:🟣,brown:🟤,black:⚫,white:⚪,pink:🌸,gray:🌫️,gold:🥇,silver:🥈,rainbow:🌈' },
  { id: 'home', ico: '🏠', name: 'At home', w: 'house:🏠,door:🚪,window:🪟,bed:🛏️,chair:🪑,sofa:🛋️,lamp:💡,clock:⏰,key:🔑,bath:🛁,shower:🚿,toilet:🚽,soap:🧼,cup:☕,spoon:🥄,fork:🍴,knife:🔪,plate:🍽️,bowl:🥣,pan:🍳,TV:📺,phone:📱,toy:🧸,broom:🧹,box:📦,mirror:🪞,bucket:🪣,candle:🕯️,basket:🧺' },
  { id: 'weather', ico: '🌦️', name: 'Weather & seasons', w: 'sun:☀️,rain:🌧️,cloud:☁️,snow:❄️,wind:🌬️,storm:⛈️,lightning:⚡,fog:🌫️,hot:🥵,cold:🥶,umbrella:☂️,snowman:⛄,tornado:🌪️,thermometer:🌡️,puddle:💦,spring:🌷,summer:🏖️,autumn:🍂,winter:☃️' },
  { id: 'feelings', ico: '😊', name: 'Feelings', w: 'happy:😀,sad:😢,angry:😠,scared:😨,surprised:😮,tired:😴,silly:🤪,shy:🙈,excited:🤩,bored:😑,worried:😟,calm:😌,proud:🏅,loving:🥰,sick:🤒,hungry:😋,confused:😕,brave:🦸,grumpy:😾' },
  { id: 'school', ico: '🏫', name: 'School', w: 'school:🏫,teacher:🧑‍🏫,book:📚,pencil:✏️,crayon:🖍️,paper:📄,scissors:✂️,backpack:🎒,ruler:📏,paint:🎨,computer:💻,globe:🌍,notebook:📓,letter:✉️,numbers:🔢,music:🎵,bell:🔔,abacus:🧮,microscope:🔬,test:📝' },
  { id: 'transport', ico: '🚗', name: 'Getting around', w: 'car:🚗,bus:🚌,train:🚆,plane:✈️,boat:⛵,ship:🚢,bike:🚲,truck:🚚,taxi:🚕,helicopter:🚁,rocket:🚀,tractor:🚜,scooter:🛴,motorbike:🏍️,ambulance:🚑,fire truck:🚒,police car:🚓,subway:🚇,sled:🛷,canoe:🛶,skateboard:🛹' },
  { id: 'nature', ico: '🌳', name: 'Nature', w: 'tree:🌳,flower:🌸,grass:🌱,leaf:🍃,rock:🪨,mountain:⛰️,river:🏞️,sea:🌊,beach:🏖️,moon:🌙,star:⭐,forest:🌲,volcano:🌋,island:🏝️,desert:🏜️,mushroom:🍄,cactus:🌵,nut:🌰,earth:🌎,fire:🔥,shell:🐚,wave:🌊' },
  { id: 'jobs', ico: '🧑‍🚒', name: 'Jobs', w: 'doctor:🧑‍⚕️,nurse:👩‍⚕️,farmer:🧑‍🌾,chef:🧑‍🍳,firefighter:🧑‍🚒,police officer:👮,pilot:🧑‍✈️,astronaut:🧑‍🚀,artist:🧑‍🎨,builder:👷,scientist:🧑‍🔬,mechanic:🧑‍🔧,singer:🧑‍🎤,dentist:🦷,vet:🐾,baker:🥖,mail carrier:📬,judge:🧑‍⚖️' },
  { id: 'clothes', ico: '👕', name: 'Clothes', w: 'shirt:👕,pants:👖,dress:👗,shoes:👟,hat:🎩,cap:🧢,socks:🧦,coat:🧥,scarf:🧣,gloves:🧤,boots:🥾,glasses:👓,crown:👑,swimsuit:🩱,shorts:🩳,ring:💍,bag:👜,tie:👔' },
  { id: 'toys', ico: '🧸', name: 'Toys & play', w: 'ball:⚽,kite:🪁,doll:🪆,teddy bear:🧸,blocks:🧱,puzzle:🧩,yo-yo:🪀,balloon:🎈,drum:🥁,robot:🤖,video game:🎮,dice:🎲,guitar:🎸,piano:🎹,magic wand:🪄,party:🎉' },
  { id: 'actions', ico: '🏃', name: 'Action words', w: 'run:🏃,swim:🏊,dance:💃,sing:🎤,read:📖,write:✍️,eat:🍽️,drink:🥤,sleep:😴,walk:🚶,climb:🧗,cook:🍳,laugh:😂,cry:😭,wave:👋,clap:👏,draw:🖌️,think:🤔,ride:🚴,surf:🏄' },
  { id: 'places', ico: '🏙️', name: 'Places', w: 'hospital:🏥,shop:🏪,library:📚,castle:🏰,bank:🏦,museum:🏛️,city:🏙️,airport:🛫,restaurant:🍽️,hotel:🏨,post office:🏤,stadium:🏟️,camp:⛺,factory:🏭,bridge:🌉,market:🛒,park:🏞️,farm:🚜' }
].map(t => ({ ...t, words: t.w.split(',').map(x => { const i = x.indexOf(':'); return { w: x.slice(0, i), e: x.slice(i + 1) }; }) }));

// Everyday expressions, friendly slang and idioms, explained for a child. [phrase, emoji, meaning, when you might say it]
const EN_SAYINGS = [
  { id: 'everyday', ico: '👋', name: 'Everyday words', stage: 1, items: [
    ['Hello!', '👋', 'A friendly way to greet someone.', 'Hello! My name is Mia.'],
    ['Good morning!', '🌅', 'Hello, early in the day.', 'Good morning, Grandma!'],
    ['Good night!', '🌙', 'What we say before bed.', 'Good night, sleep tight!'],
    ['Please', '🙏', 'A kind word when you ask for something.', 'Can I have some milk, please?'],
    ['Thank you!', '💐', 'You say it when someone does something nice for you.', 'Thank you for the present!'],
    ["You're welcome!", '😊', "A kind answer when someone says thank you.", "Thank you! You're welcome!"],
    ['Excuse me', '🙋', 'A polite way to get past someone or to ask something.', 'Excuse me, where is the park?'],
    ["I'm sorry", '😔', 'What you say when you made a mistake or hurt someone.', "I'm sorry I bumped you."],
    ['Bless you!', '🤧', 'What people say when someone sneezes.', 'Achoo! Bless you!'],
    ['How are you?', '🙂', 'A question that asks how someone feels.', 'Hi Sam, how are you?'],
    ["I'm fine, thanks!", '👍', 'A friendly answer to "how are you?".', "I'm fine, thanks! And you?"],
    ['Nice to meet you!', '🤝', 'What you say when you meet someone new.', 'Hi, I am Leo. Nice to meet you!'],
    ['See you later!', '👋', 'Goodbye, see you again soon.', 'Bye Mom, see you later!'],
    ['Can I help?', '🤲', 'Asking if someone needs a hand.', 'That box looks heavy. Can I help?'],
    ['Watch out!', '⚠️', 'Be careful, something might hurt you.', 'Watch out! The floor is wet.'],
    ['Well done!', '🏅', 'You did a great job.', 'You finished the puzzle. Well done!'],
    ['Happy birthday!', '🎂', 'What we say on the day someone was born.', 'Happy birthday! You are six today!'],
    ['Have fun!', '🎉', 'I hope you enjoy it.', 'Have fun at the party!'],
    ['Take turns', '🔄', 'One person goes, then the other person goes.', "Let's take turns on the swing."],
    ['May I...?', '✋', 'A polite way to ask if you are allowed.', 'May I go to the bathroom?']
  ] },
  { id: 'fun', ico: '😎', name: 'Fun talk', stage: 2, items: [
    ["What's up?", '🙌', 'Hi! How are you? What is happening?', "Hey Sam, what's up?"],
    ['Cool!', '😎', 'Great! I like it!', 'Your new bike is so cool!'],
    ['Awesome!', '🤩', 'Really, really great.', 'We are going to the zoo? Awesome!'],
    ['No way!', '😲', "Wow, I can't believe it!", 'You saw a real whale? No way!'],
    ['Yay!', '🥳', 'A happy cheer.', 'Yay! It is snowing!'],
    ['Oops!', '🙊', 'A little mistake just happened.', 'Oops! I dropped my spoon.'],
    ['Uh-oh!', '😬', 'Something is going wrong.', 'Uh-oh, the milk spilled!'],
    ['Yummy!', '😋', 'This food tastes very good.', 'Pancakes! Yummy!'],
    ['Gotcha!', '😜', 'I caught you! (in a game, or a joke)', 'Tag, gotcha! You are it!'],
    ['Hang on!', '🖐️', 'Wait a little bit.', 'Hang on, I need my shoes.'],
    ['Chill out', '🧊', 'Calm down and relax.', "Chill out, it's only a game."],
    ['Buddy', '🤝', 'A friend.', 'Come on, buddy, let us play!'],
    ['High five!', '🙌', 'Slap hands to say "great job".', 'We did it! High five!'],
    ['Easy peasy!', '🍋', 'Very, very easy.', 'Tying my shoes? Easy peasy!'],
    ['Okey-dokey', '👌', 'A funny way to say okay.', 'Time for bed? Okey-dokey.'],
    ['Super duper!', '🌟', 'Extra super good.', 'That drawing is super duper!'],
    ['See ya!', '✌️', 'A quick way to say goodbye.', 'See ya tomorrow!'],
    ['My bad', '🙈', 'Sorry, that was my mistake.', 'I took your crayon. My bad!'],
    ['Totally!', '💯', 'Yes, completely!', 'Do you want ice cream? Totally!'],
    ['Hooray!', '🎊', 'A big happy shout.', 'Hooray, we won!'],
    ['Whatever you like', '🤷', 'You can choose.', 'Which game? Whatever you like.'],
    ['Same here', '🙋', 'Me too, I feel the same.', "I'm hungry. Same here!"]
  ] },
  { id: 'idioms', ico: '🐱', name: 'Funny sayings', stage: 3, items: [
    ["It's raining cats and dogs", '🌧️', 'It is raining very, very hard. (No real cats or dogs!)', "Take an umbrella, it's raining cats and dogs!"],
    ['A piece of cake', '🍰', 'Something very easy.', 'That spelling test was a piece of cake.'],
    ['Break a leg!', '🎭', 'Good luck! (said before a show, not about hurting yourself)', 'Break a leg in your school play!'],
    ['Under the weather', '🤒', 'Feeling a bit sick.', "I'm under the weather, so I'll rest."],
    ['Hold your horses!', '🐴', 'Wait! Slow down.', 'Hold your horses, the cake is still hot!'],
    ['Butterflies in my tummy', '🦋', 'A fluttery, nervous feeling.', 'I had butterflies in my tummy before the race.'],
    ['Over the moon', '🌙', 'Very, very happy.', 'She was over the moon with her new puppy.'],
    ['Let the cat out of the bag', '🐈', 'Tell a secret by mistake.', 'Shh, don\'t let the cat out of the bag about the party!'],
    ['Cool as a cucumber', '🥒', 'Very calm, not worried at all.', 'He stayed cool as a cucumber in the storm.'],
    ['In hot water', '♨️', 'In trouble.', 'I was in hot water for drawing on the wall.'],
    ['Time flies', '⏰', 'Time seems to go very fast.', 'Time flies when you are having fun!'],
    ['Zip it!', '🤐', 'Stop talking now.', 'Zip it, the movie is starting!'],
    ['Copycat', '🐱', 'Someone who copies what you do.', 'Stop being a copycat!'],
    ['Couch potato', '🛋️', 'Someone who sits on the sofa all day.', "Don't be a couch potato, let's go outside!"],
    ['Busy as a bee', '🐝', 'Very busy, working hard.', 'Dad is busy as a bee in the garden.'],
    ['Apple of my eye', '🍎', 'Someone you love very much.', 'Grandma says I am the apple of her eye.'],
    ['Spill the beans', '🥫', 'Tell a secret.', 'Come on, spill the beans! What is in the box?'],
    ['Hit the hay', '🛏️', 'Go to bed.', 'I am sleepy. Time to hit the hay.'],
    ['Once in a blue moon', '🔵', 'Very, very rarely.', 'We eat cake for breakfast once in a blue moon.'],
    ['A frog in my throat', '🐸', 'A croaky voice that is hard to talk with.', 'Sorry, I have a frog in my throat.'],
    ['When pigs fly', '🐷', 'Never! It will not happen.', 'My cat will take a bath when pigs fly!'],
    ['Two peas in a pod', '🌱', 'Two people who are very alike.', 'The twins are like two peas in a pod.'],
    ['Ants in your pants', '🐜', 'Not able to sit still.', 'You wiggle so much, you have ants in your pants!'],
    ['On cloud nine', '☁️', 'Super happy.', 'After the party I was on cloud nine.'],
    ['Easy as pie', '🥧', 'Very easy.', 'Counting to ten is easy as pie.'],
    ['The early bird catches the worm', '🐦', 'If you start early, you get the best things.', 'Let us go first thing. The early bird catches the worm!'],
    ['Actions speak louder than words', '💪', 'What you do shows more than what you say.', 'Helping is better than saying you will help. Actions speak louder than words.'],
    ["Don't cry over spilled milk", '🥛', "Don't be upset about a small thing you can't change.", "The cookie broke, but don't cry over spilled milk."],
    ['It\'s a small world', '🌍', 'Said when you meet someone you know in a surprising place.', 'You go to my cousin\'s school? It\'s a small world!'],
    ['Bite off more than you can chew', '🍔', 'Try to do too much at once.', "Ten projects at once? Don't bite off more than you can chew."]
  ] }
];
