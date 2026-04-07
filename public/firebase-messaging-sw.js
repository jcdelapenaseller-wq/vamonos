importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDfOgpAsekvxIG7dzNB_O7fr463iC6qLdk",
  authDomain: "subastas-490722.firebaseapp.com",
  projectId: "subastas-490722",
  messagingSenderId: "578371071427",
  appId: "1:578371071427:web:bc09a8de21078be0546176"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || 'Nueva alerta de subasta';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'Tienes una nueva notificación.',
    icon: '/icon-192.png',
    data: {
      url: payload.data?.url || payload.fcmOptions?.link || '/'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Si la URL ya está abierta en una pestaña, la enfocamos
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no, abrimos una nueva ventana/pestaña
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
