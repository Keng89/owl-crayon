/* ---------- English & Reading, part 4: a bigger word book (age tiers), more stories, word-play data ---------- */
// Word tiers: 1 = first words (age 4–6), 2 = more words (6–8), 3 = big words (8+), each big word with a child-friendly meaning.
// Tier 1 and 2 lists are "word:emoji" joined by commas; tier 3 lists are "word:emoji:meaning" joined by "|".
// New topics are added to EN_VOCAB, and extra words are added to the first 16 topics. A word already in the book is skipped.
const EN_TOPICS2 = [
  { id: 'ocean', ico: '🌊', name: 'Ocean',
    w1: 'shark:🦈,seal:🦭,starfish:⭐,lobster:🦞,shrimp:🦐,squid:🦑,sand:🏖️,bubble:🫧,anchor:⚓,sail:⛵,pirate:🏴‍☠️,treasure:💰,diver:🤿,surfboard:🏄,sandcastle:🏰,clownfish:🐠,pufferfish:🐡',
    w2: 'coral:🪸,seaweed:🌿,pearl:🦪,snorkel:🤿,orca:🐋,walrus:🦭,seahorse:🐴,sea turtle:🐢,coast:🏖️,ferry:⛴️,life jacket:🦺,net:🥅,tide:🌊,seagull:🐦',
    w3: 'tentacle:🐙:a long bendy arm, like the eight arms of an octopus|shipwreck:🚢:a ship that sank to the bottom of the sea|marine:🐠:to do with the sea|voyage:⛵:a long trip across the sea|horizon:🌅:the line far away where the sky meets the sea|barnacle:🐚:a tiny shell animal that sticks to rocks and boats|plankton:🦠:tiny living things that float in the sea|current:🌊:water moving along in one direction' },
  { id: 'space', ico: '🚀', name: 'Space',
    w1: 'planet:🪐,alien:👽,UFO:🛸,comet:☄️,telescope:🔭,sky:🌌,night:🌃,space:🌌,spaceship:🚀,moon buggy:🚙',
    w2: 'satellite:🛰️,Mars:🔴,Saturn:🪐,Jupiter:🟠,galaxy:🌌,meteor:☄️,crater:🕳️,launch:🚀,spacesuit:🧑‍🚀,moonlight:🌙,sunrise:🌅,sunset:🌇,shooting star:🌠,countdown:🔟,space station:🛰️',
    w3: 'gravity:🍎:the pull that makes things fall down to the ground|universe:🌌:everything there is, all the stars and planets|constellation:✨:a group of stars that makes a picture in the sky|asteroid:🪨:a big space rock that goes around the sun|eclipse:🌑:when the moon hides the sun for a little while|orbit:🔄:the path something takes going around and around a planet or star|astronomer:🔭:a scientist who studies the stars and planets|weightless:🎈:floating with no weight, like astronauts in space' },
  { id: 'farm', ico: '🚜', name: 'Farm',
    w1: 'barn:🛖,hen:🐔,rooster:🐓,chick:🐤,lamb:🐑,calf:🐄,piglet:🐖,pony:🐎,donkey:🐴,goose:🦢,turkey:🦃,hay:🌾,fence:🚧,mud:🟤,egg basket:🧺',
    w2: 'scarecrow:🧑‍🌾,sheepdog:🐕,wool:🧶,saddle:🏇,haystack:🌾,pumpkin:🎃,beehive:🍯,stable:🐴,pond:🦆,ox:🐂,buffalo:🐃,llama:🦙,bull:🐂,ram:🐏,wheat:🌾',
    w3: 'harvest:🧺:picking the crops when they are ready|livestock:🐄:the animals kept on a farm|orchard:🍎:a field full of fruit trees|graze:🐑:to eat grass in a field|shear:✂️:to cut the wool off a sheep|plow:🚜:to dig up the soil before planting|crop:🌽:plants a farmer grows to eat or to sell' },
  { id: 'bugs', ico: '🐞', name: 'Insects & bugs',
    w1: 'ant:🐜,ladybug:🐞,bug:🐛,worm:🪱,snail:🐌,fly:🪰,beetle:🪲,cricket:🦗,mosquito:🦟,caterpillar:🐛,cockroach:🪳,web:🕸️,wing:🕊️',
    w2: 'grasshopper:🦗,firefly:✨,moth:🦋,scorpion:🦂,centipede:🐛,anthill:🐜,hive:🐝,cocoon:🐛,stinger:🐝,buzz:🐝,dragonfly:🪰,ladybird:🐞',
    w3: 'insect:🐜:a small animal with six legs|antennae:🐜:the two feelers on a bug\'s head|metamorphosis:🦋:a big change, like a caterpillar turning into a butterfly|colony:🐜:a big group of insects living together|camouflage:🦗:colors and shapes that help an animal hide|nectar:🌸:the sweet juice inside flowers that bees drink|pollen:🌼:yellow dust inside flowers|larva:🐛:a baby insect that looks like a little worm' },
  { id: 'music', ico: '🎵', name: 'Music',
    w1: 'song:🎶,violin:🎻,trumpet:🎺,flute:🎶,band:🎸,radio:📻,microphone:🎤,notes:🎵,loud:📢,quiet:🤫,banjo:🪕,headphones:🎧,saxophone:🎷,accordion:🪗',
    w2: 'concert:🎫,drummer:🥁,beat:🥁,tune:🎶,lullaby:🌙,music box:🎼,disco ball:🪩,cello:🎻,choir:🎤,keyboard:🎹,whistle:😗,hum:🎵',
    w3: 'rhythm:🥁:the beat in music that you can clap to|melody:🎶:the tune of a song|orchestra:🎻:a big group of musicians playing together|composer:🎼:a person who writes music|conductor:🪄:the leader who waves a little stick to guide the musicians|instrument:🎺:a thing you play to make music|tempo:⏱️:how fast or slow music goes|chorus:🎤:the part of a song that comes again and again' },
  { id: 'sports', ico: '⚽', name: 'Sports',
    w1: 'soccer:⚽,basketball:🏀,baseball:⚾,tennis:🎾,football:🏈,golf:⛳,goal:🥅,team:👥,race:🏁,win:🏆,medal:🏅,skate:⛸️,ski:🎿,kick:🦵,jump:🤸,catch:🧤,throw:🥏,bowling:🎳,volleyball:🏐,hockey:🏒,karate:🥋',
    w2: 'coach:📋,player:🏃,score:🔢,cheer:📣,gym:🏋️,yoga:🧘,rowing:🚣,fishing:🎣,archery:🏹,badminton:🏸,ping-pong:🏓,gymnastics:🤸,rugby:🏉,boxing:🥊,cricket bat:🏏',
    w3: 'athlete:🏃:a person who trains hard and is good at sport|champion:🏆:the winner of a contest|tournament:🏅:a big contest with lots of games|opponent:🤼:the person or team you play against|stamina:🔋:the energy to keep going for a long time|teamwork:🤝:working well together as a team|sportsmanship:🤝:being kind and fair when you win or lose|marathon:🏃:a very, very long running race' },
  { id: 'kitchen', ico: '🍳', name: 'Kitchen',
    w1: 'fridge:🧊,pot:🍲,kettle:🫖,glass:🥛,bottle:🍼,jar:🫙,napkin:🧻,table:🍽️,salt:🧂,sugar:🍬,butter:🧈,chopsticks:🥢,stove:🔥,sink:🚰,mug:☕,straw:🥤',
    w2: 'toaster:🍞,whisk:🥄,ladle:🥄,rolling pin:🥖,cutting board:🔪,recipe:📜,lunchbox:🍱,tray:🍽️,mixing bowl:🥣,oven mitt:🧤,oven:🔥,apron:🧑‍🍳,teapot:🫖,blender:🥤',
    w3: 'ingredient:🥚:one of the things you mix together to make a food|delicious:😋:tastes very, very good|simmer:🍲:cook slowly, just below boiling|measure:🥄:find out how much there is|utensil:🍴:a tool for cooking or eating|appetite:😋:the feeling of wanting to eat|sizzle:🍳:the hissing sound of food frying in a pan|crispy:🥓:hard and crunchy in a yummy way' },
  { id: 'garden', ico: '🌻', name: 'Garden',
    w1: 'seed:🌱,rose:🌹,tulip:🌷,sunflower:🌻,daisy:🌼,plant:🪴,bush:🌳,hose:🚿,bench:🪑,garden:🏡,vegetable:🥕,weed:🌿,petal:🌸,stem:🌱,soil:🟤,fruit:🍓,watering can:🚿,bird bath:🐦',
    w2: 'greenhouse:🏡,wheelbarrow:🛒,compost:🍂,bud:🌷,blossom:🌸,hedge:🌳,vine:🍇,fountain:⛲,sprout:🌱,lawn mower:🚜,root:🥕,birdhouse:🏠,pot plant:🪴',
    w3: 'bloom:🌸:when a flower opens up|wilt:🥀:droop and go floppy without water|fertilizer:🧪:plant food that helps things grow|photosynthesis:☀️:how plants make their food from sunlight|seedling:🌱:a very young plant|prune:✂️:cut bits off a plant to help it grow better|germinate:🌱:when a seed starts to grow|fragrant:🌹:smelling sweet and nice' },
  { id: 'city', ico: '🏙️', name: 'In the city',
    w1: 'street:🛣️,road:🛣️,traffic light:🚦,sign:🪧,tower:🗼,building:🏢,apartment:🏢,crosswalk:🚸,bus stop:🚏,cafe:☕,statue:🗽,crowd:👥,zoo:🦁,playground:🛝,office:🏢,elevator:🛗,stairs:🪜,sidewalk:🚶,map:🗺️,fire hydrant:🧯',
    w2: 'skyscraper:🏙️,downtown:🌆,neighborhood:🏘️,mall:🛍️,cinema:🎬,theater:🎭,gas station:⛽,parking lot:🅿️,police station:🚓,fire station:🚒,train station:🚉,highway:🛣️,tunnel:🚇,ferris wheel:🎡',
    w3: 'pedestrian:🚶:a person walking on the street|traffic:🚗:all the cars and buses moving on the roads|citizen:🧑:a person who belongs to a town or country|skyline:🌆:the shape of the tall buildings against the sky|mayor:🧑‍💼:the leader of a town or city|landmark:🗽:a famous building or place that is easy to spot|population:👥:how many people live in a place|urban:🏙️:to do with towns and cities' },
  { id: 'holidays', ico: '🎉', name: 'Holidays & parties',
    w1: 'birthday:🎂,present:🎁,gift:🎁,card:💌,Christmas:🎄,Santa:🎅,Halloween:🎃,costume:🦸,mask:🎭,fireworks:🎆,parade:🎊,egg hunt:🥚,bunny:🐰,valentine:💝,lantern:🏮,sparkler:🎇,gingerbread:🍪,stocking:🧦,candy:🍬,piñata:🪅,holiday:🏖️,vacation:✈️,picnic:🧺',
    w2: 'decorations:🎊,celebrate:🥳,invitation:💌,guest:🙋,festival:🎪,carnival:🎡,Diwali:🪔,Hanukkah:🕎,Thanksgiving:🦃,Lunar New Year:🧧,Eid:🌙,New Year:🎆,wrapping paper:🎁',
    w3: 'tradition:🕯️:something a family does the same way every year|celebration:🎉:a happy party for a special day|anniversary:💐:the same date each year that something special happened|festive:🎊:bright and happy, ready to celebrate|generous:🎁:happy to give and share|custom:🧧:the usual way people do something' },
  { id: 'shapes', ico: '🔷', name: 'Shapes',
    w1: 'circle:⚪,square:🟥,triangle:🔺,rectangle:🚪,oval:🥚,diamond:🔷,line:➖,dot:⚫,cross:✖️,arrow:➡️,crescent:🌙,spiral:🌀,cube:🧊,cone:🍦,cylinder:🥫,sphere:🌐',
    w2: 'octagon:🛑,curve:〰️,corner:📐,side:📏,zigzag:⚡,straight:📏,round:⭕,pyramid:🔺,heart shape:❤️,star shape:⭐',
    w3: 'symmetry:🦋:when both halves match, like in a mirror|parallel:🛤️:lines that never meet, like train tracks|angle:📐:the corner where two lines meet|diagonal:↘️:a slanting line from corner to corner|semicircle:🌗:half of a circle|solid:🧊:a shape you can hold, with length, width and height' },
  { id: 'numbers', ico: '🔢', name: 'Number words',
    w1: 'zero:0️⃣,one:1️⃣,two:2️⃣,three:3️⃣,four:4️⃣,five:5️⃣,six:6️⃣,seven:7️⃣,eight:8️⃣,nine:9️⃣,ten:🔟,eleven:1️⃣1️⃣,twelve:1️⃣2️⃣,first:🥇,second:🥈,third:🥉,hundred:💯,half:🌗',
    w2: 'thirteen:1️⃣3️⃣,fourteen:1️⃣4️⃣,fifteen:1️⃣5️⃣,sixteen:1️⃣6️⃣,seventeen:1️⃣7️⃣,eighteen:1️⃣8️⃣,nineteen:1️⃣9️⃣,twenty:2️⃣0️⃣,thirty:3️⃣0️⃣,fifty:5️⃣0️⃣,thousand:🔢,dozen:🥚,pair:🧦,double:✌️,last:🏁,quarter:🍕',
    w3: 'million:🌌:a thousand thousands. A huge number!|estimate:🤔:a clever guess about how many|equal:⚖️:the same amount|odd:🧦:a number like 1, 3 or 5 that cannot make pairs|even:👟:a number like 2, 4 or 6 that makes pairs|total:➕:all of them added together' },
  { id: 'time', ico: '📅', name: 'Time, days & months',
    w1: 'day:🌞,morning:🌅,afternoon:🌤️,evening:🌆,today:📅,tomorrow:➡️,yesterday:⬅️,week:🗓️,Monday:📅,Tuesday:📅,Wednesday:📅,Thursday:📅,Friday:🎉,Saturday:🛝,Sunday:☀️,bedtime:🛏️,breakfast:🥞,lunch:🥪,dinner:🍝',
    w2: 'January:❄️,February:💝,March:🌬️,April:🌧️,May:🌷,June:☀️,July:🏖️,August:🍉,September:🍎,October:🎃,November:🍂,December:🎄,month:🗓️,year:📆,hour:🕐,minute:⏱️,weekend:🛋️,calendar:📅,noon:🕛,midnight:🕛,season:🍂,watch:⌚,early:🐓,late:🌙',
    w3: 'century:💯:one hundred years|decade:🔟:ten years|schedule:📋:a plan of what happens at what time|punctual:⏰:right on time, not late|fortnight:🗓️:two weeks|ancient:🏛️:very, very old|future:🚀:the time that has not come yet|past:🦖:the time that has already happened' },
  { id: 'describe', ico: '✨', name: 'Describing words',
    w1: 'big:🐘,small:🐭,tall:🦒,short:📏,fast:🐆,slow:🐢,soft:🧸,hard:🪨,wet:💧,dry:🏜️,clean:🧼,dirty:🐷,new:✨,old:👴,empty:🫙,long:🐍,funny:🤡,pretty:🌸,heavy:🏋️,light:🪶,dark:🌑,bright:🔆,sweet:🍭,sour:🍋,fluffy:🐑,spiky:🦔,shiny:💎,sticky:🍯,tiny:🐜,huge:🐋,noisy:🥁,little:🐣',
    w2: 'gentle:🕊️,strong:💪,kind:🤗,clever:🦉,colorful:🌈,sparkly:✨,smelly:🧦,crunchy:🥕,fuzzy:🧸,squishy:🧽,cozy:🛋️,stripy:🦓,wobbly:🍮,thin:📏,thick:📚,deep:🌊,warm:🧣,busy:🐝,lucky:🍀,bumpy:🐊,smooth:🥚,giant:🦕',
    w3: 'enormous:🐋:very, very big|curious:🧐:wanting to know and find out things|minuscule:🐜:so small you can hardly see it|magnificent:🦚:very beautiful and grand|fragile:🥚:easy to break, so be gentle|gigantic:🦕:huge, as big as a giant|delightful:🌈:very lovely and pleasing|mysterious:🕵️:strange and hard to explain|peculiar:🦄:strange and unusual|fierce:🐯:wild and strong and a bit scary|graceful:🦢:moving in a smooth, beautiful way|ferocious:🦖:very fierce and wild|timid:🐭:shy and easily scared|vivid:🎨:very bright and strong, like bold colors|dazzling:💎:so bright and sparkly it almost hurts your eyes|marvelous:🌟:wonderful|ordinary:🥔:normal, nothing special|exhausted:🥱:very, very tired|furious:😡:very, very angry|gleeful:😁:full of happy joy|enchanting:🧚:magical and charming|splendid:🏰:very good and grand|ridiculous:🤪:very silly and funny' },
  { id: 'verbs', ico: '🤸', name: 'More action words',
    w1: 'hop:🐇,sit:🪑,stand:🧍,push:👐,pull:💪,open:📂,close:📁,give:🎁,take:🤲,look:👀,listen:👂,talk:🗣️,smile:😊,wash:🧼,brush:🪥,play:🎮,build:🧱,help:🤝,hide:🙈,find:🔍,carry:🎒,fall:🍂,shout:📢,whisper:🤫,sneeze:🤧,yawn:🥱,splash:💦,dig:⛏️,bake:🧁,share:🍪',
    w2: 'tiptoe:🩰,stretch:🧘,wiggle:🐛,giggle:🤭,march:🥁,crawl:👶,juggle:🤹,chase:🐕,gallop:🐎,scribble:🖍️,bounce:🏀,float:🛟,spin:🌀,pour:🫗,squeeze:🍋,sprinkle:🧂,explore:🧭,shiver:🥶,sniff:👃,wink:😉',
    w3: 'investigate:🔍:look carefully to find out the truth|imagine:💭:make a picture in your mind|discover:🗺️:find something for the very first time|create:🎨:make something new|tumble:🤸:fall over and roll|scurry:🐭:run with quick little steps|soar:🦅:fly high up in the sky|clamber:🧗:climb using your hands and feet|devour:😋:eat something hungrily and fast|wander:🚶:walk slowly with no special place to go|whimper:🐶:make small, sad crying sounds|gaze:👀:look at something for a long time|stumble:🤕:trip and nearly fall|persevere:💪:keep trying even when it is hard' },
  { id: 'fantasy', ico: '🐉', name: 'Dinosaurs & magic',
    w1: 'dinosaur:🦖,dragon:🐉,unicorn:🦄,fairy:🧚,mermaid:🧜‍♀️,wizard:🧙,witch:🧙‍♀️,ghost:👻,monster:👾,princess:👸,prince:🤴,king:🤴,queen:👸,knight:🛡️,magic:✨,wand:🪄,T-rex:🦖,troll:🧌',
    w2: 'superhero:🦸,villain:🦹,genie:🧞,elf:🧝,vampire:🧛,potion:🧪,spell:✨,cave:🪨,fossil:🦴,claw:🦅,horn:🦏,giant egg:🥚,treasure map:🗺️',
    w3: 'legend:📜:an old, old story that people tell again and again|quest:🗺️:a long search for something important|extinct:🦴:gone forever, none left alive anywhere|enchanted:🪄:under a magic spell|paleontologist:🦴:a scientist who digs up dinosaur fossils|triceratops:🦕:a plant-eating dinosaur with three horns|pterodactyl:🦅:a flying reptile from dinosaur times|mythical:🐉:from old stories, not real' },
  { id: 'camping', ico: '⛺', name: 'Camping & outdoors',
    w1: 'tent:⛺,campfire:🔥,flashlight:🔦,compass:🧭,marshmallow:🍡,sleeping bag:🛌,hike:🥾,lake:🏞️,waterfall:🏞️,log:🪵,stick:🪵,deer:🦌,squirrel:🐿️,hedgehog:🦔,raccoon:🦝,wolf:🐺,cabin:🛖,rope:🪢',
    w2: 'trail:🥾,binoculars:🔭,canteen:🧴,bug spray:🦟,hammock:🌴,firewood:🪵,boots:🥾,campsite:🏕️,tracks:🐾',
    w3: 'wilderness:🏕️:wild land where very few people live|shelter:⛺:a safe place out of the rain and wind|adventure:🧭:an exciting trip full of surprises|navigate:🧭:find the way to go|nocturnal:🦉:awake at night and asleep in the day|habitat:🌲:the home where an animal or plant lives|summit:🏔️:the very top of a mountain|trek:🥾:a long, hard walk' }
];
// Extra words for the first 16 topics.
const EN_MORE = {
  animals: { w2: 'hamster:🐹,parrot:🦜,peacock:🦚,flamingo:🦩,swan:🦢,eagle:🦅,gorilla:🦍,hippo:🦛,rhino:🦏,crocodile:🐊,koala:🐨,panda:🐼,sloth:🦥,otter:🦦,skunk:🦨,bat:🦇,leopard:🐆,polar bear:🐻‍❄️,puppy:🐶,kitten:🐱,lizard:🦎,beaver:🦫',
    w3: 'chameleon:🦎:a lizard that can change its color|hibernate:🐻:sleep through the whole winter|predator:🦈:an animal that hunts other animals|herbivore:🦒:an animal that eats only plants|carnivore:🦁:an animal that eats meat|mammal:🐋:an animal that feeds its babies milk, like dogs, whales and people|reptile:🐊:a cold-blooded animal with scales, like a snake|amphibian:🐸:an animal that lives in water and on land, like a frog' },
  food: { w2: 'avocado:🥑,coconut:🥥,blueberry:🫐,kiwi:🥝,mango:🥭,cucumber:🥒,pepper:🫑,onion:🧅,garlic:🧄,pancake:🥞,waffle:🧇,popcorn:🍿,pretzel:🥨,taco:🌮,burrito:🌯,dumpling:🥟,sushi:🍣,spaghetti:🍝,hot dog:🌭,burger:🍔,fries:🍟,cupcake:🧁,donut:🍩,chocolate:🍫,lollipop:🍭,cereal:🥣,salad:🥗,beans:🫘,peanut:🥜,bacon:🥓,drumstick:🍗,croissant:🥐',
    w3: 'nutritious:🥦:full of the good things your body needs|vegetarian:🥗:a person who does not eat meat|beverage:🧃:a drink|savory:🧀:salty and tasty, not sweet|ripe:🍌:ready to eat' },
  clothes: { w2: 'jacket:🧥,pajamas:🛌,sweater:🧶,mittens:🧤,sandals:🩴,slippers:🥿,skirt:👗,necklace:📿,helmet:⛑️,sneakers:👟,button:🔘,zipper:🤐,pocket:👖,sunglasses:🕶️,bow tie:🎀,ribbon:🎀,kimono:👘,sari:🥻,lab coat:🥼,goggles:🥽,raincoat:🧥',
    w3: 'wardrobe:🚪:a big cupboard where you hang clothes|outfit:👗:a set of clothes worn together|fabric:🧵:cloth that clothes are made from|waterproof:☔:keeps water out, so you stay dry' },
  toys: { w1: 'marbles:🔮,jump rope:🪢,slide:🛝,swing:🎠,bubbles:🫧,sandbox:🏖️,toy car:🚗,train set:🚂,board game:🎲,cards:🃏,jigsaw:🧩,frisbee:🥏,hula hoop:⭕,toy box:🧸,pinwheel:🎐',
    w2: 'carousel:🎠,action figure:🦸,spinning top:🌀,rocking horse:🐴,trampoline:🤸,puppet:🧦,building set:🧱',
    w3: 'kaleidoscope:🔮:a tube with colored bits inside that make pretty patterns when you turn it|imagination:💭:making up pictures and stories in your head' },
  body: { w1: 'knee:🦵,toe:🦶,chin:🧔,cheek:☺️,neck:🦒,tummy:😋,elbow:💪',
    w2: 'shoulder:🤷,eyebrow:🤨,wrist:⌚,skin:✋,muscle:💪,blood:🩸,lungs:🫁,ankle:🦶,palm:🤚,heel:🦶,belly button:🔘',
    w3: 'skeleton:💀:all the bones inside your body joined together|digestion:🍽️:how your body breaks down the food you eat|senses:👀:seeing, hearing, smelling, tasting and touching|pulse:❤️:the beat of your heart that you can feel in your wrist' },
  weather: { w1: 'sunny:☀️,cloudy:☁️,rainy:🌧️,windy:🌬️,snowy:❄️,rainbow:🌈',
    w2: 'hail:🧊,breeze:🍃,foggy:🌫️,icicle:🧊,frost:❄️,flood:🌊,thunder:⛈️,raindrop:💧,snowflake:❄️,sunshine:🌞',
    w3: 'forecast:📺:what the weather will probably be like|temperature:🌡️:how hot or cold something is|humid:💦:warm, damp and sticky air|blizzard:🌨️:a big snowstorm with strong wind|hurricane:🌀:a huge storm with very strong winds|drizzle:🌦️:very light rain|climate:🌍:the usual weather of a place' },
  feelings: { w2: 'sleepy:😪,cheeky:😜,giggly:🤭,shocked:😱,upset:😣,thankful:🙏,cranky:😾,lucky:🍀',
    w3: 'jealous:😒:wanting what someone else has|embarrassed:😳:feeling silly when everyone is looking|frustrated:😤:upset because something is hard|grateful:🙏:thankful|nervous:😬:a bit worried about what will happen|lonely:😔:sad because you are on your own|cheerful:😄:happy and bright|confident:😎:sure that you can do it|disappointed:😞:sad because something did not go the way you hoped|anxious:😰:very worried|delighted:😃:very pleased|patient:⏳:able to wait calmly' },
  school: { w1: 'classroom:🏫,desk:🪑,glue:🧴,chalk:🖍️,student:🧑‍🎓,alphabet:🔤,marker:🖊️,eraser:🧽,lunch:🥪',
    w2: 'whiteboard:📋,homework:📝,principal:🧑‍💼,recess:🛝,calculator:🧮,stapler:📎,paper clip:📎,sharpener:✏️,folder:📁,lesson:📖',
    w3: 'dictionary:📖:a book that tells you what words mean|encyclopedia:📚:a book full of facts about everything|experiment:🧪:a test to find out how something works|knowledge:🧠:all the things you know' },
  transport: { w1: 'van:🚐,digger:🚜,school bus:🚌,race car:🏎️,wagon:🛒,jet:✈️',
    w2: 'crane:🏗️,cable car:🚡,hot air balloon:🎈,sailboat:⛵,speedboat:🚤,yacht:🛥️,tram:🚋,garbage truck:🚛,parachute:🪂,monorail:🚝',
    w3: 'vehicle:🚗:a thing that carries people or things, like a car or a bus|passenger:🧳:a person riding in a car, bus, train or plane|journey:🗺️:a trip from one place to another|engine:⚙️:the machine that makes a vehicle go' },
  nature: { w1: 'hill:⛰️,pond:🦆,pebble:🪨,acorn:🌰,feather:🪶,jungle:🌴,palm tree:🌴,stream:🏞️',
    w2: 'valley:🏞️,pine cone:🌲,rainforest:🌴,iceberg:🧊,canyon:🏜️,coral reef:🪸,lava:🌋',
    w3: 'glacier:🧊:a giant, slow river of ice|erupt:🌋:burst out, like lava from a volcano|environment:🌍:the world around us: air, water, land and living things|recycle:♻️:use old things again to make new things|ecosystem:🌳:living things and their home, all working together|meadow:🌼:a field full of grass and wildflowers|boulder:🪨:a very big rock' },
  jobs: { w2: 'librarian:📚,plumber:🔧,cashier:🛒,zookeeper:🦓,gardener:🧑‍🌾,lifeguard:🛟,photographer:📷,dancer:💃,writer:✍️,carpenter:🪚,bus driver:🚌,magician:🎩,clown:🤡,waiter:🍽️',
    w3: 'architect:📐:a person who designs buildings|engineer:⚙️:a person who designs and builds machines, roads and bridges|veterinarian:🐾:an animal doctor|journalist:📰:a person who writes the news|inventor:💡:a person who makes something new that nobody made before|pharmacist:💊:a person who gives out medicine' },
  home: { w1: 'pillow:🛏️,blanket:🛌,rug:🟫,shelf:📚,roof:🏠,kitchen:🍳,bedroom:🛏️,bathroom:🛁,toothbrush:🪥,sponge:🧽,doorbell:🔔,fan:🌀',
    w2: 'curtain:🪟,garage:🚗,vacuum:🧹,washing machine:🫧,fireplace:🔥,attic:🏠,cupboard:🚪,drawer:🗄️,light switch:💡,remote:📺,mailbox:📫',
    w3: 'furniture:🛋️:tables, chairs, beds and sofas|appliance:🔌:a machine at home, like a fridge or a toaster|chore:🧹:a small job at home, like tidying up|tidy:🧹:neat, with everything put away' },
  family: { w2: 'grandparents:👴,daughter:👧,son:👦,niece:👧,nephew:👦,husband:🤵,wife:👰,toddler:🧒,teenager:🧑,adult:🧑,kid:🧒',
    w3: 'relative:👪:someone in your family|ancestor:📜:a family member who lived long, long ago|sibling:👫:a brother or a sister|generation:👴:all the people born at about the same time' },
  colors: { w2: 'navy:🔵,violet:🟣,cream:🍦,golden:🌟,rosy:🌹,beige:🏜️',
    w3: 'scarlet:🟥:a bright red|turquoise:🌊:a blue-green color, like a tropical sea|crimson:🍒:a deep, dark red|lavender:💜:a soft, light purple|emerald:💚:a bright green, like the jewel' },
  places: { w1: 'aquarium:🐠,bakery:🥐,swimming pool:🏊,supermarket:🛒,village:🏘️,town:🏘️,palace:🏯',
    w2: 'pharmacy:💊,church:⛪,mosque:🕌,temple:🛕,synagogue:🕍,theme park:🎢,barber shop:💈,country:🗺️,lighthouse:🗼',
    w3: 'continent:🌍:one of the seven huge pieces of land on Earth|capital:🏛️:the main city of a country|destination:📍:the place you are going to|border:🗺️:the line where one country ends and another begins' },
  actions: { w1: 'skip:🤸,kick:⚽,laugh:😂',
    w2: 'paddle:🛶,skate:⛸️,whistle:😗,knit:🧶,paint:🎨,fix:🔧' }
};
// Some first-book words are better for older readers.
const EN_TIER2 = 'microscope,thermometer,abacus,lightning,tornado,volcano,helicopter,scientist,mechanic,astronaut,museum,restaurant,factory,stadium,confused,worried,surprised,excited,neighbor,judge,mail carrier,post office,motorbike,subway,desert,island,cousin,parents,grumpy,proud,calm'.split(',');

