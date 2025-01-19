const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const imageInput = document.getElementById("image-input");

// Fonction pour ajouter un message dans le chat
function addMessage(author, content, isImage = false) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");

  const avatar = document.createElement("img");
  avatar.src = author === "bot" ? "robot.jpg" : "user.jpg";

  const text = document.createElement("div");
  if (isImage) {
    const img = document.createElement("img");
    img.src = content;
    img.style.maxWidth = "100%";
    text.appendChild(img);
  } else {
    text.textContent = content;
  }

  messageDiv.appendChild(avatar);
  messageDiv.appendChild(text);
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroller vers le bas
}

// Gérer l'envoi d'un message texte
sendButton.addEventListener("click", async () => {
  const message = messageInput.value.trim();
  if (message) {
    addMessage("user", message); // Afficher le message utilisateur
    messageInput.value = ""; // Vider le champ de saisie

    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      addMessage("bot", data.response); // Afficher la réponse du bot
    } catch (error) {
      addMessage("bot", "Erreur : Impossible de se connecter au serveur.");
    }
  }
});

// Gérer l'envoi d'une image
imageInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      // Afficher l'image envoyée par l'utilisateur
      addMessage("user", URL.createObjectURL(file), true);

      // Afficher la réponse du bot
      addMessage("bot", data.response);
    } catch (error) {
      addMessage("bot", "Erreur : Impossible de traiter l'image.");
    }
  }
});
