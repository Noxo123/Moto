// Importer Firebase Database
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";

// Éléments DOM
const startCallButton = document.getElementById('start-call');
const endCallButton = document.getElementById('end-call');
const statusText = document.getElementById('status');

// Variables globales
let localStream = null;
let peerConnection = null;

// Gérer les boutons
startCallButton.addEventListener('click', startCall);
endCallButton.addEventListener('click', endCall);

async function startCall() {
    try {
        console.log('Tentative d\'accès au microphone...');

        // Obtenir l'accès au microphone
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        console.log('Accès au microphone accordé');
        
        // Mettre à jour l'interface utilisateur
        statusText.textContent = 'Statut : En appel';
        startCallButton.style.display = 'none';
        endCallButton.style.display = 'inline-block';

        // Enregistrer l'appel dans Firebase
        const callRef = ref(database, 'calls/' + new Date().getTime());
        set(callRef, { active: true });

        console.log('Appel démarré');
    } catch (error) {
        console.error('Erreur lors de l\'accès au microphone :', error);
        
        // Gestion des erreurs spécifiques
        if (error.name === 'NotAllowedError') {
            alert('Vous devez autoriser l\'accès au microphone.');
        } else if (error.name === 'NotFoundError') {
            alert('Aucun microphone n\'a été trouvé sur votre appareil.');
        } else {
            alert('Une erreur est survenue lors de l\'accès au microphone. Veuillez réessayer.');
        }
    }
}

function endCall() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    statusText.textContent = 'Statut : Déconnecté';
    startCallButton.style.display = 'inline-block';
    endCallButton.style.display = 'none';

    console.log('Appel terminé.');
}
