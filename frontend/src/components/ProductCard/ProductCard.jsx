import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiHeart, FiShare2 } from 'react-icons/fi';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWish = isInWishlist(product.id);
  const [shareCopied, setShareCopied] = useState(false);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleWishlist(product.id);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/product/${product.id}`;
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} by ${product.brand} at ₹${Number(product.price).toLocaleString('en-IN')}!`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch (err) {
      // user cancelled or error
    }
  };

  const formatPrice = (price) => {
    return '₹' + Number(price).toLocaleString('en-IN');
  };

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="product-card-image">
        {product.discount > 0 && (
          <span className="product-card-discount">{product.discount}% OFF</span>
        )}
        <button 
          className={`product-card-wishlist ${isWish ? 'active' : ''}`}
          onClick={handleWishlistClick}
          type="button"
          title="Add to Wishlist"
        >
          <FiHeart fill={isWish ? 'var(--danger)' : 'transparent'} color={isWish ? 'var(--danger)' : 'var(--text-secondary)'} />
        </button>
        <button
          className="product-card-share"
          onClick={handleShare}
          type="button"
          title={shareCopied ? 'Link copied!' : 'Share product'}
        >
          {shareCopied ? '✓' : <FiShare2 />}
        </button>
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-card-info">
        <span className="product-card-brand">{product.brand}</span>
        <h3 className="product-card-name">{product.name}</h3>
        {product.rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span className="product-card-rating">
              {product.rating} <FiStar />
            </span>
            <span className="product-card-rating-count">
              ({Number(product.rating_count).toLocaleString()})
            </span>
          </div>
        )}
        <div className="product-card-price">
          <span className="product-card-current-price">{formatPrice(product.price)}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="product-card-original-price">{formatPrice(product.original_price)}</span>
          )}
          {product.discount > 0 && (
            <span className="product-card-discount-text">{product.discount}% off</span>
          )}
        </div>
        <p className="product-card-delivery">
          Free delivery by <strong>{new Date(Date.now() + 4 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</strong>
        </p>
      </div>
    </div>
  );
}
