import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export const NAV = () => {
    const nav = useNavigation();

    const handleNavigateHome = () => {
        nav.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    };

    return (
        <LinearGradient colors={['#39B6BD', '#074E52']} style={styles.container}>
            <Text style={styles.message}>تمت العملية بنجاح</Text>
            <TouchableOpacity style={styles.button} onPress={handleNavigateHome}>
                <Text style={styles.buttonText}>العودة الى الصفحة الرئيسية</Text>
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
        borderRadius: 15,
        elevation: 5, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    message: {
        color: '#ffffff',
        fontSize: 22, // Increased font size
        fontWeight: 'bold', // Bold text
        marginBottom: 30, // Increased margin for spacing
        textAlign: 'center', // Center align text
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25, // Rounded button
        borderWidth: 1,
        borderColor: '#ffffff',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600', // Medium weight
        textAlign: 'center',
    },
});

export default NAV;
