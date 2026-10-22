# Tests

Serve the app first: `python3 -m http.server 8766` from the repo root. Then run each from a scratch folder (they save screenshots there) with Playwright installed globally:

- `t5.js`: every math topic × 5 levels × 300 questions: the answer is a choice, no duplicates, no NaN.
- `t7.js`: walks every art lesson, pixel art and the phone layout.
- `t8.js`: players, daily quest, owl pet, backup and restore.
- `t10.mjs`: Online Owl end to end against a fake Claude (no key, no cost).
- `server/test.mjs` (`npm test` in `server/`): the Online Owl server on its own.
- `t11.js`: the grown-ups' weekly summary and Owl's offline answers for money, measuring and time.
- `t12.js`: long-answer layouts (equation pairs, line equations) fit a phone and buttons have spoken labels.
- `t13.js`: renders the finished Painting & Collage pictures to a screenshot for a visual check.
- `t14.js`: badges are awarded and listed, and word answers are read aloud for young children.
- `t16.js`: a new deploy shows the "new version ready" button, and tapping it loads the update.
- `t17.js`: Write numbers: a careful trace of 0, 4, 8 and 13 passes and a scribble does not, on a phone and a tablet.
- `t18.js`: plays all 7 math games to the end at ages 5 and 9 on a phone and a tablet, with wrong taps, stars and best scores.
- `t19.js`: plays the 7 newer math games (fishing, pizza, feeding, rocket, target, bee hive, treasure map) the same way, and checks 300 questions per level.
- `t20.js`: plays the third set of 7 math games (snakes & ladders, bakery, parking, hungry monster, bubbles, sticker sort, number detective) the same way.
- `t21.js`: art steps draw themselves and replay, Owl's worked example on math lessons, and the Owl hint removes one wrong answer.
- `t22.js`: read-aloud text says signs, money, remainders and ratios as words.
- `t23.js`: plays all 5 Owl's Quest chapters at ages 5 and 9 (story riddles, map resize) on phone and tablet: math stops, drawing stops, story choices, stars, storybook and saved progress.
- `t24.js`: fills every shape on all 26 coloring pages, color-by-number right and wrong, Magic help, undo, save and reload.
- `t25.js`: sticker scenes: all 15 places, dragging by mouse and touch, edit buttons, crayon, story box, save, and every counting game.
- `t26.js`: welcome tour for new players (steps, skip, once per player, replay) and the "What's inside" page for grown-ups.
- `t27.js`: shape puzzles: every easy puzzle by real drags, medium and tricky with turn and flip, wrong drops, stars once, saved progress.
- `t28.js`: play-time limits and break reminders (fast clock, two players, grown-up gate, chart, reload).
- `t29.js`: busy-child regressions from the monkey test: leaving a screen right after a tap (mix colors, sticker counting and saving, coloring save, a voice question to Owl), double taps on Done, Check and Save, and a long question in the Grown-ups corner.
- `t30.js`: flipbook: drawing frames, onion skin, play/stop, lessons, saving, My flipbooks, reload.
- `t31.js`: brushes: a stroke with each of the 13 brushes changes pixels like the real medium (watercolor see-through and spreading, thick paint opaque and mixing, smudge moving paint, stamps), undo after each, mirror and eraser with watercolor, papers, save, a Brush Techniques lesson preselecting its brush.
- `t32.js`: My World: gifts, buying lands and things with the wallet math, placing by taps and drags, habitats, feeding, fruit once a day, milestones, backpack, reload, two players.
- `t33.js`: English & Reading: home tile, all 11 sections, letter-sound taps and the sound song, a blend round, the sentence builder (wrong check, then capital and end mark), grammar answers and 200 questions per game and stage, a full round with the word-pal reward, a story with questions, sight words, Feed Munch, bubble pop, treasure hunt, stage locks, stars reaching My World, reload. Phone with speech, tablet without. Prints "errors none" and "fails none".
- `t37.js`: Crafts corner round 2: 110+ crafts in 22 kinds (painting, beads, costumes, sensory play, building, gifts, seasons, more origami), every step of every craft drawn without errors and animating (in the data, and live on the craft page for all 628 steps on the phone), the new movie kinds (dab, pour, stir, stack, knot, measure, launch, oven), safety notes for paint, hot water and ovens, glue guns and small pieces, the "I have..." material chips and the search box (alone and with the level filter), and the craft of the day (same all day and after a reload, suits the age, varies by day, opens its craft). Prints "errors none" and "fails none".
- `t34.js`: English & Reading round 2: 800+ words in age tiers (big words have meanings), 12 more stories, question makers at every stage, grown-up tips, the spelling bee (wrong tile, perfect words, reward), story maker (new story stars once), rhyme time and its song, describe it, listen & tap, sound safari, tongue twisters (locks, stars once), the word of the day and its streak, Owl's review (a missed word comes back on days 0, 1 and 3, then joins the word album), reload. Phone with speech, tablet without. Prints "errors none" and "fails none". Tests take `PORT` (default 8766).
- `t35.js`: polish pass on a phone (390x844) and a tablet (820x1180): Free draw's idea box (every idea fits, including "Draw an underwater city."), brush and stamp rows, the newest art lessons, My World (shop tabs, buy sheets, sticker book) and English & Reading (every section, Word play, answers, a finished round, a made-up story): no sideways scroll, no clipped or off-screen text, 44px labeled buttons, visible stars on price pills, story titles, Back targets. Prints "errors none" and "fails none".
- `t36.js`: Crafts corner: the home tile, 40+ crafts in 15 categories at 4 levels (materials, time, 3–8 steps, "ask a grown-up" safety notes for scissors, glue and needles), every step's mini-movie drawn at several points without errors, each category and the level filter, a craft's movie changing frame by frame, pause, play, next, back, step dots, replay and Watch all, "I made it!" with a sticker (level stars once, 1 on a repeat) and with a drawing (a blank one refused, a real one saved to My pictures), the crafts wall, reload. Phone with speech, tablet without. Prints "errors none" and "fails none".
