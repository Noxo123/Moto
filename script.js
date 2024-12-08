import { database } from './firebase-config.js';
import { ref, set, onValue } from 'firebase/database';

const startCallButton = document.getElementById('start-call');
const stopCallButton = document.getElementById('stop-call');
const remoteAudio = document.getElementById('remote-audio');
const statusDiv = document.getElementById('status');

// WebRTC Variables
let localStream;
let peerConnection;
const servers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

// Références Firebase
const callRef = ref(database, 'calls');

// Initialiser le flux local
async function startCall() {
    statusDiv.textContent = "Connexion en cours...";
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    peerConnection = new RTCPeerConnection(servers);
    peerConnection.addStream(localStream);

    // Gestion des flux entrants
    peerConnection.onaddstream = (event) => {
        remoteAudio.srcObject = event.stream;
    };

    // Gestion des ICE candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            set(callRef, { candidate: event.candidate });
        }
    };

    // Créer une offre
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    set(callRef, { offer });

    // Écouter les réponses
    onValue(callRef, async (snapshot) => {
        const data = snapshot.val();
        if (data?.answer && !peerConnection.remoteDescription) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
        if (data?.candidate) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    });

    startCallButton.disabled = true;
    stopCallButton.disabled = false;
    statusDiv.textContent = "Connecté.";
}

// Arrêter l'appel
function stopCall() {
    if (peerConnection) peerConnection.close();
    if (localStream) localStream.getTracks().forEach((track) => track.stop());

    startCallButton.disabled = false;
    stopCallButton.disabled = true;
    statusDiv.textContent = "Appel terminé.";
}

// Gestion des boutons
startCallButton.addEventListener('click', startCall);
stopCallButton.addEventListener('click', stopCall);
