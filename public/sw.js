const CACHE_NAME = 'barbershop-pwa-v3'
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg']

function getNormalizedCacheKey(requestUrl) {
  const isDevModule = requestUrl.pathname.startsWith('/src/') || requestUrl.pathname.startsWith('/@fs/')
  if (!isDevModule) return null
  return `${requestUrl.origin}${requestUrl.pathname}`
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const requestUrl = new URL(event.request.url)
  if (requestUrl.origin !== self.location.origin) return

  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cachedIndex = await caches.match('/index.html')
        try {
          const networkResponse = await fetch(event.request)
          const cache = await caches.open(CACHE_NAME)
          cache.put('/index.html', networkResponse.clone())
          return networkResponse
        } catch {
          return cachedIndex || (await caches.match('/'))
        }
      })(),
    )
    return
  }

  event.respondWith(
    (async () => {
      const normalizedCacheKey = getNormalizedCacheKey(requestUrl)
      const cached = await caches.match(event.request)
      if (cached) return cached

      if (normalizedCacheKey) {
        const normalizedCached = await caches.match(normalizedCacheKey)
        if (normalizedCached) return normalizedCached
      }

      try {
        const response = await fetch(event.request)
        if (response && response.status === 200 && response.type === 'basic') {
          const cache = await caches.open(CACHE_NAME)
          cache.put(event.request, response.clone())
          if (normalizedCacheKey) {
            cache.put(normalizedCacheKey, response.clone())
          }
        }
        return response
      } catch {
        return new Response('Offline resource not available in cache', {
          status: 503,
          statusText: 'Service Unavailable',
        })
      }
    })(),
  )
})
