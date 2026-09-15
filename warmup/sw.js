/* Service worker for the 11+ Warm-up.
   The document goes network-first with a short timeout so an installed Home
   Screen app actually picks up a new build, then falls back to the cache so the
   block still runs with no signal at the pitch. Assets stay cache-first.
   Scoped to its own cache so it never collides with the tracker's. */
const CACHE = "warmup-v2";
const NET_TIMEOUT = 2500;
const ASSETS = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icon-180.png", "./icon-512.png", "./icon-maskable-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.allSettled(ASSETS.map((a) => c.add(a))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("warmup-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isDocument(req){
  return req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
}

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  if (isDocument(e.request)){
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      let timer;
      try {
        const resp = await Promise.race([
          fetch(e.request),
          new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("timeout")), NET_TIMEOUT); })
        ]);
        if (!resp || !resp.ok) throw new Error("bad response");
        cache.put(e.request, resp.clone());
        return resp;
      } catch (err) {
        return (await cache.match(e.request, { ignoreSearch: true }))
            || (await cache.match("./index.html"))
            || Response.error();
      } finally {
        clearTimeout(timer);
      }
    })());
    return;
  }

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((cached) => {
      const fresh = fetch(e.request)
        .then((resp) => {
          if (resp && resp.ok) {
            const copy = resp.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return resp;
        })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});
