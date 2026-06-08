import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiTrash2 } from 'react-icons/fi';
import './Orders.css';

const API = 'http://localhost:5000/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/orders`)
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteOrder = async (orderId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to remove this order from your history?')) return;
    try {
      await axios.delete(`${API}/orders/${orderId}`);
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to remove order from history');
    }
  };

  const formatPrice = (p) => '₹' + Number(p).toLocaleString('en-IN');
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: 60, display: 'block', marginBottom: 16 }}>📦</span>
          <h3>No Orders Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8, marginBottom: 24 }}>Looks like you haven't placed any orders yet.</p>
          <button className="shop-btn" onClick={() => navigate('/products')}>Start Shopping</button>
        </div>
      ) : (
        <div className="order-list">
          {orders.map(order => (
            <div key={order.id} className="order-card" onClick={() => navigate(`/order/${order.id}`)}>
              <button 
                className="delete-order-btn" 
                onClick={(e) => handleDeleteOrder(order.id, e)} 
                title="Remove from History"
              >
                <FiTrash2 />
              </button>
              <div className="order-card-image">
                <img src={order.first_image || 'https://via.placeholder.com/80'} alt="Product" />
              </div>
              <div className="order-card-details">
                <div className="order-card-title">
                  {order.first_product} {order.item_count > 1 ? `& ${order.item_count - 1} more items` : ''}
                </div>
                <div className="order-card-meta">
                  Ordered on {formatDate(order.ordered_at)}
                </div>
              </div>
              <div className="order-card-price">
                {formatPrice(order.final_amount)}
              </div>
              <div className="order-card-status">
                <span className={`status-dot ${order.status}`}></span>
                {order.status === 'Delivered' 
                  ? `Delivered on ${formatDate(order.delivered_at || order.estimated_delivery)}` 
                  : order.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
