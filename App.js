import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screens/SplashScreen';
import Home from "./src/screens/Home";
import CartScreen from "./src/screens/CartScreen";
import CategoryScreen from "./src/screens/CategoryScreen";  // Ensure this is correctly imported
import { Ionicons } from '@expo/vector-icons';
import ProductDetails from "./src/screens/ProductDetails";

const HomeStack = createStackNavigator();
const CartStack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack navigator for the Home tab
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen name="CategoryScreen" component={CategoryScreen} />
      <HomeStack.Screen name="ProductDetails" component={ProductDetails} /> 
    </HomeStack.Navigator>
  );
}

// Stack navigator for the My Cart tab
function CartStackScreen() {
  return (
    <CartStack.Navigator screenOptions={{ headerShown: false }}>
      <CartStack.Screen name="CartScreen" component={CartScreen} />
    </CartStack.Navigator>
  );
}

// Main app component
export default function App() {
  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppFirstLaunched(false);
    }, 3000); // Delay of 3 seconds to show the splash screen
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
              tabBarActiveTintColor: '#3399ff',  // Active icon color
              tabBarInactiveTintColor: 'gray',  // Inactive icon color
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
  // Other styles...
});