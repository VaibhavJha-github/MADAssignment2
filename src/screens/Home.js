import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cachedCategories = await AsyncStorage.getItem('categories');
                if (cachedCategories) {
                    setCategories(JSON.parse(cachedCategories).map((category, index) => ({ id: `${category}-${index}`, title: category })));
                    setLoading(false);
                } else {
                    // Fetch from API if not cached
                    fetch('https://fakestoreapi.com/products/categories')
                        .then(res => res.json())
                        .then(data => {
                            setCategories(data.map((category, index) => ({ id: `${category}-${index}`, title: category }))); // Ensure unique keys
                            setLoading(false);
                            // Cache the data
                            AsyncStorage.setItem('categories', JSON.stringify(data));
                        })
                        .catch(error => {
                            console.error('Error fetching categories:', error);
                            setLoading(false);
                        });
                }
            } catch (error) {
                console.error('Error loading categories:', error);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);
    
    const renderItem = ({ item }) => (
        <Pressable 
          style={styles.button}
          onPress={() => navigation.navigate('CategoryScreen', { categoryName: item.title })}
        >
            <Text style={styles.buttonText}>{item.title}</Text>
        </Pressable>
    );

    const renderDeveloperName = () => (
        <View style={styles.developerNameContainer}>
            <Text style={styles.developerNameText}>Developed by: Vaibhav Jha</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Product Categories</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={[...categories, { id: 'developer', title: 'Developed by: Vaibhav Jha' }]}
                    renderItem={({ item }) => item.id === 'developer' ? renderDeveloperName() : renderItem({ item })}
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
    developerNameContainer: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
        backgroundColor: '#C0C0C0',
    },
    developerNameText: {
        fontSize: 18,
        color: '#3399ff',
        fontWeight: 'bold',
    },
});

export default Home;