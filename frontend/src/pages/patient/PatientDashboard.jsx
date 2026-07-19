import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, Clock, CreditCard, User, Activity, ArrowRight, Shield, 
  X, CheckCircle2, MapPin, Stethoscope, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get(`/dashboard/patient/${user.profile_id}`);
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user.profile_id]);

  if (loading) return <DashboardLayout><div style={{ padding: '2rem', textAlign: 'center' }}>Synchronizing your health data...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-fade-in">
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Welcome back, {user.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Here is a summary of your recent medical activity.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, var(--accent) 0%, #1d4ed8 100%)', 
            color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1, color: 'white' }}><Activity size={300} /></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.2' }}>Book Your Next <br />Consultation</h2>
              <p style={{ marginBottom: '2rem', opacity: '0.8', fontSize: '1.1rem', maxWidth: '400px' }}>Access 250+ certified specialists and get instant appointment confirmation.</p>
              <Link to="/patient/book" className="btn" style={{ background: 'white', color: 'var(--accent)', padding: '1rem 2.5rem', border: 'none' }}>
                Book Appointment <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: 'var(--accent-soft)', color: 'var(--accent)', padding: '1.25rem', borderRadius: '1.25rem' }}><Calendar size={32} /></div>
              <div><h3 style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1 }}>{stats?.upcomingCount || 0}</h3><p style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>Upcoming Sessions</p></div>
            </div>
            <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: '#ecfdf5', color: '#10b981', padding: '1.25rem', borderRadius: '1.25rem' }}><Shield size={32} /></div>
              <div><h3 style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1 }}>Verified</h3><p style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>Account Status</p></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div><h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Recent Appointment History</h3><p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status of your last 5 channelings</p></div>
            <Link to="/patient/appointments" style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: '600' }}>View All History</Link>
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Visit Date</th><th>Status</th><th>Notes / Reason</th><th>Action</th></tr>
              </thead>
              <tbody>
                {stats?.recentHistory?.map((app) => (
                  <tr key={app.appointment_id}>
                    <td style={{ fontWeight: '600' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: '0.5rem' }}><Clock size={16} color="var(--text-muted)" /></div>
                        {new Date(app.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        padding: '0.35rem 0.85rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: '700',
                        backgroundColor: app.appointment_status === 'Confirmed' ? '#ecfdf5' : '#f1f5f9',
                        color: app.appointment_status === 'Confirmed' ? '#065f46' : 'var(--text-muted)'
                      }}>{app.appointment_status}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{app.reason || 'Regular Checkup'}</td>
                    <td>
                      <button 
                        onClick={() => setSelectedAppt(app)}
                        className="btn btn-outline" 
                        style={{ padding: '0.4rem 1.25rem', fontSize: '0.8rem', borderRadius: '0.75rem', fontWeight: '700' }}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedAppt && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="page-fade-in card" style={{ width: '500px', padding: 0, overflow: 'hidden' }}>
             <div style={{ background: 'var(--accent)', color: 'white', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <FileText size={20} />
                   <h3 style={{ fontWeight: '800' }}>Appointment Details</h3>
                </div>
                <X style={{ cursor: 'pointer' }} onClick={() => setSelectedAppt(null)} />
             </div>
             
             <div style={{ padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                   <div style={{ background: '#eff6ff', color: 'var(--accent)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                      <Stethoscope size={40} />
                   </div>
                   <h2 style={{ fontSize: '1.5rem', fontWeight: '900' }}>Dr. {selectedAppt.doctor_name}</h2>
                   <p style={{ color: 'var(--accent)', fontWeight: '700', fontSize: '0.9rem', textTransform: 'uppercase' }}>{selectedAppt.specialization}</p>
                </div>

                <div style={{ display: 'grid', gap: '1.25rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8', fontWeight: '600', fontSize: '0.85rem' }}>DATE</span>
                      <span style={{ fontWeight: '800' }}>{new Date(selectedAppt.appointment_date).toDateString()}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8', fontWeight: '600', fontSize: '0.85rem' }}>TIME SLOT</span>
                      <span style={{ fontWeight: '800', color: 'var(--accent)' }}>{selectedAppt.appointment_time.substring(0, 5)}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8', fontWeight: '600', fontSize: '0.85rem' }}>DEPARTMENT</span>
                      <span style={{ fontWeight: '800' }}>{selectedAppt.department_name}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8', fontWeight: '600', fontSize: '0.85rem' }}>STATUS</span>
                      <span style={{ fontWeight: '800', color: '#10b981' }}>{selectedAppt.appointment_status}</span>
                   </div>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1rem' }}>
                   <h4 style={{ fontSize: '0.8rem', fontWeight: '800', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Reason for Visit</h4>
                   <p style={{ color: '#475569', lineHeight: '1.5' }}>{selectedAppt.reason || 'Standard checkup and medical consultation.'}</p>
                </div>

                <button 
                  onClick={() => setSelectedAppt(null)} 
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: '2rem', height: '56px', borderRadius: '1rem', fontWeight: '800' }}
                >
                  Close Summary
                </button>
             </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PatientDashboard;
