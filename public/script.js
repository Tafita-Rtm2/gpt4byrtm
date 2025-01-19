const chat = document.getElementById('chat');
const form = document.getElementById('message-form');
const input = document.getElementById('user-input');
const fileInput = document.getElementById('file-input');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const userMessage = input.value.trim();
    if (userMessage) {
        addMessage(userMessage, 'user');
        try {
            const response = await sendMessage({ message: userMessage });
            addMessage(response, 'bot');
        } catch (error) {
            addMessage("Erreur lors de la communication avec le serveur.", 'bot');
        }
    }
    input.value = '';
});

fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (file) {
        const fileURL = await uploadFile(file);
        addMessage('Image envoyée.', 'user', fileURL);
        try {
            const response = await sendMessage({ imageUrl: fileURL });
            addMessage(response, 'bot');
        } catch (error) {
            addMessage("Erreur lors de la communication avec le serveur.", 'bot');
        }
    }
});

function addMessage(content, sender, fileURL = null) {
    const message = document.createElement('div');
    message.classList.add('message', sender);

    const img = document.createElement('img');
    img.src = sender === 'bot' ? 'robot.jpg' : 'user.jpg';

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');

    if (fileURL) {
        const imgElement = document.createElement('img');
        imgElement.src = fileURL;
        imgElement.style.maxWidth = '200px';
        contentDiv.appendChild(imgElement);
    } else {
        contentDiv.textContent = content;
    }

    message.appendChild(img);
    message.appendChild(contentDiv);
    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
}

async function sendMessage(data) {
    const response = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Erreur serveur');
    }
    const result = await response.json();
    return result.response;
}

async function uploadFile(file) {
    const fileURL = URL.createObjectURL(file);
    return fileURL;
}
