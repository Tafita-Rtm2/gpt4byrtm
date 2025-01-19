// script.js
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatContainer = document.querySelector('#chat-container');

// Fonction pour afficher un message
function addMessage(author, message, avatar) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', author === 'user' ? 'user' : 'bot');

    messageElement.innerHTML = `
        <img src="${avatar}" alt="${author}" class="avatar">
        <span class="text">${message}</span>
    `;

    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll automatique
}

// Écouter l'envoi de messages
chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Ajouter le message utilisateur dans l'interface
    addMessage('user', userMessage, 'user.jpg');

    // Envoyer le message à l'API
    try {
        const response = await fetch('https://kaiz-apis.gleeze.com/api/gemini-vision', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: userMessage,
                uid: 1
            })
        });

        const data = await response.json();

        // Ajouter la réponse du bot dans l'interface
        if (data.response) {
            addMessage('bot', data.response, 'robot.jpg');
        } else {
            addMessage('bot', 'Désolé, aucune réponse reçue.', 'robot.jpg');
        }
    } catch (error) {
        console.error('Erreur API:', error);
        addMessage('bot', 'Erreur lors de la communication avec le serveur.', 'robot.jpg');
    }

    // Réinitialiser le champ de saisie
    chatInput.value = '';
});
