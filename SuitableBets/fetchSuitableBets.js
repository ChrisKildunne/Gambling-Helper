const fetchSuitableBets = async (apiUrl, betAmount, winAmount) => {
    const calculateOdds = () => {
        if (!betAmount || !winAmount) return null;
        return parseFloat(winAmount) / parseFloat(betAmount);
    };

    try {
        const res = await fetch(apiUrl);
        const games = await res.json();
        const desiredOdds = calculateOdds();

        if (desiredOdds) {
            return games.reduce((acc, game) => {
                const draftKingsBookmaker = game.bookmakers.find(bookmaker => bookmaker.key === 'draftkings');
                if (draftKingsBookmaker) {
                    const h2hMarket = draftKingsBookmaker.markets.find(market => market.key === 'h2h');
                    if (h2hMarket) {
                        const meetsOdds = h2hMarket.outcomes.some(outcome => outcome.price/100 >= desiredOdds);
                        console.log(desiredOdds)
                        if (meetsOdds) {
                            acc.push(game);
                        }
                    }
                }
                return acc;
            }, []);
        }
        return []; 
    } catch (err) {
        console.error(err);
        return []; 
    }
};

export default fetchSuitableBets;
