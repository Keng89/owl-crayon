/* ---------- English & Reading, part 2: stories, sentences and grammar games (data and question makers) ---------- */
// Short decodable stories that grow with the reading ladder. Each page is [picture, text]; then questions [q, right, wrong, wrong].
const EN_STORIES = [
  { id: 'cathat', stage: 1, ico: '🐱', title: 'The Cat and the Hat', pages: [
    ['🐱', 'A cat sat on a mat.'], ['🎩', 'The cat had a hat.'], ['🔴', 'The hat was red.'], ['🐶', 'A big dog ran in.'], ['🐱🐶', 'The cat and the dog sat on the mat.']],
    qs: [['What did the cat have?', 'a hat', 'a bag', 'a cup'], ['What color was the hat?', 'red', 'blue', 'green'], ['Who ran in?', 'a dog', 'a pig', 'a hen']] },
  { id: 'pigmud', stage: 1, ico: '🐷', title: 'Pip in the Mud', pages: [
    ['🐷', 'Pip is a pig.'], ['🟤', 'Pip can dig in the mud.'], ['💦', 'Pip is wet and hot.'], ['🛁', 'Mom gets Pip in a tub.'], ['😊', 'Now Pip is not a mud pig!']],
    qs: [['Who is Pip?', 'a pig', 'a cat', 'a fox'], ['Where did Pip dig?', 'in the mud', 'in the sand', 'in a box'], ['Where did Mom put Pip?', 'in a tub', 'in a bed', 'in a van']] },
  { id: 'redbus', stage: 1, ico: '🚌', title: "Ben's Red Bus", pages: [
    ['🚌', 'Ben has a red bus.'], ['💨', 'The bus can go fast.'], ['🧒', 'Ten kids get on the bus.'], ['⛰️', 'The bus stops at a big hill.'], ['🏃', 'The kids get off and run up the hill.']],
    qs: [['What color is the bus?', 'red', 'yellow', 'pink'], ['How many kids get on?', 'ten', 'six', 'two'], ['What did the kids do at the hill?', 'ran up it', 'had a nap', 'ate a bun']] },
  { id: 'foxbox', stage: 2, ico: '🦊', title: 'Fox and the Box', pages: [
    ['🦊', 'A fox sees a big box.'], ['📦', 'Is it a bed? Is it a hut?'], ['🦊📦', 'The fox gets in the box.'], ['🧣', 'It is snug in the box.'], ['😴', 'The fox has a long nap.']],
    qs: [['What did the fox see?', 'a big box', 'a red hat', 'a bus'], ['How did the fox feel in the box?', 'snug', 'wet', 'sad'], ['What did the fox do?', 'had a nap', 'ate jam', 'sang a song']] },
  { id: 'duckfrog', stage: 2, ico: '🦆', title: 'Duck and Frog', pages: [
    ['🦆', 'Duck can swim in the pond.'], ['🐸', 'Frog can jump on a log.'], ['❓', 'Duck said, "Can you swim, Frog?"'], ['🐸', 'Frog said, "Yes! And I can jump, too!"'], ['🌞', 'So they swim and jump all day.']],
    qs: [['Who can jump on a log?', 'Frog', 'Duck', 'Fish'], ['Where does Duck swim?', 'in the pond', 'in the bath', 'in the sea'], ['What did they do all day?', 'swim and jump', 'sleep', 'read books']] },
  { id: 'fishwish', stage: 2, ico: '🐟', title: 'The Fish Wish', pages: [
    ['🐟', 'Shelly is a little fish.'], ['🚢', 'She lives in an old ship at the bottom of the sea.'], ['💭', 'She wishes she had a friend.'], ['🦀', 'Then a crab with a big shell comes to the ship.'], ['💬', 'Now Shelly has a friend to chat with.']],
    qs: [['Where does Shelly live?', 'in an old ship', 'in a shell', 'in a pond'], ['What does Shelly wish for?', 'a friend', 'a hat', 'a cake'], ['Who comes to the ship?', 'a crab', 'a shark', 'a duck']] },
  { id: 'kite', stage: 3, ico: '🪁', title: "Jake's Kite", pages: [
    ['🪁', 'Jake has a kite.'], ['⚪', 'It is white with a long tail.'], ['🏞️', 'He runs to the lake to fly it.'], ['🌬️', 'The wind takes the kite up high, over the pine trees.'], ['😄', 'Jake smiles. What a fine day!']],
    qs: [['What color is the kite?', 'white', 'red', 'black'], ['Where did Jake fly the kite?', 'at the lake', 'at school', 'in his room'], ['What took the kite up high?', 'the wind', 'a bird', 'a plane']] },
  { id: 'rainday', stage: 3, ico: '🌧️', title: 'A Rainy Day', pages: [
    ['🌧️', 'It is a gray day. Rain falls on the street.'], ['⏳', 'Mia wants to play outside, but she has to wait.'], ['📖', 'She reads a book and eats a peach.'], ['🌈', 'Then the sun peeks out, and there is a rainbow!'], ['🏃‍♀️', 'Mia runs out to see it.']],
    qs: [['Why did Mia have to wait?', 'it was raining', 'she was sick', 'it was night'], ['What did Mia eat?', 'a peach', 'a pear', 'a pie'], ['What did Mia see at the end?', 'a rainbow', 'a snowman', 'a rocket']] },
  { id: 'teddy', stage: 3, ico: '🧸', title: 'The Lost Teddy', pages: [
    ['😟', 'Sam could not find his teddy.'], ['🛏️', 'He looked under his bed. No teddy.'], ['📦', 'He looked in the toy box. No teddy.'], ['🐕', 'Then his dog Max came in with something soft.'], ['🧸', 'It was the teddy! Max wanted to play, too.']],
    qs: [['What did Sam lose?', 'his teddy', 'his shoe', 'his hat'], ['Where did Sam look first?', 'under his bed', 'in the garden', 'in the car'], ['Who had the teddy?', 'Max the dog', 'his sister', 'the cat']] },
  { id: 'seed', stage: 4, ico: '🌻', title: "Lily's Seed", pages: [
    ['🌰', 'Lily planted a small seed in a pot of soil.'], ['💧', 'Every day she gave it some water and put it in the sun.'], ['🌱', 'After a week, a tiny green shoot poked up.'], ['📏', 'It grew taller and taller, all through the summer.'], ['🌻', 'One morning, Lily found a huge yellow sunflower smiling at her!']],
    qs: [['What did Lily give the seed every day?', 'water and sun', 'milk and cookies', 'nothing'], ['What came up first?', 'a tiny shoot', 'a big flower', 'an apple'], ['What did the seed grow into?', 'a sunflower', 'a tree', 'a cactus'], ['What does "huge" mean?', 'very big', 'very small', 'very wet']] },
  { id: 'owlnight', stage: 4, ico: '🦉', title: "Owl's Night Flight", pages: [
    ['🌇', 'When the sun went down, Owl opened her big round eyes.'], ['🌲', 'She flew silently over the dark forest.'], ['🐭', 'Below her she spotted a mouse, a bat and a sleepy fox.'], ['🌙', 'Owl hooted softly to say goodnight to her friends.'], ['🌅', 'When the sun came up, Owl flew home to sleep in her tree.']],
    qs: [['When does Owl wake up?', 'when the sun goes down', 'in the morning', 'at lunch'], ['Which animal was sleepy?', 'the fox', 'the mouse', 'the bat'], ['Where does Owl sleep?', 'in her tree', 'in a cave', 'in a nest on the ground'], ['What does "silently" mean?', 'with no sound', 'very fast', 'upside down']] },
  { id: 'museum', stage: 4, ico: '🦖', title: 'The Dinosaur Museum', pages: [
    ['🚌', 'On Friday, our class took a bus to the museum.'], ['🦴', 'The first room had a giant dinosaur skeleton.'], ['🦖', 'Our guide said it was a T. rex that lived long, long ago.'], ['🥚', 'We also saw a fossil egg as big as a football.'], ['✏️', 'Back at school, we all drew our favorite dinosaur.']],
    qs: [['How did the class get to the museum?', 'by bus', 'by boat', 'they walked'], ['What was in the first room?', 'a dinosaur skeleton', 'a whale', 'a rocket'], ['How big was the fossil egg?', 'as big as a football', 'as big as a pea', 'as big as a house'], ['What did they do back at school?', 'drew dinosaurs', 'had a race', 'went home']] },
  { id: 'sandcastle', stage: 5, ico: '🏖️', title: 'The Sandcastle Contest', pages: [
    ['🏖️', 'Every summer, the town held a sandcastle contest on the beach.'], ['👫', 'Leo and his sister Ava wanted to build the tallest castle anyone had ever seen.'], ['🪣', 'They carried buckets of wet sand, because dry sand crumbles and falls apart.'], ['🌊', 'Just as they finished, a sneaky wave rushed in and knocked down one tower!'], ['🏆', 'Instead of giving up, they built a wall to protect the rest, and the judges gave them a prize for the cleverest idea.']],
    qs: [['Why did they use wet sand?', 'dry sand falls apart', 'wet sand is warmer', 'it was raining'], ['What knocked down a tower?', 'a wave', 'a dog', 'the wind'], ['What prize did they win?', 'the cleverest idea', 'the tallest castle', 'the fastest builders'], ['What does "giving up" mean?', 'stopping trying', 'trying harder', 'going up a hill']] },
  { id: 'robot', stage: 5, ico: '🤖', title: "Grandpa's Garden Robot", pages: [
    ['👴', 'Grandpa loved inventing things in his messy workshop.'], ['🤖', 'One spring, he built a small robot to help in the garden.'], ['🥕', 'The robot was supposed to pull weeds, but it pulled up all the carrots instead!'], ['🔧', 'Grandpa and I fixed its program so it could tell a weed from a carrot.'], ['🥗', 'By autumn, we had the biggest carrot harvest on our street, and the robot was very proud.']],
    qs: [['What did Grandpa build?', 'a garden robot', 'a rocket', 'a treehouse'], ['What went wrong at first?', 'it pulled up the carrots', 'it ran away', 'it fell asleep'], ['How did they fix the problem?', 'they fixed its program', 'they bought new carrots', 'they sold the robot'], ['What is a "harvest"?', 'the crops you pick', 'a kind of robot', 'a rainy day']] }
];

