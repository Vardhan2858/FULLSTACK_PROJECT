import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/common/DashboardLayout';
import { productService } from '../../../services/productService';
import '../../pages.css';

export default function OrdersOverview() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const [ordersData, usersData] = await Promise.all([
          productService.getOrders(),
          productService.getUsers(),
        ]);
        setOrders(ordersData);
        setUsers(usersData || []);
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };

    loadOrders();
  }, []);

  const resolveCustomerName = (order) => {
    if (order?.customerName) return order.customerName;
    const matchedUser = users.find((u) => Number(u.id) === Number(order?.userId));
    return matchedUser?.name || `User #${order?.userId}`;
  };

  return (
    <DashboardLayout role="admin">
      <div>
        <h2>Orders Overview</h2>

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
                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{ padding: '0.5rem 1rem', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders found.</p>
        )}

        {selectedOrder && (
          <div
            style={{
              marginTop: '1.5rem',
              background: 'linear-gradient(135deg, #3d4f5e 0%, #2a3542 100%)',
              border: '1px solid #d4af37',
              borderRadius: '8px',
              padding: '1.25rem',
              boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
            }}
          >
            <h3 style={{ marginTop: 0, color: '#d4af37' }}>Order #{selectedOrder.id} Details</h3>
            <p><strong>Ordered By:</strong> {resolveCustomerName(selectedOrder)} (ID: {selectedOrder.userId})</p>
            <p><strong>Order Date:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Completed By:</strong> {selectedOrder.completedByName || 'Not completed yet'}</p>
            <p><strong>Completed At:</strong> {selectedOrder.completedAt ? new Date(selectedOrder.completedAt).toLocaleString() : 'Not completed yet'}</p>

            <h4 style={{ color: '#d4af37', marginBottom: '0.5rem' }}>Items</h4>
            {(selectedOrder.products || []).length > 0 ? (
              <ul style={{ marginTop: 0 }}>
                {selectedOrder.products.map((item, index) => (
                  <li key={`${selectedOrder.id}-${index}`}>
                    {item.name || `Product #${item.id}`} - Qty: {item.quantity} - Price: ₹{Number(item.price || 0).toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No item details available.</p>
            )}

            <button
              onClick={() => setSelectedOrder(null)}
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem 1rem',
                background: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Close Details
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
