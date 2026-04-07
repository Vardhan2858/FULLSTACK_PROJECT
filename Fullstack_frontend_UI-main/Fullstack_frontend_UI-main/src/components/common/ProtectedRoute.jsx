import { Navigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthProvider';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * Redirects to login if user is not authenticated
 * Restricts access based on user role if specified
 *
 * Usage:
 * <ProtectedRoute allowedRoles={['ADMIN', 'FARMER']}>
 *   <AdminPage />
 * </ProtectedRoute>
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Protected component to render
 * @param {string[]} props.allowedRoles - Array of allowed user roles (optional)
 */
export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isLoggedIn } = useAuth();

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles.length > 0) {
    // Support both uppercase (ADMIN) and lowercase (admin) role formats
    const userRole = user?.role?.toUpperCase();
    const allowedRolesUpperCase = allowedRoles.map(role => role.toUpperCase());

    // Redirect to home if user role is not in allowed roles
    if (!allowedRolesUpperCase.includes(userRole)) {
      console.warn(`Access denied for role: ${user?.role}`);
      return <Navigate to="/" replace />;
    }
  }

  // Render protected component if all checks pass
  return children;
}
