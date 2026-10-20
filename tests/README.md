# Tests

Serve the app first: `python3 -m http.server 8766` from the repo root. Then run each from a scratch folder (they save screenshots there) with Playwright installed globally:

- `t5.js`: every math topic × 5 levels × 300 questions: the answer is a choice, no duplicates, no NaN.
- `t7.js`: walks all 50 art lessons, pixel art and the phone layout.
- `t8.js`: players, daily quest, owl pet, backup and restore.
- `t10.mjs`: Online Owl end to end against a fake Claude (no key, no cost).
- `server/test.mjs` (`npm test` in `server/`): the Online Owl server on its own.
