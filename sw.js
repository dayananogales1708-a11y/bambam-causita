const CACHE='bambam-causita-v40-rebote-al-marcar';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./mascot.png'];

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k.startsWith('bambam-causita-') && k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  if(e.request.mode==='navigate'){
    e.respondWith(
      fetch(e.request,{cache:'no-store'})
        .then(r=>{const x=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',x));return r;})
        .catch(()=>caches.match('./index.html'))
    );
  }else{
    e.respondWith(
      caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{
        const x=r.clone();caches.open(CACHE).then(c=>c.put(e.request,x));return r;
      }))
    );
  }
});
