import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API = 'https://flipkart-project-l2ex.onrender.com/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const initialToken = localStorage.getItem('token') || sessionStorage.getItem('token');
  const [token, setToken] = useState(initialToken);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/auth/profile`);
      setUser(res.data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, rememberMe = true) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    const newToken = res.data.token;
    if (rememberMe) {
      localStorage.setItem('token', newToken);
    } else {
      sessionStorage.setItem('token', newToken);
    }
    setToken(newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password, phone, otp) => {
    const res = await axios.post(`${API}/auth/register`, { name, email, password, phone, otp });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
