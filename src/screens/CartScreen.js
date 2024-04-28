import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CartScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.emptyCartText}>Your cart is empty!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
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
    marginTop: 10, 
    width: '95%', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', 
    textAlign: 'center', 
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
});

export default CartScreen;
