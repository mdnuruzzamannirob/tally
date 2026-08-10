const CACHE_NAME = 'tally-static-v1'
const OFFLINE_URL = '/offline'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL)),
  )
  self.skipWaiting()
})
self.addEventListener('activate', (event) =>
  event.waitUntil(self.clients.claim()),
)
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (
    request.method !== 'GET' ||
    new URL(request.url).origin !== self.location.origin
  )
    return
  if (request.url.includes('/api/')) return
  event.respondWith(
    fetch(request)
      .then((response) => response)
      .catch(async () => {
        if (request.mode === 'navigate') return caches.match(OFFLINE_URL)
        return caches.match(request)
      }),
  )
})
