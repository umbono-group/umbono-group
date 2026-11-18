const C="chantiers-v6";
const A=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-180.png","icon-maskable-512.png","favicon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);
  const same=u.origin===location.origin, gs=u.hostname==="www.gstatic.com";
  if(!same&&!gs)return;
  e.respondWith((gs?fetch(e.request):fetch(e.request.url,{cache:"no-cache"})).then(r=>{
    if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}
    return r;
  }).catch(()=>caches.match(e.request).then(m=>m||(same?caches.match("index.html"):Response.error()))));
});
