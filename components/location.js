// components/location.js

// make this componet start getting location when the app starts.
// Now make it so the location is shared in App.js file to everybody who needs it.


import * as Location from 'expo-location';

const LocationComponent = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return null
  }
  const location = await Location.getCurrentPositionAsync({});

  return (
    location
  );
};

export default LocationComponent;
