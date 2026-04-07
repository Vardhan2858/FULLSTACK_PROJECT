import axios from 'axios';

// Configure Axios instance with base URL
// Points to Spring Boot backend running on localhost:8080
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token in every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // POST /api/auth/login
  // Sends email and password to backend for authentication
  login: async (email, password) => {
    try {
      const payload = { email, password };
      console.log('Login request payload:', payload);
      const response = await apiClient.post('/auth/login', payload);
      return response.data;
    } catch (error) {
      console.log('Login error response:', error.response);
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // POST /api/auth/register
  // Registers a new user account
  register: async (userData) => {
    try {
      console.log('Register request payload:', userData);
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.log('Register error response:', error.response);
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // POST /api/auth/logout
  // Logouts current user
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};

// Product API calls
export const productAPI = {
  // GET /api/products
  // Fetches all products
  getAllProducts: async () => {
    try {
      const response = await apiClient.get('/products');
      return response.data;
    } catch (error) {
      console.log('Get all products error response:', error.response);
      throw error.response?.data || { message: 'Failed to fetch products' };
    }
  },

  // GET /api/products/category/{category}
  // Fetches products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await apiClient.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      console.log('Get products by category error response:', error.response);
      throw error.response?.data || { message: 'Failed to fetch products by category' };
    }
  },
};

// Cart API calls
export const cartAPI = {
  // POST /api/cart
  // Adds item to cart
  addToCart: async (userId, productId, quantity) => {
    try {
      const payload = { userId, productId, quantity };
      console.log('Add to cart request payload:', payload);
      const response = await apiClient.post('/cart', payload);
      return response.data;
    } catch (error) {
      console.log('Add to cart error response:', error.response);
      throw error.response?.data || { message: 'Failed to add to cart' };
    }
  },

  // GET /api/cart/{userId}
  // Fetches cart items for a user
  getCartByUser: async (userId) => {
    try {
      const response = await apiClient.get(`/cart/${userId}`);
      return response.data;
    } catch (error) {
      console.log('Get cart by user error response:', error.response);
      throw error.response?.data || { message: 'Failed to fetch cart' };
    }
  },

  // DELETE /api/cart/user/{userId}
  // Removes all cart items for a user
  clearCartByUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/cart/user/${userId}`);
      return response.data;
    } catch (error) {
      console.log('Clear cart error response:', error.response);
      throw {
        ...(error.response?.data || { message: 'Failed to clear cart' }),
        status: error.response?.status,
      };
    }
  },
};

// User API calls
export const userAPI = {
  // GET /api/users
  getUsers: async () => {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  // GET /api/users/:id
  getUserById: async (id) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user' };
    }
  },

  // POST /api/users
  addUser: async (user) => {
    try {
      const response = await apiClient.post('/users', user);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add user' };
    }
  },

  // PUT /api/users/:id
  updateUser: async (id, user) => {
    try {
      const response = await apiClient.put(`/users/${id}`, user);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  // DELETE /api/users/:id
  deleteUser: async (id) => {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },
};

// Export default Axios instance for custom API calls
export default apiClient;
