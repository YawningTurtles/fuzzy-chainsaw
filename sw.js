/* Service worker for the Kinetic Chain Tracker.

   The HTML file *is* the whole app, so the document is fetched network-first
   with a short timeout and only falls back to the cache when that fails. A
   cache-first document meant an installed Home Screen app kept serving the
   build it was installed with: iOS resumes a standalone app from a frozen
   snapshot rather than re-navigating, so a background revalidation might not
   be seen for days. Network-first costs a few hundred milliseconds on a good
   connection and still opens instantly with no signal at all.

   Static assets (icons, manifest) stay cache-first — they effectively never
   change, and they are what makes the offline launch fast. */

const CACHE = "kct-v9";
const ASSETS = ["./", "./index.html", "./tracker.html", "./manifest.webmanifest", "./icon-180.png", "./icon-512.png"];
const NET_TIMEOUT = 2500;

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
      /* Only ever evict this app's own caches. The sub-apps in touch/, warmup/
         and mdf/ have their own service workers at narrower scopes, but they
         share this origin's cache storage — caches.keys() returns theirs too. */
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith("kct-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isDocument(req){
  return req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
}

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const req = e.request;

  if (isDocument(req)){
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      let timer;
      try {
        const resp = await Promise.race([
          fetch(req),
          new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("timeout")), NET_TIMEOUT); })
        ]);
        if (!resp || !resp.ok) throw new Error("bad response");
        cache.put(req, resp.clone());
        return resp;
      } catch (err) {
        return (await cache.match(req, { ignoreSearch: true }))
            || (await cache.match("./tracker.html"))
            || (await cache.match("./index.html"))
            || Response.error();
      } finally {
        clearTimeout(timer);
      }
    })());
    return;
  }

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
