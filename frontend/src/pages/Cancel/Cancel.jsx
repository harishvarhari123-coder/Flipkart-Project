import React, { useState, useEffect, useRef } from "react";
import "./Cancel.css";

const policies = [
  {
    icon: "🔄",
    title: "Order Cancellation",
    points: [
      "Cancel orders within 1 hour of placement",
      "Instant refund initiation for prepaid orders",
      "No cancellation charges applied",
      "Easy cancellation from 'My Orders' section"
    ]
  },
  {
    icon: "📦",
    title: "Return Policy",
    points: [
      "7-day return window from delivery date",
      "Free pickup for return items",
      "Product must be unused with original tags",
      "Full refund or replacement available"
    ]
  },
  {
    icon: "💰",
    title: "Refund Process",
    points: [
      "Refunds processed within 5-7 business days",
      "Amount credited to original payment method",
      "Instant wallet refund option available",
      "Email notifications at every step"
    ]
  }
];

const faqs = [
  {
    q: "Can I cancel my order after it's shipped?",
    a: "Once the order is shipped, cancellation is not possible. However, you can refuse delivery at the doorstep or initiate a return after receiving the product within 7 days."
  },
  {
    q: "How do I cancel my order?",
    a: "Go to 'My Orders', select the order you want to cancel, click on 'Cancel Order', choose a reason, and confirm. You'll receive a cancellation confirmation email immediately."
  },
  {
    q: "What items are eligible for return?",
    a: "Most items can be returned within 7 days except perishables, fresh produce, intimate wear, personal care items, and products with tampered packaging."
  },
  {
    q: "How do I request a return?",
    a: "Visit 'My Orders', select the item, click 'Return', provide a reason, and submit. Our delivery partner will schedule a pickup within 2-3 business days at no cost."
  },
  {
    q: "When will I receive my refund?",
    a: "After we receive and verify the returned product (2-3 days), refunds are processed within 5-7 business days to your original payment method. Wallet refunds are instant."
  },
  {
    q: "Can I exchange a product?",
    a: "Yes, exchanges are available for size/color variations. Request an exchange through 'My Orders'. We'll pick up the old product and deliver the new one simultaneously."
  },
  {
    q: "What if I receive a damaged product?",
    a: "If you receive a damaged or defective product, report it within 24 hours through 'My Orders' with photos. We'll arrange immediate replacement or full refund including shipping charges."
  },
  {
    q: "Are there any return charges?",
    a: "Returns are completely free if initiated within the return window. We arrange free pickup at your doorstep. However, if the product is damaged due to misuse, return may not be accepted."
  }
];

const nonReturnableCategories = [
  "🥬 Fresh Produce & Vegetables",
  "🍞 Perishable Food Items",
  "🧴 Personal Care & Hygiene Products",
  "👙 Intimate Apparel & Innerwear",
  "💊 Medicines & Healthcare Products",
  "📱 Activated Electronics (SIM, Gift Cards)"
];

export default function CancellationReturns() {
  const [openFaq, setOpenFaq] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Auto-focus the container when component mounts
    if (containerRef.current) {
      containerRef.current.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="cancel-page" ref={containerRef} tabIndex={0}>
      {/* Hero Section */}
      <div className="cancel-hero">
        <div className="hero-badge">
          <span className="badge-icon">✓</span>
          <span className="badge-text">HASSLE-FREE POLICY</span>
        </div>
        <h1 className="cancel-title">Cancellation & Returns</h1>
        <p className="cancel-subtitle">
          We're committed to your satisfaction. Cancel or return with ease - no questions asked.
        </p>
      </div>

      {/* Policy Cards Section */}
      <section className="policy-section">
        <div className="section-header">
          <h2 className="section-title">Our Policies at a Glance</h2>
          <div className="section-divider"></div>
        </div>

        <div className="policy-grid">
          {policies.map((policy, index) => (
            <div className="policy-card" key={index}>
              <div className="policy-icon">{policy.icon}</div>
              <h3 className="policy-title">{policy.title}</h3>
              <ul className="policy-points">
                {policy.points.map((point, i) => (
                  <li key={i}>
                    <span className="check-mark">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How to Cancel/Return Section */}
      <section className="process-section">
        <div className="section-header">
          <h2 className="section-title">Easy Steps to Cancel or Return</h2>
          <div className="section-divider"></div>
        </div>

        <div className="process-container">
          <div className="process-column">
            <h3 className="process-heading">
              <span className="process-icon">🚫</span>
              Cancel Order
            </h3>
            <div className="process-steps">
              <div className="process-step">
                <div className="step-num">1</div>
                <div className="step-text">
                  <strong>Go to My Orders</strong>
                  <p>Find the order you want to cancel</p>
                </div>
              </div>
              <div className="process-step">
                <div className="step-num">2</div>
                <div className="step-text">
                  <strong>Click Cancel Order</strong>
                  <p>Select a cancellation reason</p>
                </div>
              </div>
              <div className="process-step">
                <div className="step-num">3</div>
                <div className="step-text">
                  <strong>Confirm Cancellation</strong>
                  <p>Receive instant confirmation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="process-divider"></div>

          <div className="process-column">
            <h3 className="process-heading">
              <span className="process-icon">📦</span>
              Return Order
            </h3>
            <div className="process-steps">
              <div className="process-step">
                <div className="step-num">1</div>
                <div className="step-text">
                  <strong>Select Return</strong>
                  <p>Choose item from My Orders</p>
                </div>
              </div>
              <div className="process-step">
                <div className="step-num">2</div>
                <div className="step-text">
                  <strong>Schedule Pickup</strong>
                  <p>We'll collect from your doorstep</p>
                </div>
              </div>
              <div className="process-step">
                <div className="step-num">3</div>
                <div className="step-text">
                  <strong>Get Refund</strong>
                  <p>Money back in 5-7 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Non-Returnable Items Section */}
      <section className="non-returnable-section">
        <div className="section-header">
          <h2 className="section-title">Non-Returnable Items</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">For hygiene and safety reasons, the following items cannot be returned</p>
        </div>

        <div className="non-returnable-grid">
          {nonReturnableCategories.map((category, index) => (
            <div className="non-returnable-item" key={index}>
              {category}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-header">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="section-divider"></div>
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div 
              className={`faq-item ${openFaq === index ? 'active' : ''}`} 
              key={index}
            >
              <button 
                className="faq-question"
                onClick={() => toggleFaq(index)}
                aria-expanded={openFaq === index}
              >
                <span className="question-text">{faq.q}</span>
                <span className="toggle-icon">
                  {openFaq === index ? '−' : '+'}
                </span>
              </button>
              <div className={`faq-answer ${openFaq === index ? 'show' : ''}`}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="support-section">
        <div className="support-card">
          <div className="support-icon">💬</div>
          <h3 className="support-title">Need More Help?</h3>
          <p className="support-desc">
            Our customer support team is available 24/7 to assist you with 
            cancellations, returns, and refunds.
          </p>
          <div className="support-actions">
            <a href="mailto:support@harikart.com" className="support-btn primary">
              <span>📧</span> Email Support
            </a>
            <a href="tel:1800-123-4567" className="support-btn secondary">
              <span>📞</span> Call 1800-123-4567
            </a>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="cancel-footer">
        <p className="footer-text">
          <strong>Last Updated:</strong> May 2026 | This policy applies to all orders placed on Harikart. 
          We reserve the right to modify these terms. Check back regularly for updates.
        </p>
      </div>
    </div>
  );
}