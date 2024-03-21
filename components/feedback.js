// FeedbackComponent.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';

const FeedbackComponent = ({ navigation, route }) => {
  const { imageUri, response } = route.params;
  const [issueType, setIssueType] = useState('');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');

  const submitFeedback = async () => {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'issue.jpg',
    });

    formData.append('latitude', String(location.latitude));
    formData.append('longitude', String(location.longitude));
    formData.append('type', issueType);
    formData.append('headline', headline);
    formData.append('description', description);

    try {
      const response = await fetch('http://ddns.serverlul.win:8000/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        body: formData,
      });
  
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error("Error submitting feedback: ", error);
    }
  };

  return (
    <View>
      <TextInput placeholder="Issue Type" onChangeText={setIssueType} value={issueType} />
      <TextInput placeholder="Headline" onChangeText={setHeadline} value={headline} />
      <TextInput placeholder="Description" onChangeText={setDescription} value={description} multiline />
      <Button title="Submit Feedback" onPress={submitFeedback} />
    </View>
  );
};

export default FeedbackComponent;
