const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// API URL
const API_URL = "https://yt-video-production.up.railway.app/gpt4-omni";

// Route principale
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Gestion des messages
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch(`${API_URL}?ask=${encodeURIComponent(userMessage)}&userid=1`);
    const data = await response.json();

    const botMessage = data.response || "Je n'ai pas compris.";

    res.json({ botMessage });
  } catch (error) {
    console.error("Erreur de l'API :", error);
    res.status(500).json({ botMessage: "Erreur de connexion au serveur." });
  }
});

// Serveur en écoute
app.listen(PORT, () => console.log(`Serveur démarré : http://localhost:${PORT}`));
