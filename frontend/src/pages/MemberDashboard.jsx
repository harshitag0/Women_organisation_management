import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/* ─── Navigation — Savings & All Members removed ─── */
const NAV_ITEMS = [
  { key: 'dashboard',  label: 'Dashboard'   },
  { key: 'myOrders',   label: 'Orders Received' },
  { key: 'addProduct', label: 'Add Product' },
  { key: 'myProducts', label: 'My Products' },
  { key: 'loans',      label: 'My Loans'    },
];

/* ─── Design tokens ─── */
const c = {
  bg:      '#f5f5f5',
  surface: '#ffffff',
  border:  '#e4e4e7',
  text:    '#18181b',
  sub:     '#71717a',
  faint:   '#a1a1aa',
  accent:  '#18181b',
  hover:   '#fafafa',
  teal:    '#0d9488',   // subtle teal only for stat tops
  badgeMap: {
    Pending:    { bg: '#fef3c7', c: '#92400e' },
    Processing: { bg: '#ede9fe', c: '#4c1d95' },
    Shipped:    { bg: '#d1fae5', c: '#065f46' },
    Delivered:  { bg: '#d1fae5', c: '#065f46' },
    Cancelled:  { bg: '#fee2e2', c: '#991b1b' },
    Approved:   { bg: '#d1fae5', c: '#065f46' },
    Rejected:   { bg: '#fee2e2', c: '#991b1b' },
    Closed:     { bg: '#f4f4f5', c: '#71717a' },
    Completed:  { bg: '#d1fae5', c: '#065f46' },
    Failed:     { bg: '#fee2e2', c: '#991b1b' },
  },
};

