import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Learnmore.css";

const LearnMore = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="lm-page">

      {/* HERO SECTION */}
      <section className="lm-hero">
        <h1>Fraud Monitoring System</h1>
        <p>
          Our intelligent fraud detection engine continuously protects your
          account using real-time analytics, AI-driven insights, and behavior
          tracking.
        </p>
       <Link to ="/getstarted"> <button>Get Started</button></Link>
      </section>

      {/* STATS SECTION */}
      <section className="lm-stats">
        <div className="stat-box">
          <h2>99.9%</h2>
          <p>Fraud Detection Accuracy</p>
        </div>

        <div className="stat-box">
          <h2>&lt; 2s</h2>
          <p>Response Time</p>
        </div>

        <div className="stat-box">
          <h2>24/7</h2>
          <p>Monitoring</p>
        </div>

        <div className="stat-box">
          <h2>1M+</h2>
          <p>Protected Accounts</p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="lm-about">
        <h2>How Fraud Monitoring Works</h2>
        <p>
          Fraud monitoring uses advanced machine learning models to detect
          unusual behavior in real time. It analyzes login patterns, device
          fingerprints, IP addresses, transaction history, and behavioral
          biometrics.
        </p>

        <p>
          If any suspicious activity is detected, the system automatically
          triggers alerts, blocks risky transactions, and requests additional
          verification.
        </p>

        <ul>
          <li>✔ Device recognition and tracking</li>
          <li>✔ AI anomaly detection engine</li>
          <li>✔ Behavioral pattern analysis</li>
          <li>✔ Real-time alerts and blocking</li>
          <li>✔ Multi-layer security system</li>
        </ul>
      </section>

      {/* FEATURES SECTION */}
      <section className="lm-features">
        <h2>Key Features</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Real-Time Monitoring</h3>
            <p>
              Every transaction is analyzed instantly to detect suspicious
              behavior before damage occurs.
            </p>
          </div>

          <div className="feature-card">
            <h3>AI Detection Engine</h3>
            <p>
              Machine learning models continuously improve fraud detection
              accuracy based on new threats.
            </p>
          </div>

          <div className="feature-card">
            <h3>Smart Alerts</h3>
            <p>
              Users receive instant notifications when unusual activity is
              detected in their account.
            </p>
          </div>

          <div className="feature-card">
            <h3>Geo Tracking</h3>
            <p>
              Detects login attempts from unusual locations and blocks
              unauthorized access.
            </p>
          </div>

          <div className="feature-card">
            <h3>Device Security</h3>
            <p>
              Recognizes trusted devices and flags unknown devices for
              verification.
            </p>
          </div>

          <div className="feature-card">
            <h3>Auto Blocking</h3>
            <p>
              Suspicious transactions are automatically paused until verified.
            </p>
          </div>
        </div>
      </section>

      {/* SECURITY SECTION */}
      <section className="lm-security">
        <h2>Security Layers</h2>

        <div className="security-box">
          <h3>1. Data Encryption</h3>
          <p>
            All user data is encrypted using AES-256 encryption standards to
            ensure maximum protection.
          </p>
        </div>

        <div className="security-box">
          <h3>2. Behavioral Analytics</h3>
          <p>
            The system learns how users typically behave and detects any
            deviations instantly.
          </p>
        </div>

        <div className="security-box">
          <h3>3. Risk Scoring</h3>
          <p>
            Every transaction receives a risk score that determines whether it
            should be approved or blocked.
          </p>
        </div>

        <div className="security-box">
          <h3>4. Multi-Factor Authentication</h3>
          <p>
            Users are required to verify identity using OTP, email, or device
            confirmation.
          </p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="lm-faq">
        <h2>Frequently Asked Questions</h2>

        {[
          {
            q: "What is fraud monitoring?",
            a: "Fraud monitoring is a system that detects and prevents unauthorized transactions and suspicious activity in real time."
          },
          {
            q: "Is my data safe?",
            a: "Yes, all data is encrypted and monitored using secure enterprise-level systems."
          },
          {
            q: "Does it block transactions automatically?",
            a: "Yes, high-risk transactions are automatically paused until verification is completed."
          },
          {
            q: "Can I disable fraud monitoring?",
            a: "No, it is a core security feature designed to protect your account at all times."
          },
          {
            q: "How fast is detection?",
            a: "Detection typically happens within milliseconds using AI-based processing."
          }
        ].map((item, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => toggleFaq(index)}>
              {item.q}
            </div>
            {openFaq === index && (
              <div className="faq-answer">{item.a}</div>
            )}
          </div>
        ))}
      </section>

      {/* CTA SECTION */}
      <section className="lm-cta">
        <h2>Stay Protected at All Times</h2>
        <p>
          Join millions of users who trust our fraud monitoring system for
          complete financial safety.
        </p>
        <button>Activate Protection</button>
      </section>

      {/* FOOTER */}
      <footer className="lm-footer">
        <p>© 2026 Fraud Monitoring System. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default LearnMore;