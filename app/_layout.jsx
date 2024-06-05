import React from 'react';
import { StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import LoadFonts from '../src/fonts'; // Assurez-vous que le chemin est correct

export default function Layout() {
  return (
    <LoadFonts>
      <StatusBar barStyle="light-content" />
      <Stack screenOptions={{ headerShown: false }} />
    </LoadFonts>
  );
}
