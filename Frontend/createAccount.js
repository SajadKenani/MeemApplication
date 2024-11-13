
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export const CREATE = () => {
  const [accInfo, setAccInfo] = useState({
    name: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false); // To handle loading state
  const navigation = useNavigation(); // Access navigation

  const handleAccountSubmit = () => {
    const { name, password, phone } = accInfo;

    if (!name || !password || !phone) {
      Alert.alert('Please fill out all fields.');
      return;
    }

    createAccount();
  };


  const createAccount = async () => {
    console.log('Account Info before sending:', accInfo); // Log the account info
  
    const token = await AsyncStorage.getItem('@storage_Key');
    if (!token) {
      Alert.alert('Authorization Error', 'No token found. Please log in again.');
      return;
    }
  
    setLoading(true); // Start loading
  
    try {
      const response = await fetch('api/accounts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accInfo), // Send account info as JSON
      });
  
      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!');
        setAccInfo({ name: '', password: '', phone: '', image: '' }); // Reset form fields
        navigation.navigate('Home');
      } else {
        const responseBody = await response.json();
        Alert.alert('Error', `Failed to create account: ${responseBody.error || response.status}`);
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred: ${error.message}`);
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={accInfo.name}
        onChangeText={(text) => setAccInfo({ ...accInfo, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={accInfo.password}
        onChangeText={(text) => setAccInfo({ ...accInfo, password: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        value={accInfo.phone}
        onChangeText={(text) => setAccInfo({ ...accInfo, phone: text })}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Create Account" onPress={handleAccountSubmit} />
      )}

      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5
  }
});
