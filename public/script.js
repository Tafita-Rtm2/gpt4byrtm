async function sendMessage() {
  const userInput = document.getElementById("user-input");
  const message = userInput.value.trim();

  if (message === "") return;

  displayMessage(message, "user");
  userInput.value = "";

  // Afficher l'indicateur "Le bot est en train d'écrire..."
  const typingIndicator = displayMessage("Le bot est en train d'écrire...", "bot");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();

    // Supprimer l'indicateur et afficher la réponse du bot
    typingIndicator.remove();
    displayMessage(data.response, "bot");
  } catch (error) {
    typingIndicator.remove();
    displayMessage("Impossible de se connecter au serveur.", "bot");
  }
}

function displayMessage(message, sender) {
  const chatContainer = document.getElementById("chat-container");
  const messageElement = document.createElement("div");
  messageElement.className = `message ${sender}`;
  messageElement.textContent = message;

  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  return messageElement; // Retourner l'élément pour pouvoir le supprimer si nécessaire
}
