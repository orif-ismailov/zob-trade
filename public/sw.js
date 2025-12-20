// Service Worker - Install only (PWA support)

// Install event - just skip waiting
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

// Activate event - claim clients
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// Fetch event - pass through to network (no caching)
self.addEventListener('fetch', (event) => {
  // Simply fetch from network, no caching
  return;
});
