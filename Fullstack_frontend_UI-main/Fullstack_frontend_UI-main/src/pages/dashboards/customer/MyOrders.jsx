import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/common/DashboardLayout';
import { useAuth } from '../../../store/AuthProvider';
import { productService } from '../../../services/productService';
import '../../pages.css';

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await productService.getOrders(user?.id);
        setOrders(data);
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };

    loadOrders();
  }, [user]);

  return (
    <DashboardLayout role="customer">
      <div>
        <h2>My Orders</h2>

        {orders.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>{order.products.length}</td>
                  <td>₹{order.total.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>You haven't placed any orders yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
