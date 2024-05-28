import AsyncStorage from '@react-native-async-storage/async-storage';

export const updateCartOnServer = (items) => async (dispatch) => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Updating cart on server with items:', items);
    const response = await fetch('http://localhost:3000/cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items })
    });
    const data = await response.json();
    console.log('Updated cart on server:', data); // Log API response

    if (data.status !== 'OK') {
      Alert.alert('Error', data.message);
    } else {
      dispatch({ type: 'UPDATE_CART_SUCCESS', payload: data.items });
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    dispatch({ type: 'UPDATE_CART_FAILURE', payload: error });
  }
};
