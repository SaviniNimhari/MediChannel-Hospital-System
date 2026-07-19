import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import API from '../api/axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Appointment Issue', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = "Contact Support | MediChannel";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/contact/submit', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: 'Appointment Issue', message: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-fade-in" style={{ padding: '6rem 4rem', background: 'radial-gradient(circle at top left, #eff6ff, #ffffff)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>Get in Touch</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Have questions about our services or need technical assistance? Our team is here to help you 24/7.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '5rem' }}>
          {/* Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ background: 'var(--accent-soft)', color: 'var(--accent)', padding: '1rem', borderRadius: '1rem' }}>
                <Mail size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Email Us</h4>
                <p style={{ color: 'var(--text-muted)' }}>support@medichannel.com</p>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ background: '#ecfdf5', color: '#10b981', padding: '1rem', borderRadius: '1rem' }}>
                <Phone size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Call Center</h4>
                <p style={{ color: 'var(--text-muted)' }}>+1 (555) 000-1234</p>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ background: '#fff7ed', color: '#f59e0b', padding: '1rem', borderRadius: '1rem' }}>
                <Clock size={28} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Working Hours</h4>
                <p style={{ color: 'var(--text-muted)' }}>Mon - Sat: 08:00 AM - 08:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card" style={{ padding: '4rem', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', color: 'var(--accent)' }}>
              <MessageSquare size={24} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Send us a Message</h3>
            </div>
            
            {success ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ background: '#ecfdf5', color: '#10b981', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                  <CheckCircle2 size={40} />
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem' }}>Message Received!</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your inquiry has been stored in our medical database. An administrator will review it shortly.</p>
                <button onClick={() => setSuccess(false)} className="btn btn-outline">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Full name" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="name@email.com" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select 
                    className="form-input"
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                  >
                    <option>Appointment Issue</option>
                    <option>Payment Query</option>
                    <option>Technical Support</option>
                    <option>General Feedback</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                  <label className="form-label">Detailed Message</label>
                  <textarea 
                    className="form-input" 
                    rows="5" 
                    placeholder="How can we help you?" 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', height: '56px' }}>
                  {loading ? 'Processing...' : 'Submit Request'} <Send size={20} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
