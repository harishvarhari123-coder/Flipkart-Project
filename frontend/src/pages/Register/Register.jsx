import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../Login/Login.css';

// ── OTP Toast Popup ──────────────────────────────────────────
function OtpToast({ otp, email, onClose }) {
  if (!otp) return null;
  return (
    <>
      <style>{`
        .otp-toast-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 9998;
          animation: fadeIn 0.2s ease;
        }
        .otp-toast {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.22);
          z-index: 9999;
          padding: 32px 36px 24px;
          min-width: 320px;
          max-width: 90vw;
          text-align: center;
          animation: popIn 0.25s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes popIn {
          from { opacity: 0; transform: translate(-50%, -54%) scale(0.88); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        .otp-toast-icon {
          font-size: 40px;
          margin-bottom: 8px;
        }
        .otp-toast h4 {
          margin: 0 0 6px;
          font-size: 17px;
          color: #222;
          font-weight: 700;
        }
        .otp-toast p {
          margin: 0 0 18px;
          font-size: 13px;
          color: #666;
        }
        .otp-toast p span {
          color: #2874f0;
          font-weight: 600;
        }
        .otp-code-box {
          display: inline-block;
          background: #f0f5ff;
          border: 2px dashed #2874f0;
          border-radius: 8px;
          padding: 12px 32px;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: 8px;
          color: #2874f0;
          margin-bottom: 20px;
          font-family: 'Courier New', monospace;
        }
        .otp-toast-note {
          font-size: 11px !important;
          color: #999 !important;
          margin-bottom: 20px !important;
        }
        .otp-toast-close {
          background: #2874f0;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 10px 36px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s;
        }
        .otp-toast-close:hover { background: #1a5dc8; }
      `}</style>
      <div className="otp-toast-overlay" onClick={onClose} />
      <div className="otp-toast">
        <div className="otp-toast-icon">📬</div>
        <h4>OTP Sent Successfully!</h4>
        <p>
          Sent to <span>{email}</span>
        </p>
        <div className="otp-code-box">{otp}</div>
        <p className="otp-toast-note">⏱ Valid for 10 minutes. Do not share this OTP.</p>
        <button className="otp-toast-close" onClick={onClose}>
          Got it!
        </button>
      </div>
    </>
  );
}

// ── Register Component ───────────────────────────────────────
export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // NEW: store the OTP value to show in popup
  const [popupOtp, setPopupOtp] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('Please fill all required fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    try {
      setLoading(true);
      const res = await axios.post('https://flipkart-project-l2ex.onrender.com/api/auth/send-otp', { email });

      // Backend returns the OTP in response (add this to backend — see note below)
      // If your backend returns { otp } use it; otherwise show a generic popup
      const receivedOtp = res.data.otp || '';

      setOtpSent(true);
      setPopupOtp(receivedOtp);
      setShowOtpPopup(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp) { setError('Please enter the OTP'); return; }
    try {
      setLoading(true);
      await register(name, email, password, phone, otp);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* OTP Popup */}
      {showOtpPopup && (
        <OtpToast
          otp={popupOtp}
          email={email}
          onClose={() => setShowOtpPopup(false)}
        />
      )}

      <div className="auth-container">
        <div className="auth-banner">
          <div>
            <h2>Looks like you're new here!</h2>
            <p>Sign up with your email to get started</p>
          </div>
          <div className="auth-banner-image">🎉</div>
        </div>
        <div className="auth-form-container">
          <h3>Create Account</h3>
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-input-group">
              <input type="text" placeholder=" " value={name} onChange={e => setName(e.target.value)} autoFocus />
              <label>Full Name *</label>
            </div>
            <div className="auth-input-group">
              <input type="email" placeholder=" " value={email} onChange={e => setEmail(e.target.value)} />
              <label>Email Address *</label>
            </div>
            <div className="auth-input-group">
              <input type="password" placeholder=" " value={password} onChange={e => setPassword(e.target.value)} />
              <label>Password *</label>
            </div>
            <div className="auth-input-group">
              <input type="tel" placeholder=" " value={phone} onChange={e => setPhone(e.target.value)} disabled={otpSent} />
              <label>Phone (Optional)</label>
            </div>

            {otpSent && (
              <div className="auth-input-group">
                <input type="text" placeholder=" " value={otp} onChange={e => setOtp(e.target.value)} required autoFocus />
                <label>Enter OTP</label>
              </div>
            )}

            <p className="auth-terms">
              By continuing, you agree to Harikart's <a href="/term">Terms of Use</a> and <a href="/policy">Privacy Policy</a>.
            </p>

            {!otpSent ? (
              <button type="button" className="btn btn-secondary btn-block btn-lg" disabled={loading} onClick={handleSendOtp}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-secondary btn-block"
                  style={{ marginBottom: 8, background: 'transparent', border: '1px solid #2874f0', color: '#2874f0', fontSize: 13 }}
                  onClick={() => setShowOtpPopup(true)}
                >
                  🔁 Show OTP again
                </button>
                <button type="submit" className="btn btn-secondary btn-block btn-lg" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Verify & Sign Up'}
                </button>
              </>
            )}

            <div className="auth-switch">
              <Link to="/login">Existing User? Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}