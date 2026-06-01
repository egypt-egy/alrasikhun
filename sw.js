// sw.js - Service Worker لمنصة الراسخون في العلم
const CACHE_NAME = 'alrasikhun-v2'; // تم تحديث الإصدار لتحديث الكاش تلقائياً عند المستخدمين
const OFFLINE_URL = '/elnigm1/offline.html';

// الملفات التي سيتم تخزينها مؤقتاً
const urlsToCache = [
  '/elnigm1/',
  '/elnigm1/index.html',
  '/elnigm1/css/style.css',
  '/elnigm1/js/main.js',
  '/elnigm1/images/logo.png'
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// استقبال الإشعارات
self.addEventListener('push', (event) => {
  let data = {};
  
  if (event.data) {
    data = event.data.json();
  }
  
  const title = data.title || '📚 منصة الراسخون في العلم';
  const options = {
    body: data.body || 'تم إضافة محتوى تعليمي جديد! ادخل الآن للاستفادة',
    icon: '/elnigm1/images/logo.png',
    badge: '/elnigm1/images/logo.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/elnigm1/'
    },
    actions: [
      {
        action: 'open',
        title: '📖 تصفح المنصة'
      },
      {
        action: 'close',
        title: '🔕 إغلاق'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// التعامل مع الضغط على الإشعار
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const urlToOpen = event.notification.data.url;
    event.waitUntil(
      clients.openWindow(urlToOpen)
    );
  }
});

// جلب المحتوى مع دعم العمل بدون إنترنت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    }).catch(() => {
      return caches.match('/elnigm1/offline.html');
    })
  );
});
