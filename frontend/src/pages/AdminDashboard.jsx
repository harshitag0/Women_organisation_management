import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/* ─── Tiny bar-chart renderer (no external lib) ─── */
const BarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160, padding: '0 8px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              width: '100%',
              height: `${(d.value / max) * 130}px`,
              background: 'linear-gradient(180deg, #c2185b 0%, #e91e63 100%)',
              borderRadius: '6px 6px 0 0',
              transition: 'height .4s ease',
              opacity: 0.85,
            }}
          />
          <span style={{ fontSize: 10, color: '#9c7b8a', fontWeight: 600 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const memberGrowthData = [
  { label: 'Jul', value: 210 },
  { label: 'Aug', value: 340 },
  { label: 'Sep', value: 280 },
  { label: 'Oct', value: 410 },
  { label: 'Nov', value: 360 },
  { label: 'Dec', value: 430 },
  { label: 'Jan', value: 390 },
  { label: 'Feb', value: 500 },
  { label: 'Mar', value: 480 },
];

const recentActivities = [
  { icon: '👤', title: 'New member joined', desc: 'Sunita Devi from Pune District', time: '2 hours ago', color: '#c2185b' },
  { icon: '📢', title: 'Announcement posted', desc: 'Upcoming health workshop in East Sector', time: '5 hours ago', color: '#ff8a65' },
  { icon: '💬', title: 'Community activity update', desc: '30 new posts in Savings group', time: '1 day ago', color: '#7c4dff' },
  { icon: '🛒', title: 'New order received', desc: 'Order #1042 – Handmade Jewelry set', time: '1 day ago', color: '#00897b' },
];

const mockMembers = [
  { id: 1, name: 'Sunita Devi', village: 'Pune District', phone: '+91 98765 43210', status: 'Active' },
  { id: 2, name: 'Kavita Sharma', village: 'North Valley', phone: '+91 87654 32109', status: 'Pending' },
  { id: 3, name: 'Meena Patil', village: 'West Block', phone: '+91 76543 21098', status: 'Active' },
  { id: 4, name: 'Asha Yadav', village: 'East Sector', phone: '+91 65432 10987', status: 'Active' }
];

const NAV_ITEMS = [
  { key: 'dashboard', icon: '▦', label: 'Dashboard' },
  { key: 'members', icon: '👥', label: 'Members' },
  { key: 'addMember', icon: '➕', label: 'Add Member' },
  { key: 'announcements', icon: '📢', label: 'Announcements' },
  { key: 'statistics', icon: '📊', label: 'Statistics' },
  { key: 'events', icon: '📅', label: 'Post Events' },
];

const AdminDashboard = () => {

  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* Event form state  */
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [eventMsg, setEventMsg] = useState('');

  /* Announcement form */
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');
  const [annMsg, setAnnMsg] = useState('');

  /* Add member form */
  const [memName, setMemName] = useState('');
  const [memVillage, setMemVillage] = useState('');
  const [memPhone, setMemPhone] = useState('');
  const [memMsg, setMemMsg] = useState('');

  // Members state and fetch
  const [members, setMembers] = useState([]);
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
        const { data } = await axios.get('/api/members', config);
        setMembers(data);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchMembers();
  }, [userInfo]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const submitEvent = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo?.token}` } };
      await axios.post('/api/events', { title, description, date, location }, config);
      setEventMsg('success:Event posted successfully!');
      setTitle(''); setDescription(''); setDate(''); setLocation('');
    } catch (err) {
      setEventMsg('error:' + (err.response?.data?.message || 'Error posting event'));
    }
  };

  const submitAnnouncement = async (e) => {
    e.preventDefault();
    setAnnMsg(''); // Clear previous messages
    try {
      const config = { 
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${userInfo?.token}` 
        } 
      };
      
      const announcementData = {
        title: annTitle,
        message: annBody
      };
      
      await axios.post('/api/announcements', announcementData, config);
      
      setAnnMsg('success:Announcement published successfully!');
      setAnnTitle(''); 
      setAnnBody('');
      
      // Optionally show success for 3 seconds
      setTimeout(() => {
        setAnnMsg('');
      }, 3000);
    } catch (err) {
      setAnnMsg('error:' + (err.response?.data?.message || 'Error publishing announcement'));
    }
  };

  const submitMember = async (e) => {
    e.preventDefault();
    setMemMsg(''); // Clear previous messages
    try {
      const config = { 
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${userInfo?.token}` 
        } 
      };
      
      // Generate username from name (lowercase, no spaces)
      const username = memName.toLowerCase().replace(/\s+/g, '');
      
      const memberData = {
        name: memName,
        address: memVillage,
        contact_no: memPhone,
        username: username,
        password: 'member123' // Default password
      };
      
      await axios.post('/api/members', memberData, config);
      
      setMemMsg('success:Member added successfully!');
      setMemName(''); 
      setMemVillage(''); 
      setMemPhone('');
      
      // Refresh members list
      const { data } = await axios.get('/api/members', config);
      setMembers(data);
      
      // Optionally switch to members view after 2 seconds
      setTimeout(() => {
        setActiveNav('members');
      }, 2000);
    } catch (err) {
      setMemMsg('error:' + (err.response?.data?.message || 'Error adding member'));
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
      borderRight: '1.5px solid #f0d6e0',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width .28s ease',
      overflow: 'hidden',
      flexShrink: 0,
      boxShadow: '2px 0 16px rgba(194,24,91,0.05)',
      position: 'sticky',
      top: 0,
      height: '100vh',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '24px 18px 18px',
      borderBottom: '1.5px solid #f0d6e0',
    },
    logoIcon: {
      width: 36,
      height: 36,
      background: 'linear-gradient(135deg, #c2185b, #e91e63)',
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
      color: '#3a1a2e',
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
      background: active ? 'linear-gradient(90deg, #fce4ec, #fff)' : 'transparent',
      color: active ? '#c2185b' : '#5d3a4a',
      fontWeight: active ? 700 : 500,
      fontSize: 13.5,
      transition: '.18s',
      border: active ? '1.5px solid #f8bbd0' : '1.5px solid transparent',
      whiteSpace: 'nowrap',
    }),
    navIcon: { fontSize: 16, flexShrink: 0 },
    navLabel: { opacity: sidebarOpen ? 1 : 0, transition: 'opacity .2s' },
    navBottom: { padding: '12px 10px 20px', borderTop: '1.5px solid #f0d6e0' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
    topbar: {
      background: '#fff',
      borderBottom: '1.5px solid #f0d6e0',
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
      background: '#fce4ec22',
      border: '1.5px solid #f8bbd0',
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
      color: '#3a1a2e',
      width: '100%',
    },
    topRight: { display: 'flex', alignItems: 'center', gap: 16 },
    bellBtn: {
      width: 36, height: 36, borderRadius: 50,
      background: '#fce4ec',
      border: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 16, cursor: 'pointer',
    },
    avatar: {
      width: 36, height: 36, borderRadius: 50,
      background: 'linear-gradient(135deg,#c2185b,#e91e63)',
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: 14, cursor: 'pointer',
    },
    content: { padding: '28px 28px 48px', flex: 1, overflowY: 'auto' },
    pageTitle: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 800, fontSize: 26, color: '#3a1a2e', marginBottom: 4,
    },
    pageSub: { fontSize: 13, color: '#9c7b8a', marginBottom: 28 },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))',
      gap: 18, marginBottom: 28,
    },
    statCard: (accent) => ({
      background: '#fff',
      borderRadius: 16,
      padding: '22px 24px',
      border: '1.5px solid #f0d6e0',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      transition: '.2s',
    }),
    statNum: (accent) => ({
      fontFamily: "'Playfair Display', serif",
      fontSize: 32, fontWeight: 800, color: accent, marginBottom: 2,
    }),
    statLabel: { fontSize: 12, color: '#9c7b8a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 },
    statSub: { fontSize: 11, color: '#bbb', marginTop: 6 },
    statIcon: (accent) => ({
      width: 40, height: 40, borderRadius: 10,
      background: accent + '18',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 18, marginBottom: 12,
    }),
    twoCol: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 28 },
    card: {
      background: '#fff', borderRadius: 16,
      border: '1.5px solid #f0d6e0',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    },
    cardHeader: {
      padding: '16px 22px',
      borderBottom: '1.5px solid #f0d6e0',
      fontWeight: 700, fontSize: 14.5, color: '#3a1a2e',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    cardBody: { padding: 22 },
    activityItem: {
      display: 'flex', gap: 14, padding: '13px 0',
      borderBottom: '1px solid #fce4ec',
    },
    actIconWrap: (color) => ({
      width: 36, height: 36, borderRadius: 50,
      background: color + '18',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 15, flexShrink: 0,
    }),
    actTitle: { fontWeight: 700, fontSize: 13, color: '#3a1a2e' },
    actDesc: { fontSize: 12, color: '#9c7b8a', marginTop: 1 },
    actTime: { fontSize: 11, color: '#bbb', marginTop: 2 },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
      padding: '10px 14px', textAlign: 'left',
      fontSize: 11, fontWeight: 700, color: '#9c7b8a',
      textTransform: 'uppercase', letterSpacing: .8,
      borderBottom: '1.5px solid #f0d6e0',
    },
    td: {
      padding: '12px 14px', fontSize: 13.5, color: '#3a1a2e',
      borderBottom: '1px solid #fce4ec',
    },
    badge: (status) => ({
      display: 'inline-block', padding: '3px 12px',
      borderRadius: 40, fontSize: 11, fontWeight: 700,
      background: status === 'Active' ? '#e6f7f3' : '#fff3e0',
      color: status === 'Active' ? '#00897b' : '#ef6c00',
    }),
    profileLink: {
      color: '#c2185b', fontWeight: 600, fontSize: 12,
      textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none',
    },
    form: { display: 'flex', flexDirection: 'column', gap: 14 },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
    label: { fontSize: 12, fontWeight: 700, color: '#5d3a4a', marginBottom: 4, display: 'block' },
    input: {
      width: '100%', padding: '10px 14px',
      border: '1.5px solid #f0d6e0', borderRadius: 10,
      fontSize: 13.5, color: '#3a1a2e', outline: 'none',
      background: '#fff8f5', fontFamily: 'inherit',
      transition: '.15s',
    },
    textarea: {
      width: '100%', padding: '10px 14px',
      border: '1.5px solid #f0d6e0', borderRadius: 10,
      fontSize: 13.5, color: '#3a1a2e', outline: 'none',
      background: '#fff8f5', fontFamily: 'inherit',
      resize: 'vertical', minHeight: 80,
    },
    btnPrimary: {
      background: 'linear-gradient(135deg,#c2185b,#e91e63)',
      color: '#fff', border: 'none', borderRadius: 10,
      padding: '11px 28px', fontWeight: 700, fontSize: 14,
      cursor: 'pointer', transition: '.18s', display: 'inline-flex',
      alignItems: 'center', gap: 8,
    },
    alert: (type) => ({
      padding: '10px 16px', borderRadius: 10, fontSize: 13,
      background: type === 'success' ? '#e6f7f3' : '#fce4ec',
      color: type === 'success' ? '#00897b' : '#c2185b',
      border: `1px solid ${type === 'success' ? '#b2dfdb' : '#f8bbd0'}`,
    }),
    toggleBtn: {
      background: 'none', border: 'none', cursor: 'pointer',
      padding: '6px 8px', borderRadius: 8, color: '#5d3a4a',
      fontSize: 18,
    },
  };

  /* ─── Subviews ─── */
  const renderDashboard = () => (
    <>
      {/* Stats */}
      <div style={S.statsGrid}>
        {[
          { label: 'Total Members', value: '4,821', sub: '+12% from last month', icon: '👥', accent: '#c2185b' },
          { label: 'Active Members', value: '3,104', sub: 'Currently engaged', icon: '✅', accent: '#00897b' },
          { label: 'New Members', value: '156', sub: 'Joined this week', icon: '🌟', accent: '#7c4dff' },
          { label: 'Community Posts', value: '12,490', sub: 'Total discussions', icon: '💬', accent: '#ff8a65' },
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

      {/* Chart + Activity */}
      <div style={S.twoCol}>
        <div style={S.card}>
          <div style={S.cardHeader}>
            📈 Member Growth
            <span style={{ fontSize: 11, color: '#9c7b8a', fontWeight: 500 }}>Last 9 months</span>
          </div>
          <div style={{ ...S.cardBody, paddingBottom: 16 }}>
            <BarChart data={memberGrowthData} />
          </div>
        </div>

        <div style={S.card}>
          <div style={S.cardHeader}>⚡ Recent Activity</div>
          <div style={{ ...S.cardBody, padding: '6px 18px' }}>
            {recentActivities.map((a, i) => (
              <div key={i} style={{ ...S.activityItem, borderBottom: i === recentActivities.length - 1 ? 'none' : '1px solid #fce4ec' }}>
                <div style={S.actIconWrap(a.color)}>{a.icon}</div>
                <div>
                  <div style={S.actTitle}>{a.title}</div>
                  <div style={S.actDesc}>{a.desc}</div>
                  <div style={S.actTime}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Members table */}
      <div style={S.card}>
        <div style={S.cardHeader}>
          👥 Recently Added Members
          <button style={{ ...S.btnPrimary, padding: '7px 16px', fontSize: 12 }}
            onClick={() => setActiveNav('addMember')}>
            + Add Member
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead>
              <tr>
                {['Name', 'Village', 'Phone', 'Status', 'Actions'].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockMembers.map(m => (
                <tr key={m.id}
                  onMouseEnter={e => e.currentTarget.style.background = '#fff8f5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ ...S.td, fontWeight: 600 }}>{m.name}</td>
                  <td style={S.td}>{m.village}</td>
                  <td style={S.td}>{m.phone}</td>
                  <td style={S.td}><span style={S.badge(m.status)}>{m.status}</span></td>
                  <td style={S.td}>
                    <button style={S.profileLink}>View Profile</button>
                  </td>
                </tr>
              ))}
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
              {['#', 'Name', 'Village', 'Phone', 'Status', 'Actions'].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={m._id || m.id}
                onMouseEnter={e => e.currentTarget.style.background = '#fff8f5'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ ...S.td, color: '#9c7b8a' }}>{i + 1}</td>
                <td style={{ ...S.td, fontWeight: 600 }}>{m.name}</td>
                <td style={S.td}>{m.address || m.village || '-'}</td>
                <td style={S.td}>{m.contact_no || m.phone || '-'}</td>
                <td style={S.td}><span style={S.badge(m.status || 'Active')}>{m.status || 'Active'}</span></td>
                <td style={S.td}>
                  <button style={S.profileLink}>View</button>{' '}
                  <button style={{ ...S.profileLink, color: '#e91e63' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAddMember = () => (
    <div style={{ maxWidth: 560 }}>
      <div style={S.card}>
        <div style={S.cardHeader}>➕ Add New Member</div>
        <div style={S.cardBody}>
          {memMsg && (
            <div style={{ ...S.alert(memMsg.split(':')[0]), marginBottom: 16 }}>
              {memMsg.split(':')[1]}
            </div>
          )}
          <form onSubmit={submitMember} style={S.form}>
            <div>
              <label style={S.label}>Full Name</label>
              <input style={S.input} placeholder="Enter member's full name"
                value={memName} onChange={e => setMemName(e.target.value)} required />
            </div>
            <div>
              <label style={S.label}>Village / District</label>
              <input style={S.input} placeholder="Village or district name"
                value={memVillage} onChange={e => setMemVillage(e.target.value)} required />
            </div>
            <div>
              <label style={S.label}>Phone Number</label>
              <input style={S.input} placeholder="+91 XXXXX XXXXX"
                value={memPhone} onChange={e => setMemPhone(e.target.value)} required />
            </div>
            <button type="submit" style={S.btnPrimary}>Add Member</button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div style={{ maxWidth: 560 }}>
      <div style={S.card}>
        <div style={S.cardHeader}>📢 Post Announcement</div>
        <div style={S.cardBody}>
          {annMsg && (
            <div style={{ ...S.alert(annMsg.split(':')[0]), marginBottom: 16 }}>
              {annMsg.split(':')[1]}
            </div>
          )}
          <form onSubmit={submitAnnouncement} style={S.form}>
            <div>
              <label style={S.label}>Announcement Title</label>
              <input style={S.input} placeholder="e.g. Health Workshop in East Sector"
                value={annTitle} onChange={e => setAnnTitle(e.target.value)} required />
            </div>
            <div>
              <label style={S.label}>Message</label>
              <textarea style={S.textarea} placeholder="Write your announcement here..."
                value={annBody} onChange={e => setAnnBody(e.target.value)} required />
            </div>
            <button type="submit" style={S.btnPrimary}>📢 Publish</button>
          </form>
        </div>
      </div>
    </div>
  );

  const renderStatistics = () => (
    <>
      <div style={S.card}>
        <div style={S.cardHeader}>📊 Member Growth Statistics</div>
        <div style={{ ...S.cardBody, paddingBottom: 24 }}>
          <BarChart data={memberGrowthData} />
        </div>
      </div>
      <div style={{ height: 20 }} />
      <div style={{ ...S.statsGrid, gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))' }}>
        {[
          { label: 'This Month', value: '480', accent: '#c2185b' },
          { label: 'Last Month', value: '500', accent: '#7c4dff' },
          { label: 'Q1 Total', value: '1,370', accent: '#00897b' },
          { label: 'Avg / Month', value: '383', accent: '#ff8a65' },
        ].map((s, i) => (
          <div key={i} style={{ ...S.statCard(s.accent), textAlign: 'center' }}>
            <div style={S.statNum(s.accent)}>{s.value}</div>
            <div style={S.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>
    </>
  );

  const renderEvents = () => (
    <div style={{ maxWidth: 560 }}>
      <div style={S.card}>
        <div style={S.cardHeader}>📅 Post New Event / Workshop</div>
        <div style={S.cardBody}>
          {eventMsg && (
            <div style={{ ...S.alert(eventMsg.split(':')[0]), marginBottom: 16 }}>
              {eventMsg.split(':')[1]}
            </div>
          )}
          <form onSubmit={submitEvent} style={S.form}>
            <div>
              <label style={S.label}>Event Title</label>
              <input style={S.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="Workshop / Event name" required />
            </div>
            <div style={S.formRow}>
              <div>
                <label style={S.label}>Date</label>
                <input type="date" style={S.input} value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div>
                <label style={S.label}>Location</label>
                <input style={S.input} value={location} onChange={e => setLocation(e.target.value)} placeholder="Virtual or Physical" />
              </div>
            </div>
            <div>
              <label style={S.label}>Description</label>
              <textarea style={S.textarea} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the event..." />
            </div>
            <button type="submit" style={S.btnPrimary}>🚀 Publish Event</button>
          </form>
        </div>
      </div>
    </div>
  );

  const PAGE_TITLES = {
    dashboard: { title: 'Admin Dashboard', sub: 'Overview of community platform metrics and activities.' },
    members: { title: 'Members', sub: 'View and manage all registered community members.' },
    addMember: { title: 'Add Member', sub: 'Register a new member to the community.' },
    announcements: { title: 'Announcements', sub: 'Publish announcements to the entire community.' },
    statistics: { title: 'Statistics', sub: 'Growth metrics and analytical insights.' },
    events: { title: 'Post Events', sub: 'Create and schedule events and workshops.' },
  };

  const current = PAGE_TITLES[activeNav] || PAGE_TITLES.dashboard;

  return (
    <div style={S.shell}>
      {/* ─── SIDEBAR ─── */}
      <aside style={S.sidebar}>
        {/* Logo */}
        <div style={S.logo}>
          <div style={S.logoIcon}>S</div>
          {sidebarOpen && <span style={S.logoText}>SakhiConnect</span>}
        </div>

        {/* Nav */}
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

        {/* Settings + Logout */}
        <div style={S.navBottom}>
          <div style={{ ...S.navItem(false), marginBottom: 4 }}>
            <span style={S.navIcon}>⚙️</span>
            <span style={S.navLabel}>Settings</span>
          </div>
          <div style={{ ...S.navItem(false), color: '#e91e63' }} onClick={handleLogout}>
            <span style={S.navIcon}>🚪</span>
            <span style={S.navLabel}>Logout</span>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <div style={S.main}>
        {/* Topbar */}
        <header style={S.topbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button style={S.toggleBtn} onClick={() => setSidebarOpen(o => !o)}>
              {sidebarOpen ? '◀' : '▶'}
            </button>
            <div style={S.searchBar}>
              <span style={{ fontSize: 14, color: '#9c7b8a' }}>🔍</span>
              <input style={S.searchInput} placeholder="Search everywhere..." />
            </div>
          </div>

          <div style={S.topRight}>
            <button style={S.bellBtn}>🔔</button>
            <div style={S.avatar} title={userInfo?.name}>
              {(userInfo?.name || 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={S.content}>
          <div style={S.pageTitle}>{current.title}</div>
          <div style={S.pageSub}>{current.sub}</div>

          {activeNav === 'dashboard' && renderDashboard()}
          {activeNav === 'members' && renderMembers()}
          {activeNav === 'addMember' && renderAddMember()}
          {activeNav === 'announcements' && renderAnnouncements()}
          {activeNav === 'statistics' && renderStatistics()}
          {activeNav === 'events' && renderEvents()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
