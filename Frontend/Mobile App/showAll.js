import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import * as Font from 'expo-font'; // Import expo-font for loading fonts
import AppLoading from 'expo-app-loading'; // Import AppLoading
import { useNavigation } from '@react-navigation/native';

export const SHOWALL = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [product, setProduct] = useState([]); // Changed initial state to an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation(); // Access navigation

    // Load Tajawal fonts
    const loadFonts = async () => {
        await Font.loadAsync({
            'Tajawal-Regular': require('./assets/fonts/Tajawal-Regular.ttf'),
            'Tajawal-Bold': require('./assets/fonts/Tajawal-Bold.ttf'),
        });
        setFontsLoaded(true);
    };

    useEffect(() => {
        loadFonts(); // Load the fonts when the component mounts
        fetchProductsDependingOnDepartment();
    }, []);

    const selectProduct = async (id) => {
        await AsyncStorage.setItem('@id_Key', String(id));
        navigation.navigate('ProductDetails'); // Correct navigation
    };


    const fetchProductsDependingOnDepartment = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('@storage_Key');
        const key = await AsyncStorage.getItem('@dept_key');

        if (!token) {
            setError("User not authenticated. Please log in.");
            setLoading(false);
            return;
        }

        if (!key) {
            setError("No product key found. Please try again.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`api/products/dept/${key}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const result = await response.json();
                setProduct(result.data); // Set fetched products
                console.log(result.data);
            } else {
                const errorText = await response.text();
                setError(`Failed to fetch product: ${errorText}`);
            }
        } catch (error) {
            setError("Error fetching product. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const renderProduct = ({ item }) => (
        <TouchableOpacity onPress={() => selectProduct(item.id)}> 
            <View style={styles.productItem}>
      
                <View style={styles.productDetails}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productDescription}>{item.description?.split(' ').slice(0, 10).join(' ') + '...'}</Text>
                    <View style={{alignItems: "flex-end"}}><Text style={styles.productPrice}>{item.price}</Text></View>
                </View>
                <Image
                    source={{ uri: 'api' + 
                    item.image.slice(1) }}
                    style={styles.image}
                />
            </View>
            {/* Add a horizontal line below each item */}
            <View style={styles.separator} />
        </TouchableOpacity>
    );

    // Show a loading screen while fonts are being loaded
    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <LinearGradient colors={['#39B6BD', '#074E52']} style={styles.container}>

                <View style={styles.outerNav}>
                    <View style={styles.innerNav}>
                        <Text style={styles.headerText}> MEEM </Text>
                    </View>
                </View>

            <View style={{ display: "flex", flexDirection: "row", 
                justifyContent: "flex-end", alignItems: "center" }}>
                <Text style={styles.departmentTitle} >{product[0] && product[0].department}</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <FlatList
                    data={product}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProduct}
                    ListEmptyComponent={<Text style={styles.emptyText}>No products available.</Text>}
                />
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'Tajawal-Regular', // Apply Tajawal font
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
        fontFamily: 'Tajawal-Regular', // Apply Tajawal font
    },
    image: {
        width: 100, // Set a fixed width for the image
        height: 100, // Set a fixed height for the image
        borderRadius: 10,
        marginLeft: 15, // Add margin to separate from the text
    },
    productItem: {
        flexDirection: 'row', // Align items in a row
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
      
        alignItems: 'center', // Align image and text vertically
    },
    productDetails: {
        flex: 1, // Allow text to take up remaining space
    },
    productName: {
        fontSize: 18,
        fontFamily: 'Tajawal-Bold', // Apply Tajawal-Bold font
        color: "white",
    },
    productDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
        fontFamily: 'Tajawal-Regular', // Apply Tajawal-Regular font
        color: "white",
    },
    productPrice: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
        fontFamily: 'Tajawal-Regular', // Apply Tajawal-Regular font
        color: "white",
    },
    separator: {
        height: 1, // Thickness of the line
        backgroundColor: 'white', // Color of the line
        marginVertical: 8, // Space above and below the line
        alignSelf: 'center', // Center the line horizontally
        width: '90%', // Make the line 90% of the container's width
    },
    departmentTitle: {
        fontSize: 18,
        fontFamily: 'Tajawal-Bold',
        color: '#fff',
        textAlign: 'end',
        paddingTop: 30,
        paddingBottom: 20,
        margin: 35,
        marginTop: 0,
        marginBottom: 0,
    },
    besideDepartmentTitle: {
        fontSize: 18,
        fontFamily: 'Tajawal-Regular',
        color: '#fff',
        textAlign: 'end',
        paddingTop: 30,
        paddingBottom: 20,
        margin: 35,
        marginTop: 0,
        marginBottom: 0,
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
        fontFamily: "Tajawal-Bold",
    },
});
