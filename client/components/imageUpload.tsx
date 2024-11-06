import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getIdToken } from 'firebase/auth';
import { auth } from '@/firebase';

interface FileObject {
  uri: string;
  name: string;
  type: string;
}

interface ImageUploadComponentProps {
  onImageUpload: (url: string | null) => void;
}

const ImageUploadComponent = forwardRef(({ onImageUpload }: ImageUploadComponentProps, ref) => {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (image) {
        
      const formData = new FormData();
      const file: FileObject = {
        uri: image,
        name: 'image.jpg',
        type: 'image/jpeg',
      };
      formData.append('file', file as any);
     
      const idToken = await auth.currentUser?.getIdToken();
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/posts/fileUpload`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${idToken}`
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        onImageUpload(data.data.url); // Pass the URL to parent component
        return data.data.url;
      } catch (error) {
        console.error('Upload failed:', error);
        onImageUpload(null); // Signal failure to parent component
        return null;
      }
    }
    return null;
  };

  useImperativeHandle(ref, () => ({
    pickImage,
    uploadImage,
  }));

  return (
    <View>
      <Button title="Choose Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
});

export default ImageUploadComponent;
