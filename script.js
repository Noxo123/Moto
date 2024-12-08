import { database } from './firebase-config.js';
import { ref, push, onChildAdded } from 'firebase/database';

// Références HTML
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Référence Firebase
const messagesRef = ref(database, 'messages');

// Ajouter un message
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim() !== '') {
        push(messagesRef, { text: message, timestamp: Date.now() });
        messageInput.value = '';
    }
});

// Afficher les messages en temps réel
onChildAdded(messagesRef, (snapshot) => {
    const messageData = snapshot.val();
    const messageElement = document.createElement('div');
    messageElement.textContent = messageData.text;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll automatique
});

// Ajouter la géolocalisation (optionnel)
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log('Position détectée :', position.coords);
        },
        (error) => {
            console.error('Erreur de géolocalisation :', error);
        }
    );
} else {
    console.log('Géolocalisation non supportée par ce navigateur.');
}
