const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
    const { message, imageUrl } = req.body;

    try {
        let response;

        if (imageUrl) {
            // Si une image et un message sont envoyés, appeler l'API image
            const apiResponse = await fetch(`https://sandipbaruwal.onrender.com/gemini2?url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(message || '')}`);
            response = await apiResponse.json();
        } else {
            // Si seulement un message texte, appeler l'API texte
            const apiResponse = await fetch(`https://yt-video-production.up.railway.app/gpt4-omni?ask=${encodeURIComponent(message)}&userid=1`);
            response = await apiResponse.json();
        }

        if (response && response.response) {
            res.json({ author: "bot", response: response.response });
        } else {
            res.status(500).json({ error: "Erreur lors de la réponse de l'API." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la communication avec l'API." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
