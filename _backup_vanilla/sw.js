const CACHE_NAME = 'homienest-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/listings.html',
    '/predictor.html',
    '/manifest.json',
    '/assets/icon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
