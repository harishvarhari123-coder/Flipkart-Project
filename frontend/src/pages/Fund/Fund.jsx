import React, { useState, useEffect } from "react";
import "./Fund.css";

const faqs = [
  {
    q: "How long does a refund take?",
    a: "Refunds are processed within 5–7 business days after approval. Bank delays may vary depending on your payment provider.",
  },
  {
    q: "Can I return used products?",
    a: "Only unused and undamaged products are eligible for return. Items must include original packaging and tags.",
  },
  {
    q: "Who pays return shipping?",
    a: "HariKart covers return shipping only for damaged or incorrect items. Otherwise, customers bear return shipping costs.",
  },
  {
    q: "What items are non-returnable?",
    a: "Perishable goods, personal care items, and digital products cannot be returned once purchased.",
  },
];

const steps = [
  {
    title: "Request Return",
    desc: "Go to your order page and select the item you want to return within 7 days of delivery.",
  },
  {
    title: "Pickup Scheduling",
    desc: "Our logistics partner will schedule a pickup from your address within 24–48 hours.",
  },
  {
    title: "Quality Check",
    desc: "Returned items are inspected at our warehouse to ensure eligibility.",
  },
  {
    title: "Refund Processing",
    desc: "Once approved, refund is initiated to your original payment method.",
  },
];

export default function Fund() {
  const [open, setOpen] = useState(null);

  // ✅ FIX: always scroll to top when page opens
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // you can change to "auto" if you want instant jump
    });

    // ✅ extra safety: remove unwanted focus (prevents autofocus issues)
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  return (
    <div className="fund-page">

      {/* HERO */}
      <section className="fund-hero">
        <div className="fund-glow"></div>

        <p className="fund-badge">Returns & Refund Policy</p>

        <h1 className="fund-title">
          Hassle-free <span>Returns</span> <br /> & Instant Refunds
        </h1>

        <p className="fund-subtitle">
          At HariKart, we ensure a smooth, transparent, and customer-first return
          experience. If you're not satisfied, we’ve got you covered.
        </p>

        <div className="fund-meta">
          <div>Last updated: June 2026</div>
          <div className="dot">•</div>
          <div>Customer Protection Policy</div>
        </div>
      </section>

      {/* POLICY SECTION */}
      <section className="fund-section">
        <h2>Return Policy Overview</h2>
        <p>
          We offer a <b>7-day return window</b> on most products. Items must be
          returned in original condition with all accessories and packaging intact.
          Once the return is received and inspected, refunds are processed to the
          original payment method.
        </p>

        <div className="fund-grid">
          <div className="fund-card">
            <h3>✔ Eligible Returns</h3>
            <ul>
              <li>Unused items in original packaging</li>
              <li>Damaged or defective products</li>
              <li>Wrong items delivered</li>
            </ul>
          </div>

          <div className="fund-card danger">
            <h3>✖ Not Eligible</h3>
            <ul>
              <li>Used or washed products</li>
              <li>Digital downloads</li>
              <li>Personal care items</li>
            </ul>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="fund-section">
        <h2>How Returns Work</h2>
        <div className="fund-timeline">
          {steps.map((s, i) => (
            <div className="fund-step" key={i}>
              <div className="fund-step-num">{i + 1}</div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REFUND INFO */}
      <section className="fund-section">
        <h2>Refund Processing</h2>
        <p>
          Refunds are initiated after successful quality inspection. Depending on
          your payment method, it may take 5–7 business days to reflect in your
          account.
        </p>

        <div className="fund-highlight">
          <div>
            <h3>💳 Payment Methods</h3>
            <p>UPI, Credit Card, Debit Card, Wallets & Net Banking</p>
          </div>
          <div>
            <h3>⏱ Processing Time</h3>
            <p>2–3 days (inspection) + 3–5 days (bank processing)</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="fund-section">
        <h2>Frequently Asked Questions</h2>

        <div className="fund-faq">
          {faqs.map((f, i) => (
            <div
              key={i}
              className={`fund-faq-item ${open === i ? "open" : ""}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <div className="fund-faq-q">
                {f.q}
                <span>{open === i ? "−" : "+"}</span>
              </div>

              {open === i && <p className="fund-faq-a">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="fund-footer">
        <p>
          Need help with a return? Contact us at{" "}
          <a href="mailto:support@harikart.com">support@harikart.com</a>
        </p>
        <small>© 2026 HariKart. All rights reserved.</small>
      </footer>
    </div>
  );
}