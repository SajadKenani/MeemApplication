import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';


// Function to convert price from IQD to USD
// const convertIQDToUSD = (priceInIQD, exchangeRate) => {
//     return (priceInIQD / exchangeRate).toFixed(2);
// };


export const HOME = () => {
    const [productData, setProductData] = useState([]);
    const [departmentsData, setDepartmentsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [favArray, setFavArray] = useState()
    const scrollViewRef = useRef(null);
    const [exchangeRate, setExchangeRate] = useState(1310);


    const navigation = useNavigation(); // Access navigation
    const [accountId, setAccountId] = useState(AsyncStorage.getItem("@account_ID")); // State to hold account ID
  
    useEffect(() => {
      const fetchAccountID = async () => {
        const myId = await AsyncStorage.getItem("@account_ID");
        console.log((myId))
        setAccountId(Number(myId)); // Update the account ID state
        setLoading(false); // Update loading state
      };
  
      fetchAccountID();
    }, [AsyncStorage.getItem("@account_ID")]); // Only run once when the component mounts
  

    // Load Tajawal fonts
    const [fontsLoaded] = useFonts({
        'Tajawal-Regular': require('./assets/fonts/Tajawal-Regular.ttf'),
        'Tajawal-Bold': require('./assets/fonts/Tajawal-Bold.ttf'),
    });

    const fetchProduct = async () => {
        const token = await AsyncStorage.getItem('@storage_Key');
        if (!token) {
            console.error("No token found");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("api/products", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`,  'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const result = await response.json();
                setProductData(result.data);
            } else {
                console.error('Failed to fetch products:', response.status);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };


    const fetchDepartments = async () => {
        const token = await AsyncStorage.getItem('@storage_Key');
        if (!token) {
            console.error("No token found");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("api/departments", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}`,  'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const result = await response.json();
                setDepartmentsData(result.data);
            }

        } catch (error) {
            console.error('Error fetching departments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchDepartments();
        await fetchProduct();
        setRefreshing(false);
    };

    useEffect( () => {
        const immediateFunction = async () => {
            await fetchDepartments();
            await fetchProduct();
            await fetchFavorite(accountId)  

        }
        immediateFunction()
     
    }, [favArray, accountId]);

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const selectProduct = async (id) => {
        await AsyncStorage.setItem('@id_Key', String(id));
        navigation.navigate('ProductDetails'); // Correct navigation
    };

    const navigaetToShowAll = async (dept) => {
        await AsyncStorage.setItem('@dept_key', String(dept))
        navigation.navigate('showAll')
    }

    const handleAddFavorite = async (favorite) => {
        console.log("Adding favorite:", typeof favorite);
        console.log( accountId)
        
        if (!accountId || !favorite) {
            Alert.alert('  يرجى تسجيل الدخول اولا '); 
            return;
        }
  
        const token = await AsyncStorage.getItem('@storage_Key');
        if (!token) {
            Alert.alert('Authorization Error', 'No token found. Please log in again.');
            setLoading(false);
            return;
        }

        if (!accountId) {
            Alert.alert('Authorization Error', 'No token found. Please log in again.');
            setLoading(false);
            return;
        }
        
        try {
            const response = await fetch('api/accounts/add', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: parseInt((""+accountId+""), 10),
                    favorite: parseInt(favorite, 10),
                }),       
            });
          
            if (response.ok) {
                console.log('Success', 'Favorite added successfully!');
                // The FlatList or map function that renders the list of items should automatically re-render
            } else {
                const responseBody = await response.json();
                console.log('Error', `Failed to add favorite: ${responseBody.error || response.status}`);
            }
        } catch (error) {
            console.log('Error', `An error occurred: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (favorite) => {   
        if (!accountId || !favorite) {
            Alert.alert('  يرجى تسجيل الدخول اولا ');
            return;
        }
        const token = await AsyncStorage.getItem('@storage_Key');          
        if (!token) {
            Alert.alert('Authorization Error', 'No token found. Please log in again.');
            setLoading(false);
            return;
        }
        if (!accountId) {
            Alert.alert('Authorization Error', 'No token found. Please log in again.');
            setLoading(false);
            return;
        }   
        try {
            const response = await fetch('api/accounts/remove', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: parseInt(""+accountId+"", 10),
                    favorite: parseInt(favorite, 10),
                }),
            });
    
            if (response.ok) {
                console.log('Success', 'Favorite added successfully!');  
                // The FlatList or map function that renders the list of items should automatically re-render
            } else {
                const responseBody = await response.json();
                console.log('Error', `Failed to add favorite: ${responseBody.error || response.status}`);
            }
        } catch (error) {
            console.log('Error', `An error occurred: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };   
    const fetchFavorite = async (id) => {
        const token = await AsyncStorage.getItem('@storage_Key');
        if (!token) {
            Alert.alert('Authorization Error', 'No token found. Please log in again.');
            setLoading(false);
            return;
        }
    
        try {
            const response = await fetch(`api/accounts/${id}`, {
                method: 'GET',
                headers: {
                   'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },          
            });
    
            if (response.ok) {
                const result = await response.json()
                setFavArray(result.data)
           
            } 
        } catch (error) {
           console.log(error)
        } finally {
            setLoading(false);
        }
    }
    const fetchExchangeRate = async () => {
        try {
          const response = await fetch('api/exchangerate');
          if (response.ok) {
            const data = await response.json();
            setExchangeRate(Number(data.data.currency));
          } else {
            console.error('Failed to fetch exchange rate:', response.status);
          }
        } catch (error) {
          console.error('Error fetching exchange rate:', error);
        }
      };

    useEffect(() => {
        fetchExchangeRate();
    }, []);
    const formatMoneyPrice = (price) => {
        return Number(price) % 1 === 0 ? Number(price).toFixed(0) :Number(price).toFixed(2).replace(/\.?0+$/, '');
    };
    const renderItem = (item, fav) => {
        const isFavorite = Array.isArray(fav) && fav.includes(item.id); 
        const priceInUSD = exchangeRate ? (item.price / exchangeRate).toFixed(2) : "N/A";

        return (
            <TouchableOpacity style={styles.itemContainer} key={item.id} 
            onPress={() => selectProduct(item.id)}>
                <Image
                    source={{ uri: 'api' + 
                    item.image.slice(1) }}
                    style={styles.image}
                />
                <View style={styles.shapeContainer}>
                    <Image source={require('./assets/corner.png')} style={styles.cornerImage} />
                </View>
                <View style={styles.textContainer}>
                    <TouchableOpacity style={styles.imageContainer} 
                        onPress={() => !isFavorite ? handleAddFavorite(item.id) : 
                        handleRemoveFavorite(item.id)}>
                        <Image source={isFavorite ? require('./assets/Heart.png') : 
                            require('./assets/noHeart.png')} style={styles.heartImage} />
                    </TouchableOpacity> 
                    <View style={styles.textheadContainter}>
                        <Text style={styles.title}>{item.name}</Text>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.description}>
                                {item.description.split(' ').length > 10
                                    ? item.description.split(' ').slice(0, 10).join(' ') + '...'
                                    : item.description}
                            </Text>
                        </View>
                        
                        <Text style={styles.price}> {formatPrice(formatMoneyPrice((item.price)))} IQD</Text>
                        <Text style={styles.price}> {priceInUSD} USD</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    
    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#39B6BD" />; // Show loading if fonts aren't loaded
    }

    return (
        <LinearGradient colors={['#39B6BD', '#074E52']} style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#39B6BD']} 
                    />
                }
                stickyHeaderIndices={[0]}
            >
                <View style={styles.outerNav}>
                    <View style={styles.innerNav}>
                        <Text style={styles.headerText}> MEEM </Text>
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#ffffff" />
                ) : (
                    <View style={styles.outContainer}>
                        {departmentsData
                            .filter(dept => productData.some(item => item.department === dept.name))
                            .map(dept => (
                                <View key={dept.id}>
                                    <View style={{ display: "flex", flexDirection: "row", 
                                        justifyContent: "space-between", alignItems: "center" }}>
                                    <Text style={styles.besideDepartmentTitle} 
                                    onPress={() => navigaetToShowAll(dept.name)}>عرض الكل</Text> 
                                    <Text style={styles.departmentTitle} >{dept.name}</Text>
                                    </View>
                                    <View style={styles.carouselContainer}>
                                    <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false}>
                                        {productData
                                            .filter(item => item.department === dept.name)
                                            .slice(0, 5) // Limit the items to the first five
                                            .map(item => renderItem(item, favArray))
                                        }
                                    </ScrollView>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                )}
                <StatusBar style="auto" />
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    outContainer: {
        flex: 1,
        width: '100%',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 40,
    },
    scrollContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingBottom: 20,
    },
    outerNav: {
        width: "100%",
        marginBottom: -40,
        height: 150,
        display: "flex",
        alignItems: "center",
        paddingTop: 30
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
        color: "#39B6BD"
    },
    shapeContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 0,
        display: "flex",
        justifyContent: "end",
        alignItems: 'start',
    },
    imageContainer: {
        width: 150,
        height: "100%",
       

        zIndex: 999,
    },
    carouselContainer: {
        alignItems: 'center',
        marginBottom: 0,
    },
    itemContainer: {
        borderRadius: 20,
        marginLeft: 45,
        marginRight: -20,
        alignItems: 'flex-end',
        width: 300,
        height: 445,
    },
    cornerImage: {
        width: 30,
        height: 30,
        marginTop: -180
    },
    textContainer: {
        backgroundColor: "white",
        width: "100%",
        height: "30%",
        marginTop: -15,
        borderTopRightRadius: 20,
        borderRadius: 20,
        borderTopLeftRadius: 0,
        textAlign: "right",
        fontFamily: "Tajawal-Bold",
        display: "flex",
        flex: 1
  
    },
    textheadContainter: {

        marginTop: -150
    },
    title: {
        fontSize: 22,
        fontFamily: "Tajawal-Bold",
        textAlign: 'right',
        color: '#FFC225',
        margin: 24,
    },
    descriptionContainer: {
       
         display: "flex",
         alignItems: "flex-end"

    },
    description: {
        fontSize: 14,
        color: 'black',
        textAlign: 'right',
        margin: 24,
        marginTop: -20,
        fontFamily: "Tajawal-Regular",
        width: "60%",
    },
    price: {
        fontSize: 16,
        fontFamily: "Tajawal-Bold",
        color: '#39B6BD',
        textAlign: 'right',
        margin: 24,
        marginTop: -20,
    },
    image: {
        width: '100%',
        height: 310,
        borderRadius: 10,
        borderBottomRightRadius: 0
    },
    departmentTitle: {
        fontSize: 18,
        fontFamily: 'Tajawal-Bold',
        color: '#fff',
        textAlign: 'end',
        paddingTop: 30,
        paddingBottom: 20,
        margin: 45,
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
        margin: 45,
        marginTop: 0,
        marginBottom: 0,
    },
    heartImage: {
        width: 70,
        height: 70,
        position: 'relative',
        top: 60,
        left: 20,
        zIndex: 444
    },
});
