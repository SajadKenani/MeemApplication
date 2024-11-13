import { Image, Text, View, TouchableOpacity, StyleSheet, Animated, Easing } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useFonts } from "expo-font";
import MapView, { Marker } from 'react-native-maps'; // Import MapView and Marker

export const ABOUT = () => {
    const [clickCount, setClickCount] = useState(0);
    const translateX = useRef(new Animated.Value(600)).current; // Start at 600 (shifted right)

    const handlePress = () => {
        setClickCount(prevCount => (prevCount + 1) % 2); // Cycle between 0 and 1
    };

    // Load Tajawal fonts
    const [fontsLoaded] = useFonts({
        'Tajawal-Regular': require('./assets/fonts/Tajawal-Regular.ttf'),
        'Tajawal-Bold': require('./assets/fonts/Tajawal-Bold.ttf'),
    });

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: -200 * clickCount, // Shift image left based on click count
            duration: 300, // Duration of the animation
            useNativeDriver: true, // Use native driver for better performance
            easing: Easing.inOut(Easing.ease), // Correct easing function
        }).start();
    }, [clickCount]);

    const getContent = () => {
        switch (clickCount) {
            case 0:
                return (
                    <View style={styles.textContent}>
                        <Text style={styles.text}>نحن شركة ميم</Text>
                        <Text style={styles.subtitle}>للترويج والتسويق الإلكتروني</Text>
                        <Text style={styles.description}>
                            ميم مختصة بكلشي إلكتروني، من ترويج و تسويق و وسائل دفع. 
                            حتى تكدر من مكانك تشتغل وتكدر تعرض منتجاتك واعمالك يمنا واحنا انروجلك حتى نختصر عليك الامور.
                        </Text>
                        <Text style={styles.text}> +964 780 107 8080  </Text>
                    </View>
                );
            case 1:
                return (
                    <View style={styles.textContent}>
                        <Text style={styles.text}>موقعنا</Text>
                      
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: 33.2552, // Sample coordinates for Baghdad, replace with your location
                                    longitude: 44.3861,
                                    latitudeDelta: 0.0522,
                                    longitudeDelta: 0.0221,
                                }}
                            >
                                <Marker coordinate={{ latitude: 33.2522, longitude: 44.3866 }} title="Our Location" description="This is our office." />
                            </MapView>
                        </View>
                    </View>
                );

            default:
                return null;
        }
    };

    if (!fontsLoaded) {
        return <Text style={styles.loadingText}>جارٍ تحميل الخطوط...</Text>; // Display a loading message while fonts are loading
    }

    return (
        <View style={styles.container}>
            <Animated.Image 
                source={require('./assets/about.png')} 
                style={{ 
                    width: 1800,  
                    height: 1600,
                    transform: [{ translateX }], // Use animated value for translation
                    position: "absolute",
                    top: 0,
                    left: 0
                }} 
            />
            <View style={styles.contentContainer}>
                {getContent()}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handlePress}>
                        <Text style={styles.buttonText}>تغيير العرض</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
    },
    contentContainer: {
        alignItems: 'end',
        justifyContent: 'end',
        flex: 1,
        zIndex: 1,
        marginTop: 250,
    },
    textContent: {
        alignItems: 'end',
        justifyContent: 'end',
        marginVertical: 20,
        width: 300,
    },
    mapContainer: {
        alignItems: 'end',
        justifyContent: 'end',
        width: '100%',
        height: 300,
        marginTop: 20,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    buttonContainer: {
        marginTop: 20,
    },
button: {
    backgroundColor: '#39B6BD',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    // Android shadow
    elevation: 5,
    // iOS shadow
    shadowColor: '#000', // Shadow color (black)
    shadowOffset: { width: 0, height: 4 }, // Offset of the shadow
    shadowOpacity: 0.3, // Opacity of the shadow
    shadowRadius: 6, // Radius of the shadow's blur
},

    buttonText: {
        color: '#fff',
        fontFamily: 'Tajawal-Bold',
        fontSize: 16,
        textAlign: 'center',
    },
    text: {
        marginVertical: 10,
        textAlign: 'end',
        color: '#FFC225',
        fontFamily: "Tajawal-Bold",
        fontSize: 20,
        textAlign: "end"
    },
    subtitle: {
        fontFamily: "Tajawal-Bold",
        color: "#39B6BD",
    },
    description: {
        fontFamily: "Tajawal-Regular",
        color: "#39B6BD",
        textAlign: 'end',
        fontSize: 16,
        marginTop: 10,
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#39B6BD',
    },
});

export default ABOUT;
