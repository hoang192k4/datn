importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyDEcA7HvlFJ68Otqr4xjckQu2c11iEY9Zo",
    authDomain: "datn-52547.firebaseapp.com",
    projectId: "datn-52547",
    storageBucket: "datn-52547.firebasestorage.app",
    messagingSenderId: "729947125468",
    appId: "1:729947125468:web:561987aa3824bc7ff1a619",
    measurementId: "G-MZHER9PX3H"
};
const app = firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    const { title, body, icon, click_action } = payload.notification;

    const notificationOptions = {
        body: body,
        icon: icon || '/logo192.png',
        data: {
            click_action: click_action || '/',
        },
    };

    self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    const click_action = event.notification.data?.click_action || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            // Nếu tab đã mở
            for (const client of clientList) {
                if (client.url === click_action && 'focus' in client) {
                    return client.focus();
                }
            }

            // Nếu chưa mở → mở mới
            if (clients.openWindow) {
                return clients.openWindow(click_action);
            }
        })
    );
});


self.addEventListener('push', function (event) {
    const payload = event.data.json();
    const notification = payload.notification;

    const options = {
        body: notification.body,
        icon: notification.icon,
        data: {
            click_action: notification.click_action
        },
    };
    console.log(notification);
    event.waitUntil(
        self.registration.showNotification(notification.title, options)
    );
});
