import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = ({ navigation }) => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async () => {
    const token = await AsyncStorage.getItem('token');
    fetch('http://localhost:3000/users/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newName, password: newPassword }),
    })
      .then(response => response.text())  // Change to text
      .then(text => {
        let data;
        try {
          data = JSON.parse(text);
        } catch (error) {
          throw new Error(`Unexpected response: ${text}`);
        }

        if (data.status === 'OK') {
          Alert.alert('Update Successful', 'Your profile has been updated.');
          setUser({ ...user, name: newName });
          setModalVisible(false);
        } else {
          Alert.alert('Update Failed', data.message);
        }
      })
      .catch(error => {
        console.error(error); // Log the error for debugging
        Alert.alert('Update Failed', error.message);
      });
  };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Profile</Text>
      </View>
      <Text style={styles.label}>Name: <Text style={styles.info}>{user.name}</Text></Text>
      <Text style={styles.label}>Email: <Text style={styles.info}>{user.email}</Text></Text>
      <Button title="Update" onPress={() => setModalVisible(true)} />
      <Button title="Sign Out" onPress={handleSignOut} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Update Profile</Text>
          <TextInput
            style={styles.input}
            placeholder="New Name"
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <Button title="Confirm" onPress={handleUpdate} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    backgroundColor: '#3399ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    width: '95%',
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  info: {
    fontWeight: 'normal',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default UserProfile;