document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");
    const voiceButton = document.getElementById("voice-button");

    // Charger les messages stockés
    loadChatHistory();

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });

    voiceButton.addEventListener("click", startVoiceRecognition);

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;

        addMessage("user", message);
        userInput.value = ""; // Vider la zone de texte

        fetch(`/ask?message=${encodeURIComponent(message)}`)
            .then(response => response.json())
            .then(data => {
                addMessage("bot", data.response);
                saveChatHistory();
            })
            .catch(() => addMessage("bot", "❌ Erreur. Réessayez plus tard."));
    }

    function addMessage(sender, text) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender);

        const img = document.createElement("img");
        img.src = sender === "user" ? "user.jpg" : "robot.jpg";

        const messageText = document.createElement("span");
        messageText.innerHTML = text.replace(/\n/g, "<br>"); // Gérer les sauts de ligne

        const speakerButton = document.createElement("button");
        speakerButton.innerHTML = "🔊";
        speakerButton.classList.add("speaker-btn");
        speakerButton.onclick = () => speakText(text);

        messageElement.appendChild(img);
        messageElement.appendChild(messageText);
        messageElement.appendChild(speakerButton);
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;

        saveChatHistory();
    }

    function startVoiceRecognition() {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "fr-FR";
        recognition.start();

        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            sendMessage();
        };
    }

    function speakText(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "fr-FR";
        speechSynthesis.speak(utterance);
    }

    function saveChatHistory() {
        localStorage.setItem("chatHistory", chatBox.innerHTML);
    }

    function loadChatHistory() {
        const savedChat = localStorage.getItem("chatHistory");
        if (savedChat) chatBox.innerHTML = savedChat;
    }
});
