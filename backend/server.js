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
            allOdds.push({ sport: sport, odds: response.data})
        } catch (error) {
            console.error(`Error fetching ${sport}:`, error);
            res.status(500).json({ message: error.message });
        }
    }
    res.json(allOdds);
});
app.post('/api/parlays', async (req, res) => {
    const games = req.body.games;
    try {
        const parlays = allParlays(games);
        res.json(parlays);
    } catch (error) {
        console.error('Error generating parlays:', error);
        res.status(500).send('Error generating parlays');
    }
});
function allParlays(games){
    let parlays = []
    for (let i = 2; i <= games.length; i++){
        const combos = generateCombos(games, i)
        for (const combo of combinations) {
            const combinedOdds = calculateParlayOdds(combo);
            parlays.push({ games: combo, combinedOdds });
        }
    }
    return parlays
}
function calculateParlayOdds(parlay) {
    return parlay.reduce((acc, game) => {
        const draftKingsMarket = game.bookmakers.find(bkm => bkm.key === 'draftkings').markets.find(mkt => mkt.key === 'h2h');
        const bestOdds = draftKingsMarket.outcomes.reduce((max, outcome) => Math.max(max, outcome.price), 0);
        return acc * convertToDecimalOdds(bestOdds);
    }, 1);
}
function convertToDecimalOdds(americanOdds) {
    if (americanOdds >= 100) {
        return americanOdds / 100 + 1;
    } else {
        return 100 / Math.abs(americanOdds) + 1;
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
