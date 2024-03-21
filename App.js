// App.js

// Idea of this app is first show the camera screen to the user. 
// Then user will take a picture of the issue.
// Then we will send this picture to the server. 
// Then server will analyze the picture and send the result back to the user. 
// Then user will see the result. If user wants to give feedback, then user can give feedback. 
// Then we will send this feedback to the server. Then server will save this feedback to the database.

import { StyleSheet, Text, View } from 'react-native';
import CameraScreen from './components/camera';
import FeedbackComponent from './components/feedback';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Ultra Roads</Text>
      </View>
      <CameraScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
    paddingBottom: 10,
  },
  header: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
  },
});
