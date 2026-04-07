import { authAPI } from './api';

/**
 * Authentication Service
 * Handles user login, registration, and session management
 * Uses Axios-based API client (see api.js for configuration)
 */
export const authService = {
  /**
   * Login user with email and password
   * Sends POST request to /api/auth/login
   * Stores auth token and user data in localStorage
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data and auth token from backend
   * @throws {Error} If login fails
   */
  login: async (email, password) => {
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    try {
      // Make POST request to backend /auth/login endpoint
      const userData = await authAPI.login(email, password);

      // Store auth token in localStorage for subsequent API requests
      if (userData.token) {
        localStorage.setItem('authToken', userData.token);
      }

      // Store user data in localStorage for quick access
      localStorage.setItem('user', JSON.stringify(userData));

      return userData;
    } catch (error) {
      // Handle different error scenarios
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  },

  /**
   * Register new user account
   * Sends POST request to /api/auth/register
   * @param {Object} userData - User registration data (name, email, password, role)
   * @returns {Promise<Object>} Newly created user data
   * @throws {Error} If registration fails
   */
  register: async (userData) => {
    const { name, email, password, confirmPassword, role } = userData;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      throw new Error('All fields are required');
    }

    // Check password match
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Validate password length
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    try {
      const payload = {
        name,
        email,
        password,
        role: (role || 'BUYER').toUpperCase(),
      };
      console.log('Register payload:', payload);

      // Make POST request to backend /auth/register endpoint
      const newUser = await authAPI.register(payload);

      // Store token and user data after successful registration
      if (newUser.token) {
        localStorage.setItem('authToken', newUser.token);
      }
      localStorage.setItem('user', JSON.stringify(newUser));

      return newUser;
    } catch (error) {
      if (error.response) {
        console.error('Register error response:', error.response);
      }
      if (error.message) {
        throw new Error(error.message);
      }
      throw new Error('Registration failed. Please try again.');
    }
  },

  /**
   * Logout current user
   * Clears authentication data from localStorage
   * Calls backend logout endpoint for session cleanup
   */
  logout: async () => {
    try {
      // Notify backend about logout
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local session data regardless of backend response
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
    }
  },

  /**
   * Get currently logged-in user data
   * Retrieves user data from localStorage
   * @returns {Object|null} User object or null if not logged in
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get stored authentication token
   * Used by API interceptor to add auth header
   * @returns {string|null} Auth token or null if not available
   */
  getAuthToken: () => {
    return localStorage.getItem('authToken');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if auth token exists
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};
