import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import { HOME } from './homeScreen';
import { FAVORITE } from './favoriteScreen';
import { DETAILS } from './productDetails';
import { SHOWALL } from './showAll';
import { ACCOUNT } from './accountScreen';
import WELACC from './wlcAccount';
import { SIGNUP } from './signUp';
import SIGNIN from './signIn';
import NAV from './navigatesback';
import { SENT } from './orderSent';
import { ABOUT } from './aboutUs';
import { WELCOME } from './welcomePage';
import { ORDERS } from './orders';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [welc, setWelc] = useState(null);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Tajawal-Regular': require('./assets/fonts/Tajawal-Regular.ttf'),
      'Tajawal-Bold': require('./assets/fonts/Tajawal-Bold.ttf'),
    });
    setFontsLoaded(true);
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch("api/login", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('@storage_Key', data.token); 
        setIsLoggedIn(true); 
      } else {
        console.error("Login failed:", response.status, await response.text());
      }
    } catch (error) {
      console.error("Error during login:", error);
      AsyncStorage.clear()
      handleLogin("admin", "password");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const initializeApp = async () => {
      await loadFonts();
      const token = await AsyncStorage.getItem('@storage_Key');
      const welcomeStatus = await AsyncStorage.getItem("@welc");
      setWelc(welcomeStatus);

      if (!token) {
        await handleLogin("admin", "password");
      } else {
        setIsLoggedIn(true);
      }

      setLoading(false);
    };

    initializeApp();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Favorite') {
                iconName = focused ? 'heart' : 'heart-outline';
              } else if (route.name === 'Account') {
                iconName = focused ? 'person' : 'person-outline';
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#39B6BD',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              paddingBottom: 8,
              height: 60,
              borderTopWidth: 1,
              borderTopColor: '#d1d1d1',
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
              fontFamily: 'Tajawal-Regular',
            },
            headerShown: false,
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{ tabBarLabel: 'الرئيسية' }}
          />
          <Tab.Screen
            name="Favorite"
            component={FavoriteStack}
            options={{ tabBarLabel: 'المفضلة' }}
          />
          <Tab.Screen
            name="Account"
            component={AccountStack}
            options={{ tabBarLabel: 'الحساب' }}
          />
        </Tab.Navigator>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      )}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

function HomeStack() {
  const [welc, setWelc] = useState(null);

  useEffect(() => {
    const fetchWelcomeStatus = async () => {
      const welcomeStatus = await AsyncStorage.getItem("@welc");
      setWelc(welcomeStatus);
    };

    fetchWelcomeStatus();
  }, []);

  return (
    <Stack.Navigator>
      {welc === null ? (
        <Stack.Screen name="welcomePage" component={WELCOME} options={{ headerShown: false }} />
      ) : null}
      
      <Stack.Screen name="Home" component={HOME} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetails" component={DETAILS} options={{ headerShown: false }} />
      <Stack.Screen name="showAll" component={SHOWALL} options={{ headerShown: false }} />
      <Stack.Screen name='order' component={SENT} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function FavoriteStack() {
  return(
    <Stack.Navigator>
    
        <Stack.Screen name="favoriteScreen" component={FAVORITE} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetails" component={DETAILS} options={{ headerShown: false }} />
   
  </Stack.Navigator>
  )
}

function AccountStack() {
  const [accountId, setAccountId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountID = async () => {
      const id = await AsyncStorage.getItem("@account_ID");
      setAccountId(id);
      setLoading(false);
    };

    fetchAccountID();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {accountId ? (
        <>
       
          <Stack.Screen name="accountScreen" component={ACCOUNT} options={{ headerShown: false }} />
          <Stack.Screen name="nav" component={NAV} options={{ headerShown: false }} />
          <Stack.Screen name="orders" component={ORDERS} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="wlcAccount" component={WELACC} options={{ headerShown: false }} />
          <Stack.Screen name='signUp' component={SIGNUP} options={{ headerShown: false }} />
          <Stack.Screen name='signIn' component={SIGNIN} options={{ headerShown: false }} />
          <Stack.Screen name="nav" component={NAV} options={{ headerShown: false }} />
        </>
      )}
      <Stack.Screen name="aboutUs" component={ABOUT} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Tajawal-Regular',
    fontSize: 16,
    color: '#333',
  },
  boldText: {
    fontFamily: 'Tajawal-Bold',
    fontSize: 16,
    color: '#333',
  },
});
