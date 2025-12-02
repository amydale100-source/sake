const CACHE_NAME = "cocktail-pwa-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/app.js"
];

// 安裝
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
  );
});

// 攔截請求
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
