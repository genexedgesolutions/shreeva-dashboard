// components/AuthProvider.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login API call
  async function login({ email, password }) {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user)); // ✅ persist
        return { ok: true, user: res.user };
      } else {
        return { ok: false, error: res.message || 'Invalid credentials' };
      }
    } catch (err) {
      return { ok: false, error: err?.message || 'Login failed' };
    }
  }

  // Logout
  function logout() {
    setUser(null);
    localStorage.removeItem('user'); // ✅ clear
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
