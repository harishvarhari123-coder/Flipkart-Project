import React, { useState } from "react";
import "./GetStarted.css";
import { Link } from "react-router-dom";

const GetStart = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep((prev) => (prev < 4 ? prev + 1 : 4));
  };

  const prevStep = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="gs-page">

      {/* HEADER */}
      <section className="gs-header">
        <h1>Get Started with Fraud Protection</h1>
        <p>
          Set up your intelligent fraud monitoring system in just a few steps
          and secure your account instantly.
        </p>
      </section>

      {/* STEP INDICATOR */}
      <div className="gs-steps">
        <div className={step >= 1 ? "active" : ""}>1</div>
        <div className={step >= 2 ? "active" : ""}>2</div>
        <div className={step >= 3 ? "active" : ""}>3</div>
        <div className={step >= 4 ? "active" : ""}>4</div>
      </div>

      {/* STEP CONTENT */}
      <section className="gs-content">

        {/* STEP 1 */}
        {step === 1 && (
          <div className="gs-box">
            <h2>Step 1: Account Setup</h2>
            <p>
              Create or verify your account to activate fraud monitoring
              services. This ensures your identity is secured before enabling
              protection systems.
            </p>

            <ul>
              <li>✔ Enter valid email address</li>
              <li>✔ Verify mobile number</li>
              <li>✔ Create a strong password</li>
              <li>✔ Enable login security</li>
            </ul>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="gs-box">
            <h2>Step 2: Enable Security Layer</h2>
            <p>
              Activate multi-layer fraud protection systems that continuously
              monitor your account activity.
            </p>

            <ul>
              <li>✔ AI fraud detection engine</li>
              <li>✔ Device recognition system</li>
              <li>✔ Location-based alerts</li>
              <li>✔ Risk scoring activation</li>
            </ul>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="gs-box">
            <h2>Step 3: Verify Your Identity</h2>
            <p>
              Complete identity verification to ensure only authorized access
              is granted to your account.
            </p>

            <ul>
              <li>✔ Upload ID proof</li>
              <li>✔ Face verification (AI scan)</li>
              <li>✔ OTP confirmation</li>
              <li>✔ Secure device pairing</li>
            </ul>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="gs-box">
            <h2>Step 4: Activation Complete</h2>
            <p>
              Your fraud monitoring system is now fully active and protecting
              your account in real-time.
            </p>

            <ul>
              <li>✔ Real-time monitoring enabled</li>
              <li>✔ Alerts activated</li>
              <li>✔ Auto-block system active</li>
              <li>✔ Secure dashboard unlocked</li>
            </ul>

        <Link to ="/dashboard">   <button className="gs-final-btn">
              Go to Dashboard
            </button></Link> 
          </div>
        )}
      </section>

      {/* NAVIGATION BUTTONS */}
      <div className="gs-nav">
        <button onClick={prevStep}>Previous</button>
        <button onClick={nextStep}>Next</button>
      </div>

      {/* INFO SECTION */}
      <section className="gs-info">

        <h2>Why Fraud Monitoring Matters</h2>

        <p>
          Fraud attacks are becoming more advanced every day. Our system uses
          artificial intelligence and behavioral analytics to stop threats
          before they happen.
        </p>

        <div className="gs-grid">

          <div className="gs-card">
            <h3>AI Intelligence</h3>
            <p>
              Continuously learns patterns and adapts to new fraud techniques.
            </p>
          </div>

          <div className="gs-card">
            <h3>Instant Alerts</h3>
            <p>
              Notifies you immediately when suspicious activity is detected.
            </p>
          </div>

          <div className="gs-card">
            <h3>Auto Protection</h3>
            <p>
              Automatically blocks unauthorized transactions in real time.
            </p>
          </div>

          <div className="gs-card">
            <h3>Secure Encryption</h3>
            <p>
              Uses strong encryption to protect all sensitive user data.
            </p>
          </div>

        </div>
      </section>

      {/* CHECKLIST SECTION */}
      <section className="gs-checklist">
        <h2>Security Checklist</h2>

        <label><input type="checkbox" /> Enable 2FA authentication</label>
        <label><input type="checkbox" /> Verify email address</label>
        <label><input type="checkbox" /> Secure device setup</label>
        <label><input type="checkbox" /> Activate fraud alerts</label>
        <label><input type="checkbox" /> Review account activity</label>
      </section>

      {/* FOOTER */}
      <footer className="gs-footer">
        <p>© 2026 Fraud Monitoring System - Secure Digital Protection</p>
      </footer>

    </div>
  );
};

export default GetStart;