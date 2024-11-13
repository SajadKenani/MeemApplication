import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from 'expo-font'; // Import expo-font to load custom fonts

export const ORDERS = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [fontsLoaded, setFontsLoaded] = useState(false); // Track font loading

    // Load the fonts asynchronously
    const loadFonts = async () => {
        await Font.loadAsync({
            'Tajawal-Regular': require('./assets/fonts/Tajawal-Regular.ttf'),
            'Tajawal-Bold': require('./assets/fonts/Tajawal-Bold.ttf'),
        });
        setFontsLoaded(true); // Set font loaded state to true
    };

    useEffect(() => {
        loadFonts(); // Load fonts when the component mounts
        fetchProductsDependingOnDepartment();
    }, []);

    const fetchProductsDependingOnDepartment = async () => {
        setLoading(true);
        try {
            const id = await AsyncStorage.getItem('@account_ID');
            if (!id) {
                setError("User not authenticated. Please log in.");
                setLoading(false);
                return;
            }

            const response = await fetch(`api/order/${id}`, {
                method: "GET",
            });

            if (response.ok) {
                const result = await response.json();
                setProducts(result.data); // Set fetched products
            } else {
                const errorText = await response.text();
                setError(`Failed to fetch products: ${errorText}`);
            }
        } catch (error) {
            setError("Error fetching products. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Loading Fonts...</Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#39B6BD" />
                <Text style={styles.loadingText}>جار التحميل...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const formatMoneyPrice = (price) => {
        return Number(price) % 1 === 0 ? Number(price).toFixed(0) :Number(price).toFixed(2).replace(/\.?0+$/, '');
    };

    return (
        <View style={styles.container}>
            <View style={styles.outerNav}>
                <View style={styles.innerNav}>
                    <Text style={styles.headerText}>MEEM</Text>
                </View>
            </View>

            <Text style={styles.productName}>  الطلبات </Text>

            {products.length > 0 ? (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.productCard}>
                            <View style={styles.productContent}>
                                <View style={styles.productTextContainer}>
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <Text style={styles.productPrice}>${formatMoneyPrice(item.price.toFixed(2))}</Text>
                                </View>
                                {item.image ? (
                                    <Image
                                        source={{
                                            uri: `api${item.image.slice(1)}`,
                                        }}
                                        style={styles.productImage}
                                    />
                                ) : (
                                    <Text style={styles.noImageText}>No Image Available</Text>
                                )}
                            </View>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noProductsText}>No products available</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9', // Lighter background color for a cleaner look
        marginTop: 22,
    },
    noImageText: {
        fontSize: 14,
        color: '#b0b0b0', // Soft gray for no image text
        textAlign: 'center',
        marginBottom: 12,
    },
    noProductsText: {
        fontSize: 18,
        color: '#888', // Slightly darker gray for better contrast
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'Tajawal-Regular', // Apply custom font
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9', // Consistent background color
    },
    loadingText: {
        fontSize: 18,
        color: '#39B6BD', // Lighter, calming blue for loading state
        marginTop: 20,
        fontFamily: 'Tajawal-Regular', // Apply custom font
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9', // Consistent background color
    },
    errorText: {
        fontSize: 18,
        color: '#FF6347', // Soft red for errors (tomato color)
        textAlign: 'center',
        fontFamily: 'Tajawal-Regular', // Apply custom font
    },
    outerNav: {
        width: "100%",
        marginBottom: -40,
        height: 150,
        display: "flex",
        alignItems: "center",
        paddingTop: 30,
    },
    innerNav: {
        width: 350,
        height: 50,
        backgroundColor: "#ffffff", // White background for the navbar
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000', // Shadow color for inner nav
        shadowOpacity: 0.15, // Softer shadow
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    headerText: {
        fontSize: 20,
        fontFamily: 'Tajawal-Bold', // Apply custom bold font
        color: '#39B6BD', // Use the primary color for the header text
    },
    productCard: {
        backgroundColor: '#ffffff', // White background for product card
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    productContent: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'flex-end',
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginLeft: 16,
        resizeMode: 'cover',
    },
    productTextContainer: {
        flex: 1,
        textAlign: 'right',
    },
    productName: {
        fontSize: 18,
        marginBottom: 8,
        textAlign: 'right',
        fontFamily: 'Tajawal-Bold',
        color: '#333', // Darker text for better readability
    },
    productPrice: {
        fontSize: 16,
        color: '#4CAF50', // Use a pleasant green for the price
        textAlign: 'right',
        fontFamily: 'Tajawal-Regular',
    },
});
