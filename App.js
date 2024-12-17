import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WeatherForecastScreen from './screens/WeatherForecastScreen';
import CitySearchScreen from './screens/CitySearchScreen';
import AirQualityScreen from './screens/AirQualityHistoryScreen';
import AirQualitySearchScreen from './screens/AirQualitySearchScreen';


import 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: { fontSize: 14 },
          tabBarStyle: { backgroundColor: '#f8f9fa' }
        }}
      >
        <Tab.Screen 
          name="Semanal" 
          component={WeatherForecastScreen} 
          options={{
            title: 'Semanal',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'partly-sunny-sharp' : 'partly-sunny-outline'} color={color} size={24} />
            ),
          }} 
        />
        <Tab.Screen 
          name="Agora" 
          component={CitySearchScreen}
          options={{
            title: 'Atual',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'partly-sunny-sharp' : 'partly-sunny-outline'} color={color} size={24} />
            ),
          }} 
        />
        
        <Tab.Screen 
          name="AirQuality" 
          component={AirQualityScreen}
          options={{
            title: 'Historico',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'leaf-sharp' : 'leaf-outline'} color={color} size={24} />
            ),
          }} 
        />
        <Tab.Screen 
          name="AirSearchQuality" 
          component={AirQualitySearchScreen}
          options={{
            title: 'Previsão Atual',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'leaf-sharp' : 'leaf-outline'} color={color} size={24} />
            ),
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
