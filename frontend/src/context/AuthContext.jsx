// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sayfa yenilendiğinde localStorage'dan user yükle
  useEffect(() => {
    const storedUser = localStorage.getItem('dropspot_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.user);
    localStorage.setItem('dropspot_user', JSON.stringify(res.data.user));
    localStorage.setItem('dropspot_token', res.data.token);
  };

  const signup = async (email, password) => {
    const res = await api.post('/auth/signup', { email, password });
    setUser(res.data.user);
    localStorage.setItem('dropspot_user', JSON.stringify(res.data.user));
    localStorage.setItem('dropspot_token', res.data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dropspot_user');
    localStorage.removeItem('dropspot_token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
