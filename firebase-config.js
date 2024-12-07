// Configuration Firebase
const firebaseConfig = {
    apiKey: "TON_API_KEY",
    authDomain: "ton-projet.firebaseapp.com",
    projectId: "ton-projet",
    storageBucket: "ton-projet.appspot.com",
    messagingSenderId: "ID",
    appId: "ID",
    measurementId: "ID"
};

// Initialisation de Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
const auth = firebase.auth(app);
const storage = firebase.storage();