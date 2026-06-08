import React, { useEffect, useRef } from "react";
import "./Press.css";

const pressItems = [
  {
    outlet: "The Hindu",
    headline: "Harikart revolutionizes local grocery delivery in South India",
    date: "May 2026",
    tag: "Feature",
  },
  {
    outlet: "Economic Times",
    headline: "Harikart raises Series A to expand pan-India operations",
    date: "Mar 2026",
    tag: "Funding",
  },
  {
    outlet: "YourStory",
    headline: "How Harikart is empowering kiranas with technology",
    date: "Jan 2026",
    tag: "Interview",
  },
];

export default function Press() {
  const firstItemRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (firstItemRef.current) firstItemRef.current.focus();
  }, []);

  return (
    <div className="press-page">
      {/* Hero */}
      <section className="press-hero">
        <div className="press-hero-inner">
          <span className="press-eyebrow">Newsroom</span>
          <h1 className="press-title">Harikart in the Press</h1>
          <p className="press-subtitle">
            Read the latest coverage, announcements, and stories about Harikart
            from leading publications.
          </p>
          <a className="press-cta" href="mailto:press@harikart.com">
            Contact Press Team
          </a>
        </div>
      </section>

      {/* Stats strip */}
      <section className="press-stats">
        <div className="stat">
          <span className="stat-num">50+</span>
          <span className="stat-label">Media Mentions</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num">12</span>
          <span className="stat-label">Publications</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num">3</span>
          <span className="stat-label">Awards</span>
        </div>
      </section>

      {/* Articles */}
      <section className="press-section">
        <h2 className="press-section-title">Latest Coverage</h2>
        <div className="press-list">
          {pressItems.map((item, i) => (
            <article
              className="press-card"
              key={i}
              ref={i === 0 ? firstItemRef : null}
              tabIndex={0}
            >
              <div className="press-card-top">
                <span className="press-tag">{item.tag}</span>
                <span className="press-date">{item.date}</span>
              </div>
              <div className="press-outlet">{item.outlet}</div>
              <h3 className="press-headline">{item.headline}</h3>
              <span className="press-read">Read article →</span>
            </article>
          ))}
        </div>
      </section>

      {/* Press kit */}
      <section className="press-kit">
        <div className="press-kit-inner">
          <div>
            <h3 className="press-kit-title">Press Kit</h3>
            <p className="press-kit-desc">
              Download our brand assets, logos, and company fact sheet.
            </p>
          </div>
          <a className="press-kit-btn" href="#download">
            Download Kit
          </a>
        </div>
      </section>
    </div>
  );
}