// Sentences to read, each with its picture. The first 12 are for Stage 1.
const EN_SENTENCES = [
  ['I see a cat.', '🐱'], ['The dog can run.', '🐕'], ['A fish is in the sea.', '🐟'], ['The sun is hot.', '☀️'], ['I like red apples.', '🍎'], ['The bird can fly.', '🐦'],
  ['A frog sits on a log.', '🐸'], ['The bus is big.', '🚌'], ['Mom has a cup.', '☕'], ['We play with a ball.', '⚽'], ['The moon is up at night.', '🌙'], ['A bee is on a flower.', '🐝'],
  ['The baby is asleep.', '👶'], ['I ride my bike to the park.', '🚲'], ['The cake has six candles.', '🎂'], ['It is raining today.', '🌧️'], ['The duck swims in the pond.', '🦆'], ['A cow says moo.', '🐮'],
  ['The snowman has a hat.', '⛄'], ['I read a book in bed.', '📖'], ['The rocket goes up to space.', '🚀'], ['The ice cream is cold.', '🍦'], ['A monkey eats a banana.', '🐒'], ['The train goes on a track.', '🚂'],
  ['The tree has green leaves.', '🌳'], ['I brush my teeth.', '🪥'], ['The race car is very fast.', '🏎️'], ['A lion has a big mane.', '🦁'], ['The owl hoots at night.', '🦉'], ['The firefighter sprays water.', '🧑‍🚒']
].map(([s, e], i) => ({ s, e, stage: i < 12 ? 1 : i < 22 ? 2 : 3 }));

