document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const voiceBtn = document.getElementById("voice-btn");

    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    voiceBtn.addEventListener("click", startVoiceRecognition);

    function appendMessage(text, isUser) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", isUser ? "user" : "bot");
        msgDiv.innerHTML = text;

        // Ajouter un bouton haut-parleur pour lire le message
        if (!isUser) {
            const speakerBtn = document.createElement("button");
            speakerBtn.innerHTML = "🔊";
            speakerBtn.classList.add("speaker-btn");
            speakerBtn.onclick = () => speakText(text);
            msgDiv.appendChild(speakerBtn);
        }

        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        appendMessage(message, true);
        userInput.value = "";

        fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        })
        .then((res) => res.json())
        .then((data) => {
            appendMessage(data.response, false);
        })
        .catch(() => appendMessage("❌ Erreur de connexion.", false));
    }

    function startVoiceRecognition() {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "fr-FR";

        recognition.onresult = (event) => {
            userInput.value = event.results[0][0].transcript;
            sendMessage();
        };

        recognition.start();
    }

    function speakText(text) {
        const speech = new SpeechSynthesisUtterance();
        speech.text = text.replace(/<br>/g, "\n"); // Remettre les sauts de ligne
        speech.lang = "fr-FR";
        speechSynthesis.speak(speech);
    }
});
