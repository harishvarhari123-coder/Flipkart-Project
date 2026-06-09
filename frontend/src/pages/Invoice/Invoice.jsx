import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiPrinter } from 'react-icons/fi';
import './Invoice.css';
import Logo from '../../assets/logo.jpeg';

const API = 'https://flipkart-project-l2ex.onrender.com/api';

export default function Invoice() {
  const { orderId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/invoices/${orderId}`)
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;
  if (!data) return <div style={{ textAlign: 'center', padding: 50 }}>Invoice not found</div>;

  const { invoice, items, order, user } = data;
  const formatPrice = (p) => '₹' + Number(p).toLocaleString('en-IN');
  const formatDate  = (date) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const rawCouponDiscount =
    Number(invoice.subtotal) +
    Number(invoice.delivery_charge) -
    Number(invoice.total);
  const couponDiscount = rawCouponDiscount > 0.5 ? Math.round(rawCouponDiscount) : 0;
  const couponCode     = order.coupon_code || null;

  return (
    <div style={{ padding: '20px 0' }}>
      <div className="invoice-page">
        {/* ── Header ── */}
        <div className="invoice-header">
          <div className="invoice-company">
            <div className="invoice-logo">
              <img src={Logo} alt="Harikart Logo" className="invoice-logo-img" />
              Harikart
            </div>
            <div className="invoice-company-details">
              <p>No. 11,Harikart Internet Private Limited,</p>
              <p>brindavanam colony,</p>
              <p>Outer Ring Road, Cuddalore,607109</p>
              <p>📞 +91 98765 43210</p>
              <p>✉ support@harikart.in</p>
            </div>
          </div>
          <div className="invoice-title">
            <h1>Tax Invoice</h1>
            <p>Original for Recipient</p>
          </div>
        </div>

        {/* ── Billed To / Invoice Details ── */}
        <div className="invoice-info-grid">
          <div className="invoice-section">
            <h3>Billed To</h3>
            <p>
              <strong>{user.name}</strong><br />
              {order.address_line}<br />
              {order.locality && `${order.locality}, `}{order.city}<br />
              {order.state} - {order.pincode}<br />
              Ph: +91 {order.address_phone}
            </p>
          </div>
          <div className="invoice-section" style={{ textAlign: 'right' }}>
            <h3>Invoice Details</h3>
            <p>
              Invoice No: <strong>{invoice.invoice_number}</strong><br />
              Date: {formatDate(invoice.created_at)}<br />
              Order ID:{' '}
              <strong style={{ color: 'var(--primary, #2563eb)', fontWeight: '700' }}>
                {'harikart-' + String(Number(order.id) * 137 + 4829).padStart(6, '0')}
              </strong><br />
              Order Date: {formatDate(order.ordered_at)}
            </p>
          </div>
        </div>

        {/* ── Items Table ── */}
        <table className="invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Description</th>
              <th>Qty</th>
              <th>Gross Amount</th>
              <th>Tax (18%)</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const basePrice = item.price / 1.18;
              const itemTax   = item.price - basePrice;
              return (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(basePrice * item.quantity)}</td>
                  <td>{formatPrice(itemTax  * item.quantity)}</td>
                  <td>{formatPrice(item.price * item.quantity)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* ── Totals ── */}
        <div className="invoice-totals">
          <div className="invoice-total-row">
            <span>Subtotal:</span>
            <span>{formatPrice(invoice.subtotal)}</span>
          </div>

          <div className="invoice-total-row">
            <span>Shipping Charge:</span>
            <span>
              {Number(invoice.delivery_charge) === 0
                ? <span style={{ color: 'var(--success, #16a34a)' }}>Free</span>
                : formatPrice(invoice.delivery_charge)}
            </span>
          </div>

          <div className="invoice-total-row">
            <span>Tax Amount:</span>
            <span>{formatPrice(invoice.tax)}</span>
          </div>

          {couponDiscount > 0 && (
            <div
              className="invoice-total-row"
              style={{
                background: 'var(--success-light, #f0fdf4)',
                border: '1px dashed var(--success, #16a34a)',
                borderRadius: 6,
                padding: '6px 10px',
                margin: '4px 0',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🏷️</span>
                <span style={{ color: 'var(--success, #16a34a)', fontWeight: 600 }}>
                  Coupon Discount{couponCode ? ` (${couponCode})` : ''}:
                </span>
              </span>
              <span style={{ color: 'var(--success, #16a34a)', fontWeight: 600 }}>
                − {formatPrice(couponDiscount)}
              </span>
            </div>
          )}

          <div className="invoice-total-row grand">
            <span>Grand Total:</span>
            <span>{formatPrice(invoice.total)}</span>
          </div>

          {couponDiscount > 0 && (
            <div
              style={{
                textAlign: 'right',
                fontSize: 12,
                color: 'var(--success, #16a34a)',
                marginTop: 4,
              }}
            >
              🎉 You saved ₹{couponDiscount} with coupon{couponCode ? ` ${couponCode}` : ''}!
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="invoice-footer">
          <p>This is a computer generated invoice and does not require a physical signature.</p>
          <p>Returns Policy: Valid for 7 days from the date of delivery.</p>
        </div>

        {/* ── Print Button — bottom of invoice ── */}
        <div className="print-btn-container">
          <button className="invoice-print-btn" onClick={() => window.print()}>
            <FiPrinter style={{ marginRight: 8, fontSize: 16 }} />
            Print Invoice
          </button>
        </div>

      </div>
    </div>
  );
}