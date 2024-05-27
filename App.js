import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, Text } from 'react-native'; // Added Text import here
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useSelector } from 'react-redux';
import SplashScreen from './src/screens/SplashScreen';
import Home from './src/screens/Home';
import CartScreen from './src/screens/CartScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import ProductDetails from './src/screens/ProductDetails';
import { Ionicons } from '@expo/vector-icons';
import store from './src/datamodel/store';

const HomeStack = createStackNavigator();
const CartStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen name="CategoryScreen" component={CategoryScreen} />
      <HomeStack.Screen name="ProductDetails" component={ProductDetails} />
    </HomeStack.Navigator>
  );
}

function CartStackScreen() {
  return (
    <CartStack.Navigator screenOptions={{ headerShown: false }}>
      <CartStack.Screen name="CartScreen" component={CartScreen} />
    </CartStack.Navigator>
  );
}

function CartIconWithBadge() {
  const cartItems = useSelector((state) => state.cartItems);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View>
      <Ionicons name="cart" size={25} color="gray" />
      {totalQuantity > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalQuantity}</Text>
        </View>
      )}
    </View>
  );
}

export default function App() {
  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppFirstLaunched(false);
    }, 3000); // Splash screen delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        {isAppFirstLaunched ? (
          <SplashScreen />
        ) : (
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName="Products"
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  if (route.name === 'Products') {
                    iconName = focused ? 'home' : 'home-outline';
                  } else if (route.name === 'My Cart') {
                    iconName = focused ? 'cart' : 'cart-outline';
                  }
                  return route.name === 'My Cart' ? (
                    <CartIconWithBadge />
                  ) : (
                    <Ionicons name={iconName} size={size} color={color} />
                  );
                },
                tabBarActiveTintColor: '#3399ff',
                tabBarInactiveTintColor: 'gray',
                headerShown: false 
              })}
            >
              <Tab.Screen name="Products" component={HomeStackScreen} />
              <Tab.Screen name="My Cart" component={CartStackScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        )}
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
