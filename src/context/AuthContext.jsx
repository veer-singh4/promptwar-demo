/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sanitize } from '../lib/utils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null); // 'HOST' or 'ATTENDEE'
  const [user, setUser] = useState(null);
  const [lastActivity, setLastActivity] = useState(() => Date.now());

  const logout = useCallback(() => {
    setRole(null);
    setUser(null);
  }, []);

  const login = (id) => {
    // Sanitize input to prevent XSS
    const cleanId = sanitize(id);
    const isHost = cleanId.toLowerCase().includes('host') || cleanId.toLowerCase().includes('manager');
    setRole(isHost ? 'HOST' : 'ATTENDEE');
    setUser(cleanId);
    setLastActivity(Date.now());
  };

  // Session timeout: Auto-logout after 30 minutes of inactivity
  useEffect(() => {
    if (!user) return;

    const TIMEOUT_MS = 30 * 60 * 1000;
    const interval = setInterval(() => {
      if (Date.now() - lastActivity > TIMEOUT_MS) {
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user, lastActivity, logout]);

  // Update activity on interactions
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    window.addEventListener('mousedown', updateActivity);
    window.addEventListener('keydown', updateActivity);
    return () => {
      window.removeEventListener('mousedown', updateActivity);
      window.removeEventListener('keydown', updateActivity);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
