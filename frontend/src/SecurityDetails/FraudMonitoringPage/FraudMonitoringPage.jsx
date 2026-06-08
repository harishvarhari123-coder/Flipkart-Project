import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./FraudMonitoringPage.css";

const FraudMonitoringPage = () => {
  const features = [
    {
      title: "24/7 Monitoring",
      description:
        "Continuous transaction monitoring helps detect suspicious activities in real time."
    },
    {
      title: "AI Detection",
      description:
        "Advanced algorithms identify unusual patterns and potential threats instantly."
    },
    {
      title: "Risk Assessment",
      description:
        "Every transaction is analyzed using multiple security parameters."
    }
  ];

  const alerts = [
    "Unusual login attempts",
    "Large fund transfers",
    "International transactions",
    "Device changes",
    "Multiple failed logins"
  ];

  // ✅ FIX: always start page from top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="fraud-page">

      <section className="fraud-hero">
        <div className="hero-content">
          <h1>Fraud Monitoring</h1>
          <p>
            Our intelligent fraud detection system actively monitors your
            account and protects you from unauthorized activities.
          </p>
        <Link to ="/learnmore"> <button className="hero-btn" type="button">
            Learn More
          </button></Link> 
        </div>
      </section>

      <section className="protection-section">
        <h2>Protection Features</h2>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="monitoring-section">
        <h2>How Monitoring Works</h2>

        <div className="monitoring-grid">
          <div className="monitor-card">
            <h3>Transaction Analysis</h3>
            <p>Every transaction is reviewed using intelligent monitoring technology.</p>
          </div>

          <div className="monitor-card">
            <h3>Pattern Recognition</h3>
            <p>Historical activity is analyzed to identify suspicious behavior.</p>
          </div>

          <div className="monitor-card">
            <h3>Instant Response</h3>
            <p>Security teams are notified immediately when risks are detected.</p>
          </div>
        </div>
      </section>

      <section className="alert-section">
        <h2>Activities That Trigger Alerts</h2>

        <div className="alert-list">
          {alerts.map((alert, index) => (
            <div className="alert-item" key={index}>
              {alert}
            </div>
          ))}
        </div>
      </section>

      <section className="stats-section">
        <h2>Security Statistics</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>99.9%</h3>
            <p>Detection Accuracy</p>
          </div>

          <div className="stat-card">
            <h3>24/7</h3>
            <p>Monitoring Coverage</p>
          </div>

          <div className="stat-card">
            <h3>1M+</h3>
            <p>Transactions Protected</p>
          </div>

          <div className="stat-card">
            <h3>Instant</h3>
            <p>Threat Response</p>
          </div>
        </div>
      </section>

      <section className="fraud-faq">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-card">
          <h4>What happens when suspicious activity is detected?</h4>
          <p>Immediate alerts are sent and additional verification may be requested.</p>
        </div>

        <div className="faq-card">
          <h4>Can I report fraud manually?</h4>
          <p>Yes. Customers can report suspicious activities through support channels.</p>
        </div>

        <div className="faq-card">
          <h4>Are all transactions monitored?</h4>
          <p>Yes. Monitoring systems review transactions continuously for unusual behavior.</p>
        </div>
      </section>

    </div>
  );
};

export default FraudMonitoringPage;