/* ---------- English & Reading, part 11: Learn to Read, a step-by-step daily reading path ---------- */
// A systematic synthetic phonics course in 9 units and 66 short lessons (s a t p i n, m d g o c k, ck e u r h b f ff l ll
// ss, j v w x y z zz qu, ch sh th ng nk, ai ee igh oa oo, ar or ur ow oi ear air ure er, the split digraphs a_e to e_e,
// then other ways to spell known sounds), with tricky words and small grammar points woven in. Every lesson is the same
// routine: Review (flash earlier sounds) → New sound (mouth tip, action, picture, chant) → Blend words → Read 2–3
// sentences → Write it (the Write letters tracing pad, through a small hook in english8.js) → a tiny game → a sticker.
// Blend words are generated from a word bank: only words that can be sounded out with the sounds taught so far (plus the
// tricky words taught so far) are used, and decodable() checks that in code for every word, sentence and grammar choice.
// EN_PATH is the data and the checker; the screens below join the English home through englishHome.api.
// Progress is kept per player in st.english.path ({ done, checks, weak, placed, days }); stars go through give().
const EN_PATH = (() => {
  // [key, sound to say, picture word, emoji, mouth tip, action, chant]
  const GD = [
    ['s', 'sss', 'sun', '☀️', 'Teeth together, a big smile, and let the air hiss out.', 'Make your arm a wiggly snake: sss!', 'Sss, sss, sss, the snake says sss!'],
    ['a', 'ah', 'ant', '🐜', 'Open your mouth wide, like at the doctor.', 'Ants run up your arm! Wiggle your fingers: a, a, a.', 'A, a, a, ants on my arm!'],
    ['t', 'tuh', 'tent', '⛺', 'Tap the tip of your tongue behind your top teeth.', 'Watch a tennis ball: turn your head side to side: t, t, t.', 'T, t, t, tap, tap, tap!'],
    ['p', 'puh', 'pig', '🐷', 'Press your lips together, then pop them open.', 'Hold up a finger candle and puff it out: p, p, p!', 'P, p, p, pop the pan!'],
    ['i', 'ih', 'insect', '🐞', 'A little smile, mouth just open.', 'Wiggle your fingers like mouse whiskers: i, i, i.', 'I, i, i, an insect on a pin!'],
    ['n', 'nnn', 'net', '🥅', 'Tongue up behind your top teeth, hum through your nose.', 'Arms out like a plane: nnnnn!', 'Nnn, nnn, a noisy plane!'],
    ['m', 'mmm', 'map', '🗺️', 'Lips together and hum.', 'Rub your tummy: mmm, yummy!', 'Mmm, mmm, my munchy muffin!'],
    ['d', 'duh', 'dog', '🐶', 'Tongue taps the top of your mouth, voice on.', 'Bang a drum: d, d, d!', 'D, d, d, a dog on a drum!'],
    ['g', 'guh', 'goat', '🐐', 'The back of your tongue goes up, then a little gulp.', 'Spin your hand like water down the drain: g, g, g.', 'G, g, g, the goat says gulp!'],
    ['o', 'aw', 'octopus', '🐙', 'Make your mouth round.', 'Flick a light on and off: o, o, o!', 'O, o, o, on and off!'],
    ['c', 'kuh', 'cat', '🐱', 'The back of your tongue clicks up.', 'Click your fingers: c, c, c!', 'C, c, c, the cat can click!'],
    ['k', 'kuh', 'kite', '🪁', 'The same sound as c! The back of your tongue clicks up.', 'Kick a ball: k, k, k!', 'K, k, k, kick the kite up high!'],
    ['ck', 'kuh', 'duck', '🦆', 'c and k together make one sound: k.', 'Click, then kick: two letters, one sound!', 'Quack, quack, ck, the duck says ck!'],
    ['e', 'eh', 'egg', '🥚', 'A small smile, mouth a little open.', 'Crack an egg on a bowl: e, e, e!', 'E, e, e, eggs in a nest!'],
    ['u', 'uh', 'umbrella', '☂️', 'Relax your mouth and say a short sound.', 'Put up an umbrella: u, u, u!', 'U, u, u, up goes the umbrella!'],
    ['r', 'rrr', 'rabbit', '🐰', 'Lips a little round, tongue pulled back.', 'Shake your head like a puppy with a rag: rrr!', 'Rrr, rrr, the red rabbit runs!'],
    ['h', 'huh', 'hat', '🎩', 'Open your mouth and puff out warm air.', 'Pant like you ran fast: h, h, h!', 'H, h, h, hot and puffing!'],
    ['b', 'buh', 'ball', '⚽', 'Lips together, then bounce them open with your voice.', 'Bounce a ball: b, b, b!', 'B, b, b, bounce the big ball!'],
    ['f', 'fff', 'fish', '🐟', 'Top teeth on your bottom lip, then blow.', 'Let the air out of a fish float: fff!', 'Fff, fff, a flat fish!'],
    ['ff', 'fff', 'puff', '💨', 'The same as f: top teeth on your lip, blow.', 'Puff out your cheeks and blow: fff!', 'Huff and puff, ff, ff, ff!'],
    ['l', 'lll', 'leg', '🦵', 'Tongue tip up behind your teeth.', 'Lick a lolly: lll!', 'Lll, lll, a lovely lolly!'],
    ['ll', 'lll', 'bell', '🔔', 'The same as l: tongue tip up.', 'Ring a bell: ll, ll!', 'Ding, ding, the bell says ll!'],
    ['ss', 'sss', 'dress', '👗', 'The same as s: smile and hiss.', 'Hiss like two snakes: ss!', 'Ss, ss, a kiss and a hiss!'],
    ['j', 'juh', 'jam', '🍯', 'Lips forward, tongue pushes off.', 'Wobble like jelly: j, j, j!', 'J, j, j, jelly and jam!'],
    ['v', 'vvv', 'van', '🚐', 'Top teeth on your lip, voice on.', 'Drive a van: vvv!', 'Vvv, vvv, the van goes vroom!'],
    ['w', 'wuh', 'web', '🕸️', 'Lips round, then open.', 'Blow on your hands like the wind: w, w!', 'W, w, w, the wind blows wet!'],
    ['x', 'ks', 'fox', '🦊', 'Say k and s fast together.', 'Take an x-ray: ks, ks!', 'Ks, ks, a fox in a box!'],
    ['y', 'yuh', 'yo-yo', '🪀', 'Smile, tongue up at the sides.', 'Lick a yogurt spoon: y, y, y!', 'Y, y, y, yes, yes, yum!'],
    ['z', 'zzz', 'zip', '🤐', 'Teeth together, buzz your voice.', 'Flap like a bee: zzz!', 'Zzz, zzz, zip and zap!'],
    ['zz', 'zzz', 'buzz', '🐝', 'The same as z: buzz your voice.', 'Buzz like a bee: zz!', 'Buzz, buzz, zz, zz!'],
    ['qu', 'kwuh', 'queen', '👸', 'k then w, very quick.', 'Make a duck beak with your hands: qu, qu!', 'Qu, qu, quack, quack, quick!'],
    ['ch', 'ch', 'chick', '🐥', 'Lips push forward, like a little sneeze.', 'Move your arms like a train: ch, ch, ch!', 'Ch, ch, choo choo, the chick rides the train!'],
    ['sh', 'shh', 'ship', '🚢', 'Lips forward, blow softly.', 'Finger on your lips: shhh!', 'Shhh, shhh, the ship is sleeping!'],
    ['th', 'th', 'thumb', '👍', 'Your tongue peeps out between your teeth.', 'Stick out your tongue a little: th, th!', 'Th, th, thumbs up for this and that!'],
    ['ng', 'ng', 'ring', '💍', 'Back of the tongue up, hum in your nose.', 'Lift a heavy weight: nnng!', 'Ng, ng, sing a song, ding dong!'],
    ['nk', 'nk', 'wink', '😉', 'Say ng, then a little k.', 'Wink an eye: nk!', 'Nk, nk, wink and think!'],
    ['ai', 'ay', 'rain', '🌧️', 'Say the name of the letter a.', 'Hand to your ear: ay? What did you say?', 'Ay, ay, a snail in the rain!'],
    ['ee', 'ee', 'bee', '🐝', 'A big wide smile.', 'Hands on your head like donkey ears: ee-or!', 'Ee, ee, a bee in a tree!'],
    ['igh', 'eye', 'night', '🌃', 'Say the name of the letter i.', 'Point up high to the sky: igh!', 'Igh, igh, a light in the night!'],
    ['oa', 'oh', 'boat', '⛵', 'Round lips, say the name of o.', 'Hand over your mouth: oh!', 'Oh, oh, a goat in a boat!'],
    ['oo', 'oo', 'moon', '🌙', 'Lips round and pushed out.', 'Be a ghost: oooo!', 'Oo, oo, a moon over the zoo!'],
    ['oo2', 'uu', 'book', '📖', 'A short oo, lips just a bit round.', 'Open a book: oo!', 'Oo, oo, look at my book!'],
    ['ar', 'ar', 'car', '🚗', 'Open wide like at the doctor.', 'Flap like a seal: ar, ar!', 'Ar, ar, a star on the car!'],
    ['or', 'or', 'fork', '🍴', 'Round lips.', 'Stir the corn: or!', 'Or, or, corn on my fork!'],
    ['ur', 'er', 'surf', '🏄', 'Lips relaxed, tongue back.', 'Turn around: ur!', 'Ur, ur, turn and surf!'],
    ['ow', 'ow', 'cow', '🐮', 'Open, then round your lips.', 'Pretend you bumped your hand: ow!', 'Ow, ow, how now, brown cow!'],
    ['oi', 'oy', 'coin', '🪙', 'Say o then ee, fast.', 'Wave and call out: oi!', 'Oy, oy, a coin in the soil!'],
    ['ear', 'ear', 'ear', '👂', 'Say ee, then a soft uh.', 'Hand behind your ear: ear!', 'Ear, ear, can you hear?'],
    ['air', 'air', 'chair', '🪑', 'Say e, then a soft uh.', 'Fan the air: air!', 'Air, air, a chair at the fair!'],
    ['ure', 'yoor', 'cure', '💊', 'Say you, then a soft uh.', 'Thumbs up, are you sure? ure!', 'Ure, ure, I am sure!'],
    ['er', 'er', 'hammer', '🔨', 'Relax your lips, a soft uh.', 'Shrug your shoulders: er... er...', 'Er, er, a hammer and a ladder!'],
    ['a_e', 'ay', 'cake', '🎂', 'a says its name: ay.', 'Draw a bridge from a to e: the e makes a say its name!', 'Ay, ay, bake a cake!'],
    ['i_e', 'eye', 'kite', '🪁', 'i says its name: eye.', 'Draw a bridge from i to e!', 'Eye, eye, ride a bike, fly a kite!'],
    ['o_e', 'oh', 'bone', '🦴', 'o says its name: oh.', 'Draw a bridge from o to e!', 'Oh, oh, a bone at home!'],
    ['u_e', 'you', 'cube', '🧊', 'u says its name: you.', 'Draw a bridge from u to e!', 'You, you, a cute cube!'],
    ['e_e', 'ee', 'these', '👉', 'e says its name: ee.', 'Draw a bridge from e to e!', 'Ee, ee, these are for Pete!'],
    ['ay', 'ay', 'hay', '🌾', 'The same sound as ai: say the name of a.', 'Wave hello: ay!', 'Ay, ay, play all day!'],
    ['ou', 'ow', 'cloud', '☁️', 'The same sound as ow: open, then round.', 'Shout out loud: ow!', 'Ow, ow, a cloud, shout out loud!'],
    ['ie', 'eye', 'pie', '🥧', 'The same sound as igh: say the name of i.', 'Tie a tie: ie!', 'Eye, eye, a pie and a tie!'],
    ['ea', 'ee', 'sea', '🌊', 'The same sound as ee: a big smile.', 'Sip your tea: ee!', 'Ee, ee, tea by the sea!'],
    ['oy', 'oy', 'boy', '👦', 'The same sound as oi.', 'Hug a toy: oy!', 'Oy, oy, a toy for a boy!'],
    ['ir', 'er', 'bird', '🐦', 'The same sound as ur.', 'Twirl around: ir!', 'Ir, ir, the girl and the bird!'],
    ['ue', 'oo', 'glue', '🧴', 'The same sound as oo in moon.', 'Squeeze the glue: oo!', 'Oo, oo, blue glue!'],
    ['aw', 'or', 'paw', '🐾', 'The same sound as or.', 'Show your paws: aw!', 'Aw, aw, a paw on the straw!'],
    ['wh', 'wuh', 'whale', '🐳', 'The same sound as w.', 'Swim like a whale: wh!', 'Wh, wh, when will the whale come?'],
    ['ph', 'fff', 'phone', '📱', 'The same sound as f.', 'Hold a phone to your ear: ph!', 'Ph, ph, a dolphin on the phone!'],
    ['ew', 'oo', 'stew', '🍲', 'The same sound as oo in moon.', 'Chew, chew: ew!', 'Oo, oo, chew the stew!'],
    ['oe', 'oh', 'toe', '🦶', 'The same sound as oa.', 'Wiggle your toes: oh!', 'Oh, oh, tiptoe on my toe!']
  ];
  const DIG = ['ch', 'sh', 'th', 'ng', 'nk', 'qu', 'wh', 'ph', 'ck'];
  const G = {};
  GD.forEach(([k, snd, w, e, mouth, act, chant]) => {
    const sp = k === 'oo2' ? 'oo' : k;
    G[k] = { k, sp, show: sp.replace('_', '‿'), snd, w, e, mouth, act, chant,
      kind: /_e$/.test(k) ? 'split' : sp.length === 1 ? 'letter' : ['ff', 'll', 'ss', 'zz'].includes(sp) ? 'double' : DIG.includes(sp) ? 'digraph' : sp.length === 3 ? 'trigraph' : 'team' };
  });
  // Grammar bites woven into lessons: [text, question, right answer, wrong answer].
  const GP = {
    cap: ['A sentence starts with a capital letter.', 'Which sentence starts with a capital letter?', 'Pat the tap.', 'pat the tap.'],
    stop: ['A telling sentence ends with a full stop ( . ).', 'Which sentence ends with a full stop?', 'Tap the pan.', 'Tap the pan'],
    ask: ['An asking sentence ends with a question mark ( ? ).', 'Which one is asking something?', 'Did Dad tap it?', 'Dad is sad.'],
    names: ['Names start with a capital letter: Tom, Sam, Pip.', 'Which name is written the right way?', 'Tom', 'tom'],
    plural: ['Add s when there is more than one: one cup, two cups.', 'One cup, two ...', 'cups', 'cup'],
    and: ['"and" joins two ideas: a bug and a bed.', 'Which word joins? A cat ___ a dog.', 'and', 'the'],
    bang: ['An exclamation mark ( ! ) shows a big feeling.', 'Which one shouts?', 'Clap and clap!', 'I clap.'],
    noun: ['A noun is a naming word: jam, jet, Jen.', 'Which word is a naming word (a noun)?', 'jet', 'jump'],
    verb: ['A verb is a doing word: swim, jump, run.', 'Which word is a doing word (a verb)?', 'swim', 'web'],
    adj: ['An adjective tells what something is like: big, red, hot.', 'Which word tells what it is like?', 'red', 'zip'],
    ing: ['Add ing for something happening now: jump, jumping.', 'The dog is ...', 'jumping', 'jump'],
    ed: ['Add ed for something that already happened: jump, jumped.', 'Yesterday I ...', 'jumped', 'jump'],
    desc: ['Describing words make a sentence more fun: a green tree.', 'Pick a describing word: a ___ tree.', 'green', 'see'],
    q: ['Question words ask something: how, when, who, what.', 'Which word asks a question?', 'How', 'cow'],
    er: ['er can mean more: fast, faster.', 'A car is ___ than a bus.', 'faster', 'fast'],
    es: ['Some words add es for more than one: one box, two boxes.', 'One box, two ...', 'boxes', 'boxs'],
    isare: ['Use is for one thing and are for more than one.', 'The cats ___ big.', 'are', 'is'],
    pron: ['he, she and they can stand in for a name: the girl → she.', 'The girl has a bird. ___ is happy.', 'She', 'He'],
    comp: ['Two words can join to make one word: tip + toe = tiptoe.', 'sun + set = ?', 'sunset', 'setsun']
  };
  // [unit id, icon, name, color, lessons: [new sounds, tricky words, sentences, grammar bite]]
  const UD = [
    ['U1', '🌱', 'First sounds', '#2FA36B', [
      ['s a t', 'I', ['I sat.', 'Sat, sat, sat!']],
      ['p', 'the', ['I tap.', 'Pat the tap.', 'I sat at the tap.'], 'cap'],
      ['i', '', ['It is a tap.', 'Pip sits.', 'I sip it.']],
      ['n', 'to', ['A pin is in the tin.', 'Tap the pan.', 'Tip the tin to Nan.'], 'stop']]],
    ['U2', '🐶', 'Busy sounds', '#2E8BE6', [
      ['m', '', ['Sam taps the map.', 'Tim is a man.', 'I am Sam.']],
      ['d', 'no', ['Dad is sad.', 'Did Dan dip it?', 'No, Dad, no!'], 'ask'],
      ['g', 'go', ['A pig digs in the sand.', 'Go, pig, go!', 'Dad digs a pit.']],
      ['o', 'into', ['The dog is on the mat.', 'Tom got into the pond.', 'A pot is on top.'], 'names'],
      ['c', '', ['The cat is on the cot.', 'Can the cat nap?', 'A cap is on Dad.']],
      ['k', '', ['Kim can skip.', 'The kid digs in the sand.', 'Kim and the kid skip.']]]],
    ['U3', '🔔', 'More sounds', '#C44E40', [
      ['ck', '', ['Kim kicks a sock.', 'Pick a stick.', 'A sock is in the sack.']],
      ['e', 'he we me be', ['Meg gets a pet.', 'He sat in the tent.', 'We can get ten pegs.']],
      ['u', '', ['The sun is up.', 'Mum got a mug.', 'The pup is stuck in the mud.'], 'plural'],
      ['r', 'was', ['A red rat runs.', 'Can a rat run up a rock?', 'The rat was in the sack.']],
      ['h', '', ['The hen has a hat.', 'Tom hid in the hut.', 'I hug Mum.']],
      ['b', 'you', ['A bug is on the bed.', 'Get on the bus!', 'Can you get the bat?'], 'and'],
      ['f', 'they', ['A frog sits in the fog.', 'I got a gift.', 'They had fun.']],
      ['ff', '', ['Huff and puff!', 'The dog sniffs a sock.', 'Get off the bed!']],
      ['l', 'are', ['A slug is on the log.', 'Clap and clap!', 'The lemons are in the bag.'], 'bang'],
      ['ll', 'all', ['The bell is on the hill.', 'The doll fell off the bed.', 'We all fell in the mud!']],
      ['ss', 'what', ['What a mess!', 'Miss Bell has a red dress.', 'The cat hisses at the dog.']]]],
    ['U4', '⚡', 'Zippy sounds', '#6D55D1', [
      ['j', 'my', ['Jen has a jet.', 'Jill can jump.', 'My jam is in the jug.'], 'noun'],
      ['v', 'her', ['The vet has a van.', 'Viv has a red vest.', 'Her van is big.']],
      ['w', 'she', ['The dog wags.', 'We swim in the pond.', 'She will win.'], 'verb'],
      ['x', '', ['The fox is in a box.', 'Can Max fix the box?', 'Six fox cubs nap in the den.']],
      ['y', 'do', ['Yes! Yum!', 'The pup yaps and yelps.', 'Do not yell!']],
      ['z', 'said', ['Zip up the bag.', 'Zak zigs and zags.', '"Zap!" said Zak.'], 'adj'],
      ['zz', '', ['Buzz, buzz, buzz!', 'The pop fizzes.', 'Jazz is fun.']],
      ['qu', 'have', ['Quack! The duck is quick.', 'I have a quilt.', 'It is a quiz!']]]],
    ['U5', '🤝', 'Two letters, one sound', '#B05F1E', [
      ['ch', 'like for', ['The chick has a chip.', 'I like chips for lunch.', 'Chop it, chop it!']],
      ['sh', 'so', ['A fish is in the dish.', 'Shut the shed!', 'The ship is so big.']],
      ['th', '', ['This moth is thin.', 'I had a bath with a duck.', 'Then the duck sat on the path.']],
      ['ng', 'some come', ['The king can sing.', 'This is a long song.', 'Come and sing a song!'], 'ing'],
      ['nk', '', ['I think the skunk stinks!', 'Drink the milk.', 'Thank you!'], 'ed']]],
    ['U6', '🌈', 'Long vowel teams', '#1D7C82', [
      ['ai', 'there', ['The snail is in the rain.', 'Paint the train red.', 'Wait! There is a snail!']],
      ['ee', 'were', ['I see a green tree.', 'The sheep sleep.', 'A bee is on my feet.'], 'desc'],
      ['igh', 'little', ['The light is bright at night.', 'Sit up high!', 'A little moth flits at night.']],
      ['oa', 'one', ['The goat is in the boat.', 'Get the soap and the toast.', 'One goat has a coat.']],
      ['oo', 'put', ['The moon is up at night.', 'I see a goat at the zoo.', 'Put the spoon in the food.']],
      ['oo2', 'your', ['Look at the book!', 'The cook took the food.', 'Is your foot cool?']]]],
    ['U7', '🚗', 'Bossy r and more', '#A23E78', [
      ['ar', 'of', ['The shark is in the dark.', 'Park the car.', 'A jar of jam is in the cart.']],
      ['or', '', ['A fork is for food.', 'The storm is short.', 'The horn is on the car.']],
      ['ur', '', ['The cat has soft fur.', 'Turn left at the church.', 'Did you hurt your arm?']],
      ['ow', 'when', ['The cow is brown.', 'How now, brown cow!', 'The owl sat down.'], 'q'],
      ['oi', '', ['Point at the coin.', 'The soil is wet.', 'Boil the eggs in a pot.']],
      ['ear', '', ['I can hear with my ear.', 'Dad has a beard.', 'Is the shark near?']],
      ['air', '', ['Sit on the chair.', 'The fair is fun.', 'Brush my hair.']],
      ['ure', '', ['Are you sure?', 'The air is pure.', 'The vet can cure the dog.']],
      ['er', '', ['My sister has a hammer.', 'We had fish for dinner.', 'Her letter is in the box.'], 'er']]],
    ['U8', '✨', 'Magic e', '#B45309', [
      ['a_e', '', ['The snake is at the lake.', 'We made a cake.', 'What is your name?'], 'es'],
      ['i_e', '', ['I ride my bike.', 'Smile! It is time for the kite.', 'Nine kites in a line.']],
      ['o_e', '', ['The dog has a bone.', 'Go home!', 'I smell the rose with my nose.']],
      ['u_e', '', ['The cube is cute.', 'June has a huge cube.', 'Tim has a flute.']],
      ['e_e', '', ['These are for Pete.', 'Steve can complete the game.', 'Pete and Steve swim.']]]],
    ['U9', '🗝️', 'More ways to spell', '#22305A', [
      ['ay', 'people', ['We play all day.', 'Put the hay on the tray.', 'Can I stay and play?'], 'isare'],
      ['ou', '', ['The cloud is round.', 'Shout out loud!', 'We found a coin.']],
      ['ie', 'Mr Mrs', ['I tried the pie.', 'Mr Smith has a red tie.', 'Mrs Bell fried an egg.']],
      ['ea', 'oh', ['We eat at the beach.', 'Oh! A leaf is in my tea.', 'Read a book at the sea.']],
      ['oy', '', ['The boy has a toy.', 'Enjoy the toy!', 'Roy got an oyster.']],
      ['ir', 'their', ['The girl has a bird.', 'It is her first shirt.', 'The birds sat in their nest.'], 'pron'],
      ['ue', '', ['The glue is blue.', 'Is it true?', 'Sue has a clue.']],
      ['aw', 'could would', ['The cat has a big paw.', 'Draw a prawn.', 'Could you crawl on the lawn?']],
      ['wh', '', ['The whale is white.', 'When can we see the whale?', 'Which wheel is bent?']],
      ['ph', '', ['The dolphin has a phone!', 'The elephant is big.', 'Sing the alphabet.']],
      ['ew', '', ['The bird flew to the tree.', 'I chew the stew.', 'I have a few new books.']],
      ['oe', '', ['Joe hurt his toe.', 'Tiptoe, Joe!', 'The dog goes to the park.'], 'comp']]]
  ];
  // Words that look decodable but are not read the way they are spelled: they are only allowed once taught as tricky.
  const IRREG = new Set(('i the to no go so he we me be she into was you your they are all what my by do said have like some come there were where here ' +
    'little one once put push pull full of for oh mr mrs could would should people their who why any many again eye love give live gone done none more care ' +
    'bear pear wear house mouse horse kind find mind child old cold gold told hold both most water want wash').split(' '));
  // The word bank. word:emoji:sound hint (only for a spelling with two sounds, like oo in book).
  const BANK = ('sat at as tap:🚰 pat sap taps pats it is sit:🪑 pit tip sip pip tips sits in an ant:🐜 pin:📌 tin:🥫 nap:😴 pan:🍳 nip pant snap spin:🌀 tan nit ' +
    'map:🗺️ mat man:👨 am Sam Tim mint:🌿 Pam dad did dip sad:😢 mad:😠 pad and dim Dan sand:🏖️ pig:🐷 big dig:⛏️ gas tag nag gap dog:🐶 pot:🍲 top:🔝 ' +
    'mop:🧹 dot:⚫ on got not pod nod pond Tom cat:🐱 cap:🧢 can cot cod camp:🏕️ kid:🧒 kit:🧰 Kim skip skin skid ' +
    'sock:🧦 kick pick tick:✔️ sack tack dock Mick stick egg:🥚 pen:🖊️ net:🥅 ten:🔟 peg men pet get set Meg Ted neck deck peck step nest:🪺 tent:⛺ desk ' +
    'up:⬆️ sun:☀️ cup:☕ mug nut:🥜 pup tug cut dug gum mum mud duck:🦆 stuck rat:🐀 red:🔴 run:🏃 rug rip rock:🪨 ram:🐏 drum:🥁 grin:😁 trip track rest ' +
    'hat:🎩 hen:🐔 hot:🔥 hut:🛖 hug:🤗 him his has hop hum hid bat:🦇 bed:🛏️ bus:🚌 bag:👜 bun bug:🐛 crab:🦀 brick:🧱 bucket:🪣 ' +
    'frog:🐸 fan fig fun fog:🌫️ fist:✊ gift:🎁 off puff:💨 cuff huff sniff stuff leg:🦵 lip:👄 lid log:🪵 lamp flag:🚩 clap:👏 sled:🛷 milk:🥛 belt lemon:🍋 plum ' +
    'bell:🔔 doll:🪆 hill:⛰️ well fell tell sell spill kiss:💋 dress:👗 hiss mess less miss boss moss cross:❌ glass ' +
    'jam:🍯 jet:✈️ jog jug jump Jen Jill van:🚐 vet vest:🦺 Viv velvet web:🕸️ wet:💦 wig win wag wind:🌬️ swim:🏊 twig fox:🦊 box:📦 six:6️⃣ mix fix ox:🐂 wax next Max ' +
    'yes:✅ yet yum:😋 yell yak yap yelp zip:🤐 zap zigzag Zak buzz fizz:🫧 jazz:🎷 fuzz quack quiz:❓ quick quit quilt squid:🦑 ' +
    'chip:🍟 chick:🐥 chin chop chest much rich lunch:🥪 bench check chat ship:🚢 shop:🛒 fish:🐟 shell:🐚 dish wish rush shed shut cash:💵 brush:🪥 splash ' +
    'thin thick this that them then with moth bath:🛁 path cloth ring:💍 king:🤴 sing:🎤 song:🎶 wing swing long bang:💥 hang strong thing ' +
    'wink:😉 sink ink bank:🏦 drink:🥤 think:🤔 thank skunk:🦨 honk chunk stink trunk ' +
    'rain:🌧️ snail:🐌 tail nail:💅 mail:📬 sail train:🚆 paint:🎨 wait chain:⛓️ bee:🐝 tree:🌳 see feet:👣 sheep:🐑 green:🟢 week sleep seed:🌱 beep teeth:🦷 cheek ' +
    'night:🌃 light:💡 high right fight bright tight sigh boat:⛵ goat:🐐 coat:🧥 road:🛣️ toast:🍞 soap:🧼 oak float load ' +
    'moon:🌙 zoo food spoon:🥄 boot:👢 roof pool tooth broom:🧹 cool book:📖:oo2 look:👀:oo2 cook:🧑‍🍳:oo2 foot::oo2 wood::oo2 good:👍:oo2 hook:🪝:oo2 took::oo2 wool:🧶:oo2 ' +
    'car:🚗 star:⭐ jar:🫙 farm:🚜 park shark:🦈 arm:💪 art card dark sharp garden fork:🍴 corn:🌽 horn:📯 storm:⛈️ sport short north torch:🔦 born cord ' +
    'fur burn turn hurt:🤕 surf:🏄 curl church:⛪ burst turnip cow:🐮 owl:🦉 town down:⬇️ now how brown:🟤 crown:👑 clown:🤡 frown:☹️ howl growl ' +
    'coin:🪙 oil boil soil join point:👉 foil toilet:🚽 ear:👂 hear near dear year beard:🧔 fear gear:⚙️ clear spear hair:💇 chair:🪑 fair:🎡 pair stair air ' +
    'cure:💊 pure sure lure manure ladder:🪜 hammer:🔨 letter:✉️ dinner:🍽️ summer sister winter:❄️ river:🏞️ butter:🧈 farmer:🧑‍🌾 after under ' +
    'cake:🎂 game:🎮 gate snake:🐍 lake plane:🛩️ cape:🦸 wave:👋 grape:🍇 name made same kite:🪁 bike:🚲 five:5️⃣ line time slide:🛝 smile:😊 nine:9️⃣ ride ' +
    'rose:🌹 bone:🦴 home:🏠 nose:👃 hole:🕳️ stone rope:🪢 note:📝 globe:🌍 cube:🧊 tube mule cute huge June flute:🪈 rule prune these:👉 Pete Steve theme complete ' +
    'hay:🌾 day play tray say way stay spray crayon:🖍️ Sunday cloud:☁️ mouth:👄 out shout:📣 loud round found south pie:🥧 tie:👔 lie cried:😭 tried fried spied ' +
    'sea:🌊 leaf:🍃 tea:🍵 eat meat:🍖 beach:🏖️ read dream team peach:🍑 bean boy:👦 toy:🧸 joy enjoy oyster:🦪 annoy bird:🐦 girl:👧 shirt:👕 first:🥇 third skirt dirt twirl birthday ' +
    'blue:🔵 glue:🧴 clue true due Sue saw:🪚 paw:🐾 claw draw straw yawn:🥱 crawl lawn prawn:🦐 whale:🐳 wheel:🛞 when which whip whisk white ' +
    'phone:📱 dolphin:🐬 graph:📈 elephant:🐘 alphabet new chew stew:🍲 screw:🔩 flew grew blew drew few toe:🦶 foe hoe Joe goes tiptoe')
    .split(/\s+/).map(x => { const [w, e, h] = x.split(':'); return { w, e: e || '', h: h || '', name: /^[A-Z]/.test(w) }; });

  // ---- the decoding engine ----
  const DOUBLES = ['bb', 'dd', 'gg', 'mm', 'nn', 'pp', 'rr', 'tt'];
  const INV = [...new Set([...Object.values(G).filter(g => g.kind !== 'split').map(g => g.sp), ...DOUBLES])].sort((a, b) => b.length - a.length);
  const VOW = 'aeiou';
  // The split digraph a_e: a vowel, one consonant, then e at the end (or before a last s or d: kites, smiled).
  const isSplit = (w, i) => VOW.includes(w[i]) && i + 2 < w.length && !VOW.includes(w[i + 1]) && w[i + 1] !== 'x' && w[i + 2] === 'e' && (i + 3 === w.length || (i + 4 === w.length && 'sd'.includes(w[i + 3])));
  // One canonical way to cut a word into spellings: the longest known spelling first, so "ship" is sh-i-p even before sh is taught.
  function segment(word) {
    const w = String(word).toLowerCase(), out = [];
    if (!/^[a-z]+$/.test(w)) return null;
    let i = 0;
    while (i < w.length) {
      const m = INV.find(s => w.startsWith(s, i));
      if ((!m || m.length === 1) && isSplit(w, i)) { out.push(w[i] + '_e', w[i + 1]); i += 3; continue; }
      if (!m) return null;
      out.push(m); i += m.length;
    }
    return out;
  }
  // The lessons, flattened, each with what is taught up to and including it.
  const UNITS = [], LESSONS = [];
  const taughtSp = new Set(), tricky = new Set();
  UD.forEach(([id, ico, name, c, ls], ui) => {
    const U = { id, n: ui + 1, ico, name, c, lessons: [] };
    ls.forEach(([gs, tw, sents, gp]) => {
      const g = gs.split(' '), n = LESSONS.length + 1;
      g.forEach(k => { taughtSp.add(G[k].sp); if (G[k].kind === 'letter') DOUBLES.filter(d => d[0] === k).forEach(d => taughtSp.add(d)); });
      const tws = tw ? tw.split(' ') : [];
      tws.forEach(t => tricky.add(t.toLowerCase()));
      const L = { id: 'L' + n, n, i: n - 1, u: ui, g, tw: tws, sents, gp: gp ? { id: gp, t: GP[gp][0], q: GP[gp][1], a: GP[gp][2], b: GP[gp][3] } : null,
        sp: new Set(taughtSp), tricky: new Set(tricky) };
      LESSONS.push(L); U.lessons.push(L);
    });
    UNITS.push(U);
  });
  const PRIMARY = {}; Object.values(G).forEach(g => { if (!PRIMARY[g.sp]) PRIMARY[g.sp] = g.k; });
  const lessonAt = li => LESSONS[Math.max(0, Math.min(LESSONS.length - 1, li))];
  // Can a child read this word after lesson li? Either a taught tricky word, or every sound in it is taught.
  // soundOK: by its sounds alone (not a tricky word).
  function soundOK(word, li) {
    const L = lessonAt(li), lw = String(word).toLowerCase().replace(/[^a-z]/g, '');
    if (!lw) return true;
    if (IRREG.has(lw)) return false;
    const seg = segment(lw);
    return !!seg && seg.every(s => L.sp.has(s));
  }
  function decodable(word, li) {
    const lw = String(word).toLowerCase().replace(/[^a-z]/g, '');
    return lessonAt(li).tricky.has(lw) || soundOK(lw, li);
  }
  const wordsOf = s => String(s).split(/\s+/).map(t => t.replace(/[^A-Za-z]/g, '')).filter(Boolean);
  const sentOK = (s, li) => wordsOf(s).every(w => decodable(w, li));
  // Does this bank word use the sound with key k?
  const hasG = (x, k) => { const seg = segment(x.w); return !!seg && seg.includes(G[k].sp) && (x.h ? x.h === k : PRIMARY[G[k].sp] === k); };
  // Blend words for each lesson, picked from the bank: decodable now, using a new sound; fresh words and words with pictures first.
  const usedBefore = new Set();
  LESSONS.forEach(L => {
    const cand = BANK.filter(x => !x.name && decodable(x.w, L.i) && L.g.some(k => hasG(x, k)));
    const score = x => (usedBefore.has(x.w) ? 2 : 0) + (x.e ? 0 : 1);
    L.words = cand.map((x, j) => [x, j]).sort((a, b) => score(a[0]) - score(b[0]) || a[1] - b[1]).slice(0, 5).map(a => a[0]);
    L.words.forEach(x => usedBefore.add(x.w));
    const k0 = L.g[L.g.length - 1], g0 = G[k0];
    // The word to trace: one letter, several letters, or the picture word for a split digraph.
    L.write = L.g.length > 1 ? L.g.join('') : g0.kind === 'split' ? g0.w : g0.sp;
    L.wkind = L.write.length === 1 ? 'L' : 'W';
    L.sticker = g0.e;
    L.title = L.g.map(k => G[k].show).join(' ');
  });
  UNITS.forEach(U => { U.last = U.lessons[U.lessons.length - 1].i; U.g = U.lessons.flatMap(L => L.g); });
  // Emoji words a child can read after lesson li (for picture questions).
  const picWords = li => BANK.filter(x => x.e && !x.name && decodable(x.w, li));
  // A picture word that uses sound k, readable by lesson li (a word from the sound's own lesson first).
  function picFor(k, li) {
    const own = LESSONS.find(L => L.g.includes(k));
    const pool = picWords(li).filter(x => hasG(x, k));
    return pool.find(x => own && own.words.includes(x)) || pool[0] || null;
  }
  // Check every lesson: blend words, sentences and grammar choices are all decodable; every sound has a check-up question.
  function audit() {
    const bad = [];
    LESSONS.forEach(L => {
      if (L.words.length < 3) bad.push(`${L.id}: only ${L.words.length} blend words`);
      L.words.forEach(x => { if (!decodable(x.w, L.i)) bad.push(`${L.id}: blend word ${x.w} not decodable`); if (!L.g.some(k => hasG(x, k))) bad.push(`${L.id}: ${x.w} lacks the new sound`); });
      if (L.sents.length < 2 || L.sents.length > 3) bad.push(`${L.id}: ${L.sents.length} sentences`);
      L.sents.forEach(s => wordsOf(s).forEach(w => { if (!decodable(w, L.i)) bad.push(`${L.id}: "${w}" in "${s}" not decodable`); }));
      if (L.gp) [L.gp.a, L.gp.b].forEach(s => wordsOf(s).forEach(w => { if (!decodable(w, L.i)) bad.push(`${L.id}: grammar choice "${w}" not decodable`); }));
      L.g.forEach(k => { if (!picFor(k, UNITS[L.u].last)) bad.push(`${L.id}: no check-up picture word for ${k}`); });
    });
    return bad;
  }
  return { G, GP, UNITS, LESSONS, BANK, IRREG, segment, soundOK, decodable, sentOK, wordsOf, hasG, picWords, picFor, audit };
})();

