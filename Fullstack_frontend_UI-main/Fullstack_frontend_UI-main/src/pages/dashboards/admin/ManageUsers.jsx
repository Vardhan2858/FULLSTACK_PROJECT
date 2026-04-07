import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/common/DashboardLayout';
import { productService } from '../../../services/productService';
import '../../pages.css';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await productService.getUsers();
        const filteredUsers = (data || []).filter(
          (user) => (user?.role || '').toUpperCase() !== 'ADMIN'
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const deleted = await productService.deleteUser(id);
      if (deleted) {
        setUsers(users.filter(u => u.id !== id));
        alert('User deleted successfully');
      } else {
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  return (
    <DashboardLayout role="admin">
      <div>
        <h2>Manage Users</h2>

        {users.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.joinDate}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={{ padding: '0.5rem 1rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
