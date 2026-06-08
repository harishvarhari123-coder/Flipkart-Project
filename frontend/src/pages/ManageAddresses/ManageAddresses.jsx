import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser, FiPackage, FiLogOut, FiMapPin, FiPlus,
  FiTrash2, FiCheckCircle, FiHome, FiBriefcase, FiAlertCircle,
  FiCamera
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './ManageAddresses.css';

const API = 'http://localhost:5000/api';

const EMPTY_FORM = {
  name: '', phone: '', pincode: '', locality: '',
  address_line: '', city: '', state: '',
  landmark: '', address_type: 'Home', is_default: false,
};

export default function ManageAddresses() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ── Avatar (shared with Profile page via localStorage) ──

  const [avatarSrc, setAvatarSrc] = useState(() => localStorage.getItem(`profile_avatar_${user.id}`) || null);
  const avatarInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setAvatarSrc(dataUrl);
      localStorage.setItem('profile_avatar', dataUrl);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAvatarRemove = () => {
    setAvatarSrc(null);
    localStorage.removeItem('profile_avatar');
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const [addresses, setAddresses]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState(null);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');

  useEffect(() => { fetchAddresses(); }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/addresses`);
      setAddresses(res.data);
    } catch {
      setError('Failed to load addresses.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.name || !form.phone || !form.pincode || !form.address_line || !form.city || !form.state) {
      setError('Please fill all required fields.');
      return;
    }
    try {
      setSaving(true);
      await axios.post(`${API}/addresses`, form);
      setSuccess('Address saved successfully!');
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchAddresses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save address.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this address?')) return;
    try {
      setDeleting(id);
      await axios.delete(`${API}/addresses/${id}`);
      setAddresses(prev => prev.filter(a => a.id !== id));
      setSuccess('Address removed.');
    } catch {
      setError('Failed to remove address.');
    } finally {
      setDeleting(null);
    }
  };

  if (!user) return null;

  return (
    <div className="addr-page">

      {/* ── Sidebar ── */}
      <aside className="addr-sidebar">
        <div className="addr-user-card">

          {/* Avatar col — identical to Profile page */}
          <div className="addr-avatar-col">
            <div className="addr-avatar-wrapper">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile" className="addr-avatar" />
              ) : (
                <div className="addr-avatar-icon"><FiUser /></div>
              )}
              <label className="addr-avatar-upload" title="Upload photo">
                <FiCamera />
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            {avatarSrc && (
              <button className="addr-avatar-remove" onClick={handleAvatarRemove}>
                <FiTrash2 /><span>Remove</span>
              </button>
            )}
          </div>

          <div className="addr-user-info">
            <span>Hello,</span>
            <h3>{user.name}</h3>
          </div>
        </div>

        <nav className="addr-nav">
          <div className="addr-nav-item" onClick={() => navigate('/profile')}>
            <FiUser /> Personal Information
          </div>
          <div className="addr-nav-item" onClick={() => navigate('/orders')}>
            <FiPackage /> My Orders
          </div>
          <div className="addr-nav-item active">
            <FiMapPin /> Manage Addresses
          </div>
          <div className="addr-nav-item addr-nav-item--logout"
               onClick={() => { logout(); navigate('/'); }}>
            <FiLogOut /> Logout
          </div>
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main className="addr-content">
        <h2><FiMapPin /> Manage Addresses</h2>

        {/* Flash messages */}
        {error   && <div className="addr-alert addr-alert--error">  <FiAlertCircle /> {error}   </div>}
        {success && <div className="addr-alert addr-alert--success"><FiCheckCircle /> {success} </div>}

        {/* Add new address button */}
        {!showForm && (
          <button className="addr-add-btn" onClick={() => { setShowForm(true); setError(''); setSuccess(''); }}>
            <FiPlus /> Add New Address
          </button>
        )}

        {/* ── Add Form ── */}
        {showForm && (
          <form className="addr-form" onSubmit={handleSubmit} noValidate>
            <h3>New Address</h3>

            <div className="addr-form-grid">
              <div className="addr-field">
                <label>Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Enter full name" autoFocus />
              </div>
              <div className="addr-field">
                <label>Phone Number *</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" maxLength={10} />
              </div>
              <div className="addr-field">
                <label>Pincode *</label>
                <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" maxLength={6} />
              </div>
              <div className="addr-field">
                <label>Locality / Area</label>
                <input name="locality" value={form.locality} onChange={handleChange} placeholder="Locality, area or village" />
              </div>
              <div className="addr-field addr-field--full">
                <label>Address (House No., Building, Street) *</label>
                <input name="address_line" value={form.address_line} onChange={handleChange} placeholder="Flat, house no., building, company, apartment" />
              </div>
              <div className="addr-field">
                <label>City / District / Town *</label>
                <input name="city" value={form.city} onChange={handleChange} placeholder="City or town" />
              </div>
              <div className="addr-field">
                <label>State *</label>
                <input name="state" value={form.state} onChange={handleChange} placeholder="State" />
              </div>
              <div className="addr-field">
                <label>Landmark</label>
                <input name="landmark" value={form.landmark} onChange={handleChange} placeholder="E.g. near apollo hospital" />
              </div>
            </div>

            {/* Address type */}
            <div className="addr-type-row">
              <span>Address Type</span>
              {['Home', 'Work', 'Other'].map(t => (
                <label key={t} className={`addr-type-chip ${form.address_type === t ? 'active' : ''}`}>
                  <input type="radio" name="address_type" value={t}
                    checked={form.address_type === t} onChange={handleChange} />
                  {t === 'Home' ? <FiHome /> : t === 'Work' ? <FiBriefcase /> : <FiMapPin />}
                  {t}
                </label>
              ))}
            </div>

            {/* Default toggle */}
            <label className="addr-default-row">
              <input type="checkbox" name="is_default" checked={form.is_default} onChange={handleChange} />
              Make this my default address
            </label>

            <div className="addr-form-actions">
              <button type="submit" className="addr-save-btn" disabled={saving}>
                {saving ? 'Saving…' : 'Save Address'}
              </button>
              <button type="button" className="addr-cancel-btn"
                onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setError(''); }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* ── Address List ── */}
        {loading ? (
          <div className="addr-loading">
            <div className="addr-spinner" />
            Loading addresses…
          </div>
        ) : addresses.length === 0 ? (
          <div className="addr-empty">
            <FiMapPin className="addr-empty-icon" />
            <p>No saved addresses yet.</p>
            <span>Add an address to get started.</span>
          </div>
        ) : (
          <div className="addr-list">
            {addresses.map(addr => (
              <div key={addr.id} className={`addr-card ${addr.is_default ? 'addr-card--default' : ''}`}>
                {addr.is_default && (
                  <span className="addr-default-badge"><FiCheckCircle /> Default</span>
                )}
                <div className="addr-card-type">
                  {addr.address_type === 'Home' ? <FiHome /> : addr.address_type === 'Work' ? <FiBriefcase /> : <FiMapPin />}
                  {addr.address_type}
                </div>
                <p className="addr-card-name">{addr.name} <span>{addr.phone}</span></p>
                <p className="addr-card-line">
                  {addr.address_line}{addr.locality ? `, ${addr.locality}` : ''},{' '}
                  {addr.city}, {addr.state} – {addr.pincode}
                </p>
                {addr.landmark && <p className="addr-card-landmark">Near: {addr.landmark}</p>}

                <button className="addr-delete-btn" onClick={() => handleDelete(addr.id)}
                  disabled={deleting === addr.id}>
                  <FiTrash2 /> {deleting === addr.id ? 'Removing…' : 'Remove'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
