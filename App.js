import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import store from './src/store';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer theme={DefaultTheme}>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
