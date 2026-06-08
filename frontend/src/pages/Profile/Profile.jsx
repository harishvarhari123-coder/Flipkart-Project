import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiPackage, FiLogOut, FiMapPin, FiCamera, FiTrash2, FiRotateCcw } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ── Per-user key: each user gets their own avatar slot ──
  const avatarKey = user ? `profile_avatar_${user.id}` : null;

  const [avatarSrc, setAvatarSrc] = useState(() => {
    if (!avatarKey) return null;
    return localStorage.getItem(avatarKey) || null;
  });

  const inputRef = useRef(null);

  if (!user) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setAvatarSrc(dataUrl);
      localStorage.setItem(avatarKey, dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemove = () => {
    setAvatarSrc(null);
    localStorage.removeItem(avatarKey);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="profile-page">

      {/* ── Sidebar ─────────────────────────── */}
      <aside className="profile-sidebar">

        {/* User card */}
        <div className="profile-user-card">

          {/* Avatar section */}
          <div className="profile-avatar-col">
            <div className="profile-avatar-wrapper">

              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar-icon">
                  <FiUser />
                </div>
              )}

              <label className="profile-avatar-upload" title="Upload photo">
                <FiCamera />
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>

            {avatarSrc && (
              <button className="profile-avatar-remove" onClick={handleRemove}>
                <FiTrash2 />
                <span>Remove</span>
              </button>
            )}
          </div>

          {/* Name */}
          <div className="profile-user-info">
            <span>Hello,</span>
            <h3>{user.name}</h3>
          </div>
        </div>

        {/* Nav */}
        <nav className="profile-nav">
          <div className="profile-nav-item active">
            <FiUser /> Personal Information
          </div>
          <div className="profile-nav-item" onClick={() => navigate('/orders')}>
            <FiPackage /> My Orders
          </div>
          <div className="profile-nav-item" onClick={() => navigate('/refund-history')}>
            <FiRotateCcw /> Refund History
          </div>
          <div className="profile-nav-item" onClick={() => navigate('/addresses')}>
            <FiMapPin /> Manage Addresses
          </div>
          <div
            className="profile-nav-item profile-nav-item--logout"
            onClick={() => { logout(); navigate('/'); }}
          >
            <FiLogOut /> Logout
          </div>
        </nav>
      </aside>

      {/* ── Main Content ─────────────────────── */}
      <main className="profile-content">
        <h2><FiUser /> Personal Information</h2>

        <div className="profile-details-grid">
          <div className="profile-field">
            <label>Full Name</label>
            <input type="text" value={user.name} disabled />
          </div>
          <div className="profile-field">
            <label>Email Address</label>
            <input type="email" value={user.email} disabled />
          </div>
          <div className="profile-field">
            <label>Mobile Number</label>
            <input type="tel" value={user.phone || 'Not Provided'} disabled />
          </div>
        </div>

        {/* FAQs */}
        <div className="profile-faqs">
          <p className="profile-faqs__title">FAQs</p>

          <div className="profile-faq-item">
            <strong>What happens when I update my email address (or mobile number)?</strong>
            <p>
              Your login email id (or mobile number) changes, likewise. You'll receive
              all your account related communication on your updated email address (or mobile number).
            </p>
          </div>

          <div className="profile-faq-item">
            <strong>When will my account be updated with the new email address (or mobile number)?</strong>
            <p>
              It happens as soon as you confirm the verification code sent to your email
              (or mobile) and save the changes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}