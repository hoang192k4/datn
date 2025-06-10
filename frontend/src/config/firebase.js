import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyDEcA7HvlFJ68Otqr4xjckQu2c11iEY9Zo",
    authDomain: "datn-52547.firebaseapp.com",
    projectId: "datn-52547",
    storageBucket: "datn-52547.firebasestorage.app",
    messagingSenderId: "729947125468",
    appId: "1:729947125468:web:561987aa3824bc7ff1a619",
    measurementId: "G-MZHER9PX3H"
};


const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

export const VAPID_KEY = "your-vapid-key-here";