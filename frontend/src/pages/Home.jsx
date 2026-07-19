import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ShieldCheck, Users, Search, ArrowRight, Activity, Heart, Star, CheckCircle2, Building2, Smartphone } from 'lucide-react';
import API from '../api/axios';

const Home = () => {
  const [stats, setStats] = useState({ specialists: '0', patients: '0', departments: '0', experience: '12' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/stats/public-stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch home stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="page-fade-in">
      {/* Hero Section */}
      <header style={{ 
        padding: '8rem 4rem 4rem', 
        background: 'radial-gradient(circle at 100% -20%, rgba(13, 148, 136, 0.08), transparent 70%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {/* Left Text */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ 
              background: 'white', 
              color: 'var(--text-main)', 
              padding: '0.5rem 1.25rem', 
              borderRadius: '2rem', 
              fontSize: '0.85rem', 
              fontWeight: '700',
              marginBottom: '2rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              border: '1px solid var(--border)'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }}></div> 
              Join {stats.patients}+ active patients today
            </span>
            
            <h1 style={{ 
              fontSize: '4.8rem', 
              fontWeight: '900', 
              lineHeight: '1.05', 
              marginBottom: '1.5rem', 
              letterSpacing: '-0.04em',
              color: 'var(--primary)'
            }}>
              Modern Healthcare, <br />
              <span style={{ 
                background: 'linear-gradient(135deg, var(--accent) 0%, #0284c7 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>Simplified.</span>
            </h1>
            
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--text-muted)', 
              maxWidth: '550px', 
              marginBottom: '3rem',
              fontWeight: '400',
              lineHeight: '1.7'
            }}>
              Connect with top-tier medical specialists instantly. Experience a digital-first healthcare platform designed for your well-being.
            </p>
            
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <Link to="/doctors" className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', borderRadius: '1.25rem' }}>
                Find a Specialist <ArrowRight size={20} />
              </Link>
              <Link to="/register" className="btn btn-outline" style={{ padding: '1.25rem 2.5rem', fontSize: '1.1rem', borderRadius: '1.25rem' }}>
                Create Account
              </Link>
            </div>
          </div>
          
          {/* Right Image */}
          <div style={{ position: 'relative' }}>
            {/* Abstract Decorative Backgrounds */}
            <div style={{
              position: 'absolute',
              top: '-10%', right: '-10%', bottom: '5%', left: '5%',
              background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(13, 148, 136, 0.02) 100%)',
              borderRadius: '3rem',
              transform: 'rotate(-3deg)',
              zIndex: 0
            }}></div>
            <div style={{
              position: 'absolute',
              top: '5%', right: '5%', bottom: '-10%', left: '-5%',
              border: '2px solid rgba(13, 148, 136, 0.2)',
              borderRadius: '3rem',
              transform: 'rotate(2deg)',
              zIndex: 0
            }}></div>
            <img 
              src="/hero_doctor.png" 
              alt="Medical Professional" 
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '3rem',
                position: 'relative',
                zIndex: 1,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                objectFit: 'cover',
                maxHeight: '650px'
              }} 
            />
            
            {/* Floating Badge */}
            <div className="glass" style={{
              position: 'absolute',
              bottom: '10%',
              left: '-10%',
              zIndex: 2,
              padding: '1.25rem',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              <div style={{ background: '#10b981', color: 'white', padding: '0.75rem', borderRadius: '0.75rem' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Professionals</p>
                <p style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>{stats.specialists}+ Doctors</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="main-content" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 4rem 6rem' }}>
        
        {/* Stats Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '2rem', 
          marginTop: '6rem',
        }}>
          {[
            { label: 'Specialists', value: `${stats.specialists}+`, icon: Users, color: '#14b8a6' },
            { label: 'Happy Patients', value: `${stats.patients}+`, icon: Heart, color: '#f43f5e' },
            { label: 'Departments', value: `${stats.departments}+`, icon: Building2, color: '#8b5cf6' },
            { label: 'Years Experience', value: `${stats.experience}+`, icon: CheckCircle2, color: '#10b981' }
          ].map((stat, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem', 
              padding: '1.5rem', 
              background: 'white', 
              borderRadius: '1.5rem', 
              border: '1px solid var(--border)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ 
                background: `${stat.color}15`, 
                width: '60px', height: '60px', 
                borderRadius: '1rem', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
              }}>
                <stat.icon size={26} color={stat.color} />
              </div>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', lineHeight: 1 }}>{stat.value}</h2>
                <p style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.75rem', letterSpacing: '0.05em', marginTop: '0.25rem' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <section style={{ marginTop: '10rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Streamlined Healthcare</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>Everything you need to manage your health, seamlessly integrated into one platform.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
            <div className="card card-hover" style={{ padding: '3rem 2.5rem' }}>
              <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', width: '75px', height: '75px', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d9488', marginBottom: '2rem' }}>
                <Search size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Smart Doctor Search</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Find the perfect match based on specialization, availability, and patient ratings across our entire network.</p>
            </div>
            
            <div className="card card-hover" style={{ padding: '3rem 2.5rem' }}>
              <div style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', width: '75px', height: '75px', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: '2rem' }}>
                <Calendar size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Instant E-Channelling</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>No more long queues. Book your preferred slot and receive instant confirmation with digital tokens.</p>
            </div>
            
            <div className="card card-hover" style={{ padding: '3rem 2.5rem' }}>
              <div style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', width: '75px', height: '75px', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', marginBottom: '2rem' }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Secure Health Wallet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Manage payments and medical records in a highly secure environment encrypted with industry-standard protocols.</p>
            </div>
          </div>
        </section>

        {/* Image Showcase Section */}
        <section style={{ marginTop: '10rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <div>
            <img 
              src="/app_mockup.png" 
              alt="MediChannel App Mockup" 
              style={{
                width: '100%',
                borderRadius: '2rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
              }}
            />
          </div>
          <div>
            <span style={{ color: 'var(--accent)', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '1rem', display: 'block' }}>Experience The Future</span>
            <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.1' }}>Manage your health on the go.</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2.5rem', lineHeight: '1.7' }}>
              Access your medical records, book appointments, and consult with doctors from anywhere in the world. Our platform is designed to put you in control.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ background: '#e0e7ff', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Smartphone size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.25rem' }}>Responsive Interface</h4>
                  <p style={{ color: 'var(--text-muted)' }}>Flawless experience across all your devices, desktop or mobile.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ background: '#dcfce7', color: '#15803d', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Activity size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.25rem' }}>Real-time Sync</h4>
                  <p style={{ color: 'var(--text-muted)' }}>Your data is updated instantly across the hospital network.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ 
          marginTop: '10rem', 
          background: 'linear-gradient(135deg, var(--primary) 0%, #1e293b 100%)', 
          borderRadius: '2rem', 
          padding: '6rem 4rem',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <div style={{ position: 'absolute', right: '-5%', top: '-30%', opacity: 0.05, color: 'white', transform: 'rotate(15deg)' }}>
            <Activity size={500} />
          </div>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Ready to elevate your healthcare experience?</h2>
            <p style={{ fontSize: '1.25rem', opacity: 0.8, marginBottom: '3rem', fontWeight: '400' }}>Join thousands of users who have simplified their medical appointments with MediChannel.</p>
            <Link to="/register" className="btn btn-primary" style={{ background: 'white', color: 'var(--primary)', border: 'none', padding: '1.25rem 3rem', fontSize: '1.1rem' }}>
              Create Free Account
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

