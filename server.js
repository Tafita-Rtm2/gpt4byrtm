const express = require("express");
const path = require("path");
const fetch = require("node-fetch"); // Pour effectuer des requêtes HTTP

const app = express();
const PORT = 8080;

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

// Route pour le chatbot (appel à l'API externe)
app.get("/api/chat", async (req, res) => {
  const userMessage = req.query.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message utilisateur manquant." });
  }

  try {
    // Appel à l'API externe
    const apiResponse = await fetch(
      `https://yt-video-production.up.railway.app/gpt4-omni?ask=${encodeURIComponent(
        userMessage
      )}&userid=1`
    );
    const data = await apiResponse.json();

    if (data.status === "true") {
      res.json({ response: data.response });
    } else {
      res.status(500).json({ error: "Erreur de l'API externe." });
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API :", error);
    res.status(500).json({ error: "Impossible de se connecter à l'API." });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
