import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../../components/forms/LoginForm';
import RegisterForm from '../../components/forms/RegisterForm';
import './AuthPage.css';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Derive state directly from location instead of using state
  const isLoginMode = location.pathname === '/login';

  const switchToRegister = () => {
    navigate('/register');
  };

  const switchToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="auth-page">
      <div className={`auth-container ${isLoginMode ? 'login-mode' : 'register-mode'}`}>
        {/* Forms Container */}
        <div className="forms-container">
          <div className="form-wrapper login-wrapper">
            <LoginForm />
          </div>
          <div className="form-wrapper register-wrapper">
            <RegisterForm />
          </div>
        </div>

        {/* Overlay Container */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="overlay-btn" onClick={switchToLogin}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="overlay-btn" onClick={switchToRegister}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
