require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/odds', async (req, res) => {
    const sport = 'americanfootball_nfl'; 
    const apiKey = 'ec9e28f0879758ec93d0b2bb04080e36'; 
    const regions = 'us';
    const markets = 'h2h,spreads';

    const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/`;
    const params = {
        apiKey: apiKey,
        regions: regions,
        markets: markets,
        oddsFormat: 'american'
    };

    try {
        const response = await axios.get(url, { params });
        console.log('API Response:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
