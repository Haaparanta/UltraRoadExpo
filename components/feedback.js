import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native'; // Import Image from react-native
import { Picker } from '@react-native-picker/picker';

const FeedbackComponent = ({ onFeedbackSent, pictureUri, serverResponse, location, address }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [kinds, setKinds] = useState(['Loading...']);
  const [kind, setKind] = useState(serverResponse);

  useEffect(() => {
    const fetchKinds = async () => {
      try {
        const response = await fetch('http://ddns.serverlul.win:8000/kinds');
        const data = await response.json();
        setKinds(data.map(kind => kind.name));
      } catch (error) {
        console.error("Error fetching kinds: ", error);
      }
    };
    fetchKinds();
  }, []);

  const submitFeedback = async () => {
    if (!location || !address) {
      console.error("Location data or address is not available.");
      return;
    }
    if (!kind) {
      console.error("Issue type is not available.");
      return;
    }
    if (!title) {
      console.error("Headline is not available.");
      return;
    }
    if (!text) {
      console.error("Description is not available.");
      return;
    }


    console.log("Submitting feedback...");
    console.log("Issue Type: ", kind);
    console.log("Headline: ", title);
    console.log("Description: ", text);
    console.log("Latitude: ", location.coords.latitude);
    console.log("Longitude: ", location.coords.longitude);
    console.log("Address: ", address);

    const formData = new FormData();
    formData.append('file', {
      uri: pictureUri,
      type: 'image/jpeg',
      name: 'issue.jpg',
    });

    try {
      const response = await fetch('http://ddns.serverlul.win:8000/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-latitude': location.coords.latitude,
          'x-longitude': location.coords.longitude,
          'x-kind': kind,
          'x-title': title,
          'x-text': text,
          'x-address': address,
        },
        body: formData,
      });

      const responseData = await response.json();
      console.log("Feedback submitted: ", responseData);
      if (onFeedbackSent) onFeedbackSent();
    } catch (error) {
      console.error("Error submitting feedback: ", error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      {pictureUri && (
        <Image
          source={{ uri: pictureUri }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
      
      <Picker
        selectedValue={kind}
        onValueChange={(itemValue, itemIndex) => setKind(itemValue)}
        style={styles.input}
      >
        {kinds.map((kind, index) => (
          <Picker.Item key={index} label={kind} value={kind} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Headline"
        onChangeText={setTitle}
        value={title}
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Description"
        onChangeText={setText}
        value={text}
        multiline
      />
      <Button title="Submit Feedback" onPress={submitFeedback} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 5,
    padding: 20,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  image: {
    flex: 1,
    marginBottom: 20,
  },
});

export default FeedbackComponent;
