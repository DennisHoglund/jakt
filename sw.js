// Jaktvind service worker: appen fungerar offline, prognosen sparas i appen själv.
const CACHE = 'jaktvind-v19';
const TILES = 'jaktvind-tiles';
const MAX_TILES = 2000;
const SHELL = ['./', './index.html', './config.js', './jakttider.js', './vendor/suncalc.js', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
const TILE_HOSTS = ['tile-cyclosm.openstreetmap.fr', 'tile.waymarkedtrails.org', 'tile.opentopomap.org', 'server.arcgisonline.com', 'tile.openstreetmap.org'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((k) => k !== CACHE && k !== TILES).map((k) => caches.delete(k))
  )));
  self.clients.claim();
});

function cacheFirst(request, cacheName, onStore) {
  return caches.match(request).then((hit) => hit || fetch(request).then((res) => {
    if (res.ok || res.type === 'opaque') {
      const copy = res.clone();
      caches.open(cacheName).then((c) => c.put(request, copy)).then(onStore);
    }
    return res;
  }));
}

let trimming = false;
function trimTiles() {
  if (trimming) return;
  trimming = true;
  caches.open(TILES).then((c) => c.keys().then((keys) => {
    const extra = keys.length - MAX_TILES;
    return extra > 0 ? Promise.all(keys.slice(0, extra + 200).map((k) => c.delete(k))) : null;
  })).finally(() => { trimming = false; });
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.hostname === 'api.open-meteo.com') return; // väderdata går alltid mot nätet

  // Egna filer: nätet först så uppdateringar slår igenom, cache som reserv.
  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(e.request)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return res; })
        .catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // Kartrutor: sparas när du tittar på kartan, så området fungerar offline senare.
  if (TILE_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith('.' + h))) {
    e.respondWith(cacheFirst(e.request, TILES, trimTiles));
    return;
  }

  // Typsnitt och kartbibliotek: cache först.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' || url.hostname === 'cdnjs.cloudflare.com' || url.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(cacheFirst(e.request, CACHE));
  }
});
