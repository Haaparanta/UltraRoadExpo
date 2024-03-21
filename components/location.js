import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export const useLocationAndAddress = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchLocationAndAddress = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      let result = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (result.length > 0) {
        const { street, name, city, region, postalCode } = result[0];
        const formattedAddress = `${street || name}, ${city}, ${region} ${postalCode}`;
        setAddress(formattedAddress);
      } else {
        setAddress('Address not found');
      }
    };

    fetchLocationAndAddress();

    intervalId = setInterval(() => {
      fetchLocationAndAddress();
    }, 15000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return { location, address, errorMsg };
};
