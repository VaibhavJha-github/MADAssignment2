import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screens/SplashScreen';
import Home from "./src/screens/Home";
import CartScreen from "./src/screens/CartScreen";
import CategoryScreen from "./src/screens/CategoryScreen";
import ProductDetails from "./src/screens/ProductDetails";
import { Ionicons } from '@expo/vector-icons';

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

export default function App() {
  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppFirstLaunched(false);
    }, 3000); // Delay for the splash screen
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {isAppFirstLaunched ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'My Cart') {
                  iconName = focused ? 'cart' : 'cart-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#3399ff',
              tabBarInactiveTintColor: 'gray',
              headerShown: false // Ensure headers are not shown on any screen
            })}
          >
            <Tab.Screen name="Home" component={HomeStackScreen} />
            <Tab.Screen name="My Cart" component={CartStackScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
