import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('lms_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Load user on mount if token exists ────────────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('lms_token');
      if (storedToken) {
        try {
          const { data } = await authAPI.getMe();
          setUser(data.user);
        } catch {
          localStorage.removeItem('lms_token');
          localStorage.removeItem('lms_user');
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const register = useCallback(async (formData) => {
    setError(null);
    const { data } = await authAPI.register(formData);
    localStorage.setItem('lms_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const login = useCallback(async (credentials) => {
    setError(null);
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('lms_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch { /* silent */ }
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    register,
    login,
    logout,
    updateUser,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
