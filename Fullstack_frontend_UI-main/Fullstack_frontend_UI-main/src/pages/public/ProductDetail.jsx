import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../../store/CartProvider';
import { productService } from '../../services/productService';
import '../pages.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const prod = await productService.getProductById(id);
        setProduct(prod);
      } catch (error) {
        console.error('Error loading product:', error);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert('Product added to cart!');
    }
  };

  if (!product) {
    return <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="container">
        <Link to="/shop" style={{ color: '#d4af37', marginBottom: '2rem', display: 'block' }}>
          ← Back to Shop
        </Link>

        <div className="product-detail">
          <div className="detail-grid">
            <div className="detail-image">
              <img src={product.image} alt={product.name} />
            </div>

            <div className="detail-info">
              <h1>{product.name}</h1>
              <p className="detail-category">Category: {product.category}</p>
              <p className="detail-price">₹{product.price}</p>

              <p className="detail-description">{product.description}</p>

              <p style={{ color: '#d4d4d4' }}>
                <strong>Stock Available:</strong> {product.stock} items
              </p>

              <div className="detail-actions">
                <div className="quantity-input">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.stock}
                  />
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                </div>

                <button onClick={handleAddToCart} className="add-to-cart-large">
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
