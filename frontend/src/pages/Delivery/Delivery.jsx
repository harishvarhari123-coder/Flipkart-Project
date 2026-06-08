import React, { useEffect, useRef } from "react";
import "./Delivery.css";

const Deliver = () => {
  const searchRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  const deliveries = [
    {
      id: 1,
      title: "Express Delivery",
      status: "Out For Delivery",
      eta: "20 Minutes",
    },
    {
      id: 2,
      title: "Premium Delivery",
      status: "In Transit",
      eta: "45 Minutes",
    },
    {
      id: 3,
      title: "Standard Delivery",
      status: "Processing",
      eta: "2 Hours",
    },
    {
      id: 4,
      title: "Same Day Delivery",
      status: "Delivered",
      eta: "Completed",
    },
  ];

  return (
    <div className="deliver-page">
      <section className="hero">
        <h1>Fast & Reliable Delivery Service</h1>
        <p>
          Track packages, monitor deliveries, and manage shipments from a
          single dashboard.
        </p>

        <input
          ref={searchRef}
          type="text"
          placeholder="Search Tracking Number..."
          className="search-box"
        />
      </section>

      <section className="delivery-grid">
        {deliveries.map((item) => (
          <div key={item.id} className="delivery-card">
            <h2>{item.title}</h2>
            <p>
              <strong>Status:</strong> {item.status}
            </p>
            <p>
              <strong>ETA:</strong> {item.eta}
            </p>
            <button>Track Now</button>
          </div>
        ))}
      </section>

      <section className="content-section">
        <h2>Why Choose Our Delivery Service?</h2>

        <p>
          Our delivery platform provides fast, secure, and efficient shipment
          tracking. Customers can monitor package movement in real-time while
          businesses benefit from advanced logistics management tools.
        </p>

        <p>
          Whether you need same-day shipping, express transportation, or
          international parcel handling, our platform ensures reliability and
          transparency at every stage of the delivery process.
        </p>

        <p>
          Real-time updates, route optimization, customer notifications, and
          professional courier support make us a trusted partner for thousands
          of customers worldwide.
        </p>

        <p>
          Businesses can integrate delivery management APIs, automate shipment
          creation, generate labels, and monitor logistics performance from a
          centralized dashboard.
        </p>

        <p>
          Our mission is to simplify delivery operations while ensuring customer
          satisfaction through technology-driven logistics solutions.
        </p>
      </section>

      <section className="features">
        <h2>Delivery Features</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Real-Time Tracking</h3>
            <p>Track every shipment live from dispatch to delivery.</p>
          </div>

          <div className="feature-card">
            <h3>Fast Shipping</h3>
            <p>Same-day and express delivery options available.</p>
          </div>

          <div className="feature-card">
            <h3>Secure Packages</h3>
            <p>Advanced protection and verification systems.</p>
          </div>

          <div className="feature-card">
            <h3>24/7 Support</h3>
            <p>Dedicated customer support whenever you need help.</p>
          </div>
        </div>
      </section>

      <section className="statistics">
        <h2>Our Performance</h2>

        <div className="stats-grid">
          <div className="stat-box">
            <h3>1M+</h3>
            <p>Deliveries Completed</p>
          </div>

          <div className="stat-box">
            <h3>99.8%</h3>
            <p>Success Rate</p>
          </div>

          <div className="stat-box">
            <h3>500+</h3>
            <p>Delivery Partners</p>
          </div>

          <div className="stat-box">
            <h3>24/7</h3>
            <p>Customer Support</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <h3>Delivery Management System</h3>
        <p>
          Reliable logistics, efficient operations, and exceptional customer
          experiences.
        </p>
      </footer>
    </div>
  );
};

export default Deliver;