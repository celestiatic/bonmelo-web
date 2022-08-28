self.addEventListener("install", function (event) {
  console.log("Hello world from the Service Worker 🤙", self);
});

const staticCacheName = "sw-cache";
self.addEventListener("activate", (e) => {
  caches.keys().then((t) => {
    for (let s of t) "sw-cache" !== s && e.waitUntil(caches.delete(s));
  }),
    e.waitUntil(self.clients.claim());
}),
  self.addEventListener("install", (e) => {
    e.waitUntil(self.skipWaiting()),
      e.waitUntil(caches.open("sw-cache").then((e) => e.add("/")));
  }),
  self.addEventListener("fetch", async (e) => {
    const t = new URL(e.request.url).host;
    [
      "localhost:3000",
      "localhost:3001",
      "https://chat.bonmelo.com",
      "api.github.com",
      "www.google-analytics.com",
    ].includes(t)
      ? e.respondWith(fetch(e.request))
      : e.respondWith(
          caches
            .open("sw-cache")
            .then((t) =>
              t
                .match(e.request)
                .then(
                  async (s) =>
                    s ||
                    ((s = await fetch(e.request)),
                    t.put(e.request.url, s.clone()),
                    s)
                )
            )
        );
  });