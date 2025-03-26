const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Route pour interroger l'API
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message requis" });

  try {
    const apiUrl = "https://yt-video-production.up.railway.app/gpt4-omni";
    const response = await axios.get(apiUrl, {
      params: { ask: message, userid: "12" },
    });

    let apiResponse = response.data.response || "Aucune réponse reçue.";
    apiResponse = apiResponse.replace(/\n\n/g, "<br><br>"); // Gestion des retours à la ligne

    res.json({ response: apiResponse });
  } catch (error) {
    res.status(500).json({ error: "Erreur API", details: error.message });
  }
});

app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
