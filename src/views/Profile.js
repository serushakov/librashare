import AsyncStorage from '@react-native-community/async-storage';
import React, { useContext } from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-elements';
import { Button } from 'react-native-elements';
import { AuthContext } from '../contexts/AuthContext';

const Profile = () => {
  const { logout } = useContext(AuthContext);

  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Logout"
        onPress={async () => {
          await AsyncStorage.setItem('userToken', '');

          logout();
        }}
      />
    </View>
  );
};

export default Profile;
