import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, FlatList, SafeAreaView, ActivityIndicator, Button, TextInput, ScrollView, Modal} from 'react-native';
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native"; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetch('https://fakestoreapi.com/products/categories')
            .then(res => res.json())
            .then(data => {
                setCategories(data.map((category, index) => ({ id: index.toString(), title: category })));
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                setLoading(false);
            });
    }, []);

    const renderItem = ({ item }) => (
        <Pressable 
          style={styles.button}
          onPress={() => navigation.navigate('CategoryScreen', { categoryName: item.title })}
        >
            <Text style={styles.buttonText}>{item.title}</Text>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Categories</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={categories}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </SafeAreaView>
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
        marginHorizontal: '2.5%',
        borderRadius: 10,
        marginTop: 10,
        width: '95%',
        alignSelf: 'center', 
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    listContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch', 
        paddingTop: 20,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        margin: 10,
        backgroundColor: 'transparent',
        width: '95%', 
        alignSelf: 'center'
    },
    button: {
        backgroundColor: '#C0C0C0',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        marginVertical: 10,
        width: '100%', 
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#3399ff',
        fontWeight: 'bold',
    },
});

export default Home;
