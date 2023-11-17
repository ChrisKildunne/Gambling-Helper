import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

export default function SuitableBets({ filteredBets }){

    return (
        <View>
            {filteredBets.length > 0 && (
                <View>
                    <Text>Available Bets:</Text>
                    {filteredBets.map((game, index) => (
                        <View key={index}>
                            <Text>{game.home_team} vs {game.away_team}</Text>
                            {game.bookmakers
                                .filter(bookmaker => bookmaker.key === 'draftkings')
                                .flatMap(bookmaker => bookmaker.markets)
                                .map((market, idx) => (
                                    <View key={idx}>
                                        <Text>Market: {market.key}</Text>
                                        {market.outcomes.map((outcome, oIdx) => (
                                            <Text key={oIdx}>{outcome.name} - Price: {outcome.price}</Text>
                                        ))}
                                    </View>
                                ))
                            }
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};