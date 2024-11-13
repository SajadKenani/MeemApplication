import React from "react";
import { View, Image, StyleSheet, Text, ActivityIndicator, StatusBar, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from "expo-font";
import { SafeAreaView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

export const WELCOME = () => {
    // Load Tajawal fonts
    const [fontsLoaded] = useFonts({
        'Tajawal-Regular': require('./assets/fonts/Tajawal-Regular.ttf'),
        'Tajawal-Bold': require('./assets/fonts/Tajawal-Bold.ttf'),
    });

    // Show a loading indicator while fonts are loading
    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#fff" style={styles.loading} />;
    }

    const navigation = useNavigation();

    const handlePress = async () => {
        try {
            await AsyncStorage.setItem("@welc", "true");
            navigation.navigate("Home");
        } catch (error) {
            console.error("Error saving data", error);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#39B6BD', '#074E52']} style={styles.container}>
                <StatusBar hidden={false} />
                <Image source={require('./assets/3d.png')} style={styles.image} />
                <Text style={styles.title}>نحن شركة ميم</Text>
                <Text style={styles.subtitle}>للترويج والتسويق الإلكتروني</Text>
                <Text style={styles.description}>
                    ميم مختصة بكلشي إلكتروني، من ترويج و تسويق و وسائل دفع. حتى تكدر من مكانك تشتغل وتكدر تعرض منتجاتك واعمالك يمنا واحنا انروجلك حتى نختصر عليك الامور.
                </Text>
                <TouchableOpacity style={styles.button} onPress={handlePress}>
                    <Text style={styles.buttonText}>ابدأ الآن</Text>
                </TouchableOpacity>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#39B6BD',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    image: {
        width: 400,
        height: 420,
        marginBottom: 20,
        marginLeft: 16,
    },
    title: {
        fontSize: 24,
        color: '#FFC225',
        marginBottom: 10,
        fontFamily: "Tajawal-Bold",
    },
    subtitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 10,
        fontFamily: "Tajawal-Bold",
    },
    description: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: "Tajawal-Regular",
        lineHeight: 22,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#39B6BD',
    },
    button: {
        backgroundColor: '#FFC225', // Button color
        paddingVertical: 15,        // Vertical padding
        paddingHorizontal: 30,      // Horizontal padding
        borderRadius: 25,           // Rounded corners
        marginTop: 20,              // Margin at the top
    },
    buttonText: {
        color: '#074E52',           // Text color
        fontSize: 18,
        fontFamily: "Tajawal-Bold",
        textAlign: 'center',
    },
});

export default WELCOME;
