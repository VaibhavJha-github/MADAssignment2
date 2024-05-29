import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import SignIn from './SignIn';

const UserProfile = ({ navigation }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        dispatch({ type: 'SET_USER', payload: JSON.parse(userData) });
      }
    };
    fetchUser();
  }, [dispatch]);

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
      .then(response => response.json())
      .then(data => {
        if (data.status === 'OK') {
          Alert.alert('Update Successful', 'Your profile has been updated.');
          dispatch({ type: 'SET_USER', payload: { ...user, name: newName } });
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
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_CART_ITEMS', payload: [] });
    dispatch({ type: 'SET_ORDERS', payload: [] });
    navigation.navigate('SignIn');
  };

  if (!user) {
    return <SignIn navigation={navigation} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Profile</Text>
      </View>
      <Text style={styles.label}>Name: <Text style={styles.info}>{user.name}</Text></Text>
      <Text style={styles.label}>Email: <Text style={styles.info}>{user.email}</Text></Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Update</Text>
          <Ionicons name="color-wand" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
          <Ionicons name="log-out" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

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
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
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
    width: '45%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 5,
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
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3399ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    width: '45%',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
});

export default UserProfile;
