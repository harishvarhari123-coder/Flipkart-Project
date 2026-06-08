import React, { useState, useEffect, useRef } from "react";
import "./Privacy.css";

const sections = [
  {
    id: "collect",
    icon: "◈",
    title: "What We Collect",
    body: "We collect your name, email, phone number, delivery address, and browsing/purchase history on our platform.",
    tags: ["Name", "Email", "Phone", "Address", "History"],
  },
  {
    id: "use",
    icon: "◎",
    title: "How We Use It",
    body: "Your data is used to process orders, personalize your experience, send updates, and improve our services.",
    tags: ["Orders", "Personalization", "Updates", "Analytics"],
  },
  {
    id: "sharing",
    icon: "◉",
    title: "Data Sharing",
    body: "We share data only with delivery partners and payment gateways necessary to fulfill your order. We never sell your data.",
    tags: ["Delivery Partners", "Payment Gateways"],
  },
  {
    id: "cookies",
    icon: "◐",
    title: "Cookies",
    body: "We use cookies to maintain sessions and analyze usage. You can disable cookies in your browser settings.",
    tags: ["Session Cookies", "Analytics Cookies"],
  },
  {
    id: "rights",
    icon: "◑",
    title: "Your Rights",
    body: "You have the right to access, update, or delete your personal data. Contact us at privacy@harikart.com.",
    tags: ["Access", "Update", "Delete", "Contact"],
  },
  {
    id: "retention",
    icon: "◒",
    title: "Data Retention",
    body: "We retain your data as long as your account is active or as required by applicable law.",
    tags: ["Account Lifetime", "Legal Compliance"],
  },
];

const useIntersect = (options) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, options);
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

const SectionCard = ({ section, index }) => {
  const [ref, visible] = useIntersect({ threshold: 0.15 });
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="priv-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.55s ease ${index * 0.08}s, transform 0.55s ease ${index * 0.08}s`,
        background: hovered ? "#fdfdfc" : "#ffffff",
        borderColor: hovered ? "#b8b5ac" : "#e6e4de",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="priv-card-num">{String(index + 1).padStart(2, "0")}</div>
      <div className="priv-card-body">
        <div className="priv-card-top">
          <span className="priv-card-icon">{section.icon}</span>
          <h3 className="priv-card-title">{section.title}</h3>
        </div>
        <p className="priv-card-text">{section.body}</p>
        <div className="priv-tags">
          {section.tags.map((t) => (
            <span key={t} className="priv-tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Privacy() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500&display=swap');
      `}</style>

      <div className="priv-page">
        {/* Ambient background shapes */}
        <div className="priv-bg-shape priv-bg-shape--1" />
        <div className="priv-bg-shape priv-bg-shape--2" />

        {/* Sticky nav bar */}
        <nav className={`priv-nav${scrolled ? " priv-nav--scrolled" : ""}`}>
          <span className="priv-nav-brand">HariKart</span>
          <span className="priv-nav-label">Privacy Policy</span>
        </nav>

        {/* Hero header */}
        <header className="priv-header">
          <div className="priv-header-inner">
            <p className="priv-eyebrow">Legal · Privacy</p>
            <h1 className="priv-h1">
              Your privacy,<br />
              <em>our responsibility.</em>
            </h1>
            <p className="priv-subtitle">
              How we collect, use, and protect your information at HariKart.
            </p>
            <div className="priv-meta">
              <span className="priv-badge">Last updated: May 2026</span>
              <span className="priv-dot-sep">·</span>
              <span className="priv-count">{sections.length} sections</span>
            </div>
          </div>
          <div className="priv-header-rule" />
        </header>

        {/* Index strip */}
        <div className="priv-index">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="priv-index-item">
              {s.title}
            </a>
          ))}
        </div>

        {/* Sections */}
        <main className="priv-main">
          {sections.map((s, i) => (
            <div id={s.id} key={s.id}>
              <SectionCard section={s} index={i} />
            </div>
          ))}
        </main>

        {/* Footer */}
        <footer className="priv-footer">
          <p className="priv-footer-text">
            Questions about your data?{" "}
            <a href="mailto:privacy@harikart.com" className="priv-footer-link">
              privacy@harikart.com
            </a>
          </p>
          <p className="priv-footer-copy">© 2026 HariKart. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}