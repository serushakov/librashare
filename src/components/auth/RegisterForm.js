import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import validate from 'validate.js';

import { postRegister } from '../../api/auth';
import useHandleLogin from './useHandleLogin';
import useValidateUsername from './useValidateUsername';
import { extractValuesFromFields } from '../../utils';

const useValidateForm = (fields) => {
  const errors = validate(extractValuesFromFields(fields), {
    password: { length: { minimum: 5 } },
    confirmPassword: {
      equality: 'password',
    },
    email: {
      email: true,
    },
  });

  return errors;
};

const RegisterForm = () => {
  const [error, setError] = useState();

  const { error: loginError, doLogin } = useHandleLogin();

  const [fields, setFormState] = useState({
    username: { value: '', touched: false },
    password: { value: '', touched: false },
    confirmPassword: { value: '', touched: false },
    email: { value: '', touched: false },
    fullName: { value: '', touched: false },
  });

  const errors = useValidateForm(fields);
  const { isLoading, error: usernameError } = useValidateUsername(
    fields.username.value,
  );

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

  useEffect(() => {
    setError(loginError);
  }, [loginError]);

  const handlePressRegister = async () => {
    try {
      setError(null);

      const registerResponse = await postRegister(
        extractValuesFromFields(fields),
      );

      const registerContent = await registerResponse.json();
      if (registerContent.error) {
        setError(registerContent.error);
        return;
      }
    } catch (e) {
      setError(e.message);
    }

    doLogin(fields.username.value, fields.password.value);
  };

  const canPressRegister = !errors && !usernameError && !isLoading;

  return (
    <View style={styles.container}>
      <Input
        autoCapitalize="none"
        placeholder="Username"
        autoCompleteType="off"
        value={fields.username.value}
        onChangeText={(txt) => handleInputChange('username', txt)}
        onEndEditing={() => handleInputEndEditing('username')}
        errorMessage={fields.username.touched ? usernameError?.[0] : undefined}
        rightIcon={() => {
          if (isLoading) {
            return (
              <ActivityIndicator
                style={styles.activityIndicator}
                size="small"
                color="#000000"
              />
            );
          }
          if (fields.username.touched && !usernameError) {
            return <Icon name="check" color="green" size={24} />;
          }

          return null;
        }}
      />
      <Input
        autoCapitalize="none"
        placeholder="Password"
        value={fields.password.value}
        onChangeText={(txt) => handleInputChange('password', txt)}
        onEndEditing={() => handleInputEndEditing('password')}
        errorMessage={
          fields.password.touched ? errors?.password?.[0] : undefined
        }
        secureTextEntry
      />
      <Input
        autoCapitalize="none"
        placeholder="Repeat password"
        value={fields.confirmPassword.value}
        onChangeText={(txt) => handleInputChange('confirmPassword', txt)}
        onEndEditing={() => handleInputEndEditing('confirmPassword')}
        errorMessage={
          fields.confirmPassword.touched
            ? errors?.confirmPassword?.[0]
            : undefined
        }
        secureTextEntry
      />
      <Input
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        value={fields.email.value}
        onChangeText={(txt) => handleInputChange('email', txt)}
        onEndEditing={() => handleInputEndEditing('email')}
        errorMessage={fields.email.touched ? errors?.email?.[0] : undefined}
      />
      <Input
        autoCapitalize="words"
        placeholder="Full name"
        value={fields.fullName.value}
        onChangeText={(txt) => handleInputChange('fullName', txt)}
        onEndEditing={() => handleInputEndEditing('fullName')}
        errorMessage={
          fields.fullName.touched ? errors?.fullName?.[0] : undefined
        }
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        disabled={!canPressRegister}
        title="Register"
        onPress={handlePressRegister}
      />
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

export default RegisterForm;
