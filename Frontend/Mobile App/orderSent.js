import React from 'react';
import { Image, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from 'expo-linear-gradient'; 
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';

export const SENT = () => {
    const navigation = useNavigation(); 
    // Load Tajawal fonts
    const [fontsLoaded] = useFonts({
        'Tajawal-Regular': require('./assets/fonts/Tajawal-Regular.ttf'),
        'Tajawal-Bold': require('./assets/fonts/Tajawal-Bold.ttf'),
    });

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#39B6BD" />; // Show loading if fonts aren't loaded
    }

    const handleNavigateHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    };

    return (
        <LinearGradient colors={['#39B6BD', '#074E52']} style={styles.container}>
            <Image 
                source={require('./assets/order.png')}
                style={styles.image}
            />
            <Text style={styles.text}>تم ارسال طلبك بنجاح</Text>
            <Text style={styles.sideText}>شكرا لك على ارسال طلبك، سنتواصل معك بأقرب وقت ممكن.</Text>
            <TouchableOpacity style={styles.button} onPress={() => console.log('Navigate to Home')}>
                <Text style={styles.buttonText} onPress={handleNavigateHome}> العودة الى الصفحة الرئيسية </Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20, 
    },
    image: {
        width: 300,  // Adjusted width for better responsiveness
        height: 300, // Adjusted height for better responsiveness
        resizeMode: 'contain',
    },
    text: {
        marginTop: -28, 
        fontSize: 18,
        color: '#FFC225',
        textAlign: 'center', 
        fontFamily: "Tajawal-Bold",
    },
    sideText: {
        marginTop: 20, 
        fontSize: 12,
        color: 'white',
        textAlign: 'center', 
        fontFamily: "Tajawal-Regular",
    },
    button: {
        marginTop: 30, // Add space above the button
        backgroundColor: '#FFC225', // Button color
        borderRadius: 5, // Rounded corners
        paddingVertical: 12, // Vertical padding
        paddingHorizontal: 20, // Horizontal padding
    },
    buttonText: {
        color: '#074E52', // Text color for contrast
        fontSize: 16,
        textAlign: 'center',
        fontFamily: "Tajawal-Bold",
    },
});
