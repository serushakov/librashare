import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useTheme } from '@react-navigation/native';

import Map from './Map';
import CreatePost from './CreatePost';

const Stack = createStackNavigator();

const HeaderRightButton = () => {
  const {
    colors: { primary },
  } = useTheme();

  const navigation = useNavigation();

  return (
    <Button
      onPress={() => navigation.navigate('Create')}
      type="clear"
      icon={<Icon name="plus" size={24} color={primary} />}
    />
  );
};

const MapTab = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Map"
        options={{ headerRight: HeaderRightButton }}
        component={Map}
      />
      <Stack.Screen name="Create" component={CreatePost} />
    </Stack.Navigator>
  );
};

export default MapTab;
