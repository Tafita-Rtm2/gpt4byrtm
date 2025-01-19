const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch'); // Importer fetch

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Servir les fichiers statiques

// API pour gérer les messages du chatbot
app.post('/api/message', async (req, res) => {
    const { message, imageUrl } = req.body;

    let url = '';
    if (imageUrl) {
        url = `https://kaiz-apis.gleeze.com/api/gemini-vision?q=&uid=1&imageUrl=${encodeURIComponent(imageUrl)}`;
    } else {
        url = `https://kaiz-apis.gleeze.com/api/gemini-vision?q=${encodeURIComponent(message)}&uid=1`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json({ response: data.response || 'Pas de réponse.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ response: 'Erreur avec l\'API externe.' });
    }
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
