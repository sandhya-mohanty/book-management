import React, { createContext, useState, useEffect } from 'react';
import { login, logout } from '../utils/auth';
import API from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(response => setUser(response.data.user))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const handleLogin = async (userData) => {
    const { token } = await login(userData);
    localStorage.setItem('token', token);
    setUser(token);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
