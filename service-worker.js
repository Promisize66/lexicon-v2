const CACHE='lexicon-v2-static-3';
const ASSETS=['./','./index.html','./manifest.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('lexicon-v2-')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})())});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;if(req.mode==='navigate'){event.respondWith((async()=>{try{const res=await fetch(req);if(res.ok){const cache=await caches.open(CACHE);await cache.put('./index.html',res.clone())}return res}catch{return await caches.match('./index.html')||Response.error()}})());return}event.respondWith(caches.match(req).then(cached=>cached||fetch(req)))});
