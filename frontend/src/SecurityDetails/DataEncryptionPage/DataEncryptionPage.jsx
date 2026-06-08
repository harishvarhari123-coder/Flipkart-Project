import React, { useEffect } from "react";
import "./DataEncryptionPage.css";
import { Link } from "react-router-dom";
const DataEncryptionPage = () => {
  const encryptionFeatures = [
    {
      title: "256-Bit Encryption",
      description:
        "Industry-standard encryption protects sensitive banking information from unauthorized access."
    },
    {
      title: "Secure Data Storage",
      description:
        "Customer data remains encrypted both at rest and during transmission."
    },
    {
      title: "Advanced Key Management",
      description:
        "Encryption keys are securely managed and rotated regularly."
    }
  ];

  const benefits = [
    "Protects customer information",
    "Prevents unauthorized access",
    "Secures online transactions",
    "Ensures privacy compliance",
    "Maintains data integrity",
    "Supports secure banking"
  ];

  // ✅ FIX: always open page from TOP
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="encryption-page">

      <section className="encryption-hero">
        <div className="hero-content">
          <h1>Data Encryption</h1>
          <p>
            We use advanced encryption technologies to safeguard your
            personal and financial information at every stage.
          </p>

          <Link to="/explore" className="hero-btn">
  Explore Security
</Link>
        </div>
      </section>

      <section className="feature-section">
        <h2>Encryption Features</h2>

        <div className="feature-grid">
          {encryptionFeatures.map((feature, index) => (
            <div className="feature-card" key={index}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="process-section">
        <h2>How Encryption Works</h2>

        <div className="process-grid">
          <div className="process-card">
            <span>01</span>
            <h3>Data Collection</h3>
            <p>
              Information is securely collected through protected channels.
            </p>
          </div>

          <div className="process-card">
            <span>02</span>
            <h3>Encryption</h3>
            <p>
              Data is converted into unreadable code using advanced algorithms.
            </p>
          </div>

          <div className="process-card">
            <span>03</span>
            <h3>Secure Transmission</h3>
            <p>
              Encrypted information travels through protected networks.
            </p>
          </div>

          <div className="process-card">
            <span>04</span>
            <h3>Authorized Access</h3>
            <p>
              Only verified systems can decrypt and process information.
            </p>
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <h2>Benefits of Encryption</h2>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              {benefit}
            </div>
          ))}
        </div>
      </section>

      <section className="security-stats">
        <h2>Security Highlights</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>256-Bit</h3>
            <p>Encryption Standard</p>
          </div>

          <div className="stat-card">
            <h3>100%</h3>
            <p>Encrypted Transactions</p>
          </div>

          <div className="stat-card">
            <h3>24/7</h3>
            <p>Protection Monitoring</p>
          </div>

          <div className="stat-card">
            <h3>Secure</h3>
            <p>Data Storage</p>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-card">
          <h4>What is data encryption?</h4>
          <p>Encryption transforms readable information into secure coded data.</p>
        </div>

        <div className="faq-card">
          <h4>Why is encryption important?</h4>
          <p>It protects customer information from cyber threats and unauthorized access.</p>
        </div>

        <div className="faq-card">
          <h4>Is online banking encrypted?</h4>
          <p>Yes, all online banking communications are encrypted and protected.</p>
        </div>
      </section>

    </div>
  );
};

export default DataEncryptionPage;