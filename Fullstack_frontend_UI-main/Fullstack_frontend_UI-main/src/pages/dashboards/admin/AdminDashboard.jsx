import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/common/DashboardLayout';
import { productService } from '../../../services/productService';
import '../../pages.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const users = await productService.getUsers();
        const products = await productService.getAllProducts();
        const orders = await productService.getOrders();

        setStats({
          users: users.length,
          products: products.length,
          orders: orders.length,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div>
        <h2>Admin Dashboard</h2>
        <p>Welcome to the admin panel. Manage users, products, and orders from here.</p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">👥 Total Users</div>
            <div className="stat-value">{stats.users}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">📦 Total Products</div>
            <div className="stat-value">{stats.products}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">📋 Total Orders</div>
            <div className="stat-value">{stats.orders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">💰 Revenue</div>
            <div className="stat-value">₹380</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
