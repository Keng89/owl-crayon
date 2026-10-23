/* ---------- Science & Nature data: 14 topics, 6 mini-labs, 12 experiments to try at home ---------- */
// Built only when the Science & Nature area first opens (scienceHome calls sciData() once), not at startup.
// Card text by age: t for everyone, m added from age 7, b (the science word) from age 10. A quiz question's h is the
// harder version used from age 8. Pictures use the scene language in science.js: "background|emoji x y size anim delay"
// or "@drawer x y scale anim" in a 200 x 120 box.
function sciData() {
  const TOPICS = [
    { id: 'body', ico: '👀', name: 'My body & senses', c: '#C44E40', badge: '🩺', bname: 'Body expert',
      cards: [
        { h: 'Five senses', pic: 'inside|👀 40 42 30 blink|👂 100 42 30|👃 160 42 30|👅 70 80 28 wiggle|✋ 130 80 28 bob', t: 'You have 5 senses: seeing, hearing, smelling, tasting and touching.', m: 'Your senses send messages to your brain all day long.', b: 'Each sense has its own sense organ: eyes, ears, nose, tongue and skin.', dyk: 'Food tastes of less when your nose is blocked, because smell helps you taste!' },
        { h: 'Your heart', pic: 'inside|@heart 100 56 2.4|🏃 160 70 30 bob', t: 'Your heart is a strong muscle. It pumps blood all around your body.', m: 'Put your hand on your chest and feel it beat. It beats faster when you run!', b: 'Blood carries oxygen and food to every part of you through tubes called blood vessels.', dyk: 'Your heart beats about 100,000 times every day!' },
        { h: 'Breathing', pic: 'sky|@lungs 100 58 2.3|💨 160 40 26 drift', t: 'You breathe air in and out with your lungs.', m: 'Air goes in through your nose or mouth and fills your lungs like balloons.', b: 'Your lungs take oxygen from the air and breathe out carbon dioxide.', dyk: 'You breathe more than 20,000 times a day, even while you sleep!' },
        { h: 'Bones and muscles', pic: 'inside|🦴 60 56 40 wiggle|💪 140 56 44 bob', t: 'Bones hold you up. Muscles pull on your bones so you can move.', m: 'Your skeleton also protects soft parts inside, like your brain and heart.', b: 'Grown-ups have 206 bones. Babies have about 300, and some join together as they grow.', dyk: 'The smallest bone in your body is in your ear. It is as small as a grain of rice!' },
        { h: 'Your brain', pic: 'inside|@brain 100 56 2.4 pulse|💭 150 26 26 float', t: 'Your brain is the boss of your body. It helps you think, feel and remember.', m: 'Messages race from your senses to your brain along nerves.', b: 'Your brain uses about a fifth of your body\'s energy, even when you sleep.', dyk: 'Sleep helps your brain keep what you learned today!' },
        { h: 'Staying healthy', pic: 'inside|🥦 35 60 30 bob|🧼 80 60 30 wiggle 0.3|💧 125 60 30 bob 0.6|😴 168 60 30 float', t: 'Eat fruit and vegetables, drink water, move about, and sleep well.', m: 'Wash your hands with soap to wash germs away.', b: 'Germs are tiny living things. Soap breaks them up so water can rinse them off.', dyk: 'Singing "Happy Birthday" twice is about how long to wash your hands!' }
      ],
      quiz: [
        { k: 'pic', q: 'Which one do you use to hear?', o: [['👂', 'ear'], ['👀', 'eyes'], ['👃', 'nose']], a: 0, hint: 'Hearing is for sounds.', why: 'Your ears catch sounds.',
          h: { k: 'pic', q: 'Which part pumps blood around your body?', o: [['@heart', 'heart'], ['@brain', 'brain'], ['🦴', 'bone']], a: 0, why: 'The heart is a muscle that pumps blood.' } },
        { k: 'tf', q: 'Your heart beats faster when you run.', pic: 'grass|🏃 70 64 40 bob|@heart 140 50 1.8', a: true, why: 'Your muscles need more oxygen, so your heart pumps faster.',
          h: { k: 'tf', q: 'Grown-ups have more bones than babies.', pic: 'inside|👶 60 60 40|🧑 140 60 40', a: false, why: 'Babies have about 300 bones. Some join together, so grown-ups have 206.' } },
        { k: 'sort', q: 'Every day, or only sometimes?', g: [['💪', 'Every day'], ['🍬', 'A treat sometimes']], items: [['🥦', 'broccoli', 0], ['🍭', 'lollipop', 1], ['🍎', 'apple', 0], ['🍟', 'fries', 1], ['💧', 'water', 0], ['🍩', 'doughnut', 1]] },
        { k: 'order', q: 'Put these in order, from baby to grown-up.', items: [['👶', 'baby'], ['🧒', 'child'], ['🧑', 'grown-up'], ['🧓', 'older person']], hint: 'Start with the youngest.' },
        { k: 'pic', q: 'What do you use to smell a flower?', o: [['👃', 'nose'], ['✋', 'hand'], ['👂', 'ear']], a: 0, why: 'Your nose smells.' }
      ] },
    { id: 'animals', ico: '🦁', name: 'Animals & habitats', c: '#9A5B13', badge: '🐾', bname: 'Animal tracker',
      cards: [
        { h: 'A home called a habitat', pic: 'forest|🌳 40 66 54|🐿️ 46 48 20 bob|🦉 150 40 26 blink|🦊 130 84 26|🍄 90 92 16', t: 'A habitat is an animal\'s home. It gives food, water and shelter.', m: 'Animals live where they can find everything they need.', b: 'Animals have adaptations: body parts or habits that help them live in their habitat.', dyk: 'A woodpecker\'s long tongue wraps around the inside of its head!' },
        { h: 'Hot, dry desert', pic: 'desert|@sun 165 24 1.2|🐫 80 70 50 bob|🌵 160 78 34|🦎 40 96 18 swim', t: 'Camels live in the hot, dry desert.', m: 'A camel\'s hump stores fat, so it can go a long time without food.', b: 'Many desert animals hide in the hot day and come out in the cool night.', dyk: 'A thirsty camel can drink about a bathtub of water in a few minutes!' },
        { h: 'Icy and cold', pic: 'snow|🐧 70 70 40 wiggle|🐧 110 74 34 wiggle 0.4|🧊 160 80 30|❄️ 30 26 16 fall|❄️ 150 20 14 fall 0.6', t: 'Penguins live where it is icy and cold.', m: 'Thick fat and tight feathers keep them warm.', b: 'Penguins huddle together and take turns standing on the windy outside.', dyk: 'Penguins can\'t fly in the air, but they "fly" underwater with their wings!' },
        { h: 'The rainforest', pic: 'jungle|🌴 30 64 56|🌴 172 64 56|🐒 70 40 28 bob|🦜 130 34 26 fly|🐍 110 92 24 swim', t: 'Rainforests are hot, wet and full of trees. Monkeys and parrots live there.', m: 'More kinds of animals live in rainforests than anywhere else on land.', b: 'A rainforest has layers: the forest floor, the understory, the canopy and the tall emergent trees.', dyk: 'A sloth moves so slowly that tiny green plants grow in its fur!' },
        { h: 'Animal groups', pic: 'grass|🐄 34 66 32|🐦 82 50 28 fly|🐟 126 66 28 swim|🐞 166 68 24 wiggle', t: 'Animals with fur are mammals. Animals with feathers are birds.', m: 'Fish have scales and gills. Insects have 6 legs.', b: 'Animals with a backbone are vertebrates. Animals without one, like insects, are invertebrates.', dyk: 'A spider is not an insect: it has 8 legs!' },
        { h: 'Night animals', pic: 'night|@moon 160 26 1.2|🦉 60 56 36 blink|🦇 120 40 26 fly|🦔 120 90 24', t: 'Some animals sleep in the day and wake up at night, like owls and bats.', m: 'Big eyes and great hearing help them find food in the dark.', b: 'Animals that are active at night are called nocturnal.', dyk: 'Bats find their way by squeaking and listening for the echo!' }
      ],
      quiz: [
        { k: 'pic', q: 'Which animal lives in the icy cold?', o: [['🐧', 'penguin'], ['🐫', 'camel'], ['🐒', 'monkey']], a: 0, why: 'Penguins have fat and feathers to stay warm.',
          h: { k: 'pic', q: 'Which animal is nocturnal (awake at night)?', o: [['🦉', 'owl'], ['🐓', 'rooster'], ['🦋', 'butterfly']], a: 0, why: 'Owls hunt at night with big eyes and sharp ears.' } },
        { k: 'tf', q: 'A spider is an insect.', pic: 'grass|🕷️ 100 60 50 wiggle', a: false, why: 'Insects have 6 legs. Spiders have 8, so they are not insects.' },
        { k: 'sort', q: 'Does it live on land or in water?', g: [['🌳', 'Land'], ['🌊', 'Water']], items: [['🐟', 'fish', 1], ['🦁', 'lion', 0], ['🐙', 'octopus', 1], ['🐘', 'elephant', 0], ['🐬', 'dolphin', 1], ['🐿️', 'squirrel', 0]],
          h: { k: 'sort', q: 'Mammal or bird?', g: [['🐄', 'Mammal'], ['🪶', 'Bird']], items: [['🐬', 'dolphin', 0, 'A dolphin breathes air and feeds its babies milk: a mammal!'], ['🦅', 'eagle', 1], ['🦇', 'bat', 0, 'A bat has fur, not feathers: it is a mammal that flies!'], ['🐧', 'penguin', 1, 'Penguins have feathers, so they are birds, even though they swim.'], ['🐄', 'cow', 0], ['🦉', 'owl', 1]] } },
        { k: 'order', q: 'Put them in order from smallest to biggest.', items: [['🐜', 'ant'], ['🐭', 'mouse'], ['🐕', 'dog'], ['🐘', 'elephant']], hint: 'Start with the tiniest one.' },
        { k: 'pic', q: 'Which animal makes its home in the desert?', o: [['🐫', 'camel'], ['🐧', 'penguin'], ['🐠', 'fish']], a: 0, why: 'Camels can go a long time without water.' }
      ] },
    { id: 'cycles', ico: '🦋', name: 'Life cycles', c: '#7D3C98', badge: '🦋', bname: 'Life cycle star',
      cards: [
        { h: 'The circle of life', pic: 'grass|@cycle 100 56 2|🥚 100 22 20|🐣 140 56 20|🐔 100 90 22|🐥 60 56 20', t: 'Living things are born, grow up, have babies, and then it starts again.', m: 'This circle is called a life cycle.', b: 'Plants and animals have very different life cycles, but every one goes round and round.', dyk: 'Some turtles live to be over 100 years old!' },
        { h: 'Egg to butterfly', pic: 'grass|🌿 40 74 40|🥚 40 64 12|🐛 90 80 26 swim|@chrys 140 48 1.2|🦋 172 30 26 fly', t: 'A butterfly starts as a tiny egg. A caterpillar hatches and eats and eats!', m: 'Then it makes a chrysalis. Inside, it changes into a butterfly.', b: 'This big change of body shape is called metamorphosis.', dyk: 'A caterpillar\'s first meal is often its own eggshell!' },
        { h: 'Frogspawn to frog', pic: 'pond|@spawn 50 96 1|@tadpole 100 98 1|@froglet 140 92 0.9|🐸 172 70 30 bob', t: 'Frogs lay eggs called frogspawn in ponds.', m: 'Tadpoles hatch with tails. They grow legs, become froglets, then frogs.', b: 'Tadpoles breathe with gills. Grown frogs breathe with lungs and through their skin.', dyk: 'Some frogs can jump 20 times their own length!' },
        { h: 'Seed to flower', pic: 'sky|@seed 30 100 1.4|🌱 75 84 26 grow|🌿 120 78 32|🌻 168 66 42 sway|🐝 150 30 18 fly', t: 'A seed grows into a plant. The plant grows flowers, and flowers make new seeds.', m: 'Bees carry pollen from flower to flower so new seeds can grow.', b: 'Moving pollen between flowers is called pollination.', dyk: 'A coconut is a giant seed that can float across the sea!' },
        { h: 'Egg to hen', pic: 'grass|🥚 40 80 26|🐣 90 78 30 wiggle|🐥 135 80 28 bob|🐔 172 70 36', t: 'A hen lays an egg. A chick hatches, grows, and becomes a hen.', m: 'The chick pecks its way out with a tiny "egg tooth" on its beak.', b: 'The yolk is food for the growing chick inside the egg.', dyk: 'Chicks cheep to their mum before they even hatch!' }
      ],
      quiz: [
        { k: 'order', q: 'Put the butterfly\'s life cycle in order.', cycle: true, items: [['🥚', 'egg'], ['🐛', 'caterpillar'], ['@chrys', 'chrysalis'], ['🦋', 'butterfly']], hint: 'It starts with a tiny egg on a leaf.', why: 'Egg, caterpillar, chrysalis, butterfly, and then new eggs!' },
        { k: 'order', q: 'Put the frog\'s life cycle in order.', cycle: true, items: [['@spawn', 'frogspawn'], ['@tadpole', 'tadpole'], ['@froglet', 'froglet'], ['🐸', 'frog']], hint: 'Frogspawn comes first. Tadpoles have tails.' },
        { k: 'pic', q: 'What does a caterpillar turn into?', o: [['🦋', 'butterfly'], ['🐝', 'bee'], ['🐦', 'bird']], a: 0 },
        { k: 'tf', q: 'A tadpole grows into a frog.', pic: 'pond|@tadpole 70 96 1.4|@arrowR 110 96 1|🐸 150 88 30', a: true, why: 'Tadpoles grow legs, lose their tails and become frogs.',
          h: { k: 'tf', q: 'A tadpole breathes with lungs, just like us.', pic: 'pond|@tadpole 100 96 1.6', a: false, why: 'Tadpoles breathe with gills. Frogs get lungs later.' } },
        { k: 'sort', q: 'Does it hatch from an egg, or is it born as a baby?', g: [['🥚', 'Hatches from an egg'], ['🍼', 'Born as a baby']], items: [['🐔', 'chicken', 0], ['🐶', 'puppy', 1], ['🐢', 'turtle', 0], ['🐱', 'kitten', 1], ['🐍', 'snake', 0], ['🐄', 'calf', 1]] }
      ] },
    { id: 'plants', ico: '🌱', name: 'Plants & seeds', c: '#268457', badge: '🌻', bname: 'Green thumb',
      cards: [
        { h: 'What plants need', pic: 'sky|@sun 40 26 1.2|@rain 160 22 1|🌱 100 80 36 grow|💨 60 70 18 drift', t: 'Plants need water, sunlight and air to grow.', m: 'Most plants also need soil full of goodness.', b: 'Plants make their own food from sunlight, water and air. This is called photosynthesis.', dyk: 'Plants give out the oxygen that we breathe!' },
        { h: 'Parts of a plant', pic: 'sky|@roots 60 92 1.8|🌸 140 40 30 sway|🍃 140 74 24', t: 'Roots drink water. The stem holds the plant up. Leaves catch sunlight. Flowers make seeds.', m: 'Water travels up the stem from the roots to the leaves.', b: 'Tiny tubes in the stem carry water up, like drinking straws.', dyk: 'Some trees have roots that spread wider than the tree is tall!' },
        { h: 'Seeds go travelling', pic: 'sky|@dandelion 50 74 1.6|🌬️ 110 40 26 drift|🐿️ 160 80 28 bob|🌰 140 92 14', t: 'Seeds travel to new places to grow.', m: 'Wind blows dandelion seeds. Animals carry seeds in their fur or their tummies.', b: 'Some seed pods burst open and flick their seeds away, like tiny catapults.', dyk: 'Each dandelion seed has its own little parachute!' },
        { h: 'Trees', pic: 'forest|🌳 60 62 64 sway|🌲 150 62 56|🐦 64 30 18 bob|🐛 160 90 16', t: 'Trees are the biggest plants. They give homes to birds and bugs.', m: 'Count the rings inside a tree trunk to find out how old it is.', b: 'Deciduous trees lose their leaves in autumn. Evergreen trees stay green all year.', dyk: 'Some trees alive today are older than the Egyptian pyramids!' },
        { h: 'Food from plants', pic: 'inside|🥕 40 66 34 bob|🥬 90 66 34|🍎 140 66 34 bob 0.4|🍓 180 70 24', t: 'We eat lots of different plant parts!', m: 'Carrots are roots, lettuce is leaves, and apples hold the seeds.', b: 'A fruit is the part of a plant that holds its seeds, so a tomato is a fruit!', dyk: 'A strawberry wears its seeds on the outside!' }
      ],
      quiz: [
        { k: 'order', q: 'Put these in order, from seed to flower.', items: [['@seed', 'seed'], ['🌱', 'sprout'], ['🌿', 'young plant'], ['🌻', 'flower']], hint: 'A plant starts as a little seed in the soil.' },
        { k: 'pic', q: 'Which part of a plant drinks water from the soil?', o: [['@roots', 'roots'], ['🌸', 'flower'], ['🍃', 'leaf']], a: 0, why: 'Roots grow down into the soil and drink.' },
        { k: 'tf', q: 'Plants need sunlight to grow.', pic: 'sky|@sun 60 30 1.4|🌱 120 80 36', a: true, why: 'Leaves use sunlight to make food for the plant.',
          h: { k: 'tf', q: 'A tomato is a fruit.', pic: 'inside|🍅 100 60 50 bob', a: true, why: 'A tomato holds the plant\'s seeds, so it is a fruit.' } },
        { k: 'sort', q: 'Plant or animal?', g: [['🌱', 'Plant'], ['🐾', 'Animal']], items: [['🌵', 'cactus', 0], ['🐝', 'bee', 1], ['🌳', 'tree', 0], ['🐌', 'snail', 1], ['🌷', 'tulip', 0], ['🐸', 'frog', 1]] },
        { k: 'pic', q: 'Which seed is blown along by the wind?', o: [['@dandelion', 'dandelion'], ['🥥', 'coconut'], ['🍒', 'cherry']], a: 0, why: 'Dandelion seeds have parachutes for the wind.' }
      ] },
    { id: 'weather', ico: '⛅', name: 'Weather & seasons', c: '#2776C3', badge: '🌈', bname: 'Weather watcher',
      cards: [
        { h: 'What is weather?', pic: 'sky|@sun 40 30 1.2|@cloud 110 30 1.1 drift|@rain 160 30 0.9|🌬️ 60 76 22 drift', t: 'Weather is what the sky and air are doing: sunny, rainy, windy or snowy.', m: 'Weather can change from day to day, and even hour to hour.', b: 'Scientists who study and forecast weather are called meteorologists.', dyk: 'Every snowflake has six sides or six points!' },
        { h: 'Clouds and rain', pic: 'rain|@rain 70 30 1.4|@rain 140 26 1.2|☂️ 100 86 30 bob', t: 'Clouds are made of tiny drops of water.', m: 'When the drops join and get big and heavy, they fall as rain.', b: 'In very cold clouds the water freezes and falls as snow or hail.', dyk: 'One big fluffy cloud can weigh as much as 100 elephants!' },
        { h: 'Wind', pic: 'sky|🪁 140 34 30 sway|🌬️ 50 40 30 drift|🌳 60 76 40 sway', t: 'Wind is moving air. You can\'t see it, but you can see what it moves.', m: 'Wind turns windmills and helps kites fly.', b: 'Wind blows when warm air rises and cooler air rushes in to take its place.', dyk: 'The fastest winds on Earth whirl inside tornadoes!' },
        { h: 'Rainbows', pic: 'sky|@rainbow 100 92 1.6|@sun 30 26 1|@rain 170 26 0.9', t: 'A rainbow appears when the sun shines through raindrops.', m: 'Its colours are red, orange, yellow, green, blue, indigo and violet.', b: 'Raindrops bend sunlight and split it into its colours.', dyk: 'From a plane you can sometimes see a rainbow as a whole circle!' },
        { h: 'Four seasons', pic: 'sky|🌷 35 70 30 grow|☀️ 80 66 30 spin|🍂 125 66 30 fall|⛄ 168 70 32 bob', t: 'The four seasons are spring, summer, autumn and winter.', m: 'Flowers grow in spring, it\'s hot in summer, leaves fall in autumn and it\'s cold in winter.', b: 'We have seasons because the Earth is tilted as it travels around the Sun.', dyk: 'When it is summer in England, it is winter in Australia!' }
      ],
      quiz: [
        { k: 'order', q: 'Put the seasons in order, starting with spring.', cycle: true, items: [['🌷', 'spring'], ['☀️', 'summer'], ['🍂', 'autumn'], ['⛄', 'winter']], hint: 'After spring comes the hottest season.' },
        { k: 'pic', q: 'What do you need on a rainy day?', o: [['☂️', 'umbrella'], ['🕶️', 'sunglasses'], ['🩳', 'shorts']], a: 0 },
        { k: 'tf', q: 'Clouds are made of tiny drops of water.', pic: 'sky|@cloud 100 50 2 drift', a: true, why: 'Clouds are millions of tiny water drops floating in the air.',
          h: { k: 'tf', q: 'It is summer everywhere on Earth at the same time.', pic: 'space|@earth 100 60 3 spin-slow', a: false, why: 'When it is summer in the north, it is winter in the south.' } },
        { k: 'sort', q: 'Hot day or cold day?', g: [['☀️', 'Hot day'], ['❄️', 'Cold day']], items: [['🍦', 'ice cream', 0], ['🧣', 'scarf', 1], ['🩳', 'shorts', 0], ['🧤', 'gloves', 1], ['🏖️', 'beach', 0], ['⛄', 'snowman', 1]] },
        { k: 'pic', q: 'Which weather can make a rainbow?', o: [['🌦️', 'sun and rain'], ['🌙', 'night'], ['🌫️', 'fog']], a: 0, why: 'You need sunshine and raindrops together.' }
      ] },
    { id: 'space', ico: '🪐', name: 'Day, night & space', c: '#2B2F77', badge: '🚀', bname: 'Space explorer',
      cards: [
        { h: 'The Sun is a star', pic: 'space|@sun 100 60 2.6|@earth 176 96 0.7', t: 'The Sun is a star. It gives us light and warmth.', m: 'It looks small because it is very far away. Never look straight at it!', b: 'The Sun is about 150 million km away. Its light takes about 8 minutes to reach us.', dyk: 'About a million Earths could fit inside the Sun!' },
        { h: 'Day and night', pic: 'space|@sun 30 60 1.6|@earth 130 60 2.6 spin-slow|@moon 180 30 0.8', t: 'The Earth spins around. When your side faces the Sun, it is day.', m: 'When your side turns away from the Sun, it is night.', b: 'The Earth spins round once every 24 hours: that is one day.', dyk: 'The Earth spins faster than a jet plane flies, but we don\'t feel it!' },
        { h: 'The Moon', pic: 'night|@moon 100 46 2.2|@stars 100 50 1.6', t: 'The Moon goes around the Earth. It shines because sunlight bounces off it.', m: 'The Moon seems to change shape. These shapes are called phases.', b: 'It takes about a month (29.5 days) to see all the Moon\'s phases.', dyk: 'Footprints on the Moon can last millions of years: there is no wind to blow them away!' },
        { h: 'Eight planets', pic: 'space|@sun 6 60 2.2|@mercury 40 60 1|@venus 58 60 1|@earth 78 60 1|@mars 98 60 1|@jupiter 124 60 1|@saturn 156 60 0.9|@uranus 180 60 0.6|@neptune 194 60 0.6', t: 'Eight planets travel around the Sun. Earth is one of them!', m: 'In order: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.', b: 'The four inner planets are rocky. The four outer ones are giants of gas and ice.', dyk: 'Jupiter is so big that all the other planets could fit inside it!' },
        { h: 'Stars at night', pic: 'night|@stars 100 40 2.4|🔭 60 84 30|🧒 100 86 30', t: 'Stars are giant balls of hot, glowing gas, very far away.', m: 'People join stars into pictures called constellations.', b: 'Light from some stars travels for thousands of years before it reaches us.', dyk: 'There are more stars in space than grains of sand on all of Earth\'s beaches!' },
        { h: 'Astronauts', pic: 'space|🚀 60 70 40 bob|🧑‍🚀 140 50 36 float|@earth 170 100 1', t: 'Astronauts fly in rockets up to space.', m: 'In space they float about, because they are falling around the Earth.', b: 'The International Space Station goes around the Earth about 16 times a day.', dyk: 'Astronauts grow a little taller in space!' }
      ],
      quiz: [
        { k: 'pic', q: 'Which one is a star?', o: [['☀️', 'the Sun'], ['🌍', 'Earth'], ['🌙', 'the Moon']], a: 0, why: 'The Sun is our star.' },
        { k: 'tf', q: 'The Moon makes its own light.', pic: 'night|@moon 100 56 2.4', a: false, why: 'The Moon shines because sunlight bounces off it.' },
        { k: 'order', q: 'Put these planets in order, closest to the Sun first.', items: [['@mercury', 'Mercury'], ['@venus', 'Venus'], ['@earth', 'Earth'], ['@mars', 'Mars']], hint: 'Earth is the third planet.',
          h: { k: 'order', q: 'Put these planets in order, closest to the Sun first.', items: [['@mars', 'Mars'], ['@jupiter', 'Jupiter'], ['@saturn', 'Saturn'], ['@neptune', 'Neptune']], hint: 'Mars is the fourth planet and Neptune the farthest.' } },
        { k: 'sort', q: 'Day or night?', g: [['☀️', 'Day'], ['🌙', 'Night']], items: [['🌟', 'stars', 1], ['🌈', 'rainbow', 0], ['🦇', 'bat flying', 1], ['🐓', 'rooster crowing', 0], ['🦉', 'owl hunting', 1], ['🌻', 'sunflower open', 0]] },
        { k: 'pic', q: 'Which planet do we live on?', o: [['@earth', 'Earth'], ['@mars', 'Mars'], ['@saturn', 'Saturn']], a: 0,
          h: { k: 'pic', q: 'Which planet has big, beautiful rings?', o: [['@saturn', 'Saturn'], ['@mars', 'Mars'], ['@earth', 'Earth']], a: 0, why: 'Saturn\'s rings are made of ice and rock.' } }
      ] },
    { id: 'water', ico: '💧', name: 'The water cycle', c: '#1D6FA5', badge: '💧', bname: 'Water wizard',
      cards: [
        { h: 'Water goes round and round', pic: 'sea|@sun 30 24 1|@evap 70 40 1.2|@cloud 130 22 1.1|@rain 170 24 0.8|@cycle 100 86 1.2', t: 'Water is in oceans, rivers, clouds and even in you!', m: 'The same water goes round and round. This is the water cycle.', b: 'There is about the same amount of water on Earth now as long ago; it just keeps moving.', dyk: 'The water you drink might once have been drunk by a dinosaur!' },
        { h: 'Up it goes: evaporation', pic: 'sea|@sun 40 24 1.3|@evap 90 54 1.6|@evap 140 54 1.4|@arrowU 175 40 1', t: 'The Sun warms water, and some of it floats up as invisible vapour.', m: 'This is called evaporation. It is why puddles dry up.', b: 'Water vapour is water as a gas.', dyk: 'Wet washing dries on a line because of evaporation!' },
        { h: 'Clouds form: condensation', pic: 'sky|@cloud 70 34 1.4 drift|@cloud 140 40 1.2 drift|@evap 100 84 1.2', t: 'High up, the vapour cools and makes tiny drops. They form clouds.', m: 'This is condensation. You can see it on a cold window too!', b: 'Cooling turns a gas back into a liquid.', dyk: 'Your breath makes a cloud on a cold day for the same reason!' },
        { h: 'Down it comes: rain', pic: 'rain|@rain 60 26 1.3|@rain 140 22 1.2|❄️ 100 70 20 fall', t: 'When cloud drops join and get heavy, they fall as rain or snow.', m: 'This is called precipitation.', b: 'Rain, snow, sleet and hail are all kinds of precipitation.', dyk: 'Raindrops are shaped more like little buns than teardrops!' },
        { h: 'Back to the sea', pic: 'sky|⛰️ 40 70 50|@arrowR 90 88 1|@waves 160 96 0.8|🏞️ 110 70 24', t: 'Rain runs into rivers, lakes and the sea, and the cycle starts again.', m: 'Some water soaks into the ground for plants to drink.', b: 'Water stored under the ground is called groundwater.', dyk: 'Most of Earth\'s water is salty sea water!' },
        { h: 'Ice, water, steam', pic: 'inside|@ice 50 64 1.6|@drop 100 64 1.6|@steam 150 72 1.6', t: 'Water can be solid ice, runny liquid, or steam.', m: 'Freeze it and it turns to ice. Heat it and it turns to steam.', b: 'Water freezes at 0°C and boils at 100°C.', dyk: 'Ice floats because it is lighter than the same amount of water!' }
      ],
      quiz: [
        { k: 'order', q: 'Put the water cycle in order.', cycle: true, items: [['@evap', 'water rises'], ['☁️', 'clouds form'], ['🌧️', 'rain falls'], ['🌊', 'water collects']], hint: 'First the Sun warms the water and it rises.' },
        { k: 'tf', q: 'Puddles dry up because the Sun warms the water.', pic: 'sky|@sun 60 30 1.3|@evap 120 80 1.2', a: true, why: 'The water evaporates into the air.',
          h: { k: 'tf', q: 'Water boils at 50°C.', pic: 'inside|@steam 100 50 2|@thermo 150 60 1.4', a: false, why: 'Water boils at 100°C.' } },
        { k: 'pic', q: 'Which one is solid water?', o: [['🧊', 'ice'], ['💧', 'water drop'], ['@steam', 'steam']], a: 0, why: 'Ice is frozen, solid water.' },
        { k: 'sort', q: 'Liquid or solid?', g: [['💧', 'Liquid (runny)'], ['🧱', 'Solid']], items: [['🥛', 'milk', 0], ['🪨', 'rock', 1], ['🧃', 'juice', 0], ['🧊', 'ice', 1], ['🍯', 'honey', 0], ['🥄', 'spoon', 1]] },
        { k: 'pic', q: 'What are clouds made of?', o: [['💧', 'tiny water drops'], ['🐑', 'sheep\'s wool'], ['💨', 'smoke']], a: 0 }
      ] },
    { id: 'materials', ico: '🧱', name: 'Materials', c: '#6A5A16', badge: '🧲', bname: 'Material master',
      cards: [
        { h: 'Things are made of materials', pic: 'inside|🪵 36 64 32|🥄 80 64 30|🧸 124 64 32|🪟 168 60 34', t: 'Everything is made of materials, like wood, metal, plastic, glass and fabric.', m: 'We choose a material that is right for the job.', b: 'Properties tell us what a material is like: hard, soft, bendy, waterproof or see-through.', dyk: 'Glass is made from sand heated until it melts!' },
        { h: 'Float or sink', pic: 'sea|🦆 60 48 30 bob|🪨 140 96 26|@arrowD 140 70 0.8', t: 'Some things float on water. Others sink to the bottom.', m: 'Things that are heavy for their size sink. Light-for-their-size things float.', b: 'Floating depends on density: how much stuff is packed into a space.', dyk: 'A huge metal ship floats because its shape pushes away lots of water!' },
        { h: 'Magnets', pic: 'lab|@magnet 70 50 1.8 wiggle|📎 130 50 24 bob|🧷 160 70 22 bob 0.3', t: 'Magnets pull some metals, like iron and steel.', m: 'They do not pull wood, plastic or paper, and not even all metals!', b: 'A magnet has a north pole and a south pole. Opposite poles pull together; the same poles push apart.', dyk: 'The Earth is a giant magnet! That is why a compass points north.' },
        { h: 'Hard and soft', pic: 'inside|🪨 60 64 40|🛏️ 140 64 44 bob', t: 'Some things are hard, like a rock. Some are soft, like a pillow.', m: 'Hard things keep their shape. Soft things squash.', b: 'Diamond is the hardest natural material on Earth.', dyk: 'A diamond is made of the same stuff as pencil lead: carbon!' },
        { h: 'See-through', pic: 'sky|🪟 70 56 50|🧱 150 60 40', t: 'You can see through glass. It is transparent.', m: 'Wood and bricks block light. They are opaque.', b: 'Things that let some light through, like tissue paper, are translucent.', dyk: 'Some frogs have see-through skin on their tummies!' },
        { h: 'Waterproof', pic: 'rain|@rain 100 20 1.3|🧥 70 76 36|👢 130 82 30', t: 'Waterproof materials keep water out, like a raincoat or wellies.', m: 'Paper and cotton soak water up. They are absorbent.', b: 'Many waterproof materials are plastic or rubber, or have a wax coating.', dyk: 'Ducks keep dry because their feathers have a waterproof oil!' }
      ],
      quiz: [
        { k: 'sort', q: 'Hard or soft?', g: [['🪨', 'Hard'], ['🧸', 'Soft']], items: [['🧱', 'brick', 0], ['🪶', 'feather', 1], ['🔨', 'hammer', 0], ['🧽', 'sponge', 1], ['🥄', 'spoon', 0], ['🧦', 'sock', 1]] },
        { k: 'pic', q: 'Which one will a magnet pick up?', o: [['📎', 'paper clip'], ['✏️', 'pencil'], ['🧸', 'teddy']], a: 0, why: 'Paper clips are made of steel.' },
        { k: 'tf', q: 'A rock floats on water.', pic: 'sea|🪨 100 92 34', a: false, why: 'A rock is heavy for its size, so it sinks.',
          h: { k: 'tf', q: 'All metals stick to magnets.', pic: 'lab|@magnet 60 50 1.6|🪙 130 60 30', a: false, why: 'Only some metals, like iron and steel. Aluminium cans and gold do not stick.' } },
        { k: 'pic', q: 'Which one can you see through?', o: [['🪟', 'glass window'], ['🧱', 'brick'], ['🪵', 'wood']], a: 0, why: 'Glass is transparent.' },
        { k: 'order', q: 'Put them in order, lightest to heaviest.', items: [['🪶', 'feather'], ['🍎', 'apple'], ['📚', 'books'], ['🚗', 'car']], hint: 'Which one could a breath blow away?' }
      ] },
    { id: 'forces', ico: '🛝', name: 'Push & pull', c: '#B4462B', badge: '🎢', bname: 'Force finder',
      cards: [
        { h: 'Pushes and pulls', pic: 'grass|🛒 60 70 40 swim|👉 22 70 24|🪁 150 34 30 sway', t: 'A force is a push or a pull.', m: 'You push a swing and pull a door open.', b: 'Forces can start things moving, stop them, and change their speed, direction or shape.', dyk: 'When you sit still, the chair is pushing up on you!' },
        { h: 'Gravity', pic: 'sky|🍎 100 26 28 fall|🌳 40 66 50|@arrowD 140 60 1', t: 'Gravity pulls everything down towards the ground.', m: 'That is why a ball falls when you drop it.', b: 'Gravity also keeps the Moon going around the Earth.', dyk: 'On the Moon, gravity is weaker, so you could jump about 6 times higher!' },
        { h: 'Friction', pic: 'grass|⚽ 50 88 26 swim|🧊 150 92 26', t: 'Friction slows things down when they rub together.', m: 'A ball rolls further on a smooth floor than on grass or carpet.', b: 'Friction makes heat: rub your hands together fast and feel!', dyk: 'Ice is slippery because there is very little friction!' },
        { h: 'Ramps and wheels', pic: 'grass|@ramp 90 82 1.6|🚗 70 60 24 swim|🛞 160 80 24 spin', t: 'Things roll faster down a steep ramp.', m: 'Wheels make moving heavy things much easier.', b: 'Ramps, levers and wheels are simple machines: they make work easier.', dyk: 'The wheel was invented over 5,000 years ago!' },
        { h: 'Floating in the air', pic: 'sky|🎈 70 40 30 float|🪂 140 36 30 float 0.5', t: 'Air pushes back on things that move through it.', m: 'A parachute catches lots of air, so it falls slowly.', b: 'The push of air on moving things is called air resistance.', dyk: 'A feather and a hammer fall at the same speed on the Moon, where there is no air!' }
      ],
      quiz: [
        { k: 'sort', q: 'Is it a push or a pull?', g: [['👉', 'Push'], ['🪝', 'Pull']], items: [['⚽', 'kicking a ball', 0], ['🪁', 'flying a kite', 1], ['🛒', 'moving a trolley', 0], ['🧦', 'putting on socks', 1], ['🔔', 'pressing a doorbell', 0], ['🚪', 'opening a fridge', 1]] },
        { k: 'tf', q: 'Gravity pulls things up into the sky.', pic: 'sky|🍎 100 40 30 fall|@arrowD 140 60 1', a: false, why: 'Gravity pulls things down towards the ground.',
          h: { k: 'tf', q: 'On the Moon you could jump higher than on Earth.', pic: 'space|@moon 60 60 2|🧑‍🚀 130 50 36 bob', a: true, why: 'The Moon\'s gravity is weaker, so it pulls you down less.' } },
        { k: 'pic', q: 'On which would a sliding toy go furthest?', o: [['🧊', 'ice'], ['🌾', 'long grass'], ['🏖️', 'sand']], a: 0, why: 'Ice has the least friction.' },
        { k: 'order', q: 'Put them in order, slowest to fastest.', items: [['🐌', 'snail'], ['🚶', 'walking'], ['🚲', 'bike'], ['🚀', 'rocket']], hint: 'Which one is super slow?' },
        { k: 'pic', q: 'What makes a ball fall down?', o: [['🌍', 'gravity'], ['💨', 'wind'], ['🧲', 'a magnet']], a: 0, why: 'The Earth\'s gravity pulls it down.' }
      ] },
    { id: 'light', ico: '🔦', name: 'Light & shadow', c: '#7A5A00', badge: '🔦', bname: 'Shadow catcher',
      cards: [
        { h: 'Where light comes from', pic: 'night|@sun 40 40 1.1|💡 90 50 30 pulse|🕯️ 130 70 26|🔦 170 70 26', t: 'Light comes from the Sun, lamps, candles and torches.', m: 'The Moon is not a light source: it reflects the Sun\'s light.', b: 'Things that make their own light are called luminous.', dyk: 'Fireflies make their own light!' },
        { h: 'Shadows', pic: 'grass|@sun 30 26 1.2|🧍 100 70 40|@shadow 136 94 1.6', t: 'A shadow forms when something blocks the light.', m: 'The shadow is on the side away from the light.', b: 'Light travels in straight lines, so it can\'t bend around you.', dyk: 'Your shadow copies every move you make!' },
        { h: 'Long and short shadows', pic: 'dusk|🌅 30 40 26|🌳 100 70 40|@shadow 150 96 2.2', t: 'In the morning and evening, shadows are long. At midday they are short.', m: 'The higher the Sun is, the shorter the shadow.', b: 'Long ago, people told the time with shadow clocks called sundials.', dyk: 'At midday in summer your shadow can hide right under your feet!' },
        { h: 'Mirrors', pic: 'inside|🪞 80 60 50|🧒 140 66 36 wiggle', t: 'Mirrors bounce light back. That is how you see yourself!', m: 'Smooth, shiny things reflect light well.', b: 'In a mirror, your reflection is flipped left to right.', dyk: 'A spoon is a curved mirror: one side shows you upside down!' },
        { h: 'Colours in light', pic: 'sky|@ray 20 30 1|🔺 90 60 30|@rainbow 150 90 0.9', t: 'White light is all the rainbow colours mixed together.', m: 'A prism or a raindrop can split light into colours.', b: 'Different colours of light bend by different amounts, so they spread out.', dyk: 'A soap bubble shows rainbow colours too!' }
      ],
      quiz: [
        { k: 'pic', q: 'Which one gives off its own light?', o: [['💡', 'lamp'], ['🪞', 'mirror'], ['🌙', 'the Moon']], a: 0, why: 'A lamp makes light. Mirrors and the Moon only bounce light.' },
        { k: 'tf', q: 'Shadows are longest at midday.', pic: 'sky|@sun 100 20 1.2|🌳 100 70 40', a: false, why: 'At midday the Sun is high, so shadows are short.' },
        { k: 'sort', q: 'Does it make its own light?', g: [['💡', 'Makes light'], ['🚫', 'No light of its own']], items: [['🕯️', 'candle', 0], ['🌙', 'Moon', 1], ['☀️', 'Sun', 0], ['🪞', 'mirror', 1], ['🔦', 'torch', 0], ['📘', 'book', 1]] },
        { k: 'order', q: 'Put the day in order.', cycle: true, items: [['🌅', 'sunrise'], ['☀️', 'midday'], ['🌇', 'sunset'], ['🌙', 'night']], hint: 'The day begins when the Sun comes up.' },
        { k: 'pic', q: 'Which one makes a dark shadow?', o: [['🧍', 'a person'], ['🪟', 'a clear window'], ['💧', 'clear water']], a: 0, why: 'A person blocks the light. Clear things let it through.' }
      ] },
    { id: 'sound', ico: '🔊', name: 'Sound', c: '#6D3FB8', badge: '🎵', bname: 'Sound detective',
      cards: [
        { h: 'Sounds are vibrations', pic: 'inside|🥁 80 64 40|@vibe 80 64 1.6|@sound 110 60 1.4', t: 'Sounds are made when things shake very fast. This is vibrating.', m: 'Touch your throat and hum: you can feel it buzz!', b: 'Vibrations travel through the air as sound waves to your ears.', dyk: 'A cat\'s purr is a vibration in its throat!' },
        { h: 'Loud and quiet', pic: 'inside|📢 60 60 40 wiggle|@sound 86 60 1.6|🐭 160 80 24', t: 'Some sounds are loud, like a drum. Some are quiet, like a whisper.', m: 'Very loud sounds can hurt your ears. Cover them or move away.', b: 'Loudness is measured in decibels (dB).', dyk: 'A blue whale\'s call is louder than a jet engine!' },
        { h: 'High and low', pic: 'grass|🐦 60 40 30 fly|🐻 140 74 40', t: 'Some sounds are high, like a bird\'s tweet. Some are low, like a bear\'s growl.', m: 'Small things that vibrate fast make high sounds.', b: 'How high or low a sound is is called its pitch.', dyk: 'Dogs can hear sounds too high for people to hear!' },
        { h: 'Hearing', pic: 'inside|👂 70 60 50|@sound 110 60 1.4', t: 'Your ears catch sounds and send messages to your brain.', m: 'Sounds get quieter the further away you are.', b: 'Sound needs something to travel through, so space is silent!', dyk: 'Elephants can hear through their feet!' },
        { h: 'Echoes', pic: 'sky|⛰️ 150 66 70|🗣️ 40 70 34|@sound 66 64 1.2', t: 'An echo is a sound that bounces back to you.', m: 'Shout in a big empty hall or a tunnel to hear one!', b: 'Bats and dolphins use echoes to find their food. This is echolocation.', dyk: 'Sound travels about 1 km in 3 seconds in air!' }
      ],
      quiz: [
        { k: 'sort', q: 'Loud or quiet?', g: [['📢', 'Loud'], ['🤫', 'Quiet']], items: [['🥁', 'big drum', 0], ['🐭', 'mouse squeak', 1], ['🚒', 'fire engine', 0], ['🍃', 'rustling leaf', 1], ['✈️', 'jet plane', 0], ['🐱', 'cat purring', 1]] },
        { k: 'order', q: 'Put them in order, quietest to loudest.', items: [['🤫', 'whisper'], ['🗣️', 'talking'], ['🎺', 'trumpet'], ['🚀', 'rocket']], hint: 'Start with the softest sound.' },
        { k: 'tf', q: 'Sound is made by things vibrating.', pic: 'inside|🥁 100 64 40|@vibe 100 64 1.6', a: true, why: 'Things shake back and forth very fast to make sound.',
          h: { k: 'tf', q: 'Sound can travel through empty space.', pic: 'space|🧑‍🚀 100 60 40 float', a: false, why: 'Sound needs air, water or something solid to travel through. Space is silent.' } },
        { k: 'pic', q: 'Which makes a high sound?', o: [['🐦', 'little bird tweet'], ['🥁', 'big drum'], ['🐄', 'cow moo']], a: 0, why: 'Small things vibrate fast and make high sounds.' },
        { k: 'pic', q: 'What do we hear with?', o: [['👂', 'ears'], ['👃', 'nose'], ['✋', 'hands']], a: 0,
          h: { k: 'pic', q: 'What is a sound that bounces back called?', o: [['⛰️', 'an echo'], ['🤫', 'a whisper'], ['🎵', 'a tune']], a: 0, why: 'Sound bouncing off a wall or cliff is an echo.' } }
      ] },
    { id: 'dinos', ico: '🦕', name: 'Dinosaurs', c: '#4E7A1E', badge: '🦴', bname: 'Dino digger',
      cards: [
        { h: 'Long, long ago', pic: 'jungle|🦕 70 62 50 bob|🦖 150 66 44|🌋 30 40 30', t: 'Dinosaurs lived a very, very long time ago, long before people.', m: 'The last big dinosaurs lived about 66 million years ago.', b: 'Scientists think a giant space rock hit Earth and changed the climate.', dyk: 'Birds are living relatives of dinosaurs!' },
        { h: 'Fossils', pic: 'desert|@bury 70 80 1.8|⛏️ 140 60 30 wiggle|@footprint 170 96 0.8', t: 'We know about dinosaurs from fossils: bones and footprints turned to stone.', m: 'Scientists who dig up fossils are called palaeontologists.', b: 'Fossils form when remains are buried and slowly turn to rock over millions of years.', dyk: 'Some fossil footprints show dinosaurs walking in herds!' },
        { h: 'Plant eaters', pic: 'jungle|🦕 90 60 56 bob|🌴 160 56 50', t: 'Some dinosaurs ate only plants, like the long-necked Diplodocus.', m: 'Long necks could reach leaves high in the trees.', b: 'Animals that eat only plants are called herbivores.', dyk: 'Some long-necked dinosaurs were as long as three buses!' },
        { h: 'Meat eaters', pic: 'jungle|🦖 100 60 60 wiggle', t: 'T. rex was a big meat eater with sharp teeth.', m: 'Its biggest teeth were as long as bananas!', b: 'Animals that eat meat are called carnivores.', dyk: 'T. rex had tiny arms, but they were very strong!' },
        { h: 'Big and small', pic: 'jungle|🦕 70 56 64|🐔 160 84 24 bob', t: 'Some dinosaurs were as big as buildings. Some were as small as chickens!', m: 'Many small dinosaurs were fast runners.', b: 'Some dinosaurs had feathers, a clue that birds came from them.', dyk: 'Dinosaur eggs could be as big as a football!' }
      ],
      quiz: [
        { k: 'pic', q: 'How do we know about dinosaurs?', o: [['🦴', 'from fossils'], ['📺', 'from TV'], ['📷', 'from old photos']], a: 0, why: 'Fossils are bones and footprints turned to stone.' },
        { k: 'tf', q: 'People and dinosaurs lived at the same time.', pic: 'jungle|🦕 70 60 44|🧑 150 66 36', a: false, why: 'Dinosaurs lived millions of years before people.' },
        { k: 'sort', q: 'Plant eater or meat eater?', g: [['🌿', 'Plants'], ['🍖', 'Meat']], items: [['🦕', 'Diplodocus', 0], ['🦖', 'T. rex', 1], ['🐄', 'cow', 0], ['🦁', 'lion', 1], ['🐰', 'rabbit', 0], ['🦈', 'shark', 1]] },
        { k: 'order', q: 'How does a fossil form? Put it in order.', items: [['🦕', 'a dinosaur lives'], ['@bury', 'buried in mud'], ['🪨', 'turns to stone'], ['⛏️', 'dug up today']], hint: 'First the dinosaur was alive.' },
        { k: 'pic', q: 'Which animal is a relative of dinosaurs?', o: [['🐦', 'bird'], ['🐱', 'cat'], ['🐟', 'fish']], a: 0, why: 'Birds came from small feathered dinosaurs.' }
      ] },
    { id: 'ocean', ico: '🌊', name: 'The ocean', c: '#0E6E8C', badge: '🐚', bname: 'Ocean explorer',
      cards: [
        { h: 'The big blue sea', pic: 'sea|@sun 30 22 1|⛵ 140 46 26 bob|@waves 100 70 1.2|🐳 70 96 30 swim', t: 'Oceans cover most of the Earth. The water is salty.', m: 'There are five oceans. The Pacific is the biggest.', b: 'About 70 out of every 100 parts of Earth\'s surface are ocean.', dyk: 'We have explored more of the Moon than of the deep sea!' },
        { h: 'Fish', pic: 'under|🐠 60 50 30 swim|🐟 130 70 28 swim 0.5|🐡 100 92 22 bob', t: 'Fish breathe underwater with gills.', m: 'They swim by wiggling their tails and fins.', b: 'Gills take oxygen out of the water.', dyk: 'A seahorse dad carries the babies in a pouch!' },
        { h: 'Whales and dolphins', pic: 'sea|🐋 70 80 50 bob|🐬 150 64 30 swim', t: 'Whales and dolphins live in the sea, but they breathe air.', m: 'They come up to breathe through a blowhole on top of their head.', b: 'They are mammals: they feed their babies milk.', dyk: 'The blue whale is the biggest animal that has ever lived!' },
        { h: 'Coral reefs', pic: 'under|@coral 60 88 1.6|@coral 150 90 1.3|🐠 100 50 24 swim|🐢 160 40 26 swim', t: 'Coral reefs are colourful homes for lots of sea creatures.', m: 'Coral is made by tiny animals living together.', b: 'Reefs need clean, warm, shallow water to stay healthy.', dyk: 'The Great Barrier Reef can be seen from space!' },
        { h: 'The deep sea', pic: 'deep|🦑 80 60 40 float|✨ 140 40 16 pulse|✨ 160 70 14 pulse 0.5|🐙 150 96 24', t: 'Deep down, the ocean is dark and very cold.', m: 'Some deep-sea animals make their own light!', b: 'Living things making light is called bioluminescence.', dyk: 'An octopus has three hearts!' }
      ],
      quiz: [
        { k: 'pic', q: 'Which sea animal breathes air?', o: [['🐳', 'whale'], ['🐟', 'fish'], ['🦀', 'crab']], a: 0, why: 'Whales come up to breathe through a blowhole.' },
        { k: 'tf', q: 'Sea water is salty.', pic: 'sea|@waves 100 70 1.2|🧂 150 30 26', a: true, why: 'The sea has salt in it, so we can\'t drink it.',
          h: { k: 'tf', q: 'Whales are fish.', pic: 'sea|🐋 100 80 50 bob', a: false, why: 'Whales are mammals: they breathe air and feed their babies milk.' } },
        { k: 'sort', q: 'In the sea or on land?', g: [['🌊', 'Sea'], ['🌳', 'Land']], items: [['🐙', 'octopus', 0], ['🐪', 'camel', 1], ['🦈', 'shark', 0], ['🐎', 'horse', 1], ['🐬', 'dolphin', 0], ['🐿️', 'squirrel', 1]] },
        { k: 'order', q: 'Put them in order, smallest to biggest.', items: [['🦐', 'shrimp'], ['🐠', 'fish'], ['🐬', 'dolphin'], ['🐋', 'whale']], hint: 'The biggest animal ever lives in the sea.' },
        { k: 'pic', q: 'Where do lots of colourful fish live?', o: [['@coral', 'coral reef'], ['🏜️', 'desert'], ['🏔️', 'mountain']], a: 0 }
      ] },
    { id: 'earth', ico: '♻️', name: 'Caring for Earth', c: '#2E7D32', badge: '🌍', bname: 'Earth hero',
      cards: [
        { h: 'Reduce, reuse, recycle', pic: 'earth|@bin 60 70 1.8|🔁 130 50 30 spin-slow|🌍 170 80 26', t: 'Use less, use things again, and recycle what you can.', m: 'Recycling turns old things into new things.', b: 'Recycling saves energy and materials, and means less rubbish goes into the ground.', dyk: 'Old plastic bottles can be made into warm fleece jumpers!' },
        { h: 'Sorting the recycling', pic: 'inside|📰 40 60 28|🥫 80 60 28|🍾 120 60 28|@bin 168 70 1.6', t: 'Paper, cans, glass and some plastics can be recycled.', m: 'Rinse them and put them in the right bin.', b: 'Fruit and vegetable scraps can be composted into rich soil.', dyk: 'A glass bottle can be recycled again and again, forever!' },
        { h: 'Litter hurts animals', pic: 'sea|🐢 70 86 30 swim|🛍️ 130 80 24 float|🚫 130 80 40', t: 'Litter can hurt animals. Always put rubbish in a bin.', m: 'Sea turtles can mistake plastic bags for jellyfish.', b: 'Plastic takes hundreds of years to break down.', dyk: 'Some beaches have clean-up days where families pick up litter together!' },
        { h: 'Save energy', pic: 'inside|💡 60 50 36 pulse|🔌 120 70 28|🌞 170 30 28 spin', t: 'Switch off lights and screens when you are not using them.', m: 'Walk, cycle or share a ride when you can.', b: 'Sun and wind power make electricity without smoke.', dyk: 'Solar panels turn sunlight straight into electricity!' },
        { h: 'Plant trees, help bees', pic: 'grass|🌳 50 64 50 sway|🌼 120 86 24|🐝 140 50 20 fly|🌻 170 76 32 sway', t: 'Trees clean the air. Flowers feed the bees.', m: 'Planting flowers helps bees and butterflies find food.', b: 'Bees pollinate many of the plants we eat.', dyk: 'One tree can be home to hundreds of insects and birds!' }
      ],
      quiz: [
        { k: 'sort', q: 'Recycle it or compost it?', g: [['♻️', 'Recycling bin'], ['🪱', 'Compost']], items: [['🥫', 'can', 0], ['🍌', 'banana peel', 1], ['📰', 'newspaper', 0], ['🍎', 'apple core', 1], ['🍾', 'glass bottle', 0], ['🥚', 'eggshells', 1]] },
        { k: 'tf', q: 'Turning off the light when you leave a room saves energy.', pic: 'inside|💡 100 50 40 pulse', a: true, why: 'Less electricity is used.' },
        { k: 'pic', q: 'Where should litter go?', o: [['🗑️', 'in a bin'], ['🌊', 'in the sea'], ['🌳', 'on the grass']], a: 0 },
        { k: 'order', q: 'How is a can recycled? Put it in order.', items: [['🥫', 'use the can'], ['♻️', 'recycling bin'], ['🏭', 'melted at a factory'], ['🎁', 'made into something new']], hint: 'First you use it.' },
        { k: 'pic', q: 'Which one helps the Earth?', o: [['🌳', 'planting a tree'], ['💡', 'lights on all day'], ['🚰', 'leaving the tap running']], a: 0,
          h: { k: 'pic', q: 'What does "reuse" mean?', o: [['🔁', 'use it again'], ['🗑️', 'throw it away'], ['🛍️', 'buy a new one']], a: 0, why: 'Reuse means using something again, like a jar for pencils.' } }
      ] }
  ];

  const LABS = [
    { id: 'float', ico: '🛁', name: 'Float or sink?', c: '#2776C3', blurb: 'Drop things in the water',
      items: [['🦆', 'rubber duck', 1, 0, 'It is full of air.'], ['🪨', 'stone', 0, 0, 'It is heavy for its size.'], ['🍎', 'apple', 1, 0, 'Apples have air inside.'], ['🔑', 'key', 0, 0, 'Metal is heavy for its size.'],
        ['🍃', 'leaf', 1, 0, 'It is thin and light.'], ['🪙', 'coin', 0, 0, 'It is small but heavy.'], ['🪵', 'wooden block', 1, 1, 'Wood is lighter than water.'], ['🥄', 'metal spoon', 0, 1, 'Metal sinks unless it holds air, like a boat.']] },
    { id: 'magnet', ico: '🧲', name: 'Magnet test', c: '#C44E40', blurb: 'What will stick?',
      items: [['📎', 'paper clip', 1, 0, 'It is made of steel.'], ['✏️', 'pencil', 0, 0, 'Wood and graphite.'], ['🔩', 'nut and bolt', 1, 0, 'They are made of steel.'], ['🧸', 'teddy', 0, 0, 'Fabric and stuffing.'],
        ['🧷', 'safety pin', 1, 0, 'It is made of steel.'], ['🍌', 'banana', 0, 0, ''], ['🥫', 'tin can', 1, 1, 'Food tins are steel inside.'], ['🥤', 'plastic cup', 0, 1, 'Plastic is not magnetic.']] },
    { id: 'plant', ico: '🌱', name: 'Grow a plant', c: '#268457', blurb: 'Water and sunshine',
      stages: [['Seed', '🟤', 'A seed sleeps in the soil.', 'A seed holds a baby plant and its food store.'], ['Roots', '🪢', 'Roots grow down to find water.', 'The seed germinates: roots grow down first.'],
        ['Sprout', '🌱', 'A shoot pushes up into the light!', 'The shoot grows up towards the light.'], ['Leaves', '🌿', 'Leaves open to catch the sunshine.', 'Leaves use sunlight to make food: photosynthesis.'],
        ['Bud', '🌷', 'A flower bud is getting ready.', 'The bud protects the flower while it grows.'], ['Flower', '🌻', 'A beautiful flower! It will make new seeds.', 'The flower is pollinated and makes new seeds.']] },
    { id: 'weather', ico: '🧥', name: 'Dress for the weather', c: '#B4462B', blurb: 'Sun, rain or snow?',
      clothes: [['🧢', 'cap'], ['🕶️', 'sunglasses'], ['👕', 'T-shirt'], ['🩳', 'shorts'], ['🧥', 'coat'], ['🧣', 'scarf'], ['🧤', 'gloves'], ['👢', 'boots'], ['☂️', 'umbrella'], ['🩴', 'flip-flops']],
      days: [
        { name: 'Sunny', ico: '☀️', pic: 'sky|@sun 100 40 2', need: [0, 2, 3], bad: [4, 5, 6], say: 'The sun is hot!', needWhy: 'Keep cool and keep the sun off your head.', badWhy: 'That is too warm for a hot day!' },
        { name: 'Rainy', ico: '🌧️', pic: 'rain|@rain 70 30 1.4|@rain 140 26 1.2', need: [4, 7, 8], bad: [3, 9, 1], say: 'It is pouring with rain!', needWhy: 'You need to stay dry.', badWhy: 'That won\'t keep you dry.' },
        { name: 'Snowy', ico: '❄️', pic: 'snow|@snowfall 70 26 1.4|@snowfall 140 22 1.2|⛄ 100 84 30', need: [4, 5, 6, 7], bad: [3, 9], say: 'Brr, it is snowing!', needWhy: 'Keep warm from head to toe.', badWhy: 'You would be far too cold!' }
      ] },
    { id: 'shadow', ico: '🐰', name: 'Shadow puppets', c: '#7A5A00', blurb: 'Move the sun',
      puppets: [['🐰', 'bunny'], ['🦖', 'dinosaur'], ['🧍', 'me'], ['🌲', 'tree']],
      challenges: [
        { t: 'Make the shadow short. Put the sun high in the sky!', ok: dx => Math.abs(dx) < 30, win: 'Short shadow! When the sun is high, shadows are short.' },
        { t: 'Make a long shadow that points to the left.', ok: dx => dx < -75, win: 'Yes! The sun is low on the right, so the shadow stretches left.' },
        { t: 'Now make a long shadow that points to the right.', ok: dx => dx > 75, win: 'Brilliant! Shadows point away from the light.' }
      ] },
    { id: 'planets', ico: '🪐', name: 'Planet order', c: '#2B2F77', blurb: 'Line them up from the Sun',
      planets: [['mercury', 'Mercury'], ['venus', 'Venus'], ['earth', 'Earth'], ['mars', 'Mars'], ['jupiter', 'Jupiter'], ['saturn', 'Saturn'], ['uranus', 'Uranus'], ['neptune', 'Neptune']] }
  ];

  const HOME = [
    { id: 'rainbow', ico: '🌈', name: 'Make a rainbow', pic: 'sky|@sun 30 26 1.2|@glass 100 70 1.6|@rainbow 160 100 0.8', intro: 'Catch sunlight in a glass of water and make your own rainbow!',
      need: ['a clear glass of water', 'a sunny window', 'a sheet of white paper'], steps: ['Fill the glass with water.', 'Stand it on a sunny window sill.', 'Put the white paper on the floor below.', 'Move the paper until a rainbow appears!'],
      why: 'The water bends the sunlight and splits it into its colours, just like raindrops do.', why2: 'Water refracts (bends) light. Each colour bends a different amount, so white light spreads into a spectrum.' },
    { id: 'floattub', ico: '🛁', name: 'Float or sink tub', pic: 'sea|🦆 60 46 28 bob|🍎 110 48 24 bob|🔑 150 96 22', intro: 'Test toys and kitchen things in a tub of water.',
      need: ['a washing-up bowl of water', 'a towel', 'small things to test: a cork, a spoon, an apple, a toy'], steps: ['Put the bowl on a towel.', 'Pick a thing and guess: float or sink?', 'Gently put it in the water.', 'Sort your things into two piles: floaters and sinkers.'],
      safety: 'Stay with young children near water, even a small bowl.', why: 'Things that are light for their size float. Heavy-for-their-size things sink.' },
    { id: 'bean', ico: '🫘', name: 'Grow a bean in a jar', pic: 'sky|@glass 100 70 1.8|🌱 100 44 28 grow', intro: 'Watch roots and a shoot grow, day by day!',
      need: ['a clear jar', 'kitchen paper or cotton wool', 'a dried bean (like a broad bean)', 'water'], steps: ['Line the jar with damp kitchen paper.', 'Push the bean between the paper and the glass.', 'Keep the paper damp, not flooded.', 'Look every day. Draw what you see!'],
      why: 'The bean uses its own food store to grow roots down and a shoot up towards the light.', why2: 'This is germination. Roots grow down because of gravity; the shoot grows towards light.' },
    { id: 'cloudjar', ico: '🌧️', name: 'Rain cloud in a jar', pic: 'sky|@glass 100 70 2|@cloud 100 40 1|@drop 100 82 0.6', intro: 'Make it rain inside a jar!',
      need: ['a jar of water', 'shaving foam', 'blue food colouring', 'a dropper or teaspoon'], steps: ['Fill the jar three quarters with water.', 'Squirt a "cloud" of shaving foam on top.', 'Drip blue colouring onto the cloud.', 'Watch: when the cloud is full, it "rains"!'],
      safety: 'A grown-up should handle the shaving foam. Keep it away from eyes and mouths.', why: 'Like a real cloud, the foam can only hold so much water before it falls as rain.' },
    { id: 'raisins', ico: '🍇', name: 'Dancing raisins', pic: 'inside|@glass 100 70 2|🍇 92 80 12 bob|🍇 108 70 12 bob 0.5', intro: 'Make raisins dance up and down in a glass!',
      need: ['a clear glass', 'fizzy water', 'a few raisins'], steps: ['Pour fizzy water into the glass.', 'Drop in 5 raisins.', 'Watch them sink... then rise... then sink again!'],
      why: 'Bubbles stick to the raisins and lift them up. At the top the bubbles pop and the raisins sink.', why2: 'Carbon dioxide bubbles make the raisins less dense, so they float; when the gas escapes they sink again.' },
    { id: 'volcano', ico: '🌋', name: 'Fizzy volcano', pic: 'desert|🌋 100 64 56|✨ 100 26 20 pulse', intro: 'Make a fizzing, foaming volcano!',
      need: ['a small cup or bottle', 'a tray', '2 spoons of baking soda', 'vinegar', 'a drop of washing-up liquid', 'red food colouring'], steps: ['Stand the cup on a tray.', 'Put in the baking soda, washing-up liquid and colouring.', 'A grown-up pours in some vinegar.', 'Stand back and watch it erupt!'],
      safety: 'A grown-up pours the vinegar. Keep it away from eyes, and wash hands afterwards.', why: 'Baking soda and vinegar react and make lots of gas bubbles.', why2: 'An acid (vinegar) and a base (baking soda) react to make carbon dioxide gas: a chemical reaction.' },
    { id: 'walkwater', ico: '🌈', name: 'Walking water', pic: 'inside|@glass 50 70 1.4|@glass 100 70 1.4|@glass 150 70 1.4', intro: 'Watch coloured water climb up paper and mix!',
      need: ['3 clear cups', 'kitchen paper', 'water', 'red and blue food colouring'], steps: ['Put the cups in a row.', 'Fill the two end cups with water. Colour one red, one blue.', 'Fold two strips of kitchen paper into bridges between the cups.', 'Wait an hour. What colour is the middle cup?'],
      why: 'Water climbs up through tiny gaps in the paper and mixes in the middle cup, making purple!', why2: 'This is capillary action: water creeps along tiny spaces in the paper fibres.' },
    { id: 'maghunt', ico: '🧲', name: 'Magnet hunt', pic: 'inside|@magnet 70 50 1.8 wiggle|🥄 130 70 26|🧸 170 70 26', intro: 'Go on a hunt for magnetic things around your home.',
      need: ['a fridge magnet', 'a paper and pencil'], steps: ['Make two columns: sticks and does not stick.', 'Touch the magnet to things around the house.', 'Write or draw each thing in the right column.', 'Which materials stick?'],
      safety: 'Keep magnets away from phones, computers and bank cards, and never put small magnets in your mouth.', why: 'Only things with iron or steel in them stick to a magnet.' },
    { id: 'shadowtrace', ico: '🌞', name: 'Shadow tracing', pic: 'grass|@sun 30 24 1.1|🧸 100 74 34|@shadow 140 94 1.6', intro: 'Trace a toy\'s shadow in the morning and afternoon.',
      need: ['a toy', 'paper', 'a pencil or chalk', 'a sunny day'], steps: ['Stand the toy on paper outside in the morning.', 'Trace around its shadow.', 'Come back after lunch and trace it again.', 'Has the shadow moved? Is it longer or shorter?'],
      safety: 'Never look straight at the Sun.', why: 'As the Sun moves across the sky, the shadow moves and changes length.' },
    { id: 'stringphone', ico: '📞', name: 'String telephone', pic: 'inside|🥤 40 60 30|🥤 160 60 30|@sound 70 60 1', intro: 'Talk to a friend through a string!',
      need: ['2 paper cups', 'a long piece of string', 'a sharp pencil'], steps: ['A grown-up pokes a small hole in the bottom of each cup.', 'Thread the string through and tie a knot inside.', 'Walk apart until the string is tight.', 'Whisper into one cup while your friend listens!'],
      safety: 'A grown-up makes the holes with the sharp pencil.', why: 'Your voice makes the string vibrate, and the vibrations carry the sound to the other cup.' },
    { id: 'icemelt', ico: '🧊', name: 'Ice melt race', pic: 'inside|@ice 60 70 1.6|@ice 140 70 1.6|🧂 100 40 24', intro: 'Which ice cube melts fastest?',
      need: ['4 ice cubes', '4 plates', 'salt', 'sugar', 'a timer'], steps: ['Put one ice cube on each plate.', 'Sprinkle salt on one, sugar on one, put one in the sun, and leave one alone.', 'Guess which will melt first.', 'Check every 5 minutes!'],
      why: 'Salt and warmth make ice melt faster. That\'s why salt is put on icy roads.', why2: 'Salt lowers the temperature at which water freezes, so the ice melts even below 0°C.' },
    { id: 'balloon', ico: '🎈', name: 'Static balloon', pic: 'inside|🎈 90 40 34 float|🧒 140 74 34', intro: 'Make your hair stand up with a balloon!',
      need: ['a balloon', 'your hair or a woolly jumper', 'tiny bits of paper'], steps: ['Blow up the balloon and tie it.', 'Rub it on your hair for 10 seconds.', 'Lift it slowly: does your hair follow?', 'Hold it over the paper bits. Do they jump up?'],
      safety: 'A grown-up blows up the balloon. Pieces of burst balloon are a choking danger, so tidy them away.', why: 'Rubbing gives the balloon a charge of static electricity, which pulls on light things.' }
  ];
  return { TOPICS, LABS, HOME };
}
