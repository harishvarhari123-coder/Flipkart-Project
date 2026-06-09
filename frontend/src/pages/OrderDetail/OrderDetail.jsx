import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiDownload, FiClock } from 'react-icons/fi';
import OrderTimeline from '../../components/OrderTimeline/OrderTimeline';
import './OrderDetail.css';

const API = 'https://flipkart-project-l2ex.onrender.com/api';
const CANCEL_WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds

function useCancelCountdown(orderedAt) {
  const [timeLeft, setTimeLeft] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!orderedAt) return;

    const compute = () => {
      const elapsed = Date.now() - new Date(orderedAt).getTime();
      const remaining = CANCEL_WINDOW_MS - elapsed;
      setTimeLeft(remaining > 0 ? remaining : 0);
    };

    compute();
    intervalRef.current = setInterval(compute, 1000);
    return () => clearInterval(intervalRef.current);
  }, [orderedAt]);

  return timeLeft;
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API}/orders/${id}`);
      setOrderData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setLoading(true);
      await axios.put(`${API}/orders/${id}/cancel`);
      alert('Order cancelled successfully!');
      await fetchOrder();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to cancel order');
      setLoading(false);
    }
  };

  // ── All hooks must be called before any early returns (Rules of Hooks) ──
  const timeLeft = useCancelCountdown(orderData?.ordered_at);

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;
  if (!orderData) return <div style={{ textAlign: 'center', padding: 50 }}>Order not found</div>;

  const { items, payment, ...order } = orderData;
  const formatPrice = (p) => '₹' + Number(p).toLocaleString('en-IN');
  const formatDate  = (date) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const isCancellable = ['Ordered', 'Confirmed'].includes(order.status);
  const canCancelNow  = isCancellable && timeLeft !== null && timeLeft > 0;

  const formatTimeLeft = (ms) => {
    if (ms === null || ms <= 0) return null;
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes      = Math.floor(totalSeconds / 60);
    const seconds      = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const formattedTime = formatTimeLeft(timeLeft);
  const isUrgent      = timeLeft !== null && timeLeft > 0 && timeLeft < 10 * 60 * 1000;

  // ── Coupon discount: derived from totals stored in DB ───────────────────────
  // Backend stores: total_amount (before coupon), delivery_charge, final_amount (after coupon)
  // So: coupon_discount = total_amount + delivery_charge - final_amount
  const rawCouponDiscount =
    Number(order.total_amount) +
    Number(order.delivery_charge) -
    Number(order.final_amount);

  // Only treat as real coupon discount if meaningfully positive (avoid float dust)
  const couponDiscount = rawCouponDiscount > 0.5 ? Math.round(rawCouponDiscount) : 0;

  // coupon_code comes from the backend if stored (order.coupon_code).
  // Falls back gracefully to null if backend doesn't expose it yet.
  const couponCode = order.coupon_code || null;

  return (
    <div className="order-detail-page">
      <div className="order-detail-header">
        <div>
          <h2>Order Details</h2>
          <p>
            Ordered on {formatDate(order.ordered_at)} | Order ID:{' '}
            <strong style={{ color: 'var(--primary, #2563eb)', fontWeight: '700' }}>
              {'harikart-' + String(Number(order.id) * 137 + 4829).padStart(6, '0')}
            </strong>
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {canCancelNow && (
              <button className="btn btn-danger" onClick={handleCancelOrder}>
                Cancel Order
              </button>
            )}
            <button className="btn btn-outline" onClick={() => navigate(`/invoice/${order.id}`)}>
              <FiDownload /> Download Invoice
            </button>
          </div>
          {isCancellable && formattedTime && (
            <div className={`cancel-timer ${isUrgent ? 'urgent' : ''}`}>
              <FiClock className="timer-icon" />
              <span>Cancel window closes in&nbsp;<strong>{formattedTime}</strong></span>
            </div>
          )}
          {isCancellable && timeLeft === 0 && (
            <div className="cancel-timer expired">
              <FiClock className="timer-icon" />
              <span>Cancellation window has expired</span>
            </div>
          )}
        </div>
      </div>

      <div className="order-detail-content">
        <div className="order-detail-main">
          <OrderTimeline order={order} />

          <div style={{ marginTop: 40 }}>
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>Items in this Order</h3>
            <div className="order-items-list">
              {items.map(item => (
                <div key={item.id} className="order-item-card">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="order-item-img"
                    onClick={() => navigate(`/product/${item.product_id}`)}
                  />
                  <div className="order-item-info">
                    <div
                      className="order-item-title"
                      onClick={() => navigate(`/product/${item.product_id}`)}
                    >
                      {item.product_name}
                    </div>
                    <div className="order-item-meta">
                      Seller: Harikart | Qty: {item.quantity}
                    </div>
                    <div className="order-item-price">{formatPrice(item.price)}</div>
                  </div>
                  {order.status === 'Delivered' && (
                    <div style={{ alignSelf: 'center', marginLeft: 'auto' }}>
                      <button 
                        className="btn btn-outline" 
                        style={{ fontSize: '13px', padding: '6px 12px', whiteSpace: 'nowrap' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${item.product_id}`);
                        }}
                      >
                        ★ Rate & Review
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="order-detail-sidebar">
          {/* ── Delivery Address ── */}
          <div className="info-box">
            <h3>Delivery Address</h3>
            <div className="info-text">
              <strong>{order.address_name}</strong>
              <div style={{ margin: '8px 0' }}>
                {order.address_line},<br />
                {order.locality && `${order.locality}, `}{order.city},<br />
                {order.state} - <strong>{order.pincode}</strong>
              </div>
              <div>Phone: +91 {order.address_phone}</div>
            </div>
          </div>

          {/* ── Payment Information ── */}
          <div className="info-box">
            <h3>Payment Information</h3>

            <div className="payment-summary-row">
              <span>Payment Method</span>
              <strong>{payment?.method || 'N/A'}</strong>
            </div>

            {payment?.transaction_id && (
              <div className="payment-summary-row">
                <span>Transaction ID</span>
                <span style={{ fontSize: 12 }}>{payment.transaction_id}</span>
              </div>
            )}

            <div className="payment-summary-row" style={{ marginTop: 16 }}>
              <span>Items Total</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>

            <div className="payment-summary-row">
              <span>Delivery Fee</span>
              <span>
                {Number(order.delivery_charge) === 0
                  ? <span style={{ color: 'var(--success, #16a34a)' }}>Free</span>
                  : formatPrice(order.delivery_charge)}
              </span>
            </div>

            {/* ── Coupon discount row (shown only when a coupon was applied) ── */}
            {couponDiscount > 0 && (
              <>
                {/* Coupon badge strip */}
                <div
                  className="payment-summary-row"
                  style={{
                    marginTop: 6,
                    background: 'var(--success-light, #f0fdf4)',
                    border: '1px dashed var(--success, #16a34a)',
                    borderRadius: 6,
                    padding: '6px 10px',
                    alignItems: 'flex-start',
                    gap: 8,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span>🏷️</span>
                    <span style={{ color: 'var(--success, #16a34a)', fontWeight: 600, fontSize: 13 }}>
                      Coupon Applied{couponCode ? `: ${couponCode}` : ''}
                    </span>
                  </span>
                  <span style={{ color: 'var(--success, #16a34a)', fontWeight: 600 }}>
                    − {formatPrice(couponDiscount)}
                  </span>
                </div>

                {/* Saving note */}
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--success, #16a34a)',
                    margin: '4px 0 8px',
                    textAlign: 'right',
                  }}
                >
                  🎉 You saved ₹{couponDiscount} with coupon!
                </p>
              </>
            )}

            <div className="payment-summary-total">
              <span>Grand Total</span>
              <span>{formatPrice(order.final_amount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}