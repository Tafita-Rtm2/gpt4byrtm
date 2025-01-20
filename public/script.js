const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
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
        <div class="text">Typing...</div>
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
    if (!userMessage) return;

    // Ajouter le message utilisateur
    addMessage('user', userMessage);

    // Ajouter l'indicateur "Typing..."
    const typingIndicator = showTypingIndicator();

    // Envoyer la requête au serveur
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();

        // Supprimer l'indicateur "Typing..." et ajouter la réponse du bot
        removeTypingIndicator(typingIndicator);
        if (data.response) {
            addMessage('bot', data.response);
        } else {
            addMessage('bot', 'Le bot ne répond pas actuellement.');
        }
    } catch (error) {
        removeTypingIndicator(typingIndicator);
        addMessage('bot', 'Erreur lors de la communication avec le serveur.');
    }

    chatInput.value = '';
});
