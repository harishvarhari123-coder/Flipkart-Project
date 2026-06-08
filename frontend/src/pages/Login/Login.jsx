import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill all fields'); return; }
    try {
      setLoading(true);
      await login(email, password, rememberMe);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-banner">
          <div>
            <h2>Login</h2>
            <p>Explore, save, and shop with personalized recommendations from HariKart.</p>    
                  </div>
          <div className="auth-banner-image">🛒</div>
        </div>
        <div className="auth-form-container">
        <h3 style={{ fontWeight: 700 }}>Welcome Back To Login!</h3>
                  <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-input-group">
              <input type="email" placeholder=" " value={email} onChange={e => setEmail(e.target.value)} autoFocus />
              <label>Email Address</label>
            </div>
            <div className="auth-input-group">
              <input type="password" placeholder=" " value={password} onChange={e => setPassword(e.target.value)} />
              <label>Password</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ width: 'auto', margin: 0, padding: 0 }} />
              <label htmlFor="rememberMe" style={{ position: 'static', transform: 'none', color: 'inherit', padding: 0, pointerEvents: 'auto' }}>Remember me</label>
            </div>
            <p className="auth-terms">
              By continuing, you agree to Harikart's <a href="/term">Terms of Use</a> and <a href="/policy">Privacy Policy</a>.
            </p>
            <button type="submit" className="btn btn-secondary btn-block btn-lg" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="auth-switch">
              <Link to="/register">New to Harikart? Create an account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
