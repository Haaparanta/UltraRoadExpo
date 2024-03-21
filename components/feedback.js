import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

const FeedbackComponent = ({ onFeedbackSent, pictureUri, serverResponse, location }) => {
  const [issueType, setIssueType] = useState('');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');

  const submitFeedback = async () => {
    if (!location) {
      console.error("Location data is not available.");
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: pictureUri,
      type: 'image/jpeg',
      name: 'issue.jpg',
    });

    console.log("Submitting feedback...");
    console.log("Issue Type: ", issueType);
    console.log("Headline: ", headline);
    console.log("Description: ", description);
    console.log("Latitude: ", location.coords.latitude);
    console.log("Longitude: ", location.coords.longitude);

    try {
      console.log("Submitting feedback...");
      const response = await fetch('http://ddns.serverlul.win:8000/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-latitude': location.coords.latitude,
          'x-longitude': location.coords.longitude,
          'x-kind': issueType,
          'x-title': headline,
          'x-text': description,
          'x-address': '1234 Main St, Springfield, IL 62701',
        },
        body: formData,
      });

      const responseData = await response.json();
      console.log(responseData);
      if (onFeedbackSent) onFeedbackSent();
    } catch (error) {
      console.error("Error submitting feedback: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Issue Type"
        onChangeText={setIssueType}
        value={issueType}
      />
      <TextInput
        style={styles.input}
        placeholder="Headline"
        onChangeText={setHeadline}
        value={headline}
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Description"
        onChangeText={setDescription}
        value={description}
        multiline
      />
      <Button title="Submit Feedback" onPress={submitFeedback} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default FeedbackComponent;
