import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();
const API = 'https://flipkart-project-l2ex.onrender.com/api';

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`${API}/wishlist`);
      setWishlistItems(res.data);
    } catch (err) {
      console.error('Fetch wishlist error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    try {
      const res = await axios.post(`${API}/wishlist`, { product_id: productId });
      await fetchWishlist();
      return { success: true, wishlist_id: res.data.wishlist_id };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add to wishlist' };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`${API}/wishlist/${productId}`);
      await fetchWishlist();
      return { success: true };
    } catch (err) {
      console.error('Remove from wishlist error:', err);
      return { success: false, message: 'Failed to remove from wishlist' };
    }
  };

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => Number(item.product_id) === Number(productId));
  }, [wishlistItems]);

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      loading,
      fetchWishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
