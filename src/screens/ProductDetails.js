import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems);

  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const addToCart = async (product) => {
    try {
      const existingItem = cartItems.find(item => item.id === product.id);
      const quantity = existingItem ? existingItem.quantity + 1 : 1;

      const newCartItem = {
        ...product,
        quantity
      };

      const existingCart = await AsyncStorage.getItem('cart');
      let newCart = JSON.parse(existingCart);
      if (!newCart) {
        newCart = {};
      }

      newCart[product.id] = {
        name: product.title,
        price: product.price,
        quantity
      };

      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
      dispatch({ type: 'ADD_ITEM', payload: newCartItem });
      alert('Product added to cart!');
    } catch (e) {
      console.error('Failed to add item to cart:', e);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const cachedProduct = await AsyncStorage.getItem(`product-${productId}`);
      if (cachedProduct) {
        setProduct(JSON.parse(cachedProduct));
        setLoading(false);
      } else {
        fetch(`https://fakestoreapi.com/products/${productId}`)
          .then(res => res.json())
          .then(data => {
            setProduct(data);
            setLoading(false);
            AsyncStorage.setItem(`product-${productId}`, JSON.stringify(data));
          })
          .catch(error => {
            console.error('Error fetching product details:', error);
            setLoading(false);
          });
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Product Details</Text>
      </View>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productName}>{product.title}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Text style={styles.boldText}>Rate: </Text>{product.rating.rate}{'   '}
          <Text style={styles.boldText}>Sold: </Text>{product.rating.count}{'   '}
          <Text style={styles.boldText}>Price: </Text>${product.price.toFixed(2)}
        </Text>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Ionicons name="backspace" size={20} color="#fff" />
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => addToCart(product)}>
          <Ionicons name="cart" size={20} color="#fff" />
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.descriptionTitle}>Description:</Text>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  header: {
    backgroundColor: '#3399ff',
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    marginHorizontal: 10,
    marginTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  productImage: {
    width: '95%',
    alignSelf: 'center',
    height: 300,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#3399ff',
    padding: 10,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  infoText: {
    fontSize: 18,
    color: '#000',
  },
  boldText: {
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3399ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    width: '40%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  descriptionContainer: {
    padding: 10,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: '#eee',
    marginHorizontal: 10,
  },
  description: {
    fontSize: 16,
  }
});

export default ProductDetails;
