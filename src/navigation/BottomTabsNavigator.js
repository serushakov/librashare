import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import MapTab from '../views/MapTab';
import Search from '../views/Search';
import Profile from '../views/Profile';

const Tab = createBottomTabNavigator();

const BottomTabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // eslint-disable-next-line react/prop-types
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Map':
              return <Icon name="map" size={size} color={color} />;
            case 'Search':
              return <Icon name="search" size={size} color={color} />;
            case 'Profile':
              return <Icon name="user" size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Map" component={MapTab} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;
