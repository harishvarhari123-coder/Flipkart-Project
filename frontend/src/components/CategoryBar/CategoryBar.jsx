import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './CategoryBar.css';

const API = 'http://localhost:5000/api';

export default function CategoryBar() {
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeCategory = searchParams.get('category');

  useEffect(() => {
    axios.get(`${API}/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="category-bar">
      <div className="category-bar-inner">
        <div
          className={`category-bar-item ${!activeCategory ? 'active' : ''}`}
          onClick={() => navigate('/products')}
        >
          <span className="category-bar-icon">✨</span>
          <span className="category-bar-name">For You</span>
        </div>
        {categories.map(cat => (
          <div
            key={cat.id}
            className={`category-bar-item ${activeCategory === String(cat.id) ? 'active' : ''}`}
            onClick={() => navigate(`/products?category=${cat.id}`)}
          >
            <span className="category-bar-icon">{cat.icon}</span>
            <span className="category-bar-name">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
