import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import API from '../../api/axios';
import { Activity, RefreshCw, ShieldAlert, ArrowRight, Clock, User, CheckCircle2 } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    document.title = "Database Triggers Audit Logs | MediChannel Admin";
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setRefreshing(true);
    try {
      const res = await API.get('/appointments/audit-logs');
      setLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch trigger audit logs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' };
      case 'Completed':
        return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
      case 'Cancelled':
        return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' };
      default:
        return { bg: '#fffbeb', color: '#d97706', border: '#fde68a' };
    }
  };

  return (
    <DashboardLayout>
      <div className="page-fade-in" style={{ paddingBottom: '3rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #0d9488, #0f766e)', 
                padding: '0.5rem', 
                borderRadius: '0.75rem', 
                color: 'white',
                display: 'flex',
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
              }}>
                <Activity size={24} />
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>
                System Audit Logs
              </h1>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
              Real-time audit trails automatically recorded by PostgreSQL Database Triggers (<code style={{ background: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '0.25rem', fontSize: '0.85rem' }}>trg_after_appointment_update</code>).
            </p>
          </div>

          <button 
            onClick={fetchAuditLogs} 
            disabled={refreshing}
            className="btn btn-secondary" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              borderRadius: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
            {refreshing ? 'Syncing...' : 'Refresh Logs'}
          </button>
        </div>

        {/* Info Banner */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.08), rgba(15, 118, 110, 0.04))', 
          border: '1px solid rgba(13, 148, 136, 0.2)',
          borderRadius: '1rem',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <CheckCircle2 size={24} color="#0d9488" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ margin: 0, fontWeight: '700', color: '#0f766e', fontSize: '0.95rem' }}>
              Database Trigger Protection Active
            </h4>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#475569' }}>
              All appointment status mutations automatically trigger an atomic row insertion into <code style={{ background: 'rgba(255,255,255,0.7)', padding: '0.15rem 0.35rem', borderRadius: '4px' }}>appointment_audit_log</code>.
            </p>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderRadius: '1.25rem' }}>
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Log ID</th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Appt ID</th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Patient & Doctor</th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Status State Transition</th>
                  <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Trigger Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                      <RefreshCw size={24} className="spin" style={{ color: '#0d9488' }} />
                      <p style={{ marginTop: '0.5rem', color: '#64748b', fontWeight: '600' }}>Loading audit logs...</p>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                      <ShieldAlert size={40} color="#cbd5e1" style={{ marginBottom: '0.75rem' }} />
                      <h3 style={{ margin: 0, fontWeight: '700', color: '#475569' }}>No Audit Logs Found</h3>
                      <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        When an appointment status is updated, the PostgreSQL database trigger will log the change here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const oldStyle = getStatusBadge(log.old_status);
                    const newStyle = getStatusBadge(log.new_status);
                    return (
                      <tr key={log.log_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1rem 1.25rem', fontWeight: '800', color: '#0f172a' }}>
                          #{log.log_id}
                        </td>
                        <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: '#0d9488' }}>
                          #{log.appointment_id || 'N/A'}
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <User size={14} color="#64748b" /> {log.patient_name || 'Patient'}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                            Dr. {log.doctor_name || 'Doctor'}
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ 
                              padding: '0.25rem 0.65rem', 
                              borderRadius: '1rem', 
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              backgroundColor: oldStyle.bg,
                              color: oldStyle.color,
                              border: `1px solid ${oldStyle.border}`
                            }}>
                              {log.old_status || 'Initial'}
                            </span>
                            <ArrowRight size={14} color="#94a3b8" />
                            <span style={{ 
                              padding: '0.25rem 0.65rem', 
                              borderRadius: '1rem', 
                              fontSize: '0.75rem',
                              fontWeight: '800',
                              backgroundColor: newStyle.bg,
                              color: newStyle.color,
                              border: `1px solid ${newStyle.border}`
                            }}>
                              {log.new_status}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.25rem', color: '#475569', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600' }}>
                            <Clock size={14} color="#94a3b8" />
                            {new Date(log.changed_at).toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default AuditLogs;
