import React, { useEffect } from "react";
import {Link} from "react-router-dom";
import "./SecureBankingPage.css";

const SecureBankingPage = () => {
  const securityFeatures = [
    {
      title: "Multi-Layer Protection",
      description:
        "Advanced security mechanisms safeguard your banking information at every stage."
    },
    {
      title: "Secure Transactions",
      description:
        "All financial transactions are encrypted and continuously monitored."
    },
    {
      title: "Identity Verification",
      description:
        "Robust authentication systems ensure only authorized access."
    },
    {
      title: "Real-Time Monitoring",
      description:
        "Continuous monitoring helps identify suspicious activities instantly."
    }
  ];

  const services = [
    "Secure Online Banking",
    "Protected Mobile Banking",
    "Encrypted Fund Transfers",
    "Account Activity Monitoring",
    "Fraud Prevention Systems",
    "Secure Payment Processing"
  ];

  // ✅ FIX: always open page from TOP
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="secure-banking-page">

      <section className="secure-hero">
        <div className="secure-hero-content">
          <h1>Secure Banking</h1>
          <p>
            Experience banking with confidence through industry-leading
            security technologies designed to protect your accounts,
            transactions, and personal information.
          </p>

          <Link to="/exploresecurity" className="cta-btn">
                 Explore Security Feature
            </Link>
        </div>
      </section>

      <section className="secure-features">
        <h2>Banking Security Features</h2>

        <div className="features-grid">
          {securityFeatures.map((feature, index) => (
            <div className="feature-card" key={index}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="secure-process">
        <h2>How Secure Banking Works</h2>

        <div className="process-grid">
          <div className="process-card">
            <span>01</span>
            <h3>User Authentication</h3>
            <p>Customers verify identity using secure login credentials.</p>
          </div>

          <div className="process-card">
            <span>02</span>
            <h3>Encrypted Communication</h3>
            <p>Data is encrypted before transmission across banking networks.</p>
          </div>

          <div className="process-card">
            <span>03</span>
            <h3>Threat Detection</h3>
            <p>Security systems analyze activities for suspicious behavior.</p>
          </div>

          <div className="process-card">
            <span>04</span>
            <h3>Protected Transactions</h3>
            <p>Every transaction passes through multiple security layers.</p>
          </div>
        </div>
      </section>

      <section className="secure-services">
        <h2>Protected Banking Services</h2>

        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              {service}
            </div>
          ))}
        </div>
      </section>

      <section className="secure-stats">
        <h2>Security Performance</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>24/7</h3>
            <p>Security Monitoring</p>
          </div>

          <div className="stat-card">
            <h3>256-Bit</h3>
            <p>Encryption Standard</p>
          </div>

          <div className="stat-card">
            <h3>99.9%</h3>
            <p>Threat Detection Rate</p>
          </div>

          <div className="stat-card">
            <h3>100%</h3>
            <p>Secure Transactions</p>
          </div>
        </div>
      </section>

      <section className="secure-faq">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-card">
          <h4>How secure is online banking?</h4>
          <p>
            Online banking uses encryption, authentication, and monitoring
            technologies to maintain account security.
          </p>
        </div>

        <div className="faq-card">
          <h4>Are my transactions protected?</h4>
          <p>
            Yes, every transaction is secured using advanced protection layers.
          </p>
        </div>

        <div className="faq-card">
          <h4>How is fraud prevented?</h4>
          <p>
            Fraud prevention systems monitor activity continuously and alert
            users of suspicious events.
          </p>
        </div>
      </section>

    </div>
  );
};

export default SecureBankingPage;