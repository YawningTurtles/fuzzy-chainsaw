/* Service worker for the Maryland Deathfest XXII companion.
   Scope is /mdf/ only, so it never collides with the strength tracker's worker
   at the site root or the touch trainer's in /touch/.

   Shell is cache-first so the app cold-launches in airplane mode.
   bands.json is network-first so an updated lineup propagates when there is
   signal, while still opening from cache when there is none.

   BUMP THIS VERSION whenever any shell file changes, or installed phones keep
   serving the old app for weeks. */
const CACHE = "mdf-v1";

const SHELL = [
  "./",
  "./index.html",
  "./app.css",
  "./app.js",
  "./manifest.webmanifest",
  "./bands.json",
  "./fonts/archivo-var-latin.woff2",
  "./fonts/instrument-serif-italic-latin.woff2",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon-180.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.allSettled(SHELL.map((a) => c.add(a))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE && k.startsWith("mdf-")).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // A cold offline launch asks for a navigation; answer it with the cached shell.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", copy));
          return resp;
        })
        .catch(() => caches.match("./index.html", { ignoreSearch: true })
          .then((cached) => cached || caches.match("./", { ignoreSearch: true })))
    );
    return;
  }

  // Data: network first, so a lineup update lands; cache is the fallback.
  if (url.pathname.endsWith("/bands.json")) {
    e.respondWith(
      fetch(req)
        .then((resp) => {
          if (resp && resp.ok) {
            const copy = resp.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return resp;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }

  // Shell: cache first, refreshed in the background when there is a connection.
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      const fresh = fetch(req)
        .then((resp) => {
          if (resp && resp.ok) {
            const copy = resp.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return resp;
        })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});
