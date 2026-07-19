import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { Mail, Clock, User, MessageSquare, CheckCircle, Search, Inbox, Archive } from 'lucide-react';

const ManageInquiries = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending'); // 'Pending' or 'Resolved'

  useEffect(() => {
    document.title = "Patient Inquiries | Admin Dashboard";
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await API.get('/contact/all');
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await API.put(`/contact/resolve/${id}`);
      // Optimistic update
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'Resolved' } : m));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredMessages = messages.filter(m => m.status === activeTab);

  return (
    <DashboardLayout>
      <div className="page-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.04em' }}>Support Inquiries</h1>
            <p style={{ color: '#64748b' }}>Manage and resolve patient communications from the central registry.</p>
          </div>
          
          {/* Tab Switcher */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.4rem', borderRadius: '1rem', gap: '0.25rem' }}>
             <button 
               onClick={() => setActiveTab('Pending')}
               style={{ 
                 padding: '0.6rem 1.25rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700',
                 display: 'flex', alignItems: 'center', gap: '0.5rem',
                 background: activeTab === 'Pending' ? 'white' : 'transparent',
                 color: activeTab === 'Pending' ? '#0d9488' : '#64748b',
                 boxShadow: activeTab === 'Pending' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none'
               }}
             >
               <Inbox size={18} /> Active ({messages.filter(m => m.status === 'Pending').length})
             </button>
             <button 
               onClick={() => setActiveTab('Resolved')}
               style={{ 
                 padding: '0.6rem 1.25rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700',
                 display: 'flex', alignItems: 'center', gap: '0.5rem',
                 background: activeTab === 'Resolved' ? 'white' : 'transparent',
                 color: activeTab === 'Resolved' ? '#10b981' : '#64748b',
                 boxShadow: activeTab === 'Resolved' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none'
               }}
             >
               <Archive size={18} /> Resolved ({messages.filter(m => m.status === 'Resolved').length})
             </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>Loading Communications...</div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {filteredMessages.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '5rem', background: '#f8fafc', border: '2px dashed #e2e8f0' }}>
                <MessageSquare size={48} color="#94a3b8" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p style={{ fontWeight: '700', color: '#94a3b8', fontSize: '1.1rem' }}>No {activeTab.toLowerCase()} inquiries found.</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div key={msg.id} className="card page-fade-in" style={{ padding: '2rem', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
                  {activeTab === 'Resolved' && (
                    <div style={{ position: 'absolute', top: 0, right: 0, background: '#ecfdf5', color: '#10b981', padding: '0.5rem 1rem', fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      COMPLETED
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ background: activeTab === 'Resolved' ? '#ecfdf5' : '#eff6ff', color: activeTab === 'Resolved' ? '#10b981' : '#0d9488', padding: '0.75rem', borderRadius: '1rem' }}>
                        <User size={24} />
                      </div>
                      <div>
                        <h3 style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1e293b' }}>{msg.name}</h3>
                        <p style={{ color: activeTab === 'Resolved' ? '#10b981' : '#0d9488', fontSize: '0.85rem', fontWeight: '700' }}>{msg.email}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600' }}>
                        <Clock size={14} />
                        {new Date(msg.created_at).toLocaleString()}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                        <span style={{ background: '#f1f5f9', padding: '0.35rem 0.85rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>
                          {msg.subject || 'General'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #f1f5f9', marginBottom: activeTab === 'Pending' ? '1.5rem' : 0 }}>
                    <p style={{ lineHeight: '1.7', color: '#334155', fontSize: '1.05rem' }}>{msg.message}</p>
                  </div>

                  {activeTab === 'Pending' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleResolve(msg.id)}
                        className="btn btn-primary" 
                        style={{ background: '#10b981', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '1rem', fontSize: '0.9rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
                      >
                        <CheckCircle size={18} /> Mark as Resolved
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageInquiries;

