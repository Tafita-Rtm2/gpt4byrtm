const express = require("express");
const path = require("path");

const app = express();
const PORT = 8080;

// Servir les fichiers statiques dans le dossier "public"
app.use(express.static(path.join(__dirname, "public")));

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
