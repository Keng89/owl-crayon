"""Wraps src/app.html into the installable offline web app (index.html + sw.js)."""
import hashlib, pathlib
root = pathlib.Path(__file__).parent
body = (root / 'src/app.html').read_text()
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
html = head + body.replace('<div id="app">', '</head><body>\n<div id="app">', 1) + '\n</body></html>\n'
(root / 'index.html').write_text(html)
ver = hashlib.sha1(html.encode()).hexdigest()[:8]
(root / 'sw.js').write_text(f'''// Caches the whole app on first visit so it runs with no internet.
const CACHE = 'owl-crayon-{ver}';
const FILES = ['./', 'index.html', 'manifest.json', 'icon.svg', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
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
print('built', ver)
