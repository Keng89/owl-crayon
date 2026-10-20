// Runs the worker against a fake Anthropic server (no key, no cost) to check the request and responses.
import http from 'node:http';
const worker = (await import(process.env.WORKER || './worker.js')).default;

let seen = null, mode = 'ok';
const fake = http.createServer((req, res) => {
  let b = ''; req.on('data', c => b += c); req.on('end', () => {
    seen = { headers: req.headers, body: JSON.parse(b) };
    if (mode === 'rate') { res.writeHead(429, { 'content-type': 'application/json', 'retry-after': '0' }); return res.end('{"type":"error","error":{"type":"rate_limit_error","message":"slow"}}'); }
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ id: 'msg_1', type: 'message', role: 'assistant', model: seen.body.model, stop_reason: mode === 'refuse' ? 'refusal' : 'end_turn',
      content: mode === 'refuse' ? [] : [{ type: 'text', text: 'Three apples and two apples make five apples!' }], usage: { input_tokens: 1, output_tokens: 1 } }));
  });
}).listen(0);
await new Promise(r => fake.on('listening', r));
const env = { ANTHROPIC_API_KEY: 'test', ACCESS_CODES: 'FAMILY1, FAMILY2', ALLOWED_ORIGINS: 'https://keng89.github.io', ANTHROPIC_BASE_URL: `http://127.0.0.1:${fake.address().port}` };
const ask = (q, code = 'FAMILY1') => worker.fetch(new Request('https://owl.example/ask', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Owl-Code': code, Origin: 'https://keng89.github.io' }, body: JSON.stringify({ question: q, age: 5 }) }), env);
const check = (c, m) => { if (!c) { console.error('FAIL', m); process.exitCode = 1; } else console.log('ok', m); };

let r = await ask('What is 3 + 2?'); let j = await r.json();
check(r.status === 200 && j.answer.includes('five'), 'answers a question');
check(r.headers.get('access-control-allow-origin') === 'https://keng89.github.io', 'CORS for the app');
check(seen.headers['x-api-key'] === 'test' && seen.body.model === 'claude-opus-5-5' && seen.body.fallbacks === 'default' && /server-side-fallback-2026-07-01/.test(seen.headers['anthropic-beta']), 'request shape');
check(seen.body.messages[0].content.includes("age: 5") && seen.body.system.includes('Owl'), 'age and system prompt sent');
r = await worker.fetch(new Request('https://owl.example/check', { method: 'POST', headers: { 'X-Owl-Code': 'FAMILY2' } }), env); check(r.status === 200, 'check accepts a good code');
r = await ask('hi', 'WRONG'); check(r.status === 401, 'rejects a wrong access code');
mode = 'refuse'; r = await ask('scary'); j = await r.json(); check(j.answer.includes('grown-up'), 'refusal gets a kind answer');
mode = 'rate'; r = await worker.fetch(new Request('https://owl.example/ask', { method: 'POST', headers: { 'X-Owl-Code': 'FAMILY2' }, body: '{"question":"x"}' }), { ...env }); check(r.status === 429, 'rate limit passes through as busy');
fake.close();

// Free path: no Anthropic key, a fake Workers AI binding.
{
  const W = (await import(process.env.WORKER || './worker.js')).default;
  let seen;
  const freeEnv = { ACCESS_CODES: 'FAMILY1', ALLOWED_ORIGINS: 'https://keng89.github.io', AI: { run: async (m, inp) => { seen = { m, inp }; return { response: '**Two** apples plus one apple makes three apples!' }; } } };
  const req = () => new Request('https://owl.example/ask', { method: 'POST', headers: { 'X-Owl-Code': 'FAMILY1', Origin: 'https://keng89.github.io' }, body: JSON.stringify({ question: 'what is 2+1', age: 5 }) });
  let r = await W.fetch(req(), freeEnv), j = await r.json();
  if (r.status !== 200 || !/three apples/.test(j.answer) || /\*/.test(j.answer) || seen.inp.messages[0].role !== 'system' || !/age: 5/.test(seen.inp.messages[1].content)) { console.log('FAIL free answer', r.status, j); process.exit(1); }
  console.log('ok free Workers AI answer');
  freeEnv.AI.run = async () => { throw new Error('daily free allocation of neurons exceeded'); };
  r = await W.fetch(req(), freeEnv);
  if (r.status !== 429) { console.log('FAIL free limit', r.status); process.exit(1); }
  console.log('ok free limit shows busy');
}
