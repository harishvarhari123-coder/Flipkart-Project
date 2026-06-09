import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Products.css';

const API = 'https://flipkart-project-l2ex.onrender.com/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // ✅ Ref for auto-focusing the search input
  const searchInputRef = useRef(null);

  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentSearch = searchParams.get('search') || '';

  // ✅ Auto-focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    axios.get(`${API}/categories`).then(res => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);

    // ✅ Scroll to top whenever filters / sort / search change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const params = {};
    if (currentCategory) params.category = currentCategory;
    if (currentSort) params.sort = currentSort;
    if (currentSearch) params.search = currentSearch;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;

    axios.get(`${API}/products`, { params })
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentCategory, currentSort, currentSearch, minPrice, maxPrice]);

  const setSort = (sort) => {
    const params = new URLSearchParams(searchParams);
    if (sort) params.set('sort', sort); else params.delete('sort');
    setSearchParams(params);
  };

  const toggleCategory = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (!catId) {
      params.delete('category');
    } else {
      let categoriesList = currentCategory ? currentCategory.split(',') : [];
      const catIdStr = String(catId);
      if (categoriesList.includes(catIdStr)) {
        categoriesList = categoriesList.filter(id => id !== catIdStr);
      } else {
        categoriesList.push(catIdStr);
      }
      if (categoriesList.length > 0) {
        params.set('category', categoriesList.join(','));
      } else {
        params.delete('category');
      }
    }
    params.delete('sort');
    setSearchParams(params);
  };

  return (
    <div className="products-page">
      <aside className="products-sidebar">
        <h3>Filters</h3>

        <div className="filter-section">
          <h4>Category</h4>
          <div className="filter-option" onClick={() => toggleCategory('')}>
            <input type="checkbox" checked={!currentCategory} readOnly /> All
          </div>
          {categories.map(cat => {
            const isChecked = currentCategory ? currentCategory.split(',').includes(String(cat.id)) : false;
            return (
              <div key={cat.id} className="filter-option" onClick={() => toggleCategory(cat.id)}>
                <input type="checkbox" checked={isChecked} readOnly />
                {cat.icon} {cat.name}
              </div>
            );
          })}
        </div>

        <div className="filter-section">
          <h4>Price Range</h4>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
            />
          </div>
          {/* No-op button kept — price filter triggers via useEffect on state change */}
          <button className="filter-apply-btn">Apply</button>
        </div>
      </aside>

      <main className="products-main">
        <div className="products-topbar">
          <h2>
            {currentSearch ? `Results for "${currentSearch}"` : 'All Products'}
            <span style={{ fontWeight: 400, fontSize: 14, color: '#878787', marginLeft: 8 }}>
              ({products.length} items)
            </span>
          </h2>
          <div className="products-sort">
            <span>Sort By</span>
            <button className={`sort-option ${!currentSort ? 'active' : ''}`} onClick={() => setSort('')}>Relevance</button>
            <button className={`sort-option ${currentSort === 'price_low' ? 'active' : ''}`} onClick={() => setSort('price_low')}>Price ↑</button>
            <button className={`sort-option ${currentSort === 'price_high' ? 'active' : ''}`} onClick={() => setSort('price_high')}>Price ↓</button>
            <button className={`sort-option ${currentSort === 'rating' ? 'active' : ''}`} onClick={() => setSort('rating')}>Rating</button>
            <button className={`sort-option ${currentSort === 'discount' ? 'active' : ''}`} onClick={() => setSort('discount')}>Discount</button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner" /><p>Loading products...</p></div>
        ) : products.length === 0 ? (
          <div className="products-empty">
            <span style={{ fontSize: 48 }}>🔍</span>
            <h3>No products found</h3>
            <p>Try changing your filters or search query</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
    </div>
  );
}