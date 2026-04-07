import { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

/**
 * AuthContext
 * Provides authentication state and methods to all child components
 * Manages user login, logout, and session persistence
 */
export const AuthContext = createContext();

/**
 * AuthProvider Component
 * Wraps the entire application to provide authentication context
 * Restores user session from localStorage on app startup
 *
 * Usage:
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function AuthProvider({ children }) {
  // Store logged-in user data (includes id, email, role, etc.)
  const [user, setUser] = useState(null);

  // Track authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Track loading state for async operations
  const [loading, setLoading] = useState(false);

  /**
   * Login user
   * Calls authService.login and updates context state
   * @param {string} email - User email
   * @param {string} password - User password
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout user
   * Clears user data from context and localStorage
   * Called when user clicks logout or auth token expires
   */
  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    // Clear all auth-related data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
  }, []);

  /**
   * Register user
   * Calls authService.register and updates context state
   * @param {Object} userData - User registration data
   */
  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const newUser = await authService.register(userData);
      setUser(newUser);
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      return newUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update user profile
   * Merges updated user data with existing user object
   * Persists changes to localStorage
   * @param {Object} updatedData - Partial user object with fields to update
   */
  const updateProfile = useCallback((updatedData) => {
    setUser(prevUser => {
      const newUser = { ...prevUser, ...updatedData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  /**
   * Effect: Restore user session on app startup
   * Checks localStorage for stored user data and auth status
   * Automatically logs user in if previous session exists
   * This allows users to remain logged in after page refresh
   */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('authToken');

      // Restore session only if both user and token exist
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
      } else {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
      }
    } catch (error) {
      console.error('Error restoring user session:', error);
      // Clear corrupted data if parsing fails
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('authToken');
    }
  }, []);

  // Context value - exporting all state and functions to consumers
  const value = {
    user,           // Current logged-in user object
    isLoggedIn,     // Boolean flag for login status
    loading,        // Loading state for async operations
    login,          // Function to log in user
    logout,         // Function to log out user
    register,       // Function to register new user
    updateProfile,  // Function to update user profile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use AuthContext
 * Provides easy access to auth state and functions in any component
 *
 * Usage:
 * const { user, isLoggedIn, login, logout } = useAuth();
 *
 * @returns {Object} Auth context value
 * @throws {Error} If used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
