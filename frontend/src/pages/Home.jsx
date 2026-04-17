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

/* Category cards — UI-only, navigate to /shop */
const HERO_CARDS = [
  { img: '/pottery.png',     label: 'Pottery',       delay: '0s' },
  { img: '/handicrafts.png', label: 'Handicrafts',   delay: '0.15s' },
  { img: '/food.png',        label: 'Food & Pickles', delay: '0.3s' },
  { img: '/beauty.png',      label: 'Natural Care',  delay: '0.45s' },
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
  const [stats, setStats] = useState({ totalMembers: 0, totalProducts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('=== HOME PAGE - FETCHING DATA ===');
        console.log('axios.defaults.baseURL:', axios.defaults.baseURL);
        console.log('Environment:', import.meta.env.MODE);
        console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
        
        const [prodRes, eventRes, announcementRes, statsRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/events'),
          axios.get('/api/announcements'),
          axios.get('/api/stats'),
        ]);
        
        console.log('✅ Products:', prodRes.data.length);
        console.log('✅ Events:', eventRes.data.length);
        console.log('✅ Announcements:', announcementRes.data.length);
        console.log('✅ Stats:', statsRes.data);
        
        setProducts(prodRes.data.slice(0, 4));
        setEvents(eventRes.data);
        setAnnouncements(announcementRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('❌ Error fetching home data:', err.message);
        console.error('Error details:', err.response?.data);
        // leave empty — show empty states
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
                🌸 Krantijyoti Mahila Gat — Nagpur
              </div>
              <h1 className="hero-title" style={{ animation: 'fadeSlideUp .7s .1s ease both' }}>
                Together We <span className="highlight">Rise,</span><br />
                Together We <span className="highlight">Thrive</span>
              </h1>
              <p className="hero-sub" style={{ animation: 'fadeSlideUp .7s .2s ease both' }}>
                A digital platform for Krantijyoti Mahila Gat — manage savings, apply for microloans, and sell handcrafted products directly to customers across Maharashtra.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, animation: 'fadeSlideUp .7s .3s ease both' }}>
                <button className="btn-primary-cta" onClick={() => navigate('/login')}>
                  Join Our Community
                </button>
                <button className="btn-secondary-cta" onClick={() => navigate('/shop')}>
                  Explore Products ›
                </button>
              </div>

              {/* Live stats from /api/stats */}
              <div className="hero-stat-row" style={{ animation: 'fadeSlideUp .7s .45s ease both' }}>
                <div>
                  <div className="hero-stat-num">
                    {loading ? '...' : <StatNum target={stats.totalMembers} suffix="+" />}
                  </div>
                  <div className="hero-stat-label">Active Members</div>
                </div>
                <div className="hero-stat-divider"></div>
                <div>
                  <div className="hero-stat-num">
                    {loading ? '...' : <StatNum target={stats.totalProducts} suffix="+" />}
                  </div>
                  <div className="hero-stat-label">Products Listed</div>
                </div>
                <div className="hero-stat-divider"></div>
                <div>
                  <div className="hero-stat-num">
                    {loading ? '...' : <StatNum target={announcements.length} suffix="+" />}
                  </div>
                  <div className="hero-stat-label">Announcements</div>
                </div>
              </div>
            </Col>

            {/* RIGHT: Animated image cards */}
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
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live badge — shows real latest member count */}
                <div style={{
                  marginTop: 4,
                  background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)',
                  borderRadius: 'var(--radius)', padding: '12px 18px',
                  border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-md)',
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  animation: 'badgePop 0.6s 0.6s ease both',
                }}>
                  <span style={{ fontSize: '1.5rem' }}>🌟</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '.85rem', color: 'var(--text-dark)' }}>Krantijyoti Mahila Gat</div>
                    <div style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>
                      {loading ? 'Loading...' : `${stats.totalMembers} members · ${stats.totalProducts} products`}
                    </div>
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
            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: 12 }}>Why Join Krantijyoti Mahila Gat?</h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Empower your community with transparent savings, affordable loans, and a handmade marketplace.</p>
          </div>
          <Row className="g-4">
            {[
              { icon: '💰', title: 'Group Savings', desc: 'Track deposits & withdrawals for every member with transparent ledgers.', bgColor: '#fce4ec', borderColor: '#f39ab0', accentColor: '#d946a6' },
              { icon: '🤝', title: 'Micro Loans',   desc: 'Apply for affordable loans within your group. Quick, simple approvals.',  bgColor: '#fce4ec', borderColor: '#f39ab0', accentColor: '#d946a6' },
              { icon: '🛒', title: 'Sell Online',   desc: 'List handmade products and reach customers across Maharashtra.',            bgColor: '#fce4ec', borderColor: '#f39ab0', accentColor: '#d946a6' },
              { icon: '📊', title: 'Track Progress',desc: 'Role-based dashboards for Admin, Bachatgat, Members & Customers.',          bgColor: '#fce4ec', borderColor: '#f39ab0', accentColor: '#d946a6' },
            ].map((f, i) => (
              <Col key={i} xs={12} sm={6} lg={3}>
                <div style={{
                  background: f.bgColor, borderRadius: '12px', padding: '32px 24px',
                  border: `2px solid ${f.borderColor}`, height: '100%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `fadeSlideUp .6s ${i * 0.1}s ease both`,
                  cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  position: 'relative', overflow: 'hidden'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.borderColor = f.accentColor; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = f.borderColor; }}
                  className="feature-card"
                >
                  <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', borderRadius: '50%', background: f.borderColor, opacity: 0.1 }} />
                  <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', background: 'rgba(255,255,255,0.6)', borderRadius: '12px' }} className="feature-icon">{f.icon}</div>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: f.accentColor, marginBottom: 10 }} className="feature-title">{f.title}</div>
                    <div style={{ fontSize: '.9rem', color: 'var(--text-muted)', lineHeight: '1.6', flex: 1 }} className="feature-desc">{f.desc}</div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ══════ ANNOUNCEMENTS (dynamic — only shown if any exist) ══════ */}
      {announcements.length > 0 && (
        <section style={{ padding: '60px 0', background: 'linear-gradient(135deg, #fff5f8, #fef7f9)' }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div className="section-label">📢 Important Updates</div>
              <h2 className="section-title">Community Announcements</h2>
              <p style={{ fontSize: '.95rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '12px auto 0' }}>
                Stay informed with the latest news from Krantijyoti Mahila Gat
              </p>
            </div>
            <Row className="g-4">
              {announcements.slice(0, 3).map((announcement, idx) => (
                <Col key={announcement._id} md={4}>
                  <div style={{
                    background: '#fff', borderRadius: '16px', border: '2px solid #f8bbd0',
                    padding: '28px 24px', transition: 'all 0.3s', height: '100%',
                    display: 'flex', flexDirection: 'column', position: 'relative',
                    overflow: 'hidden', animation: `fadeSlideUp .5s ${idx * 0.1}s ease both`
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = '#d946a6'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#f8bbd0'; }}
                  >
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '60px', height: '60px', background: 'linear-gradient(135deg, #fce4ec, transparent)', borderRadius: '0 16px 0 100%' }} />
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #d946a6, #e91e63)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: 16, position: 'relative', zIndex: 1 }}>📢</div>
                    <h3 style={{ fontWeight: '700', fontSize: '1.15rem', color: '#3a1a2e', marginBottom: 12, lineHeight: '1.4', position: 'relative', zIndex: 1 }}>{announcement.title}</h3>
                    <p style={{ fontSize: '.9rem', color: '#5d3a4a', lineHeight: '1.6', marginBottom: 16, flex: 1, position: 'relative', zIndex: 1 }}>{announcement.message}</p>
                    <div style={{ paddingTop: 16, borderTop: '1.5px solid #fce4ec', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '.8rem', color: '#9c7b8a', position: 'relative', zIndex: 1 }}>
                      <span>{announcement.postedBy?.name || 'Admin'}</span>
                      <span>{new Date(announcement.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* ══════ FEATURED PRODUCTS (dynamic — from DB) ══════ */}
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

          {!loading && products.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '48px 24px',
              background: '#fff', borderRadius: 16, border: '2px dashed #f8bbd0',
              color: '#9c7b8a', fontSize: '1rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🛍️</div>
              <div style={{ fontWeight: 700, marginBottom: 6, color: '#3a1a2e' }}>No products yet</div>
              <div>Products added by Bachatgat members will appear here.</div>
              <button
                onClick={() => navigate('/login')}
                style={{ marginTop: 16, background: 'linear-gradient(135deg,#c2185b,#e91e63)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                Login to Add Products
              </button>
            </div>
          ) : (
            <Row className="g-3">
              {products.map((p, idx) => (
                <Col key={p._id || idx} xs={6} lg={3}>
                  <div className="product-card"
                    onClick={() => navigate('/shop')}
                    style={{ animation: `fadeSlideUp .5s ${idx * 0.08}s ease both` }}>
                    <div className="product-card-img">
                      <img
                        src={p.image_url || p.img || '/pottery.png'}
                        alt={p.name}
                        onError={e => { e.target.style.display = 'none'; }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span className="product-badge">{p.category || 'Handmade'}</span>
                    </div>
                    <div className="product-card-body">
                      <div className="product-card-category">{p.category || 'Handmade'}</div>
                      <div className="product-card-name">{p.name}</div>
                      <div className="product-card-by">by {p.bachatgat_id?.name || 'Local Bachatgat'}</div>
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
          )}
        </Container>
      </section>

      {/* ══════ EVENTS (dynamic — only shown if any exist) ══════ */}
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
                    {ev.description && <div style={{ color: 'var(--text-muted)', fontSize: '.82rem', marginTop: 8, lineHeight: 1.5 }}>{ev.description}</div>}
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* ══════ FOOTER STRIP ══════ */}
      <div className="footer-strip">
        Made with ❤️ for <span>Krantijyoti Mahila Gat</span> · Empowering Women of Nagpur
      </div>

      {/* Keyframes */}
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