(() => {
  const have = new Set(EN_VOCAB.flatMap(t => t.words.map(x => x.w.toLowerCase())));
  EN_VOCAB.forEach(t => t.words.forEach(x => { x.t = EN_TIER2.includes(x.w) ? 2 : 1; x.m = ''; }));
  const parse = (s, t) => !s ? [] : s.split(t === 3 ? '|' : ',').map(x => {
    const a = x.indexOf(':'), b = t === 3 ? x.indexOf(':', a + 1) : -1;
    return { w: x.slice(0, a).trim(), e: (b < 0 ? x.slice(a + 1) : x.slice(a + 1, b)).trim(), t, m: b < 0 ? '' : x.slice(b + 1).trim() };
  });
  const add = (topic, d) => { for (const x of [...parse(d.w1, 1), ...parse(d.w2, 2), ...parse(d.w3, 3)]) { const k = x.w.toLowerCase(); if (!x.w || !x.e || have.has(k)) continue; have.add(k); topic.words.push(x); } };
  for (const [id, d] of Object.entries(EN_MORE)) { const t = EN_VOCAB.find(v => v.id === id); if (t) add(t, d); }
  for (const d of EN_TOPICS2) { const t = { id: d.id, ico: d.ico, name: d.name, words: [] }; add(t, d); EN_VOCAB.push(t); }
})();
// Every word in the book, with its topic, for the word-play games, the review queue and the word album.
const EN_ALLWORDS = EN_VOCAB.flatMap(t => t.words.map(x => Object.assign(x, { topic: t.id })));
const EN_WORD = Object.fromEntries(EN_ALLWORDS.map(x => [x.w.toLowerCase(), x]));

