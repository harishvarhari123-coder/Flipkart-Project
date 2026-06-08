import React, { useEffect } from "react";
import { Link } from "react-router-dom";


import "./InstantAlertsPage.css";

const InstantAlertsPage = () => {
  const alertTypes = [
    {
      title: "Transaction Alerts",
      description:
        "Receive notifications whenever money is debited or credited to your account."
    },
    {
      title: "Login Alerts",
      description:
        "Get informed instantly whenever a login attempt is detected."
    },
    {
      title: "Security Alerts",
      description:
        "Stay updated about suspicious activities and security-related events."
    }
  ];

  const benefits = [
    "Real-time notifications",
    "Immediate fraud awareness",
    "Account activity tracking",
    "Enhanced account security",
    "24/7 monitoring support",
    "Quick response to threats"
  ];

  // ✅ FIX: always open page from TOP
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="alerts-page">

      <section className="alerts-hero">
        <div className="alerts-hero-content">
          <h1>Instant Alerts</h1>
          <p>
            Stay informed about every important activity on your account with
            real-time notifications and security updates.
          </p>

            <Link to="/enablealert  " className="alerts-btn">
             Enable Alerts
            </Link>
        </div>
      </section>

      <section className="alerts-features">
        <h2>Alert Categories</h2>

        <div className="alerts-grid">
          {alertTypes.map((alert, index) => (
            <div className="alert-card" key={index}>
              <h3>{alert.title}</h3>
              <p>{alert.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="alerts-process">
        <h2>How Instant Alerts Work</h2>

        <div className="process-grid">
          <div className="process-card">
            <span>01</span>
            <h3>Activity Detected</h3>
            <p>
              The system identifies account or transaction activity instantly.
            </p>
          </div>

          <div className="process-card">
            <span>02</span>
            <h3>Verification</h3>
            <p>
              Activity is analyzed through automated monitoring systems.
            </p>
          </div>

          <div className="process-card">
            <span>03</span>
            <h3>Notification Sent</h3>
            <p>
              Alerts are delivered through SMS, email, or mobile app.
            </p>
          </div>

          <div className="process-card">
            <span>04</span>
            <h3>Customer Action</h3>
            <p>
              Users can review and respond immediately if needed.
            </p>
          </div>
        </div>
      </section>

      <section className="alerts-benefits">
        <h2>Benefits of Instant Alerts</h2>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              {benefit}
            </div>
          ))}
        </div>
      </section>

      <section className="alerts-stats">
        <h2>Alert Statistics</h2>

        <div className="stats-grid">
          <div className="stats-card">
            <h3>24/7</h3>
            <p>Monitoring</p>
          </div>

          <div className="stats-card">
            <h3>Instant</h3>
            <p>Delivery</p>
          </div>

          <div className="stats-card">
            <h3>99%</h3>
            <p>Notification Accuracy</p>
          </div>

          <div className="stats-card">
            <h3>Secure</h3>
            <p>Communication</p>
          </div>
        </div>
      </section>

      <section className="alerts-faq">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-card">
          <h4>How will I receive alerts?</h4>
          <p>
            Alerts can be delivered through SMS, email, or mobile app notifications.
          </p>
        </div>

        <div className="faq-card">
          <h4>Are alerts free?</h4>
          <p>
            Most banking alert services are included with your account.
          </p>
        </div>

        <div className="faq-card">
          <h4>Can I customize alerts?</h4>
          <p>
            Yes, customers can choose the types of alerts they wish to receive.
          </p>
        </div>
      </section>

    </div>
  );
};

export default InstantAlertsPage;