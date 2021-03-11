import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from 'react-query';
import { LogBox } from 'react-native';

import AuthProvider from './src/contexts/AuthContext';
import Navigator from './src/navigation/Navigator';

const queryClient = new QueryClient();

// Ignoring a react-query timeout warning
LogBox.ignoreLogs(['Setting a timer']);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Navigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
