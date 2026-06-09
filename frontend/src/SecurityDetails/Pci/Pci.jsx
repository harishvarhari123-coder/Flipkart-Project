import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Pci.css";

const securityFeatures = [
  "End-to-End Encryption (AES-256)",
  "PCI-DSS Level 1 Compliance",
  "Tokenized Payment Processing",
  "Fraud Detection System",
  "Secure Network Firewalls",
  "Real-time Transaction Monitoring",
  "Multi-factor Authentication",
  "Zero Card Data Storage Policy",
  "Intrusion Prevention System",
  "Secure API Gateway"
];

const compliancePoints = [
  {
    title: "Build Secure Networks",
    desc: "Firewalls and secure configurations protect cardholder data."
  },
  {
    title: "Protect Cardholder Data",
    desc: "Encryption ensures sensitive data remains unreadable."
  },
  {
    title: "Maintain Vulnerability Management",
    desc: "Regular scanning and patch updates reduce risk exposure."
  },
  {
    title: "Strong Access Control",
    desc: "Only authorized personnel can access sensitive systems."
  },
  {
    title: "Monitor and Test Networks",
    desc: "Continuous logging and testing ensure system integrity."
  },
  {
    title: "Information Security Policy",
    desc: "Formal policies enforce organizational security standards."
  }
];

export default function PCI() {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pci-container">
      <header className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Secure Payments Infrastructure</h1>
          <p>PCI-DSS Compliant Payment Security Architecture</p>

        <Link to ="/pics">  <button className="learn-btn">
            Learn More
          </button></Link>
        </div>
      </header>

      <section className="features">
        <h2>Security Features</h2>
        <div className="grid">
          {securityFeatures.map((item, i) => (
            <div key={i} className="card">
              <div className="icon">🔐</div>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="compliance">
        <h2>PCI-DSS Compliance Requirements</h2>

        <div className="accordion">
          {compliancePoints.map((item, index) => (
            <div key={index} className="accordion-item">
              <button
                className="accordion-title"
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
              >
                {item.title}
              </button>

              <div
                className={
                  activeIndex === index
                    ? "accordion-content show"
                    : "accordion-content"
                }
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="live-stats">
        <h2>Live Security Monitoring</h2>

        <div className="stats-grid">
          <div className="stat">
            <h3>99.99%</h3>
            <p>Uptime</p>
          </div>
          <div className="stat">
            <h3>0</h3>
            <p>Data Breaches</p>
          </div>
          <div className="stat">
            <h3>256-bit</h3>
            <p>Encryption</p>
          </div>
          <div className="stat">
            <h3>&lt; 50ms</h3>
            <p>Transaction Time</p>
          </div>
        </div>
      </section>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>About PCI-DSS Compliance</h2>
            <p>
              PCI-DSS is a global security standard designed to ensure secure
              handling of credit card information during and after financial
              transactions.
            </p>

            <ul>
              <li>Protect cardholder data</li>
              <li>Maintain secure systems</li>
              <li>Implement strong access control</li>
              <li>Regularly monitor networks</li>
            </ul>

            <button className="close-btn" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>© {new Date().getFullYear()} SecurePay Systems | PCI-DSS Ready</p>
      </footer>
    </div>
  );
}