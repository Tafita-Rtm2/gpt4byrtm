document.getElementById("send-btn").addEventListener("click", sendMessage);

async function sendMessage() {
  const userInput = document.getElementById("user-input");
  const message = userInput.value.trim();

  if (message === "") return;

  // Afficher le message utilisateur
  displayMessage(message, "user");

  // Réinitialiser l'entrée utilisateur
  userInput.value = "";

  // Appel à l'API
  try {
    const response = await fetch(
      `https://yt-video-production.up.railway.app/gpt4-omni?ask=${encodeURIComponent(
        message
      )}&userid=1`
    );
    const data = await response.json();

    if (data.status === "true") {
      displayMessage(data.response, "bot");
    } else {
      displayMessage("Une erreur est survenue.", "bot");
    }
  } catch (error) {
    displayMessage("Impossible de se connecter au serveur.", "bot");
  }
}

function displayMessage(message, sender) {
  const chatBody = document.getElementById("chat-body");

  // Créer un conteneur pour le message
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);

  // Ajouter l'avatar
  const avatar = document.createElement("img");
  avatar.src = sender === "user" ? "user.jpg" : "chat.jpg";
  messageDiv.appendChild(avatar);

  // Ajouter le contenu du message
  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  messageContent.textContent = message;
  messageDiv.appendChild(messageContent);

  // Ajouter au corps de la conversation
  chatBody.appendChild(messageDiv);

  // Faire défiler jusqu'au bas
  chatBody.scrollTop = chatBody.scrollHeight;
}
