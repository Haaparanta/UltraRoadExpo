// components/camera.js

import React, { useState, useEffect, useRef } from 'react';
import { View, Button, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function CameraScreen({ onPictureTaken }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(cameraStatus.status === 'granted' && galleryStatus.status === 'granted');
    })();
  }, []);

  const showErrorMessage = (message) => {
    Alert.alert("Error", message);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      setIsLoading(true);
      let photo;
      try {
        photo = await cameraRef.current.takePictureAsync();
      } catch (error) {
        setIsLoading(false);
        showErrorMessage("Failed to take picture. Please try again.");
        return;
      }

      const formData = new FormData();
      formData.append('file', { uri: photo.uri, type: 'image/jpeg', name: 'upload.jpg' });

      try {
        const response = await fetch('http://ddns.serverlul.win:8000/annotate', {
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data' },
          body: formData,
        });
  
        const responseData = await response.json();
        onPictureTaken(photo.uri, responseData.kind, responseData.title, responseData.text);
      } catch (error) {
        showErrorMessage("Error uploading image. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      showErrorMessage("Camera not ready. Please try again.");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.cancelled) {
      setIsLoading(true);
      let uri = result.uri;
      let type = 'image/jpeg'; 
      let name = 'upload.jpg'; 
  
      if (result.type && result.type !== 'image/jpeg') {
        const manipulatedResult = await ImageManipulator.manipulateAsync(
          result.uri,
          [], 
          { format: ImageManipulator.SaveFormat.JPEG }
        );
        uri = manipulatedResult.uri; 
      }
  
      const formData = new FormData();
      formData.append('file', { uri, type, name });
  
      try {
        const response = await fetch('http://ddns.serverlul.win:8000/annotate', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const responseData = await response.json();
        onPictureTaken(uri, responseData.kind, responseData.title, responseData.text);
      } catch (error) {
        showErrorMessage("Error uploading image. Please try again. " + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };
  

  if (!hasPermission) {
    return <View style={styles.container}><Text>No access to camera or gallery.</Text></View>;
  }

  if (isLoading) {
    return <View style={[styles.container, styles.horizontal]}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef} />
      <View style={styles.buttonContainer}>
        <Button title="Käännä kamera" onPress={() => setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)} />
        <Button title="Ota kamera" onPress={takePicture} />
      </View>
      <Text style={styles.howToText}>Ota selkeä valokuva läheltä</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 6, 
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  camera: {
    flex: 7, 
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  howToText: {
    flex: 1,
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    paddingBottom: 10,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
