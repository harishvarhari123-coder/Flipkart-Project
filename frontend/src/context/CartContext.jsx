import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();
const API = 'https://flipkart-project-l2ex.onrender.com/api';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setCartCount(0);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`${API}/cart`);
      setCartItems(res.data);
      setCartCount(res.data.reduce((sum, item) => sum + item.quantity, 0));
    } catch (err) {
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post(`${API}/cart`, { product_id: productId, quantity });
      await fetchCart();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add to cart' };
    }
  };

  const updateQuantity = async (cartId, quantity) => {
    try {
      await axios.put(`${API}/cart/${cartId}`, { quantity });
      await fetchCart();
    } catch (err) {
      console.error('Update cart error:', err);
    }
  };

  const removeItem = async (cartId) => {
    try {
      await axios.delete(`${API}/cart/${cartId}`);
      await fetchCart();
    } catch (err) {
      console.error('Remove item error:', err);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${API}/cart`);
      setCartItems([]);
      setCartCount(0);
    } catch (err) {
      console.error('Clear cart error:', err);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartSavings = () => {
    return cartItems.reduce((sum, item) => {
      const orig = item.original_price || item.price;
      return sum + ((orig - item.price) * item.quantity);
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, loading,
      addToCart, updateQuantity, removeItem, clearCart,
      fetchCart, getCartTotal, getCartSavings
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
