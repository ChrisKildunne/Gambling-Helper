require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/odds', async (req, res) => {
    const sports = ['americanfootball_nfl', 'basketball_nba', 'basketball_ncaab', 'baseball_mlb', 'americanfootball_ncaaf'];
    const apiKey = '4db19d98cfdb95baf960ebdc176218b0'; 
    const regions = 'us';
    const markets = 'h2h,spreads';
    let allOdds = [];

    for (const sport of sports){
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
            allOdds.push({ sport: sport, odds: response.data})
        } catch (error) {
            console.error(`Error fetching ${sport}:`, error);
            res.status(500).json({ message: error.message });
        }
    }
    res.json(allOdds);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
