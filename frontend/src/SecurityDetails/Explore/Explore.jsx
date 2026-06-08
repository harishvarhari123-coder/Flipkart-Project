import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Explore.css";

const ExploreSecurity = () => {
  // ✅ FIX: always open page from TOP
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const securityModules = [
    {
      title: "PCI-DSS Compliance",
      desc: "Industry-level payment security standards protect every transaction.",
      icon: "💳"
    },
    {
      title: "Data Encryption",
      desc: "All sensitive data is encrypted using advanced 256-bit encryption.",
      icon: "🔐"
    },
    {
      title: "Fraud Detection",
      desc: "AI-powered fraud monitoring system detects suspicious activity instantly.",
      icon: "🛡️"
    },
    {
      title: "Instant Alerts",
      desc: "Get real-time notifications for all account activities.",
      icon: "⚡"
    },
    {
      title: "Security Audits",
      desc: "Regular audits ensure maximum protection and compliance.",
      icon: "📊"
    },
    {
      title: "Secure Banking",
      desc: "Multi-layer protection keeps your banking experience safe.",
      icon: "🏦"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "User Login",
      desc: "Secure authentication system verifies user identity."
    },
    {
      step: "02",
      title: "System Check",
      desc: "Security engine scans for threats in real time."
    },
    {
      step: "03",
      title: "Data Protection",
      desc: "Encryption protects all transmitted data."
    },
    {
      step: "04",
      title: "Safe Transaction",
      desc: "Transaction is completed securely with monitoring."
    }
  ];

  const benefits = [
    "End-to-End Encryption",
    "AI Fraud Detection",
    "24/7 Monitoring",
    "Secure Payments",
    "Instant Alerts",
    "Risk Prevention"
  ];

  return (
    <div className="explore-security-page">

      {/* HERO */}
      <section className="hero-section">
        <h1>Explore Security</h1>
        <p>
          Discover how we protect your data, transactions, and identity with
          world-class banking security systems.
        </p>

        <Link to="/products" className="primary-btn">
          Start Shopping Securely
        </Link>
      </section>

      {/* MODULES */}
      <section className="modules-section">
        <h2>Security Modules</h2>

        <div className="grid">
          {securityModules.map((item, index) => (
            <div className="card" key={index}>
              <div className="icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="process-section">
        <h2>How Security Works</h2>

        <div className="timeline">
          {steps.map((item, index) => (
            <div className="step-card" key={index}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="benefits-section">
        <h2>Security Benefits</h2>

        <div className="benefits-grid">
          {benefits.map((b, i) => (
            <div className="benefit" key={i}>
              {b}
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <h2>Security Performance</h2>

        <div className="stats-grid">
          <div className="stat">
            <h3>99.9%</h3>
            <p>Protection Rate</p>
          </div>

          <div className="stat">
            <h3>24/7</h3>
            <p>Monitoring</p>
          </div>

          <div className="stat">
            <h3>256-bit</h3>
            <p>Encryption</p>
          </div>

          <div className="stat">
            <h3>0</h3>
            <p>Data Breaches</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to Experience Secure Banking?</h2>

        <Link to="/products" className="primary-btn">
          Start Shopping Securely
        </Link>
      </section>

    </div>
  );
};

export default ExploreSecurity;