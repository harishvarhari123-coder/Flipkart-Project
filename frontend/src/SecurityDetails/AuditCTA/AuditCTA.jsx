import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./AuditCTA.css";

const AuditCTA = () => {
  const pageRef = useRef(null);

  // Scroll to top + autofocus
  useEffect(() => {
    window.scrollTo(0, 0);

    if (pageRef.current) {
      pageRef.current.focus();
    }
  }, []);

  return (
    <div className="cta-page" ref={pageRef} tabIndex="-1">

      {/* HERO SECTION */}
      <section className="cta-hero">
        <h1>Security Audits</h1>
        <p>
          Strengthen your banking security system with continuous audits that
          detect vulnerabilities, prevent fraud, and ensure system integrity.
        </p>
      </section>

      {/* INTRO SECTION */}
      <section className="cta-section">
        <h2>What is a Security Audit?</h2>
        <p>
          A security audit is a detailed inspection of your banking system,
          applications, and infrastructure to identify weaknesses and ensure
          compliance with security standards.
        </p>

        <p>
          It helps organizations proactively detect risks before hackers can
          exploit them, ensuring customer data and financial assets remain safe.
        </p>
      </section>

      {/* FEATURES */}
      <section className="cta-section dark">
        <h2>Key Features of Security Audits</h2>

        <ul>
          <li>✔ Continuous system monitoring</li>
          <li>✔ Vulnerability detection in real-time</li>
          <li>✔ AI-powered risk analysis</li>
          <li>✔ Compliance verification (banking standards)</li>
          <li>✔ Automated security reports</li>
        </ul>
      </section>

      {/* BENEFITS */}
      <section className="cta-section">
        <h2>Benefits</h2>

        <div className="grid">
          <div className="card">
            <h3>Fraud Prevention</h3>
            <p>
              Detect suspicious activities before they become financial losses.
            </p>
          </div>

          <div className="card">
            <h3>System Protection</h3>
            <p>
              Protect banking systems from malware, phishing, and cyber attacks.
            </p>
          </div>

          <div className="card">
            <h3>Compliance Ready</h3>
            <p>
              Ensure your system follows all financial and data protection laws.
            </p>
          </div>

          <div className="card">
            <h3>Customer Trust</h3>
            <p>
              Build trust by maintaining strong security standards.
            </p>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="cta-section dark">
        <h2>Audit Process</h2>

        <ol>
          <li>Identify all digital assets and systems</li>
          <li>Analyze existing security policies</li>
          <li>Scan for vulnerabilities and risks</li>
          <li>Perform penetration testing</li>
          <li>Generate detailed audit report</li>
          <li>Apply security improvements</li>
        </ol>
      </section>

      {/* RISKS SECTION */}
      <section className="cta-section">
        <h2>What Happens Without Audits?</h2>

        <p>
          Without regular audits, systems become vulnerable to cyber attacks,
          data leaks, and financial fraud. Hackers often exploit outdated
          security systems.
        </p>

        <ul>
          <li>⚠ Data breaches and leaks</li>
          <li>⚠ Unauthorized transactions</li>
          <li>⚠ System downtime</li>
          <li>⚠ Loss of customer trust</li>
        </ul>
      </section>

      {/* STATS */}
      <section className="cta-stats">
        <div className="stat">
          <h2>99%</h2>
          <p>Threat Detection Accuracy</p>
        </div>

        <div className="stat">
          <h2>24/7</h2>
          <p>Monitoring System</p>
        </div>

        <div className="stat">
          <h2>&lt;2s</h2>
          <p>Response Time</p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-final">
        <h2>Strengthen Your Security Today</h2>
        <p>
          Continuous audits ensure your banking system stays protected against
          evolving cyber threats.
        </p>

        <Link to ="/audits"><button className="cta-btn">
          Get Back
        </button></Link>
      </section>

      {/* FOOTER */}
      <footer className="cta-footer">
        <p>© 2026 Banking Security Audit System. All Rights Reserved.</p>
      </footer>

    </div>
  );
};

export default AuditCTA;