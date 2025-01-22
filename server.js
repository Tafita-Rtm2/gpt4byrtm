const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const API_KEY_IMGBB = "6fef3d0d57641305c16bd5c0b5e27426"; // Remplacez par votre clé API Imgbb

// Route pour les messages texte
app.post('/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message vide." });

    try {
        const response = await fetch(
            `https://yt-video-production.up.railway.app/gpt4-omni?ask=${encodeURIComponent(message)}&userid=1`
        );
        const data = await response.json();
        res.json({ response: data.response || "Je ne peux pas répondre pour le moment." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur avec l'API texte." });
    }
});

// Route pour les images
app.post('/upload-image', async (req, res) => {
    const { image, prompt } = req.body;

    if (!image) return res.status(400).json({ error: "Aucune image fournie." });

    try {
        // Télécharger l'image sur Imgbb
        const imgbbResponse = await fetch(
            `https://api.imgbb.com/1/upload?key=${API_KEY_IMGBB}`,
            {
                method: "POST",
                body: new URLSearchParams({ image }),
            }
        );
        const imgbbData = await imgbbResponse.json();

        if (!imgbbData.success) throw new Error("Erreur lors du téléchargement de l'image.");

        const imageUrl = imgbbData.data.url;

        // Envoyer l'image + prompt à l'API
        const finalPrompt = prompt ? `${prompt} Image: ${imageUrl}` : `Image: ${imageUrl}`;
        const response = await fetch(
            `https://sandipbaruwal.onrender.com/gemini2?url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(prompt || '')}`
        );
        const data = await response.json();
        res.json({ response: data.response || "Je ne peux pas traiter l'image pour le moment." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur avec l'API image." });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
