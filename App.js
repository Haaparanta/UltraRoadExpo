import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import CameraScreen from './components/camera';

// 360 x 240 images

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Ultra Roads</Text>
      <CameraScreen/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: true,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
