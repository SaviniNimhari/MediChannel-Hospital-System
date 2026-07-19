import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const hideFooter = ['/admin', '/doctor', '/patient'].some(
    path => location.pathname === path || location.pathname.startsWith(path + '/')
  );

  if (hideFooter) return null;

  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '6rem 4rem 2rem', background: 'white' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div>
          <div className="logo" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/logo.png" alt="MediChannel Logo" style={{ height: '38px', mixBlendMode: 'multiply' }} />
            <span style={{ background: 'linear-gradient(90deg, #0f172a, #0f766e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800', fontSize: '1.25rem' }}>MediChannel</span>
          </div>
          <p style={{ color: 'var(--text-muted)', maxWidth: '300px', fontSize: '1.05rem', lineHeight: '1.6' }}>Providing world-class healthcare accessibility through modern technology and verified specialists.</p>
        </div>
        <div>
          <h4 style={{ marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary)' }}>Platform</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontWeight: '500', padding: 0 }}>
            <li><Link to="/doctors" style={{ color: 'inherit', textDecoration: 'none' }}>Find Doctors</Link></li>
            <li><Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>How it Works</Link></li>
            <li><Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Support</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary)' }}>Resources</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontWeight: '500', padding: 0 }}>
            <li><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Medical Blog</Link></li>
            <li><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Patient Guide</Link></li>
            <li><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary)' }}>Contact</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontWeight: '500', padding: 0 }}>
            <li>support@medichannel.com</li>
            <li>+1 (555) 000-1234</li>
            <li>123 Medical Plaza, NY</li>
          </ul>
        </div>
      </div>
      <div style={{ maxWidth: '1400px', margin: '5rem auto 0', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>
        © 2026 MediChannel Systems. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

