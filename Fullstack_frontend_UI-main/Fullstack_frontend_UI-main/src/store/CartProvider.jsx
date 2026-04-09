import { createContext, useState, useCallback, useContext, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthProvider';
import { productService } from '../services/productService';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  const normalizeCartItem = useCallback(async (cartItem) => {
    const product = await productService.getProductById(cartItem.productId);
    return {
      ...product,
      cartId: cartItem.id,
      id: product?.id ?? cartItem.productId,
      productId: cartItem.productId,
      quantity: Number(cartItem.quantity) || 1,
    };
  }, []);

  const loadCartFromAPI = useCallback(async () => {
    if (!user || !user.id) return;
    try {
      const cartItems = await cartAPI.getCartByUser(user.id);
      const normalizedItems = await Promise.all((cartItems || []).map(normalizeCartItem));
      setCart(normalizedItems);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart([]);
    }
  }, [user, normalizeCartItem]);

  // Load cart from API when user logs in
  useEffect(() => {
    if (user && user.id) {
      loadCartFromAPI();
    } else {
      setCart([]);
    }
  }, [user, loadCartFromAPI]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    if (!user || !user.id) {
      alert('Please login to add items to cart');
      return;
    }
    try {
      await cartAPI.addToCart(user.id, product.id, quantity);
      await loadCartFromAPI();
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to local state
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product.id);
        if (existingItem) {
          return prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: (Number(item.quantity) || 0) + quantity }
              : item
          );
        }
        return [...prevCart, {
          ...product,
          id: product.id,
          quantity,
        }];
      });
    }
  }, [user, loadCartFromAPI]);

  const removeFromCart = useCallback(async (cartItemOrProductId) => {
    const cartItem = typeof cartItemOrProductId === 'object'
      ? cartItemOrProductId
      : cart.find((item) => item.id === cartItemOrProductId || item.productId === cartItemOrProductId);

    if (user?.id && cartItem?.cartId) {
      try {
        await cartAPI.deleteCartItem(cartItem.cartId);
        await loadCartFromAPI();
        return;
      } catch (error) {
        console.error('Error removing cart item from API:', error);
      }
    }

    const productId = typeof cartItemOrProductId === 'object'
      ? (cartItemOrProductId.id ?? cartItemOrProductId.productId)
      : cartItemOrProductId;

    setCart(prevCart => prevCart.filter(item => item.id !== productId && item.productId !== productId));
  }, [user, cart, loadCartFromAPI]);

  const updateQuantity = useCallback(async (cartItemOrProductId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemOrProductId);
      return;
    }

    const cartItem = typeof cartItemOrProductId === 'object'
      ? cartItemOrProductId
      : cart.find((item) => item.id === cartItemOrProductId || item.productId === cartItemOrProductId);

    if (user?.id && cartItem?.cartId) {
      try {
        await cartAPI.updateCartItemQuantity(cartItem.cartId, quantity);
        await loadCartFromAPI();
        return;
      } catch (error) {
        console.error('Error updating cart quantity in API:', error);
      }
    }

    const productId = typeof cartItemOrProductId === 'object'
      ? (cartItemOrProductId.id ?? cartItemOrProductId.productId)
      : cartItemOrProductId;

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId || item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, [user, cart, loadCartFromAPI, removeFromCart]);

  const clearCart = useCallback(async () => {
    if (user && user.id) {
      try {
        await cartAPI.clearCartByUser(user.id);
      } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
      }
    }
    setCart([]);
  }, [user]);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + price * quantity;
    }, 0);
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + (Number(item.quantity) || 0), 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
