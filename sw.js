// Trenes al Día — funciona sin conexión con lo último que se vio.
const VERSION = 'td-v2';
const BASE = ['./', 'index.html', 'styles.css', 'app.js', 'manifest.json', 'img/app-192.png', 'img/app-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Datos, noticias y trenes: siempre lo más nuevo; si no hay red, lo guardado.
  if (u.origin === location.origin && (u.pathname.includes('/data/') || u.pathname.includes('/api/') || BASE.some((b) => u.pathname.endsWith(b.replace('./', '/'))))) {
    e.respondWith(
      fetch(e.request).then((r) => {
        if (r.ok) { const copia = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, copia)); }
        return r;
      }).catch(() => caches.match(e.request, { ignoreSearch: true }))
    );
  }
});
