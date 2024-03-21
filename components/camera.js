import React, { useState, useEffect, useRef } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { Camera } from 'expo-camera';

export default function CameraScreen({ onPictureTaken }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null); 

  useEffect(() => {
    let isMounted = true; 
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (isMounted) setHasPermission(status === 'granted');
    })();
    return () => {
      isMounted = false; 
    };
  }, []);

  const takePicture = async () => {
    console.log("Taking picture...");
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync(); 

      const formData = new FormData();
      formData.append('file', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });

      try {
        const response = await fetch('http://ddns.serverlul.win:8000/annotate', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          body: formData,
        });
  
        const responseData = await response.json();
        console.log("Response data: ", responseData);
        onPictureTaken(photo.uri, responseData.kind, responseData.title, responseData.text);
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    } else {
      console.log("No camera ref");
    }
  };
  
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
      </Camera>
      <View style={styles.buttonContainer}>
        <Button title="Flip Camera" onPress={() => {
          setType(type === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back);
        }} />
        <Button title="Take Picture" onPress={takePicture} />
      </View>
      <Text style={styles.howToText}>How to use: Capture your surroundings and get instant info.</Text>
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
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
    paddingBottom: 10,
  },
});
