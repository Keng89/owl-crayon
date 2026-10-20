# Online Owl server

Owl answers ~55 topics offline. This small server lets Owl answer *any* question using Claude, while keeping your Anthropic API key off the children's tablets. It is optional, and the app keeps working offline without it.

How it works: the app sends the question, the child's age and the family's access code to this server. The server checks the code, asks Claude with a child-safe prompt, and sends back a short answer. The app saves each answer, so the same question works offline next time.

## Set it up (about 15 minutes)

1. **Get an API key.** Sign in at https://console.anthropic.com, add billing, then go to *API keys* and create one. Copy it somewhere safe.
2. **Create a free Cloudflare account** at https://dash.cloudflare.com/sign-up.
3. **Install Node.js** (https://nodejs.org, the LTS version) on your computer.
4. In a terminal, from this `server` folder:
   ```
   npm install
   npx wrangler login
   npx wrangler secret put ANTHROPIC_API_KEY     # paste your API key
   npx wrangler secret put ACCESS_CODES          # e.g. FAMILY-7Q2K  (comma-separate several)
   npx wrangler deploy
   ```
   The last step prints your server address, like `https://owl-crayon-owl.<you>.workers.dev`.
5. **Turn it on in the app:** Grown-ups corner → *Online Owl* → paste the server address and an access code → Save.

## Subscriptions

Each paying family gets its own access code. Add or remove codes with `npx wrangler secret put ACCESS_CODES` (the full comma-separated list each time). Removing a code switches that family back to the offline Owl. A payment provider (for example Stripe) can issue codes automatically later.

## Cost

You pay Anthropic per question. Answers are kept short (effort `low`), and the app saves each answer so repeat questions cost nothing. The model is set by `OWL_MODEL` in `wrangler.toml` (`claude-opus-5-5` by default); a cheaper model such as `claude-haiku-5-5` costs much less per question.

## Check it

`npm test` runs the server against a fake Claude, so it costs nothing and needs no key.

## Free option: Cloudflare Workers AI

No Anthropic key needed. In the Worker's **Settings → Bindings → Add → Workers AI**, set the variable name to `AI`, and leave `ANTHROPIC_API_KEY` unset. The Owl then uses Llama 3.3 70B on Cloudflare's free daily allowance (10,000 Neurons a day, roughly a couple of hundred short answers). When the allowance runs out the app says the Owl is busy until it resets at midnight UTC. Answers are a bit less careful than Claude's; add `ANTHROPIC_API_KEY` later to switch to Claude (the key wins when both are set). `FREE_MODEL` (text) changes the free model.
