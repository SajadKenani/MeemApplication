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

const SIGNIN = () => {
  const [accInfo, setAccInfo] = useState({ password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    'Tajawal-Regular': require('./assets/fonts/Tajawal-Regular.ttf'),
    'Tajawal-Bold': require('./assets/fonts/Tajawal-Bold.ttf'),
  });

  // Show a loading indicator while fonts are loading
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#40BFC1" />;
  }

  const handleAccountSubmit = () => {
    const { password, phone } = accInfo;

    // Validate input fields
    if (!password || !phone) {
      Alert.alert('تنبيه', 'يرجى ملء جميع الحقول.');
      return;
    }

    // Call the sign-in process
    signInProcess();
  };

  const signInProcess = async () => {
    console.log('Account Info before sending:', accInfo);
    setLoading(true);
  
    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem('@storage_Key');
    if (!token) {
      console.error("No token found");
      setLoading(false);
      Alert.alert('خطأ', 'لم يتم العثور على رمز التوثيق.');
      return;
    }
  
    try {
      console.log("sending...")
      // Send POST request to server with authentication header
      const response = await fetch('api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(accInfo),
      });
  
      // Check if the response was successful
      if (response.ok) {
        const responseBody = await response.json();
        console.log(responseBody)
        
  
        if (responseBody) {
          
          // Save account ID in AsyncStorage
          await AsyncStorage.setItem('@account_ID', JSON.stringify(responseBody.data));
          console.log('Stored Account ID:', await AsyncStorage.getItem('@account_ID'));
          setAccInfo({ password: '', phone: '' }); // Clear input fields
  
        // Navigate to the Home screen
        navigation.navigate('nav');
          
        } else {
          console.error('Account ID is undefined');
          Alert.alert('خطأ', 'لم يتم العثور على معرّف الحساب.');
        }
      } else {
        // Handle error responses
        const responseBody = await response.json();
        Alert.alert('خطأ', `فشل تسجيل الدخول: ${responseBody.error || response.status}`);
      }
    } catch (error) {
      Alert.alert('خطأ', `حدث خطأ: ${error.message}`);
    } finally {
      setLoading(false);
          
    }
  };
  

  const handleChange = (field, value) => {
    setAccInfo({ ...accInfo, [field]: value });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>ميم</Text>
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.headerText}>تسجيل الدخول</Text>

        <TextInput
          style={styles.input}
          placeholder="رقم الهاتف"
          placeholderTextColor="#7D8A99"
          keyboardType="phone-pad"
          value={accInfo.phone}
          onChangeText={(text) => handleChange('phone', text)}
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

        {loading ? (
          <ActivityIndicator size="large" color="#40BFC1" />
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleAccountSubmit}>
            <Text style={styles.submitButtonText}>تسجيل الدخول</Text>
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
    textAlign: 'right',
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
    textAlign: 'right',
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

export default SIGNIN;
