const fetchSuitableBets = async (apiUrl, betAmount, winAmount) => {
    const calculateOdds = () => {
        if (!betAmount || !winAmount) return null;
        return parseFloat(winAmount) / parseFloat(betAmount);
    };

    try {
        const res = await fetch(apiUrl);
        const sports = await res.json();
        const desiredOdds = calculateOdds();

        if (desiredOdds) {
            return sports.flatMap(sport => 
                sport.odds.reduce((acc, game) => {
                    if (Array.isArray(game.bookmakers)) {
                        const draftKingsBookmaker = game.bookmakers.find(bookmaker => bookmaker.key === 'draftkings');
                        if (draftKingsBookmaker && Array.isArray(draftKingsBookmaker.markets)) {
                            const h2hMarket = draftKingsBookmaker.markets.find(market => market.key === 'h2h');
                            if (h2hMarket && Array.isArray(h2hMarket.outcomes)) {
                                const meetsOdds = h2hMarket.outcomes.some(outcome => {
                                    const decimalOdds = outcome.price / 100;
                                    console.log(decimalOdds)
                                    return decimalOdds >= desiredOdds;
                                });

                                if (meetsOdds) {
                                    acc.push(game);
                                }
                            }
                        }
                    } else {
                        console.log('No bookmakers array found for game:', game);
                    }
                    return acc;
                }, [])
            );
        }
        return [];
    } catch (err) {
        console.error(err);
        return [];
    }
};

export default fetchSuitableBets;
