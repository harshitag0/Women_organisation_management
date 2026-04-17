import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Food', 'Crafts', 'Textiles', 'Beauty', 'Home Decor'];

const Shop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('=== SHOP PAGE - FETCHING PRODUCTS ===');
        console.log('axios.defaults.baseURL:', axios.defaults.baseURL);
        console.log('Full URL:', axios.defaults.baseURL + '/api/products');
        console.log('Environment:', import.meta.env.MODE);
        console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
        
        const { data } = await axios.get('/api/products');
        console.log('✅ Products fetched successfully:', data.length, 'products');
        console.log('Sample product:', data[0]);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching products:', err.message);
        console.error('Error response:', err.response?.data);
        console.error('Error status:', err.response?.status);
        console.error('Request URL:', err.config?.url);
        console.error('Base URL:', err.config?.baseURL);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPrice = priceRange === 'All'
      || (priceRange === 'under100' && p.price < 100)
      || (priceRange === '100-500' && p.price >= 100 && p.price <= 500)
      || (priceRange === 'above500' && p.price > 500);
    return matchCat && matchSearch && matchPrice;
  });

  return (
    <div className="page-wrapper">
      <Container>
        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: 32 }}>
          <div className="section-label">Browse</div>
          <h1 className="section-title">Marketplace</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>Discover handmade products from Bachatgat groups across Maharashtra.</p>
        </div>

        <Row className="g-4">
          {/* ── FILTERS SIDEBAR ── */}
          <Col lg={3}>
            <div className="filters-sidebar">
              <div style={{ marginBottom: 24 }}>
                <div className="filter-title">🔍 Search</div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', padding: '8px 12px',
                    fontSize: '.9rem', outline: 'none', color: 'var(--text-dark)'
                  }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <div className="filter-title">📦 Category</div>
                {CATEGORIES.map(cat => (
                  <label key={cat} className={`filter-option ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}>
                    <input type="radio" name="category" checked={selectedCategory === cat} readOnly />
                    {cat}
                  </label>
                ))}
              </div>

              <div>
                <div className="filter-title">💰 Price</div>
                {[
                  { label: 'All Prices', value: 'All' },
                  { label: 'Under ₹100', value: 'under100' },
                  { label: '₹100 – ₹500', value: '100-500' },
                  { label: 'Above ₹500', value: 'above500' },
                ].map(p => (
                  <label key={p.value} className={`filter-option ${priceRange === p.value ? 'active' : ''}`}
                    onClick={() => setPriceRange(p.value)}>
                    <input type="radio" name="price" checked={priceRange === p.value} readOnly />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>
          </Col>

          {/* ── PRODUCT GRID ── */}
          <Col lg={9}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>
                {loading ? 'Loading...' : `${filtered.length} products found`}
              </span>
              <select style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '.88rem', color: 'var(--text-dark)', outline: 'none' }}>
                <option>Sort: Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-5"><Spinner animation="border" style={{ color: 'var(--accent)' }} /></div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-box-open"></i>
                <h5>No Products Found</h5>
                <p>Try changing your filters or search term.</p>
              </div>
            ) : (
              <Row className="g-3">
                {filtered.map(p => (
                  <Col key={p._id} xs={6} xl={4}>
                    <div className="product-card" onClick={() => navigate(`/product/${p._id}`)}>
                      <div className="product-card-img">
                        {p.image_url && !p.image_url.includes('placeholder')
                          ? <img src={p.image_url} alt={p.name} />
                          : <i className="fas fa-image placeholder-icon"></i>
                        }
                        <span className="product-badge">{p.category || 'Handmade'}</span>
                      </div>
                      <div className="product-card-body">
                        <div className="product-card-name">{p.name}</div>
                        <div className="product-card-by">
                          <i className="fas fa-store me-1" style={{ color: 'var(--accent)', fontSize: '.7rem' }}></i>
                          {p.bachatgat_id?.name || 'Local Bachatgat'}
                        </div>
                        <div className="d-flex justify-content-between align-items-center" style={{ marginTop: 8 }}>
                          <span className="product-card-price">₹{p.price}</span>
                          <div className="star-rating" style={{ fontSize: '.75rem' }}>★★★★☆</div>
                        </div>
                        <button className="btn-add-cart" onClick={e => { e.stopPropagation(); navigate(`/product/${p._id}`); }}>
                          <i className="fas fa-cart-plus me-2"></i>Add to Cart
                        </button>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Shop;
