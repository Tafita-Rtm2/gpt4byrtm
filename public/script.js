const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatContainer = document.querySelector('#chat-container');
const imageUpload = document.querySelector('#image-upload');

// Charger les messages sauvegardés au démarrage
document.addEventListener('DOMContentLoaded', () => {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    savedMessages.forEach(({ author, message }) => {
        addMessage(author, message);
    });
    chatContainer.scrollTop = chatContainer.scrollHeight;
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
    chatContainer.scrollTop = chatContainer.scrollHeight;

    saveMessage(author, message);
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
        <div class="text">Traitement en cours...</div>
    `;
    chatContainer.appendChild(typingElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return typingElement;
}

function removeTypingIndicator(typingElement) {
    if (typingElement) {
        chatContainer.removeChild(typingElement);
    }
}

// Gérer l'envoi de messages texte
chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    addMessage('user', userMessage);
    const typingIndicator = showTypingIndicator();

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();
        removeTypingIndicator(typingIndicator);

        if (data.response) {
            addMessage('bot', data.response);
        } else {
            addMessage('bot', 'Erreur : Le bot ne répond pas.');
        }
    } catch (error) {
        removeTypingIndicator(typingIndicator);
        addMessage('bot', 'Erreur de communication avec le serveur.');
    }

    chatInput.value = '';
});

// Gérer l'upload d'image
imageUpload.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
        const imgbbResponse = await fetch('https://api.imgbb.com/1/upload?key=6fef3d0d57641305c16bd5c0b5e27426', {
            method: 'POST',
            body: formData
        });

        const imgbbData = await imgbbResponse.json();
        if (imgbbData.success) {
            const imageUrl = imgbbData.data.url;

            addMessage('user', `<img src="${imageUrl}" alt="Uploaded Image" />`);

            const response = await fetch('/upload-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl, prompt: "Analyze this image" })
            });

            const data = await response.json();
            if (data.imageResponse) {
                addMessage('bot', `<img src="${data.imageResponse}" alt="Response Image" />`);
            } else {
                addMessage('bot', 'Erreur lors du traitement de l\'image.');
            }
        } else {
            addMessage('bot', 'Erreur lors de l\'upload de l\'image.');
        }
    } catch (error) {
        addMessage('bot', 'Erreur de communication avec le serveur.');
    }
});
