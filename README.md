# Owl & Crayon

A math, art and reading app for kids, with an owl that answers questions in simple words. Works fully offline once opened.

- Source is in `src/` (`core.js` app, `math.js` curriculum, `art.js` art lessons, `english*.js` English & Reading: english.js and english4.js data, english2.js stories and grammar, english3.js and english5.js screens; `crafts.js` the Crafts corner's drawing kit, mini-movie engine and screens, with craft data for 158 crafts in 25 kinds in crafts2.js to crafts5.js; crafts6.js adds the round-3 movie kinds, the kid-paced player (finished-craft preview, slow motion, "I did this step ✓"), craft journeys with badges and printable templates, styled by crafts6.css); `report.js` the Grown-ups corner's progress report). Run `python3 build.py` to regenerate `index.html` and `sw.js`.
- Grown-ups corner (behind the times-table gate): a progress report per player covering Math, English & Reading, Art, Crafts, My World, Owl's Quest and play time, with a "This week" summary, 3 suggestions of what to try next, and a Print / save as PDF button. It is built only from what is saved on the device.
- Try it locally: `python3 -m http.server`, then open http://localhost:8000.
- Every push to `main` publishes to GitHub Pages. On the tablet, open the site once and use "Add to Home Screen".

See [PLAN.md](PLAN.md) for the roadmap.
