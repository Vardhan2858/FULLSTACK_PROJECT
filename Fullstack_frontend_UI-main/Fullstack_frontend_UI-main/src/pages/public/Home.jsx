import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ui/ProductCard';
import CategoryCard from '../../components/ui/CategoryCard';
import { productService } from '../../services/productService';
import '../pages.css';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cats = await productService.getCategories();
        setCategories(cats);

        const products = await productService.getAllProducts();
        setFeaturedProducts(products.slice(0, 6));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to OrganicSiri</h1>
          <p>Fresh Organic Products Delivered to Your Doorstep</p>
          <Link to="/shop" className="cta-button">Shop Now</Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="view-all">
            <Link to="/shop" className="cta-button">View All Products</Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <h2>Why Choose OrganicSiri?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>100% Organic</h3>
              <p>All our products are certified organic and sustainably grown.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Same-day or next-day delivery available in selected areas.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💚</div>
              <h3>Support Farmers</h3>
              <p>Direct connections mean fair prices for farmers and fresh produce for you.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Quality Assured</h3>
              <p>Every product is hand-picked and quality checked.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
