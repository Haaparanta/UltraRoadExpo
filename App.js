import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import CameraScreen from './components/camera';
import LocationComponent from './components/location';


// http://192.168.236.175:8000


export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Ultra Roads</Text>
      <CameraScreen />
      <LocationComponent />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 50,
    paddingBottom: 20, 
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
});

