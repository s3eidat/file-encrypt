/* S3eidat Tools offline support. Network first (always fresh when online), saved copy when offline.
   Only this tool's own files (same origin, GET). Nothing you type or open is ever cached: only the page's files. */
"use strict";
var CACHE = "s3-tool-v1";
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(function (res) {
    // Big AI model/runtime files (>15 MB) are cached by the AI libraries themselves; don't store them twice.
    var big = Number(res.headers.get("content-length") || 0) > 15e6;
    if (res.status === 200 && res.type === "basic" && !big) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { return c.put(req, copy); }).catch(function () {});
    }
    return res;
  }).catch(function () {
    return caches.match(req).then(function (hit) { return hit || Response.error(); });
  }));
});
