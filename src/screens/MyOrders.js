import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyOrders = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState({});
  const user = useSelector((state) => state.user); // Assuming user state is managed by Redux

  useEffect(() => {
    if (user && user.id) {
      const fetchOrders = async () => {
        const response = await fetch(`https://fakestoreapi.com/orders/user/${user.id}`);
        const data = await response.json();
        setOrders(data);
      };

      fetchOrders();
    }
  }, [user]);

  const toggleExpand = (status) => {
    setExpanded((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://fakestoreapi.com/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();

      if (data) {
        Alert.alert('Status Updated', `Your order is ${newStatus}`);
        // Refresh orders
        const response = await fetch(`https://fakestoreapi.com/orders/user/${user.id}`);
        const updatedOrders = await response.json();
        setOrders(updatedOrders);
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
          <Text style={styles.orderDetails}>Items: {item.items.length} | Total: ${item.total.toFixed(2)}</Text>
          <Ionicons name={expanded[item.id] ? "caret-up" : "caret-down"} size={24} color="black" />
        </View>
      </TouchableOpacity>
      {expanded[item.id] && (
        <View style={styles.orderDetailsContainer}>
          {item.items.map((product) => (
            <View key={product.id} style={styles.productDetails}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productQuantity}>Quantity: {product.quantity}</Text>
            </View>
          ))}
          {item.status === 'new' && (
            <TouchableOpacity
              style={styles.statusButton}
              onPress={() => handleStatusUpdate(item.id, 'paid')}
            >
              <Text style={styles.buttonText}>Pay</Text>
            </TouchableOpacity>
          )}
          {item.status === 'paid' && (
            <TouchableOpacity
              style={styles.statusButton}
              onPress={() => handleStatusUpdate(item.id, 'delivered')}
            >
              <Text style={styles.buttonText}>Receive</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  const getStatusCount = (status) => orders.filter((order) => order.status === status).length;

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
      <Text style={styles.title}>My Orders</Text>
      <View style={styles.statusContainer}>
        <TouchableOpacity onPress={() => toggleExpand('new')} style={styles.statusHeader}>
          <Text style={styles.statusLabel}>New Orders</Text>
          <Text style={styles.statusCount}>{getStatusCount('new')}</Text>
          <Ionicons name={expanded['new'] ? "caret-up" : "caret-down"} size={24} color="black" />
        </TouchableOpacity>
        {expanded['new'] && (
          <FlatList
            data={orders.filter((order) => order.status === 'new')}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
      <View style={styles.statusContainer}>
        <TouchableOpacity onPress={() => toggleExpand('paid')} style={styles.statusHeader}>
          <Text style={styles.statusLabel}>Paid Orders</Text>
          <Text style={styles.statusCount}>{getStatusCount('paid')}</Text>
          <Ionicons name={expanded['paid'] ? "caret-up" : "caret-down"} size={24} color="black" />
        </TouchableOpacity>
        {expanded['paid'] && (
          <FlatList
            data={orders.filter((order) => order.status === 'paid')}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
      <View style={styles.statusContainer}>
        <TouchableOpacity onPress={() => toggleExpand('delivered')} style={styles.statusHeader}>
          <Text style={styles.statusLabel}>Delivered Orders</Text>
          <Text style={styles.statusCount}>{getStatusCount('delivered')}</Text>
          <Ionicons name={expanded['delivered'] ? "caret-up" : "caret-down"} size={24} color="black" />
        </TouchableOpacity>
        {expanded['delivered'] && (
          <FlatList
            data={orders.filter((order) => order.status === 'delivered')}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
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
  productTitle: {
    fontSize: 16,
    flex: 1,
  },
  productQuantity: {
    fontSize: 16,
  },
  statusButton: {
    backgroundColor: '#3399ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default MyOrders;