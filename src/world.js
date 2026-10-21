/* ---------- My World: spend stars on new lands, plants, houses and animals that live on a little map ---------- */
// The ⭐ a child earns stay their lifetime total (badges, stickers and the owl read st.stars); My World keeps how many
// were spent in st.world.spent, so the wallet is st.stars − spent and spending never takes a badge or sticker away.
// The map is 4 × 3 lands of 6 × 6 cells. Hoot's Island in the middle is free; the other 11 lands are bought.
// Each placed thing sits on one cell; some need a matching habitat (fish need water, penguins need snow).
const worldHome = (() => {
  const B = 6, BW = 4, BH = 3, GW = B * BW, GH = B * BH, MAXI = 160, ZOOMS = [46, 56, 70], FRUIT_MAX = 5;
  const LANDS = [
    { id: 'home', n: "Hoot's Island", e: '🌳', bx: 1, by: 1, p: 0, f: 'Every world starts small. Hoot planted the first tree here!' },
    { id: 'meadow', n: 'Flower Meadow', e: '🌼', bx: 2, by: 1, p: 30, f: 'A meadow is a field of grass and wild flowers. Bees love it!' },
    { id: 'forest', n: 'Forest', e: '🌲', bx: 2, by: 0, p: 45, f: 'Forests make lots of the oxygen we breathe. Deer and bears live here.' },
    { id: 'beach', n: 'Beach & Sea', e: '🏖️', bx: 0, by: 2, p: 60, f: 'Sand is made of tiny bits of rock and shell. Dolphins and whales swim in the sea.' },
    { id: 'river', n: 'River Valley', e: '🏞️', bx: 0, by: 1, p: 70, f: 'Rivers carry rain water all the way down to the sea.' },
    { id: 'farm', n: 'Farm Fields', e: '🚜', bx: 3, by: 1, p: 85, f: 'Farms grow the food we eat, like corn, carrots and pumpkins.' },
    { id: 'mountain', n: 'Mountains', e: '⛰️', bx: 1, by: 0, p: 110, f: 'The higher you climb a mountain, the colder it gets. Goats are great climbers.' },
    { id: 'snow', n: 'Snowy Land', e: '❄️', bx: 0, by: 0, p: 140, f: 'Every snowflake has six sides. Penguins love the cold!' },
    { id: 'desert', n: 'Desert', e: '🏜️', bx: 1, by: 2, p: 160, f: 'A desert gets very little rain. Camels and cactuses live there.' },
    { id: 'jungle', n: 'Jungle', e: '🌴', bx: 3, by: 0, p: 190, f: 'Jungles are hot and rainy, and full of monkeys, parrots and tigers.' },
    { id: 'volcano', n: 'Volcano Island', e: '🌋', bx: 3, by: 2, p: 240, f: 'Hot melted rock from a volcano is called lava. Some islands are made by volcanoes!' },
    { id: 'candy', n: 'Candy Land', e: '🍭', bx: 2, by: 2, p: 300, f: 'Candy Land is make-believe. Real teeth like apples better than sweets!' }
  ];
  const LBY = Object.fromEntries(LANDS.map(l => [l.id, l]));
  const HAB = { water: 'water', snow: 'Snowy Land', desert: 'the Desert', jungle: 'the Jungle', beach: 'the Beach', mountain: 'the Mountains', farm: 'Farm Fields', forest: 'the Forest', volcano: 'Volcano Island', candy: 'Candy Land', grass: 'grass' };
  const HAB_LAND = { snow: 'snow', desert: 'desert', jungle: 'jungle', beach: 'beach', mountain: 'mountain', farm: 'farm', forest: 'forest', volcano: 'volcano', candy: 'candy' };
  const CATS = [
    { id: 'plant', ico: '🌷', n: 'Plants & trees', one: 'plants' }, { id: 'home', ico: '🏠', n: 'Houses', one: 'houses and buildings' },
    { id: 'animal', ico: '🐄', n: 'Animals', one: 'animals' }, { id: 'deco', ico: '⛲', n: 'Decorations', one: 'decorations' },
    { id: 'sky', ico: '🌈', n: 'Sky & fun', one: 'sky things' }, { id: 'land', ico: '🗺️', n: 'New lands', one: 'lands' }
  ];
  const K = 'stroke="#22305A" stroke-width="1.4" stroke-linejoin="round"';
  const SVG = {
    lighthouse: `<path d="M15 36 L17 10 H23 L25 36Z" fill="#fff" ${K}/><path d="M16.2 26 H23.8 L24.4 31 H15.6Z M16.9 16 H23.1 L23.5 21 H16.5Z" fill="#F2604F"/><rect x="15" y="6" width="10" height="5" rx="1" fill="#FFC23D" ${K}/><path d="M14 6 L20 1 L26 6Z" fill="#F2604F" ${K}/><rect x="11" y="35" width="18" height="3.5" rx="1.5" fill="#8B5A2B"/>`,
    windmill: `<path d="M14 38 L16.5 16 H23.5 L26 38Z" fill="#F7E2B5" ${K}/><path d="M15 17 L20 11 L25 17Z" fill="#C44E40" ${K}/><rect x="18" y="30" width="4" height="8" rx="2" fill="#8B5A2B"/><g class="mw-spin"><path d="M20 15 L18 2 H22Z M20 15 L33 13 V17Z M20 15 L22 28 H18Z M20 15 L7 17 V13Z" fill="#fff" stroke="#22305A" stroke-width="1.1"/></g><circle cx="20" cy="15" r="2" fill="#22305A"/>`,
    igloo: `<path d="M4 33 A16 16 0 0 1 36 33Z" fill="#EAF6FF" ${K}/><path d="M7.5 25 H32.5 M5.5 29.5 H34.5 M10.5 20.5 H29.5 M16 17.5 V20.5 M24 17.5 V20.5 M13 20.5 V25 M20 20.5 V25 M27 20.5 V25 M9 25 V29.5 M17 25 V29.5 M25 25 V29.5 M31 25 V29.5" stroke="#9CC3DE" stroke-width="1"/><path d="M15 33 V28 A5 5 0 0 1 25 28 V33Z" fill="#22305A"/>`,
    barn: `<path d="M5 18 L20 6 L35 18 V36 H5Z" fill="#C44E40" ${K}/><path d="M3 19 L20 5 L37 19" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><rect x="14" y="22" width="12" height="14" fill="#fff" stroke="#22305A" stroke-width="1.2"/><path d="M14 22 L26 36 M26 22 L14 36" stroke="#C44E40" stroke-width="1.6"/><circle cx="20" cy="15" r="3" fill="#FFF1CC" stroke="#22305A"/>`,
    treehouse: `<rect x="17" y="20" width="6" height="18" fill="#8B5A2B"/><circle cx="20" cy="13" r="12" fill="#2FA36B"/><circle cx="10.5" cy="17" r="7" fill="#268457"/><circle cx="29.5" cy="17" r="7" fill="#268457"/><rect x="12" y="17" width="16" height="10" rx="1" fill="#E3A35B" stroke="#22305A" stroke-width="1.2"/><path d="M10 18 L20 10 L30 18Z" fill="#F2604F" stroke="#22305A" stroke-width="1.2"/><rect x="17.5" y="20" width="5" height="5" fill="#22305A"/><path d="M25 27 V38 M28.5 27 V38 M25 30 H28.5 M25 33 H28.5 M25 36 H28.5" stroke="#8B5A2B" stroke-width="1.2"/>`,
    rocket: `<ellipse cx="20" cy="35" rx="15" ry="4" fill="#9AA5B8" stroke="#22305A" stroke-width="1.2"/><path d="M20 3 C27 9 27 20 25 29 H15 C13 20 13 9 20 3Z" fill="#fff" ${K}/><circle cx="20" cy="15" r="3.5" fill="#2E8BE6" stroke="#22305A"/><path d="M15 22 L9 31 H15Z M25 22 L31 31 H25Z" fill="#F2604F" stroke="#22305A" stroke-width="1.2"/><path d="M17 29 L20 35 L23 29Z" fill="#FFC23D"/>`,
    fence: `<path d="M1 20 H39 M1 29 H39" stroke="#B07A45" stroke-width="3"/><g fill="#E3A35B" stroke="#8B5A2B" stroke-width="1.2"><path d="M5 14 L8 11 L11 14 V36 H5Z"/><path d="M17 14 L20 11 L23 14 V36 H17Z"/><path d="M29 14 L32 11 L35 14 V36 H29Z"/></g>`,
    path: `<g fill="#E4DDCD" stroke="#9A8F7A" stroke-width="1"><ellipse cx="11" cy="10" rx="7" ry="5"/><ellipse cx="28" cy="13" rx="8" ry="5.5"/><ellipse cx="14" cy="27" rx="8" ry="5.5"/><ellipse cx="30" cy="31" rx="7" ry="5"/></g>`,
    pond: `<ellipse cx="20" cy="22" rx="18" ry="13" fill="#8FD0F5" stroke="#5A9E4B" stroke-width="3"/><path d="M10 20 Q14 18 18 20 M22 26 Q26 24 30 26" stroke="#fff" stroke-width="1.5" fill="none"/><ellipse cx="28" cy="17" rx="4" ry="2.5" fill="#2FA36B"/><circle cx="28" cy="16" r="1.4" fill="#F49AC1"/>`,
    bridge: `<path d="M0 26 Q20 8 40 26 V31 Q20 15 0 31Z" fill="#B07A45" ${K}/><path d="M0 18 Q20 2 40 18" fill="none" stroke="#8B5A2B" stroke-width="2"/><path d="M6 22 V15 M13 17 V9 M20 15 V7 M27 17 V9 M34 22 V15" stroke="#8B5A2B" stroke-width="1.6"/>`,
    hay: `<rect x="5" y="16" width="30" height="18" rx="4" fill="#F2C94C" ${K}/><path d="M9 20 H31 M9 25 H31 M9 30 H31" stroke="#C9921A" stroke-width="1.2"/><path d="M13 16 V34 M27 16 V34" stroke="#8B5A2B" stroke-width="1.6"/>`,
    sandcastle: `<path d="M6 36 V20 H10 V17 H13 V20 H17 V14 H20 V11 H23 V14 V20 H27 V17 H30 V20 H34 V36Z" fill="#F2CF7E" ${K}/><path d="M17 36 V29 A3 3 0 0 1 23 29 V36Z" fill="#B07A45"/><path d="M21.5 11 V4 L27 6.5 L21.5 8.5" fill="#F2604F" stroke="#22305A" stroke-width="1"/>`
  };
  // id, picture (emoji or SVG key), name, kind, price, habitat (space-separated, or ''), fun fact, extras
  // extras: s size, bloom (sprouts, then blooms over 2 days), fr fruit, snd [word, notes], fd food, glow, rare
  const I = (id, e, n, c, p, hab, f, x = {}) => ({ id, e, n, c, p, hab: hab ? hab.split(' ') : null, f, ...x });
  const ITEMS = [
    I('tulip', '🌷', 'Tulip', 'plant', 3, '', 'Tulips grow from bulbs, a bit like onions!', { bloom: 1 }),
    I('daisy', '🌼', 'Daisy', 'plant', 3, '', 'A daisy is really lots of tiny flowers packed together.', { bloom: 1 }),
    I('clover', '☘️', 'Clover', 'plant', 3, '', 'A clover with four leaves is very rare. Lucky you if you find one!'),
    I('herb', '🌿', 'Herbs', 'plant', 3, '', 'Plants make their own food from sunlight, air and water.'),
    I('mushroom', '🍄', 'Mushroom', 'plant', 4, '', 'A mushroom is not a plant. It is a fungus!'),
    I('sunflower', '🌻', 'Sunflower', 'plant', 5, '', 'Young sunflowers turn to follow the sun across the sky.', { bloom: 1, s: 1.1 }),
    I('carrot', '🥕', 'Carrots', 'plant', 5, 'farm', 'Carrots are roots. We eat the part that grows under the ground!'),
    I('rose', '🌹', 'Rose', 'plant', 6, '', 'Roses have prickles to keep hungry animals away.', { bloom: 1 }),
    I('hibiscus', '🌺', 'Hibiscus', 'plant', 6, '', 'Hummingbirds love to drink from hibiscus flowers.', { bloom: 1 }),
    I('cactus', '🌵', 'Cactus', 'plant', 6, 'desert', 'A cactus stores water inside, so it can live where it hardly ever rains.'),
    I('corn', '🌽', 'Corn', 'plant', 6, 'farm', 'One ear of corn has about 800 kernels.'),
    I('blossom', '🌸', 'Cherry blossom', 'plant', 7, '', 'Cherry blossoms only last about one week each spring.', { bloom: 1 }),
    I('pumpkin', '🎃', 'Pumpkin', 'plant', 8, 'farm', 'Pumpkins are fruits. Some grow as heavy as a small car!'),
    I('bamboo', '🎋', 'Bamboo', 'plant', 8, '', 'Bamboo is a grass. It can grow almost a meter in one day!'),
    I('lolly', '🍭', 'Lollipop tree', 'plant', 10, 'candy', 'Candy trees are make-believe. Real trees grow fruit and nuts!', { s: 1.1 }),
    I('pine', '🌲', 'Pine tree', 'plant', 10, '', 'Pine trees stay green all winter long.', { s: 1.25 }),
    I('oak', '🌳', 'Oak tree', 'plant', 12, '', 'One big oak tree can be home to hundreds of tiny animals.', { s: 1.3 }),
    I('palm', '🌴', 'Palm tree', 'plant', 12, 'beach desert jungle', 'Palm trees bend in strong winds instead of breaking.', { s: 1.3 }),
    I('strawberry', '🌿', 'Strawberry patch', 'plant', 15, '', 'Strawberries wear their seeds on the outside!', { fr: '🍓' }),
    I('apple', '🌳', 'Apple tree', 'plant', 25, '', 'Apples float in water because they are one quarter air!', { fr: '🍎', s: 1.3 }),
    I('orange', '🌳', 'Orange tree', 'plant', 28, '', 'Orange trees can have flowers and fruit at the same time.', { fr: '🍊', s: 1.3 }),
    I('cherry', '🌳', 'Cherry tree', 'plant', 30, '', 'Cherries grow in pairs, joined at the stem.', { fr: '🍒', s: 1.3 }),
    I('coconut', '🌴', 'Coconut palm', 'plant', 30, 'beach', 'A coconut can float across the sea to a new island.', { fr: '🥥', s: 1.3 }),
    I('banana', '🌴', 'Banana plant', 'plant', 32, 'jungle', 'Bananas grow in bunches, pointing up toward the sun.', { fr: '🍌', s: 1.3 }),

    I('tent', '⛺', 'Tent', 'home', 8, '', 'People take tents camping, so they can sleep under the stars.', { s: 1.1 }),
    I('cottage', '🏠', 'Cottage', 'home', 18, '', 'Long ago, many cottages had roofs made of straw.', { s: 1.25 }),
    I('gardenhouse', '🏡', 'Garden house', 'home', 25, '', 'A garden needs sun, water and good soil.', { s: 1.3 }),
    I('igloo', 'igloo', 'Igloo', 'home', 30, 'snow', 'Igloos are made of snow blocks, and inside they stay warm!', { s: 1.25 }),
    I('treehouse', 'treehouse', 'Treehouse', 'home', 35, '', 'Some treehouses are so big they have kitchens!', { s: 1.45 }),
    I('cupcake', '🧁', 'Cupcake house', 'home', 35, 'candy', 'In Candy Land the houses are cakes. Yum!', { s: 1.3 }),
    I('barn', 'barn', 'Farmhouse barn', 'home', 40, 'farm', 'Barns keep farm animals and hay safe and dry.', { s: 1.4 }),
    I('windmill', 'windmill', 'Windmill', 'home', 45, '', 'Windmills use the wind to grind wheat into flour.', { s: 1.5 }),
    I('shop', '🏪', 'Shop', 'home', 45, '', 'Shops sell things people need, like bread and milk.', { s: 1.3 }),
    I('lighthouse', 'lighthouse', 'Lighthouse', 'home', 50, 'beach', 'A lighthouse light helps ships find their way at night.', { s: 1.5, glow: 1 }),
    I('school', '🏫', 'School', 'home', 55, '', 'The first schools often had one room for children of all ages.', { s: 1.4 }),
    I('carousel', '🎠', 'Carousel', 'home', 60, '', 'A carousel horse goes up and down while it goes round.', { s: 1.3 }),
    I('ferris', '🎡', 'Big wheel', 'home', 70, '', 'The first big wheel was built in 1893. It was 80 meters tall!', { s: 1.5 }),
    I('rocket', 'rocket', 'Rocket pad', 'home', 90, '', 'Rockets must go super fast to escape the pull of Earth.', { s: 1.5 }),
    I('palace', '🏯', 'Palace', 'home', 100, '', 'This kind of castle comes from Japan. Its roofs curve up at the ends.', { s: 1.55 }),
    I('castle', '🏰', 'Castle', 'home', 120, '', 'Castles had thick stone walls, and some had a moat full of water.', { s: 1.6 }),

    I('bee', '🐝', 'Bee', 'animal', 5, '', 'Bees dance to tell their friends where the flowers are.', { snd: ['Bzzz!', [880, 900, 880]], fd: '🌼' }),
    I('butterfly', '🦋', 'Butterfly', 'animal', 6, '', 'Butterflies taste with their feet!', { snd: ['Flutter flutter!', [1046, 1318]], fd: '🌸' }),
    I('fish', '🐟', 'Fish', 'animal', 8, 'water', 'Fish breathe under water with gills.', { snd: ['Blub blub!', [400, 500, 600]], fd: '🦐' }),
    I('chicken', '🐓', 'Chicken', 'animal', 10, '', 'Chickens are distant cousins of the dinosaurs!', { snd: ['Cluck cluck!', [700, 600, 700]], fd: '🌽' }),
    I('frog', '🐸', 'Frog', 'animal', 10, '', 'Frogs drink water through their skin!', { snd: ['Ribbit!', [200, 260]], fd: '🐛' }),
    I('rabbit', '🐇', 'Rabbit', 'animal', 12, '', "A rabbit's teeth never stop growing.", { snd: ['Sniff sniff!', [900, 1000]], fd: '🥕' }),
    I('tropical', '🐠', 'Tropical fish', 'animal', 12, 'water', 'Some fish can change their colors.', { snd: ['Blub!', [500, 700]], fd: '🦐' }),
    I('crab', '🦀', 'Crab', 'animal', 12, 'beach', 'Crabs walk sideways!', { snd: ['Click click!', [1200, 1200]], fd: '🐚' }),
    I('duck', '🦆', 'Duck', 'animal', 14, 'water grass farm', 'Ducks have waterproof feathers.', { snd: ['Quack quack!', [500, 420]], fd: '🌾' }),
    I('cat', '🐈', 'Cat', 'animal', 15, '', 'Cats sleep for about 15 hours a day.', { snd: ['Meow!', [880, 660]], fd: '🐟' }),
    I('dog', '🐕', 'Dog', 'animal', 15, '', "A dog's nose print is special, like your fingerprint.", { snd: ['Woof woof!', [300, 250]], fd: '🦴' }),
    I('turtle', '🐢', 'Turtle', 'animal', 18, '', 'Turtles lived on Earth at the same time as the dinosaurs.', { snd: ['Hmm hmm!', [220, 240]], fd: '🥬' }),
    I('hedgehog', '🦔', 'Hedgehog', 'animal', 18, '', 'A hedgehog has about 5,000 spikes.', { snd: ['Snuffle!', [600, 650]], fd: '🐛' }),
    I('squirrel', '🐿️', 'Squirrel', 'animal', 18, '', 'Squirrels bury nuts and sometimes forget where!', { snd: ['Chitter chatter!', [1100, 1300, 1100]], fd: '🌰' }),
    I('pig', '🐖', 'Pig', 'animal', 22, '', 'Pigs are very clever and can learn tricks.', { snd: ['Oink oink!', [330, 300]], fd: '🍎' }),
    I('goat', '🐐', 'Mountain goat', 'animal', 22, 'mountain', 'Mountain goats can climb very steep rocks.', { snd: ['Maaa!', [520, 500, 480]], fd: '🌿' }),
    I('sheep', '🐑', 'Sheep', 'animal', 25, '', "A sheep's wool keeps growing, so it gets a haircut every year.", { snd: ['Baa!', [480, 460]], fd: '🌾' }),
    I('deer', '🦌', 'Deer', 'animal', 28, 'forest', 'Male deer grow new antlers every year.', { snd: ['Bleat!', [700, 640]], fd: '🍃' }),
    I('cow', '🐄', 'Cow', 'animal', 30, '', "A cow's tummy has four parts!", { snd: ['Moo!', [200, 180]], fd: '🌾' }),
    I('parrot', '🦜', 'Parrot', 'animal', 30, 'jungle', 'Parrots can copy sounds, even words!', { snd: ['Hello! Hello!', [1000, 1200, 1000]], fd: '🍇' }),
    I('fox', '🦊', 'Fox', 'animal', 30, '', 'Foxes curl their bushy tail around them like a warm blanket.', { snd: ['Yip yip!', [900, 950]], fd: '🍇' }),
    I('horse', '🐎', 'Horse', 'animal', 35, '', 'Horses can sleep standing up.', { snd: ['Neigh!', [700, 800, 600]], fd: '🍎' }),
    I('penguin', '🐧', 'Penguin', 'animal', 35, 'snow', 'Penguins cannot fly, but they are super swimmers.', { snd: ['Honk honk!', [450, 450]], fd: '🐟' }),
    I('monkey', '🐒', 'Monkey', 'animal', 35, 'jungle', 'Monkeys use their tails like an extra hand.', { snd: ['Ooh ooh ah ah!', [600, 800, 600, 800]], fd: '🍌' }),
    I('camel', '🐫', 'Camel', 'animal', 40, 'desert', "A camel's hump stores fat, not water.", { snd: ['Grumble!', [180, 200]], fd: '🌵' }),
    I('bear', '🐻', 'Bear', 'animal', 45, 'forest', 'Bears sleep through most of the winter.', { snd: ['Grr!', [150, 130]], fd: '🍯', s: 1.15 }),
    I('dolphin', '🐬', 'Dolphin', 'animal', 50, 'water', 'Dolphins sleep with one half of their brain at a time.', { snd: ['Eee eee!', [1400, 1600, 1400]], fd: '🐟', s: 1.15 }),
    I('tiger', '🐅', 'Tiger', 'animal', 70, 'jungle', 'No two tigers have the same stripes.', { snd: ['Roar!', [140, 120]], fd: '🍖', s: 1.2 }),
    I('giraffe', '🦒', 'Giraffe', 'animal', 75, '', "A giraffe's tongue is dark blue and very long.", { snd: ['Hum hum!', [300, 320]], fd: '🍃', s: 1.35 }),
    I('elephant', '🐘', 'Elephant', 'animal', 80, '', 'Elephants use their trunks to drink, smell and hug.', { snd: ['Pawoo!', [400, 600, 800]], fd: '🥜', s: 1.35 }),
    I('whale', '🐳', 'Whale', 'animal', 90, 'water', 'Blue whales are the biggest animals that ever lived.', { snd: ['Whoooo!', [200, 300, 250]], fd: '🦐', s: 1.4 }),
    I('unicorn', '🦄', 'Unicorn', 'animal', 120, '', 'Unicorns are make-believe, but narwhals have a real horn-like tooth!', { snd: ['Neigh-hee!', [1046, 1318, 1568]], fd: '🌈', s: 1.25, rare: 1 }),
    I('dino', '🦕', 'Dinosaur', 'animal', 130, 'jungle volcano', 'Some long-necked dinosaurs were as long as three buses!', { snd: ['Rawr!', [120, 160, 110]], fd: '🌿', s: 1.45, rare: 1 }),
    I('dragon', '🐉', 'Dragon', 'animal', 150, 'volcano', 'Dragons are make-believe. The real Komodo dragon is a big lizard!', { snd: ['Whoosh! Roar!', [200, 400, 150]], fd: '🌶️', s: 1.45, rare: 1 }),

    I('fence', 'fence', 'Fence', 'deco', 3, '', 'Fences keep animals safe in their field.'),
    I('path', 'path', 'Stone path', 'deco', 3, '', 'Stepping stones keep your feet out of the mud.'),
    I('mailbox', '📫', 'Mailbox', 'deco', 5, '', 'When the flag is up, there is a letter to send!'),
    I('donut', '🍩', 'Giant donut', 'deco', 5, 'candy', 'Donuts have a hole so they cook evenly in the middle.'),
    I('bench', '🪑', 'Chair', 'deco', 6, '', 'Sitting still and watching nature is called a nature walk without walking!'),
    I('icecream', '🍦', 'Ice cream stand', 'deco', 6, 'candy', 'Ice cream melts because heat makes the frozen water turn to liquid.'),
    I('hay', 'hay', 'Hay bale', 'deco', 6, 'farm', 'Hay is dried grass. Cows and horses eat it in winter.'),
    I('lamp', '🏮', 'Lantern', 'deco', 8, '', 'Lanterns glow at night in your world!', { glow: 1 }),
    I('umbrella', '⛱️', 'Beach umbrella', 'deco', 8, 'beach', 'Shade keeps you cool. Always wear sun cream at the beach!'),
    I('snowman', '⛄', 'Snowman', 'deco', 10, 'snow', 'Snow is frozen water. A snowman melts when the sun gets warm.'),
    I('sandcastle', 'sandcastle', 'Sandcastle', 'deco', 10, 'beach', 'Wet sand sticks together better than dry sand.'),
    I('canoe', '🛶', 'Canoe', 'deco', 12, 'water', 'People have paddled canoes for thousands of years.'),
    I('pond', 'pond', 'Lily pond', 'deco', 15, '', 'Frogs lay their eggs in ponds. The eggs become tadpoles!'),
    I('bridge', 'bridge', 'Bridge', 'deco', 18, 'water', 'Bridges help people cross rivers without getting wet.'),
    I('boat', '⛵', 'Sailboat', 'deco', 20, 'water', 'A sailboat uses the wind to move. No engine needed!', { s: 1.2 }),
    I('fountain', '⛲', 'Fountain', 'deco', 25, '', 'Long ago, fountains were where people got their water.', { s: 1.2 }),
    I('tractor', '🚜', 'Tractor', 'deco', 35, 'farm', 'Tractors pull heavy things, like ploughs that dig the soil.', { s: 1.15 }),
    I('statue', '🗿', 'Stone statue', 'deco', 40, '', 'The giant stone heads on Easter Island are hundreds of years old.', { s: 1.25 }),
    I('train', '🚂', 'Steam train', 'deco', 50, '', 'Steam trains burn coal to boil water. The steam makes the wheels turn.', { s: 1.2 }),

    I('balloon', '🎈', 'Balloon', 'sky', 4, '', 'Balloons float when they are filled with helium, a gas lighter than air.'),
    I('cloud', '☁️', 'Cloud', 'sky', 5, '', 'Clouds are made of tiny drops of water.'),
    I('kite', '🪁', 'Kite', 'sky', 8, '', 'Kites fly when the wind pushes up under them.'),
    I('shooting', '🌠', 'Shooting star', 'sky', 15, '', 'A shooting star is really a tiny space rock burning up.'),
    I('rainbow', '🌈', 'Rainbow', 'sky', 20, '', 'You see a rainbow when the sun shines through raindrops.', { s: 1.4 }),
    I('plane', '✈️', 'Airplane', 'sky', 30, '', 'Big planes fly about 10 kilometers above the ground.'),
    I('heli', '🚁', 'Helicopter', 'sky', 40, '', 'Helicopters can fly straight up and even hover in one place.'),
    I('ufo', '🛸', 'Flying saucer', 'sky', 80, '', 'Nobody has found a real flying saucer. Space is full of mysteries!', { s: 1.25, rare: 1 })
  ];
  const BY = Object.fromEntries(ITEMS.map(i => [i.id, i]));
  const MS = [
    ['house1', '🏠', 'First home', 'Buy your first house', 5, () => count('home') >= 1],
    ['animal1', '🐾', 'First friend', 'Buy your first animal', 3, () => count('animal') >= 1],
    ['plant10', '🌳', 'Green thumb', 'Grow 10 plants', 5, () => count('plant') >= 10],
    ['animal5', '🐄', 'Animal friends', 'Have 5 animals', 10, () => count('animal') >= 5],
    ['land3', '🗺️', 'Land explorer', 'Buy 3 new lands', 15, () => W().lands.length - 1 >= 3],
    ['habitat3', '🐧', 'Happy homes', '3 animals living in their special home', 8, () => W().items.filter(o => o.x != null && BY[o.id].c === 'animal' && BY[o.id].hab).length >= 3],
    ['place25', '🏘️', 'Busy world', 'Place 25 things', 10, () => W().items.filter(o => o.x != null).length >= 25],
    ['feedall', '🥕', 'Kind keeper', 'Feed all your animals in one day (3 or more)', 5, () => { const a = placedAnimals(); return a.length >= 3 && a.every(o => o.fed === day()); }],
    ['rare', '🦄', 'Legend', 'Buy a unicorn, a dinosaur or a dragon', 10, () => W().items.some(o => BY[o.id].rare)],
    ['world', '🌍', 'Whole wide world', 'Own every land', 50, () => W().lands.length === LANDS.length]
  ];

  /* --- state --- */
  let shift = 0, hourSet = null, ui = null;
  const ds = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const day = () => shift ? ds(new Date(Date.now() + shift * 864e5)) : today();
  const night = () => { const h = hourSet != null ? hourSet : new Date().getHours(); return h >= 19 || h < 7; };
  function W() {
    const w = st.world = st.world || {};
    w.spent = w.spent || 0; w.lands = w.lands || ['home']; w.items = w.items || []; w.got = w.got || {}; w.ms = w.ms || {}; w.fruit = w.fruit || { d: null, n: 0 };
    w.n = w.n || 0; w.z = w.z == null ? 1 : w.z;
    return w;
  }
  const wallet = () => Math.max(0, st.stars - W().spent);
  const count = c => W().items.filter(o => BY[o.id].c === c).length;
  const placedAnimals = () => W().items.filter(o => o.x != null && BY[o.id].c === 'animal');
  const owned = id => W().lands.includes(id);
  const ageDays = o => dayNum(day()) - dayNum(o.t);
  const fruitReady = o => BY[o.id].fr && o.x != null && ageDays(o) >= 1 && o.pk !== day();
  const hungry = o => BY[o.id].c === 'animal' && o.fed !== day();
  const habName = it => it.hab ? it.hab.map(h => HAB[h]).join(it.hab.length > 2 ? ', ' : ' or ').replace(/, ([^,]*)$/, ' or $1') : '';
  // A habitat is "open" when the child owns a land that has it (water is around Hoot's Island from the start).
  const habOpen = it => !it.hab || it.hab.some(h => h === 'water' || h === 'grass' || owned(HAB_LAND[h]));
  const needLand = it => it.hab && !habOpen(it) ? LBY[HAB_LAND[it.hab.find(h => HAB_LAND[h])]] : null;

  /* --- the map --- */
  const landAt = (x, y) => LANDS.find(l => l.bx === Math.floor(x / B) && l.by === Math.floor(y / B));
  function terr(x, y) {
    if (x < 0 || y < 0 || x >= GW || y >= GH) return null;
    const L = landAt(x, y), lx = x % B, ly = y % B, edge = lx === 0 || ly === 0 || lx === B - 1 || ly === B - 1, mid = (lx === 2 || lx === 3) && (ly === 2 || ly === 3);
    if (L.id === 'home') return edge ? 'water' : mid ? 'block' : 'grass';
    if (L.id === 'volcano') return edge ? 'water' : mid ? 'block' : 'volcano';
    if (L.id === 'beach') return ly >= 3 ? 'water' : 'beach';
    if (L.id === 'river') return lx === 2 || lx === 3 ? 'water' : 'grass';
    if (L.id === 'meadow') return 'grass';
    return L.id;
  }
  const habOK = (it, t) => t !== 'block' && (it.c === 'sky' || (it.hab ? it.hab.includes(t) : t !== 'water'));
  const at = (x, y, not) => W().items.find(o => o.x === x && o.y === y && o !== not);
  function whyNot(it, x, y, not) {
    const t = terr(x, y), L = t && landAt(x, y);
    if (!t) return 'That is off the map.';
    if (!owned(L.id)) return `${L.n} is not yours yet. You can buy it for ${L.p} stars!`;
    if (t === 'block') return L.id === 'home' ? "That is Hoot's tree!" : 'Too hot! That is the volcano.';
    if (at(x, y, not)) return 'Something is already there. Pick an empty spot.';
    if (!habOK(it, t)) return it.hab ? `The ${it.n.toLowerCase()} needs ${habName(it)}!` : `That is water. The ${it.n.toLowerCase()} needs dry land!`;
    return '';
  }
  const COL = { grass: '#8ED46B', forest: '#5FAE5A', farm: '#A9D46A', mountain: '#C6B59C', snow: '#F2F8FF', desert: '#F3D48C', jungle: '#43A35A', candy: '#FFC9E4', volcano: '#8A7068', beach: '#F7E1A6', water: '#5CB9F0' };
  const seeded = s => () => (s = (s * 9301 + 49297) % 233280) / 233280;
  function blockSVG(L) {
    const r = seeded(L.bx * 7 + L.by * 13 + 5), f = n => n.toFixed(2);
    let s = '';
    const scatter = (n, fn, x0 = 0, y0 = 0, x1 = 6, y1 = 6) => { for (let i = 0; i < n; i++) s += fn(x0 + r() * (x1 - x0), y0 + r() * (y1 - y0), i); };
    const tuft = (c) => (x, y) => `<path d="M${f(x)} ${f(y)}l.06-.16l.05.16l.06-.12" stroke="${c}" stroke-width=".035" fill="none" stroke-linecap="round"/>`;
    const waves = (x0, y0, x1, y1, n) => scatter(n, (x, y) => `<path d="M${f(x)} ${f(y)}q.1-.08.2 0t.2 0" stroke="#fff" stroke-width=".04" fill="none" opacity=".55" stroke-linecap="round"/>`, x0, y0, x1, y1);
    const island = c => `<rect x=".5" y=".5" width="5" height="5" rx="1.4" fill="${COL.beach}"/><rect x=".75" y=".75" width="4.5" height="4.5" rx="1.2" fill="${c}"/>`;
    const id = L.id;
    if (id === 'home' || id === 'volcano') { s += `<rect width="6" height="6" fill="${COL.water}"/>`; waves(0, 0, 6, .5, 4); waves(0, 5.5, 6, 6, 4); waves(0, 0, .4, 6, 3); waves(5.5, 0, 6, 6, 3); s += island(id === 'home' ? COL.grass : COL.volcano); scatter(id === 'home' ? 14 : 6, tuft(id === 'home' ? '#5FAE3F' : '#6A524B'), 1, 1, 5, 5); }
    else if (id === 'beach') { s += `<rect width="6" height="6" fill="${COL.beach}"/><path d="M0 2.9 Q.75 2.7 1.5 2.9 T3 2.9 T4.5 2.9 T6 2.9 V6 H0Z" fill="${COL.water}"/><path d="M0 3 Q.75 2.8 1.5 3 T3 3 T4.5 3 T6 3" stroke="#fff" stroke-width=".08" fill="none" opacity=".8"/>`; waves(0, 3.3, 6, 6, 9); scatter(10, (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r=".03" fill="#D9B86A"/>`, 0, 0, 6, 2.7); }
    else if (id === 'river') { s += `<rect width="6" height="6" fill="${COL.grass}"/><path d="M2.05 0 Q1.85 1.5 2.05 3 T2.05 6 H3.95 Q4.15 4.5 3.95 3 T3.95 0Z" fill="${COL.water}"/>`; waves(2.1, 0, 3.7, 6, 7); scatter(14, tuft('#5FAE3F'), 0, 0, 1.9, 6); scatter(14, tuft('#5FAE3F'), 4.1, 0, 6, 6); }
    else {
      s += `<rect width="6" height="6" fill="${COL[id === 'meadow' ? 'grass' : id]}"/>`;
      if (id === 'meadow') { scatter(16, tuft('#5FAE3F')); scatter(26, (x, y, i) => `<circle cx="${f(x)}" cy="${f(y)}" r=".05" fill="${['#fff', '#FFC23D', '#F49AC1', '#F2604F'][i % 4]}"/>`); }
      if (id === 'forest') { scatter(22, tuft('#3E8A40')); scatter(8, (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r=".14" fill="#4E9E4C" opacity=".7"/>`); }
      if (id === 'farm') { for (let y = .5; y < 6; y += .5) s += `<path d="M.1 ${y} H5.9" stroke="#8DB552" stroke-width=".07" stroke-dasharray=".25 .12"/>`; }
      if (id === 'mountain') { scatter(5, (x, y) => `<path d="M${f(x - .35)} ${f(y + .25)} L${f(x)} ${f(y - .3)} L${f(x + .35)} ${f(y + .25)}Z" fill="#B3A18A"/><path d="M${f(x - .12)} ${f(y - .12)} L${f(x)} ${f(y - .3)} L${f(x + .12)} ${f(y - .12)}Z" fill="#fff"/>`); scatter(10, (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r=".05" fill="#A8977F"/>`); }
      if (id === 'snow') { scatter(30, (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r=".035" fill="#B9DAF2"/>`); scatter(5, (x, y) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx=".4" ry=".12" fill="#DDEEFB"/>`); }
      if (id === 'desert') { scatter(7, (x, y) => `<path d="M${f(x - .4)} ${f(y)} q.4 -.25 .8 0" stroke="#D9B160" stroke-width=".05" fill="none"/>`); scatter(10, (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r=".03" fill="#C99A45"/>`); }
      if (id === 'jungle') { scatter(14, (x, y, i) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx=".2" ry=".08" fill="#2E8545" transform="rotate(${(i * 47) % 180} ${f(x)} ${f(y)})"/>`); }
      if (id === 'candy') { scatter(36, (x, y, i) => `<rect x="${f(x)}" y="${f(y)}" width=".14" height=".045" rx=".02" fill="${['#F2604F', '#2E8BE6', '#FFC23D', '#2FA36B', '#fff', '#6D55D1'][i % 6]}" transform="rotate(${(i * 61) % 180} ${f(x)} ${f(y)})"/>`); }
    }
    return `<svg class="mw-ter" viewBox="0 0 6 6" preserveAspectRatio="none" aria-hidden="true">${s}</svg>`;
  }
  function glyph(it, o) {
    let g, stage = 2;
    if (it.bloom && o && o.x != null) stage = Math.min(2, ageDays(o));
    if (stage === 0) g = '<span class="mw-e">🌱</span>';
    else g = SVG[it.e] ? `<svg viewBox="0 0 40 40" class="mw-svg" aria-hidden="true">${SVG[it.e]}</svg>` : `<span class="mw-e">${it.e}</span>`;
    if (it.fr && (!o || o.x == null || fruitReady(o))) g += `<span class="mw-fr" aria-hidden="true"><i>${it.fr}</i><i>${it.fr}</i><i>${it.fr}</i></span>`;
    return `<span class="mw-g${stage === 1 ? ' mw-bud' : ''}">${g}</span>`;
  }
  function itemLabel(it, o) {
    const bits = [it.n];
    if (it.bloom && ageDays(o) < 2) bits.push(ageDays(o) ? 'growing, blooms tomorrow' : 'a seedling, blooms in 2 days');
    if (it.fr) bits.push(fruitReady(o) ? 'fruit ready to pick' : 'no fruit yet');
    if (it.c === 'animal') bits.push(night() ? 'sleeping' : hungry(o) ? 'hungry' : 'happy');
    return bits.join(', ');
  }
  function itemHTML(o) {
    const it = BY[o.id], an = it.c === 'animal';
    const mood = an ? (night() ? '<b class="mw-mood">💤</b>' : hungry(o) ? '<b class="mw-mood">😢</b>' : '') : '';
    const spark = fruitReady(o) ? '<b class="mw-mood mw-spark">✨</b>' : '';
    return `<button class="mw-it mw-c-${it.c}${an ? ' mw-an' : ''}${ui && ui.sel === o.u ? ' mw-sel' : ''}" data-u="${o.u}" data-id="${o.id}" style="--x:${o.x};--y:${o.y};--s:${it.s || 1};z-index:${10 + o.y}" aria-label="${esc(itemLabel(it, o))}">${glyph(it, o)}${mood}${spark}</button>`;
  }
  function mapHTML() {
    const w = W(), nt = night(), home = LBY.home, vol = LBY.volcano;
    let h = LANDS.map(L => `<div class="mw-blk mw-l-${L.id}${owned(L.id) ? '' : ' mw-fog'}" style="--bx:${L.bx};--by:${L.by}">${blockSVG(L)}${owned(L.id) ? '' : `<button class="mw-sale" data-land="${L.id}" aria-label="Buy ${esc(L.n)} for ${L.p} stars"><span class="mw-se">${L.e}</span><b>${esc(L.n)}</b><i>🔒 ${L.p}⭐</i></button>`}</div>`).join('');
    h += `<button class="mw-hoot" style="--x:${home.bx * B + 2};--y:${home.by * B + 2}" aria-label="Hoot's tree. Tap to say hello"><span class="mw-tree">🌳</span><span class="mw-owl">🦉</span></button>`;
    h += `<div class="mw-volc${owned('volcano') ? '' : ' mw-dim'}" style="--x:${vol.bx * B + 2};--y:${vol.by * B + 2}" aria-hidden="true"><span>🌋</span><i></i><i></i></div>`;
    h += w.items.filter(o => o.x != null).map(itemHTML).join('');
    if (ui && ui.hand) { const it = BY[ui.hand.id]; for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (!whyNot(it, x, y, ui.hand)) h += `<i class="mw-ok" style="--x:${x};--y:${y}"></i>`; }
    if (nt) {
      const r = seeded(77); let s = '';
      for (let i = 0; i < 46; i++) s += `<i style="left:${(r() * 100).toFixed(1)}%;top:${(r() * 100).toFixed(1)}%;animation-delay:${(r() * 3).toFixed(1)}s"></i>`;
      h += `<div class="mw-night" aria-hidden="true">${s}</div>`;
      h += w.items.filter(o => o.x != null && BY[o.id].glow).map(o => `<i class="mw-glow" style="--x:${o.x};--y:${o.y}" aria-hidden="true"></i>`).join('');
    }
    return h;
  }

  /* --- the world screen --- */
  function screen(opt = {}) {
    const w = W(), nav = navId;
    let gift = 0;
    if (w.gift !== day()) { const first = !w.gift; w.gift = day(); gift = first ? 5 : 3; addStars(gift); }
    ui = { nav, sel: null, hand: opt.place != null ? w.items.find(o => o.u === opt.place) || null : null, moved: 0 };
    if (ui.hand) ui.hand.from = ui.hand.x != null ? [ui.hand.x, ui.hand.y] : null;
    view.innerHTML = `${crumbs('🌍 My World')}
      <div class="mw-bar">
        <span class="mw-wallet" id="mwWallet" aria-live="polite"></span>
        <button class="btn mw-shopb" id="mwShop">🛒 Shop</button>
        <button class="btn alt mw-bookb" id="mwBook" aria-label="Sticker book">📖 <span class="mw-long">Sticker </span>book</button>
        <button class="btn alt mw-earn" id="mwEarn" aria-label="Need more stars?">⭐ <span class="mw-long">Need </span>more stars?</button>
      </div>
      <div class="mw-wrap${night() ? ' is-night' : ''}">
        <div class="mw-banner" id="mwBan" aria-live="polite"></div>
        <div class="mw-vp" id="mwVp"><div class="mw-map" id="mwMap" style="--cs:${ZOOMS[w.z]}px"></div></div>
        <div class="mw-pan" role="group" aria-label="Move around the map">
          <button data-pan="0,-1" aria-label="Look up">▲</button><button data-pan="-1,0" aria-label="Look left">◀</button><button data-pan="1,0" aria-label="Look right">▶</button><button data-pan="0,1" aria-label="Look down">▼</button>
          <button data-zoom="-1" aria-label="Zoom out">−</button><button data-zoom="1" aria-label="Zoom in">+</button>
        </div>
        <div class="mw-info" id="mwInfo"></div>
      </div>
      <div class="mw-bag" id="mwBag"></div>`;
    wireBack(home);
    ui.vp = $('#mwVp'); ui.map = $('#mwMap');
    render();
    // Start looking at Hoot's Island (or the land just bought, or the spot an item came from).
    const focus = opt.land ? LBY[opt.land] : null, cs = ZOOMS[w.z];
    const cx = focus ? (focus.bx * B + 3) * cs : ui.hand && ui.hand.from ? (ui.hand.from[0] + .5) * cs : (LBY.home.bx * B + 3) * cs;
    const cy = focus ? (focus.by * B + 3) * cs : ui.hand && ui.hand.from ? (ui.hand.from[1] + .5) * cs : (LBY.home.by * B + 3) * cs;
    ui.vp.scrollLeft = cx - ui.vp.clientWidth / 2; ui.vp.scrollTop = cy - ui.vp.clientHeight / 2;
    $('#mwShop').onclick = () => go(shopView);
    $('#mwBook').onclick = () => go(bookView);
    $('#mwEarn').onclick = earn;
    view.querySelectorAll('[data-pan]').forEach(b => b.onclick = () => { const [dx, dy] = b.dataset.pan.split(',').map(Number); ui.vp.scrollBy({ left: dx * ui.vp.clientWidth * .6, top: dy * ui.vp.clientHeight * .6, behavior: 'smooth' }); });
    view.querySelectorAll('[data-zoom]').forEach(b => b.onclick = () => zoom(+b.dataset.zoom));
    wireMap();
    let msg;
    if (opt.land) { const L = LBY[opt.land]; msg = `Welcome to ${L.n}! ${L.f}`; confetti(50); yay(); }
    else if (ui.hand) msg = `Tap a green spot to put your ${BY[ui.hand.id].n.toLowerCase()}.`;
    else if (gift) msg = gift === 5 ? `Welcome to your world! Hoot gives you 5 stars to start. Tap the shop to buy something.` : `Welcome back! Hoot gives you 3 stars for visiting today.`;
    else msg = `You have ${wallet()} stars to spend. ${night() ? 'It is night time. Your animals are sleeping.' : 'Tap things to hear about them. Drag them to move.'}`;
    if (gift) { toast(`🎁 Welcome ${gift === 5 ? '' : 'back '}gift: +${gift} ⭐`); tone([523, 659, 784, 1046]); }
    sayScreen(msg);
    checkMs();
    loop(nav);
  }
  function render() {
    if (!ui || ui.nav !== navId) return;
    const w = W();
    ui.night = night();
    ui.map.innerHTML = mapHTML();
    ui.map.classList.toggle('mw-placing', !!ui.hand);
    $('.mw-wrap').classList.toggle('is-night', ui.night);
    $('#mwWallet').innerHTML = `<b>⭐ ${wallet()}</b> to spend`;
    $('#mwWallet').setAttribute('aria-label', `You have ${wallet()} stars to spend`);
    const ban = $('#mwBan');
    if (ui.hand) { const it = BY[ui.hand.id]; ban.hidden = false; ban.innerHTML = `<span class="mw-bi">${glyph(it)}</span><span>Tap a <b>green</b> spot for your ${esc(it.n.toLowerCase())}${it.hab ? ` (needs ${esc(habName(it))})` : ''}.</span><button class="btn alt sm" id="mwCancel">${ui.hand.from ? 'Cancel' : '🎒 Later'}</button>`; $('#mwCancel').onclick = cancelHand; }
    else { ban.hidden = !ui.night; ban.innerHTML = ui.night ? '<span class="mw-bi">🌙</span><span>Night time: the animals are asleep. Lanterns glow!</span>' : ''; }
    info();
    const bag = w.items.filter(o => o.x == null);
    $('#mwBag').innerHTML = bag.length ? `<h3 class="section-title">🎒 Backpack <span class="tag">${bag.length}</span></h3><div class="mw-bagrow">${bag.map(o => `<button class="mw-bagit${ui.hand === o ? ' on' : ''}" data-bag="${o.u}" aria-label="Place ${esc(BY[o.id].n)}">${glyph(BY[o.id])}<small>${esc(BY[o.id].n)}</small></button>`).join('')}</div>` : '';
    view.querySelectorAll('[data-bag]').forEach(b => b.onclick = () => { ui.hand = w.items.find(o => o.u === +b.dataset.bag); ui.hand.from = null; ui.sel = null; render(); say(`Tap a green spot to put your ${BY[ui.hand.id].n.toLowerCase()}.`); ui.vp.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); });
  }
  function info() {
    const box = $('#mwInfo'), o = ui.sel != null && W().items.find(x => x.u === ui.sel);
    if (!o || ui.hand) { box.hidden = true; box.innerHTML = ''; return; }
    const it = BY[o.id];
    box.hidden = false;
    box.innerHTML = `<div class="mw-ih"><span class="mw-ig">${glyph(it, o)}</span><div><b>${esc(it.n)}</b><p>${esc(it.f)}</p>${it.c === 'animal' ? `<p class="mw-st">${night() ? '💤 Sleeping. Shh!' : hungry(o) ? `😢 Hungry! Give it some ${it.fd || '🥕'}` : '😊 Happy and fed today'}</p>` : ''}${it.bloom && ageDays(o) < 2 ? `<p class="mw-st">🌱 ${ageDays(o) ? 'Blooms tomorrow!' : 'Blooms in 2 days. Plants need time to grow!'}</p>` : ''}${it.fr && !fruitReady(o) ? `<p class="mw-st">${o.pk === day() ? 'New fruit grows tomorrow.' : 'Fruit grows by tomorrow.'}</p>` : ''}</div><button class="mw-x" id="mwX" aria-label="Close">✕</button></div>
      <div class="mw-acts">${it.c === 'animal' && hungry(o) ? `<button class="btn leaf" id="mwFeed">${it.fd || '🥕'} Feed</button>` : ''}${fruitReady(o) ? `<button class="btn leaf" id="mwPick">${it.fr} Pick fruit</button>` : ''}<button class="btn alt" id="mwSay" aria-label="Hear it again">🔊</button><button class="btn alt" id="mwMove">✋ Move</button><button class="btn alt" id="mwAway">🎒 Put away</button></div>`;
    $('#mwX').onclick = () => { ui.sel = null; render(); };
    $('#mwSay').onclick = () => tapSay(o);
    $('#mwMove').onclick = () => { ui.hand = o; o.from = [o.x, o.y]; ui.sel = null; render(); say('Tap a green spot to move it there.'); };
    $('#mwAway').onclick = () => { o.x = o.y = null; ui.sel = null; save(); tone([660, 440]); render(); say(`The ${it.n.toLowerCase()} is in your backpack.`); };
    const f = $('#mwFeed'); if (f) f.onclick = () => feed(o);
    const pk = $('#mwPick'); if (pk) pk.onclick = () => pickFruit(o);
  }
  function tapSay(o) {
    const it = BY[o.id];
    if (it.c === 'animal') {
      if (night()) { say(`Shh! The ${it.n.toLowerCase()} is sleeping. ${it.f}`); tone([300, 260], .3); return; }
      tone(it.snd[1], .14); say(`${it.snd[0]} ${it.f}${hungry(o) ? ` The ${it.n.toLowerCase()} is hungry!` : ''}`);
    } else { tone([660, 880], .08); say(`${it.n}! ${it.f}`); }
  }
  function feed(o) {
    const it = BY[o.id]; o.fed = day(); save();
    tone([523, 784, 1046], .1); say(`Yum! The ${it.n.toLowerCase()} loves it. ${it.snd[0]}`);
    pop(o, '❤️');
    const a = placedAnimals();
    let bonus = '';
    if (a.length >= 2 && a.every(x => x.fed === day()) && W().fedDay !== day()) { W().fedDay = day(); addStars(1); bonus = ' Every animal is fed: +1 ⭐!'; toast('All animals fed! +1 ⭐'); }
    render(); checkMs();
    if (bonus) say(`All your animals are happy! You earned 1 star.`);
  }
  function pickFruit(o) {
    const it = BY[o.id], w = W();
    if (!fruitReady(o)) return;
    o.pk = day();
    if (w.fruit.d !== day()) w.fruit = { d: day(), n: 0 };
    pop(o, it.fr);
    if (w.fruit.n < FRUIT_MAX) { w.fruit.n++; addStars(1); toast(`${it.fr} Fresh fruit! +1 ⭐`); say(`You picked the ${it.n.toLowerCase().replace(/ (tree|palm|plant|patch)$/, '')} fruit! One bonus star. More fruit grows tomorrow.`); }
    else { save(); say(`Yum! You already picked ${FRUIT_MAX} bonus stars of fruit today. Come back tomorrow!`); }
    yay(); render();
  }
  function pop(o, e) {
    const b = ui.map.querySelector(`[data-u="${o.u}"]`); if (!b) return;
    const p = document.createElement('i'); p.className = 'mw-pop'; p.textContent = e; p.style.cssText = `--x:${o.x};--y:${o.y}`;
    ui.map.appendChild(p); setTimeout(() => p.remove(), 1200);
  }
  function cancelHand() {
    const o = ui.hand; if (!o) return;
    if (o.from) { [o.x, o.y] = o.from; }
    o.from = null; ui.hand = null; save(); render();
    say(o.x == null ? 'It is waiting in your backpack.' : 'Okay, it stays where it was.');
  }
  function placeAt(x, y) {
    const o = ui.hand, it = BY[o.id], why = whyNot(it, x, y, o);
    if (why) { oops(); say(why); flash(why); return false; }
    o.x = x; o.y = y; o.from = null; ui.hand = null; ui.sel = null;
    save(); tone([523, 659, 784], .09); render(); pop(o, '✨');
    say(it.c === 'animal' ? `Your ${it.n.toLowerCase()} has a new home! ${it.snd[0]}` : `${it.n} placed!`);
    checkMs();
    return true;
  }
  function flash(t) { const ban = $('#mwBan'); if (!ban) return; ban.hidden = false; ban.classList.remove('mw-shake'); void ban.offsetWidth; ban.classList.add('mw-shake'); if (!ui.hand) ban.innerHTML = `<span class="mw-bi">🦉</span><span>${esc(t)}</span>`; else { const s = ban.querySelector('span:nth-child(2)'); if (s) s.textContent = t; } }
  function zoom(d) {
    const w = W(), z = clamp(w.z + d, 0, ZOOMS.length - 1); if (z === w.z) return;
    const vp = ui.vp, old = ZOOMS[w.z], cx = (vp.scrollLeft + vp.clientWidth / 2) / old, cy = (vp.scrollTop + vp.clientHeight / 2) / old;
    w.z = z; save(); ui.map.style.setProperty('--cs', ZOOMS[z] + 'px');
    vp.scrollLeft = cx * ZOOMS[z] - vp.clientWidth / 2; vp.scrollTop = cy * ZOOMS[z] - vp.clientHeight / 2;
  }
  const cellOf = (cx, cy) => { const r = ui.map.getBoundingClientRect(), cs = ZOOMS[W().z]; return [Math.floor((cx - r.left) / cs), Math.floor((cy - r.top) / cs)]; };
  // Taps (click) select, place or open a land sign; dragging an item moves it; a mouse drag on the ground pans.
  function wireMap() {
    const map = ui.map, vp = ui.vp;
    let d = null;
    map.addEventListener('click', e => {
      if (Date.now() - ui.moved < 350) { ui.moved = 0; return; }
      const sale = e.target.closest('[data-land]'); if (sale && !ui.hand) { buySheet(LBY[sale.dataset.land]); return; }
      if (e.target.closest('.mw-hoot') && !ui.hand) { tone([440, 660]); say(pick([`${st.pet.name} says: welcome to your world!`, `${st.pet.name} says: hoo hoo! Let's buy something new!`, `${st.pet.name} says: learn and play to earn more stars!`])); return; }
      const b = e.target.closest('.mw-it');
      if (ui.hand) { const [x, y] = cellOf(e.clientX, e.clientY); if (b && +b.dataset.u === ui.hand.u) return; placeAt(x, y); return; }
      if (b) { const o = W().items.find(x => x.u === +b.dataset.u); ui.sel = o.u; render(); tapSay(o); return; }
      if (ui.sel != null) { ui.sel = null; render(); }
    });
    map.addEventListener('pointerdown', e => {
      if (e.button > 0) return;
      const b = e.target.closest('.mw-it');
      if (b && !ui.hand) d = { b, o: W().items.find(x => x.u === +b.dataset.u), x: e.clientX, y: e.clientY, id: e.pointerId, on: false };
      else if (e.pointerType === 'mouse' && !e.target.closest('button')) d = { pan: true, x: e.clientX, y: e.clientY, sl: vp.scrollLeft, st: vp.scrollTop, id: e.pointerId, on: false };
    });
    const move = e => {
      if (!d || e.pointerId !== d.id) return;
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (!d.on && Math.hypot(dx, dy) < 8) return;
      if (!d.on) { d.on = true; if (!d.pan) { d.b.classList.add('mw-drag'); try { d.b.setPointerCapture(e.pointerId); } catch (x) {} ui.sel = null; info(); } }
      if (d.pan) { vp.scrollLeft = d.sl - dx; vp.scrollTop = d.st - dy; return; }
      e.preventDefault();
      const r = map.getBoundingClientRect(), cs = ZOOMS[W().z];
      d.b.style.left = (e.clientX - r.left - cs / 2) + 'px'; d.b.style.top = (e.clientY - r.top - cs * .7) + 'px';
      const [cx, cy] = cellOf(e.clientX, e.clientY), why = whyNot(BY[d.o.id], cx, cy, d.o);
      d.b.classList.toggle('mw-bad', !!why);
      // Nudge the map when dragging near its edge.
      const vr = vp.getBoundingClientRect(), edge = 28;
      if (e.clientX < vr.left + edge) vp.scrollLeft -= 10; else if (e.clientX > vr.right - edge) vp.scrollLeft += 10;
      if (e.clientY < vr.top + edge) vp.scrollTop -= 10; else if (e.clientY > vr.bottom - edge) vp.scrollTop += 10;
    };
    const up = e => {
      if (!d || e.pointerId !== d.id) return;
      const was = d; d = null;
      if (!was.on) return;
      ui.moved = Date.now();
      if (was.pan) return;
      was.b.classList.remove('mw-drag', 'mw-bad'); was.b.style.left = was.b.style.top = '';
      if (e.type === 'pointercancel') { render(); return; }
      const [x, y] = cellOf(e.clientX, e.clientY), o = was.o, why = whyNot(BY[o.id], x, y, o);
      if (x === o.x && y === o.y) { render(); return; }
      if (why) { oops(); say(why); render(); flash(why); return; }
      o.x = x; o.y = y; save(); tone([600, 800], .08); render(); pop(o, '✨'); checkMs();
    };
    map.addEventListener('pointermove', move); map.addEventListener('pointerup', up); map.addEventListener('pointercancel', up);
  }
  // A light timer: every 2.4 s up to 4 visible animals take a small step. It stops when the screen is left or hidden.
  function loop(nav) {
    const t = setInterval(() => {
      if (nav !== navId || !ui || !ui.map.isConnected) { clearInterval(t); return; }
      if (document.hidden) return;
      if (night() !== ui.night) { render(); return; }
      if (ui.night || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const vr = ui.vp.getBoundingClientRect();
      const an = [...ui.map.querySelectorAll('.mw-an:not(.mw-drag)')].filter(a => { const r = a.getBoundingClientRect(); return r.right > vr.left && r.left < vr.right && r.bottom > vr.top && r.top < vr.bottom; });
      for (let k = 0; k < Math.min(4, an.length); k++) {
        const a = pick(an), dx = (Math.random() - .5) * .7, dy = (Math.random() - .5) * .5;
        a.style.setProperty('--dx', dx.toFixed(2)); a.style.setProperty('--dy', dy.toFixed(2)); a.style.setProperty('--fx', dx > 0 ? -1 : 1);
      }
    }, 2400);
  }
  function checkMs() {
    const w = W(), fresh = MS.filter(m => !w.ms[m[0]] && m[5]());
    if (!fresh.length) return;
    fresh.forEach(m => { w.ms[m[0]] = day(); });
    const bonus = fresh.reduce((a, m) => a + m[4], 0);
    addStars(bonus);
    setTimeout(() => { if (ui && ui.nav === navId) render(); toast(`${fresh[0][1]} ${fresh[0][2]}! Bonus +${bonus} ⭐`); confetti(40); tone([523, 659, 784, 1046], .1); }, 900);
  }
  function earn() {
    const p = todaysPick();
    say(`Learn and play to earn more stars! Let's try ${p.title}.`);
    p.kind === 'review' ? go(play, 'review') : p.kind === 'lesson' ? go(drawLesson, p.id) : go(startSkill, p.skill);
  }

  /* --- shop --- */
  function shopView(cat) {
    const w = W(); cat = cat || w.cat || 'plant'; w.cat = cat; save();
    const C = CATS.find(c => c.id === cat);
    const list = cat === 'land' ? LANDS.filter(l => l.p) : ITEMS.filter(i => i.c === cat);
    view.innerHTML = `${crumbs('🛒 World Shop')}
      <div class="mw-bar"><span class="mw-wallet"><b>⭐ ${wallet()}</b> to spend</span><button class="btn alt mw-earn" id="mwEarn">⭐ Need more stars?</button></div>
      <div class="mw-tabs" role="tablist">${CATS.map(c => `<button role="tab" class="mw-tab${c.id === cat ? ' on' : ''}" data-cat="${c.id}" aria-selected="${c.id === cat}"><span>${c.ico}</span>${c.n}</button>`).join('')}</div>
      <div class="mw-grid">${list.map(x => cat === 'land' ? landCard(x) : itemCard(x)).join('')}</div>`;
    wireBack(worldHome);
    $('#mwEarn').onclick = earn;
    sayScreen(`${C.n}. You have ${wallet()} stars. Tap something to see it.`);
    view.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => go(shopView, b.dataset.cat));
    view.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => buySheet(BY[b.dataset.buy]));
    view.querySelectorAll('[data-land]').forEach(b => b.onclick = () => buySheet(LBY[b.dataset.land]));
  }
  function itemCard(it) {
    const have = W().items.filter(o => o.id === it.id).length, can = wallet() >= it.p, need = needLand(it);
    return `<button class="mw-card${can ? '' : ' mw-poor'}${it.rare ? ' mw-rare' : ''}" data-buy="${it.id}" aria-label="${esc(it.n)}, ${it.p} stars${it.hab ? ', needs ' + esc(habName(it)) : ''}${have ? `, you have ${have}` : ''}">
      ${it.rare ? '<span class="mw-rtag">Rare!</span>' : ''}<span class="mw-cg">${glyph(it)}</span><b>${esc(it.n)}</b>
      <span class="mw-price">${it.p} ⭐</span>${it.hab ? `<span class="mw-hab${need ? ' no' : ''}">${need ? '🔒 Needs' : '🏡 Lives on'} ${esc(habName(it))}</span>` : ''}${have ? `<span class="mw-have">You have ${have}</span>` : ''}</button>`;
  }
  function landCard(L) {
    const own = owned(L.id), can = wallet() >= L.p;
    return `<button class="mw-card mw-lcard${own ? ' mw-own' : can ? '' : ' mw-poor'}" ${own ? 'aria-disabled="true"' : ''} data-land="${L.id}" aria-label="${esc(L.n)}, ${own ? 'yours' : L.p + ' stars'}">
      <span class="mw-lpic">${blockSVG(L)}<span>${L.e}</span></span><b>${esc(L.n)}</b>${own ? '<span class="mw-have">✅ Yours!</span>' : `<span class="mw-price">${L.p} ⭐</span>`}</button>`;
  }
  // The buy card shows the subtraction, reads it aloud, and asks it as a quick question from age 7.
  function buySheet(x) {
    const land = !!LBY[x.id] && !x.c, w = W(), have = wallet(), cost = x.p, nm = x.n, low = nm.toLowerCase();
    if (land && owned(x.id)) { say(`${nm} is already yours! ${x.f}`); return; }
    const need = land ? null : needLand(x), full = !land && w.items.length >= MAXI;
    const pic = land ? `<span class="mw-lpic big">${blockSVG(x)}<span>${x.e}</span></span>` : `<span class="mw-sg">${glyph(x)}</span>`;
    let body, speak;
    if (full) { body = `<p class="mw-math">Your world has ${MAXI} things already. That is the most! Put some away or enjoy the ones you have.</p>`; speak = `Your world is full of things already!`; }
    else if (need) { body = `<p class="mw-math">🔒 The ${esc(low)} needs <b>${esc(habName(x))}</b>. First buy ${esc(need.n)} for ${need.p}⭐.</p><div class="mw-acts"><button class="btn leaf" id="mwGoLand">${need.e} See ${esc(need.n)}</button></div>`; speak = `The ${low} needs ${habName(x)}. First buy ${need.n} for ${need.p} stars.`; }
    else if (have < cost) { body = `<p class="mw-math">You have <b>${have}⭐</b>. The ${esc(low)} costs <b>${cost}⭐</b>.<br>You need <b>${cost} − ${have} = ${cost - have}</b> more stars.</p><div class="mw-acts"><button class="btn leaf" id="mwEarn2">⭐ Earn more stars</button></div>`; speak = `You have ${have} stars. The ${low} costs ${cost} stars. You need ${cost} minus ${have}, that is ${cost - have} more stars. Learn and play to earn them!`; }
    else if (st.age >= 7) { body = `<p class="mw-math">You have <b>${have}⭐</b>. The ${esc(low)} costs <b>${cost}⭐</b>.</p><p class="mw-q">Quick check! How many stars will be left?<br><b>${have} − ${cost} = ?</b></p><div class="mw-qc">${numChoices(have - cost, 0, have + 10).map(c => `<button class="btn alt" data-ans="${c.val}">${c.html}</button>`).join('')}</div><p class="note" id="mwQn" aria-live="polite"></p>`; speak = `You have ${have} stars. The ${low} costs ${cost}. Quick check! ${have} minus ${cost} is what?`; }
    else { body = `<p class="mw-math">You have <b>${have}⭐</b>. The ${esc(low)} costs <b>${cost}⭐</b>.<br><b>${have} − ${cost} = ${have - cost}</b> left!</p><div class="mw-acts"><button class="btn leaf" id="mwBuy">✅ Buy it!</button></div>`; speak = `You have ${have} stars. The ${low} costs ${cost} stars. ${have} minus ${cost} is ${have - cost}. You will have ${have - cost} left!`; }
    const sh = document.createElement('div'); sh.className = 'mw-sheet'; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true'); sh.setAttribute('aria-label', nm);
    sh.innerHTML = `<div class="mw-sc"><div class="mw-sh">${pic}<div><h2>${esc(nm)}</h2><p>${esc(x.f)}</p>${!land && x.hab && !need ? `<p class="mw-hab">🏡 Lives on ${esc(habName(x))}</p>` : ''}${!land && x.bloom ? '<p class="mw-hab">🌱 Starts as a seedling and blooms in 2 days</p>' : ''}${!land && x.fr ? `<p class="mw-hab">${x.fr} Grows fruit every day: pick it for a bonus star</p>` : ''}${!land && x.c === 'animal' ? `<p class="mw-hab">${x.fd || '🥕'} Feed it once a day to keep it happy</p>` : ''}</div></div>${body}<button class="mw-close btn alt" id="mwNo">Not now</button></div>`;
    view.appendChild(sh);
    const close = () => sh.remove();
    sh.querySelector('#mwNo').onclick = close;
    sh.addEventListener('click', e => { if (e.target === sh) close(); });
    say(speak);
    const b = sh.querySelector('#mwBuy'); if (b) b.onclick = () => buy(x, land, sh);
    const e2 = sh.querySelector('#mwEarn2'); if (e2) e2.onclick = earn;
    const gl = sh.querySelector('#mwGoLand'); if (gl) gl.onclick = () => go(shopView, 'land');
    sh.querySelectorAll('[data-ans]').forEach(a => a.onclick = () => {
      if (+a.dataset.ans === have - cost) { a.classList.add('right'); buy(x, land, sh); return; }
      oops(); a.disabled = true; a.classList.add('wrong');
      const t = `Not quite. Count up from ${cost} to ${have}. That is ${have - cost}. Try again!`; sh.querySelector('#mwQn').textContent = t; say(t);
    });
    try { sh.querySelector('button').focus({ preventScroll: true }); } catch (e) {}
  }
  function buy(x, land, sh) {
    const w = W(); if (sh.dataset.done) return; sh.dataset.done = '1';
    if (wallet() < x.p) return;
    w.spent += x.p;
    if (land) { w.lands.push(x.id); save(); updateTop(); go(worldHome, { land: x.id }); return; }
    const o = { u: ++w.n, id: x.id, x: null, y: null, t: day() };
    w.items.push(o); w.got[x.id] = 1; save(); yay(); confetti(18);
    go(worldHome, { place: o.u });
  }

  /* --- sticker book --- */
  function bookView() {
    const w = W(), all = ITEMS.length + LANDS.length - 1, got = Object.keys(w.got).filter(k => BY[k]).length + w.lands.length - 1;
    view.innerHTML = `${crumbs('📖 World sticker book')}
      <div class="mw-sum"><b>${got} of ${all}</b> collected<span class="bar big-bar" aria-hidden="true"><i style="width:${Math.round(got / all * 100)}%"></i></span></div>
      <h3 class="section-title">🏅 Goals <span class="tag">bonus stars</span></h3>
      <div class="mw-goals">${MS.map(m => `<div class="mw-goal${w.ms[m[0]] ? ' on' : ''}"><span>${w.ms[m[0]] ? m[1] : '🔒'}</span><b>${m[2]}</b><small>${m[3]}</small><i>${w.ms[m[0]] ? '✅ Done' : `+${m[4]} ⭐`}</i></div>`).join('')}</div>
      ${CATS.map(c => { const list = c.id === 'land' ? LANDS.filter(l => l.p) : ITEMS.filter(i => i.c === c.id), n = list.filter(x => c.id === 'land' ? owned(x.id) : w.got[x.id]).length;
        return `<h3 class="section-title">${c.ico} ${c.n} <span class="tag">${n} of ${list.length} ${c.one}</span></h3><div class="mw-stk">${list.map(x => { const has = c.id === 'land' ? owned(x.id) : w.got[x.id];
          return `<button class="mw-sk${has ? ' on' : ''}" data-sk="${x.id}" aria-label="${has ? esc(x.n) : 'Not found yet: ' + esc(x.n)}">${c.id === 'land' ? `<span class="mw-e">${x.e}</span>` : glyph(x)}<small>${has ? esc(x.n) : `${x.p}⭐`}</small></button>`; }).join('')}</div>`; }).join('')}`;
    wireBack(worldHome);
    sayScreen(`Your sticker book. You collected ${got} of ${all} things. Tap a sticker to hear about it.`);
    view.querySelectorAll('[data-sk]').forEach(b => b.onclick = () => { const x = BY[b.dataset.sk] || LBY[b.dataset.sk], has = BY[x.id] ? w.got[x.id] : owned(x.id); tone([700]); say(has ? `${x.n}! ${x.f}` : `The ${x.n.toLowerCase()} costs ${x.p} stars in the shop.`); });
  }

  function worldHome(opt) { screen(opt); }
  worldHome.wallet = wallet;
  worldHome.info = () => ({ items: ITEMS.length, lands: LANDS.length - 1, animals: ITEMS.filter(i => i.c === 'animal').length, minP: Math.min(...ITEMS.map(i => i.p)), maxP: Math.max(...ITEMS.map(i => i.p)), landMin: Math.min(...LANDS.filter(l => l.p).map(l => l.p)), landMax: Math.max(...LANDS.map(l => l.p)) });
  if (location.hash === '#selftest') window.__world = {
    ITEMS, LANDS, MS, CATS, terr, whyNot: (id, x, y) => whyNot(BY[id], x, y), wallet, day, open: o => go(worldHome, o), shop: c => go(shopView, c), book: () => go(bookView),
    get w() { return W(); }, get ui() { return ui; }, set shift(v) { shift = v; }, get shift() { return shift; }, set hour(v) { hourSet = v; }, render: () => render(),
    // Screen point of a cell's middle, after scrolling it into the middle of the map window.
    cell(x, y) { const cs = ZOOMS[W().z], vp = ui.vp; vp.scrollLeft = (x + .5) * cs - vp.clientWidth / 2; vp.scrollTop = (y + .5) * cs - vp.clientHeight / 2; vp.scrollIntoView({ block: 'nearest' }); const r = ui.map.getBoundingClientRect(); return { x: r.left + (x + .5) * cs, y: r.top + (y + .5) * cs }; }
  };
  return worldHome;
})();
