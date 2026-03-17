import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

/* ── Floating particle background ── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  emoji: ['🌸', '✨', '🌺', '💕', '🌿', '🎀', '🌷', '💫', '🍃'][i % 9],
  size: 14 + Math.random() * 18,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 8 + Math.random() * 10,
}));

const ARTICLES = [
  { tag: 'Finance', title: 'How to Build a Savings Habit as a Group', date: 'Mar 5, 2026', icon: '💰' },
  { tag: 'Business', title: 'Marketing Your Handmade Products Online', date: 'Mar 2, 2026', icon: '📱' },
  { tag: 'Legal', title: 'Understanding Microfinance Loan Terms', date: 'Feb 28, 2026', icon: '📋' },
];

const DUMMY_PRODUCTS = [
  { _id: 'd1', name: 'Handmade Papads', category: 'Food', price: 150, by: 'Savitri Bachatgat', img: '/food.png' },
  { _id: 'd2', name: 'Cotton Tote Bags', category: 'Crafts', price: 200, by: 'Parvati Samuh', img: '/handicrafts.png' },
  { _id: 'd3', name: 'Natural Pickle Set', category: 'Food', price: 320, by: 'Shakti SHG', img: '/food.png' },
  { _id: 'd4', name: 'Terracotta Diyas', category: 'Home Decor', price: 120, by: 'Kaveri Group', img: '/pottery.png' },
];

const HERO_CARDS = [
  { img: '/pottery.png', label: 'Pottery', sub: '34 items', delay: '0s' },
  { img: '/handicrafts.png', label: 'Handicrafts', sub: '52 items', delay: '0.15s' },
  { img: '/food.png', label: 'Food & Pickles', sub: '28 items', delay: '0.3s' },
  { img: '/beauty.png', label: 'Natural Care', sub: '19 items', delay: '0.45s' },
];

/* animated counter hook */
function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const StatNum = ({ target, suffix = '' }) => {
  const n = useCounter(target);
  return <span>{n}{suffix}</span>;
};

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, eventRes, announcementRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/events'),
          axios.get('/api/announcements')
        ]);
        setProducts(prodRes.data.slice(0, 4));
        setEvents(eventRes.data);
        setAnnouncements(announcementRes.data);
      } catch {
        setProducts(DUMMY_PRODUCTS);
      }
    };
    fetchData();
  }, []);

  const displayProducts = products.length > 0 ? products : DUMMY_PRODUCTS;

  return (
    <>
      {/* ══════ HERO ══════ */}
      <section className="hero-section">

        {/* Floating emoji particles */}
        {PARTICLES.map(p => (
          <span key={p.id} style={{
            position: 'absolute',
            left: `${p.left}%`,
            fontSize: p.size,
            bottom: '-40px',
            opacity: 0,
            animation: `riseParticle ${p.duration}s ${p.delay}s ease-in infinite`,
            pointerEvents: 'none',
            zIndex: 1,
            userSelect: 'none',
          }}>{p.emoji}</span>
        ))}

        <Container style={{ position: 'relative', zIndex: 3 }}>
          <Row className="align-items-center" style={{ minHeight: 540 }}>

            {/* LEFT: TEXT */}
            <Col lg={6} className="py-5 hero-content">
              <div className="hero-tag" style={{ animation: 'fadeSlideUp .6s ease forwards' }}>
                🌸 Self Help Group Platform
              </div>
              <h1 className="hero-title" style={{ animation: 'fadeSlideUp .7s .1s ease both' }}>
                Together We <span className="highlight">Rise,</span><br />
                Together We <span className="highlight">Thrive</span>
              </h1>
              <p className="hero-sub" style={{ animation: 'fadeSlideUp .7s .2s ease both' }}>
                A digital home for Mahila SakhiConnect groups — manage savings, apply for microloans, and sell handcrafted products directly to customers.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, animation: 'fadeSlideUp .7s .3s ease both' }}>
                <button className="btn-primary-cta" onClick={() => navigate('/login')}>
                  Join Our Community
                </button>
                <button className="btn-secondary-cta" onClick={() => navigate('/shop')}>
                  Explore Products ›
                </button>
              </div>

              {/* Animated stats */}
              <div className="hero-stat-row" style={{ animation: 'fadeSlideUp .7s .45s ease both' }}>
                <div>
                  <div className="hero-stat-num"><StatNum target={500} suffix="+" /></div>
                  <div className="hero-stat-label">Active Members</div>
                </div>
                <div className="hero-stat-divider"></div>
                <div>
                  <div className="hero-stat-num">₹<StatNum target={240000} suffix="" />+</div>
                  <div className="hero-stat-label">Savings Managed</div>
                </div>
                <div className="hero-stat-divider"></div>
                <div>
                  <div className="hero-stat-num"><StatNum target={120} suffix="+" /></div>
                  <div className="hero-stat-label">Products Listed</div>
                </div>
              </div>
            </Col>

            {/* RIGHT: Animated image cards + live badge */}
            <Col lg={6} className="d-none d-lg-flex align-items-center justify-content-center py-5">
              <div className="hero-right-panel" style={{ width: '100%', maxWidth: 400, minHeight: 380 }}>
                <div className="spinning-ring"></div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: '100%' }}>
                  {HERO_CARDS.map((c, i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.82)',
                      backdropFilter: 'blur(12px)',
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-md)',
                      cursor: 'pointer',
                      transition: '.25s',
                      animation: `badgePop 0.5s ${c.delay} ease both`,
                    }}
                      onClick={() => navigate('/shop')}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.04)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                    >
                      <img src={c.img} alt={c.label}
                        style={{ width: '100%', height: 90, objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none'; }} />
                      <div style={{ padding: '10px 12px' }}>
                        <div style={{ fontWeight: 700, fontSize: '.82rem', color: 'var(--text-dark)' }}>{c.label}</div>
                        <div style={{ fontSize: '.7rem', color: 'var(--text-muted)' }}>{c.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live badge */}
                <div style={{
                  marginTop: 4,
                  background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)',
                  borderRadius: 'var(--radius)', padding: '12px 18px',
                  border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-md)',
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  animation: 'badgePop 0.6s 0.6s ease both',
                }}>
                  <span style={{ fontSize: '1.5rem' }}>💸</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '.85rem', color: 'var(--text-dark)' }}>Loan Approved!</div>
                    <div style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>Shakti SHG · ₹10,000 disbursed</div>
                  </div>
                  <div style={{ marginLeft: 'auto', background: '#e8f5e9', color: '#2e7d32', fontSize: '.68rem', fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>✓ Live</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ══════ WHY JOIN ══════ */}
      <section style={{ padding: '60px 0', background: '#fff' }}>
        <Container>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: 12 }}>Why Join Bachatgat?</h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Empower your community with transparent savings, affordable loans, and handmade marketplace opportunities.</p>
          </div>
          <Row className="g-4">
            {[
              { icon: '💰', title: 'Group Savings', desc: 'Track deposits & withdrawals for every member with transparent ledgers.', bgColor: '#fce4ec', borderColor: '#f39ab0', accentColor: '#d946a6' },
              { icon: '🤝', title: 'Micro Loans', desc: 'Apply for affordable loans within your group. Quick, simple approvals.', bgColor: '#fce4ec', borderColor: '#f39ab0', accentColor: '#d946a6' },
              { icon: '🛒', title: 'Sell Online', desc: 'List handmade products and reach customers across Maharashtra.', bgColor: '#fce4ec', borderColor: '#f39ab0', accentColor: '#d946a6' },
              { icon: '📊', title: 'Track Progress', desc: 'Role-based dashboards for Admin, Bachatgat, Members & Customers.', bgColor: '#fce4ec', borderColor: '#f39ab0', accentColor: '#d946a6' },
            ].map((f, i) => (
              <Col key={i} xs={12} sm={6} lg={3}>
                <div style={{
                  background: f.bgColor,
                  borderRadius: '12px',
                  padding: '32px 24px',
                  border: `2px solid ${f.borderColor}`,
                  height: '100%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `fadeSlideUp .6s ${i * 0.1}s ease both`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = `0 12px 24px rgba(217, 70, 166, 0.1)`;
                    e.currentTarget.style.borderColor = f.accentColor;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = f.borderColor;
                  }}
                  className="feature-card"
                >
                  <div style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '-40px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: f.borderColor,
                    opacity: 0.1,
                    transition: 'all 0.3s'
                  }} className="card-bg-circle"></div>
                  
                  <div style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '3.5rem',
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '80px',
                      height: '80px',
                      background: 'rgba(255, 255, 255, 0.6)',
                      borderRadius: '12px',
                      transition: 'all 0.3s'
                    }} className="feature-icon">{f.icon}</div>
                    
                    <div style={{
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      color: f.accentColor,
                      marginBottom: 10,
                      transition: 'all 0.3s'
                    }} className="feature-title">{f.title}</div>
                    
                    <div style={{
                      fontSize: '.9rem',
                      color: 'var(--text-muted)',
                      lineHeight: '1.6',
                      flex: 1,
                      transition: 'all 0.3s'
                    }} className="feature-desc">{f.desc}</div>
                    
                    <div style={{
                      marginTop: 16,
                      paddingTop: 16,
                      borderTop: `2px solid ${f.borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s',
                      width: '100%'
                    }}>
                      <span style={{
                        color: f.accentColor,
                        fontWeight: '600',
                        fontSize: '.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }} className="feature-link">
                        Learn More
                        <i className="fas fa-arrow-right" style={{ fontSize: '.75rem', transition: 'all 0.3s' }}></i>
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ══════ ANNOUNCEMENTS ══════ */}
      {announcements.length > 0 && (
        <section style={{ padding: '60px 0', background: 'linear-gradient(135deg, #fff5f8, #fef7f9)' }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div className="section-label">📢 Important Updates</div>
              <h2 className="section-title">Community Announcements</h2>
              <p style={{ fontSize: '.95rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '12px auto 0' }}>
                Stay informed with the latest news and updates from our community
              </p>
            </div>
            <Row className="g-4">
              {announcements.slice(0, 3).map((announcement, idx) => (
                <Col key={announcement._id} md={4}>
                  <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    border: '2px solid #f8bbd0',
                    padding: '28px 24px',
                    transition: 'all 0.3s',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: `fadeSlideUp .5s ${idx * 0.1}s ease both`
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(217, 70, 166, 0.15)';
                      e.currentTarget.style.borderColor = '#d946a6';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                      e.currentTarget.style.borderColor = '#f8bbd0';
                    }}
                  >
                    {/* Decorative corner */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #fce4ec, transparent)',
                      borderRadius: '0 16px 0 100%'
                    }}></div>

                    {/* Icon */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #d946a6, #e91e63)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      marginBottom: 16,
                      position: 'relative',
                      zIndex: 1
                    }}>
                      📢
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontWeight: '700',
                      fontSize: '1.15rem',
                      color: '#3a1a2e',
                      marginBottom: 12,
                      lineHeight: '1.4',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {announcement.title}
                    </h3>

                    {/* Message */}
                    <p style={{
                      fontSize: '.9rem',
                      color: '#5d3a4a',
                      lineHeight: '1.6',
                      marginBottom: 16,
                      flex: 1,
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {announcement.message}
                    </p>

                    {/* Footer */}
                    <div style={{
                      paddingTop: 16,
                      borderTop: '1.5px solid #fce4ec',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '.8rem',
                      color: '#9c7b8a',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <i className="fas fa-user-circle"></i>
                        {announcement.postedBy?.name || 'Admin'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <i className="fas fa-clock"></i>
                        {new Date(announcement.createdAt).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* ══════ FEATURED PRODUCTS ══════ */}
      <section style={{ padding: '60px 0', background: 'var(--cream)' }}>
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <div className="section-label">Handcrafted with Love</div>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link to="/shop" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '.9rem' }}>
              View All ›
            </Link>
          </div>

          <div className="mb-4">
            {['All', 'Food', 'Crafts', 'Textiles', 'Beauty', 'Home Decor'].map(cat => (
              <span key={cat} className={`tag-pill ${cat === 'All' ? 'active' : ''}`}>{cat}</span>
            ))}
          </div>

          <Row className="g-3">
            {displayProducts.map((p, idx) => (
              <Col key={p._id || idx} xs={6} lg={3}>
                <div className="product-card"
                  onClick={() => navigate('/shop')}
                  style={{ animation: `fadeSlideUp .5s ${idx * 0.08}s ease both` }}>
                  <div className="product-card-img">
                    <img
                      src={p.img || p.image_url || '/pottery.png'}
                      alt={p.name}
                      onError={e => { e.target.style.display = 'none'; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span className="product-badge">{p.category || 'Handmade'}</span>
                  </div>
                  <div className="product-card-body">
                    <div className="product-card-category">{p.category || 'Handmade'}</div>
                    <div className="product-card-name">{p.name}</div>
                    <div className="product-card-by">by {p.bachatgat_id?.name || p.by || 'Local Bachatgat'}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                      <span className="product-card-price">₹{p.price}</span>
                      <span style={{ color: 'var(--gold)', fontSize: '.8rem' }}>★★★★☆</span>
                    </div>
                    <button className="btn-add-cart">Add to Cart</button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ══════ EVENTS ══════ */}
      {events.length > 0 && (
        <section style={{ padding: '56px 0', background: 'linear-gradient(135deg,var(--blush-light),var(--cream))' }}>
          <Container>
            <div className="section-label">Don't Miss</div>
            <h2 className="section-title" style={{ marginBottom: 28 }}>Upcoming Events</h2>
            <Row className="g-3">
              {events.map(ev => (
                <Col key={ev._id} md={4}>
                  <div style={{ background: '#fff', borderRadius: 'var(--radius)', border: '1.5px solid var(--border)', padding: 24, transition: '.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--blush)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                    <div style={{ color: 'var(--primary)', fontSize: '.78rem', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                      📅 {new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-dark)', marginBottom: 6 }}>{ev.title}</div>
                    {ev.location && <div style={{ color: 'var(--text-muted)', fontSize: '.83rem' }}>📍 {ev.location}</div>}
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* ══════ ARTICLES ══════ */}
      <section style={{ padding: '60px 0', background: '#fff' }}>
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <div className="section-label">Knowledge Hub</div>
              <h2 className="section-title">Latest Articles</h2>
            </div>
          </div>
          <Row className="g-3">
            {ARTICLES.map((a, i) => (
              <Col key={i} md={4}>
                <div className="article-card" style={{ animation: `fadeSlideUp .5s ${i * 0.1}s ease both` }}>
                  <div className="article-card-thumb">{a.icon}</div>
                  <div className="article-card-body">
                    <div className="article-tag">{a.tag}</div>
                    <div className="article-title-text">{a.title}</div>
                    <div className="article-meta">{a.date}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ══════ FOOTER STRIP ══════ */}
      <div className="footer-strip">
        Made with ❤️ for <span>SakhiConnect</span> · Empowering Women Entrepreneurs across Maharashtra
      </div>

      {/* Particle animation + fade-in keyframes injected via style tag */}
      <style>{`
        @keyframes riseParticle {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Home;
