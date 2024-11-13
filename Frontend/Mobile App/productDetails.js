import { View, Text, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native'; // Make sure to import useNavigation

export const DETAILS = () => {
  const [product, setProduct] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accId, setAccId] = useState(null); // State for account ID
  const navigation = useNavigation(); // Access navigation

  const fetchSpecificProduct = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('@storage_Key');
    const key = await AsyncStorage.getItem('@id_Key');

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
      const response = await fetch(`api/products/${key}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        setProduct(result.data);
      } else {
        setError("Failed to fetch product. Please try again.");
      }
    } catch (error) {
      setError("Error fetching product. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecifiedAccount = async (id) => {
    const token = await AsyncStorage.getItem('@storage_Key');
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch(`api/account/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const result = await response.json();
        setAccount(result.data);
      } else {
        console.error('Failed to fetch account:', response.status);
      }
    } catch (error) {
      console.error('Error fetching account:', error);
    }
  };

  useEffect(() => {
    const checkAccount = async () => {
      const accId = await AsyncStorage.getItem('@account_ID');
      if (accId) {
        setAccId(accId);
        fetchSpecifiedAccount(accId);
      }
    };
    checkAccount();
    fetchSpecificProduct();
  }, []);
  const sendOrder = async () => {
    if (account && product) {
      // Create a new object to avoid mutating the original account object
      const modifiedAccount = {
        ...account,
        accName: account.name,
        accPhone: account.phone,
        productID: String(account.id),
        accID: accId
      };
  
      const combinedData = {
        ...modifiedAccount,
        ...product,
        price: Number(product.price), // Convert product.price to a number
      };

      console.log(combinedData)
  
      const token = await AsyncStorage.getItem('@storage_Key'); // Retrieve token here
  
      try {
        const response = await fetch(`api/orders`, {
          method: "POST",
          headers: { 
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(combinedData) // Stringify the combined data
        });
  
        if (response.ok) {
          navigation.navigate("order"); // Navigate on success
        } else {
          Alert.alert("Error", "Failed to place order. Please try again.");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while placing the order.");
      }
    } else {
      Alert.alert("يرجى تسجيل الدخول اولا");
    }
  };
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>حدث خطأ</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#39B6BD", "#074E52"]} style={styles.container}>
      <View style={styles.outerNav}>
        <View style={styles.innerNav}>
          <Text style={styles.headerText}>MEEM</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Image
          source={{ uri: 'api' + product.image.slice(1) }}
          style={styles.productImage}
        />
        <Text style={styles.sectionTitle}>{product.name}</Text>
        <Text style={styles.sectionDepartment}>{product.department}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>

        <View style={{ width: "100%", marginTop: 20 }}>
          <TouchableOpacity
            style={styles.customButton}
            onPress={sendOrder}
          >
            <Text style={styles.buttonText}>
              {`طلب: IQD ${parseInt(product?.price).toLocaleString() || "000"}`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
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
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontFamily: "Tajawal-Bold",
    color: "#39B6BD"
  },
  card: {
    width: 350,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    alignItems: "flex-end",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    height: 1000,
  },
  productImage: {
    width: "100%",
    height: 330,
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "Tajawal-Bold",
    color: "#FFC225",
    marginBottom: 10,
    textAlign: "right",
  },
  sectionDepartment: {
    fontSize: 14,
    fontFamily: "Tajawal-Bold",
    color: "#333",
    marginBottom: 10,
    marginTop: -10,
    textAlign: "right",
  },
  productDescription: {
    fontSize: 16,
    fontFamily: "Tajawal-Regular",
    textAlign: "right",
    marginBottom: 20,
    color: "#0F585E",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  customButton: {
    backgroundColor: "#0CA5A5",
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Tajawal-Bold",
  },
});
