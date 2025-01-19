const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const apiResponse = await fetch(`https://kaiz-apis.gleeze.com/api/gpt-4o?q=${encodeURIComponent(message)}&uid=1`);
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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
