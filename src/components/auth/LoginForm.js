import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import validate from 'validate.js';

import { extractValuesFromFields } from '../../utils';
import useHandleLogin from './useHandleLogin';

const LoginForm = ({ onLoadingStateChange }) => {
  const { error, doLogin } = useHandleLogin();

  const [fields, setFormState] = useState({
    username: { value: '', touched: false },
    password: { value: '', touched: false },
  });

  const handleInputChange = (field, value) => {
    setFormState((current) => ({
      ...current,
      [field]: {
        ...current[field],
        value,
      },
    }));
  };

  const handleInputEndEditing = (field) => {
    setFormState((current) => ({
      ...current,
      [field]: {
        ...current[field],
        touched: true,
      },
    }));
  };
  const errors = validate(extractValuesFromFields(fields), {
    username: { length: { minimum: 3 } },
    password: { length: { minimum: 5 } },
  });

  const handlePressLogin = async () => {
    onLoadingStateChange(true);
    await doLogin(fields.username.value, fields.password.value);
    onLoadingStateChange(false);
  };

  return (
    <View style={styles.container}>
      <Input
        autoCapitalize="none"
        placeholder="Username"
        autoCompleteType="off"
        onEndEditing={() => handleInputEndEditing('username')}
        errorMessage={
          fields.username.touched ? errors?.username?.[0] : undefined
        }
        onChangeText={(text) => handleInputChange('username', text)}
      />

      <Input
        autoCapitalize="none"
        placeholder="Password"
        secureTextEntry
        onEndEditing={() => handleInputEndEditing('password')}
        errorMessage={
          fields.password.touched ? errors?.password?.[0] : undefined
        }
        onChangeText={(text) => handleInputChange('password', text)}
      />
      {error && <Text style={styles.error}>{error}</Text>}

      <Button onPress={handlePressLogin} disabled={!!errors} title="Login" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
});

export default LoginForm;
