const CACHE_NAME = "methub-v1";
const ASSETS = [
  "/",
  "/index.js",
  "/index.css",
  "/tailwind.css",
  "/manifest.json",
  "/favicon.ico"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return Promise.allSettled(
          ASSETS.map((asset) => {
            return cache.add(asset).catch((err) => {
              console.warn(`Failed to precache ${asset}:`, err);
            });
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Skip non-GET requests or requests to APIs, SSE, or external domains
  if (
    e.request.method !== "GET" ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/events") ||
    url.pathname.startsWith("/setData") ||
    url.pathname.startsWith("/data/report") ||
    url.pathname.startsWith("/setDomData") ||
    url.pathname.startsWith("/weatherstation") ||
    url.hostname !== self.location.hostname
  ) {
    return;
  }

  // Stale-while-revalidate strategy for the app shell and local assets
  e.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(e.request).then((cachedResponse) => {
        const fetchPromise = fetch(e.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Silent catch for network failure
        });
        return cachedResponse || fetchPromise;
      });
    })
  );
});
