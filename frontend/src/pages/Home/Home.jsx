import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Banner from '../../components/Banner/Banner';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';

const API = 'http://localhost:5000/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dealTime, setDealTime] = useState({
    hours: 7,
    mins: 34,
    secs: 22
  });

  const navigate = useNavigate();

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/categories`)
        ]);

        setProducts(prodRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error('Error loading homepage:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Deal Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setDealTime(prev => {
        let { hours, mins, secs } = prev;

        secs--;

        if (secs < 0) {
          secs = 59;
          mins--;
        }

        if (mins < 0) {
          mins = 59;
          hours--;
        }

        if (hours < 0) {
          hours = 23;
          mins = 59;
          secs = 59;
        }

        return { hours, mins, secs };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Memoized Data
  const topDeals = useMemo(() => {
    return products.filter(p => p.discount >= 20).slice(0, 8);
  }, [products]);

  const trending = useMemo(() => {
    return [...products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8);
  }, [products]);

  // Loading Screen
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h3>Loading amazing deals...</h3>
      </div>
    );
  }

  return (
    <div className="home-page">

      {/* HERO BANNER */}
      <Banner />

      {/* FEATURES */}
      <section className="home-features">
        <div className="home-feature">
        <Link to ="/delivery"> <span className="home-feature-icon">🚚</span></Link> 
          <h4>Free Delivery</h4>
          <p>On orders above ₹500</p>
        </div>

        <div className="home-feature">
       <Link to ="/cancel">  <span className="home-feature-icon">🔄</span></Link>
          <h4>Easy Returns</h4>
          <p>7 day return policy</p>
        </div>

        <div className="home-feature">
         <Link to ="/secure"> <span className="home-feature-icon">💳</span></Link>
          <h4>Secure Payment</h4>
          <p>100% secure checkout</p>
        </div>

        <div className="home-feature">
        <Link to ="/contact">  <span className="home-feature-icon">🎧</span></Link>
          <h4>24/7 Support</h4>
          <p>Dedicated support team</p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="home-section">
        <div className="home-section-header">
          <h2>🛍 Shop by Category</h2>

          <Link to="/products" className="view-all-btn">
            View All
          </Link>
        </div>

        <div className="home-categories-grid">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="home-category-card"
              onClick={() =>
                navigate(`/products?category=${cat.id}`)
              }
            >
              <div className="home-category-icon">
                {cat.icon}
              </div>

              <h4 className="home-category-name">
                {cat.name}
              </h4>
            </div>
          ))}
        </div>
      </section>

      {/* DEALS SECTION */}
      {topDeals.length > 0 && (
        <>
          <section className="home-deals-strip">

            <div className="deal-left">
              <h2>⚡ Deals of the Day</h2>
              <p>Grab these offers before they disappear!</p>
            </div>

            <div className="home-deals-timer">

              <div className="home-deals-timer-box">
                <span className="number">
                  {String(dealTime.hours).padStart(2, '0')}
                </span>

                <span className="label">Hours</span>
              </div>

              <div className="home-deals-timer-box">
                <span className="number">
                  {String(dealTime.mins).padStart(2, '0')}
                </span>

                <span className="label">Minutes</span>
              </div>

              <div className="home-deals-timer-box">
                <span className="number">
                  {String(dealTime.secs).padStart(2, '0')}
                </span>

                <span className="label">Seconds</span>
              </div>

            </div>
          </section>

          <section className="home-section">
            <div className="home-products-grid">
              {topDeals.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* TRENDING */}
      <section className="home-section">

        <div className="home-section-header">
          <h2>🔥 Trending Now</h2>

          <Link
            to="/products?sort=rating"
            className="view-all-btn"
          >
            View All
          </Link>
        </div>

        <div className="home-products-grid">
          {trending.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </section>

      {/* ALL PRODUCTS */}
      <section className="home-section">

        <div className="home-section-header">
          <h2>✨ Explore Products</h2>

          <Link
            to="/products"
            className="view-all-btn"
          >
            View All
          </Link>
        </div>

        <div className="home-products-grid">
          {products.slice(0, 12).map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </section>

    </div>
  );
}