// More stories (2 or 3 for every stage).
EN_STORIES.push(
  { id: 'bigbug', stage: 1, ico: '🐛', title: 'The Big Bug', pages: [
    ['🐛', 'Bud is a bug.'], ['🌿', 'Bud sits on a leaf.'], ['🐜', 'An ant can see Bud.'], ['🤝', 'The ant and Bud nod.'], ['🍃', 'Now Bud has a pal on the leaf.']],
    qs: [['Who is Bud?', 'a bug', 'a cat', 'a dog'], ['Where does Bud sit?', 'on a leaf', 'on a bed', 'on a bus'], ['Who sees Bud?', 'an ant', 'a hen', 'a fox']] },
  { id: 'samsun', stage: 1, ico: '☀️', title: 'Sam in the Sun', pages: [
    ['☀️', 'The sun is up. It is hot.'], ['🧒', 'Sam has a red cap.'], ['🏖️', 'Sam digs in the sand.'], ['🦀', 'A crab runs past Sam!'], ['😄', 'Sam and the crab have fun.']],
    qs: [['What color is the cap?', 'red', 'blue', 'green'], ['What does Sam dig in?', 'the sand', 'the mud', 'a box'], ['What runs past Sam?', 'a crab', 'a dog', 'a bus']] },
  { id: 'mumtrain', stage: 2, ico: '🚂', title: 'The Snack Train', pages: [
    ['🚂', 'Chug, chug! The little train went up the track.'], ['🍎', 'It had apples, milk and fresh bread for the town.'], ['⛰️', 'The hill was steep. The train went slow.'], ['💪', '"I can do it," said the train. "I can! I can!"'], ['🎉', 'At the top, the kids got their snacks and gave a big cheer.']],
    qs: [['What did the train carry?', 'snacks for the town', 'toys', 'sand'], ['Why did the train go slow?', 'the hill was steep', 'it was sleepy', 'it was lost'], ['What did the kids do at the end?', 'gave a cheer', 'went to bed', 'cried']] },
  { id: 'chickegg', stage: 2, ico: '🐣', title: 'Chick Pops Out', pages: [
    ['🥚', 'Hen sat on her egg all day.'], ['🔊', 'Tap, tap, tap! The egg went crack.'], ['🐣', 'Out came a wet little chick.'], ['🌞', 'The chick sat in the sun to get dry.'], ['🐥', 'Now it was a soft, fluffy chick that said cheep!']],
    qs: [['Who sat on the egg?', 'Hen', 'Duck', 'Frog'], ['What came out of the egg?', 'a chick', 'a snake', 'a fish'], ['What does the chick say?', 'cheep', 'moo', 'quack']] },
  { id: 'shellshop', stage: 2, ico: '🐚', title: 'The Shell Shop', pages: [
    ['🐚', 'Beth found ten shells on the beach.'], ['🧺', 'She put them on a rug to make a shop.'], ['🐕', 'Her dog Chip came to look.'], ['👃', 'Chip sniffed a shell and it went "pop"! A tiny crab ran out!'], ['😂', 'Beth and Chip laughed. Not every shell is for sale!']],
    qs: [['How many shells did Beth find?', 'ten', 'six', 'two'], ['What is the dog\'s name?', 'Chip', 'Max', 'Rex'], ['What was in the shell?', 'a tiny crab', 'a pearl', 'sand']] },
  { id: 'snowday', stage: 3, ico: '⛄', title: 'Snow Day', pages: [
    ['❄️', 'When Kate woke up, the whole street was white with snow.'], ['🧥', 'She put on her coat, her scarf and her blue mittens.'], ['⛄', 'Kate rolled three snowballs to make a snowman.'], ['🥕', 'She gave him a carrot nose and a hat that was too big.'], ['☕', 'Then she went inside for hot cocoa by the fire.']],
    qs: [['What color were the mittens?', 'blue', 'red', 'green'], ['How many snowballs did Kate roll?', 'three', 'one', 'ten'], ['What did Kate drink?', 'hot cocoa', 'cold milk', 'orange juice']] },
  { id: 'bakesale', stage: 3, ico: '🧁', title: 'The Bake Sale', pages: [
    ['🧁', 'Our class made cupcakes for the school bake sale.'], ['🥣', 'We mixed flour, eggs, sugar and a pinch of salt.'], ['🎂', 'Owen put pink frosting and sprinkles on top.'], ['💰', 'People came and paid one coin for each cupcake.'], ['📚', 'We used the money to buy new books for our library.']],
    qs: [['What did the class make?', 'cupcakes', 'cookies', 'pizza'], ['What went on top?', 'pink frosting', 'cheese', 'nothing'], ['What did they buy with the money?', 'new books', 'a bike', 'more cake']] },
  { id: 'moonbunny', stage: 3, ico: '🐰', title: 'Bunny and the Moon', pages: [
    ['🐰', 'Every night, Bunny looked up at the bright moon.'], ['🌙', 'She wanted to hop all the way up and say hello.'], ['🪜', 'She tried a tall ladder, but it was not tall enough.'], ['🌊', 'Then she saw the moon shining in the still lake.'], ['💤', '"Hello, Moon!" she whispered, and went home to sleep.']],
    qs: [['What did Bunny want to do?', 'say hello to the moon', 'eat a carrot', 'swim'], ['What did she try first?', 'a ladder', 'a rocket', 'a kite'], ['Where did she see the moon at the end?', 'in the lake', 'in a box', 'in her bed']] },
  { id: 'lostpup', stage: 4, ico: '🐕', title: 'The Curious Puppy', pages: [
    ['🐕', 'Biscuit was a curious puppy who wanted to sniff everything.'], ['🦋', 'One afternoon, he followed a butterfly out of the garden gate.'], ['🌳', 'Soon he was in the park, and he could not see his house anymore.'], ['👃', 'Biscuit remembered the smell of fresh pancakes from his kitchen and followed his nose.'], ['🏠', 'He got home just in time for dinner, and Dad fixed the gate.']],
    qs: [['What does "curious" mean?', 'wanting to find things out', 'very sleepy', 'very angry'], ['What did Biscuit follow?', 'a butterfly', 'a ball', 'a cat'], ['How did he find his way home?', 'he followed a smell', 'he took a bus', 'a bird showed him'], ['What did Dad fix?', 'the gate', 'the car', 'the roof']] },
  { id: 'volcano', stage: 4, ico: '🌋', title: 'The Science Fair Volcano', pages: [
    ['🌋', 'For the science fair, Priya built an enormous volcano out of paper and glue.'], ['🧪', 'Inside, she hid a cup with baking soda in it.'], ['🍋', 'When she poured in vinegar, red foam bubbled up and spilled down the sides.'], ['😲', 'Everyone gasped, and the foam even splashed the judge\'s shoes!'], ['🥈', 'Priya won second prize and promised to use a bigger tray next time.']],
    qs: [['What did Priya build?', 'a volcano', 'a rocket', 'a bridge'], ['What made the foam bubble up?', 'vinegar and baking soda', 'water and sugar', 'milk and juice'], ['What does "enormous" mean?', 'very big', 'very small', 'very wet'], ['What prize did Priya win?', 'second prize', 'first prize', 'no prize']] },
  { id: 'lighthouse', stage: 5, ico: '🗼', title: 'The Lighthouse Keeper', pages: [
    ['🗼', 'Old Mr. Finn had looked after the lighthouse on the rocky island for forty years.'], ['🌩️', 'One stormy night, the electricity failed and the great lamp went dark.'], ['⛵', 'Far out at sea, a small fishing boat was heading straight for the rocks.'], ['🏮', 'Mr. Finn climbed the spiral stairs with an old oil lantern and a mirror, and flashed the light across the waves.'], ['⚓', 'The fishermen saw the signal just in time, steered away, and brought him a basket of fish the next morning to say thank you.']],
    qs: [['Why did the lamp go dark?', 'the electricity failed', 'Mr. Finn was asleep', 'a bird broke it'], ['How did Mr. Finn make a light?', 'a lantern and a mirror', 'a campfire', 'a flashlight'], ['How did the fishermen say thank you?', 'with a basket of fish', 'with a letter', 'with a song'], ['What does "signal" mean here?', 'a sign that sends a message', 'a kind of fish', 'a loud storm']] },
  { id: 'inventor', stage: 5, ico: '💡', title: 'Zara\'s Invention', pages: [
    ['💡', 'Zara wanted to invent something that would help her grandmother, who often lost her glasses.'], ['📝', 'She sketched dozens of ideas, but none of them seemed quite right.'], ['🔔', 'Finally, she attached a tiny bell to the glasses and a clip to Grandma\'s favorite cardigan.'], ['😕', 'The first version jingled so loudly that the cat hid under the sofa for an hour!'], ['😊', 'After a few improvements, the bell became a gentle tinkle, and Grandma never lost her glasses again.']],
    qs: [['What did Grandma often lose?', 'her glasses', 'her keys', 'her cat'], ['What did Zara attach to the glasses?', 'a tiny bell', 'a magnet', 'a light'], ['Why did the cat hide?', 'the bell was too loud', 'it was cold', 'it was hungry'], ['What does "improvements" mean?', 'changes that make it better', 'mistakes', 'presents']] }
);

