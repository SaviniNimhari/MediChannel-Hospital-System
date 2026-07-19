import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Users, UserPlus, Calendar, CreditCard, Building2,
  Home, UserCircle, ListChecks, Search, Activity, ChevronRight, LogOut, BarChart3, ShieldCheck, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    {
      section: 'INTELLIGENCE', links: [
        { name: 'Analytics Hub', path: '/admin', icon: Home },
        { name: 'Forensic Reports', path: '/admin/reports', icon: BarChart3 },
      ]
    },
    {
      section: 'MANAGEMENT', links: [
        { name: 'Specialists', path: '/admin/doctors', icon: UserPlus },
        { name: 'Patient Base', path: '/admin/patients', icon: Users },
        { name: 'Support Inquiries', path: '/admin/inquiries', icon: MessageSquare },
        { name: 'Departments', path: '/admin/departments', icon: Building2 },
      ]
    },
    {
      section: 'OPERATIONS', links: [
        { name: 'Schedule', path: '/admin/appointments', icon: Calendar },
        { name: 'Financials', path: '/admin/payments', icon: CreditCard },
      ]
    }
  ];

  const doctorLinks = [
    {
      section: 'CLINICAL', links: [
        { name: 'Overview', path: '/doctor', icon: Home },
        { name: 'My Schedule', path: '/doctor/appointments', icon: Calendar },
      ]
    },
    {
      section: 'ACCOUNT', links: [
        { name: 'Profile Settings', path: '/doctor/profile', icon: UserCircle },
      ]
    }
  ];

  const patientLinks = [
    {
      section: 'MEDICAL', links: [
        { name: 'Dashboard', path: '/patient', icon: Home },
        { name: 'Find Doctors', path: '/patient/book', icon: Search },
        { name: 'My Bookings', path: '/patient/appointments', icon: ListChecks },
      ]
    },
    {
      section: 'BILLING', links: [
        { name: 'Payments', path: '/patient/payments', icon: CreditCard },
        { name: 'My Profile', path: '/patient/profile', icon: UserCircle },
      ]
    }
  ];

  const sections = user?.role === 'Admin' ? adminLinks : user?.role === 'Doctor' ? doctorLinks : patientLinks;

  return (
    <aside className="sidebar" style={{
      width: '270px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      position: 'sticky',
      top: 0
    }}>
      {/* Brand Header */}
      <div style={{ marginBottom: '1.25rem', padding: '0.25rem 0.5rem' }}>
        <div className="logo" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="logo-icon" style={{
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{ 
                width: '120%', 
                height: '120%', 
                objectFit: 'contain',
                filter: 'grayscale(1) contrast(3) invert(1)',
                mixBlendMode: 'screen',
                marginLeft: '-4px'
              }} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: '800', lineHeight: 1 }}>MediChannel</span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '4px' }}>
        {sections.map((section, idx) => (
          <div key={idx}>
            <p style={{
              fontSize: '0.65rem',
              fontWeight: '800',
              color: '#64748b',
              letterSpacing: '0.12em',
              marginBottom: '0.5rem',
              paddingLeft: '0.75rem'
            }}>
              {section.section}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              {section.links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '0.65rem',
                    color: '#94a3b8',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                  }}
                  end
                >
                  <link.icon size={18} />
                  <span style={{ flex: 1 }}>{link.name}</span>
                  <ChevronRight size={12} className="chevron" style={{ opacity: 0 }} />
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Card & Logout */}
      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
          padding: '0.75rem',
          borderRadius: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '0.75rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0d9488, #0f766e)',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            {user?.name?.charAt(0)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>{user?.name}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ShieldCheck size={10} color="#10b981" />
              <p style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: '600' }}>{user?.role} Verified</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="sidebar-logout-btn"
          style={{
            width: '100%',
            background: 'rgba(239, 68, 68, 0.08)',
            color: '#ef4444',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: '700',
            padding: '0.75rem',
            borderRadius: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
          }
          .sidebar-link:hover {
            background: rgba(255, 255, 255, 0.05);
            color: white !important;
          }
          .sidebar-link.active {
            background: #0d9488 !important;
            color: white !important;
            box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
          }
          .sidebar-link.active .chevron {
            opacity: 0.5 !important;
            transform: translateX(2px);
          }
          .sidebar-logout-btn:hover {
            background: rgba(239, 68, 68, 0.15) !important;
            transform: translateY(-1px);
          }
        `}
      </style>
    </aside>
  );
};

export default Sidebar;

