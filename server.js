const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware pour analyser les données JSON
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Configuration de multer pour gérer les fichiers
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route pour les messages texte
app.post("/api/message", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message manquant" });
  }

  try {
    const apiResponse = await fetch(
      `https://kaiz-apis.gleeze.com/api/gemini-vision?q=${encodeURIComponent(
        message
      )}&uid=1`
    );
    const data = await apiResponse.json();
    res.json({ response: data.response });
  } catch (error) {
    console.error("Erreur lors de la requête API :", error);
    res.status(500).json({ error: "Erreur lors de la requête API" });
  }
});

// Route pour les fichiers images
app.post("/api/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier reçu" });
  }

  const imageBuffer = req.file.buffer;

  try {
    // Téléversement de l'image vers un service d'hébergement
    const uploadResponse = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: new URLSearchParams({
        key: "API_KEY", // Remplacez par votre clé API imgBB
        image: imageBuffer.toString("base64"),
      }),
    });

    const uploadData = await uploadResponse.json();
    const imageUrl = uploadData.data.url;

    // Appel à l'API avec l'URL de l'image
    const apiResponse = await fetch(
      `https://kaiz-apis.gleeze.com/api/gemini-vision?q=Analyse cette image&uid=1&imageUrl=${imageUrl}`
    );
    const data = await apiResponse.json();

    res.json({ response: data.response });
  } catch (error) {
    console.error("Erreur lors de l'analyse de l'image :", error);
    res.status(500).json({ error: "Erreur lors de l'analyse de l'image" });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
