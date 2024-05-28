import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSignIn = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    fetch('http://localhost:3000/users/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.text())  // Change to text
      .then(async text => {
        let data;
        try {
          data = JSON.parse(text);
        } catch (error) {
          throw new Error(`Unexpected response: ${text}`);
        }

        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
          await AsyncStorage.setItem('user', JSON.stringify(data));
          dispatch({ type: 'SET_USER', payload: data });

          // Fetch the cart items from the server
          const response = await fetch('http://localhost:3000/cart', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.token}`,
            },
          });
          const cartData = await response.json();
          if (cartData.status === 'OK') {
            const cartItems = cartData.items.map(item => ({
              id: item.id,
              title: item.title,
              price: item.price,
              quantity: item.count,
            }));
            dispatch({ type: 'SET_CART_ITEMS', payload: cartItems });
          }

          navigation.navigate('UserProfile');
        } else {
          Alert.alert('Sign In Failed', 'Wrong email or password');
        }
      })
      .catch(error => {
        console.error(error); // Log the error for debugging
        Alert.alert('Sign In Failed', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Sign in with your email and password</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <Button title="Clear" onPress={() => { setEmail(''); setPassword(''); }} />
          <Button title="Sign In" onPress={handleSignIn} />
        </View>
        <Text
          style={styles.switchText}
          onPress={() => navigation.navigate('SignUp')}
        >
          Switch to: sign up as new user
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  form: {
    backgroundColor: 'purple',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  title: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  switchText: {
    marginTop: 10,
    color: 'white',
    textAlign: 'center',
  },
});

export default SignIn;
