import React, { useEffect, useRef } from "react";
import "./Audits.css";
import { Link } from "react-router-dom";

const Audits = () => {
  const pageRef = useRef(null);

  // Auto scroll to top + autofocus
  useEffect(() => {
    window.scrollTo(0, 0);

    if (pageRef.current) {
      pageRef.current.focus();
    }
  }, []);

  return (
    <div className="audit-page" ref={pageRef} tabIndex="-1">

      {/* HEADER */}
      <header className="audit-header">
        <h1>Security Audits</h1>
        <p>
          Security audits help maintain a strong defense against cyber threats
          by continuously evaluating and improving banking security systems.
        </p>
      </header>

      {/* OVERVIEW */}
      <section className="audit-overview">
        <h2>What is a Security Audit?</h2>
        <p>
          A security audit is a systematic evaluation of an organization's
          information systems, policies, and controls. It identifies
          vulnerabilities, ensures compliance, and strengthens protection
          against cyber attacks.
        </p>
      </section>

      {/* STATS */}
      <section className="audit-stats">
        <div className="audit-card">
          <h2>100%</h2>
          <p>System Coverage</p>
        </div>

        <div className="audit-card">
          <h2>24/7</h2>
          <p>Monitoring Cycle</p>
        </div>

        <div className="audit-card">
          <h2>AI</h2>
          <p>Threat Detection</p>
        </div>

        <div className="audit-card">
          <h2>Zero</h2>
          <p>Tolerance Policy</p>
        </div>
      </section>

      {/* AUDIT TYPES */}
      <section className="audit-types">
        <h2>Types of Security Audits</h2>

        <div className="audit-grid">

          <div className="audit-box">
            <h3>Internal Audit</h3>
            <p>
              Conducted within the organization to evaluate internal controls,
              policies, and system integrity.
            </p>
          </div>

          <div className="audit-box">
            <h3>External Audit</h3>
            <p>
              Performed by independent security experts to ensure unbiased
              evaluation of security systems.
            </p>
          </div>

          <div className="audit-box">
            <h3>Compliance Audit</h3>
            <p>
              Ensures systems meet regulatory requirements like banking laws
              and data protection standards.
            </p>
          </div>

          <div className="audit-box">
            <h3>Penetration Testing</h3>
            <p>
              Simulates cyber attacks to find vulnerabilities before hackers
              exploit them.
            </p>
          </div>

        </div>
      </section>

      {/* AUDIT PROCESS */}
      <section className="audit-process">
        <h2>Audit Process</h2>

        <ol>
          <li>Identify assets and systems</li>
          <li>Analyze security policies</li>
          <li>Scan vulnerabilities</li>
          <li>Perform risk assessment</li>
          <li>Generate audit report</li>
          <li>Apply security improvements</li>
        </ol>
      </section>

      {/* BENEFITS */}
      <section className="audit-benefits">
        <h2>Benefits of Security Audits</h2>

        <ul>
          <li>✔ Detect hidden vulnerabilities</li>
          <li>✔ Improve system security strength</li>
          <li>✔ Ensure regulatory compliance</li>
          <li>✔ Prevent financial fraud</li>
          <li>✔ Enhance customer trust</li>
        </ul>
      </section>

      {/* LIVE STATUS */}
      <section className="audit-status">
        <h2>Live Audit Status</h2>

        <div className="audit-bar">
          <div className="audit-fill"></div>
        </div>

        <p>System Security Level: OPTIMAL</p>
      </section>

      {/* CTA */}
      <section className="audit-cta">
        <h2>Strengthen Your Security Today</h2>
        <p>
          Continuous audits ensure your banking system stays protected against
          evolving cyber threats.
        </p>

       <Link to ="/auditcta"> <button>Learn About Audits</button></Link>
      </section>

      {/* FOOTER */}
      <footer className="audit-footer">
        <p>© 2026 Banking Security Audit System. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default Audits;