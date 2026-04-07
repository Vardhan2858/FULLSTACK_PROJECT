import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/common/DashboardLayout';
import { useAuth } from '../../../store/AuthProvider';
import { productService } from '../../../services/productService';
import '../../pages.css';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ orders: 0, spent: 0, products: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const orders = await productService.getOrders(user?.id);
        const spent = orders.reduce((sum, o) => sum + o.total, 0);

        setStats({
          orders: orders.length,
          spent: spent,
          products: orders.reduce((sum, o) => sum + o.products.length, 0),
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, [user]);

  return (
    <DashboardLayout role="customer">
      <div>
        <h2>Customer Dashboard</h2>
        <p>Welcome, {user?.name}! Track your orders and manage your profile.</p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">📋 Total Orders</div>
            <div className="stat-value">{stats.orders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">💰 Total Spent</div>
            <div className="stat-value">₹{stats.spent.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">📦 Items Bought</div>
            <div className="stat-value">{stats.products}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">⭐ Member Since</div>
            <div className="stat-value">2026</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
