import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Sitemap.css";

const sitemapData = [
  {
    category: "Main Pages",
    links: [
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact" },
    ],
  },
  {
    category: "Products",
    links: [
      { name: "All Products", path: "/products" },
      { name: "Furniture", path: "http://localhost:5173/products?category=10" },
      { name: "Electronics", path: "http://localhost:5173/products?category=3" },
      { name: "Books", path: "http://localhost:5173/products?category=9" },
      { name: "Perfume ", path: "http://localhost:5173/products?category=20" },
    ],
  },
  {
    category: "Customer Service",
    links: [
      { name: "Help Center", path: "/helpcenter" },
      { name: "Shipping & Delivery", path: "/shipping" },
      { name: "Returns & Refunds", path: "/fund" },
      { name: "Track Order", path: "/track-order" },
    ],
  },
  {
    category: "Account",
    links: [
      { name: "My Account", path: "/account" },
      { name: "Order History", path: "/orders" },
      { name: "Wishlist", path: "/wishlist" },
      { name: "Address Book", path: "/addresses" },
    ],
  },
  {
    category: "Company",
    links: [
      { name: "Careers", path: "/career" },
      { name: "Press", path: "/press" },
      { name: "Blog", path: "/blog" },
      { name: "Partnerships", path: "/partnership" },
    ],
  },
  {
    category: "Legal",
    links: [
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Cookie Policy", path: "/policy" },
      { name: "Sitemap", path: "/sitemap" },
    ],
  },
];

export default function Sitemap() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="sitemap-page">
      <div className="sitemap-header">
        <h1>Sitemap</h1>
        <p>Find all the pages and sections of Harikart in one place.</p>
      </div>

      <div className="sitemap-grid">
        {sitemapData.map((section, index) => (
          <div className="sitemap-section" key={index}>
            <h2>{section.category}</h2>
            <ul>
              {section.links.map((link, i) => (
                <li key={i}>
                  <Link to={link.path}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="sitemap-footer">
        <p>Can't find what you're looking for?</p>
        <Link to="/contact" className="contact-link">
          Contact our support team
        </Link>
      </div>
    </div>
  );
}