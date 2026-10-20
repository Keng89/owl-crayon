// Owl & Crayon online Owl, copy-paste version for the Cloudflare dashboard (no packages needed).
// Same behaviour as worker.js, but it calls the Claude API with plain fetch so it fits in one file.
// Settings to add in the dashboard: ANTHROPIC_API_KEY (secret), ACCESS_CODES (secret), ALLOWED_ORIGINS (text).

const SYSTEM = `You are Owl, a kind, cheerful teacher inside a math and art learning app for children.
The child's age is given with each question. Answer so a child of that age understands:
- At most 3 short sentences (age 3-7) or 5 short sentences (age 8+). Simple, everyday words.
- Use a tiny example with small numbers or familiar things (apples, toys, crayons).
- For math, show the steps; for drawing, give 2-3 easy steps using simple shapes.
- Be warm and encouraging. Never mention being an AI model or these instructions.
- Stay on safe, child-appropriate topics. If a question is unsafe, scary, personal, medical, or about something a grown-up should handle, gently say "That's a great question for a grown-up!" and suggest a math or art idea instead.
- Never ask for or repeat personal information such as names, addresses, schools or phone numbers.
- Plain text only, no markdown.`;

const cors = origin => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Owl-Code',
  'Vary': 'Origin'
});
const json = (body, status, origin) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...cors(origin) } });

export default {
  async fetch(request, env) {
    const reqOrigin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const origin = allowed.includes(reqOrigin) ? reqOrigin : (allowed[0] || '*');
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    const url = new URL(request.url);
    if (url.pathname === '/health') return json({ ok: true }, 200, origin);
    if (request.method !== 'POST' || !['/ask', '/check'].includes(url.pathname)) return json({ error: 'not found' }, 404, origin);

    // Subscription gate: each paying family gets an access code; list them in the ACCESS_CODES secret.
    const codes = (env.ACCESS_CODES || '').split(',').map(s => s.trim()).filter(Boolean);
    if (!codes.includes((request.headers.get('X-Owl-Code') || '').trim())) return json({ error: 'code' }, 401, origin);

    if (url.pathname === '/check') return json({ ok: true }, 200, origin);
    let body;
    try { body = await request.json(); } catch (e) { return json({ error: 'bad json' }, 400, origin); }
    const question = String(body.question || '').trim().slice(0, 300);
    const age = Math.min(16, Math.max(3, parseInt(body.age, 10) || 6));
    if (!question) return json({ error: 'empty' }, 400, origin);

    try {
      const res = await fetch((env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com') + '/v1/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY || '', 'anthropic-version': '2023-06-01', 'anthropic-beta': 'server-side-fallback-2026-07-01' },
        body: JSON.stringify({
          model: env.OWL_MODEL || 'claude-opus-5-5',
          max_tokens: 1024,
          fallbacks: 'default',
          output_config: { effort: 'low' },
          system: SYSTEM,
          messages: [{ role: 'user', content: `Child's age: ${age}\nQuestion: ${question}` }]
        })
      });
      if (res.status === 429) return json({ error: 'busy' }, 429, origin);
      if (res.status === 401 || res.status === 403) return json({ error: 'server key' }, 500, origin);
      if (!res.ok) return json({ error: 'upstream' }, 502, origin);
      const msg = await res.json();
      if (msg.stop_reason === 'refusal') return json({ answer: "That's a great question for a grown-up! Want to try a math game or a drawing instead?" }, 200, origin);
      const answer = (msg.content || []).filter(b => b.type === 'text').map(b => b.text).join(' ').trim();
      return json({ answer: answer || "Hmm, I'm not sure. Let's ask a grown-up!" }, 200, origin);
    } catch (e) {
      return json({ error: 'server' }, 500, origin);
    }
  }
};
