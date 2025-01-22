const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatContainer = document.querySelector('#chat-container');
const imageInput = document.querySelector('#image-input');

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

    addMessage('user', userMessage || 'Image envoyée.');

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = async () => {
            const imageData = reader.result.split(',')[1];
            const response = await fetch('/upload-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageData, prompt: userMessage }),
            });

            const data = await response.json();
            addMessage('bot', data.response || "Erreur avec l'image.");
        };
        reader.readAsDataURL(imageFile);
    } else {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();
        addMessage('bot', data.response || "Erreur avec le texte.");
    }

    chatInput.value = '';
    imageInput.value = '';
});
