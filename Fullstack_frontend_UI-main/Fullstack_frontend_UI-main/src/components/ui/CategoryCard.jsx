import { Link } from 'react-router-dom';
import './CategoryCard.css';

export default function CategoryCard({ category }) {
  return (
    <Link to={`/category/${category.slug}`} className="category-card">
      <div className="category-image">
        <img src={category.image} alt={category.name} />
      </div>
      <div className="category-overlay">
        <h3>{category.name}</h3>
        <p>Shop Now →</p>
      </div>
    </Link>
  );
}
