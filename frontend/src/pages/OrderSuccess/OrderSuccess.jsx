import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) navigate('/');
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <div className="order-success-page">
      <div className="order-success-card">
        <div className="success-icon-container">
          <FiCheckCircle className="success-icon" />
        </div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for shopping with Harikart. Your order has been received.</p>
        
        <div className="order-id-box">
          <span>Order Reference ID</span>
          <strong>OD{orderId.padStart(10, '0')}</strong>
        </div>

        <div className="success-actions">
          <button className="btn btn-outline" onClick={() => navigate('/orders')}>
            Track Order
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
