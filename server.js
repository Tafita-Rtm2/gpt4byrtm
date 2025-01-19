const express = require("express");
const multer = require("multer");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const port = 3000;

// Middleware pour servir les fichiers statiques
app.use(express.static("public"));
app.use(express.json());

// Route pour gérer les messages texte
app.post("/api/message", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(
      `https://kaiz-apis.gleeze.com/api/gemini-vision?q=${encodeURIComponent(
        message
      )}&uid=1`
    );
    const data = await response.json();
    res.json({ response: data.response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'appel à l'API." });
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
