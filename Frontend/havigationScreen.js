import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export const NAVIGATION = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
      <Text></Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
