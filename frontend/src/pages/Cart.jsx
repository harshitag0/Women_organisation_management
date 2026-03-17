import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [placing, setPlacing] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);
    if (userInfo) setAddress(userInfo.address || '');
  }, [userInfo]);

  const updateQty = (id, delta) => {
    const updated = cartItems.map(x =>
      x.product_id === id ? { ...x, quantity: Math.max(1, x.quantity + delta) } : x
    );
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(x => x.product_id !== id);
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce((acc, x) => acc + x.quantity * x.price, 0);
  const totalItems = cartItems.reduce((acc, x) => acc + x.quantity, 0);

  const checkoutHandler = async () => {
    if (!userInfo) { navigate('/login'); return; }
    if (userInfo.role !== 'Customer') { setMsg({ type: 'err', text: 'Only customers can place an order.' }); return; }
    if (!address || !city) { setMsg({ type: 'err', text: 'Please enter shipping address and city.' }); return; }

    setPlacing(true); setMsg({ type: '', text: '' });
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('/api/orders', {
        items: cartItems.map(x => ({ product_id: x.product_id, quantity: x.quantity, price: x.price })),
        shipping_address: address, city, total_amount: subtotal,
      }, config);
      localStorage.removeItem('cartItems');
      setCartItems([]);
      setMsg({ type: 'ok', text: 'Order placed successfully! Redirecting to your dashboard…' });
      setTimeout(() => navigate('/customer'), 2000);
    } catch (err) {
      setMsg({ type: 'err', text: err.response?.data?.message || 'Something went wrong. Please try again.' });
    }
    setPlacing(false);
  };

  return (
    <div style={s.page}>
      <Container>
        {/* Header */}
        <div style={s.pageHeader}>
          <div style={s.breadcrumb}>
            <span style={s.breadLink} onClick={() => navigate('/')}>Home</span>
            <span style={s.breadSep}>›</span>
            <span style={s.breadLink} onClick={() => navigate('/shop')}>Marketplace</span>
            <span style={s.breadSep}>›</span>
            <span style={{ color: '#2d0f22', fontWeight: 600 }}>Shopping Cart</span>
          </div>
          <h1 style={s.pageTitle}>Shopping Cart</h1>
          <p style={s.pageSub}>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <div style={s.emptyState}>
            <i className="fas fa-shopping-cart" style={s.emptyIcon}></i>
            <h3 style={s.emptyTitle}>Your cart is empty</h3>
            <p style={s.emptySub}>Browse our marketplace to discover handmade products from local Bachatgat groups.</p>
            <button style={s.shopBtn} onClick={() => navigate('/shop')}>Browse Marketplace</button>
          </div>
        ) : (
          <Row className="g-4">
            {/* ── CART ITEMS ── */}
            <Col lg={8}>
              <div style={s.card}>
                {/* Column headers */}
                <div style={s.colHeaders}>
                  <span style={{ flex: 3 }}>Product</span>
                  <span style={{ flex: 1, textAlign: 'center' }}>Price</span>
                  <span style={{ flex: 1, textAlign: 'center' }}>Qty</span>
                  <span style={{ flex: 1, textAlign: 'center' }}>Total</span>
                  <span style={{ width: 36 }}></span>
                </div>

                {cartItems.map((item, idx) => (
                  <div key={item.product_id} style={{ ...s.cartRow, borderTop: idx === 0 ? 'none' : '1px solid #f5e0e8' }}>
                    {/* Image */}
                    <div style={s.imgWrap}>
                      {item.image_url
                        ? <img src={item.image_url} alt={item.name} style={s.img} />
                        : <div style={s.imgPlaceholder}><i className="fas fa-image" style={{ color: '#d1afc0' }}></i></div>
                      }
                    </div>

                    {/* Name + category */}
                    <div style={{ flex: 2 }}>
                      <Link to={`/product/${item.product_id}`} style={s.itemName}>{item.name}</Link>
                      {item.category && <div style={s.itemCat}>{item.category}</div>}
                    </div>

                    {/* Price */}
                    <div style={s.cell}>₹{item.price}</div>

                    {/* Qty stepper */}
                    <div style={{ ...s.cell, display: 'flex', justifyContent: 'center' }}>
                      <div style={s.stepper}>
                        <button style={s.stepBtn} onClick={() => updateQty(item.product_id, -1)}>−</button>
                        <span style={s.stepNum}>{item.quantity}</span>
                        <button style={s.stepBtn} onClick={() => updateQty(item.product_id, +1)}>+</button>
                      </div>
                    </div>

                    {/* Line total */}
                    <div style={{ ...s.cell, fontWeight: 700, color: '#c2185b' }}>₹{(item.quantity * item.price).toFixed(0)}</div>

                    {/* Remove */}
                    <button style={s.removeBtn} onClick={() => removeItem(item.product_id)} title="Remove">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}

                {/* Continue shopping */}
                <div style={{ padding: '16px 20px' }}>
                  <button style={s.continueBtn} onClick={() => navigate('/shop')}>
                    <i className="fas fa-arrow-left me-2"></i> Continue Shopping
                  </button>
                </div>
              </div>
            </Col>

            {/* ── ORDER SUMMARY ── */}
            <Col lg={4}>
              <div style={s.summaryCard}>
                <h3 style={s.summaryTitle}>Order Summary</h3>

                <div style={s.summaryRow}>
                  <span style={s.summaryLabel}>Subtotal ({totalItems} items)</span>
                  <span style={s.summaryVal}>₹{subtotal.toFixed(0)}</span>
                </div>
                <div style={s.summaryRow}>
                  <span style={s.summaryLabel}>Shipping</span>
                  <span style={{ ...s.summaryVal, color: '#16a34a', fontWeight: 600 }}>Free</span>
                </div>
                <div style={s.divider} />
                <div style={{ ...s.summaryRow, marginBottom: 24 }}>
                  <span style={{ fontWeight: 800, color: '#2d0f22', fontSize: '1rem' }}>Total</span>
                  <span style={{ fontWeight: 800, color: '#c2185b', fontSize: '1.2rem' }}>₹{subtotal.toFixed(0)}</span>
                </div>

                {/* Shipping form */}
                <div style={s.formGroup}>
                  <label style={s.label}>Shipping Address</label>
                  <input style={s.input} placeholder="House no, Street, Area"
                    value={address} onChange={e => setAddress(e.target.value)} />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>City</label>
                  <input style={s.input} placeholder="City"
                    value={city} onChange={e => setCity(e.target.value)} />
                </div>

                {msg.text && (
                  <div style={msg.type === 'ok' ? s.okBox : s.errBox}>{msg.text}</div>
                )}

                <button
                  style={{ ...s.checkoutBtn, opacity: (placing || !address || !city) ? 0.7 : 1 }}
                  disabled={placing || !address || !city}
                  onClick={checkoutHandler}
                  onMouseEnter={e => { if (!placing) e.currentTarget.style.background = 'linear-gradient(135deg,#880e4f,#ad1457)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#c2185b,#d81b60)'; }}
                >
                  {placing ? 'Placing Order…' : 'Proceed to Checkout'}
                </button>

                <div style={s.secureBadge}>
                  <i className="fas fa-lock me-2" style={{ color: '#9c7b8a' }}></i>
                  <span>Secure checkout</span>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Container>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        input:focus { outline: none; border-color: #c2185b !important; box-shadow: 0 0 0 3px rgba(194,24,91,0.08); }
      `}</style>
    </div>
  );
};

const s = {
  page: {
    fontFamily: "'Inter', sans-serif",
    background: '#fdf6f9',
    minHeight: '100vh',
    paddingBottom: 60,
  },

  pageHeader: { paddingTop: 36, marginBottom: 32 },
  breadcrumb: { fontSize: '.83rem', color: '#9c7b8a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 },
  breadLink: { cursor: 'pointer', color: '#9c7b8a' },
  breadSep: { color: '#c8a0b8' },
  pageTitle: { fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 800, color: '#2d0f22', margin: '0 0 4px' },
  pageSub: { color: '#9c7b8a', fontSize: '.9rem', margin: 0 },

  emptyState: { textAlign: 'center', padding: '80px 20px' },
  emptyIcon: { fontSize: '3.5rem', color: '#e8b4c8', marginBottom: 20 },
  emptyTitle: { fontFamily: "'Playfair Display', serif", color: '#2d0f22', fontWeight: 700, marginBottom: 10 },
  emptySub: { color: '#9c7b8a', fontSize: '.95rem', maxWidth: 400, margin: '0 auto 24px' },
  shopBtn: {
    background: 'linear-gradient(135deg,#c2185b,#d81b60)', color: '#fff',
    border: 'none', borderRadius: 10, padding: '12px 28px',
    fontWeight: 700, fontSize: '.95rem', cursor: 'pointer',
  },

  card: {
    background: '#fff', borderRadius: 16,
    boxShadow: '0 2px 16px rgba(194,24,91,0.07)',
    border: '1px solid #f5e0e8', overflow: 'hidden',
  },
  colHeaders: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '14px 20px',
    background: '#fdf0f5',
    fontSize: '.75rem', fontWeight: 700, color: '#9c7b8a',
    textTransform: 'uppercase', letterSpacing: '.5px',
  },
  cartRow: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '16px 20px',
  },

  imgWrap: { width: 72, height: 72, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1px solid #f5e0e8' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  imgPlaceholder: {
    width: '100%', height: '100%', background: '#fdf0f5',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
  },

  itemName: { color: '#2d0f22', fontWeight: 600, fontSize: '.92rem', textDecoration: 'none', display: 'block' },
  itemCat: { fontSize: '.75rem', color: '#c2185b', fontWeight: 500, marginTop: 3 },
  cell: { flex: 1, textAlign: 'center', fontSize: '.9rem', color: '#5a3a4e' },

  stepper: {
    display: 'flex', alignItems: 'center',
    border: '1.5px solid #e8d0da', borderRadius: 8, overflow: 'hidden',
  },
  stepBtn: {
    border: 'none', background: '#fdf0f5', padding: '6px 12px',
    cursor: 'pointer', fontWeight: 700, fontSize: '1rem', color: '#c2185b',
  },
  stepNum: { padding: '6px 14px', fontWeight: 700, fontSize: '.9rem', color: '#2d0f22', borderLeft: '1px solid #e8d0da', borderRight: '1px solid #e8d0da' },

  removeBtn: {
    width: 32, height: 32, borderRadius: 8,
    border: '1.5px solid #f8d7e3', background: '#fff5f7',
    color: '#c2185b', cursor: 'pointer', fontSize: '.85rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  continueBtn: {
    background: 'none', border: 'none', color: '#c2185b',
    fontWeight: 600, fontSize: '.85rem', cursor: 'pointer', padding: 0,
    fontFamily: "'Inter', sans-serif",
  },

  summaryCard: {
    background: '#fff', borderRadius: 16,
    boxShadow: '0 2px 16px rgba(194,24,91,0.07)',
    border: '1px solid #f5e0e8', padding: '28px 24px',
    position: 'sticky', top: 20,
  },
  summaryTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.2rem', fontWeight: 800, color: '#2d0f22', marginBottom: 20,
  },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryLabel: { color: '#7a4a60', fontSize: '.9rem' },
  summaryVal: { color: '#2d0f22', fontWeight: 600, fontSize: '.95rem' },
  divider: { height: 1, background: '#f5e0e8', margin: '16px 0' },

  formGroup: { marginBottom: 14 },
  label: { display: 'block', fontSize: '.77rem', fontWeight: 600, color: '#5a3a4e', marginBottom: 5, letterSpacing: '.3px' },
  input: {
    width: '100%', border: '1.5px solid #e8d0da', borderRadius: 10,
    padding: '10px 14px', fontSize: '.88rem', color: '#2d0f22',
    fontFamily: "'Inter', sans-serif", transition: 'border-color .18s, box-shadow .18s',
    background: '#fff', boxSizing: 'border-box',
  },

  okBox: { background: '#f0faf2', border: '1px solid #c8e6c9', color: '#2e7d32', borderRadius: 8, padding: '10px 14px', fontSize: '.83rem', marginBottom: 14 },
  errBox: { background: '#fff5f7', border: '1px solid #f8bbd0', color: '#880e4f', borderRadius: 8, padding: '10px 14px', fontSize: '.83rem', marginBottom: 14 },

  checkoutBtn: {
    width: '100%', background: 'linear-gradient(135deg,#c2185b,#d81b60)',
    color: '#fff', border: 'none', borderRadius: 10, padding: '13px 0',
    fontWeight: 700, fontSize: '.95rem', cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(194,24,91,0.25)', transition: 'all .2s',
    fontFamily: "'Inter', sans-serif", marginBottom: 12,
  },
  secureBadge: { textAlign: 'center', fontSize: '.78rem', color: '#9c7b8a' },
};

export default Cart;
