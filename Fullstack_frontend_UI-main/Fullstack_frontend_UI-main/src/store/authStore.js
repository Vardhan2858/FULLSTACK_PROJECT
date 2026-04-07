import React, { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = useCallback((userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  }, []);

  const register = useCallback((userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
  }, []);

  const updateProfile = useCallback((updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }, [user]);

  React.useEffect(() => {
    // Restore user from localStorage on mount
    const storedUser = localStorage.getItem('user');
    const storedLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedUser && storedLoggedIn === 'true') {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, register, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
