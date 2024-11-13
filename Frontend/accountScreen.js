import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font'; // Import Font to load custom fonts

export const ACCOUNT = () => {
    const navigation = useNavigation();
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fontsLoaded, setFontsLoaded] = useState(false); // Track font loading

    const loadFonts = async () => {
        await Font.loadAsync({
            'Tajawal-Regular': require('./assets/fonts/Tajawal-Regular.ttf'),
            'Tajawal-Bold': require('./assets/fonts/Tajawal-Bold.ttf'),
        });
        setFontsLoaded(true); // Set fontsLoaded to true once fonts are loaded
    };

    const fetchSpecifiedAccount = async (id) => {
        const token = await AsyncStorage.getItem('@storage_Key');
        if (!token) {
            console.error("No token found");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`api/account/${id}`, {
                method: "GET",
                headers: { 
                    Authorization: `Bearer ${token}`,  
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setAccount(result.data);
            } else {
                console.error('Failed to fetch account:', response.status);
                Alert.alert("Error", "Failed to fetch account. Please try again later.");
            }
        } catch (error) {
            console.error('Error fetching account:', error);
            Alert.alert("Error", "An error occurred while fetching the account.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFonts(); // Load fonts when the component is mounted

        const checkAccount = async () => {
            const accId = await AsyncStorage.getItem('@account_ID');
            if (!accId || isNaN(accId)) {
                navigation.navigate("wlcAccount");
                return;
            }
            fetchSpecifiedAccount(accId);
        };

        checkAccount();
    }, [navigation]);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('@account_ID');
        navigation.navigate("nav");
    };

    const handleFooterPress = () => {
        Linking.openURL('https://sajadkenani.github.io/app/ar/home');
    };

    // Show loading indicator until fonts are loaded
    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#39B6BD" />
                <Text style={styles.loadingText}>جار التحميل...</Text>
            </View>
        );
    }

    return (
        <LinearGradient style={styles.container} colors={['#39B6BD', '#074E52']}>
            <View style={styles.outerNav}>
                <View style={styles.innerNav}>
                    <Text style={[styles.headerText, { fontFamily: 'Tajawal-Bold' }]}>MEEM</Text>
                </View>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.profileImageContainer}>
                    <FontAwesome name="user-circle" size={100} color="white" />
                    <TouchableOpacity style={styles.addIcon}>
                        <FontAwesome name="plus-circle" size={24} color="#2C8D7A" />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.profileName, { fontFamily: 'Tajawal-Regular' }]}>{account?.name || "...جار التحميل"}</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("orders")}>
                    <FontAwesome name="clipboard" size={24} color="#2C8D7A" />
                    <Text style={[styles.buttonText, { fontFamily: 'Tajawal-Regular' }]}>الطلبات</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("aboutUs")}>
                    <FontAwesome name="info-circle" size={24} color="#2C8D7A" />
                    <Text style={[styles.buttonText, { fontFamily: 'Tajawal-Regular' }]}>معلومات عنا</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
                    <FontAwesome name="sign-out" size={24} color="#2C8D7A" />
                    <Text style={[styles.buttonText, { fontFamily: 'Tajawal-Regular' }]}>تسجيل الخروج</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleFooterPress}>
                <Text style={[styles.footerText, { fontFamily: 'Tajawal-Regular' }]}>Made by <Text style={{color: "#FFC225"}}> Sajad Kenani </Text></Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    outerNav: {
        width: "100%",
        marginBottom: -40,
        height: 150,
        display: "flex",
        alignItems: "center",
        paddingTop: 70
    },
    innerNav: {
        width: 350,
        height: 50,
        backgroundColor: "white",
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        color: "#39B6BD"
    },
    profileSection: {
        alignItems: 'center',
    },
    profileImageContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 2,
    },
    profileName: {
        marginTop: 10,
        color: 'white',
        fontSize: 18,
    },
    buttonContainer: {
        width: '90%',
    },
    button: {
        backgroundColor: '#B4DED4',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
    },
    buttonText: {
        color: '#2C8D7A',
        fontSize: 18,
        textAlign: 'center',
        flex: 1,
    },
    footerText: {
        color: 'white',
        marginBottom: 10,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: 'white',
        marginTop: 10,
    },
});
