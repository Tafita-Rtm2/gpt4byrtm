const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const imageInput = document.getElementById("image-input");

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
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

sendButton.addEventListener("click", async () => {
  const message = messageInput.value.trim();
  if (message) {
    addMessage("user", message);
    messageInput.value = "";

    const response = await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    addMessage("bot", data.response);
  }
});

imageInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    addMessage("user", URL.createObjectURL(file), true);
    addMessage("bot", data.response);
  }
});
