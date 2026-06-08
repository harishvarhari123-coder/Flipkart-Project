import { useState, useEffect } from 'react';
import { FiTag, FiCopy, FiCheck, FiClock, FiPercent, FiTruck, FiGift, FiSearch, FiX } from 'react-icons/fi';
import './Coupons.css';

// ─── Static coupon data (replace with your API call) ───────────────────────
const ALL_COUPONS = [
  {
    id: 1,
    code: 'HARI10',
    title: '10% Off on All Orders',
    description: 'Get flat 10% off on your entire cart. No minimum order required.',
    discount: '10%',
    type: 'percent',
    category: 'all',
    minOrder: 0,
    maxDiscount: 500,
    expiry: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    usesLeft: 48,
    totalUses: 100,
    isNew: true,
    isFeatured: true,
  },
  {
    id: 2,
    code: 'FREESHIP99',
    title: 'Free Shipping',
    description: 'Enjoy free delivery on orders above ₹499. Valid on all products.',
    discount: 'FREE',
    type: 'shipping',
    category: 'shipping',
    minOrder: 499,
    maxDiscount: null,
    expiry: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    usesLeft: 200,
    totalUses: 500,
    isNew: false,
    isFeatured: true,
  },
  {
    id: 3,
    code: 'WELCOME200',
    title: '₹200 Off on First Order',
    description: 'Exclusive welcome offer for new users. Minimum cart value ₹999.',
    discount: '₹200',
    type: 'flat',
    category: 'new_user',
    minOrder: 999,
    maxDiscount: 200,
    expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    usesLeft: 15,
    totalUses: 50,
    isNew: true,
    isFeatured: false,
  },
  {
    id: 4,
    code: 'ELECTRONICS15',
    title: '15% Off on Electronics',
    description: 'Save big on all electronics. Min. order ₹1499. Max discount ₹1500.',
    discount: '15%',
    type: 'percent',
    category: 'electronics',
    minOrder: 1499,
    maxDiscount: 1500,
    expiry: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // expires soon
    usesLeft: 7,
    totalUses: 200,
    isNew: false,
    isFeatured: false,
  },
  {
    id: 5,
    code: 'FASHION25',
    title: '25% Off on Fashion',
    description: 'Massive discount on all fashion & apparel items. Min order ₹799.',
    discount: '25%',
    type: 'percent',
    category: 'fashion',
    minOrder: 799,
    maxDiscount: 800,
    expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    usesLeft: 63,
    totalUses: 150,
    isNew: false,
    isFeatured: false,
  },
  {
    id: 6,
    code: 'GIFTYOU50',
    title: '₹50 Cashback Gift',
    description: 'Flat ₹50 cashback on orders above ₹299. Credited within 24 hrs.',
    discount: '₹50',
    type: 'cashback',
    category: 'all',
    minOrder: 299,
    maxDiscount: 50,
    expiry: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // almost expiring
    usesLeft: 3,
    totalUses: 100,
    isNew: false,
    isFeatured: false,
  },
];

const CATEGORIES = [
  { key: 'all_filter', label: 'All Coupons', icon: <FiTag /> },
  { key: 'percent', label: 'Discount %', icon: <FiPercent /> },
  { key: 'shipping', label: 'Free Shipping', icon: <FiTruck /> },
  { key: 'cashback', label: 'Cashback', icon: <FiGift /> },
  { key: 'new_user', label: 'New User', icon: <FiGift /> },
];

// ─── Countdown helper ───────────────────────────────────────────────────────
function useCountdown(expiry) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const tick = () => {
      const diff = expiry - Date.now();
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (d > 0) setTimeLeft(`${d}d ${h}h left`);
      else if (h > 0) setTimeLeft(`${h}h ${m}m left`);
      else setTimeLeft(`${m}m ${s}s left`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiry]);

  return timeLeft;
}

