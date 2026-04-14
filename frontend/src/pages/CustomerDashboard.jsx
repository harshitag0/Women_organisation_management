import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/* ─── Navigation ─── */
const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'myOrders',  label: 'My Orders'  },
  { key: 'shop',      label: 'Shop'       },
  { key: 'profile',   label: 'My Profile' },
];

/* ─── Helpers ─── */
const getEstimatedDelivery = (createdAt, status) => {
  const created = new Date(createdAt);
  const daysMap = { Pending: 7, Processing: 5, Shipped: 2, Delivered: 0, Cancelled: null };
  const days = daysMap[status];
  if (days === null) return '—';
  if (days === 0)    return 'Delivered';
  const eta = new Date(created);
  eta.setDate(eta.getDate() + days);
  return eta.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getTrackStep = (status) =>
  ({ Pending: 0, Processing: 1, Shipped: 2, Delivered: 3 })[status] ?? 0;

const TRACK_LABELS = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

/* ═══════════════════════════════════════════════ */
const CustomerDashboard = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeNav,     setActiveNav]     = useState('dashboard');
  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [orders,        setOrders]        = useState([]);
  const [products,      setProducts]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [profileMsg,    setProfileMsg]    = useState('');
  const [profileData,   setProfileData]   = useState({
    name:       userInfo?.name       || '',
    email:      userInfo?.email      || '',
    contact_no: userInfo?.contact_no || '',
    address:    userInfo?.address    || '',
  });
  const [orderStats, setOrderStats] = useState({
    total: 0, pending: 0, processing: 0, shipped: 0, delivered: 0,
  });

  useEffect(() => { fetchData(); }, [userInfo]);

  const fetchData = async () => {
    if (!userInfo) return;
    try {
      const cfg = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const [ordRes, prodRes] = await Promise.all([
        axios.get('/api/orders/myorders', cfg).catch(() => ({ data: [] })),
        axios.get('/api/products', cfg).catch(() => ({ data: [] })),
      ]);
      const od = ordRes.data;
      setOrders(od);
      setProducts(prodRes.data.slice(0, 6));
      setOrderStats({
        total:      od.length,
        pending:    od.filter(o => o.status === 'Pending').length,
        processing: od.filter(o => o.status === 'Processing').length,
        shipped:    od.filter(o => o.status === 'Shipped').length,
        delivered:  od.filter(o => o.status === 'Delivered').length,
      });
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  /* ─── Design tokens — clean light neutrals, no blue ─── */
  const c = {
    bg:       '#f5f5f5',
    surface:  '#ffffff',
    border:   '#e4e4e7',
    text:     '#18181b',
    sub:      '#71717a',
    faint:    '#a1a1aa',
    accent:   '#18181b',   // near-black accent — no blue
    hover:    '#fafafa',
    badgeMap: {
      Pending:    { bg: '#fef3c7', c: '#92400e' },
      Processing: { bg: '#ede9fe', c: '#4c1d95' },
      Shipped:    { bg: '#d1fae5', c: '#065f46' },
      Delivered:  { bg: '#d1fae5', c: '#065f46' },
      Cancelled:  { bg: '#fee2e2', c: '#991b1b' },
      Completed:  { bg: '#d1fae5', c: '#065f46' },
      Failed:     { bg: '#fee2e2', c: '#991b1b' },
    },
  };

  /* ─── Style objects ─── */
  const S = {
    shell: {
      display: 'flex', minHeight: '100vh',
      background: c.bg,
      fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
      fontSize: 13.5, color: c.text,
    },

    /* --- Sidebar --- */
    sidebar: {
      width: sidebarOpen ? 210 : 52,
      background: c.surface,
      borderRight: `1px solid ${c.border}`,
      display: 'flex', flexDirection: 'column',
      transition: 'width .22s ease', overflow: 'hidden',
      flexShrink: 0, position: 'sticky', top: 0, height: '100vh',
    },
    sideHeader: {
      height: 52, display: 'flex', alignItems: 'center',
      padding: '0 16px', borderBottom: `1px solid ${c.border}`,
      overflow: 'hidden', flexShrink: 0,
    },
    brandText: {
      fontWeight: 700, fontSize: 14.5, color: c.text,
      letterSpacing: -.3, whiteSpace: 'nowrap',
    },
    divider: { height: 1, background: c.border, margin: '6px 0' },
    navSection: { flex: 1, padding: '10px 6px', overflowY: 'auto' },
    navItem: (active) => ({
      display: 'block', width: '100%', textAlign: 'left',
      padding: '9px 12px', borderRadius: 7, cursor: 'pointer', marginBottom: 1,
      background: active ? c.bg : 'transparent',
      color: active ? c.text : c.sub,
      fontWeight: active ? 600 : 400, fontSize: 13,
      border: 'none', transition: 'all .15s',
      borderLeft: active ? `2px solid ${c.accent}` : '2px solid transparent',
      whiteSpace: 'nowrap', overflow: 'hidden',
    }),
    navFooter: {
      padding: '8px 6px 18px', borderTop: `1px solid ${c.border}`,
    },

    /* --- Topbar --- */
    main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
    topbar: {
      height: 52, background: c.surface,
      borderBottom: `1px solid ${c.border}`,
      padding: '0 24px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
    },
    topLeft: { display: 'flex', alignItems: 'center', gap: 10 },
    collapseBtn: {
      background: 'none', border: `1px solid ${c.border}`,
      borderRadius: 6, padding: '4px 8px',
      cursor: 'pointer', color: c.sub, fontSize: 12, lineHeight: 1,
    },
    searchBar: {
      display: 'flex', alignItems: 'center', gap: 8,
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 7, padding: '6px 14px', width: 240,
    },
    searchIcon: { color: c.faint, fontSize: 12, userSelect: 'none' },
    searchInput: {
      border: 'none', background: 'transparent', outline: 'none',
      fontSize: 13, color: c.text, width: '100%', fontFamily: 'inherit',
    },
    topRight: { display: 'flex', alignItems: 'center', gap: 10 },
    avatarCircle: {
      width: 32, height: 32, borderRadius: '50%',
      background: c.accent, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: 12.5, cursor: 'pointer', border: 'none',
      flexShrink: 0,
    },
    userName: { fontSize: 13, fontWeight: 500, color: c.text },

    /* --- Page content --- */
    content: { padding: '28px 30px 60px', flex: 1, overflowY: 'auto' },
    pageHeading: { fontWeight: 700, fontSize: 21, color: c.text, marginBottom: 2 },
    pageCrumb: { fontSize: 12.5, color: c.sub, marginBottom: 26, lineHeight: 1.6 },

    /* --- Stat cards --- */
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))',
      gap: 14, marginBottom: 26,
    },
    statCard: (idx) => ({
      background: c.surface, borderRadius: 10,
      border: `1px solid ${c.border}`,
      padding: '18px 20px 16px',
      borderTop: `3px solid ${['#18181b','#ca8a04','#52525b','#16a34a'][idx] || c.border}`,
    }),
    statNum: {
      fontSize: 30, fontWeight: 700, color: c.text,
      lineHeight: 1, marginBottom: 4,
    },
    statLabel: {
      fontSize: 10.5, color: c.sub, fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: .8,
    },
    statSub: { fontSize: 10.5, color: c.faint, marginTop: 3 },

    /* --- Cards --- */
    card: {
      background: c.surface, borderRadius: 10,
      border: `1px solid ${c.border}`,
      overflow: 'hidden', marginBottom: 20,
    },
    cardHeader: {
      padding: '14px 20px',
      borderBottom: `1px solid ${c.border}`,
      fontWeight: 600, fontSize: 13.5, color: c.text,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    cardBody: { padding: '20px 20px' },

    /* --- Table --- */
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
      padding: '9px 14px', textAlign: 'left',
      fontSize: 10, fontWeight: 700, color: c.faint,
      textTransform: 'uppercase', letterSpacing: .8,
      borderBottom: `1px solid ${c.border}`,
    },
    td: {
      padding: '12px 14px', fontSize: 13, color: c.text,
      borderBottom: `1px solid ${c.border}`,
    },

    badge: (status) => {
      const m = c.badgeMap[status] || { bg: '#f4f4f5', c: '#71717a' };
      return {
        display: 'inline-block', padding: '3px 10px',
        borderRadius: 99, fontSize: 11, fontWeight: 600,
        background: m.bg, color: m.c,
      };
    },

    /* --- Buttons --- */
    btn: {
      background: c.accent, color: '#fff', border: 'none', borderRadius: 7,
      padding: '8px 18px', fontWeight: 600, fontSize: 12.5, cursor: 'pointer',
    },
    btnOutline: {
      background: 'transparent', color: c.text,
      border: `1px solid ${c.border}`, borderRadius: 7,
      padding: '7px 14px', fontWeight: 600, fontSize: 12, cursor: 'pointer',
    },
    btnSmall: {
      background: 'transparent', color: c.sub,
      border: `1px solid ${c.border}`, borderRadius: 6,
      padding: '5px 12px', fontWeight: 500, fontSize: 11, cursor: 'pointer',
    },

    /* --- Form --- */
    input: {
      width: '100%', padding: '9px 12px', boxSizing: 'border-box',
      border: `1px solid ${c.border}`, borderRadius: 7,
      fontSize: 13, color: c.text, outline: 'none',
      background: c.bg, fontFamily: 'inherit',
    },
    label: {
      fontSize: 11, fontWeight: 600, color: c.sub,
      marginBottom: 5, display: 'block',
      textTransform: 'uppercase', letterSpacing: .6,
    },
    formRow2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
    alert: (t) => ({
      padding: '10px 14px', borderRadius: 7, fontSize: 12.5, marginBottom: 12,
      background: t === 'success' ? '#f0fdf4' : '#fef2f2',
      color:      t === 'success' ? '#166534'  : '#991b1b',
      border: `1px solid ${t === 'success' ? '#bbf7d0' : '#fecaca'}`,
    }),
  };

  /* ───────────────────────────────────────────
     SECTION: Dashboard
  ─────────────────────────────────────────── */
  const renderDashboard = () => {
    const cards = [
      { label: 'Total Orders', value: orderStats.total,     sub: 'All time'           },
      { label: 'Pending',      value: orderStats.pending,   sub: 'Awaiting dispatch'  },
      { label: 'Shipped',      value: orderStats.shipped,   sub: 'In transit'         },
      { label: 'Delivered',    value: orderStats.delivered, sub: 'Successfully received' },
    ];
    return (
      <>
        {/* Stat cards */}
        <div style={S.statsGrid}>
          {cards.map((s, i) => (
            <div key={i} style={S.statCard(i)}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={S.statLabel}>{s.label}</div>
              <div style={S.statNum}>{s.value}</div>
              <div style={S.statSub}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            Recent Orders
            <button style={S.btnOutline} onClick={() => setActiveNav('myOrders')}>View All</button>
          </div>
          {loading ? (
            <div style={{ padding: 28, textAlign: 'center', color: c.sub }}>Loading…</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: 52, textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: c.text, marginBottom: 6 }}>No orders yet</div>
              <div style={{ color: c.sub, fontSize: 12.5, marginBottom: 18 }}>Browse our products and place your first order.</div>
              <button style={S.btn} onClick={() => navigate('/shop')}>Browse Shop</button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={S.table}>
                <thead>
                  <tr>{['Order ID','Items','Amount','Status','Est. Delivery','Date'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => (
                    <tr key={order._id} style={{ cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = c.hover}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      onClick={() => { setSelectedOrder(order); setActiveNav('myOrders'); }}
                    >
                      <td style={{ ...S.td, fontWeight: 600, fontFamily: 'monospace', fontSize: 12 }}>#{order._id?.slice(-8).toUpperCase()}</td>
                      <td style={S.td}>{order.items?.length || 0}</td>
                      <td style={{ ...S.td, fontWeight: 600 }}>₹{order.total_amount}</td>
                      <td style={S.td}><span style={S.badge(order.status)}>{order.status}</span></td>
                      <td style={{ ...S.td, color: c.sub }}>{getEstimatedDelivery(order.createdAt, order.status)}</td>
                      <td style={{ ...S.td, color: c.sub }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Featured Products */}
        {!loading && products.length > 0 && (
          <div style={S.card}>
            <div style={S.cardHeader}>
              Featured Products
              <button style={S.btnOutline} onClick={() => navigate('/shop')}>Browse All</button>
            </div>
            <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14 }}>
              {products.map(p => (
                <div key={p._id} style={{
                    borderRadius: 8, border: `1px solid ${c.border}`,
                    overflow: 'hidden', cursor: 'pointer', background: c.surface,
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  <div style={{ height: 118, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {p.image_url && !p.image_url.includes('placeholder')
                      ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 11, color: c.faint }}>No image</span>
                    }
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontWeight: 600, fontSize: 12.5, color: c.text, marginBottom: 2,
                      overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: c.text }}>₹{p.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  /* ───────────────────────────────────────────
     SECTION: My Orders
  ─────────────────────────────────────────── */
  const renderMyOrders = () => (
    <>
      {selectedOrder ? (
        <div>
          <button style={{ ...S.btnOutline, marginBottom: 20 }} onClick={() => setSelectedOrder(null)}>
            &larr; Back to Orders
          </button>

          <div style={S.card}>
            <div style={S.cardHeader}>
              Order #{selectedOrder._id?.slice(-8).toUpperCase()}
              <span style={S.badge(selectedOrder.status)}>{selectedOrder.status}</span>
            </div>
            <div style={S.cardBody}>

              {/* Delivery tracker */}
              {selectedOrder.status !== 'Cancelled' && (
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: c.faint, textTransform: 'uppercase', letterSpacing: .8, marginBottom: 18 }}>
                    Delivery Tracker
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
                    <div style={{
                      position: 'absolute', top: 13, left: 26, right: 26,
                      height: 2, background: c.border, zIndex: 0, borderRadius: 99,
                    }} />
                    <div style={{
                      position: 'absolute', top: 13, left: 26, height: 2,
                      background: c.accent, zIndex: 1, borderRadius: 99,
                      width: `${(getTrackStep(selectedOrder.status) / 3) * 80}%`,
                      maxWidth: 'calc(100% - 52px)', transition: 'width .4s ease',
                    }} />
                    {TRACK_LABELS.map((label, idx) => {
                      const done = idx <= getTrackStep(selectedOrder.status);
                      return (
                        <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                          <div style={{
                            width: 26, height: 26, borderRadius: '50%',
                            background: done ? c.accent : c.surface,
                            border: `2px solid ${done ? c.accent : c.border}`,
                            marginBottom: 8, transition: '.3s',
                          }} />
                          <div style={{ fontSize: 11, fontWeight: done ? 600 : 400, color: done ? c.text : c.faint, textAlign: 'center' }}>
                            {label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{
                    marginTop: 18, padding: '11px 16px', background: c.bg,
                    borderRadius: 8, border: `1px solid ${c.border}`,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 12, color: c.sub, fontWeight: 600 }}>Estimated Delivery</span>
                    <span style={{ fontWeight: 700, fontSize: 14, color: c.text }}>
                      {getEstimatedDelivery(selectedOrder.createdAt, selectedOrder.status)}
                    </span>
                  </div>
                </div>
              )}

              {/* Items */}
              <div style={{ fontSize: 10.5, fontWeight: 700, color: c.faint, textTransform: 'uppercase', letterSpacing: .8, marginBottom: 12 }}>Order Items</div>
              <table style={S.table}>
                <thead>
                  <tr>{['Product','Qty','Unit Price','Subtotal'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {(selectedOrder.items || []).map((item, i) => (
                    <tr key={i}>
                      <td style={{ ...S.td, fontWeight: 500 }}>{item.product_id?.name || 'Product'}</td>
                      <td style={S.td}>{item.quantity}</td>
                      <td style={S.td}>₹{item.price}</td>
                      <td style={{ ...S.td, fontWeight: 600 }}>₹{item.quantity * item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Info grid */}
              <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  {
                    title: 'Order Info',
                    rows: [
                      ['Order Date', new Date(selectedOrder.createdAt).toLocaleDateString('en-IN')],
                      ['Payment', selectedOrder.payment_status],
                      ['City', selectedOrder.city || '—'],
                    ],
                  },
                  {
                    title: 'Shipping Address',
                    rows: [
                      ['Name', userInfo?.name],
                      ['Address', selectedOrder.shipping_address],
                      ['City', selectedOrder.city],
                    ],
                  },
                ].map(block => (
                  <div key={block.title} style={{ background: c.bg, borderRadius: 8, padding: '14px 16px', border: `1px solid ${c.border}` }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: c.faint, textTransform: 'uppercase', letterSpacing: .8, marginBottom: 10 }}>{block.title}</div>
                    {block.rows.map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: c.sub }}>{k}</span>
                        <span style={{ fontSize: 12, fontWeight: 500, color: c.text }}>{v}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: 14, padding: '14px 18px', background: c.bg,
                borderRadius: 8, border: `1px solid ${c.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontWeight: 600, fontSize: 13.5 }}>Total Amount</span>
                <span style={{ fontWeight: 700, fontSize: 20, color: c.text }}>₹{selectedOrder.total_amount}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={S.card}>
          <div style={S.cardHeader}>
            All Orders
            <button style={S.btn} onClick={() => navigate('/shop')}>Browse Shop</button>
          </div>
          {loading ? (
            <div style={{ padding: 32, textAlign: 'center', color: c.sub }}>Loading…</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: c.text, marginBottom: 6 }}>No orders found</div>
              <div style={{ color: c.sub, fontSize: 12.5, marginBottom: 20 }}>You haven't placed any orders yet.</div>
              <button style={S.btn} onClick={() => navigate('/shop')}>Start Shopping</button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={S.table}>
                <thead>
                  <tr>{['#','Order ID','Items','Amount','Status','Payment','Est. Delivery','Date',''].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <tr key={order._id}
                      onMouseEnter={e => e.currentTarget.style.background = c.hover}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ ...S.td, color: c.sub }}>{i + 1}</td>
                      <td style={{ ...S.td, fontWeight: 600, fontFamily: 'monospace', fontSize: 12 }}>#{order._id?.slice(-8).toUpperCase()}</td>
                      <td style={S.td}>{order.items?.length || 0}</td>
                      <td style={{ ...S.td, fontWeight: 600 }}>₹{order.total_amount}</td>
                      <td style={S.td}><span style={S.badge(order.status)}>{order.status}</span></td>
                      <td style={S.td}><span style={S.badge(order.payment_status)}>{order.payment_status}</span></td>
                      <td style={{ ...S.td, color: c.sub }}>{getEstimatedDelivery(order.createdAt, order.status)}</td>
                      <td style={{ ...S.td, color: c.sub }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      <td style={S.td}>
                        <button style={S.btnSmall} onClick={() => setSelectedOrder(order)}>Track</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );

  /* ───────────────────────────────────────────
     SECTION: Profile
  ─────────────────────────────────────────── */
  const renderProfile = () => (
    <div style={{ maxWidth: 540 }}>
      <div style={S.card}>
        {/* Profile header */}
        <div style={{
          padding: '22px 24px 18px', borderBottom: `1px solid ${c.border}`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 50, height: 50, borderRadius: '50%', background: c.accent,
            color: '#fff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 20, fontWeight: 700, flexShrink: 0,
          }}>
            {(userInfo?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: c.text }}>{userInfo?.name}</div>
            <div style={{ fontSize: 12, color: c.sub, marginTop: 2 }}>Member Account</div>
          </div>
        </div>

        <div style={S.cardBody}>
          {profileMsg && (
            <div style={S.alert(profileMsg.split(':')[0])}>{profileMsg.split(':').slice(1).join(':')}</div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={S.formRow2}>
              <div>
                <label style={S.label}>Full Name</label>
                <input style={S.input} value={profileData.name}
                  onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label style={S.label}>Email</label>
                <input style={{ ...S.input, color: c.sub, cursor: 'not-allowed' }}
                  value={profileData.email} readOnly />
              </div>
            </div>
            <div>
              <label style={S.label}>Contact Number</label>
              <input style={S.input} value={profileData.contact_no}
                onChange={e => setProfileData(p => ({ ...p, contact_no: e.target.value }))} />
            </div>
            <div>
              <label style={S.label}>Address</label>
              <textarea style={{ ...S.input, minHeight: 76, resize: 'vertical' }}
                value={profileData.address}
                onChange={e => setProfileData(p => ({ ...p, address: e.target.value }))} />
            </div>
            <div>
              <button style={S.btn}
                onClick={() => setProfileMsg('success: Profile saved successfully.')}>
                Save Changes
              </button>
            </div>
          </div>

          {/* Account summary */}
          <div style={{ marginTop: 26, paddingTop: 20, borderTop: `1px solid ${c.border}` }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: c.faint, textTransform: 'uppercase', letterSpacing: .8, marginBottom: 12 }}>
              Account Summary
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {[
                { label: 'Total Orders', value: orderStats.total },
                { label: 'Delivered',    value: orderStats.delivered },
                { label: 'In Transit',   value: orderStats.shipped },
              ].map(s => (
                <div key={s.label} style={{
                  background: c.bg, borderRadius: 8, padding: '12px 14px',
                  textAlign: 'center', border: `1px solid ${c.border}`,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: c.text }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: c.sub, fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ───────────────────────────────────────────
     Page metadata
  ─────────────────────────────────────────── */
  const PAGE_META = {
    dashboard: { title: 'Dashboard',  sub: `Overview of your account activity` },
    myOrders:  { title: 'My Orders',  sub: 'Track and manage your purchases.' },
    shop:      { title: 'Shop',       sub: 'Discover handcrafted products.' },
    profile:   { title: 'My Profile', sub: 'Manage your personal information.' },
  };
  const current = PAGE_META[activeNav] || PAGE_META.dashboard;

  /* ───────────────────────────────────────────
     MAIN RENDER
  ─────────────────────────────────────────── */
  return (
    <div style={S.shell}>

      {/* ── SIDEBAR ── */}
      <aside style={S.sidebar}>
        <div style={S.sideHeader}>
          {sidebarOpen && <span style={S.brandText}>Krantijyoti Mahila Gat</span>}
        </div>

        <nav style={S.navSection}>
          {NAV_ITEMS.map(item => (
            <button key={item.key}
              style={S.navItem(activeNav === item.key)}
              onClick={() => {
                if (item.key === 'shop') { navigate('/shop'); return; }
                setSelectedOrder(null);
                setActiveNav(item.key);
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div style={S.navFooter}>
          <button style={S.navItem(false)} onClick={() => setActiveNav('profile')}>Settings</button>
          <button style={{ ...S.navItem(false), color: '#dc2626' }} onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={S.main}>

        {/* Topbar */}
        <header style={S.topbar}>
          <div style={S.topLeft}>
            <button style={S.collapseBtn} onClick={() => setSidebarOpen(o => !o)}>
              {sidebarOpen ? '‹' : '›'}
            </button>
            <div style={S.searchBar}>
              <span style={S.searchIcon}>&#9906;</span>
              <input style={S.searchInput} placeholder="Search orders, products…" />
            </div>
          </div>

          <div style={S.topRight}>
            {sidebarOpen && <span style={S.userName}>{userInfo?.name}</span>}
            <button style={S.avatarCircle} onClick={() => setActiveNav('profile')} title={userInfo?.name}>
              {(userInfo?.name || 'U').charAt(0).toUpperCase()}
            </button>
          </div>
        </header>

        {/* Page content */}
        <div style={S.content}>
          <div style={S.pageHeading}>{current.title}</div>
          <div style={S.pageCrumb}>{current.sub}</div>

          {activeNav === 'dashboard' && renderDashboard()}
          {activeNav === 'myOrders'  && renderMyOrders()}
          {activeNav === 'profile'   && renderProfile()}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
