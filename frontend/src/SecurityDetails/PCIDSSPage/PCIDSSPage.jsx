import React, { useEffect, useRef } from "react";
import "./PCIDSSPage.css";
import { Link } from "react-router-dom";

const complianceFeatures = [
  {
    icon: "💳",
    title: "Secure Card Processing",
    description:
      "All payment transactions are processed through PCI-DSS certified gateways with advanced fraud protection mechanisms."
  },
  {
    icon: "🔐",
    title: "Encrypted Transactions",
    description:
      "Sensitive payment information is encrypted during transmission and processing using industry-standard protocols."
  },
  {
    icon: "🛡️",
    title: "Data Protection",
    description:
      "Customer payment information is protected through multiple layers of security and access controls."
  },
  {
    icon: "📊",
    title: "Continuous Monitoring",
    description:
      "Real-time transaction monitoring helps identify suspicious activity and security threats."
  }
];

const complianceSteps = [
  {
    step: "01",
    title: "Card Information Submitted",
    description:
      "Customer enters payment details through a secure checkout process."
  },
  {
    step: "02",
    title: "Encrypted Transmission",
    description:
      "Payment data is encrypted before transmission to certified payment processors."
  },
  {
    step: "03",
    title: "Verification & Authorization",
    description:
      "Banks and payment networks validate and authorize the transaction securely."
  },
  {
    step: "04",
    title: "Transaction Completed",
    description:
      "Payment is processed while maintaining strict PCI compliance standards."
  }
];

const faqs = [
  {
    question: "What is PCI-DSS?",
    answer:
      "PCI-DSS stands for Payment Card Industry Data Security Standard, a globally recognized framework for protecting cardholder information."
  },
  {
    question: "Does Harikart store my card details?",
    answer:
      "No. Card details are securely processed through certified payment gateways and are never permanently stored on our systems."
  },
  {
    question: "How are online payments protected?",
    answer:
      "Payments are protected using encryption, tokenization, fraud detection systems, and PCI-compliant infrastructure."
  }
];

export default function PCIDSSPage() {
  const learnMoreBtnRef = useRef(null);

  useEffect(() => {
    // ✅ FIX: always open from top
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    // optional safe focus without scroll jump
    if (learnMoreBtnRef.current) {
      learnMoreBtnRef.current.focus({ preventScroll: true });
    }
  }, []);

  return (
    <div className="pci-page">

      {/* HERO SECTION */}
      <section className="pci-hero">
        <div className="pci-overlay"></div>

        <div className="pci-hero-content">
          <span className="pci-badge">
            PCI DSS LEVEL 1 CERTIFIED
          </span>

          <h1>
            Secure Payments with
            <span> PCI-DSS Compliance</span>
          </h1>

          <p>
            At Harikart, protecting your payment information is a top priority.
            We partner with trusted PCI-DSS certified payment providers to ensure
            every transaction is secure, encrypted, and compliant with global standards.
          </p>

          <div className="hero-buttons">
          <Link to="/pci">
   <button
              ref={learnMoreBtnRef}
              className="primary-btn"
              type="button"
            >
              Learn More
            </button></Link>

        <Link to="/securitystandards">   <button className="secondary-btn" type="button">
              Security Standards
            </button></Link> 
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="pci-overview">
        <div className="section-header">
          <h2>What is PCI-DSS Compliance?</h2>
          <p>
            PCI-DSS is a global security standard designed to ensure that businesses
            handle payment card information securely. It establishes strict requirements
            for data protection, network security, monitoring, and access control.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>256-bit</h3>
            <p>Encryption Standard</p>
          </div>

          <div className="stat-card">
            <h3>24/7</h3>
            <p>Transaction Monitoring</p>
          </div>

          <div className="stat-card">
            <h3>100%</h3>
            <p>Secure Payment Processing</p>
          </div>

          <div className="stat-card">
            <h3>Level 1</h3>
            <p>PCI Certification</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="section-header">
          <h2>Key Security Features</h2>
          <p>
            Multiple security layers work together to keep your payment information safe.
          </p>
        </div>

        <div className="features-grid">
          {complianceFeatures.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="process-section">
        <div className="section-header">
          <h2>How Secure Payments Work</h2>
        </div>

        <div className="timeline">
          {complianceSteps.map((item, index) => (
            <div className="timeline-card" key={index}>
              <span className="timeline-step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPLIANCE BANNER */}
      <section className="compliance-banner">
        <div className="banner-content">
          <h2>Industry-Leading Payment Security</h2>
          <p>
            Harikart follows internationally recognized standards to ensure
            customer trust and payment protection.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <div className="faq-card" key={index}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Shop with Confidence</h2>
        <p>
          Every transaction on Harikart is protected through enterprise-grade security.
        </p>
                <Link to="/products">
        <button className="primary-btn" type="button">
            Start Shopping Securely
        </button>
        </Link>
      </section>

    </div>
  );
}