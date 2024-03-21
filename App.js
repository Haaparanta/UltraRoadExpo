import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, Text } from 'react-native';
import CameraScreen from './components/camera';
import FeedbackComponent from './components/feedback';
import { useLocation } from './components/location';

const Stack = createNativeStackNavigator();

export default function App() {
  const { location, errorMsg } = useLocation();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Camera">
        <Stack.Screen name="Camera">
          {props => <CameraScreen {...props} location={location} />}
        </Stack.Screen>
        <Stack.Screen name="FeedbackComponent" component={FeedbackComponent} />
      </Stack.Navigator>
      {errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
    paddingBottom: 10,
  },
  errorMsg: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
