import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import OddsForm from './OddsForm'
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={{ paddingTop: 150 }}>Welcome to Gambling Helper, choose your filters, your desired bet and desired win total</Text>
      <OddsForm />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
