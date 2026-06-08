import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import './Banner.css';
import gasImg from '../../assets/gas.jpeg';
import storeImg from '../../assets/store.jpeg';
import mixerImg from '../../assets/mixer.jpeg';
import cookerImg from '../../assets/cooker.jpeg';
import lunchboxImg from '../../assets/lunchbox.jpeg';




const banners = [
  {
    title: 'Mega Electronics Sale',
    subtitle: 'Up to 80% off on top brands',
    offer: 'Extra 10% Bank Discount',
    gradient: 'linear-gradient(135deg, #2874f0 0%, #1e5bc6 100%)',
    image:
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200'
  },
  {
    title: 'Fashion Fiesta',
    subtitle: 'Trendy styles for everyone',
    offer: 'Min. 50% Off',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200'
  },
  {
    title: 'Smartphone Deals',
    subtitle: 'Latest phones at best prices',
    offer: 'Exchange Offer Available',
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200'
  },
  {
    title: 'Home Makeover',
    subtitle: 'Transform your living space',
    offer: 'Starting ₹299',
    gradient: 'linear-gradient(135deg, #52c234 0%, #3da82b 100%)',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200'
  },
  {
    title: 'Appliance Bonanza',
    subtitle: 'Top brands at unbeatable prices',
    offer: 'No Cost EMI',
    gradient: 'linear-gradient(135deg, #ffd700 0%, #ffb700 100%)',
    image:
      'https://images.unsplash.com/photo-1586208958839-06c17cacdf08?q=80&w=1200'
  },
  {
    title: 'Kitchen Essentials',
    subtitle: 'Upgrade your kitchen with top deals',
    offer: 'Up to 60% Off',
    gradient: 'linear-gradient(135deg, #ff6b9d 0%, #c94b7c 100%)',
    image:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200'
  }
];

const dealItems = [
  {
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=500',
    title: 'Office Furniture'
  },
  {
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=500',
    title: 'Study Tables'
  },
  {
    image:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=500',
    title: 'Wall Lights'
  },
  {
    image:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=500',
    title: 'Decor Items'
  },
  {
    image:
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=500',
    title: 'Name Boards'
  },
  {
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=500',
    title: 'Perfumes'
  }
];

/* NEW AMAZON STYLE KITCHEN SECTION */

const kitchenItems = [
  {
    image: mixerImg,
    title: 'Mixer Grinder'
  },
  {
    image: storeImg,
    title: 'Storage Containers'
  },
  {
    image: cookerImg,
    title: 'Pressure Cooker'
  },
  {
    image: lunchboxImg,
    title: 'Lunch Box'
  },
  {
    image: gasImg,
    title: 'Gas Stove'
  },
  
];


export default function Banner() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const prev = () => {
    setIsAutoPlay(false);
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
  };

  const next = () => {
    setIsAutoPlay(false);
    setCurrent((c) => (c + 1) % banners.length);
  };

  const goToSlide = (index) => {
    setIsAutoPlay(false);
    setCurrent(index);
  };

  const handleShopNow = () => {
    navigate('/products');
  };

  return (
    <>
      {/* BANNER SECTION */}
      <div className="banner-container">
        <div className="banner-wrapper">

          {/* Left Navigation */}
          <button
            className="banner-nav banner-nav-left"
            onClick={prev}
            aria-label="Previous slide"
          >
            <FiChevronLeft />
          </button>

          {/* Slides */}
          <div className="banner-slides-wrapper">
            <div
              className="banner-slides"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {banners.map((banner, index) => (
                <div
                  key={index}
                  className="banner-slide"
                  style={{ background: banner.gradient }}
                >
                  <div className="banner-content">

                    <div className="banner-text">
                      <h1 className="banner-title">
                        {banner.title}
                      </h1>

                      <p className="banner-subtitle">
                        {banner.subtitle}
                      </p>

                      <div className="banner-offer-tag">
                        <span className="offer-icon">🎁</span>

                        <span className="offer-text">
                          {banner.offer}
                        </span>
                      </div>

                      <button
                        className="banner-cta"
                        onClick={handleShopNow}
                      >
                        Shop Now
                      </button>
                    </div>

                    <div className="banner-image">
                      <img
                        src={banner.image}
                        alt={banner.title}
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Navigation */}
          <button
            className="banner-nav banner-nav-right"
            onClick={next}
            aria-label="Next slide"
          >
            <FiChevronRight />
          </button>

          {/* Dots Indicator */}
          <div className="banner-indicators">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`banner-dot ${
                  index === current ? 'active' : ''
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* PRODUCT SECTION */}
      <div className="deals-wrapper">

        <div className="deals-section">

          <div className="deals-header">
            <h2>
              Min. 30% off | Top selections from Small Businesses
            </h2>

            <span onClick={handleShopNow}>
              See more
            </span>
          </div>

          <div className="deals-items">
            {dealItems.map((item, index) => (
              <div
                className="deal-card"
                key={index}
                onClick={handleShopNow}
              >
                <img
                  src={item.image}
                  alt={item.title}
                />

                <p>{item.title}</p>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* NEW AMAZON STYLE KITCHEN SECTION */}
      <div className="kitchen-wrapper">

        <div className="kitchen-section">

          <div className="kitchen-header">

            <h2>
              Starting ₹999 | Kitchen must-haves at great prices
            </h2>

            <span onClick={handleShopNow}>
              See all offers
            </span>

          </div>

          <div className="kitchen-items">

            {kitchenItems.map((item, index) => (
              <div
                className="kitchen-card"
                key={index}
                onClick={handleShopNow}
              >

                <div className="kitchen-image-box">
                  <img
                    src={item.image}
                    alt={item.title}
                  />
                </div>

                <p>{item.title}</p>

              </div>
            ))}

          </div>

        </div>

      </div>
    </>
  );
}