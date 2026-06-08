import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiChevronDown, FiUser, FiPackage, FiHeart, FiLogOut, FiTag } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './Navbar.css';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-text">Harikart</span>
          <span className="navbar-logo-tagline">
            Delve Deeper<span style={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}> Plus</span> ⭐
          </span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="navbar-search-icon" onClick={handleSearch} />
        </form>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="navbar-user" ref={dropdownRef}>
              <button
                className="navbar-user-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <FiUser />
                {user?.name?.split(' ')[0]}
                <FiChevronDown />
              </button>

              {showDropdown && (
                <div className="navbar-dropdown">
                  <div className="navbar-dropdown-header">
                    <span>New customer?</span>
                    <Link to="/register" onClick={() => setShowDropdown(false)}>Sign Up</Link>
                  </div>
                  <Link to="/profile" className="navbar-dropdown-item" onClick={() => setShowDropdown(false)}>
                    <FiUser /> My Profile
                  </Link>
                  <Link to="/orders" className="navbar-dropdown-item" onClick={() => setShowDropdown(false)}>
                    <FiPackage /> Orders
                  </Link>
                  <Link to="/wishlist" className="navbar-dropdown-item" onClick={() => setShowDropdown(false)}>
                    <FiHeart /> Wishlist
                  </Link>
                  <Link to="/coupons" className="navbar-dropdown-item" onClick={() => setShowDropdown(false)}>
                    <FiTag /> Coupons
                  </Link>
                  <div className="navbar-dropdown-divider" />
                  <div className="navbar-dropdown-item" onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button className="navbar-login-btn" onClick={() => navigate('/login')}>
              Login
            </button>
          )}

          <Link to="/cart" className="navbar-cart">
            <FiShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && <span className="navbar-cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}