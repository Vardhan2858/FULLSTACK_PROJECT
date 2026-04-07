import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthProvider';
import './AuthForm.css';

const generateCaptchaChallenge = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
  let captchaText = '';
  for (let i = 0; i < 6; i += 1) {
    const index = Math.floor(Math.random() * alphabet.length);
    captchaText += alphabet[index];
  }

  return {
    question: captchaText,
    answer: captchaText,
  };
};

/**
 * LoginForm Component
 * Handles user login with email and password
 * Features:
 * - Form validation
 * - Loading state feedback
 * - Error message display
 * - Role-based redirect after successful login
 * - Axios-based API calls (see authService.js)
 */
export default function LoginForm() {
  // Form state - separate state for each field for better control
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Error message state - displays login failures
  const [error, setError] = useState('');

  // Loading state - prevents multiple submissions and shows feedback
  const [loading, setLoading] = useState(false);

  // Captcha state
  const [captchaInput, setCaptchaInput] = useState('');
  const [captcha, setCaptcha] = useState(generateCaptchaChallenge);

  // Context functions
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle email input change
   */
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(''); // Clear error when user starts typing
  };

  /**
   * Handle password input change
   */
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(''); // Clear error when user starts typing
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptchaChallenge());
    setCaptchaInput('');
  };

  /**
   * Handle form submission
   * 1. Validates input
   * 2. Calls login API via Axios
   * 3. Stores user data in localStorage
   * 4. Redirects to shop page
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Debug logging
      console.log('Sending:', { email, password });

      // Trim inputs and validate
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (!trimmedEmail || !trimmedPassword) {
        setError('Please enter both email and password');
        setLoading(false);
        return;
      }

      if (captchaInput.trim().toLowerCase() !== captcha.answer.toLowerCase()) {
        setError('Captcha is incorrect. Please try again.');
        refreshCaptcha();
        setLoading(false);
        return;
      }

      const payload = {
        email: trimmedEmail,
        password: trimmedPassword,
      };

      console.log('Login payload:', payload);

      // Call login via auth context (which uses Axios internally)
      const user = await login(trimmedEmail, trimmedPassword);

      console.log('Response:', user);

      // Redirect based on role
      const role = (user?.role || '').toUpperCase();
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'FARMER') {
        navigate('/farmer/dashboard');
      } else if (role === 'BUYER') {
        navigate('/customer/dashboard');
      } else {
        navigate('/shop');
      }
    } catch (err) {
      // Display error message to user
      console.error('Login error:', err);
      if (err.response) {
        console.error('Login error response:', err.response);
        setError('Invalid email or password');
      } else {
        setError(err.message || 'Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login to OrganicSiri</h2>

      {/* Error message display */}
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {/* Email input field */}
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          required
          disabled={loading}
          autoComplete="email"
        />
      </div>

      {/* Password input field */}
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="password-input-row">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            required
            disabled={loading}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={loading}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="captchaInput">Captcha Verification</label>
        <div className="captcha-row">
          <div className="captcha-challenge" aria-label="captcha challenge">
            {captcha.question}
          </div>
          <button
            type="button"
            className="captcha-refresh-btn"
            onClick={refreshCaptcha}
            disabled={loading}
          >
            Refresh
          </button>
        </div>
        <input
          type="text"
          id="captchaInput"
          name="captchaInput"
          value={captchaInput}
          onChange={(e) => {
            setCaptchaInput(e.target.value);
            setError('');
          }}
          placeholder="Enter captcha result"
          required
          disabled={loading}
          inputMode="text"
        />
      </div>

      {/* Login button with loading state */}
      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
