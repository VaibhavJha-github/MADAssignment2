import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordPattern.test(password);
  };

  const handleSignUp = () => {
    if (!name) {
      Alert.alert('Error', 'Username value is invalid.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Email Invalid.');
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert('Error', 'Password must contain at least one uppercase letter, one lowercase letter, and one digit. The minimum length of the password is 8 characters.');
      return;
    }

    fetch('http://localhost:3000/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then(response => response.text())  // Change to text
      .then(text => {
        let data;
        try {
          data = JSON.parse(text);
        } catch (error) {
          throw new Error(`Unexpected response: ${text}`);
        }

        if (data.id) {
          Alert.alert('Sign Up Successful', 'You can now log in.');
          navigation.navigate('SignIn');
        } else {
          Alert.alert('Sign Up Failed', 'An error occurred');
        }
      })
      .catch(error => {
        console.error(error); // Log the error for debugging
        Alert.alert('Sign Up Failed', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Sign up a new user</Text>
        <TextInput
          style={styles.input}
          placeholder="User Name"
          value={name}
          onChangeText={setName}
        />
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
          <Button title="Clear" onPress={() => { setName(''); setEmail(''); setPassword(''); }} />
          <Button title="Sign Up" onPress={handleSignUp} />
        </View>
        <Text
          style={styles.switchText}
          onPress={() => navigation.navigate('SignIn')}
        >
          Switch to: sign in
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

export default SignUp;
