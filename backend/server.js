require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/odds', async (req, res) => {
    const sports = ['americanfootball_nfl', 'basketball_nba', 'basketball_ncaab', 'baseball_mlb', 'americanfootball_ncaaf'];
    const apiKey = process.env.API_KEY; // Use the API key from your environment variables
    const regions = 'us';
    const markets = 'h2h,spreads';

    let allRefinedOdds = [];

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
            const games = response.data;
            const refinedOdds = allParlays(games);
            allRefinedOdds = allRefinedOdds.concat(refinedOdds);
        } catch (error) {
            console.error(`Error fetching ${sport}:`, error);
        }
    }

    res.json({ refinedOdds: allRefinedOdds });
});

//sift through all the objects searching for draftkings h2h and spread prices
const allParlays = (games) => {
    // store all of those in an array??
    let refinedGames = []
    games.forEach(game => {
        const dkMarket = game.bookmakers.find(bkm => bkm.key === "draftkings");
        if(dkMarket){
            if(dkMarket){
                dkMarket.markets.forEach(market => {
                    if (market.key === "h2h" || market.key === "spread") {
                        market.outcomes.forEach(outcome => {
                            refinedGames.push({
                                marketType: market.key,
                                team: outcome.name,
                                odds: outcome.price,
                                sport: game.sport_key
                            });
                        })
                    }
                })
            }
        }
    })
    console.log(refinedGames,'refined games')
    return refinedGames
}
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
