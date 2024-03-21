import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }

  const takePicture = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync();
      const latitude = 0;
      const longitude = 0; 
      const text = "Example Text"; 
  
      const formData = new FormData();
      formData.append('file', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
  
      try {
        const response = await fetch('http://192.168.236.175:8000/annotate', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Longitude': longitude, 
            'X-Latitude': latitude,
            'X-Text': text,
          },
          body: formData,
        });
  
        const responseData = await response.json();
        console.log(responseData);
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={ref => setCameraRef(ref)}>
        <View style={styles.buttonContainer}>
          <Button title="Flip Camera" onPress={() => {
            setType(type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back);
          }} />
          <Button title="Take Picture" onPress={takePicture} />
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

