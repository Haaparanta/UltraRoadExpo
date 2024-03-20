import * as FileSystem from 'expo-file-system';


export const saveImage = async (imageUri) => {
  const fileName = imageUri.split('/').pop();
  const newPath = FileSystem.documentDirectory + fileName;

  try {
    await FileSystem.copyAsync({
      from: imageUri,
      to: newPath,
    });
    console.log('Image saved to:', newPath);
    splitImage(newPath, 360, 240);
  } catch (e) {
    console.error('Error saving the image', e);
  }
};

