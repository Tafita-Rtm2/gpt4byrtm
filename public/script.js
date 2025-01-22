const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatContainer = document.querySelector('#chat-container');
const imageUpload = document.querySelector('#image-upload');

// Fonction pour ajouter un message
function addMessage(author, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', author);

    messageElement.innerHTML = `
        <div class="text">${message}</div>
    `;

    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Gérer l'envoi de messages et d'images
chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userMessage = chatInput.value.trim();
    const file = imageUpload.files[0];

    if (!userMessage && !file) {
        return;
    }

    // Ajouter le message utilisateur
    if (userMessage) addMessage('user', userMessage);

    if (file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
            // Upload de l'image sur Imgbb
            const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=6fef3d0d57641305c16bd5c0b5e27426`, {
                method: 'POST',
                body: formData,
            });

            const imgbbData = await imgbbResponse.json();
            if (imgbbData.success) {
                const imageUrl = imgbbData.data.url;

                // Envoyer le prompt et l'image au serveur
                const response = await fetch('/upload-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageUrl, prompt: userMessage }),
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
    }

    chatInput.value = '';
    imageUpload.value = '';
});