// ─── Single Coupon Card ─────────────────────────────────────────────────────
function CouponCard({ coupon, onCopy, copiedId }) {
  const timeLeft = useCountdown(coupon.expiry);
  const isCopied = copiedId === coupon.id;
  const isExpiringSoon = (coupon.expiry - Date.now()) < 3 * 24 * 60 * 60 * 1000;
  const usagePercent = Math.round(((coupon.totalUses - coupon.usesLeft) / coupon.totalUses) * 100);

  const typeColors = {
    percent: 'type-percent',
    shipping: 'type-shipping',
    flat: 'type-flat',
    cashback: 'type-cashback',
  };

  return (
    <div className={`coupon-card ${isExpiringSoon ? 'expiring-soon' : ''} ${coupon.isFeatured ? 'featured' : ''}`}>
      {coupon.isNew && <span className="coupon-badge badge-new">NEW</span>}
      {isExpiringSoon && !coupon.isNew && <span className="coupon-badge badge-expiring">EXPIRING SOON</span>}
      {coupon.isFeatured && <span className="coupon-featured-star">⭐ Featured</span>}

      <div className="coupon-left">
        <div className={`coupon-discount-badge ${typeColors[coupon.type] || 'type-percent'}`}>
          {coupon.type === 'shipping' ? <FiTruck size={18} /> : coupon.type === 'cashback' ? <FiGift size={18} /> : <FiPercent size={18} />}
          <span>{coupon.discount}</span>
        </div>
      </div>

      <div className="coupon-divider">
        <span className="coupon-notch top"></span>
        <span className="coupon-notch bottom"></span>
        <div className="coupon-dashes"></div>
      </div>

      <div className="coupon-right">
        <div className="coupon-top-row">
          <h3 className="coupon-title">{coupon.title}</h3>
        </div>
        <p className="coupon-desc">{coupon.description}</p>

        {coupon.minOrder > 0 && (
          <span className="coupon-min-order">Min. order: ₹{coupon.minOrder}</span>
        )}
        {coupon.maxDiscount && coupon.type !== 'flat' && coupon.type !== 'cashback' && (
          <span className="coupon-max-discount">Max discount: ₹{coupon.maxDiscount}</span>
        )}

        <div className="coupon-usage-bar">
          <div className="coupon-usage-fill" style={{ width: `${usagePercent}%` }}></div>
        </div>
        <span className="coupon-uses-left">{coupon.usesLeft} uses left</span>

        <div className="coupon-footer">
          <div className="coupon-code-box">
            <FiTag size={13} />
            <span className="coupon-code">{coupon.code}</span>
          </div>

          <div className="coupon-timer">
            <FiClock size={12} />
            <span className={isExpiringSoon ? 'timer-urgent' : ''}>{timeLeft}</span>
          </div>

          <button
            className={`coupon-copy-btn ${isCopied ? 'copied' : ''}`}
            onClick={() => onCopy(coupon.id, coupon.code)}
          >
            {isCopied ? <><FiCheck size={14} /> Copied!</> : <><FiCopy size={14} /> Copy Code</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Apply Coupon Bar ───────────────────────────────────────────────────────
function ApplyCouponBar({ onApply }) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  const handleApply = () => {
    const found = ALL_COUPONS.find(c => c.code.toLowerCase() === input.trim().toLowerCase());
    if (found) {
      setStatus({ type: 'success', msg: `✅ "${found.code}" applied! ${found.title}` });
      onApply(found);
    } else {
      setStatus({ type: 'error', msg: '❌ Invalid coupon code. Please check and try again.' });
    }
  };

  return (
    <div className="apply-coupon-bar">
      <div className="apply-coupon-inner">
        <FiTag size={18} className="apply-icon" />
        <input
          className="apply-input"
          type="text"
          placeholder="Enter coupon code (e.g. HARI10)"
          value={input}
          onChange={e => { setInput(e.target.value); setStatus(null); }}
          onKeyDown={e => e.key === 'Enter' && handleApply()}
        />
        {input && (
          <button className="apply-clear" onClick={() => { setInput(''); setStatus(null); }}>
            <FiX size={14} />
          </button>
        )}
        <button className="apply-btn" onClick={handleApply}>Apply</button>
      </div>
      {status && (
        <p className={`apply-status ${status.type}`}>{status.msg}</p>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function Coupons() {
  const [activeFilter, setActiveFilter] = useState('all_filter');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleCopy = (id, code) => {
    navigator.clipboard.writeText(code).catch(() => {
      // fallback for older browsers
      const el = document.createElement('textarea');
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = ALL_COUPONS.filter(c => {
    const matchesCategory =
      activeFilter === 'all_filter' ||
      c.type === activeFilter ||
      c.category === activeFilter;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      c.code.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="coupons-page">
      <div className="coupons-hero">
        <div className="coupons-hero-content">
          <h1 className="coupons-hero-title">
            <FiTag /> Your Coupons & Offers
          </h1>
          <p className="coupons-hero-sub">Copy a code or apply it directly at checkout to save instantly.</p>
        </div>
      </div>

      <div className="coupons-container">
        {/* Apply bar */}
        <ApplyCouponBar onApply={setAppliedCoupon} />

        {appliedCoupon && (
          <div className="applied-coupon-banner">
            <FiCheck size={16} />
            <strong>{appliedCoupon.code}</strong> is ready to use — <em>{appliedCoupon.title}</em>
            <button className="applied-remove" onClick={() => setAppliedCoupon(null)}><FiX size={13} /></button>
          </div>
        )}

        {/* Search */}
        <div className="coupons-search-row">
          <div className="coupons-search-wrap">
            <FiSearch size={15} />
            <input
              type="text"
              placeholder="Search coupons…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="coupons-search-input"
            />
            {searchQuery && (
              <button className="coupons-search-clear" onClick={() => setSearchQuery('')}><FiX size={13} /></button>
            )}
          </div>
        </div>

        {/* Category filters */}
        <div className="coupons-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              className={`filter-pill ${activeFilter === cat.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat.key)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="coupons-count">
          {filtered.length} coupon{filtered.length !== 1 ? 's' : ''} available
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="coupons-grid">
            {filtered.map(coupon => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onCopy={handleCopy}
                copiedId={copiedId}
              />
            ))}
          </div>
        ) : (
          <div className="coupons-empty">
            <FiTag size={40} />
            <p>No coupons found. Try a different filter or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}