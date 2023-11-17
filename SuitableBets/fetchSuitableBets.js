import OddsForm from '../OddsForm';

const fetchSuitableParlays = async (apiUrl, betAmount, winAmount, sportFilter) => {
    const calculateOdds = () => {
        if (!betAmount || !winAmount) return null;
        return parseFloat(winAmount) / parseFloat(betAmount);
    };

    try {
        const desiredOdds = calculateOdds();
        if (!desiredOdds) throw new Error('Invalid odds calculation');

        const url = new URL(apiUrl);
        url.searchParams.append('desiredOdds', desiredOdds);
        url.searchParams.append('sportFilter', sportFilter.join(',')); 

        const res = await fetch(url);
        const qualifyingParlays = await res.json();

        return qualifyingParlays
    } catch (err) {
        console.error(err);
    }
};

export default fetchSuitableParlays;


//     return sports
//         .filter(sport => sportFilter.includes(sport.sport)) // Filter by selected sports
//         .flatMap(sport => 
//             sport.odds.reduce((acc, game) => {
//                 if (Array.isArray(game.bookmakers)) {
//                     const draftKingsBookmaker = game.bookmakers.find(bookmaker => bookmaker.key === 'draftkings');
//                     if (draftKingsBookmaker && Array.isArray(draftKingsBookmaker.markets)) {
//                         const h2hMarket = draftKingsBookmaker.markets.find(market => market.key === 'h2h');
//                         if (h2hMarket && Array.isArray(h2hMarket.outcomes)) {
//                             const meetsOdds = h2hMarket.outcomes.some(outcome => {
//                                 const decimalOdds = outcome.price / 100;
//                                 return decimalOdds >= desiredOdds;
//                             });

//                             if (meetsOdds) {
//                                 acc.push(game);
//                             }
//                         }
//                     }
//                 } else {
//                     console.log('hello')
//                 }
//                 return acc;
//             }, [])
//         );
// }
// return [];