import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CartScreen = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartItems);
  const isFocused = useIsFocused();

  const fetchProductDetails = async (productId) => {
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
    return response.json();
  };

  const fetchCart = async () => {
    const cartData = await AsyncStorage.getItem('cart');
    const cart = cartData ? JSON.parse(cartData) : {};
    const products = await Promise.all(
      Object.keys(cart).map(async (id) => {
        const productDetails = await fetchProductDetails(id);
        return {
          id,
          ...productDetails,
          quantity: cart[id].quantity
        };
      })
    );
    dispatch({ type: 'SET_CART_ITEMS', payload: products });
  };

  useEffect(() => {
    if (isFocused) {
      fetchCart();
    }
  }, [isFocused]);

  const getTotalItemsAndCost = () => {
    let totalItems = 0;
    let totalCost = 0;
    cartItems.forEach(item => {
      totalItems += item.quantity;
      totalCost += item.price * item.quantity;
    });
    return { totalItems, totalCost };
  };

  const handleIncrease = async (id) => {
    const currentCart = await AsyncStorage.getItem('cart');
    let newCart = currentCart ? JSON.parse(currentCart) : {};
    newCart[id].quantity += 1;
    await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    dispatch({ type: 'UPDATE_ITEM_QUANTITY', payload: { id, quantity: newCart[id].quantity } });
  };

  const handleDecrease = async (id) => {
    const currentCart = await AsyncStorage.getItem('cart');
    let newCart = currentCart ? JSON.parse(currentCart) : {};

    if (newCart[id] && newCart[id].quantity > 1) {
      newCart[id].quantity -= 1;
    } else {
      delete newCart[id];
    }

    await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    dispatch({ type: 'UPDATE_ITEM_QUANTITY', payload: { id, quantity: newCart[id] ? newCart[id].quantity : 0 } });
  };

  const handleCheckout = async () => {
    try {
      await AsyncStorage.removeItem('cart');
      dispatch({ type: 'SET_CART_ITEMS', payload: [] });
      Alert.alert('Order Created', 'Your order has been successfully created.');
    } catch (e) {
      console.error('Failed to clear cart:', e);
    }
  };

  const { totalItems, totalCost } = getTotalItemsAndCost();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
      </View>
      {cartItems.length > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            <Text style={styles.boldText}>Items:</Text> {totalItems} | 
            <Text style={styles.boldText}>Total Price:</Text> ${totalCost.toFixed(2)}
          </Text>
        </View>
      )}
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.title}</Text>
                <Text style={styles.itemPrice}>
                  <Text style={styles.boldText}>Price: </Text>${item.price.toFixed(2)}
                </Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => handleDecrease(item.id)} style={styles.button}>
                    <Ionicons name="remove-circle" size={24} color="green" />
                  </TouchableOpacity>
                  <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                  <TouchableOpacity onPress={() => handleIncrease(item.id)} style={styles.button}>
                    <Ionicons name="add-circle" size={24} color="green" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.content}>
          <Text style={styles.emptyCartText}>Your cart is empty!</Text>
        </View>
      )}
      {cartItems.length > 0 && (
        <View style={styles.checkoutButtonContainer}>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Check Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#3399ff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 40,
    width: '95%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  summaryContainer: {
    backgroundColor: '#3399ff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    width: '95%',
  },
  summaryText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'normal',
    flex: 1,
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  listItem: {
    flexDirection: 'row',
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: 'contain',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#333',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginHorizontal: 10,
  },
  itemQuantity: {
    fontSize: 16,
    color: '#666',
  },
  checkoutButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  checkoutButton: {
    backgroundColor: '#3399ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    width: '95%',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default CartScreen;
