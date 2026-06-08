import React, { useEffect } from "react";
import "./Pics.css";

const Pics = () => {
  const images = [
    {
      title: "Secure Payment Gateway",
      desc: "Encrypted transaction flow between client and server.",
      url: "https://images.unsplash.com/photo-1556742393-d75f468bfcb0"
    },
    {
      title: "PCI-DSS Compliance Layer",
      desc: "Security standards ensuring safe card data handling.",
      url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c"
    },
    {
      title: "Tokenization System",
      desc: "Sensitive data replaced with secure tokens.",
      url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
    },
    {
      title: "Fraud Detection AI",
      desc: "Machine learning models detect suspicious activity.",
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71"
    },
    {
      title: "Encryption Security",
      desc: "End-to-end AES and TLS encryption systems.",
      url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
    },
    {
      title: "Secure API Gateway",
      desc: "Authentication and rate limiting for APIs.",
      url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31"
    }
  ];

  const securityPoints = [
    "End-to-end encryption (TLS 1.3)",
    "No card data storage (Zero Trust model)",
    "Token-based payment system",
    "AI-powered fraud detection engine",
    "Multi-layer authentication system",
    "Real-time transaction monitoring"
  ];

  const complianceRules = [
    "Maintain secure network architecture",
    "Protect stored cardholder data",
    "Encrypt transmission over open networks",
    "Use strong access control measures",
    "Regularly monitor and test networks",
    "Maintain strict security policies"
  ];

  // ✅ FIX: scroll to top after 3ms (your requirement)
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 3);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pics-container">

      {/* HERO */}
      <div className="hero">
        <h1>PCI-DSS Secure Payments Infrastructure</h1>
        <p>
          A modern enterprise-grade architecture designed to secure digital payments,
          prevent fraud, and ensure full regulatory compliance.
        </p>

        <div className="hero-badges">
          <span>PCI-DSS Level 1</span>
          <span>End-to-End Encrypted</span>
          <span>Fraud Protected</span>
        </div>
      </div>

      {/* SECURITY OVERVIEW */}
      <div className="section">
        <h2>Security Overview</h2>
        <p>
          Secure payment systems protect sensitive financial data using encryption,
          tokenization, and strict access control mechanisms.
        </p>

        <div className="card-grid">
          {securityPoints.map((point, i) => (
            <div className="card" key={i}>
              <p>✔ {point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* GALLERY */}
      <div className="section">
        <h2>Infrastructure Visualization</h2>
        <p>Key components of a PCI-DSS compliant payment ecosystem.</p>

        <div className="pics-grid">
          {images.map((item, index) => (
            <div className="pic-card" key={index}>
              <div className="pic-image-wrapper">
                <img src={item.url} alt={item.title} />
              </div>

              <div className="pic-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMPLIANCE */}
      <div className="section">
        <h2>PCI-DSS Compliance Requirements</h2>
        <p>Global security standards for payment protection.</p>

        <div className="card-grid">
          {complianceRules.map((rule, i) => (
            <div className="card warning" key={i}>
              <p>🔒 {rule}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ARCHITECTURE */}
      <div className="section">
        <h2>Payment Architecture Flow</h2>

        <div className="flow-box">
          Client → Secure UI → API Gateway → Tokenization Service → Payment Processor → Bank
        </div>

        <div className="card">
          <p>
            Every transaction passes through multiple security layers ensuring
            encryption, integrity, and fraud prevention in real time.
          </p>
        </div>
      </div>

      {/* FRAUD */}
      <div className="section">
        <h2>Fraud Detection System</h2>

        <div className="card">
          <p>
            AI models analyze transaction behavior, device fingerprinting,
            IP reputation, and anomaly detection.
          </p>
        </div>

        <div className="card highlight">
          <p>⚡ Real-time risk scoring engine active 24/7</p>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <p>© 2026 Secure Payments Infrastructure | PCI-DSS Architecture System</p>
      </footer>

    </div>
  );
};

export default Pics;