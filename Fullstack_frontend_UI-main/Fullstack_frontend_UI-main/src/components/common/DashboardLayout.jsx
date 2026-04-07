import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthProvider';
import './DashboardLayout.css';

export default function DashboardLayout({ children, role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  let menuItems = [];
  if (role === 'admin') {
    menuItems = [
      { label: 'Dashboard', path: '/admin/dashboard' },
      { label: 'Users', path: '/admin/users' },
      { label: 'Products', path: '/admin/products' },
      { label: 'Orders', path: '/admin/orders' },
    ];
  } else if (role === 'farmer') {
    menuItems = [
      { label: 'Dashboard', path: '/farmer/dashboard' },
      { label: 'My Products', path: '/farmer/products' },
      { label: 'Add Product', path: '/farmer/add-product' },
      { label: 'Orders', path: '/farmer/orders' },
    ];
  } else if (role === 'customer') {
    menuItems = [
      { label: 'Dashboard', path: '/customer/dashboard' },
      { label: 'My Orders', path: '/customer/orders' },
      { label: 'Profile', path: '/customer/profile' },
    ];
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>🌾 OrganicSiri</h2>
          <p className="role-badge">{role.charAt(0).toUpperCase() + role.slice(1)}</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="home-link">← Back to Home</Link>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </aside>

      <div className="dashboard-content">
        <div className="topbar">
          <h1 className="page-title">Dashboard</h1>
          <div className="user-info">
            <span>{user?.name}</span>
            <span className="user-icon">👤</span>
          </div>
        </div>

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
