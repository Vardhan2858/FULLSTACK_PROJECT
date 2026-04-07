import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../store/CartProvider';
import { useAuth } from '../../store/AuthProvider';
import { productService } from '../../services/productService';
import CartItem from '../../components/ui/CartItem';
import '../pages.css';

export default function Cart() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!isLoggedIn) {
      alert('Please login to proceed with checkout');
      navigate('/login');
      return;
    }

    const total = getCartTotal() + 5 + getCartTotal() * 0.1;
    try {
      await productService.placeOrder({
        userId: user?.id,
        customerName: user?.name,
        products: cart.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
        })),
        total,
        status: 'pending',
      });

      await clearCart();
      alert('Thank you for your order! Total: ₹' + total.toFixed(2));
    } catch (error) {
      const apiMessage = error?.message || error?.response?.data?.message;
      if (apiMessage && /401|403|unauthor|forbidden|token/i.test(String(apiMessage))) {
        alert('Session expired. Please login again and retry checkout.');
      } else {
        alert('Checkout completed, but clearing cart failed. Please try again.');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <h1 style={{ color: '#d4af37', marginBottom: '2rem' }}>Shopping Cart</h1>

        {cart.length > 0 ? (
          <div className="cart-container">
            <div className="cart-items">
              {cart.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{getCartTotal().toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>₹5.00</span>
              </div>

              <div className="summary-row">
                <span>Tax</span>
                <span>₹{(getCartTotal() * 0.1).toFixed(2)}</span>
              </div>

              <div className="summary-row total">
                <span>Total</span>
                <span>₹{(getCartTotal() + 5 + getCartTotal() * 0.1).toFixed(2)}</span>
              </div>

              {!isLoggedIn && (
                <div style={{ 
                  background: 'linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%)', 
                  padding: '1rem', 
                  borderRadius: '4px', 
                  marginBottom: '1rem',
                  border: '1px solid #ffc107',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: '0', color: '#f4c430', fontSize: '0.9rem', fontWeight: '600' }}>
                    Please <Link to="/login" style={{ color: '#27ae60', textDecoration: 'underline' }}>login</Link> to proceed with checkout
                  </p>
                </div>
              )}

              <button onClick={handleCheckout} className="checkout-btn">
                {isLoggedIn ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>

              <Link to="/shop" className="checkout-btn" style={{ background: '#95a5a6', marginTop: '0.5rem', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="empty-message">
            <p>Your cart is empty</p>
            <Link to="/shop" className="cta-button">Start Shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
}