// Sentences to build from word blocks, by stage.
const EN_BUILD = [
  [1, 'I can run.'], [1, 'I see a dog.'], [1, 'The cat is big.'], [1, 'We like to play.'], [1, 'It is hot.'], [1, 'I am happy.'], [1, 'The sun is up.'], [1, 'A pig can dig.'], [1, 'I like my hat.'], [1, 'Mom can cook.'],
  [2, 'The dog has a red ball.'], [2, 'We go to the park.'], [2, 'My cat is on the bed.'], [2, 'Can you see the moon?'], [2, 'I like to read books.'], [2, 'Where is my hat?'], [2, 'Sam has a big kite.'], [2, 'The fish can swim fast.'], [2, 'Look at the rainbow!'], [2, 'Is it your turn?'],
  [3, 'The little bird sang a song.'], [3, 'Do you want to play with me?'], [3, 'Mia and Ben went to the zoo.'], [3, 'What a big cake!'], [3, 'The bus stops at the school.'], [3, 'We ate pizza for lunch.'], [3, 'Who is at the door?'], [3, 'The frog jumped into the pond.'], [3, 'I can tie my own shoes.'],
  [4, 'After lunch, we played in the garden.'], [4, 'My brother is taller than me.'], [4, 'Why is the sky blue?'], [4, 'The puppy wagged its tail happily.'], [4, 'Please close the door quietly.'], [4, 'Wow, that was an amazing show!'],
  [5, 'Although it was raining, we went for a walk.'], [5, 'The scientist looked carefully through the microscope.'], [5, 'Which planet is closest to the sun?'], [5, 'My grandmother baked delicious cookies yesterday.']
].map(([stage, s]) => ({ stage, s }));
const EN_NAMES = ['I', 'Sam', 'Mia', 'Ben', 'Max', 'Lily', 'Leo', 'Ava', 'Pip', 'Jake'];

/* --- grammar games --- */
// A question is { prompt, say, visual, choices: [{ html, val, say, txt }], answer, explain }.
const enTxt = (arr, ans) => shuffle([...new Set(arr)]).map(v => ({ html: esc(v), val: v, say: v, txt: true }));
const enPic = e => `<div class="en-pic">${e}</div>`;
const enDistinct = (ans, pool, n) => [ans, ...shuffle(pool.filter(x => x !== ans)).slice(0, n - 1)];
const enCap = s => s.charAt(0).toUpperCase() + s.slice(1);

