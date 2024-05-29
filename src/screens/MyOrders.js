import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyOrders = () => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState({});
  const user = useSelector((state) => state.user);
  const orders = useSelector((state) => state.orders);

  useEffect(() => {
    if (user && user.id) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/orders/all', {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.status === 'OK') {
        dispatch({ type: 'SET_ORDERS', payload: data.orders });
        await AsyncStorage.setItem('orders', JSON.stringify(data.orders));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const toggleExpand = (status) => {
    setExpanded((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch('http://localhost:3000/orders/updateorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
        },
        body: JSON.stringify({ orderID: orderId, isPaid: newStatus === 'paid', isDelivered: newStatus === 'delivered' }),
      });
      const data = await response.json();

      if (data.status === 'OK') {
        Alert.alert('Status Updated', `Your order is ${newStatus}`);
        fetchOrders(); // Fetch updated orders after status change
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <TouchableOpacity onPress={() => setExpanded((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}>
        <View style={styles.orderSummary}>
          <Text style={styles.orderId}>Order ID: {item.id}</Text>
          <Text style={styles.orderDetails}>Items: {item.item_numbers} | Total: ${(item.total_price / 100).toFixed(2)}</Text>
          <Ionicons name={expanded[item.id] ? "caret-up" : "caret-down"} size={24} color="black" />
        </View>
      </TouchableOpacity>
      {expanded[item.id] && (
        <View style={styles.orderDetailsContainer}>
          {JSON.parse(item.order_items).map((product) => (
            <View key={product.prodID} style={styles.productDetails}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{product.title}</Text>
                <Text style={styles.productPrice}>Price: ${(product.price * product.quantity).toFixed(2)}</Text>
                <Text style={styles.productQuantity}>Quantity: {product.quantity}</Text>
              </View>
            </View>
          ))}
          {item.is_paid === 0 && (
            <TouchableOpacity
              style={styles.statusButton}
              onPress={() => handleStatusUpdate(item.id, 'paid')}
            >
              <Text style={styles.buttonText}>Pay</Text>
              <Ionicons name="wallet" size={20} color="#fff" />
            </TouchableOpacity>
          )}
          {item.is_paid === 1 && item.is_delivered === 0 && (
            <TouchableOpacity
              style={styles.statusButton}
              onPress={() => handleStatusUpdate(item.id, 'delivered')}
            >
              <Text style={styles.buttonText}>Receive</Text>
              <Ionicons name="car" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  const getStatusCount = (is_paid, is_delivered) => orders.filter((order) => order.is_paid === is_paid && order.is_delivered === is_delivered).length;

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.errorText}>You must be logged in to view your orders.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>
      <View style={styles.statusContainer}>
        <TouchableOpacity onPress={() => toggleExpand('new')} style={styles.statusHeader}>
          <Text style={styles.statusLabel}>New Orders</Text>
          <Text style={styles.statusCount}>{getStatusCount(0, 0)}</Text>
          <Ionicons name={expanded['new'] ? "caret-up" : "caret-down"} size={24} color="black" />
        </TouchableOpacity>
        {expanded['new'] && (
          <FlatList
            data={orders.filter((order) => order.is_paid === 0 && order.is_delivered === 0)}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
      <View style={styles.statusContainer}>
        <TouchableOpacity onPress={() => toggleExpand('paid')} style={styles.statusHeader}>
          <Text style={styles.statusLabel}>Paid Orders</Text>
          <Text style={styles.statusCount}>{getStatusCount(1, 0)}</Text>
          <Ionicons name={expanded['paid'] ? "caret-up" : "caret-down"} size={24} color="black" />
        </TouchableOpacity>
        {expanded['paid'] && (
          <FlatList
            data={orders.filter((order) => order.is_paid === 1 && order.is_delivered === 0)}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
      <View style={styles.statusContainer}>
        <TouchableOpacity onPress={() => toggleExpand('delivered')} style={styles.statusHeader}>
          <Text style={styles.statusLabel}>Delivered Orders</Text>
          <Text style={styles.statusCount}>{getStatusCount(1, 1)}</Text>
          <Ionicons name={expanded['delivered'] ? "caret-up" : "caret-down"} size={24} color="black" />
        </TouchableOpacity>
        {expanded['delivered'] && (
          <FlatList
            data={orders.filter((order) => order.is_paid === 1 && order.is_delivered === 1)}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40, 
  },
  header: {
    backgroundColor: '#3399ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#3399ff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
  },
  statusLabel: {
    fontSize: 18,
    color: '#fff',
  },
  statusCount: {
    fontSize: 18,
    color: '#fff',
  },
  orderItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDetails: {
    fontSize: 16,
    color: '#555',
  },
  orderDetailsContainer: {
    marginTop: 10,
  },
  productDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
  },
  productPrice: {
    fontSize: 16,
    color: '#555',
  },
  productQuantity: {
    fontSize: 16,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3399ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default MyOrders;
