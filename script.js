// Importation des modules Firebase v9
import { getFirestore, collection, getDocs, addDoc, query, orderBy } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

// Initialisation de Firebase
const db = getFirestore();
const storage = getStorage();
const auth = getAuth();

navigator.mediaDevices.enumerateDevices().then(devices => {
    const microphone = devices.find(device => device.kind === 'audioinput');
    if (!microphone) {
      console.log('Aucun microphone trouvé.');
    }
  });

  
// Fonction pour charger les posts depuis Firestore
async function loadPosts() {
    const postsContainer = document.getElementById('blogContainer');
    if (!postsContainer) return; // Vérifier si l'élément existe

    postsContainer.innerHTML = ''; // Réinitialiser le contenu avant de charger les nouveaux articles

    // Créer une requête Firestore pour récupérer les documents de la collection 'posts' triés par timestamp
    const postsQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));

    try {
        const postsSnapshot = await getDocs(postsQuery); // Récupérer les documents
        postsSnapshot.forEach((doc) => {
            const post = doc.data();
            const postElement = document.createElement('div');
            postElement.classList.add('post-card');

            postElement.innerHTML = `
                <img src="${post.imageUrl}" alt="${post.title}">
                <h2>${post.title}</h2>
                <p>${post.content}</p>
            `;

            postsContainer.appendChild(postElement); // Ajouter chaque post à la page
        });
    } catch (error) {
        console.error('Erreur de récupération des posts:', error);
    }
}

// Fonction pour publier un post
async function publishPost(title, content, imageFile) {
    const user = auth.currentUser;
    if (!user) {
        alert('Vous devez être connecté pour publier un post.');
        return;
    }

    // Gérer l'upload de l'image
    const storageRef = ref(storage, `images/${imageFile.name}`);
    try {
        const uploadSnapshot = await uploadBytes(storageRef, imageFile);
        const imageUrl = await uploadSnapshot.ref.getDownloadURL();

        // Ajouter le post à la base de données Firestore
        const postRef = await addDoc(collection(db, 'posts'), {
            title: title,
            content: content,
            imageUrl: imageUrl,
            timestamp: new Date(),
            userId: user.uid
        });

        console.log('Post publié avec succès !');
        loadPosts(); // Recharger les posts après publication
    } catch (error) {
        console.error('Erreur lors de la publication du post:', error);
    }
}

// Vérifier si l'utilisateur est connecté
firebase.auth().onAuthStateChanged(user => {
    if (user) {
      console.log("Utilisateur connecté :", user.email);
    } else {
      console.log("Utilisateur non connecté");
    }
  });  

// Fonction pour gérer la soumission du formulaire de publication
document.addEventListener('DOMContentLoaded', () => {
    const publishForm = document.getElementById('publishForm');
    if (publishForm) {
        publishForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const title = document.getElementById('titleInput').value;
            const content = document.getElementById('contentInput').value;
            const imageFile = document.getElementById('imageInput').files[0];

            if (title && content && imageFile) {
                publishPost(title, content, imageFile);
            } else {
                alert('Veuillez remplir tous les champs et ajouter une image.');
            }
        });
    }

    // Vérifier si le bouton de chat vocal existe et ajouter l'événement
    const startChatBtn = document.getElementById('startChatBtn');
    if (startChatBtn) {
        startChatBtn.addEventListener('click', () => {
            initProximityChat();
        });
    }
});

// Fonction d'accès au microphone
navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
        console.log("Microphone détecté !");
    })
    .catch((error) => {
        console.error("Erreur : Aucun microphone trouvé ou permissions refusées.", error);
    });


// Fonction pour initier le chat de proximité vocal
function initProximityChat() {
    startAudioCapture();
    // Ajouter la logique pour le chat vocal entre les motards
    // Cela peut inclure la gestion de flux audio avec WebRTC pour la communication en temps réel
}

// Charger les posts au démarrage de la page
loadPosts();
