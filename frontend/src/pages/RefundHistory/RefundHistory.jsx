import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiClock, FiDollarSign, FiCheckCircle, FiCopy, FiTrendingUp } from 'react-icons/fi';
import './RefundHistory.css';

const API = 'http://localhost:5000/api';

export default function RefundHistory() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/refund-history`)
      .then(res => {
        setRefunds(res.data);
      })
      .catch(err => {
        console.error('Error fetching refunds:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatPrice = (p) => '₹' + Number(p).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCopy = (id, type) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const totalRefunded = refunds.reduce((acc, curr) => acc + Number(curr.amount), 0);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <h3>Loading Refund History...</h3>
      </div>
    );
  }

  return (
    <div className="refund-history-page">
      {/* Header section */}
      <div className="refund-header-section">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          <FiArrowLeft /> Back to Profile
        </button>
        <div className="title-area">
          <h2>Refund History</h2>
          <p>Track your automated refunds for cancelled orders</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="refund-summary-grid">
        <div className="summary-card">
          <div className="card-icon blue">
            <FiDollarSign />
          </div>
          <div className="card-info">
            <span className="card-label">Total Refunded</span>
            <h3 className="card-value">{formatPrice(totalRefunded)}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon green">
            <FiCheckCircle />
          </div>
          <div className="card-info">
            <span className="card-label">Successful Refunds</span>
            <h3 className="card-value">{refunds.length}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon orange">
            <FiClock />
          </div>
          <div className="card-info">
            <span className="card-label">Processing Time</span>
            <h3 className="card-value">Instant</h3>
          </div>
        </div>
      </div>

      {/* Refunds Table / List */}
      <div className="refund-content-box">
        {refunds.length === 0 ? (
          <div className="refund-empty-state">
            <span className="empty-icon">💸</span>
            <h3>No Refunds Found</h3>
            <p>
              Only orders that were paid online (Credit Card, Debit Card, UPI, etc.) and subsequently cancelled within the window will generate automatic refunds.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/orders')}>
              Go to My Orders
            </button>
          </div>
        ) : (
          <div className="refund-table-container">
            <table className="refund-table">
              <thead>
                <tr>
                  <th>Refund ID</th>
                  <th>Order ID</th>
                  <th>Payment Method</th>
                  <th>Refunded On</th>
                  <th>Amount</th>
                  <th>Refund TXN ID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map(refund => (
                  <tr key={refund.refund_id}>
                    <td>
                      <div className="copy-badge">
                        <span className="mono-text">{refund.refund_id}</span>
                        <button 
                          className="copy-btn" 
                          title="Copy Refund ID" 
                          onClick={() => handleCopy(refund.refund_id)}
                        >
                          <FiCopy className={copiedId === refund.refund_id ? 'copied' : ''} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="order-link-btn" 
                        onClick={() => navigate(`/order/${refund.order_id}`)}
                        style={{ color: 'var(--primary, #2563eb)', fontWeight: '700' }}
                      >
                        {'harikart-' + String(Number(refund.order_id) * 137 + 4829).padStart(6, '0')}
                      </button>
                    </td>
                    <td>
                      <span className="payment-method-tag">{refund.payment_method}</span>
                    </td>
                    <td>
                      <span className="date-text">{formatDate(refund.refunded_at)}</span>
                    </td>
                    <td>
                      <strong className="amount-text">{formatPrice(refund.amount)}</strong>
                    </td>
                    <td>
                      <div className="copy-badge">
                        <span className="mono-text font-sm">{refund.refund_transaction_id}</span>
                        <button 
                          className="copy-btn" 
                          title="Copy TXN ID" 
                          onClick={() => handleCopy(refund.refund_transaction_id)}
                        >
                          <FiCopy className={copiedId === refund.refund_transaction_id ? 'copied' : ''} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className="refund-status-pill success">
                        <span className="pill-dot"></span>
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
