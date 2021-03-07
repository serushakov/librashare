import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { ThemeProvider } from 'react-native-elements';
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Login from '../views/Login';
import Register from '../views/Register';
import BottomTabsNavigator from './BottomTabsNavigator';

const Stack = createStackNavigator();

const NavigationTheme = {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(232,100,104)',
  },
};

const ElementsTheme = {
  colors: {
    primary: 'rgb(232,100,104)',
  },
};

const Navigator = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <ThemeProvider theme={ElementsTheme}>
      <NavigationContainer theme={NavigationTheme}>
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
    </ThemeProvider>
  );
};

export default Navigator;
