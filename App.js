import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import CameraScreen from './components/camera';
import FeedbackComponent from './components/feedback';
import { useLocationAndAddress } from './components/location';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Camera');
  const [pictureUri, setPictureUri] = useState(null);
  const [kind, setKind] = useState(null);
  const [title, setTitle] = useState(null);
  const [text, setText] = useState(null);
  const { location, address, errorMsg } = useLocationAndAddress();

  const handlePictureTaken = (uri, kind, title, text) => {
    setPictureUri(uri);
    setKind(kind);
    setTitle(title);
    setText(text);
    setCurrentScreen('Feedback');
  };

  let content;
  if (currentScreen === 'Camera') {
    content = (
      <CameraScreen
        onPictureTaken={handlePictureTaken}
      />
    );
  } else if (currentScreen === 'Feedback') {
    content = (
      <FeedbackComponent
        onFeedbackSent={() => setCurrentScreen('Camera')}
        pictureUri={pictureUri}
        kind={kind}
        title={title}
        text={text}
        location={location}
        address={address}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Ultra Roads</Text>
      </View>
      {content}
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 10,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    flex: 1
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
