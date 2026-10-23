"""Builds the app from src/ into one offline file.

src/shell.html pulls in style.css and core.js, and core.js pulls in math.js and art.js,
through `/*@include name*/` and `//@include name` lines.
Outputs: index.html + sw.js (the installable offline app) and dist/page.html (the same page without
<html>/<head>, for previewing as a Claude artifact).

Lazy code: a function expression written as /*lazy{*/ () => { ... } /*}lazy*/ is not compiled while the app starts.
In index.html its source goes into a <script type="text/plain"> just before the app's <script> (before any code runs, so a stub called during startup finds it), and the function becomes a
stub, __lazy(n, __lzS => eval(__lzS)), that compiles it on its first call with a direct eval at the same spot, so it
sees exactly the same variables (see __lazy in core.js). The browser does not parse those blocks while the page
loads, which keeps the home screen fast as the app grows. dist/page.html keeps the code inline (no eval).
"""
import hashlib, pathlib, re
root = pathlib.Path(__file__).parent
src = root / 'src'

def expand(text):
    return re.sub(r'^[ \t]*(?:/\*@include ([\w.]+)\*/|//@include ([\w.]+))[ \t]*$',
                  lambda m: expand((src / (m.group(1) or m.group(2))).read_text()).rstrip('\n'), text, flags=re.M)

body = expand((src / 'shell.html').read_text())
# The grown-ups corner shows the build date, so a family can tell which version they have.
import datetime
body = body.replace('__BUILD__', datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M UTC'))
LAZY = re.compile(r'/\*lazy\{\*/(.*?)/\*\}lazy\*/', re.S)
assert body.count('/*lazy{*/') == body.count('/*}lazy*/') == len(LAZY.findall(body)), 'unmatched /*lazy{*/ markers'
(root / 'dist').mkdir(exist_ok=True)
(root / 'dist/page.html').write_text(LAZY.sub(lambda m: m.group(1), body))
chunks = []
def stub(m):
    code = m.group(1)
    assert not re.search(r'</script|<!--', code, re.I), 'lazy code must not contain </script or <!--'
    assert '/*lazy{*/' not in code, 'lazy blocks cannot nest'
    chunks.append(f'<script type="text/plain" id="lz{len(chunks)}">({code})\n//# sourceURL=lazy{len(chunks)}.js\n</script>')
    return f'__lazy({len(chunks) - 1}, __lzS => eval(__lzS))'
body = LAZY.sub(stub, body)

head = '''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#2FA36B">
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="manifest" href="manifest.json">
<link rel="icon" href="icon.svg">
<link rel="apple-touch-icon" href="icon-192.png">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
'''
body = body.replace('<div id="app">', '</head><body>\n<div id="app">', 1)
i = body.index('<script>', body.index('<div id="app">'))
html = head + body[:i] + ''.join(c + '\n' for c in chunks) + body[i:] + '\n</body></html>\n'
(root / 'index.html').write_text(html)
ver = hashlib.sha1(html.encode()).hexdigest()[:8]
(root / 'sw.js').write_text(f'''// Caches the whole app on first visit so it runs with no internet.
const CACHE = 'owl-crayon-{ver}';
const FILES = ['./', 'index.html', 'manifest.json', 'icon.svg', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {{ cache: 'reload' }})))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {{
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, {{ ignoreSearch: true }}).then(hit => hit || fetch(e.request).then(res => {{
    // Keep a copy of fonts and anything else fetched, for next time offline.
    if (res.ok || res.type === 'opaque') {{ const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }}
    return res;
  }}).catch(() => caches.match('index.html'))));
}});
''')
print('built', ver, len(html) // 1024, 'KB,', len(chunks), 'lazy blocks')
