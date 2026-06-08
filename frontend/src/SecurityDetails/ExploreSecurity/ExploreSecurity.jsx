import React, { useEffect, useState } from "react";
import "./ExploreSecurity.css";
import { Router ,Link} from "react-router-dom";

const securityFeatures = [
  {
    id: 1,
    title: "End-to-End Encryption",
    desc: "All transactions are protected with AES-256 encryption.",
    icon: "🔐",
  },
  {
    id: 2,
    title: "Fraud Detection AI",
    desc: "Real-time AI monitoring prevents suspicious activity.",
    icon: "🧠",
  },
  {
    id: 3,
    title: "Biometric Login",
    desc: "Fingerprint and face recognition authentication.",
    icon: "👁️",
  },
  {
    id: 4,
    title: "24/7 Security Monitoring",
    desc: "Continuous system monitoring for threats.",
    icon: "🛡️",
  },
  {
    id: 5,
    title: "Secure Payments",
    desc: "Protected payment gateway with tokenization.",
    icon: "💳",
  },
  {
    id: 6,
    title: "Device Verification",
    desc: "Only trusted devices can access your account.",
    icon: "📱",
  },
];

const ExploreSecurityFeature = () => {
  const [active, setActive] = useState(null);
  const [scrollTopBtn, setScrollTopBtn] = useState(false);

  // ✅ TOP SCROLL FIX
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // scroll button handler
  useEffect(() => {
    const handleScroll = () => {
      setScrollTopBtn(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="security-wrapper">

      {/* HERO SECTION */}
      <section className="hero-section">
        <h1>Secure Banking System</h1>
        <p>
          Explore next-generation security features that protect your money,
          identity, and transactions.
        </p>
        <Link to="/enablesecurity" className="cta-btn">
            Enable Security Settings
            </Link>   
      </section>

      {/* FEATURES GRID */}
      <section className="grid-section">
        <h2>Security Features</h2>

        <div className="grid">
          {securityFeatures.map((item) => (
            <div
              key={item.id}
              className={`card ${active === item.id ? "active" : ""}`}
              onClick={() => setActive(item.id)}
            >
              <div className="icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECURITY INFO BANNER */}
      <section className="info-banner">
        <h2>Why Security Matters?</h2>
        <p>
          Banking systems are protected with multi-layer authentication,
          encryption, and fraud monitoring to ensure your funds remain safe.
        </p>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section">
        <div className="stat">
          <h3>99.9%</h3>
          <p>Uptime Security</p>
        </div>
        <div className="stat">
          <h3>24/7</h3>
          <p>Monitoring</p>
        </div>
        <div className="stat">
          <h3>0.01%</h3>
          <p>Fraud Rate</p>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="footer-cta">
        <h2>Ready to Secure Your Account?</h2>
        <Link to="/enablesecurity" className="cta-btn">
            Enable Security Settings
            </Link>   
   </section>

      {/* SCROLL TO TOP */}
      {scrollTopBtn && (
        <button className="scroll-top" onClick={scrollToTop}>
          ↑
        </button>
      )}

    </div>
  );
};

export default ExploreSecurityFeature;