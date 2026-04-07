import { useState } from 'react';
import DashboardLayout from '../../../components/common/DashboardLayout';
import { useAuth } from '../../../store/AuthProvider';
import '../../pages.css';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, City, State 12345',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <DashboardLayout role="customer">
      <div>
        <h2>My Profile</h2>

        <div
          style={{
            maxWidth: '600px',
            background: '#ffffff',
            color: '#1f2937',
            padding: '2rem',
            borderRadius: '8px',
            border: '1px solid #d4af37',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}
        >
          {!isEditing ? (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: '#1f2937' }}><strong>Name:</strong> {user?.name}</p>
                <p style={{ color: '#1f2937' }}><strong>Email:</strong> {user?.email}</p>
                <p style={{ color: '#1f2937' }}><strong>Phone:</strong> {formData.phone}</p>
                <p style={{ color: '#1f2937' }}><strong>Address:</strong> {formData.address}</p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: '#27ae60',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="submit-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    background: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 2rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
