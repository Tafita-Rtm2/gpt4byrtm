const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatContainer = document.querySelector('#chat-container');

// Fonction pour ajouter un message
function addMessage(author, message, avatar) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', author === 'user' ? 'user' : 'bot');

    messageElement.innerHTML = `
        <div class="text">${message}</div>
    `;

    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll automatique
}

// Gérer l'envoi de messages
chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Ajouter le message utilisateur
    addMessage('user', userMessage);

    // Envoyer la requête au serveur
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();

        // Ajouter la réponse du bot
        if (data.response) {
            addMessage('bot', data.response);
        } else {
            addMessage('bot', 'Le bot ne répond pas actuellement.');
        }
    } catch (error) {
        addMessage('bot', 'Erreur lors de la communication avec le serveur.');
    }

    chatInput.value = '';
});
