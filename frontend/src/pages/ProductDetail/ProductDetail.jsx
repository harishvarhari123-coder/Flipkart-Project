import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiStar, FiShoppingCart, FiZap, FiTruck, FiShield, FiRefreshCw, FiHeart, FiShare2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './ProductDetail.css';

const API = 'https://flipkart-project-l2ex.onrender.com/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWish = isInWishlist(id);

  const handleWishlistToggle = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    toggleWishlist(id);
  };
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);

  const fetchProductAndReviews = async () => {
    try {
      setLoading(true);
      const [prodRes, revRes] = await Promise.all([
        axios.get(`${API}/products/${id}`),
        axios.get(`${API}/products/${id}/reviews`)
      ]);
      setProduct(prodRes.data);
      setReviews(revRes.data);
    } catch (err) {
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!newReviewRating) { showToast('Please select a rating', 'error'); return; }
    
    try {
      setSubmittingReview(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API}/products/${id}/reviews`, {
        rating: newReviewRating,
        review_text: newReviewText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Review submitted successfully!');
      setNewReviewText('');
      setNewReviewRating(5);
      fetchProductAndReviews();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error submitting review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const result = await addToCart(product.id, quantity);
    if (result.success) showToast('Added to cart!');
    else showToast(result.message, 'error');
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    navigate(`/checkout?buy_now=true&product_id=${product.id}&quantity=${quantity}`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: product?.name,
      text: `Check out ${product?.name} by ${product?.brand} at ₹${Number(product?.price).toLocaleString('en-IN')}!`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        showToast('Link copied to clipboard!');
        setTimeout(() => setShareCopied(false), 2500);
      }
    } catch (err) {
      // user cancelled
    }
  };

  const formatPrice = (p) => '₹' + Number(p).toLocaleString('en-IN');

  const deliveryDate = new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short'
  });

  if (loading) return <div className="loading-container"><div className="spinner" /><p>Loading...</p></div>;
  if (!product) return null;

  const specs = product.specifications ? (typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications) : {};

  return (
    <div className="product-detail-page">
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <div className="product-detail-container">
        <div className="product-detail-left">
          <div className="product-detail-image">
            <button 
              className={`product-detail-wishlist ${isWish ? 'active' : ''}`}
              onClick={handleWishlistToggle}
              title="Add to Wishlist"
            >
              <FiHeart fill={isWish ? 'var(--danger)' : 'transparent'} color={isWish ? 'var(--danger)' : 'var(--text-secondary)'} />
            </button>
            <button
              className="product-detail-share"
              onClick={handleShare}
              title={shareCopied ? 'Link copied!' : 'Share product'}
            >
              {shareCopied ? '✓' : <FiShare2 />}
            </button>
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-detail-actions">
          <button
  className="add-cart-btn"
  onClick={handleAddToCart}
  disabled={product.stock < 1}
>
  <FiShoppingCart />
  ADD TO CART
</button>
<button className="buy-now-btn" onClick={handleBuyNow} disabled={product.stock < 1}>
                <FiZap /> BUY NOW
            </button>
          </div>
        </div>

        <div className="product-detail-right">
          <div className="product-detail-breadcrumb">
            <Link to="/">Home</Link> › <Link to="/products">Products</Link> › {product.category_name} › {product.brand}
          </div>

          <div className="product-detail-brand">{product.brand}</div>
          <h1 className="product-detail-name">{product.name}</h1>

          <div className="product-detail-rating">
            <span className="product-detail-rating-badge">
              {product.rating} <FiStar />
            </span>
            <span className="product-detail-rating-count">
              {Number(product.rating_count).toLocaleString()} Ratings & Reviews
            </span>
          </div>

          <div className={`product-detail-stock ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
            {product.stock > 10 ? '✓ In Stock' : product.stock > 0 ? `⚠ Only ${product.stock} left` : '✕ Out of Stock'}
          </div>

          <div className="product-detail-price-section">
            <div className="product-detail-price">
              <span className="product-detail-current-price">{formatPrice(product.price)}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="product-detail-original-price">{formatPrice(product.original_price)}</span>
              )}
              {product.discount > 0 && (
                <span className="product-detail-discount">{product.discount}% off</span>
              )}
            </div>
            <p className="product-detail-tax">inclusive of all taxes</p>
          </div>

          {product.stock > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Quantity</h4>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>
          )}

          <div className="product-detail-offers">
            <h4>Available Offers</h4>
            <div className="offer-item">
              <span className="offer-tag">Bank</span>
              <span>10% off on HDFC Bank Credit Card, up to ₹1,500. On orders of ₹5,000 and above</span>
            </div>
            <div className="offer-item">
              <span className="offer-tag">Special</span>
              <span>Get extra ₹500 off on exchange (limited period)</span>
            </div>
            <div className="offer-item">
              <span className="offer-tag">No Cost EMI</span>
              <span>EMI starting from ₹{Math.round(product.price / 12).toLocaleString('en-IN')}/month</span>
            </div>
          </div>

          <div className="product-detail-delivery">
            <h4>Delivery</h4>
            <div className="delivery-info">
              <FiTruck />
              <span className="free">FREE Delivery</span>
              <span>by {deliveryDate}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 32, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>
              <FiRefreshCw style={{ fontSize: 24, marginBottom: 6, display: 'block', margin: '0 auto 6px' }} />
              7 Days Replacement
            </div>
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>
              <FiShield style={{ fontSize: 24, marginBottom: 6, display: 'block', margin: '0 auto 6px' }} />
              1 Year Warranty
            </div>
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>
              <FiTruck style={{ fontSize: 24, marginBottom: 6, display: 'block', margin: '0 auto 6px' }} />
              Free Delivery
            </div>
          </div>

          {Object.keys(specs).length > 0 && (
            <div className="product-detail-specs">
              <h4>Specifications</h4>
              <table className="specs-table">
                <tbody>
                  {Object.entries(specs).map(([key, val]) => (
                    <tr key={key}><td>{key}</td><td>{val}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="product-detail-description">
            <h4>Product Description</h4>
            <p>{product.description}</p>
          </div>

          <div className="product-reviews-section">
            <h4>Ratings & Reviews</h4>
            
            {isAuthenticated ? (
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <h5>Write a Review</h5>
                <div className="star-rating-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FiStar 
                      key={star} 
                      className={`star-icon ${newReviewRating >= star ? 'active' : ''}`}
                      onClick={() => setNewReviewRating(star)}
                      fill={newReviewRating >= star ? '#ffb400' : 'none'}
                      color={newReviewRating >= star ? '#ffb400' : '#ccc'}
                    />
                  ))}
                </div>
                <textarea 
                  value={newReviewText} 
                  onChange={e => setNewReviewText(e.target.value)} 
                  placeholder="What do you think about this product?" 
                  rows="3"
                  required
                ></textarea>
                <button type="submit" className="submit-review-btn" disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="login-to-review">
                <p>Please <Link to="/login">login</Link> to write a review.</p>
              </div>
            )}

            <div className="reviews-list">
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <span className="reviewer-name">{review.user_name}</span>
                      <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="review-rating">
                      {[1, 2, 3, 4, 5].map(star => (
                        <FiStar 
                          key={star} 
                          fill={review.rating >= star ? '#ffb400' : 'none'}
                          color={review.rating >= star ? '#ffb400' : '#ccc'}
                        />
                      ))}
                    </div>
                    <p className="review-text">{review.review_text}</p>
                  </div>
                ))
              ) : (
                <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
