const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // Assurez-vous d'installer cette bibliothèque
const session = require("express-session");

const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Route : Page principale
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route : Gestion des messages
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!req.session.conversation) {
    req.session.conversation = []; // Initialise la mémoire de la conversation
  }

  // Ajoutez le message de l'utilisateur à la conversation
  req.session.conversation.push({ sender: "user", message });

  try {
    // Préparez le contexte (concaténation des messages précédents)
    const context = req.session.conversation
      .map((msg) => `${msg.sender === "user" ? "User:" : "Bot:"} ${msg.message}`)
      .join("\n");

    // Appelez l'API avec le contexte
    const apiResponse = await fetch(
      `https://yt-video-production.up.railway.app/gpt4-omni?ask=${encodeURIComponent(
        context
      )}&userid=1`
    );
    const data = await apiResponse.json();

    const botMessage = data.response || "Je ne peux pas répondre maintenant.";

    // Ajoutez la réponse du bot à la conversation
    req.session.conversation.push({ sender: "bot", message: botMessage });

    res.json({ response: botMessage });
  } catch (error) {
    console.error("Erreur API :", error);
    res.status(500).send("Erreur lors de la connexion au serveur.");
  }
});
 
// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
