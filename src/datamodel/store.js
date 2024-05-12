// src/store/store.js

import { createStore } from 'redux';

const initialState = {
  cartCount: 0
};

function cartReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, cartCount: state.cartCount + action.payload };
    case 'REMOVE_ITEM':
      return { ...state, cartCount: Math.max(0, state.cartCount - action.payload) };
    default:
      return state;
  }
}

const store = createStore(cartReducer);

export default store;
