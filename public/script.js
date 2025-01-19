const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

// Ajouter un message au chat
function addMessage(message, isBot = false) {
  const messageDiv = document.createElement("div");
  messageDiv.className = isBot ? "bot-message" : "user-message";

  const avatar = document.createElement("img");
  avatar.src = isBot ? "robot.jpg" : "user.jpg";
  avatar.className = "avatar";

  const messageText = document.createElement("div");
  messageText.className = "message-text";
  messageText.textContent = message;

  messageDiv.appendChild(isBot ? avatar : messageText);
  messageDiv.appendChild(isBot ? messageText : avatar);

  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Gérer les messages texte
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  addMessage(userMessage);

  const response = await fetch("/api/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage }),
  });
  const data = await response.json();

  addMessage(data.response, true);

  chatInput.value = "";
});
