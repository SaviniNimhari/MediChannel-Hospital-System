import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, Clock, CheckCircle, Users, Activity, 
  TrendingUp, Wallet, ArrowRight, UserCircle, 
  ChevronRight, CalendarDays
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get(`/dashboard/doctor/${user.profile_id}`);
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user.profile_id]);

  if (loading) return <DashboardLayout><div style={{ padding: '2rem', textAlign: 'center' }}>Syncing clinical data...</div></DashboardLayout>;

  const statCards = [
    { label: "Today's Schedule", value: stats?.todayAppointments || 0, icon: Clock, color: '#0d9488', bg: '#eff6ff' },
    { label: "Consultations Completed", value: stats?.completedAppointments || 0, icon: CheckCircle, color: '#10b981', bg: '#ecfdf5' },
    { label: "Upcoming Patients", value: stats?.upcomingAppointments || 0, icon: CalendarDays, color: '#f59e0b', bg: '#fffbeb' },
    { label: "Gross Earnings (Rs.)", value: `Rs. ${stats?.totalEarnings || 0}`, icon: Wallet, color: '#8b5cf6', bg: '#f5f3ff' }
  ];

  return (
    <DashboardLayout>
      <div className="page-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.04em', color: '#1e293b' }}>Clinical Overview</h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Welcome back, Dr. {user.name}. Here is your medical performance summary.</p>
          </div>
          <Link to="/doctor/appointments" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', borderRadius: '1rem', fontWeight: '800' }}>
            Open Full Queue <ChevronRight size={20} />
          </Link>
        </div>

        {/* Analytics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {statCards.map((card, idx) => (
            <div key={idx} className="card card-hover" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid #f1f5f9' }}>
               <div style={{ background: card.bg, color: card.color, padding: '1rem', borderRadius: '1.25rem' }}>
                  <card.icon size={28} />
               </div>
               <div>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{card.label}</p>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1e293b', lineHeight: 1 }}>{card.value}</h3>
               </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
           {/* Upcoming Queue */}
           <div className="card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Activity size={24} color="#0d9488" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Immediate Clinical Queue</h3>
                 </div>
                 <span style={{ background: '#f1f5f9', padding: '0.4rem 0.85rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: '800', color: '#475569' }}>NEXT 10 PATIENTS</span>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Time Slot</th>
                      <th>Reason</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.appointments?.map((app) => (
                      <tr key={app.appointment_id}>
                        <td>
                           <div style={{ fontWeight: '800', color: '#1e293b' }}>{app.patient_name}</div>
                           <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(app.appointment_date).toLocaleDateString()}</div>
                        </td>
                        <td>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0d9488', fontWeight: '700' }}>
                              <Clock size={14} /> {app.appointment_time.substring(0, 5)}
                           </div>
                        </td>
                        <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{app.reason || 'General Consultation'}</td>
                        <td>
                           <Link to="/doctor/appointments" style={{ color: '#0d9488', fontWeight: '800', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              Details <ArrowRight size={14} />
                           </Link>
                        </td>
                      </tr>
                    ))}
                    {(!stats?.appointments || stats.appointments.length === 0) && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                           Your clinical queue is empty for the upcoming period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
           </div>

           {/* Quick Actions / Tips */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', color: 'white' }}>
                 <TrendingUp size={32} style={{ marginBottom: '1.5rem', color: '#38bdf8' }} />
                 <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem' }}>Performance Insight</h3>
                 <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.5rem' }}>You have completed {stats?.completedAppointments} consultations this month. Your average patient satisfaction rating is 4.9/5.0.</p>
                 <button className="btn" style={{ background: '#38bdf8', color: '#0c4a6e', border: 'none', width: '100%', fontWeight: '800' }}>View Analytics Report</button>
              </div>

              <div className="card" style={{ padding: '2rem', border: '1px solid #e0f2fe', background: '#f0f9ff' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <UserCircle size={24} color="#0369a1" />
                    <h4 style={{ fontWeight: '800', color: '#0369a1' }}>Doctor Profile</h4>
                 </div>
                 <p style={{ fontSize: '0.85rem', color: '#075985', marginBottom: '1.5rem' }}>Keep your clinical hours and specialization updated for better patient matching.</p>
                 <Link to="/doctor/profile" style={{ color: '#0369a1', fontWeight: '800', fontSize: '0.85rem', textDecoration: 'underline' }}>Update Profile Settings</Link>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;

