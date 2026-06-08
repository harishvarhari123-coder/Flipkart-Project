import React, { useEffect, useRef } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const pageRef = useRef(null);

  // Auto scroll to top + autofocus on load
  useEffect(() => {
    window.scrollTo(0, 0); // start from index 0 (top)

    if (pageRef.current) {
      pageRef.current.focus(); // autofocus container
    }
  }, []);

  return (
    <div
      className="db-page"
      ref={pageRef}
      tabIndex="-1"   // required for focus to work on div
    >

      {/* HEADER */}
      <header className="db-header">
        <h1>Fraud Monitoring Dashboard</h1>
        <p>Real-time protection overview of your account activity</p>
      </header>

      {/* STATS */}
      <section className="db-stats">
        <div className="db-card">
          <h2>0</h2>
          <p>Threats Detected</p>
        </div>

        <div className="db-card">
          <h2>24/7</h2>
          <p>Active Monitoring</p>
        </div>

        <div className="db-card">
          <h2>Secure</h2>
          <p>Account Status</p>
        </div>

        <div className="db-card">
          <h2>AI</h2>
          <p>Detection Engine</p>
        </div>
      </section>

      {/* ACTIVITY LOG */}
      <section className="db-activity">
        <h2>Recent Activity</h2>

        <div className="db-log">
          <p>✔ Login from trusted device - Chennai</p>
          <p>✔ Payment verified - ₹2,500</p>
          <p>✔ Security scan completed</p>
          <p>✔ No suspicious activity detected</p>
        </div>
      </section>

      {/* SECURITY STATUS */}
      <section className="db-security">
        <h2>Security Status</h2>

        <div className="db-bar">
          <div className="db-fill"></div>
        </div>

        <p>System Protection Level: HIGH</p>
      </section>

    </div>
  );
};

export default Dashboard;