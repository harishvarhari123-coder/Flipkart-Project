import React, { useState, useRef, useEffect } from 'react';
import './Contact.css';

const API_URL = 'https://flipkart-project-l2ex.onrender.com/api/contact'; // ← change if your server runs elsewhere

export default function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverError, setServerError] = useState('');
  const nameRef    = useRef(null);
  const successRef = useRef(null);

  // Scroll to top + autofocus name field on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (nameRef.current) nameRef.current.focus();
  }, []);

  // Focus success card for accessibility
  useEffect(() => {
    if (status === 'success' && successRef.current) successRef.current.focus();
  }, [status]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required.';
    if (!form.email.trim())   e.email   = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                              e.email   = 'Enter a valid email.';
    if (!form.message.trim()) e.message = 'Message is required.';
    return e;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('loading');
    setServerError('');

    try {
      const res  = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setServerError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setServerError('Unable to reach the server. Check your connection.');
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setErrors({});
    setServerError('');
    setTimeout(() => { if (nameRef.current) nameRef.current.focus(); }, 100);
  };

  return (
    <div className="contact-page">
      <div className="contact-container">

        {/* Header */}
        <div className="contact-header">
          <span className="contact-eyebrow">Support</span>
          <h2 className="contact-title">Contact Us</h2>
          <p className="contact-desc">We'd love to hear from you. Reach out and we'll get back within 24 hours.</p>
        </div>

        <div className="contact-content">

          {/* Info Panel */}
          <div className="contact-info">
            <h3 className="info-title">Get in Touch</h3>
            <div className="info-item">
              <span className="info-icon">✉</span>
              <div>
                <p className="info-label">Email</p>
                <a href="mailto:support@harikart.com" className="info-value">support@harikart.com</a>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📞</span>
              <div>
                <p className="info-label">Phone</p>
                <p className="info-value">+91 98765 43210</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <p className="info-label">Address</p>
                <p className="info-value">
                  Harikart Internet Pvt. Ltd.,<br />
                  Brindavanam Colony,<br />
                  Outer Ring Road, Cuddalore – 607109
                </p>
              </div>
            </div>
            <div className="info-hours">
              <span className="hours-dot" />
              <p>Support hours: Mon–Sat, 9 AM – 9 PM</p>
            </div>
          </div>

          {/* Form / Success */}
          <div className="contact-form-wrap">
            {status === 'success' ? (
              <div className="success-card" ref={successRef} tabIndex={0} aria-live="polite">
                <div className="success-icon">✓</div>
                <h3 className="success-title">Message Sent!</h3>
                <p className="success-desc">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button className="contact-btn contact-btn--outline" onClick={handleReset}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name" name="name" type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    ref={nameRef}
                    className={errors.name ? 'input-error' : ''}
                    autoFocus
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email" name="email" type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={errors.email ? 'input-error' : ''}
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message" name="message"
                    placeholder="How can we help you?"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    className={errors.message ? 'input-error' : ''}
                  />
                  {errors.message && <span className="field-error">{errors.message}</span>}
                </div>

                {serverError && (
                  <p className="submit-error" role="alert">{serverError}</p>
                )}

                <button
                  type="submit"
                  className={`contact-btn${status === 'loading' ? ' contact-btn--loading' : ''}`}
                  disabled={status === 'loading'}
                >
                  {status === 'loading'
                    ? <span className="btn-loader"><span /><span /><span /></span>
                    : 'Send Message'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}