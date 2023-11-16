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
//sift through all the objects searching for draftkings h2h and spread prices
const allParlays = (games) => {
    // store all of those in an array??
    let parlays = []
    games.forEach(game => {
        const dkMarket = game.bookmakers.find(bkm => bkm.key === "draftkings");
        if(dkMarket){
            if(dkMarket){
                dkMarket.markets.forEach(market => {
                    if (market.key === "h2h" || market.key === "spread") {
                        market.outcomes.forEach(outcome => {
                            parlays.push({
                                marketType: market.key,
                                team: outcome.name,
                                odds: outcome.price
                            });
                        })
                    }
                })
            }
        }
    })
}
//iterate through odds divide by 100
//some function that multiplies every possible parlay for now up to three legs store in object?
//send json 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
