const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatContainer = document.querySelector('#chat-container');
const imageInput = document.querySelector('#image-input');

// Indicateur de chargement
let isImageUploading = false;

// Fonction pour ajouter un message dans l'interface
function addMessage(author, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', author);
    messageElement.innerHTML = `<div class="text">${message}</div>`;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Gestion de l'envoi de messages
chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userMessage = chatInput.value.trim();
    const imageFile = imageInput.files[0];

    if (!userMessage && !imageFile) return;

    // Affichage du message utilisateur
    addMessage('user', userMessage || 'Image envoyée.');

    if (imageFile) {
        // Afficher un message de chargement pour l'image
        addMessage('bot', '⏳ Téléchargement de l\'image en cours...');

        const reader = new FileReader();
        reader.onload = async () => {
            const imageData = reader.result.split(',')[1];
            isImageUploading = true;

            try {
                // Télécharger l'image sur Imgbb
                const imgbbResponse = await fetch(
                    `https://api.imgbb.com/1/upload?key=6fef3d0d57641305c16bd5c0b5e27426`,
                    {
                        method: 'POST',
                        body: new URLSearchParams({ image: imageData }),
                    }
                );
                const imgbbData = await imgbbResponse.json();

                if (!imgbbData.success) throw new Error('Erreur lors du téléchargement de l\'image.');

                const imageUrl = imgbbData.data.url;
                isImageUploading = false;

                // Supprimer le message de chargement
                document.querySelector('.message.bot:last-child .text').textContent =
                    '✅ Image téléchargée avec succès.';

                // Envoyer l'image + texte à l'API
                const finalPrompt = userMessage
                    ? `${userMessage} Image: ${imageUrl}`
                    : `Image: ${imageUrl}`;

                const response = await fetch('/upload-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: imageUrl, prompt: userMessage }),
                });

                const data = await response.json();
                addMessage('bot', data.response || 'Erreur avec l\'API image.');
            } catch (error) {
                isImageUploading = false;
                addMessage('bot', '❌ Une erreur est survenue avec l\'image.');
            }
        };
        reader.readAsDataURL(imageFile);
    } else {
        // Mode texte uniquement
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();
        addMessage('bot', data.response || 'Erreur avec l\'API texte.');
    }

    chatInput.value = '';
    imageInput.value = '';
});
