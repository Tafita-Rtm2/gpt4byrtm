const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatContainer = document.querySelector('#chat-container');
const fileInput = document.querySelector('#file-input');

// Fonction pour ajouter un message
function addMessage(author, message, imageUrl = null) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', author);

    if (imageUrl) {
        messageElement.innerHTML = `
            <img src="${author === 'user' ? 'user.jpg' : 'robot.jpg'}" alt="${author}" />
            <div class="text">
                <p>${message || ''}</p>
                <img src="${imageUrl}" alt="Image envoyée" style="max-width: 100%; border-radius: 10px;" />
            </div>
        `;
    } else {
        messageElement.innerHTML = `
            <img src="${author === 'user' ? 'user.jpg' : 'robot.jpg'}" alt="${author}" />
            <div class="text">${message}</div>
        `;
    }

    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    saveMessage(author, message, imageUrl);
}

// Sauvegarder les messages
function saveMessage(author, message, imageUrl) {
    const chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    chatMessages.push({ author, message, imageUrl });
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
}

// Ajouter un indicateur de "Typing..."
function showTypingIndicator(type) {
    const typingElement = document.createElement('div');
    typingElement.classList.add('message', 'bot', 'typing-indicator');

    if (type === 'upload') {
        typingElement.innerHTML = `
            <div class="text">Image en cours de téléchargement...</div>
        `;
    } else {
        typingElement.innerHTML = `
            <img src="robot.jpg" alt="bot" />
            <div class="text">Le bot est en train de répondre...</div>
        `;
    }

    chatContainer.appendChild(typingElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
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
    const file = fileInput.files[0];
    if (!userMessage && !file) return;

    let imageUrl = null;

    // Indicateur de téléchargement d'image
    let uploadIndicator;
    if (file) {
        uploadIndicator = showTypingIndicator('upload');

        const formData = new FormData();
        formData.append('image', file);

        try {
            const uploadResponse = await fetch('https://api.imgbb.com/1/upload?key=VOTRE_CLE_API_IMGBB', {
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadResponse.json();
            if (uploadData.success) {
                imageUrl = uploadData.data.url;
            } else {
                addMessage('bot', 'Erreur lors du téléchargement de l\'image.');
                removeTypingIndicator(uploadIndicator);
                return;
            }
        } catch (error) {
            addMessage('bot', 'Erreur lors du téléchargement de l\'image.');
            removeTypingIndicator(uploadIndicator);
            return;
        }
        removeTypingIndicator(uploadIndicator);
    }

    // Ajouter le message utilisateur
    addMessage('user', userMessage, imageUrl);

    // Ajouter un indicateur "Typing..." pour le bot
    const typingIndicator = showTypingIndicator();

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage, imageUrl }),
        });

        const data = await response.json();

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
    fileInput.value = '';
});
