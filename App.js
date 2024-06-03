import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import BackgroundWrapper from './BackgroundWrapper'; // Importez votre wrapper

export default function App() {
  return (
    <BackgroundWrapper>
      <Tabs 
        screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="transfert"
          options={{
            title: 'Transfert',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
          }}
        />
      </Tabs>
    </BackgroundWrapper>
  );
}
