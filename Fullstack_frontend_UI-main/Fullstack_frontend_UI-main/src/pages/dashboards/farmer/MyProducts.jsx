import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/common/DashboardLayout';
import { productService } from '../../../services/productService';
import '../../pages.css';

export default function MyProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    loadProducts();
  }, []);

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
      alert('Product deleted successfully');
    }
  };

  return (
    <DashboardLayout role="farmer">
      <div>
        <h2>My Products</h2>

        {products.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>₹{product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button style={{ padding: '0.5rem 1rem', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
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
          <p>You haven't added any products yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
}
