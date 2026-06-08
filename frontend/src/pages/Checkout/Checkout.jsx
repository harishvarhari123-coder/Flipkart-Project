import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Checkout.css';
import '../Cart/Cart.css';

const API = 'http://localhost:5000/api';

// ── All available coupons (same as Coupons.jsx) ──────────────────────────────
const ALL_COUPONS = [
  { id: 1, code: 'HARI10',        type: 'percent',  discount: 10,  minOrder: 0,    maxDiscount: 500,  title: '10% Off on All Orders' },
  { id: 2, code: 'FREESHIP99',    type: 'shipping',  discount: 0,   minOrder: 499,  maxDiscount: null, title: 'Free Shipping' },
  { id: 3, code: 'WELCOME200',    type: 'flat',      discount: 200, minOrder: 999,  maxDiscount: 200,  title: '₹200 Off on First Order' },
  { id: 4, code: 'ELECTRONICS15', type: 'percent',  discount: 15,  minOrder: 1499, maxDiscount: 1500, title: '15% Off on Electronics' },
  { id: 5, code: 'FASHION25',     type: 'percent',  discount: 25,  minOrder: 799,  maxDiscount: 800,  title: '25% Off on Fashion' },
  { id: 6, code: 'GIFTYOU50',     type: 'cashback',  discount: 50,  minOrder: 299,  maxDiscount: 50,   title: '₹50 Cashback Gift' },
];

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const buyNow    = searchParams.get('buy_now') === 'true';
  const productId = searchParams.get('product_id');
  const quantity  = searchParams.get('quantity');

  const { user }                         = useAuth();
  const { cartItems, getCartTotal, getCartSavings } = useCart();
  const navigate                         = useNavigate();

  const [addresses, setAddresses]       = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddress, setShowNewAddress]   = useState(false);
  const [loading, setLoading]           = useState(true);
  const [buyNowProduct, setBuyNowProduct] = useState(null);

  // ── Coupon state ────────────────────────────────────────────────────────────
  const [couponInput, setCouponInput]   = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponStatus, setCouponStatus] = useState(null); // { type: 'success'|'error', msg: '' }
  const [showCouponBox, setShowCouponBox] = useState(false);

  const [formData, setFormData] = useState({
    name: '', phone: '', pincode: '', locality: '',
    address_line: '', city: '', state: '', landmark: '', address_type: 'Home'
  });

  useEffect(() => {
    fetchAddresses();
    if (buyNow && productId) {
      axios.get(`${API}/products/${productId}`)
        .then(res => setBuyNowProduct(res.data))
        .catch(console.error);
    } else if (!buyNow && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [buyNow, productId, cartItems.length, navigate]);

  const fetchAddresses = () => {
    axios.get(`${API}/addresses`)
      .then(res => {
        setAddresses(res.data);
        if (res.data.length > 0) setSelectedAddress(res.data[0].id);
        else setShowNewAddress(true);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/addresses`, formData);
      setShowNewAddress(false);
      fetchAddresses();
      setSelectedAddress(res.data.id);
      setFormData({ name: '', phone: '', pincode: '', locality: '', address_line: '', city: '', state: '', landmark: '', address_type: 'Home' });
    } catch (err) {
      console.error(err);
      alert('Failed to save address');
    }
  };

  // ── Coupon apply logic ──────────────────────────────────────────────────────
  const handleApplyCoupon = () => {
    const found = ALL_COUPONS.find(
      c => c.code.toLowerCase() === couponInput.trim().toLowerCase()
    );

    if (!found) {
      setCouponStatus({ type: 'error', msg: '❌ Invalid coupon code. Please check and try again.' });
      return;
    }

    // Calculate base total for min order check (before coupon)
    const baseTotal = buyNow
      ? (buyNowProduct ? buyNowProduct.price * (parseInt(quantity) || 1) : 0)
      : getCartTotal();

    if (baseTotal < found.minOrder) {
      setCouponStatus({ type: 'error', msg: `❌ Minimum order of ₹${found.minOrder} required for this coupon.` });
      return;
    }

    setAppliedCoupon(found);
    setCouponStatus({ type: 'success', msg: `✅ "${found.code}" applied! ${found.title}` });
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponStatus(null);
    setCouponInput('');
  };

  // ── Calculate coupon discount amount ───────────────────────────────────────
  const getCouponDiscount = (baseTotal) => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') {
      const disc = Math.round((baseTotal * appliedCoupon.discount) / 100);
      return Math.min(disc, appliedCoupon.maxDiscount || disc);
    }
    if (appliedCoupon.type === 'flat' || appliedCoupon.type === 'cashback') {
      return appliedCoupon.discount;
    }
    if (appliedCoupon.type === 'shipping') {
      return 0; // handled separately in delivery
    }
    return 0;
  };

  const proceedToPayment = () => {
    if (!selectedAddress) return alert('Please select a delivery address');
    let url = `/payment?address_id=${selectedAddress}`;
    if (appliedCoupon) url += `&coupon=${appliedCoupon.code}`;
    if (buyNow) url += `&buy_now=true&product_id=${productId}&quantity=${quantity}`;
    navigate(url);
  };

  const formatPrice = (p) => '₹' + Number(p).toLocaleString('en-IN');

  // ── Totals ──────────────────────────────────────────────────────────────────
  let total = 0, savings = 0;
  if (buyNow) {
    if (buyNowProduct) {
      const qty = parseInt(quantity) || 1;
      total   = buyNowProduct.price * qty;
      savings = ((buyNowProduct.original_price || buyNowProduct.price) - buyNowProduct.price) * qty;
    }
  } else {
    total   = getCartTotal();
    savings = getCartSavings();
  }

  const couponDiscount = getCouponDiscount(total);
  const freeShipping   = appliedCoupon?.type === 'shipping';
  const delivery       = (total >= 500 || freeShipping) ? 0 : 40;
  const finalTotal     = Math.max(0, total + delivery - couponDiscount);

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div className="checkout-page">
      <div className="checkout-main">

        {/* Step 1: Login */}
        <div className="checkout-step">
          <div className="checkout-step-header">
            <span className="step-number">1</span>
            <div>
              <h3 style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 4 }}>LOGIN ✓</h3>
              <p style={{ fontSize: 14, fontWeight: 600 }}>
                {user?.name}
                <span style={{ fontWeight: 400, marginLeft: 10 }}>+91 {user?.phone || 'N/A'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Delivery Address */}
        <div className="checkout-step">
          <div className="checkout-step-header active">
            <span className="step-number">2</span>
            <h3>DELIVERY ADDRESS</h3>
          </div>
          <div className="checkout-step-content" style={{ background: '#f5faff' }}>
            {!showNewAddress && (
              <div className="address-list">
                {addresses.map(addr => (
                  <div
                    key={addr.id}
                    className={`address-card ${selectedAddress === addr.id ? 'selected' : ''}`}
                    onClick={() => setSelectedAddress(addr.id)}
                  >
                    <input type="radio" checked={selectedAddress === addr.id} readOnly />
                    <div className="address-details">
                      <div className="address-name">
                        {addr.name} {addr.phone}
                        <span className="address-type">{addr.address_type}</span>
                      </div>
                      <div className="address-text">
                        {addr.address_line}, {addr.locality && `${addr.locality}, `}
                        {addr.city}, {addr.state} - <span style={{ fontWeight: 600 }}>{addr.pincode}</span>
                      </div>
                      {selectedAddress === addr.id && (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '12px 32px' }}
                          onClick={proceedToPayment}
                        >
                          DELIVER HERE
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 16 }}>
                  <button className="btn btn-outline" onClick={() => setShowNewAddress(true)}>
                    + Add a new address
                  </button>
                </div>
              </div>
            )}

            {showNewAddress && (
              <form className="address-form" onSubmit={handleAddressSubmit}>
                <h4 style={{ marginBottom: 16, color: 'var(--primary)' }}>ADD A NEW ADDRESS</h4>
                <div className="form-row">
                  <div className="form-group">
                    <input placeholder="Name" required value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })} autoFocus />
                  </div>
                  <div className="form-group">
                    <input placeholder="10-digit mobile number" required pattern="[0-9]{10}"
                      value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <input placeholder="Pincode" required value={formData.pincode}
                      onChange={e => setFormData({ ...formData, pincode: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <input placeholder="Locality" value={formData.locality}
                      onChange={e => setFormData({ ...formData, locality: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group" style={{ flex: '1 1 100%' }}>
                    <textarea placeholder="Address (Area and Street)" required rows="3"
                      value={formData.address_line}
                      onChange={e => setFormData({ ...formData, address_line: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <input placeholder="City/District/Town" required value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <input placeholder="State" required value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <input placeholder="Landmark (Optional)" value={formData.landmark}
                      onChange={e => setFormData({ ...formData, landmark: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <button type="submit" className="btn btn-secondary">SAVE AND DELIVER HERE</button>
                  {addresses.length > 0 && (
                    <button type="button" className="btn btn-outline" onClick={() => setShowNewAddress(false)}>
                      CANCEL
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Step 3: Order Summary */}
        <div className="checkout-step">
          <div className="checkout-step-header">
            <span className="step-number">3</span>
            <h3 style={{ color: 'var(--text-secondary)' }}>ORDER SUMMARY</h3>
          </div>
        </div>

        {/* Step 4: Payment */}
        <div className="checkout-step">
          <div className="checkout-step-header">
            <span className="step-number">4</span>
            <h3 style={{ color: 'var(--text-secondary)' }}>PAYMENT OPTIONS</h3>
          </div>
        </div>

      </div>

      {/* ── Price Summary ── */}
      <div className="cart-summary">
        <div className="cart-summary-header">Price Details</div>

        <div className="cart-summary-row">
          <span>Price ({buyNow ? 1 : cartItems.length} items)</span>
          <span>{formatPrice(total + savings)}</span>
        </div>

        <div className="cart-summary-row savings">
          <span>Discount</span>
          <span>− {formatPrice(savings)}</span>
        </div>

        <div className="cart-summary-row">
          <span>Delivery Charges</span>
          <span style={{ color: delivery === 0 ? 'var(--success)' : 'inherit' }}>
            {delivery === 0 ? 'Free' : formatPrice(delivery)}
          </span>
        </div>

        {/* ── Coupon Section ── */}
        {!appliedCoupon ? (
          <div className="coupon-section">
            <div
              className="coupon-toggle-row"
              onClick={() => setShowCouponBox(!showCouponBox)}
            >
              <span className="coupon-toggle-label">🏷️ Have a coupon?</span>
              <span className="coupon-toggle-arrow">{showCouponBox ? '▲' : '▼'}</span>
            </div>

            {showCouponBox && (
              <div className="coupon-input-row">
                <input
                  className="coupon-input"
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponStatus(null); }}
                  onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                />
                <button className="coupon-apply-btn" onClick={handleApplyCoupon}>
                  APPLY
                </button>
              </div>
            )}

            {couponStatus && (
              <p className={`coupon-status-msg ${couponStatus.type}`}>
                {couponStatus.msg}
              </p>
            )}
          </div>
        ) : (
          /* Applied coupon strip */
          <div className="coupon-applied-strip">
            <div className="coupon-applied-left">
              <span className="coupon-applied-icon">🏷️</span>
              <div>
                <span className="coupon-applied-code">{appliedCoupon.code}</span>
                <span className="coupon-applied-title">{appliedCoupon.title}</span>
              </div>
            </div>
            <button className="coupon-remove-btn" onClick={handleRemoveCoupon}>✕ Remove</button>
          </div>
        )}

        {appliedCoupon && couponDiscount > 0 && (
          <div className="cart-summary-row savings">
            <span>Coupon Discount ({appliedCoupon.code})</span>
            <span>− {formatPrice(couponDiscount)}</span>
          </div>
        )}

        {appliedCoupon?.type === 'shipping' && (
          <div className="cart-summary-row savings">
            <span>Coupon ({appliedCoupon.code})</span>
            <span>Free Shipping Applied ✅</span>
          </div>
        )}

        <hr className="cart-summary-divider" />

        <div className="cart-summary-total">
          <span>Total Payable</span>
          <span>{formatPrice(finalTotal)}</span>
        </div>

        {appliedCoupon && couponDiscount > 0 && (
          <p className="coupon-saving-note">
            🎉 You save extra ₹{couponDiscount} with coupon!
          </p>
        )}
      </div>
    </div>
  );
}