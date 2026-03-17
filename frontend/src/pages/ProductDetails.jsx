import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const item = { product_id: product._id, name: product.name, image_url: product.image_url, price: product.price, quantity: Number(qty) };
    const idx = cartItems.findIndex(x => x.product_id === item.product_id);
    if (idx >= 0) cartItems[idx] = item; else cartItems.push(item);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    navigate('/cart');
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" style={{ color: 'var(--accent)' }} /></div>;

  const REVIEWS = [
    { author: 'Priya S.', stars: 5, text: 'Beautiful handcraft, great quality! exactly as described.' },
    { author: 'Anjali M.', stars: 4, text: 'Arrived quickly and the packaging was thoughtful.' },
  ];

  return (
    <div className="page-wrapper">
      <Container>
        {/* ── BREADCRUMB ── */}
        <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: 24 }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</span>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/shop')}>Marketplace</span>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: 'var(--text-dark)', fontWeight: 600 }}>{product.name}</span>
        </div>

        <Row className="g-5">
          {/* ── IMAGE COLUMN ── */}
          <Col md={6}>
            <div className="product-detail-img-wrap">
              {product.image_url && !product.image_url.includes('placeholder')
                ? <img src={product.image_url} alt={product.name} />
                : <div style={{ textAlign: 'center' }}>
                    <i className="fas fa-image" style={{ fontSize: '5rem', color: '#d1d5db' }}></i>
                    <p style={{ color: 'var(--text-light)', marginTop: 12, fontSize: '.9rem' }}>Product Image</p>
                  </div>
              }
            </div>
            {/* Thumbnail row placeholder */}
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  width: 70, height: 70, borderRadius: 'var(--radius-sm)',
                  background: '#f3f4f6', border: '2px solid ' + (i === 1 ? 'var(--accent)' : 'var(--border)'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <i className="fas fa-image" style={{ color: '#d1d5db' }}></i>
                </div>
              ))}
            </div>
          </Col>

          {/* ── DETAILS COLUMN ── */}
          <Col md={6}>
            <div className="product-card-category" style={{ marginBottom: 8 }}>{product.category || 'Handmade'}</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: 12, letterSpacing: '-.5px', lineHeight: 1.2 }}>
              {product.name || 'Handmade Terracotta Pot'}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>₹{product.price}</span>
              <div className="star-rating">★★★★☆</div>
              <span style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>(24 reviews)</span>
            </div>

            <div style={{ marginBottom: 20, padding: '12px 16px', background: product.quantity > 0 ? '#f0fdf4' : '#fef2f2', borderRadius: 'var(--radius-sm)', display: 'inline-block' }}>
              <span style={{ fontSize: '.85rem', fontWeight: 600, color: product.quantity > 0 ? '#16a34a' : '#dc2626' }}>
                <i className={`fas fa-${product.quantity > 0 ? 'check-circle' : 'times-circle'} me-2`}></i>
                {product.quantity > 0 ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
              </span>
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 24, fontSize: '.95rem' }}>
              {product.description || 'A beautiful handcrafted product made with care and traditional techniques by skilled women artisans from local Bachatgat groups.'}
            </p>

            {product.quantity > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: 8 }}>Quantity</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', width: 'fit-content' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{ border: 'none', background: 'none', padding: '8px 16px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)' }}>−</button>
                  <span style={{ padding: '8px 20px', fontWeight: 700, borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.quantity, q + 1))}
                    style={{ border: 'none', background: 'none', padding: '8px 16px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)' }}>+</button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <button className="btn-buy-now" disabled={product.quantity === 0}
                onClick={addToCartHandler}>
                <i className="fas fa-bolt me-2"></i>Buy Now
              </button>
              <button className="btn-add-to-cart-detail" disabled={product.quantity === 0}
                onClick={addToCartHandler}>
                <i className="fas fa-cart-plus me-2"></i>Add to Cart
              </button>
            </div>

            {/* Sold By */}
            <div style={{ padding: '16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Sold by</div>
              <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>
                <i className="fas fa-store me-2" style={{ color: 'var(--accent)' }}></i>
                {product.bachatgat_id?.name || 'Local Bachatgat Group'}
              </div>
            </div>
          </Col>
        </Row>

        {/* ── TABS: Description / Reviews ── */}
        <div style={{ marginTop: 60 }}>
          <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--border)', marginBottom: 32 }}>
            {['desc', 'reviews'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  border: 'none', background: 'none', padding: '12px 28px',
                  fontWeight: 700, fontSize: '.92rem', cursor: 'pointer',
                  color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
                  borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
                  marginBottom: '-2px', transition: '.2s'
                }}>
                {tab === 'desc' ? 'Description' : `Reviews (${REVIEWS.length})`}
              </button>
            ))}
          </div>

          {activeTab === 'desc' ? (
            <div style={{ maxWidth: 640, color: 'var(--text-muted)', lineHeight: 1.9 }}>
              <p>{product.description || 'This is a beautifully handcrafted product made by skilled women artisans.'}</p>
              {product.ingredients && <p style={{ marginTop: 16 }}><strong>Ingredients: </strong>{product.ingredients}</p>}
            </div>
          ) : (
            <Row className="g-3">
              {REVIEWS.map((r, i) => (
                <Col key={i} md={6}>
                  <div className="review-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span className="review-author">{r.author}</span>
                      <span className="star-rating" style={{ fontSize: '.85rem' }}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                    </div>
                    <p style={{ fontSize: '.9rem', color: 'var(--text-muted)', margin: 0 }}>{r.text}</p>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ProductDetails;
