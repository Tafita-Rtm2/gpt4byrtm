const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

// Servir les fichiers statiques
app.use(express.static("public"));

// Route pour gérer la requête à l'API
app.get("/ask", async (req, res) => {
    const userMessage = req.query.message;
    if (!userMessage) return res.json({ response: "❌ Message vide." });

    try {
        const apiUrl = `https://yt-video-production.up.railway.app/gpt4-omni?ask=${encodeURIComponent(userMessage)}&userid=12`;
        const response = await axios.get(apiUrl);
        res.json({ response: response.data.response });
    } catch (error) {
        res.json({ response: "❌ Erreur de connexion à l'API." });
    }
});

// Lancer le serveur
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
