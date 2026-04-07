import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthProvider';
import './AuthForm.css';

/**
 * RegisterForm Component
 * Handles new user registration
 * Features:
 * - Collects name, email, password, role
 * - Validates password confirmation match
 * - Sends data to backend using Axios
 * - Displays success or error messages
 * - Role-based redirect after successful registration
 */
export default function RegisterForm() {
  // Form state - stores all registration fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'BUYER', // Default role backend value
  });

  const roleOptions = [
    { label: 'Farmer (Seller)', value: 'FARMER' },
    { label: 'Buyer (Customer)', value: 'BUYER' },
  ];

  // Error message state - displays validation or server errors
  const [error, setError] = useState('');

  // Success message state - displays on successful registration
  const [success, setSuccess] = useState('');

  // Loading state - prevents multiple submissions and shows feedback
  const [loading, setLoading] = useState(false);

  // Context functions and navigation
  const navigate = useNavigate();
  const { register } = useAuth();

  /**
   * Handle input field changes
   * Updates form data and clears previous messages
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Trim whitespace from text fields
      const trimmedName = formData.name.trim();
      const trimmedEmail = formData.email.trim();
      const password = formData.password || '';
      const confirmPassword = formData.confirmPassword || '';
      const role = (formData.role || 'BUYER').toUpperCase();

      // Validate required fields with trimmed values
      if (!trimmedName || !trimmedEmail || !password || !confirmPassword || !role) {
        window.alert('All fields are required');
        setError('All fields are required');
        setLoading(false);
        return;
      }

      // Validate password match
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Validate password length
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Build exact request body for backend
      const payload = {
        name: trimmedName,
        email: trimmedEmail,
        password,
        role,
      };

      console.log('Register payload:', payload);

      const user = await register({
        ...payload,
        confirmPassword,
      });

      // Show success message after successful registration
      setSuccess('Registration Successful');

      // Role-based redirect mapping
      const rolesRedirect = {
        'ADMIN': '/admin/dashboard',      // Admin page
        'FARMER': '/farmer/dashboard',    // Farmer page
        'BUYER': '/customer/dashboard',      // Buyer page
      };

      // Redirect to appropriate page based on role
      setTimeout(() => {
        navigate(rolesRedirect[user.role] || '/');
      }, 1500);

    } catch (err) {
      // Display failure message to user
      setError(err?.message || 'Registration Failed');
      if (err.response) {
        console.error('Registration error response:', err.response);
      } else {
        console.error('Registration error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Create Account on OrganicSiri</h2>

      {/* Error message display */}
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {/* Success message display */}
      {success && (
        <div className="success-message" role="alert">
          {success}
        </div>
      )}

      {/* Name input field */}
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
          disabled={loading}
        />
      </div>

      {/* Email input field */}
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          disabled={loading}
          autoComplete="email"
        />
      </div>

      {/* Role selection - FARMER, BUYER */}
      <div className="form-group">
        <label htmlFor="role">Register as</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          disabled={loading}
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Password input field */}
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password (min 6 characters)"
          required
          disabled={loading}
          autoComplete="new-password"
        />
      </div>

      {/* Confirm password input field */}
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          required
          disabled={loading}
          autoComplete="new-password"
        />
      </div>

      {/* Register button with loading state */}
      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Creating Account...' : 'Register'}
      </button>
    </form>
  );
}
