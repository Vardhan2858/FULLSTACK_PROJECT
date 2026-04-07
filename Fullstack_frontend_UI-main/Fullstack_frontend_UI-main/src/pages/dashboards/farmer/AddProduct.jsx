import { useState } from 'react';
import DashboardLayout from '../../../components/common/DashboardLayout';
import '../../pages.css';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'vegetables',
    price: '',
    stock: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Product added successfully!');
    setFormData({
      name: '',
      category: 'vegetables',
      price: '',
      stock: '',
      description: '',
    });
  };

  return (
    <DashboardLayout role="farmer">
      <div>
        <h2>Add New Product</h2>

        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', background: 'white', padding: '2rem', borderRadius: '8px' }}>
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Organic Tomatoes"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="staples">Staples</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (per unit)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="₹0.00"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock Quantity</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product..."
              rows="4"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #bdc3c7', borderRadius: '4px', fontFamily: 'inherit' }}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn" style={{ width: '100%' }}>
            Add Product
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
