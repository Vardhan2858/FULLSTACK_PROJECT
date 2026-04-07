import { Link } from 'react-router-dom';
import { useCart } from '../../store/CartProvider';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const imageUrl = product?.image || '/vite.svg';

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={imageUrl}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = '/vite.svg';
          }}
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-category">{product.category}</p>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">₹{product.price}</span>
          <button onClick={handleAddToCart} className="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