const EN_POS = {
  noun: 'dog:🐶,cat:🐱,ball:⚽,tree:🌳,apple:🍎,car:🚗,house:🏠,book:📖,fish:🐟,bed:🛏️,sun:☀️,girl:👧,boy:👦,cake:🎂,hat:🎩,teacher:🧑‍🏫,bird:🐦,shoe:👟',
  verb: 'run:🏃,jump:🤸,swim:🏊,eat:🍽️,sing:🎤,sleep:😴,read:📖,kick:⚽,climb:🧗,dance:💃,draw:✏️,write:✍️,cook:🍳,clap:👏,cry:😭,throw:🤾,ride:🚴',
  adj: 'big:🐘,small:🐭,happy:😀,sad:😢,hot:🔥,cold:🥶,red:🔴,tall:🦒,soft:🧸,fast:🐆,slow:🐢,funny:🤪,wet:💦,shiny:✨,loud:📢,sleepy:🥱,round:🟠'
};
const EN_POS_W = Object.entries(EN_POS).flatMap(([k, s]) => s.split(',').map(x => { const [w, e] = x.split(':'); return { w, e, k }; }));
const EN_PLURAL = [
  ['cat', 'cats', 's', '🐱'], ['dog', 'dogs', 's', '🐶'], ['book', 'books', 's', '📚'], ['apple', 'apples', 's', '🍎'], ['car', 'cars', 's', '🚗'], ['star', 'stars', 's', '⭐'], ['frog', 'frogs', 's', '🐸'],
  ['box', 'boxes', 'es', '📦'], ['bus', 'buses', 'es', '🚌'], ['fox', 'foxes', 'es', '🦊'], ['dish', 'dishes', 'es', '🍽️'], ['brush', 'brushes', 'es', '🖌️'], ['watch', 'watches', 'es', '⌚'], ['glass', 'glasses', 'es', '🥛'], ['peach', 'peaches', 'es', '🍑'],
  ['baby', 'babies', 'ies', '👶'], ['puppy', 'puppies', 'ies', '🐶'], ['berry', 'berries', 'ies', '🍓'], ['story', 'stories', 'ies', '📖'], ['butterfly', 'butterflies', 'ies', '🦋'],
  ['leaf', 'leaves', 'ves', '🍃'], ['wolf', 'wolves', 'ves', '🐺'], ['knife', 'knives', 'ves', '🔪'], ['loaf', 'loaves', 'ves', '🍞'],
  ['child', 'children', 'odd', '🧒'], ['mouse', 'mice', 'odd', '🐭'], ['foot', 'feet', 'odd', '🦶'], ['tooth', 'teeth', 'odd', '🦷'], ['man', 'men', 'odd', '👨'], ['woman', 'women', 'odd', '👩'], ['goose', 'geese', 'odd', '🦢'], ['person', 'people', 'odd', '🧑'],
  ['sheep', 'sheep', 'same', '🐑'], ['fish', 'fish', 'same', '🐟'], ['deer', 'deer', 'same', '🦌']
];
const EN_PLURAL_WHY = { s: 'Most words just add s.', es: 'Words ending in s, x, sh, ch or ss add es, so you can say it.', ies: 'When a word ends in a consonant and y, change the y to i and add es.', ves: 'Some words ending in f or fe change to ves.', odd: 'This word is special. It changes inside instead of adding s.', same: 'This word stays the same for one or many!' };
const EN_AAN = { an: 'apple:🍎,egg:🥚,ant:🐜,owl:🦉,umbrella:☂️,octopus:🐙,elephant:🐘,orange:🍊,ice cream:🍦,astronaut:🧑‍🚀,alligator:🐊,eagle:🦅,igloo:🧊', a: 'cat:🐱,dog:🐶,ball:⚽,banana:🍌,kite:🪁,hat:🎩,pig:🐷,cake:🎂,bus:🚌,tree:🌳,robot:🤖,lemon:🍋,frog:🐸,horse:🐴' };
const EN_PRON = [
  ['Sam is a boy. ___ is kind.', 'He', '👦'], ['Mia is a girl. ___ likes to sing.', 'She', '👧'], ['The ball is red. ___ is round.', 'It', '⚽'], ['Tom and Ana are friends. ___ play together.', 'They', '👫'],
  ['My friend and I are here. ___ are happy.', 'We', '🧑‍🤝‍🧑'], ['This is Mia. Give the book to ___.', 'her', '👧'], ['This is Ben. Say hello to ___.', 'him', '👦'], ['The cats are hungry. Feed ___, please.', 'them', '🐱'],
  ['Dad is tall. ___ can reach the top shelf.', 'He', '👨'], ['Grandma bakes. ___ makes yummy bread.', 'She', '👵'], ['The dog is wet. ___ jumped in the pond.', 'It', '🐶'], ['Ben and I like trains. Mom takes ___ to see them.', 'us', '🚂']
];
const EN_PRON_ALL = ['He', 'She', 'It', 'They', 'We', 'her', 'him', 'them', 'us'];
const EN_OPP = 'big:small:🐘:🐭,hot:cold:🔥:🧊,happy:sad:😀:😢,up:down:⬆️:⬇️,day:night:☀️:🌙,fast:slow:🐆:🐢,tall:short:🦒:🐁,open:closed:📖:📕,wet:dry:💦:🌵,full:empty:🍪:🍽️,loud:quiet:📢:🤫,in:out:📥:📤,on:off:💡:🌑,hard:soft:🪨:🧸,clean:dirty:🧼:🐷,push:pull:🛒:🧲,top:bottom:🔝:⬇️,left:right:⬅️:➡️,start:finish:🏁:🏆,win:lose:🥇:😞,old:new:👴:👶,heavy:light:🏋️:🪶,sweet:sour:🍭:🍋,near:far:🏠:🏔️'
  .split(',').map(x => x.split(':'));
const EN_PAST = [
  ['jump', 'jumped'], ['play', 'played'], ['walk', 'walked'], ['kick', 'kicked'], ['look', 'looked'], ['help', 'helped'], ['cook', 'cooked'], ['paint', 'painted'], ['dance', 'danced'], ['smile', 'smiled'],
  ['hop', 'hopped'], ['stop', 'stopped'], ['clap', 'clapped'], ['cry', 'cried'], ['carry', 'carried'],
  ['go', 'went'], ['eat', 'ate'], ['see', 'saw'], ['run', 'ran'], ['sit', 'sat'], ['come', 'came'], ['make', 'made'], ['drink', 'drank'], ['sing', 'sang'], ['swim', 'swam'], ['take', 'took'],
  ['give', 'gave'], ['get', 'got'], ['have', 'had'], ['say', 'said'], ['write', 'wrote'], ['fly', 'flew'], ['sleep', 'slept'], ['buy', 'bought'], ['think', 'thought'], ['catch', 'caught'], ['find', 'found']
];
// [preposition, stage]; the picture puts a cat around a box.
const EN_PREP = [['in', 2], ['on', 2], ['under', 2], ['next to', 3], ['behind', 3], ['in front of', 3], ['above', 3], ['between', 3]];
const EN_QS = [
  ['The dog is brown', '.'], ['I like apples', '.'], ['We went to the beach', '.'], ['My shoes are blue', '.'], ['The cat is asleep', '.'], ['It is my birthday', '.'],
  ['Do you like apples', '?'], ['Where is my hat', '?'], ['Can we go outside', '?'], ['What is your name', '?'], ['Is it raining', '?'], ['Who ate the cake', '?'], ['How old are you', '?'],
  ['Watch out', '!'], ['Wow, that is huge', '!'], ['What a surprise', '!'], ['Hooray, we won', '!'], ['Stop right there', '!']
];
const EN_CAPS = ['My dog is called Max.', 'Mia and I went to the park.', 'On Monday we visit Grandma.', 'Ben lives in London.', 'I like to play with Leo.', 'We went to Paris in June.', 'Lily has a cat called Tom.', 'Can Sam come to my party?'];
const EN_ISARE = [['The cats ___ sleeping.', 'are', 'is'], ['The dog ___ barking.', 'is', 'are'], ['My friends ___ here.', 'are', 'is'], ['The sun ___ hot.', 'is', 'are'], ['We ___ happy.', 'are', 'is'], ['I ___ five.', 'am', 'is'],
  ['Yesterday the birds ___ singing.', 'were', 'was'], ['Last night it ___ cold.', 'was', 'were'], ['The apples ___ red.', 'are', 'is'], ['She ___ my sister.', 'is', 'are'], ['They ___ at school yesterday.', 'were', 'was'], ['I ___ tired last night.', 'was', 'were']];
