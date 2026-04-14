import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/* ─── Minimal SVG icon set ─── */
const Icon = ({ d, size = 16, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Icons = {
  dashboard:   'M3 12L12 3L21 12V20A1 1 0 0 1 20 21H15V16H9V21H4A1 1 0 0 1 3 20Z',
  members:     'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  addMember:   'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6',
  announce:    'M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zM13.73 21a2 2 0 0 1-3.46 0',
  stats:       'M18 20V10M12 20V4M6 20v-6',
  events:      'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  settings:    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  logout:      'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  bell:        'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
  search:      'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  users:       'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  savings:     'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93V18h-2v-1.07C8.08 16.49 6 14.45 6 12h2c0 1.1.9 2 2 2h4c.55 0 1-.45 1-1 0-.55-.45-1-1-1h-4c-1.66 0-3-1.34-3-3 0-1.94 1.49-3.56 3.44-3.93V4h2v1.07C13.92 5.51 16 7.55 16 10h-2c0-1.1-.9-2-2-2H8c-.55 0-1 .45-1 1 0 .55.45 1 1 1h4c1.66 0 3 1.34 3 3 0 1.94-1.49 3.56-3.44 3.93z',
  new:         'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v8M8 12h8',
  product:     'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
  growth:      'M23 6l-9.5 9.5-5-5L1 18',
  activity:    'M22 12h-4l-3 9L9 3l-3 9H1',
  trend:       'M17 7l-9.8 9.8M3 7h4v4',
  role:        'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  view:        'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  close:       'M18 6L6 18M6 6l12 12',
};

/* ─── Bar chart ─── */
const BarChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 150, padding: '0 4px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: '100%', height: `${Math.max((d.value / max) * 120, 3)}px`, background: 'linear-gradient(180deg,#c2185b,#e91e63)', borderRadius: '4px 4px 0 0', transition: 'height .4s ease' }} />
          <span style={{ fontSize: 10, color: '#999', fontWeight: 600, letterSpacing: .3 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const NAV_ITEMS = [
  { key: 'dashboard',     icon: 'dashboard',   label: 'Dashboard'      },
  { key: 'members',       icon: 'members',     label: 'Members'        },
  { key: 'addMember',     icon: 'addMember',   label: 'Add Member'     },
  { key: 'announcements', icon: 'announce',    label: 'Announcements'  },
  { key: 'statistics',    icon: 'stats',       label: 'Statistics'     },
  { key: 'events',        icon: 'events',      label: 'Post Events'    },
];

const ROLE_COLOR = { President: '#7c4dff', Secretary: '#00897b', Treasurer: '#e65100', Member: '#c2185b' };

const AdminDashboard = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({ totalMembers: 0, activeMembers: 0, newMembersThisWeek: 0, totalProducts: 0, totalAnnouncements: 0, totalEvents: 0, monthlyGrowth: [], recentAnnouncements: [], recentMembers: [] });
  const [statsLoading, setStatsLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [eventMsg, setEventMsg] = useState('');

  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');
  const [annMsg, setAnnMsg] = useState('');

  const [memName, setMemName] = useState('');
  const [memVillage, setMemVillage] = useState('');
  const [memPhone, setMemPhone] = useState('');
  const [memAge, setMemAge] = useState('');
  const [memGroupRole, setMemGroupRole] = useState('Member');
  const [memSavings, setMemSavings] = useState('');
  const [memMsg, setMemMsg] = useState('');

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const { data } = await axios.get('/api/stats');
      setStats(data);
    } catch { } finally { setStatsLoading(false); }
  };

  const fetchMembers = async () => {
    if (!userInfo?.token) return;
    try {
      setMembersLoading(true);
      setMembersError('');
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/members', config);
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      setMembersError(err.response?.data?.message || 'Failed to load members. Please try again.');
    } finally {
      setMembersLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { if (userInfo) fetchMembers(); }, [userInfo]);

  const totalSavings = members.reduce((s, m) => s + (m.savings || 0), 0);
  const avgSavings   = members.length ? Math.round(totalSavings / members.length) : 0;

  const handleLogout = () => { logout(); navigate('/login'); };

  const openProfile = async (memberId) => {
    setProfileLoading(true);
    setSelectedMember(null);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      const { data } = await axios.get(`/api/members/${memberId}`, config);
      setSelectedMember(data);
    } catch { } finally { setProfileLoading(false); }
  };

  const filteredMembers = members.filter(m =>
    m.name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.contact_no?.includes(memberSearch) ||
    (m.group_role || '').toLowerCase().includes(memberSearch.toLowerCase())
  );

  const submitEvent = async (e) => {
    e.preventDefault();
    try {
      const cfg = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo?.token}` } };
      await axios.post('/api/events', { title, description, date, location }, cfg);
      setEventMsg('success:Event published successfully.');
      setTitle(''); setDescription(''); setDate(''); setLocation('');
      fetchStats();
    } catch (err) { setEventMsg('error:' + (err.response?.data?.message || 'Error publishing event')); }
  };

  const submitAnnouncement = async (e) => {
    e.preventDefault(); setAnnMsg('');
    try {
      const cfg = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo?.token}` } };
      await axios.post('/api/announcements', { title: annTitle, message: annBody }, cfg);
      setAnnMsg('success:Announcement published.');
      setAnnTitle(''); setAnnBody('');
      fetchStats();
      setTimeout(() => setAnnMsg(''), 3000);
    } catch (err) { setAnnMsg('error:' + (err.response?.data?.message || 'Error')); }
  };

  const submitMember = async (e) => {
    e.preventDefault(); setMemMsg('');
    try {
      const cfg = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo?.token}` } };
      const username = memName.toLowerCase().replace(/\s+/g, '.') + Date.now().toString().slice(-4);
      await axios.post('/api/members', { name: memName, address: memVillage, contact_no: memPhone, username, password: 'member123', age: memAge ? Number(memAge) : undefined, group_role: memGroupRole, savings: memSavings ? Number(memSavings) : 0 }, cfg);
      setMemMsg('success:Member added successfully.');
      setMemName(''); setMemVillage(''); setMemPhone(''); setMemAge(''); setMemSavings(''); setMemGroupRole('Member');
      fetchMembers(); fetchStats();
      setTimeout(() => setActiveNav('members'), 2000);
    } catch (err) { setMemMsg('error:' + (err.response?.data?.message || 'Error')); }
  };

  const timeAgo = (d) => {
    const diff = Date.now() - new Date(d).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${Math.max(m, 1)} min ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  /* ─── Design tokens ─── */
  const S = {
    shell: { display: 'flex', minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontSize: 13.5, color: '#1f2937' },
    sidebar: { width: sidebarOpen ? 232 : 64, background: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', transition: 'width .25s ease', overflow: 'hidden', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', boxShadow: '2px 0 8px rgba(0,0,0,0.04)' },
    logo: { display: 'flex', alignItems: 'center', gap: 10, padding: '22px 16px 18px', borderBottom: '1px solid #f3f4f6', minWidth: 232 },
    logoMark: { width: 34, height: 34, background: 'linear-gradient(135deg,#c2185b,#e91e63)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0, letterSpacing: '-.5px', boxShadow: '0 2px 8px rgba(194,24,91,0.35)' },
    logoText: { fontWeight: 700, fontSize: 13, color: '#111827', whiteSpace: 'nowrap', lineHeight: 1.3 },
    logoSub: { fontWeight: 500, fontSize: 10.5, color: '#b0b7c3', whiteSpace: 'nowrap' },
    navWrap: { flex: 1, padding: '14px 10px', overflowY: 'auto' },
    navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, cursor: 'pointer', marginBottom: 3, background: active ? '#fdf2f8' : 'transparent', color: active ? '#c2185b' : '#6b7280', fontWeight: active ? 700 : 500, fontSize: 13, border: active ? '1px solid #fbcfe8' : '1px solid transparent', transition: '.15s', whiteSpace: 'nowrap' }),
    navIconWrap: (active) => ({ width: 18, height: 18, flexShrink: 0, color: active ? '#c2185b' : '#9ca3af' }),
    navFooter: { padding: '10px 10px 22px', borderTop: '1px solid #f3f4f6' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
    topbar: { background: '#fff', borderBottom: '1px solid #e9ecf0', padding: '13px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
    toggleBtn: { background: 'none', border: '1px solid #e5e7eb', borderRadius: 7, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', marginRight: 14 },
    searchWrap: { display: 'flex', alignItems: 'center', gap: 8, background: '#f5f7fa', border: '1px solid #e5e7eb', borderRadius: 9, padding: '8px 14px', width: 280 },
    searchInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: 13, color: '#1f2937', width: '100%', fontFamily: 'inherit' },
    topRight: { display: 'flex', alignItems: 'center', gap: 12 },
    bellBtn: { width: 36, height: 36, borderRadius: 9, background: '#f5f7fa', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280' },
    avatar: { width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#c2185b,#e91e63)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, cursor: 'pointer', flexShrink: 0, boxShadow: '0 2px 8px rgba(194,24,91,0.3)' },
    content: { padding: '28px 32px 64px', flex: 1, overflowY: 'auto' },
    pageTitle: { fontWeight: 800, fontSize: 24, color: '#0f172a', marginBottom: 4, letterSpacing: '-0.5px' },
    pageSub: { fontSize: 13.5, color: '#94a3b8', marginBottom: 28, fontWeight: 500 },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 18, marginBottom: 28 },
    statCard: (accent) => ({ background: '#fff', borderRadius: 14, padding: '22px 22px 18px', border: '1px solid #e9ecf0', borderLeft: `4px solid ${accent}`, transition: 'transform .2s, box-shadow .2s', cursor: 'default', position: 'relative' }),
    statLabel: { fontSize: 10.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 },
    statNum: (accent) => ({ fontWeight: 800, fontSize: 34, color: accent, letterSpacing: '-2px', lineHeight: 1, marginBottom: 10 }),
    statSub: { fontSize: 12, color: '#94a3b8', fontWeight: 500, marginBottom: 12 },
    statTag: (accent) => ({ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, fontSize: 10.5, fontWeight: 700, background: accent + '18', color: accent, letterSpacing: .3 }),
    twoCol: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18, marginBottom: 24 },
    card: { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' },
    cardHeader: { padding: '14px 20px', borderBottom: '1px solid #f3f4f6', fontWeight: 600, fontSize: 13.5, color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    cardBody: { padding: 20 },
    actItem: { display: 'flex', gap: 12, padding: '11px 0', borderBottom: '1px solid #f3f4f6' },
    actDot: (c) => ({ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0, marginTop: 5 }),
    actTitle: { fontWeight: 600, fontSize: 13, color: '#111827' },
    actDesc: { fontSize: 12, color: '#6b7280', marginTop: 1 },
    actTime: { fontSize: 11, color: '#d1d5db', marginTop: 2 },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: .7, borderBottom: '1px solid #f3f4f6', whiteSpace: 'nowrap' },
    td: { padding: '11px 14px', fontSize: 13, color: '#374151', borderBottom: '1px solid #f9fafb' },
    badge: (ok) => ({ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: ok ? '#d1fae5' : '#fef3c7', color: ok ? '#065f46' : '#92400e' }),
    roleBadge: (role) => ({ display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: (ROLE_COLOR[role] || '#c2185b') + '14', color: ROLE_COLOR[role] || '#c2185b', border: `1px solid ${(ROLE_COLOR[role] || '#c2185b')}30` }),
    viewBtn: { background: 'none', border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: '#c2185b', transition: '.15s' },
    form: { display: 'flex', flexDirection: 'column', gap: 14 },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
    label: { fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 4, display: 'block', letterSpacing: '.3px', textTransform: 'uppercase' },
    input: { width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13.5, color: '#111827', fontFamily: 'inherit', background: '#fafafa', outline: 'none', boxSizing: 'border-box', transition: '.15s' },
    textarea: { width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13.5, color: '#111827', fontFamily: 'inherit', background: '#fafafa', outline: 'none', resize: 'vertical', minHeight: 84 },
    select: { width: '100%', padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13.5, color: '#111827', fontFamily: 'inherit', background: '#fafafa', outline: 'none' },
    btnPrimary: { background: 'linear-gradient(135deg,#c2185b,#e91e63)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: '.18s', fontFamily: 'inherit' },
    btnSm: { background: 'linear-gradient(135deg,#c2185b,#e91e63)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' },
    alert: (t) => ({ padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: t === 'success' ? '#d1fae5' : '#fee2e2', color: t === 'success' ? '#065f46' : '#991b1b', border: `1px solid ${t === 'success' ? '#a7f3d0' : '#fca5a5'}` }),
    empty: { textAlign: 'center', padding: '32px 0', color: '#9ca3af', fontSize: 13 },
    /* Modal */
    overlay: { position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
    modal: { background: '#fff', borderRadius: 16, width: '100%', maxWidth: 500, maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: '1px solid #e5e7eb' },
    modalHead: { padding: '18px 24px 14px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    modalClose: { background: 'none', border: '1px solid #e5e7eb', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280' },
    modalBody: { padding: '22px 24px 28px' },
    profileRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f9fafb' },
    profileKey: { fontSize: 11, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .6 },
    profileVal: { fontSize: 13.5, color: '#111827', fontWeight: 600, textAlign: 'right' },
  };

  /* ─── Profile Modal ─── */
  const ProfileModal = () => {
    if (!selectedMember && !profileLoading) return null;
    const m = selectedMember;
    const srNo = m ? members.findIndex(x => x._id === m._id) + 1 : '—';
    return (
      <div style={S.overlay} onClick={() => setSelectedMember(null)}>
        <div style={S.modal} onClick={e => e.stopPropagation()}>
          <div style={S.modalHead}>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>Member Profile</span>
            <button style={S.modalClose} onClick={() => setSelectedMember(null)}>
              <Icon d={Icons.close} size={14} />
            </button>
          </div>
          <div style={S.modalBody}>
            {profileLoading ? (
              <div style={S.empty}>Loading…</div>
            ) : m ? (
              <>
                {/* Avatar + name block */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, paddingBottom: 18, borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#c2185b,#e91e63)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22, flexShrink: 0 }}>
                    {m.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: '#111827', marginBottom: 5 }}>{m.name}</div>
                    <span style={S.roleBadge(m.group_role || 'Member')}>{m.group_role || 'Member'}</span>
                  </div>
                </div>

                {/* Info rows */}
                {[
                  ['Sr. No',       srNo],
                  ['Mobile',       m.contact_no || '—'],
                  ['Age',          m.age ? `${m.age} years` : '—'],
                  ['Address',      m.address || '—'],
                  ['Savings',      m.savings !== undefined ? `Rs. ${m.savings.toLocaleString('en-IN')}` : '—'],
                  ['Username',     m.username || '—'],
                  ['Joined',       m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'],
                  ['Status',       'Active'],
                ].map(([k, v], i, arr) => (
                  <div key={k} style={{ ...S.profileRow, borderBottom: i === arr.length - 1 ? 'none' : '1px solid #f9fafb' }}>
                    <span style={S.profileKey}>{k}</span>
                    <span style={S.profileVal}>
                      {k === 'Status' ? <span style={S.badge(true)}>Active</span> : v}
                    </span>
                  </div>
                ))}

                {/* Savings progress */}
                {m.savings !== undefined && (
                  <div style={{ marginTop: 20, background: '#fdf2f8', borderRadius: 10, padding: '14px 16px', border: '1px solid #fbcfe8' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: .6, marginBottom: 8 }}>Savings Progress</div>
                    <div style={{ background: '#f3e8ef', borderRadius: 99, height: 8, overflow: 'hidden', marginBottom: 6 }}>
                      <div style={{ height: '100%', width: `${Math.min((m.savings / 15000) * 100, 100)}%`, background: 'linear-gradient(90deg,#c2185b,#e91e63)', borderRadius: 99, transition: 'width .5s' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}>
                      <span>Rs. 0</span>
                      <span style={{ fontWeight: 700, color: '#c2185b' }}>Rs. {m.savings.toLocaleString('en-IN')}</span>
                      <span>Rs. 15,000</span>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  /* ─── Dashboard ─── */
  const renderDashboard = () => (
    <>
      <div style={S.statsGrid}>
        {[
          { label: 'Total Members',   value: statsLoading ? '—' : stats.totalMembers,                    accent: '#c2185b', sub: 'Registered in group',   tag: 'Active Group'  },
          { label: 'Announcements',   value: statsLoading ? '—' : (stats.totalAnnouncements ?? 0),        accent: '#0891b2', sub: 'Published to members',  tag: 'Community'     },
          { label: 'Upcoming Events', value: statsLoading ? '—' : (stats.totalEvents ?? 0),               accent: '#7c4dff', sub: 'Events scheduled',      tag: 'Scheduled'     },
          { label: 'Total Products',  value: statsLoading ? '—' : stats.totalProducts,                   accent: '#e65100', sub: 'In marketplace',        tag: 'Marketplace'   },
        ].map((s, i) => (
          <div key={i} style={S.statCard(s.accent)}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
          >
            <div style={S.statLabel}>{s.label}</div>
            <div style={S.statNum(s.accent)}>{s.value}</div>
            <div style={S.statSub}>{s.sub}</div>
            <span style={S.statTag(s.accent)}>{s.tag}</span>
          </div>
        ))}
      </div>

      <div style={S.twoCol}>
        <div style={S.card}>
          <div style={S.cardHeader}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon d={Icons.growth} size={14} stroke="#c2185b" /> Member Growth
            </span>
            <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 400 }}>Last 9 months</span>
          </div>
          <div style={{ ...S.cardBody, paddingBottom: 8 }}>
            {stats.monthlyGrowth.length > 0
              ? <BarChart data={stats.monthlyGrowth} />
              : <div style={S.empty}>No growth data yet</div>}
          </div>
        </div>

        <div style={S.card}>
          <div style={S.cardHeader}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Icon d={Icons.activity} size={14} stroke="#c2185b" /> Recent Activity</span>
          </div>
          <div style={{ padding: '4px 18px' }}>
            {(stats.recentMembers || []).slice(0, 2).map((m, i) => (
              <div key={'m'+i} style={{ ...S.actItem }}>
                <div style={S.actDot('#c2185b')} />
                <div>
                  <div style={S.actTitle}>Member joined</div>
                  <div style={S.actDesc}>{m.name}{m.address ? ` · ${m.address}` : ''}</div>
                  <div style={S.actTime}>{timeAgo(m.createdAt)}</div>
                </div>
              </div>
            ))}
            {(stats.recentAnnouncements || []).slice(0, 3).map((a, i, arr) => (
              <div key={'a'+i} style={{ ...S.actItem, borderBottom: i === arr.length - 1 ? 'none' : '1px solid #f3f4f6' }}>
                <div style={S.actDot('#e65100')} />
                <div>
                  <div style={S.actTitle}>Announcement</div>
                  <div style={S.actDesc}>{a.title}</div>
                  <div style={S.actTime}>{timeAgo(a.createdAt)}</div>
                </div>
              </div>
            ))}
            {(!stats.recentMembers?.length && !stats.recentAnnouncements?.length) && <div style={S.empty}>No recent activity</div>}
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardHeader}>
          Recently Added Members
          <button style={S.btnSm} onClick={() => setActiveNav('addMember')}>Add Member</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={S.table}>
            <thead><tr>{['Name','Role','Mobile','Savings','Action'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {!(stats.recentMembers?.length)
                ? <tr><td colSpan={5} style={{ ...S.td, textAlign: 'center', color: '#9ca3af' }}>No members yet</td></tr>
                : (stats.recentMembers || []).map(m => (
                  <tr key={m._id} onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={{ ...S.td, fontWeight: 600 }}>{m.name}</td>
                    <td style={S.td}><span style={S.roleBadge(m.group_role || 'Member')}>{m.group_role || 'Member'}</span></td>
                    <td style={S.td}>{m.contact_no || '—'}</td>
                    <td style={{ ...S.td, fontWeight: 600, color: '#00897b' }}>Rs. {(m.savings || 0).toLocaleString('en-IN')}</td>
                    <td style={S.td}><button style={S.viewBtn} onClick={() => openProfile(m._id)}>View</button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  /* ─── Members ─── */
  const renderMembers = () => (
    <div style={S.card}>
      <div style={S.cardHeader}>
        All Members
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>{filteredMembers.length} members</span>
          <span style={{ fontSize: 12, color: '#00897b', fontWeight: 700 }}>Total: Rs. {totalSavings.toLocaleString('en-IN')}</span>
        </div>
      </div>
      <div style={{ padding: '12px 20px', borderBottom: '1px solid #f3f4f6' }}>
        <input style={{ ...S.input, maxWidth: 300 }} placeholder="Search by name, mobile or role…"
          value={memberSearch} onChange={e => setMemberSearch(e.target.value)} />
      </div>
      <div style={{ overflowX: 'auto' }}>
        {membersLoading ? (
          <div style={{ ...S.empty, padding: '40px 0' }}>
            <div style={{ display: 'inline-block', width: 28, height: 28, border: '3px solid #f3e8ef', borderTop: '3px solid #c2185b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 10 }} />
            <div>Loading members…</div>
          </div>
        ) : membersError ? (
          <div style={{ padding: '24px 20px' }}>
            <div style={{ ...S.alert('error'), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{membersError}</span>
              <button style={{ ...S.btnSm, marginLeft: 12 }} onClick={fetchMembers}>Retry</button>
            </div>
          </div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>{['#','Name','Role','Age','Mobile','Savings (Rs.)','Status','Action'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0
                ? <tr><td colSpan={8} style={{ ...S.td, textAlign: 'center', color: '#9ca3af', padding: '32px 0' }}>{memberSearch ? 'No members match your search.' : 'No members found. Add your first member!'}</td></tr>
                : filteredMembers.map((m, i) => (
                  <tr key={m._id} onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                    <td style={{ ...S.td, color: '#9ca3af', fontSize: 12 }}>{i + 1}</td>
                    <td style={{ ...S.td, fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#c2185b,#e91e63)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
                          {m.name?.charAt(0).toUpperCase()}
                        </div>
                        {m.name}
                      </div>
                    </td>
                    <td style={S.td}><span style={S.roleBadge(m.group_role || 'Member')}>{m.group_role || 'Member'}</span></td>
                    <td style={S.td}>{m.age || '—'}</td>
                    <td style={S.td}>{m.contact_no || '—'}</td>
                    <td style={{ ...S.td, fontWeight: 700, color: '#00897b' }}>Rs. {(m.savings || 0).toLocaleString('en-IN')}</td>
                    <td style={S.td}><span style={S.badge(true)}>Active</span></td>
                    <td style={S.td}><button style={S.viewBtn} onClick={() => openProfile(m._id)}>View</button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  /* ─── Add Member ─── */
  const renderAddMember = () => (
    <div style={{ maxWidth: 540 }}>
      <div style={S.card}>
        <div style={S.cardHeader}>Add New Member</div>
        <div style={S.cardBody}>
          {memMsg && <div style={{ ...S.alert(memMsg.split(':')[0]), marginBottom: 14 }}>{memMsg.split(':')[1]}</div>}
          <form onSubmit={submitMember} style={S.form}>
            <div><label style={S.label}>Full Name</label><input style={S.input} value={memName} onChange={e => setMemName(e.target.value)} placeholder="Member full name" required /></div>
            <div style={S.formRow}>
              <div><label style={S.label}>Age</label><input type="number" style={S.input} value={memAge} onChange={e => setMemAge(e.target.value)} placeholder="e.g. 32" /></div>
              <div><label style={S.label}>Mobile Number</label><input style={S.input} value={memPhone} onChange={e => setMemPhone(e.target.value)} placeholder="10-digit mobile" /></div>
            </div>
            <div style={S.formRow}>
              <div>
                <label style={S.label}>Role in Group</label>
                <select style={S.select} value={memGroupRole} onChange={e => setMemGroupRole(e.target.value)}>
                  <option>Member</option><option>President</option><option>Secretary</option><option>Treasurer</option>
                </select>
              </div>
              <div><label style={S.label}>Savings (Rs.)</label><input type="number" style={S.input} value={memSavings} onChange={e => setMemSavings(e.target.value)} placeholder="e.g. 8500" /></div>
            </div>
            <div><label style={S.label}>Village / District</label><input style={S.input} value={memVillage} onChange={e => setMemVillage(e.target.value)} placeholder="Village or district" /></div>
            <button type="submit" style={S.btnPrimary}>Add Member</button>
          </form>
        </div>
      </div>
    </div>
  );

  /* ─── Announcements ─── */
  const renderAnnouncements = () => (
    <div style={{ maxWidth: 540 }}>
      <div style={S.card}>
        <div style={S.cardHeader}>Post Announcement</div>
        <div style={S.cardBody}>
          {annMsg && <div style={{ ...S.alert(annMsg.split(':')[0]), marginBottom: 14 }}>{annMsg.split(':')[1]}</div>}
          <form onSubmit={submitAnnouncement} style={S.form}>
            <div><label style={S.label}>Title</label><input style={S.input} value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder="Announcement title" required /></div>
            <div><label style={S.label}>Message</label><textarea style={S.textarea} value={annBody} onChange={e => setAnnBody(e.target.value)} placeholder="Write your announcement…" required /></div>
            <button type="submit" style={S.btnPrimary}>Publish Announcement</button>
          </form>
        </div>
      </div>
    </div>
  );

  /* ─── Statistics ─── */
  const renderStatistics = () => {
    const roleCount = (r) => members.filter(m => m.group_role === r).length;
    const growth = stats.monthlyGrowth || [];
    const thisMonth = growth[growth.length - 1]?.value ?? 0;
    const lastMonth  = growth[growth.length - 2]?.value ?? 0;
    const avg = growth.length ? Math.round(growth.reduce((s, d) => s + d.value, 0) / growth.length) : 0;
    return (
      <>
        <div style={S.statsGrid}>
          {[
            { label: 'Total Members',   value: members.length,                                            accent: '#c2185b' },
            { label: 'Total Savings',   value: `Rs. ${totalSavings.toLocaleString('en-IN')}`,            accent: '#00897b' },
            { label: 'Average Savings', value: `Rs. ${avgSavings.toLocaleString('en-IN')}`,              accent: '#7c4dff' },
            { label: 'Highest Savings', value: `Rs. ${Math.max(...members.map(m => m.savings || 0), 0).toLocaleString('en-IN')}`, accent: '#e65100' },
          ].map((s, i) => (
            <div key={i} style={S.statCard}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}>
              <div style={S.statLabel}>{s.label}</div>
              <div style={S.statNum(s.accent)}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ ...S.card, marginBottom: 18 }}>
          <div style={S.cardHeader}>Group Roles Breakdown</div>
          <div style={{ padding: '18px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 12 }}>
            {['President','Secretary','Treasurer','Member'].map(role => (
              <div key={role} style={{ background: (ROLE_COLOR[role]) + '0d', borderRadius: 10, padding: '14px 16px', border: `1px solid ${ROLE_COLOR[role] || '#e5e7eb'}25`, textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: ROLE_COLOR[role], letterSpacing: '-1px' }}>{roleCount(role)}</div>
                <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, marginTop: 3 }}>{role}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...S.card, marginBottom: 18 }}>
          <div style={S.cardHeader}>Member Growth — Last 9 Months</div>
          <div style={{ ...S.cardBody, paddingBottom: 8 }}>
            {growth.length > 0 ? <BarChart data={growth} /> : <div style={S.empty}>No growth data yet</div>}
          </div>
        </div>

        <div style={{ ...S.statsGrid, gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))' }}>
          {[
            { label: 'This Month',    value: thisMonth, accent: '#c2185b' },
            { label: 'Last Month',    value: lastMonth, accent: '#7c4dff' },
            { label: 'Avg / Month',   value: avg,       accent: '#00897b' },
          ].map((s, i) => (
            <div key={i} style={{ ...S.statCard, textAlign: 'center' }}>
              <div style={S.statNum(s.accent)}>{s.value}</div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </>
    );
  };

  /* ─── Events ─── */
  const renderEvents = () => (
    <div style={{ maxWidth: 540 }}>
      <div style={S.card}>
        <div style={S.cardHeader}>Post New Event</div>
        <div style={S.cardBody}>
          {eventMsg && <div style={{ ...S.alert(eventMsg.split(':')[0]), marginBottom: 14 }}>{eventMsg.split(':')[1]}</div>}
          <form onSubmit={submitEvent} style={S.form}>
            <div><label style={S.label}>Event Title</label><input style={S.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Monthly Group Meeting" required /></div>
            <div style={S.formRow}>
              <div><label style={S.label}>Date</label><input type="date" style={S.input} value={date} onChange={e => setDate(e.target.value)} required /></div>
              <div><label style={S.label}>Location</label><input style={S.input} value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Nagpur Community Hall" /></div>
            </div>
            <div><label style={S.label}>Description</label><textarea style={S.textarea} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the event…" /></div>
            <button type="submit" style={S.btnPrimary}>Publish Event</button>
          </form>
        </div>
      </div>
    </div>
  );

  const PAGE = {
    dashboard:     { title: 'Dashboard',       sub: 'Overview of Krantijyoti Mahila Gat.' },
    members:       { title: 'Members',         sub: membersLoading ? 'Loading members…' : `All ${members.length} registered member${members.length !== 1 ? 's' : ''}.` },
    addMember:     { title: 'Add Member',      sub: 'Register a new member to the group.' },
    announcements: { title: 'Announcements',   sub: 'Publish updates to the community.' },
    statistics:    { title: 'Statistics',      sub: 'Savings, growth and role analytics.' },
    events:        { title: 'Post Events',     sub: 'Schedule events and workshops.' },
  };
  const cur = PAGE[activeNav] || PAGE.dashboard;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
        input, textarea, select, button { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
        input:focus, textarea:focus, select:focus { border-color: #c2185b !important; box-shadow: 0 0 0 3px rgba(194,24,91,0.09); }
        button:hover { opacity: .88; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #dde1e7; border-radius: 10px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={S.shell}>
        {(selectedMember || profileLoading) && <ProfileModal />}

        {/* SIDEBAR */}
        <aside style={S.sidebar}>
          <div style={S.logo}>
            <div style={S.logoMark}>K</div>
            {sidebarOpen && (
              <div>
                <div style={S.logoText}>Krantijyoti Mahila Gat</div>
                <div style={S.logoSub}>Admin Dashboard</div>
              </div>
            )}
          </div>
          <nav style={S.navWrap}>
            {NAV_ITEMS.map(item => (
              <div key={item.key} style={S.navItem(activeNav === item.key)} onClick={() => setActiveNav(item.key)} title={!sidebarOpen ? item.label : ''}>
                <div style={S.navIconWrap(activeNav === item.key)}>
                  <Icon d={Icons[item.icon]} size={16} stroke={activeNav === item.key ? '#c2185b' : '#9ca3af'} />
                </div>
                {sidebarOpen && item.label}
              </div>
            ))}
          </nav>
          <div style={S.navFooter}>
            <div style={{ ...S.navItem(false), marginBottom: 2 }}>
              <div style={S.navIconWrap(false)}><Icon d={Icons.settings} size={16} stroke="#9ca3af" /></div>
              {sidebarOpen && 'Settings'}
            </div>
            <div style={{ ...S.navItem(false), color: '#ef4444' }} onClick={handleLogout}>
              <div style={{ ...S.navIconWrap(false), color: '#ef4444' }}><Icon d={Icons.logout} size={16} stroke="#ef4444" /></div>
              {sidebarOpen && 'Logout'}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div style={S.main}>
          <header style={S.topbar}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button style={S.toggleBtn} onClick={() => setSidebarOpen(o => !o)}>
                <Icon d={sidebarOpen ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} size={14} />
              </button>
              <div style={S.searchWrap}>
                <Icon d={Icons.search} size={14} stroke="#9ca3af" />
                <input style={S.searchInput} placeholder="Search…" />
              </div>
            </div>
            <div style={S.topRight}>
              <div style={S.bellBtn}><Icon d={Icons.bell} size={15} stroke="#6b7280" /></div>
              <div style={S.avatar} title={userInfo?.name}>{(userInfo?.name || 'A').charAt(0).toUpperCase()}</div>
            </div>
          </header>

          <div style={S.content}>
            <div style={S.pageTitle}>{cur.title}</div>
            <div style={S.pageSub}>{cur.sub}</div>
            {activeNav === 'dashboard'     && renderDashboard()}
            {activeNav === 'members'       && renderMembers()}
            {activeNav === 'addMember'     && renderAddMember()}
            {activeNav === 'announcements' && renderAnnouncements()}
            {activeNav === 'statistics'    && renderStatistics()}
            {activeNav === 'events'        && renderEvents()}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
