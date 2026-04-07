import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/common/DashboardLayout';
import { productService } from '../../../services/productService';
import '../../pages.css';

export default function FarmerDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const products = await productService.getAllProducts();
        const orders = await productService.getOrders();

        setStats({
          products: products.length,
          orders: orders.length,
          revenue: orders.reduce((sum, o) => sum + o.total, 0),
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <DashboardLayout role="farmer">
      <div>
        <h2>Farmer Dashboard</h2>
        <p>Manage your products and view your orders.</p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">📦 My Products</div>
            <div className="stat-value">{stats.products}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">📋 Orders Received</div>
            <div className="stat-value">{stats.orders}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">💰 Total Revenue</div>
            <div className="stat-value">₹{stats.revenue.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">⭐ Rating</div>
            <div className="stat-value">4.8/5.0</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