const EN_CONTR = [['do not', "don't"], ['can not', "can't"], ['I am', "I'm"], ['it is', "it's"], ['we are', "we're"], ['they are', "they're"], ['you are', "you're"], ['is not', "isn't"], ['did not', "didn't"], ['I will', "I'll"], ['let us', "let's"], ['she is', "she's"], ['would not', "wouldn't"], ['I have', "I've"], ['was not', "wasn't"]];
const EN_COMP = [['big', 'bigger', 'biggest'], ['small', 'smaller', 'smallest'], ['tall', 'taller', 'tallest'], ['fast', 'faster', 'fastest'], ['happy', 'happier', 'happiest'], ['good', 'better', 'best'], ['bad', 'worse', 'worst'],
  ['hot', 'hotter', 'hottest'], ['long', 'longer', 'longest'], ['funny', 'funnier', 'funniest'], ['loud', 'louder', 'loudest'], ['far', 'farther', 'farthest'], ['busy', 'busier', 'busiest'], ['thin', 'thinner', 'thinnest']];
const EN_SYN = [['big', 'large'], ['small', 'tiny'], ['happy', 'glad'], ['fast', 'quick'], ['begin', 'start'], ['shut', 'close'], ['jump', 'leap'], ['talk', 'speak'], ['smart', 'clever'], ['scared', 'afraid'], ['end', 'finish'],
  ['mad', 'angry'], ['nice', 'kind'], ['yell', 'shout'], ['rock', 'stone'], ['gift', 'present'], ['giggle', 'laugh'], ['chilly', 'cold'], ['look', 'see'], ['sad', 'unhappy'], ['huge', 'enormous'], ['easy', 'simple']];
const EN_CONJ = [['I like cats ___ dogs.', 'and'], ['I wanted to play, ___ it was raining.', 'but'], ['I wore a coat ___ it was cold.', 'because'], ['I was hungry, ___ I ate an apple.', 'so'], ['Do you want milk ___ juice?', 'or'],
  ['We sang ___ we danced.', 'and'], ['She is small, ___ she is strong.', 'but'], ['He smiled ___ he got a present.', 'because'], ['It was late, ___ we went to bed.', 'so'], ['Is it a cat ___ a dog?', 'or']];
const EN_ADV = [['The turtle walks ___.', 'slowly'], ['The cheetah runs ___.', 'quickly'], ['The baby sleeps ___.', 'quietly'], ['The lion roars ___.', 'loudly'], ['She smiled ___ at her friend.', 'happily'], ['Carry the eggs ___.', 'carefully'],
  ['The snow fell ___ on the roof.', 'softly'], ['He finished the race ___ and won.', 'quickly'], ['Please talk ___ in the library.', 'quietly'], ['The drums banged ___.', 'loudly']];
const EN_ADV_ALL = ['slowly', 'quickly', 'quietly', 'loudly', 'happily', 'carefully', 'softly', 'sadly'];
const EN_HOMO = [['I have ___ cats.', 'two', ['to', 'too']], ['I want to come, ___.', 'too', ['two', 'to']], ['We go ___ school.', 'to', ['two', 'too']], ['___ dog is brown.', 'Their', ['There', "They're"]], ['Put the box over ___.', 'there', ['their', "they're"]],
  ["___ going to the park.", "They're", ['Their', 'There']], ['I can ___ the ocean.', 'see', ['sea']], ['Fish swim in the ___.', 'sea', ['see']], ['Can you ___ the music?', 'hear', ['here']], ['Come over ___.', 'here', ['hear']],
  ['The sky is ___.', 'blue', ['blew']], ['The wind ___ my hat away.', 'blew', ['blue']], ['I ___ the answer.', 'know', ['no']], ['___, thank you.', 'No', ['Know']], ['I will ___ a letter.', 'write', ['right']], ['Turn ___ at the corner.', 'right', ['write']],
  ['I ___ my lunch.', 'ate', ['eight']], ['A spider has ___ legs.', 'eight', ['ate']], ['The ___ is shining.', 'sun', ['son']], ['I ___ a red bird.', 'saw', ['sore']]];
const EN_AFFIX = [['unhappy', 'not happy', 'un'], ['unlock', 'open a lock', 'un'], ['untidy', 'not tidy', 'un'], ['redo', 'do again', 're'], ['reread', 'read again', 're'], ['refill', 'fill again', 're'],
  ['helpful', 'full of help', 'ful'], ['careful', 'full of care', 'ful'], ['joyful', 'full of joy', 'ful'], ['fearless', 'without fear', 'less'], ['endless', 'without an end', 'less'], ['careless', 'without care', 'less'],
  ['preheat', 'heat before', 'pre'], ['dislike', 'not like', 'dis'], ['disagree', 'not agree', 'dis'], ['teacher', 'a person who teaches', 'er'], ['painter', 'a person who paints', 'er']];
const EN_AFFIX_WHY = { un: 'un- at the start means not, or the opposite.', re: 're- at the start means again.', ful: '-ful at the end means full of.', less: '-less at the end means without.', pre: 'pre- at the start means before.', dis: 'dis- at the start means not.', er: '-er at the end can mean a person who does it.' };
const EN_RHYME = ['cat:🐱,hat:🎩,bat:🦇,rat:🐀', 'dog:🐶,frog:🐸,log:🪵', 'bee:🐝,tree:🌳,key:🔑,three:3️⃣', 'car:🚗,star:⭐', 'king:🤴,ring:💍,swing:🛝', 'cake:🎂,snake:🐍,rake:🧹', 'clock:⏰,sock:🧦,rock:🪨',
  'fish:🐟,dish:🍽️', 'boat:⛵,goat:🐐,coat:🧥', 'bug:🐛,mug:☕,hug:🤗', 'bed:🛏️,red:🔴,sled:🛷', 'fox:🦊,box:📦,socks:🧦', 'mouse:🐭,house:🏠', 'snail:🐌,nail:💅,mail:📬', 'moon:🌙,spoon:🥄,balloon:🎈', 'bear:🐻,chair:🪑,pear:🍐']
  .map(f => f.split(',').map(x => { const [w, e] = x.split(':'); return { w, e }; })).map(f => f.filter(x => x.e !== '🛝'));
