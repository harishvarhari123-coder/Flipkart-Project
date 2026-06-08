import React, { useEffect, useRef } from "react";
import "./SSLTLSPage.css";

export default function SSLTLSPage() {
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="ssl-page">
      <section className="ssl-hero">
        <div className="ssl-hero-content">
          <h1
            ref={headingRef}
            tabIndex="-1"
            className="ssl-main-heading"
          >
            🔒 SSL/TLS Encryption Security
          </h1>

          <p>
            Harikart uses enterprise-grade SSL/TLS encryption to protect
            customer data, payment information, and communications across all
            devices and networks.
          </p>
        </div>
      </section>

      <section className="ssl-overview">
        <h2>What is SSL/TLS Encryption?</h2>
        <p>
          SSL (Secure Sockets Layer) and TLS (Transport Layer Security) are
          cryptographic protocols designed to secure communication between
          browsers and servers. Every interaction on Harikart is protected by
          modern TLS encryption standards.
        </p>
      </section>

      <section className="ssl-features">
        <h2>Security Features</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>🔐 256-bit Encryption</h3>
            <p>
              Protects sensitive customer and payment data using military-grade
              encryption technology.
            </p>
          </div>

          <div className="feature-card">
            <h3>🛡️ Secure Transactions</h3>
            <p>
              Every payment transaction is encrypted before being transmitted
              through our payment gateways.
            </p>
          </div>

          <div className="feature-card">
            <h3>🌐 HTTPS Protection</h3>
            <p>
              All Harikart pages are delivered over HTTPS to prevent data
              interception and tampering.
            </p>
          </div>

          <div className="feature-card">
            <h3>🚫 Man-in-the-Middle Prevention</h3>
            <p>
              SSL/TLS certificates verify server identity and block malicious
              interception attempts.
            </p>
          </div>
        </div>
      </section>

      <section className="ssl-process">
        <h2>How SSL/TLS Works</h2>

        <div className="steps">
          <div className="step">
            <span>1</span>
            <p>User connects to Harikart securely.</p>
          </div>

          <div className="step">
            <span>2</span>
            <p>Server sends a trusted SSL certificate.</p>
          </div>

          <div className="step">
            <span>3</span>
            <p>Encryption keys are exchanged securely.</p>
          </div>

          <div className="step">
            <span>4</span>
            <p>All communication becomes encrypted.</p>
          </div>
        </div>
      </section>

      <section className="ssl-benefits">
        <h2>Benefits for Customers</h2>

        <ul>
          <li>✅ Safe online payments</li>
          <li>✅ Protected login credentials</li>
          <li>✅ Secure personal information</li>
          <li>✅ Protection against cyber threats</li>
          <li>✅ Trusted shopping experience</li>
        </ul>
      </section>

      <section className="ssl-footer-card">
        <h2>Harikart Security Commitment</h2>
        <p>
          We continuously monitor, update, and improve our encryption
          technologies to ensure your shopping experience remains safe and
          secure at all times.
        </p>
      </section>
    </div>
  );
}