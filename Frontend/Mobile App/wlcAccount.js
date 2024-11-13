import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading'; // To show a loading screen while fonts are loading
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export const WELACC = () => {

    const nav = useNavigation()

    // Load Tajawal fonts
    const [fontsLoaded] = useFonts({
        'Tajawal-Regular': require('./assets/fonts/Tajawal-Regular.ttf'),
        'Tajawal-Bold': require('./assets/fonts/Tajawal-Bold.ttf'),
    });

    const soToSignUp = () => {
        nav.navigate("signUp")
        
    }

    const soToSignIn = () => {
        nav.navigate("signIn")
    }

    // If fonts are not loaded, show a loading screen
    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <LinearGradient style={styles.container} colors={['#39B6BD', '#074E52']}>
            <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                    <Text style={[styles.logoText, { fontFamily: 'Tajawal-Bold' }]}>ميم</Text>
                </View>
            </View>
            <Text style={[styles.welcomeText, { fontFamily: 'Tajawal-Bold' }]}>اهلا بك في ميم!</Text>
            <Text style={[styles.subText, { fontFamily: 'Tajawal-Regular' }]}>للترويج والتسويق الإلكتروني</Text>
            <TouchableOpacity style={styles.buttonPrimary} onPress={soToSignIn}>
                <Text style={[styles.buttonPrimaryText, { fontFamily: 'Tajawal-Bold' }]}>تسجيل الدخول</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSecondary} onPress={soToSignUp}>
                <Text style={[styles.buttonSecondaryText, { fontFamily: 'Tajawal-Regular' }]}>انشاء حساب</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#008b8b',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logoContainer: {
        marginBottom: 100,
        alignItems: 'center',
    },
    logoCircle: {
        width: 140,
        height: 140,
        borderRadius: 100000,
        backgroundColor: '#B2DFDB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 24,
        color: '#00695c',
    },
    welcomeText: {
        fontSize: 18,
        color: '#FFB300',
        textAlign: 'center',
        marginBottom: 8,
    },
    subText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 30,
    },
    buttonPrimary: {
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
        marginBottom: 16,
        marginTop: 100,
        width: '80%',
        alignItems: 'center',
    },
    buttonPrimaryText: {
        color: '#206D72',
        fontSize: 16,
    },
    buttonSecondary: {
        borderWidth: 1,
        borderColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 25,
        width: '80%',
        alignItems: 'center',
    },
    buttonSecondaryText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default WELACC;
