import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

/* ── SVG Icons ── */
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b06090" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b06090" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b06090" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b06090" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IconEyeOn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b06090" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b06090" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/* ── Field component ── */
const Field = ({ icon, label, type = 'text', placeholder, value, onChange, required = true, extra, rightEl }) => (
  <div style={s.fieldWrap}>
    <label style={s.label}>{label}</label>
    <div style={s.inputRow}
      onFocus={e => { e.currentTarget.style.borderColor = '#c2185b'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(194,24,91,0.08)'; }}
      onBlur={e => { e.currentTarget.style.borderColor = '#e8d0da'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <span style={s.iconWrap}>{icon}</span>
      <input type={type} placeholder={placeholder} value={value}
        onChange={onChange} required={required}
        style={{ ...s.input, ...extra }}
      />
      {rightEl}
    </div>
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const { login, userInfo } = useContext(AuthContext);

  const [tab, setTab] = useState('signin');

  /* sign-in state */
  const [siUser, setSiUser] = useState('');
  const [siPass, setSiPass] = useState('');
  const [siShow, setSiShow] = useState(false);
  const [siErr, setSiErr] = useState('');
  const [siLoad, setSiLoad] = useState(false);

  /* register state */
  const [regName, setRegName] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regRole, setRegRole] = useState('Member');
  const [regShow, setRegShow] = useState(false);
  const [regErr, setRegErr] = useState('');
  const [regOk, setRegOk] = useState('');
  const [regLoad, setRegLoad] = useState(false);

  /* role-specific fields */
  const [regAdminDept, setRegAdminDept] = useState('');
  const [regAdminId, setRegAdminId] = useState('');
  const [regMemberGroup, setRegMemberGroup] = useState('');
  const [regMemberAddr, setRegMemberAddr] = useState('');
  const [regCustAddr, setRegCustAddr] = useState('');
  const [regCustCity, setRegCustCity] = useState('');

  useEffect(() => {
    if (!userInfo) return;
    if (userInfo.role === 'Admin') navigate('/admin');
    else if (userInfo.role === 'Bachatgat') navigate('/bachatgat');
    else if (userInfo.role === 'Member') navigate('/member');
    else navigate('/customer');
  }, [navigate, userInfo]);

  
  const signInHandler = async (e) => {
    e.preventDefault();
    setSiLoad(true); setSiErr('');
    const result = await login(siUser, siPass);
    setSiLoad(false);
    if (!result.success) setSiErr(result.message || 'Invalid credentials.');
  };

  const registerHandler = async (e) => {
    e.preventDefault();
    setRegLoad(true); setRegErr(''); setRegOk('');
    try {
      const payload = {
        name: regName, username: regUser, email: regEmail,
        contact_no: regPhone, password: regPass, role: regRole,
      };

      // Add role-specific fields
      if (regRole === 'Admin') {
        payload.department = regAdminDept;
        payload.official_id = regAdminId;
      } else if (regRole === 'Member') {
        payload.group_name = regMemberGroup;
        payload.address = regMemberAddr;
      }
      // Customer doesn't need extra fields

      await axios.post('/api/auth/register', payload);
      setRegOk('Account created successfully. You can now sign in.');
      setRegName(''); setRegUser(''); setRegEmail('');
      setRegPhone(''); setRegPass('');
      setRegAdminDept(''); setRegAdminId('');
      setRegMemberGroup(''); setRegMemberAddr('');
      setTimeout(() => { setTab('signin'); setRegOk(''); }, 2200);
    } catch (err) {
      setRegErr(err.response?.data?.message || 'Registration failed. Please try again.');
    }
    setRegLoad(false);
  };

  const switchTab = (key) => { setTab(key); setSiErr(''); setRegErr(''); setRegOk(''); };

  return (
    <div style={s.page}>

      {/* ── animated background ── */}
      <div style={s.bgOverlay} />
      <div style={s.blob1} />
      <div style={s.blob2} />
      <div style={s.blob3} />

      {/* ── grid lines ── */}
      <svg style={s.gridSvg} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(194,24,91,0.06)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* ── card ── */}
      <div style={s.card}>

        {/* brand header */}
        <div style={s.brandRow}>
          <div style={s.logoMark}>KM</div>
          <div>
            <div style={s.brandName}>Krantijyoti Mahila Gat</div>
            <div style={s.brandTagline}>Empowering Women · Nagpur, Maharashtra</div>
          </div>
        </div>

        <div style={s.divider} />

        {/* tabs */}
        <div style={s.tabs}>
          {[{ key: 'signin', label: 'Sign In' }, { key: 'register', label: 'New Account' }].map(t => (
            <button key={t.key} onClick={() => switchTab(t.key)}
              style={{ ...s.tabBtn, ...(tab === t.key ? s.tabActive : s.tabInactive) }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ SIGN IN ══ */}
        {tab === 'signin' && (
          <form onSubmit={signInHandler} style={s.form}>
            <div style={s.formHeader}>
              <h2 style={s.formTitle}>Welcome Back</h2>
              <p style={s.formSub}>Sign in to your account to continue</p>
            </div>

            {siErr && <div style={s.errBox}>{siErr}</div>}

            <Field icon={<IconUser />} label="Username" placeholder="Enter your username"
              value={siUser} onChange={e => setSiUser(e.target.value)} />

            <div style={s.fieldWrap}>
              <label style={s.label}>Password</label>
              <div style={s.inputRow}
                onFocus={e => { e.currentTarget.style.borderColor = '#c2185b'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(194,24,91,0.08)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#e8d0da'; e.currentTarget.style.boxShadow = 'none'; }}>
                <span style={s.iconWrap}><IconLock /></span>
                <input type={siShow ? 'text' : 'password'} placeholder="Enter your password"
                  value={siPass} onChange={e => setSiPass(e.target.value)} required style={{ ...s.input, paddingRight: 40 }} />
                <button type="button" style={s.eyeBtn} onClick={() => setSiShow(p => !p)}>
                  {siShow ? <IconEyeOff /> : <IconEyeOn />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={siLoad} style={{ ...s.submitBtn, opacity: siLoad ? 0.75 : 1 }}
              onMouseEnter={e => { if (!siLoad) { e.currentTarget.style.background = 'linear-gradient(135deg,#880e4f,#ad1457)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(194,24,91,0.35)'; } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#c2185b,#d81b60)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(194,24,91,0.25)'; }}>
              {siLoad ? 'Signing In…' : 'Sign In'}
            </button>

            <p style={s.switchHint}>
              New here?{' '}
              <span style={s.switchLink} onClick={() => switchTab('register')}>Create an account</span>
            </p>
          </form>
        )}

        {/* ══ REGISTER ══ */}
        {tab === 'register' && (
          <form onSubmit={registerHandler} style={s.form}>
            <div style={s.formHeader}>
              <h2 style={s.formTitle}>Create Account</h2>
              <p style={s.formSub}>Join Krantijyoti Mahila Gat — it's free</p>
            </div>

            {regErr && <div style={s.errBox}>{regErr}</div>}
            {regOk && <div style={s.okBox}>{regOk}</div>}

            {/* role selector */}
            <div style={s.fieldWrap}>
              <label style={s.label}>I am a</label>
              <div style={s.roleRow}>
                {[
                  { key: 'Admin', desc: 'Platform Admin' },
                  { key: 'Member', desc: 'Group Member' },
                  { key: 'Customer', desc: 'Customer / Buyer' },
                ].map(r => (
                  <div key={r.key} onClick={() => setRegRole(r.key)}
                    style={{ ...s.roleChip, ...(regRole === r.key ? s.roleChipActive : {}) }}>
                    <div style={{ fontWeight: 700, fontSize: '.83rem', color: regRole === r.key ? '#c2185b' : '#5a3a4e' }}>{r.key}</div>
                    <div style={{ fontSize: '.72rem', color: regRole === r.key ? '#ad1457' : '#9c7b8a', marginTop: 1 }}>{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <Field icon={<IconUser />} label="Full Name" placeholder="Your full name"
              value={regName} onChange={e => setRegName(e.target.value)} />
            <Field icon={<IconUser />} label="Username" placeholder="Choose a username"
              value={regUser} onChange={e => setRegUser(e.target.value)} />
            <Field icon={<IconMail />} label="Email Address" type="email" placeholder="Your email address"
              value={regEmail} onChange={e => setRegEmail(e.target.value)} />

            {/* ADMIN-SPECIFIC FIELDS */}
            {regRole === 'Admin' && (
              <>
                <Field icon={<IconPhone />} label="Phone Number" type="tel" placeholder="10-digit mobile number"
                  value={regPhone} onChange={e => setRegPhone(e.target.value)} required={false} />
                <Field icon={<IconUser />} label="Department" placeholder="Your department name"
                  value={regAdminDept} onChange={e => setRegAdminDept(e.target.value)} required={false} />
                <Field icon={<IconUser />} label="Official ID" placeholder="Your official ID number"
                  value={regAdminId} onChange={e => setRegAdminId(e.target.value)} required={false} />
              </>
            )}

            {/* MEMBER-SPECIFIC FIELDS */}
            {regRole === 'Member' && (
              <>
                <Field icon={<IconPhone />} label="Phone Number" type="tel" placeholder="10-digit mobile number"
                  value={regPhone} onChange={e => setRegPhone(e.target.value)} required={false} />
                <Field icon={<IconUser />} label="Group Name" placeholder="Your Bachatgat group name"
                  value={regMemberGroup} onChange={e => setRegMemberGroup(e.target.value)} required={false} />
                <Field icon={<IconUser />} label="Address" placeholder="Your residential address"
                  value={regMemberAddr} onChange={e => setRegMemberAddr(e.target.value)} required={false} />
              </>
            )}

            {/* CUSTOMER-SPECIFIC FIELDS */}
            {regRole === 'Customer' && (
              <>
                <Field icon={<IconPhone />} label="Phone Number" type="tel" placeholder="10-digit mobile number"
                  value={regPhone} onChange={e => setRegPhone(e.target.value)} required={false} />
              </>
            )}

            <div style={s.fieldWrap}>
              <label style={s.label}>Password</label>
              <div style={s.inputRow}
                onFocus={e => { e.currentTarget.style.borderColor = '#c2185b'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(194,24,91,0.08)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#e8d0da'; e.currentTarget.style.boxShadow = 'none'; }}>
                <span style={s.iconWrap}><IconLock /></span>
                <input type={regShow ? 'text' : 'password'} placeholder="Create a strong password"
                  value={regPass} onChange={e => setRegPass(e.target.value)} required style={{ ...s.input, paddingRight: 40 }} />
                <button type="button" style={s.eyeBtn} onClick={() => setRegShow(p => !p)}>
                  {regShow ? <IconEyeOff /> : <IconEyeOn />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={regLoad} style={{ ...s.submitBtn, opacity: regLoad ? 0.75 : 1 }}
              onMouseEnter={e => { if (!regLoad) { e.currentTarget.style.background = 'linear-gradient(135deg,#880e4f,#ad1457)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(194,24,91,0.35)'; } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#c2185b,#d81b60)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(194,24,91,0.25)'; }}>
              {regLoad ? 'Creating Account…' : 'Create Account'}
            </button>

            <p style={s.switchHint}>
              Already have an account?{' '}
              <span style={s.switchLink} onClick={() => switchTab('signin')}>Sign In</span>
            </p>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0e0e8' }}>
          <a href="/" style={s.backLink}>&#8592; Back to Home</a>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        @keyframes blobMove1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(60px,-40px) scale(1.1); }
          66%      { transform: translate(-30px,50px) scale(0.95); }
        }
        @keyframes blobMove2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(-50px,60px) scale(1.08); }
          66%      { transform: translate(40px,-30px) scale(0.97); }
        }
        @keyframes blobMove3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(30px,40px) scale(1.06); }
        }
        input::placeholder { color: #c8a0b8; font-size:.88rem; }
        input:focus { outline: none; }
        button { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
};

/* ── styles ── */
const s = {
  page: {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#fce8f1',
    fontFamily: "'Inter', sans-serif",
    padding: '24px 16px',
    position: 'relative',
    overflow: 'hidden',
  },

  /* background overlay — blurred image */
  bgOverlay: {
    position: 'fixed', inset: 0,
    backgroundImage: 'url(/login-bg.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(10px)',
    transform: 'scale(1.05)',
    opacity: 0.55,
    pointerEvents: 'none', zIndex: 0,
  },
  blob1: {
    position: 'fixed', width: 500, height: 500,
    borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
    background: 'rgba(194,24,91,0.07)',
    top: '-120px', right: '-100px',
    filter: 'blur(70px)',
    animation: 'blobMove1 18s ease-in-out infinite',
    pointerEvents: 'none', zIndex: 0,
  },
  blob2: {
    position: 'fixed', width: 420, height: 420,
    borderRadius: '45% 55% 40% 60% / 55% 45% 60% 40%',
    background: 'rgba(173,20,87,0.06)',
    bottom: '-80px', left: '-80px',
    filter: 'blur(65px)',
    animation: 'blobMove2 22s ease-in-out infinite',
    pointerEvents: 'none', zIndex: 0,
  },
  blob3: {
    position: 'fixed', width: 280, height: 280,
    borderRadius: '50%',
    background: 'rgba(216,27,96,0.05)',
    top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
    filter: 'blur(50px)',
    animation: 'blobMove3 14s ease-in-out infinite',
    pointerEvents: 'none', zIndex: 0,
  },
  gridSvg: {
    position: 'fixed', inset: 0, width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: 0,
  },

  /* card */
  card: {
    background: 'rgba(255,255,255,0.97)',
    backdropFilter: 'blur(20px)',
    borderRadius: 20,
    padding: '36px 36px 28px',
    width: '100%', maxWidth: 448,
    position: 'relative', zIndex: 1,
    boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.08) inset',
    border: '1px solid rgba(255,255,255,0.2)',
  },

  /* brand */
  brandRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  logoMark: {
    width: 42, height: 42, borderRadius: 12,
    background: 'linear-gradient(135deg,#c2185b,#880e4f)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 800, fontSize: '.95rem',
    letterSpacing: '0.5px', flexShrink: 0,
    boxShadow: '0 4px 12px rgba(194,24,91,0.3)',
  },
  brandName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.3rem', fontWeight: 800,
    color: '#2d0f22', letterSpacing: '-0.2px',
    lineHeight: 1.1,
  },
  brandTagline: { fontSize: '.72rem', color: '#9c7b8a', marginTop: 2, letterSpacing: '0.2px' },

  divider: { height: 1, background: 'linear-gradient(90deg, transparent, #f0d6e0, transparent)', marginBottom: 20 },

  /* tabs */
  tabs: {
    display: 'flex', background: '#f8f0f4',
    borderRadius: 10, padding: 3, marginBottom: 24, gap: 3,
  },
  tabBtn: {
    flex: 1, border: 'none', borderRadius: 8,
    padding: '9px 0', fontWeight: 600,
    fontSize: '.84rem', cursor: 'pointer',
    transition: 'all .2s', letterSpacing: '0.2px',
    fontFamily: "'Inter', sans-serif",
  },
  tabActive: {
    background: '#fff',
    color: '#c2185b',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  tabInactive: { background: 'transparent', color: '#9c7b8a' },

  /* form */
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  formHeader: { marginBottom: 4 },
  formTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.35rem', fontWeight: 800,
    color: '#2d0f22', margin: '0 0 3px',
  },
  formSub: { fontSize: '.82rem', color: '#9c7b8a', margin: 0 },

  /* alerts */
  errBox: {
    background: '#fff5f7', border: '1px solid #f8bbd0',
    color: '#880e4f', borderRadius: 8,
    padding: '10px 14px', fontSize: '.82rem', fontWeight: 500,
  },
  okBox: {
    background: '#f0faf2', border: '1px solid #c8e6c9',
    color: '#2e7d32', borderRadius: 8,
    padding: '10px 14px', fontSize: '.82rem', fontWeight: 500,
  },

  /* role chips */
  roleRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  roleChip: {
    flex: '1 1 calc(33.333% - 6px)', padding: '10px 14px',
    borderRadius: 10, border: '1.5px solid #edd5e0',
    cursor: 'pointer', background: '#fff8fb',
    transition: 'all .18s',
    minWidth: '100px',
  },
  roleChipActive: {
    borderColor: '#c2185b',
    background: '#fff0f5',
    boxShadow: '0 0 0 2px rgba(194,24,91,0.12)',
  },

  /* field */
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: 5 },
  label: { fontSize: '.78rem', fontWeight: 600, color: '#5a3a4e', letterSpacing: '0.3px' },
  inputRow: {
    display: 'flex', alignItems: 'center',
    border: '1.5px solid #e8d0da', borderRadius: 10,
    background: '#fff', padding: '0 12px',
    transition: 'border-color .18s, box-shadow .18s',
    position: 'relative', gap: 8,
  },
  iconWrap: { display: 'flex', alignItems: 'center', flexShrink: 0 },
  input: {
    flex: 1, border: 'none', background: 'transparent', outline: 'none',
    padding: '11px 0', fontSize: '.88rem', color: '#2d0f22',
    fontFamily: "'Inter', sans-serif",
  },
  eyeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center',
    position: 'absolute', right: 12, padding: 0,
  },

  /* submit */
  submitBtn: {
    background: 'linear-gradient(135deg,#c2185b,#d81b60)',
    color: '#fff', border: 'none',
    borderRadius: 10, padding: '13px 0', width: '100%',
    fontWeight: 700, fontSize: '.95rem', cursor: 'pointer',
    transition: 'all .2s',
    boxShadow: '0 4px 16px rgba(194,24,91,0.25)',
    fontFamily: "'Inter', sans-serif", marginTop: 2,
    letterSpacing: '0.3px',
  },

  switchHint: { textAlign: 'center', fontSize: '.8rem', color: '#9c7b8a', margin: 0 },
  switchLink: { color: '#c2185b', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2 },
  backLink: { color: '#9c7b8a', fontSize: '.78rem', fontWeight: 500, textDecoration: 'none' },
};

export default Login;
