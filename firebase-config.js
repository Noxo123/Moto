// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDrwlY5bFSGkq7wXveKZUza_1NEmMnNVZ4",
    authDomain: "application-dfc1c.firebaseapp.com",
    databaseURL: "https://application-dfc1c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "application-dfc1c",
    storageBucket: "application-dfc1c.appspot.com",
    messagingSenderId: "539415401283",
    appId: "1:539415401283:web:5fac4a6d3c0a9ae0f155f6",
    measurementId: "G-JX0DWX7JCR"
};

// Initialiser Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
