import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null); // 'HOST' or 'ATTENDEE'
  const [user, setUser] = useState(null);

  const login = (id) => {
    const isHost = id.toLowerCase().includes('host') || id.toLowerCase().includes('manager');
    setRole(isHost ? 'HOST' : 'ATTENDEE');
    setUser(id);
  };
  const logout = () => { setRole(null); setUser(null); };

  return <AuthContext.Provider value={{ role, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
