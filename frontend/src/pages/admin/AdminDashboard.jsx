import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { Users, UserPlus, Calendar, Building2, CreditCard, Activity, TrendingUp, ArrowUpRight, Database, Server, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/dashboard/admin');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <DashboardLayout><div style={{ padding: '2rem', textAlign: 'center' }}>Loading analysis...</div></DashboardLayout>;

  const statCards = [
    { title: 'Total Patients', value: stats.totalPatients, icon: Users, color: '#0d9488', trend: '+12.5%' },
    { title: 'Active Doctors', value: stats.totalDoctors, icon: UserPlus, color: '#10b981', trend: '+3 new' },
    { title: 'Booked Channels', value: stats.totalAppointments, icon: Calendar, color: '#f59e0b', trend: '+18%' },
    { title: 'Total Revenue', value: `LKR ${stats.totalRevenue}`, icon: CreditCard, color: '#8b5cf6', trend: '+LKR 2.4k' },
  ];

  return (
    <DashboardLayout>
      <div className="page-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Analytics Overview</h1>
            <p style={{ color: 'var(--text-muted)' }}>Real-time metrics for your medical facility.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
             {/* Buttons removed as per user request. Use Sidebar 'Reports' section for analytics. */}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          {statCards.map((stat, i) => (
            <div key={i} className="card stat-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{ background: `${stat.color}15`, color: stat.color, padding: '0.75rem', borderRadius: '1rem' }}>
                  <stat.icon size={24} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', background: '#ecfdf5', padding: '0.25rem 0.6rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: '700' }}>
                  <TrendingUp size={14} /> {stat.trend}
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>{stat.title}</p>
              <h3 style={{ fontSize: '2rem', fontWeight: '800', position: 'relative', zIndex: 1 }}>{stat.value}</h3>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Live Appointments</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Latest scheduling activity</p>
              </div>
              <button onClick={() => navigate('/admin/appointments')} style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: '600', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                View All <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Specialist</th>
                    <th>Date / Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentAppointments?.map((app) => (
                    <tr key={app.appointment_id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{app.patient_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #PA-{app.patient_id}</div>
                      </td>
                      <td style={{ fontWeight: '500' }}>Dr. {app.doctor_name}</td>
                      <td>
                        <div style={{ fontSize: '0.9rem' }}>{new Date(app.appointment_date).toLocaleDateString()}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.appointment_time}</div>
                      </td>
                      <td>
                        <span style={{ 
                          padding: '0.35rem 0.85rem', 
                          borderRadius: '2rem', 
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          backgroundColor: app.appointment_status === 'Confirmed' ? '#ecfdf5' : app.appointment_status === 'Pending' ? '#fffbeb' : '#fef2f2',
                          color: app.appointment_status === 'Confirmed' ? '#065f46' : app.appointment_status === 'Pending' ? '#92400e' : '#991b1b'
                        }}>
                          {app.appointment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card" style={{ background: 'var(--primary)', color: 'white', position: 'relative', overflow: 'hidden' }}>
             <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1 }}>
               <Database size={200} color="white" />
             </div>
             <div style={{ position: 'relative' }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>PostgreSQL Engine</h3>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#10b981', fontSize: '0.85rem', fontWeight: '700' }}>
                 <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                 {stats.dbMetrics.active_connections} Active Connections
               </div>
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Server size={20} color="var(--accent)" />
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    <p style={{ fontWeight: '700', color: 'white', opacity: 1 }}>Engine Version</p>
                    {stats.dbMetrics.pg_version.split(',')[0]}
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Clock size={20} color="#f59e0b" />
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    <p style={{ fontWeight: '700', color: 'white', opacity: 1 }}>Server Uptime</p>
                    Online since {new Date(stats.dbMetrics.uptime).toLocaleString()}
                  </div>
                </div>

                {[
                  { label: 'Relational Records', value: stats.dbMetrics.users_count, icon: Users },
                  { label: 'Medical Appointments', value: stats.dbMetrics.appointments_count, icon: Calendar },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                       <item.icon size={16} style={{ opacity: 0.6 }} />
                       <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{item.label}</span>
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{item.value}</span>
                  </div>
                ))}
             </div>

             <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                   <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Database Disk Size</span>
                   <span style={{ fontWeight: '800', color: 'var(--accent)' }}>{stats.dbMetrics.db_size}</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                  <div style={{ height: '100%', width: '45%', background: 'var(--accent)', borderRadius: '10px' }}></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

