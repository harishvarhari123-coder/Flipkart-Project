import React from "react";
import { Link } from "react-router-dom";
import "./FarmToDoorstep.css";

const FarmToDoorstep = () => {
  const features = [
    {
      icon: "👨‍🌾",
      title: "Empowering Farmers",
      description:
        "We connect local farmers directly with customers, ensuring fair prices and sustainable livelihoods for rural communities.",
    },
    {
      icon: "🥬",
      title: "Fresh Every Day",
      description:
        "Vegetables and fruits are harvested at peak freshness and delivered directly from farms within 24 hours.",
    },
    {
      icon: "🚚",
      title: "Quick Delivery",
      description:
        "Our cold-chain logistics network ensures fast, safe delivery straight to your doorstep — no quality compromise.",
    },
  ];

  const stats = [
    { value: "500+", label: "Partner Farmers" },
    { value: "12K+", label: "Happy Families" },
    { value: "98%", label: "Freshness Rate" },
    { value: "30+", label: "Districts Covered" },
  ];

  const steps = [
    {
      number: "01",
      icon: "🌾",
      title: "Farm Harvest",
      description: "Farmers harvest produce at peak ripeness every morning.",
    },
    {
      number: "02",
      icon: "🏭",
      title: "Quality Check",
      description: "Every batch is graded and cleaned at our sorting hubs.",
    },
    {
      number: "03",
      icon: "📦",
      title: "Smart Packaging",
      description: "Eco-friendly packaging preserves nutrients and freshness.",
    },
    {
      number: "04",
      icon: "🏠",
      title: "Your Doorstep",
      description: "Delivered fresh within 24 hours of harvest.",
    },
  ];

  return (
    <section className="farm-section">
      {/* Decorative Background Elements */}
      <div className="farm-bg-leaf farm-bg-leaf--1" aria-hidden="true" />
      <div className="farm-bg-leaf farm-bg-leaf--2" aria-hidden="true" />

      <div className="farm-wrapper">
        {/* ── HERO BLOCK ── */}
        <div className="farm-hero">
          {/* Left: Image collage */}
          <div className="farm-images">
            <div className="farm-img-main">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900"
                alt="Farmer in field"
              />
            </div>
            <div className="farm-img-secondary">
              <img
                src="https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500"
                alt="Fresh vegetables"
              />
            </div>
            <div className="farm-badge-float">
              <span className="farm-badge-icon">🌿</span>
              <span className="farm-badge-text">100% Natural</span>
            </div>
          </div>

          {/* Right: Content */}
          <div className="farm-content">
            <span className="farm-tag">🌱 Our Journey</span>
            <h2 className="farm-heading">
              From <em>Farm</em> to<br />Your Doorstep
            </h2>
            <p className="farm-subtitle">
              Harikart bridges the gap between rural farmers and urban families
              by eliminating middlemen — ensuring better income for farmers and
              fresher produce for your table.
            </p>

            <div className="farm-features">
              {features.map((item, index) => (
                <div className="feature-card" key={index}>
                  <div className="feature-icon">{item.icon}</div>
                  <div className="feature-text">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/ourjourney">
              <button className="learn-btn">
                Learn More
                <span className="learn-btn-arrow">→</span>
              </button>
            </Link>
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <div className="farm-stats">
          {stats.map((stat, i) => (
            <div className="stat-item" key={i}>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* ── HOW IT WORKS ── */}
        <div className="farm-process">
          <div className="farm-process-header">
            <span className="farm-tag">🔄 The Process</span>
            <h3>How It Works</h3>
            <p>From sunrise harvest to your kitchen — here's how we do it.</p>
          </div>
          <div className="farm-steps">
            {steps.map((step, i) => (
              <div className="step-card" key={i}>
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="step-connector" aria-hidden="true">›</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── TRUST BANNER ── */}
        <div className="farm-trust">
          <div className="farm-trust-inner">
            <div className="farm-trust-text">
              <h3>Why Families Trust Harikart</h3>
              <p>
                No cold storage. No preservatives. No middlemen. Just honest,
                fresh produce delivered with care — directly from the hands that
                grew it.
              </p>
              <ul className="farm-trust-list">
                <li>✅ Farm-to-table in under 24 hours</li>
                <li>✅ Certified chemical-free produce</li>
                <li>✅ Transparent farmer pricing</li>
                <li>✅ Zero-waste eco packaging</li>
              </ul>
            </div>
            <div className="farm-trust-cta">
              <p className="trust-cta-headline">Ready to eat fresher?</p>
              <Link to="/products">
                <button className="shop-btn">Shop Now 🛒</button>
              </Link>
              <Link to="/ourjourney">
                <button className="ghost-btn">Our Story →</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FarmToDoorstep;