const EN_SYLL = [['cat', 1, '🐱'], ['dog', 1, '🐶'], ['sun', 1, '☀️'], ['frog', 1, '🐸'], ['apple', 2, '🍎'], ['tiger', 2, '🐯'], ['rabbit', 2, '🐰'], ['pencil', 2, '✏️'], ['monkey', 2, '🐵'], ['robot', 2, '🤖'], ['pizza', 2, '🍕'],
  ['banana', 3, '🍌'], ['elephant', 3, '🐘'], ['dinosaur', 3, '🦕'], ['butterfly', 3, '🦋'], ['octopus', 3, '🐙'], ['tomato', 3, '🍅'], ['umbrella', 3, '☂️'], ['kangaroo', 3, '🦘'],
  ['watermelon', 4, '🍉'], ['caterpillar', 4, '🐛'], ['helicopter', 4, '🚁'], ['alligator', 4, '🐊'], ['avocado', 4, '🥑']];
// How to clap each word, for the explanation.
const EN_SYLL_CUT = { apple: 'ap-ple', tiger: 'ti-ger', rabbit: 'rab-bit', pencil: 'pen-cil', monkey: 'mon-key', robot: 'ro-bot', pizza: 'piz-za', banana: 'ba-na-na', elephant: 'el-e-phant', dinosaur: 'di-no-saur', butterfly: 'but-ter-fly', octopus: 'oc-to-pus', tomato: 'to-ma-to', umbrella: 'um-brel-la', kangaroo: 'kan-ga-roo', watermelon: 'wa-ter-mel-on', caterpillar: 'cat-er-pil-lar', helicopter: 'hel-i-cop-ter', alligator: 'al-li-ga-tor', avocado: 'av-o-ca-do' };

function enPrepPic(p) {
  const box = '<span class="en-pp-box">📦</span>', cat = '<span class="en-pp-cat">🐱</span>';
  return `<div class="en-pp en-pp-${p.replace(/ /g, '-')}" role="img" aria-label="A cat and a box">${p === 'between' ? box + cat + box : box + cat}</div>`;
}

