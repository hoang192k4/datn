
import { getToken } from "firebase/messaging";
import { messaging } from '../config/firebase';


import { api } from "../config/api";

export const updateDeviceToken = async (deviceToken: string) => {
    const response = api.post('/device-token', {
        device_token: deviceToken
    });

    return response;
}




export const getFCMToken = async ([permission, setPermission]: any) => {

    try {
        // Request permission
        const permission = await Notification.requestPermission();

        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

        setPermission(permission);

        if (permission === 'granted') {
            // Lấy token
            const currentToken = await getToken(messaging, {
                vapidKey: 'BC5hCaXURA0hYpAX0qR_9IhakOjgYghkAIN0bSkutxWcsmLxtG821P4XDKc-GLq2ThzXC_msqb9h9fVIbKksA3E', // Lấy từ Firebase Console > Project Settings > Cloud Messaging,
                serviceWorkerRegistration: registration,
            });

            if (currentToken) {
                console.log('FCM Token:', currentToken);

                // Gửi token lên server Laravel
                updateDeviceToken(currentToken).then((data) => { if(data.status==200) console.log('Cập nhật device-token thành công!') });
            } else {
                console.log('No registration token available.');
            }
        } else {
            console.log('Unable to get permission to notify.');
        }
    } catch (error) {
        console.error('An error occurred while retrieving token:', error);
    }
};