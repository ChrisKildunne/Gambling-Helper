require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());


app.get('/api/odds', async (req, res) => {
    const sportFilter = req.query.sportFilter ? req.query.sportFilter.split(',') : [];
    const sports = sportFilter.length > 0 ? sportFilter : ['americanfootball_nfl', 'basketball_nba', 'basketball_ncaab', 'baseball_mlb', 'americanfootball_ncaaf'];
    const apiKey = process.env.ODDS_API_KEY; 
    const regions = 'us';
    const markets = 'h2h,spreads';

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIdx = (page - 1) * limit;
    const endIdx = page * limit

    try {
        const fetchPromises = sports.map(sport => {
            const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/`;
            const params = {
                apiKey,
                regions,
                markets,
                oddsFormat: 'american'
            };

            return axios.get(url, { params })
                .then(response => response.data)
                .catch(error => {
                    console.error(`Error fetching ${sport}:`, error);
                    return []; 
                });
        });

        const allSportsData = await Promise.all(fetchPromises);
        const allRefinedOdds = allSportsData.flat().flatMap(game => refineGameData(game));

        const desiredOdds = parseFloat(req.query.desiredOdds);
        if (isNaN(desiredOdds)) {
            return res.status(400).send('Invalid desired odds');
        }

        let qualifyingParlays = generateParlays(allRefinedOdds).filter(parlay => {
            const combinedOdds = parlay.reduce((acc, bet) => acc * convertToDecimal(bet.odds), 1);
            return combinedOdds >= desiredOdds;
        });
        const paginatedParlays = qualifyingParlays.slice(startIdx, endIdx)
        qualifyingParlays = qualifyingParlays.slice(0, 10);
        console.log(qualifyingParlays)
        res.json({ parlays: paginatedParlays, page, limit});
    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).send('Internal Server Error');
    }
});

const refineGameData = (game) => {
    let refinedGames = [];
    const dkMarket = game.bookmakers.find(bkm => bkm.key === "draftkings");
    if (dkMarket) {
        dkMarket.markets.forEach(market => {
            if (market.key === "h2h" || market.key === "spread") {
                market.outcomes.forEach(outcome => {
                    refinedGames.push({
                        marketType: market.key,
                        team: outcome.name,
                        odds: outcome.price,
                        sport: game.sport_key
                    });
                });
            }
        });
    }
    return refinedGames;
};

const convertToDecimal = americanOdds => americanOdds > 0 ? (americanOdds / 100) + 1 : (100 / Math.abs(americanOdds)) + 1;

const generateParlays = (refinedOdds) => {
    const parlays = [];

    for (let i = 0; i < refinedOdds.length; i++) {
        for (let j = i + 1; j < refinedOdds.length; j++) {
            for (let k = j + 1; k < refinedOdds.length; k++) {
                const parlay = [refinedOdds[i], refinedOdds[j], refinedOdds[k]];
                const combinedDecimalOdds = parlay.reduce((acc, bet) => acc * convertToDecimal(bet.odds), 1);
                parlays.push(parlay.map(bet => ({
                    marketType: bet.marketType,
                    odds: bet.odds,
                    sport: bet.sport,
                    team: bet.team,
                    combinedOdds: combinedDecimalOdds
                })));
            }
        }
    }

    return parlays;
};

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
