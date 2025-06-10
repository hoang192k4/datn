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
