import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, Alert, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import SplashScreen from './src/screens/SplashScreen';
import Home from './src/screens/Home';
import CartScreen from './src/screens/CartScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import ProductDetails from './src/screens/ProductDetails';
import MyOrders from './src/screens/MyOrders';
import UserProfile from './src/screens/UserProfile';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import store from './src/datamodel/store';

const HomeStack = createStackNavigator();
const CartStack = createStackNavigator();
const UserProfileStack = createStackNavigator();
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

function UserProfileStackScreen() {
  return (
    <UserProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <UserProfileStack.Screen name="UserProfile" component={UserProfile} />
      <UserProfileStack.Screen name="SignIn" component={SignIn} />
      <UserProfileStack.Screen name="SignUp" component={SignUp} />
    </UserProfileStack.Navigator>
  );
}

function CartIconWithBadge() {
  const cartItems = useSelector((state) => state.cartItems);
  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

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

function OrdersIconWithBadge() {
  const orders = useSelector((state) => state.orders || []);
  const newOrdersCount = orders.filter(order => order.is_paid === 0 && order.is_delivered === 0).length;

  return (
    <View>
      <Ionicons name="gift" size={25} color="gray" />
      {newOrdersCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{newOrdersCount}</Text>
        </View>
      )}
    </View>
  );
}

function App() {
  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(true);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');
      if (token && user) {
        dispatch({ type: 'SET_USER', payload: JSON.parse(user) });
      }
    };

    const timer = setTimeout(() => {
      setIsAppFirstLaunched(false);
    }, 3000); // Splash screen delay

    checkLoginStatus();

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {isAppFirstLaunched ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="User Profile"
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Products') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'My Cart') {
                  iconName = focused ? 'cart' : 'cart-outline';
                } else if (route.name === 'My Orders') {
                  iconName = focused ? 'gift' : 'gift-outline';
                } else if (route.name === 'User Profile') {
                  iconName = focused ? 'person' : 'person-outline';
                }
                return route.name === 'My Cart' ? (
                  <CartIconWithBadge />
                ) : route.name === 'My Orders' ? (
                  <OrdersIconWithBadge />
                ) : (
                  <Ionicons name={iconName} size={size} color={color} />
                );
              },
              tabBarActiveTintColor: '#3399ff',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
            tabBar={(props) => <CustomTabBar {...props} isLoggedIn={isLoggedIn} />}
          >
            <Tab.Screen name="Products" component={HomeStackScreen} />
            <Tab.Screen name="My Cart" component={CartStackScreen} />
            <Tab.Screen name="My Orders" component={MyOrders} />
            <Tab.Screen name="User Profile" component={UserProfileStackScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      )}
    </View>
  );
}

const CustomTabBar = ({ state, descriptors, navigation, isLoggedIn }) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const iconName = (() => {
          if (route.name === 'Products') {
            return 'home';
          } else if (route.name === 'My Cart') {
            return 'cart';
          } else if (route.name === 'My Orders') {
            return 'gift';
          } else if (route.name === 'User Profile') {
            return 'person';
          }
          return null;
        })();

        const isFocused = state.index === index;

        const onPress = () => {
          if (!isLoggedIn && route.name !== 'User Profile') {
            Alert.alert('Not Logged In', 'You must log in to view this tab', [{ text: 'OK' }], { cancelable: false });
            return;
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const IconWithBadge = () => {
          if (route.name === 'My Cart') {
            return <CartIconWithBadge />;
          } else if (route.name === 'My Orders') {
            return <OrdersIconWithBadge />;
          } else {
            return <Ionicons name={iconName} size={25} color={isFocused ? '#3399ff' : 'gray'} />;
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabButton}
          >
            <IconWithBadge />
            <Text style={{ color: isFocused ? '#3399ff' : 'gray', fontSize: 12 }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function MainApp() {
  return (
    <Provider store={store}>
      <App />
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
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 60,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
