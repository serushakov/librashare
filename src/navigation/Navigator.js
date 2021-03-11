import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { ThemeProvider, UpdateTheme } from 'react-native-elements';
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Login from '../views/Login';
import Register from '../views/Register';
import BottomTabsNavigator from './BottomTabsNavigator';
import PostItemView from '../views/PostItemView';

const Stack = createStackNavigator();

const NavigationTheme = {
  ...DefaultTheme,

  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(232,100,104)',
    secondary: 'rgb(176,208,208)',
  },
};

const ElementsTheme = {
  colors: {
    primary: 'rgb(232,100,104)',
    secondary: 'rgb(176,208,208)',
  },
};

const Navigator = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <ThemeProvider theme={ElementsTheme}>
      <NavigationContainer theme={NavigationTheme}>
        {isLoggedIn ? (
          <Stack.Navigator>
            <Stack.Screen
              name="Main"
              options={{ headerShown: false }}
              component={BottomTabsNavigator}
            />
            <Stack.Screen
              name="Post"
              options={{ headerBackTitle: 'Back' }}
              component={PostItemView}
            />
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
