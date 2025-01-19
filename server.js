const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = 3000;

// Configuration de multer pour les images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Middleware pour servir les fichiers statiques
app.use(express.static("public"));
app.use(express.json());

// Route pour les messages texte
app.post("/api/message", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(`https://kaiz-apis.gleeze.com/api/gemini-vision?q=${encodeURIComponent(message)}&uid=1`);
    const data = await response.json();
    res.json({ author: "bot", response: data.response });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la communication avec l'API." });
  }
});

// Route pour les images
app.post("/api/upload", upload.single("image"), async (req, res) => {
  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

  // Exemple de prompt après réception de l'image
  const prompt = "Analyser et répondre aux questions sur cette image";

  try {
    const response = await fetch(
      `https://kaiz-apis.gleeze.com/api/gemini-vision?q=${encodeURIComponent(prompt)}&uid=1&imageUrl=${encodeURIComponent(imageUrl)}`
    );
    const data = await response.json();
    res.json({ author: "bot", response: data.response, imageUrl });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la communication avec l'API." });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
