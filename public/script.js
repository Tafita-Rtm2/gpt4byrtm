const chat = document.getElementById('chat');
const form = document.getElementById('message-form');
const input = document.getElementById('user-input');
const fileInput = document.getElementById('file-input');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const userMessage = input.value;
    if (userMessage.trim()) {
        addMessage(userMessage, 'user');
        const response = await fetchMessage(userMessage);
        addMessage(response, 'bot');
    }
    input.value = '';
});

fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (file) {
        const fileURL = await uploadFile(file);
        addMessage('Image envoyée.', 'user', fileURL);
        const response = await fetchMessage(fileURL, true);
        addMessage(response, 'bot');
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

async function fetchMessage(input, isImage = false) {
    const url = isImage
        ? `https://kaiz-apis.gleeze.com/api/gemini-vision?q=&uid=1&imageUrl=${input}`
        : `https://kaiz-apis.gleeze.com/api/gemini-vision?q=${input}&uid=1`;
    const response = await fetch(url);
    const data = await response.json();
    return data.response;
}

async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    // Remplacez par une URL d'upload si nécessaire.
    const fileURL = URL.createObjectURL(file);
    return fileURL;
}
