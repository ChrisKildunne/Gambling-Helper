import React, { useState, useEffect } from 'react';
import { Keyboard, ScrollView, TouchableWithoutFeedback, Text, View, TextInput, Button, Switch } from 'react-native';
import SuitableBets from './SuitableBets/SuitableBets.js';
import fetchSuitableParlays from './SuitableBets/fetchSuitableBets';

export default function OddsForm({ qualifyingParlays }) {
    const [betAmount, setBetAmount] = useState('');
    const [winAmount, setWinAmount] = useState('');
    const [sportFilter, setSportFilter] = useState([]);
    const [filteredBets, setFilteredBets] = useState([]);
    const sports = [
        { id: 'americanfootball_nfl', name: 'NFL Football' },
        { id: 'americanfootball_ncaaf', name: 'NCAAF Football' },
        { id: 'basketball_nba', name: 'NBA Basketball' },
        { id: 'basketball_ncaab', name: 'NCAAB Basketball' },
        { id: 'baseball_mlb', name: 'MLB Baseball' }
    ];
    const toggleSport = (sport) => {
        if (sportFilter.includes(sport)){
            setSportFilter(sportFilter.filter(s => s !== sport));
        } else {
            setSportFilter([...sportFilter, sport]);
        }
    };
    const handleSubmit = async () => {
        const apiUrl = 'http://10.0.0.12:3001/api/odds'; 
        try {
            const qualifyingParlays = await fetchSuitableParlays(apiUrl, betAmount, winAmount, sportFilter);
            console.log('Received qualifyingParlays:', qualifyingParlays);
    
            // Update the state with the fetched data
            setFilteredBets(qualifyingParlays);
    
            console.log('Filtered bets state:', filteredBets); // Log the state after the update
        } catch (error) {
            console.error('Error fetching bets:', error);
        }
    };
    useEffect(() => {
        console.log('Filtered bets state:', filteredBets);
      }, [filteredBets]);
    
    
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
                                value={sportFilter.includes(sport.id)}
                                onValueChange={() => toggleSport(sport.id)}
                            />
                            <Text>{sport.name}</Text>
                        </View>
                    ))}
                    <Button
                        title="Submit"
                        onPress={handleSubmit}
                    />
                     <View style={{ paddingTop: 70 }}>

        {filteredBets.parlays.map((betGroup, groupIndex) => (
          <View key={groupIndex}>
            <Text style={{ paddingTop: 70 }}>Parlay:</Text>
            {betGroup.map((bet, betIndex) => (
                
              <View key={betIndex}>
                <Text>Market Type: {bet.marketType}</Text>
                <Text>Odds: {bet.odds}</Text>
                <Text>Sport: {bet.sport}</Text>
                <Text>Team: {bet.team}</Text>
                <Text>Combined Odds: {bet.combinedOdds}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
   
             </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
    
}
