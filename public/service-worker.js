/*
File: /public/service-worker.js
*/
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('avis-alertes-cache-v1').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                '/favicon-192.png',
                '/favicon-512.png'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});