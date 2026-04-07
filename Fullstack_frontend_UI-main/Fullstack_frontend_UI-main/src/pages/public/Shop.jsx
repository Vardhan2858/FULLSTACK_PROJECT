import { useState, useEffect } from 'react';
import ProductCard from '../../components/ui/ProductCard';
import { productService } from '../../services/productService';
import '../pages.css';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const prods = await productService.getAllProducts();
        setProducts(prods);
        setFilteredProducts(prods);

        const cats = await productService.getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    loadProducts();
  }, []);

  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      try {
        const filtered = await productService.getProductsByCategory(category);
        setFilteredProducts(filtered);
      } catch (error) {
        console.error('Error filtering products:', error);
        // Fallback to local filter
        setFilteredProducts(products.filter(p => p.category === category));
      }
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <h1 style={{ color: '#d4af37', marginBottom: '1rem',marginTop: '1rem',  }}>Shop All Products</h1>

        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-group">
            <label>Filter by Category:</label>
            <button
              onClick={() => handleCategoryFilter('all')}
              className={selectedCategory === 'all' ? 'filter-btn active' : 'filter-btn'}
            >
              All Products
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryFilter(cat.slug)}
                className={selectedCategory === cat.slug ? 'filter-btn active' : 'filter-btn'}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-message">
            <p>No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
