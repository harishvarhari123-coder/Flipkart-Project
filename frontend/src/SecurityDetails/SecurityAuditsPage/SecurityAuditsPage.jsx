import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./SecurityAuditsPage.css";

const SecurityAuditsPage = () => {
  const auditServices = [
    {
      title: "Internal Security Reviews",
      description:
        "Regular assessments ensure that banking systems comply with security standards and best practices."
    },
    {
      title: "Risk Assessment",
      description:
        "Identify vulnerabilities and evaluate risks before they impact customers or operations."
    },
    {
      title: "Compliance Verification",
      description:
        "Ensure alignment with industry regulations and security frameworks."
    },
    {
      title: "Third-Party Audits",
      description:
        "Independent experts validate security controls and recommend improvements."
    }
  ];

  const auditSteps = [
    {
      step: "01",
      title: "Planning",
      description:
        "Define audit objectives, scope, and security requirements."
    },
    {
      step: "02",
      title: "Assessment",
      description:
        "Review systems, applications, networks, and security controls."
    },
    {
      step: "03",
      title: "Reporting",
      description:
        "Document findings, vulnerabilities, and recommendations."
    },
    {
      step: "04",
      title: "Improvement",
      description:
        "Implement corrective actions and strengthen defenses."
    }
  ];

  const benefits = [
    "Enhanced Security",
    "Regulatory Compliance",
    "Reduced Risk Exposure",
    "Improved Customer Trust",
    "Continuous Improvement",
    "Better Incident Prevention"
  ];

  // ✅ FIX: always open page from TOP
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="security-audits-page">

      {/* Hero Section */}
      <section className="audit-hero">
        <div className="audit-hero-content">
          <h1>Security Audits</h1>
          <p>
            Security audits help maintain a strong defense against cyber threats
            by continuously evaluating and improving banking security systems.
          </p>

      <Link to ="/audits">    <button className="audit-btn" type="button">
            Learn About Audits
          </button></Link>
        </div>
      </section>

      {/* Services */}
      <section className="audit-services">
        <div className="container">
          <h2>Audit Services</h2>

          <div className="audit-grid">
            {auditServices.map((service, index) => (
              <div className="audit-card" key={index}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="audit-process">
        <div className="container">
          <h2>Audit Process</h2>

          <div className="process-grid">
            {auditSteps.map((item, index) => (
              <div className="process-card" key={index}>
                <div className="step-number">{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="audit-benefits">
        <div className="container">
          <h2>Benefits of Security Audits</h2>

          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div className="benefit-card" key={index}>
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="audit-stats">
        <div className="container">
          <h2>Audit Highlights</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>100%</h3>
              <p>Compliance Monitoring</p>
            </div>

            <div className="stat-card">
              <h3>24/7</h3>
              <p>Security Oversight</p>
            </div>

            <div className="stat-card">
              <h3>99%</h3>
              <p>Threat Detection Success</p>
            </div>

            <div className="stat-card">
              <h3>Annual</h3>
              <p>Independent Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="audit-faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>

          <div className="faq-card">
            <h4>Why are security audits important?</h4>
            <p>
              They identify vulnerabilities and ensure systems remain protected
              against evolving cyber threats.
            </p>
          </div>

          <div className="faq-card">
            <h4>How often are audits performed?</h4>
            <p>
              Audits are conducted regularly and supplemented by continuous
              monitoring activities.
            </p>
          </div>

          <div className="faq-card">
            <h4>Do audits improve compliance?</h4>
            <p>
              Yes, audits help ensure adherence to security standards and
              regulatory requirements.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default SecurityAuditsPage;