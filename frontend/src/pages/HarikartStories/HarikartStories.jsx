import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./HarikartStories.css";
const stories = [
  {
    id: 1,
    tag: "Farming",
    title: "From Farm to Doorstep",
    excerpt:
      "How Harikart bridges the gap between rural farmers and urban dinner tables — cutting middlemen, raising incomes, and delivering freshness.",
    date: "May 10, 2026",
    readTime: "5 min read",
    color: "green",
  },
  {
    id: 2,
    tag: "Seller",
    title: "A Seller's Journey",
    excerpt:
      "Meet Ramesh from Coimbatore, who tripled his monthly revenue within six months of joining Harikart's seller ecosystem.",
    date: "Apr 22, 2026",
    readTime: "4 min read",
    color: "amber",
  },
  {
    id: 3,
    tag: "Logistics",
    title: "Fresh Every Morning",
    excerpt:
      "Behind every sunrise delivery is a dedicated team that starts at 3 AM — the unsung heroes making same-day freshness a promise, not a luxury.",
    date: "Mar 15, 2026",
    readTime: "6 min read",
    color: "teal",
  },
  {
    id: 4,
    tag: "Community",
    title: "Women at the Wheel",
    excerpt:
      "Over 200 women entrepreneurs across Tamil Nadu have found financial independence through Harikart's micro-seller programme.",
    date: "Feb 28, 2026",
    readTime: "7 min read",
    color: "pink",
  },
  {
    id: 5,
    tag: "Technology",
    title: "The App That Speaks Tamil",
    excerpt:
      "Harikart's vernacular-first mobile app broke barriers for first-time smartphone users in semi-urban markets across South India.",
    date: "Jan 18, 2026",
    readTime: "5 min read",
    color: "purple",
  },
  {
    id: 6,
    tag: "Impact",
    title: "Zero Waste by Design",
    excerpt:
      "Smart inventory prediction and dynamic pricing helped Harikart cut perishable food waste by 40% in FY2025.",
    date: "Dec 5, 2025",
    readTime: "4 min read",
    color: "coral",
  },
];

const icons = {
  green: "🌾",
  amber: "📦",
  teal: "🚚",
  pink: "🌸",
  purple: "📱",
  coral: "♻️",
};

export default function HarikartStories() {
  const heroRef = useRef(null);

  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.focus();
    }

    const cards = document.querySelectorAll(".hs-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("hs-card--visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const featured = stories[0];
  const rest = stories.slice(1);

  return (
    <div className="hs-page">
      {/* Hero Header */}
      <header className="hs-hero" tabIndex={-1} ref={heroRef}>
        <div className="hs-hero-eyebrow">Harikart Stories</div>
        <h1 className="hs-hero-title">
          Real People.<br />Real Impact.
        </h1>
        <p className="hs-hero-sub">
          From paddy fields to city kitchens — stories from the hearts of our community.
        </p>
        <div className="hs-hero-stats">
          <div className="hs-stat">
            <span className="hs-stat-num">12,000+</span>
            <span className="hs-stat-label">Farmers onboarded</span>
          </div>
          <div className="hs-stat-divider" />
          <div className="hs-stat">
            <span className="hs-stat-num">3.2L+</span>
            <span className="hs-stat-label">Orders delivered</span>
          </div>
          <div className="hs-stat-divider" />
          <div className="hs-stat">
            <span className="hs-stat-num">98%</span>
            <span className="hs-stat-label">Customer satisfaction</span>
          </div>
        </div>
      </header>

      {/* Featured Story */}
      <section className="hs-featured-wrap">
        <div className={`hs-featured hs-featured--${featured.color}`}>
          <div className="hs-featured-img">
            <span className="hs-featured-icon">{icons[featured.color]}</span>
          </div>
          <div className="hs-featured-body">
            <div className="hs-meta">
              <span className={`hs-tag hs-tag--${featured.color}`}>{featured.tag}</span>
              <span className="hs-date">{featured.date}</span>
              <span className="hs-readtime">{featured.readTime}</span>
            </div>
            <h2 className="hs-featured-title">{featured.title}</h2>
            <p className="hs-featured-excerpt">{featured.excerpt}</p>
         <Link to="/FarmToDoorstep">  <button className="hs-btn-primary">Read Full Story →</button></Link>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="hs-section">
        <h2 className="hs-section-title">More Stories</h2>
        <div className="hs-grid">
          {rest.map((s, i) => (
            <article
              className={`hs-card hs-card--${s.color}`}
              key={s.id}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="hs-card-img">
                <span className="hs-card-icon">{icons[s.color]}</span>
              </div>
              <div className="hs-card-body">
                <div className="hs-meta">
                  <span className={`hs-tag hs-tag--${s.color}`}>{s.tag}</span>
                  <span className="hs-readtime">{s.readTime}</span>
                </div>
                <h3 className="hs-card-title">{s.title}</h3>
                <p className="hs-card-excerpt">{s.excerpt}</p>
                <div className="hs-card-footer">
                  <span className="hs-date">{s.date}</span>
                  <button className="hs-btn-ghost">Read More →</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="hs-cta">
        <div className="hs-cta-inner">
          <h2 className="hs-cta-title">Have a story to share?</h2>
          <p className="hs-cta-sub">
            If you're a farmer, seller, or delivery partner on Harikart, we'd love to feature your journey.
          </p>
          <Link to="/story">  <button className="hs-btn-cta">Submit Your Story</button></Link>
        </div>
      </section>
    </div>
  );
}