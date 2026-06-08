import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { FiTrash2, FiShoppingCart, FiStar } from 'react-icons/fi';
import './Wishlist.css';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  const formatPrice = (p) => '₹' + Number(p).toLocaleString('en-IN');

  const isAlreadyInCart = (productId) => {
    return cartItems.some(item => Number(item.product_id) === Number(productId));
  };

  const handleAddToCart = async (product) => {
    if (isAlreadyInCart(product.product_id)) {
      navigate('/cart');
      return;
    }
    const res = await addToCart(product.product_id, 1);
    if (res.success) {
      alert('Added to cart!');
    } else {
      alert(res.message);
    }
  };

  if (loading && wishlistItems.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading Wishlist...</p>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-empty">
          <span className="wishlist-empty-icon">❤️</span>
          <h2>Empty Wishlist</h2>
          <p>You have no items in your wishlist. Start adding some!</p>
          <button className="shop-btn" onClick={() => navigate('/products')}>
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h2>My Wishlist ({wishlistItems.length})</h2>
        </div>

        <div className="wishlist-grid">
          {wishlistItems.map(item => (
            <div key={item.wishlist_id} className="wishlist-card">
              <div className="wishlist-card-image" onClick={() => navigate(`/product/${item.product_id}`)}>
                <img src={item.image} alt={item.name} />
              </div>

              <div className="wishlist-card-details">
                <div className="wishlist-card-meta">
                  <span className="wishlist-card-brand">{item.brand}</span>
                  <button 
                    className="wishlist-remove-btn" 
                    onClick={() => removeFromWishlist(item.product_id)}
                    title="Remove from Wishlist"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <h3 className="wishlist-card-name" onClick={() => navigate(`/product/${item.product_id}`)}>
                  {item.name}
                </h3>

                {item.rating > 0 && (
                  <div className="wishlist-card-rating">
                    <span className="rating-badge">
                      {item.rating} <FiStar />
                    </span>
                    <span className="rating-count">({Number(item.rating_count).toLocaleString()})</span>
                  </div>
                )}

                <div className="wishlist-card-price">
                  <span className="current">{formatPrice(item.price)}</span>
                  {item.original_price && item.original_price > item.price && (
                    <span className="original">{formatPrice(item.original_price)}</span>
                  )}
                  {item.discount > 0 && (
                    <span className="discount-tag">{item.discount}% Off</span>
                  )}
                </div>

                <button 
                  className={`btn wishlist-action-btn ${isAlreadyInCart(item.product_id) ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleAddToCart(item)}
                >
                  <FiShoppingCart /> {isAlreadyInCart(item.product_id) ? 'GO TO CART' : 'ADD TO CART'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
