import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'myOrders', icon: '🛒', label: 'My Orders' },
  { key: 'addProduct', icon: '➕', label: 'Add Product' },
  { key: 'myProducts', icon: '📦', label: 'My Products' },
  { key: 'loans', icon: '💰', label: 'My Loans' },
  { key: 'savings', icon: '💵', label: 'Savings' },
  { key: 'members', icon: '👥', label: 'All Members' },
];

const MemberDashboard = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // State for various data
  const [loans, setLoans] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [members, setMembers] = useState([]);
  const [savings, setSavings] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalSavings: 0,
    activeLoan: 0
  });
  
  // Form states
  const [loanAmount, setLoanAmount] = useState('');
  const [loanReason, setLoanReason] = useState('');
  const [loanMsg, setLoanMsg] = useState('');
  
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productMsg, setProductMsg] = useState('');

  useEffect(() => {
    fetchAllData();
  }, [userInfo]);

  const fetchAllData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      
      const [loansRes, ordersRes, productsRes, membersRes] = await Promise.all([
        axios.get('/api/loans/myloans', config).catch(() => ({ data: [] })),
        axios.get('/api/orders/myorders', config).catch(() => ({ data: [] })),
        axios.get('/api/products/myproducts', config).catch(() => ({ data: [] })),
        axios.get('/api/members', config).catch(() => ({ data: [] }))
      ]);
      
      setLoans(loansRes.data);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setMembers(membersRes.data);
      
      // Calculate stats
      const activeLoan = loansRes.data.find(l => l.status === 'Approved');
      setStats({
        totalOrders: ordersRes.data.length,
        totalProducts: productsRes.data.length,
        totalSavings: 0, // Will be calculated from savings API
        activeLoan: activeLoan ? activeLoan.approved_amount : 0
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const submitLoan = async (e) => {
    e.preventDefault();
    setLoanMsg('');
    try {
      const config = { 
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${userInfo?.token}` 
        } 
      };
      
      const loanData = {
        bachatgat_id: userInfo.bachatgat_id || '661e4b8f0f00000000000000',
        loan_amount_required: loanAmount,
        reason: loanReason
      };
      
      await axios.post('/api/loans', loanData, config);
      setLoanMsg('success:Loan application submitted successfully!');
      setLoanAmount('');
      setLoanReason('');
      fetchAllData();
    } catch (err) {
      setLoanMsg('error:' + (err.response?.data?.message || 'Error submitting loan'));
    }
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    setProductMsg('');
    try {
      console.log('=== Submitting Product ===');
      console.log('User Info:', userInfo);
      
      const config = { 
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${userInfo?.token}` 
        } 
      };
      
      const productData = {
        name: productName,
        price: productPrice,
        category: productCategory,
        description: productDesc,
        quantity: 10, // Default quantity
        unit: 'piece' // Default unit
      };
      
      console.log('Product Data:', productData);
      
      const response = await axios.post('/api/products', productData, config);
      console.log('Response:', response.data);
      
      setProductMsg('success:Product added successfully!');
      setProductName('');
      setProductPrice('');
      setProductCategory('');
      setProductDesc('');
      fetchAllData();
      
      // Optionally switch to My Products view after 2 seconds
      setTimeout(() => {
        setActiveNav('myProducts');
      }, 2000);
    } catch (err) {
      console.error('Product submission error:', err);
      console.error('Error response:', err.response?.data);
      setProductMsg('error:' + (err.response?.data?.message || 'Error adding product'));
    }
  };

  /* ─── Styles ─── */
  const S = {
    shell: {
      display: 'flex',
      minHeight: '100vh',
      background: '#f5f6fa',
      fontFamily: "'Inter', sans-serif",
    },
    sidebar: {
      width: sidebarOpen ? 220 : 64,
      background: '#fff',
      borderRight: '1.5px solid #e0f2f1',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width .28s ease',
      overflow: 'hidden',
      flexShrink: 0,
      boxShadow: '2px 0 16px rgba(0,150,136,0.05)',
      position: 'sticky',
      top: 0,
      height: '100vh',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '24px 18px 18px',
      borderBottom: '1.5px solid #e0f2f1',
    },
    logoIcon: {
      width: 36,
      height: 36,
      background: 'linear-gradient(135deg, #00897b, #26a69a)',
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 800,
      fontSize: 15,
      flexShrink: 0,
    },
    logoText: {
      fontWeight: 800,
      fontSize: 15,
      color: '#004d40',
      whiteSpace: 'nowrap',
      fontFamily: "'Playfair Display', serif",
    },
    navSection: { flex: 1, padding: '16px 10px', overflowY: 'auto' },
    navItem: (active) => ({
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '11px 12px',
      borderRadius: 10,
      cursor: 'pointer',
      marginBottom: 4,
      background: active ? 'linear-gradient(90deg, #e0f2f1, #fff)' : 'transparent',
      color: active ? '#00897b' : '#455a64',
      fontWeight: active ? 700 : 500,
      fontSize: 13.5,
      transition: '.18s',
      border: active ? '1.5px solid #b2dfdb' : '1.5px solid transparent',
      whiteSpace: 'nowrap',
    }),
    navIcon: { fontSize: 16, flexShrink: 0 },
    navLabel: { opacity: sidebarOpen ? 1 : 0, transition: 'opacity .2s' },
    navBottom: { padding: '12px 10px 20px', borderTop: '1.5px solid #e0f2f1' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
    topbar: {
      background: '#fff',
      borderBottom: '1.5px solid #e0f2f1',
      padding: '14px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
    },
    searchBar: {
      display: 'flex',
      alignItems: 'center',
      background: '#e0f2f122',
      border: '1.5px solid #b2dfdb',
      borderRadius: 40,
      padding: '7px 18px',
      gap: 8,
      width: 240,
    },
    searchInput: {
      border: 'none',
      background: 'transparent',
      outline: 'none',
      fontSize: 13,
      color: '#004d40',
      width: '100%',
    },
    topRight: { display: 'flex', alignItems: 'center', gap: 16 },
    bellBtn: {
      width: 36, height: 36, borderRadius: 50,
      background: '#e0f2f1',
      border: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 16, cursor: 'pointer',
    },
    avatar: {
      width: 36, height: 36, borderRadius: 50,
      background: 'linear-gradient(135deg,#00897b,#26a69a)',
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: 14, cursor: 'pointer',
    },
    content: { padding: '28px 28px 48px', flex: 1, overflowY: 'auto' },
    pageTitle: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 800, fontSize: 26, color: '#004d40', marginBottom: 4,
    },
    pageSub: { fontSize: 13, color: '#78909c', marginBottom: 28 },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))',
      gap: 18, marginBottom: 28,
    },
    statCard: (accent) => ({
      background: '#fff',
      borderRadius: 16,
      padding: '22px 24px',
      border: '1.5px solid #e0f2f1',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      transition: '.2s',
    }),
    statNum: (accent) => ({
      fontFamily: "'Playfair Display', serif",
      fontSize: 32, fontWeight: 800, color: accent, marginBottom: 2,
    }),
    statLabel: { fontSize: 12, color: '#78909c', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 },
    statSub: { fontSize: 11, color: '#bbb', marginTop: 6 },
    statIcon: (accent) => ({
      width: 40, height: 40, borderRadius: 10,
      background: accent + '18',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 18, marginBottom: 12,
    }),
    card: {
      background: '#fff', borderRadius: 16,
      border: '1.5px solid #e0f2f1',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      overflow: 'hidden',
      marginBottom: 20,
    },
    cardHeader: {
      padding: '16px 22px',
      borderBottom: '1.5px solid #e0f2f1',
      fontWeight: 700, fontSize: 14.5, color: '#004d40',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    cardBody: { padding: 22 },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
      padding: '10px 14px', textAlign: 'left',
      fontSize: 11, fontWeight: 700, color: '#78909c',
      textTransform: 'uppercase', letterSpacing: .8,
      borderBottom: '1.5px solid #e0f2f1',
    },
    td: {
      padding: '12px 14px', fontSize: 13.5, color: '#004d40',
      borderBottom: '1px solid #e0f2f1',
    },
    badge: (status) => ({
      display: 'inline-block', padding: '3px 12px',
      borderRadius: 40, fontSize: 11, fontWeight: 700,
      background: status === 'Approved' || status === 'Delivered' ? '#e6f7f3' : 
                  status === 'Rejected' || status === 'Cancelled' ? '#ffebee' : '#fff3e0',
      color: status === 'Approved' || status === 'Delivered' ? '#00897b' : 
             status === 'Rejected' || status === 'Cancelled' ? '#c62828' : '#ef6c00',
    }),
    form: { display: 'flex', flexDirection: 'column', gap: 14 },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
    label: { fontSize: 12, fontWeight: 700, color: '#455a64', marginBottom: 4, display: 'block' },
    input: {
      width: '100%', padding: '10px 14px',
      border: '1.5px solid #e0f2f1', borderRadius: 10,
      fontSize: 13.5, color: '#004d40', outline: 'none',
      background: '#f9fffe', fontFamily: 'inherit',
      transition: '.15s',
    },
    textarea: {
      width: '100%', padding: '10px 14px',
      border: '1.5px solid #e0f2f1', borderRadius: 10,
      fontSize: 13.5, color: '#004d40', outline: 'none',
      background: '#f9fffe', fontFamily: 'inherit',
      resize: 'vertical', minHeight: 80,
    },
    select: {
      width: '100%', padding: '10px 14px',
      border: '1.5px solid #e0f2f1', borderRadius: 10,
      fontSize: 13.5, color: '#004d40', outline: 'none',
      background: '#f9fffe', fontFamily: 'inherit',
    },
    btnPrimary: {
      background: 'linear-gradient(135deg,#00897b,#26a69a)',
      color: '#fff', border: 'none', borderRadius: 10,
      padding: '11px 28px', fontWeight: 700, fontSize: 14,
      cursor: 'pointer', transition: '.18s', display: 'inline-flex',
      alignItems: 'center', gap: 8,
    },
    alert: (type) => ({
      padding: '10px 16px', borderRadius: 10, fontSize: 13,
      background: type === 'success' ? '#e6f7f3' : '#ffebee',
      color: type === 'success' ? '#00897b' : '#c62828',
      border: `1px solid ${type === 'success' ? '#b2dfdb' : '#ffcdd2'}`,
      marginBottom: 16,
    }),
    toggleBtn: {
      background: 'none', border: 'none', cursor: 'pointer',
      padding: '6px 8px', borderRadius: 8, color: '#455a64',
      fontSize: 18,
    },
  };

  /* ─── Render Functions ─── */
  const renderDashboard = () => (
    <>
      {/* Stats */}
      <div style={S.statsGrid}>
        {[
          { label: 'My Orders', value: stats.totalOrders, sub: 'Total orders placed', icon: '🛒', accent: '#00897b' },
          { label: 'My Products', value: stats.totalProducts, sub: 'Products listed', icon: '📦', accent: '#26a69a' },
          { label: 'Active Loan', value: `₹${stats.activeLoan}`, sub: 'Current loan amount', icon: '💰', accent: '#00695c' },
          { label: 'Total Savings', value: `₹${stats.totalSavings}`, sub: 'Accumulated savings', icon: '💵', accent: '#004d40' },
        ].map((s, i) => (
          <div key={i} style={S.statCard(s.accent)}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={S.statIcon(s.accent)}>{s.icon}</div>
            <div style={S.statLabel}>{s.label}</div>
            <div style={S.statNum(s.accent)}>{s.value}</div>
            <div style={S.statSub}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          🛒 Recent Orders
          <button style={{ ...S.btnPrimary, padding: '7px 16px', fontSize: 12 }}
            onClick={() => setActiveNav('myOrders')}>
            View All
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                {['Order ID', 'Product', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order._id}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fffe'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ ...S.td, fontWeight: 600 }}>#{order._id?.slice(-6)}</td>
                  <td style={S.td}>{order.product_id?.name || 'N/A'}</td>
                  <td style={S.td}>₹{order.total_amount}</td>
                  <td style={S.td}><span style={S.badge(order.status)}>{order.status}</span></td>
                  <td style={S.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="5" style={{ ...S.td, textAlign: 'center', color: '#78909c' }}>No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activities */}
      <div style={S.card}>
        <div style={S.cardHeader}>⚡ Recent Activities</div>
        <div style={S.cardBody}>
          {[
            { icon: '🛒', title: 'Order Placed', desc: 'You placed an order for Handmade Papads', time: '2 hours ago', color: '#00897b' },
            { icon: '📦', title: 'Product Listed', desc: 'Your product "Cotton Bags" is now live', time: '1 day ago', color: '#26a69a' },
            { icon: '💰', title: 'Loan Approved', desc: 'Your loan of ₹5,000 has been approved', time: '3 days ago', color: '#00695c' },
          ].map((a, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, padding: '13px 0',
              borderBottom: i === 2 ? 'none' : '1px solid #e0f2f1',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 50,
                background: a.color + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, flexShrink: 0,
              }}>{a.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#004d40' }}>{a.title}</div>
                <div style={{ fontSize: 12, color: '#78909c', marginTop: 1 }}>{a.desc}</div>
                <div style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderMyOrders = () => (
    <div style={S.card}>
      <div style={S.cardHeader}>🛒 All My Orders</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={S.table}>
          <thead>
            <tr>
              {['#', 'Order ID', 'Product', 'Quantity', 'Amount', 'Status', 'Date'].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={order._id}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fffe'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ ...S.td, color: '#78909c' }}>{i + 1}</td>
                <td style={{ ...S.td, fontWeight: 600 }}>#{order._id?.slice(-8)}</td>
                <td style={S.td}>{order.product_id?.name || 'N/A'}</td>
                <td style={S.td}>{order.quantity || 1}</td>
                <td style={S.td}>₹{order.total_amount}</td>
                <td style={S.td}><span style={S.badge(order.status)}>{order.status}</span></td>
                <td style={S.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="7" style={{ ...S.td, textAlign: 'center', color: '#78909c' }}>No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAddProduct = () => (
    <div style={{ maxWidth: 560 }}>
      <div style={S.card}>
        <div style={S.cardHeader}>➕ Add New Product</div>
        <div style={S.cardBody}>
          {productMsg && (
            <div style={{ ...S.alert(productMsg.split(':')[0]), marginBottom: 16 }}>
              {productMsg.split(':')[1]}
            </div>
          )}
          <form onSubmit={submitProduct} style={S.form}>
            <div>
              <label style={S.label}>Product Name</label>
              <input style={S.input} placeholder="e.g., Handmade Papads"
                value={productName} onChange={e => setProductName(e.target.value)} required />
            </div>
            <div style={S.formRow}>
              <div>
                <label style={S.label}>Price (₹)</label>
                <input type="number" style={S.input} placeholder="150"
                  value={productPrice} onChange={e => setProductPrice(e.target.value)} required />
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
                </select>
              </div>
            </div>
            <div>
              <label style={S.label}>Description</label>
              <textarea style={S.textarea} placeholder="Describe your product..."
                value={productDesc} onChange={e => setProductDesc(e.target.value)} />
            </div>
            <button type="submit" style={S.btnPrimary}>Add Product</button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderMyProducts = () => (
    <div style={S.card}>
      <div style={S.cardHeader}>📦 My Products</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={S.table}>
          <thead>
            <tr>
              {['#', 'Product Name', 'Category', 'Price', 'Stock', 'Status'].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr key={product._id}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fffe'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ ...S.td, color: '#78909c' }}>{i + 1}</td>
                <td style={{ ...S.td, fontWeight: 600 }}>{product.name}</td>
                <td style={S.td}>{product.category}</td>
                <td style={S.td}>₹{product.price}</td>
                <td style={S.td}>{product.stock_quantity || 'N/A'}</td>
                <td style={S.td}><span style={S.badge('Approved')}>Active</span></td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan="6" style={{ ...S.td, textAlign: 'center', color: '#78909c' }}>No products listed yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLoans = () => (
    <>
      <div style={{ maxWidth: 560, marginBottom: 20 }}>
        <div style={S.card}>
          <div style={S.cardHeader}>💰 Apply for Loan</div>
          <div style={S.cardBody}>
            {loanMsg && (
              <div style={{ ...S.alert(loanMsg.split(':')[0]), marginBottom: 16 }}>
                {loanMsg.split(':')[1]}
              </div>
            )}
            <form onSubmit={submitLoan} style={S.form}>
              <div>
                <label style={S.label}>Loan Amount (₹)</label>
                <input type="number" style={S.input} placeholder="5000"
                  value={loanAmount} onChange={e => setLoanAmount(e.target.value)} required />
              </div>
              <div>
                <label style={S.label}>Reason</label>
                <textarea style={S.textarea} placeholder="Purpose of loan..."
                  value={loanReason} onChange={e => setLoanReason(e.target.value)} required />
              </div>
              <button type="submit" style={S.btnPrimary}>Submit Application</button>
            </form>
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardHeader}>💰 My Loan History</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                {['Date', 'Bachatgat', 'Requested', 'Approved', 'Paid', 'Status'].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loans.map(loan => (
                <tr key={loan._id}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9fffe'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={S.td}>{new Date(loan.createdAt).toLocaleDateString()}</td>
                  <td style={S.td}>{loan.bachatgat_id?.name || 'N/A'}</td>
                  <td style={S.td}>₹{loan.loan_amount_required}</td>
                  <td style={S.td}>₹{loan.approved_amount || 0}</td>
                  <td style={S.td}>₹{loan.total_paid || 0}</td>
                  <td style={S.td}><span style={S.badge(loan.status)}>{loan.status}</span></td>
                </tr>
              ))}
              {loans.length === 0 && (
                <tr><td colSpan="6" style={{ ...S.td, textAlign: 'center', color: '#78909c' }}>No loan history</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const renderMembers = () => (
    <div style={S.card}>
      <div style={S.cardHeader}>👥 All Members</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={S.table}>
          <thead>
            <tr>
              {['#', 'Name', 'Contact', 'Address', 'Role', 'Status'].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((member, i) => (
              <tr key={member._id}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fffe'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ ...S.td, color: '#78909c' }}>{i + 1}</td>
                <td style={{ ...S.td, fontWeight: 600 }}>{member.name}</td>
                <td style={S.td}>{member.contact_no || 'N/A'}</td>
                <td style={S.td}>{member.address || 'N/A'}</td>
                <td style={S.td}>{member.role}</td>
                <td style={S.td}><span style={S.badge('Approved')}>Active</span></td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr><td colSpan="6" style={{ ...S.td, textAlign: 'center', color: '#78909c' }}>No members found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const PAGE_TITLES = {
    dashboard: { title: 'Member Dashboard', sub: 'Welcome back! Here\'s your activity overview.' },
    myOrders: { title: 'My Orders', sub: 'View all your order history and track status.' },
    addProduct: { title: 'Add Product', sub: 'List a new product for sale in the marketplace.' },
    myProducts: { title: 'My Products', sub: 'Manage all your listed products.' },
    loans: { title: 'Loans', sub: 'Apply for loans and view your loan history.' },
    savings: { title: 'Savings', sub: 'Track your savings and contributions.' },
    members: { title: 'All Members', sub: 'View all members in your Bachatgat group.' },
  };

  const current = PAGE_TITLES[activeNav] || PAGE_TITLES.dashboard;

  return (
    <div style={S.shell}>
      {/* ─── SIDEBAR ─── */}
      <aside style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoIcon}>M</div>
          {sidebarOpen && <span style={S.logoText}>Member</span>}
        </div>

        <nav style={S.navSection}>
          {NAV_ITEMS.map(item => (
            <div key={item.key}
              style={S.navItem(activeNav === item.key)}
              onClick={() => setActiveNav(item.key)}
              title={!sidebarOpen ? item.label : ''}
            >
              <span style={S.navIcon}>{item.icon}</span>
              <span style={S.navLabel}>{item.label}</span>
            </div>
          ))}
        </nav>

        <div style={S.navBottom}>
          <div style={{ ...S.navItem(false), marginBottom: 4 }}>
            <span style={S.navIcon}>⚙️</span>
            <span style={S.navLabel}>Settings</span>
          </div>
          <div style={{ ...S.navItem(false), color: '#c62828' }} onClick={handleLogout}>
            <span style={S.navIcon}>🚪</span>
            <span style={S.navLabel}>Logout</span>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <div style={S.main}>
        <header style={S.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button style={S.toggleBtn} onClick={() => setSidebarOpen(o => !o)}>
              {sidebarOpen ? '◀' : '▶'}
            </button>
            <div style={S.searchBar}>
              <span style={{ fontSize: 14, color: '#78909c' }}>🔍</span>
              <input style={S.searchInput} placeholder="Search..." />
            </div>
          </div>

          <div style={S.topRight}>
            <button style={S.bellBtn}>🔔</button>
            <div style={S.avatar} title={userInfo?.name}>
              {(userInfo?.name || 'M').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div style={S.content}>
          <div style={S.pageTitle}>{current.title}</div>
          <div style={S.pageSub}>{current.sub}</div>

          {activeNav === 'dashboard' && renderDashboard()}
          {activeNav === 'myOrders' && renderMyOrders()}
          {activeNav === 'addProduct' && renderAddProduct()}
          {activeNav === 'myProducts' && renderMyProducts()}
          {activeNav === 'loans' && renderLoans()}
          {activeNav === 'members' && renderMembers()}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
