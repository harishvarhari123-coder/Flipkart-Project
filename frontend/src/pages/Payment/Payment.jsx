import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import './Payment.css';
import '../Checkout/Checkout.css';

const API = 'http://localhost:5000/api';

// ── Same coupons list as Checkout.jsx ────────────────────────────────────────
const ALL_COUPONS = [
  { id: 1, code: 'HARI10',        type: 'percent',  discount: 10,  minOrder: 0,    maxDiscount: 500,  title: '10% Off on All Orders' },
  { id: 2, code: 'FREESHIP99',    type: 'shipping',  discount: 0,   minOrder: 499,  maxDiscount: null, title: 'Free Shipping' },
  { id: 3, code: 'WELCOME200',    type: 'flat',      discount: 200, minOrder: 999,  maxDiscount: 200,  title: '₹200 Off on First Order' },
  { id: 4, code: 'ELECTRONICS15', type: 'percent',  discount: 15,  minOrder: 1499, maxDiscount: 1500, title: '15% Off on Electronics' },
  { id: 5, code: 'FASHION25',     type: 'percent',  discount: 25,  minOrder: 799,  maxDiscount: 800,  title: '25% Off on Fashion' },
  { id: 6, code: 'GIFTYOU50',     type: 'cashback',  discount: 50,  minOrder: 299,  maxDiscount: 50,   title: '₹50 Cashback Gift' },
];

