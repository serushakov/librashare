import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <RegisterForm />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Register;
