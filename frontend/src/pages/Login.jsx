import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Activity, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Use the login function from AuthContext which handles the API call and state
      const user = await login(formData.email, formData.password);

      if (user.role === 'Admin') navigate('/admin');
      else if (user.role === 'Doctor') navigate('/doctor');
      else navigate('/patient');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-fade-in" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
      padding: '2rem'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '3rem',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <img src="/logo.png" alt="MediChannel Logo" style={{ height: '56px', mixBlendMode: 'multiply' }} />
        </div>

        <h1 style={{ fontSize: '2.25rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.03em', color: '#1e293b' }}>Welcome Back</h1>
        <p style={{ color: '#64748b', marginBottom: '2.5rem', fontWeight: '500' }}>Securely access your medical portal</p>

        {error && (
          <div style={{ background: '#fef2f2', color: '#991b1b', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: '600' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
              <input
                type="email"
                placeholder="name@company.com"
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
              <a href="#" style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textDecoration: 'none' }}></a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.875rem 3.5rem 0.875rem 3rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: '700', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
          >
            {loading ? 'Authenticating...' : (
              <>Sign In <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            New to MediChannel? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Create an account</Link>
          </p>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#10b981' }}>
          <ShieldCheck size={16} />
          <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>SSL Secure Connection</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
