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
