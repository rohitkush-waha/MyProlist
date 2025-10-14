import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import HomeIcon from '../assets/images/home.png';  
import FavIcon from '../assets/images/fav.png';  

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Products" component={HomeScreen} />
      <Stack.Screen name="Details" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={HomeIcon}
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={FavIcon} 
              style={{ width: size, height: size, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
