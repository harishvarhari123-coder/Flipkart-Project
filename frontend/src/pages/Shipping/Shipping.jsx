import React, { useEffect, useRef, useState } from "react";
import "./Shipping.css";

const deliveryOptions = [
  { icon: "⚡", title: "Express Delivery", desc: "Within 2 hours", price: "₹49", highlight: true, id: "express" },
  { icon: "🚚", title: "Standard Delivery", desc: "Same day or next day", price: "₹29", highlight: false, id: "standard" },
  { icon: "🎁", title: "Free Delivery", desc: "On orders above ₹499", price: "Free", highlight: false, id: "free" },
];

const steps = [
  { step: "01", label: "Order Placed" },
  { step: "02", label: "Packed & Ready" },
  { step: "03", label: "Out for Delivery" },
  { step: "04", label: "Delivered" },
];

const deliveryDetails = {
  express: {
    icon: "⚡",
    title: "Express Delivery",
    price: "₹49",
    badge: "Fastest Option",
    points: [
      "Delivered within 2 hours of placing the order.",
      "Available from 7 AM to 10 PM, 7 days a week.",
      "Real-time GPS tracking on the app.",
      "Applicable for orders placed before 8 PM.",
      "Available in select pincodes — check at checkout.",
    ],
    note: "Express delivery is subject to rider availability in your area.",
  },
  standard: {
    icon: "🚚",
    title: "Standard Delivery",
    price: "₹29",
    badge: "Most Popular",
    points: [
      "Same-day delivery for orders placed before 2 PM.",
      "Next-day delivery for orders placed after 2 PM.",
      "Available across all serviceable pincodes.",
      "SMS & email updates at every stage.",
      "Delivery window: 8 AM – 9 PM.",
    ],
    note: "Standard delivery may take up to 48 hours during peak seasons or holidays.",
  },
  free: {
    icon: "🎁",
    title: "Free Delivery",
    price: "Free",
    badge: "Best Value",
    points: [
      "Free on all orders above ₹499.",
      "Same delivery speed as Standard Delivery.",
      "Automatically applied at checkout — no coupon needed.",
      "Available sitewide on eligible orders.",
      "Can be combined with other offers.",
    ],
    note: "Free delivery threshold may vary during special sale events.",
  },
};

// ── Detail Page ──────────────────────────────────────────
function DeliveryDetail({ id, onBack }) {
  const backRef = useRef(null);
  const detail = deliveryDetails[id];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (backRef.current) backRef.current.focus();
  }, []);

  return (
    <div className="ship-page">
      <section className="ship-hero detail-hero">
        <div className="ship-hero-inner">
          <span className="ship-eyebrow">Delivery Policy</span>
          <div className="detail-hero-icon">{detail.icon}</div>
          <h1 className="ship-title">{detail.title}</h1>
          <span className="detail-badge">{detail.badge}</span>
          <p className="detail-price">{detail.price}</p>
        </div>
      </section>

      <section className="ship-section detail-section">
        <button className="back-btn" ref={backRef} onClick={onBack}>
          ← Back to Shipping
        </button>

        <h2 className="ship-section-title">What's Included</h2>
        <ul className="detail-list">
          {detail.points.map((p, i) => (
            <li className="detail-list-item" key={i}>
              <span className="detail-check">✓</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <div className="detail-note">
          <span className="note-icon">ℹ️</span>
          <p>{detail.note}</p>
        </div>

        <div className="detail-cta-row">
          <a href="#checkout" className="detail-cta">
            Select {detail.title} at Checkout
          </a>
        </div>
      </section>
    </div>
  );
}

// ── Main Shipping Page ───────────────────────────────────
export default function Shipping() {
  const heroRef = useRef(null);
  const [activePage, setActivePage] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (heroRef.current) heroRef.current.focus();
  }, []);

  if (activePage) {
    return <DeliveryDetail id={activePage} onBack={() => setActivePage(null)} />;
  }

  return (
    <div className="ship-page">

      {/* Hero */}
      <section className="ship-hero" ref={heroRef} tabIndex={0}>
        <div className="ship-hero-inner">
          <span className="ship-eyebrow">Delivery Policy</span>
          <h1 className="ship-title">Shipping & Delivery</h1>
          <p className="ship-subtitle">Fast, reliable delivery to your doorstep across South India.</p>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="ship-section">
        <h2 className="ship-section-title">Delivery Options</h2>
        <div className="delivery-grid">
          {deliveryOptions.map((opt, i) => (
            <div
              className={`delivery-card${opt.highlight ? " delivery-card--featured" : ""}`}
              key={i}
              tabIndex={0}
              role="button"
              aria-label={`View ${opt.title} details`}
              onClick={() => setActivePage(opt.id)}
              onKeyDown={(e) => e.key === "Enter" && setActivePage(opt.id)}
            >
              <span className="delivery-icon">{opt.icon}</span>
              <h3 className="delivery-title">{opt.title}</h3>
              <p className="delivery-desc">{opt.desc}</p>
              <span className="delivery-price">{opt.price}</span>
              <span className="delivery-arrow">Learn more →</span>
            </div>
          ))}
        </div>
      </section>

      {/* Areas */}
      <section className="ship-section ship-section--alt">
        <div className="ship-section-inner">
          <h2 className="ship-section-title">Delivery Areas</h2>
          <p className="ship-body">
            We deliver across South India — Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, and Telangana.
            Check availability by entering your pincode at checkout.
          </p>
          <div className="state-chips">
            {["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"].map((s) => (
              <span className="chip" key={s}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking */}
      <section className="ship-section">
        <h2 className="ship-section-title">Order Tracking</h2>
        <p className="ship-body ship-body--center">
          Track in real-time via app or website. SMS & email updates at every stage.
        </p>
        <div className="tracking-steps">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="track-step">
                <div className="track-dot">{s.step}</div>
                <span className="track-label">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className="track-line" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Instructions + Support */}
      <section className="ship-section ship-section--alt">
        <div className="ship-two-col">
          <div className="ship-col">
            <h2 className="ship-section-title">Delivery Instructions</h2>
            <p className="ship-body">Add gate codes, preferred times, or contactless delivery preferences during checkout.</p>
          </div>
          <div className="ship-col">
            <h2 className="ship-section-title">Missing or Damaged Items</h2>
            <p className="ship-body">Report within 24 hours — we'll replace or refund immediately.</p>
            <div className="contact-box">
              <a href="mailto:support@harikart.com" className="contact-link">✉ support@harikart.com</a>
              <span className="contact-link">📞 1800-123-4567 (9 AM – 9 PM)</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}