// Each game: id, icon, name, stage it opens at, a one-line lesson, and a question maker (gets the open stage).
const EN_GAMES = [
  { id: 'rhyme', ico: '🎵', name: 'Rhyme time', stage: 1, about: 'Rhyming words end with the same sound, like cat and hat.',
    gen() { const fams = shuffle(EN_RHYME), f = fams[0], [a, b] = shuffle(f), opts = shuffle([b, ...fams.slice(1, 3).map(g => pick(g))]);
      return { prompt: `Which word rhymes with <b>${a.w}</b>?`, say: `Which word rhymes with ${a.w}? ${opts.map(x => x.w).join(', or ')}?`, visual: enPic(a.e),
        choices: opts.map(x => ({ html: `<span class="en-ce">${x.e}</span><span>${x.w}</span>`, val: x.w, say: x.w, txt: true })), answer: b.w,
        explain: `${a.w} and ${b.w} both end with the same sound. ${a.w}, ${b.w}!` }; } },
  { id: 'opp', ico: '↔️', name: 'Opposites', stage: 1, about: 'Opposites are as different as can be, like big and small.',
    gen() { const [a, b, ea, eb] = pick(EN_OPP), flip = Math.random() < 0.5, w = flip ? b : a, ans = flip ? a : b;
      const wrong = shuffle(EN_OPP.filter(o => o[0] !== a)).slice(0, 2).map(o => pick([o[0], o[1]]));
      return { prompt: `What is the opposite of <b>${w}</b>?`, say: `What is the opposite of ${w}?`, visual: enPic(flip ? eb : ea), choices: enTxt([ans, ...wrong]), answer: ans,
        explain: `The opposite of ${w} is ${ans}. ${flip ? eb : ea} ${w}, ${flip ? ea : eb} ${ans}.` }; } },
  { id: 'syll', ico: '👏', name: 'Clap the parts', stage: 2, about: 'Words have beats called syllables. Clap once for each beat: ba-na-na has 3.',
    gen() { const [w, n, e] = pick(EN_SYLL);
      return { prompt: `Clap it! How many beats in <b>${w}</b>?`, say: `Clap it out. ${w}. How many beats?`, visual: enPic(e), choices: [1, 2, 3, 4].map(v => ({ html: '👏'.repeat(v) + `<small>${v}</small>`, val: v, say: String(v), txt: true })), answer: n,
        explain: `${EN_SYLL_CUT[w] || w}. That is ${n} clap${n > 1 ? 's' : ''}.` }; } },
  { id: 'pos', ico: '🏷️', name: 'Naming, doing, describing', stage: 2, about: 'A noun names a thing (dog). A verb is a doing word (run). An adjective describes (big).',
    gen() { const x = pick(EN_POS_W), L = { noun: 'Noun: a naming word', verb: 'Verb: a doing word', adj: 'Adjective: a describing word' };
      return { prompt: `What kind of word is <b>${x.w}</b>?`, say: `What kind of word is ${x.w}? A naming word, a doing word, or a describing word?`, visual: enPic(x.e),
        choices: Object.keys(L).map(k => ({ html: L[k], val: k, say: L[k].split(':')[1], txt: true })), answer: x.k,
        explain: x.k === 'noun' ? `${enCap(x.w)} is a noun. It names a thing or a person you can point to.` : x.k === 'verb' ? `${enCap(x.w)} is a verb. It is something you can do. Can you ${x.w}?` : `${enCap(x.w)} is an adjective. It tells you what something is like.` }; } },
  { id: 'plural', ico: '🔢', name: 'One and many', stage: 2, about: 'One cat, two cats. Most words add s; some add es; a few change all by themselves.',
    gen(stage) { const pool = EN_PLURAL.filter(p => stage >= 3 || ['s', 'es', 'same', 'odd'].includes(p[2])), [one, many, rule, e] = pick(pool);
      const wrong = [one + 's', one + 'es', one.replace(/y$/, 'ies'), one.replace(/fe?$/, 'ves'), one, many + 's'].filter(x => x !== many);
      const ch = [many, ...shuffle([...new Set(wrong)]).slice(0, 2)];
      return { prompt: `One ${one}, two ___`, say: `One ${one}. Two what?`, visual: `<div class="en-pl"><span>${e}</span><span>${e}${e}</span></div>`, choices: enTxt(ch), answer: many,
        explain: `One ${one}, two ${many}. ${EN_PLURAL_WHY[rule]}` }; } },
  { id: 'aan', ico: '🅰️', name: 'A or an?', stage: 2, about: 'Use an before a vowel sound (a, e, i, o, u): an apple. Use a before other sounds: a cat.',
    gen() { const k = Math.random() < 0.5 ? 'an' : 'a', [w, e] = pick(EN_AAN[k].split(',')).split(':');
      return { prompt: `___ ${w}`, say: `Is it a ${w}, or an ${w}?`, visual: enPic(e), choices: ['a', 'an'].map(v => ({ html: `${v} ${esc(w)}`, val: v, say: `${v} ${w}`, txt: true })), answer: k,
        explain: k === 'an' ? `${enCap(w)} starts with the vowel sound ${w[0]}, so we say an ${w}. It is easier to say!` : `${enCap(w)} starts with ${w[0]}, which is not a vowel, so we say a ${w}.` }; } },
  { id: 'prep', ico: '📦', name: 'Where is the cat?', stage: 2, about: 'Little words like in, on and under tell us where something is.',
    gen(stage) { const pool = EN_PREP.filter(p => p[1] <= Math.max(2, stage)).map(p => p[0]), p = pick(pool);
      return { prompt: 'Where is the cat?', say: 'Where is the cat?', visual: enPrepPic(p), choices: enTxt(enDistinct(p, pool, Math.min(3, pool.length))), answer: p,
        explain: `The cat is ${p} the box${p === 'between' ? 'es' : ''}.` }; } },
  { id: 'pron', ico: '👤', name: 'He, she, it, they', stage: 3, about: 'Pronouns stand in for a name so we do not say it again: Sam is kind. He is kind.',
    gen() { const [s, ans, e] = pick(EN_PRON), up = /^___/.test(s);
      const pool = EN_PRON_ALL.filter(x => /^[A-Z]/.test(x) === up);
      return { prompt: esc(s), say: s.replace('___', 'blank'), visual: enPic(e), choices: enTxt(enDistinct(ans, pool, 3)), answer: ans, explain: s.replace('___', ans) }; } },
  { id: 'past', ico: '⏮️', name: 'Yesterday I...', stage: 3, about: 'To talk about the past, many verbs add ed: jump, jumped. Some change: go, went.',
    gen() { const [now, past] = pick(EN_PAST), reg = past === now + 'ed' || past === now + 'd';
      const wrong = [now + 'ed', now + 's', now + 'ing', now].filter(x => x !== past);
      return { prompt: `Today I ${now}. Yesterday I ___.`, say: `Today I ${now}. Yesterday I what?`, visual: '', choices: enTxt([past, ...shuffle(wrong).slice(0, 2)]), answer: past,
        explain: reg ? `${enCap(now)} becomes ${past}. Add ed for the past.` : /ied$|([a-z])\1ed$/.test(past) ? `${enCap(now)} becomes ${past}. Watch the spelling!` : `${enCap(now)} is a special verb. Yesterday I ${past}.` }; } },
  { id: 'isare', ico: '⚖️', name: 'Is or are?', stage: 3, about: 'One thing is. Many things are. In the past: one was, many were.',
    gen() { const [s, a, b] = pick(EN_ISARE);
      return { prompt: esc(s), say: s.replace('___', 'blank'), visual: '', choices: enTxt([a, b]), answer: a, explain: s.replace('___', a) }; } },
  { id: 'qs', ico: '❓', name: 'Ask or tell?', stage: 3, about: 'A telling sentence ends with a full stop. A question ends with a question mark. A shout or surprise ends with !',
    gen(stage) { const pool = EN_QS.filter(x => stage >= 4 || x[1] !== '!'), [s, m] = pick(pool), marks = stage >= 4 ? ['.', '?', '!'] : ['.', '?'];
      const N = { '.': 'full stop', '?': 'question mark', '!': 'exclamation mark' };
      return { prompt: `${esc(s)} <span class="en-blank">_</span>`, say: `${s}. Which mark goes at the end?`, visual: '', choices: marks.map(v => ({ html: `<span class="en-mark">${v}</span><small>${N[v]}</small>`, val: v, say: N[v], txt: true })), answer: m,
        explain: m === '?' ? 'It asks something, so it ends with a question mark.' : m === '!' ? 'It shows strong feeling, so it ends with an exclamation mark.' : 'It tells us something, so it ends with a full stop.' }; } },
  { id: 'caps', ico: '🔠', name: 'Capital letters', stage: 3, about: 'Capital letters go at the start of a sentence, for names, for I, and for days and months.',
    gen() { const s = pick(EN_CAPS), lowFirst = s.charAt(0).toLowerCase() + s.slice(1);
      const lowNames = s.replace(/(?!^)\b([A-Z])([a-z]+)/g, (m, a, b) => a.toLowerCase() + b).replace(/\bI\b/g, 'i');
      const extra = s.replace(/\b(dog|cat|park|party|visit|play|went|lives|has)\b/, m => enCap(m));
      const ch = [...new Set([s, lowFirst, lowNames !== s ? lowNames : extra, extra])].slice(0, 3);
      return { prompt: 'Which one is written the right way?', say: 'Which sentence has the capital letters in the right places?', visual: '', choices: enTxt(ch), answer: s,
        explain: `${s} The sentence starts with a capital, and names and I have capitals too.` }; } },
  { id: 'contr', ico: '✂️', name: 'Short words', stage: 4, about: "Two words can squeeze together. The apostrophe ' shows where letters left: do not becomes don't.",
    gen() { const [long, short] = pick(EN_CONTR), i = short.indexOf("'"), bad1 = short.replace("'", ''), bad2 = short.slice(0, Math.max(1, i - 1)) + "'" + short.slice(Math.max(1, i - 1)).replace("'", '');
      return { prompt: `<b>${esc(long)}</b> = ?`, say: `How do we write ${long} short?`, visual: '', choices: enTxt([short, bad1, bad2 !== short ? bad2 : short + 's']), answer: short,
        explain: `${long} becomes ${short}. The apostrophe takes the place of the missing letters.` }; } },
  { id: 'comp', ico: '📏', name: 'Big, bigger, biggest', stage: 4, about: 'Comparing two things often adds er (bigger). The most of all often adds est (biggest).',
    gen() { const row = pick(EN_COMP), k = 1 + Math.floor(Math.random() * 2), ans = row[k];
      const wrong = [row[0] + 'er', row[0] + 'est', 'more ' + row[0], row[3 - k]].filter(x => x !== ans);
      return { prompt: row.map((w, i) => i === k ? '___' : esc(w)).join(' → '), say: `${row.map((w, i) => i === k ? 'what' : w).join(', ')}?`, visual: `<div class="en-pl en-grow"><span>🐭</span><span>🐶</span><span>🐘</span></div>`,
        choices: enTxt([ans, ...shuffle([...new Set(wrong)]).slice(0, 2)]), answer: ans, explain: `${row[0]}, ${row[1]}, ${row[2]}.${['good', 'bad'].includes(row[0]) ? ' This one is special!' : ''}` }; } },
  { id: 'syn', ico: '🤝', name: 'Same meaning', stage: 4, about: 'Synonyms are words that mean the same, or nearly the same: big and large.',
    gen() { const [a, b] = pick(EN_SYN), flip = Math.random() < 0.5, w = flip ? b : a, ans = flip ? a : b;
      const wrong = shuffle(EN_SYN.filter(s => s[0] !== a)).slice(0, 2).map(s => s[1]);
      return { prompt: `Which word means the same as <b>${w}</b>?`, say: `Which word means the same as ${w}?`, visual: '', choices: enTxt([ans, ...wrong]), answer: ans, explain: `${enCap(w)} and ${ans} mean nearly the same thing.` }; } },
  { id: 'conj', ico: '🔗', name: 'Joining words', stage: 4, about: 'And, but, because, so and or join ideas together.',
    gen() { const [s, ans] = pick(EN_CONJ), pool = ['and', 'but', 'because', 'so', 'or'];
      return { prompt: esc(s), say: s.replace('___', 'blank'), visual: '', choices: enTxt(enDistinct(ans, pool, 3)), answer: ans, explain: s.replace('___', ans) }; } },
  { id: 'adv', ico: '🐢', name: 'How did they do it?', stage: 5, about: 'Adverbs tell how something is done. Many end in ly: slowly, quickly.',
    gen() { const [s, ans] = pick(EN_ADV), bad = { slowly: 'quickly', quickly: 'slowly', quietly: 'loudly', loudly: 'quietly', softly: 'loudly', happily: 'sadly', carefully: 'loudly' }[ans];
      return { prompt: esc(s), say: s.replace('___', 'blank'), visual: '', choices: enTxt([ans, bad, pick(EN_ADV_ALL.filter(x => x !== ans && x !== bad))]), answer: ans, explain: s.replace('___', ans) }; } },
  { id: 'homo', ico: '👂', name: 'Sound-alike words', stage: 5, about: 'Some words sound the same but are spelled differently and mean different things: two, to, too.',
    gen() { const [s, ans, wrong] = pick(EN_HOMO);
      return { prompt: esc(s), say: 'Which spelling fits? ' + s.replace('___', 'blank'), visual: '', choices: enTxt([ans, ...wrong]), answer: ans, explain: s.replace('___', ans) }; } },
  { id: 'affix', ico: '🧩', name: 'Word parts', stage: 5, about: 'Adding a part to the start or end changes the meaning: un + happy = unhappy (not happy).',
    gen() { const [w, mean, part] = pick(EN_AFFIX), wrong = shuffle(EN_AFFIX.filter(a => a[2] !== part)).slice(0, 2).map(a => a[1]);
      return { prompt: `What does <b>${w}</b> mean?`, say: `What does ${w} mean?`, visual: '', choices: enTxt([mean, ...wrong]), answer: mean, explain: `${enCap(w)} means ${mean}. ${EN_AFFIX_WHY[part]}` }; } }
];
