import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts } from 'expo-font';

export const FAVORITE = ({ navigation }) => {
  // Load Tajawal fonts
  const [fontsLoaded] = useFonts({
    'Tajawal-Regular': require('./assets/fonts/Tajawal-Regular.ttf'),
    'Tajawal-Bold': require('./assets/fonts/Tajawal-Bold.ttf'),
  });

  const [favData, setFavData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountId, setAccountId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchAccountID = async () => {
      const myId = await AsyncStorage.getItem("@account_ID");
      setAccountId(Number(myId));
    };

    fetchAccountID();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('@storage_Key');

    if (!token || !accountId) {
      console.error("No token or account ID found");
      setLoading(false);
      return;
    }

    try {
      // Fetch favorites
      const favoritesResponse = await fetch(`api/accounts/${accountId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (favoritesResponse.ok) {
        const favoritesResult = await favoritesResponse.json();
        setFavData(favoritesResult.data); // Assuming result.data is an array of favorite product IDs
      }

      // Fetch products
      const productsResponse = await fetch("api/products", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (productsResponse.ok) {
        const productsResult = await productsResponse.json();
        setProductData(productsResult.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleRemoveFavorite = async (favorite) => {
    if (!accountId || !favorite) {
      console.log('Error', 'Invalid favorite ID or account ID.');
      return;
    }

    const token = await AsyncStorage.getItem('@storage_Key');
    if (!token) {
      console.log('Authorization Error', 'No token found. Please log in again.');
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
          id: accountId,
          favorite: favorite,
        }),
      });

      if (response.ok) {
        setFavData(prevFavData => prevFavData.filter(id => id !== favorite));
      } else {
        const responseBody = await response.json();
        console.log('Error', `Failed to remove favorite: ${responseBody.error || response.status}`);
      }
    } catch (error) {
      console.log('Error', `An error occurred: ${error.message}`);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchData(); // Fetch data when accountId changes
    }
  }, [accountId]);

  // Filter products to show only favorites
  const favoriteProducts = productData.filter(product => favData.includes(product.id));



  const selectProduct = async (id) => {
    await AsyncStorage.setItem('@id_Key', String(id));
    navigation.navigate('ProductDetails');
  };

  return (
    <LinearGradient colors={['#39B6BD', '#074E52']} style={styles.container}>
      <View style={styles.outerNav}>
        <View style={styles.innerNav}>
          <Text style={styles.headerText}> MEEM </Text>
        </View>
      </View>

      <FlatList
        data={favoriteProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectProduct(item.id)} style={styles.card}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => handleRemoveFavorite(item.id)}>
                <Image
                  source={require('./assets/Heart.png')}
                  style={styles.removeImage}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.productName, { fontFamily: 'Tajawal-Bold', color: "gold", margin: 10, marginBottom: 0, marginTop: -8, fontSize: 16 }]}>{item.name}</Text>
              <Text style={[styles.productDescription, { fontFamily: 'Tajawal-Regular', color: "black", margin: 10, marginBottom: 0, marginTop: 3, fontSize: 14 }]}>
                {item.description.split(' ').length > 10
                  ? item.description.split(' ').slice(0, 10).join(' ') + '...'
                  : item.description}
              </Text>
            </View>
            <Image
              source={{ uri: 'api' + item.image.slice(1) }}
              style={styles.productImage}
            />
          </TouchableOpacity>
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyMessageContainer}>
            <Text style={styles.emptyMessage}>لايوجد عروض تمت اضافتها للمفضلة</Text>
            <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
 
            </TouchableOpacity>
          </View>
        }
      />
      <StatusBar style="auto" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
    width: "100%"
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: "Tajawal-Regular"
  },
  card: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 16,
    width: 350,
    alignItems: "center",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  removeImage: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
    marginLeft: 20
  },
});
