const CACHE_VERSION = 'barbershop-v1'
const SHELL_CACHE = `${CACHE_VERSION}-shell`
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`
const API_CACHE = `${CACHE_VERSION}-api`

const APP_SHELL = ['/', '/index.html', '/favicon.svg', '/manifest.webmanifest']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => !key.startsWith(CACHE_VERSION)).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET') return

  // API strategy: network first with offline fallback from cache
  if (url.pathname.startsWith('/api') || url.hostname.includes('grupoteckio.com')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const cloned = networkResponse.clone()
          void caches.open(API_CACHE).then((cache) => cache.put(request, cloned))
          return networkResponse
        })
        .catch(() => caches.match(request)),
    )
    return
  }

  // Navigation fallback for SPA routes
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/index.html')))
    return
  }

  // Static assets strategy: stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (url.origin === self.location.origin && response.ok) {
            const cloned = response.clone()
            void caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, cloned))
          }
          return response
        })
        .catch(() => cached)

      return cached || networkFetch
    }),
  )
})
