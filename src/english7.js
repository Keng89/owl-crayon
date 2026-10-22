/* ---------- English & Reading, part 7: chapter books for stages 3 to 5 (data; the screens are in english8.js) ---------- */
// Each book has 3 chapters of 3 pages ([emoji picture, text]). "words" are the tap-for-meaning words ([meaning, emoji]);
// every form that appears in the text is listed. Questions are [kind, question, right, wrong, wrong]; the kinds are
// who, what, where, why and feel, so a child practises every kind of question about a story.
const EN_BOOKS = [
  { id: 'kite', stage: 3, ico: '🪁', title: "Milo's Runaway Kite", chapters: [
    ['A Windy Day', [
      ['🧒🐶', 'Milo had a new red kite. His dog, Pepper, liked to chase its long tail.'],
      ['🌬️🌳', 'One day the wind was very gusty. The trees swayed and the leaves danced.'],
      ['🪁💨', 'Milo ran across the park. The kite went up, up, up into the sky!']]],
    ['Where Did It Go?', [
      ['😲🪁', 'Then a big gust pulled the string out of his hand. The kite flew away!'],
      ['🐶👃', 'Pepper sniffed the grass. She barked and ran to the pond.'],
      ['🌳🪁', 'There was the kite, stuck at the top of a tall tree. Milo felt sad.']]],
    ['A Kind Helper', [
      ['👩‍🌾🪜', 'A gardener named Rosa saw them. She carried a ladder over to the tree.'],
      ['🪜🪁', 'Rosa climbed up carefully and untangled the kite from the branches.'],
      ['😄🪁', 'Milo said, "Thank you so much!" He held the string tightly all afternoon.']]]],
    words: { gusty: ['with lots of strong puffs of wind', '🌬️'], gust: ['a sudden strong puff of wind', '💨'], swayed: ['moved slowly from side to side', '🌳'], sniffed: ['smelled with short breaths', '👃'],
      gardener: ['a person who looks after plants and gardens', '👩‍🌾'], ladder: ['steps you climb to reach high places', '🪜'], untangled: ['took the knots and twists out', '🧶'], tightly: ['holding on hard so it cannot slip', '✊'] },
    qs: [['who', 'Who found where the kite went?', 'Pepper the dog', 'Rosa', 'a bird'], ['what', 'What color was the kite?', 'red', 'blue', 'green'],
      ['where', 'Where did the kite get stuck?', 'at the top of a tree', 'in the pond', 'on a roof'], ['why', 'Why did the kite fly away?', 'a big gust pulled the string out of his hand', 'Pepper bit the string', 'Milo let it go'],
      ['feel', 'How did Milo feel when he saw the kite stuck in the tree?', 'sad', 'sleepy', 'angry']] },
  { id: 'penguin', stage: 3, ico: '🐧', title: 'Penny Learns to Swim', chapters: [
    ['Cold Toes', [
      ['🐧🧊', 'Penny was a little penguin who lived on the ice. All her friends loved to swim.'],
      ['🌊😟', 'But Penny was nervous. The water looked deep and dark.'],
      ['🐧🐧', 'Every day she watched her friends dive in. She stayed on the shore.']]],
    ['A New Friend', [
      ['🦭👋', 'One morning, a friendly seal named Sid popped up. "Why do you not swim?" he asked.'],
      ['🐧💬', '"I am scared," Penny said quietly. Sid smiled. "Let us try together, one step at a time."'],
      ['🦶🌊', 'First Penny dipped her toes. Then she floated with Sid right beside her.']]],
    ['Zoom!', [
      ['🐧💨', 'Penny flapped her flippers. She zoomed through the water like a rocket!'],
      ['🐟✨', 'She even caught a shiny fish. Her friends cheered loudly.'],
      ['🐧❤️🦭', 'Penny felt brave and proud. "Thank you, Sid!" she said. "Now I love to swim!"']]]],
    words: { nervous: ['a bit worried or scared', '😟'], shore: ['the land at the edge of the water', '🏖️'], dive: ['to jump into water head first', '🤿'], dipped: ['put in for just a moment', '🦶'],
      floated: ['stayed on top of the water', '🛟'], flippers: ['flat arms or feet for swimming', '🐧'], zoomed: ['moved very fast', '💨'], proud: ['happy about something you did well', '😊'], brave: ['ready to do something even when it feels scary', '🦁'] },
    qs: [['who', 'Who helped Penny?', 'Sid the seal', 'a big whale', 'her mom'], ['what', 'What did Penny catch?', 'a shiny fish', 'a crab', 'a shell'],
      ['where', 'Where did Penny stay while her friends swam?', 'on the shore', 'in a cave', 'in her bed'], ['why', 'Why did Penny not swim at first?', 'she was scared of the deep water', 'she was too tired', 'the water was too hot'],
      ['feel', 'How did Penny feel at the end?', 'brave and proud', 'sad and lonely', 'cross']] },
  { id: 'hamster', stage: 3, ico: '🐹', title: 'Where Is Nibbles?', chapters: [
    ['The Open Door', [
      ['🏫🐹', 'Nibbles was the class hamster. He had a cozy cage by the window.'],
      ['🚪😮', 'On Monday morning, Jada saw that the cage door was open. Nibbles was gone!'],
      ['🧒🧒🧒', 'Ms. Brown said, "Let us all be detectives and search the classroom."']]],
    ['The Search', [
      ['🔍📚', 'Leo looked under the desks. Jada peeked behind the bookshelf.'],
      ['🌻🍪', 'They found sunflower seeds on the floor, and a nibbled cookie crumb. "Clues!" said Jada.'],
      ['👣🎒', 'The trail of seeds led all the way to Ben\'s backpack.']]],
    ['Found!', [
      ['🎒🐹', 'Ben opened his lunchbox very slowly. There was Nibbles, fast asleep on a sandwich!'],
      ['😂🥪', 'Everyone giggled. Nibbles yawned and twitched his whiskers.'],
      ['🔒🐹', 'Ms. Brown put Nibbles back and fixed the latch. Now the door stays shut.']]]],
    words: { cozy: ['warm, soft and comfy', '🛏️'], detectives: ['people who look for clues to solve a mystery', '🕵️'], search: ['look carefully everywhere', '🔍'], peeked: ['took a quick look', '👀'],
      clues: ['little hints that help you find the answer', '🧩'], trail: ['a line of marks that shows where something went', '👣'], twitched: ['moved in a quick little jump', '🐭'], whiskers: ['long hairs on an animal\'s face', '🐱'], latch: ['a little lock that keeps a door shut', '🔒'] },
    qs: [['who', 'Who saw the cage door was open?', 'Jada', 'Ben', 'Ms. Brown'], ['what', 'What clues did they find?', 'seeds and a cookie crumb', 'a hat and a shoe', 'a map'],
      ['where', 'Where was Nibbles hiding?', "in Ben's lunchbox", 'under the rug', 'in the sink'], ['why', 'Why did the class search the room?', 'Nibbles was missing', 'they lost a ball', 'it was a game day'],
      ['feel', 'How did everyone feel when they found Nibbles?', 'happy, they giggled', 'scared', 'bored']] },
  { id: 'rainy', stage: 3, ico: '☔', title: "Rosa's Rainy Day", chapters: [
    ['Nothing to Do', [
      ['🌧️🪟', 'Rain tapped on the window. Rosa pressed her nose to the glass.'],
      ['😩🛋️', '"I am so bored," she sighed. "I cannot play outside today."'],
      ['👴📦', 'Grandpa winked. "Then let us have an adventure inside," he said.']]],
    ['The Blanket Fort', [
      ['🛋️🧺', 'They pulled blankets and pillows onto the chairs. Soon they had a fort!'],
      ['🔦📖', 'Inside the fort, Grandpa turned on a flashlight. They read a book about pirates.'],
      ['🧦🎭', 'Then Rosa made sock puppets. Her puppet was a grumpy pirate named Captain Toes.']]],
    ['A Surprise', [
      ['🎭😂', 'Captain Toes told silly jokes. Grandpa laughed so hard he snorted.'],
      ['🌤️🌈', 'Suddenly, the sun peeked out. A rainbow stretched across the sky!'],
      ['🥰👴', '"This was the best rainy day ever," Rosa said, and she gave Grandpa a big hug.']]]],
    words: { pressed: ['pushed against something', '👃'], bored: ['tired of having nothing fun to do', '😩'], sighed: ['let out a long, slow breath', '😮‍💨'], adventure: ['an exciting thing to do', '🧭'],
      fort: ['a little hideout or castle', '🏰'], flashlight: ['a small light you hold in your hand', '🔦'], grumpy: ['cross and in a bad mood', '😠'], snorted: ['made a funny noise through the nose', '🐷'], stretched: ['reached out long', '🌈'] },
    qs: [['who', 'Who had an idea for an inside adventure?', 'Grandpa', 'Mom', 'Captain Toes'], ['what', 'What did they build?', 'a blanket fort', 'a snowman', 'a boat'],
      ['where', 'Where did they read the pirate book?', 'inside the fort', 'in the garden', 'at school'], ['why', 'Why could Rosa not play outside?', 'it was raining', 'it was night', 'she was sick'],
      ['feel', 'How did Rosa feel at the start of the story?', 'bored', 'excited', 'scared']] },
  { id: 'dragon', stage: 4, ico: '🐉', title: "The Dragon Who Couldn't Roar", chapters: [
    ['A Tiny Squeak', [
      ['🐉🏔️', 'High in the mountains lived a young dragon named Ember. Every dragon in her family had a mighty roar that shook the rocks.'],
      ['🐉🐭', 'But when Ember tried to roar, only a tiny squeak came out. The other dragons chuckled, and her cheeks turned pink.'],
      ['🐉😔', 'Ember flew to a quiet cave to practise alone. She squeaked and squeaked until her throat was sore.']]],
    ['The Foggy Night', [
      ['🌫️🏘️', 'One evening, a thick fog rolled into the village below. The villagers could not see their own hands.'],
      ['👧🔦', 'A little girl named Tess was lost on the mountain path. She called for help, but the fog swallowed her voice.'],
      ['🐉👂', 'Ember heard her faint cry. The big dragons were snoring, so Ember knew she had to help.']]],
    ['Ember Saves the Day', [
      ['🐉🎶', 'Ember squeaked as loudly as she could. Her high squeak whistled through the fog like a bird.'],
      ['👧🐉', 'Tess followed the sound, step by step, until she reached Ember. Ember carried her safely home.'],
      ['🎉🐉', 'The whole village cheered. "Your squeak is special," said her grandmother. Ember beamed with joy.']]]],
    words: { mighty: ['very strong and powerful', '💪'], squeak: ['a tiny, high sound, like a mouse', '🐭'], chuckled: ['laughed quietly', '😄'], practise: ['do something again and again to get better', '🔁'],
      fog: ['a thick cloud close to the ground', '🌫️'], villagers: ['people who live in a village', '🏘️'], faint: ['very quiet and hard to hear', '🔈'], whistled: ['made a high, clear sound', '🎶'], beamed: ['smiled a big, bright smile', '😁'] },
    qs: [['who', 'Who was lost in the fog?', 'a girl named Tess', "Ember's grandmother", 'a farmer'], ['what', 'What came out when Ember tried to roar?', 'a tiny squeak', 'fire', 'a song'],
      ['where', 'Where did Ember go to practise?', 'a quiet cave', 'the village square', 'a lake'], ['why', 'Why could Tess find her way to Ember?', 'she followed the high squeak', 'the sun came out', 'she had a map'],
      ['feel', 'How did Ember feel at the end?', 'full of joy', 'embarrassed', 'sleepy']] },
  { id: 'treasure', stage: 4, ico: '🗺️', title: "Grandma's Secret Map", chapters: [
    ['The Dusty Attic', [
      ['🏠📦', "Ava and her little brother Leo were exploring Grandma's dusty attic. Old boxes were stacked to the ceiling."],
      ['📜😮', 'Inside a wooden chest, Leo found a crinkly piece of paper. It was a map with a big red X!'],
      ['👵😉', 'Grandma smiled when she saw it. "I drew that when I was your age," she said. "Can you solve it?"']]],
    ['Following the Clues', [
      ['🌳👣', 'The first clue said, "Walk ten steps from the old oak tree." The children counted carefully out loud.'],
      ['🐸💧', 'The next clue pointed to the pond. "Look where the frogs like to sit," it read. Ava spotted a flat gray stone.'],
      ['🪨⛏️', 'Under the stone was a tiny arrow scratched into the ground. It pointed toward the garden shed.']]],
    ['The Treasure', [
      ['🛖🧰', 'Behind the shed, they dug in the soft soil. Clunk! Their spade hit a rusty tin box.'],
      ['🧸💌', 'Inside were a teddy bear, three marbles and a letter that said, "To whoever finds this: be curious and kind."'],
      ['👵🤗', 'The children raced back to Grandma. They all laughed and shared stories until the stars came out.']]]],
    words: { exploring: ['looking around a new place to find things', '🧭'], attic: ['a room under the roof of a house', '🏠'], crinkly: ['full of little folds and wrinkles', '📜'], solve: ['find the answer', '💡'],
      clue: ['a hint that helps you find the answer', '🧩'], spotted: ['noticed, saw', '👀'], scratched: ['marked with something sharp', '✏️'], shed: ['a small hut for garden tools', '🛖'], rusty: ['covered in orange-brown rust from being old and wet', '🟫'], curious: ['wanting to learn and find out things', '🤔'] },
    qs: [['who', 'Who drew the map?', 'Grandma, when she was a child', 'Leo', 'a pirate'], ['what', 'What was inside the tin box?', 'a teddy bear, marbles and a letter', 'gold coins', 'a phone'],
      ['where', 'Where did the children find the map?', "in Grandma's attic", 'at the beach', 'in the school library'], ['why', 'Why did they dig behind the shed?', 'an arrow pointed toward the shed', 'they were planting seeds', 'a dog was digging there'],
      ['feel', 'How do you think Grandma felt when they found her box?', 'happy and proud', 'angry', 'worried']] },
  { id: 'robot', stage: 4, ico: '🤖', title: "Bolt's Big Bakery Mix-Up", chapters: [
    ['The New Helper', [
      ['🥐🤖', "Bolt was a shiny robot who had just started working at Mr. Crumb's bakery. He wanted to be the best helper ever."],
      ['📋🎂', 'His first job was to bake a birthday cake for a girl named Lulu. Mr. Crumb gave him a recipe and hurried off.'],
      ['🤖⚡', 'Bolt worked so fast that sparks flew. He did not stop to read the labels on the jars.']]],
    ['Uh-Oh!', [
      ['🧂🍰', 'Instead of sugar, Bolt poured in salt. Instead of chocolate, he added pepper!'],
      ['😝🎂', 'When Mr. Crumb tasted the batter, his face scrunched up. "Bolt, this cake is disgusting!"'],
      ['🤖😢', "Bolt's lights blinked blue. He felt terrible. \"I rushed and I did not check,\" he admitted."]]],
    ['A Sweet Ending', [
      ['🤖🔍', 'Mr. Crumb patted his metal arm. "Mistakes help us learn. Let us try again, slowly this time."'],
      ['🏷️🍫', 'Bolt read every label twice. He measured the sugar and chocolate very carefully.'],
      ['🎂🥳', 'The new cake was delicious. Lulu said it was the best cake in the world, and Bolt glowed with pride.']]]],
    words: { recipe: ['instructions that tell you how to cook something', '📋'], labels: ['little signs that tell you what is inside', '🏷️'], sparks: ['tiny flashes of light', '⚡'], batter: ['a runny mix that becomes a cake when baked', '🥣'],
      scrunched: ['squeezed up into wrinkles', '😝'], disgusting: ['very yucky', '🤢'], admitted: ['said that something was true, even though it was hard', '🙋'], measured: ['found out exactly how much', '📏'], delicious: ['very, very tasty', '😋'], pride: ['a happy feeling about something you did well', '🏅'] },
    qs: [['who', 'Who was the cake for?', 'a girl named Lulu', 'Mr. Crumb', 'Bolt'], ['what', 'What did Bolt put in instead of sugar?', 'salt', 'flour', 'jam'],
      ['where', 'Where did Bolt work?', 'at a bakery', 'at a zoo', 'on a farm'], ['why', 'Why did the first cake go wrong?', 'Bolt rushed and did not read the labels', 'the oven broke', 'Lulu dropped it'],
      ['feel', 'How did Bolt feel after the first cake?', 'terrible and sorry', 'proud', 'silly and happy']] },
  { id: 'moon', stage: 4, ico: '🌙', title: 'The Night the Moon Went Missing', chapters: [
    ['Where Is the Moon?', [
      ['🦉🦊', 'Hoot the owl and Fern the fox loved to play hide-and-seek under the bright moon.'],
      ['🌑😮', 'But one night, the sky was completely dark. The moon had vanished!'],
      ['🦊😟', '"Maybe a giant swallowed it," whispered Fern. Hoot shivered and fluffed up his feathers.']]],
    ['The Wise Turtle', [
      ['🐢🌿', 'The two friends hurried to see Old Shell, the wisest turtle in the forest.'],
      ['🐢💬', 'Old Shell chuckled slowly. "The moon has not gone anywhere. It is hiding in the shadow, like you do in your games."'],
      ['🌒🌓🌔', '"Each night, a little more of it will shine," she explained. "Watch and see."']]],
    ['The Moon Returns', [
      ['🌒✨', 'The next night, a thin silver smile appeared in the sky. "There it is!" hooted Hoot.'],
      ['🌓🌔', 'Night after night, the moon grew bigger and rounder.'],
      ['🌕🦉🦊', 'When the full moon finally glowed, Hoot and Fern played hide-and-seek all night long, giggling with delight.']]]],
    words: { vanished: ['disappeared, could not be seen', '🫥'], swallowed: ['gulped down', '😮'], shivered: ['shook a little from cold or fear', '🥶'], wisest: ['knowing the most, the cleverest', '🧠'],
      shadow: ['a dark shape where light is blocked', '🌑'], explained: ['told about something so others understand', '💬'], appeared: ['came into sight', '👀'], glowed: ['shone with a soft light', '✨'], delight: ['great happiness', '😄'] },
    qs: [['who', 'Who explained where the moon was?', 'Old Shell the turtle', 'a giant', 'Fern the fox'], ['what', 'What game did Hoot and Fern like to play?', 'hide-and-seek', 'tag', 'football'],
      ['where', 'Where did the friends go for help?', 'to the wise turtle in the forest', 'to the beach', 'to the city'], ['why', 'Why did the sky look dark?', 'the moon was hidden in shadow', 'a giant swallowed the moon', 'it was raining'],
      ['feel', 'How did Hoot feel when the moon first went missing?', 'scared', 'hungry', 'bored']] },
  { id: 'woods', stage: 5, ico: '🌲', title: 'The Secret of Whispering Woods', chapters: [
    ['Strange Sounds', [
      ['🌲👧', 'At the edge of town stood Whispering Woods, a forest so old that its trees seemed to remember everything. Maya visited every Saturday with her notebook.'],
      ['🌬️👂', 'One afternoon she heard soft voices drifting between the trunks. "Shhh... shhh..." they seemed to murmur. Maya froze, her heart thumping.'],
      ['📓✏️', 'Instead of running away, she decided to investigate. A good scientist, she reminded herself, always looks for evidence.']]],
    ['Solving the Mystery', [
      ['🌳🕳️', 'Maya discovered that several trees were hollow. When the breeze blew through the holes, they hummed like giant flutes.'],
      ['🦉👶', 'Inside the biggest hollow, three fluffy owlets blinked at her. Their soft hoots added to the whispering chorus.'],
      ['📋😟', 'But on her way home, Maya noticed a sign: "These trees will be cut down to build a car park." Her stomach dropped.']]],
    ['Maya Speaks Up', [
      ['✉️🖍️', 'That night Maya wrote a persuasive letter to the town council. She explained that the woods were a habitat for owls and a treasure for everyone.'],
      ['🏛️🗣️', 'At the town meeting, Maya read her letter aloud. Her voice wobbled at first, but it grew stronger with every sentence.'],
      ['🌲🎉', 'The council agreed to protect Whispering Woods and build the car park somewhere else. The trees kept whispering, and Maya kept listening.']]]],
    words: { murmur: ['a soft, low sound of talking', '🗣️'], investigate: ['look closely to find out the truth', '🔍'], evidence: ['facts or things that show what is true', '🧾'], hollow: ['empty inside', '🕳️'],
      owlets: ['baby owls', '🦉'], chorus: ['many voices making sound together', '🎶'], persuasive: ['trying to make people agree with you', '🙋'], council: ['a group of people who make decisions for a town', '🏛️'], habitat: ['the natural home of an animal or plant', '🏞️'], protect: ['keep safe from harm', '🛡️'] },
    qs: [['who', 'Who did Maya write her letter to?', 'the town council', 'her teacher', 'the owls'], ['what', 'What was making the whispering sound?', 'wind in hollow trees and baby owls', 'a ghost', 'a radio'],
      ['where', 'Where did the owlets live?', 'inside the biggest hollow tree', 'in a barn', 'in Maya\'s notebook'], ['why', 'Why did Maya write the letter?', 'to stop the trees being cut down', 'to win a prize', 'to ask for a pet owl'],
      ['feel', 'How did Maya feel when she first read her letter aloud?', 'nervous, her voice wobbled', 'sleepy', 'silly']] },
  { id: 'turtle', stage: 5, ico: '🐢', title: 'Captain Coral and the Plastic Sea', chapters: [
    ['A Tangled Turtle', [
      ['🏖️🧒', 'Kai loved the beach more than anywhere in the world. He called himself Captain Coral and searched the rock pools for crabs and starfish.'],
      ['🐢🥡', 'One morning he spotted a sea turtle struggling near the shore. Its flipper was tangled in an old plastic bag.'],
      ['🧑‍⚕️🐢', 'Kai ran to get the lifeguard, who gently freed the turtle. It paddled away slowly, and Kai let out a long breath of relief.']]],
    ['Too Much Plastic', [
      ['🥤🧴', 'Looking around, Kai realized the sand was littered with bottles, straws and wrappers. His happy place suddenly looked sad.'],
      ['📚💡', 'At the library he learned that plastic can take hundreds of years to break down, and that many sea creatures mistake it for food.'],
      ['🧒💭', 'Kai felt frustrated, but then he had an idea. "One person can pick up some rubbish, but a whole town can pick up a lot!"']]],
    ['The Great Clean-Up', [
      ['📣📝', 'Kai made colorful posters and invited everyone to a beach clean-up. His classmates helped hand them out.'],
      ['🧤🗑️', 'On Saturday, more than a hundred people arrived with gloves and bags. Together they collected mountains of plastic.'],
      ['🐢🌊', 'As the sun set, Kai saw a turtle poke its head above the sparkling waves. He liked to think it was saying thank you.']]]],
    words: { struggling: ['trying very hard but finding it difficult', '😣'], tangled: ['twisted and caught up', '🧶'], lifeguard: ['a person who keeps swimmers safe', '🛟'], relief: ['a good feeling when a worry goes away', '😌'],
      littered: ['messy with rubbish', '🗑️'], realized: ['suddenly understood', '💡'], creatures: ['animals', '🐠'], mistake: ['think one thing is another thing', '❓'], frustrated: ['upset because something is hard to change', '😤'], collected: ['gathered together', '🧺'] },
    qs: [['who', 'Who freed the turtle?', 'the lifeguard', 'Kai\'s teacher', 'a fisherman'], ['what', 'What was the turtle tangled in?', 'a plastic bag', 'a fishing rod', 'seaweed'],
      ['where', 'Where did Kai learn about plastic in the sea?', 'at the library', 'on TV', 'at the zoo'], ['why', 'Why did Kai organize a clean-up?', 'a whole town can pick up more rubbish than one person', 'he wanted to find treasure', 'his mom told him to'],
      ['feel', 'How did Kai feel when he saw all the plastic?', 'frustrated', 'proud', 'sleepy']] },
  { id: 'inventor', stage: 5, ico: '⚙️', title: "The Inventor's Apprentice", chapters: [
    ['The Workshop', [
      ['🏚️⚙️', "Theo's neighbor, Ms. Gearwell, had a workshop crammed with springs, wires and half-built machines. Theo begged to be her apprentice."],
      ['👩‍🔬🧒', '"An inventor needs patience," Ms. Gearwell warned, adjusting her goggles. "Most inventions fail many times before they work."'],
      ['🌱💧', 'Together they decided to invent a machine that would water plants automatically while people were away on holiday.']]],
    ['Fail, Fix, Try Again', [
      ['💦😱', 'Their first try flooded the kitchen floor. The second watered the cat instead of the plants. The cat was not amused.'],
      ['🧒😤', 'Theo threw down his screwdriver. "It is hopeless!" he shouted. "We will never get it right."'],
      ['👩‍🔬📓', 'Ms. Gearwell opened a battered notebook. "Look, my famous toaster failed forty-two times. Each failure taught me something."']]],
    ['The Science Fair', [
      ['🔧🌿', 'Theo took a deep breath and studied their mistakes. He added a sensor that only released water when the soil felt dry.'],
      ['🏆🌱', 'At the science fair, their Plant Pal machine worked perfectly. The judges were astonished and awarded it first prize.'],
      ['🧒😊', 'Theo grinned. He had learned that the most important part of inventing is not giving up.']]]],
    words: { workshop: ['a room where people build and fix things', '🔧'], apprentice: ['someone who learns a job by working with an expert', '🧑‍🔧'], patience: ['staying calm while you wait or keep trying', '⏳'], automatically: ['all by itself, without help', '🤖'],
      flooded: ['covered with too much water', '🌊'], amused: ['finding something funny', '😄'], hopeless: ['feeling that something can never work', '😞'], battered: ['old and worn from lots of use', '📓'], sensor: ['a part that notices things like heat, light or wetness', '📡'], astonished: ['very, very surprised', '😲'] },
    qs: [['who', 'Who did Theo learn from?', 'Ms. Gearwell, the inventor', 'his teacher', 'the judges'], ['what', 'What did the machine do?', 'watered plants when the soil was dry', 'made toast', 'fed the cat'],
      ['where', 'Where did their second try spray water?', 'on the cat', 'on the roof', 'on the judges'], ['why', 'Why did Ms. Gearwell show Theo her notebook?', 'to show that failing helps you learn', 'to show him a recipe', 'to give him homework'],
      ['feel', 'How did Theo feel after the second try failed?', 'frustrated, he shouted', 'calm', 'proud']] },
  { id: 'castle', stage: 5, ico: '🏔️', title: 'Journey to the Ice Castle', chapters: [
    ['The Legend', [
      ['🏔️❄️', 'In the village of Frostvale, people told a legend about an ice castle hidden on top of Silver Mountain. Inside, they said, was a lantern that never went out.'],
      ['🕯️😟', 'That winter, a terrible storm blew out every lamp in the village. The nights were long, dark and freezing.'],
      ['👧🐕', 'Brave Nadia packed warm clothes, a rope and some bread. With her loyal husky, Pilot, she set off to find the lantern.']]],
    ['The Climb', [
      ['🌨️🐕', 'The path was steep and slippery. Snow whirled around them, and the wind howled like a wolf.'],
      ['🌉😨', 'They reached a narrow ice bridge over a deep valley. Nadia\'s knees trembled, but Pilot went first, testing each step.'],
      ['🏰✨', 'At last, the ice castle appeared, glittering like a giant crystal in the moonlight.']]],
    ['The Lantern', [
      ['🏮🧊', 'In the great hall stood a small lantern, glowing warm and golden. Beside it was a carved message: "Light is meant to be shared."'],
      ['🕯️🕯️', 'Nadia realized the lantern could light other candles without ever growing dim. She lit a whole basket of them.'],
      ['🏘️🌟', 'When she returned, every window in Frostvale glowed. The villagers hugged her and Pilot, and the long, dark winter finally felt warm.']]]],
    words: { legend: ['an old story that people tell, which may or may not be true', '📜'], lantern: ['a lamp you can carry', '🏮'], freezing: ['very, very cold', '🥶'], loyal: ['always faithful and true to a friend', '🐕'],
      husky: ['a strong dog that can pull sleds in the snow', '🐕'], steep: ['going up sharply, hard to climb', '⛰️'], whirled: ['spun around and around', '🌀'], trembled: ['shook because of fear or cold', '😨'], glittering: ['sparkling with lots of little lights', '✨'], carved: ['cut into a hard material', '🪓'], dim: ['not bright', '🌑'] },
    qs: [['who', 'Who went with Nadia up the mountain?', 'her husky, Pilot', 'her brother', 'a wizard'], ['what', 'What did the carved message say?', 'Light is meant to be shared.', 'Go home now.', 'Beware of wolves.'],
      ['where', 'Where was the ice castle?', 'on top of Silver Mountain', 'under the sea', 'in the village'], ['why', 'Why did Nadia go to find the lantern?', 'a storm blew out all the lamps in the village', 'she wanted to be famous', 'she was lost'],
      ['feel', 'How did Nadia feel on the ice bridge?', 'scared, her knees trembled', 'bored', 'sleepy']] }
];