const MemberDashboard = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeNav,    setActiveNav]    = useState('dashboard');
  const [sidebarOpen,  setSidebarOpen]  = useState(true);

  const [loans,        setLoans]        = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);   // orders from customers for MY products
  const [products,     setProducts]     = useState([]);
  const [stats,        setStats]        = useState({ totalOrders: 0, totalProducts: 0, activeLoan: 0 });

  /* form states */
  const [loanAmount,       setLoanAmount]       = useState('');
  const [loanReason,       setLoanReason]       = useState('');
  const [loanMsg,          setLoanMsg]          = useState('');
  const [productName,      setProductName]      = useState('');
  const [productPrice,     setProductPrice]     = useState('');
  const [productCategory,  setProductCategory]  = useState('');
  const [productDesc,      setProductDesc]      = useState('');
  const [productQty,       setProductQty]       = useState('10');
  const [productMsg,       setProductMsg]       = useState('');

  useEffect(() => { if (userInfo) fetchAllData(); }, [userInfo]);

  const fetchAllData = async () => {
    if (!userInfo) return;
    try {
      const cfg = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const [loansRes, sellerOrdersRes, productsRes] = await Promise.all([
        axios.get('/api/loans/myloans',         cfg).catch(() => ({ data: [] })),
        axios.get('/api/orders/seller-orders',  cfg).catch(() => ({ data: [] })),
        axios.get('/api/products/myproducts',   cfg).catch(() => ({ data: [] })),
      ]);

      setLoans(loansRes.data);
      setSellerOrders(sellerOrdersRes.data);
      setProducts(productsRes.data);

      const activeLoan = loansRes.data.find(l => l.status === 'Approved');
      setStats({
        totalOrders:   sellerOrdersRes.data.length,
        totalProducts: productsRes.data.length,
        activeLoan:    activeLoan ? activeLoan.approved_amount : 0,
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const submitLoan = async (e) => {
    e.preventDefault();
    setLoanMsg('');
    try {
      const cfg = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo?.token}` } };
      await axios.post('/api/loans', {
        bachatgat_id: userInfo.bachatgat_id || userInfo._id,
        loan_amount_required: loanAmount,
        reason: loanReason,
      }, cfg);
      setLoanMsg('success:Loan application submitted successfully.');
      setLoanAmount(''); setLoanReason('');
      fetchAllData();
    } catch (err) {
      setLoanMsg('error:' + (err.response?.data?.message || 'Error submitting loan'));
    }
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    setProductMsg('');
    try {
      const cfg = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo?.token}` } };
      await axios.post('/api/products', {
        name: productName,
        price: productPrice,
        category: productCategory,
        description: productDesc,
        quantity: productQty || 10,
        unit: 'piece',
      }, cfg);
      setProductMsg('success:Product added successfully!');
      setProductName(''); setProductPrice(''); setProductCategory(''); setProductDesc(''); setProductQty('10');
      await fetchAllData();            // refresh immediately so My Products updates
      setTimeout(() => { setActiveNav('myProducts'); }, 1200);
    } catch (err) {
      setProductMsg('error:' + (err.response?.data?.message || 'Error adding product'));
    }
  };

  /* ─── Style objects ─── */
  const S = {
    shell: {
      display: 'flex', minHeight: '100vh',
      background: c.bg,
      fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
      fontSize: 13.5, color: c.text,
    },
    sidebar: {
      width: sidebarOpen ? 210 : 52,
      background: c.surface, borderRight: `1px solid ${c.border}`,
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
    navSection: { flex: 1, padding: '10px 6px', overflowY: 'auto' },
    navItem: (active) => ({
      display: 'block', width: '100%', textAlign: 'left',
      padding: '9px 12px', borderRadius: 7, cursor: 'pointer', marginBottom: 1,
      background: active ? c.bg : 'transparent',
      color: active ? c.text : c.sub,
      fontWeight: active ? 600 : 400, fontSize: 13,
      border: 'none',
      borderLeft: active ? `2px solid ${c.accent}` : '2px solid transparent',
      whiteSpace: 'nowrap', overflow: 'hidden', transition: 'all .15s',
    }),
    navFooter: { padding: '8px 6px 18px', borderTop: `1px solid ${c.border}` },
    main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
    topbar: {
      height: 52, background: c.surface, borderBottom: `1px solid ${c.border}`,
      padding: '0 24px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
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
    },
    content: { padding: '28px 30px 60px', flex: 1, overflowY: 'auto' },
    pageHeading: { fontWeight: 700, fontSize: 21, color: c.text, marginBottom: 2 },
    pageCrumb:   { fontSize: 12.5, color: c.sub, marginBottom: 26 },
    statsGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))',
      gap: 14, marginBottom: 26,
    },
    statCard: (idx) => ({
      background: c.surface, borderRadius: 10,
      border: `1px solid ${c.border}`, padding: '18px 20px 16px',
      borderTop: `3px solid ${['#0d9488','#18181b','#ca8a04'][idx] || c.border}`,
    }),
    statNum:   { fontSize: 30, fontWeight: 700, color: c.text, lineHeight: 1, marginBottom: 4 },
    statLabel: { fontSize: 10.5, color: c.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .8 },
    statSub:   { fontSize: 10.5, color: c.faint, marginTop: 3 },
    card: {
      background: c.surface, borderRadius: 10,
      border: `1px solid ${c.border}`, overflow: 'hidden', marginBottom: 20,
    },
    cardHeader: {
      padding: '14px 20px', borderBottom: `1px solid ${c.border}`,
      fontWeight: 600, fontSize: 13.5, color: c.text,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    cardBody: { padding: '20px 20px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
      padding: '9px 14px', textAlign: 'left',
      fontSize: 10, fontWeight: 700, color: c.faint,
      textTransform: 'uppercase', letterSpacing: .8,
      borderBottom: `1px solid ${c.border}`,
    },
    td: { padding: '12px 14px', fontSize: 13, color: c.text, borderBottom: `1px solid ${c.border}` },
    badge: (status) => {
      const m = c.badgeMap[status] || { bg: '#f4f4f5', c: '#71717a' };
      return { display: 'inline-block', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, background: m.bg, color: m.c };
    },
    form: { display: 'flex', flexDirection: 'column', gap: 14 },
    formRow2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
    label: { fontSize: 11, fontWeight: 600, color: c.sub, marginBottom: 5, display: 'block', textTransform: 'uppercase', letterSpacing: .6 },
    input: {
      width: '100%', padding: '9px 12px', boxSizing: 'border-box',
      border: `1px solid ${c.border}`, borderRadius: 7,
      fontSize: 13, color: c.text, outline: 'none', background: c.bg, fontFamily: 'inherit',
    },
    select: {
      width: '100%', padding: '9px 12px', boxSizing: 'border-box',
      border: `1px solid ${c.border}`, borderRadius: 7,
      fontSize: 13, color: c.text, outline: 'none', background: c.bg, fontFamily: 'inherit',
    },
    textarea: {
      width: '100%', padding: '9px 12px', boxSizing: 'border-box',
      border: `1px solid ${c.border}`, borderRadius: 7,
      fontSize: 13, color: c.text, outline: 'none', background: c.bg,
      fontFamily: 'inherit', resize: 'vertical', minHeight: 78,
    },
    btn: {
      background: c.accent, color: '#fff', border: 'none', borderRadius: 7,
      padding: '9px 20px', fontWeight: 600, fontSize: 13, cursor: 'pointer',
    },
    btnOutline: {
      background: 'transparent', color: c.text,
      border: `1px solid ${c.border}`, borderRadius: 7,
      padding: '7px 14px', fontWeight: 600, fontSize: 12, cursor: 'pointer',
    },
    alert: (t) => ({
      padding: '10px 14px', borderRadius: 7, fontSize: 12.5, marginBottom: 12,
      background: t === 'success' ? '#f0fdf4' : '#fef2f2',
      color:      t === 'success' ? '#166534'  : '#991b1b',
      border: `1px solid ${t === 'success' ? '#bbf7d0' : '#fecaca'}`,
    }),
  };

  /* ───────── RENDER: DASHBOARD ───────── */
  const renderDashboard = () => (
    <>
      <div style={S.statsGrid}>
        {[
          { label: 'Orders Received', value: stats.totalOrders,   sub: 'From customers'   },
          { label: 'My Products',     value: stats.totalProducts, sub: 'Listed in shop'   },
          { label: 'Active Loan',     value: `₹${stats.activeLoan}`, sub: 'Approved amount' },
        ].map((s, i) => (
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

      {/* Recent incoming orders */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          Recent Orders Received
          <button style={S.btnOutline} onClick={() => setActiveNav('myOrders')}>View All</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>{['Order ID','Customer','Products','Amount','Status','Date'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {sellerOrders.slice(0, 5).map(order => (
                <tr key={order._id}
                  onMouseEnter={e => e.currentTarget.style.background = c.hover}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ ...S.td, fontWeight: 600, fontFamily: 'monospace', fontSize: 12 }}>#{order._id?.slice(-8).toUpperCase()}</td>
                  <td style={S.td}>{order.customer_id?.name || '—'}</td>
                  <td style={{ ...S.td, fontSize: 12 }}>{order.items?.map(i => i.product_id?.name).filter(Boolean).join(', ') || '—'}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>₹{order.total_amount}</td>
                  <td style={S.td}><span style={S.badge(order.status)}>{order.status}</span></td>
                  <td style={{ ...S.td, color: c.sub }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {sellerOrders.length === 0 && (
                <tr><td colSpan="6" style={{ ...S.td, textAlign: 'center', color: c.sub }}>No orders received yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* My Products snapshot */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          My Products
          <button style={S.btnOutline} onClick={() => setActiveNav('addProduct')}>Add Product</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>{['#','Name','Category','Price','Stock'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((p, i) => (
                <tr key={p._id}
                  onMouseEnter={e => e.currentTarget.style.background = c.hover}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ ...S.td, color: c.sub }}>{i + 1}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{p.name}</td>
                  <td style={S.td}>{p.category}</td>
                  <td style={S.td}>₹{p.price}</td>
                  <td style={S.td}>{p.quantity ?? 'N/A'}</td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan="5" style={{ ...S.td, textAlign: 'center', color: c.sub }}>No products listed yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  /* ───────── RENDER: ORDERS RECEIVED ───────── */
  const renderMyOrders = () => (
    <div style={S.card}>
      <div style={S.cardHeader}>
        All Orders Received
        <span style={{ fontSize: 12, color: c.sub, fontWeight: 400 }}>Orders placed by customers for your products</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={S.table}>
          <thead>
            <tr>{['#','Order ID','Customer','Contact','Products Ordered','Amount','Status','Payment','Date'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {sellerOrders.map((order, i) => (
              <tr key={order._id}
                onMouseEnter={e => e.currentTarget.style.background = c.hover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ ...S.td, color: c.sub }}>{i + 1}</td>
                <td style={{ ...S.td, fontWeight: 600, fontFamily: 'monospace', fontSize: 12 }}>#{order._id?.slice(-8).toUpperCase()}</td>
                <td style={{ ...S.td, fontWeight: 500 }}>{order.customer_id?.name || '—'}</td>
                <td style={{ ...S.td, color: c.sub }}>{order.customer_id?.contact_no || order.customer_id?.email || '—'}</td>
                <td style={{ ...S.td, fontSize: 12 }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx}>{item.product_id?.name || 'Product'} × {item.quantity}</div>
                  ))}
                </td>
                <td style={{ ...S.td, fontWeight: 600 }}>₹{order.total_amount}</td>
                <td style={S.td}><span style={S.badge(order.status)}>{order.status}</span></td>
                <td style={S.td}><span style={S.badge(order.payment_status)}>{order.payment_status}</span></td>
                <td style={{ ...S.td, color: c.sub }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
            {sellerOrders.length === 0 && (
              <tr><td colSpan="9" style={{ ...S.td, textAlign: 'center', color: c.sub, padding: 40 }}>No orders received yet. Once customers buy your products, they will appear here.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ───────── RENDER: ADD PRODUCT ───────── */
  const renderAddProduct = () => (
    <div style={{ maxWidth: 560 }}>
      <div style={S.card}>
        <div style={S.cardHeader}>Add New Product</div>
        <div style={S.cardBody}>
          {productMsg && (
            <div style={S.alert(productMsg.split(':')[0])}>{productMsg.split(':').slice(1).join(':')}</div>
          )}
          <form onSubmit={submitProduct} style={S.form}>
            <div>
              <label style={S.label}>Product Name</label>
              <input style={S.input} placeholder="e.g., Handmade Papads"
                value={productName} onChange={e => setProductName(e.target.value)} required />
            </div>
            <div style={S.formRow2}>
              <div>
                <label style={S.label}>Price (₹)</label>
                <input type="number" style={S.input} placeholder="150"
                  value={productPrice} onChange={e => setProductPrice(e.target.value)} required />
              </div>
              <div>
                <label style={S.label}>Quantity</label>
                <input type="number" style={S.input} placeholder="10"
                  value={productQty} onChange={e => setProductQty(e.target.value)} required />
              </div>
            </div>
            <div>
              <label style={S.label}>Category</label>
              <select style={S.select} value={productCategory} onChange={e => setProductCategory(e.target.value)} required>
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Crafts">Crafts</option>
                <option value="Textiles">Textiles</option>
                <option value="Beauty">Beauty</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={S.label}>Description</label>
              <textarea style={S.textarea} placeholder="Describe your product…"
                value={productDesc} onChange={e => setProductDesc(e.target.value)} />
            </div>
            <div>
              <button type="submit" style={S.btn}>Add Product</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  /* ───────── RENDER: MY PRODUCTS ───────── */
  const renderMyProducts = () => (
    <div style={S.card}>
      <div style={S.cardHeader}>
        My Products
        <button style={S.btn} onClick={() => setActiveNav('addProduct')}>+ Add Product</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={S.table}>
          <thead>
            <tr>{['#','Product Name','Category','Price (₹)','Stock','Description'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr key={product._id}
                onMouseEnter={e => e.currentTarget.style.background = c.hover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ ...S.td, color: c.sub }}>{i + 1}</td>
                <td style={{ ...S.td, fontWeight: 600 }}>{product.name}</td>
                <td style={S.td}>{product.category}</td>
                <td style={S.td}>₹{product.price}</td>
                <td style={S.td}>{product.quantity ?? '—'}</td>
                <td style={{ ...S.td, color: c.sub, fontSize: 12 }}>{product.description || '—'}</td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="6" style={{ ...S.td, textAlign: 'center', color: c.sub, padding: 40 }}>
                No products listed yet.{' '}
                <span style={{ color: c.text, cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => setActiveNav('addProduct')}>Add your first product</span>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ───────── RENDER: LOANS ───────── */
  const renderLoans = () => (
    <>
      <div style={{ maxWidth: 560, marginBottom: 20 }}>
        <div style={S.card}>
          <div style={S.cardHeader}>Apply for Loan</div>
          <div style={S.cardBody}>
            {loanMsg && (
              <div style={S.alert(loanMsg.split(':')[0])}>{loanMsg.split(':').slice(1).join(':')}</div>
            )}
            <form onSubmit={submitLoan} style={S.form}>
              <div>
                <label style={S.label}>Loan Amount (₹)</label>
                <input type="number" style={S.input} placeholder="5000"
                  value={loanAmount} onChange={e => setLoanAmount(e.target.value)} required />
              </div>
              <div>
                <label style={S.label}>Reason</label>
                <textarea style={S.textarea} placeholder="Purpose of loan…"
                  value={loanReason} onChange={e => setLoanReason(e.target.value)} required />
              </div>
              <div>
                <button type="submit" style={S.btn}>Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardHeader}>Loan History</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>{['Date','Requested (₹)','Approved (₹)','Paid (₹)','Status'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {loans.map(loan => (
                <tr key={loan._id}
                  onMouseEnter={e => e.currentTarget.style.background = c.hover}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ ...S.td, color: c.sub }}>{new Date(loan.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={S.td}>₹{loan.loan_amount_required}</td>
                  <td style={S.td}>₹{loan.approved_amount || 0}</td>
                  <td style={S.td}>₹{loan.total_paid || 0}</td>
                  <td style={S.td}><span style={S.badge(loan.status)}>{loan.status}</span></td>
                </tr>
              ))}
              {loans.length === 0 && (
                <tr><td colSpan="5" style={{ ...S.td, textAlign: 'center', color: c.sub }}>No loan history</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  /* ───────── Page meta ───────── */
  const PAGE_META = {
    dashboard:  { title: 'Dashboard',          sub: 'Overview of your activity and incoming orders.' },
    myOrders:   { title: 'Orders Received',    sub: 'Orders placed by customers for your products.' },
    addProduct: { title: 'Add Product',        sub: 'List a new product in the marketplace.' },
    myProducts: { title: 'My Products',        sub: 'Manage all your listed products.' },
    loans:      { title: 'My Loans',           sub: 'Apply for a loan and view your loan history.' },
  };
  const current = PAGE_META[activeNav] || PAGE_META.dashboard;

  /* ───────── MAIN RENDER ───────── */
  return (
    <div style={S.shell}>

      {/* SIDEBAR */}
      <aside style={S.sidebar}>
        <div style={S.sideHeader}>
          {sidebarOpen && <span style={S.brandText}>SakhiConnect</span>}
        </div>

        <nav style={S.navSection}>
          {NAV_ITEMS.map(item => (
            <button key={item.key}
              style={S.navItem(activeNav === item.key)}
              onClick={() => { setActiveNav(item.key); }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div style={S.navFooter}>
          <button style={S.navItem(false)} onClick={() => {}}>Settings</button>
          <button style={{ ...S.navItem(false), color: '#dc2626' }} onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={S.main}>
        <header style={S.topbar}>
          <div style={S.topLeft}>
            <button style={S.collapseBtn} onClick={() => setSidebarOpen(o => !o)}>
              {sidebarOpen ? '‹' : '›'}
            </button>
            <div style={S.searchBar}>
              <input style={S.searchInput} placeholder="Search products, orders…" />
            </div>
          </div>
          <div style={S.topRight}>
            {sidebarOpen && <span style={{ fontSize: 13, fontWeight: 500, color: c.text }}>{userInfo?.name}</span>}
            <button style={S.avatarCircle} title={userInfo?.name}>
              {(userInfo?.name || 'M').charAt(0).toUpperCase()}
            </button>
          </div>
        </header>

        <div style={S.content}>
          <div style={S.pageHeading}>{current.title}</div>
          <div style={S.pageCrumb}>{current.sub}</div>

          {activeNav === 'dashboard'  && renderDashboard()}
          {activeNav === 'myOrders'   && renderMyOrders()}
          {activeNav === 'addProduct' && renderAddProduct()}
          {activeNav === 'myProducts' && renderMyProducts()}
          {activeNav === 'loans'      && renderLoans()}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
