const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const imageInput = document.querySelector('#image-input');
const chatContainer = document.querySelector('#chat-container');

// Charger les messages sauvegardés au démarrage
document.addEventListener('DOMContentLoaded', () => {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    savedMessages.forEach(({ author, message }) => {
        addMessage(author, message);
    });
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll automatique
});

// Fonction pour ajouter un message
function addMessage(author, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', author);

    messageElement.innerHTML = `
        <img src="${author === 'user' ? 'user.jpg' : 'robot.jpg'}" alt="${author}" />
        <div class="text">${message}</div>
    `;

    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll automatique

    saveMessage(author, message); // Sauvegarder dans LocalStorage
}

// Sauvegarder les messages dans LocalStorage
function saveMessage(author, message) {
    const chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    chatMessages.push({ author, message });
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
}

// Ajouter une indication de "Typing..."
function showTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.classList.add('message', 'bot', 'typing-indicator');
    typingElement.innerHTML = `
        <img src="robot.jpg" alt="bot" />
        <div class="text">Je suis en train de traiter votre réponse...</div>
    `;
    chatContainer.appendChild(typingElement);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll automatique
    return typingElement;
}

// Supprimer l'indicateur "Typing..."
function removeTypingIndicator(typingElement) {
    if (typingElement) {
        chatContainer.removeChild(typingElement);
    }
}

// Gérer l'envoi de messages
chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userMessage = chatInput.value.trim();
    const imageFile = imageInput.files[0];

    if (!userMessage && !imageFile) return;

    // Ajouter le message utilisateur
    addMessage('user', userMessage || '[Image]');

    // Ajouter l'indicateur "Typing..."
    const typingIndicator = showTypingIndicator();

    // Préparer la requête
    const formData = new FormData();
    formData.append('message', userMessage);

    if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
            formData.append('image', reader.result.split(',')[1]);

            // Envoyer la requête au serveur
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    image: reader.result.split(',')[1],
                }),
            });

            const data = await response.json();
            removeTypingIndicator(typingIndicator);
            if (data.response) {
                addMessage('bot', data.response);
            } else {
                addMessage('bot', 'Le bot ne répond pas actuellement.');
            }
        };
        reader.readAsDataURL(imageFile);
    } else {
        // Envoyer uniquement le texte
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();
        removeTypingIndicator(typingIndicator);
        if (data.response) {
            addMessage('bot', data.response);
        } else {
            addMessage('bot', 'Le bot ne répond pas actuellement.');
        }
    }

    chatInput.value = '';
    imageInput.value = '';
});
