import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/common/DashboardLayout';
import { productService } from '../../../services/productService';
import { useAuth } from '../../../store/AuthProvider';
import '../../pages.css';

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await productService.getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };

    loadOrders();
  }, []);

  const updateStatus = async (order, newStatus) => {
    await productService.updateOrderStatus(order, newStatus, {
      completedById: user?.id,
      completedByName: user?.name,
    });
    setOrders((prevOrders) => prevOrders.map((o) =>
      o.id === order.id
        ? {
            ...o,
            status: newStatus,
            completedById: user?.id,
            completedByName: user?.name,
            completedAt: new Date().toISOString(),
          }
        : o
    ));
    alert('Order status updated successfully');
  };

  return (
    <DashboardLayout role="farmer">
      <div>
        <h2>My Orders</h2>

        {orders.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer ID</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>#{order.userId}</td>
                  <td>₹{order.total.toFixed(2)}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {(order.status === 'pending' || (order.status === 'completed' && !order.completedByName)) && (
                      <button
                        onClick={() => updateStatus(order, 'completed')}
                        style={{ padding: '0.5rem 1rem', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        {order.status === 'pending' ? 'Mark Complete' : 'Save Completer'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
