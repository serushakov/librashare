import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button, withTheme } from 'react-native-elements';
import { AuthContext } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';
import { getCurrentUser } from '../api/auth';
import logo from '../images/logo.png';

const Login = ({ navigation, theme }) => {
  const { setAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      setLoading(true);
      const userToken = await AsyncStorage.getItem('userToken');

      if (userToken) {
        try {
          const response = await getCurrentUser(userToken);

          if (response.status !== 200) {
            setAuth(null, null);
            setLoading(false);

            return;
          }

          const user = await response.json();

          setAuth(user, userToken);
        } catch {
          setLoading(false);
        }
      }
      setLoading(false);
    };

    getToken();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {loading && (
        <ActivityIndicator
          size="large"
          style={styles.activityIndicator}
          color="#FFFFFF"
        />
      )}
      <Image source={logo} style={styles.logo} />
      <LoginForm onLoadingStateChange={setLoading} />
      <Button
        style={styles.noAccountButton}
        titleStyle={{
          ...styles.noAccountButtonText,
          color: theme.colors.platform.ios.primary,
        }}
        title="I don't have an account"
        type="clear"
        onPress={() => navigation.navigate('Register')}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: '#000000AA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 32,
  },
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAccountButton: {
    marginTop: 8,
  },

  noAccountButtonText: {
    fontSize: 14,
  },
});

export default withTheme(Login);
