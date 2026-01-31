const CACHE_NAME = 'ahmed-portfolio-v1.1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Cache addAll error:', err);
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - معدل
self.addEventListener('fetch', event => {
  // Skip non-HTTP/HTTPS requests
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Skip Chrome extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }
  
  // Skip Formspree requests (don't cache)
  if (event.request.url.includes('formspree.io')) {
    return fetch(event.request);
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200) {
            return response;
          }
          
          // Check response type (skip opaque responses)
          if (response.type === 'opaque' || response.type === 'opaqueredirect') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          // Add to cache
          caches.open(CACHE_NAME)
            .then(cache => {
              try {
                cache.put(event.request, responseToCache);
              } catch (err) {
                console.log('Cache put error:', err);
              }
            });
          
          return response;
        }).catch(err => {
          console.log('Fetch failed:', err);
          // يمكنك إرجاع fallback page هنا
          return new Response('You are offline. Please check your connection.');
        });
      })
  );
});