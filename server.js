const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint pour le chatbot
app.post('/chat', async (req, res) => {
    const { message, image } = req.body;

    try {
        if (image) {
            // Téléchargement de l'image sur imgbb
            const formData = new FormData();
            formData.append('image', image);
            formData.append('key', '6fef3d0d57641305c16bd5c0b5e27426'); // Remplacez par votre clé API imgbb

            const imgbbResponse = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData,
            });

            const imgbbData = await imgbbResponse.json();
            if (!imgbbData.success) {
                throw new Error('Erreur lors du téléchargement de l\'image.');
            }

            const imageUrl = imgbbData.data.url;

            // Envoi à l'API image
            const apiResponse = await fetch(
                `https://sandipbaruwal.onrender.com/gemini2?url=${encodeURIComponent(imageUrl)}&prompt=${encodeURIComponent(message)}`
            );
            const data = await apiResponse.json();

            return res.json({ author: 'bot', response: data.response });
        } else {
            // Envoi à l'API texte
            const apiResponse = await fetch(
                `https://yt-video-production.up.railway.app/gpt4-omni?ask=${encodeURIComponent(message)}&userid=1`
            );
            const data = await apiResponse.json();

            return res.json({ author: 'bot', response: data.response });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la communication avec l\'API.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
