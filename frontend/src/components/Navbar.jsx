import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Only hide navbar for private dashboard paths that use the Sidebar layout
  const isDashboardRoute = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/doctor') || 
    (location.pathname.startsWith('/patient') && location.pathname !== '/patient/book'); 
    // Note: I'll keep it simple: if it's a subpath of a role, it's a dashboard.
    // BUT /doctors is NOT a subpath of /patient.

  const hideNavbar = ['/admin', '/doctor', '/patient'].some(
    path => location.pathname === path || location.pathname.startsWith(path + '/')
  );

  if (hideNavbar) return null;

  const linkStyle = (path) => ({
    color: location.pathname === path ? 'var(--accent)' : 'var(--text-main)',
    fontWeight: location.pathname === path ? '700' : '500',
    textDecoration: 'none',
    transition: 'color 0.2s'
  });

  return (
    <nav className="navbar" style={{ textDecoration: 'none' }}>
      <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
        <img src="/logo.png" alt="MediChannel Logo" style={{ height: '38px', mixBlendMode: 'multiply' }} />
        <span style={{ background: 'linear-gradient(90deg, #0f172a, #0f766e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MediChannel</span>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem' }}>
          <Link to="/doctors" style={linkStyle('/doctors')}>Find Doctors</Link>
          <Link to="/about" style={linkStyle('/about')}>About</Link>
          <Link to="/contact" style={linkStyle('/contact')}>Contact</Link>
        </div>
        
        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to={user.role === 'Admin' ? '/admin' : user.role === 'Doctor' ? '/doctor' : '/patient'} className="btn btn-outline" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem', textDecoration: 'none' }}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <button onClick={handleLogout} className="btn" style={{ color: 'var(--danger)', background: '#fef2f2', padding: '0.6rem', cursor: 'pointer' }}>
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/login" className="btn btn-outline" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', textDecoration: 'none' }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

