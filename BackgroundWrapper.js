import React from 'react';
import { View, StyleSheet } from 'react-native';

const BackgroundWrapper = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue', // Changez cette couleur selon vos préférences
  },
});

export default BackgroundWrapper;
