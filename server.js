const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint pour le traitement des messages texte
app.post('/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const apiResponse = await fetch(`https://yt-video-production.up.railway.app/gpt4-omni?ask=${encodeURIComponent(message)}&userid=1`);
        const data = await apiResponse.json();

        if (data.response) {
            res.json({ author: "bot", response: data.response });
        } else {
            res.status(500).json({ error: "Erreur lors de la réponse de l'API." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la communication avec l'API." });
    }
});

// Endpoint pour l'upload d'image avec prompt
app.post('/upload-image', async (req, res) => {
    const { imageUrl, prompt } = req.body;

    try {
        const apiResponse = await fetch(`https://sandipbaruwal.onrender.com/gemini2?url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(prompt)}`);
        const data = await apiResponse.json();

        if (data) {
            res.json({ imageResponse: data });
        } else {
            res.status(500).json({ error: "Erreur lors du traitement de l'image." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la communication avec l'API d'image." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