(() => {
  const A = englishHome.api, { give, E, talk, ptip, hooks, SECTIONS, VIEWS, tapWords } = A;
  const { G, UNITS, LESSONS, decodable, soundOK, hasG, picWords, picFor, segment } = EN_PATH;
  const voice = () => !!(st.speak && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined');
  const o = v => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
  // st.english.path, repaired if an old or damaged save holds something else.
  const P = () => {
    const e = E(), p = e.path = o(e.path);
    p.done = o(p.done); p.checks = o(p.checks); p.weak = o(p.weak); p.days = Array.isArray(p.days) ? p.days.filter(d => typeof d === 'string') : [];
    return p;
  };
  // The path in order: lessons, with a check-up after each unit.
  const NODES = UNITS.flatMap(U => [...U.lessons.map(L => ({ t: 'L', L, U })), { t: 'C', U }]);
  const nodeDone = (p, N) => N.t === 'L' ? !!p.done[N.L.id] : !!p.checks[N.U.id];
  const curNode = (p = P()) => NODES.find(N => !nodeDone(p, N)) || null;
  const curIdx = (p = P()) => { const N = curNode(p); return N ? NODES.indexOf(N) : NODES.length; };
  const unitOpen = (p, U) => U.lessons.every(L => p.done[L.id]);
  const knownSounds = p => [...new Set(LESSONS.filter(L => o(p.done)[L.id]).flatMap(L => L.g))];
  const ALLG = [...new Set(LESSONS.flatMap(L => L.g))];
  const wtag = (x, cls = '') => `<span class="e11-pw${cls}">${x.e ? `<span class="e11-pe" aria-hidden="true">${x.e}</span>` : ''}<b>${esc(x.w)}</b></span>`;
  const step = ['review', 'sound', 'blend', 'read', 'write', 'game'];
  const STEPS = [['🔁', 'Review'], ['🔤', 'New sound'], ['🧩', 'Blend'], ['📖', 'Read'], ['✍️', 'Write'], ['🎲', 'Game'], ['🎉', 'Sticker']];
  const strip = k => { const n = step.indexOf(k); return `<div class="e11-steps" aria-label="Step ${n + 1} of 7">${STEPS.map(([ico, nm], i) => `<span class="${i < n ? 'done' : i === n ? 'now' : ''}" title="${nm}">${i < n ? '✓' : ico}<small>${nm}</small></span>`).join('')}</div>`; };
  const later = (nav, ms, fn) => setTimeout(() => { if (nav === navId) fn(); }, ms);
  // The sound of a spelling (a doubled letter like dd says the same as d).
  const sndOf = sp => G[sp] ? G[sp].snd : sp.length === 2 && sp[0] === sp[1] && G[sp[0]] ? G[sp[0]].snd : sp;
  // Tricky words keep the capital they are written with (I, Mr).
  const TWC = Object.fromEntries(LESSONS.flatMap(L => L.tw.map(t => [t.toLowerCase(), t])));

  /* ===================== the grown-up tip for a lesson ===================== */
  function tipFor(L) {
    const gs = L.g.map(k => G[k]), say1 = gs.map(x => `Point to <b>${esc(x.show)}</b> and say “${esc(x.snd)}”, as in ${esc(x.w)}.`).join(' ');
    const g = gs[gs.length - 1], late = L.u >= 8;
    const how = late ? `This is another way to write a sound your child already knows. Ask: “Which other letters make this sound?”`
      : { letter: `Keep the sound short and pure: “${g.snd}”, not “${g.snd}-uh”. Do the action together; moving helps the sound stick.`,
        double: 'After a short vowel at the end of a short word, f, l, s and z are usually doubled: puff, bell, kiss, buzz.',
        digraph: 'Two letters, one sound. Cover one letter with your finger to show they only work as a team.',
        trigraph: 'Three letters, one sound! Draw one line under all three letters.',
        team: 'Two letters work as a team for one long sound. Underline the team in books you read together.',
        split: 'Draw a little bridge from the vowel to the e. The e is quiet and makes the vowel say its name.' }[g.kind];
    return { say: say1, how, blend: `Touch each sound button as you say the sound, then sweep a finger under the word and say it fast. Today: ${L.words.map(x => x.w).join(', ')}.`,
      tricky: L.tw.length ? `Tricky words today: ${L.tw.join(', ')}. Read them together, point to the tricky part, and stick them on the fridge.` : '',
      gram: L.gp ? `Grammar bite: ${L.gp.t}` : '', home: `Sound hunt: find things at home with “${g.snd}” in them (${g.w} ${g.e}). One lesson a day is plenty; stop while it is still fun.` };
  }
  const tipHTML = L => { const t = tipFor(L);
    return `<details class="e11-tip"${P().tipOpen ? ' open' : ''}><summary>👪 Grown-up tip for lesson ${L.n}</summary><ul><li><b>What to say:</b> ${t.say}</li><li><b>How to help:</b> ${esc(t.how)}</li><li><b>Blending:</b> ${esc(t.blend)}</li>${t.tricky ? `<li><b>Tricky words:</b> ${esc(t.tricky)}</li>` : ''}${t.gram ? `<li><b>${esc(t.gram)}</b></li>` : ''}<li><b>Try at home:</b> ${esc(t.home)}</li></ul></details>`; };

  /* ===================== the path map ===================== */
  function pathHome() {
    save();
    const p = P(), cur = curNode(p), done = LESSONS.filter(L => p.done[L.id]).length, known = knownSounds(p).length;
    const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      return `<span class="${p.days.includes(k) ? 'on' : ''}${i === 6 ? ' now' : ''}"><small>${'SMTWTFS'[d.getDay()]}</small>${p.days.includes(k) ? '⭐' : '·'}</span>`; }).join('');
    view.innerHTML = `${crumbs('📖 Learn to Read')}
      <div class="e11-head"><div><b>Lesson ${Math.min(LESSONS.length, done + (cur && cur.t === 'L' ? 1 : 0)) || 1} of ${LESSONS.length}</b><span class="note">${known} of ${ALLG.length} sounds known · ${done} lessons done</span>
        <span class="meter"><i style="width:${Math.round(done / LESSONS.length * 100)}%"></i></span></div><div class="e11-week" aria-label="Lessons this week">${week}</div></div>
      ${cur ? `<button class="e11-today" id="pTodayBtn"><span class="e11-tico" aria-hidden="true">${cur.t === 'L' ? cur.L.sticker : '🏁'}</span><span><b>Today: ${cur.t === 'L' ? `Lesson ${cur.L.n} · ${esc(cur.L.title)}` : `Unit ${cur.U.n} check-up`}</b>${cur.t === 'L' ? 'About 5–8 minutes' : 'A gentle check of this unit’s sounds'}</span><span class="e11-go">▶</span></button>`
        : '<p class="e11-all">🏆 You finished the whole reading path! Tap any stone to play a lesson again.</p>'}
      ${!done ? '<button class="e11-place" id="pPlace"><span aria-hidden="true">🧭</span><span><b>Already know some sounds?</b>Take the placement check to skip ahead</span></button>' : ''}
      <div class="e11-map">${UNITS.map(U => { const ck = o(p.checks[U.id]);
        return `<section class="e11-unit" style="--uc:${U.c}"><h3><span aria-hidden="true">${U.ico}</span> Unit ${U.n}: ${esc(U.name)}<small>${U.g.map(k => esc(G[k].show)).join(' ')}</small></h3>
          <div class="e11-stones">${NODES.filter(N => N.U === U).map(N => { const i = NODES.indexOf(N), dn = nodeDone(p, N), now = N === cur, lock = !dn && !now;
            if (N.t === 'C') return `<button class="e11-stone ck${dn ? ' done' : ''}${now ? ' now' : ''}${lock ? ' locked' : ''}" data-node="${i}" aria-label="Unit ${U.n} check-up${dn ? ', done' : lock ? ', locked' : ''}"><span>${dn ? (ck.pass ? '🏅' : '🏁') : lock ? '🔒' : '🏁'}</span><small>Check-up${dn && ck.of ? ` ${ck.best}/${ck.of}` : ''}</small></button>`;
            const L = N.L;
            return `<button class="e11-stone${dn ? ' done' : ''}${now ? ' now' : ''}${lock ? ' locked' : ''}" data-node="${i}" aria-label="Lesson ${L.n}, ${esc(L.title)}${dn ? ', done' : lock ? ', locked' : ''}"><span>${dn ? L.sticker : lock ? '🔒' : L.n}</span><small>${L.n}. ${esc(L.title)}</small>${now ? '<i class="e11-owl" aria-hidden="true">🦉</i>' : ''}</button>`; }).join('')}</div></section>`; }).join('')}</div>
      ${ptip('path')}`;
    wireBack(englishHome);
    sayScreen(cur ? (cur.t === 'L' ? `Learn to read! Today is lesson ${cur.L.n}.` : `Learn to read! Time for the unit ${cur.U.n} check-up.`) : 'You finished the whole reading path!');
    const t = $('#pTodayBtn'); if (t) t.onclick = () => openNode(cur);
    const pl = $('#pPlace'); if (pl) pl.onclick = () => go(placeIntro);
    view.querySelectorAll('[data-node]').forEach(b => b.onclick = () => {
      const N = NODES[+b.dataset.node];
      if (!nodeDone(P(), N) && N !== curNode()) { say(`Finish ${cur.t === 'L' ? `lesson ${cur.L.n}` : `the unit ${cur.U.n} check-up`} first. One stepping stone at a time!`); b.classList.remove('wig'); void b.offsetWidth; b.classList.add('wig'); return; }
      openNode(N);
    });
    const now = view.querySelector('.e11-stone.now'); if (now) try { now.scrollIntoView({ block: 'center' }); window.scrollTo(0, Math.max(0, window.scrollY - 40)); } catch (x) {}
  }
  const openNode = N => N.t === 'L' ? go(lessonIntro, N.L.i) : go(checkIntro, N.U.n - 1);

  /* ===================== a lesson ===================== */
  let LS = null;
  function lessonIntro(i) {
    const L = LESSONS[i], U = UNITS[L.u], p = P(), again = !!p.done[L.id];
    view.innerHTML = `${crumbs(`📖 Lesson ${L.n} of ${LESSONS.length}`)}
      <div class="e11-card" style="--uc:${U.c}"><span class="e11-unitn">${U.ico} Unit ${U.n}: ${esc(U.name)}</span>
        <div class="e11-big">${L.g.map(k => `<b>${esc(G[k].show)}</b>`).join('')}</div>
        <div class="e11-kw">${L.g.map(k => `<span>${G[k].e} ${esc(G[k].w)}</span>`).join('')}</div>
        ${L.tw.length ? `<p class="e11-twl">♥ Tricky word${L.tw.length > 1 ? 's' : ''}: ${L.tw.map(t => `<b>${esc(t)}</b>`).join(' ')}</p>` : ''}</div>
      <div class="e11-plan">${STEPS.map(([ico, nm]) => `<span><i aria-hidden="true">${ico}</i>${nm}</span>`).join('')}</div>
      <div class="row"><button class="btn leaf" id="lsStart">▶ ${again ? 'Play it again' : 'Start lesson'}</button><button class="btn alt" id="lsPath">🗺️ My path</button></div>
      ${tipHTML(L)}`;
    wireBack(pathHome);
    sayScreen(`Lesson ${L.n}. Today's new sound${L.g.length > 1 ? 's are' : ' is'} ${L.g.map(k => G[k].snd).join(', ')}. About 5 to 8 minutes.`);
    $('#lsStart').onclick = () => { LS = build(i); go(lstep, 'review', 0); };
    $('#lsPath').onclick = () => go(pathHome);
    const d = view.querySelector('.e11-tip'); if (d) d.ontoggle = () => { P().tipOpen = d.open; save(); };
  }
  // Earlier sounds to flash: the ones a child missed first, then the last few, then a random few.
  function reviewList(L) {
    const p = P(), before = LESSONS.slice(0, L.i).flatMap(x => x.g), weak = before.filter(k => p.weak[k] > 0).sort((a, b) => p.weak[b] - p.weak[a]);
    const recent = before.slice(-3).reverse(), rest = shuffle(before.slice(0, -3));
    return [...new Set([...weak, ...recent, ...rest])].slice(0, 5);
  }
  function build(i) {
    const L = LESSONS[i];
    return { L, review: reviewList(L), fresh: !P().done[L.id], games: games(L), gi: 0 };
  }
  function lstep(k, i) {
    const L = LS.L, nav = navId, head = `${crumbs(`📖 Lesson ${L.n}: ${esc(L.title)}`)}${strip(k)}`;
    const next = (k2, i2) => go(lstep, k2, i2);
    if (k === 'review') {
      if (!LS.review.length) {
        view.innerHTML = `${head}<div class="e11-hello"><span aria-hidden="true">🦉👋</span><h2>${L.n === 1 ? 'Your very first reading lesson!' : 'Ready to read!'}</h2><p>Owl will show you a new sound, then you will read real words with it.</p></div>
          <div class="row"><button class="btn leaf" id="lsNext">Let's go! ▶</button></div>`;
        sayScreen('Your very first reading lesson! Owl will show you a new sound, then you will read real words with it.');
        $('#lsNext').onclick = () => next('sound', 0);
      } else {
        const g = G[LS.review[i]];
        view.innerHTML = `${head}<p class="e11-q">Say the sound! Tap the card to check.</p>
          <button class="e11-flash" id="rvCard" aria-label="Sound card ${esc(g.show)}. Tap to check"><b>${esc(g.show)}</b><span class="e11-back"><span aria-hidden="true">${g.e}</span>“${esc(g.snd)}” as in ${esc(g.w)}</span></button>
          <div class="progress">${LS.review.map((_, j) => `<i class="${j < i ? 'done' : j === i ? 'now' : ''}"></i>`).join('')}</div>
          <div class="row"><button class="btn leaf" id="rvYes">✓ I knew it</button><button class="btn alt" id="rvNo">🔁 Not yet</button></div>`;
        sayScreen('Say the sound! Tap the card to check.');
        $('#rvCard').onclick = () => { $('#rvCard').classList.add('flip'); talk([g.snd, `${g.snd}, ${g.w}`], 0.8); };
        const on = know => { const p = P(); if (know) { if (p.weak[g.k] > 0) p.weak[g.k]--; if (!p.weak[g.k]) delete p.weak[g.k]; } else p.weak[g.k] = (p.weak[g.k] || 0) + 1; save();
          i + 1 < LS.review.length ? next('review', i + 1) : next('sound', 0); };
        $('#rvYes').onclick = () => on(true); $('#rvNo').onclick = () => { say(`This one says ${g.snd}, as in ${g.w}. It will come back soon!`); on(false); };
      }
    } else if (k === 'sound') {
      const g = G[L.g[i]], e = E();
      e.heard = o(e.heard); const hk = g.kind === 'team' ? (EN_TEAMS.find(t => t[0] === g.sp && t[2] === g.w) ? `${g.sp}:${g.w}` : null) : g.sp.length === 1 || EN_DIGRAPHS.some(d => d[0] === g.sp) || EN_MAGIC.some(m => m[0] === g.k) ? g.k : null;
      if (hk) { e.heard[hk] = 1; save(); }
      view.innerHTML = `${head}<div class="e11-new"><div class="e11-gr" aria-hidden="true">${esc(g.show)}</div><div class="e11-pic" aria-hidden="true">${g.e}</div>
          <p class="e11-says"><b>${esc(g.show)}</b> says <b>“${esc(g.snd)}”</b> as in <b>${esc(g.w)}</b></p></div>
        <div class="e11-howto"><p><span aria-hidden="true">👄</span><span><b>Mouth:</b> ${esc(g.mouth)}</span></p><p><span aria-hidden="true">🙌</span><span><b>Action:</b> ${esc(g.act)}</span></p><p class="e11-chant"><span aria-hidden="true">🎵</span><span><b>Chant:</b> ${esc(g.chant)}</span></p></div>
        <div class="row"><button class="btn alt" id="snHear">🔊 Hear it</button><button class="btn alt" id="snChant">🎵 Chant</button><button class="btn leaf" id="lsNext">Next ▶</button></div>`;
      sayScreen(`New sound! ${g.show.replace('‿', ' ')} says ${g.snd}, as in ${g.w}. ${g.mouth}`);
      $('#snHear').onclick = () => talk([g.snd, g.snd, g.w], 0.75);
      $('#snChant').onclick = () => { const c = view.querySelector('.e11-chant'); c.classList.remove('sing'); void c.offsetWidth; c.classList.add('sing'); talk([g.chant], 0.9); };
      $('#lsNext').onclick = () => i + 1 < L.g.length ? next('sound', i + 1) : next('blend', 0);
    } else if (k === 'blend') {
      const x = L.words[i], seg = segment(x.w), lit = new Set();
      // Letters grouped by sound; a split digraph's e belongs to its vowel.
      const owner = []; let pos = 0; seg.forEach((s, j) => { if (/_e$/.test(s)) { owner[pos] = j; owner[pos + 2] = j; pos += 1; } else { for (let c = 0; c < s.length; c++) { while (owner[pos] != null) pos++; owner[pos++] = j; } } });
      const letters = x.w.split('').map((c, j) => `<span class="e11-l${/_e$/.test(seg[owner[j]] || '') ? ' sd' : ''}" data-own="${owner[j]}">${c}</span>`).join('');
      view.innerHTML = `${head}<p class="e11-q">Touch each sound, then blend them into a word!</p>
        <div class="e11-word" id="blWord">${letters}</div>
        <div class="e11-sbtns">${seg.map((s, j) => `<button class="e11-sb${s.length > 1 ? ' dash' : ''}" data-sb="${j}" aria-label="Sound ${esc(s.replace('_', ' '))}">${esc(s.replace('_', '‿'))}</button>`).join('')}</div>
        <div class="e11-reveal" id="blShow" aria-live="polite"></div>
        <div class="progress">${L.words.map((_, j) => `<i class="${j < i ? 'done' : j === i ? 'now' : ''}"></i>`).join('')}</div>
        <div class="row"><button class="btn leaf" id="blGo">🧩 Blend it!</button></div>`;
      sayScreen('Touch each sound, then blend them into a word!');
      const light = j => view.querySelectorAll(`[data-own="${j}"]`).forEach(s => s.classList.add('lit'));
      view.querySelectorAll('[data-sb]').forEach(b => b.onclick = () => { const j = +b.dataset.sb; lit.add(j); b.classList.add('on'); light(j); tone([520 + j * 80], 0.07); talk([sndOf(seg[j])], 0.8); });
      $('#blGo').onclick = () => {
        if ($('#blGo').dataset.done) { i + 1 < L.words.length ? next('blend', i + 1) : next('read', 0); return; }
        $('#blGo').dataset.done = 1;
        seg.forEach((_, j) => later(nav, j * 280, () => { light(j); const b = view.querySelector(`[data-sb="${j}"]`); if (b) b.classList.add('on'); }));
        later(nav, seg.length * 280 + 100, () => $('#blWord').classList.add('joined'));
        $('#blShow').innerHTML = `${x.e ? `<span class="e11-rpic" aria-hidden="true">${x.e}</span>` : ''}<b>${esc(x.w)}</b>`;
        talk([...seg.map(sndOf), x.w], 0.75); yay();
        $('#blGo').textContent = i + 1 < L.words.length ? 'Next word ▶' : 'Now read! ▶';
      };
    } else if (k === 'read') {
      const s = L.sents[i];
      const words = s.split(' ').map(w => { const bare = w.replace(/[^A-Za-z]/g, ''), tr = bare && L.tricky.has(bare.toLowerCase()) && !soundOK(bare, L.i);
        return `<button class="en-tw${tr ? ' e11-tw' : ''}" data-tw="${esc(bare)}">${esc(w)}</button>`; }).join(' ');
      view.innerHTML = `${head}<p class="e11-q">Read the sentence. ♥ words are tricky words.</p>
        <div class="e11-sent" id="rdS">${words}</div>
        <div class="progress">${L.sents.map((_, j) => `<i class="${j < i ? 'done' : j === i ? 'now' : ''}"></i>`).join('')}</div>
        <div class="row"><button class="btn alt" id="rdHear">🔊 Read to me</button><button class="btn leaf" id="rdDone">✓ I read it!</button></div>
        <div class="cheer" id="cheer" aria-live="polite"></div>`;
      screenText = s; say('Read the sentence. Tap a word if you need help.');
      A.wireTapWords(view);
      const glow = () => { const ws = [...view.querySelectorAll('#rdS .en-tw')]; ws.forEach((b, j) => later(nav, 250 + j * 420, () => { ws.forEach(z => z.classList.remove('lit')); b.classList.add('lit'); })); later(nav, 400 + ws.length * 420, () => ws.forEach(z => z.classList.remove('lit'))); };
      $('#rdHear').onclick = () => { talk([s], 0.8); glow(); };
      $('#rdDone').onclick = () => {
        if ($('#rdDone').dataset.done) { i + 1 < L.sents.length ? next('read', i + 1) : next('write', 0); return; }
        $('#rdDone').dataset.done = 1; yay(); $('#cheer').textContent = pick(['Super reading!', 'You read it!', 'Brilliant!']) + ' ✅';
        talk([s], 0.85); glow(); $('#rdDone').textContent = i + 1 < L.sents.length ? 'Next sentence ▶' : 'Now write! ▶';
      };
    } else if (k === 'write') {
      VIEWS.trace(L.wkind, L.write, { back: pathHome, done: () => { const pp = $('#lsPaper'); if (pp) pp.parentNode.remove(); $('#tNext').innerHTML = '<button class="btn leaf" id="lsNext">Game time! ▶</button>'; $('#lsNext').onclick = () => next('game', 0); } });
      const c = view.querySelector('.crumbs'); if (c) { c.querySelector('h1').textContent = `📖 Lesson ${L.n}: write ${L.write}`; c.insertAdjacentHTML('afterend', strip('write')); }
      const btns = $('#tBtns'); if (btns) btns.insertAdjacentHTML('afterend', '<div class="row"><button class="btn alt e11-paper" id="lsPaper">✏️ I wrote it on paper</button></div>');
      $('#lsPaper').onclick = () => next('game', 0);
    } else if (k === 'game') gameRound(i);
    else if (k === 'done') finishLesson();
  }

  /* --- the tiny game: three quick rounds --- */
  // Round 1 spots the new sound; round 2 reads a word (picture, or "which word has it?"); round 3 is the grammar bite or a tricky word.
  function games(L) {
    const pics = picWords(L.i), canPic = pics.some(x => L.g.some(k => hasG(x, k))) && new Set(pics.map(x => x.e)).size >= 3;
    const r2 = canPic ? { t: 'pic' } : whichOK(L) ? { t: 'which' } : { t: 'spot', k: L.g[1] || L.g[0] };
    const r3 = L.gp ? { t: 'gram' } : L.tw.length ? { t: 'tricky' } : whichOK(L) && r2.t !== 'which' ? { t: 'which' } : canPic ? { t: 'pic' } : { t: 'spot', k: L.g[L.g.length - 1] };
    return [{ t: 'spot', k: L.g[0] }, r2, r3];
  }
  const plainWords = li => EN_PATH.BANK.filter(x => !x.name && decodable(x.w, li));
  const whichOK = L => plainWords(L.i).filter(x => !L.g.some(k => hasG(x, k))).length >= 2;
  function makeRound(L, r) {
    if (r.t === 'spot') {
      const g = G[r.k], others = [...new Set(LESSONS.slice(0, L.i + 1).flatMap(x => x.g).map(k => G[k].sp).filter(s => s !== g.sp))];
      for (const c of 'mdgocker') { if (others.length >= 3) break; if (c !== g.sp && !others.includes(c)) others.push(c); }
      const dis = shuffle(others).slice(0, 5), tiles = shuffle([g.sp, g.sp, g.sp, ...dis]);
      return { t: 'spot', g, tiles, need: 3, found: new Set(), prompt: `Tap every <b>${esc(g.show)}</b>`, say: `Tap every ${g.snd}. ${g.snd}!` };
    }
    if (r.t === 'pic') {
      const pics = picWords(L.i), right = pick(pics.filter(x => L.g.some(k => hasG(x, k)))), seen = new Set([right.e]), ch = [right];
      for (const x of shuffle(pics)) { if (ch.length >= 3) break; if (!seen.has(x.e) && x.w !== right.w) { seen.add(x.e); ch.push(x); } }
      return { t: 'pic', prompt: `Read the word. Which picture is it?`, word: right.w, say: 'Read the word. Which picture is it?', choices: shuffle(ch).map(x => ({ html: x.e, val: x.w, lab: x.w })), answer: right.w, rv: { w: right.w, e: right.e } };
    }
    if (r.t === 'which') {
      const ws = plainWords(L.i), right = pick(L.words), wrong = shuffle(ws.filter(x => !L.g.some(k => hasG(x, k)))).slice(0, 2), g = G[L.g[L.g.length - 1]];
      return { t: 'which', prompt: `Which word has <b>${esc(g.show)}</b> in it?`, say: `Which word has the ${g.snd} sound?`, choices: shuffle([right, ...wrong]).map(x => ({ html: esc(x.w), val: x.w, lab: x.w, txt: true })), answer: right.w };
    }
    if (r.t === 'tricky') {
      const t = pick(L.tw), pool = [...new Set([...[...L.tricky].filter(w => w !== t.toLowerCase()).map(w => TWC[w] || w), ...L.words.map(x => x.w)])];
      const others = shuffle(pool).slice(0, 3);
      return { t: 'tricky', prompt: voice() ? 'Tap the tricky word you hear.' : `Find the tricky word <b>${esc(t)}</b>`, say: `Find the tricky word: ${t}. ${t}.`, choices: shuffle([t, ...others]).map(w => ({ html: `${esc(w)}`, val: w, lab: w, txt: true })), answer: t, rv: { w: t, k: 'sight' } };
    }
    const gp = L.gp;
    return { t: 'gram', prompt: esc(gp.q), about: gp.t, say: `${gp.t} ${gp.q}`, choices: shuffle([gp.a, gp.b]).map(w => ({ html: esc(w), val: w, lab: w, txt: true })), answer: gp.a };
  }
  function gameRound(i) {
    const L = LS.L, nav = navId, R = LS.cur = makeRound(L, LS.games[i]); LS.gi = i;
    const head = `${crumbs(`📖 Lesson ${L.n}: game time`)}${strip('game')}<div class="progress">${LS.games.map((_, j) => `<i class="${j < i ? 'done' : j === i ? 'now' : ''}"></i>`).join('')}</div>`;
    const go2 = () => later(nav, 1000, () => i + 1 < LS.games.length ? go(lstep, 'game', i + 1) : go(lstep, 'done', 0));
    if (R.t === 'spot') {
      view.innerHTML = `${head}<div class="prompt"><div class="ptext">${R.prompt}</div><button class="speak" id="spk" aria-label="Say it again">🔊</button></div>
        <div class="e11-spot">${R.tiles.map((s, j) => `<button class="e11-tile" data-sp="${j}" aria-label="${esc(s.replace('_', ' '))}">${esc(s.replace('_', '‿'))}</button>`).join('')}</div>
        <div class="cheer" id="cheer" aria-live="polite"></div>`;
      say(R.say); $('#spk').onclick = () => say(R.say);
      view.querySelectorAll('[data-sp]').forEach(b => b.onclick = () => {
        if (nav !== navId || R.found.size >= R.need) return;
        const j = +b.dataset.sp;
        if (R.tiles[j] !== R.g.sp) { oops(); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); say(`That one is ${sndOf(R.tiles[j])}. Find ${R.g.snd}!`); return; }
        if (R.found.has(j)) return;
        R.found.add(j); b.classList.add('got'); b.disabled = true; tone([660 + R.found.size * 120], 0.07);
        if (R.found.size >= R.need) { yay(); $('#cheer').textContent = 'You found them all! ✅'; say('You found them all!'); go2(); }
      });
      return;
    }
    view.innerHTML = `${head}<div class="qcard en-q"><div class="prompt"><div class="ptext">${R.prompt}</div><button class="speak" id="spk" aria-label="Read it to me">🔊</button></div>
        ${R.word ? `<div class="e11-gword">${esc(R.word)}</div>` : ''}${R.about ? `<p class="e11-about">💡 ${esc(R.about)}</p>` : ''}
        <div class="choices en-ch" style="grid-template-columns:repeat(${R.choices.some(c => c.txt && c.html.length > 12) ? 1 : R.choices.length},1fr)">${R.choices.map((c, j) => `<button class="choice${c.txt ? ' txt' : ''}" data-ch="${j}" aria-label="${esc(c.lab)}">${c.html}</button>`).join('')}</div>
        <div class="cheer" id="cheer" aria-live="polite"></div></div>`;
    say(R.say); $('#spk').onclick = () => say(R.say);
    let tries = 0, fin = false;
    view.querySelectorAll('[data-ch]').forEach(b => b.onclick = () => {
      if (fin || b.disabled || nav !== navId) return;
      const c = R.choices[+b.dataset.ch];
      if (c.val !== R.answer) { tries++; b.classList.add('wrong'); b.disabled = true; oops(); if (R.rv && tries === 1) hooks.miss(R.rv); say(R.t === 'pic' ? `Sound it out: ${segment(R.answer).map(sndOf).join(', ')}.` : 'Try another one!'); return; }
      fin = true; b.classList.add('right'); view.querySelectorAll('[data-ch]').forEach(x => x.disabled = true);
      if (R.rv) hooks.hit(R.rv, tries === 0, false);
      yay(); $('#cheer').textContent = tries ? 'Now you know it! ✅' : pick(['Yes!', 'Super!', 'You got it!']) + ' ✅'; say(R.t === 'pic' ? `${R.answer}!` : 'Yes!');
      go2();
    });
  }
  function finishLesson() {
    const L = LS.L, p = P(), fresh = !p.done[L.id], earned = fresh ? 5 : 1, prev = o(p.done[L.id]);
    p.done[L.id] = { d: today(), n: (+prev.n || 0) + 1 };
    if (!p.days.includes(today())) p.days = [...p.days.filter(d => dayNum(today()) - dayNum(d) < 30), today()];
    give(earned); save(); confetti(60); tone([523, 659, 784, 1046], 0.1);
    const nx = curNode(p);
    view.innerHTML = `<div class="view done e11-done"><div class="e11-sticker" aria-hidden="true"><span>${L.sticker}</span></div>
      <h1>Lesson ${L.n} done!</h1><p class="e11-earn">${fresh ? `New sticker! You earned ${earned} ⭐` : `Great practice! +${earned} ⭐`}</p>
      <p class="note">You know ${knownSounds(p).length} of ${ALLG.length} sounds. ${nx ? (nx.t === 'L' ? `Next: lesson ${nx.L.n} (${esc(nx.L.title)}). Come back tomorrow, or keep going!` : `Next: the unit ${nx.U.n} check-up!`) : 'You finished the whole path!'}</p>
      <div class="row">${nx ? `<button class="btn leaf" id="dnNext">${nx.t === 'L' ? `▶ Lesson ${nx.L.n}` : '🏁 Check-up'}</button>` : ''}<button class="btn alt" id="dnPath">🗺️ My path</button></div></div>`;
    sayScreen(`Lesson ${L.n} done! ${fresh ? `You earned a new sticker and ${earned} stars!` : `Great practice! You earned a star.`}`);
    const n = $('#dnNext'); if (n) n.onclick = () => openNode(nx);
    $('#dnPath').onclick = () => go(pathHome);
  }

  /* ===================== unit check-ups and the placement check ===================== */
  // A reading question: read a word with the sound, tap its picture.
  function picQ(k, li) {
    const x = picFor(k, li); if (!x) return null;
    const seen = new Set([x.e]), ch = [x];
    for (const y of shuffle(picWords(li))) { if (ch.length >= 3) break; if (!seen.has(y.e) && y.w !== x.w) { seen.add(y.e); ch.push(y); } }
    return { k, w: x.w, e: x.e, choices: shuffle(ch) };
  }
  function askQ(Q, title, prog, onAnswer, back) {
    const nav = navId, g = G[Q.k];
    view.innerHTML = `${crumbs(title)}${prog}
      <div class="qcard en-q"><div class="prompt"><div class="ptext">Read the word. Which picture is it?</div><button class="speak" id="spk" aria-label="Read it to me">🔊</button></div>
        <div class="e11-gword">${esc(Q.w)}</div>
        <div class="choices en-ch" style="grid-template-columns:repeat(3,1fr)">${Q.choices.map((c, j) => `<button class="choice" data-ck="${j}" aria-label="${esc(c.w)}">${c.e}</button>`).join('')}</div>
        <div class="cheer" id="cheer" aria-live="polite"></div></div>`;
    wireBack(back);
    say('Read the word. Which picture is it?'); $('#spk').onclick = () => say('Read the word, sound by sound. Which picture is it?');
    let fin = false;
    view.querySelectorAll('[data-ck]').forEach(b => b.onclick = () => {
      if (fin || nav !== navId) return; fin = true;
      const c = Q.choices[+b.dataset.ck], ok = c.w === Q.w;
      view.querySelectorAll('[data-ck]').forEach(x => x.disabled = true);
      if (ok) { b.classList.add('right'); yay(); $('#cheer').textContent = 'Yes! ✅'; say(`${Q.w}! Yes!`); }
      else { b.classList.add('wrong'); view.querySelectorAll('[data-ck]').forEach((x, j) => { if (Q.choices[j].w === Q.w) x.classList.add('show'); }); oops();
        $('#cheer').textContent = `This says ${Q.w}. ${g.show.replace('‿', '-')} says “${g.snd}”.`; say(`That's OK! This says ${segment(Q.w).map(sndOf).join(', ')}, ${Q.w}.`); }
      later(nav, ok ? 900 : 1700, () => onAnswer(ok));
    });
  }
  let CK = null;
  function checkIntro(u) {
    const U = UNITS[u], ck = o(P().checks[U.id]), p = P();
    if (!unitOpen(p, U)) { go(pathHome); say(`Finish the lessons of unit ${U.n} first!`); return; }
    view.innerHTML = `${crumbs(`🏁 Unit ${U.n} check-up`)}
      <div class="e11-card" style="--uc:${U.c}"><span class="e11-unitn">${U.ico} Unit ${U.n}: ${esc(U.name)}</span><div class="e11-big sm">${U.g.map(k => `<b>${esc(G[k].show)}</b>`).join('')}</div>
        <p>One word for each sound. Read it and tap its picture. No rush, and no worries: any sound you miss comes back for practice.</p>
        ${ck.of ? `<p class="note">Last time: ${ck.best} of ${ck.of}${ck.pass ? ' 🏅' : ''}</p>` : ''}</div>
      <div class="row"><button class="btn leaf" id="ckGo">▶ Start the check-up</button><button class="btn alt" id="ckPath">🗺️ My path</button></div>${ptip('path')}`;
    wireBack(pathHome);
    sayScreen(`Unit ${U.n} check-up. Read each word and tap its picture. No rush!`);
    $('#ckGo').onclick = () => { CK = { u, U, qs: U.g.map(k => picQ(k, U.last)).filter(Boolean), i: 0, right: 0, miss: [] }; go(ckQ); };
    $('#ckPath').onclick = () => go(pathHome);
  }
  function ckQ() {
    const Q = CK.qs[CK.i], prog = `<div class="progress">${CK.qs.map((_, j) => `<i class="${j < CK.i ? 'done' : j === CK.i ? 'now' : ''}"></i>`).join('')}</div>`;
    askQ(Q, `🏁 Unit ${CK.U.n} check-up`, prog, ok => {
      if (ok) CK.right++;
      else { CK.miss.push(Q.k); const p = P(); p.weak[Q.k] = (p.weak[Q.k] || 0) + 1; hooks.miss({ w: Q.w, e: Q.e, k: 'pic' }); save(); }
      CK.i++; CK.i < CK.qs.length ? go(ckQ) : go(ckEnd);
    }, pathHome);
  }
  function ckEnd() {
    const U = CK.U, p = P(), prev = o(p.checks[U.id]), of = CK.qs.length, pass = CK.right >= Math.ceil(of * 0.8), firstPass = pass && !prev.pass;
    const earned = firstPass ? 5 : 1;
    p.checks[U.id] = { d: today(), best: Math.max(+prev.best || 0, CK.right), of, pass: !!(prev.pass || pass), n: (+prev.n || 0) + 1, last: CK.right };
    give(earned); save();
    if (pass) { confetti(70); tone([523, 659, 784, 1046, 1318], 0.1); } else yay();
    const nx = curNode(p);
    view.innerHTML = `<div class="view done e11-done">${pass ? `<div class="e11-medal" aria-hidden="true"><span>🏅</span><b>${U.ico}</b></div>` : '<div class="big" aria-hidden="true">🌱</div>'}
      <h1>${pass ? `Unit ${U.n} badge!` : 'Good try!'}</h1><p class="e11-earn">You read ${CK.right} of ${of} on the first try and earned ${earned} ⭐</p>
      ${CK.miss.length ? `<p class="e11-miss">Sounds to practise: ${CK.miss.map(k => `<b>${esc(G[k].show)}</b>`).join(' ')}<br><small>They come back in Owl's review and at the start of your next lessons.</small></p>` : '<p class="note">Every sound read! 🌟</p>'}
      <div class="row">${nx ? `<button class="btn leaf" id="dnNext">${nx.t === 'L' ? `▶ Lesson ${nx.L.n}` : '🏁 Check-up'}</button>` : ''}<button class="btn alt" id="dnPath">🗺️ My path</button></div></div>`;
    sayScreen(pass ? `You won the unit ${U.n} badge!` : `Good try! We will practise ${CK.miss.map(k => G[k].snd).join(', ')}.`);
    const n = $('#dnNext'); if (n) n.onclick = () => openNode(nx);
    $('#dnPath').onclick = () => go(pathHome);
  }
  // Placement: 4 sounds from each unit in turn; 3 of 4 right moves on to the next unit, otherwise the path starts there.
  let PL = null;
  const placeQs = U => { const n = U.g.length, ks = [...new Set([0, 1, 2, 3].map(j => U.g[Math.floor(j * n / 4)]))]; return ks.map(k => picQ(k, U.last)).filter(Boolean); };
  function placeIntro() {
    view.innerHTML = `${crumbs('🧭 Placement check')}
      <div class="e11-card"><div class="e11-big sm"><b>🧭</b></div><p>Already reading a little? Read a few words and tap their pictures. Owl will find the right lesson to start, and skip what your child already knows.</p>
        <p class="note">4 words for each unit, easy ones first. It stops as soon as the words get tricky.</p></div>
      <div class="row"><button class="btn leaf" id="plGo">▶ Start</button><button class="btn alt" id="plBack">🗺️ My path</button></div>`;
    wireBack(pathHome);
    sayScreen('Placement check. Read each word and tap its picture.');
    $('#plGo').onclick = () => { PL = { u: 0, qs: placeQs(UNITS[0]), i: 0, right: 0, n: 0 }; go(plQ); };
    $('#plBack').onclick = () => go(pathHome);
  }
  function plQ() {
    const U = UNITS[PL.u], Q = PL.qs[PL.i], prog = `<p class="note e11-pln">Unit ${U.n} of ${UNITS.length} · word ${PL.i + 1} of ${PL.qs.length}</p>`;
    askQ(Q, '🧭 Placement check', prog, ok => {
      PL.n++; if (ok) PL.right++;
      PL.i++;
      if (PL.i < PL.qs.length) { go(plQ); return; }
      const need = Math.max(1, PL.qs.length - 1);
      if (PL.right >= need && PL.u + 1 < UNITS.length) { PL.u++; PL.qs = placeQs(UNITS[PL.u]); PL.i = 0; PL.right = 0; go(plQ); return; }
      go(plEnd, PL.right >= need ? UNITS.length : PL.u);
    }, pathHome);
  }
  function plEnd(placed) {
    const p = P(), first = !p.placeDone;
    for (let u = 0; u < placed; u++) { const U = UNITS[u];
      U.lessons.forEach(L => { if (!p.done[L.id]) p.done[L.id] = { d: today(), n: 0, p: 1 }; });
      if (!p.checks[U.id]) p.checks[U.id] = { d: today(), best: 0, of: 0, pass: true, n: 0, p: 1 }; }
    p.placed = Math.max(+p.placed || 0, placed); p.placeDone = today();
    if (first) give(2); save(); confetti(40); yay();
    const nx = curNode(p);
    view.innerHTML = `<div class="view done e11-done"><div class="big" aria-hidden="true">🧭</div>
      <h1>${placed ? 'You know lots of sounds!' : "Let's start at the beginning!"}</h1>
      <p class="e11-earn">${nx ? (nx.t === 'L' ? `Your path starts at lesson ${nx.L.n}: ${esc(nx.L.title)}` : `Next: the unit ${nx.U.n} check-up`) : 'You can read every sound on the path!'}${first ? ' · +2 ⭐' : ''}</p>
      ${placed ? `<p class="note">Units 1${placed > 1 ? `–${placed}` : ''} are marked as known. You can still play any of them again.</p>` : ''}
      <div class="row">${nx ? `<button class="btn leaf" id="dnNext">${nx.t === 'L' ? `▶ Lesson ${nx.L.n}` : '🏁 Check-up'}</button>` : ''}<button class="btn alt" id="dnPath">🗺️ My path</button></div></div>`;
    sayScreen(nx && nx.t === 'L' ? `Your reading path starts at lesson ${nx.L.n}.` : 'All done!');
    const n = $('#dnNext'); if (n) n.onclick = () => openNode(nx);
    $('#dnPath').onclick = () => go(pathHome);
  }

  /* ===================== wiring ===================== */
  SECTIONS.push({ id: 'path', ico: '📖', name: 'Learn to Read', hidden: true, fn: () => pathHome(), c: '#000',
    tip: 'One short lesson a day, in order. Sit beside your child, say the sounds crisply, and let them do the reading; praise the effort, not just the right answer.' });
  // The English home gets a big "Today's reading lesson" button at the very top (the section has no tile of its own).
  const prevAfter = englishHome.after;
  englishHome.after = v => {
    v.querySelectorAll('[data-sec="path"]').forEach(b => b.remove());
    if (prevAfter) prevAfter(v);
    const c = v.querySelector('.crumbs'); if (!c) return;
    const p = P(), cur = curNode(p), done = LESSONS.filter(L => p.done[L.id]).length, b = document.createElement('button');
    b.className = 'e11-home'; b.id = 'enPath';
    b.innerHTML = `<span class="e11-hico" aria-hidden="true">📖</span><span><b>Today's reading lesson</b>${cur ? (cur.t === 'L' ? `Lesson ${cur.L.n} of ${LESSONS.length} · ${esc(cur.L.title)}` : `Unit ${cur.U.n} check-up`) : 'Path complete! 🏆'}<span class="meter"><i style="width:${Math.round(done / LESSONS.length * 100)}%"></i></span></span><span class="e11-go">▶</span>`;
    c.insertAdjacentElement('afterend', b);
    b.onclick = () => cur ? openNode(cur) : go(pathHome);
  };
  Object.assign(VIEWS, { path: pathHome, lesson: lessonIntro, lstep: (k, i) => lstep(k, i), checkup: checkIntro, placement: placeIntro });
  const prevMore = englishHome.more;
  englishHome.more = b => { const x = prevMore ? prevMore(b) : b;
    return { ...x, pathLessons: LESSONS.length, pathUnits: UNITS.length, pathSounds: ALLG.length, pathTricky: new Set(LESSONS.flatMap(L => L.tw.map(t => t.toLowerCase()))).size,
      pathSentences: LESSONS.reduce((a, L) => a + L.sents.length, 0), pathGrammar: LESSONS.filter(L => L.gp).length }; };
  // For the grown-ups' report: where a player is on the reading path, read from any saved english state.
  englishHome.pathStats = e => {
    const p = o(o(e).path), done = o(p.done), checks = o(p.checks), n = LESSONS.filter(L => done[L.id]).length, cur = curNode({ done, checks });
    return { done: n, all: LESSONS.length, now: cur ? (cur.t === 'L' ? cur.L.n : null) : null, nowTitle: cur && cur.t === 'L' ? cur.L.title : '', check: cur && cur.t === 'C' ? cur.U.n : null,
      sounds: knownSounds({ done }).length, soundsAll: ALLG.length, checks: UNITS.filter(U => o(checks[U.id]).pass).length, checksAll: UNITS.length,
      weak: Object.keys(o(p.weak)).filter(k => G[k] && +p.weak[k] > 0).map(k => G[k].show), placed: +p.placed || 0 };
  };
  if (location.hash === '#selftest' && window.__english) {
    Object.defineProperties(window.__english, Object.getOwnPropertyDescriptors({
      PATH: EN_PATH, P, NODES, curNode, pathHome, tipFor, games, makeRound, picQ,
      get LS() { return LS; }, get CK() { return CK; }, get PL() { return PL; }
    }));
  }
})();