// Word-play data: story maker parts, rhyme songs, tongue twisters and "describe it" scenes.
const EN_TALE = {
  heroes: [['a brave little mouse', '🐭', 'mouse'], ['a dragon who loves cake', '🐉', 'dragon'], ['a robot named Bolt', '🤖', 'robot'], ['a princess with muddy boots', '👸', 'princess'],
    ['a wobbly penguin', '🐧', 'penguin'], ['a tiny dinosaur', '🦖', 'dinosaur'], ['a silly monkey', '🐵', 'monkey'], ['a superhero cat', '🐱', 'cat'], ['a sleepy bear', '🐻', 'bear'], ['a giggling unicorn', '🦄', 'unicorn']],
  places: [['on the moon', '🌙'], ['in a candy castle', '🏰'], ['under the sea', '🌊'], ['in a spooky forest', '🌲'], ['in a busy city', '🏙️'], ['on a pirate ship', '🏴‍☠️'], ['in a jungle', '🌴'], ['at the snowy North Pole', '❄️'], ['inside a giant cake', '🎂'], ['in a hot desert', '🏜️']],
  problems: [
    ['lost shoe', '👟', h => `${h} lost a favorite shoe`, h => `They looked high and low, and found the shoe on top of a sleepy whale`],
    ['hiccups', '😵', h => `${h} got the hiccups and could not stop`, h => `They told the funniest joke ever, and the hiccups jumped right out`],
    ['rain', '🌧️', h => `it rained jelly beans all day long`, h => `They used a giant umbrella and saved the jelly beans for a party`],
    ['stuck', '🌳', h => `${h} got stuck up a tall tree`, h => `They made a ladder out of noodles, and ${h} climbed down`],
    ['dark', '🌑', h => `the sun forgot to come up`, h => `They sang a wake-up song so loud that the sun popped up and smiled`],
    ['hungry', '😋', h => `${h} was so hungry the tummy rumbled like thunder`, h => `They baked a pancake as big as a trampoline and shared it`],
    ['sneeze', '🤧', h => `a big sneeze blew away all the toys`, h => `They followed the trail of toys and brought every one back`],
    ['bored', '😑', h => `${h} was very, very bored`, h => `They invented a brand new game called Wiggle Ball`],
    ['monster', '👾', h => `a grumpy monster blocked the road`, h => `They gave the monster a hug, and it turned out it just needed a friend`],
    ['balloon', '🎈', h => `${h} floated away holding a balloon`, h => `A friendly bird popped the balloon very gently, and they floated down like a feather`]
  ],
  helpers: [['a wise old owl', '🦉', 'owl'], ['a kind giant', '🧌', 'giant'], ['a chatty parrot', '🦜', 'parrot'], ['a helpful fairy', '🧚', 'fairy'], ['a speedy cheetah', '🐆', 'cheetah'], ['a clever octopus', '🐙', 'octopus']],
  likes: ['dance', 'sing songs', 'eat snacks', 'play hide and seek', 'read books', 'jump in puddles', 'build towers', 'paint pictures'],
  // [simple, big-word] pairs so older readers get richer words in their stories.
  words: { start: ['But one day,', 'Suddenly, without any warning,'], big: ['big', 'enormous'], happy: ['happy', 'delighted'], said: ['said', 'exclaimed'], good: ['good', 'marvelous'] },
  ends: ['Then everyone had a big party with cake. The end!', 'And they all lived happily ever after. The end!', 'Then they all went home for a cozy nap. The end!', 'And it was the best day ever. The end!']
};
// Rhyme time: [first line, second line start, rhyming word, emoji, rhyme sound]
const EN_RHYMES = [
  ['I saw a cat 🐱', 'wearing a', 'hat', '🎩', 'at'], ['A dog on a log 🐶', 'sang to a', 'frog', '🐸', 'og'], ['A bee in a tree 🐝', 'waved hello to', 'me', '🙋', 'ee'],
  ['The fox in socks 🦊', 'jumped into a', 'box', '📦', 'ox'], ['A bug on a rug 🐛', 'gave me a', 'hug', '🤗', 'ug'], ['The goat in a coat 🐐', 'sailed away in a', 'boat', '⛵', 'oat'],
  ['A king with a ring 🤴', 'started to', 'sing', '🎤', 'ing'], ['A cake by the lake 🎂', 'was eaten by a', 'snake', '🐍', 'ake'], ['The moon in June 🌙', 'hummed a happy', 'tune', '🎶', 'une'],
  ['A bear on a chair 🐻', 'brushed his long', 'hair', '💇', 'air'], ['A pig in a wig 🐷', 'danced a funny', 'jig', '💃', 'ig'], ['A star in a car ⭐', 'drove very', 'far', '🛣️', 'ar'],
  ['A whale with a pail 🐳', 'went out for a', 'sail', '⛵', 'ail'], ['A hen with a pen 🐔', 'counted to', 'ten', '🔟', 'en'], ['A duck in a truck 🦆', 'wished me good', 'luck', '🍀', 'uck'],
  ['A cow said "Wow!" 🐮', 'and took a', 'bow', '🙇', 'ow'], ['The sun had fun ☀️', 'eating a', 'bun', '🍞', 'un'], ['My kite took flight 🪁', 'and flew out of', 'sight', '👀', 'ight'],
  ['A fish made a wish 🐟', 'for a yummy', 'dish', '🍽️', 'ish'], ['The clock said tick-tock ⏰', 'to a big gray', 'rock', '🪨', 'ock'], ['A queen in green 👸', 'ate a jelly', 'bean', '🫘', 'een'],
  ['A mouse in a house 🐭', 'wore a pretty', 'blouse', '👚', 'ouse'], ['A snake by the lake 🐍', 'baked a chocolate', 'cake', '🍰', 'ake'], ['A frog in the fog 🐸', 'went out for a', 'jog', '🏃', 'og'],
  ['The rain on the train 🌧️', 'went down the', 'drain', '🕳️', 'ain'], ['A mole in a hole 🕳️', 'ate a big', 'bowl', '🥣', 'ole']
];
// Tongue twisters: [text, emoji, stage]
const EN_TWISTERS = [
  ['Toy boat, toy boat, toy boat.', '⛵', 1], ['Red truck, yellow truck.', '🚚', 1], ['Fresh French fries.', '🍟', 1], ['Busy buzzing bumblebees.', '🐝', 1],
  ['A big black bug bit a big black bear.', '🐛', 2], ['Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair.', '🐻', 2], ['I scream, you scream, we all scream for ice cream!', '🍦', 2],
  ['Four fine fresh fish for you.', '🐟', 2], ['Kitty caught the kitten in the kitchen.', '🐱', 2], ['She sells seashells by the seashore.', '🐚', 3],
  ['Six slippery snails slid slowly seaward.', '🐌', 3], ['Fred fed Ted bread, and Ted fed Fred bread.', '🍞', 3], ['Silly Sally swiftly shooed seven silly sheep.', '🐑', 3],
  ['Peter Piper picked a peck of pickled peppers.', '🌶️', 4], ['How much wood would a woodchuck chuck if a woodchuck could chuck wood?', '🪵', 4], ['Green glass globes glow greenly.', '🟢', 4],
  ['Betty Botter bought some butter, but she said the butter\'s bitter.', '🧈', 5], ['Can you can a can as a canner can can a can?', '🥫', 5], ['Wayne went to Wales to watch walruses.', '🦭', 5], ['Unique New York, you know you need unique New York.', '🗽', 5]
];
// Describe it: animals [singular, plural, emoji], what they do [singular verb phrase, plural verb phrase, emoji], sizes [word, big word, scale].
const EN_DESC = {
  who: [['dog', 'dogs', '🐶'], ['cat', 'cats', '🐱'], ['frog', 'frogs', '🐸'], ['duck', 'ducks', '🦆'], ['pig', 'pigs', '🐷'], ['bear', 'bears', '🐻'], ['fox', 'foxes', '🦊'], ['bunny', 'bunnies', '🐰'], ['mouse', 'mice', '🐭'], ['penguin', 'penguins', '🐧']],
  act: [['eats cake', 'eat cake', '🍰'], ['plays with a ball', 'play with a ball', '⚽'], ['reads a book', 'read a book', '📖'], ['sits in a boat', 'sit in a boat', '⛵'], ['looks at the moon', 'look at the moon', '🌙'],
    ['rides a bike', 'ride a bike', '🚲'], ['sings a song', 'sing a song', '🎤'], ['holds a balloon', 'hold a balloon', '🎈'], ['eats pizza', 'eat pizza', '🍕'], ['plays the drum', 'play the drum', '🥁']],
  size: [['big', 'enormous', 1.5], ['little', 'tiny', 0.65]],
  count: ['a', 'two', 'three', 'four']
};
