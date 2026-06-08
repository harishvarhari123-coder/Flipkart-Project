import React, { useEffect, useState } from "react";
import "./EnableSecurity.css";

const securityOptions = [
  { id: 1, title: "Two-Factor Authentication", desc: "Add extra login security", enabled: true },
  { id: 2, title: "Face ID / Fingerprint", desc: "Biometric authentication", enabled: false },
  { id: 3, title: "Transaction Alerts", desc: "Instant payment notifications", enabled: true },
  { id: 4, title: "Device Lock", desc: "Block unknown devices", enabled: false },
  { id: 5, title: "Fraud Monitoring AI", desc: "Real-time fraud detection", enabled: true },
  { id: 6, title: "Login Alerts", desc: "Notify on every login attempt", enabled: true },
];

const EnableSecurity = () => {
  const [features, setFeatures] = useState(securityOptions);
  const [scrollBtn, setScrollBtn] = useState(false);

  // ✅ TOP SCROLL FIX
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // scroll button visibility
  useEffect(() => {
    const handleScroll = () => {
      setScrollBtn(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFeature = (id) => {
    setFeatures((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const enabledCount = features.filter((f) => f.enabled).length;

  return (
    <div className="security-container">

      {/* HERO */}
      <div className="security-hero">
        <h1>Secure Your Banking Account</h1>
        <p>Enable advanced protection features to keep your money safe</p>

        <div className="status-box">
          <span>Active Protection:</span>
          <strong>{enabledCount} / {features.length}</strong>
        </div>
      </div>

      {/* GRID */}
      <div className="security-grid">
        {features.map((item) => (
          <div key={item.id} className="security-card">

            <div className="card-info">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={item.enabled}
                onChange={() => toggleFeature(item.id)}
              />
              <span className="slider"></span>
            </label>

          </div>
        ))}
      </div>

      {/* INFO SECTION */}
      <div className="info-section">
        <h2>Why Enable Security Features?</h2>
        <p>
          Modern banking requires multi-layer protection systems including AI fraud
          detection, biometric login, and real-time monitoring.
        </p>
      </div>

      {/* FOOTER CTA */}
      <div className="footer-box">
        <h2>Your Security is Our Priority</h2>
        <button className="cta-btn">Save Security Settings</button>
      </div>

      {/* SCROLL TOP */}
      {scrollBtn && (
        <button className="scroll-top" onClick={scrollToTop}>
          ↑
        </button>
      )}

    </div>
  );
};

export default EnableSecurity;