import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

export const SIGNUP = () => {
  const [accInfo, setAccInfo] = useState({
    name: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    'Tajawal-Regular': require('./assets/fonts/Tajawal-Regular.ttf'),
    'Tajawal-Bold': require('./assets/fonts/Tajawal-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleAccountSubmit = () => {
    const { name, password, phone } = accInfo;

    if (!name || !password || !phone) {
      Alert.alert('Please fill out all fields.');
      return;
    }

    createAccount();
  };

  const createAccount = async () => {
    console.log('Account Info before sending:', accInfo);

    const token = await AsyncStorage.getItem('@storage_Key');
    if (!token) {
      Alert.alert('Authorization Error', 'No token found. Please log in again.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('api/accounts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accInfo),
      });

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!');
        setAccInfo({ name: '', password: '', phone: '' });
        navigation.navigate('Home');
      } else {
        const responseBody = await response.json();
        Alert.alert('Error', `Failed to create account: ${responseBody.error || response.status}`);
      }
    } catch (error) {
      Alert.alert('Error', `An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setAccInfo({ ...accInfo, [field]: value });
  };

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>ميم</Text>
        </View>
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        <Text style={styles.headerText}>إنشاء حساب جديد</Text>
        <TextInput
          style={styles.input}
          placeholder="الاسم الكامل"
          placeholderTextColor="#7D8A99"
          value={accInfo.name}
          onChangeText={(text) => handleChange('name', text)}
          textAlign="right"
        />
        <TextInput
          style={styles.input}
          placeholder="كلمة المرور"
          placeholderTextColor="#7D8A99"
          secureTextEntry={true}
          value={accInfo.password}
          onChangeText={(text) => handleChange('password', text)}
          textAlign="right"
        />
        <TextInput
          style={styles.input}
          placeholder="رقم الهاتف"
          placeholderTextColor="#7D8A99"
          keyboardType="phone-pad"
          value={accInfo.phone}
          onChangeText={(text) => handleChange('phone', text)}
          textAlign="right"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#40BFC1" />
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleAccountSubmit}>
            <Text style={styles.submitButtonText}>إنشاء حساب</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#40BFC1',
  },
  topSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
    backgroundColor: '#40BFC1',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D8E3E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 30,
    color: '#3E4A59',
    fontFamily: 'Tajawal-Bold',
  },
  formSection: {
    flex: 3,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingTop: 50,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Tajawal-Bold',
    color: '#3E4A59',
    textAlign: 'end',
    marginBottom: 30,
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#3E4A59',
    fontFamily: 'Tajawal-Regular',
  },
  submitButton: {
    backgroundColor: '#40BFC1',
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Tajawal-Bold',
  },
});

export default SIGNUP;
