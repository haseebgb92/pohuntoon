const CACHE_NAME = "pohuntoon-v2";
const RUNTIME_CACHE = "pohuntoon-runtime-v1";
const OFFLINE_URLS = [
  "/offline",
  "/offline.html",
  "/icons/pohuntoon-192.png",
  "/icons/pohuntoon-512.png",
  "/icons/pohuntoon-maskable-512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const offlineDocument = await caches.match("/offline.html");
        if (offlineDocument) {
          return offlineDocument;
        }

        const offlineRoute = await caches.match("/offline");
        return offlineRoute || Response.error();
      }),
    );
    return;
  }

  const destination = event.request.destination;
  if (["style", "script", "image", "font"].includes(destination)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          return cached;
        }

        return fetch(event.request).then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, copy));
          return response;
        });
      }),
    );
  }
});

self.addEventListener("push", (event) => {
  const payload = event.data?.json?.() || {
    title: "Pohuntoon update",
    body: "Open Pohuntoon to view the latest activity.",
    url: "/app/notifications",
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || "Pohuntoon update", {
      body: payload.body || payload.message || "Open Pohuntoon to view the latest activity.",
      icon: "/icons/pohuntoon-192.png",
      badge: "/icons/pohuntoon-192.png",
      data: { url: payload.url || "/app/notifications" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/app/notifications";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existingClient = clients.find((client) => client.url.includes(url));

      if (existingClient) {
        return existingClient.focus();
      }

      return self.clients.openWindow(url);
    }),
  );
});
