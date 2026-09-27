// ===== Service Worker - Direction Team PWA =====
const CACHE_NAME = 'direction-team-v1';
const OFFLINE_URL = './offline.html';

// الملفات اللي راح تنخزن offline
const CACHE_FILES = [
  './',
  './index.html',
  './materials.html',
  './plans.html',
  './exam.html',
  './programs.html',
  './calculator.html',
  './map.html',
  './reminders.html',
  './dictionary.html',
  './suggestions.html',
  './links.html',
  './contact.html',
  './new-students.html',
  './style.css',
  './script.js',
  './logo.png'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching files...');
      return cache.addAll(CACHE_FILES);
    })
  );
  self.skipWaiting();
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// اعتراض الطلبات
self.addEventListener('fetch', event => {
  // تجاهل الطلبات اللي مو من نفس الموقع
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // إذا موجود في الكاش، رجّعه + حدّثه في الخلفية
        fetch(event.request).then(response => {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, response.clone());
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // إذا مو موجود، جرّب من النت
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // لو ما في نت وما في كاش
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});
