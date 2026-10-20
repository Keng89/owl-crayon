# Owl & Crayon: plan

A math and art app for kids where an owl answers questions in simple words. Built for a 5 year old first, with content that runs from preschool to early high school so it can be sold as a subscription.

## What is in the app

**Number Garden: 5 worlds, 36 topics, 5 levels each.** Every topic opens with a short picture lesson, and every wrong answer shows a worked explanation, step by step for the bigger sums.

| World | Ages | Topics |
|---|---|---|
| Seedling Hill | 3–5 | Counting, find the number, shapes, patterns, bigger or smaller |
| Sprout Valley | 5–7 | Adding and taking away to 10 and 20+, number friends, tens and ones, skip counting, telling time, odd and even |
| Treetop Town | 7–9 | Column adding and subtracting, times tables, dividing (with remainders), missing numbers, fractions, story problems, rounding |
| Deep Forest | 9–11 | Long multiplication, long division, fraction maths, decimals, percentages, negative numbers, area and perimeter, angles, order of operations |
| Mountain Peak | 11+ | Algebra, powers and roots, factors and primes, ratio, sequences, probability, circles/volume/Pythagoras, coordinates |

**Art School: 50 step-by-step lessons in 11 kinds of art, at 3 levels (Beginner, Explorer, Master).** Each step shows what to draw next in red, read aloud. Trace mode puts the guide faintly under the child's drawing. Kinds: shape pictures, animals, faces and people (including real face and body proportions), nature and landscapes, cartoons, 3D and perspective, light and shading, color theory, patterns and mandalas, lettering, paper crafts (origami).

**Studio tools:** free draw with mirror and 4/6/8-way mandala symmetry, pixel art (5 levels, the last one uses grid coordinates), color mixing challenges, and a gallery.

**Ask Owl** answers ~55 topics across math and art offline, works out sums including dividing, and logs anything it can't answer for a grown-up to teach it.

## How "it improves itself" works

1. **Adaptive difficulty.** Each topic has a mastery score. Right on the first try (and quickly) moves it up; mistakes move it down. Five levels per topic.
2. **Worlds unlock by progress.** The next world opens at 50% mastery of the one before; the age setting picks where a child starts. Art levels open after 3 lessons at the level below.
3. **Spaced review.** Every missed question is saved and comes back after 1, 2, 4, 8 and 16 days. Getting it right pushes it further out; missing it resets it.
4. **Explain, then retry.** A wrong answer opens a picture explanation (numbered objects, crossed-out items, corner dots on shapes) read aloud, and the child tries again.
5. **"Try this" picks.** Home suggests the game in the child's learning zone, a due review, or art if they've only done math.
6. **Owl learns from the family.** Unanswered or unhelpful questions are logged; a parent's answer is reused offline next time.

None of this sends data anywhere. Progress lives in the browser on that device.

## Scaling to all ages (subscription path)

- **Age setting** picks the starting world. Content gaps to fill next: money, measuring (length, weight, capacity), data and charts, simultaneous equations, graphs of lines; in art, painting techniques, collage and digital animation.
- **Smarter Owl.** Offline: a larger curated answer bank per age band, then a small on-device model for open questions. Online (optional, parent-enabled): Claude through our own server with a child-safe prompt, never a key in the app.
- **Accounts and sync** so siblings get separate profiles and progress survives a new tablet. This is also where the subscription paywall sits (free core games, paid packs and the online Owl).
- **Parent dashboard** with weekly summaries.
- **Stores.** Wrap the same web app for the App Store and Google Play (Capacitor) once the content is solid. Kids' apps need COPPA/GDPR-K compliance and no third-party ads or tracking.

## Suggested next steps

1. Your child plays it for a week; we watch the Grown-ups corner and adjust.
2. Child profiles for siblings.
3. The content gaps above, then the subscription and store builds.

## Files

- `index.html`, `sw.js`, `manifest.json`, icons: the installable offline app.
- `src/`: the source. `core.js` is the app, `math.js` the math curriculum, `art.js` the art lessons, `style.css` the look. Run `python3 build.py` after editing to rebuild `index.html` and `sw.js`.
- To try locally: `python3 -m http.server` in this folder, then open `http://localhost:8000` on a device on the same network.
