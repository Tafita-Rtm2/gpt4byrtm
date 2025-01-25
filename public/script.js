const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const typingIndicator = document.getElementById("typing-indicator");

function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";

  typingIndicator.style.display = "flex";

  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  })
    .then((response) => response.json())
    .then((data) => {
      typingIndicator.style.display = "none";
      appendMessage("bot", data.botMessage);
    })
    .catch(() => {
      typingIndicator.style.display = "none";
      appendMessage("bot", "Erreur de connexion au serveur.");
    });
}

function appendMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);

  const img = document.createElement("img");
  img.src = sender === "user" ? "user.jpg" : "chat.jpg";

  const textDiv = document.createElement("div");
  textDiv.classList.add("text");
  textDiv.textContent = text;

  messageDiv.appendChild(img);
  messageDiv.appendChild(textDiv);
  chatMessages.appendChild(messageDiv);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}
