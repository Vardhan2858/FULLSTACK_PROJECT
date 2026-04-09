import { useRef, useState } from 'react';
import DashboardLayout from '../../../components/common/DashboardLayout';
import { productService } from '../../../services/productService';
import '../../pages.css';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'vegetables',
    price: '',
    stock: '',
    description: '',
    image: '',
  });
  const [imageName, setImageName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
      setImageName(file.name);
      setStatusMessage('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    setIsSubmitting(true);

    try {
      if (!formData.image) {
        setStatusMessage('Please upload a product image.');
        setIsSubmitting(false);
        return;
      }

      await productService.addProduct({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      });

      setStatusMessage('Product added successfully. It is now visible on Home and Shop pages.');
      setFormData({
        name: '',
        category: 'vegetables',
        price: '',
        stock: '',
        description: '',
        image: '',
      });
      setImageName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      setStatusMessage('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="farmer">
      <div>
        <h2>Add New Product</h2>

        {statusMessage && (
          <p style={{ margin: '0 0 1rem', color: statusMessage.startsWith('Product added') ? '#2e7d32' : '#c62828' }}>
            {statusMessage}
          </p>
        )}

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

          <div className="form-group">
            <label htmlFor="productImage">Product Image</label>
            <input
              ref={fileInputRef}
              type="file"
              id="productImage"
              name="productImage"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '0.6rem 1rem',
                border: '1px solid #2c6b2f',
                borderRadius: '6px',
                background: '#f4fff4',
                color: '#1f4d21',
                cursor: 'pointer',
              }}
            >
              Upload Image
            </button>
            <p style={{ marginTop: '0.5rem', color: '#555' }}>
              {imageName || 'No image selected'}
            </p>
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '6px', marginTop: '0.5rem' }}
              />
            )}
          </div>

          <button type="submit" className="submit-btn" style={{ width: '100%' }} disabled={isSubmitting}>
            {isSubmitting ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
