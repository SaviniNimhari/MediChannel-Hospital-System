import React, { useEffect } from 'react';
import { ShieldCheck, Heart, Users, Activity, Target, Award } from 'lucide-react';

const About = () => {
  useEffect(() => {
    document.title = "About Us | MediChannel";
  }, []);

  return (
    <div className="page-fade-in">
      <section style={{ padding: '8rem 4rem', textAlign: 'center', background: 'var(--primary)', color: 'white' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Our Mission is to <br /><span style={{ color: 'var(--accent)' }}>Heal the World.</span></h1>
        <p style={{ fontSize: '1.25rem', opacity: 0.8, maxWidth: '700px', margin: '0 auto' }}>
          We are committed to making healthcare accessible, affordable, and seamless for everyone through the power of digital innovation.
        </p>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ background: 'var(--accent-soft)', color: 'var(--accent)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Target size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Our Vision</h3>
            <p style={{ color: 'var(--text-muted)' }}>To be the global leader in digital healthcare solutions, connecting patients with the best medical minds.</p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ background: '#ecfdf5', color: '#10b981', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Award size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Our Quality</h3>
            <p style={{ color: 'var(--text-muted)' }}>We only partner with board-certified specialists and verified medical institutions across the globe.</p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ background: '#fef2f2', color: 'var(--danger)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Heart size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Our Heart</h3>
            <p style={{ color: 'var(--text-muted)' }}>Patient care is our top priority. We listen, we care, and we innovate to save lives and improve health.</p>
          </div>
        </div>

        <div style={{ marginTop: '8rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '2rem', letterSpacing: '-0.02em' }}>Founded on <br />Trust and Security</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { title: 'HIPAA Compliant', desc: 'Your medical records are encrypted and strictly protected.' },
                { title: 'Verified Specialists', desc: 'Every doctor undergoes a rigorous 5-step verification process.' },
                { title: 'Instant Support', desc: 'Our dedicated medical team is available 24/7 for your needs.' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ color: 'var(--accent)', marginTop: '0.25rem' }}>
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '700', fontSize: '1.1rem' }}>{item.title}</h4>
                    <p style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: '4rem', background: 'var(--accent)', color: 'white', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             <Activity size={80} opacity={0.2} />
             <h3 style={{ fontSize: '2rem', fontWeight: '800' }}>"Healthcare is a right, not a privilege. We are here to bridge the gap."</h3>
             <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>— Dr. Sarah Chen, CEO of MediChannel</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
