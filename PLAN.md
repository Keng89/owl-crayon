# Owl & Crayon: plan

A math and art app for kids where an owl answers questions in simple words. Built for a 5 year old first, designed to grow to every age so it can later be sold as a subscription.

## What the prototype does today

| Area | What the child does | Why it keeps them coming back |
|---|---|---|
| Number Garden | Counting, shapes, patterns, bigger or smaller, adding, taking away (times tables unlock at age 7) | Big picture buttons, everything read aloud, stars, a sticker every 10 stars, a daily streak |
| Art Studio | Draw with shape-and-number prompts, Mirror mode (symmetry), mix paints to hit a target color, save to "My pictures" | Art doubles as math: "draw a house from a square and a triangle", "count the sun's rays" |
| Ask Owl | Types or taps a question, gets a short spoken answer with a picture | Owl does sums with pictures ("what is 3 plus 4"), knows ~30 topics, and never says "wrong" |
| Grown-ups corner | Behind a times-table gate: progress per game, questions Owl couldn't answer, settings | Parent can teach Owl a new answer, which it uses from then on |

Everything runs on the device with no internet: the app is a single web page plus a service worker that caches it on first visit. It can be added to a tablet home screen like an app.

## How "it improves itself" works

1. **Adaptive difficulty.** Each game has a mastery score. Right on the first try (and quickly) moves it up; mistakes move it down. Five levels per game, e.g. adding goes from sums to 5 with pictures up to sums to 20 as plain numbers.
2. **Spaced review.** Every missed question is saved and comes back after 1, 2, 4, 8 and 16 days. Getting it right pushes it further out; missing it resets it.
3. **Explain, then retry.** A wrong answer opens a picture explanation (numbered objects, crossed-out items, corner dots on shapes) read aloud, and the child tries again.
4. **"Try this" picks.** Home suggests the game in the child's learning zone, a due review, or art if they've only done math.
5. **Owl learns from the family.** Unanswered or unhelpful questions are logged; a parent's answer is reused offline next time.

None of this sends data anywhere. Progress lives in the browser on that device.

## Scaling to all ages (subscription path)

- **Age setting** already picks which games show and where each one starts. Next content packs by band: 3–5 (now), 6–7 (place value, money, clocks, measuring), 8–10 (times tables, fractions, area and perimeter, perspective drawing), 11+ (ratios, negatives, geometry constructions, tessellations).
- **Smarter Owl.** Offline: a larger curated answer bank per age band, then a small on-device model for open questions. Online (optional, parent-enabled): Claude through our own server with a child-safe prompt, never a key in the app.
- **Accounts and sync** so siblings get separate profiles and progress survives a new tablet. This is also where the subscription paywall sits (free core games, paid packs and the online Owl).
- **Parent dashboard** with weekly summaries.
- **Stores.** Wrap the same web app for the App Store and Google Play (Capacitor) once the content is solid. Kids' apps need COPPA/GDPR-K compliance and no third-party ads or tracking.

## Suggested next steps

1. Your child plays it for a week; we watch the Grown-ups corner and adjust.
2. Put the code in a GitHub repository and host it so the tablet can install it for true offline use.
3. Add the 6–7 content pack and child profiles.

## Files

- `index.html`, `sw.js`, `manifest.json`, icons: the installable offline app.
- `src/app.html`: the app source. Run `python3 build.py` after editing it to rebuild `index.html` and `sw.js`.
- To try locally: `python3 -m http.server` in this folder, then open `http://localhost:8000` on a device on the same network.