export default function Payment() {
  const [searchParams] = useSearchParams();
  const addressId  = searchParams.get('address_id');
  const buyNow     = searchParams.get('buy_now') === 'true';
  const productId  = searchParams.get('product_id');
  const quantity   = searchParams.get('quantity');
  const couponCode = searchParams.get('coupon');

  const { cartItems, getCartTotal, getCartSavings } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing]       = useState(false);
  const [buyNowProduct, setBuyNowProduct] = useState(null);

  const [cardNumber, setCardNumber]     = useState('');
  const [validThru, setValidThru]       = useState('');
  const [cvv, setCvv]                   = useState('');
  const [upiId, setUpiId]               = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [errors, setErrors]             = useState({});

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode]           = useState('');
  const [verificationError, setVerificationError]         = useState('');
  const [verifying, setVerifying]                         = useState(false);

  useEffect(() => {
    if (!addressId) navigate('/checkout');
    if (buyNow && productId) {
      axios.get(`${API}/products/${productId}`)
        .then(res => setBuyNowProduct(res.data))
        .catch(console.error);
    }
  }, [addressId, buyNow, productId, navigate]);

  const appliedCoupon = couponCode
    ? ALL_COUPONS.find(c => c.code.toLowerCase() === couponCode.toLowerCase()) || null
    : null;

  const getCouponDiscount = (baseTotal) => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') {
      const disc = Math.round((baseTotal * appliedCoupon.discount) / 100);
      return Math.min(disc, appliedCoupon.maxDiscount || disc);
    }
    if (appliedCoupon.type === 'flat' || appliedCoupon.type === 'cashback') {
      return appliedCoupon.discount;
    }
    if (appliedCoupon.type === 'shipping') return 0;
    return 0;
  };

  const validateForm = () => {
    const err = {};
    if (paymentMethod === 'Credit Card') {
      if (!cardNumber || cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
        err.cardNumber = 'Card number must be exactly 16 digits';
      }
      if (!validThru || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(validThru)) {
        err.validThru = 'Expiry must be in MM/YY format';
      } else {
        const [m, y]   = validThru.split('/').map(Number);
        const now          = new Date();
        const currentYear  = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        if (y < currentYear || (y === currentYear && m < currentMonth)) {
          err.validThru = 'Card has expired';
        }
      }
      if (!cvv || cvv.length !== 3 || !/^\d+$/.test(cvv)) {
        err.cvv = 'CVV must be 3 digits';
      }
    } else if (paymentMethod === 'UPI') {
      if (!upiId || !upiId.includes('@')) {
        err.upiId = 'Please enter a valid UPI ID (e.g. name@bank)';
      }
    } else if (paymentMethod === 'Net Banking') {
      if (!selectedBank || selectedBank === '') {
        err.selectedBank = 'Please select a bank to proceed';
      }
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const executeOrderPlacement = async () => {
    setProcessing(true);
    try {
      const payload = {
        address_id:     addressId,
        payment_method: paymentMethod,
        buy_now:        buyNow,
        final_amount:   finalAmount,
      };
      if (appliedCoupon) payload.coupon = appliedCoupon.code;
      if (buyNow) {
        payload.items = [{ product_id: productId, quantity: parseInt(quantity) || 1 }];
      }

      const res = await axios.post(`${API}/orders`, payload);

      setTimeout(() => {
        setProcessing(false);
        setShowVerificationModal(false);
        navigate(`/order-success?order_id=${res.data.order_id}`);
      }, 1500);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Payment failed');
      setProcessing(false);
      setVerifying(false);
    }
  };

  const handlePaymentSubmit = () => {
    if (!paymentMethod) return alert('Please select a payment method');
    if (!validateForm()) return;

    if (paymentMethod === 'Cash on Delivery') {
      executeOrderPlacement();
    } else {
      setShowVerificationModal(true);
      setVerificationCode('');
      setVerificationError('');
    }
  };

  const handleVerifyAndPay = () => {
    setVerificationError('');
    if (!verificationCode) {
      setVerificationError('Verification PIN/OTP is required');
      return;
    }
    if (paymentMethod === 'UPI') {
      if (verificationCode.length < 4) {
        setVerificationError('UPI PIN must be at least 4 digits');
        return;
      }
    } else {
      if (verificationCode.length !== 6) {
        setVerificationError('OTP must be exactly 6 digits');
        return;
      }
    }
    setVerifying(true);
    setTimeout(() => {
      executeOrderPlacement();
    }, 1200);
  };

  const formatPrice = (p) => '₹' + Number(p).toLocaleString('en-IN');

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
  const finalAmount    = Math.max(0, total + delivery - couponDiscount);

  const paymentMethods = [
    { id: 'UPI',              label: 'UPI' },
    { id: 'Credit Card',      label: 'Credit / Debit / ATM Card' },
    { id: 'Net Banking',      label: 'Net Banking' },
    { id: 'Cash on Delivery', label: 'Cash on Delivery' },
  ];

  // ── Button label logic ───────────────────────────────────────────────────────
  const getButtonLabel = () => {
    if (processing) return 'PROCESSING...';
    if (paymentMethod === 'Cash on Delivery') return 'PLACE ORDER';
    return `PAY ${formatPrice(finalAmount)}`;
  };

  return (
    <div className="checkout-page">
      <div className="checkout-main">
        <div className="checkout-step">
          <div className="checkout-step-header">
            <span className="step-number" style={{ background: 'var(--success)', color: 'white' }}>✓</span>
            <h3 style={{ color: 'var(--text-secondary)' }}>DELIVERY ADDRESS</h3>
          </div>
        </div>

        <div className="checkout-step">
          <div className="checkout-step-header">
            <span className="step-number" style={{ background: 'var(--success)', color: 'white' }}>✓</span>
            <h3 style={{ color: 'var(--text-secondary)' }}>ORDER SUMMARY</h3>
          </div>
        </div>

        <div className="checkout-step">
          <div className="checkout-step-header active">
            <span className="step-number">4</span>
            <h3>PAYMENT OPTIONS</h3>
          </div>
          <div className="checkout-step-content">
            <div className="payment-options">
              {paymentMethods.map(method => (
                <div key={method.id} className={`payment-method ${paymentMethod === method.id ? 'active' : ''}`}>
                  <div className="payment-method-header" onClick={() => setPaymentMethod(method.id)}>
                    <input type="radio" checked={paymentMethod === method.id} readOnly />
                    <span>{method.label}</span>
                  </div>
                  {paymentMethod === method.id && (
                    <div className="payment-method-content">
                      {method.id === 'Credit Card' && (
                        <>
                          <div className="payment-form-row">
                            <input
                              placeholder="Card Number (16 digits)"
                              maxLength="16"
                              value={cardNumber}
                              onChange={(e) => {
                                setCardNumber(e.target.value.replace(/\D/g, ''));
                                if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: '' }));
                              }}
                              className={errors.cardNumber ? 'has-error' : ''}
                            />
                            {errors.cardNumber && <span className="input-error-text">{errors.cardNumber}</span>}
                          </div>
                          <div className="payment-form-split">
                            <div style={{ flex: 1 }}>
                              <input
                                placeholder="Valid Thru (MM/YY)"
                                maxLength="5"
                                value={validThru}
                                onChange={(e) => {
                                  let val = e.target.value;
                                  if (val.length === 2 && !val.includes('/') && !e.nativeEvent.inputType?.includes('delete')) {
                                    val += '/';
                                  }
                                  setValidThru(val);
                                  if (errors.validThru) setErrors(prev => ({ ...prev, validThru: '' }));
                                }}
                                className={errors.validThru ? 'has-error' : ''}
                              />
                              {errors.validThru && <span className="input-error-text">{errors.validThru}</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                              <input
                                placeholder="CVV"
                                type="password"
                                maxLength="3"
                                value={cvv}
                                onChange={(e) => {
                                  setCvv(e.target.value.replace(/\D/g, ''));
                                  if (errors.cvv) setErrors(prev => ({ ...prev, cvv: '' }));
                                }}
                                className={errors.cvv ? 'has-error' : ''}
                              />
                              {errors.cvv && <span className="input-error-text">{errors.cvv}</span>}
                            </div>
                          </div>
                        </>
                      )}
                      {method.id === 'UPI' && (
                        <div className="payment-form-row">
                          <input
                            placeholder="Enter UPI ID (e.g. name@bank)"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              if (errors.upiId) setErrors(prev => ({ ...prev, upiId: '' }));
                            }}
                            className={errors.upiId ? 'has-error' : ''}
                          />
                          {errors.upiId && <span className="input-error-text">{errors.upiId}</span>}
                        </div>
                      )}
                      {method.id === 'Net Banking' && (
                        <div className="payment-form-row">
                          <select
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              border: errors.selectedBank
                                ? '1px solid var(--danger)'
                                : '1px solid var(--border-medium)',
                              borderRadius: 'var(--radius-sm)',
                            }}
                            value={selectedBank}
                            onChange={(e) => {
                              setSelectedBank(e.target.value);
                              if (errors.selectedBank) setErrors(prev => ({ ...prev, selectedBank: '' }));
                            }}
                          >
                            <option value="">Select Bank</option>
                            <option value="State Bank of India">State Bank of India</option>
                            <option value="HDFC Bank">HDFC Bank</option>
                            <option value="ICICI Bank">ICICI Bank</option>
                            <option value="Axis Bank">Axis Bank</option>
                          </select>
                          {errors.selectedBank && <span className="input-error-text">{errors.selectedBank}</span>}
                        </div>
                      )}

                      {/* ── Button: PLACE ORDER for COD, PAY ₹XX for others ── */}
                      <button
                        className="btn btn-secondary payment-pay-btn"
                        onClick={handlePaymentSubmit}
                        disabled={processing}
                      >
                        {getButtonLabel()}
                      </button>

                    </div>
                  )}
                </div>
              ))}
            </div>
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

        {appliedCoupon && (
          <div className="coupon-applied-strip" style={{ pointerEvents: 'none' }}>
            <div className="coupon-applied-left">
              <span className="coupon-applied-icon">🏷️</span>
              <div>
                <span className="coupon-applied-code">{appliedCoupon.code}</span>
                <span className="coupon-applied-title">{appliedCoupon.title}</span>
              </div>
            </div>
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
          <span>{formatPrice(finalAmount)}</span>
        </div>

        {appliedCoupon && couponDiscount > 0 && (
          <p className="coupon-saving-note">
            🎉 You save extra ₹{couponDiscount} with coupon!
          </p>
        )}
      </div>

      {/* ── Verification Overlay Modal ── */}
      {showVerificationModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal-card">
            <div className="payment-modal-header">
              <h3>
                {paymentMethod === 'UPI' ? 'Enter UPI PIN' : 'Enter OTP Verification'}
              </h3>
              <button
                className="close-modal-btn"
                onClick={() => setShowVerificationModal(false)}
                disabled={verifying || processing}
              >
                ✕
              </button>
            </div>
            <div className="payment-modal-body">
              <p className="payment-modal-sub">
                {paymentMethod === 'UPI'
                  ? 'Please enter your secret UPI PIN to authorize this transaction.'
                  : `A 6-digit OTP has been sent to your registered mobile and email. Please enter it below to confirm payment of ${formatPrice(finalAmount)}.`}
              </p>

              <div className="otp-input-container">
                <input
                  type="password"
                  placeholder={paymentMethod === 'UPI' ? 'UPI PIN' : 'Enter 6-Digit OTP'}
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className={`otp-field ${verificationError ? 'has-error' : ''}`}
                  disabled={verifying || processing}
                  autoFocus
                />
                {verificationError && <span className="otp-error-msg">{verificationError}</span>}
              </div>

              <div className="otp-simulation-hint">
                <strong>Simulation Hint:</strong> Enter any digits to proceed.
              </div>

              <button
                className="btn btn-secondary payment-verify-submit-btn"
                onClick={handleVerifyAndPay}
                disabled={verifying || processing}
              >
                {verifying || processing ? 'VERIFYING TRANSACTION...' : 'CONFIRM & PAY'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}