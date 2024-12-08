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
        // Obtenir l'accès au microphone
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        statusText.textContent = 'Statut : En appel';
        startCallButton.style.display = 'none';
        endCallButton.style.display = 'inline-block';

        // Enregistrer l'appel dans Firebase
        const callRef = database.ref('calls').push();
        callRef.set({ active: true });

        console.log('Appel démarré, ID:', callRef.key);
    } catch (error) {
        console.error('Erreur lors du démarrage de l\'appel :', error);
        alert('Impossible d\'accéder au microphone.');
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
