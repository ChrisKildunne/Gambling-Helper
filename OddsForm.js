import React, { useState, useEffect } from 'react';
import { Keyboard, ScrollView, TouchableWithoutFeedback, Text, View, TextInput, Button, Switch } from 'react-native';
import SuitableBets from './SuitableBets/SuitableBets.js';
import fetchSuitableBets from './SuitableBets/fetchSuitableBets';

export default function OddsForm() {
    const [betAmount, setBetAmount] = useState('');
    const [winAmount, setWinAmount] = useState('');
    const [sportFilter, setSportFilter] = useState([]);
    const [filteredBets, setFilteredBets] = useState([]);
    const sports = ['Football', 'NCAAF', 'Basketball', 'NCAAB', 'Baseball'];

    const toggleSport = (sport) => {
        if (sportFilter.includes(sport)){
            setSportFilter(sportFilter.filter(s => s !== sport));
        } else {
            setSportFilter([...sportFilter, sport]);
        }
    };
    const handleSubmit = async () => {
        console.log(`Bet Amount: ${betAmount}, Win Amount: ${winAmount}, Sports: ${sportFilter}`);
        const apiUrl = 'http://10.0.0.12:3001/api/odds';
        const bets = await fetchSuitableBets(apiUrl, betAmount, winAmount);
        setFilteredBets(bets);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView>
                <View style={{ paddingTop: 70 }}>
                    <Text>Enter the bet amount you would like to place</Text>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                        keyboardType="numeric"
                        value={betAmount}
                        onChangeText={text => setBetAmount(text)}
                    />
                    <Text>And the amount you would like to win</Text>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                        keyboardType="numeric"
                        value={winAmount}
                        onChangeText={text => setWinAmount(text)}
                    />
                    <Text>Select the sports you would like to bet on</Text>
                    {sports.map((sport, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                            <Switch
                                value={sportFilter.includes(sport)}
                                onValueChange={() => toggleSport(sport)}
                            />
                            <Text>{sport}</Text>
                        </View>
                    ))}
                    <Button
                        title="Submit"
                        onPress={handleSubmit}
                    />
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
            </ScrollView>
        </TouchableWithoutFeedback>
    );
    
}
