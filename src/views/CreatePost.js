import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
  View,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Button, Image, Input } from 'react-native-elements';
import validate from 'validate.js';
import * as ImagePicker from 'expo-image-picker';
import { useHeaderHeight } from '@react-navigation/stack';

import { AuthContext } from '../contexts/AuthContext';
import { postMedia, postTagMedia } from '../api/media';
import { appIdentifier } from '../utils';

const defaultFieldState = {
  touched: false,
  value: '',
};

const fieldsInitialState = {
  title: defaultFieldState,
  author: defaultFieldState,
  description: defaultFieldState,
};

const useFields = () => {
  const [fields, setFields] = useState(fieldsInitialState);

  const handleFieldChange = (field, value) => {
    setFields((current) => ({
      ...current,
      [field]: { ...current[field], value },
    }));
  };

  const handleFieldBlur = (field) => {
    setFields((current) => ({
      ...current,
      [field]: { ...current[field], touched: true },
    }));
  };

  const clear = () => {
    setFields(fieldsInitialState);
  };
  return { fields, handleFieldBlur, handleFieldChange, clear };
};

const useImagePicker = () => {
  const [image, setImage] = useState();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result);
    }
  };

  const clear = () => {
    setImage(null);
  };

  return { image, pickImage, clear };
};

const useUploadMedia = () => {
  const { token } = useContext(AuthContext);
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [data, setData] = useState();

  const uploadMedia = async (title, description, image) => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const response = await postMedia(title, description, image, token);
      setData(response.data);

      await postTagMedia(response.data.file_id, appIdentifier, token);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  return { uploadMedia, error, loading, data };
};

const validator = (title, description, image) =>
  validate(
    { title, description, image },
    {
      title: {
        presence: { allowEmpty: false },
      },
      author: {
        presence: { allowEmpty: false },
      },
      description: {
        presence: { allowEmpty: false },
      },
      image: {
        presence: { allowEmpty: false },
      },
    },
  );

const CreatePost = ({ navigation }) => {
  const {
    fields,
    handleFieldBlur,
    handleFieldChange,
    clear: clearFields,
  } = useFields();
  const { image, pickImage, clear: clearImage } = useImagePicker();

  const { uploadMedia, loading, data } = useUploadMedia();

  useEffect(() => {
    if (!loading && data) {
      clearFields();
      clearImage();
      navigation.navigate('Home');
    }
  }, [loading, data]);

  const errors = validator(fields.title.value, fields.description.value, image);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.activityIndicatorOverlay}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <ScrollView>
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={useHeaderHeight() + StatusBar.currentHeight}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              width: Dimensions.get('screen').width,
              padding: 16,
            }}
          >
            <Image style={styles.image} source={{ uri: image?.uri }} />
            <Button title="Pick an image" onPress={pickImage} />

            <Input
              label="Title"
              onEndEditing={() => handleFieldBlur('title')}
              onChangeText={(value) => handleFieldChange('title', value)}
              value={fields.title.value}
              errorMessage={
                fields.title.touched ? errors?.title?.[0] : undefined
              }
            />
            <Input
              label="Author"
              onEndEditing={() => handleFieldBlur('author')}
              onChangeText={(value) => handleFieldChange('author', value)}
              value={fields.author.value}
              errorMessage={
                fields.author.touched ? errors?.author?.[0] : undefined
              }
            />
            <Input
              label="Description"
              multiline
              onEndEditing={() => handleFieldBlur('description')}
              onChangeText={(value) => handleFieldChange('description', value)}
              errorMessage={
                fields.description.touched
                  ? errors?.description?.[0]
                  : undefined
              }
              value={fields.description.value}
            />

            <Button
              disabled={!!errors}
              title="Upload"
              onPress={() =>
                uploadMedia(fields.title.value, fields.description.value, image)
              }
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    width: 200,
    height: 200,
    marginBottom: 8,
  },

  activityIndicatorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(32, 33, 37, 0.4)',
  },
});

export default CreatePost;
