/* PWA service worker — app shell + API cache */
const SHELL = "maktaba-shell-v4";
const API_CACHE = "maktaba-api-v4";
const SHELL_URLS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/logo.png",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/placeholder-book.svg",
  "/robots.txt",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== SHELL && k !== API_CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((res) => {
      if (res && res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => null);
  if (cached) {
    networkPromise.catch(() => {});
    return cached;
  }
  const network = await networkPromise;
  if (network) return network;
  throw new Error("offline");
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin === self.location.origin && url.pathname.startsWith("/api/")) {
    event.respondWith(
      staleWhileRevalidate(request, API_CACHE).catch(
        () =>
          new Response(JSON.stringify({ error: "Offline", items: [], total: 0, page: 1, pages: 1 }), {
            headers: { "Content-Type": "application/json" },
          })
      )
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL).then((c) => c.put("/index.html", copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match("/index.html").then((r) => r || caches.match("/")))
    );
    return;
  }

  if (
    url.origin === self.location.origin &&
    /\.(js|css|png|svg|ico|webmanifest|woff2?)$/i.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(SHELL).then((c) => c.put(request, copy));
            }
            return res;
          })
      )
    );
  }
});
