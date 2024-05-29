import { createStore } from 'redux';

const initialState = {
  cartItems: [],
  orders: [],
  user: null,
  isLoggedIn: false,
};

function cartReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.cartItems.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex >= 0) {
        const updatedCartItems = state.cartItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return { ...state, cartItems: updatedCartItems };
      } else {
        return { ...state, cartItems: [...state.cartItems, action.payload] };
      }
    }
    case 'REMOVE_ITEM': {
      const updatedCartItems = state.cartItems.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0);
      return { ...state, cartItems: updatedCartItems };
    }
    case 'UPDATE_ITEM_QUANTITY': {
      const updatedCartItems = state.cartItems.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      return { ...state, cartItems: updatedCartItems };
    }
    case 'SET_CART_ITEMS':
      return { ...state, cartItems: action.payload };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'SET_USER': {
      const isLoggedIn = !!action.payload;
      return { ...state, user: action.payload, isLoggedIn };
    }
    case 'SET_LOGGED_IN':
      return { ...state, isLoggedIn: action.payload };
    default:
      return state;
  }
}

const store = createStore(cartReducer);

export default store;
