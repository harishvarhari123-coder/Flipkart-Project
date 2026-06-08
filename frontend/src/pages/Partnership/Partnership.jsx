import React, { useEffect, useRef, useState } from "react";
import "./Partnership.css";

const partners = [
  { id: 1, name: "Nexus Corp",      category: "Technology", description: "Strategic tech integration partner delivering cutting-edge infrastructure solutions.", logo: "NC", accent: "#00e5ff" },
  { id: 2, name: "Verde Capital",   category: "Finance",    description: "Investment partner focused on sustainable growth and long-term value creation.",    logo: "VC", accent: "#69ff57" },
  { id: 3, name: "Orion Media",     category: "Marketing",  description: "Creative powerhouse amplifying brand narratives across global markets.",            logo: "OM", accent: "#ff6b6b" },
  { id: 4, name: "Stellar Labs",    category: "Research",   description: "R&D partner pushing boundaries of innovation through collaborative science.",       logo: "SL", accent: "#c77dff" },
  { id: 5, name: "Atlas Logistics", category: "Operations", description: "End-to-end supply chain partner ensuring seamless global delivery.",                logo: "AL", accent: "#ffb703" },
  { id: 6, name: "PureData AI",     category: "AI & Data",  description: "Machine learning partner transforming raw data into actionable intelligence.",      logo: "PD", accent: "#4cc9f0" },
];

const stats = [
  { value: "120+", label: "Global Partners" },
  { value: "48",   label: "Countries" },
  { value: "$2.4B",label: "Combined Revenue" },
  { value: "98%",  label: "Retention Rate" },
];

/* ── Apply Now Modal ── */
function ApplyModal({ onClose }) {
  const [form, setForm]       = useState({ name: "", email: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors]   = useState({});
  const overlayRef            = useRef(null);

  /* Close on overlay click */
  const handleOverlay = (e) => { if (e.target === overlayRef.current) onClose(); };

  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.company.trim()) e.company = "Company is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    /* Simulate API call */
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      /* Auto-close after 3 seconds */
      setTimeout(() => onClose(), 3000);
    }, 1400);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlay} role="dialog" aria-modal="true" aria-label="Apply to become a partner">
      <div className={`modal-box ${success ? "modal-success-state" : ""}`}>

        {/* Close button */}
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {!success ? (
          <>
            <div className="modal-header">
              <span className="modal-eyebrow">Partnership Application</span>
              <h3 className="modal-title">Let's Build Together</h3>
              <p className="modal-subtitle">Fill in your details and our partnerships team will reach out within 48 hours.</p>
            </div>

            <form className="modal-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className={`form-group ${errors.name ? "has-error" : ""}`}>
                  <label htmlFor="p-name">Full Name</label>
                  <input
                    id="p-name"
                    type="text"
                    placeholder="John Smith"
                    value={form.name}
                    onChange={handleChange("name")}
                    disabled={loading}
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className={`form-group ${errors.email ? "has-error" : ""}`}>
                  <label htmlFor="p-email">Work Email</label>
                  <input
                    id="p-email"
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={handleChange("email")}
                    disabled={loading}
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
              </div>

              <div className={`form-group ${errors.company ? "has-error" : ""}`}>
                <label htmlFor="p-company">Company Name</label>
                <input
                  id="p-company"
                  type="text"
                  placeholder="Acme Inc."
                  value={form.company}
                  onChange={handleChange("company")}
                  disabled={loading}
                />
                {errors.company && <span className="field-error">{errors.company}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="p-message">Why do you want to partner? <span className="optional">(optional)</span></label>
                <textarea
                  id="p-message"
                  rows={4}
                  placeholder="Tell us about your business and goals..."
                  value={form.message}
                  onChange={handleChange("message")}
                  disabled={loading}
                />
              </div>

              <button className={`submit-btn ${loading ? "is-loading" : ""}`} type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" />
                    <span>Submitting…</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* ── Success state ── */
          <div className="success-body">
            <div className="success-icon">
              <svg viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="26" r="25" stroke="#00e5ff" strokeWidth="2" />
                <path d="M14 26l8 8 16-16" stroke="#00e5ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="success-title">Application Sent!</h3>
            <p className="success-msg">Thank you for your interest. Our team will contact you within <strong>48 hours</strong>.</p>
            <div className="success-timer">
              <div className="timer-bar" />
            </div>
            <p className="success-closing">This window closes automatically…</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function Partnership() {
  const [activeCard, setActiveCard] = useState(null);
  const [visible,    setVisible]    = useState(false);
  const [showModal,  setShowModal]  = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* Lock body scroll when modal is open */
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showModal]);

  return (
    <>
      <section className="partnership-section" ref={sectionRef}>
        <div className="partnership-grid-bg" aria-hidden="true" />
        <div className="orb orb-1" aria-hidden="true" />
        <div className="orb orb-2" aria-hidden="true" />
        <div className="orb orb-3" aria-hidden="true" />

        <div className={`partnership-container ${visible ? "is-visible" : ""}`}>

          {/* Header */}
          <div className="partnership-header">
            <span className="partnership-eyebrow">Ecosystem</span>
            <h2 className="partnership-title">
              Built on <em>Trust</em>.<br />Powered by <em>Partnership</em>.
            </h2>
            <p className="partnership-subtitle">
              We work with world-class partners across every domain — technology, finance, media, and beyond — to deliver outcomes that matter.
            </p>
          </div>

          {/* Stats */}
          <div className="stats-bar">
            {stats.map((stat, i) => (
              <div className="stat-item" key={i} style={{ "--delay": `${i * 0.1}s` }}>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Cards */}
          <div className="partners-grid">
            {partners.map((partner, i) => (
              <div
                className={`partner-card ${activeCard === partner.id ? "is-active" : ""}`}
                key={partner.id}
                style={{ "--accent": partner.accent, "--delay": `${i * 0.08}s` }}
                onMouseEnter={() => setActiveCard(partner.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="card-glow" aria-hidden="true" />
                <div className="card-inner">
                  <div className="partner-logo" style={{ "--accent": partner.accent }}>{partner.logo}</div>
                  <div className="partner-info">
                    <span className="partner-category">{partner.category}</span>
                    <h3 className="partner-name">{partner.name}</h3>
                    <p className="partner-description">{partner.description}</p>
                  </div>
                  <div className="card-arrow">→</div>
                </div>
                <div className="card-border" aria-hidden="true" />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="partnership-cta">
            <p className="cta-text">Interested in becoming a partner?</p>
            <button className="cta-button" onClick={() => setShowModal(true)}>
              <span>Apply Now</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>
      </section>

      {/* Modal */}
      {showModal && <ApplyModal onClose={() => setShowModal(false)} />}
    </>
  );
}