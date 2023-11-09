require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/odds', async (req, res) => {
    try {
        const response = await axios.get('https://api.the-odds-api.com/v4/sports/?apiKey=process.env.ODDS_API_KEY', {
            params: {
                apiKey: process.env.ODDS_API_KEY,
                sport: 'soccer_epl', // Example: English Premier League soccer
                region: 'uk', // Example region
                mkt: 'h2h', // Example market type
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
