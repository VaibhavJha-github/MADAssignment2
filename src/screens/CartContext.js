import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [totalItems, setTotalItems] = useState(0);

  return (
    <CartContext.Provider value={{ totalItems, setTotalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

