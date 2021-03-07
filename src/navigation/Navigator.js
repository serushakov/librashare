import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Login from '../views/Login';
import Register from '../views/Register';
import BottomTabsNavigator from './BottomTabsNavigator';

const Stack = createStackNavigator();

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(232,100,104)',
  },
};

const Navigator = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <NavigationContainer theme={Theme}>
      {isLoggedIn ? (
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Main" component={BottomTabsNavigator} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigator;
