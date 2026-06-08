import React, { useState } from "react";

const tokens = {
  fontSans: `"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
  fontMono: `"DM Mono", "Fira Code", monospace`,
  radius: { sm: "6px", md: "10px", lg: "14px", xl: "20px" },
  color: {
    bg: "#f9f8f5",
    surface: "#ffffff",
    surfaceAlt: "#f4f3ef",
    border: "#e6e4de",
    borderStrong: "#ccc9c0",
    text: "#1c1b18",
    textMuted: "#6b6960",
    textFaint: "#a3a097",
    purple50: "#EEEDFE",
    purple600: "#534AB7",
    purple800: "#3C3489",
    blue50: "#E6F1FB",
    blue600: "#185FA5",
    blue800: "#0C447C",
    green50: "#EAF3DE",
    green600: "#3B6D11",
    teal50: "#E1F5EE",
    teal600: "#0F6E56",
    amber50: "#FAEEDA",
    amber600: "#854F0B",
  },
};

const S = {
  wrap: {
    fontFamily: tokens.fontSans,
    background: tokens.color.bg,
    color: tokens.color.text,
    minHeight: "100vh",
  },

  hero: {
    padding: "4rem 2rem 3.5rem",
    textAlign: "center",
    background: tokens.color.surface,
    borderBottom: `1px solid ${tokens.color.border}`,
  },
  heroEyebrow: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: tokens.color.purple600,
    background: tokens.color.purple50,
    padding: "4px 12px",
    borderRadius: "99px",
    marginBottom: "1.25rem",
  },
  heroH1: {
    fontSize: "clamp(28px, 5vw, 40px)",
    fontWeight: 500,
    lineHeight: 1.2,
    marginBottom: "0.75rem",
    letterSpacing: "-0.02em",
  },
  heroSub: {
    fontSize: "15px",
    color: tokens.color.textMuted,
    maxWidth: "460px",
    margin: "0 auto 2rem",
    lineHeight: 1.7,
  },
  searchWrap: {
    position: "relative",
    maxWidth: "420px",
    margin: "0 auto",
  },
  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: tokens.color.textFaint,
    pointerEvents: "none",
    fontSize: "15px",
    lineHeight: 1,
  },
  searchInput: {
    width: "100%",
    padding: "12px 14px 12px 40px",
    border: `1px solid ${tokens.color.border}`,
    borderRadius: tokens.radius.lg,
    background: tokens.color.surfaceAlt,
    fontSize: "14px",
    color: tokens.color.text,
    outline: "none",
    fontFamily: "inherit",
  },

  section: {
    padding: "2.5rem 2rem",
    borderBottom: `1px solid ${tokens.color.border}`,
    maxWidth: "860px",
    margin: "0 auto",
  },
  sectionH2: {
    fontSize: "16px",
    fontWeight: 500,
    marginBottom: "1.25rem",
    color: tokens.color.text,
    letterSpacing: "-0.01em",
  },

  catGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "10px",
  },
  catCard: {
    background: tokens.color.surface,
    border: `1px solid ${tokens.color.border}`,
    borderRadius: tokens.radius.lg,
    padding: "1.25rem",
    cursor: "pointer",
    transition: "border-color 0.15s, transform 0.15s",
  },
  catIcon: {
    width: "36px",
    height: "36px",
    borderRadius: tokens.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10px",
    fontSize: "16px",
  },
  catH3: {
    fontSize: "13px",
    fontWeight: 500,
    marginBottom: "4px",
  },
  catP: {
    fontSize: "12px",
    color: tokens.color.textMuted,
    lineHeight: 1.55,
  },

  articleList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "7px",
  },
  articleItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 13px",
    fontSize: "13px",
    color: tokens.color.textMuted,
    background: tokens.color.surface,
    border: `1px solid ${tokens.color.border}`,
    borderRadius: tokens.radius.md,
    cursor: "pointer",
    transition: "color 0.15s, border-color 0.15s",
  },
  articleDot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: tokens.color.purple600,
    flexShrink: 0,
  },

  faqList: { display: "flex", flexDirection: "column", gap: "8px" },
  faqItem: {
    border: `1px solid ${tokens.color.border}`,
    borderRadius: tokens.radius.lg,
    background: tokens.color.surface,
    overflow: "hidden",
  },
  faqBtn: {
    width: "100%",
    background: "none",
    border: "none",
    padding: "14px 16px",
    fontSize: "13px",
    fontWeight: 500,
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    color: tokens.color.text,
    fontFamily: "inherit",
  },
  faqChevron: {
    fontSize: "14px",
    color: tokens.color.textFaint,
    flexShrink: 0,
    transition: "transform 0.2s",
  },
  faqAnswer: {
    fontSize: "13px",
    color: tokens.color.textMuted,
    lineHeight: 1.7,
    padding: "0 16px 14px",
  },
  faqEmpty: {
    fontSize: "13px",
    color: tokens.color.textFaint,
    padding: "0.5rem 0",
  },

  guideGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "10px",
  },
  guideCard: {
    border: `1px solid ${tokens.color.border}`,
    borderRadius: tokens.radius.lg,
    padding: "1.25rem",
    background: tokens.color.surface,
  },
  guideIconWrap: {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: tokens.radius.md,
    marginBottom: "12px",
    fontSize: "16px",
  },
  guideH3: { fontSize: "13px", fontWeight: 500, marginBottom: "5px" },
  guideP: { fontSize: "12px", color: tokens.color.textMuted, lineHeight: 1.6 },

  troubleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "10px",
  },
  troubleBox: {
    borderLeft: "2px solid",
    borderRadius: `0 ${tokens.radius.md} ${tokens.radius.md} 0`,
    padding: "12px 14px",
    background: tokens.color.surfaceAlt,
  },
  troubleH3: { fontSize: "13px", fontWeight: 500, marginBottom: "4px" },
  troubleP: { fontSize: "12px", color: tokens.color.textMuted, lineHeight: 1.55 },

  form: { display: "flex", flexDirection: "column", gap: "10px", maxWidth: "520px" },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  formInput: {
    padding: "10px 12px",
    border: `1px solid ${tokens.color.border}`,
    borderRadius: tokens.radius.md,
    background: tokens.color.surface,
    fontSize: "13px",
    color: tokens.color.text,
    fontFamily: "inherit",
    outline: "none",
  },
  formTextarea: {
    padding: "10px 12px",
    border: `1px solid ${tokens.color.border}`,
    borderRadius: tokens.radius.md,
    background: tokens.color.surface,
    fontSize: "13px",
    color: tokens.color.text,
    fontFamily: "inherit",
    outline: "none",
    resize: "vertical",
  },
  formBtn: {
    alignSelf: "flex-start",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "10px 20px",
    border: `1px solid ${tokens.color.borderStrong}`,
    borderRadius: tokens.radius.md,
    background: tokens.color.text,
    color: tokens.color.bg,
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "opacity 0.15s, transform 0.1s",
  },

  footer: {
    textAlign: "center",
    padding: "3rem 2rem",
    maxWidth: "860px",
    margin: "0 auto",
  },
  footerH2: { fontSize: "16px", fontWeight: 500, marginBottom: "0.75rem" },
  footerP: {
    fontSize: "13px",
    color: tokens.color.textMuted,
    maxWidth: "400px",
    margin: "0 auto 1.5rem",
    lineHeight: 1.7,
  },
  footerLinks: { display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" },
  footerLink: {
    fontSize: "13px",
    color: tokens.color.textMuted,
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
};

const categories = [
  { label: "Account", desc: "Settings and security.", icon: "👤", bg: tokens.color.purple50, color: tokens.color.purple800 },
  { label: "Billing", desc: "Payments and invoices.", icon: "💳", bg: tokens.color.green50, color: tokens.color.green600 },
  { label: "Technical", desc: "Troubleshooting support.", icon: "🔧", bg: tokens.color.blue50, color: tokens.color.blue800 },
  { label: "Privacy", desc: "Data and controls.", icon: "🔒", bg: tokens.color.teal50, color: tokens.color.teal600 },
];

const articles = [
  "Getting started guide",
  "Account verification process",
  "Managing your subscription",
  "Security best practices",
  "Using two-factor authentication",
  "Updating profile information",
];

const faqs = [
  { question: "How do I create an account?", answer: "Click the Sign Up button on the homepage and complete the registration form." },
  { question: "How can I reset my password?", answer: "Use the Forgot Password option on the login page and follow the instructions sent to your email." },
  { question: "How do I contact support?", answer: "You can contact our support team using the support form below on this page." },
  { question: "Can I change my email address?", answer: "Yes. Navigate to Account Settings and update your email information there." },
  { question: "How do I delete my account?", answer: "Visit Privacy Settings and select Delete Account to permanently remove your account." },
];

const guides = [
  { title: "Beginner guide", desc: "Learn the basics and start using all available features.", bg: tokens.color.purple50, color: tokens.color.purple600, icon: "🚀" },
  { title: "Advanced features", desc: "Explore advanced settings and productivity tools.", bg: tokens.color.blue50, color: tokens.color.blue600, icon: "⚡" },
  { title: "Security guide", desc: "Secure your account and protect your data.", bg: tokens.color.green50, color: tokens.color.green600, icon: "🛡️" },
];

const troubleItems = [
  { title: "Login issues", desc: "Clear browser cache and verify your credentials are correct.", accent: tokens.color.purple600 },
  { title: "Payment problems", desc: "Verify card details and check payment status with your bank.", accent: tokens.color.green600 },
  { title: "Website performance", desc: "Update your browser and check internet connectivity.", accent: tokens.color.blue600 },
];

const FaqItem = ({ faq }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={S.faqItem}>
      <button
        style={S.faqBtn}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {faq.question}
        <span
          style={{
            ...S.faqChevron,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▾
        </span>
      </button>
      {open && <div style={S.faqAnswer}>{faq.answer}</div>}
    </div>
  );
};

const HelpCenter = () => {
  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=DM+Mono:wght@400&display=swap');
        .hc-search:focus { border-color: #534AB7 !important; box-shadow: 0 0 0 3px rgba(83,74,183,0.12) !important; }
        .hc-input:focus { border-color: #534AB7 !important; box-shadow: 0 0 0 3px rgba(83,74,183,0.12) !important; }
        .hc-cat:hover { border-color: #ccc9c0 !important; transform: translateY(-1px) !important; }
        .hc-article:hover { color: #1c1b18 !important; border-color: #ccc9c0 !important; }
        .hc-btn:hover { opacity: 0.85 !important; }
        .hc-btn:active { transform: scale(0.97) !important; }
        .hc-link:hover { color: #1c1b18 !important; }
        * { box-sizing: border-box; }
      `}</style>

      <div style={S.wrap}>
        {/* Hero */}
        <section style={S.hero}>
          <span style={S.heroEyebrow}>Support</span>
          <h1 style={S.heroH1}>How can we help?</h1>
          <p style={S.heroSub}>
            Search our knowledge base or browse categories below to find answers fast.
          </p>
          <div style={S.searchWrap}>
            <span style={S.searchIcon}>⌕</span>
            <input
              className="hc-search"
              style={S.searchInput}
              type="text"
              placeholder="Search for help…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        {/* Categories */}
        <div style={S.section}>
          <h2 style={S.sectionH2}>Browse categories</h2>
          <div style={S.catGrid}>
            {categories.map((c) => (
              <div key={c.label} className="hc-cat" style={S.catCard}>
                <div style={{ ...S.catIcon, background: c.bg, color: c.color }}>
                  {c.icon}
                </div>
                <h3 style={S.catH3}>{c.label}</h3>
                <p style={S.catP}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div style={S.section}>
          <h2 style={S.sectionH2}>Popular articles</h2>
          <ul style={S.articleList}>
            {articles.map((a) => (
              <li key={a} className="hc-article" style={S.articleItem}>
                <span style={S.articleDot} />
                {a}
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div style={S.section}>
          <h2 style={S.sectionH2}>Frequently asked questions</h2>
          {filtered.length ? (
            <div style={S.faqList}>
              {filtered.map((f, i) => (
                <FaqItem key={i} faq={f} />
              ))}
            </div>
          ) : (
            <p style={S.faqEmpty}>No results for "{search}".</p>
          )}
        </div>

        {/* Tutorials */}
        <div style={S.section}>
          <h2 style={S.sectionH2}>Tutorials &amp; guides</h2>
          <div style={S.guideGrid}>
            {guides.map((g) => (
              <div key={g.title} style={S.guideCard}>
                <div style={{ ...S.guideIconWrap, background: g.bg, color: g.color }}>
                  {g.icon}
                </div>
                <h3 style={S.guideH3}>{g.title}</h3>
                <p style={S.guideP}>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Troubleshooting */}
        <div style={S.section}>
          <h2 style={S.sectionH2}>Troubleshooting</h2>
          <div style={S.troubleGrid}>
            {troubleItems.map((t) => (
              <div
                key={t.title}
                style={{ ...S.troubleBox, borderLeftColor: t.accent }}
              >
                <h3 style={S.troubleH3}>{t.title}</h3>
                <p style={S.troubleP}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div style={S.section}>
          <h2 style={S.sectionH2}>Contact support</h2>
          <form style={S.form} onSubmit={handleSubmit}>
            <div style={S.formRow}>
              <input
                className="hc-input"
                style={S.formInput}
                type="text"
                placeholder="Your name"
                required
              />
              <input
                className="hc-input"
                style={S.formInput}
                type="email"
                placeholder="Your email"
                required
              />
            </div>
            <input
              className="hc-input"
              style={S.formInput}
              type="text"
              placeholder="Subject"
              required
            />
            <textarea
              className="hc-input"
              style={S.formTextarea}
              rows={5}
              placeholder="Describe your issue…"
              required
            />
            <button
              className="hc-btn"
              style={S.formBtn}
              type="submit"
            >
              {submitted ? "✓ Sent!" : "Submit request →"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={S.footer}>
          <h2 style={S.footerH2}>Still need help?</h2>
          <p style={S.footerP}>
            Our support team is available 24/7. Browse articles, contact support, or explore tutorials.
          </p>
          <div style={S.footerLinks}>
            {["Home", "Documentation", "Community", "Support"].map((l) => (
              <a key={l} href="/" className="hc-link" style={S.footerLink}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpCenter;