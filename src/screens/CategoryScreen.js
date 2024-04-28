import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CategoryScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { categoryName } = route.params;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const url = `https://fakestoreapi.com/products/category/${encodeURIComponent(categoryName)}`;
        console.log('Fetching from URL:', url); 
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, [categoryName]);

    const renderProduct = ({ item }) => (
        <TouchableOpacity 
          style={styles.productContainer}
          onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.textContainer}>
                <Text style={styles.productName}>{item.title}</Text>
                <Text style={styles.productPrice}>
                    <Text style={styles.priceLabel}>Price: </Text>${item.price.toFixed(2)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{categoryName}</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={styles.listFrame}>
                    <FlatList
                        data={products}
                        renderItem={renderProduct}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.listContainer}
                    />
                </View>
            )}
            <View style={styles.backButtonContainer}>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                >
                    <Ionicons name="backspace" size={20} color="#fff" />
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
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
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        width: '95%',
        alignItems: 'center',
        marginTop: 60,
        margin: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    listFrame: {
        flex: 1,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 10,
        marginBottom: 10, 
        backgroundColor: 'transparent',
    },
    listContainer: {
        justifyContent: 'center',
    },
    productContainer: {
        flexDirection: 'row',
        padding: 10,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 10,
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 16,
        color: '#666',
    },
    priceLabel: {
        fontWeight: 'bold',
    },
    productImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    backButtonContainer: {
        alignItems: 'center',  
        marginBottom: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3399ff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        width: '30%',
        justifyContent: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 5,
    }
});

export default CategoryScreen;
