import React, { useEffect, useRef } from "react";
import "./Secure.css";

const paymentMethods = [
  {
    icon: "💳",
    title: "Credit & Debit Cards",
    desc: "Visa, Mastercard, RuPay, and American Express accepted",
    badges: ["Visa", "Mastercard", "RuPay", "Amex"]
  },
  {
    icon: "📱",
    title: "UPI Payments",
    desc: "Google Pay, PhonePe, Paytm, and all UPI apps",
    badges: ["GPay", "PhonePe", "Paytm"]
  },
  {
    icon: "🏦",
    title: "Net Banking",
    desc: "All major Indian banks supported instantly",
    badges: ["SBI", "HDFC", "ICICI", "Axis"]
  },
  {
    icon: "💰",
    title: "Wallets",
    desc: "Paytm, PhonePe, Amazon Pay, and more",
    badges: ["Paytm", "PhonePe", "Amazon Pay"]
  },
  {
    icon: "💵",
    title: "Cash on Delivery",
    desc: "Pay when you receive your order",
    badges: ["COD Available"]
  },
  {
    icon: "🔄",
    title: "EMI Options",
    desc: "No-cost EMI available on select cards",
    badges: ["0% Interest"]
  }
];

const securityFeatures = [
  {
    icon: "🔐",
    title: "256-bit SSL Encryption",
    desc: "Bank-grade encryption protects every transaction"
  },
  {
    icon: "🛡️",
    title: "PCI-DSS Certified",
    desc: "Level 1 compliance for payment security"
  },
  {
    icon: "🔒",
    title: "No Card Storage",
    desc: "Your card details are never saved on our servers"
  },
  {
    icon: "✅",
    title: "3D Secure Verification",
    desc: "Additional OTP authentication for all transactions"
  }
];

const trustedPartners = [
  { name: "Razorpay", logo: "💎" },
  { name: "Paytm", logo: "💙" },
  { name: "PhonePe", logo: "💜" },
  { name: "Google Pay", logo: "🔵" },
  { name: "Visa", logo: "💳" },
  { name: "Mastercard", logo: "🔴" }
];

export default function SecurePayment() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Auto-focus the container when component mounts
    if (containerRef.current) {
      containerRef.current.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="secure-payment-page" ref={containerRef} tabIndex={0}>
      {/* Hero Section */}
      <div className="payment-hero">
        <div className="hero-badge">
          <span className="badge-icon">🔐</span>
          <span className="badge-text">100% SECURE PAYMENTS</span>
        </div>
        <h1 className="payment-title">Safe & Secure Payments</h1>
        <p className="payment-subtitle">
          Shop with confidence. Your payment information is protected with 
          industry-leading encryption and security standards.
        </p>
        <div className="hero-shield-icon">💳</div>
      </div>

      {/* Payment Methods Section */}
      <section className="payment-methods-section">
        <div className="section-header">
          <h2 className="section-title">Multiple Payment Options</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">Choose your preferred payment method</p>
        </div>

        <div className="payment-methods-grid">
          {paymentMethods.map((method, index) => (
            <div className="payment-card" key={index}>
              <div className="payment-icon">{method.icon}</div>
              <h3 className="payment-method-title">{method.title}</h3>
              <p className="payment-method-desc">{method.desc}</p>
              <div className="payment-badges">
                {method.badges.map((badge, i) => (
                  <span className="payment-badge" key={i}>{badge}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Features Section */}
      <section className="security-features-section">
        <div className="section-header">
          <h2 className="section-title">Why Your Payments Are Safe</h2>
          <div className="section-divider"></div>
        </div>

        <div className="security-grid">
          {securityFeatures.map((feature, index) => (
            <div className="security-feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h4 className="feature-title">{feature.title}</h4>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How Secure Payment Works</h2>
          <div className="section-divider"></div>
        </div>

        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Choose Payment Method</h4>
              <p>Select from cards, UPI, net banking, wallets, or COD</p>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Secure Verification</h4>
              <p>OTP verification ensures only you can authorize</p>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Payment Complete</h4>
              <p>Instant confirmation and order processing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Partners Section */}
      <section className="trusted-partners-section">
        <div className="section-header">
          <h2 className="section-title">Trusted Payment Partners</h2>
          <div className="section-divider"></div>
          <p className="section-subtitle">We work with India's most trusted payment providers</p>
        </div>

        <div className="partners-grid">
          {trustedPartners.map((partner, index) => (
            <div className="partner-card" key={index}>
              <div className="partner-logo">{partner.logo}</div>
              <p className="partner-name">{partner.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Money Back Guarantee Section */}
      <section className="guarantee-section">
        <div className="guarantee-card">
          <div className="guarantee-icon">💯</div>
          <h3 className="guarantee-title">100% Money Back Guarantee</h3>
          <p className="guarantee-desc">
            If you face any payment issues or unauthorized transactions, 
            we ensure full refund within 5-7 business days. Your money is safe with us.
          </p>
          <div className="guarantee-features">
            <div className="guarantee-item">
              <span className="check-icon">✓</span>
              <span>Instant Refunds</span>
            </div>
            <div className="guarantee-item">
              <span className="check-icon">✓</span>
              <span>24/7 Support</span>
            </div>
            <div className="guarantee-item">
              <span className="check-icon">✓</span>
              <span>Buyer Protection</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-header">
          <h2 className="section-title">Common Questions</h2>
          <div className="section-divider"></div>
        </div>

        <div className="faq-container">
          <div className="faq-item">
            <h4 className="faq-question">Is it safe to save my card details?</h4>
            <p className="faq-answer">
              Yes, we use tokenization. Your actual card details are never stored. 
              Only encrypted tokens are saved for future convenience.
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">What if my payment fails?</h4>
            <p className="faq-answer">
              If payment fails, the amount will be auto-refunded to your account within 5-7 business days. 
              You can retry with another payment method.
            </p>
          </div>

          <div className="faq-item">
            <h4 className="faq-question">Are there any hidden charges?</h4>
            <p className="faq-answer">
              No hidden charges. The amount shown at checkout is final. 
              COD orders may have nominal handling charges clearly mentioned.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="payment-footer">
        <p className="footer-note">
          <strong>Need Help?</strong> Contact our payment support team at{" "}
          <a href="mailto:payments@harikart.com">payments@harikart.com</a> or call{" "}
          <a href="tel:1800-123-4567">1800-123-4567</a> (Toll Free)
        </p>
      </div>
    </div>
  );
}