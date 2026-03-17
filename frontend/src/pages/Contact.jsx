import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setStatus('');
    try {
      await axios.post('/api/feedback', form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroBadge}>Get in Touch</div>
          <h1 style={s.heroTitle}>Contact Us</h1>
          <p style={s.heroSub}>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </div>

      <Container>
        <div style={s.grid}>

          {/* Info cards */}
          <div style={s.infoCol}>
            {[
              { icon: <i className="fas fa-map-marker-alt" />, title: 'Our Address', lines: ['SakhiConnect HQ', 'Maharashtra, India'] },
              { icon: <i className="fas fa-phone-alt" />, title: 'Phone', lines: ['+91 98765 43210', 'Mon–Sat, 9am–6pm'] },
              { icon: <i className="fas fa-envelope" />, title: 'Email', lines: ['support@sakhiconnect.in', 'hello@sakhiconnect.in'] },
            ].map((c, i) => (
              <div key={i} style={s.infoCard}>
                <div style={s.infoIcon}>{c.icon}</div>
                <div>
                  <div style={s.infoTitle}>{c.title}</div>
                  {c.lines.map((l, j) => <div key={j} style={s.infoLine}>{l}</div>)}
                </div>
              </div>
            ))}

            <div style={s.socialRow}>
              {['Facebook', 'Instagram', 'Twitter', 'WhatsApp'].map((sn) => (
                <div key={sn} style={s.socialChip}>{sn}</div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={s.formCard}>
            <h2 style={s.formTitle}>Send a Message</h2>
            <p style={s.formSub}>Fill out the form below and we'll get back to you within 24 hours.</p>

            {status === 'success' && (
              <div style={s.okBox}>Message sent successfully. We'll get back to you soon.</div>
            )}
            {status === 'error' && (
              <div style={s.errBox}>Something went wrong. Please try again.</div>
            )}

            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.row}>
                <div style={s.fieldWrap}>
                  <label style={s.label}>Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange}
                    placeholder="Your full name" required style={s.input} />
                </div>
                <div style={s.fieldWrap}>
                  <label style={s.label}>Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="your@email.com" required style={s.input} />
                </div>
              </div>
              <div style={s.fieldWrap}>
                <label style={s.label}>Message</label>
                <textarea name="message" value={form.message} onChange={handleChange}
                  placeholder="Write your message here…" required style={s.textarea} rows={5} />
              </div>
              <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.75 : 1 }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = 'linear-gradient(135deg,#880e4f,#ad1457)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#c2185b,#d81b60)'; }}>
                {loading ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </Container>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        input::placeholder, textarea::placeholder { color: #c8a0b8; }
        input:focus, textarea:focus { outline: none; border-color: #c2185b !important; box-shadow: 0 0 0 3px rgba(194,24,91,0.1); }
      `}</style>
    </div>
  );
};

const s = {
  page: { fontFamily: "'Inter', sans-serif", background: '#fdf6f9', minHeight: '100vh', paddingBottom: 60 },

  hero: {
    background: 'linear-gradient(135deg, #1a0a12 0%, #2d0f22 50%, #1e0d18 100%)',
    padding: '64px 24px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden',
  },
  heroInner: { position: 'relative', zIndex: 1 },
  heroBadge: {
    display: 'inline-block', background: 'rgba(194,24,91,0.2)', border: '1px solid rgba(194,24,91,0.4)',
    color: '#f48fb1', borderRadius: 20, padding: '6px 18px', fontSize: '.8rem',
    fontWeight: 600, letterSpacing: '.5px', marginBottom: 16,
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: 'clamp(2rem,5vw,3rem)',
    fontWeight: 800, margin: '0 0 12px',
  },
  heroSub: { color: '#e8b4c8', fontSize: '1rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 },

  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 32, paddingTop: 48,
  },

  infoCol: { display: 'flex', flexDirection: 'column', gap: 16 },
  infoCard: {
    display: 'flex', alignItems: 'flex-start', gap: 14,
    background: '#fff', borderRadius: 16, padding: '20px 22px',
    boxShadow: '0 2px 12px rgba(194,24,91,0.07)', border: '1px solid #f5e0e8',
  },
  infoIcon: { fontSize: '1.5rem', flexShrink: 0, marginTop: 2 },
  infoTitle: { fontWeight: 700, color: '#2d0f22', fontSize: '.95rem', marginBottom: 4 },
  infoLine: { color: '#7a4a60', fontSize: '.85rem', lineHeight: 1.6 },

  socialRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  socialChip: {
    background: 'linear-gradient(135deg,#c2185b,#d81b60)', color: '#fff',
    borderRadius: 20, padding: '6px 16px', fontSize: '.78rem', fontWeight: 600, cursor: 'pointer',
  },

  formCard: {
    background: '#fff', borderRadius: 20, padding: '36px 32px',
    boxShadow: '0 8px 32px rgba(194,24,91,0.1)', border: '1px solid #f0d6e4',
  },
  formTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: '1.6rem',
    fontWeight: 800, color: '#2d0f22', margin: '0 0 6px',
  },
  formSub: { color: '#9c7b8a', fontSize: '.87rem', marginBottom: 24 },

  okBox: {
    background: '#f0faf2', border: '1px solid #c8e6c9', color: '#2e7d32',
    borderRadius: 10, padding: '12px 16px', fontSize: '.87rem', marginBottom: 16,
  },
  errBox: {
    background: '#fff5f7', border: '1px solid #f8bbd0', color: '#880e4f',
    borderRadius: 10, padding: '12px 16px', fontSize: '.87rem', marginBottom: 16,
  },

  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: '.78rem', fontWeight: 600, color: '#5a3a4e', letterSpacing: '.3px' },
  input: {
    border: '1.5px solid #e8d0da', borderRadius: 10, padding: '11px 14px',
    fontSize: '.88rem', color: '#2d0f22', fontFamily: "'Inter', sans-serif",
    transition: 'border-color .18s, box-shadow .18s', background: '#fff',
  },
  textarea: {
    border: '1.5px solid #e8d0da', borderRadius: 10, padding: '11px 14px',
    fontSize: '.88rem', color: '#2d0f22', fontFamily: "'Inter', sans-serif",
    transition: 'border-color .18s, box-shadow .18s', resize: 'vertical', background: '#fff',
  },
  btn: {
    background: 'linear-gradient(135deg,#c2185b,#d81b60)', color: '#fff',
    border: 'none', borderRadius: 10, padding: '13px 0', width: '100%',
    fontWeight: 700, fontSize: '.95rem', cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(194,24,91,0.25)', transition: 'all .2s',
    fontFamily: "'Inter', sans-serif", letterSpacing: '.3px',
  },
};

export default Contact;
