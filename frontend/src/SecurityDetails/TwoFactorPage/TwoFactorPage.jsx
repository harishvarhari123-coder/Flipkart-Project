import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./TwoFactorPage.css";

const TwoFactorPage = () => {

  const methods = [
    {
      title: "SMS Verification",
      desc: "Receive secure one-time passwords directly on your mobile device.",
      path: "sms"
    },
    {
      title: "Authenticator App",
      desc: "Use Google Authenticator or Microsoft Authenticator for enhanced security.",
      path: "authenticator"
    },
    {
      title: "Email Verification",
      desc: "Receive verification links and codes through registered email.",
      path: "email"
    }
  ];

  // ✅ FIX: always open page from top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="twofactor-page">

      <section className="hero">
        <div className="hero-content">
          <h1>Two-Factor Authentication</h1>
          <p>
            Add an extra layer of protection to your banking account using
            secure verification methods.
          </p>
       <Link to = "/twostep">  <button className="primary-btn">
            Enable Protection
          </button></Link> 
        </div>
      </section>

      <section className="overview">
        <h2>Why Use Two-Factor Authentication?</h2>

        <div className="overview-grid">
          <div className="card">
            <h3>Enhanced Security</h3>
            <p>Protect your account even if your password becomes compromised.</p>
          </div>

          <div className="card">
            <h3>Fraud Prevention</h3>
            <p>Prevent unauthorized users from accessing sensitive information.</p>
          </div>

          <div className="card">
            <h3>Instant Verification</h3>
            <p>Verify login attempts quickly and securely from any device.</p>
          </div>
        </div>
      </section>

      <section className="methods">
        <h2>Available Verification Methods</h2>

        <div className="method-grid">
          {methods.map((item, index) => (
            <div className="method-card" key={index}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <button type="button">Learn More</button>
            </div>
          ))}
        </div>
      </section>

      <section className="steps">
        <h2>Setup Process</h2>

        <div className="steps-container">
          <div className="step">
            <span>1</span>
            <h4>Login</h4>
            <p>Sign in to your banking account.</p>
          </div>

          <div className="step">
            <span>2</span>
            <h4>Choose Method</h4>
            <p>Select SMS, Email, or Authenticator App.</p>
          </div>

          <div className="step">
            <span>3</span>
            <h4>Verify</h4>
            <p>Confirm your identity using the generated code.</p>
          </div>

          <div className="step">
            <span>4</span>
            <h4>Secure Access</h4>
            <p>Your account is now protected with two-factor authentication.</p>
          </div>
        </div>
      </section>

      <section className="faq">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-item">
          <h4>Is Two-Factor Authentication mandatory?</h4>
          <p>It is highly recommended for additional account security.</p>
        </div>

        <div className="faq-item">
          <h4>Can I change my verification method?</h4>
          <p>Yes, you can update your preferred method anytime.</p>
        </div>

        <div className="faq-item">
          <h4>What if I lose my phone?</h4>
          <p>Contact support immediately and use backup verification options.</p>
        </div>
      </section>

    </div>
  );
};

export default TwoFactorPage;